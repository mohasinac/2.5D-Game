import { useState, useEffect, useRef } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, alpha } from "@/styles/theme";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import WhatsAppStyleImageEditor from "./WhatsAppStyleImageEditor";
import type { WhatsAppStyleImageEditorRef } from "./WhatsAppStyleImageEditor";
import ImageCropper from "./ImageCropper";
import type { ImageCropperRef } from "./ImageCropper";

interface AssetCrudPageProps {
  collectionName: string; title: string; icon: string; description: string;
  acceptTypes?: string; isAudio?: boolean; tags?: string[]; tagLabel?: string;
}
interface Asset { id:string; name:string; url:string; storagePath:string; tag?:string; createdAt?:any; }

export function AssetCrudPage({
  collectionName, title, icon, description,
  acceptTypes = "image/png,image/jpeg,image/gif,image/webp", isAudio = false, tags = [], tagLabel = "Tag",
}: AssetCrudPageProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState("all");
  const [form, setForm] = useState({ name:"", tag:tags[0]??"", file:null as File|null });
  const [rawImageUrl, setRawImageUrl] = useState("");
  const [imageEditorMode, setImageEditorMode] = useState<"whatsapp" | "crop" | null>(null);
  const [imagePosition, setImagePosition] = useState({ x:0, y:0, scale:1, rotation:0 });
  const [fileInputKey, setFileInputKey] = useState(0);
  const cropperRef = useRef<ImageCropperRef>(null);
  const whatsappRef = useRef<WhatsAppStyleImageEditorRef>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, collectionName));
      setAssets(snap.docs.map(d => ({ id:d.id, ...d.data() } as Asset)));
    } catch { toast.error("Failed to load assets"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAssets(); }, [collectionName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, file, name:f.name||file.name.replace(/\.[^.]+$/,"") }));
    if (!isAudio) {
      const reader = new FileReader();
      reader.onload = ev => {
        setRawImageUrl(ev.target?.result as string);
        // GIFs skip the editor so animation is preserved end-to-end.
        // Static images go through the WhatsApp-style editor for cropping / positioning.
        const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
        setImageEditorMode(isGif ? null : "whatsapp");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageEditorSave = async () => {
    try {
      if (imageEditorMode === "crop" && cropperRef.current) {
        const blob = await cropperRef.current.getCroppedImage();
        const croppedFile = new File([blob], form.file?.name ?? "cropped.jpg", { type:"image/jpeg" });
        setForm(f => ({ ...f, file:croppedFile }));
      } else if (imageEditorMode === "whatsapp" && whatsappRef.current) {
        const blob = await whatsappRef.current.getCanvasBlob();
        const editedFile = new File([blob], form.file?.name ?? "edited.jpg", { type:"image/jpeg" });
        setForm(f => ({ ...f, file:editedFile }));
      }
    } catch {
      toast.error("Failed to process image");
    }
    setImageEditorMode(null);
  };

  const handleUpload = async () => {
    if (!form.file || !form.name.trim()) { toast.error("Name and file are required"); return; }
    setUploading(true);
    try {
      const storagePath = `assets/${collectionName}/${Date.now()}_${form.file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, form.file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, collectionName), { name:form.name.trim(), url, storagePath, tag:form.tag||null, createdAt:serverTimestamp() });
      toast.success(`Uploaded ${form.name}`);
      setForm({ name:"", tag:tags[0]??"", file:null });
      setFileInputKey(k => k + 1);
      setRawImageUrl("");
      fetchAssets();
    } catch (err) { console.error(err); toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleDelete = async (asset: Asset) => {
    setDeletingId(asset.id);
    try {
      if (asset.storagePath) await deleteObject(ref(storage, asset.storagePath)).catch(()=>{});
      await deleteDoc(doc(db, collectionName, asset.id));
      setAssets(prev => prev.filter(a => a.id !== asset.id));
      toast.success(`Deleted ${asset.name}`);
    } catch { toast.error("Delete failed"); }
    finally { setDeletingId(null); }
  };

  const filtered = selectedTag === "all" ? assets : assets.filter(a => a.tag === selectedTag);

  return (
    <div style={{ padding:24, maxWidth:900, margin:"0 auto" }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text, display:"flex", alignItems:"center", gap:10 }}>
          <span>{icon}</span>{title}
        </h1>
        <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>{description}</p>
      </div>

      {/* Upload form */}
      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:20 }}>
        <div className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Upload New Asset</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12 }}>
          <div>
            <label className="block text-xs text-muted mb-1.5">Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} placeholder="Asset name" className="w-full px-3 py-2 bg-bg3 border border-border rounded-lg text-text text-sm" />
          </div>
          {tags.length > 0 && (
            <div>
              <label className="block text-xs text-muted mb-1.5">{tagLabel}</label>
              <SearchableSelect
                value={form.tag}
                options={tags.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
                onChange={v => setForm(f => ({...f, tag: v}))}
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 13, cursor: "pointer" }}
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-muted mb-1.5">File *</label>
            <label style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8, background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 12px", fontSize:13, color:C.muted }}>
              <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{form.file ? form.file.name : "Choose file..."}</span>
              <input key={fileInputKey} type="file" accept={acceptTypes} onChange={handleFileChange} style={{ display:"none" }} />
            </label>
            {form.file && !isAudio && (
              <div style={{ display:"flex", gap:6, marginTop:6 }}>
                <button type="button" onClick={() => setImageEditorMode("whatsapp")} style={{ padding:"3px 10px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:6, fontSize:11, color:C.muted, cursor:"pointer" }}>🖼 Reposition</button>
                <button type="button" onClick={() => setImageEditorMode("crop")} style={{ padding:"3px 10px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:6, fontSize:11, color:C.muted, cursor:"pointer" }}>✂️ Crop</button>
              </div>
            )}
          </div>
        </div>
        <button onClick={handleUpload} disabled={uploading||!form.file||!form.name.trim()} style={{ padding:"8px 20px", background:C.blue, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity: uploading||!form.file||!form.name.trim() ? 0.5 : 1 }}>
          {uploading ? "Uploading..." : "Upload Asset"}
        </button>
      </div>

      {/* Image editor modal */}
      {imageEditorMode && rawImageUrl && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:1000, overflowY:"auto", padding:"20px 16px" }}>
          <div style={{ width:"100%", maxWidth: imageEditorMode === "whatsapp" ? "fit-content" : 420 }}>
            {imageEditorMode === "whatsapp" && (
              <WhatsAppStyleImageEditor
                ref={whatsappRef}
                imageUrl={rawImageUrl}
                onPositionChange={setImagePosition}
                initialPosition={imagePosition}
                circleSize={Math.min(320, window.innerWidth - 80)}
                onSave={handleImageEditorSave}
                onCancel={() => setImageEditorMode(null)}
              />
            )}
            {imageEditorMode === "crop" && (
              <div style={{ background:C.bg2, borderRadius:12, padding:16 }}>
                <ImageCropper ref={cropperRef} imageUrl={rawImageUrl} targetWidth={300} targetHeight={300} />
                <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:12 }}>
                  <button onClick={() => setImageEditorMode(null)} style={{ padding:"6px 16px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontSize:13, cursor:"pointer" }}>Cancel</button>
                  <button onClick={handleImageEditorSave} style={{ padding:"6px 16px", background:C.blue, border:"none", borderRadius:8, color:C.white, fontSize:13, fontWeight:600, cursor:"pointer" }}>Apply Crop</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tag filter */}
      {tags.length > 0 && (
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          <button onClick={() => setSelectedTag("all")} style={{ padding:"4px 12px", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer", background: selectedTag==="all" ? C.text : "transparent", color: selectedTag==="all" ? C.bg0 : C.muted, border:`1px solid ${selectedTag==="all" ? C.text : C.border}` }}>
            All ({assets.length})
          </button>
          {tags.map(t => (
            <button key={t} onClick={() => setSelectedTag(t)} style={{ padding:"4px 12px", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer", textTransform:"capitalize", background: selectedTag===t ? C.text : "transparent", color: selectedTag===t ? C.bg0 : C.muted, border:`1px solid ${selectedTag===t ? C.text : C.border}` }}>
              {t} ({assets.filter(a => a.tag===t).length})
            </button>
          ))}
        </div>
      )}

      {/* Asset grid */}
      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ background:C.bg2, borderRadius:12, height:160 }} className="pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"64px 0", color:C.faint }}>
          <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
          <p>No assets yet. Upload your first {title.toLowerCase()} asset.</p>
        </div>
      ) : isAudio ? (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(asset => (
            <div key={asset.id} style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:14, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:22 }}>🎵</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ color:C.text, fontSize:13, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{asset.name}</p>
                {asset.tag && <p style={{ color:C.faint, fontSize:11, textTransform:"capitalize" }}>{asset.tag}</p>}
              </div>
              <audio controls src={asset.url} style={{ height:32 }} />
              <button onClick={() => handleDelete(asset)} disabled={deletingId===asset.id} style={{ color:C.red, background:"none", border:"none", fontSize:12, cursor:"pointer", opacity:deletingId===asset.id?0.5:1 }}>
                {deletingId===asset.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {filtered.map(asset => (
            <div key={asset.id} style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", position:"relative" }}>
              <div style={{ aspectRatio:"1/1", background:C.bg1, position:"relative" }}>
                <img src={asset.url} alt={asset.name} style={{ width:"100%", height:"100%", objectFit:"contain", padding:8 }} loading="lazy" />
                <button
                  onClick={() => handleDelete(asset)} disabled={deletingId===asset.id}
                  style={{ position:"absolute", top:6, right:6, width:24, height:24, background:alpha(C.red, 0.87), color:C.white, borderRadius:4, border:"none", fontSize:12, cursor:"pointer", opacity:deletingId===asset.id?0.5:1, display:"flex", alignItems:"center", justifyContent:"center" }}
                >{deletingId===asset.id?"...":"×"}</button>
              </div>
              <div style={{ padding:8 }}>
                <p style={{ color:C.text, fontSize:11, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{asset.name}</p>
                {asset.tag && <p style={{ color:C.faint, fontSize:10, textTransform:"capitalize", marginTop:2 }}>{asset.tag}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

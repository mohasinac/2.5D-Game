import { useState, useEffect, useRef } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import toast from "react-hot-toast";
import { alpha } from "@/styles/theme";
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
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-theme-text flex items-center gap-2.5">
          <span>{icon}</span>{title}
        </h1>
        <p className="text-theme-faint text-[13px] mt-1">{description}</p>
      </div>

      {/* Upload form */}
      <div className="bg-bg2 border border-border-c rounded-2xl p-5 mb-5">
        <div className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Upload New Asset</div>
        <div className="grid grid-cols-3 gap-2.5 mb-3">
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
                className="w-full bg-bg3 border border-border rounded-lg text-text text-[13px] cursor-pointer"
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-muted mb-1.5">File *</label>
            <label className="cursor-pointer flex items-center gap-2 bg-bg3 border border-border-c rounded-lg py-[7px] px-3 text-[13px] text-theme-muted">
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{form.file ? form.file.name : "Choose file..."}</span>
              <input key={fileInputKey} type="file" accept={acceptTypes} onChange={handleFileChange} className="hidden" />
            </label>
            {form.file && !isAudio && (
              <div className="flex gap-1.5 mt-1.5">
                <button type="button" onClick={() => setImageEditorMode("whatsapp")} className="py-[3px] px-2.5 bg-bg3 border border-border-c rounded text-[11px] text-theme-muted cursor-pointer">🖼 Reposition</button>
                <button type="button" onClick={() => setImageEditorMode("crop")} className="py-[3px] px-2.5 bg-bg3 border border-border-c rounded text-[11px] text-theme-muted cursor-pointer">✂️ Crop</button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading||!form.file||!form.name.trim()}
          className={`py-2 px-5 bg-theme-blue text-white rounded-lg text-[13px] font-medium border-none cursor-pointer ${uploading||!form.file||!form.name.trim() ? "opacity-50" : "opacity-100"}`}
        >
          {uploading ? "Uploading..." : "Upload Asset"}
        </button>
      </div>

      {/* Image editor modal */}
      {imageEditorMode && rawImageUrl && (
        <div className="fixed inset-0 bg-black/85 flex items-start justify-center z-[1000] overflow-y-auto py-5 px-4">
          <div className={`w-full ${imageEditorMode === "whatsapp" ? "max-w-fit" : "max-w-[420px]"}`}>
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
              <div className="bg-bg2 rounded-xl p-4">
                <ImageCropper ref={cropperRef} imageUrl={rawImageUrl} targetWidth={300} targetHeight={300} />
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => setImageEditorMode(null)} className="py-1.5 px-4 bg-bg3 border border-border-c rounded-lg text-theme-muted text-[13px] cursor-pointer">Cancel</button>
                  <button onClick={handleImageEditorSave} className="py-1.5 px-4 bg-theme-blue border-none rounded-lg text-white text-[13px] font-semibold cursor-pointer">Apply Crop</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectedTag("all")}
            className={`py-1 px-3 rounded-lg text-xs font-medium cursor-pointer border ${selectedTag==="all" ? "bg-theme-text text-bg0 border-theme-text" : "bg-transparent text-theme-muted border-border-c"}`}
          >
            All ({assets.length})
          </button>
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`py-1 px-3 rounded-lg text-xs font-medium cursor-pointer capitalize border ${selectedTag===t ? "bg-theme-text text-bg0 border-theme-text" : "bg-transparent text-theme-muted border-border-c"}`}
            >
              {t} ({assets.filter(a => a.tag===t).length})
            </button>
          ))}
        </div>
      )}

      {/* Asset grid */}
      {loading ? (
        <div className="grid grid-cols-4 gap-[14px]">
          {[1,2,3,4].map(i => <div key={i} className="bg-bg2 rounded-xl h-40 pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-theme-faint">
          <div className="text-[28px] mb-2">{icon}</div>
          <p>No assets yet. Upload your first {title.toLowerCase()} asset.</p>
        </div>
      ) : isAudio ? (
        <div className="flex flex-col gap-2.5">
          {filtered.map(asset => (
            <div key={asset.id} className="bg-bg2 border border-border-c rounded-xl p-[14px] flex items-center gap-3">
              <div className="text-[22px]">🎵</div>
              <div className="flex-1 min-w-0">
                <p className="text-theme-text text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{asset.name}</p>
                {asset.tag && <p className="text-theme-faint text-[11px] capitalize">{asset.tag}</p>}
              </div>
              <audio controls src={asset.url} className="h-8" />
              <button
                onClick={() => handleDelete(asset)}
                disabled={deletingId===asset.id}
                className={`text-theme-red bg-transparent border-none text-xs cursor-pointer ${deletingId===asset.id ? "opacity-50" : "opacity-100"}`}
              >
                {deletingId===asset.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-[14px]">
          {filtered.map(asset => (
            <div key={asset.id} className="bg-bg2 border border-border-c rounded-xl overflow-hidden relative">
              <div className="aspect-square bg-bg1 relative">
                <img src={asset.url} alt={asset.name} className="w-full h-full object-contain p-2" loading="lazy" />
                <button
                  onClick={() => handleDelete(asset)} disabled={deletingId===asset.id}
                  className={`absolute top-1.5 right-1.5 w-6 h-6 border-none rounded text-xs cursor-pointer flex items-center justify-center text-white ${deletingId===asset.id ? "opacity-50" : "opacity-100"}`}
                  style={{ background: alpha("#ef4444", 0.87) }}
                >{deletingId===asset.id?"...":"×"}</button>
              </div>
              <div className="p-2">
                <p className="text-theme-text text-[11px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{asset.name}</p>
                {asset.tag && <p className="text-theme-faint text-[10px] capitalize mt-0.5">{asset.tag}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";

export function StadiumEditPage() {
  const { id } = useParams<{ id:string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stadium, setStadium] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, COLLECTIONS.STADIUMS, id))
      .then(snap => {
        if (!snap.exists()) { toast.error("Stadium not found"); return; }
        const data = { id:snap.id, ...snap.data() };
        setStadium(data);
        setImagePreview((data as any).imageUrl ?? "");
      })
      .catch(() => toast.error("Load failed"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: any) => setStadium((s: any) => s ? { ...s, [k]:v } : s);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!stadium || !id) return;
    setSaving(true);
    try {
      let imageUrl = stadium.imageUrl ?? "";
      if (imageFile) {
        const r = ref(storage, `stadiums/${Date.now()}_${imageFile.name}`);
        await uploadBytes(r, imageFile);
        imageUrl = await getDownloadURL(r);
      }
      const { id:_id, ...data } = stadium;
      await updateDoc(doc(db, COLLECTIONS.STADIUMS, id), { ...data, imageUrl, updatedAt:serverTimestamp() });
      toast.success("Stadium saved!");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ padding:24, display:"flex", justifyContent:"center" }}>
      <div className="spin" style={{ width:32, height:32, border:`2px solid ${C.orange}`, borderTopColor:"transparent", borderRadius:"50%" }} />
    </div>
  );
  if (!stadium) return <div style={{ padding:24, color:C.faint }}>Stadium not found</div>;

  return (
    <div style={{ padding:24, maxWidth:560, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <Link to="/admin/stadiums" style={{ color:C.faint, fontSize:13, textDecoration:"none" }}>← Stadiums</Link>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text, marginTop:6 }}>{stadium.name}</h1>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ padding:"8px 20px", background:C.orange, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity:saving?0.5:1 }}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:24, display:"flex", flexDirection:"column", gap:18 }}>
        <div>
          <label style={S.label}>Name</label>
          <input type="text" value={stadium.name??""} onChange={e => set("name",e.target.value)} style={S.input} />
        </div>
        <div>
          <label style={S.label}>Description</label>
          <textarea value={stadium.description??""} onChange={e => set("description",e.target.value)} rows={3} style={{ ...S.input, resize:"none", lineHeight:1.5, fontFamily:"inherit" }} />
        </div>
        <div>
          <label style={S.label}>Max Players</label>
          <select value={stadium.capacity??4} onChange={e => set("capacity",+e.target.value)} style={{ ...S.input, cursor:"pointer" }}>
            {[2,3,4].map(n => <option key={n} value={n}>{n} players</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Image</label>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ width:"100%", height:160, objectFit:"cover", borderRadius:12 }} />}
            <label style={{ cursor:"pointer", display:"inline-block", padding:"6px 16px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.muted }}>
              {imagePreview ? "Replace Image" : "Upload Image"}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display:"none" }} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

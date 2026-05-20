import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";

export function StadiumCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:"", description:"", capacity:4 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]:v }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    setSaving(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const r = ref(storage, `stadiums/${Date.now()}_${imageFile.name}`);
        await uploadBytes(r, imageFile);
        imageUrl = await getDownloadURL(r);
      }
      const docRef = await addDoc(collection(db, COLLECTIONS.STADIUMS), { ...form, name:form.name.trim(), imageUrl, createdAt:serverTimestamp() });
      toast.success(`Created ${form.name}`);
      navigate(`/admin/stadiums/edit/${docRef.id}`);
    } catch { toast.error("Failed to create stadium"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ padding:24, maxWidth:560, margin:"0 auto" }}>
      <div style={{ marginBottom:20 }}>
        <Link to="/admin/stadiums" style={{ color:C.faint, fontSize:13, textDecoration:"none" }}>← Stadiums</Link>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text, marginTop:8 }}>New Stadium</h1>
      </div>

      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:24, display:"flex", flexDirection:"column", gap:18 }}>
        <div>
          <label style={S.label}>Stadium Name *</label>
          <input type="text" value={form.name} onChange={e => set("name",e.target.value)} placeholder="e.g. Lightning Stadium" style={S.input} />
        </div>
        <div>
          <label style={S.label}>Description</label>
          <textarea value={form.description} onChange={e => set("description",e.target.value)} rows={3} placeholder="Describe this stadium..." style={{ ...S.input, resize:"none", lineHeight:1.5, fontFamily:"inherit" }} />
        </div>
        <div>
          <label style={S.label}>Max Players</label>
          <select value={form.capacity} onChange={e => set("capacity",+e.target.value)} style={{ ...S.input, cursor:"pointer" }}>
            {[2,3,4].map(n => <option key={n} value={n}>{n} players</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Stadium Image</label>
          <div style={{ border:`2px dashed ${C.border}`, borderRadius:12, padding:24, textAlign:"center" }}>
            {imagePreview ? (
              <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"center" }}>
                <img src={imagePreview} alt="Preview" style={{ width:"100%", height:160, objectFit:"cover", borderRadius:8 }} />
                <button onClick={() => { setImageFile(null); setImagePreview(""); }} style={{ fontSize:12, color:C.red, background:"none", border:"none", cursor:"pointer" }}>Remove</button>
              </div>
            ) : (
              <label style={{ cursor:"pointer" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🏟️</div>
                <p style={{ color:C.muted, fontSize:13 }}>Click to upload stadium image</p>
                <p style={{ color:C.faint, fontSize:11, marginTop:4 }}>JPG or PNG, landscape orientation recommended</p>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display:"none" }} />
              </label>
            )}
          </div>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
        <Link to="/admin/stadiums" style={{ padding:"8px 18px", border:`1px solid ${C.border}`, color:C.muted, borderRadius:8, fontSize:13, textDecoration:"none" }}>Cancel</Link>
        <button onClick={handleSave} disabled={saving||!form.name.trim()} style={{ padding:"8px 20px", background:C.orange, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity: saving||!form.name.trim() ? 0.5 : 1 }}>
          {saving ? "Creating..." : "Create Stadium"}
        </button>
      </div>
    </div>
  );
}

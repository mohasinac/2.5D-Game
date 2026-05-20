import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";
import { DEFAULT_ARENA_CONFIG, initializeWallConfig } from "@/types/arenaConfigNew";
import type { ArenaShape, ArenaTheme } from "@/types/arenaConfigNew";

const THEMES = ["metrocity","forest","mountains","grasslands","desert","sea","futuristic","prehistoric","safari","riverbank"];

export function ArenaCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:"", shape:"circle" as "circle"|"rectangle", theme:"metrocity", width:1080, height:1080 });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]:v }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ARENAS), {
        ...DEFAULT_ARENA_CONFIG,
        name: form.name.trim(),
        shape: form.shape as ArenaShape,
        theme: form.theme as ArenaTheme,
        wall: initializeWallConfig(form.shape as ArenaShape),
        width: form.width, height: form.height,
        obstacles: [], waterBodies: [], speedPaths: [], turrets: [], portals: [], pits: [],
        createdAt: serverTimestamp(),
      });
      toast.success(`Created ${form.name}`);
      navigate(`/admin/arenas/edit/${docRef.id}`);
    } catch (err) { console.error(err); toast.error("Failed to create arena"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ padding:24, maxWidth:560, margin:"0 auto" }}>
      <div style={{ marginBottom:20 }}>
        <Link to="/admin/arenas" style={{ color:C.faint, fontSize:13, textDecoration:"none" }}>← Arenas</Link>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text, marginTop:8 }}>New Arena</h1>
      </div>

      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:24, display:"flex", flexDirection:"column", gap:18 }}>
        <div>
          <label style={S.label}>Arena Name *</label>
          <input type="text" value={form.name} onChange={e => set("name",e.target.value)} placeholder="e.g. Crystal Colosseum" style={S.input} />
        </div>

        <div>
          <label style={S.label}>Shape</label>
          <div style={{ display:"flex", gap:10 }}>
            {(["circle","rectangle"] as const).map(shape => (
              <button key={shape} onClick={() => set("shape",shape)} style={{
                flex:1, padding:"10px", borderRadius:10, fontSize:13, fontWeight:500, cursor:"pointer", textTransform:"capitalize",
                background: form.shape===shape ? C.purple+"22" : "transparent",
                border: `2px solid ${form.shape===shape ? C.purple : C.border}`,
                color: form.shape===shape ? C.text : C.muted,
              }}>
                {shape==="circle" ? "⭕" : "▬"} {shape}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={S.label}>Theme</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
            {THEMES.map(theme => (
              <button key={theme} onClick={() => set("theme",theme)} style={{
                padding:"6px 4px", borderRadius:8, fontSize:11, fontWeight:500, cursor:"pointer", textTransform:"capitalize",
                background: form.theme===theme ? C.purple+"22" : "transparent",
                border: `1px solid ${form.theme===theme ? C.purple : C.border}`,
                color: form.theme===theme ? C.text : C.faint,
              }}>{theme}</button>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={S.label}>Width (px)</label>
            <input type="number" min={400} max={2000} step={40} value={form.width} onChange={e => set("width",+e.target.value)} style={S.input} />
          </div>
          <div>
            <label style={S.label}>Height (px)</label>
            <input type="number" min={400} max={2000} step={40} value={form.height} onChange={e => set("height",+e.target.value)} style={S.input} />
          </div>
        </div>

        <p style={{ fontSize:12, color:C.faint }}>Arena will be created with empty feature configuration. You can add obstacles, water bodies, speed paths, and more in the editor.</p>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
        <Link to="/admin/arenas" style={{ padding:"8px 18px", border:`1px solid ${C.border}`, color:C.muted, borderRadius:8, fontSize:13, textDecoration:"none" }}>Cancel</Link>
        <button onClick={handleSave} disabled={saving||!form.name.trim()} style={{ padding:"8px 20px", background:C.purple, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity: saving||!form.name.trim() ? 0.5 : 1 }}>
          {saving ? "Creating..." : "Create Arena"}
        </button>
      </div>
    </div>
  );
}

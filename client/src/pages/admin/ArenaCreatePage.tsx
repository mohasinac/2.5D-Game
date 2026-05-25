import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";
import { DEFAULT_ARENA_CONFIG, initializeWallConfig } from "@/types/arenaConfigNew";
import type { ArenaShape, ArenaTheme } from "@/types/arenaConfigNew";
import { PX_PER_CM_BASE } from "@/constants/units";
import { useArenaShapeDefs } from "@/hooks/useArenaShapeDefs";
import { useArenaThemeDefs } from "@/hooks/useArenaThemeDefs";

// Fallback in case Firestore defs aren't loaded yet
const FALLBACK_THEMES = [
  "metrocity","forest","mountains","grasslands","desert","sea",
  "futuristic","prehistoric","safari","riverbank","volcano","ice",
  "space","neon","underwater","jungle",
];

const SHAPE_ICONS: Record<string, string> = {
  circle:"⭕", square:"⬛", triangle:"🔺", pentagon:"⬠", hexagon:"⬡",
  heptagon:"⬠", octagon:"🔷", star3:"✦", star4:"✦", star5:"⭐",
  star6:"✡", star7:"✦", star8:"✦", rectangle:"▬", stadium:"🏟",
};

const FALLBACK_SHAPES: { value: string; label: string }[] = [
  { value: "circle",    label: "Circle" },
  { value: "square",    label: "Square" },
  { value: "triangle",  label: "Triangle" },
  { value: "pentagon",  label: "Pentagon" },
  { value: "hexagon",   label: "Hexagon" },
  { value: "heptagon",  label: "Heptagon" },
  { value: "octagon",   label: "Octagon" },
  { value: "star3",     label: "Star 3" },
  { value: "star4",     label: "Star 4" },
  { value: "star5",     label: "Star 5" },
  { value: "star6",     label: "Star 6" },
  { value: "star7",     label: "Star 7" },
  { value: "star8",     label: "Star 8" },
  { value: "rectangle", label: "Rectangle" },
  { value: "stadium",   label: "Stadium" },
];

export function ArenaCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:"", shape:"circle" as ArenaShape, theme:"metrocity", widthCm:45, heightCm:45 });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]:v }));

  const { items: shapeDefs } = useArenaShapeDefs();
  const { items: themeDefs } = useArenaThemeDefs();

  const shapes = shapeDefs.length > 0
    ? shapeDefs.map(s => ({ value: s.id, label: s.label }))
    : FALLBACK_SHAPES;
  const themes = themeDefs.length > 0
    ? themeDefs.map(t => t.id)
    : FALLBACK_THEMES;

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    setSaving(true);
    try {
      const widthPx  = Math.round(form.widthCm  * PX_PER_CM_BASE);
      const heightPx = Math.round(form.heightCm * PX_PER_CM_BASE);
      const docRef = await addDoc(collection(db, COLLECTIONS.ARENAS), {
        ...DEFAULT_ARENA_CONFIG,
        name: form.name.trim(),
        shape: form.shape as ArenaShape,
        theme: form.theme as ArenaTheme,
        wall: initializeWallConfig(form.shape as ArenaShape),
        width: widthPx, height: heightPx,
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
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
            {shapes.map(s => (
              <button key={s.value} onClick={() => set("shape", s.value as ArenaShape)} style={{
                padding:"8px 4px", borderRadius:8, fontSize:11, fontWeight:500, cursor:"pointer",
                background: form.shape===s.value ? C.purple+"22" : "transparent",
                border: `1px solid ${form.shape===s.value ? C.purple : C.border}`,
                color: form.shape===s.value ? C.text : C.muted,
                display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              }}>
                <span style={{ fontSize:16 }}>{SHAPE_ICONS[s.value] ?? "⬡"}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={S.label}>Theme</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
            {themes.map(theme => (
              <button key={theme} onClick={() => set("theme", theme)} style={{
                padding:"6px 4px", borderRadius:8, fontSize:11, fontWeight:500, cursor:"pointer", textTransform:"capitalize",
                background: form.theme===theme ? C.purple+"22" : "transparent",
                border: `1px solid ${form.theme===theme ? C.purple : C.border}`,
                color: form.theme===theme ? C.text : C.faint,
              }}>{theme}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={S.label}>Size (cm) — Width × Height</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:8, alignItems:"center" }}>
            <input type="number" min={10} max={100} step={1} value={form.widthCm}
              onChange={e => set("widthCm", Math.max(10, +e.target.value))} style={{ ...S.input, textAlign:"right" as const }} />
            <span style={{ color:C.faint, fontSize:13 }}>×</span>
            <input type="number" min={10} max={100} step={1} value={form.heightCm}
              onChange={e => set("heightCm", Math.max(10, +e.target.value))} style={{ ...S.input, textAlign:"right" as const }} />
          </div>
          <p style={{ fontSize:11, color:C.faint, marginTop:4 }}>
            Stored as {Math.round(form.widthCm * PX_PER_CM_BASE)} × {Math.round(form.heightCm * PX_PER_CM_BASE)} px internally
          </p>
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

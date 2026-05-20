import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";

const THEMES = ["metrocity","forest","mountains","grasslands","desert","sea","futuristic","prehistoric","safari","riverbank"];
type Tab = "basics"|"obstacles"|"water"|"speedpaths"|"turrets"|"portals"|"pits";
const TABS: { id:Tab; label:string; icon:string }[] = [
  { id:"basics", label:"Basics", icon:"⚙️" },
  { id:"obstacles", label:"Obstacles", icon:"🪨" },
  { id:"water", label:"Water Bodies", icon:"💧" },
  { id:"speedpaths", label:"Speed Paths", icon:"⚡" },
  { id:"turrets", label:"Turrets", icon:"🔫" },
  { id:"portals", label:"Portals", icon:"🌀" },
  { id:"pits", label:"Pits", icon:"🕳️" },
];
const FIELD_MAP: Record<Tab, { field:string; label:string; defaultItem:object }> = {
  basics:{ field:"", label:"", defaultItem:{} },
  obstacles:{ field:"obstacles", label:"Obstacle", defaultItem:{ type:"rock", x:540, y:540, radius:30 } },
  water:{ field:"waterBodies", label:"Water Body", defaultItem:{ type:"center", x:540, y:540, radius:80, liquid:"water", spinDecayMultiplier:2 } },
  speedpaths:{ field:"speedPaths", label:"Speed Path", defaultItem:{ type:"loop", x:540, y:540, radius:120, speedBoost:1.5 } },
  turrets:{ field:"turrets", label:"Turret", defaultItem:{ x:200, y:200, fireRate:2, projectileType:"bullet", damage:10 } },
  portals:{ field:"portals", label:"Portal", defaultItem:{ x:200, y:200, linkedPortalId:"", radius:40, teleportDelay:1 } },
  pits:{ field:"pits", label:"Pit", defaultItem:{ x:540, y:540, radius:60 } },
};

export function ArenaEditPage() {
  const { id } = useParams<{ id:string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("basics");
  const [arena, setArena] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, COLLECTIONS.ARENAS, id))
      .then(snap => { if (!snap.exists()) { toast.error("Arena not found"); return; } setArena({ id:snap.id, ...snap.data() }); })
      .catch(() => toast.error("Load failed"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key: string, value: any) => setArena((a: any) => a ? { ...a, [key]:value } : a);
  const addItem = (field: string, item: object) =>
    setArena((a: any) => ({ ...a, [field]:[...(a[field]??[]), { id:`${field}_${Date.now()}`, ...item }] }));
  const removeItem = (field: string, itemId: string) =>
    setArena((a: any) => ({ ...a, [field]:(a[field]??[]).filter((x: any) => x.id !== itemId) }));

  const handleSave = async () => {
    if (!arena || !id) return;
    setSaving(true);
    try {
      const { id:_id, ...data } = arena;
      await updateDoc(doc(db, COLLECTIONS.ARENAS, id), { ...data, updatedAt:serverTimestamp() });
      toast.success("Arena saved!");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ padding:24, display:"flex", justifyContent:"center" }}>
      <div className="spin" style={{ width:32, height:32, border:`2px solid ${C.purple}`, borderTopColor:"transparent", borderRadius:"50%" }} />
    </div>
  );
  if (!arena) return <div style={{ padding:24, color:C.faint }}>Arena not found</div>;

  return (
    <div style={{ padding:24, maxWidth:900, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <Link to="/admin/arenas" style={{ color:C.faint, fontSize:13, textDecoration:"none" }}>← Arenas</Link>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text, marginTop:6 }}>{arena.name}</h1>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ padding:"8px 20px", background:C.purple, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity:saving?0.5:1 }}>
          {saving ? "Saving..." : "Save Arena"}
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:C.bg2, borderRadius:12, padding:4, border:`1px solid ${C.border}`, overflowX:"auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display:"flex", alignItems:"center", gap:6, padding:"7px 12px", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", border:"none",
            background: tab===t.id ? C.purple : "transparent",
            color: tab===t.id ? C.white : C.muted,
          }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
        {/* Basics */}
        {tab === "basics" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth:440 }}>
            <div>
              <label style={S.label}>Arena Name</label>
              <input type="text" value={arena.name??""} onChange={e => set("name",e.target.value)} style={S.input} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={S.label}>Shape</label>
                <select value={arena.shape??"circle"} onChange={e => set("shape",e.target.value)} style={{ ...S.input, cursor:"pointer" }}>
                  <option value="circle">Circle</option>
                  <option value="rectangle">Rectangle</option>
                </select>
              </div>
              <div>
                <label style={S.label}>Theme</label>
                <select value={arena.theme??"metrocity"} onChange={e => set("theme",e.target.value)} style={{ ...S.input, cursor:"pointer" }}>
                  {THEMES.map(t => <option key={t} value={t} style={{ textTransform:"capitalize" }}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={S.label}>Width (px)</label>
                <input type="number" value={arena.width??1080} onChange={e => set("width",+e.target.value)} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Height (px)</label>
                <input type="number" value={arena.height??1080} onChange={e => set("height",+e.target.value)} style={S.input} />
              </div>
            </div>
          </div>
        )}

        {/* List tabs */}
        {tab !== "basics" && (() => {
          const { field, label, defaultItem } = FIELD_MAP[tab];
          const items: any[] = arena[field] ?? [];
          return (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <span style={{ fontSize:13, color:C.muted }}>{items.length} {label}{items.length!==1?"s":""}</span>
                <button onClick={() => addItem(field,defaultItem)} style={{ padding:"6px 14px", background:C.purple, color:C.white, borderRadius:8, fontSize:12, fontWeight:500, border:"none", cursor:"pointer" }}>
                  + Add {label}
                </button>
              </div>
              {items.length === 0 ? (
                <div style={{ textAlign:"center", padding:"48px 0", color:C.faint }}>
                  <p>No {label.toLowerCase()}s yet.</p>
                  <p style={{ fontSize:12, marginTop:4 }}>Click "+ Add {label}" to add one.</p>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {items.map((item: any, idx: number) => (
                    <div key={item.id??idx} style={{ background:C.bg3+"88", borderRadius:12, padding:16, border:`1px solid ${C.border}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                        <span style={{ fontSize:13, fontWeight:500, color:C.text }}>{label} #{idx+1}</span>
                        <button onClick={() => removeItem(field,item.id)} style={{ color:C.red, background:"none", border:"none", fontSize:12, cursor:"pointer" }}>Remove</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                        {Object.entries(item).filter(([k]) => k!=="id").map(([k,v]) => (
                          <div key={k}>
                            <label style={{ display:"block", fontSize:11, color:C.faint, marginBottom:2, textTransform:"capitalize" }}>{k}</label>
                            <input
                              type={typeof v==="number" ? "number" : "text"}
                              value={v as any}
                              onChange={e => {
                                const newVal = typeof v==="number" ? +e.target.value : e.target.value;
                                setArena((a: any) => ({ ...a, [field]:a[field].map((x: any) => x.id===item.id ? { ...x, [k]:newVal } : x) }));
                              }}
                              style={{ width:"100%", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:6, padding:"4px 8px", color:C.text, fontSize:12, boxSizing:"border-box" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

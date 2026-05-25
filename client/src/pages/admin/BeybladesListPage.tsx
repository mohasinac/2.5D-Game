import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { BeybladeStats } from "@/types/beybladeStats";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";

const TYPE_ACCENT: Record<string, string> = {
  attack: C.red, defense: C.blue, stamina: C.green, balanced: C.yellow,
};

function StatBar({ value, max = 150, color }: { value:number; max?:number; color:string }) {
  return (
    <div style={{ width:"100%", height:4, background:C.bg3, borderRadius:2, overflow:"hidden" }}>
      <div style={{ height:"100%", background:color, width:`${(value/max)*100}%`, borderRadius:2 }} />
    </div>
  );
}

export function BeybladesListPage() {
  const [beyblades, setBeyblades] = useState<BeybladeStats[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BeybladeStats | null>(null);

  const fetchBeyblades = async () => {
    setLoading(true);
    try {
      const ref = collection(db, COLLECTIONS.BEYBLADE_STATS);
      const q = filter === "all"
        ? query(ref, orderBy("displayName"))
        : query(ref, where("type","==",filter), orderBy("displayName"));
      const snap = await getDocs(q);
      setBeyblades(snap.docs.map(d => ({ id:d.id, ...d.data() } as BeybladeStats)));
    } catch { toast.error("Failed to load beyblades"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBeyblades(); }, [filter]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, confirmDelete.id));
      setBeyblades(prev => prev.filter(b => b.id !== confirmDelete.id));
      toast.success(`Deleted ${confirmDelete.displayName}`);
      setConfirmDelete(null);
    } catch { toast.error("Delete failed"); }
    finally { setDeletingId(null); }
  };

  return (
    <div style={{ padding:24, width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text }}>Beyblades</h1>
          <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>{beyblades.length} configured</p>
        </div>
        <Link to="/admin/beyblades/create" style={{ padding:"8px 16px", background:C.blue, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, textDecoration:"none" }}>
          + New Beyblade
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["all","attack","defense","stamina","balanced"].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding:"6px 14px", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer",
              textTransform:"capitalize",
              background: filter===t ? C.text : "transparent",
              color: filter===t ? C.bg0 : C.muted,
              border: `1px solid ${filter===t ? C.text : C.border}`,
            }}
          >{t}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {Array.from({length:6}).map((_,i) => (
            <div key={i} style={{ background:C.bg2, borderRadius:14, border:`1px solid ${C.border}`, height:200 }} className="pulse" />
          ))}
        </div>
      ) : beyblades.length === 0 ? (
        <div style={{ textAlign:"center", paddingTop:80, color:C.faint }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🌀</div>
          <p>No beyblades found. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {beyblades.map(b => (
            <div key={b.id} style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:14, borderBottom:`1px solid ${C.border}` }}>
                {b.imageUrl ? (
                  <img src={b.imageUrl} alt={b.displayName} style={{ width:48, height:48, borderRadius:"50%", objectFit:"contain", background:C.bg1 }} />
                ) : (
                  <div style={{ width:48, height:48, borderRadius:"50%", background:C.bg3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, color:C.muted }}>
                    {b.displayName[0]}
                  </div>
                )}
                <div style={{ flex:1, minWidth:0 }}>
                  <h3 style={{ color:C.text, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.displayName}</h3>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                    <span style={{ fontSize:11, fontWeight:600, textTransform:"capitalize", color: TYPE_ACCENT[b.type] ?? C.muted }}>{b.type}</span>
                    <span style={{ color:C.faint, fontSize:11 }}>{b.spinDirection} spin</span>
                  </div>
                </div>
              </div>

              <div style={{ padding:14 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, fontSize:12, color:C.muted, marginBottom:10 }}>
                  <span>Mass: <span style={{ color:C.text }}>{b.mass}g</span></span>
                  <span>Radius: <span style={{ color:C.text }}>{b.radius}cm</span></span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[["Attack",b.typeDistribution.attack,C.red],["Defense",b.typeDistribution.defense,C.blue],["Stamina",b.typeDistribution.stamina,C.green]].map(([lbl,val,col]) => (
                    <div key={lbl as string}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                        <span style={{ color: col as string }}>{lbl}</span>
                        <span style={{ color:C.muted }}>{val}</span>
                      </div>
                      <StatBar value={val as number} color={col as string} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", borderTop:`1px solid ${C.border}` }}>
                <Link to={`/admin/beyblades/edit/${b.id}`} style={{ flex:1, padding:"10px", textAlign:"center", fontSize:13, color:C.blue, textDecoration:"none" }}>
                  Edit
                </Link>
                <button onClick={() => setConfirmDelete(b)} style={{ flex:1, padding:"10px", textAlign:"center", fontSize:13, color:C.red, background:"none", border:"none", borderLeft:`1px solid ${C.border}`, cursor:"pointer" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {confirmDelete && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:20, padding:24, maxWidth:360, width:"100%" }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>Delete Beyblade</h3>
            <p style={{ color:C.muted, fontSize:14, marginBottom:24 }}>
              Delete <strong style={{ color:C.text }}>{confirmDelete.displayName}</strong>? This cannot be undone.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex:1, padding:"8px", fontSize:13, border:`1px solid ${C.border}`, color:C.muted, background:"transparent", borderRadius:8, cursor:"pointer" }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deletingId !== null} style={{ flex:1, padding:"8px", fontSize:13, background:C.red, color:C.white, borderRadius:8, border:"none", cursor:"pointer", opacity: deletingId ? 0.5 : 1 }}>
                {deletingId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

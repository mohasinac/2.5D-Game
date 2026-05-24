import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";

const THEME_ACCENT: Record<string, string> = {
  metrocity: C.blue, forest: C.green, mountains: C.purple, desert: C.yellow,
  sea: "#06b6d4", futuristic: C.purple, prehistoric: C.orange,
};

export function ArenasListPage() {
  const [arenas, setArenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [tagFilter, setTagFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, COLLECTIONS.ARENAS), orderBy("name")));
        setArenas(snap.docs.map(d => ({ id:d.id, ...d.data() })));
      } catch { toast.error("Failed to load arenas"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, COLLECTIONS.ARENAS, confirmDelete.id));
      setArenas(prev => prev.filter(a => a.id !== confirmDelete.id));
      toast.success(`Deleted ${confirmDelete.name}`);
      setConfirmDelete(null);
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text }}>Arenas</h1>
          <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>{arenas.length} configured</p>
        </div>
        <Link to="/admin/arenas/create" style={{ padding:"8px 16px", background:C.purple, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, textDecoration:"none" }}>
          + New Arena
        </Link>
      </div>

      {/* Tag filter bar */}
      {!loading && arenas.length > 0 && (() => {
        const allTags = Array.from(new Set(arenas.flatMap(a => (a.tags ?? [a.theme]).filter(Boolean))));
        const filtered = tagFilter === "all" ? arenas : arenas.filter(a => (a.tags ?? [a.theme]).includes(tagFilter));
        return (
          <>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {["all", ...allTags].map(tag => (
                <button key={tag} onClick={() => setTagFilter(tag)}
                  style={{
                    padding:"4px 12px", borderRadius:20, fontSize:11, cursor:"pointer", fontWeight:500,
                    background: tagFilter === tag ? C.purple : "transparent",
                    color: tagFilter === tag ? C.white : C.muted,
                    border: `1px solid ${tagFilter === tag ? C.purple : C.border}`,
                    textTransform: "capitalize",
                  }}>
                  {tag}
                </button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {filtered.map(arena => {
                const accent = THEME_ACCENT[arena.theme] ?? C.border;
                return (
                  <div key={arena.id} style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                    <div style={{ height:110, display:"flex", alignItems:"center", justifyContent:"center", background:accent+"11", position:"relative" }}>
                      <div style={{
                        width:80, height:80, border:`2px solid ${accent}66`,
                        borderRadius: arena.shape==="circle" ? "50%" : 4,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:24,
                      }}>
                        {arena.shape==="circle" ? "⭕" : "▬"}
                      </div>
                      <span style={{ position:"absolute", top:8, right:8, fontSize:11, color:C.muted, background:"rgba(0,0,0,0.4)", padding:"2px 8px", borderRadius:4, textTransform:"capitalize" }}>
                        {arena.theme}
                      </span>
                      {arena.tags?.length > 0 && (
                        <span style={{ position:"absolute", bottom:8, left:8, fontSize:10, color:"#88aacc", background:"rgba(0,0,0,0.4)", padding:"2px 6px", borderRadius:4 }}>
                          {arena.tags[0]}
                        </span>
                      )}
                    </div>
                    <div style={{ padding:14 }}>
                      <h3 style={{ color:C.text, fontWeight:600 }}>{arena.name}</h3>
                      <div style={{ display:"flex", gap:12, marginTop:4, fontSize:12, color:C.muted }}>
                        <span style={{ textTransform:"capitalize" }}>{arena.shape}</span>
                        <span>{arena.width ?? "—"}×{arena.height ?? "—"}</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", borderTop:`1px solid ${C.border}` }}>
                      <a href={`/admin/arenas/edit/${arena.id}`} style={{ flex:1, padding:"10px", textAlign:"center", fontSize:13, color:C.purple, textDecoration:"none" }}>Edit</a>
                      <button onClick={() => setConfirmDelete(arena)} style={{ flex:1, padding:"10px", fontSize:13, color:C.red, background:"none", border:"none", borderLeft:`1px solid ${C.border}`, cursor:"pointer" }}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {loading && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {Array.from({length:4}).map((_,i) => <div key={i} style={{ background:C.bg2, borderRadius:14, border:`1px solid ${C.border}`, height:160 }} className="pulse" />)}
        </div>
      )}
      {!loading && arenas.length === 0 && (
        <div style={{ textAlign:"center", paddingTop:80, color:C.faint }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🏟️</div>
          <p>No arenas yet. Create your first arena!</p>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:20, padding:24, maxWidth:360, width:"100%" }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>Delete Arena</h3>
            <p style={{ color:C.muted, fontSize:14, marginBottom:24 }}>Delete <strong style={{ color:C.text }}>{confirmDelete.name}</strong>? This cannot be undone.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex:1, padding:"8px", border:`1px solid ${C.border}`, color:C.muted, background:"transparent", borderRadius:8, cursor:"pointer" }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ flex:1, padding:"8px", background:C.red, color:C.white, borderRadius:8, border:"none", cursor:"pointer", opacity: deleting ? 0.5 : 1 }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";

export function StadiumsListPage() {
  const [stadiums, setStadiums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, COLLECTIONS.STADIUMS), orderBy("name")));
        setStadiums(snap.docs.map(d => ({ id:d.id, ...d.data() })));
      } catch { toast.error("Failed to load stadiums"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, COLLECTIONS.STADIUMS, confirmDelete.id));
      setStadiums(prev => prev.filter(s => s.id !== confirmDelete.id));
      toast.success(`Deleted ${confirmDelete.name}`);
      setConfirmDelete(null);
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text }}>Stadiums</h1>
          <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>{stadiums.length} configured</p>
        </div>
        <Link to="/admin/stadiums/create" style={{ padding:"8px 16px", background:C.orange, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, textDecoration:"none" }}>
          + New Stadium
        </Link>
      </div>

      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {[1,2,3].map(i => <div key={i} style={{ background:C.bg2, borderRadius:14, border:`1px solid ${C.border}`, height:160 }} className="pulse" />)}
        </div>
      ) : stadiums.length === 0 ? (
        <div style={{ textAlign:"center", paddingTop:80, color:C.faint }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🏟️</div>
          <p style={{ marginBottom:8 }}>No stadiums yet.</p>
          <Link to="/admin/stadiums/create" style={{ color:C.orange, fontSize:13, textDecoration:"none" }}>Create your first stadium →</Link>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {stadiums.map(s => (
            <div key={s.id} style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              {s.imageUrl ? (
                <img src={s.imageUrl} alt={s.name} style={{ width:"100%", height:128, objectFit:"cover" }} />
              ) : (
                <div style={{ width:"100%", height:128, background:`linear-gradient(135deg, ${C.orange}22, ${C.bg3})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}>🏟️</div>
              )}
              <div style={{ padding:14 }}>
                <h3 style={{ color:C.text, fontWeight:600 }}>{s.name}</h3>
                {s.description && <p style={{ color:C.faint, fontSize:12, marginTop:4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{s.description}</p>}
              </div>
              <div style={{ display:"flex", borderTop:`1px solid ${C.border}` }}>
                <Link to={`/admin/stadiums/edit/${s.id}`} style={{ flex:1, padding:"10px", textAlign:"center", fontSize:13, color:C.orange, textDecoration:"none" }}>Edit</Link>
                <button onClick={() => setConfirmDelete(s)} style={{ flex:1, padding:"10px", fontSize:13, color:C.red, background:"none", border:"none", borderLeft:`1px solid ${C.border}`, cursor:"pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:20, padding:24, maxWidth:360, width:"100%" }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>Delete Stadium</h3>
            <p style={{ color:C.muted, fontSize:14, marginBottom:24 }}>Delete <strong style={{ color:C.text }}>{confirmDelete.name}</strong>? This cannot be undone.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex:1, padding:"8px", border:`1px solid ${C.border}`, color:C.muted, background:"transparent", borderRadius:8, cursor:"pointer" }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ flex:1, padding:"8px", background:C.red, color:C.white, borderRadius:8, border:"none", cursor:"pointer", opacity:deleting?0.5:1 }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";
import ArenaConfigurator from "@/components/admin/ArenaConfigurator";
import type { ArenaConfig } from "@/types/arenaConfigNew";
import { DEFAULT_ARENA_CONFIG } from "@/types/arenaConfigNew";

export function ArenaEditPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [arena, setArena] = useState<ArenaConfig | null>(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, COLLECTIONS.ARENAS, id))
      .then(snap => {
        if (!snap.exists()) { toast.error("Arena not found"); return; }
        setArena({ ...DEFAULT_ARENA_CONFIG, ...snap.data(), id: snap.id } as ArenaConfig);
      })
      .catch(() => toast.error("Load failed"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (updated: Partial<ArenaConfig>) =>
    setArena(a => a ? { ...a, ...updated } : a);

  const handleSave = async () => {
    if (!arena || !id) return;
    setSaving(true);
    try {
      const { id: _id, ...data } = arena as any;
      await updateDoc(doc(db, COLLECTIONS.ARENAS, id), { ...data, updatedAt: serverTimestamp() });
      toast.success("Arena saved!");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <div className="spin" style={{ width: 32, height: 32, border: `2px solid ${C.purple}`, borderTopColor: "transparent", borderRadius: "50%" }} />
    </div>
  );
  if (!arena) return <div style={{ padding: 24, color: C.faint }}>Arena not found</div>;

  return (
    <div style={{ padding: "20px 24px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/admin/arenas" style={{ color: C.faint, fontSize: 13, textDecoration: "none" }}>← Arenas</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginTop: 6 }}>{arena.name}</h1>
      </div>
      <ArenaConfigurator
        arena={arena}
        onChange={handleChange}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
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
    <div className="p-6 flex justify-center">
      <div className="spin w-8 h-8 border-2 border-theme-purple border-t-transparent rounded-full" />
    </div>
  );
  if (!arena) return <div className="p-6 text-theme-faint">Arena not found</div>;

  return (
    <div className="px-6 py-5 w-full box-border">
      <div className="mb-5">
        <Link to="/admin/arenas" className="text-theme-faint text-[13px] no-underline">← Arenas</Link>
        <h1 className="text-[22px] font-bold text-theme-text mt-1.5">{arena.name}</h1>
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

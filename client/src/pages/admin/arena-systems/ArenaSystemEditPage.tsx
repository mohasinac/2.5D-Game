import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { ArenaSystem } from "@/types/arenaSystem";
import { ArenaSystemEditor } from "@/components/admin/arena-system/ArenaSystemEditor";

export function ArenaSystemEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [arena, setArena] = useState<ArenaSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArena = async () => {
      try {
        if (!id) throw new Error("No arena ID provided");
        const snapshot = await getDoc(doc(db, COLLECTIONS.ARENA_SYSTEMS, id));
        if (!snapshot.exists()) throw new Error("Arena system not found");
        setArena(snapshot.data() as ArenaSystem);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArena();
  }, [id]);

  const handleSave = async () => {
    if (!arena) return;
    if (!arena.displayName.trim()) {
      setError("Display name is required");
      return;
    }

    setIsSaving(true);
    try {
      if (!id) throw new Error("No arena ID");
      await updateDoc(doc(db, COLLECTIONS.ARENA_SYSTEMS, id), arena as any);
      navigate("/admin/arena-systems");
    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 px-5 text-center text-theme-muted">
        Loading arena system...
      </div>
    );
  }

  if (!arena) {
    return (
      <div className="py-10 px-5 text-center text-theme-red">
        {error || "Arena system not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <button
          onClick={() => navigate("/admin/arena-systems")}
          className="py-2 px-3 bg-border-c text-theme-text border-none rounded text-[12px] cursor-pointer mb-4"
        >
          ← Back to Arena Systems
        </button>
        <h1 className="text-theme-text text-[24px] font-black m-0">
          Edit {arena.displayName}
        </h1>
      </div>

      {error && (
        <div className="bg-red-13 text-theme-red py-3 px-3 rounded-[6px] mb-4 text-[12px]">
          {error}
        </div>
      )}

      <ArenaSystemEditor
        arenaSystem={arena}
        onChange={setArena}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}

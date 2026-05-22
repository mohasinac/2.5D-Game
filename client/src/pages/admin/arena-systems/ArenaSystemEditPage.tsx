import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { ArenaSystem } from "@/types/arenaSystem";
import { C, alpha } from "@/styles/theme";
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
      <div style={{ padding: "40px 20px", textAlign: "center", color: C.muted }}>
        Loading arena system...
      </div>
    );
  }

  if (!arena) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: C.red }}>
        {error || "Arena system not found"}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => navigate("/admin/arena-systems")}
          style={{
            padding: "8px 12px",
            background: C.border,
            color: C.text,
            border: "none",
            borderRadius: 4,
            fontSize: 12,
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          ← Back to Arena Systems
        </button>
        <h1 style={{ color: C.text, fontSize: 24, fontWeight: 900, margin: 0 }}>
          Edit {arena.displayName}
        </h1>
      </div>

      {error && (
        <div
          style={{
            background: alpha(C.red, 0.13),
            color: C.red,
            padding: 12,
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 12,
          }}
        >
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

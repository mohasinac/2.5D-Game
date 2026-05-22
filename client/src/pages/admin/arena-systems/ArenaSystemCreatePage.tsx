import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { ArenaSystem } from "@/types/arenaSystem";
import { C, alpha } from "@/styles/theme";
import { ArenaSystemEditor } from "@/components/admin/arena-system/ArenaSystemEditor";
import { v4 as uuidv4 } from "uuid";

const defaultArena: ArenaSystem = {
  id: "",
  displayName: "New Arena System",
  description: "",
  shape: "circle",
  width: 1080,
  height: 1080,
  theme: "forest",
  difficulty: "medium",
  elevationMap: {
    type: "flat",
    tiltAngle: 0,
    tiltDirection: 0,
  },
  wallProfile: {
    baseHeight: 100,
  },
  slopePhysics: {
    gravityStrength: 0.5,
  },
  wall: {
    type: "circular",
    height: 100,
  },
};

export function ArenaSystemCreatePage() {
  const navigate = useNavigate();
  const [arena, setArena] = useState<ArenaSystem>({ ...defaultArena, id: uuidv4() });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!arena.displayName.trim()) {
      setError("Display name is required");
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.ARENA_SYSTEMS, arena.id), arena);
      navigate("/admin/arena-systems");
    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

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
          Create Arena System
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

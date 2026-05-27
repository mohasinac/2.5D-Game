import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { ArenaSystem } from "@/types/arenaSystem";
import { ArenaSystemEditor } from "@/components/admin/arena-system/ArenaSystemEditor";
/** Simple UUID v4 substitute using crypto.randomUUID (available in all modern browsers). */
const uuidv4 = () => crypto.randomUUID();

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
      <div className="mb-5">
        <button
          onClick={() => navigate("/admin/arena-systems")}
          className="py-2 px-3 bg-border-c text-theme-text border-none rounded text-[12px] cursor-pointer mb-4"
        >
          ← Back to Arena Systems
        </button>
        <h1 className="text-theme-text text-[24px] font-black m-0">
          Create Arena System
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

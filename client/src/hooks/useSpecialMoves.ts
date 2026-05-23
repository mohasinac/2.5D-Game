import { useEffect } from "react";
import { useGameDataStore, type SpecialMoveDoc } from "@/stores/gameDataStore";

export type { SpecialMoveDoc };

export function useSpecialMoves() {
  const specialMoves = useGameDataStore(s => s.specialMoves);
  const loaded = useGameDataStore(s => s.specialMovesLoaded);
  const loading = useGameDataStore(s => s.loading.specialMoves ?? false);
  const error = useGameDataStore(s => s.errors.specialMoves ?? null);
  const fetch = useGameDataStore(s => s.fetchSpecialMoves);

  useEffect(() => { fetch(); }, [fetch]);

  const byId = (id: string): SpecialMoveDoc | undefined => specialMoves.find(m => m.id === id);

  /** Resolve a move by specialMoveId, falling back to the default for beyblade type. */
  const resolve = (specialMoveId?: string | null, beybladeType?: string): SpecialMoveDoc | undefined => {
    if (specialMoveId) {
      const hit = byId(specialMoveId);
      if (hit) return hit;
    }
    if (beybladeType) {
      const defaultMove = specialMoves.find(m => m.isDefault && m.type === beybladeType);
      if (defaultMove) return defaultMove;
    }
    return specialMoves[0];
  };

  return { specialMoves, loaded, loading, error, byId, resolve };
}

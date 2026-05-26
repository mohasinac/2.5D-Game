import { useEffect, useCallback } from "react";
import { useGameDataStore, type SpecialMoveDoc } from "@/stores/gameDataStore";

export type { SpecialMoveDoc };

export function useSpecialMoves() {
  const specialMoves = useGameDataStore(s => s.specialMoves);
  const loaded = useGameDataStore(s => s.specialMovesLoaded);
  const loading = useGameDataStore(s => s.loading.specialMoves ?? false);
  const error = useGameDataStore(s => s.errors.specialMoves ?? null);
  const fetch = useGameDataStore(s => s.fetchSpecialMoves);

  useEffect(() => { fetch(); }, [fetch]);

  const byId = useCallback(
    (id: string): SpecialMoveDoc | undefined => specialMoves.find(m => m.id === id),
    [specialMoves],
  );

  const resolve = useCallback(
    (specialMoveId?: string | null, beybladeType?: string): SpecialMoveDoc | undefined => {
      if (specialMoveId) {
        const hit = specialMoves.find(m => m.id === specialMoveId);
        if (hit) return hit;
      }
      if (beybladeType) {
        const defaultMove = specialMoves.find(m => m.isDefault && m.type === beybladeType);
        if (defaultMove) return defaultMove;
      }
      return specialMoves[0];
    },
    [specialMoves],
  );

  return { specialMoves, loaded, loading, error, byId, resolve };
}

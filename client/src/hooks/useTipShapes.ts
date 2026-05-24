import { useEffect } from "react";
import { useGameDataStore, type TipShapeDoc } from "@/stores/gameDataStore";

export type { TipShapeDoc };

export function useTipShapes() {
  const items = useGameDataStore(s => s.tipShapes);
  const loaded = useGameDataStore(s => s.tipShapesLoaded);
  const loading = useGameDataStore(s => s.loading.tipShapes ?? false);
  const error = useGameDataStore(s => s.errors.tipShapes ?? null);
  const fetch = useGameDataStore(s => s.fetchTipShapes);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

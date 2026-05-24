import { useEffect } from "react";
import { useGameDataStore, type ArenaShapeDoc } from "@/stores/gameDataStore";

export type { ArenaShapeDoc };

export function useArenaShapeDefs() {
  const items = useGameDataStore(s => s.arenaShapeDefs);
  const loaded = useGameDataStore(s => s.arenaShapeDefsLoaded);
  const loading = useGameDataStore(s => s.loading.arenaShapeDefs ?? false);
  const error = useGameDataStore(s => s.errors.arenaShapeDefs ?? null);
  const fetch = useGameDataStore(s => s.fetchArenaShapeDefs);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

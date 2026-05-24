import { useEffect } from "react";
import { useGameDataStore, type ArenaThemeDoc } from "@/stores/gameDataStore";

export type { ArenaThemeDoc };

export function useArenaThemeDefs() {
  const items = useGameDataStore(s => s.arenaThemeDefs);
  const loaded = useGameDataStore(s => s.arenaThemeDefsLoaded);
  const loading = useGameDataStore(s => s.loading.arenaThemeDefs ?? false);
  const error = useGameDataStore(s => s.errors.arenaThemeDefs ?? null);
  const fetch = useGameDataStore(s => s.fetchArenaThemeDefs);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

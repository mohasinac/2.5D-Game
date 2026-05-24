import { useEffect } from "react";
import { useGameDataStore, type StatDefDoc } from "@/stores/gameDataStore";

export type { StatDefDoc };

export function useStatDefs() {
  const items = useGameDataStore(s => s.statDefs);
  const loaded = useGameDataStore(s => s.statDefsLoaded);
  const loading = useGameDataStore(s => s.loading.statDefs ?? false);
  const error = useGameDataStore(s => s.errors.statDefs ?? null);
  const fetch = useGameDataStore(s => s.fetchStatDefs);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

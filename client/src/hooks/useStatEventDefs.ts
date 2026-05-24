import { useEffect } from "react";
import { useGameDataStore, type StatEventDoc } from "@/stores/gameDataStore";

export type { StatEventDoc };

export function useStatEventDefs() {
  const items = useGameDataStore(s => s.statEventDefs);
  const loaded = useGameDataStore(s => s.statEventDefsLoaded);
  const loading = useGameDataStore(s => s.loading.statEventDefs ?? false);
  const error = useGameDataStore(s => s.errors.statEventDefs ?? null);
  const fetch = useGameDataStore(s => s.fetchStatEventDefs);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

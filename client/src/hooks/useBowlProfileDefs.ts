import { useEffect } from "react";
import { useGameDataStore, type BowlProfileDoc } from "@/stores/gameDataStore";

export type { BowlProfileDoc };

export function useBowlProfileDefs() {
  const items = useGameDataStore(s => s.bowlProfileDefs);
  const loaded = useGameDataStore(s => s.bowlProfileDefsLoaded);
  const loading = useGameDataStore(s => s.loading.bowlProfileDefs ?? false);
  const error = useGameDataStore(s => s.errors.bowlProfileDefs ?? null);
  const fetch = useGameDataStore(s => s.fetchBowlProfileDefs);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

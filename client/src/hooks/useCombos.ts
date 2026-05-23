import { useEffect, useMemo } from "react";
import { useGameDataStore, type ComboDoc } from "@/stores/gameDataStore";

export type { ComboDoc };

export function useCombos() {
  const combos = useGameDataStore(s => s.combos);
  const loaded = useGameDataStore(s => s.combosLoaded);
  const loading = useGameDataStore(s => s.loading.combos ?? false);
  const error = useGameDataStore(s => s.errors.combos ?? null);
  const fetch = useGameDataStore(s => s.fetchCombos);

  useEffect(() => { fetch(); }, [fetch]);

  const byId = useMemo<Record<string, ComboDoc>>(
    () => Object.fromEntries(combos.map(c => [c.id, c])),
    [combos]
  );

  return { combos, loaded, loading, error, byId };
}

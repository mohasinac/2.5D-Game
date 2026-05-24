import { useEffect } from "react";
import { useGameDataStore, type CoreGimmickDoc } from "@/stores/gameDataStore";

export type { CoreGimmickDoc };

export function useCoreGimmicks() {
  const items = useGameDataStore(s => s.coreGimmicks);
  const loaded = useGameDataStore(s => s.coreGimmicksLoaded);
  const loading = useGameDataStore(s => s.loading.coreGimmicks ?? false);
  const error = useGameDataStore(s => s.errors.coreGimmicks ?? null);
  const fetch = useGameDataStore(s => s.fetchCoreGimmicks);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

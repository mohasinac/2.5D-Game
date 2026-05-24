import { useEffect } from "react";
import { useGameDataStore, type PartLayerDoc } from "@/stores/gameDataStore";

export type { PartLayerDoc };

export function usePartLayerDefs() {
  const items = useGameDataStore(s => s.partLayerDefs);
  const loaded = useGameDataStore(s => s.partLayerDefsLoaded);
  const loading = useGameDataStore(s => s.loading.partLayerDefs ?? false);
  const error = useGameDataStore(s => s.errors.partLayerDefs ?? null);
  const fetch = useGameDataStore(s => s.fetchPartLayerDefs);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

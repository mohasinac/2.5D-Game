import { useEffect } from "react";
import { useGameDataStore, type PartMaterialDoc } from "@/stores/gameDataStore";

export type { PartMaterialDoc };

export function usePartMaterials() {
  const materials = useGameDataStore(s => s.partMaterials);
  const loaded = useGameDataStore(s => s.partMaterialsLoaded);
  const loading = useGameDataStore(s => s.loading.partMaterials ?? false);
  const error = useGameDataStore(s => s.errors.partMaterials ?? null);
  const fetch = useGameDataStore(s => s.fetchPartMaterials);

  useEffect(() => { fetch(); }, [fetch]);

  return { materials, loaded, loading, error };
}

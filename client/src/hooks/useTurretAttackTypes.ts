import { useEffect } from "react";
import { useGameDataStore, type TurretAttackTypeDoc } from "@/stores/gameDataStore";

export type { TurretAttackTypeDoc };

export function useTurretAttackTypes() {
  const types = useGameDataStore(s => s.turretAttackTypes);
  const loaded = useGameDataStore(s => s.turretAttackTypesLoaded);
  const loading = useGameDataStore(s => s.loading.turretAttackTypes ?? false);
  const error = useGameDataStore(s => s.errors.turretAttackTypes ?? null);
  const fetch = useGameDataStore(s => s.fetchTurretAttackTypes);

  useEffect(() => { fetch(); }, [fetch]);

  return { types, loaded, loading, error };
}

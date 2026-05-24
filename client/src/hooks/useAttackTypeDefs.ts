import { useEffect } from "react";
import { useGameDataStore, type AttackTypeDoc } from "@/stores/gameDataStore";

export type { AttackTypeDoc };

export function useAttackTypeDefs() {
  const items = useGameDataStore(s => s.attackTypeDefs);
  const loaded = useGameDataStore(s => s.attackTypeDefsLoaded);
  const loading = useGameDataStore(s => s.loading.attackTypeDefs ?? false);
  const error = useGameDataStore(s => s.errors.attackTypeDefs ?? null);
  const fetch = useGameDataStore(s => s.fetchAttackTypeDefs);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

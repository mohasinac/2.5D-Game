import { useEffect } from "react";
import { useGameDataStore, type TriggerTypeDoc } from "@/stores/gameDataStore";

export type { TriggerTypeDoc };

export function useTriggerTypeDefs() {
  const items = useGameDataStore(s => s.triggerTypeDefs);
  const loaded = useGameDataStore(s => s.triggerTypeDefsLoaded);
  const loading = useGameDataStore(s => s.loading.triggerTypeDefs ?? false);
  const error = useGameDataStore(s => s.errors.triggerTypeDefs ?? null);
  const fetch = useGameDataStore(s => s.fetchTriggerTypeDefs);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loaded, loading, error };
}

import { useEffect, useMemo } from "react";
import { useGameDataStore, type ArenaFeatureConfigDoc } from "@/stores/gameDataStore";

export type { ArenaFeatureConfigDoc };

export function useArenaFeatureConfigs() {
  const configs = useGameDataStore(s => s.arenaFeatureConfigs);
  const loaded = useGameDataStore(s => s.arenaFeatureConfigsLoaded);
  const loading = useGameDataStore(s => s.loading.arenaFeatureConfigs ?? false);
  const error = useGameDataStore(s => s.errors.arenaFeatureConfigs ?? null);
  const fetch = useGameDataStore(s => s.fetchArenaFeatureConfigs);

  useEffect(() => { fetch(); }, [fetch]);

  const byCategory = useMemo(() => ({
    hazard:      configs.filter(c => c.category === "hazard"),
    effect_zone: configs.filter(c => c.category === "effect_zone"),
    particle:    configs.filter(c => c.category === "particle"),
    env_preset:  configs.filter(c => c.category === "env_preset"),
  }), [configs]);

  return { configs, byCategory, loaded, loading, error };
}

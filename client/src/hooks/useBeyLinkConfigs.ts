import { useEffect, useMemo } from "react";
import { useGameDataStore, type BeyLinkConfigDoc } from "@/stores/gameDataStore";

export type { BeyLinkConfigDoc };

export function useBeyLinkConfigs() {
  const configs = useGameDataStore(s => s.beyLinkConfigs);
  const loaded = useGameDataStore(s => s.beyLinkConfigsLoaded);
  const loading = useGameDataStore(s => s.loading.beyLinkConfigs ?? false);
  const error = useGameDataStore(s => s.errors.beyLinkConfigs ?? null);
  const fetch = useGameDataStore(s => s.fetchBeyLinkConfigs);

  useEffect(() => { fetch(); }, [fetch]);

  const byCategory = useMemo(() => ({
    link_type:         configs.filter(c => c.category === "link_type"),
    reverse_condition: configs.filter(c => c.category === "reverse_condition"),
    bey_link_type:     configs.filter(c => c.category === "bey_link_type"),
    alignment:         configs.filter(c => c.category === "alignment"),
    trigger_condition: configs.filter(c => c.category === "trigger_condition"),
    effect_type:       configs.filter(c => c.category === "effect_type"),
    control_mode:      configs.filter(c => c.category === "control_mode"),
    movement_control:  configs.filter(c => c.category === "movement_control"),
    group_pattern:     configs.filter(c => c.category === "group_pattern"),
  }), [configs]);

  return { configs, byCategory, loaded, loading, error };
}

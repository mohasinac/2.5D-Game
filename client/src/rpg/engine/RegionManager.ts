import type { RegionDef } from "../data/schemas";
import type { RPGStore } from "../stores/rpgStore";
import { evaluateGateCondition } from "../utils/flagUtils";

export class RegionManager {
  private regions: Map<string, RegionDef> = new Map();

  loadRegions(regions: RegionDef[]): void {
    this.regions.clear();
    for (const r of regions) {
      this.regions.set(r.id, r);
    }
  }

  getRegion(regionId: string): RegionDef | null {
    return this.regions.get(regionId) ?? null;
  }

  getAllRegions(): RegionDef[] {
    return Array.from(this.regions.values());
  }

  getRegionsForArc(arcId: string): RegionDef[] {
    return Array.from(this.regions.values()).filter(
      (r) => !r.arcIds || r.arcIds.includes(arcId)
    );
  }

  isRegionUnlocked(regionId: string, store: RPGStore): boolean {
    const region = this.regions.get(regionId);
    if (!region) return false;
    if (!region.unlockGate) return true;

    const state = store;
    const result = evaluateGateCondition(
      region.unlockGate,
      state.flags,
      state.level,
      state.beybladeLevels,
      state.earnedBadges,
      state.defeatedNPCs
    );
    return result.passed;
  }

  getAccessibleConnections(
    fromRegionId: string,
    store: RPGStore
  ): Array<{ targetRegionId: string; travelMode: string }> {
    const region = this.regions.get(fromRegionId);
    if (!region) return [];

    return region.connections.filter((conn) => {
      if (!conn.gate) return true;
      const result = evaluateGateCondition(
        conn.gate,
        store.flags,
        store.level,
        store.beybladeLevels,
        store.earnedBadges,
        store.defeatedNPCs
      );
      return result.passed;
    });
  }

  getConnectionGateReason(
    fromRegionId: string,
    targetRegionId: string,
    store: RPGStore
  ): string | null {
    const region = this.regions.get(fromRegionId);
    if (!region) return null;
    const conn = region.connections.find((c) => c.targetRegionId === targetRegionId);
    if (!conn?.gate) return null;
    const result = evaluateGateCondition(
      conn.gate,
      store.flags,
      store.level,
      store.beybladeLevels,
      store.earnedBadges,
      store.defeatedNPCs
    );
    return result.passed ? null : (result.reason ?? "Requirements not met");
  }
}

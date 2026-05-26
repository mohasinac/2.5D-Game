import type { TileCoord, RPGMap, MapExit, MapEventTrigger } from "../data/schemas";
import { tileInRect } from "../utils/tileUtils";
import { evaluateFlagCondition } from "../utils/flagUtils";

export class TriggerSystem {
  private exits: MapExit[] = [];
  private eventTriggers: MapEventTrigger[] = [];
  private firedOnceIds: Set<string> = new Set();

  loadMap(map: RPGMap): void {
    this.exits = map.exits;
    this.eventTriggers = map.eventTriggers;
  }

  clear(): void {
    this.exits = [];
    this.eventTriggers = [];
  }

  getExitAt(tile: TileCoord): MapExit | null {
    return this.exits.find((e) => tileInRect(tile, e.triggerRect)) ?? null;
  }

  getEventTriggersAt(
    tile: TileCoord,
    mode: "enter" | "step" | "interact",
    flags: Record<string, boolean>
  ): MapEventTrigger[] {
    return this.eventTriggers.filter((t) => {
      if (t.triggerMode !== mode) return false;
      if (!tileInRect(tile, t.triggerRect)) return false;
      if (t.triggerOnce && this.firedOnceIds.has(t.id)) return false;
      if (t.triggerCondition && !evaluateFlagCondition(t.triggerCondition, flags)) return false;
      return true;
    });
  }

  markFired(triggerId: string): void {
    this.firedOnceIds.add(triggerId);
  }

  resetFiredState(): void {
    this.firedOnceIds.clear();
  }
}

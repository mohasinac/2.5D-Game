import { MechanicInstance } from "../rooms/schema/GameState";
import { ArraySchema } from "@colyseus/schema";

export interface GimmickDef {
  id: string;
  name: string;
  mechanicIds: string[];
  defaultParams?: Record<string, Record<string, unknown>>;
}

/**
 * Expands a list of gimmickIds into MechanicInstance[] by looking them up
 * in the cached gimmickDefs map.
 *
 * Called ONCE per beyblade at room onCreate. Never called in the game loop.
 */
export function expandGimmicks(
  gimmickIds: string[],
  gimmickDefsCache: Record<string, GimmickDef>,
): ArraySchema<MechanicInstance> {
  const result = new ArraySchema<MechanicInstance>();

  for (const gimmickId of gimmickIds) {
    const def = gimmickDefsCache[gimmickId];
    if (!def) {
      console.warn(`[gimmickExpander] Unknown gimmickId "${gimmickId}" — skipping`);
      continue;
    }

    for (const mechanicId of def.mechanicIds) {
      const inst = new MechanicInstance();
      inst.type = mechanicId;
      inst.params = JSON.stringify(def.defaultParams?.[mechanicId] ?? {});
      inst.state = "{}";
      inst.active = true;
      result.push(inst);
    }
  }

  return result;
}

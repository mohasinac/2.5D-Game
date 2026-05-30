// Helpers shared by all 4 Parts25D rooms. Each room owns one PartSystemManager
// instance and registers each bey at join time using a resolved bundle from
// Firestore. These helpers wrap the manager calls so each Parts25D room is a
// thin override around its 2D parent.

import type { Client, Room } from "colyseus";
import { PartSystemManager } from "../PartSystemManager";
import { loadBeybladeSystemBundle, type ResolvedBeybladeSystem } from "../../utils/firebase";
import { getFallbackBundle } from "../../utils/fallbackBeys";
import type { Beyblade, GameState } from "../schema/GameState";
import type { ArenaState } from "../schema/GameState";

// Build a manager sized to the arena. arenaState uses cm units (width/height)
// scaled to pixels by the room's existing convention (* 16).
export function buildPartSystemManager(arena: ArenaState): PartSystemManager {
  const centerX = (arena.width * 16) / 2;
  const centerY = (arena.height * 16) / 2;
  const radius = Math.min(arena.width, arena.height) * 16 * 0.45;
  return new PartSystemManager(centerX, centerY, radius);
}

// Resolve a 2.5D bey from Firestore, sync system-level fields onto the schema,
// and register it with the manager. Also re-applies the angular velocity to
// the physics engine so spinDirection from the BeybladeSystem (left vs right)
// actually takes effect — the parent room's onJoin set the physics body to
// the default direction before this runs.
export interface RegisterOptions {
  physics: { setAngularVelocity(id: string, omega: number): void };
}

export async function registerBeyOnManager(
  manager: PartSystemManager,
  beybladeSystemId: string,
  sessionId: string,
  bey: Beyblade,
  opts: RegisterOptions,
): Promise<ResolvedBeybladeSystem | null> {
  const bundle = await loadBeybladeSystemBundle(beybladeSystemId) ?? getFallbackBundle(beybladeSystemId) ?? null;
  if (!bundle) return null;
  // Sync system-level fields BEFORE registerBey so the manager sees the
  // correct spinDirection (it caches defaultSpinDirection from the schema).
  bey.spinDirection = bundle.system.spinDirection;
  const omega = (bey.spinDirection === "left" ? -1 : 1) * (bey.maxSpin / 200);
  opts.physics.setAngularVelocity(sessionId, omega);
  manager.registerBey(sessionId, bundle.system, bundle.parts, bey);
  return bundle;
}

// Forward a per-tick update to the manager and apply its bearing-adjusted
// spin decay rate. Safe to call for beys that weren't registered — the
// manager returns the base rate unchanged.
export function tickBeyOnManager(
  manager: PartSystemManager,
  beyblade: Beyblade,
  state: GameState,
  dt: number,
): void {
  // Spin decay was already applied this tick using the schema's spinDecayRate;
  // here we apply the BEARING-FRICTION delta (bearing tips reduce decay).
  // Compute the multiplier by asking the manager and apply only the diff.
  const base = beyblade.spinDecayRate;
  const { adjustedSpinDecayRate } = manager.tickBey(sessionIdOf(beyblade), beyblade, state, base, undefined, undefined, dt);
  const diff = base - adjustedSpinDecayRate;
  if (diff !== 0) {
    // Refund the over-applied decay so net effective decay matches the manager's adjusted rate.
    beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + diff * dt);
  }
}

function sessionIdOf(bey: Beyblade): string {
  // In every room, Beyblade.id mirrors the client.sessionId at register time
  // (or the AI synthetic id). Manager looks up beys by sessionId, so this is it.
  return bey.id;
}

/**
 * Wire the "mode:switch" Colyseus message channel to the manager. Clients send:
 *   { partLayer: "tip" | "ar" | ..., configId?: string }
 * If `configId` is omitted, the manager cycles to the next playerSwitchable
 * configuration on that part. Switch is rejected silently when the bey isn't
 * registered, the layer has no playerSwitchable configs, or the per-part
 * cooldown hasn't elapsed.
 */
export function registerModeSwitchHandler(
  room: Room<GameState>,
  getManager: () => PartSystemManager | undefined
): void {
  room.onMessage(
    "mode:switch",
    (client: Client, message: { partLayer: string; configId?: string }) => {
      const manager = getManager();
      if (!manager) return;
      const bey = room.state.beyblades.get(client.sessionId);
      if (!bey || !bey.isActive) return;
      const layer = (message?.partLayer ?? "").toString();
      if (!layer) return;
      const activated = manager.applyConfigSwitch(client.sessionId, bey, layer, message?.configId);
      if (activated) {
        client.send("mode:switched", { partLayer: layer, configId: activated });
      }
    }
  );
}

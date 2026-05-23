// Server-side arena rotation advancement. Called each tick from every room
// so the client sees an authoritative angle (radians) on `state.arena.rotation`.
// See plan Part 4 (arena rotation).

import type { ArenaState } from "../../rooms/schema/GameState";

const DEG_PER_S_TO_RAD_PER_S = Math.PI / 180;

/**
 * Advance the arena's `rotation` field by `rotationSpeed` (deg/s) × dt
 * (seconds), honoring `rotationDirection`. No-op when `autoRotate` is false
 * or rotationSpeed is zero. Wraps the angle to [-2π, 2π] to keep float
 * precision bounded.
 */
export function advanceArenaRotation(arena: ArenaState, dtSec: number): void {
  if (!arena) return;
  if (!arena.autoRotate || arena.rotationSpeed === 0) return;
  const sign = arena.rotationDirection === "counterclockwise" ? -1 : 1;
  let next = arena.rotation + arena.rotationSpeed * DEG_PER_S_TO_RAD_PER_S * sign * dtSec;
  // Keep value bounded so float drift doesn't accumulate over a multi-hour match.
  const TWO_PI = Math.PI * 2;
  if (next > TWO_PI) next -= TWO_PI;
  if (next < -TWO_PI) next += TWO_PI;
  arena.rotation = next;
}

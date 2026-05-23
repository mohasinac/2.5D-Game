// Server-side arena rotation / tilt advancement. Called each tick from every room
// so the client sees authoritative values on `state.arena`.
// See plan Part 4 (arena rotation) and arena-tilt feature.

import type { ArenaState, Beyblade } from "../../rooms/schema/GameState";
import type { MapSchema } from "@colyseus/schema";

const DEG_PER_S_TO_RAD_PER_S = Math.PI / 180;
const TWO_PI = Math.PI * 2;

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
  if (next > TWO_PI) next -= TWO_PI;
  if (next < -TWO_PI) next += TWO_PI;
  arena.rotation = next;
}

/**
 * Advance arena tilt for the current tick.
 *
 * Three modes:
 *  - "fixed"     — autoTilt rotates tiltDirection at tiltSpeed (deg/s). Angle stays constant.
 *  - "oscillate" — angle swings between tiltOscillateMin and tiltOscillateMax on a cosine
 *                  wave with period tiltOscillatePeriodMs. tiltPhaseMs is the internal clock.
 *                  autoTilt also advances tiltDirection at tiltSpeed simultaneously.
 *  - "weight"    — handled externally by applyWeightTilt() since it needs the beyblade map.
 *                  This function only advances tiltDirection spin in weight mode if autoTilt.
 */
export function advanceArenaTilt(arena: ArenaState, dtSec: number): void {
  if (!arena) return;

  const mode = arena.tiltMode || "fixed";

  // Advance direction spin for fixed + oscillate + weight (all honour tiltSpeed).
  if (arena.autoTilt && arena.tiltSpeed !== 0) {
    let dir = arena.tiltDirection + arena.tiltSpeed * dtSec;
    if (dir >= 360) dir -= 360;
    if (dir < 0)    dir += 360;
    arena.tiltDirection = dir;
  }

  if (mode === "oscillate") {
    const min    = arena.tiltOscillateMin;
    const max    = arena.tiltOscillateMax || arena.tiltAngle;
    const period = arena.tiltOscillatePeriodMs > 0 ? arena.tiltOscillatePeriodMs : 4000;

    let phase = (arena.tiltPhaseMs + dtSec * 1000) % period;
    arena.tiltPhaseMs = phase;

    // Smooth cosine interpolation: 0 at start → max → 0 → min → back.
    // Uses (1 - cos) / 2 mapping so it starts at min and peaks at max at half-period.
    const t = (1 - Math.cos((TWO_PI * phase) / period)) / 2;
    arena.tiltAngle = min + (max - min) * t;
  }
}

/**
 * Apply weight-distribution tilt: compute the center of mass of all active
 * beyblades, then tilt the arena toward that side at a magnitude proportional
 * to how far off-center the COM is. Call this each tick AFTER advanceArenaTilt
 * when arena.tiltMode === "weight".
 *
 * @param arena           Live ArenaState (mutable — writes tiltAngle + tiltDirection).
 * @param beyblades       MapSchema of Beyblade instances from GameState.
 * @param arenaCenterX    Arena center X in physics units (width * 16 / 2).
 * @param arenaCenterY    Arena center Y in physics units (height * 16 / 2).
 * @param arenaPhysicsRadius  Arena radius in physics units (Math.min(w,h) * 16 * 0.45).
 */
export function applyWeightTilt(
  arena: ArenaState,
  beyblades: MapSchema<Beyblade>,
  arenaCenterX: number,
  arenaCenterY: number,
  arenaPhysicsRadius: number,
): void {
  if (!arena || arena.tiltMode !== "weight") return;

  let totalMass = 0;
  let comX = 0;
  let comY = 0;
  let activeCount = 0;

  beyblades.forEach((bey) => {
    if ((bey as any).isEliminated || bey.health <= 0) return;
    const m = bey.mass > 0 ? bey.mass : 1;
    // Offset from arena center so COM is relative to the pivot.
    comX += (bey.x - arenaCenterX) * m;
    comY += (bey.y - arenaCenterY) * m;
    totalMass += m;
    activeCount++;
  });

  if (activeCount === 0 || totalMass === 0) {
    arena.tiltAngle = 0;
    return;
  }

  comX /= totalMass;
  comY /= totalMass;

  const dist = Math.sqrt(comX * comX + comY * comY);
  const maxAngle = arena.tiltOscillateMax > 0 ? arena.tiltOscillateMax : (arena.tiltAngle || 30);
  const radius = arenaPhysicsRadius > 0 ? arenaPhysicsRadius : 1;

  // Clamp to 1 so dist > radius never exceeds maxAngle.
  const normalized = Math.min(dist / radius, 1);
  arena.tiltAngle = normalized * maxAngle;

  // Direction: downhill points toward the heavy side.
  if (dist > 1) {
    const azimuthRad = Math.atan2(comY, comX);
    let azimuthDeg = (azimuthRad * 180) / Math.PI;
    if (azimuthDeg < 0) azimuthDeg += 360;
    arena.tiltDirection = azimuthDeg;
  }
}

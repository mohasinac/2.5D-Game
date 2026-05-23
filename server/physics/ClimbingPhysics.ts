/**
 * Climbing & Suction Physics — 2.5D ONLY.
 *
 * Per-tick, per-bey calculations for:
 *   - Surface adhesion (suctionForce >= effectiveGravity → bey sticks to surface)
 *   - Wall climbing (wallClimbFactor > 0 counteracts gravity on vertical surfaces)
 *   - Bey-axis tilt (beyTiltAngle) with gyroscopic stabilization + impact tilt + gravity runaway
 *
 * Coordinate convention:
 *   All distances/forces in cm unless noted.
 *   dt is in seconds.
 */

/** Minimal bey state interface for climbing/tilt calculations. */
export interface ClimbingBeyState {
  // Position
  x: number;
  y: number;
  z?: number; // vertical in 2.5D (cm above floor)

  // Physics
  spin: number;
  maxSpin: number;
  mass: number; // grams

  // Effective stats (resolved from parts + factor system)
  suctionForce: number;    // N — adhesion force
  wallClimbFactor: number; // 0=none, 1=full climb
  gravityMult: number;     // per-bey gravity scale
  gripFactor: number;
  tiltResistance: number;  // 0–1 (maps to lateralStability)
  lateralStiffness: number; // gyroscopic auto-recovery rate (maps to lateralStiffness)

  // Current 2.5D orientation state
  beyTiltAngle: number;    // degrees: 0=vertical, 90=on-side
  adhering: boolean;
  adheringSurfaceAngle: number; // degrees: angle of surface bey sticks to
  wallClimbing: boolean;
  effectiveGravity: number; // resolved per tick
}

export interface ArenaGeometry {
  /** Base arena gravity (cm/s²). Typical: 980 (1g). */
  baseGravity: number;
  /** Returns the nearest surface normal angle (degrees) at the given position, or null if floor. */
  getNearestSurfaceNormal?: (x: number, y: number, z?: number) => number | null;
  /** Returns true if the bey is near a vertical wall at this position. */
  isNearVerticalSurface?: (x: number, y: number) => boolean;
}

export interface ClimbingForceOutput {
  /** Force to apply in the adhesion direction (cm/s² — acceleration). */
  adhesionAccel: number;
  /** Direction the adhesion force points (degrees; 90=up). */
  adhesionDirection: number;
  /** Wall-climb friction (counteracts gravity on vertical surfaces). */
  wallClimbFrictionAccel: number;
  /** Updated state flags. */
  adhering: boolean;
  adheringSurfaceAngle: number;
  wallClimbing: boolean;
  effectiveGravity: number;
}

const ARENA_BASE_GRAVITY = 980; // cm/s²

/**
 * Compute climbing/suction forces for one bey, one tick.
 * Returns force values to be applied by the caller via Matter.js Body.applyForce().
 */
export function computeClimbingForces(
  bey: ClimbingBeyState,
  arena: ArenaGeometry,
  dt: number
): ClimbingForceOutput {
  const baseGravity = arena.baseGravity ?? ARENA_BASE_GRAVITY;
  const effectiveGravity = baseGravity * bey.gravityMult;

  let adhering = false;
  let adheringSurfaceAngle = 0;
  let wallClimbing = false;
  let adhesionAccel = 0;
  let adhesionDirection = 90; // default up
  let wallClimbFrictionAccel = 0;

  // Suction / adhesion: if suctionForce >= effective gravity, bey sticks to nearest surface
  if (bey.suctionForce > 0) {
    const surfaceNormal = arena.getNearestSurfaceNormal?.(bey.x, bey.y, bey.z);

    if (surfaceNormal !== null && surfaceNormal !== undefined) {
      // Linear falloff: suction decays with distance from surface
      // For now we assume bey is on the surface — full force
      const suctionAccel = bey.suctionForce / (bey.mass / 1000); // convert g to kg
      const netAccel = suctionAccel - effectiveGravity;

      if (netAccel >= 0) {
        adhesionAccel = suctionAccel;
        adhesionDirection = surfaceNormal;
        adhering = true;
        adheringSurfaceAngle = surfaceNormal;
      }
    }
  }

  // Wall climbing: counteracts gravity when near vertical surfaces
  if (!adhering && bey.wallClimbFactor > 0) {
    const nearVertical = arena.isNearVerticalSurface?.(bey.x, bey.y) ?? false;
    if (nearVertical) {
      wallClimbFrictionAccel = effectiveGravity * bey.wallClimbFactor * bey.gripFactor;
      wallClimbing = true;
    }
  }

  return {
    adhesionAccel,
    adhesionDirection,
    wallClimbFrictionAccel,
    adhering,
    adheringSurfaceAngle,
    wallClimbing,
    effectiveGravity,
  };
}

// ─── Bey-axis tilt physics ──────────────────────────────────────────────────

export interface TiltUpdateResult {
  beyTiltAngle: number;
  wobbleAmplitude: number;
  /** True if orientation should transition to "rolling" (tilt > 45°). */
  shouldBeRolling: boolean;
  /** True if orientation should return to "normal" (tilt < 5°). */
  shouldBeNormal: boolean;
}

/**
 * Update beyTiltAngle for one bey, one tick.
 *
 * Four forces:
 *  1. Gyroscopic stabilization — high spin auto-rights the bey
 *  2. Impact tilt — hits increase tilt angle
 *  3. Gravity runaway — tilted bey tips further if stabilization fails
 *
 * @param impactForce  Force of any hit received this tick (0 if no hit).
 * @param dt           Time step in seconds.
 */
export function updateBeyTilt(
  bey: ClimbingBeyState,
  impactForce: number,
  dt: number
): TiltUpdateResult {
  let tilt = bey.beyTiltAngle;
  const spinRatio = bey.maxSpin > 0 ? bey.spin / bey.maxSpin : 0;

  // 1. Gyroscopic stabilization — reduces tilt at high spin
  const stabilizingTorque = spinRatio * spinRatio * bey.lateralStiffness * 2.0;
  tilt -= stabilizingTorque * dt;

  // 2. Impact tilt — hits increase tilt
  if (impactForce > 0) {
    const impactTilt = impactForce * (1.0 - bey.tiltResistance) * 0.02;
    tilt += impactTilt;
  }

  // 3. Gravity runaway — tilted beys tip further when spin is low
  if (tilt > 20) {
    tilt += Math.sin((tilt * Math.PI) / 180) * bey.gravityMult * 0.005 * dt;
  }

  // 4. Clamp
  tilt = Math.max(0, Math.min(90, tilt));

  // Wobble amplitude tracks tilt (linked to GameState.ts:332 wobbleAmplitude)
  const wobbleAmplitude = tilt * spinRatio * 0.5;

  return {
    beyTiltAngle: tilt,
    wobbleAmplitude,
    shouldBeRolling: tilt > 45,
    shouldBeNormal: tilt < 5,
  };
}

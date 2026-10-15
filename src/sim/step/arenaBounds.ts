import type { Vec3 } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   ARENA RIM CONTAINMENT
   Pure, THREE-free, deterministic.

   WHY THIS EXISTS. Wall collision lives in `SpawnManager`, and `SpawnManager`
   owns exactly one bey — the player. Roster beys therefore had no rim at all:
   they climbed the bowl under their own steering, crossed the ellipse, and the
   moment they left the footprint `_sampleWorldFor` reported `supported: false`
   and they fell out of the world.

   That was not a theoretical gap. Measured on the live battle screen, the
   opponent left the dish within five seconds of every launch, so **every match
   was won by an accidental ring-out** before the beys had meaningfully fought.

   The bowl rim is modelled as an elliptical wall rather than reusing the
   authored `WallData` set, because the rim is the arena's own edge: it exists
   for every stadium whether or not walls were authored on it, and a bey that
   gets past it is leaving the stadium, not passing a decoration.
   ══════════════════════════════════════════════════════════════════════════ */

export interface EllipseBounds {
  /** Arena-local semi-axes, cm. */
  radiusX: number;
  radiusZ: number;
}

/** Normalised radius: < 1 inside, 1 on the rim, > 1 outside. */
export function normalisedRadius(alx: number, alz: number, b: EllipseBounds): number {
  const rx = Math.max(1e-6, b.radiusX);
  const rz = Math.max(1e-6, b.radiusZ);
  return Math.hypot(alx / rx, alz / rz);
}

export interface ContainResult {
  /** Arena-local position after containment. */
  alx: number;
  alz: number;
  /** Velocity after reflection, in the same arena-local frame. */
  vx: number;
  vz: number;
  /** True if the rim actually acted. */
  contained: boolean;
}

/**
 * Keep a body inside the rim, reflecting the outward part of its velocity.
 *
 * `restitution` is the rim's bounciness: 0 stops the body dead against the
 * wall, 1 returns all of it. Only the OUTWARD component is reflected — a bey
 * running along the rim keeps its tangential speed, which is what makes
 * Tornado Stalling possible instead of grinding to a halt on contact.
 *
 * Returns unchanged values when the body is inside, so the caller can apply
 * this unconditionally without branching.
 */
export function containToEllipse(
  alx: number, alz: number, vx: number, vz: number,
  b: EllipseBounds, restitution = 0.4,
): ContainResult {
  const n = normalisedRadius(alx, alz, b);
  if (n <= 1 || !Number.isFinite(n)) return { alx, alz, vx, vz, contained: false };

  /* Push back onto the rim along the same ray. Scaling by 1/n lands exactly on
     the boundary rather than at a fixed inset, so an ellipse is handled as
     naturally as a circle. */
  const px = alx / n;
  const pz = alz / n;

  /* Outward normal of an ellipse is the gradient of (x/rx)^2 + (z/rz)^2,
     NOT the radial direction — those differ everywhere except on the axes,
     and using the radius would reflect a bey off a non-circular rim at a
     visibly wrong angle. */
  const rx = Math.max(1e-6, b.radiusX);
  const rz = Math.max(1e-6, b.radiusZ);
  let nx = px / (rx * rx);
  let nz = pz / (rz * rz);
  const len = Math.hypot(nx, nz) || 1;
  nx /= len; nz /= len;

  const vn = vx * nx + vz * nz;
  /* Reflect only when travelling INTO the wall. A body already heading back
     inside must keep its velocity, or resting contact becomes a vibration —
     the same rule the obstacle resolver encodes. */
  if (vn <= 0) return { alx: px, alz: pz, vx, vz, contained: true };

  return {
    alx: px,
    alz: pz,
    vx: vx - (1 + restitution) * vn * nx,
    vz: vz - (1 + restitution) * vn * nz,
    contained: true,
  };
}

/** Convenience for callers holding a `Vec3` pair. Mutates in place. */
export function containBody(
  pos: Vec3, vel: Vec3, alx: number, alz: number,
  b: EllipseBounds, restitution = 0.4,
): boolean {
  const r = containToEllipse(alx, alz, vel.x, vel.z, b, restitution);
  if (!r.contained) return false;
  /* Only the velocity is written back here — position is in ARENA-LOCAL
     coordinates and the caller owns the rotation back to world, which it
     cannot delegate without knowing the arena's `rotY`. */
  vel.x = r.vx;
  vel.z = r.vz;
  return true;
}

import type { Vec3 } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 9 — AERIAL, CENTRIPETAL RETENTION, AND TELEPORT

   Three pieces of the track-and-air layer, all pure.

   AERIAL (ledger code J, ~150 cases, all GAP). `JumpFlightConfig` is fully
   built — launch angle, force, gravity scale, air drag, landing impact,
   landing bounce — and has ZERO runtime consumers, so every dive, aerial
   crush and air-launch move in the corpus is blocked on code that already
   exists and is simply never called. This supplies the ballistic integration
   those configs describe.

   CENTRIPETAL RETENTION (Sec.G1's "one genuinely new piece of physics, and it
   is small"). A bey holds the inside of a loop while the centripetal demand
   is met and falls off below it. Without this, `loop`, `return_loop`,
   `exit_loop` and `corkscrew` segments cannot be ridden at all, which is most
   of the hot-wheels track system.

   TELEPORT (ledger N13). A discontinuous reposition — not a dash, not a jump.
   CS15's Vanishing Attack and Wave Attack need a position change with no
   intervening path, and conflating that with a fast dash is what makes those
   moves impossible to express.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Aerial flight ───────────────────────────────────────────────────────── */

/** The authored flight parameters, mirroring `JumpFlightConfig`. */
export interface FlightConfig {
  /** Degrees above horizontal. */
  launchAngleDeg: number;
  /** Initial speed along the launch direction, cm/s. */
  launchSpeed: number;
  /** Multiplier on gravity while airborne. <1 floats, >1 slams. */
  gravityScale: number;
  /** Per-second velocity retention in air. 1 = vacuum. */
  airDrag: number;
}

/**
 * Initial velocity for a launch along a horizontal heading.
 *
 * Separated from the integration so a caller can inspect or clamp the launch
 * before committing to it — the difference between a hop and a bey leaving
 * the stadium is entirely in this vector.
 */
export function launchVelocity(dirXZ: Vec3, cfg: FlightConfig): Vec3 {
  const rad = cfg.launchAngleDeg * Math.PI / 180;
  const horiz = Math.cos(rad) * cfg.launchSpeed;
  const vert  = Math.sin(rad) * cfg.launchSpeed;
  const len = Math.hypot(dirXZ.x, dirXZ.z) || 1;
  return { x: (dirXZ.x / len) * horiz, y: vert, z: (dirXZ.z / len) * horiz };
}

/**
 * One ballistic step. Mutates `pos` / `vel`.
 *
 * Drag is applied as a per-second retention raised to `dt`, not a per-frame
 * multiply, so the arc does not change shape with the frame rate — the same
 * step-size independence the ground integrator already guarantees.
 */
export function stepFlight(
  pos: Vec3, vel: Vec3, cfg: FlightConfig, gravity: number, dt: number,
): void {
  vel.y += gravity * cfg.gravityScale * dt;
  if (cfg.airDrag < 1) {
    const k = Math.pow(cfg.airDrag, dt);
    vel.x *= k; vel.y *= k; vel.z *= k;
  }
  pos.x += vel.x * dt;
  pos.y += vel.y * dt;
  pos.z += vel.z * dt;
}

/** Apex height above the launch point for a given flight, cm. */
export function apexHeight(cfg: FlightConfig, gravity = 980): number {
  const rad = cfg.launchAngleDeg * Math.PI / 180;
  const vy = Math.sin(rad) * cfg.launchSpeed;
  const g = Math.abs(gravity) * cfg.gravityScale;
  return g > 0 ? (vy * vy) / (2 * g) : Infinity;
}

/** Flat-ground range of a launch, cm. Ignores drag — an upper bound. */
export function flightRange(cfg: FlightConfig, gravity = 980): number {
  const rad = cfg.launchAngleDeg * Math.PI / 180;
  const g = Math.abs(gravity) * cfg.gravityScale;
  if (g <= 0) return Infinity;
  return (cfg.launchSpeed * cfg.launchSpeed * Math.sin(2 * rad)) / g;
}

/* ── Centripetal retention on loops and corkscrews ───────────────────────── */

/**
 * Minimum speed to stay on the inside of a loop at a given bank, cm/s.
 *
 * The track can only push INWARD (normal force cannot pull), so the bey stays
 * only while the speed it already has supplies the turn:
 *
 *     v² / r ≥ g · cos θ
 *
 * θ is the surface's tilt from horizontal: 0 at the bottom of a loop where
 * gravity fully opposes the normal, π/2 on the vertical wall where it does
 * not, and beyond that overhead, where the requirement eases again because
 * gravity now helps hold the bey against the track.
 */
export function minLoopSpeed(radius: number, bankRad: number, gravity = 980): number {
  if (radius <= 0) return 0;
  const need = gravity * Math.cos(bankRad);
  if (need <= 0) return 0;          // overhead: gravity assists, any speed holds
  return Math.sqrt(need * radius);
}

/** Does this body hold the track here? */
export function holdsLoop(
  speed: number, radius: number, bankRad: number, gravity = 980,
): boolean {
  return speed >= minLoopSpeed(radius, bankRad, gravity);
}

/**
 * Centripetal acceleration the track must supply, cm/s².
 *
 * Reported so a caller can decide what to do when it is not available —
 * peeling off a loop should drop the bey along the surface normal rather than
 * teleporting it, and that needs the shortfall, not just a boolean.
 */
export function centripetalDemand(speed: number, radius: number): number {
  return radius > 0 ? (speed * speed) / radius : 0;
}

/* ── Teleport (N13) ──────────────────────────────────────────────────────── */

/**
 * A discontinuous reposition.
 *
 * Deliberately its own primitive rather than a very fast dash. CS15's
 * Vanishing Attack and Wave Attack specify arriving with NO intervening path,
 * which matters for collision: a dash sweeps through everything between the
 * two points and a teleport must not. Velocity is preserved by default so the
 * bey keeps its momentum through the blink, which is what makes a flanking
 * strike land rather than stall.
 */
export function teleport(
  pos: Vec3, to: Vec3, vel?: Vec3, newVel?: Vec3,
): void {
  pos.x = to.x; pos.y = to.y; pos.z = to.z;
  if (vel && newVel) { vel.x = newVel.x; vel.y = newVel.y; vel.z = newVel.z; }
}

/**
 * A point `distance` behind a target, for flanking teleports.
 *
 * "Behind" is relative to the target's own heading, so a bey that blinks in
 * arrives at the opponent's back rather than at a fixed world offset.
 */
export function behindTarget(
  targetPos: Vec3, targetHeading: Vec3, distance: number,
): Vec3 {
  const len = Math.hypot(targetHeading.x, targetHeading.z) || 1;
  return {
    x: targetPos.x - (targetHeading.x / len) * distance,
    y: targetPos.y,
    z: targetPos.z - (targetHeading.z / len) * distance,
  };
}

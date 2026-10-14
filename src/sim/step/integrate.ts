import type { BeySpec, BeyState, Vec3 } from '../state';
import { surfaceDamping } from '../friction';

/**
 * Pure integration step. No THREE, no DOM, no clock, no randomness.
 *
 * These are the first functions lifted out of `SpawnManager` into a layer that
 * can be run headlessly, replayed, and asserted on without a browser. They take
 * state and a spec and return nothing but mutations to the state they were
 * handed — no scene lookups, no mesh gating, no `'spawn_ball'`.
 *
 * Mutating rather than returning a new state is deliberate: this runs per bey
 * per fixed step, and allocating a fresh object graph at 60 Hz x 6 entities is
 * exactly the kind of cost that shows up as jitter. `cloneBeyState` exists for
 * when a caller genuinely wants a snapshot.
 */

/** cm/s², matching the project's 1 unit = 1 cm convention. */
export const GRAVITY = -980;

/** Fraction of `moveForce` available while airborne. */
export const AIR_CONTROL = 0.25;

/**
 * Apply gravity for `dt` seconds. Grounded beys are held by the surface
 * resolver, so gravity is not integrated into them.
 */
export function applyGravity(s: BeyState, dt: number): void {
  if (s.grounded) return;
  s.vel.y += GRAVITY * s.gravityScale * dt;
}

/**
 * Advance position and damp horizontal velocity.
 *
 * Damping is raised to `dt * 60` so the per-frame coefficient stays meaningful
 * at any step size — the constants were authored against 60 Hz. Grounded
 * damping depends on what is underfoot (see `surfaceDamping`); air damping does
 * not, because nothing is being touched.
 */
export function integrate(s: BeyState, spec: BeySpec, dt: number): void {
  s.pos.x += s.vel.x * dt;
  s.pos.y += s.vel.y * dt;
  s.pos.z += s.vel.z * dt;

  const base = s.grounded
    ? surfaceDamping(s.surfaceMu, spec.frictionGround)
    : spec.frictionAir;
  const f = Math.pow(base, dt * 60);
  s.vel.x *= f;
  s.vel.z *= f;
}

/** Clamp horizontal speed, leaving the vertical component alone. */
export function clampHorizontalSpeed(s: BeyState, spec: BeySpec): void {
  const h = Math.hypot(s.vel.x, s.vel.z);
  if (h <= spec.maxSpeedH) return;
  const k = spec.maxSpeedH / h;
  s.vel.x *= k;
  s.vel.z *= k;
}

/**
 * Apply a horizontal steering acceleration, scaled by `controlAuthority` and
 * reduced in the air.
 *
 * `controlAuthority` is the player-vs-bey dial: at 1 the blader's input is
 * applied in full, at 0 the bey ignores it entirely and follows its parts. It
 * is a parameter rather than a constant because the eras differ — Gen 1/2
 * commands the bey, Gen 3/4 is dictated by the build.
 */
export function applySteering(s: BeyState, spec: BeySpec, dir: Vec3, dt: number): void {
  const len = Math.hypot(dir.x, dir.z);
  if (len < 1e-9) return;
  const scale = (spec.moveForce * spec.controlAuthority * (s.grounded ? 1 : AIR_CONTROL) * dt) / len;
  s.vel.x += dir.x * scale;
  s.vel.z += dir.z * scale;
}

/** Vertical impulse. Ignored unless grounded — no mid-air double jumps. */
export function applyJump(s: BeyState, spec: BeySpec): boolean {
  if (!s.grounded) return false;
  s.vel.y = spec.jumpImpulse;
  s.grounded = false;
  return true;
}

/** World Y of the tip, which is what a surface test actually cares about. */
export function tipY(s: BeyState, spec: BeySpec): number {
  return s.pos.y + spec.tipOffset;
}

/**
 * Settle the bey onto a surface at `surfaceY`, bouncing by `restitution`.
 *
 * Returns true if it came to rest this call. The small-velocity cutoff is what
 * stops a bey from bouncing forever at ever-decreasing amplitude — without it
 * `grounded` never latches and friction never applies.
 */
export function resolveLanding(
  s: BeyState, spec: BeySpec, surfaceY: number, restitution: number,
): boolean {
  if (tipY(s, spec) > surfaceY) return false;

  s.pos.y = surfaceY - spec.tipOffset;
  if (s.vel.y < 0) {
    s.vel.y = -s.vel.y * restitution;
    if (Math.abs(s.vel.y) < 5) { s.vel.y = 0; s.grounded = true; }
  }
  if (s.vel.y === 0) s.grounded = true;
  return s.grounded;
}

/** Horizontal speed, cm/s. */
export const speedH = (s: BeyState): number => Math.hypot(s.vel.x, s.vel.z);

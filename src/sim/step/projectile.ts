import type { Vec3 } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 10c — PROJECTILES THAT HIT THINGS  (ledger N9, ~60 cases)

   `ProjectileManager` spawns bullets, moves them in orbit and boomerang
   modes, and expires them. Its ONLY distance test is a self-check for
   boomerang return, so bullets pass through the bey, the walls and each
   other. Fifty-three corpus moves are projectile-based and not one of them
   can work.

   TWO DELIVERY PATHS, AND THE CORPUS DISAGREES WITH ITSELF ABOUT WHICH.
   This is a Ledger-only finding worth restating: CS15's projectile moves are
   framed in prose and physics as spawned bodies — Vulcan Cannon, the
   explosion-propelled fire projectile, the flaming rock — but their actual
   TypeScript collapses to a single `applyForce(target.id, ...)`. A direct
   hit, with no body ever created. Implementing the code verbatim would not
   need a projectile system at all.

   Both are supported here, deliberately, because they are genuinely different
   mechanics rather than two spellings of one: a spawned body can MISS, be
   dodged, or hit a wall, and a direct application cannot. Which one a move
   uses is authored, not guessed.

   LIFETIME IS EXPLICIT. Today bullets expire only via `expireAll()`, which
   nothing routinely calls, so anything spawned flies forever by default. Here
   `onCollision` is the default and `persistent` must be opted into — an
   orbiting satellite that is part of the bey is the legitimate case for it.
   ══════════════════════════════════════════════════════════════════════════ */

export type ProjectileLifetime =
  /** Despawn on the first hit. The default, and what a cannon shot wants. */
  | { kind: 'onCollision' }
  /** Despawn after a fixed time regardless of what it touched. */
  | { kind: 'timed'; lifetimeMs: number }
  /** Never despawns on its own. Opt-in only — e.g. a bound satellite. */
  | { kind: 'persistent' };

export interface Projectile {
  id: string;
  /** Who fired it. A bullet must never hit its own owner. */
  ownerId: string;
  /** Team tag, so friendly fire can be ruled out without naming every ally. */
  team: string | null;
  pos: Vec3;
  vel: Vec3;
  radius: number;
  /** Momentum it carries into a hit. */
  mass: number;
  lifetime: ProjectileLifetime;
  /** Sim-ms since spawn. Advanced by `stepProjectile`. */
  ageMs: number;
  /** Set once it should be removed. */
  dead: boolean;
}

/** A thing a projectile can hit. */
export interface ProjectileTarget {
  id: string;
  team: string | null;
  pos: Vec3;
  /** Contact radius in XZ. */
  radius: number;
  /** Vertical contact band, as offsets from `pos.y`. */
  contactLow: number;
  contactHigh: number;
}

export interface ProjectileHit {
  projectileId: string;
  targetId: string;
  /** Impulse delivered along the travel direction, mass·cm/s. */
  impulse: number;
  /** Where it landed, world Y. */
  contactY: number;
}

/** Advance one projectile. Returns false once it has expired on its own. */
export function stepProjectile(p: Projectile, dtMs: number): boolean {
  if (p.dead) return false;
  const dt = dtMs / 1000;
  p.pos.x += p.vel.x * dt;
  p.pos.y += p.vel.y * dt;
  p.pos.z += p.vel.z * dt;
  p.ageMs += dtMs;

  if (p.lifetime.kind === 'timed' && p.ageMs >= p.lifetime.lifetimeMs) {
    p.dead = true;
    return false;
  }
  return true;
}

/**
 * May this projectile hit this target?
 *
 * Ownership first, then team. Without the owner check a bey firing in its own
 * direction of travel immediately shoots itself, which is both wrong and the
 * kind of bug that looks like a physics problem.
 */
export function canHit(p: Projectile, t: ProjectileTarget): boolean {
  if (t.id === p.ownerId) return false;
  if (p.team !== null && t.team !== null && p.team === t.team) return false;
  return true;
}

/**
 * Test one projectile against one target.
 *
 * Height-banded for the same reason bey-vs-bey contact is: a low-flying shot
 * should pass under a tall bey rather than clipping it because the two happen
 * to overlap in plan view.
 */
export function projectileHit(p: Projectile, t: ProjectileTarget): ProjectileHit | null {
  if (p.dead || !canHit(p, t)) return null;

  const dx = t.pos.x - p.pos.x;
  const dz = t.pos.z - p.pos.z;
  const reach = p.radius + t.radius;
  if (dx * dx + dz * dz >= reach * reach) return null;

  const lo = t.pos.y + t.contactLow;
  const hi = t.pos.y + t.contactHigh;
  if (p.pos.y < lo - p.radius || p.pos.y > hi + p.radius) return null;

  const speed = Math.hypot(p.vel.x, p.vel.z);
  if (p.lifetime.kind === 'onCollision') p.dead = true;

  return {
    projectileId: p.id,
    targetId: t.id,
    impulse: p.mass * speed,
    contactY: Math.min(hi, Math.max(lo, p.pos.y)),
  };
}

/** Resolve a volley against a roster. One hit per projectile per step. */
export function resolveProjectiles(
  projectiles: Projectile[], targets: ProjectileTarget[],
): ProjectileHit[] {
  const hits: ProjectileHit[] = [];
  for (const p of projectiles) {
    for (const t of targets) {
      const h = projectileHit(p, t);
      if (h) { hits.push(h); break; }
    }
  }
  return hits;
}

/**
 * The OTHER delivery path: a direct application with no body.
 *
 * This is what CS15's projectile moves actually compile to. Kept as a named
 * function rather than letting callers hand-roll it, so the two paths can be
 * compared — the plan's acceptance test for N9 is that a spawned body and a
 * direct hit agree on the impulse they deliver.
 */
export function directStrike(
  ownerId: string, target: ProjectileTarget, impulse: number,
): ProjectileHit {
  return {
    projectileId: `direct:${ownerId}`,
    targetId: target.id,
    impulse,
    contactY: target.pos.y + (target.contactLow + target.contactHigh) / 2,
  };
}

/** Lead-aim: where to shoot so a constant-velocity target is met. */
export function leadAim(
  from: Vec3, target: Vec3, targetVel: Vec3, projectileSpeed: number,
): Vec3 {
  const dx = target.x - from.x, dz = target.z - from.z;
  const dist = Math.hypot(dx, dz);
  if (projectileSpeed <= 0 || dist < 1e-9) return { x: 1, y: 0, z: 0 };

  /* One iteration of "time to reach where it is, then aim where it will be".
     Exact solution is a quadratic; this converges well inside a bey's radius
     at the ranges an arena allows, and degrades to a straight shot when the
     target is slow. */
  const t = dist / projectileSpeed;
  const px = target.x + targetVel.x * t;
  const pz = target.z + targetVel.z * t;
  const ax = px - from.x, az = pz - from.z;
  const len = Math.hypot(ax, az) || 1;
  return { x: ax / len, y: 0, z: az / len };
}

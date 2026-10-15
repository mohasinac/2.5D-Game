import type { Vec3 } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 18b — CLONES, DECOYS AND AFTERIMAGES  (ledger N12)

   CS13 1453/1664/1665 and CS15 2063/2064 need an entity that is VISIBLE and
   has a position but does not collide: Driger's stroboscopic clone effect,
   Infinite Assault's illusions, the hologram ambush.

   DISTINCT FROM BOTH NEIGHBOURS, which is the reason this is its own module
   rather than a flag on something else:
     • not a projectile — it carries no impulse and hits nothing
     • not a bey — it has no spec, no spin, no mass, and must never appear in
       `resolveBeyPairs`

   Getting that wrong in either direction is a real bug: a clone in the
   collision set gives the opponent something solid to bounce off, and a clone
   that an AI treats as real makes it chase a ghost — which, to be fair, is
   exactly what a decoy is FOR, so `deceivesAi` is a property rather than an
   accident.
   ══════════════════════════════════════════════════════════════════════════ */

export type CloneKind =
  /** Follows behind the real bey on a delay. Pure visual. */
  | 'afterimage'
  /** Holds a position; meant to be mistaken for the real bey. */
  | 'decoy'
  /** Orbits the owner, as in the stroboscopic multi-image effect. */
  | 'orbit';

export interface Clone {
  id: string;
  ownerId: string;
  kind: CloneKind;
  pos: Vec3;
  /** 0..1, for the renderer. Afterimages fade along their lifetime. */
  opacity: number;
  ageMs: number;
  lifetimeMs: number;
  /** Should opponent AI target this as though it were real? */
  deceivesAi: boolean;
  /** Orbit radius and phase, for `orbit` clones. */
  orbitRadius: number;
  orbitPhase: number;
}

/** How far behind the owner an afterimage trails, ms. */
export const AFTERIMAGE_DELAY_MS = 90;
/** Orbit rate for stroboscopic clones, rad/s. */
export const CLONE_ORBIT_RATE = 9;

export function makeClone(over: Partial<Clone> & Pick<Clone, 'id' | 'ownerId'>): Clone {
  return {
    kind: 'afterimage',
    pos: { x: 0, y: 0, z: 0 },
    opacity: 1,
    ageMs: 0,
    lifetimeMs: 600,
    deceivesAi: false,
    orbitRadius: 12,
    orbitPhase: 0,
    ...over,
  };
}

/**
 * Advance one clone. Returns false once it has expired.
 *
 * `ownerTrail` is the owner's recent positions, newest last — an afterimage
 * samples where the owner WAS rather than interpolating toward where it is,
 * so the trail follows the real path around a curve instead of cutting the
 * corner.
 */
export function stepClone(
  c: Clone, dtMs: number, ownerPos: Vec3, ownerTrail: readonly Vec3[],
): boolean {
  c.ageMs += dtMs;
  if (c.ageMs >= c.lifetimeMs) return false;

  const life = c.ageMs / c.lifetimeMs;

  switch (c.kind) {
    case 'afterimage': {
      const back = Math.min(
        ownerTrail.length - 1,
        Math.max(0, Math.round(AFTERIMAGE_DELAY_MS / Math.max(1, dtMs))),
      );
      const p = ownerTrail[ownerTrail.length - 1 - back] ?? ownerPos;
      c.pos = { x: p.x, y: p.y, z: p.z };
      c.opacity = 1 - life;
      break;
    }
    case 'decoy':
      /* Holds station and stays solid-looking until it pops, because a decoy
         that fades is not a decoy. */
      c.opacity = life > 0.85 ? (1 - life) / 0.15 : 1;
      break;
    case 'orbit':
      c.orbitPhase += CLONE_ORBIT_RATE * (dtMs / 1000);
      c.pos = {
        x: ownerPos.x + Math.cos(c.orbitPhase) * c.orbitRadius,
        y: ownerPos.y,
        z: ownerPos.z + Math.sin(c.orbitPhase) * c.orbitRadius,
      };
      c.opacity = 0.65;
      break;
  }
  return true;
}

/** Advance a set, dropping the expired. */
export function stepClones(
  clones: Clone[], dtMs: number, ownerPos: Vec3, ownerTrail: readonly Vec3[],
): Clone[] {
  return clones.filter(c => stepClone(c, dtMs, ownerPos, ownerTrail));
}

/**
 * What an AI should believe is a target.
 *
 * Real beys always; clones only when they are meant to deceive. Keeping this
 * as one function means an AI cannot accidentally see through a decoy by
 * reading the roster directly — it has to ask, and asking is the deception.
 */
export function aiTargets<T extends { id: string; pos: Vec3 }>(
  real: readonly T[], clones: readonly Clone[],
): { id: string; pos: Vec3; real: boolean }[] {
  const out = real.map(r => ({ id: r.id, pos: r.pos, real: true }));
  for (const c of clones) {
    if (c.deceivesAi) out.push({ id: c.id, pos: c.pos, real: false });
  }
  return out;
}

/** A rolling position trail for the owner, for afterimages to sample. */
export class PositionTrail {
  private buf: Vec3[] = [];
  constructor(private readonly capacity = 32) {}

  push(p: Vec3): void {
    this.buf.push({ x: p.x, y: p.y, z: p.z });
    if (this.buf.length > this.capacity) this.buf.shift();
  }
  get(): readonly Vec3[] { return this.buf; }
  clear(): void { this.buf.length = 0; }
}

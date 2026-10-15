import type { Vec3 } from '../sim/state';

/* ══════════════════════════════════════════════════════════════════════════
   BEY LINKS — cooperative moves  (ledger code L, ~25 cases)

   The last STILL GAP of the three. Twin Tornado Attack, Dragoon Tank
   (Tyson + Daichi), the two-bey saw, Grand Deucalion, the Blade Sharks'
   triangle formation, Multi-Beast Alliance.

   THE CORPUS IS THIN HERE AND THAT IS THE INTERESTING PART. Searching it
   gives cooperative 22, dual-bey 5, alliance 1 — against vortex's 1,337.
   So unlike almost everything else in this project, these cases cannot be
   extracted; the mechanic has to be DESIGNED and then checked against the
   named moves rather than derived from them. The plan says so outright:
   "This needs authoring, not extraction."

   WHAT THE NAMED MOVES ACTUALLY REQUIRE, read off the cases:

     Twin Tornado (CS15 1919/1920) — two vortices PHASE-LOCKED, so the
       combined field is stronger than either alone. Needs a shared phase.
     Dragoon Tank (CS13 1179/1180) — one bey rides/pushes the other, so
       they move as one body. Needs a rigid-ish constraint.
     Triangle Attack (CS15 1955/1956) — three beys holding a FORMATION and
       striking simultaneously. Needs relative station-keeping.
     Grand Deucalion (CS13 1534/1535) — momentum SUPERPOSITION on a shared
       target.

   Three shapes, not twenty-five, which is why this is one small module.
   ══════════════════════════════════════════════════════════════════════════ */

export type LinkKind =
  /** Phase-locked field effects: two tornadoes reinforcing. */
  | 'resonance'
  /** Station-keeping: hold a relative offset, strike together. */
  | 'formation'
  /** Near-rigid: one carries or pushes the other. */
  | 'tandem';

export interface BeyLink {
  id: string;
  kind: LinkKind;
  /** Participants, in order. `members[0]` leads a tandem or a formation. */
  members: string[];
  /**
   * Shared phase, radians. What makes two vortices reinforce rather than
   * interfere — the thing a pair of independent fields cannot do.
   */
  phase: number;
  /** How strongly the link pulls members toward their station, 0..1. */
  cohesion: number;
  /** Formation offsets from the leader, one per follower. */
  offsets: Vec3[];
  /** Set once the link is no longer valid — a member died or drifted off. */
  broken: boolean;
}

/**
 * Beyond this separation a link breaks.
 *
 * Without it, two beys at opposite ends of the arena stay "linked" and the
 * cohesion term drags them across the dish — the same class of bug the
 * channel resolver's proximity test exists to prevent.
 */
export const LINK_MAX_SEPARATION = 120;

/** Amplification a fully phase-locked resonance pair produces. */
export const RESONANCE_GAIN = 1.8;

export function makeLink(
  id: string, kind: LinkKind, members: string[], over: Partial<BeyLink> = {},
): BeyLink {
  return {
    id, kind, members,
    phase: 0,
    cohesion: kind === 'tandem' ? 0.9 : 0.4,
    offsets: [],
    broken: false,
    ...over,
  };
}

/**
 * How aligned the members' phases are, 0..1.
 *
 * 1 is perfectly locked. The amplification is `1 + (gain-1)·alignment`, so a
 * sloppy pairing gets almost nothing and a tight one gets the full bonus —
 * which is what makes a cooperative move a SKILL rather than a free
 * multiplier for having a partner.
 */
export function phaseAlignment(phases: readonly number[]): number {
  if (phases.length < 2) return 0;
  let sx = 0, sy = 0;
  for (const p of phases) { sx += Math.cos(p); sy += Math.sin(p); }
  /* Mean resultant length of unit vectors — 1 when identical, 0 when evenly
     spread. The standard circular-statistics measure, and it generalises to
     three or more members without a special case. */
  return Math.hypot(sx, sy) / phases.length;
}

/** Field strength multiplier for a resonance link. */
export function resonanceGain(link: BeyLink, phases: readonly number[]): number {
  if (link.kind !== 'resonance' || link.broken) return 1;
  return 1 + (RESONANCE_GAIN - 1) * phaseAlignment(phases);
}

/**
 * Station a follower should hold, in world space.
 *
 * The offset is rotated into the leader's heading, so a formation turns with
 * the leader rather than staying bolted to the world axes — otherwise three
 * beys "in triangle" scatter the moment the leader changes direction.
 */
export function stationFor(
  leaderPos: Vec3, leaderHeading: Vec3, offset: Vec3,
): Vec3 {
  const len = Math.hypot(leaderHeading.x, leaderHeading.z) || 1;
  const fx = leaderHeading.x / len, fz = leaderHeading.z / len;
  // Right-hand perpendicular in XZ.
  const rx = -fz, rz = fx;
  return {
    x: leaderPos.x + fx * offset.z + rx * offset.x,
    y: leaderPos.y + offset.y,
    z: leaderPos.z + fz * offset.z + rz * offset.x,
  };
}

/**
 * Steering a follower needs to hold station, as a unit XZ direction.
 *
 * Returns a zero vector when already on station, so the caller can treat it
 * like any other intent and blend it rather than branching on "is linked".
 */
export function stationSteering(selfPos: Vec3, station: Vec3): Vec3 {
  const dx = station.x - selfPos.x;
  const dz = station.z - selfPos.z;
  const d = Math.hypot(dx, dz);
  if (d < 1e-6) return { x: 0, y: 0, z: 0 };
  return { x: dx / d, y: 0, z: dz / d };
}

/** Advance the shared phase and check the link still makes sense. */
export function stepLink(
  link: BeyLink, dt: number, positions: ReadonlyMap<string, Vec3>,
): boolean {
  if (link.broken) return false;

  /* Any member gone, or any pair too far apart, ends it. */
  const pts: Vec3[] = [];
  for (const id of link.members) {
    const p = positions.get(id);
    if (!p) { link.broken = true; return false; }
    pts.push(p);
  }
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (Math.hypot(pts[i].x - pts[j].x, pts[i].z - pts[j].z) > LINK_MAX_SEPARATION) {
        link.broken = true;
        return false;
      }
    }
  }

  link.phase += dt * 4;
  return true;
}

/**
 * Combined impulse of a simultaneous strike — Grand Deucalion's
 * "momentum superposition".
 *
 * Superposition is scaled by alignment for the same reason resonance is:
 * two beys hitting a target at the same instant is a cooperative move, two
 * hitting it a second apart is just two hits.
 */
export function combinedStrike(
  impulses: readonly number[], phases: readonly number[],
): number {
  const total = impulses.reduce((a, b) => a + b, 0);
  return total * (1 + phaseAlignment(phases));
}

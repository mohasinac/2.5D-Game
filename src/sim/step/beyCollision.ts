import type { Vec3 } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   BEY-VS-BEY COLLISION  —  pure, THREE-free, deterministic.

   The single largest gap in the project. There has only ever been ONE physics
   entity, so every attack ring, blade, wheel and layer in the part library is
   geometry that can never strike anything: per the case ledger this one
   missing primitive blocks roughly 700 cases on its own.

   TWO THINGS THIS DOES, AND ONE IT DELIBERATELY DOES NOT.

   It resolves contact: circle overlap in XZ, impulse exchange weighted by
   mass, restitution from the pair's materials, and depenetration split by
   inverse mass so a heavy bey shoves a light one rather than both giving way
   equally.

   It also matches CONTACT HEIGHT (ledger item N5). Which part of A strikes
   which part of B is not decoration — a 145-height track means the attacker's
   wheel meets the opponent's underside rather than its layer, and the corpus
   turns on this repeatedly (CS1 Case 11, CS6 303, CS8 388, CS9 1129, CS15
   1892). Heights are authorable today and nothing reads them. Here, two beys
   whose vertical contact bands do not overlap simply MISS: one passes under
   the other. When they do overlap, the band is reported so a caller can
   resolve which part was involved.

   It does NOT model spin. Spin direction is stored project-wide and unused,
   and making it matter — counter-spin relative surface velocity, spin-steal —
   is its own piece of work with its own contested constants in the corpus.
   Mixing a half-considered spin term into the contact resolver now would make
   both harder to get right. Contact first, spin separately.
   ══════════════════════════════════════════════════════════════════════════ */

/** A bey reduced to what contact needs. */
export interface BeyBody {
  id: string;
  pos: Vec3;
  vel: Vec3;
  /** Girth radius — the XZ contact boundary. */
  radius: number;
  /** Grams. Only ratios matter, so the unit just has to be consistent. */
  mass: number;
  /** Lowest contact surface, as an offset from `pos.y` (negative = below). */
  contactLow: number;
  /** Highest contact surface, as an offset from `pos.y`. */
  contactHigh: number;
  restitution: number;
}

/** What happened, for damage, spin loss, VFX and part resolution upstream. */
export interface BeyContact {
  a: string;
  b: string;
  /** Penetration depth in cm at the moment of resolution. */
  depth: number;
  /** Closing speed along the contact normal, before the impulse. */
  approachSpeed: number;
  /** Scalar impulse applied, in mass·cm/s. */
  impulse: number;
  /** World Y of the middle of the shared contact band — "where they hit". */
  contactY: number;
  /** Height of the shared band. A graze at the very lip of two parts
   *  transfers less than a full-face meeting, and this is what says which. */
  overlapHeight: number;
}

/**
 * Contact tolerance. Resolving sub-millimetre overlaps every tick produces
 * jitter rather than accuracy, and 1 mm is the project's minimum feature size.
 */
export const BEY_CONTACT_EPS = 0.1;

/**
 * The vertical band two bodies share, or null if they miss each other.
 *
 * THIS IS THE PART THAT MAKES TRACK HEIGHT MEAN SOMETHING. Without it a tall
 * bey and a short one collide as two circles regardless of whether anything on
 * one could physically reach the other.
 */
export function contactBand(a: BeyBody, b: BeyBody): { lo: number; hi: number } | null {
  const aLo = a.pos.y + a.contactLow,  aHi = a.pos.y + a.contactHigh;
  const bLo = b.pos.y + b.contactLow,  bHi = b.pos.y + b.contactHigh;
  const lo = Math.max(aLo, bLo);
  const hi = Math.min(aHi, bHi);
  return hi > lo ? { lo, hi } : null;
}

/**
 * Resolve one pair. Returns the contact, or null if they did not touch.
 *
 * Mutates both bodies' `pos` and `vel` in place — the same contract as the
 * obstacle and channel resolvers, so `SpawnManager` can keep pointing its sim
 * vectors straight at its own `Vector3`s.
 */
export function resolveBeyPair(a: BeyBody, b: BeyBody): BeyContact | null {
  const dx = b.pos.x - a.pos.x;
  const dz = b.pos.z - a.pos.z;
  const distSq = dx * dx + dz * dz;
  const sumR = a.radius + b.radius;
  if (distSq >= sumR * sumR) return null;

  const band = contactBand(a, b);
  if (!band) return null;            // one passes under the other

  const dist = Math.sqrt(distSq);
  const depth = sumR - dist;
  if (depth < BEY_CONTACT_EPS) return null;

  /* Exactly concentric: no contact normal exists. Pick +X rather than divide
     by zero — a NaN here would poison both positions permanently. */
  let nx: number, nz: number;
  if (dist < 1e-6) { nx = 1; nz = 0; }
  else             { nx = dx / dist; nz = dz / dist; }

  /* Closing speed along the normal. Positive means approaching. */
  const rvx = b.vel.x - a.vel.x;
  const rvz = b.vel.z - a.vel.z;
  const vn  = rvx * nx + rvz * nz;

  const invA = a.mass > 0 ? 1 / a.mass : 0;
  const invB = b.mass > 0 ? 1 / b.mass : 0;
  const invSum = invA + invB;
  /* Two immovable bodies cannot be resolved; leave them rather than divide by
     zero. Nothing in the game builds one, but a zero mass is cheap to guard. */
  if (invSum === 0) return null;

  /* DEPENETRATE BY INVERSE MASS, not evenly. A heavy defence bey should shove
     a light attacker out of the way, not meet it in the middle — that split
     is most of what "weight class" means in play. */
  const corrA = depth * (invA / invSum);
  const corrB = depth * (invB / invSum);
  a.pos.x -= nx * corrA;  a.pos.z -= nz * corrA;
  b.pos.x += nx * corrB;  b.pos.z += nz * corrB;

  let impulse = 0;
  if (vn < 0) {
    /* Only exchange impulse when they are closing. Already-separating bodies
       are merely overlapping from a previous frame; hitting them again adds
       energy and makes contacts buzz. */
    const e = Math.min(a.restitution, b.restitution);
    impulse = -(1 + e) * vn / invSum;
    a.vel.x -= impulse * invA * nx;
    a.vel.z -= impulse * invA * nz;
    b.vel.x += impulse * invB * nx;
    b.vel.z += impulse * invB * nz;
  }

  return {
    a: a.id, b: b.id,
    depth,
    approachSpeed: -vn,
    impulse,
    contactY: (band.lo + band.hi) / 2,
    overlapHeight: band.hi - band.lo,
  };
}

/**
 * Resolve every unordered pair once.
 *
 * O(n²), which is correct for this game: the roster is 2-6 beys, so a spatial
 * index would cost more in complexity than it saves in comparisons. Each pair
 * is visited once — resolving both (a,b) and (b,a) would double every impulse.
 */
export function resolveBeyPairs(bodies: BeyBody[]): BeyContact[] {
  const contacts: BeyContact[] = [];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const c = resolveBeyPair(bodies[i], bodies[j]);
      if (c) contacts.push(c);
    }
  }
  return contacts;
}

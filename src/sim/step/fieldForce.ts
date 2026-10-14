import type { Vec3 } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 11c + 14c — FIELD FORCES: MAGNETISM, VORTICES, SHOCKWAVES

   By corpus volume this is the LARGEST special-move mechanic — vortex 1,337
   occurrences, tornado 561, aoe 477, against 53 projectile cases — and it is
   almost entirely absent. `TriggerZoneManager` is built and never registered;
   `gravity_pull` works but is RADIAL-INWARD ONLY, so every vortex (which
   needs a tangential component) and every barrier or repel (which needs an
   outward one) is inexpressible.

   Generalising one force model covers all of it, plus magnetism (N6) and the
   stadium's own cyclone points. The corpus models vortices as RANKINE
   VORTICES — solid-body rotation inside a core radius, free-vortex `1/r`
   falloff outside — which is the standard two-region model and gives both
   the inward pull and the swirl from one definition.

   MAGNETISM (N6) finally gives `tipPolarity` a consumer. It has been stored
   and exposed with zero readers, so the entire Magnacore system is dead:
   same poles repel and "those Beyblades will never hit each other and the
   battle becomes one of endurance"; opposite poles attract and "both
   Beyblades consistently make contact and attack each other violently".
   That is a movement modifier, so it belongs in the same blend as everything
   else here rather than in a subsystem of its own.
   ══════════════════════════════════════════════════════════════════════════ */

export type FieldKind =
  /** Pulls inward. `gravity_pull` is this and only this today. */
  | 'attract'
  /** Pushes outward — barriers, repel fields, shockwave fronts. */
  | 'repel'
  /** Rankine vortex: inward pull plus tangential swirl. */
  | 'vortex'
  /** Pure swirl with no radial component — a cyclone point. */
  | 'spin';

export interface FieldEffect {
  id: string;
  kind: FieldKind;
  /** Centre, world. Fields may move; `TranslationManager` can drive this. */
  centre: Vec3;
  /** Outer extent, cm. Nothing outside this is affected. */
  radius: number;
  /** Rankine core radius, cm. Inside it the swirl is solid-body. */
  coreRadius: number;
  /** Peak acceleration, cm/s². */
  strength: number;
  /** Fraction of the force that is tangential rather than radial, 0..1. */
  swirl: number;
}

/**
 * Cap on the total acceleration any stack of fields may apply.
 *
 * Fields compose additively and specials overlap, so without a cap a pile-up
 * flings a bey to infinity — which is both wrong and unrecoverable, because
 * it leaves the arena and never comes back.
 */
export const FIELD_ACCEL_CAP = 4000;

/**
 * Rankine radial profile: linear inside the core, `1/r` outside.
 *
 * The two-region shape matters. A pure `1/r` diverges at the centre, so a bey
 * that reaches the eye of a vortex receives unbounded force; solid-body
 * rotation inside the core removes that without a fudge factor.
 */
export function rankineProfile(distance: number, coreRadius: number, radius: number): number {
  if (distance >= radius) return 0;
  if (coreRadius <= 0) return 1;
  if (distance <= coreRadius) return distance / coreRadius;
  return coreRadius / distance;
}

/** Acceleration one field applies to a body at `pos`, cm/s². */
export function fieldAccel(field: FieldEffect, pos: Vec3): Vec3 {
  const dx = pos.x - field.centre.x;
  const dz = pos.z - field.centre.z;
  const dist = Math.hypot(dx, dz);
  if (dist >= field.radius) return { x: 0, y: 0, z: 0 };

  /* At the exact centre there is no direction; a radial field does nothing
     and a swirl has nothing to swirl around. */
  if (dist < 1e-6) return { x: 0, y: 0, z: 0 };

  const profile = rankineProfile(dist, field.coreRadius, field.radius);
  const mag = field.strength * profile;

  const outX = dx / dist, outZ = dz / dist;
  const tanX = -outZ,     tanZ = outX;

  let radial = 0, swirl = 0;
  switch (field.kind) {
    case 'attract': radial = -mag; break;
    case 'repel':   radial = +mag; break;
    case 'vortex':  radial = -mag * (1 - field.swirl); swirl = mag * field.swirl; break;
    case 'spin':    swirl  = mag; break;
  }

  return {
    x: outX * radial + tanX * swirl,
    y: 0,
    z: outZ * radial + tanZ * swirl,
  };
}

/** Sum every field at a point, capped. */
export function totalFieldAccel(fields: Iterable<FieldEffect>, pos: Vec3): Vec3 {
  let x = 0, z = 0;
  for (const f of fields) {
    const a = fieldAccel(f, pos);
    x += a.x; z += a.z;
  }
  const mag = Math.hypot(x, z);
  if (mag > FIELD_ACCEL_CAP) {
    const k = FIELD_ACCEL_CAP / mag;
    x *= k; z *= k;
  }
  return { x, y: 0, z };
}

/* ── Expanding wavefronts ────────────────────────────────────────────────── */

export interface Shockwave {
  id: string;
  centre: Vec3;
  /** Current front radius, cm. Grows with `stepShockwave`. */
  radius: number;
  /** cm/s. */
  speed: number;
  /** Impulse delivered as the front passes, mass·cm/s. */
  impulse: number;
  /** Front thickness, cm. A body within this of the front is struck. */
  thickness: number;
  /** Ids already hit — a front passes each body ONCE. */
  struck: Set<string>;
  maxRadius: number;
}

/** Advance a front. Returns false once it has expired. */
export function stepShockwave(w: Shockwave, dt: number): boolean {
  w.radius += w.speed * dt;
  return w.radius <= w.maxRadius;
}

/**
 * Has the front just reached this body?
 *
 * The `struck` set is what makes it an impulse rather than a sustained field:
 * without it a slow-moving front inside a body's radius would hit it every
 * tick, which is a completely different mechanic.
 */
export function shockwaveHit(w: Shockwave, id: string, pos: Vec3): Vec3 | null {
  if (w.struck.has(id)) return null;
  const dx = pos.x - w.centre.x;
  const dz = pos.z - w.centre.z;
  const dist = Math.hypot(dx, dz);
  if (Math.abs(dist - w.radius) > w.thickness) return null;

  w.struck.add(id);
  if (dist < 1e-6) return { x: w.impulse, y: 0, z: 0 };
  return { x: (dx / dist) * w.impulse, y: 0, z: (dz / dist) * w.impulse };
}

/* ── Magnetism (N6) ──────────────────────────────────────────────────────── */

export type Polarity = 'north' | 'south' | 'none';

/**
 * Force between two magnetic bodies, cm/s² on the first.
 *
 * Like poles repel, opposite attract, and `none` does nothing — the rule the
 * Magnacore system has always had on paper. Inverse-square with a floor so
 * two beys in contact do not receive an unbounded force.
 */
export function magneticAccel(
  a: Vec3, aPol: Polarity, b: Vec3, bPol: Polarity, strength: number,
): Vec3 {
  if (aPol === 'none' || bPol === 'none') return { x: 0, y: 0, z: 0 };
  const dx = b.x - a.x, dz = b.z - a.z;
  const dist = Math.hypot(dx, dz);
  if (dist < 1e-6) return { x: 0, y: 0, z: 0 };

  const floor = 5;                       // cm — bodies cannot be closer than this
  const d = Math.max(dist, floor);
  const mag = strength / (d * d);
  const sign = aPol === bPol ? +1 : -1;  // like repels, opposite attracts
  return { x: (dx / dist) * mag * sign * -1, y: 0, z: (dz / dist) * mag * sign * -1 };
}

/**
 * Pull from stadium floor magnets on a bey of a given core polarity.
 *
 * Verified behaviour: a South Magnecore is REPELLED by the stadium magnets,
 * giving more attack and speed and movement that becomes "more irregular and
 * unpredictable"; a North core is attracted, giving "drastically more
 * defence" and resistance to being pushed. Returning a signed radial
 * acceleration reproduces both from one expression.
 */
export function stadiumMagnetAccel(
  pos: Vec3, centre: Vec3, polarity: Polarity, strength: number, radius: number,
): Vec3 {
  if (polarity === 'none') return { x: 0, y: 0, z: 0 };
  const dx = pos.x - centre.x, dz = pos.z - centre.z;
  const dist = Math.hypot(dx, dz);
  if (dist < 1e-6 || dist > radius) return { x: 0, y: 0, z: 0 };

  const falloff = 1 - dist / radius;
  const mag = strength * falloff;
  const sign = polarity === 'south' ? +1 : -1;   // south repelled, north drawn in
  return { x: (dx / dist) * mag * sign, y: 0, z: (dz / dist) * mag * sign };
}

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 17c — ARENA SURFACE MUTATION AT RUNTIME  (ledger N14)

   Weather exists; MUTATING THE COLLISION SURFACE does not. Six stadiums and
   the Flame Libra chain depend on it:

     • CS10 Case 573 — Brick Courtyard, rain accumulating and shrinking the
       usable arena FROM THE CENTRE OUT
     • CS10 Case 574 — Blizzard Bowl, snow shrinking it FROM THE RIM IN
     • CS15 1901/1904/1905 — the floor converting to fluidised sand within a
       growing radius

   Two opposite directions and a material change, which is why this is one
   mechanic rather than three: an annulus of altered surface with a moving
   inner or outer edge.

   Pure and tiny on purpose. It answers "what is the surface like HERE, now",
   and the arena layer decides what to do about it — the collision resolvers
   already take a `surfaceMu`, so nothing downstream needs to know the floor
   is changing underneath it.
   ══════════════════════════════════════════════════════════════════════════ */

export type MutationDirection =
  /** Grows outward from the centre — rain pooling in the dish. */
  | 'centre_out'
  /** Grows inward from the rim — snow banking up against the wall. */
  | 'rim_in';

export interface SurfaceMutation {
  id: string;
  direction: MutationDirection;
  /** Arena radius, cm. The edge the mutation grows from or toward. */
  arenaRadius: number;
  /** How fast the affected edge advances, cm/s. */
  rateCmPerSec: number;
  /** Current extent, cm, from the direction's own origin. */
  extent: number;
  /** Friction of the altered surface. */
  mutatedMu: number;
  /** Restitution of the altered surface. */
  mutatedRestitution: number;
  /**
   * Does the altered region stop being playable entirely?
   *
   * Rain pooling is still drivable but slow; deep snow at the rim is not.
   * "Shrinking the usable arena" means different things in the two cases and
   * conflating them would make one of the stadiums wrong.
   */
  impassable: boolean;
}

/** Advance the mutation. Clamped so it cannot grow past the arena. */
export function stepSurfaceMutation(m: SurfaceMutation, dt: number): void {
  m.extent = Math.min(m.arenaRadius, Math.max(0, m.extent + m.rateCmPerSec * dt));
}

/** Is a point inside the altered region? */
export function isMutated(m: SurfaceMutation, distanceFromCentre: number): boolean {
  return m.direction === 'centre_out'
    ? distanceFromCentre <= m.extent
    : distanceFromCentre >= m.arenaRadius - m.extent;
}

/** Radius still playable, cm. What "the arena is shrinking" actually means. */
export function usableRadius(m: SurfaceMutation): number {
  if (!m.impassable) return m.arenaRadius;
  return m.direction === 'centre_out'
    ? m.arenaRadius               // the middle is fouled; the ring still plays
    : Math.max(0, m.arenaRadius - m.extent);
}

export interface SurfaceSample {
  mu: number;
  restitution: number;
  impassable: boolean;
}

/**
 * The surface at a point, after every active mutation.
 *
 * Later mutations win where they overlap, rather than averaging. Averaging
 * would produce a surface that is neither the original nor the mutation,
 * which is a value no case ever describes and which would be invisible to
 * debug — exactly the sort of quiet wrongness this project keeps finding.
 */
export function sampleSurface(
  base: SurfaceSample,
  mutations: Iterable<SurfaceMutation>,
  distanceFromCentre: number,
): SurfaceSample {
  let out = base;
  for (const m of mutations) {
    if (isMutated(m, distanceFromCentre)) {
      out = { mu: m.mutatedMu, restitution: m.mutatedRestitution, impassable: m.impassable };
    }
  }
  return out;
}

/* ── Part wear and fracture (17d, ledger N15) ────────────────────────────── */

/**
 * Accumulated wear on one part.
 *
 * Lowest priority of the sixteen new features and modelled minimally on
 * purpose. What it unlocks is the editor-only `isDestructible`/`hitPoints`
 * wall flags, CS10 Case 569's eighteen breakable trees, and CS14 Case 903's
 * ripcord tooth wear — plus every "mold-dependent" and "wear-in" case, which
 * are about a part's behaviour CHANGING with use rather than breaking.
 */
export interface WearState {
  /** 0 = pristine, 1 = destroyed. */
  wear: number;
  /** Impacts survived. Some cases key off count rather than accumulated load. */
  impacts: number;
  broken: boolean;
}

export const FRESH: WearState = { wear: 0, impacts: 0, broken: false };

/**
 * Apply one impact.
 *
 * `toughness` is the impulse the part absorbs over its whole life, so a given
 * hit costs `impulse / toughness` of it. Linear accumulation rather than a
 * threshold: a part that shrugs off ninety-nine hits and shatters on the
 * hundredth reads as arbitrary, whereas visible degradation is the thing the
 * "wear-in" cases are actually describing.
 */
export function applyWear(w: WearState, impulse: number, toughness: number): WearState {
  if (w.broken || toughness <= 0) return w;
  const wear = Math.min(1, w.wear + Math.abs(impulse) / toughness);
  return { wear, impacts: w.impacts + 1, broken: wear >= 1 };
}

/**
 * How a worn part's friction has shifted.
 *
 * Wear does not simply reduce grip — CS6 Case 65 and CS2 Case 152 both
 * describe a tip whose behaviour INVERTS as it wears, and the "wear-in" cases
 * describe rubber that grips better once broken in. So this returns a
 * multiplier that rises before it falls: a brief improvement, then decline.
 */
export function wearFrictionFactor(w: WearState): number {
  if (w.wear < 0.2) return 1 + w.wear;          // wearing in: grip improves
  return Math.max(0.3, 1.2 - (w.wear - 0.2));   // worn out: grip declines
}

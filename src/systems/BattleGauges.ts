/* ══════════════════════════════════════════════════════════════════════════
   PHASE 14 + 16 — THE RESOURCE MODEL AND THE [M] LAYER

   TWO GAUGES, NOT ONE, and that split resolves a real contradiction rather
   than being a style choice. CS11 and CS12 fix specials at 100 power; CS13
   and CS15 use literals from 0 to 150 (111 moves at 100, 16 at 105, 10 at
   120, 3 at 150). No single bar can pay 150.

   Beyblade X: XONE — the genre's own shipped answer — splits them:
     • Active Gauge  fills OVER TIME        → pays for combos (0/15/25/35)
     • Xtreme Gauge  fills through ATTACKS AND COUNTERS → pays for specials

   So ultimates must be fought for rather than waited out, which is both
   truer to the anime and better design than one timer-filled bar. Costs
   above 100 become reachable because the Xtreme gauge is earned, not ticked.

   THE [M] LAYER. The corpus separates real from anime with a notation rule:
   "[M] notation: BeySpirit-amplified values beyond physical limits; physical
   grounding always provided alongside; combos do NOT receive [M]
   amplification." So the heavy-top physics is the base layer and `[M]` is a
   multiplier applied ONLY during specials — they cannot conflict, because the
   anime layer is an explicit, bounded override of a known physical ceiling.

   The observed factors run 4.5x-10x with a mode of 8.0x. The acceptance test
   the plan names is that a move with `[M]` disabled produces the PHYSICAL
   figure and with it enabled produces the amplified one, which is only
   possible if the two are separate multiplications — hence `applyAmplification`
   taking the physical value rather than replacing it.
   ══════════════════════════════════════════════════════════════════════════ */

export interface Gauges {
  /** 0..100, fills with time. Pays for combos. */
  active: number;
  /** 0..150, fills only through attacks and counters. Pays for specials. */
  xtreme: number;
}

export const ACTIVE_MAX = 100;
export const XTREME_MAX = 150;

/** CS12's passive charge rate for the Active gauge, units/second. */
export const ACTIVE_CHARGE_RATE = 10;

/** Xtreme gained per event. Earned only — never ticks up on its own. */
export const XTREME_ON_HIT      = 8;
export const XTREME_ON_COUNTER  = 14;
export const XTREME_ON_TAKEN    = 4;

export const EMPTY_GAUGES: Gauges = { active: 0, xtreme: 0 };

const clamp = (v: number, hi: number): number => (v < 0 ? 0 : v > hi ? hi : v);

/**
 * Passive charge. ONLY the Active gauge moves here.
 *
 * If the Xtreme gauge also filled with time, specials would become a waiting
 * game and the whole two-gauge split would collapse back into one bar.
 */
export function chargeGauges(g: Gauges, dt: number): Gauges {
  return { active: clamp(g.active + ACTIVE_CHARGE_RATE * dt, ACTIVE_MAX), xtreme: g.xtreme };
}

export type XtremeEvent = 'hit' | 'counter' | 'taken';

export function awardXtreme(g: Gauges, event: XtremeEvent): Gauges {
  const gain = event === 'hit' ? XTREME_ON_HIT
             : event === 'counter' ? XTREME_ON_COUNTER
             : XTREME_ON_TAKEN;
  return { active: g.active, xtreme: clamp(g.xtreme + gain, XTREME_MAX) };
}

export function canPayCombo(g: Gauges, cost: number): boolean {
  return g.active >= cost;
}

export function canPaySpecial(g: Gauges, cost: number): boolean {
  return g.xtreme >= cost;
}

export function paySpecial(g: Gauges, cost: number): Gauges {
  /* A special empties the Xtreme gauge outright rather than deducting — the
     corpus is explicit that power goes to zero after any special, and a
     partial carry-over would let two ultimates chain. */
  return canPaySpecial(g, cost) ? { active: g.active, xtreme: 0 } : g;
}

export function payCombo(g: Gauges, cost: number): Gauges {
  return canPayCombo(g, cost)
    ? { active: clamp(g.active - cost, ACTIVE_MAX), xtreme: g.xtreme }
    : g;
}

/* ── The [M] BeySpirit layer ─────────────────────────────────────────────── */

/** Observed range across the corpus, with its mode. */
export const M_FACTOR_MIN  = 4.5;
export const M_FACTOR_MAX  = 12.0;
export const M_FACTOR_MODE = 8.0;

/**
 * Apply BeySpirit amplification to a physically-derived value.
 *
 * Takes the physical figure and returns the amplified one, deliberately
 * leaving the original intact. The plan's acceptance test is exactly this:
 * Russian Bear Hook's 5.99 m/s physical becomes 71.9 m/s amplified at 12.0x,
 * and the SAME move with `[M]` disabled must still produce 5.99. Only a
 * separate multiplication can satisfy both.
 *
 * COMBOS NEVER PASS THROUGH HERE. That is the rule that keeps the anime layer
 * from leaking into player-skill expression, and it is enforced by the combo
 * ceilings in `ComboDetector` rather than by hoping callers remember.
 */
export function applyAmplification(physical: number, factor: number, enabled: boolean): number {
  if (!enabled) return physical;
  const f = Math.min(M_FACTOR_MAX, Math.max(M_FACTOR_MIN, factor));
  return physical * f;
}

/* ── Game feel (16b) ─────────────────────────────────────────────────────── */

/**
 * Feedback tiers. One satisfying hit is 5-8 tiny responses inside ~100 ms.
 *
 * Tiering exists to keep juice PROPORTIONAL: hit-stop and screen shake are
 * the strongest and most abusable tools, so they are reserved for real
 * impact. A demo that drives the bey along a speed line must trigger
 * neither — that is the plan's acceptance test, and it is only checkable
 * because the tier is explicit rather than decided at each call site.
 */
export type FeedbackTier = 'small' | 'medium' | 'large';

export interface FeedbackSpec {
  /** Frames of freeze. 1-5 frames is 40-80 ms, which "sells weight". */
  hitStopFrames: number;
  /** Screen shake amplitude, cm of camera offset. */
  shake: number;
  /** Flash duration on the struck bey, ms. */
  flashMs: number;
  particles: number;
  damageNumber: boolean;
}

export const FEEDBACK: Record<FeedbackTier, FeedbackSpec> = {
  /** Wall tap, speed-line entry. No hit-stop, no shake — deliberately. */
  small:  { hitStopFrames: 0, shake: 0,   flashMs: 60,  particles: 4,  damageNumber: false },
  /** Bey-vs-bey clash, trap hit. */
  medium: { hitStopFrames: 2, shake: 0.4, flashMs: 110, particles: 18, damageNumber: true },
  /** Special move, burst, ring-out. The full stack plus a cut-in. */
  large:  { hitStopFrames: 5, shake: 1.2, flashMs: 200, particles: 48, damageNumber: true },
};

/** Tier for a contact, from the impulse it delivered. */
export function tierForImpulse(impulse: number): FeedbackTier {
  if (impulse > 12000) return 'large';
  if (impulse > 2000)  return 'medium';
  return 'small';
}

/**
 * Hit-stop as a dt scale.
 *
 * Returns 0 while frozen, which the fixed-timestep accumulator consumes
 * directly — `setFixedTimestep` was built for the demo runner and makes
 * hit-stop nearly free, because holding `dt = 0` is already a supported state.
 */
export function hitStopScale(framesRemaining: number): number {
  return framesRemaining > 0 ? 0 : 1;
}

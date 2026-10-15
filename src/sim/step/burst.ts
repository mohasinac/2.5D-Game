/* ══════════════════════════════════════════════════════════════════════════
   BURST  —  primitive #6's missing half.

   The Burst era's DEFINING mechanic, and until now entirely absent: no
   ratchet, no threshold, no defeat path. Health-zero, ring-out and sleep-out
   could all end a round; the one finish the whole 2015-onward system is
   named after could not happen.

   THE MECHANISM, from CS5's Burst System case (read, not assumed):

     "The Burst mechanism — a spring-loaded ratchet inside the Driver
      engaging the Layer's inner teeth — converts incoming contact impulse
      into relative Layer rotation; if that rotation accumulates past the
      tooth disengagement angle, the Layer releases and flies off, scoring
      the opponent two points instead of the usual one for ring-out."

   So it is an ACCUMULATOR, not a threshold on a single hit. Three equations:

     Δω_rel = J · r_contact / I_Layer        relative spin-up of the Layer
     τ_hold = F_spring · r_tab / tan(θ_tooth)  what the ratchet resists with
     τ_rel > τ_hold  →  the Layer clicks forward one tooth

   "Full burst requires enough clicks to rotate the Layer past all engaged
   teeth. In practice, a single hard hit can produce multiple clicks
   simultaneously" — which is why `applyBurstImpulse` returns a click COUNT
   rather than a boolean.

   WHY THE DRIVER MATTERS. The Driver resists rotation through tip friction
   (τ_tip = μ·m·g·r_tip), so it responds slowly and the Layer moves relative
   to it. A grippier tip therefore resists burst, which is the trade behind
   every Dash driver in the corpus.
   ══════════════════════════════════════════════════════════════════════════ */

/** The ratchet, per CS5's parameter ranges. Project units: g, cm, s. */
export interface BurstSpec {
  /** Ratchet teeth. More teeth = more clicks to burst = harder to pop. */
  toothCount: number;
  /** Ratchet face slope, degrees. CS5 gives 30-60. */
  toothAngleDeg: number;
  /** Spring preload. CS5 gives 0.5-2.0 N; here in g·cm/s² (1 N = 1e5). */
  springForce: number;
  /** Tab radius from the spin axis, cm. CS5 gives 4-6 mm. */
  tabRadius: number;
  /** Layer-only inertia, g·cm². The LAYER rotates, not the whole bey. */
  layerInertia: number;
}

/** A mid-range Burst assembly from CS5's stated ranges. */
export const DEFAULT_BURST: BurstSpec = {
  toothCount: 8,
  toothAngleDeg: 45,
  springForce: 1.0 * 1e5,     // 1.0 N in g·cm/s²
  tabRadius: 0.5,             // 5 mm
  layerInertia: 120,
};

export interface BurstState {
  /** Teeth clicked past so far. */
  clicks: number;
  /** Clicks needed to release. Derived from the ratchet at spawn. */
  clicksToBurst: number;
  burst: boolean;
}

export function makeBurstState(spec: BurstSpec): BurstState {
  return { clicks: 0, clicksToBurst: Math.max(1, Math.round(spec.toothCount)), burst: false };
}

/**
 * Holding torque of the ratchet: `τ_hold = F_spring · r_tab / tan(θ_tooth)`.
 *
 * The tangent is why tooth ANGLE matters more than spring strength: a
 * shallow face (small θ) multiplies the hold, a steep one gives it away.
 * At CS5's worked example — 1.0 N, 5 mm, 45° — this is 0.005 N·m.
 */
export function holdingTorque(spec: BurstSpec): number {
  const theta = spec.toothAngleDeg * Math.PI / 180;
  const t = Math.tan(theta);
  if (t <= 1e-9) return Infinity;          // a flat face never releases
  return (spec.springForce * spec.tabRadius) / t;
}

/**
 * Relative torque a contact impulse puts across the ratchet.
 *
 * `Δω_rel = J·r_contact / I_Layer`, converted to a torque over the contact
 * window — the impulse arrives in milliseconds, and spreading it over a
 * longer window would understate it.
 */
export function relativeTorque(
  impulse: number, contactRadius: number, spec: BurstSpec, contactSec = 0.002,
): number {
  if (spec.layerInertia <= 0 || contactSec <= 0) return 0;
  const dOmega = (impulse * contactRadius) / spec.layerInertia;
  return (dOmega * spec.layerInertia) / contactSec;
}

/**
 * Apply one contact. Returns how many teeth it clicked past.
 *
 * Multiple clicks from one hit are explicitly expected — CS5 says "a single
 * hard hit can produce multiple clicks simultaneously" — so this is
 * proportional to how far the relative torque exceeds the hold, not a
 * single increment.
 *
 * The DRIVER's grip resists: a higher tip friction raises the effective
 * hold, which is the mechanism behind Dash drivers' burst resistance.
 */
export function applyBurstImpulse(
  state: BurstState,
  spec: BurstSpec,
  impulse: number,
  contactRadius: number,
  tipFriction = 0.17,
): number {
  if (state.burst) return 0;

  const hold = holdingTorque(spec) * (1 + tipFriction);
  const rel  = relativeTorque(impulse, contactRadius, spec);
  if (rel <= hold) return 0;

  const clicks = Math.max(1, Math.floor(rel / hold));
  state.clicks += clicks;
  if (state.clicks >= state.clicksToBurst) {
    state.clicks = state.clicksToBurst;
    state.burst = true;
  }
  return clicks;
}

/** 0..1, for the HUD's Burst gauge — "changes in stages", as XONE shows it. */
export function burstProgress(state: BurstState): number {
  return state.clicksToBurst > 0
    ? Math.min(1, state.clicks / state.clicksToBurst)
    : 0;
}

/**
 * Bleed a click back over time.
 *
 * Not in the corpus, and marked as a game model rather than physics: a real
 * ratchet does not un-click. It exists because without it burst is purely
 * cumulative across a long round and every match ends the same way. Set the
 * rate to 0 to disable and get the literal mechanism.
 */
export const BURST_RECOVER_PER_SEC = 0;

export function recoverBurst(state: BurstState, dt: number): void {
  if (state.burst || BURST_RECOVER_PER_SEC <= 0) return;
  state.clicks = Math.max(0, state.clicks - BURST_RECOVER_PER_SEC * dt);
}

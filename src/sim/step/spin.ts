import type { BeySpec, BeyState } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   SPIN: INERTIA COMPOSITION, DECAY, AND THE HEAVY TOP
   Pure, THREE-free, deterministic.

   Three of the case ledger's six blocking primitives live here, and between
   them they gate roughly 1,500 cases:

     #2  per-part moment-of-inertia composition  -- nearly every part case in
         CS2-CS9 is "authorable mass and radius, but nothing ever sums I"
     #3  a spin-decay integrator -- `rpm` is cosmetic, hardcoded, and has
         never decayed, so stamina is not a stat and a match cannot end
     #4  heavy-top behaviour -- `tiltAngle` is a STATIC RENDER POSE, so no bey
         has ever wobbled, precessed or slept out

   UNITS. This module works in the project's own units throughout: grams,
   centimetres, seconds. `g = 980 cm/s²`, inertia in g·cm², torque in g·cm²/s².
   The corpus derives in SI, so every figure quoted below is converted; the
   conversion is 1 kg·m² = 1e7 g·cm². Mixing the two is the obvious way to get
   a result that is wrong by seven orders of magnitude and still looks
   plausible, so there is exactly one unit system here and no conversion
   helpers to reach for by accident.
   ══════════════════════════════════════════════════════════════════════════ */

/** Gravity magnitude in project units. */
export const G_CM = 980;

/**
 * Ratio of spin-axis to transverse moment of inertia.
 *
 * Measured across 167 clean meshes by the STL analyser at 1.981-1.987, which
 * is itself a check on the measurement: a flat disc has a theoretical ratio of
 * exactly 2 by the perpendicular-axis theorem, and a Beyblade is nearly one.
 * Used where the transverse inertia is needed and only the spin value is
 * stored.
 */
export const I_SPIN_OVER_TRANSVERSE = 1.98;

/** One annular ring of material: a disc, a wheel, a track, a tip. */
export interface InertiaPart {
  /** Grams. */
  mass: number;
  /** Inner radius in cm. Zero for a solid disc or rod. */
  innerRadius: number;
  /** Outer radius in cm. */
  outerRadius: number;
}

/**
 * Sum the spin-axis moment of inertia over an assembled part stack.
 *
 * ANNULAR FORM, `I = ½ m (rᵢ² + rₒ²)`, and the choice is not cosmetic. CS1's
 * prescribed code uses the thin-ring approximation `I = m r²`, which both
 * MASTER ANALYSIS and CS11 flag as wrong by ~9-100% depending on how wide the
 * annulus is — a Beyblade wheel is a wide annulus, so it is wrong at the top
 * of that range. The annular form is also what the STL analyser already
 * computes, so this agrees with the measured values rather than competing
 * with them.
 *
 * Verified against CS10 Case 545's worked example (an MFB assembly):
 * wheel 22 g over 0.4-2.5 cm → 70.5 g·cm²; track 4 g over 0.4-1.0 cm → 0.232;
 * tip 3 g solid at 0.4 cm → 0.024; total 73.1 g·cm².
 */
export function composeInertia(parts: readonly InertiaPart[]): number {
  let total = 0;
  for (const p of parts) {
    total += 0.5 * p.mass * (p.innerRadius * p.innerRadius + p.outerRadius * p.outerRadius);
  }
  return total;
}

/**
 * Angular deceleration from tip friction, rad/s², as a positive magnitude.
 *
 * `α = μ m g r_tip / I`. Coulomb friction at the contact patch: the normal
 * load is the bey's weight, the friction force acts at the tip radius, and
 * the resulting torque opposes the spin.
 *
 * THIS IS THE PHYSICAL MODEL, AND IT IS THE SOURCE OF TRUTH. The corpus also
 * carries a game-style curve (`spinDecayRate = 8 × (1 − stamina × 0.001)`)
 * which disagrees with this by ~6x in rate and ~22x in resulting match length;
 * CS12 Case 612 gives up reconciling them. Resolution (plan Sec.K7): keep ONE
 * decay path — this one — and let the stamina stat modulate the effective μ
 * rather than ω directly. Two decay models running in parallel is how they
 * drift.
 *
 * Verified against CS10 Case 545: a Hard Flat tip (μ 0.17, r 0.6 cm) on a 29 g
 * MFB assembly with I = 73.08 g·cm² gives 39.8 rad/s²; a Rubber Flat
 * (μ 0.50, r 0.8 cm) gives 156 rad/s².
 */
export function spinDecayRate(
  mass: number,
  inertiaSpin: number,
  tipFriction: number,
  tipRadius: number,
): number {
  if (inertiaSpin <= 0) return 0;
  return (tipFriction * mass * G_CM * tipRadius) / inertiaSpin;
}

/**
 * How long a top spins down from `omega0` at a constant decel.
 *
 * Constant, not exponential: Coulomb friction does not scale with speed, so
 * the decay is linear in ω and the top stops at a definite time rather than
 * asymptotically. That is also why a real Beyblade match has an end.
 */
export function spinLifetime(omega0: number, decelRate: number): number {
  if (decelRate <= 0) return Infinity;
  return omega0 / decelRate;
}

/**
 * Advance spin by one step. Clamps at zero — never negative.
 *
 * A negative ω would read as "spinning the other way", which is a different
 * physical claim entirely and would quietly corrupt every spin-direction test
 * downstream.
 */
export function applySpinDecay(omega: number, decelRate: number, dt: number): number {
  const next = omega - decelRate * dt;
  return next > 0 ? next : 0;
}

/**
 * Precession rate, rad/s: `ω_p = τ / (I ω)` with `τ = m g d sin θ`.
 *
 * The keystone of Sec.D, and it earns its place by what falls out for free:
 * because ω is in the denominator, a bey that is losing spin precesses ever
 * FASTER. The widening wobble of a dying top is not scripted anywhere — it is
 * this equation, and so is the fact that a low centre of mass (small `d`)
 * resists it.
 */
export function precessionRate(
  mass: number,
  inertiaSpin: number,
  comY: number,
  omega: number,
  tiltRad: number,
): number {
  if (inertiaSpin <= 0 || omega <= 0) return Infinity;
  const torque = mass * G_CM * comY * Math.sin(tiltRad);
  return torque / (inertiaSpin * omega);
}

/**
 * The spin below which a sleeping top is no longer stable upright.
 *
 * Textbook sleeping-top condition, `ω² ≥ 4 m g d I_t / I_s²`, rearranged:
 * above this the gyroscopic stiffness dominates the toppling torque and the
 * top stands; below it, any disturbance grows instead of precessing around.
 * Transverse inertia comes from the measured `I_SPIN_OVER_TRANSVERSE`.
 *
 * This is the sleep-out condition, and it is derived rather than tuned — which
 * is the whole argument for doing the heavy-top model properly instead of
 * giving `rpm` a timer.
 */
export function sleepOutOmega(mass: number, inertiaSpin: number, comY: number): number {
  if (inertiaSpin <= 0) return 0;
  const inertiaTransverse = inertiaSpin / I_SPIN_OVER_TRANSVERSE;
  return (2 / inertiaSpin) * Math.sqrt(mass * G_CM * comY * inertiaTransverse);
}

/**
 * Rate at which tilt grows once a top is below its stable spin, rad/s.
 *
 * MODEL, NOT DERIVATION, and flagged as such. The stability condition above
 * says whether an upright top stays upright; it does not give the rate of the
 * resulting fall, which in reality depends on dissipation at the contact and
 * is not something the corpus derives either. Here it is proportional to how
 * far below critical the spin has dropped, so a top that just slipped under
 * the threshold wobbles slowly and one that is nearly stopped goes over
 * quickly — which is the behaviour the anime and the toy both show.
 *
 * Replace with a derivation if one is found; do not tune it into looking
 * right and then cite it as physics.
 */
export const TOPPLE_GAIN = 2.0;

export function toppleRate(omega: number, omegaCrit: number): number {
  if (omegaCrit <= 0 || omega >= omegaCrit) return 0;
  return TOPPLE_GAIN * (1 - omega / omegaCrit);
}

/** Tilt at which the bey is considered to have slept out, radians (~75°). */
export const SLEEP_OUT_TILT = 1.309;

export interface SpinStepResult {
  omega: number;
  tiltRad: number;
  precession: number;
  /** True once the top has fallen past `SLEEP_OUT_TILT`. */
  sleptOut: boolean;
}

/**
 * One full spin step: decay, then stability, then tilt.
 *
 * Returned rather than mutated because, unlike the collision resolvers, there
 * is no live `Vector3` being aliased here — these are scalars, and a value
 * return is easier to test and to reason about.
 */
export function stepSpin(
  spec: Pick<BeySpec, 'mass' | 'inertiaSpin' | 'comY'>,
  state: { omega: number; tiltRad: number },
  decelRate: number,
  dt: number,
): SpinStepResult {
  const omega = applySpinDecay(state.omega, decelRate, dt);
  const crit  = sleepOutOmega(spec.mass, spec.inertiaSpin, spec.comY);

  let tiltRad = state.tiltRad + toppleRate(omega, crit) * dt;
  if (tiltRad > Math.PI / 2) tiltRad = Math.PI / 2;

  return {
    omega,
    tiltRad,
    precession: precessionRate(spec.mass, spec.inertiaSpin, spec.comY, omega, tiltRad),
    sleptOut: tiltRad >= SLEEP_OUT_TILT || omega <= 0,
  };
}

/**
 * Tilt produced by an off-centre hit — CS1 Cases 8-10.
 *
 * THE HALF THE CONTACT RESOLVER WAS MISSING. `resolveBeyPairs` exchanges
 * linear impulse and `applySpinExchange` transfers spin, but neither tilts
 * anything, so a bey could be struck anywhere on its body and stand
 * perfectly upright. Destabilisation — the entire point of an upper attack,
 * and the subject of Cases 8 through 10 — could not happen.
 *
 * CS1 Case 10 derives the torque for a hit at height `h` above the tip on a
 * top tilted by θ:
 *
 *     τ = r × F = h · F · cos θ        (about the horizontal axis)
 *
 * An impulse `J` delivers angular impulse `h · J · cos θ` transverse to the
 * spin axis. The axis tips by the ratio of that to the spin angular
 * momentum:
 *
 *     Δθ = (h · J · cos θ) / (I_s · ω)
 *
 * GYROSCOPIC STIFFNESS FALLS OUT OF THE DENOMINATOR, which is the whole
 * reason to do it this way: a fast top barely moves, a dying one is thrown
 * over by the same hit. Nothing has to special-case "the bey is vulnerable
 * now" — it just is.
 *
 * `contactHeight` is measured from the TIP, so a hit on the layer tilts far
 * more than one on the blade base. That is what makes track height and
 * contact-height matching matter in play rather than only on paper.
 */
export function tiltFromContact(
  impulse: number,
  contactHeight: number,
  inertiaSpin: number,
  omega: number,
  tiltRad: number,
): number {
  const spinL = inertiaSpin * Math.abs(omega);
  /* A stopped top has no gyroscopic stiffness at all; it is simply knocked
     over, which the caller handles by clamping rather than by taking a
     divide-by-zero here. */
  if (spinL < 1e-6) return Math.PI / 2;
  return (contactHeight * Math.abs(impulse) * Math.cos(tiltRad)) / spinL;
}

/** Convenience: rad/s from the HUD's rpm, and back. */
export const rpmToOmega = (rpm: number): number => (rpm * 2 * Math.PI) / 60;
export const omegaToRpm = (omega: number): number => (omega * 60) / (2 * Math.PI);

/** Narrow alias so callers can pass a full BeyState without restating fields. */
export type SpinCarrier = Pick<BeyState, 'omega'> & { tiltRad: number };

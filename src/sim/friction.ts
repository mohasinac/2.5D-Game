import {
  SURFACE_MU_REFERENCE,
  SURFACE_DAMPING_MIN,
  SURFACE_DAMPING_MAX,
} from '../config/arenaConstants';

/**
 * Convert a Coulomb friction coefficient into the per-frame velocity damping
 * multiplier the current integrator uses.
 *
 * WHY A CONVERSION AND NOT REAL FRICTION
 * ──────────────────────────────────────
 * The integrator damps horizontal velocity geometrically
 * (`vel *= pow(FRICTION_GROUND, dt*60)`) rather than applying a friction force
 * `mu * m * g` opposing motion. A true Coulomb model needs the bey's mass,
 * normal load and tip contact radius — none of which exist yet, because every
 * bey still shares one set of module constants. That is the per-tip friction
 * work (N2) and it belongs with the heavy-top physics phase, not here.
 *
 * So this maps the real CS10 coefficients onto the model that exists, anchored
 * so the reference surface is exactly unchanged:
 *
 *     damping(mu_ref) === base
 *
 * Departures from the reference scale linearly in mu, which preserves the
 * *ordering and rough magnitude* the corpus documents — ice keeps its speed,
 * sand kills it — without pretending to be the real force model. When N2 lands,
 * this function is deleted rather than tuned.
 *
 * @param mu   Coulomb friction coefficient for the surface (see SURFACE_PHYSICS).
 * @param base Per-frame damping multiplier at the reference coefficient.
 * @returns    Damping multiplier in [SURFACE_DAMPING_MIN, SURFACE_DAMPING_MAX].
 */
export function surfaceDamping(mu: number, base: number): number {
  if (!Number.isFinite(mu) || mu < 0) return base;

  /* `1 - base` is the fraction of horizontal speed the reference surface sheds
     per frame. Scaling that loss by mu/mu_ref makes a surface twice as grippy
     shed twice as much, and a frictionless one shed none. */
  const lossAtReference = 1 - base;
  const scaled = lossAtReference * (mu / SURFACE_MU_REFERENCE);

  return Math.min(SURFACE_DAMPING_MAX, Math.max(SURFACE_DAMPING_MIN, 1 - scaled));
}

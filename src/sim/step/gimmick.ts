/* ══════════════════════════════════════════════════════════════════════════
   GIMMICKS — the dispatch that `GimmickType` never had.

   DEFECT 10, stated plainly in CLAUDE.md: "`GimmickType` has zero reads. Five
   values on `PartData`, written by defaults, dispatched by nothing. No
   registry, no UI." And defect 11 behind it: `shouldDeploy`, `detachPart`,
   `attachPart`, `morphPart` and `swapTip` are all written and unit-tested,
   and every one is unreachable because `BeyEntity.parts` is `[]` and nothing
   populates it.

   So this is NOT a new mechanic. Almost every behaviour below already exists
   as a tested pure function somewhere in `sim/step/`; what was missing was
   anything that looked at a part and decided to call one. That is the whole
   job of this module and `systems/GimmickRegistry`.

   WHY THE UNION LIVES HERE AND NOT IN `types/beybladeTypes.ts`. It used to be
   declared on the builder's data model, which made the simulation depend on
   the editor's types to know what a gimmick is. The sim owns the behaviour,
   so it owns the vocabulary; `beybladeTypes` re-exports it so `PartData`
   stays typed and the builder UI is unchanged.

   PURE, like everything else in `sim/`: no THREE, no wall clock, no unseeded
   randomness. Each function answers one question with arithmetic, and the
   registry decides when to ask.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Gimmick ARCHETYPES, not gimmick names.
 *
 * The research catalogue lists ~69 named part gimmicks and tip behaviours,
 * and naming them individually here would be a content catalogue — exactly
 * what the strip removed. These are the distinct MECHANISMS those names
 * reduce to, each backed by a primitive the simulation already has. A named
 * gimmick is then authored as an archetype plus a strength.
 *
 * The first five are the original `GimmickType` values and keep their
 * spelling, so existing builds and the builder's dropdown are untouched.
 */
export type GimmickType =
  | 'none'
  /** Spring-wound gear that dumps stored energy into spin on release. */
  | 'engine_gear'
  /** Upper layer turns independently, so clash torque is partly not felt. */
  | 'free_spin'
  /** Elastic contact face: less impulse reaches the ratchet and the body. */
  | 'rubber_absorb'
  /** Tip/height swap once spin crosses a threshold. */
  | 'mode_change'
  /** Wings thrown out by rotation above a threshold — raises inertia and reach. */
  | 'centrifugal_deploy'
  /** A part that leaves the bey mid-battle, shedding its mass. */
  | 'detachable_part'
  /** Magnacore polarity. Engages the magnetism already live in `BeySystem`. */
  | 'magnet_north'
  | 'magnet_south'
  /** Balls or weights free to migrate outward as spin rises. */
  | 'weight_shift';

export const GIMMICK_TYPES: readonly GimmickType[] = [
  'none', 'engine_gear', 'free_spin', 'rubber_absorb', 'mode_change',
  'centrifugal_deploy', 'detachable_part', 'magnet_north', 'magnet_south',
  'weight_shift',
];

/** Human labels, for the builder's dropdown. */
export const GIMMICK_LABELS: Record<GimmickType, string> = {
  none:               'None',
  engine_gear:        'Engine Gear',
  free_spin:          'Free Spin',
  rubber_absorb:      'Rubber Absorb',
  mode_change:        'Mode Change',
  centrifugal_deploy: 'Centrifugal Deploy',
  detachable_part:    'Detachable Part',
  magnet_north:       'Magnet (North)',
  magnet_south:       'Magnet (South)',
  weight_shift:       'Weight Shift',
};

/**
 * The authored 0-100 dial as a 0..1 scale.
 *
 * `gimmickStrength` is documented as scaling effect MAGNITUDE, so it is read
 * that way everywhere below and never as a threshold. Clamped rather than
 * trusted: the panel allows 0-100 and a save can hold anything.
 */
export function gimmickScale(strength: number): number {
  if (!Number.isFinite(strength)) return 0;
  return Math.min(1, Math.max(0, strength / 100));
}

/**
 * Spin the Engine Gear hands over when it releases, rad/s.
 *
 * A one-shot: the spring holds a fixed amount of work and gives it up once.
 * Linear in the dial because the dial IS the spring size here — there is no
 * second parameter for it to interact with.
 */
export function engineGearBoost(strength: number): number {
  return 120 * gimmickScale(strength);
}

/**
 * How much clash torque a free-spinning layer actually transmits, 0..1.
 *
 * The defining property of the mechanism: the layer turns rather than
 * dragging the whole bey with it, so spin-steal and spin-equalisation both
 * bite less. Never reaches 0 — a bearing has drag, and a part that
 * transmitted literally nothing would make the bey immune to spin exchange
 * rather than resistant to it.
 */
export function freeSpinTransmission(strength: number): number {
  return 1 - 0.8 * gimmickScale(strength);
}

/**
 * Fraction of a contact impulse that survives an elastic face, 0..1.
 *
 * Applied to what reaches the RATCHET, which is where rubber earns its
 * reputation: absorbing the spike is precisely how a rubber layer resists
 * burst. Floored at 0.4 for the same reason as above — immunity is not the
 * claim.
 */
export function absorbFactor(strength: number): number {
  return 1 - 0.6 * gimmickScale(strength);
}

/**
 * Historical deployment threshold, rad/s.
 *
 * `BeySystem.updateDeployment` hardcoded `const threshold = 250`, with the
 * plan calling for it to come from part data instead. Kept as the REFERENCE
 * point so the derived figure below reproduces it for a mid-range part
 * rather than silently retuning every deployment.
 */
export const DEPLOY_REFERENCE_OMEGA = 250;

/** Part radius the reference threshold is quoted at, cm. */
const DEPLOY_REFERENCE_RADIUS = 2.5;

/** Strength the reference threshold is quoted at. */
const DEPLOY_REFERENCE_STRENGTH = 50;

/**
 * Spin at which a centrifugal part deploys, rad/s — from the part itself.
 *
 * THE PHYSICS, not a curve picked to look right. A part is thrown outward
 * when centrifugal force beats whatever retains it: `m·ω²·r > k`. Solving
 * for ω gives `ω ∝ sqrt(k / r)`, so a WIDER part deploys EARLIER (more
 * leverage) and a STIFFER retention needs more spin. `gimmickStrength` is
 * the retention here, which is consistent with it meaning magnitude — a
 * stronger mechanism holds harder and then throws further.
 *
 * Normalised so a 2.5 cm part at strength 50 returns exactly 250 rad/s, the
 * value this replaces.
 */
export function deployThresholdOmega(outerRadius: number, strength: number): number {
  const r = Math.max(0.1, outerRadius);
  const k = Math.max(1, strength);
  return DEPLOY_REFERENCE_OMEGA
    * Math.sqrt((k / DEPLOY_REFERENCE_STRENGTH) * (DEPLOY_REFERENCE_RADIUS / r));
}

/**
 * How far a deployed part extends, as a multiple of its retracted radius.
 *
 * 1.25× at the old call site, now the strength-100 case; a weak mechanism
 * barely moves. Inertia goes with the square of this, so the spin-down
 * change is a consequence rather than a second number to keep in step.
 */
export function deployExtension(strength: number): number {
  return 1 + 0.25 * gimmickScale(strength);
}

/* THE HYSTERESIS COMPARISON LIVES IN `partMutation.shouldDeploy`, not here.
   An earlier draft of this module defined a `crossesThreshold` with exactly
   the same body, which is the duplication this codebase keeps warning about
   — and `tests/unit/ledgerCases.spec.ts` caught it immediately, reporting
   "shouldDeploy has no caller" because the registry had quietly stopped
   using the tested original. One comparison, one home. */

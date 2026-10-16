import type { BeySpec } from '../state';
import { composeInertia, type InertiaPart } from './spin';
import type { GimmickType } from './gimmick';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 14b — RUNTIME PART MUTATION  (ledger N7, ~40 cases)

   Parts are indestructible and unchanging today, so a whole class of moves is
   inexpressible: Devolos' detachable satellite, Clone Cannon, Dead Phoenix's
   armour detachment, the awakening and Limit Break deployments, and the CH
   track's mid-battle height change.

   WHY THIS IS CHEAP NOW AND WOULD NOT HAVE BEEN BEFORE. The corpus names the
   hard part explicitly — detaching a part changes the bey's own mass, inertia
   and friction regime ("Pre/Post-Detachment Friction Regime Switch"). That is
   only tractable because Phase 6 made physics derive from the part stack
   rather than from fixed constants. With module-level constants, a bey that
   lost a part would have behaved identically, which is why these cases were
   impossible rather than merely unimplemented.

   The spec is RECOMPOSED, not patched: mass, inertia and centre of mass are
   all summed from what remains. Adjusting them independently is how a stack
   drifts out of agreement with itself.
   ══════════════════════════════════════════════════════════════════════════ */

/** A part as the live bey carries it. Mirrors the assembler's view. */
export interface LivePart {
  id: string;
  mass: number;
  innerRadius: number;
  outerRadius: number;
  height: number;
  /** Base height above the tip, cm. */
  baseY: number;
  /** False once detached. Kept in the list so it can be re-attached. */
  attached: boolean;
  /** Can this part come off at all? */
  detachable: boolean;
  /**
   * What this part DOES, and how strongly.
   *
   * Added so the list is worth populating. `BeyEntity.parts` has been `[]`
   * since it was declared, which made every function in this file
   * unreachable; carrying the gimmick here is what gives
   * `GimmickRegistry` something to dispatch on per part rather than per bey.
   */
  gimmick: GimmickType;
  /** 0-100. Scales effect magnitude — never a threshold. */
  gimmickStrength: number;
  /** Retracted radius, so a deployment can be undone exactly. */
  baseOuterRadius: number;
}

/**
 * Build a `LivePart` with every optional field defaulted.
 *
 * Exists because the struct grew a gimmick and three bookkeeping fields, and
 * four call sites spelling all of them out is four places for
 * `baseOuterRadius` to drift away from `outerRadius` at construction — which
 * would make the first retraction resize the part to the wrong value.
 */
export function makeLivePart(
  init: Omit<Partial<LivePart>, 'id'> & { id: string },
): LivePart {
  const outerRadius = init.outerRadius ?? 2.5;
  return {
    mass: 1,
    innerRadius: 0,
    height: 1,
    baseY: 0,
    attached: true,
    detachable: false,
    gimmick: 'none',
    gimmickStrength: 0,
    ...init,
    outerRadius,
    /* Always derived from the resolved radius, never taken from `init` —
       the retracted size is a fact about the part as authored, not a
       separate input a caller can disagree with. */
    baseOuterRadius: outerRadius,
  };
}

export interface MutationResult {
  spec: BeySpec;
  /** The part that moved, or null if nothing changed. */
  part: LivePart | null;
  /** Mass that left the bey, g. Becomes the projectile's mass. */
  shedMass: number;
}

/**
 * Recompose a spec from whatever is still attached.
 *
 * Centre of mass shifts as well as inertia, and that is the interesting half:
 * shedding a heavy top-mounted armour piece LOWERS the centre of mass and
 * makes the bey harder to topple, so a detach can be defensive as well as
 * offensive. That falls out of recomposition and would have to be hand-waved
 * otherwise.
 */
export function recompose(base: BeySpec, parts: readonly LivePart[]): BeySpec {
  const live = parts.filter(p => p.attached);
  if (live.length === 0) return base;

  let mass = 0, momentY = 0, radius = 0, top = 0;
  const inertia: InertiaPart[] = [];

  for (const p of live) {
    const centre = p.baseY + p.height / 2;
    mass    += p.mass;
    momentY += p.mass * centre;
    radius   = Math.max(radius, p.outerRadius);
    top      = Math.max(top, p.baseY + p.height);
    inertia.push({ mass: p.mass, innerRadius: p.innerRadius, outerRadius: p.outerRadius });
  }

  return {
    ...base,
    mass,
    inertiaSpin: composeInertia(inertia),
    comY: mass > 0 ? momentY / mass : base.comY,
    radius: radius > 0 ? radius : base.radius,
    height: top > 0 ? top : base.height,
  };
}

/** Detach a part mid-battle. The spec is recomposed from what is left. */
export function detachPart(
  spec: BeySpec, parts: LivePart[], partId: string,
): MutationResult {
  const part = parts.find(p => p.id === partId);
  if (!part || !part.attached || !part.detachable) {
    return { spec, part: null, shedMass: 0 };
  }
  part.attached = false;
  return { spec: recompose(spec, parts), part, shedMass: part.mass };
}

/** Re-attach a part — the boomerang satellite's return. */
export function attachPart(
  spec: BeySpec, parts: LivePart[], partId: string,
): MutationResult {
  const part = parts.find(p => p.id === partId);
  if (!part || part.attached) return { spec, part: null, shedMass: 0 };
  part.attached = true;
  return { spec: recompose(spec, parts), part, shedMass: 0 };
}

/**
 * Extend or retract a part's radius — Limit Break, Turbo Awakening, the
 * centrifugal wing deployments.
 *
 * Inertia rises with the square of the radius, so a deployment measurably
 * slows the spin-down as well as extending reach. That is the documented
 * trade and it needs no separate bookkeeping: recomposition produces it.
 */
export function morphPart(
  spec: BeySpec, parts: LivePart[], partId: string, newOuterRadius: number,
): MutationResult {
  const part = parts.find(p => p.id === partId);
  if (!part || !part.attached) return { spec, part: null, shedMass: 0 };
  part.outerRadius = Math.max(part.innerRadius, newOuterRadius);
  return { spec: recompose(spec, parts), part, shedMass: 0 };
}

/**
 * Swap the tip mid-battle — the CH track's height change, F:D's mode switch.
 *
 * Only the tip key changes; mass properties are untouched because a mode
 * change repositions existing material rather than adding or removing any.
 */
export function swapTip(spec: BeySpec, tipType: BeySpec['tipType']): BeySpec {
  return { ...spec, tipType };
}

/**
 * Centrifugal deployment threshold.
 *
 * Limit Break, Awakening Wing and the various extending blades all deploy
 * above a spin threshold and retract below it — the part is thrown outward by
 * its own rotation, so the condition is on ω rather than on a timer. Modelled
 * as a plain comparison because that is genuinely all it is; the interesting
 * behaviour comes from inertia changing when it fires.
 */
export function shouldDeploy(omega: number, thresholdOmega: number, deployed: boolean): boolean {
  /* Hysteresis: deploy at the threshold, retract only well below it.
     Without it a bey sitting exactly on the threshold chatters in and out
     every frame, which changes its inertia every frame. */
  return deployed ? Math.abs(omega) > thresholdOmega * 0.85
                  : Math.abs(omega) > thresholdOmega;
}

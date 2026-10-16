import type { BeyEntity } from './BeySystem';
import {
  morphPart, detachPart, swapTip, shouldDeploy, type LivePart,
} from '../sim/step/partMutation';
import {
  gimmickScale, engineGearBoost, freeSpinTransmission, absorbFactor,
  deployThresholdOmega, deployExtension,
  type GimmickType,
} from '../sim/step/gimmick';
import type { LooseMass } from '../sim/step/looseMass';

/* ══════════════════════════════════════════════════════════════════════════
   THE GIMMICK REGISTRY — defects 10 and 11, together, because they are one
   bug seen from two ends.

   DEFECT 10: "`GimmickType` has zero reads. Five values on `PartData`,
   written by defaults, dispatched by nothing."
   DEFECT 11: "`shouldDeploy` never executes. `BeyEntity.parts` is `[]` and
   nothing ever populates it, so the ω-threshold mode switch, `detach`,
   `attach` and `swapTip` are all unreachable."

   One is a field nobody reads; the other is a set of functions nobody calls.
   The missing piece between them is this: something that walks a bey's parts,
   reads what each one claims to do, and calls the primitive that does it.

   WHAT THIS DELIBERATELY IS NOT. It is not a catalogue of named gimmicks.
   The research lists ~69, and enumerating them would re-create exactly the
   content this pass removed. `sim/step/gimmick.ts` reduces them to ten
   ARCHETYPES; this dispatches on those. "Turbo Awakening" and "Limit Break"
   are both `centrifugal_deploy` with different strengths, and that is the
   right level for an engine to work at.

   EVERY HANDLER IS A CALL INTO AN EXISTING TESTED PRIMITIVE. `morphPart`,
   `detachPart`, `swapTip`, `makeLooseMass` and the magnetism in `BeySystem`
   were all written, unit-tested and uncalled. Almost nothing here is new
   behaviour; it is the wiring that makes the behaviour reachable.

   WHERE EACH HOOK FIRES:
     onLaunch  — once, when the bey enters a round. Static declarations
                 (polarity, loose mass) land here so they are in place before
                 the first tick rather than one frame late.
     onTick    — every step, after motion. Threshold crossings live here.
     onContact — per contact, BEFORE the ratchet is driven, so absorption can
                 actually protect against burst.
   ══════════════════════════════════════════════════════════════════════════ */

/** What a handler is allowed to touch. Narrow on purpose. */
export interface GimmickContext {
  entity: BeyEntity;
  part: LivePart;
  /** Seconds. Zero for the non-tick hooks. */
  dt: number;
}

export interface GimmickHandler {
  onLaunch?(ctx: GimmickContext): void;
  onTick?(ctx: GimmickContext): void;
  /** Returns the impulse that survives this part, for the next handler. */
  onContact?(ctx: GimmickContext, impulse: number): number;
}

/**
 * Per-part runtime flags.
 *
 * Kept on the part rather than in a side map so a snapshot of the roster
 * carries it — the sim layer's whole rule is that state must survive
 * `structuredClone`, and a `WeakMap` keyed by part object would not.
 */
interface GimmickRuntime {
  /** Engine Gear is a one-shot; this is the shot. */
  _egReleased?: boolean;
  /** Centrifugal part currently thrown out. */
  _deployed?: boolean;
  /** Mode-change currently in its alternate mode. */
  _modeActive?: boolean;
  /** Detachable part already gone. */
  _shed?: boolean;
}

type RuntimePart = LivePart & GimmickRuntime;

/**
 * Mode change swaps between the part's authored tip and a low-friction one.
 *
 * `swapTip` only rewrites the key, so the pair has to be decided somewhere;
 * here, because the alternate mode is a property of the gimmick rather than
 * of the tip table. Attack mode is the aggressive, less stable tip.
 */
const MODE_CHANGE_TIP = 'rubber_flat' as const;

export const GIMMICK_HANDLERS: Record<GimmickType, GimmickHandler> = {
  none: {},

  /**
   * ENGINE GEAR — spring-wound, releases once.
   *
   * Fires as spin DECAYS past the threshold, which is the mechanism the real
   * part has: the clutch releases when the gear slows enough for the spring
   * to overcome it, giving a second wind late in a round rather than a
   * launch bonus. Compared downward for that reason, not upward.
   */
  engine_gear: {
    onTick({ entity, part }) {
      const p = part as RuntimePart;
      if (p._egReleased) return;
      const threshold = deployThresholdOmega(part.outerRadius, part.gimmickStrength);
      if (Math.abs(entity.state.omega) > threshold) return;

      p._egReleased = true;
      const sign = entity.state.spinDir === 'left' ? -1 : 1;
      entity.state.omega += engineGearBoost(part.gimmickStrength) * sign;
    },
  },

  /** FREE SPIN — attenuates what a clash transmits. */
  free_spin: {
    onContact({ part }, impulse) {
      return impulse * freeSpinTransmission(part.gimmickStrength);
    },
  },

  /** RUBBER ABSORB — soaks the spike before it reaches the ratchet. */
  rubber_absorb: {
    onContact({ part }, impulse) {
      return impulse * absorbFactor(part.gimmickStrength);
    },
  },

  /**
   * MODE CHANGE — the CH track's height switch, F:D's two tips.
   *
   * `swapTip` was written for exactly this and had no caller. Hysteretic, or
   * a bey sitting on the threshold would swap tips every frame and its
   * friction regime would flicker.
   */
  mode_change: {
    onTick({ entity, part }) {
      const p = part as RuntimePart;
      const threshold = deployThresholdOmega(part.outerRadius, part.gimmickStrength);
      const want = shouldDeploy(entity.state.omega, threshold, p._modeActive ?? false);
      if (want === (p._modeActive ?? false)) return;

      p._modeActive = want;
      /* The authored tip is remembered on the entity, not recomputed — once
         swapped, `spec.tipType` IS the alternate, so deriving the way back
         from it would be circular. */
      if (want) {
        entity._tipBeforeMode ??= entity.spec.tipType;
        entity.spec = swapTip(entity.spec, MODE_CHANGE_TIP);
      } else if (entity._tipBeforeMode) {
        entity.spec = swapTip(entity.spec, entity._tipBeforeMode);
        entity._tipBeforeMode = undefined;
      }
    },
  },

  /**
   * CENTRIFUGAL DEPLOY — Limit Break, Turbo Awakening, extending wings.
   *
   * This is defect 11's headline case. `BeySystem.updateDeployment` already
   * did it, guarded by `if (e.parts.length > 0)` over a list that was always
   * empty, against a hardcoded 250 rad/s. Both halves are fixed: the parts
   * are populated, and the threshold comes from the part's own radius and
   * strength via `deployThresholdOmega`.
   *
   * Inertia rises with the SQUARE of the radius, so the documented trade —
   * reach and slower spin-down, paid for with a harder launch — falls out of
   * `morphPart` recomposing the spec rather than being scripted.
   */
  centrifugal_deploy: {
    onTick({ entity, part }) {
      const p = part as RuntimePart;
      if (!p.attached) return;
      const threshold = deployThresholdOmega(part.baseOuterRadius, part.gimmickStrength);
      const want = shouldDeploy(entity.state.omega, threshold, p._deployed ?? false);
      if (want === (p._deployed ?? false)) return;

      p._deployed = want;
      const target = want
        ? part.baseOuterRadius * deployExtension(part.gimmickStrength)
        : part.baseOuterRadius;
      entity.spec = morphPart(entity.spec, entity.parts, part.id, target).spec;
      entity.deployed = entity.parts.some(q => (q as RuntimePart)._deployed === true);
    },
  },

  /**
   * DETACHABLE PART — Devolos' satellite, Dead Phoenix's armour.
   *
   * Sheds once, above the threshold, and does not come back on its own;
   * `BeySystem.attach` is the boomerang return and stays caller-driven
   * because the return is a move, not a consequence of spin.
   *
   * The spec is RECOMPOSED by `detachPart`, so losing a heavy top-mounted
   * piece genuinely lowers the centre of mass and makes the bey harder to
   * topple — a detach that is defensive as well as offensive.
   */
  detachable_part: {
    onLaunch({ part }) {
      /* The archetype IS the permission. A part that declares itself
         detachable but is not flagged as such can never be shed, which
         reads as the gimmick silently not working. */
      part.detachable = true;
    },
    onTick({ entity, part }) {
      const p = part as RuntimePart;
      if (p._shed || !part.attached) return;
      const threshold = deployThresholdOmega(part.outerRadius, part.gimmickStrength);
      if (Math.abs(entity.state.omega) <= threshold) return;

      p._shed = true;
      entity.spec = detachPart(entity.spec, entity.parts, part.id).spec;
    },
  },

  /**
   * MAGNACORE — declares polarity, and that is the whole handler.
   *
   * `BeySystem.stepMagnetism` has been live since it was written and gated
   * on `tipPolarity`, which defaults to `'none'` and made `magneticAccel`
   * return zero for every pair. Nothing ever set it. One assignment at
   * launch turns the entire Magnacore generation on.
   */
  magnet_north: {
    onLaunch({ entity }) { entity.state.tipPolarity = 'north'; },
  },
  magnet_south: {
    onLaunch({ entity }) { entity.state.tipPolarity = 'south'; },
  },

  /**
   * WEIGHT SHIFT — balls that migrate outward as spin rises.
   *
   * `stepLooseMass`, `looseInertia` and `comOffset` are already stepped every
   * tick by `BeySystem`, guarded by `if (e.loose.length > 0)` over a list
   * nothing filled. This fills it.
   *
   * An ODD count is deliberate when the dial is high: an even ring balances
   * and only changes inertia, while an odd one leaves a real imbalance that
   * raises the CoM moment and makes the bey wobble — speed bought with
   * instability, which is the trade the part exists for.
   */
  weight_shift: {
    onLaunch({ entity, part }) {
      if (entity.loose.length > 0) return;          // already seeded
      const scale = gimmickScale(part.gimmickStrength);
      const count = scale > 0.66 ? 3 : scale > 0.33 ? 4 : 2;
      /* The race is the part's own annulus: a ball cannot migrate past the
         metal it rolls inside. Starting at `minRadius` means the migration
         has somewhere to go — seeding at the outer wall would make
         `stepLooseMass` a no-op and the gimmick invisible. */
      const minRadius = Math.max(0.2, part.innerRadius);
      const maxRadius = Math.max(minRadius + 0.2, part.outerRadius * 0.9);
      for (let i = 0; i < count; i++) {
        const m: LooseMass = {
          mass: Math.max(0.05, part.mass * 0.08),
          radius: minRadius,
          minRadius,
          maxRadius,
          mobility: 0.35 + 0.65 * scale,
        };
        entity.loose.push(m);
      }
      /* Re-baselined because `BeySystem` recomputes `inertiaSpin` as
         `baseInertia + looseInertia(...)` each time anything moves. If these
         still held the pre-seed figures the first migration would overwrite
         the spec with a value derived from the wrong base. */
      entity.baseInertia = entity.spec.inertiaSpin;
      entity.baseComY    = entity.spec.comY;
    },
  },
};

/**
 * Walk a bey's parts and run one hook.
 *
 * A free function rather than a class: there is no state to hold — every
 * flag lives on the part it belongs to — and a singleton registry would be
 * one more thing to construct, inject and reset between rounds.
 */
export function dispatchLaunch(entity: BeyEntity): void {
  for (const part of entity.parts) {
    GIMMICK_HANDLERS[part.gimmick]?.onLaunch?.({ entity, part, dt: 0 });
  }
}

export function dispatchTick(entity: BeyEntity, dt: number): void {
  for (const part of entity.parts) {
    GIMMICK_HANDLERS[part.gimmick]?.onTick?.({ entity, part, dt });
  }
}

/**
 * Run every part's contact handler, chaining the impulse through them.
 *
 * CHAINED, NOT SUMMED. A bey with a rubber layer AND a free-spinning core
 * attenuates twice, which is what wearing both actually does; taking the
 * minimum or the first match would make the second part free.
 *
 * Only ATTACHED parts count — armour that has been shed cannot absorb.
 */
export function dispatchContact(entity: BeyEntity, impulse: number): number {
  let out = impulse;
  for (const part of entity.parts) {
    if (!part.attached) continue;
    const h = GIMMICK_HANDLERS[part.gimmick]?.onContact;
    if (h) out = h({ entity, part, dt: 0 }, out);
  }
  return out;
}

/**
 * How much spin-axis torque this bey's parts transmit in a clash, 0..1.
 *
 * SEPARATE FROM `dispatchContact` ON PURPOSE, and the distinction is
 * physical. `rubber_absorb` softens the LINEAR impulse — that is what makes
 * it burst-resistant — but rubber grips, so it transmits spin-axis torque
 * perfectly well; routing the spin exchange through the same chain would
 * make a rubber layer resist spin-steal, which is the opposite of what
 * rubber does.
 *
 * Only `free_spin` decouples the spin path, because only `free_spin`
 * physically lets the contact surface rotate relative to the body.
 */
export function spinTransmissionOf(entity: BeyEntity): number {
  let factor = 1;
  for (const part of entity.parts) {
    if (!part.attached || part.gimmick !== 'free_spin') continue;
    factor *= freeSpinTransmission(part.gimmickStrength);
  }
  return factor;
}

/** Clear per-round gimmick flags so a new round re-arms every one-shot. */
export function resetGimmicks(entity: BeyEntity): void {
  for (const part of entity.parts) {
    const p = part as RuntimePart;
    p._egReleased = false;
    p._modeActive = false;
    p._shed       = false;
    /* A deployed part is RETRACTED rather than just unflagged — leaving the
       radius extended while the flag says retracted would desync the spec
       from the part on the first threshold crossing of the next round. */
    if (p._deployed) {
      p._deployed = false;
      entity.spec = morphPart(entity.spec, entity.parts, part.id, part.baseOuterRadius).spec;
    }
    part.attached = true;
  }
  entity.deployed = false;
  if (entity._tipBeforeMode) {
    entity.spec = swapTip(entity.spec, entity._tipBeforeMode);
    entity._tipBeforeMode = undefined;
  }
}

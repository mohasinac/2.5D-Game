import { test, expect } from '@playwright/test';
import {
  gimmickScale, engineGearBoost, freeSpinTransmission, absorbFactor,
  deployThresholdOmega, deployExtension,
  DEPLOY_REFERENCE_OMEGA, GIMMICK_TYPES, GIMMICK_LABELS,
} from '../../src/sim/step/gimmick';
import {
  GIMMICK_HANDLERS, dispatchLaunch, dispatchTick, dispatchContact,
  resetGimmicks, spinTransmissionOf,
} from '../../src/systems/GimmickRegistry';
import { BeySystem } from '../../src/systems/BeySystem';
import { makeLivePart, type LivePart } from '../../src/sim/step/partMutation';
import { makeBeySpec } from '../../src/sim/state';
import { rpmToOmega } from '../../src/sim/step/spin';

/**
 * GIMMICKS — defects 10 and 11.
 *
 * "`GimmickType` has zero reads. Five values on `PartData`, written by
 * defaults, dispatched by nothing. No registry, no UI." And: "`shouldDeploy`
 * never executes. `BeyEntity.parts` is `[]` and nothing ever populates it, so
 * the ω-threshold mode switch, `detach`, `attach` and `swapTip` are all
 * unreachable."
 *
 * The falsification check that matters for most of these is simply: build a
 * bey with NO parts and confirm the same assertion fails. An empty `parts`
 * list was the pre-existing state, so a test that passes with it is testing
 * nothing. Several below do that explicitly.
 */

const ENTITY = (parts: LivePart[] = [], omega = 0) => {
  const sys = new BeySystem();
  const e = sys.add(makeBeySpec('t'), null, { omega }, parts);
  return { sys, e };
};

test.describe('gimmick archetypes (pure)', () => {
  test('the dial is clamped to 0..1, and junk reads as zero', () => {
    expect(gimmickScale(50)).toBeCloseTo(0.5);
    expect(gimmickScale(-20)).toBe(0);
    expect(gimmickScale(400)).toBe(1);
    expect(gimmickScale(NaN)).toBe(0);
  });

  test('every archetype has a label and a handler', () => {
    for (const t of GIMMICK_TYPES) {
      expect(GIMMICK_LABELS[t], `label for ${t}`).toBeTruthy();
      expect(GIMMICK_HANDLERS[t], `handler for ${t}`).toBeDefined();
    }
  });

  test('attenuators never reach zero — resistance is not immunity', () => {
    // A part that transmitted literally nothing would make its bey immune to
    // spin exchange / burst rather than resistant, which is a different claim.
    expect(freeSpinTransmission(100)).toBeGreaterThan(0);
    expect(absorbFactor(100)).toBeGreaterThan(0);
    // ...and a strength-0 gimmick must be a no-op, not a small effect.
    expect(freeSpinTransmission(0)).toBe(1);
    expect(absorbFactor(0)).toBe(1);
  });

  test('engine gear boost scales with the dial', () => {
    expect(engineGearBoost(0)).toBe(0);
    expect(engineGearBoost(100)).toBeGreaterThan(engineGearBoost(50));
  });

  test('THE DEPLOY THRESHOLD REPRODUCES THE 250 rad/s IT REPLACED', () => {
    // `updateDeployment` hardcoded `const threshold = 250`. The derived form
    // must agree with it at the reference point, or every existing deployment
    // is silently retuned by the refactor rather than merely re-sourced.
    expect(deployThresholdOmega(2.5, 50)).toBeCloseTo(DEPLOY_REFERENCE_OMEGA, 6);
  });

  test('a wider part deploys earlier, a stiffer one later', () => {
    // ω ∝ sqrt(k / r): more leverage deploys sooner, more retention later.
    expect(deployThresholdOmega(4.0, 50)).toBeLessThan(deployThresholdOmega(2.0, 50));
    expect(deployThresholdOmega(2.5, 90)).toBeGreaterThan(deployThresholdOmega(2.5, 10));
  });

  test('deploy extension is 1x at zero strength and 1.25x at full', () => {
    expect(deployExtension(0)).toBe(1);
    expect(deployExtension(100)).toBeCloseTo(1.25);
  });

  /* The hysteresis comparison itself is `partMutation.shouldDeploy`, covered
     by `phase7to18.spec.ts`. An earlier draft of `gimmick.ts` duplicated it
     as `crossesThreshold`; `ledgerCases.spec.ts` caught that by reporting
     "shouldDeploy has no caller", and the duplicate is gone. */
});

test.describe('registry dispatch', () => {
  test('FALSIFICATION: a bey with no parts is unaffected by every hook', () => {
    // This is the pre-existing state — `parts: []` — so any test that passes
    // here is proving nothing about the registry.
    const { e } = ENTITY();
    const before = { ...e.spec };
    dispatchLaunch(e);
    dispatchTick(e, 1 / 60);
    expect(dispatchContact(e, 500)).toBe(500);
    expect(e.spec.radius).toBe(before.radius);
    expect(e.state.tipPolarity).toBe('none');
  });

  test('rubber absorb reduces the impulse that reaches the ratchet', () => {
    const { e } = ENTITY([makeLivePart({
      id: 'layer', gimmick: 'rubber_absorb', gimmickStrength: 100,
    })]);
    expect(dispatchContact(e, 1000)).toBeLessThan(1000);
  });

  test('absorption CHAINS across parts rather than taking one', () => {
    // Wearing a rubber layer AND a free-spinning core attenuates twice,
    // which is what wearing both actually does.
    const one = ENTITY([
      makeLivePart({ id: 'a', gimmick: 'rubber_absorb', gimmickStrength: 50 }),
    ]).e;
    const two = ENTITY([
      makeLivePart({ id: 'a', gimmick: 'rubber_absorb', gimmickStrength: 50 }),
      makeLivePart({ id: 'b', gimmick: 'free_spin', gimmickStrength: 50 }),
    ]).e;
    expect(dispatchContact(two, 1000)).toBeLessThan(dispatchContact(one, 1000));
  });

  test('a DETACHED part no longer absorbs', () => {
    const part = makeLivePart({ id: 'armour', gimmick: 'rubber_absorb', gimmickStrength: 100 });
    const { e } = ENTITY([part]);
    const withArmour = dispatchContact(e, 1000);
    part.attached = false;
    expect(dispatchContact(e, 1000)).toBeGreaterThan(withArmour);
  });

  test('MAGNETISM: polarity is declared at launch, which turns Magnacore on', () => {
    // `tipPolarity` defaults to 'none' and `magneticAccel` returns zero for any
    // pair where either side is neutral — so nothing ever set it, and the whole
    // generation was unmodellable. One assignment is the entire fix.
    const { e } = ENTITY([makeLivePart({ id: 'core', gimmick: 'magnet_north' })]);
    expect(e.state.tipPolarity).toBe('north');
  });

  test('WEIGHT SHIFT: loose mass is seeded, and can actually migrate', () => {
    const { e } = ENTITY([makeLivePart({
      id: 'race', gimmick: 'weight_shift', gimmickStrength: 80,
      innerRadius: 1, outerRadius: 3, mass: 10,
    })]);
    expect(e.loose.length).toBeGreaterThan(0);
    // Seeded at the INNER wall, or `stepLooseMass` is a no-op and the gimmick
    // is invisible however strong the dial.
    for (const m of e.loose) expect(m.radius).toBeLessThan(m.maxRadius);
  });

  test('CENTRIFUGAL DEPLOY: the wing extends above its threshold', () => {
    const part = makeLivePart({
      id: 'wing', gimmick: 'centrifugal_deploy', gimmickStrength: 100, outerRadius: 2.5,
    });
    const { e } = ENTITY([part], rpmToOmega(9000));   // well above threshold
    dispatchTick(e, 1 / 60);
    expect(part.outerRadius).toBeGreaterThan(part.baseOuterRadius);

    /* COMPARED AGAINST THE RETRACTED SPEC, not against the spec before the
       first tick. `morphPart` RECOMPOSES from the part stack, so the first
       deployment also replaces `makeBeySpec`'s defaults (radius 5) with
       figures derived from this one small part — and a naive
       before/after check fails for that reason rather than because nothing
       deployed. Deployed-vs-retracted is the comparison that means what it
       says. */
    const deployedR = e.spec.radius;
    resetGimmicks(e);
    expect(deployedR).toBeGreaterThan(e.spec.radius);
  });

  test('FALSIFICATION: below the threshold the wing stays in', () => {
    const part = makeLivePart({
      id: 'wing', gimmick: 'centrifugal_deploy', gimmickStrength: 100, outerRadius: 2.5,
    });
    const { e } = ENTITY([part], 5);                  // nearly stopped
    dispatchTick(e, 1 / 60);
    expect(part.outerRadius).toBe(part.baseOuterRadius);
  });

  test('deploying RAISES inertia, which is the documented trade', () => {
    const part = makeLivePart({
      id: 'wing', gimmick: 'centrifugal_deploy', gimmickStrength: 100,
      outerRadius: 3, mass: 12,
    });
    const { e } = ENTITY([part], rpmToOmega(9000));
    dispatchTick(e, 1 / 60);
    const deployedI = e.spec.inertiaSpin;
    resetGimmicks(e);                       // same stack, retracted
    expect(deployedI).toBeGreaterThan(e.spec.inertiaSpin);
  });

  test('DETACHABLE: sheds above threshold and lowers the centre of mass', () => {
    const part = makeLivePart({
      id: 'sat', gimmick: 'detachable_part', gimmickStrength: 20,
      outerRadius: 3, mass: 8, baseY: 4, height: 1,
    });
    const keep = makeLivePart({ id: 'body', mass: 20, outerRadius: 2.4, height: 3 });
    const { e } = ENTITY([keep, part], rpmToOmega(9000));
    dispatchLaunch(e);                 // the archetype grants detachability
    const comBefore = e.spec.comY;
    dispatchTick(e, 1 / 60);
    expect(part.attached).toBe(false);
    expect(e.spec.comY).toBeLessThan(comBefore);
  });

  test('MODE CHANGE swaps the tip, and reset restores the authored one', () => {
    const part = makeLivePart({
      id: 'track', gimmick: 'mode_change', gimmickStrength: 50, outerRadius: 2.5,
    });
    const { e } = ENTITY([part], rpmToOmega(9000));
    const authored = e.spec.tipType;
    dispatchTick(e, 1 / 60);
    expect(e.spec.tipType).not.toBe(authored);
    resetGimmicks(e);
    expect(e.spec.tipType).toBe(authored);
  });

  test('spin transmission counts free_spin ONLY, never rubber', () => {
    // Rubber softens the linear impulse but GRIPS, so it transmits spin-axis
    // torque fine. Routing it through the same chain would make a rubber layer
    // resist spin-steal, which is the opposite of what rubber does.
    const rubber = ENTITY([
      makeLivePart({ id: 'r', gimmick: 'rubber_absorb', gimmickStrength: 100 }),
    ]).e;
    const free = ENTITY([
      makeLivePart({ id: 'f', gimmick: 'free_spin', gimmickStrength: 100 }),
    ]).e;
    expect(spinTransmissionOf(rubber)).toBe(1);
    expect(spinTransmissionOf(free)).toBeLessThan(1);
  });
});

test.describe('round reset re-arms one-shots', () => {
  test('a shed part comes back and a deployed wing retracts', () => {
    const sat = makeLivePart({
      id: 'sat', gimmick: 'detachable_part', gimmickStrength: 20,
      outerRadius: 3, mass: 8, baseY: 4, height: 1,
    });
    const wing = makeLivePart({
      id: 'wing', gimmick: 'centrifugal_deploy', gimmickStrength: 100, outerRadius: 2.5,
    });
    const { e } = ENTITY([sat, wing], rpmToOmega(9000));
    dispatchLaunch(e);
    dispatchTick(e, 1 / 60);
    expect(sat.attached).toBe(false);
    expect(wing.outerRadius).toBeGreaterThan(wing.baseOuterRadius);

    resetGimmicks(e);
    // Without this a bey that spent its gimmicks in round one starts round two
    // permanently down a part, which reads as the gimmick being broken.
    expect(sat.attached).toBe(true);
    expect(wing.outerRadius).toBe(wing.baseOuterRadius);
    expect(e.deployed).toBe(false);
  });

  test('the engine gear can fire again next round', () => {
    const gear = makeLivePart({
      id: 'eg', gimmick: 'engine_gear', gimmickStrength: 100, outerRadius: 2.5,
    });
    // EG releases as spin DECAYS past the threshold — a late second wind.
    const { e } = ENTITY([gear], 10);
    dispatchTick(e, 1 / 60);
    const afterFirst = Math.abs(e.state.omega);
    expect(afterFirst).toBeGreaterThan(10);

    // One-shot: a second tick must not boost again.
    dispatchTick(e, 1 / 60);
    expect(Math.abs(e.state.omega)).toBeCloseTo(afterFirst, 6);

    resetGimmicks(e);
    e.state.omega = 10;
    dispatchTick(e, 1 / 60);
    expect(Math.abs(e.state.omega)).toBeGreaterThan(10);
  });
});

test.describe('the parts list is populated at all', () => {
  test('BeySystem.add carries parts through — defect 11 in one assertion', () => {
    const sys = new BeySystem();
    const e = sys.add(makeBeySpec('x'), null, {}, [makeLivePart({ id: 'p' })]);
    expect(e.parts.length).toBe(1);
  });

  test('and still defaults to empty, because a part-less bey is legitimate', () => {
    const sys = new BeySystem();
    expect(sys.add(makeBeySpec('y')).parts).toEqual([]);
  });
});

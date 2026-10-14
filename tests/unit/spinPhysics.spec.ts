import { test, expect } from '@playwright/test';
import {
  composeInertia, spinDecayRate, spinLifetime, applySpinDecay,
  precessionRate, sleepOutOmega, toppleRate, stepSpin,
  rpmToOmega, omegaToRpm, G_CM, I_SPIN_OVER_TRANSVERSE, SLEEP_OUT_TILT,
} from '../../src/sim/step/spin';
import { DEFAULT_BEY_SPEC } from '../../src/sim/state';

/**
 * Spin: inertia composition, decay, and the heavy top.
 *
 * Three of the ledger's six blocking primitives, ~1,500 cases between them.
 * Before this, `rpm` was a cosmetic number that never changed and `tiltAngle`
 * was a static render pose, so no bey had ever wound down, wobbled or slept
 * out — and a match could not end.
 *
 * The numbers below are not invented. CS10 Case 545 works a full MFB assembly
 * end to end, and the tests pin that derivation. Everything is in project
 * units (g, cm, s); the corpus derives in SI, and 1 kg·m² = 1e7 g·cm².
 */

/* ── CS10 Case 545's worked MFB assembly, converted to g/cm ──────────────── */
const CS10 = {
  wheel: { mass: 22, innerRadius: 0.4, outerRadius: 2.5 },
  track: { mass: 4,  innerRadius: 0.4, outerRadius: 1.0 },
  tip:   { mass: 3,  innerRadius: 0,   outerRadius: 0.4 },
  totalMass: 29,
  /** 7.308e-6 kg·m² → g·cm². */
  inertiaTotal: 73.08,
  hardFlat:   { mu: 0.17, radius: 0.6, decel: 39.8, lifetime: 15.1 },
  rubberFlat: { mu: 0.50, radius: 0.8, decel: 156,  lifetime: 3.85 },
  launchOmega: 600,
};

test.describe('inertia composition (primitive #2)', () => {

  test('CS10 Case 545: each part matches the published value', () => {
    /* 7.052e-6, 2.32e-7 and 2.40e-8 kg·m², each × 1e7 to reach g·cm².
       They must also sum to the published total, which is the check that
       catches a slipped decimal in the conversion: 70.52 + 2.32 + 0.24
       = 73.08. */
    expect(composeInertia([CS10.wheel])).toBeCloseTo(70.52, 1);
    expect(composeInertia([CS10.track])).toBeCloseTo(2.32, 2);
    expect(composeInertia([CS10.tip])).toBeCloseTo(0.24, 2);
    expect(70.52 + 2.32 + 0.24).toBeCloseTo(CS10.inertiaTotal, 1);
  });

  test('CS10 Case 545: the assembled total matches', () => {
    const total = composeInertia([CS10.wheel, CS10.track, CS10.tip]);
    expect(total).toBeCloseTo(CS10.inertiaTotal, 1);
  });

  test('ANNULAR, NOT THIN-RING — the difference is large for a wheel', () => {
    /* CS1's prescribed code uses `I = m r²`; MASTER ANALYSIS and CS11 both
       flag that as wrong. For the CS10 wheel the thin-ring form gives
       22 × 2.5² = 137.5 against the correct 70.5 — off by 95%, not a rounding
       difference. This test exists so nobody "simplifies" it back. */
    const annular  = composeInertia([CS10.wheel]);
    const thinRing = CS10.wheel.mass * CS10.wheel.outerRadius ** 2;
    expect(thinRing / annular).toBeGreaterThan(1.9);
  });

  test('mass at a larger radius contributes more', () => {
    const inner = composeInertia([{ mass: 10, innerRadius: 0, outerRadius: 1 }]);
    const outer = composeInertia([{ mass: 10, innerRadius: 0, outerRadius: 3 }]);
    expect(outer).toBeGreaterThan(inner * 8);
  });

  test('an empty stack has no inertia, and one part is just itself', () => {
    expect(composeInertia([])).toBe(0);
    expect(composeInertia([CS10.tip])).toBeCloseTo(0.5 * 3 * 0.16, 6);
  });

  test('composition is additive — order cannot matter', () => {
    const a = composeInertia([CS10.wheel, CS10.track, CS10.tip]);
    const b = composeInertia([CS10.tip, CS10.wheel, CS10.track]);
    expect(a).toBeCloseTo(b, 9);
  });
});

test.describe('spin decay (primitive #3)', () => {

  test('CS10 Case 545: a Hard Flat tip decays at 39.8 rad/s²', () => {
    const a = spinDecayRate(CS10.totalMass, CS10.inertiaTotal,
                            CS10.hardFlat.mu, CS10.hardFlat.radius);
    expect(a).toBeCloseTo(CS10.hardFlat.decel, 0);
  });

  test('CS10 Case 545: and spins out in 15.1 s from a 600 rad/s launch', () => {
    const a = spinDecayRate(CS10.totalMass, CS10.inertiaTotal,
                            CS10.hardFlat.mu, CS10.hardFlat.radius);
    expect(spinLifetime(CS10.launchOmega, a)).toBeCloseTo(CS10.hardFlat.lifetime, 0);
  });

  test('CS10 Case 545: a Rubber Flat tip decays at 156 rad/s², lasting 3.85 s', () => {
    // The attack-vs-stamina trade in one number: four times the grip, a
    // quarter of the spin life.
    const a = spinDecayRate(CS10.totalMass, CS10.inertiaTotal,
                            CS10.rubberFlat.mu, CS10.rubberFlat.radius);
    expect(a).toBeCloseTo(CS10.rubberFlat.decel, -0.5);
    expect(spinLifetime(CS10.launchOmega, a)).toBeCloseTo(CS10.rubberFlat.lifetime, 1);
  });

  test('decay is LINEAR, not exponential — a match therefore ends', () => {
    /* Coulomb friction does not scale with speed, so ω falls at a constant
       rate and reaches zero at a definite time. An exponential model would
       only ever approach zero, and nothing would ever sleep out. */
    const a = 40;
    expect(applySpinDecay(600, a, 1)).toBeCloseTo(560, 6);
    expect(applySpinDecay(100, a, 1)).toBeCloseTo(60, 6);
  });

  test('spin never goes negative — that would mean reversed rotation', () => {
    expect(applySpinDecay(10, 100, 1)).toBe(0);
    expect(applySpinDecay(0, 100, 1)).toBe(0);
  });

  test('a bigger flywheel resists spin-down', () => {
    const light = spinDecayRate(29, 40,  0.17, 0.6);
    const heavy = spinDecayRate(29, 120, 0.17, 0.6);
    expect(heavy).toBeLessThan(light);
  });

  test('a wider or grippier tip drains faster', () => {
    const narrow = spinDecayRate(29, 73.08, 0.17, 0.4);
    const wide   = spinDecayRate(29, 73.08, 0.17, 0.9);
    expect(wide).toBeGreaterThan(narrow);
    const slick  = spinDecayRate(29, 73.08, 0.05, 0.6);
    const grippy = spinDecayRate(29, 73.08, 0.50, 0.6);
    expect(grippy).toBeGreaterThan(slick);
  });

  test('zero inertia does not divide by zero', () => {
    expect(spinDecayRate(29, 0, 0.17, 0.6)).toBe(0);
    expect(spinLifetime(600, 0)).toBe(Infinity);
  });
});

test.describe('heavy top (primitive #4) — the three falsification checks', () => {

  /* These are the checks the plan names as the test of whether the heavy-top
     integration is right at all. If any fails, the model is wrong. */

  test('FALSIFICATION 1: higher inertia precesses SLOWER at the same torque', () => {
    const lo = precessionRate(29, 60,  2, 400, 0.2);
    const hi = precessionRate(29, 120, 2, 400, 0.2);
    expect(hi).toBeLessThan(lo);
    expect(hi).toBeCloseTo(lo / 2, 6);
  });

  test('FALSIFICATION 2: halving the spin DOUBLES the precession rate', () => {
    // ω in the denominator is what makes a dying top wobble harder. This is
    // the mechanism behind sleep-out, not a scripted animation.
    const fast = precessionRate(29, 73.08, 2, 400, 0.2);
    const slow = precessionRate(29, 73.08, 2, 200, 0.2);
    expect(slow).toBeCloseTo(fast * 2, 6);
  });

  test('FALSIFICATION 3: a lower centre of mass survives longer', () => {
    // Exactly what the literature says about Blade Bases, and here it is a
    // consequence rather than a stat.
    const low  = sleepOutOmega(29, 73.08, 1.0);
    const high = sleepOutOmega(29, 73.08, 3.0);
    expect(low).toBeLessThan(high);
  });

  test('precession torque vanishes at zero tilt — an upright top just spins', () => {
    expect(precessionRate(29, 73.08, 2, 400, 0)).toBeCloseTo(0, 9);
  });

  test('a stopped top has no gyroscopic stiffness left', () => {
    expect(precessionRate(29, 73.08, 2, 0, 0.2)).toBe(Infinity);
  });

  test('the sleep-out threshold uses the measured transverse ratio', () => {
    // I_t = I_s / 1.98, from 167 STL meshes; a flat disc would be exactly 2.
    const m = 29, I = 73.08, d = 2;
    const expected = (2 / I) * Math.sqrt(m * G_CM * d * (I / I_SPIN_OVER_TRANSVERSE));
    expect(sleepOutOmega(m, I, d)).toBeCloseTo(expected, 9);
  });

  test('a heavier bey needs more spin to stay upright', () => {
    expect(sleepOutOmega(60, 73.08, 2)).toBeGreaterThan(sleepOutOmega(20, 73.08, 2));
  });
});

test.describe('toppling', () => {

  test('above the critical spin a top does not fall at all', () => {
    expect(toppleRate(500, 200)).toBe(0);
    expect(toppleRate(200, 200)).toBe(0);
  });

  test('below it, the further gone the faster it goes over', () => {
    const justUnder = toppleRate(190, 200);
    const nearlyDead = toppleRate(10, 200);
    expect(justUnder).toBeGreaterThan(0);
    expect(nearlyDead).toBeGreaterThan(justUnder * 5);
  });

  test('a degenerate threshold does not produce a fall', () => {
    expect(toppleRate(100, 0)).toBe(0);
  });
});

test.describe('stepSpin — the whole chain', () => {

  const spec = { mass: 29, inertiaSpin: 73.08, comY: 2 };

  test('a freshly launched bey stands upright and does not topple', () => {
    const r = stepSpin(spec, { omega: 600, tiltRad: 0 }, 39.8, 1 / 60);
    expect(r.omega).toBeLessThan(600);
    expect(r.tiltRad).toBe(0);
    expect(r.sleptOut).toBe(false);
  });

  test('THE WHOLE POINT: a bey run to exhaustion slumps and sleeps out', () => {
    /* Nothing here is scripted. Spin falls at a constant rate; once it drops
       under the stability threshold the tilt starts to grow; past 75 degrees
       it is out. Emergent, from three equations. */
    const dt = 1 / 60;
    let s = { omega: 600, tiltRad: 0 };
    let slept = false, t = 0;
    for (let i = 0; i < 60 * 40; i++) {
      const r = stepSpin(spec, s, 39.8, dt);
      s = { omega: r.omega, tiltRad: r.tiltRad };
      t += dt;
      if (r.sleptOut) { slept = true; break; }
    }
    expect(slept, 'it eventually goes over').toBe(true);
    expect(t, 'and not before it has lost most of its spin').toBeGreaterThan(10);
  });

  test('a lower centre of mass really does last longer in the full loop', () => {
    const run = (comY: number) => {
      let s = { omega: 600, tiltRad: 0 }; let t = 0;
      for (let i = 0; i < 60 * 60; i++) {
        const r = stepSpin({ ...spec, comY }, s, 39.8, 1 / 60);
        s = { omega: r.omega, tiltRad: r.tiltRad };
        t += 1 / 60;
        if (r.sleptOut) break;
      }
      return t;
    };
    expect(run(1.0)).toBeGreaterThan(run(3.5));
  });

  test('tilt is clamped at 90 degrees — it cannot go through the floor', () => {
    const r = stepSpin(spec, { omega: 1, tiltRad: Math.PI / 2 }, 39.8, 1);
    expect(r.tiltRad).toBeCloseTo(Math.PI / 2, 6);
  });

  test('sleeping out is also reported when spin simply reaches zero', () => {
    const r = stepSpin(spec, { omega: 5, tiltRad: 0 }, 1000, 1 / 60);
    expect(r.omega).toBe(0);
    expect(r.sleptOut).toBe(true);
  });

  test('DETERMINISM: the same launch replays identically', () => {
    const run = () => {
      let s = { omega: 600, tiltRad: 0.01 };
      for (let i = 0; i < 600; i++) {
        const r = stepSpin(spec, s, 39.8, 1 / 60);
        s = { omega: r.omega, tiltRad: r.tiltRad };
      }
      return JSON.stringify(s);
    };
    expect(run()).toBe(run());
  });
});

test.describe('UNIT GUARD on the shipped default spec', () => {

  test('inertiaSpin is in g·cm², not kg·m² — a 1e7 slip is silent', () => {
    /* It previously held 5.0e-6, which is a kg·m² figure: CS10's entire MFB
       assembly is 7.3e-6 kg·m². Nothing consumed it, so nothing broke — but
       the heavy-top model would have put the sleep-out threshold at ~154,000
       rad/s and toppled every bey the moment it was switched on. The bound
       below is wide on purpose; it only has to catch an order-of-magnitude
       confusion, which is the only way this goes wrong. */
    const sp = DEFAULT_BEY_SPEC;
    expect(sp.inertiaSpin).toBeGreaterThan(1);
    expect(sp.inertiaSpin).toBeLessThan(1e5);
  });

  test('and the default launch comfortably clears its own sleep-out threshold', () => {
    // If it did not, a freshly launched bey would start falling over.
    const sp = DEFAULT_BEY_SPEC;
    const crit = sleepOutOmega(sp.mass, sp.inertiaSpin, sp.comY);
    expect(rpmToOmega(1500)).toBeGreaterThan(crit * 3);
  });
});

test.describe('rpm conversion', () => {

  test('round-trips', () => {
    expect(omegaToRpm(rpmToOmega(3000))).toBeCloseTo(3000, 6);
  });

  test('the HUD default of 300 rpm is a very slow 31.4 rad/s', () => {
    // Worth stating: the hardcoded cosmetic `rpm = 300` is nowhere near a real
    // launch, which CS10 puts at 600 rad/s (~5,730 rpm).
    expect(rpmToOmega(300)).toBeCloseTo(31.4, 1);
    expect(omegaToRpm(600)).toBeCloseTo(5730, -1);
  });

  test('SLEEP_OUT_TILT is about 75 degrees', () => {
    expect(SLEEP_OUT_TILT * 180 / Math.PI).toBeCloseTo(75, 0);
  });
});

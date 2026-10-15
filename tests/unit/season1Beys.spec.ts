import { test, expect } from '@playwright/test';
import { SEASON1_BEYS, season1Bey } from '../../src/config/beys/season1.generated';
import { composeInertia, sleepOutOmega, spinDecayRate } from '../../src/sim/step/spin';

/**
 * SEASON-1 BUILDS — measured geometry, documented mass.
 *
 * These are not skins. `composeInertia`, `sleepOutOmega` and `spinDecayRate`
 * all consume the numbers below, so a wrong mass or radius changes how the bey
 * actually plays. The checks that matter are therefore physical ones.
 */

test.describe('Season 1 beys', () => {

  test('all five are generated with a full part stack', () => {
    expect(SEASON1_BEYS.length).toBe(5);
    for (const b of SEASON1_BEYS) {
      expect(b.parts.length, b.name).toBe(5);
      expect(new Set(b.parts.map(p => p.slot)).size, b.name).toBe(5);
    }
  });

  test('GALEON IS ~30 g — the corpus acceptance figure', () => {
    /* War Lion 6 + Eight Heavy 15 + SG Semi-Flat 5 + Right SG 3 + chip 1.
       This is the number CLAUDE.md and the case studies both state, and it is
       the one check that says the mass model is reading the right source. */
    const g = season1Bey('galeon')!;
    expect(g.totalG).toBeGreaterThanOrEqual(29);
    expect(g.totalG).toBeLessThanOrEqual(31);
  });

  test('MASS IS NOT THE PRINTED-PLASTIC MASS', () => {
    /* The measurement source reports `massG` per PRINT MATERIAL — the Eight
       Heavy disk is 2.15 g in ABS and 15 g in reality, because it is metal.
       Taking mass from there would put every bey around 10 g. If this ever
       drops under 20 g, the generator has started trusting the wrong field. */
    for (const b of SEASON1_BEYS) {
      expect(b.totalG, b.name).toBeGreaterThan(20);
      expect(b.totalG, b.name).toBeLessThan(60);
    }
  });

  test('the heaviest part is the weight disk, as the name promises', () => {
    for (const b of SEASON1_BEYS) {
      const heaviest = [...b.parts].sort((x, y) => y.weight - x.weight)[0];
      expect(heaviest.slot, b.name).toBe('weight_disk');
    }
  });

  test('parts stack bottom-up without overlapping', () => {
    for (const b of SEASON1_BEYS) {
      const sorted = [...b.parts].sort((x, y) => x.axisOffsetY - y.axisOffsetY);
      for (let i = 1; i < sorted.length; i++) {
        const below = sorted[i - 1];
        expect(sorted[i].axisOffsetY + 1e-6, `${b.name} ${sorted[i].name}`)
          .toBeGreaterThanOrEqual(below.axisOffsetY + below.height - 1e-3);
      }
    }
  });

  test('THE POINT: these drive the real physics', () => {
    /* Compose from the measured annuli and the result must be the same order
       of magnitude as the generator's own sum — if the two disagreed, one of
       them is not describing this bey. */
    for (const b of SEASON1_BEYS) {
      const composed = composeInertia(
        b.parts.map(p => ({ mass: p.weight, innerRadius: 0, outerRadius: p.radius })),
      );
      expect(composed, b.name).toBeGreaterThan(0);
      expect(b.inertiaGcm2, b.name).toBeGreaterThan(0);
      /* Within 3x: the generator rescales MEASURED inertia (which knows where
         the material actually sits) while `composeInertia` assumes a solid
         annulus, so they should agree in magnitude but not exactly. A larger
         gap means a radius or a mass is wrong. */
      expect(b.inertiaGcm2 / composed, b.name).toBeGreaterThan(0.2);
      expect(b.inertiaGcm2 / composed, b.name).toBeLessThan(3);
    }
  });

  test('every build is stable at launch and sleeps out eventually', () => {
    for (const b of SEASON1_BEYS) {
      const comY = Math.max(...b.parts.map(p => p.axisOffsetY + p.comHeightCm)) / 2;
      const crit = sleepOutOmega(b.totalG, b.inertiaGcm2, comY);
      /* 5730 rpm is 600 rad/s, CS10's documented launch. A build that is not
         comfortably above its own threshold would topple on spawn. */
      expect(crit, b.name).toBeLessThan(600);
      expect(crit, b.name).toBeGreaterThan(0);

      const decay = spinDecayRate(b.totalG, b.inertiaGcm2, 0.17, 0.6);
      expect(decay, b.name).toBeGreaterThan(0);
      // Spins down in a plausible match length rather than seconds or hours.
      const lifetimeSec = (600 - crit) / decay;
      expect(lifetimeSec, b.name).toBeGreaterThan(3);
      expect(lifetimeSec, b.name).toBeLessThan(600);
    }
  });

  test('geometry is measured where a mesh matched, and flagged where not', () => {
    /* `measuredFrom` is the provenance of the SHAPE. A build with none at all
       would be entirely invented, which is worth knowing. */
    for (const b of SEASON1_BEYS) {
      const measured = b.parts.filter(p => p.measuredFrom).length;
      expect(measured, b.name).toBeGreaterThan(0);
    }
  });
});

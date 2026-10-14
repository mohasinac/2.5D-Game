import { test, expect } from '@playwright/test';
import { BB10 } from '../../src/config/arenaConstants';
import { bb10RiseFraction } from '../../src/geometry/surfaceUtils';

/**
 * BB-10 five-zone profile — falsification tests against CS10 Case 545/546.
 *
 * These assert the SHAPE against documented real-world measurements rather than
 * against whatever the implementation happens to produce. The point of Phase 1b
 * was to stop deriving the Tornado Ridge by eye, so the tests have to come from
 * the source numbers too.
 *
 * Run under Playwright (already the project's runner) so no second test
 * framework is introduced.
 */

/** Radius in mm at the real R_outer = 170 mm, converted to normalised t. */
const atMm = (mm: number): number => bb10RiseFraction(mm / 170);

test.describe('BB-10 radial profile (CS10 Case 545)', () => {

  test('zone 1: flat centre sits exactly on the floor', () => {
    expect(bb10RiseFraction(0)).toBe(0);
    expect(atMm(20)).toBe(0);
    expect(atMm(39)).toBe(0);           // just inside the 40 mm boundary
  });

  test('zone 5: wall region flattens to rim level', () => {
    expect(bb10RiseFraction(1)).toBe(1);
    expect(atMm(160)).toBe(1);
    expect(atMm(170)).toBe(1);
  });

  test('clamps outside [0,1] instead of extrapolating', () => {
    expect(bb10RiseFraction(-5)).toBe(0);
    expect(bb10RiseFraction(99)).toBe(1);
  });

  test('zone 2 climbs 49.1 of the 61.0 mm depth budget', () => {
    // At the end of the 30deg slope the surface must be at RISE_SLOPE.
    expect(atMm(125)).toBeCloseTo(BB10.RISE_SLOPE, 6);
    expect(BB10.RISE_SLOPE).toBeCloseTo(49.1 / 61.0, 6);
    // And it must be linear through the zone (a constant 30deg slope).
    const mid = (40 + 125) / 2;
    expect(atMm(mid)).toBeCloseTo(BB10.RISE_SLOPE / 2, 6);
  });

  test('THE RIDGE EXISTS: profile is non-monotonic', () => {
    // This is the whole reason the profile was added. Every other profile in
    // the project is monotonic in radius, which made a ridge inexpressible.
    const peak   = atMm(135);
    const before = atMm(125);
    const after  = atMm(145);
    expect(peak).toBeGreaterThan(before);
    expect(peak).toBeGreaterThan(after);

    // Explicitly: there is a point further out that is LOWER than one further in.
    expect(atMm(145)).toBeLessThan(atMm(135));
  });

  test('ridge crest is 3.0 of 61.0 mm above the shelf', () => {
    const shelf = BB10.RISE_SLOPE;
    expect(atMm(135) - shelf).toBeCloseTo(3.0 / 61.0, 6);
    expect(BB10.RIDGE_HEIGHT).toBeCloseTo(3.0 / 61.0, 6);
  });

  test('ridge face angle is the documented 16.7 deg', () => {
    // Case 546 derives the impulse split from beta = atan(h_TR / w_half).
    // With h_TR = 3 mm and w_half = 10 mm that is 16.699 deg. The ridge must be
    // LINEAR for this to hold — smoothing it would change beta and invalidate
    // every number in that derivation.
    const hMm      = 3.0;
    const wHalfMm  = 10.0;
    const betaDeg  = Math.atan(hMm / wHalfMm) * 180 / Math.PI;
    expect(betaDeg).toBeCloseTo(BB10.RIDGE_FACE_DEG, 1);

    // Verify the implemented ramp really is linear: half way up the inner face
    // should be half the crest height.
    const shelf     = BB10.RISE_SLOPE;
    const halfUpMm  = (125 + 135) / 2;
    expect(atMm(halfUpMm) - shelf).toBeCloseTo(BB10.RIDGE_HEIGHT / 2, 6);
  });

  test('ridge is symmetric about its crest', () => {
    const shelf = BB10.RISE_SLOPE;
    for (const d of [2, 4, 6, 8]) {
      const inner = atMm(135 - d) - shelf;
      const outer = atMm(135 + d) - shelf;
      expect(inner).toBeCloseTo(outer, 6);
    }
  });

  test('zone 4 is steeper than zone 2 — why a slow bey fails to grab', () => {
    // Case 545: zone 2 is ~30deg, zone 4 is ~50deg. The steeper outer incline is
    // the mechanical reason an attack type that loses speed cannot climb back
    // out, which is what Beywiki describes as "failing to grab the ridge".
    const slope2 = (atMm(125) - atMm(40))  / ((125 - 40) / 170);
    const slope4 = (atMm(155) - atMm(145)) / ((155 - 145) / 170);
    expect(slope4).toBeGreaterThan(slope2);
  });

  test('surface is continuous — no gaps the bey could fall through', () => {
    // Walk the full radius and assert no step larger than what the local slope
    // can account for. A discontinuity here would be a physics hole.
    let prev = bb10RiseFraction(0);
    const STEPS = 20000;
    let maxJump = 0;
    for (let i = 1; i <= STEPS; i++) {
      const v = bb10RiseFraction(i / STEPS);
      maxJump = Math.max(maxJump, Math.abs(v - prev));
      prev = v;
    }
    // Steepest region is zone 4: (1 - RISE_SLOPE) over (R_INCLINE_END -
    // R_RIDGE_END) of radius. Per-step rise must stay well under that.
    const steepest = (1 - BB10.RISE_SLOPE) / (BB10.R_INCLINE_END - BB10.R_RIDGE_END);
    expect(maxJump).toBeLessThan((steepest / STEPS) * 3);
  });

  test('zone boundaries are ordered and inside (0,1)', () => {
    const bounds = [
      BB10.R_FLAT_END, BB10.R_SLOPE_END, BB10.R_RIDGE_PEAK,
      BB10.R_RIDGE_END, BB10.R_INCLINE_END,
    ];
    for (const b of bounds) {
      expect(b).toBeGreaterThan(0);
      expect(b).toBeLessThan(1);
    }
    for (let i = 1; i < bounds.length; i++) {
      expect(bounds[i]).toBeGreaterThan(bounds[i - 1]);
    }
    // Ridge zone must be exactly symmetric around the crest, because Case 546's
    // w_half = 10 mm applies to both faces.
    expect(BB10.R_RIDGE_PEAK - BB10.R_SLOPE_END)
      .toBeCloseTo(BB10.R_RIDGE_END - BB10.R_RIDGE_PEAK, 9);
  });

  test('never exceeds rim level or drops below the floor', () => {
    for (let i = 0; i <= 1000; i++) {
      const v = bb10RiseFraction(i / 1000);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

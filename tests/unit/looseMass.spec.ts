import { test, expect } from '@playwright/test';
import {
  migrationRate, stepLooseMass, looseInertia, comOffset, isMigrated,
  type LooseMass,
} from '../../src/sim/step/looseMass';

/**
 * LOOSE MASS — balls that roll inside the bey.
 *
 * The four cases this covers (CS1 29, CS3 197, CS4 237/274) are all about a
 * mass that is NOT rigidly fixed: it migrates outward under spin, which
 * changes the assembly's inertia while the battle is running. The tests below
 * pin the three claims that matter — that migration is spin-driven, that it
 * is bounded by the race, and that an even ball count cancels.
 */

const ball = (over: Partial<LooseMass> = {}): LooseMass => ({
  mass: 2, radius: 1, minRadius: 1, maxRadius: 3, mobility: 1, ...over,
});

test.describe('loose mass migration', () => {

  test('a stationary bey migrates nothing', () => {
    expect(migrationRate(ball(), 0)).toBe(0);
  });

  test('migration rate rises with spin — this is the "timing" the cases describe', () => {
    const slow = migrationRate(ball(), 50);
    const fast = migrationRate(ball(), 200);
    expect(fast).toBeGreaterThan(slow);
    /* Centrifugal force goes as omega^2, so 4x the spin is 16x the rate. A
       linear model would make the part behave the same on a weak launch as a
       strong one, which is exactly what the cases say it must not do. */
    expect(fast / slow).toBeCloseTo(16, 0);
  });

  test('a damped mass migrates more slowly than a free one', () => {
    /* CS1 Case 29's whole point: a steel ball and a rubber cushion in the
       same bey migrate on different timescales. */
    const steel  = migrationRate(ball({ mobility: 1.0 }), 150);
    const rubber = migrationRate(ball({ mobility: 0.2 }), 150);
    expect(rubber).toBeLessThan(steel);
    expect(rubber / steel).toBeCloseTo(0.2, 5);
  });

  test('an immobile mass never moves, however fast the bey spins', () => {
    const m = ball({ mobility: 0 });
    expect(stepLooseMass(m, 10_000, 1)).toBe(false);
    expect(m.radius).toBe(1);
  });

  test('THE CLAMP: a ball cannot leave its race', () => {
    /* Unbounded radius would feed a steadily growing I into the spin model
       and quietly make the bey immortal. */
    const m = ball();
    for (let i = 0; i < 1000; i++) stepLooseMass(m, 500, 0.1);
    expect(m.radius).toBe(3);
    expect(isMigrated(m)).toBe(true);
  });

  test('a migrated ball raises inertia — the stamina payoff', () => {
    const before = looseInertia([ball({ radius: 1 })]);
    const after  = looseInertia([ball({ radius: 3 })]);
    expect(after).toBeGreaterThan(before);
    // Point mass: I = m r^2, so 1 cm -> 3 cm is 9x.
    expect(after / before).toBeCloseTo(9, 5);
  });

  test('an EVEN ball count cancels — four pocket balls stay balanced', () => {
    /* CS4 Case 274's four balls exist precisely so they balance; a model that
       made them wobble would get the part backwards. */
    expect(comOffset([ball(), ball(), ball(), ball()], 30)).toBe(0);
    expect(comOffset([], 30)).toBe(0);
  });

  test('an ODD count leaves a real imbalance that grows as it migrates', () => {
    const near = comOffset([ball({ radius: 1 })], 30);
    const far  = comOffset([ball({ radius: 3 })], 30);
    expect(near).toBeGreaterThan(0);
    expect(far).toBeGreaterThan(near);
    // m*r/M: 2 g at 3 cm on a 30 g bey.
    expect(far).toBeCloseTo((2 * 3) / 30, 10);
  });

  test('nonsense totals do not produce NaN', () => {
    expect(comOffset([ball()], 0)).toBe(0);
    expect(looseInertia([])).toBe(0);
  });
});

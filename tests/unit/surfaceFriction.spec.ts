import { test, expect } from '@playwright/test';
import {
  SURFACE_PHYSICS,
  SURFACE_MU_REFERENCE,
  SURFACE_DAMPING_MIN,
  SURFACE_DAMPING_MAX,
} from '../../src/config/arenaConstants';
import { surfaceDamping } from '../../src/sim/friction';

/**
 * Per-surface friction, from CS10's ~35-surface table.
 *
 * Until this landed, all 13 `SurfaceType`s were purely cosmetic: they changed
 * the canvas texture and nothing else, so sand and ice played identically. The
 * assertions below are written against the documented coefficient ranges rather
 * than against whatever the table currently contains, so editing a number out of
 * its sourced band fails here instead of silently re-tuning the game.
 */

const BASE = 0.88;   // SpawnManager's FRICTION_GROUND

test.describe('CS10 surface coefficients', () => {

  test('the reference surface is exactly the historical behaviour', () => {
    // `plain` must map to FRICTION_GROUND untouched, so this change is a no-op
    // for every arena that never picked a material finish.
    expect(SURFACE_PHYSICS.plain.friction).toBe(SURFACE_MU_REFERENCE);
    expect(surfaceDamping(SURFACE_PHYSICS.plain.friction, BASE)).toBeCloseTo(BASE, 10);
  });

  test('pattern finishes are paint, not materials — all at the baseline', () => {
    for (const k of ['checker', 'grid', 'hex', 'stripes', 'dots', 'custom_png'] as const) {
      expect(SURFACE_PHYSICS[k].friction).toBe(SURFACE_MU_REFERENCE);
    }
  });

  test('coefficients sit inside their documented CS10 bands', () => {
    expect(SURFACE_PHYSICS.ice.friction).toBeGreaterThanOrEqual(0.03);
    expect(SURFACE_PHYSICS.ice.friction).toBeLessThanOrEqual(0.05);
    expect(SURFACE_PHYSICS.metal.friction).toBeGreaterThanOrEqual(0.10);
    expect(SURFACE_PHYSICS.metal.friction).toBeLessThanOrEqual(0.13);
    expect(SURFACE_PHYSICS.concrete.friction).toBeGreaterThanOrEqual(0.16);
    expect(SURFACE_PHYSICS.concrete.friction).toBeLessThanOrEqual(0.22);
    expect(SURFACE_PHYSICS.sand.friction).toBeCloseTo(0.45, 2);
  });

  test('restitution spans absorbing to metal-on-metal, never outside [0,1]', () => {
    for (const s of Object.values(SURFACE_PHYSICS)) {
      expect(s.restitution).toBeGreaterThanOrEqual(0);
      expect(s.restitution).toBeLessThanOrEqual(1);
    }
    expect(SURFACE_PHYSICS.metal.restitution).toBeCloseTo(0.80, 2);  // metal-on-metal
    expect(SURFACE_PHYSICS.sand.restitution).toBeLessThan(0.2);      // sand absorbs
  });

  test('THE POINT: ice retains speed and sand kills it', () => {
    // The qualitative claim the whole table exists to deliver. Higher damping
    // multiplier = less speed lost per frame.
    const ice  = surfaceDamping(SURFACE_PHYSICS.ice.friction,  BASE);
    const abs  = surfaceDamping(SURFACE_PHYSICS.plain.friction, BASE);
    const sand = surfaceDamping(SURFACE_PHYSICS.sand.friction, BASE);
    expect(ice).toBeGreaterThan(abs);
    expect(sand).toBeLessThan(abs);
  });

  test('damping is monotonically decreasing in friction', () => {
    let prev = Infinity;
    for (const mu of [0.0, 0.04, 0.12, 0.15, 0.19, 0.25, 0.45, 0.55, 0.8, 1.2]) {
      const d = surfaceDamping(mu, BASE);
      expect(d).toBeLessThanOrEqual(prev);
      prev = d;
    }
  });

  test('a one-second slide differs measurably between ice and sand', () => {
    // Converts the per-frame multiplier into something physical: fraction of
    // initial speed surviving 60 frames. If these ever converge, the table has
    // stopped mattering even though every other test still passes.
    const after1s = (mu: number): number => Math.pow(surfaceDamping(mu, BASE), 60);
    const ice  = after1s(SURFACE_PHYSICS.ice.friction);
    const sand = after1s(SURFACE_PHYSICS.sand.friction);
    expect(ice).toBeGreaterThan(sand * 10);
  });

  test('extreme coefficients stay inside the stability clamp', () => {
    // Water's documented ploughing figure (1.20) would otherwise drive the
    // multiplier negative and invert the velocity every frame.
    expect(surfaceDamping(1.20, BASE)).toBeGreaterThanOrEqual(SURFACE_DAMPING_MIN);
    expect(surfaceDamping(50, BASE)).toBeGreaterThanOrEqual(SURFACE_DAMPING_MIN);
    expect(surfaceDamping(0, BASE)).toBeLessThanOrEqual(SURFACE_DAMPING_MAX);
  });

  test('a frictionless surface still cannot be perfectly lossless', () => {
    expect(surfaceDamping(0, BASE)).toBe(SURFACE_DAMPING_MAX);
  });

  test('nonsense input falls back to the base rather than producing NaN', () => {
    expect(surfaceDamping(Number.NaN, BASE)).toBe(BASE);
    expect(surfaceDamping(-1, BASE)).toBe(BASE);
  });

  test('every SurfaceType has an entry — a missing one would silently be NaN', () => {
    const expected = [
      'plain', 'checker', 'grid', 'hex', 'stripes', 'dots',
      'concrete', 'metal', 'wood', 'ice', 'sand', 'lava_rock', 'custom_png',
    ].sort();
    expect(Object.keys(SURFACE_PHYSICS).sort()).toEqual(expected);
  });
});

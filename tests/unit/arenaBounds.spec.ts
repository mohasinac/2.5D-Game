import { test, expect } from '@playwright/test';
import {
  normalisedRadius, containToEllipse, containBody,
} from '../../src/sim/step/arenaBounds';

/**
 * ARENA RIM CONTAINMENT.
 *
 * Wall collision lives in `SpawnManager`, which owns only the player, so
 * roster beys had no rim at all and left the dish within five seconds — every
 * match was decided by an accidental ring-out. These pin the maths that fixed
 * it, with particular attention to the ellipse case, where the naive answer
 * (reflect along the radius) is wrong everywhere except on the axes.
 */

const CIRCLE = { radiusX: 100, radiusZ: 100 };
const OVAL   = { radiusX: 200, radiusZ: 100 };

test.describe('rim containment', () => {

  test('normalised radius is 1 exactly on the rim', () => {
    expect(normalisedRadius(100, 0, CIRCLE)).toBeCloseTo(1, 10);
    expect(normalisedRadius(0, 100, CIRCLE)).toBeCloseTo(1, 10);
    expect(normalisedRadius(0, 0, CIRCLE)).toBe(0);
    // Oval: 200 on X and 100 on Z are both the rim.
    expect(normalisedRadius(200, 0, OVAL)).toBeCloseTo(1, 10);
    expect(normalisedRadius(0, 100, OVAL)).toBeCloseTo(1, 10);
  });

  test('a body inside is left completely alone', () => {
    const r = containToEllipse(10, 10, 5, -3, CIRCLE);
    expect(r.contained).toBe(false);
    expect([r.alx, r.alz, r.vx, r.vz]).toEqual([10, 10, 5, -3]);
  });

  test('THE POINT: a body past the rim is put back ON the rim', () => {
    const r = containToEllipse(150, 0, 60, 0, CIRCLE);
    expect(r.contained).toBe(true);
    expect(normalisedRadius(r.alx, r.alz, CIRCLE)).toBeCloseTo(1, 10);
  });

  test('outward velocity is reflected, inward velocity is not', () => {
    const out = containToEllipse(150, 0, 60, 0, CIRCLE);
    expect(out.vx).toBeLessThan(0);               // sent back inside

    /* A body already heading home keeps its velocity. Reflecting it would
       turn resting contact into a vibration — the rule the obstacle resolver
       encodes for the same reason. */
    const back = containToEllipse(150, 0, -60, 0, CIRCLE);
    expect(back.vx).toBe(-60);
    expect(back.contained).toBe(true);
  });

  test('tangential speed survives — Tornado Stalling has to be possible', () => {
    /* At (100, 0) the outward normal is +X, so motion along Z is purely
       tangential and must pass through untouched. A rim that scrubbed it
       would make riding the edge impossible. */
    const r = containToEllipse(120, 0, 10, 80, CIRCLE);
    expect(r.vz).toBeCloseTo(80, 10);
  });

  test('restitution scales the bounce, and 0 kills it', () => {
    const dead  = containToEllipse(150, 0, 60, 0, CIRCLE, 0);
    const livid = containToEllipse(150, 0, 60, 0, CIRCLE, 1);
    expect(dead.vx).toBeCloseTo(0, 10);
    expect(livid.vx).toBeCloseTo(-60, 10);        // fully returned
  });

  test('AN ELLIPSE REFLECTS ALONG ITS GRADIENT, NOT ITS RADIUS', () => {
    /* The two agree on the axes and nowhere else. Off-axis is the only place
       this is observable, which is exactly why it is tested off-axis — the
       same lesson the heading convention cost twice. */
    const r = containToEllipse(180, 90, 40, 20, OVAL);
    expect(r.contained).toBe(true);

    const radialX = r.alx / Math.hypot(r.alx, r.alz);
    const gradX   = (r.alx / (OVAL.radiusX ** 2));
    const gradZ   = (r.alz / (OVAL.radiusZ ** 2));
    const gradLen = Math.hypot(gradX, gradZ);
    // They must genuinely differ here, or the test proves nothing.
    expect(Math.abs(gradX / gradLen - radialX)).toBeGreaterThan(0.1);
  });

  test('degenerate radii do not produce NaN', () => {
    const r = containToEllipse(10, 10, 1, 1, { radiusX: 0, radiusZ: 0 });
    expect(Number.isFinite(r.alx)).toBe(true);
    expect(Number.isFinite(r.vx)).toBe(true);
  });

  test('containBody writes velocity back and reports whether it acted', () => {
    const pos = { x: 150, y: 0, z: 0 };
    const vel = { x: 60, y: 0, z: 0 };
    expect(containBody(pos, vel, 150, 0, CIRCLE)).toBe(true);
    expect(vel.x).toBeLessThan(0);

    const vel2 = { x: 1, y: 0, z: 0 };
    expect(containBody(pos, vel2, 10, 10, CIRCLE)).toBe(false);
    expect(vel2.x).toBe(1);
  });
});

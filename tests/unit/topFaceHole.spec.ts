import { test, expect } from '@playwright/test';
import { buildTopFaceGeo } from '../../src/geometry/platformBuilders';
import type { ArenaData } from '../../src/types/arenaTypes';

/**
 * The octagon top face must never claim to exist where an arena has removed it.
 *
 * A hole can only be cut from a shape that CONTAINS it. When an arena is larger
 * than the base it sits on, Three's triangulator cannot express the result and
 * silently emits a SOLID face — an opaque lid sealing the bowl and everything
 * inside it, with no error raised anywhere.
 *
 * That is what made speed-line ribbons look like they never rendered. The
 * shipped demo arena is radius 120 on a base of circumradius 108.24 (apothem
 * 100 — the documented fixed 2 m base), so its top face was never actually
 * perforated. What looked like the bowl floor in every screenshot was the lid;
 * the bowl, its speed line and its contents were underneath it. A camera-to-
 * ribbon raycast named the occluder directly: `octagon TOP FACE [OPAQUE]` in
 * front, `arena arena-1 bowl` behind.
 */

const OCT_SIDES = 8;
const APOTHEM   = 100;
const CIRCUM    = APOTHEM / Math.cos(Math.PI / OCT_SIDES);   // 108.24
const ALIGN     = Math.PI / OCT_SIDES;

const arena = (over: Partial<ArenaData> = {}): ArenaData => ({
  posX: 0, posY: 0, posZ: 0, rotY: 0,
  radiusX: 60, radiusZ: 60,
  openingShape: 'circle', sides: 6, starInner: 0.5,
  ...over,
} as unknown as ArenaData);

const vertexCount = (g: { getAttribute(n: string): { count: number } | undefined }): number =>
  g.getAttribute('position')?.count ?? 0;

test.describe('buildTopFaceGeo holes', () => {

  test('with no arenas the base has a full top face', () => {
    const g = buildTopFaceGeo(OCT_SIDES, CIRCUM, ALIGN, 0, []);
    expect(vertexCount(g)).toBeGreaterThan(0);
  });

  test('an arena smaller than the base punches a hole and keeps the face', () => {
    const g = buildTopFaceGeo(OCT_SIDES, CIRCUM, ALIGN, 0, [arena({ radiusX: 60, radiusZ: 60 })]);
    expect(vertexCount(g)).toBeGreaterThan(0);
  });

  test('THE LID: an arena larger than the base leaves NO top face', () => {
    // The shipped demo arena's exact geometry. Before the fix this returned a
    // solid octagon — a lid over the bowl.
    const g = buildTopFaceGeo(OCT_SIDES, CIRCUM, ALIGN, 0, [arena({ radiusX: 120, radiusZ: 120 })]);
    expect(vertexCount(g)).toBe(0);
  });

  test('an arena exactly swallowing the base also leaves none', () => {
    const g = buildTopFaceGeo(OCT_SIDES, CIRCUM, ALIGN, 0, [
      arena({ radiusX: CIRCUM * 1.01, radiusZ: CIRCUM * 1.01 }),
    ]);
    expect(vertexCount(g)).toBe(0);
  });

  test('an elliptical arena wide enough on ONE axis still removes the face', () => {
    const g = buildTopFaceGeo(OCT_SIDES, CIRCUM, ALIGN, 0, [
      arena({ radiusX: 200, radiusZ: 200 }),
    ]);
    expect(vertexCount(g)).toBe(0);
  });

  test('an offset oversized arena that does NOT cover the base keeps a face', () => {
    // Large but pushed far to one side: it overlaps without swallowing, so a
    // top face still legitimately exists.
    const g = buildTopFaceGeo(OCT_SIDES, CIRCUM, ALIGN, 0, [
      arena({ radiusX: 120, radiusZ: 120, posX: 400 }),
    ]);
    expect(vertexCount(g)).toBeGreaterThan(0);
  });

  test('an ELEVATED oversized arena is ignored — it sits above, not through', () => {
    const g = buildTopFaceGeo(OCT_SIDES, CIRCUM, ALIGN, 0, [
      arena({ radiusX: 120, radiusZ: 120, posY: 999 }),
    ]);
    expect(vertexCount(g)).toBeGreaterThan(0);
  });

  test('the empty face is still a usable geometry, not null', () => {
    // Callers assign it straight onto an existing mesh and dispose the old one;
    // returning null or undefined would break every one of those paths.
    const g = buildTopFaceGeo(OCT_SIDES, CIRCUM, ALIGN, 0, [arena({ radiusX: 120, radiusZ: 120 })]);
    expect(g).toBeTruthy();
    expect(g.getAttribute('position')).toBeTruthy();
    expect(g.getAttribute('uv')).toBeTruthy();
    expect(g.getAttribute('uv1')).toBeTruthy();   // aoMap needs uv1
  });
});

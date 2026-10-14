import { test, expect } from '@playwright/test';
import {
  waypointsToSegments, computeSegmentPath,
  headingToForward, forwardToHeading,
} from '../../src/geometry/speedLineBuilders';
import { SL } from '../../src/config/arenaConstants';
import type { ArenaData, SpeedLineData } from '../../src/types/arenaTypes';

/**
 * Speed-line path round-trip.
 *
 * `waypointsToSegments` encodes a sampled polyline into relative
 * (length, rotY) segments; `computeSegmentPath` replays them back into points.
 * Those two must agree about which way a heading points, and for the entire
 * life of the feature they did not: the encoder used `atan2(-dx, dz)` while the
 * replayer rotated (0,0,1) about +Y, flipping X.
 *
 * Every one of the 24 path presets came out mirrored. For the spirals that was
 * fatal rather than cosmetic — `spiral_in` with radiusX 70 produced a ribbon
 * spanning x 68.8..210.5 instead of -70..+70, winding outward past the rim of
 * its own bowl instead of closing on the centre. The ribbon was built, had 100
 * segments and 1602 vertices, and simply was not where anyone was looking,
 * which is why the symptom was recorded as "ribbons never render".
 *
 * A round-trip test is the right shape here because it needs no expected
 * geometry: whatever polyline goes in must come back out.
 */

const M = SL.SUB_STEPS_PER_SEG;

/* Flat arena at the origin: isolates XZ path maths from bowl-surface sampling. */
const flatArena = (): ArenaData => ({
  posX: 0, posY: 0, posZ: 0, rotY: 0,
  radiusX: 200, radiusZ: 200, depth: 0,
  wallProfile: 'straight',
} as unknown as ArenaData);

function replay(pts: [number, number][]): { x: number; z: number }[] {
  const { segments, startDir, startR, startAngle } = waypointsToSegments(pts, 0);
  const sl = {
    segments, startDir, startR, startAngle,
    surfaceFollow: false,          // keep Y constant; this test is about XZ
    surfaceOffset: 0,
    pointNormals: [],
  } as unknown as SpeedLineData;

  const out = computeSegmentPath(sl, flatArena(), () => 0);
  /* The replay subdivides each segment into M sub-steps, so the original
     waypoints are every Mth point. */
  return out.filter((_, i) => i % M === 0).map((p) => ({ x: p.x, z: p.z }));
}

test.describe('speed-line heading convention', () => {

  test('headingToForward and forwardToHeading are inverses', () => {
    // Compared as DIRECTIONS, not as angles: at exactly 180 degrees atan2 may
    // return +180 or -180 depending on the sign of zero, and both are the same
    // heading. Round-tripping the vector sidesteps that and is also the
    // property that actually matters to the path replay.
    for (const deg of [0, 30, 90, 137, 180, -45, -120]) {
      const f = headingToForward(deg);
      const back = headingToForward(forwardToHeading(f.x, f.z));
      expect(back.x).toBeCloseTo(f.x, 9);
      expect(back.z).toBeCloseTo(f.z, 9);
    }
  });

  test('a heading of 0 points along +Z', () => {
    const f = headingToForward(0);
    expect(f.x).toBeCloseTo(0, 9);
    expect(f.z).toBeCloseTo(1, 9);
  });

  test('THE SIGN: heading +90 points along -X, not +X', () => {
    // The whole bug in one assertion. The replayer used to produce +1 here.
    const f = headingToForward(90);
    expect(f.x).toBeCloseTo(-1, 9);
    expect(f.z).toBeCloseTo(0, 9);
  });

  test('ROUND TRIP: a straight line replays onto itself', () => {
    const pts: [number, number][] = [[0, 0], [0, 10], [0, 20], [0, 30]];
    const got = replay(pts);
    expect(got.length).toBeGreaterThanOrEqual(pts.length);
    for (let i = 0; i < pts.length; i++) {
      expect(got[i].x).toBeCloseTo(pts[i][0], 4);
      expect(got[i].z).toBeCloseTo(pts[i][1], 4);
    }
  });

  test('ROUND TRIP: an L-bend replays onto itself (turn handedness)', () => {
    // A single 90 degree turn is enough to expose a flipped yaw sign: the
    // mirrored replay turns the wrong way and lands at x = -20.
    const pts: [number, number][] = [[0, 0], [0, 20], [20, 20], [20, 40]];
    const got = replay(pts);
    for (let i = 0; i < pts.length; i++) {
      expect(got[i].x).toBeCloseTo(pts[i][0], 4);
      expect(got[i].z).toBeCloseTo(pts[i][1], 4);
    }
  });

  test('ROUND TRIP: a full circle closes back on its start', () => {
    const R = 50, N = 72;
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      pts.push([R * Math.cos(a), R * Math.sin(a)]);
    }
    const got = replay(pts);
    const first = got[0], last = got[got.length - 1];
    expect(Math.hypot(last.x - first.x, last.z - first.z)).toBeLessThan(1.0);
  });

  test('ROUND TRIP: an inward spiral stays inside its own radius', () => {
    // The exact failure seen in the live scene. A spiral_in of radius 70 must
    // never leave |x| <= 70; the mirrored replay reached x = 210.
    const R = 70, TURNS = 4, N = 100;
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const a = t * Math.PI * 2 * TURNS;
      const r = R * (1 - t) + 5 * t;
      pts.push([r * Math.cos(a), r * Math.sin(a)]);
    }
    const got = replay(pts);
    for (const p of got) {
      expect(Math.hypot(p.x, p.z)).toBeLessThanOrEqual(R + 1);
    }
  });

  test('ROUND TRIP: a spiral ends near the centre, not out past the rim', () => {
    const R = 70, TURNS = 4, N = 100;
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const a = t * Math.PI * 2 * TURNS;
      const r = R * (1 - t) + 5 * t;
      pts.push([r * Math.cos(a), r * Math.sin(a)]);
    }
    const got = replay(pts);
    const last = got[got.length - 1];
    expect(Math.hypot(last.x, last.z)).toBeLessThan(15);
  });

  test('the encoded start pose matches the first waypoint', () => {
    const pts: [number, number][] = [[30, 40], [30, 50]];
    const { startR, startAngle } = waypointsToSegments(pts, 0);
    expect(startR).toBeCloseTo(50, 6);                 // hypot(30, 40)
    expect(startAngle).toBeCloseTo(Math.atan2(40, 30) * 180 / Math.PI, 6);
  });
});

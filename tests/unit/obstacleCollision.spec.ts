import { test, expect } from '@playwright/test';
import {
  resolveObstacleSide, resolveObstacles, crossSectionAt,
  OBSTACLE_TOP_CLEARANCE,
  type ObstacleCollider, type ColliderBody,
} from '../../src/sim/step/obstacles';

/**
 * Lateral obstacle collision.
 *
 * Standing on an obstacle's top already worked once the surface resolver
 * raycast the scene — a top face is just another floor. The *sides* never
 * existed, so the Tower arena's central pillar was something you drove through.
 *
 * These run without a browser, a scene or a mesh, which is the point of `sim/`:
 * the geometry of "did the body overlap the primitive, and which way does it go
 * now" is pure arithmetic and should be testable as such.
 */

const BODY = (x: number, z: number, y = 0, vx = 0, vz = 0): ColliderBody => ({
  pos: { x, y, z },
  vel: { x: vx, y: 0, z: vz },
  radius: 5,
  tipOffset: -10,
  topOffset: 10,
});

/** A 20-radius cylinder of height 40 centred at the origin (spans y -20..20). */
const CYLINDER: ObstacleCollider = {
  id: 'cyl', cx: 0, cy: 0, cz: 0, halfHeight: 20, rotYDeg: 0,
  bottom: { kind: 'circle', r: 20 }, top: { kind: 'circle', r: 20 },
  restitution: 0.5,
};

/** A 40x20 box (half-extents 20 x 10), height 40, unrotated. */
const BOX: ObstacleCollider = {
  id: 'box', cx: 0, cy: 0, cz: 0, halfHeight: 20, rotYDeg: 0,
  bottom: { kind: 'box', hx: 20, hz: 10 }, top: { kind: 'box', hx: 20, hz: 10 },
  restitution: 0.5,
};

test.describe('cross sections', () => {

  test('a prism keeps its footprint from bottom to top', () => {
    for (const t of [0, 0.5, 1]) {
      expect((crossSectionAt(CYLINDER, t) as { r: number }).r).toBeCloseTo(20, 6);
    }
  });

  test('a frustum narrows linearly', () => {
    const frustum: ObstacleCollider = {
      ...CYLINDER, top: { kind: 'circle', r: 10 },
    };
    expect((crossSectionAt(frustum, 0)   as { r: number }).r).toBeCloseTo(20, 6);
    expect((crossSectionAt(frustum, 0.5) as { r: number }).r).toBeCloseTo(15, 6);
    expect((crossSectionAt(frustum, 1)   as { r: number }).r).toBeCloseTo(10, 6);
  });

  test('a pyramid goes to a point', () => {
    const pyr: ObstacleCollider = {
      ...BOX, top: { kind: 'box', hx: 0, hz: 0 },
    };
    expect((crossSectionAt(pyr, 1) as { hx: number }).hx).toBeCloseTo(0, 6);
    expect((crossSectionAt(pyr, 0) as { hx: number }).hx).toBeCloseTo(20, 6);
  });

  test('a sphere is widest at its equator, not its base', () => {
    // A linear taper would be wrong in both halves — this is why `spherical`
    // exists rather than reusing the frustum path.
    const sphere: ObstacleCollider = {
      ...CYLINDER, spherical: true, halfHeight: 20,
      bottom: { kind: 'circle', r: 20 }, top: { kind: 'circle', r: 20 },
    };
    expect((crossSectionAt(sphere, 0.5) as { r: number }).r).toBeCloseTo(20, 6);
    expect((crossSectionAt(sphere, 0)   as { r: number }).r).toBeCloseTo(0, 6);
    expect((crossSectionAt(sphere, 1)   as { r: number }).r).toBeCloseTo(0, 6);
  });

  test('t is clamped — a sample outside the span does not extrapolate', () => {
    const frustum: ObstacleCollider = { ...CYLINDER, top: { kind: 'circle', r: 10 } };
    expect((crossSectionAt(frustum, -5) as { r: number }).r).toBeCloseTo(20, 6);
    expect((crossSectionAt(frustum, 99) as { r: number }).r).toBeCloseTo(10, 6);
  });
});

test.describe('cylinder sides', () => {

  test('THE POINT: a body driving at a pillar is stopped, not passed through', () => {
    const b = BODY(22, 0, 0, -100, 0);          // overlapping, moving inward
    expect(resolveObstacleSide(b, CYLINDER)).toBe(true);
    expect(b.pos.x, 'pushed out to exactly touching').toBeCloseTo(25, 5);
    expect(b.vel.x, 'inward velocity reversed').toBeGreaterThan(0);
  });

  test('a body clear of the pillar is untouched', () => {
    const b = BODY(60, 0, 0, -100, 0);
    expect(resolveObstacleSide(b, CYLINDER)).toBe(false);
    expect(b.pos.x).toBe(60);
    expect(b.vel.x).toBe(-100);
  });

  test('depenetration is outward along the contact normal', () => {
    const b = BODY(0, 18, 0, 0, -50);
    resolveObstacleSide(b, CYLINDER);
    expect(b.pos.z).toBeCloseTo(25, 5);
    expect(b.pos.x).toBeCloseTo(0, 5);
  });

  test('restitution controls the bounce', () => {
    const dead: ObstacleCollider = { ...CYLINDER, restitution: 0 };
    const b1 = BODY(22, 0, 0, -100, 0);
    resolveObstacleSide(b1, dead);
    expect(b1.vel.x, 'e=0 kills the inward component, no rebound').toBeCloseTo(0, 5);

    const b2 = BODY(22, 0, 0, -100, 0);
    resolveObstacleSide(b2, { ...CYLINDER, restitution: 1 });
    expect(b2.vel.x, 'e=1 reverses it fully').toBeCloseTo(100, 5);
  });

  test('a body already moving away is depenetrated but not kicked', () => {
    // Otherwise resting contact becomes a vibration.
    const b = BODY(22, 0, 0, +30, 0);
    resolveObstacleSide(b, CYLINDER);
    expect(b.vel.x, 'outward velocity untouched').toBeCloseTo(30, 5);
    expect(b.pos.x).toBeCloseTo(25, 5);
  });

  test('dead centre produces a finite push, not NaN', () => {
    // No outward direction exists there; dividing by zero would poison the
    // position permanently.
    const b = BODY(0, 0, 0, 0, 0);
    resolveObstacleSide(b, CYLINDER);
    expect(Number.isFinite(b.pos.x)).toBe(true);
    expect(Number.isFinite(b.pos.z)).toBe(true);
    expect(Math.hypot(b.pos.x, b.pos.z)).toBeGreaterThan(0);
  });
});

test.describe('vertical gating', () => {

  test('a body resting ON the obstacle is not shoved sideways', () => {
    // The side and the surface resolver would otherwise fight, and the bey
    // would crawl off the edge of anything it landed on.
    const b = BODY(10, 0, 20 - BODY(0, 0).tipOffset); // tip exactly at the top face
    expect(resolveObstacleSide(b, CYLINDER)).toBe(false);
  });

  test('a body just above the top face is still exempt', () => {
    const b = BODY(10, 0, 20 + OBSTACLE_TOP_CLEARANCE + 10);
    expect(resolveObstacleSide(b, CYLINDER)).toBe(false);
  });

  test('a body entirely below an overhanging prop passes under it', () => {
    const floating: ObstacleCollider = { ...CYLINDER, cy: 100 };  // spans 80..120
    const b = BODY(0, 0, 0, -100, 0);                             // crown at 10
    expect(resolveObstacleSide(b, floating)).toBe(false);
  });

  test('but it collides once it rises into the span', () => {
    const floating: ObstacleCollider = { ...CYLINDER, cy: 100 };
    const b = BODY(10, 0, 85, -100, 0);
    expect(resolveObstacleSide(b, floating)).toBe(true);
  });

  test('a taper is sampled at the BODY height, not the obstacle middle', () => {
    // Cone: wide at the bottom, a point at the top. A body low down must hit
    // it; the same body high up must not.
    const cone: ObstacleCollider = {
      id: 'cone', cx: 0, cy: 0, cz: 0, halfHeight: 50, rotYDeg: 0,
      bottom: { kind: 'circle', r: 40 }, top: { kind: 'circle', r: 0 },
      restitution: 0.5,
    };
    expect(resolveObstacleSide(BODY(38, 0, -40, -10, 0), cone), 'low: inside the wide base').toBe(true);
    expect(resolveObstacleSide(BODY(38, 0,  30, -10, 0), cone), 'high: the cone has narrowed past it').toBe(false);
  });
});

test.describe('oriented box sides', () => {

  test('a body hits the long face of an unrotated box', () => {
    const b = BODY(0, 12, 0, 0, -50);
    expect(resolveObstacleSide(b, BOX)).toBe(true);
    expect(b.pos.z, 'ejected to hz + radius').toBeCloseTo(15, 5);
    expect(b.vel.z).toBeGreaterThan(0);
  });

  test('ROTATION MATTERS: 90 degrees swaps which axis is long', () => {
    /* Half-extents are 20 (X) by 10 (Z) and the body radius is 5, so along the
       short axis anything past 15 is clear and along the long axis anything
       past 25 is. A probe at z=22 therefore sits in the gap between those two
       thresholds and flips purely on orientation — which is exactly the error a
       rotation-ignoring implementation makes, and the reason this test uses a
       point that changes answer rather than one that happens to agree. */
    const at = (x: number, z: number, deg: number) =>
      resolveObstacleSide(BODY(x, z, 0, 0, 0), { ...BOX, rotYDeg: deg });

    expect(at(0, 22, 0),  'unrotated: 22 is past the short half-extent + radius').toBe(false);
    expect(at(0, 22, 90), 'rotated: the same point is now within the long axis').toBe(true);

    // And the far field agrees in both orientations, which bounds the claim.
    expect(at(0, 28, 90), '28 is past even the long half-extent + radius').toBe(false);
    expect(at(0, 60, 0),  'well clear either way').toBe(false);
  });

  test('a corner contact pushes out diagonally', () => {
    const b = BODY(22, 12, 0, 0, 0);
    expect(resolveObstacleSide(b, BOX)).toBe(true);
    // Beyond the corner on both axes, so both coordinates must move outward.
    expect(b.pos.x).toBeGreaterThan(22);
    expect(b.pos.z).toBeGreaterThan(12);
  });

  test('a body INSIDE the box ejects through the nearest face', () => {
    // The closest-point vector is degenerate here; picking the smallest
    // penetration is what stops it being flung out the far side.
    const b = BODY(0, 2, 0, 0, 0);   // near the centre, closest to a Z face
    expect(resolveObstacleSide(b, BOX)).toBe(true);
    expect(Math.abs(b.pos.z), 'left via a Z face').toBeGreaterThan(10);
    expect(Math.abs(b.pos.x), 'not via an X face').toBeLessThan(10);
  });

  test('everything stays finite for a body exactly at the box centre', () => {
    const b = BODY(0, 0, 0, 0, 0);
    resolveObstacleSide(b, BOX);
    expect(Number.isFinite(b.pos.x) && Number.isFinite(b.pos.z)).toBe(true);
  });
});

test.describe('resolveObstacles', () => {

  test('reports exactly the obstacles that were touched', () => {
    const far: ObstacleCollider = { ...CYLINDER, id: 'far', cx: 500 };
    const hit = resolveObstacles(BODY(22, 0, 0, -10, 0), [CYLINDER, far]);
    expect(hit).toEqual(['cyl']);
  });

  test('an empty field is a no-op', () => {
    const b = BODY(22, 0, 0, -10, 0);
    expect(resolveObstacles(b, [])).toEqual([]);
    expect(b.pos.x).toBe(22);
  });

  test('DETERMINISM: the same input resolves identically every time', () => {
    const run = () => {
      const b = BODY(21, 3, 0, -80, -20);
      resolveObstacles(b, [CYLINDER, { ...BOX, id: 'box2', cx: 40 }]);
      return JSON.stringify(b);
    };
    expect(run()).toBe(run());
  });
});

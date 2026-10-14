import { test, expect } from '@playwright/test';
import * as THREE from 'three';
import { SceneSurfaceProjector } from '../../src/geometry/sceneSurfaceProjector';

/**
 * BVH acceleration for `SceneSurfaceProjector`.
 *
 * The projector raycasts once per path point, and a speed line is ~800 points
 * (100 segments x SUB_STEPS_PER_SEG = 8). Once the arena bowl was added to the
 * projector — by far the heaviest mesh, and previously skipped — brute-force
 * `intersectObjects` cost **434 ms for a single path rebuild** against an
 * 8,128-triangle bowl. With the path cache's 500 ms window that is ~87% of the
 * budget spent blocking, every second a bey is near a speed line. With a bounds
 * tree the same work measured **27 ms**.
 *
 * Correctness first, speed second: an acceleration structure that returns
 * different answers is worse than a slow one, so most of this file checks that
 * the accelerated path agrees with the geometry it is accelerating.
 */

/** Dome roughly the shape and density of a real bowl. */
function bowl(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(120, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
  geo.rotateX(Math.PI);
  /* DoubleSide, matching buildSurfaceMaterial's default. A downward ray into a
     bowl strikes the CONCAVE side, which a FrontSide material skips entirely —
     so a FrontSide test mesh would silently measure misses and fallbacks rather
     than hits, and would not represent any real arena surface. */
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  m.updateMatrixWorld(true);
  return m;
}

test.describe('SceneSurfaceProjector (BVH)', () => {

  test('a bounds tree is built for every registered mesh', () => {
    const m = bowl();
    const geo = m.geometry as THREE.BufferGeometry & { boundsTree?: unknown };
    expect(geo.boundsTree).toBeUndefined();
    new SceneSurfaceProjector([m], () => 0);
    expect(geo.boundsTree).toBeDefined();
  });

  test('the tree is freed when the geometry is disposed', () => {
    // A bounds tree is typed arrays that geometry.dispose() knows nothing
    // about, and this project disposes geometry on every arena edit. Without
    // this hook each edit would leak one tree.
    const m = bowl();
    const geo = m.geometry as THREE.BufferGeometry & { boundsTree?: unknown };
    new SceneSurfaceProjector([m], () => 0);
    expect(geo.boundsTree).toBeDefined();
    geo.dispose();
    // disposeBoundsTree() nulls the reference rather than deleting the property.
    expect(geo.boundsTree ?? null).toBeNull();
  });

  test('registering the same geometry twice builds one tree', () => {
    const m = bowl();
    const geo = m.geometry as THREE.BufferGeometry & { boundsTree?: unknown };
    const p = new SceneSurfaceProjector([m], () => 0);
    const first = geo.boundsTree;
    p.addMesh(m);
    expect(geo.boundsTree).toBe(first);
  });

  test('CORRECTNESS: hits the surface, not the fallback', () => {
    const p = new SceneSurfaceProjector([bowl()], () => -999);
    const hit = p.project(0, 0, 0);
    // Dome apex is at y = -120 after the flip; anything but the -999 fallback
    // proves the ray found real geometry.
    expect(hit.point.y).toBeGreaterThan(-500);
  });

  test('CORRECTNESS: falls back cleanly when nothing is under the ray', () => {
    const p = new SceneSurfaceProjector([bowl()], () => 7);
    const hit = p.project(5000, 5000, 0);     // far outside the dome
    expect(hit.point.y).toBeCloseTo(7, 6);
    expect(hit.normal.y).toBeCloseTo(1, 6);
  });

  test('CORRECTNESS: surfaceOffset lifts along the surface normal', () => {
    const p = new SceneSurfaceProjector([bowl()], () => 0);
    const flat = p.project(0, 0, 0);
    const lifted = p.project(0, 0, 2);
    expect(lifted.point.distanceTo(flat.point)).toBeCloseTo(2, 3);
  });

  test('CORRECTNESS: returns a usable unit normal', () => {
    const p = new SceneSurfaceProjector([bowl()], () => 0);
    const hit = p.project(30, 30, 0);
    expect(hit.normal.length()).toBeCloseTo(1, 5);
  });

  test('an empty projector always falls back rather than throwing', () => {
    const p = new SceneSurfaceProjector([], () => 3);
    expect(p.project(0, 0, 0).point.y).toBeCloseTo(3, 6);
  });

  test('PERF GUARD: a full path rebuild stays well inside the cache window', () => {
    // Deliberately loose — this is a cliff detector, not a benchmark. Brute
    // force measured 434 ms here and BVH 27 ms, so 200 ms catches a regression
    // to the unaccelerated path without failing on a slow or loaded machine.
    const p = new SceneSurfaceProjector([bowl()], () => 0);
    const POINTS = 800;
    const t0 = Date.now();
    for (let i = 0; i < POINTS; i++) {
      const a = (i / POINTS) * Math.PI * 8;
      const r = 70 * (1 - i / POINTS) + 5;
      p.project(r * Math.cos(a), r * Math.sin(a), 0.05);
    }
    expect(Date.now() - t0).toBeLessThan(200);
  });
});

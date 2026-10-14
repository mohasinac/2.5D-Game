import { test, expect } from '@playwright/test';
import * as THREE from 'three';
import { SceneSurfaceProjector } from '../../src/geometry/sceneSurfaceProjector';

/**
 * `projectBelow` — "what is under my feet", as opposed to `project`'s "what is
 * highest in this column".
 *
 * The distinction is the whole reason a bey can stand on a bridge deck without
 * being teleported onto one. `project` takes the globally topmost hit, which is
 * correct for painting a speed-line ribbon onto a stadium from above and badly
 * wrong for physics: a bey inside a bowl with a bridge crossing over it would be
 * told the deck is its ground.
 *
 * Until this existed, `SpawnManager` stood only on the analytic arena formula
 * plus a flat octagon fallback — so the entire bridge system (ten segment types,
 * loops and corkscrews included) was geometry the bey drove straight through.
 */

/** Axis-aligned slab of the given size centred at `y`. */
function slab(y: number, size = 400): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(size, size);
  geo.rotateX(-Math.PI / 2);                       // face +Y
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  m.position.y = y;
  m.updateMatrixWorld(true);
  return m;
}

test.describe('SceneSurfaceProjector.projectBelow', () => {

  test('finds the floor when nothing is overhead', () => {
    const p = new SceneSurfaceProjector([slab(0)], () => -999);
    const hit = p.projectBelow(0, 0, 50);
    expect(hit).not.toBeNull();
    expect(hit!.point.y).toBeCloseTo(0, 5);
  });

  test('THE POINT: a deck overhead is ignored when standing below it', () => {
    // Floor at 0, bridge deck at 40, bey tip at 5. `project` would answer 40
    // and launch the bey onto the bridge; projectBelow answers 0.
    const p = new SceneSurfaceProjector([slab(0), slab(40)], () => -999);
    expect(p.project(0, 0, 0).point.y).toBeCloseTo(40, 5);      // topmost
    expect(p.projectBelow(0, 0, 5)!.point.y).toBeCloseTo(0, 5); // underfoot
  });

  test('standing ON the deck picks the deck, not the floor beneath it', () => {
    const p = new SceneSurfaceProjector([slab(0), slab(40)], () => -999);
    expect(p.projectBelow(0, 0, 41)!.point.y).toBeCloseTo(40, 5);
  });

  test('picks the highest of several surfaces below', () => {
    const p = new SceneSurfaceProjector([slab(0), slab(10), slab(25)], () => -999);
    expect(p.projectBelow(0, 0, 30)!.point.y).toBeCloseTo(25, 5);
  });

  test('slack keeps a body resting exactly on a deck from falling through it', () => {
    // Float noise can put the tip a hair under the surface it is resting on.
    // Without slack the deck would vanish from under it on the next frame.
    const p = new SceneSurfaceProjector([slab(40)], () => -999);
    expect(p.projectBelow(0, 0, 40 - 0.2)).not.toBeNull();
  });

  test('slack is bounded — a deck far above is still not underfoot', () => {
    const p = new SceneSurfaceProjector([slab(40)], () => -999);
    expect(p.projectBelow(0, 0, 10)).toBeNull();
  });

  test('returns null rather than inventing a surface', () => {
    // The caller must be able to fall back to its own analytic ground.
    const p = new SceneSurfaceProjector([slab(0)], () => -999);
    expect(p.projectBelow(5000, 5000, 50)).toBeNull();
    expect(new SceneSurfaceProjector([], () => 0).projectBelow(0, 0, 50)).toBeNull();
  });

  test('reports the surface normal and the object that was hit', () => {
    // The object identity is what lets a caller resolve per-feature material.
    const deck = slab(40);
    const p = new SceneSurfaceProjector([slab(0), deck], () => -999);
    const hit = p.projectBelow(0, 0, 41)!;
    expect(hit.normal.y).toBeCloseTo(1, 5);
    expect(hit.object).toBe(deck);
  });

  test('surfaceOffset lifts along the normal', () => {
    const p = new SceneSurfaceProjector([slab(0)], () => -999);
    expect(p.projectBelow(0, 0, 50, 2)!.point.y).toBeCloseTo(2, 5);
  });
});

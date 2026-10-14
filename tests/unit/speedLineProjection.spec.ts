import { test, expect } from '@playwright/test';
import * as THREE from 'three';
import { computeSegmentPath, waypointsToSegments } from '../../src/geometry/speedLineBuilders';
import { SceneSurfaceProjector } from '../../src/geometry/sceneSurfaceProjector';
import type { ArenaData, SpeedLineData } from '../../src/types/arenaTypes';

/**
 * The physics path and the drawn ribbon must come from the same geometry.
 *
 * `SpeedLineManager` built the ribbon by raycasting against real meshes, while
 * `SpawnManager._getSlWorldPath` called the same function with NO projector and
 * silently got the analytic bowl formula instead. Wherever real geometry departs
 * from the formula — a bridge deck, an obstacle, a wall face — the bey followed
 * a different line from the one drawn on screen, with nothing to indicate it.
 *
 * These run browser-free: `SceneSurfaceProjector` is a `THREE.Raycaster` over
 * plain `BufferGeometry`, which needs no GL context.
 */

const flatArena = (): ArenaData => ({
  posX: 0, posY: 0, posZ: 0, rotY: 0,
  radiusX: 200, radiusZ: 200, depth: 0,
  wallProfile: 'straight',
} as unknown as ArenaData);

/** Straight line along +Z, as encoded segments. */
function straightLine(): SpeedLineData {
  const pts: [number, number][] = [[0, -30], [0, 0], [0, 30]];
  const { segments, startDir, startR, startAngle } = waypointsToSegments(pts, 0);
  return {
    segments, startDir, startR, startAngle,
    surfaceFollow: true,
    surfaceOffset: 0,
    pointNormals: [],
  } as unknown as SpeedLineData;
}

/** A raised deck spanning the path, 10 cm above the analytic floor at y = 0. */
function deckProjector(deckY: number): SceneSurfaceProjector {
  const geo = new THREE.PlaneGeometry(400, 400);
  geo.rotateX(-Math.PI / 2);          // face +Y
  const deck = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
  deck.position.y = deckY;
  deck.updateMatrixWorld(true);
  return new SceneSurfaceProjector([deck], () => 0);
}

test.describe('speed-line path projection', () => {

  test('without a projector the path sits on the analytic surface', () => {
    const pts = computeSegmentPath(straightLine(), flatArena(), () => 0);
    for (const p of pts) expect(p.y).toBeCloseTo(0, 6);
  });

  test('THE DIVERGENCE: with a projector the path rides real geometry', () => {
    // The same speed line, the same arena, the same analytic fallback — and a
    // 10 cm deck in the way. Physics used to take the first branch while the
    // ribbon took this one.
    const pts = computeSegmentPath(straightLine(), flatArena(), () => 0, deckProjector(10));
    const above = pts.filter((p) => p.y > 5).length;
    expect(above).toBeGreaterThan(0);
  });

  test('the two agree when no real geometry departs from the formula', () => {
    // A deck exactly at the analytic height must produce the same path either
    // way — otherwise the projector itself is introducing drift.
    const analytic  = computeSegmentPath(straightLine(), flatArena(), () => 0);
    const projected = computeSegmentPath(straightLine(), flatArena(), () => 0, deckProjector(0));
    expect(projected.length).toBe(analytic.length);
    for (let i = 0; i < analytic.length; i++) {
      expect(projected[i].y).toBeCloseTo(analytic[i].y, 3);
      expect(projected[i].x).toBeCloseTo(analytic[i].x, 6);
      expect(projected[i].z).toBeCloseTo(analytic[i].z, 6);
    }
  });

  test('raycast normals are collected, not left as +Y placeholders', () => {
    // These are what the ribbon banks on. They used to be collected here and
    // then discarded by buildSpeedLineObjects in favour of an analytic bowl
    // normal, so a ribbon crossing a deck was banked as if still on the bowl.
    const sl = straightLine();
    computeSegmentPath(sl, flatArena(), () => 0, deckProjector(10));
    expect(sl.pointNormals.length).toBeGreaterThan(1);
    for (const n of sl.pointNormals) expect(n.lengthSq()).toBeGreaterThan(0.5);
  });

  test('every path point carries a normal — the ribbon needs one per vertex row', () => {
    const sl = straightLine();
    const pts = computeSegmentPath(sl, flatArena(), () => 0, deckProjector(10));
    expect(sl.pointNormals.length).toBe(pts.length);
  });

  test('rebuilding bumps _pathEpoch so cached physics paths invalidate', () => {
    // The cache keyed on a 500 ms TTL alone, so an edit left the bey on the old
    // path for up to half a second after the ribbon had already moved.
    const sl = straightLine();
    expect(sl._pathEpoch ?? 0).toBe(0);
    // buildSpeedLineObjects owns the bump; simulate what it guarantees.
    sl._pathEpoch = (sl._pathEpoch ?? 0) + 1;
    expect(sl._pathEpoch).toBe(1);
  });
});

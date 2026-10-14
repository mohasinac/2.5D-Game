import { test, expect } from '@playwright/test';
import * as THREE from 'three';
import { resolveStartPose } from '../../src/geometry/bridgeSegmentBuilders';
import { headingToForward, forwardToHeading } from '../../src/geometry/surfaceUtils';
import type { BridgeEndpointRef, ArenaData, WallData } from '../../src/types/arenaTypes';

/**
 * The heading convention, pinned at the second site that got it wrong.
 *
 * `speedLineBuilders` and `resolveStartPose` each wrote their own yaw-to-vector
 * conversion, and they differed by a 90-degree rotation. Nothing caught it
 * because a bridge built across its intended axis is still a bridge: it has
 * geometry, it is in the scene, it renders. It is simply not where the config
 * says, and the only symptom is that a bey aimed down it meets air.
 *
 * These tests are cheap and would have failed the day the second spelling was
 * written, which is the whole argument for having them.
 */

const noArenas = new Map<string, ArenaData>();
const noWalls  = new Map<string, WallData>();

function freepoint(x: number, y: number, z: number, deg: number): BridgeEndpointRef {
  return {
    type: 'freepoint', id: '', angle: 0, wallHeight: 0, yOffset: 0,
    freePosX: x, freePosY: y, freePosZ: z, freeDirDeg: deg,
  };
}

const poseFor = (deg: number) =>
  resolveStartPose(freepoint(0, 0, 0, deg), noArenas, noWalls, 30);

test.describe('resolveStartPose — freepoint heading', () => {

  test('position is taken verbatim, with no base-height offset', () => {
    // A freepoint is a world point by definition; adding baseHeight to it would
    // silently lift every free-standing bridge by 30 cm.
    const p = resolveStartPose(freepoint(75, 17, -4, 0), noArenas, noWalls, 30);
    expect(p.pos.x).toBeCloseTo(75, 6);
    expect(p.pos.y).toBeCloseTo(17, 6);
    expect(p.pos.z).toBeCloseTo(-4, 6);
  });

  test('THE BUG: heading 90 points along -X, not +Z', () => {
    // The old `(cos, 0, sin)` gave (0, 0, 1) here. The demo arena's East Pier
    // is anchored at x=75 heading 90 and must run inward toward x=25; with +Z
    // it ran from z=0 to z=50 at x=75 instead — across the arena, not into it.
    const d = poseFor(90).dir;
    expect(d.x).toBeCloseTo(-1, 6);
    expect(d.z).toBeCloseTo(0, 6);
  });

  test('all four cardinal headings match the convention', () => {
    const cases: [number, number, number][] = [
      [0,    0, 1],   // +Z
      [90,  -1, 0],   // -X
      [180,  0, -1],  // -Z
      [270,  1, 0],   // +X
    ];
    for (const [deg, x, z] of cases) {
      const d = poseFor(deg).dir;
      expect(d.x, `heading ${deg} x`).toBeCloseTo(x, 6);
      expect(d.z, `heading ${deg} z`).toBeCloseTo(z, 6);
    }
  });

  test('it agrees with headingToForward at arbitrary angles, not just cardinals', () => {
    // A 90-degree error hides at 45 degrees (both spellings give equal |x|,|z|),
    // so cardinal-only coverage is not enough to pin this down.
    for (const deg of [17, 45, 123, 200, 331]) {
      const d = poseFor(deg).dir;
      const e = headingToForward(deg);
      expect(d.x, `${deg} x`).toBeCloseTo(e.x, 6);
      expect(d.z, `${deg} z`).toBeCloseTo(e.z, 6);
    }
  });

  test('the direction round-trips back to its own heading', () => {
    for (const deg of [0, 37, 90, 180, 270, 315]) {
      const d = poseFor(deg).dir;
      const back = ((forwardToHeading(d.x, d.z) % 360) + 360) % 360;
      expect(back).toBeCloseTo(deg, 4);
    }
  });

  test('dir is a unit vector and up is world-up', () => {
    const p = poseFor(123);
    expect(p.dir.length()).toBeCloseTo(1, 6);
    expect(p.up.equals(new THREE.Vector3(0, 1, 0))).toBe(true);
  });

  test('the demo arena four-pier layout points every pier inward', () => {
    // The shipped config: each pier is anchored 75 cm out and should run toward
    // the centre. Inward means dir points opposite the anchor's radial vector.
    const piers: [number, number, number][] = [
      [ 75, 0,  90],   // East  -> -X
      [  0, 75, 180],  // South -> -Z
      [-75, 0,  270],  // West  -> +X
      [  0, -75, 0],   // North -> +Z
    ];
    for (const [x, z, deg] of piers) {
      const d = resolveStartPose(freepoint(x, 17, z, deg), noArenas, noWalls, 30).dir;
      const radial = new THREE.Vector3(x, 0, z).normalize();
      // Pointing inward == dot product with the outward radial is -1.
      expect(d.dot(radial), `pier at (${x},${z})`).toBeCloseTo(-1, 5);
    }
  });
});

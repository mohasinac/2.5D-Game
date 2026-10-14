import { test, expect } from '@playwright/test';
import {
  resolveChannel, resolveChannels, nearestSampleIndex,
  CHANNEL_DECK_TOLERANCE,
  type ChannelSegment,
} from '../../src/sim/step/channel';
import type { ColliderBody } from '../../src/sim/step/obstacles';

/**
 * U-channel retention.
 *
 * A deck already holds the bey up; nothing kept it on. Drive into a curve and
 * it slid off the side, which left every curved segment and the whole authored
 * `u_channel` cross-section decorative.
 *
 * The distinction from obstacle sides is the thing to keep straight: an
 * obstacle is closed and the body is pushed OUT; a channel is an open corridor
 * and the body is pushed IN, toward a centreline that curves and climbs.
 */

const BODY = (x: number, z: number, y = 0, vx = 0, vz = 0): ColliderBody => ({
  pos: { x, y, z },
  vel: { x: vx, y: 0, z: vz },
  radius: 5,
  tipOffset: -10,
  topOffset: 3,
});

/** Straight deck along +Z at y=0, so `right` is +X everywhere. */
function straightDeck(over: Partial<ChannelSegment> = {}): ChannelSegment {
  const points = [], rights = [];
  for (let i = 0; i <= 10; i++) {
    points.push({ x: 0, y: 0, z: i * 10 });
    rights.push({ x: 1, y: 0, z: 0 });
  }
  return {
    id: 'deck', points, rights,
    halfWidth: 15, wallHeight: 6, floorDrop: 0,
    hasLeftWall: true, hasRightWall: true, restitution: 0.4,
    ...over,
  };
}

/** A body whose TIP sits exactly on a y=0 deck. */
const onDeck = (x: number, z: number, vx = 0, vz = 0) => BODY(x, z, 10, vx, vz);

test.describe('nearest sample', () => {

  test('finds the closest centreline point', () => {
    const d = straightDeck();
    expect(nearestSampleIndex(d, 0, 0)).toBe(0);
    expect(nearestSampleIndex(d, 0, 52)).toBe(5);
    expect(nearestSampleIndex(d, 0, 100)).toBe(10);
  });

  test('is measured in XZ only — height must not pick the sample', () => {
    // A banked or climbing deck would otherwise snap to the wrong station.
    const d = straightDeck();
    expect(nearestSampleIndex(d, 0, 52)).toBe(nearestSampleIndex(d, 0, 52));
    expect(nearestSampleIndex({ ...d, points: d.points.map(p => ({ ...p, y: 999 })) }, 0, 52)).toBe(5);
  });
});

test.describe('retention', () => {

  test('THE POINT: a body past the rail is pushed back onto the deck', () => {
    const b = onDeck(14, 50, 60, 0);            // limit is 15 - 5 = 10
    expect(resolveChannel(b, straightDeck())).toBe(true);
    expect(b.pos.x, 'returned to the usable corridor edge').toBeCloseTo(10, 5);
    expect(b.vel.x, 'outward velocity reversed').toBeLessThan(0);
  });

  test('a body inside the corridor is untouched', () => {
    const b = onDeck(3, 50, 60, 0);
    expect(resolveChannel(b, straightDeck())).toBe(false);
    expect(b.pos.x).toBe(3);
    expect(b.vel.x).toBe(60);
  });

  test('it works on the left as well as the right', () => {
    const b = onDeck(-14, 50, -60, 0);
    expect(resolveChannel(b, straightDeck())).toBe(true);
    expect(b.pos.x).toBeCloseTo(-10, 5);
    expect(b.vel.x).toBeGreaterThan(0);
  });

  test('a missing wall does not retain on that side', () => {
    const openRight = straightDeck({ hasRightWall: false });
    expect(resolveChannel(onDeck(14, 50, 60, 0), openRight), 'falls off the open side').toBe(false);
    expect(resolveChannel(onDeck(-14, 50, -60, 0), openRight), 'still held on the walled side').toBe(true);
  });

  test('a deck with no walls at all is skipped entirely', () => {
    const flat = straightDeck({ hasLeftWall: false, hasRightWall: false });
    expect(resolveChannel(onDeck(14, 50, 60, 0), flat)).toBe(false);
  });

  test('a body already returning to the centre is not kicked again', () => {
    // Otherwise resting against a rail becomes a buzz.
    const b = onDeck(14, 50, -30, 0);
    resolveChannel(b, straightDeck());
    expect(b.vel.x, 'inward velocity preserved').toBeCloseTo(-30, 5);
  });

  test('restitution scales the bounce off a rail', () => {
    const soft = onDeck(14, 50, 60, 0);
    const hard = onDeck(14, 50, 60, 0);
    resolveChannel(soft, straightDeck({ restitution: 0 }));
    resolveChannel(hard, straightDeck({ restitution: 1 }));
    expect(soft.vel.x).toBeCloseTo(0, 5);
    expect(hard.vel.x).toBeCloseTo(-60, 5);
  });
});

test.describe('vertical gating', () => {

  test('a body below the deck is not retained by it', () => {
    // A bey in the bowl must not be shoved sideways by a bridge overhead.
    const b = BODY(14, 50, -40, 60, 0);
    expect(resolveChannel(b, straightDeck())).toBe(false);
  });

  test('a body above the rails has cleared them', () => {
    const d = straightDeck();                   // wallHeight 6
    const b = BODY(14, 50, 10 + 6 + 2, 60, 0);  // tip well above the rail top
    expect(resolveChannel(b, d)).toBe(false);
  });

  test('a body resting exactly on the deck IS retained', () => {
    // The boundary case that matters: this is the normal riding state.
    const b = onDeck(14, 50, 60, 0);
    expect(resolveChannel(b, straightDeck())).toBe(true);
  });

  test('A U-CHANNEL FLOOR DIP DOES NOT LOSE THE BODY', () => {
    /* The running surface of a u_channel sits `depth` below the sampled
       centreline, so the body legitimately rides under the path. With the demo
       pier's depth of 2 and a tolerance of 2 the body sat exactly on the
       rejection boundary and retention fired or not on float noise -- the bey
       slid off a walled deck with `channelContacts` stuck at 0. */
    const dipped = straightDeck({ floorDrop: 4 });
    const riding = BODY(14, 50, 10 - 4, 60, 0);     // tip 4 below the centreline
    expect(resolveChannel(riding, dipped)).toBe(true);
    // ...and the same body on a FLAT deck of the same height is correctly
    // treated as below it.
    expect(resolveChannel(BODY(14, 50, 10 - 4, 60, 0), straightDeck())).toBe(false);
  });

  test('the tolerance allows a tip a hair under the deck', () => {
    // Float noise puts a resting tip slightly below the surface it rides.
    const b = BODY(14, 50, 10 - (CHANNEL_DECK_TOLERANCE / 2), 60, 0);
    expect(resolveChannel(b, straightDeck())).toBe(true);
  });
});

test.describe('curved decks', () => {

  test('sideways follows the track, not the world axes', () => {
    /* A quarter circle: at the 90-degree station the deck runs along -X, so
       "off the side" is along Z there. A resolver that assumed a fixed right
       vector would push the body along X and do nothing useful. */
    const points = [], rights = [];
    for (let i = 0; i <= 10; i++) {
      const a = (i / 10) * (Math.PI / 2);
      points.push({ x: 50 * Math.sin(a), y: 0, z: 50 * Math.cos(a) });
      // Outward radial is the right vector for a curve turning left.
      rights.push({ x: Math.sin(a), y: 0, z: Math.cos(a) });
    }
    const curve: ChannelSegment = {
      id: 'curve', points, rights, halfWidth: 15, wallHeight: 6, floorDrop: 0,
      hasLeftWall: true, hasRightWall: true, restitution: 0.4,
    };

    // At the far end the track is at (50, 0) and sideways is +X.
    const b = onDeck(62, 0, 60, 0);
    expect(resolveChannel(b, curve)).toBe(true);
    expect(b.pos.x, 'pushed inward along the local radial').toBeLessThan(62);
    expect(Math.abs(b.pos.z), 'and not displaced along the track').toBeLessThan(1);
  });
});

test.describe('degenerate inputs', () => {

  test('an empty centreline is a no-op, not a crash', () => {
    const b = onDeck(14, 50, 60, 0);
    expect(resolveChannel(b, straightDeck({ points: [], rights: [] }))).toBe(false);
  });

  test('a deck narrower than the body retains nothing rather than oscillating', () => {
    // limit would be negative; pushing to it would shove the body across the
    // centreline and back every frame.
    const narrow = straightDeck({ halfWidth: 3 });   // body radius is 5
    const b = onDeck(1, 50, 10, 0);
    expect(resolveChannel(b, narrow)).toBe(false);
  });

  test('A DISTANT DECK DOES NOT RETAIN THE BODY', () => {
    /* Lateral offset alone cannot tell "just past the rail" from "900 cm
       away" -- both are simply "beyond the limit on the + side". Without a
       proximity test the far deck claimed the body and dragged it sideways,
       and the demo arena's four piers all sit at the SAME deck height, so a
       bey riding one was eligible to be retained by every one of them. */
    const near = straightDeck();
    const far  = straightDeck({ id: 'far', points: straightDeck().points.map(p => ({ ...p, x: 900 })) });
    expect(resolveChannels(onDeck(14, 50, 60, 0), [near, far])).toEqual(['deck']);
  });

  test('a body past the END of a segment is not retained by it', () => {
    // The same proximity test bounds the corridor longitudinally, so the
    // forward vector does not have to be stored to get this right.
    const b = onDeck(14, 400, 60, 0);     // deck runs z 0..100
    expect(resolveChannel(b, straightDeck())).toBe(false);
  });

  test('DETERMINISM: identical inputs give identical results', () => {
    const run = () => {
      const b = onDeck(14, 37, 55, -12);
      resolveChannels(b, [straightDeck()]);
      return JSON.stringify(b);
    };
    expect(run()).toBe(run());
  });
});

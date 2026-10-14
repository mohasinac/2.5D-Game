import { test, expect } from '@playwright/test';
import {
  resolveBeyPair, resolveBeyPairs, contactBand, BEY_CONTACT_EPS,
  type BeyBody,
} from '../../src/sim/step/beyCollision';

/**
 * Bey-vs-bey contact.
 *
 * Until this existed the project had exactly one physics entity, so no attack
 * ring, blade, wheel or layer could ever strike anything — roughly 700 corpus
 * cases blocked on that single absence.
 *
 * The tests that matter most here are the contact-HEIGHT ones. Two circles
 * overlapping in XZ is the easy half; whether a 145-height track means the
 * attacker's wheel reaches the opponent's layer or passes under it is the half
 * the corpus actually turns on, and the half a naive 2D resolver gets silently
 * wrong.
 */

function bey(over: Partial<BeyBody> = {}): BeyBody {
  return {
    id: 'a', pos: { x: 0, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 },
    radius: 10, mass: 30, contactLow: -5, contactHigh: 5, restitution: 0.5,
    ...over,
  };
}

test.describe('contact band', () => {

  test('two beys at the same height share their whole band', () => {
    const band = contactBand(bey(), bey({ id: 'b' }))!;
    expect(band).not.toBeNull();
    expect(band.lo).toBeCloseTo(-5, 6);
    expect(band.hi).toBeCloseTo(5, 6);
  });

  test('THE POINT: a bey riding high above another shares nothing', () => {
    const low  = bey({ id: 'low' });                       // band -5..5
    const high = bey({ id: 'high', pos: { x: 0, y: 40, z: 0 } }); // band 35..45
    expect(contactBand(low, high)).toBeNull();
  });

  test('a partial overlap reports only the shared slice', () => {
    const a = bey();                                        // -5..5
    const b = bey({ id: 'b', pos: { x: 0, y: 8, z: 0 } });  //  3..13
    const band = contactBand(a, b)!;
    expect(band.lo).toBeCloseTo(3, 6);
    expect(band.hi).toBeCloseTo(5, 6);
  });

  test('touching exactly at a lip is not an overlap', () => {
    // Zero-height contact transfers nothing; treating it as a hit would make
    // beys collide while visibly not touching.
    const a = bey();                                         // -5..5
    const b = bey({ id: 'b', pos: { x: 0, y: 10, z: 0 } });  //  5..15
    expect(contactBand(a, b)).toBeNull();
  });

  test('asymmetric heights work — a tall bey reaches down to a short one', () => {
    const tall  = bey({ id: 'tall', contactLow: -20, contactHigh: 5 });
    const short = bey({ id: 'short', pos: { x: 0, y: -15, z: 0 }, contactLow: -3, contactHigh: 3 });
    const band = contactBand(tall, short)!;
    expect(band.lo).toBeCloseTo(-18, 6);
    expect(band.hi).toBeCloseTo(-12, 6);
  });
});

test.describe('contact resolution', () => {

  test('THE POINT: two approaching beys exchange impulse', () => {
    const a = bey({ id: 'a', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 } });
    const b = bey({ id: 'b', pos: { x:  8, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 } });
    const c = resolveBeyPair(a, b)!;
    expect(c).not.toBeNull();
    expect(a.vel.x, 'attacker slowed').toBeLessThan(100);
    expect(b.vel.x, 'target knocked away').toBeGreaterThan(0);
    expect(c.impulse).toBeGreaterThan(0);
  });

  test('beys that are not overlapping do not touch', () => {
    const a = bey({ pos: { x: -50, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 } });
    const b = bey({ id: 'b', pos: { x: 50, y: 0, z: 0 } });
    expect(resolveBeyPair(a, b)).toBeNull();
    expect(a.vel.x).toBe(100);
  });

  test('HEIGHT GATES CONTACT: overlapping in XZ is not enough', () => {
    // Directly on top of one another and fully overlapping as circles, but
    // their contact bands are 40 cm apart. A 2D resolver would smash them.
    const a = bey({ pos: { x: 0, y: 0,  z: 0 }, vel: { x: 100, y: 0, z: 0 } });
    const b = bey({ id: 'b', pos: { x: 5, y: 40, z: 0 } });
    expect(resolveBeyPair(a, b)).toBeNull();
    expect(a.vel.x, 'and the attacker is undisturbed').toBe(100);
  });

  test('momentum is conserved when the collision is perfectly inelastic', () => {
    const a = bey({ id: 'a', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 }, mass: 30, restitution: 0 });
    const b = bey({ id: 'b', pos: { x:  8, y: 0, z: 0 }, vel: { x: -20, y: 0, z: 0 }, mass: 50, restitution: 0 });
    const pBefore = 30 * 100 + 50 * -20;
    resolveBeyPair(a, b);
    const pAfter = 30 * a.vel.x + 50 * b.vel.x;
    expect(pAfter).toBeCloseTo(pBefore, 4);
  });

  test('momentum is conserved when it is perfectly elastic too', () => {
    const a = bey({ id: 'a', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 }, mass: 30, restitution: 1 });
    const b = bey({ id: 'b', pos: { x:  8, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 }, mass: 30, restitution: 1 });
    resolveBeyPair(a, b);
    expect(30 * a.vel.x + 30 * b.vel.x).toBeCloseTo(3000, 4);
    // Equal masses, e=1, head on: they swap velocities.
    expect(a.vel.x).toBeCloseTo(0, 4);
    expect(b.vel.x).toBeCloseTo(100, 4);
  });

  test('restitution controls how hard they bounce apart', () => {
    const mk = (e: number) => {
      const a = bey({ id: 'a', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 }, restitution: e });
      const b = bey({ id: 'b', pos: { x:  8, y: 0, z: 0 }, restitution: e });
      resolveBeyPair(a, b);
      return b.vel.x;
    };
    expect(mk(1)).toBeGreaterThan(mk(0));
  });

  test('the softer material governs the pair', () => {
    // Rubber-on-metal behaves like rubber, not like metal.
    const a = bey({ id: 'a', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 }, restitution: 0.15 });
    const b = bey({ id: 'b', pos: { x:  8, y: 0, z: 0 }, restitution: 0.90 });
    const soft = bey({ id: 'a2', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 }, restitution: 0.15 });
    const soft2 = bey({ id: 'b2', pos: { x: 8, y: 0, z: 0 }, restitution: 0.15 });
    const c1 = resolveBeyPair(a, b)!;
    const c2 = resolveBeyPair(soft, soft2)!;
    expect(c1.impulse).toBeCloseTo(c2.impulse, 6);
  });

  test('a body already separating is depenetrated but not struck again', () => {
    const a = bey({ id: 'a', pos: { x: -8, y: 0, z: 0 }, vel: { x: -50, y: 0, z: 0 } });
    const b = bey({ id: 'b', pos: { x:  8, y: 0, z: 0 }, vel: { x:  50, y: 0, z: 0 } });
    const c = resolveBeyPair(a, b)!;
    expect(c.impulse, 'no impulse while separating').toBe(0);
    expect(a.vel.x, 'velocities untouched').toBe(-50);
    expect(b.pos.x, 'but the overlap is still corrected').toBeGreaterThan(8);
  });
});

test.describe('mass asymmetry', () => {

  test('THE WEIGHT CLASS: the heavy bey shoves the light one, not vice versa', () => {
    const heavy = bey({ id: 'heavy', pos: { x: -8, y: 0, z: 0 }, mass: 90 });
    const light = bey({ id: 'light', pos: { x:  8, y: 0, z: 0 }, mass: 10 });
    const hx = heavy.pos.x, lx = light.pos.x;
    resolveBeyPair(heavy, light);
    const heavyMoved = Math.abs(heavy.pos.x - hx);
    const lightMoved = Math.abs(light.pos.x - lx);
    expect(lightMoved, 'the light one gives way').toBeGreaterThan(heavyMoved * 5);
  });

  test('a light bey bounces off a heavy one much faster than the reverse', () => {
    const heavy = bey({ id: 'heavy', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 }, mass: 90 });
    const light = bey({ id: 'light', pos: { x:  8, y: 0, z: 0 }, mass: 10 });
    resolveBeyPair(heavy, light);
    expect(Math.abs(light.vel.x)).toBeGreaterThan(Math.abs(heavy.vel.x - 100) * 5);
  });

  test('a zero-mass pair is left alone rather than producing NaN', () => {
    const a = bey({ id: 'a', pos: { x: -8, y: 0, z: 0 }, mass: 0, vel: { x: 100, y: 0, z: 0 } });
    const b = bey({ id: 'b', pos: { x:  8, y: 0, z: 0 }, mass: 0 });
    expect(resolveBeyPair(a, b)).toBeNull();
    expect(Number.isFinite(a.pos.x)).toBe(true);
  });
});

test.describe('degenerate geometry', () => {

  test('perfectly concentric beys get a finite separation, not NaN', () => {
    const a = bey({ id: 'a' });
    const b = bey({ id: 'b' });
    const c = resolveBeyPair(a, b);
    expect(c).not.toBeNull();
    expect(Number.isFinite(a.pos.x) && Number.isFinite(b.pos.x)).toBe(true);
    expect(Math.abs(b.pos.x - a.pos.x)).toBeGreaterThan(0);
  });

  test('a sub-epsilon graze is ignored rather than jittered', () => {
    const a = bey({ id: 'a', pos: { x: 0, y: 0, z: 0 } });
    const b = bey({ id: 'b', pos: { x: 20 - BEY_CONTACT_EPS / 2, y: 0, z: 0 } });
    expect(resolveBeyPair(a, b)).toBeNull();
  });
});

test.describe('the contact report', () => {

  test('names both beys and where on them the hit landed', () => {
    const a = bey({ id: 'attacker', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 } });
    const b = bey({ id: 'target',   pos: { x:  8, y: 0, z: 0 } });
    const c = resolveBeyPair(a, b)!;
    expect(c.a).toBe('attacker');
    expect(c.b).toBe('target');
    expect(c.contactY).toBeCloseTo(0, 6);
    expect(c.overlapHeight).toBeCloseTo(10, 6);
    expect(c.approachSpeed).toBeCloseTo(100, 4);
  });

  test('a glancing height overlap reports a thin band', () => {
    // The difference between a full-face smash and clipping the opponent's
    // lip, which is what an upstream damage model needs to tell them apart.
    const a = bey({ id: 'a', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 } });
    const b = bey({ id: 'b', pos: { x:  8, y: 9, z: 0 } });     // bands -5..5 and 4..14
    const c = resolveBeyPair(a, b)!;
    expect(c.overlapHeight).toBeCloseTo(1, 6);
    expect(c.contactY).toBeCloseTo(4.5, 6);
  });
});

test.describe('resolveBeyPairs', () => {

  test('every unordered pair is resolved exactly once', () => {
    // Visiting (a,b) and (b,a) would double every impulse.
    const a = bey({ id: 'a', pos: { x: -8, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 } });
    const b = bey({ id: 'b', pos: { x:  8, y: 0, z: 0 } });
    const contacts = resolveBeyPairs([a, b]);
    expect(contacts).toHaveLength(1);
    expect(contacts[0].a).toBe('a');
  });

  test('a three-bey pile-up reports each touching pair', () => {
    const a = bey({ id: 'a', pos: { x: -9, y: 0, z: 0 } });
    const b = bey({ id: 'b', pos: { x:  0, y: 0, z: 0 } });
    const c = bey({ id: 'c', pos: { x:  9, y: 0, z: 0 } });
    const ids = resolveBeyPairs([a, b, c]).map(x => `${x.a}-${x.b}`);
    expect(ids).toContain('a-b');
    expect(ids).toContain('b-c');
  });

  test('a lone bey has nothing to hit', () => {
    expect(resolveBeyPairs([bey()])).toEqual([]);
    expect(resolveBeyPairs([])).toEqual([]);
  });

  test('DETERMINISM: the same roster resolves identically every time', () => {
    const run = () => {
      const bodies = [
        bey({ id: 'a', pos: { x: -9, y: 0, z: 1 }, vel: { x: 70, y: 0, z: -5 } }),
        bey({ id: 'b', pos: { x:  0, y: 0, z: 0 }, vel: { x: -3, y: 0, z: 2 }, mass: 45 }),
        bey({ id: 'c', pos: { x:  9, y: 0, z: -1 }, vel: { x: 0, y: 0, z: 0 }, mass: 20 }),
      ];
      const out = resolveBeyPairs(bodies);
      return JSON.stringify({ bodies, out });
    };
    expect(run()).toBe(run());
  });
});

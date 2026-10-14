import { test, expect } from '@playwright/test';

/**
 * The bey can stand on a bridge deck.
 *
 * WHY THIS EXISTS
 * ───────────────
 * Until this passed, the entire bridge system — ten segment types including
 * loops, hairpins and corkscrews — was scenery the bey drove straight through.
 * `SpawnManager` resolved its ground from the analytic arena formula plus a
 * flat octagon fallback, and consulted no mesh at all.
 *
 * Getting here needed two fixes that look unrelated and were not:
 *
 *   1. `projectBelow` on the projector — "what is under my feet", as distinct
 *      from `project`'s "what is highest in this column". The latter is right
 *      for painting a ribbon onto a stadium from above and badly wrong for
 *      physics: a bey in the bowl under a bridge would be told the deck is its
 *      ground and teleport onto it.
 *   2. The heading convention in `resolveStartPose`. `freeDirDeg` was read with
 *      `(cos, 0, sin)` where this project uses `(-sin, 0, cos)` — the same
 *      vector rotated 90 degrees. Every free-standing bridge was therefore
 *      built across its intended axis, so even a correct physics path had
 *      nothing to stand on where the config said there was a pier.
 *
 * Fix 1 alone looked like a failure, which is why this test asserts position,
 * not just `grounded`: a bey resting on the bowl floor is also grounded.
 */

const ARENA = '/arena';

/** Deck height of every pier in the shipped demo arena (`freePosY: 17`). */
const DECK_Y = 17;
/** `BALL_TIP_OFFSET` — the tip sits this far below the group origin. */
const TIP_OFFSET = -10;

interface BeyState {
  pos: { x: number; y: number; z: number };
  vel: { x: number; y: number; z: number };
  grounded: boolean;
  obstacleContacts: number;
  channelContacts: number;
}

async function loadDemoArena(page: import('@playwright/test').Page) {
  await page.goto(ARENA, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!(window as never as { __demo?: unknown }).__demo, null, { timeout: 60_000 });
  await page.evaluate(async () => {
    /* Specifier held in a variable so tsc does not try to resolve a
       dev-server URL against the repo's module graph; Vite serves it at
       runtime. */
    const spec = '/src/config/demoArenaConfig.ts';
    const m = await import(/* @vite-ignore */ spec) as { DEMO_ARENA_CONFIG: unknown };
    await (window as never as { __demo: { loadArenaConfig(c: unknown): Promise<void> } })
      .__demo.loadArenaConfig(m.DEMO_ARENA_CONFIG);
  });
  await page.waitForTimeout(1200);
}

/** Drop a bey from well above (x, z) and return its resting state. */
async function dropAt(page: import('@playwright/test').Page, x: number, z: number): Promise<BeyState> {
  type Demo = {
    despawnBey(): void;
    spawnBey(o: unknown): void;
    getBeyState(): BeyState;
  };

  // `spawn()` early-returns when one is already live, so a missing despawn
  // silently reuses the previous drop's resting position.
  await page.evaluate(() => (window as never as { __demo: Demo }).__demo.despawnBey());
  await page.evaluate(([px, pz]) =>
    (window as never as { __demo: Demo }).__demo.spawnBey({
      pos: { x: px, y: 40, z: pz }, vel: { x: 0, y: 0, z: 0 }, rpm: 0,
    }), [x, z]);

  let s: BeyState | null = null;
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(200);
    s = await page.evaluate(() => (window as never as { __demo: Demo }).__demo.getBeyState());
    if (s.grounded && Math.abs(s.vel.y) < 0.5 && Math.hypot(s.vel.x, s.vel.z) < 1) break;
  }
  expect(s, 'bey state should be readable').not.toBeNull();
  return s!;
}

test.describe('bridge deck collision', () => {

  test('the demo arena piers are built along their configured axis', async ({ page }) => {
    await loadDemoArena(page);
    const diag = await page.evaluate(() =>
      (window as never as { __demo: { getBridgeDiag(): unknown[] } }).__demo.getBridgeDiag()) as {
        bridgeId: string; groupInScene: boolean; segments: number; withMesh: number; inScene: number;
        segGeom: { id: string; vertices: number; box: { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } } | null }[];
      }[];

    expect(diag.length, 'demo arena ships four piers').toBe(4);
    for (const b of diag) {
      expect(b.groupInScene, `${b.bridgeId} group in scene`).toBe(true);
      expect(b.segments, `${b.bridgeId} segment count`).toBeGreaterThan(0);
      expect(b.withMesh, `${b.bridgeId} every segment has a mesh`).toBe(b.segments);
      expect(b.inScene, `${b.bridgeId} every mesh is parented`).toBe(b.segments);

      for (const g of b.segGeom) {
        expect(g.vertices, `${g.id} has geometry`).toBeGreaterThan(0);
        expect(g.box, `${g.id} has a bounding box`).not.toBeNull();
        // Every deck sits at the configured height, flat.
        expect(g.box!.min.y, `${g.id} deck height`).toBeCloseTo(DECK_Y, 1);
        expect(g.box!.max.y, `${g.id} deck height`).toBeCloseTo(DECK_Y, 1);
        /* THE HEADING BUG: a pier is long on exactly one horizontal axis and
           narrow on the other. With the 90-degree-rotated convention each pier
           was still long-and-narrow — just across the wrong axis — so a shape
           check alone would have passed. The per-pier axis assertions below
           are what actually pin it. */
        const spanX = g.box!.max.x - g.box!.min.x;
        const spanZ = g.box!.max.z - g.box!.min.z;
        expect(Math.max(spanX, spanZ) / Math.min(spanX, spanZ),
          `${g.id} is an elongated deck`).toBeGreaterThan(2);
      }
    }

    // East pier runs along X at z~0; South runs along Z at x~0.
    const east  = diag.find(b => b.bridgeId === 'bridge-1')!;
    const south = diag.find(b => b.bridgeId === 'bridge-2')!;
    for (const g of east.segGeom) {
      expect(Math.abs(g.box!.min.z), 'east pier hugs z=0').toBeLessThan(10);
      expect(g.box!.min.x, 'east pier lies on +X').toBeGreaterThan(0);
    }
    for (const g of south.segGeom) {
      expect(Math.abs(g.box!.min.x), 'south pier hugs x=0').toBeLessThan(10);
      expect(g.box!.min.z, 'south pier lies on +Z').toBeGreaterThan(0);
    }
  });

  test('THE POINT: a bey dropped on a pier rests on the deck', async ({ page }) => {
    await loadDemoArena(page);
    for (const [label, x, z] of [
      ['east',  50,   0],
      ['south',  0,  50],
      ['west', -50,   0],
    ] as [string, number, number][]) {
      const s = await dropAt(page, x, z);
      const tipY = s.pos.y + TIP_OFFSET;
      expect(tipY, `${label} pier: tip rests on the deck`).toBeCloseTo(DECK_Y, 1);
      expect(s.grounded, `${label} pier: grounded`).toBe(true);
      // It must stay put, not slide off the 6 cm-wide deck.
      expect(Math.abs(s.pos.x - x), `${label} pier: did not drift in x`).toBeLessThan(5);
      expect(Math.abs(s.pos.z - z), `${label} pier: did not drift in z`).toBeLessThan(5);
    }
  });

  test('a bey dropped beside a pier falls past it into the bowl', async ({ page }) => {
    // The control. Without it, "rests at deck height" could just mean the
    // surface resolver had stopped letting anything fall anywhere.
    await loadDemoArena(page);
    const s = await dropAt(page, 50, 30);
    expect(s.pos.y + TIP_OFFSET, 'off-pier drop ends well below deck height').toBeLessThan(0);
    expect(s.grounded, 'and still lands on something').toBe(true);
  });

  test('THE TOWER CASE: a pillar stops the bey instead of letting it through', async ({ page }) => {
    /* The acceptance case the plan names: drive the bey at the Tower arena's
       central pillar and it must stop.

       The setup is the way it is because two easier versions of this test
       PASSED WITHOUT THE FEATURE, and both were caught by re-running them with
       `_resolveObstacles` commented out:

         - Dropping on the pillar and checking distance-from-axis: a bey that
           drove through and carried on to the bowl centre still sits 25 cm
           from a pillar at x=25, satisfying any "outside the radius" check.
         - Approaching along +X: the East Pier runs x 25..75 at z~0, so the bey
           landed on the DECK at y=27 and never reached the bowl at all.

       Hence: a diagonal approach (the four piers lie on the axes), and an
       explicit shove, because the bowl is shallow enough here that a dropped
       bey simply stays where it lands -- measured, not assumed.

       Measured baseline with the feature disabled: closest approach 2.47 cm to
       the axis, resting at (15, 15) INSIDE the pillar. With it enabled: 16.36,
       never inside the 15 cm contact surface. */
    const PILLAR = { x: 25, z: 25, r: 16 };
    const CONTACT = PILLAR.r + 5;            // pillar radius + the bey's girth

    await page.goto(ARENA, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!(window as never as { __demo?: unknown }).__demo, null, { timeout: 60_000 });
    await page.evaluate(async (P) => {
      const spec = '/src/config/demoArenaConfig.ts';
      const m = await import(/* @vite-ignore */ spec) as { DEMO_ARENA_CONFIG: unknown };
      const cfg = JSON.parse(JSON.stringify(m.DEMO_ARENA_CONFIG)) as
        { obstacles: Record<string, unknown>[] };
      /* The demo's own obstacles are boats floating ABOVE the water with the
         bey resting well below them, so nothing there can be reached
         sideways. One is promoted to a pillar spanning the bowl. */
      const o = cfg.obstacles.find(ob => ob.id === 'obstacle-5')!;
      Object.assign(o, {
        shape: 'cylinder', dimX: P.r * 2, dimY: 80, dimZ: P.r * 2,
        posX: P.x, posY: -10, posZ: P.z, rotY: 0, isFloating: true,
      });
      await (window as never as { __demo: { loadArenaConfig(c: unknown): Promise<void> } })
        .__demo.loadArenaConfig(cfg);
    }, PILLAR);
    await page.waitForTimeout(1500);

    type Demo = {
      despawnBey(): void; spawnBey(o: unknown): void;
      setBeyVelocity(v: { x: number; y: number; z: number }): void;
      getBeyState(): BeyState;
    };
    await page.evaluate(() => (window as never as { __demo: Demo }).__demo.despawnBey());
    await page.evaluate(() => (window as never as { __demo: Demo }).__demo
      .spawnBey({ pos: { x: 48, y: 20, z: 48 }, vel: { x: 0, y: 0, z: 0 }, rpm: 0 }));
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(150);
      const s = await page.evaluate(() => (window as never as { __demo: Demo }).__demo.getBeyState());
      if (s.grounded) break;
    }
    await page.evaluate(() => (window as never as { __demo: Demo }).__demo
      .setBeyVelocity({ x: -280, y: 0, z: -280 }));

    let s: BeyState | null = null;
    for (let i = 0; i < 40; i++) {
      await page.waitForTimeout(100);
      s = await page.evaluate(() => (window as never as { __demo: Demo }).__demo.getBeyState());
      if (Math.hypot(s.vel.x, s.vel.z) < 1) break;
    }
    const restD = Math.hypot(s!.pos.x - PILLAR.x, s!.pos.z - PILLAR.z);

    /* GUARD 1 -- the feature did something. Contact is otherwise unobservable:
       the bey rebounds to ~31.6 cm from the axis, and one that never moved at
       all sits at 32.5. Those are indistinguishable by position, so a
       position-only test passes with the feature switched off. Measured: 0
       contacts disabled, non-zero enabled. */
    expect(s!.obstacleContacts, 'the bey actually struck the pillar')
      .toBeGreaterThan(0);

    /* GUARD 2 -- and the result is right. Measured: 14.06 disabled (resting
       INSIDE a pillar whose contact surface is at 21), 31.59 enabled. */
    expect(restD, 'and did not end up inside it').toBeGreaterThan(CONTACT - 1);
  });

  test('U-CHANNEL: side walls keep the bey on the deck', async ({ page }) => {
    /* A deck holds the bey UP; without side walls nothing keeps it ON, so any
       lateral push sends it over the edge.

       THE FIXTURE IS THE WHOLE DIFFICULTY, and two earlier attempts at this
       test were abandoned as "flaky" before the cause was understood:

         - A `u_channel` section is a BAD fixture. Its floor dips toward the
           centre and therefore curves UP toward the rails (15.0 at the middle,
           16.3 near the edge on this pier), so geometry alone already retains
           the bey and the test cannot show the resolver did anything. This
           uses a FLAT deck with rails instead, which isolates it.
         - The container tunnels. At 260 cm/s on the default variable timestep
           the bey jumped clean past the corridor in a single step and was
           never recaptured, so repeated identical runs disagreed about whether
           it stayed on. `setFixedTimestep` removes that; it is exactly what
           the hook exists for.

       With both fixed the result is deterministic: three identical runs land
       on z=4.2 with one wall contact. Falsification-checked -- with
       `_resolveChannels` commented out all three runs instead fall to the bowl
       at z=17.5 with zero contacts. */
    await page.goto(ARENA, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!(window as never as { __demo?: unknown }).__demo, null, { timeout: 60_000 });
    await page.evaluate(async () => {
      const spec = '/src/config/demoArenaConfig.ts';
      const m = await import(/* @vite-ignore */ spec) as { DEMO_ARENA_CONFIG: unknown };
      const cfg = JSON.parse(JSON.stringify(m.DEMO_ARENA_CONFIG)) as
        { bridges: Record<string, unknown>[] };
      const pier = cfg.bridges.find(b => b.id === 'bridge-1')!;
      Object.assign(pier.section as Record<string, unknown>, {
        width: 24, startWidth: 24, endWidth: 24,
        crossSection: 'flat', depth: 0,
        hasLeftWall: true, hasRightWall: true, sideWallHeight: 10,
      });
      await (window as never as { __demo: { loadArenaConfig(c: unknown): Promise<void> } })
        .__demo.loadArenaConfig(cfg);
    });

    type Demo = {
      despawnBey(): void; spawnBey(o: unknown): void;
      setBeyVelocity(v: { x: number; y: number; z: number }): void;
      setFixedTimestep(ms: number | null): void;
      getBeyState(): BeyState;
    };
    await page.evaluate(() => (window as never as { __demo: Demo }).__demo.setFixedTimestep(1000 / 120));
    await page.waitForTimeout(1500);

    await page.evaluate(() => (window as never as { __demo: Demo }).__demo.despawnBey());
    await page.evaluate(() => (window as never as { __demo: Demo }).__demo
      .spawnBey({ pos: { x: 50, y: 40, z: 0 }, vel: { x: 0, y: 0, z: 0 }, rpm: 0 }));

    let s: BeyState | null = null;
    for (let i = 0; i < 40; i++) {
      await page.waitForTimeout(150);
      s = await page.evaluate(() => (window as never as { __demo: Demo }).__demo.getBeyState());
      if (s.grounded && Math.abs(s.vel.y) < 0.5) break;
    }
    const rideY = s!.pos.y + TIP_OFFSET;
    expect(rideY, 'precondition: riding the pier deck').toBeCloseTo(DECK_Y, 1);

    // Shove it straight at the rail, across the deck.
    await page.evaluate(() => (window as never as { __demo: Demo }).__demo
      .setBeyVelocity({ x: 0, y: 0, z: 200 }));
    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(100);
      s = await page.evaluate(() => (window as never as { __demo: Demo }).__demo.getBeyState());
      if (Math.hypot(s.vel.x, s.vel.z) < 1) break;
    }

    expect(s!.channelContacts, 'a side wall actually caught it').toBeGreaterThan(0);
    expect(s!.pos.y + TIP_OFFSET, 'and it is still on the deck, not in the bowl')
      .toBeCloseTo(rideY, 1);
  });

  test('a deck overhead does not capture a bey below it', async ({ page }) => {
    // `project` would answer "the deck" for any column containing one; standing
    // must use `projectBelow`. Dropping from UNDER the deck height proves the
    // bey is not teleported up onto it.
    await loadDemoArena(page);
    type Demo = {
      despawnBey(): void; spawnBey(o: unknown): void; getBeyState(): BeyState;
    };
    await page.evaluate(() => (window as never as { __demo: Demo }).__demo.despawnBey());
    await page.evaluate(() => (window as never as { __demo: Demo }).__demo.spawnBey({
      pos: { x: 50, y: 5, z: 0 }, vel: { x: 0, y: 0, z: 0 }, rpm: 0,
    }));
    let s: BeyState | null = null;
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(200);
      s = await page.evaluate(() => (window as never as { __demo: Demo }).__demo.getBeyState());
      if (s.grounded && Math.abs(s.vel.y) < 0.5) break;
    }
    expect(s!.pos.y + TIP_OFFSET, 'started below the deck, must not snap up to it')
      .toBeLessThan(DECK_Y);
  });
});

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

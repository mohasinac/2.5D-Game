/**
 * Feature demo runner.
 *
 *   npm run demo:features                 # watch all of them
 *   npm run demo:features -- -g "wall"    # one family
 *   npm run demo:features -- -g "sl-preset-trefoil"
 *
 * Headed by default so the demos can actually be watched, with real GPU WebGL.
 * This is NOT the regression suite — that is tests/e2e, which runs headless in
 * Docker. Failures here are expected on a first run: the contact sheet IS the
 * feature audit.
 */

import { test, expect, type Page } from '@playwright/test';
import { DEMOS } from './demos';
import { DemoDriver } from './driver';

/** Matches baseArena() in arenaFactory.ts: radius 60, depth 24, rim at Y=0. */
const ARENA_RADIUS_CM = 60;
/** Bowl floor sits at −24; anything below this inside the footprint is a leak. */
const BOWL_FLOOR_FLOOR_CM = -40;

/* All demos share one page. Reloading per demo would add ~4 s each — over 15
   minutes of pure navigation across the manifest — and would reset the camera.

   Deliberately NOT `mode: 'serial'`: serial skips every remaining test after the
   first failure, which is the exact opposite of what this runner is for. Order
   is already guaranteed by workers:1 + fullyParallel:false. */
let page: Page;
let driver: DemoDriver;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  page.on('pageerror', (e) => {
    // Surfaced per-demo below; logged here so the cause is visible in order.
    console.error(`  [pageerror] ${e.message.slice(0, 200)}`);
  });
  driver = new DemoDriver(page);
  await driver.open();
});

test.afterAll(async () => {
  await page?.close();
});

for (const demo of DEMOS) {
  test(`${demo.family} · ${demo.label}`, async ({}, testInfo) => {
    const errors: string[] = [];
    const onError = (e: Error): void => { errors.push(e.message); };
    page.on('pageerror', onError);

    try {
      await driver.load(demo.config);
      await driver.narrate(demo.label, demo.question);

      const focusId = demo.focusId ?? 'demo-arena';
      const framed = await driver.focusOn(focusId, demo.focusDistance ?? 120);
      if (framed && demo.focusId) await driver.mark(demo.focusId);

      await demo.run(driver);

      const shot = await page.screenshot();
      await testInfo.attach(demo.id, { body: shot, contentType: 'image/png' });
      await page.screenshot({ path: `screenshots/demos/${demo.family}/${demo.id}.png` });

      /* Distinguish "fell through the geometry" from "legitimately left the
         arena". Escaping is the correct outcome for several demos (a shallow
         bowl, a launch exit, a short wall), so only flag a bey that is still
         inside the bowl footprint yet below its floor — that can only mean it
         passed through a surface that should have caught it. */
      const st = await driver.state();
      if (st?.spawned) {
        const horizontal = Math.hypot(st.pos.x, st.pos.z);
        if (horizontal < ARENA_RADIUS_CM) {
          expect
            .soft(st.pos.y, `${demo.id}: bey passed through the bowl floor (y=${st.pos.y.toFixed(1)})`)
            .toBeGreaterThan(BOWL_FLOOR_FLOOR_CM);
        }
        expect.soft(Number.isFinite(st.speed), `${demo.id}: non-finite velocity`).toBe(true);
      }

      expect.soft(errors, `${demo.id} raised: ${errors.slice(0, 2).join(' | ')}`)
        .toHaveLength(0);
    } finally {
      page.off('pageerror', onError);
      await driver.despawn().catch(() => {});
    }
  });
}

test('@meta demo manifest is non-trivial and unique', async () => {
  const ids = DEMOS.map((d) => d.id);
  expect(new Set(ids).size, 'duplicate demo ids').toBe(ids.length);
  expect(DEMOS.length).toBeGreaterThan(150);
});

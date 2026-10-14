/**
 * Screen smoke suite — one test per screen, run under each viewport project.
 *
 * Ported from the old scripts/test-screens.js, which was a standalone node script
 * that Playwright never discovered. Behaviour-preserving, with two changes:
 *   • /special-moves is now covered (it was missing entirely)
 *   • checks use expect.soft, so one failure no longer hides the rest of a screen
 */

import { test, expect, type Page } from '@playwright/test';
import {
  SCREENS,
  MIN_TOUCH_PX,
  DRAWER_BREAKPOINT_PX,
  isIgnorableConsoleError,
  type ScreenDef,
} from './screens.data';

const SETTLE_MS = 1500;
const CANVAS_TIMEOUT_MS = 8000;

interface PageErrors {
  js: string[];
  console: string[];
}

/** Must be attached before goto, or early-boot errors are missed. */
function captureErrors(page: Page): PageErrors {
  const errors: PageErrors = { js: [], console: [] };
  page.on('pageerror', (err) => errors.js.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.console.push(msg.text());
  });
  page.on('dialog', (d) => void d.dismiss().catch(() => {}));
  return errors;
}

function sample(list: string[], n = 2, len = 140): string {
  return list.slice(0, n).map((e) => e.slice(0, len)).join('  |  ');
}

for (const screen of SCREENS) {
  test(`${screen.id} — ${screen.path}`, async ({ page }, testInfo) => {
    const viewport = testInfo.project.use.viewport;
    const isMobile = testInfo.project.use.isMobile === true;
    const width = viewport?.width ?? Number.MAX_SAFE_INTEGER;
    const height = viewport?.height ?? 0;
    const isLandscape = width > height;

    const errors = captureErrors(page);

    await test.step('navigate', async () => {
      await page.goto(screen.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(SETTLE_MS);

      if (screen.isCanvas) {
        // Tolerated: the missing-canvas assertion below reports it properly.
        await page
          .waitForSelector('.sandbox-canvas-wrap', { timeout: CANVAS_TIMEOUT_MS })
          .catch(() => {});
        await page.waitForTimeout(SETTLE_MS);
      }
    });

    await test.step('no uncaught JS errors', async () => {
      expect
        .soft(errors.js, `uncaught JS errors: ${sample(errors.js)}`)
        .toHaveLength(0);
    });

    await test.step('console errors', async () => {
      const serious = errors.console.filter((e) => !isIgnorableConsoleError(e));
      // Soft by design: some console noise is expected and should not fail a run.
      expect
        .soft(serious, `console errors: ${sample(serious)}`)
        .toHaveLength(0);
    });

    await test.step('required elements', async () => {
      for (const { sel, label } of screen.mustExist) {
        const count = await page.locator(sel).count();
        expect.soft(count, `${label} missing (${sel})`).toBeGreaterThan(0);
      }
    });

    if (screen.isCanvas) {
      await test.step('WebGL canvas', async () => {
        const count = await page.locator('.sandbox-canvas-wrap canvas').count();
        expect.soft(count, 'WebGL canvas not created').toBeGreaterThan(0);
      });
    }

    if (isMobile && screen.isDrawer && width <= DRAWER_BREAKPOINT_PX) {
      await test.step('mobile drawer toggles', async () => {
        /* Both panels must be reachable on mobile, but only #sb-tree carries the
           `drawer-btn` class. #sb-props is deliberately always visible because
           DrawerManager.toggleRight() is dual-purpose: it collapses the docked
           panel on desktop and opens the drawer on mobile. Asserting two
           `.drawer-btn` elements would be asserting the wrong design. */
        for (const id of ['#sb-tree', '#sb-props']) {
          const btn = page.locator(`.screen:not(.hidden) ${id}`);
          await expect.soft(btn, `${id} drawer toggle missing`).toHaveCount(1);
          if ((await btn.count()) !== 1) continue;

          const box = await btn.boundingBox().catch(() => null);
          if (!box) {
            expect.soft(box, `${id} not visible`).not.toBeNull();
            continue;
          }
          // Both dimensions — a 16×44 button is not a 44px touch target.
          expect
            .soft(box.height, `${id} height ${box.height.toFixed(0)}px < ${MIN_TOUCH_PX}`)
            .toBeGreaterThanOrEqual(MIN_TOUCH_PX);
          expect
            .soft(box.width, `${id} width ${box.width.toFixed(0)}px < ${MIN_TOUCH_PX}`)
            .toBeGreaterThanOrEqual(MIN_TOUCH_PX);
        }
      });
    }

    if (isMobile && isLandscape && screen.hasVirtualControls) {
      await test.step('virtual controls overlay', async () => {
        const overlay = page.locator('.vctrl-overlay');
        const count = await overlay.count();
        expect.soft(count, 'vctrl-overlay missing from DOM').toBeGreaterThan(0);
        if (count === 0) return;

        const visible = await overlay.first().evaluate((el) => {
          const s = window.getComputedStyle(el);
          return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
        });
        // Known: the `(hover:hover) and (pointer:fine)` suppression rule can fire
        // headless, so this is reported but never fails the run.
        if (!visible) {
          testInfo.annotations.push({
            type: 'warning',
            description: 'vctrl-overlay present but CSS-hidden (hover:hover media query)',
          });
        }
      });
    }

    await test.step('no horizontal overflow', async () => {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect.soft(overflow, `horizontal overflow of ${overflow}px`).toBeLessThanOrEqual(0);
    });

    await test.step('screenshot', async () => {
      const shot = await page.screenshot({
        path: `screenshots/test-screens/${screen.id}-${testInfo.project.name}.png`,
        fullPage: false,
      });
      await testInfo.attach(`${screen.id}-${testInfo.project.name}`, {
        body: shot,
        contentType: 'image/png',
      });
    });
  });
}

/* Guard: the suite must cover every route in src/main.ts. Update screens.data.ts
   when a route is added — this is the check that would have caught the missing
   /special-moves coverage. */
test('@meta every documented route is covered', async ({ page }) => {
  const covered = new Set(SCREENS.map((s: ScreenDef) => s.path));
  const expected = [
    '/', '/beyblade', '/arena', '/preset-editor', '/rpg',
    '/admin', '/arena-library', '/bey-library', '/special-moves',
  ];
  const missing = expected.filter((p) => !covered.has(p));
  expect(missing, `routes with no smoke test: ${missing.join(', ')}`).toHaveLength(0);
  await page.close();
});

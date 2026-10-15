import { test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

/**
 * GAMEPLAY CAPTURE — frames of the game being PLAYED, not features being shown.
 *
 * The 199 feature demos vary one property against a fixed base bowl, which is
 * the right tool for spotting a regression in one wall profile and the wrong
 * one for answering "what does this look like to play". Nothing in the repo
 * answered that, so every judgement about how the game reads was being made
 * from editor screenshots with the inspector open and a grid over everything.
 *
 * These frames deliberately hide the editor chrome and run the real demo
 * arena at a real launch speed, sampled over a battle rather than at rest.
 */

const ARENA = '/arena';
const OUT = 'screenshots/gameplay';

/** CS10's documented launch: ~600 rad/s. The HUD's 300 rpm default is 31. */
const REAL_LAUNCH_RPM = 5730;

test('gameplay frames', async ({ page }) => {
  test.setTimeout(180_000);
  mkdirSync(OUT, { recursive: true });

  await page.goto(ARENA, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => !!(window as never as { __demo?: unknown }).__demo, null, { timeout: 60_000 });

  await page.evaluate(async () => {
    const spec = '/src/config/demoArenaConfig.ts';
    const m = await import(/* @vite-ignore */ spec) as { DEMO_ARENA_CONFIG: unknown };
    const d = (window as never as {
      __demo: {
        loadArenaConfig(c: unknown): Promise<void>;
        setChromeVisible(v: boolean): void;
        setFixedTimestep(ms: number): void;
      };
    }).__demo;
    await d.loadArenaConfig(m.DEMO_ARENA_CONFIG);
    /* Fixed timestep so the captured frames are the SAME frames every run —
       otherwise a visual diff is comparing two different battles. */
    d.setFixedTimestep(1000 / 120);
    d.setChromeVisible(false);
  });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: `${OUT}/00-arena-empty.png` });

  await page.evaluate(([rpm]) => {
    const d = (window as never as { __demo: {
      despawnBey(): void; spawnBey(o: unknown): void;
    } }).__demo;
    d.despawnBey();
    // Launched across the dish, the way a Sliding Shoot enters.
    d.spawnBey({ pos: { x: 70, y: 25, z: 0 }, vel: { x: -60, y: 0, z: 140 }, rpm });
  }, [REAL_LAUNCH_RPM]);

  /* A battle is a sequence, so capture it as one — a single frame cannot show
     whether the bey is moving like a Beyblade or sliding like a puck. */
  for (const [i, ms] of [300, 700, 1200, 2000, 3200, 5000].entries()) {
    await page.waitForTimeout(i === 0 ? ms : 0);
    await page.screenshot({ path: `${OUT}/${String(i + 1).padStart(2, '0')}-t${ms}ms.png` });
    if (i < 5) await page.waitForTimeout(400);
  }

  // Chrome back on: the HUD is part of what a player actually sees.
  await page.evaluate(() => (window as never as {
    __demo: { setChromeVisible(v: boolean): void };
  }).__demo.setChromeVisible(true));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/07-with-hud.png` });
});

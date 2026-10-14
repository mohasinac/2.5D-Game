import { chromium } from '@playwright/test';

/**
 * Warm Vite's on-demand transform cache before any test runs.
 *
 * WHY THIS EXISTS
 * ───────────────
 * The screen suite runs against the **dev** server, which transforms modules
 * per request. Loading `/` pulls 151 modules (every screen is constructed
 * eagerly in the `App` constructor, so one navigation imports essentially the
 * whole codebase plus three and phaser). Measured in the Docker container over
 * a Windows bind mount:
 *
 *     cold first navigation : ~51 s
 *     warm navigation       : 0.8 - 2.7 s
 *
 * With a 90 s per-test timeout that is survivable in principle, but it made the
 * *first* test absorb the entire cold-start cost and fail with
 * `net::ERR_ABORTED` while every later test passed — a flake whose victim
 * depends on execution order, which is the worst kind to debug. Warming here
 * moves that one-time cost out of the tests entirely.
 *
 * This does not paper over a slow app: the production build does no per-request
 * transforming at all, so none of this cost exists in `npm run build` output.
 * It is a property of dev-server testing.
 *
 * TOLERANT BY DESIGN
 * ──────────────────
 * `globalSetup` is config-level, so it also runs for `npm run docker:unit`,
 * which has no dev server at all (that is the point of the browser-free `unit`
 * project — see the `unit` service in docker-compose.yml). So an unreachable
 * server is treated as "nothing to warm" and skipped quietly rather than
 * failing the run. If the server is genuinely required and down, the e2e tests
 * themselves fail with a clear navigation error — warming is not the right
 * place to assert on that.
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001';

/** Generous: this is the cold path, measured at ~51 s with headroom for CI noise. */
const WARM_TIMEOUT_MS = 180_000;

/** Retries for the warm navigation. Covers one dependency re-optimization
 *  plus a little slack; more than that is a real failure, not a reload. */
const WARM_ATTEMPTS = 3;

/** Short — just answering "is a dev server there at all?" */
const REACHABILITY_TIMEOUT_MS = 3_000;

async function isReachable(): Promise<boolean> {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(REACHABILITY_TIMEOUT_MS) });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function globalSetup(): Promise<void> {
  if (!await isReachable()) {
    console.log(`[warmup] no dev server at ${BASE_URL} — skipping (expected for the unit project)`);
    return;
  }

  /* A plain fetch would only retrieve index.html; the 151 transforms happen
     when a real browser follows the module graph. So this needs a browser. */
  const browser = await chromium.launch({
    args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
  });
  try {
    const started = Date.now();

    /* Navigated more than once ON PURPOSE.
       When Vite discovers a dependency it has not pre-bundled — which happens
       on the first run after a package is added, or after the node_modules
       volume is recreated — it re-runs dependency optimization and forces a
       graph reload. In-flight navigations are aborted with `net::ERR_ABORTED`.
       Adding `three-mesh-bvh` did exactly that and took out all six tests of
       the first e2e spec to run, while everything after them passed.
       So: retry the warm, and only treat it as warm once a navigation
       completes without the graph moving under it. */
    for (let attempt = 1; attempt <= WARM_ATTEMPTS; attempt++) {
      const page = await browser.newPage();
      try {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: WARM_TIMEOUT_MS });
        await page.close();
        if (attempt > 1) {
          console.log(`[warmup] settled on attempt ${attempt} (dependency re-optimization)`);
        }
        break;
      } catch (err) {
        await page.close().catch(() => {});
        if (attempt === WARM_ATTEMPTS) throw err;
        console.log(`[warmup] attempt ${attempt} aborted — retrying: ${String(err).slice(0, 80)}`);
      }
    }

    /* One more navigation against the now-settled graph. If the first pass
       triggered a re-optimization, this is the one that is actually warm —
       and it costs a second or two when nothing changed. */
    const confirm = await browser.newPage();
    await confirm.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: WARM_TIMEOUT_MS });
    await confirm.close();

    console.log(`[warmup] module graph transformed in ${Date.now() - started} ms`);
  } finally {
    await browser.close();
  }
}

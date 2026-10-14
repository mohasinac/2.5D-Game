import { defineConfig } from '@playwright/test';

/**
 * Feature demo runner config — deliberately separate from playwright.config.ts.
 *
 * The regression suite runs headless in Docker. These demos run HEADED on the
 * host so they can be watched with real GPU WebGL, and they continue past
 * failures: finding every broken feature in one pass is the entire point.
 *
 *   npm run demo:features
 *   npm run demo:features -- -g "wall"
 *   npm run demo:features -- --headed=false      # capture artifacts only
 */
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001';

/* Set on the `demos` compose service. Headed-on-host stays the default and the
   documented way to WATCH the tour; containerised is for regenerating the
   screenshot set unattended after a visual change. */
const inDocker = process.env.DOCKER === '1';

/* Software WebGL, needed only in the container. On the host the whole point is
   real GPU rendering, so these must NOT be applied there. */
const GL_ARGS = inDocker
  ? ['--enable-webgl', '--use-gl=swiftshader', '--enable-unsafe-swiftshader',
     '--ignore-gpu-blocklist', '--disable-dev-shm-usage']
  : ['--enable-webgl', '--ignore-gpu-blocklist'];

export default defineConfig({
  testDir: './tests/demos',
  timeout: 120_000,
  expect: { timeout: 10_000 },

  fullyParallel: false,
  workers: 1,
  retries: 0,
  /* Never bail early — a broken feature must not hide the rest of the tour. */
  maxFailures: 0,

  reporter: [['list'], ['html', { open: 'never', outputFolder: 'demos/report' }]],

  /* Keep Playwright's own artifacts off the Windows bind mount in the
     container — the trace recorder's many small files are unreliable there.
     The demo screenshots are written explicitly by the spec with an absolute
     `path:` and are unaffected. */
  outputDir: inDocker ? '/tmp/pw-demo-artifacts' : undefined,

  use: {
    baseURL: BASE_URL,
    headless: inDocker,
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      args: GL_ARGS,
      slowMo: Number(process.env.DEMO_SLOWMO ?? 0),
    },
    video: process.env.DEMO_RECORD ? 'on' : 'off',
    trace: 'retain-on-failure',
    screenshot: 'off',   // the spec attaches its own, framed shot per demo
  },

  projects: [{ name: 'demos' }],
});

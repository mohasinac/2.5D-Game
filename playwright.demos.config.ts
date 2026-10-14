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
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

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

  use: {
    baseURL: BASE_URL,
    headless: false,
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      args: ['--enable-webgl', '--ignore-gpu-blocklist'],
      slowMo: Number(process.env.DEMO_SLOWMO ?? 0),
    },
    video: process.env.DEMO_RECORD ? 'on' : 'off',
    trace: 'retain-on-failure',
    screenshot: 'off',   // the spec attaches its own, framed shot per demo
  },

  projects: [{ name: 'demos' }],
});

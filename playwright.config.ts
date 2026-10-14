import { defineConfig } from '@playwright/test';

/* http://app:3000 inside compose, http://localhost:3000 on the host. */
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

/* Software WebGL. Without these the Three.js canvas never initialises headless
   and every sandbox screen fails for the wrong reason. */
const GL_ARGS = [
  '--enable-webgl',
  '--use-gl=swiftshader',
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
  '--disable-dev-shm-usage',
];

/* Mobile projects deliberately do NOT spread `devices['iPhone …']` — those presets
   set defaultBrowserType: 'webkit', and we want Chromium with touch emulation so
   the WebGL flags above still apply. */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90_000,
  expect: { timeout: 10_000 },

  /* Serial: every project drives the same dev server and several screens are
     heavy WebGL. Parallel workers make results noisy, not faster. */
  fullyParallel: false,
  workers: 1,
  retries: 0,

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: { args: GL_ARGS },
  },

  projects: [
    {
      name: 'desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 800 },
        hasTouch: false,
        isMobile: false,
      },
    },
    {
      name: 'mobile-portrait',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
        deviceScaleFactor: 3,
        userAgent: IPHONE_UA,
      },
    },
    {
      name: 'mobile-landscape',
      use: {
        browserName: 'chromium',
        viewport: { width: 844, height: 390 },
        hasTouch: true,
        isMobile: true,
        deviceScaleFactor: 3,
        userAgent: IPHONE_UA,
      },
    },
  ],
});

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

/* Set on the test/unit compose services. */
const inDocker = process.env.DOCKER === '1';

/* Mobile projects deliberately do NOT spread `devices['iPhone …']` — those presets
   set defaultBrowserType: 'webkit', and we want Chromium with touch emulation so
   the WebGL flags above still apply. */
export default defineConfig({
  /* Playwright's trace recorder writes a stream of small files per context. On
     the Windows -> Linux bind mount that is unreliable: closing a context would
     intermittently fail with
       `browserContext.close: ENOENT ... .playwright-artifacts-N/traces/*.trace`
     on the heaviest screen (/arena) while every assertion in the test passed.
     Keeping artifacts on the container's own filesystem removes the mount from
     that path entirely. The trade-off is that a failing run's trace.zip does not
     survive `--rm`; the console output and the screenshots written explicitly by
     screens.spec.ts (to the gitignored `screenshots/`, still on the mount) do. */
  outputDir: inDocker ? '/tmp/pw-artifacts' : undefined,
  /* `tests/` not `tests/e2e/`, so the browser-free `tests/unit` specs are
     collected too. Each project below restricts itself with testDir/testMatch,
     so the screen specs still run exactly three times (once per viewport) and
     the unit specs run exactly once. */
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 10_000 },

  /* Transforms the dev server's module graph once up front, so the first screen
     test does not absorb a ~51 s cold start and time out while every later test
     passes. No-ops when no dev server is reachable, which is the normal case for
     the browser-free `unit` project. See tests/globalSetup.ts. */
  globalSetup: './tests/globalSetup.ts',

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
      /* Pure-logic specs: geometry/physics maths with no DOM, no WebGL and no
         dev server. Kept as a Playwright project rather than adding a second
         test framework (Vitest/Jest) for a handful of numeric assertions.
         Runs first so a broken profile fails fast, before 3 WebGL suites. */
      name: 'unit',
      testDir: './tests/unit',
    },
    {
      name: 'desktop',
      testDir: './tests/e2e',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 800 },
        hasTouch: false,
        isMobile: false,
      },
    },
    {
      name: 'mobile-portrait',
      testDir: './tests/e2e',
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
      testDir: './tests/e2e',
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

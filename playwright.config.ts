import { defineConfig, devices } from "@playwright/test";
import { config as dotenvConfig } from "dotenv";
dotenvConfig(); // loads PROD_URL, TEST_EMAIL, TEST_PASSWORD, PLAYWRIGHT_BASE_URL from root .env

// ─── Viewport presets ────────────────────────────────────────────────────────
export const VIEWPORTS = {
  mobile:  { width: 390,  height: 844  }, // iPhone 14 Pro
  tablet:  { width: 768,  height: 1024 }, // iPad Mini
  desktop: { width: 1440, height: 900  }, // Standard laptop
} as const;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,          // Game server has limited room capacity
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,                    // Sequential to avoid room overflow
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "tests/reports/playwright-results.json" }],
    ["list"],
  ],

  // ── Global timeouts ────────────────────────────────────────────────────────
  timeout: 180_000,              // 180 s — game-modes-comprehensive has 150s tests
  expect: { timeout: 20_000 },   // 20 s per assertion

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3001",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "on",
    actionTimeout: 15_000,       // 15 s for clicks / fills
    navigationTimeout: 45_000,   // 45 s for page navigations
  },

  // ── Projects (viewport matrix) ─────────────────────────────────────────────
  projects: [
    // ── Desktop smoke (default `npm run test:e2e`) ────────────────────────
    {
      name: "chromium-dev",
      use: {
        ...devices["Desktop Chrome"],
        viewport: VIEWPORTS.desktop,
      },
      testIgnore: [
        "**/*.prod.spec.ts",
        "**/ai-vs-ai-full-battle.spec.ts",
        "**/server-load-test.spec.ts",
        // The multi-browser tests in game-modes-comprehensive use the `browser` fixture
        // which is only available when not running with workers: 1 in parallel — they
        // still run here; Playwright handles the fixture automatically.
      ],
    },

    // ── Mobile: Pixel 5 / Android 390 px ─────────────────────────────────
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 5"],
        viewport: VIEWPORTS.mobile,
        isMobile: true,
        hasTouch: true,
      },
      // Only run the lightweight smoke + responsive suite on mobile
      testMatch: [
        "**/responsive-smoke.spec.ts",
        "**/battle-workflows.spec.ts",
        "**/admin-workflows.spec.ts",
      ],
    },

    // ── Mobile: iPhone 12 (390 × 844, iOS UA) ────────────────────────────
    {
      name: "chromium-iphone",
      use: {
        ...devices["iPhone 12"],
        viewport: VIEWPORTS.mobile,
      },
      testMatch: [
        "**/responsive-smoke.spec.ts",
      ],
    },

    // ── Tablet: iPad Mini (768 × 1024) ────────────────────────────────────
    {
      name: "chromium-tablet",
      use: {
        ...devices["iPad Mini"],
        viewport: VIEWPORTS.tablet,
      },
      testMatch: [
        "**/responsive-smoke.spec.ts",
        "**/battle-workflows.spec.ts",
      ],
    },

    // ── Production desktop ─────────────────────────────────────────────────
    {
      name: "chromium-prod",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.PROD_URL || "https://game.letitrip.in",
      },
      testMatch: "**/*.prod.spec.ts",
    },

    // ── Production gameplay (long-running) ─────────────────────────────────
    {
      name: "chromium-prod-gameplay",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.PROD_URL || "https://game.letitrip.in",
        actionTimeout: 20_000,
        navigationTimeout: 60_000,
      },
      testMatch: [
        "**/ai-vs-ai-full-battle.spec.ts",
        "**/server-load-test.spec.ts",
        "**/hud-and-qte-tests.spec.ts",
        "**/tournament-pvai-gauntlet.spec.ts",
        "**/game-modes-comprehensive.spec.ts",
        "**/real-player-scenarios.spec.ts",
        "**/admin-tournament-full.spec.ts",
      ],
    },
  ],

  // ── Dev server (Vite) ──────────────────────────────────────────────────────
  webServer: {
    command: "npm run dev:client",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});

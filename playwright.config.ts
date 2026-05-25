import { defineConfig, devices } from "@playwright/test";
import { config as dotenvConfig } from "dotenv";
dotenvConfig(); // loads PROD_URL and other vars from root .env

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,          // game server has limited room capacity
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,                    // sequential to avoid room overflow
  reporter: "html",
  timeout: 60000,                // 60s default per test (WebSocket + game tick time)
  expect: { timeout: 15000 },   // 15s per assertion

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3001",
    trace: "on-first-retry",
    video: "on-first-retry",
    actionTimeout: 10000,        // 10s for UI clicks
    navigationTimeout: 30000,    // 30s for page loads
  },

  projects: [
    {
      name: "chromium-dev",
      use: { ...devices["Desktop Chrome"] },
      // Excludes prod-only and advanced-gameplay specs from dev run
      testIgnore: ["**/*.prod.spec.ts", "**/ai-vs-ai-full-battle.spec.ts", "**/server-load-test.spec.ts"],
    },
    {
      name: "chromium-prod",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.PROD_URL || "https://game.letitrip.in",
      },
      testMatch: "**/*.prod.spec.ts",
    },
    {
      name: "chromium-prod-gameplay",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.PROD_URL || "https://game.letitrip.in",
        // Gameplay tests need longer timeouts — AI battles up to 3 min
        actionTimeout: 15000,
        navigationTimeout: 60000,
      },
      testMatch: [
        "**/ai-vs-ai-full-battle.spec.ts",
        "**/server-load-test.spec.ts",
        "**/hud-and-qte-tests.spec.ts",
        "**/tournament-pvai-gauntlet.spec.ts",
      ],
    },
  ],

  webServer: {
    command: "npm run dev:client",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

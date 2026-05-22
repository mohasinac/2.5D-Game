import { defineConfig, devices } from "@playwright/test";

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
    },
    {
      name: "chromium-prod",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.PROD_URL || "https://your-prod-domain.com",
      },
      testMatch: "**/*.prod.spec.ts",
    },
  ],

  webServer: {
    command: "npm run dev:client",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

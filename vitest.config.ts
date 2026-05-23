import { defineConfig } from "vitest/config";

export default defineConfig({
  // Prevent Vite from picking up the root postcss.config.js (references Tailwind
  // which is only installed in client/, not at root).
  css: {
    postcss: {},
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts", "server/__tests__/**/*.test.ts"],
    // Each test file runs in its own process (avoids Colyseus schema decorator conflicts)
    pool: "forks",
  },
});

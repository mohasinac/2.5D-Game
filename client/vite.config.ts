import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".mts", ".cts", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    port: 3001,
    proxy: {
      // Forward /api calls to Next.js server (if running) or directly to Colyseus
      "/colyseus": {
        target: "http://localhost:2567",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});

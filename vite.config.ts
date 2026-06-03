import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  server: {
    port: 5173,
    strictPort: true,   /* fail instead of silently picking another port */
  },
});

import { defineConfig } from 'vite';

/* Windows host → Linux container bind mounts do not propagate inotify events,
   so file watching must poll when running under Docker. */
const inDocker = process.env.DOCKER === '1';

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
    strictPort: true,   /* fail instead of silently picking another port */
    host: true,         /* bind 0.0.0.0 so the container is reachable */
    watch: inDocker ? { usePolling: true, interval: 300 } : undefined,
  },
});

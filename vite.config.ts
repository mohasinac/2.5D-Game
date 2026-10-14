import { defineConfig } from 'vite';

/* Windows host → Linux container bind mounts do not propagate inotify events,
   so file watching must poll when running under Docker. */
const inDocker = process.env.DOCKER === '1';

/**
 * Directories the dev server must not watch.
 *
 * WHY THIS IS LOAD-BEARING, NOT TIDINESS
 * ──────────────────────────────────────
 * `linka/` is a 7.3 GB / ~44,000-file scraped reference archive that lives in
 * the repo root (gitignored, untracked, imported by nothing — it is the research
 * source the case studies were written from). With `usePolling` on, chokidar
 * was stat-ing that whole tree every 300 ms across a Windows→Linux bind mount,
 * which saturated the event loop: **every HTTP request to the dev server took
 * ~26 seconds**, and the container healthcheck could never pass, so
 * `npm run docker:test` refused to start with "dependency failed to start:
 * container bey-app is unhealthy".
 *
 * Polling cost scales with file count, so an ignore list is the fix rather than
 * a longer interval — raising the interval only trades latency for staleness
 * while still walking 44k files.
 *
 * Vite merges these with its own defaults (`.git`, `node_modules`,
 * `test-results`, the cache dir), so this list only has to name the extras.
 * `screenshots/` and `case study/` are included for the same reason at smaller
 * scale: neither is a module source, so a change in them should never trigger
 * an HMR pass.
 */
const WATCH_IGNORED = [
  '**/linka/**',
  '**/screenshots/**',
  '**/case study/**',
  '**/dist/**',
  '**/playwright-report/**',
];

/**
 * Hostnames the dev server will answer to.
 *
 * Vite 5.4.12 backported `server.allowedHosts` as a DNS-rebinding fix, and the
 * default list covers only localhost and IP literals. Our `package.json` asks
 * for `^5.2.0`, so `npm ci` resolves 5.4.21 and the Playwright container's
 * requests to the compose service hostname started coming back
 * `403 Blocked request. This host ("app") is not allowed.` — which is why the
 * screen suite went from 30/30 in an earlier session to 27 failures without a
 * line of test code changing. A patch-range dependency bump moved the goalposts.
 *
 * Named explicitly rather than set to `true`: allowing all hosts would hand the
 * vulnerability straight back. This is the one hostname the test container uses.
 *
 * THE HOSTNAME IS `bey-app`, NOT `app`, AND THAT IS DELIBERATE.
 * `.app` is a Google gTLD that Chromium carries on its HSTS preload list
 * TLD-wide, so a browser rewrites `http://app:3000` to HTTPS before it sends
 * anything and fails with `ERR_SSL_PROTOCOL_ERROR` against a plain-HTTP dev
 * server. A non-browser fetch reached Vite and got the 403; the browser never
 * got that far, which is why the two symptoms looked unrelated. `bey-app` is a
 * single label that does not match the preloaded `app` entry.
 */
const ALLOWED_HOSTS = ['bey-app', 'localhost', '127.0.0.1'];

export default defineConfig({
  base: '/',
  /* Static art is served from `assets/`, NOT Vite's default `public/`.
     The bundler writes its own output to `dist/assets/`, so a `public/assets/...`
     file would collide with it. Pointing publicDir at `assets/` keeps shipped
     art at `dist/models/...` and the bundle at `dist/assets/...`.
     See assets/README.md. */
  publicDir: 'assets',
  server: {
    port: 3000,
    strictPort: true,   /* fail instead of silently picking another port */
    host: true,         /* bind 0.0.0.0 so the container is reachable */
    allowedHosts: ALLOWED_HOSTS,
    watch: inDocker
      ? { usePolling: true, interval: 300, ignored: WATCH_IGNORED }
      : { ignored: WATCH_IGNORED },
  },
});

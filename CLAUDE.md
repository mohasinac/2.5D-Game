# Beyblade Game — Claude Instructions

## What this project actually is

A **Three.js arena/beyblade editor suite** plus a **Phaser RPG shell**. Stack: Vite + TypeScript + Three.js + Phaser + Zustand. 146 files, ~37.5k LOC in `src/`.

**There is no battle system yet.** Read this before planning any gameplay work:

| Area | Reality |
|---|---|
| Arena-vs-bey collision | **Works.** `SpawnManager` resolves bowl surface, rim walls, speed lines, traps, zones. Reuse as-is. |
| Bey-vs-bey collision | **Does not exist.** There is exactly one physics entity in the project. |
| Team battles | Do not exist. |
| Spin / burst / stamina | `rpm` is cosmetic — never decays, never affects physics. No burst. |
| Health | `SpawnManager.health` is drained by traps/zones and **never checked against zero**. |
| Ring-out / rounds / win conditions | None. Only a `Y < -500` respawn guard. |
| Launcher | None. "Launching" is clicking the **⚽ Spawn** button and typing numbers into a debug HUD. |
| Opponent AI | None (the RPG has overworld NPC AI; nothing combat-related). |
| Audio playback | None. An audio *asset pipeline* exists; nothing plays sound at runtime. |
| Networking | None. Zero `fetch`/XHR/WebSocket anywhere. |
| The bey you build in `/beyblade` | **Never becomes a physics body.** It stays in the editor. |

The battle layer is designed in `case study/CS23 — battle layer design.md`. It is being written from scratch — do not describe it as tweaking something that exists.

---

## Running, testing, deploying

**Testing runs in Docker Desktop.** The host-side scripts remain for emergencies but are not the documented path.

```
npm run docker:build        # build images
npm run docker:dev          # Vite dev server → http://localhost:3001
npm run docker:typecheck    # tsc --noEmit
npm run docker:unit         # browser-free unit specs only (no dev server needed)
npm run docker:dist         # production bundle (NODE_ENV=production — see trap 5)
npm run docker:demos        # regenerate screenshots/demos/** headless (host run stays headed)
npm run docker:test         # full Playwright suite against http://bey-app:3001
npm run docker:down         # tear down + drop volumes

npm run dev                 # host fallback
npm run build               # tsc && vite build
npm run typecheck           # tsc --noEmit
npm run test:e2e            # Playwright on the host (needs a dev server on :3001)
npm run demo                # Puppeteer script that builds the demo arena through the UI
npm run deploy              # npm run build && firebase deploy --only hosting
```

**Standing rule: clear all TypeScript errors before starting any task.**

- `Dockerfile` has three stages: `deps` (npm ci, caches on lockfile alone), `dev` (Vite), `test` (official Playwright image).
- A **named volume on `/app/node_modules`** is load-bearing — without it the Windows bind mount shadows the Linux-built dependencies.
- `vite.config.ts` sets `host: true` and `watch.usePolling` under Docker, because Windows→Linux bind mounts do not propagate inotify events.
- `shm_size: 1gb` on the test service — Chromium crashes on Docker's default 64 MB `/dev/shm`.
- **`PLAYWRIGHT_VERSION` in the Dockerfile must match `@playwright/test` in `package.json`.** Drift fails the container with "Executable doesn't exist".

### Five infrastructure traps, each of which once broke the gate or the bundle

These are fixed. They are recorded because every one of them presents as "the app is broken" when it is really one line of config, and three of them appeared *without any source change*.

1. **Never let the Vite watcher see `linka/`.** `linka/` is a 7.3 GB / ~44,000-file scraped research archive in the repo root (gitignored, imported by nothing). With `usePolling` on, chokidar stat-ed all of it every 300 ms and **every HTTP request took ~26 s**, so the healthcheck could never pass. `server.watch.ignored` in `vite.config.ts` fixes it (~26,000 ms → ~200 ms). Polling cost scales with file count, so raising `interval` is not a substitute.
2. **`server.allowedHosts` must list the container hostname.** Vite 5.4.12 backported a DNS-rebinding fix; `package.json` asks for `^5.2.0`, so `npm ci` resolves 5.4.21 and unlisted hosts get `403 Blocked request. This host (…) is not allowed.` A patch-range bump silently broke a passing gate.
**The project's port is 3001, inside the container and out** — port 3000 on this machine belongs to a different project. `vite.config.ts` `server.port`, the compose published port, the healthcheck probe and `PLAYWRIGHT_BASE_URL` all carry the same number deliberately; splitting host and container ports only invites them to drift.

3. **The test hostname is `bey-app`, never `app`.** `.app` is a Google gTLD on Chromium's HSTS preload list TLD-wide, so the browser rewrites `http://app:3000` to HTTPS and fails with `ERR_SSL_PROTOCOL_ERROR` against a plain-HTTP dev server — before the request is even sent. `PLAYWRIGHT_BASE_URL` and `allowedHosts` must stay in sync.
4. **The healthcheck probes `127.0.0.1`, not `localhost`.** Inside the container `localhost` resolves to `::1` first while Vite's `host: true` binds IPv4-only, so the probe hung until timeout.
5. **Build production bundles with `npm run docker:dist`, never `vite build` in the dev container.** The `dev` stage sets `NODE_ENV=development`, and Vite derives `import.meta.env.DEV` from `NODE_ENV` *even during `vite build`*. Building there yields `DEV === true`, so the dev-only `window.__demo` API ships to production — the exact thing the `grep __demo dist/assets/*.js` check exists to catch, and it was silently failing. The `dist` compose service overrides `NODE_ENV=production`.

### Tests

`tests/e2e/screens.spec.ts` — one test per screen × three viewport projects (desktop 1280×800, mobile-portrait 390×844, mobile-landscape 844×390). Checks: uncaught JS errors, console errors, required selectors, WebGL canvas, mobile drawer toggles + 44px touch targets on **both** axes, virtual-controls overlay, horizontal overflow, screenshot.

**When you add a route to `src/main.ts`, add it to `tests/e2e/screens.data.ts` in the same change.** The `@meta` test fails if a documented route has no coverage — that guard exists because `/special-moves` shipped with zero test coverage.

Chromium needs `--use-gl=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` or the Three.js canvas never initialises headless and every sandbox screen fails for the wrong reason.

`tests/unit/` — browser-free specs for pure logic (BB-10 radial profile, render policy, RenderManager lifecycle). They run as a separate Playwright **`unit` project** rather than under a second test framework, and the `unit` compose service deliberately has **no `depends_on`**: these tests touch no DOM, no WebGL and no dev server, so gating them on the app container's health would make a maths regression undiagnosable exactly when the server is unwell. `unit` is listed first so a broken profile fails fast, before three WebGL suites.

`tests/e2e/renderState.spec.ts` — asserts *how* the arena scene is drawn (ACES, sRGB, shadow map, environment, fitted shadow frustum, and `toneMappedUnlit === 0`) via `window.__demo.getRenderStats()`. Exists because every defect it covers is **silent**: a correctly configured renderer with zero shadow-casting lights, or an edge line quietly desaturated by ACES, throws nothing and logs nothing. The unit specs prove the render policy *decides* correctly; this proves it was *applied* to the live scene.

`tests/e2e/deckCollision.spec.ts` — proves the bey **stands on a bridge deck** and that **a pillar stops it**, and that one beside a pier still falls into the bowl. The control matters: a bey resting on the bowl floor is also `grounded`, so asserting position rather than the flag is the only thing that distinguishes "standing on the deck" from "standing on anything at all". Uses `window.__demo.getBridgeDiag()`, which reports per-segment vertex counts and world bounding boxes — the diagnostic that separated *the bridge was never built* from *the bridge is 90° from where its config says*.

**Current gate: 217 tests** — 151 unit + 27 screen (9 × 3 viewports) + 21 render-state (7 × 3) + 15 collision (5 × 3) + 3 `@meta`.

`tests/globalSetup.ts` transforms the dev server's module graph once before the suite. One navigation pulls **151 modules** (every screen is constructed eagerly in the `App` constructor), which costs ~51 s cold and 0.8–2.7 s warm. Without warming, the *first* screen test absorbed the whole cold start and failed with `net::ERR_ABORTED` while every later test passed — an order-dependent flake. It no-ops when no server is reachable, which is the normal case for `docker:unit`.

### Feature demos — `npm run demo:features`

199 demos, one per *variant* (every wall top profile, all 24 speed-line presets, every trap effect…), driven through the dev-only `window.__demo` API.

```
npm run demo:features                  # watch all of them, headed
npm run demo:features -- -g "wall"     # one family
DEMO_SLOWMO=250 npm run demo:features  # slow it down
DEMO_RECORD=1   npm run demo:features  # per-demo video
```

- **Headed on the host by design**, with real GPU WebGL — the point is to watch them. The headless Docker suite is `tests/e2e`.
- **`npm run docker:demos` runs the same tour headless in the container** (SwiftShader), purely to regenerate the screenshot set after a visual change. The config branches on `DOCKER=1` for headless, the GL args and the artifact dir; the host behaviour is untouched.
- Each demo writes `screenshots/demos/<family>/<id>.png` (the whole `screenshots/` tree is gitignored). That set is the cheapest way to review a rendering change across every feature at once — it is how the bey's cast shadow was first confirmed on a real bowl.
- `playwright.demos.config.ts` is deliberately separate, and must **not** use `mode: 'serial'` — serial skips every remaining test after a failure, which is the opposite of an audit runner. Ordering comes from `workers: 1`.
- `tests/demos/arenaFactory.ts` builds one-feature arenas: *the same base bowl with exactly one thing changed*, so anything wrong is attributable to the varied property.
- Demos share one page; reloading per demo would add ~15 minutes of pure navigation.
- The pass assertion distinguishes **falling through geometry** (inside the bowl footprint but below its floor) from **legitimately leaving the arena**, which is the correct outcome for several demos.

**`window.__demo`** (`src/utils/demoApi.ts`) is mounted only under `import.meta.env.DEV` and tree-shaken from production. It exposes `loadArenaConfig`, `spawnBey`, `getBeyState`, `setFixedTimestep` (determinism — physics otherwise steps on whatever `dt` rAF hands it), `freeze`/`step`, `focusOn`, `markFeature`, `narrate`, `setChromeVisible`, `waitForRest`. It imports nothing from `screens/`; `ArenaSandbox._mountDemoApi()` passes closures over its own privates.

### Deployment

**Railway and Vercel are decommissioned. Firebase Hosting is the only live target.** `firebase.json` sets `public: "dist"` and the rewrite `**` → `/index.html`. That rewrite is **mandatory** — the app uses real `pushState` paths, not hash routing, so every deep link 404s without it. Never reintroduce `vercel.json` or `.vercelignore`.

---

## Style rules — MUST follow every time

### Scaling system (non-negotiable)

| Unit | CSS value | Notes |
|------|-----------|-------|
| 1 cm | `1vmin`   | canonical length unit |
| 1 mm | `0.1vmin` | **minimum** — never go smaller |

```css
--cm: calc(1vmin  * var(--ui-scale))
--mm: calc(0.1vmin * var(--ui-scale))
```

- `html { font-size: calc(2 * var(--cm)) }` → body text = 2 cm, so `1em = 2cm`.
- Use `var(--cm)` / `var(--mm)` directly for layout (e.g. `padding: calc(8 * var(--mm))`).
- `--ui-scale` (default `1`) is driven by the global `+`/`−`/`○` buttons.
- **Never** hardcode pixels for layout. Only exception: `renderer.setSize(w, h, false)`.

**Known weakness:** `vmin` uses the *smaller* viewport dimension, so on a 390×844 phone `--cm` is only ~3.9px and the whole UI collapses. Touch targets therefore need explicit `px` minimums (see `_responsive.css`), not `--cm`-derived sizing.

### Physical dimensions
The user specifies sizes in **centimetres**, mapped 1:1 to Three.js units. A 16 cm arena radius is `radius = 16`.

### No scrollbars — ever
`html`, `body`, `#app`, every `.screen`: `overflow: hidden`. Clip or shrink content; never add scroll.

### Fullscreen
All screens fill `100vw × 100vh` via `position: fixed; inset: 0`. The `⛶` button and `F` key toggle `document.documentElement.requestFullscreen()`.

### Game-like aesthetic
- Background `#080810`. Text `#dde8ff`. Borders `rgba(0, 229, 255, 0.25)`.
- Accent primary `#00e5ff` (cyan, Beyblade Sandbox); secondary `#ff6b35` (orange, Arena Sandbox + Special Moves).
- Fonts: `Orbitron` (titles/labels) + `Rajdhani` (body/buttons).
- Buttons: `uppercase`, `letter-spacing: 0.12em`, hover glow via `box-shadow`.
- No `border-radius` above `0.4em`. Glow via `text-shadow`/`box-shadow` — never blur filters on interactive elements.

### Touch targets
Controls need `min-height: 44px` **and** `min-width: 44px` + `flex-shrink: 0` on mobile. `min-height` alone lets flex squeeze buttons to 16px wide.

### Three.js viewports

**1 world unit = 1 cm. Y = up, XZ = ground plane.** Minimum detail 1 mm = 0.1 units.

- Renderer fills its container via `ResizeObserver` + a self-healing check inside the render loop (a single deferred RAF is not reliable before layout settles).
- `renderer.setSize(w, h, false)`; `setPixelRatio(Math.min(devicePixelRatio, 2))`.
- **ACES tone mapping + sRGB output + PCF soft shadows + a PMREM environment map are all on**, set in `mountRenderer()`. The environment comes from Three's bundled `RoomEnvironment` (procedural, zero download, **no network request** — the app makes none) at `environmentIntensity 0.55`; swapping in a Poly Haven HDRI later is a one-line change in `render/environment.ts`. `scene.background` is deliberately left as the clear colour, so the backdrop stays dark while the lighting is not.
- **The PMREM texture is per-mount, not per-scene.** It is a GPU render target owned by the renderer that produced it, so it is built in `mountRenderer()` and freed in `unmountRenderer()` *before* `renderer.dispose()`. Generating it once in `initScene()` leaves the scene holding a texture from a destroyed context after the first screen switch.
- Ambient light is `0.25`, not `0.5`: the environment map now supplies indirect light and doing both at full strength double-counts it, flattening everything and turning shadows into grey smudges.
- **Colour maps are `SRGBColorSpace`; normal/roughness/metalness/AO maps stay `NoColorSpace`.** Three defaults *every* texture to `NoColorSpace`, so a colour map without the explicit assignment is sampled as if already linear — the classic "washed out and wrong" PBR failure. It was invisible before tone mapping and obvious after.
- Surface normal maps are **derived from each surface's own painted canvas** by a Sobel gradient (`_paintNormal`), not downloaded. Zero bytes, no licence, and they track the pattern automatically. Depth per surface comes from `SURFACE_PBR.normalStrength` — flat pattern finishes (checker/grid/dots) get little because they are paint on a smooth shell; granular ones (sand, concrete, lava rock) get the most.
- Fine grain is **legitimately invisible at arena distance**: a 256 px texture tiled every 20 cm renders well below one texel per pixel when the whole 240 cm bowl is on screen, so mipmapping averages it away. Judge surface detail close up; judge material response (roughness/metalness/reflection) at distance.
- Always include `GridHelper`, `AxesHelper`, axis label sprites, numeric grid ticks.
- Grid subdivision colour `0x2a2a4a` — `0x1a1a2e` renders invisible.
- `OrbitControls`: left-drag orbit, right-drag pan, scroll zoom, `dampingFactor: 0.07`.
- Clear colour `0x08080f`.
- **No fog** — `FogExp2` causes black screens at normal camera distances against a dark background.

**Single WebGL context rule.** Only one `WebGLRenderer` at a time:
- `initScene()` — once; creates `Scene` + `PerspectiveCamera` + geometry. Never recreated.
- `mountRenderer()` — every `setVisible(true)`: creates renderer + OrbitControls, calls `loadView()`.
- `unmountRenderer()` — every `setVisible(false)`: `saveView()`, disposes renderer + controls.

Camera view persists per sandbox via `createCameraViewStore('bey_view_<title_snake>')`.

| Sandbox | gridSize | gridDivs | tickEvery | tickRange | defaultCam | camFar | minZoom | maxZoom |
|---------|----------|----------|-----------|-----------|------------|--------|---------|---------|
| Beyblade | 15 cm | 15 | 5 cm | ±7 cm | (12,8,14) | 500 | 0.5 cm | 50 cm |
| Arena | 200 cm | 20 | 20 cm | ±100 cm | (150,100,175) | 2000 | 5 cm | 1500 cm |

All proportional scene values derive from `gridSize` — never hardcode them.

`SandboxOptions.axisYOffset` lifts the `AxesHelper` above bowl geometry.

### Screen structure & routing
- Each screen is `div.screen` with `position: absolute; inset: 0; overflow: hidden`, toggled by `.hidden`.
- Real URL paths, no hash routing. `history.pushState` to navigate, `popstate` to handle back/forward. `history.replaceState` on initial load.
- `vite.config.ts` must keep `base: '/'`.
- Leaving a sandbox (in-app or browser back) shows `gameConfirm()`; if declined, `history.go(1)` undoes the pop.

### TypeScript
Strict mode. Classes for screens/systems, plain functions for utilities. No `any`. No `!` unless the element is guaranteed present in the same function. Material traversal cast: `mat as unknown as Record<string, unknown>`.

---

## Routes and screens (9)

| Path | Screen | Notes |
|---|---|---|
| `/` | `LandingScreen` | 7 buttons |
| `/beyblade` | `BeybladeSandbox` | part/sector builder |
| `/arena` | `ArenaSandbox` (title "Arena Sandbox") | the main editor |
| `/preset-editor` | `ArenaSandbox` (`presetEditorMode: true`, title "Preset Editor") | independent storage key |
| `/rpg` | `RPGScreen` | Phaser |
| `/admin` | `AdminHubScreen` | 7 real sub-editors |
| `/arena-library` | `ArenaLibraryScreen` | |
| `/bey-library` | `BeyLibraryScreen` | |
| `/special-moves` | `SpecialMoveSandbox` | |

All nine are constructed eagerly in the `App` constructor and toggled via `setVisible`.

**`main.ts:81` `onBattle(npcId)` is an empty stub** — the RPG→battle handoff is unimplemented.

---

## File structure

```
src/
  main.ts                       — App class, screen router, global controls (+/−/○ scale, ⛶ fullscreen)

  animation/BeybladeAnimator.ts — spin + tilt/precession on a BeybladeRenderer

  commands/
    ICommand.ts                 — ICommand + CommandHistory (undo/redo, max 50)
    beybladeCommands.ts         — 11 undoable commands (AddPart, CutSectors, MoveNode, …)

  config/
    arenaConstants.ts           — all world constants, ARENA_SAVE_VERSION=12, ARENA_MATERIAL_PRESETS,
                                  VISUAL_THEME_PRESETS, ARENA_LIGHT_PRESETS, BUFF_TIER_PRESETS, SL/ROT/ENV/JL/TRANS
    demoArenaConfig.ts          — DEMO_ARENA_CONFIG ("Black Sea Bowl")
    testArenaConfig.ts          — TEST_ARENA_CONFIG (used by SpecialMoveSandbox)

  features/
    IArenaFeature.ts            — SceneContext, ITickableManager, IPositionedManager, IBuffReceiver,
                                  IArenaFeature, ISceneFeature, FeatureStoreSlice
    ISurfaceProvider.ts         — SurfaceHit + ISurfaceProvider
    surfaceProviders.ts         — ArenaSurfaceProvider / FlatSurfaceProvider / MeshSurfaceProvider
    FeatureManager.ts           — abstract CRUD base (items Map, seq, insert/remove/clear/serializeAll)
    ParentedFeatureManager.ts   — adds surface-parent resolution via injected getSurface
    ProjectionService.ts        — aggregates wall/obstacle/bridge meshes → SceneSurfaceProjector
    conditions/
      ConditionEvaluator.ts     — evalEntryCondition / evalActivationMode / evalBaseCondition / evalTrapPeriodic
      EjectBehaviorHandler.ts   — applyEjectBehavior
      ZoneEffectRegistry.ts     — ZONE_EFFECTS lookup table
    managers/                   — 24 files; see the manager roster below
    managers/sub/
      SegmentAnimator.ts        — bridge-segment motion (singleton)
      WallPivotAnimator.ts      — wall pivot rotation (singleton)
      TrapTickBehavior.ts       — Earthquake / RPM / ProjectilePlate behaviours + factory

  geometry/                     — 21 files; see the geometry function table below
  renderers/BeybladeRenderer.ts — bey data → Three.js object graph; view modes; present STL

  rpg/
    config/     rpgConstants.ts, season1Data.ts
    entities/   Player, NPC, ChestObject, EventZone
    scenes/     Boot, Preload, World, Dialogue, Inventory, Shop, UI,
                BattleTransition, PipePuzzle, Platform
    stores/     GameStateStore, InventoryStore, SVGAssetStore, SaveSystem  (plain classes, NOT Zustand)
    systems/    EventBus, EventSystem, DialoguePlayer, CutscenePlayer, NPCManager, SVGAssetLoader

  screens/
    Sandbox.ts                  — base Three.js viewport; getCamera/getControls/getRendererCanvas
    ArenaSandbox.ts             — 3.7k lines; thin orchestrator over the managers
    BeybladeSandbox.ts          — bey builder; thin orchestrator (Facade)
    SpecialMoveSandbox.ts       — special-move phase editor
    ArenaLibraryScreen.ts / BeyLibraryScreen.ts / LandingScreen.ts / RPGScreen.ts
    admin/                      — AdminHub + Sprite/Tile/Map/Sound/Dialogue/Cutscene/MiniGame editors

  stores/                       — Zustand; see the persistence table below
  styles/                       — global.css + 7 partials (_variables, _reset, _components,
                                  _screens, _responsive, _spawn-hud, _vctrl)
  sim/
    SimClock.ts                 — deterministic clock (no wall-clock reads in the sim)
    Rng.ts                      — seeded mulberry32
    friction.ts                 — CS10 surface mu -> per-frame damping (interim; deleted when N2 lands)
    state.ts                    — BeySpec / BeyState: plain, serializable, THREE-free
    step/integrate.ts           — pure gravity/integrate/steer/jump/landing over {x,y,z}

  types/
    arenaTypes.ts               — the arena data model (largest type module)
    beybladeTypes.ts            — AxisData, PartData, SectorData, GroupData, LayerData, GimmickType
    sharedTypes.ts              — PresentConfig, ParticleConfig, WeatherSystem, BaseStatModifiers
    specialMoveTypes.ts         — SpecialMoveDefinition / Phase / HitEffect / save DTOs
    rpgTypes.ts / presetTypes.ts
  utils/
    PropertiesPanel.ts          — 3.5k lines; the whole arena inspector
    AbstractPropertiesPanel.ts  — shared row/section builders
    BeybladePropertiesPanel.ts / SpecialMovePanel.ts
    SceneTree.ts                — drag-drop tree widget with context menus + checkboxes
    arenaPersistence.ts         — all save DTOs + ArenaConfig
    presetStore.ts              — preset CRUD, thumbnails, ID remapping, extractArenaConfig
    SandboxSprites.ts / DrawerManager.ts / LayoutObserver.ts / dialog.ts / rpgPersistence.ts

tests/e2e/                      — screens.spec.ts + screens.data.ts
scripts/                        — create-demo-arena.js (Puppeteer), analyze-stl-library.mjs
Dockerfile · docker-compose.yml · playwright.config.ts · firebase.json · vite.config.ts
```

---

## Manager roster (`src/features/managers/`)

| Class | Base | Tickable | Notes |
|---|---|---|---|
| `WallManager` | FeatureManager | ✓ | 4 parent types, auto-join, pivot rotation |
| `BridgeManager` | FeatureManager | ✓ | owns segments Map + segSeq |
| `SpeedLineManager` | FeatureManager | — | projector injected as callback; auto-generates preset segments |
| `ObstacleManager` | FeatureManager | — | |
| `FootingManager` | FeatureManager | — | |
| `RotationManager` | FeatureManager | ✓ | `detachAll()` before clear; `afterApply()` |
| `TranslationManager` | FeatureManager | ✓ | sets positions directly, no pivot group |
| `JumpLinkManager` | FeatureManager | — | |
| `TrapManager` | **ParentedFeatureManager** | ✓ | variantMesh disposed separately; optional `onActivate` |
| `PortalManager` | **ParentedFeatureManager** | — | ringMesh disposed separately |
| `ArenaEnvironmentManager` | plain | ✓ | env schedule, gravity/tilt/fog/score |
| `SpawnManager` | plain | — | the single physics entity. **Integration is delegated to `sim/step/integrate`**; this class owns the scene, HUD and arena-feature collision |
| `SpecialMoveManager` | plain | ✓ | tick in **seconds** |
| `ProjectileManager` | plain | ✓ | bullets never collide with anything |
| `TargetManager` | plain | ✓ | follow/orbit/flee/lock_on/face — **zero bindings** |
| `TriggerZoneManager` | plain | ✓ | **never registered** |
| `BuffDebuffManager` | plain | ✓ | `getEffective()` has **no caller** |
| `PresentationManager` | plain | — | STL present meshes by node ID |
| `RenderManager` | plain | — | **the** scene-object registry — every feature, arenas/pits/zones/base included. `add` (additive) · `detach` (unparent, no dispose) · `detachObjects` (drop one sub-mesh) · `dispose` (frees geometry+material) |
| `SceneTreeManager` | plain | — | `SceneTreeOps` injection |
| `CameraManager` | plain | — | |
| `ControlManager` | plain | — | implements `IControlManager` |
| `InputManager` | plain | — | module singleton `inputManager` |
| `VirtualControlsOverlay` | plain DOM | — | joystick + JUMP/TRIG |

**Tick units:** feature managers (`_trapMgr`, `_wallMgr`, `_rotMgr`, `_translationMgr`) take **seconds** (`dtMs/1000`). `_envMgr.tick()` and `_spawnMgr.tick()` take **milliseconds**. `SpecialMoveManager.tick()` takes **seconds**. Never pass `dtMs` to a feature manager.

**Manager API** (all `FeatureManager` subclasses): `get` · `getAll` · `has` · `getSeq` · `restoreSeq` · `add` · `apply` · `buildAndShow` · `remove` · `clear` · `setVisible` · `serializeAll(filter?)`.

`FeatureManager.clear()` removes scene-tree nodes, disposes geometry, and calls `untrackObjects` — callers must not duplicate that.

---

## Arena Sandbox — architecture

### Coordinate system

| Level | World Y |
|---|---|
| Scene origin / **octagon base top face** | **0** |
| Arena rim | `posY` (usually 0) |
| Arena bowl centre | `posY − depth` |
| Moat island top | `posY + innerRimOffset` |

`DEFAULT_BASE_HEIGHT = 30` is the **thickness** of the octagon platform, not its world Y. `baseMesh.position.y = -H/2` puts the top face at Y=0.

Geometry is built with `baseY`; `mesh.position.set(posX, posY, posZ)` adds the offset. **Never bake `posY` into vertex Y** — it double-counts.

### Octagon base
`OCTAGON_BASE` in `arenaConstants.ts` is `as const` — writing to it is a compile error. Interactive edits write to `ArenaSandbox.baseConfig`.

### `ArenaSandbox` internal structure

```
Bare Maps owned directly : arenas · pits · zones · bridgesByArena · jumpLinks · translations
                           (DATA only — their meshes live in `_renderMgr`, not a second map)
Seq counters owned here  : arenaSeq · pitSeq · zoneSeq · slSegSeq · jumpLinkSeq · translationSeq
                           (every other seq is owned by its manager via getSeq/restoreSeq)
Managers                 : _wallMgr _bridgeMgr _slMgr _obstacleMgr _trapMgr _portalMgr
                           _footingMgr _rotMgr _envMgr
Services                 : _projectionService _spawnMgr _projectileMgr _translationMgr
                           _targetMgr _triggerZoneMgr
SL interaction state     : slRaycaster · slDrag · selectedSlId
```

`ProjectionService.buildProjector(arenaId)` returns a **fresh** `SceneSurfaceProjector` (no caching) over the arena's own meshes — bowl, floor cap, island cap, spiral ledges — plus live wall, obstacle and bridge-segment meshes. **The bowl used to be missing**, so every projected point fell through to the analytic `arenaSurfaceYAtArenaLocal` formula and the raycaster agreed with it by construction. It is injected into `SpeedLineManager` *and* `SpawnManager` as a constructor callback: both must project against the same geometry or the bey follows a different line from the ribbon it is riding.

### Data model

**`ArenaData`** — `wallProfile` (`parabolic|straight|step|spiral`), `openingShape` (6 shapes), `radiusX/Z`, `depth`, `posX/Y/Z`, `rotY`, `isMoat` (+ inner radii/profile/rim offset), child id arrays, env/physics fields (`gravityScale`, `tiltX/Z`, `fogDensity`, `scoreMultiplier`, `pointsPerSecond`, `weatherSurfaceMap`, `envSchedule`), `particleConfig`, weather + wind fields.

**`PitData`** — straight-walled hole cut into the arena surface. **Depth is fixed at `PIT_FIXED_DEPTH = 10` cm** — never add a depth slider. Polar placement (`posR`, `posAngle`) + own `rotY`. Supports nested pits/zones.

**`ZoneData`** — a *filled* hole, always a parabolic bowl. 8 fills (water, lava, swamp, poison, sand, ice, void, custom) driven by `WAVE_VERT`/`WAVE_FRAG`. `lidMesh` conforms to the parent bowl curvature and writes stencil so the fill wave is clipped to the opening. Fill Y = `surfaceY − 1.0` (near the rim, **not** the bowl floor, or it renders invisible beneath the surface).

**`WallData`** — rim-mounted barrier. `parentType`: `arena | bridge | base | trap`. Tilt 0° = vertical, negative = inward, range [−90°, +30°]; a full-perimeter wall with no gaps is forced to 0° tilt (a closed ring has no free edge). `thickness` + `thicknessDirection` (`outward` default). `autoJoin` suppresses shared end-caps between adjacent arcs. `topProfile`: flat/triangles/waves/serrated/crenellated. Plus `isDouble`, `holes[]`, `moatRing`, destructibility, and `rotateOnArena` with continuous/step/oscillate modes. `MIN_WALL_HEIGHT = 10`, `MIN_WALL_GAP = 10`.

**`BridgeData`** — logical container, **no geometry of its own**. `section: BridgeSection` is shared by **all** segments (width, crossSection flat/u_channel, depth, side walls, material, colour/surface). **Never give a segment its own cross-section.** `group: THREE.Group` added to the scene once.

**`BridgeSegmentData`** — path shape only. 10 types: straight, curve, ramp, bezier, loop, hairpin, corkscrew, chicane, return_loop, exit_loop. Start pose of segment N = end pose of N−1. Per-segment `color`/`surface` override (`null` = inherit). Animation fields (`animEnabled`, offsets, rotations, timing) drive a square wave via `seg._animPivot`.

**`SpeedLineData`** — guided path painted on the bowl that exerts forces. `presetType === 'custom'` → manual segment editing; any other preset → auto-generated segments, segment editor hidden. **24 preset shapes**, 5 ramp profiles, 3 modulation types × 11 waveforms, sections with per-section overrides (`null` = inherit global live), activation modes, entry conditions, exit behaviours, direction, oscillation, stat modifiers, `surfaceFollow`, `arcFraction`. Width up to 30 cm.

**`ObstacleData`** — 6 shapes, free world placement. `posY` is **manual**, not derived from any surface.

**`TrapData`** — flat trigger pad. 12 effects, 11 variants, 4 shapes. Earthquake / RPM / projectile / gravity-pull parameter blocks. `durationTiers` only apply when `effect === 'buff_zone'`. Y derived via `trapSurfY()` at build time, never stored.

**`PortalData`** — teleport pad. `destType`: portal pair / random_arena / world_point. Y derived via `portalSurfY()`.

**`JumpLinkData`** — two endpoints + `JumpFlightConfig`; parabolic launch arc.

**`RotationData`** — `memberIds[]` + `memberTypes[]` orbiting a `THREE.Group` pivot. Members are `attach()`-ed so world transform is preserved. Trap/zone members get per-tick floor-Y correction (the bowl surface under them changes as they orbit — do not bake a fixed Y at attach time). **Arenas, pits, bridges, portals and speed lines are not rotatable.**

**`TranslationData`** — path animation; loop modes once/loop/pingpong × easings linear/ease_in/ease_out/smooth. Sets positions directly; no pivot group.

**`BaseFootingData`** — decorative shape on the octagon base. Distinct from obstacles; `footingBuilders.ts` deliberately does **not** import from `obstacleBuilders.ts`.

**`ArenaMaterial`** (physics, independent of the visual `SurfaceType`):

| Material | Restitution | Spin loss | Damage | Available on |
|---|---|---|---|---|
| `rubber` | 0.15 | 0.05 | 0.20 | walls only |
| `stone` | 0.40 | 0.12 | 0.55 | walls + bridges |
| `abs` | 0.65 | 0.15 | 0.70 | walls + bridges |
| `metal` | 0.90 | 0.20 | 1.00 | walls + bridges |

Every PBR lookup table must include `rubber` or it is a compile error.

### Pit/zone transform
A pit vertex at pit-local `(lx, lz)` maps to arena-local:
```
arena_lx = pitCX + lx·cos(pitRotY) − lz·sin(pitRotY)
arena_lz = pitCZ + lx·sin(pitRotY) + lz·cos(pitRotY)
```
Arena `rotY` cancels algebraically — only the pit's own `rotY` matters. Meshes sit at `(wx, 0, wz)` with `mesh.position.y = 0`; geometry bakes absolute world Y via `arenaSurfaceYAtArenaLocal`.

### Moat islands + stacked arenas
A child arena with `posY = moat.innerRimOffset` sits on the island. `getArenasOnIsland()` detects it; `buildIslandCapGeo(arena, holes)` cuts a hole so the child bowl is visible. **Call `updateAllMoatIslandCaps()` after any arena add/remove/position/radius change** or the cap occludes the child.

### Key geometry functions

| Function | File |
|---|---|
| `buildParabolicBowl` · `buildStraightCut` · `buildMoatGeometry` · `buildFreeArenaMesh` | `bowlBuilders.ts` |
| `buildScoopGeometry` · `buildScoopLidGeo` · `buildScoopSeam` · `buildScoopEdgeLines` | `scoopBuilders.ts` |
| `buildTopFaceGeo` · `buildArenaFloorGeo` · `buildIslandCapGeo` | `platformBuilders.ts` |
| `buildSteppedBowl` · `buildSpiralLedgeMesh` | `floorProfileBuilders.ts` |
| `buildWallGeometry` · `buildWallEdgeGeometry` · `arcFilterPts` · `trapRimPoints` · `trapWorldCenter` | `wallBuilders.ts` |
| `resolveStartPose` · `sampleSegmentPath` · `computeSegmentEndPose` · `buildSegmentDeckGeometry` | `bridgeSegmentBuilders.ts` |
| `computeSegmentPath` · `generatePresetSegments` · `waypointsToSegments` · `applySpeedRamp` · `applyModulation` · `clampToEllipse` · 22 shape samplers | `speedLineBuilders.ts` |
| `SceneSurfaceProjector` (BVH-accelerated) | `sceneSurfaceProjector.ts` |
| `arenaSurfaceYAtArenaLocal` · `worldToArenaLocal` · `polarToLocalXZ` · `extractChildTransform` · `makeSurfFn` · `shapePoints` | `surfaceUtils.ts` |
| `buildParabolicRingGeo` · `buildRimEdges` · `buildFloorAndPillarEdges` · `inChildHole` | `primitives.ts` |
| `buildSurfaceMaterial` (cached) · fill bowl/lid materials | `materialBuilders.ts` |
| `defaultArena/Pit/Zone/SpeedLine` · `buildSpeedLineObjects` · `applySpeedLine` · `innerRimShapePoints` | `arenaObjectBuilders.ts` |
| obstacle / trap / portal / footing / jumpLink / particle / weather / fill builders | respective `*Builders.ts` |

`arenaSurfaceYAtArenaLocal(arena, alx, alz)` returns world Y of the bowl surface: parabolic `H − depth·(1−t²)`, straight `H − depth`, where `H = arena.posY`.

### THE HEADING CONVENTION — project-wide, not a speed-line detail

```
fwd = (−sin(deg), 0, cos(deg))        headingToForward(deg)
deg = atan2(−dx, dz) · RAD2DEG        forwardToHeading(dx, dz)
```

**Both live in `geometry/surfaceUtils.ts` and nowhere else.** `speedLineBuilders`
re-exports them; it does not define them.

This has now been got wrong twice, in two unrelated features, and neither
failure threw, logged, or looked like a bug:

1. **Speed lines** — the encoder used `atan2(−dx, dz)` while the replayer
   rotated `(0,0,1)` about +Y, which yields `(+sin, 0, cos)`. Every one of the
   24 presets replayed mirrored; `spiral_in` on a radius-70 bowl produced a
   ribbon spanning x 68.8…210.5 instead of −70…+70 — entirely outside its own
   arena, which is most of why ribbons looked like they never rendered.
2. **Bridges** — `resolveStartPose`'s `freepoint` branch read `freeDirDeg` as
   `(cos, 0, sin)`, the same vector **rotated 90°**. Every free-standing bridge
   was therefore built across its intended axis. The shipped demo arena's four
   piers ran +Z/−X/−Z/+X instead of −X/−Z/+X/+Z, so a bey aimed down a pier met
   nothing but air — while the piers still rendered, still had geometry, and
   still sat in the scene.

A 90° error is invisible to shape checks (a pier is still long-and-narrow, just
across the wrong axis) and a 45° test case cannot see it either, since both
spellings give equal |x| and |z| there. Test cardinal **and** off-axis headings.
`tests/unit/bridgeStartPose.spec.ts` and `tests/unit/speedLinePath.spec.ts` pin
both sites.

The arena- and wall-parented branches of `resolveStartPose` are **not** covered
by this: they derive direction from the ellipse tangent `(−rz·sin, rx·cos)`,
which is a different quantity and correct as written.

### Speed line preset pipeline
`sampleXxx` → `clampToEllipse` → `applyModulation` → `waypointsToSegments` → section distribution → `applySpeedRamp` → IDs. All driven by `generatePresetSegments`.

Segment encoding (must match `computeSegmentPath`):
```
rotY[0] = 0 ;  startDir = heading[0]
rotY[i] = normalizeAngle180(heading[i] − heading[i−1])
```

### Dependency rebuild chain
After any arena geometry change call `rebuildDependentsOf(arenaId)` — it reapplies rim walls then every bridge in `bridgesByArena[arenaId]` from its first segment. After changing any segment or the bridge section, call `applyBridgeFromSegment(segId)`.

### Scene tree
Icons: arenas `⏺`, pits `▼`, zones `◈`, walls `🧱`, bridges `🌉`, speed lines `⚡`, obstacles `⬛`, traps `⚡`, portals `◉`, rotations `↻`, translations `↔`, jump links `⤻`, footings `⬢`. Segment icons per type.

Nodes with children show one `+` that opens a floating add-popup; a single child type fires directly. **Every node type that can be a jump-link source (arena, obstacle, trap, base) must carry the `⤻+` button in all restore *and* duplicate paths** — omitting it silently removes the feature with no error.

Sub-nodes (`present-`, `particle-`, `weather-`, `env-`, `wallprofile-`) are **not reparentable and not duplicable** — return early for those IDs.

---

## Beyblade Builder — architecture

SOLID split; `BeybladeSandbox` must stay a thin orchestrator:

| Class | Responsibility |
|---|---|
| `BeybladeStore` | pure data, no Three.js |
| `CommandHistory` + commands | undo/redo |
| `BeybladeRenderer` | mesh creation/disposal, view modes, present STL |
| `BeybladeAnimator` | per-frame spin + tilt |
| `BeybladePropertiesPanel` | form UI only |

**Spin axis** is always a straight rigid line:
```
axisRoot (y = pivotOffset, rotated by tiltAngle)
  ├─ axisLine · pivotMarker · groundDisc
  ├─ spinGroup      (.rotation.y advances each frame)
  └─ freeSpinGroup  (stays at 0)
```

**Sectors** are pie-slice frustums with independent top/bottom elliptic radii, built via `ISectorGeometryBuilder` (`SolidSectorBuilder` / `HollowSectorBuilder`, chosen by `getSectorBuilder(isHollow)`). Arc < 360° adds flat side faces. Segments = `max(8, ceil(arcDeg / 5))` — never hardcode. Empty `sectorIds` → the part renders as a full 360° frustum via `partAsSector(part)`.

**All mutations go through a Command** passed to `CommandHistory.execute()`. The only exception is `_selectAxis()`, where tilt/pivot are live pose parameters rather than structural changes.

**View modes:** `hitbox` (hitbox only) · `both` · `present` (STL only). Default `both`.

`PartData` carries `attack`/`defense`/`stamina`/`speed` (0–100) plus `gimmickType` (`none | engine_gear | free_spin | rubber_absorb | mode_change`) and `gimmickStrength`. **None of these currently affect anything.** `LayerData` + `BeybladeBuildConfig.layers` are declared and entirely unconsumed.

When a part is cut into N sectors, the parent `weight` is distributed evenly; the panel warns if the total drifts but does not hard-block.

---

## Special Move system

| Piece | Role |
|---|---|
| `types/specialMoveTypes.ts` | `SpecialMoveDefinition` (resonanceCost, cooldownSec, entryPhaseId, `phases: Map`), `SpecialMovePhase` (durationSec, velocityBoost, projectile, hitEffect, vfx, nextPhaseId, loopCount), save DTOs |
| `managers/SpecialMoveManager.ts` | `ITickableManager` (**seconds**). Resonance +8 per wall impact, +10 per T-key tap, max 100. Phase state machine, caster/target HP. |
| `screens/SpecialMoveSandbox.ts` | the `/special-moves` screen; builds its own octagon base, loads `TEST_ARENA_CONFIG` |
| `utils/SpecialMovePanel.ts` | three-level editor: move list → move detail → phase list/detail |
| `_components.css` | `.sm-hud` + `.sm-panel` blocks |

Wiring: `SpawnManager._onWallImpact` → `SpecialMoveManager.reportImpact(8)`.

**Known limitations:** the target dummy has **no mesh**, `_targetPos` is hardcoded `(0, 0, 25)`, and `setTargetPosition()` is never called — so moves damage an invisible fixed point. Projectile commands are declared but not executed. `_tickPhase` nulls `phase.hitEffect` after it fires, permanently mutating the stored definition for the session.

**`SM_STORAGE_KEY = 'bey_special_moves'` uses raw `localStorage`**, violating the Zustand-only rule below. Migrate it to a store when touched.

---

## Persistence

All persistence goes through Zustand stores in `src/stores/` using `persist` + `createJSONStorage(() => localStorage)`.

| Store | Key | Shape |
|---|---|---|
| `createArenaStateStore(key)` | `bey_arena_arena_sandbox`, `bey_arena_preset_editor` | full `ArenaConfig` + all seq counters; `version: 12`, `migrate: () => emptySlice()` |
| `createBeybladeConfigStore` | `bey_beyblade_builder` | `BeybladeBuildConfig \| null`; `version: 2`, `migrate: () => null` |
| `createTreeStateStore` | `bey_beyblade_builder_tree` | `Set<string>` via partialize/merge |
| `createCameraViewStore` | `bey_view_<title_snake>` | `{ position, target }` |
| `arenaPresetsStore` | `bey_arena_presets` | `ArenaPreset[]` |
| `beyPresetsStore` | `bey_bey_presets` | `BeyPreset[]` |
| `spawnSettingsStore` | `bey_spawn_manager_settings` | `SpawnSettings` |
| `pendingLoadStore` | **not persisted** | cross-screen handoff; `takeArenaPending` / `takeBeyPending` read-and-clear |
| `rpgSaveStore` | `rpg_saves` | slot blobs |
| `svgAssetStore` (Zustand) | `rpg_assets_v1` | id → base64 SVG |
| `rpgSettingsStore` | `rpg_settings` | currently unused |
| `adminUiStore` | **not persisted** | admin tab + selection |

**Three things bypass Zustand** (treat as debt): `SpecialMoveSandbox` (`bey_special_moves`), `rpg/stores/SaveSystem` (`rpg_save_<n>`), and the plain-class singletons in `src/rpg/stores/`. Note `src/rpg/stores/SVGAssetStore.ts` and `src/stores/rpg/svgAssetStore.ts` both export a symbol named `svgAssetStore` — different things.

`saveArena()` is **debounced 300 ms**. For paths that must write immediately (demo load, `_applyConfigToScene`, undo/redo restore) call `_flushSave()`.

**No backward compatibility.** On a version mismatch Zustand's `migrate` discards the save. Never write migration code or version shims.

---

## Known gaps and dead code

**Finished systems with zero callers** — verify before assuming a feature is live:
1. `BuffDebuffManager.getEffective()` — the whole stat-modifier pipeline has no consumer. Speed lines, traps and zones write modifiers every frame; nothing reads them.
2. `TargetManager.bind()` — five steering behaviours, zero bindings.
3. `TriggerZoneManager.register()` — ticks over an empty map.
4. `SpecialMoveManager.setTargetPosition()` — the dummy never moves.
5. `SpawnManager.getSpinDir()` / `getTipPolarity()` — stored and exposed, no physics consumer.

Also: `ProjectileManager` bullets never collide with anything.

**Mesh standing works; lateral collision does not.** `SpawnManager._resolveSurface`
now raycasts the scene via `ISurfaceProvider`/`projectBelow`, so the bey stands on
**bridge decks, obstacle tops, wall caps and the real bowl mesh** — anything the
`ProjectionService` projector gathers. `projectBelow`, not `project`: standing is
"what is beneath my feet", and taking the topmost hit in the column would teleport
a bey in the bowl up onto a bridge crossing above it.

**Obstacle SIDES now exist too.** `sim/step/obstacles.ts` resolves a body
against the authored primitive — circle or oriented box, with the footprint
sampled at the body's own height so a frustum's taper is honoured and a sphere
uses its equator rather than a linear lerp. It is pure (no THREE, no clock), so
the geometry is unit-tested without a browser; `SpawnManager._resolveObstacles`
only translates `ObstacleData` into the few numbers it needs.

Analytic, not mesh, deliberately: `ObstacleData` already says a shipped `.glb`
prop is drawn in place of the primitive and "collision always uses the
primitive either way". Two details are load-bearing — `OBSTACLE_TOP_CLEARANCE`
suppresses side collision just below the top face (otherwise the surface
resolver holds the bey up while the side shoves it off the edge of whatever it
landed on), and velocity is reflected only when it points *into* the surface
(otherwise resting contact becomes a vibration). **`rotX`/`rotZ` are not
supported**: a tilted primitive is no longer an upright prism, so a tilted
obstacle keeps tops-only behaviour rather than colliding against a silently
wrong shape.

**U-channel retention exists but is not end-to-end verified.**
`sim/step/channel.ts` keeps a body between a deck's side walls: nearest
centreline sample, signed lateral offset against `halfWidth - radius`, push
back in. It is pure and has 27 unit tests. `BridgeManager.applySegment` caches
the sampled centreline (`_pathPts`/`_pathRights`/`_halfWidth`, runtime-only,
never serialised) because recomputing it per tick would mean re-deriving every
preceding segment's end pose.

Two traps it already encodes, both found by testing:
- **A deck must only retain bodies NEAR it.** Lateral offset alone cannot
  distinguish "just past the rail" from "900 cm away" — both are simply beyond
  the limit. The demo arena's four piers sit at the SAME deck height, so
  without the proximity test a bey riding one was eligible to be dragged
  sideways by all four. `CHANNEL_EDGE_REACH` also bounds the corridor
  longitudinally, so a body past the final sample is excluded without needing
  the forward vector stored.
- **A `u_channel` floor sits `depth` below the sampled centreline**, so the
  body legitimately rides under the path. With the demo pier's `depth: 2` and a
  tolerance of 2 the body sat exactly on the rejection boundary and retention
  fired or not on float noise. Hence `floorDrop`.

**What is NOT established:** an end-to-end "the bey stays on the deck" test.
Live probing shows retention firing at exactly the corridor limit
(`channelContacts` 0→1, body pushed back inward), but repeated identical runs
disagreed on whether the bey then stayed on or fell — so no e2e test ships
rather than a flaky one. Note the u_channel floor already curves UP toward the
rails (15.0 at centre, 16.3 near the edge on the demo pier), so geometry alone
provides much of the retention there; the untested case is a FLAT deck with
rails, and a body fast enough to clear them. Chase this before relying on
channel retention.
- **No centripetal retention**, so loops and corkscrews cannot be ridden.
- **Portals, jump links and footings** remain entirely visual.

**RPG bugs:**
- `WorldScene.collisionLayer` is populated and never read — **there is no terrain collision**; the player walks through everything.
- `EventSystem.dispatch` uses `scene.start`, which *shuts down* `WorldScene`; the minigame/battle scenes then call `scene.resume('WorldScene')`, which does nothing. **You return to a dead scene.**
- Tile cropping hardcodes `sheetCols = floor(512 / tileW)`, but the Season-1 tileset is 256 px wide, so frame indexing is wrong past the first row.
- `SaveSystem.load()` has no caller — saving works, loading is unimplemented.
- `ShopScene` is complete but unreachable (no shop trigger or NPC `shopId` in seeded data).
- `CutscenePlayer` `npc_move` and `sfx` are empty resolves. `UIScene` minimap is an empty box.

**Speed line ribbons: ROOT CAUSE FOUND AND FIXED.** Two independent bugs were
tangled together under one symptom.

**1. The path was built in the wrong place.** The halves of the pipeline
disagreed about heading: `waypointsToSegments` ENCODES as `atan2(-dx, dz)`
(forward `(-sin, 0, cos)`), `computeSegmentPath` REPLAYED by rotating `(0,0,1)`
about **+Y** (`(+sin, 0, cos)`). X was flipped, so all 24 presets replayed
mirrored and the spirals wound outward -- the shipped `spiral_in` (radiusX 70)
spanned x 68.8..210.5, outside its own bowl. The convention now lives in
`headingToForward` / `forwardToHeading`, used by both sides, with round-trip
tests in `tests/unit/speedLinePath.spec.ts`.

**2. THE LID -- the real reason nothing was visible.** `buildTopFaceGeo` pushed
an arena's opening as a `Shape` hole unconditionally. **A hole can only be cut
from a shape that contains it**; when an arena is bigger than its base, Three's
triangulator cannot express that and silently emits a SOLID face. The shipped
demo arena is radius 120 on a base of circumradius 108.24 (apothem 100 -- the
documented fixed 2 m base), so its top face was never perforated. **What looked
like the bowl floor in every screenshot was the lid**; the bowl, its speed line
and everything in it sat underneath. The builder now emits no top face when the
opening swallows the base (`tests/unit/topFaceHole.spec.ts`).

HOW IT WAS FOUND, because the method mattered more than the fix: a
camera-to-ribbon raycast that NAMES each surface it passes through. It printed
`199.7 octagon TOP FACE [OPAQUE]` in front and `243.6 arena arena-1 bowl` behind,
which ended an investigation that four plausible hypotheses had already failed
to resolve. `__demo.getFeatureState(<slId>)` keeps that probe (`occluders`),
plus mesh/geometry/material diagnostics -- reach for it before theorising about
anything invisible.

FALSIFIED on the way, do not re-try: empty/degenerate geometry (4800 indices,
finite bounds); opacity or sub-pixel width (opacity 1 + width 12 cm changed
nothing); depth-precision z-fighting (`polygonOffset` at BOTH signs changed
nothing -- a two-sided null result is what distinguishes occlusion from
z-fighting); and `renderMgr.add` vs `scene.add` (markers appear only because
`buildStartMarker` sets `depthTest: false`).

**Still true and worth knowing:** a ribbon draws at `opacity x
SL.INACTIVE_OPACITY_MULT` (0.4) whenever `activationMode !== 'always'`, so the
demo line renders at 0.30 alpha and 2.5 cm wide -- faint at full-arena zoom.
That is authored data, not a bug.

**Mobile layout:** the bottom view-mode bar (HITBOX/BOTH/VISUAL) overflows off-screen on mobile portrait — "VISUAL" is unreachable. Root cause is the `vmin` scale collapsing on narrow viewports.

**Arena features to re-verify** (not exhaustive): wall tilt/gaps/profiles, all bridge segment types, zone fill shaders, speed line physics, portal linking, rotation floor correction, trap variants, obstacle floating, particle systems, Load Demo, save/load round-trip.

---

## Architecture rules — coupling prevention

### File responsibility (single reason to change)

| File | Changes when… |
|---|---|
| `config/arenaConstants.ts` | a world constant, tuning number, or material preset changes |
| `types/arenaTypes.ts` | a data model field is added/removed |
| `geometry/primitives.ts` | the core ring/edge generation algorithm changes |
| `geometry/surfaceUtils.ts` | arena surface math or coordinate helpers change |
| `geometry/<x>Builders.ts` | that feature's mesh algorithm changes |
| `features/IArenaFeature.ts` | a new context capability or manager interface is added |
| `features/FeatureManager.ts` | the shared CRUD lifecycle changes |
| `features/ParentedFeatureManager.ts` | surface-Y resolution or tree-parent logic changes |
| `features/ProjectionService.ts` | projector mesh aggregation changes |
| `features/managers/<X>Manager.ts` | that feature's lifecycle changes |
| `utils/PropertiesPanel.ts` | inspector UI changes (no geometry imports) |

### Allowed import direction (never reverse)
```
arenaConstants + arenaTypes
  ← primitives / surfaceUtils
  ← bowl / scoop / platform / material / fill / floorProfile builders
  ← wall / bridgeSegment / speedLine / obstacle / trap / portal / footing / jumpLink builders
  ← arenaObjectBuilders (also imports speedLineBuilders)
  ← features/IArenaFeature (THREE + SceneTree types only)
  ← features/FeatureManager · ParentedFeatureManager · ProjectionService · surfaceProviders
  ← features/managers/*  (geometry + persistence; NEVER from screens/)
  ← screens/*
PropertiesPanel imports arenaTypes + arenaConstants ONLY.
```

### Banned patterns — never introduce
- **`localStorage.setItem/getItem/removeItem` outside `src/stores/`.** The only valid access is `createJSONStorage(() => localStorage)` inside Zustand `persist`.
- Writing to `OCTAGON_BASE.*`.
- Hardcoding `30`, `0.5`, `-1.0`, `0.02` outside `arenaConstants.ts` — use `DEFAULT_BASE_HEIGHT`, `ARENA_ELEVATED_THRESHOLD`, `ZONE_FILL_OFFSET`, `RIM_EPS`.
- Importing geometry builders or `OCTAGON_BASE` into `PropertiesPanel.ts`.
- Importing from `screens/` inside `geometry/` or `features/`.
- Geometry builder functions living in `ArenaSandbox.ts`.
- Inline `SceneSurfaceProjector` construction in `ArenaSandbox` — it belongs in `ProjectionService`.
- Direct `Map<string, X>` fields on `ArenaSandbox` for managed features. The only bare Maps are `arenas`, `pits`, `zones`, `bridgesByArena`, `jumpLinks`, `translations`.
- Re-implementing inline: the parabolic Y formula (`buildParabolicRingGeo`), `posR*cos(angle)` (`polarToLocalXZ`), pit/zone transform extraction (`extractChildTransform`), rim edge loops (`buildRimEdges`).
- Giving bridge segments their own cross-section.
- PBR tables that omit `rubber`.
- Calling `applyWall` for bridge-type walls outside `applyBridgeFromSegment`.
- Skipping `rebuildDependentsOf(arenaId)` after an arena geometry change.
- Adding a `version` field to a save interface (Zustand `persist` owns versioning).
- Migration code or version shims of any kind.
- Managers importing each other directly — use injected callbacks.
- `footingBuilders.ts` importing from `obstacleBuilders.ts` (deliberate duplication).

### Adding things
- New constant → `arenaConstants.ts`, named. Never inline.
- New geometry → the matching `geometry/*Builders.ts`; reuse `primitives.ts` / `surfaceUtils.ts` helpers.
- Ambient particle VFX → `particleBuilders.ts`. Never create `THREE.Points` in `ArenaSandbox`.
- New manager → `src/features/managers/`, receiving everything via `SceneContext` + injected callbacks.

---

## Pitfalls — do not re-introduce

### Rendering
- **`project` vs `projectBelow` — do not confuse them.** `project` returns the globally TOPMOST surface in a column, which is right for painting a ribbon onto a stadium from above and wrong for physics: a bey inside a bowl with a bridge crossing over it would be told the deck is its ground and teleport up onto it. `projectBelow(x, z, maxY)` returns the highest surface at or BELOW a height — "what is under my feet" — and returns null rather than inventing one, so the caller can fall back to its analytic surface. Its `slack` keeps a body resting exactly on a deck from dropping through it on the next frame.
- **A RAYCAST CAN REPORT ABSENCE; IT CANNOT DISTINGUISH ABSENCE FROM A MISS.**
  This has now cost time twice. A `probeDown` grid scan said "bridge-segment
  hits: 0" and was read as *the decks do not exist* — it stepped 10 cm and the
  decks are 6 cm wide. Then a sampled closest-approach measurement was used to
  judge an obstacle collision; at 100 ms intervals and ~300 cm/s the bey is
  only observed every 30 cm, so the figure was sampling noise. When a probe
  reports nothing, **establish the sampling resolution before believing it**,
  and prefer a diagnostic that reads the manager directly
  (`getBridgeDiag`, `getBeyState().obstacleContacts`) over one that interrogates
  the scene geometrically.
- **Some state is unobservable from position alone, and needs a counter.** A bey
  that rebounds off a pillar comes to rest ~31.6 cm from its axis; one that
  never moved sits at 32.5. No position assertion separates those, so an e2e
  test written against position passes with the collision switched off. That is
  what `obstacleContacts` on `getBeyState()` is for. **Check a new physics test
  by disabling the feature and confirming it fails** — two versions of the
  Tower test passed without it before this was done.
- **`__demo.probeDown(x, z)` names every surface a downward ray meets.** Reach for it before reasoning about the scene graph. "Why is nothing under the bey here?" and "what is drawn in front of this?" are the two questions that keep costing hours, and both are answered by naming surfaces along a ray — that is how the ribbon occlusion was finally cracked.
- **`SceneSurfaceProjector` is BVH-accelerated, and that is load-bearing.** It raycasts once per path point and a speed line is ~800 points, so once the arena bowl joined the projector, brute-force `intersectObjects` cost **434 ms per path rebuild** against an 8,128-triangle bowl — ~87% of the 500 ms cache window, every second a bey is near a speed line. With `three-mesh-bvh` the same work is **27 ms**. `tests/unit/projectorBvh.spec.ts` keeps a loose 200 ms guard to catch a silent fall back to the unaccelerated path.
- The BVH prototype patch (`BufferGeometry.computeBoundsTree`, `Mesh.raycast`) is installed once at module load in `sceneSurfaceProjector.ts`. `acceleratedRaycast` defers to the stock implementation for any geometry without a bounds tree, so picking, selection and every other raycast in the app are unaffected.
- **A bounds tree is freed by a listener on the geometry's own `dispose` event.** `geometry.dispose()` knows nothing about it, and this project disposes geometry on every arena edit — hooking the event frees it at the right moment without any of the ~20 bespoke disposal sites needing to know BVHs exist.
- **A downward ray into a bowl strikes the CONCAVE face.** `buildSurfaceMaterial` defaults to `side: DoubleSide`, which is what makes projection work at all; a `FrontSide` surface is silently invisible to the projector and falls through to the analytic fallback.
- **Fog** — removed; causes black screens against a dark background.
- Grid subdivision `0x1a1a2e` is invisible; use `0x2a2a4a`.
- **Never add an object to the scene without routing it through `applyRenderPolicy`** (`render/shadowPolicy.ts`). It decides shadow casting/receiving and — critically — sets `toneMapped = false` on diagram elements. `Material.toneMapped` defaults to **true**, so a line, sprite, `Points` or `MeshBasicMaterial` mesh added without it comes out desaturated by ACES, which silently dulls the authored cyan/orange palette. The rule is *unlit material ⇒ authored colour ⇒ exempt from the exposure curve and the shadow pass*; a lit material is a surface the lighting decides.
- The policy is applied at the **two scene-add funnels** — `RenderManager.add()` (every feature, now including arenas/pits/zones/base) and `Sandbox.addToScene()` (the remaining bare adds: arena lights and particle/weather/fog `Points`) — plus **six sites that bypass both**: `SpawnManager` (the bey's `topGroup`), `BeybladeRenderer` (`rebuildPart` and `loadPresentationSTL`), `PresentationManager`, `ProjectileManager`, `SpeedLineManager` (×4 markers/handles), `ArenaSandbox.rebuildBase` (the re-created octagon grid/outline), `BeybladeSandbox` (particle `Points`), and `arenaObjectBuilders.buildSpiralMeshes`. It recurses, which is required: bridge segment meshes live under `seg._animPivot` and wall meshes under `wall._rotatePivot`, both registered as a Group.
- The policy is **idempotent and re-derives** rather than latching, because several paths swap materials in place (`rebuildBase`, `surfaceRow`) — a mesh that becomes transparent must stop casting.
- Shadow frustum, map size and `normalBias` all derive from `gridSize`. A directional light's shadow camera is orthographic and does **not** follow the scene, so an unfitted frustum is the usual reason shadows appear only near the origin. `normalBias` (not plain `bias`) is what survives the 13× scale gap between the bey and arena sandboxes.
- **Keep the key light off the default camera axis.** Both sandboxes default to a `+x +z` camera, so a light in that same octant throws every shadow directly behind its own caster, where the caster hides it — the scene renders shadows that are never visible. The light sits at `(-0.40, 0.62, 0.32)·gridSize` for that reason. If you move a default camera, re-check the light.
- **Shadows cannot be eyeballed from a single screenshot.** Confirm with `window.__demo.getRenderStats()` (dev-only): it reports `shadowLights`, the fitted frustum, caster/receiver counts, and `toneMappedUnlit` (which must be **0**). `tests/e2e/renderState.spec.ts` asserts all of it — a correctly configured renderer with zero shadow-casting lights is otherwise completely silent.
- Eager renderer creation in a constructor = two GL contexts. Only inside `mountRenderer()`.
- `topFaceMesh` material must always pass `polygonOffset: true` — the octagon top face is coplanar with the arena rim and seam, and without it the whole rim z-fights. All three creation sites must do it; the cache key includes `:po`.
- Non-elevated, non-step, non-moat arenas use `buildFreeArenaMesh`, not bare `buildParabolicBowl` — otherwise there is no outer skirt and you see the hollow interior.
- `buildSteppedBowl` blends boundary vertices toward `parabY(t)` where a step segment meets a smooth one. Removing it produces a hard seam at every boundary.

### Geometry correctness
- Never bake `posY` into vertex Y (`buildArenaFloorGeo`, `buildIslandCapGeo`).
- Never bake `axisOffsetY` into bey part vertex Y — `mesh.position.y` applies it.
- Zone fill Y must be near the rim (`surfY − 1.0`), not the bowl floor.
- Pit/zone `posR` slider max must subtract the child radius, and radius sliders must subtract `posR`, or children extend outside the parent.
- `computeSegmentPath` returns **arena-local** coordinates — rotate to world via `arena.rotY` before use.
- `SceneSurfaceProjector.project(x, z, offset)` takes **world** XZ; the returned `point.y` is already world-space.
- Trap wall rim points: `trapRimPoints(trap)` is trap-**local**; translate to world before passing to the wall builders, then pass the world centre.
- `computeSegmentEndPose(seg, pose, bridge.section)` — the third argument is required; loop-type segments need track width or chains gap at junctions.
- `buildArcArrows` must orient cones with `quaternion.setFromUnitVectors(Vector3(0,1,0), dir)` — `lookAt` + `rotateX` gimbal-locks on near-vertical arcs.

### Lifecycle & disposal
- Bridge segment meshes live under `seg._animPivot` inside `bridge.group` — `scene.remove(seg.mesh)` is a no-op. Dispose via `bridge.group.remove(seg._animPivot)`.
- `bridge.group` is added to the scene once; never re-add on rebuild.
- `trap.variantMesh`, `portal.ringMesh`, `arena.light`, `arena.spiralMeshes`, `arena.particleSystem`, `arena.weatherSystem` all need explicit separate disposal.
- `RotationManager.detachAll()` must run **before** any other manager's `clear()`, then `rotationMgr.clear()` last. Otherwise members are disposed while still parented to a pivot group and vanish instead of being cleaned up.
- After any `apply()` on a rotation member, call `_rotMgr.afterApply(nodeId)` to convert world coords back to group-local.
- `_clearArenas()` must also clear `_subNodesAdded` and `_wallProfileNodes`, or tree nodes can never be re-added.
- Deleting an arena must remove its `present-`/`particle-`/`weather-`/`env-`/`wallprofile-` IDs from those sets.
- All seq counters must be restored in **both** `_applyConfigToScene` and `loadArena`, and `_mergeConfigIntoScene` must `Math.max` every one of them — including `jumpLinkSeq`.
- `_removeJumpLink` must null `sl.jumpLinkId` on every speed line referencing it.
- Deleting a trap must dispose its child trap walls first.

### Properties panel
- **Two-callback pattern.** `showWall/showObstacle/showTrap/showPortal/showFooting` take `onGeomChange` (sliders/colours, no re-render) and `onFullChange` (button-group rows that show/hide sub-sections — triggers a closure re-render). Routing a button-group row to `onGeomChange` leaves sub-rows and sibling highlights stale. Pattern: `const showX = () => this.props.showX(data, live, () => { …; showX(); }); showX();`
- **Every `numRow`/`colorRow`/`toggleRow`/`selectRow` callback must call `onGeomChange()`**, even for pure-data fields with no geometry effect — otherwise `saveArena()` never fires and the value is lost on reload.
- `numRow` uses `input` for display-only and `change` for `onChange`. Never move `onChange` back to `input` — it causes 60fps geometry rebuilds while dragging.
- `surfaceRow(target, onChange)` mutates `target.surface` and `target.customTileData` directly — always pass the real data object, never a temporary proxy.
- `TrapData` has `baseMaterial`, not `material` — wrap it when calling `_wallMaterialRow`.
- Pit depth is fixed: use `readRow('Depth', '10 cm (fixed)')`, not `textRow` or `numRow`.
- `showWall`'s 7th argument `parentArena` is required for the moat ring selector to render.
- `showSpeedLine` needs the `getJumpLinks` callback so `exitBehavior: 'jump_link'` can use a `selectRow` instead of an unusable free-text ID field.

### sim/ — the pure layer
- **`sim/` imports no THREE, reads no wall clock, and uses no unseeded randomness.** That is what makes a replay reproduce; it is also exactly what client-side prediction would need, which is why it is worth keeping true even though no networking exists.
- `BeySpec` is what a bey IS (static, from the builder/STL analysis); `BeyState` is what it is DOING (per-tick). Every field of `BeySpec` was previously a module-level `const` in `SpawnManager` — which is precisely why no two beys could differ.
- **Vectors are plain `{x,y,z}`, not `THREE.Vector3`**, so a state survives `structuredClone` and can be snapshotted, diffed and rewound. A `Vector3` loses its prototype through any of those.
- `SpawnManager` bridges by pointing `_sim.pos`/`_sim.vel` **at its own Vector3 instances** — a `Vector3` structurally satisfies `Vec3`, so the pure functions mutate the objects the renderer already reads. No per-frame allocation and no second copy of the truth.
- Constants that moved (`GRAVITY`, `AIR_CONTROL`) are **deleted** from `SpawnManager`, not left behind. Two sources of truth for a tuning value is how they drift.

### Physics / SpawnManager
- **The octagon top face is at world Y = 0.** `DEFAULT_BASE_HEIGHT = 30` is thickness. `_resolveSurface`'s octagon fallback is `0`; wall `rimY` is `arena.posY`.
- **Base traps are the exception:** `trapSurfY` returns `baseHeight = 30` for base traps and the meshes really are at Y≈30. This is a known system-wide inconsistency that `SpawnManager` deliberately matches. "Fixing" it unilaterally silently disables every base trap.
- Wall gap formula must respect `thicknessDirection`: outward walls collide at `rimDist`, inward at `rimDist − thickness`.
- Depenetration is `pos += gap * outW` (gap is negative, `outW` is the outward normal). `-=` pushes the ball further into the wall.
- Use `CylinderGeometry(topR, bottomR, h)` for the top body — `ConeGeometry` puts the apex at the top, which is backwards.
- Always guard `sl.enabled === false` in `_applySpeedLines` and the T-key search.
- `getCamera()`/`getControls()` are on `Sandbox`, not `SceneContext` — inject them as callbacks.
- `_resolveSurface` must track `arena.gravityScale` into `_currentGravityScale`, and `_applyGravity` must multiply by it.

### Environment manager
- `ArenaData` has **no `id` field** — the ID is the Map key. Iterate `getArenas().entries()`.
- Interval timer init needs `Math.max(0, intervalSec − delaySec)` in **both** `tick()` and `addEntry()`.
- `_fireEntry` must reset `_revertTimer = 0` on every fire, outside the `!_prevValues` snapshot guard.
- RPM revolution detection must use `!==` on the wrapped floor, not `>` — `>` misses counter-clockwise.
- `_envMgr` must be constructed **before** `loadArena()` in `buildCustom()`; several paths call it without optional chaining.
- `_applyArenaTilt(arena)` must follow **every** `applyArena()` call (which resets `rotation.x/z`), and must also rotate `arena.spiralMeshes`.
- The weather surface-map path must also call `updateArenaChildren()` + `rebuildDependentsOf()`.
- `clear()` resets timers only; `clearSchedule(arenaId)` removes entries. `triggerEvent()` only fires `'event'`-type entries.
- Runtime-only, never serialise: `_score`, `tiltGroup`, `fogSystem`, `_timer`, `_revertTimer`, `_prevValues`, wall `_rotatePivot`/`_arenaRotateTimer`, bridge `_animTimer`/`_animCenter`/`_animPivot`/`_pathPts`/`_pathRights`/`_halfWidth`, trap `_eq*`/`_rpm*`/`_gravityTimer`, rotation `pivotGroup`/`currentAngle`.

### Naming collisions
- `BeybladeSandbox` uses `beyRenderer`, because `Sandbox` already has a private `renderer: THREE.WebGLRenderer`.
- `ArenaConfig` lives in `utils/arenaPersistence.ts`, **not** `types/arenaTypes.ts`.
- `arenaToSave(id, arena, pits, zones)` takes 4 args and returns empty `walls`/`speedLines` for the caller to fill. `trapToSave(trap)` takes 1.
- `BridgeSegmentSave` has no `bridgeId` — pass it separately.
- `BeybladeStore.deserialize` spreads then overwrites (`const part = {...p}; if (!part.present) …`). Writing `{ present: default(), ...p }` is a TS2783 duplicate-key error.

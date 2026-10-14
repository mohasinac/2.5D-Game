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
npm run docker:dev          # Vite dev server → http://localhost:3000
npm run docker:typecheck    # tsc --noEmit
npm run docker:test         # Playwright specs against http://app:3000
npm run docker:down         # tear down + drop volumes

npm run dev                 # host fallback
npm run build               # tsc && vite build
npm run typecheck           # tsc --noEmit
npm run test:e2e            # Playwright on the host (needs a dev server on :3000)
npm run demo                # Puppeteer script that builds the demo arena through the UI
npm run deploy              # npm run build && firebase deploy --only hosting
```

**Standing rule: clear all TypeScript errors before starting any task.**

- `Dockerfile` has three stages: `deps` (npm ci, caches on lockfile alone), `dev` (Vite), `test` (official Playwright image).
- A **named volume on `/app/node_modules`** is load-bearing — without it the Windows bind mount shadows the Linux-built dependencies.
- `vite.config.ts` sets `host: true` and `watch.usePolling` under Docker, because Windows→Linux bind mounts do not propagate inotify events.
- `shm_size: 1gb` on the test service — Chromium crashes on Docker's default 64 MB `/dev/shm`.
- **`PLAYWRIGHT_VERSION` in the Dockerfile must match `@playwright/test` in `package.json`.** Drift fails the container with "Executable doesn't exist".

### Tests

`tests/e2e/screens.spec.ts` — one test per screen × three viewport projects (desktop 1280×800, mobile-portrait 390×844, mobile-landscape 844×390). Checks: uncaught JS errors, console errors, required selectors, WebGL canvas, mobile drawer toggles + 44px touch targets on **both** axes, virtual-controls overlay, horizontal overflow, screenshot.

**When you add a route to `src/main.ts`, add it to `tests/e2e/screens.data.ts` in the same change.** The `@meta` test fails if a documented route has no coverage — that guard exists because `/special-moves` shipped with zero test coverage.

Chromium needs `--use-gl=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` or the Three.js canvas never initialises headless and every sandbox screen fails for the wrong reason.

### Feature demos — `npm run demo:features`

199 demos, one per *variant* (every wall top profile, all 24 speed-line presets, every trap effect…), driven through the dev-only `window.__demo` API.

```
npm run demo:features                  # watch all of them, headed
npm run demo:features -- -g "wall"     # one family
DEMO_SLOWMO=250 npm run demo:features  # slow it down
DEMO_RECORD=1   npm run demo:features  # per-demo video
```

- **Headed on the host by design**, with real GPU WebGL — the point is to watch them. The headless Docker suite is `tests/e2e`.
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
| `SpawnManager` | plain | — | **890 lines; the single physics entity** |
| `SpecialMoveManager` | plain | ✓ | tick in **seconds** |
| `ProjectileManager` | plain | ✓ | bullets never collide with anything |
| `TargetManager` | plain | ✓ | follow/orbit/flee/lock_on/face — **zero bindings** |
| `TriggerZoneManager` | plain | ✓ | **never registered** |
| `BuffDebuffManager` | plain | ✓ | `getEffective()` has **no caller** |
| `PresentationManager` | plain | — | STL present meshes by node ID |
| `RenderManager` | plain | — | universal scene object registry |
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
Seq counters owned here  : arenaSeq · pitSeq · zoneSeq · slSegSeq · jumpLinkSeq · translationSeq
                           (every other seq is owned by its manager via getSeq/restoreSeq)
Managers                 : _wallMgr _bridgeMgr _slMgr _obstacleMgr _trapMgr _portalMgr
                           _footingMgr _rotMgr _envMgr
Services                 : _projectionService _spawnMgr _projectileMgr _translationMgr
                           _targetMgr _triggerZoneMgr
SL interaction state     : slRaycaster · slDrag · selectedSlId
```

`ProjectionService.buildProjector(arenaId)` reads the wall/obstacle/bridge managers for live meshes and returns a **fresh** `SceneSurfaceProjector` (no caching), injected into `SpeedLineManager` as a constructor callback.

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
| `SceneSurfaceProjector` | `sceneSurfaceProjector.ts` |
| `arenaSurfaceYAtArenaLocal` · `worldToArenaLocal` · `polarToLocalXZ` · `extractChildTransform` · `makeSurfFn` · `shapePoints` | `surfaceUtils.ts` |
| `buildParabolicRingGeo` · `buildRimEdges` · `buildFloorAndPillarEdges` · `inChildHole` | `primitives.ts` |
| `buildSurfaceMaterial` (cached) · fill bowl/lid materials | `materialBuilders.ts` |
| `defaultArena/Pit/Zone/SpeedLine` · `buildSpeedLineObjects` · `applySpeedLine` · `innerRimShapePoints` | `arenaObjectBuilders.ts` |
| obstacle / trap / portal / footing / jumpLink / particle / weather / fill builders | respective `*Builders.ts` |

`arenaSurfaceYAtArenaLocal(arena, alx, alz)` returns world Y of the bowl surface: parabolic `H − depth·(1−t²)`, straight `H − depth`, where `H = arena.posY`.

### Speed line preset pipeline
`sampleXxx` → `clampToEllipse` → `applyModulation` → `waypointsToSegments` → section distribution → `applySpeedRamp` → IDs. All driven by `generatePresetSegments`.

**Heading convention** (must match `computeSegmentPath`):
```
fwd        = (−sin(startDir), 0, cos(startDir))
heading[i] = atan2(−(p[i+1].x − p[i].x), p[i+1].z − p[i].z) · RAD2DEG
rotY[0]    = 0 ;  startDir = heading[0]
rotY[i]    = normalizeAngle180(heading[i] − heading[i−1])
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

Also: `ProjectileManager` bullets never collide with anything. `SpawnManager` has no collision with obstacles, bridges, portals, jump links or footings — those are visual-only geometry you drive straight through.

**RPG bugs:**
- `WorldScene.collisionLayer` is populated and never read — **there is no terrain collision**; the player walks through everything.
- `EventSystem.dispatch` uses `scene.start`, which *shuts down* `WorldScene`; the minigame/battle scenes then call `scene.resume('WorldScene')`, which does nothing. **You return to a dead scene.**
- Tile cropping hardcodes `sheetCols = floor(512 / tileW)`, but the Season-1 tileset is 256 px wide, so frame indexing is wrong past the first row.
- `SaveSystem.load()` has no caller — saving works, loading is unimplemented.
- `ShopScene` is complete but unreachable (no shop trigger or NPC `shopId` in seeded data).
- `CutscenePlayer` `npc_move` and `sfx` are empty resolves. `UIScene` minimap is an empty box.

**Speed line ribbons do not render (OPEN).** Found by the demo tour. After the
`_ensurePresetSegments` fix below, a preset speed line restored from a save has 61
segments, a built mesh, 2 markers, and the start marker is visibly drawn — but the
**ribbon itself is never visible**, on `/arena` and on `/special-moves` with the
shipped `testArenaConfig.ts`. Mesh and edges go through `renderMgr.add` (which does
not alter visibility) while markers are added straight to the scene and *do* show, so
the most likely cause is the ribbon being drawn coincident with, or beneath, the bowl
surface. Not yet fixed.

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
- **Fog** — removed; causes black screens against a dark background.
- Grid subdivision `0x1a1a2e` is invisible; use `0x2a2a4a`.
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
- Runtime-only, never serialise: `_score`, `tiltGroup`, `fogSystem`, `_timer`, `_revertTimer`, `_prevValues`, wall `_rotatePivot`/`_arenaRotateTimer`, bridge `_animTimer`/`_animCenter`/`_animPivot`, trap `_eq*`/`_rpm*`/`_gravityTimer`, rotation `pivotGroup`/`currentAngle`.

### Naming collisions
- `BeybladeSandbox` uses `beyRenderer`, because `Sandbox` already has a private `renderer: THREE.WebGLRenderer`.
- `ArenaConfig` lives in `utils/arenaPersistence.ts`, **not** `types/arenaTypes.ts`.
- `arenaToSave(id, arena, pits, zones)` takes 4 args and returns empty `walls`/`speedLines` for the caller to fill. `trapToSave(trap)` takes 1.
- `BridgeSegmentSave` has no `bridgeId` — pass it separately.
- `BeybladeStore.deserialize` spreads then overwrites (`const part = {...p}; if (!part.present) …`). Writing `{ present: default(), ...p }` is a TS2783 duplicate-key error.

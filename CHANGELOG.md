# CHANGELOG

## [2.4.0] - 2026-05-23

### Added

- **Arena Tilt (Z-axis orientation)** — arenas can now be tilted 0–360° around any horizontal azimuth, enabling Zero-G (inverted 180°), wall-ride (90°), tilted-planet, and spinning-tilted-bowl environments.
  - `ArenaConfig`: full tilt field set — `tiltAngle`, `tiltDirection`, `tiltMode` (`"fixed" | "oscillate" | "weight"`), `autoTilt`, `tiltSpeed`, `tiltPivotX/Y`, `tiltOscillateMin/Max/PeriodMs`. Rotation section gained `rotationPivotX/Y`.
  - `ArenaState` Colyseus schema: all tilt + pivot fields as `@type` declarations (including `tiltPhaseMs` oscillation clock), synced to all clients at 60 Hz.
  - **Physics**: `computeTiltForce(tiltAngle, tiltDir, mass)` in `server/shared/physics/ArenaUtils.ts` applies lateral gravity (`sin(tiltAngle) × 0.04 × mass`) toward the downhill side every tick.
  - **Tilt modes**:
    - `"fixed"` — static tilt at configured angle + direction. `autoTilt` spins the direction axis at `tiltSpeed` °/s.
    - `"oscillate"` — `tiltAngle` rocks between `tiltOscillateMin` ↔ `tiltOscillateMax` on a cosine wave with period `tiltOscillatePeriodMs`. `tiltPhaseMs` is the internal clock advanced each tick.
    - `"weight"` — arena tilts toward the center of mass of all active beyblades. `tiltOscillateMax` is the maximum angle; direction tracks the heavy side automatically.
  - **Pivot support**: both tilt (`tiltPivotX/Y`) and rotation (`rotationPivotX/Y`) accept a cm offset from arena center. In the renderer, `container.pivot + container.position` compensation keeps the visual origin at world (0,0) while rotating/tilting around the offset point.
  - **Server tick**: `advanceArenaTilt()` handles `fixed` and `oscillate` mode advancement; new `applyWeightTilt()` handles `weight` mode. Both wired into all four room types.
  - **Renderer**: three nested PixiJS containers (`arenaTiltOuter → arenaTiltScale → arenaTiltInner`) with configurable pivot. `scaleX = cos(tiltAngle)` produces correct elliptical projection; negative scaleX at 90–270° creates the natural inverted/mirrored look. Rotation root pivot also now reads `rotationPivotX/Y` from arena state.
  - **Admin UI (BasicsTab)**: tilt mode selector (Fixed / Oscillate / Weight), oscillation range inputs (min / max angle + period), pivot X/Y inputs for both tilt and rotation. Rotation panel gains rotation pivot X/Y inputs.
- **Switch wiring for all arena features**: `TurretConfig` gained `controlledBySwitchId`. Admin panels for SpinZones, GravityHoles, Bumps (FeaturesTab) and Turrets (TurretsTab) now expose "Controlled By Switch ID" text inputs.

## [2.3.0] - 2026-05-21

### Fixed

- **AI Battle infinite "Loading..." spinner** — `useColyseus` now wraps `joinOrCreate` in a 15-second `Promise.race` timeout, so the loading overlay resolves to an error state rather than hanging forever when the server is cold-starting.
- **Firestore hang blocking room creation** — `loadArena` and `loadBeyblade` in `src/utils/firebase.ts` now use a 5-second timeout via `Promise.race`, preventing slow Firestore reads from stalling `AIBattleRoom.onCreate` indefinitely.
- **PvP input never enabled (CRITICAL)** — `BattleGamePage` was gating `useGameInput` on `gameState?.status === "playing"` but the server emits `"in-progress"`. Fixed to `"in-progress"`; keyboard input now works in PvP matches.
- **`ServerGameState` type literals out of sync** — `status` and `mode` union types in `client/src/types/game.ts` were stale (`"playing"`, `"countdown"`, `"pvp"`, `"ai"`). Corrected to match server values (`"in-progress"`, `"warmup"`, `"single-battle-pvp"`, `"ai-battle"`).
- **Spin-out particles spawning at wrong position/colour** — All three room `"spin-out"` broadcasts were missing `x`, `y`, and `type` fields. Particles were placed at `(undefined, undefined)` in white. Fixed in `AIBattleRoom`, `TryoutRoom`, and `BattleRoom`.
- **Warmup overlay never shown** — `BattleGamePage` checked `gameState?.status === "countdown"`; corrected to `"warmup"`.
- **BattleLobbyPage navigation broken** — navigation to `/game/battle/:roomId` was gated on `gameState?.status === "playing"`; corrected to `"in-progress"`.
- **Damage numbers not spawned on collision** — `BattleGamePage` was not destructuring `spawnDamageNumber` from `usePixiRenderer`; added and wired into the `"collision"` message handler.
- **`RendererDemoPage` and `ArenaTestPage` type errors** — inline `ServerGameState` literals used stale `"playing"` / `"pvp"` values; corrected to `"in-progress"` / `"single-battle-pvp"`.

### Added

- **60-second idle disconnect across all server rooms** — `AIBattleRoom`, `TryoutRoom`, and `BattleRoom` now track `lastInputTime`. If no human input arrives for 60 seconds the room broadcasts `"idle-disconnect"` and calls `this.disconnect()`. AI inputs do not reset the timer. In `BattleRoom`, any one human player's input resets the timer for all.
- **Client idle-disconnect toast** — `useColyseus` listens for `"idle-disconnect"` from the server and surfaces a `react-hot-toast` notification: "Disconnected due to inactivity."
- **Deferred simulation start** — All three rooms no longer call `setSimulationInterval` in `onCreate` (which ran the 60 Hz loop for empty rooms, burning Railway trial compute). `TryoutRoom` and `BattleRoom` now start the loop on the first `onJoin`. `AIBattleRoom` starts it after both beyblades are created.
- **`autoDispose = true`** set in all three rooms so Colyseus disposes the room automatically when the last client leaves — no manual `this.disconnect()` needed in `onLeave`.
- **Improved AI Battle error overlay** — shows a warning icon, "Could not connect to game server" heading, and a "server may be starting up" hint when `connectionState === "error"`.

### Changed

- All client test files updated: `"playing"` → `"in-progress"`, `"ai"` → `"ai-battle"`, `"pvp"` → `"single-battle-pvp"` to match corrected type literals.

### Tests

- **`tests/rooms.test.ts`** (32 new server tests) — win-condition logic (last-standing, simultaneous spin-out, timer expiry, no double-fire), idle-disconnect predicate (boundary values, AI-must-not-reset contract, any-human-resets-in-BattleRoom), spin decay → spin-out trigger, nutation wobble threshold (40% boundary, mass scaling), stat formula derivation for all four type distributions, broadcast event payload contracts (collision, game-over, ring-out, idle-disconnect, special-move).
- **`tests/physics2d.test.ts`** (35 new server tests) — all 2.5D `PhysicsEngine` methods: `checkLoopCollision`, `checkPitCollision`, `checkWaterCollision` (moat/zone/wall-based), `checkObstacleCollision`, `applyLoopBoost`, `applyWaterResistance`, `applyKnockback`, `applyLateralForce`, `isOutOfBounds`, `removeBeyblade`, `destroy`.
- **`client/src/__tests__/pages/BattleGamePage.test.tsx`** (26 new client tests) — layout, connecting overlay (Joining battle / Connection lost / Back to Lobby), timer, alive count, warmup overlay, my-stats panel (HP, Spin, stability labels), opponent health bars + ELIMINATED badge, game-over overlay (VICTORY!/DEFEATED, leaderboard sort, Survived/KO, Play Again + Menu links).
- **Total test count: 324** (server 137, client 187 — all passing).

---

## [2.2.0] - 2026-05-20

### Added

- **Zustand game-state store with AES-GCM encrypted persistence** — `client/src/stores/gameStore.tsx` replaces the React Context `GameProvider` as the source of truth for game settings. State is serialised to `localStorage` under the key `beyblade-game-state` and encrypted with AES-GCM (256-bit key, PBKDF2-derived, 100 000 iterations in production). The encryption IV is randomised on every write; corrupted or legacy unencrypted entries are automatically discarded on read.
- **Stable `userId` across reloads** — `userId` is now persisted, so the Colyseus server can recognise a returning player and reconnect them to their existing room session. Previously a new random ID was generated on every page load.
- **`activeRoomId` field** — saved when a battle room is joined and cleared on navigate-away. Enables a future "resume active game" affordance from the menu.
- **`isHydrated` flag** — `useGame()` now exposes `isHydrated: boolean`. Both `BattleGamePage` and `TryoutGamePage` gate their `connect()` call on this flag so the Colyseus join always uses the decrypted `beybladeId`, `arenaId`, and `userId` rather than the pre-load defaults.
- **`setActiveRoom` action** — exposed on `useGame()` for components that need to record or clear the active room reference.

### Changed

- `GameContext.tsx` is now a thin re-export shim (`export * from "@/stores/gameStore"`) — all existing imports are unchanged.
- `GameProvider` is a no-op wrapper (`<>{children}</>`) since Zustand is global; the component is retained for API compatibility with `RootLayout` and test mocks.
- `BattleGamePage` — `autoConnect` changed from `true` to `false`; connection is initiated in a `useEffect` that fires once `isHydrated` is true.
- `TryoutGamePage` — `connect()` call in `useEffect` is now guarded by `isHydrated`.
- `GameContext.test.tsx` — added `beforeEach` store reset (`useGameStore.setState(...)`) for Zustand singleton isolation; replaced the "throws outside provider" test with a "works without provider" shape check.

---

## [2.1.0] - 2026-05-20

### Fixed

- **PixiJS WebGL context loss spam** — React 19 Strict Mode double-mount caused `app.destroy()` to call `gl.getExtension('WEBGL_lose_context').loseContext()`, firing an async `webglcontextlost` event that hit the new app's render loop, producing ~30+ `"refId" not found` errors per second. Fixed by nulling `gl.getExtension` before `app.destroy()` in `PixiRenderer.destroy()`. Added `webglcontextlost` / `webglcontextrestored` event listeners as a backup guard for real GPU context losses.
- **AI Battle route mismatch** — route was `game/ai/:roomId` but the AI Battle game page reads config from `location.state`, not a URL param. Renamed to static path `game/ai-battle/play` to match the setup page namespace and eliminate the unused dynamic segment.
- **AIBattleSetupPage navigation** — `navigate("/game/ai/start", ...)` pointed at a non-existent route; corrected to `navigate("/game/ai-battle/play", ...)`. Also calls `setGameConfig()` before navigating so context is seeded before the game page mounts.
- **RootLayout fullscreen path list** — updated `FULLSCREEN_GAME_PATHS` to use `"/game/ai-battle/play"` (was `"/game/ai/"`) so the AuthChip is correctly hidden during AI battles.
- **BattleGamePage controls hint** — corrected stale hint text to `"WASD/Arrows: Move · J: Attack · K: Defend · L: Dodge · I: Jump · Space: Charge/Special"`.
- **AIBattleGamePage options stability** — wrapped `colyseusOptions` in `useMemo` to prevent a new object reference on every render, eliminating redundant reconnects. Typed `location.state` as `AIBattleLocationState` instead of `any`.

### Added

- **Vitest test suite** — 161 tests across 17 files covering the full client codebase:
  - `types/game.test.ts` — type helpers, stat formulas, color maps (15 tests)
  - `contexts/GameContext.test.tsx` — provider defaults, `setGameConfig`, persistence (17 tests)
  - `contexts/AuthContext.test.tsx` — auth state, sign-in, sign-out flows (7 tests)
  - `game/hooks/useGameInput.test.ts` — key bindings, charge/special threshold, active guard (22 tests)
  - `game/hooks/useColyseus.test.ts` — connect, disconnect, error, `sendInput` (15 tests)
  - `game/hooks/usePixiRenderer.test.ts` — lifecycle, render dispatch (6 tests)
  - `game/renderer/PixiRenderer.test.ts` — init, render guards, particles, destroy (13 tests)
  - `components/auth/ProtectedRoute.test.tsx` — auth redirect, render (4 tests)
  - `components/auth/AdminRoute.test.tsx` — admin role guard (4 tests)
  - `router.test.tsx` — all route paths, auth redirects, 404 (10 tests)
  - `pages/HomePage.test.tsx` — hero CTAs, nav links (4 tests)
  - `pages/LoginPage.test.tsx` — form submit, error state, redirect (7 tests)
  - `pages/GameSelectPage.test.tsx` — Firestore settings flags, card states (7 tests)
  - `pages/AIBattleSetupPage.test.tsx` — form interactions, navigate target (8 tests)
  - `pages/BattleLobbyPage.test.tsx` — lobby create/join, Firestore fetch (7 tests)
  - `pages/TryoutGamePage.test.tsx` — mount, HUD, game loop (6 tests)
  - `pages/AIBattleGamePage.test.tsx` — mount, overlay states, controls (9 tests)
- **Test infrastructure** — `client/vitest.config.ts`, global mock setup (`src/__tests__/setup.ts`) for Firebase, Colyseus, PixiJS, react-hot-toast, `import.meta.env`, and RAF stubs. Test scripts added to `client/package.json`: `test`, `test:watch`, `test:coverage`.

---

## [2.0.0] - 2026-05-20

### Added — 2.5D Beyblade Part System (Admin)

Complete modular part-library editor for building Beyblade compositions.
**Important**: entirely separate from the 2D gameplay engine — existing physics, rooms, and `beyblade_stats` are untouched.

#### Part Library
- 7 Firestore part collections: `bit_beast_parts`, `attack_ring_parts`, `weight_disk_parts`, `sub_parts`, `tip_parts`, `core_parts`, `casing_parts`
- Generic `sub_parts` collection replaces separate sub-AR / WD-sub / sub-casing collections — one sub-part can attach to any parent part type
- `beyblade_systems` collection stores lightweight compositions (part ID references)

#### Admin UI — Part Editors
- **Part Search** (`/admin/2d/parts`) — unified search across all 7 part types with type-filter chips and compatibility filter
- Per-type Part CRUD pages at `/admin/2d/parts/:type` — shared generic editor shell parameterised by part type
- **Shape editor**: preset shapes + silhouette tracer (marching squares → Bezier fit), Fourier radial profile editor (DFT-based, 2–32 harmonics), spline side-profile editor (Catmull-Rom knot canvas)
- **Contact point editor**: extended CP fields — `radius`, `thickness`, `heightRange`, `material`, `attackType`, `spinBehavior`, `extends` gimmick, roller wheel
- **Configurations editor**: multi-config parts with auto-trigger conditions (`spin_threshold`, `core_activated`, etc.)
- **Pockets editor**: 2D canvas ball-pocket placement
- Material bands, dimensions, compatibility tags per part

#### Admin UI — Beyblade System Compositor
- **Beyblade Systems** (`/admin/2d/beyblade-systems`) — assemble a Beyblade from library parts
- Dynamic slot tabs: Bit Beast, Attack Ring (with flip toggle), Weight Disk, Tip, Core, Casing
- Sub-Parts tab: attach any number of sub-parts to any parent slot, configure placement (above/below), flip, active config
- Live preview panel with three canvases:
  - **SideProfileView** — height-scaled cross-section, contact point bands with attack-angle indicators
  - **TopDownView** — Fourier radial polygon, material-mode CP sectors, image-mode CP arcs, movement-path overlay
  - **IsometricView** — 3/4 view with spin animation, free-spin sub-part lag, spin-direction indicator
- **ComputedStatsPanel** — live `computeBeybladeStats()` output (damage multiplier, decay rate, type distribution)
- **Publish to Stats** button — converts 2.5D system → `beyblade_stats` document; writes `linkedStatsId` back

#### Admin UI — Compatibility Tags
- **Compatibility Tags** (`/admin/2d/compatibility-tags`) — aggregates all `compatibilityTags`, `requiredCompatibility`, `excludedCompatibility` values across all part collections
- Shows usage count, part types, field breakdown per tag
- **Batch rename**: updating a tag propagates to every part document in every collection in one action
- PartPicker enforces compatibility: incompatible parts are grayed out with "Override" escape for admins

#### Type System
- `client/src/types/beybladeSystem.ts` — full type schema: `ARPart`, `WDPart`, `TipPart`, `CorePart`, `CasingPart`, `BitBeastPart`, `SubPart`, `BeybladeSystem`, `SystemContactPoint`, `PartShape`, `FourierRadialProfile`, `BezierPath`, `BezierSplineProfile`
- `client/src/lib/beybladeSystemConverter.ts` — `resolveBeybladeSystem()`, `computeBeybladeStats()`, `computeEffectiveRadius()`

#### Physics Extensions (backward compatible)
- `MATERIAL_MULTIPLIERS` (abs/rubber/metal/pom/polycarbonate) — only active when `cp.material` is set; existing flat-stats CPs unaffected
- `checkRadialContactMatch()` — radial CP gate; returns `true` when `cp.radius` is undefined (all legacy CPs pass through)
- `getContactPointMultiplier()` — extended with optional `contactRadiusMm` and `currentSpinFraction` params; defaults preserve exact prior behavior
- New `Beyblade` schema fields: `specialMove`, `tipOffsetX`, `tipOffsetY`, `wobbleAmplitude`, `subPartSpins`, `activePartConfigs` (all default-safe, additive)

### Added — AI Battle Mode

- **AI Battle Setup** (`/game/ai-battle`) — select your Beyblade, AI's Beyblade, arena, and difficulty (Easy / Medium / Hard)
- **AI Battle Game** (`/game/ai-battle/play`) — connects to `ai_battle_room` when server room is available
- **Game Select Page** now reads `settings/game` from Firestore on load:
  - `enableAI: true` → AI Battle card becomes clickable (purple), links to setup page
  - `enableAI: false` → AI Battle card shows "Coming Soon" (disabled, current default)
  - `enableTournament: true` → Tournament card appears in the grid
  - `maintenanceMode: true` → yellow maintenance banner shown to players
  - `serverMessage` → info banner shown when set (non-maintenance messages show in blue)

### Changed

- `GameSelectPage` — driven by Firestore settings instead of hardcoded disabled states; grid columns auto-adjust to mode count
- `AdminLayout` — new "2.5D Part System" nav section with Part Search, 7 Part Libraries, Beyblade Systems, Compatibility Tags
- `router.tsx` — added `/game/ai-battle`, `/game/ai-battle/play`, and all `/admin/2d/**` routes
- `firebase.ts COLLECTIONS` — added 8 new keys for part collections and beyblade systems

---

## [1.3.0] - 2026-03-XX

### Added
- Firebase authentication + admin role guard
- AuthContext, ProtectedRoute, AdminRoute
- `users` Firestore collection with role field

---

## [1.2.0] - 2026-02-XX

### Added
- Vite + React SPA replaces Next.js admin panel
- React Router v6 client-side routing
- PixiJS 8 WebGL renderer (5-layer stack)
- Full PvP Battle Mode (2–4 players)
- Arena configurator with shape editor, obstacles, portals, water bodies, turrets
- Special moves: Stampede Rush, Gyro Anchor, Spin Recovery, Tactical Burst
- Vercel deployment config

---

## [1.0.0] - 2025-11-06

### Added
- Initial release: Colyseus game server + Next.js admin panel
- Server-authoritative physics with Matter.js
- Tryout (solo practice) mode
- Beyblade CRUD, Stadium configuration, Game statistics, Settings management

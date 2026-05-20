# CHANGELOG

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
- **AI Battle Game** (`/game/ai/:roomId`) — connects to `ai_battle_room` when server room is available
- **Game Select Page** now reads `settings/game` from Firestore on load:
  - `enableAI: true` → AI Battle card becomes clickable (purple), links to setup page
  - `enableAI: false` → AI Battle card shows "Coming Soon" (disabled, current default)
  - `enableTournament: true` → Tournament card appears in the grid
  - `maintenanceMode: true` → yellow maintenance banner shown to players
  - `serverMessage` → info banner shown when set (non-maintenance messages show in blue)

### Changed

- `GameSelectPage` — driven by Firestore settings instead of hardcoded disabled states; grid columns auto-adjust to mode count
- `AdminLayout` — new "2.5D Part System" nav section with Part Search, 7 Part Libraries, Beyblade Systems, Compatibility Tags
- `router.tsx` — added `/game/ai-battle`, `/game/ai/:roomId`, and all `/admin/2d/**` routes
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

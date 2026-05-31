# CLAUDE.md — Beyblade Game

## NO DEFERENCE POLICY

**All plan items must be fully implemented — no deferrals, no "leaving for later", no "future work" notes.**

- Every `- [ ]` item in any plan file under `.claude/plans/` must be completed before the session ends.
- Never mark something as deferred, out-of-scope, or "can be added later" unless the user explicitly agrees to skip it.
- If an item is already implemented, verify it against the code and mark it `[x]`; do not assume it is done without checking.
- If a plan item cannot be completed in the current session (e.g., requires external services), say so explicitly with a reason — do not silently skip it.

---

## TypeScript: Fix TSC Errors First

**Before starting any task, run `cd client && npx tsc --noEmit`. If there are existing errors, fix them all before doing anything else.**

---

## TypeScript: Zero Errors Policy

**After every code change, `cd client && npx tsc --noEmit` must pass with zero errors before the task is considered done.**

- Run `npx tsc --noEmit` in `client/` after any edit to `.ts` / `.tsx` files or to anything under `shared/types/`.
- Fix every error before moving on — do not leave type errors for later.
- Common patterns to watch for:
  - New types added to `shared/types/` that reference sibling files must have those files present in `shared/types/`.
  - Adding optional geometry fields (radius, length, width) to types when the renderer starts reading them.
  - Missing imports when a new helper or class is used in a page file.
  - `Record<string, unknown>` property access used in JSX must be cast with `!!` or `as` before use as a `ReactNode` condition.

---

## Project Structure

Single runnable system — client-only SPA:

```
client/     → Vite + React SPA (TypeScript, port 3001 dev)
shared/     → Shared types (beyblade stats, arena config, etc.)
scripts/    → Firestore seed scripts (Node.js)
```

There is no server. All game physics run locally in the browser via local simulation classes.

## Development

```bash
npm run dev:client   # starts Vite (cd client && npm run dev)
```

Client is deployed on **Vercel** (not Firebase Hosting — `firebase.json` has no hosting block).

## Key Architecture Decisions

- **Client-side physics** — All game physics run in the browser. `LocalGameSimulation` (and subclasses `TryoutSimulation`, `AIBattleSimulation`, `StoryBattleSimulation`, `TournamentAISimulation`, `RoyaleAISimulation`) handle the full game loop at ~60 Hz entirely in-process.
- **Firebase Firestore** — stores `beyblade_stats`, `arenas`, `special_moves`, `combos`, `gimmick_defs`, `mechanic_defs`, and all config/RPG collections. Read on login via `configCache` + localStorage.
- **PixiJS WebGL** — client renders using PixiJS 8. 5-layer stack: arena → features → beyblades → particles → HUD. Render scale is vmin-proportional (`getPxPerCm()` / `PX_PER_CM_BASE`) — same world content visible on all screen sizes.
- **Vite + React Router v6** — client-side routing only. No SSR.
- **Config cache** — `client/src/lib/configCache.ts` preloads all Firestore config once on login, stores in Zustand + localStorage (version-invalidated). Game pages call `configCache.getArena(id)` instead of direct Firestore reads.
- **No multiplayer** — All room types (`tryout`, `pvai`, `story-battle`, `tournament-ai`, `royale-ai`) run locally. `isLocalRoom()` always returns `true`.

## Game Mode Types

```typescript
type RoomType =
  | 'tryout'        // Solo practice, no opponents
  | 'pvai'          // 1 vs 1 against AI
  | 'story-battle'  // Story mode scripted AI battle
  | 'tournament-ai' // Single-player AI bracket tournament
  | 'royale-ai';    // 1 human vs 7 AI, last bey standing
```

All modes use local simulation. `GameRoomPage` routes config to the matching simulation class.

## Game Status Flow

```
waiting → warmup (3s) → launching (5s) → in-progress → finished → [warmup again | series-finished]
```

- **warmup** — 3-2-1 countdown (`Countdown` component).
- **launching** — 5-second launch QTE. Player sets tilt (A/D), position (W/S), charges power (Space hold). Local sim manages `launchTimer`.
- **in-progress** — physics running. AI players run `AIController` each tick.
- **finished** / **series-finished** — match/series over.

### Launch QTE Details
- `launchTilt` (−45°→+45°), `launchPosition` (0–1), `launchPower` (0–150%) — set by `useLaunchInput`.
- `.launchReady = true` when player releases Space after charging.
- `.launchFailed = true` if timer expired without launching — beyblade eliminated before physics starts.
- AI players auto-launch at ~1.5s with randomised params (90–120% power).
- TryoutMode: timer expiry gives 50% grace power instead of elimination.
- `startMatchFromLaunch()` applies params: `bey.spin = maxSpin × (power/100)`, spawn radius scaled by position, `beyTiltAngle = |launchTilt|`.

## Series Format (BO1 / BO3 / BO5)

All modes (except tryout) support configurable series format via `config.bestOf` (1 | 3 | 5).

- `targetWins = ceil(bestOf / 2)` — first to reach this many game wins takes the series.
- `currentGame` — current game number within the series.
- On game end: if series not over, local sim calls `resetForNextGame()` and resumes at warmup.
- On series end: `status = "series-finished"`.

## Firebase Collections

### Core Game Data

| Collection | Purpose |
|-----------|---------|
| `beyblade_stats` | Beyblade configurations. Optional `specialMoveId` and `comboIds[]` (max 3). |
| `arenas` | Arena configurations (shape, theme, obstacles, spin zones, bumps, gravity wells, switches). |
| `matches` | Match results (includes `seriesFormat`, `seriesScore`, `gameResults[]`). |
| `player_stats` | Per-player win/loss/damage stats. |
| `users` | User profiles and roles (`user` / `admin`). |
| `settings` | Game-wide config (single doc: `settings/game`). |
| `combos` | Combo registry — id, sequence (3 keys), cost (0/15/25/35), type, windowMs, cooldownMs. |
| `special_moves` | Special move registry (4 physics-based moves). |
| `ai_battles` | Preset AI battle configs (medium/hard/hell quick-launch entries). |

### Asset Libraries

| Collection | Purpose |
|-----------|---------|
| `arena_theme_assets` | Background textures per theme. Tags include `switch`. |
| `obstacle_assets` | Obstacle sprites. Tags include `switch`, `bump`, `spin-zone`, `gravity-well`. |
| `turret_assets` | Turret and projectile sprites. |
| `water_body_assets` | Water surface textures. |
| `portal_assets` | Portal sprites. |
| `sound_assets` | Sound effects and music. |
| `bitbeast_assets` | BitBeast sprite assets. |
| `particle_presets` | 7 PixiJS particle emitter presets. |
| `animation_presets` | 7 animation presets with keyframes. |

### Catalog / Config Collections

| Collection | Purpose |
|-----------|---------|
| `element_type_configs` | 12 element types with type interaction matrix. |
| `turret_attack_types` | 15 turret attack types + 8 fire patterns. |
| `arena_feature_configs` | 13 hazard types + 7 effect zones + 10 particles + 6 env presets. |
| `bey_link_configs` | BeyLink + ArenaLink type catalog (9 categories, 43 entries). |
| `combo_effects` | 13 ComboEffectDef presets. |
| `round_modifiers` | 17 round modifiers (physics, combat, rules, chaos). |
| `behavior_defs` | 50+ BehaviorDef keyword library entries. |
| `mechanic_defs` | 31 MechanicRegistry handler definitions. |
| `gimmick_defs` | 27 gimmick recipes (behaviorRefs → MechanicInstance[]). |
| `geometry_defs` | 16 standard geometry primitives. |
| `stat_defs` | ~35 typed stat definitions (beyblade/arena/match/modifier). |
| `special_interaction_defs` | Special interaction/collision QTE definitions. |
| `collision_qte_events` | Collision QTE event configs. |
| `special_clash_events` | Special clash event configs. |

### Preset Definition Collections

| Collection | Purpose |
|-----------|---------|
| `tip_shape_defs` | 16 tip shape presets (flat, sharp, rubber, bearing, etc.). |
| `core_gimmick_defs` | 12 core gimmick modes (mode change, dual spin, spring launch, etc.). |
| `attack_type_defs` | 8 attack types (smash, upper, burst, absorb, etc.). |
| `arena_theme_defs` | 12 arena visual themes (volcano, ice, space, neon, etc.). |
| `arena_shape_defs` | 10 arena boundary shapes (circle, hexagon, star, stadium, etc.). |
| `bowl_profile_defs` | 8 bowl wall-angle profiles (flat through extreme 75°). |
| `trigger_type_defs` | 12 stat modifier trigger conditions. |
| `stat_event_defs` | 15 stat tracking events. |
| `tilt_preset_defs` | 5 arena tilt angle presets. |
| `difficulty_defs` | 4 difficulty levels with colors. |
| `feature_animation_defs` | 10 feature animation presets. |
| `portal_color_defs` | 4 portal color presets. |
| `bey_type_defs` | 5 beyblade type classifications. |
| `liquid_type_defs` | 8 liquid/water body types with effects. |
| `hazard_type_defs` | 20 element hazard type suggestions. |
| `element_stat_defs` | 10 element stat modifier suggestions. |
| `arena_template_defs` | 5 full arena configuration templates. |

### Universal Preset Library

| Collection | Purpose |
|-----------|---------|
| `arena_presets` | Full arena preset cards. |
| `bey_presets` | 8 beyblade archetype/generation presets. |
| `combo_presets` | 8 combo preset cards mirroring the combo registry. |
| `mechanic_presets` | 11 mechanic preset configs (friction/collision/deflection/gimmick). |
| `gimmick_presets` | 27 gimmick preset cards — one per gimmick_def. |
| `special_move_presets` | 6 special move preset cards. |
| `theme_presets` | Arena theme presets. |
| `obstacle_presets` | Obstacle configuration presets. |
| `feature_group_presets` | Feature group presets. |

### RPG Story Mode

| Collection | Purpose |
|-----------|---------|
| `rpg_regions` | World regions. |
| `rpg_maps` | Map definitions. |
| `rpg_npcs` | NPC definitions. |
| `rpg_dialogues` | Dialogue trees. |
| `rpg_quests` | Quest definitions. |
| `rpg_story_events` | Story event triggers. |
| `rpg_cutscenes` | Cutscene sequences. |
| `rpg_items` | Item definitions. |
| `rpg_badges` | Badge/achievement definitions. |
| `rpg_arcs` | Story arc definitions. |
| `rpg_routes` | Route definitions. |
| `rpg_config` | RPG system configuration. |
| `rpg_saves` | Player save data. |
| `rpg_map_type_defs` | Map type definitions. |
| `rpg_npc_type_defs` | NPC type definitions. |
| `rpg_trigger_mode_defs` | 3 RPG event trigger modes (enter, interact, step). |
| `rpg_facing_defs` | 4 RPG character facing directions (up, down, left, right). |

### AI System

| Collection | Purpose |
|-----------|---------|
| `ai_character_profiles` | 12 blader character AI profiles (Tyson, Kai, Gingka, Valt, etc.). |
| `ai_bey_personalities` | 13 bey personality profiles (Dragoon, Dranzer, Pegasus, Valtryek, etc.). |
| `ai_difficulty_profiles` | 4 AI difficulty tiers (easy/medium/hard/hell). |

### Story Mode

| Collection | Purpose |
|-----------|---------|
| `seasons` | Season progression data. |
| `episodes` | Episode definitions (8 episodes across 2 seasons). |
| `player_progress` | Player story progression tracking. |
| `match_replays` | Replay system data. |

All asset libraries accept **PNG / JPG / GIF / WebP**.

## Physics Coordinates

- Arena dimensions stored in pixels in Firestore (e.g., `width: 1080`, `height: 1080`)
- 1 cm = 24px at standard 1080p resolution (`PX_PER_CM_BASE = 24`, `REFERENCE_VMIN = 1080`)
- Beyblade `radius` stored in cm; `createBeyblade()` converts to px: `radius * 24`
- Arena `arenaPixelRadius = Math.min(width, height) * 0.45`
- **Physics always uses `PX_PER_CM_BASE = 24` (fixed)** — `cmToPhysics` / `physicsToCm` never change; deterministic replays depend on this.
- **Client render scale is vmin-proportional** — `recomputePxPerCm(screenW, screenH)` returns `PX_PER_CM_BASE × (min(screenW, screenH) / REFERENCE_VMIN)`. At 1080p → 24 px/cm; at 4K → 48 px/cm; at 720p → 16 px/cm. The renderer applies this via `viewportScale = getPxPerCm() / PX_PER_CM_BASE` in `worldRoot.scale`.
- **`zToScreenOffset(z_cm, tiltAngle_deg)`** (exported from `client/src/constants/units.ts`) — returns the screen-Y shift in world-px for an element at `z_cm` above the arena floor. Apply to sprite `.y` inside `arenaTiltInner`.

## Viewport Responsive Scaling

The client UI and game canvas scale with `vmin = min(viewport width, viewport height)`.

**Global constraint:** `html { overflow: hidden; }` is set in `globals.css` (intentional — game canvas pages use `position: fixed`). Every player-facing page shell must use `height: 100dvh; overflow: hidden` — NOT `min-height`.

### Layers (all implemented)

| Layer | What | How |
|-------|------|-----|
| 0 — Canvas physics render | `recomputePxPerCm(w, h)` vmin-proportional | Called in `PixiRenderer.ts` on init, `setupArena`, and `resize()` |
| 1 — Root font | `clamp(11px, 1.5vmin, 18px)` | `globals.css` — all Tailwind rem utilities auto-scale |
| 2 — SVG arcs | `SpinArcBar` uses `viewBox` + em container | SVG geometry stays in user-units; container is `size/14 em` |
| 3 — HUD inline px | `PlayerStrip`, `OpponentStrip`, `GameRoomPage` HudBar | em and `clamp()` replacements |
| 4 — GameShell controllers | `useVmin()` hook; joystick/button sizes proportional | `joystickSize = clamp(56, vmin*0.1, 110)` etc. |
| 5 — Orientation toggle | `RotateBtn` in GameShell; `forceOrientation` localStorage state | `toggleOrientation()` flips portrait↔landscape; persists across refreshes |
| 6 — All player-facing pages | `height: 100dvh; overflow: hidden` shell on every page; `clamp()` fonts | Game-like viewport fit — no document scroll ever |

### Page patterns

| Pattern | Shell | When to use |
|---------|-------|-------------|
| **A — Focus** | `height:100dvh; overflow:hidden` + all fixed px → `clamp()` | Centered single-task pages: Login, Register, Home |
| **B — Listing** | `height:100dvh; overflow:hidden; display:flex; flex-direction:column` shell + inner `flex:1; min-height:0; overflow-y:auto; data-testid="scroll-body"` | Pages with potentially long content: Profile, MyBeys, Settings |
| **C — Carousel** | `height:100dvh; overflow:hidden` shell + `CardCarousel` with `min(440px, calc(100dvh - 15vmin))` height | Multi-card navigation: BattleModeCards, StoryModeCards, GameModeSelect |
| **E — Rem-only** | Just `min-h-screen` → `h-dvh overflow-hidden` | All-Tailwind-rem pages: NotFound |

### Key rules when editing player-facing UI
- **Never use `min-height: 100dvh` or `min-h-screen`** on player-facing page shells — use `height: 100dvh; overflow: hidden` (`h-dvh overflow-hidden`).
- **Never use bare `px` values** for font sizes, widths, or heights in player-facing pages. Use `em`, `rem`, `clamp()`, or `vmin`.
- **Fixed px font sizes** must become `clamp(minPx, Xvmin, maxPx)`. Tailwind rem classes (`text-sm`, `text-xl`, etc.) already scale via the root font.
- **Max-widths** must be `min(Npx, 92vw)` — never a bare `max-w-[Npx]` or `maxWidth: N`.
- **Listing pages** need `data-testid="scroll-body"` on the inner scroll container for E2E tests.
- **Multi-row grids** must use `CardCarousel` instead — cards need `role="button"`, `tabIndex={0}`, `aria-label={card.title}`.
- **Admin pages** (`client/src/pages/admin/`) are exempt — they use fixed px and that is intentional.

### Game canvas pages (fully exempt from all of the above)
`GameRoomPage`, `ReplayViewerPage` — these use `position: fixed` + PixiJS canvas.

### Do NOT change
- `PX_PER_CM_BASE = 24` — physics reference constant, never touch.
- `cmToPhysics` / `physicsToCm` — always fixed; deterministic replays depend on these.
- `PixiRenderer` `resizeTo: container` canvas sizing — already correct.
- `GameShell` outer container formula `min(96vw, calc(96vh * 1.72))` — already correct.

## Beyblade Type Distribution

360 total points, max 150 per category:

```typescript
damageMultiplier = 1.0 + attack * 0.007   // 1.0x–2.05x
damageReduction  = 1 - defense * 0.003     // 1.0x–0.55x
spinDecayRate    = 8 * (1 - stamina * 0.001) // 8–6.8/s
maxSpin          = 2000 * (1 + stamina * 0.0008)
```

## Gyroscopic Physics

Beyblades at < 40% spin stability enter nutation wobble (seeded PRNG, not `Math.random()`):

```typescript
const stability = beyblade.spin / beyblade.maxSpin;
if (stability < 0.4) {
  applyForce(id, (this.rand() - 0.5) * wobble, (this.rand() - 0.5) * wobble);
}
```

PRNG is seeded from `matchId` via `client/src/game/utils/prng.ts` (`createPRNG`). Same seed always produces the same sequence — enables deterministic replays.

## Environment Variables

### Client (client/.env)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Special Moves (Physics-Based)

| Type | Move | Behavior |
|------|------|---------|
| Attack | Stampede Rush | Linear force burst in facing direction + spin boost |
| Defense | Gyro Anchor | Zero linear velocity, maximize spin, 1.5s invulnerability |
| Stamina | Spin Recovery | Orbital force (circular path), gradual spin recovery |
| Balanced | Tactical Burst | Directional burst + 20% spin recovery |

Special moves are **optional** on a beyblade — set `BeybladeStats.specialMoveId` (e.g. `"stampede_rush"`). If empty, the in-match Special HUD panel is hidden. Specials cost ~100 power.

## Combos (3-button registry)

Each combo:

- **Exactly 3 keys** (`moveLeft / moveRight / moveUp / moveDown / attack / defense / dodge / jump`).
- **Cost** is `0 / 15 / 25 / 35`. Power deducted on activation.
- **Type restriction** — `universal` or beyblade-type-specific.
- **Effect ceiling** — `damageMultiplier ≤ 1.5`, `lockMs ≤ 300`, no invulnerability, no AoE, no full spin recovery (those are special-move-only).
- **Detection** — `client/src/game/utils/comboSystem.ts::detectCombo` enforces sliding-3 window, attached check, power threshold, and per-combo cooldown.

Beyblades opt in via `BeybladeStats.comboIds` (max 3). Combos are **optional** — empty list hides the attached-combos HUD strip.

| ID | Sequence | Cost | Type |
|----|----------|------|------|
| `quick-dash-l` | ←←J | 0 | universal |
| `quick-dash-r` | →→J | 0 | universal |
| `guard-tap` | KKK | 0 | universal |
| `feint` | ←→K | 0 | universal |
| `riposte` | KKJ | 15 | defense |
| `pivot-strike` | ←→J | 15 | balanced |
| `power-thrust` | JJJ | 25 | universal |
| `spin-leech-jab` | ←J→ | 35 | stamina |

## AI Difficulty (Medium / Hard / Hell)

`AIDifficulty = "medium" | "hard" | "hell"`. Legacy `"easy"` reads collapse to `"medium"` defensively. `client/src/game/ai/AIController.ts`:

- **Medium** — chases nearest opponent, attacks within 200 px, uses defense when low-spin + close, fires special at < 40 % spin.
- **Hard** — 5-tick prediction, circle-strafe at close range, dodge on closing speed > 3, defense when cornered.
- **Hell** — 10-tick prediction, ring-out-aware approach, dodge threshold 2, fires special the moment it's chargeable, periodic 3-key combo emission (~every 2 s) aligned with strike direction.

## Loading Progress

`<LoadingProgress />` overlays the game canvas during initial setup. Steps:

1. `loading-arena-assets`
2. `loading-beyblade-assets`
3. `loading-audio-assets`
4. `warmup-ready`

After `warmup-ready`, the `Countdown` + `LaunchPhase` components take over:
- `Countdown` shows 3-2-1 during `warmup`, then flashes "Let It Rip!" when status becomes `launching`.
- `LaunchPhase` overlay shows tilt gauge, position slider, and power bar during `launching`.
- Both hide once `in-progress` begins.

## Arena Features

Types are in `client/src/types/arenaConfigNew.ts`:

- `SpinZoneConfig` — circular zone that imparts cw/ccw orbit or spin to beyblades inside. `applyTo: "linear" | "spin" | "both"`.
- `BumpConfig` — small raised feature; vertical pop + lateral recoil on contact.
- `GravityHoleConfig` — gained `controlledBySwitchId` + `selfRotation`.
- `ObstacleConfig` / `TriggerZoneConfig` — gained `controlledBySwitchId` + `selfRotation`.

**Switch wiring** — any feature with `controlledBySwitchId` is only active when that switch is on. `SwitchConfig.targets[]` drives the switch graph (toggle / set-on / set-off / pulse / chain to next switch).

**Self-rotation** — any feature can spin in place (`selfRotation: { speedDegPerSec, direction }`).

Top-level fields on `ArenaConfig`:
```ts
spinZones?: SpinZoneConfig[];
bumps?: BumpConfig[];
```

## Arena Tilt (Z-axis orientation)

> **Tilt ≠ Slope.** `bowlProfile`/`wallAngle` controls bowl wall curvature. **Tilt** rotates the entire arena plane around a horizontal axis.

Four fields on `ArenaConfig`:

```ts
tiltAngle?:     number;   // 0–360° (0=flat, 90=wall-ride, 180=inverted/Zero-G)
tiltDirection?: number;   // 0–360° azimuth of the downhill side
autoTilt?:      boolean;  // tilt direction rotates over time
tiltSpeed?:     number;   // °/s for tilt-direction rotation (default 10)
```

**Physics** — applies a lateral force every tick: `sin(tiltAngle) × 0.04 × mass` in the `tiltDirection` vector. `advanceArenaTilt()` increments `tiltDirection` each tick when `autoTilt` is on.

**Renderer** (`PixiRenderer.ts`):
- `arenaTiltOuter` — `rotation = tiltDirection`
- `arenaTiltScale` — `scaleX = cos(tiltAngle)` (foreshortening)
- `arenaTiltInner` — `rotation = −tiltDirection`
- All world layers sit inside `arenaTiltInner`. HUD stays screen-space.

## Client File Layout

```
client/src/
├── game/
│   ├── renderer/PixiRenderer.ts       WebGL renderer (5 layers)
│   ├── simulation/                    Local game simulations (TryoutSimulation, AIBattleSimulation, etc.)
│   ├── ai/AIController.ts             Client-side AI controller
│   ├── hooks/useGameInput.ts          Keyboard → bitmask input
│   ├── hooks/useLocalSimulation.ts    Local sim lifecycle hook
│   └── hooks/usePixiRenderer.ts       PixiJS lifecycle
├── pages/
│   ├── GameModeLandingPage.tsx        Public landing page
│   ├── GameModeSelectPage.tsx         Mode selection
│   ├── GameHubPage.tsx                Hub (play + story + profile tabs)
│   ├── BattleModeCardsPage.tsx        Battle mode card carousel (Tryout + vs-AI only)
│   ├── StoryModeCardsPage.tsx         Story mode card carousel
│   ├── GameRoomPage.tsx               Unified game room (local sim only)
│   ├── ProfilePage.tsx                Player profile
│   ├── MyBeysPage.tsx                 Beyblade collection
│   ├── SettingsPage.tsx               User settings
│   └── admin/
│       └── AdminPlaceholderPage.tsx   Placeholder (new admin system TBD)
├── components/
│   ├── LoadingProgress.tsx            Asset loading stepper bar
│   ├── setup/
│   │   └── EntityPicker.tsx           Searchable name dropdown + tabbed preview pane
│   └── game/
│       ├── ComboHUD.tsx               Attached-combo strip + fired-combo history
│       ├── SpecialMoveHUD.tsx         Special move power/cooldown ring
│       └── CameraControls.tsx         Player zoom buttons (+ / 0 / −)
├── constants/
│   ├── combos.ts                      Client-side combo registry mirror (for HUD/picker)
│   └── gameModeScenarios.ts           Per-mode default configs (beybladeId, arenaId, aiCount, etc.)
├── contexts/
│   ├── AuthContext.tsx                Firebase Auth
│   └── GameContext.tsx                Game settings state
├── lib/
│   ├── firebase.ts                    Firebase Web SDK client + collection constants
│   └── configCache.ts                 Two-tier config preload (Firestore → Zustand + localStorage)
├── stores/gameStore.tsx               Zustand store
└── types/
    ├── game.ts                        Core game types (LocalGameState, BeybladeState, etc.)
    └── gameRoom.ts                    RoomType + GameRoomConfig
```

## Seed Scripts

All seeders live under `scripts/` and are registered in `seed-all.js`. Idempotent — safe to re-run.

| Script | Writes to | Notes |
|--------|-----------|-------|
| `npm run seed:admin` | `users` | Admin user + Firebase Auth custom claim. |
| `npm run seed:settings` | `settings` | `settings/game` — enables AI, clears maintenance flag. |
| `npm run seed:beyblades` | `beyblade_stats` | ~20 beys grouped by generation (Bakuten/Plastic, MFB, Burst, X). |
| `npm run seed:arenas` | `arenas` | 20 arena configs. |
| `npm run seed:special-moves` | `special_moves` | 4 special moves (Stampede Rush, Gyro Anchor, Spin Recovery, Tactical Burst). |
| `npm run seed:combos` | `combos` | 8 combos (4 free + 4 cost-tiered). |
| `npm run seed:ai-battles` | `ai_battles` | 3 AI battle quick-launch presets (medium / hard / hell). |
| `npm run seed:round-modifiers` | `round_modifiers` | 17 round modifiers (physics, combat, rules, chaos). |
| `npm run seed:behavior-defs` | `behavior_defs` | 50+ BehaviorDef keyword library entries. |
| `npm run seed:combo-effects` | `combo_effects` | 13 ComboEffectDef presets. |
| `npm run seed:mechanics` | `mechanic_defs` | 31 mechanic handler docs. |
| `npm run seed:gimmicks` | `gimmick_defs` | 27 gimmick recipes. |
| `npm run seed:particle-presets` | `particle_presets` | 7 PixiJS particle emitter presets. |
| `npm run seed:anim-presets` | `animation_presets` | 7 animation presets with keyframes. |
| `npm run seed:element-types` | `element_type_configs` | 12 default element types with type matrix. |
| `npm run seed:turret-attack-types` | `turret_attack_types` | 15 turret attack types + 8 fire patterns. |
| `npm run seed:arena-feature-configs` | `arena_feature_configs` | 13 hazard types + 7 effect zones + 10 particle types + 6 env presets. |
| `npm run seed:bey-link-configs` | `bey_link_configs` | BeyLink + ArenaLink type catalog (9 categories, 43 entries). |
| `npm run seed:geometry` | `geometry_defs` | 16 standard geometry primitives. |
| `npm run seed:stat-defs` | `stat_defs` | ~35 typed stat definitions. |
| `npm run seed:tip-shapes` | `tip_shape_defs` | 16 tip shape presets. |
| `npm run seed:core-gimmicks` | `core_gimmick_defs` | 12 core gimmick types. |
| `npm run seed:attack-type-defs` | `attack_type_defs` | 8 attack types for contact points. |
| `npm run seed:arena-theme-defs` | `arena_theme_defs` | 12 arena visual themes. |
| `npm run seed:arena-shape-defs` | `arena_shape_defs` | 10 arena boundary shapes. |
| `npm run seed:bowl-profile-defs` | `bowl_profile_defs` | 8 bowl wall-angle profiles. |
| `npm run seed:trigger-type-defs` | `trigger_type_defs` | 12 stat modifier trigger conditions. |
| `npm run seed:stat-event-defs` | `stat_event_defs` | 15 stat tracking events. |
| `npm run seed:tilt-presets` | `tilt_preset_defs` | 5 arena tilt angle presets. |
| `npm run seed:difficulty-defs` | `difficulty_defs` | 4 difficulty levels with colors. |
| `npm run seed:feature-animation-defs` | `feature_animation_defs` | 10 feature animation presets. |
| `npm run seed:portal-color-defs` | `portal_color_defs` | 4 portal color presets. |
| `npm run seed:bey-type-defs` | `bey_type_defs` | 5 beyblade type classifications. |
| `npm run seed:liquid-type-defs` | `liquid_type_defs` | 8 liquid/water body type presets. |
| `npm run seed:hazard-type-defs` | `hazard_type_defs` | 20 element hazard type suggestions. |
| `npm run seed:element-stat-defs` | `element_stat_defs` | 10 element stat modifier suggestions. |
| `npm run seed:arena-template-defs` | `arena_template_defs` | 5 full arena configuration templates. |
| `npm run seed:rpg-trigger-mode-defs` | `rpg_trigger_mode_defs` | 3 RPG event trigger modes. |
| `npm run seed:rpg-facing-defs` | `rpg_facing_defs` | 4 RPG character facing directions. |
| `npm run seed:special-move-presets` | `special_move_presets` | 6 special move preset cards. |
| `npm run seed:combo-presets` | `combo_presets` | 8 combo preset cards. |
| `npm run seed:mechanic-presets` | `mechanic_presets` | 11 mechanic preset configs. |
| `npm run seed:gimmick-presets` | `gimmick_presets` | 27 gimmick preset cards. |
| `npm run seed:bey-presets` | `bey_presets` | 8 beyblade archetype/generation presets. |
| `npm run seed:ai-character-profiles` | `ai_character_profiles` | 12 blader character AI profiles. |
| `npm run seed:ai-bey-personalities` | `ai_bey_personalities` | 13 bey personality profiles. |
| `npm run seed:ai-difficulty-profiles` | `ai_difficulty_profiles` | 4 AI difficulty tiers. |
| `npm run seed:story-mode` | `seasons`, `episodes` | 2 seasons + 8 episodes for story mode progression. |
| `npm run seed:all` | All of the above | Runs all in order; safe to use as a first-time bootstrap. |

## Learning Folder (Deferred)

A real Beyblade learning folder will be provided later. When received:
- Update `client/src/constants/beybladePhysicsConstants.ts` with real RPM/mass/radius data
- Validate type matchup multipliers against official Beyblade type triangle
- Improve special move names/behaviors to match series lore
- Adjust arena sizing to real stadium scale (real B-200: ~40cm diameter)

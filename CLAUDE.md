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
  - New types added to `shared/types/` that reference sibling files (e.g. `./beybladeConstants`) must have those files present in `shared/types/` — copy from `client/src/types/` if needed.
  - Adding optional geometry fields (radius, length, width) to server-synced types when the renderer starts reading them.
  - Missing imports when a new helper or class is used in a page file.
  - `Record<string, unknown>` property access used in JSX must be cast with `!!` or `as` before use as a `ReactNode` condition.

---

## Project Structure

Two separate runnable systems in one repo:

```
src/        → Colyseus game server (TypeScript, Node.js, port 2567)
client/     → Vite + React SPA (TypeScript, port 3001 dev)
```

## Development

```bash
npm run dev:server   # starts Colyseus (ts-node src/index.ts)
npm run dev:client   # starts Vite (cd client && npm run dev)
```

Both run on separate processes. The client proxies `/colyseus` → `http://localhost:2567`.

Client is deployed on **Vercel** (not Firebase Hosting — `firebase.json` has no hosting block).

## Key Architecture Decisions

- **Server-authoritative physics** — Matter.js runs on the Colyseus server. The client only sends a `uint16` bitmask input and receives state updates.
- **Colyseus schema auto-sync** — `GameState`, `Beyblade`, `ArenaState` are all `@Schema` classes. State propagates at 60Hz automatically.
- **Firebase Firestore** — stores beyblade_stats, arenas, matches, player_stats, tournaments, and all asset collections.
- **PixiJS WebGL** — client renders using PixiJS 8. 5-layer stack: arena → features → beyblades → particles → HUD.
- **Vite + React Router v6** — client-side routing only. No SSR.
- **2D + 2.5D engines only; 2.5D is the 3D layer** — There is no true 3D physics engine (no Cannon.js, Rapier, or three.js). The 2.5D engine (`PartPhysics.ts` + `PartSystemManager.ts`) is the game's depth layer and serves the role that 3D would in another engine:
  - **Shape makers** — Fourier-series profiles and arc-segment contact points describe each part's 3D silhouette as a 2D cross-section; `renderRadius()` warps the sprite outline accordingly.
  - **Perspective warps** — PixiJS renders through a three-container tilt stack (`arenaTiltOuter → arenaTiltScale → arenaTiltInner`) that projects the world onto screen as if the arena plane is tilted in 3D space.
  - **Z-layer physics** — `beyTiltAngle`, `effectiveGravity`, `ClimbingPhysics.ts`, and wall/ceiling adhesion provide height, tilt, and vertical-surface behaviour without a true z-axis.
  - Any mechanic that would require "3D" in another game (pillar hit volumes, vertical tilt, surface adhesion, part silhouette collision) is expressed through the 2.5D shape and warp systems.
- **TournamentScheduler** — singleton started in `src/index.ts`, polls Firestore every 30s and opens Colyseus rooms 65s before scheduled bracket match times.

## Server Room Types

| Room | File | Max Clients | Purpose |
|------|------|-------------|---------|
| `tryout_room` | `src/rooms/TryoutRoom.ts` | 1 | Solo practice (always BO1) |
| `battle_room` | `src/rooms/BattleRoom.ts` | 12 | Live PVP 2–4 players + up to 8 spectators |
| `ai_battle_room` | `src/rooms/AIBattleRoom.ts` | 9 | 1 human vs AI + up to 8 spectators |
| `tournament_battle_room` | `src/rooms/TournamentBattleRoom.ts` | 10 | 2 tournament players + up to 8 spectators |

Register new rooms in `src/index.ts` with `gameServer.define("room_name", RoomClass)`.

Max 20 rooms active at once — enforced by `src/utils/roomCounter.ts` (`tryReserveRoom()` / `releaseRoom()`).

## CRITICAL: No async in game loop

Arena config and beyblade data are loaded **once in `onCreate()`** and cached. The `tick(deltaTime)` method is **synchronous** — never add `await` or Firebase calls inside it.

```typescript
// WRONG — fires Firestore 60x/second
this.setSimulationInterval(async () => {
  const arena = await loadArena(id);  // ← DO NOT DO THIS
});

// CORRECT — cached at onCreate
this.setSimulationInterval((dt) => {
  this.tick(dt);  // synchronous, uses this.arenaCache
}, 1000 / 60);
```

## Input Encoding

Client sends a `uint16` bitmask (2 bytes) instead of a msgpack object. Decoding is in all rooms via `decodeBitmask(mask)`.

```
bit 0 = moveLeft    bit 5 = defense
bit 1 = moveRight   bit 6 = dodge
bit 2 = moveUp      bit 7 = jump
bit 3 = moveDown    bit 8 = chargeHeld
bit 4 = attack      bit 9 = specialTap
```

Server accepts both encoded `number` and legacy `Record<string,boolean>` object (backward compat).

## Spectator Support

All room types support spectators. Join with `{ spectate: true }` in options.

- Spectators receive full state sync but have no `Beyblade` entity and no physics body.
- `state.spectatorCount` increments/decrements on spectator join/leave.
- If all human players leave, the room disposes immediately (spectators are kicked).
- Client: `?spectate=true` query param on any battle URL triggers spectator mode.
- **Follow-player camera**: spectators click a player in the right-side list to lock the camera on that beyblade. The client sends `spectator:follow { targetBeybladeId }`; rooms store this in `spectatorFollowTargets: Map<sessionId, beybladeId>` (informational — camera is client-side). Zoom buttons (`+ / 0 / −`) and keyboard shortcuts are exposed to spectators via `CameraControls`.

## Game Status Flow

```
waiting → warmup (3s) → launching (5s) → in-progress (180s) → finished → [warmup again | series-finished]
```

- **warmup** — 3-2-1 countdown displayed on client (`Countdown` component, `timer` counts down).
- **launching** — 5-second launch QTE. Each player sets tilt (A/D), position (W/S), charges power (Space hold). Server syncs `launchTimer`. Client shows `LaunchPhase` overlay.
- **in-progress** — physics running at 60 Hz. `timer` is match elapsed (180s cap for tournaments).
- **finished** / **series-finished** — match/series over.

### Launch QTE Details
- `state.launchTimer` — seconds remaining in the launching phase (server-synced).
- `Beyblade.launchTilt` (−45°→+45°), `.launchPosition` (0–1), `.launchPower` (0–150%) — synced from client via `"launch-input"` messages.
- `.launchReady = true` when player releases Space after charging.
- `.launchFailed = true` if timer expired without launching — beyblade is eliminated before physics starts.
- AI players auto-launch at ~1.5s with randomised params (90–120% power).
- TryoutRoom: timer expiry gives 50% grace power instead of elimination.
- `startMatchFromLaunch()` applies params: `bey.spin = maxSpin × (power/100)`, spawn radius scaled by position, `beyTiltAngle = |launchTilt|`.

## Series Format (BO1 / BO3 / BO5)

All room types (except TryoutRoom) support configurable series format via `options.bestOf` (1 | 3 | 5).

- `state.targetWins = ceil(bestOf / 2)` — first to reach this many game wins takes the series.
- `state.currentGame` — current game number within the series.
- `state.seriesWins` — `MapSchema<uint8>` keyed by userId.
- On game end: if series not over, room calls `resetForNextGame()` (sync — no Firestore reads) and resumes at warmup.
- On series end: `state.status = "series-finished"`, room disconnects after 5s.

## Tournament System

### Firestore Collections

| Collection | Purpose |
|-----------|---------|
| `tournaments` | Tournament metadata (type, status, schedule, restrictions) |
| `tournament_participants` | One doc per participant per tournament (userId, seed, beybladeId). `status` includes `"quit"`. |
| `tournament_brackets` | One doc per match slot. `colyseusRoomId` populated 60s before match. `readyState: Record<userId, boolean>` drives both-ready early-start. `isDraw` set on a tied room-cap finish. |

### Match Pacing

- **3-min room cap** — `TournamentBattleRoom.endSeriesOnCap()` fires at 180s elapsed (wall-clock from first warmup→in-progress transition). Whoever leads `seriesWins` wins; on tie, `isSeriesDraw = true` and `state.winner = ""`. Series ends regardless of BO size.
- **5-min between-match gap** — `BracketGenerator.advanceWinnerToNextRound()` advances `scheduledTime` to `max(existing, now + 5 min)` when seating a winner into the next bracket slot.
- **Both-ready early-start** — `getReadyPendingMatches()` returns pending matches where `readyState[p1Id]` and `readyState[p2Id]` are both `true`. `TournamentScheduler.poll()` merges them with the regular look-ahead queue and opens immediately.
- **Quit walkover** — `TournamentScheduler.processQuitWalkovers()` sweeps participants with `status === "quit"` and advances opponents via `advanceRound` with no winnerId for matches where both sides quit.

### Scheduler Flow

1. `TournamentScheduler.poll()` runs every 30s.
2. Walkover sweep: any participant whose `status === "quit"` triggers `advanceRound(opponent)` on their pending matches.
3. Loads two pools: `getUpcomingPendingMatches(LOOK_AHEAD_MS=65s)` and `getReadyPendingMatches()` (both-ready early-start). Merges + de-dupes.
4. For each queued match: resolves beybladeIds (auto-picks if missing or blacklisted via `autoPickBeyblade()`).
5. Registers a callback via `TournamentBattleRoom.pendingMatchCallbacks.set(matchId, cb)`.
6. Calls `matchMaker.createRoom("tournament_battle_room", options)` — returns `RoomListingData`.
7. Room's `onCreate` picks up the callback from the static map, deletes the entry.
8. Writes `colyseusRoomId` to the bracket doc — clients on `TournamentLobbyPage` auto-navigate.

### Leaderboard Scoring

`updatePlayerStats(userId, updates)` atomically increments numeric fields (via `admin.firestore.FieldValue.increment`) for `matchesPlayed`, `wins`, `losses`, `draws`, `totalDamageDealt`, `totalCollisions`, `tournamentPoints`. Non-numeric fields merge normally. On `TournamentBattleRoom` series end:

- Winner: `tournamentPoints += 2`, `wins += 1`, `matchesPlayed += 1`.
- Loser:  `matchesPlayed += 1` (no points/wins).
- Draw (room-cap tie): both players get `tournamentPoints += 1`, `matchesPlayed += 1`.

`/leaderboard` defaults to the **Tournament** tab. Existing Wins / Win Rate / Damage / Matches tabs remain.

### Admin-side Tournament Pages

- `/admin/tournaments` — list, create, cancel
- `/admin/tournaments/create` — schedule, type, bestOf, restrictions
- `/admin/tournaments/:id` — bracket progress, manual advance, force-fill AI

### Player-facing Tournament Pages

- `/game/tournament` — browse active/upcoming tournaments
- `/game/tournament/:id` — wait lobby (Firestore `onSnapshot` only, no Colyseus until room opens)
- `/game/tournament/battle/:tournamentId/:matchId` — in-match page

## Firebase Collections

| Collection | Purpose |
|-----------|---------|
| `beyblade_stats` | Beyblade configurations. Optional `specialMoveId` and `comboIds[]` (max 3). |
| `arenas` | Arena configurations (shape, theme, obstacles, spin zones, bumps, gravity wells, switches). |
| `stadiums` | Stadium metadata and images |
| `matches` | Match results (includes `seriesFormat`, `seriesScore`, `gameResults[]`) |
| `player_stats` | Per-player win/loss/damage stats + `tournamentPoints` — **public read** for leaderboard |
| `users` | User profiles and roles (`user` / `admin`) |
| `tournaments` | Tournament docs. `aiDifficulty` is `"medium" \| "hard" \| "hell"`. |
| `tournament_participants` | Participant docs. `status` includes `"quit"`. |
| `tournament_brackets` | Bracket match docs. `readyState` drives both-ready early-start; `isDraw` set on tied room-cap finish. |
| `combos` | New combo registry — id, sequence (3 keys), cost (0/15/25/35), type, windowMs, cooldownMs. Seeded from `src/constants/combos.ts`. |
| `ai_battles` | Preset AI battle configs (medium/hard/hell quick-launch entries). |
| `arena_theme_assets` | Background textures per theme. Tags include `switch`. |
| `obstacle_assets` | Obstacle sprites. Tags include `switch`, `bump`, `spin-zone`, `gravity-well` (shared sprite library for the new feature family). |
| `turret_assets` | Turret and projectile sprites. Tags include `switch`. |
| `water_body_assets` | Water surface textures. Tags include `switch`. |
| `portal_assets` | Portal sprites. Tags include `switch`. |
| `sound_assets` | Sound effects and music |
| `settings` | Game-wide config (single doc: `settings/game`) |
| `beyblade_parts` | 2.5D part library (bit_beast, attack_ring, weight_disk, sub_part, tip, core, casing) |
| `beyblade_systems` | Assembled 2.5D beyblade configs (slot → partId mapping) |
| `mechanic_defs` | 31 MechanicRegistry handler definitions (id, name, category, description, params). Seeded by `seed-mechanics.js`. Admin: `/admin/mechanic-defs`. |
| `gimmick_defs` | 27 gimmick recipes (behaviorRefs → MechanicInstance[]). Expanded at match start by `gimmickExpander.ts`. Admin: `/admin/gimmick-defs`. |
| `tip_shape_defs` | Tip shape presets (id, label, description). Consumed by part editor TipFields; falls back to built-ins when empty. Admin: `/admin/tip-shape-defs`. |
| `core_gimmick_defs` | Core gimmick modes (id, label, description, hasPhysicsImpl). Consumed by CoreFields toggle buttons. Admin: `/admin/core-gimmick-defs`. |
| `attack_type_defs` | Attack type definitions for contact points (id, label, multiplier, color). Consumed by ContactPointEditor. Admin: `/admin/attack-type-defs`. |
| `arena_theme_defs` | Arena visual themes (id, label, color, description). Consumed by BasicsTab theme picker. Admin: `/admin/arena-theme-defs`. |
| `arena_shape_defs` | Arena boundary shapes (id, label, vertexCount, description). Consumed by BasicsTab shape picker. Admin: `/admin/arena-shape-defs`. |
| `bowl_profile_defs` | Bowl wall-angle presets (id, label, wallAngle 0–75°, description). Consumed by BasicsTab bowl picker. Admin: `/admin/bowl-profile-defs`. |
| `trigger_type_defs` | Stat modifier trigger conditions (id, label, description). Consumed by StatModifiersEditor. Admin: `/admin/trigger-type-defs`. |
| `stat_event_defs` | Stat tracking events (id, label, description). Consumed by StatModifiersEditor stat events. Admin: `/admin/stat-event-defs`. |
| `part_layer_defs` | Part layer types for contact point assignments (id, label, description). Consumed by ContactPointEditor layer buttons. Admin: `/admin/part-layer-defs`. |

All asset libraries accept **PNG / JPG / GIF / WebP**. GIF uploads bypass the destructive image editor so animation is preserved.

## Physics Coordinates

- Arena dimensions stored in pixels in Firestore (e.g., `width: 1080`, `height: 1080`)
- 1 cm = 24px at standard 1080p resolution
- Beyblade `radius` stored in cm; `createBeyblade()` converts to px: `radius * 24`
- Arena `arenaPixelRadius = Math.min(width, height) * 0.45`

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

PRNG is seeded from `matchId` via `src/utils/prng.ts` (`createPRNG`) + `src/utils/hashString.ts`. Same seed always produces the same sequence — enables deterministic replays.

## 2.5D Part System

Type definitions live in `client/src/types/beybladeSystem.ts` (shared by both client admin UI and server physics via cross-boundary import — the server `tsconfig.json` deliberately omits `rootDir` to allow this).

Server-side physics extensions are in `src/physics/PartPhysics.ts`. Room management is in `src/rooms/PartSystemManager.ts`.

Admin UI for the part library lives under `/admin/2d/` routes.

## Environment Variables

### Server (.env)
```
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
PORT=2567
```

### Client (client/.env)
```
VITE_GAME_SERVER_URL=ws://localhost:2567
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

Combo registry in `src/constants/combos.ts` (8 entries: 4 free + 4 cost-tiered). Each combo:

- **Exactly 3 keys** (`moveLeft / moveRight / moveUp / moveDown / attack / defense / dodge / jump`).
- **Cost** is `0 / 15 / 25 / 35`. Power deducted on activation.
- **Type restriction** — `universal` or beyblade-type-specific (e.g. `spin-leech-jab` is stamina-only).
- **Effect ceiling** — `damageMultiplier ≤ 1.5`, `lockMs ≤ 300`, no invulnerability, no AoE, no full spin recovery (those are special-move-only).
- **Detection** — `src/utils/comboSystem.ts::detectCombo` enforces sliding-3 window, attached check (`beyblade.comboIds` must include the id), power threshold, and per-combo cooldown.

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

`AIDifficulty = "medium" | "hard" | "hell"`. Legacy `"easy"` reads collapse to `"medium"` defensively. `src/ai/AIController.ts`:

- **Medium** — chases nearest opponent, attacks within 200 px, uses defense when low-spin + close, fires special at < 40 % spin.
- **Hard** — 5-tick prediction, circle-strafe at close range, dodge on closing speed > 3, defense when cornered.
- **Hell** — 10-tick prediction, ring-out-aware approach (aims for the side that pushes opponent toward the wall), dodge threshold 2, fires special the moment it's chargeable, periodic 3-key combo emission (~every 2 s) aligned with strike direction.

## Loading Progress

`<LoadingProgress />` (in `client/src/components/LoadingProgress.tsx`) overlays the battle canvas while the room is pre-warmup. Six steps:

1. `connecting-ws` — opening WebSocket
2. `joining-room` — `joinById` / `joinOrCreate`
3. `loading-arena-assets`
4. `loading-beyblade-assets`
5. `loading-audio-assets`
6. `warmup-ready`

`useColyseus` emits steps 1–2; transition to 5–6 happens when `state.status` reaches `warmup` / `in-progress`. Errors set the bar red and surface the connection error message.

After `warmup-ready`, the `LoadingProgress` overlay hides and the `Countdown` + `LaunchPhase` components take over:
- `Countdown` shows 3-2-1 during `warmup`, then flashes "Let It Rip!" when status becomes `launching`.
- `LaunchPhase` overlay shows tilt gauge, position slider, and power bar during `launching`.
- Both hide once `in-progress` begins.

## New Arena Features (this overhaul)

Types are in `client/src/types/arenaConfigNew.ts`:

- `SpinZoneConfig` — circular zone that imparts cw/ccw orbit or spin to beyblades inside. `applyTo: "linear" | "spin" | "both"`.
- `BumpConfig` — small raised feature; vertical pop + lateral recoil on contact.
- `GravityHoleConfig` — already existed; gained `controlledBySwitchId` + `selfRotation`.
- `ObstacleConfig` / `TriggerZoneConfig` — gained `controlledBySwitchId` + `selfRotation`.

**Switch wiring** — any feature with `controlledBySwitchId` is only active when that switch is on. The existing `SwitchConfig.targets[]` continues to drive the switch graph (toggle / set-on / set-off / pulse / chain to next switch).

**Self-rotation** — any feature can spin in place (`selfRotation: { speedDegPerSec, direction }`) — visual + functional (turrets re-aim, gravity wells orbit, obstacles rotate damage faces).

Top-level fields on `ArenaConfig`:
```ts
spinZones?: SpinZoneConfig[];
bumps?: BumpConfig[];
```

## Arena Tilt (Z-axis orientation)

> **Tilt ≠ Slope.** `bowlProfile`/`wallAngle` is a *surface-level* property — it controls the curvature of the bowl walls (how steeply they redirect beyblades inward). **Tilt** is an *arena-wide* property — it rotates the entire arena plane around a horizontal axis, like tilting a coin on a table.

Four new fields on `ArenaConfig` and matching `@type` fields on `ArenaState` (Colyseus-synced at 60 Hz):

```ts
tiltAngle?:     number;   // 0–360° (0=flat, 90=wall-ride, 180=inverted/Zero-G, 360=flat)
tiltDirection?: number;   // 0–360° azimuth of the downhill side (0=right, 90=down, 180=left, 270=up)
autoTilt?:      boolean;  // tilt direction rotates over time (spinning tilted bowl)
tiltSpeed?:     number;   // °/s for tilt-direction rotation (default 10)
```

**Physics** (`server/shared/physics/ArenaUtils.ts::computeTiltForce`):
- Applies a lateral force every tick: `sin(tiltAngle) × 0.04 × mass` in the `tiltDirection` vector.
- At 0°/360°: no force (flat). At 90°: maximum lateral pull (wall-ride). At 180°: force reverses direction (inverted gravity). `advanceArenaTilt()` increments `tiltDirection` each tick when `autoTilt` is on.

**Renderer** (`PixiRenderer.ts`):
- Three nested containers produce a correct 2-D projection of a tilted plane:
  - `arenaTiltOuter` — `rotation = tiltDirection` (aligns tilt axis with local X)
  - `arenaTiltScale` — `scaleX = cos(tiltAngle)` (foreshortening; negative = mirrored/inverted)
  - `arenaTiltInner` — `rotation = −tiltDirection` (restores orientation)
- All world layers (arena, features, beyblades, particles) sit inside `arenaTiltInner`. HUD stays screen-space and is unaffected.

**Admin UI** (`BasicsTab.tsx` — Tilt panel):
- Quick presets: Flat / Tilted (30°) / Steep (60°) / Wall-Ride (90°) / Inverted (180°)
- Angle slider 0–360°, direction slider 0–359°, live SVG ellipse preview, Auto-Tilt sub-panel

## 2.5D Contact Points

Type in `client/src/types/beybladeSystem.ts::SystemContactPoint`. Two shapes coexist:

- **Legacy** — `angle / width / radius / thickness`. Renderer warps the Fourier profile symmetrically around the center.
- **Arc-segment (new)** — `arcStart / arcEnd / radiusInner / radiusOuter / lineThickness / setId`. Protrusion is applied only along the arc line (peak at midpoint, linear falloff to the edges). Overlapping new-shape CPs blend via **max thickness** (not summed).

Helpers exported alongside the type:
- `resolveCpBounds(cp)` normalises both shapes to `{ arcStart, arcEnd, rInner, rOuter, lineThickness }`.
- `angleInArc(θ, arcStart, arcEnd)` — wraps past 360°.
- `groupContactPointsBySet(cps)` — multi-set rendering.
- `renderRadius(θ, fourierCache, cps)` — applies legacy CPs additively, new-shape CPs as max-blended line protrusion.

## Client File Layout

```
client/src/
├── game/
│   ├── renderer/PixiRenderer.ts       WebGL renderer (5 layers)
│   ├── hooks/useColyseus.ts           WebSocket connection
│   ├── hooks/useGameInput.ts          Keyboard → bitmask sendInput
│   └── hooks/usePixiRenderer.ts      PixiJS lifecycle
├── pages/
│   ├── HomePage.tsx                   Landing page
│   ├── LeaderboardPage.tsx            Public leaderboard (/leaderboard)
│   ├── TryoutGamePage.tsx             Solo mode
│   ├── BattleLobbyPage.tsx            PVP lobby (BO selector, spectate link)
│   ├── BattleGamePage.tsx             PVP game (spectator + series HUD)
│   ├── AIBattleSetupPage.tsx          AI battle setup (BO selector)
│   ├── AIBattleGamePage.tsx           AI battle game (spectator + series HUD)
│   ├── TournamentListPage.tsx         Browse tournaments
│   ├── TournamentLobbyPage.tsx        Tournament wait lobby (Firestore only)
│   ├── TournamentBattleGamePage.tsx   Tournament match page
│   └── admin/
│       ├── AdminDashboardPage.tsx     Dashboard with tournament stats card
│       ├── TournamentsListPage.tsx    Tournament management
│       ├── TournamentCreatePage.tsx   Create tournament
│       ├── TournamentDetailPage.tsx   Bracket view + manual advance
│       ├── UsersPage.tsx              User role management
│       ├── StatsPage.tsx              Match statistics + leaderboard
│       ├── SettingsPage.tsx           Game-wide feature toggles
│       └── 2d/                        2.5D part library CRUD
├── components/
│   ├── LoadingProgress.tsx            6-step connection/asset stepper bar
│   ├── setup/
│   │   └── EntityPicker.tsx           Searchable name dropdown + tabbed preview pane
│   ├── game/
│   │   ├── ComboHUD.tsx               Attached-combo strip + fired-combo history
│   │   ├── SpecialMoveHUD.tsx         Special move power/cooldown ring
│   │   └── CameraControls.tsx         Spectator+player zoom buttons (+ / 0 / −)
│   └── admin/
│       ├── beyblade-system/           BeybladeSystem editor
│       ├── part-editor/               Part CRUD editors (ContactPoint, Pocket, etc.)
│       └── AssetCrudPage.tsx          Shared asset library page (GIF-aware)
├── constants/
│   └── combos.ts                      Client-side combo registry mirror (for HUD/picker)
├── contexts/
│   ├── AuthContext.tsx                Firebase Auth
│   └── GameContext.tsx                Game settings state
├── stores/gameStore.tsx               Zustand store (tournament state, etc.)
├── lib/firebase.ts                    Firebase Web SDK client + collection constants
└── types/
    ├── game.ts                        Shared game types (ServerGameState, TournamentDoc, etc.)
    └── beybladeSystem.ts              2.5D part system types (shared with server)
```

## Seed Scripts

All seeders live under `scripts/` and are exposed as npm scripts. Idempotent — safe to re-run.

| Script | Writes to | Notes |
|--------|-----------|-------|
| `npm run seed:beyblades` | `beyblade_stats` | ~20 beys grouped by generation (Bakuten/Plastic, MFB, Burst, X). Defaults `specialMoveId` + `comboIds` per type unless overridden per-bey. |
| `npm run seed:arenas` | `arenas` | Stadium presets. |
| `npm run seed:combos` | `combos` | 8 combos (4 free + 4 cost-tiered). Mirrors `src/constants/combos.ts`. |
| `npm run seed:ai-battles` | `ai_battles` | Three quick-launch presets: medium / hard / hell. |
| `npm run seed:tournament-ai-solo` | `tournaments` + `tournament_participants` + `tournament_brackets` | 4-bracket solo-vs-AI tournament (1 human placeholder + 3 AI). |
| `npm run seed:special-moves` | `special_moves` | Special move registry. |
| `npm run seed:2d-parts` | `beyblade_parts` | 2.5D part library. |
| `npm run seed:bey-systems` | `beyblade_systems` | Assembled 2.5D configs. |
| `npm run seed:arena-systems` | `arena_systems` | Arena system configs. |
| `npm run seed:mechanics` | `mechanic_defs` | 31 mechanic handler docs — one per MechanicRegistry entry. |
| `npm run seed:gimmicks` | `gimmick_defs` | 27 gimmick recipes (22 original + 5 new: magnacore_repel/attract, dual_spin_launch, mode_switch_tip, spring_launch). |
| `npm run seed:tip-shapes` | `tip_shape_defs` | 16 tip shape presets (flat, sharp, rubber, bearing, etc.). |
| `npm run seed:core-gimmicks` | `core_gimmick_defs` | 12 core gimmick types (mode change, dual spin, spring launch, etc.). |
| `npm run seed:attack-type-defs` | `attack_type_defs` | 8 attack types for contact points (smash, upper, burst, absorb, etc.). |
| `npm run seed:arena-theme-defs` | `arena_theme_defs` | 12 arena visual themes (volcano, ice, space, neon, etc.). |
| `npm run seed:arena-shape-defs` | `arena_shape_defs` | 10 arena boundary shapes (circle, hexagon, star, stadium, etc.). |
| `npm run seed:bowl-profile-defs` | `bowl_profile_defs` | 8 bowl wall-angle profiles (flat through extreme 75°). |
| `npm run seed:trigger-type-defs` | `trigger_type_defs` | 12 stat modifier trigger conditions (always, on_hit, low_spin, etc.). |
| `npm run seed:stat-event-defs` | `stat_event_defs` | 15 stat tracking events (collision, burst, ring_out, etc.). |
| `npm run seed:part-layer-defs` | `part_layer_defs` | 12 part layer types for contact point assignments (upper, blade, guard, etc.). |
| `npm run seed:all` | All of the above | Runs in order; safe to use as a first-time bootstrap. |

## Learning Folder (Deferred)

A real Beyblade learning folder will be provided later. When received:
- Update `src/constants/beybladePhysicsConstants.ts` with real RPM/mass/radius data
- Validate type matchup multipliers against official Beyblade type triangle
- Improve special move names/behaviors to match series lore
- Adjust arena sizing to real stadium scale (real B-200: ~40cm diameter)

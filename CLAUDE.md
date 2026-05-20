# CLAUDE.md — Beyblade Game

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
| `tournament_participants` | One doc per participant per tournament (userId, seed, beybladeId) |
| `tournament_brackets` | One doc per match slot; `colyseusRoomId` populated 60s before match |

### Scheduler Flow

1. `TournamentScheduler.poll()` runs every 30s.
2. Finds `tournament_brackets` where `status == "pending"` and `scheduledTime <= now + 65s`.
3. Resolves beybladeIds (auto-picks if missing or blacklisted via `autoPickBeyblade()`).
4. Registers a callback via `TournamentBattleRoom.pendingMatchCallbacks.set(matchId, cb)`.
5. Calls `matchMaker.createRoom("tournament_battle_room", options)` — returns `RoomListingData`.
6. Room's `onCreate` picks up the callback from the static map, deletes the entry.
7. Writes `colyseusRoomId` to the bracket doc — clients on `TournamentLobbyPage` auto-navigate.

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
| `beyblade_stats` | Beyblade configurations |
| `arenas` | Arena configurations (shape, theme, obstacles, etc.) |
| `stadiums` | Stadium metadata and images |
| `matches` | Match results (includes `seriesFormat`, `seriesScore`, `gameResults[]`) |
| `player_stats` | Per-player win/loss/damage stats — **public read** for leaderboard |
| `users` | User profiles and roles (`user` / `admin`) |
| `tournaments` | Tournament docs |
| `tournament_participants` | Participant docs |
| `tournament_brackets` | Bracket match docs |
| `arena_theme_assets` | Background textures per theme |
| `obstacle_assets` | Obstacle sprites |
| `turret_assets` | Turret and projectile sprites |
| `water_body_assets` | Water surface textures |
| `portal_assets` | Portal sprites |
| `sound_assets` | Sound effects and music |
| `settings` | Game-wide config (single doc: `settings/game`) |
| `beyblade_parts` | 2.5D part library (bit_beast, attack_ring, weight_disk, sub_part, tip, core, casing) |
| `beyblade_systems` | Assembled 2.5D beyblade configs (slot → partId mapping) |

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
├── components/admin/
│   ├── beyblade-system/               BeybladeSystem editor
│   └── part-editor/                   Part CRUD editors (ContactPoint, Pocket, etc.)
├── contexts/
│   ├── AuthContext.tsx                Firebase Auth
│   └── GameContext.tsx                Game settings state
├── stores/gameStore.tsx               Zustand store (tournament state, etc.)
├── lib/firebase.ts                    Firebase Web SDK client + collection constants
└── types/
    ├── game.ts                        Shared game types (ServerGameState, TournamentDoc, etc.)
    └── beybladeSystem.ts              2.5D part system types (shared with server)
```

## Learning Folder (Deferred)

A real Beyblade learning folder will be provided later. When received:
- Update `src/constants/beybladePhysicsConstants.ts` with real RPM/mass/radius data
- Validate type matchup multipliers against official Beyblade type triangle
- Improve special move names/behaviors to match series lore
- Adjust arena sizing to real stadium scale (real B-200: ~40cm diameter)

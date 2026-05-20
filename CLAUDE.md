# CLAUDE.md — Beyblade Game

## Project Structure

Two separate runnable systems in one repo:

```
server/     → Colyseus game server (Node.js, port 2567)
client/     → Vite + React SPA (port 3001 dev)
src/        → Server source (TypeScript)
```

## Development

```bash
npm run dev:server   # starts Colyseus (ts-node src/index.ts)
npm run dev:client   # starts Vite (cd client && npm run dev)
```

Both run on separate processes. The client proxies `/colyseus` → `http://localhost:2567`.

## Key Architecture Decisions

- **Server-authoritative physics** — Matter.js runs on the Colyseus server. The client only sends input (moveLeft, moveRight, attack, specialMove) and receives state updates.
- **Colyseus schema auto-sync** — GameState, BeybladeSchema, ArenaState are all Colyseus `@Schema` classes. State propagates to all clients at 60Hz automatically.
- **Firebase Firestore** — stores beyblade_stats, arenas, stadiums, matches, player_stats, and all asset collections.
- **PixiJS WebGL** — client renders the game using PixiJS 8. 5-layer stack: arena → features → beyblades → particles → HUD.
- **Vite + React Router v6** — replaces Next.js. No SSR, no server components. All routing is client-side.

## Server Room Types

| Room | File | Max Clients | Purpose |
|------|------|-------------|---------|
| `tryout_room` | `src/rooms/TryoutRoom.ts` | 1 | Solo practice |
| `battle_room` | `src/rooms/BattleRoom.ts` | 4 | Live PVP 2–4 players |

Register new rooms in `src/index.ts` with `gameServer.define("room_name", RoomClass)`.

## CRITICAL: No async in game loop

Arena config and beyblade data are loaded **once in `onCreate()`** and cached as `this.arenaCache` and `this.beybladeCache`. The `tick(deltaTime)` method is **synchronous** — never add `await` or Firebase calls inside it.

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

## Physics Coordinates

- Arena dimensions are stored in pixels in Firestore (e.g., `width: 1080`, `height: 1080`)
- 1 cm = 24px at standard 1080p resolution
- Beyblade `radius` is stored in cm; `createBeyblade()` converts to px: `radius * 24`
- Arena `arenaPixelRadius = Math.min(width, height) * 0.45`

## Beyblade Type Distribution

360 total points, max 150 per category:

```typescript
damageMultiplier = 1.0 + attack * 0.007   // 1.0x–2.05x
damageReduction  = 1 - defense * 0.003     // 1.0x–0.55x
spinDecayRate    = 8 * (1 - stamina * 0.001) // 8–6.8/s
maxSpin          = 2000 * (1 + stamina * 0.0008)
```

## Gyroscopic Physics (TryoutRoom / BattleRoom)

Beyblades at < 40% spin stability enter nutation wobble (random force applied each tick):

```typescript
const stability = beyblade.spin / beyblade.maxSpin;
if (stability < 0.4) {
  // Nutation wobble — simulates dying spinning top
  applyForce(id, (Math.random() - 0.5) * wobble, (Math.random() - 0.5) * wobble);
}
```

## Firebase Collections

| Collection | Purpose |
|-----------|---------|
| `beyblade_stats` | Beyblade configurations |
| `arenas` | Arena configurations (shape, theme, obstacles, etc.) |
| `stadiums` | Stadium metadata and images |
| `matches` | Match results |
| `player_stats` | Per-player win/loss/damage statistics |
| `arena_theme_assets` | Background textures per theme |
| `obstacle_assets` | Obstacle sprites |
| `turret_assets` | Turret and projectile sprites |
| `water_body_assets` | Water surface textures |
| `portal_assets` | Portal sprites |
| `sound_assets` | Sound effects and music |
| `settings` | Game-wide config (single doc: `settings/game`) |

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
│   ├── renderer/PixiRenderer.ts    WebGL renderer (5 layers)
│   ├── hooks/useColyseus.ts        WebSocket connection
│   ├── hooks/useGameInput.ts       Keyboard → sendInput
│   └── hooks/usePixiRenderer.ts   PixiJS lifecycle
├── pages/
│   ├── TryoutGamePage.tsx          Solo mode
│   ├── BattleLobbyPage.tsx         PVP pre-game lobby
│   ├── BattleGamePage.tsx          PVP game scene
│   └── admin/                      All admin CRUD pages
├── contexts/GameContext.tsx        Game settings state
├── lib/firebase.ts                 Firebase Web SDK client
└── types/game.ts                   Shared game types
```

## Learning Folder (Deferred)

A real Beyblade learning folder will be provided later. When received:
- Update `src/constants/beybladePhysicsConstants.ts` with real RPM/mass/radius data
- Validate type matchup multipliers against official Beyblade type triangle
- Improve special move names/behaviors to match series lore
- Adjust arena sizing to real stadium scale (real B-200: ~40cm diameter)

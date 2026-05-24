[← Phase 22: Semi-Autonomous Control](phase-22-semi-autonomous-control.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 24: Engine Optimizations →](phase-24-engine-optimizations.md)

---

# Phase 23 — Battle Modes: Battle Royale · Arena Authority · Extended Battles

> **Stage 23** — New battle mode variants and arena configuration extensions.
> Battle Royale is a 20-player free-for-all with a PUBG-style shrinking safe zone.
> Arena Authority Config allows arena designers to tune how much player input overrides
> the Control AI on a per-feature basis.

---

## 0. Battle Royale Mode

### 0.1 Overview

Configure `BattleRoom` (or a new `RoyaleBattleRoom`) with `options.mode = "royale"`.

| Parameter | Value |
|---|---|
| Max players | 20 (extend room max from 12 → 20 in `src/index.ts`) |
| Default duration | 300s (5 minutes) via `maxDurationSeconds = 300` |
| Win condition | Last bey spinning |
| Series format | Always single-match (no BO series) |
| Spectators | Supported as normal (via `spectate: true` join option) |

### 0.2 Shrinking Safe Zone

Every 60 seconds the safe zone radius decreases. Beyblades outside the boundary take
continuous spin drain — modelling the PUBG storm mechanic.

| Phase | Time window | Safe zone (% of arena radius) | Drain (spin/s outside) |
|---|---|---|---|
| 0 | 0–60s | No zone (full arena safe) | 0 |
| 1 | 60–120s | 75% | 3 |
| 2 | 120–180s | 55% | 6 |
| 3 | 180–240s | 35% | 10 |
| 4 | 240–300s | 20% | 15 |

Drain rates are design parameters. They scale so that a bey at full spin standing still
outside the phase-4 zone will spin out in approximately 100s/15 ≈ 6.7s — aggressive but
survivable with active movement.

**Server tick integration:**
```typescript
state.arenaState.safeZoneTimer -= deltaTime / 1000;
if (safeZoneTimer <= 0 && safeZonePhase < 4) {
  safeZonePhase++;
  safeZoneRadius = arenaPixelRadius × ZONE_PHASES[phase].radiusFraction;
  safeZoneTimer  = 60;
  broadcast("zone-shrink", { phase, newRadius });
}
// Per-bey drain
const dist = Math.sqrt((bey.x - zoneX) ** 2 + (bey.y - zoneY) ** 2) - zoneRadius;
if (dist > 0 && safeZonePhase > 0)
  bey.spin = Math.max(0, bey.spin - DRAIN_RATES[phase] * deltaTime / 1000);
```

**New ArenaState schema fields** (Colyseus-synced at 60Hz):
```typescript
@type("float32") safeZoneRadius: number = 0;   // 0 = zone disabled
@type("float32") safeZoneX:      number = 0;   // centre X (arena centre default)
@type("float32") safeZoneY:      number = 0;   // centre Y
@type("float32") safeZoneTimer:  number = 0;   // seconds until next shrink
@type("uint8")   safeZonePhase:  number = 0;   // 0–4
```

### 0.3 Client Rendering

`PixiRenderer.ts` draws when `safeZonePhase > 0`:
- Pulsing ring at `safeZoneRadius` (red/orange, 2px stroke, 0.4–0.7 alpha oscillation at 1Hz)
- Red gradient overlay outside ring, opacity = 0.05 × phase (subtle storm haze)

`RoyaleHUD.tsx` (new React overlay):
- Top-right: remaining players sorted by spin%, updated every second
- Top-centre: "Zone closes in Xs" countdown from `safeZoneTimer`
- Phase indicator: "Phase 1/4" label

### 0.4 Royale Elimination and Victory

- Spin reaching 0 from zone drain is counted the same as ring-out/burst/spin-out elimination
- `state.winner` set when `beyblades.size === 1` (last bey standing)
- Royale rooms do not use BO series — always single-match
- `isSeriesDraw` cannot occur in royale (only one winner possible)

---

## 1. Arena Authority Config

### 1.1 Purpose

Arena designers can tune how much player input overrides the Control AI (Phase 22 §2)
on a per-arena and per-feature basis. This enables scenarios like:
- "Anime rail-riding" — on a rail feature, player has very high authority (bey follows precisely)
- "Chaos zone" — inside a spin zone, player has reduced authority (bey fights the turbulence)
- "Black hole" — inside a gravity well, player barely controls the bey (pulled strongly inward)

### 1.2 ArenaConfig Field

```typescript
// client/src/types/arenaConfigNew.ts
playerAuthorityConfig?: {
  globalMultiplier?:    number;  // 0.5–2.0; default 1.0 (no change)
  curvatureMultiplier?: number;  // 0.0–1.0: how strongly steep wall proximity reduces authority
  featureOverrides?: {
    railTrack?:   number;  // multiplier while bey is within rail feature radius + 20px
    gravityWell?: number;  // multiplier while within gravity well radius + 20px
    spinZone?:    number;  // multiplier while within spin zone radius + 20px
    pit?:         number;  // multiplier while within pit radius + 20px
    bump?:        number;  // multiplier immediately after bump contact (brief spike)
    obstacle?:    number;  // multiplier while within obstacle radius + 20px
  };
};
```

Designed default values (not from research — design parameters):

| Feature | Designed default | Intended feel |
|---|---|---|
| `globalMultiplier` | 1.0 | standard |
| `railTrack` | 1.80 | anime: player steers precisely on rails |
| `gravityWell` | 0.30 | near-black-hole: barely steerable |
| `spinZone` | 0.70 | chaotic: partial control |
| `pit` | 0.50 | precarious: reduced control near pit |
| `bump` | 1.10 | brief authority spike after bounce |
| `obstacle` | 0.80 | slightly harder to steer near obstacles |

### 1.3 Room Computation Per Tick

```typescript
private computeArenaAuthorityMultiplier(bey: Beyblade, config: ArenaConfig): number {
  const pac = config.playerAuthorityConfig;
  if (!pac) return 1.0;
  let m = pac.globalMultiplier ?? 1.0;
  for (const [featureType, mult] of Object.entries(pac.featureOverrides ?? {})) {
    const features = getArenaFeaturesByType(config, featureType);
    for (const f of features) {
      const d = Math.sqrt((bey.x - f.x) ** 2 + (bey.y - f.y) ** 2);
      if (d < (f.radius ?? 30) + 20) { m *= mult; break; }
    }
  }
  const distToWall = arenaRadius - Math.sqrt((bey.x - cx) ** 2 + (bey.y - cy) ** 2);
  if ((pac.curvatureMultiplier ?? 0) > 0 && distToWall < 40)
    m *= 1 - pac.curvatureMultiplier! * (1 - distToWall / 40);
  return Math.max(0.1, Math.min(2.0, m));
}
```

The result is passed into `computeAuthority(... arenaAuthorityMultiplier)` (Phase 22 §2.1).

### 1.4 Admin UI — BasicsTab.tsx

New **Player Authority** panel (collapsible, placed after the Tilt panel):

```
Player Authority Config
  ├─ Global Multiplier    [slider 0.5–2.0, step 0.05, default 1.0]  label: "1.0 = standard"
  ├─ Curvature Multiplier [slider 0.0–1.0, step 0.05, default 0.0]  label: "wall proximity effect"
  └─ Feature Overrides [collapsible sub-panel]
       Rail Track       [number input, default 1.80]
       Gravity Well     [number input, default 0.30]
       Spin Zone        [number input, default 0.70]
       Pit              [number input, default 0.50]
       Bump             [number input, default 1.10]
       Obstacle         [number input, default 0.80]
```

All inputs write to `arenaConfig.playerAuthorityConfig`.

### 1.5 Admin UI — FeaturesTab.tsx

Each feature card shows a read-only authority override badge:
```
[Spin Zone feature card]    ← Auth ×0.70
[Gravity Well feature card] ← Auth ×0.30
```
Badge reads `playerAuthorityConfig.featureOverrides[featureType]`. No editing on the feature
card — editing happens in BasicsTab Player Authority panel.

---

## 2. Longer Battle Config

### 2.1 ArenaConfig Field

```typescript
maxDurationSeconds?: number;  // default: 180; royale default: 300; range: 60–600
```

### 2.2 Room Behavior

All four battle rooms read `arenaConfig.maxDurationSeconds` in `onCreate()` and cache it:
```typescript
this.matchDurationSeconds = this.arenaConfig?.maxDurationSeconds ?? 180;
```

The cached value replaces the hardcoded `180` in all match-timer checks and `endSeriesOnCap()`.

**Exception:** `TournamentBattleRoom.endSeriesOnCap()` always uses 180s regardless of
`maxDurationSeconds` — competitive fairness requires a fixed cap.

### 2.3 Use Cases

| Scenario | Recommended maxDurationSeconds |
|---|---|
| Standard competitive | 180 (default) |
| Casual / exhibition | 300 |
| Practice / tutorial | 600 |
| Battle Royale | 300 (default for royale arenas) |

---

## 3. RoyaleHUD Component

```typescript
// client/src/components/game/RoyaleHUD.tsx
// Props: players: Array<{name, spin, maxSpin}>, safeZoneTimer: number, safeZonePhase: number
// Only renders when options.mode === "royale"
```

Layout:
- Top-right panel: player strip sorted by spin%, each row has name + spin bar
- Top-centre banner: "Zone closes in Xs" + "Phase N/4"
- Phase indicator changes colour: phase 1=yellow, 2=orange, 3=red, 4=crimson

---

## Implementation Status (audit 2026-05-24)

| Component | Status | Notes |
|-----------|--------|-------|
| `RoyaleBattleRoom.ts` | ❌ Missing | No royale room; 10 rooms exist (2D + 2.5D + team), none royale |
| Max players raised to 20 in `src/index.ts` | ❌ Missing | Room max is 12 |
| `safeZoneRadius/X/Y/Timer/Phase` on `ArenaState` schema | ❌ Missing | Not in `GameState.ts` |
| Safe zone shrink tick logic | ❌ Missing | Not implemented |
| Safe zone pulsing ring renderer | ❌ Missing | Not in `PixiRenderer.ts` |
| `RoyaleHUD.tsx` component | ❌ Missing | Not in `components/game/` |
| `playerAuthorityConfig` on `ArenaConfig` | ❌ Missing | Not in `arenaConfigNew.ts` |
| `computeArenaAuthorityMultiplier()` in room | ❌ Missing | Not in any room |
| Player Authority admin panel in `BasicsTab.tsx` | ❌ Missing | Tab exists but no authority panel |
| Authority badge on feature cards in `FeaturesTab.tsx` | ❌ Missing | Not in `FeaturesTab.tsx` |
| `maxDurationSeconds` on `ArenaConfig` | ❌ Missing | Not in `arenaConfigNew.ts` |

---

[← Phase 22: Semi-Autonomous Control](phase-22-semi-autonomous-control.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 24: Engine Optimizations →](phase-24-engine-optimizations.md)

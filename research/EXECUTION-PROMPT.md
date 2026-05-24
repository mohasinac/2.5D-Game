# Execution Prompt — Beyblade Game: Unified System Implementation

> **Purpose**: Authoritative implementation brief. Read at the start of every session.
> Cross-reference linked phase files for full specification.
>
> **Last audit**: 2026-05-24 (codebase re-verified this session)
>
> **Engine architecture (never changes):**
>
> - Server: Colyseus 0.15, Matter.js 60 Hz, TypeScript (`src/`)
> - Client: Vite + React, PixiJS 8.14, TypeScript (`client/src/`)
> - Shared: `server/shared/` imported by both — no duplication
> - Physics: always 2D server-side regardless of renderer mode
> - Sync: Colyseus schema at 60 Hz; `uint16` bitmask input

---

## Stage Number ↔ Filename Map (phases 22–28)

| Stage (progress.md)              | Phase File on Disk                    |
| -------------------------------- | ------------------------------------- |
| 22 — Modular Arena Builder       | `phase-22-arena-builder.md`           |
| 23 — Universal Preset Library    | `phase-23-preset-library.md`          |
| 24 — Semi-Autonomous Control     | `phase-22-semi-autonomous-control.md` |
| 25 — Battle Modes                | `phase-23-battle-modes.md`            |
| 26 — Engine Optimizations        | `phase-24-engine-optimizations.md`    |
| 27 — Tiered AoI                  | `phase-27-tiered-aoi.md`              |
| 28 — View Modes + HUD + BitBeast | `phase-28-view-modes-hud-bitbeast.md` |

---

## Quick Reference — Implementation Status

> **Codebase audit date: 2026-05-24 (re-verified).**

| Layer              | Item                                       | Status          | Notes                                                                                                                    |
| ------------------ | ------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Prerequisites**  | P0.1 BehaviorRef dispatch gap              | ✅ FIXED        | `ArenaFeatureProcessor.executeBehavior()` dispatches all prefixes                                                        |
| **Prerequisites**  | P0.2 ComboDoc effectId picker              | ⚠️ PARTIAL      | Field + plain text input exist; needs upgrade to `SearchableSelect` loading `COMBO_EFFECTS`                              |
| **Prerequisites**  | P0.3 Special move schema mismatch          | ✅ COEXIST      | Both `server/constants/specialMoves.ts` and Firestore `special_moves` valid                                              |
| **Prerequisites**  | P0.4 COLLECTIONS entries                   | ✅ FIXED        | `mechanic_defs`, `gimmick_defs`, `geometry_defs`, `stat_defs` all present                                                |
| **Prerequisites**  | N3 input dedup + heartbeat                 | ✅ DONE         | `useGameInput.ts` lines 213-221: `mask !== lastSentMask` + `HEARTBEAT_MS=500`                                            |
| **Prerequisites**  | R1 cullable on PixiRenderer layers         | ❌ not done     | `cullable=true` not set on any container                                                                                 |
| **Prerequisites**  | R4 \_lastSpin dirty-flag                   | ❌ not done     | `prevTipStages`/`prevWearLevels` exist; add spin-threshold dirty check                                                   |
| **Prerequisites**  | L0.3 EWD bearingFriction                   | ❌ not done     | B:D comment (0.02) is correct; EWD seed entry missing `bearingFriction: 0.12`                                            |
| **Foundation**     | Phase 21 collections + admin pages         | ✅ DONE         | All 4 collections + 4 admin pages exist                                                                                  |
| **Foundation**     | MechanicRegistry Phase 24 stubs            | ❌ not done     | `authorityBlend`, `steeringForce`, `beyDecision`, `naturalMotion` not registered                                         |
| **Foundation**     | Type files geometryDef/statDef/behaviorDef | ✅ assumed done | Admin pages exist; verify vs Phase 21 spec in Session B                                                                  |
| **Controls**       | Phase 24 Semi-Autonomous Control           | ❌ not done     | `NaturalMotion.ts` absent; authority blend absent; bits 10–12 unallocated                                                |
| **Arena**          | Phase 22 Modular Arena Builder             | ❌ PARTIAL      | `ElevationZoneConfig` already in shared types; `modularSections`, `loopTracks` absent                                    |
| **Preset Library** | Phase 23 Preset Library                    | ❌ not done     | 11 preset collections absent from `firebase.ts`                                                                          |
| **Battle Modes**   | Phase 25 Battle Royale + Arena Authority   | ❌ not done     | `RoyaleBattleRoom` absent; safe zone schema absent                                                                       |
| **Network**        | Phase 27 Tiered AoI                        | ❌ not done     | `BeyGhostState`, `beyGhosts` MapSchema absent                                                                            |
| **Renderer**       | Phase 28 View Modes + HUD                  | ❌ not done     | `rendererMode` absent; `IGameRenderer`/`RendererFactory` absent; HUD components absent                                   |
| **Renderer**       | Phase 28 BitBeast system                   | ❌ not done     | `bitbeast_assets` absent; `BitBeastOverlay` absent; `bitBeastId` absent                                                  |
| **Minimap**        | Minimap.tsx                                | ⚠️ PARTIAL      | Exists with Top + Side tabs; reads from `beyblades` prop — must migrate to `beyGhosts` in Session D; add Perspective tab |
| **Optimizations**  | Phase 26 Phase 2 + 3                       | ❌ not done     | Needs Layers 2–3 stable first                                                                                            |

---

## Audit Corrections (applied this session)

| #   | Finding                                                                                   | Impact                                                    |
| --- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | `N3` input dedup + heartbeat already done in `useGameInput.ts`                            | Removed from Session A                                    |
| 2   | `effectId` already a text input in `CombosPage.tsx`                                       | Session A: upgrade text input → `SearchableSelect` only   |
| 3   | `ElevationZoneConfig` type already in `shared/types/arenaConfigNew.ts`                    | L2B.1 is PARTIAL                                          |
| 4   | `Minimap.tsx` exists with Top/Side (not 3 tabs); reads from `beyblades` prop              | Add Perspective tab + migrate to `beyGhosts` in Session D |
| 5   | B:D `0.02` comment in PartPhysics.ts is CORRECT for B:D; EWD seed needs `0.12` separately | B1/B2 are clarification comments; B3 is the real fix      |
| 6   | `prevTipStages`/`prevWearLevels` pattern exists in PixiRenderer                           | R4 = add `_lastSpins` map using same pattern              |
| 7   | `COMBO_EFFECTS` collection key already in `COLLECTIONS`                                   | P0.2 picker can reference it directly                     |
| 8   | Phase 21 spec lists 11 additional mechanics beyond the 4 Phase-24 stubs                   | Session B must verify; 4 stubs only for Session A         |

---

## Layer 0 — Prerequisites

### L0.1 Bug Status (verified 2026-05-24)

| Bug                           | Status                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------- |
| P0.1 BehaviorRef dispatch     | ✅ FIXED                                                                     |
| P0.2 ComboDoc effectId picker | ⚠️ PARTIAL — upgrade text input → `SearchableSelect` loading `COMBO_EFFECTS` |
| P0.3 Special move schema      | ✅ COEXIST (both valid)                                                      |
| P0.4 COLLECTIONS entries      | ✅ FIXED                                                                     |

### L0.2 Phase 1 Optimizations

| ID  | File                                       | Change                                                                                      | Status  |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------- | ------- |
| R1  | `client/src/game/renderer/PixiRenderer.ts` | `cullable = true` on `beybladeLayer`, `featureLayer`, `particleLayer`                       | ❌      |
| R4  | `client/src/game/renderer/PixiRenderer.ts` | Add `_lastSpins: Map<string,number>` — only re-draw shape when spin crosses bucket boundary | ❌      |
| N3  | `client/src/game/hooks/useGameInput.ts`    | Input dedup + 500ms heartbeat                                                               | ✅ DONE |
| S1  | `server/physics/PhysicsEngine.ts`          | `isStatic: true` on walls/obstacles                                                         | ✅ DONE |

### L0.3 EWD bearingFriction

| ID  | File                                     | Change                                                                             |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| B1  | `server/physics/PartPhysics.ts` line 185 | Append clarification: `// EWD (single bearing) = 0.12; B:D (ball bearings) = 0.02` |
| B2  | `server/physics/PartPhysics.ts` line 674 | Same clarification near `defenderBearingFriction` comment                          |
| B3  | `scripts/seed-2d-parts.js`               | Find EWD tip entry; set `bearingFriction: 0.12`                                    |

---

## Layer 1 — Foundation (Phase 21)

**Spec:** `research/phases/phase-21-unified-foundation.md`

### L1 Status (2026-05-24)

| Item                                                                                      | Status                          |
| ----------------------------------------------------------------------------------------- | ------------------------------- |
| `geometry_defs` + `stat_defs` in COLLECTIONS                                              | ✅ DONE                         |
| `mechanic_defs` + `gimmick_defs` in COLLECTIONS                                           | ✅ DONE                         |
| `/admin/geometry-defs`, `/admin/stat-defs`, `/admin/mechanic-defs`, `/admin/gimmick-defs` | ✅ DONE                         |
| MechanicRegistry 31 handlers                                                              | ✅ DONE                         |
| MechanicRegistry Phase 24 stubs (4)                                                       | ❌ MISSING                      |
| Type files `geometryDef.ts`, `statDef.ts`, `behaviorDef.ts`                               | ✅ assumed; verify in Session B |

### L1.4 MechanicRegistry Extension

File: `server/physics/MechanicRegistry.ts` — add four imports:

```typescript
import "./mechanics/authorityBlend";
import "./mechanics/steeringForce";
import "./mechanics/beyDecision";
import "./mechanics/naturalMotion";
```

Create stubs in `server/physics/mechanics/` — each registers via `registerMechanic(id, { onActivate: () => {} })`. Full implementation in Session C.

### L1.5 Seed Scripts

```bash
npm run seed:mechanics   # +4 docs
npm run seed:gimmicks    # +naturalMotion recipe
```

---

## Layer 2A — Semi-Autonomous Control

**Spec:** `research/phases/phase-22-semi-autonomous-control.md`

### L2A.1 Bitmask Extension (bits 10–12)

File: `server/shared/utils/bitmask.ts`

> ⚠️ Confirm physical key bindings with user before implementing.

```typescript
attitudeAggressive: 1 << 10,  // J key
attitudeDefensive:  1 << 11,  // K key
attitudeStamina:    1 << 12,  // L key
```

Update `normalizeInput()` to decode bits 10–12 into `PlayerInput`.

### L2A.2 NaturalMotion.ts

File: `server/shared/physics/NaturalMotion.ts` (new)

`computeNaturalForce(bey, cx, cy, attitude, opponents, isAIStunned, decisionBias, rageBurstActive)`:

1. Orbit: `0.0005 × mass × spinFrac × tip.grip` tangential ⊥ radius
2. Momentum: `0.0001 × mass × spinFrac × (speed/300)` along velocity
3. Attitude bias: J=toward nearest ×0.0003×mass; K=away ×0.0002×mass
4. Stabilisation: spin<40% → centring ×0.0002×mass×(1−spinFrac)
5. Death spiral: spin<15% → toward centre ×0.001×mass×(0.15−frac)×10
6. Rage burst: ×2.0 all forces
7. Rail adhesion: toward rail ×0.0006×mass
8. Decision bias: add decisionBias.fx/fy

### L2A.3 Authority Blend

File: `server/shared/rooms/InputHandler.ts`

```
α_raw    = clamp(0,1, 0.30 + holdBoost + spaceBoost + clashBoost − spinPenalty − momentumPenalty)
α_arena  = α_raw × computeArenaAuthorityMultiplier(bey, arena)
α_smooth = lerp(prev_α, α_arena, 0.08)
```

Hard overrides α=0: combo executing, controlLocked, player stun 350ms, AI stun 80ms.
AI surrender: α=0.90 when player held >3000ms.

`applyBlendedMovement`: `finalForce = playerForce × α + naturalForce × (1−α)`

### L2A.4 Steering Force

```
cross    = cvx × targetDir.y − cvy × targetDir.x
steerStr = mass × speed × turnRate × 0.002
applyForce(−cvy × cross × steerStr, cvx × cross × steerStr)
spinCost = |cross| × turnRate × spinSteerCost
```

### L2A.5 Decision System

File: `server/physics/mechanics/beyDecisionHandler.ts`

Seeded PRNG timer [30,90] ticks. Five decisions: `continue_orbit`, `seek_opponent`, `avoid_wall`, `conserve_spin`, `counter_attack`. Probability matrix by archetype (see §6.3).

### L2A.6 Contextual I-key

- Context A (spin<40% OR airborne): centring + upward ×0.003×mass (33%/67%)
- Context B (spin≥40%, grounded): jump via `hasJumpingCore()`. Probs: attack 60%, balanced 30%, defense 10%, stamina 8%

### L2A.7 Type-Aware X Defense

- defense → guard (isDefending=true, spin−50%)
- attack → auto-dodge (lateral arc, power−10)
- stamina → evasion (lateral spinDirection, power−5)
- balanced → context (spin≥60%→guard, else→dodge)

### L2A.8 New Schema Fields

```typescript
// Beyblade class in GameState.ts:
@type("uint8")   controlAuthority: number  = 30;
@type("boolean") clashQTEActive:   boolean = false;
@type("float32") clashQTETimer:    number  = 0;
// rageBurstTicks: server-side Map only — NOT on schema
```

### L2A.9 Collision Tiers 0–3 + QTE

Classify by relSpeed. Tier 2 (Clash): `clashQTEActive=true`; broadcast `"clash-qte-started"`; 0.5s window. Tier 3 (Heavy): stun 350ms/80ms; rage burst 10 ticks.

### L2A.10 Four Input Sources

- Mouse+KB: cursor→direction; LClick-tap→bit4; LClick-hold≥200ms→bit8; RClick→bit5
- Gamepad: left stick→direction; A/B/X/Y→4/6/5/7; RT→8/9; LB cycles bits 10→11→12
- Touch: virtual d-pad (left 40%) + button ring [ATK][DEF][DDG][J][K][L]

### L2A.11 Client Components

- `ControlBlendBar.tsx` — live α bar; reads `bey.controlAuthority` uint8
- `TouchControls.tsx` — virtual d-pad + action ring; pointer events only
- Update `ControlsLegend.tsx` — 12-key layout + 4 input sources
- `PixiRenderer.ts` — drift particle trail (velocity vs rotation >20°)

---

## Layer 2B — Modular Arena Builder

**Spec:** `research/phases/phase-22-arena-builder.md`

### L2B.1 Arena Type Extensions (PARTIAL — ElevationZoneConfig already exists)

File: `shared/types/arenaConfigNew.ts`

Add missing:

```typescript
interface ModularSectionConfig {
  id: string;
  name: string;
  type: string;
  centerX_cm: number;
  centerY_cm: number;
  width_cm: number;
  height_cm: number;
  floorIndex: number;
}
interface LoopTrackConfig {
  id: string;
  centerX_cm: number;
  centerY_cm: number;
  radiusCm: number;
  bankAngle: number;
  speedBoostMultiplier: number;
  floorIndex: number;
}
```

Add to `ArenaConfig`: `modularSections?`, `loopTracks?`, `maxFloors?`, `viewportCapCm?` (default 100).

### L2B.2 Server Physics

- `@type("int8") beyFloorIndex` on Beyblade schema
- Elevator portal physics (floor change + arrival force)
- Loop track: `beyTiltAngle += bankAngle × proximity_factor`; speed boost

### L2B.3 ArenaEditorCanvas (shared with L2D.5)

File: `client/src/components/admin/ArenaEditorCanvas.tsx` (new)

Pan/zoom, 1cm grid snap, drag-place, select/move/resize, floor selector, loop track circle drag.

### L2B.4 Minimap Update (requires L3.2 first)

File: `client/src/components/game/Minimap.tsx`

- Add Perspective (isometric) tab
- Migrate ALL bey rendering to `beyGhosts` MapSchema (remove `beyblades` prop usage)

### L2B.5 Client State Culling

File: `client/src/game/renderer/PixiRenderer.ts`

Only render within 100cm of player bey. `VIEWPORT_HALF_CM = 50` from `shared/constants/aoi.ts`.

### L2B.6 Admin Form Updates

Arena configurator: Arena Sections tab, Loop Tracks tab, Elevation Zones tab, `floorIndex` on obstacle form.

---

## Layer 2C — Battle Modes

**Spec:** `research/phases/phase-23-battle-modes.md`

### L2C.1 RoyaleBattleRoom

File: `src/rooms/RoyaleBattleRoom.ts` (new, extends BattleRoom)

Max 20 clients. Register as `"royale_battle_room"`. Single-match. Safe zone 5-phase, 60s intervals. Drain: 0/3/6/10/15 spin/s.

### L2C.2 Safe Zone Schema (ArenaState)

```typescript
@type("float32") safeZoneRadius: number = 0;
@type("float32") safeZoneX:      number = 0;
@type("float32") safeZoneY:      number = 0;
@type("float32") safeZoneTimer:  number = 0;
@type("uint8")   safeZonePhase:  number = 0;
```

### L2C.3 Safe Zone Tick Logic

Decrement timer, advance phase at 0, drain beys outside zone per phase rate.

### L2C.4 Safe Zone Rendering

Pulsing red/orange ring (0.4–0.7 alpha at 1Hz) + gradient overlay outside (opacity 0.05×phase).

### L2C.5 RoyaleHUD

File: `client/src/components/game/RoyaleHUD.tsx`

Player strip sorted by spin%; zone timer; phase colors 1=yellow→4=crimson.

### L2C.6 Arena Authority Config

```typescript
interface PlayerAuthorityConfig {
  globalMultiplier?: number;
  curvatureMultiplier?: number;
  featureOverrides?: {
    railTrack?: number;
    gravityWell?: number;
    spinZone?: number;
    pit?: number;
    bump?: number;
    obstacle?: number;
  };
}
```

Add `playerAuthorityConfig?: PlayerAuthorityConfig` to `ArenaConfig`. Implement `computeArenaAuthorityMultiplier()` in `BattleRoom.ts`.

### L2C.7 Admin UI

`BasicsTab.tsx`: Player Authority panel (globalMultiplier 0.5–2.0, curvatureMultiplier 0.0–1.0, 6 feature overrides).
`FeaturesTab.tsx`: read-only authority badge per feature card.

### L2C.8 maxDurationSeconds

Add `maxDurationSeconds?: number` to `ArenaConfig`. Cache in `onCreate()` for all four rooms. Exception: `TournamentBattleRoom.endSeriesOnCap()` always 180s.

---

## Layer 2D — Universal Preset Library

**Spec:** `research/phases/phase-23-preset-library.md`

### L2D.1 Eleven Preset Collections (firebase.ts)

```typescript
ARENA_PRESETS: "arena_presets", BEY_PRESETS: "bey_presets", COMBO_PRESETS: "combo_presets",
MECHANIC_PRESETS: "mechanic_presets", GIMMICK_PRESETS: "gimmick_presets",
SPECIAL_MOVE_PRESETS: "special_move_presets", PART_PRESETS: "part_presets",
SYSTEM_PRESETS: "system_presets", THEME_PRESETS: "theme_presets",
OBSTACLE_PRESETS: "obstacle_presets", FEATURE_GROUP_PRESETS: "feature_group_presets",
```

### L2D.2 Type Definitions

File: `client/src/types/presetLibrary.ts`

```typescript
export interface ArenaFeatureGroupInstance {
  featureType: string;
  configSnapshot: unknown;
  relativeX_cm: number;
  relativeY_cm: number;
  floorIndex: number;
}
export interface ArenaFeatureGroupTemplate {
  id: string;
  name: string;
  description: string;
  features: ArenaFeatureGroupInstance[];
}
export interface PresetDoc<T> {
  id: string;
  name: string;
  tags: string[];
  thumbnail?: string;
  data: T;
}
```

### L2D.3 PresetBar Component

File: `client/src/components/game/PresetBar.tsx`

Horizontal scrollable strip. Thumbnail, name, tag chips. Props: `presets: PresetDoc<unknown>[]`, `onSelect`.

### L2D.4 Arena List Tag Grouping

i think we have already passed them ,just implement it here then based on the latest code stateArena admin list: tag-filter bar + group by preset tag.

### L2D.5 ArenaEditorCanvas

Same file as L2B.3 — implement once, used by both.

---

## Layer 3 — Tiered AoI

**Spec:** `research/phases/phase-27-tiered-aoi.md`

### L3.1 Constants

File: `server/shared/constants/aoi.ts`

```typescript
export const AoI = {
  VIEWPORT_HALF_CM: 50,
  INNER_RADIUS_CM: 60,
  OUTER_RADIUS_CM: 100,
  TIER2_EXIT_CM: 65,
  TIER1_EXIT_CM: 105,
  ELEVATOR_BONUS_CM: 10,
  GHOST_HZ: 10,
  SHADOW_HZ: 20,
  FULL_HZ: 60,
  TIER1_OPACITY: 0.3,
  TIER_FADE_MS: 200,
  TIER_GHOST_FADE_MS: 100,
} as const;
```

### L3.2 BeyGhostState Schema

File: `src/rooms/schema/BeyGhostState.ts`

```typescript
export class BeyGhostState extends Schema {
  @type("string") id = "";
  @type("number") x_cm = 0;
  @type("number") y_cm = 0;
  @type("int8") floorIndex = 0;
  @type("string") teamId = "";
  @type("uint8") tier = 0;
  @type("number") vx_cm = 0;
  @type("number") vy_cm = 0;
  @type("number") tiltAngle = 0;
  @type("uint8") spin_pct = 0;
  @type("string") beyType = "";
}
```

Add to `GameState`:

```typescript
@type({ map: BeyGhostState }) beyGhosts: MapSchema<BeyGhostState> = new MapSchema();
```

### L3.3 filterBy on beyblades

All four battle rooms `onCreate()`: filter beyblades to ≤60cm + same floor. Spectators see all.

### L3.4 Ghost Population Tick

All rooms `tick()`: every 6 ticks (10Hz) populate `beyGhosts` from `beyblades`.

### L3.5 Client Tier Computation + Rendering

- Tier 2: full sprite, 1.0 opacity, particles, spin ring
- Tier 1: sprite 0.3 opacity, grayscale, no FX
- Tier 0: minimap dot only

Fade 200ms on tier change. Hysteresis: exit Tier 2 at 65cm.

### L3.6 Minimap Always beyGhosts

Minimap reads ONLY from `beyGhosts`. Never `beyblades`.

---

## Layer 4 — View Modes + HUD + BitBeast

**Spec:** `research/phases/phase-28-view-modes-hud-bitbeast.md`

> ⚠️ Before implementing `ThreeJSRenderer.ts`: amend CLAUDE.md to permit Three.js as client-only renderer.

### L4.1 RendererMode Field

```typescript
export type RendererMode = "2d" | "2.5d" | "3d";
// Add to ArenaConfig: rendererMode?: RendererMode; renderer3d?: Arena3DConfig;
// Add to ArenaState: @type("string") rendererMode: string = "2.5d";
```

### L4.2 Arena Builder Mode Selector

`[2D][2.5D][3D]` at top of arena configurator. Tilt panel hidden for 2D/3D. 3D Config tab shown for 3D only.

### L4.3 IGameRenderer Interface

File: `client/src/game/renderer/IGameRenderer.ts`

```typescript
export interface IGameRenderer {
  updateBey(id: string, state: Beyblade | BeyGhostState, tier: 0 | 1 | 2): void;
  updateArena(arenaState: ArenaState): void;
  emitParticle(type: string, x: number, y: number): void;
  setBitBeastVisible(
    side: "left" | "right",
    asset: BitBeastAssetDoc | null,
    visible: boolean,
  ): void;
  destroy(): void;
}
```

Refactor `PixiRenderer.ts` to implement interface. Create `ThreeJSRenderer.ts` stub.

### L4.4 RendererFactory

File: `client/src/game/renderer/RendererFactory.ts`

```typescript
export function createRenderer(
  mode: RendererMode,
  canvas: HTMLCanvasElement,
): IGameRenderer {
  if (mode === "3d") return new ThreeJSRenderer(canvas);
  return new PixiRenderer(canvas, { tiltEnabled: mode === "2.5d" });
}
```

### L4.5 HUD Components

Under `client/src/components/game/hud/`:

- `TopBar.tsx` — avatar, name, score, timer
- `AbilityIcons.tsx` — 3 icons (2D only), radial cooldown sweep
- `SPBar.tsx` — spin% bands: ≥75=green, ≥40=orange, ≥10=red, <10=rapid red
- `OpponentPanel.tsx` — nearest-8 from `beyGhosts`, re-sort every 10 ticks

`HUDRoot.tsx` — composes per `rendererMode`.

### L4.6 BitBeast System

- `BITBEAST_ASSETS: "bitbeast_assets"` in COLLECTIONS
- `bitBeastId?: string` on `BeybladeStats` in `client/src/types/game.ts`
- `BitBeastAssetsPage.tsx` at `/admin/bitbeast-assets`
- `BitBeastOverlay.tsx` — screen-space div, GIF/PNG, CSS radial gradient + pulse
- Server emits `"bitbeast-show"` on special activation / burst finish
- `scripts/seed-bitbeasts.js` — 6 entries

---

## Layer 5 — Engine Optimizations Phase 2 + 3

**Spec:** `research/phases/phase-24-engine-optimizations.md`

Phase 2 (after Layer 2 stable):

| ID  | Change                                                                                         |
| --- | ---------------------------------------------------------------------------------------------- |
| R3  | Bake arena floor to `RenderTexture`; re-bake on `tiltAngle` change only                        |
| R2  | Replace particle `Container` → `ParticleContainer(2000)`; Graphics → Sprite with shared 4×4 RT |
| R5  | LOD: hide detail layer on beys >400px from camera                                              |
| S2  | Pre-filter collision pairs by distance before `processCollisions()` (royale only)              |

Phase 3 (after Layer 3 stable):

| ID  | Change                                                                                         |
| --- | ---------------------------------------------------------------------------------------------- |
| N1  | Client-side prediction: run `applyBlendedMovement` locally; reconcile via lerp (5px threshold) |
| N2  | AoI culling — satisfied by Layer 3                                                             |

---

## Admin / Forms Checklist

### New Admin Pages

| Route                    | Component                | Status |
| ------------------------ | ------------------------ | ------ |
| `/admin/bitbeast-assets` | `BitBeastAssetsPage.tsx` | ❌     |

### Updated Admin Pages / Panels

| Page / File                        | Change                                                                | Status |
| ---------------------------------- | --------------------------------------------------------------------- | ------ |
| `CombosPage.tsx`                   | Upgrade effectId text input → `SearchableSelect` from `COMBO_EFFECTS` | ❌     |
| Arena `BasicsTab.tsx`              | Player Authority panel + maxDurationSeconds slider                    | ❌     |
| Arena `FeaturesTab.tsx`            | Authority badge per feature card                                      | ❌     |
| Arena configurator                 | Arena Sections, Loop Tracks, Elevation Zones tabs                     | ❌     |
| Arena configurator                 | `floorIndex` on obstacle form                                         | ❌     |
| Arena configurator (top)           | Renderer mode selector [2D][2.5D][3D]                                 | ❌     |
| Arena configurator                 | 3D Config tab                                                         | ❌     |
| `/admin/beyblade-systems` bey form | `bitBeastId` picker                                                   | ❌     |

### New Game-Side Components

| Component                                             | Status     |
| ----------------------------------------------------- | ---------- |
| `ControlBlendBar.tsx`                                 | ❌         |
| `TouchControls.tsx`                                   | ❌         |
| `Minimap.tsx` — Perspective tab + beyGhosts migration | ⚠️ PARTIAL |
| `RoyaleHUD.tsx`                                       | ❌         |
| `HUDRoot.tsx`                                         | ❌         |
| `hud/TopBar.tsx`                                      | ❌         |
| `hud/AbilityIcons.tsx`                                | ❌         |
| `hud/SPBar.tsx`                                       | ❌         |
| `hud/OpponentPanel.tsx`                               | ❌         |
| `BitBeastOverlay.tsx`                                 | ❌         |

### Seed Scripts

| Script                                            | Status |
| ------------------------------------------------- | ------ |
| `seed-mechanics.js` update (+4 docs)              | ❌     |
| `seed-gimmicks.js` update (+naturalMotion recipe) | ❌     |
| `seed-bitbeasts.js` new                           | ❌     |

---

## Execution Order

```
Session A (~1.5 hrs):
  1. P0.2 — upgrade effectId text input → SearchableSelect (CombosPage.tsx)
  2. L0.2 R1 — cullable=true on beybladeLayer, featureLayer, particleLayer
  3. L0.2 R4 — _lastSpins Map; skip shape redraw when spin bucket unchanged
  4. L0.3 B1/B2/B3 — EWD bearingFriction comment + seed fix
  5. L1.4 — 4 MechanicRegistry stub files + register
  → TSC zero-errors pass

Session B (~2 hrs):
  1. Verify geometryDef.ts, statDef.ts, behaviorDef.ts vs Phase 21 spec
  2. Verify 31 mechanics match mechanic_defs seed; patch any gaps
  → TSC zero-errors pass

Session C (~8 hrs — semi-autonomous control):
  L2A.1 → L2A.2 → L2A.3 → L2A.4 → L2A.5 → L2A.6 → L2A.7 →
  L2A.8 → L2A.9 → L2A.10 → L2A.11
  → TSC + TryoutGamePage test

Session D (~6 hrs — tiered AoI):
  L3.1 → L3.2 → L3.3 → L3.4 → L3.5 → L3.6 (Minimap migration + Perspective tab)
  → 2-player test: ghost appears at >60cm

Session E (~6 hrs — HUD + BitBeast):
  L4.1 → L4.3 → L4.4 → L4.5 → L4.6 → L4.2
  → TSC zero-errors pass

Session F (~8 hrs — arena builder + battle modes + presets):
  L2B.1–L2B.6 → L2C.1–L2C.8 → L2D.1–L2D.5
  → Royale zone drain test

Session G (~4 hrs — optimizations):
  L5 Phase 2 (R3, R2, R5, S2) → Phase 3 (N1)
  → 20-player royale bandwidth profiling
```

---

## Key Invariants (never break)

1. **No async in game tick** — `tick(deltaTime)` is synchronous.
2. **Zero TSC errors** — `cd client && npx tsc --noEmit` after every `.ts/.tsx` edit.
3. **Server-authoritative physics** — client sends `uint16` bitmask only.
4. **Seeded PRNG** — never `Math.random()`; always `createPRNG(hashString(matchId))`.
5. **MechanicRegistry for all behaviors** — new behavior = new handler.
6. **Minimap always beyGhosts** — never `state.beyblades` for minimap rendering.
7. **Physics always 2D** — renderer mode is client-only.
8. **1 cm = 24px** — `PX_PER_CM = 24`.
9. **Petal count is emergent** — never hardcode `petalCount` (batch-011 §D).
10. **EWD bearingFriction = 0.12** (single bearing); **B:D = 0.02** (ball bearings) — batch-013.

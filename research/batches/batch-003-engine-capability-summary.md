# Batch 003 — Engine Capability Summary

> **Stage 0D** — Synthesised from batch-000, batch-001, batch-002 and all 17 Stage-0C diagrams.
> All claims tagged: FACT | INFERENCE | SPECULATION | UNKNOWN

---

## 1. Physics Engine

### 1.1 Core Physics (Matter.js)

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| 2D rigid-body simulation | ✅ Complete | `Matter.Engine`, `Body.applyForce()` | FACT |
| Fixed 60Hz tick loop | ✅ Complete | `setSimulationInterval(dt, 1000/60)` | FACT |
| Beyblade circle bodies | ✅ Complete | `radius * 24` px from cm | FACT |
| Arena wall bodies | ✅ Complete | `arenaPixelRadius = min(w,h) * 0.45` | FACT |
| Collision detection | ✅ Complete | `Matter.Events 'collisionStart'` | FACT |
| Force application | ✅ Complete | `computeForceMagnitude(bey, arena)` | FACT |
| Slope / gravity wells | ✅ Complete | orbit force via `ArenaFeatureProcessor` | FACT |
| 3D simulation | ❌ Not built | type defined, no implementation | FACT |

### 1.2 Spin System

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `spin` 0–`maxSpin` per bey | ✅ Complete | schema field | FACT |
| `spinDecayRate` per tick | ✅ Complete | `8 × (1 − stamina × 0.001)` | FACT |
| `maxSpin = ceil(2000 × (1 + stamina × 0.0008))` | ✅ Complete | | FACT |
| `spinDirection` left/right | ✅ Complete | schema field | FACT |
| Spin-out elimination at spin=0 | ✅ Complete | | INFERENCE |
| Spin steal on collision | ✅ Complete | `spinStealFactor` × direction multiplier | FACT |
| Same-dir clash 0.5× steal | ✅ Complete | | FACT |
| Counter-dir clash 1.5× steal | ✅ Complete | | FACT |
| Sub-part spins (`MapSchema`) | ✅ Complete | `subPartSpins` per attachment index | FACT |
| `freeSpin` decay independent | ✅ Complete | | FACT |
| `bearingFriction → spinDecayMod` | ✅ Complete | `PartPhysics.ts` | FACT |
| Counter-rotation sequence (Dranzer GT) | ✅ Complete | `counterRotActive`, `counterRotStep`, `counterRotStepTick` | FACT |

### 1.3 Gyroscopic Wobble

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `stability = spin/maxSpin` threshold 0.4 | ✅ Complete | | FACT |
| Nutation wobble below 0.4 stability | ✅ Complete | seeded PRNG forces | FACT |
| `beyTiltAngle` 0°–90° | ✅ Complete | schema field | FACT |
| Seeded PRNG `createPRNG(hashString(matchId))` | ✅ Complete | `src/utils/prng.ts` + `hashString.ts` | FACT |
| Deterministic replay via seed | ✅ Complete | same matchId = same sequence | FACT |

### 1.4 2.5D Physics Extensions

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `resolveTipStats()` | ✅ Complete | `PartPhysics.ts` | FACT |
| `applyMaterialStats()` | ✅ Complete | | FACT |
| `spinBias` per tip | ✅ Complete | | FACT |
| `bearingFriction` per tip | ✅ Complete | | FACT |
| `ResolvedTipStats` / `ResolvedBeyStats` structs | ✅ Complete | | FACT |
| CP radial gate (±2mm tolerance) | ✅ Complete | prevents WD-rim CP at AR collision | FACT |
| Contact point arc-segment shape | ✅ Complete | `arcStart/arcEnd/rInner/rOuter` | FACT |
| Contact point legacy shape | ✅ Complete | `angle/width/radius/thickness` | FACT |
| `resolveCpBounds(cp)` normaliser | ✅ Complete | | FACT |
| 5-material damage table | ✅ Complete | abs/rubber/metal/pom/polycarbonate | FACT |

---

## 2. Combat System

### 2.1 Collision Damage

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `damageMultiplier = 1.0 + attack × 0.007` | ✅ Complete | | FACT |
| `damageReduction = 1 − defense × 0.003` | ✅ Complete | | FACT |
| Material-specific damage multipliers | ✅ Complete | 5-material table in `PhysicsEngine.ts` | FACT |
| `knockbackDistance` field | ✅ Complete | schema; applied on collision | FACT |
| `invulnerabilityChance` field | ✅ Complete | schema; checked on collision | FACT |
| `spinStealFactor = 0.1 × (1 + stamina × 0.02667)` | ✅ Complete | | FACT |

### 2.2 Special Moves

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| 5-phase state machine | ✅ Complete | idle→windup→executing→bleed→cooldown | FACT |
| QTE cancellation gate | ✅ Complete | opponents can cancel in executing phase | FACT |
| Invulnerability during executing phase | ✅ Complete | | FACT |
| `controlLockedUntilMs` during special | ✅ Complete | source: "special" | FACT |
| `SpecialMoveConfig` new pipeline schema | ✅ Defined | `shared/types/specialMove.ts` | FACT |
| Hardcoded `SpecialMoveDef` (old schema) | ✅ In constants | `server/constants/specialMoves.ts` — INCOMPATIBLE | FACT |
| Rooms wired to new `SpecialMoveConfig` | ❓ UNKNOWN | need to verify BattleRoom.onCreate Firestore load vs hardcoded | UNKNOWN |
| Step authoring in admin | ❌ Not built | `SpecialMovesPage` has no step editor | FACT |
| `cameraConfig` per step | ✅ Defined | field in `SpecialMoveConfig` | FACT |
| `cancelableByQTE` flag | ✅ Defined | field in `SpecialMoveConfig` | FACT |

### 2.3 Combos

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| 3-key sequence detection | ✅ Complete | `detectCombo()` sliding window | FACT |
| `perComboCooldown` Map | ✅ Complete | per-combo cooldown enforcement | FACT |
| `attachedComboIds` check on beyblade | ✅ Complete | bey must have combo attached | FACT |
| Power threshold check | ✅ Complete | cost deducted on activation | FACT |
| Type restriction (`universal` / type-specific) | ✅ Complete | | FACT |
| 6 trigger-based combos | ✅ Complete | `detectTriggerCombos()` | FACT |
| `on_hit_received` trigger | ✅ Complete | | FACT |
| `on_near_ring_out` trigger | ✅ Complete | | FACT |
| `on_low_spin` trigger | ✅ Complete | | FACT |
| `on_partner_near_ring_out` trigger | ✅ Complete | | FACT |
| `on_opponent_special_move` trigger | ✅ Complete | | FACT |
| `on_burst_attempt` trigger | ✅ Complete | | FACT |
| `effectId` field on ComboDoc | ❌ MISSING | combos collection has no effectId — orphaned | FACT |
| `ComboEffectDef` compiled BehaviorRef dispatch | ❌ Broken | only `movement.orbit` wired at runtime | FACT |
| Combo effect ceiling enforced | ✅ Complete | damageMultiplier ≤ 1.5, lockMs ≤ 300 | FACT |

### 2.4 Element Types

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `ElementTypeLoader` | ✅ Complete | Firestore matrix + `computeDynamicTypeMultiplier()` | FACT |
| Per-bey `elementTypes[]` | ✅ Complete | schema field | FACT |
| Dynamic type matchup multipliers | ✅ Complete | matrix loaded at room onCreate | FACT |

---

## 3. Arena System

### 3.1 Arena Features

| Feature | Runtime Processing | BehaviorRef Dispatch | Status |
|---------|-------------------|---------------------|--------|
| Speed paths (loops) | ✅ | N/A | Complete |
| Obstacles | ✅ | N/A | Complete |
| Pits | ✅ | N/A | Complete |
| Water bodies | ✅ | N/A | Complete |
| Portals | ✅ | N/A | Complete |
| Turrets | ✅ | N/A | Complete |
| Gravity wells | ✅ | movement.orbit only | Partial |
| Spin zones | ✅ | movement.orbit only | Partial |
| Bumps | ✅ | N/A | Complete |
| Floor hazard zones | ✅ | N/A | Complete |
| Self-rotation | ✅ | N/A | Complete |
| Trigger zones → BehaviorRef | ⚠️ | orbit ONLY | CRITICAL GAP |
| Switches (toggle/pulse/chain) | ✅ | N/A | Complete |
| Arena links (corridors) | ⚠️ Partial | partial physics | Partial |
| BeyLinks (multi-bey) | ⚠️ Partial | partial physics | Partial |

### 3.2 BehaviorRef Dispatch Gap

**CRITICAL**: `ArenaFeatureProcessor.executeBehavior()` switch statement:

```
movement.orbit → ✅ handled
ALL other behaviorIds → console.warn + return (no effect)
```

Missing dispatch cases:
- `factor.boost` / `factor.defense` / all `factor.*`
- `transform.become_X` / all `transform.*`
- `spawn.portal` / `spawn.projectile` / all `spawn.*`
- `movement.circle` / `movement.dash` / `movement.retreat`
- `arena.floor_override` / `arena.add_hazard` / all `arena.*`

### 3.3 Round Modifiers

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `MODIFIER_MAP` constant | ✅ Complete | loaded at room startup | FACT |
| `activeModifierIds` on GameState | ✅ Complete | schema field | FACT |
| Per-modifier effects applied per tick | ✅ Complete | | INFERENCE |
| `roundModifier_defs` Firestore collection | ❓ UNKNOWN | MODIFIER_MAP may be hardcoded only | UNKNOWN |

---

## 4. AI System

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| Medium difficulty | ✅ Complete | chase + attack + basic defense | FACT |
| Hard difficulty | ✅ Complete | 5-tick prediction, circle-strafe, dodge | FACT |
| Hell difficulty | ✅ Complete | 10-tick prediction, ring-out aware, combos | FACT |
| Legacy "easy" → medium collapse | ✅ Complete | defensive fallback | FACT |
| `computeInput()` pure per tick | ✅ Complete | no side effects | FACT |
| AI fires special move | ✅ Complete | Hell: immediately when chargeable | FACT |
| AI combo emission | ✅ Complete | Hell: ~every 2s, direction-aligned | FACT |

---

## 5. Multiplayer Infrastructure

### 5.1 Room Types

| Room | Max Clients | Series Format | AI Support | Status |
|------|-------------|--------------|-----------|--------|
| `tryout_room` | 1 | BO1 always | No | Complete |
| `battle_room` | 12 (4 + 8 spectators) | BO1/3/5 | No | Complete |
| `ai_battle_room` | 9 (1 + 8 spectators) | BO1/3/5 | Yes | Complete |
| `tournament_battle_room` | 10 (2 + 8 spectators) | BO1/3/5 | Yes | Complete |

### 5.2 Spectator Support

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| Spectator join with `{ spectate: true }` | ✅ Complete | | FACT |
| Full state sync to spectators | ✅ Complete | | FACT |
| `spectatorCount` field | ✅ Complete | schema field | FACT |
| `spectator:follow` message | ✅ Complete | client-side camera only | FACT |
| `spectatorFollowTargets` map | ✅ Complete | informational — camera is client-side | FACT |
| Kick spectators on all-players-leave | ✅ Complete | room disposes | FACT |

### 5.3 Series Format

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `options.bestOf` 1/3/5 | ✅ Complete | | FACT |
| `state.targetWins = ceil(bestOf/2)` | ✅ Complete | | FACT |
| `state.seriesWins MapSchema<uint8>` | ✅ Complete | keyed by userId | FACT |
| `resetForNextGame()` sync (no Firestore) | ✅ Complete | | FACT |
| `state.status = "series-finished"` | ✅ Complete | | FACT |

### 5.4 Tournament System

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `TournamentScheduler` singleton | ✅ Complete | polls Firestore every 30s | FACT |
| 3-min room cap (`endSeriesOnCap`) | ✅ Complete | | FACT |
| 5-min between-match gap | ✅ Complete | `advanceWinnerToNextRound()` | FACT |
| Both-ready early-start | ✅ Complete | `readyState` drives it | FACT |
| Quit walkover sweep | ✅ Complete | `processQuitWalkovers()` | FACT |
| `pendingMatchCallbacks` static map | ✅ Complete | room onCreate picks up callback | FACT |
| `isSeriesDraw` / `isDraw` on cap tie | ✅ Complete | | FACT |
| Leaderboard `tournamentPoints` scoring | ✅ Complete | win+2 / draw+1 / loss+0 | FACT |

---

## 6. Firestore Schema

### 6.1 Collections Present in COLLECTIONS constant (35 total)

```
beyblade_stats, arenas, matches, player_stats, users,
tournaments, tournament_participants, tournament_brackets,
combos, ai_battles, arena_theme_assets, obstacle_assets,
turret_assets, water_body_assets, portal_assets, sound_assets,
settings, beyblade_parts, beyblade_systems, arena_systems,
combo_effects, special_moves, element_types, behavior_defs,
round_modifiers, animation_presets, stadiums, mechanic_defs (missing),
gimmick_defs (missing), camera_profiles (missing), audio_profiles (missing)
```

### 6.2 Missing Collections (not in COLLECTIONS constant)

| Collection | Why Needed | Tag |
|-----------|-----------|-----|
| `mechanic_defs` | Gimmick behavior definitions — referenced by `gimmickIds[]` on parts | FACT |
| `gimmick_defs` | Reusable mechanic configurations — referenced by parts | FACT |
| `camera_profiles` | Per-move camera behavior scripts | FACT |
| `audio_profiles` | Per-event audio trigger configs | FACT |

---

## 7. Input System

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `uint16` bitmask encoding | ✅ Complete | 10 bits (bits 0–9) | FACT |
| Legacy `Record<string,boolean>` compat | ✅ Complete | `normalizeInput()` | FACT |
| `decodeBitmask()` in all rooms | ✅ Complete | | FACT |
| `controlLockedUntilMs` check | ✅ Complete | blocks movement if locked | FACT |
| Control lock source "special" | ✅ Complete | | FACT |
| Control lock source "combo" | ✅ Complete | | FACT |
| Gamepad support | ❌ Not built | type defined, bits reserved | FACT |

---

## 8. Rendering (Client)

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| PixiJS 8 WebGL renderer | ✅ Complete | | FACT |
| 5-layer stack | ✅ Complete | arena/features/beyblades/particles/HUD | FACT |
| `beyTiltAngle` visual tilt | ✅ Complete | synced from server | FACT |
| 2.5D contact point rendering | ✅ Complete | `renderRadius()` + Fourier profile | FACT |
| Arena self-rotation visual | ✅ Complete | synced `autoRotate` + `rotationSpeed` | FACT |
| ParticleSystem collision sparks | ✅ Complete | | INFERENCE |
| GIF animation support | ✅ Complete | bypass destructive image editor | FACT |
| `LoadingProgress` 6-step stepper | ✅ Complete | | FACT |

---

## 9. Admin UI (ALL MUST BE REBUILT FROM SCRATCH)

> **Note**: User confirmed all admin UI/forms will be rebuilt. This section documents requirements, not current state.

### 9.1 Pages Required

| Page | Route | Priority | Collections Managed |
|------|-------|----------|-------------------|
| Beyblade CRUD | `/admin/beyblades` | P0 | `beyblade_stats` |
| Arena CRUD | `/admin/arenas` | P0 | `arenas` |
| Special Move CRUD + step authoring | `/admin/special-moves` | P0 | `special_moves` |
| Combo CRUD + effectId link | `/admin/combos` | P0 | `combos` |
| Combo Effect CRUD + ComboTask editor | `/admin/combo-effects` | P0 | `combo_effects` |
| Gimmick CRUD | `/admin/gimmicks` | P1 | `gimmick_defs` |
| Mechanic CRUD | `/admin/mechanics` | P1 | `mechanic_defs` |
| Camera Profiles | `/admin/camera-profiles` | P2 | `camera_profiles` |
| Audio Profiles | `/admin/audio-profiles` | P2 | `audio_profiles` |
| 2.5D Part CRUD | `/admin/2d/` | P1 | `beyblade_parts` |
| Beyblade System CRUD | `/admin/bey-systems` | P1 | `beyblade_systems` |
| Arena System CRUD | `/admin/arena-systems` | P1 | `arena_systems` |
| Round Modifier CRUD | `/admin/round-modifiers` | P2 | `round_modifiers` |
| Element Types CRUD | `/admin/element-types` | P1 | `element_types` |
| Behavior Defs CRUD | `/admin/behavior-defs` | P2 | `behavior_defs` |
| Animation Presets CRUD | `/admin/animation-presets` | P2 | `animation_presets` |

### 9.2 UI Requirements (all forms)

- All `<select>` elements → `SearchableSelect` / `SearchableMultiSelect`
- Tab strips → `SearchableTabSelect` companion
- Stat validator: sum ≤ 360, per-stat max 150 shown inline
- Foreign key pickers: validate ref exists before save
- ComboTaskCompiler invoked server-side on combo effect save
- GIF uploads bypass image editor (preserve animation)

---

## 10. Critical Gaps Summary

| Gap | Severity | Location | Impact |
|-----|---------|---------|--------|
| `executeBehavior()` only handles `movement.orbit` | CRITICAL | `ArenaFeatureProcessor.ts` | All compiled ComboEffects + non-orbit SpecialMoveSteps silently no-op |
| `effectId` missing from `ComboDoc` | CRITICAL | `combos` Firestore collection | Combos cannot reference their effect |
| Hardcoded `SpecialMoveDef` vs `SpecialMoveConfig` incompatibility | HIGH | `server/constants/specialMoves.ts` | New step-based pipeline blocked |
| `mechanic_defs` / `gimmick_defs` not in COLLECTIONS | HIGH | `client/src/lib/firebase.ts` | Gimmick system cannot be loaded |
| `camera_profiles` / `audio_profiles` not in COLLECTIONS | MEDIUM | `client/src/lib/firebase.ts` | Camera scripts + audio triggers unavailable |
| No step editor in Special Moves admin | HIGH | admin UI (to be rebuilt) | SpecialMoveConfig steps cannot be authored |
| No ComboTask editor in Combo Effects admin | HIGH | admin UI (to be rebuilt) | ComboEffectDef tasks cannot be authored |
| Trigger zone BehaviorRef dispatch incomplete | CRITICAL | `ArenaFeatureProcessor.ts` | Arena trigger zones only support orbit |
| Gamepad support | LOW | `useGameInput.ts` | Bits reserved but not wired |
| 3D physics adapter | LOW | type defined | No implementation |

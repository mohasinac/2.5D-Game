# Batch 003 — Engine Capability Summary

> **Stage 0D** — Synthesised from batch-000 (admin audit), batch-001 (schema catalog), batch-002 (discovery table) and all Stage-0C diagrams.
> All claims tagged: FACT | INFERENCE | SPECULATION | UNKNOWN

---

## 1. Physics Engine

### 1.1 Core Physics (Matter.js)

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| 2D rigid-body simulation | ✅ Complete | `Matter.Engine`, `Body.applyForce()` | FACT |
| Fixed 60 Hz tick loop | ✅ Complete | `setSimulationInterval(dt, 1000/60)` | FACT |
| Beyblade circle bodies | ✅ Complete | `radius * 24` px from cm | FACT |
| Arena wall bodies | ✅ Complete | `arenaPixelRadius = min(w,h) * 0.45` | FACT |
| Arena bowl wall profile | ✅ Complete | `wallAngle` 0–75°; `resolveWallAngle()` redirects beys toward center | FACT |
| Collision detection | ✅ Complete | `Matter.Events 'collisionStart'` | FACT |
| Force application | ✅ Complete | `computeForceMagnitude(bey, arena)` | FACT |
| Spatial broad-phase | ✅ Complete | `spatialGrid.ts` — O(n) partitioning to avoid O(n²) pair checks | FACT |
| Slope / gravity wells | ✅ Complete | orbit force via `ArenaFeatureProcessor` | FACT |
| Arena shrink system | ✅ Complete | `ArenaState.effectiveRadius`; driven by `ArenaConfig.shrink` (startMs, endMs, minRadiusFraction) | FACT |
| Arena timeline events | ✅ Complete | `arenaTimeline[]` sorted by `triggerMs`; BattleRoom tracks `matchElapsedMs` + `timelineIndex` per tick | FACT |
| `PhysicsStrategy` interface | ✅ Complete | Pluggable lifecycle + entity + per-tick contract; 2D and 2.5D each implement it | FACT |
| 3D simulation | ✅ via 2.5D | 2.5D is the depth/3D layer: shape makers (Fourier profiles, arc-segment CPs) + perspective warps (tilt stack) + z-layer physics (beyTiltAngle, ClimbingPhysics) | DECISION |

### 1.2 Spin System

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `spin` 0–`maxSpin` per bey | ✅ Complete | schema field | FACT |
| `spinDecayRate` per tick | ✅ Complete | `8 × (1 − stamina × 0.001)` | FACT |
| `maxSpin = ceil(2000 × (1 + stamina × 0.0008))` | ✅ Complete | | FACT |
| `spinDirection` left / right | ✅ Complete | schema field | FACT |
| Spin-out elimination at spin = 0 | ✅ Complete | | FACT |
| Spin steal on collision | ✅ Complete | `spinStealFactor × direction multiplier` | FACT |
| Same-dir clash — 0.5× steal | ✅ Complete | | FACT |
| Counter-dir clash — 1.5× steal | ✅ Complete | | FACT |
| Sub-part spins (`MapSchema`) | ✅ Complete | `subPartSpins` per attachment index | FACT |
| `freeSpin` decay independent | ✅ Complete | | FACT |
| `bearingFriction → spinDecayMod` | ✅ Complete | `PartPhysics.ts` | FACT |
| Counter-rotation sequence (Dranzer GT) | ✅ Complete | `counterRotActive`, `counterRotStep`, `counterRotStepTick` | FACT |

### 1.3 Gyroscopic Wobble & Tilt

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `stability = spin/maxSpin` threshold 0.4 | ✅ Complete | | FACT |
| Nutation wobble below 0.4 stability | ✅ Complete | seeded PRNG forces | FACT |
| `beyTiltAngle` 0–360° | ✅ Complete | 0=upright, 90=on-side, 180=on-back, 270=on-head, 360=full rotation | FACT |
| Seeded PRNG `createPRNG(hashString(matchId))` | ✅ Complete | `prng.ts` + `hashString.ts` | FACT |
| Deterministic replay via seed | ✅ Complete | same matchId = same wobble sequence | FACT |
| `ClimbingPhysics.updateBeyTilt()` | ✅ Complete (2.5D only) | 4-force model: gyroscopic stabilization, impact tilt, gravity runaway (>20°), clamp 0–360 | FACT |
| `shouldBeRolling` at tilt > 45° | ✅ Complete (2.5D only) | | FACT |
| `wobbleAmplitude = tilt × spinRatio × 0.5` | ✅ Complete (2.5D only) | links to `GameState.wobbleAmplitude` | FACT |

### 1.4 Climbing & Adhesion (2.5D only)

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| Surface adhesion | ✅ Complete | `suctionForce / (mass/1000) >= effectiveGravity` → bey sticks to nearest surface | FACT |
| Wall climbing | ✅ Complete | `wallClimbFactor > 0` → friction accel = `effectiveGravity × wallClimbFactor × gripFactor` | FACT |
| `computeClimbingForces()` output | ✅ Complete | returns `adhesionAccel + adhesionDirection + wallClimbFrictionAccel`; caller applies via `applyForce` | FACT |
| Caller integration | ⚠️ Manual | Output not auto-applied; room must call `applyForce` with result | FACT |

### 1.5 2.5D Physics Extensions

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `resolveTipStats()` | ✅ Complete | `PartPhysics.ts` | FACT |
| `applyMaterialStats()` | ✅ Complete | | FACT |
| `spinBias` per tip | ✅ Complete | | FACT |
| `bearingFriction` per tip | ✅ Complete | | FACT |
| `ResolvedTipStats` / `ResolvedBeyStats` structs | ✅ Complete | | FACT |
| CP radial gate (±2 mm tolerance) | ✅ Complete | prevents WD-rim CP firing at AR collision radius | FACT |
| `freeSpin` roller → rubber multipliers | ✅ Complete | `getContactPointMultiplier()` forces rubber regardless of actual material | FACT |
| CP extend gimmick | ✅ Complete | `extendThreshold` + `extendedWidth`; CP expands angular width at high spin | FACT |
| Contact point arc-segment shape | ✅ Complete | `arcStart / arcEnd / rInner / rOuter` | FACT |
| Contact point legacy shape | ✅ Complete | `angle / width / radius / thickness` | FACT |
| `resolveCpBounds(cp)` normaliser | ✅ Complete | | FACT |
| 5-material damage table | ✅ Complete | abs / rubber / metal / pom / polycarbonate | FACT |
| `PART_MATERIALS` collection | ✅ Complete | per-material: gripFactor, aggressiveness, recoilFactor, surfaceFriction, density, durabilityDecay | FACT |

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
| Element type effectiveness matrix | ✅ Complete | loaded from Firestore at room onCreate; `computeDynamicTypeMultiplier()` applied after base damage | FACT |

### 2.2 Special Moves

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| 5-phase state machine | ✅ Complete | idle → windup → executing → bleed → cooldown | FACT |
| QTE cancellation gate | ✅ Complete | opponents complete key sequence during executing phase; attacker gets 80% power refund; requires attacker fired ≥30% combo slots this game | FACT |
| Invulnerability during executing phase | ✅ Complete | | FACT |
| `controlLockedUntilMs` during special | ✅ Complete | source: "special" | FACT |
| `SpecialMoveConfig` pipeline (new) | ✅ Active | each step references a `comboEffectId`; BattleRoom loads via `comboEffectsCache` from Firestore | FACT |
| Hardcoded `SpecialMoveDef` constant (legacy) | ✅ Exists | `server/constants/specialMoves.ts` — incompatible schema; NOT used by BattleRoom | FACT |
| Per-step `cameraConfig` | ✅ Defined | field in `SpecialMoveStep` | FACT |
| `cancelableByQTE` flag | ✅ Defined | field in `SpecialMoveConfig` | FACT |
| Step authoring in admin | ✅ Complete | `SpecialMovesPage` supports step sequences; QTE config fields still missing | FACT |

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
| Charged timing (`hold-to-charge`) | ✅ Complete | linear / quadratic / step scaling; per-tick power drain; `ComboChargeScale` on schema | FACT |
| Pulsed timing with formula shapes | ✅ Complete | arithmetic / exponential / sinusoidal / ramp_up / ramp_down / bell_curve | FACT |
| Combo effect ceiling enforced | ✅ Complete | `damageMultiplier ≤ 1.5`, `lockMs ≤ 300` | FACT |
| Inline `effect` sub-object on CombosPage | ✅ Complete | damageMultiplier, dashDirection, forceImpulse, durationMs, lockMs, spinStealBonus, microSpinBoost | FACT |
| `combo_effects` collection → `COMBO_EFFECTS` | ⚠️ Orphaned | No combo doc references COMBO_EFFECTS; inline effect and COMBO_EFFECTS are mutually orphaned — design decision pending | FACT |

### 2.4 Element Types

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `ElementTypeLoader` | ✅ Complete | Firestore matrix + `computeDynamicTypeMultiplier()` | FACT |
| Per-bey `elementTypes[]` | ✅ Complete | schema field | FACT |
| Dynamic type matchup multipliers | ✅ Complete | matrix loaded at room onCreate; applied after base damage | FACT |

### 2.5 Round Modifiers

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `MODIFIER_MAP` — 17 built-in modifiers | ✅ Complete | 4 categories: physics, combat, rules, chaos | FACT |
| Physics modifiers | ✅ Complete | double_gravity, low_gravity, ice_floor, sticky_floor, super_bounce, vacuum | FACT |
| Combat modifiers | ✅ Complete | hyper_speed, glass_cannon, stamina_mode, fragile_defense, burst_mania | FACT |
| Rules modifiers | ✅ Complete | free_combos, mega_special, arena_shrink_fast | FACT |
| Chaos modifiers | ✅ Complete | randomize_all, invert_controls, gravity_flip; `invertInputControls` applied per tick | FACT |
| `activeModifierIds` on `GameState` | ✅ Complete | schema field | FACT |
| `RoundModifiersPage` admin schema | ❌ Mismatch | Page stores name/type/magnitude/condition; runtime `RoundModifier` uses nested `physicsOverrides` + `globalFactors` + `ruleOverrides` + `chaosParams` — HIGH priority gap | FACT |

---

## 3. Arena System

### 3.1 Arena Features

| Feature | Runtime Processing | Admin Editor | Status |
|---------|-------------------|-------------|--------|
| Speed paths (loops) | ✅ | ✅ | Complete |
| Obstacles | ✅ | ✅ | Complete |
| Pits | ✅ | ✅ | Complete |
| Water bodies | ✅ | ✅ | Complete |
| Portals | ✅ | ✅ | Complete |
| Turrets | ✅ | ✅ | Complete |
| Gravity wells | ✅ | ✅ | Complete |
| Spin zones | ✅ | ✅ | Complete |
| Bumps | ✅ | ✅ | Complete |
| Floor hazard zones | ✅ | ✅ | Complete |
| Self-rotation (features) | ✅ | ✅ | Complete |
| Switch wiring (toggle/pulse/chain) | ✅ | ✅ | Complete |
| Arena shrink | ✅ | ❌ No timeline/shrink editor | Partial |
| Arena timeline events | ✅ | ❌ No timeline editor | Partial |
| Trigger zones → BehaviorRef dispatch | ⚠️ orbit only | ✅ | CRITICAL GAP |
| Arena links (corridors) | ⚠️ Partial physics | ✅ | Partial |
| BeyLinks (multi-bey) | ✅ Substantially implemented | ✅ | See §3.3 |

### 3.2 BehaviorRef Dispatch Gap

**CRITICAL**: `ArenaFeatureProcessor.executeBehavior()` handles exactly one case:

```
movement.orbit → ✅ handled
ALL other behaviorIds → console.warn + return (no effect)
```

Unhandled dispatch targets:
- `factor.boost` / `factor.defense` / all `factor.*`
- `transform.become_X` / all `transform.*`
- `spawn.portal` / `spawn.projectile` / all `spawn.*`
- `movement.circle` / `movement.dash` / `movement.retreat`
- `arena.floor_override` / `arena.add_hazard` / all `arena.*`

All compiled `ComboEffects` and `SpecialMoveSteps` that reference these behaviorIds silently no-op at runtime.

### 3.3 BeyLink System

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| Type definitions (9 config categories) | ✅ Complete | `ArenaLink`, `BeyLinkEffect` loaded in BattleRoom | FACT |
| QTE-gated escape system | ✅ Complete | `pendingBeyLinkQTE` with expiry + recovery key | FACT |
| `beyStackState` per session | ✅ Complete | partnerId, linkId, tickCount | FACT |
| `controlLossImmunity` / `activeControlLoss` | ✅ Complete | nextQTETick, recoveryKey, per-sessionId expiry | FACT |
| Hijack QTE (`pendingHijackQTE`) | ✅ Complete | blockKey + expiry; `hijackCooldowns` map | FACT |
| Rigid formation offset (cluster) | ✅ Complete | `rigidFormationOffset` relX/relY per cluster member | FACT |
| Full per-tick force coupling | ❓ UNKNOWN | State maps confirmed; tick-loop integration of linked forces not verified | UNKNOWN |
| Combination lock types | ✅ Defined | stack / helical / tandem / cluster; `linkStrain` 0→1 before breaking | FACT |

---

## 4. AI System

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| Medium difficulty | ✅ Complete | chase nearest + attack within 200 px + basic defense | FACT |
| Hard difficulty | ✅ Complete | 5-tick prediction, circle-strafe, dodge on closing speed > 3 | FACT |
| Hell difficulty | ✅ Complete | 10-tick prediction, ring-out aware, dodge threshold 2, combos ~every 2s | FACT |
| Legacy `"easy"` → medium collapse | ✅ Complete | defensive at constructor | FACT |
| `computeInput()` pure per tick | ✅ Complete | no side effects | FACT |
| AI fires special move | ✅ Complete | Hell: immediately when chargeable | FACT |
| AI combo slot evaluation | ✅ Complete | `AIComboSlot` with condition (maxRange, minPower, spinDir, minSpin, maxSpin) | FACT |
| AI `beyTiltAngle` awareness | ✅ Complete | snapshot includes tilt; `specialMoveActive` opponent flag | FACT |
| Per-slot cooldowns | ✅ Complete | `slotCooldowns` Map keyed by effectId | FACT |

---

## 5. Multiplayer Infrastructure

### 5.1 Room Types

| Room | Max Clients | Series Format | AI Support | Status |
|------|-------------|--------------|-----------|--------|
| `tryout_room` | 1 | BO1 always | No | Complete |
| `battle_room` | 12 (4 + 8 spectators) | BO1/3/5 | No | Complete |
| `ai_battle_room` | 9 (1 + 8 spectators) | BO1/3/5 | Yes | Complete |
| `tournament_battle_room` | 10 (2 + 8 spectators) | BO1/3/5 | Yes | Complete |

Max 20 simultaneous rooms — enforced by `tryReserveRoom()` / `releaseRoom()`; overridable via `globalSettings.maxActiveRooms` at room `onCreate`.

### 5.2 Shared Modules

| Module | Purpose | Tag |
|--------|---------|-----|
| `SeriesManager.ts` | `determineGameWinner`, `recordGameWin`, `buildSeriesScore`, `isSeriesOver`, `resetStateForNextGame` — shared by all room types | FACT |
| `ArenaFeatureProcessor.ts` | `processArenaFeatures()` — pure function extracts arena loop/water/pit/obstacle tick processing; replaces per-room duplication | FACT |
| `spatialGrid.ts` | O(n) spatial partitioning for collision broad-phase | FACT |
| `bitmask.ts` | `encodeBitmask` / `decodeBitmask` + `normalizeInput` legacy compat | FACT |
| `roomCounter.ts` | `tryReserveRoom` / `releaseRoom` — 20-room cap | FACT |

### 5.3 Spectator Support

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| Spectator join with `{ spectate: true }` | ✅ Complete | | FACT |
| Full state sync to spectators | ✅ Complete | | FACT |
| `spectatorCount` field | ✅ Complete | schema field | FACT |
| `spectator:follow` message | ✅ Complete | client-side camera only | FACT |
| Kick spectators on all-players-leave | ✅ Complete | room disposes | FACT |

### 5.4 Series Format

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `options.bestOf` 1/3/5 | ✅ Complete | | FACT |
| `state.targetWins = ceil(bestOf/2)` | ✅ Complete | | FACT |
| `state.seriesWins MapSchema<uint8>` | ✅ Complete | keyed by userId | FACT |
| `resetForNextGame()` sync | ✅ Complete | no Firestore reads | FACT |
| `state.status = "series-finished"` | ✅ Complete | 5s before room dispose | FACT |

### 5.5 Tournament System

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `TournamentScheduler` singleton | ✅ Complete | polls Firestore every 30s | FACT |
| 3-min room cap (`endSeriesOnCap`) | ✅ Complete | | FACT |
| 5-min between-match gap | ✅ Complete | `advanceWinnerToNextRound()` | FACT |
| Both-ready early-start | ✅ Complete | `readyState` drives it | FACT |
| Quit walkover sweep | ✅ Complete | `processQuitWalkovers()` | FACT |
| `pendingMatchCallbacks` static map | ✅ Complete | room `onCreate` picks up callback | FACT |
| `isSeriesDraw` / `isDraw` on cap tie | ✅ Complete | | FACT |
| Leaderboard `tournamentPoints` scoring | ✅ Complete | win +2 / draw +1 / loss +0 | FACT |

---

## 6. Firestore Schema

### 6.1 Collections in `COLLECTIONS` constant

```
beyblade_stats, arenas, matches, player_stats, users,
tournaments, tournament_participants, tournament_brackets,
combos, ai_battles, arena_theme_assets, obstacle_assets,
turret_assets, water_body_assets, portal_assets, sound_assets,
settings, beyblade_parts, beyblade_systems, arena_systems,
combo_effects, special_moves, element_types, behavior_defs,
round_modifiers, animation_presets, stadiums,
part_materials (new), ai_battles (new)
```

### 6.2 Missing Collections (used at runtime, no COLLECTIONS entry or admin page)

| Collection | Runtime Usage | Admin Page | COLLECTIONS Entry | Tag |
|-----------|--------------|-----------|------------------|-----|
| `mechanic_defs` | `loadGimmickDefs()` in `BattleRoom.onCreate` | ❌ Missing | ❌ Missing | FACT |
| `gimmick_defs` | `expandGimmicks()` in `BattleRoom.onCreate` — **active at runtime** | ❌ Missing | ❌ Missing | FACT |
| `camera_profiles` | Referenced by `SpecialMoveStep.cameraConfig` | ❌ Missing | ❌ Missing | FACT |
| `audio_profiles` | Referenced by audio event triggers | ❌ Missing | ❌ Missing | FACT |

### 6.3 Orphaned / Mismatched Collections

| Collection | Issue | Tag |
|-----------|-------|-----|
| `combo_effects` | No combo doc references `COMBO_EFFECTS`; combos use inline `effect` sub-object; two schemas are mutually orphaned | FACT |
| `round_modifiers` | Admin page schema (name/type/magnitude/condition) incompatible with runtime `RoundModifier` type (nested override objects) | FACT |
| `animation_presets` | No referencing `animationPresetId` field in any SpecialMove / Combo / BehaviorDef doc | FACT |

---

## 7. Input System

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| `uint16` bitmask encoding — 10 bits | ✅ Complete | bits 0–9 | FACT |
| Legacy `Record<string,boolean>` compat | ✅ Complete | `normalizeInput()` | FACT |
| `decodeBitmask()` in all rooms | ✅ Complete | | FACT |
| `controlLockedUntilMs` check | ✅ Complete | blocks movement if locked | FACT |
| Control lock source "special" | ✅ Complete | | FACT |
| Control lock source "combo" | ✅ Complete | | FACT |
| `invertInputControls` round modifier | ✅ Complete | applied per tick when `invert_controls` modifier active | FACT |
| Gamepad support | ❌ Not built | bits reserved, not wired | FACT |

---

## 8. Rendering (Client)

| Capability | Status | Notes | Tag |
|-----------|--------|-------|-----|
| PixiJS 8 WebGL renderer | ✅ Complete | | FACT |
| 5-layer stack | ✅ Complete | arena / features / beyblades / particles / HUD | FACT |
| `beyTiltAngle` visual tilt | ✅ Complete | synced from server | FACT |
| 2.5D contact point rendering | ✅ Complete | `renderRadius()` + Fourier profile | FACT |
| Arena self-rotation visual | ✅ Complete | synced `autoRotate` + `rotationSpeed` | FACT |
| ParticleSystem collision sparks | ✅ Complete | | INFERENCE |
| GIF animation support | ✅ Complete | bypasses destructive image editor | FACT |
| `LoadingProgress` 6-step stepper | ✅ Complete | | FACT |

---

## 9. Admin UI

> All admin pages have been rebuilt. This section documents current coverage and remaining gaps.

### 9.1 Pages — Current Coverage

| Category | Pages | Status |
|----------|-------|--------|
| Beyblade CRUD (Create 5-step, Edit) | 2 | ✅ Complete |
| Arena CRUD (Create, Edit) | 2 | ✅ Complete |
| Arena Systems (List, Create, Edit) | 3 | ✅ Complete |
| 2.5D Parts (List, Create, Edit) | 3 | ✅ Complete |
| 2.5D Beyblade Systems (List, Create, Edit) | 3 | ✅ Complete |
| Special Moves (inline CRUD) | 1 | ✅ Step sequences built; QTE config fields missing |
| Combos (inline CRUD) | 1 | ✅ Inline effect sub-object |
| Combo Effects (inline CRUD) | 1 | ✅ Built; orphaned from combos (§6.3) |
| Behavior Defs (inline CRUD) | 1 | ✅ Complete |
| Round Modifiers (inline CRUD) | 1 | ⚠️ Schema mismatch vs runtime `RoundModifier` |
| Arena Feature Configs (inline CRUD) | 1 | ✅ Complete |
| BeyLink Configs (inline CRUD) | 1 | ✅ Complete |
| Animation Presets (inline CRUD) | 1 | ✅ Built; no referencing field in any behavior |
| Turret Attack Types (inline CRUD) | 1 | ✅ Complete |
| Element Types (List, Edit) | 2 | ✅ Complete |
| Tournament Admin (List, Create, Edit, Detail) | 4 | ✅ Complete |
| Asset Libraries (Sound, Portal, Obstacle, Turret, WaterBody, ArenaTheme, ParticlePresets) | 7 | ✅ Complete |
| Dashboard / Stats / Settings | 3 | ✅ Complete |
| Users | 1 | ✅ Complete |
| Arena Floor Groups | 2 | ✅ Complete |
| AI Battles (inline CRUD) | 1 | ✅ Complete; `AI_BATTLES` in COLLECTIONS |
| Part Materials (inline CRUD) | 1 | ✅ Complete; `PART_MATERIALS` in COLLECTIONS |
| Test Pages (ArenaTest, AIVsAITest) | 2 | ✅ Complete |

### 9.2 Missing Pages (Plan-Required)

| Page | Route | Priority | Collection |
|------|-------|----------|-----------|
| Gimmick CRUD | `/admin/gimmicks` | P0 | `gimmick_defs` — loaded at runtime, no admin |
| Mechanic CRUD | `/admin/mechanics` | P0 | `mechanic_defs` |
| Camera Profiles | `/admin/camera-profiles` | P1 | `camera_profiles` |
| Audio Profiles | `/admin/audio-profiles` | P1 | `audio_profiles` |

### 9.3 Field Gaps (Existing Pages)

| Page | Missing Field | Impact |
|------|--------------|--------|
| Beyblade Create/Edit | `gimmickIds[]` | Gimmick composition per-bey unavailable |
| Beyblade Create/Edit | `spinStealPoints` (create wizard only) | Still edit-only |
| Special Moves | QTE config fields | `cancelableByQTE` + sequence cannot be authored |
| Arena Configurator | `ArenaConfig.shrink` fields | Arena shrink uneditable |
| Arena Configurator | `arenaTimeline[]` event editor | Timeline events uneditable |
| Arena Configurator | `wallAngle` field | Bowl profile uneditable |
| Combo Effects | `PulseIntervalFormula` / `PulseIntensityFormula` | Rich formula shapes not exposed |
| Round Modifiers | Full schema replacement needed | See §6.3 |

---

## 10. Critical Gaps Summary

| Gap | Severity | Location | Impact |
|-----|---------|---------|--------|
| `executeBehavior()` handles only `movement.orbit` | CRITICAL | `ArenaFeatureProcessor.ts` | All compiled ComboEffects + non-orbit SpecialMoveSteps silently no-op |
| `combo_effects` / inline `effect` orphan | HIGH | `combos` + `combo_effects` Firestore | Design decision required: retire one schema or re-link both |
| `gimmick_defs` loaded at runtime — no admin UI | HIGH | `BattleRoom.onCreate` + missing admin page | Gimmicks cannot be managed; `mechanic_defs` same |
| `RoundModifiersPage` schema incompatible with runtime | HIGH | `RoundModifiersPage.tsx` + `roundModifier.ts` | Modifiers created via admin will not work at runtime |
| Arena shrink + timeline events not editable in admin | MEDIUM | Arena admin configurator | Designers cannot author time-gated arena events |
| `camera_profiles` / `audio_profiles` not in COLLECTIONS | MEDIUM | `client/src/lib/firebase.ts` | Camera scripts + audio triggers unloadable |
| `animationPresetId` missing from all behavior docs | MEDIUM | `special_moves`, `combos`, `behavior_defs` | Animation presets remain a standalone taxonomy with no wiring |
| `wallAngle` + `ArenaConfig.shrink` not in admin forms | LOW | Arena admin | Designers cannot configure bowl depth or shrink |
| Gamepad support | LOW | `useGameInput.ts` | Bits reserved, not wired |
| ~~3D physics adapter~~ | N/A | — | Not planned; game is 2D/2.5D only |

---

[← Batch 002: Discovery Table](batch-002-discovery-table.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 004: MFB Parts Disambiguation →](batch-004-mfb-parts-disambiguation.md)

---
batch: 002
stage: 0B
status: complete
sources_checked: 0
facts: 32
inferences: 4
speculations: 3
unknowns: 0
---

## Research Completed

New Discovery Table for Stage 0B — consolidates all engine capabilities and gaps discovered in batch-000 (admin audit) and batch-001 (schema catalog). Every row carries a FACT/INFERENCE/SPECULATION/UNKNOWN tag. Source for all FACTs is the codebase (direct code reading). No external sources required at this stage — tags reflect code-confirmed vs. inferred items.

---

## Coverage Table

| Category | Count Discovered | Coverage | Missing |
|----------|-----------------|----------|---------|
| Colyseus schema fields | 80+ | complete | none |
| Engine systems (server) | 12 | complete | none |
| Admin form pages | 48 | complete | none |
| Missing Firestore collections | 4 critical | complete | — |
| BehaviorRef handlers | 1 of ~20 | CRITICAL GAP | 19+ missing |
| Special move pipeline | full type system | complete | runtime linkage missing |
| Multi-engine support | 2D full / 2.5D partial / 3D none | assessed | 3D adapter |

---

## New Discovery Table

| # | Discovery | Category | Existing Support | Missing Support | Tag |
|---|-----------|----------|-----------------|----------------|-----|
| 1 | **BehaviorRef dispatcher handles only `movement.orbit`** — all compiled action types (factor.boost, transform.become_X, spawn.X, movement.X, arena.X) produce warnings and are skipped at runtime | ENGINE GAP | Compiler builds correct BehaviorRef[] | Runtime dispatcher in ArenaFeatureProcessor | FACT |
| 2 | **ComboTask compiler is fully implemented** — 5 action types (multiplier, transformation, spawning, movement, arena_effect) with all subtypes compile to BehaviorRef[] | ENGINE CAPABILITY | comboTaskCompiler.ts | None at compile time | FACT |
| 3 | **SpecialMove uses ComboEffectDef pipeline** — each step references a `comboEffectId`; specials are NOT standalone but are orchestrated sequences of ComboEffectDef effects | ENGINE DESIGN | specialMove.ts SpecialMoveStep | Admin form only has metadata (name, cooldown) — no step authoring UI | FACT |
| 4 | **Hardcoded SPECIAL_MOVES constant exists separately from Firestore pipeline** — `server/constants/specialMoves.ts` has 5 moves with their own schema (SpecialMoveDef + effects{}) that is INCOMPATIBLE with the new SpecialMoveConfig/SpecialMoveStep pipeline | ENGINE INCONSISTENCY | SPECIAL_MOVES constant used by legacy rooms | New pipeline uses SpecialMoveConfig; gap = two schemas, no migration | FACT |
| 5 | **DetachedBodySchema enables projectile→obstacle→removed lifecycle** for sub-part detachments (mini-beys, fragments, projectiles) | ENGINE CAPABILITY | GameState.ts DetachedBodySchema | 3D adapter | FACT |
| 6 | **Combination lock types defined on Beyblade schema** — stack / helical / tandem / cluster; linkStrain 0→1 before breaking | ENGINE CAPABILITY | GameState.ts combinationLocked + linkedBeyId + combinationType + linkStrain | Full physics for linked movement not confirmed | FACT |
| 7 | **BeyLink system fully type-defined** — 9 config categories, ArenaLink, BeyLinkEffect types loaded in BattleRoom | ENGINE CAPABILITY | BattleRoom.ts imports ArenaLink/BeyLink types | Runtime physics for linked movement partially implemented | FACT |
| 8 | **Round modifiers active at runtime** — `activeModifierIds` in GameState, `MODIFIER_MAP` imported in BattleRoom | ENGINE CAPABILITY | GameState + BattleRoom | Admin page exists (RoundModifiersPage) but no arena or beyblade links to specific modifier IDs | FACT |
| 9 | **5-material damage/spin/recoil matrix** — abs, rubber, metal, pom, polycarbonate; each with damage, spinSteal, recoil multipliers | ENGINE CAPABILITY | PhysicsEngine MATERIAL_MULTIPLIERS | Other materials (nylon, acetal, zinc) not mapped | FACT |
| 10 | **Contact point radial gate** — CP only fires if contact radius ≈ cp.radius ±2mm; prevents WD rim from firing at AR collision radius | ENGINE DESIGN | PhysicsEngine checkRadialContactMatch | Multi-layer CPs (different radii = different part layers) fully supported | FACT |
| 11 | **Free-spin roller override** — roller.freeSpin=true forces rubber material multipliers regardless of actual roller material | ENGINE CAPABILITY | PhysicsEngine getContactPointMultiplier | — | FACT |
| 12 | **CP extend gimmick** — a CP can expand its angular width at high spin (extendThreshold, extendedWidth); existing CP matching honours this | ENGINE CAPABILITY | PhysicsEngine CP matching | Admin CP editor fields exist | FACT |
| 13 | **Combo trigger types** — 6 event-driven triggers beyond sequence detection: on_hit_received, on_near_ring_out, on_low_spin, on_partner_near_ring_out, on_opponent_special_move, on_burst_attempt | ENGINE CAPABILITY | comboTask.ts ComboTrigger | detectTriggerCombos in comboSystem | FACT |
| 14 | **Charged timing type** — combos can require hold-to-charge input with linear/quadratic/step scaling and per-tick power drain | ENGINE CAPABILITY | comboTask.ts ComboTiming charged type | ComboChargeScale on Beyblade schema | FACT |
| 15 | **Pulsed timing with formula shapes** — pulse count/interval/intensity can use arithmetic, exponential, sinusoidal, ramp_up, ramp_down, bell_curve formulas | ENGINE CAPABILITY | comboTask.ts PulseIntervalFormula / PulseIntensityFormula | Rich authoring system; admin form doesn't expose these | FACT |
| 16 | **Arena shrink system** — `effectiveRadius` on ArenaState; when > 0 overrides full arena radius | ENGINE CAPABILITY | GameState ArenaState.effectiveRadius | No admin field for shrink config on ArenaConfig | FACT |
| 17 | **QTE cancellation gate for specials** — opponents complete key sequence during EXECUTING to cancel attacker's move; attacker gets 80% power refund on success; requires attacker fired ≥30% combo slots this game | ENGINE CAPABILITY | specialMoveSystem.ts | Admin form has no QTE config fields | FACT |
| 18 | **Bey-to-arena-feature transformation** — TransformationAction can turn a beyblade into gravity_well, obstacle, spin_zone, turret, hazard, portal temporarily | ENGINE CAPABILITY | comboTask.ts TransformationAction types | BeyTransformState in ArenaFeatureProcessor shows runtime scaffolding exists | FACT |
| 19 | **29 stat delta keys** across numeric, positional, and string categories — including: burstResistance, tiltResistance, gravityMult, bounceRestitution, suctionForce, wallClimbFactor | ENGINE CAPABILITY | comboTask.ts StatDeltaKey | admin ComboEffects form doesn't show these keys in any structured editor | FACT |
| 20 | **Seeded PRNG from matchId** — `createPRNG(hashString(matchId))` produces deterministic wobble sequence; same matchId always produces same wobble pattern | ENGINE DESIGN | prng.ts + hashString.ts | Replays possible if matchId and all inputs are recorded | FACT |
| 21 | **spatialGrid.ts** — O(n) spatial partitioning for collision broad-phase | ENGINE CAPABILITY | spatialGrid.ts | Used to reduce O(n²) pair checking | FACT |
| 22 | **Maximum 20 simultaneous rooms** — enforced by tryReserveRoom/releaseRoom; all room types check this | ENGINE CONSTRAINT | roomCounter.ts | Global constraint, not per-room-type | FACT |
| 23 | **8 input keys encode to uint16 bitmask** — moveLeft(0), moveRight(1), moveUp(2), moveDown(3), attack(4), defense(5), dodge(6), jump(7), chargeHeld(8), specialTap(9) | ENGINE DESIGN | bitmask.ts + CLAUDE.md | Server accepts both encoded number and legacy Record object | FACT |
| 24 | **Element type effectiveness matrix loaded from Firestore** — `loadElementTypeMatrix()` + `computeDynamicTypeMultiplier()` | ENGINE CAPABILITY | elementTypeLoader.ts | Applied after collision damage calculation in BattleRoom | FACT |
| 25 | **SeriesManager is a shared module** — determineGameWinner, recordGameWin, buildSeriesScore, isSeriesOver, resetStateForNextGame; used by all room types | ENGINE DESIGN | SeriesManager.ts import in BattleRoom | All room types share identical series logic | FACT |
| 26 | **ArenaFeatureProcessor is a shared module** — processArenaFeatures() extracts the arena loop/water/pit/obstacle processing that was duplicated in each room | ENGINE DESIGN | ArenaFeatureProcessor.ts comment | Pure function takes beyblade + arena config + dt + bridge | FACT |
| 27 | **No mechanic_defs or gimmick_defs in COLLECTIONS constant or admin pages** | ADMIN GAP | firebase.ts COLLECTIONS | 4 missing collections: mechanic_defs, gimmick_defs, camera_profiles, audio_profiles | FACT |
| 28 | **BeybladeCreate wizard does not expose elementTypes/specialMoveId/comboIds** — users must go to edit page post-creation | ADMIN UX GAP | BeybladeCreatePage.tsx (steps 0–3) | Medium priority UX gap | FACT |
| 29 | **Combos and ComboEffects are orphaned collections** — CombosPage has no effectId field; ComboEffectsPage has no referencing combo; engine can't resolve what a combo does | DATA MODEL GAP | CombosPage + ComboEffectsPage | Link field `effectId` on combo doc is missing | FACT |
| 30 | **BeybladeEditPage has no gimmickIds field** — plan Stage 8 requires gimmick composition per beyblade | ADMIN GAP | BeybladeEditPage code | gimmick_defs collection + gimmickIds field on beyblade stats | FACT |
| 31 | **AnimationPresets not linked from any mechanic/combo/special** — standalone taxonomy with no referencing link from any behavior system | DATA MODEL GAP | AnimationPresetsPage | animationPresetId reference field missing from SpecialMoves/Combos/BehaviorDefs | FACT |
| 32 | **Arena wall has bowl profile** (wallAngle 0–75) — steeper bowl redirects beys toward center on wall contact via resolveWallAngle() | ENGINE CAPABILITY | ArenaState.wallAngle + ArenaUtils.ts | Admin ArenaConfigurator should expose this | FACT |
| 33 | **RoundModifiers runtime linked via MODIFIER_MAP** — `MODIFIER_MAP` translates modifierType strings to engine operations; `activeModifierIds[]` on GameState | ENGINE CAPABILITY | INFERENCE from BattleRoom import | MODIFIER_MAP contents not fully read yet — need to read roundModifier.ts | INFERENCE |
| 34 | **3D engine adapter does not exist** | ENGINE GAP | No 3D-specific physics files found in server/ | Would require separate physics library (Cannon.js, Rapier, etc.) | INFERENCE |
| 35 | **BeyLink physics partially implemented** — ArenaLink/BeyLink types are imported in BattleRoom but full multi-bey linking collision behavior is uncertain | ENGINE STATUS | Imports confirmed; implementation depth unknown | Need to read BattleRoom tick loop for BeyLink processing | INFERENCE |
| 36 | **Firestore special_moves collection is NOT the source for the runtime special move pipeline** — rooms still use hardcoded SPECIAL_MOVES constant; the Firestore pipeline exists as admin UI but may not be loaded at room onCreate | ENGINE STATUS UNKNOWN | Two separate schemas exist | Need to read BattleRoom.onCreate to confirm which source is used | INFERENCE |

---

## Existing Stat Mapping Table

| Research Finding | Wrong (New Field) | Right (Existing Field) | Tag |
|-----------------|-------------------|----------------------|-----|
| Bearing tip (B:D, EWD) low friction | `bearingFriction: float32` | Lower `spinDecayRate` via lower `staminaPoints`; `spinStealResist: 1.0` | FACT |
| Rubber flat tip (RF, R2F) high grip | `rubberGripBonus` | Higher `gripFactor` + `aggressiveness` via material cascade | FACT |
| Engine gear reserve | `engineGearCharge` | `coreReserveRemaining` + `attackBuffTimer` | FACT |
| Counter-rotation direction sequence | `counterRotBonus` | Existing `counterRotActive/Step/StepTick` on Beyblade schema | FACT |
| Burst suppression mechanism | `subLayerBurst` | `burstResistance` (0–100) modified by mechanics at runtime | FACT |
| Mode-change tip behavior | `fdPhase: uint8` | `activePartConfigs["tip"]` + per-tick re-resolution via `resolveTipStats()` | FACT |
| Sub-part independent spin | `subPartAngMom` | `subPartSpins: MapSchema<number>` already in schema | FACT |
| Jump-core hop state | `jumpCoreActive` | `airborneTicksRemaining` + `jumpFacingAngle` | FACT |
| Spin-steal link (same-direction penalty) | `spinTransferRate` | `spinStealFactor × stealMultiplier` (0.5× same-spin, 1.5× counter-spin) | FACT |
| Element effectiveness | `elementMatchBonus` | `computeDynamicTypeMultiplier()` applied post-collision | FACT |

---

## Multi-Engine Support Table

| Feature | 2D Implementation | 2.5D Implementation | 3D Implementation | Shared Behavior |
|---------|------------------|--------------------|--------------------|----------------|
| Beyblade movement | Matter.js forces + velocity | Same + tipOffsetX/Y eccentricity | ❌ Not built | applyForce / setVelocity |
| Collision detection | Matter.Collision.collides (SAT) | + CP radial gate + arc-segment CPs | ❌ | checkBeybladeCollision |
| Spin physics | angularVelocity | + subPartSpins (MapSchema) | ❌ | setAngularVelocity |
| Wall bounce | circular wall segments | + bowl angle redirect | ❌ | resolveWallAngle |
| Special moves | SpecialMoveState machine | Same (comboSlots/pipeline) | ❌ | specialMoveSystem |
| Combos | detectCombo + history | Same + trigger-based | ❌ | comboSystem |
| BehaviorRef execution | movement.orbit ONLY | movement.orbit ONLY | ❌ | CRITICAL GAP |
| Element types | elementTypeLoader matrix | Same | ❌ | computeDynamicTypeMultiplier |
| Gyro wobble | PRNG < 40% spin | + beyTiltAngle separate | ❌ | prng + hashString |
| Arena hazards (all 7) | Full processing | Full processing | ❌ | ArenaFeatureProcessor |
| Sub-part detachment | DetachedBodySchema | Same + 2.5D body shape | ❌ | tickDetachedBody |
| Combination lock | Schema fields | Schema fields | ❌ | BeyLink system |
| Round modifiers | MODIFIER_MAP runtime | Same | ❌ | activeModifierIds |
| Arena rotation | advanceArenaRotation | Same | ❌ | rotation state machine |
| Arena shrink | effectiveRadius | Same | ❌ | — |

---

## linka/ Discrepancies
(Stage 0B does not use linka/ — all discoveries from code reading)

## Failed Retrievals
(none — code-reading only)

## Missing Data
| Item | What's Missing | Next Search | Priority |
|------|---------------|-------------|---------|
| roundModifier.ts MODIFIER_MAP contents | Exact modifier-type → engine-operation mapping | Read shared/types/roundModifier.ts | MED |
| BattleRoom.onCreate special moves loading | Confirms whether Firestore pipeline or hardcoded SPECIAL_MOVES used | Read server/rooms/BattleRoom.ts onCreate section | HIGH |
| BeyLink physics depth in tick loop | Whether BeyLink collision/force is actually applied each tick | Read BattleRoom tick loop for BeyLink branch | MED |
| ClimbingPhysics.ts full capabilities | Surface-adherence, wall-climb physics | Read server/physics/ClimbingPhysics.ts | MED |
| PhysicsStrategy.ts role | Shared physics strategy between engines | Read server/shared/physics/PhysicsStrategy.ts | LOW |

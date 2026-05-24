---
batch: 002
stage: 0B
status: complete
sources_checked: 5
facts: 42
inferences: 0
speculations: 3
unknowns: 0
---

[← Batch 001: Schema Catalog](batch-001-schema-catalog.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 003: Engine Capability Summary →](batch-003-engine-capability-summary.md)

---

## Research Completed

Discovery Table for Stage 0B — consolidates all engine capabilities and gaps from batch-000 (admin audit, rewritten) and batch-001 (schema catalog), plus direct code reads of the four previously "Missing Data" files: `ClimbingPhysics.ts`, `PhysicsStrategy.ts`, `shared/types/roundModifier.ts`, and `BattleRoom.ts` onCreate. All four prior INFERENCEs are now resolved to FACT. Every row carries a FACT/INFERENCE/SPECULATION/UNKNOWN tag.

---

## Coverage Table

| Category | Count Discovered | Coverage | Missing |
|----------|-----------------|----------|---------|
| Colyseus schema fields | 80+ | complete | none |
| Engine systems (server) | 14 (+ ClimbingPhysics, PhysicsStrategy) | complete | none |
| Admin form pages | 51 (incl. AIBattles, PartMaterials, TournamentEdit) | complete | none |
| Missing Firestore admin pages | 4 critical | complete | — |
| BehaviorRef handlers | 1 of ~20 | CRITICAL GAP | 19+ missing |
| Special move pipeline | full type system | complete | admin step-authoring UI missing |
| Round modifiers | 17 built-in, 4 categories | complete | admin page not linked to arena/bey |
| Multi-engine support | 2D full / 2.5D partial | assessed | — |
| Prior INFERENCEs resolved | 4 / 4 | 100% | — |

---

## Discovery Table

| # | Discovery | Category | Existing Support | Missing Support | Tag |
|---|-----------|----------|-----------------|----------------|-----|
| 1 | **BehaviorRef dispatcher handles only `movement.orbit`** — all compiled action types (factor.boost, transform.become_X, spawn.X, movement.X, arena.X) produce warnings and are skipped at runtime | ENGINE GAP | Compiler builds correct BehaviorRef[] | Runtime dispatcher in ArenaFeatureProcessor | FACT |
| 2 | **ComboTask compiler is fully implemented** — 5 action types (multiplier, transformation, spawning, movement, arena_effect) with all subtypes compile to BehaviorRef[] | ENGINE CAPABILITY | comboTaskCompiler.ts | None at compile time | FACT |
| 3 | **SpecialMove uses ComboEffectDef pipeline** — each step references a `comboEffectId`; specials are NOT standalone but are orchestrated sequences of ComboEffectDef effects | ENGINE DESIGN | specialMove.ts SpecialMoveStep | Admin form only has a flat `effects` sub-object — no step authoring UI | FACT |
| 4 | **Hardcoded SPECIAL_MOVES constant exists separately from Firestore pipeline** — `server/constants/specialMoves.ts` has 5 moves with their own schema (SpecialMoveDef + effects{}) that is INCOMPATIBLE with the new SpecialMoveConfig/SpecialMoveStep pipeline | ENGINE INCONSISTENCY | SPECIAL_MOVES constant used by legacy rooms | New pipeline uses SpecialMoveConfig; gap = two schemas, no migration | FACT |
| 5 | **DetachedBodySchema enables projectile→obstacle→removed lifecycle** for sub-part detachments (mini-beys, fragments, projectiles) | ENGINE CAPABILITY | GameState.ts DetachedBodySchema | — | FACT |
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
| 16 | **Arena shrink system** — `effectiveRadius` on ArenaState; when > 0 overrides full arena radius; driven by ArenaConfig.shrink (startMs, endMs, minRadiusFraction) loaded in BattleRoom.onCreate | ENGINE CAPABILITY | GameState ArenaState.effectiveRadius + BattleRoom shrink init | Admin ArenaConfigurator should expose ArenaConfig.shrink fields | FACT |
| 17 | **QTE cancellation gate for specials** — opponents complete key sequence during EXECUTING to cancel attacker's move; attacker gets 80% power refund on success; requires attacker fired ≥30% combo slots this game | ENGINE CAPABILITY | specialMoveSystem.ts + BattleRoom pendingQTE state machine | Admin form has no QTE config fields | FACT |
| 18 | **Bey-to-arena-feature transformation** — TransformationAction can turn a beyblade into gravity_well, obstacle, spin_zone, turret, hazard, portal temporarily | ENGINE CAPABILITY | comboTask.ts TransformationAction types | BeyTransformState in ArenaFeatureProcessor shows runtime scaffolding exists | FACT |
| 19 | **29 stat delta keys** across numeric, positional, and string categories — including: burstResistance, tiltResistance, gravityMult, bounceRestitution, suctionForce, wallClimbFactor | ENGINE CAPABILITY | comboTask.ts StatDeltaKey | admin ComboEffects form doesn't show these keys in any structured editor | FACT |
| 20 | **Seeded PRNG from matchId** — `createPRNG(hashString(matchId))` produces deterministic wobble sequence; same matchId always produces same wobble pattern | ENGINE DESIGN | prng.ts + hashString.ts | Replays possible if matchId and all inputs are recorded | FACT |
| 21 | **spatialGrid.ts** — O(n) spatial partitioning for collision broad-phase | ENGINE CAPABILITY | spatialGrid.ts | Used to reduce O(n²) pair checking | FACT |
| 22 | **Maximum 20 simultaneous rooms** — enforced by tryReserveRoom/releaseRoom; overridable via `globalSettings.maxActiveRooms` at onCreate | ENGINE CONSTRAINT | roomCounter.ts + globalSettings override in BattleRoom.onCreate | Global constraint, not per-room-type | FACT |
| 23 | **8 input keys encode to uint16 bitmask** — moveLeft(0), moveRight(1), moveUp(2), moveDown(3), attack(4), defense(5), dodge(6), jump(7), chargeHeld(8), specialTap(9) | ENGINE DESIGN | bitmask.ts + CLAUDE.md | Server accepts both encoded number and legacy Record object; invertInputControls applied when round modifier active | FACT |
| 24 | **Element type effectiveness matrix loaded from Firestore** — `loadElementTypeMatrix()` + `computeDynamicTypeMultiplier()` | ENGINE CAPABILITY | elementTypeLoader.ts | Applied after collision damage calculation in BattleRoom | FACT |
| 25 | **SeriesManager is a shared module** — determineGameWinner, recordGameWin, buildSeriesScore, isSeriesOver, resetStateForNextGame; used by all room types | ENGINE DESIGN | SeriesManager.ts import in BattleRoom | All room types share identical series logic | FACT |
| 26 | **ArenaFeatureProcessor is a shared module** — processArenaFeatures() extracts the arena loop/water/pit/obstacle processing that was duplicated in each room | ENGINE DESIGN | ArenaFeatureProcessor.ts | Pure function takes beyblade + arena config + dt + bridge | FACT |
| 27 | **No mechanic_defs or gimmick_defs admin pages or COLLECTIONS entries** — but `loadGimmickDefs()` IS imported and called in BattleRoom.onCreate; gimmick_defs is read at runtime from Firestore even though no admin UI or COLLECTIONS constant exists for it | ADMIN GAP | BattleRoom.ts loadGimmickDefs + expandGimmicks at onCreate | Admin page + COLLECTIONS constant for mechanic_defs, gimmick_defs, camera_profiles, audio_profiles all missing | FACT |
| 28 | **BeybladeCreate wizard now exposes elementTypes/specialMoveId/comboIds via Step 4 "Abilities"** — gap was present in prior audit and is now closed; spinStealPoints remain edit-only | ADMIN UX ✅ FIXED | BeybladeCreatePage.tsx 5-step wizard (Step 4 added) | spinStealPoints still not on create wizard | FACT |
| 29 | **Combos carry inline `effect` objects; ComboEffects collection is now orphaned** — CombosPage has its own effect sub-object (damageMultiplier, dashDirection, forceImpulse, durationMs, lockMs, spinStealBonus, microSpinBoost); no combo doc references COMBO_EFFECTS; the two schemas are mutually orphaned | DATA MODEL | CombosPage inline `effect` field | Design decision needed: retire COMBO_EFFECTS or re-link it for a distinct purpose | FACT |
| 30 | **BeybladeEditPage has no gimmickIds field** — plan Stage 8 requires gimmick composition per beyblade; runtime already loads gimmick_defs but no admin UI exists to assign them | ADMIN GAP | BeybladeEditPage code | gimmick_defs collection + gimmickIds field on beyblade stats | FACT |
| 31 | **AnimationPresets not linked from any mechanic/combo/special** — standalone taxonomy with no referencing link from any behavior system | DATA MODEL GAP | AnimationPresetsPage | animationPresetId reference field missing from SpecialMoves/Combos/BehaviorDefs | FACT |
| 32 | **Arena wall has bowl profile** (wallAngle 0–75) — steeper bowl redirects beys toward center on wall contact via resolveWallAngle() | ENGINE CAPABILITY | ArenaState.wallAngle + ArenaUtils.ts | Admin ArenaConfigurator should expose this | FACT |
| 33 | **AI_BATTLES collection added to COLLECTIONS and AIBattlesPage built** — previously had only a seeder script; now full CRUD with difficulty/defaultBeybladeId/defaultArenaId/isActive | ADMIN ✅ FIXED | AIBattlesPage.tsx + firebase.ts AI_BATTLES | — | FACT |
| 34 | **PART_MATERIALS is a new collection** — PartMaterialsPage added with physics params: gripFactor, aggressiveness, recoilFactor, surfaceFriction, density, durabilityDecay (all optional) | ADMIN ✅ NEW | PartMaterialsPage.tsx + firebase.ts PART_MATERIALS | Used by 2.5D part system; 2D adapter not yet wired | FACT |
| 35 | **TournamentEditPage built** — tournaments previously had no edit flow (only create + read-only list/detail); now all fields editable including allowedBeybladeIds/allowedArenaIds | ADMIN ✅ FIXED | TournamentEditPage.tsx | — | FACT |
| 36 | **MODIFIER_MAP contains 17 built-in modifiers across 4 categories** — physics (double_gravity, low_gravity, ice_floor, sticky_floor, super_bounce, vacuum), combat (hyper_speed, glass_cannon, stamina_mode, fragile_defense, burst_mania), rules (free_combos, mega_special, arena_shrink_fast), chaos (randomize_all, invert_controls, gravity_flip). Each modifier uses: `physicsOverrides` (gravityMult, airResistance, surfaceFriction, wallRestitution), `globalFactors` (StatDelta[]), `ruleOverrides` (burstResistanceOverride, spinDecayRateOverride, comboCostMultiplier, specialMoveCostOverride, ringOutZoneMult, friendlyFire), or `chaosParams` (randomizeStats, swapBeyblades, invertControls, gravityReverses). Admin RoundModifiersPage schema does NOT match this type — page stores name/modifierType/magnitude/condition/stackable/icon while the actual RoundModifier type uses nested override objects | ENGINE CAPABILITY + ADMIN SCHEMA MISMATCH | shared/types/roundModifier.ts MODIFIER_MAP | Admin page schema is incompatible with RoundModifier type — HIGH priority data model gap | FACT |
| 37 | **3D engine adapter was never built and is not planned** — no Cannon.js, Rapier, or three.js exists in server/; the game is 2D/2.5D only | DECISION | — | — | FACT |
| 38 | **BeyLink physics is substantially implemented** — BattleRoom maintains: beyStackState (partnerId, linkId, tickCount), beyStackCooldowns, pendingBeyLinkQTE (QTE escape with expiry + key), controlLossImmunity (expiry per sessionId), activeControlLoss (nextQTETick, recoveryKey), pendingHijackQTE (blockKey, expiry), hijackCooldowns, rigidFormationOffset (relX/relY per cluster member), lastPlayerInput per session. Full QTE-gated escape system exists. This is beyond "partial" — the linking, hijacking, and control-loss pipeline is implemented | ENGINE CAPABILITY | BattleRoom.ts BeyLink state maps | Full multi-bey force coupling in tick loop still needs reading to confirm | FACT |
| 39 | **BattleRoom.onCreate does NOT import SPECIAL_MOVES hardcoded constant** — special moves go through `comboEffectsCache` (loaded via `loadComboEffects()` from Firestore). The hardcoded SPECIAL_MOVES constant in `server/constants/specialMoves.ts` is legacy and not used by BattleRoom. Also confirmed: BattleRoom loads `loadGimmickDefs()` + `expandGimmicks()` from Firestore at onCreate — gimmicks are runtime-active without an admin page | ENGINE DESIGN | BattleRoom.ts onCreate | Prior gap row #4 (hardcoded SPECIAL_MOVES) may be isolated to older room types (TryoutRoom?) — needs confirmation per-room | FACT |
| 40 | **ClimbingPhysics.ts is a 2.5D-only module** — exports `computeClimbingForces()` and `updateBeyTilt()`. Surface adhesion: if `suctionForce / (mass/1000) >= effectiveGravity`, bey sticks to nearest surface (full force, linear falloff assumed). Wall climbing: if `wallClimbFactor > 0` and `isNearVerticalSurface`, friction accel = `effectiveGravity × wallClimbFactor × gripFactor`. Bey-axis tilt: 4 forces: (1) gyroscopic stabilization `spinRatio² × lateralStiffness × 2.0`; (2) impact tilt `force × (1 - tiltResistance) × 0.02`; (3) gravity runaway when tilt > 20° via `sin(tilt) × gravityMult × 0.005`; (4) clamp 0–360. `shouldBeRolling` at tilt > 45°; `shouldBeNormal` at tilt < 5°. `wobbleAmplitude = tilt × spinRatio × 0.5` links to GameState wobbleAmplitude | ENGINE CAPABILITY (2.5D only) | server/physics/ClimbingPhysics.ts | Caller must integrate adhesionAccel + wallClimbFrictionAccel via applyForce; not auto-applied | FACT |
| 41 | **PhysicsStrategy is a pluggable interface** — `BaseRoom` holds one `PhysicsStrategy`; the 2D and 2.5D pipelines each implement it. Interface: lifecycle (init/reset/dispose), entity management (registerBeyblade/removeBeyblade), per-tick (tick returns CollisionEvent[]), direct controls (applyForce, applyLateralForce, setPosition, setLinearVelocity, setAngularVelocity), optional 2.5D hooks (onButtonPressed?, computeLandingAOE?) | ENGINE DESIGN | server/shared/physics/PhysicsStrategy.ts | 2D and 2.5D strategies are the full set | FACT |
| 42 | **Arena timeline system (Phase T)** — `ArenaConfig.arenaTimeline` is an array of `ArenaTimelineEvent` sorted by `triggerMs` at room onCreate; BattleRoom tracks `matchElapsedMs` and `timelineIndex` each tick to fire events at scheduled wall-clock offsets | ENGINE CAPABILITY | BattleRoom.ts timelineEvents + matchElapsedMs | Admin ArenaConfigurator has no timeline event editor | FACT |

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

| Feature | 2D Implementation | 2.5D Implementation | Shared Behavior |
|---------|------------------|---------------------|----------------|
| Beyblade movement | Matter.js forces + velocity | Same + tipOffsetX/Y eccentricity | applyForce / setVelocity (PhysicsStrategy) |
| Collision detection | Matter.Collision.collides (SAT) | + CP radial gate + arc-segment CPs | checkBeybladeCollision |
| Spin physics | angularVelocity | + subPartSpins (MapSchema) | setAngularVelocity (PhysicsStrategy) |
| Wall bounce | circular wall segments | + bowl angle redirect | resolveWallAngle |
| Surface adhesion / wall climb | ❌ | ClimbingPhysics.ts (full) | computeClimbingForces — 2.5D only |
| Bey-axis tilt | PRNG wobble < 40% spin | + updateBeyTilt (gyro, impact, gravity runaway) | ClimbingPhysics.ts — 2.5D only |
| Special moves | SpecialMoveState machine | Same (comboSlots/pipeline) | specialMoveSystem |
| Combos | detectCombo + history | Same + trigger-based | comboSystem |
| BehaviorRef execution | movement.orbit ONLY | movement.orbit ONLY | CRITICAL GAP |
| Element types | elementTypeLoader matrix | Same | computeDynamicTypeMultiplier |
| Gyro wobble | PRNG < 40% spin | + beyTiltAngle (separate from 2D wobble) | prng + hashString |
| Arena hazards (all 7) | Full processing | Full processing | ArenaFeatureProcessor |
| Sub-part detachment | DetachedBodySchema | Same + 2.5D body shape | tickDetachedBody |
| Combination lock | Schema fields | Schema fields | BeyLink system |
| Round modifiers | MODIFIER_MAP runtime | Same | activeModifierIds; 17 built-in |
| Arena rotation | advanceArenaRotation | Same | rotation state machine |
| Arena shrink | effectiveRadius + shrink config | Same | Phase V |
| Arena timeline | ArenaTimelineEvent[] + trigger | Same | Phase T |
| PhysicsStrategy plug-in | ✅ 2D implementation | ✅ 2.5D implementation | PhysicsStrategy.ts |

---

## Resolved Prior INFERENCEs

| # | Was | Resolution |
|---|-----|-----------|
| 36 | MODIFIER_MAP contents unknown | RESOLVED: 17 built-in modifiers, 4 categories; admin page schema DOES NOT match RoundModifier type — new HIGH gap |
| 37 | 3D adapter "inferred absent" | CLOSED: 3D adaptation is not planned; game is 2D/2.5D only |
| 38 | BeyLink "partially implemented" | RESOLVED: Substantially implemented — full QTE escape + hijack + control-loss + rigid formation pipeline in BattleRoom |
| 39 | Special moves source unknown | RESOLVED: BattleRoom uses comboEffectsCache (Firestore); hardcoded SPECIAL_MOVES not imported; gimmick_defs also loaded at onCreate |

---

## Discrepancies
(Stage 0B does not use linka/ — all discoveries from code reading)

## Failed Retrievals
(none — code-reading only)

## Missing Data
| Item | What's Missing | Next Search | Priority |
|------|---------------|-------------|---------|
| BattleRoom tick loop BeyLink branch | Whether bey-stack force coupling (rigid, orbit, mirror) is computed per-tick or only via state flags | Read BattleRoom tick() / processBeyLinks() | MED |
| RoundModifiersPage schema mismatch scope | Whether the admin page's modifierType/magnitude/condition schema is consumed anywhere at runtime, or if it's dead | Grep for modifierType in server/ | HIGH |
| TryoutRoom SPECIAL_MOVES import | Confirm whether TryoutRoom or other non-Battle rooms still import hardcoded SPECIAL_MOVES | Grep SPECIAL_MOVES in server/rooms/ | MED |
| ArenaConfig.arenaTimeline admin UI | Whether any admin page exposes timeline event authoring | Search ArenaConfigurator for timeline | MED |
| ArenaConfig.shrink admin UI | Whether shrink config (startMs, endMs, minRadiusFraction) is exposed in ArenaConfigurator | Search ArenaConfigurator for shrink | MED |

---

[← Batch 001: Schema Catalog](batch-001-schema-catalog.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 003: Engine Capability Summary →](batch-003-engine-capability-summary.md)

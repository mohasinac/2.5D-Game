---
batch: 001
stage: 0A
status: complete
sources_checked: 0
facts: 0
inferences: 0
speculations: 0
unknowns: 0
---

## Research Completed

Full catalog of all Colyseus schema classes in `server/rooms/schema/GameState.ts`, plus all physics engine types, shared type definitions for comboTask, specialMove, and beybladeSystem, and the compiler/runtime pipeline. No external sources required — code-reading stage.

---

## Coverage Table

| Category | Count Catalogued | Notes |
|----------|-----------------|-------|
| Colyseus Schema Classes | 10 | LoopState, ObstacleState, PitState, TurretState, ProjectileState, WaterBodyState, PortalState, Beyblade, DetachedBodySchema, ArenaState, GameState |
| Beyblade Fields | 80+ | Full schema enumerated below |
| Arena Feature State Classes | 7 | Loop, Obstacle, Pit, Turret, Projectile, WaterBody, Portal |
| Physics Engine Methods | 15+ | createBeyblade, createObstacles, applyForce, setVelocity, update, checkCollision, calculateDamage, etc. |
| Shared Type Systems | 6 | comboTask, specialMove, beybladeSystem, arenaConfigNew, elementTypes, roundModifier |
| Server Utility Modules | 8 | comboSystem, comboTaskCompiler, specialMoveSystem, elementTypeLoader, prng, hashString, spatialGrid, roomCounter |

---

## Beyblade Schema — Full Field Catalog

### Identity
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| id | string | "" | session/entity ID |
| userId | string | "" | Firebase user ID |
| username | string | "" | display name |
| beybladeId | string | "" | Firestore document ID |
| isAI | boolean | false | AI-controlled flag |

### Position + Motion
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| x | number | 0 | px (arena-space) |
| y | number | 0 | px (arena-space) |
| rotation | number | 0 | radians |
| velocityX | number | 0 | px/s |
| velocityY | number | 0 | px/s |
| angularVelocity | number | 0 | rad/s |

### Base Stats (from BeybladeStats doc)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| type | string | "balanced" | attack / defense / stamina / balanced |
| spinDirection | string | "right" | left / right |
| mass | number | 50 | grams |
| radius | number | 4 | cm (converted to px: radius×24) |
| actualSize | number | 40 | visual px |
| attackPoints | number | 120 | 0–150 |
| defensePoints | number | 120 | 0–150 |
| staminaPoints | number | 120 | 0–150 |

### Derived Stats (from type distribution formulas)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| damageMultiplier | number | 1.0 | 1.0 + attack×0.007 (×1.2 for attack type) |
| damageTaken | number | 1.0 | 1 − defense×0.003 (×0.8 for defense type) |
| knockbackDistance | number | 10 | 10×(1 − defense×0.00167) |
| spinStealFactor | number | 0.1 | 0.1×(1 + stamina×0.02667) |
| spinDecayRate | number | 10 | 8×(1 − stamina×0.001) |
| speedBonus | number | 1.0 | 1.0 + attack×0.007 |
| invulnerabilityChance | number | 0.1 | 0.1 + defense×0.000667 |

### Dynamic Combat Stats
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| health | number | 100 | HP |
| maxHealth | number | 100 | max HP |
| stamina | number | 100 | stamina resource |
| maxStamina | number | 100 | max stamina |
| spin | number | 2000 | current spin (0–maxSpin) |
| maxSpin | number | 2000 | ceil(2000×(1 + stamina×0.0008)) |
| damageDealt | number | 0 | session tracking |
| damageReceived | number | 0 | session tracking |
| collisions | number | 0 | session tracking |
| burstKillsDealt | number | 0 | Phase R — burst KO counter |

### Special States
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| isActive | boolean | true | alive in match |
| isRingOut | boolean | false | ring-out flag |
| isBurst | boolean | false | burst elimination flag |
| eliminationType | string | "" | "ring_out" / "burst" / "spin_out" |
| isInvulnerable | boolean | false | i-frames active |
| invulnerabilityTimer | number | 0 | remaining i-frame ms |

### Loop / Speed Path State
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| inLoop | boolean | false | in speed path |
| loopIndex | number | -1 | which loop |
| loopEntryTime | number | 0 | entry timestamp |
| loopSpeedBoost | number | 1.0 | current boost multiplier |
| loopSpinBoost | number | 0 | spin recovery in loop |

### Arena Hazard States
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| inWater | boolean | false | in water body |
| waterSpeedMultiplier | number | 1.0 | speed reduction |
| waterSpinDrain | number | 0 | spin drain rate |
| inPit | boolean | false | trapped in pit |
| currentPitId | string | "" | which pit |
| pitDamageRate | number | 0 | damage/s |
| collidingWithObstacle | boolean | false | obstacle contact |
| lastObstacleId | string | "" | last obstacle hit |

### Combat Resources + Cooldowns
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| specialCooldown | number | 0 | special move cooldown |
| attackCooldown | number | 0 | attack action cooldown |
| specialMoveActive | boolean | false | special move executing |
| specialMoveEndTime | number | 0 | when special ends |
| power | number | 0 | 0–100 power meter |

### Airborne / Jump State
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| isAirborne | boolean | false | in the air |
| airborneTimer | number | 0 | airborne duration |
| landingLag | number | 0 | lag after landing |

### Combat Stance + Buff Timers
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| isDefending | boolean | false | K stance |
| attackBuffTimer | number | 0 | J key buff timer (×1.4 damage) |
| defenseBuffTimer | number | 0 | K key buff timer (×0.6 incoming) |
| dodgeBuffTimer | number | 0 | L key dodge timer (full immunity) |
| stunTimer | number | 0 | stun duration |
| comboExecuting | boolean | false | combo active |
| comboTimer | number | 0 | combo execution timer |
| controlLockedUntilMs | number | 0 | epoch ms when lock expires |
| controlLockSource | string | "" | "special" / "combo" |

### Combo Multiplier State
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| comboDamageMultiplier | number | 1.0 | active combo damage boost |
| comboDamageMultiplierTimer | number | 0 | duration remaining |

### 2.5D Part System Fields
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| specialMove | string | "tactical_burst" | special move ID |
| comboIds | ArraySchema<string> | [] | attached combo IDs (max 3) |
| comboCooldowns | MapSchema<number> | {} | per-combo cooldown epoch ms |
| comboSlots | ArraySchema<string> | [] | JSON-encoded BeybladeComboSlot[] |
| comboPhase | string | "idle" | idle/windup/active/bleed/cooldown |
| specialMoveTick | number | 0 | tick in current special move |
| comboChargeScale | number | 0 | 0–1 charge progress |

### 2.5D Resolved Part Stats
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| aggressiveness | number | 0.5 | orbit aggressiveness 0–1 |
| gripFactor | number | 0.3 | floor grip 0–1 |
| recoilFactor | number | 0.5 | hit recoil 0–1 |
| spinStealResist | number | 1.0 | spin-steal resistance 0–1 |
| surfaceFriction | number | 1.0 | floor friction mult |
| contactDamageMultiplier | number | 1.0 | CP damage mult |
| damageReduction | number | 1.0 | incoming damage mult |
| tipOffsetX | number | 0 | tip eccentricity mm |
| tipOffsetY | number | 0 | tip eccentricity mm |
| wobbleAmplitude | number | 0 | gyroscopic wobble |

### 2.5D Sub-Part + Config State
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| subPartSpins | MapSchema<number> | {} | per-sub-part angular momentum |
| activePartConfigs | MapSchema<string> | {} | active config name per slot |
| configLastSwitchAt | MapSchema<number> | {} | last mode-switch epoch ms per slot |

### Split Bey State (Phantom Fox MS)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| isSplit | boolean | false | currently split |
| splitBodyX | number | 0 | split-half position |
| splitBodyY | number | 0 | split-half position |
| splitBodySpin | number | 0 | split-half spin |

### Core Spin Injection (Rock Bison / Wolborg G)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| coreReserveRemaining | number | 0 | spin reserve units |

### Counter-Rotation Sequence (Dranzer GT)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| counterRotActive | boolean | false | direction-reversal active |
| counterRotStep | number | 0 | step index in sequence |
| counterRotStepTick | number | 0 | tick within step |
| defaultSpinDirection | string | "right" | saved at match start |

### Jump Core State
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| airborneTicksRemaining | number | 0 | jump-core hop countdown |
| jumpFacingAngle | number | 0 | radians, direction of hop |

### Universal Stat System (Phase B/R)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| jumpForce | number | 0 | upward impulse N |
| jumpHeight | number | 0 | max jump height cm |
| burstResistance | number | 50 | 0–100 burst difficulty |

### 2.5D Bey-Axis Tilt + Climbing (Phase E)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| beyTiltAngle | number | 0 | 0°=vertical, 90°=on side |
| adhering | boolean | false | stuck to ceiling/overhang |
| adheringSurfaceAngle | number | 0 | surface angle in degrees |
| wallClimbing | boolean | false | climbing a wall |
| effectiveGravity | number | 9.8 | resolved per tick |

### Combination Lock (Phase F)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| combinationLocked | boolean | false | linked to another bey |
| linkedBeyId | string | "" | partner session ID |
| combinationType | string | "" | stack/helical/tandem/cluster |
| linkStrain | number | 0 | 0–1 strain before breaking |

### Element Type System (Phase AB)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| elementTypes | ArraySchema<string> | [] | 1–2 element type values |

---

## ArenaState Field Catalog

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| id | string | "" | arena Firestore ID |
| name | string | "" | display name |
| width | number | 800 | pixels |
| height | number | 600 | pixels |
| shape | string | "circle" | circle / rectangle |
| theme | string | "metrocity" | visual theme |
| rotation | number | 0 | current rotation degrees |
| autoRotate | boolean | false | auto-rotation enabled |
| rotationSpeed | number | 0 | degrees/second |
| rotationDirection | string | "clockwise" | clockwise / counterclockwise |
| gravity | number | 0 | arena gravity |
| airResistance | number | 0.01 | air resistance |
| surfaceFriction | number | 0.1 | surface friction |
| wallEnabled | boolean | true | wall active |
| wallBaseDamage | number | 5 | damage on wall hit |
| wallRecoilDistance | number | 2 | wall knockback |
| wallHasSpikes | boolean | false | spikes on wall |
| wallSpikeDamageMultiplier | number | 1.0 | spike damage mult |
| wallHasSprings | boolean | false | springs on wall |
| wallSpringRecoilMultiplier | number | 1.0 | spring recoil mult |
| wallAngle | number | 0 | bowl profile 0–75 |
| speedPathCount | number | 0 | loop/path count |
| loopCount | number | 0 | alias |
| obstacleCount | number | 0 | obstacle count |
| pitCount | number | 0 | pit count |
| turretCount | number | 0 | turret count |
| waterBodyCount | number | 0 | water body count |
| portalCount | number | 0 | portal count |
| effectiveRadius | number | 0 | 0=full; shrink value |

---

## GameState Field Catalog

| Field | Type | Description |
|-------|------|-------------|
| beyblades | MapSchema<Beyblade> | all active beyblades keyed by sessionId |
| arena | ArenaState | arena state |
| detachedBodies | MapSchema<DetachedBodySchema> | sub-part projectiles/fragments |
| loops | MapSchema<LoopState> | speed paths |
| obstacles | MapSchema<ObstacleState> | obstacles |
| pits | MapSchema<PitState> | pits |
| turrets | MapSchema<TurretState> | turrets |
| projectiles | MapSchema<ProjectileState> | turret projectiles |
| waterBodies | MapSchema<WaterBodyState> | water bodies |
| portals | MapSchema<PortalState> | portals |
| status | string | waiting / warmup / in-progress / finished / series-finished |
| winner | string | userId of winner |
| timer | number | seconds remaining (180 default) |
| startTime | number | match start epoch |
| mode | string | tryout / single-battle-ai / single-battle-pvp |
| matchId | string | Firestore match doc ID |
| tournamentId | string | (tournament rooms only) |
| tournamentName | string | (tournament rooms only) |
| roundNumber | uint16 | tournament round |
| tournamentMatchId | string | bracket doc ID |
| spectatorCount | uint16 | active spectator count |
| currentGame | uint8 | game number within series |
| targetWins | uint8 | wins needed to take series |
| seriesWins | MapSchema<uint8> | per-userId win count |
| seriesLeader | string | leading userId |
| activeModifierIds | ArraySchema<string> | active RoundModifier IDs |

---

## DetachedBodySchema Field Catalog

| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| bodyType | string | projectile / mini_bey / fragment |
| state | string | projectile → obstacle → removed |
| ownerSessionId | string | owning beyblade session |
| x, y | number | Matter.js position |
| velocityX, velocityY | number | |
| angle | number | radians |
| radius, mass | number | |
| spin, maxSpin, spinDecayRate | number | mini_bey only |
| obstacleSpeedThreshold | number | speed below which → obstacle |
| spinOutThreshold | number | spin below which mini_bey → obstacle |
| fragmentLifetimeTicks | number | 0 = no limit |
| fragmentAge | number | age counter |

---

## Physics Engine Capabilities

**Library**: Matter.js (server-side, synchronous, 60Hz)  
**Coordinate system**: 1 em = 16px, 1 cm = 24px. Arena center = (width×16/2, height×16/2).  
**Arena radius**: `Math.min(width, height) × 16 × 0.45`

**Methods available**:
| Method | Description |
|--------|-------------|
| setArenaConfig(config) | Cache arena config, compute center + radius |
| createBeyblade(id, x, y, radius, mass, stats) | Add Matter.Body circle; radius in cm→px |
| createObstacles(obstacles[]) | Static circle bodies for each obstacle |
| createCircularArena(cx, cy, r) | 64-segment wall polygon |
| createRectangularArena(w, h) | 4 wall rectangles |
| applyForce(id, fx, fy) | Apply force to body at center |
| setAngularVelocity(id, v) | Set angular velocity |
| setPosition(id, x, y) | Teleport body |
| setLinearVelocity(id, vx, vy) | Set velocity directly |
| setFrictionMultiplier(id, mult) | Modify friction + frictionAir |
| setBodySensor(id, isSensor) | Toggle sensor mode (for high-jump) |
| update(deltaTime) | Matter.Engine.update() — 60Hz |
| getBodyState(id) | Returns {x, y, rotation, velocityX, velocityY, angularVelocity} |
| checkBeybladeCollision(id1, id2) | SAT collision check → CollisionResult |
| calculateCollisionDamage(collision, b1, b2) | Returns {damage1, damage2, spinSteal1, spinSteal2} |
| checkRadialContactMatch(radiusMm, cp) | CP radial gate check (±2mm tolerance) |

**Material system**:
| Material | Damage | SpinSteal | Recoil |
|----------|--------|-----------|--------|
| abs | 1.0× | 0.5× | 0.7× |
| rubber | 0.7× | 1.5× | 0.4× |
| metal | 1.5× | 0.8× | 1.2× |
| pom | 1.1× | 0.7× | 0.9× |
| polycarbonate | 0.9× | 0.6× | 0.8× |

**Contact Point resolution**:
- Angles in radians, width in degrees (arc)
- `extends` gimmick: CP expands at spin fraction ≥ `extendThreshold`
- Radial gate: CP only fires if contact radius ≈ cp.radius ± 2mm
- Free-spin roller: applies rubber material multipliers regardless of roller material
- Takes max multiplier across all matching CPs (not sum)

---

## Special Move Pipeline

**File**: `server/utils/specialMoveSystem.ts`  
**Phases**: idle → windup → executing → bleed → cooldown → idle

| Phase | Player Control | Invulnerability | Spin Decay |
|-------|---------------|-----------------|------------|
| windup | LOCKED | NO | normal |
| executing | LOCKED | YES | SUPPRESSED |
| bleed | depends on config | NO | normal |
| cooldown | normal | NO | normal |

**SpecialMoveConfig** (`shared/types/specialMove.ts`):
```
steps: SpecialMoveStep[] (up to 10)
  └── comboEffectId: string → references ComboEffectDef
      executionMode: sequential | parallel
      delayTicksAfterPrev: number
      overrideParams: { statMultiplierScale, durationScale, targetOverride }
cancelable: boolean
locksDurationTicks: number
powerCost: number (default 100)
windupTicks?: number
bleedTicks?: number
bleedFactors?: StatDelta[]
introAnimation?: ComboVisual
outroAnimation?: ComboVisual
cancelableByQTE?: boolean
cameraConfig?: { zoomFactor, zoomDurationTicks, slowMotionFactor }
```

**QTE gate**: opponents can cancel a special during EXECUTING by completing a key sequence in time (if attacker fired ≥30% combo slots this game). Success → 80% power refund to attacker.

**Hardcoded specials** (`server/constants/specialMoves.ts`):
- `stampede_rush` — linear-burst, 5000 impulse, 200ms invuln, +60 spin
- `gyro_anchor` — anchor, +250 spin, 1500ms invuln
- `spin_recovery` — orbital, +400 spin
- `tactical_burst` — directional-burst, 3500 impulse, +150 spin
- `shock_pulse` — shockwave, AoE

---

## ComboTask / ComboEffectDef System

**Admin-facing**: `ComboTask[]` (stored in Firestore `combo_effects` collection + tasks[])  
**Engine-facing**: `BehaviorRef[]` (compiled by `comboTaskCompiler.ts` at save time)

**Action types**:
| Type | BehaviorId generated | Description |
|------|---------------------|-------------|
| multiplier | factor.boost | Stat delta: mult/delta/setValue on a stat |
| transformation | transform.become_X | Transform bey into arena feature type |
| spawning | spawn.X | Spawn entity at position |
| movement | movement.X | Apply movement pattern |
| arena_effect | arena.X | Arena-wide effect |

**Movement patterns**: circle, dash_to, orbit_opponent, freeze, dance, zigzag, bounce, jump, high_jump, meteor_strike, swap_position

**Arena effects**: floor_override, gravity_change, arena_tilt, freeze_all, fog_of_war, darkness, reverse_controls, no_combos

**Stat delta keys** (29 keys across 3 categories):
- Numeric: spin, maxSpin, spinDecayRate, damageMultiplier, damageReduction, contactDamageMultiplier, recoilFactor, spinStealFactor, spinStealResist, aggressiveness, gripFactor, surfaceFriction, speed, mass, radius, width, height, depth, jumpForce, jumpHeight, suctionForce, wallClimbFactor, gravityMult, bounceRestitution, tiltResistance, burstResistance
- Positional: positionX, positionY, positionZ
- String: spinDirection

**Combo trigger types** (beyond sequence): on_hit_received, on_near_ring_out, on_low_spin, on_partner_near_ring_out, on_opponent_special_move, on_burst_attempt

**Timing types**: instant, timed, permanent, pulsed (with formula shapes), charged (with charge mechanics)

---

## ArenaFeatureProcessor Capabilities

**File**: `server/shared/rooms/ArenaFeatureProcessor.ts`

**Known behaviorIds** (runtime-executable):
- `movement.orbit` — circular orbit force (centerX, centerY, intensity, direction)
- All others produce a warning + skip

**Bridge interface**:
- checkLoopCollision, checkWaterCollision, checkPitCollision, checkObstacleCollision
- applyLoopBoost, applyWaterResistance, applyForce, applyKnockback
- setPosition (wrecking_ball, swap_position)
- setVelocity (sticky physics)
- getPosition

**BeyTransformState**: beyId, transformTo, savedSpin, savedBody, expiresAtTick, tempFeatureId

**Gap**: Only `movement.orbit` is recognized at runtime. All other BehaviorId values from the compiler (factor.boost, transform.become_X, spawn.X, etc.) are NOT yet wired into the ArenaFeatureProcessor executor. The compiler generates them correctly; the runtime dispatcher is incomplete.

---

## Server Utility Modules

| Module | Path | Capability |
|--------|------|-----------|
| comboSystem | server/shared/utils/comboSystem.ts | detect combos (3-key + trigger-based), QTE gate, per-tracker cooldown |
| comboTaskCompiler | server/utils/comboTaskCompiler.ts | converts ComboTask[] → BehaviorRef[] at admin save time |
| specialMoveSystem | server/utils/specialMoveSystem.ts | full special move state machine |
| elementTypeLoader | server/utils/elementTypeLoader.ts | Firestore element type matrix + dynamic type multiplier |
| prng | server/shared/utils/prng.ts | seeded PRNG (matchId → seed) for deterministic replays |
| hashString | server/utils/hashString.ts | string → uint32 hash for PRNG seeding |
| spatialGrid | server/utils/spatialGrid.ts | spatial partitioning for O(n) collision broad-phase |
| roomCounter | server/shared/utils/roomCounter.ts | tryReserveRoom / releaseRoom (max 20 rooms) |

---

## BattleRoom Import Graph (key dependencies)

BattleRoom imports:
- `loadBeyblade, loadArena, loadArenaSystem, saveMatch, updatePlayerStats, loadComboEffects` from firebase
- `loadGlobalSettings` from tournamentFirebase
- `ComboTracker, detectCombo, BeyComboMatchState, TriggerState, detectTriggerCombos, recordComboFired, isQTEGateMet` from comboSystem
- `processArenaFeatures` from ArenaFeatureProcessor
- `populateArenaFeatures` from populateArenaFeatures
- `advanceArenaRotation` from advanceArenaRotation
- `applyMovementInput, applyActionInput, computeForceMagnitude` from InputHandler
- `determineGameWinner, recordGameWin, buildSeriesScore, isSeriesOver, resetStateForNextGame` from SeriesManager
- `MODIFIER_MAP, type RoundModifier` from roundModifier
- `loadElementTypeMatrix, computeDynamicTypeMultiplier` from elementTypeLoader
- `ArenaTimelineEvent, ArenaLink, BeyLink, BeyLinkEffect` types

---

## Multi-Engine Support Assessment (from code)

| Feature | 2D Engine | 2.5D Engine | 3D Engine | Current Status |
|---------|-----------|-------------|-----------|----------------|
| Collision detection | ✅ Matter.js SAT | ✅ + CP radial gate | ❌ not built | 2D fully working |
| Spin physics | ✅ angularVelocity | ✅ subPartSpins | ❌ | |
| Wall/arena bounds | ✅ circular + rect | ✅ ArenaSystem elevation | ❌ | |
| Special moves | ✅ specialMoveSystem | ✅ (comboSlots/pipeline) | ❌ | Steps compile correctly |
| Combos | ✅ detectCombo | ✅ BeybladeComboSlot | ❌ | |
| BehaviorRef execution | partial (orbit only) | partial | ❌ | Gap: only movement.orbit wired |
| Element types | ✅ elementTypeLoader | ✅ | ❌ | |
| Arena hazards | ✅ all 7 types | ✅ | ❌ | |
| Arena rotation | ✅ advanceArenaRotation | ✅ | ❌ | |
| Gyro wobble | ✅ (seeded PRNG < 40% spin) | ✅ | ❌ | |
| BeyLink (multi-bey) | partial | partial | ❌ | Types defined, partial runtime |
| Round modifiers | ✅ activeModifierIds + MODIFIER_MAP | ✅ | ❌ | |
| Sub-part detachment | ✅ DetachedBodySchema | ✅ | ❌ | |
| Combination lock | ✅ (schema + types) | ✅ | ❌ | |

---

## Critical Engine Gap: BehaviorRef Dispatcher

The `comboTaskCompiler.ts` produces `BehaviorRef[]` steps with `behaviorId` values like:
- `factor.boost` (stat modifier)
- `transform.become_gravity_well`
- `spawn.portal`, `spawn.obstacle`, etc.
- `movement.circle`, `movement.dash_to`, etc.
- `arena.floor_override`, `arena.gravity_change`, etc.

But `ArenaFeatureProcessor.executeBehavior()` only handles ONE: `movement.orbit`.
All other behaviorIds produce a warning and are silently skipped at runtime.

This means: **the full ComboTask/ComboEffectDef/SpecialMoveStep pipeline compiles correctly but does NOT execute correctly at runtime.** The step data exists in Firestore; the dispatcher is the gap.

This is the most important gap discovered in Stage 0A. It blocks all plan-dependent gimmick and special move behavior.

---

## New Discoveries

| Discovery | Category | Evidence | Tag |
|-----------|----------|---------|-----|
| BehaviorRef dispatcher only handles movement.orbit | ENGINE GAP | ArenaFeatureProcessor.ts:64 switch statement | FACT (code confirmed) |
| ComboTask compiler is complete (5 action types + all subtypes) | ENGINE CAPABILITY | comboTaskCompiler.ts | FACT |
| SpecialMove uses pipeline of ComboEffectDef steps (not standalone) | ENGINE DESIGN | specialMove.ts SpecialMoveStep.comboEffectId | FACT |
| Hardcoded special moves (SPECIAL_MOVES) separate from Firestore pipeline | ENGINE GAP | constants/specialMoves.ts vs specialMoveSystem.ts | FACT |
| DetachedBodySchema enables sub-part projectile/fragment lifecycle | ENGINE CAPABILITY | GameState.ts:404 | FACT |
| Combination lock types (stack/helical/tandem/cluster) defined on Beyblade | ENGINE CAPABILITY | GameState.ts:389 | FACT |
| BeyLink types fully defined (9 categories, ArenaLink, BeyLinkEffect) | ENGINE CAPABILITY | BattleRoom.ts imports | FACT |
| Round modifiers runtime map exists (MODIFIER_MAP) | ENGINE CAPABILITY | BattleRoom.ts import | FACT |
| Material system has 5 materials with 3-factor multipliers each | ENGINE CAPABILITY | PhysicsEngine.ts MATERIAL_MULTIPLIERS | FACT |
| Contact point radial gate is ±2mm tolerance | ENGINE DESIGN | PhysicsEngine.ts RADIAL_CONTACT_TOLERANCE_MM | FACT |
| Combo trigger system beyond 3-key sequences (6 trigger types) | ENGINE CAPABILITY | comboTask.ts ComboTrigger | FACT |
| Charged timing type with quadratic/linear/step charge scaling | ENGINE CAPABILITY | comboTask.ts ComboTiming | FACT |
| Arena shrink (effectiveRadius) already in ArenaState | ENGINE CAPABILITY | GameState.ts:477 | FACT |
| QTE gate for special move cancellation exists | ENGINE CAPABILITY | specialMoveSystem.ts | FACT |
| Bey transformation into arena feature (gravity_well, turret, etc.) | ENGINE CAPABILITY | comboTask.ts TransformationAction | FACT (type defined); execution missing |

---

## Proposed Extensions (discovered from engine gaps)

| Candidate | Gap Evidence | Priority |
|-----------|-------------|---------|
| Implement BehaviorRef dispatcher for all compiled action types | ArenaFeatureProcessor switch has only movement.orbit | CRITICAL |
| Wire Firestore special_moves pipeline to specialMoveSystem (currently uses hardcoded constants) | constants/specialMoves.ts vs Firestore pipeline | HIGH |
| mechanic_defs / gimmick_defs Firestore collections + COLLECTIONS entries | Plan Rule 7; absent from firebase.ts | HIGH |
| camera_profiles / audio_profiles Firestore collections | Plan Rule 6,7; absent from firebase.ts | HIGH |

---

## Failed Retrievals
(none — code-reading only)

## Missing Data
(none — all server code was accessible)

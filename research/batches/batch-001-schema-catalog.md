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

[← Batch 000: Admin Audit](batch-000-admin-audit.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 002: Discovery Table →](batch-002-discovery-table.md)

---

## Research Completed

Full catalog of all Colyseus schema classes in `server/rooms/schema/GameState.ts`, the physics engine, the mechanic registry, all server utilities, and the BattleRoom import graph. No external sources required — code-reading stage only. All facts reflect current code as of this session.

---

## Coverage Table

| Category | Count Catalogued | Notes |
|----------|-----------------|-------|
| Colyseus Schema Classes | 11 | LoopState, ObstacleState, PitState, TurretState, ProjectileState, WaterBodyState, PortalState, MechanicInstance, Beyblade, DetachedBodySchema, ArenaState, GameState |
| Beyblade Fields | 95+ | Full schema enumerated below |
| Arena Feature State Classes | 7 | Loop, Obstacle, Pit, Turret, Projectile, WaterBody, Portal |
| Physics Engine Methods | 16+ | createBeyblade, updateCollisionFilter, createObstacles, applyForce, setVelocity, setBodySensor, update, getBodyState, checkBeybladeCollision, calculateCollisionDamage, checkRadialContactMatch, etc. |
| Mechanic Handlers Registered | 31 | Full list in Mechanic Registry section |
| Shared Type Systems | 6 | comboTask, specialMove, beybladeSystem, arenaConfigNew, elementTypes, roundModifier |
| Server Utility Modules | 10 | comboSystem, comboTaskCompiler, specialMoveSystem, elementTypeLoader, gimmickExpander, firestoreLoaders, physicsFlags, prng, hashString, roomCounter |

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
| comboIds | ArraySchema\<string\> | [] | attached combo IDs (max 3) |
| comboCooldowns | MapSchema\<number\> | {} | per-combo cooldown epoch ms |
| comboSlots | ArraySchema\<string\> | [] | JSON-encoded BeybladeComboSlot[] |
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
| subPartSpins | MapSchema\<number\> | {} | per-sub-part angular momentum |
| activePartConfigs | MapSchema\<string\> | {} | active config name per slot |
| configLastSwitchAt | MapSchema\<number\> | {} | last mode-switch epoch ms per slot |

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
| beyTiltAngle | number | 0 | 0°=vertical, 90°=on-side, 180°=on-back, 270°=on-head (airborne), 360°=full rotation |
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
| elementTypes | ArraySchema\<string\> | [] | 1–2 element type values |

### Gimmick / Mechanic Instances
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| mechanics | ArraySchema\<MechanicInstance\> | [] | expanded from gimmickIds[] at match start |

### Gear / Rail State (BX Xtreme Dash)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| gearCompatibleBit | boolean | false | has gear-compatible tip |
| xtremeEngaged | boolean | false | currently riding a rail |
| xtremeRailProgress | float32 | 0 | 0–1 progress along current rail |
| xtremeRailId | string | "" | which rail is engaged |

### Engine Gear Boost Reserve
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| egBoostOmega | float32 | 0 | stored angular momentum from Engine Gear |

### Burst Pressure
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| burstPressure | float32 | 0 | accumulated impact before burst trigger fires |

### Physics Flags (Block M)
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| collisionWithBeys | boolean | true | collides with other beyblades |
| collisionWithArena | boolean | true | collides with arena walls |
| collisionWithObstacles | boolean | true | collides with obstacles |
| invulnerable | boolean | false | schema-synced invuln flag (distinct from isInvulnerable) |
| noKnockback | boolean | false | ignores knockback forces |
| teamId | string | "" | team affiliation (for team modes) |

---

## MechanicInstance Schema

New schema class (one per active mechanic on a beyblade). Populated by `gimmickExpander` at match start.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| type | string | "" | mechanic ID e.g. "free_spin" |
| params | string | "{}" | JSON-serialized params from GimmickDef.defaultParams |
| state | string | "{}" | JSON-serialized runtime state |
| active | boolean | true | mechanic is running |

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
| loopCount | number | 0 | alias for backward compat |
| obstacleCount | number | 0 | obstacle count |
| pitCount | number | 0 | pit count |
| turretCount | number | 0 | turret count |
| waterBodyCount | number | 0 | water body count |
| portalCount | number | 0 | portal count |
| effectiveRadius | number | 0 | 0=full; set during arena shrink (Phase V) |
| scoringMode | string | "elimination" | "elimination" / "points" (BX scoring) |
| pointsTarget | uint8 | 0 | points target; 0 = timed (no cap) |
| hasZeroG | boolean | false | zero-G mode active |

---

## GameState Field Catalog

| Field | Type | Description |
|-------|------|-------------|
| beyblades | MapSchema\<Beyblade\> | all active beyblades keyed by sessionId |
| arena | ArenaState | arena state |
| detachedBodies | MapSchema\<DetachedBodySchema\> | sub-part projectiles/fragments |
| loops | MapSchema\<LoopState\> | speed paths |
| obstacles | MapSchema\<ObstacleState\> | obstacles |
| pits | MapSchema\<PitState\> | pits |
| turrets | MapSchema\<TurretState\> | turrets |
| projectiles | MapSchema\<ProjectileState\> | turret projectiles |
| waterBodies | MapSchema\<WaterBodyState\> | water bodies |
| portals | MapSchema\<PortalState\> | portals |
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
| seriesWins | MapSchema\<uint8\> | per-userId win count |
| seriesLeader | string | leading userId |
| activeModifierIds | ArraySchema\<string\> | active RoundModifier IDs |
| playerPoints | MapSchema\<uint8\> | per-userId BX/points scoring |

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

**File**: `server/physics/PhysicsEngine.ts`  
**Library**: Matter.js (server-side, synchronous, 60Hz)  
**Coordinate system**: 1 em = 16px, 1 cm = 24px. Arena center = (width×16/2, height×16/2).  
**Arena radius**: `Math.min(width, height) × 16 × 0.45`

**Methods available**:
| Method | Description |
|--------|-------------|
| setArenaConfig(config) | Cache arena config, compute center + radius |
| createBeyblade(id, x, y, radius, mass, stats, flags?) | Add Matter.Body circle; radius in cm→px; optional physics flags |
| updateCollisionFilter(id, flags) | Update collision mask at runtime |
| createObstacles(obstacles[]) | Static circle bodies for each obstacle |
| createCircularArena(cx, cy, r) | 64-segment wall polygon |
| createRectangularArena(w, h) | 4 wall rectangles |
| applyForce(id, fx, fy) | Apply force to body at center |
| setAngularVelocity(id, v) | Set angular velocity |
| setPosition(id, x, y) | Teleport body |
| setLinearVelocity(id, vx, vy) | Set velocity directly |
| setFrictionMultiplier(id, mult) | Modify friction + frictionAir |
| setBodySensor(id, isSensor) | Toggle sensor mode (high-jump / meteor-strike hang) |
| update(deltaTime?) | Matter.Engine.update() — 60Hz |
| getBodyState(id) | Returns {x, y, rotation, velocityX, velocityY, angularVelocity} |
| checkBeybladeCollision(id1, id2) | Matter.Collision.collides (SAT) → CollisionResult |
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

**Physics Flags** (`server/utils/physicsFlags.ts`):
| Flag | Default | Description |
|------|---------|-------------|
| collisionWithBeys | true | Matter.js mask includes BEYBLADE category |
| collisionWithArena | true | Matter.js mask includes ARENA_WALL category |
| collisionWithObstacles | true | Matter.js mask includes OBSTACLE category |
| collisionWithProjectiles | true | Matter.js mask includes PROJECTILE category |
| invulnerable | false | takes no damage from any source |
| noDamageOutput | false | deals no damage on hit |
| noKnockback | false | ignores knockback forces |
| noGravityWell | false | not pulled by gravity wells |
| noSpinZone | false | not affected by spin zones |
| noTriggerZone | false | not affected by trigger zones |

---

## Mechanic Registry

**File**: `server/physics/MechanicRegistry.ts`  
**Pattern**: `registerMechanic(id, handler)` — handlers auto-register at import via 31 side-effect imports.  
**Dispatch**: `dispatchBehaviorRef({ behaviorId, params }, ctx)` — splits `behaviorId` on `.`, takes the last segment as `mechanicId`, looks up in REGISTRY.

**Registered mechanic IDs** (31 total):
| ID | File |
|----|------|
| energyReserve | mechanics/energyReserve.ts |
| velocityBurst | mechanics/velocityBurst.ts |
| attackAmplifier | mechanics/attackAmplifier.ts |
| freeSpin | mechanics/freeSpin.ts |
| spinTransfer | mechanics/spinTransfer.ts |
| spinEqualization | mechanics/spinEqualization.ts |
| rotationReverse | mechanics/rotationReverse.ts |
| spinThresholdSwitch | mechanics/spinThresholdSwitch.ts |
| modeSwitch | mechanics/modeSwitch.ts |
| rubberGrip | mechanics/rubberGrip.ts |
| contactDeflect | mechanics/contactDeflect.ts |
| springRecoil | mechanics/springRecoil.ts |
| weightShift | mechanics/weightShift.ts |
| spinStealCoupling | mechanics/spinStealCoupling.ts |
| railLock | mechanics/railLock.ts |
| centerPull | mechanics/centerPull.ts |
| bearingDrift | mechanics/bearingDrift.ts |
| burstSuppress | mechanics/burstSuppress.ts |
| staminaRecovery | mechanics/staminaRecovery.ts |
| surfaceFrictionModifier | mechanics/surfaceFrictionModifier.ts |
| orbitMovement | mechanics/orbitMovement.ts |
| upperLaunch | mechanics/upperLaunch.ts |
| smashImpact | mechanics/smashImpact.ts |
| barrageHit | mechanics/barrageHit.ts |
| zeroGFloat | mechanics/zeroGFloat.ts |
| magneticPull | mechanics/magneticPull.ts |
| contactHeightGate | mechanics/contactHeightGate.ts |
| spinDirectionBonus | mechanics/spinDirectionBonus.ts |
| subPartBurst | mechanics/subPartBurst.ts |
| defenseStance | mechanics/defenseStance.ts |
| revivalSpin | mechanics/revivalSpin.ts |

**MechanicContext interface** (passed to every handler):
- `bey`, `opponentId?`, `opponent?`, `dt`
- `applyForce(id, fx, fy)`, `applyKnockback(id, dir, dist)`
- `setVelocity?(id, vx, vy)`, `getPosition?(id)`

**MechanicHandler interface**: `onActivate?`, `tick?`, `onCollision?`, `passive?`

---

## Gimmick Expander

**File**: `server/utils/gimmickExpander.ts`

`expandGimmicks(gimmickIds[], gimmickDefsCache)` → `ArraySchema<MechanicInstance>`

- Called ONCE per beyblade in `onCreate()`, never in the game loop.
- A `GimmickDef` maps one gimmick ID to one or more mechanic IDs plus `defaultParams`.
- Unknown gimmickIds produce a console warning and are skipped.
- Result written directly to `beyblade.mechanics`.

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

## BehaviorRef Dispatcher — Status: RESOLVED

The old gap (only `movement.orbit` handled) is fully resolved.

**Current state**: `server/physics/MechanicRegistry.ts` provides `dispatchBehaviorRef()` which routes any `behaviorId` to a registered handler. 31 mechanics are pre-registered. The `comboTaskCompiler` generates `behaviorId` values like `factor.boost`, `transform.become_X`, `spawn.X`, etc. — the dispatcher strips the namespace prefix and looks up the mechanic ID in the REGISTRY.

**Remaining gap**: Whether each compiled `behaviorId` (e.g. `factor.boost`, `transform.become_gravity_well`) maps to a registered mechanic ID depends on naming convention alignment between the compiler output and the registered handler IDs. Not verified at this stage — would require reading each mechanic file's `registerMechanic` call.

---

## Server Utility Modules

| Module | Path | Capability |
|--------|------|-----------|
| comboSystem | server/shared/utils/comboSystem.ts | detect combos (3-key + trigger-based), QTE gate, per-tracker cooldown, BeyComboMatchState, slot-based combo system |
| comboTaskCompiler | server/utils/comboTaskCompiler.ts | converts ComboTask[] → BehaviorRef[] at admin save time |
| specialMoveSystem | server/utils/specialMoveSystem.ts | full special move state machine |
| elementTypeLoader | server/utils/elementTypeLoader.ts | Firestore element type matrix + dynamic type multiplier |
| gimmickExpander | server/utils/gimmickExpander.ts | expands gimmickIds[] → MechanicInstance[] at match start |
| firestoreLoaders | server/utils/firestoreLoaders.ts | `loadGimmickDefs` and other Firestore loaders |
| physicsFlags | server/utils/physicsFlags.ts | BeybladePhysicsFlags (10 flags), COLLISION_CATEGORIES, buildCollisionMask, resolvePhysicsFlags |
| prng | server/shared/utils/prng.ts | seeded PRNG (matchId → seed) for deterministic replays |
| hashString | server/shared/utils/hashString.ts | string → uint32 hash for PRNG seeding |
| roomCounter | server/shared/utils/roomCounter.ts | tryReserveRoom / releaseRoom (max 20 rooms), setMaxActiveRooms |

---

## BattleRoom Import Graph (key dependencies)

BattleRoom imports:
- `loadBeyblade, loadArena, loadArenaSystem, saveMatch, updatePlayerStats, loadComboEffects, getFirestoreDb` from firebase
- `loadGimmickDefs` from firestoreLoaders
- `expandGimmicks` from gimmickExpander
- `loadGlobalSettings` from tournamentFirebase
- `tryReserveRoom, releaseRoom, setMaxActiveRooms` from roomCounter
- `createPRNG` from prng
- `hashString` from hashString
- `ComboTracker, detectCombo, createComboTracker, BeyComboMatchState, createBeyComboMatchState, resetBeyComboMatchState, TriggerState, createTriggerState, detectTriggerCombos, recordComboFired, TriggerContext, isQTEGateMet` from comboSystem
- `normalizeBestOf, targetWinsFor` from seriesFormat
- `normalizeInput, invertInputControls, PlayerInput` from bitmask
- `resolveWallAngle` from ArenaUtils
- `resolvePhysicsFlags` from physicsFlags
- `processArenaFeatures` from ArenaFeatureProcessor
- `populateArenaFeatures` from populateArenaFeatures
- `advanceArenaRotation` from advanceArenaRotation
- `applyMovementInput, applyActionInput, computeForceMagnitude` from InputHandler
- `determineGameWinner, recordGameWin, buildSeriesScore, isSeriesOver, resetStateForNextGame` from SeriesManager
- `MODIFIER_MAP, RoundModifier` from roundModifier
- `loadElementTypeMatrix, computeDynamicTypeMultiplier, LoadedTypeMatrix` from elementTypeLoader
- `ArenaTimelineEvent, ArenaLink, BeyLink, BeyLinkEffect, BeyLinkGroupPattern, BeyLinkMovementControl` types

---

## New Discoveries (vs. prior batch-001)

| Discovery | Category | Evidence | Tag |
|-----------|----------|---------|-----|
| MechanicInstance schema class added to GameState.ts | SCHEMA ADDITION | GameState.ts:187 | FACT |
| Beyblade.mechanics: ArraySchema\<MechanicInstance\> | SCHEMA ADDITION | GameState.ts:410 | FACT |
| Gear/Rail fields (gearCompatibleBit, xtremeEngaged, xtremeRailProgress, xtremeRailId) | SCHEMA ADDITION | GameState.ts:413-416 | FACT |
| egBoostOmega (Engine Gear boost reserve) | SCHEMA ADDITION | GameState.ts:419 | FACT |
| burstPressure field (accumulated impact tracking) | SCHEMA ADDITION | GameState.ts:422 | FACT |
| Physics flags Block M (collisionWithBeys etc.) synced to schema | SCHEMA ADDITION | GameState.ts:425-431 | FACT |
| ArenaState.scoringMode + pointsTarget + hasZeroG | SCHEMA ADDITION | GameState.ts:514-517 | FACT |
| GameState.playerPoints MapSchema for BX/points scoring | SCHEMA ADDITION | GameState.ts:567 | FACT |
| BehaviorRef dispatcher gap RESOLVED via MechanicRegistry | ARCHITECTURE CHANGE | server/physics/MechanicRegistry.ts | FACT |
| 31 mechanic handlers registered (up from 1 in prior catalog) | ENGINE CAPABILITY | MechanicRegistry.ts imports | FACT |
| physicsFlags.ts: 10-flag system + COLLISION_CATEGORIES bitmask | NEW MODULE | server/utils/physicsFlags.ts | FACT |
| gimmickExpander.ts: GimmickDef → MechanicInstance[] at match start | NEW MODULE | server/utils/gimmickExpander.ts | FACT |
| firestoreLoaders.ts: loadGimmickDefs and other Firestore loaders | NEW MODULE | server/utils/firestoreLoaders.ts | FACT |
| setMaxActiveRooms exported from roomCounter | NEW EXPORT | roomCounter import in BattleRoom.ts | FACT |

---

## Failed Retrievals
(none — code-reading only)

## Missing Data
(none — all server code was accessible)

---

[← Batch 000: Admin Audit](batch-000-admin-audit.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 002: Discovery Table →](batch-002-discovery-table.md)

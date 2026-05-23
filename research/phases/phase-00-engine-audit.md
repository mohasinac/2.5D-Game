# Phase 00 — Engine Capability Audit

**Stage**: 0 (runs before all research stages)
**Status**: complete
**Purpose**: Full audit of existing engine so all later stages correctly identify what already exists vs. what genuinely needs to be added.

---

## Stage 0A — Code Reading + Discovery

### Beyblade Schema Fields (GameState.ts)

#### Base Stats
| Field | Type | Formula / Purpose |
|-------|------|-------------------|
| `attackPoints` | uint8 | `damageMultiplier = 1.0 + attack × 0.007` (1.0x–2.05x) |
| `defensePoints` | uint8 | `damageTaken = 1 - defense × 0.003`, drives `knockbackDistance` |
| `staminaPoints` | uint8 | `spinDecayRate = 8 × (1 - stamina × 0.001)` (8–6.8/s), `maxSpin = 2000 × (1 + stamina × 0.0008)` |
| `mass` | float32 | Drives knockback distance and inertia in Matter.js |
| `radius` | float32 | Stored in cm; converted to px via `radius * 24` in PhysicsEngine |
| `spinDirection` | string | "right" or "left"; used in CLASH_MULTIPLIERS dispatch |

#### Runtime Modifiers (all transiently modifiable at runtime)
| Field | Type | Purpose |
|-------|------|---------|
| `spin` | float32 | Current spin rate |
| `maxSpin` | float32 | Max spin (derived from staminaPoints) |
| `health` | float32 | Current health points |
| `stamina` | float32 | Current stamina |
| `maxStamina` | float32 | Max stamina |
| `aggressiveness` | float32 | Attack-type movement multiplier (higher = more aggressive approach) |
| `gripFactor` | float32 | How much traction on arena floor (higher = more grip, less drift) |
| `recoilFactor` | float32 | Recoil magnitude on collision |
| `spinStealFactor` | float32 | How much spin is stolen on contact |
| `spinStealResist` | float32 | Resistance to spin steal |
| `surfaceFriction` | float32 | Surface friction override |
| `contactDamageMultiplier` | float32 | Damage multiplier on contact |
| `damageReduction` | float32 | Damage reduction (defensive) |
| `burstResistance` | float32 | Resistance to burst KO |
| `wobbleAmplitude` | float32 | Wobble amplitude when spin < 40% |
| `jumpForce` | float32 | Jump impulse force |
| `jumpHeight` | float32 | Max jump height |
| `effectiveGravity` | float32 | Active gravity (modifiable for zero-g arenas) |

#### Combo + Special State
| Field | Type | Purpose |
|-------|------|---------|
| `comboDamageMultiplier` | float32 | Active damage multiplier from combo |
| `comboDamageMultiplierTimer` | float32 | Ticks remaining on comboDamageMultiplier |
| `comboSlots` | ArraySchema<string> | Which combo IDs this bey can use |
| `comboPhase` | uint8 | Current phase within a combo sequence |
| `comboChargeScale` | float32 | Charge scaling for combo cost |
| `attackBuffTimer` | float32 | Ticks remaining on attack buff |
| `defenseBuffTimer` | float32 | Ticks remaining on defense buff |
| `dodgeBuffTimer` | float32 | Ticks remaining on dodge buff |

#### 2.5D State
| Field | Type | Purpose |
|-------|------|---------|
| `beyTiltAngle` | float32 | Current tilt angle (degrees from vertical) |
| `adhering` | boolean | Whether bey is adhering to a wall/surface |
| `adheringSurfaceAngle` | float32 | Angle of adhering surface |
| `wallClimbing` | boolean | Whether bey is actively climbing |
| `airborne` | boolean | Whether bey is airborne |

#### Spin Injection + Counter-Rotation State
| Field | Type | Purpose |
|-------|------|---------|
| `coreReserveRemaining` | float32 | Remaining energy-reserve charge (Engine Gear mechanic) |
| `counterRotActive` | boolean | Whether counter-rotation sequence is active |
| `counterRotStep` | uint8 | Current step in counter-rotation sequence |
| `counterRotStepTick` | float32 | Ticks elapsed in current step |

#### Combination Lock State
| Field | Type | Purpose |
|-------|------|---------|
| `combinationLocked` | boolean | Whether bey is locked in combination with another |
| `linkedBeyId` | string | ID of the linked bey |
| `combinationType` | string | Type of combination lock |
| `linkStrain` | float32 | Strain on the combination link |

#### Element Types
| Field | Type | Purpose |
|-------|------|---------|
| `elementTypes` | ArraySchema<string> | List of element types (fire, water, etc.) for matchup matrix |

#### Additional State Flags
| Field | Purpose |
|-------|---------|
| `inLoop` | In loop zone |
| `inWater` | In water zone |
| `inPit` | In pit zone |
| `inObstacle` | Colliding with obstacle |
| `stunned` | Stun state |
| `cooldown` | Cooldown state |
| `onCooldown` | Named cooldown flag |
| `airborne` | Airborne (above platform) |

### ArenaState Schema Fields
| Field | Type | Purpose |
|-------|------|---------|
| `arenaId` | string | Active arena identifier |
| `switchStates` | MapSchema<boolean> | Switch on/off states by switchId |
| `featureStates` | MapSchema<string> | Feature state overrides by featureId |
| `selfRotationAngles` | MapSchema<float32> | Per-feature rotation angles |

### GameState Schema Fields
| Field | Type | Purpose |
|-------|------|---------|
| `status` | string | "warmup" / "in-progress" / "finished" / "series-finished" |
| `beyblades` | MapSchema<Beyblade> | Active beys keyed by sessionId |
| `arena` | ArenaState | Arena state |
| `winner` | string | Winner session ID |
| `targetWins` | uint8 | Series target wins |
| `currentGame` | uint8 | Current game in series |
| `seriesWins` | MapSchema<uint8> | Wins per player in series |
| `spectatorCount` | uint8 | Active spectators |
| `phase` | string | Current game phase |

---

### Physics Functions Catalog

#### PartPhysics.ts
| Function | Inputs | Outputs | Existing Mechanic Slot |
|----------|--------|---------|----------------------|
| `tickSpinInjection(bey, cfg)` | bey.coreReserveRemaining, bey.spin | bey.spin↑, bey.coreReserveRemaining↓ | `energy_reserve` |
| `tickCounterRotation(bey, cfg)` | bey.counterRotActive/Step/StepTick | bey.spinDirection flip, bey.spin mod | `rotation_reverse` |
| `computeSpinSteal(rawSteal, attackerFactor, defenderBearing, defenderResist, clashType)` | pure function | stealAmount | `spin_transfer` |
| `computeContactDamage(baseDamage, attackerSpinDir, defenderSpinDir, approachAngle)` | pure function | damage | `contact_deflect` (angle-blended) |
| `applyStatModifier(bey, mod)` | bey, StatModifier | bey stat fields | `mode_switch` dispatcher |
| `isTriggerMet(trigger, bey, impactForce, impactDirection?)` | bey + trigger config | boolean | trigger eval for all mechanics |
| `evaluateSwitchTargets()` | SubPart switch config + bey state | side effects | switch-based part mechanic dispatch |

**CLASH_MULTIPLIERS** (confirmed, used in computeSpinSteal + computeContactDamage):
```
same_spin:    { damage: 0.8,  spinSteal: 0.5, recoil: 0.6 }
counter_spin: { damage: 1.4,  spinSteal: 1.5, recoil: 1.3 }
neutral:      { damage: 1.0,  spinSteal: 1.0, recoil: 1.0 }
```

**MATERIAL_MULTIPLIERS** (confirmed):
```
abs:           { damage: 1.0, spinSteal: 1.0, recoil: 1.0 }
rubber:        { damage: 1.2, spinSteal: 0.8, recoil: 0.4 }
metal:         { damage: 1.3, spinSteal: 0.6, recoil: 1.5 }
pom:           { damage: 0.9, spinSteal: 1.2, recoil: 0.7 }
polycarbonate: { damage: 1.1, spinSteal: 0.9, recoil: 0.9 }
```

**ATTACK_TYPE_MULTIPLIER** (confirmed):
```
smash: 1.3, upper: 1.15, burst: 1.5, absorb: 0.5, spin_steal: 0.7
```

#### PhysicsEngine.ts
| Function | Purpose | Mechanic Candidate |
|----------|---------|-------------------|
| `checkBeybladeCollision(id1, id2)` | Matter.js overlap → CollisionResult | contact system |
| `calculateCollisionDamage()` | Full contact-point + material multiplier pipeline | `contact_deflect`, `spring_recoil` |
| `checkLoopCollision()` | Loop zone hit detection | arena hazard |
| `checkWaterCollision()` | Water zone hit detection | `surface_friction_modifier` |
| `checkPitCollision()` | Pit KO detection | arena KO |
| `checkObstacleCollision()` | Obstacle physics | `spring_recoil` |
| `isOutOfBounds()` | Ring-out detection | ring_out KO |
| `applyForce(id, fx, fy)` | Direct force injection | used by all movement mechanics |
| `applyKnockback(id, magnitude, angle)` | Directional knockback | `contact_deflect` output |
| `applyLateralForce(id, magnitude)` | Lateral force | `orbit_movement` |
| `getContactPointMultiplier()` | Angle-gated, radial-matched, material-factored multiplier | `rubber_grip`, `spin_steal_coupling` |

#### ClimbingPhysics.ts
| Function | Purpose | Mechanic Candidate |
|----------|---------|-------------------|
| `computeClimbingForces(bey, arena, dt)` | Adhesion + wall-climb forces | `bearing_drift`, suction-type adhesion |
| `updateBeyTilt(bey, impactForce, dt)` | Updates beyTiltAngle + wobbleAmplitude | passive tilt system |

**Reads/writes**: `adhering`, `adheringSurfaceAngle`, `wallClimbing`, `effectiveGravity`, `beyTiltAngle`

---

### BehaviorRef Catalog (comboTaskCompiler.ts)

**CRITICAL FINDING**: ALL BehaviorRef types emitted by `comboTaskCompiler.ts` are currently UNHANDLED at runtime. `ArenaFeatureProcessor.executeBehavior()` only handles `movement.orbit`; all other BehaviorRef IDs are silently skipped.

| BehaviorRef Type | Emitted By Compiler | Current Handler | Draft MechanicRegistry ID |
|-----------------|---------------------|-----------------|--------------------------|
| `factor.boost` | ComboTask "factor.boost" | ❌ UNHANDLED | `attack_amplifier` |
| `transform.become_attack` | ComboTask transform | ❌ UNHANDLED | `mode_switch` |
| `transform.become_defense` | ComboTask transform | ❌ UNHANDLED | `mode_switch` |
| `transform.become_stamina` | ComboTask transform | ❌ UNHANDLED | `mode_switch` |
| `transform.become_balance` | ComboTask transform | ❌ UNHANDLED | `mode_switch` |
| `spawn.projectile` | ComboTask spawn | ❌ UNHANDLED | `projectile_spawn` |
| `spawn.clone` | ComboTask spawn | ❌ UNHANDLED | `clone_spawn` |
| `movement.dash` | ComboTask movement | ❌ UNHANDLED | `velocity_burst` |
| `movement.orbit` | ComboTask movement | ✅ HANDLED (partial — orbit force only) | `orbit_movement` |
| `movement.freeze` | ComboTask movement | ❌ UNHANDLED | `rotation_lock` |
| `movement.jump` | ComboTask movement | ❌ UNHANDLED | existing jump mechanics |
| `movement.high_jump` | ComboTask movement | ❌ UNHANDLED | existing jump mechanics |
| `movement.meteor_strike` | ComboTask movement | ❌ UNHANDLED | aerial + `center_pull` on land |
| `position.swap_with` | ComboTask position | ❌ UNHANDLED | `position_swap` |
| `arena.effect.quake` | ComboTask arena | ❌ UNHANDLED | `arena_quake` |
| `arena.effect.wind` | ComboTask arena | ❌ UNHANDLED | `arena_wind` |
| `arena.effect.gravity_surge` | ComboTask arena | ❌ UNHANDLED | `arena_gravity_surge` |
| `spin.drain_target` | ComboTask spin | ⚠️ PARTIAL (BattleRoom.ts) | `spin_transfer` |

**CRITICAL**: The BehaviorRef executor must be connected to `MechanicRegistry` as Stage 11 work.

---

### ArenaFeatureProcessor.ts — Feature Processing Pipeline

`processArenaFeatures(...)` 12-step pipeline (confirmed order):
1. Loop zones
2. Water zones
3. Pit zones
4. Obstacles
5. Wall collision
6. Obstacle physics types
7. Floor hazard zones
8. Elevation zones
9. Effect zones
10. Environmental effects
11. Spin zones
12. Gravity holes + bumps

`executeBehavior(behaviorId, params, beys, physics)`:
- Currently handles: `movement.orbit` only
- Unknown IDs: **silently skipped** (no error, no dispatch)

**11 implicit switch-based registries discovered** (all need Map<string, Handler> refactor):
1. Obstacle types (obstacle_type switch)
2. Zone types (zone_type switch)
3. Environmental presets
4. Spawn types
5. Transform target types
6. Part layer types
7. Combo action types
8. Special move execution
9. Physics body types
10. Arena hazard categories
11. Feature animation types

---

### PartSystemManager.ts — 8-Phase Tick

`tickBey()` 8 phases (confirmed):
1. Active stat modifiers (applyStatModifier per active modifier)
2. Spin injection (tickSpinInjection)
3. Counter-rotation (tickCounterRotation)
4. Bearing friction (bearingFriction on tip parts)
5. Jump-core (jumpCore handling)
6. DetachedBody handling
7. Climbing forces (computeClimbingForces)
8. Tilt update (updateBeyTilt)

Additional systems:
- `tickCombinationLock()` — dual-bey lock/unlock state machine reading `combinationLocked` + `linkedBeyId`
- `onBeyCollision()` — evaluates subpart switch targets, detachment triggers, left-spin hop, stat modifier events
- `registerBey()` — initializes coreReserveRemaining, defaultSpinDirection, climbing stats, effective combo IDs

---

### Input System (useGameInput.ts)

**Bitmask encoding** (10 bits, confirmed):
```
bit 0 = moveLeft     bit 5 = defense
bit 1 = moveRight    bit 6 = dodge
bit 2 = moveUp       bit 7 = jump
bit 3 = moveDown     bit 8 = chargeHeld
bit 4 = attack       bit 9 = specialTap
```

Supported devices: Keyboard ✅, Gamepad ✅ (via Gamepad API)

**No Intent Layer exists** — bitmask applied directly to physics:
- `applyMovementInput(bey, decodedInput)` — direct force vectors from bit states
- `applyActionInput(bey, decodedInput)` — attack/defense/dodge/jump handled inline
- No intent parsing, no context-sensitivity, no combo window check at input layer

---

### Camera System (CameraControls.tsx)

**Manual controls only** (confirmed):
- Zoom in (+)
- Zoom out (−)
- Reset (0)

**No automatic camera behaviors implemented**:
- Server sends `special-move-camera` events → client receives but rendering is ad-hoc
- No follow camera, no impact framing, no KO pan, no cinematic cut
- No spectator auto-track (spectator clicks player in list → camera follows manually)

---

### Room Types (Match Config Audit)

| Room | File | Max Clients | Player Count | AI | BO Format | Series |
|------|------|-------------|-------------|-----|-----------|--------|
| `tryout_room` | TryoutRoom.ts | 1 | 1 | ❌ | BO1 only | ❌ |
| `battle_room` | BattleRoom.ts | 12 | 2–4 + 8 spectators | ❌ | BO1/3/5 | ✅ |
| `ai_battle_room` | AIBattleRoom.ts | 9 | 1 human + AI + 8 spec | ✅ | BO1/3/5 | ✅ |
| `tournament_battle_room` | TournamentBattleRoom.ts | 10 | 2 + 8 spectators | ✅ | BO1/3/5 | ✅ |

**MAX_ROOMS = 20** (roomCounter.ts)

**Architecture limits discovered**:
- BattleRoom.ts: maxClients = 12 caps at 4 players + 8 spectators — no > 4-player PvP currently
- 60Hz `setSimulationInterval` — fixed update rate ✅ deterministic
- Colyseus schema auto-sync — server-authoritative ✅
- seeded PRNG via `src/utils/prng.ts` + `hashString.ts` ✅ deterministic

---

### Special Moves Inventory (specialMoves.ts)

| ID | Kind | Key Effects |
|----|------|-------------|
| `stampede_rush` | attack | linearImpulse forward + spinDelta boost |
| `gyro_anchor` | defense | zero linear velocity, maximize spin, 1.5s invulnerability |
| `spin_recovery` | stamina | orbital force + gradual spin recovery |
| `tactical_burst` | balanced | directional burst + 20% spin recovery |
| `shock_pulse` | balanced | AoE knockback + spin drain to nearby beys |

`SpecialMoveDef` interface: id, name, kind, iconEmoji, cooldownSec, durationMs, effects {linearImpulse, spinDelta, invulnerabilityMs, spinStealRadiusPx, aoeRadiusPx, knockbackImpulse}, flashColor

**No `steps[]` mechanic chain yet** — adding this is Stage 11 work.

---

### Combos Inventory (combos.ts)

8 combos (4 free + 4 cost-tiered):

| ID | Sequence | Cost | Type | Effect Pattern |
|----|----------|------|------|----------------|
| `quick-dash-l` | ←←J | 0 | universal | dash left |
| `quick-dash-r` | →→J | 0 | universal | dash right |
| `guard-tap` | KKK | 0 | universal | defense buff |
| `feint` | ←→K | 0 | universal | feint + dodge |
| `riposte` | KKJ | 15 | defense | counter + damage |
| `pivot-strike` | ←→J | 15 | balanced | pivot + strike |
| `power-thrust` | JJJ | 25 | universal | heavy thrust |
| `spin-leech-jab` | ←J→ | 35 | stamina | spin steal jab |

`ComboEffect` interface: damageMultiplier, forceImpulse, dashDirection, durationMs, lockMs, microSpinBoost, spinStealBonus

---

### ArenaConfig Missing Types (for BX + advanced arenas)

Confirmed ABSENT from `client/src/types/arenaConfigNew.ts`:
- `GearRailConfig` — needed for BX Xtreme Line mechanic
- `ScoringZoneConfig` — needed for BX point scoring (Xtreme/Over/Pocket/Ring-Out)
- `TornadoRidgeConfig` — needed for zero-g arenas and tornado stall mechanic
- `ZeroGConfig` — needed for zero-g arenas

Already present in arenaConfigNew.ts:
- `SpinZoneConfig` ✅, `BumpConfig` ✅, `GravityHoleConfig` ✅
- `ObstacleConfig` ✅, `TriggerZoneConfig` ✅, `SwitchConfig` ✅
- `ArenaLink` (multi-floor) ✅, `BeyLink` (bey-to-bey stacking) ✅
- `ArenaTimelineEvent` (Phase T) ✅, `ArenaShrinkConfig` (Phase V) ✅
- `SelfRotationConfig` ✅, `FeatureAnimationConfig` ✅
- `FloorHazardZoneConfig` ✅, `EffectZoneConfig` ✅

---

## Stage 0B — New Discovery Table

| Discovery | Category | Code Source | Existing Support | Missing Support | Confidence |
|-----------|----------|-------------|-----------------|-----------------|------------|
| No Intent Layer between input bitmask and physics forces | input-system | useGameInput.ts + BattleRoom.ts | bitmask encoding only | Intent Layer parsing (context-sensitivity, combo windows) | HIGH |
| ALL BehaviorRef types from comboTaskCompiler are unhandled | mechanic | comboTaskCompiler.ts + ArenaFeatureProcessor.ts | movement.orbit partial | MechanicRegistry dispatch for all 18+ types | HIGH |
| No MechanicRegistry exists — 11 implicit switch registries | mechanic | Multiple physics files | ad-hoc inline switches | Unified Map<string, Handler> registry | HIGH |
| No visual scripting / node editor infrastructure | script-system | All client code | none | Scratch-like, node-graph, raw editor | HIGH |
| CameraControls is manual-only, no automatic behaviors | camera | CameraControls.tsx | zoom in/out/reset | Auto-follow, impact framing, KO pan, cinematic | HIGH |
| GearRailConfig absent from arenaConfigNew.ts | arena-feature | arenaConfigNew.ts | absent | GearRailConfig type + BX Xtreme Line physics | HIGH |
| ScoringZoneConfig absent from arenaConfigNew.ts | arena-feature | arenaConfigNew.ts | absent | ScoringZoneConfig + BX scoring state | HIGH |
| TornadoRidgeConfig absent from arenaConfigNew.ts | arena-feature | arenaConfigNew.ts | absent | TornadoRidgeConfig type + orbit-force physics | HIGH |
| ZeroGConfig absent from arenaConfigNew.ts | arena-feature | arenaConfigNew.ts | absent | ZeroGConfig + effectiveGravity override | HIGH |
| GIMMICK_REGISTRY does not exist | mechanic | src/constants/ | absent | GIMMICK_REGISTRY in gimmicks.ts | HIGH |
| MechanicInstance schema class does not exist | schema | GameState.ts | absent | MechanicInstance + mechanics[] on Beyblade | HIGH |
| xtremeEngaged / xtremeRailProgress / xtremeRailId fields absent | schema | GameState.ts | absent | New schema fields for BX rail state | HIGH |
| gearCompatibleBit field absent | schema | GameState.ts | absent | Per-bey boolean flag for BX bit compatibility | HIGH |
| scoringMode / pointsTarget absent from ArenaState | schema | GameState.ts | absent | BX scoring mode state fields | HIGH |
| playerPoints absent from GameState | schema | GameState.ts | absent | MapSchema<uint8> for BX point scoring | HIGH |
| gimmickIds + systemId absent from beyblade_stats | data | seed-beyblades.js | absent | gimmickIds[], systemId fields on BeybladeStats | HIGH |
| steps[] absent from SpecialMoveDef | data | specialMoves.ts | absent | Mechanic chain steps for move execution | HIGH |
| Combination lock tickCombinationLock() has no mechanic slot | mechanic | PartSystemManager.ts:tickCombinationLock | partial (state exists) | `combination_lock` mechanic handler in registry | MEDIUM |
| Left-spin hop on collision absent from MechanicRegistry | mechanic | PartSystemManager.ts:onBeyCollision | inline in PartSystemManager | `left_spin_hop` or parameterized jump mechanic | MEDIUM |
| 60Hz tick + seeded PRNG + schema auto-sync fully present | positive-finding | prng.ts + BattleRoom.ts + GameState.ts | ✅ complete | none | HIGH |
| Arena self-rotation works but has no MechanicRegistry slot | arena-feature | ArenaFeatureProcessor.ts + arenaConfigNew.ts | partial (selfRotation field) | Registry slot for self-rotation feature mechanics | LOW |
| No > 4-player PvP architecture (maxClients=12 = 4+8 spec) | match-config | BattleRoom.ts | 4-player max | Scaling work needed for 8–16 player matches | MEDIUM |
| BattleRoom.ts partial spin.drain_target handler | mechanic | BattleRoom.ts | partial | Full dispatch via MechanicRegistry spin_transfer | MEDIUM |
| mechanic_defs Firestore collection absent | data | Firebase | absent | mechanic_defs collection + admin CRUD | HIGH |
| gimmick_defs Firestore collection absent | data | Firebase | absent | gimmick_defs collection + admin CRUD | HIGH |
| camera_profiles Firestore collection absent | data | Firebase | absent | camera_profiles collection + admin CRUD | HIGH |
| audio_profiles Firestore collection absent | data | Firebase | absent | audio_profiles collection + admin CRUD | HIGH |
| script_definitions Firestore collection absent | data | Firebase | absent | Rule 15 scripting collections | HIGH |
| composition_blocks Firestore collection absent | data | Firebase | absent | Rule 15 scripting collections | HIGH |

---

## Stage 0D — Engine Capability Summary

### Full Capability Map

| Capability | File | Function/Field | Status | Draft MechanicRegistry ID |
|-----------|------|---------------|--------|--------------------------|
| Spin injection (energy reserve) | PartPhysics.ts | `tickSpinInjection()` + `coreReserveRemaining` | ✅ exists | `energy_reserve` |
| Counter-rotation sequence | PartPhysics.ts | `tickCounterRotation()` + counterRot* fields | ✅ exists | `rotation_reverse` |
| Spin steal computation | PartPhysics.ts | `computeSpinSteal()` | ✅ exists | `spin_transfer` |
| Contact damage (angle-blended) | PartPhysics.ts | `computeContactDamage()` | ✅ exists | `contact_deflect` |
| Stat modifier (add/multiply/set) | PartPhysics.ts | `applyStatModifier()` | ✅ exists | `mode_switch` dispatcher |
| Trigger evaluation | PartPhysics.ts | `isTriggerMet()` | ✅ exists | shared across all mechanics |
| Clash multipliers (same/counter/neutral) | PartPhysics.ts | `CLASH_MULTIPLIERS` | ✅ exists | used by spin_transfer |
| Material multipliers (5 materials) | PartPhysics.ts | `MATERIAL_MULTIPLIERS` | ✅ exists | used by rubber_grip, contact mechanics |
| Attack type multipliers | PartPhysics.ts | `ATTACK_TYPE_MULTIPLIER` | ✅ exists | used by attack_amplifier |
| Adhesion / wall climb | ClimbingPhysics.ts | `computeClimbingForces()` | ✅ exists | `bearing_drift` (suction type) |
| Tilt update + wobble | ClimbingPhysics.ts | `updateBeyTilt()` | ✅ exists | passive tilt system |
| Combination lock | PartSystemManager.ts | `tickCombinationLock()` | ✅ exists | `combination_lock` |
| 8-phase tick pipeline | PartSystemManager.ts | `tickBey()` | ✅ exists | MechanicRegistry.dispatchTick() hooks in |
| Arena features (12-step pipeline) | ArenaFeatureProcessor.ts | `processArenaFeatures()` | ✅ exists | extends to MechanicRegistry |
| BehaviorRef executor (partial) | ArenaFeatureProcessor.ts | `executeBehavior()` | ⚠️ partial | needs MechanicRegistry dispatch |
| Seeded PRNG | prng.ts + hashString.ts | `createPRNG(seed)` | ✅ exists | preserve as-is |
| 60Hz fixed tick | BattleRoom.ts | `setSimulationInterval` | ✅ exists | preserve as-is |
| Colyseus schema auto-sync | GameState.ts | All @Schema classes | ✅ exists | preserve as-is |
| Element type system (12×12 matrix) | elementTypeLoader.ts | `getMatchupMultiplier()` | ✅ exists | used by contact_deflect |
| 2.5D climbing/suction | ClimbingPhysics.ts | `computeClimbingForces()` | ✅ exists | preserve + extend |
| 2.5D PartSystem (880 lines) | PartSystemManager.ts | Full tick pipeline | ✅ exists | mechanic dispatch integrates here |
| Arena feature switches | arenaConfigNew.ts | SwitchConfig + controlledBySwitchId | ✅ exists | extend to MechanicRegistry |
| Spin zones | arenaConfigNew.ts + ArenaFeatureProcessor.ts | SpinZoneConfig | ✅ exists | orbit_movement mechanic |
| Gravity holes | arenaConfigNew.ts + ArenaFeatureProcessor.ts | GravityHoleConfig | ✅ exists | center_pull mechanic |
| Bumps | arenaConfigNew.ts + ArenaFeatureProcessor.ts | BumpConfig | ✅ exists | spring_recoil mechanic |
| Input bitmask (10 actions) | useGameInput.ts | uint16 bitmask | ✅ exists | preserve, add Intent Layer on top |
| Gamepad support | useGameInput.ts | Gamepad API | ✅ exists | preserve |
| Series format (BO1/3/5) | BattleRoom.ts + TournamentBattleRoom.ts | targetWins + seriesWins | ✅ exists | preserve |
| Spectator support | All room types | spectatorCount + spectatorFollowTargets | ✅ exists | preserve |
| AI difficulty (3 levels) | AIController.ts | medium/hard/hell | ✅ exists | preserve |
| Tournament system | TournamentScheduler.ts | Full bracket system | ✅ exists | preserve |
| Leaderboard | player_stats collection | updatePlayerStats() | ✅ exists | preserve |
| Loading progress (6 steps) | LoadingProgress.tsx | 6-step stepper | ✅ exists | preserve |

### Confirmed Absent (requires new code)

| System | Why Needed | Plan Stage |
|--------|-----------|-----------|
| `MechanicRegistry` | Unified dispatch for all mechanic handlers | Stage 11 / Stage 20 |
| `MechanicInstance` schema class | Per-bey mechanic state tracking | Stage 11 |
| `mechanics[]` on Beyblade | Array of active MechanicInstances | Stage 11 |
| `GIMMICK_REGISTRY` | Named mechanic recipes for bey assembly | Stage 11 |
| `gimmickExpander.ts` | expandGimmick() utility | Stage 11 |
| `xtremeEngaged` + rail state fields | BX rail riding state | Stage 11 |
| `scoringMode` + `pointsTarget` | BX/arena scoring mode | Stage 11 |
| `playerPoints` MapSchema | BX point accumulation | Stage 11 |
| `GearRailConfig` type | BX Xtreme Line arena feature | Stage 10 |
| `ScoringZoneConfig` type | BX scoring zone arena feature | Stage 10 |
| `TornadoRidgeConfig` type | Tornado ridge arena feature | Stage 10 |
| `ZeroGConfig` type | Zero-G arena feature | Stage 10 |
| Intent Layer | Between input bitmask and physics | Stage 13 work |
| Automatic camera behaviors | Impact framing, follow, cinematic | Stage 13 work |
| Visual scripting infrastructure | Scratch/node-graph/code editors | Stage 15 / Stage 20 |
| `steps[]` on SpecialMoveDef | Mechanic chain execution | Stage 11 |
| `gimmickIds` + `systemId` on beyblade_stats | Bey data enrichment | Stage 12 |
| mechanic_defs collection | Firestore CRUD for mechanics | Stage 12 |
| gimmick_defs collection | Firestore CRUD for gimmicks | Stage 12 |
| camera_profiles collection | Camera behavior data | Stage 12 |
| audio_profiles collection | Audio trigger data | Stage 12 |

### Missing Feature Validation Checklist

Run before declaring any new system needed:
```
✓ schema checked          (GameState.ts — all Beyblade/ArenaState/GameState fields) DONE
✓ runtime systems         (PartPhysics.ts, PhysicsEngine.ts, ClimbingPhysics.ts)    DONE
✓ mechanics checked       (existing PartPhysics tick/contact functions)              DONE
✓ modifier systems        (buff timers, combo multipliers, counterRot sequence)     DONE
✓ behavior systems        (ArenaFeatureProcessor.ts, BehaviorRef handler catalog)   DONE
✓ existing configs        (part configs, mode configs, arena feature configs)       DONE
✓ previous plans          (i-want-a-universal-proud-sparkle.md verified 2026-05-23) DONE
```

---

## Stage 0E — Admin + Forms + Tooling Audit

*(To be completed — reading client/src/pages/admin/ and scripts/ directories)*

See [Batch 000 — Admin Audit](batch-000-admin-audit.md) once written.

---

## References to Diagram Files

All 17 Mermaid diagrams are in this directory:

1. [diagram-engine-capabilities.md](diagram-engine-capabilities.md)
2. [diagram-mechanics.md](diagram-mechanics.md)
3. [diagram-mode-flow.md](diagram-mode-flow.md)
4. [diagram-arena-interaction.md](diagram-arena-interaction.md)
5. [diagram-simulation-arch.md](diagram-simulation-arch.md)
6. [diagram-sequence-launch.md](diagram-sequence-launch.md)
7. [diagram-presentation-flow.md](diagram-presentation-flow.md)
8. [diagram-data-flow.md](diagram-data-flow.md)
9. [diagram-extraction-pipeline.md](diagram-extraction-pipeline.md)
10. [diagram-tool-ecosystem.md](diagram-tool-ecosystem.md)
11. [diagram-input-abstraction.md](diagram-input-abstraction.md)
12. [diagram-rotation-systems.md](diagram-rotation-systems.md)
13. [diagram-camera-flow.md](diagram-camera-flow.md)
14. [diagram-deterministic-flow.md](diagram-deterministic-flow.md)
15. [diagram-research-flow.md](diagram-research-flow.md)
16. [diagram-script-authoring-flow.md](diagram-script-authoring-flow.md)
17. [diagram-script-execution.md](diagram-script-execution.md)

# Phase 06 — Mechanic Definitions

> **Stage 6** — MECHANIC_REGISTRY entries derived from Stages 1–5.
> Core principle: every mechanic modifies EXISTING fields, not new fields.
> Tags: FACT | INFERENCE | SPECULATION | UNKNOWN
> Multi-engine required for every entry (Rule 2).

---

## 1. Mechanic Registry Overview

The `MECHANIC_REGISTRY` is a server-side map of `mechanicId → handler`. Handlers are pure functions called each tick or on collision events. They modify existing Beyblade schema fields — they do NOT read Firestore at runtime.

**Handler event types**:
- `tick` — called every 60Hz frame, receives bey + deltaTime
- `onCollision` — called on `Matter.Events 'collisionStart'`
- `onActivate` — called when a special/combo activates
- `passive` — applied once at room creation (static modifiers)

---

## 2. Full Mechanic Definitions Table

| Mechanic ID | Existing Fields Modified | 2D Implementation | 2.5D Extension | 3D Simulation | Handler Events | Params Schema | Evidence Sources | Confidence |
|-------------|-------------------------|------------------|---------------|--------------|----------------|--------------|-----------------|-----------|
| `energy_reserve` | `coreReserveRemaining`, `attackBuffTimer` | Float charge → fires impulse when threshold reached | Same + airborne check prevents mid-air fire | Same as 2.5D | `tick`, `onActivate` | `{ chargeRate, dischargeThreshold, burstForce }` | `PartPhysics.ts:tickSpinInjection` | FACT |
| `velocity_burst` | `velocityX`, `velocityY` | Direct vector impulse in facing direction | Vector + z-component clamped to arena floor | Physics body linear impulse | `onActivate` | `{ forceMagnitude, durationTicks, direction? }` | `ArenaFeatureProcessor`, `specialMoves.ts` | FACT |
| `attack_amplifier` | `comboDamageMultiplier`, `comboDamageMultiplierTimer` | Timed multiplier on collision damage | Same; timer counts down at 60Hz | Same | `tick`, `onActivate` | `{ multiplier, durationTicks }` | `GameState.ts`, `comboTaskCompiler.ts` | FACT |
| `free_spin` | `spinDecayRate` (reduced), `spinStealResist` | Per-tick reduced decay rate | Reduced decay + tilt resistance in 2.5D | Bearing constraint reduces friction | `tick` | `{ decayModifier, stealResistBonus }` | `PartPhysics.ts:bearingFriction` | FACT |
| `spin_transfer` | `spinStealFactor` (transient) | Increased steal factor for N ticks on contact | Same + elevation check (higher elevation = more transfer) | Physical spin coupling on contact mesh | `onCollision` | `{ stealFactor, durationTicks }` | `PartPhysics.ts:computeSpinSteal` | FACT |
| `spin_equalization` | `spinStealFactor` bidirectional | Both beys transfer spin proportional to difference | Same + layer separation distance factor | Full momentum-based spin exchange | `onCollision` | `{ equalizationRate }` | game mechanics knowledge | INFERENCE |
| `rotation_reverse` | `spinDirection` (flip) | Flip enum left↔right, recalculate CLASH_MULTIPLIERS | Flip + update `beyTiltAngle` based on new spin | Invert angular velocity vector | `onActivate` | `{ reversalDurationTicks? }` | `PartPhysics.ts:counterRotActive` analog | INFERENCE |
| `spin_threshold_switch` | `aggressiveness`, `gripFactor`, `surfaceFriction` | Check `spin/maxSpin` ratio each tick; swap mode config when threshold crossed | Same + update contact point geometry on mode switch | Same + mesh swap for visual | `tick` | `{ highSpinConfig, lowSpinConfig, threshold }` | Final Drive mechanic (Big Bang Pegasus) | FACT |
| `mode_switch` | `aggressiveness`, `gripFactor`, `surfaceFriction` | Apply new stat set immediately | Apply + recalculate `beyTiltAngle` | Apply + physics body shape update | `onActivate` | `{ modeName, stats: Partial<BeybladeStats> }` | mode-change research | FACT |
| `rubber_grip` | `gripFactor`, `aggressiveness` | On contact: apply contact friction multiplier for N ticks | Same + surface normal consideration | Material friction coefficient override on contact | `onCollision` | `{ gripMultiplier, durationTicks }` | rubber tip/AR research | FACT |
| `contact_deflect` | `damageTaken` (transient), `recoilFactor` on opponent | Angle-cone check on collision; if contact angle < deflectAngle, reduce damage taken | Same + vertical component check for upper vs smash | Mesh angle collision check | `onCollision` | `{ deflectAngle, damageReduction, recoilBoost }` | AD145 deflect behavior | FACT |
| `spring_recoil` | `recoilFactor` | Spring force on contact from Bound AR | Spring + elevation component | Constraint spring in mesh | `onCollision` | `{ springForce, recoilBonus }` | Bound Attack Ring mechanic | FACT |
| `weight_shift` | `mass`, `knockbackDistance` | Modify effective mass at runtime | Same + center-of-mass shift for tilt | Inertia tensor update | `passive`, `onActivate` | `{ massMultiplier, knockbackModifier }` | Basalt Horogium / heavy WD | FACT |
| `spin_steal_coupling` | `spinStealFactor` (glancing) | Angle threshold check; at glancing contact angles, steal factor multiplied | Same + z-velocity component | Contact angle mechanics | `onCollision` | `{ couplingAngle, stealMultiplier }` | Advance Averazer / bearing HMS | INFERENCE |
| `rail_lock` | `xtremeEngaged`, `velocityX`, `velocityY` | Find nearest Xtreme Dash rail segment; lock bey velocity to rail path | Lock + z-elevation on rail curve | Constrained rail path physics | `tick` | `{ railId, lockSnapDistance, exitSpeed }` | BX Xtreme Dash system | FACT |
| `center_pull` | `velocityX`, `velocityY` | Radial force vector toward arena center | Same + slope contribution from arena bowl | Force field toward origin | `tick` | `{ pullStrength, maxDistance }` | tornado ridge feature | FACT |
| `bearing_drift` | `surfaceFriction`, lateral velocity | Reduced friction coefficient | Reduced friction + tilt smooth | Bearing constraint | `tick` | `{ frictionReduction }` | bearing tip / LAD | FACT |
| `burst_suppress` | `burstResistance` (dynamic) | Threshold boost on collision | Same | Same | `onCollision` | `{ resistBoost, durationTicks }` | movable sub-layer / DB generation | FACT |
| `stamina_recovery` | `spin`, `maxStamina` | Per-tick spin addition up to max | Same | Same | `tick` | `{ recoveryRate, maxRecovery }` | gyro_anchor special move | FACT |
| `surface_friction_modifier` | `surfaceFriction` | Set value | Same + surface normal update | Material override | `passive` | `{ frictionValue }` | tip type research | FACT |
| `orbit_movement` | `velocityX/Y` tangential | Tangent force perpendicular to center vector | Same + height preserve | Angular velocity path | `tick` | `{ orbitRadius, orbitSpeed, direction }` | ArenaFeatureProcessor.ts existing | FACT |
| `upper_launch` | `velocityX/Y`, airborne state | Apply upward vector force → sets `isAirborne` | Same + `beyTiltAngle` update | Vertical force component | `onCollision` | `{ upwardForce, airborneTicks }` | upper-attack AR geometry | FACT |
| `smash_impact` | `contactDamageMultiplier`, opponent `velocityX/Y` | Radial outward force to opponent on contact | Same + surface normal | Collision impulse | `onCollision` | `{ forceMultiplier, damageBonus }` | smash-attack AR geometry | FACT |
| `barrage_hit` | `contactFreqMultiplier`, `burstResistance` on opponent | Multiple contact points → fire multiple times per frame | Same + z-layer separation | Multi-mesh contact | `onCollision` | `{ hitCount, perHitForce }` | barrage-attack AR geometry | INFERENCE |
| `zero_g_float` | `effectiveGravity` | Reduce gravity constant for bey | Same + tilt stabilizer | Physics gravity reduction | `tick`, `onActivate` | `{ gravityFactor, durationTicks }` | Zero-G stadium / Orochi | FACT |
| `magnetic_pull` | `velocityX/Y` (toward magnet) | Directional force toward magnet pole | Same | Force field | `tick` | `{ pullDirection, strength, range }` | Magnacore stadium | FACT |
| `contact_height_gate` | collision detection gate | Only fire mechanic if contact height ≤ threshold (upper) or ≥ threshold (smash) | Same + z-elevation | Mesh height check | `onCollision` | `{ minHeight, maxHeight }` | CP radial gate extension | FACT |
| `spin_direction_bonus` | `contactDamageMultiplier` (transient) | Apply bonus multiplier when spinDirection matches CLASH_MULTIPLIERS.counter_spin | Same | Same | `onCollision` | `{ bonusMultiplier }` | L-Drago series left-spin | FACT |
| `sub_part_burst` | `subPartSpins`, `DetachedBodySchema` | Detach sub-part as projectile: 3-state lifecycle (projectile → obstacle → removed) | Same + z-layer | Full physics body | `onActivate` | `{ partIndex, projectileForce, lifetimeTicks }` | GameState.ts DetachedBodySchema | FACT |
| `defense_stance` | `defenseBuffTimer`, `damageReduction` (transient) | Zero velocity + boost damageReduction for N ticks | Same + stabilize `beyTiltAngle` | Same | `onActivate` | `{ durationTicks, reductionBoost }` | gyro_anchor special | FACT |
| `revival_spin` | `spin` (boost from low state) | If spin < 20% maxSpin: apply recovery burst | Same + tilt correction | Same | `tick` (conditional) | `{ spinBoostAmount, triggerThreshold }` | stamina recovery / corkscrew moves | INFERENCE |

---

## 3. Mechanic Multi-Engine Support Table

| Mechanic ID | 2D | 2.5D | 3D | Behavior Identity Preserved? |
|-------------|----|----|-----|---------------------------|
| `energy_reserve` | ✅ vector impulse | ✅ + airborne check | ✅ | Yes |
| `velocity_burst` | ✅ | ✅ | ✅ | Yes |
| `attack_amplifier` | ✅ | ✅ | ✅ | Yes |
| `free_spin` | ✅ | ✅ + tilt resistance | ✅ bearing model | Yes |
| `spin_transfer` | ✅ | ✅ + elevation | ✅ | Yes |
| `spin_equalization` | ✅ | ✅ | ✅ | Yes |
| `rotation_reverse` | ✅ | ✅ + tilt update | ✅ angular velocity | Yes |
| `spin_threshold_switch` | ✅ | ✅ + CP geom | ✅ mesh swap | Yes — behavior identical |
| `mode_switch` | ✅ | ✅ + tilt | ✅ | Yes |
| `rubber_grip` | ✅ | ✅ + normal | ✅ material | Yes |
| `contact_deflect` | ✅ angle check | ✅ + vertical | ✅ mesh angle | Yes |
| `spring_recoil` | ✅ | ✅ + elevation | ✅ constraint | Yes |
| `weight_shift` | ✅ | ✅ + CoM | ✅ tensor | Yes |
| `spin_steal_coupling` | ✅ | ✅ + z-vel | ✅ | Yes |
| `rail_lock` | ✅ | ✅ + z-elevation | ✅ path constraint | Yes |
| `center_pull` | ✅ | ✅ + slope | ✅ force field | Yes |
| `bearing_drift` | ✅ | ✅ + smooth | ✅ | Yes |
| `burst_suppress` | ✅ | ✅ | ✅ | Yes |
| `stamina_recovery` | ✅ | ✅ | ✅ | Yes |
| `surface_friction_modifier` | ✅ | ✅ | ✅ | Yes |
| `orbit_movement` | ✅ (existing) | ✅ | ✅ | Yes |
| `upper_launch` | ✅ | ✅ + tilt | ✅ vertical | Yes |
| `smash_impact` | ✅ | ✅ + normal | ✅ | Yes |
| `barrage_hit` | ✅ | ✅ + z-layer | ✅ multi-mesh | Yes |
| `zero_g_float` | ✅ | ✅ + stabilizer | ✅ | Yes |
| `magnetic_pull` | ✅ | ✅ | ✅ | Yes |
| `contact_height_gate` | ✅ | ✅ + z-elev | ✅ | Yes |
| `spin_direction_bonus` | ✅ | ✅ | ✅ | Yes |
| `sub_part_burst` | ✅ | ✅ | ✅ | Yes |
| `defense_stance` | ✅ | ✅ + tilt | ✅ | Yes |
| `revival_spin` | ✅ | ✅ | ✅ | Yes |

---

## 4. GIMMICK_REGISTRY Definitions

Each gimmick is a named recipe of one or more mechanics. Gimmicks are data-driven (stored in `gimmick_defs` Firestore collection), not hardcoded.

```typescript
const GIMMICK_REGISTRY: Record<string, GimmickDef> = {

  // Gen1 Systems
  engine_gear: {
    mechanics: ["energy_reserve", "velocity_burst", "attack_amplifier"],
    description: "Spring-loaded reserve fires velocity burst + attack boost on release",
    triggerCondition: "onActivate OR spin < 90% (Final Clutch variant)",
    modesSupported: ["standard_eg", "final_clutch_eg", "turbo_eg"],
    evidence: "PartPhysics.ts:tickSpinInjection",
  },
  final_drive: {
    mechanics: ["spin_threshold_switch", "mode_switch"],
    description: "Auto-switches from attack mode to defense/stamina mode at spin threshold",
    triggerCondition: "spin/maxSpin < threshold (configurable)",
    modesSupported: ["attack_mode", "final_mode"],
    evidence: "Big Bang Pegasus FD research",
  },
  bearing_zombie: {
    mechanics: ["free_spin", "spin_equalization"],
    description: "Free-spin bearing minimizes decay; at near-death spin equalization drains opponent",
    triggerCondition: "passive (free_spin) + proximity (spin_equalization)",
    modesSupported: [],
    evidence: "bearing-defense concept, Wolborg/Advance-Averazer research",
  },
  movable_sub_layer: {
    mechanics: ["burst_suppress"],
    description: "Inner sublayer absorbs burst pressure dynamically",
    triggerCondition: "onCollision burst pressure check",
    modesSupported: [],
    evidence: "Gen3 DB layer system, Arc Bahamoote",
  },
  heavy_wheel: {
    mechanics: ["weight_shift"],
    description: "Exceptionally heavy fusion wheel/energy layer reduces knockback",
    triggerCondition: "passive",
    modesSupported: [],
    evidence: "Basalt Horogium 230WD research",
  },
  ad145_deflect: {
    mechanics: ["contact_deflect"],
    description: "Arrowhead Defense track geometry deflects attacks via angled surface",
    triggerCondition: "onCollision angle check",
    modesSupported: [],
    evidence: "AD145 spin track research, Beat Lynx",
  },
  xtreme_dash: {
    mechanics: ["rail_lock", "velocity_burst"],
    description: "Locks onto Xtreme Dash line rails for speed boost + controlled trajectory",
    triggerCondition: "proximity to rail + xtremeEngaged flag",
    modesSupported: [],
    evidence: "BX system xtremeRailProgress field in GameState",
  },
  spin_steal_coupling: {
    mechanics: ["spin_transfer", "free_spin"],
    description: "Glancing-angle spin coupling drains opponent slowly while resisting drain",
    triggerCondition: "onCollision glancing angle check",
    modesSupported: [],
    evidence: "Advance Averazer HMS zombie strategy",
  },

  // Gen1 Special
  counter_rotation: {
    mechanics: ["rotation_reverse", "spin_direction_bonus"],
    description: "Mid-battle spin direction reversal; counter-spin multiplier inverts",
    triggerCondition: "counterRotActive sequence",
    modesSupported: [],
    evidence: "PartPhysics.ts:counterRotActive (existing in engine)",
  },
  magnacore_pull: {
    mechanics: ["magnetic_pull", "center_pull"],
    description: "Magnetic stage pulls metal beys toward magnet poles",
    triggerCondition: "proximity to magnet zone",
    modesSupported: [],
    evidence: "Magnacore stadium research",
  },

  // Gen2 Systems
  left_spin_steal: {
    mechanics: ["spin_direction_bonus", "spin_transfer"],
    description: "Left-spin bey gets bonus spin steal on counter-spin collision",
    triggerCondition: "onCollision spinDirection check",
    modesSupported: [],
    evidence: "L-Drago Destroy, Meteo L-Drago research",
  },
  gravity_mode: {
    mechanics: ["zero_g_float", "mode_switch"],
    description: "Activates Zero-G fighting stance — reduced gravity + mode shift",
    triggerCondition: "onActivate",
    modesSupported: ["normal_mode", "zero_g_mode"],
    evidence: "Zero-G stadium research",
  },
  upper_attacker: {
    mechanics: ["upper_launch", "contact_height_gate"],
    description: "AR geometry launches opponent airborne on contact",
    triggerCondition: "onCollision height check < low threshold",
    modesSupported: [],
    evidence: "upper-attack AR research",
  },
  smash_attacker: {
    mechanics: ["smash_impact", "contact_height_gate"],
    description: "Radial smash force maximized at mid-height contact zone",
    triggerCondition: "onCollision height check at mid",
    modesSupported: [],
    evidence: "smash-attack AR research",
  },
  rubber_attack: {
    mechanics: ["rubber_grip", "spin_transfer"],
    description: "Rubber contact surface grips and drains opponent spin on contact",
    triggerCondition: "onCollision gripFactor check",
    modesSupported: [],
    evidence: "Rubber Flat tip / rubber AR research",
  },

  // Gen3 Systems
  burst_armor: {
    mechanics: ["burst_suppress", "defense_stance"],
    description: "Layer locks burst mechanism under heavy hits; defense stance on near-burst",
    triggerCondition: "onCollision burstPressure threshold",
    modesSupported: [],
    evidence: "Gen3 burst layer research",
  },
  cho_z_spin_boost: {
    mechanics: ["stamina_recovery", "spin_transfer"],
    description: "Cho-Z layer generates spin from contact — absorbs and redistributes",
    triggerCondition: "onCollision",
    modesSupported: [],
    evidence: "Cho-Z layer generation research",
  },

  // Gen4 BX
  xtreme_line: {
    mechanics: ["rail_lock", "velocity_burst", "center_pull"],
    description: "Full Xtreme Dash line system: rail + exit burst + center pull back",
    triggerCondition: "proximity to rail",
    modesSupported: [],
    evidence: "BX stadium Xtreme Dash research + GameState.xtremeEngaged",
  },
  bx_bit_gimmick: {
    mechanics: ["mode_switch"],
    description: "BX Bit changes behavior based on Ratchet teeth count alignment",
    triggerCondition: "onActivate (manual)",
    modesSupported: ["attack_bit", "defense_bit", "stamina_bit"],
    evidence: "BX system Bit research",
  },
};
```

---

## 5. MechanicRegistry Implementation Plan

```typescript
// src/physics/MechanicRegistry.ts

export type MechanicHandler = {
  onActivate?: (bey: Beyblade, params: Record<string, unknown>) => void;
  tick?: (bey: Beyblade, dt: number, params: Record<string, unknown>) => void;
  onCollision?: (attacker: Beyblade, defender: Beyblade, params: Record<string, unknown>) => void;
};

export const MECHANIC_REGISTRY: Record<string, MechanicHandler> = {
  energy_reserve: {
    tick: (bey, dt, params) => {
      // tickSpinInjection logic wrapped here
    },
    onActivate: (bey, params) => {
      // fire burst: bey.velocityX += ...; bey.attackBuffTimer = params.durationTicks
    },
  },
  velocity_burst: {
    onActivate: (bey, params) => {
      const { forceMagnitude, direction } = params;
      // Matter.Body.applyForce(bey.body, bey.body.position, { x: ..., y: ... })
    },
  },
  // ... (all 31 mechanics)
};
```

---

## 6. BehaviorRef → Mechanic ID Mapping

From `comboTaskCompiler.ts` output, each BehaviorRef maps to a mechanic handler:

| BehaviorRef behaviorId | Mechanic ID | Handler File (planned) |
|------------------------|-------------|----------------------|
| `factor.boost` | `attack_amplifier` | `mechanics/attackAmplifier.ts` |
| `factor.defense` | `defense_stance` | `mechanics/defenseStance.ts` |
| `movement.dash` | `velocity_burst` | `mechanics/velocityBurst.ts` |
| `movement.orbit` | `orbit_movement` | `mechanics/orbitMovement.ts` (wraps existing) |
| `movement.freeze` | `defense_stance` (zero velocity) | `mechanics/defenseStance.ts` |
| `movement.jump` | `upper_launch` | `mechanics/upperLaunch.ts` |
| `movement.high_jump` | `upper_launch` (higher force) | `mechanics/upperLaunch.ts` |
| `movement.circle` | `orbit_movement` (circular) | `mechanics/orbitMovement.ts` |
| `movement.retreat` | `velocity_burst` (away) | `mechanics/velocityBurst.ts` |
| `movement.meteor_strike` | `velocity_burst` + `center_pull` | `mechanics/meteorStrike.ts` |
| `spawn.portal` | existing spawn executor | `mechanics/spawnPortal.ts` |
| `spawn.projectile` | `sub_part_burst` | `mechanics/subPartBurst.ts` |
| `transform.become_X` | `mode_switch` | `mechanics/modeSwitch.ts` |
| `arena.floor_override` | arena effect executor | `mechanics/arenaEffect.ts` |
| `arena.add_hazard` | arena effect executor | `mechanics/arenaEffect.ts` |

---

## 7. New Stat Extensions (Evidence-Based)

From Stages 1-6 research, these new fields are confirmed as needed beyond existing schema:

| Field | Type | Why Existing Insufficient | Evidence | Priority |
|-------|------|--------------------------|---------|---------|
| `xtremeEngaged` | `boolean` | Transient rail-riding state; no existing equivalent | GameState.ts already has this field | ✅ APPROVED — already in schema |
| `xtremeRailProgress` | `float32` | Progress along rail segment 0.0–1.0 | GameState.ts already has this field | ✅ APPROVED — already in schema |
| `xtremeRailId` | `string` | Which rail segment bey is locked to | GameState.ts already has this field | ✅ APPROVED — already in schema |
| `gearCompatibleBit` | `boolean` | Per-bey flag for BX gear compatibility | BX Bit system research | HIGH |
| `egBoostOmega` | `float32` | One-time angular velocity burst magnitude for EG | Engine Gear one-shot mechanic | HIGH |
| `magnetPolarity` | `int8` (-1/0/+1) | Magnacore attraction/repulsion | Magnacore system research | MEDIUM |
| `contactFreqMultiplier` | `float32` | Barrage attack multiple contacts per frame | barrage-attack mechanic | MEDIUM |
| `lastContactHeightPermille` | `uint16` | Track contact height for upper vs smash gating | contact_height_gate mechanic | MEDIUM |
| `burstPressure` | `float32` | Accumulated burst pressure (Gen3) | Gen3 burst system | MEDIUM |
| `massDistribution` | `string` | Center/rim/balanced — affects knockback vector | weight distribution research | LOW |

---

## 8. Missing Feature Validation Checklist

Per plan Rule 4 — before any system is declared needed:

| System | schema checked | runtime checked | mechanics checked | modifier checked | behavior checked | configs checked | Previous plans | Result |
|--------|--------------|----------------|-----------------|-----------------|----------------|----------------|---------------|--------|
| MechanicRegistry | ✅ (MechanicInstance in plan) | ✅ (PartPhysics has handlers) | ✅ | ✅ | ✅ (ArenaFeatureProcessor) | ✅ | ✅ | REQUIRES NEW — registry wrapper |
| GimmickRegistry | ✅ (gimmickIds[] on Beyblade schema) | ⚠️ (not loaded) | ✅ | ✅ | ✅ | ✅ | ✅ | REQUIRES NEW — gimmick_defs collection |
| BehaviorRef dispatch | ✅ | ✅ (orbit only wired) | ✅ (handlers exist as inline code) | ✅ | ✅ | ✅ | ✅ | REQUIRES EXTENSION — add dispatch cases |
| Xtreme Dash | ✅ (fields exist) | ⚠️ (rail_lock not wired) | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | REQUIRES EXTENSION — wire rail_lock |
| Magnacore system | ❌ (no fields) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | REQUIRES NEW — magnetic_pull mechanic |

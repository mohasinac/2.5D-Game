[← Phase 05: Parts](phase-05-parts.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 07a: Generation 1 →](phase-07-gen1.md)

---

# Phase 06 — Mechanic Definitions

> **Stage 6** — MECHANIC_REGISTRY entries derived from Stages 1–5.
> Core principle: every mechanic modifies EXISTING fields, not new fields.
> Tags: FACT | INFERENCE | SPECULATION | UNKNOWN
> Multi-engine required for every entry (Rule 2).

---

## Amendment — Session 18: Mechanics Are the Universal Behavior Base

> See **[Phase 21 — Unified Foundation](phase-21-unified-foundation.md)** for the full architectural spec.

The scope of `mechanic_defs` and `gimmick_defs` is expanded from "beyblade gimmicks only" to **every behavior in the game**:

| Previously only used for | Now also used for |
|--------------------------|------------------|
| Beyblade `gimmickIds[]` | Special move `mechanicRefs` |
| | Combo `effectRefs` |
| | Arena feature `mechanicRefs` (spin zones, bumps, gravity holes, directional zones, water bodies) |
| | Turret attack `mechanicRefs` (long-term replacement for the 175+ hardcoded union types) |
| | Part `mechanics: MechanicInstance[]` (tip movement, core gimmicks, gear behaviors) |
| | Obstacle `onContactMechanics` |

**New mechanic IDs needed** (beyond the 31 existing) to cover expanded scope:

| ID | Purpose |
|----|---------|
| `stamina_drain_rate` | Arena-global spin decay multiplier (replaces `staminaDrainMultiplier` field) |
| `combo_window_scale` | QTE window width multiplier (replaces `qteWindowScaling` field) |
| `arena_gravity` | Match-wide gravity override (extends `zero_g_float` to arena scope) |
| `floor_friction_override` | Arena floor friction for all beys |
| `water_drag` | Per-tick velocity reduction inside water zone |
| `water_spin_drain` | Per-tick spin reduction inside water zone |
| `directional_push` | Directional force vector (generalizes directional zone) |
| `bump_launch` | Upward + lateral recoil on contact (wraps `upper_launch` + `spring_recoil` for bumps) |
| `spin_boost_zone` | Per-tick spin increase inside zone |
| `orbit_force_zone` | Tangential force inside zone (already close to `orbit_movement`) |
| `aura_damage` | AoE damage pulse centered on bey (for special moves / turrets) |

**gimmicks.ts** needs the 5 new entries from session 14 added (see Phase 08 §7 — status: NEEDS UPDATE), and eventually needs all 11 new mechanic IDs above registered.

---

---

### Session 15 Note — Renderer Type Fix

`ServerProjectile` in `client/src/types/game.ts` now has optional geometry fields:

```typescript
radius?: number;   // used by ring/circle projectiles (daiguren_front, muken_cloud, zanka_field, sand_cage…)
length?: number;   // used by beam/lance projectiles
width?: number;    // used by rectangle/beam projectiles
```

Any future turret attack type that renders a non-point projectile should set these on the server-side runtime state and forward them via Colyseus schema to the renderer. The pattern: `p.radius ?? <default>` for circle draws, `p.length ?? <default>` for beam draws.

Admin CRUD page theme fix: `MechanicDefsPage.tsx` and `GimmickDefsPage.tsx` now correctly use `C.muted` (not `C.textMuted`) and `C.blue` (not `C.accent`). This was a pre-existing TSC error introduced in session 14.

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

> **Note**: This game uses 2D (Matter.js) and 2.5D (PartPhysics.ts) engines only. 3D simulation is not planned and the 3D column has been removed.

| Mechanic ID | Existing Fields Modified | 2D Implementation | 2.5D Extension | Handler Events | Params Schema | Evidence Sources | Confidence |
|-------------|-------------------------|------------------|----------------|----------------|--------------|-----------------|-----------|
| `energy_reserve` | `coreReserveRemaining`, `attackBuffTimer` | Float charge → fires impulse when threshold reached | Same + airborne check prevents mid-air fire | Same as 2.5D | `tick`, `onActivate` | `{ chargeRate, dischargeThreshold, burstForce }` | `PartPhysics.ts:tickSpinInjection` | FACT |
| `velocity_burst` | `velocityX`, `velocityY` | Direct vector impulse in facing direction | Vector + z-component clamped to arena floor | Physics body linear impulse | `onActivate` | `{ forceMagnitude, durationTicks, direction? }` | `ArenaFeatureProcessor`, `specialMoves.ts` | FACT |
| `attack_amplifier` | `comboDamageMultiplier`, `comboDamageMultiplierTimer` | Timed multiplier on collision damage | Same; timer counts down at 60Hz | Same | `tick`, `onActivate` | `{ multiplier, durationTicks }` | `GameState.ts`, `comboTaskCompiler.ts` | FACT |
| `free_spin` | `spinDecayRate` (reduced), `spinStealResist` | Per-tick reduced decay rate | Reduced decay + tilt resistance in 2.5D | Bearing constraint reduces friction | `tick` | `{ decayModifier, stealResistBonus }` | `PartPhysics.ts:bearingFriction` | FACT |
| `spin_transfer` | `spinStealFactor` (transient) | Increased steal factor for N ticks on contact | Same + elevation check (higher elevation = more transfer) | Physical spin coupling on contact mesh | `onCollision` | `{ stealFactor, durationTicks }` | `PartPhysics.ts:computeSpinSteal` | FACT |
| `spin_equalization` | `spinStealFactor` bidirectional | Both beys transfer spin proportional to difference | Same + layer separation distance factor | Full momentum-based spin exchange | `onCollision` | `{ equalizationRate }` | NOT implemented — only unidirectional `spinStealFactor` (spin steal) exists. True bidirectional convergence is a design note. [FACT: user-confirmed] | FACT |
| `rotation_reverse` | `spinDirection` (flip) | Flip enum left↔right, recalculate CLASH_MULTIPLIERS | Flip + update `beyTiltAngle` based on new spin | Invert angular velocity vector | `onActivate` | `{ reversalDurationTicks? }` | NOT implemented. Design note: should be a gimmick for left-spin core parts (e.g. Dranzer GT-style left-spin core). Needs engine implementation. [FACT: user-confirmed] | FACT |
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
| `barrage_hit` | `contactFreqMultiplier`, `burstResistance` on opponent | Multiple contact points → fire multiple times per frame | Same + z-layer separation | Multi-mesh contact | `onCollision` | `{ hitCount, perHitForce }` | `server/physics/mechanics/barrageHit.ts` — calculates `hits * damagePerHit` then applies as single `opp.health -= total`. NOT true per-tick multi-hit; single damage event per `onCollision` call. [FACT: code-confirmed] | FACT |
| `zero_g_float` | `effectiveGravity` | Reduce gravity constant for bey | Same + tilt stabilizer | Physics gravity reduction | `tick`, `onActivate` | `{ gravityFactor, durationTicks }` | Zero-G stadium / Orochi | FACT |
| `magnetic_pull` | `velocityX/Y` (toward magnet) | Directional force toward magnet pole | Same | Force field | `tick` | `{ pullDirection, strength, range }` | Magnacore stadium | FACT |
| `contact_height_gate` | collision detection gate | Only fire mechanic if contact height ≤ threshold (upper) or ≥ threshold (smash) | Same + z-elevation | Mesh height check | `onCollision` | `{ minHeight, maxHeight }` | CP radial gate extension | FACT |
| `spin_direction_bonus` | `contactDamageMultiplier` (transient) | Apply bonus multiplier when spinDirection matches CLASH_MULTIPLIERS.counter_spin | Same | Same | `onCollision` | `{ bonusMultiplier }` | L-Drago series left-spin | FACT |
| `sub_part_burst` | `subPartSpins`, `DetachedBodySchema` | Detach sub-part as projectile: 3-state lifecycle (projectile → obstacle → removed) | Same + z-layer | Full physics body | `onActivate` | `{ partIndex, projectileForce, lifetimeTicks }` | GameState.ts DetachedBodySchema | FACT |
| `defense_stance` | `defenseBuffTimer`, `damageReduction` (transient) | Zero velocity + boost damageReduction for N ticks | Same + stabilize `beyTiltAngle` | Same | `onActivate` | `{ durationTicks, reductionBoost }` | gyro_anchor special | FACT |
| `revival_spin` | `spin` (boost from low state) | If spin < 20% maxSpin: apply recovery burst | Same + tilt correction | Same | `tick` (conditional) | `{ threshold=0.2, recoveryRate=10 }` | **IMPLEMENTED** — `server/physics/mechanics/revivalSpin.ts`: tick-based; fires when `spin/maxSpin < threshold` (default 0.2 = 20%), adds `recoveryRate * dt` per tick up to `maxSpin`. [FACT: code-confirmed] | FACT |

---

## 3. Mechanic Multi-Engine Support Table

> **Note**: 3D simulation is not planned. Only 2D and 2.5D implementations are relevant.

| Mechanic ID | 2D | 2.5D | Behavior Identity Preserved? |
|-------------|----|----|---------------------------|
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

## 3b. Arena-Level Physics Modifiers

These are `ArenaConfig` fields (not MECHANIC_REGISTRY entries) that alter mechanic behaviour globally for a match. They are applied at room startup (`applyArenaToState`) or each tick and do not trigger on specific events.

| Field | Type | Default | Effect on Mechanics | Admin UI |
|-------|------|---------|---------------------|----------|
| `staminaDrainMultiplier` | `number` | `1.0` | Multiplies `spinDecayRate` on every tick for every bey in the arena. `1.0` = normal; `0.25` = near-frictionless slow-drain; `4.0` = rapid spin-out. Interacts with: `free_spin` (decay override partially cancelled), `revival_spin` (higher drain makes recovery harder), `stamina_recovery` (higher drain can fight recovery rate). | BasicsTab → Physics & Gameplay — slider 0.25×–4× |
| `qteEnabled` | `boolean` | `true` | When `false`, the QTE system is globally disabled for the arena: all `comboSystem.detectCombo()` calls short-circuit, no combo effects fire. Special moves are unaffected (they use a separate power system). | BasicsTab → Physics & Gameplay — toggle |
| `qteWindowScaling` | `"flat"\|"by_cost"` | `"by_cost"` | Controls how many ticks a QTE victim has to respond: `flat` = always 60 ticks (1 second). `by_cost` = `max(20, 60 - cost)` formula. Affects `attack_amplifier` and `spin_steal_coupling` window width. | BasicsTab → Physics & Gameplay — selector |
| `randomModifiers` | `boolean` | `false` | When `true`, the server picks one random match modifier at round start (e.g. reversed-input, double-stamina, wind). Modifiers are drawn from a modifier registry; this flag is the per-arena opt-in gate. | BasicsTab → Physics & Gameplay — toggle |
| `maxModifiers` | `number` | `2` | Maximum number of modifier layers that can stack in a single match. Only relevant when `randomModifiers` is on. Caps modifier application loop. | BasicsTab → Physics & Gameplay — number input |
| `backgroundColor` | `string?` | theme default | Client-only: overrides the background canvas fill colour. No physics effect. | BasicsTab → Visual Overrides — color picker |
| `floorColor` | `string?` | theme default | Client-only: overrides the arena floor fill colour. No physics effect. | BasicsTab → Visual Overrides — color picker |
| `tiltAngle` | `number` | `0` | Angle (0–360°) of the arena plane tilt. Drives `computeTiltForce(tiltAngle, tiltDir, mass)` = `sin(tiltAngle) × 0.04 × mass` lateral force every tick. At 180° the force direction reverses (Zero-G / inverted). At 90°/270° lateral gravity is at maximum (wall-ride). | BasicsTab → Tilt |
| `tiltMode` | `"fixed"\|"oscillate"\|"weight"` | `"fixed"` | `fixed`: tilt stays at `tiltAngle`; `oscillate`: cosine wave between `tiltOscillateMin` ↔ `tiltOscillateMax`; `weight`: arena tilts toward COM of active beys (Zero-G BB-G04 canonical mode). | BasicsTab → Tilt |

> **Interaction note**: `staminaDrainMultiplier` stacks multiplicatively with `free_spin`'s `decayModifier`. If an arena has `staminaDrainMultiplier: 2.0` and a bey has `free_spin.decayModifier: 0.3`, effective decay = `spinDecayRate × 2.0 × 0.3`. Similarly, `revival_spin.recoveryRate` must exceed the modified drain rate to actually recover spin.

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

---

## 9. Turret Attack System

The turret attack system is a **second runtime physics layer** alongside the MECHANIC_REGISTRY. It is NOT part of the mechanic registry — it has its own dispatch pipeline, runtime state, and handler library.

### Architecture

```
ArenaConfig.turrets[] → TurretConfig.attackType (TurretAttackType union)
                        ↓ dispatched in BattleRoom.tick()
                     TurretProcessor.ts — exported handler functions
                        ↓
                     TurretRuntimeState — per-turret persistent state
                        ↓
                     TurretProcessorBridge — physics operations
                           applyForce(id, fx, fy)
                           applyKnockback(id, {x,y}, scalar)
                           getPosition(id) → {x,y}
                           setVelocity?(id, vx, vy)
```

### TurretAttackType union (~175+ entries as of session 12)

Defined in `shared/types/arenaConfigNew.ts`. Every new type requires a 4-file addition:

| File | Addition |
|------|----------|
| `shared/types/arenaConfigNew.ts` | Union entry + config fields |
| `server/shared/rooms/TurretProcessor.ts` | `TurretRuntimeState` fields + handler functions |
| `client/src/game/renderer/FeatureRenderer.ts` | `TURRET_COLORS` entry + `syncProjectiles()` branch |
| `client/src/components/admin/arena-tabs/TurretsTab.tsx` | `TypeSpecificParams()` UI block |

### Physics sub-patterns

| Pattern | How It Works | Example Moves |
|---------|-------------|---------------|
| AoE radius | Distance check loop, falloff `(1 - dist/r)` | `ten_tails_bijuudama`, `spirit_bomb`, `bomb_bey` |
| Beam line | Axis-projection intersection test | `kamehameha`, `death_beam` |
| Timed buff/debuff | `runtimeState.*UntilMs` + tick processor | `eight_gates_release`, `turbo_bey`, `railbey` |
| Ghost position | `bey.x/y` schema override; physics body unchanged | `kyoka_suigetsu`, `mirror_world`, `genjutsu_veil` |
| Multi-target loop | Iterate all `bey.isActive` beys | `shinra_tensei`, `broken_reality` |
| Piercing (bypass invuln) | Save `invulnerable`, set false, apply, restore | `kaguya_bones`, `death_beam`, `limbo_hengoku` |
| Bey-as-weapon buff | `(bey as any)._xxx` flag checked in collision | `spread_bey`, `bomb_bey`, `shield_bey`, `turbo_bey` |
| Per-tick drain | Field active check, subtract `rate * dt` | `respira`, `black_zetsu_bind` |
| Seeking/ram | Find nearest/furthest, `applyKnockback` toward | `heat_seeker_bey`, `cannon_bey` |
| Phased multi-step | `runtimeState.phase` switch, advance on condition | `spiral_eye` (pull→fling), `spirit_bomb` (charge→fire) |

### Ghost / Illusion sub-system (8 moves)

Schema position override: save `bey.x/y` → set false coords (Colyseus syncs to all clients) → physics uses real Matter.js body → drift each tick → restore on expiry.

| Move | Mechanism |
|------|-----------|
| `kyoka_suigetsu` | Random offset 60-200px for all beys, slow drift |
| `mirror_world` | Larger random offset 90-270px, moderate drift |
| `genjutsu_veil` | Small drift per tick accumulates (arena-wide) |
| `mind_fracture` | Ghost offset + `_mindFractureInvertInputs` flag |
| `perfect_mirage` | Sets `bey.isActive = false` (renders nothing) |
| `broken_reality` | Mass teleport all beys to random valid positions |
| `echo_image` | Two static ghost decoys at offset positions |
| `false_flag` | Swaps `_displayName` of two random beys |

### Contra bey power-up sub-system (8 moves)

Turret targets a bey and gives it a Contra-style buff. The **bey IS the weapon**:

| Move | Buff Mechanic |
|------|--------------|
| `spread_bey` | On next collision, fan N impact vectors outward |
| `railbey` | `_railbeyActive` → 4× speed straight-line phase, pierce |
| `minigun_bey` | Runtime pulse loop from shooter to nearest bey |
| `heat_seeker_bey` | Find nearest, `applyKnockback` at 600 force |
| `bomb_bey` | Fuse timer → AoE explosion at bey position |
| `shield_bey` | `target.invulnerable = true` + 1-hit absorb shield |
| `turbo_bey` | `_turboSpeedMult` + `_turboCollisionMult` boost |
| `cannon_bey` | `applyKnockback` at 3000 toward furthest opponent |

### Coordinate system

All turret positions in cm, multiplied ×24 in handlers. Knockback scalar ranges: 400–1200 (moderate), 1500–3000 (heavy), 3000+ (finisher).

---

### 9.5 One Piece / Demon Slayer / Attack on Titan — Dispatch Wiring (session 28)

14 new `TurretAttackType` values wired into `TurretDispatch.ts` fire and tick switch blocks. Handler functions were already implemented in `TurretProcessor.ts`; only the dispatch case entries were missing.

#### One Piece (5 moves)

| ID | Character | Physics pattern | Tick? |
|----|-----------|----------------|-------|
| `gear_second` | Luffy | 5 s burst: rapid-fire multi-hit at 0.3 s intervals (runtime loop via `_gearSecondUntilMs`) | ✅ rapid burst tick |
| `gear_fourth` | Luffy | AoE slam at turret origin — knockback + spin drain on all beys in radius | — |
| `conquerors_haki` | Shanks / Luffy | Willpower pulse — stun (`controlLockedUntilMs`) on all beys within range | — |
| `three_sword_style` | Zoro | Triple-arc slash — 3 directional knockback vectors fan-spread from turret | — |
| `diable_jambe` | Sanji | Fire-spin DoT on target bey (`_diableJambeUntilMs`, per-tick burn damage) | ✅ burn DoT tick |

#### Demon Slayer (5 moves)

| ID | Character | Physics pattern | Tick? |
|----|-----------|----------------|-------|
| `water_breathing` | Tanjiro | Spiral wave — AoE force centred on turret, water-element slow | — |
| `hinokami_kagura` | Tanjiro | Flame dance — circular AoE + spin boost to all beys (ally-type) | — |
| `thunder_breathing` | Zenitsu | Lightning strike on nearest bey — stun + massive knockback | — |
| `beast_breathing` | Inosuke | Wild slash fan — high-recoil hits on all beys in frontal 120° arc | — |
| `flame_breathing` | Rengoku | Column of fire — directional AoE along turret facing direction | — |

#### Attack on Titan (4 moves)

| ID | Character | Physics pattern | Tick? |
|----|-----------|----------------|-------|
| `thunder_spear` | Mikasa / Hange | Homing explosive — spawns projectile that tracks nearest bey, AoE on impact | — |
| `omni_directional` | Levi | ODM gear rush — rapid multi-target hits cycling through all active beys | — |
| `hardening` | Annie | Crystallise — target bey gains `invulnerable = true` + `_hardeningActiveUntilMs` | — |
| `founding_titan` | Eren | Area control — ongoing rumbling force field; all beys in radius get periodic knockback for duration | ✅ area field tick |

#### Dispatch entry pattern

Fire block (inside `dispatchTurretFire` switch after `titan_shift`):
```typescript
case "gear_second":      triggerGearSecond(turretConfig, runtime, nowMs); break;
case "gear_fourth":      applyGearFourth(turretConfig, runtime, beyblades, bridge, tx, ty, nowMs); break;
case "conquerors_haki":  applyConquerorsHaki(turretConfig, beyblades, tx, ty, nowMs); break;
case "three_sword_style":applyThreeSwordStyle(turretConfig, beyblades, bridge, tx, ty); break;
case "diable_jambe":     if (target) applyDiableJambe(turretConfig, runtime, target, bridge, nowMs); break;
// ... Demon Slayer + AoT cases follow same pattern
```

Tick block (inside `dispatchTurretTick` switch):
```typescript
case "gear_second":   processGearSecondTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
case "diable_jambe":  processDiableJambeTick(turretConfig, runtime, beyblades, nowMs, dtMs); break;
case "founding_titan":processFoundingTitanTick(turretConfig, runtime, beyblades, tx, ty, nowMs, dtMs); break;
```

#### Seed entries (`scripts/seed-turret-attack-types.js`)

Added after `golden_frieza`. Each entry: `{ id, label, description, icon }`.

| id | label | icon |
|----|-------|------|
| `gear_second` | Gear Second | 💨 |
| `gear_fourth` | Gear Fourth | 🦁 |
| `conquerors_haki` | Conqueror's Haki | 👑 |
| `three_sword_style` | Three Sword Style | ⚔️ |
| `diable_jambe` | Diable Jambe | 🔥 |
| `water_breathing` | Water Breathing | 💧 |
| `hinokami_kagura` | Hinokami Kagura | 🌸 |
| `thunder_breathing` | Thunder Breathing | ⚡ |
| `beast_breathing` | Beast Breathing | 🐗 |
| `flame_breathing` | Flame Breathing | 🔥 |
| `thunder_spear` | Thunder Spear | 💥 |
| `omni_directional` | Omni-Directional | 🗡️ |
| `hardening` | Hardening | 🔶 |
| `founding_titan` | Founding Titan | 🌍 |

**Running total after session 28:** 189 `TurretAttackType` values (175 existing + 14 new).

---

## 10. Firestore Seed Layer — mechanic_defs + gimmick_defs (session 14)

Both collections are now seeded and have admin CRUD pages.

### mechanic_defs collection

Seeded by `scripts/seed-mechanics.js` (`npm run seed:mechanics`). 31 documents — one per MechanicRegistry handler.

**Document schema:**
```typescript
{
  id: string;           // snake_case mechanic ID (matches MechanicRegistry key)
  name: string;         // human-readable display name
  category: "stamina" | "defense" | "attack" | "movement" | "special";
  description: string;  // what it does and which fields it modifies
  params: Record<string, unknown>;  // default param values
}
```

**Admin UI:** `/admin/mechanic-defs` → `MechanicDefsPage.tsx`  
List grouped by category. Create/Edit modal with name, category (SearchableSelect), description textarea, and params JSON editor.

### gimmick_defs collection

Seeded by `scripts/seed-gimmicks.js` (`npm run seed:gimmicks`). 27 documents — 22 original gimmicks + 5 added in session 14.

**Document schema:**
```typescript
{
  id: string;               // snake_case gimmick ID (matches beyblade_stats.gimmickIds[] entries)
  name: string;             // human-readable name
  description: string;      // what the gimmick does in-match
  beybladeTypes: string[];  // compatible types ("attack" | "defense" | "stamina" | "balanced")
  behaviorRefs: Array<{     // ordered list of mechanic handlers to compose
    behaviorId: string;     // must match a key in mechanic_defs
    params: Record<string, unknown>;  // override params for this gimmick instance
  }>;
}
```

**Admin UI:** `/admin/gimmick-defs` → `GimmickDefsPage.tsx`  
List with inline behaviorRef chips. Create/Edit modal includes SearchableMultiSelect for beybladeTypes and JSON editor for behaviorRefs array.

### 22 Original Gimmick IDs

| ID | Mechanics | Types |
|----|-----------|-------|
| `energy_core` | energy_reserve | attack, balanced |
| `speed_boost_tip` | velocity_burst | attack |
| `heavy_metal_disc` | weight_shift, burst_suppress | defense |
| `recoil_guard` | rubber_grip, contact_deflect | defense, balanced |
| `free_spin_tip` | free_spin, bearing_drift | stamina |
| `spin_absorber` | spin_transfer, spin_steal_coupling | stamina |
| `mode_change` | mode_switch | balanced |
| `dual_tip` | bearing_drift, surface_friction_modifier | balanced |
| `smash_attack_ring` | smash_impact | attack |
| `upper_attack_ring` | upper_launch | attack |
| `barrage_ring` | barrage_hit | attack |
| `counter_spin` | spin_direction_bonus | attack, stamina |
| `gyro_defense_disc` | center_pull, spring_recoil | defense |
| `rubber_tip` | rubber_grip | defense, attack |
| `orbit_tip` | orbit_movement | stamina, balanced |
| `spin_equalizer` | spin_equalization | stamina |
| `burst_ring` | sub_part_burst | attack |
| `recovery_disc` | stamina_recovery | stamina, balanced |
| `anti_gravity_tip` | zero_g_float | stamina |
| `magnet_bit` | magnetic_pull | balanced |
| `revival_core` | revival_spin | stamina, defense |
| `height_gate_blade` | contact_height_gate | defense |

### 5 New Gimmicks (session 14)

| ID | Mechanics | Types | Design basis |
|----|-----------|-------|--------------|
| `magnacore_repel` | magnetic_pull (repel, strength 0.006) | defense, balanced | Magnacore stadium repulsion variant |
| `magnacore_attract` | magnetic_pull (attract) + spin_steal_coupling | attack, stamina | Magnacore predatory pull + spin drain |
| `dual_spin_launch` | rotation_reverse + velocity_burst | attack, balanced | Left-spin launcher gimmick (Dranzer GT style) |
| `mode_switch_tip` | spin_threshold_switch + mode_switch | balanced | Tip physically changes shape at spin threshold |
| `spring_launch` | spring_recoil (2.5×) + velocity_burst (0.10) | attack | Coiled spring burst-tip on demand |

### Runtime wiring

`gimmickExpander.ts` reads `beyblade_stats.gimmickIds[]` at `onCreate()`, loads each `gimmick_defs` doc, and expands `behaviorRefs[]` into a `MechanicInstance[]` array. This is the **only Firestore read** for gimmicks — the expanded list is cached and used synchronously in each tick.

```
beyblade_stats.gimmickIds: ["free_spin_tip", "magnet_bit"]
        ↓ gimmickExpander.ts (onCreate only)
MechanicInstance[] = [
  { mechanicId: "free_spin",   params: { decayReduction: 0.45 } },
  { mechanicId: "bearing_drift", params: { driftFactor: 0.85 } },
  { mechanicId: "magnetic_pull", params: { strength: 0.0035, attract: true } },
]
        ↓ tick / onCollision
MechanicRegistry[mechanicId].tick(bey, dt, params)
```


---

## Implementation Status (audit 2026-05-24)

> **Complete** — 31 mechanic handlers registered in `server/physics/MechanicRegistry.ts`. All existing gameplay behaviors covered. Missing: 4 Phase 24 stubs (authorityBlend, steeringForce, beyDecision, naturalMotion) not yet registered. Turret attack system (175+ moves) implemented.

---

[← Phase 05: Parts](phase-05-parts.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 07a: Generation 1 →](phase-07-gen1.md)

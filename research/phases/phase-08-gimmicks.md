# Phase 08 — Gimmick Configs (Engine Mapping)

> Stage 8 | Source: phase-06-mechanics.md + phase-07-gen234.md + linka/beys/ 
> Purpose: Convert GIMMICK_REGISTRY (Stage 6) into seed-ready Firestore `gimmick_defs` docs.
> Per-bey gimmickIds for Tier 1+2 across all generations.
> Note: Gen1 per-bey mapping marked [GEN1-PENDING] where Stage 7 Gen1 data not yet available.

---

## 1. gimmick_defs Firestore Collection

Each document goes into `gimmick_defs/{gimmickId}`.

### Format
```typescript
interface GimmickDef {
  id: string;                    // document key
  name: string;                  // human-readable display name
  description: string;           // 1–2 sentence description
  mechanics: string[];           // mechanic IDs (from MECHANIC_REGISTRY)
  triggerCondition: string;      // when gimmick fires
  modesSupported: string[];      // empty if not mode-based
  generation: "gen1" | "gen2" | "gen3" | "gen4" | "universal";
  systemId?: string;             // which beyblade system introduced this
  evidence: string;              // source file or citation
}
```

---

### engine_gear
```json
{
  "id": "engine_gear",
  "name": "Engine Gear",
  "description": "Spring-loaded internal gear fires velocity burst + attack damage boost on manual activation or auto-release at spin threshold. The canonical Gen1 S3 G-Revolution gimmick.",
  "mechanics": ["energy_reserve", "velocity_burst", "attack_amplifier"],
  "triggerCondition": "onActivate OR spin < 90% maxSpin (Final Clutch auto-release variant)",
  "modesSupported": ["standard_eg", "final_clutch_eg", "turbo_eg"],
  "generation": "gen1",
  "systemId": "plastic_neosg",
  "evidence": "PartPhysics.ts:tickSpinInjection, linka/gen1/parts-glossary.md"
}
```

### final_drive
```json
{
  "id": "final_drive",
  "name": "Final Drive",
  "description": "Automatically switches from aggressive attack mode to defense/stamina mode when spin falls below the threshold. Maps the Big Bang Pegasus F:D / X:D / D:D tips.",
  "mechanics": ["spin_threshold_switch", "mode_switch"],
  "triggerCondition": "spin/maxSpin < 0.45 (default threshold; configurable per bey)",
  "modesSupported": ["attack_mode", "final_mode"],
  "generation": "gen2",
  "systemId": "mfb",
  "evidence": "linka/beys/gen2/mfb/big-bang-pegasus.md, 4D System research"
}
```

### bearing_zombie
```json
{
  "id": "bearing_zombie",
  "name": "Bearing Zombie / LAD",
  "description": "Free-spin bearing or EWD tip minimizes spin decay; at near-death spin equalization slowly drains the opponent. The canonical LAD (Life After Death) zombie strategy.",
  "mechanics": ["free_spin", "spin_equalization"],
  "triggerCondition": "passive (free_spin always active) + proximity check (spin_equalization on contact)",
  "modesSupported": [],
  "generation": "gen2",
  "systemId": "mfb",
  "evidence": "linka/concepts/bearing-defense.md, linka/concepts/zombie-strategy.md, Wolborg/Advance-Averazer research"
}
```

### bearing_drift
```json
{
  "id": "bearing_drift",
  "name": "Bearing Drift (EWD / Eternal Bearing)",
  "description": "Eternal Wide Defense or full bearing tip produces near-zero contact friction. Bey drifts in wide arc at the last moment to avoid ring-out after spin drops (LAD drift).",
  "mechanics": ["bearing_drift", "free_spin"],
  "triggerCondition": "passive (always active when tip type = bearing)",
  "modesSupported": [],
  "generation": "gen2",
  "systemId": "mfb",
  "evidence": "linka/concepts/lad-life-after-death.md, Evil Befall EWD research"
}
```

### movable_sub_layer
```json
{
  "id": "movable_sub_layer",
  "name": "Movable Sub-Layer / DB Armor",
  "description": "Inner sublayer absorbs burst pressure; outer armor separates on first lock click, reducing transmitted burst force. Gen3 DB System gimmick.",
  "mechanics": ["burst_suppress"],
  "triggerCondition": "onCollision when burstPressure > burstResistance * 0.7",
  "modesSupported": [],
  "generation": "gen3",
  "systemId": "burst_db",
  "evidence": "linka/beys/gen3/db/dynamite-belial-nv2.md, DB System research"
}
```

### heavy_wheel
```json
{
  "id": "heavy_wheel",
  "name": "Heavy Wheel / Synchrome",
  "description": "Exceptionally heavy fusion wheel or Synchrome double Chrome Wheel reduces knockback by inertia dominance. The heavier the wheel, the more force required to change trajectory.",
  "mechanics": ["weight_shift"],
  "triggerCondition": "passive (mass modifier applied at spawn)",
  "modesSupported": [],
  "generation": "gen2",
  "systemId": "mfb",
  "evidence": "linka/concepts/weight-distribution.md, Basalt Horogium research (50g)"
}
```

### ad145_deflect
```json
{
  "id": "ad145_deflect",
  "name": "AD145 Arrowhead Deflect",
  "description": "Arrowhead Defense 145 track geometry deflects attacks via angled surface — incoming force is redirected away rather than absorbed.",
  "mechanics": ["contact_deflect"],
  "triggerCondition": "onCollision angle check: attack contact angle < 45°",
  "modesSupported": [],
  "generation": "gen2",
  "systemId": "mfb",
  "evidence": "linka/beys/gen2/mfb/beat-lynx.md, AD145 track research"
}
```

### xtreme_dash
```json
{
  "id": "xtreme_dash",
  "name": "Xtreme Dash",
  "description": "Rubber or gear-toothed Bit engages the Xtreme Line rail when in proximity; speed burst toward exit zone. The defining Gen4 BX system gimmick.",
  "mechanics": ["rail_lock", "velocity_burst"],
  "triggerCondition": "proximity to GearRailConfig polyline (within 5px); xtremeEngaged flag set",
  "modesSupported": [],
  "generation": "gen4",
  "systemId": "bx",
  "evidence": "GameState.ts:xtremeEngaged, xtremeRailProgress; linka/beys/gen4/bx/dran-sword.md"
}
```

### xtreme_line
```json
{
  "id": "xtreme_line",
  "name": "Xtreme Line (Full System)",
  "description": "Full Xtreme Dash line system: rail engagement → speed burst → center pull draws bey back to re-engage. Enables loop combos.",
  "mechanics": ["rail_lock", "velocity_burst", "center_pull"],
  "triggerCondition": "proximity to rail + xtremeEngaged flag",
  "modesSupported": [],
  "generation": "gen4",
  "systemId": "bx",
  "evidence": "GameState.ts:xtremeRailProgress; linka/beys/gen4/bx/ research"
}
```

### spin_steal_coupling
```json
{
  "id": "spin_steal_coupling",
  "name": "Spin Steal Coupling",
  "description": "At glancing contact angles, spin coupling drains opponent's spin while the bey's free-spin components resist return drain. Classic zombie/bearing-HMS strategy.",
  "mechanics": ["spin_transfer", "free_spin"],
  "triggerCondition": "onCollision angle check: contact angle > 65° (glancing)",
  "modesSupported": [],
  "generation": "gen1",
  "systemId": "hms",
  "evidence": "linka/concepts/spin-steal.md, Advance Averazer HMS research"
}
```

### counter_rotation
```json
{
  "id": "counter_rotation",
  "name": "Counter Rotation / Dual Spin",
  "description": "Mid-battle spin direction reversal; counter-spin multiplier inverts to attacker's advantage. Alternatively, pre-launch spin direction selection.",
  "mechanics": ["rotation_reverse", "spin_direction_bonus"],
  "triggerCondition": "counterRotActive sequence OR pre-launch selection (HMS dual-spin)",
  "modesSupported": [],
  "generation": "gen1",
  "systemId": "hms",
  "evidence": "PartPhysics.ts:counterRotActive (existing), linka/beys/gen1/hms/dragoon-ms.md"
}
```

### magnacore_pull
```json
{
  "id": "magnacore_pull",
  "name": "Magnacore Magnetic Pull",
  "description": "Magnetic stage magnets apply attract/repel force to Magnecore-equipped beys at range. Creates dynamic positional control: attract = defense lock, repel = attack disruption.",
  "mechanics": ["magnetic_pull", "center_pull"],
  "triggerCondition": "proximity to magnetic obstacle zone (within magnetRadiusCm)",
  "modesSupported": [],
  "generation": "gen1",
  "systemId": "plastic_magnacore",
  "evidence": "ArenaFeatureProcessor.ts:processMagnets(), Magnacore stadium research"
}
```

### left_spin_steal
```json
{
  "id": "left_spin_steal",
  "name": "Left Spin Steal (L-Drago line)",
  "description": "Left-spin bey receives bonus spin steal on counter-spin collision. L-Drago's defining identity: attacks right-spin opponents head-on for maximum momentum transfer.",
  "mechanics": ["spin_direction_bonus", "spin_transfer"],
  "triggerCondition": "onCollision when attackerSpinDirection == 'left' and defenderSpinDirection == 'right'",
  "modesSupported": [],
  "generation": "gen2",
  "systemId": "mfb",
  "evidence": "linka/concepts/spin-steal.md, L-Drago series research"
}
```

### gravity_mode
```json
{
  "id": "gravity_mode",
  "name": "Gravity / Zero-G Mode",
  "description": "Activates Zero-G fighting stance: reduced gravity constant + mode shift to wall-fighting configuration. Zero-G Synchrome beys use this.",
  "mechanics": ["zero_g_float", "mode_switch"],
  "triggerCondition": "onActivate (player-triggered) or Zero-G stadium ZeroGConfig.enabled",
  "modesSupported": ["normal_mode", "zero_g_mode"],
  "generation": "gen2",
  "systemId": "mfb_zerog",
  "evidence": "ZeroGConfig, linka/stadiums/zero-g-stadium.md"
}
```

### upper_attacker
```json
{
  "id": "upper_attacker",
  "name": "Upper Attacker",
  "description": "AR geometry launches opponent airborne on contact at low height. Upper-type ARs (Dragoon G, Wing Attacker) use this.",
  "mechanics": ["upper_launch", "contact_height_gate"],
  "triggerCondition": "onCollision contactHeight < 1.5 cm",
  "modesSupported": [],
  "generation": "gen1",
  "systemId": "plastic_neosg",
  "evidence": "linka/concepts/upper-attack.md, AR height-gate research"
}
```

### smash_attacker
```json
{
  "id": "smash_attacker",
  "name": "Smash Attacker",
  "description": "Wide outward-facing AR edges deliver radial smash force at mid-height contact zone. Maximum ring-out potential.",
  "mechanics": ["smash_impact", "contact_height_gate"],
  "triggerCondition": "onCollision contactHeight 1.5–3.5 cm",
  "modesSupported": [],
  "generation": "gen1",
  "systemId": "plastic_sgs",
  "evidence": "linka/concepts/smash-attack.md, AR geometry research"
}
```

### rubber_attack
```json
{
  "id": "rubber_attack",
  "name": "Rubber Attack",
  "description": "Rubber contact surface grips opponent and transfers spin on contact. Aggressive movement pattern due to high floor friction. Rubber wears down with use.",
  "mechanics": ["rubber_grip", "spin_transfer"],
  "triggerCondition": "onCollision when gripFactor > 0.6",
  "modesSupported": [],
  "generation": "gen1",
  "systemId": "plastic_sgs",
  "evidence": "linka/concepts/rubber-flat.md, Dragoon S Storm Grip research"
}
```

### burst_armor
```json
{
  "id": "burst_armor",
  "name": "Burst Armor / Layer Lock",
  "description": "Layer absorbs burst pressure up to threshold; defense stance triggered on near-burst state to protect from KO.",
  "mechanics": ["burst_suppress", "defense_stance"],
  "triggerCondition": "onCollision when burstPressure > burstResistance * 0.7",
  "modesSupported": [],
  "generation": "gen3",
  "systemId": "burst_s1",
  "evidence": "Gen3 Burst layer system research"
}
```

### cho_z_spin_boost
```json
{
  "id": "cho_z_spin_boost",
  "name": "Cho-Z Awakening / Spin Generation",
  "description": "Zinc-alloy embedded layer generates spin from contact impacts — absorbs kinetic energy and redistributes as spin recovery. Awakening threshold at ~50ω.",
  "mechanics": ["stamina_recovery", "spin_transfer"],
  "triggerCondition": "onCollision when spin > coreReserveThreshold (Awakening)",
  "modesSupported": [],
  "generation": "gen3",
  "systemId": "burst_choz",
  "evidence": "linka/beys/gen3/choz/kaiser-kerbeus-lp.md, Cho-Z metal layer research"
}
```

### bx_bit_gimmick
```json
{
  "id": "bx_bit_gimmick",
  "name": "BX Bit Gimmick",
  "description": "BX Bit changes behavior based on Ratchet teeth count alignment. Different Bits (Flat, Ball, Point) give distinct movement profiles.",
  "mechanics": ["mode_switch"],
  "triggerCondition": "onActivate (manual Bit swap pre-match) or teeth-count alignment on launch",
  "modesSupported": ["attack_bit", "defense_bit", "stamina_bit"],
  "generation": "gen4",
  "systemId": "bx",
  "evidence": "BX Ratchet/Bit system research, linka/beys/gen4/bx/dran-sword.md"
}
```

### spring_recoil
```json
{
  "id": "spring_recoil",
  "name": "Bound Attack / Spring Recoil",
  "description": "Spring-loaded AR wings or Bound Bit release stored kinetic energy from incoming impact back as counter-force. The harder the hit, the stronger the rebound.",
  "mechanics": ["spring_recoil"],
  "triggerCondition": "onCollision when impact force > springActivationThreshold",
  "modesSupported": [],
  "generation": "gen3",
  "systemId": "burst_god",
  "evidence": "linka/beys/gen3/superking/brave-valkyrie-e2a.md, Bound Attack Ring research"
}
```

### orbit_movement
```json
{
  "id": "orbit_movement",
  "name": "Orbit Movement / Flower Pattern",
  "description": "Defense/Stamina archetype stable circular orbit — bey maintains a consistent ring around the opponent, minimizing contact while maximizing spin retention.",
  "mechanics": ["orbit_movement"],
  "triggerCondition": "passive (applied at room creation for defense/stamina types) or tick-based",
  "modesSupported": [],
  "generation": "universal",
  "evidence": "ArenaFeatureProcessor.ts:processOrbitMovement() (existing), linka/concepts/flower-pattern.md"
}
```

### magnacore_repel
```json
{
  "id": "magnacore_repel",
  "name": "Magnacore Repulsion (N-N / S-S)",
  "description": "Same-pole magnetic core (both North or both South) generates a repulsion force when two Magnacore beys approach within range. Disrupts opponent trajectory and pushes bey away from attacks.",
  "mechanics": ["magnetic_pull"],
  "triggerCondition": "proximity check: distance < magnetRadiusCm (config). Beys must both carry same-pole Magnecore + Magne Weight Disk.",
  "modesSupported": [],
  "generation": "gen1",
  "systemId": "plastic_magnacore",
  "params": { "pullDirection": "repel", "strength": 0.004, "range": 120 },
  "evidence": "phase-07-gen1.md §Magnacore System, linka/beys/gen1/plastic/vortex-ape.md"
}
```

### magnacore_attract
```json
{
  "id": "magnacore_attract",
  "name": "Magnacore Attraction (N-S)",
  "description": "Opposite-pole magnetic core (North vs South) generates an attraction force when two Magnacore beys approach. Pulls defensive beys back toward center; creates lock-on for offensive beys.",
  "mechanics": ["magnetic_pull", "center_pull"],
  "triggerCondition": "proximity check: distance < magnetRadiusCm. Beys must carry opposite-pole Magnecore + Magne Weight Disk.",
  "modesSupported": [],
  "generation": "gen1",
  "systemId": "plastic_magnacore",
  "params": { "pullDirection": "attract", "strength": 0.003, "range": 100 },
  "evidence": "phase-07-gen1.md §Magnacore System"
}
```

### dual_spin_launch
```json
{
  "id": "dual_spin_launch",
  "name": "Dual Spin Launch (HMS pre-launch)",
  "description": "Pre-launch spin direction selection. Player chooses right or left spin before launching. Distinct from mid-battle counter_rotation (Dranzer GT / L-Drago). All HMS beys have this by default.",
  "mechanics": ["spin_direction_bonus"],
  "triggerCondition": "pre-match setup only (spin direction flag set at match start; no mid-match reversal).",
  "modesSupported": ["right_spin", "left_spin"],
  "generation": "gen1",
  "systemId": "hms",
  "evidence": "phase-07-gen1.md §HMS Era, linka/beys/gen1/hms/dragoon-ms.md — HMS system-wide feature"
}
```

### mode_switch_tip
```json
{
  "id": "mode_switch_tip",
  "name": "Mode Switch / Tip Selector",
  "description": "Pre-battle or mid-battle tip/base configuration change. Gen1 Dranzer family flip-tips (Spiral Change, Flame Change, Volcano Change, Customize Change). Also HMS Manual Change Core, Battle Change Core, Shooter Change Cores.",
  "mechanics": ["mode_switch"],
  "triggerCondition": "onActivate (player-triggered flip/rotation) OR pre-battle manual configuration.",
  "modesSupported": ["attack_mode", "stamina_mode", "defense_mode"],
  "generation": "gen1",
  "systemId": "plastic_sgs",
  "evidence": "phase-07-gen1.md Dranzer family notes, linka/beys/gen1/plastic/dranzer-s.md"
}
```

### spring_launch
```json
{
  "id": "spring_launch",
  "name": "Spring Launch / Jumping Base",
  "description": "Spring-loaded mechanism stores launch energy and releases it as a single-use velocity burst or jump at low spin. Gen1: SG Jumping Base (Trygle), SG Spring Base. HMS: Spring Core (Einstein MS), Aero Core (Aero Knight MS).",
  "mechanics": ["spring_recoil", "velocity_burst"],
  "triggerCondition": "onCollision when impact force > threshold OR spin < springActivationThreshold (auto-release).",
  "modesSupported": [],
  "generation": "gen1",
  "systemId": "plastic_sgs",
  "evidence": "phase-07-gen1.md: Trygle (SG Jumping Base), Einstein MS (Spring Core), Trypio G (Hit Release EG + jump)"
}
```

---

## 2. mechanic_defs Firestore Collection

Each document goes into `mechanic_defs/{mechanicId}`.

The full list of 31 mechanics, mapped from Stage 6:

| mechanicId | handlerEvents | paramsSchema | generation | evidence |
|---|---|---|---|---|
| `energy_reserve` | tick, onActivate | `{ chargeRate, dischargeThreshold, burstForce }` | gen1 | PartPhysics.ts:tickSpinInjection |
| `velocity_burst` | onActivate | `{ forceMagnitude, durationTicks, direction? }` | universal | specialMoves.ts |
| `attack_amplifier` | tick, onActivate | `{ multiplier, durationTicks }` | universal | GameState.ts comboDamageMultiplier |
| `free_spin` | tick | `{ decayModifier, stealResistBonus }` | gen1 | PartPhysics.ts:bearingFriction |
| `spin_transfer` | onCollision | `{ stealFactor, durationTicks }` | universal | PartPhysics.ts:computeSpinSteal |
| `spin_equalization` | onCollision | `{ equalizationRate }` | gen1 | game mechanics INFERENCE |
| `rotation_reverse` | onActivate | `{ reversalDurationTicks? }` | gen1 | PartPhysics.ts:counterRotActive analog |
| `spin_threshold_switch` | tick | `{ highSpinConfig, lowSpinConfig, threshold }` | gen2 | Final Drive research |
| `mode_switch` | onActivate | `{ modeName, stats }` | universal | mode-change research |
| `rubber_grip` | onCollision | `{ gripMultiplier, durationTicks }` | gen1 | rubber tip research |
| `contact_deflect` | onCollision | `{ deflectAngle, damageReduction, recoilBoost }` | gen1 | AD145 deflect |
| `spring_recoil` | onCollision | `{ springForce, recoilBonus }` | gen3 | Bound AR research |
| `weight_shift` | passive, onActivate | `{ massMultiplier, knockbackModifier }` | gen2 | Basalt Horogium research |
| `spin_steal_coupling` | onCollision | `{ couplingAngle, stealMultiplier }` | gen1 | HMS Advance Averazer |
| `rail_lock` | tick | `{ railId, lockSnapDistance, exitSpeed }` | gen4 | GameState.ts xtremeEngaged |
| `center_pull` | tick | `{ pullStrength, maxDistance }` | universal | tornado ridge |
| `bearing_drift` | tick | `{ frictionReduction }` | gen2 | EWD bearing research |
| `burst_suppress` | onCollision | `{ resistBoost, durationTicks }` | gen3 | DB generation |
| `stamina_recovery` | tick | `{ recoveryRate, maxRecovery }` | universal | gyro_anchor special |
| `surface_friction_modifier` | passive | `{ frictionValue }` | universal | tip type research |
| `orbit_movement` | tick | `{ orbitRadius, orbitSpeed, direction }` | universal | ArenaFeatureProcessor.ts existing |
| `upper_launch` | onCollision | `{ upwardForce, airborneTicks }` | gen1 | upper-attack AR geometry |
| `smash_impact` | onCollision | `{ forceMultiplier, damageBonus }` | gen1 | smash-attack AR geometry |
| `barrage_hit` | onCollision | `{ hitCount, perHitForce }` | gen1 | barrage AR INFERENCE |
| `zero_g_float` | tick, onActivate | `{ gravityFactor, durationTicks }` | gen2 | ZeroG stadium research |
| `magnetic_pull` | tick | `{ pullDirection, strength, range }` | gen1 | Magnacore stadium |
| `contact_height_gate` | onCollision | `{ minHeight, maxHeight }` | gen1 | CP radial gate extension |
| `spin_direction_bonus` | onCollision | `{ bonusMultiplier }` | gen2 | L-Drago left-spin research |
| `sub_part_burst` | onActivate | `{ partIndex, projectileForce, lifetimeTicks }` | gen1 | GameState.ts DetachedBodySchema |
| `defense_stance` | onActivate | `{ durationTicks, reductionBoost }` | universal | gyro_anchor special |
| `revival_spin` | tick | `{ threshold=0.2, recoveryRate=10 }` | gen3 | **FACT** — `server/physics/mechanics/revivalSpin.ts`: per-tick gradual recovery (not a burst), adds `recoveryRate * dt` while `spin/maxSpin < threshold` |

---

## 3. Per-Bey gimmickIds — Tier 1 + Tier 2

### Gen1 — Plastic / HMS Key Beys

| Bey | gimmickIds | Notes | Confidence |
|-----|-----------|-------|-----------|
| Dragoon S | `rubber_attack` | Storm Grip rubber tip; aggressive attacker | A |
| Dragoon V | `upper_attacker` | Upper attack AR + dual-attack wings | B |
| Dragoon V2 | `upper_attacker,smash_attacker` | Upper + barrage combination | B |
| Dragoon G | `upper_attacker,energy_reserve` | EG system + upper wings | A |
| Dragoon GT | `smash_attacker,energy_reserve` | Enhanced EG + smash wings | B |
| Dranzer S | `smash_attacker` | Smash AR; fire-type archetype | A |
| Dranzer F | `stamina_recovery` | Compact WD; stamina-lean defense | B |
| Dranzer V | `smash_attacker` | V-Force upgraded attacker | B |
| Dranzer G | `energy_reserve,velocity_burst` | Neo EG; charge-release fire | A |
| Dranzer GT | `smash_attacker,energy_reserve` | GT era apex fire bey | B |
| Driger S | `smash_attacker,contact_deflect` | Smash claws + partial deflect | A |
| Driger F | `spin_steal_coupling,stamina_recovery` | Customize Grip Base bearing | B |
| Driger V | `upper_attacker,smash_attacker` | V2 hybrid attack | B |
| Driger G | `energy_reserve,smash_attacker` | G-Rev EG smash | A |
| Draciel S | `orbit_movement,contact_deflect` | Heavy shield; orbit defense | A |
| Draciel F | `orbit_movement,heavy_wheel` | Four-blade heavy defense | B |
| Draciel V | `orbit_movement,contact_deflect` | V-Force defense upgrade | B |
| Draciel G | `orbit_movement,heavy_wheel,energy_reserve` | EG defense + heavy base | A |
| Draciel MBD | `orbit_movement,bearing_drift` | Metal Bearing Defense core | A |
| Wolborg | `bearing_zombie,spin_steal_coupling` | Wolborg bearing zombie + ice | A |
| Wolborg 2 | `bearing_zombie,spin_steal_coupling` | Enhanced Wolborg bearing | A |
| Wolborg 4 | `bearing_zombie,bearing_drift,spin_steal_coupling` | Bearing Flat Core; apex zombie | A |
| Black Dranzer | `smash_attacker,counter_rotation,energy_reserve` | Boris villain: counter-spin + engine | A |
| Zeus | `heavy_wheel,orbit_movement,bearing_drift` | Brooklyn's bey: inertia + bearing | A |
| Seaborg | `magnacore_pull` | Magnacore system N-pole repel | A |
| Seaborg 2 | `magnacore_pull,spin_steal_coupling` | Evolved Magnacore + steal | B |
| Galeon | `upper_attacker` | Robert's attack: upper wing AR | A |
| Galeon 2 | `upper_attacker,smash_attacker` | Enhanced dual-upper + smash | B |
| Galux | `orbit_movement,contact_deflect` | Robert's stamina/defense hybrid | B |
| Griffolyon | `smash_attacker,upper_attacker` | Oliver's multi-edge attacker | A |
| Salamalyon | `orbit_movement,heavy_wheel` | Enrique's defense: heavy orbit | B |
| Strata Dragoon | `rubber_attack,smash_attacker` | Daichi's sticky attacker | A |
| Strata Dragoon G | `rubber_attack,energy_reserve` | G-Rev Daichi: EG + rubber | A |
| Gaia Dragoon V | `smash_attacker,upper_attacker` | Kai rivalry arc V-Force | B |
| Gaia Dragoon G | `energy_reserve,smash_attacker` | G-Rev Tala's adapted attack | B |
| Cyber Dragoon | `smash_attacker,spin_direction_bonus` | BEGA Daichi evolved | B |
| Cyber Dranzer | `smash_attacker,counter_rotation` | BEGA Kai evolved dual-spin | B |
| Cyber Draciel | `orbit_movement,heavy_wheel` | BEGA Max evolved inertial | B |
| Cyber Driger | `smash_attacker,spin_steal_coupling` | BEGA Rei evolved bearing | B |
| Dragoon MS | `rubber_attack,counter_rotation` | HMS Dragoon: dual-spin rubber | A |
| Dranzer MS | `smash_attacker,counter_rotation` | HMS Dranzer: dual-spin smash | A |
| Dranzer MF | `bearing_drift,stamina_recovery` | HMS Dranzer Metal Flat: LAD | B |
| Draciel MS | `orbit_movement,heavy_wheel,contact_deflect` | HMS Draciel: heavy defense | A |
| Driger MS | `spin_steal_coupling,counter_rotation` | HMS Driger: bearing steal | A |
| Wolborg MS | `bearing_zombie,bearing_drift,counter_rotation` | HMS Wolborg: apex zombie | A |
| Advance Averazer | `spin_steal_coupling,bearing_zombie` | HMS zombie archetype | A |
| Advance Guardian | `orbit_movement,contact_deflect,heavy_wheel` | HMS defense archetype | A |
| Advance Striker | `smash_attacker,rubber_attack` | HMS aggressive attack | B |
| Death Gargoyle MS | `smash_attacker,spin_steal_coupling` | HMS villain bey | B |
| Gaia Dragoon MS | `smash_attacker,counter_rotation,energy_reserve` | HMS attack: EG analog | B |

### Gen1 — Tier 3 + Remaining Tier 2 (from phase-07-gen1, all gimmickIds mapped to gimmick_def IDs)

> Source: `phase-07-gen1.md` §Section 1–4. Mechanic-level IDs from Gen1 agent converted to gimmick_def IDs.
> Mapping key: `rubber_grip` → `rubber_attack` · `bearing_drift+free_spin` → `bearing_zombie` · `free_spin` alone → `spin_steal_coupling` · `spin_equalization` → `spin_steal_coupling` · `mode_switch` → `mode_switch_tip` · `spring_recoil` → `spring_launch` · `contact_deflect` → `ad145_deflect` · `weight_shift` → `heavy_wheel` · `attack_amplifier` → `smash_attacker` · `dual_spin` → `dual_spin_launch` · `orbit_movement` alone → (omit; universal passive) · `magnacore_repel` → `magnacore_repel` · `magnacore_attract` → `magnacore_attract`

| Bey | System | gimmickIds | Confidence |
|-----|--------|-----------|------------|
| **SGS Era additional beys** | | | |
| Dranzer V | plastic_sgs | `mode_switch_tip` | A |
| Dranzer V2 | plastic_sgs | `mode_switch_tip` | A |
| Driger V | plastic_sgs | `mode_switch_tip` | A |
| Driger V2 | plastic_sgs | `mode_switch_tip,spin_steal_coupling` | A |
| Draciel V2 | plastic_sgs | `orbit_movement,ad145_deflect` | B |
| Galzzly | plastic_sgs | `spin_steal_coupling` | A |
| Galman | plastic_sgs | `` | A |
| Salamalyon | plastic_sgs | `orbit_movement,heavy_wheel` | B |
| Unicolyon | plastic_sgs | `` | C |
| Wyborg | plastic_sgs | `` | A |
| Trygle | plastic_sgs | `spring_launch` | A |
| Trygle 2 | plastic_sgs | `` | A |
| Tryhorn | plastic_sgs | `` | C |
| Trypio | plastic_sgs | `ad145_deflect` | A |
| Torguitar | plastic_sgs | `ad145_deflect,heavy_wheel` | B |
| Strata Dragoon | plastic_sgs | `heavy_wheel` | B |
| Seaborg | plastic_sgs | `rubber_attack,mode_switch_tip` | B |
| Seaborg 2 | plastic_sgs | `` | A |
| Sarcophalon | plastic_sgs | `` | B |
| Shamblor | plastic_sgs | `` | B |
| Salamalyon | plastic_sgs | `orbit_movement` | A |
| Master Dranzer | plastic_sgs | `mode_switch_tip` | B |
| Master Draciel | plastic_sgs | `` | B |
| Metal Draciel | plastic_sgs | `mode_switch_tip` | A |
| Matryoshka | plastic_sgs | `` | C |
| Lycanlor | plastic_sgs | `` | C |
| Hopper | plastic_sgs | `spring_launch` | C |
| Hopper 2 | plastic_sgs | `spring_launch` | C |
| Griffolyon | plastic_sgs | `smash_attacker,upper_attacker` | A |
| Gigars | plastic_neosg | `engine_gear,mode_switch_tip` | A |
| Flash Leopard | plastic_sgs | `` | B |
| Flash Leopard 2 | plastic_sgs | `` | B |
| Falborg S | plastic_sgs | `bearing_zombie` | C |
| Falborg 2 | plastic_sgs | `bearing_zombie` | C |
| Draculor | plastic_sgs | `` | C |
| Death Driger | plastic_sgs | `` | A |
| Cyber Dranzer | plastic_sgs | `` | C |
| Cyber Driger | plastic_sgs | `` | C |
| Cyber Draciel | plastic_sgs | `orbit_movement,heavy_wheel` | C |
| Cyber Dragoon | plastic_sgs | `smash_attacker` | C |
| Chameleon | plastic_sgs | `ad145_deflect` | C |
| Canarias | plastic_sgs | `mode_switch_tip` | C |
| Black Dranzer | plastic_sgs | `smash_attacker,counter_rotation,engine_gear` | A |
| Apollon | plastic_sgs | `` | C |
| Amphilyon | plastic_sgs | `` | C |
| **Magnacore Era** | | | |
| Vortex Ape | plastic_magnacore | `magnacore_repel,spin_steal_coupling` | A |
| Sharkrash | plastic_magnacore | `magnacore_repel` | B |
| Vanishing Moot | plastic_magnacore | `magnacore_repel` | B |
| Gabriel | plastic_magnacore | `spin_steal_coupling` | A |
| Darillanzer | plastic_magnacore | `` | C |
| Figelanzer | plastic_magnacore | `` | C |
| Dark Gargoyle | plastic_magnacore | `` | A |
| **Engine Gear Era** | | | |
| Metal Driger | plastic_neosg | `heavy_wheel` | A |
| Pierce Hedgehog | plastic_neosg | `spring_launch` | C |
| Rapid Eagle | plastic_neosg | `` | B |
| Rock Bison | plastic_neosg | `engine_gear,spin_steal_coupling` | A |
| Rushing Boar | plastic_neosg | `` | B |
| Thunder Pegasus | plastic_neosg | `dual_spin_launch,engine_gear` | A |
| Torch Pegasus | plastic_neosg | `dual_spin_launch` | A |
| Trypio G | plastic_neosg | `engine_gear,spring_launch` | A |
| **HMS Era additional** | | | |
| Strata Dragoon MS | hms | `spin_steal_coupling` | A |
| Wyvern DJ | hms | `` | A |
| Einstein MS | hms | `spring_launch` | A |
| Advance Eterner | hms | `spin_steal_coupling` | A |
| Phantom Fox MS | hms | `spin_steal_coupling` | A |
| Dark Leopard MS | hms | `` | A |
| Dragoon MF | hms | `rubber_attack` | A |
| Dragoon MS UV | hms | `rubber_attack,engine_gear` | A |
| Dranzer MF | hms | `bearing_drift` | A |
| Jiraiya MS | hms | `bearing_zombie` | A |
| Magical Ape MS | hms | `mode_switch_tip` | A |
| Round Shell MS | hms | `rubber_attack,ad145_deflect` | A |
| Samurai Changer MS | hms | `mode_switch_tip` | A |
| Sea Dragon | hms | `spin_steal_coupling,ad145_deflect` | A |
| Shining God MS | hms | `mode_switch_tip` | A |
| Slash Riger MS | hms | `spin_steal_coupling` | A |
| Bloody Devil MS | hms | `mode_switch_tip` | A |
| Thunder Dragon | hms | `spin_steal_coupling,ad145_deflect` | A |
| Aero Knight MS | hms | `spring_launch` | A |

> **[GEN1-COMPLETE]**: All 119 Gen1 plastic/HMS beys now have gimmickIds (Keel Shark excluded — Gen4 BX). Tier 1+2 are above; Tier 3 here. 14 beys have no gimmick (`[]`) — these are anime-exclusives with no documented mechanical differentiation.

---

### Gen2 — MFB Tier 1 + 2 (from Stage 7 Gen234)

| Bey | gimmickIds | Notes |
|-----|-----------|-------|
| Storm Pegasus 105RF | `velocity_burst,rubber_attack` | Gingka S1; HF rubber rush |
| Galaxy Pegasus W105R²F | `velocity_burst,rubber_attack` | Gingka S2; R²F high-grip |
| Cosmic Pegasus F:D | `final_drive,mode_switch,attack_amplifier` | Gingka Legendary; 3-mode F:D |
| L-Drago Destroy F:D | `spin_steal_coupling,final_drive,counter_rotation,mode_switch` | Ryuga apex; left-spin steal + F:D |
| Lightning L-Drago 100HF | `spin_steal_coupling,counter_rotation,velocity_burst` | Ryuga S1; velocity + spin steal |
| Meteo L-Drago LW105LF | `spin_steal_coupling,counter_rotation,rubber_attack` | Ryuga S2; rubber left drain |
| Big Bang Pegasus F:D | `final_drive,mode_switch` | Gingka S2 hero; F:D auto |
| Gravity Perseus AD145WD | `counter_rotation,mode_switch` | Gingka rival; dual-spin counter |
| Diablo Nemesis X:D | `mode_switch,spin_equalization,free_spin` | Final boss; X:D triple-tip |
| Hades Kerbecs BD145DS | `free_spin,heavy_wheel` | Hades villain; BD145 free-spin |
| Hell Kerbecs BD145DS | `free_spin,heavy_wheel,stamina_recovery` | Hades evolved; max anchor |
| Basalt Horogium 145WD | `heavy_wheel,stamina_recovery` | Benkei's anchor; 50g inertia |
| Phantom Orion B:D | `free_spin,bearing_zombie,stamina_recovery` | Stamina king; B:D free-spin |
| Burn Fireblaze 145MS | `bearing_zombie` | Yu S2; bearing LAD |
| Earth Eagle 145WD | `bearing_zombie,stamina_recovery` | Yu rival; Earth wide |
| Fang Leone 130W²D | `mode_switch,spring_recoil,contact_deflect` | Kyle; fang-claw defense |
| Dark Libra ED145SD | `free_spin,spin_steal_coupling` | Libra team; ED145 drain |
| Sol Blaze V145AS | `mode_switch,attack_amplifier` | Legendary; V145 variable |
| Scythe Kronos T125EDS | `free_spin,mode_switch,stamina_recovery` | 4D stamina; EDS eternal |
| Blitz Unicorno 100RSF | `mode_switch,rubber_attack` | Masamune upgraded; Blitz dual |
| Rock Leone 145WB | `heavy_wheel,contact_deflect` | Kyoya early; Rock wide |

---

### Gen2 — Zero-G Tier 1 + 2

| Bey | gimmickIds | Notes |
|-----|-----------|-------|
| Samurai Ifraid W145CF | `heavy_wheel,smash_attacker` | Zyro protagonist; Synchrome heavy |
| Thief Phoenic E230GCF | `gravity_mode,orbit_movement` | Zero-G orbit hybrid; BSF tip |
| Pirate Orochi E230GCF | `orbit_movement,weight_shift` | E230 weight-shift orbit |
| Berserker Begirados SR200BWD | `heavy_wheel,orbit_movement` | Defensive anchor; SR200 high |
| Bandid Genbull F230TB | `heavy_wheel,contact_deflect` | Defense Synchrome; F230 tall |
| Guardian Leviathan 160SB | `orbit_movement,bearing_drift` | Stamina hybrid; SB bearing |
| Bandit Golem 145F | `heavy_wheel,smash_attacker` | ZeroG villain; Synchrome |

---

### Gen3 — Tier 1 + 2 (from Stage 7 Gen234 batches)

| Bey | gimmickIds | Notes |
|-----|-----------|-------|
| Valtryek V2 6Vortex Reboot | `velocity_burst,mode_switch` | Valt S1 hero; attack reboot |
| Spryzen Requiem S3 0Xtend+ | `mode_switch,orbit_movement` | Shu Requiem; defensive/attack |
| Luinor L3 11Turn Destroy | `smash_attacker,burst_armor` | Free burst mode smash |
| Turbo Achilles A4 00Dimension | `velocity_burst,burst_armor,attack_amplifier` | Aiger Cho-Z; zero-turn |
| Turbo Spryzen S4 0Zephyr | `mode_switch,orbit_movement` | Shu CZ; balance |
| Cho-Z Achilles A4 00Dimension | `cho_z_spin_boost,velocity_burst,energy_reserve` | Cho-Z Awakening apex |
| Cho-Z Valkyrie Z Engage | `cho_z_spin_boost,rubber_attack` | Valt CZ; Z engage rubber |
| Cho-Z Spryzen S4 0Zephyr | `cho_z_spin_boost,orbit_movement` | Shu CZ stamina |
| Cho-Z Achilles (variant) | `cho_z_spin_boost,attack_amplifier` | Metal-embedded attack boost |
| Wild Wyvern 0 Yard | `rubber_attack,velocity_burst` | BW villain; Y tip |
| Dead Phoenix 0Atomic | `orbit_movement,bearing_zombie` | DB survivor; Atomic bearing |
| Ace Dragon D3 | `smash_attacker,burst_armor` | Dante GT; Ace plate smash |
| Rage Longinus D3 Destroy | `counter_rotation,smash_attacker,spin_steal_coupling` | GT left-spin; Destroy |
| Dynamite Belial Nx2 | `movable_sub_layer,mode_switch,heavy_wheel` | Aiger DB; 5-gear multi-mode |
| Guilty Longinus KMD2 | `counter_rotation,burst_armor,smash_attacker` | GT/DB villain; ultimate left |
| Limit Break DX Set beys | `mode_switch,burst_armor` | Generic DB generation |
| Ultimate Valkyrie LV.9 | `mode_switch,spring_recoil,velocity_burst` | Valt BU; LV.9 spring |
| Brave Valkyrie E2A | `spring_recoil,velocity_burst` | Valt Superking; Bound |
| Variant Lucifer M.II D | `mode_switch,orbit_movement,free_spin` | Lui final; Variable M.II |
| Rage Longinus (God) | `counter_rotation,smash_attacker` | Ryuga successor God era |
| Perfect Phoenix P2 | `orbit_movement,stamina_recovery,free_spin` | Phi superking; Perfect Core |
| Wizard Fafnir F4 Nothing | `free_spin,spin_steal_coupling,bearing_zombie` | Ranjiro left-spin stamina |
| Glide Ragnaruk Wh.R | `bearing_drift,stamina_recovery` | DB stamina archetype |
| Union Achilles C/U.A EY | `mode_switch,attack_amplifier` | Lane S4 variant |
| Arc Bahamut Sen Jaggy | `burst_armor,orbit_movement,stamina_recovery` | Hyuga DB; bearing |

---

### Gen4 (BX) — Tier 1 + 2 (from Stage 7 Gen234)

| Bey | gimmickIds | Notes |
|-----|-----------|-------|
| DranSword 3-60F | `xtreme_dash,velocity_burst` | Bird protagonist S1 |
| HelmsHammer 3-80N | `xtreme_dash,smash_attacker,heavy_wheel` | Bao rival; Hammer |
| KnightShield 5-60GF | `contact_deflect,orbit_movement,xtreme_dash` | Shield defense |
| WizardArrow 4-80B | `bearing_drift,free_spin,xtreme_dash` | Shu analog; Arrow bearing |
| CobaltDrake 4-70F | `velocity_burst,xtreme_dash,attack_amplifier` | Cobalt wing speed |
| ShinobiShadow 3-80N | `xtreme_dash,smash_attacker` | Ninja attack |
| PhantomOrion (BX) | `free_spin,bearing_zombie,xtreme_dash` | BX stamina anchor |
| ValkyrieVolt CX | `xtreme_dash,attack_amplifier,spring_recoil` | CX Assist Blade |
| DranDagger 4-60R | `xtreme_dash,rubber_attack,velocity_burst` | BX S3 rubber rush |
| DranStrike 4-50FF | `xtreme_dash,velocity_burst,attack_amplifier` | BX S3 Expand Plate apex |
| GhostCircle CX | `free_spin,orbit_movement,xtreme_dash` | 0-tooth immune; CX |
| CrimsonGaruda TP | `mode_switch,xtreme_dash` | TP auto-cycle every dash |
| HellsScythe UX | `smash_attacker,xtreme_dash,heavy_wheel` | UX villain; Death Scythe |
| ScytheIncendio UX | `spin_steal_coupling,xtreme_dash,stamina_recovery` | UX stamina drain |
| AeroPegasus UX | `xtreme_dash,velocity_burst,attack_amplifier` | BX S2 villain; speed |

---

## 4. gimmicks.ts Constant File

This is the content of `src/constants/gimmicks.ts` (and mirrored client-side in `client/src/constants/gimmicks.ts`):

```typescript
// src/constants/gimmicks.ts
// All gimmick IDs registered in the GIMMICK_REGISTRY.
// These must match the `gimmick_defs` Firestore collection documents.

export const GIMMICK_IDS = [
  "engine_gear",
  "final_drive",
  "bearing_zombie",
  "bearing_drift",
  "movable_sub_layer",
  "heavy_wheel",
  "ad145_deflect",
  "xtreme_dash",
  "xtreme_line",
  "spin_steal_coupling",
  "counter_rotation",
  "magnacore_pull",
  "left_spin_steal",
  "gravity_mode",
  "upper_attacker",
  "smash_attacker",
  "rubber_attack",
  "burst_armor",
  "cho_z_spin_boost",
  "bx_bit_gimmick",
  "spring_recoil",
  "orbit_movement",
] as const;

export type GimmickId = typeof GIMMICK_IDS[number];

export interface GimmickDef {
  id: GimmickId;
  name: string;
  description: string;
  mechanics: string[];
  triggerCondition: string;
  modesSupported: string[];
  generation: "gen1" | "gen2" | "gen3" | "gen4" | "universal";
  systemId?: string;
  evidence?: string;
}
```

---

## 5. gimmickExpander.ts Logic

`src/utils/gimmickExpander.ts` converts a beyblade's `gimmickIds[]` array → `MechanicInstance[]` at room creation.

```typescript
// src/utils/gimmickExpander.ts

import { GimmickDef } from "../constants/gimmicks";
import { MechanicInstance } from "../schema/GameState";

/**
 * Given a list of gimmickIds (from BeybladeStats.gimmickIds),
 * fetch each GimmickDef from the preloaded gimmickDefsCache,
 * and expand each mechanic in the def into a MechanicInstance.
 *
 * Called once in room.onCreate() — NOT in the game loop.
 */
export function expandGimmicks(
  gimmickIds: string[],
  gimmickDefsCache: Record<string, GimmickDef>
): MechanicInstance[] {
  const instances: MechanicInstance[] = [];

  for (const gimmickId of gimmickIds) {
    const def = gimmickDefsCache[gimmickId];
    if (!def) {
      console.warn(`[gimmickExpander] Unknown gimmickId: ${gimmickId}`);
      continue;
    }

    for (const mechanicId of def.mechanics) {
      const inst = new MechanicInstance();
      inst.type = mechanicId;
      // Default params derived from gimmick context; 
      // can be overridden per-bey via BeybladeStats.mechanicOverrides
      inst.params = JSON.stringify(getDefaultParams(mechanicId, def));
      inst.state = "{}";
      inst.active = true;
      instances.push(inst);
    }
  }

  return instances;
}

function getDefaultParams(mechanicId: string, def: GimmickDef): Record<string, unknown> {
  // Default param values per mechanic — pulled from MECHANIC_REGISTRY defaults
  // These are conservative starter values; bey seeder can override per-bey
  const DEFAULTS: Record<string, Record<string, unknown>> = {
    energy_reserve:   { chargeRate: 0.3, dischargeThreshold: 0.9, burstForce: 0.08 },
    velocity_burst:   { forceMagnitude: 0.05, durationTicks: 10 },
    attack_amplifier: { multiplier: 1.3, durationTicks: 20 },
    free_spin:        { decayModifier: 0.3, stealResistBonus: 0.2 },
    spin_transfer:    { stealFactor: 0.15, durationTicks: 5 },
    spin_equalization:{ equalizationRate: 0.05 },
    mode_switch:      { modeName: "default", stats: {} },
    rubber_grip:      { gripMultiplier: 1.5, durationTicks: 8 },
    contact_deflect:  { deflectAngle: 45, damageReduction: 0.4, recoilBoost: 0.3 },
    spring_recoil:    { springForce: 0.04, recoilBonus: 0.25 },
    weight_shift:     { massMultiplier: 1.2, knockbackModifier: -0.15 },
    spin_steal_coupling: { couplingAngle: 65, stealMultiplier: 1.4 },
    rail_lock:        { lockSnapDistance: 10, exitSpeed: 1.5 },
    center_pull:      { pullStrength: 0.002, maxDistance: 200 },
    bearing_drift:    { frictionReduction: 0.05 },
    burst_suppress:   { resistBoost: 0.2, durationTicks: 15 },
    stamina_recovery: { recoveryRate: 2, maxRecovery: 50 },
    orbit_movement:   { orbitRadius: 150, orbitSpeed: 0.8, direction: "counterclockwise" },
    upper_launch:     { upwardForce: 0.03, airborneTicks: 30 },
    smash_impact:     { forceMultiplier: 1.2, damageBonus: 5 },
    spin_threshold_switch: { threshold: 0.45, highSpinConfig: {}, lowSpinConfig: {} },
    rotation_reverse: { reversalDurationTicks: 180 },
    spin_direction_bonus: { bonusMultiplier: 1.35 },
    zero_g_float:     { gravityFactor: 0.3, durationTicks: 120 },
    magnetic_pull:    { pullDirection: "attract", strength: 0.003, range: 100 },
    defense_stance:   { durationTicks: 90, reductionBoost: 0.3 },
    revival_spin:     { threshold: 0.2, recoveryRate: 10 },
  };
  return DEFAULTS[mechanicId] ?? {};
}
```

---

## 6. Seed Script Note

The `gimmick_defs` and `mechanic_defs` collections are seeded by:
```bash
npm run seed:gimmicks   # writes all 22 GimmickDef docs to gimmick_defs/
npm run seed:mechanics  # writes all 31 MechanicDef docs to mechanic_defs/
```

Both are included in `npm run seed:all` (order: before beyblades).

Per-bey `gimmickIds[]` are embedded in the beyblade seed docs (`npm run seed:beyblades`). The table in Section 3 is the authoritative source for Tier 1+2 bey gimmickIds. Tier 3 beys default to empty `gimmickIds: []` unless a specific functional gimmick was found.

---

## 7. Status

| Section | Status | Blocker |
|---|---|---|
| gimmick_defs (27 docs) | COMPLETE | — (5 new: magnacore_repel, magnacore_attract, dual_spin_launch, mode_switch_tip, spring_launch) |
| mechanic_defs (31 docs) | COMPLETE | — |
| Gen1 Tier 1+2 bey mapping | COMPLETE | — |
| Gen1 Tier 3 bey mapping | COMPLETE | — (from phase-07-gen1.md, all 119 Gen1 beys mapped) |
| Gen2+3+4 bey mapping | COMPLETE | — |
| gimmicks.ts constant | NEEDS UPDATE | Add 5 new gimmick IDs to GIMMICK_IDS array |
| gimmickExpander.ts | COMPLETE (logic defined) | — |

### gimmicks.ts update needed

Add to `GIMMICK_IDS` array (after `"orbit_movement"`):
```typescript
  "magnacore_repel",
  "magnacore_attract",
  "dual_spin_launch",
  "mode_switch_tip",
  "spring_launch",
```
Total: 27 gimmick_defs.

Source files: `research/phases/phase-06-mechanics.md`, `research/phases/phase-07-gen234.md`, `research/phases/phase-07-gen1.md`

---
[← Phase 07b: Generations 2-4](phase-07-gen234.md) &nbsp;�&nbsp; [↑ Index](../INDEX.md) &nbsp;�&nbsp; [Phase 09: Arenas →](phase-09-arenas.md)

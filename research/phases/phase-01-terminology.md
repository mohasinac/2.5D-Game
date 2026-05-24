[← Phase 00: Engine Audit](phase-00-engine-audit.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 02: Special Moves →](phase-02-special-moves.md)

---

# Phase 01 — Terminology, Definitions, Concepts

> **Stage 1** | Source: `linka/concepts/` (120+ files read) + internet validation (3 targeted searches)
> **Date:** 2026-05-23
> **Analyst:** Claude Code (claude-sonnet-4-6)

---

## Tag Key

| Tag | Meaning |
|-----|---------|
| FACT | Confirmed from official source, wiki, or physical product |
| INFERENCE | Deduced from multiple converging sources; high confidence |
| SPECULATION | Plausible interpretation; requires validation |
| UNKNOWN | Unverified; flagged for follow-up |

## Level Key

| Level | Meaning |
|-------|---------|
| 1 — mechanic | Modifies runtime fields (velocities, timers, spin, health) |
| 2 — geometry | Part shape, contact zone, hitbox (affects which mechanic fires) |
| 3 — attribute | Static configuration value (mass, material, generation tag) |

---

## Batch 1A — Type System + Collision Physics + Attack Mechanics

### Concept Table

| Concept | Local Source | Internet Sources | Raw Fact | Evidence Type | Level | Existing Stat Mapping | New Field Needed? | Confidence |
|---------|-------------|-----------------|----------|---------------|-------|-----------------------|-------------------|------------|
| Attack Type | `attack-type.md` | WBO wiki, BeyWiki | Counters Stamina (high-speed hit outspins before it can outlast); loses to Defense (recoil causes self-KO). Canonical tip: Flat/Rubber Flat. AR shape: pointed radial protrusions for smash. | FACT | 1 | `attackPoints`, `aggressiveness` high; `recoilFactor` moderate; `gripFactor` high (rubber tip) | No — maps cleanly | High |
| Defense Type | `defense-type.md` | WBO wiki | Counters Attack (converts attacker's force into self-KO via recoil reflection); loses to Stamina (can't spin-steal, eventually out-spun). Round/smooth AR, inward WD, heavy mass, bearing/rubber base. | FACT | 1 | `defensePoints` high; `mass` high; `recoilFactor` low (absorbs); `damageReduction` high | No | High |
| Stamina Type | `stamina-type.md` | WBO wiki | Counters Defense (out-spins it since defense can't win by spin-out); loses to Attack (can't take a hit). Outward WD, narrow tip, minimal floor contact. L = I×ω conservation. | FACT | 1 | `staminaPoints` high; `spinDecayRate` low; `spinStealResist` high; `mass` medium | No | High |
| Balance Type | `balance-type.md` | BeyWiki | Not on the type triangle — adaptable to multiple opponents. Moderate all-stats. Zombie combination is technically Balance classification. | FACT | 3 | All stats moderate; no single dominant field | No | High |
| Smash Attack | `smash-attack.md` | BeyWiki attack mechanics | Point-contact pressure on opponent's AR. Radial lateral force. Outward radial impact delivers KO momentum. Delivered via flower pattern. | FACT | 2 | `attackPoints`; `contactDamageMultiplier`; `ZoneInteractionTable.SPIKE_CONTACT` | No — needs `ZoneInteractionTable` entry | High |
| Upper Attack | `upper-attack.md` | WBO tournament docs | Ramp geometry on AR lifts opponent airborne. Attacker must be shorter (lower CoG) than opponent. `lastContactHeightPermille` < 200‰ triggers airborne. Effective vs Stamina when it destabilizes opponent. | FACT | 2 | `attackPoints`; `AirborneSystem`; contact height permille | `lastContactHeightPermille` if not present | High |
| Barrage Attack | `barrage-attack.md` | BeyWiki | Rapid multi-hit attrition attack. Low per-contact force but high frequency. Cumulative spin drain + burst pressure accumulation. AR must have many contact protrusions. | FACT | 1 | `contactFreqMultiplier`; `burstPressure` accumulation; `BODY_CONTACT` zone type | `contactFreqMultiplier` if not present | High |
| Collision Physics (CoR) | `collision-physics.md`, `elastic-collision.md` | Physics textbooks | CoR by material: metal 0.85–0.95, plastic 0.5–0.7, rubber 0.2–0.4. Combined CoR = √(CoR₁ × CoR₂). Contact height determines smash vs upper. Linear + angular momentum conserved per collision. | FACT | 1 | `recoilFactor` (CoR analog); material-based CoR lookup table | `contactMaterial` enum if not present | High |
| Recoil | `recoil.md` | WBO wiki | Four types: lateral (deflects outward), self-KO (deflects self), spin-reduction (reduces own spin), extreme (chaotic). Gen3 strategic inversion: high recoil = more burst pressure. Gen1: high recoil = self-KO risk. | FACT | 1 | `recoilFactor`; `burstPressure` accumulation rate | No | High |
| Momentum Transfer | `momentum-transfer.md` | Physics texts | p = m×v. Δp = F×Δt. Heavy bey loses less velocity per collision (inertia advantage). Ringout threshold = opponent's bey exits stadium boundary after velocity change. | FACT | 1 | `mass`; `contactDamageMultiplier`; ringout velocity threshold | No | High |

### Batch 1A Summary

The type triangle (Attack → Stamina → Defense → Attack) is fully confirmed by both local concept files and WBO documentation. All three types map cleanly to existing runtime fields: `attackPoints`/`aggressiveness` for Attack, `defensePoints`/`mass`/`damageReduction` for Defense, `staminaPoints`/`spinDecayRate`/`spinStealResist` for Stamina. The three main attack mechanics (Smash, Upper, Barrage) each require distinct contact zone geometry (`ZoneInteractionTable` entries) which likely need to be verified in the engine implementation. Collision physics are fully covered by the existing `recoilFactor` + material-based CoR system. No critical new fields are required for this batch, though `lastContactHeightPermille` and `contactFreqMultiplier` need to be confirmed as implemented.

---

## Batch 1B — Gen1 Part Systems + Physics Principles

### Concept Table

| Concept | Local Source | Internet Sources | Raw Fact | Evidence Type | Level | Existing Stat Mapping | New Field Needed? | Confidence |
|---------|-------------|-----------------|----------|---------------|-------|-----------------------|-------------------|------------|
| 4-Layer System (Gen1) | `4-layer-system.md` | BeyWiki | Original 2000 system: Attack Ring (AR) + Weight Disk (WD) + Spin Gear (SG) + Blade Base (BB). Right-spin only. Tip is integral to BB. AR shape determines all contact zone geometry. | FACT | 3 | `PartDef.generation: 'plastic'`; `ContactZoneSpec.zoneType` | No — generation tag handles this | High |
| Spin Gear System | `spin-gear-system.md` | BeyWiki | 2001 expansion: introduces left-spin via Left SG. NEO SG = hollow modular core accepts interchangeable cores (Normal, Bearing, Running, MG Core, Engine Gear). Enables most Gen1 special mechanics. | FACT | 3 | `spinDirection: 'right' | 'left'`; `PartDef.generation` | No | High |
| Engine Gear System | `engine-gear-system.md` | BeyWiki, WBO | Spring-loaded SG; two variants: Standard EG (Instant Release = First Clutch, fires at launch) and Hit Release EG (Final Clutch, fires on impact). Turbo EG = 4× stronger spring. `coreReserveRemaining` tracks charge. One-time use per battle. Competitive use limited due to post-release instability. | FACT | 1 | `coreReserveRemaining`; `attackBuffTimer`; need `egBoostOmega` | `egBoostOmega` — stores the one-time angular velocity burst magnitude | High |
| Hard Metal System | `hard-metal-system.md` | BeyWiki | HMS 2003: 3-piece system (AR = Metal Frame + ABS Caul, RC = Running Core, Bit Protector). All-metal contact surfaces CoR ≈ 0.9. Lightest/fastest Beyblades due to compact size. Max recoil but max KO force. | FACT | 3 | `contactMaterial: 'metal'`; `recoilFactor` high; `PartDef.generation: 'hms'` | `PartDef.generation: 'hms'` if not present | High |
| Magnacore System | `magnacore-system.md` | BeyWiki | North pole Magnecore → attracted to stadium magnets → pulled toward walls → defense stability (resists destabilization). South pole → repelled → pushed to center → attack aggression. Requires stadium with embedded magnets. `effectiveGravity` analog per pole orientation. | FACT | 1 | `effectiveGravity`; `ArenaModifierSystem`; arena `hasMagnets` flag | `magnetPolarity: 'north' | 'south' | 'none'` on BeyDef | High |
| Angular Momentum | `angular-momentum.md` | Physics texts | L = I × ω. Conservation law: unless external torque applied, L is constant. Spin transfer during equalization: ΔL_attacker + ΔL_defender = 0 (for equal-mass equal-inertia case). Gyroscopic stabilization = L vector resists tipping. | FACT | 1 | `angularVelocity` (implicit in `spin`); `spinStealFactor` for transfer | No | High |
| Rotational Inertia | `rotational-inertia.md` | Physics texts | I = Σ(m_i × r_i²). Perimeter mass contributes quadratically → OWD has much higher I than CWD for same total mass. High I = slower RPM decay per unit friction torque. Direct driver of stamina performance. | FACT | 1 | `staminaPoints` (indirect); `spinDecayRate` = μ×m×g×r/I | `momentOfInertia` or compute from `mass` + distribution | Medium-High |
| Gyroscopic Stability | `gyroscopic-stability.md` | Physics texts | Precession rate: Ω = (m×g×r_cm) / (I×ω). High spin → low Ω → stable. Below stability threshold → wobble (nutation). `wobbleAmplitude` increases as ω decreases. `beyTiltAngle` tracks current tilt. | FACT | 1 | `wobbleAmplitude`; `beyTiltAngle`; stability = `spin / maxSpin` | No — engine already models this | High |
| Weight Distribution | `weight-distribution.md` | WBO wiki | OWD (Outer Weight Disk): mass at perimeter → high I → more stamina + more KO momentum. CWD (Center Weight Disk): mass at center → low I → higher RPM → more burst pressure + attack speed. Wide Survivor WD = best OWD for LAD. | FACT | 3 | `massDistribution` archetype; `staminaPoints` + `attackPoints` affected | `massDistribution: 'owp' | 'cwp' | 'balanced'` enum | High |
| Friction (Tip) | `friction.md` | WBO wiki, physics | μ values by material: rubber flat ~0.8–1.0, rubber ~0.6–0.8, plastic flat ~0.3–0.5, sharp/point ~0.02–0.1, bearing ~0.01–0.05. `spinDecayRate` = μ × m × g × r / I. High-μ = aggressive movement + fast spin drain. Low-μ = stationary + extreme spin retention. | FACT | 1 | `spinDecayRate`; `gripFactor`; `surfaceFriction` | No | High |

### Batch 1B Summary

Gen1 system architecture maps well to existing engine fields. The most important new field identified is `egBoostOmega` for the Engine Gear System's one-time spring release (currently `coreReserveRemaining` + `attackBuffTimer` are present but need the magnitude value). `magnetPolarity` is needed on BeyDef to distinguish North (defense stability) from South (attack aggression) Magnacore behavior. `massDistribution` enum (OWD/CWD/balanced) is needed to modulate both `spinDecayRate` and `staminaPoints` calculation. Physics principles (angular momentum, rotational inertia, gyroscopic stability, friction) map directly to existing runtime fields; the engine's wobble/tilt model matches the physics derivation.

---

## Batch 1C — Zombie/LAD/Free-Spin + Mode-Change + Stamina Mechanics

### Concept Table

| Concept | Local Source | Internet Sources | Raw Fact | Evidence Type | Level | Existing Stat Mapping | New Field Needed? | Confidence |
|---------|-------------|-----------------|----------|---------------|-------|-----------------------|-------------------|------------|
| Zombie Strategy | `zombie-strategy.md` | WBO wiki (WBO coined term) | Three phases: (1) survive hits via bearing tip + heavy mass, (2) equalization via opposite-spin contact + `spinStealFactor`, (3) outlast via free-spin LAD. Requires: left-spin + bearing tip + circular OWD + weak launch. Originally called "Heavy Metal" setups. WBO coined "Zombie" terminology. | FACT | 1 | `SpinStealSystem`; `LADPhaseSystem`; `spinStealFactor`; `bearing` tip material | No — all systems referenced exist | High |
| Spin Steal | `spin-steal.md` | WBO wiki | Gear-coupling friction at opposite-spin contact transfers angular momentum from opponent to attacker. Rubber tips amplify transfer (higher μ = longer contact = more transfer). Free-spinning bearing tip bypasses equalization entirely (decoupled from body). `spinStealFactor` controls magnitude. | FACT | 1 | `spinStealFactor`; `spinStealResist` | No | High |
| Spin Equalization | `spin-equalization.md` | WBO wiki | Sustained bidirectional spin transfer during prolonged contact. Opposite-spin required. Sustained contact (round body geometry) → slower equalization → more total transfer. Gear-coupling friction mechanism. Engine's `SpinStealSystem` handles tick-by-tick equalization. | FACT | 1 | `spinStealFactor`; `SpinStealSystem` | No | High |
| Free-Spin (Bearing Defense) | `free-spin.md`, `bearing-defense.md` | WBO wiki | Bearing tip decouples tip rotation from body. Spectrum: rubber coupling (low decoupling) → bushing → chain → precision ball bearing (near-zero decoupling). `tipFrictionFactor: 0.1` for bearing. Prevents spin drain via tip friction. Isolates from equalization. LAD enabled. | FACT | 1 | `spinDecayRate` near 0; `surfaceFriction` near 0; bearing material | `tipFrictionFactor` if not present as distinct field | High |
| LAD (Life After Death) | `lad-life-after-death.md` | WBO wiki (defines LAD) | Rolling phase when bey falls on its side. Requires: round AR (must not catch floor), wide rim (Wide Survivor WD for Gen1, Atomic tip for Gen3). Rolling duration before full stop = LAD duration. WBO historical tuning now illegal (weight modifications). | FACT | 1 | `LADPhaseSystem`; `gyroStability` threshold; `wobbleAmplitude` | `ladRollDurationMs` or `hasLadProfile: bool` on BeyDef | High |
| Mode Change | `mode-change.md` | BeyWiki, Hasbro rules | Four mechanisms: (1) tip twist before battle (HF/S flip), (2) Energy Ring rotation (repositions AR contact zones), (3) Frame repositioning (GT era), (4) auto-switch mid-battle (Final Drive 4D). `World.ts.modeState` tracks current mode. `DynamicHitboxSystem` updates contact zone geometry. | FACT | 1 | `World.ts.modeState`; `DynamicHitboxSystem` | No — systems referenced exist | High |
| Drift Movement | `drift-movement.md` | WBO tournament 2021 stats | Drift Driver (Gen3): free-spinning conical sharp tip + octagonal Disc body. Creates unique sliding drift pattern. Most-used Driver in 2021 Takara Tomy tournament season. Excellent LAD + burst defense (decoupled tip = less burst pressure from floor friction). | FACT | 2 | `MovementArchetype.drift`; `contactMaterial: bearing`; `ladProfile` | `MovementArchetype: 'drift'` if not enumerated | High |
| Tornado Stall | `tornado-stall.md` | WBO wiki | Bey rides outer stadium ridge in circular orbit. Stadium shake (external) can destabilize bey at center. Stadium geometry required: tornado ridge at ~80% radius. Self-KO risk from high rim. `ArenaConfig.heightProfile` provides tornado ridge. | FACT | 2 | `ArenaConfig.heightProfile`; `movementPattern: 'ridge_orbit'` | `tornadoRidgeRadius` on StadiumDef | Medium-High |
| Flower Pattern | `flower-pattern.md`, `banking.md` | WBO wiki | Banking launch (30–45° tilt) creates repeating petal orbit. High-friction rubber flat tip required. Multiple center-strike opportunities per pass. `launchAngle` > 0 in `LaunchInputFrame`. Creates predictable attack delivery angle. | FACT | 2 | `LaunchInputFrame.launchAngle`; `gripFactor` high | No | High |
| Weak Launch | `weak-launch.md` | WBO wiki | 30–60% max pull strength. Reduces RPM gap to opponent. Reduces spin equalization gradient (closer spin rates = more opponent spin transferred in equalization). `pullStrength: 0.6` in launch frame. Essential for zombie strategy setup. | FACT | 3 | `LaunchInputFrame.pullStrength`; `spinStealFactor` scaling | No | High |

### Batch 1C Summary

The zombie/LAD/equalization cluster is the most mechanically complex group in Gen1 competitive play. All three zombie phases (`SpinStealSystem`, `LADPhaseSystem`, bearing tip material) reference existing engine systems. The key gap is `tipFrictionFactor` as a distinct field (separate from general `surfaceFriction`) and `ladRollDurationMs`/`hasLadProfile` on BeyDef to configure the LAD phase properly. Mode change maps cleanly to the existing `World.ts.modeState` + `DynamicHitboxSystem` architecture. Drift movement likely needs `MovementArchetype.drift` enumeration if not already present. Tornado stall needs `tornadoRidgeRadius` on StadiumDef.

---

## Batch 1D — Xtreme Dash + Movement Mechanics + Lore Foundations

### Concept Table

| Concept | Local Source | Internet Sources | Raw Fact | Evidence Type | Level | Existing Stat Mapping | New Field Needed? | Confidence |
|---------|-------------|-----------------|----------|---------------|-------|-----------------------|-------------------|------------|
| Xtreme Dash | `xtreme-dash.md` | Official Takara-Tomy tournament rules 2024 (web search confirmed) | Triggered when compatible Bit meshes gears with Xtreme Line rail. Compatible Bits: F, GF, LF, FB (partial). 2.5× velocity multiplier. `xtremeEngaged` flag set per entity. Rail tracking phase follows. Xtreme Finish = 2 pts on ring-out. Named "X-Celerator Gear System" in official product documentation. | FACT | 1 | `xtremeEngaged`; `xtremeRailProgress`; `xtremeRailId` | No — all three fields confirmed present | High |
| Xtreme Line | `xtreme-line.md` | Takara-Tomy product docs | 360° gear rail ring on inner bowl wall of BX Stadium. Height ~15–20mm above floor. Radius ~220mm from center. Full circumference ~1385mm. Gear teeth mesh with Bit underside. `StadiumDef.hasXtremeLine: true`. StadiumDef fields: `xtremeLineHeight`, `xtremeLineRadius`, `xtremeLineWidth`, `xtremeLineGearSpacing`. | FACT | 2 | `StadiumDef.hasXtremeLine`; `xtremeLineHeight`; `xtremeLineRadius` | No — all fields specified in concept doc | High |
| Xtreme Finish | `xtreme-dash.md`, `beyblade-x-system.md` | Official tournament docs | 2 pts. Triggered: `xtremeEngaged = true` + opponent ring-out on same tick. Distinct from Burst Finish (burst triggered by XD hit = 2 pts Burst, not Xtreme). `WinConditionSystem.XTREME_FINISH`. | FACT | 1 | `WinConditionSystem.XTREME_FINISH = 2`; `xtremeEngaged` flag | No | High |
| Gear Flat Bit (GF) | `gear-flat.md` | BeyWiki, product photos | Rubber_flat material. Gear mechanism maintains tip speed late-battle (decoupled outer gear ring maintains peripheral speed). Most consistent XD activation. `canXtreme: true`. `ContactZoneSpec.zoneType: xtreme_rail_contact`. | FACT | 2 | `gearCompatibleBit: true`; `contactMaterial: rubber_flat`; `canXtreme` | No | High |
| Gear Point Bit (GP) | `gear-point.md` | BeyWiki | Bearing + gear ring combo. Primarily stamina (center-hold). Gear ring outer edge can contact Xtreme Line at specific angles → partial/unreliable XD. `bearing` material. Surprise XD threat in stamina builds. | FACT | 2 | `tipFrictionFactor` low (bearing); `canXtreme` partial | `canXtremePartial: bool` to distinguish from full XD compatibility | Medium-High |
| Gear Ball Bit (GB) | `gear-ball.md` | BeyWiki | Ball geometry + internal gear ring. Gear ring present but faces wrong direction for rail grip. Ball shape cannot grip flat Xtreme Line rail. No XD. Defense-stamina hybrid. `canXtreme: false`. | FACT | 2 | `defensePoints` + `staminaPoints` hybrid; `canXtreme: false` | No | High |
| Burst Finish | `burst-finish.md`, `beyblade-x-system.md` | WBO rules, Hasbro rules | 2 pts. Ratchet advancement by torque impulse per hit: each hit above `burstThreshold` increments ratchet click counter. 3 clicks = burst (bey separates into components). `burstPressure` field accumulates. Ratchet teeth count = burst resistance (more teeth = harder to burst). | FACT | 1 | `burstPressure`; `burstResistance`; `BurstFinishSystem` | No | High |
| Knockout Finish | `knockout.md` | WBO rules | 2 pts. Four subtypes: ring-out KO, pocket KO (falls into pocket in stadium), self-KO (own recoil exits bowl), simultaneous KO (both exit = both get 2 pts in some rulesets). `ringoutRadius` check on position. | FACT | 1 | `WinConditionSystem.KNOCKOUT_FINISH = 2`; `ringoutRadius` | No | High |
| Survivor Finish | `survivor-finish.md` | WBO rules | 1 pt. Bey's `angularVelocity` falls below `sleepThreshold`. Same event as Gen1 "Sleep Out". Gen4 equivalent: "Spin Finish". Conservative stamina strategy yields this win condition. LAD rolling counts as still-spinning. | FACT | 1 | `WinConditionSystem.SURVIVOR_FINISH = 1`; `angularVelocity` threshold | No | High |
| Bit Beast (Lore) | `bit-beast.md` | Beyblade Wiki (anime) | Gen1 ancient sacred entity sealed in Bit Chip. Powers the bey in battle. Each main character bey has a unique Bit Beast (Dragoon, Dranzer, Draciel, Driger, Wolborg, etc.). `bitBeast: string` field on BeyDef. No physics effect — narrative/UI only. | FACT | 3 | `bitBeast: string` (lore field, no runtime effect) | No | High |

### Batch 1D Summary

The Xtreme Dash cluster is the most well-documented Gen4 mechanic in the concept files. All three Xtreme Dash runtime fields (`xtremeEngaged`, `xtremeRailProgress`, `xtremeRailId`) and all `StadiumDef` Xtreme Line geometry fields are confirmed present. The only gap is `canXtremePartial` for Bits like Gear Point that have unreliable/partial XD capability (currently the boolean `canXtreme` doesn't distinguish full vs partial). Win conditions all map cleanly to existing `WinConditionSystem` constants. Lore fields (Bit Beast) are confirmed as static non-physics attributes.

---

## Batch 1E — Magnacore + Grip/Rubber + Defense Mechanics + Launch Types

### Concept Table

| Concept | Local Source | Internet Sources | Raw Fact | Evidence Type | Level | Existing Stat Mapping | New Field Needed? | Confidence |
|---------|-------------|-----------------|----------|---------------|-------|-----------------------|-------------------|------------|
| Magnacore System (Physics) | `magnacore-system.md` | BeyWiki | North pole Magnecore: stadium magnets attract → bey pulled toward wall → increases effective downward force at perimeter → increases stability. South pole: repelled from wall → forced toward center → aggressive movement. Requires `ArenaConfig.hasMagnets: true`. | FACT | 1 | `effectiveGravity` (positive for North = stabilizing); `ArenaModifierSystem` | `magnetPolarity: 'north' | 'south' | 'none'` on BeyDef + `ArenaConfig.hasMagnets` | High |
| Shock Absorption | `shock-absorption.md` | WBO wiki | Compound mechanic: round surface (deflects rather than absorbs), high mass (inertia resists velocity change), inward WD (lowers CoG), rubber tip (high μ damps impact vibration), wide base. `shockAbsorptionPermille` stat synthesizes these. Counters Smash Attack. | INFERENCE | 1 | `damageReduction`; `recoilFactor` low; `mass` high | `shockAbsorptionPermille` if not present as named stat | High |
| Roller Defense | `roller-defense.md` | BeyWiki | Dual concept: (1) Gen1 AR with free-spinning outer rollers — attacker's force is tangentially redirected, not absorbed. (2) Gen3 Silas Karlisle special move (anime). AR roller geometry creates `ContactZoneSpec.zoneType: free_spin` on contact surface. | FACT | 2 | `ContactZoneSpec.zoneType: free_spin` | No | Medium-High |
| Anti-Attack Defense | `anti-attack.md` | WBO wiki | Three-component requirement: aggressive-profile low-recoil Wheel (deflects cleanly) + BD145 Track (tall, avoids upper attack) + Rubber Flat tip (high μ grounds the bey). Heavy mass converts attacker's own recoil into self-KO. Rubber tip also counters stamina types. | FACT | 1 | `mass` high; `recoilFactor` low; `gripFactor` high (rubber flat) | No | High |
| Customize Grip Base | `customize-grip-base.md` | WBO forum, BeyWiki | Blade Base with rubber grip tip + magnet slot. V2 (second version) also supports 10-Ball Bearing SP + Sub Parts. Best base for Defensive Zombie (bearing tip mode) and Force Smash + Upper Attack combos (rubber mode). Hybrid strategic utility. | FACT | 3 | `PartDef.material: rubber` or `bearing` (mode-switch); `gripFactor` | No — mode-change handles this | High |
| Rubber Tip Physics | `friction.md` | Physics texts, WBO | Rubber flat μ ≈ 0.8–1.0 (highest of all tip materials). Creates maximum floor grip → aggressive wide orbit (flower pattern delivery). Simultaneous high spin drain (high μ = high friction torque). Gen3 rubber Drivers (Rubber Flat, Xtreme, Zephyr) are top attack options. | FACT | 1 | `gripFactor` high; `spinDecayRate` high; `surfaceFriction` high | No | High |
| Sliding Shoot | `sliding-shoot.md` | WBO launch guide | Launch technique combining banking (30–45°) + catapult push (full pull). Higher entry velocity than standard banking. `pullStrength` near 1.0. `launchAngle` non-zero. Creates maximum-energy flower pattern delivery. Rubber tip required to sustain high-μ orbit. | FACT | 3 | `LaunchInputFrame.pullStrength`; `LaunchInputFrame.launchAngle` | No | High |
| Power Launch | `power-launch.md` | WBO wiki | Maximum RPM launch. `pullStrength: 1.0`. Power Speed Launcher: Power mode = 8 rotation pull. Speed mode = faster pull but less total revolutions. Maximizes initial ω. Used by attack types. | FACT | 3 | `LaunchInputFrame.pullStrength: 1.0` | No | High |
| Rush Launch | `rush-launch.md` | WBO wiki | Near-horizontal launch angle (~10°). Bey rides gravity slope at entry. Arrives at center quickly. Used for barrage-style delivery. `launchAngle` near-horizontal. Attack-type launch for immediate center contact. | FACT | 3 | `LaunchInputFrame.launchAngle` near 0° | No | High |
| Destabilizer | `destabilizer.md` | WBO wiki | AR/Blade designed to grind on round body profile beys. Slope grinding action. Low profile (85–100 height track). Semi-flat tip. Attacked by BD145 Track height. `ContactZoneSpec.zoneType: destabilizer` on angled contact surfaces. Counters stamina/zombie by hitting the round body sweep zone. | FACT | 2 | `ContactZoneSpec.zoneType: destabilizer`; `lastContactHeightPermille` | No | High |

### Batch 1E Summary

Magnacore's `magnetPolarity` field is confirmed needed on BeyDef (North vs South distinguishes stabilizing vs aggressive behavior). `shockAbsorptionPermille` may exist as a named stat but is a synthesized metric — verify against engine. Launch types (Sliding Shoot, Power Launch, Rush Launch) all map to existing `LaunchInputFrame` fields. Rubber tip physics are fully captured by `gripFactor` + `surfaceFriction` + `spinDecayRate` triad. Roller Defense and Destabilizer both need their `ContactZoneSpec.zoneType` entries confirmed as implemented. Anti-Attack Defense is a build strategy, not a single mechanic — correctly maps to a combination of `mass` + `recoilFactor` + `gripFactor`.

---

## Batch 1F — Track Height + Contact Geometry + Win Conditions + Gen1 Overview

### Concept Table

| Concept | Local Source | Internet Sources | Raw Fact | Evidence Type | Level | Existing Stat Mapping | New Field Needed? | Confidence |
|---------|-------------|-----------------|----------|---------------|-------|-----------------------|-------------------|------------|
| Track Height (Gen3) | `beyblade-x-system.md` (Ratchet height analogy) | WBO wiki | Gen3 Performance Tip + Track system: Track code = height in 0.1mm increments (e.g., T125 = 12.5mm, BD145 = 14.5mm). Height determines which horizontal band of the opponent the tip base contacts. Low tracks (85–100) for destabilizer, high tracks (125–145) for upper attack. In Gen4, height is in Ratchet code (`[teeth]-[height]`). | FACT | 2 | `tipZ` snap offset in `RatchetSystem`; `cogHeightMm` | `trackHeightMm` on PartDef for Gen3 parts | Medium-High |
| Plastic Contact Zones | `plastic-contact.md` | BeyWiki | Gen1 AR plastic contact: CoR 0.5–0.7. Contact point count determines barrage vs smash style. Many small points = barrage. One large point = smash. Wear progression changes contact geometry over time (smoothing). Burst pressure accumulates from contact frequency. | FACT | 2 | `ContactZoneSpec.zoneType`; `contactMaterial: 'plastic'`; wear progression | `wearLevel` on ContactZoneSpec if wear is modeled | High |
| Metal Contact (HMS) | `metal-contact.md` | BeyWiki | HMS all-metal contacts CoR ≈ 0.9. Maximum recoil AND maximum KO force. Self-KO risk in same-height collisions. `contactMaterial: 'metal'` in engine. Gen1 WD metal contacts (HMS WD) also contribute to recoil. | FACT | 2 | `contactMaterial: 'metal'`; `recoilFactor` high | No | High |
| Upper Attack Geometry | `upper-attack.md` | WBO wiki | Requires: attacker AR has upward-angled ramp on leading contact surface. Attacker must be shorter than opponent (height differential = ramp clearance). Contact height < lower bound of opponent → ramp slides under → opponent lifted. `lastContactHeightPermille < 200` trigger. | FACT | 2 | `AirborneSystem`; `lastContactHeightPermille`; ramp geometry on AR | No | High |
| Sleep Out (Gen1) | `sleep-out.md` | WBO rules | Gen1 terminology for Survivor Finish. Bey's `angularVelocity` < `sleepThreshold`. LAD rolling phase counts as still-spinning. Last bey spinning wins. 1 pt in Gen3/4 scoring. | FACT | 1 | `WinConditionSystem.SURVIVOR_FINISH = 1`; `sleepThreshold` | No — same as Survivor Finish | High |
| Burst Pressure Mechanics | `burst-finish.md` | WBO rules | Each hit above `burstThreshold` applies torque impulse to ratchet mechanism. Ratchet advances 1 click per qualifying hit. 3 clicks = burst. High-recoil AR increases burst pressure per hit. Gen4 Ratchet teeth count directly maps to burst resistance (more teeth = higher threshold). | FACT | 1 | `burstPressure`; `burstResistance`; `BurstFinishSystem` | No | High |
| Dual Spin | `dual-spin.md` | BeyWiki | All Gen1 beys technically support both spin directions via SG swap (most don't ship with both). Gravity Destroyer (Gen2 MFB) = first built-in dual-spin bey. `spinDirection: 'right' | 'left'` field. Opposite-spin matchups enable spin-steal strategies. | FACT | 3 | `spinDirection: 'right' | 'left'` | No | High |
| Gen1 Arena (Tornado Bowl) | `gen1-overview.md` | BeyWiki | Tornado Bowl is the classic Gen1 stadium: curved inner wall creates tornado ridge. No Xtreme Line. No burst mechanism. Pocket-free (KO only by ring-out over rim). `ArenaConfig` without `hasXtremeLine`, without burst rail. | FACT | 3 | `StadiumDef.generation: 'plastic'`; `hasXtremeLine: false`; `hasBurstMechanism: false` | `hasBurstMechanism: bool` on StadiumDef | Medium |
| Gen3 Arena (BeyStadium) | `beyblade-x-system.md`, `burst-layer.md` | WBO rules | Gen3 BeyStadium: various shapes (DS, HS). No Xtreme Line. Has burst mechanism (floor pockets catch burst parts). `hasXtremeLine: false`. Burst finish supported. Arena slope profile determines tornado/flat bowl. | FACT | 3 | `StadiumDef.generation: 'burst'`; `hasXtremeLine: false` | No | High |
| Contact Zone Spec | `plastic-contact.md`, `metal-contact.md` | Engine source (concept docs) | `ContactZoneSpec.zoneType` enum maps each contact surface of a part to its interaction type. Determines which `ZoneInteractionTable` row fires on collision. Full valid zoneType list from gear-ball.md: `upper_attack | lower_attack | smash | upper_smash | recoil | equalization | destabilizer | defensive | free_spin | sub_attack_ring | mode_change_high | mode_change_low | gatinko_armor | xtreme_rail_contact | magnacore_attract | magnacore_repel | engine_gear_propulsion` | FACT | 2 | `ContactZoneSpec.zoneType` | No — enum is documented | High |

### Batch 1F Summary

Track height (Gen3) maps to `tipZ` in the RatchetSystem for Gen4, and needs `trackHeightMm` on PartDef for Gen3 parts. `hasBurstMechanism` on StadiumDef would be useful to distinguish Gen1 (no burst) from Gen3+ (burst possible). The full `ContactZoneSpec.zoneType` enum is now documented from local concept sources — 17 zone types confirmed. Wear modeling (`wearLevel` on ContactZoneSpec) is unverified in engine — Gen1 plastic contact wear is lore-accurate but may not be implemented.

---

## Batch 1G — Customize-Grip-Base + Anime Seasons + Lore Concepts

### Concept Table

| Concept | Local Source | Internet Sources | Raw Fact | Evidence Type | Level | Existing Stat Mapping | New Field Needed? | Confidence |
|---------|-------------|-----------------|----------|---------------|-------|-----------------------|-------------------|------------|
| Avatar (Resonance) | `avatar.md`, `resonance.md` | Beyblade Wiki (anime) | Gen3 Burst: Avatar = manifestation of Blader-Bey bond energy above a resonance threshold. Devil's Resonance = corrupted/dark form of Resonance. `resonanceCapacity` field on BeyDef. `ResonanceSystem` fires when threshold exceeded. Grants temporary power boost. | FACT | 1 | `resonanceCapacity`; `ResonanceSystem`; `attackBuffTimer` | No | High |
| Bit Beast (Detailed) | `bit-beast.md` | Beyblade Wiki | Gen1 ancient entities sealed in Bit Chip. Main beys: Dragoon (Tyson), Dranzer (Kai), Draciel (Max), Driger (Ray), Wolborg (Tala), Wyborg. No physics effect. Used for match announcements, win animations, character identification. `bitBeast: string` on BeyDef. | FACT | 3 | `bitBeast: string` | No | High |
| Blader Spirit | `blader-spirit.md` | Beyblade Wiki (anime) | Gen1/2 narrative mechanic: Blader's spirit/passion influences battle outcome in-universe. Game analog: `spiritLevel` for NPC AI scaling. No physics runtime effect. Optional narrative display field. | INFERENCE | 3 | `spiritLevel` (NPC AI scalar) | No | Medium |
| Legend Bladers | `legend-bladers.md` | Beyblade Wiki (anime) | Gen2 Metal Fury: 10 Legendary Bladers possess fragments of the Star Fragment meteor. Each has a unique power boost. `isLegendaryBlader: bool` flag on character/player record. Grants access to special attacks. | FACT | 3 | `isLegendaryBlader: bool` | `isLegendaryBlader` if not present | Medium |
| Star Fragment | `star-fragment.md` | Beyblade Wiki (anime) | Gen2 cosmic meteorite. Source of Legendary Blader power. `starFragmentPower` multiplier applied to resonance-style boosts. Lore item; no direct physics unless resonance system consumes it. | FACT | 3 | `starFragmentPower` multiplier | `starFragmentPower: float` on BeyDef for Legend Bladers | Medium |
| Gen4 Overview (BX) | `gen4-overview.md` | Beyblade X wiki | Xenon City setting. The X = competitive skyscraper tower. Beyblade X anime season 1 confirmed season 1 characters: Jaxon Cross (Sword Dran), Robin Kazami (Scythe Incendio), Khrome Ryugu (Cobalt Drake), Meiko Myoden (Claw Leon), Warden (Gale Wyvern). Team Persona is main rival faction. | FACT | 3 | `BeyDef.lore.user` field (character assignment) | No | High |
| Gen1 Season 1 (V-Force era) | `gen1-s1-overview.md` | Beyblade Wiki | Original 2000–2001 series. Tyson, Kai, Ray, Max, Kenny. Blade Sharks, White Tigers, PPB All-Stars factions. Classic Bit Beasts introduced. Right-spin only in S1. | FACT | 3 | `BeyDef.lore.season` annotation | No | High |
| Gen1 Season 2-3 | `gen1-s2-overview.md`, `gen1-s3-overview.md` | Beyblade Wiki | S2 (V-Force): Neo Borg, Dark Four Heavenly Kings. S3 (G-Revolution): Teams BBA Revolution vs PPB + new world rivals. Left-spin introduced via NEO SG. | FACT | 3 | `spinDirection` enabled for left-spin beys in S2+ | No | High |
| Gen1 Movie | `gen1-movie.md` | Beyblade Wiki | Beyblade the Movie: Fierce Battle (2002). Tyson vs Shadow Bladers. Non-canon tournament structure. Dragoon GT featured. No new mechanics vs S2/S3 era. | FACT | 3 | No new engine fields | No | High |
| Beyblade X System (overview) | `beyblade-x-system.md` | Official Takara-Tomy docs | Blade + Ratchet (`[teeth]-[height]` format) + Bit. Ratchet teeth count = burst resistance direct mapping. Height code = `tipZ` snap offset in mm. F-type Bits are canonical Xtreme Dash bits. Gen4 win conditions: Xtreme Finish + Knockout Finish + Burst Finish (all 2 pts) + Survivor Finish (1 pt). | FACT | 3 | `RatchetSystem`; `BurstFinishSystem`; `WinConditionSystem` | No | High |

### Batch 1G Summary

Lore fields (Bit Beast, Avatar, Blader Spirit, Legend Bladers, Star Fragment) are all confirmed as static configuration attributes with no direct runtime physics effect. `isLegendaryBlader` and `starFragmentPower` may be needed if the resonance-style boost system uses them as prerequisites. All anime season data maps to `BeyDef.lore` annotation fields, not engine physics. The Gen4 overview confirms the complete win condition set and BX system architecture — no new fields required.

---

## Batch 1H — Remaining BX Bits + Gen3 Burst Components + Special Mechanics

### Concept Table

| Concept | Local Source | Internet Sources | Raw Fact | Evidence Type | Level | Existing Stat Mapping | New Field Needed? | Confidence |
|---------|-------------|-----------------|----------|---------------|-------|-----------------------|-------------------|------------|
| BX Flat Bit (F) | `bx-flat.md` | BeyWiki | Wide rubber flat tip. Primary Xtreme Dash bit. Aggressive wide orbit. `canXtreme: true`. `contactMaterial: rubber_flat`. High `gripFactor`. High `spinDecayRate`. | FACT | 2 | `canXtreme: true`; `gripFactor` high; `spinDecayRate` high | No | High |
| BX Needle Bit (N) | `bx-needle.md` | BeyWiki | Extreme stamina. Near-zero floor contact area. Center-hold movement. `canXtreme: false`. `contactMaterial: sharp`. Minimum `spinDecayRate`. `staminaPoints` maximized. | FACT | 2 | `canXtreme: false`; `staminaPoints` high; `spinDecayRate` near 0 | No | High |
| BX Low Flat Bit (LF) | `bx-low-flat.md` | BeyWiki | Lower-profile Flat variant. Lower CoG than F Bit. YD (Yard/Yoyo Dash) capable variant mentioned in source. Lower contact angle than F. `canXtreme: true`. Slightly less aggressive than F. | FACT | 2 | `canXtreme: true`; `cogHeightMm` lower than F | No | High |
| BX Orb Bit (O) | `bx-orb.md` | BeyWiki | Full spherical. Defense role. Unpredictable deflection vector on contact. `canXtreme: false`. Stable but chaotic collision outcomes. High `damageReduction`. | FACT | 2 | `canXtreme: false`; `defensePoints` high; randomized deflection vector | No | High |
| BX Accel Bit (A) | `bx-accel.md` | BeyWiki | Attack/balance. Moderate plastic flat. Controlled aggression. Partial/surprise XD possible. `canXtreme` partial (conditional). `contactMaterial: plastic`. | FACT | 2 | `canXtreme` conditional; `attackPoints` moderate | `canXtremePartial` confirmed needed | Medium-High |
| BX Rush Bit (R) | `bx-rush.md` | BeyWiki | Attack. Rubber flat tip. More directed rush trajectory vs F Bit's wide sweep. `contactMaterial: rubber_flat`. `canXtreme` possible (rubber flat = rail-compatible). High `gripFactor`. | FACT | 2 | `canXtreme: true`; `gripFactor` high | No | High |
| BX Under Bit (U) | `bx-under.md` | BeyWiki | Special/balance. Unconventional lateral contact geometry. Wobbling side-shifting orbit. Unusual movement pattern. No XD. | FACT | 2 | `canXtreme: false`; `MovementArchetype: 'wobble'` | `MovementArchetype: 'wobble'` if not present | Medium |
| Forge Disc (Gen3) | `forge-disc.md` | WBO wiki | Middle Gen3 component. Sets weight distribution + rotational inertia. Replaced by Chassis in DB era. Mass concentrated at specified radius from center. Disc code (number = weight in approx grams). | FACT | 3 | `massDistribution`; `staminaPoints` affected | No | High |
| Layer Weight (Gen3) | `layer-weight.md` | WBO wiki | Metal clip-on for Cho-Z Energy Layers. ~5–7g zinc alloy. Dual role: (1) adds mass at specific radius (OWD vs CWD position), (2) physical burst stopper geometry (blocks ratchet teeth from advancing). Competitive necessity in Cho-Z era. | FACT | 3 | `mass` + delta; `burstResistance` increase from stopper geometry | `burstStopperMass: float` on LayerWeight def | Medium-High |
| Dash Driver (Gen3) | `dash-driver.md` | WBO wiki | Metal-coated Performance Tip variant (prime symbol `'`). Extends tip durability vs wear. Identical geometry to base Driver but harder material. `contactMaterial: dash_metal`. Affects `spinDecayRate` slightly (less wear = more consistent μ). | FACT | 3 | `contactMaterial: dash_metal`; `spinDecayRate` slightly lower | No — `dash_metal` is valid material enum | High |

### Batch 1H Summary

BX Bit family is now fully documented. `canXtremePartial` is confirmed as a needed field (appears in both Gear Point and Accel Bit). `MovementArchetype: 'wobble'` needed for Under Bit's side-shifting movement. Layer Weight's burst stopper function may need `burstStopperMass` on the PartDef to correctly compute `burstResistance` from geometry. Dash Driver's `dash_metal` material is already in the valid materials enum from the gear-ball.md doc.

---

## Batch 1I — Gen3 Burst Advanced Systems + Coverage Gap Analysis

### Concept Table

| Concept | Local Source | Internet Sources | Raw Fact | Evidence Type | Level | Existing Stat Mapping | New Field Needed? | Confidence |
|---------|-------------|-----------------|----------|---------------|-------|-----------------------|-------------------|------------|
| Gatinko Chip (Gen3 GT era) | `gatinko-chip.md` | BeyWiki | GT era (Season 4) Gen3: Gatinko Chip replaces traditional Layer lock on some Frames. Two-phase engagement: outer shell (Chip) locks with Frame, inner Layer spins freely. `ContactZoneSpec.zoneType: gatinko_armor`. Changes burst resistance dynamics. | FACT | 2 | `ContactZoneSpec.zoneType: gatinko_armor` (in valid enum) | No — zone type exists | Medium-High |
| Single/Double Chassis (DB era) | `single-chassis.md`, `double-chassis.md` | WBO wiki | DB era: Forge Disc replaced by Chassis (single or double). Single Chassis = inner ring only. Double Chassis = outer + inner ring (higher I, more stamina). Both snap to DB Core instead of Ratchet. Modifies weight distribution more dramatically than standard Disc. | FACT | 3 | `massDistribution`; `staminaPoints` | `chassisType: 'single' | 'double' | null` if DB era parts modeled | Medium |
| DB Core (DB era) | `db-core.md` | WBO wiki | Dynamic Balance Core: central component in DB era Gen3. Contains the main bearing. Connects Chassis to Blade. Provides bearing-based free spin between upper body and tip. Like a built-in bearing tip at the core level. `subRingAngularVelMicroRad` for decoupled core spin. | FACT | 1 | `subRingAngularVelMicroRad`; `free_spin` zone type | No | Medium-High |
| D-Gear / F-Gear / H-Gear (Gen3) | `d-gear.md`, `f-gear.md`, `h-gear.md` | BeyWiki | Gear variants for Gen3 Discs (Defense, Force, High). Each Gear type adds a different physical tab/protrusion pattern to the Disc's outer profile. D-Gear: defensive rounding. F-Gear: forward-spike smash contact. H-Gear: high elevation contact modifier. | FACT | 2 | `ContactZoneSpec.zoneType` variants | No | Medium |
| S-Gear / L-Gear / V-Gear / VS-Gear | `s-gear.md`, `l-gear.md`, `v-gear.md`, `vs-gear.md` | BeyWiki | Additional Gear variants for Gen3 Discs. S-Gear: smash-oriented spike protrusions. L-Gear: left-spin optimization. V-Gear: variable contact angle. VS-Gear: Variable Smash — alternates between contact angles. All affect `ContactZoneSpec` geometry. | FACT | 2 | `ContactZoneSpec.zoneType`; `mode_change_high / mode_change_low` | No | Medium |
| Burst Armor | `burst-armor.md` | BeyWiki | Cho-Z era outer shell overlay that physically locks Ratchet advancement. Reduces burst risk at cost of weight. `burstResistance` increase. Metal or plastic variant. | FACT | 3 | `burstResistance` delta | `burstArmorEnabled: bool` if separate from Layer Weight | Medium |
| Infinite Sword / Infinite Shield | `infinite-sword.md`, `infinite-shield.md` | BeyWiki | Gen3 Superking era special Blades. Infinite Sword: retracting attack blades (mode-change). Infinite Shield: expanding defense ring (mode-change). Both use `DynamicHitboxSystem` / `modeState`. | FACT | 2 | `DynamicHitboxSystem`; `modeState` | No | Medium |
| Ring Jet (Gen3 Superking) | `ring-jet.md` | BeyWiki | Superking era DB Chip attachment: spring-loaded jet ring that fires on burst trigger. Creates secondary kinetic event on burst — attacker receives recoil burst. Unusual mechanic with limited competitive use. | FACT | 1 | `attackBuffTimer`; `recoilFactor` secondary event | `ringJetEnabled: bool` on BeyDef; `ringJetRecoilMagnitude` | Low-Medium |
| Bullet Driver (Gen3) | `bullet-driver.md` | WBO wiki | Performance Tip with internal spring mechanism. Similar to Engine Gear concept: spring-loaded tip fires on first strong impact. One-time speed boost. `coreReserveRemaining` analog. | FACT | 1 | `coreReserveRemaining`; `attackBuffTimer` | No — reuses EG system fields | Medium-High |
| High Mode / Low Mode | `high-mode.md`, `low-mode.md` | BeyWiki | Generic mode-change height states. High Mode: taller profile, upper attack geometry enabled. Low Mode: shorter profile, defense/destabilizer geometry. Applies to Bits/Drivers with mode-change capability. `modeState: 'high' | 'low'`. | FACT | 2 | `modeState`; `DynamicHitboxSystem`; `cogHeightMm` | No | High |

### Batch 1I Summary

DB era and Superking era components (Chassis, DB Core, Gear types) are the most sparsely documented in local files. Coverage is sufficient for engine classification purposes. DB Core's bearing mechanism maps to `subRingAngularVelMicroRad`. Ring Jet is an edge case mechanic needing `ringJetEnabled` + `ringJetRecoilMagnitude` if implemented. All Gear type variants (D/F/H/S/L/V/VS) map to `ContactZoneSpec.zoneType` geometry entries. `chassisType` enum would help model DB era mass distribution correctly. All mode-change states (`High Mode`, `Low Mode`) map to existing `modeState` + `DynamicHitboxSystem`.

---

## Coverage Summary

| Generation / System | Files in `linka/concepts/` | Files Read | Key Concepts Extracted | Engine Gaps Found |
|--------------------|--------------------------|------------|------------------------|-------------------|
| Gen1 — 4-Layer System | ~15 | 15 | Type triangle, Magnacore, Engine Gear, HMS, zombie/LAD, Spin Gear | `magnetPolarity`, `massDistribution`, `egBoostOmega` |
| Gen1 — Physics Foundations | ~10 | 10 | Angular momentum, inertia, friction, CoR, CoG | `tipFrictionFactor`, `ladRollDurationMs` |
| Gen1 — Combat Mechanics | ~8 | 8 | Smash, Upper, Barrage, Anti-Attack, Shock Absorption, Roller Defense | `contactFreqMultiplier`, `shockAbsorptionPermille` |
| Gen1 — Stamina/Zombie | ~8 | 8 | Zombie strategy, spin steal, equalization, free-spin, bearing defense | No critical gaps |
| Gen1 — Movement / Launch | ~8 | 8 | Flower pattern, banking, weak/power/rush launch, tornado stall, drift | `tornadoRidgeRadius`, `MovementArchetype.drift` |
| Gen2 — Metal Fight Beyblade | ~5 | 5 | Dual-spin, Legend Bladers, Star Fragment, Fusion Wheel | `isLegendaryBlader`, `starFragmentPower` |
| Gen3 — Burst System (core) | ~12 | 12 | Energy Layer, Forge Disc, Driver, Ratchet burst, mode change, avatar/resonance | No critical gaps |
| Gen3 — Advanced (Cho-Z/GT/DB/SK) | ~15 | 14 | Chassis, Gear types, Layer Weight, Dash Driver, DB Core, Gatinko, Burst Armor | `chassisType`, `burstStopperMass`, `ringJetEnabled` |
| Gen4 — Beyblade X System | ~20 | 20 | BX system, all Bit types, Xtreme Dash, Xtreme Line, win conditions | `canXtremePartial`, `MovementArchetype.wobble` |
| Gen4 — Stadium Variants | ~5 | 5 | Standard/Wide/Double/Flying/Infinity BX Stadium | `xtremeLineCount` for Double stadium |
| Lore / Anime | ~15 | 15 | Bit Beast, Avatar, Blader Spirit, season overviews, Gen4 overview | No critical gaps |
| **TOTAL** | **~121** | **~120** | **95+ distinct concepts extracted** | **~12 potential new fields** |

---

## Engine Mapping Summary

### Confirmed Existing Field Mappings

| Engine Field | Concept(s) It Covers | Confirmation Source |
|-------------|---------------------|---------------------|
| `attackPoints` | Attack Type strength, smash force output | `attack-type.md` + type triangle |
| `defensePoints` | Defense Type strength, absorption capacity | `defense-type.md` |
| `staminaPoints` | Stamina Type strength, spin retention | `stamina-type.md` |
| `mass` | Weight distribution, momentum transfer, shock absorption | `weight-distribution.md`, `collision-physics.md` |
| `radius` | Rotational inertia contribution (r²), contact geometry | `rotational-inertia.md` |
| `spin` / `maxSpin` | Angular velocity, equalization gradient, XD trigger threshold | `angular-momentum.md`, `xtreme-dash.md` |
| `health` / `stamina` | Cumulative damage / energy reserve | All combat concept files |
| `aggressiveness` | Attack Type movement tendency, center-hunt behavior | `attack-type.md` |
| `gripFactor` | Rubber tip lateral grip, flower pattern delivery | `friction.md`, `rubber-tip` |
| `recoilFactor` | CoR analog; lateral self-deflection; Gen3 burst pressure | `recoil.md`, `collision-physics.md` |
| `spinStealFactor` | Equalization magnitude per contact tick | `spin-steal.md`, `spin-equalization.md` |
| `spinStealResist` | Stamina Type isolation from equalization | `stamina-type.md` |
| `surfaceFriction` | Tip-floor μ; primary spin decay driver | `friction.md` |
| `contactDamageMultiplier` | Smash/impact damage scaling | `smash-attack.md` |
| `damageReduction` | Shock absorption, Defense Type mitigation | `defense-type.md`, `shock-absorption.md` |
| `burstResistance` | Ratchet teeth count; clicks-to-burst threshold | `burst-finish.md`, `beyblade-x-system.md` |
| `wobbleAmplitude` | Gyroscopic instability magnitude below stability threshold | `gyroscopic-stability.md` |
| `beyTiltAngle` | Current tilt from vertical; LAD threshold tracking | `gyroscopic-stability.md`, `lad-life-after-death.md` |
| `coreReserveRemaining` | Engine Gear spring charge; Bullet Driver spring charge | `engine-gear-system.md` |
| `attackBuffTimer` | Engine Gear release duration; resonance buff duration | `engine-gear-system.md`, `resonance.md` |
| `xtremeEngaged` | Xtreme Dash active flag | `xtreme-dash.md` |
| `xtremeRailProgress` | Position along Xtreme Line arc (0–1) | `xtreme-dash.md` |
| `xtremeRailId` | Which Xtreme Line rail entity is engaged (Double stadium) | `xtreme-line.md` |
| `gearCompatibleBit` | Bit has gear face for Xtreme Line mesh | `gear-flat.md`, `xtreme-dash.md` |
| `effectiveGravity` | Magnacore attraction/repulsion effect on downward force | `magnacore-system.md` |
| `spinDecayRate` | Tip friction × mass × gravity / inertia | `friction.md` |

### New Fields Required (Confirmed Gaps)

| Field | Type | Owner | Purpose | Priority |
|-------|------|-------|---------|----------|
| `egBoostOmega` | `float` | `BeyDef` / `World` | Engine Gear one-time angular velocity burst magnitude | High |
| `magnetPolarity` | `enum: 'north' \| 'south' \| 'none'` | `BeyDef` | Distinguishes Magnacore North (stabilizing) from South (aggressive) behavior | High |
| `massDistribution` | `enum: 'owp' \| 'cwp' \| 'balanced'` | `BeyDef` | OWD (perimeter) vs CWD (center) — affects `spinDecayRate` and `staminaPoints` | High |
| `tipFrictionFactor` | `float` (0.0–1.0) | `PartDef` (Bit) | Bearing tip decoupling coefficient; separate from general `surfaceFriction` | High |
| `canXtremePartial` | `bool` | `PartDef` (Bit) | Partial/unreliable XD activation (Gear Point, Accel Bit) vs full activation | Medium-High |
| `ladRollDurationMs` | `int` | `BeyDef` | LAD roll duration before final stop; determines LAD phase length | Medium-High |
| `trackHeightMm` | `int` | `PartDef` (Track/Ratchet) | Gen3 Track height in 0.1mm increments; Gen4 Ratchet height units | Medium-High |
| `tornadoRidgeRadius` | `float` | `StadiumDef` | Radial position of tornado ridge as fraction of arena radius (for tornado stall) | Medium |
| `hasBurstMechanism` | `bool` | `StadiumDef` | Distinguishes Gen1 (burst impossible) from Gen3/4 (burst possible) | Medium |
| `chassisType` | `enum: 'single' \| 'double' \| null` | `PartDef` | DB era Chassis type for mass distribution calculation | Low-Medium |
| `burstStopperMass` | `float` | `PartDef` (LayerWeight) | Mass contribution to burst resistance from stopper geometry | Low-Medium |
| `ringJetEnabled` | `bool` | `BeyDef` | Ring Jet mechanic (Superking era); fires kinetic burst on burst event | Low |
| `ringJetRecoilMagnitude` | `float` | `BeyDef` | Magnitude of Ring Jet secondary recoil event | Low |
| `MovementArchetype.drift` | enum value | `BeyDef` | Drift Driver's unique sliding drift movement pattern | Medium |
| `MovementArchetype.wobble` | enum value | `BeyDef` | Under Bit's side-shifting wobble movement pattern | Low-Medium |

### ContactZoneSpec.zoneType — Complete Confirmed Enum

From `gear-ball.md` valid list (confirmed in local concept docs):

```
upper_attack | lower_attack | smash | upper_smash | recoil | equalization |
destabilizer | defensive | free_spin | sub_attack_ring | mode_change_high |
mode_change_low | gatinko_armor | xtreme_rail_contact | magnacore_attract |
magnacore_repel | engine_gear_propulsion
```

All 17 zone types documented. No additional zone types identified as needed from research.

### MaterialType — Complete Confirmed Enum

From `gear-ball.md` valid list (confirmed in local concept docs):

```
metal | rubber | plastic | bearing | spring | free_spin | rubber_hard | carbon |
sharp | magnet_north | magnet_south | engine_drive | dash_metal |
gatinko_armor_metal | rubber_flat
```

All 15 material types documented. `rubber_flat` is the correct type for F-bit and GF-bit primary Xtreme Dash components.

### Type Triangle — Confirmed Mapping

```
Attack  → beats Stamina  (high-velocity KO before Stamina can outlast)
Stamina → beats Defense  (out-spins; Defense has no spin-steal or outlast path)
Defense → beats Attack   (converts attacker recoil into self-KO)
Balance → off-triangle  (adaptable; zombie combos are Balance)
```

Engine fields per type:
- **Attack**: `attackPoints`↑ `aggressiveness`↑ `gripFactor`↑ `recoilFactor` moderate `spinDecayRate`↑
- **Defense**: `defensePoints`↑ `mass`↑ `damageReduction`↑ `recoilFactor`↓ `spinDecayRate` moderate
- **Stamina**: `staminaPoints`↑ `spinDecayRate`↓ `spinStealResist`↑ `mass` moderate `aggressiveness`↓
- **Balance**: all fields moderate; `spinStealFactor` may be elevated (zombie builds)

### Win Condition — Confirmed Point Values

| Win Condition | Points | Generation | Trigger |
|--------------|--------|------------|---------|
| Xtreme Finish | 2 | Gen4 only | `xtremeEngaged = true` + opponent ring-out |
| Knockout Finish | 2 | Gen1–Gen4 | Opponent exits arena boundary |
| Burst Finish | 2 | Gen3–Gen4 | `burstPressure` reaches 3-click threshold |
| Survivor Finish | 1 | Gen1–Gen4 (varied naming) | Last bey spinning; `angularVelocity < sleepThreshold` |

First to 4 points wins the match (standard format). BO3/BO5 series supported via `targetWins`.

---

## Batch 1J — Burst/BX Name Disambiguation

> **Added per research addendum**: Burst/BX era has the most complex naming conventions in the franchise. Similar-sounding names and shared abbreviations cause frequent research errors. This batch documents every confirmed disambiguation hazard.

### Addendum Requirements Fulfilled

1. Full official English name + Japanese name in parentheses where relevant
2. Component slot: Layer / Disc / Driver (Burst naming) or Blade / Ratchet / Bit (BX naming)
3. Which sub-system: S1/S2/S3 / God / Cho-Z / GT / Superking / DB / BU / BX
4. Every abbreviation that could conflict with another era's abbreviation is flagged

---

### Burst/BX Parts Disambiguation Table

| Abbreviation | Full Name (English) | Japanese Name | Slot | Sub-System | Common Confusion | Notes |
|---|---|---|---|---|---|---|
| **Xtreme** (Driver) | Xtreme (Performance Tip) | エクストリーム | Driver | Cho-Z / GT | "Xtreme" vs "Xtreme Dash" — these are different things. Xtreme is a specific rubber-flat Tip with high-μ floor contact (Gen3 Driver). "Xtreme Dash" is the BX stadium rail-scoring mechanic. | FACT; Xtreme Driver: rubber material, aggressive floor contact, high spinDecayRate. Xtreme Dash: activated when any compatible BX Bit meshes with the X-Line rail, delivers 2.5× velocity burst and enables Xtreme Finish scoring. They are related in concept (speed burst) but different systems. |
| **Xtreme Dash** (mechanic) | Xtreme Dash (BX rail mechanic) | エクストリームダッシュ | N/A — stadium mechanic, not a part | BX (Gen4 only) | Confused with Xtreme Driver (Gen3 Tip). Also confused with "Dash" suffix on Gen3 Drivers (Xtreme', Zephyr', etc.). | Xtreme Dash is a *gameplay mechanic*, not a part. It is triggered when a BX Bit grips the X-Line rail. The "Dash (')'" suffix on Gen3 Drivers denotes metal-coated tips for durability — unrelated to Xtreme Dash. |
| **X-Line** | Xtreme Line (stadium rail) | エクストリームライン | N/A — arena feature | BX (Gen4 only) | Abbreviated "XL" occasionally, which collides with "XL" used for Extra Large or "X:D" in MFB context. | 360° gear rail on inner BX Stadium wall. Height ~15–20mm above floor. Only BX Bits with gear-compatible undersides can engage it. |
| **B:D** | Bearing Drive (Performance Tip) | ベアリングドライブ | Driver | MFB 4D (Gen2) | "B:D" (MFB 4D tip) vs "BD" used as shorthand for Burst/Dynamite Battle era in Gen3. "BD145" is a Track in MFB, not related to B:D. | B:D = **Bearing Drive** [FACT — batch-004 correction; "Bottom Drive" was an error]. B:D is a triple-mode self-switching Tip in MFB 4D era (Phantom Orion). The colon in B:D marks all MFB 4D Bottoms (B:D, F:D, D:D, X:D). BD145 is a separate Track (free-spinning disc). "BD" (no colon) as sub-system abbreviation means Dynamite Battle (Gen3 burst_db). These three share letters but are unrelated systems. |
| **BD145** | Bottom Drive 145 (Track/Height) | ボトムドライブ145 | Track (height position) | MFB HWS (Gen2) | "BD145" (MFB Track, free-spinning disc at 14.5mm height) vs "BD Core" (DB era movable sub-layer) vs "BD" (Dynamite Battle system abbreviation). | BD145 is a free-spinning Track (height = 14.5mm). It adds ~8g at a wide radius, boosting inertia. BD Core is a completely separate component from the DB era: the central bearing-axle hub that connects Chassis to Blade. Abbreviation collision risk: all three use "BD". |
| **DB Core** | Dynamite Balance Core | ダイナマイトバランスコア | Sub-component (connects Chassis to Blade) | DB — Dynamite Battle (Gen3 burst_db) | "DB Core" (DB era axle hub with built-in bearing) vs "DB" as system abbreviation (Dynamite Battle) vs "BD145" (MFB Track). | DB Core is not a Layer. It is the bearing hub in the center of the DB-era Beyblade (between Chassis and Performance Tip). It provides near-zero friction decoupling. Do NOT confuse with "BD145" (MFB Track). "DB" as a system tag always means Dynamite Battle. |
| **GT Chip** | Gatinko Chip | ガチンコチップ | Layer sub-component (locks with Frame) | GT — Gatinko (Gen3 burst_gt) | "GT Chip" (Gatinko Chip Layer socket) vs "GT" referring to Beyblade G-Revolution (2003 Gen1 anime season 3) vs "GT Booster" (product line name for GT-era boosters). | GT in Gen3 context always means Gatinko. "G-Revolution" is the Gen1 anime title — it has no GT chip. The Gatinko Chip is a physical 3D piece that snaps into the Layer Frame — replacing the standard burst-lock system. Changes burst resistance dynamics. |
| **BU** | Burst Ultimate (system) | バーストアルティメット | N/A — system name | BU — Burst Ultimate (Gen3 burst_bu) | "BU" as system abbreviation vs the mistaken term "Burst Unit" (not a real Beyblade term). Also confused with "BU" as abbreviation for "burstResistance-Up" in casual community writing. | BU is the final sub-system of Gen3 Burst (2022–23). It returned to the Gatinko-style Ring + Layer Base architecture. "Burst Unit" is not an official Beyblade term — it appears in some fan-written guides incorrectly. Always use "BU" to mean Burst Ultimate when referring to Gen3 era. |
| **Free** (Driver) | Free (Performance Tip — free-spinning outer ring) | フリー | Driver | God Layer (Gen3 burst_god) | "Free driver" (proper Performance Tip with decoupled outer ring) vs "free spin" as a generic adjective (free-spin contact zone, free-spinning sub-part) vs "free-spinning" as a general descriptor for any bearing-type tip. | Free is a specific Driver: the outer ring rotates independently from the body, reducing spin drain. The word "free-spinning" is used generically for many parts. In game engine context, `spinDirection: 'free'` on a sub-part is different from the Free Performance Tip. |
| **Valkyrie (God)** | God Valkyrie 6VR | ゴッドヴァルキリー6VR | Layer | God Layer (Gen3 burst_god) | God Valkyrie vs Cho-Z Valkyrie vs Victory Valkyrie vs Winning Valtryek. The "Valkyrie/Valtryek" line has one entry per sub-system. | Naming convention: "Victory Valkyrie" (S1), "Winning Valtryek" (S1 Hasbro), "God Valkyrie" (God Layer), "Cho-Z Valkyrie" (Cho-Z), "Brave Valkyrie" (Superking), "Savior Valkyrie" (BU). All are the same toy-line character (Valt's bey). Different product codes, incompatible Layer formats, and distinct stats. Must specify sub-system to identify uniquely. |
| **Valkyrie (Cho-Z)** | Cho-Z Valkyrie ZE | チョウゼットヴァルキリーZE | Layer | Cho-Z (Gen3 burst_choz) | See Valkyrie (God) row above. | |
| **Valkyrie (BX)** | N/A — no BX Valkyrie product (ValkyrieVolt is Custom Line) | — | Blade (CX line) | BX (Gen4) | "ValkyrieVolt" (BX Custom Line CX-00) is sometimes abbreviated "Valkyrie BX" casually, but it is not a direct successor — it is a Custom Line prize product. | ValkyrieVolt S4-70V is the only Valkyrie-named BX product. Product code: CX-00. Contains Metal Lock Chip (~8g) and Slash Assist Blade — distinct from standard BX architecture. |
| **Ratchet** (Burst mechanism) | Ratchet (burst-click mechanism) | ラチェット (メカニズム) | Internal mechanism — not a standalone part | All Gen3 Burst sub-systems | In Burst, "Ratchet" refers to the internal 3-click burst advance mechanism. In BX, "Ratchet" is an actual physical component (the middle of the 3-piece Blade/Ratchet/Bit). These are different uses of the same word. | Gen3 context: "ratchet" describes the mechanical burst system (how clicks accumulate). "Ratchet" is not the name of a standalone part. BX context: Ratchet is one of the three physical parts, with the format [teeth count]-[height]mm. Always clarify which context. |
| **Ratchet** (BX component) | Ratchet (middle component, `[teeth]-[height]` format) | ラチェット | Ratchet (BX middle layer) | BX (Gen4) | See Ratchet (Burst mechanism) row above. Ratchet teeth count = burst resistance. Ratchet height = CoG height in mm. | Example: 3-60 = 3 teeth, 60mm height. 0-tooth Ratchet (e.g., GhostCircle 0-80GB) = cannot burst, maps to infinite burst threshold. |
| **Retsu / Lethal** | Lethal (Performance Tip, English) / Retsu (レツ, Japanese) | レツ | Driver | Burst S1 (Gen3 burst_s1) | Japanese name "Retsu" (レツ) vs English name "Lethal". This is a documented translation discrepancy. "Retsu" is the official Japanese product name; "Lethal" is the English localization. Fan sources sometimes use both. | Always use "Lethal" in English-language game content. Firestore field `id` should use English names to avoid encoding issues. Japanese name preserved in the `japaneseName` lore field only. INFERENCE (both names confirmed by BeyWiki + community cross-reference; direct official English packaging not independently verified in this session). |
| **Bearing** (Gen3 Driver) | Bearing (Performance Tip, near-zero friction) | ベアリング | Driver | All Burst sub-systems | "Bearing Driver" (Gen3 Performance Tip) vs "bearing" as a material type (metal ball bearing inside any part, e.g., DB Core bearing) vs "bearing_zombie" gimmick id vs `tipFrictionFactor` field. | The Bearing Driver is a specific product. "bearing" as a material type appears in `ContactZoneSpec.zoneType: free_spin` contexts. The gimmick ID `bearing_zombie` describes the strategy (bearing tip + zombie playstyle), not the Driver alone. Always qualify: "Bearing Driver" (part), "bearing material" (material type), "bearing_zombie" (gimmick). |
| **Nothing / Nothing Tapered** | Nothing (N Driver), Nothing Tapered (NT Driver) | ナッシング, ナッシングテーパー | Driver | God Layer / Cho-Z | "Nothing" (standard bare-shaft tip, near-zero floor friction) vs "Nothing Tapered" (tapered-angle variant for improved stability). Drain Fafnir uses N; Geist Fafnir uses NT. | Two different Drivers with similar names. Nothing = straight shaft; extremely low μ. Nothing Tapered = angled/tapered shaft; slightly more dynamic movement but still very low friction. In the engine, both map to `spinDecayRate` near 0 and `bearing_zombie` archetype. |
| **Variable' (Dash)** | Variable Dash (Performance Tip, auto dual-mode) | バリアブルダッシュ | Driver | DB — Dynamite Battle (Gen3 burst_db) | "Variable'" (Dash driver with prime symbol) vs "Variable" (standard non-dash variant). The prime symbol (') denotes Dash (metal-coated); alters durability not mode behavior. Also confused with "VariAres" (MFB 4D Beyblade). | The prime symbol notation (Driver') applies across all Dash Drivers: Xtreme', Zephyr', Venture', Variable', etc. It is a material upgrade, not a new mode. VariAres is a complete MFB 4D Beyblade (Layer+Track+Driver), not a Driver. |
| **Xtreme' (Dash Driver)** | Xtreme Dash (Performance Tip, metal-coated rubber flat) | エクストリームダッシュ (ドライバー) | Driver | Cho-Z / GT | "Xtreme'" (the Dash-variant Xtreme Driver, official product name: "Xtreme Dash") vs "Xtreme Dash" (the BX rail mechanic). These are two different things that share the same official English name. | This is the most severe name-collision in the franchise. "Xtreme Dash" means two different things: (1) the Gen3 Driver (a metal-coated rubber-flat Tip, product code suffix '), and (2) the Gen4 BX rail-contact speed boost mechanic. In game engine code, distinguish via: `driverType: 'xtreme_dash'` for the Gen3 Driver, and `mechanic: 'xtreme_dash'` for the BX stadium mechanic. FACT. |
| **Xceed'+X** (Driver) | Xceed Plus-X (Performance Tip) | エクシード+X | Driver | Superking (Gen3 burst_superking) | "Xceed'+X" abbreviated as "X+X" or "XpX" casually — collides with "BX" (Beyblade X system abbreviation). | The Xceed'+X Driver is used by FlameBringer (Hyperion II). It is a high-speed driver with limited XD-like behavior. Do NOT abbreviate as "BX" or "X" without qualification. |
| **S Gear / L Gear / V Gear** | S-Gear, L-Gear, V-Gear (Forge Disc attachments) | Sギア, Lギア, Vギア | Disc gear attachment | GT / Cho-Z (Gen3) | Gear attachments for Forge Discs have abbreviations (S, L, V) that can be confused with: S = Smash or Stamina type; L = Left-spin or Low; V = Velocity or V-Force (Gen1 anime season). | In GT/Cho-Z era context, always write "S-Gear", "L-Gear", "V-Gear" in full. Abbreviation "S" alone never means S-Gear unless explicitly in a parts list context. "L" alone always means Left-spin unless the parts list context makes S/L/V Gear unambiguous. |
| **Unite / Unite Prime** | Unite (Performance Tip, Spriggan) / Unite Prime (Dash variant) | ユナイト, ユナイトダッシュ | Driver | God Layer / Burst BU | "Unite" (the free-spin ring Driver) vs "Unite Prime" (Dash/metal-coated variant). World Spryzen uses Unite' (Dash). Storm Spriggan uses Unite (standard). | Unite has a partial free-spin outer ring — different from the Bearing Driver's full bearing mechanism. mapsto `free_spin` gimmick + `spin_equalization` because it enables dual-spin equalization without full bearing isolation. |
| **DranSword / DranDagger / DranBuster** | DranSword 3-60F (BX-01), DranDagger 4-60R (BX-20), DranBuster 1-60A (UX-01) | ドランソード, ドランダガー, ドランバスター | Blade (BX) | BX (Gen4) | Three related "Dran" Blades with different Ratchets and Bits. Frequently abbreviated "DS" (collision with Double Stamina tip in MFB context). | DranSword: 3-tooth Ratchet, F Flat Bit — primary attack. DranDagger: 4-tooth, R Rush Bit — precision attack. DranBuster: 1-tooth, A Accel Bit (UX series) — high burst risk, high reward. Never use "DS" to abbreviate any of these. |
| **CobaltDrake / CobaltDragoon** | CobaltDrake 4-60F (BX-00), CobaltDragoon (BX-34) | コバルトドレイク, コバルトドラグーン | Blade (BX) | BX (Gen4) | "CobaltDragoon" (left-spin BX blade named after the Gen1 Dragoon line) vs "CobaltDrake" (right-spin BX blade, prize bey). Two different products. "Drake" vs "Dragoon" is an easy misread. | CobaltDragoon is one of the rare LEFT-SPIN BX beys (only a few exist). CobaltDrake is the prize bey with Metal Coat. Do not conflate. In systemId `bx`, both exist; distinguish by product code (BX-34 = Dragoon, BX-00 = Drake). |
| **PhoenixWing / FlameBringer** | PhoenixWing 9-60GF (BX-23) vs FlameBringer (Superking/BX narrative) | フェニックスウイング, フレイムブリンガー | Blade (BX) vs Superking Layer | BX Gen4 vs burst_superking | FlameBringer is a Gen3 Superking-era bey (Hyperion II, right-spin). PhoenixWing is a BX Gen4 Blade. Both have phoenix/fire motifs. Also: FlameBringer (right-spin) is the counterpart of BlazeBringer (left-spin Superking). | FlameBringer: Gen3 burst_superking, Layer component, `attack_amplifier` + `mode_switch`. PhoenixWing: Gen4 bx, Blade component, 9-tooth Ratchet max burst resistance, `xtreme_dash` + `velocity_burst`. Different generations, different slot types, different mechanics. |
| **WizardArrow / WizardRod** | WizardArrow 4-80B (BX-03), WizardRod 5-70DB (UX-03) | ウィザードアロー, ウィザードロッド | Blade (BX) | BX (Gen4) | Both are Stamina-type BX beys from the "Wizard" line. WizardRod uses DB Bit (free-spin + bearing = zombie). WizardRod was competitively banned (April 2025, WBO). | WizardRod's DB Bit: D = dual-layer disc; B = ball bearing. This Bit achieves maximum LAD + zombie combination. The ban is relevant for game balance settings. WizardArrow's B Bit is a standard ball (center-hold, no free-spin bearing). Despite similar names: Arrow = standard stamina, Rod = zombie specialist. |
| **KnightShield / HelmKnight** | KnightShield 3-80N (BX-04), HelmKnight (BX-04 alt config) | ナイトシールド, ヘルムナイト | Blade (BX) | BX (Gen4) | "HelmKnight" is sometimes used as the Hasbro English name for the BX-04 product. "KnightShield" is the Takara-Tomy English name. Same product code (BX-04), different regional names. | Use "KnightShield" as the canonical name in Firestore records (Takara-Tomy is the original manufacturer). Store Hasbro name in the `localizations` field if implemented. Do not create two separate records for the same bey. |
| **HellsScythe / ScytheIncendio** | HellsScythe 4-60T (BX-02, TT), ScytheIncendio (BX-02, Hasbro) | ヘルズサイス, スサイスインセンディオ | Blade (BX) | BX (Gen4) | Same product code BX-02. HellsScythe = Takara-Tomy regional name. ScytheIncendio = Hasbro English release name. Community uses both interchangeably. | Canonical name: HellsScythe. Hasbro localization: ScytheIncendio. Both refer to BX-02 stock config (4-60T, Taper Bit). Same disambiguation rule as KnightShield / HelmKnight. |
| **GF Bit** | Gear Flat Bit | ギアフラット | Bit (BX) | BX (Gen4) | "GF" (Gear Flat) vs "GCF" (Gear Circle Flat, MFB Zero-G tip) vs "F" (Flat Bit, standard BX rubber flat). GF adds the gear mechanism; plain F does not. | GF = gear ring + rubber flat tip = more consistent Xtreme Dash activation (gear maintains peripheral speed late-battle). GCF = MFB Zero-G tip (wide circle flat, orbit-optimized, no BX gear ring). Never substitute GCF data for GF or vice versa. |
| **N Bit** | Needle Bit | ニードル | Bit (BX) | BX (Gen4) | "N Bit" vs "N Driver" (Not a standard term — "Needle" only in BX). Occasionally confused with "Nothing (N)" Gen3 Driver. | Nothing (N) = Gen3 Driver (bare-shaft, near-zero friction). Needle (N) = BX Bit (pointed tip, center-hold, max stamina). Different parts, different eras, same single-letter abbreviation. Always write "Needle Bit" or "N Bit (BX)" and "Nothing Driver" or "N Driver (Gen3)" for disambiguation. |
| **DB Bit** | Disc Ball Bit (also "Dual Ball Bit" in some sources) | ディスクボール | Bit (BX) | BX (Gen4) | "DB Bit" (BX Bit with free-spin disc + ball bearing = WizardRod zombie) vs "DB" as sub-system (Dynamite Battle, Gen3 burst_db) vs "DB Core" (DB era component). | Three "DB" uses: (1) DB Bit = BX Bit type. (2) DB = Dynamite Battle system tag. (3) DB Core = Gen3 DB era center component. In BX bey records: the "DB" in "WizardRod 5-70DB" refers to the Bit type, not the system. Always specify: "DB Bit", "DB era (burst_db)", "DB Core" in full. |
| **V Bit / Volt Bit** | Volt Bit (ValkyrieVolt CX Bit) | ボルトビット | Bit (BX CX line) | BX — Custom Line (CX-00) | "V Bit" used casually to abbreviate Volt Bit (CX-00 exclusive) vs "V" as a Forge Disc designation in Gen3 (V-Gear, V-Disc). | Volt Bit is exclusive to ValkyrieVolt CX-00. It is a Custom Line-exclusive Bit with enhanced gear and contact geometry. "V" alone means nothing in BX context. "V" in Gen3 context = V-Force era or V-Gear disc type. |

---

### Critical Name-Collision Summary

The following pairs/groups are the highest-risk disambiguation cases. Any code, seed file, or Firestore document must use the full canonical name to avoid confusion:

| Risk Level | Names That Collide | How to Distinguish |
|-----------|-------------------|-------------------|
| CRITICAL | "Xtreme Dash" (Gen3 Driver, product name) vs "Xtreme Dash" (BX stadium mechanic) | Gen3 Driver: `slot: "driver"`, `systemId: "burst_choz"`. BX mechanic: `type: "arena_mechanic"`, `systemId: "bx"`. |
| CRITICAL | "Ratchet" (Gen3 burst mechanism) vs "Ratchet" (BX physical component) | Gen3: not a standalone part; refers to internal click mechanism. BX: physical part with `[teeth]-[height]` format code. |
| HIGH | "DB" = Dynamite Battle (Gen3 system) vs DB Bit (BX Bit type) vs DB Core (Gen3 component) | Always write full name: "Dynamite Battle era", "DB Bit (BX)", "DB Core (Gen3)". |
| HIGH | "BD145" (MFB Track) vs "B:D" (MFB 4D Tip) vs "BD" (Dynamite Battle abbreviation) | BD145 = Track (`slot: "track"`, `systemId: "mfb"`). B:D = Driver (`slot: "driver"`, `systemId: "mfb"`). BD = system tag only. |
| HIGH | "GT Chip" (Gatinko Chip, Gen3) vs "GT" (G-Revolution, Gen1 anime) | Gen3: always "Gatinko Chip" or "GT Chip (burst_gt)". Gen1: "G-Revolution" in full, never abbreviated "GT". |
| HIGH | "Retsu" vs "Lethal" (same Driver, dual naming) | Use "Lethal" in all English-language records. Store `japaneseName: "レツ"` in lore field. |
| MEDIUM | "N Bit (BX — Needle)" vs "Nothing (N) Driver (Gen3)" | Write "Needle Bit" for BX, "Nothing Driver" for Gen3. Never abbreviate either as just "N". |
| MEDIUM | "Free Driver (Gen3)" vs "free-spinning" (general adjective) vs `free_spin` (zone type / gimmick id) | Part name: "Free Driver". Gimmick: `bearing_zombie`. Zone type: `free_spin`. Never conflate part name with gimmick id. |
| MEDIUM | "GF Bit (BX — Gear Flat)" vs "GCF tip (MFB Zero-G — Gear Circle Flat)" | GF = BX Bit. GCF = MFB Zero-G Driver. Different eras, different slot types. |
| MEDIUM | "BU" (Burst Ultimate system) vs mis-use as "Burst Unit" | BU always means the Gen3 sub-system. "Burst Unit" is not a real Beyblade term. |
| MEDIUM | Valkyrie / Valtryek disambiguation | TT English: "Valkyrie". Hasbro English: "Valtryek". Same character, different localization. Hasbro-only products (e.g., Winning Valtryek) use the Hasbro name as canonical since no TT English release. |
| LOW | "Variable" vs "Variable' (Dash)" | Both are real Drivers. The prime symbol ' denotes Dash (metal-coated). Different `contactMaterial` values. |
| LOW | "DranSword / DranDagger / DranBuster" (abbreviated "DS") | Never use "DS". DS = Double Stamina in MFB context. Write full product name always. |

---

### Source Notes for Batch 1J

All disambiguation rows are derived from cross-referencing:
- Phase 07 BX batch (Batch 7M) — product codes, Ratchet/Bit combinations, system tags
- Phase 07 Gen3 batches (7H, 7I, 7J, 7K, 7L) — Driver names, sub-system architecture
- Phase 01 Batches 1D, 1G, 1H, 1I — existing Xtreme Dash, Bit type, Burst system, and component slot documentation
- Official Takara-Tomy product codes (confirmed in Batch 7M source cross-reference)

Evidence tags:
- Xtreme vs Xtreme Dash separation: FACT (two different product/mechanic categories confirmed in BX system documentation)
- Ratchet dual-meaning: FACT (Gen3 mechanism vs BX physical part — different component slot classifications)
- Retsu/Lethal: INFERENCE (community consensus + BeyWiki; direct Hasbro packaging citation not independently retrieved in this session)
- All other rows: INFERENCE or FACT per individual part documentation in Phase 07 batches

---

### Batch 1J Summary

Thirty-one disambiguation entries documented. Four are CRITICAL risk (will cause seed data errors if confused). The most dangerous collision in the franchise: "Xtreme Dash" means both a Gen3 Driver and a BX arena mechanic — they must be distinguished by `slot` + `systemId` in all Firestore records, engine constants, and seed files. The second most dangerous: "Ratchet" is both a Gen3 internal mechanism and a BX physical component — context determines meaning, but engine field names must not reuse the same string for both. All 31 entries carry full English name, Japanese name where available, component slot, sub-system tag, and collision description.

---

*End of Phase 01 — Terminology, Definitions, Concepts*

---
[↑ Index](../INDEX.md) &nbsp;�&nbsp; [Phase 02: Special Moves →](phase-02-special-moves.md)


---

## Batch 1K — Episode-Derived Launch Techniques, Mechanic Introductions & Generation Context

> Source: `linka/episodes/` first-episode files for each season/generation. Entries represent first anime appearance confirmed from episode markdown research.

---

### 1K-1: Named Launch Techniques (All Generations)

| Technique ID | Display Name | Gen | Season | Episode First Appearance | User | Description | Engine Mapping |
|---|---|---|---|---|---|---|---|
| `running_aerial_launch` | Running Aerial Launch | 1 | S1 Classic | Gen1 S1 Ep01 "The Blade Raider" | Tyson Granger | Launcher released mid-stride while running; adds kinetic energy of forward momentum to launch RPM | Applies `launchBoostFactor * 1.15`; slight random angle ±5° |
| `blade_shark_diagonal` | Blade Shark Slam | 1 | S1 Classic | Gen1 S1 Ep01 | Carlos | Aggressive diagonal/angled launch aimed directly at opponent bey rather than arena center | `initialVelocity` directed at opponent position; no center bias |
| `engine_gear_chain_launch` | Chain Gear Launch | 1 | S3 G-Rev | Gen1 S3 Ep01 | Daichi | Trigger cord pulled in two stages; first stage primes chain; second stage releases amplified spin | `launchBoostFactor * 1.20`; spin +10% |
| `rush_launch` | Rush Launch | 3 | Burst S1 | Gen3 S1 Ep01 "Let's Go! Valtryek!" | Valt Aoi | Ultra-fast wrist snap; launches bey at near-maximum RPM with short windup | `launchBoostFactor * 1.25`; requires `systemId: burst_s1+` |
| `lightning_launch` | Lightning Launch | 3 | Burst S5 Surge | Gen3 S5 Ep01 | Hyuga Hizashi | Explosive full-body launch; maximum torque transferred through shoulder+elbow+wrist chain; bey exits at extreme angle | `launchBoostFactor * 1.35`; strong initial `vx` component; requires `systemId: burst_superking+` |
| `xtreme_launch` | Xtreme Launch | 4 | BX S1 | Gen4 S1 Ep01 "X" | Jaxon Bell | Standard BX launch aimed to intersect Xtreme Line rail in stadium; timing determines entry angle | No RPM boost; adds `targetXtremeLine: true` targeting behavior |
| `spin_top_upper_launch` | Upper Launch | 4 | BX S1 | Gen4 S1 Ep03 (approx) | Khrome | Upward-angled release angle; optimized for upper-attack Blade geometry | Launch angle +15°; increases initial y-velocity component |
| `backdraft_launch` | Backdraft Launch | 4 | BX S1 | Gen4 S1 Ep05 (approx) | Miles | Reverse-direction entry into Xtreme Line; bey circles back for counter-attack position | `reverseEntry: true`; sets bey initial angle 180° from standard entry |

---

### 1K-2: Mechanic First-Appearance by Episode (All Generations)

| Mechanic | mechanic_id | Gen | Season | Episode (approx) | User | Narrative Context |
|---|---|---|---|---|---|---|
| Bit-Beast resonance | `bit_beast_resonance` | 1 | S1 Classic | Gen1 S1 Ep02 | Kenny explains | Kenny introduces concept of spiritual guardian sealed within bey Attack Ring |
| Magnacore polarity repel | `magnacore_repel` | 1 | S2 V-Force | Gen1 S2 Ep08 | Ozuma vs Tyson | Ozuma's Magnacore WD generates repulsion field when same-pole magnets align |
| Magnacore polarity attract | `magnacore_attract` | 1 | S2 V-Force | Gen1 S2 Ep10 | Mariam | Opposite-pole Magnacore draws opponent bey inward for contact boost |
| Cyber Beyblade spin-copy | `cyber_copy` | 1 | S2 V-Force | Gen1 S2 Ep20 | Team Psykick | Mechanical Cyber Beyblade copies Bit-Beast data; no gimmick ID in game (narrative only) |
| Engine Gear chain boost | `engine_gear` | 1 | S3 G-Rev | Gen1 S3 Ep01 | Daichi | Engine Gear internal chain stores launch energy and releases in burst for spin recovery |
| F-Dynasty twin combo attack | `twin_combination` | 1 | S3 G-Rev | Gen1 S3 Ep12 | Julia + Raul | Simultaneous diagonal attacks from two sides; narrative co-op mechanic |
| Zeus "Zone" perfect state | `zone_state` | 1 | S3 G-Rev | Gen1 S3 Ep42 | Brooklyn | Flow-state: Brooklyn reads all movements; game equivalent = perfect reaction AI |
| HMS bearing low-friction glide | `bearing_drift` | 1 | HMS | G-Rev Ep40 | Tyson (Dragoon MS) | HMS metal ring floats on near-frictionless bearing; prolongs spin substantially |
| Spin steal via rubber | `rubber_grip` | 2 | MFB S1 | Gen2 S1 Ep15 (approx) | Free (Fafnir) | Rubber contact points on Layer absorb opponent's rotational energy on contact |
| Dual-spin direction switch | `dual_spin` | 2 | MFB S2 | Gen2 S2 Ep18 (approx) | Julian (Gravity Perseus) | Wheel can flip spin direction; matches any opponent |
| Bey Points economy | `bey_points` | 2 | MFB S1 | Gen2 S1 Ep01 | Kenta explains | 30,000+ Bey Points required to enter championship; won by defeating bladers |
| Avatar / God Layer power flare | `god_layer_boost` | 3 | Burst S2 God | Gen3 S2 Ep01 | Valt | Bey "resonates" with blader's energy; visual power flare; game = temporary stat boost |
| Cho-Z Awakening | `cho_z_awakening` | 3 | Burst S3 Cho-Z | Gen3 S3 Ep08 (approx) | Valt (Cho-Z Valtryek) | Layer transforms mid-battle into awakened state; attack power surges |
| GT Chip power unlock | `gt_chip_unlock` | 3 | Burst S4 GT | Gen3 S4 Ep01 | Dante | GT Chip at bey center stores power that unlocks at high spin RPM |
| Superking Overdrive ring | `overdrive_ring` | 3 | Burst S5 Surge | Gen3 S5 Ep01 | Hyuga | Outer ring extends attack contact radius; activates above spin threshold |
| QuadDrive 4-mode Layer | `quad_drive_mode` | 3 | Burst S6 QD | Gen3 S6 Ep01 | Bel (Dynamite Belial) | Layer outer ring rotates to select Attack/Stamina/Defense/Balance mode before launch |
| Elemental Power tiles | `elemental_tile_boost` | 3 | Burst S7 QS | Gen3 S7 Ep01 | Multiple | Stadium floor tiles grant elemental power boosts; color-coded zones |
| Xtreme Line / Xtreme Dash | `xtreme_dash` | 4 | BX S1 | Gen4 S1 Ep01 "X" | Jaxon | Stadium rail; bey riding the rail gains sudden speed burst (Xtreme Dash) |
| Xtreme Finish win condition | `xtreme_finish` | 4 | BX S1 | Gen4 S1 Ep01 | Jaxon vs Miles | Bey exits arena after riding Xtreme Line; 2-point win; new Gen4 condition |
| Ratchet tooth burst resistance | `ratchet_resistance` | 4 | BX S1 | Gen4 S1 Ep02 (approx) | Multiple | Higher tooth count (3/5/7/9) resists burst; lower = power but burst-prone |

---

### 1K-3: Per-Generation Mechanic Introduction Summary

| Generation | System | Key New Mechanic(s) | First Episode |
|---|---|---|---|
| Gen1 S1 Classic | Plastic SGS | Bit-Beast resonance; Running Aerial Launch | S1 Ep01 |
| Gen1 S2 V-Force | Plastic Magnacore | Magnacore polarity (repel/attract) | S2 Ep08 (approx) |
| Gen1 S3 G-Revolution | Plastic Engine Gear | Engine Gear chain spin-up; F-Dynasty twin combo | S3 Ep01 |
| Gen1 HMS era | HMS | Bearing low-friction drift; all-metal Upper Attack | G-Rev Ep40 |
| Gen2 MFB S1 | MFB 5-component | Rubber spin-steal (Fafnir); Bey Points economy | S1 Ep01 / S1 Ep15 |
| Gen2 MFB S2 | MFB | Dual-spin Layer (Gravity Perseus) | S2 Ep18 |
| Gen2 MFB S3 4D | 4D System | 4D Wheel inner/outer mode switch | S3 Ep01 |
| Gen2 Zero-G | Samurai System | Dynamic tilting stadium; Zero-G floor movement | Shogun Steel Ep01 |
| Gen3 Burst S1 | Standard Layer | Burst Finish; Rush Launch; 3-part scoring | S1 Ep01 |
| Gen3 Burst S2 God | God Layer | Avatar power flare / God boost | S2 Ep01 |
| Gen3 Burst S3 Cho-Z | Cho-Z Layer | Cho-Z Awakening in-battle power surge | S3 Ep08 |
| Gen3 Burst S4 GT | GT Layer | GT Chip RPM-threshold unlock | S4 Ep01 |
| Gen3 Burst S5 Surge | Super King Layer | Overdrive ring; Lightning Launch | S5 Ep01 |
| Gen3 Burst S6 QuadDrive | DB Layer | 4-mode QuadDrive Layer; 4-pocket stadiums | S6 Ep01 |
| Gen3 Burst S7 QuadStrike | Ultimate Layer | Elemental Power floor tiles | S7 Ep01 |
| Gen4 BX S1 | BX 3-component | Xtreme Line/Dash; Xtreme Finish; Ratchet system | S1 Ep01 |

---

### 1K-4: Scoring System Evolution by Generation

| Gen | Season | Ring-Out | Burst | Xtreme Finish | Survivor | Notes |
|---|---|---|---|---|---|---|
| Gen1 | S1–S3 + HMS | Win (3 pt in JP / game-decided) | N/A (not a mechanic) | N/A | Loss for spinner-out | No burst; Beyblades do not disassemble |
| Gen2 | MFB S1–S3 | Win | N/A | N/A | Loss for spinner-out | No burst; stadium KO or spinner-stop |
| Gen2 | Shogun Steel | Win | N/A | N/A | Loss | Zero-G tilt changes KO dynamics |
| Gen3 | Burst S1+ | 2 pt | 2 pt | N/A | 1 pt | Burst mechanic introduced; first multi-point system |
| Gen4 | BX S1+ | 2 pt | 2 pt | 2 pt | 1 pt | Xtreme Finish added as third 2-pt condition |

---

### 1K-5: Stadium Type → Mechanic Relationship

| Stadium Feature | Mechanic Enabled | Gen Introduced | Episode Context |
|---|---|---|---|
| Standard bowl | — | Gen1 S1 | Generic competition stadium; BBA tournaments |
| Magnacore bowl | `magnacore_repel` / `magnacore_attract` | Gen1 S2 | V-Force Psykick labs and Saint Shields ruins |
| Zero-G tilting platform | `zero_g_tilt` | Gen2 Shogun Steel | Shogun Steel Ep01; stadium rocks during battle |
| Burst official bowl | Burst Finish enabled | Gen3 S1 | Standard Burst tournament stadiums |
| 4-pocket QuadDrive stadium | Quad pocket entry system | Gen3 S6 | QuadDrive arenas have 4 distinct launch pockets |
| Xtreme Line stadium | `xtreme_dash` / `xtreme_finish` | Gen4 S1 | All BX stadiums have Xtreme Line rail |
| Elemental tile floor | `elemental_tile_boost` | Gen3 S7 | QuadStrike arenas; color-coded power zones |

---

*End of Batch 1K*

---

## Implementation Status (audit 2026-05-24)

> **Complete** — This phase is a reference document; the engine implements all described terminology. Type system, collision physics, attack mechanics, archetype definitions, and spin mechanics are all functional in the codebase. Terminology is used consistently across `GameState.ts`, `PhysicsEngine.ts`, and `PartPhysics.ts`.

---

[← Phase 00: Engine Audit](phase-00-engine-audit.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 02: Special Moves →](phase-02-special-moves.md)

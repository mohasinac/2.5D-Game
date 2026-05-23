---
batch: 001
stage: 1A
status: complete
---

## Research Completed
Core combat mechanics, bey types, physics concepts (42 concepts from linka/concepts/)

## Coverage Table
| Category | Count Researched | Total Known | Coverage | Missing |
|----------|-----------------|-------------|---------|---------|
| Bey Types (attack/defense/stamina/balance) | 4 | 4 | 100% | none |
| Attack types (smash/upper/barrage/anti-attack/destabilizer) | 5 | 5+ | 80% | rebound, critical |
| Physics (momentum/inertia/angular/gyroscopic) | 4 | 6 | 67% | precession rate, CoR formula |
| Strategy concepts (tornado/LAD/zombie/flower/drift) | 6 | 8 | 75% | magnetic strategies |
| Launch techniques (weak/rush/power/sliding/banking) | 5 | 7 | 71% | burst launch, catapult |
| KO conditions (knockout/burst/survivor/sleep-out) | 4 | 4 | 100% | none |
| Mode concepts (mode-change/high-mode/low-mode) | 3 | 8 | 38% | 5 GT gear mode types not yet |
| Lore (avatar/bit-beast/resonance/blader-spirit) | 4 | 6 | 67% | Nemesis, dark bit-beasts |

## Facts Extracted

| Item | Raw Fact | Evidence Type | Confidence |
|------|---------|---------------|-----------|
| Attack type | High attack + aggressive flat tip + smash AR; type-triangle counters Stamina, loses to Defense | FACT | HIGH |
| Defense type | Inward WD + round tip + smooth AR; counters Attack, loses to Stamina | FACT | HIGH |
| Stamina type | Outward WD + narrow tip + low AR profile; counters Defense, loses to Attack | FACT | HIGH |
| Balance type | Mixed stats, no specialization; blader skill determines effectiveness | FACT | HIGH |
| Smash attack | Horizontal lateral force using spike/pressure-point contact; concentrates force at small area | FACT | HIGH |
| Upper attack | Ramp-slope AR lifts opponent off floor, removes gyroscopic stability | FACT | HIGH |
| Recoil | Backward momentum reflected to attacker; CoR-dependent; higher for sharp/hard contacts | FACT | HIGH |
| Anti-attack | Balance combo: aggressive low-recoil wheel + BD145 + rubber flat tip; absorbs/redirects Attack | FACT | HIGH |
| Spin equalization | Two opposite-spin rims contact → gear-like coupling → velocities equalize | FACT | HIGH |
| Spin steal | Friction coupling during opposite-spin contact → angular momentum transfer attacker←defender | FACT | HIGH |
| Collision physics | Momentum + energy transfer event; CoR scales energy retained vs absorbed | FACT | HIGH |
| Elastic collision | CoR=1.0 baseline; metal-on-metal approaches this | FACT | HIGH |
| Momentum transfer | p = m×v; heavy beys transfer more to light | FACT | HIGH |
| Rotational inertia | I = Σmr²; outward WD maximizes I → better stamina | FACT | HIGH |
| Angular momentum | L = I×ω; conserved in isolation; resists tipping | FACT | HIGH |
| Gyroscopic stability | Fast-spinning beys resist tipping; slow-spinning beys precess and fall | FACT | HIGH |
| Tornado stall | Circular orbit on ridge conserves stamina; risk = self-KO from ridge proximity | FACT | HIGH |
| LAD | Near-horizontal spin = bey rolls on flat rim; extends spin duration past normal axis | FACT | HIGH |
| Zombie strategy | Opposite-spin + OWD + bearing tip; absorbs spin via equalization + wins via LAD | FACT | HIGH |
| Flower pattern | Banking launch → center strike pattern via gyroscopic precession | FACT | HIGH |
| Barrage attack | Multi-hit with low recoil per hit; cumulative damage via attrition | FACT | HIGH |
| Weak launch | 30-60% ripcord effort → lower initial RPM → enables equalization advantage | FACT | HIGH |
| Weight distribution | OWD (outward) = higher I = better stamina. CWD = faster RPM = burst pressure | FACT | HIGH |
| Center of gravity | Lower CoG = slower precession = more stable; higher = faster LAD | FACT | HIGH |
| Grip mechanics | Rubber tip = high friction = fast orbit + high stamina loss; sharp = low friction = slow orbit | FACT | HIGH |
| KO (Ring-out) | Bey exits stadium; 2 points (or 1 in older rulesets); risk/reward | FACT | HIGH |
| Survivor finish | Opponent stops spinning first; 1 point; conservative strategy | FACT | HIGH |
| Sleep-out | Gen1/2 terminology for Survivor Finish; same event | FACT | HIGH |
| Track height | MFB: contact height must match for effective interaction | FACT | HIGH |
| Gyroscopic precession | Precession torque = m × g × CoG_height × sin(tilt); drives wobble | FACT | HIGH |
| Spin decay rate | formula: τ = μ × m × g × r_tip; driven by tip friction | FACT | HIGH |
| Upper attack airborne | lifts opponent off floor → tip no longer contacts floor → destabilized | FACT | HIGH |
| Mode change | mid-battle or pre-battle reconfiguration; changes contact profile | FACT | HIGH |
| High mode | Layer elevated → upper-attack geometry, higher burst risk | FACT | HIGH |
| Low mode | Layer lowered → defensive geometry, lower burst risk | FACT | HIGH |

## Existing Stat Mapping

| Research Finding | Existing Field Used | New Field Proposed? |
|-----------------|---------------------|---------------------|
| Bey type (attack) | attackPoints + aggressiveness | No |
| Bey type (defense) | defensePoints + damageReduction + mass | No |
| Bey type (stamina) | staminaPoints + spinDecayRate | No |
| Smash attack | attackPoints × contactDamageMultiplier | No |
| Upper attack | contactDamageMultiplier + effectiveGravity + wobbleAmplitude | No (airborne handler exists) |
| Recoil | recoilFactor | No |
| Anti-attack | damageReduction + recoilFactor + gripFactor | No |
| Spin equalization | spinStealFactor (bidirectional) + spinStealResist | No |
| Spin steal | spinStealFactor + spinDirection + CLASH_MULTIPLIERS | No |
| Momentum transfer | mass → knockbackDistance formula | No |
| Rotational inertia | mass + radius → staminaPoints formula | No |
| Tornado stall | aggressiveness + gripFactor (low) + arena ridge feature | No (orbit_movement mechanic covers) |
| LAD / zombie | spinDecayRate (low, bearing) + wobbleAmplitude + free_spin mechanic | No |
| Weak launch | Initial spin = maxSpin × pullStrength factor | No (internal to session setup) |
| Weight distribution | mass + radius (affects staminaPoints derivation) | No |
| Center of gravity | mass + wobbleAmplitude | No |
| Grip mechanics | gripFactor + surfaceFriction | No |
| KO condition | isOutOfBounds() in PhysicsEngine | No |
| Survivor finish | spin < threshold before opponent | No (existing check) |
| Track height | radius (2D/2.5D proxy) | No |
| Mode change | aggressiveness + gripFactor + surfaceFriction (applyStatModifier) | No (mode_switch mechanic) |

## New Mechanics Needed (from Batch 1)

Only concepts where existing fields genuinely cannot represent the behavior:

| Candidate New Mechanic | Why Existing Insufficient | Evidence | Status |
|----------------------|--------------------------|----------|--------|
| `life_after_death` handler | beyTiltAngle > 85° → rolling phase with rim friction instead of tip friction — distinct physics path | FACT (LAD described as separate rolling phase) | APPROVED |
| `upper_attack` airborne handler | Lifts opponent off floor → effectiveGravity override needed; distinct from normal hit | FACT (upper attack removes gyroscopic stability) | APPROVED |
| `tornado_stall` ridge rider | Stadium ridge orbit path — center_pull + orbit_movement combination | FACT (distinct movement strategy) | MAPS TO center_pull + orbit_movement (no new field) |
| `barrage_multiplier` | High-frequency contact tracking beyond single-hit damage | FACT (barrage is cumulative not burst) | MAPS TO comboDamageMultiplierTimer loop |
| `spin_equalization` handler | Bidirectional spin transfer — existing spin_transfer is one-directional | FACT (equalization explicitly bidirectional) | APPROVED (extends computeSpinSteal bidirectional) |

## Presentation Triggers (Batch 1)

| Trigger Level | Mechanic/Event | Layer Affected | Presentation Type | Evidence |
|--------------|---------------|---------------|-------------------|----------|
| Mechanic | Smash attack contact | 3 Camera, 4 Audio, 5 VFX | camera shake, impact SFX, spark burst | FACT |
| Mechanic | Upper attack lift | 5 VFX, 3 Camera | lift glow, destabilize animation, camera tilt | FACT |
| Mechanic | Spin equalization | 4 Audio, 5 VFX | equalizing hum, energy exchange glow | FACT |
| Mechanic | Spin steal | 4 Audio, 5 VFX | spin steal SFX, energy drain beam | FACT |
| Strategy | Zombie LAD onset | 5 VFX, 4 Audio | rolling glow, eerie humming | INFERENCE |
| Strategy | Tornado stall orbit | 5 VFX | orbit trail, tornado swirl | INFERENCE |
| Event | KO (ring-out) | 3 Camera, 4 Audio, 5 VFX, 9 Transition | pan to edge, exit SFX, explosion | FACT |
| Event | Survivor finish | 4 Audio, 5 VFX | spin-down hum decay, victory SFX | FACT |
| Event | Mode change | 8 World State, 5 VFX | transformation glow, mode switch SFX | FACT |

# MASTER ANALYSIS — Beyblade Physics Engine Reference

**Authoritative implementation guide for the Beyblade game engine.**
All values sourced from Case Studies 1--10. Every numeric constant is tagged for traceability.

---

## Section 1: Generation Overview and Normalization Ranges

Each generation defines a peer group for stat normalization (0--150 per category, 360 total budget). The physical parameter ranges below establish the boundaries within which normalization operates.

### Physical Parameter Ranges by Generation

| Metric | Gen 1 Plastic | Gen 1 HMS | Gen 2 MFB | Gen 3 Burst | Gen 4 BX |
|--------|--------------|-----------|-----------|-------------|----------|
| Total mass (g) | 18--35 [REAL-WORLD] | 28--42 [REAL-WORLD] | 35--48 [REAL-WORLD] | 32--45 [REAL-WORLD] | 45--75 [REAL-WORLD] |
| r_outer (mm) | 22--28 [REAL-WORLD] | 17--22 [REAL-WORLD] | 22--28 [REAL-WORLD] | 14--28 [REAL-WORLD] | 24--30 [REAL-WORLD] |
| I_total (kg*m^2) | 3.6--8.5e-6 [INFERRED] | 3--6e-6 [INFERRED] | 6--12e-6 [INFERRED] | 3--6e-6 [INFERRED] | 10--20e-6 [INFERRED] |
| Typical launch omega (rad/s) | 250 [ESTIMATED] | 300 [ESTIMATED] | 600 [ESTIMATED] | 600--800 [ESTIMATED] | 2000 [ESTIMATED] |
| Representative spin life (s) | 55 (sharp), 10 (flat) [INFERRED] | 10--16 [INFERRED] | 15.1 (HF), 3.85 (RF) [INFERRED] | 8--12 [INFERRED] | 290 (flat), 1090 (sharp) [INFERRED] |

**Sources:**
- Gen 1 Plastic: CS4 (Dranzer G 22 g combo, Wolborg 2 23 g combo; I = 3.6--3.9e-6 for individual combos; Zeus combo at upper limit 37--39 g). CS10 Case 555 spin decay table.
- Gen 1 HMS: CS1 Case 37 (HMS r_outer ~ 17.5 mm, total mass ~ 28 g, I ~ 3e-6). Lighter and more compact than plastic gen.
- Gen 2 MFB: CS10 Case 545 (representative MFB: m = 29 g, I = 7.308e-6; heavier MFB combos reach 45--48 g). CS6 (Basalt: 44.50 g, Diablo: heavier).
- Gen 3 Burst: CS7 and CS9 (Burst layers 14--28 mm outer radius across Cho-Z/GT/SK/DB generations; total combo 32--45 g).
- Gen 4 BX: CS8 Case 375 (Shark Edge system: 45.5 g total; heavier BX combos reach 65--75 g). BX launch at omega_0 = 2000 rad/s from CS10 Case 564.

### Normalization Formula

Stats are normalized 0--150 within each generation's peer group:

```
stat_normalized = floor(150 * (value - gen_min) / (gen_max - gen_min))
```

Each beyblade has a 360-point total budget across Attack, Defense, Stamina, Control. No single stat may exceed 150. The engine's damage/decay formulas (from CLAUDE.md) are:

```
damageMultiplier = 1.0 + attack * 0.007       // 1.0x -- 2.05x   [ANIME/GAME]
damageReduction  = 1 - defense * 0.003         // 1.0x -- 0.55x   [ANIME/GAME]
spinDecayRate    = 8 * (1 - stamina * 0.001)   // 8 -- 6.8 /s     [ANIME/GAME]
maxSpin          = 2000 * (1 + stamina * 0.0008)                   [ANIME/GAME]
```

---

## Section 2: Stat Definitions and Physics Formulas

### Attack

**What it represents:** The ability to deliver impulse to an opponent on contact.

**Physics formula:**

```
F_impact = J / dt
J = m_eff * delta_v * (1 + e)
```

Where:
- `J` = impulse at contact (N*s) [REAL-WORLD]
- `m_eff` = effective collision mass (reduced mass of two-body system) [REAL-WORLD]
- `delta_v` = relative velocity at contact point [REAL-WORLD]
- `e` = coefficient of restitution (material-dependent, see Section 3) [REAL-WORLD]
- `dt` = contact duration (~2 ms for hard impacts) [ESTIMATED]

**Torque on opponent spin axis from contact:**

```
tau = r_cp * F_impact                       [REAL-WORLD]
delta_omega = J * r_contact / I_opponent     [REAL-WORLD]
```

Source: CS1 line 198--200 (torque = r_cp x F_impact), CS5 Case 239 (contact impulse decomposition).

**Smash vs Recoil decomposition** (CS8):

```
smash_fraction  = cos(phi)     // phi = contact face angle from radial
recoil_fraction = sin(phi)     // self-deceleration component
```

Example: Shark Edge phi = 20 deg: smash = 0.940, recoil = 0.342 [REAL-WORLD from CS8 Case 375].

**Normalization for engine stat:**

```
attack_raw = f(r_cp, mass_at_cp, contact_angle, restitution, num_cp_per_rev)
attack_stat = normalize(attack_raw, gen_min_attack, gen_max_attack, 0, 150)
```

### Defense

**What it represents:** Resistance to being knocked off-axis, burst, or displaced.

**Physics formula:**

```
defense = f(I_total, h_CoM, mass, recoilAbsorption, burstResistance)
```

Key factors:
- `I_total` (kg*m^2): higher inertia resists spin deceleration from impacts [REAL-WORLD]
- `h_CoM` (mm): lower centre of mass resists tilting torques [REAL-WORLD]
- `mass` (kg): higher mass resists translational displacement (F = ma) [REAL-WORLD]
- `recoilAbsorption`: contact geometry that deflects rather than absorbs (high phi angle) [REAL-WORLD]
- `burstResistance`: ratchet tab count x spring force (BX generation, CS8) [REAL-WORLD]

**Gyroscopic stability (precession threshold):**

```
omega_stable = sqrt(m * g * h_cm / I_total)     [REAL-WORLD]
```

Source: CS4 Case 187 (omega_stable formula), CS1 Case 37 (gyroscopic physics).

### Stamina

**What it represents:** How long a beyblade can spin before stopping.

**Physics formula (spin decay):**

```
d_omega/dt = -(mu_eff * m * g * r_tip) / I_total     [REAL-WORLD]
t_spin = omega_0 / |d_omega/dt|                        [REAL-WORLD]
t_spin = (I_total * omega_0) / (mu_eff * m * g * r_tip)  [REAL-WORLD]
```

Source: CS10 Case 545 (derivation and numeric example: MFB HF tip t_spin = 15.1 s at omega_0 = 600 rad/s). CS10 Case 555 (plastic-gen spin decay table).

**Slope correction:**

```
N_slope = m * g * cos(alpha)                    [REAL-WORLD]
d_omega/dt_slope = -(mu * N_slope * r_tip) / I  [REAL-WORLD]
```

Slope reduces spin decay by factor cos(alpha). At alpha = 30 deg: 21% reduction (CS10 Case 545).

**Normalization for engine stat:**

```
stamina_raw = I_total / (mu_tip * m * g * r_tip)    // seconds per rad/s
stamina_stat = normalize(stamina_raw, gen_min, gen_max, 0, 150)
```

### Control

**What it represents:** Movement pattern predictability, LAD (Life After Death), and orbital stability.

**Physics factors:**
- `r_tip` (mm): larger tip radius = wider movement pattern [REAL-WORLD]
- `tip_shape`: determines orbital behaviour (sharp = stationary, flat = aggressive, RF = flower pattern) [REAL-WORLD]
- `freeSpin`: bearing-decoupled tips reduce spin loss during orbital movement [REAL-WORLD]
- `LAD_duration = omega_release / (tau / I_combo)` [REAL-WORLD] (CS4 Case 207)

---

### Section 2b: Attack Types and Beyblade Terminology Physics

This section defines every official attack type, tip type, part role, and beyblade terminology.

#### Attack Types (ContactPoint.attackType)

| Attack Type | Real-World Physics | Force Direction | Primary Stat | Engine Mechanic | Notes |
|------------|-------------------|----------------|-------------|-----------------|-------|
| **Smash** | Lateral impact — horizontal momentum transfer at contact height. AR blade hits opponent's blade tangentially. | Lateral (outward from contact point) | Attack | `smashImpact` | Dominant Gen 1, Gen 4. High recoil on attacker. `[REAL-WORLD]` |
| **Upper** | Vertical lift — contact point strikes BELOW opponent's CoM, creating upward lever force. Destabilizes opponent by forcing tilt. | Upward + lateral | Attack + destabilize | `upperLaunch` | Requires CP `heightRange.max < h_CoM_opponent`. `[REAL-WORLD]` |
| **Absorb** | Low-recoil energy transfer — rubberized or angled surface deflects hit without bouncing. Attacker retains spin. | Deflected (tangential) | Defense / Stamina | `contactDeflect` | Rubber CPs, e=0.25 (low bounce). `[REAL-WORLD]` |
| **Burst** | Tab contact — hit on burst tab generates torque that overcounts ratchet teeth → burst. NOT a force type — it is a threshold-checking event. | Rotational torque | — | `subPartBurst` | Gen 3/4 only. `[REAL-WORLD]` |
| **Spin Steal** | Friction-driven angular momentum transfer. Rubber CP contacts defender in same-spin direction — friction decelerates defender, accelerates attacker. | Tangential friction | Stamina | `spinStealCoupling` | Countered by bearing tip (μ_effective ≈ 0). `[REAL-WORLD]` |

#### Part Role Terminology

| Term | Generation | Part Role in Engine | Mass Contribution | Contact Height |
|------|-----------|---------------------|-----------------|---------------|
| **AR (Attack Ring)** | Gen 1 Plastic | `attack_ring` — primary contact surface | 4–8 g | Face edges 12–24 mm `[CONFIRMED]` |
| **SAR (Sub Attack Ring)** | Gen 1 Plastic | `sub_part` on AR — secondary CP set | 2–5 g | Same as AR CPs |
| **WD (Weight Disk)** | Gen 1 Plastic | `weight_disk` — dominant inertia (52%+) | 10–18 g | Passive (no CPs on most) |
| **BB (Blade Base)** | Gen 1 Plastic | `tip` — tip + shaft height determines h_CoM | 3–8 g | Tip at floor h=0mm |
| **SG (Spin Gear)** | Gen 1 Plastic | `core` — spin direction + EG spring | 3–5 g | h≈14mm above floor |
| **Bit Chip** | Gen 1 Plastic | `bit_beast` — purely cosmetic | ~1 g | n/a |
| **HMS AR** | Gen 1 HMS | `attack_ring` — metal; highest contact mass | 12–16 g | 12–20 mm `[ESTIMATED]` |
| **RC (Running Core)** | Gen 1 HMS | `tip` — bottom of HMS stack | 1–3 g | h=0mm |
| **FW (Fusion Wheel)** | Gen 2 MFB | `attack_ring` equivalent — dominant mass (70% I) | 22–35 g | Depends on track height |
| **Spin Track** | Gen 2 MFB | `sub_part` — sets FW height (T125=12.5mm, 145=14.5mm) | 2–6 g | FW contact = track height + 3–13mm |
| **Layer** | Gen 3 Burst | `attack_ring` equivalent — blades project DOWN | 12–18 g | Blade contact 5–15mm `[ESTIMATED]` |
| **Forge Disc** | Gen 3 Burst | `weight_disk` — centroid 15–25mm | 15–22 g | Passive; burst engagement height |
| **Driver** | Gen 3 Burst | `tip` — same tip physics | 3–6 g | h=0mm |
| **DB Core / Armor** | Gen 3 DB | `core` or `sub_part` — High/Low mode swap (±7mm CoM) | varies | Config `heightRange` shifts |
| **Blade** | Gen 4 BX | `attack_ring` equivalent — largest mass (55%) | 33–60 g | 5–14mm `[CONFIRMED]` |
| **Ratchet** | Gen 4 BX | `sub_part` — height = last_two_digits / 10 `[CONFIRMED]` | 3.5–4.5 g `[INFERRED]` | Sets Blade height |
| **Bit** | Gen 4 BX | `tip` — Flat 2.3g, Ball 2.1g `[CONFIRMED]` | 2.1–2.3 g | h=0mm |

#### Contact Attack Terminology

| Term | Physics Meaning | When It Happens | Engine Implementation |
|------|----------------|-----------------|----------------------|
| **Ring Out (RO)** | Bey exits arena boundary | `v_radial > v_escape` at rim | Arena boundary detection `[REAL-WORLD]` |
| **Burst (BST)** | Layer separates from ratchet/base | Burst tab torque > ratchet resistance | `subPartBurst` mechanic `[REAL-WORLD]` |
| **OS (Outspin)** | Win by bey spinning longer | Opponent spin decays to zero first | `t_spin` comparison `[REAL-WORLD]` |
| **LAD (Life After Death)** | Bey continues spinning while fallen/tilted | Bearing tip decouples body from floor | `bearingFriction: 0.05`, `freeSpin: true` `[REAL-WORLD]` |
| **Self-KO** | Attacker launches itself out | High recoil + low CoM stability | `smashImpact` + recoil `[REAL-WORLD]` |
| **Tornado Stall** | Bey rides bowl wall at high orbit radius | Centripetal force from wall > gravity component | `orbitMovement` mechanic `[REAL-WORLD]` |
| **Sliding Shoot** | Launch technique — bey slides across floor to center | v_centre ~2.7 m/s vs ~1.4 m/s radial (CS10 Case 547) | Launcher `launchPosition` `[CONFIRMED]` |
| **Zombie** | Stamina bey wins via OS at very low spin | `bearingFriction = 0.05` → α ≈ 0 at low spin | `bearingFriction: 0.05` `[REAL-WORLD]` |
| **Same-Spin** | Both beys spin same direction | Spin steal maximized; friction acts strongly | `spinStealCoupling` enhanced `[REAL-WORLD]` |
| **Opposite-Spin** | Beys spin opposite directions | Collision physics dominate; spin steal near-zero | Collision physics `[REAL-WORLD]` |

#### Layer / Wheel Shape Terminology (Radial Profile → FourierRadialProfile)

| Shape Type | Harmonic Description | Examples | Best Attack Type |
|------------|---------------------|---------|-----------------|
| **Round** | a₀ dominant, all harmonics ≈ 0 | Libra FW, Circle WD | Stamina (no recoil points) |
| **3-Wing** | 3rd harmonic dominant | Pegasus AR, Lightning FW | Smash attack |
| **4-Wing / Cross** | 4th harmonic dominant | Meteo L-Drago, Draciel AR | Balanced smash |
| **Asymmetric** | 1st + 3rd harmonics | Upper Dragoon AR | Upper attack (one heavy side) |
| **Star / Multi-point** | High-n harmonics (n=6,8) | Star AR, Eight Spiker | Barrage / multi-hit |

---

### Section 2c: Per-Generation Part Implementation Guide

#### Gen 1 Plastic AR (Attack Ring)

**Physics:** Contact at h = 12–24mm (face edges, NOT centroid at 28–36mm). Multi-contact-point geometry. `[CONFIRMED]`

**Engine implementation:**
- Multiple `ContactPoint`s on the AR, each with `heightRange: { min: 12, max: 24 }`
- `FourierRadialProfile` for radial shape (3-wing AR → dominant 3rd harmonic)
- For Upper Attack AR: `attackType: "upper"`, `heightRange.min ≈ 18–24`
- For Smash AR: `attackType: "smash"`, `heightRange: { min: 12, max: 16 }`
- SAR (Sub Attack Ring): SubPart with `mode: "fixed"` or `mode: "partial_slip"`

#### Gen 1 Weight Disk

**Physics:** Dominant inertia contributor (52%+). Wide WD (r=25mm) > Heavy WD for stamina despite lower mass. `[CONFIRMED]`

**Engine implementation:**
- `PartLayer: "wd"`, radial geometry via `FourierRadialProfile`
- For magnetic WD: add `magneticPull` mechanic with `attractMode: true`
- No ContactPoints needed on most WDs (passive mass)

#### Gen 1 Blade Base / Tip

**Physics:** Tip position sets h_CoM via SG height. SG Metal Sharp Base raises stack by +6mm. `[CONFIRMED]`

**Engine implementation:**
- Sharp: `tipShape: "sharp"`, `material: "abs"`, `gripFactor: 0.06` (μ=0.17, point contact)
- Metal Sharp: `tipShape: "sharp"`, `material: "metal"`, `gripFactor: 0.04` (μ=0.12)
- Flat: `tipShape: "flat"`, `material: "abs"`, `gripFactor: 0.25`
- CEW/EWD: `bearingFriction: 0.12` `[CONFIRMED]`
- B:D/Bearing: `bearingFriction: 0.05` `[CONFIRMED CS10]`

#### Gen 2 MFB Fusion Wheel

**Physics:** Dominant mass (70% of I). Track height encodes contact height. 145 track → FW contact at 17–28mm. `[CONFIRMED]`

**Engine implementation:**
- `PartLayer: "ar"` (Fusion Wheel = attack ring equivalent)
- CPs with `heightRange: { min: h_track + 3, max: h_track + 13 }`
- Spin Track modeled as SubPart shifting height stack
- Metal material: `material: "metal"`, high damage, low spinSteal

#### Gen 3 Burst Layer

**Physics:** Blades project DOWNWARD. Contact at 5–15mm (not Layer centroid 25–35mm). Burst tabs at Layer centroid. `[ESTIMATED]`

**Engine implementation:**
- Layer CPs: `heightRange: { min: 5, max: 15 }`, `attackType` varies
- Burst tab CPs: `attackType: "burst"` at height 20–30mm (ratchet engagement)
- DB System High/Low: `configurations` with two modes, auto-triggered
  - High Mode: `heightRange` shifts +7mm on Layer CPs
  - Low Mode: default

#### Gen 4 BX Blade

**Physics:** Near-floor contact (5–14mm). Xtreme Line engagement at h=0mm. `[CONFIRMED]`

**Engine implementation:**
- Blade CPs: `heightRange: { min: 5, max: 14 }`, `attackType: "smash"` dominant
- Xtreme Line CP: `heightRange: { min: 0, max: 3 }`, `material: "metal"`
- Ratchet: height = `last_two_digits / 10` `[CONFIRMED]`
- Flat Bit 2.3g, Ball Bit 2.1g `[CONFIRMED]`

---

### Section 2d: Launcher Mechanics Summary

Based on Cases 578–585 (appended to CS10).

| Launcher Type | ω₀ (rad/s) | Key Formula | Source |
|--------------|-----------|-------------|--------|
| String | 1714 | `ω₀ = v_pull / r_shaft` (r_shaft ≈ 1.75mm, v_pull = 3.0 m/s) | `[CONFIRMED]` |
| Gear/Winder | 2571 | `ω₀_gear = G × v_pull / r_shaft` (G ≈ 1.8–2.5) | `[INFERRED]` |
| BeyLauncher LR | 3771 | G ≈ 2.2 typical | `[INFERRED]` |
| BX Xtreme | 4800 | G_eff ≈ 2.8, highest achievable ω₀ | `[CONFIRMED CS10]` |

**Launch tilt:** h_contact shift = r_bey × sin(θ). At θ=30°, r=20mm → Δh = 10mm downward. `[REAL-WORLD]`

**Power percentage:** t_spin ∝ power_pct (linear). 150% power = 1.5× spin life. `[REAL-WORLD]`

**Spin steal × launch × bearing:** Full formula: steal = rawSteal × spinStealFactor × (1/spinStealResist) × bearingFriction. B:D defender: steal ≈ 0. `[REAL-WORLD]`

**First-hit recoil:** Δv_attacker = −(1+e) × m_def/(m_att+m_def) × v_rel. ABS e=0.70: Δv = −2.55 m/s. Rubber e=0.25: Δv = −1.875 m/s (26% less bounce). `[REAL-WORLD]`

---

## Section 3: Material Profile Table

All values cross-verified across CS1--CS10. The `frictionMult` column is the engine multiplier relative to ABS baseline.

| Material | mu_k (real) | Tag | Engine frictionMult | gripMult | decayMod | COR (e) | Tag |
|----------|-------------|-----|---------------------|----------|----------|---------|-----|
| Hard ABS | 0.17 | [CONFIRMED CS10 Case 551] | 1.00 (baseline) | 1.0 | 1.0 | 0.65--0.70 | [CONFIRMED CS10] |
| Rubber | 0.50 | [CONFIRMED CS10 Case 545] | 2.94 | 2.8 | 1.3 | 0.25 | [CONFIRMED CS10] |
| Metal (zinc/steel) | 0.12 | [CONFIRMED CS3 Case 119] | 0.71 | 0.3 | 0.9 | 0.80 | [CONFIRMED CS10] |
| Old Plastic (gen-1) | 0.10 | [CONFIRMED CS1] | 0.59 | 0.8 | 0.95 | 0.60 | [ESTIMATED] |
| POM | 0.12 | [CONFIRMED CS4 Case 231] | 0.71 | 0.5 | 0.85 | 0.55 | [ESTIMATED] |
| PC (polycarbonate) | 0.15 | [ESTIMATED] | 0.88 | 0.9 | 0.95 | 0.60 | [ESTIMATED] |
| Bearing B:D | 0.05 | [CONFIRMED CS10 Case 551] | 0.29 | -- | -- | 0.80 | [ESTIMATED] |
| EWD / CEW sleeve | 0.12 | [CONFIRMED CS1 line 2298] | 0.71 | -- | -- | 0.55 | [ESTIMATED] |
| ABS on ABS (body) | 0.15 | [CONFIRMED CS10 style rules] | 0.88 | -- | -- | 0.65 | [CONFIRMED CS10] |

**Derivation:** frictionMult = mu_material / mu_ABS = mu_material / 0.17 [CONFIRMED CS10]

**Key corrections from case studies:**
- The 0.30 value assigned to rubber in CS1 is **restitution (e)**, NOT friction (mu). Rubber mu_k = 0.50. [CONFIRMED CS10]
- CS1 values 0.85 (rubber) and 0.70 (metal) are **restitution** coefficients, NOT kinetic friction. [CONFIRMED CS10]
- B:D bearing mu = 0.005 from CS1 is the **theoretical ideal**; real B:D = 0.05. [CONFIRMED CS10]

**Material elastic properties** (for Hertzian contact calculations):

| Material | E (GPa) | rho (kg/m^3) | nu (Poisson) | Tag |
|----------|---------|--------------|-------------|-----|
| ABS | 2.3 | 1050 | 0.35 | [CONFIRMED CS8 style rules] |
| PC | 2.4 | 1200 | 0.37 | [CONFIRMED CS8 style rules] |
| Zinc alloy | 100 | 6600 | 0.25 | [CONFIRMED CS8 style rules] |
| Rubber | 0.002 | 1200 | 0.49 | [CONFIRMED CS8 style rules] |

---

## Section 4: Tip Type Reference

Complete table of tip types with physics values, sourced from CS1 (tip profile definitions), CS10 (confirmed friction), and CS4 (POM/bearing tips).

### Standard Tip Types

| Tip Type | Material | mu_k | r_tip (mm) | Profile | heightProfile | Tag |
|----------|----------|------|-----------|---------|---------------|-----|
| Sharp (S) | ABS | 0.17 | 0.5 | Point + steep cone | flat | [CONFIRMED] |
| Semi-Flat (SF) | ABS | 0.17 | 2.0 | Flat disc + gentle cone | spline | [CONFIRMED] |
| Flat (F) | ABS | 0.17 | 6.0 | Wide flat disc | flat | [CONFIRMED] |
| Hole Flat (HF) | ABS | 0.17 | 6.0 | Wide flat with central hole | flat | [CONFIRMED] |
| Wide Flat (WF) | ABS | 0.17 | 8.0 | Extra-wide flat disc | flat | [CONFIRMED] |
| Defense (D) | ABS | 0.17 | 3.0 | Ball-rounded tip | flat | [CONFIRMED] |
| Ball (B) | ABS | 0.17 | 2.0 | Hemispherical ball | flat | [CONFIRMED] |
| Wide Defense (WD) | ABS | 0.17 | 4.0 | Wide ball | flat | [CONFIRMED] |
| Rubber Flat (RF) | Rubber | 0.50 | 8.0--10.0 | Wide flat rubber disc | flat | [CONFIRMED] |
| Rubber Ball (RB) | Rubber | 0.50 | 3.0 | Rubber hemisphere | flat | [CONFIRMED] |
| Metal Sharp (MS) | Metal | 0.12 | 0.3 | Metal spike point | flat | [CONFIRMED] |
| Metal Change (MC) | Metal | 0.12 | 0.6--2.0 | Metal sharp with mode change | flat | [CONFIRMED] |
| Bearing B:D | Steel | 0.05 | 1.5--3.0 | Free-spin ball bearing | flat | [CONFIRMED] |
| EWD | Plastic | 0.12 | 2.0 | Eternal Wide Defense sleeve bearing | flat | [CONFIRMED] |
| Quake (Q) | ABS | 0.17 | 6.0 | Slanted frustum-cylinder cam | cam | [CONFIRMED CS1 Case 14] |
| POM Sharp (CEW LS) | POM | 0.12 | 0.6 | POM change tip | flat | [CONFIRMED CS4 Case 231] |

### BX Generation Bits

| Bit Type | Material | mu_k | r_tip (mm) | Profile | Tag |
|----------|----------|------|-----------|---------|-----|
| Ball (BX) | ABS | 0.17 | 2.0 | Standard ball | [ESTIMATED] |
| Flat (BX) | ABS | 0.10 | 3.0 | Polished flat | [CONFIRMED CS10 Case 564] |
| Rush (BX) | Rubber | 0.50 | 4.0 | Rubber flat | [ESTIMATED] |
| Needle (BX) | Metal | 0.12 | 0.3 | Metal needle point | [ESTIMATED] |
| Free Ball (FB) | Steel | 0.05 | 2.0 | Free-spin ball bearing | [INFERRED from CS8] |

### Spin Decay Reference Table

Using the standard formula `alpha = (mu * m * g * r_tip) / I_total`:

| Tip Type | mu | r_tip (mm) | Representative I (kg*m^2) | m (kg) | alpha (rad/s^2) | t_spin at omega_0=600 (s) | Source |
|----------|----|-----------|--------------------------|--------|-----------------|--------------------------|--------|
| Sharp (Plastic gen) | 0.10 | 0.8 | 3.8e-6 | 0.022 | 4.55 | 54.9 (at omega_0=250) | [CS10 Case 555] |
| Flat (Plastic gen) | 0.15 | 3.0 | 3.8e-6 | 0.022 | 25.6 | 9.8 (at omega_0=250) | [CS10 Case 555] |
| Ball (Plastic gen) | 0.13 | 2.0 | 3.6e-6 | 0.021 | 15.2 | 16.4 (at omega_0=250) | [CS10 Case 555] |
| Bearing B:D (Plastic) | 0.04 | 1.5 | 3.9e-6 | 0.023 | 3.56 | 70.2 (at omega_0=250) | [CS10 Case 555] |
| Hard Flat (MFB) | 0.17 | 6.0 | 7.3e-6 | 0.029 | 39.8 | 15.1 | [CS10 Case 545] |
| Rubber Flat (MFB) | 0.50 | 8.0 | 7.3e-6 | 0.029 | 156 | 3.85 | [CS10 Case 545] |
| Flat D (BX) | 0.10 | 3.0 | 3.3e-5 | -- | 6.87 | 290 (at omega_0=2000) | [CS10 Case 564] |
| Sharp S (BX) | 0.10 | 0.8 | 3.3e-5 | -- | 1.83 | 1090 (at omega_0=2000) | [CS10 Case 564] |

---

## Section 5: Contact Height Compatibility

Contact height determines whether two beyblades from different generations can physically strike each other. Heights measured from the stadium floor.

### Contact Height Ranges by Generation

| Generation | Component | Contact Height Range (mm above floor) | Source |
|-----------|-----------|--------------------------------------|--------|
| Gen 1 Plastic | AR (face edges) | 12--24 | [CONFIRMED CS7, CS8] |
| Gen 1 Plastic | AR (centroid) | 28--36 | [CONFIRMED CS7] |
| Gen 1 Plastic | WD (outer edge) | 8--14 | [ESTIMATED] |
| Gen 1 HMS | AR (metal frame) | 10--20 | [ESTIMATED] |
| Gen 2 MFB | Fusion Wheel (145 track) | 17--28 | [INFERRED from track height] |
| Gen 2 MFB | Fusion Wheel (85 track) | 11--22 | [INFERRED from track height] |
| Gen 3 Burst (early) | Layer | 5--15 | [ESTIMATED] |
| Gen 3 Burst (DB/BU) | Layer (Low mode) | 5--13 | [ESTIMATED] |
| Gen 3 Burst (DB/BU) | Layer (High mode) | 13--21 | [ESTIMATED] |
| Gen 4 BX | Blade | 5--14 | [ESTIMATED] |

### Cross-Generation Contact Matrix

| Attacker | Defender | Overlap Range (mm) | Contact? | Notes |
|----------|----------|-------------------|----------|-------|
| Gen 1 AR (12--24) | Gen 1 AR (12--24) | 12--24 | Full overlap | Same generation |
| Gen 1 AR (12--24) | Gen 2 MFB 145 (17--28) | 17--24 | Partial (7 mm) | Upper AR hits lower MFB wheel |
| Gen 1 AR (12--24) | Gen 3 Layer (5--15) | 12--15 | Partial (3 mm) | Minimal overlap; AR underside only |
| Gen 2 MFB 145 (17--28) | Gen 4 BX (5--14) | -- | No overlap | MFB contact zone above BX blade entirely |
| Gen 2 MFB 85 (11--22) | Gen 4 BX (5--14) | 11--14 | Partial (3 mm) | Only low-track MFB contacts BX |
| Gen 3 Layer (5--15) | Gen 4 BX (5--14) | 5--14 | Nearly full | Contemporary generations align |
| Gen 1 AR (12--24) | Gen 4 BX (5--14) | 12--14 | Minimal (2 mm) | Barely compatible |

**Critical note:** AR contact height is 12--24 mm (face edges), NOT 28--36 mm (centroid height). The centroid is the structural centre of the AR; the contact faces project downward from it. [CONFIRMED CS7, CS8 common errors section]

---

## Section 6: Engine Mechanic Mapping

The engine's MechanicRegistry has 31+ registered handlers. Below is the mapping from real-world physics gimmicks to engine mechanic compositions.

### Free-Spin / LAD (Life After Death)

**Real-world:** Bearing tips (B:D, SG Bearing Version 2) decouple the tip from the bey body, allowing precession orbit after primary spin depletes.

**Engine mechanics:**
```
freeSpin: true
bearingFriction: 0.05              [CONFIRMED CS10]
tipShape: 'sharp' or 'ball'
LAD_duration = omega_release / (tau_bearing / I_combo)   [REAL-WORLD CS4 Case 207]
```

Source: CS1 line 2274 (freeSpin boolean), CS4 Case 207 (LAD duration formula), CS10 Case 551 (bearingFriction = 0.05).

### Spring Wind / Engine Gear Burst

**Real-world:** EG spring stores angular momentum, releases at trigger threshold, boosting spin mid-match.

**Engine mechanics:**
```
energyReserve: { type: 'spring', k: 1500, E: 0.048 }   [CONFIRMED CS10 Case 555/556]
velocityBurst: { delta_omega: computed_from_spring }
springRecoil: { tau_burst, t_release }
triggerCondition: 'spin_threshold' or 'impact' or 'timer'
```

Spring energy E = 48 mJ [CONFIRMED CS10 Case 556]. Spring constant k = 1500 N/m [CONFIRMED CS10 Case 555].

### Mode Switch (F:D, Height Change)

**Real-world:** Centrifugal force overcomes spring at a critical RPM, switching tip geometry (sharp to flat or vice versa).

**Engine mechanics:**
```
modeSwitch: true
spinThresholdSwitch: { omega_crit: 94.3 }    [CONFIRMED CS10 Case 557]
tipProfileA: { ... }    // high-speed mode
tipProfileB: { ... }    // low-speed mode
```

F:D mode-switch threshold omega = 94.3 rad/s [CONFIRMED CS10 Case 557].

Source: CS9 (modeSwitchCriticalSpeed function).

### Rubber Orbital / Flower Pattern

**Real-world:** High-friction rubber tips create flower-petal orbital patterns from the combination of translational grip and spin.

**Engine mechanics:**
```
tipShape: 'rubber_flat'
rubberGrip: { mu: 0.50 }                     [CONFIRMED CS10]
orbitMovement: { pattern: 'flower', petal_count: 'emergent' }
```

**Critical:** Do NOT hardcode petal counts. Petal count is emergent from RPM x bowl depth x grip. [CONFIRMED CS10 common errors]

### Metal Frame / Sliding Frame

**Real-world:** Free-spinning metal frame on a bearing, with detent-lock positions. Frame absorbs recoil independently of inner spin axis.

**Engine mechanics:**
```
slidingFrame: true
frame: { I_frame, omega_frame, bearingFriction, detentCount }
coupling: tau_coupling = bearingFriction * slip * I_frame
```

Source: CS1 (MetalFrameState definition, line 2741), CS5 (MFB fusion wheel frame mechanics).

### CWD / Free-Spin Weight Disk

**Real-world:** Weight disk on a bearing that spins independently (e.g., CWD Chain Attacker).

**Engine mechanics:**
```
freeSpin: true     // on WD, not tip
bearingFriction: 0.08    [ESTIMATED CS1 line 10950]
I_CWD: separate from I_main
tau_coupling = bearingFriction * (omega_main - omega_CWD) * I_CWD
```

Source: CS1 Case (CWD Chain Attacker: 17 g with 9 spikes, bearingFriction ~ 0.08).

### Magnacore / Magnetic Attraction

**Real-world:** Embedded magnet interacts with magnetic stadium floor, pulling bey toward centre.

**Engine mechanics:**
```
magnetForce: { F_at_3mm: 0.40 }              [ESTIMATED CS10 Case 554]
falloff: 'inverse_square'
interactionTarget: 'floor_magnet'
```

Source: CS10 Case 554 (pull-test: F = 0.40 N at 3 mm gap).

---

## Section 7: Variable Height Tip (heightProfile)

The `heightProfile` field on the TipPart describes how the tip's contact surface varies with rotation angle. This determines whether the bey experiences periodic vertical forcing (cam/jumping behaviour).

### Profile Types

| heightProfile | Description | Real-World Example | deltaH (mm) | Tag |
|--------------|-------------|-------------------|-------------|-----|
| `flat` | Uniform contact; no vertical variation. Revolution-symmetric flat or pointed surface. | Sharp (S), Flat (F), Ball (B), Metal Sharp (MS), B:D | 0 | [REAL-WORLD] |
| `spline` | Revolution-symmetric but non-flat. Smooth radial cross-section generates gentle height variation when tilted. | Semi-Flat (SF), Defense (D) | 0--0.3 | [REAL-WORLD] |
| `slant` | Non-revolution-symmetric. Contact edge runs diagonally across the tip body, creating asymmetric height at different rotation angles. | BX Quake Bit (12 deg cut) | 0.5--1.5 | [REAL-WORLD] |
| `cam` | Frustum-cylinder transition edge. The contact point transitions between the narrow frustum tip and the wider cylinder rim once per revolution, creating a cam mechanism that produces periodic vertical forcing at spin frequency. | Storm Capricorn M145Q (Q tip) | 0.8--1.6 | [CONFIRMED CS1 Case 14] |

### Q Tip Cam Mechanism (CS1 Case 14)

The Q tip is NOT a simple ellipse. It is a tip whose contact edge runs diagonally from the frustum (tapered cone, LOW and narrow) to the cylinder (straight body, HIGH and wide). This slant IS the mechanism.

```
deltaH = mountOffset * sin(slantAngle)
```

Where:
- `mountOffset` = 1.5 mm (mode 1) or 2.5 mm (mode 2) [CONFIRMED CS1 Case 14]
- `slantAngle` = 15 deg [CONFIRMED CS1 Case 14]

At mode 1: deltaH = 1.5 * sin(15 deg) = 0.388 mm [INFERRED]
At mode 2: deltaH = 2.5 * sin(15 deg) = 0.647 mm [INFERRED]

The cam produces vertical oscillation at spin frequency. When the bey is tilted or off-axis, the frustum-to-cylinder transition causes periodic bouncing (jumping behaviour). The mechanism is intrinsic to the tip geometry and does not require wall contact or opponent impact.

### Engine Implementation

```typescript
function resolveActiveLayer(profile: TipProfile, tiltAngle: number): TipLayer {
  // Floor plane cuts through tip at current tilt angle.
  // Layer whose outer edge first contacts the floor is active.
  const sinTilt = Math.sin(tiltAngle * DEG2RAD);
  for (const layer of profile.layers) {
    const tiltDrop = layer.outerRadius * sinTilt;
    if (tiltDrop >= layer.outerZ) {
      return layer;  // this layer contacts floor at this tilt
    }
  }
  return profile.layers[profile.layers.length - 1];
}

function tickTipPhysics(bey: BeyState, dt: number) {
  const activeLayer = resolveActiveLayer(bey.tipProfile, bey.tiltAngle);
  const deltaH = bey.tipProfile.mountOffset
    * Math.sin(bey.tipProfile.slantAngle * DEG2RAD);
  // Use activeLayer.friction for spin decay
  // Use deltaH for vertical cam model
}
```

Source: CS1 lines 2048--2078 (resolveActiveLayer and tickTipPhysics).

---

## Section 8: Value Tagging Convention

Every numeric value in the case studies and in engine parameter files must carry one of these tags:

| Tag | Meaning | Usage |
|-----|---------|-------|
| `[CONFIRMED]` | Directly measured or confirmed by cross-verified case study physics (CS1--CS10) | Primary data: tip friction, spring constants, bearing coefficients |
| `[FACT]` | Sourced from wiki spec, confirmed part weight, or official product data | Part weights, dimensions from official sources |
| `[INFERRED]` | Derived from formula using confirmed inputs; derivation shown | Spin life, torque, force decomposition |
| `[ESTIMATED]` | Image-based measurement or approximation; no primary source | Contact heights from photos, radii from visual inspection |
| `[ILLUSTRATIVE]` | Model value, not measured; used for conceptual examples only. Do NOT use for real analyses | CS1 early illustrative friction values |
| `[CUSTOM BUILD]` | Aftermarket or non-standard combo, not a factory part | Modified assemblies |
| `[ANIME/GAME]` | Intentionally non-realistic behaviour for gameplay balance | Engine stat multipliers, damage formulas, game-specific constants |

### When to Use Each Tag

- **Engine stat formulas** (damageMultiplier, spinDecayRate, maxSpin) are always `[ANIME/GAME]` because they are game-balance values, not physics.
- **Material properties** (mu_k, COR, elastic modulus) are `[CONFIRMED]` when cross-verified across multiple case studies.
- **Generational mass/radius ranges** are `[REAL-WORLD]` (sourced from actual product measurements) but individual values within those ranges may be `[FACT]` (wiki) or `[ESTIMATED]` (image).
- **Spin life calculations** are `[INFERRED]` because they derive from confirmed inputs via the spin decay formula.

---

## Section 9: Common Errors to Avoid

This section catalogues specific numeric errors that have appeared in earlier case studies or engine code. Every entry includes the wrong value, the correct value, and the source of correction.

### Friction Coefficient Errors

1. **ABS tip friction is NOT 0.5 or 0.8.**
   - Wrong: mu = 0.8 (sharp), 0.5 (flat) [CS1 illustrative values]
   - Correct: mu_k = 0.17 for ALL hard ABS tips (sharp, flat, semi-flat, hole-flat, defense, ball) [CONFIRMED CS10 Case 551]

2. **Rubber friction is NOT 0.85 or 0.9.**
   - Wrong: mu = 0.85 (CS1), 0.9 (CS9) [ILLUSTRATIVE]
   - Correct: mu_k = 0.50 for rubber tips (RF, RB, rubber flat) [CONFIRMED CS10 Case 545]

3. **B:D bearingFriction is NOT 0.02 or 0.005.**
   - Wrong: mu = 0.005 (CS1 theoretical ideal), 0.02 (CS1 line 2298 code)
   - Correct: mu = 0.05 for real B:D ball bearing [CONFIRMED CS10 Case 551]
   - Note: 0.005 was the theoretical frictionless ideal; 0.02 was a code-level approximation. Both are too low.

4. **Metal tip friction is NOT 0.17 (same as ABS).**
   - Wrong: treating metal as same friction as ABS
   - Correct: mu_k = 0.12 for metal tips (MS, metal sharp, metal change) [CONFIRMED CS3 Case 119]

### Restitution vs Friction Conflation

5. **The 0.30 value for rubber in CS1 is restitution (e), NOT friction.**
   - CS1 table row: `rubber | 0.30 | HIGH | spin-steal via friction`
   - 0.30 is the COR (restitution). Rubber mu_k = 0.50, e = 0.25.
   - The 0.85/0.70/0.30 column in CS1's contact material table is entirely restitution, not friction. [CONFIRMED CS10]

### Geometry Errors

6. **AR contact height is 12--24 mm (face edges), NOT 28--36 mm (centroid).**
   - The centroid is the mass centre of the AR structure. Contact faces project downward from the centroid. The actual collision zone where an AR strikes an opponent is at 12--24 mm above the stadium floor. [CONFIRMED CS7, CS8]

7. **Do NOT hardcode petal counts for orbital tips.**
   - Flower-petal movement patterns are emergent from RPM x bowl depth x grip. The number of petals changes dynamically as spin speed decreases. [CONFIRMED CS10]

### Formula Errors

8. **Spin decay uses kinetic friction (mu_k), not static friction (mu_s).**
   - The tip is always sliding against the floor during spin. Use mu_k exclusively.

9. **Annular disk inertia is I = (1/2) * m * (r_i^2 + r_o^2), NOT I = (1/2) * m * r^2.**
   - The solid disk formula (I = 1/2 * m * r^2) only applies when r_i = 0. For any ring or wheel with an inner cutout, use the annular formula. [CONFIRMED CS8 style rules]

10. **EG spring energy is 48 mJ, NOT 48 J.**
    - The spring is small (k = 1500 N/m, compressed ~8 mm). E = 0.5 * 1500 * 0.008^2 = 0.048 J = 48 mJ. [CONFIRMED CS10 Case 556]

---

## Section 10: Implementation Priority

Status of engine features relative to case study findings.

### P0: Critical Corrections (Done)

| Feature | Status | Source |
|---------|--------|--------|
| frictionMult corrections (ABS = 1.0, rubber = 2.94, metal = 0.71) | Done | CS10 |
| bearingFriction = 0.05 for B:D | Done | CS10 Case 551 |
| heightProfile type field on TipPart | Done | CS1 Case 14 |
| COR corrections (rubber e = 0.25, ABS e = 0.65--0.70, metal e = 0.80) | Done | CS10 |

### P1: High Priority (Done)

| Feature | Status | Source |
|---------|--------|--------|
| heightProfile in resolveTipStats (flat/spline/slant/cam routing) | Done | CS1 Case 14 |
| Tip profile layer resolver (resolveActiveLayer) | Done | CS1 lines 2048--2078 |
| Spin decay formula: alpha = (mu * m * g * r_tip) / I_total | Done | CS10 Case 545 |
| Contact face angle decomposition (smash/recoil) | Done | CS8 Case 375 |

### P2: Medium Priority (Pending)

| Feature | Status | Source | Notes |
|---------|--------|--------|-------|
| Generational normalization (stat ranges per gen) | Pending | Section 1 | Requires gen-tagged parts in seed data |
| Cross-gen contact height validation | Pending | Section 5 | Height overlap check at collision time |
| Mode switch (F:D omega threshold) | Pending | CS10 Case 557 | omega_crit = 94.3 rad/s |
| Slope spin decay correction (cos(alpha) factor) | Pending | CS10 Case 545 | Arena bowl slope affects decay rate |

### P3: Low Priority (Pending)

| Feature | Status | Source | Notes |
|---------|--------|--------|-------|
| Correct heightRange on all seeded AR/WD contact points | Pending | Section 5 | AR: 12--24 mm, WD: 8--14 mm |
| CWD / free-spin WD mechanic | Pending | CS1 | tau_coupling model |
| Magnacore force model (inverse square falloff) | Pending | CS10 Case 554 | F = 0.40 N at 3 mm |
| EG spring burst with trigger conditions | Pending | CS10 Case 555/556 | k = 1500 N/m, E = 48 mJ |
| Q tip cam vertical forcing | Pending | CS1 Case 14 | deltaH from mountOffset x sin(slantAngle) |
| Metal frame sliding/detent model | Pending | CS1 | MetalFrameState physics |

---

## Appendix A: Quick-Reference Formulas

All formulas used in the engine, consolidated for reference.

```
SPIN DECAY:
  d_omega/dt = -(mu * m * g * r_tip) / I_total                    [REAL-WORLD]
  t_spin = (I_total * omega_0) / (mu * m * g * r_tip)             [REAL-WORLD]

ANNULAR INERTIA:
  I = 0.5 * m * (r_inner^2 + r_outer^2)                           [REAL-WORLD]

GYROSCOPIC STABILITY:
  omega_stable = sqrt(m * g * h_CoM / I_total)                    [REAL-WORLD]

CONTACT IMPULSE:
  J = m_eff * delta_v * (1 + e)                                   [REAL-WORLD]
  delta_omega = J * r_contact / I_opponent                         [REAL-WORLD]

SMASH / RECOIL DECOMPOSITION:
  F_smash  = F_impact * cos(phi)                                   [REAL-WORLD]
  F_recoil = F_impact * sin(phi)                                   [REAL-WORLD]

SLOPE GRAVITY:
  g_lateral = g * sin(alpha)                                       [REAL-WORLD]
  N_slope = m * g * cos(alpha)                                     [REAL-WORLD]

CAM VERTICAL FORCING (Q tip):
  deltaH = mountOffset * sin(slantAngle)                           [REAL-WORLD]

LAD DURATION (free-spin):
  t_LAD = omega_release / (tau_bearing / I_combo)                  [REAL-WORLD]

FRICTION MULTIPLIER:
  frictionMult = mu_material / mu_ABS = mu_material / 0.17         [REAL-WORLD]

ENGINE STAT FORMULAS:
  damageMultiplier = 1.0 + attack * 0.007                          [ANIME/GAME]
  damageReduction  = 1.0 - defense * 0.003                         [ANIME/GAME]
  spinDecayRate    = 8 * (1 - stamina * 0.001)                     [ANIME/GAME]
  maxSpin          = 2000 * (1 + stamina * 0.0008)                 [ANIME/GAME]

CENTRIFUGAL MODE SWITCH:
  F_centrifugal = m_arm * omega^2 * r_arm                          [REAL-WORLD]
  omega_crit = sqrt(F_spring / (m_arm * r_arm))                    [REAL-WORLD]

BEARING SPIN STEAL:
  delta_omega_loss = bearingFriction * N * r_bearing / I_self      [REAL-WORLD]

HERTZIAN CONTACT:
  a = (3 * W * R / (4 * E_star))^(1/3)                            [REAL-WORLD]
  1/E_star = (1 - nu1^2)/E1 + (1 - nu2^2)/E2                     [REAL-WORLD]
```

---

## Appendix B: Case Study Index

| CS | File | Scope | Key Constants Introduced |
|----|------|-------|------------------------|
| CS1 | 1 case study.md | MFB tip profiles, tip physics, CWD, metal frame, free-spin | TipProfile, TipLayer, freeSpin, bearingFriction, CWD |
| CS2 | 2 case study.md | Plastic-gen part analysis (AR, WD, SG, BB) | AR geometry, WD inertia, SG variants |
| CS3 | 3 case study.md | HMS and cross-gen analysis | Metal mu_k = 0.12 (Case 119), HMS dimensions |
| CS4 | 4 case study.md | EG system, CEW, LAD physics, plastic-gen gimmicks | EG burst, POM mu = 0.12, LAD formula |
| CS5 | 5 case study.md | MFB Fusion Wheels, contact geometry | Smash/recoil decomposition, stress analysis |
| CS6 | 6 case study.md | MFB Chrome Wheels, 4D system | Chrome Wheel inertia, gravity well |
| CS7 | 7 case study.md | Burst layers (Cho-Z through DB) | Layer I dominance, contact height correction |
| CS8 | 8 case study.md | BX Blades, Ratchets, Bits | Shark Edge system, burst threshold, BX I budget |
| CS9 | 9 case study.md | Burst multi-lineage, mode switch | modeSwitchCriticalSpeed, DB High/Low mode |
| CS10 | 10 case study.md | Arena mechanics, stadium physics | All confirmed friction values, spring constants, arena zones |

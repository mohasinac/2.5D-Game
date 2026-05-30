# BEYBLADE MASTER REFERENCE DOCUMENT

**Source:** All 15 Case Studies (CS1–CS14) + MASTER ANALYSIS + oart list.md + external web sources (see Appendix C)  
**Naming convention:** All names follow Takara Tomy Japan (TT JP) canonical names. Hasbro names appear only as cross-references marked `[Hasbro: xyz]`.  
**Material default rule:** Any part whose material is not explicitly stated is manufactured from ABS plastic. Metal parts are explicitly noted.  
**Scope:** Takara Tomy Japan releases. Hasbro versions excluded from Gen 2 4D System onward.

---

## VALUE TAGGING CONVENTION

Every numeric value in this document carries one of these tags:

| Tag | Meaning |
|-----|---------|
| `[CONFIRMED]` | Directly measured or confirmed by cross-verified case study physics (CS1–CS10) |
| `[FACT]` | Sourced from wiki spec, confirmed part weight, or official product data |
| `[INFERRED]` | Derived from formula using confirmed inputs; derivation shown |
| `[ESTIMATED]` | Image-based measurement or approximation; no primary source |
| `[ILLUSTRATIVE]` | Model value, not measured; used for conceptual examples only |
| `[CUSTOM BUILD]` | Aftermarket or non-standard combo, not a factory part |
| `[ANIME/GAME]` | Intentionally non-realistic behaviour for gameplay balance |

---

# PART I: CORE CONCEPTS AND PHYSICS FUNDAMENTALS

---

## 1.1 Physics Chain Overview

A beyblade is a rigid spinning top in contact with a stadium floor. Its motion is governed by four interdependent physics domains:

1. **Spin decay** — friction between tip and floor consumes angular momentum over time
2. **Contact impulse** — collisions between beyblades exchange linear and angular momentum
3. **Gyroscopic stability** — high spin rate resists tipping; low spin rate enables wobble
4. **Orbital movement** — floor geometry + tip grip govern translational path

### Case 1 — Hit to a Freely Suspended Body

Force through the centre of mass → pure translation, no spin.  
Force off-centre at radius r → translation + rotation.

```
Impulse J = F·Δt
Linear:   Δv = J / m
Angular:  Δω = J × r_cp / I      (r_cp = lever arm from spin axis)
```

### Case 2 — Hit to a Body Already in Motion

Velocities add as vectors. Pre-existing momentum is not zeroed.

```
v_new = v_old + Δv_impact
KE_new = ½m|v_new|²
```

### Case 3 — The Gyroscope Effect

A spinning top resists tipping via gyroscopic rigidity. The same torque that topples a non-spinning body causes precession in a spinning one.

```
Gyroscopic precession:
  Ω_p = τ / (I × ω)          [REAL-WORLD]

Direction: τ ⊥ L → Ω_p ⊥ both
```

High spin → slow precession (stable). Low spin → fast precession (wobble onset).

### Case 4 — Contact Points (CPs) and Attack Force

Contact points are raised protrusions at radius r_cp from the spin axis. A lateral hit at a CP generates both translational and rotational impulses on the opponent.

```
Torque on opponent spin axis:
  τ_opponent = r_cp × F_impact     [REAL-WORLD]
  Δω_opponent = J × r_contact / I_opponent   [REAL-WORLD]
```

---

## 1.2 Spin Decay — Stamina Physics

### Master Formula

```
dω/dt = −(μ_k × m × g × r_tip) / I_total     [REAL-WORLD]

Spin life:
  t_spin = (I_total × ω₀) / (μ_k × m × g × r_tip)   [REAL-WORLD]
```

Where:
- `μ_k` = kinetic friction coefficient of tip material on ABS floor
- `m` = total beyblade mass (kg)
- `g` = 9.81 m/s²
- `r_tip` = effective tip contact radius (m)
- `I_total` = total moment of inertia (kg·m²)
- `ω₀` = launch spin rate (rad/s)

### Worked Example — MFB Hard Flat (HF) Tip

```
Assembly: Metal Wheel 22 g (r_i=4 mm, r_o=25 mm) + Spin Track 4 g + HF tip 3 g (r_tip=6 mm)
m = 29 g = 0.029 kg
μ_k = 0.17 (hard ABS)  [CONFIRMED CS10 Case 551]

I_wheel = ½ × 0.022 × ((0.004)² + (0.025)²) = 7.052×10⁻⁶ kg·m²
I_total ≈ 7.308×10⁻⁶ kg·m²   [CONFIRMED CS10 Case 545]

dω/dt = −(0.17 × 0.029 × 9.81 × 0.006) / 7.308×10⁻⁶ = −39.8 rad/s²
t_spin = 600 / 39.8 = 15.1 s   (at ω₀ = 600 rad/s)   [CONFIRMED CS10]
```

### Slope Correction

```
N_slope = m × g × cos(α)
dω/dt_slope = −(μ × N_slope × r_tip) / I

At α = 30°: cos(30°) = 0.866 → 13.4% reduction in spin decay rate   [REAL-WORLD]
```

### Annular Inertia Formula

```
I = ½ × m × (r_inner² + r_outer²)     [REAL-WORLD]
```

**Critical:** Do not use solid-disk formula `I = ½mr²` for any ring or wheel with a central bore.

---

## 1.3 Contact Impulse — Attack Physics

### Master Formula

```
J = m_eff × Δv × (1 + e)     [REAL-WORLD]

m_eff = m₁ × m₂ / (m₁ + m₂)   (reduced mass)
Δv = relative velocity at contact point
e = coefficient of restitution (material-dependent)
```

### Smash vs Recoil Decomposition

Contact face angle φ from the radial direction determines the split between useful smash force and self-decelerating recoil on the attacker.

```
F_smash  = F_impact × cos(φ)     [REAL-WORLD]
F_recoil = F_impact × sin(φ)     [REAL-WORLD]
```

Example — Shark Edge BX Blade (φ = 20°):
```
smash fraction  = cos(20°) = 0.940
recoil fraction = sin(20°) = 0.342    [REAL-WORLD from CS8 Case 375]
```

Example — Upper Attack geometry (φ = 45°):
```
smash fraction  = cos(45°) = 0.707
recoil fraction = sin(45°) = 0.707  (equal smash and recoil — high destabilization risk)
```

---

## 1.4 Gyroscopic Stability — Defense Physics

### Stability Threshold

```
ω_stable = √(m × g × h_CoM / I_total)     [REAL-WORLD]
```

When spin drops below `ω_stable`, the beyblade enters nutation wobble. Game implementation: wobble onset at spin/maxSpin < 0.40.

### Precession Rate

```
Ω_p = τ / (I × ω)

Interpretation:
  High ω → small Ω_p → slow, stable precession
  Low ω  → large Ω_p → fast, destabilized wobble
```

---

## 1.5 Materials Reference Table

All values cross-verified CS1–CS10. `frictionMult` is relative to ABS baseline.

| Material | μ_k | Tag | frictionMult | gripMult | decayMod | COR (e) | Tag |
|----------|-----|-----|-------------|----------|----------|---------|-----|
| Hard ABS | 0.17 | [CONFIRMED CS10 Case 551] | 1.00 (baseline) | 1.0 | 1.0 | 0.65–0.70 | [CONFIRMED CS10] |
| Rubber | 0.50 | [CONFIRMED CS10 Case 545] | 2.94 | 2.8 | 1.3 | 0.25 | [CONFIRMED CS10] |
| Metal (zinc/steel) | 0.12 | [CONFIRMED CS3 Case 119] | 0.71 | 0.3 | 0.9 | 0.80 | [CONFIRMED CS10] |
| Old Plastic (Gen-1) | 0.10 | [CONFIRMED CS1] | 0.59 | 0.8 | 0.95 | 0.60 | [ESTIMATED] |
| POM | 0.12 | [CONFIRMED CS4 Case 231] | 0.71 | 0.5 | 0.85 | 0.55 | [ESTIMATED] |
| PC (polycarbonate) | 0.15 | [ESTIMATED] | 0.88 | 0.9 | 0.95 | 0.60 | [ESTIMATED] |
| Bearing B:D (bearing coupling†) | 0.05 | [CONFIRMED CS10 Case 551] | 0.29 | — | — | 0.80 | [ESTIMATED] |
| EWD / CEW sleeve | 0.12 | [CONFIRMED CS1 line 2298] | 0.71 | — | — | 0.55 | [ESTIMATED] |
| ABS on ABS (body) | 0.15 | [CONFIRMED CS10] | 0.88 | — | — | 0.65 | [CONFIRMED CS10] |

†**Bearing B:D note:** μ=0.05 is the steel ball bearing coupling friction (shaft-to-disc), NOT the floor contact material. The disc body is ABS plastic (floor contact μ=0.17). Effective spin decay is bearing-dominated because the ABS disc is nearly stationary relative to the floor (decoupled from shaft spin). The engine uses 0.05 as the effective decay coefficient for this reason.

**Formula:** frictionMult = μ_material / μ_ABS = μ_material / 0.17  [CONFIRMED CS10]

### Material Elastic Properties

| Material | E (GPa) | ρ (kg/m³) | ν (Poisson) | Tag |
|----------|---------|-----------|-------------|-----|
| ABS | 2.3 | 1050 | 0.35 | [CONFIRMED CS8] |
| PC | 2.4 | 1200 | 0.37 | [CONFIRMED CS8] |
| Zinc alloy | 100 | 6600 | 0.25 | [CONFIRMED CS8] |
| Rubber | 0.002 | 1200 | 0.49 | [CONFIRMED CS8] |

---

## 1.6 Confirmed Physics Constants

| Parameter | Value | Source | Tag |
|-----------|-------|--------|-----|
| EG spring constant | k = 1500 N/m | CS10 Case 555 | [CONFIRMED] |
| EG spring energy | E = 48 mJ | CS10 Case 556 | [CONFIRMED] |
| F:D mode-switch threshold | ω = 94.3 rad/s | CS10 Case 557 | [CONFIRMED] |
| Magnacore force at 3 mm gap | F = 0.40 N | CS10 Case 554 | [ESTIMATED — pull-test] |
| Rubber restitution (COR) | e = 0.25 | CS10 | [CONFIRMED] |
| ABS restitution (COR) | e ≈ 0.65–0.70 | CS10 | [CONFIRMED] |
| Metal restitution (COR) | e ≈ 0.80 | CS10 | [CONFIRMED] |

---

## 1.7 Tip Type Reference

### Standard Tip Types

| Tip Type | Material | μ_k | r_tip (mm) | heightProfile | Tag |
|----------|----------|-----|-----------|---------------|-----|
| Sharp (S) | ABS | 0.17 | 0.5 | flat | [CONFIRMED] |
| Semi-Flat (SF) | ABS | 0.17 | 2.0 | spline | [CONFIRMED] |
| Flat (F) | ABS | 0.17 | 6.0 | flat | [CONFIRMED] |
| Hole Flat (HF) | ABS | 0.17 | 6.0 | flat | [CONFIRMED] |
| Wide Flat (WF) | ABS | 0.17 | 8.0 | flat | [CONFIRMED] |
| Defense (D) | ABS | 0.17 | 3.0 | flat | [CONFIRMED] |
| Ball (B) | ABS | 0.17 | 2.0 | flat | [CONFIRMED] |
| Wide Defense (WD) | ABS | 0.17 | 4.0 | flat | [CONFIRMED] |
| Rubber Flat (RF) | Rubber | 0.50 | 8.0–10.0 | flat | [CONFIRMED] |
| Rubber Ball (RB) | Rubber | 0.50 | 3.0 | flat | [CONFIRMED] |
| Metal Sharp (MS) | Metal | 0.12 | 0.3 | flat | [CONFIRMED] |
| Metal Change (MC) | Metal | 0.12 | 0.6–2.0 | flat | [CONFIRMED] |
| Bearing B:D | ABS body + steel bearing (bearing is only metal part) | 0.05† | 1.5–3.0 | flat | [CONFIRMED] |
| EWD | Plastic | 0.12 | 2.0 | flat | [CONFIRMED] |
| Quake (Q) | ABS | 0.17 | 6.0 | cam | [CONFIRMED CS1 Case 14] |
| POM Sharp (CEW LS) | POM | 0.12 | 0.6 | flat | [CONFIRMED CS4 Case 231] |

### BX Generation Bits

| Bit Type | Material | μ_k | r_tip (mm) | Tag |
|----------|----------|-----|-----------|-----|
| Ball (BX) | PC (polycarbonate) | 0.10 | 0.092 (Hertzian contact patch radius; physical hemisphere R_ball=3mm) | [CONFIRMED CS8 Case 400] |
| Flat (BX) | ABS | 0.10 | 3.0 | [CONFIRMED CS10 Case 564] |
| Rush (BX) | ABS | 0.17 | 4.0 | [ESTIMATED; confirmed 10-tooth gear CS7 Case 358] |
| Needle (BX) | PC (polycarbonate) | 0.30 | 0.00354 (Boussinesq r_eff; θ=75° cone half-angle) | [CONFIRMED CS8 Case 401] |
| Metal Needle (BX) | Metal | 0.12 | 0.3 | [ESTIMATED] |
| Free Ball (FB) | ABS‡ | 0.13 | 2.0 | [ESTIMATED] |

‡**Free Ball note:** Free Ball is ABS plastic. The "free" property does NOT come from a metal bearing. The bit shaft has **no teeth / notches** — it cannot grip the ratchet's engagement points. This allows the bit to rotate freely relative to the ratchet assembly (loose ABS-on-ABS shaft fit), preventing floor friction from coupling strongly to the main spin axis. Mechanically similar to B:D in effect but different in construction: no metal, no bearing races — just a smooth toothless shaft.

**Needle vs Metal Needle:** Standard Needle is PC (polycarbonate), cone half-angle θ=75°, μ≈0.30 (high-pressure sharp-cone contact regime), Boussinesq r_eff=0.00354mm → dω/dt≈0.039 rad/s² (near-zero tip friction) [CONFIRMED CS8 Case 401]. "Metal Needle" is a separate variant with a metal tip insert (μ_k=0.12). Always check the part name — if it does not say "Metal", it is PC.

**Rush:** ABS plastic flat-aggressive bit. Not rubber. Aggressive movement pattern comes from wide flat contact area (r_tip≈4 mm), not from rubber grip.

### Spin Decay Reference Table

| Tip | μ | r_tip (mm) | I (kg·m²) | m (kg) | α (rad/s²) | t_spin | Source |
|-----|---|-----------|----------|--------|------------|--------|--------|
| Sharp (Plastic) | 0.10 | 0.8 | 3.8e-6 | 0.022 | 4.55 | 54.9 s (at ω₀=250) | [CS10 Case 555] |
| Flat (Plastic) | 0.15 | 3.0 | 3.8e-6 | 0.022 | 25.6 | 9.8 s (at ω₀=250) | [CS10 Case 555] |
| Ball (Plastic) | 0.13 | 2.0 | 3.6e-6 | 0.021 | 15.2 | 16.4 s (at ω₀=250) | [CS10 Case 555] |
| Bearing B:D (Plastic) | 0.04 | 1.5 | 3.9e-6 | 0.023 | 3.56 | 70.2 s (at ω₀=250) | [CS10 Case 555] |
| Hard Flat HF (MFB) | 0.17 | 6.0 | 7.3e-6 | 0.029 | 39.8 | 15.1 s (at ω₀=600) | [CONFIRMED CS10] |
| Rubber Flat RF (MFB) | 0.50 | 8.0 | 7.3e-6 | 0.029 | 156 | 3.85 s (at ω₀=600) | [CONFIRMED CS10] |
| Flat D (BX) | 0.10 | 3.0 | 3.3e-5 | — | 6.87 | 290 s (at ω₀=2000) | [CS10 Case 564] |
| Sharp S (BX) | 0.10 | 0.8 | 3.3e-5 | — | 1.83 | 1090 s (at ω₀=2000) | [CS10 Case 564] |

---

## 1.8 Contact Height Matrix

Contact height determines whether two beyblades can physically strike each other. Heights are measured from the stadium floor.

### Contact Height Ranges by Generation

| Generation | Component | Contact Height (mm above floor) | Source |
|-----------|-----------|--------------------------------|--------|
| Gen 1 Plastic | AR face edges (contact zone) | 12–24 | [CONFIRMED CS7, CS8] |
| Gen 1 Plastic | AR centroid (mass centre) | 28–36 | [CONFIRMED CS7] |
| Gen 1 Plastic | WD outer edge | 8–14 | [ESTIMATED] |
| Gen 1 HMS | AR metal frame | 10–20 | [ESTIMATED] |
| Gen 2 MFB | Fusion Wheel (145 track) | 17–28 | [INFERRED] |
| Gen 2 MFB | Fusion Wheel (85 track) | 11–22 | [INFERRED] |
| Gen 3 Burst (early) | Layer blades | 5–15 | [ESTIMATED] |
| Gen 3 Burst DB (Low mode) | Layer blades | 5–13 | [ESTIMATED] |
| Gen 3 Burst DB (High mode) | Layer blades | 13–21 | [ESTIMATED] |
| Gen 4 BX | Blade contact points | 5–14 | [ESTIMATED] |

**Critical:** AR contact height is 12–24 mm (face edges). The AR centroid is the mass centre of the AR structure at 28–36 mm. Contact faces project downward from the centroid. Do not conflate. [CONFIRMED CS7, CS8]

### Cross-Generation Contact Compatibility Matrix

| Attacker | Defender | Overlap Range | Contact? |
|----------|----------|--------------|----------|
| Gen 1 AR (12–24 mm) | Gen 1 AR (12–24 mm) | 12–24 mm | Full overlap |
| Gen 1 AR (12–24 mm) | Gen 2 MFB 145 (17–28 mm) | 17–24 mm | Partial (7 mm) |
| Gen 1 AR (12–24 mm) | Gen 3 Layer (5–15 mm) | 12–15 mm | Partial (3 mm) |
| Gen 2 MFB 145 (17–28 mm) | Gen 4 BX (5–14 mm) | — | No overlap |
| Gen 2 MFB 85 (11–22 mm) | Gen 4 BX (5–14 mm) | 11–14 mm | Partial (3 mm) |
| Gen 3 Layer (5–15 mm) | Gen 4 BX (5–14 mm) | 5–14 mm | Nearly full |
| Gen 1 AR (12–24 mm) | Gen 4 BX (5–14 mm) | 12–14 mm | Minimal (2 mm) |

---

## 1.9 Generation Overview — Physical Parameter Ranges

| Metric | Gen 1 Plastic | Gen 1 HMS | Gen 2 MFB | Gen 3 Burst | Gen 4 BX |
|--------|--------------|-----------|-----------|-------------|----------|
| Total mass (g) | 18–35 | 28–42 | 35–48 | 32–45 | 45–75 |
| r_outer (mm) | 22–28 | 17–22 | 22–28 | 14–28 | 24–30 |
| I_total (kg·m²) | 3.6–8.5e-6 | 3–6e-6 | 6–12e-6 | 3–6e-6 | 10–20e-6 |
| Typical launch ω₀ (rad/s) | 250 | 300 | 600 | 600–800 | 2000 |
| Spin life — sharp tip | 55 s | 10–16 s | — | 8–12 s | 1090 s |
| Spin life — flat tip | 10 s | — | 15.1 s | — | 290 s |

All values `[INFERRED]` or `[REAL-WORLD]`; sources: CS4, CS8, CS10.

---

## 1.10 Part Terminology by Generation

| Term | Generation | Role | Mass | Contact Height |
|------|-----------|------|------|---------------|
| AR (Attack Ring) | Gen 1 Plastic | Primary contact surface | 4–8 g | Face edges 12–24 mm |
| SAR (Sub Attack Ring) | Gen 1 Plastic | Secondary CP set on AR | 2–5 g | Same as AR CPs |
| WD (Weight Disk) | Gen 1 Plastic | Dominant inertia contributor (52%+) | 10–18 g | Passive (no CPs on most) |
| BB (Blade Base) | Gen 1 Plastic | Tip + shaft; sets h_CoM | 3–8 g | Tip at floor h=0 mm |
| SG (Spin Gear) | Gen 1 Plastic | Spin direction + EG spring housing | 3–5 g | h≈14 mm above floor |
| Bit Chip | Gen 1 Plastic | Cosmetic only | ~1 g | n/a |
| HMS AR | Gen 1 HMS | Metal attack ring; highest contact mass | 12–16 g | 12–20 mm |
| RC (Running Core) | Gen 1 HMS | Tip; bottom of HMS stack | 1–3 g | h=0 mm |
| FW (Fusion Wheel) | Gen 2 MFB | Attack ring equivalent; dominant mass (70% I) | 22–35 g | Track height + 3–13 mm |
| Spin Track | Gen 2 MFB | Sets FW height | 2–6 g | No CPs |
| Layer (Energy Layer) | Gen 3 Burst | Primary contact; blades project DOWN | 12–18 g | Blade contact 5–15 mm |
| Forge Disc | Gen 3 Burst | Weight disk equivalent; burst engagement | 15–22 g | Passive; burst height |
| Driver | Gen 3 Burst | Tip physics same as all gens | 3–6 g | h=0 mm |
| DB Core / Armor | Gen 3 DB | High/Low mode swap (±7 mm CoM) | varies | Config shifts |
| Blade | Gen 4 BX | Attack ring equivalent (55% of system mass) | 33–60 g | 5–14 mm |
| Ratchet | Gen 4 BX | Height setter; burst resistance | 3.5–4.5 g | Sets Blade height |
| Bit | Gen 4 BX | Tip; gear meshes X-Celerator Rail | 2.1–2.3 g | h=0 mm |

---

## 1.11 Engine Stat Formulas [ANIME/GAME]

These are game-balance values, not physics. All tagged `[ANIME/GAME]`.

```
damageMultiplier = 1.0 + attack × 0.007       // 1.0× – 2.05×
damageReduction  = 1.0 − defense × 0.003      // 1.0× – 0.55×
spinDecayRate    = 8 × (1 − stamina × 0.001)  // 8 – 6.8 /s
maxSpin          = 2000 × (1 + stamina × 0.0008)
```

Normalization formula (within each generation's peer group):
```
stat_normalized = floor(150 × (value − gen_min) / (gen_max − gen_min))
360 total budget per beyblade; max 150 per category
```

---

## 1.12 Variable Height Tip — Q Tip Cam Mechanism (CS1 Case 14)

The Q tip is a frustum-cylinder tip whose contact edge runs diagonally from the narrow frustum (low, tapered) to the wider cylinder (high, straight). This slant produces periodic vertical forcing at spin frequency — not a simple elliptical shape.

```
deltaH = mountOffset × sin(slantAngle)
  Mode 1: deltaH = 1.5 × sin(15°) = 0.388 mm   [INFERRED]
  Mode 2: deltaH = 2.5 × sin(15°) = 0.647 mm   [INFERRED]
```

`heightProfile` values: `flat` (S, F, B, MS, B:D), `spline` (SF, D), `slant` (BX Quake Bit), `cam` (Q tip).

---

## 1.13 Common Errors to Avoid

1. **ABS tip friction is NOT 0.5 or 0.8.** Correct: μ_k = 0.17 for ALL hard ABS tips. [CONFIRMED CS10 Case 551]
2. **Rubber friction is NOT 0.85 or 0.9.** Correct: μ_k = 0.50 for rubber tips. [CONFIRMED CS10]
3. **B:D bearingFriction is NOT 0.005 or 0.02.** Correct: μ = 0.05 for real B:D. [CONFIRMED CS10 Case 551]
4. **The 0.30 value for rubber in CS1 is restitution (e), NOT friction.** CS1 early table values (0.85, 0.70, 0.30) are COR values, not μ. [CONFIRMED CS10]
5. **AR contact height is 12–24 mm, NOT 28–36 mm.** The centroid is mass centre; contact faces project downward from it. [CONFIRMED CS7, CS8]
6. **Do NOT hardcode petal counts for orbital tips.** Petal count is emergent from RPM × bowl depth × grip. [CONFIRMED CS10]
7. **Annular inertia formula is I = ½m(r_i² + r_o²), NOT I = ½mr².** The solid disk formula only applies when r_i = 0. [CONFIRMED CS8]
8. **EG spring energy is 48 mJ, NOT 48 J.** E = 0.5 × 1500 × (0.008)² = 0.048 J. [CONFIRMED CS10 Case 556]

---

# PART II: GENERATION 1 — PLASTIC ERA

---

## 2.1 Generation Overview

**Years:** 1999–2003 (Bakuten Shoot Beyblade series)  
**Format:** Beyblade World tour format, ripcord launchers  
**Physics signature:** Heaviest WD drives ~52%+ of total inertia; AR contact at 12–24 mm; old plastic tips μ = 0.10; low launch ω₀ ≈ 250 rad/s

**Sub-systems in chronological order:**
1. **Four-Layer System (4LS)** — pre-SG, no standardized gear
2. **SG System (SGS / A–F Series)** — Spin Gear standardization
3. **Magnacore / Neo SG System (MGS / V Series)** — magnetic chip in SG
4. **V2 Series** — Customize Metal Change Base + Sub-Parts (SP)
5. **Engine Gear System (EGS / G Series)** — spring-powered EG burst
6. **GT / G-Revolution System** — CEW (Customize Engine Weight), Turbo EG

---

## 2.2 Four-Layer System (4LS) — Part Structure

**Stack (top to bottom):** Bit Chip → AR (Attack Ring) → WD (Weight Disk) → BB (Blade Base)

- **Bit Chip:** ABS. Cosmetic only (~1 g). No physics contribution.
- **AR (Attack Ring):** ABS. Primary collision surface. Contact at 12–24 mm. Multi-CP geometry.
- **WD (Weight Disk):** ABS or metal. Dominant inertia contributor. Wide WD provides more stamina than Heavy WD despite lower mass (higher r_o).
- **BB (Blade Base):** ABS. Houses tip; sets system height and h_CoM.

---

## 2.3 Four-Layer Series Beyblades

**Ultimate Dragoon**
- AR: Cross Dragon AR (ABS, C₂ symmetry, smash attack)
- WD: Wide WD (ABS)
- BB: Flat Base (ABS, flat tip)

**Saizo**
- AR: Try Cutter AR (ABS, upper attack geometry)
- WD: Heavy WD (ABS)
- BB: Sharp Base (ABS, sharp tip)

**Frostic Dranzer**
- AR: Wing Cross AR (ABS, survival geometry)
- WD: Balance WD (ABS)
- BB: Semi-Flat Base (ABS, semi-flat tip)

**Gekiryu-oh** — AR: N/A | WD: N/A | BB: N/A (4LS stamina type)

**Megaro Arm** — AR: N/A | WD: N/A | BB: N/A (4LS heavy type)

**Spark Knight** — AR: N/A | WD: N/A | BB: N/A (4LS attack type)

**Polta** — AR: N/A | WD: N/A | BB: N/A (4LS attack)

**Bistool** — AR: N/A | WD: N/A | BB: N/A (4LS defense)

**Makendo** — AR: N/A | WD: N/A | BB: N/A (4LS)

**Bakushin-oh**
- AR: Down Force Ring AR (ABS, downward-angled contact faces — forces low-trajectory smash)
- WD: N/A
- BB: N/A

**Pumpking**
- AR: Upper Force Ring AR (ABS, upward-angled contact faces — upper attack archetype)
- WD: N/A
- BB: N/A

**Dragoon Grip Attacker** — AR: N/A | WD: N/A | BB: Grip Base BB (ABS, rubber dome contact)

**Metal Dragoon Bearing Stinger**
- AR: Scissor Cutter AR (ABS, scissor-blade geometry)
- WD: N/A
- BB: Bearing Base BB (ABS + metal bearing; free-spin LAD capability)

**Bound Attacker** — AR: N/A | WD: N/A | BB: N/A (4LS, rebound attack)

**Bound Defenser** — AR: N/A | WD: N/A | BB: N/A (4LS, rebound defense)

**Roller Attacker** — AR: N/A | WD: N/A | BB: N/A (4LS, roller contact)

**Roller Defenser** — AR: N/A | WD: N/A | BB: N/A (4LS, roller defense)

**Dranzer Auto Change Balancer** — AR: N/A | WD: N/A | BB: Auto Change Base BB (mode-change tip)

**Wing Attacker** — AR: N/A | WD: N/A | BB: N/A (4LS, wing upper attack)

**Wing Defenser** — AR: N/A | WD: N/A | BB: N/A (4LS, wing defense)

**Draciel Metal Ball Defenser** — AR: N/A | WD: N/A | BB: N/A (metal ball tip)

**Sparkling Attacker** — AR: N/A | WD: N/A | BB: N/A

**Jumping Base (Tiger Defenser)**
- AR: Tiger Defenser AR (ABS, defense-type wide profile)
- WD: Eight Wide WD (ABS)
- BB: Jumping Base BB (ABS, periodic jump mechanism)

---

## 2.4 SG System (A–F Series) — Part Structure

**Stack:** Bit Chip → AR → SAR (optional) → WD → SG (Spin Gear) → BB

- **SG (Spin Gear):** ABS housing. Standardizes spin direction (Left SG / Right SG). Houses tip shaft. Variants: normal, spring, bearing, full auto clutch, G-ball, triple change, auto change, grease ball, free shaft.
- **WD variants:** Eight Heavy, Eight Wide, Ten Wide, Ten Heavy, Ten Balance, Revolver Attack WD.
- Materials: All ABS unless noted. Metal SG has metal weight in gear body.

---

## 2.5 A–F Series Beyblades

**Dragoon S (Bakuten Shoot S1)**
- AR: Reverse Dragon AR (ABS, reverse-rotation smash geometry)
- WD: Eight Wide WD (ABS)
- SG: Left SG (ABS)
- BB: Storm Grip Base BB (ABS, rubber dome grip tip)
- Type: Attack / Left-spin

**Driger S**
- AR: N/A
- WD: N/A
- SG: Right SG (ABS)
- BB: N/A
- Type: Attack

**Death Driger** — AR: N/A | WD: N/A | SG: N/A | BB: N/A (defense-attack hybrid)

**Knight Dranzer** — AR: N/A | WD: N/A | SG: N/A | BB: N/A

**Metal Draciel**
- AR: Turtle Survivor AR (ABS, round-shell defense profile)
- WD: Eight Heavy WD (ABS)
- SG: N/A
- BB: Metal Sting Base BB (ABS, metal sting tip — μ_k = 0.12 metal)
- Note: Metal Sting is a metal-tipped base providing lower spin decay than ABS sharp.

**Kids Dragoon**
- AR: Upper Dragoon AR (ABS, upper attack geometry)
- SG: Right SG (ABS)
- BB: SG Flat Base BB (ABS, flat tip)

**Kids Draciel**
- AR: Smash Turtle AR (ABS, radial smash geometry)
- BB: N/A

**Dranzer S**
- AR: Double Wing AR (ABS, twin-wing survival geometry)
- SG: Right SG Free Shaft Version (ABS, free-spinning tip shaft for EWD)
- BB: Spiral Change Base BB (ABS, mode-change between sharp and flat)
- Type: Stamina

**Galeon** — AR: War Lion AR (ABS) | WD: N/A | SG: N/A | BB: N/A

**Galzzly** — AR: War Bear AR (ABS) | WD: N/A | SG: N/A | BB: N/A

**Galman** — AR: War Monkey AR (ABS) | WD: N/A | SG: N/A | BB: N/A

**Wolborg**
- AR: Reverse Wolf AR (ABS, concave under-side profile for zombie LAD)
- SG: Right SG Bearing Version (ABS + metal ball bearing inside)
- BB: SG Bearing Base BB (ABS + bearing; μ_effective ≈ 0.05 bearing friction)
- Type: Stamina / Zombie (high LAD)

**Seaborg**
- AR: Whale Attacker AR (ABS)
- BB: Defense Grip Base BB (ABS, rubber grip contact)

**Draciel S**
- AR: Cross Spike AR (ABS, cross-shaped smash geometry)
- BB: SG Metal Ball Base BB (ABS + metal ball tip; μ_k = 0.12)

**Trygle**
- AR: Triple Wing AR (ABS, three-wing upper-attack)
- SG: Right SG Spring Version (ABS + spring mechanism)
- BB: Jumping Base (Trygle) BB (ABS, spring-jump on floor contact)

**Trypio** — AR: Flying Defense AR (ABS, defensive slope) | BB: N/A

**Driger F**
- AR: Cross Fang AR (ABS, steep upper-attack faces, φ ≈ 40–45°)
- SG: Right SG Full Auto Clutch Version (ABS, clutch-release trigger)
- BB: Full Auto Clutch Base BB (ABS, clutch releases at low spin)
- Type: Attack / Upper

**Dragoon F**
- AR: Dual Dragon AR (ABS, twin-blade attack)
- SG: Left SG (ABS)
- BB: Fantom Grip Base BB (ABS, grip rubber on base body)

**Dranzer F**
- AR: Flame Wing AR (ABS, swept-back wing design)
- SG: Right SG Triple Change Version (ABS, three-position mode change)
- BB: Flame Change Base BB (ABS, multiple tip configurations)

**Griffolyon**
- AR: Cross Griffon AR (ABS, cross-shape with wide upper faces)
- BB: Griffolyon Base BB (ABS)

**Master Dragoon** — AR: N/A | SG: Left SG | BB: N/A (upgraded Dragoon)

**Master Dranzer**
- AR: Turtle Survivor AR (ABS) — shares AR with Metal Draciel
- BB: Metal Sting Base BB (ABS, metal tip)

**Master Draciel** — AR: Smash Turtle AR (ABS) | BB: N/A

**Salamalyon** — AR: N/A | BB: Salamalyon Base BB (unique tip shape)

**Draciel F**
- AR: Eight Spike AR (ABS, eight-point smash geometry)
- SG: Right SG Grease Ball Version (ABS + lubricated metal ball tip)
- BB: Fortress Base BB (ABS)

**Wyborg**
- AR: Double Snake AR (ABS, twin-snake upper attack)
- SG: Right SG Auto Change Version (ABS, auto-mode change at critical spin)
- BB: SG Auto Change Base BB (ABS, switches tip type at ω threshold)

**Master Driger** — AR: Knight Claws Ring AR (ABS, claw-geometry smash) | BB: N/A

**Wolborg 2**
- AR: Upper Wolf AR (ABS, upper-attack focused variant of Wolf AR)
- SG: Right SG Bearing Version 2 (ABS + improved metal bearing)
- BB: Defense Grip Base 2 BB (ABS, rubber grip on base underside)

**Seaborg 2** — AR: N/A | SG: N/A | BB: N/A (updated Seaborg)

**Gaia Dragoon**
- AR: Great Dragon AR (ABS, large three-wing smash)
- WD: Heavy Attack WD (ABS, heavier than standard WDs)
- SG: Right SG G-Ball Version (ABS, metal G-ball tip; μ_k = 0.12)
- BB: G Special Base BB (ABS)
- Type: Attack

**Bakuten Henkei Gaia Dragoon (Transformation)**
- AR: Fire Cracker AR (ABS)
- WD: Revolver Attack WD (ABS, revolving face-cut design)
- BB: Salamalyon Base BB

---

## 2.6 V Series — Magnacore / Neo SG System

**System change:** Bit Chip is replaced by the Magnacore chip embedded in the SG housing. The Magnacore is a permanent magnet. The Magne Stadium floor has its magnets oriented South pole UPWARD; the magnetic force is vertical only — it raises or lowers the effective normal force and therefore floor friction. There is no lateral centering or centrifugal force. [CONFIRMED CS10 Case 554]

**North Magnacore:** ATTRACTED to South-up stadium floor → increased N_normal (+68%) → faster spin decay → α = 38.7 rad/s² → spin life t ≈ 7.75 s (−40.4%) → aggressive/attack behaviour [CONFIRMED CS10 Case 554]  
**South Magnacore:** REPELLED from South-up stadium floor → decreased N_normal (−68%) → slower spin decay → α = 7.37 rad/s² → spin life t ≈ 40.7 s (+3.13×) → stamina/zombie behaviour [CONFIRMED CS10 Case 554]  
F_magne = 0.200 N at operating height h = 14 mm; 0.400 N at h = 3 mm (pull-test estimate)

**WD upgrades:** Ten Wide (highest r_o = highest inertia for stamina), Ten Heavy (highest mass = defense/attack), Ten Balance (compromise), Revolver Attack (asymmetric mass for attack).

---

## 2.7 V Series Beyblades

**Dragoon V**
- AR: Eight Attacker AR (ABS, eight-point attack)
- WD: Ten Wide WD (ABS, widest standard WD — highest I)
- SG: Neo Left SG Metal Weight Version (ABS + metal weight, no magnet)
- BB: Magne Flat Base BB (ABS, flat tip; engages magnetic floor)
- Type: Attack / Left-spin

**Metal Dranzer**
- AR: Scissor Attacker AR (ABS)
- WD: Ten Balance WD (ABS)
- SG: Neo Right SG South Magnecore Version (ABS + South magnet — centering pull)
- BB: SG Flat Base BB (ABS, flat tip)

**Flash Leopard**
- AR: Panther Claw AR (ABS, claw-geometry smash)
- WD: Ten Heavy WD (ABS)
- SG: Neo Right SG [Takara: Metal Weight / Hasbro: North Magnecore] — Takara version has no magnet
- BB: SG Semi-Flat Base BB (ABS)

**Driger V**
- AR: Sonic Tiger AR (ABS)
- WD: Ten Balance WD (ABS)
- SG: Neo Right SG South Magnecore (ABS + South magnet)
- BB: SG Metal Flat Base BB (ABS + metal flat tip; μ_k = 0.12)

**Flash Leopard 2**
- AR: Panther Head AR (ABS, revised claw)
- WD: Ten Heavy WD (ABS)
- SG: North Magnecore SG (ABS + North magnet)
- BB: SG Metal Sharp Base BB (ABS + metal sharp tip; μ_k = 0.12)

**Dranzer V**
- AR: Cross Attacker AR (ABS)
- WD: Ten Balance WD (ABS)
- SG: Dranzer V South Magnecore SG (ABS + South magnet, specially tuned)
- BB: Volcano Change Base BB (ABS, heat-triggered mode change — cosmetic gimmick only)

**Cyber Dragoon**
- AR: Cybernetic Dragon AR (ABS, large attack wings)
- WD: Ten Wide WD (ABS)
- SG: Right SG MG Spring Version (ABS + spring)
- BB: Jumping Base 2 BB (ABS, spring-jump variant 2)

**Draciel V**
- AR: Ten Spike AR (ABS, ten-point radial smash — highest contact point count of V series)
- WD: Ten Balance WD (ABS)
- SG: North Magnecore SG (ABS + North magnet)
- BB: Viper Metal Ball Base BB (ABS + metal ball tip; μ_k = 0.12)

**Wolborg 03 / Uriel**
- AR: Cross Horn AR (ABS, cross-shaped with upper horn contacts)
- WD: Revolver Attack WD (ABS)
- SG: South Magnecore SG (ABS + South magnet)
- BB: SG Grip Base BB (ABS, rubber grip)

**Gabriel**
- AR: Twin Horn AR (ABS, dual-horn upper attack)
- WD: Revolver Attack WD (ABS)
- SG: Metal Weight SG (ABS + metal weight, no magnet)
- BB: SG Wing Base BB (ABS)

**Guardian Driger**
- AR: Great Tiger AR (ABS)
- WD: Eight Heavy WD (ABS)
- SG: South Magnecore SG (ABS + South magnet)
- BB: SG Flat Base BB (ABS, flat tip)

**Additional V Series:** Spike Lizard, Crab Diver, Orca Diver, Manta Diver, Killer Eagle, Death Gargoyle, Rushing Boar, Galeon 2, Trygle 2, Trygator, Cyber Dragoon Battle Spec., Appollon, Venus, Poseidon — all use Random WD / Metal Weight SG variants (ABS unless explicitly metal).

---

## 2.8 V2 Series

**System change:** Introduces Sub-Parts (SP) — optional clip-on accessories that attach to specific AR or BB slots to change contact geometry. Introduces Customize Metal Change Base, Customize Bearing Base, Switch Metal Ball Base.

**SP (Sub-Part) types:** Reverse Attack SP, Upper Attack SP, Defense Ring SP, Cross Attack SP, Cross Survivor SP, Twin Guard SP, Fin Tector SP.

---

## 2.9 V2 Series Beyblades

**Dragoon V2**
- AR: Spike Dragon AR (ABS, spike-forward smash)
- WD: Magne Weight Disk (ABS, special magnetic WD variant)
- SG: Neo Left SG Normal Version (ABS, no magnet)
- SP: Reverse Attack (ABS, reverse-side smash extension)
- BB: Customize Grip Base BB (ABS, rubber grip dome)

**Driger V2**
- AR: Upper Claw AR (ABS, upper-attack claw)
- WD: Ten Balance WD (ABS)
- SG: Metal Weight SG (ABS + metal weight)
- SP: Upper Attack (ABS, additional upper-attack contacts)
- BB: Customize Metal Change Base BB (ABS + metal change tip that switches at ω threshold)

**Voltaic Ape**
- AR: Mountain Hammer AR (ABS, heavy hammer-head smash)
- WD: Magne Weight Disk (ABS)
- SG: North Magnecore SG (ABS + North magnet)
- SP: Defense Ring (ABS, ring guard around AR)
- BB: Customize Metal Sharp Base BB (ABS + metal sharp tip; μ_k = 0.12)

**Gaia Dragoon V** — AR: N/A | WD: N/A | SG: N/A | BB: N/A (V2 upgrade of Gaia Dragoon)

**Dranzer V2**
- AR: Cross Dranzer AR (ABS)
- SP: Cross Survivor (ABS, survival-mode extension)
- BB: Customize Clutch Change Base BB (ABS, clutch-release mode change)

**Burning Kerberous**
- AR: Triple Attacker AR (ABS, three-point smash at φ ≈ 0° — maximum smash fraction)
- WD: Ten Wide WD (ABS)
- SG: Double Bearing SG (ABS + two ball bearings)
- SP: Cross Attack (ABS)
- BB: Customize Bearing Base BB (ABS + bearing; μ_effective ≈ 0.05)

**Draciel V2**
- AR: Strike Turtle AR (ABS)
- SG: North Magnecore SG (ABS + North magnet)
- SP: Fin Tector (ABS, fin-shaped guard)
- BB: Switch Metal Ball Base BB (ABS + metal ball tip; μ_k = 0.12, tip switches under load)

**Uriel 2** — Updated Wolborg 03/Uriel

**Dark Series** (Dark Dragoon / Dark Driger / Dark Draciel / Dark Dranzer / Dark Gaia Dragoon):
- AR: Dark Wing AR (ABS, swept-back wing design — all Dark series share this AR)
- WD: Ten WD variants (ABS)
- SG: Metal Weight SG (ABS + metal weight)
- SP: Survivor Ring (ABS)
- BB: Customize Sharp Base BB (ABS, sharp tip)

**Orthrus**
- AR: Double Attacker AR (ABS, two-headed attack, φ ≈ 0° near-radial contact)
- WD: Revolver Attack WD (ABS)
- SG: Metal Weight SG (ABS + metal weight)
- SP: Twin Guard (ABS, dual guard wings)
- BB: SG Bolt Base BB (ABS, bolt-shaped stable tip)

---

## 2.10 G Series — Engine Gear System (EGS)

**System change:** The SG is replaced by the Engine Gear (EG). The EG contains a wound steel spring (k = 1500 N/m, E = 48 mJ [CONFIRMED CS10]). When the trigger fires, the spring releases and delivers a ~Δω spin burst. The trigger condition depends on the Blade Base type:
- **First Clutch Base BB:** clutch fires ONCE at battle start (the physical release tab is depressed at launch) [CONFIRMED CS10 Case 556]
- **Final Clutch Base BB:** clutch fires when spin falls to ω_trigger = 141 rad/s (1350 RPM); Δω = 53.4 rad/s; post-boost ω = 194 rad/s (+37.9%) [CONFIRMED CS10 Case 556]
- **Normal Base BB:** gradual spring release throughout the battle — spring unwinds progressively; no discrete trigger event [CONFIRMED CS10 Case 556]

The CEW (Customize Engine Weight) is a small insert at the center of the EG whose tip type determines the beyblade's floor contact behavior.

---

## 2.11 G Series Beyblades

**Dragoon G**
- AR: Eight Spiker AR (ABS, eight radial spikes)
- WD: Ten Wide WD (ABS)
- EG: Left EG Metal Semi-Flat (ABS + metal housing, metal semi-flat CEW tip; μ_k = 0.12)
- BB: First Clutch Base BB (ABS, spring fires once at battle start)
- Type: Attack / Left-spin

**Driger G**
- AR: Triple Tiger AR (ABS, three-point tiger claw)
- EG: Right EG Metal Semi-Flat (ABS + metal housing, metal semi-flat CEW)
- BB: First Clutch Base BB (ABS)

**Metal Driger**
- AR: Cross Spiker AR (ABS)
- WD: Ten Heavy WD (ABS)
- EG: Right SG Heavy Metal Core [Takara] / Right EG Metal Semi-Flat [Hasbro]
- BB: First Clutch Base BB (ABS)
- Note: Takara SG casing designed to accept EG Blade Bases despite the SG internal unit.

**Rock Bison**
- AR: Double Horn AR (ABS, dual-horn upper/smash)
- WD: Ten Heavy WD (ABS)
- EG: Right EG Circle Defenser (ABS, defense-profile CEW insert)
- BB: Normal Base BB (ABS, gradual spring release — no discrete trigger event)

**Dranzer G**
- AR: Wing Survivor AR (ABS, stamina-oriented wing)
- WD: Ten Balance WD (ABS)
- EG: Right EG Metal Semi-Flat (ABS + metal)
- BB: Final Clutch Base BB (ABS, spring fires at ω_trigger = 141 rad/s; Δω = 53.4 rad/s; post-boost ω = 194 rad/s)

**Wolborg 4**
- AR: Star Wolf AR (ABS, star-shaped contact geometry)
- WD: Ten Wide WD (ABS)
- EG: Right EG Circle Survivor (ABS, survival-profile CEW)
- BB: Normal Base BB (ABS, gradual spring release — no discrete trigger event)

**Draciel G**
- AR: Shield Hammer AR (ABS, wide defense shield with hammer contacts)
- WD: Ten Wide WD (ABS)
- EG: Right EG Metal Ball (ABS + metal ball CEW; μ_k = 0.12)
- BB: Final Clutch Base BB (ABS)

**Gaia Dragoon G**
- AR: Dragon Saucer AR (ABS, wide saucer attack profile)
- WD: Ten Heavy WD (ABS)
- EG: Right EG Metal Flat (ABS + metal flat CEW; μ_k = 0.12)
- BB: Final Clutch Base BB (ABS)

**Flame Pegasus**
- AR: Wing Upper AR (ABS, upper-attack wings)
- WD: N/A (no standard WD — unique system)
- EG: Gyro Engine Gear (ABS + gyroscopic internal mechanism)
- BB: Engine Stopper Base BB (ABS, engine stopper on base)
- CEW: Metal Sharp (metal, μ_k = 0.12, sharp point)

**Desert Sphinxer**
- AR: Ark Pyramid AR (ABS, pyramid-shaped contact geometry)
- WD: Ten Wide WD (ABS)
- EG: Right EG Mystery Cutter (ABS, cutting-edge profile CEW)
- BB: Final Clutch Base BB (ABS)

---

## 2.12 GT Series — G-Revolution System

**System change:** Introduces the CEW (Customize Engine Weight) as a swappable tip insert separate from the EG spring unit. The CEW sits in the center of the EG and is removable. Introduces Turbo EG (faster spring release). Two Customize Gear (CG) variants: Full Auto Clutch and Free Shaft.

---

## 2.13 GT Series Beyblades

**Dragoon GT**
- AR: G Upper AR (ABS, upper-attack geometry)
- WD: Ten Wide WD (ABS)
- EG: Left EG Turbo (ABS, faster Turbo spring release)
- BB: First Clutch Base BB (ABS)
- CEW: Metal Grip (metal body with rubber grip dome; μ_k = 0.50 rubber contact)
- Type: Attack / Left-spin

**Dranzer GT**
- AR: Triangle Wing AR (ABS, three-wing survival)
- WD: Ten Balance WD (ABS)
- EG: Right EG Reverse (ABS, reverse-spring release direction)
- BB: Final Clutch Base BB (ABS)
- CEW: Metal Semi-Flat (metal, μ_k = 0.12)

**Gigars**
- AR: Gigantic Claw AR (ABS, massive claw attack profile)
- WD: Ten Balance WD (ABS)
- EG: Right Customize Gear Full Auto Clutch Version (ABS)
- BB: Final Clutch Base BB (ABS)
- CEW: Metal Change (metal, μ_k = 0.12, mode-change)

**Zeus**
- AR: Holy Despell AR (ABS, large wing smash)
- SAR: Screw Zeus S-AR (ABS, threaded secondary contact ring)
- WD: Ten Wide WD (ABS)
- EG: Right Customize Gear Free Shaft Version (ABS)
- BB: First Clutch Base BB (ABS)
- CEW: Light Sharp (ABS, very light sharp tip — lowest inertia CEW)

---

# PART III: GENERATION 1 — HEAVY METAL SYSTEM (HMS)

---

## 3.1 System Overview

**Years:** 2003–2004 (Bakuten Shoot HMS series)  
**Format:** HMS Double Shooter (~1322 rad/s from dual-ripcord mechanism [INFERRED CS14])  
**Physics signature:** Metal AR dominates mass (12–16 g at outer radius); smaller r_outer (17–22 mm) vs plastic gen; CWD (Customize Weight Disk) variants use free-spin bearing WD; total system mass 28–42 g

**Stack (top to bottom):** AR → WD or CWD → RC (Running Core)

- **AR (Attack Ring):** Metal alloy construction (μ_k = 0.12, e = 0.80). Highest contact density of any generation. Contact height 12–20 mm.
- **WD / CWD:** ABS circle WD (standard) or CWD (Customize Weight Disk — bearing-mounted free-spin WD). CWD bearingFriction ≈ 0.08 [ESTIMATED CS1].
- **RC (Running Core):** ABS housing with tip insert. Equivalent to BB in plastic gen.

**No Bit Chip, no SG.** HMS is a 3-part stack.

---

## 3.2 HMS Beyblades

**Gaia Dragoon MS / Strata Dragoon MS**
- AR: Metal Saucer AR (metal, wide saucer smash profile)
- WD: Circle Heavy WD (ABS)
- RC: Flat Core RC (ABS, flat tip; high attack mobility)

**Driger MS**
- AR: Metal Upper AR (metal, upper-attack blade geometry)
- WD: Circle Balance WD (ABS)
- RC: Semi-Flat Core RC (ABS, semi-flat tip)

**Draciel MS**
- AR: Metal Shield AR (metal, wide circular defense profile)
- WD: Circle Wide WD (ABS)
- RC: Sharp Core RC (ABS, sharp tip for stamina)

**Dragoon MS**
- AR: Metal Attacker AR (metal, attack-type blade geometry)
- WD: Circle Wide WD (ABS)
- RC: Grip Flat Core RC (ABS + rubber grip on flat tip; μ_k = 0.50 rubber)

**Dranzer MS**
- AR: Spiral Upper AR (metal, spiral blade upper attack)
- WD: Circle Balance WD (ABS)
- RC: Manual Change Core RC (ABS, manually switchable between two tip modes)

**Einstein MS**
- AR: Metal Spring AR (metal, spring-contact outer blade)
- WD: Circle Heavy WD (ABS)
- RC: Spring Core RC (ABS + spring mechanism in tip)

**Dragoon MS UV (Ultimate Version)**
- AR: Ultimate Attacker AR (metal, reinforced attack blades)
- WD: Circle Wide WD (ABS)
- RC: Grip Flat Core Ultimate Version RC (ABS + enhanced rubber grip)

**Death Gargoyle MS**
- AR: Circle Upper AR (metal, circular upper-attack profile)
- WD: Circle Heavy WD (ABS)
- RC: Metal Change Core RC (metal tip that changes contact geometry)

**Wolborg MS**
- AR: Wolf Crusher AR (metal, crushing geometry for defense-to-attack transition)
- WD: Circle Wide WD (ABS)
- RC: Bearing Core RC (ABS + metal ball bearing; μ_effective ≈ 0.05; LAD capable)

**Thunder Dragon**
- AR: Spark Dragon AR (metal)
- WD: CWD Free Survivor (ABS, bearing-mounted free-spin WD; bearingFriction ≈ 0.08)
- RC: Metal Weight Flat Core RC (metal, flat contact area)

**Sea Dragon**
- AR: Metal Ball Attacker AR (metal, metal ball contact points)
- WD: CWD Defense Ring (ABS, ring-shaped free-spin WD)
- RC: Metal Ball Core RC (metal ball tip; μ_k = 0.12)

**Wyvern DJ**
- AR: DJ Spiker AR (metal, spiked attack geometry)
- WD: Circle Balance WD or CWD Free Saucer (ABS variants)
- RC: Metal Sharp Core RC (metal sharp tip; μ_k = 0.12)

**Advance Averazer**
- AR: Advance Balancer AR (metal, balanced contact profile)
- WD: Circle Balance WD (ABS)
- RC: Metal Semi-Flat Core RC (metal semi-flat tip; μ_k = 0.12)

**Advance Guardian**
- AR: Advance Defenser AR (metal, defense-oriented wide profile)
- WD: Circle Heavy WD (ABS)
- RC: Grip Sharp Core RC (ABS + rubber at sharp tip junction)

**Advance Striker**
- AR: Advance Attacker AR (metal, attack profile)
- WD: Circle Heavy WD (ABS)
- RC: Metal Flat Core RC (metal flat tip; μ_k = 0.12)

**Advance Eterner**
- AR: Advance Survivor AR (metal, survival/stamina profile)
- WD: Circle Wide WD (ABS)
- RC: Metal Sharp Core RC (metal sharp tip; μ_k = 0.12)

**Phantom Fox MS**
- AR: Upper Fox AR (metal, fox-claw upper attack)
- WD: CWD Circle Attacker (ABS, attack-profile free-spin WD)
- RC: Bunshin Core RC (ABS, split/double image tip — unique mechanism)

**Slash Riger MS**
- AR: Slash Upper AR (metal, slash-blade upper attack)
- WD: CWD Free Crusher (ABS, crushing free-spin WD)
- RC: Free Wing Core RC (ABS, wing-shaped free-spinning tip assembly)

**Dark Leopard MS**
- AR: Smash Leopard AR (metal, smash-oriented claw)
- WD: CWD Needle Attacker (ABS, needle-spiked free-spin WD)
- RC: Tornado Change Core RC (ABS, tornado-pattern tip mode change)

**Magical Ape MS**
- AR: Metal Ape AR (metal, rounded ape-fist geometry)
- WD: Circle Heavy WD (ABS)
- RC: Flat Core RC (ABS, flat tip)

**Round Shell MS**
- AR: Turtle Crusher AR (metal, round crushing profile)
- WD: N/A
- RC: Rubber Weight Core RC (ABS + rubber weight on tip; μ_k = 0.50 rubber)

**Dragoon MF**
- AR: Upper Dragon AR (metal, upper-attack dragon claw)
- WD: CWD Chain Attacker (ABS, chain-textured free-spin WD; bearingFriction ≈ 0.08)
- RC: Metal Weight Grip Core RC (metal + rubber grip; μ_k = 0.50 rubber)

**Dranzer MF**
- AR: Smash Phoenix AR (metal, phoenix-wing smash)
- WD: CWD Wing Attacker (ABS, wing-shaped free-spin WD)
- RC: Free Shaft Core RC (ABS, free-shaft bearing tip)

**Samurai Changer MS**
- AR: Samurai Upper AR (metal, samurai sword upper-attack)
- WD: Circle Heavy WD (ABS)
- RC: Battle Change Core RC (ABS, battle-triggered mode change)

**Aero Knight MS**
- AR: Knight Crusher AR (metal, knight's armour crushing profile)
- WD: Circle Wide WD (ABS)
- SP: Aero Ring (ABS, aerodynamic add-on ring)
- RC: Aero Core RC (ABS, aerodynamic tip geometry)

**Jiraiya MS**
- AR: Jiraiya Blade AR (metal, ninja-blade geometry)
- WD: CWD Free Cross (ABS, cross-shaped free-spin WD)
- RC: Bearing Core 2 RC (ABS + improved bearing; μ_effective ≈ 0.05)

**Bloody Devil MS**
- AR: Devil Crusher AR (metal, devilwing crushing smash)
- WD: CWD Devil Saucer (ABS, saucer-shape free-spin WD)
- RC: Shooter Change Core Alpha RC (ABS, launcher-trigger mode change — fires on shooter pull)

**Shining God MS**
- AR: God Smasher AR (metal, god-hand smash profile)
- WD: CWD God Ring (ABS, ring-shaped free-spin WD)
- RC: Shooter Change Core Gamma RC (ABS, launcher-trigger mode change, more powerful)

---

# PART IV: GENERATION 2 — METAL FIGHT BEYBLADE (MFB)

---

## 4.1 System Overview

**Years:** 2008–2014 (Metal Fight Beyblade / Beyblade: Metal series)  
**Sub-systems:** Metal System (4-layer, 2008) → Hybrid Wheel System / HWS (5-layer, 2009) → 4D System (2011) → Zero-G / Synchrome System (2012)  
**Format:** String launcher BeyStringer or ripcord; typical ω₀ = 600 rad/s  
**Physics signature:** Metal Fusion Wheel dominates (70% of total I); track height encodes FW contact height; I_total = 6–12×10⁻⁶ kg·m²; total mass 35–48 g

**Stack — Metal System (4-layer):** Clear Wheel (CW) → Metal Wheel (MW / Fusion Wheel FW) → Spin Track → Performance Tip (Bottom)  
**Stack — HWS (5-layer):** Clear Wheel → Metal Wheel → Spin Track → Performance Tip (+ optional Face Bolt at top)  
**Stack — 4D System (standard):** 4D Clear Wheel (optional) → 4D Metal Wheel (two-part: Inner + Outer) → Track → Bottom  
**Stack — 4D System (fused A:B Bottom):** 4D Clear Wheel (optional) → 4D Metal Wheel → 4D Bottom [replaces BOTH Track AND Bottom as a single fused component; notation examples: F:D, F:S, D:D, B:D, X:D]  
Note: 4D Clear Wheel is absent on L Drago Destroy F:S and L Drago Guardian S130MB.  
**Stack — Zero-G (standard):** Crystal Wheel (outer ABS decorative shell) → Chrome Wheel (main mass piece) → Track → Bottom  
**Stack — Zero-G (Synchrome):** Crystal Wheel (outer ABS) → Chrome Wheel A + Chrome Wheel B (stacked) → Track → Bottom  
Note: Synchrome stacks TWO Chrome Wheels for mass and inertia gain. Crystal Wheels are the light outer ABS shell — combining two Crystal Wheels alone would be too light to achieve any meaningful inertia increase.

- **CW (Clear Wheel):** ABS. Lightweight outer shell over MW. Aesthetic; minor I contribution.
- **MW / FW (Metal Wheel / Fusion Wheel):** Metal (zinc alloy or steel). 22–35 g. Dominant I contributor (70%). Contact at track height + 3–13 mm.
- **Spin Track:** ABS. Sets FW height. Names encode height in mm (T125 = 12.5 mm, 145 = 14.5 mm, 85 = 8.5 mm). Special tracks: DF145 (Down Force), ED145 (Eternal Defense — free-spin outer ring), LW105 (Left Wing), WA130 (Wide Armor), CH120 (Change Height), GB145 (Gravity Ball).
- **Performance Tip / Bottom:** ABS or rubber. Tip type drives all stamina physics.

---

## 4.2 Metal System (4-layer) Beyblades

**Pegasis 105F** — Pegasis FW (metal) / 105 track (ABS) / Flat tip (ABS, μ=0.17)  
**Bull 125SF** — Bull FW (metal) / 125 track (ABS) / Semi-Flat tip (ABS)  
**Sagittario 145S** — Sagittario FW (metal) / 145 track (ABS) / Sharp tip (ABS)  
**Leone 145D** — Leone FW (metal) / 145 track (ABS) / Defense tip (ABS)  
**Wolf D125B** — Wolf FW (metal) / D125 track (ABS) / Ball tip (ABS)  
**Aries 125D** — Aries FW (metal) / 125 track (ABS) / Defense tip (ABS)  
**Quetzalcoatl 90WF** — Quetzalcoatl FW (metal) / 90 track (ABS) / Wide Flat tip (ABS)  
**Libra DF145BS** — Libra FW (metal) / DF145 track (ABS) / Ball-Sharp combo tip (ABS)  
**Aquario 105F** — Aquario FW (metal) / 105 track (ABS) / Flat tip (ABS)  
**Virgo DF145BS** — Virgo FW (metal) / DF145 track (ABS) / Ball-Sharp tip (ABS)  
**Pisces D125BS** — Pisces FW (metal) / D125 track (ABS) / Ball-Sharp tip (ABS)  
**L Drago 105F** — L Drago FW (metal, left-spin) / 105 track (ABS) / Flat tip (ABS)  
**Escolpio WD145B** — Escolpio FW (metal) / WD145 track (ABS) / Ball tip (ABS)  
**Gemios DF145FS** — Gemios FW (metal) / DF145 track (ABS) / Flat-Sharp tip (ABS)  
**Capricorne 100HF** — Capricorne FW (metal) / 100 track (ABS) / Hole Flat tip (ABS)

---

## 4.3 Hybrid Wheel System (HWS) Beyblades

The HWS introduces two metal wheels: a heavy Metal Wheel (MW) and a lighter Clear Wheel (CW). The MW carries most of the mass and contact geometry.

**Light Wheels** (Mad, Wind, Clay, etc.): 6–8 g plastic, NOT metal. Do not confuse with Metal Wheels. `[CONFIRMED memory]`

**Storm Pegasis 105RF**
- CW: Pegasis CW (ABS)
- MW: Storm MW (metal, three-wing attack, φ ≈ 15–20°)
- Track: 105 (ABS)
- Bottom: RF — Rubber Flat (rubber, μ=0.50, r=8–10 mm); attack/flower-pattern type
- Type: Attack

**Dark Wolf DF145FS**
- CW: Wolf CW (ABS)
- MW: Dark MW (metal)
- Track: DF145 (ABS)
- Bottom: FS — Flat-Sharp (ABS, combination mode)

**Rock Leone 145WB**
- CW: Leone CW (ABS)
- MW: Rock MW (metal, round/stamina profile)
- Track: 145 (ABS)
- Bottom: WB — Wide Ball (ABS, r=4 mm)
- Type: Defense/Stamina

**Mad Cancer CH120FS**
- CW: Cancer CW (ABS)
- MW: Mad Light Wheel (ABS, 6–8 g plastic — NOT metal)
- Track: CH120 — Change Height 120 (ABS, height-switching)
- Bottom: FS — Flat-Sharp (ABS)

**Flame Sagittario C145S**
- CW: Sagittario CW (ABS)
- MW: Flame MW (metal)
- Track: C145 — Claw 145 (ABS)
- Bottom: S — Sharp (ABS)

**Wind Aquario 100HF/S**
- CW: Aquario CW (ABS)
- MW: Wind Light Wheel (ABS, 6–8 g plastic)
- Track: 100 (ABS)
- Bottom: HF/S — Hole Flat or Sharp combo (ABS)

**Dark Bull H145SD** — Dark MW (metal) / H145 track (ABS) / SD tip (ABS)

**Lightning L Drago 100HF**
- CW: L Drago II CW (ABS)
- MW: Lightning MW (metal, left-spin attack, high smash fraction)
- Track: 100 (ABS)
- Bottom: HF — Hole Flat (ABS, μ=0.17)

**Clay Aries ED145B**
- CW: Aries CW (ABS)
- MW: Clay Light Wheel (ABS, 6–8 g plastic)
- Track: ED145 — Eternal Defense 145 (ABS + bearing; free-spin outer ring, bearingFriction ≈ 0.05–0.08)
- Bottom: B — Ball (ABS)

**Earth Aquila 145WD** — Earth MW (metal) / 145 (ABS) / WD tip (ABS)

**Flame Libra T125ES** — Flame MW (metal) / T125 (ABS) / ES tip (ABS, eternal sharp — free-spin tip)

**Storm Capricorne M145Q**
- MW: Storm MW (metal)
- Track: M145 — Magnet 145 (ABS)
- Bottom: Q — Quake (ABS, cam mechanism; deltaH = 0.388–0.647 mm; [CONFIRMED CS1 Case 14])
- Type: Unique / jumper

**Rock Orso D125B** — Rock MW (metal) / D125 (ABS) / Ball (ABS)

**Counter Leone D125B** — Counter MW (metal) / D125 (ABS) / Ball (ABS)

**Dark Cancer CH120SF** — Dark MW (metal) / CH120 (ABS) / SF (ABS)

**Killer Gemios DF145FS** — Killer MW (metal) / DF145 (ABS) / FS (ABS)

**Thermal Pisces T125ES** — Thermal MW (metal) / T125 (ABS) / ES (ABS, free-spin eternal sharp)

**Cyber Pegasis 100HF** — Cyber MW (metal) / 100 (ABS) / HF (ABS)

**Burn Phoenix 135MS** — Burn MW (metal) / 135 (ABS) / MS — Metal Sharp (metal, μ=0.12)

**Earth Virgo GB145BS** — Earth MW (metal) / GB145 — Gravity Ball 145 (ABS + metal ball weights) / BS (ABS)

**Rock Escolpio T125JB** — Rock MW (metal) / T125 (ABS) / JB — Jog Ball (ABS)

**Poison Serpent SW145SD** — Poison MW (metal) / SW145 — Spiral Wing 145 (ABS) / SD (ABS)

**Galaxy Pegasis W105R²F**
- CW: Pegasis II CW (ABS)
- MW: Galaxy MW (metal, three-wing attack)
- Track: W105 — Wing 105 (ABS)
- Bottom: R²F — Right Rubber Flat (rubber, μ=0.50; clockwise flower pattern)

**Ray Unicorno D125CS** — Ray MW (metal) / D125 (ABS) / CS — Circle Sharp (ABS)

**Thermal Lacerta WA130HF** — Thermal MW (metal) / WA130 — Wide Armor 130 (ABS) / HF (ABS)

**Mercury Anubius 85XF** — Mercury MW (metal) / 85 (ABS) / XF — Extreme Flat (ABS, max-width flat)

**Infinity Libra GB145S** — Infinity MW (metal) / GB145 (ABS + metal balls) / S (ABS)

**Rock Giraffe R145WB** — Rock MW (metal) / R145 — Rubber 145 (rubber ring track) / WB (ABS)

**Gravity Perseus AD145WD**
- MW: Gravity MW (metal, mode-switchable via spin direction; right-spin = defense, left-spin = attack)
- Track: AD145 — Armor Defense 145 (ABS, armored wide profile)
- Bottom: WD — Wide Defense (ABS)
- Note: Gravity Perseus is ambidextrous — changes attack pattern based on spin direction setting.

**Bakushin Susanow 90WF** — Bakushin MW (metal) / 90 (ABS) / WF (ABS)

**Sol Blaze V145AS** — Sol Blaze MW (metal) / V145 — Vortex 145 (ABS) / AS (ABS, auto-sharp)

**Vulcan Horuseus 145D** — Vulcan MW (metal) / 145 (ABS) / D (ABS)

**Grand Ketos T125RS / WD145RS** — Grand MW (metal) / T125 or WD145 (ABS) / RS — Rubber Sharp (rubber tip on sharp profile; μ=0.50, r≈0.8 mm)

**Poison Giraffe S130MB** — Poison MW (metal) / S130 — Spike 130 (ABS) / MB — Metal Ball (metal, μ=0.12)

**Meteo L Drago LW105LF**
- CW: L Drago II CW (ABS)
- MW: Meteo MW (metal, left-spin with rubber outer edge for spin steal)
- Track: LW105 — Left Wing 105 (ABS)
- Bottom: LF — Left Flat (ABS, flat but guides left-spin orbital pattern)
- Type: Spin Steal / Attack (rubber spin steal + aggressive movement)

**Ray Gil 100RSF** — Ray MW (metal) / 100 (ABS) / RSF — Rubber Semi-Flat (rubber, μ=0.50)

**Tornado Herculeo 105F** — Tornado MW (metal) / 105 (ABS) / F (ABS)

**Flame Byxis 230WD** — Flame MW (metal) / 230 track (ABS, very tall = very high FW contact) / WD (ABS)

**Divine Chimera TR145FB** — Divine MW (metal) / TR145 — Triple Ring 145 (ABS) / FB — Flat Ball (ABS)

**Nightmare Rex SW145SD** — Nightmare MW (metal) / SW145 (ABS) / SD (ABS)

**Killer Beafowl UW145EWD** — Killer MW (metal) / UW145 — Under Wing 145 (ABS) / EWD — Eternal Wide Defense (ABS + bearing, μ=0.12)

**Hell Kerbecs BD145DS**
- MW: Hell MW (metal, wide defense profile)
- Track: BD145 — Boost Disk 145 (ABS)
- Bottom: DS — Defense Sharp (ABS)
- Type: Defense

**Screw Capricorne 90MF** — Screw MW (metal) / 90 (ABS) / MF — Metal Flat (metal, μ=0.12)

**Basalt Horogium 145WD**
- MW: Basalt MW (metal, heaviest standard MFB wheel — ~44.50 g [CONFIRMED CS6])
- Track: 145 (ABS)
- Bottom: WD — Wide Defense (ABS)
- Type: Defense/Stamina (extreme mass, high I)

---

## 4.4 4D System Beyblades

The 4D system introduces a two-part 4D Metal Wheel (Inner + Outer can spin semi-independently on impact) and a set of fused A:B Bottoms that replace both the Track and Bottom as a single integrated component.

**A:B Notation — Fused Track+Bottom:** When a beyblade's name ends with a colon-separated pair (e.g., F:D, F:S, D:D, B:D, X:D), the colon denotes a single part that performs the function of BOTH a Spin Track (setting wheel height) AND a Performance Tip. These are listed as "4D Bottom" in the official part breakdown — there is no separate track. Beyblades without A:B notation (Fang Leone 130W²D, Beat Lynx TH170WD, Scythe Kronos T125EDS, etc.) use a conventional separate Track + Bottom.

**Fused 4D Bottom list:** F:D = Final Drive · F:S = Final Survive · D:D = Delta Drive · B:D = Bearing Drive · X:D = X Drive

**F:D mode-switch threshold:** ω_crit = 94.3 rad/s [CONFIRMED CS10 Case 557]. At high spin (ω > 94.3 rad/s): Phase 1 — SF cone (ABS, dω/dt = 28.6 rad/s², moderate attack movement). When spin falls below threshold, centrifugal arm retracts → Phase 2 — rubber HF annular contact (rubber, μ=0.50, instant spin drain of ~0.3 s from switch point). Inverse of F:S. [CONFIRMED CS6 Case 344]

**Big Bang Pegasis F:D**
- CW: Pegasis III CW (ABS)
- MW: Big Bang 4D MW (metal, two-part: inner + outer; outer spins semi-freely)
- 4D Bottom (fused Track+Bottom): F:D — Final Drive (5.85 g); centrifugal auto-switch: ω > 81.6–94.3 rad/s → Phase 1 SF cone (ABS, μ=0.17), ω below threshold → Phase 2 rubber HF annular (rubber, μ=0.50); threshold ω_crit = 94.3 rad/s [CONFIRMED CS10 Case 557]
- Type: Attack (high spin) → Stamina drain on opponent (low spin auto-switch to rubber phase)

**Fang Leone 130W²D**
- CW: Leone II CW (ABS)
- MW: Fang 4D MW (metal, fang/claw attack)
- Track: 130 (ABS)
- Bottom: W²D — Wave Wide Defense (ABS)
- Type: Defense

**Beat Lynx TH170WD**
- MW: Beat 4D MW (metal)
- Track: TH170 — Triple Height 170 (ABS, very tall — contact at upper body height)
- Bottom: WD (ABS)

**L Drago Destroy F:S**
- CW: absent (no 4D Clear Wheel)
- MW: L Drago Destroy 4D MW (metal, left-spin; three rubber absorb sections on inner ring for spin steal)
- 4D Bottom (fused Track+Bottom): F:S — Final Survive (5.73 g, ABS); centrifugal auto-switch: ω above threshold → Phase 1 HF annular (ABS, hollow flat; orbital attack), ω below threshold → Phase 2 Sharp cone (ABS, Sneddon 35°); TT mould switch ω_crit ≈ 57.7 rad/s, SonoKong mould ≈ 89.4 rad/s [CONFIRMED CS6 Case 348]
- Type: Spin Steal / Absorb (left-spin rubber steal + F:S centrifugal mode change)

**Scythe Kronos T125EDS**
- CW: Kronos CW (ABS)
- MW: Scythe 4D MW (metal, large scythe/ring stamina profile)
- Track: T125 (ABS)
- Bottom: EDS — Eternal Defense Sharp (ABS + bearing eternal defense with sharp center)

**VariAres D:D**
- CW: absent (no 4D Clear Wheel)
- MW: VariAres 4D MW (metal, centrifugal PC Frame retraction; in-battle automatic mode change)
- 4D Bottom (fused Track+Bottom): D:D — Delta Drive (5.5 g, ABS); pre-battle MANUAL three-tip selector (pull axially, rotate 120°, re-engage); three modes: Sharp (r_tip=0.3mm, μ≈0.20, ABS), Wide Ball (r_dome=4mm, μ≈0.25, ABS), Flat (r=8mm, μ≈0.35, ABS); chosen mode is fixed for the entire battle — NO in-battle auto-switch [CONFIRMED CS5 Case 992]
- Type: Attack / Variable

**Jade Jupiter S130RB** — Jade 4D MW (metal) / S130 (ABS) / RB — Rubber Ball (rubber, μ=0.50)

**Forbidden Eonis 130D / ED145FB** — Forbidden 4D MW (metal) / 130 or ED145 (ABS) / D or FB (ABS)

**Divine Crown TR145D / Hell Crown 130FB** — Crown MW (metal) variants

**Screw Lyra ED145MF** — Screw MW (metal) / ED145 (ABS + bearing) / MF (metal, μ=0.12)

**Blitz Unicorno 100RSF** — Blitz 4D MW (metal) / 100 (ABS) / RSF (rubber, μ=0.50)

**Phantom Orion B:D**
- CW: Orion CW (ABS)
- MW: Phantom 4D MW (metal, extremely wide stamina ring — highest I of 4D line)
- 4D Bottom (fused Track+Bottom): B:D — Bearing Drive (ABS plastic disc body with large holes; only metal = single steel ball bearing seated in shaft bore; μ_bearing=0.05 shaft-to-disc coupling, floor contact = ABS disc μ=0.17; LAD-capable zombie type) [CONFIRMED CS10 Case 551]
- Type: Stamina/Zombie (extreme spin life via bearing decoupling + wide MW)

**Death Quetzalcoatl 125RDF** — Death 4D MW (metal) / 125 (ABS) / RDF — Rubber Defense Flat (rubber, μ=0.50)

**Duo Uranus 230WD** — Duo 4D MW (metal) / 230 (ABS, very tall) / WD (ABS)

**L Drago Guardian S130MB** — L Drago 4D variant / S130 (ABS) / MB (metal, μ=0.12)

**Wing Pegasis 90WF** — Wing 4D MW (metal) / 90 (ABS) / WF (ABS)

**Diablo Nemesis X:D**
- CW: Nemesis CW (ABS)
- MW: Diablo 4D MW (metal, largest/heaviest 4D wheel; semi-free Metal Frame cams against X:D tabs)
- 4D Bottom (fused Track+Bottom): X:D — X Drive (7.19 g, ABS); C₄ layout; three-tip stochastic selector via cam-follower (any impact > 0.127 N triggers mode change — effectively random mid-battle); tips: XF (r=2.955mm, ABS, μ=0.17), S²D (cone+base), third mode; r_full=14.5mm; generates 83% more orbital torque than standalone XF → prone to self-KO [CONFIRMED CS6 Case 345]
- Type: Attack / Final Boss

**Fusion Hades AD145SWD** — Fusion 4D MW (metal) / AD145 (ABS) / SWD (ABS)

**Bakushin Beelzeb T125XF / Hell Beelzeb 125XF** — Bakushin/Hell 4D MW (metal) / T125 or 125 (ABS) / XF (ABS)

**Kreis Cygnus 145WD** — Kreis 4D MW (metal) / 145 (ABS) / WD (ABS)

**Omega Dragonis 85XF** — Omega 4D MW (metal) / 85 (ABS) / XF (ABS)

**Flash Sagittario 230WD** — Flash 4D MW (metal) / 230 (ABS) / WD (ABS)

---

## 4.5 Zero-G / Synchrome System Beyblades

**System change:** Each Zero-G bey has a Crystal Wheel (outer light ABS shell, low inertia contribution) and a Chrome Wheel (the main mass piece, dominant I contributor). Synchrome stacks TWO Chrome Wheels together — one from each constituent bey — for a combined mass/inertia gain. Combining two Crystal Wheels alone would achieve nothing useful (too light). The resulting Synchrome bey is named by combining both Chrome Wheel names (e.g., "Gryph Girago" = Girago Chrome Wheel + Gryph Chrome Wheel).

**Samurai Ifraid W145CF** — Ifraid Chrome Wheel (ABS) / W145 (ABS) / CF (ABS)

**Shinobi Saramanda SW145SD** — Saramanda Chrome Wheel (ABS) / SW145 (ABS) / SD (ABS)

**Pirates Orojya 145D** — Orojya Chrome Wheel (ABS) / 145 (ABS) / D (ABS)

**Thief Phoenic E230GCF** — Phoenic Chrome Wheel (ABS) / E230 (ABS) / GCF (ABS)

**Guardian Revizer 160SB** — Revizer Chrome Wheel (ABS) / 160 (ABS) / SB (ABS)

**Archer Gryph C145S** — Gryph Chrome Wheel (ABS) / C145 (ABS) / S (ABS)

**Pirates Killerken A230JSB** — Killerken Chrome Wheel (ABS) / A230 (ABS) / JSB (ABS)

**Dark Knight Dragooon LW160BSF** — Dragooon Chrome Wheel (ABS) / LW160 (ABS) / BSF (ABS)

**Archer Gargole SA165WSF** — Gargole Chrome Wheel (ABS) / SA165 (ABS) / WSF (ABS)

**Bandid Goreim DF145BS** — Goreim Chrome Wheel (ABS) / DF145 (ABS) / BS (ABS)

**Berserker Begirados SR200BWD** — Begirados Chrome Wheel (ABS) / SR200 (ABS) / BWD (ABS)

**Bandid Genbull F230TB** — Genbull Chrome Wheel (ABS) / F230 (ABS) / TB (ABS)

**Gryph Girago WA130HF** — Synchrome: Girago Chrome Wheel + Gryph Chrome Wheel / WA130 / HF (ABS)

**Saramanda Balro DF145SWD** — Synchrome: Balro + Saramanda Chrome Wheels / DF145 / SWD (ABS)

**Killerken Balro A230WB** — Synchrome: Balro Chrome Wheel + Killerken Chrome Wheel / A230 / WB (ABS)

**Orojya Wyvang 145EDS** — Synchrome: Wyvang Chrome Wheel + Orojya Chrome Wheel / 145 / EDS (ABS + bearing)

**Samurai Pegasis W105R²F** — Pegasis Chrome Wheel (ABS) / W105 / R²F (rubber, μ=0.50)

**Gladiator Bahamdia SP230GF** — Bahamdia Chrome Wheel + Gladiator Chrome Wheel (ABS) / SP230 / GF (ABS) — notable for ultra-tall SP230 track

---

# PART V: GENERATION 3 — BURST SYSTEM

---

## 5.1 System Overview

**Years:** 2015–2022 (Beyblade Burst series, Takara Tomy Japan only from 4D onward)  
**Sub-systems:** Standard Burst (2015) → God Layer (2017) → Cho-Z / Dash (2018) → Gatinko / GT (2019) → Sparking / SK (2020) → Dynamite Battle / DB (2021) → Burst Ultimate / BU (2022)  
**Defining mechanic:** Burst — the Energy Layer separates from the Forge Disc when the PC cantilever tabs deflect past the Forge Disc's burst teeth threshold. This is a contact-force event, not a spin-speed event.  
**Physics signature:** Layer blades project DOWNWARD (contact 5–15 mm); inertia dominated by Layer (57–65%) + Disc (35–41%); Driver = small inertia contribution (<1%)

**Stack (Standard Burst):** Energy Layer → Forge Disc → Performance Tip (Driver)  
**Stack (God / Cho-Z):** God/Cho-Z Energy Layer → Forge Disc → Driver  
**Stack (GT / Gatinko):** GT Chip → Layer Base → Forge Disc → Driver  
**Stack (SK / Sparking):** Sparking Chip → Layer Base → Forge Disc → Driver  
**Stack (DB):** DB Core → Armor → Layer Ring → Forge Disc → Driver  
**Stack (BU):** Ultimate Reboot Driver / various revised driver types  

### Naming Convention — TT JP Canonical Names

| TT JP (correct) | Hasbro equivalent (cross-reference only) |
|----------------|------------------------------------------|
| Valkyrie | Valtryek |
| Storm Spriggan | Spryzen S2 |
| Spriggan | Spryzen |
| Spriggan Requiem | Turbo Spriggan / Spryzen Requiem |
| Dead Phoenix | Dread Phoenix [Hasbro] |
| Dead Hades | Dread Hades [Hasbro] |
| Cho-Z Valkyrie | Turbo Valkyrie [Hasbro] |

**Critical:** "Dead" base (デッド) and "Dread" base (ドレッド) are TWO DISTINCT Gatinko Layer Bases. Dead Phoenix uses the Dead base. Dread Bahamut uses the Dread base. Never substitute one for the other. [CS9 Nomenclature Rules]

### DB High / Low Mode

The DB (Dynamite Battle) system allows the DB Core and Armor to be placed in two configurations:

- **Low Mode:** DB Core on top, Armor on bottom. Lower center of mass → stable, defense-oriented.
- **High Mode:** Armor on top, DB Core on bottom. Taller stack, higher CoM → more precession sensitivity, attack-oriented. Shifts CoM by approximately ±7 mm.

---

## 5.2 Standard Burst — Case Study: Winning Valkyrie (Case 1001)

**Winning Valkyrie Energy Layer (B-01, WV.12.V assembly)**

**Material:** Polycarbonate (PC, E = 2.4 GPa, ρ = 1200 kg/m³)  
**Symmetry:** C₃ (three blades at 120° intervals)  
**Outer radius:** r_o = 17 mm [FACT]  
**Inner bore radius:** r_i = 4 mm [FACT]  
**Layer mass:** 15.2 g [FACT]  

**Burst Tab Mechanics:**
```
Tab geometry: L = 5.0 mm, b = 3.0 mm, h = 0.55 mm (PC cantilever)
I_tab = b·h³/12 = 3.0×10⁻³ × (5.5×10⁻⁴)³ / 12 = 4.160×10⁻¹⁴ m⁴
k_tab = 3EI/L³ = 3(2.4×10⁹)(4.160×10⁻¹⁴)/(5.0×10⁻³)³ = 2.40×10³ N/m
F_tab = k × δ_max = 2400 × 0.30×10⁻³ = 0.720 N
τ_burst = 2 tabs × 0.720 N × 7.5×10⁻³ m = 10.8 mN·m   [CONFIRMED]
```

**Burst threshold comparison:**
- WV (2-tab, Standard Burst): **10.8 mN·m** — easiest to burst
- BX 5-tab Ratchet: **13.3 mN·m** (+23%)
- BX 7-tab Ratchet (-70 / -80): **18.6 mN·m** (+72%)

**Contact geometry:**
- Contact face angle φ = 22° from radial
- Smash fraction: cos(22°) = 0.927
- Recoil fraction: sin(22°) = 0.375
- Contact frequency at ω₀ = 600: f = 3 × 600 / (2π) = 286 Hz

**Inertia Budget (WV.12.V full assembly):**
```
Energy Layer (15.2 g, r_i=4 mm, r_o=17 mm):  I_L = 2.318×10⁻⁶ kg·m²  (57.7%)
Forge Disc 12 (15.8 g, r_i=4 mm, r_o=14 mm): I_D = 1.675×10⁻⁶ kg·m²  (41.7%)
Velocity Driver (3.1 g):                       I_V = 0.025×10⁻⁶ kg·m²   (0.6%)
I_total = 4.018×10⁻⁶ kg·m²   [CONFIRMED CS9 Case 1001]
Total mass m = 34.1 g  [FACT]
```

**Spin decay (Velocity driver, μ=0.17, r=0.5 mm):**
```
dω/dt = −(0.17 × 0.03410 × 9.81 × 5.0×10⁻⁴) / 4.018×10⁻⁶ = −7.08 rad/s²
t to 50% spin: 300 / 7.08 = 42.4 s (floor decay only, no collisions)
```

---

## 5.3 Standard Burst Driver — Case Study: Xtreme Performance Tip (Case 1002)

**Xtreme Performance Tip (Xt) — rubber annular contact**

**Contact geometry:**
- Outer contact radius r_ring = 4.0 mm
- Central void radius r_void = 2.0 mm
- Effective friction moment arm: r_eff = 2(r_o³ − r_i³) / (3(r_o² − r_i²)) = **3.11 mm**
- Solid-disc reference (r=4, no void): r_eff_solid = 2.67 mm
- Void amplification: 3.11/2.67 = +16.6% higher moment arm

**Spin decay (on WV assembly, 34.1 g, I=4.018×10⁻⁶):**
```
μ_k = 0.85 [illustrative — CS1/CS9 historical value; actual rubber μ = 0.50 CONFIRMED CS10]
τ_floor = μ × W × r_eff = 0.85 × 0.3345 × 3.111×10⁻³ = 8.838×10⁻⁴ N·m
dω/dt = −8.838×10⁻⁴ / 4.018×10⁻⁶ = −220 rad/s²
t to 50% spin: 300/220 = 1.36 s

With confirmed μ = 0.50 [CONFIRMED CS10]:
τ_floor = 0.50 × 0.3345 × 3.111×10⁻³ = 5.199×10⁻⁴ N·m
dω/dt = −129 rad/s²   [INFERRED]
```
Comparative: Xtreme decays ~18–31× faster than Velocity (sharp ABS) tip. Attack window must yield burst or ring-out before self-spin-out.

---

## 5.3b Standard (Single Layer) System — Products [FACT — beyblade.wiki]

All Energy Layers: polycarbonate (PC). Forge Discs: ABS. Drivers: ABS unless noted.

| B-# | Full Name | Layer | Disc | Driver |
|-----|-----------|-------|------|--------|
| B-01 | Valkyrie Wing Accel | Valkyrie | Wing | Accel |
| B-02 | Spriggan Spread Fusion | Spriggan | Spread | Fusion |
| B-03 | Ragnaruk Heavy Survive | Ragnaruk | Heavy | Survive |
| B-04 | Kerbeus Central Defense | Kerbeus | Central | Defense |
| B-05 | Spriggan Heavy Defense | Spriggan | Heavy | Defense |
| B-06 | Ragnaruk Central Accel | Ragnaruk | Central | Accel |
| B-07 | Kerbeus Wing Fusion | Kerbeus | Wing | Fusion |
| B-12 | Deathscyther Oval Accel | Deathscyther | Oval | Accel |
| B-13 | Valkyrie Spread Survive | Valkyrie | Spread | Survive |
| B-14 | Wyvern Armed Massive | Wyvern | Armed | Massive |
| B-23 | Xcalibur Force Xtreme | Xcalibur | Force | Xtreme |
| B-28 | Neptune Armed Zephyr | Neptune | Armed | Zephyr |
| B-31 | Yggdrasil Ring Gyro | Yggdrasil | Ring | Gyro |

**All Single Layers (17):** Valkyrie, Spriggan, Ragnaruk, Kerbeus, Deathscyther, Odin, Wyvern, Horusood, Neptune, Yggdrasil, Evil-Eye, Xcalibur, Unicorn, Minoboros, Trident, Chaos, Amaterios

---

## 5.3c Dual Layer System — Products [FACT — beyblade.wiki]

Dual Layer difference: two interlocking shell plates (Upper + Lower) form the Energy Layer, enabling asymmetric blade geometry.

| B-# | Full Name | Layer | Disc | Driver |
|-----|-----------|-------|------|--------|
| B-34 | Victory Valkyrie Boost Variable | Victory Valkyrie | Boost | Variable |
| B-35 | Storm Spriggan Knuckle Unite | Storm Spriggan | Knuckle | Unite |
| B-36 | Rising Ragnaruk Gravity Revolve | Rising Ragnaruk | Gravity | Revolve |
| B-37 | Kaiser Kerbeus Limited Press | Kaiser Kerbeus | Limited | Press |
| B-41 | Wild Wyvern Vertical Orbit | Wild Wyvern | Vertical | Orbit |
| B-42 | Dark Deathscyther Force Jaggy | Dark Deathscyther | Force | Jaggy |
| B-44 | Holy Horusood Upper Claw | Holy Horusood | Upper | Claw |
| B-46 | Obelisk Odin Triple Xtreme | Obelisk Odin | Triple | Xtreme |
| B-48 | Xeno Xcalibur Magnum Impact | Xeno Xcalibur | Magnum | Impact |
| B-56 | Unlock Unicorn Down Needle | Unlock Unicorn | Down | Needle |
| B-59 | Zillion Zeus Infinity Weight | Zillion Zeus | Infinity | Weight |
| B-63 | Beast Behemoth Heavy Hold | Beast Behemoth | Heavy | Hold |
| B-66 | Lost Longinus Nine Spiral | Lost Longinus | Nine | Spiral |
| B-69 | Jail Jormungand Infinity Cycle | Jail Jormungand | Infinity | Cycle |
| B-71 | Acid Anubis Yell Orbit | Acid Anubis | Yell | Orbit |

---

## 5.4 God Layer System

**God Layer** introduces a two-piece Energy Layer (God Chip + Layer Base for some releases) and the Forge Disc with a frame (God Disc variants). Attack-oriented layers have steeper blade geometry and higher inertia for more burst capability.

Representative God Layer types:
- **3-tab PC cantilever** (God-era): k_tab estimated higher than Standard (thicker h ≈ 0.70 mm) → τ_burst ≈ 33.4 mN·m [INFERRED from CS9 TypeScript model]
- **Free-spinning outer ring** (God Valkyrie, God Spriggan): outer disc decouples to absorb attacks

### God Layer System — Products [FACT — beyblade.wiki / beybladeplanner.com]

God-era Disc system: Core Disc (metal, numbered 0–13) + optional Disc Frame (ABS, named). Burst threshold ≈ 33.4 mN·m [INFERRED CS9 TypeScript model] vs Standard 10.8 mN·m [CONFIRMED].

| B-# | Full Name | God Layer | Core Disc | Disc Frame | Driver |
|-----|-----------|-----------|-----------|------------|--------|
| B-73 | God Valkyrie 6Vortex Reboot | God Valkyrie | 6 | Vortex | Reboot |
| B-74 | Kreis Satan 2Glaive Loop | Kreis Satan | 2 | Glaive | Loop |
| B-75 | Blaze Ragnaruk 4Cross Flugel | Blaze Ragnaruk | 4 | Cross | Flugel |
| B-79 | Drain Fafnir 8Nothing | Drain Fafnir | 8 | — | Nothing |
| B-82 | Alter Chronos 6Meteor Trans | Alter Chronos | 6 | Meteor | Trans |
| B-85 | Killer Deathscyther 2Vortex Hunter | Killer Deathscyther | 2 | Vortex | Hunter |
| B-86 | Legend Spriggan 7Merge | Legend Spriggan | 7 | — | Merge |
| B-89 | Blast Jinnius 5Glaive Guard | Blast Jinnius | 5 | Glaive | Guard |
| B-92 | Sieg Xcalibur 1Iron | Sieg Xcalibur | 1 | — | Iron |
| B-97 | Nightmare Longinus Destroy | Nightmare Longinus | — | — | Destroy |
| B-100 | Spriggan Requiem 0Zeta | Spriggan Requiem | 0 | — | Zeta |
| B-102 | Twin Nemesis 3Hit Ultimate Reboot | Twin Nemesis | 3 | Hit | Ultimate Reboot |
| B-103 | Screw Trident 8Bump Wedge | Screw Trident | 8 | Bump | Wedge |

**All God Layers (31):** God Valkyrie, Nightmare Longinus, Perfect Phoenix, Gaia Dragoon, Storm Pegasis, Driger Fang, Lightning L-Drago, Dragoon Fantom, Arc Bahamut, Beat Kukulcan, Deep Chaos, Left Apollos, Left Eclipse, Right Artemis, Right Eclipse, Screw Trident, Shelter Regulus, Spriggan Requiem, Twin Nemesis, Alter Chronos, Blast Jinnius, Blaze Ragnaruk, Drain Fafnir, Galaxy Zeus, Guardian Kerbeus, Killer Deathscyther, Kreis Satan, Legend Spriggan, Maximum Garuda, Sieg Xcalibur, Tornado Wyvern

---

## 5.5 Cho-Z / Turbo System

**Cho-Z Layer** introduces metal contact points embedded in the layer body — zinc alloy or aluminum tips at the outer blade edges. This produces the "Turbo Awakening" state in competitive play.

**Turbo Awakening (Cho-Z Wing Blade)**:
- Cho-Z Wing deploys additional blade edges at r_turbo = 37 mm (+4 mm vs. standard contact radius)
- Burst Stopper mechanism prevents burst during the deployed state
- Tip velocity at deployed radius: Δv_tip = Δr × ω = 4×10⁻³ × 580 ≈ 2.32 m/s [INFERRED memory]
- Anime multiplier: 7.5–8.0× standard attack power [ANIME/GAME; users: Valt, Shu, Aiger]

### Cho-Z System — Products [FACT — beyblade.wiki / beybladeplanner.com]

Metal integration: zinc alloy or aluminum blade inserts at r ≈ 33–37 mm. μ_metal = 0.12 (metal-on-PC contact) [CONFIRMED CS10]. Disc primes (1′, 8′, 00) are frame-extended variants.

| B-# | Full Name | Cho-Z Layer | Disc | Driver |
|-----|-----------|-------------|------|--------|
| B-104 | Winning Valkyrie 12Volcanic | Winning Valkyrie | 12 | Volcanic |
| B-105 | Z Achilles 11Xtend | Z Achilles | 11 | Xtend |
| B-106 | Emperor Forneus 0Yard | Emperor Forneus | 0 | Yard |
| B-110 | Bloody Longinus 13Jolt | Bloody Longinus | 13 | Jolt |
| B-113 | Hell Salamander 12Operate | Hell Salamander | 12 | Operate |
| B-115 | Archer Hercules 13Eternal | Archer Hercules | 13 | Eternal |
| B-117 | Revive Phoenix 10Friction | Revive Phoenix | 10 | Friction |
| B-120 | Buster Xcalibur 1′Sword | Buster Xcalibur | 1′ | Sword |
| B-122 | Geist Fafnir 8′Absorb | Geist Fafnir | 8′ | Absorb |
| B-127 | Cho-Z Valkyrie Zenith Evolution | Cho-Z Valkyrie | Zenith | Evolution |
| B-129 | Cho-Z Achilles 00Dimension | Cho-Z Achilles | 00 | Dimension |
| B-131 | Dead Phoenix 0Atomic | Dead Phoenix | 0 | Atomic |

**All Cho-Z Layers (27):** Dead Phoenix, Air Knight, Cho-Z Achilles, Orb Egis, Cho-Z Spriggan, Cho-Z Valkyrie, Dead Hades, Geist Fafnir, Hazard Kerbeus, Wolborg, Buster Xcalibur, Revive Phoenix, Archer Hercules, Hell Salamander, Z Achilles, Crash Ragnaruk, Emperor Forneus, Bloody Longinus, Vise Leopard, Winning Valkyrie, Prime Apocalypse, Regalia Genesis, Imperial, Shadow Amaterios, Shining Amaterios, Orb Egis (second variant), Archer Hercules

---

## 5.6 GT / Gatinko System

**GT (Gatinko) Layer** splits into Gatinko Chip + Layer Base. The Chip is the avatar/identifier piece; the Layer Base carries all physics geometry. Layer Bases are interchangeable.

Key Layer Bases:
- **Dead base (デッド):** Used in Dead Phoenix (B-148) and Dead Hades. Defense-oriented.
- **Dread base (ドレッド):** Used in Dread Bahamut. Distinct from Dead base — do not confuse.

**Move names using TT JP:**
- Dead Stinger (デッドスティンガー) — not "Dread Cannon"
- Dead Dive — not "Dread Dive"

### GT / Gatinko System — Products [FACT — beyblade.wiki / beybladeplanner.com]

**Stack: GT Chip + Layer Base + (optional Layer Weight) + Forge Disc + Driver**  
GT Chip has negligible inertia (small ABS piece, r ≈ 4–6 mm). Layer Base dominates layer physics. Layer Weights are metal inserts that adjust inertia.

| B-# | Full Name | GT Chip | Layer Base | Disc | Driver |
|-----|-----------|---------|------------|------|--------|
| B-133 | Ace Dragon Sting Charge Zan | Dragon | Ace | Sting | Charge |
| B-134 | Slash Valkyrie Blitz Power Retsu | Valkyrie | Slash | Blitz | Power |
| B-135 | Bushin Ashura Hurricane Keep Ten | Ashura | Bushin | Hurricane | Keep |
| B-139 | Wizard Fafnir Ratchet Rise Sen | Fafnir | Wizard | Ratchet | Rise |
| B-142 | Judgement Joker 00Turn Trick Zan | Joker | Judgement | 00 | Turn Trick |
| B-144 | Zwei Longinus Drake Spiral′ Metsu | Longinus | Zwei | Drake | Spiral′ |
| B-145 | Venom Diabolos Vanguard Bullet | Diabolos | Venom | Vanguard | Bullet |
| B-148 | Heaven Pegasus 10Proof Low Sen | Pegasus | Heaven | 10 | Proof Low |
| B-150 | Union Achilles Convert Xtend+ Retsu | Achilles | Union | Convert | Xtend+ |
| B-154 | Imperial Dragon Ignition′ | Dragon II | Imperial | — | Ignition′ |
| B-155 | Master Diabolos Generate | Diabolos II | Master | — | Generate |
| B-157 | Big-Bang Genesis 0Yard Metal | — | Big-Bang Genesis | 0 | Yard |

**All GT Layer Bases (26):** Slash, Zwei, Ace, Bushin, Cosmo, Dread, Erase, Flare, Heaven, Grand, Judgement, Knockout, Lord, Poison, Rock, Tact, Union Power, Venom, Wizard, Union Speed, Big-Bang Genesis, Draciel Shield, Dragoon Storm, Dead, Imperial, Master  
**All GT Chips (15):** Hydra, Ashura, Achilles, Bahamut, Diabolos, Dragon, Fafnir, Joker, Longinus, Odin, Spriggan, Valkyrie, Pegasus, Diabolos II, Dragon II  
**Layer Weights (GT accessories, 9):** Gen, Sen, So, Retsu, Metsu, Ten, Zan, Goku, Go — metal inserts that slide into Layer Base weight slot

---

## 5.7 DB / Dynamite Battle System

**DB System** stack: DB Core → DB Armor → Layer Ring → Forge Disc → Driver

- DB Core and Armor swap to create High Mode (attack) and Low Mode (defense/stamina) configurations
- High Mode: Armor on top, DB Core on bottom → taller CoM, more tilt sensitivity
- Low Mode: DB Core on top, Armor on bottom → lower CoM, stable

### DB / Dynamite Battle System — Products [FACT — beyblade.wiki / beybladeplanner.com]

**Number suffix = Forge Disc number (e.g., Venture-2 = Venture driver + Disc 2)**

| B-# | Full Name | DB Blade | DB Core | DB Armor # | Driver |
|-----|-----------|----------|---------|------------|--------|
| B-180 | Dynamite Belial Nexus Venture-2 | Dynamite | Belial | 2 | Venture |
| B-185 | Vanish Fafnir Tapered Kick-3 | Vanish | Fafnir | 3 | Kick |
| B-187 | Savior Valkyrie Shot-7 | Savior | Valkyrie | 7 | Shot |
| B-188 | Astral Spriggan Over Quattro-0 | Astral | Spriggan | 0 | Quattro |
| B-189 | Guilty Longinus Karma Metal Destroy-2 | Guilty | Longinus | 2 | Destroy |
| B-192 | Greatest Raphael Over High Xtend+′ | Greatest Raphael | Raphael | — | Xtend+′ |
| B-193 | Ultimate Valkyrie Legacy Variable′-9 | Ultimate | Valkyrie II | 9 | Variable′ |
| B-195 | Prominence Valkyrie Over Atomic-0 | Prominence | Valkyrie | 0 | Atomic |

**All DB Blades (15):** Dynamite, Cyclone, Vanish, Roar, Savior, Astral, Guilty, Devil, Dynamite+F, Dangerous, Dangerous+F, Devil+F, Prominence, Ultimate, Greatest Raphael  
**All DB Cores (22):** Belial, Ragnaruk, Fafnir, Perseus, Bahamut, Valkyrie, Spriggan, Longinus, Belial II, Phoenix, Valkyrie II, Dragon, Kerbeus, Xcalibur, Hello Kitty, Knight, Achilles, Hyperion, Helios, Belial III, Spriggan II, Lucifer  
**DB Armor numbers:** 0, 1, 2, 3, 4, 6, 7, 8, 9, 10, LGear, HGear

---

## 5.8 Superking (Sparking / SK) System

**Years:** 2020–2021  
**Stack:** SK Ring + SK Chip + SK Chassis → Forge Disc → Driver  
**Physics note:** SK Chassis replaces the traditional Layer Base and Forge Disc in one unified piece (resin). SK Chip is the avatar identifier. SK Ring is the outer contact ring (ABS; rubber variants exist).

### SK System — Products [FACT — beyblade.wiki / beybladeplanner.com]

| B-# | Full Name | SK Ring | SK Chip | SK Chassis | Driver |
|-----|-----------|---------|---------|------------|--------|
| B-159 | Super Hyperion Xceed 1A | Super | Hyperion | 1Attack | Xceed |
| B-160 | King Helios Zone 1B | King | Helios | 1Balance | Zone |
| B-161 | Glide Ragnaruk Wheel Revolve 1S | Glide | Ragnaruk | 1Stamina | Revolve |
| B-163 | Brave Valkyrie Evolution′ 2A | Brave | Valkyrie | 2Attack | Evolution′ |
| B-167 | Mirage Fafnir Nothing 2S | Mirage | Fafnir | 2Stamina | Nothing |
| B-168 | Rage Longinus Destroy′ 3A | Rage | Longinus | 3Attack | Destroy′ |
| B-169 | Variant Lucifer Mobius 2D | Variant | Lucifer | 2Defense | Mobius |
| B-172 | World Spriggan Unite′ 2B | World | Spriggan | 2Balance | Unite′ |
| B-175 | Lucifer The End Kou Drift | The End | Lucifer | — | Drift |
| B-177 | Jet Wyvern Around Just 1D | Jet | Wyvern | 1Defense | Just |
| B-179 | Death Solomon Metal Fusion 2B | Death | Solomon | 2Balance | Fusion |

**All SK Rings (21):** Super, King, Glide, Brave, Curse, Mirage, Rage, Variant, Death, Abyss, Tempest, First, World, Infinite, Infinite Sword, Infinite Shield, Volcano, Burn, The End, Hollow, Jet  
**All SK Chips (19):** Hyperion, Helios, Ragnaruk, Valkyrie, Satan, Fafnir, Longinus, Lucifer, Diabolos, Dragon, Uranus, Solomon, Spriggan, Achilles, Helios II, Hyperion II, Lucifer II, Deathscyther, Wyvern  
**SK Chassis (10):** 1Attack, 1Balance, 1Stamina, 2Attack, 1Defense, 2Stamina, 3Attack, 2Defense, 2Balance, 4Attack

---

## 5.9 Burst Ultimate (BU) System

**Years:** 2022 (final Burst sub-system before transition to Beyblade X)  
**Stack:** BU Blade + DB Core + DB Armor + Ultimate Reboot Driver (or Bearing Driver)  
**Physics note:** BU Blade replaces the DB Blade on an otherwise DB assembly. The Ultimate Reboot Driver introduces bearing-integrated tip for improved LAD over standard DB drivers.

### BU System — Products [FACT — beyblade.wiki]

| B-# | Full Name | BU Blade | DB Core | Driver |
|-----|-----------|----------|---------|--------|
| B-197 | Divine Belial Nexus Adventure-3 | Divine | Belial | Adventure |
| B-199 | Gatling Dragon Karma Charge Metal′-10 | Gatling | Dragon | Charge Metal′ |
| B-200 | Xiphoid Xcalibur Xanthus Sword′-1 | Xiphoid | Xcalibur | Sword′ |
| B-206 | Barricade Lucifer Illegal Bearing Mobius-10 | Barricade | Lucifer | Bearing Mobius |

**All BU Blades (12):** Divine, Chain, Xiphoid, Gatling, Divine+F, Zest, Divine+A, Wind, King MR, Super MR, Burst, Barricade

---

# PART VI: GENERATION 4 — BEYBLADE X

---

## 6.1 System Overview

**Years:** 2023–present (Beyblade X series, Takara Tomy Japan)  
**Format:** BX Xtreme Launcher; ω₀ ≈ 2000 rad/s (highest of any generation)  
**Physics signature:** Zinc alloy contact points on PMMA blade body; X-Celerator Rail dash mechanic; I_total = 10–20×10⁻⁶ kg·m² (highest of any generation due to high mass + large r_o); tip contact at 5–14 mm

**Stack (BX standard):** Blade → Ratchet → Bit  
**Stack (CX):** Lock Chip + Main Blade + Assist Blade → Ratchet → Bit  
**Stack (CX Expand):** Lock Chip + Over Blade + Metal Blade + Assist Blade → Ratchet → Bit

---

## 6.2 Blade Anatomy

**Three radial zones:**

| Zone | Material | Role |
|------|----------|------|
| Contact points (outer ring) | Zinc alloy (metal) | Primary striker; high density (ρ=6600 kg/m³); dominant I contributor |
| Body (structural frame) | PMMA | Low density, transparent for Gear Chip visibility |
| Launcher hooks (×3) | Metal (BX) or Resin (UX) | Launcher engagement; mass location determines OWD |

**Gear Chip:** Sits beneath PMMA window. Cosmetic rotating disk when Bit engages rail. Expand Blade variants remove rotating Gear Chip (replaced by sticker).

**Spin Direction:** Every Blade is manufactured for exactly ONE spin direction (L or R). Physical stoppers prevent wrong-direction launching. The Ratchet L/R selector aligns assembly only — it cannot override the Blade's stopper.

---

## 6.3 Ratchet System

**Naming convention:** X-YY where X = outer side count, YY = height in tenths of mm.  
Examples: 3-60 (3 sides, 6.0 mm tall), 4-80 (4 sides, 8.0 mm tall).  [CONFIRMED CS7 Case 357]

| Height suffix | Height (mm) | Indent count | Burst resistance |
|---------------|-------------|-------------|------------------|
| -60 | 6.0 mm | 6 | Lowest |
| -70 | 7.0 mm | 7 (asymmetric: 3+4) | Mid (direction-dependent) |
| -80 | 8.0 mm | 8 | Highest |

The 7-indent asymmetric pattern on -70 Ratchets breaks C-symmetry → different burst resistance for clockwise vs. counterclockwise tab contact.

Higher Ratchet = taller CoM = more tilt-sensitive = higher contact reach. Lower Ratchet = lower CoM = more laterally stable.

---

## 6.4 Bit System

The Bit engages the X-Celerator Rail in the Xtreme Stadium. Each tooth-to-rail engagement delivers a brief acceleration burst (dash).

**Dash frequency per lap:** 360° / (tooth count × tooth spacing)  

### Bit Tooth Counts [CONFIRMED CS7 Case 358]

| Bit | Tooth Count | Dashes per Lap (360° ÷ teeth × spacing) | Notes |
|-----|-------------|----------------------------------------|-------|
| Flat (F) | 12 | One dash per 30° rail contact | Maximum dash frequency; controlled trajectory |
| Rush (R) | 10 | One dash per 36° rail contact | 17% fewer dashes than Flat; each dash at higher peak velocity |
| Ball (B) | ~12 | — | Near-stationary; minimal XD rail engagement |
| Needle (N) | — | — | Point contact; minimal XD rail engagement |
| High Taper (HT) | — | — | Elevated profile; reduced rail contact angle |

**Rush vs Flat (key difference):** Rush is **10-tooth** (not 12). The fewer teeth produce larger inter-tooth gaps, meaning each rail-engagement event delivers a sharper velocity spike at the cost of a longer pause between dashes. At equal assembly mass, Rush produces more aggressive burst-movement episodes than Flat but slightly lower total time under thrust per lap.

Fewer teeth → fewer, larger dashes at higher peak velocity.  
More teeth → more frequent, smaller dashes.

Bit tip geometry independently sets floor contact physics (spin decay, movement pattern).

---

## 6.5 BX Basic Line (Case 354)

Metal launcher hooks keep CoM closer to rotational axis (balanced inertia, less OWD than UX).

**Representative: Shark Edge Blade (Case 375)**
- Material: Zinc alloy contact points + PMMA body
- Symmetry: C₃
- Contact geometry: dual-face attack (upper α ≈ 35°, smash φ ≈ 20°)
- I_blade = 1.031×10⁻⁵ kg·m² [CONFIRMED CS8 Case 375]
- Full system (Shark Edge + Ratchet + Bit): 45.5 g total
- I_total = 1.106×10⁻⁵ kg·m² [CONFIRMED CS8]

Smash force decomposition (φ = 20°):
```
smash fraction  = cos(20°) = 0.940
recoil fraction = sin(20°) = 0.342
```

---

## 6.6 UX Unique Line (Case 355)

**Resin launcher hooks** (lower density than BX metal hooks) → more mass at outer zinc ring → higher OWD (Outward Weight Distribution) → greater gyroscopic stability at same spin rate.

**Ratchet-Integrated Blade variants:** Ratchet fused directly into Blade, enabling gimmicks spanning both components (springs, cams, sliding parts at the Blade-Ratchet boundary).

**Expand Blade (Feb 2026):** Integrated Ratchet + Blade assembly without rotating Gear Chip.

---

## 6.7 CX Custom Line (Case 356)

**Three-part Blade stack:** Lock Chip + Main Blade + Assist Blade

**Component roles:**
- **Lock Chip:** Structural lock only (twist-actuated). Metal Lock Chip adds minor inner-zone inertia.
- **Main Blade:** Primary contact points (zinc alloy outer perimeter). Dominant inertia and collision actor.
- **Assist Blade:** PMMA secondary contact surface. Controls vertical contact height and secondary collision geometry. Lower density than Main Blade.

**Total inertia (CX standard):**
```
I_blade_total = I_lock_chip + I_main_blade + I_assist_blade
```

**CX Expand Blade (4-part):** Over Blade (PMMA) + Metal Blade (zinc) + Assist Blade → PMMA top layer changes outer contact to lower-recoil material (PMMA-on-PMMA) while zinc Metal Blade below still dominates inertia.

---

## 6.8 Beyblade X — Complete Product Listings

### Basic Line (BX Series) [FACT — beyblade.wiki / beybxdb.com]

All BX Blades: zinc alloy contact points + PMMA body (metal launcher hooks). Ratchet naming: X-YY (sides × 0.1 mm height). All materials ABS unless noted.

| Code | Full Name | Blade | Ratchet | Bit |
|------|-----------|-------|---------|-----|
| BX-01 | Dran Sword 3-60F | Dran Sword | 3-60 | Flat |
| BX-02 | Hells Scythe 4-60T | Hells Scythe | 4-60 | Taper |
| BX-03 | Wizard Arrow 4-80B | Wizard Arrow | 4-80 | Ball |
| BX-04 | Knight Shield 3-80N | Knight Shield | 3-80 | Needle |
| BX-05 | Wizard Arrow 4-80B (red) | Wizard Arrow | 4-80 | Ball |
| BX-06 | Knight Shield 3-80N (blue) | Knight Shield | 3-80 | Needle |
| BX-13 | Knight Lance 4-80HN | Knight Lance | 4-80 | HNeedle |
| BX-15 | Leon Claw 5-60P | Leon Claw | 5-60 | Point |
| BX-19 | Rhino Horn 3-80S | Rhino Horn | 3-80 | Sharp |
| BX-23 | Phoenix Wing 9-60GF | Phoenix Wing | 9-60 | GFlat |
| BX-26 | Unicorn Sting 5-60GP | Unicorn Sting | 5-60 | GPoint |
| BX-33 | Weiss Tiger 3-60U | Weiss Tiger | 3-60 | Unite |
| BX-34 | Cobalt Dragoon 2-60C | Cobalt Dragoon | 2-60 | Cone |
| BX-38 | Crimson Garuda 4-70TP | Crimson Garuda | 4-70 | TaperPoint |
| BX-44 | Tricera Press M-85BS | Tricera Press | M-85 | BallSharp |
| BX-45 | Samurai Calibur 6-70M | Samurai Calibur | 6-70 | Metal |

Random Booster volumes (BX-14, BX-16, BX-24, BX-27, BX-35, BX-36, BX-39): distribution packs; include Hells Chain 5-60HT, Viper Tail, Sphynx Cowl, Cobalt Drake 4-60F, Shelter Drake, Whale Wave, and others.  
Prize releases: Cobalt Drake 4-60F (Rare Bey Get Battle, Sep 2023), Knight Shield (G3 Tournament prize), Samurai Steel 5-70GF (BX-00 prize).

---

### Unique Line (UX Series) — Ratchet-Integrated Blades [FACT — beyblade.wiki]

UX Blades use resin launcher hooks → higher OWD than BX → greater gyroscopic stability at same mass. Ratchet is fused into the Blade (not a separate part).

| Code | Full Name | Blade | Fused Ratchet | Bit |
|------|-----------|-------|---------------|-----|
| UX-01 | Dran Buster 1-60A | Dran Buster | 1-60 | Accel |
| UX-02 | Hells Hammer 3-70H | Hells Hammer | 3-70 | High |
| UX-03 | Wizard Rod 5-70DB | Wizard Rod | 5-70 | DrillBall |
| UX-05 | Shinobi Shadow 1-80MN | Shinobi Shadow | 1-80 | MNeedle |
| UX-06 | Leon Crest 7-60GN | Leon Crest | 7-60 | GNeedle |
| UX-08 | Silver Wolf 3-80FB | Silver Wolf | 3-80 | FlatBall |
| UX-09 | Samurai Saber 2-70 Level | Samurai Saber | 2-70 | Level |
| UX-11 | Impact Drake 9-60LR | Impact Drake | 9-60 | LongRevolve |
| UX-12 | Ghost Circle 0-80GB | Ghost Circle | 0-80 | GBall |
| UX-13 | Golem Rock 1-60UN | Golem Rock | 1-60 | UniteNeedle |
| UX-14 | Scorpio Spear 0-70Z | Scorpio Spear | 0-70 | Zone |
| UX-15 | Shark Scale 4-50UF | Shark Scale | 4-50 | UFlat |
| UX-17 | Meteor Dragoon 3-70J | Meteor Dragoon | 3-70 | Jaggy |
| UX-18 | Mummy Curse 7-55W | Mummy Curse | 7-55 | Wave |

---

### Custom Line (CX Series) — Three-Part Blades [FACT — beyblade.wiki]

CX naming: Ratchet prefix encodes geometry (S6=6-sided; R4=4-sided right-skew; B6=6-sided balanced; ATr=arc-trigger). Suffix = height mm + bit abbreviation.

| Code | Full Name | Main Blade | Assist Blade | Ratchet | Bit |
|------|-----------|------------|--------------|---------|-----|
| CX-01 | Dran Brave S6-60V | Dran Brave | Brave Assist | S6-60 | Vortex |
| CX-02 | Wizard Arc R4-55LO | Wizard Arc | Arc Assist | R4-55 | LeftOrbit |
| CX-03 | Perseus Dark B6-80W | Perseus Dark | Dark Assist | B6-80 | Wave |
| CX-07 | Pegasus Blast ATr | Pegasus Blast | Blast Assist | ATr | — |
| CX-08 | Cerberus Flame W5-80WB | Cerberus Flame | Flame Assist | W5-80 | WBall |
| CX-09 | Sol Eclipse D5-70TK | Sol Eclipse | Eclipse Assist | D5-70 | TopKnee |
| CX-10 | Wolf Hunt F0-60DB | Wolf Hunt | Hunt Assist | F0-60 | DrillBall |

---

### Special / Anniversary Releases (BXG Series) [FACT — beyblade.wiki / Amazon JP]

| Code | Full Name | Blade | Ratchet | Bit | Note |
|------|-----------|-------|---------|-----|------|
| BXG-01 | Dranzer Spiral 3-80T | Dranzer Spiral | 3-80 | Taper | Anniversary X-Over; right-spin; Balance type |
| BXG-11 | Draciel Shield 7-60D | Draciel Shield | 7-60 | Defense | Anniversary X-Over; Defense type |

**X-Over Project:** TT BX-era remakes of Gen 1 iconic beyblades as full BX-standard assemblies (zinc alloy contact points, standard ratchet/bit system). Dranzer Spiral and Draciel Shield confirmed releases. Additional X-Over remakes (Dragoon, Driger, Draciel) in development as of 2025.

---

# PART VII: GIMMICKS

---

## 7.1 Free-Spin / Life After Death (LAD)

**Physical basis:** Bearing tips (B:D, SG Bearing Version, Bearing Core RC, Bearing Core 2) decouple the tip from the bey body. Friction between tip and floor acts on the tip disc only; the metal ball bearing in the shaft means that floor contact torque is not transmitted to the main spin axis. The bey can continue orbiting at a tilt when primary spin is near-zero.

```
LAD duration = ω_release / (τ_bearing / I_combo)     [REAL-WORLD CS4 Case 207]
bearingFriction = 0.05   [CONFIRMED CS10 Case 551]
```

### Bearing B:D — Construction Clarification

**Bearing B:D is an all-plastic bottom.** It is NOT a metal part. Construction:

- **Outer disc:** Large ABS plastic disc, shaped like a flat WD mounted at the very bottom of the assembly. Has large cut-out holes around the perimeter (reduces mass while retaining outer radius for inertia).
- **Body/housing:** ABS plastic — same form factor as a Spin Track (hence the "all-track" appearance — the track and disc are integrated into one bottom piece).
- **Bearing:** A single metal ball bearing seated in the shaft bore. This is the **only metal component** in the entire B:D bottom.
- **Floor contact surface:** The plastic disc edge or underside contacts the floor — material is ABS. μ_k(floor) ≈ 0.17 (ABS-on-ABS).

**Why the bearing dominates the physics despite plastic contact:**  
The ABS disc does not spin fast relative to the floor (it is decoupled from the shaft by the bearing). Floor friction acts on a nearly-stationary disc — the kinetic friction force is small because relative velocity ≈ 0. The dominant energy dissipation path is through the metal bearing (bearing races sliding against each other at high relative speed = shaft RPM vs. near-zero disc RPM). Hence `bearingFriction = 0.05` describes the metal bearing coupling, not the ABS-to-floor contact.

| Component | Material | μ_k |
|-----------|----------|-----|
| Disc (floor contact) | ABS plastic | 0.17 |
| Bearing (shaft coupling) | Metal ball bearing (steel races) | 0.05 |
| Effective spin decay coefficient | — | ≈ 0.05 (bearing-dominated) |

**Engine:** `freeSpin: true`, `bearingFriction: 0.05`, `contactMaterial: 'ABS'`  
**Examples:** Wolborg (SG Bearing Base), Bearing B:D (4D), Phantom Orion B:D, Jiraiya MS (Bearing Core 2), Wolborg MS (Bearing Core)

---

## 7.2 Engine Gear (EG) Spring Burst

**Physical basis:** The EG contains a wound steel coil spring (k = 1500 N/m, E = 48 mJ [CONFIRMED CS10]). When triggered, the spring releases angular momentum as a spin burst.

**Spring constants:**
```
k = 1500 N/m   [CONFIRMED CS10 Case 555]
E = 48 mJ      [CONFIRMED CS10 Case 556]
```

**Trigger conditions by BB type [CONFIRMED CS10 Case 556]:**
- **First Clutch Base:** fires ONCE at battle start (release tab depressed at launch moment)
- **Final Clutch Base:** fires when spin falls to ω_trigger = 141 rad/s (1350 RPM); Δω = 53.4 rad/s; post-boost ω = 194 rad/s (+37.9%)
- **Normal Base:** gradual spring release throughout the battle — spring unwinds progressively; no discrete trigger event

**Engine:** `energyReserve: { type: 'spring', k: 1500, E: 0.048 }`, `velocityBurst: { delta_omega: 53.4 }`, `triggerCondition: 'launch_start' | 'spin_threshold_141_rad_s' | 'gradual'`

---

## 7.3 Mode Switch (F:D, Height Change)

**Physical basis:** At high spin rate, centrifugal force on an internal sliding arm overcomes a return spring, pushing the arm outward and switching the tip geometry (e.g., sharp → flat). When spin drops below threshold, the spring returns the arm.

```
F_centrifugal = m_arm × ω² × r_arm
ω_crit = √(F_spring / (m_arm × r_arm))

F:D threshold: ω_crit = 94.3 rad/s   [CONFIRMED CS10 Case 557]
F:S threshold: ω_crit ≈ 57.7 rad/s (TT mould), ≈ 89.4 rad/s (SonoKong mould)  [CONFIRMED CS6 Case 348]
X:D threshold: F_impact > 0.127 N (cam-follower — stochastic, not spin-speed based)  [CONFIRMED CS6 Case 345]
```

**In-battle auto-switch (centrifugal):** F:D (Big Bang Pegasis), F:S (L Drago Destroy), Auto Change Base (SG era), Spiral Change Base, Triple Change SG, Wyborg SG Auto Change.

**In-battle stochastic switch (cam-follower impact):** X:D (Diablo Nemesis) — any hit > 0.127 N triggers mode change.

**Pre-battle MANUAL selector only (NOT in-battle):** D:D (VariAres) — three-tip axial detent mechanism (Sharp / Wide Ball / Flat); mode is FIXED during battle. Do not classify D:D alongside centrifugal auto-switch tips. [CONFIRMED CS5 Case 992]

---

## 7.4 Magnacore Magnetic Attraction / Repulsion

**Physical basis:** The Magnacore chip is a permanent magnet embedded in the SG housing. The Magne Stadium has its floor magnets oriented with **South pole facing UPWARD**. The magnetic force is **vertical only** — it modifies the normal force (and therefore floor friction / spin decay). There is no lateral centering or centrifugal force. [CONFIRMED CS10 Case 554]

```
Magne Stadium floor: South pole facing UPWARD [CONFIRMED CS10 Case 554]
F_magne at h = 14 mm (SG Core operating height) = 0.200 N  [CONFIRMED CS10 Case 554]
F_magne at h = 3 mm  (pull-test estimate)        = 0.400 N  [CONFIRMED CS10 Case 554]
Falloff: inverse square with distance
Force direction: VERTICAL only — modifies N_normal; does NOT exert lateral force
```

**North Magnacore:** **ATTRACTED** to South-up stadium floor  
→ N_normal increases: N_eff = 0.494 N (+68% vs. baseline 0.294 N)  
→ α = 38.7 rad/s² (high spin decay)  
→ Spin life t ≈ 7.75 s (−40.4% vs. no magnet)  
→ Effect: faster spin death; aggressive attack behaviour [CONFIRMED CS10 Case 554]

**South Magnacore:** **REPELLED** from South-up stadium floor  
→ N_normal decreases: N_eff = 0.094 N (−68% vs. baseline 0.294 N)  
→ α = 7.37 rad/s² (low spin decay)  
→ Spin life t ≈ 40.7 s (+3.13× vs. no magnet)  
→ Effect: extended spin life; stamina / zombie behaviour [CONFIRMED CS10 Case 554]

**Engine:** `magnetForce: { F_at_14mm: 0.200, F_at_3mm: 0.400 }`, `falloff: 'inverse_square'`, `interactionTarget: 'floor_magnet'`, `forceAxis: 'vertical'`, `stadiumPolarity: 'south_up'`

---

## 7.5 Rubber Orbital / Flower Pattern

**Physical basis:** High-friction rubber tips (RF, R²F, RB, rubber grip bases) generate an orbital flower-petal trajectory. The bey's translational velocity and rotational spin interact with the rubber grip to produce a curved path.

```
μ_rubber = 0.50   [CONFIRMED CS10]
F_grip = μ × m × g = 0.50 × m × 9.81
```

**Petal count is emergent** from RPM × bowl depth × grip. Do NOT hardcode petal counts. [CONFIRMED CS10 common errors]

**Engine:** `tipShape: 'rubber_flat'`, `rubberGrip: { mu: 0.50 }`, `orbitMovement: { pattern: 'flower' }`

---

## 7.6 Metal Frame / Sliding Frame (MFB 4D)

**Physical basis:** The 4D Metal Wheel outer frame spins semi-independently on a bearing, with detent positions. The frame can absorb rotational impulse independently of the inner spin axis.

```
tau_coupling = bearingFriction × slip_velocity × I_frame
```

**Engine:** `slidingFrame: true`, `frame: { I_frame, omega_frame, bearingFriction, detentCount }`

**Examples:** Fang Leone (free-spinning outer frame), any 4D wheel with metal outer frame.

---

## 7.7 CWD / Free-Spin Weight Disk (HMS)

**Physical basis:** The CWD (Customize Weight Disk) is mounted on a bearing and spins independently of the main bey body. This decouples the WD's rotational inertia from impact forces.

```
bearingFriction_CWD ≈ 0.08   [ESTIMATED CS1]
tau_coupling = bearingFriction × (omega_main - omega_CWD) × I_CWD
```

**Examples:** CWD Chain Attacker (17 g, 9 spikes), CWD Free Survivor, CWD Defense Ring, CWD Devil Saucer.

---

## 7.8 Counter-Spin Absorption (Fafnir Series)

**Source: CS13 Case 622 — Counter-Spin Passive Absorption**

**Physical basis:** Fafnir beyblades spin left (CCW viewed from above). Most opponents spin right (CW). This spin-direction difference changes surface contact physics:

```
Same-spin contact:
  Δv_surface = |ω_A − ω_B| × r   (small when spin rates similar)

Counter-spin contact (Fafnir vs right-spin opponent):
  Δv_surface = (ω_Fafnir + ω_opponent) × r   (ADDITIVE — 15× higher)

Example: ω_A = 400 rad/s, ω_F = 350 rad/s, r = 25 mm:
  Same-spin:    Δv = |400−350| × 0.025 = 1.25 m/s
  Counter-spin: Δv = (400+350) × 0.025 = 18.75 m/s  (15× larger)   [INFERRED]
```

Higher Δv_surface → larger friction force → larger angular momentum transfer:
```
F_friction = μ_rubber × N = 0.50 × 0.393 N = 0.196 N   [INFERRED]
τ = F × r = 0.196 × 0.025 = 4.91×10⁻³ N·m
Per 10ms contact: Δω_Fafnir = +6.71 rad/s (gains spin) [INFERRED]
                  Δω_attacker = −6.71 rad/s (loses spin)
```

**Rubber free-spin disc amplifies effect:** free-spin decoupling (like ED145) means Fafnir absorbs less linear knockback while spin transfer still occurs fully.

**Engine:** `COUNTER_SPIN_ABSORB_RATE = 6.71 rad/s per 10ms contact (confirmed derivation)`  
Against same-spin opponent: rate × 0.067 (15× less effective)

**Fafnir series:** Drain Fafnir (8 Nothing / 8'Nothing), Geist Fafnir (8'Proof Absorb), Mirage Fafnir (Nothing 2S).

---

## 7.9 Burst Mechanism (Gen 3 / Gen 4)

**Physical basis:** PC or ABS cantilever tabs on the Energy Layer (Gen 3) or Ratchet (Gen 4) engage teeth on the opposing part. When contact torque exceeds the burst threshold, a tab deflects and a click occurs. Sufficient clicks advance the Disc rotation → Layer separates.

**Key thresholds:**
```
WV 2-tab (Burst Standard): τ_burst = 10.8 mN·m   [CONFIRMED CS9]
BX 5-tab Ratchet:           τ_burst = 13.3 mN·m   (+23%)
BX 7-tab Ratchet:           τ_burst = 18.6 mN·m   (+72%)
```

**Engine:** `attackType: "burst"` at contact height 20–30 mm (Disc/Ratchet engagement zone).

---

## 7.10 Nothing / Absorb Driver Spring-Mode-Change (CS13 Case 621)

**Physical basis:** The Nothing Performance Tip and Absorb Performance Tip have a spring-loaded base. When a downward force (from an incoming hit) exceeds the spring threshold, the base pushes inward and the tip transitions from sharp (stamina) to flat (attack) for a brief window.

**Nothing driver (flat phase, no spring release):**
```
Spring: k ≈ 600 N/m, compressed ~12 mm
E_spring ≈ 0.5 × 600 × (0.012)² = 43.2 mJ   [INFERRED]
Mode-change trigger: F_down > 1.80 N
Flat phase duration: 200ms
Movement: tipFriction changes from 0.17 (sharp) to 0.42 (partial rubber contact)   [INFERRED]
```

**Absorb driver (flat phase + spring release):**
```
Spring: k ≈ 1000 N/m, compressed ~5 mm
E_spring ≈ 0.5 × 1000 × (0.005)² = 12.5 mJ   [INFERRED]
J_spring = √(2 × m × E_spring) / engine_unit → ~878 engine-units   [GAME-DERIVED]
Absorb activates on: F_down > 1.80 N OR launch power > 120%
```

---

# PART VIII: SPECIAL MOVES

---

## 8.1 Game Engine Special Moves — Physics Archetypes (CS11)

**Source:** CS11 Cases 586–600  
**Engine unit calibration:** 1 linearImpulse = 3.60×10⁻⁵ N·s; 1 spinDelta = 1 rad/s [CONFIRMED CS11 Case 597]

### Archetype Map

| Archetype ID | Physical Basis | Game mechanic | Real World Anchor |
|-------------|---------------|---------------|-------------------|
| `linear-burst` | Directed angular + linear KE release (EG spring style) | Linear impulse + small spin boost | EG spring: E = 48 mJ, Δv ≈ 1.5 m/s |
| `anchor` | Gyro Anchor — bearing decoupling at zero velocity, maximize spin | Set v = 0, maximize ω, invulnerability window | B:D LAD + gyro locking |
| `orbital` | Orbital centripetal force — spin recovery via controlled orbit | Centripetal force each tick; net spin delta | RF tornado stall orbit, Spin Recovery stamina |
| `aerial-launch` | Two-phase vertical launch — ascent + dive | Phase 1: vertical impulse; Phase 2: dive damage | Not realistically achievable; anime-layer |
| `directional-burst` | Tactical angular impulse in facing direction | Smaller linear impulse + moderate spin boost | Rubber tip dash + bearing spin restore |
| `shockwave` | Radial AoE impulse — gyroscopic KE release | AoE knockback to all opponents in radius | Q-tip vertical forcing → generalized |
| `knockup` | Two-phase: vertical launch → aerial dive combo | Phase 1 vertical; Phase 2 high-damage dive | Pure anime — no physical basis |

---

## 8.2 Stampede Rush — Attack Type (Case 587)

```
Archetype: linear-burst
linearImpulse:   5000 engine-units  →  J = 5000 × 3.60×10⁻⁵ = 0.180 N·s   [GAME-DERIVED]
knockbackImpulse: 3000 engine-units
spinDelta:       +60 rad/s
invulnerabilityMs: 200ms
damageMultiplier: 1.3×
cooldownMs: 3000ms
durationMs: 500ms
```

**Physical anchor:** Linear burst from directed EG spring release. EG spring delivers 48 mJ in 8–10ms → estimated Δv ≈ 1.5 m/s for a 40 g bey; game value exceeds physics ceiling (1.3× vs EG ~5% boost) — confirmed `[ANIME/GAME]` scaling.

---

## 8.3 Gyro Anchor — Defense Type (Case 588)

```
Archetype: anchor
spinDelta:        +250 rad/s
invulnerabilityMs: 1500ms
spinStealRadiusPx: 250 px
cooldownMs: 4000ms
durationMs: 1500ms
```

**Physical anchor:** Bearing B:D zero-velocity LAD. At near-zero linear velocity with B:D bearing (μ=0.05), the bey maintains spin while body is effectively stationary. Spin steal radius models the orbital perimeter interaction of a stationary high-spin body. The 1500ms invulnerability is the gyroscopic rigidity window — above ω_stable, lateral torques cause precession not tipping.

---

## 8.4 Spin Recovery — Stamina Type (Case 589)

```
Archetype: orbital
spinDelta:   +400 rad/s (recovered over durationMs)
durationMs: 1000ms
cooldownMs: 3000ms
Orbital centripetal force applied each tick for 1000ms
```

**Physical anchor:** RF tornado stall orbit. Rubber Flat tip at bowl-wall orbit radius generates centripetal force that converts rotational KE to translational KE and back, effectively slowing spin decay. Spin recovery is an anime-layer multiplier on this effect (real stall only preserves spin, not recovers it at +400/s rate).

---

## 8.5 Tactical Burst — Balanced Type (Case 590)

```
Archetype: directional-burst
linearImpulse:    3500 engine-units
spinDelta:        +150 rad/s
damageMultiplier: 1.10×
cooldownMs: 3000ms
durationMs: 600ms
```

**Physical anchor:** Lighter tactical version of Stampede Rush — 70% of the impulse but with a larger spin recovery component. Models the bearing LAD spin restore after a directional dash (bearing core absorbs impact, retains spin).

---

## 8.6 Shock Pulse — Shockwave (Case 591)

```
Archetype: shockwave
knockbackImpulse: 6000 engine-units (AoE — applied to all opponents in radius)
damageMultiplier: 1.2×
invulnerabilityMs: 250ms
cooldownMs: 5000ms
durationMs: 700ms
AoE radius: 300 px
```

**Physical anchor:** Radial KE release — analogous to Q-tip cam periodic vertical forcing generalized to a single large burst event. No real beyblade delivers a 360° simultaneous AoE impulse; this is `[ANIME/GAME]`.

---

## 8.7 Ascending Dragon Bite — Knockup (Case 592)

```
Archetype: knockup (two-phase)
Phase 1 — "ascent":
  verticalImpulse: 300 engine-units
  waitForAirborne: 350ms

Phase 2 — "bite":
  damageMultiplier: 2.0×
  triggers after target is airborne

cooldownMs: 5000ms
```

**Physical anchor:** None — no real beyblade can achieve a two-phase aerial attack. Pure `[ANIME/GAME]` archetype. Loosely inspired by upper-attack ARs that can produce upward force on opponents.

---

## 8.8 Storm Bringer — Aerial Launch (Case 593)

```
Archetype: aerial-launch
Phase 1 — ascent: verticalImpulse = 350 engine-units
Phase 2 — dive:
  linearImpulse: 4500 engine-units
  landingAoePx: 200
  damageMultiplier: 1.7×
cooldownMs: 5000ms
```

**Physical anchor:** None — aerial-launch attacks have no real-world counterpart. `[ANIME/GAME]`.

---

## 8.9 Franchise Special Moves (CS13)

### Nothing Break — Drain/Mirage Fafnir (Case 623)

**Franchise description:** As Fafnir absorbs the opponent's attack, the Nothing driver's base pushes in (flat mode), giving Fafnir a counter-strike burst that scales with how many attacks were absorbed.

**Physics foundation:** Combines Nothing driver spring-mode-change (Case 621) + counter-spin absorption (Case 622).

**Anime transcendence:** Real Nothing driver delivers Δv ≈ 0.824 m/s over 200ms [INFERRED]. Game Nothing Break ignores this ceiling — delivered impulse ≥ 6000 engine-units minimum, scaling to 13200 units at full absorb charge.

```
Phase 1 — "nothing_break_absorb" (player holds button, up to 2000ms):
  movementLock: true (near-stationary orbit only)
  incomingDamageReduction: 0.70 (30% absorbed)
  spinAbsorbRate: 3× normal counter-spin rate  [ANIME/GAME multiplier]
  parryCharge: accumulates per hit absorbed

Phase 2 — "nothing_break_burst" (player releases):
  linearImpulse: 6000 + (parryCharge × SCALE_FACTOR)
  damageMultiplier: 1.8 + (absorbedHitCount × 0.05)  [caps at 3.0 after 24 hits]
  spinDelta: +parryCharge × SPIN_RESTORE
  knockbackImpulse: impulse × 0.8
  durationMs: 300ms
  direction: toward last attacker position

Damage scaling:
  0 absorbed hits:  1.8×
  5 hits:           2.05×
  12 hits:          2.40×
  20 hits:          2.80×
  24 hits:          3.0× (hard cap)
```

**Compatible beys:** Any Fafnir series beyblade with counter-spin orientation (Drain Fafnir, Mirage Fafnir). `[ANIME/GAME]`

---

### Absorb Break — Geist Fafnir (Case 624)

**Franchise description:** When Geist Fafnir is pushed down by the opponent, the Absorb driver's spring contacts the stadium floor and fires, launching Fafnir into a powerful counterattack. Can also fire at high launch power.

**Physics foundation:** Absorb driver spring mechanism (k ≈ 1000 N/m, E ≈ 12.5 mJ, J_spring → ~878 engine-units [INFERRED]).

**Comparison vs Nothing Break:**

| | Nothing Break | Absorb Break |
|--|---------------|--------------|
| Trigger | Player hold + release | Single heavy hit downforce or high launch power |
| Absorb window | Up to 2000ms | Single impact (instant) |
| Hit-count scaling | Yes (1.8× → 3.0×) | No (fixed 2.2×) |
| Base impulse | 6000 engine-units | 9000 + 878 = 9878 engine-units |
| Launch variant | No | Yes (fires at launch if power > 120%) |

```
Variant A — Reactive counter:
  Trigger: incomingHit.downwardForce > ABSORB_TRIGGER_THRESHOLD
  Phase 1: incomingDamageReduction: 0.50 (absorb half the hit), springChargeReady: true
  Phase 2: linearImpulse: 9000, springBonusImpulse: 878, spinDelta: +120, damageMultiplier: 2.2×

Variant B — Launch opener (power > 120%):
  windUpMs: 200 (launch visual), durationMs: 300ms
  Same impulse/damage as Variant A Phase 2
  Fires toward nearest opponent at battle start
```

**Compatible beys:** Geist Fafnir 8'Proof Absorb. `[ANIME/GAME]`

---

# PART IX: COMBOS

---

## 9.1 Combo System Overview

**Source:** CS12 Cases 601–618

The combo system models three real beyblade physical movement archetypes:

1. **Directional dash** (rubber tip grip-burst lateral sprint) → `dashDirection`, `forceImpulse`
2. **Contact modifier** (boosted collision geometry) → `damageMultiplier`
3. **Spin interaction** (angular momentum surface transfer) → `spinStealBonus`, `microSpinBoost`

### Detection Mechanics

```
Sequence: 3-button sequence within windowMs
Detection: sliding-3 window (last 3 inputs must be within windowMs of each other)
maxHistoryWindowMs: 600ms (wider than any single combo)
```

**windowMs calibration:** All windows span approximately 1.7–2.3 quarter-orbit periods at v_orbit ≈ 0.664 m/s:
- Quarter-orbit arc (r=90mm): 213ms [INFERRED]
- Dash combos: 400ms ≈ 1.7–1.9 × T_quarter
- Mixed combos: 450ms ≈ 1.9–2.1 × T_quarter
- Guard combos: 500ms ≈ 2.1–2.3 × T_quarter

### Combo vs. Special Move Ceiling

| Parameter | Combos | Special Moves |
|-----------|--------|---------------|
| damageMultiplier | ≤ 1.5 | ≤ 2.5 (≤ 3.0 with scaling) |
| lockMs | ≤ 300ms | ≤ 2000ms |
| invulnerabilityMs | 0 (forbidden) | ≤ 1500ms |
| AoE | forbidden | ≤ 300 px |
| spinDelta | ≤ 50 (micro) | ≤ 600 |
| cost | 0–35 | 100 (full bar) |

---

## 9.2 Combo Registry

### Cost 0 — Free Combos

**Quick Dash Left (←←J)**  
Physics: Rubber-tip grip-burst lateral sprint. F_grip = 0.50 × 0.040 × 9.81 = 0.196 N over 150ms → Δv = 0.735 m/s [INFERRED]
```
sequence: [moveLeft, moveLeft, jump]
dashDirection: "left"
durationMs: 300ms
lockMs: 0
damageMultiplier: 1.0
cost: 0
cooldownMs: 800ms
windowMs: 400ms
```

**Quick Dash Right (→→J)**  
Same physics as Quick Dash Left, direction reversed.
```
sequence: [moveRight, moveRight, jump]
dashDirection: "right"
(all other params same as Quick Dash Left)
```

**Guard Tap (KKK)**  
Physics: Gyroscopic recenter — suppresses wobble growth during defensive stance. No spin energy cost (gyro self-corrects without external energy).
```
sequence: [defense, defense, defense]
durationMs: 250ms
lockMs: 0
damageMultiplier: 1.0
cost: 0
cooldownMs: 1000ms
windowMs: 500ms
```

**Feint (←→K)**  
Physics: Hard rubber-tip plant reverses direction. Minimum turning radius r_min = 130.6 mm at v=0.80 m/s (fits within 170mm arena) [INFERRED].
```
sequence: [moveLeft, moveRight, defense]
dashDirection: "back"
durationMs: 350ms
lockMs: 0
damageMultiplier: 1.0
cost: 0
cooldownMs: 1000ms
windowMs: 450ms
```

---

### Cost 15 — Light Investment Combos

**Riposte (KKJ) — Defense type**  
Physics: Parry-wait-counter sequence. Defense posture absorbs first hit, then releases stored potential as a counterstrike. Physical basis: high-I defense bey (bearing base, wide WD) uses gyroscopic rigidity to deflect then counter.
```
sequence: [defense, defense, jump]
damageMultiplier: 1.3×
lockMs: 200ms
cost: 15
cooldownMs: 2500ms
windowMs: 500ms
spinStealBonus: 0
```

**Pivot Strike (←→J) — Balanced type**  
Physics: Pivot-and-close approach from a reversed direction. Close approach velocity boosted by prior feint.
```
sequence: [moveLeft, moveRight, jump]
damageMultiplier: 1.25×
dashDirection: "forward"
lockMs: 150ms
cost: 15
cooldownMs: 2000ms
windowMs: 450ms
```

---

### Cost 25 — Medium Investment Combos

**Power Thrust (JJJ) — Universal**  
Physics: Triple-input commitment — models the full-power attack sequence. High damage fraction from near-zero contact face angle (Double Attacker AR, φ ≈ 0°: cos(0°) = 1.0 pure smash).
```
sequence: [jump, jump, jump]
damageMultiplier: 1.5×   (combo ceiling maximum)
lockMs: 300ms
cost: 25
cooldownMs: 3000ms
windowMs: 450ms
```

---

### Cost 35 — Heavy Investment Combos

**Spin Leech Jab (←J→) — Stamina type only**  
Physics: Surface-friction angular momentum transfer (Advance Balancer spin-steal, L-Drago rubber ER spin-steal). Only available to stamina-type beyblades (type restriction enforced).
```
sequence: [moveLeft, jump, moveRight]
spinStealBonus: 0.10   (10% of contact duration transferred)
microSpinBoost: 50 rad/s (to self)
lockMs: 200ms
cost: 35
cooldownMs: 3000ms
windowMs: 450ms
type restriction: "stamina"
```

---

## 9.3 Combo Eligibility Rules

1. Beyblade must have the comboId in its `BeybladeStats.comboIds` list (max 3 combos)
2. Power bar must have sufficient charge (cost ≤ current power)
3. Combo must not be on cooldown
4. Type restriction must be satisfied (spin-leech-jab: stamina only; riposte: defense only)
5. Sliding-3 window check: all 3 inputs within the combo's windowMs

---

# PART X: ARENAS AND STADIUMS

---

## 10.1 BeyStadium Attack Type — MFB Era (CS10 Case 545)

**Generation:** Gen 2 MFB (tournament-standard competitive arena)  
**Outer diameter:** 340 mm [CONFIRMED]  
**Maximum depth:** 30 mm (at center)

### Five-Zone Bowl Profile

```
Zone 1 — Flat Centre      r = 0–40 mm      slope = 0°     g_lat = 0 m/s²
Zone 2 — Main Slope       r = 40–125 mm    slope ≈ 30°    g_lat = 4.905 m/s²  (inward)
Zone 3 — Tornado Ridge    r = 125–145 mm   h_ridge = 3 mm above slope line
Zone 4 — Second Incline   r = 145–155 mm   slope ≈ 50°    g_lat = 7.508 m/s²  (inward)
Zone 5 — Outer Wall       r = 155–170 mm   H_wall = 30 mm (pockets cut through)
```

### Key Measurements

```
Zone 2 lateral gravity:   g_lat = 9.81 × sin(30°) = 4.905 m/s²
Zone 4 lateral gravity:   g_lat = 9.81 × sin(50°) = 7.508 m/s²
Zone 2 potential energy:  h₂ = 85 × tan(30°) = 49.1 mm
Zone 4 potential energy:  h₄ = 10 × tan(50°) = 11.9 mm
Minimum escape speed (Zone 4): v_min = √(2 × 9.81 × 0.0119) = 0.483 m/s
Zone 2 descent speed (η=0.70): Δv₂ = √(2 × 9.81 × 0.0491 × 0.70) = 0.820 m/s   [CONFIRMED CS10]
```

### Exit Geometry

```
Outer circumference: C = π × 340 = 1068 mm
3 × exit pocket chord 150 mm: total exit coverage = 450 mm (42.1%)
3 × wall chord 155 mm:        total wall coverage = 465 mm (43.5%)
P(ejection | reaches outer wall) = 450 / 915 = 0.492   [CONFIRMED CS10 Case 545]
```

### Tornado Ridge (Case 546)

Tornado Ridge face angle: β_TR = atan(3/10) = atan(0.300) = 16.7°  
Engagement condition: beyblade's lowest structural feature height z_rim ≤ 3 mm  
Inward impulse on engagement: J_inward ≈ 0.0948 N·s [INFERRED CS12 Case 605]

---

## 10.2 Confirmed Arena Physics Constants

| Parameter | Value | Source |
|-----------|-------|--------|
| ABS-on-ABS body friction (arena wall) | μ = 0.15 | [CONFIRMED CS10 style rules] |
| Wall bounce COR (ABS tip on ABS wall) | ε = 0.70–0.85 | [CONFIRMED CS10 style rules] |
| Rubber tip wall bounce COR | ε = 0.40–0.60 | [CONFIRMED CS10 style rules] |
| Arena floor slope correction | cos(α) factor on decay | [REAL-WORLD CS10 Case 545] |
| Sliding Shoot center speed | v_centre ≈ 2.7 m/s (vs 1.4 m/s radial) | [CONFIRMED CS10 Case 547] |

---

## 10.3 Arena Feature Types

### Spin Zone
Circular zone that imparts cw/ccw orbit or spin to beyblades inside.  
`applyTo: "linear" | "spin" | "both"`

### Bump
Small raised feature; vertical pop + lateral recoil on contact.

### Gravity Hole / Gravity Well
Pre-existing feature; gained `controlledBySwitchId` + `selfRotation` in the New Arena Features overhaul.

### Switch
Wiring target for other features. A feature with `controlledBySwitchId` is only active when that switch is on. Switch graph: toggle / set-on / set-off / pulse / chain to next switch.

### Self-Rotation
Any feature can spin in place (`selfRotation: { speedDegPerSec, direction }`) — visual + functional (turrets re-aim, gravity wells orbit, obstacles rotate damage faces).

---

## 10.4 Engine Gear Constants (from CS10 Cases 554–557)

| Parameter | Value | Tag |
|-----------|-------|-----|
| EG spring constant | k = 1500 N/m | [CONFIRMED Case 555] |
| EG spring energy | E = 48 mJ | [CONFIRMED Case 556] |
| EG spring compression | x ≈ 8 mm | [INFERRED] |
| F:D mode-switch threshold | ω = 94.3 rad/s | [CONFIRMED Case 557] |
| Magnacore force at 3 mm | F = 0.40 N | [ESTIMATED Case 554] |
| B:D bearing friction | μ = 0.05 | [CONFIRMED Case 551] |

---

## 10.5 Default Black Arena — 4-Quadrant Multi-Player Stadium (Cases 1592–1600)

**Name:** Default Black Arena  
**Generation:** Game-original (non-canonical; all-era multi-player)  
**Outer diameter:** 600 mm [FACT]  
**Shape:** Circular bowl  
**Player capacity:** 4 (one per quadrant)  
**Quadrant design:** Cross-dividers at 0°/90°/180°/270° (visual-only red lines; no physical barriers)

### Six-Zone Bowl Profile

```
Zone 1 — Defense Flat        r = 0–70 mm       slope = 0°     g_lat = 0 m/s²       [ESTIMATED]
Zone 2 — Interior Barrier    r ≈ 85 mm          h_wall ≈ 5 mm  face angle ≈ 18°     [ESTIMATED]
Zone 3 — Main Curved Bowl    r = 90–190 mm      slope ≈ 25°    g_lat = 4.14 m/s²    [ESTIMATED]
Zone 4 — Speed Ridge         r ≈ 190–210 mm     h_ridge ≈ 4 mm high-grip contact    [ESTIMATED]
Zone 5 — Upper Slope         r = 210–260 mm     slope ≈ 45°    g_lat = 6.94 m/s²    [ESTIMATED]
Zone 6 — Outer Wall + Gaps   r = 260–300 mm     H_wall ≈ 40 mm exit pockets through wall [ESTIMATED]
```

### Case 1592 — Arena Dimensions and Zone Map

```
Arena type:    Default Black Arena
Diameter:      600 mm   [FACT]
Radius:        300 mm
Play area:     π × 300² = 282,743 mm²
Scale vs. MFB Attack Type: 300/170 = 1.76× radius → 3.10× play area

Zone 1 (Defense Flat):   r = 0–70 mm    (flat ABS, μ = 0.17)            [ESTIMATED]
Zone 2 (Inner Barrier):  r ≈ 85 mm      (ABS ring wall, h ≈ 5 mm)       [ESTIMATED]
Zone 3 (Main Bowl):      r = 90–190 mm  (curved bowl, slope ≈ 25°)      [ESTIMATED]
Zone 4 (Speed Ridge):    r = 190–210 mm (raised ridge, h ≈ 4 mm)        [ESTIMATED]
Zone 5 (Upper Slope):    r = 210–260 mm (steep inner wall, slope ≈ 45°) [ESTIMATED]
Zone 6 (Outer Wall):     r = 260–300 mm (H_wall ≈ 40 mm; gaps at quadrant boundaries) [ESTIMATED]
```

### Case 1593 — Zone Lateral Gravity and Key Heights

```
Zone 1 lateral gravity:   g_lat = 0 m/s²   (flat floor — tip friction only)
Zone 3 lateral gravity:   g_lat = 9.81 × sin(25°) = 4.14 m/s²   [INFERRED]
Zone 4 lateral gravity:   g_lat = 9.81 × sin(35°) = 5.63 m/s²   [INFERRED — ridge slope steeper]
Zone 5 lateral gravity:   g_lat = 9.81 × sin(45°) = 6.94 m/s²   [INFERRED]

Zone 3 height span:  h₃ = (190 − 90) × tan(25°) = 100 × 0.466 = 46.6 mm   [INFERRED]
Zone 5 height span:  h₅ = (260 − 210) × tan(45°) = 50.0 mm                [INFERRED]

Zone 3 descent speed gain (η = 0.70):
  Δv₃ = √(2 × 9.81 × 0.0466 × 0.70) = 0.800 m/s   [INFERRED]

Minimum escape speed from Zone 5 (inward from outer wall):
  v_min = √(2 × 9.81 × 0.050) = 0.990 m/s   [INFERRED]
```

### Case 1594 — Interior Barrier Wall (Red Inner Ring)

A raised annular wall at r ≈ 85 mm sits just outside the yellow defense circle. This wall blocks direct straight-line entry to the defense zone. A bey approaching head-on at shallow angle is deflected and pushed back up the bowl. However, a bey approaching at a **tangential angle** uses the curved face as a ramp — receiving a lateral speed boost and slingshot redirect into or around Zone 1.

```
Barrier radius:     r_b ≈ 85 mm         [ESTIMATED]
Barrier height:     h_b ≈ 5 mm          [ESTIMATED]
Face angle:         β_b = atan(5/15) ≈ 18°   [INFERRED]
ABS-on-ABS COR:     ε ≈ 0.70            [CONFIRMED CS10 style rules]

Minimum surmount speed (head-on):
  v_min = √(2 × g × h_b) = √(2 × 9.81 × 0.005) ≈ 0.31 m/s   [INFERRED]
  (nearly always achievable — beys arrive at Zone 3 at v ≈ 0.8–2.0 m/s)

Tangential speed boost (v = 1.5 m/s, 30° approach angle):
  Δv_tangent ≈ v × sin(β_b) × ε = 1.5 × 0.309 × 0.70 ≈ 0.32 m/s   [INFERRED]
```

**Defense access routes:**
1. **Straight charge** — any bey with v > 0.31 m/s can surmount the barrier directly.
2. **Tangential slingshot** — bey approaches at an angle, uses barrier face as a ramp, redirects at higher tangential speed; ideal for attack-type sweeps around the defense line.
3. **Speed ridge descent** — a bey orbiting Zone 4 at sub-orbital speed (v < 0.91 m/s) decays inward through Zone 3, passing the barrier naturally via bowl momentum.

### Case 1595 — Speed Ridge / Blue Line Physics

The blue ring at r ≈ 190–210 mm is a raised ridge analogous to the MFB Tornado Ridge but at larger scale. When a bey's lowest structural feature contacts this ridge, it receives an inward impulse and the edge-contact increases effective grip, enabling sustained high-speed orbits.

```
Ridge radius:        r_ridge ≈ 200 mm   [ESTIMATED]
Ridge height:        h_ridge ≈ 4 mm above local slope line   [ESTIMATED]
Face angle:          β_ridge = atan(4/12) ≈ 18.4°   [INFERRED]
Engagement condition: bey z_rim ≤ 4 mm (must have low-profile tip or worn body)   [INFERRED]

Stable orbit speed at r = 200 mm (Zone 4 slope g_lat):
  v_orbit = √(g_lat × r) = √(5.63 × 0.200) = 1.061 m/s   [INFERRED]
  Orbital period at stable speed: T = 2π × 0.200 / 1.061 = 1.184 s   [INFERRED]

Inward engagement impulse (scaled from MFB Tornado Ridge, CS12 Case 605):
  J_inward ≈ 0.0948 × (300/170) × (4/3) ≈ 0.222 N·s   [INFERRED — scaled]

Ridge grip enhancement:
  Effective μ increase ≈ +0.15–0.25 during ridge edge contact   [ESTIMATED]
```

**Speed separator effect:** Beys entering Zone 4 at v < v_orbit (< 1.06 m/s) are drawn inward by lateral gravity → drift toward Zone 3 → eventually reach barrier. Beys at v > v_orbit are flung outward → Zone 5 → outer wall. The ridge acts as a natural speed-based routing gate.

### Case 1596 — Exit Geometry and Ring-Out Probability

The outer wall has gaps aligned near quadrant boundaries, creating four ring-out corridors. Beys reaching the outer wall have a high probability of ring-out.

```
Outer wall circumference: C = π × 600 = 1885 mm   [INFERRED]
Estimated gap arc per corridor: ≈ 50°              [ESTIMATED from image]
Total gap count: 4
Total gap arc coverage: 4 × 50° = 200°
Gap chord coverage: 200/360 × 1885 = 1047 mm

P(ring-out | reaches outer wall) ≈ 200/360 ≈ 0.556   [ESTIMATED]
```

### Case 1597 — Spawn Geometry and Opening Dynamics

```
Spawn radius:   r_spawn ≈ 150 mm (mid-bowl, Zone 3)   [ESTIMATED]
Spawn angles:   45° / 135° / 225° / 315° (quadrant centers)   [INFERRED]
Spawn layout:   each bey in its own quadrant, positioned at ≈ 90° from adjacent beys

Diagonal pair separation (NE ↔ SW, NW ↔ SE):
  d_diag = 2 × r_spawn × sin(90°) = 2 × 150 = 300 mm   [INFERRED]

Adjacent pair chord distance (90° apart):
  d_adj = 2 × r_spawn × sin(45°) = 2 × 150 × 0.707 = 212 mm   [INFERRED]

Opening approach time to first contact (v₀ = 2.0 m/s):
  Diagonal: t = 300 / 2000 = 0.150 s   [INFERRED]
  Adjacent:  t = 212 / 2000 = 0.106 s  [INFERRED]
```

**Opposite-sides rule:** In all multi-bey configurations the two beys of a matched diagonal pair (e.g. Player 1 at 45° and Player 3 at 225°) face each other directly at launch. Adjacent beys (90° apart) do not head-on collide immediately — they converge through orbital drift or active movement.

### Quadrant Markings (Red Cross Lines)

The straight red cross-lines are **visual-only** quadrant dividers. They carry **no physical barrier effect**. Beys cross freely between quadrants at all times. Their only functional role is defining spawn zones during the launch phase.

### Strategic Zone Summary

| Zone | Favored Type | Reason |
|------|-------------|--------|
| Zone 1 (Defense Flat) | Stamina / Defense | Zero lateral gravity; only tip friction; shielded by inner barrier |
| Zone 2 (Barrier ramp) | Attack | Tangential slingshot off barrier face for entry or redirection |
| Zone 3 (Main bowl) | Attack / Balanced | High KE from bowl descent; wide circling arcs for hit-and-run |
| Zone 4 (Speed Ridge) | Balanced / Attack | Fast orbital speed; ridge inward impulse; high-grip contact |
| Zone 5 (Upper slope) | Attack | High lateral acceleration toward outer wall → ring-out push |
| Zone 6 (Outer wall) | — | Ring-out zone; P(exit) ≈ 0.56 for any bey reaching this radius |

### Defense Zone Access Rule

The interior barrier does **not** make Zone 1 impenetrable — minimum surmount speed is only 0.31 m/s. Its real effect is to **deny orbital access**: a bey in pure circular orbit around Zone 1 cannot stay in orbit below r ≈ 85 mm without first crossing the barrier wall. This means a defensive bey that reaches Zone 1 and holds position (e.g. with an extremely low-friction tip like B:D, μ = 0.05) can effectively sit inside the barrier while opponents either waste energy surmounting it or circle Zone 3.

```
B:D zombie in Zone 1:
  dω/dt = (0.05 × m × g × r_tip) / I_total   [REAL-WORLD]
  At m = 35 g, r_tip = 1.5 mm, I = 7.3×10⁻⁶:
  dω/dt = (0.05 × 0.035 × 9.81 × 0.0015) / 7.3×10⁻⁶ = 3.52 rad/s²   [INFERRED]
  Spin life from ω₀ = 600: t_spin = 600 / 3.52 = 170 s   [INFERRED]
```

---

## 10.6 Cross-Arena Comparison

| Arena | Diameter | Flat zone | Exit probability | Player slots |
|-------|----------|-----------|-----------------|--------------|
| MFB Attack Type (CS10) | 340 mm | 40 mm r | 0.492 (3 pockets) | 2 |
| Default Black Arena | 600 mm | 70 mm r | 0.556 (4 gaps) | 4 |

Key difference: the Default Black Arena's interior barrier gives stamina-type beys a defensive refuge not present in the MFB Attack Type, while the wider bowl and higher exit probability make it simultaneously more offensive. The net effect is a high-variance arena where defense-in-center and ring-out-via-wall are both viable endgame strategies.

---

# PART XI: LAUNCHERS AND ACCESSORIES

---

## 11.1 Launch Physics Fundamentals (CS14 Case 892)

### Energy Chain

```
Pull energy:   E_pull = F_pull × d_pull (J)
Stored spin:   KE_spin = 0.5 × I_bey × ω₀²
Transfer:      ω₀ = (η_gear × F_pull × d_pull) / (I_bey × r_gear)

Gear efficiency: η_gear = 0.65–0.90 (15–35% friction loss in gear train)
String launchers: fewer gear stages → η ≈ 0.80–0.90 (less friction)
```

### Launch Energy Comparison

| Launcher Type | Pull distance (mm) | Energy (J) | Launch ω₀ (rad/s) |
|---------------|-------------------|------------|-------------------|
| Ripcord | 250–280 | 10–22 | 260–520 |
| String Launcher | 600–800 | 24–64 | 520–900 |

String launchers: **2–3× more energy** at equivalent blader effort.

### MASTER ANALYSIS Launcher Summary

| Launcher Type | ω₀ (rad/s) | Key Formula | Source |
|--------------|-----------|-------------|--------|
| String | 1714 | ω₀ = v_pull / r_shaft (v=3.0m/s, r_shaft=1.75mm) | [CONFIRMED] |
| Gear/Winder | 2571 | G ≈ 1.8–2.5 gear ratio | [INFERRED] |
| BeyLauncher LR | 3771 | G ≈ 2.2 | [INFERRED] |
| BX Xtreme | 4800 | G_eff ≈ 2.8 | [CONFIRMED CS10] |

**HMS Double Shooter:** ~1322 rad/s from dual-ripcord mechanism [INFERRED CS14]  
**Burst String Launcher:** ~1873 rad/s [INFERRED CS14]

---

## 11.2 Winder / Snap Launcher — Pre-Ripcord (CS14 Case 893)

**Era:** Bakuten Shoot original (pre-ripcord, 1999)  
**Mechanism:** Manual crank pre-winds internal spring; no ripcord pull during battle.

```
Spring energy: E_winder ≈ 0.5 × k × x² ≈ 0.5 × 1000 × (0.010)² = 0.050 J
ω₀_winder ≈ √(2 × 0.050 / 2.5×10⁻⁵) ≈ 63 rad/s ≈ 600 RPM
```

**Competitive use:** None. 13% of ripcord launch spin. Winder-launched beys destabilize immediately (spin/maxSpin < 0.40). Historical significance only — replaced by standard ripcord launchers mid-S1.

---

## 11.3 Standard Ripcord Launcher — EZ Shooter (CS14 Case 894)

**Era:** Plastic Gen A-series through G-Revolution (S1–G-Rev)  
**Weight:** 35–45 g  
**Pull distance:** 250–270 mm  
**Gear efficiency:** η ≈ 0.73

```
Realistic average (F = 45 N, consistent pull):
  E = 45 × 0.260 = 11.7 J
  E_useful = 11.7 × 0.73 = 8.5 J
  ω₀ ≈ √(2 × 8.5 / 2.5×10⁻⁵) ≈ 735 rad/s  (realistic)
  ω₀_peak ≈ 954 rad/s at peak force (F=60N)
```

**Ripcord wear:** After 50–100 launches, tooth deformation reduces ω₀ by ~15%.  
**Sliding Shoot capable:** Yes (angle-dependent tilt).  
**Spin direction:** Right-spin only (standard).

---

## 11.4 Reverse / Left-Spin Shooter (CS14 Case 895)

**Era:** Plastic Gen, for left-spin beyblades  
**Manufacturer:** SonoKong (Asia), Hasbro (select releases)  
**Mechanism:** Mirror-reversed gear train. Identical energy calculation to EZ Shooter.

```
ω₀_LS ≈ 735 rad/s CCW   (identical physics, opposite spin direction)
```

**Strategy implications:** Enables same-direction co-rotation against LS opponents (stamina matching), counter-rotation spin-steal against RS opponents, left-spin upper-attack AR geometries (Penta Wing, Reverse Dragon, Dual Dragon, Great Dragon).

---

## 11.5 HMS Double Shooter

**Era:** HMS  
**Mechanism:** Dual-ripcord engagement; two ripcords pull simultaneously through opposing gear teeth, doubling the effective pull energy.

```
Estimated: ω₀_HMS ≈ 1322 rad/s   [INFERRED CS14]
Compared to plastic ripcord: ~1.8× higher launch spin
```

---

## 11.6 String Launchers (MFB Era)

**BeyStringer (MFB standard):** First generation string launcher.

```
Pull distance: 700 mm (string length)
η_gear: 0.85 (fewer gear stages)
Estimated ω₀ ≈ 844 rad/s (at F=60N)   [INFERRED CS14 Case 892]
```

**String launchers deliver 3.1× more energy than ripcords at equal effort.** [CS14 Case 892]

---

## 11.7 BX Xtreme Launcher

**Era:** Gen 4 BX  
**G_eff ≈ 2.8** (highest achievable gear ratio)  
**ω₀ ≈ 4800 rad/s** [CONFIRMED CS10 Case 564]

This is the highest standard launch speed of any generation. The Xtreme Launcher accounts for BX beyblades' 290 s (flat tip) and 1090 s (sharp tip) spin life — even with rapid tip-wear, the high ω₀ gives BX enormous stamina headroom.

### Launch Tilt Physics (all generations)

```
Height shift from tilt angle θ: Δh = r_bey × sin(θ)
At θ = 30°, r = 20 mm: Δh = 10 mm   [REAL-WORLD]
t_spin ∝ launch power% (linear): 150% power = 1.5× spin life
```

---

# PART XII: CONFIRMED BURST ERA PART PHYSICS

*All values confirmed from CS9 case studies unless otherwise tagged. Assembly names use TT-JP format: Layer.Disc.Driver (Standard/God/Cho-Z) or DBCore.DBBlade.Armor#.Disc.Driver (DB/BU).*

---

## 12.1 Launch Speed by Burst Sub-system

| Era / Sub-system | Recommended ω₀ (rad/s) | RPM | Source |
|-----------------|----------------------|-----|--------|
| Standard Burst (B-01 to B-71) | 600 | 5730 | [CONFIRMED CS9 Case 1001] |
| God Layer (B-73 to B-103) | 600 | 5730 | [CONFIRMED CS9 Case 1018] |
| Cho-Z (B-104 to B-131) | 600 | 5730 | [CONFIRMED CS9 Case 1009] |
| GT / Gatinko (B-133 to B-157) | 600 | 5730 | [INFERRED — same launcher era] |
| SK / Sparking (B-159 to B-179) | 694 | 6628 | [CONFIRMED CS9 Case 1168] |
| DB / Dynamite Battle (B-180+) | 694 | 6628 | [CONFIRMED CS9 Case 533] |
| BU / Burst Ultimate | 694 | 6628 | [CONFIRMED CS9 Case 1013] |

---

## 12.2 Burst Threshold Ladder — All Burst Sub-systems [CONFIRMED CS9]

| System | Mechanism | k_tab (N/m) | δ (mm) | N_tabs | τ_burst (mN·m) |
|--------|-----------|-------------|--------|--------|----------------|
| Standard Burst (WV) | PC cantilever tab | 2400 | 0.30 | 2 | **10.8** [Case 1001] |
| God Layer standard (VV) | PC cantilever tab | 2400 | 0.35 | 2 | **12.6** [Case 1018] |
| Tall-tooth God/XC layers | PC cantilever tab | 2400 | 0.45 | 2 | **16.2** [Cases 1003, 1006, 1009] |
| BX 5-tab Ratchet | Ratchet protrusion | — | — | 5 | **13.3** [CONFIRMED] |
| BX 7-tab Ratchet | Ratchet protrusion | — | — | 7 | **18.6** [CONFIRMED] |
| God Layer 3-tab (est.) | PC cantilever tab | 2400 | 0.35 | 3 | **18.9** [INFERRED CS9 TS model] |
| DB Core 4-tab | Spring tab | 1300 | 0.60 | 4 | **56.2** [Case 533] |
| BU Lock (protrusion) | Hertzian protrusion | — | — | 3 | **+56.25 additional** [Case 1013] |
| DB Core 2 Overdrive (high spin) | Centrifugal lock | — | — | — | **∞ (ω > 447 rad/s)** [Case 534] |
| DB Core 2 standard tabs | Spring tab | 1300 | — | 4 | **56.2** [Case 534] |

**Note:** DB Core burst-tab spring constant k=1300 N/m is substantially lower than Burst-era k=2400 N/m. The DB system compensates via more tabs (4) and a different δ geometry, producing τ=56.2 mN·m vs the Standard Burst τ=10.8 mN·m — a 5.2× increase in burst threshold at the cost of a weaker spring per tab.

---

## 12.3 Xcalibur Lineage — Complete Physics Chain [CONFIRMED CS9]

The Xcalibur line spans four Burst sub-systems with progressively increasing mass and inertia:

| Part | System | m (g) | I_L (×10⁻⁶ kg·m²) | τ_burst | Key Gimmick |
|------|--------|-------|---------------------|---------|-------------|
| Xeno Xcalibur | Dual Layer | 9.3 | 2.325 | 16.2 mN·m | C₁ sword; first-mold fracture (h=1.6mm); second mold h=2.5mm survives |
| Sieg Xcalibur | God Layer | 15.9 | 4.345 | 16.2 mN·m | C₁+diamond; zinc sword 5.0g; hilt-gap fatigue σ=20.2 MPa > σ_endurance=16 MPa |
| Buster Xcalibur | Cho-Z | 19.6 | 6.538† / 5.418‡ | 16.2 mN·m | Bistable centrifugal extension; ω_crit=140.9 rad/s; e_buster=7.86mm |
| DB Core Xcalibur | DB/BU (Core) | 10.6 | 0.578 (core only) | 56.25+56.2 mN·m | Bound Attack k=800N/m; v_rebound=0.202m/s; BU Lock τ_add=56.25 mN·m |

†Buster Mode (sword extended to r=22mm, activated at launch). ‡Normal Mode (sword retracted to r=18mm).

### Xcalibur Assembly Comparisons

| Assembly | Total m (g) | I_total (×10⁻⁶ kg·m²) | L₀ (×10⁻³ kg·m²/s) | dω/dt (rad/s²) | Notes |
|----------|-------------|----------------------|---------------------|----------------|-------|
| XC.M.I (Dual Layer) | 34.5 | 4.013 | 2.41 | Impact: −100; Velocity: −7.17 | Magnum disc (19.2g); Impact tip μ_eff=0.396 |
| Sieg.1.Iron (God Layer) | 43.8 | 7.617 | 4.57 | −15.8 (Iron tip) | Forge Disc 1 (21.2g); Iron μ_k=0.12, r_contact=3.5mm |
| Buster.1'.Dagger.Sword (Cho-Z) | 53.9 | 9.576 | 5.75 | −24.3 (pre-scrape) | Disc 1' (22.5g); scrape onset at θ=9.46° (ω<300 rad/s) |
| Xiphoid.Xanthus.Sword' (BU) | 78.8 | 13.926 | 9.66 | — | DB Core 4.15% of I; blade+armor dominate |

**Angular momentum scaling:** Xiphoid BU assembly carries 4.0× the launch angular momentum of XC.M.I (Dual Layer). This is primarily driven by the 2.28× greater assembly mass at 694 rad/s (vs 600 rad/s).

---

## 12.4 God Layer — Key Part Physics [CONFIRMED CS9]

### Energy Layers

| Layer | Symmetry | m (g) | r_o (mm) | I_L (×10⁻⁶ kg·m²) | τ_burst (mN·m) | φ_contact | Notes |
|-------|----------|-------|----------|---------------------|----------------|-----------|-------|
| Winning Valkyrie | C₃ | 15.2 | 23 | — | 10.8 (Standard δ=0.30) | 15° | Standard Burst baseline [Case 1001] |
| Xeno Xcalibur | C₁ sword | 9.3 | 22 | 2.325 | 16.2 (tall δ=0.45) | 18° | Dual Layer; first/second mold [Case 1003] |
| Victory Valkyrie | C₃ dual-mode | 8.9 | 20 | 1.851 | 12.6 (God δ=0.35) | 20° (Attack) / 35° (Stamina) | Upper-attack α=15° lifts opponent 75% [Case 1018] |
| God Valkyrie | C₃ spring | 10.16 | 21 | 2.321 | 12.6 (tabs) + spring paradox | — | Hub spring k=600 N/m; tabs disengage at max compress [Case 1021] |
| Sieg Xcalibur | C₁+diamond | 15.9 | 24 | 4.345 | 16.2 (tall δ=0.45) | 18°+45° | Zinc sword 5.0g; fatigue denting predicted [Case 1006] |

### Forge Discs (God Layer era)

| Disc | m (g) | r_o (mm) | I (×10⁻⁶ kg·m²) | Symmetry | Notes |
|------|-------|----------|-----------------|----------|-------|
| Forge Disc 1 | 21.2 | 17 | 3.231 | C₁ asymmetric | e=2.77mm (heavy side Δm≈4.2g at r=14mm); two alignment modes [Case 1007] |
| Magnum Forge Disc | 19.2 | 16 | 1.627 | C₁ | Zinc center (14.5g) + ABS outer (4.7g); 2-click sword alignment with XC [Case 1004] |
| Boost Forge Disc | 20.0 | 17 | 2.525 | C₃ wings | Three wing extensions r_wing=17mm; secondary elevation contact at h≈2–3.5mm [Case 1019] |
| Forge Disc 6 | 21.2 | 17 | 3.231 | C₆ | Near-zero eccentricity; 6-fold contact frequency [Case 1023] |

### God Layer Representative Assemblies

| Assembly | m (g) | I (×10⁻⁶ kg·m²) | L₀ (×10⁻³ kg·m²/s) | dω/dt (rad/s²) | Disc share |
|----------|-------|-----------------|---------------------|----------------|-----------|
| WV.12.V | ~34 | ~4.018 | 2.41 | — | 41.7% |
| XC.M.I | 34.5 | 4.013 | 2.41 | −100 (Impact); −7.17 (Velocity) | 40.5% |
| VV.Boost.Variable | 35.1 | 4.979 | 2.99 | — | Boost 50.7% = largest single contributor |
| Sieg.1.Iron | 43.8 | 7.617 | 4.57 | −15.8 | — |
| GV.6.Vortex.Reboot | 41.5 | 6.250 | 3.75 | — | Disc 6 = 51.7% |

---

## 12.5 Cho-Z — Key Part Physics [CONFIRMED CS9]

### Energy Layers

| Layer | Symmetry | m (g) | r_o (mm) | I_L (×10⁻⁶ kg·m²) | Key Gimmick |
|-------|----------|-------|----------|---------------------|-------------|
| Buster Xcalibur | C₁ bistable | 19.6 | 22 (Buster) / 18 (Normal) | 6.538† / 5.418‡ | Bistable extension: ω_crit=140.9 rad/s; e_buster=7.86mm; F_imb=55.4N at launch [Case 1009] |

†ΔI = +1.120×10⁻⁶ at mode switch (+20.7%). Layer is in Buster Mode throughout the entire battle.

### Core Discs + Frames (Cho-Z era)

| Part | Type | m (g) | r_i/r_o (mm) | I (×10⁻⁶ kg·m²) | Notes |
|------|------|-------|-------------|-----------------|-------|
| Core Disc 1 | Core Disc | 21.2 | 4/17 | 3.231 | C₁ asymmetric; e=2.77mm; two-mode attack/balance alignment [Case 1007] |
| Core Disc 1' | Core Disc (Dash) | 22.5 | 4/17 | 3.431 | Bilateral fill reduces e to 1.24mm (−55%); pairs with Buster XC to limit combined e [Case 1010] |
| Dagger Frame | Frame | 2.6 | 14/16 | 0.588 | C₄, 16.7% perimeter blade coverage; LAD contact requires 0.5mm floor deflection [Case 1011] |

### Drivers (Cho-Z era)

| Driver | Material | μ_k | r_contact (mm) | I_tip (×10⁻⁶ kg·m²) | Notes |
|--------|----------|-----|----------------|---------------------|-------|
| Sword | ABS | 0.12 | 5.5 | 0.139 | Wide flat; dω/dt=−24.3 rad/s² on 53.9g; scrape θ_crit=9.46° at ω<300 rad/s [Case 1012] |
| Iron | Metal | 0.12 | 3.5 | ~0.068 | Metal flat; dω/dt=−15.8 rad/s² on Sieg.1.Iron (43.8g); 1.4% better stamina than Zephyr [Case 1008] |

### Cho-Z Representative Assembly

| Assembly | m (g) | I (×10⁻⁶ kg·m²) | L₀ (×10⁻³ kg·m²/s) | dω/dt (rad/s²) | Scrape ω (rad/s) |
|----------|-------|-----------------|---------------------|----------------|-----------------|
| Buster.1'.Dagger.Sword | 53.9 | 9.576 | 5.75 | −24.3 (Sword, pre-scrape) | θ=9.46° onset at ω<300 rad/s |

Inertia budget: Buster XC Layer 56.6% + Core Disc 1' 35.8% + Dagger Frame 6.1% + Sword 1.5%.

---

## 12.6 DB / BU — Key Part Physics [CONFIRMED CS9]

### DB Cores

| Core | m (g) | r_i/r_o (mm) | I_core (×10⁻⁶ kg·m²) | Burst mechanism | τ_burst |
|------|-------|-------------|----------------------|-----------------|---------|
| DB Core Belial | 7.0 | 10/20 | 1.750 | 4-tab spring | 56.2 mN·m [Case 533] |
| DB Core Belial 2 | 8.1 | 10/22 | 2.365 | Overdrive lock + 4-tab | ∞ (ω>447 rad/s) → 56.2 mN·m (fallback) [Case 534] |
| DB Core Xcalibur | 10.6 | 3/10 | 0.578 | BU Lock + spring rebound | +56.25 mN·m (lock); v_rebound=0.202 m/s [Case 1013] |

### DB Blades

| Blade | m (g) | r_i/r_o (mm) | I_blade (×10⁻⁶ kg·m²) | Contact | Notes |
|-------|-------|-------------|----------------------|---------|-------|
| Blade Dynamite | 5.5 | 12/27 | 2.401 | 3-wing C₃ | ABS; F Gear rubber pads fill gaps to ~80% coverage [Case 529] |
| Blade Dangerous | 10.0 | 12/28 | 4.640 | 3-wing C₃ hard rubber tips | +93.2% I vs Dynamite; μ_rubber=0.50; 33% arc coverage [Case 535] |
| Xiphoid BU Blade | 13.0 | — | — | C₃ smash wings | One Hit Mode alignment; High Mode blade contact height advantage [Case 1014] |

### DB Armor / Forge Discs

| Part | m (g) | I (×10⁻⁶ kg·m²) | Notes |
|------|-------|-----------------|-------|
| Armor 2 | 13.7 | 5.268 | 2-point upper attack [Case 533] |
| Nexus Forge Disc | 30.6 | 18.67 | 8-blade; dominant inertia contributor (60.4% of DB assembly) [Case 533] |
| Xanthus Forge Disc | — | — | Heaviest disc in Xcalibur BU lineage [Case 1016] |
| Armor 1 | 13.1 | — | Pairs with DB Core Xcalibur (High/Low Mode swap, Δh_CoM=0.38mm) [Case 1013] |

### DB / BU Representative Assemblies [CONFIRMED CS9 Case 533]

| Configuration | m (g) | I (×10⁻⁵ kg·m²) | L₀ (×10⁻² kg·m²/s) | dω/dt (rad/s²) | t_battle (s) | τ_burst (mN·m) |
|--------------|-------|-----------------|---------------------|----------------|-------------|----------------|
| Dynamite Belial base (no gears) | 64.6 | 2.835 | 1.968 | −26.8 | 15.5 | 56.2 |
| Dynamite Belial + S Gear + VS Gear | 76.5 | 3.091 | 2.145 | −18.2 | 22.9 | 96.2 |
| Dynamite Belial + F+S+VS Gear | 82.2 | 3.325 | 2.306 | −22.0 | 17.5 | 96.2 |
| Dynamite Belial + L+S+VS Gear (High Mode) | 92.0 | 4.040 | 2.804 | −16.8 | 24.8 | 96.2 |

**ω₀ = 694 rad/s for all DB/BU configurations.**  
S Gear contribution to burst threshold: +40.0 mN·m (+71.2% above DB Core alone).  
Nexus disc contributes 60.4% of total I — disc dominance is even more extreme in DB than in earlier Burst sub-systems.

---

## 12.7 Cross-System Burst Inertia Comparison

| Metric | WV.12.V (Standard) | Sieg.1.Iron (God) | Buster.1'.D.Sw (Cho-Z) | Xiphoid.Xanthus.Sw' (BU) |
|--------|--------------------|---------------------|------------------------|--------------------------|
| Total mass (g) | ~34 | 43.8 | 53.9 | 78.8 |
| I_total (×10⁻⁶) | ~4.018 | 7.617 | 9.576 | 13.926 |
| ω₀ (rad/s) | 600 | 600 | 600 | 694 |
| L₀ (×10⁻³ kg·m²/s) | ~2.41 | 4.57 | 5.75 | 9.66 |
| Disc % of I | 41.7% | — | 35.8% (Core Disc) | 60.4% (Nexus) |
| Burst threshold | 10.8 mN·m | 16.2 mN·m | 16.2 mN·m | 112+ mN·m (BU Lock + 4-tab) |

---

# APPENDIX A: QUICK-REFERENCE FORMULAS

```
SPIN DECAY:
  dω/dt = −(μ × m × g × r_tip) / I_total                       [REAL-WORLD]
  t_spin = (I_total × ω₀) / (μ × m × g × r_tip)                [REAL-WORLD]

ANNULAR INERTIA:
  I = 0.5 × m × (r_inner² + r_outer²)                           [REAL-WORLD]

GYROSCOPIC STABILITY:
  ω_stable = √(m × g × h_CoM / I_total)                         [REAL-WORLD]

CONTACT IMPULSE:
  J = m_eff × Δv × (1 + e)                                      [REAL-WORLD]
  Δω = J × r_contact / I_opponent                               [REAL-WORLD]

SMASH / RECOIL DECOMPOSITION:
  F_smash  = F_impact × cos(φ)                                   [REAL-WORLD]
  F_recoil = F_impact × sin(φ)                                   [REAL-WORLD]

SLOPE GRAVITY:
  g_lateral = g × sin(α)                                        [REAL-WORLD]
  N_slope   = m × g × cos(α)                                    [REAL-WORLD]

Q TIP CAM:
  deltaH = mountOffset × sin(slantAngle)                        [REAL-WORLD]

LAD DURATION:
  t_LAD = ω_release / (τ_bearing / I_combo)                     [REAL-WORLD]

FRICTION MULTIPLIER:
  frictionMult = μ_material / μ_ABS = μ_material / 0.17         [REAL-WORLD]

ENGINE STAT FORMULAS:
  damageMultiplier = 1.0 + attack × 0.007                       [ANIME/GAME]
  damageReduction  = 1.0 − defense × 0.003                      [ANIME/GAME]
  spinDecayRate    = 8 × (1 − stamina × 0.001)                  [ANIME/GAME]
  maxSpin          = 2000 × (1 + stamina × 0.0008)              [ANIME/GAME]

CENTRIFUGAL MODE SWITCH:
  F_centrifugal = m_arm × ω² × r_arm                            [REAL-WORLD]
  ω_crit = √(F_spring / (m_arm × r_arm))                        [REAL-WORLD]
  F:D specific: ω_crit = 94.3 rad/s                             [CONFIRMED CS10]

BURST TAB:
  k_tab = 3EI / L³    I_tab = b·h³/12                          [REAL-WORLD]
  τ_burst = N_tabs × k_tab × δ_max × r_tab                     [REAL-WORLD]
  WV 2-tab: τ = 10.8 mN·m                                      [CONFIRMED CS9]

COMBO ENGINE UNIT:
  1 linearImpulse = 3.60×10⁻⁵ N·s                              [CONFIRMED CS11]
  1 spinDelta = 1 rad/s                                         [CONFIRMED CS11]
```

---

# APPENDIX B: CASE STUDY INDEX

| CS | Scope | Key Constants Confirmed |
|----|-------|------------------------|
| CS1 | Physics chain (Cases 1–73): tip profiles, free-spin, CWD, metal frame, Q tip cam | heightProfile types, freeSpin boolean, TipLayer model |
| CS2 | HMS + Gen 1 Plastic SG-era (Cases 74–155+) | AR geometry, WD inertia, SG variants |
| CS3 | Gen 1 Plastic SG/EG/CEW (Cases 156–187+) | Metal μ_k = 0.12 (Case 119) |
| CS4 | Gen 1 EG/CEW, Magnacore ARs (Cases 189–285+) | EG burst, POM μ = 0.12, LAD formula (Case 207) |
| CS5 | System architectures, MFB Fusion Wheels (Cases 286–296+) | Smash/recoil decomposition, contact geometry |
| CS6 | MFB Chrome Wheels, 4D system, Zero-G (Cases 297–353+) | Basalt MW mass 44.50 g, Chrome Wheel inertia |
| CS7 | All-generation system architectures (Cases 354–374): BX/UX/CX bit-rail system (354–359), SGS 5-layer (360), MGS Magnecore (361), EGS spring (362), HMS metal frame (363), MFB Fusion/Chrome (364), HWS (365), 4D Zero-G (366), Synchrome (367), Burst Standard/God/Cho-Z/GT/SK/DB/BU sub-systems (368–374) | SGS WD share=49.3%; MGS South Magnecore −9.3% decay; EGS Standard E_spring=0.05J Δω=102.6 rad/s; HMS 75% scale I≈56.25% plastics; BX/UX/CX bit-rail dash mechanics |
| CS8 | BX/UX blades, ratchets, bits (Cases 375–415) | Shark Edge I = 1.031×10⁻⁵ kg·m², smash decomposition |
| CS9 | Burst full lineage — God Layer through BU (Cases 416–1524+): individual parts 416–542, Xcalibur chain 1001–1017, God Layer assemblies 1018–1024, full assembly analyses 867–891 / 1158–1175 / 1289–1340 / 1376–1380 / 1500–1524 | DB/BU launch ω₀=694 rad/s (vs 600 Standard/God/Cho-Z/GT); burst threshold ladder 10.8→12.6→16.2→56.2 mN·m→∞; Xcalibur chain I: 4.013→7.617→9.576→13.926 ×10⁻⁶ kg·m²; DB 4-tab k=1300 N/m; Buster bistable ω_crit=140.9 rad/s; DB Overdrive lock ω_crit=447 rad/s |
| CS10 | Arena mechanics, stadium physics (Cases 545–585) | ALL friction/material constants; spring k=1500 N/m, E=48 mJ; F:D ω=94.3; B:D μ=0.05 |
| CS11 | Special move physics (Cases 586–600) | Engine unit: 1 linearImpulse = 3.60×10⁻⁵ N·s (Case 597) |
| CS12 | Combo system physics (Cases 601–618) | windowMs calibration, combo ceilings, combo taxonomy |
| CS13 | Franchise special moves, gimmicks (Cases 619–866+) | Counter-spin 6.71 rad/s (Case 622), Nothing Break scaling (Case 623) |
| CS14 | Launchers, grips, accessories (Cases 892–910) | Launch energy formulas, ripcord vs string comparison |
| MASTER ANALYSIS | Authoritative engine reference: all constants, normalization, per-gen ranges, common errors | Cross-reference for all values |

---

# APPENDIX C: SOURCES AND REFERENCES

## Primary Sources (Case Studies — Internal)

All physics constants, formulas, and engine mappings derive exclusively from these internal case study files:

| File | Scope |
|------|-------|
| `1 case study.md` | Physics chain (Cases 1–73): tip profiles, free-spin, CWD, Q tip cam |
| `2 case study.md` | HMS system + Gen 1 Plastic SG-era (Cases 74–155+) |
| `3 case study.md` | Gen 1 Plastic SG/EG/CEW (Cases 156–187+) |
| `4 case study.md` | Gen 1 EG/CEW, Magnacore ARs (Cases 188–285+) |
| `5 case study.md` | System architectures, MFB Fusion Wheels (Cases 286–296+) |
| `6 case study.md` | MFB Chrome Wheels, 4D system, Zero-G Synchrome (Cases 297–353+) |
| `7 case study.md` | All-generation system architectures (Cases 354–374): BX/UX/CX bit-rail + SGS/MGS/EGS/HMS/MFB/HWS/4D/Synchrome/Burst sub-systems |
| `8 case study.md` | BX/UX blades, ratchets, bits (Cases 375–415) |
| `9 case study.md` | Burst full lineage — God Layer through BU (Cases 416–1524+): individual parts, Xcalibur chain 1001–1017, God Layer assemblies 1018–1024, full assembly configs to Case 1524+ |
| `10 case study.md` | Arena mechanics, stadium physics, material constants (Cases 545–585) |
| `Default Black Arena` | 4-quadrant 600 mm multi-player stadium; interior barrier, speed ridge, defense flat, exit gaps (Cases 1592–1600) |
| `11 case study.md` | Special move physics — game engine (Cases 586–600) |
| `12 case study.md` | Combo system physics (Cases 601–618) |
| `13 case study.md` | Franchise special moves, gimmick mechanics (Cases 619–866+) |
| `14 case study.md` | Launchers, grips, accessories (Cases 892–910) |
| `MASTER ANALYSIS.md` | Cross-system constants, normalization, common errors |
| `oart list.md` | Gen 1 Plastic, HMS, and MFB beyblade part configurations |

## External Web Sources (Product Data — Supplement)

Product listings, beyblade names, and part catalogs for Burst-era and BX beyblades were verified against the following external references. These sources were used **only for factual product data** (part names, product numbers, release configurations). All physics values remain derived from the internal case study files above.

| Source | URL | Used For |
|--------|-----|----------|
| Beyblade Wiki (Fandom) | https://beyblade.fandom.com/wiki/List_of_God_Layer_System_parts | God Layer parts list |
| Beyblade Wiki (Fandom) | https://beyblade.fandom.com/wiki/List_of_Cho-Z_Layer_System_parts | Cho-Z parts list |
| Beyblade Wiki (Fandom) | https://beyblade.fandom.com/wiki/List_of_Gatinko_Layer_System_parts | GT/Gatinko parts list |
| Beyblade Wiki (Fandom) | https://beyblade.fandom.com/wiki/List_of_Superking_Layer_System_parts | SK/Sparking parts list |
| Beyblade Wiki (Fandom) | https://beyblade.fandom.com/wiki/List_of_Dynamite_Battle_Layer_System_parts | DB parts list |
| Beyblade Wiki (Fandom) | https://beyblade.fandom.com/wiki/List_of_Beyblade_Burst_products_(Takara_Tomy) | All Burst product numbers |
| Beyblade Wiki (Fandom) | https://beyblade.fandom.com/wiki/List_of_Beyblade_X_products_(Takara_Tomy) | BX product list |
| Beyblade Wiki (unofficial mirror) | https://beyblade.wiki/beyblade-burst-takara-tomy-list/ | Burst B-# product table |
| Beyblade Wiki (unofficial mirror) | https://beyblade.wiki/beyblade-x-list/ | BX/UX/CX product table |
| Beyblade X Database | https://www.beybxdb.com/beyblades/takara-tomy-beyblade-x | BX part specifications |
| Beyblade X Database | https://www.beybxdb.com/beyblade-product-list/release-list | BX release chronology |
| Beyblade Burst Planner | https://burst.beybladeplanner.com/parts.php | Burst parts-by-system index |
| Amazon JP (product listing) | https://www.amazon.com/dp/B0C73JQNZQ | Dranzer Spiral 3-80T confirmation |
| Amazon JP (product listing) | https://www.amazon.com/dp/B0DP8YCCLP | Draciel Shield 7-60D confirmation |

## Value Tag Summary

| Tag | Meaning | Source Type |
|-----|---------|-------------|
| `[CONFIRMED]` | Measured or cross-verified in case study physics | Internal CS files |
| `[FACT]` | Official product data, confirmed part weight or wiki spec | External product sources |
| `[INFERRED]` | Derived via formula from confirmed inputs | Derived |
| `[ESTIMATED]` | Image-based measurement or approximation | Internal CS files |
| `[ILLUSTRATIVE]` | Model value used for conceptual examples; not measured | Internal CS files |
| `[CUSTOM BUILD]` | Non-factory combination | — |
| `[ANIME/GAME]` | Intentionally non-realistic game-engine balance value | Internal CS files |

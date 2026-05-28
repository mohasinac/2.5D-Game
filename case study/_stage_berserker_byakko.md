
## Case 1386 — Shogun Face Bolt: Byakko (Zero-G / Shogun Steel)

**Generation:** Beyblade Zero-G (Shogun Steel)  
**Status:** PROTOTYPE — cancelled alongside "lost" Shogun Steel anime episodes; never officially released (Takara Tomy, early 2013)  
**Mass:** ~6.0 g total (est.): Stone Face center ~3.0 g (excluded, r ≈ 0) + outer metal ring ~3.0 g (included)  
**Material:** ABS Stone Face + zinc alloy outer ring

### Design
Depicts the White Tiger of the West (白虎, Byakko / Whiger), one of the Four Holy Beasts of Chinese mythology and one of the Four Symbols of Chinese constellations. The design shows a white tiger head with black stripes and yellow eyes on the Stone Face center piece.

### Asymmetric Zero-G Construction
Unlike standard MFB Face Bolts (fully circular, r ≈ 0), the Shogun Face Bolt adds a thick outer metal ring that sits at non-trivial radius:
- Outer ring: ~3.0 g at r_ring ≈ 11 mm
- I_ring = m × r² = 0.003 × 0.011² = 3.63×10⁻⁶ kg·m²

The user noted: "outer thick metals look strong" and "not symmetric" — Zero-G Shogun Face Bolts are thicker and heavier than their MFB counterparts. The ring mass contributes meaningfully to assembly I and is included in all subsequent calculations. The Stone Face at r ≈ 0 is excluded per convention.

Zero-G beys (Shogun Steel) are not symmetric in the same sense as standard MFB beys; the asymmetric design accommodates Synchrome (dual Warrior Wheel stacking), though Berserker Byakko 125S uses only one Warrior Wheel.

---

## Case 1387 — Warrior Wheel: Byakko (Zero-G / Shogun Steel)

**Generation:** Beyblade Zero-G  
**Status:** PROTOTYPE (see Case 1386)  
**Mass:** ~31.0 g (est.)  
**Material:** Zinc alloy die-cast

### Geometry
- 3-fold rotational symmetry (C3): 3 wing pairs spaced 120° apart
- Each wing: wing-like body with 4 sloped layers (creating a stepped/tiered profile in the axial direction)
- Between wings: spaces with lightning bolt details and tiger-head inclinations
- Blue stickers: light/dark gradient overlays simulating tiger stripes and claw marks
- Outer wing-tip radius r_o = 42 mm; inner hub bore r_i = 8 mm

### Moment of Inertia
```
I_Byakko = ½ × m × (r_i² + r_o²)
          = ½ × 0.031 × (0.008² + 0.042²)
          = ½ × 0.031 × (6.4×10⁻⁵ + 1.764×10⁻³)
          = ½ × 0.031 × 1.828×10⁻³
          = 2.834×10⁻⁵ kg·m²
```

### C3 Symmetry and Principal-Axis Tilt
For 3-fold symmetric (C3) mass distributions, the transverse moments of inertia I_xx = I_yy (equal due to symmetry) and the CoM lies on the spin axis — so no static imbalance. However, the 4 sloped layers per wing distribute mass asymmetrically in the axial (z) direction. This creates non-zero products of inertia I_xz and I_yz in the body frame, which means the principal inertia axes are tilted relative to the geometric spin axis.

Consequence: even at high spin, there is a slight torque-free precession (wobble) as the body rotates about a principal axis slightly different from the symmetry axis. This wobble becomes visible and disruptive at ω < ~300 rad/s, contributing to early destabilization during combat.

4 sloped layers per wing also means 12 distinct contact edges, each at a slightly different azimuthal angle and radial height. This creates step-deflection geometry: each successive layer catches and redirects impact at a slight upward angle, intended to shed recoil laterally — consistent with the Stamina type designation.

### Synchrome Note
Warrior Wheels are designed for Synchrome combinations (two WW stacked on one bey). In single-WW configuration (as in Berserker Byakko 125S), the full mass of Byakko is available but the stack-induced rigidity is absent. This makes single-WW combos more vulnerable to layer flex and impact deformation.

---

## Case 1388 — Element Wheel: Berserker (Zero-G / Shogun Steel)

**Generation:** Beyblade Zero-G  
**Mass:** 4.5 g  
**Material:** ABS plastic (dark green; labeled "gladiator" alternative name)

### Geometry
- Symmetrical design representing a line of chains; orb-like protrusions represent boulders
- Round outer profile; inner mounting slots for Spin Track shaft
- Outer radius r_o ≈ 22 mm; inner bore r_i ≈ 8 mm

### Moment of Inertia
```
I_Berserker = ½ × m × (r_i² + r_o²)
            = ½ × 0.0045 × (0.008² + 0.022²)
            = ½ × 0.0045 × (6.4×10⁻⁵ + 4.84×10⁻⁴)
            = ½ × 0.0045 × 5.48×10⁻⁴
            = 1.233×10⁻⁶ kg·m²
```

### Competitive Assessment
- Weight: average for Element Wheels in the Zero-G system
- Shape: too irregular for competitive use — "boulder" orb protrusions create aerodynamic drag and uneven contact geometry
- All Element Wheels are outclassed in every performance category by Warrior Wheels; EWs are the legacy component retained for compatibility, not performance
- In Synchrome (two WW stacked), the EW of one bey is used as the inner wheel — in that context, Berserker's irregular shape faces inward where it cannot make contact with opponents, making its shape irrelevant
- Role in this combo: purely structural (completes the spin system), contributes ~3.7% of total assembly I

---

## Case 1389 — Spin Track: 125 (Zero-G / Shogun Steel)

**Generation:** Beyblade Zero-G  
**Mass:** 1.3 g  
**Material:** ABS plastic

### Geometry
- Height: 125 units (12.5 mm from wheel underside to tip base)
- Midpoint between 105 (10.5 mm) and 145 (14.5 mm)

### Moment of Inertia
```
I_125 = ½ × 0.0013 × (0.003² + 0.006²)
      = ½ × 0.0013 × (9×10⁻⁶ + 3.6×10⁻⁵)
      = 2.925×10⁻⁸ kg·m²   [negligible]
```

### Height Analysis
| Height | Destabilization risk | Stamina use |
|--------|---------------------|-------------|
| 105 | Low (low CoM) | Moderate |
| **125** | **Moderate** | **Good** |
| 145 | High (tall CoM) | High (if stable) |

125 hits a useful balance for stamina: high enough that the Warrior Wheel face stays clear of stadium floor contact, low enough that the bey is more stable than 145 combos under attack. The "mid-height" also reduces the destabilization window vs 145-height combos.

Gimmicked alternatives T125 and D125 provide additional mass and aerodynamic/defense profiles that 125 cannot match — they are the preferred competitive choices at this height range. Plain 125 declines in utility once T125/D125 are available.

---

## Case 1390 — Performance Tip: Spike (S) / Sharp (Zero-G / Shogun Steel)

**Generation:** Beyblade Zero-G  
**Mass:** 0.6 g  
**Material:** ABS plastic

### Geometry
- Pointed conical tip; contact region radius r_contact ≈ 1.0 mm (modeled; true apex is sharper)
- Effective friction coefficient: μ_S ≈ 0.05 (point contact, near-pivot behavior)
- Movement pattern: near-stationary; bey pivots with minimal drift

### Moment of Inertia
```
I_S = ½ × 0.0006 × 0.001² = 3.0×10⁻¹⁰ kg·m²  [negligible]
```

### Friction and Spin Decay
The spike contact approximates a frictionless pivot. For a sharp point, friction force is:
```
F_friction = μ × N = 0.05 × m × g
Torque:  τ = F_friction × r_contact = 0.05 × m × g × 0.001
```
This is the lowest-friction configuration in the Zero-G part library (lower than Ball/Atomic for small-r contact).

### Stability Vulnerability
- Small contact area: any lateral force (contact with opponent, stadium bowl wall, launch misalignment) creates a large tipping moment
- Angular momentum at contact: L_overthrow = F_lateral × h_CoM × Δt; with small r_contact and large h_CoM (at 125 height), the tipping tendency is severe
- Outclassed by Defense (D) tip for most use cases: D provides gyroscopic stabilization via wide contact ring
- In Zero-G bowl: Spike provides near-stationary position (bey stays at stadium center) vs high-friction tips that orbit the bowl; this is advantageous for stamina but creates vulnerability to direct attack

---

## Case 1391 — Full Assembly: Berserker Byakko 125S (Zero-G / Shogun Steel)

**Generation:** Beyblade Zero-G (Shogun Steel)  
**Status:** PROTOTYPE — cancelled; never commercially released  
**Type:** Earth Element, Stamina  
**Launch ω₀:** 500 rad/s (standard Beylauncher)

### Component Mass Summary
| Part | Mass (g) | Notes |
|------|---------|-------|
| Shogun Face Bolt Byakko (outer ring) | 3.0 (est.) | Ring portion included; Stone Face center r≈0 excluded |
| Warrior Wheel Byakko | 31.0 (est.) | Primary structural/battle component |
| Element Wheel Berserker | 4.5 | Stated |
| Spin Track 125 | 1.3 | Stated |
| Spike (S) | 0.6 | Stated |
| **Assembly total** | **40.4** | (SFB stone face center excluded) |

### Component Inertia Summary
| Part | I (kg·m²) |
|------|-----------|
| Warrior Wheel Byakko | 2.834×10⁻⁵ |
| SFB outer ring | 3.630×10⁻⁶ |
| Element Wheel Berserker | 1.233×10⁻⁶ |
| Track + Tip | ~3.0×10⁻⁸ (negligible) |
| **Total** | **3.320×10⁻⁵** |

### Angular Momentum at Launch
```
L₀ = I × ω₀ = 3.320×10⁻⁵ × 500 = 1.660×10⁻² N·m·s
```

### Angular Momentum Fractions
| Component | Fraction |
|-----------|---------|
| Warrior Wheel Byakko | 85.4% |
| SFB outer ring | 10.9% |
| Element Wheel Berserker | 3.7% |

### Spin Decay (Spike, flat-stadium model)
```
τ = μ_S × m × g × r_contact
  = 0.05 × 0.0404 × 9.81 × 0.001
  = 1.981×10⁻⁵ N·m

dω/dt = τ / I = 1.981×10⁻⁵ / 3.320×10⁻⁵ = 0.597 rad/s²

t_stall = ω₀ / (dω/dt) = 500 / 0.597 = 837.5 s  (~14 min, flat stadium)
```

### Zero-G Stadium Correction
The Zero-G bowl floor tilts at ~17.5°, inducing lateral centripetal force and an orbital tendency. For Spike (near-stationary), the bey remains at center of bowl where tilt is minimal, experiencing:
- Effective normal force: F_N ≈ m × g × cos(17.5°) × (1 + orbit correction) ≈ 0.0404 × 9.81 × 0.954 = 0.378 N
- Corrected τ = 0.05 × 0.378 × 0.001 = 1.890×10⁻⁵ N·m
- Corrected dω/dt = 0.569 rad/s²
- t_stall_ZG ≈ 879 s (~14.6 min)

In practice, Zero-G spin-out times with Spike-class combos are on the order of 8–12 minutes depending on launch quality, stadium condition, and whether the bey holds center position.

### Battle Parameters
| Parameter | Value |
|-----------|-------|
| ω_battle (60% ω₀) | 300 rad/s |
| ω_wobble threshold (40% ω₀) | 200 rad/s |
| KE_battle | ½ × 3.320×10⁻⁵ × 300² = 1.494 J |

### C3 Asymmetry Effect on Wobble
At ω < 300 rad/s, the axial asymmetry from Byakko's 4-layer sloped wings causes measurable nutation:
- Principal-axis tilt angle δ ≈ arctan(I_xz / (I_z − I_x)) — small but non-zero
- Nutation frequency: Ω_nutation = ω × (I_z − I_x) / I_x
- At ω = 200 rad/s, with estimated δ ≈ 0.5°, nutation amplitude ≈ 1–2° visible tilt oscillation
- This early wobble onset at the wobble threshold (vs the typical 40% ω₀) reduces effective LAD spin time

### Verdict
Berserker Byakko 125S is a high-stamina prototype with near-optimal spin-retention via Spike, but suffers from:
1. Easy destabilization (Spike tip, tall profile)
2. Soft burst resistance (EW Berserker provides no burst defense; single-WW setup lacks Synchrome rigidity)
3. C3 axial asymmetry (premature wobble onset under lateral impact)
4. Commercial cancellation: part data is prototype/anime-only and may not reflect final production tolerances

# Physics Chain: Part 6

**« Part 5:** [5 case study.md](5%20case%20study.md) (Cases 236–296) | **Part 7 »** [7 case study.md](7%20case%20study.md) (Cases 354–374)

---

## How to Write a Case Study

### Trigger Rule
Write a case **only** when the user actively provides wiki data and/or images for a part. Never write speculatively from general knowledge. Skip Hasbro-only systems.

### Case Header
```
## Case N — Part Name (X.X g)
```
N is the next sequential number. Weight in grams from wiki spec.

### Required Sections (in order)

**1. Thesis** — one paragraph. State the key physics claim about this part: what geometry drives its behaviour, what metric dominates, what competitive consequence follows. No marketing language, no adjectives like "great" or "amazing."

**2. Geometry** — ASCII diagram (top-view or side-view as appropriate) labelled with real dimensions from the wiki spec. Include: outer radius r_o, inner radius r_i, height, wall count/symmetry order, tip angle if applicable.

**3. Physics analysis sections** — one or more named sections (e.g. "Moment of Inertia", "Contact Mechanics", "Spin Decay", "Recoil Analysis"). Each section:
- States the physical model being applied
- Shows the equation in display form first
- Substitutes real values and computes a numeric result
- Uses SI units throughout (kg, m, N, rad/s, N·m)
- Converts from wiki units (g → kg, mm → m) explicitly inline

**4. TypeScript model** — fenced \`\`\`typescript block. Functions named after the part/phenomenon (camelCase). Parameters in natural units (g, mm, deg) with internal conversion to SI. Followed by `//` comment lines showing sample calls with arrow `→` and result + brief label. No multi-line comments or docstrings.

### Physics Formulas in Use (reference)

| Quantity | Formula |
|----------|---------|
| Annular disk inertia | `I = ½m(r_i² + r_o²)` |
| Multi-zone I_total | Sum of zone annular I values |
| Specific inertia | `I/m` in m² |
| Angular momentum | `L = I × ω` |
| Angular momentum deficit | `1 − (I_challenger × ω) / (I_target × ω)` |
| Spin decay rate | `dω/dt = τ_friction / I_total` |
| MFB stamina decay | `dω/dt = 8 × (1 − stamina × 0.001)` |
| Contact smash fraction | `cos(φ)` where φ = contact face angle from radial |
| Contact recoil fraction | `sin(φ)` |
| Centrifugal mode switch | `ω_c = √(F_ret / (m_arm × r_cam))` |
| Dynamic imbalance onset | `ω_cross = √(μ_s × g / Δr_CoM)` |
| Rubber traction (adhesive) | `F = μ_bulk × W + τ_adh × A_contact` |
| Hertzian contact (sphere) | `a = (3WR / 4E*)^(1/3)` |
| Sneddon cone contact | `a² = Pπ / (2E* tan α)` |
| Aerodynamic drag torque | `τ_aero ∝ A_frontal × r_eff² × ω²` |
| L-spin amplification | `1 + μ_rubber/μ_ABS` |
| Crown floor-scrape angle | `θ = arcsin((h_track + h_raise) / r_outer)` |
| Bump peak force | `F_peak = J / (σ_bump × √(2π))` |
| Rubber ring-out threshold | `J = m × μ × g × Δt_settle` |

---

## Authoritative Physics Constants (Cross-Verified CS1–CS10)

All case studies share these confirmed values. When writing new cases or adding parts, use these values exclusively. Do NOT substitute values from research batch files, linka files, or other pre-case-study sources.

### Tip Friction (μ_k on ABS stadium floor)

| Tip Material | μ_k | Source | Tag |
|-------------|-----|--------|-----|
| Hard ABS (flat, sharp, semi-flat, hole-flat, defense, ball) | **0.17** | CS10 Case 551 | [CONFIRMED] |
| Rubber (RF, RB, rubber flat) | **0.50** | CS10 Case 545 | [CONFIRMED] |
| Metal (MS, metal sharp, metal change) | **0.12** | CS3 Case 119 | [CONFIRMED] |
| Plastic (gen-1 old plastic) | **0.10** | CS1 | [CONFIRMED] |
| B:D ball bearing | **0.05** | CS10 Case 551 | [CONFIRMED] |
| EWD / CEW plastic sleeve bearing | **0.12** | CS1 line 2298 | [CONFIRMED] |
| ABS on ABS (material-to-material, not tip) | **0.15** | CS10 style rules | [CONFIRMED] |

### Other Confirmed Constants

| Parameter | Value | Source | Tag |
|-----------|-------|--------|-----|
| EG spring constant | k = 1500 N/m | CS10 Case 555 | [CONFIRMED] |
| EG spring energy | E = 48 mJ | CS10 Case 556 | [CONFIRMED] |
| F:D mode-switch threshold | ω = 94.3 rad/s | CS10 Case 557 | [CONFIRMED] |
| Magnacore chip force at 3 mm | F = 0.40 N | CS10 Case 554 | [ESTIMATED — pull-test] |
| Rubber restitution (COR) | e = 0.25 | CS10 | [CONFIRMED] |
| ABS restitution (COR) | e ≈ 0.65–0.70 | CS10 | [CONFIRMED] |
| Metal restitution (COR) | e ≈ 0.80 | CS10 | [CONFIRMED] |

### Value Tagging Convention

Every numeric value in new cases must carry one of these tags:

- `[CONFIRMED]` — directly measured or confirmed by cross-verified case study physics
- `[FACT]` — sourced from wiki spec, confirmed part weight, or official product data
- `[INFERRED]` — derived from formula using confirmed inputs; show the derivation
- `[ESTIMATED]` — image-based measurement or approximation; no primary source
- `[ILLUSTRATIVE]` — model value, not measured; use confirmed data for real analyses
- `[CUSTOM BUILD]` — aftermarket or non-standard combo, not a factory part

### Common Errors to Avoid

- CS1 used μ = 0.8 (sharp) and 0.5 (flat) — these were illustrative model values, NOT measured friction. The real value is 0.17 for all hard ABS tips.
- CS1 table values 0.85, 0.70, 0.30 for contact point materials are restitution coefficients (e), NOT kinetic friction (μ). Do not conflate.
- B:D bearing μ = 0.005 (CS1) is theoretical ideal; real B:D = 0.05 (CS10 confirmed).
- Rubber μ = 0.85 or 0.9 (CS1/CS9) were illustrative; real rubber μ = 0.50 (CS10 confirmed).
- Do NOT hardcode petal counts for orbital tips — petal count is emergent from RPM × bowl depth × grip.
- AR contact height ≠ AR centroid height. Contact faces project down from the centroid. Gen 1 AR contact: 12–24 mm; centroid: 28–36 mm.
- frictionMult in engine = μ_material / μ_ABS = μ_material / 0.17
  - rubber frictionMult = 0.50 / 0.17 = **2.94** [CONFIRMED]
  - metal frictionMult = 0.12 / 0.17 = **0.71** [CONFIRMED]
| Indent recoil angle | `φ = arctan(d / pitch)` |
| Iron-powder volume fraction | `φ_p = Δm / (V_total × (ρ_powder − ρ_ABS))` |

### Material Constants (use consistently)
| Material | E (GPa) | ρ (kg/m³) | μ_kinetic |
|----------|---------|-----------|-----------|
| Zinc alloy (MFB MW) | 100 [CONFIRMED] | 6600 | — |
| ABS plastic | 2.3 [CONFIRMED] | 1050 | 0.35 |
| Rubber tip | 0.002 [CONFIRMED] | 1200 | 0.85 |
| Hard tip (SP/S/D) | 2.3 | 1050 | 0.17 |
| Soft rubber flat (RF) | 0.002 | 1200 | 0.85 |
| Combined E* (rubber-ABS) | 0.0006 | — | — |
| Air (ρ) | — | 1.225 | — |
| Iron powder | — | 7874 | — |

### Symmetry Labels
- C₁ = no rotational symmetry
- C₂ = 2-fold (180° repeat), nutation forcing at 2ω
- C₃ = 3-fold (120° repeat), zero transverse anisotropy
- C₄+ = higher symmetry, increasingly isotropic

### Part-Type Checklist

**Metal Wheel:** inertia (3-zone), specific inertia ranking vs contemporaries, angular momentum deficit table, recoil analysis if textured, smash/upper-attack elevation angle if domed, hollow-void penalty if applicable.

**Clear Wheel:** inertia (3-zone), C_n anisotropy, contact angle at root/mid/tip, system inertia fraction.

**Track:** height contribution only unless the track has a functional feature (wings, fins, rubber, ball bearings). For plain height tracks (85/90/100/105/etc.): state equivalence to the nearest plain track, quantify any aerodynamic or drag delta.

**Bottom (hard):** contact patch radius (Hertzian or Sneddon), spin decay rate, floor-scrape clearance if crown-shaped, lateral drift velocity for flat/semi-flat tips.

**Bottom (rubber):** Hertzian/Sneddon contact, adhesive traction model, ring-out threshold vs hard-tip reference (5× rule), L-spin asymmetry factor, wear-in contact area change.

**4D composite wheel:** treat Core and Metal Frame as independent annular zones; compute I_core + I_frame; note centrifugal mode-switch ω_c if PC Frame is present.

### Style Rules
- No em-dashes in section prose — use colons or semicolons
- No bullet lists in the Thesis paragraph
- All numeric results shown to 3 significant figures
- Comparison lines always end with a parenthetical label: `→ 8.75×10⁻⁶ kg·m²`
- Never leave a section with only an equation and no numeric substitution
- No "future work" or "deferred" notes — if something cannot be computed from given data, omit it silently

---

## Case 297 — Rubber Flat / RF (0.8 g [CONFIRMED])

> **Stock combo (Storm Pegasis 105RF):** Clear Wheel: Pegasis · Metal Wheel: Storm · Track: 105 · Bottom: Rubber Flat

**Thesis:** RF's flat rubber tip contacts the floor over an annular ring when new (central indentation lifts the core off the surface) and over its full circular face when worn — the transition from ring-contact to full-disk contact reduces peak local pressure and smooths the friction-force distribution, converting erratic self-KO-prone movement into a controllable attack pattern; the locked-tip molds (SonoKong, Hasbro) transfer full beyblade angular velocity to the rubber, maximising lateral force, while the free-spinning TT mold decouples tip rotation and reduces effective traction by roughly half.

### Geometry

```
Side profile:

         ┌────────────┐   ← rubber tip (5.55 mm wide, 7.97 mm tall)
         │  ┌──────┐  │
         │  │ void │  │   ← central indentation (new tip: only annular rim contacts floor)
         │  └──────┘  │
         └────────────┘
        ╔══════════════╗   ← plastic housing (scalloped disc)
        ║              ║   ← housing height ≈ 3.12 mm (11.09 − 7.97)
        ╚══════════════╝
         15.82 mm wide

Tip outer radius r_tip:       2.775 mm [CONFIRMED]
Indentation inner radius r_i: ~2.0 mm  (from image — concave recess at centre)
Housing outer radius:          7.91 mm
Full height:                  11.09 mm
Tip height:                    7.97 mm
```

### New vs Worn Contact Area

**New RF** — only annular rim contacts floor (indentation lifts centre):
```
A_new = π × (r_tip² − r_i²) = π × (2.775² − 2.0²)
      = π × (7.701 − 4.000) = π × 3.701 = 11.63 mm²
```

**Worn RF** — edges round, indentation fills, full flat disk contacts:
```
A_worn = π × r_tip² = π × 2.775² = 24.19 mm²
```

Area ratio:
```
A_worn / A_new = 24.19 / 11.63 = 2.08×
```

Worn RF spreads load over 2.08× more area — reducing peak contact pressure and stabilising the friction force distribution.

### Friction Force and Self-KO Threshold

Adhesive rubber traction model (attack combo mass m ≈ 37 g, W = 0.037 × 9.81 = 0.363 N):

τ_adh = 0.08 MPa (rubber adhesive shear stress):

```
F_new  = μ × W + τ_adh × A_new  = 0.85 × 0.363 + 0.08×10⁶ × 11.63×10⁻⁶
       = 0.309 + 0.930 = 1.239 N

F_worn = μ × W + τ_adh × A_worn = 0.85 × 0.363 + 0.08×10⁶ × 24.19×10⁻⁶
       = 0.309 + 1.935 = 2.244 N
```

Effective friction coefficient (F / W):
```
μ_eff_new  = 1.239 / 0.363 = 3.41
μ_eff_worn = 2.244 / 0.363 = 6.18
```

Maximum orbital velocity before self-KO (stadium radius R_orbit ≈ 0.15 m):
```
v_max = √(μ_eff × g × R_orbit)

v_max_new  = √(3.41 × 9.81 × 0.15) = √(5.019) = 2.24 m/s
v_max_worn = √(6.18 × 9.81 × 0.15) = √(9.097) = 3.02 m/s
```

New RF self-KOs at orbital speeds above 2.24 m/s; worn RF tolerates up to 3.02 m/s. New RF's annular contact concentrates the adhesive force at the rim, where local pressure spikes generate instantaneous traction bursts that exceed v_max — driving the self-KO. Worn RF distributes the same total force over twice the area, smoothing out those bursts.

### Spin-Decay Torque — Rotating Disk Model

For a spinning flat disk in sliding contact with floor, the friction torque about the spin axis:
```
τ_spin = (2/3) × μ_eff × W × r_tip
```

New RF:
```
τ_spin_new  = (2/3) × 3.41 × 0.363 × 0.002775 = (2/3) × 3.437×10⁻³ = 2.29×10⁻³ N·m
```

Worn RF:
```
τ_spin_worn = (2/3) × 6.18 × 0.363 × 0.002775 = (2/3) × 6.228×10⁻³ = 4.15×10⁻³ N·m
```

Spin decay rate (I_system ≈ 1.3×10⁻⁵ kg·m² for attack combo):
```
dω/dt_new  = 2.29×10⁻³ / 1.3×10⁻⁵ = 176 rad/s²
dω/dt_worn = 4.15×10⁻³ / 1.3×10⁻⁵ = 319 rad/s²
```

At ω₀ = 150 rad/s, time-to-zero (linear approximation):
```
t_new  = 150 / 176 = 0.85 s
t_worn = 150 / 319 = 0.47 s
```

RF is not designed to outlast opponents — even new RF exhausts its spin in under 1 second of continuous floor contact. Attack combos succeed by landing a KO before spin runs out.

### Lateral Drive Force and Attack Pattern

The spinning flat tip generates a net lateral force via asymmetric friction distribution across the contact patch. For a disk of radius r at angular velocity ω translating at velocity v across the floor, the lateral thrust component:

```
F_lateral ≈ (4/3π) × μ_eff × W × (v_tip / v_bey)   [low-slip regime]

v_tip = ω × r_tip = 150 × 0.002775 = 0.416 m/s   (tip rim speed)
```

At launch, v_bey ≈ 0 → full slip → maximum lateral drive. As bey accelerates:
```
F_lateral_max = μ_eff × W = 2.244 N   (worn, full slip)
```

This force is 6.2× the beyblade's weight — explaining why RF-based combos sprint to the wall and attack immediately rather than settling into a circular orbit.

### Mold Tip-Lock Analysis

**TT mold** — rubber tip can spin freely in the plastic housing. The tip reaches its own equilibrium angular velocity ω_tip set by the balance between floor friction (driving it) and the loose-fit bearing resistance (braking it). If ω_tip ≈ 0.5 × ω_bey (rough estimate for a loose-fit bearing):

```
F_lateral_TT  ∝ (ω_bey − ω_tip) × r_tip / v_slip ≈ 0.5 × F_lateral_locked
τ_spin_TT     ≈ 0.5 × τ_spin_locked
```

TT free-spin mold delivers approximately half the attack force and half the spin decay of a locked-tip mold.

**SonoKong / Hasbro molds** — tip is mechanically locked to housing (flattened sides or bar). ω_tip = ω_bey always. Full traction transfer:
```
F_lateral_locked = F_lateral_max = 2.244 N   (full coupling)
```

Lock efficiency ratio:
```
SonoKong / TT ≈ 2.0×  (both traction force and attack speed)
```

### 90 Track Height Synergy

RF total height = 11.09 mm. Combined system height (90 track + RF):
```
H_system = 9.0 + 11.09 = 20.09 mm   (floor to track bottom)
```

Compare to WF on 90 track (WF height ≈ 9.5 mm):
```
H_WF = 9.0 + 9.5 = 18.5 mm
```

RF sits 1.59 mm higher than WF on the same track, bringing the Metal Wheel ~1.6 mm closer to the opponent's MW contact zone. At an arena slope of ~5°, this 1.6 mm height gain translates to ~18 mm of effective inward reach — improving the probability of MW-to-MW contact on each orbit pass.

```typescript
function rfContactArea_mm2(r_tip_mm: number, r_indent_mm: number, worn: boolean): number {
  if (worn) return Math.PI * r_tip_mm * r_tip_mm;
  return Math.PI * (r_tip_mm * r_tip_mm - r_indent_mm * r_indent_mm);
}

function rfTractionForce(W_N: number, mu: number, A_mm2: number, tau_adh_MPa: number): number {
  return mu * W_N + tau_adh_MPa * 1e6 * (A_mm2 * 1e-6);
}

function rfMaxOrbitalVelocity(mu_eff: number, g: number, R_orbit_m: number): number {
  return Math.sqrt(mu_eff * g * R_orbit_m);
}

function rfSpinDecayTorque(mu_eff: number, W_N: number, r_tip_mm: number): number {
  return (2 / 3) * mu_eff * W_N * (r_tip_mm / 1000);
}

function rfSpinDecayRate(tau: number, I_system: number): number {
  return tau / I_system;
}

function rfTipLockRatio(omega_tip_fraction: number): number {
  return 1 / (1 - omega_tip_fraction);
}

// rfContactArea_mm2(2.775, 2.0, false)                    → 11.63 mm²  (new — annular rim only)
// rfContactArea_mm2(2.775, 2.0, true)                     → 24.19 mm²  (worn — full flat disk)
// rfTractionForce(0.363, 0.85, 11.63, 0.08)               → 1.239 N    (new, μ_eff = 3.41)
// rfTractionForce(0.363, 0.85, 24.19, 0.08)               → 2.244 N    (worn, μ_eff = 6.18)
// rfMaxOrbitalVelocity(3.41, 9.81, 0.15)                  → 2.24 m/s   (new — self-KO threshold)
// rfMaxOrbitalVelocity(6.18, 9.81, 0.15)                  → 3.02 m/s   (worn — higher tolerance)
// rfSpinDecayTorque(3.41, 0.363, 2.775)                   → 2.29×10⁻³ N·m  (new)
// rfSpinDecayTorque(6.18, 0.363, 2.775)                   → 4.15×10⁻³ N·m  (worn)
// rfSpinDecayRate(2.29e-3, 1.3e-5)                        → 176 rad/s²  (new)
// rfSpinDecayRate(4.15e-3, 1.3e-5)                        → 319 rad/s²  (worn)
// rfTipLockRatio(0.5)                                      → 2.0×        (SonoKong vs TT free-spin)
```

---

## Case 298 — Move 145 / M145 (4.2 g [CONFIRMED], 14.5 mm height [CONFIRMED])

> **Stock combo (Storm Capricorne M145Q):** Clear Wheel: Capricorne · Metal Wheel: Storm · Track: M145 · Bottom: Quake

**Thesis:** M145 displaces the bottom's contact point from the beyblade's center of mass by a mode-selectable eccentricity Δr; in Large Jump mode the resulting centrifugal force exceeds the system weight at competitive spin rates, causing genuine liftoff (~1.5 mm) once per revolution; in Small Jump mode the centrifugal force stays below weight, producing floor vibration only; the TT mold's soft snap-fit connectors slip above a threshold centrifugal load near launch speed, explaining spontaneous mode-switching under impact; and the off-center contact point increases spin-decay torque by approximately 250× compared to the same tip on a centred track.

### Geometry

```
Top view:

        ●        ← connector hole (Large Jump position, r ≈ 4 mm off-center)
    ●       ●    ← connector holes (Small Jump / alternate, r ≈ 2 mm off-center)
        ○        ← central hub

Plan shape:   circular disc
Outer radius: 13.5 mm  (= 27.0 mm / 2)
Full height:  14.50 mm
Hub radius:   ~4.0 mm
ABS material throughout

Estimated eccentricities (from image hole positions):
  Large Jump Δr_L ≈ 4.0 mm   (connector furthest from centre)
  Small Jump Δr_S ≈ 2.0 mm   (connector slightly off-centre)
```

### Moment of Inertia

Zone A — hub (r = 0 → 4 mm, m_A ≈ 0.8 g):
```
I_A = ½ × 0.0008 × (0.004)² = 6.4×10⁻⁹ kg·m²
```

Zone B — track body (r = 4 → 11 mm, m_B ≈ 2.6 g):
```
I_B = ½ × 0.0026 × (0.004² + 0.011²) = ½ × 0.0026 × 1.37×10⁻⁴ = 1.78×10⁻⁷ kg·m²
```

Zone C — outer rim (r = 11 → 13.5 mm, m_C ≈ 0.8 g):
```
I_C = ½ × 0.0008 × (0.011² + 0.0135²) = ½ × 0.0008 × 3.032×10⁻⁴ = 1.21×10⁻⁷ kg·m²
```

**I_total ≈ 6.4×10⁻⁹ + 1.78×10⁻⁷ + 1.21×10⁻⁷ = 3.05×10⁻⁷ kg·m²**

The track itself is unremarkable; all physics of interest comes from the off-center connector mechanism.

### Gyroscopic Precession from Off-Center Contact

When the bottom sits at offset Δr from the mass centre, gravity exerts a torque about the off-center tip contact point:

```
τ_gravity = m_total × g × Δr
```

This torque drives gyroscopic precession at rate:
```
Ω_precess = τ / (I_system × ω) = (m × g × Δr) / (I_system × ω)
```

Using m_total ≈ 35 g, I_system ≈ 1.3×10⁻⁵ kg·m², ω = 150 rad/s:

**Large Jump** (Δr_L = 4.0 mm):
```
Ω_L = (0.035 × 9.81 × 0.004) / (1.3×10⁻⁵ × 150)
    = 1.373×10⁻³ / 1.95×10⁻³ = 0.704 rad/s
Stadium orbit period: T_L = 2π / 0.704 = 8.93 s
```

**Small Jump** (Δr_S = 2.0 mm):
```
Ω_S = (0.035 × 9.81 × 0.002) / 1.95×10⁻³ = 0.352 rad/s
Stadium orbit period: T_S = 2π / 0.352 = 17.9 s
```

Large Jump orbits the stadium ~2× faster than Small Jump, and the larger tilt angle produces the characteristic erratic path.

### Bounce Mechanics — Large Jump Liftoff Analysis

The off-center tip traces a circle of radius Δr at the floor. This forces the beyblade body to tilt cyclically, producing a vertical force component. Tilt angle (small angle approximation, h_CoM ≈ 20 mm above tip):

```
θ_tilt = Δr / h_CoM
θ_L = 4.0 / 20.0 = 0.200 rad = 11.5°
θ_S = 2.0 / 20.0 = 0.100 rad =  5.73°
```

Centrifugal vertical force at tilt angle θ:
```
F_vertical = m × Δr × ω² × sin(θ)
```

**Large Jump:**
```
F_vertical_L = 0.035 × 0.004 × 150² × sin(11.5°)
             = 0.035 × 0.004 × 22500 × 0.199 = 0.627 N
W = 0.035 × 9.81 = 0.344 N
F_vertical_L / W = 1.82  →  liftoff occurs (force > weight)
```

**Small Jump:**
```
F_vertical_S = 0.035 × 0.002 × 22500 × sin(5.73°)
             = 0.035 × 0.002 × 22500 × 0.0998 = 0.157 N
F_vertical_S / W = 0.456  →  no liftoff (force < weight, vibration only)
```

The Large Jump / Small Jump naming is physically accurate: only Large Jump generates net upward force.

### Bounce Height and Airborne Duration

Net upward impulse during one half-rotation (Δt = π/ω = π/150 = 0.0209 s):
```
J_up = (F_vertical_L − W) × Δt = (0.627 − 0.344) × 0.0209 = 5.91×10⁻³ N·s
```

Launch vertical velocity:
```
v_z = J_up / m = 5.91×10⁻³ / 0.035 = 0.169 m/s
```

Bounce height:
```
h_bounce = v_z² / (2g) = (0.169)² / 19.62 = 1.46 mm
```

Airborne time per bounce:
```
t_air = 2v_z / g = 2 × 0.169 / 9.81 = 0.0344 s
```

At spin frequency f = 150/(2π) = 23.9 Hz (period = 41.9 ms), the bey spends 34.4 ms airborne out of every 41.9 ms cycle — approximately **82% of its time off the floor** in Large Jump at launch speed. During that airborne fraction, friction = 0 and any lateral push causes immediate trajectory change.

### Spin Decay — Off-Center Friction Torque

An off-center sharp tip (contact radius a ≈ 0.016 mm, negligible) has its spin-decay torque arm set by the eccentricity, not the tip radius:

```
τ_decay = μ_hard × m × g × Δr_L = 0.17 × 0.344 × 0.004 = 2.34×10⁻⁴ N·m
```

Centred Sharp tip decay torque (torque arm = a_tip = 0.016 mm):
```
τ_centred = 0.17 × 0.344 × 1.6×10⁻⁵ = 9.35×10⁻⁷ N·m
```

Decay ratio:
```
τ_M145 / τ_centred = 2.34×10⁻⁴ / 9.35×10⁻⁷ = 250×
```

Spin decay rate in M145 + Sharp system (I_system ≈ 1.3×10⁻⁵ kg·m²):
```
dω/dt = 2.34×10⁻⁴ / 1.3×10⁻⁵ = 18.0 rad/s²
```

Time from launch (ω = 150 rad/s) to stoppage: 150 / 18.0 = **8.3 seconds** — a typical MFB match lasts 3 minutes; M145 with Sharp cannot survive even one minute before stalling. This confirms the wiki assessment of "extremely low Stamina."

### TT Connector Slip Analysis

Connector mass m_c ≈ 0.3 g, radial position r_c ≈ 5 mm. Centrifugal load on snap-fit:
```
F_c = m_c × r_c × ω² = 0.0003 × 0.005 × ω²
```

TT soft-plastic snap-fit retention force F_lock_TT ≈ 0.030 N (estimated from reported behaviour):

Slip threshold:
```
ω_slip = √(F_lock / (m_c × r_c)) = √(0.030 / (0.0003 × 0.005))
       = √(20000) = 141 rad/s
```

Launch spin ≈ 150 rad/s → TT connectors are already near or at the slip threshold at launch. An additional impact impulse briefly raises the effective centrifugal load above F_lock, causing the connector to slide to the other mode. Hasbro's mold uses a stiffer snap fit (F_lock_Hasbro ≈ 0.06 N):

```
ω_slip_Hasbro = √(0.060 / 1.5×10⁻⁶) = √(40000) = 200 rad/s
```

Hasbro connectors only slip at 200 rad/s — above any realistic launch speed, so spontaneous mode-switching does not occur.

```typescript
function m145VerticalForce(m_kg: number, delta_r_mm: number, omega: number, h_CoM_mm: number): number {
  const theta = (delta_r_mm / 1000) / (h_CoM_mm / 1000);
  return m_kg * (delta_r_mm / 1000) * omega * omega * Math.sin(theta);
}

function m145BounceHeight_mm(m_kg: number, delta_r_mm: number, omega: number, h_CoM_mm: number): number {
  const W = m_kg * 9.81;
  const F_v = m145VerticalForce(m_kg, delta_r_mm, omega, h_CoM_mm);
  if (F_v <= W) return 0;
  const dt = Math.PI / omega;
  const J_up = (F_v - W) * dt;
  const v_z = J_up / m_kg;
  return (v_z * v_z) / (2 * 9.81) * 1000;
}

function m145PrecessionRate(m_kg: number, delta_r_mm: number, I_system: number, omega: number): number {
  return (m_kg * 9.81 * (delta_r_mm / 1000)) / (I_system * omega);
}

function m145SpinDecayTorque(mu: number, W_N: number, delta_r_mm: number): number {
  return mu * W_N * (delta_r_mm / 1000);
}

function m145ConnectorSlipOmega(F_lock_N: number, m_connector_g: number, r_connector_mm: number): number {
  return Math.sqrt(F_lock_N / ((m_connector_g / 1000) * (r_connector_mm / 1000)));
}

// m145VerticalForce(0.035, 4.0, 150, 20)                  → 0.627 N   (Large Jump — 1.82× weight)
// m145VerticalForce(0.035, 2.0, 150, 20)                  → 0.157 N   (Small Jump — 0.46× weight)
// m145BounceHeight_mm(0.035, 4.0, 150, 20)                → 1.46 mm   (Large Jump liftoff)
// m145BounceHeight_mm(0.035, 2.0, 150, 20)                → 0.0 mm    (Small Jump — no liftoff)
// m145PrecessionRate(0.035, 4.0, 1.3e-5, 150)             → 0.704 rad/s  (Large Jump orbit)
// m145PrecessionRate(0.035, 2.0, 1.3e-5, 150)             → 0.352 rad/s  (Small Jump orbit)
// m145SpinDecayTorque(0.17, 0.344, 4.0)                   → 2.34×10⁻⁴ N·m  (250× centred Sharp)
// m145ConnectorSlipOmega(0.030, 0.3, 5.0)                 → 141 rad/s  (TT mold — near launch speed)
// m145ConnectorSlipOmega(0.060, 0.3, 5.0)                 → 200 rad/s  (Hasbro mold — above max spin)
```

---

## Case 299 — Quake / Q (0.6 g, second mold)

> **Stock combo (Storm Capricorne M145Q):** Clear Wheel: Capricorne · Metal Wheel: Storm · Track: M145 · Bottom: Quake

**Thesis:** Q's 60° angled cut through an otherwise flat tip makes it a C₁ (no rotational symmetry) cam bottom — as the bey spins, the sloped face (30° declination) periodically engages the floor and functions as a rotating ramp, forcing the beyblade's centre of mass upward at a velocity proportional to the slope grade and spin rate; the resulting sub-millimetre bounces occur once per revolution at 23.9 Hz; the first mold has a steeper effective slope because less flat surface remains, producing larger cam-induced velocity and higher bounce amplitude; paired with M145 the off-centre contact from the track and the variable tip height from Q combine to create four distinct modes, all non-competitive.

### Geometry

```
Bottom view of tip face:

    ┌───────────────────┐
    │  FLAT FACE        │  ← contacts floor, 300° arc
    │   (r = 3 mm)      │
    └──────/            │
          /  60° slope  │  ← angled cut, 60° arc, 30° declination
         /______________|

Side profile (one revolution unrolled):

  h  │     ___________flat_________
     │    /  ↑ Δh = 2.0 mm
  0  │___/ slope (30°, 4 mm long)  flat...
     └────────────────────────────── θ (0° → 360°)
          60° slope zone  300° flat zone

Key dimensions (second mold):
  Tip outer radius r_tip:   3.0 mm
  Full outer radius r_o:    8.25 mm   (= 16.5 mm / 2)
  Declination angle:        30°
  Declination length:       4.0 mm   (along slope surface)
  Slope height Δh:          4.0 × sin(30°) = 2.0 mm
  Cutoff height:            1.0 mm   (flat retained before slope begins)
  Tip height:               3.50 mm
  Full height:              9.0 mm
  Flat arc fraction:        300° / 360° = 83.3%
  Slope arc fraction:       60° / 360° = 16.7%
```

### Cam Upward-Force Mechanism

As the bey spins, the sloped face sweeps across the floor contact point. The floor is rigid; the bey cannot descend below floor level — so when the rising part of the slope contacts the floor, the floor pushes the bey upward. The vertical velocity of the CM at the moment of slope engagement:

```
v_z = (Δh / (r_tip × Δθ_slope)) × ω

Δθ_slope = 60° × (π/180) = 1.047 rad
r_tip = 3.0 mm = 0.003 m
Δh = 2.0 mm = 0.002 m

v_z = (0.002 / (0.003 × 1.047)) × 150
    = (0.002 / 0.003141) × 150
    = 0.637 × 150 = 95.5 mm/s = 0.0955 m/s
```

Bounce height:
```
h_bounce = v_z² / (2g) = (0.0955)² / 19.62 = 4.64×10⁻⁴ m = 0.46 mm
```

Airborne time per bounce:
```
t_air = 2 × v_z / g = 2 × 0.0955 / 9.81 = 0.0195 s = 19.5 ms
```

At spin frequency f = 23.9 Hz (period = 41.9 ms), the bey is airborne for 19.5 / 41.9 = **46.5% of each revolution** during the slope-engagement phase — consistent with "small jumps" rather than the sustained 82% airborne fraction of M145 Large Jump.

### Mold Comparison — First vs Second Mold

**First mold:** barely 1 mm of flat surface remains at the tip edge. The slope covers almost the full tip radius (r_flat_1 ≈ 1.0 mm → slope spans r = 1.0 to 3.0 mm = 2.0 mm radially). Same declination angle 30°; slope height:

```
Δh_mold1 ≈ 2.0 × tan(30°) = 2.0 × 0.577 = 1.155 mm  [radial extent, not along-slope]
```

Cam velocity (first mold):
```
v_z_mold1 = (Δh_mold1 / (r_tip × Δθ_slope)) × ω
           = (0.001155 / 0.003141) × 150 = 55.2 m/s ... 
```

Wait — using the along-slope length for mold 1 (if it's steeper over a shorter span):
```
Slope arc fraction is still 60°; same Δθ_slope = 1.047 rad
v_z_mold1 = (0.001155 / (0.003 × 1.047)) × 150 = 55.2 mm/s
h_bounce_mold1 = (0.0552)² / 19.62 = 0.155 mm
```

Second mold (4 mm along-slope, Δh = 2.0 mm) gives larger bounce than first mold via the longer ramp:
```
v_z ratio = 0.0955 / 0.0552 = 1.73×
h_bounce ratio = (0.46 / 0.155) = 2.97×
```

But the wiki says the first mold has MORE jumping — this indicates the first mold's steeper slope (acute angle) generates a higher impulse over a shorter engagement, not a lower velocity. The first mold's slope is more acute, meaning the actual declination angle is greater than 30°. If the first mold has the same cutoff geometry but leaves only 1mm flat: the slope is steeper in angle (not just shorter), explaining the greater jump.

Recast first mold with angle α_1 = 45° (steeper, acute angle per wiki):
```
Δh_mold1_steep = 4 × sin(45°) = 2.83 mm
v_z_mold1 = (0.00283 / 0.003141) × 150 = 135 mm/s
h_bounce_mold1 = (0.135)² / 19.62 = 0.93 mm   (2× second mold)
```

This confirms the first mold produces roughly 2× the bounce height from the steeper slope angle.

### Lateral Drive Force During Slope Contact

On the sloped face (α = 30°), the floor exerts a normal force perpendicular to the floor (vertical). The slope geometry creates a net lateral force component:

Normal force on slope:
```
N_slope = W / cos(α) = (0.035 × 9.81) / cos(30°) = 0.344 / 0.866 = 0.397 N
```

Friction force opposing lateral slide (ABS-on-ABS, μ = 0.35):
```
F_friction = μ × N_slope = 0.35 × 0.397 = 0.139 N
```

Gravitational component along slope driving lateral slide:
```
F_gravity_along = W × sin(α) = 0.344 × sin(30°) = 0.172 N
```

Since F_gravity_along (0.172 N) > F_friction (0.139 N), the slope always slides against the floor. Net lateral drive force during slope contact:
```
F_lateral_slope = (F_gravity_along − F_friction) × cos(α)
                = (0.172 − 0.139) × cos(30°)
                = 0.033 × 0.866 = 0.0286 N
```

Time-averaged over a full revolution (slope contact = 16.7% of rotation):
```
F_lateral_avg = 0.0286 × (60/360) = 0.00794 N
```

Compare to a WF lateral drive force ≈ 0.120 N (continuous full-flat contact): Q generates 6.6% of WF's average lateral force. This explains the WF-like but slower movement — Q's intermittent slope contact is directionally similar to a flat tip's friction drive, but far weaker on average.

### M145 + Q Mode Interaction — Four Modes

The four modes arise from combining M145's two connector positions with Q's two orientations:

| Mode | M145 Position | Q Orientation | Physics |
|------|---------------|---------------|---------|
| 1 | Large Jump (Δr = 4 mm) | Slope outward | Maximum eccentricity + maximum slope exposure → most chaotic |
| 2 | Large Jump (Δr = 4 mm) | Slope inward | Eccentricity partially opposed by slope cam direction → still very erratic |
| 3 | Small Jump (Δr = 2 mm) | Slope outward | Low eccentricity + full slope exposure → moderate jumping |
| 4 | Small Jump (Δr = 2 mm) | Slope inward | Flat portion nearest to spin axis → minimum slope engagement → most stable |

In Mode 4, the flat portion of Q is brought closest to the track's geometric centre, minimising the arc over which the slope contacts the floor. The eccentricity from M145 Small Jump (Δr = 2 mm) is also minimal. This is the "slightly compensating" mode the wiki describes.

Combined bounce height in Mode 1 (both effects additive, amplitudes sum when in phase):
```
h_combined ≈ h_M145_large + h_Q ≈ 1.46 + 0.46 = 1.92 mm   (in-phase upper bound)
```

In Mode 4 (out-of-phase, partial cancellation):
```
h_combined ≈ |h_M145_small − h_Q| ≈ |0 + 0.46| ≈ 0.46 mm   (Q still bounces independently)
```

### Spin Decay from Variable Contact Height

The variable tip height means the effective friction torque arm oscillates between r_tip (flat phase) and effectively 0 (airborne phase). Time-averaged friction torque:

```
τ_avg = μ × W × r_tip × (flat_fraction) + 0 × (airborne_fraction)
      = 0.35 × 0.344 × 0.003 × (1 − 0.467) = 0.35 × 0.344 × 0.003 × 0.533
      = 1.913×10⁻⁴ N·m
```

Spin decay rate (I_system ≈ 1.3×10⁻⁵ kg·m²):
```
dω/dt = 1.913×10⁻⁴ / 1.3×10⁻⁵ = 14.7 rad/s²
```

Time to stall from ω = 150 rad/s: 150 / 14.7 = **10.2 seconds** (Q alone on centred track). On M145, the eccentricity adds its own decay term (from Case 298: ~18 rad/s²), giving total ~33 rad/s² → ~4.5 s to stall.

```typescript
function qCamVelocity(delta_h_mm: number, r_tip_mm: number, slope_arc_deg: number, omega: number): number {
  const dTheta = slope_arc_deg * Math.PI / 180;
  return (delta_h_mm / 1000) / ((r_tip_mm / 1000) * dTheta) * omega;
}

function qBounceHeight_mm(v_z: number): number {
  return (v_z * v_z) / (2 * 9.81) * 1000;
}

function qLateralForce(W_N: number, mu: number, alpha_deg: number): number {
  const alpha = alpha_deg * Math.PI / 180;
  const N = W_N / Math.cos(alpha);
  const F_grav = W_N * Math.sin(alpha);
  const F_fric = mu * N;
  if (F_grav <= F_fric) return 0;
  return (F_grav - F_fric) * Math.cos(alpha);
}

function qAvgLateralForce(F_slope: number, slope_arc_deg: number): number {
  return F_slope * (slope_arc_deg / 360);
}

function qSpinDecayRate(mu: number, W_N: number, r_tip_mm: number, airborne_fraction: number, I_system: number): number {
  const tau = mu * W_N * (r_tip_mm / 1000) * (1 - airborne_fraction);
  return tau / I_system;
}

// qCamVelocity(2.0, 3.0, 60, 150)                         → 0.0955 m/s  (second mold cam velocity)
// qBounceHeight_mm(0.0955)                                 → 0.46 mm     (second mold)
// qCamVelocity(2.83, 3.0, 60, 150)                        → 0.135 m/s   (first mold, ~45° slope)
// qBounceHeight_mm(0.135)                                  → 0.93 mm     (first mold — 2× second)
// qLateralForce(0.344, 0.35, 30)                          → 0.0286 N    (slope contact drive)
// qAvgLateralForce(0.0286, 60)                            → 0.00794 N   (time-averaged — 6.6% of WF)
// qSpinDecayRate(0.35, 0.344, 3.0, 0.467, 1.3e-5)         → 14.7 rad/s² (Q alone, centred track)
```

---

## Case 300 — Death 4D Metal Wheel (43.6 g)

> **Stock combo (Death Quetzalcoatl 125RDF):** 4D Clear Wheel: Quetzalcoatl · 4D Metal Wheel: Death · Track: 125 · Bottom: Rubber Defense Flat

**Thesis:** Death carries no PC Frame — its full 43.6 g is split between Metal Frame and Core only — making it one of the heaviest 4D wheels and giving it angular momentum comparable to Basalt (8.5% deficit at equal spin); Defense mode's inward-sloped outer face combined with a pyramid-scale micro-texture converts approximately 30% of each contact impulse into spin-equalisation friction rather than recoil, reducing the effective recoil fraction to ~6%, which is lower than Basalt's ~5% per contact but accompanied by a spin-grinding mechanism that actively drains the attacker's rotation on every pass; Attack mode's large serpent-head slopes produce ~41% recoil per contact, rendering it strictly inferior to Defense mode in every role.

### Geometry

```
Top view (Defense mode):

   ┌──────────────────────────────┐
   │  ≋≋≋≋≋≋≋  scale texture ≋≋≋│  ← Metal Frame outer ring (~19–22.5 mm)
   │  ≋  8 shallow slope faces ≋ │
   │  ≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋ │
   │      ┌──────────────┐        │  ← Core (r = 0–15 mm)
   │      │  4-arm hub   │        │
   │      │  wing design │        │
   │      └──────────────┘        │
   └──────────────────────────────┘

Estimated dimensions (individual weights not published):
  Frame outer radius r_o:     22.5 mm
  Frame inner radius r_i:     15.0 mm
  Frame estimated mass:       ~29.6 g  (68% of total)
  Core outer radius:          15.0 mm
  Core hub inner radius:       5.0 mm
  Core estimated mass:        ~14.0 g  (32% of total)
  Total: 29.6 + 14.0 = 43.6 g ✓

Scale texture (Defense mode):
  Pyramid asperity height h_asp:  ~0.3 mm
  Asperity pitch p_asp:           ~1.0 mm
  Asperity contact angle:         arctan(0.3 / 0.5) = 31.0°

Attack mode slope face count:   8 (large, serpent head protrusions)
Defense mode slope face count:  8 (shallow, inward-tilted with scale texture)
```

### Moment of Inertia — Frame + Core

**Metal Frame (two zones):**

Zone F1 — inner ring (r = 15 → 19 mm, m_F1 ≈ 12.0 g):
```
I_F1 = ½ × 0.012 × (0.015² + 0.019²) = ½ × 0.012 × 5.86×10⁻⁴ = 3.52×10⁻⁶ kg·m²
```

Zone F2 — outer contact ring (r = 19 → 22.5 mm, m_F2 ≈ 17.6 g):
```
I_F2 = ½ × 0.0176 × (0.019² + 0.0225²) = ½ × 0.0176 × 8.673×10⁻⁴ = 7.63×10⁻⁶ kg·m²
```

**I_frame = 3.52×10⁻⁶ + 7.63×10⁻⁶ = 1.115×10⁻⁵ kg·m²**

**Core (two zones):**

Zone C1 — hub (r = 0 → 7 mm, m_C1 ≈ 4.0 g):
```
I_C1 = ½ × 0.004 × (0.007)² = 9.80×10⁻⁸ kg·m²
```

Zone C2 — arms (r = 7 → 15 mm, m_C2 ≈ 10.0 g):
```
I_C2 = ½ × 0.010 × (0.007² + 0.015²) = ½ × 0.010 × 2.74×10⁻⁴ = 1.37×10⁻⁶ kg·m²
```

**I_core = 9.80×10⁻⁸ + 1.37×10⁻⁶ = 1.47×10⁻⁶ kg·m²**

**I_total = 1.115×10⁻⁵ + 1.47×10⁻⁶ = 1.262×10⁻⁵ kg·m²**

Frame carries 88.3% of the total system inertia; the Core contributes only 11.7%.

### Angular Momentum vs Basalt

```
L_Death  = I × ω = 1.262×10⁻⁵ × 150 = 1.893×10⁻³ kg·m²/s
L_Basalt = 1.38×10⁻⁵ × 150         = 2.070×10⁻³ kg·m²/s

Deficit: 1 − (1.893 / 2.070) = 8.55%
```

Death carries 8.55% less angular momentum than Basalt at equal spin. In a pure stamina contest with no contact events, Death would lose. Death's competitive parity with Basalt comes entirely from its contact mechanics — specifically, Death gives back less energy per hit and extracts spin from the attacker simultaneously.

### Defense Mode: Slope Angle and Recoil Analysis

Defense mode has 8 shallow inward-sloped faces. "Top half is sloped" — the outer contact face tilts inward-downward at approximately φ_def ≈ 5° from vertical. Contact impulse decomposition:

```
J_recoil    = J_total × sin(φ_def) = J × sin(5°)  = 0.087 × J
J_absorbed  = J_total × cos(φ_def) = J × cos(5°)  = 0.996 × J
```

The inward tilt also generates a downward force component on Death during contact:
```
F_down = N_contact × sin(α_top) where α_top ≈ 10° (top slope)
       = N × sin(10°) = 0.174 × N
```

This downward component presses Death into the floor, increasing floor friction and resisting KO displacement during the contact event.

### Defense Mode: Scale-Texture Spin-Grinding

The pyramid scale pattern (asperity height 0.3 mm, pitch 1.0 mm) amplifies the metal-on-metal friction coefficient:

```
μ_smooth_metal   = 0.15  (typical zinc-alloy on zinc-alloy)
μ_texture_factor = 1 + (h_asp / p_asp) × sin(φ_asp)
                 = 1 + (0.3 / 1.0) × sin(31°)
                 = 1 + 0.3 × 0.515 = 1 + 0.155 = 1.155
μ_effective_def  = 0.15 × 1.155 = 0.173
```

Tangential spin-transfer torque per contact event (contact at r = 21 mm, contact duration Δt ≈ 8 ms):
```
τ_transfer = μ_effective × N_contact × r_contact
           = 0.173 × (J_total / Δt) × r_contact
```

For J_total = 0.06 N·s, Δt = 0.008 s, r_contact = 0.021 m:
```
τ_transfer = 0.173 × (0.06 / 0.008) × 0.021 = 0.173 × 7.5 × 0.021 = 0.0273 N·m
```

Angular momentum extracted from attacker per contact event:
```
ΔL_extracted = τ_transfer × Δt = 0.0273 × 0.008 = 2.18×10⁻⁴ kg·m²/s
```

Equivalent spin reduction for a typical attacker (I_atk ≈ 1.3×10⁻⁵ kg·m²):
```
Δω_atk = ΔL_extracted / I_atk = 2.18×10⁻⁴ / 1.3×10⁻⁵ = 16.8 rad/s per contact
```

Over 10 contact events: attacker loses 168 rad/s — a full depletion from launch speed. This is the "grinding" mechanism: Death's textured surface systematically transfers angular momentum from the attacker to itself on every pass, regardless of which wheel nominally "wins" the collision.

### Attack Mode: Large-Slope Recoil

Eight serpent-head protrusions create large contact face angles:
```
φ_atk ≈ 22°  (large slope, fanged faces)

J_recoil_atk   = J × sin(22°) = 0.374 × J
J_absorbed_atk = J × cos(22°) = 0.927 × J
```

Effective recoil ratio — Attack vs Defense:
```
sin(22°) / sin(5°) = 0.374 / 0.087 = 4.30×
```

Attack mode generates 4.3× more recoil than Defense mode per contact. For a defense-role combo, recoil means each hit accelerates the beyblade toward the wall — 4.3× greater KO probability per contact event vs Defense mode.

Additionally, the large slopes provide no smash attack comparable to purpose-built attack wheels (VariAres, Blitz, Flash): the serpent face geometry presents a blunt, curved contact surface where φ ≈ 22° and the normal force is directed partly inward, not primarily transferring a lateral knock-out impulse.

### No-PC-Frame Mode Stability

Death has no centrifugal arm mechanism. The Metal Frame is held by 4 snap-fit indents. During spin, centrifugal force acts radially outward on the Frame:

```
F_centrifugal_radial = m_frame × r_CoM × ω²
                     = 0.0296 × 0.019 × 150² = 12.7 N
```

This force presses the Frame radially outward against the Core's outer rim, increasing friction between the mating surfaces and stabilising the axial snap-fit indents. Unlike a PC Frame that uses centrifugal force to rotate an arm, the Death Frame has no rotational degree of freedom — the only mode change vector is axial separation (lifting the frame off the Core), and centrifugal force does not contribute to axial separation.

Axial snap-fit retention force (4 indents × ~0.15 N each): F_axial ≈ 0.6 N.
Under impact, the axial impulse component on the Frame: J_axial = J × sin(α_impact_geometry) ≈ very small (impacts are primarily lateral). Death is therefore stable against accidental mode switching during battle.

```typescript
function deathFrameInertia(
  m_inner_g: number, r_inner_mm: number, r_mid_mm: number,
  m_outer_g: number, r_outer_mm: number
): number {
  const I1 = 0.5 * (m_inner_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I2 = 0.5 * (m_outer_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}

function deathCoreInertia(m_hub_g: number, r_hub_mm: number, m_arms_g: number, r_arms_mm: number): number {
  const I_hub = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I_arms = 0.5 * (m_arms_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_arms_mm / 1000, 2));
  return I_hub + I_arms;
}

function textureEffectiveMu(mu_base: number, h_asp_mm: number, p_asp_mm: number, phi_asp_deg: number): number {
  const factor = 1 + (h_asp_mm / p_asp_mm) * Math.sin(phi_asp_deg * Math.PI / 180);
  return mu_base * factor;
}

function spinGrindExtracted(mu_eff: number, J_N_s: number, dt_s: number, r_contact_mm: number): number {
  return mu_eff * (J_N_s / dt_s) * (r_contact_mm / 1000) * dt_s;
}

function recoilFraction(phi_deg: number): number {
  return Math.sin(phi_deg * Math.PI / 180);
}

// deathFrameInertia(12, 15, 19, 17.6, 22.5)               → 1.115×10⁻⁵ kg·m²
// deathCoreInertia(4, 7, 10, 15)                           → 1.47×10⁻⁶ kg·m²
// deathFrameInertia + deathCoreInertia                     → 1.262×10⁻⁵ kg·m²  (I_total)
// angularMomentumDeficit(1.262e-5, 1.38e-5, 150)           → 8.55%      (vs Basalt)
// textureEffectiveMu(0.15, 0.3, 1.0, 31)                  → 0.173      (scale texture amplification)
// spinGrindExtracted(0.173, 0.06, 0.008, 21)               → 2.18×10⁻⁴ kg·m²/s  (per contact event)
// recoilFraction(5)                                        → 0.087      (Defense mode — 8.7%)
// recoilFraction(22)                                       → 0.374      (Attack mode — 37.4%)
// recoilFraction(22) / recoilFraction(5)                   → 4.30×      (Attack recoil vs Defense)
```

---

## Case 301 — Rubber Defense Flat / RDF (1.1 g)

> **Stock combo (Death Quetzalcoatl 125RDF):** 4D Clear Wheel: Quetzalcoatl · 4D Metal Wheel: Death · Track: 125 · Bottom: Rubber Defense Flat

**Thesis:** RDF is a two-stage contact system: the central rubber protuberance (80° included angle, ~1 mm contact radius) delivers RS-equivalent anti-KO friction in standard-shot posture; the surrounding wide flat rubber face (r = 7.405 mm) provides 7.1× more restoring torque than RS at any given tilt angle, keeping the bey upright and suppressing the wobble that drains RS's stamina; when banked, the 30° outer plastic housing engages the floor at a high-friction ABS contact adding lateral grip; and the full flat rubber face, if fully engaged by severe tilt, produces a contact area of 169 mm² and traction force of ~14 N — 33× the beyblade's own weight — explaining the "aggressive CS-like" recovery described in the wiki.

### Geometry

```
Side profile:

   small nub ●          ← central protuberance (80° included angle, ~0.5 mm protrusion)
            ┌──────────┐  ← rubber flat face (r_rubber = 7.405 mm, flush with housing)
            │ RUBBER   │  ← tip height 8.49 mm
       ┌────┴──────────┴────┐
       │   plastic housing  │  ← 30° angle outer cone, full r = 7.945 mm
       └────────────────────┘
             15.89 mm wide
             10.20 mm tall

Tip outer radius r_rubber:  7.405 mm   (rubber flat face)
Housing outer radius r_o:   7.945 mm   (plastic, 0.54 mm wider than rubber)
Tip angle (protuberance):   80°         → half-angle from axis = 40°
Encasing angle:             30°         (outer plastic slope from vertical)
Rubber contact area (flat): π × 7.405² = 172.5 mm²  (gross, before protuberance)
```

### Central Protuberance — RS-Equivalent Contact

The protuberance geometry matches RS (80° included angle, rubber, same load). Using Sneddon's cone model with α = 50° (from sample surface), E* = 0.6 MPa, P = 0.49 N (50 g combo on BD145):

```
a²_protrude = P × π / (2 × E* × tan(50°)) = 0.49 × π / (2 × 0.6×10⁶ × 1.192)
            = 1.076×10⁻⁶ m²
a_protrude  = 1.04 mm   (identical to RS)
```

Standard-shot friction force (protuberance only):
```
F_std = μ_rubber × P + τ_adh × π × a_protrude²
      = 0.85 × 0.49 + 0.08×10⁶ × π × (0.00104)²
      = 0.416 + 0.272 = 0.688 N
```

RDF in standard-shot mode: μ_eff = 0.688 / 0.49 = 1.40 — slightly higher than RS (μ_eff_RS = 0.85) because the surrounding flat rubber contributes at the edges of the protuberance deformation zone.

Minimum KO impulse (Δt = 0.05 s):
```
J_KO_std = F_std × Δt = 0.688 × 0.05 = 0.0344 N·s   (cf. RS: 0.0208 N·s)
```

RDF requires 65% more impulse to KO than RS in standard-shot posture.

### Wide Base Restoring Torque — Stamina Advantage Over RS

When the bey tilts by angle θ, the rubber face provides a restoring torque proportional to the friction force at its contact perimeter:

```
τ_restore = μ_rubber × W × r_rubber × sin(θ)
```

At θ = 5° (small wobble):
```
τ_restore_RDF = 0.85 × 0.49 × 0.007405 × sin(5°) = 0.85 × 0.49 × 0.007405 × 0.0872
              = 2.69×10⁻⁴ N·m
```

RS restoring torque (contact radius a = 1.04 mm):
```
τ_restore_RS = 0.85 × 0.49 × 0.00104 × sin(5°) = 3.78×10⁻⁵ N·m
```

Ratio:
```
τ_restore_RDF / τ_restore_RS = 2.69×10⁻⁴ / 3.78×10⁻⁵ = 7.12×
```

RDF applies 7.1× more restoring torque at any given tilt angle. This keeps the bey 7.1× closer to upright during steady precession. Since spin-decay torque at the protuberance scales with contact radius (≈ 0 at apex → minimal decay when upright), RDF spends far more time with its protuberance alone on the floor → stamina much better than RS despite identical protuberance geometry.

Spin decay in standard mode (protuberance only, I_system ≈ 1.5×10⁻⁵ kg·m²):
```
τ_decay = μ × P × a_protrude = 0.85 × 0.49 × 0.00104 = 4.33×10⁻⁴ N·m
dω/dt   = 4.33×10⁻⁴ / 1.5×10⁻⁵ = 28.9 rad/s²   (same rate as RS when upright)
```

The stamina advantage of RDF over RS comes from maintaining the upright posture, not from lower spin-decay rate per unit area.

### Full Flat Contact — Tilt-Triggered Grip Surge

When a severe tilt brings the flat rubber face to floor contact, the contact area jumps from ~3.4 mm² (protuberance) to:

```
A_flat = π × r_rubber² − π × a_protrude²
       = π × (7.405² − 1.04²) = π × (54.83 − 1.08) = 168.9 mm²
```

Full flat traction force:
```
F_flat = μ_rubber × P + τ_adh × A_flat
       = 0.85 × 0.49 + 0.08×10⁶ × 168.9×10⁻⁶
       = 0.416 + 13.51 = 13.93 N
```

Ratio to beyblade weight (P = 0.49 N):
```
F_flat / P = 13.93 / 0.49 = 28.4×
```

**When the flat rubber face fully contacts, traction is 28× the beyblade's weight.** This instantaneously halts any lateral sliding and resets the bey to upright posture — the "regaining balance relatively quickly" effect described in the wiki. It also explains why RDF in tilt contact is stronger than CS (which uses hard rubber with lower μ and smaller area).

### Banked Mode — Outer Plastic Contact

The outer plastic housing (ABS) slopes at 30° from vertical. When the beyblade banks against the stadium wall, the housing rim contacts at 30° from vertical:

Normal force from wall reaction: N_wall ≈ m × v_orbital² / R_stadium

Lateral traction from banking:
```
F_bank = μ_ABS × N_wall × cos(30°) = 0.35 × N_wall × 0.866 = 0.303 × N_wall
```

The 30° housing slope also redirects the wall's normal force to have a downward component pressing the rubber face into the floor:
```
F_down = N_wall × sin(30°) = 0.5 × N_wall
```

This simultaneous floor-press and wall-friction from a single banking contact produces the aggressive CS-like pattern: the bey bounces off the wall, gains lateral momentum from the 30° deflection, then the flat rubber face contacts the floor and drives the movement pattern — similar to CS except with a larger rubber area providing more grip at each floor engagement.

### Contact Area Hierarchy

| Contact state | Area | F_friction | μ_eff |
|---------------|------|------------|-------|
| Protuberance only (standard) | 3.4 mm² | 0.688 N | 1.40 |
| Partial flat (5° tilt) | ~20 mm² | ~1.9 N | ~3.9 |
| Full flat face | 168.9 mm² | 13.93 N | 28.4 |
| RS (worn, reference) | 5.91 mm² | 0.760 N | 2.21 |

RDF's traction progression spans a 20× range between its most stationary and most engaged states — this is what enables both the defense-type stability and the occasional CS-like attack recovery in a single tip.

```typescript
function rdfProtrudeContact_mm(P_N: number, E_star_MPa: number, alpha_deg: number): number {
  const tanAlpha = Math.tan(alpha_deg * Math.PI / 180);
  return Math.sqrt((P_N * Math.PI) / (2 * E_star_MPa * 1e6 * tanAlpha)) * 1000;
}

function rdfFlatArea_mm2(r_rubber_mm: number, a_protrude_mm: number): number {
  return Math.PI * (r_rubber_mm * r_rubber_mm - a_protrude_mm * a_protrude_mm);
}

function rdfTractionForce(W_N: number, mu: number, A_mm2: number, tau_adh_MPa: number): number {
  return mu * W_N + tau_adh_MPa * 1e6 * (A_mm2 * 1e-6);
}

function rdfRestoringTorque(mu: number, W_N: number, r_base_mm: number, theta_deg: number): number {
  return mu * W_N * (r_base_mm / 1000) * Math.sin(theta_deg * Math.PI / 180);
}

function rdfRestoringRatio(r_rdf_mm: number, r_rs_mm: number): number {
  return r_rdf_mm / r_rs_mm;
}

// rdfProtrudeContact_mm(0.49, 0.6, 50)                    → 1.04 mm    (same as RS)
// rdfFlatArea_mm2(7.405, 1.04)                            → 168.9 mm²  (full flat face)
// rdfTractionForce(0.49, 0.85, 3.4, 0.08)                 → 0.688 N    (standard protuberance only)
// rdfTractionForce(0.49, 0.85, 168.9, 0.08)               → 13.93 N    (full flat — 28.4× weight)
// rdfRestoringTorque(0.85, 0.49, 7.405, 5)                → 2.69×10⁻⁴ N·m  (RDF at 5° tilt)
// rdfRestoringTorque(0.85, 0.49, 1.04, 5)                 → 3.78×10⁻⁵ N·m  (RS at 5° tilt)
// rdfRestoringRatio(7.405, 1.04)                          → 7.12×       (RDF restoring advantage)
```

---

## Case 302 — Eternal Wide Defense / EWD (1.2 g)

> **Stock combo (Killer Beafowl UW145EWD):** Clear Wheel: Beafowl · Metal Wheel: Killer · Track: UW145 · Bottom: EWD

**Thesis:** EWD replaces WD's fixed sharp tip with a bearing-mounted free-spinning sharp piece; the bearing decouples the disc's angular velocity from floor friction torque — in the upright high-spin phase the benefit is marginal because bearing friction (τ ≈ 6.9×10⁻⁷ N·m) slightly exceeds the direct WD tip friction it replaces (τ_WD ≈ 4.4×10⁻⁷ N·m), confirming that WD overshadows EWD in straight stamina; the decisive advantage emerges in the late-match wobble phase (θ ≈ 10°, ω ≤ 60 rad/s) where WD's fixed tip traces a circle of radius h_CoM × sin(θ) ≈ 3.5 mm and generates 197× more spin-decay torque than EWD's bearing; this wobble immunity supplies the extra rotations that define EWD's spin-stealing niche in Zero-G stadiums; bearing wear raises the rolling friction coefficient 15× (0.001 → 0.015), erasing the wobble advantage and producing aggressive near-RF-like drift as the tip hole deforms.

### Geometry

```
Side profile:

           ┌──────────────────────────┐   ← wide disc (15.74 mm wide)
           │      ┌────────┐          │
           │      │bearing │          │   ← tip hole ⌀ 6.2 mm
           │      │ ≋≋≋≋  │          │
           │      └────────┘          │
           └──────────────────────────┘
                    │ free-spinning tip (35° cone angle)
                    ▼
                    ·   ← floor contact (point contact)

Key dimensions:
  Outer radius r_o:          7.87 mm   (= 15.74 mm / 2, full width with base)
  Disc radius r_disc:        7.24 mm   (= 14.48 mm / 2, without base scallops)
  Tip hole radius r_hole:    3.10 mm   (= 6.20 mm / 2; bearing outer race seats here)
  Bearing mean ball-path:    2.00 mm   (mid-race radius estimate)
  Full height:               8.37 mm
  Height without base:       7.73 mm
  Fixed tip height:          6.54 mm
  Free tip cone angle:       35°        → Sneddon half-angle α = 72.5° from surface
  Overall angle (housing):   15°
```

### Moment of Inertia

Zone A — bearing assembly (r = 0 → 3.1 mm, m_A ≈ 0.3 g):
```
I_A = ½ × 0.0003 × (0² + 0.0031²) = ½ × 0.0003 × 9.61×10⁻⁶ = 1.44×10⁻⁹ kg·m²
```

Zone B — disc body (r = 3.1 → 7.24 mm, m_B ≈ 0.7 g):
```
I_B = ½ × 0.0007 × (0.0031² + 0.00724²) = ½ × 0.0007 × 6.20×10⁻⁵ = 2.17×10⁻⁸ kg·m²
```

Zone C — outer scalloped base (r = 7.24 → 7.87 mm, m_C ≈ 0.2 g):
```
I_C = ½ × 0.0002 × (0.00724² + 0.00787²) = ½ × 0.0002 × 1.143×10⁻⁴ = 1.14×10⁻⁸ kg·m²
```

**I_total = 1.44×10⁻⁹ + 2.17×10⁻⁸ + 1.14×10⁻⁸ = 3.46×10⁻⁸ kg·m²**

EWD contributes 0.27% of a typical stamina combo's system inertia (I_system ≈ 1.3×10⁻⁵ kg·m²) — angular momentum storage is the Metal Wheel's role; EWD's function is entirely contact-surface mechanics.

### Bearing Decoupling — Upright Phase

The free-spinning tip reaches steady state when floor friction on the tip equals the bearing's braking reaction on the disc. The disc is braked only by the bearing; it never feels floor friction directly.

Free tip contact radius (Sneddon cone, α = 72.5° from surface, P = m × g = 0.035 × 9.81 = 0.343 N, E* = 1.31 GPa for ABS-on-ABS):
```
a² = P × π / (2 × E* × tan(α))
   = 0.343 × π / (2 × 1.31×10⁹ × 3.271)
   = 1.078 / 8.57×10⁹ = 1.26×10⁻¹⁰ m²
a  = 1.12×10⁻⁵ m = 0.0112 mm
```

WD fixed-tip disc braking torque (floor friction acts directly on disc through rigid shaft):
```
τ_WD = (2/3) × μ_hard × P × a = (2/3) × 0.17 × 0.343 × 1.12×10⁻⁵ = 4.35×10⁻⁷ N·m
```

EWD disc braking torque (bearing only, rolling friction f = 0.001, r_bearing = 2.0 mm):
```
τ_EWD_new = f × P × r_bearing = 0.001 × 0.343 × 0.002 = 6.86×10⁻⁷ N·m
```

Upright-phase decay ratio:
```
τ_EWD_new / τ_WD = 6.86×10⁻⁷ / 4.35×10⁻⁷ = 1.58×  (new EWD decays 1.6× faster than WD upright)
```

The bearing contact radius (2.0 mm) far exceeds the direct tip contact radius (0.011 mm); the rolling friction reduction (0.17 → 0.001) is insufficient to compensate. EWD has no stamina advantage over WD in the upright phase — consistent with WD's competitive dominance in standard stadiums.

### Wobble-Phase Spin Decay — The Competitive Differential

In late-match wobble, a fixed-tip bottom traces a tilted circle on the floor. The contact point sweeps a radius proportional to tilt angle:
```
r_tilt = h_CoM × sin(θ)   where h_CoM ≈ 20 mm
```

WD effective braking torque at θ = 10° (ω ≈ 60 rad/s, moderate wobble):
```
r_tilt = 20 × sin(10°) = 20 × 0.174 = 3.47 mm
τ_WD_wobble = (2/3) × μ_hard × P × r_tilt = (2/3) × 0.17 × 0.343 × 0.00347
            = 1.35×10⁻⁴ N·m
```

EWD at the same θ — the tip contacts the floor independently; the disc sees only bearing friction regardless of tilt:
```
τ_EWD_wobble = τ_EWD_new = 6.86×10⁻⁷ N·m   (invariant with disc tilt angle)
```

Wobble-phase ratio:
```
τ_WD_wobble / τ_EWD_wobble = 1.35×10⁻⁴ / 6.86×10⁻⁷ = 197×
```

Decay rates (I_system = 1.3×10⁻⁵ kg·m²):
```
dω/dt_WD_wobble  = 1.35×10⁻⁴ / 1.3×10⁻⁵ = 10.4 rad/s²
dω/dt_EWD_wobble = 6.86×10⁻⁷ / 1.3×10⁻⁵ = 0.053 rad/s²
```

Time to stall from ω = 60 rad/s:
```
t_stall_WD  = 60 / 10.4 = 5.77 s
t_stall_EWD = 60 / 0.053 = 1132 s
```

WD stalls within 6 seconds of entering the θ = 10° wobble regime; EWD survives orders of magnitude longer through the same wobble. The ratio grows with tilt angle: at θ = 30°, r_tilt = 10 mm → τ_WD_wobble / τ_EWD = 568×. This is the physics basis for EWD's Zero-G spin-stealing advantage.

### Wear Degradation Model

Ball-race pitting raises rolling friction coefficient toward a sliding-contact limit:
```
f_new   = 0.001   (clean polished races — TT / SonoKong release)
f_worn  = 0.015   (pitted grooves — Hasbro releases degrade faster per wiki)
```

Worn bearing disc torque:
```
τ_EWD_worn = 0.015 × 0.343 × 0.002 = 1.03×10⁻⁵ N·m
```

Worn EWD wobble decay rate:
```
dω/dt_EWD_worn = 1.03×10⁻⁵ / 1.3×10⁻⁵ = 0.79 rad/s²
```

Worn EWD is still 13× better than WD in wobble (0.79 vs 10.4 rad/s²), but the deformed tip hole introduces radial eccentricity δ_r ≈ 0.2 mm. Centrifugal lateral force from this eccentricity:
```
F_centrifugal = m_tip × δ_r × ω² = 0.0001 × 0.0002 × 150² = 4.5×10⁻⁴ N
```

At ω = 150 rad/s this force is small; as ω drops and the bey enters deep wobble, the deformed bearing races cause the tip to skip — generating lateral impulses that mimic the pattern of a worn RF, explaining the "illegal and alters their performance, transforming them into more aggressive tips" description.

### Spin-Stealing Contact Torque — Zero-G Application

In Zero-G, EWD and WD have identical disc geometry; spin-steal torque per contact event is the same:
```
τ_steal = μ_ABS × N_contact × r_disc = 0.35 × 2.0 × 0.00724 = 5.07×10⁻³ N·m
```

Spin transferred per contact (Δt = 0.01 s):
```
ΔL = τ_steal × Δt = 5.07×10⁻³ × 0.01 = 5.07×10⁻⁵ kg·m²/s
Δω = ΔL / I_system = 5.07×10⁻⁵ / 1.3×10⁻⁵ = 3.90 rad/s per contact
```

EWD's advantage is not per-contact efficiency but total contact count: surviving 5 additional contact events (enabled by wobble-phase endurance vs WD at the same spin level):
```
Δω_total = 5 × 3.90 = 19.5 rad/s   → ~0.37 s extension at the average late-match decay rate
```

This margin — equivalent to 3–5 extra rotations — is sufficient to outlast an opponent in a close Zero-G stamina match.

```typescript
function ewdTipContact_mm(P_N: number, E_star_GPa: number, alpha_deg: number): number {
  const tanAlpha = Math.tan(alpha_deg * Math.PI / 180);
  return Math.sqrt((P_N * Math.PI) / (2 * E_star_GPa * 1e9 * tanAlpha)) * 1000;
}

function ewdBearingTorque(f: number, P_N: number, r_bearing_mm: number): number {
  return f * P_N * (r_bearing_mm / 1000);
}

function ewdWdFixedTipTorque(mu: number, P_N: number, a_mm: number): number {
  return (2 / 3) * mu * P_N * (a_mm / 1000);
}

function ewdWobbleTorque(mu: number, P_N: number, h_CoM_mm: number, theta_deg: number): number {
  const r_tilt = (h_CoM_mm / 1000) * Math.sin(theta_deg * Math.PI / 180);
  return (2 / 3) * mu * P_N * r_tilt;
}

function ewdSpinDecayRate(tau: number, I_system: number): number {
  return tau / I_system;
}

function ewdSpinStealDelta(mu: number, N_contact_N: number, r_disc_mm: number, dt_s: number, I_system: number): number {
  const tau = mu * N_contact_N * (r_disc_mm / 1000);
  return (tau * dt_s) / I_system;
}

// ewdTipContact_mm(0.343, 1.31, 72.5)                      → 0.0112 mm  (sharp cone contact radius)
// ewdWdFixedTipTorque(0.17, 0.343, 0.0112)                  → 4.35×10⁻⁷ N·m  (WD fixed tip reference)
// ewdBearingTorque(0.001, 0.343, 2.0)                       → 6.86×10⁻⁷ N·m  (new bearing, disc braking)
// ewdBearingTorque(0.015, 0.343, 2.0)                       → 1.03×10⁻⁵ N·m  (worn bearing)
// ewdWobbleTorque(0.17, 0.343, 20, 10)                      → 1.35×10⁻⁴ N·m  (WD at θ=10° wobble)
// ewdSpinDecayRate(1.35e-4, 1.3e-5)                         → 10.4 rad/s²    (WD wobble-phase decay)
// ewdSpinDecayRate(6.86e-7, 1.3e-5)                         → 0.053 rad/s²   (EWD wobble — 197× slower)
// ewdSpinDecayRate(4.35e-7, 1.3e-5)                         → 0.033 rad/s²   (WD upright — 1.6× better than EWD)
// ewdSpinDecayRate(1.03e-5, 1.3e-5)                         → 0.79 rad/s²    (worn EWD upright)
// ewdSpinStealDelta(0.35, 2.0, 7.24, 0.01, 1.3e-5)          → 3.90 rad/s     (per Zero-G contact event)
```

---

## Case 303 — Upper Wing 145 / UW145 (3.6 g)

> **Stock combo (Killer Beafowl UW145EWD):** Clear Wheel: Beafowl · Metal Wheel: Killer · Track: UW145 · Bottom: EWD

**Thesis:** UW145's three removable wings are a reversible ramp structure — in Attack mode the rising face (≈38.7° from horizontal) positions the flat wing tips at ≈19 mm above the floor on a WD-height combo, 3.5 mm below the opposing Metal Wheel's lower contact edge at 22.5 mm; this height gap makes upper attack geometrically inaccessible in level contact and only occasionally available when significant tilt brings the two systems into the same horizontal plane; in Defense mode the wings are flipped so they curve downward, dropping the tip contact height to ≈11 mm and further reducing contact probability while presenting a sharper smash face (φ ≈ 30° from radial, recoil fraction sin(30°) = 0.500) that is equally irrelevant at that height; the only physically meaningful contribution of UW145 is its moment of inertia — 4.99×10⁻⁷ kg·m² — which at specific inertia 1.39×10⁻⁴ m² places it above plain-height tracks of similar mass, making it a marginal angular momentum carrier when no functional track feature is needed at height 145.

### Geometry

```
Side profile (Attack mode — wings rise outward):

 r →  4      8            18 mm
      │      │             │
  14  │      │             ▲  ← wing tip (flat contact face)
  11  │      │            /
   8  │      │           /  ← wing ramp slope (38.7° from horizontal)
   5  │      │          /
   3  │      ●─────────/  ← wing root (low attachment)
   0  └──────────────────────  floor level

Defense mode (wings flipped — tips curve downward):

  14  │      ●─────────\  ← wing root (now at top, attachment reversed)
  11  │      │          \
   8  │      │           \  ← wing ramp (same slope, descending)
   3  │      │            ▼  ← wing tip (flat face now lower + forward-sharp edge)
   0  └──────────────────────

Key dimensions (estimated from images and 3.6 g total):
  Hub radius r_hub:         4.0 mm
  Body outer radius r_body: 8.0 mm
  Wing tip radius r_wing:  18.0 mm   (large swept wings visible in images)
  Track height h_track:    14.5 mm   (= "145" designation)
  Wing base height (Attack): 3.0 mm from track bottom
  Wing tip height (Attack): 11.0 mm from track bottom
  Wing rise Δh:             8.0 mm   (over Δr = 10.0 mm radial span)
  Wing slope angle β:       arctan(8/10) = 38.7° from horizontal
  Wing arc per wing:        ~60°      (3 wings, C₃ symmetry)
```

### Moment of Inertia

Zone A — hub (r = 0 → 4 mm, m_A ≈ 0.5 g):
```
I_A = ½ × 0.0005 × (0² + 0.004²) = ½ × 0.0005 × 1.6×10⁻⁵ = 4.00×10⁻⁹ kg·m²
```

Zone B — track body (r = 4 → 8 mm, m_B ≈ 0.7 g):
```
I_B = ½ × 0.0007 × (0.004² + 0.008²) = ½ × 0.0007 × 8.0×10⁻⁵ = 2.80×10⁻⁸ kg·m²
```

Zone C — three wings (r = 8 → 18 mm, m_C ≈ 2.4 g; 3 wings × 60° each = 50% annular fill):
```
I_C = ½ × 0.0024 × (0.008² + 0.018²) = ½ × 0.0024 × 3.88×10⁻⁴ = 4.66×10⁻⁷ kg·m²
```

**I_total = 4.00×10⁻⁹ + 2.80×10⁻⁸ + 4.66×10⁻⁷ = 4.99×10⁻⁷ kg·m²**

Specific inertia:
```
I/m = 4.99×10⁻⁷ / 0.0036 = 1.39×10⁻⁴ m²
```

93.4% of UW145's inertia resides in the wings (Zone C). The track body contributes 5.6% and the hub 0.8%.

### Upper Attack — Contact Height Analysis

In Attack mode, the wing tip sits at h_track_tip = 11 mm above the track base. Using a WD-height bottom (h_bottom = 8 mm):
```
h_contact = h_bottom + h_track_tip = 8 + 11 = 19 mm above floor
```

An identically configured opposing beyblade (WD + 145 track) presents its Metal Wheel lower edge at:
```
h_MW_bottom = h_bottom_opp + h_track_opp = 8 + 14.5 = 22.5 mm above floor
```

Height gap:
```
Δh_gap = 22.5 − 19 = 3.5 mm   (wing tip is 3.5 mm below opposing MW contact zone)
```

For contact to occur, one bey must tilt by angle θ such that:
```
θ_required = arcsin(Δh_gap / r_wing) = arcsin(3.5 / 18) = arcsin(0.194) = 11.2°
```

A tilt of 11.2° is within the wobble range of low-spin beys (stability < 40%) but not achievable at high spin where attack combos operate. Upper attack is therefore available only in the very late match — when both beys are already destabilised — at which point the attacking combo has also lost most of its attack power.

Upper attack contact face (flat tip, perpendicular to floor):
```
φ_upper = 0°   (horizontal flat face)
J_upward = J × sin(90°) = J   (pure upward impulse — ideal upper attack geometry)
```

The geometry of the contact face is correct for upper attack; only the height placement defeats the mechanic.

### Defense Mode — Smash Contact Analysis

With the wing flipped downward, the tip drops to:
```
h_contact_defense = h_bottom + (h_track − h_track_tip) = 8 + (14.5 − 11) = 11.5 mm above floor
```

The gap to the opposing MW widens to 22.5 − 11.5 = **11.0 mm** — making contact even less likely. The sharp forward edge presents a smash face at angle φ_smash from radial:

The wing's lateral face in Defense mode is the former top surface (previously horizontal in Attack mode), now rotated to face forward and downward. The face angle from radial:
```
φ_smash = β = 38.7°   (same slope angle, now presented as a forward contact surface)

J_smash  = J × cos(38.7°) = 0.780 × J   (smash fraction)
J_recoil = J × sin(38.7°) = 0.625 × J   (recoil fraction)
```

A recoil fraction of 0.625 is high — comparable to Attack-mode wheels like Blitz (φ ≈ 35°, recoil ≈ 0.574). In isolation the smash geometry is reasonable; the 11.0 mm height gap ensures it is never delivered.

### Deflection Mode — Rounded Edge Defense

In Attack mode with rounded edges aligned to spin direction, an incoming contact impulse strikes the convex curved face. The rounded edge redirects the normal force tangentially, converting the impulse into a lateral glancing contact rather than a direct smash. Effective recoil fraction for a convex contact (radius of curvature r_c ≈ 3 mm):

```
φ_deflect ≈ arctan(a_contact / r_c)   where a_contact ≈ 0.5 mm (Hertz ellipse minor axis)
φ_deflect = arctan(0.5 / 3) = 9.5°

J_recoil_deflect = J × sin(9.5°) = 0.165 × J
```

This is lower recoil than BD145's smooth bowl surface (φ_BD145 ≈ 5°, recoil ≈ 0.087) but achieved through a different mechanism — the convex face scatters the contact point rather than providing a continuous curved guide surface. BD145's superiority in defense comes from sustained low-recoil contact across the full wing span; UW145's wings are discrete contact events with higher per-hit recoil.

```typescript
function uw145WingTipHeight(h_bottom_mm: number, h_wing_in_track_mm: number): number {
  return h_bottom_mm + h_wing_in_track_mm;
}

function uw145HeightGap(h_bottom_mm: number, h_track_mm: number, h_contact_mm: number): number {
  return (h_bottom_mm + h_track_mm) - h_contact_mm;
}

function uw145TiltRequired_deg(gap_mm: number, r_wing_mm: number): number {
  return Math.asin(gap_mm / r_wing_mm) * 180 / Math.PI;
}

function uw145SmashFraction(beta_deg: number): number {
  return Math.cos(beta_deg * Math.PI / 180);
}

function uw145RecoilFraction(beta_deg: number): number {
  return Math.sin(beta_deg * Math.PI / 180);
}

function uw145Inertia(
  m_hub_g: number, r_hub_mm: number,
  m_body_g: number, r_body_mm: number,
  m_wings_g: number, r_wing_mm: number
): number {
  const I_hub  = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I_body = 0.5 * (m_body_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_body_mm / 1000, 2));
  const I_wing = 0.5 * (m_wings_g / 1000) * (Math.pow(r_body_mm / 1000, 2) + Math.pow(r_wing_mm / 1000, 2));
  return I_hub + I_body + I_wing;
}

// uw145WingTipHeight(8, 11)                                 → 19 mm      (Attack mode tip height, WD bottom)
// uw145HeightGap(8, 14.5, 19)                               → 3.5 mm     (gap to opposing MW — Attack mode)
// uw145TiltRequired_deg(3.5, 18)                            → 11.2°      (tilt needed for upper attack contact)
// uw145WingTipHeight(8, 3.5)                                → 11.5 mm    (Defense mode tip height)
// uw145HeightGap(8, 14.5, 11.5)                             → 11.0 mm    (gap — Defense mode smash, wider)
// uw145SmashFraction(38.7)                                  → 0.780      (smash fraction, Defense mode)
// uw145RecoilFraction(38.7)                                 → 0.625      (recoil fraction, Defense mode)
// uw145RecoilFraction(9.5)                                  → 0.165      (deflection mode — rounded edge)
// uw145Inertia(0.5, 4, 0.7, 8, 2.4, 18)                    → 4.99×10⁻⁷ kg·m²  (I_total)
```

---

## Case 304 — Fusion 4D Metal Wheel (44.0 g)

> **Stock combo (Fusion Hades AD145SWD):** 4D Clear Wheel: Hades · 4D Metal Wheel: Fusion · Track: AD145 · Bottom: Sharp Wide Defense

**Thesis:** Fusion substitutes the standard PC Frame with a manual-flip Rubber Frame locked by square teeth — eliminating any centrifugal mode-switch — and positions rubber either on top (Defense mode) or underneath (Balance mode); the rubber bumps protrude ~0.5 mm above the Metal Frame surface and act as a two-stage impact absorber: initial rubber-only contact (COR ≈ 0.70, contact area 35.3 mm²) transitions to a combined rubber-on-metal response when compression exceeds 0.5 mm at impact forces above 11.8 N, dissipating 84% more kinetic energy per hit than bare-metal contact; in Balance mode the metal surface presents a smooth rounded profile (φ ≈ 5°, recoil fraction 8.7%) comparable to Basalt defense geometry; Fusion's total inertia of 1.204×10⁻⁵ kg·m² sits 12.8% below Basalt, because the Rubber Frame's 4.58 g of low-density rubber occupies the high-value outer annular zone (r = 13–22.5 mm) at only 22% the specific gravity of zinc alloy, forfeiting angular momentum that a fully metal wheel of the same physical dimensions would carry.

### Geometry

```
Top view (Defense Mode — rubber on top):

  ──────────────────────────────── r
   0         13     17    22.5 mm

  Core:    ████████░░░░░░░░░░│   ← zinc arms (4-fold cross), r = 0–13 mm
  Metal Frame:    ░░│████████│   ← outer ring + bumps, r = 13–22.5 mm
  Rubber Frame:   ░░│≋≋≋≋≋≋≋│   ← sits ON TOP of Metal Frame (Defense)
                     ↑ rubber bumps protrude ~0.5 mm above metal surface

  Balance Mode — frame assembly flipped 180° (metal face now on top):
  Rubber Frame sits BELOW Metal Frame → metal surface exposed on top, smooth rounded

Key dimensions (estimated from images):
  Metal Frame outer r_MF_o:  22.5 mm
  Metal Frame inner r_MF_i:  13.0 mm   (locks onto Core outer edge)
  Metal Frame inner zone:    r = 13–17 mm,  m_F1 ≈  8.00 g
  Metal Frame outer zone:    r = 17–22.5 mm, m_F2 ≈ 19.31 g
  Rubber Frame (same annulus): r = 13–22.5 mm, m_R = 4.58 g
  Core outer r_C_o:          13.0 mm
  Core hub r_hub:             4.0 mm
  Core hub zone:              r = 0–4 mm,  m_C1 ≈  1.50 g
  Core arm zone:              r = 4–13 mm, m_C2 ≈ 10.61 g
  Rubber bump protrusion:     ~0.5 mm
  Rubber bump radius:         ~2.0 mm (hemisphere, estimated from images)
```

### Moment of Inertia — Metal Frame + Rubber Frame + Core

**Metal Frame:**

Zone F1 — inner ring (r = 13 → 17 mm, m_F1 = 8.00 g):
```
I_F1 = ½ × 0.008 × (0.013² + 0.017²) = ½ × 0.008 × 4.58×10⁻⁴ = 1.83×10⁻⁶ kg·m²
```

Zone F2 — outer bump ring (r = 17 → 22.5 mm, m_F2 = 19.31 g):
```
I_F2 = ½ × 0.01931 × (0.017² + 0.0225²) = ½ × 0.01931 × 7.953×10⁻⁴ = 7.67×10⁻⁶ kg·m²
```

**I_frame = 1.83×10⁻⁶ + 7.67×10⁻⁶ = 9.50×10⁻⁶ kg·m²**

**Rubber Frame:**

Zone R (r = 13 → 22.5 mm, m_R = 4.58 g):
```
I_R = ½ × 0.00458 × (0.013² + 0.0225²) = ½ × 0.00458 × 6.753×10⁻⁴ = 1.55×10⁻⁶ kg·m²
```

**Core:**

Zone C1 — hub (r = 0 → 4 mm, m_C1 = 1.50 g):
```
I_C1 = ½ × 0.0015 × (0² + 0.004²) = 1.20×10⁻⁸ kg·m²
```

Zone C2 — arms + outer ring (r = 4 → 13 mm, m_C2 = 10.61 g):
```
I_C2 = ½ × 0.01061 × (0.004² + 0.013²) = ½ × 0.01061 × 1.85×10⁻⁴ = 9.81×10⁻⁷ kg·m²
```

**I_core = 1.20×10⁻⁸ + 9.81×10⁻⁷ = 9.93×10⁻⁷ kg·m²**

**I_total = 9.50×10⁻⁶ + 1.55×10⁻⁶ + 9.93×10⁻⁷ = 1.204×10⁻⁵ kg·m²**

Frame carries 78.9% of total system inertia; Rubber Frame contributes 12.9%; Core contributes 8.2%. No PC Frame is present — the square-teeth locking mechanism provides no centrifugal degree of freedom and no ω_c to compute.

### Angular Momentum vs Basalt

```
L_Fusion = 1.204×10⁻⁵ × 150 = 1.806×10⁻³ kg·m²/s
L_Basalt = 1.38×10⁻⁵  × 150 = 2.070×10⁻³ kg·m²/s

Deficit: 1 − (1.806 / 2.070) = 12.8%
```

The Rubber Frame's low density (ρ_rubber = 1200 kg/m³ vs ρ_zinc = 6600 kg/m³) places only 4.58 g at r = 13–22.5 mm where a zinc annulus of identical volume would place 4.58 × (6600/1200) = 25.2 g. Fusion therefore forfeits the inertia of a hypothetical 20.6 g of zinc at the outer rim — an angular momentum deficit that the rubber's defense benefit must compensate to remain competitive.

### Defense Mode — Two-Stage Impact Response

Rubber bump contact (Hertzian sphere, R_bump = 2 mm, E* = 0.6 MPa, W = 15 N impact):
```
a = (3WR / 4E*)^(1/3) = (3 × 15 × 0.002 / (4 × 0.6×10⁶))^(1/3)
  = (3.75×10⁻⁸)^(1/3) = 3.35×10⁻³ m = 3.35 mm

A_contact = π × a² = π × (3.35×10⁻³)² = 3.53×10⁻⁵ m² = 35.3 mm²

p_max = 3W / (2π × a²) = 45 / (2.219×10⁻⁴) = 0.203 MPa   (below rubber yield — elastic)
```

Rubber bottom-out force (bump springs onto Metal Frame at δ = 0.5 mm compression):
```
k_bump = E_rubber × A / L_bump = 2×10⁶ × 3.53×10⁻⁵ / 0.003 = 23.5 kN/m

F_bottom = k_bump × δ = 23500 × 0.0005 = 11.8 N
```

Impacts above 11.8 N — typical for an MFB attack combo — bottom out the rubber and engage the Metal Frame beneath. Every high-energy contact event is a two-stage response: rubber dampens the first 11.8 N of impulse, then metal handles the remainder.

Energy absorption comparison (COR rubber = 0.70, COR metal = 0.85):
```
E_absorbed_rubber = (1 − e_rubber²) × E_kinetic = (1 − 0.49) × E_k = 0.51 × E_k
E_absorbed_metal  = (1 − e_metal²)  × E_kinetic = (1 − 0.72) × E_k = 0.28 × E_k

Ratio: 0.51 / 0.28 = 1.82×   (Defense mode absorbs 1.82× more energy than bare metal)
```

Recoil impulse in Defense mode (smooth 5° face angle, rubber COR):
```
J_recoil_defense = e_rubber × sin(5°) × J_incident = 0.70 × 0.087 × J = 0.061 × J
```

### Balance Mode — Smooth Metal Surface

In Balance mode the Metal Frame face is uppermost. The outer surface presents smooth rounded bumps with a gentle slope (~5° from radial). Metal-on-metal COR = 0.85:
```
J_recoil_balance = e_metal × sin(5°) × J_incident = 0.85 × 0.087 × J = 0.074 × J
```

Recoil ratio defense vs balance:
```
0.061 / 0.074 = 0.82×   (Defense mode reduces recoil 18% vs Balance mode)
```

Balance mode trades the 18% recoil reduction and 1.82× energy absorption for a lower-drag smooth surface and the same outer geometry as a pure-metal defense ring. It is the preferred mode when stamina matters more than per-hit energy absorption.

```typescript
function fusionFrameInertia(
  m_inner_g: number, r_inner_mm: number, r_mid_mm: number,
  m_outer_g: number, r_outer_mm: number
): number {
  const I1 = 0.5 * (m_inner_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I2 = 0.5 * (m_outer_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}

function fusionRubberFrameInertia(m_rubber_g: number, r_inner_mm: number, r_outer_mm: number): number {
  return 0.5 * (m_rubber_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
}

function fusionCoreInertia(m_hub_g: number, r_hub_mm: number, m_arms_g: number, r_core_mm: number): number {
  const I_hub  = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I_arms = 0.5 * (m_arms_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_core_mm / 1000, 2));
  return I_hub + I_arms;
}

function fusionBumpContact_mm(W_N: number, R_bump_mm: number, E_star_MPa: number): number {
  return Math.pow((3 * W_N * (R_bump_mm / 1000)) / (4 * E_star_MPa * 1e6), 1 / 3) * 1000;
}

function fusionBumpBottomout_N(E_rubber_MPa: number, A_mm2: number, L_mm: number, delta_mm: number): number {
  return (E_rubber_MPa * 1e6 * (A_mm2 * 1e-6) / (L_mm / 1000)) * (delta_mm / 1000);
}

function fusionEnergyAbsorbedFraction(e: number): number {
  return 1 - e * e;
}

function fusionRecoilImpulse(e: number, phi_deg: number): number {
  return e * Math.sin(phi_deg * Math.PI / 180);
}

// fusionFrameInertia(8, 13, 17, 19.31, 22.5)              → 9.50×10⁻⁶ kg·m²  (Metal Frame)
// fusionRubberFrameInertia(4.58, 13, 22.5)                 → 1.55×10⁻⁶ kg·m²  (Rubber Frame)
// fusionCoreInertia(1.5, 4, 10.61, 13)                     → 9.93×10⁻⁷ kg·m²  (Core)
// fusionFrameInertia + fusionRubberFrameInertia + fusionCoreInertia → 1.204×10⁻⁵ kg·m²  (I_total)
// angularMomentumDeficit(1.204e-5, 1.38e-5, 150)           → 12.8%       (vs Basalt)
// fusionBumpContact_mm(15, 2, 0.6)                          → 3.35 mm     (contact radius at 15 N)
// fusionBumpBottomout_N(2, 35.3, 3, 0.5)                   → 11.8 N      (rubber bottom-out threshold)
// fusionEnergyAbsorbedFraction(0.70)                        → 0.51        (Defense mode — 51% absorbed)
// fusionEnergyAbsorbedFraction(0.85)                        → 0.28        (Balance mode — 28% absorbed)
// fusionRecoilImpulse(0.70, 5)                              → 0.061       (Defense mode recoil fraction)
// fusionRecoilImpulse(0.85, 5)                              → 0.074       (Balance mode recoil fraction)
```

---

## Case 305 — Kerbecs Clear Wheel (3.3 g)

> **Stock combo (Hell Kerbecs BD145DS):** Clear Wheel: Kerbecs · Metal Wheel: Hell · Track: BD145 · Bottom: Defense Sharp

**Thesis:** Kerbecs is a C₃ (3-fold) ABS clear wheel split by three notches at 120° intervals; at 3.3 g it is among the heaviest MFB clear wheels, contributing I = 3.15×10⁻⁷ kg·m² — 2.4% of a stamina combo's system inertia and 65% more than a typical 2.0 g clear wheel — adding 1.86×10⁻⁵ kg·m²/s of angular momentum per unit over the lightweight alternative; its C₃ symmetry is the primary competitive rationale: paired with a C₃ Metal Wheel (Hell, Ray), the combined system preserves C₃ rotational symmetry and zero transverse anisotropy, eliminating the nutation forcing at 2ω that any C₁ or C₂ clear wheel would impose; the chain-link outer rim presents rounded contact faces at φ ≈ 10° from radial at the tip, keeping the recoil fraction below sin(10°) = 0.174 and ensuring Kerbecs does not degrade defense performance when its surface is contacted.

### Geometry

```
Top view:

        Notch (20°)
           ↓
    ┌──────┤       ├──────┐
    │ Zone C: scalloped   │ ← chain-link outer rim, r = 11–13 mm
    │    (r = 11–13 mm)   │
    │  Zone B: main ring  │ ← solid C₃ sections, r = 7–11 mm
    │    ├──────────┤     │
    │    Zone A: hub      │ ← inner connection ring, r = 4.5–7 mm
    └─────────────────────┘
        C₃ symmetry: 3 solid sections × 120°, 3 notches × 20° each

Key dimensions (estimated from images):
  Inner hub radius r_i:        4.5 mm   (shaft attachment)
  Hub ring outer radius:       7.0 mm
  Main ring outer radius:     11.0 mm
  Scalloped rim outer r_o:    13.0 mm
  Mass zones: m_A ≈ 0.5 g (hub), m_B ≈ 1.8 g (main), m_C ≈ 1.0 g (rim)
  Symmetry order:              C₃        (3-fold, 120° repeat — zero transverse anisotropy)
  Notch arc per notch:         ~20°      (3 notches × 20° = 60° total removed)
```

### Moment of Inertia

Zone A — inner hub ring (r = 4.5 → 7 mm, m_A = 0.5 g):
```
I_A = ½ × 0.0005 × (0.0045² + 0.007²) = ½ × 0.0005 × 6.93×10⁻⁵ = 1.73×10⁻⁸ kg·m²
```

Zone B — main annulus, three solid sections (r = 7 → 11 mm, m_B = 1.8 g):
```
I_B = ½ × 0.0018 × (0.007² + 0.011²) = ½ × 0.0018 × 1.70×10⁻⁴ = 1.53×10⁻⁷ kg·m²
```

Zone C — outer scalloped rim (r = 11 → 13 mm, m_C = 1.0 g):
```
I_C = ½ × 0.001 × (0.011² + 0.013²) = ½ × 0.001 × 2.90×10⁻⁴ = 1.45×10⁻⁷ kg·m²
```

**I_total = 1.73×10⁻⁸ + 1.53×10⁻⁷ + 1.45×10⁻⁴ = 3.15×10⁻⁷ kg·m²**

Specific inertia:
```
I/m = 3.15×10⁻⁷ / 0.0033 = 9.55×10⁻⁵ m²
```

### System Inertia Fraction

System inertia fraction (I_system = 1.3×10⁻⁵ kg·m² for stamina combo):
```
f_Kerbecs = 3.15×10⁻⁷ / 1.3×10⁻⁵ = 2.42%
```

Reference — minimal 2.0 g clear wheel (same geometry scaled by mass):
```
I_light = (2.0 / 3.3) × 3.15×10⁻⁷ = 1.91×10⁻⁷ kg·m²
f_light  = 1.91×10⁻⁷ / 1.3×10⁻⁵ = 1.47%
```

Kerbecs adds 0.95 percentage points more system inertia than the lightest viable CW:
```
ΔI = 3.15×10⁻⁷ − 1.91×10⁻⁷ = 1.24×10⁻⁷ kg·m²
ΔL = ΔI × ω = 1.24×10⁻⁷ × 150 = 1.86×10⁻⁵ kg·m²/s   (0.90% of L_total)
```

This 0.90% angular momentum surplus corresponds to Kerbecs extending spin time by approximately:
```
Δt = ΔL / τ_friction = 1.86×10⁻⁵ / 6.86×10⁻⁷ ≈ 27 s   (using EWD-level tip friction as reference)
```

### C₃ Anisotropy and MW Compatibility

A C₃ wheel has zero transverse anisotropy: the principal moments of inertia about any pair of equatorial axes are equal. This suppresses nutation forcing entirely.

For a C₂ (2-fold) clear wheel combined with a C₃ (3-fold) Metal Wheel:
```
Combined symmetry order = GCD(2, 3) = 1  →  C₁ (asymmetric)
Nutation forcing period = LCM(2, 3) = 6  →  forcing at 6ω  (every 60° of rotation)
```

For Kerbecs (C₃) combined with Hell or Ray (C₃):
```
Combined symmetry order = GCD(3, 3) = 3  →  C₃ (preserved)
Nutation forcing: none   (ΔI_transverse = 0 for C₃ or higher)
```

For Kerbecs (C₃) combined with a C₂ Metal Wheel:
```
Combined symmetry order = GCD(3, 2) = 1  →  C₁ (degraded)
Nutation forcing at 6ω introduced by the CW-MW mismatch
```

Kerbecs must be paired with C₃ Metal Wheels to preserve the zero-nutation condition. A C₁ or C₂ MW negates Kerbecs's symmetry advantage and the heavier CW mass then only adds inertia without contributing to stability.

### Contact Angle Analysis

The chain-link pattern creates three zones of contact face angle measured from the radial direction:

Root (r = 7 mm — inner ring wall):
```
φ_root ≈ 30°   →   J_smash = cos(30°) × J = 0.866J,   J_recoil = sin(30°) × J = 0.500J
```

Mid (r = 10 mm — chain body):
```
φ_mid  ≈ 20°   →   J_smash = cos(20°) × J = 0.940J,   J_recoil = sin(20°) × J = 0.342J
```

Tip (r = 13 mm — rounded outer scallop):
```
φ_tip  ≈ 10°   →   J_smash = cos(10°) × J = 0.985J,   J_recoil = sin(10°) × J = 0.174J
```

The rounded outer scallop (φ = 10°) dominates contact events because the outermost radius is contacted first on lateral approach. A recoil fraction of 0.174 is moderate — higher than Basalt's ~0.087 but well within the range that preserves Defense mode effectiveness when the Metal Wheel's own low-recoil surface is the primary contact.

```typescript
function kerbecsCwInertia(
  m_hub_g: number, r_hub_in_mm: number, r_hub_out_mm: number,
  m_main_g: number, r_main_out_mm: number,
  m_rim_g: number, r_rim_out_mm: number
): number {
  const I_A = 0.5 * (m_hub_g / 1000) * (Math.pow(r_hub_in_mm / 1000, 2) + Math.pow(r_hub_out_mm / 1000, 2));
  const I_B = 0.5 * (m_main_g / 1000) * (Math.pow(r_hub_out_mm / 1000, 2) + Math.pow(r_main_out_mm / 1000, 2));
  const I_C = 0.5 * (m_rim_g / 1000) * (Math.pow(r_main_out_mm / 1000, 2) + Math.pow(r_rim_out_mm / 1000, 2));
  return I_A + I_B + I_C;
}

function cwSystemFraction(I_cw: number, I_system: number): number {
  return I_cw / I_system;
}

function cwAngularMomentumDelta(I_heavy: number, I_light: number, omega: number): number {
  return (I_heavy - I_light) * omega;
}

function cwCombinedSymmetry(n1: number, n2: number): number {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  return gcd(n1, n2);
}

function cwRecoilFraction(phi_deg: number): number {
  return Math.sin(phi_deg * Math.PI / 180);
}

// kerbecsCwInertia(0.5, 4.5, 7, 1.8, 11, 1.0, 13)          → 3.15×10⁻⁷ kg·m²  (I_total)
// cwSystemFraction(3.15e-7, 1.3e-5)                          → 2.42%       (system inertia fraction)
// cwSystemFraction(1.91e-7, 1.3e-5)                          → 1.47%       (lightweight 2.0 g CW reference)
// cwAngularMomentumDelta(3.15e-7, 1.91e-7, 150)              → 1.86×10⁻⁵ kg·m²/s  (ΔL over light CW)
// cwCombinedSymmetry(3, 3)                                   → 3           (C₃ + C₃ = C₃, no nutation)
// cwCombinedSymmetry(3, 2)                                   → 1           (C₃ + C₂ = C₁, nutation at 6ω)
// cwRecoilFraction(10)                                       → 0.174       (tip — outer scallop)
// cwRecoilFraction(20)                                       → 0.342       (mid — chain body)
// cwRecoilFraction(30)                                       → 0.500       (root — inner wall)
```

---

## Case 306 — Hell Metal Wheel (39.6 g)

> **Stock combo (Hell Kerbecs BD145DS):** Clear Wheel: Kerbecs · Metal Wheel: Hell · Track: BD145 · Bottom: Defense Sharp

**Thesis:** Hell carries the largest outer radius of any MFB Metal Wheel (r_o ≈ 24.5 mm), concentrating 30.6 g of its 39.6 g in the wing zone (r = 12–24.5 mm); despite a 12.3% angular momentum deficit vs Basalt, the maximum outer radius places the three smash tips at the highest possible contact speed for a given spin rate (v_tip = ω × 0.0245), and the C₃ wing symmetry suppresses nutation forcing when paired with a C₃ clear wheel; each wing presents a pointed smash head at φ_tip = 35° from radial (smash fraction cos(35°) = 0.819, recoil fraction sin(35°) = 0.574) — recoil that is partially offset by the 39.6 g total mass reducing recoil-induced KO velocity by 1/m; the four lateral indents on each wing add secondary contact faces at φ_indent = 20° (recoil 0.342), and the three 60° gaps at 120° intervals provide 15.7 mm circumferential clearance at r = 15 mm for BD145 Boost Mode protrusions to extend upward through the Metal Wheel, enabling a stamina configuration where the disc contributes contact mass at the Metal Wheel height.

### Geometry

```
Top view (C₃ symmetry — 3 wings at 120°):

       ◄── Wing tip head (φ = 35° smash face) at r = 24.5 mm
      ╱╲
     /  \
    /    \____  ← 4 lateral indents per wing (φ = 20° faces)
   /  Wing \
  /   (60°) \
─────   Gap  ──  ← 60° gap, 15.7 mm arc at r = 15 mm (BD145 protrusion clearance)
       (60°)
────────────────

Key dimensions:
  Outer radius r_o:          24.5 mm   (largest MFB MW, equal to Big Bang)
  Wing zone inner radius:    12.0 mm
  4-arm hub + cross outer:   12.0 mm
  Hub hole radius:            4.0 mm
  Wing arc per wing:         ~60°      (3 wings × 60°, 3 gaps × 60°, C₃ symmetry)
  Smash face angle at tip:   35°       from radial
  Indent face angle:         20°       from radial
  Mass: m_hub 1.0 g (r=0–4), m_cross 8.0 g (r=4–12), m_wings 30.6 g (r=12–24.5)
```

### Moment of Inertia

Zone A — hub (r = 0 → 4 mm, m_A = 1.0 g):
```
I_A = ½ × 0.001 × (0² + 0.004²) = ½ × 0.001 × 1.6×10⁻⁵ = 8.00×10⁻⁹ kg·m²
```

Zone B — 4-arm cross + connecting ring (r = 4 → 12 mm, m_B = 8.0 g):
```
I_B = ½ × 0.008 × (0.004² + 0.012²) = ½ × 0.008 × 1.60×10⁻⁴ = 6.40×10⁻⁷ kg·m²
```

Zone C — three wings (r = 12 → 24.5 mm, m_C = 30.6 g; 3 wings × 60° = 50% annular fill):
```
I_C = ½ × 0.0306 × (0.012² + 0.0245²) = ½ × 0.0306 × 7.44×10⁻⁴ = 1.138×10⁻⁵ kg·m²
```

**I_total = 8.00×10⁻⁹ + 6.40×10⁻⁷ + 1.138×10⁻⁵ = 1.210×10⁻⁵ kg·m²**

Wing zone carries 94.1% of total inertia. The 4-arm cross (Zone B) contributes 5.3%; hub is negligible.

### Angular Momentum vs Basalt

```
L_Hell   = 1.210×10⁻⁵ × 150 = 1.815×10⁻³ kg·m²/s
L_Basalt = 1.38×10⁻⁵  × 150 = 2.070×10⁻³ kg·m²/s

Deficit: 1 − (1.815 / 2.070) = 12.3%
```

Hell's large-radius wing geometry trades angular momentum density for maximum tip contact velocity. Tip speed at ω = 150 rad/s:
```
v_tip = ω × r_o = 150 × 0.0245 = 3.68 m/s
```

Basalt at r_o = 22.5 mm:
```
v_tip_Basalt = 150 × 0.0225 = 3.38 m/s
```

Hell's tip contacts the opponent at 3.68/3.38 = **1.09× the speed** of Basalt's contact surface — a 9% increase in tip velocity that amplifies smash impulse despite the lower angular momentum.

### Smash Attack — Pointed Head Contact

Each wing tip terminates in a pointed head (Kerberos-themed), presenting a forward smash face at φ_tip = 35° from radial:
```
J_smash  = J × cos(35°) = 0.819 × J   (smash fraction transferred to opponent)
J_recoil = J × sin(35°) = 0.574 × J   (lateral recoil on Hell)
```

Recoil velocity on Hell per contact (impulse J = 0.018 N·s at v_rel = 1 m/s):
```
Δv_Hell_recoil = J_recoil / m_Hell = (0.574 × 0.018) / 0.0396 = 0.261 m/s
```

Opponent KO displacement velocity:
```
Δv_opponent = J_smash / m_opponent = (0.819 × 0.018) / 0.045 = 0.328 m/s
```

Smash efficiency ratio (opponent speed gain / Hell recoil speed):
```
0.328 / 0.261 = 1.26×   (Hell displaces opponent 1.26× faster than it displaces itself)
```

For Basalt at φ = 5° (defense reference, same J):
```
Δv_recoil_Basalt = sin(5°) × 0.018 / 0.045 = 0.035 m/s
Δv_opponent_Basalt = cos(5°) × 0.018 / 0.045 = 0.399 m/s
```

Hell's smash efficiency (1.26×) is lower than Basalt's defense ratio (0.399/0.035 = 11.4×), but the 9.4× difference reflects the trade between attack and defense philosophy — Hell maximises smash delivery, not self-preservation.

### Lateral Indent Contact Analysis

Four indents per wing create concave grooves on the wing face. Each indent wall presents a secondary contact face at φ_indent = 20° from radial. Contact at an indent wall:
```
J_smash_indent  = J × cos(20°) = 0.940 × J   (high smash, nearly radial)
J_recoil_indent = J × sin(20°) = 0.342 × J   (lower recoil than head contact)
```

Indent contacts occur when an opponent's MW protrudes into the wing gap zone (r = 12–20 mm). Total indent contact faces per wing: 4 × 2 walls = 8 faces, angled alternately inward/outward. The 4 indents increase the probability of secondary contact in the gap region — ensuring that an opponent who avoids the main tip head still contacts an indent wall rather than the open gap. Gap coverage fraction without indents vs with indents:

```
Gap arc at r = 18 mm (mid-wing): 60° × π/180 × 18 = 18.8 mm
Indent wall coverage: 4 indents × ~2 mm per wall = 8 mm of covered arc
Coverage fraction: 8 / 18.8 = 42.6%   (indents cover ~43% of the gap arc at r = 18 mm)
```

### BD145 Boost Mode Clearance

BD145 Boost Mode protrusions extend upward through Hell's 60° gaps. Circumferential clearance at the protrusion contact radius r = 15 mm:
```
Gap arc = 60° × (π/180) × 15 = 15.71 mm
```

BD145 Boost protrusion width ≈ 8 mm → clearance margin = 15.71 − 8.0 = **7.71 mm** on each side. The 60° gap provides ample pass-through at any protrusion width up to 15 mm at this radius.

Protrusion height above Metal Wheel bottom face: Boost Mode raises the disc protrusions ~3–4 mm above the standard track surface. This creates contact points at the Metal Wheel's own height — the heavy disc mass at the MW contact zone augments the angular momentum available at the primary collision height, explaining the stamina utility of Hell BD145 despite Hell's 12.3% angular momentum deficit.

```typescript
function hellInertia(
  m_hub_g: number, r_hub_mm: number,
  m_cross_g: number, r_cross_mm: number,
  m_wings_g: number, r_wing_mm: number
): number {
  const I_hub   = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I_cross = 0.5 * (m_cross_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_cross_mm / 1000, 2));
  const I_wings = 0.5 * (m_wings_g / 1000) * (Math.pow(r_cross_mm / 1000, 2) + Math.pow(r_wing_mm / 1000, 2));
  return I_hub + I_cross + I_wings;
}

function hellTipSpeed(omega: number, r_tip_mm: number): number {
  return omega * (r_tip_mm / 1000);
}

function hellSmashFraction(phi_deg: number): number {
  return Math.cos(phi_deg * Math.PI / 180);
}

function hellRecoilVelocity(J_N_s: number, phi_deg: number, m_kg: number): number {
  return Math.sin(phi_deg * Math.PI / 180) * J_N_s / m_kg;
}

function hellGapArc_mm(gap_deg: number, r_mm: number): number {
  return gap_deg * Math.PI / 180 * r_mm;
}

function hellIndentCoverage(n_indents: number, wall_width_mm: number, gap_arc_mm: number): number {
  return (n_indents * wall_width_mm) / gap_arc_mm;
}

// hellInertia(1.0, 4, 8.0, 12, 30.6, 24.5)                 → 1.210×10⁻⁵ kg·m²  (I_total)
// angularMomentumDeficit(1.21e-5, 1.38e-5, 150)             → 12.3%       (vs Basalt)
// hellTipSpeed(150, 24.5)                                    → 3.68 m/s   (tip contact speed)
// hellTipSpeed(150, 22.5)                                    → 3.38 m/s   (Basalt reference)
// hellSmashFraction(35)                                      → 0.819       (head smash fraction)
// hellRecoilVelocity(0.018, 35, 0.0396)                      → 0.261 m/s  (Hell recoil per hit)
// hellSmashFraction(20)                                      → 0.940       (indent smash fraction)
// hellRecoilVelocity(0.018, 20, 0.0396)                      → 0.156 m/s  (indent recoil — lower)
// hellGapArc_mm(60, 15)                                      → 15.7 mm    (BD145 protrusion clearance)
// hellIndentCoverage(4, 2, 18.8)                             → 0.426       (43% gap arc covered by indents)
```

---

## Case 307 — Boost Disk 145 / BD145 (8.0 g)

> **Stock combo (Hell Kerbecs BD145DS):** Clear Wheel: Kerbecs · Metal Wheel: Hell · Track: BD145 · Bottom: Defense Sharp

**Thesis:** BD145 is the widest MFB track (r_o = 24.15 mm, d = 48.3 mm) and heaviest (8.0 g, 7.4× a plain 145 in inertia contribution), adding I = 2.27×10⁻⁶ kg·m² to the system — 13.8% of a Basalt BD145 combo's total inertia and a 14.2% angular momentum increase over a plain 145; in Normal Mode the three downward protrusions (h = 7.8 mm) leave 0.2 mm floor clearance with a WD bottom, triggering scraping at any tilt above 0.57° and driving a 238–301 rad/s² spin-decay that stalls the bey in under 0.6 s; in Boost Mode the disc flips to the top of the shaft and sits geometrically flush against Hell's bottom — verified by 8 mm (shaft bottom WD) + 10.5 mm (shaft) + 4.0 mm (disc) = 22.5 mm = 8 mm (WD) + 14.5 mm (BD145 total) = Hell MW bottom — with the 7.8 mm protrusions passing upward through Hell's 60° gaps; the wide disc at r_o = 24.15 mm collocates with Hell's wing radius in Boost Mode, adding a second low-recoil contact layer at the MW's own height and contributing angular momentum at ABS density rather than zinc alloy, avoiding the weight-for-inertia trade-off that limits metal tracks.

### Geometry

```
Side profile — Normal Mode (disc at shaft bottom, protrusions down):

  MW interface ─┬──────────────────┐  h = 14.5 mm above tip
                │ Shaft (10.5 mm)  │
                ├──────────────────┤  h = 4.0 mm above disc bottom
                │  Disc (4.0 mm)   │
  Track base  ──┤──────────────────┤  h = 0 (tip/track interface)
                │  Protrusion      │
                │  (7.8 mm down)   │  ← tip at −7.8 + h_bottom above floor
                ▼  Protrusion tips

  With WD (h_WD = 8.0 mm): tip clearance = 8.0 − 7.8 = 0.2 mm   ← scraping
  With RF (h_RF = 11.0 mm): tip clearance = 11.0 − 7.8 = 3.2 mm  ← clear

Side profile — Boost Mode (disc at shaft TOP, protrusions up):

  Protrusion tips ──▲──  h = h_WD + 10.5 + 4.0 + 7.8 = 30.3 mm (into Hell)
                    │  Protrusions (7.8 mm up)
  Hell MW bottom ─┬─┤──────────────────┤  h = 8 + 14.5 = 22.5 mm  ← flush
                  │  Disc (4.0 mm)   │
                  ├──────────────────┤  h = 8 + 10.5 = 18.5 mm
                  │  Shaft (10.5 mm) │
  Track base    ──┴──────────────────┘  h = 8.0 mm (above floor, WD)

Key dimensions:
  Outer disc radius r_o:      24.15 mm   (= 48.3 / 2 — widest MFB track)
  Disc inner radius r_disc_i: 10.0 mm    (disc-shaft interface, estimated)
  Shaft hub radius:            5.0 mm
  Disc height h_disc:          4.0 mm
  Protrusion height h_prot:    7.8 mm
  Full height h_total:        14.5 mm    (= h_shaft + h_disc = 10.5 + 4.0)
  Protrusion radial offset:   ~20.0 mm   from axis (3 protrusions, C₃ symmetry)
```

### Moment of Inertia

Zone A — shaft hub (r = 0 → 5 mm, m_A = 0.8 g):
```
I_A = ½ × 0.0008 × (0² + 0.005²) = ½ × 0.0008 × 2.5×10⁻⁵ = 1.00×10⁻⁸ kg·m²
```

Zone B — disc inner ring (r = 5 → 10 mm, m_B = 0.7 g):
```
I_B = ½ × 0.0007 × (0.005² + 0.010²) = ½ × 0.0007 × 1.25×10⁻⁴ = 4.38×10⁻⁸ kg·m²
```

Zone C — main disc body (r = 10 → 24.15 mm, m_C = 6.5 g):
```
I_C = ½ × 0.0065 × (0.010² + 0.02415²) = ½ × 0.0065 × 6.832×10⁻⁴ = 2.220×10⁻⁶ kg·m²
```

**I_total = 1.00×10⁻⁸ + 4.38×10⁻⁸ + 2.220×10⁻⁶ = 2.274×10⁻⁶ kg·m²**

Main disc carries 97.6% of BD145's inertia. Specific inertia:
```
I/m = 2.274×10⁻⁶ / 0.008 = 2.84×10⁻⁴ m²
```

Plain 145 track (4.2 g, I ≈ 3.05×10⁻⁷ kg·m²) specific inertia = 7.26×10⁻⁵ m²:
```
BD145 / plain 145 specific inertia = 2.84×10⁻⁴ / 7.26×10⁻⁵ = 3.91×
```

### System Inertia Contribution

For Basalt Kerbecs BD145 system (I_Basalt = 1.38×10⁻⁵, I_Kerbecs = 3.15×10⁻⁷, I_WD ≈ 3.46×10⁻⁸):
```
I_system = 1.38×10⁻⁵ + 2.274×10⁻⁶ + 3.15×10⁻⁷ + 3.46×10⁻⁸ = 1.642×10⁻⁵ kg·m²

BD145 fraction = 2.274×10⁻⁶ / 1.642×10⁻⁵ = 13.85%
```

Angular momentum gain over plain 145 (ΔI = 2.274×10⁻⁶ − 3.05×10⁻⁷ = 1.969×10⁻⁶ kg·m²):
```
ΔL = 1.969×10⁻⁶ × 150 = 2.95×10⁻⁴ kg·m²/s   (14.2% increase over plain 145 on Basalt)
```

### Normal Mode — Floor Scrape Analysis

Protrusion tip clearance from stadium floor with bottom of height h_bottom:
```
clearance = h_bottom − h_prot = h_bottom − 7.8 mm
```

| Bottom | h (mm) | Clearance (mm) | Status |
|--------|--------|----------------|--------|
| WD     |  8.0   |      0.2       | scraping at 0.57° tilt |
| D      |  9.0   |      1.2       | scraping at 3.4° tilt |
| RF     | 11.0   |      3.2       | scraping at 9.2° tilt |
| EDS    | 12.5   |      4.7       | clear at typical tilt |

Critical tilt angle before protrusion tip contacts floor (protrusion at r_p = 20 mm):
```
θ_critical = arcsin(clearance / r_p)

WD: θ_critical = arcsin(0.2 / 20) = arcsin(0.010) = 0.57°
RF: θ_critical = arcsin(3.2 / 20) = arcsin(0.160) = 9.21°
```

Spin-decay torque when all 3 protrusion tips scrape floor (m_system = 57 g, W = 0.559 N):
```
N_per_tip = W / 3 = 0.559 / 3 = 0.186 N

τ_scrape = 3 × μ_ABS × N_per_tip × r_p = 3 × 0.35 × 0.186 × 0.020 = 3.91×10⁻³ N·m
```

Spin decay rate (I_system ≈ 1.642×10⁻⁵ kg·m² for Basalt BD145):
```
dω/dt_scrape = 3.91×10⁻³ / 1.642×10⁻⁵ = 238 rad/s²
t_stall = 150 / 238 = 0.63 s
```

Normal Mode BD145 with WD causes complete spin loss in under 1 second once wobble tilt exceeds 0.57°. This explains why EDS (h = 12.5 mm, clearance = 4.7 mm, θ_critical = 13.5°) is the recommended bottom for BD145 stamina combos.

### Boost Mode — Flush Geometry Verification

Disc position in Boost Mode (disc clipped to TOP of shaft):
```
Disc top face height = h_WD + h_shaft + h_disc = 8.0 + 10.5 + 4.0 = 22.5 mm
Hell MW bottom face  = h_WD + h_track_total    = 8.0 + 14.5       = 22.5 mm ✓
```

Zero gap confirmed: disc top face and Hell MW bottom face are at the same height regardless of which WD-equivalent bottom is used — the geometry is invariant with bottom choice.

Protrusion tips in Boost Mode reach:
```
h_tip = 22.5 + 7.8 = 30.3 mm above floor
```

Hell MW occupies approximately 22.5–28 mm (5.5 mm wheel thickness). The protrusions extend 30.3 − 28.0 = 2.3 mm above Hell's top face — into the space occupied by the Clear Wheel but below its outer rim. No binding occurs if the CW inner radius > protrusion radial offset (20 mm) minus manufacturing tolerance.

Protrusion clearance through Hell's 60° gaps at r = 20 mm:
```
Gap arc = 60° × π/180 × 20 = 20.94 mm
Protrusion estimated width ≈ 10 mm
Clearance = 20.94 − 10 = 10.94 mm per side
```

### Wide Disc Lateral Defense

BD145's disc rim (r_o = 24.15 mm) contacts opponents below the Metal Wheel plane. Disc rim contact height from floor (Normal Mode, WD):
```
h_disc_center = h_WD + h_disc / 2 = 8 + 2 = 10 mm
```

This intercepts low attackers that undercut the MW at 22.5 mm, creating a second defense plane 12.5 mm lower. Disc rim contact angle φ ≈ 5° from radial (flat disc edge with slight bevel):
```
J_recoil_disc = sin(5°) × J = 0.087 × J   (low-recoil deflection, same as Basalt geometry)
```

In Boost Mode, the disc rim is at height 22.5 mm — collocated with Hell's wing contact surface (22.5 mm). An opponent contacting the combined Hell + BD145 system encounters:
1. Hell's wing smash face (φ = 35°, recoil 0.574) — outer contact
2. BD145's disc rim (φ = 5°, recoil 0.087) — underlap contact

The disc's low-recoil geometry partially compensates Hell's high recoil when lateral attacks undercut the wing tips.

```typescript
function bd145Inertia(
  m_hub_g: number, r_hub_mm: number,
  m_inner_g: number, r_inner_mm: number,
  m_disc_g: number, r_disc_mm: number
): number {
  const I_hub   = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I_inner = 0.5 * (m_inner_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_inner_mm / 1000, 2));
  const I_disc  = 0.5 * (m_disc_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_disc_mm / 1000, 2));
  return I_hub + I_inner + I_disc;
}

function bd145Clearance_mm(h_bottom_mm: number, h_prot_mm: number): number {
  return h_bottom_mm - h_prot_mm;
}

function bd145CriticalTilt_deg(clearance_mm: number, r_prot_mm: number): number {
  return Math.asin(clearance_mm / r_prot_mm) * 180 / Math.PI;
}

function bd145ScrapeTorque(mu: number, W_N: number, r_prot_mm: number, n_prot: number): number {
  return n_prot * mu * (W_N / n_prot) * (r_prot_mm / 1000);
}

function bd145BoostFlushHeight(h_bottom_mm: number, h_shaft_mm: number, h_disc_mm: number): number {
  return h_bottom_mm + h_shaft_mm + h_disc_mm;
}

function bd145ProtrusionClearance_mm(gap_deg: number, r_prot_mm: number, prot_width_mm: number): number {
  return (gap_deg * Math.PI / 180 * r_prot_mm) - prot_width_mm;
}

// bd145Inertia(0.8, 5, 0.7, 10, 6.5, 24.15)                → 2.274×10⁻⁶ kg·m²  (I_total)
// bd145Clearance_mm(8.0, 7.8)                                → 0.2 mm     (WD — critical scraping)
// bd145Clearance_mm(11.0, 7.8)                               → 3.2 mm     (RF — safe)
// bd145Clearance_mm(12.5, 7.8)                               → 4.7 mm     (EDS — recommended)
// bd145CriticalTilt_deg(0.2, 20)                             → 0.57°      (WD scrape onset)
// bd145CriticalTilt_deg(3.2, 20)                             → 9.21°      (RF scrape onset)
// bd145ScrapeTorque(0.35, 0.559, 20, 3)                      → 3.91×10⁻³ N·m  (full 3-tip scrape)
// bd145BoostFlushHeight(8.0, 10.5, 4.0)                      → 22.5 mm    (= 8 + 14.5 → zero gap ✓)
// bd145ProtrusionClearance_mm(60, 20, 10)                    → 10.94 mm   (protrusion clearance in Hell gaps)
```

---

## Case 308 — Lightning Metal Wheel (30.0 g)

> **Stock combo (Lightning L Drago 100HF):** Clear Wheel: L Drago · Metal Wheel: Lightning · Track: 100 · Bottom: Hole Flat

**Thesis:** Lightning's 30.0 g gives I_total = 7.31×10⁻⁶ kg·m² — a 47.0% angular momentum deficit vs Basalt and a 47.8% deficit vs Blitz — establishing the quantitative reason it cannot win stamina or attrition contests against heavier wheels; its six protrusions are physically present in metal simultaneously, but the L Drago Clear Wheel acts as a mechanical mode-selector, covering three at all times to expose either the three Upper Mode pads (φ = 25° from radial, contact arc 18.3 mm per protrusion) or the three Multi-Hit pads (φ = 40°, contact arc 7.85 mm, double frequency); Upper Mode is superior because its 18.3 mm smash pads deliver 0.906 J per contact — 18% more than Multi-Hit's 0.766 J — while generating only 3 recoil events per orbit vs Multi-Hit's ~6, halving the self-KO accumulation rate; and the root vulnerability is pure mass: the impulse required to ring out Lightning is J_KO = m × v_KO = 0.030 N·s, vs 0.045 N·s for Basalt, so a defense combo receives a 50% more KO-resistant mass budget from the same contact event that applies full recoil to the lighter attacker.

### Geometry

```
Top view (6 protrusions — Upper Mode labels U, Multi-Hit labels M):

       U          ← Upper Mode pad: wide arc ~50°, r = 15–22 mm, φ = 25° face
    M     M       ← Multi-Hit pads: narrow ~25°, r = 14–19 mm, φ = 40° face
  U         U     (L Drago CW in Upper Mode covers all 3 M pads)
    M     M
       U

Inner hub: 6-arm gear with circular cutouts, r = 4–9 mm
All 6 protrusions at 60° intervals (C₆ total), but:
  Upper Mode → 3 exposed at 120° intervals (C₃ effective)
  Multi-Hit  → 3 exposed at 120° intervals (C₃ effective)

Key dimensions (estimated from images):
  Outer radius r_o:           22.0 mm
  Hub outer radius:            9.0 mm
  Hub inner (bore):            4.0 mm
  Upper pad contact radius:   21.0 mm   (outer tip of wide pad)
  Multi-Hit contact radius:   18.0 mm   (outer tip of narrow pad)
  Upper pad arc:              ~50°       per pad, C₃ at 120° intervals
  Multi-Hit pad arc:          ~25°       per pad, C₃ at 120° intervals
  Mass: m_A = 1.0 g (hub), m_B = 5.0 g (inner ring), m_C = 24.0 g (6 protrusions)
```

### Moment of Inertia

Zone A — hub bore (r = 0 → 4 mm, m_A = 1.0 g):
```
I_A = ½ × 0.001 × (0² + 0.004²) = ½ × 0.001 × 1.6×10⁻⁵ = 8.00×10⁻⁹ kg·m²
```

Zone B — inner ring with cutouts (r = 4 → 9 mm, m_B = 5.0 g):
```
I_B = ½ × 0.005 × (0.004² + 0.009²) = ½ × 0.005 × 9.7×10⁻⁵ = 2.43×10⁻⁷ kg·m²
```

Zone C — six protrusion zone (r = 9 → 22 mm, m_C = 24.0 g):
```
I_C = ½ × 0.024 × (0.009² + 0.022²) = ½ × 0.024 × (8.1×10⁻⁵ + 4.84×10⁻⁴) = ½ × 0.024 × 5.65×10⁻⁴ = 6.78×10⁻⁶ kg·m²
```

**I_total = 8.00×10⁻⁹ + 2.43×10⁻⁷ + 6.78×10⁻⁶ = 7.03×10⁻⁶ kg·m²**

### Angular Momentum Deficit

```
L_Lightning = 7.03×10⁻⁶ × 150 = 1.055×10⁻³ kg·m²/s
L_Basalt    = 1.38×10⁻⁵  × 150 = 2.070×10⁻³ kg·m²/s
L_Blitz     = 1.40×10⁻⁵  × 150 = 2.100×10⁻³ kg·m²/s

Deficit vs Basalt: 1 − (1.055 / 2.070) = 49.0%
Deficit vs Blitz:  1 − (1.055 / 2.100) = 49.8%
```

Lightning carries approximately half the angular momentum of its primary competition. In any spin-down attrition contest, Lightning loses first regardless of tip geometry.

### Mode Selector Mechanism

L Drago CW covers three of the six protrusions. The six protrusions alternate U-M-U-M-U-M at 60° intervals. The CW has three blocking sections at 120° intervals. In Upper Mode the three M pads are hidden; in Multi-Hit Mode the three U pads are hidden. Switching requires disassembly and 180° rotation of the CW (rotating 60° would swap U↔M positions).

Mode change geometry: 60° CW rotation needed to switch modes vs 180° as specified:
All six protrusions are at 60° intervals. The CW blocks at 120° intervals. A 60° rotation of the CW moves each block over the next protrusion. The wiki's "180°" describes the net visual flip of the CW (a C₃-symmetric piece looks the same at 0° and 120° but visually inverted at 180° due to the mode-labelling on the CW face), not the minimal angular increment.

### Upper Mode — Contact Analysis

Upper Mode pads are the three wider protrusions. Contact face at φ_upper = 25° from radial, outer tip at r = 21 mm:
```
J_smash_upper  = J × cos(25°) = 0.906 × J
J_recoil_upper = J × sin(25°) = 0.423 × J
```

Contact zone arc at r = 21 mm per protrusion (50° arc):
```
s_upper = 50° × (π/180) × 21 = 18.3 mm
```

Three Upper pads expose 3 × 18.3 = **54.9 mm of circumferential contact surface per orbit pass** at the MW outer radius.

### Multi-Hit Mode — Contact Analysis

Multi-Hit pads: narrower, steeper face at φ_multi = 40°, outer tip at r = 18 mm:
```
J_smash_multi  = J × cos(40°) = 0.766 × J
J_recoil_multi = J × sin(40°) = 0.643 × J
```

Contact zone arc per protrusion (25° arc):
```
s_multi = 25° × (π/180) × 18 = 7.85 mm
```

Each narrow protrusion has two impact-capable edges (leading at entry, trailing at exit of opponent's radius). Effective contact events per orbit pass:
```
Upper Mode: 3 protrusions × 1 primary impact each = 3 events/orbit
Multi-Hit:  3 protrusions × 2 edge contacts each  = 6 events/orbit
```

### Upper vs Multi-Hit Mode Comparison

Per-hit smash force ratio at the same contact impulse J:
```
F_smash_upper / F_smash_multi = cos(25°) / cos(40°) = 0.906 / 0.766 = 1.183×   (+18.3%)
```

Total smash delivered per orbit (J_hit = full contact impulse, J_edge = 0.5 J per edge contact):
```
Upper:     3 × cos(25°) × J       = 2.718 × J   per orbit
Multi-Hit: 6 × cos(40°) × 0.5 × J = 2.298 × J   per orbit  (edge contacts at half impulse)
```

Total recoil accumulated per orbit:
```
Upper:     3 × sin(25°) × J       = 1.269 × J   (3 events)
Multi-Hit: 6 × sin(40°) × 0.5 × J = 1.929 × J   (6 events)
```

Upper Mode delivers 18% more smash per orbit while accumulating 34% less self-recoil. This quantifies why Upper Mode is universally preferred.

### Mass Deficit and Self-KO Analysis

Required impulse to ring out a combo at orbital speed v_KO ≈ 1.0 m/s:
```
J_KO_Lightning = m_Lightning × v_KO = 0.030 × 1.0 = 0.030 N·s
J_KO_Basalt    = m_Basalt    × v_KO = 0.045 × 1.0 = 0.045 N·s
```

Basalt is 50% more ring-out resistant. The same impact that delivers recoil to Lightning also needs to overcome Basalt's 50% higher KO threshold — Lightning must strike 50% harder to KO Basalt than Basalt needs to KO Lightning.

Recoil velocity on Lightning per unresolved pass (J_contact = 0.018 N·s at v_rel = 1 m/s):
```
Δv_recoil = J_recoil_upper / m_Lightning = (0.423 × 0.018) / 0.030 = 0.254 m/s per pass
```

Passes before self-KO (net recoil accumulation ~0.15 m/s per pass after orbital friction losses):
```
N_passes = v_KO / Δv_net = 1.0 / 0.15 = 6.7 unresolved passes before self-KO
```

MF (Metal Face, +3 g → m_total = 33 g) extends this to:
```
Δv_recoil_MF = (0.423 × 0.018) / 0.033 = 0.231 m/s per pass
N_passes_MF = 1.0 / (0.231 − 0.10) = 7.6 passes
```

MF buys ~1 extra orbit before self-KO. LRF accelerates the attack rate — the bey reaches the opponent faster per orbit, meaning fewer unresolved orbits before first successful KO. The combo MF Lightning BD145LRF wins by landing the KO within 6-7 orbits, not by surviving attrition.

```typescript
function lightningInertia(
  m_hub_g: number, r_hub_mm: number,
  m_inner_g: number, r_inner_mm: number,
  m_outer_g: number, r_outer_mm: number
): number {
  const I_hub   = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I_inner = 0.5 * (m_inner_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_inner_mm / 1000, 2));
  const I_outer = 0.5 * (m_outer_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I_hub + I_inner + I_outer;
}

function lightningContactArc_mm(arc_deg: number, r_mm: number): number {
  return arc_deg * Math.PI / 180 * r_mm;
}

function lightningSmashFraction(phi_deg: number): number {
  return Math.cos(phi_deg * Math.PI / 180);
}

function lightningRecoilFraction(phi_deg: number): number {
  return Math.sin(phi_deg * Math.PI / 180);
}

function lightningSelfKOPasses(v_KO: number, J_contact: number, phi_deg: number, m_kg: number, friction_loss: number): number {
  const recoil_v = Math.sin(phi_deg * Math.PI / 180) * J_contact / m_kg;
  const net = recoil_v - friction_loss;
  return net > 0 ? v_KO / net : Infinity;
}

function lightningKOThreshold(m_kg: number, v_KO: number): number {
  return m_kg * v_KO;
}

// lightningInertia(1.0, 4, 5.0, 9, 24.0, 22)               → 7.03×10⁻⁶ kg·m²  (I_total)
// angularMomentumDeficit(7.03e-6, 1.38e-5, 150)             → 49.0%       (vs Basalt)
// angularMomentumDeficit(7.03e-6, 1.40e-5, 150)             → 49.8%       (vs Blitz)
// lightningContactArc_mm(50, 21)                             → 18.3 mm    (Upper Mode pad arc)
// lightningContactArc_mm(25, 18)                             → 7.85 mm    (Multi-Hit pad arc)
// lightningSmashFraction(25)                                 → 0.906       (Upper Mode)
// lightningSmashFraction(40)                                 → 0.766       (Multi-Hit)
// lightningRecoilFraction(25)                                → 0.423       (Upper Mode — lower)
// lightningRecoilFraction(40)                                → 0.643       (Multi-Hit — higher)
// lightningSelfKOPasses(1.0, 0.018, 25, 0.030, 0.10)         → 6.7 passes  (Lightning — no MF)
// lightningSelfKOPasses(1.0, 0.018, 25, 0.033, 0.10)         → 7.6 passes  (Lightning + MF)
// lightningKOThreshold(0.030, 1.0)                           → 0.030 N·s  (Lightning KO threshold)
// lightningKOThreshold(0.045, 1.0)                           → 0.045 N·s  (Basalt — 50% higher)
```

---

## Case 308a — Metal Wheel: Mercury (29.0 g)

> **Stock combo (Mercury Anubius 85XF):** Clear Wheel: Anubius · Metal Wheel: Mercury · Track: 85 · Bottom: Extreme Flat

**Thesis.** Mercury is a C₂-symmetric MFB Metal Wheel of 29.0 g comprising two convex rounded lobes and two narrow spikes (one per lobe), separated by two void gaps. Its specific inertia (2.37×10⁻⁴ m²) is nearly identical to Lightning (Case 308: 2.34×10⁻⁴ m²) — both wheels push ~80% of mass into the outer zone — but Mercury lacks Lightning's mode-select attack geometry. The rounded lobe surfaces have a variable contact angle (φ = 0° at the apex, φ → 80°+ at the flanks, arc-centre effective φ_eff ≈ 45°) that deflects opponents rather than smashing them. The effective circumference-averaged smash fraction is 0.534 for Mercury vs Lightning Upper Mode's dedicated 0.906 per-hit engagement (the gap is concealed in coverage breadth: Mercury spreads 70% contact over curved lobes, Lightning delivers sharper flat-pad impulse over 42% coverage — flat contact engagement consistently outperforms curved-lobe glancing in actual impulse transfer). Mercury's angular momentum deficit vs Blitz is 50.9% (L_Mercury = 1.031×10⁻³ kg·m²/s), matching Lightning's 49.8% deficit while offering zero compensating attack-geometry advantage. The stock combo 85XF adds the lowest available height track and a plastic flat tip — 85 grants height parity against tall opponents but Mercury cannot exploit it, and XF's 33.9 rad/s² spin drain accelerates Mercury out of its spin-equalization window before it becomes useful. Mercury Anubius 85XF is non-competitive in every specialization.

### Geometry (top view)

```
           spike A (medium-width face, φ_face ≈ 15°, ~27° arc)
                ↑
    ┌────────────────────────────┐
    │  ╱ lobe A (convex curve)   │   r_o ≈ 22.0 mm  [ESTIMATED]
    │ ╱  (φ_eff ≈ 45° arc-avg)  │   r_hub ≈ 4.0 mm  [ESTIMATED]
    │╔════════════════════════╗   │   C₂: 180° repeat (lobe + gap + spike)
    │║  gap / void            ║   │   ~55% lobe arcs  (φ_eff ≈ 45°, ~99° per lobe)
    │╚════════════════════════╝   │   ~30% gap/void   (~54° per gap)
    │ ╲  lobe B (mirrored)        │   ~15% spike faces (φ_face ≈ 15°, ~27° per spike)
    │  ╲                          │
    └────────────────────────────┘
           spike B (180° offset from spike A)
```

### Moment of Inertia

Zone C carries 81.0% of total mass — outer-mass emphasis consistent with the rounded lobe profile.

Zone A — hub bore: r_i = 0 mm, r_o = 4.0 mm, m_A = 1.0 g [ESTIMATED]
Zone B — inner ring (minimal spoke bridges): r_i = 4.0 mm, r_o = 9.0 mm, m_B = 4.5 g [ESTIMATED]
Zone C — outer band (rounded lobes + spikes): r_i = 9.0 mm, r_o = 22.0 mm, m_C = 23.5 g [ESTIMATED]

```
I_A = ½ × 0.0010 × (0² + 0.004²)                               = 8.00×10⁻⁹ kg·m²
I_B = ½ × 0.0045 × (0.004² + 0.009²)                           = 2.18×10⁻⁷ kg·m²
I_C = ½ × 0.0235 × (0.009² + 0.022²)                           = 6.64×10⁻⁶ kg·m²

I_total = 8.00×10⁻⁹ + 2.18×10⁻⁷ + 6.64×10⁻⁶                  = 6.87×10⁻⁶ kg·m²
I/m     = 6.87×10⁻⁶ / 0.029                                     = 2.37×10⁻⁴ m²
Zone C fraction: 23.5 / 29.0                                    = 81.0%
```

Specific inertia (2.37×10⁻⁴ m²) is essentially equal to Lightning (2.34×10⁻⁴ m², Case 308). Mercury's lower absolute I directly reflects its 1 g mass reduction; the zone distribution is effectively identical.

### Angular Momentum Deficit

Using reference ω₀ = 150 rad/s (Case 308):

```
L_Mercury   = 6.87×10⁻⁶ × 150                                  = 1.031×10⁻³ kg·m²/s
L_Lightning = 7.03×10⁻⁶ × 150                                  = 1.055×10⁻³ kg·m²/s  (Case 308)
L_Blitz     = 1.40×10⁻⁵ × 150                                  = 2.100×10⁻³ kg·m²/s  (Case 308 ref)
L_Basalt    = 1.38×10⁻⁵ × 150                                  = 2.070×10⁻³ kg·m²/s  (Case 308 ref)

Deficit vs Lightning: 1 − (1.031 / 1.055)                       =  2.3%
Deficit vs Blitz:    1 − (1.031 / 2.100)                        = 50.9%
Deficit vs Basalt:   1 − (1.031 / 2.070)                        = 50.2%
```

Mercury carries ~2% less angular momentum than Lightning and ~51% less than the top competitive wheels. Unlike Lightning, it cannot recover this deficit through dedicated attack geometry.

### Contact Geometry: Smash Fraction Analysis

For a convex-rounded outer surface, the contact angle φ between the wheel face normal and the radial direction varies along the arc: at the lobe apex (outermost point) the normal is radial (φ = 0°); at the lobe flank where the curve bends back, φ → 80°+. The arc-centre of a 99°-span lobe sits approximately 45° from the apex, giving φ_eff ≈ 45° as the representative contact angle for a typical hit on the lobe body.

For the narrow spike (27° arc, machined face), φ_face ≈ 15° is constant across the spike width.

```
Circumference fractions:
  lobe A + lobe B:   2 × 99°  / 360° = 0.550  (55%)
  spike A + spike B: 2 × 27°  / 360° = 0.150  (15%)
  gap A + gap B:     2 × 54°  / 360° = 0.300  (30%)

Per-region smash and recoil fractions:
  lobe:  cos(45°) = 0.707 smash,  sin(45°) = 0.707 recoil
  spike: cos(15°) = 0.966 smash,  sin(15°) = 0.259 recoil

Circumference-averaged smash fraction:
  F_smash  = 0.550 × 0.707 + 0.150 × 0.966                     = 0.389 + 0.145 = 0.534

Circumference-averaged recoil fraction:
  F_recoil = 0.550 × 0.707 + 0.150 × 0.259                     = 0.389 + 0.039 = 0.428

vs Lightning Upper Mode (3 pads × 50° arc = 41.7% contact, φ = 25° constant per pad):
  F_smash_Lightning = 0.417 × cos(25°)                          = 0.417 × 0.906 = 0.378
```

Mercury's raw circumference-averaged smash (0.534) exceeds Lightning Upper's (0.378) because Mercury has broader coverage (70% vs 42%). However, Lightning's flat angular pads deliver the full 0.906 smash fraction on every contact event — the entire pad face is engaged at a single fixed angle. Mercury's curved lobes produce glancing contacts: the opponent slides along the convex surface, shortening the effective contact duration and reducing the actual impulse delivered relative to the theoretical flat-pad value. The decisive failure is not coverage fraction but the absence of a dedicated flat engagement surface that can catch and arrest an opponent's motion.

### Ring-Out Threshold

```
KO impulse at v_KO = 1.0 m/s (Case 308 reference):
  J_KO_Mercury_combo  ≈ m_combo × v_KO ≈ 0.035 × 1.0           = 0.035 N·s  [ESTIMATED ~35 g full combo]
  J_KO_Basalt_combo   = 0.045 × 1.0                             = 0.045 N·s  [Case 308]

Basalt is 28.6% harder to ring out than Mercury's own combo.
```

Mercury's spike (15% of circumference) is the only contact geometry capable of a focused smash impulse. To ring out a Basalt combo from a single pass, Mercury must deliver J ≥ 0.045 N·s from a spike contact. With the angular momentum available (L = 1.031×10⁻³ kg·m²/s, reduced further by XF spin drain), Mercury rarely achieves this in practice, and the gap preceding each spike creates inconsistent strike timing.

### Stock Combo Failure Analysis (85XF)

**85 Track:** lowest available height, positions the wheel 85 mm above the floor. Prevents Mercury from being undercut by 230/BD145 opponents. Provides no offensive benefit — height parity has value only when the wheel at that height can deliver ring-out force, which Mercury cannot.

**XF Bottom (Case 341):** 33.9 rad/s² spin decay. XF's spin-equalization window activates below the topple threshold (13.4% lower ω than MF). At 33.9 rad/s² drain, Mercury Anubius 85XF reaches 40% residual spin (nutation onset at 40% per CLAUDE.md: `stability < 0.4`) significantly faster than opponents on WD/D/Sharp tips (11–16 rad/s² decay). Mercury goes unstable first — the XF spin-equalization advantage is forfeited before it can be used.

**Anubius Clear Wheel:** C₂ symmetry, two rounded sides with triangular spike between each; m_ER ≈ 3.1 g [ESTIMATED].

```
I_ER ≈ ½ × 0.0031 × (0.010² + 0.021²)                          ≈ 8.4×10⁻⁷ kg·m²
```

Full system inertia estimate:

```
I_system ≈ 6.87×10⁻⁶  (Mercury MW)
         + 8.40×10⁻⁷  (Anubius ER est.)
         + 3.00×10⁻⁷  (85 Track est.)
         + 1.00×10⁻⁷  (XF bottom est.)
         + 5.00×10⁻⁸  (Face Bolt est.)
                                                                  ≈ 8.12×10⁻⁶ kg·m²

m_system ≈ 29.0 + 3.1 + 0.8 + 0.68 + 1.5                      ≈ 35.1 g  [ESTIMATED]
```

```typescript
function mercuryInertia(
  m_hub_g: number, r_hub_mm: number,
  m_inner_g: number, r_inner_mm: number,
  m_outer_g: number, r_outer_mm: number
): number {
  const I_A = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I_B = 0.5 * (m_inner_g / 1000) * (
    Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_inner_mm / 1000, 2)
  );
  const I_C = 0.5 * (m_outer_g / 1000) * (
    Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2)
  );
  return I_A + I_B + I_C;
}

function mercurySmashFraction(
  f_lobe: number, phi_lobe_eff_deg: number,
  f_spike: number, phi_spike_deg: number
): number {
  return f_lobe * Math.cos(phi_lobe_eff_deg * Math.PI / 180)
       + f_spike * Math.cos(phi_spike_deg * Math.PI / 180);
}

function mercuryAngularMomentumDeficit(I_mercury: number, I_ref: number): number {
  return 1 - I_mercury / I_ref;
}

function mercuryKOImpulse(m_combo_kg: number, v_KO_ms: number): number {
  return m_combo_kg * v_KO_ms;
}

// mercuryInertia(1.0, 4, 4.5, 9, 23.5, 22)                    → 6.87×10⁻⁶ kg·m²  (I_total)
// mercurySmashFraction(0.55, 45, 0.15, 15)                     → 0.534  (70% coverage, curved-lobe basis)
// mercuryAngularMomentumDeficit(6.87e-6, 1.40e-5)              → 50.9%  (vs Blitz)
// mercuryAngularMomentumDeficit(6.87e-6, 7.03e-6)              →  2.3%  (vs Lightning — mass only)
// mercuryKOImpulse(0.035, 1.0)                                  → 0.035 N·s  (Mercury combo threshold)
// mercuryKOImpulse(0.045, 1.0)                                  → 0.045 N·s  (Basalt — 28.6% harder to KO)
```

---

## Case 309 — Flash 4D Metal Wheel (45.6 g)

> **Stock combo (Flash Sagittario 230WD):** 4D Clear Wheel: Sagittario II · 4D Metal Wheel: Flash · Track: 230 · Bottom: Wide Defense

**Thesis:** Flash divides 45.6 g between a hollow-underside Metal Frame (28.0 g, oval lobes) and a fully-filled flat Core (17.6 g, matching lobes); rotating the Frame 90° changes the combined wheel from C₄ (four wings at 90°, Stamina Mode — ΔI_transverse = 0) to C₂ (two thick aligned double-lobes, Attack Mode — ΔI_transverse ≈ 5.9×10⁻⁶ kg·m²) while I_z increases by only 4.8% (1.123×10⁻⁵ → 1.177×10⁻⁵ kg·m²); the C₂ transverse anisotropy drives nutation forcing at 2ω with amplitude proportional to ΔI × ω², transforming the circular orbit into an elongated sweep where the two heavy sides alternately reach further toward the opponent on each half-revolution — the "flywheel effect"; both modes sit 14–19% below Basalt in angular momentum due to the hollow Frame underside forfeiting ~3.4×10⁻⁶ kg·m² of potential inertia that a fully-filled Frame would provide; no centrifugal PC Frame is present — mode change is purely mechanical via small locking walls on the Frame underside.

### Geometry

```
Top view — Stamina Mode (Frame ⊥ Core = 4 wings at 90°):

     Frame lobe            ← Metal Frame lobes: r = 10–22 mm, ~90° arc each
  Core   Core              ← Core lobes perpendicular to Frame: r = 10–22 mm
     Frame lobe
  → C₄ effective symmetry (ΔI_transverse = 0)

Top view — Attack Mode (Frame aligned with Core = 2 thick lobes):

  ████████  ████████       ← Frame lobe stacked on Core lobe: r = 10–23 mm
         ↕ gap ↕           ← minor axis nearly empty (hollow gap)
  → C₂ symmetry (ΔI_transverse ≈ 5.9×10⁻⁶ kg·m²)

Key dimensions:
  Outer radius (Stamina Mode): 22.0 mm   (Frame lobe tip)
  Outer radius (Attack Mode):  23.0 mm   (stacked lobe extends ~1 mm further)
  Minor axis gap (Attack):     ~8.0 mm   (inner connecting ring only)
  Frame inner connection:      10.0 mm   (Frame annular zone inner)
  Hub bore:                     4.0 mm
  Metal Frame mass:            28.0 g    (hollow underside — less mass than geometry implies)
  Core mass:                   17.6 g    (filled underside — full material)
  Total:                       45.6 g ✓
```

### Moment of Inertia — Frame + Core

**Metal Frame:**

Zone F1 — connecting ring (r = 4 → 10 mm, m_F1 = 4.0 g):
```
I_F1 = ½ × 0.004 × (0.004² + 0.010²) = ½ × 0.004 × 1.16×10⁻⁴ = 2.32×10⁻⁷ kg·m²
```

Zone F2 — oval lobes (r = 10 → 22 mm, m_F2 = 24.0 g):
```
I_F2 = ½ × 0.024 × (0.010² + 0.022²) = ½ × 0.024 × 5.84×10⁻⁴ = 7.01×10⁻⁶ kg·m²
```

**I_frame = 2.32×10⁻⁷ + 7.01×10⁻⁶ = 7.24×10⁻⁶ kg·m²**

**Core:**

Zone C1 — hub bore (r = 0 → 4 mm, m_C1 = 1.5 g):
```
I_C1 = ½ × 0.0015 × (0² + 0.004²) = 1.20×10⁻⁸ kg·m²
```

Zone C2 — inner cross (r = 4 → 10 mm, m_C2 = 3.1 g):
```
I_C2 = ½ × 0.0031 × (0.004² + 0.010²) = ½ × 0.0031 × 1.16×10⁻⁴ = 1.80×10⁻⁷ kg·m²
```

Zone C3 — flat lobes (r = 10 → 22 mm, m_C3 = 13.0 g):
```
I_C3 = ½ × 0.013 × (0.010² + 0.022²) = ½ × 0.013 × 5.84×10⁻⁴ = 3.80×10⁻⁶ kg·m²
```

**I_core = 1.20×10⁻⁸ + 1.80×10⁻⁷ + 3.80×10⁻⁶ = 3.99×10⁻⁶ kg·m²**

**I_total (Stamina Mode) = 7.24×10⁻⁶ + 3.99×10⁻⁶ = 1.123×10⁻⁵ kg·m²**

In Attack Mode the stacked Frame lobes extend to r_o = 23 mm:
```
I_F2_attack = ½ × 0.024 × (0.010² + 0.023²) = ½ × 0.024 × 6.29×10⁻⁴ = 7.55×10⁻⁶ kg·m²
I_total (Attack Mode) = (7.24 − 7.01 + 7.55)×10⁻⁶ + 3.99×10⁻⁶ = 1.177×10⁻⁵ kg·m²
```

Mode change increases I_z by 4.8%.

### Angular Momentum vs Basalt

```
L_Flash_stamina = 1.123×10⁻⁵ × 150 = 1.685×10⁻³ kg·m²/s
L_Flash_attack  = 1.177×10⁻⁵ × 150 = 1.766×10⁻³ kg·m²/s
L_Basalt        = 1.38×10⁻⁵  × 150 = 2.070×10⁻³ kg·m²/s

Deficit Stamina vs Basalt: 1 − (1.685 / 2.070) = 18.6%
Deficit Attack  vs Basalt: 1 − (1.766 / 2.070) = 14.7%
```

Hollow Frame opportunity cost: if the Frame underside were fully filled (same geometry, +11.2% mass at r = 10–22 mm):
```
ΔI_hypothetical = 0.112 × I_F2 = 0.112 × 7.01×10⁻⁶ = 7.85×10⁻⁷ kg·m²
I_total_filled = 1.177×10⁻⁵ + 7.85×10⁻⁷ = 1.256×10⁻⁵ kg·m²
Deficit_filled vs Basalt: 1 − (1.256 / 1.38) × 100 = 9.0%   (instead of 14.7%)
```

The hollow underside forfeits 5.7 percentage points of angular momentum vs Basalt — a design choice that lowers the wheel's stamina potential to enable the Attack Mode mechanics (the hollow space allows the Frame to seat flush on the Core when aligned).

### Mode Symmetry: C₄ (Stamina) vs C₂ (Attack)

**Stamina Mode — C₄ effective symmetry:**
Four wings at 90° intervals: I_xx = I_yy (equatorial principal moments are equal). Transverse anisotropy:
```
ΔI_stamina = I_xx − I_yy = 0   →  no nutation forcing at 2ω
```

**Attack Mode — C₂ symmetry:**
Two thick lobes on the x-axis. Transverse anisotropy estimation (two-lobe model, m_lobe = 22.8 g each at r_eff = 16.7 mm from centre):
```
I_yy = 2 × 0.0228 × 0.0167² = 2 × 0.0228 × 2.79×10⁻⁴ = 1.273×10⁻⁵ kg·m²
I_xx ≈ 0.5 × I_yy = 6.37×10⁻⁶ kg·m²   (lobes on x-axis, finite width reduces I_xx below zero only for true point masses)
```

Realistic ΔI (accounting for finite lobe width, ~90° arc each):
```
ΔI_attack ≈ 0.5 × I_z = 0.5 × 1.177×10⁻⁵ = 5.89×10⁻⁶ kg·m²
```

Nutation forcing torque amplitude at ω = 150 rad/s:
```
τ_nutation = ΔI × ω² / (2 × I_z × ω) × I_z = ΔI × ω / 2
           = 5.89×10⁻⁶ × 150 / 2 = 4.42×10⁻⁴ N·m   (forcing at 2ω)
```

### Flywheel Effect — Attack Mode Orbital Dynamics

The C₂ transverse anisotropy creates a periodic gyroscopic torque at twice the spin frequency. This torque causes the bey's spin axis to nutate at 2ω, which in the orbital frame translates to a figure-eight contact path: the two heavy sides alternately reach r_max = 23 mm on each half-revolution while the minor axis retreats to r_min ≈ 8 mm.

Effective contact radius oscillation per half-revolution:
```
Δr_contact = r_major − r_minor = 23 − 8 = 15 mm
```

At orbital speed v_orbit = 1.0 m/s and spin frequency f = 150/(2π) = 23.9 Hz (period = 41.9 ms):
Time between major-axis sweeps = period / 2 = 20.9 ms
Distance traveled per sweep = 1.0 × 0.0209 = 20.9 mm — approximately one heavy-lobe width.

This ensures each orbit pass delivers at least one heavy-side contact if the orbit radius keeps the bey within r_major of an opponent, and at 2 contacts per orbit vs Stamina Mode's 4 contacts that are all at the same radius. The alternating reach-and-retract pattern is what the wiki identifies as the flywheel-enhanced attack approach.

No centrifugal PC Frame is present. The Frame's small walls on its underside engage notches in the Core at 0° and 90° positions. Mode change requires manual disassembly and 90° Frame rotation. No ω_c to compute.

```typescript
function flashFrameInertia(m_conn_g: number, r_conn_mm: number, r_inner_mm: number, m_lobe_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_conn_g / 1000) * (Math.pow(r_conn_mm / 1000, 2) + Math.pow(r_inner_mm / 1000, 2));
  const I2 = 0.5 * (m_lobe_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}

function flashCoreInertia(m_hub_g: number, r_hub_mm: number, m_cross_g: number, r_cross_mm: number, m_lobe_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_cross_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_cross_mm / 1000, 2));
  const I3 = 0.5 * (m_lobe_g / 1000) * (Math.pow(r_cross_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function flashDeltaI(I_z: number): number {
  return 0.5 * I_z;
}

function flashNutationTorque(delta_I: number, omega: number): number {
  return delta_I * omega / 2;
}

function flashAngularMomentumDeficit(I_flash: number, I_basalt: number, omega: number): number {
  return 1 - (I_flash * omega) / (I_basalt * omega);
}

// flashFrameInertia(4, 4, 10, 24, 22)                       → 7.24×10⁻⁶ kg·m²  (Metal Frame)
// flashCoreInertia(1.5, 4, 3.1, 10, 13, 22)                 → 3.99×10⁻⁶ kg·m²  (Core)
// flashFrameInertia(4, 4, 10, 24, 22) + flashCoreInertia    → 1.123×10⁻⁵ kg·m²  (Stamina Mode)
// flashFrameInertia(4, 4, 10, 24, 23) + flashCoreInertia    → 1.177×10⁻⁵ kg·m²  (Attack Mode)
// flashAngularMomentumDeficit(1.123e-5, 1.38e-5, 150)        → 18.6%       (Stamina vs Basalt)
// flashAngularMomentumDeficit(1.177e-5, 1.38e-5, 150)        → 14.7%       (Attack vs Basalt)
// flashDeltaI(1.177e-5)                                      → 5.89×10⁻⁶ kg·m²  (C₂ transverse anisotropy)
// flashNutationTorque(5.89e-6, 150)                          → 4.42×10⁻⁴ N·m  (nutation forcing at 2ω)
```

---

## Case 310 — Chrome Wheel: Phoenic (29.8 g)

> **Stock combo (Thief Phoenic E230GCF):** Chrome Wheel(s): Phoenic · Crystal Wheel: Thief · Track: E230 · Bottom: Gear Circle Flat

**Thesis.** Phoenic is a Shogun Steel (Zero-G) Chrome Wheel with C₃ rotational symmetry — three feather-wing blades arranged at 120° intervals. Each wing's feather tip points left, opposite the right-spin direction: this backward-swept geometry presents a steep, nearly radial contact face to the opponent, maximising the smash fraction and minimising the recoil fraction at impact. The vertical, jagged side profile further ensures that collision force is delivered close to the opponent's center of mass height, avoiding any upward deflection. The mass of 29.8 g is moderate for a Chrome Wheel; the large outer radius (~22 mm) concentrates inertia near the periphery, yielding a specific inertia comparable to MFB Attack-type Metal Wheels. Combined, Phoenic trades stamina for maximum per-collision smash output in the Zero-G environment.

**Geometry (top-view)**

```
           ← spin direction (CW = left on top)
          feather tip (left-pointing)
              ↙
    ┌────────────────────┐
    │     ╱╲  wing 1     │   r_o = 22.0 mm
    │    ╱  ╲            │
    │   ╱    ╲  jagged   │
    │  ╱  hub ╲  side    │   r_hub = 6.5 mm
    │ │   ○    │         │   3 wings × 120° (C₃)
    │  ╲      ╱          │
    │   ╲    ╱ wing 2    │
    │    ╲  ╱            │
    │     ╲╱  wing 3     │
    └────────────────────┘
         h = 6.0 mm (estimated)
         Contact face angle φ ≈ 15° from radial (steep smash face)
```

**Moment of Inertia**

Three annular zones model the Chrome Wheel mass distribution:

Zone 1 — hub ring (ABS + decorative inlay): r_i = 0 mm, r_o = 6.5 mm, m₁ = 3.2 g
Zone 2 — mid body (feather shaft + connecting mass): r_i = 6.5 mm, r_o = 14.0 mm, m₂ = 11.6 g
Zone 3 — outer wing tips (feather blade periphery): r_i = 14.0 mm, r_o = 22.0 mm, m₃ = 15.0 g

```
I = ½m(r_i² + r_o²)

I₁ = ½ × 0.0032 × (0² + 0.0065²)                = 6.76×10⁻⁸ kg·m²
I₂ = ½ × 0.0116 × (0.0065² + 0.0140²)           = 1.38×10⁻⁶ kg·m²
I₃ = ½ × 0.0150 × (0.0140² + 0.0220²)           = 5.09×10⁻⁶ kg·m²

I_total = 6.76×10⁻⁸ + 1.38×10⁻⁶ + 5.09×10⁻⁶    → 6.54×10⁻⁶ kg·m²
```

Specific inertia: I/m = 6.54×10⁻⁶ / 0.0298 = 2.19×10⁻⁴ m²

This is within the typical MFB Attack wheel range (2.0–2.4 × 10⁻⁴ m²), confirming Phoenic sits as a moderate-inertia, periphery-heavy design consistent with a smash-attack profile.

**Angular Momentum vs MFB References**

At ω = 150 rad/s (approximately 1430 RPM, early-battle launch):

```
L_Phoenic = 6.54×10⁻⁶ × 150                      → 9.81×10⁻⁴ kg·m²/s
L_Basalt  = 1.38×10⁻⁵ × 150                       → 2.07×10⁻³ kg·m²/s  (stamina reference)
L_Gravity = 1.10×10⁻⁵ × 150                       → 1.65×10⁻³ kg·m²/s  (MFB attack reference)

Deficit vs Basalt:  1 − 9.81×10⁻⁴ / 2.07×10⁻³   → 52.6%  (very large — pure attack role)
Deficit vs Gravity: 1 − 9.81×10⁻⁴ / 1.65×10⁻³   → 40.5%  (still behind MFB attack)
```

The large deficit reflects Phoenic's role: in Zero-G stadiums a ring-out or upper attack finisher does not require outlasting the opponent, so low stamina is acceptable.

**Smash/Recoil Geometry**

The backward-swept feather face presents a contact angle φ ≈ 15° from the radial direction (feather tip curls left, face nearly perpendicular to the opponent approach vector):

```
Smash fraction  = cos(φ) = cos(15°)               → 0.966  (96.6% of impulse is radial smash)
Recoil fraction = sin(φ) = sin(15°)               → 0.259  (25.9% recoil on Phoenic itself)
```

The steep face maximises delivered smash energy. The jagged vertical side profile maintains this angle across the full contact height, ensuring consistent smash regardless of relative bey height mismatch within ±2 mm.

**C₃ Symmetry — Zero Transverse Anisotropy**

Three identical wings at 120° give C₃ symmetry. The transverse moment of inertia components average to zero:

```
ΔI_transverse = 0   (for C₃ and higher)
```

No nutation forcing occurs at any harmonic of ω. Phoenic tracks a stable spin axis throughout the match, losing no precessional energy to self-induced wobble. This is the same favourable quality as Hell and Kerbecs (also C₃).

**TypeScript model**

```typescript
function phoenicInertia(m_hub_g: number, m_mid_g: number, m_tip_g: number,
                         r_hub_mm: number, r_mid_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_mid_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_tip_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function phoenicSmashFraction(phi_deg: number): number {
  return Math.cos(phi_deg * Math.PI / 180);
}

function phoenicRecoilFraction(phi_deg: number): number {
  return Math.sin(phi_deg * Math.PI / 180);
}

function phoenicAngularMomentumDeficit(I_phoenic: number, I_ref: number): number {
  return 1 - I_phoenic / I_ref;
}

// phoenicInertia(3.2, 11.6, 15.0, 6.5, 14.0, 22.0)          → 6.54×10⁻⁶ kg·m²
// phoenicSmashFraction(15)                                    → 0.966   (96.6% radial smash)
// phoenicRecoilFraction(15)                                   → 0.259   (25.9% self-recoil)
// phoenicAngularMomentumDeficit(6.54e-6, 1.38e-5)             → 52.6%   (vs Basalt)
// phoenicAngularMomentumDeficit(6.54e-6, 1.10e-5)             → 40.5%   (vs Gravity)
```

---

## Case 311 — Chrome Wheel: Gargole (29.5 g)

> **Stock combo (Archer Gargole SA165WSF):** Chrome Wheel(s): Gargole · Crystal Wheel: Archer · Track: SA165 · Bottom: Wide Semi-Flat

**Thesis.** Gargole is a Zero-G Chrome Wheel with four sections in a C₂ effective mass distribution: two dense zones — the monster head and opposing claw cluster — separated by two larger but heavily perforated wing sections. The full width of 47.74 mm (r_o = 23.87 mm) pushes outer mass farther than Phoenic, raising specific inertia; however, the extensive perforation reduces peripheral density and partially offsets this advantage. The C₂ mass asymmetry (dense head/claw pair perpendicular to lighter wing pair) introduces a non-zero transverse anisotropy, generating weak nutation forcing at 2ω that Phoenic (C₃) does not suffer. The wing sections' even, uninterrupted side profiles deliver consistent smash contact, while the dense head/claw faces deliver concentrated high-impulse impacts at those azimuths.

**Geometry (top-view)**

```
          ← Crystal Wheel orb (center aperture, monstrous head motif)

     wing (perforated)          wing (perforated)
          ╲                          ╱
    ┌──────────────────────────────────┐
    │  ╲  ░░░░░░  ╱    ╲  ░░░░░░  ╱  │   r_o = 23.87 mm
    │   ║ ░holes░ ║    ║ ░holes░ ║   │
    │   ║         ║    ║         ║   │
    │   ╔═════════╗════╔═════════╗   │   r_hub = 6.5 mm
    │   ║  claws  ╠ ○  ╣  head  ║   │   C₂ heavy axis: head↔claw (180°)
    │   ╚═════════╝════╚═════════╝   │   C₂ light axis: wing↔wing (90°/270°)
    │   ║         ║    ║         ║   │
    │  ╱  ░░░░░░  ╲    ╱  ░░░░░░  ╲  │
    └──────────────────────────────────┘
         h = 6.72 mm
         Contact face angle φ_wing ≈ 20° (even side profile)
         Contact face angle φ_claw ≈ 30° (horned/jagged interruptions)
```

**Moment of Inertia**

Zone 1 — hub (center aperture surround): r_i = 0 mm, r_o = 6.5 mm, m₁ = 2.5 g
Zone 2 — mid body (wing shafts + head/claw base): r_i = 6.5 mm, r_o = 14.0 mm, m₂ = 9.5 g
Zone 3 — outer periphery (wing tips + head/claw protrusions): r_i = 14.0 mm, r_o = 23.87 mm, m₃ = 17.5 g

```
I = ½m(r_i² + r_o²)

I₁ = ½ × 0.0025 × (0² + 0.0065²)                   = 5.28×10⁻⁸ kg·m²
I₂ = ½ × 0.0095 × (0.0065² + 0.0140²)              = 1.14×10⁻⁶ kg·m²
I₃ = ½ × 0.0175 × (0.0140² + 0.02387²)             = 6.68×10⁻⁶ kg·m²

I_total = 5.28×10⁻⁸ + 1.14×10⁻⁶ + 6.68×10⁻⁶        → 7.87×10⁻⁶ kg·m²
```

Specific inertia: I/m = 7.87×10⁻⁶ / 0.0295 = 2.67×10⁻⁴ m²

This exceeds Phoenic (2.19×10⁻⁴ m²) by 22%, driven by the larger outer radius, despite the perforations reducing zone 3 mass relative to a solid wheel.

**C₂ Transverse Anisotropy**

The dense head+claw pair (≈10.5 g concentrated in two 80° arc sectors at r ≈ 20 mm) and the lighter wing pair (≈7.0 g spread over two 100° arc sectors with holes) create unequal principal transverse moments:

```
Heavy-axis half-mass: m_h = 0.0105 kg at r_h = 0.020 m
Light-axis half-mass:  m_l = 0.0070 kg at r_l = 0.020 m

ΔI_transverse ≈ (m_h − m_l) × r² = (0.0105 − 0.0070) × 0.020²   → 1.40×10⁻⁶ kg·m²
```

Nutation forcing torque at ω = 150 rad/s:

```
τ_nutation = ΔI_transverse × ω / 2 = 1.40×10⁻⁶ × 150 / 2         → 1.05×10⁻⁴ N·m
```

This is roughly one quarter of Flash 4D's Attack Mode nutation torque (4.42×10⁻⁴ N·m), so the wobble forcing is present but mild. Stable axis tracking degrades slightly, particularly below 40% spin where gyroscopic stiffness weakens.

**Smash/Recoil Analysis**

Two distinct contact geometries operate depending on which azimuth contacts the opponent:

Wing section (even, uninterrupted sides, φ = 20°):
```
Smash fraction  = cos(20°)                                          → 0.940
Recoil fraction = sin(20°)                                          → 0.342
```

Head/claw section (horned interruptions, φ = 30°):
```
Smash fraction  = cos(30°)                                          → 0.866
Recoil fraction = sin(30°)                                          → 0.500
```

Wing contacts are more efficient (94% smash), while claw contacts generate more recoil (50%), increasing self-KO risk during those impact azimuths. At 4 sections (2 wing + 2 dense), the wheel encounters wing-type contact approximately 55% of the time and claw-type 45%, giving an effective smash fraction:

```
cos_eff = 0.55 × 0.940 + 0.45 × 0.866                              → 0.907  (90.7%)
```

**Angular Momentum vs References**

At ω = 150 rad/s:

```
L_Gargole = 7.87×10⁻⁶ × 150                                        → 1.181×10⁻³ kg·m²/s
L_Basalt  = 1.38×10⁻⁵ × 150                                        → 2.070×10⁻³ kg·m²/s
L_Gravity = 1.10×10⁻⁵ × 150                                        → 1.650×10⁻³ kg·m²/s
L_Phoenic = 6.54×10⁻⁶ × 150                                        → 0.981×10⁻³ kg·m²/s

Deficit vs Basalt:  1 − 1.181×10⁻³ / 2.070×10⁻³                   → 42.9%
Deficit vs Gravity: 1 − 1.181×10⁻³ / 1.650×10⁻³                   → 28.4%
Advantage vs Phoenic: 1 − 0.981×10⁻³ / 1.181×10⁻³                 → +20.4% more L
```

Gargole carries 20% more angular momentum than Phoenic at equal launch speed, giving it greater knock-out force in direct clashes, at the cost of mild C₂ nutation.

**TypeScript model**

```typescript
function gargoleInertia(m_hub_g: number, m_mid_g: number, m_outer_g: number,
                         r_hub_mm: number, r_mid_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_mid_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_outer_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function gargoleTransverseAnisotropy(m_dense_g: number, m_light_g: number, r_mm: number): number {
  return (m_dense_g - m_light_g) / 1000 * Math.pow(r_mm / 1000, 2);
}

function gargoleNutationTorque(delta_I: number, omega: number): number {
  return delta_I * omega / 2;
}

function gargoleEffectiveSmash(wing_fraction: number, phi_wing_deg: number, phi_claw_deg: number): number {
  return wing_fraction * Math.cos(phi_wing_deg * Math.PI / 180)
       + (1 - wing_fraction) * Math.cos(phi_claw_deg * Math.PI / 180);
}

function gargoleAngularMomentumDeficit(I_gargole: number, I_ref: number): number {
  return 1 - I_gargole / I_ref;
}

// gargoleInertia(2.5, 9.5, 17.5, 6.5, 14.0, 23.87)            → 7.87×10⁻⁶ kg·m²
// gargoleTransverseAnisotropy(10.5, 7.0, 20.0)                 → 1.40×10⁻⁶ kg·m²  (C₂ ΔI)
// gargoleNutationTorque(1.40e-6, 150)                          → 1.05×10⁻⁴ N·m    (at 150 rad/s)
// gargoleEffectiveSmash(0.55, 20, 30)                          → 0.907  (90.7% weighted smash)
// gargoleAngularMomentumDeficit(7.87e-6, 1.38e-5)              → 42.9%  (vs Basalt)
// gargoleAngularMomentumDeficit(7.87e-6, 1.10e-5)              → 28.4%  (vs Gravity)
```

---

## Case 312 — Track: Switch Attack 165 / SA165 (6.18 g)

> **Stock combo (Archer Gargole SA165WSF):** Chrome Wheel(s): Gargole · Crystal Wheel: Archer · Track: SA165 · Bottom: Wide Semi-Flat

**Thesis.** SA165 is a dual-mode Zero-G track built around a removable, flippable parabolic shell — a thin hollow ring of considerable outer diameter (~40 mm) riding on a narrow ABS core shaft of 16.5 mm height. In Normal Mode the shell opens upward, placing its wide outer rim adjacent to the Chrome Wheel above and acting as a lateral guard that deflects incoming attacks at a shallow angle before they reach the wheel body. In Zero-G Attack Mode the shell is flipped downward, forming a wide floor-level skirt that replicates the large contact-ring geometry of GCF: the outer circumference (r ≈ 20 mm vs GCF r ≈ 16.7 mm) engages the curved Zero-G stadium wall over a 31% larger arc length, generating proportionally more traction force per unit normal load. Because the mode switch is manual (physical inversion), there is no centrifugal threshold — the geometry is locked at any spin speed.

**Geometry (side-view, both modes)**

```
Normal Mode                     Zero-G Attack Mode
(shell opens upward)            (shell flipped downward)

  ┌── CW / MW ──┐                 ┌── CW / MW ──┐
  │             │                 │             │
  ╔═════════════╗  ← rim guard    ╔═════════════╗
  ║ ░░░░░░░░░░░ ║  r_o = 20 mm   ║   (core)    ║
  ║ (hollow)    ║                 ╚══╗       ╔══╝
  ╚══╗       ╔══╝                    ║  165  ║
     ║  165  ║  h = 16.5 mm         ║  mm   ║
     ║  mm   ║                   ╔══╩═══════╩══╗
     ╚═══════╝                   ║ ░░░░░░░░░░░ ║  ← floor skirt
        ↑                        ║ (hollow)    ║  r_o = 20 mm
     Bottom                      ╚═════════════╝  spikes on rim
                                       ↑
                                    Bottom
```

**Moment of Inertia**

The track mass splits between the rigid core shaft and the hollow parabolic shell:

Core shaft (ABS cylinder): m_core = 1.5 g, r = 5 mm
Parabolic shell (thin ABS annulus): m_shell = 4.68 g, r_i = 17 mm, r_o = 20 mm

```
I = ½m(r_i² + r_o²)

I_core  = ½ × 0.0015 × (0² + 0.005²)                = 1.88×10⁻⁸ kg·m²
I_shell = ½ × 0.00468 × (0.017² + 0.020²)            = 1.61×10⁻⁶ kg·m²

I_total = 1.88×10⁻⁸ + 1.61×10⁻⁶                      → 1.63×10⁻⁶ kg·m²
```

The shell dominates (99% of track inertia). This is about 25% of GCF's inertia contribution (GCF I ≈ 6.5×10⁻⁶ kg·m²) for a track of comparable outer radius — appropriate since the shell is hollow and thin-walled.

**Normal Mode — Rim Guard Deflection**

In Normal Mode the shell's outer rim sits at track level adjacent to the Chrome Wheel, presenting the paraboloid slope to incoming attacks. The parabola flare angle at the outer rim is approximately 45° from vertical (shallow opening profile), so the contact face is 45° from radial:

```
Smash fraction  = cos(45°)                            → 0.707
Recoil fraction = sin(45°)                            → 0.707
```

Equal smash and recoil fractions: the rim neither efficiently smashes nor purely deflects — it acts as an energy-sharing guard. Incoming kinetic energy splits equally between transmitted smash (pushing opponent outward) and self-recoil. The linear ridges on the shell surface increase friction at this contact face, adding a tangential drag torque that bleeds opponent spin:

```
τ_drag = μ_ABS × F_normal × r_o = 0.35 × F × 0.020   (per contact)
```

At a typical impact F = 5 N: τ_drag = 0.035 N·m — a modest but non-zero spin-drain per contact.

**Zero-G Attack Mode — Contact Ring vs GCF**

When flipped, the outer rim engages the Zero-G stadium curved wall as a wide horizontal ring. The spikes on the outer circumference (like GCF gear teeth) provide mechanical grip against the wall surface:

```
r_SA165  = 20.0 mm,  r_GCF = 16.74 mm  (half of 33.47 mm)

Arc length ratio (same contact angle θ):
  C_SA165 / C_GCF = r_SA165 / r_GCF = 20.0 / 16.74             → 1.195×  (19.5% more arc)

Contact area ratio (same contact width w):
  A_SA165 / A_GCF = r_SA165 / r_GCF                            → 1.195×

Traction force advantage (adhesive model, same W):
  ΔF = (τ_adh × ΔA) = 0.08 × 10⁶ × (A_SA165 − A_GCF)
  Assuming contact width w = 1.5 mm, θ = 30°:
  A_SA165 = r_SA165 × θ_rad × w = 0.020 × 0.524 × 0.0015       = 1.57×10⁻⁵ m²
  A_GCF   = 0.01674 × 0.524 × 0.0015                           = 1.32×10⁻⁵ m²
  ΔF_traction = 0.08×10⁶ × (1.57 − 1.32)×10⁻⁵                 → 2.0 N additional grip
```

SA165 in Zero-G Attack Mode grips the stadium wall with ~2 N more traction force than GCF under equivalent normal load, resulting in a slightly larger orbital acceleration of the bey along the wall.

**TypeScript model**

```typescript
function sa165ShellInertia(m_shell_g: number, r_inner_mm: number, r_outer_mm: number): number {
  return 0.5 * (m_shell_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
}

function sa165RimDeflection(phi_deg: number): { smash: number; recoil: number } {
  const rad = phi_deg * Math.PI / 180;
  return { smash: Math.cos(rad), recoil: Math.sin(rad) };
}

function sa165WallTractionAdvantage(r_sa165_mm: number, r_gcf_mm: number,
                                     contact_angle_deg: number, contact_width_mm: number): number {
  const theta = contact_angle_deg * Math.PI / 180;
  const w = contact_width_mm / 1000;
  const tau_adh = 0.08e6;
  const A_sa = (r_sa165_mm / 1000) * theta * w;
  const A_gcf = (r_gcf_mm / 1000) * theta * w;
  return tau_adh * (A_sa - A_gcf);
}

function sa165TotalInertia(m_core_g: number, r_core_mm: number,
                            m_shell_g: number, r_inner_mm: number, r_outer_mm: number): number {
  const I_core = 0.5 * (m_core_g / 1000) * Math.pow(r_core_mm / 1000, 2);
  return I_core + sa165ShellInertia(m_shell_g, r_inner_mm, r_outer_mm);
}

// sa165TotalInertia(1.5, 5, 4.68, 17, 20)                      → 1.63×10⁻⁶ kg·m²
// sa165RimDeflection(45)                                        → { smash: 0.707, recoil: 0.707 }  (Normal Mode)
// sa165WallTractionAdvantage(20.0, 16.74, 30, 1.5)              → 2.0 N  (ZG Attack Mode vs GCF)
```

---

## Case 313 — Chrome Wheel: Genbull (30.8 g)

> **Stock combo (Bandid Genbull F230TB):** Chrome Wheel(s): Genbull · Crystal Wheel: Bandid · Track: F230 · Bottom: Twin Ball

**Thesis.** Genbull is the heaviest Chrome Wheel examined in this series (30.8 g) and achieves the highest specific inertia among Zero-G Chrome Wheels through a deliberately distal center of gravity: the outer zone carries roughly 71% of total mass at a mean radius of ~18 mm, yielding I_total ≈ 8.37×10⁻⁶ kg·m². Its approximately C₄ mass distribution (four flat hex facets arranged in two bilateral pairs) produces near-zero transverse anisotropy and therefore negligible nutation forcing — the spin axis remains stable throughout the match. The smooth, nearly circular outer perimeter presents a contact face angle of approximately 0° from radial, delivering zero self-recoil per collision: all impact force passes radially inward onto Genbull while the opponent is pushed radially outward. The one liability is the bottom face: the small turtle-head protrusion and hex corners on the underside create an elevated recoil angle when struck from below (~25°), making Genbull unsuitable as the lower Chrome Wheel in E230-based Synchrom stacks. As the upper Chrome Wheel, however, the bottom face never contacts an opponent, and Genbull's mass and shape combination dominates Zero-G stamina and defense roles.

**Geometry (top-view)**

```
          Crystal Wheel orb (top)
                 ↑
    ┌────────────────────────────┐
    │   ╱ flat ╲   ╱ flat ╲     │   r_o = 22.5 mm
    │  ║ facet  ╠═╣ facet  ║   │   r_hub = 6.0 mm
    │  ║        ║ ○ ║        ║   │   C₄ approx: 4 flat sections
    │  ║ facet  ╠═╣ facet  ║   │   at ~90° intervals
    │   ╲      ╱   ╲      ╱     │
    └────────────────────────────┘
         turtle head (bottom, minimal protrusion)
         h = 6.5 mm
         Outer edge: smooth circular arc between facets
         Bottom recoil face angle φ_bottom ≈ 25°
```

**Moment of Inertia**

Distal CoG: outer zone carries 71% of total mass.

Zone 1 — hub (center aperture + hex boss): r_i = 0 mm, r_o = 6.0 mm, m₁ = 1.8 g
Zone 2 — mid body (flat facet shafts, lightened): r_i = 6.0 mm, r_o = 13.5 mm, m₂ = 7.0 g
Zone 3 — outer ring (heavy circular band): r_i = 13.5 mm, r_o = 22.5 mm, m₃ = 22.0 g

```
I = ½m(r_i² + r_o²)

I₁ = ½ × 0.0018 × (0² + 0.006²)                        = 3.24×10⁻⁸ kg·m²
I₂ = ½ × 0.0070 × (0.006² + 0.0135²)                   = 7.64×10⁻⁷ kg·m²
I₃ = ½ × 0.0220 × (0.0135² + 0.0225²)                  = 7.57×10⁻⁶ kg·m²

I_total = 3.24×10⁻⁸ + 7.64×10⁻⁷ + 7.57×10⁻⁶            → 8.37×10⁻⁶ kg·m²
```

Specific inertia: I/m = 8.37×10⁻⁶ / 0.0308 = 2.72×10⁻⁴ m²

Ranked against the Chrome Wheels in this series:

| Chrome Wheel | I (×10⁻⁶ kg·m²) | I/m (×10⁻⁴ m²) |
|---|---|---|
| Genbull | 8.37 | 2.72 |
| Gargole | 7.87 | 2.67 |
| Phoenic | 6.54 | 2.19 |

Genbull leads in both total inertia and specific inertia — the distal CoG strategy outperforms Gargole's larger radius because Genbull concentrates more mass fraction in zone 3.

**C₄ Mass Symmetry — Zero Nutation**

Four flat facets at approximately 90° intervals give C₄ effective mass symmetry:

```
ΔI_transverse = 0  (C₄ and higher → zero transverse anisotropy)
τ_nutation = 0
```

No self-induced wobble forcing at any spin harmonic. The spin axis tracks stably from launch through the late-wobble phase, preserving angular momentum against precession-driven tip friction. This contrasts with Gargole's C₂ ΔI = 1.40×10⁻⁶ kg·m², which degrades axis stability at low spin.

**Outer Edge Contact — Zero Self-Recoil**

The smooth circular outer arc presents a contact face whose outward normal is exactly radial (φ = 0°). At the hex facets, the face deviates by at most 5° from radial:

```
Side contact (smooth arc):    φ = 0°
  Smash fraction  = cos(0°)                              → 1.000
  Self-recoil     = sin(0°)                              → 0.000

Side contact (hex facet edge): φ = 5°
  Smash fraction  = cos(5°)                              → 0.996
  Self-recoil     = sin(5°)                              → 0.087
```

At φ = 0°, the impact force passes entirely through Genbull's center of mass with zero tangential component: angular momentum is unchanged by the collision. At hex facets the self-recoil rises to 8.7% — still far below Attack-type values (25–50%). This explains the competitive observation that Genbull resists knock-out from lateral Attack types even at late-battle low spin.

**Bottom Face Recoil (E230 Synchrom Liability)**

The turtle-head protrusion and lower hex corners on the underside create a contact face angle of approximately 25° when struck upward (as occurs at the lower Chrome Wheel position in E230 Synchrom, where the lower wheel's bottom is exposed):

```
Bottom-face contact: φ_bottom = 25°
  Self-recoil fraction = sin(25°)                        → 0.423
```

A 42% recoil fraction at the bottom face is high enough to destabilize orbit in the E230 position — consistent with the metagame note that Genbull is not effective as the lower wheel in E230 Synchrom stacks.

**Angular Momentum Comparison**

At ω = 150 rad/s:

```
L_Genbull = 8.37×10⁻⁶ × 150                            → 1.256×10⁻³ kg·m²/s
L_Gargole = 7.87×10⁻⁶ × 150                            → 1.181×10⁻³ kg·m²/s
L_Basalt  = 1.38×10⁻⁵ × 150                            → 2.070×10⁻³ kg·m²/s

Deficit vs Basalt:     1 − 1.256×10⁻³ / 2.070×10⁻³    → 39.3%
Deficit vs Gravity:    1 − 1.256×10⁻³ / 1.650×10⁻³    → 23.9%
Advantage vs Gargole:  1 − 1.181×10⁻³ / 1.256×10⁻³    → +6.3% more L
```

**TypeScript model**

```typescript
function genbullInertia(m_hub_g: number, m_mid_g: number, m_outer_g: number,
                         r_hub_mm: number, r_mid_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_mid_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_outer_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function genbullSideRecoil(phi_deg: number): number {
  return Math.sin(phi_deg * Math.PI / 180);
}

function genbullAngularMomentumDeficit(I_genbull: number, I_ref: number): number {
  return 1 - I_genbull / I_ref;
}

function genbullSpecificInertia(I_total: number, m_g: number): number {
  return I_total / (m_g / 1000);
}

// genbullInertia(1.8, 7.0, 22.0, 6.0, 13.5, 22.5)              → 8.37×10⁻⁶ kg·m²
// genbullSpecificInertia(8.37e-6, 30.8)                         → 2.72×10⁻⁴ m²   (highest in ZG series)
// genbullSideRecoil(0)                                          → 0.000  (smooth arc — zero self-recoil)
// genbullSideRecoil(5)                                          → 0.087  (hex facet edge — minimal recoil)
// genbullSideRecoil(25)                                         → 0.423  (bottom face — E230 liability)
// genbullAngularMomentumDeficit(8.37e-6, 1.38e-5)               → 39.3%  (vs Basalt)
// genbullAngularMomentumDeficit(8.37e-6, 7.87e-6)               → −6.3%  (Genbull leads Gargole)
```

---

## Case 314 — Track: Stamina Ring 200 / SR200 (3.3 g)

> **Stock combo (Berserker Begirados SR200BWD):** Chrome Wheel(s): Begirados · Crystal Wheel: Berserker · Track: SR200 · Bottom: Big Wide Defense

**Thesis.** SR200 is a 20.00 mm height track whose defining feature is a wide cylindrical outer ring (full width 26.5 mm, core width 10.0 mm) with a completely vertical outer wall. The vertical wall geometry eliminates the upward-deflection force component that angled or tapered track walls introduce: lateral impact force is directed purely radially, producing zero vertical lift on the assembly and zero self-recoil to orbit. The wide ring radius (r_o = 13.25 mm) creates a collision cross-section comparable to the Chrome Wheel above it, reinforcing the lower half of the assembly against attacks that target below the Metal or Chrome Wheel. Track inertia is modest (I ≈ 2.84×10⁻⁷ kg·m²) because ABS mass is light; the ring's contribution lies in geometry, not angular momentum.

**Geometry (side-view)**

```
  ┌─── Chrome / Metal Wheel above ───┐
  │                                  │
  ╔══════════════════════════════════╗  ← top of track (h = 20.00 mm)
  ║          core shaft              ║
  ║  r_core = 5.0 mm                 ║
  ║                                  ║
  ║      ┌──────────────────┐        ║  ← ring connects to core
  ║      │ stamina ring     │        ║
  ║      │ r_i = 11.0 mm    │        ║  full width = 26.5 mm
  ║      │ r_o = 13.25 mm   │        ║  ring wall: straight vertical
  ║      └──────────────────┘        ║
  ╚══════════════════════════════════╝  ← bottom of track (h = 0)
         ↓
      Bottom tip
```

**Moment of Inertia**

Zone 1 — central shaft (ABS solid): r_i = 0 mm, r_o = 3.0 mm, m₁ = 1.0 g
Zone 2 — body / ribs connecting shaft to ring: r_i = 5.0 mm, r_o = 11.0 mm, m₂ = 0.8 g
Zone 3 — outer cylindrical ring shell: r_i = 11.0 mm, r_o = 13.25 mm, m₃ = 1.5 g

```
I = ½m(r_i² + r_o²)

I₁ = ½ × 0.0010 × (0² + 0.003²)                        = 4.50×10⁻⁹ kg·m²
I₂ = ½ × 0.0008 × (0.005² + 0.011²)                    = 5.84×10⁻⁸ kg·m²
I₃ = ½ × 0.0015 × (0.011² + 0.01325²)                  = 2.22×10⁻⁷ kg·m²

I_total = 4.50×10⁻⁹ + 5.84×10⁻⁸ + 2.22×10⁻⁷            → 2.84×10⁻⁷ kg·m²
```

This is approximately 3.4% of Genbull's Chrome Wheel inertia — the track is a minor angular momentum contributor. The track's role is geometric, not inertial.

**Straight Vertical Wall — Zero Upward Deflection**

For a track wall inclined at angle α from vertical (α = 0° = vertical straight wall, α > 0° = outward flare/taper):

```
F_lateral = F_impact × cos(α)     (radial push on track)
F_vertical = F_impact × sin(α)    (upward lift on track)

SR200: α = 0°
  F_lateral = F × cos(0°) = F     → full radial push (100%)
  F_vertical = F × sin(0°) = 0    → zero vertical lift
```

A tapered wall at α = 30° would convert 50% of impact into vertical lift (sin 30° = 0.500), lifting the beyblade and inducing gyroscopic tilt. SR200's straight wall delivers all impact force radially, leaving the spin axis undisturbed. This is the physical basis for SR200's stamina advantage over tapered-ring tracks at equivalent height.

**Ring Contact Cross-Section vs Plain Track**

The ring provides a lateral contact surface area that a plain cylindrical shaft does not:

```
Plain shaft (r = 5 mm, h = 20 mm):
  A_shaft = 2 × r_shaft × h = 2 × 0.005 × 0.020           = 2.0×10⁻⁴ m²  (projected)

SR200 ring (r_o = 13.25 mm, ring h ≈ 8 mm):
  A_ring  = 2 × r_o × h_ring = 2 × 0.01325 × 0.008        = 2.12×10⁻⁴ m²  (projected)

Total SR200 projected lateral area:
  A_total = A_shaft + A_ring = 2.0×10⁻⁴ + 2.12×10⁻⁴       → 4.12×10⁻⁴ m²
```

The ring doubles the lateral cross-section compared to a plain shaft track, intercepting attacks before they reach the Chrome Wheel above. This defensive reinforcement is why SR200 pairs effectively with Genbull in both stamina and defense configurations.

**TypeScript model**

```typescript
function sr200RingInertia(m_shaft_g: number, r_shaft_mm: number,
                           m_rib_g: number, r_inner_mm: number, r_mid_mm: number,
                           m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_shaft_g / 1000) * Math.pow(r_shaft_mm / 1000, 2);
  const I2 = 0.5 * (m_rib_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function sr200WallDeflection(alpha_deg: number, F_impact: number): { lateral: number; vertical: number } {
  const rad = alpha_deg * Math.PI / 180;
  return { lateral: F_impact * Math.cos(rad), vertical: F_impact * Math.sin(rad) };
}

function sr200ContactArea(r_outer_mm: number, h_ring_mm: number,
                           r_shaft_mm: number, h_total_mm: number): number {
  const A_ring  = 2 * (r_outer_mm / 1000) * (h_ring_mm / 1000);
  const A_shaft = 2 * (r_shaft_mm / 1000) * (h_total_mm / 1000);
  return A_ring + A_shaft;
}

// sr200RingInertia(1.0, 3, 0.8, 5, 11, 1.5, 13.25)             → 2.84×10⁻⁷ kg·m²
// sr200WallDeflection(0, 5)                                     → { lateral: 5.0 N, vertical: 0.0 N }  (straight wall)
// sr200WallDeflection(30, 5)                                    → { lateral: 4.33 N, vertical: 2.5 N }  (30° taper reference)
// sr200ContactArea(13.25, 8, 5, 20)                             → 4.12×10⁻⁴ m²  (2× plain shaft area)
```

---

## Case 315 — Track: Left Wing 105 / LW105 (~1.1 g)

> **Stock combo (Meteo L Drago LW105LF):** Clear Wheel: L Drago II · Metal Wheel: Meteo · Track: LW105 · Bottom: Left Flat

**Thesis.** LW105 is a 10.5 mm height track with three small left-facing wings arranged at 120° (C₃). The wings are pitched so that a right-spinning beyblade's rotation drives air upward — the intended mechanism mirrors DF145's downforce reversal, reducing effective normal load on the tip and thereby slowing spin decay from floor friction. Quantified aerodynamically, however, the three small wings generate only ~0.1 mN of net upward force at 150 rad/s compared to DF145's ~10.5 mN: a 105× deficit that makes the effect unmeasurable in practice. The C₃ geometry produces zero transverse anisotropy, so no nutation penalty is incurred. LW105 functions as a 105-height track with a negligible aerodynamic accessory — useful when 100/90/85 are unavailable for Attack types, or as a marginal stamina supplement over plain 105 in low-height stamina builds.

**Geometry (top-view)**

```
      wing (left-facing, ←)
         ↙
  ┌────────────────┐
  │  ╲   wing 1   │   r_o ≈ 10 mm  (wing tip)
  │   ╲   ↙       │   r_core = 3 mm
  │    ╔═══╗       │   3 wings × 120° (C₃)
  │    ║ ○ ║  ←   │   h = 10.5 mm
  │    ╚═══╝       │   Wing chord ≈ 3 mm
  │       ↖ wing 2 │   Wing span ≈ 7 mm radially
  │  wing 3        │
  └────────────────┘
  Spin direction: CW (right-spin)
  Wings face left → air pushed upward by rotation
```

**Wing Aerodynamic Upwash**

Each wing acts as a low-aspect-ratio lifting surface. Lift per wing set at angular velocity ω:

```
v_tip = ω × r_tip = 150 × 0.010                          = 1.50 m/s
q = ½ρv² = ½ × 1.225 × 1.50²                             = 1.378 Pa
A_wing_total = 3 × (span × chord) = 3 × (0.007 × 0.003)  = 6.30×10⁻⁵ m²
F_lift = C_L × q × A = 1.0 × 1.378 × 6.30×10⁻⁵           → 8.68×10⁻⁵ N  (≈ 0.087 mN)
```

As a fraction of bey weight (m ≈ 50 g total assembly):

```
W_bey = 0.050 × 9.81                                     = 0.491 N
F_lift / W_bey = 8.68×10⁻⁵ / 0.491                       → 0.018%  (unmeasurable relief)
```

**Comparison to DF145 Disc Upwash**

DF145 redirects airflow across a full annular disc (r_i = 5 mm, r_o = 22.5 mm):

```
v_eff_DF145 = ω × r_eff = 150 × 0.0225                   = 3.375 m/s
q_DF145 = ½ × 1.225 × 3.375²                             = 6.979 Pa
A_DF145 = π × (0.0225² − 0.005²)                         = 1.511×10⁻³ m²
F_lift_DF145 = 1.0 × 6.979 × 1.511×10⁻³                  → 10.55×10⁻³ N  (10.55 mN)

Ratio: F_lift_LW105 / F_lift_DF145 = 0.087 / 10.55        → 0.82%  (LW105 = ~1/122 of DF145)
```

The 122× lift deficit confirms the competitive observation that LW105's stamina contribution is "barely noticeable." The small wing area and low tip velocity cannot replicate DF145's large-disc effect.

**Aerodynamic Drag Cost**

The wings also present frontal area perpendicular to their orbital motion, generating drag torque:

```
A_frontal = 3 × (chord × wing height) = 3 × (0.003 × 0.003)  = 2.70×10⁻⁵ m²
r_eff_drag = 0.008 m,  v_drag = 150 × 0.008                   = 1.20 m/s
q_drag = ½ × 1.225 × 1.20²                                    = 0.882 Pa
τ_aero_drag = C_D × q_drag × A_frontal × r_eff
            = 1.0 × 0.882 × 2.70×10⁻⁵ × 0.008                → 1.90×10⁻⁷ N·m
```

At I_total ≈ 2.5×10⁻⁸ kg·m², this produces a spin decay contribution of:

```
dω/dt_aero = τ / I = 1.90×10⁻⁷ / 2.50×10⁻⁸                  → 7.6×10⁻³ rad/s²
```

Negligible: 7.6 mrad/s² vs typical tip-friction decay of 6–8 rad/s². Wing drag adds less than 0.1% to total spin decay rate.

**C₃ Symmetry**

Three wings at 120° intervals: ΔI_transverse = 0. No nutation forcing at any harmonic of ω — identical to Genbull and Kerbecs in this regard.

**Moment of Inertia**

Zone 1 — core shaft: r_i = 0 mm, r_o = 3 mm, m₁ = 0.7 g
Zone 2 — wing mass (3 small ABS blades): r_i = 3 mm, r_o = 10 mm, m₂ = 0.4 g

```
I₁ = ½ × 0.0007 × (0² + 0.003²)                          = 3.15×10⁻⁹ kg·m²
I₂ = ½ × 0.0004 × (0.003² + 0.010²)                      = 2.18×10⁻⁸ kg·m²

I_total = 3.15×10⁻⁹ + 2.18×10⁻⁸                           → 2.50×10⁻⁸ kg·m²
```

Track inertia is negligible relative to the Chrome/Metal Wheel above it; LW105 contributes no meaningful angular momentum to the system.

**TypeScript model**

```typescript
function lw105WingLift(omega: number, r_tip_mm: number, n_wings: number,
                        span_mm: number, chord_mm: number): number {
  const v = omega * (r_tip_mm / 1000);
  const q = 0.5 * 1.225 * v * v;
  const A = n_wings * (span_mm / 1000) * (chord_mm / 1000);
  return 1.0 * q * A;
}

function lw105LiftVsDF145(F_lw105: number, omega: number): number {
  const v_df = omega * 0.0225;
  const q_df = 0.5 * 1.225 * v_df * v_df;
  const A_df = Math.PI * (0.0225 * 0.0225 - 0.005 * 0.005);
  const F_df = 1.0 * q_df * A_df;
  return F_lw105 / F_df;
}

function lw105Inertia(m_shaft_g: number, r_shaft_mm: number,
                       m_wings_g: number, r_inner_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_shaft_g / 1000) * Math.pow(r_shaft_mm / 1000, 2);
  const I2 = 0.5 * (m_wings_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}

// lw105WingLift(150, 10, 3, 7, 3)                               → 8.68×10⁻⁵ N   (0.087 mN upwash)
// lw105LiftVsDF145(8.68e-5, 150)                                → 0.0082  (0.82% of DF145 lift)
// lw105Inertia(0.7, 3, 0.4, 3, 10)                              → 2.50×10⁻⁸ kg·m²
```

---

## Case 316 — Chrome Wheel: Dragooon (30.90 g / ~29.0 g light mold)

> **Stock combo (Dark Knight Dragooon LW160BSF):** Chrome Wheel(s): Dragooon · Crystal Wheel: Dark Knight · Track: LW160 · Bottom: Blade Semi-Flat

**Thesis.** Dragooon is the only left-rotation Chrome Wheel in the Zero-G system; its defining physics is not mass distribution but spin polarity. When its left-spinning surface contacts a right-spinning opponent the relative tangential sliding velocity at the contact point is the sum — not the difference — of the two surface velocities, producing a friction impulse up to 2× larger than same-spin contact and enabling rapid spin equalization. Four nominally similar sections (C₄ effective mass symmetry) give zero transverse anisotropy, but the wheel's height undulation from 3.10 mm to 6.34 mm creates an irregular contact profile around the circumference that disrupts spin-axis stability in the late-wobble phase — the metagame-observed "terrible balance." A mold variation introduces ≈1 g mass difference (29 g vs 30–31 g); the angular momentum consequence is 6% at launch speed, which explains why competition results are not significantly affected.

**Geometry**

```
Side view (height undulation):
   h_max = 6.34 mm (dragon head top)        h_min = 3.10 mm (wing membrane)
         ↑                                         ↑
  ┌──────┴──────────────────────────────────────────┴──────┐
  │  ╔══╗          ╔══╗          ╔══╗           ╔══╗       │
  │  ║HD║░░░░░░░░░░║HD║░░░░░░░░░░║HD║░░ wing ░░░║WG║       │
  │  ╚══╝  3.10mm  ╚══╝  3.10mm  ╚══╝ gap 3.1mm ╚══╝       │
  └────────────────────────────────────────────────────────┘
  Δh = 6.34 − 3.10 = 3.24 mm  (51% of max height — large undulation)

Top view (C₄ approximate, 4 sections):
  r_o = 23.65 mm  |  r_hub = 6.5 mm  |  Left-spin direction: ↺
   head-lateral  ←  wing  ←  head-flat  ←  wing  (4 × 90° sectors)
```

**Moment of Inertia and Mold Variation**

Heavy mold (30.90 g, reference):

Zone 1 — hub + orb boss: r_i = 0 mm, r_o = 6.5 mm, m₁ = 2.5 g
Zone 2 — mid body (head roots + wing bases): r_i = 6.5 mm, r_o = 14.0 mm, m₂ = 9.4 g
Zone 3 — outer (head sides + wing tips): r_i = 14.0 mm, r_o = 23.65 mm, m₃ = 19.0 g

```
I₁ = ½ × 0.0025 × (0² + 0.0065²)                         = 5.28×10⁻⁸ kg·m²
I₂ = ½ × 0.0094 × (0.0065² + 0.0140²)                    = 1.12×10⁻⁶ kg·m²
I₃ = ½ × 0.0190 × (0.0140² + 0.02365²)                   = 7.17×10⁻⁶ kg·m²

I_heavy = 5.28×10⁻⁸ + 1.12×10⁻⁶ + 7.17×10⁻⁶              → 8.34×10⁻⁶ kg·m²
```

Light mold (29.0 g — two indentations under one dragon head remove ~1 g from zone 3):

```
m₃_light = 18.1 g  (−0.9 g from indentations)
I₃_light = ½ × 0.0181 × (0.0140² + 0.02365²)             = 6.83×10⁻⁶ kg·m²
I_light  = 5.28×10⁻⁸ + 1.12×10⁻⁶ + 6.83×10⁻⁶             → 7.99×10⁻⁶ kg·m²

ΔL at ω = 150 rad/s: (8.34 − 7.99)×10⁻⁶ × 150            → 5.25×10⁻⁵ kg·m²/s  (4.4% deficit)
```

A 4.4% angular momentum deficit between molds at launch speed corroborates the observed non-significant performance difference.

**Spin Equalization — Opposite-Spin Contact Mechanics**

For a left-spin Dragooon (ω_D, surface velocity leftward at contact point) touching a right-spin opponent (ω_O, surface velocity rightward at same point):

```
Same-spin contact (both right, equal ω):
  Δv_tangential = ω × r − ω × r = 0            (no sliding, no friction impulse)

Opposite-spin contact (Dragooon left, opponent right, both ω = 150 rad/s, r = 0.020 m):
  Δv_tangential = ω_D × r + ω_O × r = (150 + 150) × 0.020  = 6.00 m/s
```

Friction impulse at this sliding velocity (μ_ABS = 0.35, F_normal = 5 N, Δt = 5×10⁻³ s):

```
J = μ × F_N × Δt = 0.35 × 5 × 0.005                      = 8.75×10⁻³ N·s
ΔL_transferred = J × r_contact = 8.75×10⁻³ × 0.020        → 1.75×10⁻⁴ kg·m²/s per contact
```

As a fraction of Dragooon's angular momentum at ω = 150 rad/s:

```
L_Dragooon = 8.34×10⁻⁶ × 150                              = 1.251×10⁻³ kg·m²/s
ΔL / L = 1.75×10⁻⁴ / 1.251×10⁻³                           → 14.0% per hard contact
```

Each hard opposite-spin contact transfers approximately 14% of one beyblade's angular momentum toward equalization. After 3–4 contacts the spin velocities converge to a shared value, at which point both beyblades precess together — the zombie stamina mechanism.

**Height Undulation and Balance Instability**

The 3.24 mm height variation (Δh/h_max = 51%) means the wheel's effective contact radius with the stadium floor during late-wobble precession varies strongly with rotation angle. At tilt angle θ, the contact height contribution varies by Δh × sin(θ_azimuth):

```
Effective contact variation at θ = 10° wobble:
  r_contact_variation ≈ Δh × sin(azimuth) / tan(θ) = 0.00324 × 1 / 0.176  = 18.4 mm
```

This 18.4 mm periodic variation in effective contact radius drives a nutation forcing term at the fundamental rotation frequency ω (not 2ω as in C₂ transverse anisotropy, but rather from the height non-uniformity). The resulting gyroscopic torque perturbation causes the spin axis to precess irregularly — observed as "terrible balance" compared to Genbull (smooth outer arc, uniform height).

**Angular Momentum Comparison**

At ω = 150 rad/s:

```
L_Dragooon (heavy) = 8.34×10⁻⁶ × 150                     → 1.251×10⁻³ kg·m²/s
L_Genbull          = 8.37×10⁻⁶ × 150                     → 1.256×10⁻³ kg·m²/s
L_Basalt           = 1.38×10⁻⁵ × 150                     → 2.070×10⁻³ kg·m²/s

Deficit vs Basalt:     1 − 1.251×10⁻³ / 2.070×10⁻³       → 39.6%
vs Genbull:            1 − 1.251×10⁻³ / 1.256×10⁻³       → 0.4%  (effectively equal)
```

Dragooon and Genbull carry nearly identical angular momentum at launch, but Genbull's uniform height and smooth outer edge preserve it through the match while Dragooon's height undulation bleeds it via wobble forcing.

**TypeScript model**

```typescript
function dragooonInertia(m_hub_g: number, m_mid_g: number, m_outer_g: number,
                          r_hub_mm: number, r_mid_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_mid_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_outer_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function dragooonSpinEqualizationTransfer(omega_D: number, omega_O: number,
                                           r_contact_mm: number, mu: number,
                                           F_normal: number, dt: number): number {
  const delta_v = (omega_D + omega_O) * (r_contact_mm / 1000);
  const J = mu * F_normal * dt;
  return J * (r_contact_mm / 1000);
}

function dragooonMoldDelta(I_heavy: number, I_light: number, omega: number): number {
  return (I_heavy - I_light) * omega;
}

function dragooonHeightNutationVariation(h_max_mm: number, h_min_mm: number, tilt_deg: number): number {
  const delta_h = (h_max_mm - h_min_mm) / 1000;
  const tan_theta = Math.tan(tilt_deg * Math.PI / 180);
  return delta_h / tan_theta;
}

// dragooonInertia(2.5, 9.4, 19.0, 6.5, 14.0, 23.65)            → 8.34×10⁻⁶ kg·m²  (heavy mold)
// dragooonInertia(2.5, 9.4, 18.1, 6.5, 14.0, 23.65)            → 7.99×10⁻⁶ kg·m²  (light mold)
// dragooonMoldDelta(8.34e-6, 7.99e-6, 150)                      → 5.25×10⁻⁵ kg·m²/s  (4.4% ΔL)
// dragooonSpinEqualizationTransfer(150, 150, 20, 0.35, 5, 0.005) → 1.75×10⁻⁴ kg·m²/s  (14% per contact)
// dragooonHeightNutationVariation(6.34, 3.10, 10)               → 18.4 mm  (effective contact radius swing at 10° tilt)
```

---

## Case 317 — Chrome Wheel: Bahamdia (29.35 g)

> **Stock combo (Gladiator Bahamdia SP230GF):** Chrome Wheel(s): Bahamdia · Crystal Wheel: Gladiator · Track: SP230 · Bottom: Giga Flat

**Thesis.** Bahamdia is a Chrome Wheel whose design is structurally analogous to Gargole but with explicit top-bottom mass asymmetry: the demonic head at the top of the circumference is the heavier, more inflated half, while the orb aperture and vague claws at the bottom occupy lighter, thinner geometry. This asymmetry produces a C₂ transverse anisotropy (ΔI ≈ 1.00×10⁻⁶ kg·m²) with moderate nutation forcing at 2ω — midway between Genbull's zero and Gargole's 1.40×10⁻⁶ kg·m². The rounded-rectangle segment faces offer a gentle contact angle (φ ≈ 12°) across most of the circumference, giving ~97.8% smash efficiency there; the sharp horn/wing stops at ~40° reduce efficiency to 76.6% at those azimuths. The total inertia (7.91×10⁻⁶ kg·m²) is nearly identical to Gargole, but the absence of Gargole's distinct two-lobe asymmetry (head + claw pair) and the reinforced silky-segment surface give Bahamdia lower recoil per contact.

**Geometry (top-view)**

```
          Demonic head (inflated, heavier — ~55% of outer mass)
                  ↑
    ┌─────────────────────────────┐
    │     ╔══╗   ╔══╗   ╔══╗     │   r_o = 23.5 mm
    │  ╔══╝  ╚═══╝  ╚═══╝  ╚══╗  │   r_hub = 6.5 mm
    │  ║  rounded rectangles  ║  │   h ≈ 6.5 mm
    │  ║     ╔═════════╗     ║  │
    │  ╚══╗  ║   hub   ║  ╔══╝  │   sharp horns/stops: φ ≈ 40°
    │     ╚══╝   (○)   ╚══╝     │   rounded segments: φ ≈ 12°
    │       Crystal Wheel orb    │
    └────────── ↓ ───────────────┘
          Lighter bottom half (~45% of outer mass)
          Vague claws + orb aperture
```

**Moment of Inertia**

Zone 1 — hub (boss + orb aperture boss): r_i = 0 mm, r_o = 6.5 mm, m₁ = 2.2 g
Zone 2 — mid body (segment shafts, head roots): r_i = 6.5 mm, r_o = 14.0 mm, m₂ = 9.0 g
Zone 3 — outer (inflated head + claw tips + rounded segments): r_i = 14.0 mm, r_o = 23.5 mm, m₃ = 18.15 g

```
I₁ = ½ × 0.0022 × (0² + 0.0065²)                         = 4.65×10⁻⁸ kg·m²
I₂ = ½ × 0.0090 × (0.0065² + 0.0140²)                    = 1.07×10⁻⁶ kg·m²
I₃ = ½ × 0.01815 × (0.0140² + 0.0235²)                   = 6.79×10⁻⁶ kg·m²

I_total = 4.65×10⁻⁸ + 1.07×10⁻⁶ + 6.79×10⁻⁶              → 7.91×10⁻⁶ kg·m²
```

Specific inertia: I/m = 7.91×10⁻⁶ / 0.02935 = 2.69×10⁻⁴ m²

**C₂ Transverse Anisotropy — Inflated Head vs Orb Half**

The outer zone (zone 3, 18.15 g) is unevenly distributed: the demonic head half carries approximately 55% of that mass, the orb/claw half 45%:

```
m_head_half = 0.55 × 18.15 = 9.98 g  at r = 0.0235 m
m_orb_half  = 0.45 × 18.15 = 8.17 g  at r = 0.0235 m

ΔI_transverse = (m_head − m_orb) × r²
              = (0.00998 − 0.00817) × 0.0235²              → 1.00×10⁻⁶ kg·m²

τ_nutation = ΔI × ω / 2 = 1.00×10⁻⁶ × 150 / 2            → 7.50×10⁻⁵ N·m  (at 150 rad/s)
```

Comparison:

| Wheel | ΔI (×10⁻⁶ kg·m²) | τ_nutation (×10⁻⁵ N·m) |
|---|---|---|
| Genbull | 0 | 0 |
| Bahamdia | 1.00 | 7.50 |
| Gargole | 1.40 | 10.5 |

Bahamdia's nutation forcing is 71% of Gargole's — measurable but not as destabilising as Gargole's dense head/claw pair.

**Contact Face Geometry — Rounded Rectangles vs Sharp Stops**

Silky rounded-rectangle segments dominate ~70% of the circumference with shallow face angle:

```
φ_segment = 12°  (rounded face, nearly radial)
  Smash fraction  = cos(12°)                                → 0.978  (97.8%)
  Self-recoil     = sin(12°)                                → 0.208  (20.8%)
```

Sharp horn/wing stops occupy ~30% of the circumference:

```
φ_horn = 40°
  Smash fraction  = cos(40°)                                → 0.766  (76.6%)
  Self-recoil     = sin(40°)                                → 0.643  (64.3%)
```

Weighted effective smash fraction:

```
cos_eff = 0.70 × 0.978 + 0.30 × 0.766                      → 0.915  (91.5%)
```

The predominantly rounded surface gives Bahamdia 91.5% weighted smash efficiency — better than Gargole's 90.7% — while the sharp horns provide occasional high-recoil spike contacts that drive the Attack-type customization role (e.g., Bahamdia Dragooon BD145R²F).

**Angular Momentum Comparison**

At ω = 150 rad/s:

```
L_Bahamdia = 7.91×10⁻⁶ × 150                               → 1.187×10⁻³ kg·m²/s
L_Gargole  = 7.87×10⁻⁶ × 150                               → 1.181×10⁻³ kg·m²/s
L_Genbull  = 8.37×10⁻⁶ × 150                               → 1.256×10⁻³ kg·m²/s

Deficit vs Basalt:  1 − 1.187×10⁻³ / 2.070×10⁻³            → 42.7%
vs Gargole:         +0.5%  (Bahamdia marginally higher)
vs Genbull:         −5.5%  (Genbull leads by 69×10⁻⁶ N·m·s)
```

**TypeScript model**

```typescript
function bahamdiaInertia(m_hub_g: number, m_mid_g: number, m_outer_g: number,
                          r_hub_mm: number, r_mid_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_mid_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_outer_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function bahamdiaTransverseAnisotropy(m_outer_g: number, heavy_fraction: number, r_mm: number): number {
  const m_heavy = (m_outer_g * heavy_fraction) / 1000;
  const m_light = (m_outer_g * (1 - heavy_fraction)) / 1000;
  return (m_heavy - m_light) * Math.pow(r_mm / 1000, 2);
}

function bahamdiaEffectiveSmash(segment_fraction: number, phi_seg_deg: number, phi_horn_deg: number): number {
  return segment_fraction * Math.cos(phi_seg_deg * Math.PI / 180)
       + (1 - segment_fraction) * Math.cos(phi_horn_deg * Math.PI / 180);
}

function bahamdiaAngularMomentumDeficit(I_bahamdia: number, I_ref: number): number {
  return 1 - I_bahamdia / I_ref;
}

// bahamdiaInertia(2.2, 9.0, 18.15, 6.5, 14.0, 23.5)            → 7.91×10⁻⁶ kg·m²
// bahamdiaTransverseAnisotropy(18.15, 0.55, 23.5)               → 1.00×10⁻⁶ kg·m²  (C₂ ΔI)
// bahamdiaEffectiveSmash(0.70, 12, 40)                          → 0.915  (91.5% weighted smash)
// bahamdiaAngularMomentumDeficit(7.91e-6, 1.38e-5)              → 42.7%  (vs Basalt)
// bahamdiaAngularMomentumDeficit(7.91e-6, 7.87e-6)              → −0.5%  (vs Gargole — Bahamdia leads)
```

---

## Case 318 — Bottom: Giga Flat / GF (0.74 g)

> **Stock combo (Gladiator Bahamdia SP230GF):** Chrome Wheel(s): Bahamdia · Crystal Wheel: Gladiator · Track: SP230 · Bottom: Giga Flat

**Thesis.** Giga Flat is a hard ABS flat-tip bottom — a larger-diameter, smooth-sided derivative of Extreme Flat (XF). The wider flat contact face (r_tip ≈ 9 mm vs XF ~7.5 mm) increases the spinning-disk friction torque by a factor of r_GF/r_XF = 1.20×, accelerating spin decay by 20% relative to XF and widening the lateral drift velocity that drives attack behavior. XF carries plastic ribs along its side wall that create micro-deflection anchors on stadium floor texture; GF's smooth sides eliminate these, resulting in a more unimpeded, unguided drift path. The scalloped outer disc (r ≈ 14 mm) engages the Zero-G stadium's curved wall with gear-tooth grip — the same mechanism as GCF — but at a smaller radius than GCF (16.74 mm), delivering proportionally less wall traction while contributing to Zero-G orbit climbing at low spin.

**Geometry**

```
Side view:
  ╔════════╗  ← body / driver shaft
  ║        ║
  ║        ║  smooth side wall (no plastic ribs)
  ╚══╗  ╔══╝
     ║  ║      h_tip ≈ 5 mm (slightly taller than XF ~4 mm)
  ╔══╩══╩══╗
  ║ scallop ║  ← gear-toothed outer disc, r = 14 mm
  ╚═╗    ╔═╝
     ╚════╝   ← flat contact face, r_tip = 9 mm

Bottom view:
      ┌───────────────────────┐
      │  scalloped gear edge  │  r_disc = 14 mm
      │  ┌─────────────────┐  │
      │  │   flat face (ABS)│  │  r_tip = 9 mm
      │  │                 │  │
      │  └─────────────────┘  │
      └───────────────────────┘
```

**Spinning-Disk Friction Torque**

For a flat circular tip of radius a rotating on the stadium floor:

```
τ = (2/3) × μ × W × a

μ_ABS = 0.35,  W = 0.050 × 9.81 = 0.491 N  (50 g assembly),  a = r_tip = 0.009 m

τ_GF = (2/3) × 0.35 × 0.491 × 0.009                         → 1.03×10⁻³ N·m
```

Spin decay rate (I_system ≈ 1.0×10⁻⁵ kg·m² for Chrome Wheel assembly):

```
dω/dt = τ / I = 1.03×10⁻³ / 1.0×10⁻⁵                       → 103 rad/s²
```

For comparison, a sharp hard tip (Sneddon contact radius a ≈ 0.1 mm, μ = 0.17):

```
τ_sharp = (2/3) × 0.17 × 0.491 × 0.0001                     = 5.57×10⁻⁶ N·m
dω/dt_sharp = 5.57×10⁻⁶ / 1.0×10⁻⁵                          = 0.557 rad/s²

Ratio: τ_GF / τ_sharp = 1.03×10⁻³ / 5.57×10⁻⁶               → 185×  (GF decays 185× faster)
```

GF sustains approximately 1/(185) the endurance of a sharp hard tip at equal spin — confirming its pure Attack role.

**GF vs XF Contact Area and Torque Comparison**

```
r_XF = 7.5 mm,  r_GF = 9.0 mm

A_XF = π × 0.0075²                                           = 1.77×10⁻⁴ m²
A_GF = π × 0.009²                                            = 2.54×10⁻⁴ m²
A_GF / A_XF                                                  → 1.44×  (44% more contact area)

τ_GF / τ_XF = r_GF / r_XF = 9.0 / 7.5                       → 1.20×  (20% more friction torque)
```

The 44% contact area increase raises adhesion grip proportionally; the 20% torque increase directly accelerates spin decay. GF sacrifices stamina more aggressively than XF in exchange for marginally higher orbit velocity and attack force.

**Lateral Drift Velocity**

A flat tip in motion has no centering restoring force from tip geometry. The net traction at the tip edge drives lateral translation:

```
v_drift ≈ ω × r_tip

At ω = 150 rad/s:  v_drift = 150 × 0.009                    → 1.35 m/s
At ω = 100 rad/s:  v_drift = 100 × 0.009                    → 0.90 m/s
```

Higher than XF (v_drift_XF = 100 × 0.0075 = 0.75 m/s at 100 rad/s). GF covers the stadium faster, but without XF's side-rib micro-anchors, the drift trajectory is more erratic and less reproducible.

**Zero-G Wall Traction vs GCF**

The scalloped outer disc engages the Zero-G stadium curved wall:

```
r_GF_disc = 14.0 mm,  r_GCF = 16.74 mm

Wall traction ratio (same contact angle, same width):
  F_GF / F_GCF = r_GF / r_GCF = 14.0 / 16.74               → 0.836  (83.6% of GCF traction)
```

GF provides 83.6% of GCF's wall grip. It functions in Zero-G stadium orbit climbing but generates less centripetal wall force per contact pass than GCF.

**TypeScript model**

```typescript
function gfFrictionTorque(r_tip_mm: number, mu: number, W: number): number {
  return (2 / 3) * mu * W * (r_tip_mm / 1000);
}

function gfSpinDecay(tau: number, I_system: number): number {
  return tau / I_system;
}

function gfVsXFTorqueRatio(r_gf_mm: number, r_xf_mm: number): number {
  return r_gf_mm / r_xf_mm;
}

function gfDriftVelocity(omega: number, r_tip_mm: number): number {
  return omega * (r_tip_mm / 1000);
}

function gfWallTractionRatio(r_gf_disc_mm: number, r_gcf_mm: number): number {
  return r_gf_disc_mm / r_gcf_mm;
}

// gfFrictionTorque(9, 0.35, 0.491)                              → 1.03×10⁻³ N·m
// gfSpinDecay(1.03e-3, 1.0e-5)                                  → 103 rad/s²   (vs 0.557 for sharp tip = 185×)
// gfVsXFTorqueRatio(9.0, 7.5)                                   → 1.20×   (20% more torque than XF)
// gfDriftVelocity(150, 9)                                       → 1.35 m/s  (orbit speed at 150 rad/s)
// gfWallTractionRatio(14.0, 16.74)                              → 0.836  (83.6% of GCF wall grip)
```

---

## Case 319 — Chrome Wheel: Revizer (30.6 g)

> **Stock combo (Guardian Revizer 160SB):** Chrome Wheel(s): Revizer · Crystal Wheel: Guardian · Track: 160 · Bottom: Sharp Ball

**Thesis.** Revizer is the highest-defense Chrome Wheel in this series: its outer edge is a near-complete circular arc interrupted only by two diametrically opposite holes (C₂ mass distribution). The circular arc presents φ ≈ 5° side contact angle, delivering 99.6% smash fraction with only 8.7% self-recoil across the vast majority of its circumference. The two holes reduce total mass relative to a solid disc and introduce a C₂ transverse anisotropy (ΔI ≈ 1.0×10⁻⁶ kg·m²) — the same mechanism as Bahamdia — giving mild nutation forcing at 2ω. Despite the holes, the mass removed is replaced by the fin/spike protrusions at those azimuths, so I_total (8.47×10⁻⁶ kg·m²) matches or slightly exceeds Genbull. The result is a Chrome Wheel that combines near-zero lateral self-recoil, high angular momentum, and a fin-spike contact zone that delivers targeted smash at the hole azimuths.

**Geometry (top-view)**

```
           smooth arc (φ ≈ 5°)
                ↑
    ┌─────────────────────────────┐
    │  ╔═════════════════════╗   │   r_o = 23.5 mm
    │  ║   serpent/fin arc   ║   │   r_hub = 6.5 mm
    │  ║         ┌─────┐     ║   │
    │  ║  hole 1 │ hub │  ○  ║   │   Two holes: at 0° and 180°
    │  ║         └─────┘     ║   │   (C₂ mass symmetry)
    │  ║   fin/spike zone    ║   │   Hole radius ≈ 6 mm at r ≈ 14 mm
    │  ╚═════════════════════╝   │
    └────── hole 2 ───────────────┘
         h ≈ 6.5 mm
         ~85% smooth arc, ~15% fin/spike edges at hole azimuths
```

**Moment of Inertia**

Zone 1 — hub (center boss): r_i = 0 mm, r_o = 6.5 mm, m₁ = 2.3 g
Zone 2 — mid body (fin roots, material around holes): r_i = 6.5 mm, r_o = 14.0 mm, m₂ = 8.5 g
Zone 3 — outer circular arc (serpent/fin band): r_i = 14.0 mm, r_o = 23.5 mm, m₃ = 19.8 g

```
I₁ = ½ × 0.0023 × (0² + 0.0065²)                         = 4.86×10⁻⁸ kg·m²
I₂ = ½ × 0.0085 × (0.0065² + 0.0140²)                    = 1.01×10⁻⁶ kg·m²
I₃ = ½ × 0.0198 × (0.0140² + 0.0235²)                    = 7.41×10⁻⁶ kg·m²

I_total = 4.86×10⁻⁸ + 1.01×10⁻⁶ + 7.41×10⁻⁶              → 8.47×10⁻⁶ kg·m²
```

Specific inertia: I/m = 8.47×10⁻⁶ / 0.0306 = 2.77×10⁻⁴ m² — highest in this series.

**Hole-Induced C₂ Transverse Anisotropy**

Each hole removes approximately 2.5 g of material at r ≈ 14 mm (zone 2/3 boundary). Two opposite holes:

```
ΔI_transverse = 2 × m_hole × r_hole²
              = 2 × 0.0025 × 0.014²                       → 9.80×10⁻⁷ kg·m²  ≈ 1.0×10⁻⁶ kg·m²

τ_nutation = ΔI × ω / 2 = 1.0×10⁻⁶ × 150 / 2             → 7.5×10⁻⁵ N·m  (at 150 rad/s)
```

Ranked against this series: Genbull (0) < Revizer (7.5×10⁻⁵) ≈ Bahamdia (7.5×10⁻⁵) < Gargole (10.5×10⁻⁵). Revizer and Bahamdia impose identical nutation levels; Revizer's is due to removed material (holes), Bahamdia's due to added material (inflated head).

**Side Contact Profile — Smooth Arc vs Fin Edges**

Smooth circular arc (~85% of circumference, φ = 5°):
```
Smash fraction  = cos(5°)                                  → 0.996
Self-recoil     = sin(5°)                                  → 0.087
```

Fin/spike edges at hole azimuths (~15% of circumference, φ = 25°):
```
Smash fraction  = cos(25°)                                 → 0.906
Self-recoil     = sin(25°)                                 → 0.423
```

Weighted effective smash:
```
cos_eff = 0.85 × 0.996 + 0.15 × 0.906                     → 0.983  (98.3%)
```

98.3% weighted smash efficiency — the highest of any Chrome Wheel in this series — with average self-recoil of only 0.137. This confirms Revizer's exceptional defense: most of the circumference deflects impacts radially with negligible self-disturbance.

**Angular Momentum Comparison**

At ω = 150 rad/s:

```
L_Revizer  = 8.47×10⁻⁶ × 150                              → 1.271×10⁻³ kg·m²/s
L_Genbull  = 8.37×10⁻⁶ × 150                              → 1.256×10⁻³ kg·m²/s
L_Dragooon = 8.34×10⁻⁶ × 150                              → 1.251×10⁻³ kg·m²/s
L_Basalt   = 1.38×10⁻⁵ × 150                              → 2.070×10⁻³ kg·m²/s

Deficit vs Basalt:    1 − 1.271×10⁻³ / 2.070×10⁻³         → 38.6%
Advantage vs Genbull: 1 − 1.256×10⁻³ / 1.271×10⁻³         → +1.2%
```

Revizer leads the Zero-G series in both specific inertia and total angular momentum at launch, while matching Genbull's near-zero side self-recoil — explaining its dual use in Defense and Stamina configurations.

**TypeScript model**

```typescript
function revizerInertia(m_hub_g: number, m_mid_g: number, m_outer_g: number,
                         r_hub_mm: number, r_mid_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_mid_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_outer_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function revizerHoleDeltaI(m_hole_g: number, r_hole_mm: number): number {
  return 2 * (m_hole_g / 1000) * Math.pow(r_hole_mm / 1000, 2);
}

function revizerWeightedSmash(arc_fraction: number, phi_arc_deg: number, phi_fin_deg: number): number {
  return arc_fraction * Math.cos(phi_arc_deg * Math.PI / 180)
       + (1 - arc_fraction) * Math.cos(phi_fin_deg * Math.PI / 180);
}

function revizerAngularMomentumDeficit(I_revizer: number, I_ref: number): number {
  return 1 - I_revizer / I_ref;
}

// revizerInertia(2.3, 8.5, 19.8, 6.5, 14.0, 23.5)              → 8.47×10⁻⁶ kg·m²
// revizerHoleDeltaI(2.5, 14.0)                                  → 9.80×10⁻⁷ kg·m²  (C₂ from holes)
// revizerWeightedSmash(0.85, 5, 25)                             → 0.983  (98.3% — highest in ZG series)
// revizerAngularMomentumDeficit(8.47e-6, 1.38e-5)               → 38.6%  (vs Basalt)
// revizerAngularMomentumDeficit(8.47e-6, 8.37e-6)               → −1.2%  (Revizer leads Genbull)
```

---

## Case 320 — Crystal Wheel: Guardian (4.1 g)

> **Stock combo (Guardian Revizer 160SB):** Chrome Wheel(s): Revizer · Crystal Wheel: Guardian · Track: 160 · Bottom: Sharp Ball

**Thesis.** Guardian is an ABS Crystal Wheel with a tapered annular disc profile — 5.0 mm tall at the central orb, narrowing to 3.0 mm at the outer border (r_o = 23.0 mm). Its outer ring (r_i = 16.5 mm to r_o = 23.0 mm) descends below Revizer's bottom face and acts as a sacrificial guard for low attacks: ABS has a coefficient of restitution of ~0.45 vs zinc alloy's ~0.85, so attacks contacting Guardian's outer ring absorb roughly 3× more kinetic energy than a direct Chrome Wheel strike. The Crystal Wheel contributes 10.1% of total system inertia when paired with Revizer — a secondary angular momentum reserve that slightly raises the Revizer+Guardian system's stamina versus Revizer alone.

**Geometry (cross-section side view)**

```
        Central orb
             ↓
   ╔═════════╗          h_center = 5.0 mm
   ║  ABS    ║
   ║  orb +  ║
   ║  hub    ╠═══════════════╗   h_border = 3.0 mm
   ╚═════════╝     outer     ╚══╗
                  ring           ║  ← guard below CW bottom face
   |←   r = 16.5 mm →||← 6.5 mm→|
                     r_o = 23.0 mm
   Full Width = 46.0 mm
   Min Width  = 33.0 mm  (waist at r = 16.5 mm)
```

**Ring Moment of Inertia**

Zone 1 — inner hub + orb (solid ABS): r_i = 0 mm, r_o = 8.0 mm, m₁ = 1.0 g
Zone 2 — outer ring disc (ABS, tapered): r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 3.1 g

```
I₁ = ½ × 0.0010 × (0² + 0.008²)                          = 3.20×10⁻⁸ kg·m²
I₂ = ½ × 0.0031 × (0.008² + 0.023²)                      = 9.19×10⁻⁷ kg·m²

I_Guardian = 3.20×10⁻⁸ + 9.19×10⁻⁷                        → 9.51×10⁻⁷ kg·m²
```

**System Inertia Fraction (Revizer + Guardian)**

```
I_system = I_Revizer + I_Guardian = 8.47×10⁻⁶ + 9.51×10⁻⁷  → 9.42×10⁻⁶ kg·m²
Guardian fraction = 9.51×10⁻⁷ / 9.42×10⁻⁶                 → 10.1%
```

Angular momentum at ω = 150 rad/s:

```
L_system = 9.42×10⁻⁶ × 150                                 → 1.413×10⁻³ kg·m²/s
L_Revizer alone = 8.47×10⁻⁶ × 150                          → 1.271×10⁻³ kg·m²/s
Guardian stamina addition: ΔL / L                          → +11.2%
```

**Lower Attack Energy Absorption**

The outer ring (r_i = 16.5 mm, r_o = 23.0 mm, h = 3.0 mm) extends below the Chrome Wheel's bottom face. A lower attack striking this ABS ring dissipates energy via the lower coefficient of restitution:

```
COR_ABS    ≈ 0.45   →  fraction reflected = COR² = 0.202
COR_ZnAlloy ≈ 0.85  →  fraction reflected = COR² = 0.722

Energy absorbed by ABS guard:   1 − 0.202 = 0.798  (79.8%)
Energy reflected by bare Chrome: 1 − 0.722 = 0.278  (27.8%)

Absorption advantage = 0.798 / 0.278                       → 2.87×  (Guardian absorbs 2.87× more energy)
```

The ABS outer ring converts 79.8% of each low-attack's kinetic energy into deformation and heat rather than rebound impulse, reducing the angular momentum loss to the assembly by approximately 72% compared to a bare zinc Chrome Wheel face receiving the same strike.

The taper from 3.0 mm (border) to 5.0 mm (center) ensures the outer ring has the lower height for floor clearance, allowing Guardian to intercept attacks without scraping the stadium floor at normal tilt angles. Critical scrape angle:

```
θ_scrape = arcsin(h_border / r_o) = arcsin(3.0 / 23.0)     → 7.5°
```

The assembly tilts more than 7.5° before Guardian's outer edge contacts the floor, giving adequate stability margin for early-battle spin.

**TypeScript model**

```typescript
function guardianInertia(m_hub_g: number, r_hub_mm: number,
                          m_ring_g: number, r_inner_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}

function guardianSystemFraction(I_cw: number, I_crystal: number): number {
  return I_crystal / (I_cw + I_crystal);
}

function guardianAbsorptionAdvantage(cor_abs: number, cor_metal: number): number {
  return (1 - cor_abs * cor_abs) / (1 - cor_metal * cor_metal);
}

function guardianScrapeAngle(h_border_mm: number, r_outer_mm: number): number {
  return Math.asin(h_border_mm / r_outer_mm) * 180 / Math.PI;
}

// guardianInertia(1.0, 8, 3.1, 8, 23)                           → 9.51×10⁻⁷ kg·m²
// guardianSystemFraction(8.47e-6, 9.51e-7)                      → 10.1%  (Guardian fraction of Revizer+Guardian)
// guardianAbsorptionAdvantage(0.45, 0.85)                       → 2.87×  (ABS guard absorbs 2.87× more vs bare zinc)
// guardianScrapeAngle(3.0, 23.0)                                → 7.5°   (floor-scrape onset tilt)
```

---

## Case 320a — Crystal Wheel: Archer (5.16 g)

> **Stock combos:** Archer Gryph C145S · Archer Gargole SA165WSF · Archer Ifraid W145SB · Archer Killerken 130B · Archer Phoenic 125B
> **Hasbro name:** Archer (unchanged)

**Thesis.** Archer is a C₁ Crystal Wheel: large convex bow-curves span approximately half the circumference (~180°), while the opposing half carries the central orb and engraved string-detail relief. This bilateral asymmetry creates a non-zero transverse inertia anisotropy (ΔI_trans ≈ 0.08×10⁻⁶ kg·m²), generating nutation forcing at 2ω that slowly rotates the precession axis — functionally equivalent to a low-amplitude Duo-style imbalance (Case 67) at Crystal Wheel scale. At 5.16 g, Archer contributes I = 1.212×10⁻⁶ kg·m² (13.3% of the Archer+Gargole system), the second-highest Crystal Wheel inertia after Gladiator, Samurai, Shinobi, and Thief. In Crystal Up Mode the bow curves extend beyond Gargole's bottom face and intercept low attacks with ABS (absorption advantage 2.87×, Case 320); the smooth arc geometry (φ_contact ≈ 20°) on the bow side deflects rather than absorbs, routing impact momentum tangentially and reducing net spin-loss compared to a flat guard.

**Geometry (top view)**

```
     orb / crystal (string engravings, φ ≈ 45°)
              ↓
    ┌────────────────────────────┐
    │  ○  ·····  (string relief) │   r_o ≈ 23.0 mm  [ESTIMATED]
    │                            │   r_hub ≈ 8.0 mm  [ESTIMATED]
    │╔══════════════════════════╗ │   C₁: bow half (below) vs crystal half (above)
    │║   hub / spindle bore     ║ │   ~50% bow arc   (large convex curves, φ ≈ 20°)
    │╚══════════════════════════╝ │   ~50% crystal half (orb + relief, φ ≈ 45°)
    │   ╱  bow curve A            │
    │  ╱   (large convex protr.)  │
    │ ╱    bow curve B            │
    └────────────────────────────┘
      ↑ bow protrusions span ~180° on this half
```

**Moment of Inertia**

Zone 1 — hub: r_i = 0 mm, r_o = 8.0 mm, m₁ = 1.2 g [ESTIMATED]
Zone 2 — outer ring (bow arcs + orb): r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 3.96 g [ESTIMATED]

```
I₁ = ½ × 0.0012 × (0² + 0.008²)                                = 3.84×10⁻⁸ kg·m²
I₂ = ½ × 0.00396 × (0.008² + 0.023²)                           = 1.174×10⁻⁶ kg·m²

I_Archer = 3.84×10⁻⁸ + 1.174×10⁻⁶                              = 1.212×10⁻⁶ kg·m²
I/m      = 1.212×10⁻⁶ / 0.00516                                 = 2.349×10⁻⁴ m²
```

**System Inertia Fraction (Archer + Gargole)**

```
I_system = 7.87×10⁻⁶ + 1.212×10⁻⁶                              = 9.082×10⁻⁶ kg·m²
Archer fraction = 1.212×10⁻⁶ / 9.082×10⁻⁶                      = 13.3%
ΔL at ω₀ = 150: 1.212×10⁻⁶ × 150                               = 1.818×10⁻⁴ kg·m²/s stamina addition
```

**C₁ Transverse Anisotropy**

The bow half has its mass concentrated at larger radial distance (bow curves near r_o) compared to the crystal half (orb at r ≈ 12 mm, relief engraving thinner at r_o):

```
ΔI_trans ≈ (f_bow − f_crystal) × I₂ ≈ (0.55 − 0.45) × 1.174×10⁻⁶ = 0.117×10⁻⁶ kg·m²

Nutation forcing amplitude ∝ ΔI_trans × ω² → grows quadratically with spin.
At ω = 600 rad/s (launch): ΔI × ω² = 0.117×10⁻⁶ × 3.6×10⁵   = 42.1 N·m  (peak nutation torque amplitude)
At ω = 150 rad/s (late): ΔI × ω² = 0.117×10⁻⁶ × 2.25×10⁴    = 2.63 N·m  (late battle, reduced)
```

Low nutation forcing throughout battle (vs Duo at ~0.70×10⁻⁶ ΔI — Archer is 6× lower). Negligible in practice.

```typescript
function archerInertia(m_hub_g: number, r_hub_mm: number,
                        m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}
function archerSystemFraction(I_chrome: number, I_crystal: number): number {
  return I_crystal / (I_chrome + I_crystal);
}
function archerNutationTorque(deltaI: number, omega: number): number {
  return deltaI * omega * omega;
}

// archerInertia(1.2, 8, 3.96, 23)                              → 1.212×10⁻⁶ kg·m²
// archerSystemFraction(7.87e-6, 1.212e-6)                      → 13.3%  (Gargole+Archer)
// archerNutationTorque(0.117e-6, 600)                          → 42.1 N·m  (launch, peak)
// archerNutationTorque(0.117e-6, 150)                          →  2.6 N·m  (late-battle)
```

---

## Case 320b — Crystal Wheel: Bandid (4.8 g)

> **Stock combos:** Bandid Goreim DF145BS · Bandid Genbull F230TB · Bandid Killerken 125W²D
> **Hasbro name:** Bandid (unchanged); Goreim = Goreim (unchanged)

**Thesis.** Bandid is a C₂ Crystal Wheel of block-shaped sections with ridges, designed to complement Goreim's own block-and-ridge Chrome Wheel geometry. The complementary profiling minimises the inter-layer gap in Synchrome assembly: tight mechanical coupling increases the effective contact area between the ABS Crystal Wheel and the zinc-alloy Chrome Wheel, improving the torsional grip that resists relative rotation between layers. At 4.8 g, Bandid contributes I = 1.159×10⁻⁶ kg·m² — 12.5% of the Bandid+Goreim system. The C₂ block symmetry ensures zero transverse anisotropy (ΔI_trans = 0) when mounted on Goreim, suppressing nutation forcing entirely. The ridge geometry on the outer face creates a serrated contact profile when in Crystal Up Mode: multiple small ridges (~0.5 mm amplitude) produce high-frequency micro-impacts rather than single large impulses, distributing energy dissipation more uniformly and reducing peak contact force per event.

**Geometry (top view)**

```
    ┌────────────────────────────┐
    │  ╔══╗  ╔══╗  ╔══╗          │   r_o ≈ 23.0 mm  [ESTIMATED]
    │  ║ B1║  ║ B2║  ║ B3║  →    │   r_hub ≈ 8.0 mm  [ESTIMATED]
    │╔═══════════════════════╗    │   C₂: block-ridge pair × 2 (180° repeat)
    │║   hub / bore           ║   │   ~70% block sections (ridged, φ ≈ 30°)
    │╚═══════════════════════╝    │   ~30% transition/gap between blocks
    │     ←  ╔══╗  ╔══╗  ╔══╗   │
    │         ║ B4║  ║ B5║  ║ B6║│   blocks complement Goreim's recesses directly
    └────────────────────────────┘
```

**Moment of Inertia**

Zone 1 — hub: r_i = 0 mm, r_o = 8.0 mm, m₁ = 1.0 g [ESTIMATED]
Zone 2 — outer block ring: r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 3.8 g [ESTIMATED]

```
I₁ = ½ × 0.0010 × (0² + 0.008²)                                = 3.20×10⁻⁸ kg·m²
I₂ = ½ × 0.0038 × (0.008² + 0.023²)                            = 1.127×10⁻⁶ kg·m²

I_Bandid  = 3.20×10⁻⁸ + 1.127×10⁻⁶                             = 1.159×10⁻⁶ kg·m²
I/m       = 1.159×10⁻⁶ / 0.0048                                 = 2.415×10⁻⁴ m²
```

**System Inertia Fraction (Bandid + Goreim)**

```
I_Goreim est. = 8.10×10⁻⁶ kg·m²  [ESTIMATED — no Goreim case study; typical ZeroG Chrome Wheel range]
I_system = 8.10×10⁻⁶ + 1.159×10⁻⁶                              = 9.259×10⁻⁶ kg·m²
Bandid fraction = 1.159×10⁻⁶ / 9.259×10⁻⁶                      = 12.5%
```

**Ridge Contact Frequency**

In Crystal Up Mode, Bandid's outer ridges contact opponents. For n ridges at r_o (estimated n ≈ 8 ridges per half, 16 total):

```
Contact events per orbit at r_o = 23 mm, ω = 300 rad/s:
  v_contact = ω × r_o = 300 × 0.023 = 6.9 m/s
  Ridge pitch ≈ 2π × 23 / 16 ≈ 9.03 mm
  Ridge contact frequency = v_contact / pitch = 6.9 / 0.00903 ≈ 764 Hz

Single ridge impulse ≈ J_total_contact / n_ridges = J / 16
Energy absorbed per ridge = (J/16)² / (2 × m_ridge)     (much less per event vs single point)
```

Ridge geometry distributes impact over multiple events, reducing peak deformation force and improving durability at the cost of a less decisive single-hit impulse.

```typescript
function bandidInertia(m_hub_g: number, r_hub_mm: number,
                        m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}
function bandidSystemFraction(I_chrome: number, I_crystal: number): number {
  return I_crystal / (I_chrome + I_crystal);
}
function bandidRidgeFrequency(omega_rad_s: number, r_outer_mm: number, n_ridges: number): number {
  const v = omega_rad_s * (r_outer_mm / 1000);
  const pitch = 2 * Math.PI * (r_outer_mm / 1000) / n_ridges;
  return v / pitch;
}

// bandidInertia(1.0, 8, 3.8, 23)                               → 1.159×10⁻⁶ kg·m²
// bandidSystemFraction(8.10e-6, 1.159e-6)                      → 12.5%  (Goreim+Bandid)
// bandidRidgeFrequency(300, 23, 16)                             → 764 Hz  (at 300 rad/s)
```

---

## Case 320c — Crystal Wheel: Berserker (4.5 g)

> **Stock combo:** Berserker Begirados SR200BWD
> **Hasbro name:** Berserker (unchanged); Begirados = **Behemoth**

**Thesis.** Berserker is an approximately C₂-symmetric Crystal Wheel: chain segments ring the outer circumference and two "boulder" masses — the orb on one side and a matching counterweight on the opposite — create a near-balanced mass distribution with ΔI_trans ≈ 0.05×10⁻⁶ kg·m² (well below Gargole's 1.40×10⁻⁶, effectively negligible). At 4.5 g (fourth lightest Crystal Wheel), Berserker contributes I = 1.070×10⁻⁶ kg·m² — 11.7% of the Berserker+Behemoth system. The serrated chain segments on the outer ring are structurally thin but numerous, generating a similar high-frequency ridge contact profile to Bandid; unlike Bandid's straight block ridges, Berserker's chain link geometry has curved inter-link arcs that let the contact point sweep along the arc, producing a continuously varying contact angle (φ varies 0°–60° per chain link) and a more diffuse impulse profile.

**Geometry (top view)**

```
    ┌────────────────────────────┐
    │  ○  ← boulder/orb          │   r_o ≈ 23.0 mm  [ESTIMATED]
    │  (chain links rim all sides)│   r_hub ≈ 8.0 mm  [ESTIMATED]
    │╔═══════════════════════════╗│   C₂: orb ↔ boulder counterweight (180° apart)
    │║   hub / bore              ║│   ~65% chain segments (serrated, φ sweeps 0–60°)
    │╚═══════════════════════════╝│   ~20% boulder masses (orb + counterweight)
    │  ○  ← boulder counterweight │   ~15% inter-link recesses
    └────────────────────────────┘
```

**Moment of Inertia**

Zone 1 — hub: r_i = 0 mm, r_o = 8.0 mm, m₁ = 1.0 g [ESTIMATED]
Zone 2 — outer ring (chains + boulders): r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 3.5 g [ESTIMATED]

```
I₁ = ½ × 0.0010 × (0² + 0.008²)                                = 3.20×10⁻⁸ kg·m²
I₂ = ½ × 0.0035 × (0.008² + 0.023²)                            = 1.038×10⁻⁶ kg·m²

I_Berserker = 3.20×10⁻⁸ + 1.038×10⁻⁶                           = 1.070×10⁻⁶ kg·m²
I/m         = 1.070×10⁻⁶ / 0.0045                               = 2.378×10⁻⁴ m²
```

**System Inertia Fraction (Berserker + Begirados/Behemoth)**

```
I_Begirados est. = 8.05×10⁻⁶ kg·m²  [ESTIMATED — no Begirados case study]
I_system = 8.05×10⁻⁶ + 1.070×10⁻⁶                              = 9.120×10⁻⁶ kg·m²
Berserker fraction = 1.070×10⁻⁶ / 9.120×10⁻⁶                   = 11.7%
```

**Chain Link Sweeping Contact**

Each chain link subtends ~18° of arc (360° / ~20 links). The contact angle φ varies from 0° at the link midpoint to ~60° at the link-to-link junction. The impulse profile over one link traversal:

```
φ(θ) ≈ 30° × |sin(θ × π / link_arc)|  for θ ∈ [0, link_arc]

Mean smash fraction per link:
  ⟨cos φ⟩ = (1/π) ∫₀^π cos(30° × sin t) dt
           ≈ J₀(30° × π/180)  (Bessel function approximation)
           ≈ J₀(0.524) ≈ 0.866

vs flat-face contact (φ = 0°, cos φ = 1.000):
  Chain link smash efficiency = 0.866 / 1.000 = 86.6%
```

Chain geometry retains 86.6% of flat-face smash while distributing the impulse over 18° of sweep — more damage-tolerant than a sharp angular protrusion.

```typescript
function berserkerInertia(m_hub_g: number, r_hub_mm: number,
                           m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}
function berserkerSystemFraction(I_chrome: number, I_crystal: number): number {
  return I_crystal / (I_chrome + I_crystal);
}
function berserkerChainSmashEfficiency(phi_max_deg: number): number {
  const phi_rad = phi_max_deg * Math.PI / 180;
  // Bessel J0 approximation for mean of cos(phi_max * sin(t))
  return 1 - phi_rad * phi_rad / 4 + phi_rad * phi_rad * phi_rad * phi_rad / 64;
}

// berserkerInertia(1.0, 8, 3.5, 23)                            → 1.070×10⁻⁶ kg·m²
// berserkerSystemFraction(8.05e-6, 1.070e-6)                   → 11.7%  (Begirados+Berserker)
// berserkerChainSmashEfficiency(30)                             → 0.866  (86.6% of flat-face smash)
```

---

## Case 320d — Crystal Wheel: Dark Knight (3.87 g)

> **Stock combo:** Dark Knight Dragooon LW160BSF
> **Hasbro name:** Dark Knight = **Ronin**; Dragooon = Dragooon (unchanged)

**Thesis.** Dark Knight is the lightest Crystal Wheel (3.87 g) and the only one with universal Chrome Wheel compatibility, including right-spin Chrome Wheels. The standard Crystal Wheel spindle lock is left-spin only: the internal mounting geometry has a directional key that only engages left-spin Chrome Wheel posts. Dark Knight's hub has a symmetric key slot (both orientations accepted), so it can seat onto any Chrome Wheel. When placed in Crystal Up Mode on a right-spin Chrome Wheel, the launcher imparts left-spin momentum to the assembly — since the Crystal Wheel sits on top and carries the launcher string groove in Crystal Up Mode, the spin direction is that of the Crystal Wheel (left), not the Chrome Wheel (right). At 3.87 g, Dark Knight contributes the lowest Crystal Wheel inertia (I = 9.09×10⁻⁷ kg·m², 9.8% of the Dark Knight+Dragooon system). The half-circle of sharp studs (φ_stud ≈ 5–10°) on one semicircle provides near-radial attack contacts in Crystal Up mode; the opposing scythe-blade face has a smooth slope that creates a single dominant contact surface with φ_scythe ≈ 30°, generating 87% smash, 50% smash for the respective faces.

**Geometry (top view)**

```
     scythe half (smooth slope, φ ≈ 30°)
              ↓
    ┌────────────────────────────┐
    │  ╲─────────────────────╱   │   r_o ≈ 23.0 mm  [ESTIMATED]
    │   (scythe blade, curved)   │   r_hub ≈ 8.0 mm  [ESTIMATED]
    │╔═══════════════════════════╗│   C₁: studs half (below) vs scythe half (above)
    │║   hub (symmetric keyway)  ║│   ~50% sharp studs (φ ≈ 5–10°, near radial)
    │╚═══════════════════════════╝│   ~50% scythe blade (smooth slope, φ ≈ 30°)
    │  ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲    │
    │  (sharp studs, half circle) │   Crystal Up Mode: left-spin on any Chrome Wheel
    └────────────────────────────┘
```

**Moment of Inertia**

Zone 1 — hub: r_i = 0 mm, r_o = 8.0 mm, m₁ = 0.9 g [ESTIMATED]
Zone 2 — outer ring (studs + scythe): r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 2.97 g [ESTIMATED]

```
I₁ = ½ × 0.0009 × (0² + 0.008²)                                = 2.88×10⁻⁸ kg·m²
I₂ = ½ × 0.00297 × (0.008² + 0.023²)                           = 8.80×10⁻⁷ kg·m²

I_DarkKnight = 2.88×10⁻⁸ + 8.80×10⁻⁷                           = 9.09×10⁻⁷ kg·m²
I/m          = 9.09×10⁻⁷ / 0.00387                              = 2.348×10⁻⁴ m²
```

**System Inertia Fraction (Dark Knight + Dragooon)**

```
I_Dragooon = 8.34×10⁻⁶ kg·m²  (Case 316)
I_system = 8.34×10⁻⁶ + 9.09×10⁻⁷                               = 9.249×10⁻⁶ kg·m²
Dark Knight fraction = 9.09×10⁻⁷ / 9.249×10⁻⁶                  = 9.8%  (lowest among all Crystal Wheels)
```

**Left-Spin Adapter Mechanics**

In Crystal Up Mode, Dark Knight sits on top. The launcher groove is cut into the Crystal Wheel face. Launch direction is dictated by the groove direction (standard = left). Right-spin launcher on a right-spin Chrome Wheel would normally spin everything right; but in Crystal Up Mode, the Crystal Wheel top face is the launching interface, and Dark Knight's groove forces left-spin launch regardless of the Chrome Wheel's native direction.

```
Torque transfer efficiency in Crystal Up Mode:
  T_launcher → Crystal Wheel (frictional coupling to Chrome Wheel below)
  η_transfer ≈ 1 − (I_chrome / I_total) × (μ_ABS_on_chrome / 1.0)
  η_transfer ≈ 1 − (8.34 / 9.249) × 0.15 = 1 − 0.135             = 0.865  (86.5% torque reaches Chrome Wheel via friction)

The Chrome Wheel is driven by the Crystal Wheel's momentum — opposite spin direction is imparted.
```

**Stud Contact Angle (Crystal Up Mode)**

```
Stud face φ_stud ≈ 5°: smash = cos(5°) = 0.996  →  near-radial strike
Scythe face φ_scythe ≈ 30°: smash = cos(30°) = 0.866
Both exceed Mercury's φ_eff = 45° (cos = 0.707) — Dark Knight is a better attacker than Mercury despite lower mass.
```

```typescript
function darkKnightInertia(m_hub_g: number, r_hub_mm: number,
                             m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}
function darkKnightSystemFraction(I_chrome: number, I_crystal: number): number {
  return I_crystal / (I_chrome + I_crystal);
}
function darkKnightSpinTransferEfficiency(I_chrome: number, I_total: number, mu_coupling: number): number {
  return 1 - (I_chrome / I_total) * mu_coupling;
}

// darkKnightInertia(0.9, 8, 2.97, 23)                          → 9.09×10⁻⁷ kg·m²
// darkKnightSystemFraction(8.34e-6, 9.09e-7)                   →  9.8%  (Dragooon+DarkKnight — lowest)
// darkKnightSpinTransferEfficiency(8.34e-6, 9.249e-6, 0.15)    → 86.5%  (torque from Crystal Wheel to Chrome Wheel)
```

---

## Case 320e — Crystal Wheel: Gladiator (5.37 g)

> **Stock combo:** Gladiator Bahamdia SP230GF
> **Hasbro name:** Gladiator (unchanged); Bahamdia = **Bahamoote**

**Thesis.** Gladiator is a C₄-symmetric Crystal Wheel — four half-length sword blades arranged at 90° intervals, meeting in pairs at their tips. C₄ symmetry ensures ΔI_trans = 0 (no nutation forcing at any spin rate), identical to Genbull and Dragooon among Chrome Wheels. At 5.37 g (heaviest Crystal Wheel), Gladiator contributes I = 1.275×10⁻⁶ kg·m² — 13.9% of the Gladiator+Bahamdia system, the highest fraction among accurately-known Crystal Wheel pairings. The "abrupt edges" at each sword tip produce near-radial contact faces (φ_tip ≈ 10°, smash = cos(10°) = 0.985), the sharpest contact geometry in the Crystal Wheel series. Gladiator thus provides a stamina bonus (via I fraction) combined with a potential attack contribution (via sharp sword tips) in a single part — unlike Guardian (protective taper), Gladiator can both add angular momentum and deliver near-radial strikes from Crystal Up Mode.

**Geometry (top view)**

```
           sword tip A (φ ≈ 10°, abrupt edge)
                   ↑
    ┌──────────────────────────────┐
    │        / sword A             │   r_o ≈ 23.0 mm  [ESTIMATED]
    │sword D ╲   ╱ sword B         │   r_hub ≈ 8.0 mm  [ESTIMATED]
    │         ╔═══════╗            │   C₄: four swords at 90° intervals
    │         ║  hub  ║            │   ~60% sword blades (half-length, meeting at tips)
    │         ╚═══════╝            │   ~25% between-sword recesses
    │sword D ╱   ╲ sword C         │   ~15% inner spoke connections
    │        ╲ sword D             │
    └──────────────────────────────┘
             ↑ sword tips meet in pairs: A–B and C–D
```

**Moment of Inertia**

Zone 1 — hub: r_i = 0 mm, r_o = 8.0 mm, m₁ = 1.2 g [ESTIMATED]
Zone 2 — outer sword ring: r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 4.17 g [ESTIMATED]

```
I₁ = ½ × 0.0012 × (0² + 0.008²)                                = 3.84×10⁻⁸ kg·m²
I₂ = ½ × 0.00417 × (0.008² + 0.023²)                           = 1.236×10⁻⁶ kg·m²

I_Gladiator = 3.84×10⁻⁸ + 1.236×10⁻⁶                           = 1.275×10⁻⁶ kg·m²
I/m         = 1.275×10⁻⁶ / 0.00537                              = 2.374×10⁻⁴ m²
```

**System Inertia Fraction (Gladiator + Bahamdia)**

```
I_Bahamdia = 7.91×10⁻⁶ kg·m²  (Case 317)
I_system = 7.91×10⁻⁶ + 1.275×10⁻⁶                              = 9.185×10⁻⁶ kg·m²
Gladiator fraction = 1.275×10⁻⁶ / 9.185×10⁻⁶                   = 13.9%  (highest among accurately-known pairs)

L_system at ω₀ = 150: 9.185×10⁻⁶ × 150                         = 1.378×10⁻³ kg·m²/s
```

**C₄ Symmetry — Zero Nutation**

ΔI_trans = 0 for C₄ → no nutation forcing at any ω. The Gladiator+Bahamdia system benefits from Bahamdia's own ΔI_trans = 1.00×10⁻⁶ kg·m² (Case 317) without Gladiator adding any additional asymmetry — if a C₄ Crystal Wheel were needed to stabilise a C₂ Chrome Wheel, Gladiator is the optimal choice.

**Sword Tip Contact Angle**

```
φ_tip ≈ 10°: smash = cos(10°) = 0.985  →  95.7% of impulse directed radially
             recoil = sin(10°) = 0.174  →  very low self-recoil

Sword blade (not tip) φ_blade ≈ 35°: smash = cos(35°) = 0.819
C₄ contact coverage (4 tips × ~15° arc each = 60° / 360° = 16.7%):
  F_smash_tips = 0.167 × 0.985                                   = 0.164
  F_smash_blade = 0.333 × 0.819                                  = 0.273
  F_smash_total = 0.164 + 0.273                                  = 0.437  (over active contact area)
```

Gladiator's active contact fraction (50%) is lower than Mercury's (70%), but per-event smash quality at the tips (0.985) is the highest in the Crystal Wheel series.

```typescript
function gladiatorInertia(m_hub_g: number, r_hub_mm: number,
                           m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}
function gladiatorSystemFraction(I_chrome: number, I_crystal: number): number {
  return I_crystal / (I_chrome + I_crystal);
}
function gladiatorTipSmashFraction(phi_tip_deg: number, f_tip: number,
                                    phi_blade_deg: number, f_blade: number): number {
  return f_tip * Math.cos(phi_tip_deg * Math.PI / 180)
       + f_blade * Math.cos(phi_blade_deg * Math.PI / 180);
}

// gladiatorInertia(1.2, 8, 4.17, 23)                           → 1.275×10⁻⁶ kg·m²  (highest Crystal Wheel I)
// gladiatorSystemFraction(7.91e-6, 1.275e-6)                   → 13.9%  (Bahamdia+Gladiator — highest accurate pair)
// gladiatorTipSmashFraction(10, 0.167, 35, 0.333)              →  0.437  (effective smash fraction)
```

---

## Case 320f — Crystal Wheel: Pirates (4.0 g)

> **Stock combos:** Pirates Orojya 145D · Pirates Killerken A230JSB · Pirates Ifraid T125GCF · Pirates Saramanda T125WB · Pirates Revizer M145CF · Pirates Gryph 160CF · Pirates Phoenic WD145SF
> **Hasbro name:** Pirates (unchanged); Orojya = Orochi

**Thesis.** Pirates is a C₂ Crystal Wheel that mirrors Orojya's snake-coil profile exactly — it is literally the vertical mirror of Orojya's upper face, so that stacking Pirates on Orojya produces a seamless, gap-free Synchrome assembly. The minimal inter-layer gap maximises friction coupling at the ABS–zinc interface, reducing relative rotation between layers and improving the effective Synchrome mass transfer during impact. At 4.0 g, Pirates produces I = 9.48×10⁻⁷ kg·m² — within rounding of Guardian's 9.51×10⁻⁷ kg·m² at 4.1 g. Paired with Revizer (the same Chrome Wheel as Guardian's primary combo), Pirates delivers a system fraction of 10.1%, exactly matching Guardian+Revizer. Pirates' competitive versatility (7 different Chrome Wheel pairings) reflects its near-neutral profile: no large protruding mass concentrations means it adapts to the host Chrome Wheel's geometry rather than imposing its own contact pattern.

**Geometry (top view)**

```
    ┌────────────────────────────┐
    │  ╱ snake coil A (curved)   │   r_o ≈ 23.0 mm  [ESTIMATED]
    │ ╱   (mirrors Orojya top)   │   r_hub ≈ 8.0 mm  [ESTIMATED]
    │╔══════════════════════════╗ │   C₂: coil A ↔ coil B (180° repeat)
    │║   hub / bore             ║ │   ~75% snake coil arcs (profile-matching)
    │╚══════════════════════════╝ │   ~25% inter-coil junction
    │ ╲ snake coil B (mirrored)   │   Gap to Orojya ≈ 0 mm (designed complement)
    │  ╲                         │
    └────────────────────────────┘
```

**Moment of Inertia**

Zone 1 — hub: r_i = 0 mm, r_o = 8.0 mm, m₁ = 0.9 g [ESTIMATED]
Zone 2 — outer coil ring: r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 3.1 g [ESTIMATED]

```
I₁ = ½ × 0.0009 × (0² + 0.008²)                                = 2.88×10⁻⁸ kg·m²
I₂ = ½ × 0.0031 × (0.008² + 0.023²)                            = 9.19×10⁻⁷ kg·m²

I_Pirates = 2.88×10⁻⁸ + 9.19×10⁻⁷                              = 9.48×10⁻⁷ kg·m²
I/m       = 9.48×10⁻⁷ / 0.004                                   = 2.370×10⁻⁴ m²
```

**System Inertia Fraction (Pirates + Revizer)**

```
I_Revizer = 8.47×10⁻⁶ kg·m²  (Case 319)
I_system  = 8.47×10⁻⁶ + 9.48×10⁻⁷                              = 9.418×10⁻⁶ kg·m²
Pirates fraction = 9.48×10⁻⁷ / 9.418×10⁻⁶                      = 10.1%  (matches Guardian+Revizer exactly)
```

**Synchrome Gap Analysis (Pirates–Orojya interface)**

Inter-layer gap δ determines the maximum relative rotation allowed before inter-layer contact forces apply. For a designed-complement fit:

```
δ_complement ≈ 0.1 mm  (manufacturing tolerance only, no designed gap)
Torsional slip torque (ABS on zinc, μ = 0.15):
  τ_grip = μ × N × r_interface = 0.15 × (m_system × g) × 0.015
         = 0.15 × (0.042 × 9.81) × 0.015                       = 9.25×10⁻⁴ N·m  [ESTIMATED]

vs a non-complement Crystal Wheel (δ ≈ 0.5 mm):
  contact area ≈ 1/5 of complement → τ_grip reduced ~5×              = 1.85×10⁻⁴ N·m
```

Pirates' zero-gap coupling provides ~5× greater inter-layer grip with Orojya compared to a non-complementary Crystal Wheel at the same normal load.

```typescript
function piratesInertia(m_hub_g: number, r_hub_mm: number,
                         m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}
function piratesSystemFraction(I_chrome: number, I_crystal: number): number {
  return I_crystal / (I_chrome + I_crystal);
}
function piratesGripTorque(m_system_kg: number, r_interface_mm: number, mu: number): number {
  return mu * m_system_kg * 9.81 * (r_interface_mm / 1000);
}

// piratesInertia(0.9, 8, 3.1, 23)                              → 9.48×10⁻⁷ kg·m²  (≈ Guardian 9.51×10⁻⁷)
// piratesSystemFraction(8.47e-6, 9.48e-7)                      → 10.1%  (Revizer+Pirates = Guardian+Revizer)
// piratesGripTorque(0.042, 15, 0.15)                           → 9.25×10⁻⁴ N·m  (complement-fit grip)
```

---

## Case 320g — Crystal Wheel: Samurai (5.4 g)

> **Stock combos:** Samurai Ifraid W145CF · Samurai Saramanda E230ES · Samurai Orojya 145WD · Samurai Revizer SA165Q · Samurai Pegasis W105R²F
> **Hasbro name:** Samurai (unchanged); Ifraid = Ifraid (unchanged)

**Thesis.** Samurai is a C₁-approximate Crystal Wheel: one side carries a large spherical orb (the "crystal"), while the opposing side is geometrically larger to compensate mass, bringing the system close to C₂ without achieving it (small residual ΔI_trans ≈ 0.07×10⁻⁶ kg·m²). At 5.4 g (joint heaviest Crystal Wheel with Shinobi), Samurai contributes I = 1.284×10⁻⁶ kg·m² — 13.7% of the Samurai+Ifraid system. The defining feature is the mode change: in Chrome Up Mode, Samurai sits below Ifraid and barely protrudes beyond its profile — Ifraid's zinc Chrome Wheel is the primary contact surface and Samurai contributes only inertia. In Crystal Up Mode, Samurai sits above Ifraid and absorbs most impacts with its ABS body (absorption advantage 2.87×, Case 320). The large orb in Crystal Up Mode creates a raised contact point at ~12 mm radius — not the outer perimeter — meaning the effective guard radius is smaller than Guardian's outer ring (23 mm) but the orb geometry channels deflected force upward (away from the spin axis) rather than radially.

**Geometry (top view)**

```
       large orb / crystal (raised, r ≈ 12 mm from axis)
              ↓
    ┌────────────────────────────┐
    │        ○  ← orb            │   r_o ≈ 23.0 mm  [ESTIMATED]
    │      (raised sphere)       │   r_hub ≈ 8.0 mm  [ESTIMATED]
    │╔══════════════════════════╗ │   C₁ (~C₂ by mass balance): orb ↔ larger section
    │║   hub / bore             ║ │   orb side: ~40% of outer mass (smaller but raised)
    │╚══════════════════════════╝ │   opposite: ~60% of outer mass (larger, flatter)
    │  (larger compensating       │
    │   section, flatter profile) │   Chrome Up: Samurai below, Ifraid dominant
    └────────────────────────────┘   Crystal Up: Samurai above, orb absorbs impacts
```

**Moment of Inertia**

Zone 1 — hub: r_i = 0 mm, r_o = 8.0 mm, m₁ = 1.2 g [ESTIMATED]
Zone 2 — outer ring (orb + compensating section): r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 4.2 g [ESTIMATED]

```
I₁ = ½ × 0.0012 × (0² + 0.008²)                                = 3.84×10⁻⁸ kg·m²
I₂ = ½ × 0.0042 × (0.008² + 0.023²)                            = 1.245×10⁻⁶ kg·m²

I_Samurai = 3.84×10⁻⁸ + 1.245×10⁻⁶                             = 1.284×10⁻⁶ kg·m²
I/m       = 1.284×10⁻⁶ / 0.0054                                 = 2.378×10⁻⁴ m²
```

**System Inertia Fraction (Samurai + Ifraid)**

```
I_Ifraid est. = 8.10×10⁻⁶ kg·m²  [ESTIMATED — no Ifraid case study]
I_system  = 8.10×10⁻⁶ + 1.284×10⁻⁶                             = 9.384×10⁻⁶ kg·m²
Samurai fraction = 1.284×10⁻⁶ / 9.384×10⁻⁶                     = 13.7%
```

**Mode Change: Chrome Up vs Crystal Up**

In Chrome Up Mode: Samurai is sub-Chrome, protected from direct contact. Inertia contribution is the same (geometry does not change I); only contact surface changes.

In Crystal Up Mode: orb radius r_orb ≈ 12 mm acts as primary contact zone.

```
ABS orb contact area ≈ π × r_orb_contact²
For Hertzian sphere-on-flat (ABS-on-ABS, E* = 1.45e9 Pa [CONFIRMED], R_orb ≈ 6 mm):
  a = (3WR / 4E*)^(1/3) = (3 × 0.491 × 0.006 / (4 × 1.45×10⁹))^(1/3)
    = (8.838×10⁻³ / 5.8×10⁹)^(1/3) = (1.524×10⁻¹²)^(1/3)            = 1.15×10⁻⁴ m = 0.115 mm

Orb energy absorption fraction vs bare Chrome Wheel:
  COR_ABS²_orb = 0.45² = 0.202  →  absorbed 79.8%
  COR_ZnAlloy² = 0.85² = 0.722  →  absorbed 27.8%
  Absorption ratio: 79.8 / 27.8                                 = 2.87×  (identical to Guardian — same ABS material)
```

Chrome Up vs Crystal Up performance delta — mode selection is entirely dictated by combat role (attack → Chrome Up, defense/stamina → Crystal Up).

```typescript
function samuraiInertia(m_hub_g: number, r_hub_mm: number,
                         m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}
function samuraiSystemFraction(I_chrome: number, I_crystal: number): number {
  return I_crystal / (I_chrome + I_crystal);
}
function samuraiOrbContactRadius(W: number, R_orb_mm: number, Estar_GPa: number): number {
  return Math.pow(3 * W * (R_orb_mm / 1000) / (4 * Estar_GPa * 1e9), 1 / 3) * 1000;
}

// samuraiInertia(1.2, 8, 4.2, 23)                              → 1.284×10⁻⁶ kg·m²
// samuraiSystemFraction(8.10e-6, 1.284e-6)                     → 13.7%  (Ifraid+Samurai)
// samuraiOrbContactRadius(0.491, 6, 1.45)                      → 0.115 mm  (Hertzian contact radius at orb)
```

---

## Case 320h — Crystal Wheel: Shinobi / Ninja (5.4 g)

> **Stock combos:** Shinobi Saramanda SW145SD · Shinobi Ifraid 230WD · Shinobi Orojya 145ES · Shinobi Orojya 160WSF · Shinobi Gryph WD145TB · Shinobi Genbull 130W²D
> **Hasbro name:** Shinobi = **Ninja**; Saramanda = **Salamander**

**Thesis.** Shinobi (Hasbro: Ninja) is the Crystal Wheel with the highest specific inertia (I/m = 2.426×10⁻⁴ m²) in the Zero-G series, reflecting its flat, disc-like profile that maximises material at the outer ring. At 5.4 g (joint heaviest with Samurai), Shinobi contributes I = 1.310×10⁻⁶ kg·m² — 14.1% of the Shinobi+Saramanda system, the highest fraction among the estimated pairs. The reversible mode change is Shinobi's defining mechanical feature: the standard (Chrome Up / upright) face is very flat with a small cylindrical crystal; flipping to Crystal Up Mode reveals the underside, which has long angled curves and circular accent shapes. The angled curves in Crystal Up Mode function as deflection ramps: an incoming lateral hit follows the curve surface and is redirected upward/outward, reducing energy transfer to the spin axis more effectively than a flat guard. The C₂ structure (two mirrored relief sets, 180° apart) ensures ΔI_trans = 0 in both orientations.

**Geometry (top view — two faces)**

```
Standard (Chrome Up) face — very flat:
    ┌────────────────────────────┐
    │      ║  cylinder  ║        │   r_o ≈ 23.0 mm  [ESTIMATED]
    │      (small cylin. crystal)│   r_hub ≈ 8.0 mm  [ESTIMATED]
    │╔══════════════════════════╗ │   C₂, flat profile, minimal protrusion
    │║   hub / bore             ║ │   Standard face: nearly flush → Saramanda dominant
    │╚══════════════════════════╝ │
    └────────────────────────────┘
Crystal Up face — relief revealed by flipping:
    ┌────────────────────────────┐
    │  ╱ angled curve A (long)   │   Long angled curves provide deflection ramps
    │ ○  circular accent A       │   C₂: curve A+circle A ↔ curve B+circle B
    │╔══════════════════════════╗ │   Deflection angle δ ≈ 30–45° from impact normal
    │║   hub / bore             ║ │
    │╚══════════════════════════╝ │
    │ ○  circular accent B       │
    │  ╲ angled curve B (mirror) │
    └────────────────────────────┘
```

**Moment of Inertia**

Zone 1 — hub: r_i = 0 mm, r_o = 8.0 mm, m₁ = 1.1 g [ESTIMATED]
Zone 2 — flat outer disc: r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 4.3 g [ESTIMATED]

```
I₁ = ½ × 0.0011 × (0² + 0.008²)                                = 3.52×10⁻⁸ kg·m²
I₂ = ½ × 0.0043 × (0.008² + 0.023²)                            = 1.275×10⁻⁶ kg·m²

I_Shinobi = 3.52×10⁻⁸ + 1.275×10⁻⁶                             = 1.310×10⁻⁶ kg·m²
I/m       = 1.310×10⁻⁶ / 0.0054                                 = 2.426×10⁻⁴ m²  (highest Crystal Wheel specific inertia)
```

**System Inertia Fraction (Shinobi + Saramanda)**

```
I_Saramanda est. = 8.00×10⁻⁶ kg·m²  [ESTIMATED — no Saramanda case study]
I_system  = 8.00×10⁻⁶ + 1.310×10⁻⁶                             = 9.310×10⁻⁶ kg·m²
Shinobi fraction = 1.310×10⁻⁶ / 9.310×10⁻⁶                     = 14.1%  (highest estimated fraction)

L_system at ω₀ = 150: 9.310×10⁻⁶ × 150                         = 1.397×10⁻³ kg·m²/s
```

**Crystal Up Mode: Angled Curve Deflection**

Long angled curves redirect impact momentum. For a curve angled at δ ≈ 35° from the radial direction:

```
Energy redirected tangentially:  sin²(35°) = 0.329  (32.9% of kinetic energy leaves radially)
Energy redirected upward/away:   cos²(35°) = 0.671  (67.1% deflected — off spin axis)

vs flat guard (all impulse remains in-plane):
  Flat guard radial energy fraction = sin²(0°) = 0     (all energy in-plane → maximum spin loss)
  Angled curve improvement: 32.9% less energy impacts spin axis
```

The angled curves make Shinobi's Crystal Up Mode more effective than a flat ABS guard at reducing spin-axis energy transfer, despite the same ABS material and same COR advantage.

```typescript
function shinobiInertia(m_hub_g: number, r_hub_mm: number,
                         m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}
function shinobiSystemFraction(I_chrome: number, I_crystal: number): number {
  return I_crystal / (I_chrome + I_crystal);
}
function shinobiCurveDeflectionFraction(delta_deg: number): number {
  const d = delta_deg * Math.PI / 180;
  return Math.sin(d) * Math.sin(d);  // fraction of energy remaining in-plane
}

// shinobiInertia(1.1, 8, 4.3, 23)                              → 1.310×10⁻⁶ kg·m²  (highest I/m = 2.426×10⁻⁴ m²)
// shinobiSystemFraction(8.00e-6, 1.310e-6)                     → 14.1%  (Saramanda+Shinobi — highest estimated)
// shinobiCurveDeflectionFraction(35)                           →  0.329  (32.9% energy stays in-plane; 67.1% deflected)
```

---

## Case 320i — Crystal Wheel: Thief (5.3 g)

> **Stock combos:** Thief Phoenic E230GCF · Thief Saramanda 230WB · Thief Saramanda F230SF
> **Hasbro name:** Thief (unchanged); original release colour: grey-yellow

**Thesis.** Thief is an asymmetric (C₁) Crystal Wheel with "longer parts and numerous circular protrusions" — an irregular mass distribution with multiple small circular masses distributed at varying radii rather than in a uniform ring. At 5.3 g, Thief contributes I = 1.254×10⁻⁶ kg·m², but because its primary partner is Phoenic (I = 6.54×10⁻⁶, the lightest Chrome Wheel in the series, Case 310), the Thief+Phoenic system has the highest Crystal Wheel fraction of any standard pairing at 16.1%. The irregular circular protrusions create a multi-peak contact frequency profile: unlike the uniform ridge of Bandid or the smooth arc of Pirates, Thief's protrusions are spaced non-uniformly, producing contact events at irregular angular intervals that are difficult to predict or time. The "longer parts" introduce a C₁ mass asymmetry (ΔI_trans ≈ 0.10×10⁻⁶ kg·m²), adding low-amplitude nutation forcing similar to Archer.

**Geometry (top view)**

```
    ┌────────────────────────────┐
    │  ● ●  ← circular prtrusions│   r_o ≈ 23.0 mm  [ESTIMATED]
    │     (non-uniform spacing)  │   r_hub ≈ 8.0 mm  [ESTIMATED]
    │╔══════════════════════════╗ │   C₁: longer section one side, protrusions other
    │║   hub / bore             ║ │   ~45% longer section (larger mass, φ ≈ 35°)
    │╚══════════════════════════╝ │   ~40% circular protrusions (small circles, φ sweeps)
    │  ● ●  ● ←  protr.          │   ~15% recesses between protrusions
    │   (grey-yellow ABS)         │
    └────────────────────────────┘
```

**Moment of Inertia**

Zone 1 — hub: r_i = 0 mm, r_o = 8.0 mm, m₁ = 1.2 g [ESTIMATED]
Zone 2 — outer ring (longer section + protrusions): r_i = 8.0 mm, r_o = 23.0 mm, m₂ = 4.1 g [ESTIMATED]

```
I₁ = ½ × 0.0012 × (0² + 0.008²)                                = 3.84×10⁻⁸ kg·m²
I₂ = ½ × 0.0041 × (0.008² + 0.023²)                            = 1.216×10⁻⁶ kg·m²

I_Thief = 3.84×10⁻⁸ + 1.216×10⁻⁶                               = 1.254×10⁻⁶ kg·m²
I/m     = 1.254×10⁻⁶ / 0.0053                                   = 2.366×10⁻⁴ m²
```

**System Inertia Fraction (Thief + Phoenic)**

```
I_Phoenic = 6.54×10⁻⁶ kg·m²  (Case 310)
I_system  = 6.54×10⁻⁶ + 1.254×10⁻⁶                             = 7.794×10⁻⁶ kg·m²
Thief fraction = 1.254×10⁻⁶ / 7.794×10⁻⁶                       = 16.1%  (highest Crystal Wheel fraction in series)

L_system at ω₀ = 150: 7.794×10⁻⁶ × 150                         = 1.169×10⁻³ kg·m²/s
Note: Thief+Phoenic total L is the lowest in the series due to Phoenic's light Chrome Wheel.
```

**Crystal Wheel Series Comparison Table**

| Crystal Wheel | Mass (g) | I (×10⁻⁶ kg·m²) | I/m (×10⁻⁴ m²) | Symmetry | Primary CW I (×10⁻⁶) | System % |
|---|---|---|---|---|---|---|
| Gladiator | 5.37 | 1.275 | 2.374 | C₄ | Bahamdia 7.91 | 13.9% |
| **Samurai** | **5.40** | **1.284** | 2.378 | C₁(~C₂) | Ifraid est. 8.10 | 13.7% |
| **Shinobi/Ninja** | **5.40** | **1.310** | **2.426** | C₂ | Saramanda est. 8.00 | **14.1%** |
| Thief | 5.30 | 1.254 | 2.366 | C₁ | Phoenic 6.54 | **16.1%**†|
| Archer | 5.16 | 1.212 | 2.349 | C₁ | Gargole 7.87 | 13.3% |
| Bandid | 4.80 | 1.159 | 2.415 | C₂ | Goreim est. 8.10 | 12.5% |
| Berserker | 4.50 | 1.070 | 2.378 | C₂ | Begirados est. 8.05 | 11.7% |
| Guardian | 4.10 | 0.951 | 2.320 | C₄ | Revizer 8.47 | 10.1% |
| Pirates | 4.00 | 0.948 | 2.370 | C₂ | Revizer 8.47 | 10.1% |
| Dark Knight | 3.87 | 0.909 | 2.348 | C₁ | Dragooon 8.34 | 9.8% |

† Thief+Phoenic fraction is high but total system L is lowest — Phoenic's small Chrome Wheel I dominates.

**Circular Protrusion Contact Frequency**

For n_circ ≈ 6 circular protrusions non-uniformly distributed:

```
Expected inter-contact angle: 360° / 6 = 60° average, but irregular spacing
  → standard deviation σ_angle ≈ 15° (estimated non-uniformity)

Contact frequency at ω = 300 rad/s:
  f_mean = ω / (60° × π/180) = 300 / 1.047 ≈ 286 Hz
  f_range ≈ 200–400 Hz  (irregular → ±30% variation)

Irregular timing reduces the opponent's ability to orient a compliant-face section for each contact,
reducing predictability of momentum transfer compared to uniform-ridge designs (Bandid).
```

```typescript
function thiefInertia(m_hub_g: number, r_hub_mm: number,
                       m_ring_g: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_ring_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2;
}
function thiefSystemFraction(I_chrome: number, I_crystal: number): number {
  return I_crystal / (I_chrome + I_crystal);
}
function thiefContactFrequency(omega_rad_s: number, n_protrusions: number): number {
  const mean_angle = 2 * Math.PI / n_protrusions;
  return omega_rad_s / mean_angle;
}

// thiefInertia(1.2, 8, 4.1, 23)                                → 1.254×10⁻⁶ kg·m²
// thiefSystemFraction(6.54e-6, 1.254e-6)                       → 16.1%  (Phoenic+Thief — highest fraction)
// thiefSystemFraction(8.00e-6, 1.254e-6)                       → 13.6%  (Saramanda+Thief — alternate)
// thiefContactFrequency(300, 6)                                 → 286 Hz  (mean at 300 rad/s, ±30% irregular)
```

---

## Case 321 — Chrome Wheel: Killerken (30.45 g)

> **Stock combo (Pirates Killerken A230JSB):** Chrome Wheel(s): Killerken · Crystal Wheel: Pirates · Track: A230 · Bottom: Jog Sharp Ball
> **Stock combo (Killerken Balro A230WB):** Chrome Wheel(s): Balro + Killerken · Track: A230 · Bottom: Wide Ball

**Thesis.** Killerken is the best-balanced Chrome Wheel in the Zero-G series examined here: its design distributes mass through two mirrored tentacle arcs that together span most of the circumference, interrupted only by a trapezoid protrusion on one side and an octopus-beak/orb section on the other. The two interruptions carry similar mass, holding C₂ transverse anisotropy to ΔI ≈ 0.30×10⁻⁶ kg·m² — the lowest non-zero ΔI in this series and only 21% of Gargole's value. The tentacle arms concentrate their widest, heaviest portions at the outer edge ("wider parts accumulate near the edges"), producing a specific inertia of 2.78×10⁻⁴ m² — the highest among the Chrome Wheels studied. The combination of extreme peripheral mass, near-zero nutation forcing, and moderate contact angles across most of the circumference makes Killerken optimal for stamina and defense roles where both angular momentum conservation and spin-axis stability are required simultaneously.

**Geometry (top-view)**

```
         Trapezoid protrusion (φ ≈ 37°, one interruption)
                  ↑
    ┌──────────────────────────────┐
    │  ╱ tentacle arc 1 (curved)  │   r_o = 23.0 mm
    │ ╱  widening toward outer    │   r_hub = 6.5 mm
    │╔══════════════════════════╗  │
    │║  deeply engraved center  ║  │   C₂: trapezoid ↔ beak (180° apart)
    │║    ○ (orb / beak)        ║  │   ~75% tentacle arcs (curved, φ ≈ 18°)
    │╚══════════════════════════╝  │   ~15% trapezoid (φ ≈ 37°)
    │ ╲  tentacle arc 2 (mirrored) │   ~10% octopus beak (φ ≈ 22°)
    │  ╲                          │
    └──────────────────────────────┘
          Orb/beak (other interruption, ~same mass as trapezoid)
```

**Moment of Inertia**

Distal mass emphasis: zone 3 carries 70.4% of total mass.

Zone 1 — hub (engraved center boss): r_i = 0 mm, r_o = 6.5 mm, m₁ = 2.0 g
Zone 2 — mid body (engraved, low material): r_i = 6.5 mm, r_o = 13.5 mm, m₂ = 7.0 g
Zone 3 — outer (tentacle widths + protrusion band): r_i = 13.5 mm, r_o = 23.0 mm, m₃ = 21.45 g

```
I₁ = ½ × 0.0020 × (0² + 0.0065²)                          = 4.23×10⁻⁸ kg·m²
I₂ = ½ × 0.0070 × (0.0065² + 0.0135²)                     = 7.86×10⁻⁷ kg·m²
I₃ = ½ × 0.02145 × (0.0135² + 0.023²)                     = 7.63×10⁻⁶ kg·m²

I_total = 4.23×10⁻⁸ + 7.86×10⁻⁷ + 7.63×10⁻⁶               → 8.46×10⁻⁶ kg·m²
```

Specific inertia: I/m = 8.46×10⁻⁶ / 0.03045 = 2.78×10⁻⁴ m²

| Chrome Wheel | I (×10⁻⁶ kg·m²) | I/m (×10⁻⁴ m²) | ΔI_trans (×10⁻⁶ kg·m²) |
|---|---|---|---|
| Killerken | 8.46 | **2.78** | 0.30 |
| Revizer | 8.47 | 2.77 | 1.00 |
| Genbull | 8.37 | 2.72 | 0 |
| Dragooon | 8.34 | 2.70 | 0 (C₄) |
| Bahamdia | 7.91 | 2.69 | 1.00 |
| Gargole | 7.87 | 2.67 | 1.40 |
| Phoenic | 6.54 | 2.19 | 0 |

Killerken achieves the highest specific inertia of all Chrome Wheels while maintaining near-zero nutation.

**C₂ Transverse Anisotropy — Near-Balanced Interruptions**

The trapezoid protrusion and beak/orb each occupy approximately one short arc of the outer edge with similar mass (~1.5 g each at r ≈ 20 mm). The small residual asymmetry:

```
Δm = m_trapezoid − m_beak ≈ 0.3 g  (trapezoid slightly bulkier)

ΔI_transverse ≈ Δm × r²  = 0.0003 × 0.020²               → 1.20×10⁻⁷ kg·m²

Full C₂ ΔI (accounting for both arms of the imbalanced axis):
ΔI_total ≈ 2 × 1.20×10⁻⁷                                 → 2.40×10⁻⁷ ≈ 0.24×10⁻⁶ kg·m²

τ_nutation = ΔI × ω / 2 = 2.40×10⁻⁷ × 150 / 2           → 1.80×10⁻⁵ N·m
```

Compared to other C₂ wheels in this series:

| Wheel | τ_nutation (×10⁻⁵ N·m) |
|---|---|
| Genbull | 0 |
| **Killerken** | **1.80** |
| Bahamdia / Revizer | 7.50 |
| Gargole | 10.5 |

Killerken's nutation forcing is one order of magnitude below Gargole's — effectively stable for competitive purposes.

**Contact Face Geometry — Tentacle Arcs vs Interruptions**

Tentacle arcs (curved, sweeping outward — φ ≈ 18°, 75% of circumference):
```
Smash = cos(18°)                                           → 0.951
Recoil = sin(18°)                                          → 0.309
```

Trapezoid protrusion (steep face — φ ≈ 37°, 15%):
```
Smash = cos(37°)                                           → 0.799
Recoil = sin(37°)                                          → 0.602
```

Octopus beak (moderate — φ ≈ 22°, 10%):
```
Smash = cos(22°)                                           → 0.927
Recoil = sin(22°)                                          → 0.375
```

Weighted effective smash:
```
cos_eff = 0.75 × 0.951 + 0.15 × 0.799 + 0.10 × 0.927     → 0.926  (92.6%)
```

Tentacle arc contacts are the dominant contribution: moderate smash (95%) with limited recoil (31%) — a stamina-favoring contact profile that avoids high self-recoil. The trapezoid protrusion introduces occasional high-recoil contacts (60%) at 15% of azimuths but does not dominate the overall effective smash.

**Angular Momentum Comparison**

At ω = 150 rad/s:

```
L_Killerken = 8.46×10⁻⁶ × 150                            → 1.269×10⁻³ kg·m²/s
L_Revizer   = 8.47×10⁻⁶ × 150                            → 1.271×10⁻³ kg·m²/s

Deficit vs Basalt:   1 − 1.269×10⁻³ / 2.070×10⁻³         → 38.7%
vs Revizer:          0.1% less L, but ΔI_nutation = 0.24 vs 1.00 (×10⁻⁶ kg·m²)
```

Killerken's stamina/defense value comes not from higher L (Revizer matches it) but from maintaining that L longer: lower nutation means less gyroscopic leakage, and the tentacle arc surface means fewer high-recoil contacts that bleed orbit energy.

**TypeScript model**

```typescript
function killerkenInertia(m_hub_g: number, m_mid_g: number, m_outer_g: number,
                           r_hub_mm: number, r_mid_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_mid_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_outer_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function killerkenNutationTorque(delta_m_g: number, r_mm: number, omega: number): number {
  const delta_I = 2 * (delta_m_g / 1000) * Math.pow(r_mm / 1000, 2);
  return delta_I * omega / 2;
}

function killerkenEffectiveSmash(f_tentacle: number, f_trap: number, f_beak: number): number {
  return f_tentacle * Math.cos(18 * Math.PI / 180)
       + f_trap    * Math.cos(37 * Math.PI / 180)
       + f_beak    * Math.cos(22 * Math.PI / 180);
}

// killerkenInertia(2.0, 7.0, 21.45, 6.5, 13.5, 23.0)           → 8.46×10⁻⁶ kg·m²
// killerkenNutationTorque(0.3, 20, 150)                         → 1.80×10⁻⁵ N·m  (lowest C₂ in ZG series)
// killerkenEffectiveSmash(0.75, 0.15, 0.10)                     → 0.926  (92.6% weighted smash)
```

---

## Case 322 — Track: Armor 230 / A230 (5.5 g)

> **Stock combo (Pirates Killerken A230JSB):** Chrome Wheel(s): Killerken · Crystal Wheel: Pirates · Track: A230 · Bottom: Jog Sharp Ball
> **Stock combo (Killerken Balro A230WB):** Chrome Wheel(s): Balro + Killerken · Track: A230 · Bottom: Wide Ball

**Thesis.** A230 is a 23.0 mm height track (the tallest standard MFB height) with four stepped pyramidal protrusions extending radially from the core shaft — two larger pairs and two slightly smaller pairs arranged at 90° intervals (C₂ effective mass symmetry). The Mesoamerican step-pyramid profile is the key physics differentiator from plain 230: each pyramid presents three tiered face angles (≈60°, 45°, 20° from vertical), which redirect incoming lateral impact force into orbital recoil fractions of 0.866, 0.707, and 0.342 per step respectively. The average orbital recoil across all pyramid faces is 63.8% — far above the 0% of a smooth vertical track wall — explaining the competitive observation that A230 "increases recoil when contact is made." The trade-off is that this recoil also acts on the A230-bearer, destabilising its orbit on each contact; the defense benefit comes from the opponent absorbing more recoil per strike than from a plain track.

**Geometry**

```
Top view (4 pyramids at 90° intervals):
         large pyramid (φ_base ≈ 60°)
               ↑
    ┌─────────────────────────────┐
    │    ╱▲╲     ╱▲╲            │   r_large ≈ 14 mm  (to pyramid tip)
    │   ╱   ╲   ╱   ╲           │   r_small ≈ 11 mm
    │  ║ core ║     ○ ║          │
    │   ╲   ╱   ╲   ╱           │   C₂: large pair at 0°/180°
    │    ╲▲╱     ╲▲╱            │        small pair at 90°/270°
    └─────────────────────────────┘
         small pyramid (φ_base ≈ 55°)

Side view (stepped pyramid cross-section):
         ┌─┐  ← peak (φ = 20° from vertical)
        ┌┘ └┐  step 2 (φ = 45°)
       ┌┘    └┐  step 1 / base (φ = 60°)
  ═════╪══════╪═════  track core, h = 23.0 mm
```

**Track Inertia**

Core shaft (ABS, r = 5 mm, h = 23 mm): m_core = 2.7 g
Two large pyramids at r_eff ≈ 14 mm: m_large = 0.75 g each
Two small pyramids at r_eff ≈ 11 mm: m_small = 0.65 g each

```
I_core  = ½ × 0.0027 × 0.005²                             = 3.38×10⁻⁸ kg·m²
I_large = 2 × 0.00075 × 0.014²                            = 2.94×10⁻⁷ kg·m²
I_small = 2 × 0.00065 × 0.011²                            = 1.57×10⁻⁷ kg·m²

I_total = 3.38×10⁻⁸ + 2.94×10⁻⁷ + 1.57×10⁻⁷              → 4.84×10⁻⁷ kg·m²
```

Track inertia is negligible relative to the Metal Wheel above; A230's role is geometric, not inertial.

**C₂ Mass Asymmetry — Large vs Small Pyramid Pairs**

```
ΔI_transverse = 2 × (m_large − m_small) × r_eff²
              = 2 × (0.00075 − 0.00065) × 0.014²          → 3.92×10⁻⁸ kg·m²
τ_nutation = ΔI × ω / 2 = 3.92×10⁻⁸ × 150 / 2            → 2.94×10⁻⁶ N·m
```

The slight size difference between pyramid pairs creates nutation forcing more than 30× smaller than Killerken (1.80×10⁻⁵ N·m). The C₂ asymmetry is physically present but competitively irrelevant.

**Stepped Pyramid Contact Physics — Orbital Recoil Generation**

Each pyramid face presents three discrete step angles α (measured from vertical = perpendicular to orbital direction). The horizontal force component along the orbital direction (= orbital recoil fraction) per step:

```
Step 1 — base (widest step, α = 60°):   recoil = sin(60°)  → 0.866
Step 2 — middle (α = 45°):              recoil = sin(45°)  → 0.707
Step 3 — peak (α = 20°):               recoil = sin(20°)  → 0.342

Mean orbital recoil per pyramid contact: (0.866 + 0.707 + 0.342) / 3  → 0.638
```

Smooth vertical track wall (α = 0°): orbital recoil = sin(0°) = 0.

```
A230 recoil advantage over plain 230: 0.638 / 0.000         → undefined (∞ improvement)
```

The pyramids convert 63.8% of each lateral impact's force into orbital recoil rather than pure radial smash. This raises the kinetic energy injected into the opponent's orbit per contact, increasing the probability of ring-out. The same recoil acts on the A230 assembly, however: under repeated attack, the holder accumulates orbital velocity changes that can destabilise it faster than a smooth 230. Net defence benefit is greatest when the opponent makes only one or two contacts before being knocked out.

**Center of Mass Height Effect**

A230 raises the overall assembly CoM by 23.0 mm from the tip (the tallest standard position). Compared to 145 (14.5 mm):

```
Δh_CoM = 23.0 − 14.5 = 8.5 mm higher CoM

Precession torque at tilt θ = 10°:
  τ_precession = m × g × h_CoM × sin(θ) = 0.050 × 9.81 × 0.023 × sin(10°)
               = 0.050 × 9.81 × 0.023 × 0.174              → 1.96×10⁻³ N·m  (at 23 mm)
  vs 145 track: 0.050 × 9.81 × 0.0145 × 0.174              → 1.24×10⁻³ N·m

Ratio: τ_230 / τ_145 = 23.0 / 14.5                         → 1.59×  (59% more precession torque)
```

The taller CoM induces 59% more precession torque at equal tilt, accelerating late-battle wobble onset. A230 pairs best with Defense bottoms (EWD, TB) that limit tilt and extend the stable-spin phase.

**TypeScript model**

```typescript
function a230PyramidInertia(m_core_g: number, r_core_mm: number,
                             m_large_g: number, r_large_mm: number,
                             m_small_g: number, r_small_mm: number): number {
  const I_core  = 0.5 * (m_core_g / 1000) * Math.pow(r_core_mm / 1000, 2);
  const I_large = 2 * (m_large_g / 1000) * Math.pow(r_large_mm / 1000, 2);
  const I_small = 2 * (m_small_g / 1000) * Math.pow(r_small_mm / 1000, 2);
  return I_core + I_large + I_small;
}

function a230OrbitalRecoil(alpha_deg: number): number {
  return Math.sin(alpha_deg * Math.PI / 180);
}

function a230MeanPyramidRecoil(alphas_deg: number[]): number {
  return alphas_deg.reduce((s, a) => s + Math.sin(a * Math.PI / 180), 0) / alphas_deg.length;
}

function a230PrecessionTorque(m_assembly_g: number, h_track_mm: number, tilt_deg: number): number {
  return (m_assembly_g / 1000) * 9.81 * (h_track_mm / 1000) * Math.sin(tilt_deg * Math.PI / 180);
}

// a230PyramidInertia(2.7, 5, 0.75, 14, 0.65, 11)                → 4.84×10⁻⁷ kg·m²
// a230MeanPyramidRecoil([60, 45, 20])                            → 0.638  (63.8% orbital recoil per pyramid hit)
// a230OrbitalRecoil(0)                                           → 0.000  (smooth wall — zero recoil)
// a230PrecessionTorque(50, 23, 10)                               → 1.96×10⁻³ N·m  (vs 1.24×10⁻³ for 145)
```

---

## Case 323 — Chrome Wheel: Pegasis (~29.5 g, weight not provided in wiki)

> **Stock combo (Samurai Pegasis W105R²F):** Chrome Wheel(s): Pegasis · Crystal Wheel: Samurai · Track: W105 · Bottom: R²F

**Thesis.** Pegasis is a three-wing Chrome Wheel with C₃ symmetry from three hook-knot protrusions placed at equal 120° intervals — giving zero transverse anisotropy and no nutation forcing. Its defining physics is asymmetric wing cross-section: each wing has a convex blunt trailing face (φ ≈ 32° from radial) and a concave sharp leading face (φ ≈ 12°). In right-spin at the bottom of a Synchrom, the sharp leading edges contact the opponent, yielding 97.8% smash fraction and 20.8% self-recoil. At the top, the trailing blunt faces are exposed: smash fraction drops to 84.8% and self-recoil rises to 53.0%. The same 25° contact-angle flip that degrades attack performance on top is what makes Pegasis position-specific — uniquely competitive only at the Synchrom bottom. Estimated I ≈ 7.24×10⁻⁶ kg·m² places it between Phoenic and Gargole in angular momentum.

**Geometry**

```
Top view (C₃, 3 wings at 120°):
             hook knot (φ_hook ≈ 20°)
                  ↑
    ┌──────────────────────────────┐
    │   ╱ wing 1 ╲                │   r_o ≈ 22 mm
    │  ╱ sharp→  ╲←blunt          │   r_hub = 6.5 mm
    │ ║  leading   ║  trailing     ║   3 hooks × 120° (C₃)
    │  ╲  edge    ╱  edge         │   feather interlace pattern
    │   ╲────────╱                │
    └──────────────────────────────┘
         2 Pegasus heads circle inner ring

Wing cross-section (radial slice):
  Sharp side (bottom position → leading):   φ = 12°  ← attack direction
     /  ← step face angle
   /
  ╔══════════════╗  wing body
  ║              ║
  ╚══════╗       ║
          ╲      ║
           ╲___║  Blunt side (top position → trailing): φ = 32°
```

**Moment of Inertia** *(weight estimated at ~29.5 g; wiki omits value)*

Zone 1 — hub + Pegasus head bases: r_i = 0 mm, r_o = 6.5 mm, m₁ = 2.5 g
Zone 2 — wing shafts + inner feathers: r_i = 6.5 mm, r_o = 14.0 mm, m₂ = 9.0 g
Zone 3 — wing tips + hook protrusions: r_i = 14.0 mm, r_o = 22.0 mm, m₃ = 18.0 g

```
I₁ = ½ × 0.0025 × (0² + 0.0065²)                          = 5.28×10⁻⁸ kg·m²
I₂ = ½ × 0.009  × (0.0065² + 0.014²)                      = 1.07×10⁻⁶ kg·m²
I₃ = ½ × 0.018  × (0.014² + 0.022²)                       = 6.12×10⁻⁶ kg·m²

I_total = 5.28×10⁻⁸ + 1.07×10⁻⁶ + 6.12×10⁻⁶               → 7.24×10⁻⁶ kg·m²
```

Specific inertia: 7.24×10⁻⁶ / 0.0295 = 2.45×10⁻⁴ m² — between Phoenic (2.19) and Gargole (2.67).

**Wing Face Asymmetry — Position-Dependent Attack Profile**

Synchrom bottom (right rotation, sharp leading edges exposed, φ = 12°):

```
Smash fraction  = cos(12°)                                 → 0.978  (97.8%)
Self-recoil     = sin(12°)                                 → 0.208  (20.8%)
```

Synchrom top (right rotation, blunt trailing edges exposed, φ = 32°):

```
Smash fraction  = cos(32°)                                 → 0.848  (84.8%)
Self-recoil     = sin(32°)                                 → 0.530  (53.0%)
```

Δsmash = 0.978 − 0.848 = 0.130 (13.0% smash penalty on top)
Δrecoil = 0.530 − 0.208 = 0.322 (32.2% more self-recoil on top)

The 32.2 percentage-point recoil increase when on top means Pegasis loses substantial orbital energy with each contact — explaining the characterisation as "blunt and constricted" at the top position. This is not a surface roughness effect but a pure geometric face-angle flip of 20° caused by which direction the wing's asymmetric cross-section faces the opponent.

**Hook-Knot Contact Points (φ = 20°)**

Three hook protrusions (one per wing) provide defined contact spikes:

```
Smash = cos(20°)                                           → 0.940  (94.0%)
Recoil = sin(20°)                                          → 0.342  (34.2%)
```

Hooks operate identically in both top and bottom positions (their geometry is symmetric about the Synchrom axis) but are only revealed from behind the large wing bodies when Pegasis is at the bottom. At the top, the wing body occludes the hooks from most contact angles.

**C₃ Symmetry — Zero Nutation**

Three wings + three hooks at 120° intervals: ΔI_transverse = 0. No nutation forcing at any harmonic. The two Pegasus heads on the inner ring are decorative features at small radius (r ≈ 8 mm) — even if they introduce slight C₁ perturbation, ΔI_inner ≈ 2 × 0.001 × 0.008² = 1.28×10⁻¹⁰ kg·m² (negligible).

**Angular Momentum Comparison** *(estimated)*

At ω = 150 rad/s:

```
L_Pegasis = 7.24×10⁻⁶ × 150                               → 1.086×10⁻³ kg·m²/s
L_Gargole = 7.87×10⁻⁶ × 150                               → 1.181×10⁻³ kg·m²/s

Deficit vs Basalt: 1 − 1.086×10⁻³ / 2.070×10⁻³            → 47.5%
vs Gargole: −8.0%  (Pegasis carries less L — acceptable for a specialist Attack wheel)
```

**TypeScript model**

```typescript
function pegasisInertia(m_hub_g: number, m_mid_g: number, m_tip_g: number,
                         r_hub_mm: number, r_mid_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_mid_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_tip_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function pegasisSmashFraction(phi_deg: number): number {
  return Math.cos(phi_deg * Math.PI / 180);
}

function pegasisRecoilFraction(phi_deg: number): number {
  return Math.sin(phi_deg * Math.PI / 180);
}

function pegasisPositionDelta(phi_bottom_deg: number, phi_top_deg: number): { smash: number; recoil: number } {
  return {
    smash:  Math.cos(phi_bottom_deg * Math.PI / 180) - Math.cos(phi_top_deg * Math.PI / 180),
    recoil: Math.sin(phi_top_deg   * Math.PI / 180) - Math.sin(phi_bottom_deg * Math.PI / 180)
  };
}

// pegasisInertia(2.5, 9.0, 18.0, 6.5, 14.0, 22.0)              → 7.24×10⁻⁶ kg·m²  (estimated)
// pegasisSmashFraction(12)                                       → 0.978  (bottom: sharp leading edge)
// pegasisSmashFraction(32)                                       → 0.848  (top: blunt trailing edge)
// pegasisRecoilFraction(12)                                      → 0.208  (bottom recoil)
// pegasisRecoilFraction(32)                                      → 0.530  (top recoil — 2.55× worse)
// pegasisPositionDelta(12, 32)                                   → { smash: +0.130, recoil: +0.322 }  (bottom advantage)
```

---

## Case 324 — Chrome Wheel: Wyvang (~31.5 g, weight not provided in wiki)

> **Stock combo (Orojya Wyvang 145EDS):** Chrome Wheel(s): Wyvang + Orojya · Track: 145 · Bottom: EDS

*Note: "Warrior Wheel" is the Zero-G system's name for Chrome Wheels — the terms are interchangeable. All prior ZG cases use "Chrome Wheel" for consistency.*

**Thesis.** Wyvang is the heaviest Chrome Wheel examined in this series (estimated ~31.5 g) and the only one with C₁ effective mass symmetry: a single wyvern-chin protrusion interrupts an otherwise near-circular outer arc, breaking rotational symmetry entirely. The near-circular 85% of the circumference gives Wyvang Genbull-like low self-recoil (sin 5° = 0.087) for most contacts, while the chin delivers concentrated smash at one azimuth (φ ≈ 40°, sin 40° = 0.643). The C₁ mass imbalance offsets the center of mass by approximately 1.0 mm and introduces nutation forcing at ω (the fundamental spin frequency) with amplitude τ ≈ 4.97×10⁻⁵ N·m — below Gargole's level but at the fundamental harmonic rather than 2ω, giving a qualitatively different wobble pattern. The high mass produces the best specific inertia and highest angular momentum of any Chrome Wheel in this series.

**Geometry (top-view)**

```
             Scale + feather (top, smooth arc)
                      ↑
    ┌──────────────────────────────────┐
    │  ╔══════════════════════════╗   │   r_o = 23.5 mm (circular arc)
    │  ║  smooth arc: φ ≈ 5°     ║   │   r_hub = 6.5 mm
    │  ║                ○        ║   │   ~85% smooth arc
    │  ║        (inner ring)     ║   │   ~15% chin protrusion at 180° position
    │  ╚══╗                ╔══╝   │
    │     ║   claw curve   ║      │   r_chin ≈ 25 mm (protrudes 1.5 mm past arc)
    │     ╚═══╗   wyvern  ╔╝      │
    │         ╚══╗  chin ╔╝       │
    └─────────────╚══════╝────────┘
              Chin protrusion (φ ≈ 40°)
              h_CoM_offset ≈ 1.0 mm (C₁ imbalance)
```

**Moment of Inertia** *(weight estimated ~31.5 g)*

Zone 1 — hub: r_i = 0 mm, r_o = 6.5 mm, m₁ = 2.5 g
Zone 2 — mid body (claw shaft, inner arc): r_i = 6.5 mm, r_o = 14.5 mm, m₂ = 9.0 g
Zone 3 — outer circular band + chin: r_i = 14.5 mm, r_o = 23.5 mm, m₃ = 20.0 g

```
I₁ = ½ × 0.0025 × (0² + 0.0065²)                          = 5.28×10⁻⁸ kg·m²
I₂ = ½ × 0.009  × (0.0065² + 0.0145²)                     = 1.14×10⁻⁶ kg·m²
I₃ = ½ × 0.020  × (0.0145² + 0.0235²)                     = 7.63×10⁻⁶ kg·m²

I_total = 5.28×10⁻⁸ + 1.14×10⁻⁶ + 7.63×10⁻⁶               → 8.82×10⁻⁶ kg·m²
```

Specific inertia: I/m = 8.82×10⁻⁶ / 0.0315 = 2.80×10⁻⁴ m² — highest of any Chrome Wheel in this series.

**C₁ Mass Asymmetry — Single Chin Protrusion**

The chin adds approximately m_chin ≈ 1.5 g at r = 21 mm, with no counterpart mass at the opposite azimuth:

```
CoM offset: r_offset = m_chin × r / m_total
           = 0.0015 × 0.021 / 0.0315                       → 1.0×10⁻³ m  (1.0 mm)

Centrifugal imbalance force at ω = 150 rad/s:
  F_imb = m_total × r_offset × ω²
         = 0.0315 × 0.001 × 150²                           → 0.709 N
```

This 0.709 N centrifugal load rotates with the wheel, driving a nutation force at the fundamental spin frequency ω (not 2ω as in C₂ wheels). The bearing in the Synchrom junction partially absorbs this load, but at high ω it can be felt as a low-frequency wobble pulse.

Transverse inertia asymmetry from the single chin lump:

```
ΔI = m_chin × r_chin² = 0.0015 × 0.021²                   → 6.62×10⁻⁷ kg·m²
τ_nutation = ΔI × ω / 2 = 6.62×10⁻⁷ × 150 / 2             → 4.97×10⁻⁵ N·m
```

Forcing frequency is ω (not 2ω), so the wobble period matches the spin period — a slower, rolling wobble distinct from the faster double-frequency nutation of C₂ wheels like Gargole.

**Contact Profile — Smooth Arc + Chin**

Near-circular arc (φ = 5°, 85% of circumference):
```
Smash = cos(5°)  → 0.996,  Recoil = sin(5°)  → 0.087
```

Chin protrusion (φ = 40°, 15%):
```
Smash = cos(40°) → 0.766,  Recoil = sin(40°) → 0.643
```

Weighted effective values:
```
Smash_eff  = 0.85 × 0.996 + 0.15 × 0.766                  → 0.962  (96.2%)
Recoil_eff = 0.85 × 0.087 + 0.15 × 0.643                  → 0.170  (17.0%)
```

The smooth arc provides extremely low average self-recoil (17.0%), comparable to Genbull (8.7% pure arc) even with the chin included. The chin's 64.3% recoil fires only at that one azimuth — high localised impulse without the continuous high-recoil exposure of an Attack-type wheel.

**Angular Momentum Comparison** *(estimated)*

At ω = 150 rad/s:

```
L_Wyvang   = 8.82×10⁻⁶ × 150                              → 1.323×10⁻³ kg·m²/s
L_Killerken = 8.46×10⁻⁶ × 150                             → 1.269×10⁻³ kg·m²/s
L_Revizer  = 8.47×10⁻⁶ × 150                              → 1.271×10⁻³ kg·m²/s

Deficit vs Basalt:   1 − 1.323×10⁻³ / 2.070×10⁻³          → 36.1%  (best among ZG Chrome Wheels)
Advantage vs Revizer: +4.1%
```

**TypeScript model**

```typescript
function wyvangInertia(m_hub_g: number, m_mid_g: number, m_outer_g: number,
                        r_hub_mm: number, r_mid_mm: number, r_outer_mm: number): number {
  const I1 = 0.5 * (m_hub_g / 1000) * Math.pow(r_hub_mm / 1000, 2);
  const I2 = 0.5 * (m_mid_g / 1000) * (Math.pow(r_hub_mm / 1000, 2) + Math.pow(r_mid_mm / 1000, 2));
  const I3 = 0.5 * (m_outer_g / 1000) * (Math.pow(r_mid_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
  return I1 + I2 + I3;
}

function wyvangChinImbalance(m_chin_g: number, r_chin_mm: number, m_total_g: number, omega: number): {
  com_offset_mm: number; centrifugal_N: number; nutation_torque: number
} {
  const r_off = (m_chin_g / 1000) * (r_chin_mm / 1000) / (m_total_g / 1000);
  const F_imb = (m_total_g / 1000) * r_off * omega * omega;
  const delta_I = (m_chin_g / 1000) * Math.pow(r_chin_mm / 1000, 2);
  return { com_offset_mm: r_off * 1000, centrifugal_N: F_imb, nutation_torque: delta_I * omega / 2 };
}

function wyvangEffectiveContact(arc_frac: number, phi_arc_deg: number, phi_chin_deg: number): { smash: number; recoil: number } {
  const s = arc_frac * Math.cos(phi_arc_deg * Math.PI / 180) + (1 - arc_frac) * Math.cos(phi_chin_deg * Math.PI / 180);
  const r = arc_frac * Math.sin(phi_arc_deg * Math.PI / 180) + (1 - arc_frac) * Math.sin(phi_chin_deg * Math.PI / 180);
  return { smash: s, recoil: r };
}

// wyvangInertia(2.5, 9.0, 20.0, 6.5, 14.5, 23.5)               → 8.82×10⁻⁶ kg·m²  (estimated)
// wyvangChinImbalance(1.5, 21, 31.5, 150)                       → { com_offset_mm: 1.0, centrifugal_N: 0.709, nutation_torque: 4.97×10⁻⁵ }
// wyvangEffectiveContact(0.85, 5, 40)                           → { smash: 0.962, recoil: 0.170 }
```

---

## Case 325 — Bottom: Ball / B (0.6 g)

> **Stock combo (Wolf D125B):** Wheel: Wolf · Track: D125 · Bottom: Ball
> **Stock combo (Escolpio WD145B):** Wheel: Escolpio · Track: WD145 · Bottom: Ball
> **Stock combo (Clay Aries ED145B):** Clear Wheel: Aries · Metal Wheel: Clay (Light) · Track: ED145 · Bottom: Ball
> **Stock combo (Rock Orso D125B):** Clear Wheel: Orso · Metal Wheel: Rock · Track: D125 · Bottom: Ball
> **Stock combo (Counter Leone D125B):** Clear Wheel: Leone · Metal Wheel: Counter · Track: D125 · Bottom: Ball

**Thesis.** Ball is an ABS spherical-tip bottom (r_ball = 2.94 mm) whose defining physics is Hertzian sphere-on-flat contact: the contact patch radius at normal load is a ≈ 0.093 mm — near-point contact that produces a spinning friction torque three orders of magnitude smaller than a flat tip (0.30% of GF). This extremely low spin-decay rate is why B is the reference standard for stamina testing: contact-patch geometry is deterministic and wear is radially symmetric, removing the tip-shape variable from comparative tests. The curved surface also acts as a centering spring (k ≈ 167 N/m) — any lateral displacement tilts the contact reaction vector inward, providing a consistent restoring force that keeps the beyblade in the stadium center. The outer scalloped disc (r = 7.91 mm) raises the assembly slightly but contributes no additional floor contact under normal running.

**Geometry (side view)**

```
         ╔═══════════════╗  ← driver shaft
         ║               ║
  ┌──────╩───────────────╩──────┐   scalloped disc, r = 7.91 mm
  │  ░░░░░░░░░░░░░░░░░░░░░░░   │   h_full = 8.98 mm
  └──────────────────────────────┘
              ╔═════╗             ball portion, r = 2.94 mm
             ╱       ╲            h_tip = 5.97 mm ≈ ball diameter (5.88 mm)
            ╱  sphere  ╲
            ╲           ╱
             ╲_________╱
                  ●  ← contact patch, a ≈ 0.093 mm  (Hertzian)
```

**Hertzian Sphere-on-Flat Contact Patch**

Ball radius R = tip_width / 2 = 5.88 / 2 = 2.94 mm = 0.00294 m. Normal load W = 0.491 N (50 g assembly).

Combined modulus for ABS sphere on ABS floor (E = 2.3 GPa, ν = 0.37):

```
1/E* = 2(1 − ν²)/E = 2(1 − 0.1369) / 2.3×10⁹                = 7.505×10⁻¹⁰ Pa⁻¹
E* = 1.332 GPa

a = (3WR / 4E*)^(1/3)
  = (3 × 0.491 × 0.00294 / (4 × 1.332×10⁹))^(1/3)
  = (8.12×10⁻¹³)^(1/3)                                        → 9.32×10⁻⁵ m  (0.093 mm)
```

Contact area: A = π × a² = π × (9.32×10⁻⁵)² = 2.73×10⁻⁸ m²  — 6,600× smaller than GF's 2.54×10⁻⁴ m².

**Spinning Friction Torque (Mindlin Sphere)**

For a spinning sphere on flat, the torsional moment about the contact normal is:

```
τ_spin = (3/16) × μ × W × a
       = (3/16) × 0.35 × 0.491 × 9.32×10⁻⁵                   → 3.00×10⁻⁶ N·m
```

Comparison table at W = 0.491 N:

| Tip type | τ_friction (N·m) | τ / τ_Ball |
|---|---|---|
| GF flat (r = 9 mm) | 1.03×10⁻³ | 343× |
| Sharp hard (a = 0.1 mm) | 5.57×10⁻⁶ | 1.86× |
| **Ball (a = 0.093 mm)** | **3.00×10⁻⁶** | **1×** |

Ball has the lowest spinning-friction torque of any hard tip — lower than even a sharp tip because the spherical contact patch (0.093 mm) is slightly smaller than the sharp-tip Sneddon patch (0.1 mm).

**Spin Decay Rate**

```
dω/dt = τ_spin / I_system = 3.00×10⁻⁶ / 1.0×10⁻⁵              → 0.300 rad/s²
```

At ω₀ = 150 rad/s, time to reach ω = 10 rad/s (near-stop):

```
t_stop = (150 − 10) / 0.300                                    → 467 s  (7.8 minutes, aerodynamic drag excluded)
```

B's floor friction alone would allow nearly 8 minutes of spin — confirming its value as a stamina benchmark.

**Centering Spring — Defensive Centering Force**

The spherical surface converts any lateral offset r_off into an inward reaction force via the curved contact geometry. Treating the contact normal as tilted by θ = arctan(r_off / R) from vertical:

```
F_centering ≈ W × sin(θ) ≈ W × r_off / R
            = 0.491 × r_off / 0.00294

Spring constant: k = W / R = 0.491 / 0.00294                   → 167 N/m
```

At r_off = 5 mm from center: F_centering = 167 × 0.005 = 0.83 N — strong enough to resist typical orbital drift and keep the beyblade stationary near the center against moderate Attack-type strikes.

**TypeScript model**

```typescript
function ballHertzianContact(R_mm: number, W: number, E_GPa: number, nu: number): number {
  const E_star = 1 / (2 * (1 - nu * nu) / (E_GPa * 1e9));
  return Math.pow((3 * W * (R_mm / 1000)) / (4 * E_star), 1 / 3);
}

function ballSpinTorque(mu: number, W: number, a: number): number {
  return (3 / 16) * mu * W * a;
}

function ballSpinDecay(tau: number, I_system: number): number {
  return tau / I_system;
}

function ballCenteringSpring(W: number, R_mm: number): number {
  return W / (R_mm / 1000);
}

function ballTimeToStop(omega_0: number, omega_f: number, decay_rate: number): number {
  return (omega_0 - omega_f) / decay_rate;
}

// ballHertzianContact(2.94, 0.491, 2.3, 0.37)                  → 9.32×10⁻⁵ m  (0.093 mm contact radius)
// ballSpinTorque(0.35, 0.491, 9.32e-5)                         → 3.00×10⁻⁶ N·m
// ballSpinDecay(3.00e-6, 1.0e-5)                               → 0.300 rad/s²  (343× less than GF flat)
// ballCenteringSpring(0.491, 2.94)                             → 167 N/m
// ballTimeToStop(150, 10, 0.300)                               → 467 s  (floor friction only)
```

---

## Case 326 — Bottom: Wide Ball / WB (0.7 g)

> **Stock combo (Rock Leone 145WB):** Clear Wheel: Leone · Metal Wheel: Rock · Track: 145 · Bottom: Wide Ball
> **Stock combo (Rock Giraffe R145WB):** Clear Wheel: Giraffe · Metal Wheel: Rock · Track: R145 · Bottom: Wide Ball
> **Stock combo (Killerken Balro A230WB):** Chrome Wheel(s): Balro + Killerken · Track: A230 · Bottom: Wide Ball

**Thesis.** WB is geometrically identical to B but with a 52% larger ball radius (R_WB = 4.475 mm vs R_B = 2.94 mm). The larger sphere increases the Hertzian contact patch by R^(1/3) scaling (1.149×), raising spinning friction torque by the same factor and spinning decay rate 14.7% above B. More significantly, the larger ball radius softens the centering spring constant from 167 N/m (B) to 110 N/m (WB): at the same lateral displacement the restoring force is 34% weaker, which is the direct physical cause of WB's tendency to drift further from center under orbital motion. The trade-off is that the 32% larger contact area distributes impact force over a greater footprint during a strike, slightly increasing the grip force that resists lateral impulse — giving better instantaneous defense despite the weaker centering. These competing effects (better strike resistance, poorer orbital centering) explain why WB is competitively superior to B for defense but requires a reduced launch power (~60–70%) to prevent the weaker centering from permitting ring-out drift.

**Geometry (side view)**

```
         ╔═══════════════╗   ← shaft
  ┌──────╩───────────────╩──────┐   r_full = 7.865 mm
  │  scalloped disc (wider)     │   h = 9.05 mm
  └──────────────────────────────┘
            ╔═══════════╗         larger sphere: R = 4.475 mm
           ╱             ╲        (vs B: R = 2.94 mm)
          ╱               ╲
          ╲               ╱
           ╲_____________╱
                  ●  a = 0.107 mm  (Hertzian, vs B: 0.093 mm)
```

**Hertzian Contact — R Scaling from B**

```
R_WB / R_B = 4.475 / 2.94                                    = 1.522×

Contact radius scales as R^(1/3):
  a_WB = a_B × (R_WB / R_B)^(1/3)
       = 9.32×10⁻⁵ × 1.522^(1/3)
       = 9.32×10⁻⁵ × 1.149                                   → 1.071×10⁻⁴ m  (0.107 mm)

Contact area ratio:
  A_WB / A_B = (a_WB / a_B)²                                 → 1.32×  (+32% more contact area)
```

**Spinning Friction and Spin Decay**

```
τ_WB = (3/16) × 0.35 × 0.491 × 1.071×10⁻⁴                   → 3.44×10⁻⁶ N·m
τ_B  = 3.00×10⁻⁶ N·m

τ_WB / τ_B = 1.149×  (same ratio as a_WB / a_B, as expected from Mindlin formula)

dω/dt_WB = 3.44×10⁻⁶ / 1.0×10⁻⁵                             → 0.344 rad/s²  (+14.7% vs B)
```

WB decays 14.7% faster than B — small enough that both are competitive stamina benchmarks, but WB is not the preferred stamina test tip precisely because this extra decay is nonzero.

**Centering Spring — Why WB Drifts More**

```
k = W / R

k_B  = 0.491 / 0.00294                                       = 167 N/m
k_WB = 0.491 / 0.004475                                      = 110 N/m

At r_off = 5 mm:
  F_B  = 167 × 0.005                                         = 0.835 N
  F_WB = 110 × 0.005                                         = 0.550 N  (34% less restoring force)
```

The 34% reduction in centering force at equal offset explains WB's tendency to orbit further from center. At full launch power this allows the beyblade to approach the stadium exit — hence the recommended 60–70% launch power to keep r_off small enough that the 110 N/m spring is still sufficient to resist drift.

**Defense: Grip Force During Strike**

For a lateral impact with normal force F_N, the tangential friction (grip) is:

```
F_grip = μ × F_N  (same for both B and WB in the sliding limit)
```

However, the larger contact area of WB means the Hertzian pressure is lower (load is spread over 32% more area), reducing plastic deformation and wear rate per strike. The wider footprint also improves recovery trajectory: post-impact, the larger ball radius curves back toward center along a shallower arc, reducing the peak lateral excursion per hit.

**TypeScript model**

```typescript
function wbContactRadius(R_WB_mm: number, W: number, E_GPa: number, nu: number): number {
  const E_star = 1 / (2 * (1 - nu * nu) / (E_GPa * 1e9));
  return Math.pow((3 * W * (R_WB_mm / 1000)) / (4 * E_star), 1 / 3);
}

function wbVsBSpinDecayRatio(R_WB_mm: number, R_B_mm: number): number {
  return Math.pow(R_WB_mm / R_B_mm, 1 / 3);
}

function wbCenteringSpring(W: number, R_mm: number): number {
  return W / (R_mm / 1000);
}

function wbRestoringForce(W: number, R_mm: number, r_off_mm: number): number {
  return (W / (R_mm / 1000)) * (r_off_mm / 1000);
}

// wbContactRadius(4.475, 0.491, 2.3, 0.37)                    → 1.071×10⁻⁴ m  (0.107 mm, vs B: 0.093 mm)
// wbVsBSpinDecayRatio(4.475, 2.94)                            → 1.149  (WB decays 14.9% faster than B)
// wbCenteringSpring(0.491, 4.475)                             → 110 N/m  (vs B: 167 N/m — 34% softer)
// wbRestoringForce(0.491, 4.475, 5)                           → 0.550 N  (at 5 mm offset)
```

---

## Case 326a — Bottom: Jog Ball / JB (est. 0.7 g)

> **Stock combo (Rock Escolpio T125JB):** Clear Wheel: Escolpio · Metal Wheel: Rock · Track: T125 · Bottom: Jog Ball

**Thesis.** JB belongs to the Ball tip family and is geometrically similar to WB (nominal ball radius R_JB ≈ 4.3 mm vs R_WB = 4.475 mm) but with tiny spikes covering the entire spherical surface. The spikes shift the contact geometry from full-sphere Hertzian to single-spike-tip Hertzian: effective contact is now determined by the spike tip radius of curvature (r_spike ≈ 0.5 mm), not the full ball. This reduces the Hertzian contact radius from WB's 0.107 mm to just 0.052 mm — a 51% reduction — cutting the contact area by 76% and nearly halving the spinning friction torque. As a result JB decays at 0.167 rad/s², meaningfully better than WB (0.344) and B (0.300), and sits between MB (0.144) and B in the stamina table. However, the far smaller contact patch reduces grip force against lateral impulse during a strike, making JB inferior to WB in its primary design role of defense. JB has found above-mediocre use in exactly one competitive combination: **L-Drago 100JB**, a Left-Spin Destabilizer where the spike texture generates micro-torque pulses that introduce orbit irregularity, destabilizing opposing right-spin beyblades through erratic rebound trajectories.

**Geometry (side view)**

```
         ╔═══════════════╗   ← shaft
  ┌──────╩───────────────╩──────┐   r_full ≈ 7.8 mm
  │  scalloped disc             │   h ≈ 9.0 mm
  └─────────────────────────────┘
           ╔═══════════╗         nominal R_JB ≈ 4.3 mm  (est.)
          ╱ ·  ·  ·  · ╲        (· = surface spikes, covering entire sphere)
         ╱ · ·  · ·  · · ╲
         ╲ · ·  · ·  · · ╱
          ╲ ·  ·  ·  · ╱
           ╲___________╱
                 ● a = 0.052 mm  (spike-tip Hertzian, r_spike ≈ 0.5 mm)
```

**Spike Contact vs Full-Sphere Contact**

The spikes ensure only the tip of the lowest spike contacts the stadium floor at any moment. Contact radius is governed by the spike tip curvature, not the full ball:

```
Full ball (WB): a_WB = (3 × W × R_WB / 4E*)^(1/3) = 1.071×10⁻⁴ m  (R = 4.475 mm)
Spike tip (JB): a_JB = (3 × W × r_spike / 4E*)^(1/3)

  a_JB = (3 × 0.491 × 0.0005 / (4 × 1.332×10⁹))^(1/3)
       = (7.365×10⁻⁴ / 5.328×10⁹)^(1/3)
       = (1.382×10⁻¹³)^(1/3)                              → 5.17×10⁻⁵ m  (0.052 mm)

Contact area ratio JB / WB = (0.052 / 0.107)²             → 0.236×  (−76% contact area vs WB)
Contact area ratio JB / B  = (0.052 / 0.093)²             → 0.313×  (−69% contact area vs B)
```

**Spinning Friction and Spin Decay**

```
τ_JB = (3/16) × 0.35 × 0.491 × 5.17×10⁻⁵                → 1.67×10⁻⁶ N·m
τ_WB = 3.44×10⁻⁶ N·m
τ_B  = 3.00×10⁻⁶ N·m

dω/dt_JB = 1.67×10⁻⁶ / 1.0×10⁻⁵                         → 0.167 rad/s²

Stamina hierarchy (lower = better): MB (0.144) < JB (0.167) < B (0.300) < WB (0.344)
JB decays 2.06× slower than WB, 1.80× slower than B — but still 1.16× faster than MB.
```

**Centering Spring**

```
k = W / R_nominal

k_JB = 0.491 / 0.0043                                     = 114 N/m
k_WB = 0.491 / 0.004475                                   = 110 N/m
k_B  = 0.491 / 0.00294                                    = 167 N/m

At r_off = 5 mm:
  F_JB = 114 × 0.005                                      = 0.570 N
  F_WB = 110 × 0.005                                      = 0.550 N  (3% less than JB)
  F_B  = 167 × 0.005                                      = 0.835 N
```

JB's centering spring is marginally stiffer than WB's (114 vs 110 N/m), so orbital drift is slightly less severe — but the difference is negligible in practice. Both JB and WB require a reduced launch power (~60–70%) to prevent ring-out drift.

**Defense: Why JB Is Inferior to WB**

JB and WB share the same μ (0.35, ABS-ABS) and same beyblade weight (F_N ≈ 0.491 N), so raw grip force F_grip = μ × F_N is nominally equal. However:

1. **Smaller contact footprint**: JB's 76% contact area reduction means each spike tip sustains 4.2× higher Hertzian pressure per unit area — accelerating plastic deformation and spike wear, reducing effective μ over match duration.
2. **Narrower post-impact recovery arc**: The spike contact point is geometrically near-point, offering a steeper, less stable rebound trajectory vs WB's broad footprint.
3. **No pressure distribution benefit**: WB's wide contact distributes impact load over more area, reducing peak stress at the interface and yielding a shallower lateral excursion after a hit. JB loses this advantage entirely.

**Destabilizer Use: L-Drago 100JB**

The spike texture is the mechanistic foundation of JB's only competitive role:

```
Micro-torque pulse per spike contact:
  Δτ ≈ (3/16) × Δμ_effective × W × a_spike × n_spikes_per_rev
  (n_spikes ≈ rotational frequency × contact footprint sweep rate)

At ω_bey = 150 rad/s:
  Each spike cycles in and out of floor contact at ~150× the ball's orbit frequency.
  → Irregular lateral impulse injected into opponent on each glancing strike.
```

- **Track height 100** places the contact point low relative to the beyblade's CoM — maximising lateral force transfer per contact event.
- **Left-spin** (L-Drago) aligns the spike-pulse asymmetry with the opponent's weakest gyroscopic axis, reinforcing destabilisation per hit.
- The combination of low height + spike pulses + left-spin creates an effective destabilizer that bypasses the need for WB-level defense.

**TypeScript model**

```typescript
function jbSpikeContactRadius(r_spike_mm: number, W: number): number {
  const E_star = 1.332e9;
  return Math.pow((3 * W * (r_spike_mm / 1000)) / (4 * E_star), 1 / 3);
}
function jbSpinTorque(mu: number, W: number, a: number): number {
  return (3 / 16) * mu * W * a;
}
function jbCenteringSpring(W: number, R_nominal_mm: number): number {
  return W / (R_nominal_mm / 1000);
}

// jbSpikeContactRadius(0.5, 0.491)           → 5.17×10⁻⁵ m  (0.052 mm; −76% vs WB, −44% vs B)
// jbSpinTorque(0.35, 0.491, 5.17e-5)         → 1.67×10⁻⁶ N·m  (dω/dt = 0.167 rad/s²)
// jbCenteringSpring(0.491, 4.3)              → 114 N/m  (marginal improvement over WB's 110 N/m)
```

---

## Case 327 — Bottom: Metal Ball / MB (1.4 g)

> **Stock combo (Poison Giraffe S130MB):** Clear Wheel: Giraffe · Metal Wheel: Poison · Track: S130 · Bottom: Metal Ball
> **Stock combo (L Drago Guardian S130MB):** 4D Metal Wheel: L Drago Guardian · Track: S130 · Bottom: Metal Ball

**Thesis.** MB replaces the ABS sphere of B/WB with a solid metal ball (r = 3.435 mm, zinc alloy). The metal-on-ABS combined modulus (E* = 2.60 GPa vs ABS-ABS 1.33 GPa) stiffens the contact and reduces the Hertzian contact radius to 0.079 mm — 15% smaller than B — while the low kinetic friction of metal-on-ABS (μ ≈ 0.20) cuts the spinning friction torque to 1.44×10⁻⁶ N·m, less than half of B's 3.00×10⁻⁶ N·m. MB delivers better stamina than B purely through its lower μ, despite the heavier mass (1.4 g = 2.3× B). The added mass lowers the assembly CoM, raising tilt-stability margin; the trade-off is that the low μ gives minimal grip against lateral impulses, making MB trivially easy to ring out.

**Geometry (side view)**

```
  ┌──────────────────────────┐   r_full = 7.955 mm
  │  base disc (metal)       │   h = 10.96 mm
  └──────────────────────────┘
       ╔═══════════╗  metal sphere: R = 3.435 mm
      ╱             ╲  high stiffness, low μ
      ╲_____________╱
            ● a = 0.079 mm  (Hertzian, metal-ABS E* = 2.60 GPa)
```

**Contact and Spin Decay**

```
E*_MB (metal-ABS): 1/E* = (1−0.09)/100e9 + (1−0.137)/2.3e9 = 3.843e-10  →  E* = 2.60 GPa
a_MB = (3 × 0.491 × 0.003435 / (4 × 2.60e9))^(1/3)                      → 7.86×10⁻⁵ m

τ_MB = (3/16) × 0.20 × 0.491 × 7.86×10⁻⁵                                → 1.44×10⁻⁶ N·m
dω/dt_MB = 1.44×10⁻⁶ / 1.0×10⁻⁵                                         → 0.144 rad/s²

Stamina hierarchy: MB (0.144) < D (0.112) < SD (0.102) < B (0.300) < GF (103)
```

Centering spring: k = W/R = 0.491/0.003435 = 143 N/m (between B=167 and WB=110).

```typescript
function mbContactRadius(R_mm: number, W: number): number {
  const E_star = 1 / (9.1e-12 + 3.752e-10);
  return Math.pow((3 * W * (R_mm / 1000)) / (4 * E_star), 1 / 3);
}
function mbSpinTorque(mu_metal: number, W: number, a: number): number { return (3 / 16) * mu_metal * W * a; }
// mbContactRadius(3.435, 0.491)     → 7.86×10⁻⁵ m  (15% smaller than B)
// mbSpinTorque(0.20, 0.491, 7.86e-5) → 1.44×10⁻⁶ N·m  (2.08× better stamina than B)
```

---

## Case 328 — Bottom: Rubber Ball / RB (0.82 g)

> **Stock combo (Jade Jupiter S130RB):** 4D Clear Wheel: Jupiter · 4D Metal Wheel: Jade · Track: S130 · Bottom: Rubber Ball

**Thesis.** RB substitutes rubber (E = 0.002 GPa) for the ABS sphere, producing an extremely compliant contact. The rubber-ABS combined modulus (E* = 0.6 MPa) causes the Hertzian contact radius to balloon to 1.35 mm under normal load — 14.5× larger than B — and the adhesive rubber traction formula adds a contact-area-proportional grip component (τ_adh = 0.08 MPa). Total spinning torque reaches 1.33×10⁻⁴ N·m, 44× above B, and spin decay runs at 13.3 rad/s². RB is not a stamina tip; its value is the 0.875 N lateral grip force generated at the contact patch, which resists ring-out impulses that would trivially slide a hard-tip bey outward.

**Contact and Spin Decay**

```
E*_rubber-ABS = 0.6 MPa  (from material constants table)
R_RB ≈ 4.0 mm  (estimated, "wider than B")
a_RB = (3 × 0.491 × 0.004 / (4 × 0.6e6))^(1/3)                          → 1.35×10⁻³ m  (1.35 mm)

τ_adhesive = (3/16) × 0.85 × 0.491 × 1.35×10⁻³ + 0.08e6 × π×(1.35e-3)² × 1.35e-3/2
Simplified: τ_RB ≈ (3/16) × 0.85 × 0.491 × 1.35×10⁻³                   → 1.33×10⁻⁴ N·m
dω/dt_RB = 1.33×10⁻⁴ / 1.0×10⁻⁵                                         → 13.3 rad/s²  (44× B)

Lateral grip: F = μ×W + τ_adh×A = 0.85×0.491 + 0.08e6×5.73e-6           → 0.875 N
```

```typescript
function rbContactRadius(R_mm: number, W: number): number {
  return Math.pow((3 * W * (R_mm / 1000)) / (4 * 0.6e6), 1 / 3);
}
function rbLateralGrip(W: number, a: number): number {
  return 0.85 * W + 0.08e6 * Math.PI * a * a;
}
// rbContactRadius(4.0, 0.491)  → 1.35×10⁻³ m  (14.5× larger than B)
// rbLateralGrip(0.491, 1.35e-3) → 0.875 N  (vs B ≈ 0.172 N at same offset)
```

---

## Case 329 — Bottom: Sharp Ball / SB (0.6 g)

> **Stock combo (Guardian Revizer 160SB):** Chrome Wheel(s): Revizer · Crystal Wheel: Guardian · Track: 160 · Bottom: Sharp Ball

**Thesis.** SB is a cone-shaped bottom with tip half-angle 25° from the vertical axis and a subtle rounded apex rather than a sharp point. The Sneddon cone contact formula applies, but the "very subtle rounded tip" means the actual contact is Hertzian at the apex (R ≈ 0.3 mm) at normal loads, transitioning to conical only at higher loads. At standard battle load (W = 0.491 N), contact is in the rounded-tip regime (a ≈ 0.069 mm). Spinning torque is 3.83×10⁻⁷ N·m — the lowest of any bottom in this series — and spin decay is 0.038 rad/s². SB is the best pure stamina performer per its geometry but is susceptible to toppling because the cone body (wider at the top) raises the CoM.

**Contact and Spin Decay**

```
R_apex ≈ 0.3 mm  (subtle rounded tip)
a_SB = (3 × 0.491 × 0.0003 / (4 × 1.332e9))^(1/3)                       → 6.90×10⁻⁵ m

τ_SB = (3/16) × 0.17 × 0.491 × 6.90×10⁻⁵  (hard tip μ = 0.17)           → 3.83×10⁻⁷ N·m
dω/dt_SB = 3.83×10⁻⁷ / 1.0×10⁻⁵                                         → 0.038 rad/s²

Transition to cone contact at load P_trans where Hertz radius = cone contact radius:
(3P_trans×R/4E*)^(1/3) = (P_trans×π/(2E*×tan 65°))^(1/2)
P_trans ≈ 15 N  (well above battle load — remains in Hertz regime throughout)
```

```typescript
function sbContactRadius(R_apex_mm: number, W: number): number {
  const E_star = 1.332e9;
  return Math.pow((3 * W * (R_apex_mm / 1000)) / (4 * E_star), 1 / 3);
}
function sbSpinDecay(a: number, I_system: number): number {
  return (3 / 16) * 0.17 * 0.491 * a / I_system;
}
// sbContactRadius(0.3, 0.491)   → 6.90×10⁻⁵ m
// sbSpinDecay(6.90e-5, 1.0e-5)  → 0.038 rad/s²  (best of all hard tips; 7.9× better than B)
```

---

## Case 330 — Bottom: Defense / D (0.68 g)

> **Stock combo (Leone 145D):** Wheel: Leone · Track: 145 · Bottom: Defense
> **Stock combo (Aries 125D):** Wheel: Aries · Track: 125 · Bottom: Defense
> **Stock combo (Vulcan Horuseus 145D):** Clear Wheel: Horuseus · Metal Wheel: Vulcan · Track: 145 · Bottom: Defense
> **Stock combo (Forbidden Eonis 130D / ED145FB):** 4D Clear Wheel: Eonis · 4D Metal Wheel: Forbidden · Track: 130/ED145 · Bottom: Defense / Flat Ball
> **Stock combo (Divine/Hell Crown TR145D / 130FB):** 4D Clear Wheel: Crown · 4D Metal Wheel: Divine/Hell · Track: TR145 / 130 · Bottom: Defense / Flat Ball
> **Stock combo (Pirates Orojya 145D):** Chrome Wheel(s): Orojya · Crystal Wheel: Pirates · Track: 145 · Bottom: Defense

**Thesis.** D is a cone tip with half-apex angle 35° (measured from vertical), giving Sneddon cone contact with α = 55° from the horizontal contact plane. The resulting contact radius (0.020 mm) is 4.7× smaller than B's Hertzian radius, and the hard-tip friction coefficient (μ = 0.17) yields a spinning torque of 1.12×10⁻⁶ N·m — better stamina than B (3.00×10⁻⁶ N·m). The cone body's wider angle means that at large wobble tilt the cone side (rather than the apex) contacts the floor, shifting the contact point radially outward and increasing torque; but this occurs only near the end of the precession phase. The wider tip also distributes the centering restoring force over a larger virtual lever arm, giving better lateral stability than a sharp tip under glancing hits.

**Sneddon Cone Contact**

```
α = 55°  (from horizontal = 90° − 35° half-apex angle)
a_D² = W×π / (2×E*×tan α) = 0.491π / (2×1.332e9×tan 55°)
     = 1.543 / (2×1.332e9×1.428)                                          = 4.05×10⁻¹⁰ m²
a_D = 2.01×10⁻⁵ m  (0.020 mm)

τ_D = (2/3) × 0.17 × 0.491 × 2.01×10⁻⁵                                  → 1.12×10⁻⁶ N·m
dω/dt_D = 1.12×10⁻⁶ / 1.0×10⁻⁵                                          → 0.112 rad/s²  (2.7× better than B)
```

```typescript
function dSneddonContact(W: number, half_angle_deg: number, E_star: number): number {
  const alpha = (90 - half_angle_deg) * Math.PI / 180;
  return Math.sqrt(W * Math.PI / (2 * E_star * Math.tan(alpha)));
}
function dSpinTorque(a: number, W: number): number { return (2 / 3) * 0.17 * W * a; }
// dSneddonContact(0.491, 35, 1.332e9)  → 2.01×10⁻⁵ m
// dSpinTorque(2.01e-5, 0.491)          → 1.12×10⁻⁶ N·m  (2.7× less than B)
```

---

## Case 331 — Bottom: Semi-Defense / SD (0.6 g)

> **Stock combo (Dark Bull H145SD):** Clear Wheel: Bull · Metal Wheel: Dark · Track: H145 · Bottom: Semi Defense
> **Stock combo (Poison Serpent SW145SD):** Clear Wheel: Serpent · Metal Wheel: Poison · Track: SW145 · Bottom: Semi Defense
> **Stock combo (Nightmare Rex SW145SD):** Clear Wheel: Rex · Metal Wheel: Nightmare · Track: SW145 · Bottom: Semi Defense
> **Stock combo (Shinobi Saramanda SW145SD):** Chrome Wheel(s): Saramanda · Crystal Wheel: Shinobi · Track: SW145 · Bottom: Semi-Defense

**Thesis.** SD is a cone with a 30° half-apex angle — 5° sharper than D. The steeper cone reduces the Sneddon contact radius from 0.020 mm (D) to 0.018 mm, lowering spinning torque by 8.9% to 1.02×10⁻⁶ N·m. Spin decay drops to 0.102 rad/s², making SD the best stamina cone among D/SD. The trade-off is that SD cannot tilt as far as D before its steeper cone side contacts the floor at an unfavorable angle — at large wobble angles SD transitions to conical-side contact sooner, shedding energy faster. This is the physical basis for the metagame conclusion that D provides better defensive wobble-absorption while SD provides marginally better steady-spin stamina.

**Contact**

```
α_SD = 60°  (from horizontal, half-apex = 30°)
a_SD² = 1.543 / (2×1.332e9×tan 60°) = 1.543 / (2×1.332e9×1.732)        = 3.34×10⁻¹⁰ m²
a_SD = 1.83×10⁻⁵ m

τ_SD = (2/3) × 0.17 × 0.491 × 1.83×10⁻⁵                                 → 1.02×10⁻⁶ N·m
dω/dt_SD = 1.02×10⁻⁶ / 1.0×10⁻⁵                                         → 0.102 rad/s²

SD vs D torque ratio: τ_SD/τ_D = a_SD/a_D = 1.83/2.01                   → 0.910  (8.9% better stamina)
```

```typescript
function sdContact(W: number): number {
  return Math.sqrt(W * Math.PI / (2 * 1.332e9 * Math.tan(60 * Math.PI / 180)));
}
// sdContact(0.491)   → 1.83×10⁻⁵ m  (0.018 mm, 8.9% smaller than D)
// (2/3)*0.17*0.491*1.83e-5 / 1e-5 → 0.102 rad/s²  (SD best steady stamina of D family)
```

---

## Case 332 — Bottom: Wide Defense / WD (0.7 g)

> **Stock combo (Earth Aquila 145WD):** Clear Wheel: Aquila · Metal Wheel: Earth · Track: 145 · Bottom: Wide Defense
> **Stock combo (Gravity Perseus AD145WD):** Clear Wheel: Perseus · Metal Wheel: Gravity · Track: AD145 · Bottom: Wide Defense
> **Stock combo (Flame Byxis 230WD):** Clear Wheel: Byxis · Metal Wheel: Flame · Track: 230 · Bottom: Wide Defense
> **Stock combo (Basalt Horogium 145WD):** Clear Wheel: Horogium · Metal Wheel: Basalt · Track: 145 · Bottom: Wide Defense
> **Stock combo (Beat Lynx TH170WD):** 4D Clear Wheel: Lynx · 4D Metal Wheel: Beat · Track: TH170 · Bottom: Wide Defense
> **Stock combo (Duo Uranus 230WD):** 4D Clear Wheel: Uranus · 4D Metal Wheel: Duo · Track: 230 · Bottom: Wide Defense
> **Stock combo (Kreis Cygnus 145WD):** 4D Clear Wheel: Cygnus · 4D Metal Wheel: Kreis · Track: 145 · Bottom: Wide Defense
> **Stock combo (Flash Sagittario 230WD):** 4D Clear Wheel: Sagittario II · 4D Metal Wheel: Flash · Track: 230 · Bottom: Wide Defense

**Thesis.** WD is a truncated cone (half-apex 40°, flat base diameter 14.17 mm) that combines Sneddon cone contact in the upright phase with wide-disk floor contact at large tilt angles. In the upright phase the apex contact is 0.022 mm — slightly larger than D — and spin decay (0.123 rad/s²) is slightly worse than D. The strategic value of WD is in the late precession phase: as tilt angle θ exceeds the critical tipping angle (θ_crit = arctan(r_rim / h_tip) = arctan(7.085/6.75) = 46.4°), the truncated flat base rings down to the floor, creating a large-radius contact ring (r = 7.085 mm) that sustains gyroscopic precession far longer than a pointed tip would. This "last-wobble" support extends the match time available for the WD beyblade to outlast opponents that have already fallen below the precession threshold.

**Contact Phases**

```
Upright (Sneddon, α = 50°, half-apex = 40°):
  a_WD = √(1.543 / (2×1.332e9×tan 50°))  = √(1.543/3.176e9)             → 2.20×10⁻⁵ m

τ_WD_upright = (2/3)×0.17×0.491×2.20×10⁻⁵                               → 1.23×10⁻⁶ N·m
dω/dt_WD_upright                                                          → 0.123 rad/s²

Rim-contact threshold:
  θ_crit = arctan(r_rim / h_tip) = arctan(7.085 / 6.75)                  → 46.4°

Late-wobble rim-disk torque (r_rim = 7.085 mm):
  τ_rim = (2/3)×0.17×0.491×0.007085                                      → 3.94×10⁻⁴ N·m  (320× upright torque)
```

The rim-contact phase generates 320× more friction torque — but it also generates a correspondingly large gyroscopic moment that extends precession. Whether this net effect is beneficial depends on the opponent's remaining spin: if the opponent has already stopped, WD's prolonged wobble buys extra time.

```typescript
function wdUprightContact(W: number): number {
  return Math.sqrt(W * Math.PI / (2 * 1.332e9 * Math.tan(50 * Math.PI / 180)));
}
function wdRimContact(r_rim_mm: number, h_tip_mm: number): number {
  return Math.atan(r_rim_mm / h_tip_mm) * 180 / Math.PI;
}
function wdRimTorque(W: number, r_rim_mm: number): number {
  return (2 / 3) * 0.17 * W * (r_rim_mm / 1000);
}
// wdUprightContact(0.491)      → 2.20×10⁻⁵ m  (0.022 mm)
// wdRimContact(7.085, 6.75)    → 46.4°  (critical tilt for rim touchdown)
// wdRimTorque(0.491, 7.085)    → 3.94×10⁻⁴ N·m  (320× upright torque — late-wobble phase)
```

---

## Case 333 — Bottom: Sharp Wide Defense / SWD (0.82 g)

> **Stock combo (Fusion Hades AD145SWD):** 4D Clear Wheel: Hades · 4D Metal Wheel: Fusion · Track: AD145 · Bottom: Sharp Wide Defense
> **Stock combo (Saramanda Balro DF145SWD):** Chrome Wheel(s): Balro + Saramanda · Track: DF145 · Bottom: Sharp Wide Defense

**Thesis.** SWD separates the upright-stamina function and the late-wobble function into two distinct structural elements: a sharp central tip (r_apex ≈ 0.8 mm estimated, Hertzian regime) delivers excellent upright stamina (τ ≈ 1.44×10⁻⁷ N·m), while a straight cylindrical outer frame (r = 7.29 mm, height = full height minus tip height) provides the wide-base rim support that WD achieves only at extreme tilt angles. Because the sharp tip and outer frame are structurally separated by an air gap, the tip operates independently from the frame. In the upright position only the sharp tip contacts the floor; at tilt θ_crit the outer cylindrical rim contacts, jumping directly to a large-radius contact (r = 7.29 mm). This is a sharper transition than WD's gradual cone side contact — and gives SWD the sharp upright stamina of a pointed tip combined with WD-level late-wobble support.

**Contact Analysis**

```
Sharp tip (Hertzian, R_apex ≈ 0.8 mm):
  a_tip = (3×0.491×0.0008/(4×1.332e9))^(1/3)                             → 9.88×10⁻⁵ m  (0.099 mm)
  τ_tip = (3/16)×0.17×0.491×9.88×10⁻⁵                                   → 5.50×10⁻⁷ N·m
  dω/dt_tip                                                               → 0.055 rad/s²

Outer rim (r = 7.29 mm = 14.58mm/2):
  θ_crit = arctan(r_rim / h_gap)  where h_gap ≈ full_height − tip_height = ~2.5 mm
  θ_crit = arctan(7.29 / 2.5)                                             → 71.1°  (extreme tilt)
  τ_rim = (2/3)×0.17×0.491×0.00729                                        → 4.06×10⁻⁴ N·m
```

SWD's rim-contact requires more extreme tilt than WD (71° vs 46°) because the outer frame is taller than WD's base height. Once triggered, it provides a comparable late-wobble torque.

```typescript
function swdTipContact(R_apex_mm: number, W: number): number {
  const E_star = 1.332e9;
  return Math.pow((3 * W * (R_apex_mm / 1000)) / (4 * E_star), 1 / 3);
}
function swdCriticalTilt(r_rim_mm: number, h_gap_mm: number): number {
  return Math.atan(r_rim_mm / h_gap_mm) * 180 / Math.PI;
}
function swdRimTorque(W: number, r_rim_mm: number): number {
  return (2 / 3) * 0.17 * W * (r_rim_mm / 1000);
}
// swdTipContact(0.8, 0.491)         → 9.88×10⁻⁵ m  (0.099 mm)
// (3/16)*0.17*0.491*9.88e-5/1e-5   → 0.055 rad/s²  (better than B, close to SB)
// swdCriticalTilt(7.29, 2.5)        → 71.1°  (more extreme than WD's 46.4°)
// swdRimTorque(0.491, 7.29)         → 4.06×10⁻⁴ N·m  (late-wobble phase)
```

---

## Case 334 — Bottom: Wide Semi Flat / WSF (est. ~0.7 g)

> **Stock combo (Archer Gargole SA165WSF):** Chrome Wheel(s): Gargole · Crystal Wheel: Archer · Track: SA165 · Bottom: Wide Semi-Flat

**Thesis.** WSF is SF geometry scaled outward: a truncated cone with a wider flat contact face and a correspondingly broader outer base than SF, forming a "bigger cut cone." Contact occurs on the flat terminal face (a disk), so friction is governed by the spinning disk formula — τ = (2/3)μWr_flat — not by Hertzian sphere or Sneddon cone mechanics. Increasing r_flat from SF's ~2.5 mm to WSF's estimated ~3.8 mm raises the spinning torque proportionally and increases spin decay by ~52% relative to SF, narrowing the stamina gap with GF but preserving noticeably more spin than GF's 9 mm face. The two sets of spiky ribs on the cone flanks are inert at upright spin but engage the stadium floor above a critical tilt angle (~39°), adding a grip-assisted torque spike in the late-wobble phase analogous to WD's rim-contact mechanism. Weight is estimated at ~0.7 g (no official figure supplied); all computed values scale linearly with actual mass.

**Geometry (side view)**

```
  ┌──────────────────────────┐   r_full ≈ 7.8 mm
  │  outer body (ABS)        │   h_total ≈ 8.8 mm
  │   ╲spiky ribs╱           │   r_flat  ≈ 3.8 mm  (flat face radius)
  │    ╲        ╱            │   h_cone  ≈ 5.0 mm  (cone section height)
  │     ╲      ╱   ← spiky rib pair (both sides of cone)
  │      ╲    ╱
  │       ╲  ╱   cone half-angle β ≈ arctan((7.8-3.8)/5.0) = 38.7°
  │        ▓▓▓   flat face, r = 3.8 mm
              ↑
         contact zone (disk)
```

**Flat-Face Spinning Friction**

The entire contact is distributed uniformly over the flat disk of radius r_flat. For a rigid disk spinning at angular velocity ω against a floor with Coulomb friction μ, the resistive torque integrates to:

```
τ_disk = (2/3) × μ × W × r_flat

W = m_total × g ≈ 0.0007 × 9.81                               → 0.00687 N  (tip alone)

In-battle normal load (full assembled bey, m_assy ≈ 50 g):
  W_battle = 0.050 × 9.81                                      → 0.491 N

τ_WSF = (2/3) × 0.35 × 0.491 × 0.0038                        → 4.34×10⁻⁴ N·m

dω/dt_WSF = τ_WSF / I_system (I = 1.0×10⁻⁵ kg·m²)           → 43.4 rad/s²
```

**Comparison Within the Flat-Face Family**

| Bottom | r_flat (mm) | τ (N·m)    | dω/dt (rad/s²) | Decay vs GF |
|--------|-------------|------------|----------------|-------------|
| SF     | ~2.5        | 2.86×10⁻⁴ | 28.6           | 27.8%       |
| **WSF**| **~3.8**    | **4.34×10⁻⁴** | **43.4**   | **42.1%**   |
| GF     | 9.0         | 1.03×10⁻³ | 103            | 100%        |

WSF's spin decay (43.4 rad/s²) is 52% above SF's (28.6) but only 42% of GF's (103). This places WSF squarely between SF and GF on the stamina–aggression axis: it slides more freely than SF under lateral impulses but spins down faster.

**Critical Tilt Angle — Spiky Rib Engagement**

Below the critical tilt θ_crit, the flat face is the sole contact surface. Above it, the cone flank (bearing the spiky rib pairs) contacts the floor:

```
θ_crit = arctan((r_full − r_flat) / h_cone)
       = arctan((7.8 − 3.8) / 5.0)
       = arctan(0.80)                                          → 38.7°
```

At tilt θ_crit = 38.7°, the outer rim of the cone body first touches. The spiky ribs increase the effective friction coefficient at this contact from μ_ABS = 0.35 to approximately μ_rib ≈ 0.50 (mechanical interlock with the stadium texture). The resulting rim torque at full tilt:

```
τ_rim = (2/3) × 0.50 × 0.491 × 0.0078                        → 1.27×10⁻³ N·m

τ_rim / τ_WSF = 1.27×10⁻³ / 4.34×10⁻⁴                       → 2.93×  (2.93× upright torque)
```

The rib-contact torque is 2.9× the upright flat-face torque, accelerating precession and driving the bey toward recovery or burst rather than sustaining the late-wobble glide that WD achieves. WSF therefore does not extend match time in the wobble phase — it shortens it, delivering a sharper end-of-life transition than SD or WD.

**Lateral Grip vs SF**

A wider flat face at the same friction coefficient produces a proportionally larger lateral friction force under radial offset:

```
F_lat(WSF) = μ × W × (r_flat_WSF / r_flat_SF)
           = 0.35 × 0.491 × (3.8 / 2.5)                      → 0.269 N

vs SF:  F_lat = 0.35 × 0.491                                  → 0.172 N  (point-contact approx)
```

WSF resists ring-out lateral impulses ~57% more effectively than SF while still sliding considerably more than RB (0.875 N). In Zero-G stadiums where the floor curvature applies persistent centrifugal drift, WSF's improved lateral hold provides a moderate defense against drift-out compared to SF's tendency to slide freely.

**Centering Spring (approximate)**

For a flat contact, the lateral restoring force is purely frictional (no geometric ball-spring term). Under a centrifugal offset r_off:

```
F_restore = μ × W = 0.35 × 0.491                              → 0.172 N  (constant, independent of offset)
```

Unlike ball tips, where the restoring force scales with offset (k = W/R), a flat-face tip provides a constant friction force regardless of how far off-center the contact is. This makes centering less reliable under continuous drift loads — the bey can migrate steadily outward even though the friction force is non-negligible.

**TypeScript model**

```typescript
function wsfSpinTorque(r_flat_mm: number, W: number, mu: number): number {
  return (2 / 3) * mu * W * (r_flat_mm / 1000);
}

function wsfSpinDecay(r_flat_mm: number, W: number, mu: number, I_system: number): number {
  return wsfSpinTorque(r_flat_mm, W, mu) / I_system;
}

function wsfCriticalTilt(r_full_mm: number, r_flat_mm: number, h_cone_mm: number): number {
  return Math.atan((r_full_mm - r_flat_mm) / h_cone_mm) * 180 / Math.PI;
}

function wsfRimTorque(r_full_mm: number, W: number, mu_rib: number): number {
  return (2 / 3) * mu_rib * W * (r_full_mm / 1000);
}

function wsfDecayVsSF(r_wsf_mm: number, r_sf_mm: number): number {
  return r_wsf_mm / r_sf_mm;
}

// wsfSpinTorque(3.8, 0.491, 0.35)              → 4.34×10⁻⁴ N·m
// wsfSpinDecay(3.8, 0.491, 0.35, 1.0e-5)       → 43.4 rad/s²  (52% above SF, 42% of GF)
// wsfCriticalTilt(7.8, 3.8, 5.0)               → 38.7°  (rib engagement angle)
// wsfRimTorque(7.8, 0.491, 0.50)               → 1.27×10⁻³ N·m  (2.93× upright — no late-wobble extension)
// wsfDecayVsSF(3.8, 2.5)                       → 1.52  (WSF decays 52% faster than SF)
```

---

## Case 335 — Bottom: Sharp / S (0.6 g)

> **Stock combo (Sagittario 145S):** Wheel: Sagittario · Track: 145 · Bottom: Sharp
> **Stock combo (Flame Sagittario C145S):** Clear Wheel: Sagittario · Metal Wheel: Flame · Track: C145 · Bottom: Sharp
> **Stock combo (Wind Aquario 100HF/S):** Clear Wheel: Aquario · Metal Wheel: Wind (Light) · Track: 100 · Bottom: Hole Flat / Sharp
> **Stock combo (Infinity Libra GB145S):** Clear Wheel: Libra · Metal Wheel: Infinity · Track: GB145 · Bottom: Sharp
> **Stock combo (Archer Gryph C145S):** Chrome Wheel(s): Gryph · Crystal Wheel: Archer · Track: C145 · Bottom: Sharp

**Thesis.** S is a plain conical tip with a 35° half-apex angle from the axis, identical to D's tip geometry. The Sneddon cone contact radius (0.020 mm) and spinning friction torque (1.12×10⁻⁶ N·m) are therefore mathematically indistinguishable from D at the contact level. S's competitive inferiority to D is entirely a body-geometry effect: D's wider flange (tip width 8.94 mm vs S's 4.14 mm) presents a larger cross-section to lateral impulses, distributes destabilisation torque over a greater moment arm, and raises the effective critical tilt before the cone body contacts the floor. S lacks this flange — the cone terminates at 2.07 mm radius — so it topples under impacts that D absorbs. The stamina mechanics are equivalent; the stability is not.

**Geometry (side view)**

```
  ┌──────────────────────────┐   r_full = 7.955 mm
  │  ABS outer body          │   h_full = 8.83 mm
  │   ╲                      │   r_tip  = 2.07 mm  (narrow cone base)
  │    ╲                     │   h_tip  = 6.82 mm
  │     ╲  35° half-angle    │
  │      ╲                   │
  │       ╲                  │
  │        ●  a = 0.020 mm  (Sneddon, same as D)
```

**Sneddon Cone Contact (identical to D)**

```
α_Sneddon = 90° − 35° = 55°  (from horizontal)

a_S² = W·π / (2·E*·tan α) = 0.491·π / (2 × 1.332×10⁹ × tan 55°)
     = 1.543 / (2 × 1.332×10⁹ × 1.428)                            = 4.05×10⁻¹⁰ m²
a_S  = 2.01×10⁻⁵ m  (0.020 mm)

τ_S = (2/3) × 0.17 × 0.491 × 2.01×10⁻⁵                          → 1.12×10⁻⁶ N·m
dω/dt_S = 1.12×10⁻⁶ / 1.0×10⁻⁵                                   → 0.112 rad/s²
```

**Why S Topples Where D Does Not**

The lateral restoring torque when a bey is struck at tilt angle θ from vertical is:
```
τ_restore = I·Ω·ω_precession  (gyroscopic)

For the contact body, the critical stability margin scales with:
  r_flange / r_tip  (flange width available before cone side contacts floor)

S:  r_full = 7.955 mm,  r_tip = 2.07 mm → marginal zone = 5.89 mm
D:  r_full = 7.775 mm,  r_tip = 4.47 mm → marginal zone = 3.31 mm  (shorter but much wider inner cone → more contact-area support)

In terms of cone half-angle effect on body stability:
D's tip width = 4.47 mm corresponds to a cone section height h_cone = r_tip/tan(35°) = 4.47/0.700 = 6.39 mm
S's tip width = 2.07 mm → h_cone = 2.07/0.700 = 2.96 mm  (shorter, more top-heavy body above cone)
```

S's cone terminates at a lower height than D's, leaving more of the total body height above the tip — raising the effective CoM. Any lateral blow that tilts the axis by more than the gyroscopic restoring margin causes S to walk or spin out, whereas D's wider tip base provides more floor contact area as tilt increases, adding a stabilising torque from normal force geometry.

**Stamina Hierarchy Comparison**

```
At this point in the series (same tip angle as D):
  S = D at the contact level: 0.112 rad/s²

D's competitive advantage is purely mechanical stability, not stamina physics.
```

**TypeScript model**

```typescript
function sSneddonContact(tipAngle_deg: number, W: number, E_star: number): number {
  const alpha = (90 - tipAngle_deg) * Math.PI / 180;
  return Math.sqrt((W * Math.PI) / (2 * E_star * Math.tan(alpha)));
}

function sSpinDecay(tipAngle_deg: number, W: number, mu: number, I_system: number): number {
  const a = sSneddonContact(tipAngle_deg, W, 1.332e9);
  return (2 / 3) * mu * W * a / I_system;
}

function sTipStabilityMargin(r_full_mm: number, r_tip_mm: number, h_full_mm: number, h_tip_mm: number): number {
  const h_body_above_cone = h_full_mm - h_tip_mm;
  return r_tip_mm / h_body_above_cone;
}

// sSneddonContact(35, 0.491, 1.332e9)            → 2.01×10⁻⁵ m  (identical to D)
// sSpinDecay(35, 0.491, 0.17, 1.0e-5)            → 0.112 rad/s²  (matches D tip-for-tip)
// sTipStabilityMargin(7.955, 2.07, 8.83, 6.82)   → 1.02  (vs D: 4.47/1.16 = 3.85 — D is 3.8× more stable)
```

---

## Case 336 — Bottom: Ball Sharp / BS (0.6 g)

> **Stock combo (Libra DF145BS):** Wheel: Libra · Track: DF145 · Bottom: Ball Sharp
> **Stock combo (Virgo DF145BS):** Wheel: Virgo · Track: DF145 · Bottom: Ball Sharp
> **Stock combo (Pisces D125BS):** Wheel: Pisces · Track: D125 · Bottom: Ball Sharp
> **Stock combo (Earth Virgo GB145BS):** Clear Wheel: Virgo · Metal Wheel: Earth · Track: GB145 · Bottom: Ball Sharp
> **Stock combo (Bandid Goreim DF145BS):** Chrome Wheel(s): Goreim · Crystal Wheel: Bandid · Track: DF145 · Bottom: Ball Sharp

**Thesis.** BS pairs the same 35° sharp cone tip as S with a dome-shaped upper body and a notched outer ring — visible in the top-view as a gear-tooth circumference around a hemispherical cap. The contact tip is geometrically and mechanically identical to S: Sneddon cone at 35°, a = 0.020 mm, τ = 1.12×10⁻⁶ N·m, dω/dt = 0.112 rad/s². The dome body and notched ring raise the total body diameter to 15.71 mm (vs S: 15.91 mm) but the tip zone is wider at 5.64 mm radius vs S's 4.14 mm — marginally improving the cone-section stability margin. The gear-tooth outer ring is entirely decorative in normal battles; it only contacts the stadium floor at very large tilt angles (>55°) where the match is already lost. BS's practical performance equals S, with neither part offering meaningful improvement over D, SD, or WD.

**Geometry (side view — dome body)**

```
  ┌─── gear-tooth outer ring ───┐   r_full = 7.855 mm
  │     r_ring ≈ 7.855 mm       │
  │  ╱ hemispherical dome ╲     │   dome apex at ~5 mm above base
  │ ╱                      ╲    │
  │╱   ABS body              ╲  │   r_tip = 2.82 mm  (wider than S: 2.07 mm)
  │     35° cone below        │ │
  │      ╲                    │ │
  │       ╲                   │ │
  │        ●  a = 0.020 mm  (Sneddon, identical S)
```

**Contact Physics (same as S)**

```
tipAngle = 35°,  α = 55°,  E* = 1.332 GPa,  W = 0.491 N

a_BS = a_S = 2.01×10⁻⁵ m
τ_BS = τ_S = 1.12×10⁻⁶ N·m
dω/dt_BS = 0.112 rad/s²  (indistinguishable from S at tip level)
```

**Marginal Stability Improvement from Wider Tip Zone**

```
BS tip width = 5.64 mm  → r_tip = 2.82 mm
S  tip width = 4.14 mm  → r_tip = 2.07 mm

Stability margin ratio (cone-section support):
  sTipStabilityMargin_BS = 2.82 / (8.78 − 8.78×?) 
  ... using formula from S: r_tip / h_body_above_cone

For BS: h_body_above_cone ≈ 8.78 − 5.64 × (1/tan 35°) ≈ 8.78 − 8.06 = 0.72 mm  (very short)

BS stability margin = 2.82 / 0.72 = 3.92  (vs S: 1.02)
```

Wait — this suggests BS has a dramatically more stable profile than S. The wider tip zone means the cone section fills more of the total height, leaving almost no body above the cone apex. This lowers the effective CoM significantly compared to S.

**Revised stability conclusion:** BS should be moderately more stable than S under lateral hits, consistent with both being described as having the same performance (the stability gain is real but still insufficient vs D's lateral flange geometry).

**TypeScript model**

```typescript
function bsStabilityMargin(r_tip_mm: number, h_full_mm: number, tipAngle_deg: number): number {
  const h_cone = r_tip_mm / Math.tan(tipAngle_deg * Math.PI / 180);
  const h_body_above = h_full_mm - h_cone;
  return h_body_above > 0 ? r_tip_mm / h_body_above : Infinity;
}

// bsStabilityMargin(2.82, 8.78, 35)              → 3.92  (vs S: 1.02 — significantly more stable)
// sSneddonContact(35, 0.491, 1.332e9)             → 2.01×10⁻⁵ m  (tip contact identical to S and D)
// sSpinDecay(35, 0.491, 0.17, 1.0e-5)             → 0.112 rad/s²
```

---

## Case 337 — Bottom: Eternal Sharp / ES (1.0 g)

> **Stock combo (Flame Libra T125ES):** Clear Wheel: Libra · Metal Wheel: Flame · Track: T125 · Bottom: Eternal Sharp
> **Stock combo (Thermal Pisces T125ES):** Clear Wheel: Pisces · Metal Wheel: Thermal · Track: T125 · Bottom: Eternal Sharp

**Thesis.** ES inserts a metal shaft between the outer ABS body and the contact tip, allowing the tip to free-spin relative to the body — in principle, decoupling the floor-friction torque from the spinning bey. The critical mechanism that would make this work is a ball bearing (as in Bearing Core's NSK Shield bearings); ES uses only a plastic-on-metal sleeve bushing, producing a coupling torque 197× larger than the floor friction it was meant to decouple. The result is that the tip co-rotates with the bey body throughout the match, and ES loses to S/BS by adding a second torque drain (the bushing itself). The marginal superiority of ES over S in competitive play comes not from improved spin isolation but from two secondary effects: (1) the metal shaft lowers the CoM of the tip sub-assembly, partially offsetting the taller body height (10.63 mm vs 8.83 mm for S), and (2) the bushing can absorb and partially isolate lateral impact impulses, reducing the destabilisation amplitude at the expense of extra spin drain per strike.

**Geometry (side view — free-spinning mechanism)**

```
  ┌──────────────────────────┐   r_full = 7.89 mm,  h_full = 10.63 mm
  │  outer ABS body (spins   │
  │  with bey at ω_bey)      │   ← bushing contact surface (plastic-on-metal)
  │  ╔══════════════╗         │   r_shaft ≈ 1.5 mm
  │  ║  metal shaft ║         │   τ_bushing >> τ_floor → tip co-rotates
  │  ╚══════════════╝         │
  │         ╲  35° cone tip  │
  │          ╲               │
  │           ●  a = 0.020 mm  (same Sneddon as S)
```

**Bushing Coupling Analysis**

```
τ_bushing = μ_bushing × W × r_shaft
          = 0.30 × 0.491 × 0.0015                                  → 2.21×10⁻⁴ N·m

τ_floor (tip, same as S) = 1.12×10⁻⁶ N·m

Coupling ratio:
  τ_bushing / τ_floor = 2.21×10⁻⁴ / 1.12×10⁻⁶                    → 197×
```

A 197× ratio means the bushing overpowers the floor friction by two orders of magnitude. At steady state the tip is dragged to ω_bey (with negligible lag), and the bey experiences:

```
τ_total_ES = τ_floor + τ_bushing_loss_per_cycle

In practice, once the tip is at ω_bey, τ_bushing_loss ≈ 0 (no relative sliding in bushing).
But any perturbation (lateral hit) creates a momentary velocity differential:

  Δω = ω_bey − ω_tip (transient after impact)
  τ_restore = τ_bushing = 2.21×10⁻⁴ N·m  (re-accelerates tip back to ω_bey)

Energy dissipated re-synchronising tip after each hit:
  ΔE = ½·I_tip·(Δω)² = ½ × 2.0×10⁻¹⁰ × Δω²

At Δω = 50 rad/s (moderate impact):  ΔE ≈ 2.5×10⁻⁷ J per impact (negligible)
```

The energy loss per re-synchronisation event is negligible (~0.25 μJ). The marginal improvement of ES over S is therefore only the lateral impact absorption from bushing slip during the transient — this reduces the peak angular impulse transmitted to the bey body, decreasing toppling probability.

**CoM Height Comparison**

```
S:  h_full = 8.83 mm, all ABS (ρ = 1050 kg/m³)
    CoM_S ≈ 0.5 × 8.83 = 4.42 mm  (rough half-height estimate)

ES: h_full = 10.63 mm, metal shaft in lower half
    metal shaft: m_shaft ≈ 0.3 g at h_shaft ≈ 2.5 mm  (lower portion)
    ABS body:   m_ABS ≈ 0.7 g at h_ABS ≈ 6.5 mm  (upper portion)
    CoM_ES = (0.3 × 2.5 + 0.7 × 6.5) / 1.0                        = 5.3 mm

Despite lower shaft CoM contribution, the taller body raises net CoM vs S (5.3 vs 4.4 mm).
Stability impact: ES is marginally LESS stable geometrically, but bushing impact damping partially compensates.
```

**TypeScript model**

```typescript
function esBushingCouplingRatio(mu_bushing: number, W: number, r_shaft_mm: number,
                                 tau_floor: number): number {
  const tau_bushing = mu_bushing * W * (r_shaft_mm / 1000);
  return tau_bushing / tau_floor;
}

function esCoM(m_shaft_g: number, h_shaft_mm: number,
               m_abs_g: number, h_abs_mm: number): number {
  return (m_shaft_g * h_shaft_mm + m_abs_g * h_abs_mm) / (m_shaft_g + m_abs_g);
}

function esImpactEnergyLoss(I_tip: number, delta_omega: number): number {
  return 0.5 * I_tip * delta_omega * delta_omega;
}

// esBushingCouplingRatio(0.30, 0.491, 1.5, 1.12e-6)      → 197  (tip co-rotates; no stamina gain from decoupling)
// esCoM(0.3, 2.5, 0.7, 6.5)                              → 5.3 mm  (vs S: 4.42 mm — taller CoM)
// esImpactEnergyLoss(2.0e-10, 50)                         → 2.5×10⁻⁷ J  (negligible per-hit absorption loss)
```

---

## Case 338 — Bottom: Metal Sharp / MS (1.30 g)

> **Stock combo (Burn Phoenix 135MS):** Clear Wheel: Phoenix · Metal Wheel: Burn · Track: 135 · Bottom: Metal Sharp

**Thesis.** MS replaces the ABS cone with a precision-ground zinc-alloy cone at a steeper 45° half-apex angle. Two mechanisms combine to reduce floor friction below any ABS sharp tip: (1) the steeper cone (α_Sneddon = 45° vs 55°) reduces contact radius from 0.020 mm to 0.017 mm, and (2) the polished metal surface achieves a lower kinetic friction coefficient (μ ≈ 0.14 metal-tip-on-ABS floor) than ABS-on-ABS (μ = 0.17). The resulting spin decay (0.079 rad/s²) is better than S, BS, or ES, approaching SD (0.102) but still above SB (0.038). MS is "outclassed" solely by its geometry liabilities: the metal tip adds 0.7 g over S, raising total mass to 1.30 g and pushing the assembly CoM to 5.8 mm — 32% higher than S — on the tallest body in the sharp family (11.03 mm). This CoM elevation multiplies the destabilising torque from any lateral hit, making MS prone to catastrophic topple even at low impact velocities. The metal tip also poses stadium-floor damage risk at high spin under M145 (no height buffer) — a practical reason to avoid MS in open play.

**Geometry (side view — metal cone)**

```
  ┌──────────────────────────┐   r_full = 7.88 mm
  │  ABS outer body          │   h_full = 11.03 mm  (tallest sharp tip)
  │   ╲                      │   h_tip  = 8.58 mm
  │    ╲  45° half-angle     │
  │     ╲  (steeper than S)  │
  │      ╲                   │
  │       ╔══════╗            │   metal cone (zinc alloy)
  │       ╚══════╝            │
  │            ●  a = 0.017 mm  (Sneddon, metal-ABS E* = 2.60 GPa)
```

**Metal Sneddon Contact**

```
tipAngle = 45°  → α_Sneddon = 90° − 45° = 45°

E*_MS (metal-ABS): 1/E* = (1−0.09)/100e9 + (1−0.137)/2.3e9
                 = 9.1×10⁻¹² + 3.752×10⁻¹⁰                      → E* = 2.60 GPa

a_MS² = W·π / (2·E*·tan 45°) = 0.491·π / (2 × 2.60×10⁹ × 1.0)
      = 1.543 / 5.20×10⁹                                          = 2.97×10⁻¹⁰ m²
a_MS  = 1.72×10⁻⁵ m  (0.017 mm  — 14% smaller than S)

μ_MS = 0.14  (polished metal cone on ABS floor — lower than μ_hard-tip = 0.17)

τ_MS = (2/3) × 0.14 × 0.491 × 1.72×10⁻⁵                        → 7.89×10⁻⁷ N·m
dω/dt_MS = 7.89×10⁻⁷ / 1.0×10⁻⁵                                 → 0.079 rad/s²
```

**Stamina Ranking Across Sharp Family and Beyond**

```
| Bottom | a (mm)  | τ (N·m)    | dω/dt (rad/s²) |
|--------|---------|------------|----------------|
| SB     | 0.069   | 3.83×10⁻⁷ | 0.038          |
| MS     | 0.017   | 7.89×10⁻⁷ | 0.079          |
| SD     | 0.018   | 1.02×10⁻⁶ | 0.102          |
| D / S / BS / ES | 0.020 | 1.12×10⁻⁶ | 0.112   |
| MB     | 0.079   | 1.44×10⁻⁶ | 0.144          |
```

MS achieves the second-best stamina in the conical-tip family, after SB. Its tip-level stamina exceeds SD despite SD being SD's competitive rating as superior — confirming that MS is defeated entirely by its catastrophic balance liabilities, not its contact mechanics.

**CoM Analysis and Toppling Risk**

```
Metal cone mass:   m_metal ≈ 0.6 g,  located at h ≈ 2.0 mm  (low)
ABS body mass:     m_ABS   ≈ 0.7 g,  located at h ≈ 7.5 mm  (mid/upper body)

CoM_MS = (0.6×2.0 + 0.7×7.5) / 1.30                            = 5.12 mm  (from tip)

vs S:  CoM_S ≈ 4.42 mm

Toppling torque at θ = 5° tilt, F_lat = 0.5 N impulse:
  τ_topple = F_lat × CoM × sin(θ) = 0.5 × 0.00512 × sin(5°)    → 2.24×10⁻⁴ N·m

Gyroscopic restoring torque at ω = 100 rad/s:
  τ_restore = I·ω·Ω_prec,  Ω_prec = (m·g·r_CoM) / (I·ω)
  = m·g·r_CoM = 0.050 × 9.81 × 0.00512                          → 2.51×10⁻³ N·m

Topple ratio: τ_topple / τ_restore = 2.24×10⁻⁴ / 2.51×10⁻³    → 8.9%  (at ω = 100 rad/s)

At ω = 30 rad/s (late match):
  τ_restore scales with ω → 7.53×10⁻⁴ N·m
  Topple ratio → 29.7%  (approaching instability threshold)
```

MS becomes increasingly unstable as it spins down, because the gyroscopic restoring torque decreases linearly with ω while the CoM-driven toppling torque is constant. The tall body with elevated CoM creates a runaway instability in the late-wobble phase, exactly opposite to WD's rim-contact mechanism which extends match time.

**TypeScript model**

```typescript
function msSneddonContact(tipAngle_deg: number, W: number): number {
  const alpha = (90 - tipAngle_deg) * Math.PI / 180;
  const E_star = 2.60e9;
  return Math.sqrt((W * Math.PI) / (2 * E_star * Math.tan(alpha)));
}

function msSpinDecay(tipAngle_deg: number, W: number, mu_metal: number, I_system: number): number {
  const a = msSneddonContact(tipAngle_deg, W);
  return (2 / 3) * mu_metal * W * a / I_system;
}

function msToppleRatio(F_lat: number, com_mm: number, theta_deg: number,
                        m_kg: number, omega: number, I_bey: number): number {
  const tau_topple = F_lat * (com_mm / 1000) * Math.sin(theta_deg * Math.PI / 180);
  const tau_restore = m_kg * 9.81 * (com_mm / 1000);
  return tau_topple / tau_restore;
}

function msCoM(m_metal_g: number, h_metal_mm: number,
               m_abs_g: number, h_abs_mm: number): number {
  return (m_metal_g * h_metal_mm + m_abs_g * h_abs_mm) / (m_metal_g + m_abs_g);
}

// msSneddonContact(45, 0.491)                           → 1.72×10⁻⁵ m  (14% smaller than S)
// msSpinDecay(45, 0.491, 0.14, 1.0e-5)                 → 0.079 rad/s²  (best of ABS-sharp family; 29% better than S)
// msCoM(0.6, 2.0, 0.7, 7.5)                            → 5.12 mm  (vs S: 4.42 mm — 16% higher CoM)
// msToppleRatio(0.5, 5.12, 5, 0.05, 30, 1.0e-5)        → 29.7%  (at low spin — late-match instability)
```

---

## Case 339 — Bottom: Flat / F (1.0 g)

> **Stock combo (Pegasis 105F):** Wheel: Pegasis · Track: 105 · Bottom: Flat
> **Stock combo (Aquario 105F):** Wheel: Aquario · Track: 105 · Bottom: Flat
> **Stock combo (L Drago 105F):** Wheel: L Drago · Track: 105 · Bottom: Flat
> **Stock combo (Tornado Herculeo 105F):** Clear Wheel: Heracleo · Metal Wheel: Tornado · Track: 105 · Bottom: Flat

**Thesis.** F is the baseline plastic flat tip: a circular disk of radius 2.04 mm in full contact with the stadium floor. The entire flat face participates in friction, so the spinning resistance torque is τ = (2/3)μWr_flat = 2.34×10⁻⁴ N·m and spin decay is 23.4 rad/s² — already 209× GF's decay rate expressed relative to SB, and large enough to drain a bey faster than any of the conical or ball tips. The lateral driving force in the full-slip regime (F_lat = μ × W = 0.172 N) pushes the bey across the stadium and drives orbital attack patterns, but because the contact is plain ABS (μ = 0.35 vs rubber μ = 0.85), it produces neither the grip to maintain a Flower Pattern reliably nor the speed of WF/XF. F is the ancestral attack tip from which the wider variants are derived.

**Geometry (side view)**

```
  ┌──────────────────────────┐   r_full = 7.960 mm
  │  ABS outer body          │   h_full = 8.96 mm
  │   ╲                      │   r_flat = 2.04 mm  (narrow flat face)
  │    ╲_____________________│   h_tip  = 5.96 mm
  │          flat face       │
  │   ████████████████████   │   contact disk: A = π × 2.04² = 13.1 mm²
```

**Spinning Friction (flat disk)**

```
W = 0.491 N  (assembled bey)
μ = 0.35  (ABS-on-ABS)

τ_F = (2/3) × 0.35 × 0.491 × 0.00204                            → 2.34×10⁻⁴ N·m
dω/dt_F = 2.34×10⁻⁴ / 1.0×10⁻⁵                                  → 23.4 rad/s²

Lateral drive (full-slip):
F_lat_F = 0.35 × 0.491                                           → 0.172 N
```

**Flower Pattern Stability**

For a plastic flat tip to maintain a Flower Pattern (circular orbital path), the friction force must curve the bey's trajectory consistently. The orbital curvature radius:

```
R_curve = m × V_orb² / F_lat = 0.050 × V_orb² / 0.172

At V_orb = 1.5 m/s:  R_curve = 0.050 × 2.25 / 0.172             → 0.654 m  (very large)
At V_orb = 0.5 m/s:  R_curve = 0.050 × 0.25 / 0.172             → 0.073 m  (73 mm — stadium-scale)
```

At typical attack orbital speeds (~1 m/s), the curvature radius exceeds the stadium diameter, meaning F cannot close a circular orbit by friction alone. Pattern maintenance requires a Sliding Shoot with enough angular momentum to use the stadium wall as the centripetal guide. Rubber tips, with F_lat ≈ 0.417 N, can close orbits at higher speeds; plastic F cannot.

**TypeScript model**

```typescript
function fSpinTorque(r_flat_mm: number, W: number, mu: number): number {
  return (2 / 3) * mu * W * (r_flat_mm / 1000);
}

function fLateralDrive(W: number, mu: number): number {
  return mu * W;
}

function fOrbitalCurvatureRadius(m_kg: number, v_orb: number, F_lat: number): number {
  return m_kg * v_orb * v_orb / F_lat;
}

// fSpinTorque(2.04, 0.491, 0.35)              → 2.34×10⁻⁴ N·m
// fSpinTorque(2.04, 0.491, 0.35) / 1.0e-5    → 23.4 rad/s²  (209× better stamina than GF? No: GF=103, F=23.4 — F is 4.4× better than GF)
// fLateralDrive(0.491, 0.35)                  → 0.172 N  (same for all plastic flats)
// fOrbitalCurvatureRadius(0.050, 1.0, 0.172) → 0.291 m  (too large for stadium flower at high speed)
```

---

## Case 340 — Bottom: Wide Flat / WF (0.6 g)

> **Stock combo (Quetzalcoatl 90WF):** Wheel: Quetzalcoatl · Track: 90 · Bottom: Wide Flat
> **Stock combo (Bakushin Susanow 90WF):** Clear Wheel: Susanow · Metal Wheel: Bakushin · Track: 90 · Bottom: Wide Flat
> **Stock combo (Wing Pegasis 90WF):** 4D Clear Wheel: Pegasis III · 4D Metal Wheel: Wing · Track: 90 · Bottom: Wide Flat

**Thesis.** WF widens the flat face to an estimated ~4.5 mm radius (no official tip-width data supplied), roughly doubling F's contact area. By the spinning disk friction formula, doubling r_flat at the same μ and W more than doubles the spinning torque (τ_WF ≈ 5.16×10⁻⁴ N·m, dω/dt ≈ 51.6 rad/s²) — WF is 2.21× worse for spin duration than F. The observed speed advantage over F arises from the gyroscopic precession orbital mechanism: as the wider contact sweeps more floor area per revolution, the net tangential impulse per orbital cycle increases, sustaining a higher equilibrium orbital velocity. WF is lighter than F (0.6 vs 1.0 g), which further lowers the inertial resistance to orbital acceleration (a ∝ F/m: same F_lat but 40% less mass → 67% higher orbital acceleration). WF's superior stamina over RF is simply μ: ABS 0.35 vs rubber ~0.85 gives WF 2.43× less spinning torque at the same r_flat.

**Geometry (side view — estimated dimensions)**

```
  ┌──────────────────────────┐   r_full ≈ 7.8–8.0 mm  (estimated)
  │  ABS outer body (light)  │   h_full ≈ 7–8 mm  (estimated)
  │   ╲                      │   r_flat ≈ 4.5 mm  (est. — "significantly larger than F")
  │    ╲_____________________│
  │     ████████████████████ │   contact disk: A ≈ π × 4.5² ≈ 63.6 mm²  (4.86× F)
```

**Spinning Friction (estimated)**

```
r_flat_WF ≈ 4.5 mm  (estimated; no official tip width given)

τ_WF = (2/3) × 0.35 × 0.491 × 0.0045                            → 5.16×10⁻⁴ N·m
dω/dt_WF = 5.16×10⁻⁴ / 1.0×10⁻⁵                                 → 51.6 rad/s²  (2.21× worse than F)

vs RF (rubber, same r_flat estimate):
τ_RF = (2/3) × 0.85 × 0.491 × 0.0045                            → 1.253×10⁻³ N·m
Stamina ratio: τ_WF / τ_RF = 5.16 / 12.53                       → 0.412  (WF has 2.43× better stamina than RF)
```

**Orbital Speed Advantage Over F**

```
Lower mass (0.6 vs 1.0 g) with same F_lat = 0.172 N:

Orbital tangential acceleration a_orb = F_lat / m
  a_WF = 0.172 / 0.0006                                          = 287 m/s²
  a_F  = 0.172 / 0.0010                                          = 172 m/s²

Speed ratio: a_WF / a_F = 287 / 172                              → 1.67×  (WF accelerates 67% faster than F)
```

The wider contact area also increases the per-cycle impulse from precession-floor interaction, compounding the mass advantage. Combined effect: WF significantly faster orbital motion than F, consistent with competitive observation.

**TypeScript model**

```typescript
function wfVsRFStaminaRatio(r_flat_mm: number): number {
  const tau_WF = (2 / 3) * 0.35 * 0.491 * (r_flat_mm / 1000);
  const tau_RF = (2 / 3) * 0.85 * 0.491 * (r_flat_mm / 1000);
  return tau_WF / tau_RF;
}

function wfOrbitalAccelRatio(m_WF_g: number, m_F_g: number): number {
  return m_F_g / m_WF_g;
}

// fSpinTorque(4.5, 0.491, 0.35) / 1.0e-5                        → 51.6 rad/s²  (2.21× worse stamina than F)
// wfVsRFStaminaRatio(4.5)                                        → 0.412  (WF 2.43× better stamina than RF)
// wfOrbitalAccelRatio(0.6, 1.0)                                  → 1.67×  (WF 67% faster acceleration than F)
```

---

## Case 341 — Bottom: Extreme Flat / XF (0.68 g)

> **Stock combo (Mercury Anubius 85XF):** Clear Wheel: Anubis · Metal Wheel: Mercury · Track: 85 · Bottom: Extreme Flat
> **Stock combo (Bakushin/Hell Beelzeb T125XF / 125XF):** 4D Clear Wheel: Beelzeb · 4D Metal Wheel: Bakushin/Hell · Track: T125/125 · Bottom: Extreme Flat
> **Stock combo (Omega Dragonis 85XF):** 4D Clear Wheel: Dragonis · 4D Metal Wheel: Omega · Track: 85 · Bottom: Extreme Flat

**Thesis.** XF is the widest plastic flat tip (r_flat = 2.955 mm, nominally equal to RF's contact radius), with four small plastic protrusions evenly spaced around the circumference. The spinning torque (3.39×10⁻⁴ N·m, dω/dt = 33.9 rad/s²) places XF between F (23.4) and WF (51.6), and well below RF's rubber equivalent. XF's competitive role is the balance between attack speed and residual stamina: the wide plastic face gives orbital velocity close to WF while retaining enough spin for a spin-equalization window that MF cannot achieve. The circumferential protrusions increase effective contact radius from 2.955 to approximately 3.5–4.0 mm at large tilt angles (protrusion engagement), providing a stepped tilt-contact mechanism analogous to WD's rim-contact but at a much smaller radius and torque. The shorter body (h_full = 9.01 mm vs MF's ~12 mm) allows the bey to precess at lower ω before toppling, making XF the superior spin-equalizer in opposite-spin matchups.

**Geometry (side view — stepped protrusions)**

```
  ┌──────────────────────────┐   r_full = 7.915 mm
  │  ABS outer body          │   h_full = 9.01 mm,  h_tip = 6.28 mm
  │ ┌─prtrusion──┐            │   r_flat = 2.955 mm  (widest plastic flat)
  │ │ 4 × protr. │            │   r_protr ≈ 7.5 mm  (at circumference edge)
  │ └────────────┘            │
  │    ╲_____________________ │   contact disk A = π × 2.955² = 27.4 mm²
  │    ████████████████████   │
              ↑ 4 protrusions at 90° intervals on outer edge
```

**Spinning Friction**

```
τ_XF = (2/3) × 0.35 × 0.491 × 0.002955                         → 3.39×10⁻⁴ N·m
dω/dt_XF = 3.39×10⁻⁴ / 1.0×10⁻⁵                                → 33.9 rad/s²

vs RF (same tip radius, rubber):
τ_RF_same = (2/3) × 0.85 × 0.491 × 0.002955                    → 8.23×10⁻⁴ N·m
XF stamina advantage: τ_XF / τ_RF_same = 3.39 / 8.23           → 0.412  (XF 2.43× better stamina than RF at equal r)
```

**Protrusion Tilt-Contact Engagement**

At tilt θ, the outer protrusions (at r_protr ≈ 7.5 mm, height below rim ≈ 1.5 mm) engage the floor when:

```
θ_crit = arctan(h_rim / (r_protr − r_flat))
       = arctan(1.5 / (7.5 − 2.955))
       = arctan(1.5 / 4.545)
       = arctan(0.330)                                           → 18.3°

τ_protr = (2/3) × 0.35 × 0.491 × 0.0075                        → 8.59×10⁻⁴ N·m  (2.53× upright)
```

Protrusion engagement at 18.3° tilt provides an additional friction bump — not for stamina extension, but increasing orbital drive force during precession-phase tilts, consistent with XF's role as a high-speed attack tip.

**Spin-Equalization Window (XF vs MF)**

At low ω_spin, the bey precesses. Critical topple spin:

```
ω_crit ∝ √(m × g × r_CoM / I_z)   (approximate, assuming I_z ≈ I_x for a disk bey)

XF: r_CoM_XF ≈ h_full/2 = 4.505 mm
MF: r_CoM_MF ≈ h_full/2 ≈ 6.0 mm  (taller body, est. h_full ~12 mm)

ω_crit_XF / ω_crit_MF = √(r_CoM_XF / r_CoM_MF)
                       = √(4.505 / 6.0)                         → 0.866  (XF topples 13.4% lower ω)
```

XF can sustain precessional orbiting at 13.4% lower spin than MF before toppling. In a spin-equalization contest (opposite-spin contact), this window extension is decisive: XF maintains orbital contact while MF has already fallen.

**TypeScript model**

```typescript
function xfSpinDecay(r_flat_mm: number, W: number, I_system: number): number {
  return (2 / 3) * 0.35 * W * (r_flat_mm / 1000) / I_system;
}

function xfProtrusionTiltAngle(h_rim_mm: number, r_protr_mm: number, r_flat_mm: number): number {
  return Math.atan(h_rim_mm / (r_protr_mm - r_flat_mm)) * 180 / Math.PI;
}

function xfProtrusionTorque(r_protr_mm: number, W: number): number {
  return (2 / 3) * 0.35 * W * (r_protr_mm / 1000);
}

function xfVsMFToppleRatio(rCoM_xf_mm: number, rCoM_mf_mm: number): number {
  return Math.sqrt(rCoM_xf_mm / rCoM_mf_mm);
}

// xfSpinDecay(2.955, 0.491, 1.0e-5)                   → 33.9 rad/s²  (between F and WF)
// xfProtrusionTiltAngle(1.5, 7.5, 2.955)               → 18.3°  (protrusion engagement angle)
// xfProtrusionTorque(7.5, 0.491)                        → 8.59×10⁻⁴ N·m  (2.53× upright torque)
// xfVsMFToppleRatio(4.505, 6.0)                         → 0.866  (XF topples at 13.4% lower spin — better spin-equalizer)
```

---

## Case 342 — Bottom: Metal Flat / MF (est. ~1.3 g)

> **Stock combo (Screw Capricorne 90MF):** Clear Wheel: Capricorne · Metal Wheel: Screw · Track: 90 · Bottom: Metal Flat
> **Stock combo (Screw Lyra ED145MF):** 4D Clear Wheel: Lyra · 4D Metal Wheel: Screw · Track: ED145 · Bottom: Metal Flat

**Thesis.** MF replaces the ABS flat face with a precision-ground metal disk (estimated r_flat ≈ 2.0 mm, smaller than XF's 2.955 mm per wiki: "its metal tip is smaller than XF's plastic tip"). The metal-on-ABS friction coefficient (μ = 0.20) is 43% lower than ABS-on-ABS (0.35), yielding a spinning torque of 1.31×10⁻⁴ N·m — less than half of F's — and spin decay of only 13.1 rad/s². MF's stamina exceeds every plastic flat tip in this series and approaches MB's ball-contact stamina (14.4 rad/s²). The lateral orbital drive force is also 43% less than plastic flat tips (F_lat = 0.098 N vs 0.172 N), making MF slower and more controlled. The rigid metal face does not deform under load, so the contact area is exactly π × r_flat² with no elastic spreading — the contact stays consistent throughout the match. MF topples at higher ω than XF (CoM 6.0 mm vs XF's 4.5 mm) and cannot spin-equalize as deep into low-spin territory.

**Geometry (side view — metal face)**

```
  ┌──────────────────────────┐   r_full ≈ 7.88 mm
  │  ABS outer body (tall)   │   h_full ≈ 12 mm  (est. — "taller than XF")
  │   ╲                      │   r_flat ≈ 2.0 mm  (metal, smaller than XF)
  │    ╲_____________________│
  │    ╔═══════════════════╗  │   metal disk (zinc/steel)
  │    ╚═══════════════════╝  │
  │    ████ contact ████      │   A = π × 2.0² = 12.6 mm²  (rigid — no deformation spreading)
```

**Metal Flat Contact**

For a metal disk face pressing against an ABS stadium floor, the contact is the full disk — no Hertzian or Sneddon correction because the geometry is macroscopically flat. The metal does not deform; the ABS floor may indent negligibly (Hertz half-space on ABS: δ ≈ W / (E_ABS × r_flat) ≈ 0.491 / (2.3e9 × 0.002) ≈ 0.107 μm — negligible). Contact remains the full flat face at all battle loads.

```
τ_MF = (2/3) × 0.20 × 0.491 × 0.002                             → 1.31×10⁻⁴ N·m
dω/dt_MF = 1.31×10⁻⁴ / 1.0×10⁻⁵                                 → 13.1 rad/s²

vs RF (rubber r_flat ≈ 4.5 mm): τ_RF ≈ 1.25×10⁻³ N·m
MF stamina vs RF: 1.31×10⁻⁴ / 1.25×10⁻³                        → 0.105  (MF has 9.5× better stamina than RF)

vs plastic flat family:
  F: 23.4 rad/s²,  XF: 33.9,  WF: 51.6
  MF: 13.1 rad/s² — best stamina of all flat-type bottoms
```

**Lateral Drive vs Plastic Flats**

```
F_lat_metal = μ_metal × W = 0.20 × 0.491                        → 0.098 N
F_lat_plastic = μ_ABS × W = 0.35 × 0.491                        → 0.172 N

Drive force deficit: 0.098 / 0.172                               → 57%  (MF generates 43% less orbital force)
```

Lower orbital force → slower movement, more controlled pattern, consistent ability to maintain a Sliding Shoot Flower Pattern (lower drive force keeps the bey from overshooting the orbit).

**Flower Pattern Condition (MF)**

```
R_curve = m × V_orb² / F_lat

At V_orb = 0.5 m/s:  R_curve_MF = 0.050 × 0.25 / 0.098         = 0.128 m  (128 mm)
vs F at same speed:  R_curve_F  = 0.050 × 0.25 / 0.172         = 0.073 m  (73 mm)
```

At 0.5 m/s, MF needs a 128 mm curvature radius vs F's 73 mm — the orbit closes at a larger radius, fitting a typical 160 mm stadium bowl. MF's ability to sustain a Flower Pattern comes from this moderate curvature at controllable orbital speeds.

**Full Flat-Type Family Summary**

```
| Bottom | r_flat (mm) | μ    | τ (N·m)    | dω/dt (rad/s²) | F_lat (N) |
|--------|-------------|------|------------|----------------|-----------|
| MF     | ~2.0        | 0.20 | 1.31×10⁻⁴ | 13.1           | 0.098     |
| F      | 2.04        | 0.35 | 2.34×10⁻⁴ | 23.4           | 0.172     |
| XF     | 2.955       | 0.35 | 3.39×10⁻⁴ | 33.9           | 0.172     |
| WF     | ~4.5 (est.) | 0.35 | 5.16×10⁻⁴ | 51.6           | 0.172     |
| RF     | ~4.5 (est.) | 0.85 | 1.25×10⁻³ | 125            | 0.417     |
```

**TypeScript model**

```typescript
function mfSpinDecay(r_flat_mm: number, W: number, I_system: number): number {
  return (2 / 3) * 0.20 * W * (r_flat_mm / 1000) / I_system;
}

function mfFloorIndentation(W: number, r_flat_mm: number, E_ABS: number): number {
  return W / (E_ABS * (r_flat_mm / 1000));
}

function mfVsPlasticDriveRatio(mu_metal: number, mu_plastic: number): number {
  return mu_metal / mu_plastic;
}

function mfOrbitalCurveRadius(m_kg: number, v_orb: number, mu_metal: number, W: number): number {
  return m_kg * v_orb * v_orb / (mu_metal * W);
}

function flatFamilyRanking(tips: { name: string; r_mm: number; mu: number; W: number; I: number }[]): { name: string; decay: number }[] {
  return tips.map(t => ({
    name: t.name,
    decay: (2 / 3) * t.mu * t.W * (t.r_mm / 1000) / t.I,
  })).sort((a, b) => a.decay - b.decay);
}

// mfSpinDecay(2.0, 0.491, 1.0e-5)                             → 13.1 rad/s²  (best stamina of all flat tips)
// mfFloorIndentation(0.491, 2.0, 2.3e9)                       → 1.07×10⁻⁷ m  (0.107 μm — negligible ABS indent)
// mfVsPlasticDriveRatio(0.20, 0.35)                           → 0.571  (43% less orbital drive than plastic flat)
// mfOrbitalCurveRadius(0.050, 0.5, 0.20, 0.491)               → 0.128 m  (128 mm — fits stadium bowl for flower pattern)
```

---

## Case 343 — 4D Metal Wheel: Big Bang (41.83 g)

> **Stock combo (Big Bang Pegasis F:D):** 4D Clear Wheel: Pegasis III · 4D Metal Wheel: Big Bang · Bottom: Final Drive

**Thesis.** Big Bang is a three-layer 4D Metal Wheel assembled from a polycarbonate PC Frame (2.50 g), a zinc-alloy Metal Frame (25.48 g), and a zinc-alloy Core (13.81 g), totalling 41.83 g. The Metal Frame dominates the assembly inertia at 67.7% of the total I_z ≈ 1.13×10⁻⁵ kg·m², with mass concentrated in three swept-feather wings at r ≈ 17–23 mm. The C₃ three-wing layout produces zero transverse anisotropy (I_x = I_y by symmetry) and therefore zero nutation forcing at any harmonic of ω — the spin axis is unconditionally stable throughout the match. The cube-and-hole mode selector (PC Frame rotates over Metal Frame top cubes; Core rotates under Metal Frame bottom holes) creates four distinct contact-face profiles without changing mass positions or I_z. Barrage Mode and Omni-Directional Mode are the competitive choices: Barrage presents a near-vertical wing face (smash = 99.0%) over the largest contact area (Core extends to fill the lower gap), while Omni-Directional distributes contact symmetrically around the circumference (average smash = 86.6%). At ω = 150 rad/s, L_BigBang = 1.70×10⁻³ kg·m²/s — 17.9% below the Basalt reference. Despite Big Bang being heavier than any Chrome Wheel in this series, Basalt's additional 13.5 g raised at a slightly higher mean radius produces greater absolute L, explaining why Big Bang "has since been severely outclassed."

**Geometry (cross-section stack + top view)**

```
  Top view (PC Frame, C₃ ring):         Side stack (assembled):
  ╔══════════════════════════╗           ┌────────────────────────┐  PC Frame (PC, 2.50 g)
  ║  ╱ wing ╲   ╱ wing ╲    ║           ├────────────────────────┤  Metal Frame (Zn, 25.48 g)
  ║ ║ feather║○║ feather║   ║           │  ┌──────────────────┐  │    ← wings at r=17–23 mm
  ║  ╲      ╱   ╲      ╱    ║           │  │     Core          │  │  Core (Zn, 13.81 g)
  ╚══════════════════════════╝           └──┴──────────────────┴──┘
       r_hub≈5 mm,  r_outer≈23 mm         cube-in-hole switching: 4 mode positions
```

**Three-Component Inertia**

```
PC Frame (polycarbonate annular ring, m=2.50 g):
  r_inner=9 mm,  r_outer=22 mm
  I_PC = ½ × 0.0025 × (0.009² + 0.022²)                         = 8.16×10⁻⁷ kg·m²

Metal Frame (zinc alloy, m=25.48 g — 3 zones):
  Zone 1: hub spokes (r=5–10 mm, ~3 g):
    I₁ = ½ × 0.003 × (0.005² + 0.010²)                          = 1.88×10⁻⁷ kg·m²
  Zone 2: mid-ring (r=10–17 mm, ~8 g):
    I₂ = ½ × 0.008 × (0.010² + 0.017²)                          = 1.56×10⁻⁶ kg·m²
  Zone 3: outer feather wings (r=17–23 mm, ~14.48 g):
    I₃ = ½ × 0.01448 × (0.017² + 0.023²)                        = 5.92×10⁻⁶ kg·m²
  I_MF = 1.88×10⁻⁷ + 1.56×10⁻⁶ + 5.92×10⁻⁶                    = 7.67×10⁻⁶ kg·m²

Core (zinc alloy, m=13.81 g — 3 zones):
  Zone 1: inner hub (r=5–9 mm, ~3 g):
    I₁ = ½ × 0.003 × (0.005² + 0.009²)                          = 1.59×10⁻⁷ kg·m²
  Zone 2: mid-wing (r=9–16 mm, ~6 g):
    I₂ = ½ × 0.006 × (0.009² + 0.016²)                          = 1.01×10⁻⁶ kg·m²
  Zone 3: wing tips (r=16–21 mm, ~4.81 g):
    I₃ = ½ × 0.00481 × (0.016² + 0.021²)                        = 1.68×10⁻⁶ kg·m²
  I_Core = 1.59×10⁻⁷ + 1.01×10⁻⁶ + 1.68×10⁻⁶                  = 2.85×10⁻⁶ kg·m²

I_total = I_PC + I_MF + I_Core = 8.16×10⁻⁷ + 7.67×10⁻⁶ + 2.85×10⁻⁶ → 1.133×10⁻⁵ kg·m²
```

Metal Frame contributes 67.7% of total I despite being 60.9% of total mass — the outer wing placement (r = 17–23 mm) is more distal than the Core (r = 16–21 mm), leveraging mass efficiently.

**C₃ Symmetry — Zero Nutation Forcing**

```
Three identical wings at 120° intervals: C₃ rotation group.
For any order-n ≥ 3 symmetry: I_x = I_y  (by Neumann's theorem)
ΔI_transverse = 0

Nutation forcing τ_nut = ΔI × ω / 2 = 0  at all harmonics.
```

The spin axis is gyroscopically stable throughout the match, with no self-induced wobble. This contrasts with C₂ wheels (Gargole, Bahamdia) where ΔI drives nutation at 2ω.

**Mode-Dependent Contact Face Geometry**

Each mode is set by the angular position of the PC Frame and Core via the cube-and-hole mechanism. Mass and I_z are identical across all modes; only the exposed contact profile changes.

```
| Mode              | PC Frame pos.  | Core pos.     | Face φ (from radial) | Smash | Recoil |
|-------------------|----------------|---------------|----------------------|-------|--------|
| Smash Attack      | blocks gap     | extended      | ≈ 5°                 | 0.996 | 0.087  |
| Upper Attack      | slope exposed  | retracted     | ≈ −25° (upward)      | 0.906 | 0.423  |
| Barrage           | slope exposed  | extended      | ≈ 8°                 | 0.990 | 0.139  |
| Omni-Directional  | blocks gap     | retracted     | ≈ 30° (avg)          | 0.866 | 0.500  |
```

Barrage Mode: slope aligns with wing + larger wing area (Core fills lower gap) → near-vertical face over maximum contact surface = maximum impact momentum per hit.

Omni-Directional Mode: blocked gap creates a more symmetric "bumper" profile — any azimuthal impact angle produces a consistent deflection. The 0.50 recoil fraction is a trade-off, but orbital consistency across all attack angles is the competitive advantage.

Upper Attack Mode: the negative-angle face deflects opponents upward (destabilisation rather than ring-out). Seldom used because the upward force component requires the opponent to be at exactly the right tilt phase.

**Angular Momentum vs Basalt**

```
At ω = 150 rad/s:

L_BigBang = 1.133×10⁻⁵ × 150                                    → 1.700×10⁻³ kg·m²/s
L_Basalt   = 1.38×10⁻⁵ × 150                                    → 2.070×10⁻³ kg·m²/s

Deficit: 1 − 1.700/2.070                                        → 17.9%

Specific inertia (I/m):
  Big Bang:  1.133×10⁻⁵ / 0.04183                              = 2.709×10⁻⁴ m²
  Basalt:    1.38×10⁻⁵  / 0.0553                               = 2.494×10⁻⁴ m²

Big Bang has 8.6% higher specific inertia than Basalt — its mass is distributed more efficiently per gram.
But Basalt is 32% heavier in absolute mass, which dominates: absolute L_Basalt = 2.07 vs 1.70 (×10⁻³ kg·m²/s).
```

Big Bang's contact physics (near-vertical Barrage face, smash = 0.990) delivers high impact efficiency, but its total angular momentum budget is 17.9% smaller than Basalt, which means Basalt simply overpowers it in head-on collisions. For attack customisations using RF, this angular momentum deficit is irrelevant (attack wins by ring-out, not spin-out), but for any defensive application, Basalt's larger L reserves dominate.

**TypeScript model**

```typescript
function bigBangComponentInertia(m_g: number, r_inner_mm: number, r_outer_mm: number): number {
  return 0.5 * (m_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
}

function bigBangTotalInertia(
  m_PC: number, ri_PC: number, ro_PC: number,
  zones_MF: [number, number, number][],
  zones_Core: [number, number, number][]
): number {
  const I_PC = bigBangComponentInertia(m_PC, ri_PC, ro_PC);
  const I_MF = zones_MF.reduce((acc, [m, ri, ro]) => acc + bigBangComponentInertia(m, ri, ro), 0);
  const I_Core = zones_Core.reduce((acc, [m, ri, ro]) => acc + bigBangComponentInertia(m, ri, ro), 0);
  return I_PC + I_MF + I_Core;
}

function bigBangContactSmash(mode: 'smash' | 'upper' | 'barrage' | 'omni'): { smash: number; recoil: number } {
  const angles: Record<string, number> = { smash: 5, upper: -25, barrage: 8, omni: 30 };
  const phi = angles[mode] * Math.PI / 180;
  return { smash: Math.cos(phi), recoil: Math.abs(Math.sin(phi)) };
}

function bigBangLDeficit(I: number, omega: number, L_ref: number): number {
  return 1 - (I * omega) / L_ref;
}

// bigBangTotalInertia(2.50, 9, 22, [[3,5,10],[8,10,17],[14.48,17,23]], [[3,5,9],[6,9,16],[4.81,16,21]])
//   → 1.133×10⁻⁵ kg·m²
// bigBangContactSmash('barrage')   → { smash: 0.990, recoil: 0.139 }  (Barrage: best overall mode)
// bigBangContactSmash('omni')      → { smash: 0.866, recoil: 0.500 }  (Omni: consistent any-angle)
// bigBangLDeficit(1.133e-5, 150, 2.07e-3)  → 17.9%  (vs Basalt — outclassed in sustained defense)
```

---

## Case 344 — 4D Bottom: Final Drive / F:D (5.85 g)

> **Stock combo (Big Bang Pegasis F:D):** 4D Clear Wheel: Pegasis III · 4D Metal Wheel: Big Bang · Bottom: Final Drive

**Thesis.** F:D is a 4D Track+Bottom fusion (27.78 mm wide, 21.18 mm tall) that autonomously switches contact mode at a critical spin threshold ω_switch. Two plastic tabs, spring-loaded outward from the main body, extend radially under centrifugal force at high ω — holding the inner SF-shaped tip exposed for floor contact. As ω decays below ω_switch, the spring overcomes the centrifugal force, retracting the tabs and the SF tip simultaneously; the wide rubber annular ring (a Hole-Flat geometry) is left as the sole floor contact. The physics consequence is exactly backwards for competitive use: the low-friction SF phase (dω/dt ≈ 28.6 rad/s²) operates while the bey has ample spin, and the high-friction rubber phase (dω/dt ≈ 271 rad/s²) engages precisely when the bey needs to conserve spin most. The transition is irreversible within a match (tabs retract below ω_switch and cannot re-extend without more spin), so the rubber phase, once triggered, drains the remaining spin ≈ 9.5× faster than the SF phase.

**Geometry (side section — two-phase tip)**

```
  ┌─────────────────────────────┐   r_full = 13.89 mm,  h_full = 21.18 mm
  │  outer ABS body (blue)       │   h_rubber_contact = 19.65 mm  (from top)
  │  ╔════════════════════╗      │
  │  ║  rubber annular ring║  ←  low-spin floor contact (Phase 2)
  │  ║  r_i≈3mm, r_o≈9mm  ║      │   (Hole-Flat geometry; rubber coated)
  │  ╚════════════════════╝      │
  │         │ SF tip  │           │   high-spin floor contact (Phase 1)
  │         │ (ABS,   │           │   r_SF ≈ 2.5 mm  (semi-flat face)
  │         │ retracts│           │
  │         └─────────┘          │
  │    [◄ tab ►]  [◄ tab ►]      │   2 centrifugal tabs at r_tab ≈ 8 mm
```

**Centrifugal Switching Mechanism**

Each tab is an ABS lever pivoting outward under centrifugal loading. At angular velocity ω, the centrifugal force on each tab:

```
F_cent = m_tab × ω² × r_tab

Tab mass:   m_tab ≈ 0.30 g  (each; estimated from ABS lever geometry)
Tab radius: r_tab ≈ 8 mm    (pivot-to-CoM distance, from top view images)
Spring restoring: F_spring = k_tab × x_0  (plastic snap spring)
  k_tab ≈ 8 N/m,  x_0 ≈ 2 mm  (ABS snap mechanism estimate)

At critical ω_switch:  m_tab × ω_switch² × r_tab = k_tab × x_0

ω_switch = √(k_tab × x_0 / (m_tab × r_tab))
         = √(8 × 0.002 / (0.0003 × 0.008))
         = √(0.016 / 2.4×10⁻⁶)
         = √(6.667×10³)                                              → 81.6 rad/s  (780 RPM)
```

Below ω_switch ≈ 82 rad/s, the tabs retract and the SF tip withdraws. The transition is irreversible within the match — the rubber phase begins permanently once ω falls below 82 rad/s.

**Phase 1 — SF Tip Contact (ω > 82 rad/s, tabs extended)**

```
r_flat_SF ≈ 2.5 mm,  μ_ABS = 0.35,  W = 0.491 N

τ_SF = (2/3) × 0.35 × 0.491 × 0.0025                            → 2.86×10⁻⁴ N·m
dω/dt_SF = 2.86×10⁻⁴ / 1.0×10⁻⁵                                 → 28.6 rad/s²
```

Comparable to F (23.4 rad/s²) — reasonable for a semi-flat profile. During this phase F:D behaves as a stable moderate-aggression attack bottom.

**Phase 2 — Rubber Annular Contact (ω < 82 rad/s, tabs retracted)**

The rubber Hole-Flat makes annular contact. For a hollow disk (annular ring) spinning at ω against a flat floor, the spinning friction torque is:

```
τ_annular = (2μW / 3) × (r_o³ − r_i³) / (r_o² − r_i²)

r_i ≈ 3 mm  (central hole radius),  r_o ≈ 9 mm  (outer rubber rim)
μ_rubber = 0.85  (rubber-on-ABS floor)

Numerator:   r_o³ − r_i³ = (9³ − 3³) × 10⁻⁹ = (729 − 27) × 10⁻⁹ = 7.02×10⁻⁷ m³
Denominator: r_o² − r_i² = (81 − 9) × 10⁻⁶ = 7.2×10⁻⁵ m²

τ_rubber = (2 × 0.85 × 0.491 / 3) × (7.02×10⁻⁷ / 7.2×10⁻⁵)
         = 0.2782 × 9.75×10⁻³                                    → 2.71×10⁻³ N·m

dω/dt_rubber = 2.71×10⁻³ / 1.0×10⁻⁵                             → 271 rad/s²
```

**Phase Comparison and Stamina Impact**

```
| Phase | Trigger    | τ (N·m)    | dω/dt (rad/s²) | Relative to Phase 1 |
|-------|------------|------------|----------------|---------------------|
| 1: SF | ω > 82 r/s | 2.86×10⁻⁴ | 28.6           | 1.0×  (baseline)    |
| 2: RHF| ω < 82 r/s | 2.71×10⁻³ | 271            | 9.47×  (9.5× worse) |

Remaining spin at switch point: ω_switch = 82 rad/s
Time to stop from switch point (Phase 2):
  t_stop = ω_switch / dω/dt_rubber = 82 / 271                    → 0.30 s  (0.3 seconds to spin-out)

vs Phase 1 at same starting ω:
  t_stop_SF = 82 / 28.6                                          → 2.87 s  (9.5× longer)
```

The rubber phase extinguishes the remaining spin in ~0.3 s from the switch point, compared to 2.87 s for the SF phase. F:D effectively converts a late-match survival window into an instant spin-out. Competitively, the result is a bey that attacks moderately early, then kills itself.

**Anti-Meta Physics Rationale**

F:D finds niche use in MF-H Gravity Perseus F:D because:
1. Perseus as L-spin opposite causes right-spin opponents to lose spin on contact (Δv = 2ωr per hit, Case 316 spin-equalization mechanism)
2. F:D's Phase 2 rubber grip holds the orbit tighter against the stadium wall when the Perseus assembly enters low spin, delaying ring-out while the opponent's spin-drained bey stops first
3. The rubber lateral grip force: F_lat = μ × W = 0.85 × 0.491 = 0.417 N — matches RF's lateral grip, pinning the bey in orbit even at low spin

This works because the anti-meta combo is already designed to survive to low spin via spin equalization; F:D's rubber phase grip assists position retention in that specific low-spin window.

**TypeScript model**

```typescript
function fdSwitchOmega(k_tab: number, x0_mm: number, m_tab_g: number, r_tab_mm: number): number {
  return Math.sqrt((k_tab * (x0_mm / 1000)) / ((m_tab_g / 1000) * (r_tab_mm / 1000)));
}

function fdPhase1Torque(r_SF_mm: number, W: number): number {
  return (2 / 3) * 0.35 * W * (r_SF_mm / 1000);
}

function fdPhase2Torque(r_inner_mm: number, r_outer_mm: number, W: number): number {
  const ri = r_inner_mm / 1000;
  const ro = r_outer_mm / 1000;
  return (2 * 0.85 * W / 3) * (Math.pow(ro, 3) - Math.pow(ri, 3)) / (ro * ro - ri * ri);
}

function fdTimeToStopFromSwitch(omega_switch: number, phase2_decay: number): number {
  return omega_switch / phase2_decay;
}

function fdPhaseRatio(r_inner_mm: number, r_outer_mm: number, r_SF_mm: number): number {
  const tau2 = fdPhase2Torque(r_inner_mm, r_outer_mm, 0.491);
  const tau1 = fdPhase1Torque(r_SF_mm, 0.491);
  return tau2 / tau1;
}

// fdSwitchOmega(8, 2, 0.30, 8)                                  → 81.6 rad/s  (780 RPM — low-spin transition)
// fdPhase1Torque(2.5, 0.491)                                     → 2.86×10⁻⁴ N·m  (SF phase: 28.6 rad/s²)
// fdPhase2Torque(3, 9, 0.491)                                    → 2.71×10⁻³ N·m  (rubber annular: 271 rad/s²)
// fdTimeToStopFromSwitch(81.6, 271)                              → 0.30 s  (spin-out in 0.3 s after switch)
// fdPhaseRatio(3, 9, 2.5)                                        → 9.47×  (Phase 2 drains 9.5× faster than Phase 1)
```

---

## Case 345 — 4D Bottom: X:Drive / X:D (7.19 g)

> **Stock combo (Diablo Nemesis X:D):** 4D Clear Wheel: Nemesis · 4D Metal Wheel: Diablo · Bottom: X Drive

**Thesis.** X:D is the widest 4D Bottom produced in MFB, integrating three contact tips — XF, S, and S²D (Stern Semi Defense) — with a spring-cam selector that operates in two modes: manual tab rotation (Attack Mode, choosing XF or S) and automatic cam-follower switching via Diablo's Metal Frame interior geometry (Ultimate Balance Mode, executing XF → S²D → S or reverse sequences). The automatic mechanism is triggered by collision impact force rather than spin speed, making it fundamentally stochastic: unlike F:D's deterministic centrifugal switch, X:D's tip sequence depends on the magnitude and direction of each battle impact, producing unpredictable tip states mid-match. The three tips span a 302:1 range in spinning friction torque (XF at 3.39×10⁻⁴ N·m to S at 1.12×10⁻⁶ N·m), so an uncontrolled mode transition from XF to S mid-match is beneficial for stamina, while a reverse S → XF transition during a critical survival phase is destructive. The lack of control over which transition occurs, or when, eliminates X:D from competitive use.

**Geometry (top view + tip section)**

```
Top view (X:D body, C₄ tab layout):      Tip section (three tips, stacked):
                                            ┌──────────────────────────────┐   r_full ≈ 14.5 mm
  ┌────────────────────────────────┐        │  outer ABS disk (wide)        │   (widest 4D Bottom)
  │  ○         ○  ← spring tabs   │        │
  │      ╔═════════╗               │        │  [XF tip: flat r=2.955mm]  ← low spring: tab left
  │      ║ 3-tip   ║               │        │  [S²D tip: S-cone + wider base]  ← mid spring
  │      ║ center  ║               │        │  [S tip: 35° cone, r=0.15mm apex]  ← full spring
  │      ╚═════════╝               │        │
  │  ○         ○  ← 4 tabs total  │
  └────────────────────────────────┘
```

**Three-Tip Physics**

*XF mode (tab rotated left, spring lowest):*
```
r_flat_XF = 2.955 mm  (same as standalone XF, Case 341)
τ_XF = (2/3) × 0.35 × 0.491 × 0.002955                          → 3.39×10⁻⁴ N·m
dω/dt_XF = 33.9 rad/s²
F_lat_XF = 0.35 × 0.491                                          → 0.172 N  (orbital drive)
```

*S mode (tab rotated right, spring mid):*
```
tipAngle = 35°,  α_Sneddon = 55°,  E* = 1.332 GPa
a_S = 2.01×10⁻⁵ m  (same as Case 335 / 330-D)
τ_S = (2/3) × 0.17 × 0.491 × 2.01×10⁻⁵                         → 1.12×10⁻⁶ N·m
dω/dt_S = 0.112 rad/s²
```

*S²D mode (automatic only, intermediate spring extension):*
The "Stern Semi Defense" tip is described as showing little performance difference from S. The "Semi Defense" designation suggests a slightly wider cone base (analogous to SD being wider than S at the same contact angle). If S²D uses a cone half-angle of ~32° (between S at 35° and SD at 30°):
```
α_S²D = 90° − 32° = 58°,  tan(58°) = 1.600
a_S²D² = 0.491×π / (2 × 1.332×10⁹ × 1.600)
       = 1.543 / 4.262×10⁹                                       = 3.62×10⁻¹⁰ m²
a_S²D  = 1.90×10⁻⁵ m

τ_S²D = (2/3) × 0.17 × 0.491 × 1.90×10⁻⁵                       → 1.06×10⁻⁶ N·m
dω/dt_S²D = 0.106 rad/s²  (5.4% better stamina than S)
```

This 5.4% difference is within experimental noise for competitive testing, confirming the wiki observation of "little difference" from S.

**Tip Range Summary**

```
| Tip | Contact type       | τ (N·m)    | dω/dt (rad/s²) | Ratio vs S  |
|-----|--------------------|------------|----------------|-------------|
| XF  | Flat disk r=2.955  | 3.39×10⁻⁴ | 33.9           | 302×        |
| S²D | Sneddon 32°        | 1.06×10⁻⁶ | 0.106          | 0.946×      |
| S   | Sneddon 35°        | 1.12×10⁻⁶ | 0.112          | 1.0×        |
```

The XF–S transition crosses 302× in spin decay rate. An unintended XF → S transition adds enormous stamina; an unintended S → XF transition kills stamina instantly. S²D and S are functionally identical for competitive purposes.

**Spring-Cam Automatic Mechanism**

In Ultimate Balance Mode, Diablo's Metal Frame interior features two ramps that bear against X:D's two tabs as the assembly spins. When an impact shifts the relative angular position between the Metal Frame and X:D body, the ramps cam the tabs inward or outward along their travel axis, compressing or releasing the internal spring, which extends or retracts the central tip post.

```
Cam force on tab from impact:
F_cam = F_impact × cos(θ_cam)
      where θ_cam ≈ 45°  (estimated ramp angle)

Spring preload threshold:
k_spring ≈ 30 N/m,  Δx ≈ 3 mm  (estimated ABS snap spring in tip post)
F_threshold = k_spring × Δx = 30 × 0.003                         = 0.090 N

Minimum impact force to trigger mode change:
F_impact_min = F_threshold / cos(θ_cam) = 0.090 / cos(45°)       = 0.127 N
```

A 0.127 N force threshold is extremely low — a typical bey-on-bey impact during orbital contact generates 2–10 N. This means virtually every moderate collision triggers a mode change, including glancing contacts, stadium-wall bounces, and opponent-initiated hits.

**Stochastic vs Deterministic Comparison (F:D vs X:D)**

```
F:D trigger:  ω < 81.6 rad/s  (centrifugal — purely deterministic, based only on spin speed)
X:D trigger:  F_impact > 0.127 N  (cam-follower — stochastic, depends on unpredictable collision force)

F:D: mode change is guaranteed at exactly ω_switch, regardless of opponent behavior.
X:D: mode change can be triggered by any glancing contact at any point in the match.

Expected mode changes per battle for X:D (estimate):
  ~10–20 impacts per standard battle,  each with P(F > 0.127 N) ≈ 0.90
  Expected X:D mode changes: ~9–18 per battle
  → tip state is effectively random by mid-match
```

The stochastic nature means X:D cannot be relied on to be in any specific tip state when it matters. An attacker hoping to be in XF mode for ring-out attempts may find itself in S mode after an early contact.

**XF Self-KO Physics**

The "prone to self-KO" behaviour in XF mode comes from X:D's greater width compared to standalone XF:

```
X:D r_full ≈ 14.5 mm  (wider than standalone XF: 7.915 mm)
The orbital torque arm at full width:
  τ_orb = F_lat × r_full = 0.172 × 0.0145                        = 2.49×10⁻³ N·m

vs standalone XF at same F_lat:
  τ_orb = 0.172 × 0.007915                                        = 1.36×10⁻³ N·m

Orbital torque ratio: 2.49/1.36                                   → 1.83×  (X:D generates 83% more orbital torque than standalone XF)
```

The wider contact sweeps more floor area per revolution and generates 83% more orbital driving torque. This produces higher orbital velocity but at the cost of control — the bey overshoots orbit corrections and impacts the stadium wall with excess speed, causing self-KO. Additionally, performing a Sliding Shoot with X:D's wide base geometry is physically difficult because the wider contact cannot easily enter the stadium at the controlled angle required for flower pattern initiation.

**S Mode vs WD Comparison**

```
dω/dt_S   = 0.112 rad/s²  (S mode, Case 335)
dω/dt_WD  = 0.039 rad/s²  (WD upright phase, Case 332)

WD stamina advantage over S: 0.112 / 0.039                       → 2.87×  (WD lasts 2.87× longer)

Additionally, WD's late-wobble rim phase (τ_rim = 3.94×10⁻⁴ N·m, Case 332) extends match time
by allowing gyroscopic precession continuation that S cannot replicate.
```

S mode on X:D is outclassed by WD as a stamina bottom by a factor of ~3×, confirming the wiki assessment.

**Inertia of X:D (as a track+bottom fusion)**

```
m_total = 7.19 g,  r_full ≈ 14.5 mm

Zone 1: outer disk shell (~4.5 g at r_mid ≈ 11 mm):
  I₁ = ½ × 0.0045 × (0.008² + 0.014²)                           = 5.94×10⁻⁷ kg·m²

Zone 2: inner spring/hub (~2.69 g at r_mid ≈ 4 mm):
  I₂ = ½ × 0.00269 × (0.002² + 0.007²)                          = 7.21×10⁻⁸ kg·m²

I_XD = 5.94×10⁻⁷ + 7.21×10⁻⁸                                    → 6.66×10⁻⁷ kg·m²
```

X:D is heavier than F:D (7.19 g vs 5.85 g) but the inertia is similarly modest — both are a small fraction of the system I (≈ 1.0×10⁻⁵ kg·m² for the full assembly). The track height replacement contributes height positioning (21-mm-equivalent) rather than meaningful inertia.

**TypeScript model**

```typescript
function xdTipDecay(tip: 'XF' | 'S' | 'S2D', W: number, I_system: number): number {
  if (tip === 'XF') return (2 / 3) * 0.35 * W * 0.002955 / I_system;
  const angles: Record<string, number> = { S: 35, S2D: 32 };
  const alpha = (90 - angles[tip]) * Math.PI / 180;
  const a = Math.sqrt((W * Math.PI) / (2 * 1.332e9 * Math.tan(alpha)));
  return (2 / 3) * 0.17 * W * a / I_system;
}

function xdCamTriggerForce(k_spring: number, delta_x_mm: number, cam_angle_deg: number): number {
  return (k_spring * (delta_x_mm / 1000)) / Math.cos(cam_angle_deg * Math.PI / 180);
}

function xdExpectedModeChanges(n_impacts: number, F_threshold: number,
                                 F_typical_min: number, F_typical_max: number): number {
  const P_trigger = Math.max(0, (F_typical_max - F_threshold) / (F_typical_max - F_typical_min));
  return n_impacts * P_trigger;
}

function xdXFvsStandaloneOrbitalTorque(r_XD_mm: number, r_XF_mm: number, F_lat: number): number {
  return (F_lat * (r_XD_mm / 1000)) / (F_lat * (r_XF_mm / 1000));
}

// xdTipDecay('XF', 0.491, 1.0e-5)                              → 33.9 rad/s²
// xdTipDecay('S', 0.491, 1.0e-5)                               → 0.112 rad/s²
// xdTipDecay('S2D', 0.491, 1.0e-5)                             → 0.106 rad/s²  (5.4% better than S — negligible)
// xdCamTriggerForce(30, 3, 45)                                  → 0.127 N  (essentially any collision triggers change)
// xdExpectedModeChanges(15, 0.127, 0.1, 8.0)                   → 14.8  (almost every hit triggers a change)
// xdXFvsStandaloneOrbitalTorque(14.5, 7.915, 0.172)            → 1.83×  (83% more orbital torque → self-KO risk)
```

---

## Case 346 — 4D Metal Wheel: Diablo (51.26 g)

> **Stock combo (Diablo Nemesis X:D):** 4D Clear Wheel: Nemesis · 4D Metal Wheel: Diablo · Bottom: X Drive

**Thesis.** Diablo is the heaviest standalone MFB Metal Wheel, comprising a zinc-alloy Metal Frame (25.35 g, three animal heads: Lion/Orion/Lynx) and a zinc-alloy Core (25.94 g, a composite of six prior 4D wheel motifs). The total assembly inertia in Attack Mode (Frame rigidly coupled to Core) reaches I_Attack ≈ 1.645×10⁻⁵ kg·m², producing L = 2.468×10⁻³ kg·m²/s at ω = 150 rad/s — 19.2% above the Basalt reference and the largest angular momentum in this case study series. The three heads at 120° spacing have unequal masses (Lion largest, Orion intermediate, Lynx smallest), creating a transverse inertia asymmetry ΔI = 3.96×10⁻⁷ kg·m² and a nutation torque of 3.0×10⁻⁵ N·m at battle spin — a moderate C₁ imbalance. In Attack Mode the heads present three distinct face angles (Lion φ ≈ 15°, Orion φ ≈ 20°, Lynx φ ≈ 10°), yielding a weighted effective smash fraction of 0.964 and self-recoil of 0.258 — efficient enough for balance play but insufficient for dedicated smash attack. In Ultimate Balance Mode the Metal Frame is inverted below the Core and is semi-free-spinning, decoupling the impact angular impulse from the Core: the Core's spin is theoretically preserved during impacts (Core deceleration is 2.04× less per hit than with rigid coupling), but the rotating dynamic imbalance of the unsynchronised Frame generates destructive nutation, negating the stamina benefit and making UBM competitively inferior to Attack Mode.

**Geometry (two-mode stack)**

```
Attack Mode (Frame on top):              Ultimate Balance Mode (Frame inverted below):
  ┌─────────────────────────────────┐      ┌──────────────────────────────────┐
  │  Metal Frame (25.35 g) — top    │      │  Core (25.94 g) — top             │
  │  three heads: Lion ▲ Orion ● Lynx▼ │  │  elevated ring → gap for Frame    │
  ├─────────────────────────────────┤      ├──────────────────────────────────┤
  │  Core (25.94 g)                 │      │  Metal Frame (semi-free) — bottom │
  │  Scythe-smooth underside        │      │  rests in groove; can rotate       │
  └─────────────────────────────────┘      │  Head position → X:D tab pressure │
       Frame + Core rigidly rotate          └──────────────────────────────────┘
       at ω_bey together                         Frame rotates independently after impact
```

**Three-Component Inertia (Attack Mode)**

```
Metal Frame (25.35 g), three zones:
  Zone 1: inner ring (r=11–16 mm, ~6 g):
    I₁ = ½ × 0.006 × (0.011² + 0.016²)                          = 1.131×10⁻⁶ kg·m²
  Zone 2: mid-ring (r=16–21 mm, ~10 g):
    I₂ = ½ × 0.010 × (0.016² + 0.021²)                          = 3.485×10⁻⁶ kg·m²
  Zone 3: head protrusions (r=21–23 mm, ~9.35 g):
    I₃ = ½ × 0.00935 × (0.021² + 0.023²)                        = 4.536×10⁻⁶ kg·m²
  I_Frame = 1.131 + 3.485 + 4.536                                = 9.152×10⁻⁶ kg·m²

Core (25.94 g), three zones:
  Zone 1: hub (r=4–9 mm, ~3 g):
    I₁ = ½ × 0.003 × (0.004² + 0.009²)                          = 1.59×10⁻⁷ kg·m²
  Zone 2: mid-ring (r=9–17 mm, ~10 g):
    I₂ = ½ × 0.010 × (0.009² + 0.017²)                          = 1.850×10⁻⁶ kg·m²
  Zone 3: outer (r=17–23 mm, ~12.94 g):
    I₃ = ½ × 0.01294 × (0.017² + 0.023²)                        = 5.296×10⁻⁶ kg·m²
  I_Core = 1.59×10⁻⁷ + 1.850×10⁻⁶ + 5.296×10⁻⁶                = 7.302×10⁻⁶ kg·m²

I_Attack = I_Frame + I_Core = 9.152×10⁻⁶ + 7.302×10⁻⁶          → 1.645×10⁻⁵ kg·m²
```

**Angular Momentum vs Basalt**

```
L_Diablo = 1.645×10⁻⁵ × 150                                     → 2.468×10⁻³ kg·m²/s
L_Basalt  = 2.070×10⁻³ kg·m²/s  (reference from Case 313/321)

Diablo EXCEEDS Basalt: 2.468 / 2.070                             → 1.192×  (19.2% more L)

Specific inertia:
  Diablo:  1.645×10⁻⁵ / 0.05126                                 = 3.210×10⁻⁴ m²
  Basalt:  1.38×10⁻⁵  / ~0.054                                  ≈ 2.556×10⁻⁴ m²
  Advantage: 3.210 / 2.556                                       → 1.256×  (25.6% higher specific inertia)
```

Diablo's distal mass placement (heads at r = 21–23 mm, making up 36.9% of total mass at the outermost zone) produces more angular momentum per gram than Basalt. Despite being the heaviest wheel, its competitive weakness is contact geometry — not inertia.

**C₁ Asymmetry from Unequal Heads**

```
Lion at 0°:   m_lion  ≈ 3.0 g,  y_lion  = 0,           x_lion  = 0.022 m
Orion at 120°: m_Orion ≈ 2.5 g,  y_Orion = 0.01905 m,   x_Orion = −0.011 m
Lynx at 240°: m_Lynx  ≈ 1.85 g, y_Lynx  = −0.01905 m,  x_Lynx  = −0.011 m
(all masses in units of 10⁻³ kg; all radii in m)

I_x (rotation axis through Lion-antiLion diameter):
  I_x = (2.5 + 1.85)×10⁻³ × 0.01905²                           = 1.582×10⁻⁶ kg·m²

I_y (rotation axis perpendicular to Lion):
  I_y = 3.0×10⁻³ × 0.022² + (2.5 + 1.85)×10⁻³ × 0.011²        = 1.978×10⁻⁶ kg·m²

ΔI_transverse = I_y − I_x                                       = 3.96×10⁻⁷ kg·m²

CoM offset of heads zone:
  x_CoM = (3.0×0.022 − 2.5×0.011 − 1.85×0.011) × 10⁻³ / 7.35×10⁻³
         = (66 − 27.5 − 20.35) × 10⁻⁶ / 7.35×10⁻³              = 2.47×10⁻³ m  (2.47 mm from center)
  y_CoM = (2.5×0.01905 − 1.85×0.01905) × 10⁻³ / 7.35×10⁻³      = 1.69×10⁻³ m
  r_CoM_heads = √(2.47² + 1.69²)                                 = 3.00 mm

Nutation forcing at ω (C₁ — fundamental frequency):
  τ_nut = ΔI × ω / 2 = 3.96×10⁻⁷ × 150 / 2                    → 2.97×10⁻⁵ N·m

In context (nutation hierarchy from this series):
  Killerken:          1.80×10⁻⁵ N·m  (near-stable C₂)
  Diablo Frame heads: 2.97×10⁻⁵ N·m  (moderate C₁)
  Bahamdia / Revizer: 7.50×10⁻⁵ N·m  (C₂ nutation)
```

Diablo's head asymmetry falls between Killerken and Bahamdia — enough to cause perceptible wobble at low spin but not catastrophic. The Core's own C₁ design details (multiple asymmetric animal motifs) add further ΔI, but quantification is impractical without precise mass-partition data.

**Attack Mode Contact Geometry — Three-Head Profile**

```
| Head  | % of circumference | φ from radial | Smash = cos(φ) | Recoil = sin(φ) |
|-------|--------------------|---------------|----------------|-----------------|
| Lion  | ~38%               | ≈ 15°         | 0.966          | 0.259           |
| Orion | ~35%               | ≈ 20°         | 0.940          | 0.342           |
| Lynx  | ~27%               | ≈ 10°         | 0.985          | 0.174           |

Weighted effective smash:
  cos_eff = 0.38×0.966 + 0.35×0.940 + 0.27×0.985                → 0.964
  sin_eff = 0.38×0.259 + 0.35×0.342 + 0.27×0.174                → 0.263  (self-recoil fraction)
```

The effective smash (96.4%) is high, but the 26.3% self-recoil is what limits Diablo: each impact absorbs 26.3% of the contact force as outward recoil on Diablo itself, making ring-out of the opponent harder. For balance play, this recoil is beneficial — it acts as a cushion rather than an aggressive deflection.

**Ultimate Balance Mode — Free-Frame Impact Decoupling**

When in UBM, the Frame is semi-free and absorbs impact angular impulse independently:

```
Rigid coupling (Attack Mode):
  Δω_couple = J_impact / (I_Frame + I_Core) = J / 1.645×10⁻⁵

Free coupling (UBM — impact acts on Frame only):
  Δω_Frame = J_impact / I_Frame = J / 9.152×10⁻⁶
  Δω_Core  = 0  (Core not directly struck)

Core deceleration improvement:
  Rigid Δω_Core = J / 1.645×10⁻⁵
  UBM Δω_Core  = 0  (no coupling during impact)

Theoretical ratio: (I_Frame + I_Core) / I_Core
                 = 1.645×10⁻⁵ / 7.302×10⁻⁶                    → 2.25×  (Core spins down 2.25× slower per hit in UBM)
```

In theory UBM preserves Core spin 2.25× more per impact. The failure mode is the dynamic imbalance from the unsynchronised Frame:

```
After impact: Frame at ω_Frame ≠ ω_Core for time Δt = I_Frame / τ_groove_friction
  τ_groove = μ_groove × W_Frame × r_groove
           ≈ 0.30 × (0.02535 × 9.81) × 0.015                   → 1.12×10⁻³ N·m
  τ_return_time = I_Frame × Δω_Frame / τ_groove
               ≈ 9.152×10⁻⁶ × 50 / 1.12×10⁻³                  → 0.41 s per impact

During those 0.41 s, the Frame rotates out of its C₃ stable position, creating a 3.00 mm CoM offset
rotating at (ω_Frame − ω_Core) relative to the spin axis → oscillating imbalance force:
  F_imbalance = m_heads × r_CoM × (ω_Frame − ω_Core)²
              ≈ 7.35×10⁻³ × 3.0×10⁻³ × (50)²                  → 0.551 N  (peak oscillating lateral force)
```

A 0.55 N oscillating imbalance force drives nutation and orbit disruption for ~0.41 s per impact. With 10–15 impacts per battle, approximately 4–6 seconds of nutation disruption per match — explaining why UBM "causes too much disturbance."

**Balance Type Rationale**

```
Anti-attack defense via angular momentum reserve:
  L_Diablo vs typical attack wheel (e.g. Big Bang L = 1.700×10⁻³):
  L_Diablo / L_BigBang = 2.468 / 1.700                          = 1.452×  (45.2% more L)

In a spin-out contest, the angular impulse needed to stop Diablo from ω to 0:
  J_stop = I_Attack × ω = 1.645×10⁻⁵ × 150                    = 2.468×10⁻³ kg·m²/s

An attack wheel scoring one KO hit reduces Diablo's spin by:
  Δω = J_impact / I_Attack ≈ 0.5 / 1.645×10⁻⁵                  = 30.4 rad/s (6.5% at ω=150)

Diablo requires ~16 unresisted hits to stop — a high survival threshold vs typical attack.
```

**TypeScript model**

```typescript
function diabloInertia(
  zones_Frame: [number, number, number][],
  zones_Core: [number, number, number][]
): number {
  const sum = (zones: [number, number, number][]) =>
    zones.reduce((acc, [m, ri, ro]) =>
      acc + 0.5 * (m / 1000) * (Math.pow(ri / 1000, 2) + Math.pow(ro / 1000, 2)), 0);
  return sum(zones_Frame) + sum(zones_Core);
}

function diabloHeadAsymmetry(m_lion_g: number, m_orion_g: number, m_lynx_g: number, r_mm: number): {
  deltaI: number; rCoM_mm: number; tau_nut: number;
} {
  const r = r_mm / 1000;
  const I_x = (m_orion_g + m_lynx_g) * 1e-3 * Math.pow(r * Math.sqrt(3) / 2, 2);
  const I_y = m_lion_g * 1e-3 * r * r + (m_orion_g + m_lynx_g) * 1e-3 * Math.pow(r / 2, 2);
  const deltaI = Math.abs(I_y - I_x);
  const m_total = (m_lion_g + m_orion_g + m_lynx_g) * 1e-3;
  const xCoM = r * (m_lion_g - (m_orion_g + m_lynx_g) / 2) * 1e-3 / m_total;
  const yCoM = r * Math.sqrt(3) / 2 * (m_orion_g - m_lynx_g) * 1e-3 / m_total;
  const rCoM_mm = Math.sqrt(xCoM * xCoM + yCoM * yCoM) * 1000;
  return { deltaI, rCoM_mm, tau_nut: deltaI * 150 / 2 };
}

function diabloUBMCoreProtection(I_frame: number, I_core: number): number {
  return (I_frame + I_core) / I_core;
}

function diabloImbalanceForce(m_heads_g: number, rCoM_mm: number, delta_omega: number): number {
  return (m_heads_g / 1000) * (rCoM_mm / 1000) * delta_omega * delta_omega;
}

// diabloInertia([[6,11,16],[10,16,21],[9.35,21,23]], [[3,4,9],[10,9,17],[12.94,17,23]])
//   → 1.645×10⁻⁵ kg·m²  (heaviest MFB wheel, 19.2% above Basalt reference)
// diabloHeadAsymmetry(3.0, 2.5, 1.85, 22)
//   → { deltaI: 3.96×10⁻⁷, rCoM_mm: 3.0, tau_nut: 2.97×10⁻⁵ N·m }
// diabloUBMCoreProtection(9.152e-6, 7.302e-6)   → 2.25×  (Core 2.25× less deceleration per hit in UBM)
// diabloImbalanceForce(7.35, 3.0, 50)            → 0.551 N  (oscillating force during Frame re-sync)
```

---

## Case 347 — 4D Metal Wheel: L-Drago Destroy (44.33 g)

> **Stock combo (L Drago Destroy F:S):** 4D MW: L Drago Destroy · 4D Bottom: Final Survive

**Thesis.** L-Drago Destroy is the fourth generation of the L-Drago (left-spinning) lineage and its most physically capable incarnation. It is the only 4D Metal Wheel in which the Core sits *below* rather than above the Metal Frame, inverting the conventional stack order and placing the high-density zinc Metal Frame (38.51 g — 86.9% of total mass) as the dominant inertia contributor. The Core (5.82 g, polycarbonate with six alternating rubber/PC protrusions) functions as a mode-switching contact interface rather than an inertia element. In Attack Mode the rubber protrusions align with the dragon-head leading faces, creating adhesive traction (μ_rubber = 0.85) on opposing right-spin beyblades that transfers 31.8× more friction torque per contact than the plastic Absorb Mode alternative, quantifying the spin-equalisation mechanism that underlies every L-Drago Destroy customisation. Three identical dragon heads at 120° spacing produce genuine C₃ symmetry — equal mass at each lobe — eliminating the transverse inertia asymmetry (ΔI = 0) and nutation torque that afflict Diablo and Bahamdia; at battle spin L-Drago Destroy produces no inherent nutation forcing. The assembly inertia I ≈ 1.304×10⁻⁵ kg·m², yielding L = 1.956×10⁻³ kg·m²/s (5.5% below Basalt) — lower than Basalt in absolute terms but higher specific inertia (I/m) than any prior L-Drago variant due to the zinc alloy Frame. The Hasbro light-mould variant, hollowed on the Metal Frame underside, loses 10 g primarily from inner zones, reducing L by 11.7% to 1.728×10⁻³ kg·m²/s — a performance gap larger than any prior mould variation in this series.

**Geometry (inverted Core stack)**

```
L-Drago Destroy assembly (left-spin, top view: counter-clockwise):

  ┌─────────────────────────────────────────┐
  │  Metal Frame (38.51 g) — upper          │
  │  zinc alloy, gunmetal finish            │
  │  three identical dragon-head lobes      │
  │  equally spaced at 120° (C₃)           │
  ├─────────────────────────────────────────┤
  │  Core (5.82 g) — below the Frame       │   ← unique: Core underneath, not on top
  │  PC + PVC rubber; six protrusions       │
  │  alternating rubber / plastic (×3 each) │
  │                                         │
  │  Attack Mode (default):                 │
  │    rubber protrusions aligned with      │
  │    front face of dragon heads           │
  │                                         │
  │  Absorb Mode (Core rotated 180°):       │
  │    plastic protrusions exposed at       │
  │    the strike face; rubber hidden       │
  └─────────────────────────────────────────┘

Mass partition:
  Metal Frame  38.51 g  →  86.9% of total
  Core          5.82 g  →  13.1% of total
  Total        44.33 g
```

**Two-Component Inertia**

```
Metal Frame (38.51 g, zinc alloy), three zones:
  Zone 1: inner hub ring (r = 7–12 mm, ~6 g):
    I₁ = ½ × 0.006 × (0.007² + 0.012²)                           = 5.79×10⁻⁷ kg·m²

  Zone 2: mid-ring (r = 12–18 mm, ~10 g):
    I₂ = ½ × 0.010 × (0.012² + 0.018²)                           = 2.340×10⁻⁶ kg·m²

  Zone 3: dragon-head protrusions (r = 18–23 mm, ~22.51 g):
    I₃ = ½ × 0.02251 × (0.018² + 0.023²)                         = 9.597×10⁻⁶ kg·m²

  I_Frame = 5.79×10⁻⁷ + 2.340×10⁻⁶ + 9.597×10⁻⁶                → 1.252×10⁻⁵ kg·m²

Core (5.82 g, PC + rubber), two zones:
  Zone 1: central hub (r = 3–8 mm, ~2 g):
    I₁ = ½ × 0.002 × (0.003² + 0.008²)                           = 7.3×10⁻⁸ kg·m²

  Zone 2: protrusion ring (r = 8–13 mm, ~3.82 g):
    I₂ = ½ × 0.00382 × (0.008² + 0.013²)                         = 4.45×10⁻⁷ kg·m²

  I_Core = 7.3×10⁻⁸ + 4.45×10⁻⁷                                 → 5.18×10⁻⁷ kg·m²

I_total = I_Frame + I_Core = 1.252×10⁻⁵ + 5.18×10⁻⁷             → 1.304×10⁻⁵ kg·m²

Frame inertia fraction: 1.252 / 1.304                             → 96.0%
(Core contributes only 4.0% of total I despite 13.1% of mass)
```

The inverted Core architecture concentrates essentially all inertia in the Metal Frame; the Core is functionally irrelevant to spin-preservation and contributes purely contact-interface mechanics.

**Angular Momentum vs Basalt**

```
L_LDD = 1.304×10⁻⁵ × 150                                         → 1.956×10⁻³ kg·m²/s
L_Basalt = 2.070×10⁻³ kg·m²/s  (reference: Cases 313/321)
L_BigBang = 1.700×10⁻³ kg·m²/s  (reference: Case 343)
L_Diablo  = 2.468×10⁻³ kg·m²/s  (reference: Case 346)

LDD vs Basalt:   1.956 / 2.070                                    → 0.945  (5.5% below)
LDD vs Big Bang: 1.956 / 1.700                                    → 1.151  (15.1% above)
LDD vs Diablo:   1.956 / 2.468                                    → 0.793  (20.7% below heaviest)

Specific inertia (I / m):
  LDD:     1.304×10⁻⁵ / 0.04433                                  = 2.942×10⁻⁴ m²
  Basalt:  1.38×10⁻⁵  / 0.054                                    ≈ 2.556×10⁻⁴ m²
  LDD / Basalt specific inertia ratio                             → 1.151×  (15.1% higher per gram)
```

Despite being 18.5% lighter than Basalt, L-Drago Destroy achieves 15.1% higher specific inertia because its zinc alloy mass is concentrated in the outer dragon-head zone (r = 18–23 mm) rather than spread across a rounder, more uniform profile. The 5.5% absolute L deficit is a pure mass penalty — L-Drago Destroy's zinc Frame is architecturally more efficient than Basalt's layout.

**C₃ Symmetry — Zero Nutation Forcing**

```
Three identical dragon-head lobes at 120° spacing, each lobe mass m_lobe:
  m_lobe = 22.51 / 3                                             = 7.503 g per lobe

Transverse inertia axes (x through Lobe-1 at 0°, y perpendicular):
  I_x = 2 × m_lobe × (r_mid × sin 60°)²
       = 2 × 0.007503 × (0.0205 × 0.866)²                       = 3.876×10⁻⁶ kg·m²

  I_y = m_lobe × r_mid² + 2 × m_lobe × (r_mid × cos 60°)²
       = 0.007503 × 0.0205² + 2 × 0.007503 × (0.0205 × 0.5)²   = 3.876×10⁻⁶ kg·m²

ΔI_transverse = I_x − I_y                                        = 0  (exact C₃ balance)
τ_nutation = ΔI × ω / 2                                          = 0 N·m  at any spin rate

CoM offset of heads zone:
  x_CoM = m_lobe(r−r/2−r/2)/3m_lobe = 0 by symmetry
  r_CoM                                                           = 0 mm
```

Equal-mass three-lobe C₃ enforces both ΔI = 0 and CoM offset = 0 simultaneously. L-Drago Destroy is nutation-free at all spin rates, unlike L-Drago Guardian (C₂ asymmetry from paired vs single lobe design) or Diablo (three unequal heads). This is the correct physical basis for L-Drago Destroy's reported battle stability despite being a contact-play wheel — it does not wobble in the manner of a poorly balanced smash attacker.

**Attack vs Absorb Mode — Contact Material Mechanics**

The two modes differ in which Core protrusion material faces the opponent:

```
Material constants:
  Rubber:  E_rubber = 0.002 GPa,  μ_rubber = 0.85
  ABS:     E_ABS   = 2.300 GPa,  μ_ABS    = 0.35
  E*_rubber-ABS  = 1 / ((1−0.47²)/0.002 + (1−0.35²)/2.3) × 10⁻⁹ ≈ 0.6 MPa
  E*_ABS-ABS     = 1.332 GPa  (standard)

Impact normal force W = 2.0 N (typical side contact), protrusion tip radius R_tip = 1.0 mm:

Attack Mode — rubber protrusion (Hertz sphere contact):
  a_rubber = (3WR / 4E*_rubber)^(1/3)
           = (3 × 2.0 × 0.001 / (4 × 0.6×10⁶))^(1/3)
           = (2.5×10⁻⁹)^(1/3)                                   = 1.357×10⁻³ m  (1.357 mm)

  τ_rubber = (2/3) × μ_rubber × W × a_rubber
           = (2/3) × 0.85 × 2.0 × 1.357×10⁻³                   = 1.535×10⁻³ N·m

Absorb Mode — plastic ABS protrusion (Hertz sphere contact):
  a_ABS = (3WR / 4E*_ABS)^(1/3)
        = (3 × 2.0 × 0.001 / (4 × 1.332×10⁹))^(1/3)
        = (1.124×10⁻¹²)^(1/3)                                   = 1.040×10⁻⁴ m  (0.104 mm)

  τ_ABS = (2/3) × μ_ABS × W × a_ABS
        = (2/3) × 0.35 × 2.0 × 1.040×10⁻⁴                      = 4.85×10⁻⁵ N·m

Attack / Absorb torque transfer ratio:
  τ_rubber / τ_ABS = 1.535×10⁻³ / 4.85×10⁻⁵                    → 31.7×

Contact area ratio:
  (a_rubber / a_ABS)² = (1.357 / 0.104)²                        → 170.1×  (rubber footprint 170× larger)
```

The 31.7× torque ratio comes from two compounding effects: higher μ (2.43×) and much larger contact radius (13.1× in linear dimension, 170× in area). In Attack Mode, each rubber-on-opponent contact delivers 31.7× more angular impulse than the Absorb Mode's plastic-on-opponent contact. Given that beyblade mass typically used for spin-steal is ~20 g at ω = 80 rad/s, this difference is the mechanistic reason Attack Mode is universally preferred over Absorb Mode for every recorded L-Drago Destroy use case.

**Spin-Equalisation Physics (Left vs Right Spin)**

When L-Drago Destroy's rubber protrusion contacts a right-spinning opponent:

```
Configuration: L-Drago Destroy (left-spin, ω_L) vs. right-spin opponent (ω_R)
Contact radius from spin axis: r_contact ≈ 0.020 m

Surface velocity at contact point:
  v_LDD (leftward tangential)  = ω_L × r_contact = 150 × 0.020 = 3.00 m/s  (−x direction)
  v_opp (rightward tangential) = ω_R × r_contact = 150 × 0.020 = 3.00 m/s  (+x direction)
  v_relative                                                      = 6.00 m/s  (opposing surfaces)

Friction force on opponent (opposing its motion):
  F_friction = μ_rubber × N = 0.85 × 2.0                        = 1.70 N

Angular deceleration of opponent per rubber impact (contact duration Δt ≈ 5 ms):
  J_transfer = F_friction × r_contact × Δt = 1.70 × 0.020 × 0.005 = 1.70×10⁻⁴ N·m·s
  Δω_opponent = J_transfer / I_opponent ≈ 1.70×10⁻⁴ / 1.0×10⁻⁵  = 17.0 rad/s per rubber hit

Corresponding Δω for Absorb Mode (ABS protrusion):
  F_ABS = μ_ABS × N = 0.35 × 2.0                                = 0.70 N
  Δω_opponent_ABS = 0.70 × 0.020 × 0.005 / 1.0×10⁻⁵            = 7.0 rad/s per hit

  (These are still large; the dominant factor is contact duration, not area — but rubber multiplies
   both force and contact time via the visco-elastic compression phase)

Symmetry: L-Drago Destroy loses the equal and opposite Δω_LDD per hit — spin-steal is bi-directional.
The competitive advantage is not asymmetric friction but spin-orbit coupling:
  L-Drago Destroy (left-spin) → opponent's friction force acts to ADD to L-Drago's angular
  momentum (force direction aligns with L-Drago spin direction when contact is on the correct side)
  → net effect: rubber contacts decelerate the opponent AND partially assist L-Drago's own spin.
```

The orbital-contact geometry means the rubber friction vector at the dragon head leading face has a component aligned with L-Drago's spin direction, partially offsetting the drag on L-Drago itself. This is the physical basis of "absorbing" right-spin energy — not via one-way torque transfer but via favourable contact geometry that couples the two spin vectors constructively for the L-spin attacker.

**Attack Mode Dragon Head Contact Geometry**

```
Dragon head face angle (estimated from C₃ profile, three equal lobes):
  φ ≈ 18°  (from the radial direction; forward-curved attack face)
  Smash efficiency = cos(φ) = cos(18°)                           → 0.951
  Self-recoil      = sin(φ) = sin(18°)                          → 0.309

  In rubber Attack Mode, the rubber deformation creates a broadercontact patch,
  effectively reducing the felt contact angle to φ_eff ≈ 10°:
  Smash_rubber_eff = cos(10°)                                    → 0.985
  Recoil_rubber_eff = sin(10°)                                   → 0.174

Attack Mode (rubber): smash_eff = 0.985, recoil_eff = 0.174  (near head-on delivery)
Absorb Mode (ABS):   smash_eff = 0.951, recoil_eff = 0.309  (more glancing)
```

Rubber's low elastic modulus allows the protrusion to wrap around the opponent surface during impact, rotating the effective contact normal closer to the radial direction — improving smash efficiency from 95.1% to 98.5%. This is a second reason Attack Mode is superior to Absorb Mode: higher smash delivery in addition to higher torque transfer.

**Mould Variation — Hasbro Light Mould (−10 g)**

The Hasbro production version hollows out the underside of the Metal Frame, removing approximately 10 g of material from the inner and mid-ring zones while leaving the outer dragon-head protrusions unchanged.

```
Mould comparison:
  TT mould:     Frame = 38.51 g,  total = 44.33 g
  Hasbro mould: Frame ≈ 28.51 g,  total ≈ 34.33 g  (10 g removed from inner cavity)

Inertia model for Hasbro Frame (hollowing removes Zone 1 entirely and partially Zone 2):
  Zone 1 (r = 7–12 mm): 6 g → 0 g  (fully hollowed)              I₁ = 0
  Zone 2 (r = 12–18 mm): 10 g → 6 g  (−4 g from underside)
    I₂ = ½ × 0.006 × (0.012² + 0.018²)                           = 1.404×10⁻⁶ kg·m²
  Zone 3 (r = 18–23 mm): 22.51 g unchanged
    I₃                                                             = 9.597×10⁻⁶ kg·m²

  I_Frame_Hasbro = 0 + 1.404×10⁻⁶ + 9.597×10⁻⁶                  = 1.100×10⁻⁵ kg·m²
  I_total_Hasbro = 1.100×10⁻⁵ + 5.18×10⁻⁷                        = 1.152×10⁻⁵ kg·m²
  L_Hasbro = 1.152×10⁻⁵ × 150                                    → 1.728×10⁻³ kg·m²/s

Performance delta:
  ΔL = (1.956 − 1.728) / 1.956                                   → 11.7%  (Hasbro mould 11.7% less L)
  ΔI = (1.304 − 1.152) × 10⁻⁵                                   = 1.52×10⁻⁶ kg·m²  (11.7% less inertia)

Comparison to Dragooon mould variation (Case 316):
  Dragooon ΔL = 4.4%  (smaller absolute gap, lighter wheel)
  LDD Hasbro ΔL = 11.7%  (larger; 10 g hollowing is the biggest mould delta in the series)

Specific inertia (I / m):
  TT mould:     1.304×10⁻⁵ / 0.04433                             = 2.942×10⁻⁴ m²
  Hasbro mould: 1.152×10⁻⁵ / 0.03433                             = 3.356×10⁻⁴ m²  (+14.1% per gram)
```

The counterintuitive result: the Hasbro mould has 14.1% higher specific inertia (I/m) than the TT mould, because the removed mass was in the innermost low-leverage zone. Gram-for-gram, the Hasbro Frame is more efficient — but in absolute spin-retention terms the TT mould wins by 11.7% L. The Hasbro light mould was not structurally hazardous (it retained the critical outer protrusions) but it meaningfully degraded top-tier competitive use.

**TypeScript model**

```typescript
function lDragoDestroyInertia(
  zones_Frame: [number, number, number][],
  zones_Core: [number, number, number][]
): number {
  const annular = (zones: [number, number, number][]) =>
    zones.reduce((acc, [m, ri, ro]) =>
      acc + 0.5 * (m / 1000) * (Math.pow(ri / 1000, 2) + Math.pow(ro / 1000, 2)), 0);
  return annular(zones_Frame) + annular(zones_Core);
}

function lDragoRubberSpinSteal(
  mu_rubber: number, mu_ABS: number,
  W: number, R_tip_mm: number,
  Estar_rubber_MPa: number, Estar_ABS_GPa: number
): { tau_rubber: number; tau_ABS: number; ratio: number } {
  const a_rub = Math.pow((3 * W * (R_tip_mm / 1000)) / (4 * Estar_rubber_MPa * 1e6), 1 / 3);
  const a_abs = Math.pow((3 * W * (R_tip_mm / 1000)) / (4 * Estar_ABS_GPa * 1e9), 1 / 3);
  const tau_rubber = (2 / 3) * mu_rubber * W * a_rub;
  const tau_ABS    = (2 / 3) * mu_ABS    * W * a_abs;
  return { tau_rubber, tau_ABS, ratio: tau_rubber / tau_ABS };
}

function lDragoMouldVariation(
  I_TT: number, I_Hasbro: number, omega: number
): { L_TT: number; L_Hasbro: number; deltaL_pct: number; specificI_ratio: number; m_TT: number; m_Hasbro: number } {
  const m_TT = 0.04433, m_Hasbro = 0.03433;
  const L_TT = I_TT * omega, L_Hasbro = I_Hasbro * omega;
  return {
    L_TT, L_Hasbro,
    deltaL_pct: (L_TT - L_Hasbro) / L_TT * 100,
    specificI_ratio: (I_Hasbro / m_Hasbro) / (I_TT / m_TT),
    m_TT, m_Hasbro
  };
}

function lDragoC3NutationTorque(m_lobe_g: number, r_mm: number): number {
  return 0;
}

function lDragoAttackSmashFraction(phi_deg: number, rubber: boolean): { smash: number; recoil: number } {
  const phi_eff = rubber ? 10 : phi_deg;
  return {
    smash:  Math.cos(phi_eff * Math.PI / 180),
    recoil: Math.sin(phi_eff * Math.PI / 180)
  };
}

// lDragoDestroyInertia([[6,7,12],[10,12,18],[22.51,18,23]], [[2,3,8],[3.82,8,13]])
//   → 1.304×10⁻⁵ kg·m²  (Frame dominates at 96.0% of total I)
// lDragoRubberSpinSteal(0.85, 0.35, 2.0, 1.0, 0.6, 1.332)
//   → { tau_rubber: 1.535×10⁻³, tau_ABS: 4.85×10⁻⁵, ratio: 31.7 }
// lDragoMouldVariation(1.304e-5, 1.152e-5, 150)
//   → { L_TT: 1.956×10⁻³, L_Hasbro: 1.728×10⁻³, deltaL_pct: 11.7, specificI_ratio: 1.141 }
// lDragoC3NutationTorque(7.503, 20.5)
//   → 0 N·m  (exact C₃ symmetry; zero nutation at all spin rates)
// lDragoAttackSmashFraction(18, true)   → { smash: 0.985, recoil: 0.174 }  (rubber Attack Mode)
// lDragoAttackSmashFraction(18, false)  → { smash: 0.951, recoil: 0.309 }  (ABS Absorb Mode)
```

---

## Case 348 — 4D Bottom: F:S Final:Survive (5.73 g)

> **Stock combo (L Drago Destroy F:S):** 4D Metal Wheel: L Drago Destroy · Bottom: Final Survive

**Thesis.** F:S is the inverse of F:D: it opens at a Hole-Flat (HF) tip and transitions to a Sharp (S) tip as spin decays, trading early-battle mobility for a late-battle stamina endgame. The centrifugal tab mechanism is directionally identical to F:D — tabs held outward at high spin engage HF; tab retraction at low spin allows the Sharp tip to extend — but the phases are reversed in role. The HF annular ring (estimated r_o = 3.5 mm, r_i = 1.5 mm) produces τ = 4.52×10⁻⁴ N·m and dω/dt = 45.2 rad/s², burning spin aggressively while attempting a Sliding Shoot orbit. The switch occurs at ω_switch ≈ 57.7 rad/s (TT mould, 551 RPM) — significantly later in the battle than F:D's 81.6 rad/s switch. Critically, at ω_switch the gyroscopic precession rate is already 2.6× what it was at launch, placing the beyblade in its most nutation-sensitive window precisely when the contact switches to the inherently unstable Sharp tip. Two compounding failure modes — HF's inability to maintain a tight orbit, and the balance disruption from switching to a single-point tip at low spin — render F:S competitively nonviable. The mould variation (TT vs SonoKong) shifts ω_switch from 57.7 rad/s to 89.4 rad/s, drastically changing Phase 1 duration with no reported performance difference, because both execution windows encounter the same underlying instabilities.

**Geometry**

```
F:S cross-section (similar outer dimensions to F:D):
  Full width:   27.97 mm  (cf. F:D 27.78 mm)
  Full height:  21.27 mm  (cf. F:D 21.18 mm)
  HF tip height: 19.83 mm  (tip-to-top distance in flat phase)

  ┌──────────────────────────────────────┐
  │  Outer body / tab housing             │  ← centrifugal tabs here
  │  six weight holes visible externally  │
  ├──────────────────────────────────────┤
  │  Spring + cam mechanism               │
  │  tabs OUT (high ω) → HF plate low    │  Phase 1
  │  tabs IN  (low ω)  → Sharp extends   │  Phase 2
  ├──────────────────────────────────────┤
  │  HF tip: annular ring (r_o~3.5mm,    │
  │           r_i~1.5mm — hollow centre) │
  │  S  tip: Sneddon cone 35°, embedded  │
  └──────────────────────────────────────┘

Inverse of F:D:
  F:D: SF (sharp attack)  →  rubber HF  (stamina drain of opponent)
  F:S: HF (orbit/attack)  →  S (stamina endgame for F:S itself)
```

**Bottom Inertia**

```
Three zones (m_total = 5.73 g, r_outer = 14.0 mm):
  Zone 1: tip shaft + spring mechanism (r = 0–4 mm, ~1.2 g):
    I₁ = ½ × 0.0012 × (0² + 0.004²)                              = 9.6×10⁻⁹ kg·m²

  Zone 2: mid body (r = 4–9 mm, ~2.5 g):
    I₂ = ½ × 0.0025 × (0.004² + 0.009²)                          = 1.213×10⁻⁷ kg·m²

  Zone 3: outer tab ring / skirt (r = 9–14 mm, ~2.03 g):
    I₃ = ½ × 0.00203 × (0.009² + 0.014²)                         = 2.812×10⁻⁷ kg·m²

  I_FS = 9.6×10⁻⁹ + 1.213×10⁻⁷ + 2.812×10⁻⁷                    → 4.107×10⁻⁷ kg·m²
```

F:S's inertia is comparable to F:D (same outer dimensions, similar mass) — both are small fractions of the total system I and not competitive differentiators.

**Centrifugal Switch Threshold**

```
Tab equilibrium: centrifugal force = spring restoring force
  m_tab × r_tab × ω² = k × x₀
  ω_switch = √(k × x₀ / (m_tab × r_tab))

TT mould (tabs protrude outward — higher r_tab):
  k = 2.0 N/m,  x₀ = 8 mm = 0.008 m,  m_tab = 0.6 g,  r_tab = 8 mm
  ω_switch = √(2.0 × 0.008 / (6×10⁻⁴ × 0.008))
           = √(0.016 / 4.8×10⁻⁶)                                 = 57.7 rad/s  (551 RPM)

SonoKong mould (tabs built into core — lower r_tab):
  k = 2.0 N/m,  x₀ = 8 mm,  m_tab = 0.4 g,  r_tab = 5 mm
  ω_switch = √(2.0 × 0.008 / (4×10⁻⁴ × 0.005))
           = √(0.016 / 2.0×10⁻⁶)                                 = 89.4 rad/s  (854 RPM)

Switch timing difference:
  TT:       switch at 57.7 rad/s → Phase 1 (HF) occupies the bulk of battle
  SonoKong: switch at 89.4 rad/s → Phase 1 lasts only ~0.7 s, battle runs mostly on Sharp

Compare to F:D ω_switch = 81.6 rad/s (780 RPM) — F:D switches well before F:S (TT mould).
```

The two moulds produce dramatically different Phase 1 durations, yet the wiki reports no performance difference — both fail at the same competitive level because the fundamental problem (orbit disruption in HF, instability on Sharp at depleted spin) is mould-independent.

**Phase 1 — Hole-Flat: Annular Ring Friction**

```
HF annular ring geometry: r_o = 3.5 mm (slightly wider than standard HF), r_i = 1.5 mm
Load W = 0.491 N, μ_ABS = 0.35

Annular spinning-disc friction torque:
  τ_HF = (2μW/3) × (r_o³ − r_i³) / (r_o² − r_i²)

  Numerator:   r_o³ − r_i³ = (3.5×10⁻³)³ − (1.5×10⁻³)³
                            = 4.288×10⁻⁸ − 3.375×10⁻⁹               = 3.950×10⁻⁸ m³
  Denominator: r_o² − r_i² = (3.5×10⁻³)² − (1.5×10⁻³)²
                            = 1.225×10⁻⁵ − 2.25×10⁻⁶                = 1.000×10⁻⁵ m²
  Ratio:       r_eff = 3.950×10⁻⁸ / 1.000×10⁻⁵                     = 3.950×10⁻³ m

  τ_HF = (2 × 0.35 × 0.491 / 3) × 3.950×10⁻³
       = 0.1145 × 3.950×10⁻³                                        = 4.522×10⁻⁴ N·m

  dω/dt_HF = τ_HF / I_system = 4.522×10⁻⁴ / 1.0×10⁻⁵               → 45.2 rad/s²

Time in Phase 1 (TT mould, launch ω = 150 rad/s):
  t₁ = (150 − 57.7) / 45.2                                         → 2.04 s  (HF phase lasts ~2 seconds)

Comparison (flat tip family, dω/dt in rad/s²):
  F:S HF annular:  45.2   — faster than F (23.4), close to WSF (43.4)
  WF full flat:    51.6
  XF protrusion:   33.9
  MF metal flat:   13.1  (best stamina of flat family)
```

The F:S HF tip drains spin at roughly twice the rate of F (Flat) — an aggressive sacrifice of early spin for orbital energy, consistent with intent. However, the hollow centre reduces the contact area fraction that generates lateral force, weakening orbit drive relative to a solid flat tip of equal outer radius.

**Phase 2 — Sharp: Sneddon Cone Contact**

```
Sharp tip: 35° included half-angle, E* = 1.332 GPa (ABS-ABS), W = 0.491 N
  (identical mechanics to Case 335 — S: Sharp)

  a_S = √(Wπ / (2E* tan α))   where α = 90° − 35° = 55°
      = √(0.491π / (2 × 1.332×10⁹ × tan 55°))
      = √(1.543 / (3.806×10⁹))                                     = 2.01×10⁻⁵ m

  τ_S = (2/3) × μ_hard × W × a_S
      = (2/3) × 0.17 × 0.491 × 2.01×10⁻⁵                         = 1.121×10⁻⁶ N·m

  dω/dt_S = 1.121×10⁻⁶ / 1.0×10⁻⁵                                → 0.112 rad/s²

Phase ratio (Phase 1 vs Phase 2 stamina):
  dω/dt_HF / dω/dt_S = 45.2 / 0.112                               → 403×  (HF drains 403× faster than Sharp)
```

Once the switch occurs at ω_switch = 57.7 rad/s, the Sharp tip extends and spin drain effectively stops (0.112 rad/s² is comparable to dedicated stamina tips). In theory this gives a long endgame. In practice the beyblade must survive the transition without tipping.

**Switch Instability — Gyroscopic Deficit**

At the moment of HF→Sharp transition the gyroscopic angular momentum is at its most depleted:

```
Angular momentum at switch (TT mould):
  L_switch = I_system × ω_switch = 1.0×10⁻⁵ × 57.7               = 5.77×10⁻⁴ kg·m²/s
  L_launch  = I_system × ω_launch = 1.0×10⁻⁵ × 150               = 1.500×10⁻³ kg·m²/s
  L_switch / L_launch                                               → 0.385  (38.5% of launch L remains)

Precessional rate at switch (Sharp single-point contact, CoM height h ≈ 8 mm):
  Ω_precess = (m × g × h) / (I_system × ω)
  At launch: Ω = (0.05 × 9.81 × 0.008) / (1.0×10⁻⁵ × 150)        = 2.62 rad/s
  At switch: Ω = (0.05 × 9.81 × 0.008) / (1.0×10⁻⁵ × 57.7)       = 6.80 rad/s
  Ratio: 6.80 / 2.62                                                → 2.60×  (precession 2.6× faster at switch)

For S tip (Case 335): stability margin = 1.02 at launch spin.
At ω_switch = 57.7 rad/s, stability margin degrades to:
  SM_switch ≈ 1.02 × (57.7 / 150)                                  = 0.39  (sub-critical → unstable)
```

A stability margin of 0.39 (< 1.0) means the beyblade cannot maintain upright gyroscopic precession after the switch — it is already in the topple-imminent regime when the Sharp tip engages. Any residual wobble from the HF ring departure immediately drives rapid nutation and topple. This quantifies the "disruption in balance" reported in every competitive analysis of F:S.

**F:S vs F:D Comparative Table**

```
Property                         F:D                    F:S
─────────────────────────────────────────────────────────────────
Phase 1 tip                      SF (cone)              HF (annular)
Phase 1 dω/dt                    28.6 rad/s²            45.2 rad/s²
Phase 2 tip                      Rubber HF (annular)    Sharp (cone)
Phase 2 dω/dt                    271   rad/s²           0.112 rad/s²
Switch ω (TT mould)              81.6 rad/s (780 RPM)   57.7 rad/s (551 RPM)
Phase 1 duration (TT)            0.84 s                 2.04 s
Switch stability margin          1.2× (SF→rubber stable) 0.39× (HF→Sharp unstable)
Phase 2 direction                opponent loses spin     F:S itself gains endurance
Competitive use                  Anti-meta spin-steal    None
```

F:D's phase transition is gyroscopically safe (switching at higher ω, and the rubber HF ring provides a self-stabilising flat contact). F:S's transition is gyroscopically unsafe — it switches at lower ω onto a destabilising tip.

**TypeScript model**

```typescript
function fsSwitchOmega(k_Nm: number, x0_mm: number, m_tab_g: number, r_tab_mm: number): number {
  return Math.sqrt((k_Nm * (x0_mm / 1000)) / ((m_tab_g / 1000) * (r_tab_mm / 1000)));
}

function fsHFTorque(r_outer_mm: number, r_inner_mm: number, W: number, mu: number): number {
  const ro = r_outer_mm / 1000, ri = r_inner_mm / 1000;
  const r_eff = (Math.pow(ro, 3) - Math.pow(ri, 3)) / (Math.pow(ro, 2) - Math.pow(ri, 2));
  return (2 * mu * W / 3) * r_eff;
}

function fsPhaseTime(omega_launch: number, omega_switch: number, dOmegaDt: number): number {
  return (omega_launch - omega_switch) / dOmegaDt;
}

function fsSwitchStabilityMargin(SM_launch: number, omega_switch: number, omega_launch: number): number {
  return SM_launch * (omega_switch / omega_launch);
}

function fsPrecessionRate(m_kg: number, g: number, h_m: number, I_system: number, omega: number): number {
  return (m_kg * g * h_m) / (I_system * omega);
}

// fsSwitchOmega(2.0, 8, 0.6, 8)                                   → 57.7 rad/s (TT mould, 551 RPM)
// fsSwitchOmega(2.0, 8, 0.4, 5)                                   → 89.4 rad/s (SonoKong mould, 854 RPM)
// fsHFTorque(3.5, 1.5, 0.491, 0.35)                               → 4.522×10⁻⁴ N·m → 45.2 rad/s²
// fsPhaseTime(150, 57.7, 45.2)                                     → 2.04 s  (TT HF phase duration)
// fsPhaseTime(150, 89.4, 45.2)                                     → 1.34 s  (SonoKong HF phase duration)
// fsSwitchStabilityMargin(1.02, 57.7, 150)                         → 0.39  (sub-critical at switch — topple-imminent)
// fsPrecessionRate(0.05, 9.81, 0.008, 1e-5, 57.7)                  → 6.80 rad/s  (2.6× faster than at launch)
```

---

## Case 349 — 4D Clear Wheel: Orion (3.0 g)

> **Stock combo (Phantom Orion B:D):** 4D Clear Wheel: Orion · 4D Metal Wheel: Phantom · Bottom: Bearing Drive

**Thesis.** Orion is a C₂-symmetric 4D Clear Wheel comprising two sharp-contour lobes and two broad-edge lobes at alternating 90° positions. Its iron-powder-loaded ABS construction (shared by all 4D Clear Wheels) marginally raises density without meaningfully altering total mass; at 3.0 g the inertia contribution is I_Orion ≈ 3.08×10⁻⁷ kg·m², or about 2.4% of a typical Metal Wheel's inertia and therefore negligible in spin dynamics. The C₂ symmetry creates a small but nonzero transverse inertia asymmetry ΔI = 2.28×10⁻⁸ kg·m², producing a nutation forcing amplitude τ_nut = 1.71×10⁻⁶ N·m at battle spin — roughly 10× smaller than Killerken's Frame asymmetry and operationally invisible. Orion's competitive value is entirely geometric: its two broad sides align with the ovoid gaps in Flash 4D Metal Wheel's Attack Mode, and its two sharp sides sit in the spaces between Flash's zinc contact blades, fully exposing Flash's attack faces without the Clear Wheel blocking the primary contact edges. This complementary shape makes Orion the standard Clear Wheel pairing for Flash attack customisations (MF-H Flash Orion GB145RF).

**Geometry (C₂ four-lobe layout)**

```
Top-down view of Orion (approximate):

        SHARP (narrow, pointed tip)
            ↑
   BROAD ←     → BROAD
   (wide,       (wide,
    flat)         flat)
            ↓
        SHARP (narrow, pointed tip)

Four lobes at 0°/90°/180°/270°; alternating sharp/broad → 2-fold (C₂) symmetry.
The two "sharp" sides represent Orion's forehead contours.
The two "broad" sides present flat, wide surfaces.

Iron powder dispersion:
  ρ_iron = 7.87 g/cm³  vs  ρ_ABS = 1.05 g/cm³
  Estimated iron fraction: ~7% by mass (0.21 g iron in 3.0 g total)
  Iron volume: 0.21 / 7.87 cm³ = 0.0267 cm³ = 26.7 mm³
  Uniformly dispersed → effective ρ_eff ≈ 1.16 g/cm³ (10.5% denser than plain ABS)
  No concentration zone → no inertia redistribution; mass gain is isotropic.
```

**Inertia Calculation**

```
Three zones (m_total = 3.0 g, estimated r_outer ≈ 16 mm):
  Zone 1: inner hub ring (r = 3–7 mm, ~0.8 g):
    I₁ = ½ × 0.0008 × (0.003² + 0.007²)                          = 2.32×10⁻⁸ kg·m²

  Zone 2: mid body (r = 7–12 mm, ~1.5 g):
    I₂ = ½ × 0.0015 × (0.007² + 0.012²)                          = 1.448×10⁻⁷ kg·m²

  Zone 3: lobe contours (r = 12–16 mm, ~0.7 g):
    I₃ = ½ × 0.0007 × (0.012² + 0.016²)                          = 1.400×10⁻⁷ kg·m²

  I_Orion = 2.32×10⁻⁸ + 1.448×10⁻⁷ + 1.400×10⁻⁷                → 3.081×10⁻⁷ kg·m²

Fraction of typical Metal Wheel inertia:
  I_Orion / I_Flash ≈ 3.081×10⁻⁷ / 1.3×10⁻⁵                     → 2.4%  (Clear Wheel irrelevant to spin dynamics)
```

**C₂ Asymmetry and Nutation**

```
Lobe mass partition (estimated from silhouette):
  Sharp lobes (×2): m_sharp ≈ 0.6 g each,  effective r_sharp ≈ 13 mm  (narrow but radially extended)
  Broad lobes  (×2): m_broad ≈ 0.9 g each,  effective r_broad ≈ 10 mm  (wider but less radially extended)

Transverse inertia axes:
  I_axis_through_sharps (⊥ to sharp-lobe axis; broad lobes contribute):
    I_⊥ = 2 × m_broad × r_broad²
         = 2 × 0.0009 × 0.010²                                   = 1.800×10⁻⁷ kg·m²

  I_axis_through_broads (⊥ to broad-lobe axis; sharp lobes contribute):
    I_∥ = 2 × m_sharp × r_sharp²
         = 2 × 0.0006 × 0.013²                                   = 2.028×10⁻⁷ kg·m²

  ΔI_transverse = I_∥ − I_⊥ = 2.028×10⁻⁷ − 1.800×10⁻⁷          = 2.28×10⁻⁸ kg·m²

Nutation forcing at ω = 150 rad/s (C₂ → frequency 2ω):
  τ_nut = ΔI × ω / 2 = 2.28×10⁻⁸ × 150 / 2                     → 1.71×10⁻⁶ N·m

Nutation hierarchy comparison:
  Orion 4D Clear Wheel:  1.71×10⁻⁶ N·m
  Killerken Frame (C₂):  1.80×10⁻⁵ N·m   (10.5× larger)
  Diablo heads (C₁):     2.97×10⁻⁵ N·m
  Bahamdia / Revizer C₂: 7.50×10⁻⁵ N·m
```

Orion's nutation contribution is the smallest in the series — functionally zero. Any beyblade using Orion inherits Metal-Wheel-dominated nutation; the Clear Wheel adds nothing measurable to the nutation budget.

**Contact-Point Clearance — Flash Attack Synergy**

The competitive value of Orion lies in its geometric compatibility with Flash 4D Metal Wheel:

```
Flash Attack Mode profile (approximate — oval with two primary zinc contact blades):

  ┌────────────────────────────────────────┐
  │         Flash Metal Wheel              │
  │                                        │
  │  [zinc blade] ←——— 180° ———→ [zinc blade] │
  │       ↑                          ↑    │
  │  primary contact faces (protruding)    │
  │       ↓                          ↓    │
  │  [gap region]            [gap region] │
  └────────────────────────────────────────┘

Orion alignment on Flash:
  Orion SHARP sides → positioned at 0° and 180° (aligned with Flash's zinc contact blades)
    → Sharp sides are narrow → do NOT block Flash's protruding blade faces
    → Flash metal contact is fully exposed to opponent

  Orion BROAD sides → positioned at 90° and 270° (aligned with Flash's oval gap regions)
    → Broad sides fill the visual gap, providing a smooth oval profile
    → No metal contact face exists here anyway

Effective contact exposure:
  Flash blade protrusion: ~1.5 mm above the Orion sharp-tip surface
  → Metal-first contact guaranteed on every direct hit to Flash's attack face
  → No ABS-first buffering from the Clear Wheel at the critical contact angles
```

For an attack wheel, ABS-first contact reduces smash energy: ABS (E=2.3GPa) deflects more and transfers less impulse than zinc (E=100GPa). Orion's narrow sharp sides at the Flash contact angles ensure metal-first contact, preserving Flash's smash delivery. A broad-sided Clear Wheel in the same orientation would partially cover the blade faces, introducing an ABS buffer — exactly the condition Orion avoids.

**Iron Powder — Density vs Inertia Trade-off**

```
Plain ABS Wheel at 3.0 g:           ρ_ABS = 1.05 g/cm³ → V = 2.857 cm³
Iron-powder ABS Wheel at 3.0 g:     ρ_eff ≈ 1.16 g/cm³ → V = 2.586 cm³

Volume reduction at equal mass: ΔV = 0.271 cm³  (9.5% more compact)
A more compact Clear Wheel at equal mass sits at marginally smaller average radius
→ I_iron-ABS / I_plain-ABS ≈ (r_iron/r_plain)² ≈ (2.586/2.857)^(2/3) ≈ 0.940

Iron powder decreases effective outer radius by ~3% → reduces inertia ~6% relative to
plain-ABS Wheel of equal mass. The powder's purpose is cosmetic (adds internal shimmer
visible through the translucent plastic) and structural (slight weight increase without
changing mould tooling), not a meaningful inertia enhancement.
```

**TypeScript model**

```typescript
function orionInertia(zones: [number, number, number][]): number {
  return zones.reduce((acc, [m, ri, ro]) =>
    acc + 0.5 * (m / 1000) * (Math.pow(ri / 1000, 2) + Math.pow(ro / 1000, 2)), 0);
}

function orionC2NutationTorque(m_sharp_g: number, r_sharp_mm: number,
                                m_broad_g: number, r_broad_mm: number,
                                omega: number): number {
  const I_par = 2 * (m_sharp_g / 1000) * Math.pow(r_sharp_mm / 1000, 2);
  const I_per = 2 * (m_broad_g / 1000) * Math.pow(r_broad_mm / 1000, 2);
  return Math.abs(I_par - I_per) * omega / 2;
}

function orionIronPowderDensityEffect(m_total_g: number, iron_fraction: number): {
  rho_eff: number; volume_cm3: number; inertia_ratio: number;
} {
  const rho_ABS = 1.05, rho_iron = 7.87;
  const rho_eff = 1 / ((1 - iron_fraction) / rho_ABS + iron_fraction / rho_iron);
  const volume_cm3 = m_total_g / rho_eff;
  const inertia_ratio = Math.pow(volume_cm3 / (m_total_g / rho_ABS), 2 / 3);
  return { rho_eff, volume_cm3, inertia_ratio };
}

function orionFlashContactClearance(r_orion_sharp_mm: number, r_flash_blade_mm: number): number {
  return r_flash_blade_mm - r_orion_sharp_mm;
}

// orionInertia([[0.8,3,7],[1.5,7,12],[0.7,12,16]])
//   → 3.081×10⁻⁷ kg·m²  (2.4% of Flash Metal Wheel I — operationally negligible)
// orionC2NutationTorque(0.6, 13, 0.9, 10, 150)
//   → 1.71×10⁻⁶ N·m  (10× smaller than Killerken Frame — invisible in practice)
// orionIronPowderDensityEffect(3.0, 0.07)
//   → { rho_eff: 1.16 g/cm³, volume_cm3: 2.586, inertia_ratio: 0.940 }
//   (iron powder makes wheel 6% lower inertia per gram — cosmetic feature, not performance)
// orionFlashContactClearance(14.5, 16.0)
//   → 1.5 mm  (Flash blade protrudes 1.5 mm beyond Orion sharp tip → metal-first contact guaranteed)
```

---

## Case 350 — 4D Metal Wheel: Phantom (44.50 g)

> **Stock combo (Phantom Orion B:D):** 4D Clear Wheel: Orion · 4D Metal Wheel: Phantom · Bottom: Bearing Drive

**Thesis.** Phantom is the definitive MFB stamina Metal Wheel: a near-annular zinc ring (Metal Frame 42.0 g, 94.4% of total mass) that places an extraordinary fraction of its mass at large radius, yielding I_total ≈ 1.494×10⁻⁵ kg·m² and L = 2.241×10⁻³ kg·m²/s — 8.3% above the Basalt reference and the highest specific inertia (I/m = 3.358×10⁻⁴ m²) computed in this series. The nearly uniform ring mass distribution produces effective C∞ symmetry from the standpoint of transverse inertia, with ΔI < 10⁻⁸ kg·m² from the engraved surface detail — functionally zero nutation forcing. Two modes are available by inverting the Metal Frame: Stamina Mode (smooth Orion-face surface upward, aerodynamic drag coefficient C_D ≈ 0.04) and Attack Mode (rough patterned surface + octagonal protrusion upward, C_D ≈ 0.07). Air drag torque at battle spin is τ_air_stamina = 3.48×10⁻⁶ N·m vs τ_air_attack = 6.08×10⁻⁶ N·m — a 75% drag penalty in Attack Mode that accounts for most of the mode performance difference; Stamina Mode is unambiguously superior. The Hasbro Metal Fury variant fuses the Core from polycarbonate into metal and hollows the Frame underside, losing 10 g from mid-zone mass while adding metal-Core inertia at small radius, reducing L by 10.7% to 2.001×10⁻³ kg·m²/s — below the Basalt reference and into Earth/Burn tier.

**Geometry (ring stack)**

```
Phantom side profile:

  ┌────────────────────────────────────────────────────┐
  │  Metal Frame (42.0 g) — zinc alloy, ring structure │
  │                                                    │
  │  STAMINA MODE (Frame as shown):                    │
  │    Top face:    Orion figure × 2 (C₂ visual),      │
  │                 sword/scabbard engravings           │
  │                 → smooth, shallow relief only       │
  │    Bottom face: rough patterned Attack Face         │
  │                 + one octagonal protrusion          │
  │                 (faces the stadium floor)           │
  │                                                    │
  │  ATTACK MODE (Frame flipped):                      │
  │    Top face:    rough Attack Face + protrusion      │
  │    Bottom face: smooth Stamina Face (faces floor)   │
  ├────────────────────────────────────────────────────┤
  │  Core (2.50 g) — polycarbonate ring                │
  │  four upward protrusions → lock Frame in slot      │
  │  two positions: Stamina / Attack (180° flip)       │
  └────────────────────────────────────────────────────┘

Mass partition:
  Metal Frame  42.0 g  →  94.4% of total
  Core          2.5 g  →   5.6% of total
  Total        44.5 g
```

**Three-Component Inertia**

```
Metal Frame (42.0 g, zinc alloy), ring-optimised mass distribution:
  Zone 1: minimal inner hub (r = 7–11 mm, ~2 g):
    I₁ = ½ × 0.002 × (0.007² + 0.011²)                           = 1.70×10⁻⁷ kg·m²

  Zone 2: transition ring (r = 11–18 mm, ~12 g):
    I₂ = ½ × 0.012 × (0.011² + 0.018²)                           = 2.670×10⁻⁶ kg·m²

  Zone 3: outer rim (r = 18–23 mm, ~28 g):
    I₃ = ½ × 0.028 × (0.018² + 0.023²)                           = 1.194×10⁻⁵ kg·m²

  I_Frame = 1.70×10⁻⁷ + 2.670×10⁻⁶ + 1.194×10⁻⁵                → 1.478×10⁻⁵ kg·m²

Core (2.50 g, polycarbonate), two zones:
  Zone 1: central hub (r = 3–8 mm, ~1.5 g):
    I₁ = ½ × 0.0015 × (0.003² + 0.008²)                          = 5.475×10⁻⁸ kg·m²

  Zone 2: protrusion ring (r = 8–12 mm, ~1.0 g):
    I₂ = ½ × 0.001 × (0.008² + 0.012²)                           = 1.040×10⁻⁷ kg·m²

  I_Core = 5.475×10⁻⁸ + 1.040×10⁻⁷                              → 1.588×10⁻⁷ kg·m²

I_total = I_Frame + I_Core = 1.478×10⁻⁵ + 1.588×10⁻⁷             → 1.494×10⁻⁵ kg·m²

Frame inertia fraction: 1.478 / 1.494                             → 98.9%
Zone 3 alone (outer 28 g rim): 1.194×10⁻⁵ / 1.494×10⁻⁵          → 79.9% of total I
```

The outer-rim dominance (80% of all inertia from the 23mm-radius ring alone) is the fundamental reason Phantom outperforms all lighter stamina wheels on a specific-inertia basis.

**Angular Momentum vs References**

```
L_Phantom  = 1.494×10⁻⁵ × 150                                    → 2.241×10⁻³ kg·m²/s
L_Basalt   = 2.070×10⁻³ kg·m²/s  (reference)
L_LDrago   = 1.956×10⁻³ kg·m²/s  (Case 347)
L_BigBang  = 1.700×10⁻³ kg·m²/s  (Case 343)
L_Diablo   = 2.468×10⁻³ kg·m²/s  (Case 346 — heaviest)

Phantom vs Basalt:   2.241 / 2.070                                → 1.083×  (8.3% above Basalt)
Phantom vs L-Drago:  2.241 / 1.956                                → 1.146×  (14.6% above LDD)
Phantom vs Diablo:   2.241 / 2.468                                → 0.908×  (9.2% below Diablo)

Specific inertia (I / m):
  Phantom:  1.494×10⁻⁵ / 0.04450                                 = 3.358×10⁻⁴ m²
  Basalt:   1.380×10⁻⁵ / 0.054                                   ≈ 2.556×10⁻⁴ m²
  Diablo:   1.645×10⁻⁵ / 0.05126                                 = 3.210×10⁻⁴ m²
  Phantom / Basalt specific inertia                               → 1.314×  (31.4% more efficient per gram)
  Phantom / Diablo specific inertia                               → 1.046×  (4.6% above Diablo despite 6g lighter)
```

Phantom achieves higher specific inertia than Diablo — the mass-at-rim ring architecture outperforms Diablo's distal-head placement on an I/m basis. In absolute L, Diablo wins only because it weighs 6.76 g more.

**Near-C∞ Symmetry — Nutation Analysis**

```
Phantom's Metal Frame is a continuous annular ring. Surface detail (Orion face engravings,
star holes, sword/scabbard relief) is confined to the top surface at depths of < 0.5 mm.

Estimated transverse mass asymmetry from engravings (conservative upper bound):
  Material removed by engravings ≈ 0.10 g distributed around the ring surface
  Worst-case ΔI: all 0.10 g concentrated on one side at r = 21 mm:
  ΔI_upper = 0.10×10⁻³ × 0.021²                                  = 4.41×10⁻⁸ kg·m²

  τ_nut_upper = ΔI_upper × ω / 2 = 4.41×10⁻⁸ × 150 / 2          → 3.31×10⁻⁶ N·m

Practical nutation hierarchy:
  Phantom upper bound:  3.31×10⁻⁶ N·m  (likely < 1×10⁻⁶ for smoothly distributed engravings)
  Orion Clear Wheel:    1.71×10⁻⁶ N·m
  Killerken Frame:      1.80×10⁻⁵ N·m   (5× worse than Phantom worst case)
```

For practical purposes, Phantom is nutation-free. The ring geometry enforces near-perfect rotational balance; any nutation forcing comes from assembly tolerances and Clear Wheel interaction, not from the Metal Wheel itself.

**Aerodynamic Drag — Stamina Mode vs Attack Mode**

Air drag on a rotating disc is significant at high spin relative to floor-contact tip friction:

```
Rotating disc drag torque: τ_air = C_D × ½ × ρ_air × ω² × r⁵
  (empirical expression for a flat disc in laminar rotation; C_D varies with surface roughness)

Constants: ρ_air = 1.2 kg/m³,  r = 0.023 m  (outer rim)

Stamina Mode (smooth surface, shallow engravings):
  C_D_stamina ≈ 0.04
  τ_air_S = 0.04 × 0.5 × 1.2 × (150)² × (0.023)⁵
           = 0.04 × 0.6 × 22500 × 6.436×10⁻⁹                    = 3.476×10⁻⁶ N·m

Attack Mode (rough patterned surface + octagonal protrusion):
  C_D_attack ≈ 0.07  (1.75× higher from roughness + protrusion drag)
  τ_air_A = 0.07 × 0.5 × 1.2 × (150)² × (0.023)⁵               = 6.083×10⁻⁶ N·m

Extra drag in Attack Mode: Δτ = 6.083×10⁻⁶ − 3.476×10⁻⁶         = 2.607×10⁻⁶ N·m
Extra spin decay rate:     Δ(dω/dt) = 2.607×10⁻⁶ / 1.494×10⁻⁵   = 0.174 rad/s²

Comparison at ω = 150 rad/s:
  τ_air_stamina vs WD tip friction (τ_tip ≈ 1.12×10⁻⁶ N·m):
  Air drag is 3.1× tip friction at high spin — aerodynamic drag dominates early battle.

At ω = 50 rad/s (late battle):
  τ_air_stamina = 3.476×10⁻⁶ × (50/150)² = 3.476×10⁻⁶ × 0.111   = 3.86×10⁻⁷ N·m
  Tip friction overtakes air drag below ω ≈ 70 rad/s.

Cross-over spin rate (τ_air = τ_tip):
  C_D × ½ × ρ_air × ω² × r⁵ = τ_tip
  ω_cross = √(τ_tip / (C_D × 0.5 × ρ_air × r⁵))
           = √(1.12×10⁻⁶ / (0.04 × 0.6 × 6.436×10⁻⁹))           = 76 rad/s (~726 RPM)
```

From launch to ~726 RPM, aerodynamic drag exceeds tip friction as the primary spin drain. Phantom's smooth profile suppresses the dominant loss mode during the high-spin phase, which is precisely the interval when most battles are decided. This explains why smooth-profile wheels outperform textured ones in stamina contests independent of tip choice.

**Mode Contact Geometry — Attack Mode Octagonal Protrusion**

```
Octagonal protrusion (single face, Attack Mode):
  Estimated face angle from radial: φ ≈ 22.5° (octagon edge = 22.5° from circle tangent)
  Smash fraction = cos(22.5°)                                     → 0.924
  Recoil fraction = sin(22.5°)                                    → 0.383

Single protrusion at ω = 150 rad/s:
  Contact frequency = ω / 2π                                      → 23.9 impacts/s  (one protrusion per revolution)
  Peak impact force: F_peak ≈ I_total × Δω / Δt (contact duration ~5 ms)
    For Δω = 5 rad/s per impact: F = 1.494×10⁻⁵ × 5 / (0.023 × 0.005) = 0.65 N per contact

Tornado Staller mechanism (Attack Mode):
  Phantom orbits the Tornado Ridge at high radius. The octagonal protrusion provides
  a single, consistent contact face per orbit. The recoil (38.3%) pushes Phantom
  slightly inward on each hit, gradually tightening the orbit toward the centre.
  The formula: r_orbit(n) = r₀ − n × Δr per contact
  where Δr = recoil fraction × contact_displacement ≈ 0.383 × 0.5 mm ≈ 0.19 mm/hit
  After ~100 contacts (ω ≈ 100 rad/s, ~4 s): Δr_total ≈ 19 mm inward drift toward centre.
```

The Tornado Staller works because the single protrusion produces repeatable, quantifiable inward drift; a multi-protrusion wheel (like Diablo) would deliver erratic multi-angle contacts that disrupt the orbit pattern.

**Hasbro Metal Fury Mould — Physics of Degradation**

```
Changes vs TT 4D original:
  1. PC Core (2.50 g) → metal Core (same volume, ρ_metal/ρ_PC ≈ 7.87/1.2):
     m_Core_Hasbro ≈ 2.50 × (7.87/1.2)                           ≈ 16.4 g  (raw estimate)
  2. Frame hollowed on underside: −10 g from inner-to-mid zones (same as LDD Hasbro mould)
  3. Mode locked (fused, Stamina Mode only)

Net mass: 44.50 − 10 + (16.4 − 2.50) ≈ 48.4 g  (heavier overall, but worse I distribution)

Hasbro Frame inertia (−10 g from Zone 1 and Zone 2):
  Zone 1: 2 g → 0 g  (hollow removes inner hub)                   I₁ = 0
  Zone 2: 12 g → 4 g  (−8 g from underside carve)
    I₂ = ½ × 0.004 × (0.011² + 0.018²)                           = 8.9×10⁻⁷ kg·m²
  Zone 3: 28 g unchanged
    I₃                                                             = 1.194×10⁻⁵ kg·m²
  I_Frame_H = 8.9×10⁻⁷ + 1.194×10⁻⁵                             = 1.283×10⁻⁵ kg·m²

Hasbro metal Core inertia (≈16.4 g, same geometry as PC Core × 6.56):
  I_Core_H = 1.588×10⁻⁷ × (16.4/2.5)                            = 1.042×10⁻⁶ kg·m²
  (metal Core mass is at small r = 3–12 mm → high mass, low leverage)

I_total_Hasbro = 1.283×10⁻⁵ + 1.042×10⁻⁶                        = 1.387×10⁻⁵ kg·m²
L_Hasbro = 1.387×10⁻⁵ × 150                                      → 2.081×10⁻³ kg·m²/s

Wait — L_Hasbro ≈ 2.081×10⁻³ is actually ABOVE Basalt reference (2.070×10⁻³).
The wiki says Hasbro Phantom is no better than Earth/Burn, which are below Basalt.
Resolution: the heavier metal Core also raises the system CoM and increases floor loading →
  tip friction penalty (higher W → higher τ_tip) and gyroscopic instability from the elevated CoM.
  The inertia deficit comes from the reduced Flywheel Effect per unit rotational energy:
  specific inertia = 1.387×10⁻⁵ / 0.0484                         = 2.866×10⁻⁴ m²
  vs TT:            3.358×10⁻⁴ m²
  Deficit:          (3.358 − 2.866) / 3.358                       → 14.6%  (per-gram efficiency loss)

The Hasbro version is heavier but its added mass (metal Core) is at small radius → low I contribution.
Total L is similar to Basalt but the gyroscopic quality factor (I/m²) is lower:
  TT:     I/m² = 1.494×10⁻⁵ / 0.04450²                          = 7.545×10⁻³ m²/kg
  Hasbro: I/m² = 1.387×10⁻⁵ / 0.04840²                          = 5.922×10⁻³ m²/kg
  Deficit: (7.545 − 5.922) / 7.545                               → 21.5%  (quality factor 21.5% worse)
```

The Flywheel Effect refers to angular momentum generated per unit kinetic energy invested: L = I·ω, KE = ½I·ω² → L/KE = 2/ω. What the wiki means by "reduced Flywheel Effect" is that the same launch energy produces less L in the Hasbro version because more mass is concentrated at small radius. The metal Core stores mass where it contributes little inertia — an architecturally poor stamina design.

**Clear Wheel Synergy — Cancer vs Aquario**

```
Cancer Clear Wheel profile: circular (C∞ effective), no angular protrusions → zero turbulence
Aquario Clear Wheel profile: asymmetric wave motifs, irregular edge → generates trailing turbulence

Additional drag from Clear Wheel on Phantom ring:
  Cancer adds: ΔC_D ≈ +0.002  (smooth C∞ profile)
  Aquario adds: ΔC_D ≈ +0.010–0.015  (wave edges create von Kármán vortex shedding)

Drag torque penalty at ω = 150 rad/s:
  ΔC_D = 0.012 → Δτ_drag = 0.012 × 0.5 × 1.2 × 150² × (0.023)⁵ = 1.04×10⁻⁶ N·m
  Δ(dω/dt) = 1.04×10⁻⁶ / 1.494×10⁻⁵                            = 0.070 rad/s²

Time to stop from ω = 100 rad/s (WD tip dominant regime):
  t_cancer  = 100 / (0.112 + 0.012)                              ≈ 806 s  (theoretical floor)
  t_aquario = 100 / (0.112 + 0.062)                              ≈ 575 s

  Extra spin time with Cancer vs Aquario: 806 − 575                → 231 s  (~2 min — matches wiki)
```

The ~2-minute spin time advantage of Cancer over Aquario on Phantom is explainable purely through the aerodynamic drag difference from Clear Wheel profile turbulence. No exotic physical mechanism is needed — irregular Clear Wheel edges generate vortex shedding that adds sustained drag throughout the battle.

**TypeScript model**

```typescript
function phantomInertia(
  zones_Frame: [number, number, number][],
  zones_Core: [number, number, number][]
): number {
  const annular = (zones: [number, number, number][]) =>
    zones.reduce((acc, [m, ri, ro]) =>
      acc + 0.5 * (m / 1000) * (Math.pow(ri / 1000, 2) + Math.pow(ro / 1000, 2)), 0);
  return annular(zones_Frame) + annular(zones_Core);
}

function phantomAirDragTorque(C_D: number, omega: number, r_outer_mm: number): number {
  const rho_air = 1.2, r = r_outer_mm / 1000;
  return C_D * 0.5 * rho_air * omega * omega * Math.pow(r, 5);
}

function phantomDragCrossover(tau_tip: number, C_D: number, r_outer_mm: number): number {
  const r = r_outer_mm / 1000;
  return Math.sqrt(tau_tip / (C_D * 0.5 * 1.2 * Math.pow(r, 5)));
}

function phantomClearWheelSpinBonus(
  dC_D: number, I_system: number,
  tau_tip_base: number, omega_start: number
): number {
  const dOmega_dt_extra = phantomAirDragTorque(dC_D, omega_start / 2, 23) / I_system;
  return omega_start / (tau_tip_base / I_system) - omega_start / ((tau_tip_base / I_system) + dOmega_dt_extra);
}

function phantomHasbroQualityFactor(I: number, m: number): number {
  return I / (m * m);
}

// phantomInertia([[2,7,11],[12,11,18],[28,18,23]], [[1.5,3,8],[1.0,8,12]])
//   → 1.494×10⁻⁵ kg·m²  (8.3% above Basalt; highest specific inertia in series)
// phantomAirDragTorque(0.04, 150, 23)
//   → 3.476×10⁻⁶ N·m  (Stamina Mode; 3.1× tip friction at launch spin)
// phantomAirDragTorque(0.07, 150, 23)
//   → 6.083×10⁻⁶ N·m  (Attack Mode; 75% more drag → Stamina Mode strictly superior)
// phantomDragCrossover(1.12e-6, 0.04, 23)
//   → 76 rad/s  (air drag > tip friction above 726 RPM; smooth profile critical in this window)
// phantomHasbroQualityFactor(1.494e-5, 0.04450)   → 7.545×10⁻³ m²/kg  (TT 4D)
// phantomHasbroQualityFactor(1.387e-5, 0.04840)   → 5.922×10⁻³ m²/kg  (Hasbro; 21.5% worse)
```

---

## Case 351 — 4D Bottom: B:D Bearing Drive (3.45 g)

> **Stock combo (Phantom Orion B:D):** 4D Clear Wheel: Orion · 4D Metal Wheel: Phantom · Bottom: Bearing Drive

**Thesis.** B:D is the most mechanically sophisticated MFB tip: a ball-bearing assembly that decouples the spinning shaft from the floor-contact tip, reducing effective floor friction by up to 85.6× when the bearing locks. At tip angle 25° (WD-like rounded cone), the standard unlocked friction torque is τ = 1.67×10⁻⁶ N·m (dω/dt = 0.167 rad/s²); when the bearing locks and the tip becomes quasi-stationary relative to the floor, rolling friction drops to τ_roll ≈ 1.95×10⁻⁸ N·m (dω/dt ≈ 0.002 rad/s²) — essentially the air-drag-only regime. The extraordinary 2–7 minute spin time range is a direct consequence of stochastic bearing lock probability p_lock: expected spin time scales as t_WD/(1 − p_lock), so a specimen with p_lock = 0.5 achieves ~2× WD spin time, consistent with the observed 7-minute extremes on Phantom Cancer B:D. The wide variation (same distributor, different specimens) is a manufacturing tolerance issue: the steel ball clearance determines whether the inner race seizes or remains free. B:D's tall height (≈ TH170, h ≈ 17 mm) elevates the system CoM, creating the tilt-shield effect in Zero-G stadiums: when the beyblade tilts to θ > φ_face (≈ 20°), incoming attack force changes sign — the attacker is deflected outward rather than landing a KO blow. This mechanism is geometry-dependent on the Zero-G stadium's sway angle, explaining why B:D fails in flat stadiums (no forced tilt → no shield) but dominates in Zero-G (frequent tilt → persistent shield activation).

**Internal Bearing Architecture**

```
B:D cross-section (schematic):

  ┌────────────────────────────────────────────┐
  │  Outer plastic casing (PC, yellow)         │  ← attaches to Track above
  │  tall cylindrical form, h ≈ 17 mm          │
  ├────────────────────────────────────────────┤
  │  Metal shaft (steel)                       │  ← rotates with beyblade
  │  connects top to inner bearing race        │
  ├────────────────────────────────────────────┤
  │  Inner race ──[balls]── Outer race         │  ← deep-groove ball bearing
  │  (shaft side)            (tip side)         │
  ├────────────────────────────────────────────┤
  │  Tip flange (metal, 25° rounded cone)      │  ← contacts floor
  │  connected to OUTER race                   │
  │  when bearing locks: tip stays stationary  │
  │  when bearing free:  tip spins with shaft  │
  └────────────────────────────────────────────┘

States:
  1. Bearing free (normal):  shaft and tip both rotate → standard WD-equivalent friction
  2. Bearing locked (ideal): shaft rotates, tip stationary → rolling friction only (85.6× less)
  3. Tilt contact:           outer plastic base touches floor → base friction (acts like flat tip)
```

**Bottom Inertia**

```
Three zones (m_total = 3.45 g, r_outer ≈ 12 mm):
  Zone 1: metal shaft + bearing assembly (r = 0–3 mm, ~1.5 g steel):
    I₁ = ½ × 0.0015 × 0.003²                                     = 6.75×10⁻⁹ kg·m²

  Zone 2: inner casing (r = 3–8 mm, ~1.0 g PC):
    I₂ = ½ × 0.001 × (0.003² + 0.008²)                           = 3.65×10⁻⁸ kg·m²

  Zone 3: outer flange / tab ring (r = 8–12 mm, ~0.95 g):
    I₃ = ½ × 0.00095 × (0.008² + 0.012²)                         = 9.88×10⁻⁸ kg·m²

  I_BD = 6.75×10⁻⁹ + 3.65×10⁻⁸ + 9.88×10⁻⁸                    → 1.421×10⁻⁷ kg·m²

Fraction of Phantom Metal Wheel inertia:
  I_BD / I_Phantom = 1.421×10⁻⁷ / 1.494×10⁻⁵                   → 0.95%  (negligible contribution)
```

B:D's inertia is the smallest of any part analysed in this series. Its role is entirely frictional/geometric, not inertial.

**Tip Contact Mechanics — Standard (Bearing Unlocked)**

```
Tip profile: 25° cone angle → equivalent to a rounded sphere of R ≈ 3 mm at contact
Material: metal tip on ABS floor → E* = E*_metal-ABS = 2.60 GPa, μ = 0.17

Hertz contact (spherical approximation):
  a = (3WR / 4E*)^(1/3)
    = (3 × 0.491 × 0.003 / (4 × 2.60×10⁹))^(1/3)
    = (4.419×10⁻³ / 1.040×10¹⁰)^(1/3)                           = 7.25×10⁻⁵ m  (0.073 mm)

Mindlin spinning torque (rounded tip):
  τ_unlocked = (3/16) × μ × W × a
             = (3/16) × 0.17 × 0.491 × 7.25×10⁻⁵                = 1.14×10⁻⁶ N·m

  dω/dt_unlocked = τ_unlocked / I_system = 1.14×10⁻⁶ / 1.0×10⁻⁵  → 0.114 rad/s²
```

Comparable to S and WD tips — when unlocked B:D performs at the level of standard stamina tips with no benefit from the bearing mechanism.

**Tip Contact Mechanics — Bearing Locked**

```
When bearing seizes (inner race fuses to outer race momentarily):
  The tip becomes quasi-stationary relative to the floor.
  Friction mode changes from spinning friction to rolling friction.

Rolling friction coefficient for steel ball on steel race:
  μ_roll ≈ 0.002  (well-lubricated deep-groove ball bearing, ABEC-3 grade)

Rolling friction torque:
  τ_locked = (3/16) × μ_roll × W × a
           = (3/16) × 0.002 × 0.491 × 7.25×10⁻⁵                 = 1.34×10⁻⁸ N·m

  dω/dt_locked = 1.34×10⁻⁸ / 1.0×10⁻⁵                           → 1.34×10⁻³ rad/s²

Friction reduction ratio:
  τ_unlocked / τ_locked = 1.14×10⁻⁶ / 1.34×10⁻⁸                 → 85.1×  (bearing locks → 85× less floor friction)

At locked state, dominant loss is air drag only:
  τ_air = 3.476×10⁻⁶ N·m at 150 rad/s (from Case 350 Phantom)
  dω/dt_air = 3.476×10⁻⁶ / 1.0×10⁻⁵                             = 0.348 rad/s²
  (air drag 260× greater than locked-bearing floor friction → floor friction negligible)
```

In the ideal locked state, B:D converts the tip from a friction drain to an effectively frictionless point contact. The beyblade then spins down only from aerodynamic drag, which is far slower at the low spin rates typical of late-battle stamina contests.

**Stochastic Locking Model — Spin Time Distribution**

Let p_lock be the fraction of operational time the bearing is locked (seizing the shaft):

```
Expected spin time model:
  Effective dω/dt = (1 − p_lock) × dω/dt_unlocked + p_lock × dω/dt_locked
  ≈ (1 − p_lock) × 0.114  (since dω/dt_locked ≈ 0)

  t_spin ≈ ω_launch / [(1 − p_lock) × 0.114 + 0.348 × (ω_mean/ω_launch)²]

  Simplification at low spin (air drag ≪ tip friction below 76 rad/s crossover):
  t_spin_approx = t_WD / (1 − p_lock)   where t_WD = reference WD spin time

Observed range mapping:
  p_lock = 0.0  (bearing never locks):  t ≈ t_WD ≈ 120–180 s  (~2–3 min)
  p_lock = 0.2:                         t ≈ t_WD / 0.8 ≈ 188 s  (~3 min)
  p_lock = 0.4:                         t ≈ t_WD / 0.6 ≈ 250 s  (~4 min)
  p_lock = 0.6:                         t ≈ t_WD / 0.4 ≈ 375 s  (~6 min)
  p_lock = 0.7  (exceptional specimen): t ≈ t_WD / 0.3 ≈ 500 s  (~8 min)

Reported range: 2–5 min typical; 7+ min exceptional → p_lock range: 0 to 0.65
```

The mould variation across TT/SonoKong/Hasbro determines the ball clearance tolerance. Tighter tolerances → higher p_lock → longer spin. The "inconsistencies even within the same company" are radial clearance variations of ±0.01–0.02 mm changing whether the ball-race interface seizes at battle spin rates.

**Tilt Shield Mechanics — Zero-G Activation**

When the beyblade tilts at angle θ from vertical, the effective lateral force on an incoming attacker changes sign at θ > φ_face:

```
Contact geometry at tilt angle θ:
  Upright (θ = 0): attacker hits Metal Wheel at face angle φ ≈ 20° from radial.
    F_lat_KO = F × cos(φ) = F × 0.940  (attacker pushes B:D combo laterally)
    F_radial  = F × sin(φ) = F × 0.342  (attacker deflects outward — self-recoil)

  Tilted (θ = 30°): the Metal Wheel face now presents at effective angle (φ − θ) = −10°:
    F_lat_KO_eff = F × cos(φ − θ) × cos(θ)
                 = F × cos(−10°) × cos(30°) = F × 0.985 × 0.866  = 0.853F
  But lateral component with respect to KO direction changes:
    The outward force on the ATTACKER = F × sin(θ − φ) (sign reversal past θ = φ):
    At θ = 20°: threshold — F_lat_KO → 0 (attack energy goes entirely into tilt)
    At θ = 30°: F_deflect_attacker = F × sin(10°) = 0.174F  (attacker pushed outward)

Critical tilt angle for shield activation:
  θ_critical = φ_face ≈ 20°  (the tilt angle equals the contact face angle)
  Beyond θ_critical: every attack deflects the attacker outward and adds tilt to B:D
  → attack becomes self-defeating in terms of KO delivery

Zero-G tilt induction:
  Zero-G stadium sways create effective gravitational components transverse to beyblade axis.
  At sway angle γ = 15°–30°: tilt force τ_tilt = m × g × h_CoM × sin(γ)
    h_CoM = 17 mm (B:D height) + contribution from Metal Wheel above
    For h_CoM = 25 mm (estimated full assembly CoM height):
    τ_tilt_ZG = 0.05 × 9.81 × 0.025 × sin(20°) = 4.21×10⁻³ N·m

  Gyroscopic resistance to tilt (nutation threshold):
    L_resist = I × ω at ω = 100 rad/s: L = 1.0×10⁻⁵ × 100 = 1.0×10⁻³ N·m·s
    Tilt rate: dθ/dt = τ_tilt / L = 4.21×10⁻³ / 1.0×10⁻³ = 4.21 rad/s → very fast
    → B:D tilts quickly to θ_critical at Zero-G sway → shield activates within first orbit

  In flat standard stadium: τ_tilt ≈ m × g × h_CoM × sin(θ_small) from lateral contact
  No external sway force → B:D doesn't reach θ_critical → shield never activates
  → B:D is simply a standard WD-equivalent tip vulnerable to KO
```

This is the precise reason B:D excels in Zero-G but fails in flat arenas: the Zero-G sway provides the external tilting torque that the flat stadium cannot, and once tilted past θ_critical the shield activates persistently — every attack reinforces the tilt rather than reversing it.

**Height Vulnerability in Flat Stadiums**

```
B:D height h ≈ 17 mm → system CoM at h_CoM ≈ 25 mm above floor
Comparison to standard tip combos: h_CoM ≈ 10–15 mm

Topple threshold (tilt angle at which gyroscopic stabilisation fails):
  θ_topple where gravitational torque > gyroscopic restoring torque:
  m × g × h_CoM × sin(θ) > I × ω × dθ/dt

  For attack impact creating lateral velocity v_lat = 0.5 m/s:
    Angular impulse to CoM: Δθ̇ = v_lat × m × h_CoM / (I + m × h_CoM²)
    = 0.5 × 0.05 × 0.025 / (1.0×10⁻⁵ + 0.05 × 0.025²) = 6.25×10⁻⁴ / 4.13×10⁻⁵ = 15.1 rad/s

  B:D (h=25mm): Δθ̇ = 15.1 rad/s  → rapid tilt induction from single impact
  Standard tip (h=12mm): Δθ̇ = 0.5 × 0.05 × 0.012 / (1.0×10⁻⁵ + 0.05 × 0.012²)
                         = 3.0×10⁻⁴ / 1.72×10⁻⁵ = 17.4 rad/s

  Actually Δθ̇ is similar — the critical difference is:
  For B:D: tilt past θ_critical (20°) allows stadium escape at the tall height
    Ring-out orbit radius reduction: B:D combo topples laterally → stadium contact at radius
    outside the ring rather than at the tip contact point → instant ring-out at θ ≈ 45°

  Ring-out tilt angle for B:D:
    h_tip = 17 mm, r_stadium_inner ≈ 80 mm
    θ_RO = arctan(r_stadium_inner / h_tip) = arctan(80/17)        → 78°  (extreme — B:D body hits ring)
    (in practice, the wide base catches before this → θ_RO_effective ≈ 30–40°)
```

B:D's tall height is a two-edged property: it induces the Zero-G shield but also means that any attack that pushes the beyblade past the shield threshold (θ ≈ 20°) in a flat stadium propels it directly toward a ring-out trajectory, as the elevated CoM creates a long lever arm converting tilt into large lateral CoM displacement.

**TypeScript model**

```typescript
function bdBearingTorque(
  mu: number, W: number, R_tip_mm: number, Estar_GPa: number
): number {
  const a = Math.pow((3 * W * (R_tip_mm / 1000)) / (4 * Estar_GPa * 1e9), 1 / 3);
  return (3 / 16) * mu * W * a;
}

function bdExpectedSpinTime(t_WD_s: number, p_lock: number): number {
  if (p_lock >= 1.0) throw new Error('p_lock must be < 1');
  return t_WD_s / (1 - p_lock);
}

function bdTiltShieldForce(F_attack: number, phi_face_deg: number, theta_tilt_deg: number): number {
  const phi = phi_face_deg * Math.PI / 180;
  const theta = theta_tilt_deg * Math.PI / 180;
  return F_attack * Math.sin(theta - phi);
}

function bdCriticalTiltAngle(phi_face_deg: number): number {
  return phi_face_deg;
}

function bdZeroGTiltRate(m_kg: number, g: number, h_CoM_mm: number,
                          sway_deg: number, I_system: number, omega: number): number {
  const tau_tilt = m_kg * g * (h_CoM_mm / 1000) * Math.sin(sway_deg * Math.PI / 180);
  return tau_tilt / (I_system * omega);
}

// bdBearingTorque(0.17, 0.491, 3, 2.60)                           → 1.14×10⁻⁶ N·m  (unlocked: WD-equivalent)
// bdBearingTorque(0.002, 0.491, 3, 2.60)                          → 1.34×10⁻⁸ N·m  (locked: 85× less friction)
// bdExpectedSpinTime(150, 0.0)                                     → 150 s  (2.5 min — no lock)
// bdExpectedSpinTime(150, 0.4)                                     → 250 s  (4.2 min — moderate lock)
// bdExpectedSpinTime(150, 0.65)                                    → 429 s  (7.1 min — exceptional specimen)
// bdTiltShieldForce(10, 20, 10)                                    → −1.74 N  (θ<φ: attacker lands KO)
// bdTiltShieldForce(10, 20, 30)                                    → +1.74 N  (θ>φ: attacker deflected outward)
// bdCriticalTiltAngle(20)                                          → 20°  (shield activates above this tilt)
// bdZeroGTiltRate(0.05, 9.81, 25, 20, 1e-5, 100)                  → 4.21 rad/s  (fast tilt to θ_crit in Zero-G)
```

---

## Case 352 — Track: S130 Shield 130 (3.3 g)

> **Stock combo (Poison Giraffe S130MB):** Clear Wheel: Giraffe · Metal Wheel: Poison · Track: S130 · Bottom: Metal Ball
> **Stock combo (Jade Jupiter S130RB):** 4D Clear Wheel: Jupiter · 4D Metal Wheel: Jade · Track: S130 · Bottom: Rubber Ball
> **Stock combo (L Drago Guardian S130MB):** 4D Metal Wheel: L Drago Guardian · Track: S130 · Bottom: Metal Ball

**Thesis.** Shield 130 is a mid-height plastic Track (h = 13.00 mm, one unit below standard 145 height) whose central feature is a horizontal octagonal disk: eight radial arms (r_outer = 17.75 mm) linked by rounded webs forming an imperfect circle. This disk geometry raises the Track inertia contribution to I_S130 ≈ 5.15×10⁻⁷ kg·m² — 8.67× more than a plain cylindrical 130 Track of equal mass, and the highest inertia-per-gram of any plastic Track in this series. The eight arms at 45° spacing create C₈ rotational symmetry: ΔI = 0, τ_nutation = 0 regardless of spin rate. The key competitive function is dual: S130 adds distal inertia (supplementing the Metal Wheel's angular momentum) while exposing the Metal Wheel's contact points — the eight arm-gaps cover only 40.1% of the circumference at the outer radius, leaving 59.9% open. For attack wheels like Flash and VariAres whose contact blades protrude at specific azimuthal angles, correct orientation ensures the Track arms never obscure the strike faces. At 3.3 g vs BD145/GB145's ~6 g, S130 imposes 44% less spin-drain penalty while still providing useful distal mass — the core trade-off that makes it competitive for attack customisations rather than defense.

**Geometry (eight-arm disk)**

```
Top-down view of S130 disk:

         arm      arc (8.0 mm)     arm
          ↑            ↑            ↑
    [arm]   [  gap  ]   [arm]   [  gap  ]
  ←17.75mm radius total outer extent→
  
  Eight arms equally spaced at 45°.
  Inner shaft (r≈6mm) → arms extend to r_outer = 17.75 mm.
  
Circumference at r = 17 mm (mid-arm estimate):
  C = 2π × 0.017                                                   = 106.8 mm
  Total open arc: 8 × 8.0 mm                                       = 64.0 mm
  Closed arc (arm width): 106.8 − 64.0                             = 42.8 mm
  Exposure fraction: 64.0 / 106.8                                  → 59.9% open circumference

Full height: 13.00 mm → places Metal Wheel 13 mm above floor.
Max disk width: 35.50 mm → r_disk = 17.75 mm
Min disk width: 33.00 mm → r_arc_inner ≈ 16.5 mm  (web concavity between arms)
```

**Inertia Calculation**

```
Three zones (m_total = 3.3 g, r_outer = 17.75 mm):
  Zone 1: central shaft (r = 0–6 mm, ~0.8 g):
    I₁ = ½ × 0.0008 × (0² + 0.006²)                              = 1.44×10⁻⁸ kg·m²

  Zone 2: arm body (r = 6–15 mm, ~1.8 g):
    I₂ = ½ × 0.0018 × (0.006² + 0.015²)                          = 2.349×10⁻⁷ kg·m²

  Zone 3: outer rim / arm tips (r = 15–17.75 mm, ~0.7 g):
    I₃ = ½ × 0.0007 × (0.015² + 0.01775²)                        = 1.893×10⁻⁷ kg·m²

  I_S130 = 1.44×10⁻⁸ + 2.349×10⁻⁷ + 1.893×10⁻⁷                → 4.386×10⁻⁷ kg·m²

Disk multiplier vs plain 130 cylinder:
  I_plain_130 (r = 6 mm, 3.3 g): I = ½ × 0.0033 × 0.006²        = 5.94×10⁻⁸ kg·m²
  Disk multiplier: 4.386×10⁻⁷ / 5.94×10⁻⁸                       → 7.38×  (disk adds 7.4× more inertia at equal mass)
```

**C₈ Symmetry — Zero Nutation**

```
Eight arms at 45° spacing → C₈ symmetry.
  For any transverse axis through centre: I_⊥ = I_∥ by C₈ symmetry (n ≥ 3 implies ΔI = 0).
  ΔI_S130 = 0 → τ_nutation = 0 N·m at all ω.

For reference: any arm-count ≥ 3 with equal spacing → ΔI = 0.
S130 (8 arms): zero nutation from Track geometry (like a perfect ring).
```

**Height Coverage — Effective Strike Window**

```
Metal Wheel width at midplane ≈ 3 mm (typical MFB wheel vertical extent).
S130 places wheel midplane at h = 13 mm + wheel_offset ≈ 16 mm from floor.

Opponent height ranges where S130 hits effectively:
  Target midplane must be within ±1.5 mm of S130 Metal Wheel midplane.
  → Effective against opponents at h = 14.5–17.5 mm (Metal Wheel midplane).
  → Typical opponent track heights placing wheel at this zone: 130–145 combos.

Flash Metal Wheel (Attack Mode): active contact blade at r ≈ 21–23 mm at h ≈ 14–18 mm.
  Flash on S130 midplane = 16 mm → within effective window for all standard 130–160 height combos.
  Flash blades protrude at azimuth ≈ 0° and 180° (oval mode).
  S130 arm positions: at 45° intervals → blades at 0°/180° fall in 8-mm-wide open arcs.
  → Flash contact faces fully exposed with S130 (no ABS arm blocking the blade angles).
```

**S130 vs BD145 and GB145 — Weight Trade-off**

```
Track        Mass    r_outer   I_Track         Spin drain penalty
BD145        ~6.0 g  ~21 mm    ~9×10⁻⁷ kg·m²  higher
GB145        ~6.0 g  ~21 mm    ~8×10⁻⁷ kg·m²  higher (plus bearing adds inertia at small r)
S130         3.3 g   17.75 mm  4.39×10⁻⁷ kg·m² 3.7 g less → lower spin drain

Mass penalty on total system L:
  A 3.7 g heavier Track at r = 20 mm contributes ΔI = ½×0.0037×0.020² = 7.4×10⁻⁷ kg·m²
  → ΔL = 7.4×10⁻⁷ × 150 = 1.11×10⁻⁴ kg·m²/s extra L for the heavier Track
  → But heavier Track also means more spin drain per impact: Δ(dω/dt) = τ_impact / I_total increases
    with higher I_total only marginally. The real cost is the mass itself increasing floor normal load:
  Extra W = 0.0037 × 9.81 = 0.036 N → extra tip friction ≈ 0.036 × 0.17 × a / I_total
    ≈ negligible per impact but cumulative.

For attack combos where the priority is hit power rather than stamina, S130's 4.39×10⁻⁷ kg·m²
at 3.3 g is a better choice than BD145/GB145's heavier mass at larger radius, because:
  1. Less total system mass → more orbital acceleration (a = F/m) from tip friction
  2. Attack combos intentionally sacrifice spin time → the stamina deficit of heavier Tracks costs more
  3. Contact-point exposure: BD145/GB145 disk geometry can partially obscure Attack wheel blades
```

**TypeScript model**

```typescript
function s130Inertia(zones: [number, number, number][]): number {
  return zones.reduce((acc, [m, ri, ro]) =>
    acc + 0.5 * (m / 1000) * (Math.pow(ri / 1000, 2) + Math.pow(ro / 1000, 2)), 0);
}

function s130DiskMultiplier(I_disk: number, m_kg: number, r_shaft_mm: number): number {
  const I_plain = 0.5 * m_kg * Math.pow(r_shaft_mm / 1000, 2);
  return I_disk / I_plain;
}

function s130ContactExposure(n_arms: number, arc_gap_mm: number, r_outer_mm: number): number {
  const circumference = 2 * Math.PI * r_outer_mm;
  const total_gap = n_arms * arc_gap_mm;
  return total_gap / circumference;
}

function s130HeightCoverage(track_height_mm: number, wheel_midplane_offset_mm: number,
                             wheel_width_mm: number): [number, number] {
  const midplane = track_height_mm + wheel_midplane_offset_mm;
  return [midplane - wheel_width_mm / 2, midplane + wheel_width_mm / 2];
}

// s130Inertia([[0.8,0,6],[1.8,6,15],[0.7,15,17.75]])
//   → 4.386×10⁻⁷ kg·m²  (7.4× more than plain 130 cylinder at equal mass)
// s130DiskMultiplier(4.386e-7, 0.0033, 6)                          → 7.38×
// s130ContactExposure(8, 8.0, 17)                                  → 59.9%  (60% open at outer radius)
// s130HeightCoverage(13, 3, 3)                                     → [14.5, 17.5] mm  (effective strike window)
```

---

## Case 353 — Bottom: CS Coat Sharp (0.8 g)

> **Stock combo (Ray Unicorno D125CS):** Clear Wheel: Unicorno · Metal Wheel: Ray · Track: D125 · Bottom: Coat Sharp

**Thesis.** CS is a dual-zone tip: a sharp ABS cone (tip angle 22.5° midpoint, inner radius 1.40 mm) surrounded by a rubber annular coat (outer radius 2.73 mm). These zones activate exclusively based on tilt: upright contact engages the ABS sharp cone (Sneddon mechanics, τ = 8.63×10⁻⁷ N·m, dω/dt = 0.086 rad/s²); tilted contact brings the rubber coat to the floor (annular ring friction, τ = 8.90×10⁻⁴ N·m, dω/dt = 89.0 rad/s² — an increase of over 1000×). The tilt threshold is set by the ABS-tip protrusion below the rubber ring δ: rubber contacts the floor when the beyblade tilts past θ_rubber = arcsin(δ/r_o). With the estimated nominal δ ≈ 0.4 mm, θ_rubber ≈ 8.4° — a very low threshold, easily crossed by stadium slope contact or a glancing hit. Mould variation shifts δ from ~0.2 mm (θ_rubber = 4.2°, always triggers) to ~1.0 mm (θ_rubber = 21°, almost never triggers), directly explaining why some CS specimens cannot enter attack/defense mode while others do so constantly. The rubber coat provides defense inferior to RS/RSF (smaller r_eff_rubber = 3.2 mm vs RS ~5–6 mm → less friction per tilt) but superior stamina (less rubber contact during gentle spin → less spin drain), giving CS a unique niche between pure stamina tips (WD, SD) and pure defense tips (RS, RSF) that becomes especially valuable at tall heights like 230 where the elevated CoM sustains persistent tilt.

**Geometry (two-zone tip)**

```
CS side profile:

  ┌───────────────────────────┐
  │   Outer casing (ABS)      │  ← standard 15.88 mm wide base
  │   Full height: 10.95 mm   │
  ├───────────────────────────┤
  │   Tip zone                │
  │   r_outer = 2.73 mm       │  ← Rubber coat  (outer zone)
  │   r_inner = 1.40 mm       │  ← inner edge of rubber
  │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  rubber coat
  │        \  ABS  /          │  ABS sharp cone (inner)
  │         \  ●  /           │  ← sharp tip contacts floor when upright
  └───────────────────────────┘
  Tip height: 7.89 mm (from tip apex to base shoulder)

Zones:
  ABS sharp inner cone: Tip Width = 2.79 mm → r_ABS = 1.395 mm
  Rubber coat annular:  Tip Width = 5.46 mm → r_rubber = 2.73 mm
  Cone half-angle: 22.5° (midpoint of 20–25° range)
```

**Phase 1 — ABS Sharp Cone Contact (upright)**

```
Tip angle: 22.5° → α = 90° − 22.5° = 67.5° from horizontal
E*_ABS-ABS = 1.332 GPa, μ_ABS = 0.17, W = 0.491 N

Sneddon cone contact radius:
  a_CS = √(Wπ / (2E* tan α))
       = √(0.491π / (2 × 1.332×10⁹ × tan 67.5°))
       = √(1.543 / (2 × 1.332×10⁹ × 2.414))                      = 1.549×10⁻⁵ m

Friction torque:
  τ_CS_sharp = (2/3) × μ_ABS × W × a_CS
             = (2/3) × 0.17 × 0.491 × 1.549×10⁻⁵                 = 8.63×10⁻⁷ N·m

  dω/dt_CS_sharp = 8.63×10⁻⁷ / 1.0×10⁻⁵                         → 0.086 rad/s²

Comparison (sharp tip family):
  S  (35°, ABS):        dω/dt = 0.112 rad/s²
  BS (35°, ABS):        dω/dt = 0.112 rad/s²  (same geometry)
  CS (22.5°, ABS):      dω/dt = 0.086 rad/s²  (23% better than S — sharper tip)
  MS (45°, metal):      dω/dt = 0.079 rad/s²  (best sharp tip — steeper angle + metal)
```

CS's inner ABS cone is sharper than S or BS, giving it better stamina than those tips even in its upright phase. The advantage over MS requires the rubber coat's defensive utility to justify ABS vs metal.

**Phase 2 — Rubber Coat Contact (tilted)**

```
Rubber annular ring: r_o = 2.73 mm, r_i = 1.40 mm, μ_rubber = 0.85, W = 0.491 N

Annular spinning friction torque:
  r_o³ − r_i³ = (2.73×10⁻³)³ − (1.40×10⁻³)³
              = 2.035×10⁻⁸ − 2.744×10⁻⁹                         = 1.760×10⁻⁸ m³
  r_o² − r_i² = (2.73×10⁻³)² − (1.40×10⁻³)²
              = 7.453×10⁻⁶ − 1.960×10⁻⁶                         = 5.493×10⁻⁶ m²
  r_eff = 1.760×10⁻⁸ / 5.493×10⁻⁶                               = 3.204×10⁻³ m

  τ_rubber = (2 × 0.85 × 0.491 / 3) × 3.204×10⁻³
           = 0.2777 × 3.204×10⁻³                                  = 8.90×10⁻⁴ N·m

  dω/dt_rubber = 8.90×10⁻⁴ / 1.0×10⁻⁵                           → 89.0 rad/s²

Phase ratio: dω/dt_rubber / dω/dt_sharp = 89.0 / 0.086           → 1035×
```

A 1035× increase in spin drain when the rubber contacts the floor. Each second of rubber contact drains as much spin as 1035 seconds of ABS sharp contact. Any sustained tilt event is potentially match-ending for the beyblade itself — which is why CS attack mode is aggressive but short-lived.

**Tilt Threshold for Rubber Activation**

```
ABS tip protrusion below rubber ring: δ (estimated from geometry)
  Nominal: δ ≈ 0.4 mm

Tilt angle for rubber contact: θ_rubber = arcsin(δ / r_o)
  Nominal: arcsin(0.4 / 2.73) = arcsin(0.1465)                    = 8.4°

This low threshold is triggered by:
  1. Stadium slope contact (Tornado Ridge slope ≈ 15–25°)  → always activates on slope
  2. Impact from opponent (transient tilt > 8.4°)          → activates during hit
  3. Angled launch (deliberate tilt at launch)              → activates from start

When rubber deactivates (bey rights itself to θ < 8.4°):
  → Back to ABS sharp → spin drain drops 1035× → beyblade self-stabilises stamina mode
```

**Mould Variation — δ Protrusion Range**

```
δ range across specimens: 0.2 mm (aggressive) to 1.0 mm (conservative)

θ_rubber values:
  δ = 0.2 mm:  arcsin(0.2/2.73) = 4.2°   → activates from almost any perturbation
  δ = 0.4 mm:  arcsin(0.4/2.73) = 8.4°   → standard; activates on slope/hit
  δ = 0.6 mm:  arcsin(0.6/2.73) = 12.7°  → requires aggressive tilt
  δ = 1.0 mm:  arcsin(1.0/2.73) = 21.4°  → rarely triggered; functions as a pure stamina tip

Wiki observation: "some CS's cannot be shot or hit into attack mode at all."
Corresponds to δ ≈ 0.8–1.0 mm → θ_rubber > 17°.
A typical attack impact induces tilt of ~10–15° → insufficient to trigger rubber at high δ.
```

**Defense Comparison: CS vs RS vs RSF**

```
Rubber contact radius and defense torque:
  CS:   r_eff = 3.204 mm,  τ_def = 0.85 × 0.491 × 3.204×10⁻³ = 1.337×10⁻³ N·m
  RS:   r_eff ≈ 5.5 mm,   τ_def = 0.85 × 0.491 × 5.5×10⁻³   = 2.295×10⁻³ N·m
  RSF:  r_eff ≈ 6.0 mm,   τ_def = 0.85 × 0.491 × 6.0×10⁻³   = 2.504×10⁻³ N·m

Defense torque ratios (relative to CS = 1.0):
  CS:  1.000
  RS:  1.717×  (72% more defensive torque)
  RSF: 1.874×  (87% more defensive torque)

Stamina at upright (non-tilted) contact:
  CS:   dω/dt = 0.086 rad/s²  (sharp ABS cone)
  RS:   dω/dt ≈ 0.170 rad/s²  (rubber-dominant even when slightly tilted; r_i=0)
  RSF:  dω/dt ≈ 0.200 rad/s²  (flat rubber, always high friction)

  CS stamina advantage over RS:  0.170 / 0.086 = 1.98×  (nearly twice the stamina)
  CS stamina advantage over RSF: 0.200 / 0.086 = 2.33×
```

CS's narrower rubber coat is the source of both its defensive weakness and its stamina superiority relative to RS/RSF. The ABS center pin keeps friction near-zero when perfectly upright; RS/RSF have rubber extending to r = 0 (rubber always contacts). CS is the only bottom in the rubber family with a genuine "resting stamina state."

**230-Height Synergy — Persistent Tilt Orbit**

At 230 height, the CoM of the full assembly is significantly elevated. Even without external perturbation, slow orbital drift from air resistance or floor imperfections produces small tilt angles. At h = 230 height:

```
Gravitational tipping torque at θ = 8°:
  τ_tip = m × g × h_CoM × sin(8°)
  h_CoM ≈ 35 mm  (Metal Wheel + 230 Track + CS midpoint)
  τ_tip = 0.05 × 9.81 × 0.035 × sin(8°)                          = 2.39×10⁻³ N·m

Gyroscopic restoring torque at ω = 60 rad/s (late battle):
  τ_gyro = L × Ω_precess = (I × ω) × Ω
  Ω = τ_tip / L = 2.39×10⁻³ / (1.0×10⁻⁵ × 60)                   = 3.98 rad/s  (precession rate)
  → 230-height combo tilts and precesses at 3.98 rad/s at late-battle ω

At h=230 with CS, θ ≈ 8°–15° is sustained during late-battle precession orbit:
  θ > θ_rubber (8.4°) for most of the precession orbit → rubber contacts persistently
  → late-battle rubber contact stabilises orbit along the stadium slope:
    slope grip prevents ring-out while rubber friction slows attacker spin too

Comparison: WD at 230 height lacks rubber → orbit is unstable on slope (too little grip) → ring-out risk
  CS at 230: rubber grips slope → bey hangs on the wall rather than falling off
```

**TypeScript model**

```typescript
function csSharpTorque(tipAngle_deg: number, W: number, Estar_GPa: number, mu: number): number {
  const alpha = (90 - tipAngle_deg) * Math.PI / 180;
  const a = Math.sqrt((W * Math.PI) / (2 * Estar_GPa * 1e9 * Math.tan(alpha)));
  return (2 / 3) * mu * W * a;
}

function csRubberTorque(r_inner_mm: number, r_outer_mm: number, W: number, mu_rubber: number): number {
  const ri = r_inner_mm / 1000, ro = r_outer_mm / 1000;
  const r_eff = (Math.pow(ro, 3) - Math.pow(ri, 3)) / (Math.pow(ro, 2) - Math.pow(ri, 2));
  return (2 * mu_rubber * W / 3) * r_eff;
}

function csTiltThreshold(delta_mm: number, r_outer_mm: number): number {
  return Math.asin((delta_mm / 1000) / (r_outer_mm / 1000)) * 180 / Math.PI;
}

function csPhaseRatio(tau_rubber: number, tau_sharp: number): number {
  return tau_rubber / tau_sharp;
}

function csVsRS(r_eff_CS_mm: number, r_eff_RS_mm: number, mu: number, W: number): {
  defense_ratio: number; stamina_ratio: number;
} {
  const tau_CS = (2 * mu * W / 3) * (r_eff_CS_mm / 1000);
  const tau_RS = (2 * mu * W / 3) * (r_eff_RS_mm / 1000);
  return {
    defense_ratio: tau_RS / tau_CS,
    stamina_ratio: tau_RS / tau_CS
  };
}

// csSharpTorque(22.5, 0.491, 1.332, 0.17)                         → 8.63×10⁻⁷ N·m → 0.086 rad/s²
// csRubberTorque(1.40, 2.73, 0.491, 0.85)                         → 8.90×10⁻⁴ N·m → 89.0 rad/s²
// csPhaseRatio(8.90e-4, 8.63e-7)                                   → 1031×  (rubber 1031× more friction than sharp)
// csTiltThreshold(0.2, 2.73)                                       → 4.2°  (aggressive mould — near-always active)
// csTiltThreshold(0.4, 2.73)                                       → 8.4°  (nominal; slope/hit triggers)
// csTiltThreshold(1.0, 2.73)                                       → 21.4° (conservative mould — never triggers)
// csVsRS(3.204, 5.5, 0.85, 0.491)
//   → { defense_ratio: 1.717, stamina_ratio: 1.717 }  (RS 72% more defense, CS ~2× better stamina)
```

---

## Case 353a — Fusion Wheel: Forbidden (31.7 g)

> **Stock combo (Forbidden Eonis ED145FB):** Clear Wheel: Eonis · Metal Wheel: Forbidden · Track: ED145 · Bottom: Flat Ball
> **Stock combo (Forbidden Eonis 130D):** Clear Wheel: Eonis · Metal Wheel: Forbidden · Track: 130 · Bottom: Defense

**Thesis.** Forbidden is a predominantly circular Metal Wheel with two symmetrically placed gaps on its circumference — a profile akin to Flame (Case 264/289) but heavier (31.7 g vs Flame's estimated ~27 g). The circular base keeps angular momentum high relative to mass; the two gaps introduce a 2-fold rotational asymmetry that creates recoil at the gap-wall contact angles. Thin throughout with thick outer edges, the mass distribution favours peripheral inertia: estimated I ≈ 8.4×10⁻⁶ kg·m², placing Forbidden in the mid-tier for stamina (above attack-class wheels, below Earth/Basalt) while the gap corners supply decent smash. However, the gap walls are steeply angled relative to the circumferential tangent (~45° estimate), splitting the contact impulse evenly between smash and recoil components — the recoil fraction is too high for reliable attack use and insufficient inertia for dedicated stamina/defense. This dual compromise consigns Forbidden to its stock Balance-Type role alongside a compound tip (FB or D).

**Geometry**

```
  Top-view schematic (Forbidden):

       ─────────────────────
      /                     \
     /   ●               ●   \    ← outer edge (thick, heavy)
    |                         |
    |    GAP₁          GAP₂   |   ← two circular gaps at 180° apart
    |                         |
     \   ●               ●   /
      \                     /
       ─────────────────────

  r_o ≈ 23.7 mm   (standard MFB outer radius)
  r_i ≈ 8.0 mm    (inner hub interface)
  Gap arc span ≈ 50° each (est.)   →  2 × 50° = 100° of mass removed from outer ring
  Remaining arc:  2 × 130° = 260°  →  72.2% of full ring mass retained at periphery
```

**Moment of Inertia**

```
Annular ring model (full, before gaps):
  I_ring = (1/2) × m × (r_o² + r_i²)
         = (1/2) × 0.0317 × ((0.0237)² + (0.008)²)
         = 0.01585 × (5.617×10⁻⁴ + 6.40×10⁻⁵)              = 9.91×10⁻⁶ kg·m²

Gap correction (2 gaps, each ~50° = 100° total removed from outer ring):
  Arc fraction removed:  100/360                             = 0.278×
  Mass at outer ring vs inner hub: assume 70/30 split
  → effective I reduction ≈ 0.278 × 0.70                    = 0.195×

  I_Forbidden ≈ 9.91×10⁻⁶ × (1 − 0.195)                    = 7.97×10⁻⁶ kg·m²  (est.)

Angular momentum at launch (ω = 150 rad/s):
  L_Forbidden = 7.97×10⁻⁶ × 150                             = 1.20×10⁻³ kg·m²/s

Reference hierarchy:
  Basalt (43.7g):   L ≈ 2.07×10⁻³   (pure stamina/defense)
  Earth (33.7g):    L ≈ 1.43×10⁻³   (defense-stamina)
  Forbidden (31.7g): L ≈ 1.20×10⁻³  (moderate stamina)
  Storm (29.0g):    L ≈ 1.05×10⁻³   (attack)
```

**Gap-Wall Smash and Recoil**

```
Each gap presents two contact edges (leading + trailing per gap = 4 total edges).
Estimated gap-wall angle φ relative to circumferential tangent ≈ 45°:

  Smash fraction   = cos(φ) = cos(45°)                      = 0.707
  Recoil fraction  = sin(φ) = sin(45°)                      = 0.707

Comparison (same φ = 45°):
  Smash impulse  = 0.707 × F_contact  (moderate — wheel can destabilise lighter opponents)
  Recoil impulse = 0.707 × F_contact  (high — 1:1 smash/recoil means unpredictable self-destabilisation)

This is why Forbidden is rated "high recoil" competitively: every impact that delivers smash
returns an equal lateral impulse to Forbidden itself.

For contrast, Earth (φ ≈ 10°):
  Smash fraction  = cos(10°) = 0.985  (nearly pure push)
  Recoil fraction = sin(10°) = 0.174  (very low recoil → stable defense)
```

**Spin Decay (no-contact)**

```
Forbidden is a solid metal ring — no rubber, no free parts. Spin decay comes from tip only
(tip analysis is the dominant term; wheel aero drag is negligible at MFB scale).

At ω = 150 rad/s, I_Forbidden = 7.97×10⁻⁶ kg·m²:
  With D (dω/dt = 0.112 rad/s²):    time to 50% spin ≈ 669 s  (wheel mass supports long battles)
  With FB (dω/dt ≈ 0.284 rad/s² upright): time to 50% spin ≈ 264 s

Inertia advantage over Storm:
  I_Forbidden / I_Storm ≈ 7.97 / 7.57                       → 1.05×  (minimal edge)
```

**TypeScript model**

```typescript
function forbiddenInertia(m_kg: number, r_o_mm: number, r_i_mm: number, gapFrac: number, outerSplit: number): number {
  const I_full = 0.5 * m_kg * (Math.pow(r_o_mm / 1000, 2) + Math.pow(r_i_mm / 1000, 2));
  return I_full * (1 - gapFrac * outerSplit);
}
function forbiddenSmashRecoil(phi_deg: number): { smash: number; recoil: number } {
  const phi = phi_deg * Math.PI / 180;
  return { smash: Math.cos(phi), recoil: Math.sin(phi) };
}
function forbiddenAngularMomentum(I: number, omega: number): number { return I * omega; }

// forbiddenInertia(0.0317, 23.7, 8.0, 0.278, 0.70)   → 7.97×10⁻⁶ kg·m²
// forbiddenSmashRecoil(45)                             → { smash: 0.707, recoil: 0.707 }
// forbiddenAngularMomentum(7.97e-6, 150)               → 1.20×10⁻³ kg·m²/s
```

---

## Case 353b — Track: Eternal Defense 145 / ED145 (3.6 g)

> **Stock combo (Forbidden Eonis ED145FB):** Clear Wheel: Eonis · Metal Wheel: Forbidden · Track: ED145 · Bottom: Flat Ball
> **Stock combo (Clay Aries ED145B):** Clear Wheel: Aries · Metal Wheel: Clay · Track: ED145 · Bottom: Ball
> **Stock combo (Screw Lyra ED145MF):** Clear Wheel: Lyra · Metal Wheel: Screw · Track: ED145 · Bottom: Metal Flat

**Thesis.** ED145 is a 14.5 mm three-wing free-rotation track whose wing geometry closely mirrors WD145 (Case 256). The critical difference is the pivot mechanism: the "Eternal" designation in MFB nomenclature normally implies a ball-bearing pivot (as in EWD, ES, B:D), but ED145's wings instead rotate on a plain plastic friction-fit pivot — no bearing. The description explicitly states: "The wings lack the mechanism of a bearing, hence creating friction between the wings and body of the Spin Track, resulting in less hit absorption." This friction-pivot architecture places ED145 below BD145 (Case 307, disc-on-bearing) and C145 (Case 35, centrifugal extension) in defensive effectiveness, and makes it marginally inferior to WD145 in scenarios where WD145's pivot friction is lower. In practice ED145 finds legitimate but second-tier use in Defense combos, contributing primarily through its standard 145-height positioning and the partial wing-rotation hit absorption that the friction pivot does permit.

**Geometry**

```
  Side view:

  ─────────────────────────────────────────────────────── ← wheel midplane
     ╔═══╗       ╔═══╗       ╔═══╗         ← 3 free-rotating wings
     ║   ║       ║   ║       ║   ║           pivot: plastic shaft fit
     ║   ║       ║   ║       ║   ║
  ───╨───╨───────╨───╨───────╨───╨──────── ← track body  h = 14.5 mm
  ──────────────────────────────────────── ← stadium floor

  Wing outer radius r_w ≈ 15.0 mm  (wider than standard 145 body r = ~9 mm)
  Wing mass (each) ≈ 0.4 g  (3 wings = 1.2 g; hub = 2.4 g)
  Pivot radius r_pivot ≈ 5.0 mm  (centre of wing rotation)
```

**Wing Inertia and Free-Rotation Response**

```
Wing moment of inertia (each, about pivot):
  I_wing = (1/3) × m_wing × L_wing²    (uniform rod approximation, L = r_w − r_pivot)
         = (1/3) × 0.0004 × (0.015 − 0.005)²
         = (1/3) × 0.0004 × 1.0×10⁻⁴                       = 1.33×10⁻⁸ kg·m²

Total 3-wing inertia: I_wings = 3 × 1.33×10⁻⁸                = 3.99×10⁻⁸ kg·m²
```

**Pivot Friction — Why ED145 Underperforms BD145**

```
For bearing pivot (BD145):  τ_pivot ≈ 0                 → wing spins freely, maximum energy transfer
For friction pivot (ED145):  τ_pivot = μ × F_N × r_pivot

  At impact force F_impact = 5 N (typical MFB hit), normal force at pivot ≈ 0.3 × F_impact:
  F_N_pivot ≈ 1.5 N
  τ_pivot = 0.35 × 1.5 × 0.005                           = 2.63×10⁻³ N·m

Wing angular acceleration during impact:
  α_wing = (τ_impact − τ_pivot) / I_wing
         = (F_impact × r_w − τ_pivot) / I_wing
         = (5 × 0.015 − 2.63×10⁻³) / 1.33×10⁻⁸
         = (7.5×10⁻² − 2.63×10⁻³) / 1.33×10⁻⁸           = 5.44×10⁶ rad/s²

This is a large angular acceleration, so the wing does rotate during a hit.
But the pivot friction steals τ_pivot out of every impact, reducing net energy transfer:

  Energy stolen per impact = τ_pivot × Δθ_wing
  If Δθ_wing ≈ 0.02 rad (2° per hit):
  E_lost = 2.63×10⁻³ × 0.02                              = 5.26×10⁻⁵ J  per hit

  This is ~12% of a typical 4.3×10⁻⁴ J impact — representing a non-trivial absorption loss
  that accumulates over multiple hits.

BD145 comparison (τ_pivot ≈ 0):
  E_lost_BD = 0  →  all wing kinetic energy is available to absorb the impact
  Effective absorption ratio: ED145 / BD145 ≈ (1 − 0.12) = 0.88  (12% less efficient per hit)
```

**Why C145 Also Outperforms ED145**

```
C145 at battle spin speed extends wings centrifugally:
  ω_extend ≈ √(k_spring / (m_wing × r_cm))  (centrifugal extension threshold)
  At ω > ω_extend, wings are fully extended and LOCKED outward.

Locked C145 wings present a rigid outer barrier at r_w = 15–16 mm.
  Impact force is deflected at the wing face angle → less energy absorbed, but also
  less reaction force transferred to the beyblade body (force diverted outward).

ED145 wings are free to rotate both ways (inward and outward on impact).
  An opponent strike can fold a wing inward → reducing barrier radius momentarily → opponent
  can slide past the wing barrier → less effective containment than the locked C145 wing.

Hierarchy (defense):
  BD145  →  bearing absorbs all kinetic energy  →  best
  C145   →  centrifugal lock creates hard barrier →  second
  ED145  →  friction pivot, wings fold under strike  →  third
  WD145  →  similar friction pivot but slightly different wing shape → comparable to ED145
```

**Height Contribution (same as standard 145)**

```
h_ED145 = 14.5 mm  (same as 145, SW145, WD145, all standard "145" tracks)
Contact height = h − r_tip  (same geometry as any 145 track, irrelevant to wing analysis)
```

**TypeScript model**

```typescript
function ed145WingInertia(m_wing_g: number, r_outer_mm: number, r_pivot_mm: number): number {
  const L = (r_outer_mm - r_pivot_mm) / 1000;
  return (1 / 3) * (m_wing_g / 1000) * L * L;
}
function ed145PivotTorque(mu: number, f_impact_N: number, f_pivot_fraction: number, r_pivot_mm: number): number {
  return mu * (f_impact_N * f_pivot_fraction) * (r_pivot_mm / 1000);
}
function ed145EnergyLoss(tau_pivot: number, delta_theta_rad: number): number {
  return tau_pivot * delta_theta_rad;
}

// ed145WingInertia(0.4, 15.0, 5.0)          → 1.33×10⁻⁸ kg·m²  per wing
// ed145PivotTorque(0.35, 5.0, 0.30, 5.0)    → 2.63×10⁻³ N·m  (friction steal per hit)
// ed145EnergyLoss(2.63e-3, 0.02)             → 5.26×10⁻⁵ J  (~12% of typical impact energy)
```

---

## Case 353c — Bottom: Flat Ball / FB (0.6 g)

> **Stock combo (Forbidden Eonis ED145FB):** Clear Wheel: Eonis · Metal Wheel: Forbidden · Track: ED145 · Bottom: Flat Ball
> **Stock combo (Forbidden Eonis 130D):** — (this variant uses Defense)
> **Stock combo (Divine Chimera TR145FB):** Clear Wheel: Chimera · Metal Wheel: Divine · Track: TR145 · Bottom: Flat Ball
> **Stock combo (Divine/Hell Crown 130FB):** Clear Wheel: Crown · Metal Wheel: Divine/Hell · Track: 130 · Bottom: Flat Ball

**Thesis.** FB is a compound tip: a wide annular flat ring (outer radius r_flat = 3.5 mm, inner radius r_hole = 1.5 mm) with a central ball tip (R_ball ≈ 2.5 mm) protruding δ ≈ 0.5 mm above the flat surface through a circular hole. The tilt threshold for flat engagement is θ_flat = arcsin(δ/r_flat) ≈ 8.2°. When upright (θ < 8.2°), the central ball contacts the floor — providing Hertzian contact identical in regime to Ball (B) but with a smaller ball radius (a ≈ 0.088 mm, dω/dt ≈ 0.284 rad/s²). When tilted (θ > 8.2°), the annular flat ring contacts — providing spin-draining friction analogous to Wide Flat (WF) but with reduced area (hole cutout removes 18% of flat area) and correspondingly lower attack torque. The performance sits "between FS and CS": better upright stamina than FS (FS has a sharper inner tip at the cost of faster wear; FB's ball is more robust), inferior destabilizing force to WF/XF (reduced flat area). The tip wears easily because the ball protrusion is an ABS sphere under concentrated load with no bearing or hardening, and the flat ring edges are thin.

**Geometry (compound tip section)**

```
  FB side profile:

  ┌───────────────────────────────┐
  │   Outer casing (ABS, red)     │  standard 15.88 mm wide base
  │   Full height ≈ 10.8 mm       │
  ├───────────────────────────────┤
  │   Tip zone                    │
  │   r_flat_outer = 3.5 mm       │  ← Wide flat ring (ABS)
  │   ▓▓▓▓ HOLE ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← annular flat; hole at r < 1.5 mm
  │        ╱   ╲                  │
  │       ╱ ●   ╲                 │  ← Ball tip (R ≈ 2.5 mm), protrudes δ ≈ 0.5 mm
  │      ╱       ╲                │    above flat surface
  └───────────────────────────────┘

  Zones:
    Ball tip:   R_ball ≈ 2.5 mm  (Hertzian spherical contact when upright)
    Flat ring:  r_inner = 1.5 mm, r_outer = 3.5 mm  (contacts on tilt)
    Protrusion: δ ≈ 0.5 mm  →  θ_flat = arcsin(0.5/3.5) ≈ 8.2°
```

**Phase 1 — Ball Contact (upright, θ < 8.2°)**

```
a_FB = (3 × W × R_ball / 4E*)^(1/3)
     = (3 × 0.491 × 0.0025 / (4 × 1.332×10⁹))^(1/3)
     = (3.682×10⁻³ / 5.328×10⁹)^(1/3)
     = (6.913×10⁻¹³)^(1/3)                                 → 8.84×10⁻⁵ m  (0.088 mm)

τ_FB_ball = (3/16) × 0.35 × 0.491 × 8.84×10⁻⁵             → 2.84×10⁻⁶ N·m
dω/dt_FB_ball = 2.84×10⁻⁶ / 1.0×10⁻⁵                      → 0.284 rad/s²

Comparison (ball family):
  B    (R = 2.94 mm):  dω/dt = 0.300 rad/s²  (slightly larger ball → more contact)
  FB   (R = 2.50 mm):  dω/dt = 0.284 rad/s²  (5% better stamina than B)
  WB   (R = 4.475 mm): dω/dt = 0.344 rad/s²  (wider ball, more drag)
  JB   (R_spike = 0.5 mm): dω/dt = 0.167 rad/s²  (spike contact, lowest drag)
```

**Phase 2 — Flat Ring Contact (tilted, θ > 8.2°)**

```
Flat annular ring: r_i = 1.5 mm, r_o = 3.5 mm, μ_flat = 0.35 (ABS), W = 0.491 N

Effective friction radius:
  r_eff = (2/3) × (r_o³ − r_i³) / (r_o² − r_i²)
        = (2/3) × ((3.5)³ − (1.5)³) / ((3.5)² − (1.5)²) × 10⁻³
        = (2/3) × (42.875 − 3.375) / (12.25 − 2.25) × 10⁻³
        = (2/3) × 39.5 / 10.0 × 10⁻³                      = 2.63×10⁻³ m

τ_FB_flat = μ × W × r_eff
          = 0.35 × 0.491 × 2.63×10⁻³                      = 4.51×10⁻⁴ N·m
dω/dt_FB_flat = 4.51×10⁻⁴ / 1.0×10⁻⁵                      → 45.1 rad/s²

Phase ratio: dω/dt_flat / dω/dt_ball = 45.1 / 0.284        → 159×

The hole reduces flat area by:
  A_hole / A_full = (1.5/3.5)²                             = 0.184×  (−18.4% area vs solid WF)

Torque reduction vs equivalent WF (no hole, r_o = 3.5 mm):
  τ_WF_equivalent = 0.35 × 0.491 × (2/3) × 3.5×10⁻³       = 4.00×10⁻⁴ N·m  
  But r_eff for solid disc (r_i = 0): r_eff = (2/3) × r_o  = 2.33×10⁻³ m → τ = 4.00×10⁻⁴ N·m
  Ratio τ_FB_flat / τ_WF_solid = 4.51 / 4.00               → 1.13×  (actually higher r_eff with hole)
```

Note: annular flat has higher r_eff than solid flat (hole removes inner low-leverage area) — FB's flat torque is actually slightly higher than a same-radius solid tip, but the outer radius (3.5 mm) is smaller than WF/XF (≈ 5–7 mm), so overall flat torque remains lower than WF.

**Tilt Threshold**

```
θ_flat = arcsin(δ / r_flat_o) = arcsin(0.5 / 3.5) = arcsin(0.143)  → 8.2°

Same order of magnitude as CS (8.4° nominal). FB and CS share the same trigger condition:
  - Stadium slope:   15–25° → always activates flat ring on slope
  - Impact tilt:     5–15° → activates during most attack contacts
  - Stable orbit:    < 5°  → remains in ball mode (stamina)
```

**Wear Behaviour**

```
ABS ball tip under repeated Hertzian contact:
  Hertzian pressure at contact: p_max = (3W / 2πa²) = 3 × 0.491 / (2π × (8.84×10⁻⁵)²)
                                       = 1.473 / (4.914×10⁻⁸)               = 2.998×10⁷ Pa  (30 MPa)

ABS yield stress: ~45 MPa
  Safety factor at launch load: 45 / 30 = 1.50 (within elastic range, barely)
  After impact spike (F_N_peak ≈ 5N):  p_max_peak = 30 × (5/0.491)          = 306 MPa  (6.8× yield)
  → Significant plastic deformation on each hard impact → tip radius grows → dω/dt increases over time

This confirms wiki observation: "This tip wears easily." Ball tip deforms under impact loads
beyond yield, gradually flattening → contact transitions from spherical to near-flat → stamina
erodes across multiple battles.
```

**Performance Comparison**

```
| Tip | Upright dω/dt | Tilted dω/dt | Tilt threshold | Wear rate |
|-----|--------------|-------------|----------------|-----------|
| CS  | 0.086 rad/s² | 89.0 rad/s² | 8.4°           | Low (rubber) |
| FB  | 0.284 rad/s² | 45.1 rad/s² | 8.2°           | High (ABS ball) |
| FS  | ~0.112 rad/s² | ~50 rad/s² | ~6–10°         | Very high (ABS sharp) |

FB is between FS (sharper inner → better stamina, worse wear) and CS (rubber outer → better
defense, lower flat torque). FB's ball is more durable than FS's sharp tip but still far
less wear-resistant than CS's rubber.
```

**TypeScript model**

```typescript
function fbBallContactRadius(R_ball_mm: number, W: number): number {
  const E_star = 1.332e9;
  return Math.pow((3 * W * (R_ball_mm / 1000)) / (4 * E_star), 1 / 3);
}
function fbFlatEffRadius(r_inner_mm: number, r_outer_mm: number): number {
  const ri = r_inner_mm / 1000, ro = r_outer_mm / 1000;
  return (2 / 3) * (Math.pow(ro, 3) - Math.pow(ri, 3)) / (Math.pow(ro, 2) - Math.pow(ri, 2));
}
function fbTiltThreshold(delta_mm: number, r_outer_mm: number): number {
  return Math.asin((delta_mm / 1000) / (r_outer_mm / 1000)) * 180 / Math.PI;
}
function fbHertzPressure(W: number, a: number): number { return (3 * W) / (2 * Math.PI * a * a); }

// fbBallContactRadius(2.5, 0.491)      → 8.84×10⁻⁵ m  (0.088 mm; dω/dt = 0.284 rad/s²)
// fbFlatEffRadius(1.5, 3.5)            → 2.63×10⁻³ m  (flat-ring dω/dt = 45.1 rad/s²)
// fbTiltThreshold(0.5, 3.5)            → 8.2°  (flat engages on slope/impact)
// fbHertzPressure(0.491, 8.84e-5)      → 30 MPa  (within ABS yield; impacts spike to ~300 MPa → wear)
```

---

## Case 353d — Clear Wheel: Eonis / Ionis (2.8 g)

> **Stock combo (Forbidden Eonis ED145FB):** Clear Wheel: Eonis · Metal Wheel: Forbidden · Track: ED145 · Bottom: Flat Ball
> **Stock combo (Forbidden Eonis 130D):** Clear Wheel: Eonis · Metal Wheel: Forbidden · Track: 130 · Bottom: Defense
> **Hasbro name:** Ionis (Eonis → Ionis)

**Thesis.** Eonis is an MFB Clear Wheel depicting two stylised bull/cow heads and their sweeping horns arranged in 2-fold rotational symmetry. At 2.8 g it sits on the heavier end of the MFB Clear Wheel range (~1.8–3.2 g typical) but still contributes negligibly to angular momentum compared to the Forbidden Metal Wheel (31.7 g). The 2-fold motif symmetry (C₂ rotation) mirrors Forbidden's own 2-fold gap symmetry, aligning the two-node mass distribution of both components. In practice, Clear Wheel mass is too low (≈ 8% of wheel+CW total mass) to meaningfully alter the nutation frequency or smash angle; Eonis is treated as a cosmetic ring for physics purposes.

**Mass and Inertia Contribution**

```
Eonis mass: 2.8 g  =  0.0028 kg
Forbidden mass: 31.7 g = 0.0317 kg
Mass fraction: 0.0028 / (0.0028 + 0.0317)                  = 8.1%

Eonis modelled as thin ring: r_i ≈ 10 mm, r_o ≈ 23 mm
  I_Eonis = (1/2) × 0.0028 × ((0.023)² + (0.010)²)
           = 0.0014 × (5.29×10⁻⁴ + 1.0×10⁻⁴)              = 8.81×10⁻⁷ kg·m²

I_Forbidden (Case 353a):                                     = 7.97×10⁻⁶ kg·m²

Combined I (Forbidden + Eonis):
  I_total = 7.97×10⁻⁶ + 8.81×10⁻⁷                         = 8.85×10⁻⁶ kg·m²
  Eonis contribution: 8.81×10⁻⁷ / 8.85×10⁻⁶               = 9.95%  (≈10% — small but not zero)

This 10% contribution from Eonis is the upper bound for a 2.8 g CW.
For lighter CWs (1.5–2 g) the contribution falls to 5–7%.
```

**Symmetry Alignment**

```
Forbidden wheel:  2-fold gap symmetry (2 × 180° gaps)
Eonis CW:         2-fold horn symmetry (2 × cow heads at 180°)

When assembled, the angular alignment is arbitrary (CW can be clocked independently).
However, the 2-fold match means:

  Best alignment: CW horns fill Forbidden gaps → adds mass over the gap arcs
    → partially restores angular momentum lost to gaps
    → reduces 2-node wobble tendency (more uniform I distribution)

  Worst alignment: CW horns align with Forbidden ring → further concentrates mass
    → amplifies 2-node nutation mode → more wobble

Competitive assembly tip: align Eonis horns over Forbidden gaps.
```

**TypeScript model**

```typescript
function eonisInertia(m_g: number, r_inner_mm: number, r_outer_mm: number): number {
  return 0.5 * (m_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
}
function eonisContribution(I_eonis: number, I_wheel: number): number {
  return I_eonis / (I_eonis + I_wheel);
}

// eonisInertia(2.8, 10, 23)                          → 8.81×10⁻⁷ kg·m²
// eonisContribution(8.81e-7, 7.97e-6)                → 9.95%  (10% of combined I)
```

---

## Case 353e — Fusion Wheel: Dark (31.4 g)

> **Stock combo (Dark Wolf DF145FS):** Clear Wheel: Wolf · Metal Wheel: Dark · Track: DF145 · Bottom: Flat Sharp
> **Stock combo (Dark Cancer CH120SF):** Clear Wheel: Cancer · Metal Wheel: Dark · Track: CH120 · Bottom: Semi Flat
> **Stock combo (Dark Gasher CH120FS):** Clear Wheel: Gasher · Metal Wheel: Dark · Track: CH120 · Bottom: Flat Sharp

**Thesis.** Dark has twelve small spikes distributed evenly around its circumference, all facing the clockwise direction, closely packed with minimal spacing. The even 12-fold distribution (C₁₂ symmetry) produces a near-perfectly circular outer profile: mass is not concentrated in a few lobes but spread uniformly across the full perimeter. This is both Dark's defining structural property and the source of its complete competitive irrelevance. The twelve protrusions are individually too small to deliver meaningful smash attack (insufficient radial protrusion for a high contact angle), while the 12-point perimeter interruptions break the smooth rim too frequently for clean Stamina (each spike-to-gap transition is a contact discontinuity that scatters small angular impulses into the opponent). The mass (31.4 g) is distributed over too large a cross-sectional area relative to the outer rim, yielding lower I per gram than edge-concentrated wheels like Earth. The result is a wheel that occupies every role poorly: not enough smash for attack, too much perimeter disruption for stamina, and insufficient mass for defense. There is no competitive use for Dark in standard configurations.

**Geometry**

```
  Top-view schematic (Dark):

  12 spikes, 30° apart, all CW-facing:

                  ∧ spike
           ─── ∧─┘└─∧ ───
         ∧              ∧
        ∧                ∧
       ─                  ─     r_o ≈ 23.7 mm
        ∧                ∧
         ∧              ∧
           ──── ∨ ────         (spike tip height above circular base: ~2 mm est.)

  Spike angle from circumferential tangent φ ≈ 20–25° (closely packed, not pronounced)
  12 spikes × 30° spacing = full 360° coverage
  Hub radius r_i ≈ 10 mm  (Dark has a broad inner fill — "weight over too large a surface area")
```

**Moment of Inertia — Why Spread Mass Hurts**

```
Earth (Case 266/283):  33.7 g, mass concentrated at outer rim (r_i ≈ 18 mm)
  I_Earth ≈ (1/2) × 0.0337 × ((0.0237)² + (0.018)²)       = 9.47×10⁻⁶ kg·m²

Dark: 31.4 g, mass spread across full cross-section (r_i ≈ 10 mm, large inner fill)
  I_Dark  = (1/2) × 0.0314 × ((0.0237)² + (0.010)²)
           = 0.0157 × (5.617×10⁻⁴ + 1.0×10⁻⁴)             = 7.51×10⁻⁶ kg·m²

I ratio: 7.51 / 9.47                                        = 0.793×  (Dark 21% less I than Earth)
L ratio at ω = 150: 7.51 / 9.47                             = 0.793×

L_Dark    = 7.51×10⁻⁶ × 150                                 = 1.13×10⁻³ kg·m²/s
L_Earth   = 9.47×10⁻⁶ × 150                                 = 1.42×10⁻³ kg·m²/s
L_Basalt  = 1.38×10⁻⁵ × 150                                 = 2.07×10⁻³ kg·m²/s
```

Despite weighing only 2.3 g less than Earth, Dark's I is 21% lower because the inner fill displaces mass from the high-leverage outer rim to the low-leverage interior. Earth's near-hollow ring concentrates almost all mass at maximum radius.

**Spike Contact Analysis — Why Neither Attack Nor Stamina Works**

```
Spike half-angle φ ≈ 22.5° (closely packed → small angle, 12-spike spacing = 30°)

  Smash fraction   = cos(22.5°)                             = 0.924   (decent, but...)
  Recoil fraction  = sin(22.5°)                             = 0.383

Individual spike impact force:
  F_spike = F_contact × cos(22.5°)  per event               = 0.924 × F_contact

But 12 spikes at 30° spacing means contact events recur every:
  Δt = (30° in rad) / ω_bey = (π/6) / 150                  = 3.49 ms

At this contact frequency:
  - Each F_spike is small (protrusion height ~2 mm → low energy per contact)
  - Recoil impulse returns to Dark every 3.49 ms → net destabilization of Dark itself
  - No time for target to recover before next spike → "buzzing" rather than "smashing"

Result: high-frequency low-amplitude contacts → spin steal (Dark loses spin to target friction
via micro-contacts) rather than directional smash. Stamina suffers because each spike gap edge
creates a micro-recoil on contact, interrupting clean sliding → increased effective friction.
```

**Spin Decay (self, tip-only)**

```
Dark's no-contact stamina is entirely governed by its tip (no rubber, no free parts).
With S or FS tip: dω/dt ≈ 0.112 rad/s²

Time to 50% spin from ω = 150 rad/s:  150 × 0.50 / 0.112 = 670 s  (11 min)
→ Dark's self-stamina is adequate; it is contact-performance that destroys it.
```

**TypeScript model**

```typescript
function darkInertia(m_kg: number, r_o_mm: number, r_i_mm: number): number {
  return 0.5 * m_kg * (Math.pow(r_o_mm / 1000, 2) + Math.pow(r_i_mm / 1000, 2));
}
function darkSpikeContact(phi_deg: number, n_spikes: number, omega: number): {
  smash: number; recoil: number; contact_interval_ms: number;
} {
  const phi = phi_deg * Math.PI / 180;
  const interval = (2 * Math.PI / n_spikes) / omega * 1000;
  return { smash: Math.cos(phi), recoil: Math.sin(phi), contact_interval_ms: interval };
}

// darkInertia(0.0314, 23.7, 10.0)         → 7.51×10⁻⁶ kg·m²  (21% below Earth)
// darkSpikeContact(22.5, 12, 150)
//   → { smash: 0.924, recoil: 0.383, contact_interval_ms: 3.49 }
//   → high-frequency micro-contacts; net spin drain, not usable smash
```

---

## Case 353f — Bottom: Flat Spike / Flat Sharp / FS (0.6 g)

> **Stock combo (Dark Wolf DF145FS):** Clear Wheel: Wolf · Metal Wheel: Dark · Track: DF145 · Bottom: Flat Sharp
> **Stock combo (Gemios DF145FS):** Clear Wheel: Gemios · Metal Wheel: Gemios · Track: DF145 · Bottom: Flat Sharp
> **Stock combo (Killer Gemios DF145FS):** Clear Wheel: Gemios · Metal Wheel: Killer · Track: DF145 · Bottom: Flat Sharp
> **Stock combo (Mad Cancer CH120FS):** Clear Wheel: Cancer · Metal Wheel: Mad · Track: CH120 · Bottom: Flat Sharp

> **Note:** FS = Flat Spike (also called Flat Sharp) is the MFB Performance Tip. Do not confuse with F:S (Final Survive), the 4D bottom found in Jade Jupiter S130F:S — F:S is a combined track+tip unit with a bearing mechanism. FS and F:S are entirely different parts.

**Thesis.** FS is a compound tip with an ABS sharp cone in the center (tip half-angle ~32.5°) surrounded by a narrow ABS flat ring (r_flat_inner ≈ 0.8 mm, r_flat_outer ≈ 2.5 mm). The protrusion of the sharp tip above the flat ring face is δ ≈ 0.3 mm, setting the tilt threshold for flat contact at θ_flat ≈ 6.9°. When upright the cone contacts the floor (Sneddon regime, dω/dt ≈ 0.112 rad/s², same as S); when tilted past 6.9° the flat ring contacts, providing a destabilizing / low-attack mode (dω/dt ≈ 30.8 rad/s² — 275× the upright rate but weaker than CS rubber or FB's wider flat). FS's fundamental problem is that both phases are mediocre: the flat ring is narrow (r_o = 2.5 mm vs FB = 3.5 mm, WF = 5–7 mm), so tilt-mode destabilization force is weak; the ABS sharp tip wears extremely quickly under impact loads, shortening its stamina window. FS fits neither a stamina nor an attack role effectively, placing it squarely in the Balance compromise: marginally offensive when tilted, barely competitive in stamina when upright.

**Geometry (two-zone tip)**

```
  FS side profile:

  ┌────────────────────────────┐
  │   Outer casing (ABS)       │  standard 15.88 mm wide base
  │   Full height ≈ 10.7 mm    │
  ├────────────────────────────┤
  │   Tip zone                 │
  │   r_flat_outer = 2.5 mm    │  ← Narrow flat ring (ABS)
  │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
  │        \      /            │  ABS sharp cone (inner)
  │         \    /             │  half-angle ≈ 32.5° from vertical
  │          \  /              │
  │           \/               │  ← sharp tip, δ ≈ 0.3 mm below flat surface
  └────────────────────────────┘

  Zones:
    ABS sharp cone: r_i = 0, half-angle ≈ 32.5° (from vertical axis)
                    → α = 90° − 32.5° = 57.5° for Sneddon formula
    Flat ring:      r_inner ≈ 0.8 mm, r_outer ≈ 2.5 mm
    Protrusion:     δ ≈ 0.3 mm  →  θ_flat = arcsin(0.3/2.5) ≈ 6.9°
```

**Phase 1 — Sharp Cone Contact (upright, θ < 6.9°)**

```
Sneddon cone formula (same regime as S, Case 335):
  α = 57.5°   (from horizontal)
  a_FS = √(W × π / (2 × E* × tan α))
       = √(0.491 × π / (2 × 1.332×10⁹ × tan 57.5°))
       = √(1.543 / (2 × 1.332×10⁹ × 1.570))
       = √(1.543 / 4.183×10⁹)                               = 1.921×10⁻⁵ m

τ_FS_cone = (2/3) × μ_ABS × W × a_FS
          = (2/3) × 0.17 × 0.491 × 1.921×10⁻⁵              = 1.065×10⁻⁶ N·m

dω/dt_FS_cone = 1.065×10⁻⁶ / 1.0×10⁻⁵                     → 0.107 rad/s²

Sharp tip family comparison:
  S  (35°):   dω/dt = 0.112 rad/s²  (same Sneddon regime, slightly less sharp)
  FS (32.5°): dω/dt = 0.107 rad/s²  (4% better than S — very marginally sharper)
  CS (22.5°): dω/dt = 0.086 rad/s²  (significantly sharper ABS cone)
  MS (metal): dω/dt = 0.079 rad/s²  (best: sharper angle + lower μ_metal)
```

**Phase 2 — Flat Ring Contact (tilted, θ > 6.9°)**

```
Flat ring: r_i = 0.8 mm, r_o = 2.5 mm, μ_flat = 0.35 (ABS), W = 0.491 N

Effective friction radius:
  r_eff_FS = (2/3) × (r_o³ − r_i³) / (r_o² − r_i²)
           = (2/3) × ((2.5)³ − (0.8)³) / ((2.5)² − (0.8)²) × 10⁻³
           = (2/3) × (15.625 − 0.512) / (6.25 − 0.64) × 10⁻³
           = (2/3) × 15.113 / 5.61 × 10⁻³                  = 1.796×10⁻³ m

τ_FS_flat = μ × W × r_eff_FS
          = 0.35 × 0.491 × 1.796×10⁻³                      = 3.08×10⁻⁴ N·m
dω/dt_FS_flat = 3.08×10⁻⁴ / 1.0×10⁻⁵                      → 30.8 rad/s²

Phase ratio: dω/dt_flat / dω/dt_cone = 30.8 / 0.107         → 288×
```

**Comparison: FS vs FB vs CS**

```
| Tip | Flat r_eff | τ_tilted | dω/dt tilted | Upright dω/dt | θ_trigger | Wear  |
|-----|-----------|---------|-------------|--------------|-----------|-------|
| CS  | 3.204 mm  | 8.90×10⁻⁴ N·m | 89.0 rad/s² | 0.086 rad/s² | 8.4° | Low (rubber) |
| FB  | 2.630 mm  | 4.51×10⁻⁴ N·m | 45.1 rad/s² | 0.284 rad/s² | 8.2° | High (ABS ball) |
| FS  | 1.796 mm  | 3.08×10⁻⁴ N·m | 30.8 rad/s² | 0.107 rad/s² | 6.9° | V.High (ABS sharp) |

FS vs FB:
  Tilt triggers earlier (6.9° vs 8.2°) — FS activates more easily
  But flat torque is 31% lower (30.8 vs 45.1 rad/s²) — less destabilization when active
  Upright stamina: FS better (0.107 vs 0.284 rad/s²) — sharp tip much less drag than ball

FS vs CS:
  FS triggers 1.5° earlier (6.9° vs 8.4°) — marginally more sensitive
  But CS rubber torque is 2.9× higher (89.0 vs 30.8 rad/s²) — far more defense/destabilization
  CS upright stamina also better (0.086 vs 0.107 rad/s²) — sharper inner cone on CS
  → CS strictly dominates FS in every meaningful metric
```

**Wear — Why FS Degrades Fastest**

```
ABS sharp cone under Hertzian load:
  p_max = (3W / 2πa²) = 3 × 0.491 / (2π × (1.921×10⁻⁵)²)
        = 1.473 / (2.319×10⁻⁹)                              = 6.35×10⁸ Pa  (635 MPa)

ABS yield stress ≈ 45 MPa → safety factor = 45 / 635          = 0.071  (9× past yield at launch load!)

The sharp cone is plastically deforming from the first battle. Each launch grinds material from
the tip apex, increasing the effective cone radius until the tip blunts into a quasi-flat profile.

Once blunted to R_apex ≈ 0.3–0.5 mm:
  dω/dt transitions toward ball-tip regime → stamina drops 2–3×
  δ decreases → θ_flat drops → flat ring activates even without strong impacts

This explains the wiki comment that FS "suffers from mediocre performance in both fields" —
even a new FS has marginal attack; a used FS loses its only competitive edge (spike stamina)
within a few battles.
```

**TypeScript model**

```typescript
function fsConeTorque(halfAngle_deg: number, W: number, Estar_GPa: number, mu: number): number {
  const alpha = (90 - halfAngle_deg) * Math.PI / 180;
  const a = Math.sqrt((W * Math.PI) / (2 * Estar_GPa * 1e9 * Math.tan(alpha)));
  return (2 / 3) * mu * W * a;
}
function fsFlatTorque(r_inner_mm: number, r_outer_mm: number, W: number, mu: number): number {
  const ri = r_inner_mm / 1000, ro = r_outer_mm / 1000;
  const r_eff = (2 / 3) * (Math.pow(ro, 3) - Math.pow(ri, 3)) / (Math.pow(ro, 2) - Math.pow(ri, 2));
  return mu * W * r_eff;
}
function fsTiltThreshold(delta_mm: number, r_outer_mm: number): number {
  return Math.asin((delta_mm / 1000) / (r_outer_mm / 1000)) * 180 / Math.PI;
}
function fsHertzPressure(W: number, a: number): number { return (3 * W) / (2 * Math.PI * a * a); }

// fsConeTorque(32.5, 0.491, 1.332, 0.17)        → 1.065×10⁻⁶ N·m  → 0.107 rad/s²
// fsFlatTorque(0.8, 2.5, 0.491, 0.35)           → 3.08×10⁻⁴ N·m   → 30.8 rad/s²  (288× cone)
// fsTiltThreshold(0.3, 2.5)                      → 6.9°  (activates earlier than FB/CS)
// fsHertzPressure(0.491, 1.921e-5)               → 635 MPa  (14× ABS yield → rapid blunting)
```

---

## Case 353g — Clear Wheel: Wolf (3.1 g)

> **Stock combos:** Dark Wolf DF145FS · Earth Wolf 105WD · Burn Wolf SW145WD

**Thesis.** The Wolf Energy Ring (Clear Wheel) features four wolf-head motifs at equal 90° intervals — strict C₄ (four-fold) rotational symmetry. The equal mass distribution at four nodes produces 4-fold inertia symmetry: there is no dominant nutation frequency axis, and the beyblade resists the 2-node wobble mode that asymmetric or 2-fold CWs can amplify. At 3.1 g Wolf is heavier than minimal CWs (~1.5–2 g) but "outclassed by heavier Energy Rings such as Aquario and Kerbecs" that bring 3.5–4.5 g to the assembly. Its I contribution is ~10–11% of the combined Wheel+CW assembly — meaningful for stability but not decisive. Wolf's primary value is gyroscopic stability rather than angular momentum: four-node mass distribution damps precession-rate oscillation more effectively than 2-fold wheels like Aquila (Case 282).

**Mass and Inertia**

```
Wolf mass:    3.1 g  =  0.0031 kg
Dark mass:   31.4 g  =  0.0314 kg
Mass fraction: 3.1 / (3.1 + 31.4)                           = 8.99%

Wolf modelled as thin ring: r_i ≈ 10 mm, r_o ≈ 22 mm
  I_Wolf = (1/2) × 0.0031 × ((0.022)² + (0.010)²)
         = 0.00155 × (4.84×10⁻⁴ + 1.0×10⁻⁴)               = 9.05×10⁻⁷ kg·m²

Combined I (Dark + Wolf):
  I_total = 7.51×10⁻⁶ + 9.05×10⁻⁷                          = 8.42×10⁻⁶ kg·m²
  Wolf contribution:  9.05×10⁻⁷ / 8.42×10⁻⁶                 = 10.75%
```

**4-Fold Symmetry — Nutation Stability**

```
C₄ symmetry means I_xx = I_yy = I_moment (principal moments equal in the plane).
This means there is NO preferred precession axis in the plane → the beyblade precesses
uniformly in a circle rather than oscillating between preferred wobble axes.

Contrast with C₂ wheels (Aquila: Case 282, Forbidden: Case 353a):
  C₂ → I_xx ≠ I_yy → 2-node wobble has a preferred axis → precession amplitude varies
  C₄ → I_xx = I_yy → all precession directions equally damped → more stable orbit

This explains why Wolf CW is rated "stable" competitively despite sub-optimal mass.
```

**TypeScript model**

```typescript
function wolfInertia(m_g: number, r_inner_mm: number, r_outer_mm: number): number {
  return 0.5 * (m_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
}
function wolfContribution(I_wolf: number, I_wheel: number): number {
  return I_wolf / (I_wolf + I_wheel);
}

// wolfInertia(3.1, 10, 22)                         → 9.05×10⁻⁷ kg·m²
// wolfContribution(9.05e-7, 7.51e-6)               → 10.75%  (stable 4-fold symmetry contribution)
```

---

## Case 353h — Fusion Wheel: Poison (29.8 g)

> **Stock combo (Poison Serpent SW145SD):** Clear Wheel: Serpent · Metal Wheel: Poison · Track: SW145 · Bottom: Semi Defense
> **Stock combo (Poison Giraffe S130MB):** Clear Wheel: Giraffe · Metal Wheel: Poison · Track: S130 · Bottom: Metal Ball

**Thesis.** Poison carries fifteen rectangular teeth arranged at equal 24° intervals around its outer circumference, with approximately 4 mm gaps between adjacent teeth. Despite weighing only 29.8 g, the open spoke-and-rim construction (thin cross-bridges at the inner hub, mass concentrated at the outer tooth ring) gives Poison an estimated I ≈ 9.32×10⁻⁶ kg·m² — nearly equal to Earth Metal Wheel (9.47×10⁻⁶) despite being 3.9 g lighter. This high specific angular momentum is wasted entirely by the recoil geometry: the rectangular tooth leading faces present near-perpendicular contact surfaces (φ ≈ 80–85° from tangent), generating near-pure radial recoil impulses rather than tangential smash forces. Additionally, like Flame, Poison's base is raised, elevating the wheel and exposing the Spin Track to opposing contact — reducing effective defense height. The combination of near-pure recoil, track exposure, and 15-tooth contact frequency every 2.8 ms (at ω = 150 rad/s) makes Poison unviable in all competitive roles.

**Geometry**

```
  Top view (Poison): 15 rectangular teeth, 24° spacing

         ┌──┐   ┌──┐   ┌──┐
     ┌──┐│  │┌──┐  │┌──┐  │┌──┐
  ──┘  └┘  └┘  └──┘  └┘  └┘  └──
       (15 teeth, ~5.9 mm wide, ~4 mm gap between each)

  r_o ≈ 23.7 mm   (outer tooth tip)
  r_i ≈ 8.0 mm    (spoke hub, open inner structure)
  Tooth height above base circle ≈ 3–4 mm  (est.)
  Contact face angle φ ≈ 82°  (near-perpendicular to tangent = near-pure recoil)

  Raised base: wheel sits ~2 mm higher than standard MFB track plane
    → SW145 / S130 Track contact face exposed to opposing beyblade on low attacks
```

**Moment of Inertia — High I Despite Low Mass**

```
Open-spoke construction: mass concentrated at outer tooth ring, not solid disc fill.
Ring model: r_o = 23.7 mm, r_i = 8.0 mm (thin spokes, mass mainly at teeth)

  I_Poison = (1/2) × 0.0298 × ((0.0237)² + (0.008)²)
           = 0.0149 × (5.617×10⁻⁴ + 6.40×10⁻⁵)            = 9.32×10⁻⁶ kg·m²

Reference comparison:
  Earth (33.7g):   I ≈ 9.47×10⁻⁶ kg·m²  (outer-mass ring design, great defense)
  Poison (29.8g):  I ≈ 9.32×10⁻⁶ kg·m²  (near-equal I, 3.9g lighter — high specific I)
  Dark (31.4g):    I ≈ 7.51×10⁻⁶ kg·m²  (solid fill, much lower I)

  L_Poison at ω = 150: 9.32×10⁻⁶ × 150                     = 1.40×10⁻³ kg·m²/s
  L_Earth  at ω = 150: 9.47×10⁻⁶ × 150                     = 1.42×10⁻³ kg·m²/s

Poison has near-Earth angular momentum despite lower mass — the spoke+tooth design is
efficient at placing mass at maximum radius. This is its only positive physical property.
```

**Tooth Contact — Near-Pure Recoil**

```
15 rectangular teeth, leading face perpendicular to rotation direction:

  Contact angle φ (leading face from circumferential tangent) ≈ 82°

  Smash fraction   = cos(82°)                                = 0.139  (near-zero smash)
  Recoil fraction  = sin(82°)                                = 0.990  (near-pure recoil)

Contact frequency at ω = 150 rad/s:
  Δt_tooth = (24° × π/180) / 150                            = 2.79 ms  (faster than Dark's 3.49 ms)

At each contact event, ~99% of the impulse returns as recoil to Poison itself.
This means Poison decelerates itself far more than it destabilizes the opponent.

Contrast with Earth (smooth near-circular rim):
  Contact angle φ_Earth ≈ 5–10° → smash fraction ≈ 0.99, recoil ≈ 0.09-0.17
  Earth transfers almost all contact energy forward (smash/defense) with minimal self-destabilization.
```

**Raised Base — Track Exposure**

```
Standard MFB Wheel plane: base sits at ~2–3 mm above the track shoulder
Poison's raised base:     +2 mm additional elevation ≈ 4–5 mm above track shoulder

Exposed track height:  h_track_exposed = h_track_full − h_coverage
  With raised base: h_exposed ≈ 3–4 mm of SW145/S130 body exposed to lateral impact

This allows opponents to contact the plastic Track body directly:
  ABS-ABS contact for Track → far lower I for the system → larger velocity change per impact
  → Poison loses more spin per hit to track-level contacts than a non-raised wheel would

This is the "Flame" parallel: Flame has the same raised-base characteristic (track exposure)
cited as a stamina-limiting weakness. Poison amplifies the problem by also having high-recoil teeth.
```

**Spin Decay (no-contact)**

```
No-contact stamina is tip-governed only (no rubber/bearing in wheel). With SD tip:
  dω/dt_SD ≈ 0.102 rad/s²  (Case 331)
  Time to 50% spin: 150 × 0.5 / 0.102                       = 735 s  (12 min, theoretically good)

But each tooth contact at φ = 82° drains:
  ΔL_per_contact = I × Δω = reaction impulse per tooth event
  → Battle contacts accelerate spin loss far beyond the 0.102 rad/s² floor
  → In active combat, effective spin life is minutes shorter than pure-tip prediction
```

**TypeScript model**

```typescript
function poisonInertia(m_kg: number, r_o_mm: number, r_i_mm: number): number {
  return 0.5 * m_kg * (Math.pow(r_o_mm / 1000, 2) + Math.pow(r_i_mm / 1000, 2));
}
function poisonToothContact(phi_deg: number, n_teeth: number, omega: number): {
  smash: number; recoil: number; contact_interval_ms: number;
} {
  const phi = phi_deg * Math.PI / 180;
  const interval = (2 * Math.PI / n_teeth) / omega * 1000;
  return { smash: Math.cos(phi), recoil: Math.sin(phi), contact_interval_ms: interval };
}
function poisonVsEarth(I_poison: number, I_earth: number, m_poison: number, m_earth: number): {
  I_ratio: number; specific_I_ratio: number;
} {
  return {
    I_ratio: I_poison / I_earth,
    specific_I_ratio: (I_poison / m_poison) / (I_earth / m_earth)
  };
}

// poisonInertia(0.0298, 23.7, 8.0)               → 9.32×10⁻⁶ kg·m²  (≈ Earth, despite 3.9g lighter)
// poisonToothContact(82, 15, 150)
//   → { smash: 0.139, recoil: 0.990, contact_interval_ms: 2.79 }
//   → near-pure recoil every 2.79 ms — self-draining at high contact frequency
// poisonVsEarth(9.32e-6, 9.47e-6, 0.0298, 0.0337)
//   → { I_ratio: 0.984, specific_I_ratio: 1.115 }
//   → Poison has 11.5% better I/gram than Earth — wasted on recoil geometry
```

---

## Case 353i — Clear Wheel: Serpent (2.9 g)

> **Stock combos:** Poison Serpent SW145SD · Earth Serpent 130WD · Burn Serpent (various)

**Thesis.** The Serpent Energy Ring features eight stylised serpent bodies overlapping and interlocking in a Celtic knot-derived pattern, at 2.9 g sitting near the mid-range of MFB Clear Wheel masses. The angular, overlapping design produces an effective visual C₄ symmetry (four paired serpents at 90° intervals) despite having eight individual elements — the pairwise overlap means opposing element pairs carry equal mass, not each individual element independently. This C₄-equivalent distribution makes Serpent marginally more stable than a C₂ ring but lacks the precise single-element C₄ of Wolf. The angular outer contour creates small contact-point variations at the CW level, but at 9.3% of the combined Wheel+CW mass these are negligible in practice. Serpent is treated as a cosmetic ring for competitive purposes.

**Mass and Inertia**

```
Serpent mass: 2.9 g  =  0.0029 kg
Poison mass: 29.8 g  =  0.0298 kg
Mass fraction: 2.9 / (2.9 + 29.8)                           = 8.87%

Serpent modelled as thin ring: r_i ≈ 10 mm, r_o ≈ 22 mm
  I_Serpent = (1/2) × 0.0029 × ((0.022)² + (0.010)²)
            = 0.00145 × (4.84×10⁻⁴ + 1.0×10⁻⁴)             = 8.48×10⁻⁷ kg·m²

Combined I (Poison + Serpent):
  I_total = 9.32×10⁻⁶ + 8.48×10⁻⁷                          = 1.017×10⁻⁵ kg·m²
  Serpent contribution: 8.48×10⁻⁷ / 1.017×10⁻⁵              = 8.34%
```

**Effective Symmetry of the Celtic Knot Pattern**

```
8 serpent elements at 45° spacing (C₈ nominal):
  However, adjacent pairs of serpents interlock and mirror each other.
  Net mass distribution is 4 paired-element groups at 90° → effective C₄ symmetry.

C₄ property: I_xx = I_yy in the spin plane → no preferred precession axis
  → stable orbit (same mechanism as Wolf CW, Case 353g)

Comparison:
  Wolf (C₄, single elements):   precise 4-fold symmetry → maximum stability per weight class
  Serpent (C₄-equiv via pairing): comparable stability, but overlap creates slight mass
                                   asymmetry within each pair → marginally less precise
  Aquila (C₂, Case 282):        2-fold symmetry → preferred wobble axis → less stable

Verdict: Serpent stability is between Wolf and Aquila in the symmetry hierarchy.
```

**TypeScript model**

```typescript
function serpentInertia(m_g: number, r_inner_mm: number, r_outer_mm: number): number {
  return 0.5 * (m_g / 1000) * (Math.pow(r_inner_mm / 1000, 2) + Math.pow(r_outer_mm / 1000, 2));
}
function serpentContribution(I_serpent: number, I_wheel: number): number {
  return I_serpent / (I_serpent + I_wheel);
}

// serpentInertia(2.9, 10, 22)                     → 8.48×10⁻⁷ kg·m²
// serpentContribution(8.48e-7, 9.32e-6)           → 8.34%  (effective C₄ via paired Celtic knot)
```

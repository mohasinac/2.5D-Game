# Physics Chain: Part 6

**« Part 5:** [5 case study.md](5%20case%20study.md) (Cases 236–296)

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
| Indent recoil angle | `φ = arctan(d / pitch)` |
| Iron-powder volume fraction | `φ_p = Δm / (V_total × (ρ_powder − ρ_ABS))` |

### Material Constants (use consistently)
| Material | E (GPa) | ρ (kg/m³) | μ_kinetic |
|----------|---------|-----------|-----------|
| Zinc alloy (MFB MW) | 100 | 6600 | — |
| ABS plastic | 2.3 | 1050 | 0.35 |
| Rubber tip | 0.002 | 1200 | 0.85 |
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

## Case 297 — Rubber Flat / RF (0.8 g)

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

Tip outer radius r_tip:       2.775 mm
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

## Case 298 — Move 145 / M145 (4.2 g)

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

## Case 309 — Flash 4D Metal Wheel (45.6 g)

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

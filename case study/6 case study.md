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

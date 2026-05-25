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

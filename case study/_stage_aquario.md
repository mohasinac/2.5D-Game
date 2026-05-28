
## Case 1381 — Face Bolt: Aquario (MFB Metal Fusion)

**Generation:** Metal Fusion Beyblade (Metal System, first generation)  
**Set:** BB-21  
**Mass:** ~1.2 g (excluded from assembly mass — center piece at r ≈ 0, negligible I)  
**Material:** ABS plastic

### Design
Depicts "Aquarius", the eleventh Zodiac sign: a vase of water with a face and a water-arm. Takara Tomy release engraves "AQRO"; Hasbro reads "Aquario". Some Hasbro variants (e.g. Hyper Aquario 105F) omit the text and leave the arm blank. Cyber Aquario 105RF uses abstract water-drop motifs instead.

Per mass-exclusion convention: Face Bolt mass at r ≈ 0 → I_FB ≈ 0. Not included in assembly weight calculations.

---

## Case 1382 — Metal Wheel: Aquario (MFB Metal Fusion)

**Generation:** Metal Fusion Beyblade  
**Mass:** 27.0 g (est.)  
**Material:** Zinc alloy die-cast

### Geometry
- 4 textured wave fins projecting from circumference at right angles to the ring
- Fin orientation: curved/trailing face leads during right-spin rotation (fins point OPPOSITE to spin direction, same design philosophy as Wolf Wheel)
- Hollow semicircular cutouts between fins to reduce breakage risk
- Outer fin tip radius r_o = 37 mm; inner hub bore r_i = 7 mm

### Moment of Inertia
```
I_wheel = ½ × m × (r_i² + r_o²)
        = ½ × 0.027 × (0.007² + 0.037²)
        = ½ × 0.027 × (4.9×10⁻⁵ + 1.369×10⁻³)
        = ½ × 0.027 × 1.418×10⁻³
        = 1.914×10⁻⁵ kg·m²
```
Note: hollow semicircular cutouts reduce mid-radius mass; annular model slightly overestimates true I (actual I ≈ 85–90% of formula result). Value used as calculated for consistency.

### Fin Orientation Physics (Trailing-Face Design)
During right-spin (CW from above), the convex/curved back of each fin faces the direction of travel:
- Contact geometry: opponent strikes the convex trailing surface → glancing deflection rather than clean impact
- Coefficient of restitution for glancing contact: e ≈ 0.45–0.55 (vs e ≈ 0.65–0.70 for flat leading-face wheel)
- Recoil impulse on Aquario: J = m_Aquario × Δv = reduced by 30–40% vs an aggressive wheel
- Attack force transferred to opponent: also reduced → mediocre offensive output

This is a deliberate trade-off: the fins prevent the massive recoil that would destabilize Aquario, at the cost of weak smash attack. The empty spaces between fins (hollow semicircles) further reduce air resistance during spin but harm stamina/defense by reducing the uniformity of the perimeter mass.

### Competitive Assessment
- **Attack:** Mediocre — rounded trailing face deflects without clean smash; estimated smash coefficient ≈ 45% of a dedicated attack wheel
- **Defense:** Poor — wide fin spacing creates pressure differential during contact; perimeter is discontinuous, allowing opponent blades to reach inner components
- **Stamina:** Poor — large open spaces increase aerodynamic profile (ΔC_D ≈ +30–40% vs circular disc); irregular mass distribution at 4 fins causes slight periodic drag oscillation
- Use case: introductory/casual play; competitive outclassed in all three types

---

## Case 1383 — Spin Track: 105 (MFB Metal Fusion)

**Generation:** Metal Fusion Beyblade  
**Mass:** 1.0 g (est.)  
**Material:** ABS plastic

### Geometry
- Height: 105 units (10.5 mm from wheel underside to tip base)
- 4th lowest height in the Metal System track lineup (85 < 90 < 100 < 105)
- Slim cylindrical form; r_track ≈ 4 mm
- No floor-scrape risk at 105 mm height

### Moment of Inertia
```
I_105 = ½ × 0.001 × (0.003² + 0.005²)
      = ½ × 0.001 × (9×10⁻⁶ + 2.5×10⁻⁵)
      = 1.70×10⁻⁸ kg·m²   [negligible vs wheel]
```

### Height Considerations
| Track | Height | Attack use | Stamina use |
|-------|--------|------------|-------------|
| 85 | 8.5 mm | Best | Excellent |
| 90 | 9.0 mm | Very good | Very good |
| 100 | 10.0 mm | Good | Good |
| **105** | **10.5 mm** | **Outclassed** | **Outclassed** |
| 145 | 14.5 mm | Unstable | Vulnerable |

105 finds no niche: it is neither the optimal low-profile for attack (85–100 preferred) nor a unique height that exploits any stadium geometry. Its use is primarily when better tracks are unavailable. The track adds no gimmick mass or geometry benefit.

---

## Case 1384 — Performance Tip: Flat (F) (MFB Metal Fusion)

**Generation:** Metal Fusion Beyblade  
**Mass:** 0.8 g (est.)  
**Material:** ABS plastic

### Geometry
- Flat circular contact surface
- r_contact = 3.0 mm (half-diameter of flat plastic tip face)
- Contact area = π × r² = 28.3 mm²

### Friction Model
```
μ_F = 0.22  (smooth ABS plastic on standard rubber-mat MFB stadium)
```
Comparison: Rubber Flat (RF) μ ≈ 0.38; Spike (S) μ ≈ 0.05; Bearing (B) μ ≈ 0.02

### Movement Pattern
- High friction × large contact area → strong lateral force during any tilt or contact → aggressive, erratic circular movement
- Flower pattern: difficult to maintain without rubber grip; plastic Flat tends to wander into wide chaotic orbits rather than the neat circular flower of Rubber Flat
- Net behaviour: bey traces large irregular paths at high ω; narrows toward center as ω drops and centrifugal tendency decreases

### Moment of Inertia
```
I_F = ½ × m × r² = ½ × 0.0008 × 0.003² = 3.6×10⁻⁹ kg·m²  [negligible]
```

### Competitive Assessment
- Excellent mobility for attack → use in aggressive formations
- Outclassed for controlled attack by Rubber Flat (RF): RF maintains flower pattern reliably and delivers more consistent collision trajectories
- Plastic Flat still viable for budget or casual attack when RF is unavailable

---

## Case 1385 — Full Assembly: Aquario 105F (MFB Metal Fusion)

**Generation:** Metal Fusion Beyblade  
**Configuration:** Attack (limited; mediocre overall)  
**Launch ω₀:** 500 rad/s (standard Beylauncher ripcord)

### Component Mass Summary
| Part | Mass (g) | Notes |
|------|---------|-------|
| Face Bolt Aquario | 1.2 | Excluded from assembly (r ≈ 0) |
| Energy Ring Aquario | 3.5 (est.) | ABS clear wheel, not submitted separately; included here |
| Metal Wheel Aquario | 27.0 (est.) | Primary structural component |
| Spin Track 105 | 1.0 (est.) | ABS, slim |
| Flat (F) | 0.8 (est.) | ABS |
| **Assembly total** | **32.3** | (excluding Face Bolt) |

### Component Inertia Summary
| Part | I (kg·m²) |
|------|-----------|
| Metal Wheel Aquario | 1.914×10⁻⁵ |
| Energy Ring Aquario (r ≈ 20 mm) | 1.400×10⁻⁶ |
| Track + Tip | ~2.0×10⁻⁸ (negligible) |
| **Total** | **2.054×10⁻⁵** |

### Angular Momentum at Launch
```
L₀ = I × ω₀ = 2.054×10⁻⁵ × 500 = 1.027×10⁻² N·m·s
```

### Spin Decay (Flat tip, μ = 0.22, r = 3 mm)
```
τ = μ × m × g × r
  = 0.22 × 0.0323 × 9.81 × 0.003
  = 2.092×10⁻⁴ N·m

dω/dt = τ / I = 2.092×10⁻⁴ / 2.054×10⁻⁵ = 10.18 rad/s²

t_stall = ω₀ / (dω/dt) = 500 / 10.18 = 49.1 s
```

### Battle Parameters
| Parameter | Value |
|-----------|-------|
| ω_battle (60% ω₀) | 300 rad/s |
| ω_wobble threshold (40% ω₀) | 200 rad/s |
| KE_battle | ½ × 2.054×10⁻⁵ × 300² = 0.924 J |
| t_stall | 49.1 s |

### Aquario Wheel Contact Analysis at Battle ω = 300 rad/s
Fin tip linear velocity: v_tip = ω × r_o = 300 × 0.037 = 11.1 m/s  
Contact with opponent tip: v_contact (trailing-face geometry) → glancing impulse

```
Impact impulse (glancing, e = 0.5):
  Δp = m_Aquario × (1 + e) × Δv_n
  Δv_n ≈ v_tip × sin(θ_approach)
  θ_approach ≈ 15° (trailing-face deflection angle)
  Δv_n ≈ 11.1 × 0.259 = 2.87 m/s
  Δp = 0.0323 × 1.5 × 2.87 = 0.139 N·s  (per impact)
```

Comparison to flat leading-edge wheel at same conditions (θ ≈ 45°, e = 0.65):  
Δp_aggressive ≈ 0.0323 × 1.65 × 7.85 = 0.418 N·s  
Aquario delivers ~33% of equivalent aggressive wheel impact → confirms "mediocre attack" rating.

### Track Height Penalty (105 vs 85)
Lower track height decreases the bey's effective center-of-mass height and increases the contact arc window with opponents. At 105 vs 85:
- ΔCoM_height ≈ 2 mm (lower track = 2 mm lower CoM)
- Stability gain: σ_tipping ∝ CoM_height; 85 is ~19% more stable than 105 against lateral topple

105 is the weakest contributing factor of this assembly. All competitive uses of Aquario should substitute 85 or 90.

### Assembly Verdict
Aquario 105F is a beginner/introductory attack-type with no competitive advantage in any category. The four trailing-fin design, hollow perimeter, outclassed track height, and plastic Flat tip each individually underperform alternatives — their combination creates a consistent but mediocre all-around bey useful for learning movement mechanics and basic attack patterns.

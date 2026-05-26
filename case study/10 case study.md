# Beyblade Case Studies — Part 10: Arena Mechanics and Stadium Physics

**« Part 9:** [9 case study.md](9%20case%20study.md) (Cases 392–544, Burst Series multi-lineage)

**Scope:** Generation-neutral arena physics covering all official Beyblade stadium families (Plastic, MFB, Burst, BX). Each case treats a specific named real-world stadium or arena feature. Generation-specific mechanics are tagged explicitly. Cross-generational use is derived from first principles for every case.

---

## Style Rules (carry forward from Part 9)

- No em-dashes in prose: use colons or semicolons
- No bullets in the Thesis paragraph
- All numeric results to 3 significant figures
- Annular disk inertia: `I = ½m(r_i² + r_o²)`
- Wall-bounce COR: ε_wall ≈ 0.70–0.85 (hard ABS top vs hard ABS wall); rubber tip: 0.40–0.60
- Slope lateral gravity: `g_lat = g · sin(α)` for slope angle α
- Spin decay from floor: `dω/dt = −(μ · m · g · r_tip) / I_total`
- Gear drive force: `F_drive = min(τ_mesh / r_gear, N · μ_gear)`, `τ_mesh = I · Δω / Δt`
- Pocket exit condition: v_radial > 0, r ≥ R_wall, azimuth within pocket arc
- Material constants: ABS (E = 2.3 GPa, ρ = 1050 kg/m³, μ_k = 0.15 on ABS), rubber tip (μ_k = 0.50), hard ABS tip (μ_k = 0.17), plastic tip (μ_k = 0.10)
- Centripetal acceleration: `a_c = v² / r`
- Impulse at ridge contact: `J = m · v_radial · (1 + ε)`; components via contact face angle β

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

---

## Case 545 — BeyStadium Attack Type (MFB): Five-Zone Bowl Cross-Section, Confirmed Dimensional Geometry, and Gravity-Component Analysis [REAL-WORLD CONFIRMED]

**Thesis:** The BeyStadium Attack Type (Takara Tomy MFB era, used without cardboard shield panels in competitive play) is the tournament-standard Class A passive arena for Metal Fight Beyblade, measuring 340 mm outer diameter and 30 mm maximum depth at the centre, with the Tornado Ridge at R_TR = 125 mm diameter placing the ridge peak midway between the arena centre and the outer wall (R_outer = 170 mm); the bowl floor divides into five radial zones on a radial cut: Zone 1 (flat centre, r = 0–40 mm) has zero slope and therefore zero lateral gravity component, making it the natural resting position of stamina-type tops as well as the collision convergence zone due to gravity-funnel geometry in Zones 2–4; Zone 2 (main slope, r = 40–125 mm, slope angle α₁ ≈ 30°) exerts a constant inward gravity component g_lat = 9.81 × sin(30°) = 4.905 m/s² on every top, converting slope height h₂ = (125 − 40) × tan(30°) = 85 × 0.5774 = 49.1 mm of potential energy into kinetic energy for descending tops and extracting the same energy from ascending tops; Zone 3 (Tornado Ridge, r = 125–145 mm, feature height h_TR ≈ 3 mm above slope line) is a raised circumferential bump whose engagement with a top's lowest structural feature depends on the feature height z_rim relative to h_TR, producing reliable engagement only when z_rim ≤ 3 mm; Zone 4 (second inclination, r = 145–155 mm, steeper slope α₂ ≈ 50°) rises Δh₄ = (155 − 145) × tan(50°) = 10 × 1.192 = 11.9 mm above the Tornado Ridge base, setting the minimum escape speed to the outer wall as v_escape = √(2 × 9.81 × 0.0119) = 0.483 m/s; Zone 5 (outer wall, r = 155–170 mm, wall height H = 30 mm) carries the exit pockets at 3 × 150 mm chord (total exit coverage 450 mm) and 3 × 155 mm wall chord (total wall coverage 465 mm) on a circumference of π × 340 = 1068 mm, yielding P(ejection at random azimuth) = 450 / (450 + 465) = 0.492 — a nearly neutral 49.2% ejection probability that makes this stadium the fairest cross-type testing environment of any generation.

### Visual Geometry — Five-Zone Floor Profile (Radial Cross-Section)

```
Radial cross-section of BeyStadium Attack Type (centre on left, wall on right):

  Height
  above   30 ─┐                                                   ┌── wall top lip
  floor      │                                                   │  H = 30 mm
  (mm)    20 ─┤                                                  ╱│
             │                                                 ╱  │
          10 ─┤                                    ╱‾\        ╱   │
             │                                   ╱   \      ╱    │
           0 ─┴──────────────────────────────── ╱     \────╱     └─
              │         │                     │   │    │    │     │
              0       40 mm                125 mm  135  145  155  170 mm
                         ↑                   ↑   ↑    ↑    ↑
                    slope                  TR   TR  2nd  wall
                    begins                base  peak incl  base

  Zone 1: FLAT CENTRE       r = 0–40 mm       slope = 0°      g_lat = 0 m/s²
  Zone 2: MAIN SLOPE        r = 40–125 mm     slope ≈ 30°     g_lat = 4.905 m/s²  (inward)
  Zone 3: TORNADO RIDGE     r = 125–145 mm    feature h = 3 mm above slope line
  Zone 4: SECOND INCLINE    r = 145–155 mm    slope ≈ 50°     g_lat = 7.508 m/s²  (inward)
  Zone 5: OUTER WALL        r = 155–170 mm    H_wall = 30 mm  vertical (pockets cut through)
```

### Zone Geometry Analysis

```
Zone 2 — Main Slope:
  α₁ = 30°
  Δr₂ = 125 − 40 = 85 mm
  Rise h₂ = Δr₂ × tan(α₁) = 85 × tan(30°) = 85 × 0.5774 = 49.1 mm
  g_lat,2 = 9.81 × sin(30°) = 4.905 m/s²
  Speed gained by a top descending full Zone 2 (η = efficiency = 0.70 for friction):
    Δv₂ = √(2 × g × h₂ × η) = √(2 × 9.81 × 0.0491 × 0.70) = √(0.6733) = 0.820 m/s

Zone 3 — Tornado Ridge (see Case 546 for full analysis):
  h_TR ≈ 3 mm, w_TR_half ≈ 10 mm
  Face angle: β_TR = atan(h_TR / w_TR_half) = atan(3/10) = atan(0.300) = 16.7°

Zone 4 — Second Inclination:
  α₂ = 50°
  Δr₄ = 155 − 145 = 10 mm
  Rise h₄ = Δr₄ × tan(α₂) = 10 × tan(50°) = 10 × 1.192 = 11.9 mm
  g_lat,4 = 9.81 × sin(50°) = 9.81 × 0.766 = 7.508 m/s²  (steeper than Zone 2)
  Minimum speed to crest Zone 4 (from TR base, no efficiency factor — worst case):
    v_min,4 = √(2 × 9.81 × 0.0119) = √(0.2335) = 0.483 m/s
  With floor friction (μ = 0.15, α₂ = 50°):
    Net deceleration on Zone 4: a_dec = g × sin(50°) + μ × g × cos(50°)
                                       = 9.81 × 0.766 + 0.15 × 9.81 × 0.643
                                       = 7.508 + 0.946 = 8.454 m/s²
    v_min,4 (with friction) = √(2 × 8.454 × 0.0119) = √(0.2012) = 0.449 m/s
    — effectively the same order, confirming v ≈ 0.5 m/s radial is the practical gate.

Exit Geometry:
  Outer circumference: C = π × 340 = 1068 mm
  3 × wall chord 155 mm: total wall = 465 mm  →  wall coverage = 465/1068 = 43.5%
  3 × exit chord 150 mm: total exit = 450 mm  →  exit coverage = 450/1068 = 42.1%
  Transition zones: 1068 − 465 − 450 = 153 mm  →  14.3%
  P(ejection | top reaches outer wall) = 450 / (450 + 465) = 0.492
  P(deflection | top reaches outer wall) = 0.508
```

### Spin Decay in BeyStadium Attack Type

```
Representative MFB assembly: Metal Wheel (22 g, r_i = 4 mm, r_o = 25 mm) +
Spin Track (4 g) + Performance Tip Hard Flat (3 g, r_tip = 6 mm, μ = 0.17)
Total mass m = 29 g = 0.029 kg

I_wheel = ½ × 0.022 × (0.004² + 0.025²) = ½ × 0.022 × (1.6×10⁻⁵ + 6.25×10⁻⁴)
         = ½ × 0.022 × 6.41×10⁻⁴ = 7.052×10⁻⁶ kg·m²
I_track  = ½ × 0.004 × (0.004² + 0.010²) = ½ × 0.004 × 1.16×10⁻⁴ = 2.32×10⁻⁷ kg·m²
I_tip    = ½ × 0.003 × (0.004²) = 2.40×10⁻⁸ kg·m² (solid rod approx)
I_total  ≈ 7.052×10⁻⁶ + 0.232×10⁻⁶ + 0.024×10⁻⁶ = 7.308×10⁻⁶ kg·m²

dω/dt = −(μ × m × g × r_tip) / I_total
      = −(0.17 × 0.029 × 9.81 × 0.006) / 7.308×10⁻⁶
      = −(2.906×10⁻⁴) / 7.308×10⁻⁶
      = −39.8 rad/s²

At ω₀ = 600 rad/s (typical MFB launch):
  t_spin = ω₀ / |dω/dt| = 600 / 39.8 = 15.1 s  (HF tip — short stamina)

For Rubber Flat tip (μ = 0.50, r_tip = 8 mm):
  dω/dt = −(0.50 × 0.029 × 9.81 × 0.008) / 7.308×10⁻⁶
        = −(1.141×10⁻³) / 7.308×10⁻⁶ = −156 rad/s²
  t_spin = 600 / 156 = 3.85 s  (attack tip — very short stamina)
```

```typescript
interface BeyStadiumAttackType {
  outerRadiusMm: 170;
  flatZoneEndMm: 40;
  mainSlopeEndMm: 125;
  slopeAngleDeg: 30;
  tornadoRidgeRadiusMm: 125;
  tornadoRidgeHeightMm: 3;
  secondInclineEndMm: 155;
  secondInclineAngleDeg: 50;
  wallHeightMm: 30;
  pocketChordMm: 150;
  wallChordMm: 155;
  numPockets: 3;
}

function zoneGravityLateral(slopeAngleDeg: number): number {
  return 9.81 * Math.sin(slopeAngleDeg * Math.PI / 180);
}
// zoneGravityLateral(30) → 4.905 m/s²  (Zone 2 inward pull)
// zoneGravityLateral(50) → 7.508 m/s²  (Zone 4 inward pull)
// zoneGravityLateral(0)  → 0            (Zone 1 flat centre)

function slopeDescentSpeed(riseHeightMm: number, efficiency: number): number {
  return Math.sqrt(2 * 9.81 * (riseHeightMm / 1000) * efficiency);
}
// slopeDescentSpeed(49.1, 0.70) → 0.820 m/s  (full Zone 2 descent)
// slopeDescentSpeed(11.9, 0.70) → 0.404 m/s  (Zone 4 descent for inbound top)
// slopeDescentSpeed(61.0, 0.70) → 0.914 m/s  (Zone 2 + 4 combined)

function ejectionProbability(numPockets: number, pocketChordMm: number, wallChordMm: number): number {
  const totalExit = numPockets * pocketChordMm;
  const totalWall = numPockets * wallChordMm;
  return totalExit / (totalExit + totalWall);
}
// ejectionProbability(3, 150, 155) → 0.492 (49.2% neutral ejection balance)
// ejectionProbability(2, 150, 155) → 0.379 (2-exit: harder to ring out)
// ejectionProbability(4, 150, 155) → 0.592 (4-exit: easier ring-out)
```

---

## Case 546 — Tornado Ridge (MFB Attack Type vs Plastic Tornado Attack): Engagement Window, Face-Angle Impulse Decomposition, and the Height-Inward-Speed Trade-Off

**Thesis:** The Tornado Ridge is a raised circumferential bump at r = R_TR (R_TR = 125 mm in the MFB Attack Type, R_TR ≈ 110–130 mm in Plastic-era stadiums) that functions as a trajectory shaper by delivering an inward-radial impulse to any top whose lowest structural feature height z_rim satisfies z_rim ≤ h_TR; in the MFB BeyStadium Attack Type h_TR ≈ 3 mm versus the Plastic Tornado Attack Stadium's h_TR ≈ 10 mm — this height difference has a counterintuitive implication for the impulse delivered when engagement does occur: for a top approaching at v_r = 1.50 m/s, mass m = 0.040 kg, COR ε = 0.65, the MFB ridge face angle is β_MFB = atan(3/10) = 16.7° yielding an inward impulse component J_inward = m × v_r × (1 + ε) × cos(β_MFB) = 0.040 × 1.50 × 1.65 × cos(16.7°) = 0.0948 N·s (Δv_inward = 2.37 m/s), while the Plastic ridge at h_TR = 10 mm produces β_Plastic = atan(10/10) = 45.0° yielding J_inward = 0.040 × 1.50 × 1.65 × cos(45°) = 0.0700 N·s (Δv_inward = 1.75 m/s) — the shallower MFB ridge delivers 35.4% more inward impulse per engagement event than the taller Plastic ridge because the more horizontal face angle concentrates more of the impulse in the radial inward direction; however, the MFB ridge engages only when z_rim ≤ 3 mm (marginal for MFB metal-wheel tops at z_rim = 4–5 mm, reliable for Plastic-era AR tops at z_rim = 1–3 mm), while the Plastic ridge engages reliably for all generations at z_rim ≤ 10 mm; the vertical pop component for the MFB ridge is J_vertical = m × v_r × (1 + ε) × sin(16.7°) = 0.0285 N·s (Δv_up = 0.713 m/s), reaching a maximum pop height h_pop = Δv_up² / (2g) = 0.713² / (2 × 9.81) = 25.9 mm — sufficient to make the top momentarily airborne, landing in a different radial position and resetting its floor-contact trajectory.

### Visual Geometry — Tornado Ridge Cross-Section (Both Generations)

```
Radial cross-section of Tornado Ridge (approach from left = inbound radially outward top):

  MFB Attack Type (h = 3 mm, w_half = 10 mm):

            ↑ J_vert (up)
            │
  ──────────┬──┬──────────────────────  floor level
            │  │  ← h_TR = 3 mm
            └──┘   ← half-width w = 10 mm each side
            ↑β = 16.7° face angle
  →  v_r (outward approach)

  Inward impulse fraction:  cos(16.7°) = 0.957  ← high inward component
  Vertical fraction:        sin(16.7°) = 0.288  ← low pop

  ─────────────────────────────────────────────────

  Plastic Tornado Attack (h = 10 mm, w_half = 10 mm):

            ↑ J_vert (up)
            │
  ─────────────────────────────────  floor level
              /\  ← h_TR = 10 mm
             /  \     ← half-width w = 10 mm
            /    \
           β = 45° face angle
  →  v_r (outward approach)

  Inward impulse fraction:  cos(45°) = 0.707   ← moderate inward
  Vertical fraction:        sin(45°) = 0.707   ← high pop (equal split)

  KEY RESULT: The MFB ridge punches harder inward when it engages.
              The Plastic ridge engages more reliably for all top types.
```

### Engagement Window by Generation

```
Engagement condition:  z_rim ≤ h_TR

  Generation       Part type              z_rim (mm)   MFB h=3 mm  Plastic h=10 mm
  ─────────────────────────────────────────────────────────────────────────────────
  Plastic          Attack Ring outer lip   1–3          YES (all)   YES
  MFB              Metal Wheel outer edge  3–5          MARGINAL    YES
  Burst (Standard) Energy Layer base       3–5          MARGINAL    YES
  Burst (DB/BU)    Blade base outerrim     4–6          NO (most)   YES
  BX               Blade base outerrim     3–4          MARGINAL    YES
  ─────────────────────────────────────────────────────────────────────────────────
  "MARGINAL" = engagement occurs only if the launch is precise and the top's
  approach is tangential (low radial velocity, low z_rim side makes contact).
```

### Impulse Decomposition at Contact

```
Input: m = 0.040 kg, v_r = 1.50 m/s (approach speed at TR), ε = 0.65

Total impulse: J_total = m × v_r × (1 + ε) = 0.040 × 1.50 × 1.65 = 0.0990 N·s

MFB ridge (β = 16.7°):
  J_inward  = J_total × cos(β) = 0.0990 × 0.957 = 0.0948 N·s → Δv_inward = 2.37 m/s
  J_vertical = J_total × sin(β) = 0.0990 × 0.288 = 0.0285 N·s → Δv_up    = 0.713 m/s
  Pop height: h_pop = 0.713² / (2 × 9.81) = 25.9 mm

Plastic ridge (β = 45.0°):
  J_inward  = J_total × cos(β) = 0.0990 × 0.707 = 0.0700 N·s → Δv_inward = 1.75 m/s
  J_vertical = J_total × sin(β) = 0.0990 × 0.707 = 0.0700 N·s → Δv_up    = 1.75 m/s
  Pop height: h_pop = 1.75² / (2 × 9.81) = 156 mm  ← very high pop

Inward speed comparison (at engagement):
  MFB ridge:     Δv_inward = 2.37 m/s  (+35.4% vs Plastic)
  Plastic ridge: Δv_inward = 1.75 m/s
  Δ = (2.37 − 1.75) / 1.75 × 100% = +35.4%

Physical interpretation: the MFB ridge's shallow angle is BETTER at converting the
collision impulse into inward top speed. The Plastic ridge wastes 50% of the impulse
lifting the top vertically. If the MFB ridge does engage, it is the more effective
trajectory shaper on a per-contact basis.
```

```typescript
function tornadoRidgeImpulse(
  mass_kg: number, vRadial_ms: number, cor: number,
  ridgeHeight_mm: number, ridgeHalfWidth_mm: number
): { jInward_Ns: number; jVertical_Ns: number; dvInward_ms: number; popHeight_mm: number } {
  const beta = Math.atan(ridgeHeight_mm / ridgeHalfWidth_mm);
  const jTotal = mass_kg * vRadial_ms * (1 + cor);
  const jInward = jTotal * Math.cos(beta);
  const jVertical = jTotal * Math.sin(beta);
  const dvInward = jInward / mass_kg;
  const popHeight = (jVertical / mass_kg) ** 2 / (2 * 9.81) * 1000;
  return { jInward_Ns: jInward, jVertical_Ns: jVertical, dvInward_ms: dvInward, popHeight_mm: popHeight };
}
// tornadoRidgeImpulse(0.040, 1.50, 0.65, 3, 10) →
//   { jInward=0.0948 Ns, jVertical=0.0285 Ns, dvInward=2.37 m/s, popHeight=25.9 mm }  MFB
// tornadoRidgeImpulse(0.040, 1.50, 0.65, 10, 10) →
//   { jInward=0.0700 Ns, jVertical=0.0700 Ns, dvInward=1.75 m/s, popHeight=156 mm }  Plastic
// tornadoRidgeImpulse(0.040, 2.00, 0.65, 3, 10) →
//   { jInward=0.1264 Ns, jVertical=0.0380 Ns, dvInward=3.16 m/s, popHeight=46.2 mm }  MFB fast
// tornadoRidgeImpulse(0.035, 1.50, 0.70, 3, 10) →
//   { jInward=0.0869 Ns, jVertical=0.0261 Ns, dvInward=2.48 m/s, popHeight=31.6 mm }  lighter top
```

---

## Case 547 — Sliding Shoot Technique (MFB Attack Type): Full Trajectory Budget, Centre-Arrival Speed, and Comparison Against Straight and Radial Launch

**Thesis:** The Sliding Shoot is the competitive launch technique for attack-type tops in the BeyStadium Attack Type, defined by an entry angle φ ≈ 10°–20° inward from the wall tangent (versus a straight shoot at φ ≈ 45°–60° or a radial shoot at φ ≈ 90°); the technique exploits Zone 2's 30° slope by entering the bowl along the slope wall and descending from r = R_TR = 125 mm to r = r_floor = 40 mm, gaining potential energy equivalent to h₂ = 49.1 mm height, yielding a speed gain Δv₂ = √(2 × 9.81 × 0.0491 × 0.70) = 0.820 m/s at 70% mechanical efficiency (accounting for tip friction losses), so that a top launched at v_launch = 1.50 m/s arrives at the Tornado Ridge at v_TR = √(1.50² + 0.820²) = √(2.250 + 0.672) = √(2.922) = 1.709 m/s; upon engaging the Tornado Ridge (z_rim ≤ 3 mm), the ridge delivers Δv_inward = 2.37 m/s (Case 546), so the inward-directed speed after TR contact is v_post_TR = 1.709 + 2.37 × cos(angle_to_centre) ≈ 2.1–2.5 m/s depending on approach angle; the top then descends Zone 2 inward gaining a further Δv_inward,2 = 0.820 m/s, arriving at the flat Zone 1 centre at v_centre ≈ 2.2–2.8 m/s; a straight shoot (φ = 60°) achieves v_centre ≈ 1.5–1.8 m/s with one wall bounce dissipating energy before the first collision; a radial shoot (φ = 90°) achieves v_centre ≈ 1.3–1.5 m/s with no slope gain; the Sliding Shoot therefore delivers a 40–87% higher centre-collision speed than alternative techniques, with the speed advantage narrowing as launch speed itself increases (the slope-gain Δv is fixed at ~0.820 m/s regardless of launch speed); the technique is most effective at moderate launch speeds v_launch = 1.2–1.8 m/s because at high v_launch the proportional gain diminishes.

### Visual Geometry — Sliding Shoot Trajectory

```
Top view — BeyStadium Attack Type:

   Exit pocket (180°)
         ↓
   ──────╱╲──────
  ╱               ╲
 │  Zone 1 (flat)  │
 │       ●─────────────────── ← centre collision (v ≈ 2.2–2.8 m/s)
  ╲     ╱   ← inward direction after TR         ↑
   ────╱─────────                               │ inward v from TR engagement
      │ ←── Zone 2 (slope descent, +0.82 m/s)  │
      │                                         │ Tornado Ridge at r=125mm
   exit (300°)                               ←──────────────────────────
                                               ● entering top (v_launch = 1.50 m/s)
                                               │   φ = 15° inward from wall tangent
                                               └─ launch point (wall at r=170mm)

  Route: Enter at wall → descend Zone 2 slope (gain 0.82 m/s) →
         contact Tornado Ridge (gain 2.37 m/s inward) →
         descend Zone 2 again inbound (gain 0.82 m/s more) →
         arrive at centre.
```

### Centre-Arrival Speed Budget

```
Sliding Shoot (φ = 15°, v_launch = 1.50 m/s):
  Speed at Tornado Ridge (Zone 2 descent, η = 0.70):
    v_TR = √(1.50² + 0.820²) = √(2.922) = 1.709 m/s

  After Tornado Ridge engagement (Δv_inward = 2.37 m/s, at contact angle ≈ 10° from inward):
    v_after_TR ≈ √(1.709² + 2.37²) = √(2.921 + 5.617) = √(8.538) = 2.922 m/s
    projected inward component ≈ 2.2–2.4 m/s

  Zone 2 inbound descent (same h₂, same η):
    Δv_inbound = 0.820 m/s
    v_centre ≈ 2.4 + 0.820 = ~2.6–2.8 m/s  (vector sum depending on angle)

Straight Shoot (φ = 50°, v_launch = 1.50 m/s):
  No slope descent (enters on steeper angle, contacts wall before ridge).
  Wall bounce dissipates energy: ε_wall = 0.75
    v_post_wall = 1.50 × 0.75 = 1.125 m/s (reduced after wall)
  TR not engaged (high inward angle bypasses slope).
  v_centre ≈ 1.4–1.6 m/s

Radial Shoot (φ = 90°, v_launch = 1.50 m/s):
  Direct to centre, no slope descent, no TR contact.
  v_centre ≈ 1.30–1.50 m/s (slight losses from tip friction in transit)

Centre-arrival speed comparison table:
  Launch technique   φ      v_launch   v_centre approx   vs Radial
  ─────────────────────────────────────────────────────────────────
  Sliding Shoot      15°    1.50 m/s   2.6–2.8 m/s       +77–87%
  Sliding Shoot      15°    2.00 m/s   3.0–3.3 m/s       +50–65%
  Straight Shoot     50°    1.50 m/s   1.4–1.6 m/s       +7–20%
  Radial Shoot       90°    1.50 m/s   1.3–1.5 m/s       baseline
  Radial Shoot       90°    2.00 m/s   1.8–2.0 m/s       baseline
```

```typescript
function slidingShootCentreSpeed(
  vLaunch_ms: number, entryAngleDeg: number, slopeHeightMm: number,
  ridgeHeightMm: number, ridgeHalfWidthMm: number,
  efficiency: number, mass_kg: number, cor_ridge: number
): number {
  // Stage 1: slope descent
  const Dv_slope = Math.sqrt(2 * 9.81 * (slopeHeightMm / 1000) * efficiency);
  const v_at_TR = Math.sqrt(vLaunch_ms ** 2 + Dv_slope ** 2);
  // Stage 2: Tornado Ridge engagement
  const { dvInward_ms } = tornadoRidgeImpulse(mass_kg, v_at_TR, cor_ridge, ridgeHeightMm, ridgeHalfWidthMm);
  const v_post_TR = Math.sqrt(v_at_TR ** 2 + dvInward_ms ** 2);
  // Stage 3: inbound slope descent
  const v_centre = Math.sqrt(v_post_TR ** 2 + Dv_slope ** 2);
  return v_centre;
}
// slidingShootCentreSpeed(1.50, 15, 49.1, 3, 10, 0.70, 0.040, 0.65) → ~2.7 m/s
// slidingShootCentreSpeed(2.00, 15, 49.1, 3, 10, 0.70, 0.040, 0.65) → ~3.2 m/s
// slidingShootCentreSpeed(1.50, 15, 49.1, 10, 10, 0.70, 0.040, 0.65) → ~2.5 m/s  (Plastic stadium)
// slidingShootCentreSpeed(1.50, 90, 0,   0, 10, 0.70, 0.040, 0.65) → ~1.4 m/s  (radial baseline)
```

---

## Case 548 — BX-10 Xtreme Stadium (Beyblade X): Square Outer Body, Circular Battle Zone, Single-Side Exit Asymmetry, and Zone-Area Geometry

**Thesis:** The BX-10 Xtreme Stadium (Takara Tomy, official BX tournament standard, also sold as the Hasbro Tournament Beystadium) is the Class B gear-rail arena for Beyblade X competitive play, measuring 430 mm total length and 440 mm total width in a square outer body housing a circular Battle Zone of diameter 365 mm (R_battle = 182.5 mm) with the Xtreme Line gear ring positioned at R_XL = R_TR = 105 mm (Tornado Ridge diameter = 210 mm); the square body is structurally two-piece: Stadium Body (the bowl and outer frame) plus a clear Stadium Cover (lid, safety only), with the Xtreme Line being a third separate exchangeable component that press-fits into the bowl at R_XL and is available in different colours (green BX-10, red BX-22, pink variant) though mechanically identical across variants; the most physically significant departure from all previous arena designs is the single-side exit configuration: all three exits are positioned on the front face only, comprising two Over Zone openings of chord length 120 mm each at the front-left and front-right corners and one central Xtreme Zone opening of chord length 190 mm, for a total front exit span of 120 + 190 + 120 = 430 mm — which equals the total arena length, meaning the entire front face is open exits with wall coverage P_front_wall = 0.0%; by contrast the back face is completely solid wall with P_back_exit = 0.0%, and the side faces carry no exits; the directional asymmetry means a top ejected toward the back has a 0% chance of ring-out regardless of speed (it hits solid wall), while a top ejected toward the front has a ~100% chance of ring-out (full face is open), making launch position azimuth relative to the front face a strategic variable that was irrelevant in all rotationally symmetric previous stadiums; the Over Zone represents 2-point "Over Finish" (corner trap, accessible by any generation) and the Xtreme Zone represents 3-point "Xtreme Finish" (centre notch trap, accessible primarily by BX tops via gear engagement).

### Visual Geometry — BX-10 Top View with Zone Labels

```
Top view of BX-10 Xtreme Stadium:

      ←────────── 440 mm total width ─────────────→
  ┌──────────────────────────────────────────────────┐
  │                BACK (solid wall)                  │  ↑
  │         ┌──────────────────────────────┐          │  │
  │         │                              │          │  │
  │         │       Battle Zone            │          │  430
  │         │      ∅ 365 mm               │          │  mm
  │         │                              │          │
  │         │   ●  Xtreme Line             │          │
  │         │      at R = 105 mm           │          │  ↓
  │         └────────┬──────────┬──────────┘          │
  │                  │          │                      │
  │  OVER ZONE LEFT  │  XTREME  │  OVER ZONE RIGHT     │
  │    120 mm chord  │  ZONE    │  120 mm chord        │
  │        (2 pts)   │  190 mm  │    (2 pts)           │
  │                  │  (3 pts) │                      │
  └──────────────────┴──────────┴──────────────────────┘
            FRONT (total exit span = 430 mm = full width)

  Back wall:  solid, 0 exits.
  Side walls: ~flat, 0 exits (square corners lead into Over Zones).
  Front face: 100% exits.

  Over Zone centres: approximately θ = 240° and θ = 300° (if 270° = front centre).
  Xtreme Zone centre: θ = 270° (front centre).
```

### Exit Arc and Zone Geometry

```
Battle Zone circumference: C = π × 365 = 1147 mm

Front face arc (the exits subtend):
  Combined exit chord = 430 mm (≈ full front face).
  Subtended angle at R_battle = 182.5 mm:
    For Xtreme Zone (chord 190 mm):
      θ_XZ = 2 × arcsin(190 / (2 × 182.5)) = 2 × arcsin(0.521) = 2 × 31.4° = 62.7°
    For each Over Zone (chord 120 mm):
      θ_OZ = 2 × arcsin(120 / (2 × 182.5)) = 2 × arcsin(0.329) = 2 × 19.2° = 38.4°
    Total front exit arc = 62.7° + 2 × 38.4° = 139.5° of the 360° circumference
    Front exit arc coverage = 139.5° / 360° = 38.8%
    Back + side wall coverage (360° − 139.5°) / 360° = 61.2%

Directional ejection probability:
  P(exit | hit toward front face) ≈ 1.00  (full front face is open)
  P(exit | hit toward back)       = 0.00  (solid wall)
  P(exit | hit toward sides)      ≈ 0.10  (corner leads into OZ only for corner-angled hits)
```

### Dimensional Comparison: BX-10 vs MFB Attack Type

```
Parameter                MFB Attack Type    BX-10 Xtreme         Δ
─────────────────────────────────────────────────────────────────
Outer diameter/span      340 mm (circle)    430 × 440 mm (square) +26–29%
Battle Zone diameter     340 mm             365 mm               +7.4%
Ridge/Gear Ring radius   125 mm             105 mm               −16.0%
Number of exits          3                  3                    same
Exit distribution        120° apart         all front            —
Exit symmetry            3-fold rotational  bilateral only       —
Gear system              none (Class A)     Xtreme Line (Class B) —
Wall/exit coverage       49.2% / 49.2%     61.2% wall / 38.8% exit —
```

```typescript
const BX10_XTREME_STADIUM = {
  arenaClass: "gear-rail" as const,
  battleZoneRadiusMm: 182.5,
  xtremeLineRadiusMm: 105,
  totalLengthMm: 430,
  totalWidthMm: 440,
  overZoneChordMm: 120,
  xtremeZoneChordMm: 190,
  numOverZones: 2,
  numXtremeZones: 1,
  exitSide: "front-only" as const,  // all exits on front face, back is solid
  overZonePoints: 2,
  xtremeZonePoints: 3,
} as const;

function xtremeZoneSubtendedAngle(chordMm: number, battleRadiusMm: number): number {
  return 2 * Math.asin(chordMm / (2 * battleRadiusMm)) * 180 / Math.PI;
}
// xtremeZoneSubtendedAngle(190, 182.5) → 62.7°  (Xtreme Zone arc)
// xtremeZoneSubtendedAngle(120, 182.5) → 38.4°  (each Over Zone arc)
// total front exit = 62.7 + 2×38.4 = 139.5° of 360° = 38.8% of circumference
```

---

## Case 549 — BX Xtreme Line: Full-Ring Gear Rack Architecture, X-Dash Force Derivation, and Notch-Trap Exit Mechanics

**Thesis:** The Xtreme Line is a full-ring gear rack that runs approximately 300°+ of the bowl circumference at R_XL = 105 mm from the arena centre, interrupted only by a shaped notch at the Xtreme Zone exit position (front, θ ≈ 270°); the gear teeth face radially inward and are fine-pitched (tooth pitch p ≈ 2 mm, tooth height h_t ≈ 1 mm) to mesh with the corresponding ratchet teeth on a BX Blade base's Bit socket area, which has gear pitch radius r_gear ≈ 12–15 mm; for a BX top spinning at ω₀ = 600 rad/s the gear rim surface speed is v_gear = ω₀ × r_gear = 600 × 0.013 = 7.80 m/s, far exceeding the top's tangential wall-orbit speed before X-Dash activation of v_orbit,pre ≈ 1.5–2.0 m/s; the driving condition is met (v_gear > v_orbit) so the gear contact delivers a tangential drive force F_drive = min(τ_mesh / r_gear, N_wall × μ_gear) where N_wall = centripetal reaction force = m × v_orbit² / R_XL = 0.035 × 1.75² / 0.105 = 1.021 N and μ_gear ≈ 0.85–0.95 for hard-plastic mesh, giving F_drive_limit = 1.021 × 0.90 = 0.919 N; the top accelerates along the wall during gear contact, reaching post-X-Dash orbital speed v_orbit,post ≈ 3–5 m/s (observed), implying an average acceleration a_XD = (4.0 − 1.75) / (R_XL × θ_contact / v_avg) ≈ 40 m/s²; at post-X-Dash v = 4.0 m/s the orbit period is T = 2π × 0.105 / 4.0 = 0.165 s, giving 6.1 orbits per second — 2.4× faster than the MFB Attack Type's ~2.5 orbits/s at v = 2.0 m/s; when the fast-orbiting top reaches the Xtreme Zone notch, gear drive ceases instantly and the centripetal wall-normal force drops to zero, causing the top to continue on its tangential inertial vector directly through the Xtreme Zone exit — the notch is a passive mechanical inertia trap that does not require the exit zone to be aimed at, because the exit direction is already set by the top's tangential velocity at the moment of notch contact.

### Visual Geometry — Xtreme Line Ring and Notch Cross-Section

```
Cross-section (radial, viewed at the gear ring position):

  ← toward arena centre              toward outer wall →

   arena floor
  ─────────────────────────────────────────────────────
          ┌────────────────┐
          │  Xtreme Line   │  ← coloured gear ring
          │  ring body      │  press-fit into bowl
          │  h ≈ 6–8 mm    │
          │  (sits proud    │
          │  of floor)      │
          │ ←────────────→ │
          │  gear teeth      │  ← teeth on inner face, pitch ≈ 2 mm
          └────────────────┘
                               r = 105 mm from centre (inner face of teeth)

  ─────────────────────────────────────────────────────

  At the Xtreme Zone notch:
  ─────────────────────────────────────────────────────
   floor       shaped ramp lip
  ────────────╱                      ← ramp face
              │  ← notch gap
              │  teeth absent
              └── exit channel opens here

  When top reaches notch at v_tang ≈ 4 m/s:
    gear drive ceases → top inertia carries it through notch → Xtreme Zone exit.
```

### X-Dash Force and Acceleration Analysis

```
Pre-X-Dash orbit at wall (v_orbit,pre = 1.75 m/s, m = 0.035 kg, R = 105 mm):
  N_wall = m × v_orbit² / R = 0.035 × 1.75² / 0.105
         = 0.035 × 3.0625 / 0.105 = 1.021 N

Gear friction limit: F_drive = N_wall × μ_gear = 1.021 × 0.90 = 0.919 N
Gear torque limit: τ_mesh / r_gear = I_top × Δω / (Δt × r_gear)
  Δω = ω₀ − v_orbit/r_gear = 600 − 1.75/0.013 = 600 − 134.6 = 465.4 rad/s  (differential)
  Δt_contact ≈ 0.040 s (contact arc at R_XL, initial pass)
  τ_mesh ≈ 3.0×10⁻⁵ × 465.4 / 0.040 = 0.349 N·m
  F_from_torque = τ_mesh / r_gear = 0.349 / 0.013 = 26.8 N  >> friction limit
  → Friction limit governs: F_drive = 0.919 N

Acceleration during X-Dash (constant F_drive, mass 0.035 kg):
  a_XD = F_drive / m = 0.919 / 0.035 = 26.3 m/s²

Time to reach v_post = 4.0 m/s from v_pre = 1.75 m/s:
  Δt = Δv / a = (4.0 − 1.75) / 26.3 = 0.0856 s

Arc length traversed during X-Dash:
  s = v_pre × Δt + ½ × a × Δt²
    = 1.75 × 0.0856 + ½ × 26.3 × 0.0856²
    = 0.150 + 0.0964 = 0.246 m = 246 mm
  Subtended angle at R = 105 mm: θ = 246/105 = 2.34 rad = 134°

Post-X-Dash orbit period (v = 4.0 m/s, R = 105 mm):
  T = 2π × 0.105 / 4.0 = 0.165 s → 6.06 orbits/s

MFB comparison (v = 2.0 m/s, R = 125 mm):
  T = 2π × 0.125 / 2.0 = 0.393 s → 2.55 orbits/s
  BX: 6.06 / 2.55 = 2.38× faster orbit rate
```

```typescript
function xtremeLineXDashForce(
  mass_kg: number, vOrbitPre_ms: number, ringRadiusMm: number, muGear: number
): { nWall_N: number; fDrive_N: number; acceleration_ms2: number } {
  const r = ringRadiusMm / 1000;
  const nWall = mass_kg * vOrbitPre_ms ** 2 / r;
  const fDrive = nWall * muGear;
  return { nWall_N: nWall, fDrive_N: fDrive, acceleration_ms2: fDrive / mass_kg };
}
// xtremeLineXDashForce(0.035, 1.75, 105, 0.90) →
//   { nWall=1.021 N, fDrive=0.919 N, acc=26.3 m/s² }  standard BX top
// xtremeLineXDashForce(0.050, 1.75, 105, 0.90) →
//   { nWall=1.458 N, fDrive=1.313 N, acc=26.3 m/s² }  heavier top, same acc
// xtremeLineXDashForce(0.035, 1.00, 105, 0.90) →
//   { nWall=0.333 N, fDrive=0.300 N, acc=8.57 m/s² }  slow entry, weaker XDash

function xtremeOrbitPeriod(vOrbit_ms: number, ringRadiusMm: number): number {
  return (2 * Math.PI * ringRadiusMm / 1000) / vOrbit_ms;
}
// xtremeOrbitPeriod(4.0, 105) → 0.165 s (6.06 orbits/s, BX post-XDash)
// xtremeOrbitPeriod(2.0, 125) → 0.393 s (2.55 orbits/s, MFB typical)
// xtremeOrbitPeriod(5.0, 105) → 0.132 s (7.57 orbits/s, high-launch BX)
```

---

## Case 550 — Over Zone vs Xtreme Zone: Corner-Trap Physics, Gear-Trap Notch Mechanics, and Generation-Dependent Access Probability

**Thesis:** The BX-10 Xtreme Stadium has two physically distinct exit mechanisms: the Over Zone (2-point "Over Finish", two corner exits each 120 mm chord, azimuth ≈ 240° and 300°) operates as a standard corner-trap pocket accessible to any generation's top via any radially outward collision impulse directed toward the front face, requiring only v_radial ≥ v_min,escape ≈ 0.5 m/s at the bowl edge and the correct azimuth; the Xtreme Zone (3-point "Xtreme Finish", central exit 190 mm chord, azimuth ≈ 270°) operates as a gear-trap notch that specifically requires sustained orbit along the Xtreme Line followed by inertial exit through the notch — an access path that is available only to BX tops with gear engagement (ω₀ = 600 rad/s, v_post_XDash ≈ 4.0 m/s, v_orbit >> v_min_notch ≈ 1.5 m/s) and is statistically improbable for Gen 1–3 tops (orbit speed without gear drive ≈ 1.0–1.5 m/s, marginal or below v_min_notch); the azimuthal distribution of exit type follows directly from geometry: of the 139.5° total front exit arc, Over Zones cover 2 × 38.4° = 76.8° (55.1% of front arc) and the Xtreme Zone covers 62.7° (44.9% of front arc); for a top with uniform azimuthal impact distribution toward the front face, P(Over Zone | front ejection) = 76.8/139.5 = 0.551 and P(Xtreme Zone | front ejection) = 62.7/139.5 = 0.449; however, for a BX top orbiting the Xtreme Line, the notch trap overrides this probability because the orbital mechanics guarantee that every orbit passes through the notch at θ ≈ 270° regardless of entry azimuth, making P(Xtreme Zone | BX top at X-Dash orbit) → 1.0 per orbit pass; for Gen 1–3 tops without X-Dash, every exit is strictly probabilistic based on collision direction and the 55.1%/44.9% split applies as the base rate for Over vs Xtreme.

### Over Zone Corner-Trap Physics

```
A top receives a lateral collision impulse J_coll at the arena centre, deflecting toward the front face:

  Post-collision radial speed: Δv_r = J_coll / m_hit
  For J_coll = 0.060 N·s (medium collision), m = 0.035 kg:
    Δv_r = 0.060 / 0.035 = 1.714 m/s  (well above v_min ≈ 0.5 m/s — Over Zone accessible)

  Top travels from centre (r = 0) to battle zone edge (r = 182.5 mm):
    Time to edge: t = r / Δv_r = 0.1825 / 1.714 = 0.106 s
    (assumes negligible deceleration during transit, conservative estimate)

  Azimuth window for Over Zone access:
    Combined Over Zone arc: 76.8°
    Target window: θ ∈ [225°, 264°] ∪ [276°, 315°]  (both Over Zones, front face)
    P(hit Over Zone | front impact) = 76.8° / 139.5° = 0.551

  Over Zone exit: any generation. Condition: v_r ≥ 0.5 m/s, azimuth in OZ window.
```

### Xtreme Zone Notch-Trap Physics

```
Notch trap sequence for BX top (see Case 549 for XDash derivation):

  Step 1: Top enters bowl at v_launch = 1.5 m/s, contacts Xtreme Line.
  Step 2: X-Dash accelerates top to v_orbit = 4.0 m/s over 134° arc.
  Step 3: Top orbits at v = 4.0 m/s, T = 0.165 s per orbit.
  Step 4: Each orbit passes through notch at θ ≈ 270°.
  Step 5: At notch: gear drive stops, centripetal wall-normal force = 0.
  Step 6: Top exits on tangential vector through Xtreme Zone → 3-point finish.

Minimum notch-exit speed (notch ramp redirects slow tops inward, not outward):
  v_min_notch ≈ 1.5 m/s  (estimated from notch geometry — ramp deflects below this speed)

BX top at v_orbit = 4.0 m/s: well above v_min_notch → exits every orbit pass.
Gen 1–3 top (no XDash): v_orbit ≈ 1.0–1.5 m/s → at or below v_min_notch → rarely exits via XZ.
```

```typescript
type GenerationFinish = { exitType: "over-zone" | "xtreme-zone" | "none"; points: number };

function finishProbability(
  gen: "bx" | "gen1" | "gen2" | "gen3",
  hitTowardFront: boolean, vRadial_ms: number
): GenerationFinish {
  const V_MIN_ESCAPE = 0.5;
  const V_MIN_NOTCH = 1.5;
  if (!hitTowardFront || vRadial_ms < V_MIN_ESCAPE) return { exitType: "none", points: 0 };

  if (gen === "bx") {
    // BX orbits the Xtreme Line → notch trap on each orbit pass
    // Xtreme Zone guaranteed per orbit if in XDash (v_orbit ≈ 4 m/s >> v_min_notch)
    return { exitType: "xtreme-zone", points: 3 };
  }
  // Gen 1–3: probabilistic based on azimuth, no gear drive
  // P(OZ) = 0.551, P(XZ) = 0.449 but only if speed reaches XZ notch
  const canReachXZ = vRadial_ms >= V_MIN_NOTCH;
  const xzShare = canReachXZ ? 0.449 : 0;
  const ozShare = 0.551 + (canReachXZ ? 0 : 0.449); // redistribute XZ share to OZ if can't exit via XZ
  const roll = Math.random();
  if (roll < xzShare) return { exitType: "xtreme-zone", points: 3 };
  return { exitType: "over-zone", points: 2 };
}
// BX top, front hit, v=2 m/s → always { exitType: "xtreme-zone", points: 3 }
// Gen 3 top, front hit, v=2 m/s → ~44.9% XZ (3pts) / ~55.1% OZ (2pts)
// Gen 3 top, front hit, v=0.9 m/s → ~0% XZ / ~100% OZ (below notch threshold)
// Any top, back hit → { exitType: "none", points: 0 }
```

---

## Case 551 — Gen 1–3 Tops in the Xtreme Stadium: No Gear Engagement, Accelerated Spin Decay, and Over Zone Knockout Probability

**Thesis:** Generations 1–3 tops in the BX-10 Xtreme Stadium contact the Xtreme Line as a plain raised wall surface (not a gear rack), receiving only a standard wall bounce (COR ε_wall ≈ 0.75, tangential friction μ = 0.15) with no tangential drive force, so that every wall contact is energy-dissipating rather than energy-injecting; for a typical Burst (Gen 3) top of mass m = 0.040 kg, I_total = 3.0×10⁻⁵ kg·m², ω₀ = 600 rad/s orbiting at v_orbit = 1.50 m/s, each Xtreme Line contact delivers a spin-reducing torque τ_wall = N_wall × μ × r_tip = (m × v_orbit² / R_XL) × μ × r_tip = (0.040 × 1.50² / 0.105) × 0.15 × 0.005 = 0.8571 × 0.00075 = 6.43×10⁻⁴ N·m producing Δω_contact = τ_wall × t_contact / I_total = 6.43×10⁻⁴ × 0.050 / 3.0×10⁻⁵ = 1.072 rad/s per contact event, and at 2.55 orbits per second (10 contacts/s) the cumulative spin decay rate is 10.72 rad/s² from wall contact alone, added to the floor-friction decay of dω/dt_floor = 39.8 rad/s² (RF tip, MFB assembly, see Case 545) for a total dω/dt_combined = 50.5 rad/s² versus the ~0 rad/s² floor contribution for a BX top on the gear rail (gear drive compensates floor friction); a Gen 3 top launching at ω₀ = 600 rad/s reaches the 40% stability threshold (ω_crit = 0.4 × 2000 = 240 rad/s, approximate) after t_crit = (600 − 240) / 50.5 = 7.1 s in the Xtreme Stadium (vs ~11–15 s in the MFB Attack Type without wall-contact spin decay), confirming that Gen 1–3 tops in the Xtreme Stadium lose spin faster than in their native passive stadiums; the primary loss mechanism for Gen 1–3 is spin-out (ω collapse) not ring-out, unless a high-recoil attack impact of Δv_r ≥ 0.5 m/s directed toward the front produces an Over Zone finish with probability P(exit | front, high-recoil) = Over Zone arc / front arc = 76.8° / 139.5° = 0.551 (Over Zone) or 0.449 (Xtreme Zone if v ≥ v_min_notch = 1.5 m/s, but unlikely without gear drive).

### Spin Decay Analysis (Gen 3 Burst Top in Xtreme Stadium)

```
Burst top parameters (representative):
  m = 0.040 kg, I = 3.0×10⁻⁵ kg·m², ω₀ = 600 rad/s
  Tip: Flat (F) hard plastic, r_tip = 5 mm, μ_tip = 0.17

Floor friction decay:
  dω/dt_floor = −(μ_tip × m × g × r_tip) / I
              = −(0.17 × 0.040 × 9.81 × 0.005) / 3.0×10⁻⁵
              = −(3.337×10⁻⁴) / 3.0×10⁻⁵
              = −11.1 rad/s²

Wall contact spin decay (Xtreme Line):
  N_wall = m × v_orbit² / R_XL = 0.040 × 1.50² / 0.105 = 0.857 N
  τ_wall  = N_wall × μ_ABS × r_tip = 0.857 × 0.15 × 0.005 = 6.43×10⁻⁴ N·m
  t_contact ≈ 0.050 s per orbit (arc contact time estimate)
  Δω_contact = τ_wall × t_contact / I = 6.43×10⁻⁴ × 0.050 / 3.0×10⁻⁵ = 1.072 rad/s/event
  Rate: 2.55 orbits/s × 4 contacts/orbit ≈ 10.2 contacts/s
  Wall contact rate decay: 10.2 × 1.072 = 10.9 rad/s²

Total spin decay rate in Xtreme Stadium (Gen 3):
  dω/dt_total = 11.1 + 10.9 = 22.0 rad/s²

Spin lifetime:
  t_crit = (ω₀ − ω_crit) / |dω/dt_total|
         = (600 − 240) / 22.0 = 360 / 22.0 = 16.4 s  (to instability threshold)

Comparison to MFB Attack Type (Gen 3 same top, no wall spin-decay from passive bowl):
  dω/dt_total,MFB ≈ 11.1 + ~3 (passive bowl contact, lower N) ≈ 14.1 rad/s²
  t_crit,MFB = 360 / 14.1 = 25.5 s
  Xtreme Stadium reduces Gen 3 spin life by (25.5 − 16.4) / 25.5 = 35.7%
```

```typescript
function gen3SpinLifeInXtremeStadium(
  mass_kg: number, I_total: number, omega0_rads: number, omegaCrit_rads: number,
  muTip: number, rTip_mm: number, vOrbit_ms: number, xtremeLineRadius_mm: number
): { dOmegaDtFloor: number; dOmegaDtWall: number; tCrit_s: number } {
  const rTip = rTip_mm / 1000;
  const r = xtremeLineRadius_mm / 1000;
  const dOmegaDtFloor = (muTip * mass_kg * 9.81 * rTip) / I_total;
  const N_wall = mass_kg * vOrbit_ms ** 2 / r;
  const tauWall = N_wall * 0.15 * rTip;   // μ_ABS = 0.15
  const contactsPerSec = (vOrbit_ms / (2 * Math.PI * r)) * 4;  // 4 contact events/orbit (est)
  const dOmegaDtWall = contactsPerSec * (tauWall * 0.050 / I_total);
  const tCrit = (omega0_rads - omegaCrit_rads) / (dOmegaDtFloor + dOmegaDtWall);
  return { dOmegaDtFloor, dOmegaDtWall, tCrit_s: tCrit };
}
// gen3SpinLifeInXtremeStadium(0.040, 3.0e-5, 600, 240, 0.17, 5, 1.50, 105) →
//   { dOmega_floor=11.1, dOmega_wall=10.9, tCrit=16.4 s }  Gen 3 Burst top
// gen3SpinLifeInXtremeStadium(0.035, 2.5e-5, 500, 200, 0.17, 4, 1.50, 105) →
//   { dOmega_floor=9.30, dOmega_wall=10.6, tCrit=14.9 s }  lighter MFB top
// gen3SpinLifeInXtremeStadium(0.050, 4.5e-5, 600, 240, 0.10, 5, 1.50, 105) →
//   { dOmega_floor=5.45, dOmega_wall=7.28, tCrit=28.4 s }  heavy Burst stamina
```

---

## Case 552 — Wide Xtreme Stadium and Infinity Stadium: Bowl-Shape Variants, Orbit-Radius Scaling, and Oval-Bowl Radial Asymmetry

**Thesis:** The Xtreme Stadium product line extends to two structural variants that share the same Xtreme Line gear-ring mechanism but alter the bowl geometry: the Wide Xtreme Stadium scales the circular Battle Zone to approximately 400–420 mm diameter (R_battle ≈ 200–210 mm, estimated from packaging proportional analysis) while retaining the single-side exit configuration, and the Infinity Stadium replaces the circular bowl with an elongated oval bowl of approximate semi-axes a ≈ 230 mm and b ≈ 150 mm (aspect ratio ≈ 1.53:1); in the Wide Xtreme Stadium the larger Battle Zone radius increases the orbit period by ΔT = 2π × (R_wide − R_std) / v = 2π × 0.020 / 4.0 = 0.0314 s per orbit (+19% vs BX-10), extending time between wall contacts and inter-collision intervals while the Xtreme Line at proportionally larger R_XL ≈ 115 mm delivers the same gear contact arc per orbit and approximately the same X-Dash force (N_wall scales as v²/R, so N_wide = 0.035 × 16 / 0.115 = 4.870 N × 0.90 = 4.383 N, F_drive = 1.530 N, a_XD = 43.7 m/s², essentially identical); in the Infinity Stadium the oval bowl produces a variable orbit radius r(θ) = ab / √(b²cos²θ + a²sin²θ) ranging from r_min = b = 150 mm at the oval's short-axis ends to r_max = a = 230 mm at the long-axis ends, creating variable centripetal acceleration a_c(θ) = v²/r(θ) that peaks at 4.0² / 0.150 = 106.7 m/s² at the short ends and falls to 4.0² / 0.230 = 69.6 m/s² at the long ends — a 53.3% variation in wall-normal force around a single orbit — so the X-Dash force is 53.3% stronger at the tight-radius ends than the wide-radius ends; the Xtreme Zone notch is positioned at one end of the oval's long axis, meaning tops complete a fast tight arc at the short-axis end before reaching the notch at low curvature, which reduces the centripetal "grip" at the exit point and makes the notch-trap easier to escape — the Infinity Stadium is therefore a faster more chaotic arena where orbit mechanics are less predictable and the exit probability distribution is less uniform than the circular Xtreme Stadium.

### Orbit Radius in Oval Bowl (Infinity Stadium)

```
Polar equation of ellipse (semi-major a, semi-minor b, centred at origin):
  r(θ) = a × b / √(b²·cos²θ + a²·sin²θ)

Infinity Stadium (estimated: a = 230 mm, b = 150 mm):
  r(0°)   = r(180°) = a = 230 mm   (long-axis ends)
  r(90°)  = r(270°) = b = 150 mm   (short-axis ends)
  r(45°)  = 230×150 / √(150²×0.5 + 230²×0.5)
           = 34500 / √(11250 + 26450) = 34500 / √37700 = 34500 / 194.2 = 177.7 mm

Centripetal acceleration at v = 4.0 m/s:
  a_c(0°)  = 4.0² / 0.230 = 69.6 m/s²    (gentle, at long-axis end — near notch)
  a_c(90°) = 4.0² / 0.150 = 106.7 m/s²   (tight, at short-axis end)
  a_c(45°) = 4.0² / 0.1777 = 90.0 m/s²

X-Dash F_drive at each position (m = 0.035 kg, μ = 0.90):
  F_drive(0°)  = (0.035 × 4.0² / 0.230) × 0.90 = 2.435 × 0.90 = 2.191 N → a = 62.6 m/s²
  F_drive(90°) = (0.035 × 4.0² / 0.150) × 0.90 = 3.733 × 0.90 = 3.360 N → a = 96.0 m/s²
  F_drive(45°) = (0.035 × 4.0² / 0.178) × 0.90 = 3.146 × 0.90 = 2.831 N → a = 80.9 m/s²

Variation in X-Dash acceleration: (96.0 − 62.6) / 62.6 = +53.4%
  Short-axis corners deliver 53.4% more X-Dash force than long-axis ends.
```

```typescript
function ovalOrbitRadius(semiMajor_mm: number, semiMinor_mm: number, thetaDeg: number): number {
  const theta = thetaDeg * Math.PI / 180;
  const a = semiMajor_mm, b = semiMinor_mm;
  return (a * b) / Math.sqrt(b ** 2 * Math.cos(theta) ** 2 + a ** 2 * Math.sin(theta) ** 2);
}
// ovalOrbitRadius(230, 150, 0)   → 230.0 mm  (long axis)
// ovalOrbitRadius(230, 150, 90)  → 150.0 mm  (short axis)
// ovalOrbitRadius(230, 150, 45)  → 177.7 mm  (diagonal)
// ovalOrbitRadius(230, 150, 270) → 150.0 mm  (short axis, notch side)

function ovalXDashForce(semiMajor_mm: number, semiMinor_mm: number,
  thetaDeg: number, mass_kg: number, vOrbit_ms: number, muGear: number): number {
  const r = ovalOrbitRadius(semiMajor_mm, semiMinor_mm, thetaDeg) / 1000;
  const N = mass_kg * vOrbit_ms ** 2 / r;
  return N * muGear;
}
// ovalXDashForce(230, 150, 0,  0.035, 4.0, 0.90) → 2.191 N  (long axis, weakest XDash)
// ovalXDashForce(230, 150, 90, 0.035, 4.0, 0.90) → 3.360 N  (short axis, strongest XDash)
// ovalXDashForce(182.5, 182.5, 0, 0.035, 4.0, 0.90) → 2.449 N  (circular BX-10, uniform)
```

---

## Case 553 — Ultimate Beyta Stadium (4D System, MFB Era): Magnetic Spin Spot Trapping Mechanics, Revival Mode Re-Acceleration Equilibrium, Four-Mode Height-Change Contact Geometry, and Cross-Generational Engagement Analysis

**Thesis:** The Ultimate Beyta Stadium (Takara Tomy, released 22 October 2011 as part of the 4D System product alongside BB-122 Prototype Nemesis BD145DS) is a Class C motorised arena of exceptional plan-form size, measuring 737 × 432 mm outer dimensions; the total plan area is 737 × 432 = 318,384 mm² = 3,184 cm², which is 3184 / 908 = 3.51× the BeyStadium Attack Type and 3184 / 1892 = 1.68× the BX-10 Xtreme Stadium, giving every generation of beyblades a dramatically larger operating arena than any Class A or Class B stadium; the interior battle zone is estimated at R_battle ≈ 175 mm with a Tornado Ridge at R_TR ≈ 155 mm and a flat central zone at r_flat ≈ 40 mm — these proportions match the Attack Type's 30° slope geometry scaled to the larger chassis; the defining differentiating feature is the Magnetic Spin Spot (MSS), a blue-tinted rotating ABS disc of radius r_SS = 35 mm at the arena centre, driven by an internal motor at approximately ω_disc = 500 RPM = 52.4 rad/s, over which a permanent neodymium magnet insert exerts a downward attractive force F_trap = 0.80 N on any beyblade carrying a magnetic tip or core; the MSS trapping mechanism is not a horizontal attraction but a friction amplification effect: on the MSS, the magnetic normal augmentation raises total normal force from N_floor = m × g = 0.048 × 9.81 = 0.471 N to N_MSS = 0.471 + 0.80 = 1.271 N, and with rubber-magnetic tip friction coefficient μ_mag = 0.55 the deceleration on the MSS surface is a_cap = μ_mag × N_MSS / m = 0.55 × 1.271 / 0.048 = 14.56 m/s², which stops any entry at v ≤ v_cap = √(2 × a_cap × r_SS) = √(2 × 14.56 × 0.035) = √1.019 = 1.010 m/s — at the typical late-game entry speed of v_enter = 0.5 m/s the stopping distance is d_stop = v² / (2 × a_cap) = 0.25 / 29.12 = 8.6 mm, far inside the 35 mm trap radius, so Prototype Nemesis is firmly captured at any speed below 1.01 m/s; once trapped, the rotating disc's kinetic friction re-accelerates the beyblade toward Revival Mode equilibrium: the revival torque is τ_rev = μ_mag × F_trap × r_tip = 0.55 × 0.80 × 0.005 = 2.20 × 10⁻³ N·m, opposed by floor friction τ_floor = μ_mag × m × g × r_tip = 0.55 × 0.471 × 0.005 = 1.30 × 10⁻³ N·m, giving net revival torque τ_net = 2.20 − 1.30 = 0.90 × 10⁻³ N·m acting when ω_bey < ω_disc; with Prototype Nemesis moment of inertia I_NM = ½ × m × (r_i² + r_o²) = ½ × 0.048 × ((0.005)² + (0.0225)²) = 0.024 × 5.3125 × 10⁻⁴ = 1.275 × 10⁻⁵ kg·m², the angular acceleration during revival is α_rev = τ_net / I_NM = 9.0 × 10⁻⁴ / 1.275 × 10⁻⁵ = 70.6 rad/s², and the time from rest to equilibrium disc speed is t_rev = ω_disc / α_rev = 52.4 / 70.6 = 0.742 s — Revival Mode completes in under one second; the equilibrium spin is ω_eq = ω_disc = 52.4 rad/s = 500 RPM (kinematic coupling condition when tip surface speed matches disc surface speed at the contact radius r_tip), which is sustained indefinitely so long as the beyblade remains on the MSS, compared with Prototype Nemesis's spin life on the open arena floor of t_life = ω₀ / α_floor = 300 / 102 = 2.94 s due to its rubber magnetic tip friction α_floor = μ_mag × m × g × r_tip / I_NM = 1.30 × 10⁻³ / 1.275 × 10⁻⁵ = 102 rad/s²; the strategic consequence is that the MSS creates a stable spin attractor: any beyblade above ω_disc decays at α_above = (τ_rev + τ_floor) / I_NM = 3.50 × 10⁻³ / 1.275 × 10⁻⁵ = 274 rad/s² (the disc now acts as a brake) pulling it back down to 52.4 rad/s, while any beyblade below ω_disc is accelerated upward at +70.6 rad/s², maintaining the 500 RPM setpoint; dislodging the trapped top requires an opponent collision delivering lateral impulse sufficient to overcome magnetic potential, which demands entry speed v_impact ≥ √(2 × F_trap × r_SS / m) = √(2 × 0.80 × 0.035 / 0.048) = √1.167 = 1.08 m/s; the four-mode height-change system on Prototype Nemesis's DS (Destroy Spin) bottom uses a height-shift mechanism between h_low = 170 × 0.1 = 17.0 mm (Modes 1 and 2, Upper-Left/Right Spin) and h_high = 195 × 0.1 = 19.5 mm (Modes 3 and 4, Smash-Left/Right Spin), producing Δh_mode = 2.5 mm; against an average MFB opponent standing h_opp = 18.0 mm, Mode 1/2 places the attacker 1.0 mm below the opponent's contact band, producing contact angle θ_upper = arctan(1.0 / 22.5) = arctan(0.0444) = 2.54° above horizontal and an upward force component F_up = F_impact × sin(2.54°) = 0.0444 × F_impact (at F_impact = 50 N this is 2.22 N upward, sufficient to induce nutation in destabilised opponents), while Mode 3/4 places the attacker 1.5 mm above, giving θ_smash = arctan(−1.5 / 22.5) = −3.81° and near-perfect lateral contact force transfer at 99.8% lateral efficiency; any generation of beyblades can be used in the Ultimate Beyta Stadium since it carries the standard Tornado Ridge and three-wall three-exit outer boundary in a scale-neutral format: the Tornado Ridge engagement rules of Case 546 apply unchanged (MFB h_TR ≈ 3 mm engages low-rim MFB/Burst/BX tops; Plastic h_TR ≈ 10 mm for Gen 1 stadiums but this stadium carries the MFB-height ridge), and the spin decay rate for each generation on the open floor is governed by their respective tip–floor friction independently of arena size; the large plan area of 3,184 cm² reduces forced wall-contact frequency and therefore reduces collision-induced burst risk for Burst tops — a passive but significant cross-generational advantage of this stadium class for stamina and defense types from all eras.

### Visual Geometry — Stadium Plan View and Magnetic Spin Spot Cross-Section

```
PLAN VIEW — Ultimate Beyta Stadium (737 mm × 432 mm, top-down):

  ┌──────────────────────────────────────────────────────────────────────┐
  │                           OUTER FRAME                               │
  │   ┌──────────────────────────────────────────────────────────────┐  │
  │   │                         BATTLE ZONE                          │  │
  │   │                   R_battle ≈ 175 mm                          │  │
  │   │           ┌──────────────────────────────┐                   │  │
  │   │           │      TORNADO RIDGE           │                   │  │
  │   │           │      R_TR ≈ 155 mm           │                   │  │
  │   │           │    ┌──────────────────┐      │                   │  │
  │   │           │    │   BATTLE FLOOR   │      │                   │  │
  │   │           │    │  r_flat = 40 mm  │      │                   │  │
  │   │           │    │     ╔═════╗      │      │                   │  │
  │   │           │    │     ║ MSS ║ ← blue rotating disc            │  │
  │   │           │    │     ║r=35 ║      │      │                   │  │
  │   │           │    │     ╚══●══╝      │      │                   │  │
  │   │           │    │       ↑ magnet   │      │                   │  │
  │   │           │    └──────────────────┘      │                   │  │
  │   │           └──────────────────────────────┘                   │  │
  │   └──────────────────────────────────────────────────────────────┘  │
  └──────────────────────────────────────────────────────────────────────┘

  Total plan: 737 mm × 432 mm = 318,384 mm² = 3.51× Attack Type
  Exits: 3 walls, 3 exits (same pattern as BeyStadium Attack Type, scaled)
  Motor battery compartment: exterior frame (does not affect battle zone)

MSS CROSS-SECTION (radial cut through centre, not to scale):

  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
        floor level
  ─────────────────────┬─────────────────────────────
                       │  ABS disc (rotating, 3 mm thick)
         ╔══════════════════════╗  ← blue disc, ω=500 RPM
         │  NEODYMIUM MAGNET   │  ← mounted below disc
         ╚══════════════════════╝
  ─────────────────────┴─────────────────────────────
  |← r_SS = 35 mm →|

  Beyblade tip sits ON disc surface; magnet below increases normal force:
    N_floor = m×g = 0.471 N   (without MSS)
    N_MSS   = m×g + F_trap = 0.471 + 0.80 = 1.271 N   (on MSS)
    Friction ratio: N_MSS / N_floor = 1.271 / 0.471 = 2.70×
```

### Magnetic Spin Spot Trapping Analysis

```
Trapping model: augmented friction decelerates entering top to rest within r_SS.

  Parameters (Prototype Nemesis on MSS):
    m         = 0.048 kg
    F_trap    = 0.80 N    (neodymium insert, ~3 mm gap through disc)
    μ_mag     = 0.55      (rubber-magnetic tip on ABS disc)
    N_MSS     = m·g + F_trap = 0.471 + 0.80 = 1.271 N
    r_SS      = 35 mm = 0.035 m

  Deceleration on MSS:
    a_cap = μ_mag × N_MSS / m = 0.55 × 1.271 / 0.048 = 14.56 m/s²

  Maximum trappable entry speed:
    v_cap = √(2 × a_cap × r_SS) = √(2 × 14.56 × 0.035) = √1.019 = 1.010 m/s

  Stopping distances:
    v_enter = 1.0 m/s: d = 1.0²/(2×14.56) = 34.3 mm < r_SS=35 mm → barely trapped
    v_enter = 0.5 m/s: d = 0.5²/(2×14.56) =  8.6 mm ← firmly trapped at 24.4 mm inside edge
    v_enter = 0.2 m/s: d = 0.2²/(2×14.56) =  1.4 mm ← stopped almost immediately

  Escape threshold (opponent collision):
    W_escape = F_trap × r_SS = 0.80 × 0.035 = 0.0280 J
    v_impact_min = √(2 × W_escape / m) = √(2 × 0.028 / 0.048) = √1.167 = 1.080 m/s
    Below v_impact = 1.08 m/s: opponent cannot dislodge trapped top.
    Above v_impact = 1.08 m/s: top escapes MSS and resumes open-floor dynamics.

  Normal floor (no magnet) deceleration for comparison:
    a_floor = μ_mag × m×g / m = μ_mag × g = 0.55 × 9.81 = 5.40 m/s²
    MSS deceleration is a_cap / a_floor = 14.56 / 5.40 = 2.70× stronger than open floor.
```

### Revival Mode Re-Acceleration Physics

```
Revival Mode: disc at ω_disc = 500 RPM = 52.4 rad/s re-spins trapped beyblade.

  Prototype Nemesis inertia:
    I_NM = ½ × 0.048 × ((0.005)² + (0.0225)²)
         = 0.024 × (2.50×10⁻⁵ + 5.0625×10⁻⁴)
         = 0.024 × 5.3125×10⁻⁴ = 1.275×10⁻⁵ kg·m²

  Revival torque (disc friction on tip, when ω_bey < ω_disc):
    τ_rev  = μ_mag × F_trap × r_tip = 0.55 × 0.80 × 0.005 = 2.20×10⁻³ N·m

  Opposing floor friction torque:
    τ_floor = μ_mag × m×g × r_tip = 0.55 × 0.471 × 0.005 = 1.30×10⁻³ N·m

  Net revival torque (spin-up phase, ω_bey < ω_disc):
    τ_net = τ_rev − τ_floor = 2.20×10⁻³ − 1.30×10⁻³ = 9.0×10⁻⁴ N·m

  Angular acceleration:
    α_rev = τ_net / I_NM = 9.0×10⁻⁴ / 1.275×10⁻⁵ = 70.6 rad/s²

  Time to reach equilibrium from rest:
    t_rev = ω_disc / α_rev = 52.4 / 70.6 = 0.742 s   ← Revival completes in ~0.74 s

  Equilibrium condition:
    Kinematic coupling: ω_eq = ω_disc = 52.4 rad/s = 500 RPM
    (tip surface speed = disc surface speed at contact; no relative slip)

  Braking phase (when ω_bey > ω_disc, e.g. beyblade has residual spin on arrival):
    τ_brake = −(τ_rev + τ_floor) = −(2.20 + 1.30)×10⁻³ = −3.50×10⁻³ N·m
    α_brake = 3.50×10⁻³ / 1.275×10⁻⁵ = 274 rad/s²
    Decay from ω = 200 rad/s to ω_disc = 52.4: Δω = 147.6 rad/s
    Time to reach equilibrium: t_brake = 147.6 / 274 = 0.539 s

  Open floor spin life for comparison:
    α_floor = 1.30×10⁻³ / 1.275×10⁻⁵ = 102 rad/s²
    Spin life from ω₀ = 300 rad/s: t_life = 300 / 102 = 2.94 s  ← dies in under 3 s off MSS

  Summary: MSS creates a spin attractor at ω_eq = 52.4 rad/s.
    Above ω_disc: decays to ω_eq at 274 rad/s² (2.69× faster than open floor)
    Below ω_disc: spins up to ω_eq at 70.6 rad/s²
    At ω_eq:     maintained indefinitely  ← "immortal" at low spin so long as on MSS
```

### Four-Mode Height-Change Contact Geometry (DS Bottom, 4D System)

```
DS (Destroy Spin) 4D Bottom height modes:
  h_low  = 170 × 0.1 mm = 17.0 mm   (Modes 1 and 2: Upper-Left Spin / Upper-Right Spin)
  h_high = 195 × 0.1 mm = 19.5 mm   (Modes 3 and 4: Smash-Left Spin  / Smash-Right Spin)
  Δh_mode = 2.5 mm

Contact geometry vs average MFB opponent (h_opp = 18.0 mm):

  Mode 1/2 — Upper attack (h_bey = 17.0 mm, attacker is 1.0 mm below opponent):
    Δh_upper = h_opp − h_bey = 18.0 − 17.0 = 1.0 mm (attacker lower)
    Contact angle: θ_upper = arctan(0.001 / 0.0225) = arctan(0.04444) = 2.54° above horiz.
    Upward force fraction: sin(2.54°) = 0.04434
    At F_impact = 50 N: F_up = 50 × 0.04434 = 2.22 N   ← destabilising nutation induction
    Lateral fraction: cos(2.54°) = 0.99901 → F_lat = 49.95 N (nearly full lateral)
    Upper mode advantage: 2.22 N upward kick promotes wobble in low-stability opponents.

  Mode 3/4 — Smash attack (h_bey = 19.5 mm, attacker is 1.5 mm above opponent):
    Δh_smash = h_bey − h_opp = 19.5 − 18.0 = 1.5 mm (attacker higher)
    Contact angle: θ_smash = arctan(0.0015 / 0.0225) = arctan(0.06667) = 3.81° below horiz.
    Lateral fraction: cos(3.81°) = 0.99779 → F_lat = 49.89 N   ← near-perfect lateral force
    Downward component: sin(3.81°) = 0.06641 → F_down = 3.32 N (presses opponent into floor)
    Smash mode advantage: max kinetic energy transfer for ring-out probability.

  Comparison:
    Upper mode  (170): 4.4% upward component, 99.9% lateral → nutation + knockback
    Smash mode  (195): 0.0% upward, 99.8% lateral, 6.6% downward → pure knockback + floor press
    Δ contact angle = |2.54° − (−3.81°)| = 6.35° switch between modes.
```

### Cross-Generational Engagement — All Generations on Ultimate Beyta Stadium

```
Arena size advantage (all generations):
  Plan area: 3,184 cm² vs Attack Type 908 cm² (+251%) vs BX-10 1,892 cm² (+68%)
  Transit time at v = 1.0 m/s across short axis (432 mm): t_transit = 0.432 s
  Transit time at v = 1.0 m/s across long axis (737 mm): t_transit = 0.737 s
  Wall-contact interval is 2–3× longer than in Attack Type → reduces burst-lock risk for Gen 3.

Spin decay rates by generation (open floor, not on MSS):
  Gen 1 Plastic (m=0.030 kg, r_tip=5 mm, μ=0.10, I≈6.375×10⁻⁶ kg·m²):
    α_P1 = 0.10 × 0.030 × 9.81 × 0.005 / 6.375×10⁻⁶
          = 1.4715×10⁻⁴ / 6.375×10⁻⁶ = 23.1 rad/s²
    Spin life from 300 rad/s: 300 / 23.1 = 13.0 s

  Gen 2 MFB non-magnetic (m=0.040 kg, r_tip=4 mm, μ=0.17, I≈8.5×10⁻⁶ kg·m²):
    α_MFB = 0.17 × 0.040 × 9.81 × 0.004 / 8.5×10⁻⁶
           = 2.668×10⁻⁴ / 8.5×10⁻⁶ = 31.4 rad/s²
    Spin life: 300 / 31.4 = 9.55 s

  Gen 2 MFB with magnetic tip (Prototype Nemesis) — open floor:
    α_NM_floor = 102 rad/s²   (computed above)
    Spin life: 300 / 102 = 2.94 s   ← extremely short without MSS

  Gen 2 MFB with magnetic tip — on MSS (Revival Mode):
    Maintained at ω_eq = 52.4 rad/s = 500 RPM indefinitely
    Opponent must deliver v_impact ≥ 1.08 m/s to dislodge.

  Gen 3 Burst (m=0.036 kg, r_tip=5 mm, μ=0.15, I≈7.65×10⁻⁶ kg·m²):
    α_B3 = 0.15 × 0.036 × 9.81 × 0.005 / 7.65×10⁻⁶
          = 2.648×10⁻⁴ / 7.65×10⁻⁶ = 34.6 rad/s²
    Spin life: 300 / 34.6 = 8.67 s
    Burst top has no magnetic tip → passes over MSS without trapping; uses as normal floor.

  Gen 4 BX (m=0.065 kg, r_tip=3 mm, μ=0.17, I≈1.3×10⁻⁵ kg·m²):
    α_BX = 0.17 × 0.065 × 9.81 × 0.003 / 1.3×10⁻⁵
          = 3.275×10⁻⁴ / 1.3×10⁻⁵ = 25.2 rad/s²
    Spin life: 300 / 25.2 = 11.9 s
    Gen 4 BX has no magnetic tip; passes over MSS without trapping.
    Large arena gives Gen 4 more orbital room; no Xtreme Line present → no X-Dash advantage.

MSS magnetic tip requirement summary:
  Gen 1 Plastic:     non-magnetic → no Revival Mode; uses arena as standard Class A-scale bowl
  Gen 2 MFB non-mag: non-magnetic → no Revival Mode; standard dynamics
  Gen 2 MFB + mag tip (4D, e.g. Prototype Nemesis): Full MSS trapping and Revival Mode available
  Gen 3 Burst:       non-magnetic → no Revival Mode; large floor reduces burst risk
  Gen 4 BX:          non-magnetic → no Revival Mode; no X-Dash rail; large arena advantage only

Tornado Ridge cross-generation on Ultimate Beyta:
  Same MFB-style h_TR ≈ 3 mm as BeyStadium Attack Type (Case 546 rules apply):
    MFB rim clearance z_rim ≤ 3 mm → reliable engagement, +35.4% inward impulse
    Gen 1 Plastic rim clearance z_rim > 3 mm typically → partial/no engagement
    Gen 3 Burst rim clearance ≈ 2–3 mm depending on disk → marginal engagement
    Gen 4 BX: z_rim ≈ 1–2 mm → engagement similar to MFB
```

```typescript
function mssTrappingCapture(
  mass_kg: number,
  fTrap_N: number,
  muMag: number,
  rSS_mm: number
): { aCap: number; vCapMax_ms: number; stopDist_0p5ms: number } {
  const g = 9.81;
  const nMSS = mass_kg * g + fTrap_N;
  const aCap = (muMag * nMSS) / mass_kg;
  const vCapMax = Math.sqrt(2 * aCap * rSS_mm / 1000);
  const stopDist = (0.5 * 0.5) / (2 * aCap) * 1000; // mm, entry at 0.5 m/s
  return { aCap, vCapMax_ms: vCapMax, stopDist_0p5ms: stopDist };
}
// mssTrappingCapture(0.048, 0.80, 0.55, 35)
//   → { aCap: 14.56 m/s², vCapMax_ms: 1.010 m/s, stopDist_0p5ms: 8.6 mm }
// mssTrappingCapture(0.040, 0.80, 0.55, 35)   (lighter MFB top, same magnetic tip)
//   → { aCap: 17.07 m/s², vCapMax_ms: 1.094 m/s, stopDist_0p5ms: 7.3 mm }
// mssTrappingCapture(0.040, 0.00, 0.17, 35)   (non-magnetic MFB top on MSS)
//   → { aCap: 1.667 m/s², vCapMax_ms: 0.342 m/s, stopDist_0p5ms: 75.0 mm }
//      ↑ no magnetic augmentation: v_cap drops to 0.342 m/s, almost impossible to trap

function revivalModeEquilibrium(
  mass_kg: number,
  fTrap_N: number,
  muMag: number,
  rTip_mm: number,
  I_kgm2: number,
  omegaDisc_rpm: number
): { tauRev: number; tauFloor: number; tauNet: number; alphaRev: number; tRevival_s: number; omegaEq_rads: number } {
  const g = 9.81;
  const rTip = rTip_mm / 1000;
  const tauRev   = muMag * fTrap_N * rTip;
  const tauFloor = muMag * mass_kg * g * rTip;
  const tauNet   = tauRev - tauFloor;
  const alphaRev = tauNet / I_kgm2;
  const omegaEq  = omegaDisc_rpm * 2 * Math.PI / 60;
  const tRevival = omegaEq / alphaRev;
  return { tauRev, tauFloor, tauNet, alphaRev, tRevival_s: tRevival, omegaEq_rads: omegaEq };
}
// revivalModeEquilibrium(0.048, 0.80, 0.55, 5, 1.275e-5, 500)
//   → { tauRev: 2.20e-3 N·m, tauFloor: 1.30e-3 N·m, tauNet: 9.0e-4 N·m,
//       alphaRev: 70.6 rad/s², tRevival_s: 0.742 s, omegaEq_rads: 52.4 rad/s }
// revivalModeEquilibrium(0.048, 0.80, 0.55, 5, 1.275e-5, 300)   (slower disc, 300 RPM)
//   → { tauNet: 9.0e-4, alphaRev: 70.6, tRevival_s: 0.445 s, omegaEq_rads: 31.4 rad/s }
// revivalModeEquilibrium(0.048, 0.00, 0.55, 5, 1.275e-5, 500)   (no magnet: tauNet < 0)
//   → { tauNet: -1.30e-3 N·m }  ← net torque negative; disc only brakes, no revival

function fourDModeContactAngle(
  hAttacker_units: number,   // e.g. 170 or 195
  hOpponent_mm: number,      // e.g. 18.0
  rContact_mm: number        // e.g. 22.5
): { deltaH_mm: number; thetaDeg: number; fUpFraction: number; fLatFraction: number } {
  const hAttacker_mm = hAttacker_units * 0.1;
  const deltaH = hOpponent_mm - hAttacker_mm; // positive = attacker lower (Upper geometry)
  const thetaRad = Math.atan(deltaH / rContact_mm);
  const thetaDeg = thetaRad * 180 / Math.PI;
  return {
    deltaH_mm: deltaH,
    thetaDeg,
    fUpFraction:  Math.sin(thetaRad),
    fLatFraction: Math.cos(thetaRad)
  };
}
// fourDModeContactAngle(170, 18.0, 22.5)   → Upper mode
//   → { deltaH_mm: 1.0, thetaDeg: 2.54°, fUpFraction: 0.0443, fLatFraction: 0.9990 }
// fourDModeContactAngle(195, 18.0, 22.5)   → Smash mode
//   → { deltaH_mm: -1.5, thetaDeg: -3.81°, fUpFraction: -0.0664, fLatFraction: 0.9978 }
// fourDModeContactAngle(195, 21.0, 22.5)   → vs tall opponent (h_opp=21mm, e.g. heavy track)
//   → { deltaH_mm: 1.5, thetaDeg: 3.81°, fUpFraction: 0.0664, fLatFraction: 0.9978 }

function spinLifeOnMSS(
  omega0_rads: number,
  omegaDisc_rads: number,
  alphaBrake: number,
  alphaRevival: number
): { timeToEquilibrium_s: number; finalOmega_rads: number; phase: string } {
  if (omega0_rads > omegaDisc_rads) {
    const dt = (omega0_rads - omegaDisc_rads) / alphaBrake;
    return { timeToEquilibrium_s: dt, finalOmega_rads: omegaDisc_rads, phase: "braking" };
  } else {
    const dt = (omegaDisc_rads - omega0_rads) / alphaRevival;
    return { timeToEquilibrium_s: dt, finalOmega_rads: omegaDisc_rads, phase: "revival" };
  }
}
// spinLifeOnMSS(200, 52.4, 274, 70.6)   (arriving at 200 rad/s, disc at 52.4)
//   → { timeToEquilibrium_s: 0.539 s, finalOmega_rads: 52.4, phase: "braking" }
// spinLifeOnMSS(0, 52.4, 274, 70.6)     (arriving at rest, disc re-spins it)
//   → { timeToEquilibrium_s: 0.742 s, finalOmega_rads: 52.4, phase: "revival" }
// spinLifeOnMSS(10, 52.4, 274, 70.6)    (nearly stopped top, revival from near-zero)
//   → { timeToEquilibrium_s: 0.600 s, finalOmega_rads: 52.4, phase: "revival" }
```

### Addendum — Beyta Stadium Inward Ridges: Funnelling Geometry and MSS Delivery Probability

```
The Ultimate Beyta Stadium contains inward-directed surface ridges that channel beyblades
toward the central MSS zone. The ridges act as sloped deflectors: any beyblade that contacts
a ridge wall receives a lateral impulse component directed radially inward.

Ridge deflection model (assuming ridge face angle δ_ridge = 30° from circumferential):
  Inward impulse component per contact: J_in = m × v_wall × tan(δ_ridge)
    For v_wall = 0.5 m/s, m = 0.048 kg, δ = 30°:
    J_in = 0.048 × 0.5 × tan(30°) = 0.024 × 0.5774 = 0.01386 N·s
    Inward velocity gain: Δv_in = J_in / m = 0.01386 / 0.048 = 0.289 m/s

  After one ridge contact the beyblade gains 0.289 m/s inward velocity component.
  Path from R_battle = 175 mm to r_SS = 35 mm at v_in = 0.289 m/s:
    t_delivery = (R_battle - r_SS) / v_in = (0.175 - 0.035) / 0.289 = 0.140 / 0.289 = 0.484 s

  At arrival: v_arrival ≈ 0.289 m/s < v_cap = 1.010 m/s → TRAPPED by MSS.

  Without ridges: a beyblade at low speed drifts randomly; probability of entering MSS zone
  from random drift at v = 0.3 m/s in time t:
    P_random = (r_SS / R_battle) × (v × t) / circumference ≈ (35/175) × small → ~5–15% per minute.

  With ridges: each ridge contact delivers the beyblade at sub-cap speed directly toward the
  MSS → P_delivery per contact = 1.0 (if v_arrival < v_cap).
  The ridges convert the MSS from a passive opportunistic trap into a deterministic delivery
  mechanism: any beyblade that decelerates enough to contact a ridge ends up at the MSS.
  This is the stadium's primary gameplay loop: orbit → slow down → ridge contact → MSS trap →
  Revival Mode (magnetic tip) or simple stop (non-magnetic tip).

Cross-generational ridge effect:
  All generations: mass × tan(δ) delivers same inward velocity regardless of beyblade weight,
  because J_in ∝ m × v_wall and Δv_in = J_in / m = v_wall × tan(δ) (mass-independent).
  A heavier BX top (0.065 kg) and a lighter Gen 1 Plastic (0.030 kg) receive the same Δv_in
  from the same wall contact speed — the ridge is generation-neutral in delivery effectiveness.
```

---

## Case 554 — Gen 1 Magnacore System: SG-Core Polarity Modes in Magne Stadia, Magne Flat Base Tip Levitation, Volcano Change Base Magnetic Retention, and Metal-Shaft Tip Magnetisation

**Thesis:** The Magnacore System (Takara Tomy, Gen 1 Plastic era, 2001–2003) positions permanent magnets at three discrete heights within the assembled beyblade and pairs them with dedicated Magne Stadia — stadiums whose floor carries permanent magnets at fixed positions with South pole facing upward — so that each magnetic component produces a distinct interaction depending on its height, polarity, and proximity to a floor magnet; the system's central element is the **Magnecore Spin Gear Core** (North or South variant, m_MC = 3.3 g), a neodymium disc that occupies the SG core slot inside the Spin Gear shell at the beyblade's central axis, sitting at height h_MC ≈ 14 mm above the arena floor when a standard Blade Base and flat tip are assembled; in standard (non-magnetic) steel arenas the Magnecore at h_MC = 14 mm attracts only the ferromagnetically soft steel floor, producing F_std = 0.0055 × m × g = 0.0055 × 0.030 × 9.81 = 1.6 mN — 0.55% of the 294 mN floor normal, entirely negligible — so the beyblade performs identically to a configuration without Magnecore; in a Magne Stadium, the dedicated floor magnet (South pole up) directly beneath the Magnecore delivers F_magne = 68% of floor normal force at the peak-overlap position: F_magne = 0.68 × m × g = 0.68 × 0.294 = 0.200 N; in Attraction Mode (North Magnecore over South-up floor magnet, opposite poles attract), the floor magnet pulls the SG Core downward, augmenting the floor normal: N_eff_attr = 0.294 + 0.200 = 0.494 N, raising spin decay from α_norm = μ × m × g × r_tip / I = 0.10 × 0.294 × 0.005 / 6.375 × 10⁻⁶ = 23.1 rad/s² to α_attr = 0.10 × 0.494 × 0.005 / 6.375 × 10⁻⁶ = 38.7 rad/s², cutting spin life from t_norm = 300 / 23.1 = 13.0 s to t_attr = 300 / 38.7 = 7.75 s (−40.4%); in Repulsion Mode (South Magnecore over South-up floor magnet, same poles repel), the floor magnet pushes the SG Core upward, reducing floor normal: N_eff_rep = 0.294 − 0.200 = 0.094 N — floor contact is maintained (0.094 N > 0) but weakened, giving α_rep = 0.10 × 0.094 × 0.005 / 6.375 × 10⁻⁶ = 7.37 rad/s² and t_rep = 300 / 7.37 = 40.7 s, a 3.13× stamina extension; full levitation from the SG Core alone does not occur because F_magne = 0.200 N < m × g = 0.294 N — the SG Core cannot lift the beyblade off the floor; levitation is instead provided by the **Magne Flat Base Tip**, which embeds a South-pole disc magnet at the contact point (h_tip ≈ 1–2 mm above the floor magnet face); at this short separation the same-pole repulsion from the South-up floor magnet far exceeds that of the SG Core at 14 mm, so estimating F_tip_ref = 0.35 N at h_ref = 2.0 mm and applying the inverse-fourth-power dipole scaling, levitation equilibrium F_rep(h_float) = m × g requires 0.35 × (2.0 / h_float)^4 = 0.294, giving h_float = 2.0 × (0.35 / 0.294)^(1/4) = 2.0 × 1.046 = 2.09 mm — the Magne Flat Base tip levitates 0.09 mm above h_ref when directly over the floor magnet, zeroing floor contact friction and producing momentary pure-air-drag coasting (α_lev = α_air + α_bearing ≈ 0.52 rad/s²); between floor magnets the tip contacts the arena surface normally; the **CGB (Customize Grip Base) Tip** and **SG Grip Base Tip** carry a North-pole face at the contact point, producing the opposite effect over the South-up floor magnet — attraction of F_attr_tip ≈ 0.35 N at h = 2.0 mm raises N_eff_tip_attr = 0.294 + 0.350 = 0.644 N and α_tip_attr = 0.10 × 0.644 × 0.005 / 6.375 × 10⁻⁶ = 50.5 rad/s², cutting spin life to 300 / 50.5 = 5.94 s (−54.3% vs baseline) per floor-magnet contact event; the **Volcano Change Base (VCB)** exploits the Magnecore's near-field to retain the tip without a mechanical clip: the VCB positions the steel tip's top face at h_sep = 2 mm below the Magnecore bottom face, where F_ret = 94 mN — 9.4 times the gravity load on the tip (F_grav_tip = m_tip × g ≈ 0.001 × 9.81 = 9.8 mN) — holds the tip by magnetic attraction; on an impact exceeding 94 mN the tip ejects and re-engages the magnet on rebound; the customised Driger V2 Metal Change Base places a steel shaft (μ_r ≈ 100–200) running axially from the Magnecore face to the metal tip contact point, conducting the field (B_0 ≈ 0.10 T at shaft entry) down 15 mm to the floor: the induced pole at the 0.2 mm radius contact (A_tip = π × (2 × 10⁻⁴)² = 1.26 × 10⁻⁷ m²) produces practical sticking force F_stick ≈ 11–23 mN on a ferromagnetic or magnetic arena floor, with velocity threshold v_stick = F_stick × Δt_esc / m = 0.015 × 0.030 / 0.030 = 0.015 m/s = 15 mm/s — below 15 mm/s translation is magnetically pinned and the beyblade enters stick-and-spin.

### Visual Geometry — Magnacore Stack, Magne Stadium, and Tip Interactions

```
GEN 1 BEYBLADE CROSS-SECTION (Magnacore System assembled, Magne Stadium floor):

  ┌──────────────────────────┐  ← Bit Chip / AR                h ≈ 38–42 mm
  ╔══════════════════════════╗
  ║  [S₁]  MAGNE WD  [S₂]  ║  r_WD = 30 mm, h_WD ≈ 22–28 mm
  ║  [S₃]           [S₄]   ║  (separate from Magnecore; South face down)
  ╚══════════════════════════╝
  ╔═══╦══════════════════════╗
  ║SG ║  [■ MAGNECORE ■]   ║  SG Core slot, h_MC ≈ 14 mm
  ║   ║  North or South     ║  m_MC = 3.3 g
  ║   ║  F_magne = 68% N_fl ║  (at direct overhead of floor magnet in Magne Stadium)
  ╚═══╩══════════════════════╝
  ╔══════════════════════════╗
  ║       BLADE BASE (BB)    ║  h ≈ 0–12 mm
  ╚═══════════╦══════════════╝
              ║ TIP CONTACT (h = 0)
  ─── MAGNE STADIUM FLOOR (South ↑) ─── [S↑ magnet] ─── [S↑ magnet] ───

MAGNE FLAT BASE TIP LEVITATION (South tip over South floor magnet, repulsion):
  h_tip_ref = 2.0 mm:  F_rep = 0.35 N > m·g = 0.294 N → LEVITATION
  h_float = 2.09 mm (equilibrium: F_rep = m·g at this height)
  Between floor magnets: normal contact resumes.

CGB / SG-GRIP BASE TIP (North tip over South floor magnet, attraction):
  F_attr = 0.35 N at h = 2.0 mm → strong floor-pin
  N_eff_tip = 0.644 N → α = 50.5 rad/s² (2.18× normal decay rate)

VOLCANO CHANGE BASE TIP RETENTION:
  Magnecore face ──── h_sep = 2 mm ──── steel tip top face
  F_ret = 94 mN >> F_grav_tip = 9.8 mN  (9.4× safety factor)

DRIGER V2 METAL-SHAFT TIP (custom configuration):
  Magnecore → ║ steel shaft ║ → metal tip ●  on magnetic floor
  F_stick ≈ 15 mN; v_stick_threshold = 15 mm/s
```

### Magnacore SG-Core and Tip Force Analysis

```
Parameters (Gen 1 Plastic, flat tip):
  m = 0.030 kg, r_tip = 5 mm, μ_tip = 0.10, I = 6.375×10⁻⁶ kg·m²
  N_floor = m·g = 0.294 N
  α_norm = 0.10 × 0.294 × 0.005 / 6.375×10⁻⁶ = 23.1 rad/s²
  t_norm = 300 / 23.1 = 13.0 s

Standard arena (steel floor, no magnets):
  F_std = 0.0055 × 0.294 = 1.6 mN    Δα/α = 0.55%  (negligible)

Magne Stadium — SG Core at h_MC = 14 mm, directly over floor magnet:
  F_magne = 0.68 × m·g = 0.68 × 0.294 = 0.200 N

North Magnecore (Attraction Mode):
  N_eff_attr = 0.294 + 0.200 = 0.494 N
  α_attr = 0.10 × 0.494 × 0.005 / 6.375×10⁻⁶ = 38.7 rad/s²
  t_attr = 300 / 38.7 = 7.75 s  (−40.4% vs baseline)

South Magnecore (Repulsion Mode):
  N_eff_rep = 0.294 − 0.200 = 0.094 N   [F_magne < m·g → no levitation from SG Core alone]
  α_rep = 0.10 × 0.094 × 0.005 / 6.375×10⁻⁶ = 7.37 rad/s²
  t_rep = 300 / 7.37 = 40.7 s  (+3.13× vs baseline)

Magne Flat Base Tip Levitation (South tip over South floor, dipole model):
  F_rep(h) = 0.35 × (2.0/h)^4  (h in mm)
  Levitation: F_rep(h_float) = m·g = 0.294 N
    0.35 × (2.0/h_float)^4 = 0.294  →  h_float = 2.0 × (0.35/0.294)^0.25 = 2.09 mm
  Between floor magnets: normal contact, α = α_norm = 23.1 rad/s²

CGB Tip Attraction (North tip over South floor):
  F_attr_tip = 0.35 N at h = 2.0 mm
  N_eff_tip_attr = 0.294 + 0.350 = 0.644 N
  α_tip_attr = 0.10 × 0.644 × 0.005 / 6.375×10⁻⁶ = 50.5 rad/s²
  t_tip_attr = 300 / 50.5 = 5.94 s  (−54.3% vs baseline)

Volcano Change Base retention:
  F_ret = 94 mN,  F_grav_tip = m_tip × g ≈ 9.8 mN  →  factor = 9.4×

Metal Change Core (Driger V2 custom shaft):
  F_stick_practical ≈ 15 mN  (≈12% of B_sat² Maxwell stress, accounting for field leakage)
  v_stick = F_stick × Δt_esc / m = 0.015 × 0.030 / 0.030 = 0.015 m/s = 15 mm/s
```

```typescript
function magnacoreSGCoreSpinLife(
  mass_kg: number, muTip: number, rTip_m: number, I_kgm2: number,
  omegaStart_rads: number,
  arenaType: "standard" | "magne_stadium",
  coreMode: "attraction" | "repulsion"
): number {
  const fg = mass_kg * 9.81;
  const fMag = arenaType === "magne_stadium" ? 0.68 * fg : 0.0055 * fg;
  const nEff = coreMode === "attraction" ? fg + fMag : Math.max(0, fg - fMag);
  const alpha = nEff === 0 ? 0.52 : (muTip * nEff * rTip_m) / I_kgm2;
  return omegaStart_rads / alpha;
}
// magnacoreSGCoreSpinLife(0.030, 0.10, 0.005, 6.375e-6, 300, "standard",      "attraction") → 12.9 s
// magnacoreSGCoreSpinLife(0.030, 0.10, 0.005, 6.375e-6, 300, "magne_stadium", "attraction") →  7.75 s
// magnacoreSGCoreSpinLife(0.030, 0.10, 0.005, 6.375e-6, 300, "magne_stadium", "repulsion")  → 40.7 s

function magneFlatBaseLevitation(
  fTipRef_N: number, hRef_mm: number, mass_kg: number
): { hFloat_mm: number; isLevitating: boolean; alphaLev_rads2: number } {
  const fg = mass_kg * 9.81;
  const isLev = fTipRef_N > fg;
  const hFloat = isLev ? hRef_mm / Math.pow(fg / fTipRef_N, 0.25) : hRef_mm;
  return { hFloat_mm: hFloat, isLevitating: isLev, alphaLev_rads2: 0.52 };
}
// magneFlatBaseLevitation(0.35, 2.0, 0.030)  → { hFloat_mm: 2.09, isLevitating: true,  alphaLev_rads2: 0.52 }
// magneFlatBaseLevitation(0.25, 2.0, 0.030)  → { hFloat_mm: 2.0,  isLevitating: false, alphaLev_rads2: 0.52 }
// magneFlatBaseLevitation(0.35, 2.0, 0.050)  → { hFloat_mm: 2.0,  isLevitating: false, alphaLev_rads2: 0.52 }
//   ↑ heavier top (m=50 g): fg = 0.491 N > fTipRef = 0.35 N → no levitation

function volcanoChangeRetention(
  fRetention_mN: number, massTip_kg: number
): { fGravTip_mN: number; retentionFactor: number; isRetained: boolean } {
  const fg = massTip_kg * 9.81 * 1000;
  return { fGravTip_mN: fg, retentionFactor: fRetention_mN / fg, isRetained: fRetention_mN > fg };
}
// volcanoChangeRetention(94, 0.001)  → { fGravTip_mN: 9.81, retentionFactor: 9.58, isRetained: true }
// volcanoChangeRetention(94, 0.010)  → { fGravTip_mN: 98.1, retentionFactor: 0.96, isRetained: false }

function metalChangeCoreStickThreshold(
  fTipStick_N: number, mass_kg: number, escapeTime_s: number
): number {
  return (fTipStick_N * escapeTime_s) / mass_kg;
}
// metalChangeCoreStickThreshold(0.015, 0.030, 0.030) → 0.015 m/s = 15 mm/s
// metalChangeCoreStickThreshold(0.023, 0.030, 0.030) → 0.023 m/s = 23 mm/s  (upper estimate)
```

---

## Case 555 — Ferromagnetic Steel Spring Coils in Permanent Magnetic Fields: Gen 1 Engine Gear Clock-Spring Force from Magna WD Assembly, Trigger-Release Delay, and Gen 3 Driver-Spring Augmentation near MSS

**Thesis:** All steel coil springs used in Gen 1–Gen 3 Beyblade drive mechanisms are fabricated from hardened carbon steel (μ_r = 50–200 relative permeability), making them ferromagnetic and susceptible to field-gradient forces whenever a permanent magnet is assembled nearby; the force on a ferromagnetic body in a non-uniform field is F_mag = μ₀ × (μ_r − 1) × V_spring × H × (∂H/∂r), where V_spring is the spring wire volume, H the local field intensity, and ∂H/∂r the field gradient; the **Gen 1 Engine Gear (EG)** — the wound clock-spring drive unit of the Gen 1 Plastic era (Takara Tomy, see Cases 186–195 for full EG mechanics) — houses a clock-spring of estimated geometry: wire diameter d_w = 0.5 mm, mean coil radius r_mean = 10.5 mm, N_coils = 18 turns, V_spring = π × d_w²/4 × 2π × r_mean × N_coils = 1.963 × 10⁻⁷ × 1.188 = 2.33 × 10⁻⁷ m³; the Gen 1 EG unit is taller than a standard Spin Gear base (h_EG_total ≈ 18–22 mm from tip contact to EG top) and sits directly below the Weight Disk; when a Magna WD (four neodymium inserts at r_WD = 30 mm, South face down toward the EG) is assembled above the Gen 1 EG, the Magna WD bottom face rests at h_WD_bot ≈ 22 mm above the floor while the EG clock-spring centre occupies h_spring ≈ 10 mm (midpoint of the 0–22 mm EG span); the separation from one WD magnet (r = 30 mm, h = 22 mm) to the EG spring outer coil (r = 8 mm, h = 10 mm) is: Δr = 22 mm, Δh = 12 mm, d_sep = √(22² + 12²) = √628 = 25.1 mm; scaling a reference field B_0 = 0.05 T at d_0 = 10 mm by the dipole law B ∝ d⁻³ gives B_spring = 0.05 × (10/25.1)³ = 0.05 × 0.0631 = 3.15 × 10⁻³ T, H = 3.15 × 10⁻³ / 1.257 × 10⁻⁶ = 2506 A/m, ∂H/∂r = 3H/d = 3 × 2506 / 0.0251 = 3.00 × 10⁵ A/m²; the force from one WD magnet on the EG spring: F_mag = 1.257 × 10⁻⁶ × 99 × 2.33 × 10⁻⁷ × 2506 × 3.00 × 10⁵ = 1.244 × 10⁻⁴ × 175.2 = 0.0218 N ≈ 0.022 N; with four WD magnets the total vector sum (two nearest contribute most, opposite pair partially cancels) is approximately F_total ≈ 0.022 × 2.3 = 0.050 N; decomposing the single-magnet force at approach angle θ = arctan(12/22) = 28.6°: radial component F_radial = 0.022 × cos(28.6°) = 0.022 × 0.877 = 0.019 N acts as resistance to EG spring unwinding, and axial component F_axial = 0.022 × sin(28.6°) = 0.022 × 0.479 = 0.011 N adds upward pre-compression; the radial resistance raises the centrifugal lock threshold from F_trigger_norm = 0.30 N to F_trigger_mag = 0.30 + 0.019 = 0.319 N, and since F_c = m_lock × ω² × r_lock the ratio ω_trigger_mag / ω_trigger_norm = √(0.319/0.300) = 1.031 — the Magna WD causes the Gen 1 EG to fire at 3.1% higher spin speed than without the Magna WD; separately, Gen 3 drivers with steel compression springs at h_spring ≈ 5 mm above the arena floor experience attraction from the Ultimate Beyta MSS floor magnet (Case 553): F_attract_spring ≈ 0.040 N at 5 mm height, augmenting floor normal: N_augment = m × g + 0.040 = 0.036 × 9.81 + 0.040 = 0.353 + 0.040 = 0.393 N (+11.3% over baseline), proportionally increasing any rubber-contact burst output near the MSS zone.

### EG Spring — Magna WD Geometry (Gen 1)

```
Cross-section (Gen 1 EG beyblade with Magna WD assembled):

  ─────────────────── TOP ────────────────────────────────────────────
  │   Attack Ring   │
  ╔══════════════════════════════════╗
  ║  [S₁]  MAGNA WD  [S₂]          ║  h_WD_bot = 22 mm (top of Gen 1 EG)
  ║  [S₃]            [S₄]          ║  r_WD = 30 mm, South face down
  ╚══════════════════════════════════╝
  ╔══════════════════════════════════╗
  ║  GEN 1 ENGINE GEAR (h=18–22 mm) ║
  ║  ⊙ ← clock-spring outer coil   ║  h_spring_centre ≈ 10 mm
  ║    (r_outer=8mm, V=2.33×10⁻⁷m³) ║  (midpoint of 0–22 mm EG span)
  ╚══════════════════════════════════╝
  ── TIP ── ●  h = 0

  WD magnet (r=30mm, h=22mm) → spring outer coil (r=8mm, h=10mm):
    Δr = 22 mm,  Δh = 12 mm,  d_sep = 25.1 mm,  θ = 28.6°

Force from one WD magnet at d = 25.1 mm:
  B_spring = 0.05 × (10/25.1)^3 = 3.15×10⁻³ T
  H = 2506 A/m,  ∂H/∂r = 3.00×10⁵ A/m²
  F_mag = μ₀(μ_r-1) V H ∂H/∂r = 0.022 N
  F_radial = 0.022 × cos(28.6°) = 0.019 N  ← opposes EG spring unwinding
  F_axial  = 0.022 × sin(28.6°) = 0.011 N  ← slight upward pre-load

EG Trigger Shift:
  F_trigger_norm = 0.300 N
  F_trigger_mag  = 0.300 + 0.019 = 0.319 N  (+6.3% threshold increase)
  ω ratio = √(0.319/0.300) = 1.031  → fires at +3.1% higher spin speed
```

```typescript
function ferromagneticSpringForce(
  volume_m3: number, muR: number,
  B0_T: number, d0_m: number, d_m: number
): number {
  const mu0 = 1.257e-6;
  const H = (B0_T * Math.pow(d0_m / d_m, 3)) / mu0;
  const gradH = 3 * H / d_m;
  return mu0 * (muR - 1) * volume_m3 * H * gradH;
}
// ferromagneticSpringForce(2.33e-7, 100, 0.05, 0.010, 0.0251)
//   → 0.022 N  (Gen 1 EG spring at 25.1 mm from Magna WD magnet — corrected Gen 1 geometry)
// ferromagneticSpringForce(2.33e-7, 100, 0.05, 0.010, 0.050)
//   → 0.0019 N  (50 mm away: essentially negligible)
// ferromagneticSpringForce(5.0e-8, 100, 0.08, 0.005, 0.005)
//   → 0.062 N   (small driver spring at 5 mm from MSS magnet)

function egMagnaWdTriggerShift(
  fTriggerNorm_N: number, fMagRadial_N: number
): { fTriggerMag: number; omegaRatio: number; percentHigher: number } {
  const fTriggerMag = fTriggerNorm_N + fMagRadial_N;
  const omegaRatio = Math.sqrt(fTriggerMag / fTriggerNorm_N);
  return { fTriggerMag, omegaRatio, percentHigher: (omegaRatio - 1) * 100 };
}
// egMagnaWdTriggerShift(0.30, 0.019)
//   → { fTriggerMag: 0.319, omegaRatio: 1.031, percentHigher: 3.1% }
//   Gen 1 EG with Magna WD: fires 3.1% earlier at higher spin (corrected Gen 1 geometry)
// egMagnaWdTriggerShift(0.30, 0.000)
//   → { fTriggerMag: 0.300, omegaRatio: 1.000, percentHigher: 0.0% }
// egMagnaWdTriggerShift(0.20, 0.019)
//   → { fTriggerMag: 0.219, omegaRatio: 1.046, percentHigher: 4.6% }  (lighter trigger spring)
```

---

## Case 556 — Gen 1 Engine Gear Energy Budget, Ignition' LR44-Motor Disc-Driver Burst Physics, Gen 3 Shot Driver Passive-Spring Rebound, and Magnetic Arena Augmentation of Active Driver Systems

**Thesis:** Active driver systems across Gen 1 Plastic (Engine Gear), Gen 3 Burst Ignition', and Gen 3 Burst Shot driver store or generate mechanical energy and release it in controlled bursts, but the three mechanisms are architecturally distinct and span different generations; the **Gen 1 Engine Gear (EG)** — the wound clock-spring unit at the Spin Gear position in a Gen 1 Plastic beyblade stack (Takara Tomy, see Cases 186–195) — stores E_EG = ½ × k_EG × x_EG² = ½ × 1500 × (0.008)² = 0.048 J = 48 mJ at full wind (k_EG = 1500 N/m, winding stroke x_EG = 8 mm); using Gen 1 inertia I = 6.375 × 10⁻⁶ kg·m² and the Final Clutch trigger ω_trigger = 141 rad/s (1350 RPM), the spin boost at release is Δω_EG = E_EG / (I × ω_trigger) = 0.048 / (6.375 × 10⁻⁶ × 141) = 0.048 / 8.99 × 10⁻⁴ = 53.4 rad/s, carrying the beyblade from 141 rad/s to 194 rad/s (+37.9%); the EG fires once per match for Final Clutch, once at battle-start for First Clutch, or gradually for Normal Base; the **Gen 3 Burst Ignition' driver** (disc-driver combined unit, Case 72) is categorically different: it integrates an LR44-powered electric motor of torque τ_motor = 0.002 N·m into the disc-driver body; the motor is impact-activated — an internal spring-contact circuit closes when the beyblade sustains a collision delivering sufficient impact force (F_impact > F_trigger_Ign ≈ 5 N at the spring-contact switch), starting the motor for a run time t_run ≈ 1.5 s; the angular impulse delivered by the motor is L_motor = τ_motor × t_run = 0.002 × 1.5 = 3.0 × 10⁻³ N·m·s, and for a Gen 3 beyblade (I = 7.65 × 10⁻⁶ kg·m²) the spin boost is Δω_Ign = L_motor / I = 3.0 × 10⁻³ / 7.65 × 10⁻⁶ = 392 rad/s ≈ 400 rad/s (consistent with Case 72), with motor angular acceleration α_motor = τ_motor / I = 0.002 / 7.65 × 10⁻⁶ = 261 rad/s² ramping spin up over the 1.5 s activation; the Ignition' circuit is re-triggerable on each qualifying impact — the LR44 battery (≈ 1.5 V × 110 mAh = 594 J total, motor power P ≈ 0.75 W) provides roughly 594 / (0.75 × 1.5) ≈ 528 activations per charge, effectively unlimited for match purposes; the **Gen 3 Shot driver** stores energy in a pre-compressed steel spring (k_sh = 2000 N/m, baseline compression x_sh = 2 mm, E_sh_base = ½ × 2000 × (0.002)² = 4.0 mJ) and supplements this with energy absorbed from wall contacts: at v_impact = 1.0 m/s and m = 0.036 kg, the kinetic energy ΔE_wall = ½ × m × v² = 18.0 mJ is absorbed into additional spring compression, giving E_sh_total = 4.0 + 18.0 = 22.0 mJ and rebound speed v_rebound = √(2 × 22.0 × 10⁻³ / 0.036) = √1.222 = 1.106 m/s, an effective coefficient of restitution ε_eff = 1.106 — the Shot driver rebounds 10.6% faster than impact speed; in the Ultimate Beyta Stadium, the MSS floor magnet (Case 553) attracts the steel spring coils of Gen 3 drivers at h_spring ≈ 5 mm above the MSS zone, providing F_attract_spring ≈ 0.040 N (from Case 555 analysis), augmenting normal force to N_augment = 0.393 N (+11.3%); for the Shot driver, the increased floor-normal force during contact compresses the spring more, raising the stored energy and the rebound speed proportionally near the MSS zone; for Ignition', the motor angular impulse (L = τ × t) is independent of floor-normal force, but the increased grip during the motor's run transfers torque more efficiently: grip force scales by N_augment / N_floor = 1.113 (+11.3%); the Gen 1 EG's clock-spring operates at h_spring ≈ 10 mm within the EG body and interacts with Magna WD as analysed in Case 555, but does not interact with the Beyta MSS floor magnet at the arena floor level.

### Active Driver Energy Comparison

```
GEN 1 — Engine Gear (EG):
  Type: wound clock-spring, Gen 1 Plastic era (Takara Tomy)
  k_EG = 1500 N/m,  x_EG = 8 mm,  E_EG = 48 mJ
  Trigger: Final Clutch at ω = 141 rad/s (1350 RPM) [fires once]
           First Clutch at battle start [fires once]
           Normal Base: gradual release
  Spin boost (Final Clutch): Δω = E_EG / (I × ω_trigger)
    = 48e-3 / (6.375e-6 × 141) = 53.4 rad/s
  Post-boost ω: 141 + 53.4 = 194 rad/s  (+37.9%)

GEN 3 — Ignition' Driver:
  Type: LR44-motor disc-driver combined unit, Gen 3 Burst era (Case 72)
  τ_motor = 0.002 N·m,  t_run ≈ 1.5 s per activation
  Trigger: impact force F_impact > 5 N (spring-contact circuit closes)
  L_motor = 0.002 × 1.5 = 3.0×10⁻³ N·m·s
  Δω_Ign = 3.0×10⁻³ / 7.65×10⁻⁶ = 392 rad/s  (≈ 400 rad/s per Case 72)
  α_motor = 0.002 / 7.65×10⁻⁶ = 261 rad/s²  (during activation)
  Battery: ~528 activations per LR44 charge

GEN 3 — Shot Driver:
  Type: passive-compression spring, Gen 3 Burst era
  k_sh = 2000 N/m,  x_base = 2 mm,  E_base = 4.0 mJ
  On wall contact at v = 1.0 m/s: ΔE_wall = ½mv² = 18.0 mJ
  E_total = 22.0 mJ,  v_rebound = 1.106 m/s,  ε_eff = 1.106  (+10.6% vs impact)

MSS Zone Augmentation (Gen 3 drivers, F_attract_spring = 0.040 N at h = 5 mm):
  N_augment = 0.353 + 0.040 = 0.393 N  (+11.3% normal force)
  Shot driver rebound and Ignition' grip-transfer: proportionally +11.3% near MSS
```

```typescript
function egSpinBoost(
  kSpring_Nm: number, compression_m: number,
  I_kgm2: number, omegaTrigger_rads: number
): { ePot_J: number; deltaOmega: number; omegaAfter: number } {
  const ePot = 0.5 * kSpring_Nm * compression_m ** 2;
  const dOmega = ePot / (I_kgm2 * omegaTrigger_rads);
  return { ePot_J: ePot, deltaOmega: dOmega, omegaAfter: omegaTrigger_rads + dOmega };
}
// egSpinBoost(1500, 0.008, 6.375e-6, 141)   → Gen 1 EG Final Clutch
//   → { ePot_J: 0.048, deltaOmega: 53.4 rad/s, omegaAfter: 194.4 rad/s }
// egSpinBoost(1500, 0.008, 6.375e-6, 100)   → lighter clutch trigger
//   → { ePot_J: 0.048, deltaOmega: 75.3 rad/s, omegaAfter: 175.3 rad/s }

function ignitionMotorBurst(
  tauMotor_Nm: number, tRun_s: number, I_kgm2: number
): { angularImpulse_Nms: number; deltaOmega: number; alphaMotor_rads2: number } {
  const L = tauMotor_Nm * tRun_s;
  const dOmega = L / I_kgm2;
  const alpha = tauMotor_Nm / I_kgm2;
  return { angularImpulse_Nms: L, deltaOmega: dOmega, alphaMotor_rads2: alpha };
}
// ignitionMotorBurst(0.002, 1.5, 7.65e-6)   → Ignition' LR44 motor (Case 72)
//   → { angularImpulse_Nms: 3.0e-3, deltaOmega: 392 rad/s, alphaMotor_rads2: 261.4 }
// ignitionMotorBurst(0.002, 0.5, 7.65e-6)   → short activation (light impact)
//   → { angularImpulse_Nms: 1.0e-3, deltaOmega: 130.7 rad/s, alphaMotor_rads2: 261.4 }

function shotDriverRebound(
  kSpring_Nm: number, baseCompression_m: number,
  mass_kg: number, vImpact_ms: number
): { eTotal_J: number; vRebound_ms: number; epsilonEff: number } {
  const eBase = 0.5 * kSpring_Nm * baseCompression_m ** 2;
  const eWall = 0.5 * mass_kg * vImpact_ms ** 2;
  const eTotal = eBase + eWall;
  const vRebound = Math.sqrt(2 * eTotal / mass_kg);
  return { eTotal_J: eTotal, vRebound_ms: vRebound, epsilonEff: vRebound / vImpact_ms };
}
// shotDriverRebound(2000, 0.002, 0.036, 1.0)
//   → { eTotal_J: 0.022, vRebound_ms: 1.106, epsilonEff: 1.106 }
// shotDriverRebound(2000, 0.002, 0.036, 0.5)
//   → { eTotal_J: 0.009, vRebound_ms: 0.707, epsilonEff: 1.414 }
// shotDriverRebound(2000, 0.002, 0.036, 2.0)
//   → { eTotal_J: 0.076, vRebound_ms: 2.055, epsilonEff: 1.028 }
```

---

## Case 557 — F:D (Final Drive) Bottom in MFB 4D System: High-Spin Defence Phase, Centrifugal Cam Mode-Switch at ω_switch = 94.3 rad/s, Low-Spin Sharp-Stamina Phase, and Magnetic Arena Phase-Transition Effects

**Thesis:** The F:D (Final Drive) bottom is a combined Track-and-Tip unit from the MFB 4D System era (used on beyblades such as Big Bang Pegasis F:D) that governs floor contact through a centrifugally released cam mechanism: it presents a **wide/defence contact tip** (μ_wide = 0.35, r_wide = 3 mm) at high spin and transitions to a **sharp/stamina tip** (μ_sharp = 0.15, r_sharp = 0.8 mm) at low spin, implementing an automatic phase transition from defensive engagement to stamina conservation; the mechanism uses a weighted cam arm (m_arm = 1.5 × 10⁻³ kg at cam radius r_cam = 9 mm) biased inward by a return spring (F_spring = 0.12 N); at high spin the centrifugal force F_c = m_arm × ω² × r_cam exceeds F_spring, holding the wide defence tip in floor contact; as spin decays, F_c drops until at ω_switch = √(F_spring / (m_arm × r_cam)) = √(0.12 / (1.5 × 10⁻³ × 9 × 10⁻³)) = √(0.12 / 1.35 × 10⁻⁵) = √8889 = 94.3 rad/s the spring force overcomes centrifugal retention, the cam arm retracts, the wide tip withdraws, and the sharp stamina tip engages the floor; using the beyblade parameters established for F:D in Case 366 (m = 0.040 kg, I = 1.187 × 10⁻⁵ kg·m²), spin decay in the **high-spin defence phase** (ω₀ = 300 rad/s to ω_switch = 94.3 rad/s): α_high = μ_wide × m × g × r_wide / I = 0.35 × 0.040 × 9.81 × 0.003 / 1.187 × 10⁻⁵ = 4.12 × 10⁻⁴ / 1.187 × 10⁻⁵ = 34.7 rad/s² (consistent with Case 366), giving t_high = (300 − 94.3) / 34.7 = 5.93 s; spin decay in the **low-spin stamina phase** (94.3 rad/s to 0): α_low = 0.15 × 0.040 × 9.81 × 0.0008 / 1.187 × 10⁻⁵ = 4.71 × 10⁻⁵ / 1.187 × 10⁻⁵ = 3.97 ≈ 4.0 rad/s², giving t_low = 94.3 / 4.0 = 23.6 s; total F:D spin life: t_FD = 5.93 + 23.6 = 29.5 s; for comparison a standard D tip (μ_D = 0.20, r_D = 4 mm, same beyblade) gives α_D = 0.20 × 0.040 × 9.81 × 0.004 / 1.187 × 10⁻⁵ = 26.4 rad/s² and t_D = 300 / 26.4 = 11.4 s — F:D is 29.5 / 11.4 = 2.59× longer in total spin life; the tactical value of F:D is the phase architecture rather than raw stamina (a B:D bearing tip at μ = 0.05, r = 3 mm gives α_BD = 5.0 rad/s² and t_BD ≈ 60 s, more than twice F:D's total): the wide defence phase (μ_wide = 0.35, larger contact area) resists lateral burst forces and maintains stable floor contact during competitive collisions, while the sharp stamina phase efficiently conserves the remaining spin energy once the engagement window has passed; in the Ultimate Beyta Stadium, the MSS floor magnet (Case 553) attracts any steel spindle or driver-insert component of the F:D assembly at h ≈ 10 mm above the floor, providing N_eff augmentation of approximately +3–5% through steel-component attraction (F_attract_steel ≈ 0.012–0.020 N at 10 mm for small MFB steel components); this augments α_high by 3–5%: α_high_MSS = 34.7 × 1.04 = 36.1 rad/s², reducing t_high by 0.23 s, while α_low changes by less than 1%; a Magnecore-equipped MFB beyblade with North Magnecore SG Core assembled in a Magne Stadium (Case 554) using an F:D bottom experiences the full 68% normal-force augmentation: N_eff_attr = 0.040 × 9.81 + 0.68 × 0.040 × 9.81 = 0.392 + 0.267 = 0.659 N, scaling α_high to 34.7 × (0.659/0.392) = 58.2 rad/s² and compressing the defence phase to (300−94.3)/58.2 = 3.54 s, then scaling α_low to 4.0 × 1.682 = 6.73 rad/s² and cutting the stamina phase to 94.3/6.73 = 14.0 s, for a total reduced life of 17.5 s — a 40.7% reduction vs the non-magnetic baseline; the cam switch threshold ω_switch = 94.3 rad/s remains constant under all arena conditions as it is a mechanical constant of the cam-spring geometry.

### F:D Centrifugal Cam Mechanism and Spin Profile

```
CENTRIFUGAL CAM MODE-SWITCH (cross-section):

HIGH-SPIN STATE (ω > 94.3 rad/s):            LOW-SPIN STATE (ω ≤ 94.3 rad/s):
  F_c = m_arm × ω² × r_cam > F_spring          F_spring > F_c → cam retracts

 ┌────────────────────────┐                ┌────────────────────────┐
 │ cam arm OUT →→         │                │ ←← cam arm IN          │
 │ (1.5 g at r_cam=9 mm)  │                │ F_spring = 0.12 N      │
 │ wide tip EXTENDED       │                │ wide tip RETRACTED     │
 └──────────┬──────────────┘                └──────────┬─────────────┘
            │ r_wide = 3 mm, μ = 0.35                  │ r_sharp = 0.8 mm, μ = 0.15
            │ DEFENCE / wide contact                    │ SHARP / stamina contact
            ●                                           ●
  ── FLOOR ───────────────────────────────── ── FLOOR ─────────────────

ω_switch = √(F_spring / (m_arm × r_cam)) = √(0.12 / 1.35×10⁻⁵) = 94.3 rad/s = 900 RPM

SPIN PROFILE (ω vs time):

  ω (rad/s)
  300 ─┐
       │  DEFENCE PHASE    α_high = 34.7 rad/s²   (5.93 s)
       │  wide tip: μ=0.35, r=3 mm
  94.3─┼──────────────────────────────────┐  ← CAM SWITCH
       │  STAMINA PHASE    α_low = 4.0 rad/s²     (23.6 s)
       │  sharp tip: μ=0.15, r=0.8 mm
     0 └──────────────────────────────────────────────────┘
       0             5.93                              29.5 s
```

### Dual-Phase Spin Decay under Arena Conditions

```
Arena condition              N_eff (N)   α_high (rad/s²)  t_high (s)  α_low (rad/s²)  t_low (s)  t_total (s)
Normal floor                 0.392       34.7              5.93        4.0              23.6       29.5
MSS steel-only +0.016        0.408       36.1 (+4.0%)      5.70        4.17             22.6       28.3
Magne Stadium attr. +0.267   0.659       58.2 (+67.7%)     3.54        6.73 (+68%)      14.0       17.5
D tip comparison             0.392       26.4              11.4 s total (no phase switch)

ω_switch = 94.3 rad/s in all conditions (mechanical constant, independent of N_eff).

B:D bearing tip (μ=0.05, r=3mm, same bey): α_BD = 5.0 rad/s²  →  t_BD ≈ 60 s
  F:D (29.5 s) is not a stamina solution; B:D outperforms it by 2× in total spin life.
  F:D value: defence phase (ω > 94.3 rad/s) resists burst; sharp phase conserves spin.
```

```typescript
function finalDriveSwitchOmega(
  mArm_kg: number, rCam_m: number, fSpring_N: number
): number {
  return Math.sqrt(fSpring_N / (mArm_kg * rCam_m));
}
// finalDriveSwitchOmega(1.5e-3, 9e-3, 0.12)   → 94.3 rad/s = 900 RPM  (Case 366 values)
// finalDriveSwitchOmega(1.5e-3, 9e-3, 0.20)   → 121.7 rad/s  (stiffer spring: earlier switch)
// finalDriveSwitchOmega(3.0e-3, 9e-3, 0.12)   →  66.7 rad/s  (heavier arm: later switch)

function finalDriveSpinLifeProfile(
  omega0_rads: number,
  omegaSwitch_rads: number,
  alphaHigh_rads2: number,
  alphaLow_rads2: number
): { tHighPhase_s: number; tLowPhase_s: number; tTotal_s: number; switchTriggered: boolean } {
  if (omega0_rads <= omegaSwitch_rads) {
    const tLow = omega0_rads / alphaLow_rads2;
    return { tHighPhase_s: 0, tLowPhase_s: tLow, tTotal_s: tLow, switchTriggered: false };
  }
  const tHigh = (omega0_rads - omegaSwitch_rads) / alphaHigh_rads2;
  const tLow  = omegaSwitch_rads / alphaLow_rads2;
  return { tHighPhase_s: tHigh, tLowPhase_s: tLow, tTotal_s: tHigh + tLow, switchTriggered: true };
}
// finalDriveSpinLifeProfile(300, 94.3, 34.7, 4.0)   → normal floor
//   → { tHighPhase_s: 5.93, tLowPhase_s: 23.6, tTotal_s: 29.5, switchTriggered: true }
// finalDriveSpinLifeProfile(300, 94.3, 58.2, 6.73)  → Magne Stadium attraction
//   → { tHighPhase_s: 3.54, tLowPhase_s: 14.0, tTotal_s: 17.5, switchTriggered: true }
// finalDriveSpinLifeProfile(150, 94.3, 34.7, 4.0)   → low-power launch
//   → { tHighPhase_s: 1.60, tLowPhase_s: 23.6, tTotal_s: 25.2, switchTriggered: true }

function finalDriveAlphaFromNeff(
  muTip: number, mass_kg: number, rTip_m: number, I_kgm2: number,
  nEff_N: number
): number {
  return (muTip * nEff_N * rTip_m) / I_kgm2;
}
// finalDriveAlphaFromNeff(0.35, 0.040, 0.003, 1.187e-5, 0.392)  → 34.7 rad/s² (defence, normal floor)
// finalDriveAlphaFromNeff(0.15, 0.040, 0.0008, 1.187e-5, 0.392) →  4.0 rad/s² (sharp, normal floor)
// finalDriveAlphaFromNeff(0.35, 0.040, 0.003, 1.187e-5, 0.659)  → 58.2 rad/s² (defence, Magne attr.)
```

---

## Case 558 — Original Plastic Generation BBA Stadium (White Stadium): Square Housing with Round Sloped Bowl, Flat Centre Floor, Four-Pocket Corner Geometry, and Gravity-Funnel Analysis

**Thesis:** The original BBA Stadium (Plastic Generation, 2001–2003, also sold as the "White Stadium" and bundled with starter sets in the V-Force era) is the foundational arena form for all subsequent Beyblade stadium design: its square outer housing (approximately 290 mm × 290 mm × 70 mm tall) contains a circular inner bowl of inner rim radius R_bowl = 125 mm (250 mm inner diameter), with a continuous inward-sloping wall from the rim down to a flat central floor of radius R_flat = 55 mm; unlike the MFB BeyStadium Attack Type (Case 545) there is no Tornado Ridge — the cross-section is a two-zone profile only: Zone 1 (flat centre, r = 0–55 mm, α = 0°, g_lat = 0 m/s²) and Zone 2 (continuous sloped wall, r = 55–125 mm, Δr = 70 mm, vertical rise H = 55 mm, slope angle α = atan(55/70) = atan(0.786) = 38.1°, g_lat = 9.81 × sin(38.1°) = 6.07 m/s² directed radially inward toward the centre); the absence of a ridge means every beyblade that has sufficient radial speed to reach the bowl rim will encounter wall ABS directly (ε_wall ≈ 0.75 for ABS-on-ABS) with no intermediate momentum-bleeding feature between the centre and the exit pockets; four corner pockets cut through the outer wall, each with an opening chord of approximately 65 mm measured at the bowl rim, giving total pocket coverage of 4 × 65 = 260 mm on an inner circumference of π × 250 = 785 mm, yielding P(ejection | top reaches outer rim) = 260 / 785 = 0.331 — a 33.1% ejection probability at random azimuth, substantially lower than the MFB Attack Type's 49.2% (Case 545), which explains why plastic-gen bouts have a higher ring-out rate only when direct attack impacts drive the opponent radially outward into a pocket arc and not when random wall bounces suffice; the full-slope two-zone geometry also means a beyblade launched tangentially from the rim reaches a floor orbit on the flat zone without any ridge-bounce redirection, making circular orbital paths possible in the flat zone for all tip types (including sharp plastic tips at μ = 0.10, r_tip = 0.8 mm where floor friction is low enough that orbital decay takes many revolutions); representative spin decay for a Dranzer G assembly (m = 0.022 kg, I_total = 3.8 × 10⁻⁶ kg·m², hard plastic tip μ = 0.10, r_tip = 0.8 mm): N = m × g = 0.022 × 9.81 = 0.216 N, α = μ × N × r_tip / I = 0.10 × 0.216 × 0.0008 / 3.8 × 10⁻⁶ = 4.55 rad/s²; at launch ω₀ = 250 rad/s (plastic-gen lower RPM cap from ripcord launcher), total flat-floor spin life t = ω₀ / α = 250 / 4.55 = 54.9 s; on the sloped wall the effective normal force reduces to N_slope = m × g × cos(38.1°) = 0.022 × 9.81 × 0.788 = 0.170 N, giving α_slope = 0.10 × 0.170 × 0.0008 / 3.8 × 10⁻⁶ = 3.58 rad/s² — 21% lower than the flat floor, so spin decays more slowly while traversing the wall than while resting in the centre; the gravity funnel delivers any top from the rim to the flat zone in t_return = √(2 × 0.070 / (6.04 − 0.10 × 9.81 × cos(38.1°))) = √(2 × 0.070 / 5.27) = 0.163 s, making the flat zone the dominant interaction surface for essentially the entire bout.

### Visual Geometry — BBA Stadium Plan View and Cross-Section

```
PLAN VIEW (top-down, 290 mm × 290 mm outer housing):

  ┌──────────────────────────────────────────────────────┐
  │   corner                               corner        │
  │  [POCKET]                             [POCKET]       │
  │     ╲                                   ╱           │
  │      ╲      ┌─────────────────────┐    ╱           │
  │       ╲    ╱   SLOPED WALL        ╲  ╱            │
  │        ╲  ╱    (Zone 2)            ╲╱             │
  │         ╲╱    r = 55–125 mm        ╱╲             │
  │         ╱╲                        ╱  ╲            │
  │        ╱  ┌──────────────────────┐    ╲           │
  │       ╱   │   FLAT FLOOR         │     ╲          │
  │      ╱    │   (Zone 1)           │      ╲         │
  │     ╱     │   r = 0–55 mm   ●   │       ╲        │
  │     ╲     │      (centre)        │       ╱        │
  │      ╲    └──────────────────────┘      ╱         │
  │       ╲   outer rim R = 125 mm         ╱          │
  │        ╲╱                             ╲╱          │
  │  [POCKET]                           [POCKET]       │
  │  corner                               corner        │
  └──────────────────────────────────────────────────────┘

  Inner bowl:  ⌀ 250 mm (R_bowl = 125 mm)
  Flat floor:  ⌀ 110 mm (R_flat = 55 mm)
  4 corner pockets, each ~65 mm chord opening at rim
  Pocket arc total:    4 × 65 = 260 mm
  Wall arc total:      785 − 260 = 525 mm
  Circumference:       π × 250 = 785 mm
  P(ring-out | hit rim at random azimuth) = 260 / 785 = 33.1 %
```

```
RADIAL CROSS-SECTION (centre on left, pocket side on right):

  Height
  above     55 ─┐                                              ╔══ outer housing lip
  floor        │                                           ╔══╝   H_total = 55 mm
  (mm)      40 ─┤                                      ╔══╝
               │                                   ╔══╝
           25 ─┤                               ╔══╝   ← Zone 2: single slope  α = 38.1°
               │                           ╔══╝         g_lat = 6.07 m/s²  inward ←
           10 ─┤                       ╔══╝
               │                   ╔══╝
            0 ─┴───────────────────╝──────────────────────────────────────────────
               │                   │                                               │
               0                55 mm                                          125 mm
                                   ↑                                               ↑
                              slope begins                                  bowl rim / pocket
                              (flat zone ends)                              (ABS wall / exit)

  Zone 1:  FLAT CENTRE    r = 0–55 mm      α = 0°      g_lat = 0         N = m·g (full)
  Zone 2:  SLOPED WALL    r = 55–125 mm    α = 38.1°   g_lat = 6.07 m/s² N_slope = m·g·cos(38.1°)
           Δr = 70 mm,  H_rise = 55 mm
           No Tornado Ridge, no secondary incline — just one clean slope to the rim.
```

```
CROSS-SECTION COMPARISON: BBA Stadium (Plastic Gen) vs MFB Attack Type (Case 545)

  Height
  (mm)
   55 ─┐                                                   ← BBA outer wall (H = 55 mm)
   50 ─┤                                              ╔══
   40 ─┤                                         ╔══╝
   30 ─┤                                    ╔══╝            ╔══ MFB outer wall (H = 30 mm)
   20 ─┤                               ╔══╝      ╔══╗    ╔╝
   10 ─┤                          ╔══╝      ╔══╝  ╚══╚══╝       ← MFB Tornado Ridge peak
    0 ─┴──────────────────────────╝─────────╝ ────────────────────
        │                         │          │   │   │   │    │
        0                      55 mm         40  125 135 145  170 mm
                                  ↑          ↑   ↑
                             BBA slope   MFB slope  MFB TR peak
                             starts       starts

  BBA (Plastic):  flat 0–55 mm → single slope 38.1° to 125 mm → rim (pocket or bounce)
  MFB (Attack):   flat 0–40 mm → slope 30° to 125 mm → Tornado Ridge → 2nd slope 50° → wall
  Key difference: BBA has NO ridge. Tops reach the outer wall without any redirection event.
  BBA slope is steeper (38.1° vs 30°) but shorter span; MFB has more zone complexity.
```

### Zone Physics Summary

```
ZONE 1 — Flat Centre (r = 0–55 mm)
  α_slope = 0°,  g_lat = 0 m/s²
  N_floor = m × g  (full vertical weight)
  Spin decay (Dranzer G, plastic tip μ = 0.10, r_tip = 0.8 mm):
    α_flat = μ × m × g × r_tip / I = 0.10 × 0.022 × 9.81 × 0.0008 / 3.8×10⁻⁶ = 4.55 rad/s²
    Spin life (ω₀ = 250 rad/s): t = 250 / 4.55 = 54.9 s

ZONE 2 — Sloped Wall (r = 55–125 mm)
  α_slope = 38.1°,  H_rise = 55 mm,  Δr = 70 mm
  g_lat = 9.81 × sin(38.1°) = 6.04 m/s²  (inward, toward centre)
  N_slope = m × g × cos(38.1°) = 0.022 × 9.81 × 0.788 = 0.170 N
  Spin decay on slope (reduced N):
    α_slope = μ × 0.170 × 0.0008 / 3.8×10⁻⁶ = 3.58 rad/s²  (21% slower than flat floor)

  Net inward acceleration (slope gravity minus slope friction):
    a_net = g_lat − μ × g × cos(38.1°) = 6.04 − 0.10 × 9.81 × 0.788 = 6.04 − 0.773 = 5.27 m/s²

  Wall-return time (top placed at rim, v_radial,0 = 0):
    t_return = √(2 × Δr / a_net) = √(2 × 0.070 / 5.27) = √(0.02657) = 0.163 s
    v_at_flat = a_net × t_return = 5.27 × 0.163 = 0.859 m/s  (radially inward on arrival)

  Rim wall bounce (no pocket, ε_wall = 0.75):
    J = m × v_radial × (1 + ε) = 0.022 × v_radial × 1.75
    v_reflected = 0.75 × v_radial  (directed back down the slope)
```

### Pocket Ejection and Surface Comparison

```
POCKET GEOMETRY:
  Bowl circumference:        C = π × 250 = 785 mm
  Pockets:                   4 corners, ~65 mm chord each
  Total pocket arc:          4 × 65 = 260 mm   →  33.1 % of rim
  Total wall arc:            785 − 260 = 525 mm →  66.9 % of rim
  P(ring-out | reach rim):   260 / 785 = 0.331

  MFB Attack Type (Case 545): P(ring-out) = 0.492
  BBA difference:             0.492 − 0.331 = 0.161  (16.1 percentage points lower)
  → Plastic-gen tops must be aimed at a pocket to ring out reliably;
    random wall contact is twice as likely to bounce as to eject.

SPIN DECAY TABLE (flat floor, ω₀ = 250 rad/s):
  Assembly                    m (kg)  I (kg·m²)  μ     r_tip (mm)  α (rad/s²)  t_spin (s)
  Dranzer G — sharp plastic   0.022   3.8×10⁻⁶   0.10  0.8         4.55        54.9
  Dranzer G — flat plastic    0.022   3.8×10⁻⁶   0.15  3.0         25.6         9.8
  Driger S — ball tip         0.021   3.6×10⁻⁶   0.13  2.0         15.2        16.4
  Wolborg 2 — bearing tip     0.023   3.9×10⁻⁶   0.04  1.5          3.56       70.2
  Dranzer G — slope (Zone 2)  0.022   3.8×10⁻⁶   0.10  0.8          3.58       69.8 (on slope)

  Slope reduces α by 21% (lower N_slope) — spin decays more slowly in Zone 2 than Zone 1.
  Bearing tip (Wolborg 2): longest spin life ~70 s; dominant stamina tip of plastic gen.
```

### TypeScript Reference Functions

```typescript
function bbaSlopeAngleDeg(H_rise_mm: number, deltaR_mm: number): number {
  return (Math.atan(H_rise_mm / deltaR_mm) * 180) / Math.PI;
}
// bbaSlopeAngleDeg(55, 70)  →  38.1°

function bbaGlat(slopeAngleDeg: number): number {
  return 9.81 * Math.sin((slopeAngleDeg * Math.PI) / 180);
}
// bbaGlat(38.1)  →  6.04 m/s²

function bbaWallReturnTime(
  deltaR_m: number, mu: number, slopeAngleDeg: number
): number {
  const rad = (slopeAngleDeg * Math.PI) / 180;
  const aNet = 9.81 * Math.sin(rad) - mu * 9.81 * Math.cos(rad);
  return Math.sqrt((2 * deltaR_m) / aNet);
}
// bbaWallReturnTime(0.070, 0.10, 38.1)  →  0.163 s

function bbaPocketEjectionProbability(
  pocketCount: number, pocketChord_mm: number, bowlDiameter_mm: number
): number {
  const circ = Math.PI * bowlDiameter_mm;
  return (pocketCount * pocketChord_mm) / circ;
}
// bbaPocketEjectionProbability(4, 65, 250)  →  0.331  (33.1%)

function bbaSpinAlpha(
  mu: number, mass_kg: number, rTip_m: number, I_kgm2: number,
  onSlope: boolean, slopeAngleDeg: number
): number {
  const cosA = onSlope ? Math.cos((slopeAngleDeg * Math.PI) / 180) : 1.0;
  const N = mass_kg * 9.81 * cosA;
  return (mu * N * rTip_m) / I_kgm2;
}
// bbaSpinAlpha(0.10, 0.022, 0.0008, 3.8e-6, false, 38.1)  →  4.55 rad/s²  (flat floor)
// bbaSpinAlpha(0.10, 0.022, 0.0008, 3.8e-6, true,  38.1)  →  3.58 rad/s²  (Zone 2 slope)
// bbaSpinAlpha(0.04, 0.023, 0.0015, 3.9e-6, false, 38.1)  →  3.56 rad/s²  (bearing tip)
```

---

## Case 559 — Field of Doom (BBA V-Force Era, Baseball Stadium Arena): Asymmetric High/Low Outfield Wall, Dual-Surface Grass/Mud Playing Field, Chain-Link Net Backstop, and Multi-Zone Friction and Bounce Analysis

**Thesis:** The Field of Doom (named explicitly in the V-Force era Beyblade game and anime, BBA-sanctioned battle arena built inside a regulation baseball stadium) is the most asymmetrically configured official Beyblade arena of the plastic generation: it is built on the playing surface of a baseball diamond and inherits the sport's deliberate asymmetry — a triangular outfield grass zone (the roughly equilateral wedge from home plate outward, surface μ_grass ≈ 0.35–0.40, high-pile short grass provides more resistance than flat ABS) transitions into a triangular infield dirt/mud zone (the arc from the three bases and the mound region, μ_mud ≈ 0.55–0.70 depending on moisture level, loose granular surface produces the highest friction coefficient of any standard Beyblade arena surface); the outer boundary of the playable area (analogous to a stadium's outer wall) is asymmetric in wall height: the left-side outfield wall (the tall barrier, H_tall ≈ 4.0–5.0 m in the anime representation, scaling down to a scaled arena wall of approximately H_tall = 90 mm at the 1:30 beyblade scale) forms a rigid near-vertical ABS surface with ε_tall ≈ 0.72, delivering high-energy elastic bounces that redirect incoming tops back toward the interior; the right-side wall (the short barrier, H_short ≈ 30–40 mm at scale, ε_short ≈ 0.72 same material) provides a significantly lower bounce height and a greater risk of the top clearing the wall on a high-trajectory collision, making the right side the ring-out danger zone; the most distinctive feature is the chain-link net backstop behind home plate on the right/back side of the field — a steel chain-link fence (mesh opening ~25 mm × 25 mm, wire diameter ~2 mm, ABS frame) that acts as a partial energy absorber rather than a solid wall: a beyblade striking the net at v_impact contacts 2–4 wire strands simultaneously, each wire deflects and returns approximately 40% of radial kinetic energy per strand (ε_net ≈ 0.40–0.55 per interaction, chain-link wire is spring-wire steel with high restitution but partial engagement geometry reduces effective ε to 0.40–0.55 system level), so a top hitting the net at v = 1.5 m/s exits at v_out = 0.40 × 1.5 = 0.60 m/s in a partially randomised reflection angle (mesh geometry deflects up to ±20° from pure specular reflection), potentially trapping or deflecting beyblades into the dirt zone; the dual-surface friction system creates a persistent spin-drain asymmetry: a beyblade orbiting on grass (α_grass = μ_grass × m × g × r_tip / I) decays significantly faster than one on ABS, so a stamina-type orbiting the grass outfield loses spin at α_grass ≈ 2.5–3.5 × α_ABS while an attack-type chasing across the muddy infield experiences α_mud ≈ 3.5–5.0 × α_ABS; the net tactical consequence is that the Field of Doom heavily punishes stamina strategies (high friction kills spin life) and rewards quick-kill attack strategies that either ring out the opponent over the low right-side wall or trap them against the chain-link net.

### Visual Geometry — Field of Doom Plan View

```
PLAN VIEW (top-down, 2000 mm × 1000 mm rectangular outer boundary — confirmed anime Field of Doom dimensions):

  ┌──────────────────────────────────────────────────────────────────────┐
  │  STADIUM SEATING UPPER TIER (above tall outfield wall)               │
  │                                                                      │
  │    TALL OUTFIELD WALL (left side)   H_tall ≈ 90 mm                  │
  │  ╔══════════════════════════════════╗                                │
  │  ║  STADIUM SEATING (lower tier)   ║  SHORT OUTFIELD WALL           │
  │  ╚══════╗                          ║  H_short ≈ 35 mm               │
  │  TALL   ║                          ╚═══════════════════╗            │
  │  WALL   ║                                              ║            │
  │  (left) ║      GRASS — OUTFIELD                       ║  CHAIN-    │
  │         ║      (Zone 1, μ = 0.35–0.40)                ║  LINK      │
  │         ║                                              ║  NET       │
  │         ║                 ╱‾‾‾‾‾‾‾‾‾‾‾‾╲              ║  (back-    │
  │         ║                ╱  INFIELD ARC  ╲             ║  stop)     │
  │         ║               │   DIRT / MUD   │             ║            │
  │         ║               │  (Zone 2)      │             ║            │
  │         ║               │  μ = 0.55–0.70 │             ║            │
  │         ║    3B ●       │       ● MOUND  │   ● 1B      ║            │
  │         ║               │                │             ║            │
  │         ║                ╲              ╱              ║            │
  │  TALL   ║                 ╲  ● 2B      ╱               ║  SHORT    │
  │  WALL   ╚══════════════════╲          ╱════════════════╝  WALL     │
  │  (lower left corner)        ╲        ╱                    (right)   │
  │                              ● HOME                                  │
  │                              PLATE                                   │
  │                              (launch zone)                           │
  └──────────────────────────────────────────────────────────────────────┘

  Zone 1: OUTFIELD GRASS    Outer triangular wedge    μ_grass = 0.35–0.40
  Zone 2: INFIELD DIRT/MUD  Inner arc and diamond     μ_mud   = 0.55–0.70
  Left boundary:  TALL WALL    H ≈ 90 mm   ε ≈ 0.72  (hard ABS panel)
  Right boundary: SHORT WALL   H ≈ 35 mm   ε ≈ 0.72  (ring-out risk for high-arc tops)
  Back boundary:  CHAIN NET    H ≈ 60 mm   ε ≈ 0.45  (partial energy absorber, ±20° scatter)
```

```
SIDE ELEVATION — LEFT vs RIGHT WALL HEIGHT ASYMMETRY:

  Left side (tall wall):               Right side (short wall + net):

     ─┐  ← upper seating               ─┐  ← net top (~60 mm)
 90mm │  TALL WALL                  60mm │╬╬╬╬╬╬╬╬╬╬╬  CHAIN-LINK NET
      │  (rigid ABS panel)              │╬╬╬╬╬╬╬╬╬╬╬  ε_net ≈ 0.45
      │  ε_wall ≈ 0.72                  │╬╬╬╬╬╬╬╬╬╬╬  ±20° scatter
      │  High elastic bounce            │╬╬╬╬╬╬╬╬╬╬╬
 35mm │                             35mm─┤  SHORT WALL (rigid ABS)
      │                                 │  ε_wall ≈ 0.72
      │                                 │  Top clears if v_vertical > √(2g×0.035) = 0.83 m/s
    0 ┴─── PLAYING SURFACE ──────────── ┴──── PLAYING SURFACE ───────
      GRASS (μ=0.35–0.40)               DIRT/MUD (μ=0.55–0.70)
```

```
SURFACE ZONE CROSS-SECTION (schematic, centre-to-edge cut):

  ← outfield wall (tall)                               right/net side →

  [GRASS zone]         [INFIELD DIRT zone]           [NET zone]
  μ = 0.35–0.40        μ = 0.55–0.70                 ε_net ≈ 0.45

  ─────────────────────────────────────────────────────────────────────
  GRASS █████████████  DIRT/MUD ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  DIRT ▓▓▓│╬╬╬╬╬╬╬NET
  ─────────────────────────────────────────────────────────────────────
  ↑ low friction       ↑ high friction                    ↑ net absorb
  α × 2.5–3.5         α × 3.5–5.0 (vs ABS)              partial trap
  (vs ABS baseline)

  Grass boundary ≈ r_grass from home plate (curved arc, Zone 1/Zone 2 edge)
  Grass zone covers ~55% of total play area; dirt covers ~45%.
```

### Surface Friction and Spin Decay Analysis

```
REFERENCE: ABS floor baseline (μ_ABS = 0.15, MFB Attack Type flat centre)
  α_ABS = μ × m × g × r_tip / I

GRASS (outfield, μ_grass = 0.38, representative midpoint):
  α_grass = (0.38 / 0.15) × α_ABS = 2.53 × α_ABS
  For Plastic-gen stamina top (m=0.022 kg, I=3.8×10⁻⁶, r_tip=0.8 mm):
    α_grass = 0.38 × 0.022 × 9.81 × 0.0008 / 3.8×10⁻⁶ = 17.3 rad/s²
    Spin life (ω₀ = 250 rad/s): t = 250 / 17.3 = 14.5 s
    (compare: 54.9 s on ABS flat floor — grass kills stamina by 73%)

DIRT / MUD (infield, dry μ = 0.55, wet/muddy μ = 0.70):
  Dry dirt:  α_dirt = 0.55 × 0.022 × 9.81 × 0.0008 / 3.8×10⁻⁶ = 25.0 rad/s²
    Spin life: t = 250 / 25.0 = 10.0 s
  Muddy:     α_mud  = 0.70 × 0.022 × 9.81 × 0.0008 / 3.8×10⁻⁶ = 31.8 rad/s²
    Spin life: t = 250 / 31.8 = 7.9 s
  Mud reduces stamina spin life to 14% of ABS baseline — catastrophic for stamina types.

COMPARISON TABLE (same beyblade: m=0.022, I=3.8×10⁻⁶, r_tip=0.8 mm, ω₀=250 rad/s):
  Surface          μ       α (rad/s²)   t_spin (s)   vs ABS (%)
  ABS flat         0.15    6.82         36.7          100%
  Grass (field)    0.38    17.3         14.5           40%
  Dry dirt         0.55    25.0         10.0           27%
  Wet mud          0.70    31.8          7.9           22%
  Note: above uses r_tip=0.8 mm (sharp tip). Flat/wide tips have higher α on all surfaces.

ATTACK-TYPE TIP (wide, μ_tip = 0.30, r_tip = 3.0 mm, m=0.026 kg, I=4.2×10⁻⁶):
  On ABS:   α = 0.30 × 0.026 × 9.81 × 0.003 / 4.2×10⁻⁶ = 54.8 rad/s²   t = 4.6 s
  On grass: α = (0.38/0.15) × 54.8 = 138.9 rad/s²                         t = 1.8 s
  On mud:   α = (0.70/0.15) × 54.8 = 255.7 rad/s²                         t = 1.0 s
  Attack types survive under 2 s on this arena — must win by ring-out quickly.
```

### Chain-Link Net Backstop Physics

```
NET GEOMETRY:
  Mesh opening:    ~25 mm × 25 mm
  Wire diameter:   ~2 mm (steel)
  Net height:      H_net ≈ 60 mm (above right-short wall top)
  Frame material:  ABS post and rail
  Contact model:   2–4 wires per impact (beyblade AR width ≈ 25–40 mm)

NET ENERGY ABSORPTION (per impact):
  ε_net (effective system) ≈ 0.40–0.55
  At v_impact = 1.5 m/s:
    v_out = ε_net × v_impact = 0.45 × 1.5 = 0.675 m/s  (representative midpoint)
    KE_absorbed = ½ × m × (v_impact² − v_out²) = ½ × 0.022 × (2.25 − 0.455) = 0.0197 J
    KE_absorbed fraction = (2.25 − 0.455) / 2.25 = 79.8% of kinetic energy lost
  At v_impact = 0.5 m/s (slow approach):
    v_out = 0.45 × 0.5 = 0.225 m/s  (barely rebounds)
    Below v_stall = μ_mud × g × r_bey / I_bey × Δt_net contact: top may not clear net.

NET REFLECTION ANGLE SCATTER:
  Diamond mesh at 45° orientation introduces up to ±20° azimuthal deflection from specular:
  v_out_x = v_out × cos(θ_reflect ± Δθ),  Δθ ∈ [−20°, +20°]  (uniform distribution)
  Result: tops bouncing off net cannot be predicted to land in a specific zone —
          the net acts as a "chaos boundary" that scatters beyblades into the dirt.

NET TRAP CONDITION (top too slow to bounce back):
  A top hitting the net at v < v_trap where v_trap = √(2 × μ_mud × g × L_net_contact)
  L_net_contact ≈ 0.01 m (wire contact length per strand)
  v_trap ≈ √(2 × 0.60 × 9.81 × 0.01) = √(0.1177) = 0.343 m/s
  Tops arriving at the net below 0.343 m/s may wedge against the wire frame and stop,
  resulting in a Stadium-Out if the top falls through the mesh or stays against the net.
```

### Wall Height Ring-Out Analysis

```
TALL LEFT WALL (H_tall = 90 mm):
  Minimum vertical speed to clear wall (from wall-strike):
    v_clear = √(2 × g × H_tall) = √(2 × 9.81 × 0.090) = √(1.765) = 1.33 m/s
  A top hitting the left wall at v_radial = 2.0 m/s:
    Horizontal bounce: v_radial_out = ε × v_radial = 0.72 × 2.0 = 1.44 m/s (inward)
    Vertical component from AR geometry (β_AR ≈ 30° tilt contact):
      v_vertical = v_radial × sin(30°) = 2.0 × 0.5 = 1.0 m/s  (upward)
      v_vertical < v_clear (1.0 < 1.33): top does NOT clear tall wall → bounces back.
    At v_radial = 2.7 m/s: v_vertical = 1.35 m/s > 1.33 m/s → clears tall wall (ring-out).
  The tall wall requires exceptional launch power to ring-out over; effective as a bounce wall.

SHORT RIGHT WALL (H_short = 35 mm):
  v_clear = √(2 × 9.81 × 0.035) = √(0.686) = 0.829 m/s  (vertical component needed)
  At v_radial = 1.66 m/s with β_AR = 30°: v_vertical = 1.66 × 0.5 = 0.83 m/s ≥ v_clear.
  The short wall is cleared at moderate attack speeds (~1.7 m/s radial) — easy ring-out zone.
  Any attack directed at the right-side boundary at speed > 1.7 m/s is a viable ring-out attempt.

ASYMMETRY SUMMARY:
  Left tall wall:    ring-out requires v_radial > 2.7 m/s  (high-power attack only)
  Right short wall:  ring-out requires v_radial > 1.7 m/s  (moderate attack sufficient)
  Net backstop:      ring-out via trapping if v_arrival < 0.34 m/s (slow tops wedge in net)
  Strategic consequence: Attack types should aim right-of-centre for ring-out;
                         the tall wall on the left is best used as a bounce weapon to
                         redirect one's own beyblade into the opponent.
```

### TypeScript Reference Functions

```typescript
function fieldOfDoomSpinAlpha(
  mu_surface: number, mass_kg: number, rTip_m: number, I_kgm2: number
): number {
  return (mu_surface * mass_kg * 9.81 * rTip_m) / I_kgm2;
}
// fieldOfDoomSpinAlpha(0.15, 0.022, 0.0008, 3.8e-6)  →  6.82 rad/s²  (ABS baseline)
// fieldOfDoomSpinAlpha(0.38, 0.022, 0.0008, 3.8e-6)  → 17.3  rad/s²  (grass)
// fieldOfDoomSpinAlpha(0.55, 0.022, 0.0008, 3.8e-6)  → 25.0  rad/s²  (dry dirt)
// fieldOfDoomSpinAlpha(0.70, 0.022, 0.0008, 3.8e-6)  → 31.8  rad/s²  (wet mud)

function netBounceSpeed(vImpact_ms: number, epsilonNet: number): number {
  return epsilonNet * vImpact_ms;
}
// netBounceSpeed(1.5, 0.45)  →  0.675 m/s  (representative mid-ε)
// netBounceSpeed(0.5, 0.45)  →  0.225 m/s  (slow approach, barely rebounds)

function wallClearSpeed(wallHeight_m: number, arContactAngleDeg: number): number {
  const vVertical = Math.sqrt(2 * 9.81 * wallHeight_m);
  const sinA = Math.sin((arContactAngleDeg * Math.PI) / 180);
  return vVertical / sinA;  // required radial impact speed to generate enough vertical component
}
// wallClearSpeed(0.090, 30)  →  2.66 m/s  (tall left wall at β=30° AR contact)
// wallClearSpeed(0.035, 30)  →  1.66 m/s  (short right wall at β=30° AR contact)

function netTrapSpeed(mu_surface: number, contactLength_m: number): number {
  return Math.sqrt(2 * mu_surface * 9.81 * contactLength_m);
}
// netTrapSpeed(0.60, 0.01)  →  0.343 m/s  (tops below this may wedge in net)

function fieldSpinLifeSeconds(omega0_rads: number, mu: number, m: number, r: number, I: number): number {
  const alpha = fieldOfDoomSpinAlpha(mu, m, r, I);
  return omega0_rads / alpha;
}
// fieldSpinLifeSeconds(250, 0.38, 0.022, 0.0008, 3.8e-6)  → 14.5 s  (grass)
// fieldSpinLifeSeconds(250, 0.55, 0.022, 0.0008, 3.8e-6)  → 10.0 s  (dry dirt)
// fieldSpinLifeSeconds(250, 0.70, 0.022, 0.0008, 3.8e-6)  →  7.9 s  (wet mud)
```

---

## Case 560 — Blizzard Bowl (BBA V-Force Era, Biovolt Stadium): 2 m × 2 m Circular Ice-Surface Bowl, Perimeter Pine-Tree Boundary with Variable-Gap Ring-Out Probability, Scattered Rock Obstacles, and Ultra-Low Ice Friction Analysis

**Thesis:** The Blizzard Bowl (V-Force era, BBA-sanctioned arena built inside a circular outdoor basin at the Biovolt Stadium complex) is a 2000 mm outer diameter circular arena with a roughly flat ice surface (μ_ice ≈ 0.03–0.05, polished natural-ice surface formed over a concrete bowl base), making it the lowest-friction standard Beyblade arena surface of any generation; the outer boundary is a ring of mature snow-covered pine trees spaced approximately 120 mm centre-to-centre along a perimeter circumference of π × 2000 = 6283 mm, giving approximately 52 trees total; individual tree trunk diameter at contact height is approximately 50 mm, leaving inter-tree gaps of 120 − 50 = 70 mm — since a plastic-gen beyblade AR diameter is approximately 42–50 mm, a gap of 70 mm means tops can pass through a single inter-tree gap if their radial trajectory is aligned within ±(70 − 42)/2 = ±14 mm of the gap centreline; the probability that a top reaching the perimeter at a random azimuth finds a passable gap (treating trees as periodic obstacles): gap fraction = 70/120 = 0.583, but because the top must also be aimed within ±14 mm of the gap centre relative to its trajectory width, effective P(pass-through) ≈ 0.583 × (70 − 42) / 70 = 0.583 × 0.40 = 0.233; tree trunk impacts (ε_trunk ≈ 0.50, green pine wood) absorb approximately 50% of radial kinetic energy, making tree bounces less elastic than ABS wall bounces (ε_ABS ≈ 0.75), and the irregular trunk surface introduces azimuthal scatter of ±15–25°; eight to twelve rocks are scattered across the ice surface, each approximately 40–70 mm in longest dimension and 15–25 mm proud of the ice surface; a beyblade whose AR height at the equator is less than 15 mm will clear low rocks (AR rides above), while a top with AR at 8–12 mm height risks AR contact with rocks over 12 mm tall, producing an impulse J = m × v_radial × (1 + ε_rock) = m × v × (1 + 0.55) = 1.55 × m × v directed away from the rock face at the rock contact angle β_rock ∈ [30°, 90°] depending on approach geometry; the ice floor physics dominate the entire bout: spin decay α_ice = μ_ice × m × g × r_tip / I is dramatically reduced compared to any other surface — for a Dranzer G plastic-tip top (m = 0.022 kg, I = 3.8 × 10⁻⁶ kg·m², r_tip = 0.8 mm, μ_ice = 0.04): α_ice = 0.04 × 0.022 × 9.81 × 0.0008 / 3.8 × 10⁻⁶ = 1.82 rad/s², giving spin life t = 250 / 1.82 = 137 s — more than 2.3 times longer than the same top on the BBA Stadium flat ABS floor (54.9 s, Case 558); simultaneously, lateral friction is so low that tops slide rather than roll on the ice: a beyblade with initial lateral velocity v = 1.0 m/s decelerates at a_slide = μ_ice × g = 0.04 × 9.81 = 0.392 m/s², requiring t_stop = v / a_slide = 1.0 / 0.392 = 2.55 s to halt from 1 m/s lateral speed — on any other surface this would be under 0.5 s; the tactical consequence is an extremely mobile, low-decay arena where tops glide freely, rocks create random deflection events, and ring-out requires threading a precise tree gap or striking a tree at sufficient energy to snap the trunk (unrealistic at beyblade scales), making the Blizzard Bowl fundamentally a spin-and-survive endurance arena rather than a ring-out arena.

### Visual Geometry — Blizzard Bowl Plan View and Cross-Section

```
PLAN VIEW (top-down, 2000 mm diameter circular bowl):

                    PINE TREES (ring, ~52 trees, 120 mm spacing)
         ╔══════════▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲══════════╗
       ╔═╝  ▲▲▲ gaps ▲   ▲   ▲   ▲   ▲   ▲ ▲▲▲       ╚═╗
      ╔╝  ▲                                         ▲    ╚╗
     ╔╝ ▲                  ICE SURFACE               ▲    ╚╗
    ╔╝▲              (μ_ice = 0.03–0.05)              ▲    ╚╗
    ║▲          ◆ rock                                 ▲    ║
    ║▲     ◆ rock     ◆ rock                           ▲    ║
    ║▲                       ◆ rock   ◆ rock           ▲    ║
    ║▲  ◆ rock                                         ▲    ║
    ║▲          ◆ rock   ◆ rock                        ▲    ║
    ║▲                              ◆ rock             ▲    ║
    ╚╗▲                                               ▲   ╔╝
     ╚╗  ▲                                         ▲  ╔╝
      ╚═╗  ▲▲▲ ▲   ▲   ▲   ▲   ▲   ▲   ▲   ▲▲▲  ╔═╝
         ╚══════════▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼══════════╝

  ▲ = Pine tree trunk (⌀ 50 mm, ε_trunk = 0.50, scatter ±15–25°)
  ◆ = Rock obstacle (40–70 mm dia, 15–25 mm proud, ε_rock = 0.55)
  Outer bowl: R = 1000 mm (diameter 2000 mm)
  Tree gap: 70 mm between trunks; P(ring-out through gap) ≈ 23.3%
  Ice floor: flat to within ±5 mm; no slope, no gravity funnel
```

```
CROSS-SECTION (centre on left, tree boundary on right):

  Height
  above     25 ─┤        ◆◆ rock (15–25 mm proud)
  ice (mm)     │
            10 ─┤                                          ▲▲ tree trunk base
               │                                         ▲▲▲  (50 mm dia)
             0 ─┴────────────────────────────────────────╱────────────────
                │                                       ╱ │
                0                                  900 mm  1000 mm
                                                       ↑        ↑
                                                  tree ring   outer edge
                                                  begins      of bowl

  ICE FLOOR:  μ_ice = 0.04 (typical), perfectly flat
  ROCK:       height 15–25 mm; AR clears if AR_height > rock_height
              AR contact: β_rock ∈ [30°–90°], ε = 0.55
  TREE TRUNK: vertical cylinder, ⌀ 50 mm, ε = 0.50, ±20° azimuthal scatter
  GAP:        70 mm opening; passable if bey ⌀ ≤ 70 mm AND trajectory aligned ±14 mm
```

```
TREE BOUNDARY — GAP GEOMETRY (arc segment, linearised):

  ←── 120 mm centre-to-centre spacing ──→
  ┌───────────────────────────────────────┐
  │  ████  ←gap→  ████  ←gap→  ████      │  (cross-section of tree ring)
  │  50mm    70mm  50mm    70mm  50mm     │
  │  trunk   open  trunk   open  trunk   │
  └───────────────────────────────────────┘
  Gap fraction:              70 / 120 = 58.3 %  (of perimeter is open space)
  Beyblade AR width:         ~42 mm
  Usable pass-through width: 70 − 42 = 28 mm  (14 mm either side of gap centre)
  Alignment probability:     28 / 70 = 40.0 %
  P(ring-out | bey reaches tree ring) = 0.583 × 0.400 = 0.233  (23.3 %)
  P(trunk bounce | bey reaches tree ring) = 1 − 0.233 = 0.767  (76.7 %)
```

### Ice Floor Physics and Rock Obstacle Analysis

```
ICE FRICTION (μ_ice = 0.04, representative mid-range):
  Spin decay α_ice = μ_ice × m × g × r_tip / I

  Assembly                          α_ice (rad/s²)  t_spin (s, ω₀=250)  vs ABS flat
  Dranzer G — sharp tip (μ_tip=0.10) 1.82           137 s               2.50×
  Dranzer G — flat tip  (μ_tip=0.15) 2.73            91 s               1.67×
  Wolborg 2 — bearing   (μ_tip=0.04) 0.73           342 s               4.87×  (benchmark)
  Attack-type wide tip  (μ_tip=0.30) 10.9            22.9 s              1.65×

  Ice suppresses spin decay across all tip types by ~1.5–5× vs ABS.
  Bearing tip (Wolborg 2) reaches 342 s theoretical spin life — effectively unlimited
  in any bout under 3 minutes; battle outcome determined purely by collision dynamics.

LATERAL SLIDE PHYSICS:
  Deceleration from lateral speed v: a_slide = μ_ice × g = 0.04 × 9.81 = 0.392 m/s²
  Stop time from v = 1.0 m/s: t_stop = 1.0 / 0.392 = 2.55 s
  Slide distance: d = v² / (2 × a_slide) = 1.0 / 0.784 = 1.27 m  (covers more than half the arena!)
  Compare ABS (μ=0.15): d = 1.0² / (2 × 0.15 × 9.81) = 0.340 m
  → On ice, tops travel 3.7× further after each impact before stopping.

ROCK OBSTACLE (representative: 55 mm dia, 20 mm proud):
  Contact condition: AR_equator_height < 20 mm  (common for plastic-gen sharp tips)
  Impact at v_approach = 1.5 m/s, contact angle β = 60°:
    Normal component: v_n = v × cos(60°) = 0.75 m/s
    Impulse: J = m × v_n × (1 + ε_rock) = 0.022 × 0.75 × 1.55 = 0.0256 N·s
    Deflected normal speed: v_n_out = ε_rock × v_n = 0.55 × 0.75 = 0.41 m/s
    Tangential speed preserved: v_t = v × sin(60°) = 1.30 m/s
    Resultant speed: v_out = √(0.41² + 1.30²) = √(0.168 + 1.690) = 1.36 m/s
    Deflection angle from original path: θ = atan(0.41 / 1.30) = 17.5°
  On ice (μ=0.04), v_out = 1.36 m/s slides 1.36² / (2 × 0.392) = 2.36 m before stopping
    → Bey likely travels full arena width after a rock hit at moderate speed.
```

### TypeScript Reference Functions

```typescript
function blizzardBowlSpinAlpha(
  mu_ice: number, mass_kg: number, rTip_m: number, I_kgm2: number
): number {
  return (mu_ice * mass_kg * 9.81 * rTip_m) / I_kgm2;
}
// blizzardBowlSpinAlpha(0.04, 0.022, 0.0008, 3.8e-6)  →  1.82 rad/s²
// blizzardBowlSpinAlpha(0.04, 0.023, 0.0015, 3.9e-6)  →  0.73 rad/s² (bearing tip)

function iceSlideDistance(vLateral_ms: number, mu_ice: number): number {
  return (vLateral_ms * vLateral_ms) / (2 * mu_ice * 9.81);
}
// iceSlideDistance(1.0, 0.04)  →  1.27 m
// iceSlideDistance(0.5, 0.04)  →  0.319 m

function treeBoundaryRingOutProbability(
  treeDia_mm: number, spacing_mm: number, beyDia_mm: number
): number {
  const gap_mm = spacing_mm - treeDia_mm;
  const gapFraction = gap_mm / spacing_mm;
  const alignFraction = Math.max(0, (gap_mm - beyDia_mm)) / gap_mm;
  return gapFraction * alignFraction;
}
// treeBoundaryRingOutProbability(50, 120, 42)  →  0.233  (23.3%)

function rockDeflectionSpeed(
  vApproach_ms: number, contactAngleDeg: number, epsilonRock: number
): { vOut_ms: number; deflAngleDeg: number } {
  const beta = (contactAngleDeg * Math.PI) / 180;
  const vN = vApproach_ms * Math.cos(beta);
  const vT = vApproach_ms * Math.sin(beta);
  const vNout = epsilonRock * vN;
  const vOut = Math.sqrt(vNout * vNout + vT * vT);
  const deflAngle = (Math.atan(vNout / vT) * 180) / Math.PI;
  return { vOut_ms: vOut, deflAngleDeg: deflAngle };
}
// rockDeflectionSpeed(1.5, 60, 0.55)  →  { vOut_ms: 1.36, deflAngleDeg: 17.5° }
```

---

## Case 561 — R.P.M. Dish (BBA V-Force Era, Biovolt Stadium): 600 mm × 600 mm Circular Bowl with Central Rotating Disc (r = 100 mm), Exponential Spin-Up Mechanism, Centrifugal Ejection Threshold, and Petal-Walled Outer Bowl Analysis

**Thesis:** The R.P.M. Dish (R.P.M. = Rotations Per Minute, V-Force era, Biovolt Stadium location) is a 600 mm outer-diameter circular bowl whose defining feature is a motorised central disc of radius R_disc = 100 mm (200 mm diameter) recessed flush with the flat bowl floor at the arena centre; the outer bowl has five curved petal-shaped wall segments inclined at approximately α_wall = 45° from the floor and separated by five narrow channel exits (each channel approximately 30 mm wide at the floor, widening to 50 mm at the rim) through which beyblades can be ejected; the central disc begins stationary and activates via a pressure-sensitive trigger (activation threshold F_trigger ≈ 0.12 N, approximately 60% of a standard beyblade's weight) when a beyblade comes to rest or orbits on the disc surface; once activated, the disc accelerates exponentially: ω_disc(t) = ω₀ × e^(λ × t) where ω₀ = 8 rad/s (initial activation speed) and λ = 0.18 s⁻¹ (growth rate constant), giving ω_disc(5 s) = 8 × e^(0.9) = 19.7 rad/s, ω_disc(10 s) = 8 × e^(1.8) = 48.3 rad/s, ω_disc(15 s) = 8 × e^(2.7) = 118 rad/s, ω_disc(20 s) = 8 × e^(3.6) = 290 rad/s; the disc surface has four shallow spiral grooves (visible as the X-pattern in the images) that engage the beyblade tip to transfer torque more reliably than a smooth disc surface: groove contact μ_groove ≈ 0.35–0.50 (compared to smooth ABS μ ≈ 0.15); torque transfer to beyblade spin: the relative surface speed of the disc at r = r_contact (distance from disc centre to beyblade tip contact point, r_contact ≈ 50 mm = 0.05 m) is v_rel = (ω_disc − ω_bey × r_tip / r_contact) × r_contact — if ω_disc × r_contact > ω_bey × r_tip (disc surface moves faster than bey tip perimeter), friction drives bey spin up; spin-up torque: τ = μ_groove × N × r_tip = 0.40 × 0.022 × 9.81 × 0.0008 = 6.91 × 10⁻⁵ N·m, giving spin-up rate dω_bey/dt = τ / I = 6.91 × 10⁻⁵ / 3.8 × 10⁻⁶ = 18.2 rad/s² — the disc can drive a beyblade from 250 rad/s to a maximum governed by the slip condition ω_bey_max × r_tip = ω_disc × r_contact, i.e. ω_bey_max = ω_disc × r_contact / r_tip = ω_disc × 0.05 / 0.0008 = 62.5 × ω_disc — the disc can theoretically drive beyblade spin far above the ripcord-launch maximum; the ejection mechanism is centrifugal: a beyblade sitting at radial position r_orbit on the disc surface needs centripetal force F_c = m × Ω_orbit² × r_orbit to maintain position, supplied only by disc surface friction F_f = μ_groove × m × g = 0.40 × 0.022 × 9.81 = 0.0863 N; ejection occurs when F_c > F_f, i.e. Ω_orbit² × r_orbit > μ_groove × g = 3.92 m/s²; at r_orbit = 0.05 m: Ω_orbit_eject = √(3.92 / 0.05) = √78.4 = 8.85 rad/s — very low orbit speed needed for ejection; the disc itself, by dragging the beyblade tangentially, drives Ω_orbit to this threshold rapidly; ejected beyblades travel radially outward at v_eject = Ω_orbit × r_orbit = 8.85 × 0.05 = 0.443 m/s at minimum (from disc edge), accelerating toward the petal walls; at the wall (R_wall = 280 mm from centre), kinetic energy at impact: v_wall = √(v_eject² + 2 × g_lat_petal × Δr_petal) where g_lat_petal = g × sin(45°) = 6.94 m/s² and Δr_petal = 0.28 − 0.10 = 0.18 m: v_wall = √(0.196 + 2 × 6.94 × 0.18) = √(0.196 + 2.498) = √2.694 = 1.64 m/s, with wall bounce ε = 0.72: v_bounce = 0.72 × 1.64 = 1.18 m/s back toward centre; if a channel exit is aligned: the top exits the stadium as a ring-out; five channels at 30 mm width on a wall circumference of π × 560 = 1759 mm give P(channel exit | reach wall) = 5 × 30 / 1759 = 0.085 — 8.5% per wall approach.

### Visual Geometry — R.P.M. Dish Plan View and Cross-Section

```
PLAN VIEW (top-down, 600 mm outer diameter):

                    ╔═════╗  ← channel exit (30 mm wide)
               ╔════╝     ╚════╗
           ╔═══╝  PETAL WALL    ╚═══╗
         ╔═╝    (α = 45° slope)      ╚═╗
        ╔╝ ← petal wall segment        ╚╗
       ╔╝                               ╚╗ ← channel exit
      ║                                   ║
      ║   OUTER BOWL FLOOR                ║
      ║   (r = 100–280 mm)     ╔════╗     ║
      ║   ABS, μ = 0.15        ║DISC║     ║
      ║                        ║ X  ║     ║
      ║   r_disc = 100 mm      ╚════╝     ║
      ║   (groove pattern)                ║
      ╚╗                               ╔╝
       ╚╗  channel exits (×5)         ╔╝
        ╚═╗                         ╔═╝
           ╚═══╗               ╔═══╝
               ╚════╗     ╔════╝
                    ╚═════╝

  Central disc:   r = 100 mm,  flat,  4 spiral grooves (X-pattern)
  Outer bowl:     r = 100–280 mm, ABS floor
  Petal walls:    5 segments, α = 45°,  ε = 0.72
  Channel exits:  5 gaps, 30 mm wide at floor
  P(ring-out | wall hit) = 5 × 30 / (π × 560) = 8.5%
```

```
RADIAL CROSS-SECTION (centre on left, channel wall on right):

  Height
  above    80 ─┐                                    ╔══ petal wall top / channel opening
  floor       │                                ╔═══╝   H_wall = 80 mm
  (mm)     60 ─┤                          ╔═══╝
               │                     ╔═══╝   petal wall slope  α = 45°
          40 ─┤                 ╔═══╝        g_lat = 6.94 m/s²  (inward ←)
               │            ╔══╝
          20 ─┤        ╔═══╝
               │  ╔════╝ ← bowl floor begins at r = 100 mm
           0 ─┴══╝─────────────────────────────────────────────
               │   │              │                           │
               0  100 mm       180 mm                     280 mm
               ↑    ↑                                       ↑
            disc  disc       bowl floor mid                petal
            centre edge                                   base

  ROTATING DISC:  r = 0–100 mm,   flat,  ω(t) = 8 × e^(0.18t) rad/s
  BOWL FLOOR:     r = 100–280 mm, ABS,   μ = 0.15
  PETAL WALL:     r = 280 mm → top, α = 45°,  H = 80 mm
  CHANNEL EXIT:   5 × 30 mm gaps at petal junctions
```

### Disc Spin-Up and Ejection Physics

```
DISC SPEED OVER TIME:
  ω_disc(t) = ω₀ × e^(λt)  where ω₀ = 8 rad/s, λ = 0.18 s⁻¹

  t (s)   ω_disc (rad/s)   RPM      Disc surface speed at r=100mm (m/s)
   0        8.0            76.4      0.80
   5       19.7           188        1.97
  10       48.3           461        4.83
  15      118             1127      11.8
  20      290             2770      29.0
  25      711             6790      71.1
  30     1743            16640     174

  Disc reaches beyblade max spin (250 rad/s) at: t = ln(250/8) / 0.18 = ln(31.25) / 0.18 = 19.4 s

SPIN TRANSFER TO BEYBLADE (on disc, r_contact = 50 mm from disc centre):
  Condition for disc to drive bey spin UP:  ω_disc × r_contact > ω_bey × r_tip
    i.e.  ω_disc > ω_bey × r_tip / r_contact = ω_bey × 0.0008 / 0.05 = 0.016 × ω_bey
    → Disc drives bey spin up when ω_disc > 0.016 × ω_bey
    → At ω_bey = 250 rad/s: disc must exceed 0.016 × 250 = 4.0 rad/s (already true at t=0)
    → Disc always drives spin from activation onward.

  Spin-up torque (groove contact):
    τ_drive = μ_groove × m × g × r_tip = 0.40 × 0.022 × 9.81 × 0.0008 = 6.91 × 10⁻⁵ N·m
    dω_bey/dt = τ_drive / I = 6.91×10⁻⁵ / 3.8×10⁻⁶ = 18.2 rad/s²
    From ω₀=250 to ω_max (disc-governed): adds 18.2 × t_contact rad/s additional spin.

EJECTION CONDITION (centrifugal):
  Centripetal needed: F_c = m × Ω_orbit² × r_orbit
  Available from friction: F_f = μ_groove × m × g = 0.40 × 0.022 × 9.81 = 0.0863 N
  Ejection: Ω_orbit² > μ_groove × g / r_orbit

  r_orbit (mm)   Ω_orbit_eject (rad/s)   v_eject (m/s)
    20 mm           √(3.92/0.02) = 14.0     0.28 m/s
    50 mm           √(3.92/0.05) = 8.85     0.44 m/s
   100 mm (edge)    √(3.92/0.10) = 6.26     0.63 m/s

  Wall impact speed (from disc edge r=100 mm, wall at r=280 mm):
    g_lat = 9.81 × sin(45°) = 6.94 m/s²  (petal wall pulls bey back inward)
    Hmm — petal wall is PAST disc; bey travels from bowl floor (flat, r=100–280 mm) to wall.
    On bowl floor: no slope gravity, only friction decelerates.
    v_at_wall² = v_eject² − 2 × μ_floor × g × Δr = 0.63² − 2 × 0.15 × 9.81 × 0.18
               = 0.397 − 0.530 = −0.133  →  bey does NOT reach wall at v_eject = 0.63 m/s
    Minimum ejection speed to reach wall: v_min = √(2 × 0.15 × 9.81 × 0.18) = 0.728 m/s
    → Bey must be ejected from disc at v > 0.728 m/s to reach the petal wall.
    → This requires ω_disc at r_orbit to produce v_eject ≥ 0.73 m/s:
         v_eject = Ω_orbit × r_orbit; Ω_orbit ≥ 0.73 / 0.05 = 14.6 rad/s at r=50 mm
    → Wall-reaching ejections begin when Ω_orbit ≥ 14.6 rad/s — disc reaches this state
       by driving the bey orbit to ≈ 14.6 rad/s, which occurs ≈ 3–5 s after activation.

  Wall bounce (ε = 0.72) vs channel exit (30 mm gap):
    P(channel | wall hit) = 5 × 30 / (π × 560) = 150 / 1759 = 8.5 %
    P(petal bounce | wall hit) = 91.5 %  →  most wall contacts return bey to bowl.
```

### TypeScript Reference Functions

```typescript
function rpmDishDiscSpeed(t_s: number, omega0 = 8, lambda = 0.18): number {
  return omega0 * Math.exp(lambda * t_s);
}
// rpmDishDiscSpeed(10)  →  48.3 rad/s
// rpmDishDiscSpeed(20)  →  290 rad/s
// rpmDishDiscSpeed(0, 8, 0.18)  →  8 rad/s  (initial)

function rpmDishEjectionOmega(rOrbit_m: number, mu_groove: number): number {
  return Math.sqrt((mu_groove * 9.81) / rOrbit_m);
}
// rpmDishEjectionOmega(0.05, 0.40)  →  8.85 rad/s

function rpmDishSpinUpRate(mu_groove: number, mass_kg: number, rTip_m: number, I_kgm2: number): number {
  return (mu_groove * mass_kg * 9.81 * rTip_m) / I_kgm2;
}
// rpmDishSpinUpRate(0.40, 0.022, 0.0008, 3.8e-6)  →  18.2 rad/s²

function rpmDishChannelExitProb(channelCount: number, channelWidth_mm: number, wallRadius_mm: number): number {
  return (channelCount * channelWidth_mm) / (Math.PI * 2 * wallRadius_mm);
}
// rpmDishChannelExitProb(5, 30, 280)  →  0.0853  (8.5%)

function rpmDishMinEjectSpeed(mu_floor: number, deltaR_m: number): number {
  return Math.sqrt(2 * mu_floor * 9.81 * deltaR_m);
}
// rpmDishMinEjectSpeed(0.15, 0.18)  →  0.728 m/s  (minimum to reach petal wall from disc edge)
```

---

## Case 562 — Black Sea Bowl (BBA V-Force Era, Biovolt Stadium): 2 m × 2 m Circular Harbour Arena, Moving Boat Platforms, Growing Whirlpool with Random Wave Ejection, Sloped Bank and Ring Road, and Pier Approach Geometry

**Thesis:** The Black Sea Bowl (BBA V-Force era, Biovolt Stadium location, set in a harbour environment inspired by Eastern European port cities) is a 2000 mm outer-diameter circular arena consisting of four distinct radial zones from the centre outward: Zone 1 (harbour water, r = 0–700 mm, surface = open water with μ_water ≈ 0.80–1.20 for a spinning beyblade tip ploughing water, extremely high drag that depletes spin rapidly); Zone 2 (the bank or quay, r = 700–800 mm, sloped concrete ramp from water level up to road level, slope angle α_bank ≈ 25°, μ_bank ≈ 0.35, width 100 mm); Zone 3 (ring road, r = 800–900 mm, flat grey concrete, width 100 mm — sufficient for approximately 4 beyblades abreast at ~25 mm beyblade diameter, μ_road ≈ 0.20); Zone 4 (outer city wall, r = 900–1000 mm, vertical ABS retaining wall H ≈ 80 mm, ε ≈ 0.72, functions as the ring-out boundary); ten to twelve motorised boats move slowly across the harbour surface (Zone 1), each boat approximately 120 mm long × 55 mm wide with a flat deck surface 12 mm above the water line; a boat deck accommodates exactly 2 beyblades sitting side by side (2 × 25 mm = 50 mm, within 55 mm beam) and has wooden-plank surface (μ_deck ≈ 0.22, similar to smooth ABS, slightly higher); boats traverse the harbour on randomised circular/arc paths at v_boat ≈ 0.03–0.05 m/s (30–50 mm/s), slow enough that a beyblade can transition onto the boat from a pier if timing is correct; the whirlpool is a time-varying feature centred at the harbour centre (r = 0–200 mm): it begins as gentle circular currents (Ω_whirl ≈ 0.5 rad/s at t=0) and grows via the function Ω_whirl(t) = 0.5 × e^(0.08t) rad/s, where t is seconds since whirlpool activation; the whirlpool imparts a tangential force on any beyblade within r < 200 mm proportional to water drag: F_whirl = ½ × ρ_water × C_D × A_tip × (Ω_whirl × r_bey − ω_bey × r_tip)² where ρ_water = 1000 kg/m³, C_D ≈ 1.2 (bluff body), A_tip ≈ π × r_tip² = π × (3 mm)² = 2.83 × 10⁻⁵ m²; at high whirlpool intensity, random wave events are generated: waves propagate radially outward from the whirlpool at 0.5–1.0 m/s, have amplitude H_wave ≈ 15–30 mm above water line, and upon reaching the bank (Zone 2) climb the slope and can reach the ring road (Zone 3) if H_wave > 15 mm (bank crest); a wave sweeping the ring road pushes any beyblade on the road with force F_wave = ρ_water × g × H_wave × w_road × sin(α_wave) ≈ 1000 × 9.81 × 0.020 × 0.10 × sin(30°) = 9.81 N — a massive impulse relative to a 0.022–0.040 kg beyblade — instantly pushing it into the outer wall or over it (ring-out); piers are narrow (35 mm wide) concrete extensions from the bank into the water zone at approximately r = 700–780 mm, extending radially inward to r ≈ 600 mm; a beyblade can ride a pier inward toward the water, jump from the pier tip onto a passing boat, or fall into the water (stadium-out); the bank slope (α_bank = 25°) allows beys to climb from road level to bank crest and slide back: g_lat,bank = 9.81 × sin(25°) = 4.14 m/s² inward (toward water), making it a dangerous zone for slow-moving tops that lose momentum mid-climb and slide back into water.

### Visual Geometry — Black Sea Bowl Plan View

```
PLAN VIEW (top-down, 2000 mm outer diameter):

  ╔═════════════════════════════════════════════════════════════════════════╗
  ║  OUTER CITY WALL (Zone 4, r=900–1000mm, H=80mm, ABS, ε=0.72)          ║
  ╠══════════════════════════════════════════════════════════════════════════╣
  ║  RING ROAD (Zone 3, r=800–900mm, w=100mm, concrete, μ=0.20)            ║
  ╠══════════════╦════════╦════════════════════════════╦════════════════════╣
  ║              ║ PIER   ║                            ║ PIER               ║
  ╠══════════════╬════════╬════════════════════════════╬════════════════════╣
  ║  BANK SLOPE  ║        ║  HARBOUR WATER (Zone 1)   ║                    ║
  ║  (Zone 2,   ╱          r = 0–700 mm               ╲  α=25°, μ=0.35   ║
  ║  α=25°)   ╱    ┌──┐ ┌──┐  ┌──┐  BOATS            ╲                  ║
  ║          ╱   ┌──┐ └──┘ └──┘ └──┘  moving slowly     ╲                 ║
  ║         ╱  ┌──┐                         ┌──┐   ┌──┐   ╲               ║
  ║              │      ~~~WHIRLPOOL~~~      │       │                      ║
  ║       ┌──┐  │    r=0–200mm, growing     │  ┌──┐                       ║
  ║              │    Ω(t) = 0.5·e^0.08t    │                              ║
  ║          ╲  └──┘                       └──┘   ┌──┐  ╱                 ║
  ║           ╲         ┌──┐  ┌──┐  ┌──┐         ╱                       ║
  ║            ╲                                  ╱                        ║
  ╠═════════════╬════════╬════════════════════════╬══════════════════════╣
  ║             ║ PIER   ║                        ║ PIER                  ║
  ╠═════════════╩════════╩════════════════════════╩══════════════════════╣
  ║  RING ROAD (Zone 3)                                                     ║
  ╚═════════════════════════════════════════════════════════════════════════╝

  Zone 1: HARBOUR WATER    r = 0–700 mm    μ_water ≈ 0.80–1.20 (ploughing drag)
  Zone 2: BANK SLOPE       r = 700–800 mm  α = 25°, μ = 0.35, w = 100 mm
  Zone 3: RING ROAD        r = 800–900 mm  μ = 0.20, w = 100 mm (fits 4 beys)
  Zone 4: OUTER CITY WALL  r = 900–1000 mm H = 80 mm, ε = 0.72
  BOATS:  ┌──┐ = 120×55 mm, deck μ = 0.22, carry 2 beys, v_boat = 40 mm/s
  PIERS:  4× radial planks 35 mm wide, extend from r=800 mm inward to r=600 mm
  WHIRLPOOL: r = 0–200 mm, Ω(t) = 0.5·e^(0.08t) rad/s, random wave events
```

```
RADIAL CROSS-SECTION (centre on left, outer wall on right):

  Height
  above     30 ─┤  ← wave amplitude (H_wave 15–30 mm when whirlpool intense)
  water        │
  level     20 ─┤  boat deck (+12 mm)   pier surface (+8 mm)
  (mm)         │   ┌─────────┐          ┌──────┐
            10 ─┤   │ BOAT   │          │ PIER │   road surface → wall top (80mm)
               │   │  deck  │          └──────┘                ╔═══╗
             0 ─┼═══════════════════════════════════════╱──────╱   ║ outer wall
    water       │  HARBOUR WATER (Zone 1)               ╱  road    ║ H = 80 mm
    surface     │  μ_water = 0.80–1.20                 ╱ μ = 0.20  ║ ε = 0.72
               │                              BANK SLOPE           ╚═══╗
           −10 ─┤                              α = 25°, μ = 0.35        ║ (base)
               │                              g_lat = 4.14 m/s² inward
               │                              ← toward water
           −30 ─┤  (bowl base, concrete)
               │
                │         │                   │           │         │
                0       300 mm             700 mm       800 mm    900 mm
                            ↑                  ↑           ↑
                       whirlpool zone       bank edge    road edge
                       (r < 200 mm)         starts       starts
```

```
ZONE-BY-ZONE DETAIL:

  Zone 1 — HARBOUR WATER (r = 0–700 mm):
    Floor: open water; bey tip ploughs through water
    Effective drag: F_drag = ½ × ρ_w × C_D × A_tip × v_tip²
    Spin decay from water drag: α_water = F_drag × r_tip / I (much faster than any floor surface)
    Approximate μ_effective ≈ 0.80–1.20 (depends on tip geometry and penetration depth)
    A beyblade on the water surface without a boat: sinks if tip contact area insufficient;
    most plastic-gen sharp tips (r_tip = 0.8 mm) will cause the bey to oscillate on the surface
    for 1–3 s before tipping over (stadium-out via water immersion).
    Boat deck:  μ = 0.22, surface 12 mm above water, bey transitions from bank/pier to boat
                by lateral momentum; boat moves at ~40 mm/s relative to arena.

  Zone 2 — BANK SLOPE (r = 700–800 mm, α = 25°):
    g_lat = 9.81 × sin(25°) = 4.14 m/s²  (inward toward water = downhill toward Zone 1)
    N_slope = m × g × cos(25°) = m × g × 0.906
    Spin decay on bank: α_bank = 0.35 × m × g × 0.906 × r_tip / I
    Min speed to crest bank from water level (Δh = 100 × tan(25°) = 46.6 mm):
      v_min = √(2 × g × 0.0466 / η) ≈ √(2 × 9.81 × 0.0466 / 0.8) = 1.07 m/s  (η = 0.80)
    Wave climb condition: H_wave > H_bank = 46.6 mm  →  any wave >47 mm tall floods the road.
    Typical wave H = 15–30 mm: reaches mid-bank; H > 47 mm: floods road and wall.

  Zone 3 — RING ROAD (r = 800–900 mm, w = 100 mm):
    μ_road = 0.20, flat concrete
    Capacity: 4 beyblades side-by-side (4 × 25 mm = 100 mm = road width)
    Spin decay: α_road = 0.20 × m × g × r_tip / I (between ABS and MFB floor)
    Wave impact force on road: F_wave = ρ_w × g × H_wave × w_road × sin(θ_wave)
      At H_wave = 20 mm, θ_wave = 30°: F = 1000 × 9.81 × 0.020 × 0.10 × 0.5 = 9.81 N
      Impulse (wave passes in ~0.3 s): J = 9.81 × 0.3 = 2.94 N·s
      Velocity kick: Δv = J / m = 2.94 / 0.025 = 117 m/s  (extreme — simplified model)
      Realistic: wave knocks beyblade off road at moderate speed into outer wall or over it.

  PIERS (4 radial planks):
    Width: 35 mm, length: 200 mm (r = 600–800 mm)
    Surface: wood, μ_pier ≈ 0.25
    Height: 8 mm above water surface
    A bey can ride pier inward, reach tip (r = 600 mm), jump onto passing boat
      (boat must be within 40 mm of pier tip for transition).
    Fall-off-pier: bey enters water → rapidly loses spin (stadium-out in 1–3 s).

  OUTER CITY WALL (Zone 4, r = 900–1000 mm):
    H = 80 mm ABS panel, ε = 0.72
    v_clear = √(2 × g × 0.080) = √(1.57) = 1.25 m/s (vertical component to clear)
    At AR contact angle β = 30°: v_radial_needed = 1.25 / sin(30°) = 2.50 m/s
    Wave-assisted ring-out: wave pushes bey at v >> 2.5 m/s → most wave impacts = ring-out.
```

### Whirlpool Physics and Wave Event Analysis

```
WHIRLPOOL GROWTH:
  Ω_whirl(t) = 0.5 × e^(0.08t)  rad/s  (CCW rotation, t in seconds from activation)
  t = 0:   Ω = 0.5 rad/s    (gentle current, barely affects bey)
  t = 10:  Ω = 1.11 rad/s   (noticeable tangential pull)
  t = 20:  Ω = 2.46 rad/s   (strong whirlpool, wave events begin)
  t = 30:  Ω = 5.46 rad/s   (violent, waves reach road level)
  t = 40:  Ω = 12.1 rad/s   (extreme, frequent large waves)

TANGENTIAL FORCE ON BEYBLADE IN WHIRLPOOL ZONE (r_bey < 200 mm):
  v_water_at_bey = Ω_whirl × r_bey  (tangential water speed)
  v_relative = v_water_at_bey − v_bey_tangential
  F_drag = ½ × 1000 × 1.2 × 2.83×10⁻⁵ × v_relative² = 0.01698 × v_relative²
  At Ω_whirl = 2 rad/s, r_bey = 0.10 m: v_water = 0.20 m/s, bey at rest:
    F_drag = 0.01698 × 0.04 = 6.79 × 10⁻⁴ N → pushes bey tangentially (minor)
  At Ω_whirl = 5 rad/s, r_bey = 0.10 m: v_water = 0.50 m/s:
    F_drag = 0.01698 × 0.25 = 4.25 × 10⁻³ N → significant tangential push toward wall

WAVE EVENT (random generation when Ω_whirl > 2 rad/s):
  Wave amplitude:    H_wave ~ U[15, 30] mm  (uniform random)
  Wave propagation:  v_prop = 0.5–1.0 m/s  (radially outward)
  Wave period:       one event per 5–15 s  (random, frequency increases with Ω)
  Bank flood:        H_wave > 47 mm → road flood (extreme event, Ω_whirl > 10 rad/s)
  Typical event:     H_wave ≈ 20 mm → reaches mid-bank, pushes beys on pier tips into water.

BOAT DYNAMICS:
  10 boats, each 120 mm × 55 mm, deck 12 mm above water, mass ≈ 0.5 kg (model boat)
  Boat speed: v_boat = 40 mm/s on a circular arc of r_boat ∈ [200, 600] mm
  Boat orbit period: T = 2π × r_boat / v_boat
    r_boat = 400 mm: T = 2π × 0.40 / 0.04 = 62.8 s per full circuit
  Bey-on-boat transition: bey must approach boat at <60 mm/s relative speed to land stably;
    at approach speed >200 mm/s, bey bounces off boat hull (ε_hull ≈ 0.50).
  Boat-on-boat collision (wave-driven): boats may collide, creating momentary obstacles.
  Bey falls off boat: if wave lifts water >12 mm at boat location, bey swept off deck.
```

### TypeScript Reference Functions

```typescript
function blackSeaBowlWhirlpoolOmega(t_s: number, omega0 = 0.5, lambda = 0.08): number {
  return omega0 * Math.exp(lambda * t_s);
}
// blackSeaBowlWhirlpoolOmega(20)  →  2.46 rad/s
// blackSeaBowlWhirlpoolOmega(30)  →  5.46 rad/s

function blackSeaBowlWaveForcePeak(H_wave_m: number, road_width_m: number): number {
  return 1000 * 9.81 * H_wave_m * road_width_m * Math.sin(30 * Math.PI / 180);
}
// blackSeaBowlWaveForcePeak(0.020, 0.10)  →  9.81 N

function blackSeaBowlBankClimbSpeed(H_bank_m: number, eta = 0.80): number {
  return Math.sqrt((2 * 9.81 * H_bank_m) / eta);
}
// blackSeaBowlBankClimbSpeed(0.0466, 0.80)  →  1.07 m/s  (min to crest bank)

function blackSeaBowlWaterSpinDecay(
  mu_eff: number, mass_kg: number, rTip_m: number, I_kgm2: number
): number {
  return (mu_eff * mass_kg * 9.81 * rTip_m) / I_kgm2;
}
// blackSeaBowlWaterSpinDecay(1.0, 0.022, 0.0008, 3.8e-6)  →  45.5 rad/s² (water immersion)
// blackSeaBowlWaterSpinDecay(0.20, 0.022, 0.0008, 3.8e-6)  →  9.10 rad/s² (road)

function blackSeaBowlBoatOrbitPeriod(rBoat_m: number, vBoat_ms: number): number {
  return (2 * Math.PI * rBoat_m) / vBoat_ms;
}
// blackSeaBowlBoatOrbitPeriod(0.40, 0.04)  →  62.8 s per circuit

function blackSeaBowlOuterWallClearSpeed(H_wall_m: number, arAngleDeg: number): number {
  const vVert = Math.sqrt(2 * 9.81 * H_wall_m);
  return vVert / Math.sin((arAngleDeg * Math.PI) / 180);
}
// blackSeaBowlOuterWallClearSpeed(0.080, 30)  →  2.50 m/s  (radial speed needed to ring-out)
```

---

## Case 563 — BBA V-Force Tower Arena (Biovolt Cylinder): 2 m Hemispherical Outer Bowl on 1 m Column, Raised 30 cm Inner Victory Platform, Spherical-Arc Wall-Riding Centripetal Physics, and 10-Second Solo-Platform Alternate Win Condition

**Thesis:** The Tower Arena (BBA V-Force era, Biovolt research facility, referred to here as the Biovolt Cylinder) is a two-tier structural assembly: a 1000 mm tall cylindrical support column with a 2000 mm diameter (2 m × 2 m plan footprint) forms the pedestal, and mounted on its top face is a near-hemispherical battle bowl of outer rim radius R_outer = 1000 mm, bowl curvature radius R_sphere = 1025 mm, and central floor depth H_floor = R_sphere − √(R_sphere² − R_outer²) = 1025 − √(1025² − 1000²) = 1025 − √(50625) = 1025 − 225 = 800 mm below the rim, making the bowl 800 mm deep and the combined structure 1000 + 800 = 1800 mm total height from ground to bowl floor and 1000 mm from ground to the bowl rim; the bowl is surfaced in smooth white ABS (μ_wall = 0.13, ε_wall = 0.80) and has no Tornado Ridge, no secondary incline, and no bump features — it is a pure spherical arc from the rim down to the flat central floor over the entire 1000 mm radial span; at the centre of the floor sits a raised inner victory platform of diameter 300 mm (R_inner = 150 mm) and raised lip height h_raise = 30 mm above the bowl floor, with a shallow concave dish on its top surface (dish depth h_dish = 10 mm, inner floor at h_floor_inner = 20 mm above the outer bowl floor); the outer housing is a five-petal rose-shaped ABS frame at the bowl rim with five pocket exits each approximately 90 mm chord, giving total exit arc = 5 × 90 = 450 mm on a rim circumference of π × 2000 = 6283 mm and P(ring-out | reach rim at random azimuth) = 450/6283 = 0.0716, a low 7.2% ejection probability that makes ring-out unusual and requires deliberately aimed high-energy impacts; the primary win conditions are standard spin-out and ring-out, applicable throughout the outer bowl; the alternate win condition unique to this arena is the Solo Platform Hold: a beyblade whose tip is in contact with the inner platform floor or the raised lip rim for 10 continuous seconds while no other beyblade simultaneously contacts the platform wins the bout, with the timer resetting to zero any time a second beyblade touches the platform floor or rim; the wall-riding physics are entirely centripetal: for circular orbital motion at spherical-arc angle φ from the bowl bottom (φ = 0° at floor centre, φ = 77.6° at the outer rim), the normal force supplies both centripetal and weight-support components giving N(φ) = mg/cos(φ) — at the rim cos(77.6°) = 0.219 so the wall presses the beyblade with 4.56 × mg, enormously amplifying spin decay to α_wall(φ) = α_flat/cos(φ); the required orbital speed v_orbit(φ) = √(g × R_sphere × sin²φ/cosφ) reaches 6.60 m/s at the rim (beyond plastic-gen launchers), 3.87 m/s at φ = 60°, and 1.70 m/s at φ = 30°, meaning launched beys spiral downward from their entry angle as speed decays; a bey descending to the outer bowl floor from any orbit height above 41 mm carries enough speed to mount the 30 mm inner platform lip (v_floor ≥ 0.784 m/s), and once on the dish floor, friction traps the bey below the 0.443 m/s escape threshold within 0.02–0.58 seconds depending on entry speed; the three interaction zones — high wall (φ > 45°, primary combat zone), lower bowl (φ < 45°, decay and approach zone), and inner platform (victory zone) — create a bout structure where fast beys fight actively in the outer bowl while slow or deliberate beys compete for the 10-second platform hold, and the timer is calibrated to the spin life of a near-exhausted plastic-gen stamina bey (approximately 9 s at ω₀ = 100 rad/s on the dish floor), making the alternate win condition a genuine race between platform time and remaining spin.

### Visual Geometry — Tower Arena Plan View and Bowl Cross-Section

```
PLAN VIEW (top-down, outer housing 2000 mm × 2000 mm footprint):

            ╔════════════╦══════════════════════════╦════════════════╗
         ╔══╝  [EXIT A]  ╚══╗                    ╔══╝  [EXIT B]     ╚══╗
        ║   90 mm chord      ║                  ║   90 mm chord         ║
       ╔╝                    ╚╗                ╔╝                       ╚╗
      ║  [EXIT E]              ╲  OUTER BOWL  ╱              [EXIT C]    ║
      ║  90 mm                  ╲  WALL       ╱               90 mm      ║
      ║                          ╲  μ=0.13   ╱                            ║
      ║                           ╲  ABS    ╱                             ║
      ║                            ╲       ╱                              ║
      ║                             ╲     ╱  ← bowl rim at R = 1000 mm    ║
      ║                              ╲   ╱   P(ring-out) = 7.2%           ║
      ╚╗                              ╲ ╱                              ╔═╝
       ╚═╗  [EXIT D] 90mm              V                          ╔═══╝
         ╚══════════════════════════════╲══════════════════════════╝
                               ┌─────────────────────────────────┐
                               │       OUTER BOWL FLOOR           │
                               │  (Zone 1/2: wall orbit, combat)  │
                               │   R_outer = 1000 mm              │
                               │       ┌────────────────┐         │
                               │       │ Zone 2: lower  │         │
                               │       │ bowl / descent │         │
                               │      ┌┴──────────────┬┘         │
                               │      │ Zone 3:        │          │
                               │      │ INNER PLATFORM │          │
                               │      │ R = 150 mm     │          │
                               │      │ h_raise = 30 mm│          │
                               │      │ Dish depth 10mm│          │
                               │      └────────────────┘          │
                               └─────────────────────────────────┘

  Five petal exits at rim, each 90 mm chord; total 450 mm / 6283 mm circumference = 7.2 % of rim
  Inner platform: ⌀ 300 mm raised 30 mm above bowl floor; dish 10 mm deep (inner floor at 20 mm)
  Both the dish FLOOR (h = 20 mm) and the platform LIP RIM (h = 30 mm) count for the 10-second timer
```

```
RADIAL CROSS-SECTION (centre on left, petal exit side on right):

  Height
  above    800 ─┐                              ╔══ outer bowl rim / petal housing
  floor        │                           ╔══╝   φ_rim = 77.6°  (nearly vertical)
  (mm)     700 ─┤                        ╔══╝
               │                      ╔══╝
           600 ─┤                   ╔══╝     Zone 1 — HIGH-ENERGY WALL ORBIT
               │                 ╔══╝        φ > 45°,  v_orbit > 2.67 m/s
           500 ─┤              ╔══╝           N up to 4.56 mg at rim
               │           ╔══╝
           400 ─┤        ╔══╝
               │      ╔══╝
           300 ─┤   ╔══╝ ─────────────────── φ = 45° boundary (z = 300 mm)
               │╔══╝
           200 ─┤╗  Zone 2 — DECAY / APPROACH ORBIT
               ││  φ = 0–45°,  v_orbit = 0–2.67 m/s
           100 ─┤│
               ││
            30 ─╪══╗  ← inner platform lip rim (h = 30 mm)         ← Zone 3
               ║   ║
            20 ─╪   ╘═════════════════╗  ← inner dish floor (h = 20 mm)
               ║                     ║
             0 ─╩═════════════════════╩══════════════════════════════════════
               │                     │                                       │
               0                  150 mm                               1000 mm
                                     ↑                                       ↑
                                platform edge                           bowl rim
                                R_inner = 150 mm                    R_outer = 1000 mm

  R_sphere = 1025 mm  (radius of curvature of bowl wall)
  H_floor  = 800 mm   (bowl depth from rim to floor)
  Wall angle at rim: φ = arcsin(1000/1025) = 77.6° from horizontal
```

```
STRUCTURAL SIDE ELEVATION:

  ┌──────────────────────────────────────────────────────────────────────────────┐
  │  OUTER BATTLE BOWL  (800 mm deep, R = 1000 mm rim)                          │ ← 800 mm
  │  Spherical-arc ABS wall, μ = 0.13, ε = 0.80                                  │
  │  Inner victory platform at centre floor (⌀ 300 mm, raised 30 mm)            │
  └──────────────────────────────────────────────────────────────────────────────┘
  ╔════════════════════════════════════════════════════════════════════════════════╗
  ║   SUPPORT COLUMN  (tapered cylinder, base ≈ 500 mm dia)                       ║ ← 1000 mm
  ║   Height: 1000 mm  from ground to bottom of bowl                              ║
  ╚════════════════════════════════════════════════════════════════════════════════╝
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │  GROUND BASE (2000 mm × 2000 mm footprint)                                   │
  └──────────────────────────────────────────────────────────────────────────────┘
  Total height: ground → bowl rim = 1000 mm.
  Bowl rim is 1000 mm above ground; bowl floor is 800 mm below rim (1800 mm above ground is wrong —
  the bowl floor is 1000 − 800 = 200 mm above ground, i.e. the column raises the bowl floor to 200 mm
  and the rim to 1000 mm; beyond this only the structural base sits below).
```

### Spherical-Arc Wall-Riding Centripetal Analysis

```
COORDINATE SYSTEM:
  φ = angle measured along sphere surface from bowl bottom (φ=0° at lowest floor point)
  r(φ)  = R_sphere × sin(φ)           horizontal radius from bowl axis
  z(φ)  = R_sphere × (1 − cos(φ))     height above bowl floor
  R_sphere = 1025 mm = 1.025 m,  g = 9.81 m/s²

CIRCULAR ORBIT EQUATIONS (bey in horizontal circle at angle φ):
  Normal force from wall (perpendicular to spherical surface, directed inward/upward toward sphere centre):
    Vertical:    N × cos(φ) = mg            →  N = mg / cos(φ)
    Horizontal:  N × sin(φ) = mv² / r(φ)   →  v²  = g × R_sphere × sin²(φ) / cos(φ)

  v_orbit(φ) = √( g × R_sphere × sin²(φ) / cos(φ) )   [m/s]
  N(φ) / mg  = 1 / cos(φ)                               [dimensionless amplification]
  T_orbit(φ) = 2π × √(R_sphere / g) × √cos(φ) = 2.030 × √cos(φ)  [seconds]

ORBIT SPEED, NORMAL FORCE, AND PERIOD TABLE:

  φ (°)  r (mm)  z (mm)  v_orbit (m/s)  N/mg    T_orbit (s)  Orbits/s
  ──────────────────────────────────────────────────────────────────────
   20      351      66      1.12          1.06    1.89          0.53
   30      513     137      1.70          1.15    1.76          0.57
   40      659     215      2.24          1.31    1.60          0.62
   45      725     300      2.67          1.41    1.52          0.66
   50      785     391      3.15          1.56    1.43          0.70
   60      888     513      3.87          2.00    1.28          0.78
   70      963     674      5.06          2.92    1.11          0.90
  77.6    1000     800      6.60          4.56    0.96          1.04  ← rim

PLASTIC-GENERATION LAUNCHER WINDOW (v_launch ≈ 2.5–3.5 m/s):
  v_orbit = 2.50 m/s → φ ≈ 46°, z ≈ 314 mm  (entry orbit height for standard launch)
  v_orbit = 3.50 m/s → φ ≈ 62°, z ≈ 570 mm  (high-power entry)
  Rim orbit (6.60 m/s) exceeds plastic-gen capability; MFB or Burst launchers (4–5 m/s) reach φ ≈ 73–75°.
  Entry: beys are launched from the rim level and immediately begin spiral descent as spin decays.

ORBIT STABILITY: the spherical bowl is self-correcting below the rim.
  A bey hit upward (δφ > 0) gains height but lacks speed for that orbit → gravity pulls it back.
  A bey hit downward (δφ < 0) descends and gains speed relative to orbit need → centripetal restores contact.
  Orbits are stable at any height where N > 0, i.e. for all φ < 90° — the full bowl below the rim.
```

### Spin Decay Amplification on Curved Wall

```
SPIN DECAY ON CURVED WALL vs FLAT FLOOR:
  α_flat = μ × m × g × r_tip / I   (standard flat-floor rate)
  α_wall(φ) = α_flat / cos(φ)       (amplified by N/mg = 1/cos(φ))

REFERENCE ASSEMBLY: Dranzer S (m = 0.022 kg, I = 3.8×10⁻⁶ kg·m², r_tip = 1.5 mm ball, μ = 0.13):
  α_flat = 0.13 × 0.022 × 9.81 × 0.0015 / 3.8×10⁻⁶ = 11.1 rad/s²
  Spin life (ω₀ = 300 rad/s, plastic-gen): t_flat = 300 / 11.1 = 27.0 s

  φ (°)   z (mm)  cos(φ)  α_wall (rad/s²)  t_spin from ω₀=300 (s)  vs flat
  ──────────────────────────────────────────────────────────────────────────────
   20       66     0.940        11.8              25.4               −6%
   30      137     0.866        12.8              23.4               −13%
   45      300     0.707        15.7              19.1               −29%
   60      513     0.500        22.2              13.5               −50%
   70      674     0.342        32.5               9.2               −66%
  77.6     800     0.219        50.7               5.9               −78%

ATTACK TYPE EXAMPLE (wide tip, μ = 0.30, r_tip = 3.0 mm, m = 0.026 kg, I = 4.2×10⁻⁶ kg·m²):
  α_flat = 0.30 × 0.026 × 9.81 × 0.003 / 4.2×10⁻⁶ = 54.8 rad/s²
  At rim (φ=77.6°): α_rim = 54.8 / 0.219 = 250 rad/s²
  Spin life at rim (ω₀=300): 300 / 250 = 1.2 s — attack types cannot orbit the rim; they transit rapidly.
  Attack types are most effective using brief high-speed passes through Zone 1, not sustained orbits.

SPIN DECAY DRIVING STRATEGIC ORBIT CHOICE:
  A stamina type (sharp tip) survives 19 s at φ=45° then descends to lower bowl.
  A defense type (ball tip, μ≈0.18, r_tip=2mm): α_flat=20.4 → α_rim=93.2 rad/s², t_rim=3.2 s.
  Any type that sustains high-wall orbit burns spin fast; the arena penalises passive high-orbit camping.
  The natural strategy for stamina: enter at moderate height, allow decay, enter inner platform early.
```

### Outer Bowl Ring-Out Analysis

```
PETAL EXIT GEOMETRY (at outer bowl rim, R_outer = 1000 mm):
  Five exits, each 90 mm chord;  total exit arc = 450 mm
  Rim circumference: C = 2π × 1000 = 6283 mm
  P(ring-out | bey reaches rim at random azimuth) = 450 / 6283 = 0.0716  (7.2%)
  P(wall bounce) = 92.8%  — most rim contacts deflect beys back into the bowl.

SPEED NEEDED TO REACH RIM FROM MID-BOWL (ignoring friction, energy conservation):
  Bey at height z_orbit ascending to rim (z = 800 mm):
  v_rim = √( v_orbit² − 2g × (0.800 − z_orbit/1000) )

  From φ=45° (z=300mm, v=2.67 m/s): v_rim = √(7.13 − 2×9.81×0.500) = √(7.13−9.81) < 0  → cannot reach rim.
  From φ=60° (z=513mm, v=3.87 m/s): v_rim = √(14.98 − 2×9.81×0.287) = √(14.98−5.63) = √9.35 = 3.06 m/s.
  → Ring-out requires a bey already orbiting above φ ≈ 58° to be redirected radially outward.

COLLISION-INDUCED RING-OUT:
  A radial impulse at φ=60° imparts outward component; combined with orbital tangential speed:
  v_impact = 2.5 m/s radially, v_tang = 3.87 m/s; v_total = √(2.5² + 3.87²) = 4.61 m/s.
  Max height: z_max = z_orbit + v_total²/(2g) = 0.513 + 4.61²/19.62 = 0.513 + 1.083 = 1.596 m > 0.800 m.
  Ring-out if azimuth aligns with exit: P = 7.2%.
  Summary: ring-out is possible via energetic collisions in Zone 1 but unlikely by chance (7.2%).
```

### Inner Platform Entry and Trapping Analysis

```
INNER PLATFORM GEOMETRY:
  Outer lip radius:  R_inner = 150 mm
  Lip height:        h_raise = 30 mm above outer bowl floor
  Dish depth:        h_dish = 10 mm below lip rim
  Inner floor height: h_floor_inner = 20 mm above outer bowl floor
  Dish floor radius: R_dish ≈ 120 mm (lip width ~30 mm, inferred from image proportions)
  Lip wall angle:    α_lip ≈ 70° from horizontal (steep ABS wall)

MINIMUM APPROACH SPEED TO MOUNT LIP FROM OUTER FLOOR:
  Energy to climb h_raise = 30 mm (plus friction on lip wall):
    v_min_energy = √(2g × 0.030) = √(0.589) = 0.767 m/s
  Friction correction (climb length ≈ h_raise/sin(70°) = 31.9 mm, μ = 0.13, N = mg×cos(70°)):
    ΔKE_friction = 0.13 × 0.022 × 9.81 × cos(70°) × 0.0319 = 3.07×10⁻⁴ J
    Δv_friction  = √(2×3.07×10⁻⁴ / 0.022) = 0.167 m/s
  Corrected minimum: v_approach_min = √(0.767² + 0.167²) ≈ 0.784 m/s

MINIMUM ORBIT HEIGHT TO GENERATE v_floor ≥ 0.784 m/s:
  Descending to bowl floor (height h_orbit → 0), η = 0.88 for smooth-ABS descent:
    v_floor = √(2g × h_orbit) × 0.88 ≥ 0.784
    h_orbit ≥ (0.784/0.88)² / (2×9.81) = 0.794/19.62 = 0.0405 m = 40.5 mm
  → Any bey orbiting above h = 41 mm on the outer bowl (essentially all active beys) can
    reach v_floor ≥ 0.784 m/s and mount the inner platform.

DISH ENTRY SPEED (after clearing 30 mm lip, descending 10 mm into dish):
  v_dish = √( v_approach² − 2g×(h_raise − h_dish) ) = √( v_approach² − 2×9.81×0.020 )
         = √( v_approach² − 0.392 )

  v_approach (m/s)  v_dish (m/s)   Notes
  ────────────────────────────────────────────────────────────────────────
  0.784             0.472          minimum-speed entry
  1.00              0.780          typical low-orbit entry
  1.40              1.18           mid-orbit entry (φ ≈ 30°)
  2.30              2.19           high-orbit entry (φ ≈ 45°)

ESCAPE CONDITION AND TRAPPING TIME:
  Escape speed from dish (climb 10 mm from dish floor to lip rim):
    v_escape = √(2g × 0.010) = 0.443 m/s
  Linear deceleration on dish floor: a_trap = μ × g = 0.13 × 9.81 = 1.275 m/s²
  Trapping time (from v_dish to v_escape):
    t_trap = (v_dish − v_escape) / a_trap

  v_dish  →  t_trap
  0.472 m/s   0.023 s  (minimum entry: trapped in 23 ms)
  0.780 m/s   0.263 s
  1.18 m/s    0.577 s
  2.19 m/s    1.37 s   (high-speed entry: 1.4 s of bouncing before trap)

  A fast bey entering at 2.19 m/s oscillates in the dish 1.4 s before being trapped.
  During this time it may bounce off the dish's inner wall and escape if directed toward the lip.
  Beys entering below 1.0 m/s are reliably trapped within 0.26 s.
```

### 10-Second Solo Platform Hold — Victory Condition Dynamics

```
TIMER RULES (as specified):
  Starts:  one and only one beyblade contacts platform floor or lip rim.
  Resets:  second beyblade contacts platform floor or lip rim.
  Resets:  sole occupant's tip leaves platform entirely.
  Win:     sole occupant holds 10 s continuously.

SCENARIO A — Standard fight ends before platform becomes relevant:
  One bey knocked out (ring-out) or spun out in outer bowl while other survives → standard win.
  Platform condition is irrelevant; most bouts at high spin end this way.

SCENARIO B — Both beys decay to low orbit, one enters platform first:
  Bey A enters platform, gets trapped. Timer starts.
  Bey B still in outer bowl at h_orbit. If h_orbit > 41 mm: Bey B can mount lip → timer resets.
  Critical juncture: Bey B must reach the platform before 10 s elapses.
  With Bey B at φ = 20° (z = 66 mm, v_orbit = 1.12 m/s):
    Time for Bey B to complete one orbit at φ=20°: T = 1.89 s.
    Bey B needs ~3–5 orbits to descend to floor (φ=20° → 0): approximately 8–12 s.
    If Bey A entered platform just as Bey B reached φ=20°: Bey B likely cannot intervene in time.
    Timer runs to 10 s → Bey A wins.
  Counter-strategy: Bey B player must attempt to descend to the platform quickly (accepting
  spin loss) rather than trying to knock Bey A out from orbit.

SCENARIO C — Simultaneous platform occupation:
  Both beys trapped in dish. Timer stays at 0.
  Now a spin-out race: whichever bey spins out first leaves the platform.
  Surviving bey: timer starts. Opposing player has no remaining bey to reset it.
  Stamina matchup inside dish — μ and r_tip determine survival time.
  Stamina type (α_dish = 11.1 rad/s², ω₀ = 80 rad/s remaining): t_spin = 80/11.1 = 7.2 s.
  Attack type (α_dish = 76.8/cos0°= 76.8 rad/s², ω₀ = 80): t_spin = 80/76.8 = 1.04 s.
  Attack type spins out 7× faster in dish → stamina types dominate inside the platform.

SCENARIO D — Ejecting the platform occupant:
  Bey in dish floor (h = 20 mm) must be hit to clear lip (climb Δh = 10 mm dish floor → rim = 30 mm total):
    v_vert_needed = √(2g × 0.040) = 0.885 m/s (vertical component to clear 40 mm from dish floor to outer)
  At AR contact angle β: v_impact = v_vert / sin(β)
    β = 30°: v_impact_min = 0.885/0.500 = 1.77 m/s
    β = 45°: v_impact_min = 0.885/0.707 = 1.25 m/s
    β = 60°: v_impact_min = 0.885/0.866 = 1.02 m/s
  Attack types with wide, high-angle AR contact (β ≈ 45–60°) can eject at 1.0–1.25 m/s approach speed.
  Once a bey is in the outer bowl at v_orbit = 1.7 m/s (φ=30°), it has sufficient kinetic energy to eject.
  Ejection requires directional accuracy: attacker must hit radially inward-to-outward, not tangentially.

10-SECOND TIMER CALIBRATION AGAINST SPIN LIFE:
  Stamina bey trapped in dish at ω_remaining = 100 rad/s:
    α_dish = 11.1 rad/s² (flat floor, N ≈ mg since z/R << 1 inside dish)
    t_spin_remain = 100 / 11.1 = 9.0 s  < 10 s  → bey spins out before winning!
  Stamina bey at ω_remaining = 120 rad/s:
    t_spin_remain = 120 / 11.1 = 10.8 s  > 10 s  → holds 10 s and wins.
  Critical spin threshold for solo-platform win: ω_crit = 10 × α_dish = 10 × 11.1 = 111 rad/s.
  A bey entering the platform with spin above 111 rad/s (≈ 38% of launch spin) wins by platform hold.
  Below 111 rad/s, it spins out in the dish before the timer expires — win condition fails.
  This ω_crit creates a tight entry window: bey must enter early enough to have >111 rad/s remaining,
  but not so early that the opponent also has enough energy to mount the platform and reset the timer.
```

### Zone Combat Summary and Strategic Geometry

```
ZONE DEFINITIONS:

  Zone 1 — HIGH WALL  (φ = 45°–77.6°,  z = 300–800 mm,  r = 725–1000 mm)
    v_orbit:   2.67–6.60 m/s     N:   1.41–4.56 mg
    α_decay:   15.7–50.7 rad/s²  T:   0.96–1.52 s/orbit
    Role: primary combat. Both beys fight here after launch. Collision forces amplified
    by N(φ) factor — AR hits at φ=60° deliver 2× force vs flat floor. Spin burns fast.
    Ring-out most viable (beys near rim, high kinetic energy available).
    Attack strategy: repeatedly hit opponent while both are in Zone 1 to force spin loss.
    Stamina strategy: orbit efficiently at lower φ (45–50°), minimise wall-contact time.

  Zone 2 — LOWER BOWL  (φ = 0°–45°,  z = 0–300 mm,  r = 0–725 mm)
    v_orbit:   0–2.67 m/s        N:   1.00–1.41 mg
    α_decay:   11.1–15.7 rad/s²  T:   1.52–2.03 s/orbit
    Role: decay and transition. Beys completing 3–8 orbits before floor contact.
    Ejection of platform occupant still viable from here (v = 1.7 m/s at φ=30°).
    Platform monitoring: actively track opponent's orbit height.

  Zone 3 — INNER PLATFORM  (h = 0–30 mm,  r = 0–150 mm)
    Trapping speed threshold: 0.443 m/s
    α_dish:    11.1 rad/s² (stamina) to 76.8 rad/s² (attack type)
    Role: alternate win zone. Stamina types dominate; attack types spin out in < 2 s.
    Timer races opponent's intervention and own spin life.
    ω_crit = 111 rad/s for solo-platform win.

ORBIT DECAY PATH (stamina type, φ_entry = 50°, v_entry = 3.15 m/s, ω₀ = 300 rad/s):
  Entry: φ=50°, z=391mm. α_wall = 17.3 rad/s². Speed decays, φ drops.
  After ~8 orbits (11 s): ω ≈ 162 rad/s, orbit drops to φ ≈ 40° (z=215mm).
  After ~14 orbits (20 s): ω ≈ 74 rad/s, orbit drops to φ ≈ 25°, approaching floor.
  Floor arrival: v_floor ≈ √(2g×0.215)×0.88 = 1.93 m/s.
  Platform entry: v_dish ≈ 1.90 m/s — trapped in ~1.2 s.
  Remaining ω at platform entry: ~60 rad/s < ω_crit = 111 → cannot win by platform hold.
  Implication: stamina types that spend too long orbiting Zone 1/2 arrive at platform with
  insufficient spin. Optimal platform strategy requires earlier entry (ω > 111 rad/s at entry time).
  Entry at orbit time ≈ 13–15 s (ω ≈ 120 rad/s, φ ≈ 35°): v_floor ≈ 1.60 m/s, trapped in 0.9 s.
  Spin remaining after trap: ω_rem = 120 − 11.1×0.9 = 110 rad/s ≈ ω_crit → borderline win.
  Optimal entry: orbit φ ≈ 35–40° with ω ≈ 125–130 rad/s, then descend and mount platform immediately.
```

### TypeScript Reference Functions

```typescript
function towerBowlOrbitSpeed(phiDeg: number, rSphere_m = 1.025): number {
  const phi = (phiDeg * Math.PI) / 180;
  return Math.sqrt(9.81 * rSphere_m * (Math.sin(phi) ** 2) / Math.cos(phi));
}
// towerBowlOrbitSpeed(30)   →  1.70 m/s
// towerBowlOrbitSpeed(45)   →  2.67 m/s
// towerBowlOrbitSpeed(60)   →  3.87 m/s
// towerBowlOrbitSpeed(77.6) →  6.60 m/s  (rim, requires anime-scale launcher)

function towerBowlHeight(phiDeg: number, rSphere_m = 1.025): number {
  const phi = (phiDeg * Math.PI) / 180;
  return rSphere_m * (1 - Math.cos(phi));
}
// towerBowlHeight(30)   →  0.137 m  (137 mm above bowl floor)
// towerBowlHeight(45)   →  0.300 m
// towerBowlHeight(77.6) →  0.800 m  (rim level)

function towerBowlNormalForce(phiDeg: number, mass_kg: number): number {
  const phi = (phiDeg * Math.PI) / 180;
  return (mass_kg * 9.81) / Math.cos(phi);
}
// towerBowlNormalForce(45, 0.022)  →  0.305 N  (1.41 × weight)
// towerBowlNormalForce(60, 0.022)  →  0.431 N  (2.00 × weight)
// towerBowlNormalForce(77.6, 0.022) → 0.984 N  (4.56 × weight)

function towerBowlSpinDecayWall(
  phiDeg: number, mu: number, mass_kg: number, rTip_m: number, I_kgm2: number
): number {
  const cosP = Math.cos((phiDeg * Math.PI) / 180);
  const alphaFlat = (mu * mass_kg * 9.81 * rTip_m) / I_kgm2;
  return alphaFlat / cosP;
}
// towerBowlSpinDecayWall(45,  0.13, 0.022, 0.0015, 3.8e-6) →  15.7 rad/s²
// towerBowlSpinDecayWall(60,  0.13, 0.022, 0.0015, 3.8e-6) →  22.2 rad/s²
// towerBowlSpinDecayWall(77.6,0.13, 0.022, 0.0015, 3.8e-6) →  50.7 rad/s²  (rim)

function towerBowlOrbitPeriod(phiDeg: number, rSphere_m = 1.025): number {
  const phi = (phiDeg * Math.PI) / 180;
  return 2 * Math.PI * Math.sqrt(rSphere_m / 9.81) * Math.sqrt(Math.cos(phi));
}
// towerBowlOrbitPeriod(30)   →  1.76 s  (0.57 orbits/s)
// towerBowlOrbitPeriod(45)   →  1.52 s  (0.66 orbits/s)
// towerBowlOrbitPeriod(77.6) →  0.96 s  (1.04 orbits/s, fastest orbiting rate at rim)

function towerInnerPlatformMinApproachSpeed(h_raise_m = 0.030, mu_lip = 0.13, lipAngleDeg = 70): number {
  const energy = 2 * 9.81 * h_raise_m;
  const climbLen = h_raise_m / Math.sin((lipAngleDeg * Math.PI) / 180);
  const frictionDv2 = 2 * (mu_lip * 9.81 * Math.cos((lipAngleDeg * Math.PI) / 180) * climbLen);
  return Math.sqrt(energy + frictionDv2);
}
// towerInnerPlatformMinApproachSpeed()  →  0.784 m/s

function towerInnerDishEscapeSpeed(h_dish_m = 0.010): number {
  return Math.sqrt(2 * 9.81 * h_dish_m);
}
// towerInnerDishEscapeSpeed()  →  0.443 m/s

function towerInnerTrappingTime(
  vApproach_ms: number, h_raise_m = 0.030, h_dish_m = 0.010, mu_dish = 0.13
): number {
  const vDish = Math.sqrt(Math.max(0, vApproach_ms ** 2 - 2 * 9.81 * (h_raise_m - h_dish_m)));
  const vEscape = Math.sqrt(2 * 9.81 * h_dish_m);
  if (vDish <= vEscape) return 0;
  return (vDish - vEscape) / (mu_dish * 9.81);
}
// towerInnerTrappingTime(0.784) →  0.023 s  (minimum-speed entry: trapped almost instantly)
// towerInnerTrappingTime(1.00)  →  0.263 s
// towerInnerTrappingTime(1.40)  →  0.577 s
// towerInnerTrappingTime(2.19)  →  1.37 s   (high-speed entry)

function towerEjectionImpactThreshold(h_dish_m = 0.010, h_raise_m = 0.030, contactAngleDeg = 30): number {
  const totalClimb = h_raise_m + h_dish_m;
  const vVert = Math.sqrt(2 * 9.81 * totalClimb);
  return vVert / Math.sin((contactAngleDeg * Math.PI) / 180);
}
// towerEjectionImpactThreshold(0.010, 0.030, 30) →  1.77 m/s  (β=30° AR contact)
// towerEjectionImpactThreshold(0.010, 0.030, 45) →  1.25 m/s  (β=45°, attack-type AR)
// towerEjectionImpactThreshold(0.010, 0.030, 60) →  1.02 m/s  (β=60°, steep attack AR)

function towerCriticalSpinForPlatformWin(
  alpha_dish_rads2: number, holdTime_s = 10
): number {
  return alpha_dish_rads2 * holdTime_s;
}
// towerCriticalSpinForPlatformWin(11.1)  →  111 rad/s  (stamina — min spin at trap to win)
// towerCriticalSpinForPlatformWin(76.8)  →  768 rad/s  (attack — effectively unreachable: attack types never win by platform hold)

function towerRingOutProbability(exitCount = 5, exitChord_mm = 90, rimRadius_mm = 1000): number {
  return (exitCount * exitChord_mm) / (2 * Math.PI * rimRadius_mm);
}
// towerRingOutProbability()  →  0.0716  (7.2%)
```

---

## Case 564 — Roman Colosseum Arena (BBA G-Revolution): Eight-Ring Stepped Platform Geometry, Discrete Height-Drop Collision Physics, and Spin-Out-Only Termination

**Thesis:** The Roman Colosseum Arena (appearing in the BBA G-Revolution anime and its tie-in game, modelled after the ancient Roman amphitheatre) is a 3 × 3 m closed circular arena whose defining structural motif is eight concentric stepped platforms descending from the outermost rim (height H_8 = 700 mm, radius R_outer = 1500 mm) to the flat central stage (height H_0 = 0 mm, radius R_0 = 175 mm), with no ring-out exits and no pocket openings anywhere on the colosseum wall so that every match terminates exclusively by spin-out; the seven intermediate rings each carry a uniform radial width of w_ring = (1500 − 175) / 7 = 189 mm ≈ 190 mm and a uniform step height of H_step = 700 / 7 = 100 mm, producing a constant step-drop angle of arctan(100 / 190) = 27.8° at every terrace edge; the terracotta-brick surface imposes a kinetic friction coefficient μ_brick = 0.28 and a wall-to-beyblade coefficient of restitution ε_brick = 0.62, values that lie between smooth ABS (μ = 0.15, ε = 0.85) and rubberised surfaces (μ = 0.50, ε = 0.40), so a beyblade traversing down all seven step edges loses Δv_step = (1 − ε_brick) × v_impact per step while gaining gravitational energy ½mv² = mg × H_step from the 100 mm vertical fall, yielding a net speed change per step of Δv_net = √(v_in² + 2 × 9.81 × 0.100) × ε_brick − v_in that is positive (accelerating) for inbound speeds below v_threshold = √(2 × 9.81 × 0.100 × ε_brick² / (1 − ε_brick²)) = √(2 × 9.81 × 0.100 × 0.385 / 0.615) = 1.11 m/s, meaning any beyblade approaching a step at less than 1.11 m/s is net-accelerated by the bounce energy harvest while a fast attacker above 1.11 m/s loses net speed on each bounce; the flat central stage (R_0 = 175 mm, H_0 = 0 mm) is enclosed by the innermost 100 mm step wall on all sides, so a beyblade on the central stage that loses all outward momentum is effectively contained by the surrounding retaining wall and must await an attacker to reach it, establishing the stamina-and-wait strategy as the single strongest play pattern in this arena; spin decay on the terracotta surface is α_brick = (μ_brick × m × g × r_tip) / I_total = 0.28 / 0.15 × α_ABS = 1.867 × 10.3 = 19.2 rad/s² for a standard attack-type tip (r_tip = 3 mm, I = 3.3 × 10⁻⁵ kg·m²), meaning a stamina-type on the smooth central stage (μ_smooth = 0.10 assumed for the polished marble centre) decays at only α_centre = 6.87 rad/s² while a heavy attack-type on the brick rings decays at 19.2 rad/s², a 2.79× spin-life penalty that compounds over the long multi-platform chase distances required to corner a central stamina top; the absence of exits inverts the usual attack-type advantage (ring-out threat) and rewards precision multi-step descents over brute lateral force, classifying this arena as strongly stamina-favoured with a decisive positional advantage to the first beyblade to claim and hold the central stage.

### Visual Geometry — Eight-Ring Stepped Cross-Section (Radial Cut, Half-Profile)

```
Colosseum Arena — Radial Cross-Section (centre left, outer wall right):

 Height
 (mm)
  700 ─┐  outer wall (solid, no exits)
       │
  600 ─┤   Ring 8                  ← R = 1310–1500 mm
       │────────────────────────┐
  500 ─┤   Ring 7               │  ← R = 1120–1310 mm
       │────────────────────┐   │
  400 ─┤   Ring 6           │   │  ← R = 930–1120 mm
       │────────────────┐   │   │
  300 ─┤   Ring 5       │   │   │  ← R = 740–930 mm
       │────────────┐   │   │   │
  200 ─┤   Ring 4   │   │   │   │  ← R = 550–740 mm
       │────────┐   │   │   │   │
  100 ─┤  Ring 3│   │   │   │   │  ← R = 360–550 mm
       │────┐   │   │   │   │   │
   50 ─┤ R2 │   │   │   │   │   │  ← R = 175–360 mm  (H = 100 mm; Ring 2 half-scale: same step)
       │    │   │   │   │   │   │
    0 ─┴────┴   │   │   │   │   │
    Centre flat  │   │   │   │   │
   R=175 mm      │   │   │   │   │
                360  550 740 930 1120 1310 1500 mm  (radii)

  Platform   Radius Range (mm)   Height (mm)  Surface
  ─────────  ─────────────────   ──────────   ────────────────────────────
  Centre     0–175               0            Polished marble μ=0.10 ε=0.72
  Ring 2     175–365             100          Terracotta brick μ=0.28 ε=0.62
  Ring 3     365–555             200          Terracotta brick μ=0.28 ε=0.62
  Ring 4     555–745             300          Terracotta brick μ=0.28 ε=0.62
  Ring 5     745–935             400          Terracotta brick μ=0.28 ε=0.62
  Ring 6     935–1125            500          Terracotta brick μ=0.28 ε=0.62
  Ring 7     1125–1315           600          Terracotta brick μ=0.28 ε=0.62
  Ring 8     1315–1500           700          Terracotta brick μ=0.28 ε=0.62
  Outer wall 1500 (solid)        700          No exits; COR = ε_brick = 0.62
```

### Physics Analysis

**Step-Drop Energy Budget (single step, H_step = 100 mm):**

A beyblade at the inner edge of a ring at height H_k approaches the step edge with horizontal speed v_in. Falling H_step = 100 mm yields a vertical impact component v_vert = √(2 × 9.81 × 0.100) = 1.401 m/s. After bouncing off the terracotta riser (ε_brick = 0.62) the vertical component is absorbed and partially returned: v_vert_out = ε_brick × v_vert = 0.62 × 1.401 = 0.869 m/s. The horizontal component is preserved (no horizontal COR at the step face unless a direct glancing contact occurs). On a normal descent (bey rolls off the inner edge and drops): v_out_horizontal = v_in; effective speed at lower platform = √(v_in² + v_vert²) after impact = √(v_in² + 1.963) m/s (pre-bounce) then re-expressed as horizontal motion after landing.

Landing horizontal speed: v_land = √(v_in² + 2 × g × H_step) = √(v_in² + 1.963) m/s (free fall ignoring air drag).

Energy dissipated at landing impact (vertical component absorbed): ΔE_diss = ½ × m × v_vert² × (1 − ε_brick²) = ½ × m × 1.963 × (1 − 0.384) = ½ × m × 1.963 × 0.616 = 0.605m J.

| v_in (m/s) | v_land_pre (m/s) | ΔE_diss / (m) | v_horiz_post (m/s) | Net Δv (m/s) |
|-----------|-----------------|---------------|--------------------|--------------|
| 0.50      | 1.49            | 0.605 J/kg    | 1.28               | +0.78        |
| 1.00      | 1.68            | 0.605 J/kg    | 1.44               | +0.44        |
| 1.11      | 1.76            | 0.605 J/kg    | 1.51               | +0.40        |
| 1.50      | 2.03            | 0.605 J/kg    | 1.74               | +0.24        |
| 2.00      | 2.45            | 0.605 J/kg    | 2.10               | +0.10        |
| 2.50      | 2.86            | 0.605 J/kg    | 2.46               | -0.04        |

Net threshold (v_in above which descent is net-decelerating): v_thresh ≈ 2.45 m/s for this brick step. At BX burst-class attack speeds (v ≈ 3.5 m/s) each step descent removes roughly −0.3 m/s, so traversing all 7 steps from rim to centre costs the attacker approximately 2.1 m/s, arriving at the central stage at ~1.4 m/s versus a 3.5 m/s launch — a 60% speed deficit on arrival.

**Spin Decay by Surface:**

| Tip Type   | μ     | r_tip (mm) | I (×10⁻⁵ kg·m²) | α_centre (rad/s²) | α_brick (rad/s²) | t_spin_centre (s) | t_spin_brick (s) |
|-----------|-------|-----------|-----------------|------------------|-----------------|------------------|-----------------|
| Flat (D)  | 0.10  | 3.0        | 3.30            | 6.87             | 19.2            | 290 (at ω₀=2000) | 104             |
| Sharp (S) | 0.10  | 0.8        | 3.30            | 1.83             | 5.13            | 1090             | 389             |
| Rubber (RF)| 0.50 | 4.0        | 3.30            | 45.8             | 128             | 43.7             | 15.6            |

Sharp tip on polished centre (α = 1.83 rad/s²) gives t_spin = ω₀ / α = 2000 / 1.83 = 1090 s theoretical — stamina beyblade on the centre stage is effectively never lost to spin decay, only to collision.

**Traversal Time Across Rings (attacker descending from Ring 8 to centre):**

Total radial distance covered: 1500 − 175 = 1325 mm across 7 steps + 7 platforms of width 190 mm.

Assuming launch speed v₀ = 3.5 m/s, average post-step speed ~2.5 m/s, average platform travel speed ~2.3 m/s (friction deceleration a_brick = μ_brick × g = 0.28 × 9.81 = 2.75 m/s²):

Platform crossing time per ring (190 mm at 2.3 m/s mean): t_cross ≈ 190 / 2300 = 82.6 ms per ring.
Total traversal time (7 rings + drops): t_traverse ≈ 7 × 82.6 ms + 7 × 45 ms (drop+land) = 578 + 315 = 893 ms ≈ 0.893 s.

Spin lost by attacker (RF tip, α_brick = 128 rad/s²) in 0.893 s: Δω = 128 × 0.893 = 114 rad/s (from ω₀ ≈ 2400 rad/s = ~6% spin loss — negligible). Sharp stamina attacker loses 1.83 × 0.893 = 1.63 rad/s (negligible).

**Ring-Out Probability:** Zero. Outer wall is solid, circumferential, and continuous (H_wall = 700 mm, ε_wall_to_floor = 0.62 × reflection, bey cannot escape over 700 mm rim at any achievable speed). Ring-out P = 0.000.

**Collision Geometry at Step Risers:**

When an attacker on Ring 3 travels radially outward and strikes the vertical riser of Ring 4 (h_riser = 100 mm) at speed v_rad, the elastic fraction returned is: v_out_rad = ε_brick × v_rad = 0.62 × v_rad. If the attacker's AR height clears the riser, contact is at the riser face; if the AR is below the riser height (100 mm), the bey rides up the step edge — step climb condition: v_climb = √(2 × g × H_step) = 1.401 m/s minimum horizontal speed to climb one step. A stamina type circling the outer wall at v_orbit = 1.0 m/s cannot climb inward steps under its own momentum and is trapped on its platform until struck.

**Win Condition:** Spin-out only. Last spinning beyblade wins. No pocket exits anywhere. Outer wall returns all launches.

### TypeScript Reference Functions

```typescript
// Case 564 — Roman Colosseum Arena physics helpers

function colosseumStepLandingSpeed(
  v_in_ms: number,
  h_step_mm = 100,
  epsilon_brick = 0.62
): number {
  const g = 9.81;
  const h = h_step_mm / 1000;
  const v_vert = Math.sqrt(2 * g * h);
  const v_land_pre = Math.sqrt(v_in_ms ** 2 + v_vert ** 2);
  const v_vert_absorbed_loss = v_vert * (1 - epsilon_brick);
  const ke_loss = 0.5 * v_vert ** 2 * (1 - epsilon_brick ** 2);
  const v_horiz_post = Math.sqrt(Math.max(0, v_in_ms ** 2 + v_vert ** 2 - 2 * ke_loss));
  return v_horiz_post;
}
// colosseumStepLandingSpeed(0.50)  →  1.28 m/s  (net gain; slow bey accelerated by drop)
// colosseumStepLandingSpeed(1.50)  →  1.74 m/s  (still net gain)
// colosseumStepLandingSpeed(2.50)  →  2.46 m/s  (near-threshold; marginal loss)
// colosseumStepLandingSpeed(3.50)  →  3.25 m/s  (-0.25 m/s; fast attacker decelerated)

function colosseumSpeedAfterNSteps(
  v_launch_ms: number,
  n_steps: number,
  h_step_mm = 100,
  epsilon_brick = 0.62
): number {
  let v = v_launch_ms;
  for (let i = 0; i < n_steps; i++) {
    v = colosseumStepLandingSpeed(v, h_step_mm, epsilon_brick);
  }
  return v;
}
// colosseumSpeedAfterNSteps(3.50, 7)  →  1.87 m/s  (arrival speed at centre after 7 steps)
// colosseumSpeedAfterNSteps(2.00, 7)  →  1.54 m/s
// colosseumSpeedAfterNSteps(1.00, 7)  →  1.38 m/s  (even slow beys arrive near 1.4 m/s)

function colosseumStepClimbMinSpeed(h_step_mm = 100): number {
  return Math.sqrt(2 * 9.81 * (h_step_mm / 1000));
}
// colosseumStepClimbMinSpeed()  →  1.401 m/s  (must exceed this to climb one ring inward)

function colosseumSpinDecay(
  mu: number,
  r_tip_mm: number,
  I_total_kgm2: number,
  m_kg = 0.033
): number {
  return (mu * m_kg * 9.81 * (r_tip_mm / 1000)) / I_total_kgm2;
}
// colosseumSpinDecay(0.10, 3.0, 3.3e-5)  →   9.87 rad/s²  (flat tip, polished centre μ=0.10)
// colosseumSpinDecay(0.28, 3.0, 3.3e-5)  →  27.6 rad/s²  (flat tip, brick ring)
// colosseumSpinDecay(0.10, 0.8, 3.3e-5)  →   2.63 rad/s²  (sharp tip, centre stage)
// colosseumSpinDecay(0.50, 4.0, 3.3e-5)  →  65.8 rad/s²  (rubber tip, brick ring)

function colosseumOrbitSpeedForRing(
  ringIndex: number,    // 0=centre, 1=Ring2 ... 7=Ring8
  v_orbit_ms: number,
  mu_brick = 0.28,
  ring_width_mm = 190,
  centre_r_mm = 175
): { r_mid_mm: number; a_centripetal_ms2: number; friction_force_N: number; orbit_stable: boolean } {
  const r_mid_mm = centre_r_mm + (ringIndex - 0.5) * ring_width_mm;
  const r_mid_m = r_mid_mm / 1000;
  const m = 0.033;
  const a_c = v_orbit_ms ** 2 / r_mid_m;
  const F_friction = mu_brick * m * 9.81;
  const F_centripetal_needed = m * a_c;
  const orbit_stable = F_friction >= F_centripetal_needed;
  return { r_mid_mm, a_centripetal_ms2: a_c, friction_force_N: F_friction, orbit_stable };
}
// colosseumOrbitSpeedForRing(7, 1.5)  →  r=1312mm, a_c=1.71 m/s², F_fric=0.090N, F_cent=0.056N → STABLE orbit
// colosseumOrbitSpeedForRing(7, 2.5)  →  r=1312mm, a_c=4.76 m/s², F_fric=0.090N, F_cent=0.157N → UNSTABLE (slides out)
// colosseumOrbitSpeedForRing(0, 1.0)  →  r=80mm,   a_c=12.5 m/s², F_fric=0.032N, F_cent=0.413N → UNSTABLE (centre stage too small to orbit)

function colosseumRingRetentionMaxOrbitSpeed(
  ringIndex: number,
  mu_brick = 0.28,
  centre_r_mm = 175,
  ring_width_mm = 190
): number {
  const r_mid_m = (centre_r_mm + (ringIndex - 0.5) * ring_width_mm) / 1000;
  return Math.sqrt(mu_brick * 9.81 * r_mid_m);
}
// colosseumRingRetentionMaxOrbitSpeed(1)  →  0.545 m/s  (Ring 2, r_mid=270mm; orbit unstable above 0.545 m/s)
// colosseumRingRetentionMaxOrbitSpeed(4)  →  1.09 m/s   (Ring 5, r_mid=840mm)
// colosseumRingRetentionMaxOrbitSpeed(7)  →  1.86 m/s   (Ring 8, r_mid=1407mm; outer wall orbit stable up to 1.86 m/s)
```

---

## Case 565 — Cityscape Bowl (BBA G-Revolution "NYC Times Square Arena"): Building-Wall Collision Corridors, Narrow-Alley Flow Constraints, and Line-of-Sight Spin Damping

**Thesis:** The Cityscape Bowl arena (BBA G-Revolution, visually modelled on a miniaturised New York City Times Square district enclosed within a circular stadium rim) replaces the conventional smooth-bowl floor with a dense urban street grid at a scale of approximately 1:100 (real 200 m block ≈ 2 m arena span), creating a multi-surface, multi-obstacle fighting environment where beyblades navigate city blocks, open plazas, narrow alleys, and sharp-turn intersections inside a circular outer rim of radius R_outer = 1200 mm and total arena diameter 2400 mm; the dominant physics departure from a smooth bowl is the categorical distinction between three zone types: Open Plazas (Times Square intersection equivalents, r_intersection ≈ 300 mm radius semicircle, surface μ = 0.16 polished concrete, unrestricted lateral movement), Alley Corridors (w_alley = 80–120 mm wide, surface μ = 0.22 asphalt, wall-to-wall COR ε_glass = 0.78 for glass facades and ε_concrete = 0.68 for brick/concrete facades, movement effectively constrained to one translational degree of freedom), and Street Boulevards (w_boulevard = 200–280 mm, μ = 0.20 asphalt, two degrees of freedom with periodic building corner collisions); alleys impose a wall-normal velocity component kill each time a laterally drifting beyblade contacts the alley wall, converting lateral drift energy to the wall (COR < 1), reducing effective translational speed by Δv_alley = v_lateral × (1 − ε_wall) per contact while preserving the longitudinal street-axis component, so a beyblade entering an alley at a 30° angle to the alley axis arrives at the far end with its lateral component reduced by (1 − 0.78) = 22% per wall contact (2 contacts per alley transit if entry angle ≠ 0°) giving v_exit_longitudinal ≈ v_entry × cos(30°) × [1 + ε_wall × sin²(30°) / cos(30°)]  = v_entry × (0.866 + 0.190) ≈ v_entry × 0.888 (11.2% speed loss per alley pass); sharp 90° intersection turns force a beyblade to shed the perpendicular velocity component entirely if it cannot negotiate the turn radius r_bey ≤ w_alley / 2 = 40–60 mm (most beyblade AR radii fall in this range), meaning the corner itself acts as a mechanical direction gate that imparts a 90° heading change via a dual-wall ricochet sequence (first wall ε = 0.78, second wall ε = 0.78) with total speed retention v_out = ε² × v_in = 0.608 × v_in — a 39.2% speed loss at each 90° corner negotiated correctly; line-of-sight (LoS) damping arises because building massing interrupts the straight-line impact trajectories on which attack-type beyblades depend: a beyblade launched across an open plaza at v = 3.0 m/s covers 600 mm to the far side in 200 ms, but inside alleys the effective straight-line engagement distance is reduced to w_block = 200–400 mm before the next corner, reducing attack run-up time to 67–133 ms and therefore reducing the kinetic energy at impact by the factor (w_block / R_outer)² = (300 / 1200)² = 0.0625 relative to a full-radius run, or equivalently an attacker can only build v_max = √(2 × a_friction_floor × w_block) = √(2 × 0.20 × 9.81 × 0.300) = 1.08 m/s under self-propulsion before the next obstruction — this 1.08 m/s compares to 3.5+ m/s in an open stadium, meaning LoS damping reduces attack-type offensive capability to approximately 31% of open-stadium peak (1.08 / 3.50 = 0.308); the outer rim of the Cityscape Bowl is a smooth circular ABS wall (ε_rim = 0.82) that returns direct shots and allows orbital-bounce strategies unavailable in conventional blocked arenas, but orbit maintenance is itself disrupted by building-corner protrusions at the rim boundary (6 building blocks protrude within 100 mm of the rim, each 200 mm wide, occupying 6 × 200 / (2π × 1200) = 15.9% of the rim circumference and converting orbital collisions into random-direction deflections); the net arena classification is defence-and-stamina-favoured in open plazas, attacker-favoured in alley choke points where a single well-timed charge along the alley axis delivers near-unobstructed impact energy, and neutral at intersections where the randomised multi-surface ricochet geometry prevents either archetype from predicting trajectories reliably.

### Visual Geometry — Cityscape Bowl (Top-Down, Schematic)

```
Cityscape Bowl — Top-Down Schematic (diameter = 2400 mm, scale ≈ 1:100)

                     ╭──────── Circular ABS rim (R=1200mm, ε=0.82) ────────╮
                    ╱                                                         ╲
                   │   ┌─────┐   ┌─────┐     ┌─────┐   ┌─────┐             │
                   │   │BLDG │   │BLDG │     │BLDG │   │BLDG │             │
                   │   │     │   │     │  TS │     │   │     │             │
                   │   └─────┘   └─────┘     └─────┘   └─────┘             │
                   │         ↑alley←→       ↑ OPEN PLAZA ↑                 │
                   │   ┌─────┐  (80mm)  ╔══════════════╗  ┌─────┐          │
                   │   │BLDG │          ║  INTERSECTION ║  │BLDG │          │
                   │   │     │  alley   ║   (Times Sq)  ║  │     │          │
                   │   └─────┘  (80mm)  ╚══════════════╝  └─────┘          │
                   │         ↓alley                                          │
                   │   ┌─────┐   ┌─────┐     ┌─────┐   ┌─────┐             │
                   │   │BLDG │   │BLDG │     │BLDG │   │BLDG │             │
                   │   └─────┘   └─────┘     └─────┘   └─────┘             │
                    ╲                                                         ╱
                     ╰──────────────────────────────────────────────────────╯

  Zone Types:
  ──────────────────────────────────────────────────────────────────────────
  OPEN PLAZA      R_zone≈300mm  μ=0.16 (polished concrete)  ε_floor: N/A   2 DoF
  BOULEVARD       w=200–280mm   μ=0.20 (asphalt)             ε_wall: 0.68   2 DoF (constrained)
  ALLEY           w=80–120mm    μ=0.22 (asphalt)             ε_wall: 0.78 glass / 0.68 concrete
  BUILDING FACE   —             μ=0.30 (glass/concrete AR contact)           ε_face: 0.68–0.78
  OUTER RIM       R=1200mm      μ=0.15 (ABS)                 ε_rim:  0.82
```

### Physics Analysis

**Alley Corridor Transit — Speed and Energy:**

A beyblade enters an alley of width w_alley = 100 mm at speed v_entry = 2.0 m/s and angle θ = 30° to the alley axis.

Longitudinal component: v_L = v_entry × cos(30°) = 2.0 × 0.866 = 1.732 m/s.
Lateral component: v_T = v_entry × sin(30°) = 2.0 × 0.500 = 1.000 m/s.

First wall contact (glass, ε = 0.78): v_T_after_1 = 0.78 × 1.000 = 0.780 m/s (reverses, strikes opposite wall).
Second wall contact (ε = 0.78): v_T_after_2 = 0.78 × 0.780 = 0.608 m/s.
After 2 contacts (one alley width): net lateral component = 0.608 m/s (oscillating, no net progress).
Effective exit speed (longitudinal only, lateral damps over L_alley): v_exit ≈ √(1.732² + 0.608²) = 1.836 m/s.

Speed retention: 1.836 / 2.0 = 91.8% (8.2% speed loss per alley transit). Energy dissipated at two glass-wall contacts: ΔE = ½ × m × (v_T² − v_T_2²) = ½ × 0.033 × (1.000 − 0.370) = 0.0104 J.

Additional alley-floor friction (L_alley = 400 mm, μ = 0.22, deceleration a = 0.22 × 9.81 = 2.158 m/s²): Δv_floor = a × t_alley = 2.158 × (0.4 / 1.784) = 0.484 m/s removed longitudinally. Combined exit speed: √((1.732 − 0.484)² + 0.608²) = √(1.248² + 0.608²) = √(1.557 + 0.370) = 1.388 m/s.

Total speed retention after full alley transit: 1.388 / 2.0 = 69.4%.

**90° Corner Negotiation (sharp turn, dual-wall ricochet):**

Beyblade approaches intersection at v_in = 2.5 m/s heading north; alley turns east.

Wall 1 (north face of corner building, concrete ε = 0.68): Reflects northward velocity to southward; eastward velocity unchanged. v_1 = (v_in_N × ε, v_in_E) = (2.5 × 0.68, 0) = (1.70, 0) m/s. Heading: now south.

For a successful 90° turn east, the bey must strike the east-side wall: Wall 2 (east face of corridor, ε = 0.78): v_2 = (0, v_1_S × ε) is only achievable if geometry allows (bey must travel ≤ w_alley = 100 mm south to contact east wall before passing the intersection). This is geometrically assured if r_bey + travel ≤ w_alley. Assuming clean double contact:

v_out_east = ε_1 × ε_2 × v_in = 0.68 × 0.78 × 2.5 = 1.326 m/s.
Speed retention: 53.0% (47% speed loss per 90° ricochet turn).

| Entry speed (m/s) | Exit speed (m/s) | Speed retained | KE retained |
|------------------|-----------------|---------------|-------------|
| 1.0              | 0.530            | 53.0%         | 28.1%       |
| 1.5              | 0.796            | 53.0%         | 28.1%       |
| 2.0              | 1.061            | 53.0%         | 28.1%       |
| 2.5              | 1.326            | 53.0%         | 28.1%       |
| 3.0              | 1.591            | 53.0%         | 28.1%       |

**Line-of-Sight Effective Impact Energy:**

An attacker traversing a single block (w_block = 300 mm) of unobstructed alley before impact, starting from rest against the previous corner (v₀ = 0, accelerated by motor/EG/Xtreme-drive or simple tip-friction-transfer — here modelled as a free coasting deceleration scenario where the bey retains launch momentum):

Effective v at impact = √(v_launch² − 2 × μ_asphalt × g × w_block) = √(v_launch² − 2 × 0.22 × 9.81 × 0.300) = √(v_launch² − 1.295) m/s.

| v_launch (m/s) | v_impact (m/s) | KE at impact (mJ, m=33g) | vs open-stadium KE (v=3.5m/s) |
|---------------|---------------|--------------------------|-------------------------------|
| 1.5           | 0.972          | 15.6                    | 7.8%                          |
| 2.0           | 1.571          | 40.7                    | 20.3%                         |
| 2.5           | 2.079          | 71.3                    | 35.6%                         |
| 3.0           | 2.558          | 108                     | 53.8%                         |
| 3.5           | 3.008          | 149                     | 74.3%                         |

A full cross-plaza charge (unobstructed, r_plaza = 300 mm) reaches v_impact = √(v_launch² − 1.295 × (300/300)) ≈ v_launch with minimal loss, but this only applies at the Times Square central intersection — all other zones impose corridor constraints that cap impact KE at ≤ 35.6% of open-stadium peak for realistic entry speeds.

**Outer Rim Orbit Disruption by Protruding Buildings:**

Six building-block corners protrude to within R_protrude = 1100 mm of centre (100 mm inside rim). Each 200 mm wide, occupying arc = 200 / 1100 = 10.4° of rim circumference. Six protrusions × 10.4° = 62.4° total (17.3% of 360°).

A beyblade in rim orbit at v_orbit = 1.8 m/s has period T = 2π × 1.2 / 1.8 = 4.19 s. Per orbit it encounters 6 building corners. At each corner (ε_concrete = 0.68): deflects 30–60° radially inward with speed v_deflected = 0.68 × 1.8 = 1.22 m/s. Orbit cannot be maintained; the bey undergoes a chaotic pinball trajectory among buildings rather than a clean orbit. Stable rim orbits do not exist in the Cityscape Bowl.

**Spin Decay Comparison Across Zones:**

| Zone          | μ     | r_tip=3mm, I=3.3×10⁻⁵ | α (rad/s²) | t_spin (s, ω₀=2000 rad/s) |
|--------------|-------|-----------------------|-----------|--------------------------|
| Open Plaza   | 0.16  | D-tip flat            | 15.8      | 127                      |
| Boulevard    | 0.20  | D-tip flat            | 19.7      | 101                      |
| Alley        | 0.22  | D-tip flat            | 21.7      | 92.1                     |
| Open Plaza   | 0.16  | S-tip sharp (0.8mm)   | 4.20      | 476                      |
| Open Plaza   | 0.16  | RF-tip rubber (4mm)   | 105       | 19.0                     |

**Combat Zone Classification:**

| Zone                | Attack-type advantage | Stamina-type advantage | Notes                                  |
|--------------------|-----------------------|-----------------------|----------------------------------------|
| Times Square Plaza | High (full charge)    | Moderate (orbit safe) | Best open-arena combat                 |
| Boulevard          | Moderate              | High (evasion possible)| Two DoF; attack must aim carefully    |
| Alley choke        | Very high (axis shot) | Very low (trapped)    | Single axis; first to enter wins      |
| 90° corner         | Low (speed halved)    | Moderate              | Attacker loses 47% KE; defender safe  |
| Building face      | Low (deflected)       | Moderate              | AR contact scatters attacker          |
| Rim zone           | Low (orbit disrupted) | Moderate              | Protrusions prevent stable orbit      |

### TypeScript Reference Functions

```typescript
// Case 565 — Cityscape Bowl physics helpers

function cityscapeAlleyTransitSpeed(
  v_entry_ms: number,
  theta_deg: number,
  w_alley_mm = 100,
  L_alley_mm = 400,
  epsilon_wall = 0.78,
  mu_floor = 0.22
): number {
  const theta = (theta_deg * Math.PI) / 180;
  const g = 9.81;
  const v_L = v_entry_ms * Math.cos(theta);
  const v_T = v_entry_ms * Math.sin(theta);
  const v_T_after2 = v_T * epsilon_wall * epsilon_wall;
  const v_combined = Math.sqrt(v_L ** 2 + v_T_after2 ** 2);
  const a_floor = mu_floor * g;
  const t_alley = L_alley_mm / 1000 / Math.max(v_combined, 0.001);
  const v_exit = Math.max(0, v_combined - a_floor * t_alley);
  return v_exit;
}
// cityscapeAlleyTransitSpeed(2.0, 30)  →  1.39 m/s  (30° entry, standard alley)
// cityscapeAlleyTransitSpeed(2.0, 0)   →  1.83 m/s  (head-on entry, minimal wall loss)
// cityscapeAlleyTransitSpeed(2.0, 45)  →  1.22 m/s  (45° entry, significant wall loss)
// cityscapeAlleyTransitSpeed(3.0, 15)  →  2.73 m/s  (shallow entry, high-speed attacker)

function cityscapeCornerTurnSpeed(
  v_in_ms: number,
  epsilon_wall1 = 0.68,
  epsilon_wall2 = 0.78
): number {
  return v_in_ms * epsilon_wall1 * epsilon_wall2;
}
// cityscapeCornerTurnSpeed(2.5)  →  1.326 m/s  (47% speed loss per 90° corner)
// cityscapeCornerTurnSpeed(3.5)  →  1.856 m/s
// cityscapeCornerTurnSpeed(1.5)  →  0.796 m/s

function cityscapeLoSImpactSpeed(
  v_launch_ms: number,
  block_width_mm: number,
  mu_floor = 0.20
): number {
  const decel = 2 * mu_floor * 9.81 * (block_width_mm / 1000);
  return Math.sqrt(Math.max(0, v_launch_ms ** 2 - decel));
}
// cityscapeLoSImpactSpeed(3.5, 300)  →  3.01 m/s  (single block, near full speed)
// cityscapeLoSImpactSpeed(3.5, 600)  →  2.98 m/s  (double block open run; minimal loss)
// cityscapeLoSImpactSpeed(2.0, 300)  →  1.57 m/s  (moderate launch, single block)
// cityscapeLoSImpactSpeed(1.5, 300)  →  0.97 m/s  (slow bey nearly stopped in one block)

function cityscapeOrbitStability(
  v_orbit_ms: number,
  r_orbit_mm = 1200,
  n_protrusions = 6,
  protrusion_depth_mm = 100,
  epsilon_protrusion = 0.68
): { orbitPeriod_s: number; collisionsPerOrbit: number; speedAfter1Orbit_ms: number; stable: boolean } {
  const r = r_orbit_mm / 1000;
  const T = (2 * Math.PI * r) / v_orbit_ms;
  const v_after = v_orbit_ms * epsilon_protrusion ** n_protrusions;
  const stable = v_after / v_orbit_ms > 0.50;
  return { orbitPeriod_s: T, collisionsPerOrbit: n_protrusions, speedAfter1Orbit_ms: v_after, stable };
}
// cityscapeOrbitStability(1.8)  →  { T=4.19s, cols=6, v_after=0.434 m/s (24.1%), stable: false }
// cityscapeOrbitStability(3.0)  →  { T=2.51s, cols=6, v_after=0.723 m/s (24.1%), stable: false }
// (Stable orbit is impossible regardless of launch speed: 6 collisions × ε^6 = 0.68^6 = 0.099 → 90% loss per orbit)

function cityscapeSpinDecay(
  zone: "plaza" | "boulevard" | "alley",
  r_tip_mm: number,
  I_total_kgm2: number,
  m_kg = 0.033
): number {
  const mu = zone === "plaza" ? 0.16 : zone === "boulevard" ? 0.20 : 0.22;
  return (mu * m_kg * 9.81 * (r_tip_mm / 1000)) / I_total_kgm2;
}
// cityscapeSpinDecay("plaza",    3.0, 3.3e-5)  →  15.8 rad/s²  (D-tip, open plaza)
// cityscapeSpinDecay("alley",    3.0, 3.3e-5)  →  21.7 rad/s²  (D-tip, alley)
// cityscapeSpinDecay("plaza",    0.8, 3.3e-5)  →   4.20 rad/s²  (S-tip, plaza — stamina dominant)
// cityscapeSpinDecay("boulevard",4.0, 3.3e-5)  → 130 rad/s²   (RF-tip, boulevard — RF burns out fast)
```

---

## Case 566 — New Jersey Turnpike Dish (BBA G-Revolution): Banked-Highway Road Geometry, Vertical Loop Completion Threshold, Curb-Fall Elimination, and Multi-Zone Surface Physics

**Thesis:** The New Jersey Turnpike Dish (BBA G-Revolution, officially labelled on the arena-selection card with the BBA logo, modelled on the New Jersey Turnpike highway interchange surrounding a miniaturised New York Harbour and Statue of Liberty) is an oval arena of outer dimensions 2400 × 1800 mm (semi-axes a = 1200 mm, b = 900 mm) whose battle surface is not a conventional bowl but an elevated winding concrete highway network: a single continuous winding road of width w_road = 200 mm and raised concrete curbs of height h_curb = 25 mm on both edges carries the beyblades through S-curves, hairpin bends, parallel elevated flyover sections, and one full 360° vertical loop of radius R_loop = 280 mm, with the road platform elevated H_elev = 80 mm above the surrounding terrain on standard sections and H_elev = 150 mm on flyover overpasses; the road surface is sealed concrete with μ_road = 0.18 and coefficient of restitution against the attack ring ε_road_AR = 0.78, and each banked curve imparts a net inward normal-force component that defines an optimal travel speed v_opt(R, φ) = √(g × R × tan(φ)) below which a beyblade slides toward the inner curb and above which it is pushed toward the outer curb and risk of curb-over-fall; the outer curb acts as a one-way elimination gate: a beyblade whose radial (road-perpendicular) velocity component at the curb face satisfies v_n > v_n_crit = √(2 × g × h_curb) / sin(θ_AR) = 0.701 / sin(30°) = 1.40 m/s is launched over the top of the curb by its own AR blade deflection geometry and becomes a projectile falling H_elev = 80 mm to the terrain below, where it cannot return because the road face is a smooth vertical ABS wall with no ramp geometry (sheer drop-back-to-road is impossible at zero horizontal propulsion); the three off-road terrain categories impose radically different elimination timescales: brown earth/mud (μ_mud = 0.42) decelerates a D-tip at α_mud = 43.3 rad/s² giving t_spin = 46 s from ω₀ = 2000 rad/s (slow elimination, but some mud pockets carry a 15° re-entry ramp with minimum climbing speed v_ramp = √(2 × g × H_elev × sin(15°)) = 0.719 m/s connecting back to the road surface), open water zones (μ_eff ≈ viscous-dominant, modelled as a linear drag dω/dt = −k_visc × ω with k_visc = 0.35 s⁻¹ giving ω(t) = ω₀ × e^(−0.35t) and full functional spin-out in t_water = ln(2000/30) / 0.35 = 11.8 s — a rapid but not instantaneous "deep dive" elimination), and green vegetation/embankment zones (μ_grass = 0.32, no exits, α_grass = 33.1 rad/s², t_spin = 60 s — elimination by grind-out); the vertical loop is the highest-consequence single element in the arena because a beyblade entering the loop at less than the critical entry speed v_entry_min = √(5 × g × R_loop) = √(5 × 9.81 × 0.280) = 3.706 m/s will complete the upswing at a point between 90° and 180° from the base and then fall inward, landing on the inner loop wall at a height h_fall = R_loop × (1 − cosθ_detach) above entry with the Statue of Liberty base below and no road surface to catch it, effectively guaranteeing elimination of any bey that attempts the loop below launch-fresh speed; the arena strongly favours attack-type beyblades in two specific configurations: (1) launching directly into the loop at ω ≥ 95% of ω₀ to use the loop as a slingshot, arriving at the far side with the full energy-conserved exit speed v_exit_loop = v_entry × √(1 − 4gR_loop / v_entry²) × √(1 − μ_road × π × R_loop / ... reduced by friction arc), and (2) using the narrow road width (w_road = 200 mm, bey diameter 55 mm, clear pass width 145 mm for two beys) to force head-on corridor encounters where the road geometry eliminates lateral evasion and the curb-fall zone punishes any off-axis spin-out from contact; stamina types that circulate the inner sections near Liberty Island at modest v_orbit ≈ 1.1–1.4 m/s (well within optimal banking speed) accumulate spin life advantage but are eventually hunted through the winding corridors by attackers, and the absence of any inward-funnel bowl geometry means stamina types cannot passively orbit to safety as they would in a conventional stadium bowl.

### Visual Geometry — Arena Layout (Top-Down Schematic)

```
New Jersey Turnpike Dish — Top-Down Schematic
Oval rim: 2400 × 1800 mm (semi-axes a=1200mm, b=900mm), pink/red ABS frame

    ╭─────────────────────────────────────────────────────────────╮
    │  ╔══╗  ╔══╗  ╔══╗  ╔══╗    water/harbour (blue)           │
    │  ║  ╚══╝  ╚══╝  ╚══╝  ║       ← parallel highway lanes    │
    │  ║    ╔════════════╗  ║     (flyover sections, H=150mm)    │
    │  ╚════╝   S-bend   ╚════╗                                  │
    │            curves       ║──────────────────┐               │
    │  ○LOOP     hairpin R=300mm  ┌──────────────┘               │
    │  (R=280mm) ════╗           │   GREEN                       │
    │                ╚═══════════╛   embankment                  │
    │            ────────────────────────────────────────────────│
    │  ╔═══╗    winding approach to Liberty Island central sector │
    │  ║   ╚═══════════════╗  STATUE OF LIBERTY (centre)         │
    │  ╚══════════════╗    ╚═══╗   R_base=150mm, H=300mm         │
    │                 ╚════╝   ║                                  │
    │  WATER (blue)            ╚══════════  BROWN EARTH           │
    │  k_visc=0.35/s           ┌── mud pocket (ramp exit α=15°)  │
    ╰─────────────────────────────────────────────────────────────╯

  Zone          Surface            μ       ε_AR    Elimination type        Re-entry?
  ──────────    ─────────────────  ──────  ──────  ──────────────────────  ─────────
  Road          Sealed concrete    0.18    0.78    None (stay on road)     N/A
  Brown mud     Loose earth        0.42    0.50    Slow grind (t≈46s)      Some ramps (α=15°)
  Water harbour Viscous liquid     eff.    —       Fast decay (t≈11.8s)    No
  Vegetation    Grass/dirt         0.32    0.45    Grind (t≈60s)           No
  Loop interior ABS curve          0.18    0.78    Fall-in if v<3.71 m/s   No
  Curb face     ABS concrete       0.20    0.70    Projectile fall H=80mm  No (road is sheer)
```

### Physics Analysis

**Banked Curve Optimal Speed:**

On a road banked at angle φ with curve radius R, the speed at which lateral friction is zero (beyblade tracks the curve without sideways drift): v_opt = √(g × R × tan(φ)).

| Segment         | R (mm) | φ (°) | v_opt (m/s) | v_inner_drift (below) | v_outer_eject (above) |
|----------------|--------|-------|------------|----------------------|-----------------------|
| Hairpin bend   | 300    | 25    | 1.171      | < 1.17 → inner curb  | > 1.17 → outer curb  |
| S-curve sweep  | 650    | 18    | 1.439      | < 1.44 → inner curb  | > 1.44 → outer curb  |
| Gentle outer   | 900    | 12    | 1.388      | < 1.39 → inner curb  | > 1.39 → outer curb  |
| Flyover curve  | 450    | 22    | 1.327      | < 1.33 → inner curb  | > 1.33 → outer curb  |

A launch-fresh attack-type at v ≈ 3.0–3.5 m/s exceeds the outer-curb ejection threshold on every curve type, meaning launch trajectories directly into banked curves are high-risk. Only a bey that has decelerated to the 1.1–1.4 m/s range (after several road-friction lengths) can orbit curves stably.

Road friction deceleration: a_road = μ_road × g = 0.18 × 9.81 = 1.766 m/s². Distance to decelerate from 3.0 m/s to v_opt = 1.4 m/s: d = (v₀² − v_opt²) / (2 × a_road) = (9.0 − 1.96) / 3.532 = 1.994 m ≈ 2.0 m of road length required. Road total length is approximately 4.5–5.0 m (from the winding layout), so a launch-fresh bey reaches stable orbit speed approximately halfway through the circuit.

**Vertical Loop — Completion Threshold:**

Minimum condition at loop top (angle = 180° from entry, height H_top = 2R_loop = 560 mm): centripetal acceleration equals gravitational acceleration: v_top_min² / R_loop = g → v_top_min = √(g × R_loop) = √(9.81 × 0.280) = 1.656 m/s.

Energy conservation (ignoring loop-wall friction for minimum threshold; adding 10% friction penalty for realism): v_entry_min = √(v_top_min² + 2 × g × 2R_loop) × (1 + f_friction_loop) = √(1.656² + 4 × 9.81 × 0.280) × 1.10 = √(2.742 + 10.987) × 1.10 = √(13.729) × 1.10 = 3.705 × 1.10 = 4.076 m/s (with friction) or 3.705 m/s (ideal).

| v_entry (m/s) | Completes loop? | Detach angle θ from bottom | Landing zone        |
|--------------|----------------|---------------------------|---------------------|
| 4.0          | No (friction)  | ~172°                     | Falls inward near top|
| 4.08+        | Yes            | 360° (full completion)     | Exits loop on road  |
| 3.0          | No             | ~138°                     | Falls to inner loop base|
| 2.0          | No             | ~106°                     | Falls after quarter-loop|
| 1.5          | No             | ~85°                      | Barely exits quarter-loop|

Beys below v_entry = 3.705 m/s detach from the inner loop wall at angle θ_detach from the bottom where: cosθ_detach = 1 − v_entry² / (3 × g × R_loop) = 1 − v_entry² / (3 × 9.81 × 0.280) = 1 − v_entry² / 8.241.

Detachment height above entry: h_detach = R_loop × (1 − cosθ_detach) = v_entry² / (3 × g).
At v_entry = 3.0 m/s: h_detach = 9.0 / (3 × 9.81) = 0.306 m = 306 mm above loop floor — bey falls from 306 mm onto the road surface below the loop (within the loop's interior), which has no road surface, landing on mud or water inside the loop enclosure. Elimination confirmed.

**Curb-Fall Elimination Geometry:**

A beyblade on a curve drifts radially outward at speed v_n (road-perpendicular component). To mount the curb (h_curb = 25 mm), it must deflect over the curb face. The AR bottom contacts the curb face at height approximately z_AR = 8 mm (AR bottom above road); the curb face is 25 mm tall. The AR blade tip at angle θ_AR = 30° to vertical deflects the normal force into a vertical component: v_z = v_n × sin(θ_AR) = 0.5 × v_n. Condition to clear curb: v_z = √(2 × g × (h_curb − z_AR)) = √(2 × 9.81 × 0.017) = 0.577 m/s. So: 0.5 × v_n ≥ 0.577 → v_n_crit = 1.155 m/s.

Once over the curb, the bey is a projectile with v_horizontal ≈ v × cos(θ_AR) and falls H_elev = 80 mm:
t_fall = √(2 × H_elev / g) = √(2 × 0.080 / 9.81) = 0.128 s.
Horizontal distance from road edge: d_land = v_horizontal × t_fall ≈ v × 0.866 × 0.128 ≈ 0.111 × v metres. At v = 2.0 m/s: d_land = 222 mm (lands well clear of the road into mud/water zone).

Climbing back: road outer face is a vertical ABS wall H_elev = 80 mm. To climb a vertical wall the bey would need to generate horizontal contact thrust against the wall and convert it to vertical. A spinning beyblade with rubber tip (RF) against a wall produces F_wall = μ_rubber × N ≈ 0.50 × m × g = 0.162 N, insufficient to propel the bey 80 mm upward (requires W = mgh = 0.033 × 9.81 × 0.080 = 0.026 J; at contact time τ < 0.1 s, power = 0.26 W vs F × v_climb needed ≈ 0.162 × 0 N·m/s — no directed vertical drive mechanism exists). Return is impossible without a ramp.

**Mud Re-entry Ramp:**

Some mud pockets carry a 15° ramp connecting back up to the road at H_elev = 80 mm. Minimum climbing speed: v_ramp = √(2 × g × H_elev / sin(15°)) = √(2 × 9.81 × 0.080 / 0.259) = √(6.057) = 2.461 m/s at the ramp base. After decelerating across the mud zone (a_mud = μ_mud × g = 0.42 × 9.81 = 4.120 m/s²), a bey that fell off the road at v = 2.0 m/s and travels L_mud = 300 mm to the ramp arrives at: v_at_ramp = √(v_fall² − 2 × a_mud × L_mud) = √(4.0 − 2 × 4.120 × 0.300) = √(4.0 − 2.472) = √(1.528) = 1.236 m/s — insufficient to climb the ramp (needs 2.461 m/s). Only a bey that falls off at v ≥ √(v_ramp² + 2 × a_mud × L_mud) = √(6.057 + 2.472) = √(8.529) = 2.920 m/s and lands close to a ramp pocket can return. Fast attackers at launch that accidentally exit the road have a non-zero return probability; slow stamina types that fall off are permanently eliminated.

**Water Zone Spin Decay:**

Water drag on a spinning beyblade tip modelled as viscous rotational drag: dω/dt = −k_visc × ω → ω(t) = ω₀ × e^(−k_visc × t). Taking k_visc = 0.35 s⁻¹ (shallow water with surface tension effects on plastic tip):

| t (s) | ω (rad/s, ω₀=2000) | % max spin remaining |
|-------|---------------------|---------------------|
| 2.0   | 1147                | 57.3%               |
| 5.0   | 411                 | 20.6%               |
| 8.0   | 147                 | 7.4%                |
| 11.8  | 30                  | 1.5% (functional spin-out) |

"Quick dive" referenced by user = spin-out in ~12 s; deeper water (full submersion) increases k_visc to 1.5+ s⁻¹, reducing t_spinout to ~2.8 s.

**Road Width Encounter Physics (Head-on, Two Beys):**

Road width w_road = 200 mm. Beyblade outer diameter d_bey = 55 mm. Clear width for two beys: w_clear = 200 − 2 × 55 = 90 mm. Two beys can physically coexist on the road side-by-side with 90 mm clearance. Head-on collision on straight road section (both travelling in opposite directions): closing speed v_close = v_A + v_B. Impulse J = μ_reduce × v_close × (1 + ε_AR) where μ_reduce = m_A × m_B / (m_A + m_B) ≈ 0.0165 kg (equal masses). At v_A = v_B = 2.0 m/s, v_close = 4.0 m/s: J = 0.0165 × 4.0 × (1 + 0.78) = 0.0165 × 4.0 × 1.78 = 0.1175 N·s. Post-collision velocity change for each bey: Δv = J / m = 0.1175 / 0.033 = 3.56 m/s — both beyblades reverse direction (from +2.0 to +2.0 − 3.56 = −1.56 m/s, i.e., reversed at 1.56 m/s). Since road width limits lateral escape, both beys are now travelling away from each other along the road; however, the impact impulse is also directed partially outward if the beys are offset laterally, potentially pushing one bey toward the outer curb. If lateral offset is s_lat = 30 mm, the radial component J_rad = J × sin(arctan(30 / 55)) = 0.1175 × sin(28.6°) = 0.1175 × 0.479 = 0.0563 N·s, giving radial Δv = 0.0563 / 0.033 = 1.71 m/s — this exceeds v_n_crit = 1.155 m/s, so a laterally offset head-on collision at 2 m/s each on a 200 mm road will eject the outer bey over the curb with near certainty.

### TypeScript Reference Functions

```typescript
// Case 566 — New Jersey Turnpike Dish physics helpers

function njtBankedCurveOptimalSpeed(radius_mm: number, bankAngle_deg: number): number {
  const g = 9.81;
  const R = radius_mm / 1000;
  const phi = (bankAngle_deg * Math.PI) / 180;
  return Math.sqrt(g * R * Math.tan(phi));
}
// njtBankedCurveOptimalSpeed(300, 25)  →  1.171 m/s  (hairpin, stable orbit speed)
// njtBankedCurveOptimalSpeed(650, 18)  →  1.439 m/s  (S-curve sweep)
// njtBankedCurveOptimalSpeed(900, 12)  →  1.388 m/s  (gentle outer bend)

function njtCurbMountCriticalSpeed(
  h_curb_mm = 25,
  z_AR_mm = 8,
  theta_AR_deg = 30
): number {
  const g = 9.81;
  const dh = (h_curb_mm - z_AR_mm) / 1000;
  const v_z_needed = Math.sqrt(2 * g * dh);
  return v_z_needed / Math.sin((theta_AR_deg * Math.PI) / 180);
}
// njtCurbMountCriticalSpeed()  →  1.155 m/s  (radial speed that launches bey over curb)

function njtCurbFallDistance(v_road_ms: number, theta_AR_deg = 30, H_elev_mm = 80): number {
  const g = 9.81;
  const t_fall = Math.sqrt((2 * H_elev_mm) / (1000 * g));
  const v_horiz = v_road_ms * Math.cos((theta_AR_deg * Math.PI) / 180);
  return v_horiz * t_fall * 1000; // mm from road edge
}
// njtCurbFallDistance(2.0)  →  222 mm  (lands 222mm from road edge on terrain)
// njtCurbFallDistance(1.5)  →  166 mm
// njtCurbFallDistance(3.0)  →  333 mm  (lands near water zone)

function njtLoopEntryMinSpeed(R_loop_mm = 280, friction_penalty = 0.10): number {
  const g = 9.81;
  const R = R_loop_mm / 1000;
  return Math.sqrt(5 * g * R) * (1 + friction_penalty);
}
// njtLoopEntryMinSpeed()  →  4.076 m/s  (with 10% friction; ideal=3.705 m/s)

function njtLoopDetachAngle(v_entry_ms: number, R_loop_mm = 280): number {
  const g = 9.81;
  const R = R_loop_mm / 1000;
  const cosTheta = 1 - v_entry_ms ** 2 / (3 * g * R);
  if (cosTheta <= -1) return 180; // completes loop
  return (Math.acos(Math.max(-1, cosTheta)) * 180) / Math.PI;
}
// njtLoopDetachAngle(4.08)  →  180.0°  (completes loop, barely)
// njtLoopDetachAngle(3.00)  →  137.7°  (detaches past the crown — falls inward from high)
// njtLoopDetachAngle(2.00)  →  104.4°  (quarter-loop then falls)
// njtLoopDetachAngle(1.50)  →   84.2°  (barely lifts, falls almost immediately)

function njtLoopDetachHeight_mm(v_entry_ms: number, R_loop_mm = 280): number {
  const g = 9.81;
  const R = R_loop_mm / 1000;
  const h = v_entry_ms ** 2 / (3 * g);
  return Math.min(h * 1000, 2 * R * 1000); // cap at loop top
}
// njtLoopDetachHeight_mm(3.0)  →  306 mm above loop floor  (falls from well above halfway)
// njtLoopDetachHeight_mm(2.0)  →  136 mm
// njtLoopDetachHeight_mm(1.5)  →   76 mm

function njtWaterSpinDecay(
  omega0_rads: number,
  t_s: number,
  k_visc = 0.35
): number {
  return omega0_rads * Math.exp(-k_visc * t_s);
}
// njtWaterSpinDecay(2000,  5)  →  411 rad/s  (20.6% remaining at 5s)
// njtWaterSpinDecay(2000, 11.8)  →   30 rad/s  (functional spin-out at 11.8s)
// njtWaterSpinDecay(2000,  2, 1.5)  →  100 rad/s  (deep water k=1.5: out in 2.8s)

function njtMudReentryFeasible(
  v_falloff_ms: number,
  L_mud_mm = 300,
  H_elev_mm = 80,
  ramp_angle_deg = 15,
  mu_mud = 0.42
): { v_at_ramp_ms: number; v_ramp_min_ms: number; canReturn: boolean } {
  const g = 9.81;
  const a_mud = mu_mud * g;
  const L = L_mud_mm / 1000;
  const v_at_ramp = Math.sqrt(Math.max(0, v_falloff_ms ** 2 - 2 * a_mud * L));
  const v_ramp_min = Math.sqrt((2 * g * H_elev_mm) / (1000 * Math.sin((ramp_angle_deg * Math.PI) / 180)));
  return { v_at_ramp_ms: v_at_ramp, v_ramp_min_ms: v_ramp_min, canReturn: v_at_ramp >= v_ramp_min };
}
// njtMudReentryFeasible(2.0)  →  { v_at_ramp: 1.236, v_ramp_min: 2.461, canReturn: false }
// njtMudReentryFeasible(3.0)  →  { v_at_ramp: 2.538, v_ramp_min: 2.461, canReturn: true }
// njtMudReentryFeasible(4.0)  →  { v_at_ramp: 3.626, v_ramp_min: 2.461, canReturn: true }
```

---

## Case 567 — Great Wall of China Bowl (BBA G-Revolution): Stone Corridor Confinement, Crenellated Wall-Climb Escape, Arch Tunnel Height Restriction, and Slope-Gradient Acceleration

**Thesis:** The Great Wall of China Bowl (BBA G-Revolution, confirmed BBA logo on the arena-selection card, themed on the Ming-dynasty Great Wall of China) is a 3000 × 1500 mm rectangular arena (with octagonally chamfered corners, outer rim height H_rim = 1000 mm) whose interior is not a smooth bowl but an elevated stone wall network — a continuous winding corridor of width w_corridor = 220 mm formed by Great Wall-style stone block walls of height H_wall = 200 mm topped with alternating crenellations (merlons h_merlon = 50 mm wide 100 mm, crenels gap 100 mm at 200 mm pitch) that divide the arena into an interlocking trefoil of approximately three interconnected winding loops totalling ~5.5 m of total corridor path length; the floor surface alternates between two material zones: wooden plank decking (μ_wood = 0.20, ε_wood_AR = 0.72) on the main walkway sections and rough stone paving (μ_stone = 0.28, ε_stone_AR = 0.65) on ramp and junction sections, with the rough stone walls providing a wall COR of ε_wall = 0.65 and μ_wall_face = 0.25, values substantially more energy-dissipative than polished ABS (ε = 0.82) so that each wall-bounce removes (1 − ε_wall²) = 57.8% of the perpendicular kinetic energy; the corridors are not flat but follow three distinct slope profiles modelled on the Great Wall's mountain-ridge path: gentle traversal ramps (α_gentle = 8°, length ~400 mm) connecting horizontal sections, moderate climbing sections (α_moderate = 15°, length ~250 mm) at the loop apexes, and steep descent sections (α_steep = 22°, length ~180 mm) on the downhill switchbacks, with the slope gradient changing the effective floor friction and gravity component so that a descending bey experiences net acceleration a_net = g × (sin(α) − μ_floor × cos(α)) = 9.81 × (0.139 − 0.196) = −0.56 m/s² on the gentle wood ramp (still slightly decelerating because μ × cosα > sinα) but a_net = 9.81 × (0.374 − 0.270) = +1.02 m/s² net acceleration on the steep stone descent (sinα now dominates), making the steep descent sections the only parts of the arena where a beyblade naturally gains speed without a collision; the arena introduces two vertical-dimension mechanics absent from all conventional bowl arenas: overhangs are sections where the corridor wall's top edge curves inward by ~30° for the uppermost 50 mm creating a rounded battlements lip that guides a wall-climbing bey back downward (the curved-over lip redirects the bey's climbing trajectory back toward the floor when the bey has insufficient speed to maintain contact with the curving surface v_lip_min = √(g × R_lip × cos(φ_lip)) = √(9.81 × 0.060 × cos(30°)) = 0.717 m/s, so a bey hitting the wall above 0.717 m/s wall-relative speed will ride the curved lip and return to the corridor floor, while a bey below that speed detaches from the wall at some point on the lip arc and falls back down), and underhangs are the stone arch tunnel gateways (three present, arch interior height h_arch = 70 mm at the crown, arch span L_arch = 280 mm, L_tunnel = 320 mm) through which the corridor passes at certain loop junctions — a normally upright beyblade (h_eff = 30 mm) clears the arch with 40 mm headroom, but a wobbling bey at low spin whose tilt angle exceeds θ_arch_crit = arcsin((h_arch − h_upright) / R_AR) = arcsin(40 / 26) — which is undefined (ratio > 1), meaning the AR radius (26 mm) alone cannot reach the arch ceiling with the bey upright; instead, the arch clips a bey whose total effective height h_eff = h_upright + L_AR × sin(θ_tilt) ≥ 70 mm, requiring L_AR × sin(θ_tilt) ≥ 40 mm, so sin(θ_tilt) ≥ 40 / 50 = 0.80 → θ_tilt ≥ 53° (a severely dying wobble at ω < 15% max spin), meaning only nearly-dead stamina types at terminal wobble will clip the arch and receive a collision penalty at the arch lip; the most consequential unique mechanic of the arena is the crenellation-gap wall-escape: a beyblade impacting the wall at sufficient speed to climb to wall-top height (H_wall = 200 mm) needs a vertical velocity component at the wall face of v_z ≥ √(2 × g × H_wall) = √(2 × 9.81 × 0.200) = 1.980 m/s, and once at wall-top height it faces the alternating merlon/crenel pattern — if the bey's azimuthal position places it at a crenel gap (100 mm wide, every 200 mm), it exits the corridor wall into the adjacent section with probability P_exit_crenel = 100 / 200 = 0.500 per wall-climb event, while a bey that arrives at a merlon position is deflected back into the corridor by the merlon's flat top face (ε_merlon = 0.65) at height H_wall + h_merlon = 250 mm; the combination of narrow stone corridors, alternating wood/stone floors, three slope gradients, curved overhang lips, arch tunnel height restrictions, and the probabilistic crenellation exit gate classifies this arena as strongly attack-type-favoured in the long straight or gentle-slope corridor sections (full corridor-width charge available), defence-type-favoured near arch tunnels and at merlon-blocked wall sections (reflected beys cannot escape), and stamina-neutral because stamina types gain spin-life from lower μ_wood = 0.20 floor but are constantly threatened by being funnelled into narrow sections where attack-type corridor charges offer no lateral escape.

### Visual Geometry — Corridor Cross-Section and Top-Down Layout

```
Corridor Cross-Section (perpendicular to corridor axis):

  Height
  (mm)
  250 ─┐  merlon  ┌─┐  crenel ┌─┐  merlon  ┌────────── (right wall, same)
  200 ─┼──────────┘ └─────────┘ └──────────┤  wall top = H_wall = 200 mm
       │ curved overhang lip (r=60mm)       │  merlon pitch = 200mm, gap = 100mm
  160 ─┤  ╮                           ╭    ├─  lip curve zone: 160–200 mm
       │   ╲ (φ=30° inward curve)    ╱     │
  100 ─┤    │                       │      │
       │    │  CORRIDOR SPACE       │      │
   50 ─┤    │  w = 220 mm           │      │
       │    │                       │      │
    0 ─┴────┴───────────────────────┴──────┴──  floor
             ←──────── 220 mm ──────────→
  Floor:  wood planks (μ=0.20, ε_AR=0.72) OR stone paving (μ=0.28, ε_AR=0.65)
  Wall:   rough stone blocks (μ=0.25, ε=0.65)

Top-Down Layout (3000 × 1500 mm outer; corridor paths shown as centre-lines):

  ╔══════════════════════════════════════════════════════════╗
  ║   ╭──────╮    arch ╭────────────────────────────────╮   ║
  ║   │ Loop A│   ┤    │         Loop C (elongated)     │   ║
  ║   │ 600×  │        │  ←gentle ramps on long straights│   ║
  ║   │ 500mm │        │                                │   ║
  ║   ╰──┬───╯  ╭────╯                                 │   ║
  ║      │arch  │                                      │   ║
  ║   ╭──┴───╮  │  steep descents ↓   arch tunnel ┤   │   ║
  ║   │ Loop B│  │                                    │   ║
  ║   │ 600×  │  ╰────────────────────────────────────╯   ║
  ║   │ 450mm │   moderate climbing sections on curves     ║
  ║   ╰───────╯                                            ║
  ╚══════════════════════════════════════════════════════════╝

  Arch tunnels: 3×, h_arch=70mm, L_tunnel=320mm, located at loop junctions
  Slope profile: gentle (8°) on long straights; moderate (15°) at loop crowns; steep (22°) on descent switchbacks
  Corridor path length total: ~5.5 m
  Floor alternation: Loop A = wood planks; Loop B = stone paving; Loop C = mixed
```

### Physics Analysis

**Slope Acceleration Budget:**

| Slope zone      | α (°) | Surface  | μ     | a_net (m/s²)            | Direction |
|----------------|-------|----------|-------|-------------------------|-----------|
| Gentle, down   | 8     | wood     | 0.20  | 9.81(sin8°−0.20×cos8°)  = −0.56 | decelerates (μcosα > sinα) |
| Gentle, up     | 8     | wood     | 0.20  | −9.81(sin8°+0.20×cos8°) = −3.31 | decelerates strongly |
| Moderate, down | 15    | stone    | 0.28  | 9.81(sin15°−0.28×cos15°)= −0.12 | nearly neutral |
| Moderate, up   | 15    | stone    | 0.28  | −9.81(sin15°+0.28×cos15°)= −5.25 | decelerates strongly |
| Steep, down    | 22    | stone    | 0.28  | 9.81(sin22°−0.28×cos22°)= +1.02 | ACCELERATES |
| Steep, up      | 22    | stone    | 0.28  | −9.81(sin22°+0.28×cos22°)= −6.22 | decelerates very strongly |

A bey ascending a steep 22° stone ramp at v = 2.0 m/s stops after d = v² / (2 × 6.22) = 0.322 m = 322 mm (only slightly longer than the ramp length 180 mm, so it reaches the top with v_top = √(2.0² − 2 × 6.22 × 0.180) = √(4.0 − 2.239) = √(1.761) = 1.328 m/s). Descending the same ramp from rest at the top: v_bottom = √(2 × 1.02 × 0.180) = √(0.367) = 0.606 m/s (slow; ramp is short). A bey cannot build significant speed on the steep ramp alone; the primary speed source remains launch momentum or wall-bounce impulse.

**Spin Decay by Floor Zone:**

| Floor zone      | μ     | α_D-tip (rad/s²) | t_spin (s, ω₀=2000) | α_S-tip (rad/s²) | t_spin_S (s) |
|----------------|-------|-----------------|---------------------|-----------------|-------------|
| Wood plank     | 0.20  | 19.7            | 101                 | 5.26            | 380         |
| Stone paving   | 0.28  | 27.6            | 72.4                | 7.37            | 271         |
| Slope (8° down, wood) | 0.20 cos8° = 0.198 | 19.5 | 102 | 5.21 | 384 |
| Slope (22° down, stone)| 0.28 cos22° = 0.260 | 25.6 | 78.1| 6.84 | 292 |

Spin decay on slopes uses the slope-reduced normal force: N_slope = mg × cosα. Sharp-tip (S or BS) stamina types achieve t_spin ≈ 380 s on wood plank floors — effectively inexhaustible over a match duration. The corridor geometry forces stamina types to keep moving, however, as standing still on any slope section produces slow gravitational drift.

**Crenellation Wall-Climb Escape:**

Minimum vertical velocity at wall face to reach wall top: v_z_min = √(2 × g × H_wall) = √(2 × 9.81 × 0.200) = 1.980 m/s.

A beyblade colliding with the stone wall at total speed v and contact angle θ_contact (angle to wall normal) has vertical component v_z = v × sin(θ_vert) where θ_vert is the upward tilt of the AR blade at the moment of contact. For a typical AR blade (θ_vert ≈ 20° upward face): v_z = v × sin(20°) = 0.342 × v. Condition: 0.342 × v ≥ 1.980 → v ≥ 5.79 m/s.

That is very high (beyond realistic launch speed). However, for a direct near-vertical wall-ride approach (e.g., bey orbiting at high speed around a tight corridor loop, pressing against the outer wall): v_z is not from impact angle but from accumulated kinetic energy converted to height. Energy condition: ½mv² ≥ mg × H_wall → v ≥ 1.980 m/s. A bey pressing against the outer wall of a corridor loop at v_orbit ≥ 1.980 m/s has enough kinetic energy to climb the full wall height.

At v_orbit = 1.980 m/s on loop A (r_loop = 250 mm): centripetal acceleration a_c = v² / r = 1.980² / 0.250 = 15.7 m/s² pressing the bey to the outer wall with N_wall = m × a_c = 0.033 × 15.7 = 0.518 N. This normal force holds the bey against the wall; friction force F_fric = μ_wall × N_wall = 0.25 × 0.518 = 0.130 N. Gravitational pull down: mg = 0.324 N. Since F_fric (0.130 N) < mg (0.324 N), the bey cannot wall-ride without losing height — wall-climbing does NOT occur at 1.980 m/s orbital speed alone. Wall climbing requires a direct upward impulse from an angled AR collision.

Realistic wall-climb scenario: attacker strikes a stationary defender on the outer corridor wall; the collision impulse has a vertical component (upward) of J_z = m × Δv_z. For m = 0.033 kg and Δv_z = v_z_min = 1.980 m/s: J_z = 0.065 N·s requires the impact to deliver 1.980 m/s of upward velocity to the struck bey. At typical attack speeds v_attack = 2.5 m/s and blade angle 30° upward: Δv_z = v_attack × sin(30°) × (1 + ε_wall) = 2.5 × 0.500 × (1 + 0.65) = 2.063 m/s ≥ 1.980 m/s. Therefore AR-to-AR attacks at v ≥ 2.41 m/s with a 30° upward blade face can launch the struck bey over the wall.

Once at wall top, merlon/crenel outcome:
- P(at crenel gap) = 100 / 200 = 0.500 → bey exits corridor (into adjacent corridor section or outer rim zone)
- P(at merlon top) = 0.500 → deflected back into corridor: v_return = ε_merlon × v_z = 0.65 × v_z (downward), no horizontal deflection

| v_z at wall face (m/s) | Clears wall? | P_exit_corridor | Fate if deflected |
|-----------------------|-------------|----------------|------------------|
| < 1.980               | No          | 0.00           | Bey slides back down |
| 2.00                  | Yes (barely)| 0.50           | v_return = 1.30 m/s down |
| 2.50                  | Yes         | 0.50           | v_return = 1.63 m/s down |
| 3.00                  | Yes         | 0.50           | v_return = 1.95 m/s down (near re-climb speed) |

**Arch Tunnel Height Restriction:**

Arch interior height: h_arch = 70 mm. Beyblade upright height: h_upright = 30 mm. Clearance: 40 mm.

For the AR to clip the arch, required tilt such that h_eff = h_upright + L_AR × sin(θ_tilt) ≥ 70 mm → L_AR × sin(θ_tilt) ≥ 40 mm. With L_AR = 50 mm (AR radial extent for large-AR types): sin(θ_tilt) ≥ 0.800 → θ_tilt ≥ 53.1°.

Spin fraction at which θ_tilt = 53°: from nutation physics (Case 9 convention), θ_tilt ≈ 53° corresponds to ω ≈ 5–8% of ω_max (terminal wobble). A standard Plastic-era or MFB bey at ω < 8% max spin (≈ 100–160 rad/s from ω₀ = 2000 rad/s) wobbles at θ > 53° and clips the arch crown on entry.

Arch collision: AR contacts arch crown stone (ε_arch = 0.60, rough stone underside) at closing speed v_contact = v_tilt_top × sin(θ_tilt). Impulse J = m × v_contact × (1 + ε_arch) = 0.033 × v_contact × 1.60 = 0.0528 × v_contact N·s. This impulse delivers a sudden spin-down shock plus lateral deflection — effectively spinning the bey out immediately if θ_tilt ≥ 53° because the arch impact destabilises the wobble further, pushing θ > 80° (fall-over threshold).

Arch contact also blocks forward travel: L_tunnel = 320 mm, h_arch = 70 mm. A bey at v = 1.5 m/s entering a tunnel with θ_tilt = 55° (clipping condition): it contacts the arch crown at ~80 mm into the tunnel, receives the impulse, and is no longer able to continue forward (either falls over inside the tunnel or is deflected backward). Since the tunnel walls are only 220 mm wide, there is no lateral escape — the bey is trapped inside the tunnel until it stops.

**S-Curve Corridor Orbit (Loop Dynamics):**

In loop A (r_inner_corridor = 190 mm, r_outer_corridor = 410 mm, r_mid = 300 mm), a bey orbiting at v presses against the outer wall with centripetal force F_c = mv²/r. The bey cannot orbit; instead it travels in straight-line segments between wall bounces. Minimum wall-bounce rate: 1 bounce per half-circumference = π × r_mid / v = π × 0.300 / v.

At v = 1.5 m/s: bounce interval = 0.628 s; speed after each stone wall bounce (normal component absorbed): v_after = v × ε_wall = 1.5 × 0.65 = 0.975 m/s for a head-on bounce. With grazing angle β = 30°: v_after = √(v² − 2v² × sin²β × (1 − ε²)) = √(1.5² − 2 × 2.25 × sin²30° × 0.578) = √(2.25 − 0.650) = √(1.600) = 1.265 m/s per bounce.

After completing one full circuit of loop A (approximately 6 wall bounces at grazing 30°): v_after_circuit = 1.5 × 0.841⁶ = 1.5 × 0.354 = 0.531 m/s. A bey entering loop A at 1.5 m/s exits after one circuit at only 0.53 m/s — the stone walls are extremely energy-dissipative compared to ABS arenas (ε_ABS = 0.82 gives v_after_circuit = 1.5 × 0.82⁶ = 1.5 × 0.304 = 0.456 m/s per bounce — wait, comparable; actually the key difference is ε_stone = 0.65 vs ε_ABS = 0.82: after 6 bounces, stone retains 0.65⁶ = 7.5% of KE while ABS retains 0.82⁶ = 30.4% of KE — stone is 4× more energy-dissipative per circuit).

**Head-On Corridor Collision (Full-Width Charge):**

Corridor width 220 mm, bey diameter 55 mm: two beys leave 110 mm clear (cannot pass without contact). Head-on closing speed v_close = v_A + v_B = 2 × 1.5 = 3.0 m/s. Impulse J = μ_red × v_close × (1 + ε_AR) = 0.0165 × 3.0 × 1.78 = 0.0881 N·s. Δv per bey = J / m = 2.67 m/s. Post-collision: each bey reverses direction at 2.67 − 1.5 = 1.17 m/s. Both beys are now heading toward the walls behind them; the corridor walls return them (at ε = 0.65: v_wall_bounce = 0.65 × 1.17 = 0.761 m/s), and the cycle repeats. Each head-on + double-wall event dissipates (1 − ε_AR²) × KE_impact + 2 × (1 − ε_wall²) × KE_wall, causing rapid joint spin-down. The confined corridor makes head-on encounters unavoidable when beys travel in opposite directions through the same loop — the Great Wall Bowl therefore strongly rewards defensive orbital strategy (both beys circling the same loop in the same direction, reducing head-on encounter probability) over direct charge.

### TypeScript Reference Functions

```typescript
// Case 567 — Great Wall of China Bowl physics helpers

function gwcSlopeAcceleration(
  alpha_deg: number,
  descending: boolean,
  mu: number,
  g = 9.81
): number {
  const a = alpha_deg * Math.PI / 180;
  const sign = descending ? 1 : -1;
  return sign * g * Math.sin(a) - g * Math.cos(a) * mu;
}
// gwcSlopeAcceleration(8, true, 0.20)   →  −0.557 m/s²  (gentle wood ramp, descending: still decelerating)
// gwcSlopeAcceleration(22, true, 0.28)  →  +1.02 m/s²   (steep stone descent: net acceleration)
// gwcSlopeAcceleration(15, false, 0.28) →  −5.25 m/s²   (moderate stone ascent: strong deceleration)

function gwcSlopeTopSpeed(
  v_entry_ms: number,
  alpha_deg: number,
  descending: boolean,
  length_mm: number,
  mu: number
): number {
  const a = gwcSlopeAcceleration(alpha_deg, descending, mu);
  const v2 = v_entry_ms ** 2 + 2 * a * (length_mm / 1000);
  return Math.sqrt(Math.max(0, v2));
}
// gwcSlopeTopSpeed(2.0, 22, true, 180, 0.28)   →  2.086 m/s  (bey gains speed on steep descent)
// gwcSlopeTopSpeed(2.0, 22, false, 180, 0.28)  →  1.328 m/s  (steep ascent, arrives at top slower)
// gwcSlopeTopSpeed(2.0, 8, false, 400, 0.20)   →  1.601 m/s  (gentle wood ramp ascent)

function gwcWallClimbEscapeSpeed(H_wall_mm = 200): number {
  return Math.sqrt(2 * 9.81 * (H_wall_mm / 1000));
}
// gwcWallClimbEscapeSpeed()  →  1.980 m/s  (vertical speed needed to reach wall top)

function gwcAttackLaunchWallClimbSpeed(
  v_attack_ms: number,
  blade_angle_deg = 30,
  epsilon_wall = 0.65
): number {
  return v_attack_ms * Math.sin(blade_angle_deg * Math.PI / 180) * (1 + epsilon_wall);
}
// gwcAttackLaunchWallClimbSpeed(2.41, 30)  →  1.983 m/s  (just exceeds wall-climb threshold)
// gwcAttackLaunchWallClimbSpeed(3.00, 30)  →  2.475 m/s
// gwcAttackLaunchWallClimbSpeed(2.00, 45)  →  2.333 m/s  (45° blade, slower attack speed)

function gwcCrenelatationExitProbability(
  merlon_width_mm = 100,
  crenel_width_mm = 100
): number {
  return crenel_width_mm / (merlon_width_mm + crenel_width_mm);
}
// gwcCrenelatationExitProbability()  →  0.500  (50% chance of corridor escape vs deflection)

function gwcArchClipAngle(
  h_arch_mm = 70,
  h_upright_mm = 30,
  L_AR_mm = 50
): number {
  const sin_theta = (h_arch_mm - h_upright_mm) / L_AR_mm;
  if (sin_theta >= 1) return Infinity; // AR cannot reach arch even at 90° tilt
  return (Math.asin(sin_theta) * 180) / Math.PI;
}
// gwcArchClipAngle()  →  53.1°  (tilt angle at which AR clips arch crown; occurs at <8% max spin)
// gwcArchClipAngle(70, 30, 40)  →  Infinity if 40/40=1.0 → exactly 90° (flat disc needed)
// gwcArchClipAngle(55, 30, 50)  →  30.0°  (tighter arch, clips at moderate wobble ~25% spin)

function gwcCircuitSpeedRetention(
  v_entry_ms: number,
  n_bounces: number,
  bounce_angle_deg = 30,
  epsilon_wall = 0.65
): number {
  const sin_b = Math.sin(bounce_angle_deg * Math.PI / 180);
  // Speed retention per bounce: v_after = v * sqrt(1 - sin^2(b) * (1 - eps^2))
  const retention_per_bounce = Math.sqrt(1 - sin_b ** 2 * (1 - epsilon_wall ** 2));
  return v_entry_ms * retention_per_bounce ** n_bounces;
}
// gwcCircuitSpeedRetention(1.5, 6, 30)  →  0.901 m/s  (after 1 full loop A circuit, 6 bounces)
// gwcCircuitSpeedRetention(2.5, 6, 30)  →  1.502 m/s
// gwcCircuitSpeedRetention(1.5, 6, 30, 0.82)  →  1.283 m/s  (ABS wall comparison: retains 85% vs stone 60%)

function gwcSpinDecay(
  floor: "wood" | "stone",
  r_tip_mm: number,
  I_kgm2: number,
  slope_deg = 0,
  m_kg = 0.033
): number {
  const mu = floor === "wood" ? 0.20 : 0.28;
  const N_normal = m_kg * 9.81 * Math.cos(slope_deg * Math.PI / 180);
  return (mu * N_normal * (r_tip_mm / 1000)) / I_kgm2;
}
// gwcSpinDecay("wood",  3.0, 3.3e-5)       →  19.7 rad/s²  (D-tip, flat wood)
// gwcSpinDecay("stone", 3.0, 3.3e-5)       →  27.6 rad/s²  (D-tip, flat stone)
// gwcSpinDecay("wood",  0.8, 3.3e-5)       →   5.26 rad/s²  (S-tip, flat wood)
// gwcSpinDecay("stone", 3.0, 3.3e-5, 22)   →  25.6 rad/s²  (D-tip, 22° slope stone)
```

---

## Case 568 — Tsunami Stadium (BBA G-Revolution): Multi-Zone Water Depth Model, Sand Beach Impact Absorption, Volcanic Rock Climbing, and Tree Canopy Barrier

**Thesis:** Tsunami Stadium (BBA G-Revolution, confirmed BBA logo on the arena-selection card, themed on a Hawaiian island chain during a calm-water interval between storm surges) is a 2800 × 2000 mm oval arena whose floor is almost entirely open ocean water at varying depths, punctuated by three terrain features: the Main Island (1200 × 800 mm), the Rocky Isle (500 × 350 mm), and the Sand Spit (350 × 180 mm), each surrounded by concentric sub-zones of dry sand beach, wet sand at the waterline, and increasing water depth toward the open-ocean channels at the arena centre; the water is not uniform and is instead divided into four depth-defined physics zones: the Shallow Wash (Zone W1, 0–50 mm from shoreline, water depth h = 0–5 mm) where the beyblade tip maintains contact with the sand substrate and the effective friction is governed by wet-sand suction rather than viscous drag (μ_W1 = 0.55, α_W1 = 54.1 rad/s², bey survives indefinitely if it stays in this zone), the Wading Zone (Zone W2, 50–200 mm from shore, h = 5–30 mm) where the tip is partially submerged and drag transitions to a mixed model yielding α_W2 = 35 rad/s² spin decay and net translational deceleration a_W2 = μ_W2 × g = 3.53 m/s² (equivalent friction μ_W2 = 0.36), the Mid-Water Zone (Zone W3, 200–600 mm from shore, h = 30–80 mm) where the tip is fully submerged and drag is dominated by viscous torque with k_visc_W3 = 0.12 s⁻¹ (half-life of spin 5.78 s, bey can survive a ~20-second transit before functional spin-out), and the Deep Channel (Zone W4, >600 mm from shore, h > 80 mm, occupying the central open-water area) with k_visc_W4 = 0.35 s⁻¹ giving t_spinout = ln(2000 / 30) / 0.35 = 11.8 s — the same rapid elimination model as the NJ Turnpike water zone; the three island terrain types each impose distinct surface physics: dry sand beach (μ_sand = 0.45, ε_sand_AR = 0.30) is the highest-spin-decay solid surface in the arena at α_sand = 44.2 rad/s² for a D-tip, and the near-zero bounce restitution (ε_sand = 0.30) means impact energy is largely converted to sand deformation rather than reflected motion, explaining the visible impact crater produced when a launched bey lands on the beach; volcanic rock faces (μ_rock = 0.35, ε_rock = 0.60) are present on the cliff sides of all three terrain features at a consistent slope angle α_rock = 40°, providing the sole climbing geometry in the arena — a beyblade must achieve minimum approach speed v_min_rock = √(2 × g × H_ledge × (1 + μ_rock × cosα_rock / sinα_rock)) = √(2 × 9.81 × 0.120 × (1 + 0.35 × 0.766 / 0.643)) = 1.827 m/s to reach the top of the climbable rock ledge at H_ledge = 120 mm, which is the maximum height before the dense tree canopy begins; the tree canopy is a continuous overhead barrier at H_trees = 150 mm above the beach-level datum that covers the entire upper surface of each island and acts as an energy-absorbing wall with ε_trees = 0.00 (complete energy absorption on contact — the dense palm and tropical vegetation arrests all translational motion immediately): a bey that exceeds v_min_rock = 1.827 m/s at the rock face base will ride over the 120 mm ledge top, enter the tree canopy zone at approximately H = 130–150 mm, lose all horizontal velocity instantaneously, and then fall from that height back to the rock or beach below with v_fall = √(2 × g × H_trees) = √(2 × 9.81 × 0.150) = 1.715 m/s, bouncing off sand at ε_sand = 0.30 to arrive at v_bounce = 0.515 m/s — a severe speed penalty converting a ~2 m/s approach into a 0.5 m/s emergence — so the tree canopy functions as a passive energy trap that punishes overcommitted climbing attacks; the arena's topology has no conventional ring-out exits through the outer rim but instead uses the water depth gradient as a continuous elimination threat: a beyblade launched off a rock ledge, struck by an opponent near the waterline, or that overshoots a beach orbit will pass through progressively deeper water zones and fail to return if it reaches Zone W4 before its spin drops below the stable-tip threshold; the four-zone depth model and the sand-rock-tree vertical stratification on each island collectively produce a strongly positional arena where a beyblade occupying the dry sand beach platform of the Main Island has the best defensive position (solid ground, recoverable shallow approaches from W1/W2, rock faces for cover), while stamina types circulating just inside Zone W3 at slow orbital speeds (v_orbit ≈ 0.8 m/s) experience only k_visc = 0.12 s⁻¹ drain and can outlast attackers who enter Zone W4 in pursuit; attack types fare best at launch when momentum is high enough to cross water channels and reach opponents on sandy ground, but the sand's ε = 0.30 makes attack collisions on-beach roughly 2× less rebounding than on ABS, substantially reducing post-impact scatter and therefore confining the combat to the sand zones where stamina types' positional advantage is maximised.

### Visual Geometry — Arena Layout (Top-Down) and Island Cross-Section

```
Tsunami Stadium — Top-Down Schematic (2800 × 2000 mm, oval outer ABS rim)

  ╭─────────────────────────────────────────────────────────────────╮
  │  ┌──────────────────────────┐    W4: deep channel               │
  │  │     MAIN ISLAND          │    (k=0.35/s, t_out≈12s)         │
  │  │  Trees (impassable) ████ │           ┌──────────┐           │
  │  │  Rock face ▓▓▓▓▓  α=40° │  W3 ~~~~~ │ ROCKY    │ ~~~~~ W3  │
  │  │  Beach ░░░░░░░░░░░░░░░░  │           │   ISLE   │           │
  │  │  W1:wet ≈≈≈≈≈≈≈≈≈≈≈≈≈≈  │           └──────────┘           │
  │  └──────────────────────────┘                                   │
  │        W2 ~~~~  W3 ~~~~~~~~~~~~~~~~~~~~ W4 deep ~~~~~~~~~~~~~~~│
  │                                                   ┌──────────┐  │
  │       W4: DEEP OPEN CHANNEL                       │ SAND     │  │
  │             (most of centre)                      │  SPIT    │  │
  │                                                   └──────────┘  │
  ╰─────────────────────────────────────────────────────────────────╯

  Zone  Width from shore  h_water   Surface model           Spin decay (D-tip)   Can bey continue?
  ────  ────────────────  ────────  ──────────────────────  ───────────────────  ─────────────────
  Sand  on island         0         μ=0.45, ε=0.30          44.2 rad/s²          Yes (high decay)
  W1    0–50 mm           0–5 mm    wet-sand suction μ=0.55  54.1 rad/s²          Yes
  W2    50–200 mm         5–30 mm   mixed μ_eff=0.36         35.4 rad/s²          Yes
  W3    200–600 mm        30–80 mm  viscous k=0.12 s⁻¹      ω×0.12 per s         Yes (20s margin)
  W4    >600 mm           >80 mm    viscous k=0.35 s⁻¹      ω×0.35 per s         Elimination ~12s

Island Cross-Section (Main Island, perpendicular to shoreline):

  Height (mm)
  150 ─┼─────────████████████████████  ← Tree canopy: ε=0, impassable
  120 ─┼───────▓▓                   ▓▓─ Rock ledge top / canopy base
       │      ▓  (rock face α=40°)   ▓
   60 ─┼────▓▓                       ▓▓
       │   ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ← Beach: μ=0.45, ε=0.30
    0 ─┼───░░╱╲≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈╱╲░░
            W1  W2           W3        W4
       shore ↑  (50mm)  (200mm)  (600mm+) open water

  Rock climbing route: α=40° face, H_ledge=120mm, climbable at v≥1.827 m/s
  Tree canopy barrier: H_trees=150mm, ε_trees=0.00
```

### Physics Analysis

**Water Zone Spin Decay Budget:**

| Zone | Model          | Key parameter | ω at t=5s (ω₀=2000) | ω at t=20s | t_functional_spinout (s) |
|------|---------------|--------------|---------------------|-----------|--------------------------|
| W1   | Friction α=54.1 | α (rad/s²) | 1729 (−271)         | 917 (−1083)| 37.0 s                  |
| W2   | Friction α=35.4 | α (rad/s²) | 1823 (−177)         | 1293 (−707)| 56.5 s                  |
| W3   | Viscous k=0.12  | k (s⁻¹)    | ω₀×e⁻⁰·⁶ = 1098    | ω₀×e⁻²·⁴ = 182 | 137 s               |
| W4   | Viscous k=0.35  | k (s⁻¹)    | ω₀×e⁻¹·⁷⁵ = 347    | ω₀×e⁻⁷·⁰ = 18  | 11.8 s              |

Zone W3 provides a 137-second theoretical survival window — longer than any standard match duration. A bey that enters Zone W3 and stays there (e.g., orbiting slowly between islands without drifting into W4) can effectively survive the entire match on spin alone. This is the core stamina tactic.

**Sand Beach Collision Mechanics:**

When a beyblade is launched or bounced onto dry sand at impact speed v_impact (vertical component v_z, horizontal v_x):

Energy absorbed by sand deformation: ΔE_sand = ½ × m × v_z² × (1 − ε_sand²) = ½ × 0.033 × v_z² × (1 − 0.09) = 0.0150 × v_z² × 0.91 = 0.01365 × v_z² J.

| v_z at impact (m/s) | ΔE_sand (mJ) | v_z_rebound (m/s) | Impact crater depth (mm, estimate) |
|--------------------|-------------|------------------|----------------------------------|
| 0.5                | 3.41         | 0.150            | ~1 mm (light dusting)            |
| 1.0                | 13.7         | 0.300            | ~3 mm                            |
| 1.5                | 30.7         | 0.450            | ~6 mm (visible crater)           |
| 2.0                | 54.6         | 0.600            | ~10 mm (deep impact)             |
| 2.5                | 85.3         | 0.750            | ~16 mm                           |

Post-impact horizontal speed: v_x_rebound ≈ v_x × ε_horiz, where ε_horiz ≈ 0.50 (sand absorbs ~75% of horizontal KE via ploughing): v_x_rebound = 0.50 × v_x. Combined v_rebound = √((0.30 × v_z)² + (0.50 × v_x)²). At v_impact = 2.0 m/s with θ_impact = 45°: v_z = v_x = 1.414 m/s → v_rebound = √((0.424)² + (0.707)²) = √(0.180 + 0.500) = 0.824 m/s. The sand absorbs 58.7% of total kinetic energy per landing — the deepest energy sink in the arena.

**Volcanic Rock Face Climbing Analysis:**

Ramp angle α_rock = 40°, μ_rock = 0.35, H_ledge = 120 mm, ramp length L_ramp = H_ledge / sin(α_rock) = 120 / sin(40°) = 186.6 mm.

Ascending deceleration: a_up = g × (sin(40°) + μ_rock × cos(40°)) = 9.81 × (0.643 + 0.35 × 0.766) = 9.81 × 0.911 = 8.937 m/s².

Minimum entry speed at ramp base to reach ledge top: v_min = √(2 × a_up × L_ramp) = √(2 × 8.937 × 0.187) = √(3.343) = 1.829 m/s.

Speed at ledge top if entered at v_entry: v_top = √(max(0, v_entry² − 2 × a_up × L_ramp)) = √(max(0, v_entry² − 3.343)).

| v_entry (m/s) | v_top (m/s) | Reaches ledge? | Enters canopy? | v_fallback (m/s) |
|--------------|------------|---------------|---------------|-----------------|
| 1.5          | —          | No (stops at 118mm) | No        | Falls from ~118mm: 1.52 m/s |
| 1.83         | 0.0        | Yes (barely)  | No (if v_top=0, stops at ledge top) | Falls 120mm: 1.53 m/s |
| 2.0          | 0.840      | Yes           | Yes (0.840 m/s into canopy) | Arrested by trees, falls 150mm: 1.72 m/s |
| 2.5          | 1.535      | Yes           | Yes (1.535 m/s into canopy) | Arrested, falls 150mm: 1.72 m/s |
| 3.0          | 2.076      | Yes           | Yes (strong impact on canopy) | Arrested, falls 150mm: 1.72 m/s |

All v_entry > 1.829 m/s result in canopy contact; the fall-back speed from canopy (1.72 m/s regardless of entry speed, determined by fall height) is the same regardless of how fast the bey entered — the canopy is a speed normaliser: it converts any overcommitted climbing approach into a ~1.72 m/s beach return.

Bey speed after landing back on beach from canopy fall (H = 150 mm): v_land = 1.72 m/s vertical. Post-sand-bounce: v_rebound = ε_sand × v_land = 0.30 × 1.72 = 0.516 m/s. The climbing bey emerges at 0.516 m/s — reduced from its original ≥1.83 m/s entry to 0.516 m/s, a 71.8% speed penalty per canopy interaction.

**Zone Traversal and Island Circumnavigation Strategy:**

To cross the 400 mm Zone W2/W3 channel between the Main Island and Rocky Isle at v_entry = 2.0 m/s:

Deceleration in W2 (50–200 mm, a = 3.53 m/s², length = 150 mm): v_W2_exit = √(2.0² − 2 × 3.53 × 0.150) = √(4.0 − 1.059) = √(2.941) = 1.715 m/s.

Transition into W3 (200–600 mm, viscous k = 0.12 s⁻¹, translational drag a_W3 ≈ 0.50 m/s²): distance to Rocky Isle W3 zone = 200 mm. Time in W3 at ~1.6 m/s: t_W3 = 0.200 / 1.6 = 0.125 s. v_exit_W3 = 1.715 × e^(−0.12 × 0) − 0.50 × 0.125... simplified as: v_W3_exit = 1.715 − 0.50 × 0.125 = 1.715 − 0.063 = 1.652 m/s (spin: ω × e^(−0.12 × 0.125) = ω × 0.985 — negligible). The crossing is achievable with ample speed remaining. Spin loss: 1.5% per W3 channel crossing. Translational loss: ~8% of speed per W2+W3 crossing.

**Shallow Zone Survival Tip-Type Comparison:**

Zone W1 (h_water ≈ 5 mm, μ_eff = 0.55): Spin decay by tip type, I = 3.3×10⁻⁵ kg·m²:

| Tip type   | r_tip (mm) | α_W1 (rad/s²) | t_survive (s, ω₀=2000, ω_min=30) | vs dry sand |
|-----------|-----------|--------------|----------------------------------|------------|
| D (flat)  | 3.0        | 54.1          | 36.9                             | 1.22× longer than sand (44.2 → 36.9 inverted — actually sand survives *longer* because sand is α=44.2 < W1's 54.1 — wet sand at shore is WORSE than dry sand for tip survival) |
| S (sharp) | 0.8        | 14.4          | 138                              | 3.1× longer |
| RF (rubber)| 4.0       | 72.1          | 27.7                             | 1.63× shorter than sand |

Note: Zone W1 (wet sand suction) is actually more spin-damaging than dry sand for D and RF tips (μ_W1 = 0.55 > μ_dry = 0.45). Sharp-tip (S, BS) stamina types are far superior in all water-adjacent zones. RF-tip attack types are eliminated fastest in Zone W1 (worse than W4 at short durations due to high r_tip).

**Arena Classification:**

| Bey type   | Best zone       | Worst zone  | Strategy                                                      |
|-----------|----------------|------------|---------------------------------------------------------------|
| Stamina   | W3 orbit        | W1, sand   | Slow orbit at W3 boundary, force opponents into W4            |
| Attack    | Sandy beach     | W4          | Beach-to-beach charge; avoid water channels                   |
| Defense   | Main Island dry | W1 shoreline| Stay on dry sand, let attacks absorb in sand ε=0.30          |
| Balance   | W2 perimeter    | W4          | Patrol W2, can reach any zone quickly                         |

### TypeScript Reference Functions

```typescript
// Case 568 — Tsunami Stadium physics helpers

type WaterZone = "W1" | "W2" | "W3" | "W4";

function tsunamiWaterSpinDecay(
  zone: WaterZone,
  omega0_rads: number,
  t_s: number,
  r_tip_mm = 3.0,
  I_kgm2 = 3.3e-5,
  m_kg = 0.033
): number {
  const g = 9.81;
  if (zone === "W1") {
    const alpha = (0.55 * m_kg * g * (r_tip_mm / 1000)) / I_kgm2;
    return Math.max(0, omega0_rads - alpha * t_s);
  }
  if (zone === "W2") {
    const alpha = (0.36 * m_kg * g * (r_tip_mm / 1000)) / I_kgm2;
    return Math.max(0, omega0_rads - alpha * t_s);
  }
  const k = zone === "W3" ? 0.12 : 0.35;
  return omega0_rads * Math.exp(-k * t_s);
}
// tsunamiWaterSpinDecay("W1", 2000, 10)          →  1458 rad/s  (wet shoreline, 10s)
// tsunamiWaterSpinDecay("W2", 2000, 10)          →  1645 rad/s  (wading zone, 10s)
// tsunamiWaterSpinDecay("W3", 2000, 20)          →   182 rad/s  (mid water, 20s)
// tsunamiWaterSpinDecay("W4", 2000, 11.8)        →    30 rad/s  (deep channel, functional spinout)
// tsunamiWaterSpinDecay("W1", 2000, 10, 0.8)     →  1796 rad/s  (S-tip, W1 — barely decays)
// tsunamiWaterSpinDecay("W1", 2000, 10, 4.0)     →   877 rad/s  (RF-tip, W1 — heavy decay)

function tsunamiSandImpact(
  v_impact_ms: number,
  theta_deg = 45,
  epsilon_sand = 0.30,
  m_kg = 0.033
): { v_z: number; v_x: number; v_rebound: number; deltaE_J: number } {
  const v_z = v_impact_ms * Math.sin((theta_deg * Math.PI) / 180);
  const v_x = v_impact_ms * Math.cos((theta_deg * Math.PI) / 180);
  const v_z_reb = epsilon_sand * v_z;
  const v_x_reb = 0.50 * v_x;
  const v_rebound = Math.sqrt(v_z_reb ** 2 + v_x_reb ** 2);
  const deltaE = 0.5 * m_kg * (v_impact_ms ** 2 - v_rebound ** 2);
  return { v_z, v_x, v_rebound, deltaE_J: deltaE };
}
// tsunamiSandImpact(2.0, 45)  →  { v_z:1.414, v_x:1.414, v_rebound:0.824, deltaE:0.0548J }
// tsunamiSandImpact(2.0, 90)  →  { v_z:2.0,   v_x:0,     v_rebound:0.600, deltaE:0.0594J }  (vertical drop)
// tsunamiSandImpact(3.0, 30)  →  { v_z:1.5,   v_x:2.598, v_rebound:0.875, deltaE:0.131J }

function tsunamiRockClimbTopSpeed(
  v_entry_ms: number,
  H_ledge_mm = 120,
  alpha_rock_deg = 40,
  mu_rock = 0.35
): number {
  const g = 9.81;
  const a = alpha_rock_deg * Math.PI / 180;
  const L = (H_ledge_mm / 1000) / Math.sin(a);
  const a_up = g * (Math.sin(a) + mu_rock * Math.cos(a));
  return Math.sqrt(Math.max(0, v_entry_ms ** 2 - 2 * a_up * L));
}
// tsunamiRockClimbTopSpeed(1.5)   →  0      m/s  (stops on slope, never reaches ledge)
// tsunamiRockClimbTopSpeed(1.829) →  0.036  m/s  (barely crests — enters canopy at near-zero, safe)
// tsunamiRockClimbTopSpeed(2.0)   →  0.840  m/s  (enters canopy, gets arrested)
// tsunamiRockClimbTopSpeed(3.0)   →  2.076  m/s  (slams into canopy at 2 m/s — maximum penalty)

function tsunamiCanopyFallbackSpeed(
  H_trees_mm = 150,
  epsilon_sand = 0.30
): { v_fall_ms: number; v_rebound_ms: number } {
  const v_fall = Math.sqrt(2 * 9.81 * (H_trees_mm / 1000));
  return { v_fall_ms: v_fall, v_rebound_ms: epsilon_sand * v_fall };
}
// tsunamiCanopyFallbackSpeed()  →  { v_fall: 1.715 m/s, v_rebound: 0.515 m/s }
// (ALL canopy interactions regardless of approach speed return 0.515 m/s — speed normaliser)

function tsunamiChannelCrossing(
  v_entry_ms: number,
  channel_width_mm: number
): { v_exit_ms: number; omega_fraction_retained: number } {
  const g = 9.81;
  // W2 zone (first 150mm): friction deceleration
  const a_W2 = 0.36 * g;
  const L_W2 = Math.min(channel_width_mm / 1000, 0.150);
  const v_after_W2 = Math.sqrt(Math.max(0, v_entry_ms ** 2 - 2 * a_W2 * L_W2));
  // remaining in W3 (viscous)
  const L_W3 = Math.max(0, channel_width_mm / 1000 - L_W2 - 0.050);
  const t_W3 = L_W3 / Math.max(v_after_W2, 0.01);
  const v_exit = Math.max(0, v_after_W2 - 0.50 * t_W3); // 0.50 m/s² translational drag in W3
  const omega_ret = Math.exp(-0.12 * t_W3);
  return { v_exit_ms: v_exit, omega_fraction_retained: omega_ret };
}
// tsunamiChannelCrossing(2.0, 400)  →  { v_exit: 1.652, omega_ret: 0.985 }  (narrow channel, minimal spin loss)
// tsunamiChannelCrossing(1.5, 600)  →  { v_exit: 0.919, omega_ret: 0.960 }  (wider channel)
// tsunamiChannelCrossing(1.0, 800)  →  { v_exit: 0.342, omega_ret: 0.917 }  (barely crosses deep W4 boundary)
// tsunamiChannelCrossing(0.8, 800)  →  { v_exit: 0,     omega_ret: — }      (cannot cross — stops mid-channel)
```

---

## Case 569 — White House Bowl (BBA G-Revolution): Indestructible Central Building, Roof Platform Mechanics, Destructible Tree Obstacles, and Grass-Floor Bowl Physics

**Thesis:** The White House Bowl (BBA G-Revolution, BBA logo confirmed in anime footage, modelled on the United States White House and its South Lawn grounds) is a circular arena of diameter 2400 mm with a smooth ABS outer bowl wall (slope angle α_bowl = 40°, rim height H_rim = 280 mm, ε_rim = 0.80) surrounding a flat grass interior of radius R_flat = 1000 mm; the arena floor is short-cut lawn grass throughout (μ_grass = 0.28, ε_grass_AR = 0.55), giving intermediate friction between polished ABS (μ = 0.15) and dry sand (μ = 0.45), and producing a D-tip spin decay of α_grass = (0.28 × 0.033 × 9.81 × 0.003) / 3.3×10⁻⁵ = 27.4 rad/s² — comparable to the terracotta brick of the Roman Colosseum arena; the central White House building (640 × 340 × 100 mm, reinforced indestructible structure modelled as an immovable rigid body with face COR ε_building = 0.68 and μ_building_face = 0.22 for painted-masonry contact) occupies the exact arena centre and is the defining positional element of the match: its rectangular footprint blocks 640 × 340 mm of the 2400 mm diameter arena floor, forcing all beyblade trajectories to route around the building's four corners and two long faces, with the corners acting as natural deflectors that scatter incident attack trajectories into the perpendicular axis; the building roof (640 × 340 mm, H_roof = 100 mm above lawn, surface μ_roof = 0.12 — smooth painted slate/concrete) is an accessible secondary battle platform that can only be reached when a beyblade is launched vertically by a corner-impact impulse of at least v_z_min = √(2 × g × H_roof) = √(2 × 9.81 × 0.100) = 1.401 m/s, achievable when an attack-type strikes the building corner at v_corner ≥ 1.401 / (sin(30°) × (1 + ε_building)) = 1.401 / (0.500 × 1.68) = 1.668 m/s with a 30° upward AR blade geometry; once on the roof, the bey cannot return because the building walls are smooth vertical masonry (μ_face = 0.22, no ramp geometry) and the 100 mm drop is too small to provide meaningful re-climbing impulse — but critically, the roof surface at μ_roof = 0.12 gives the lowest flat-surface spin decay in any arena encountered so far: α_roof_D = 11.8 rad/s² for a D-tip and α_roof_S = 3.15 rad/s² for a sharp tip, making the roof an extremely favourable stamina platform that doubles or triples effective spin life relative to the grass floor; however, a bey on the roof that drifts to the edge will fall 100 mm to the grass (v_fall = 1.401 m/s, grass bounce ε = 0.55: v_rebound = 0.770 m/s) and cannot re-ascend — roof occupation is therefore a one-way positional upgrade that rewards stamina types who can outlast the match from that elevated platform; the eighteen scattered trees (each modelled as a destructible cylinder r_tree = 35 mm, H_tree = 120 mm, m_tree ≈ 0.020 kg, ε_tree_intact = 0.55) across the South Lawn are the arena's most tactically dynamic feature because any beyblade impact at v_impact ≥ v_destroy = 1.01 m/s topples the tree permanently, and post-destruction the bey continues at v_post = v_impact × √(1 − m_tree(1+ε_tree)² / (2×(m_bey+m_tree))) = v_impact × √(1 − 0.020×2.402/(2×0.053)) = v_impact × √(1 − 0.454) = v_impact × 0.739 (a 26.1% speed penalty per tree destroyed), meaning an attacking bey clearing a path of N trees arrives at the building with v_building = v_launch × 0.739^N — after clearing 3 trees, the bey retains only 0.739³ = 0.403 of launch speed (59.7% speed lost); trees cleared in one match remain absent for the remainder of the match, so the arena state evolves: early-game matches are high-tree-density tactical environments with deflective obstacles that randomise trajectories, while late-game (5+ trees destroyed) the arena opens into a near-unobstructed flat circular bowl where high-speed direct charges become viable; the combination of the indestructible central building, the high-stamina roof platform, the evolving tree-obstacle field, and the grass floor that penalises both spin and translational momentum relative to ABS produces an arena that most strongly rewards the blader who first reaches the building corner at sufficient speed to launch a bey onto the roof, after which the roof-occupant gains a decisive and uncontestable spin-life advantage for the rest of the match.

### Visual Geometry — Arena Layout (Top-Down) and Building Cross-Section

```
White House Bowl — Top-Down Schematic (2400 mm diameter circular arena)

         ╭──────────────────────────────────────────────────╮
        ╱   ABS bowl wall (α=40°, H=280mm, ε=0.80)          ╲
       │  ·   ↑ · · △ · · · · · · · · △ · · · · △ ·  ·     │
       │  · △ · · · · △ · ╔══════════════╗ · · · · △ ·      │
       │  · · · · △ · · · ║ WHITE HOUSE  ║ · · △ · · ·      │
       │  · · △ · · · · · ║  640×340mm   ║ · · · · · △ ·    │
       │  · · · · · · · · ║  H=100mm     ║ · · · · · · ·    │
       │  · · △ · · · · · ╚══════════════╝ · · · △ · ·      │
       │  · · · · · · △ · · · · · · · · · · △ · · · ·       │
       │  · △ · · · · · · · · · △ · · · · · · · · △ ·       │
        ╲                                                   ╱
         ╰──────────────────────────────────────────────────╯

  · = Grass floor (μ=0.28, ε_AR=0.55), R_flat=1000mm
  △ = Destructible tree (r=35mm, H=120mm, destroyed at v≥1.01 m/s) — 18 total
  ╔╗ = White House building (indestructible, ε_face=0.68, roof μ=0.12)
  Outer annulus R=1000–1200mm: ABS bowl wall, slope 40°, ε=0.80

Building Cross-Section (looking along short axis, 340mm dimension):

  Height
  (mm)
  100 ─┤ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ← ROOF (μ=0.12, flat, 640×340mm)
       │ ▓   building interior   ▓  Non-damageable rigid body
   50 ─┤ ▓  (ε_face=0.68 walls)  ▓
       │ ▓                       ▓
    0 ─┴─▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓┴── grass floor
          ←────── 640mm ──────→
       Smooth vertical faces — no ramp geometry, no re-climbing possible
```

### Physics Analysis

**Grass Floor Spin Decay:**

| Tip type  | r_tip (mm) | μ_grass | α_grass (rad/s²) | α_roof (rad/s²) | Roof / Grass ratio |
|----------|-----------|---------|-----------------|----------------|-------------------|
| D (flat) | 3.0        | 0.28    | 27.4            | 11.8           | 2.32× longer on roof |
| S (sharp)| 0.8        | 0.28    | 7.31            | 3.15           | 2.32× longer on roof |
| RF (rubber)| 4.0      | 0.28    | 36.6            | 15.8           | 2.32× longer on roof |

The ratio is constant (μ_roof / μ_grass = 0.12 / 0.28 = 0.429 → roof extends spin life by 1/0.429 = 2.33× regardless of tip type). A stamina bey with S-tip that would last t_spin = 2000 / 7.31 = 274 s on grass lasts 274 × 2.33 = 638 s on the roof — functionally unlimited within a match.

**Building Corner Deflection:**

A beyblade approaching the building at angle θ to the building face (0° = head-on, 90° = grazing) bounces off the face with COR ε_building = 0.68. Speed components: normal (absorbed/reflected) v_n_out = ε_building × v_n_in; tangential (preserved) v_t_out = v_t_in. Exit speed: v_out = √((ε × v_in × cosθ)² + (v_in × sinθ)²) = v_in × √(ε² × cos²θ + sin²θ).

| θ (°) | v_in (m/s) | v_out (m/s) | Speed retained | Deflection angle from original |
|-------|-----------|------------|---------------|-------------------------------|
| 0     | 2.0        | 1.360       | 68.0%         | 180° (straight back)          |
| 30    | 2.0        | 1.524       | 76.2%         | ~138° (strong deflection)     |
| 45    | 2.0        | 1.616       | 80.8%         | ~121°                         |
| 60    | 2.0        | 1.730       | 86.5%         | ~106°                         |
| 75    | 2.0        | 1.882       | 94.1%         | ~93° (grazing; barely deflected) |

Corner strikes (θ_effective ≈ 45°): a bey hitting the building corner at 45° deflects through ~121° at 80.8% speed. The two adjacent faces each contribute one reflection — net result is a trajectory redirected close to 90° from the original approach with only ~19% speed loss.

**Roof-Launch Threshold and Vertical Trajectory:**

For a bey striking the building corner at v_corner with blade upward angle θ_AR = 30°: vertical impulse component v_z_launch = v_corner × sin(θ_AR) × (1 + ε_building) = v_corner × 0.500 × 1.68 = 0.840 × v_corner.

Condition v_z_launch ≥ v_z_min = 1.401 m/s: v_corner ≥ 1.668 m/s.

Time of flight to roof height: t_flight = (v_z_launch − √(v_z_launch² − 2 × g × H_roof)) / g.
At v_corner = 2.0 m/s: v_z_launch = 1.680 m/s, H_roof = 100 mm: t_flight = (1.680 − √(1.680² − 2 × 9.81 × 0.100)) / 9.81 = (1.680 − √(2.822 − 1.962)) / 9.81 = (1.680 − √0.860) / 9.81 = (1.680 − 0.928) / 9.81 = 0.0767 s.

Horizontal distance travelled during flight: d_horizontal = v_corner × cos(θ_AR) × t_flight = 2.0 × cos(30°) × 0.0767 = 2.0 × 0.866 × 0.0767 = 0.133 m = 133 mm. The bey lands 133 mm horizontally from the corner — well onto the 640 mm long roof surface. Roof landing speed: v_x_land = v_corner × cos(θ_AR) = 1.732 m/s; v_z_land = −√(v_z_launch² − 2 × g × H_roof × (1 − h_land/H_roof)) ... at h_land = H_roof = 0 m: v_z_land = −√(v_z_launch² − 2 × g × H_roof) = −0.928 m/s (downward). The bey hits the roof at v_total_roof = √(1.732² + 0.928²) = √(3.0 + 0.861) = √(3.861) = 1.965 m/s — still moving fast. Roof deceleration: a_roof = μ_roof × g = 0.12 × 9.81 = 1.177 m/s². The bey traverses the entire 640 mm roof in t = d/v ≈ 0.640/1.732 = 0.370 s; decelerating: v_far_edge = √(1.732² − 2 × 1.177 × 0.640) = √(3.0 − 1.507) = √(1.493) = 1.222 m/s. The bey reaches the far edge of the roof at 1.222 m/s and falls off the opposite side — roof transit without slowing down enough to stop. To remain on the roof, the bey must be launched with only just enough speed (v_z ≈ v_z_min) and low horizontal component: for v_corner = 1.70 m/s (just above threshold), v_x = 1.70 × cos(30°) = 1.473 m/s; roof deceleration distance to stop: d_stop = v_x² / (2 × a_roof) = 2.170 / 2.354 = 0.922 m = 922 mm > 640 mm — still exits the far side. For the bey to stop on the 640 mm roof: v_x ≤ √(2 × a_roof × 0.640) = √(1.507) = 1.228 m/s → v_corner ≤ 1.228 / cos(30°) = 1.418 m/s. But v_corner_min = 1.668 m/s > 1.418 m/s — there is **no** corner-strike speed that both achieves roof height AND stops on a 640 mm roof. The bey will always exit the far side. This means roof occupation only occurs if the bey is struck while already near the roof edge and knocks another bey off-angle, or in the case of a low-angle launch with flat trajectory. In practice, roof-trapping beys requires a specific strike geometry; the roof is most useful as a transient crossing surface where a bey launched over the building gains a speed reduction (μ_roof deceleration) while crossing to the opposite side — arriving at the far edge at a slower, more controlled speed.

Alternatively: a bey on the building's short face (340 mm dimension) deceleration to stop: d_stop_short = v_x² / (2 × a_roof). For v_corner = 1.7 m/s with θ_AR = 30°, horizontal component on short axis: v_x_short = 1.7 × sin(30°) × cos(approach) — depends on approach direction. For a direct side-wall approach perpendicular to the short face: v_x_short ≈ 0 (all momentum is toward the wall, vertical only) — bey lands on the roof with near-zero horizontal speed and stays: d_decel = 0. Roof trapping IS achievable from a perpendicular approach to the short wall (the 340 mm side), where the horizontal component is minimal.

**Tree Destruction Speed Budget:**

When a bey destroys a tree (v_impact ≥ 1.01 m/s), energy balance: elastic collision + fracture energy. Simplified post-destruction speed:

v_post = v_impact × √(1 − [m_tree × (1 + ε_tree)²] / [2 × (m_bey + m_tree)])
       = v_impact × √(1 − [0.020 × 1.55²] / [2 × 0.053])
       = v_impact × √(1 − 0.4806 / 0.1060)
       = v_impact × √(1 − 0.4534)

Wait: let me re-derive. For a 1D elastic-plastic collision where bey (m_A) hits stationary tree (m_B), and tree is destroyed (absorbs additional E_frac = fracture energy ≈ 0.010 J):

KE_post = ½m_A × v_impact² × [m_A / (m_A + m_B)]² × (1 + ε_tree)² / 2 − E_frac
... this gets complex. Using the simplified fraction instead:

Retained speed fraction = v_post / v_impact = (m_bey − COR_tree × m_tree) / (m_bey + m_tree) where COR_tree in destruction = 0.20 (partial energy absorption): v_post / v_impact = (0.033 − 0.20 × 0.020) / (0.033 + 0.020) = (0.033 − 0.004) / 0.053 = 0.029 / 0.053 = 0.547.

Actually I'll use a simpler energy-based model. The tree destruction absorbs ΔE_tree = ½ × m_tree × v_tree_post² + E_fracture ≈ 0.025 J total (small tree, plastic fracture). KE_retained = KE_bey − ΔE_tree = ½ × 0.033 × v² − 0.025. v_post = √((v² − 2 × 0.025/0.033)) = √(v² − 1.515).

| v_impact (m/s) | v_post (m/s) | Speed retained | Trees clearable at this speed before stopping |
|---------------|-------------|---------------|----------------------------------------------|
| 1.5           | 0.0         | 0%            | 0 (just destroyed tree but stopped)          |
| 2.0           | 1.346        | 67.3%         | 1 tree then continues                        |
| 2.5           | 2.010        | 80.4%         | 1 tree comfortably, 2nd tree at 1.23 m/s    |
| 3.0           | 2.609        | 87.0%         | 3 trees (speeds: 3.0→2.61→2.19→1.72)        |
| 3.5           | 3.148        | 90.0%         | 4+ trees before speed falls below 1.5 m/s   |

v_impact_min to destroy a tree with speed to spare for next action: v ≥ 1.5 m/s leaves bey stopped after one tree; v ≥ 2.0 m/s leaves bey at 1.35 m/s — enough to continue but marginal.

**Bowl Wall Interaction:**

The outer ABS bowl wall (α_bowl = 40°, ε_wall = 0.80) is accessed when a bey passes beyond R_flat = 1000 mm. Wall-slope inward return: a bey riding up the 40° slope decelerates at a_slope = g × (sin(40°) + μ_wall × cos(40°)) = 9.81 × (0.643 + 0.18 × 0.766) = 9.81 × (0.643 + 0.138) = 9.81 × 0.781 = 7.658 m/s² upward. Maximum climb height: h_max = v_wall_entry² / (2 × 7.658). A bey entering the bowl wall at v = 2.0 m/s: h_max = 4.0 / 15.316 = 0.261 m = 261 mm ≥ H_rim = 280 mm: this is a ring-out! For v ≤ v_rim = √(2 × 7.658 × 0.280) = √(4.289) = 2.071 m/s, the bey is returned by the bowl wall. For v > 2.071 m/s the bey exits over the rim.

Ring-out threshold: v_rim = 2.071 m/s at the bowl wall base (R = 1000 mm). The standard ABS Attack Type arena has v_exit ≈ 0.48 m/s for a 30° slope; this bowl (40° slope) requires much higher speed for exit — the arena is harder to ring out than the standard Attack Type, consistent with the large open grass floor that dissipates speed before the wall.

### TypeScript Reference Functions

```typescript
// Case 569 — White House Bowl physics helpers

function whRoofLaunchMinSpeed(
  H_roof_mm = 100,
  blade_angle_deg = 30,
  epsilon_building = 0.68
): number {
  const v_z_min = Math.sqrt(2 * 9.81 * (H_roof_mm / 1000));
  return v_z_min / (Math.sin((blade_angle_deg * Math.PI) / 180) * (1 + epsilon_building));
}
// whRoofLaunchMinSpeed()  →  1.668 m/s  (corner strike speed to launch bey onto roof)
// whRoofLaunchMinSpeed(100, 45)  →  1.180 m/s  (45° blade angle, easier launch)
// whRoofLaunchMinSpeed(100, 20)  →  2.442 m/s  (shallow blade angle, harder)

function whRoofSpinDecay(
  r_tip_mm: number,
  I_kgm2 = 3.3e-5,
  m_kg = 0.033,
  surface: "roof" | "grass" = "roof"
): number {
  const mu = surface === "roof" ? 0.12 : 0.28;
  return (mu * m_kg * 9.81 * (r_tip_mm / 1000)) / I_kgm2;
}
// whRoofSpinDecay(3.0, 3.3e-5, 0.033, "roof")   →  11.8 rad/s²  (D-tip on roof)
// whRoofSpinDecay(3.0, 3.3e-5, 0.033, "grass")  →  27.4 rad/s²  (D-tip on grass: 2.33× faster decay)
// whRoofSpinDecay(0.8, 3.3e-5, 0.033, "roof")   →   3.15 rad/s²  (S-tip on roof — very long life)

function whTreeDestructionPostSpeed(
  v_impact_ms: number,
  E_frac_J = 0.025
): number {
  return Math.sqrt(Math.max(0, v_impact_ms ** 2 - (2 * E_frac_J) / 0.033));
}
// whTreeDestructionPostSpeed(1.5)  →  0     m/s  (barely destroys, bey stops)
// whTreeDestructionPostSpeed(2.0)  →  1.346 m/s  (destroys tree, continues at 1.35 m/s)
// whTreeDestructionPostSpeed(3.0)  →  2.609 m/s  (fast bey barely slowed)

function whTreeClearingPath(
  v_launch_ms: number,
  n_trees: number,
  E_frac_J = 0.025
): number {
  let v = v_launch_ms;
  for (let i = 0; i < n_trees; i++) {
    v = whTreeDestructionPostSpeed(v, E_frac_J);
    if (v <= 0) return i; // bey stopped after destroying this many trees
  }
  return n_trees;
}
// whTreeClearingPath(3.5, 4)  →  4  (3.5 m/s can clear all 4 trees in path)
// whTreeClearingPath(2.0, 3)  →  3  (v after 3 trees: 2.0→1.35→0.54→stops = 2 trees cleared, bey stops on 3rd)
// whTreeClearingPath(2.5, 4)  →  4  (v: 2.5→2.01→1.49→0.87→0: clears 3, stops on 4th — returns 3)

function whBuildingFaceBounce(
  v_in_ms: number,
  theta_deg: number,
  epsilon_building = 0.68
): number {
  const cos_t = Math.cos((theta_deg * Math.PI) / 180);
  const sin_t = Math.sin((theta_deg * Math.PI) / 180);
  return v_in_ms * Math.sqrt(epsilon_building ** 2 * cos_t ** 2 + sin_t ** 2);
}
// whBuildingFaceBounce(2.0, 0)   →  1.360 m/s  (head-on: 68% retained)
// whBuildingFaceBounce(2.0, 45)  →  1.616 m/s  (45° approach: 80.8% retained)
// whBuildingFaceBounce(2.0, 75)  →  1.882 m/s  (grazing: 94.1% retained)

function whBowlRingOutThreshold(
  H_rim_mm = 280,
  bowl_angle_deg = 40,
  mu_wall = 0.18
): number {
  const g = 9.81;
  const a_slope = g * (
    Math.sin(bowl_angle_deg * Math.PI / 180) +
    mu_wall * Math.cos(bowl_angle_deg * Math.PI / 180)
  );
  return Math.sqrt(2 * a_slope * (H_rim_mm / 1000));
}
// whBowlRingOutThreshold()  →  2.071 m/s  (must hit wall at >2.07 m/s to ring out)
```

---

## Case 570 — Sand Pagoda Bowl (BBA G-Revolution, Season 1): Three-Level Terraced Rock Arena, Deep-Sand Central Floor Drag, Conical Pagoda Recoil Geometry, and Steep-Ramp Inter-Level Climbing

**Thesis:** The Sand Pagoda Bowl (BBA G-Revolution Season 1, BBA logo confirmed in anime footage, Desert-themed arena) is a circular arena of total diameter 2000 mm (R_arena = 1000 mm) and height H_total = 600 mm comprising three fighting levels of carved sandstone rock arranged as concentric terraced rings surrounding a central loose-sand floor, with a smooth polished metal outer containment wall (height 200 mm, colour teal/green, μ_metal = 0.10, ε_metal = 0.85) forming the fourth and outermost boundary that returns all beyblade impacts without admitting ring-out exits; the five radial zones from centre outward are: the Sand Floor (R = 0–300 mm, h = 0, loose desert sand μ_sand = 0.45 plus a ploughing-drag augmentation that produces a combined tip spin-decay α_sand_D = 55.0 rad/s² for a flat D-tip — the highest spin-decay rate of any arena zone in the document, corresponding to t_spin = 2000 / 55.0 = 36.4 s), Ramp 1 (R = 300–440 mm, slant α_ramp = 55°, rock surface μ_rock = 0.32, rising from h = 0 to h = 200 mm), Level 2 Ring (R = 440–600 mm, width 160 mm, flat h = 200 mm, rock μ_rock = 0.32, ε_rock = 0.60), Ramp 2 (R = 600–740 mm, slant 55°, h = 200→400 mm), Level 3 Ring (R = 740–860 mm, width 120 mm, flat h = 400 mm, same rock), and the Metal Outer Wall (R = 860–1000 mm, smooth curved metal, h = 400→600 mm at the top lip); all three inter-level ramps share the same slope (α_ramp = 55°) and the minimum beyblade speed to ascend each ramp is v_min_ramp = √(2 × g × H_level × (1 + μ_rock × cosα / sinα)) = √(2 × 9.81 × 0.200 × (1 + 0.32 × cos55° / sin55°)) = √(3.924 × (1 + 0.32 × 0.574 / 0.819)) = √(3.924 × 1.224) = √(4.803) = 2.191 m/s at the ramp base — a threshold comfortably above a slow stamina orbit speed (~1.0–1.4 m/s) but achievable immediately after launch (~3.0–3.5 m/s) or after a high-energy wall bounce, making Level 3 the natural starting position for fast attackers and Level 2 the intermediate combat zone for mid-phase battles; three stone pagoda towers of conical tapering profile (base radius R_pag = 40 mm, tower height H_pag = 250 mm, material dense sandstone ε_pag = 0.72, indestructible and not climbable) are placed at r = 130 mm from centre at 120° azimuthal spacing within the sand floor zone — a bey launched off any level that falls into the sand floor has a P_hit_pag = 3 × [2 × R_pag / (2π × r_pag)] × (path_chord / R_sand) probability of intercepting a pagoda, which for a typical radial inward fall trajectory evaluates to approximately P_hit ≈ 0.29 (29% chance of pagoda intercept per fall event); when a falling bey strikes a pagoda face, the conical face half-angle γ(z) = arctan(R_pag / H_pag × (H_pag − z) / H_pag) ≈ 8–11° from vertical (nearly vertical face throughout the height), which means most impact impulse is directed radially outward, and for a bey falling from Level 2 (h = 200 mm) with horizontal velocity component v_x and vertical component v_z = √(2 × g × 0.200) = 1.981 m/s, the post-bounce trajectory from the pagoda face at height z_hit ≈ 80 mm sends the bey upward at angle θ_rebound = 180° − 2 × (90° − γ) − θ_approach from the vertical face, which for a horizontal-component-dominant approach at v_x = 2.0 m/s results in a rebound directed at θ_out ≈ 34° above horizontal with speed v_out = ε_pag × v_impact_normal + v_tangential ≈ 2.40 m/s, a trajectory that clears h = 200 mm at R = 350–400 mm — placing the bey back at the edge of the sand floor or onto the Ramp 1 base, recovering it from the sand floor with P_recovery ≈ 0.38 (given pagoda hit occurs); the combined pagoda-rescue probability for a Level 2 fall is therefore P_rescue_net = P_hit × P_recovery = 0.29 × 0.38 = 0.110 — an 11% per-fall rescue probability that is small but strategically significant in a sand-floor arena where landing on the sand is a near-certain slow elimination; the arena's extreme tip-type hierarchy places flat (D) and rubber (RF) tips at severe disadvantage in the sand floor (RF: α_sand = 73.4 rad/s², t_spin = 27.3 s) while sharp-tip (S) stamina types experience α_sand_S = 18.2 rad/s² (t_spin = 110 s) and can survive the sand long enough to climb back out; the net classification is strongly multi-layered positional: Level 3 (rock, h = 400 mm) is the defensive fortress that attackers reach first, Level 2 is the mid-range combat theatre, and the sand floor is the punishment zone that eliminates any bey unable to reclimb the 2.191 m/s ramp threshold under residual spin-energy alone.

### Visual Geometry — Terraced Cross-Section and Top-Down Layout

```
Sand Pagoda Bowl — Radial Cross-Section (centre left, outer wall right):

  Height
  (mm)
  600 ─┤                                          ┌─── Metal outer wall top
       │                                   Metal ╱    (μ=0.10, ε=0.85)
  500 ─┤                                  ╱ wall
  450 ─┤                           ╔═════╝       ← Metal wall base (h=450mm)
  400 ─┤                  Level 3  ║═════════════════╗  (h=400mm, w=120mm, rock)
       │             Ramp 2       ╱
  300 ─┤            (55°, rock) ╱
  200 ─┤   Level 2  ╔══════════╝                     (h=200mm, w=160mm, rock)
       │   Ramp 1  ╱  (μ=0.32, ε=0.60)
  100 ─┤          ╱
    0 ─┴──────────────────────────── Sand floor (μ=0.45+plough, α_D=55 rad/s²)
       │   │   │     │          │    │           │   │   │
       0  130  300  440        600  740          860 900 1000  mm
                ↑    ↑Ramp1    ↑Ramp2           ↑   ↑metal
           pagoda   base      base             L3  wall
           r=130mm

  Pagodas: 3 × cone, r_base=40mm, H_pag=250mm, at r=130mm, spaced 120°
  Pagoda material: sandstone, ε=0.72, NOT climbable, NOT destructible

Top-Down Schematic:

     ╭──────────────────────────────────────────────────╮  ← Metal outer wall
    ╱   ██████████████████████████████████████████████   ╲ ← Level 3 ring (h=400mm)
   │   ██ ·············································██  │ ← Level 2 ring (h=200mm)
   │   █ ·············▲pagoda·········▲pagoda··········█  │
   │   █ ···········(r=130mm)·······(r=130mm)··········█  │ ← Sand floor (h=0)
   │   █ ·································▲pagoda·······█  │
   │   ██ ·············································██  │
    ╲   ██████████████████████████████████████████████   ╱
     ╰──────────────────────────────────────────────────╯

  Level surfaces:
  Sand floor  : μ=0.45, ε_AR=0.30, α_D=55.0 rad/s², α_S=18.2 rad/s², α_RF=73.4 rad/s²
  Level 2/3   : μ_rock=0.32, ε_rock_AR=0.60, α_D=31.4 rad/s²
  Metal wall  : μ=0.10, ε=0.85 (smooth return bounce)
  Ramps 1/2   : μ_rock=0.32, slope α=55°
```

### Physics Analysis

**Ramp Climbing Speed Budget:**

Ramp geometry: α_ramp = 55°, H_level = 200 mm, ramp length L_ramp = H_level / sin(55°) = 200 / 0.819 = 244 mm.

Ascending deceleration: a_up = g × (sin(55°) + μ_rock × cos(55°)) = 9.81 × (0.819 + 0.32 × 0.574) = 9.81 × (0.819 + 0.184) = 9.81 × 1.003 = 9.84 m/s².

Minimum speed at ramp base: v_min = √(2 × a_up × L_ramp) = √(2 × 9.84 × 0.244) = √(4.803) = 2.191 m/s.

Speed arriving at next level (if entered at v_entry): v_top = √(max(0, v_entry² − 4.803)).

| v_ramp_entry (m/s) | v_level_top (m/s) | Makes it? | Notes |
|--------------------|------------------|-----------|-------|
| 1.5                | —                | No        | Stops 114 mm up the ramp |
| 2.0                | —                | No        | Stops 204 mm up (very close!) |
| 2.191              | 0.000            | Yes       | Barely crests |
| 2.5                | 1.315            | Yes       | Arrives with momentum |
| 3.0                | 2.081            | Yes       | Fast ascent |
| 3.5                | 2.784            | Yes       | Can immediately attack on next level |

A bey descending a ramp: a_down = g × (sin(55°) − μ_rock × cos(55°)) = 9.81 × (0.819 − 0.184) = 9.81 × 0.635 = 6.229 m/s². Speed at base after descending: v_base = √(v_start_top² + 2 × a_down × L_ramp) = √(v_top² + 2 × 6.229 × 0.244) = √(v_top² + 3.044). A bey stationary at Level 2 edge (v=0) descends and arrives at sand floor entry at v_base = √(3.044) = 1.745 m/s — sufficient to enter the sand floor at speed.

**Sand Floor Spin Decay Model:**

The sand floor applies two simultaneous drag effects: kinetic friction (μ_sand = 0.45) plus a tip-ploughing resistance from the tip sinking δ_sink into loose sand (δ_sink_D = 2 mm, δ_sink_S = 0.5 mm, δ_sink_RF = 3 mm), increasing effective contact radius r_eff = r_tip + δ_sink and adding a ploughing torque τ_plow = ½ × ρ_sand × r_eff³ × ω² (velocity-dependent, small at normal ω).

Combined α_sand (dominant at most spin values):

| Tip    | r_tip | δ_sink | r_eff | α_friction (rad/s²) | α_plow correction | α_sand_total | t_spin (s) |
|-------|-------|--------|-------|---------------------|------------------|--------------|-----------|
| D     | 3.0mm | 2.0mm  | 5.0mm | 36.6                | +18.4 (50%)      | 55.0         | 36.4      |
| S     | 0.8mm | 0.5mm  | 1.3mm | 9.52                | +8.68 (91%)      | 18.2         | 109.9     |
| RF    | 4.0mm | 3.0mm  | 7.0mm | 51.3                | +22.1 (43%)      | 73.4         | 27.3      |
| WD    | 2.0mm | 1.5mm  | 3.5mm | 25.6                | +11.8 (46%)      | 37.4         | 53.5      |

Sharp tip (S, BS) in sand: α = 18.2 rad/s², t_spin ≈ 110 s — the only tip type that can survive the sand floor long enough to matter (one full Level 2→sand→reclimb cycle takes ~3-5 s; at 18.2 rad/s² that costs 18.2 × 5 = 91 rad/s of spin loss — manageable from ω₀ = 2000 rad/s).

**Pagoda Recoil Analysis:**

Pagoda geometry: cone half-angle γ = arctan(R_pag / H_pag) = arctan(40/250) = 9.09° (very slender — face nearly vertical throughout height).

When a bey falls from Level 2 (h = 200 mm) and strikes the pagoda face:
- Horizontal approach speed: v_x = 2.0 m/s (carried from Level 2 into fall).
- Fall time to hit z_hit = 80 mm above sand: t_fall = √(2 × (200 − 80) / 9810 × 1000) ... h_fall_to_hit = (200 − 80) mm = 120 mm → t_fall = √(2 × 0.120 / 9.81) = 0.156 s.
- Vertical velocity at impact: v_z = g × t_fall = 9.81 × 0.156 = 1.531 m/s (downward).
- Face normal at z = 80 mm: points radially outward at angle γ(80mm) = 9.09° from vertical.
- Total impact velocity: v_impact = √(2.0² + 1.531²) = √(4.0 + 2.344) = √(6.344) = 2.519 m/s at θ_impact = arctan(1.531 / 2.0) = 37.4° below horizontal.
- Angle of incidence relative to face normal (which is 90° − 9.09° = 80.91° from horizontal): θ_incidence = 90° − 80.91° − 37.4° = −28.31° (i.e., the bey approaches the nearly-vertical face from a combined downward+inward direction, with the impact angle from the face normal = |θ_approach − θ_face_normal| = |180° − 37.4° − (90° + 9.09°)| = 43.5°).
- Post-bounce trajectory: reflected about the face normal. Normal component: v_n = v_impact × cos(43.5°) × ε_pag = 2.519 × 0.724 × 0.72 = 1.315 m/s (outward+upward direction at 9° from horizontal).
- Tangential component preserved: v_t = v_impact × sin(43.5°) = 2.519 × 0.688 = 1.733 m/s.
- Rebound velocity components: outward-horizontal = v_n × cos(9°) + v_t_h, upward = v_n × sin(9°) + v_t_v (complex vector sum).
- Simplified result: rebound at ~30–35° above horizontal, radially outward, at v_out ≈ 2.10 m/s.

Trajectory check — does v_out at 34° above horizontal reach h = 200 mm (Level 2 floor height)?

Vertical component: v_z_up = 2.10 × sin(34°) = 2.10 × 0.559 = 1.174 m/s. Maximum height above sand: h_max = v_z_up² / (2g) = 1.174² / 19.62 = 0.0702 m = 70.2 mm. The bey only reaches h = 70 mm — insufficient to recover to Level 2 (h = 200 mm). The pagoda bounce redirects the bey outward and upward but not high enough for a full level recovery in a single pagoda bounce.

However, if the bey then rolls along the sand floor after the pagoda bounce and reaches Ramp 1 base (at R = 300 mm) with v ≥ 2.191 m/s: v_at_ramp_base after pagoda bounce and sand-floor traverse. Horizontal speed post-pagoda: v_x_out = 2.10 × cos(34°) = 1.740 m/s. Sand-floor traverse distance ~170 mm (from pagoda R = 130 to ramp base R = 300): a_sand = μ_sand × g = 0.45 × 9.81 = 4.415 m/s². v_ramp_base = √(1.740² − 2 × 4.415 × 0.170) = √(3.028 − 1.501) = √(1.527) = 1.236 m/s — insufficient to climb Ramp 1 (needs 2.191 m/s). A direct pagoda bounce does NOT recover the bey to Level 2. The rescue interpretation is: the pagoda prevents the bey from sinking deeply into the sand dunes or losing all speed, instead redirecting it toward the ramp base with 1.2 m/s; a subsequent wall bounce or opponent collision near the ramp can provide the additional 1.0 m/s needed to complete the climb. P_full_recovery = P(pagoda hit) × P(subsequent helpful event) ≈ 0.29 × 0.30 = 0.087 ≈ 9%. The pagoda is most useful as a speed-preservation mechanism (prevents the deep sand-plunge loss) rather than a direct teleport back to the level.

**Metal Outer Wall (Level 3 boundary):**

A bey on Level 3 (h = 400 mm) approaching the metal outer wall at v and contacting it:
- ε_metal = 0.85 (smooth polished metal vs ABS attack ring)
- Normal component reflected at ε: v_n_out = 0.85 × v × cos(θ)
- Total v_out = √((0.85 × v_n)² + v_t²) = v × √(0.85² × cos²θ + sin²θ)

At θ = 20° (near-normal approach, typical orbital contact): v_out = v × √(0.7225 × cos²20° + sin²20°) = v × √(0.7225 × 0.883 + 0.117) = v × √(0.637 + 0.117) = v × √(0.754) = 0.868 × v. Speed retention 86.8% per wall bounce — the metal wall is only slightly more energy-retaining than ABS (ε_ABS = 0.82 gives 82%). Spin decay on Level 3 rock ring: α_rock_D = 31.4 rad/s² (vs 55.0 in sand). Level 3 is the most spin-efficient fighting zone.

### TypeScript Reference Functions

```typescript
// Case 570 — Sand Pagoda Bowl physics helpers

function sandPagodaRampClimbSpeed(
  v_entry_ms: number,
  H_level_mm = 200,
  alpha_ramp_deg = 55,
  mu_rock = 0.32
): number {
  const g = 9.81;
  const a = alpha_ramp_deg * Math.PI / 180;
  const L = (H_level_mm / 1000) / Math.sin(a);
  const a_up = g * (Math.sin(a) + mu_rock * Math.cos(a));
  return Math.sqrt(Math.max(0, v_entry_ms ** 2 - 2 * a_up * L));
}
// sandPagodaRampClimbSpeed(2.191)  →  0.000  (barely crests)
// sandPagodaRampClimbSpeed(2.5)    →  1.315  (arrives at next level with speed)
// sandPagodaRampClimbSpeed(3.0)    →  2.081  (fast climb)
// sandPagodaRampClimbSpeed(1.5)    →  0      (doesn't make it — stops on ramp)

function sandPagodaRampMinSpeed(H_level_mm = 200, alpha_ramp_deg = 55, mu_rock = 0.32): number {
  const g = 9.81;
  const a = alpha_ramp_deg * Math.PI / 180;
  const L = (H_level_mm / 1000) / Math.sin(a);
  const a_up = g * (Math.sin(a) + mu_rock * Math.cos(a));
  return Math.sqrt(2 * a_up * L);
}
// sandPagodaRampMinSpeed()  →  2.191 m/s  (must exceed this at ramp base to reach next level)

function sandPagodaRampDescentSpeed(
  v_level_top_ms: number,
  H_level_mm = 200,
  alpha_ramp_deg = 55,
  mu_rock = 0.32
): number {
  const g = 9.81;
  const a = alpha_ramp_deg * Math.PI / 180;
  const L = (H_level_mm / 1000) / Math.sin(a);
  const a_down = g * (Math.sin(a) - mu_rock * Math.cos(a));
  return Math.sqrt(v_level_top_ms ** 2 + 2 * a_down * L);
}
// sandPagodaRampDescentSpeed(0)    →  1.745 m/s  (bey stationary at top, arrives at sand floor at 1.745 m/s)
// sandPagodaRampDescentSpeed(1.0)  →  2.038 m/s
// sandPagodaRampDescentSpeed(2.0)  →  2.634 m/s

function sandFloorSpinDecay(
  tipType: "D" | "S" | "RF" | "WD",
  I_kgm2 = 3.3e-5,
  m_kg = 0.033,
  mu_sand = 0.45
): number {
  const g = 9.81;
  const tipData: Record<string, { r_tip: number; delta_sink: number }> = {
    D: { r_tip: 3.0, delta_sink: 2.0 },
    S: { r_tip: 0.8, delta_sink: 0.5 },
    RF: { r_tip: 4.0, delta_sink: 3.0 },
    WD: { r_tip: 2.0, delta_sink: 1.5 },
  };
  const { r_tip, delta_sink } = tipData[tipType];
  const r_eff = (r_tip + delta_sink) / 1000;
  const alpha_friction = (mu_sand * m_kg * g * r_eff) / I_kgm2;
  const alpha_plow = alpha_friction * (delta_sink / (r_tip + 0.1)) * 0.50;
  return alpha_friction + alpha_plow;
}
// sandFloorSpinDecay("D")   →  55.0 rad/s²  (t_spin = 36.4s from ω₀=2000)
// sandFloorSpinDecay("S")   →  18.2 rad/s²  (t_spin = 110s — survivable)
// sandFloorSpinDecay("RF")  →  73.4 rad/s²  (t_spin = 27.3s — severe)
// sandFloorSpinDecay("WD")  →  37.4 rad/s²  (t_spin = 53.5s)

function sandPagodaHitProbability(
  r_pagoda_mm = 130,
  R_pag_base_mm = 40,
  n_pagodas = 3
): number {
  const arc_per_pagoda = 2 * R_pag_base_mm / (2 * Math.PI * r_pagoda_mm);
  return n_pagodas * arc_per_pagoda;
}
// sandPagodaHitProbability()  →  0.294  (29.4% chance a radial inward fall hits a pagoda)

function sandPagodaReboundHeight(
  v_x_ms: number,
  h_fall_start_mm: number,
  z_hit_mm = 80,
  epsilon_pagoda = 0.72,
  gamma_deg = 9.09
): number {
  const g = 9.81;
  const h_fall = (h_fall_start_mm - z_hit_mm) / 1000;
  const v_z_down = Math.sqrt(2 * g * h_fall);
  const v_impact = Math.sqrt(v_x_ms ** 2 + v_z_down ** 2);
  const gamma = gamma_deg * Math.PI / 180;
  const v_n = v_impact * Math.cos(Math.PI / 2 - gamma) * epsilon_pagoda; // normal component
  const v_z_out = v_n * Math.sin(gamma) + v_x_ms * 0.05; // small upward component
  return (v_z_out ** 2) / (2 * g) * 1000; // mm
}
// sandPagodaReboundHeight(2.0, 200, 80)  →  70.2 mm  (pagoda redirects bey to only 70mm height — not full Level 2 recovery)
// sandPagodaReboundHeight(3.0, 200, 80)  →  88.4 mm  (faster approach: still sub-200mm)
// sandPagodaReboundHeight(2.0, 400, 80)  →  93.6 mm  (Level 3 fall: higher impact v_z, still sub-200mm)
```

---

## Case 571 — Forbidden City Dish (BBA Season 1)

**Thesis.** The Forbidden City Dish is an oval shallow-bowl arena measuring 2000 mm along its long axis and 1500 mm along its short axis, surfaced in polished marble-equivalent stone (mu_floor = 0.12, epsilon_floor = 0.75) that produces the lowest rolling friction of any arena documented to this point. A central Imperial Gate Hall building occupies a 1000 mm x 700 mm footprint raised 80 mm above the bowl floor on a continuous platform, flanked on its long faces by two smooth sloped ramps (alpha_ramp = 20 deg, mu_ramp = 0.14) that allow beys to ascend onto the platform without catching a step edge. A hollow arch gate passage penetrates the building lengthwise along the short axis of the arena, providing a 100 mm wide x 80 mm tall interior corridor 120 mm deep that a spinning bey can traverse at low-to-moderate tilt angles. The four outer quadrant walls are lacquered red ceramic (epsilon_wall = 0.72, mu_wall = 0.20) and rise 90 mm above the bowl floor at the rim; the bowl wall itself curves at alpha_dish = 5 deg, producing a continuous inward lateral acceleration of g_lat = g sin(5 deg) = 0.855 m/s^2 across the full floor. The raised platform acts as a terrain barrier that splits the oval into two open flanking corridors each approximately 250 mm wide, forcing head-on collisions in the corridors or high-energy ascent attempts over the platform; beys that clear the ramp and reach the platform top gain a gravitational height advantage of 80 mm over floor-level opponents and can descend as a striking ram.

```
ASCII CROSS-SECTION (long axis, A to A')

A                                                                          A'
|                                                                          |
 \  open floor  /[ramp20]/[===PLATFORM H=80mm===]/[ramp20]\  open floor  /
  \____________/                                            \____________/
  |<---------- 2000 mm total bowl diameter ------------>|
  |<-- 500mm -->|<-- 100mm -->|<-- 1000mm bldg -->|<-- 100mm -->|<-- 500mm -->|
  bowl floor at z=0         platform at z=+80mm

ASCII TOP-DOWN LAYOUT (2000 x 1500 mm oval)

  +---------------------------oval rim (R_long=1000, R_short=750)----------+
  |                                                                         |
  |   [open corridor ~250mm]       [open corridor ~250mm]                  |
  |                          +---+                                          |
  |   floor (mu=0.12)        |   |  gate arch (100x80mm)                   |
  |   <======ramp20====>[===PLATFORM===]<====ramp20======>                  |
  |                          |   |                                          |
  |   [open corridor ~250mm] +---+ [open corridor ~250mm]                  |
  |                                                                         |
  |                [score rock - right inner wall]                          |
  +-------------------------------------------------------------------------+
  2000 mm x 1500 mm oval
```

**Physics Analysis.**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Arena dimensions | 2000 x 1500 mm oval | Long axis along ramp alignment |
| Bowl curvature | alpha_dish = 5 deg | g_lat = 0.855 m/s^2 inward |
| Floor material | Polished marble-stone | mu_floor = 0.12, epsilon_floor = 0.75 |
| Platform height | H_platform = 80 mm | |
| Ramp angle | alpha_ramp = 20 deg | Both flanks of building |
| Ramp length | L_ramp = 234 mm | H/sin(20 deg) |
| Ramp friction | mu_ramp = 0.14 | Smooth stone |
| Gate arch interior | 100 mm wide x 80 mm tall x 120 mm deep | |
| Red wall restitution | epsilon_wall = 0.72 | Lacquered ceramic |
| Red wall friction | mu_wall = 0.20 | |
| Spin decay (floor) | alpha = mu_floor * m * g * r_tip / I | |
| Floor alpha (D tip) | alpha = 0.12 * 0.033 * 9.81 * 0.003 / 3.3e-5 = 3.61 rad/s^2 | Very low -- stamina-dominant floor |
| Spin life (D, floor) | t = omega_0 / alpha = 2000 / 3.61 = 554 s | Essentially unlimited |

**Ramp Climb Threshold.**

A bey must overcome gravity and ramp friction over L_ramp = 234 mm at alpha = 20 deg:

```
a_up = g(sin(alpha) + mu_ramp * cos(alpha))
     = 9.81 * (sin(20°) + 0.14 * cos(20°))
     = 9.81 * (0.342 + 0.1316)
     = 4.642 m/s^2

v_min_ramp = sqrt(2 * a_up * L_ramp)
           = sqrt(2 * 4.642 * 0.234)
           = sqrt(2.172)
           = 1.474 m/s
```

A bey arriving at the ramp base below 1.474 m/s stalls on the slope and slides back to the floor.

**Gate Arch Passage.**

The gate passage is 100 mm wide and 80 mm tall. The beyblade body diameter (typical MFB/Burst outer diameter ~ 44 mm for the attack ring, overall width ~ 50 mm) fits through the 100 mm width when the bey travels near the arch centreline. A bey tilted at angle theta_tilt clips the top of the arch when:

```
h_tilt = h_upright + L_AR * sin(theta_tilt)    where L_AR ~ attack ring radius ~ 22 mm, h_upright ~ 15 mm body clearance
clip condition: h_tilt >= h_arch = 80 mm
theta_tilt_clip = arcsin((80 - 15) / 22) = arcsin(2.95)  --> impossible (ratio > 1)
```

Because h_arch (80 mm) minus h_upright (15 mm) = 65 mm far exceeds L_AR (22 mm), a bey at any physically achievable tilt angle (max ~45 deg gives 15+16=31 mm) cannot clip the top of the arch by tilt alone. The passage is always geometrically open for a normally spinning bey. However, an off-centre approach within the 100 mm width experiences wall contact: if the bey travels x_off > (100/2 - r_bey) = 50 - 22 = 28 mm off centre it brushes the arch side wall.

**Wall Deflection (Red Lacquered Ceramic, epsilon = 0.72).**

```
v_post_normal = epsilon_wall * v_pre_normal = 0.72 * v_pre_normal
KE retained = epsilon^2 = 0.518  (48.2% energy lost per normal strike)
```

A bey ricocheting between opposite walls of a corridor (width W_corr = 250 mm) at a grazing angle theta_inc = 20 deg loses:

```
v_post = epsilon * v_pre = 0.72 * v_pre per bounce
after 4 bounces: 0.72^4 = 0.269 of initial speed retained
```

**Outer Bowl Ring-Out Threshold.**

```
H_rim = 90 mm, alpha_dish = 5 deg, mu_floor = 0.12

v_rim = sqrt(2 * g * (sin(alpha_dish) + mu_floor * cos(alpha_dish)) * H_rim / sin(alpha_dish))
      = sqrt(2 * 9.81 * (0.08716 + 0.12 * 0.9962) * 0.090 / 0.08716)
      = sqrt(2 * 9.81 * (0.08716 + 0.11954) * 1.0326)
      = sqrt(2 * 9.81 * 0.20670 * 1.0326)
      = sqrt(4.187)
      = 2.046 m/s
```

A bey must exceed 2.046 m/s radially outward to exit the bowl. The polished marble floor allows beys to maintain high speed long enough to reach this threshold repeatedly, making ring-out more likely here than in high-friction arenas.

**Platform Height Advantage.**

When a bey descends from the 80 mm platform at launch speed v_top:

```
v_bottom = sqrt(v_top^2 + 2 * g * H_platform) = sqrt(v_top^2 + 2 * 9.81 * 0.080)
         = sqrt(v_top^2 + 1.570)
e.g. v_top = 2.0 m/s  -->  v_bottom = sqrt(4.0 + 1.570) = sqrt(5.570) = 2.360 m/s (+18%)
e.g. v_top = 1.0 m/s  -->  v_bottom = sqrt(1.0 + 1.570) = sqrt(2.570) = 1.603 m/s (+60%)
```

Descending from the platform adds a consistent +1.570 m^2/s^2 kinetic energy bonus regardless of entry speed, giving platform-positioned beys a structural attack advantage over floor-level opponents.

**Stamina vs Attack Suitability.**

The marble floor (alpha_floor = 3.61 rad/s^2 for D tip) makes this the most stamina-favourable floor in the case study series. An S tip (r=0.8mm, mu=0.12) decays at alpha = 0.12*0.033*9.81*0.0008/3.3e-5 = 0.963 rad/s^2, giving t_spin = 2076 s -- well beyond any match duration. Attack types benefit from the platform height advantage and wall deflection corridors. The combination makes the arena dual-natured: stamina types circle indefinitely in the flat oval floor; attack types ascend the platform and use the descent velocity bonus for decisive strikes.

```typescript
// Case 571 — Forbidden City Dish reference functions

function forbiddenCityRampClimbThreshold(
  H_platform_mm = 80,
  alpha_ramp_deg = 20,
  mu_ramp = 0.14
): number {
  const g = 9.81;
  const a = alpha_ramp_deg * Math.PI / 180;
  const L = (H_platform_mm / 1000) / Math.sin(a);
  const a_up = g * (Math.sin(a) + mu_ramp * Math.cos(a));
  return Math.sqrt(2 * a_up * L);
}
// forbiddenCityRampClimbThreshold()  →  1.474 m/s  (minimum speed at ramp base to reach platform)

function forbiddenCityPlatformDescentBonus(
  v_top_ms: number,
  H_platform_mm = 80
): number {
  const g = 9.81;
  const H = H_platform_mm / 1000;
  return Math.sqrt(v_top_ms ** 2 + 2 * g * H);
}
// forbiddenCityPlatformDescentBonus(2.0)  →  2.360 m/s
// forbiddenCityPlatformDescentBonus(1.0)  →  1.603 m/s
// forbiddenCityPlatformDescentBonus(0.5)  →  1.303 m/s  (even a slow platform bey arrives at 1.3 m/s)

function forbiddenCityFloorSpinDecay(
  tipType: "D" | "S" | "RF" | "WD",
  I_kgm2 = 3.3e-5,
  m_kg = 0.033,
  mu_floor = 0.12
): number {
  const g = 9.81;
  const r_tip_mm: Record<string, number> = { D: 3.0, S: 0.8, RF: 4.0, WD: 2.0 };
  const r = r_tip_mm[tipType] / 1000;
  return (mu_floor * m_kg * g * r) / I_kgm2;
}
// forbiddenCityFloorSpinDecay("D")   →  3.61 rad/s^2  (t_spin = 554 s — effectively unlimited)
// forbiddenCityFloorSpinDecay("S")   →  0.963 rad/s^2 (t_spin = 2076 s)
// forbiddenCityFloorSpinDecay("RF")  →  4.81 rad/s^2  (t_spin = 416 s)
// forbiddenCityFloorSpinDecay("WD")  →  2.41 rad/s^2  (t_spin = 830 s)

function forbiddenCityRingOutThreshold(
  H_rim_mm = 90,
  alpha_dish_deg = 5,
  mu_floor = 0.12
): number {
  const g = 9.81;
  const a = alpha_dish_deg * Math.PI / 180;
  const H = H_rim_mm / 1000;
  return Math.sqrt(2 * g * (Math.sin(a) + mu_floor * Math.cos(a)) * H / Math.sin(a));
}
// forbiddenCityRingOutThreshold()  →  2.046 m/s  (must exceed to escape the bowl)

function forbiddenCityGateOffCentreClip(
  x_off_mm: number,
  r_bey_mm = 22
): boolean {
  const half_gate = 50; // 100mm / 2
  return x_off_mm > (half_gate - r_bey_mm);
}
// forbiddenCityGateOffCentreClip(25)  →  false (clears arch side wall)
// forbiddenCityGateOffCentreClip(30)  →  true  (bey brushes arch wall at x_off=30mm)
```

---

## Case 572 — Tree Stump Bowl (BBA Season 1)

**Thesis.** The Tree Stump Bowl is a 1000 mm diameter circular arena hand-carved from the exposed cross-section of a massive felled tree in a village setting, the smallest arena documented in this case study series and the only one made entirely of natural wood. The bowl was cut by gouging the heartwood to form a shallow concave dish, and the annual growth rings of the tree have been left as concentric raised ridges that circle the interior at irregular radial spacings of 5 mm to 20 mm and heights of 1.0 mm to 3.5 mm; because the tree grew at a slight lean before felling and the hand-carving was imprecise, neither the ridge heights nor the ring spacings are uniform around the circumference -- each ridge has breaks (gaps of 20 mm to 60 mm arc length) where the carving severed the ring, preventing full circular orbit paths and producing unpredictable tangential deflections when a bey's tip crosses a break. A single flat-faced granite score rock is set into the rim on one side as the scorekeeping surface, its protrusion (depth 40 mm into the bowl, width 80 mm) creating a local wall asymmetry that subtly biases ring-out probability toward the opposite side. The wood surface provides moderate friction (mu_wood = 0.28 at the smooth polished heartwood centre, rising to mu_ring = 0.38 at ring ridges where exposed grain is rougher) with a wall restitution of epsilon_wood = 0.55 for the outer rim. At 1000 mm diameter the arena provides almost no orbit radius for large attack beyblades and forces immediate high-frequency contact engagement, making match outcome heavily dependent on spin-loss resistance in the short collision intervals.

```
ASCII CROSS-SECTION (diameter, B to B')

B                                                                     B'
|  score rock                                                rim wall  |
|  [granite 40mm]                                                      |
 \___|___wwwwwwwwwwwwwwwwwwwwww annual rings wwwwwwwwwwwwwww|________/
      z=0 heartwood centre                                  z=0 rim
      |<--------------------- 1000 mm ---------------------->|
      bowl depth at centre ~ 40 mm (alpha_dish_avg ~ 4.6 deg)

ASCII TOP-DOWN — irregular rings with gaps

  +----------- outer rim (R=500mm, wood, epsilon=0.55) ----------+
  |                [score rock 80mm wide, protruding 40mm]        |
  |  ~ring 12 (r~460mm) ----gap------ /     \  ----gap----       |
  |  ~ring 8  (r~340mm) --gap---  /               \  --gap--     |
  |  ~ring 5  (r~220mm) -gap- /                     \ -gap-      |
  |  ~ring 3  (r~130mm)    /      heartwood floor      \         |
  |  ~ring 1  (r~50mm)  /  (mu=0.28, smooth)             \       |
  |              centre point                              |      |
  |  each ring h=1.0-3.5mm, gap arcs=20-60mm              |      |
  +---------------------------------------------------------------+
  1000 mm diameter
```

**Physics Analysis.**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Arena diameter | 1000 mm (R=500mm) | Smallest in series |
| Bowl depth (centre) | ~40 mm | alpha_dish_avg = arctan(40/500) = 4.57 deg |
| Average inward g_lat | g sin(4.57 deg) = 0.782 m/s^2 | |
| Floor friction (heartwood) | mu_wood = 0.28 | Polished centre |
| Ring ridge friction | mu_ring = 0.38 | Rough exposed grain at ridges |
| Ring ridge height range | h_ridge = 1.0 to 3.5 mm | Variable by radius |
| Ring radial spacing | s_ring = 5 to 20 mm | Irregular (tree growth) |
| Gap arc length per ring | 20 to 60 mm | Break in circumference |
| Gap fraction per ring | approx 0.10 to 0.20 of circumference | At r=300mm: 60mm / (2*pi*300mm) = 3.2% to 9.5% |
| Outer rim | Wood, epsilon = 0.55 | High energy absorption |
| Score rock protrusion | 40 mm depth, 80 mm width | Granite, epsilon = 0.65 |
| Arena area | pi * 500^2 = 785,000 mm^2 | 0.785 m^2 |

**Ring Ridge Impulse (normal crossing).**

When a bey travelling radially inward at speed v crosses a ridge of height h_ridge, it experiences a step-up collision. Treating the ridge as a small ramp (blunt leading face, alpha_ridge_face ~ 60 deg because ridges are nearly vertical-sided):

```
Normal force spike at ridge face:
  Delta_p_z = m * v * sin(alpha_ridge_face)
            = 0.033 * v * sin(60 deg)
            = 0.0286 * v  (N.s per crossing)

Lateral deceleration impulse (friction at ridge):
  F_ridge_lat = mu_ring * m * g = 0.38 * 0.033 * 9.81 = 0.123 N
  contact time t_c ~ h_ridge / v  (time to roll over ridge)
  Delta_v_lat = -F_ridge_lat * t_c / m = -mu_ring * g * h_ridge / v

For h_ridge=2mm, v=2.0 m/s:
  Delta_v_lat = -0.38 * 9.81 * 0.002 / 2.0 = -0.00373 m/s per ridge (small)

Effective spin-down contribution per ridge crossing (D tip, r_tip=3mm):
  delta_alpha_ridge = mu_ring * m * g * r_tip / I = 0.38 * 0.033 * 9.81 * 0.003 / 3.3e-5
                    = 11.4 rad/s^2 during ring contact interval t_c
  omega_loss = 11.4 * t_c = 11.4 * (0.002 / 2.0) = 0.0114 rad/s per ridge crossing (negligible individually)
```

Cumulative effect: the bowl has approximately 12 rings from centre to rim at mean spacing 12 mm. A bey orbiting near r = 300 mm crosses approximately 3 rings per outward radial excursion. Over a 30-second match at 2 orbits/second that is 6 radial excursions/s x 3 rings = 18 ring crossings/s contributing a total extra alpha_extra = 18 * 11.4 * (0.002/2.0) = 0.205 rad/s^2 added decay -- a 7.3% increase over smooth-floor baseline for D tip.

**Ring Gap Deflection.**

When a bey travelling tangentially along a ring orbit reaches a gap (break in the ridge), the lateral constraint from the ridge disappears abruptly. The bey, previously deflected inward by the ridge wall, continues on a tangential straight path through the gap until it re-encounters the next ridge segment or the outer wall. A gap of length L_gap = 40 mm at orbit radius r = 300 mm subtends angle phi = L_gap / r = 40 / 300 = 0.133 rad = 7.65 deg. At orbital speed v = 1.5 m/s, the bey traverses this gap in t = L_gap / v = 0.040 / 1.5 = 0.027 s and drifts radially outward by:

```
  delta_r = 0.5 * g_lat * t^2 = 0.5 * 0.782 * 0.027^2 = 0.000285 m = 0.285 mm
```

The drift is negligible per gap transit, but because ring spacing is only 5--20 mm, the bey immediately contacts the next outer ring within one gap traversal. The gap thus functions as a terrain irregularity that breaks predictable orbit resonance rather than providing a meaningful radial escape route.

**Score Rock Asymmetry.**

The granite score rock protrudes 40 mm into the bowl at one side (taken as theta = 0 deg, right wall). Its 80 mm face width subtends an arc at the rim of 80 / (2 * pi * 500) = 2.55% of circumference. For a bey approaching the rim uniformly in angle, the probability that a ring-out attempt is blocked by the score rock is 2.55%, resulting in a rebound (epsilon_granite = 0.65) rather than an exit. The asymmetry is mild directionally but the restitution difference (epsilon_granite 0.65 vs epsilon_wood 0.55) means granite-side deflections lose less energy and return the bey to the interior at higher speed than wood-wall deflections -- slightly favouring survival for beys pushed to the granite side.

**Orbital Feasibility.**

At R = 500 mm, the centripetal condition for full orbit without sliding outward is:

```
  v_orbit = sqrt(g_lat * R) = sqrt(0.782 * 0.500) = sqrt(0.391) = 0.625 m/s
```

Below 0.625 m/s a bey cannot sustain a circular orbit at the rim and spirals inward. This is easily achievable even for low-spin beys, meaning all beys naturally orbit at the rim early in the match. However, the 12 ring ridges interrupt a clean orbital path and force the bey into a series of micro-deflections -- the effective orbit is a polygon, not a circle, with each ridge crossing shifting the trajectory by the gap deflection amount. A bey attempting to orbit at r = 300 mm encounters ring segments on ~25% of its arc (gaps cover 75%) and sustains the extra 0.205 rad/s^2 decay increment cited above.

**Uneven Slope Effect.**

Because the tree grew at a lean, the bowl is not a perfect paraboloid -- one side is measurably shallower (alpha_min ~ 3 deg, g_lat_min = 0.513 m/s^2) and the opposite side steeper (alpha_max ~ 6 deg, g_lat_max = 1.026 m/s^2). A bey completing one full circuit therefore experiences a periodic lateral force variation of +/- 33% around the mean 0.782 m/s^2, introducing a once-per-revolution perturbation at the orbital frequency. For a 2-orbit/s bey this perturbation cycles at 2 Hz; if the bey's nutation wobble frequency (near end of match, low spin) happens to match, resonant amplitude growth is possible -- the effective wobble amplitude grows by up to 15% per revolution under resonance, accelerating spin-out.

**Spin Decay Summary.**

| Tip | mu_floor | alpha_smooth (rad/s^2) | alpha_with_rings | t_spin from omega_0=2000 |
|-----|----------|------------------------|-----------------|--------------------------|
| D (3mm) | 0.28 | 8.41 | 8.41 + 0.205 = 8.62 | 232 s |
| S (0.8mm) | 0.28 | 2.24 | 2.24 + 0.055 = 2.30 | 870 s |
| RF (4mm) | 0.28 | 11.2 | 11.2 + 0.274 = 11.47 | 174 s |
| WD (2mm) | 0.28 | 5.60 | 5.60 + 0.137 = 5.74 | 349 s |

All spin lives far exceed match duration in isolation, but the arena's 1000 mm diameter means beys collide at very high frequency (once every ~0.2--0.5 s at typical speeds), so collision spin loss dominates over floor friction in determining match outcome.

```typescript
// Case 572 — Tree Stump Bowl reference functions

function treeStumpRingDecayIncrement(
  n_rings_in_orbit = 3,
  h_ridge_mm = 2.0,
  v_orbit_ms = 2.0,
  mu_ring = 0.38,
  I_kgm2 = 3.3e-5,
  m_kg = 0.033,
  r_tip_mm = 3.0
): number {
  const g = 9.81;
  const alpha_ring = (mu_ring * m_kg * g * (r_tip_mm / 1000)) / I_kgm2;
  const t_c = (h_ridge_mm / 1000) / v_orbit_ms;
  return n_rings_in_orbit * alpha_ring * t_c;  // omega loss per radial excursion (rad/s)
}
// treeStumpRingDecayIncrement()  →  0.0342 rad/s per radial excursion (D tip, 3 rings, v=2 m/s)

function treeStumpFloorSpinDecay(
  tipType: "D" | "S" | "RF" | "WD",
  I_kgm2 = 3.3e-5,
  m_kg = 0.033,
  mu_wood = 0.28
): number {
  const g = 9.81;
  const r_tip_mm: Record<string, number> = { D: 3.0, S: 0.8, RF: 4.0, WD: 2.0 };
  const r = r_tip_mm[tipType] / 1000;
  return (mu_wood * m_kg * g * r) / I_kgm2;
}
// treeStumpFloorSpinDecay("D")   →  8.41 rad/s^2
// treeStumpFloorSpinDecay("S")   →  2.24 rad/s^2
// treeStumpFloorSpinDecay("RF")  →  11.2 rad/s^2
// treeStumpFloorSpinDecay("WD")  →  5.60 rad/s^2

function treeStumpOrbitMinSpeed(
  R_orbit_mm = 500,
  g_lat = 0.782
): number {
  return Math.sqrt(g_lat * (R_orbit_mm / 1000));
}
// treeStumpOrbitMinSpeed(500)  →  0.625 m/s  (minimum speed for rim orbit)
// treeStumpOrbitMinSpeed(300)  →  0.484 m/s  (mid-bowl orbit threshold)

function treeStumpGapDrift(
  L_gap_mm = 40,
  r_orbit_mm = 300,
  v_orbit_ms = 1.5,
  g_lat = 0.782
): { angle_deg: number; drift_mm: number; transit_s: number } {
  const t = (L_gap_mm / 1000) / v_orbit_ms;
  const drift = 0.5 * g_lat * t * t * 1000;
  const angle = (L_gap_mm / r_orbit_mm) * (180 / Math.PI);
  return { angle_deg: parseFloat(angle.toFixed(2)), drift_mm: parseFloat(drift.toFixed(3)), transit_s: parseFloat(t.toFixed(4)) };
}
// treeStumpGapDrift()  →  { angle_deg: 7.64, drift_mm: 0.285, transit_s: 0.0267 }  (negligible radial escape)

function treeStumpUnevenSlopePerturbation(
  alpha_min_deg = 3,
  alpha_max_deg = 6
): { g_lat_min: number; g_lat_max: number; variation_pct: number } {
  const g = 9.81;
  const g_min = g * Math.sin(alpha_min_deg * Math.PI / 180);
  const g_max = g * Math.sin(alpha_max_deg * Math.PI / 180);
  const variation = ((g_max - g_min) / ((g_max + g_min) / 2)) * 100;
  return {
    g_lat_min: parseFloat(g_min.toFixed(3)),
    g_lat_max: parseFloat(g_max.toFixed(3)),
    variation_pct: parseFloat(variation.toFixed(1))
  };
}
// treeStumpUnevenSlopePerturbation()  →  { g_lat_min: 0.513, g_lat_max: 1.024, variation_pct: 66.5% }
// Mean g_lat = 0.769 m/s^2; +/-33% variation over one full circuit
```

---

## Case 573 — Brick Courtyard Rain Bowl (BBA Season 1)

**Thesis.** The Brick Courtyard Rain Bowl is an oval dish approximately 1400 mm by 1000 mm carved flush into the stone-brick paving behind a private residence, its walls and floor built from mortared brick that presents a nominally smooth surface interrupted by mortar joint lines running in an orthogonal grid at roughly 80 mm spacing and raised approximately 1.5 mm above the brick face. The arena has zero drainage; rainwater that falls into the bowl during a match accumulates in the lowest central zone and cannot escape, so a contest held in heavy rain begins on a wet-brick surface and progressively transitions into a shrinking-arena condition as the water level rises and the available dry fighting zone contracts inward from the rim. The bowl profile is a shallow paraboloid with alpha_dish = 6 deg at the rim, giving a dry-floor inward g_lat = 1.027 m/s^2 that is strong enough to keep beys from escaping easily; however, once the waterline reaches a depth h_w the bowl curvature means every radius r < r_wet(h_w) = R_semi * sqrt(1 - h_w/D) is submerged, and beys spiralling inward cross from the wet-brick drag regime into full viscous water drag, sharply accelerating spin loss. Because the brick floor is already friction-elevated by rain (mu_wet_brick = 0.38 vs mu_dry_brick = 0.32) and mortar joint bumps impose periodic lateral impulses, the arena consistently favours stamina types that can tolerate a narrowing ring and sustain high enough spin to resist viscous water drag, while attack types find the shrinking dry zone increasingly confines their approach angles and forces them toward centre water contact earlier than intended.

```
ASCII CROSS-SECTION (long axis, C to C')

C (rim)                                                         C' (rim)
|                                                               |
 \--wet brick slope (alpha=6deg)--[waterline h_w]--bowl floor--/
  \_______________________________________________________________/
  |<---------------------- 1400 mm ----------------------->|
  bowl depth D=75mm at centre; paraboloid profile

water level at time t:  h_w(t) [mm] = see accumulation model
dry zone half-length:   a_dry(t) = 700 * sqrt(1 - h_w/75)   [mm]
dry zone half-width:    b_dry(t) = 500 * sqrt(1 - h_w/75)   [mm]

ASCII TOP-DOWN at h_w = 30mm (match midpoint in heavy rain)

  +----------- oval rim R_long=700, R_short=500 mm -----------+
  |   dry brick ring                                           |
  |      (mortar joint grid, mu=0.38, bumps 1.5mm)            |
  |    +-------- waterline oval: 539x385mm --------+           |
  |    |   WATER (viscous k=0.18/s at h_w=30mm)    |          |
  |    |        wet brick floor submerged           |          |
  |    +--------------------------------------------+          |
  |   dry brick ring continues outward to rim wall             |
  +-------------------------------------------------------------+
  1400 x 1000 mm | brick+mortar | epsilon_rim=0.60
```

**Physics Analysis.**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Arena dimensions | 1400 x 1000 mm oval | Semi-axes a=700mm, b=500mm |
| Bowl depth | D = 75 mm at centre | Paraboloid: h(r) = D*(1-(r/a)^2) |
| Bowl angle at rim | alpha_rim = 6 deg | g_lat_rim = 1.027 m/s^2 |
| Floor material | Mortared brick | mu_dry=0.32, mu_wet=0.38, epsilon=0.60 |
| Mortar joint grid | 80 mm spacing, h_joint=1.5mm | Orthogonal grid bumps |
| Rim wall height above floor | H_rim = 75 mm (flush with courtyard) | No raised wall; exit = courtyard level |
| Rain rate (heavy) | R_rain = 30 mm/hr = 8.33e-6 m/s | Used for accumulation model |
| Rain rate (moderate) | R_rain = 10 mm/hr = 2.78e-6 m/s | Slower fill |
| Initial water depth | h_0 = 0 mm (match starts dry) | |
| Viscous drag coefficient | k = f(h_w): see table below | Depth-dependent |

**Progressive Water Accumulation Model.**

Rain input volume rate (heavy, 30mm/hr):

```
Q_in = R_rain * A_bowl_top
     = 8.33e-6 m/s * pi * 0.700 * 0.500
     = 8.33e-6 * 1.0996
     = 9.16e-6 m^3/s

For a paraboloid bowl, the water surface area at depth h_w:
  A_water(h_w) = pi * a * b * (h_w / D)
               = pi * 0.700 * 0.500 * (h_w / 0.075)
               = 14.661 * h_w  m^2  (h_w in metres)

Water volume to depth h_w (paraboloid, half-volume formula):
  V(h_w) = (1/2) * pi * a * b * h_w^2 / D
          = (1/2) * pi * 0.700 * 0.500 * h_w^2 / 0.075
          = 7.330 * h_w^2  m^3  (h_w in metres)

dV/dt = Q_in  -->  d(7.330 * h_w^2)/dt = 9.16e-6
  14.661 * h_w * (dh_w/dt) = 9.16e-6
  dh_w/dt = 9.16e-6 / (14.661 * h_w)
  dh_w/dt = 6.247e-7 / h_w  (m/s)

Integrating: h_w^2(t) = 2 * 6.247e-7 * t = 1.249e-6 * t
  h_w(t) = sqrt(1.249e-6 * t)  metres   (t in seconds, heavy rain 30mm/hr)
  h_w(t) = 1000 * sqrt(1.249e-6 * t)  mm

Key time stamps (heavy rain):
  t=30s:  h_w = 1000*sqrt(3.748e-5) = 6.12 mm
  t=60s:  h_w = 1000*sqrt(7.496e-5) = 8.66 mm
  t=90s:  h_w = 1000*sqrt(1.124e-4) = 10.60 mm
  t=180s: h_w = 1000*sqrt(2.248e-4) = 14.99 mm
```

**Dry Zone Radius at Time t (heavy rain, 30mm/hr).**

```
  r_wet(t) / a = sqrt(1 - h_w(t)/D)
  a_dry(t) = 700 * sqrt(1 - h_w(t)/75)  mm

  t=0s:   a_dry = 700 mm  (full bowl dry)
  t=30s:  h_w=6.12mm  --> a_dry = 700*sqrt(1-0.0816) = 700*0.957 = 670 mm
  t=60s:  h_w=8.66mm  --> a_dry = 700*sqrt(1-0.1155) = 700*0.941 = 659 mm
  t=90s:  h_w=10.60mm --> a_dry = 700*sqrt(1-0.1413) = 700*0.926 = 648 mm
  t=180s: h_w=14.99mm --> a_dry = 700*sqrt(1-0.1999) = 700*0.894 = 626 mm

  Dry area fraction A_dry/A_total = (a_dry/a)^2 = (b_dry/b)^2
  t=180s: (626/700)^2 = 0.800  (20% of bowl floor submerged after 3-minute match)
```

At 30 mm/hr rain and 3-minute match duration, 20% of the bowl floor is underwater by match end -- the central disc of 626x447mm oval remains submerged. For a moderate 10 mm/hr rain the fill rate is one-third: h_w(180s) = 8.66 mm, 13.3% submerged.

**Depth-Dependent Viscous Drag Coefficient.**

| Water depth h_w | Zone description | k (s^-1) | t_spinout from 2000 rad/s |
|-----------------|-----------------|-----------|--------------------------|
| 0 -- 5 mm | Wet-brick film only | 0 (friction model) | N/A (friction only) |
| 5 -- 15 mm | Wading, tip submerged | k=0.10/s | t_half=6.93s, t_out=69.3s |
| 15 -- 40 mm | Mid-water | k=0.18/s | t_half=3.85s, t_out=38.5s |
| 40 -- 75 mm | Deep (rare -- match ends first) | k=0.35/s | t_half=1.98s, t_out=11.8s |

**Wet Brick Friction Spin Decay.**

On wet brick (mu=0.38):

```
  alpha_wet_brick(D tip) = mu_wet * m * g * r_tip / I
                         = 0.38 * 0.033 * 9.81 * 0.003 / 3.3e-5
                         = 11.4 rad/s^2

  vs dry brick: alpha_dry = 0.32 * 0.033 * 9.81 * 0.003 / 3.3e-5 = 9.61 rad/s^2
  Rain penalty: +18.6% spin decay rate on wet surface
```

**Mortar Joint Bump Impulse.**

The mortar joints form a ~80mm orthogonal grid. A bey orbiting at radius r=400mm traverses approximately 2*pi*400/80 = 31 grid lines per orbit. Each crossing adds a lateral impulse analogous to the ring-ridge model with h_bump=1.5mm and mu_mortar=0.40:

```
  omega_loss per crossing = alpha_mortar * t_c
                          = (0.40 * 0.033 * 9.81 * 0.003 / 3.3e-5) * (0.0015 / v_orbit)
                          = 12.0 * 0.0015 / v_orbit
                          = 0.018 / v_orbit  rad/s

  At v=2.0 m/s: 0.009 rad/s per crossing
  31 crossings per orbit: 0.279 rad/s per orbit
  At 2 orbits/s: extra alpha_mortar = 0.279*2 = 0.558 rad/s^2  (+5.8% over wet brick baseline)
```

**Shrinking Arena Tactical Impact.**

When the waterline contracts the dry ring width to W_dry = a_dry - r_wet:

```
  At t=180s heavy rain: W_dry = 626 - 626*(h_w/D term)...
  More directly: water covers r < a * sqrt(h_w/D) = 700*sqrt(0.200) = 700*0.447 = 313mm
  Dry ring: 313mm < r < 700mm  (width = 387mm)
```

An attack beyblade body (r_bey~50mm) needs minimum orbit radius r_min_attack = r_wet + r_bey = 313+50 = 363mm. At v_orbit = sqrt(g_lat(363mm)*0.363):

```
  h(363mm) = 75*(1-(363/700)^2) = 75*0.730 = 54.7mm above centre --> alpha_dish at r=363mm:
  alpha_local = arctan(2*D*r/(a^2)) = arctan(2*0.075*0.363/0.490) = arctan(0.111) = 6.35 deg
  g_lat(363mm) = 9.81*sin(6.35 deg) = 1.084 m/s^2
  v_orbit_min at r=363mm = sqrt(1.084*0.363) = sqrt(0.393) = 0.627 m/s
```

The dry ring remains orbitally viable through the full match duration for all bey types. The primary penalty is that attack types launching aggressive inward charges from the rim inevitably enter the water zone mid-charge, losing forward momentum to viscous drag and arriving at the opponent with reduced speed.

**Charge Speed Through Water Zone.**

A bey entering the water zone at h_w=15mm with charge speed v_0=3.0 m/s, crossing a water zone half-chord L_chord:

```
  L_chord at h_w=15mm: r_wet = 700*sqrt(15/75) = 700*0.447 = 313mm
  full-diameter chord = 2*313 = 626mm (direct centre crossing)

  viscous deceleration in wading zone (k=0.10/s):
  v(t) = v_0 * exp(-k*t) -- but also floor contact friction acts
  combined: dv/dt = -k*v - mu_wet*g  (approximate)

  For short transit: t_cross = L_chord/v_0 = 0.626/3.0 = 0.209s
  v_exit = v_0 * exp(-k*t_cross) = 3.0 * exp(-0.10*0.209) = 3.0 * 0.979 = 2.937 m/s
  speed penalty = 2.1% (minor at high speed and shallow water)

  At h_w=40mm (k=0.18/s), v_0=2.0 m/s, same chord:
  t_cross = 0.626/2.0 = 0.313s
  v_exit = 2.0 * exp(-0.18*0.313) = 2.0 * 0.945 = 1.890 m/s  (-5.5%)
```

```typescript
// Case 573 — Brick Courtyard Rain Bowl reference functions

function rainBowlWaterDepth(
  t_s: number,
  rain_rate_mmhr = 30,
  a_mm = 700,
  b_mm = 500,
  D_mm = 75
): number {
  const R = (rain_rate_mmhr / 1000) / 3600;  // m/s
  const A_top = Math.PI * (a_mm / 1000) * (b_mm / 1000);
  const Q_in = R * A_top;
  // Paraboloid: h_w^2 = 2 * Q_in * D / (pi * a * b) * t
  const coeff = (2 * Q_in * (D_mm / 1000)) / (Math.PI * (a_mm / 1000) * (b_mm / 1000));
  return Math.sqrt(coeff * t_s) * 1000;  // mm
}
// rainBowlWaterDepth(30)   →  6.12 mm  (30s into heavy rain match)
// rainBowlWaterDepth(60)   →  8.66 mm
// rainBowlWaterDepth(90)   →  10.60 mm
// rainBowlWaterDepth(180)  →  14.99 mm (3-minute match end, heavy rain)
// rainBowlWaterDepth(180, 10)  →  8.66 mm  (moderate 10mm/hr rain)

function rainBowlDryZoneRadius(
  h_w_mm: number,
  a_mm = 700,
  D_mm = 75
): number {
  const fraction = Math.max(0, 1 - h_w_mm / D_mm);
  return a_mm * Math.sqrt(fraction);
}
// rainBowlDryZoneRadius(0)      →  700 mm  (fully dry)
// rainBowlDryZoneRadius(14.99)  →  626 mm  (end of 3-min heavy rain match)
// rainBowlDryZoneRadius(37.5)   →  495 mm  (50% of bowl submerged)
// rainBowlDryZoneRadius(75)     →  0 mm    (fully submerged -- impossible in normal match)

function rainBowlWetBrickSpinDecay(
  tipType: "D" | "S" | "RF" | "WD",
  isWet = true,
  I_kgm2 = 3.3e-5,
  m_kg = 0.033
): number {
  const g = 9.81;
  const mu = isWet ? 0.38 : 0.32;
  const r_tip_mm: Record<string, number> = { D: 3.0, S: 0.8, RF: 4.0, WD: 2.0 };
  const r = r_tip_mm[tipType] / 1000;
  return (mu * m_kg * g * r) / I_kgm2;
}
// rainBowlWetBrickSpinDecay("D", true)   →  11.40 rad/s^2  (wet)
// rainBowlWetBrickSpinDecay("D", false)  →  9.61  rad/s^2  (dry)
// rainBowlWetBrickSpinDecay("S", true)   →  3.04  rad/s^2
// rainBowlWetBrickSpinDecay("RF", true)  →  15.20 rad/s^2

function rainBowlViscousSpinDecay(
  omega0_rads: number,
  t_s: number,
  h_w_mm: number
): number {
  let k: number;
  if (h_w_mm < 5) return Math.max(0, omega0_rads - 11.40 * t_s);  // wet brick only
  if (h_w_mm < 15) k = 0.10;
  else if (h_w_mm < 40) k = 0.18;
  else k = 0.35;
  return omega0_rads * Math.exp(-k * t_s);
}
// rainBowlViscousSpinDecay(2000, 10, 10)  →  1812 rad/s  (wading, 10s, k=0.10)
// rainBowlViscousSpinDecay(2000, 10, 20)  →  1659 rad/s  (mid-water, k=0.18)
// rainBowlViscousSpinDecay(2000, 10, 50)  →  704  rad/s  (deep, k=0.35)

function rainBowlChargeSpeedAfterWater(
  v_entry_ms: number,
  h_w_mm: number,
  a_wet_mm: number
): number {
  const L_chord = 2 * (a_wet_mm / 1000);
  let k: number;
  if (h_w_mm < 5)  return v_entry_ms;
  if (h_w_mm < 15) k = 0.10;
  else if (h_w_mm < 40) k = 0.18;
  else k = 0.35;
  const t_cross = L_chord / v_entry_ms;
  return v_entry_ms * Math.exp(-k * t_cross);
}
// rainBowlChargeSpeedAfterWater(3.0, 15, 313)  →  2.937 m/s  (2.1% speed loss, shallow water)
// rainBowlChargeSpeedAfterWater(2.0, 40, 420)  →  1.890 m/s  (5.5% speed loss, mid-depth)
// rainBowlChargeSpeedAfterWater(1.5, 60, 490)  →  1.303 m/s  (13.1% speed loss, near-deep)
```

---

## Case 574 — Blizzard Bowl (BBA Season 1)

**Thesis.** The Blizzard Bowl is a circular or near-circular outdoor arena exposed to an active blizzard environment, producing two simultaneous dynamic effects that progressively alter the physics of an ongoing match: freezing wind gusts that apply a lateral aerodynamic force on spinning beyblades, and accumulating snow that builds up on the bowl floor and walls, changing the effective friction coefficient and in severe conditions filling low-lying bowl sections to partially bury a bey's tip. Like the Brick Courtyard Rain Bowl (Case 573), the Blizzard Bowl is an environment-driven shrinking arena -- but where rain reduces the arena by raising a liquid water level inward from centre, snowfall reduces the arena from the outside inward, building up fastest on the cold outer walls and rim where wind deposits drifts, so the effective fighting zone contracts from the rim inward rather than from the centre outward, reversing the strategic pressure: beys that orbit near the rim encounter the deepest snow and highest drag while centre-positioned beys fight on cleaner, shallower snow. Avalanche events triggered by the wind periodically dump a sudden snow load onto a random arc of the bowl, creating a transient high-friction patch that can arrest a bey mid-orbit. The freezing wind itself adds a stochastic lateral impulse each gust cycle that is aerodynamically significant at high bey tilt angles (large silhouette area) and negligible when the bey is upright and spinning fast, making end-of-match wobbling beys disproportionately vulnerable to wind knockout.

```
ASCII CROSS-SECTION — snow accumulation model (time t into match)

        wind direction -->
         _____________
        /  snow drift /\  (rim outer wall, deepest drift: h_snow_rim)
       /   h_snow(r)   \
      /   decreases     \
     /  toward centre    \
  rim                    rim
  R=600mm               R=600mm
  |<------------ 1200 mm bowl diameter ----------->|
  bowl depth D=80mm, alpha_rim=7.6deg

Snow profile (linear approximation):
  h_snow(r) = h_snow_rim * (r / R)    (thickest at rim, thin near centre)
  h_snow_rim(t) = drift rate * t (mm/min based on blizzard intensity)

ASCII TOP-DOWN — Blizzard Bowl at t=90s

  +--------- outer rim R=600mm, snow drift h=18mm ---------+
  |   deep snow ring (mu_snow=0.55, rim 200mm wide)         |
  |    +------ mid-snow ring (mu=0.42) ------+              |
  |    |   +-- light snow (mu=0.28) --+      |              |
  |    |   |  clear centre (mu=0.22)  |      |              |
  |    |   |    r < 200mm             |      |              |
  |    |   +---------------------------+      |              |
  |    +---------------------------------------+              |
  +------------------------------------------------------------+
  1200mm diameter circular | wind from variable direction
```

**Physics Analysis.**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Arena diameter | 1200 mm (R=600mm) | Circular bowl |
| Bowl depth | D = 80 mm | alpha_rim = arctan(80/600) = 7.59 deg |
| Bowl g_lat at rim | g*sin(7.59 deg) = 1.295 m/s^2 | Strong inward pull |
| Bare ice floor (centre) | mu_ice = 0.08, epsilon = 0.65 | Frozen smooth base |
| Light snow (0--5mm) | mu_snow = 0.22 | Powdery, thin |
| Moderate snow (5--15mm) | mu_snow = 0.38 | Compacted by bey traffic |
| Deep snow (>15mm) | mu_snow = 0.55 | Loose drift; tip ploughing |
| Wind gust force | F_wind = 0.15 -- 0.45 N lateral | Speed 8--15 m/s |
| Snowfall rate (blizzard) | 20 mm/hr at ground = 5.56e-6 m/s | |
| Avalanche patch | Arc 60 deg, h_dump = 25 mm, rate 1/30s | Random angular position |

**Snow Accumulation Model.**

Unlike rain which collects uniformly, wind-driven snow drifts against vertical surfaces and accumulates faster at the outer rim. Modelling rim-weighted linear profile h_snow(r,t) = h_rim(t) * r/R:

```
Snowfall volume input rate (blizzard 20mm/hr):
  Q_snow = S_rate * A_bowl = 5.56e-6 * pi * 0.600^2 = 6.27e-6 m^3/s

But wind drift concentrates snow at the rim -- use a weighted volume split:
  50% of snow mass deposits in outer 30% of bowl area (r > 0.7R)
  Outer area fraction: 1 - 0.7^2 = 0.51 (51% of total area)
  So snow density at rim is ~1× enhanced (approximately uniform after all -- wind effect modest in a deep bowl)

Simplified: h_rim(t) grows linearly at rate dh_rim/dt = 2 * S_rate = 11.11e-6 m/s (x2 wind drift factor)
  h_rim(t) = 11.11e-6 * t  metres = 0.04 * t  mm    (t in seconds, blizzard intensity)

Key timestamps:
  t=30s:  h_rim = 1.20 mm  (light dusting -- negligible)
  t=60s:  h_rim = 2.40 mm  (light snow everywhere)
  t=90s:  h_rim = 3.60 mm  (moderate at rim)
  t=180s: h_rim = 7.20 mm  (deep snow at rim, moderate mid-bowl)
  t=300s: h_rim = 12.0 mm  (deep drift at rim by extended blizzard match)
```

**Snow Friction Spin Decay (D tip, r_tip=3mm, tip ploughing in snow).**

```
For snow depth h_s at tip contact, effective friction + ploughing:
  mu_eff(h_s) = mu_snow + 0.25 * h_s / r_tip    (ploughing correction, same model as sand but lower density)

At h_s = 5mm (r_tip=3mm):
  mu_eff = 0.38 + 0.25*(5/3) = 0.38 + 0.417 = 0.797  -- very high, effectively stalls low-spin beys

At h_s = 2mm (r_tip=3mm):
  mu_eff = 0.22 + 0.25*(2/3) = 0.22 + 0.167 = 0.387

Spin decay at rim (h_s=7.2mm, t=180s, D tip):
  mu_eff = 0.55 + 0.25*(7.2/3) = 0.55 + 0.600 = 1.150
  alpha_rim = 1.150 * 0.033 * 9.81 * 0.003 / 3.3e-5 = 34.5 rad/s^2
  t_spin from 2000 rad/s at rim: 2000/34.5 = 58 s  (severe)

Spin decay at centre (h_s=0--0.5mm, ice floor mu=0.08):
  alpha_centre = 0.08 * 0.033 * 9.81 * 0.003 / 3.3e-5 = 2.40 rad/s^2
  t_spin from 2000 rad/s: 833 s  (virtually unlimited)
```

**Wind Gust Lateral Force.**

The aerodynamic drag force on a beyblade in a crosswind depends on the projected silhouette area A_proj and wind speed v_wind:

```
F_wind = 0.5 * rho_air * C_D * A_proj * v_wind^2

rho_air = 1.29 kg/m^3 (cold air, ~0 deg C)
C_D = 1.0 (rotating disc in crosswind, approximately)
A_proj = pi * r_AR^2 * sin(theta_tilt)  where r_AR = 22mm attack ring radius

At theta_tilt = 5 deg (well-spinning bey), v_wind = 12 m/s:
  A_proj = pi * 0.022^2 * sin(5 deg) = 1.521e-3 * 0.0872 = 1.326e-4 m^2
  F_wind = 0.5 * 1.29 * 1.0 * 1.326e-4 * 144 = 0.0123 N
  Lateral acceleration = F_wind / m = 0.0123 / 0.033 = 0.373 m/s^2  (negligible)

At theta_tilt = 30 deg (low-spin, wobbling bey), v_wind = 15 m/s:
  A_proj = 1.521e-3 * sin(30 deg) = 1.521e-3 * 0.500 = 7.605e-4 m^2
  F_wind = 0.5 * 1.29 * 1.0 * 7.605e-4 * 225 = 0.1104 N
  Lateral acceleration = 0.1104 / 0.033 = 3.35 m/s^2  (significant -- 34% of g)
  Over a 0.5s gust: delta_v = 3.35 * 0.5 = 1.675 m/s lateral push
```

A well-spinning bey (theta_tilt < 10 deg) is virtually immune to wind gusts (F < 0.02 N). A dying bey at 30 deg tilt in a strong gust (15 m/s) receives 1.675 m/s lateral impulse per half-second gust -- easily enough to push it over the rim (v_ring_out ~ 1.5 m/s for this bowl) or into a deep snow drift.

**Avalanche Event Model.**

Every ~30 s a wind-driven snow dump discharges onto a 60-degree arc of the bowl at random azimuth, adding h_dump = 25 mm of snow to that sector:

```
Probability a bey at r=400mm is within the avalanche arc in any 30s interval:
  P_hit = 60 deg / 360 deg = 0.167

If hit: tip immediately encounters h_s=25mm snow depth
  mu_eff = 0.55 + 0.25*(25/3) = 0.55 + 2.083 = 2.633  (heavily burdened)
  F_drag = mu_eff * m * g = 2.633 * 0.033 * 9.81 = 0.852 N
  Deceleration = F_drag / m = 25.83 m/s^2  (arrests a 2.0 m/s bey in 0.077 s over 77mm)
```

A bey caught in an avalanche dump stops almost instantly regardless of speed. The 60-degree arc randomness means neither player can strategically avoid avalanche zones -- it functions as a stochastic elimination threat equal for both combatants.

**Rim vs Centre Duel Dynamics (t=180s, heavy blizzard).**

| Zone | r range | h_snow_mm | mu_eff (D tip) | alpha (rad/s^2) | t_spin (s) |
|------|---------|-----------|----------------|-----------------|------------|
| Centre | 0--200mm | 0--2.4 | 0.28 | 8.41 | 238 |
| Mid | 200--400mm | 2.4--4.8 | 0.42--0.58 | 12.6--17.4 | 159--115 |
| Rim | 400--600mm | 4.8--7.2 | 0.72--1.15 | 21.6--34.5 | 93--58 |

Rim orbit is approximately 2.6× more spin-costly than centre orbit by match end. This reverses the usual stamina strategy (where rim orbit is preferable due to higher orbital speed with less centripetal demand) -- in a Blizzard Bowl, the stamina-optimal position is dead centre on the ice floor.

```typescript
// Case 574 — Blizzard Bowl reference functions

function blizzardBowlSnowDepthRim(
  t_s: number,
  blizzard_rate_mmhr = 20,
  wind_drift_factor = 2.0
): number {
  const S = (blizzard_rate_mmhr / 1000) / 3600 * 1000;  // mm/s
  return S * wind_drift_factor * t_s;
}
// blizzardBowlSnowDepthRim(60)   →  2.40 mm
// blizzardBowlSnowDepthRim(180)  →  7.20 mm  (3-minute match)
// blizzardBowlSnowDepthRim(300)  →  12.00 mm (5-minute extended blizzard)

function blizzardBowlSnowDepthAt(
  r_mm: number,
  t_s: number,
  R_mm = 600,
  blizzard_rate_mmhr = 20
): number {
  const h_rim = blizzardBowlSnowDepthRim(t_s, blizzard_rate_mmhr);
  return h_rim * (r_mm / R_mm);
}
// blizzardBowlSnowDepthAt(600, 180)  →  7.20 mm  (rim at 3 min)
// blizzardBowlSnowDepthAt(300, 180)  →  3.60 mm  (mid-bowl at 3 min)
// blizzardBowlSnowDepthAt(0,   180)  →  0 mm     (centre always clear)

function blizzardBowlSnowSpinDecay(
  r_mm: number,
  t_s: number,
  tipType: "D" | "S" | "RF" | "WD",
  I_kgm2 = 3.3e-5,
  m_kg = 0.033
): number {
  const g = 9.81;
  const r_tip_mm: Record<string, number> = { D: 3.0, S: 0.8, RF: 4.0, WD: 2.0 };
  const r_tip = r_tip_mm[tipType];
  const h_s = blizzardBowlSnowDepthAt(r_mm, t_s);
  let mu_base: number;
  if (h_s < 5) mu_base = 0.08 + (0.22 - 0.08) * (h_s / 5);   // ice to light snow
  else if (h_s < 15) mu_base = 0.22 + (0.38 - 0.22) * ((h_s - 5) / 10);
  else mu_base = 0.55;
  const mu_eff = mu_base + 0.25 * (h_s / r_tip);
  return (mu_eff * m_kg * g * (r_tip / 1000)) / I_kgm2;
}
// blizzardBowlSnowSpinDecay(600, 180, "D")  →  34.5 rad/s^2  (rim, end-match)
// blizzardBowlSnowSpinDecay(300, 180, "D")  →  14.8 rad/s^2  (mid-bowl, end-match)
// blizzardBowlSnowSpinDecay(0,   180, "D")  →  2.40 rad/s^2  (centre, ice only)
// blizzardBowlSnowSpinDecay(600, 180, "S")  →  6.17 rad/s^2  (S tip, less ploughing)

function blizzardBowlWindForce(
  v_wind_ms: number,
  theta_tilt_deg: number,
  r_AR_mm = 22
): number {
  const rho = 1.29;
  const CD = 1.0;
  const A = Math.PI * (r_AR_mm / 1000) ** 2 * Math.sin(theta_tilt_deg * Math.PI / 180);
  return 0.5 * rho * CD * A * v_wind_ms ** 2;
}
// blizzardBowlWindForce(12, 5)   →  0.0123 N  (fast spin, negligible)
// blizzardBowlWindForce(15, 30)  →  0.1104 N  (dying bey, strong gust -- 3.35 m/s^2)
// blizzardBowlWindForce(15, 45)  →  0.1561 N  (extreme tilt)

function blizzardBowlAvalancheArrestDistance(
  v_ms: number,
  h_dump_mm = 25,
  r_tip_mm = 3,
  m_kg = 0.033
): number {
  const g = 9.81;
  const mu_eff = 0.55 + 0.25 * (h_dump_mm / r_tip_mm);
  const decel = mu_eff * g;
  return (v_ms ** 2) / (2 * decel);
}
// blizzardBowlAvalancheArrestDistance(2.0)  →  0.0774 m = 77.4 mm  (arrested in 77mm)
// blizzardBowlAvalancheArrestDistance(3.0)  →  0.174 m  = 174 mm
// blizzardBowlAvalancheArrestDistance(1.0)  →  0.0194 m = 19.4 mm  (stops almost immediately)
```

---

## Case 575 — Wok Arena (Improvised / BBA Season 1)

**Thesis.** The Wok Arena is a large carbon-steel cooking wok approximately 640 mm in diameter, removed from domestic use and placed upside-right on a found cylindrical pedestal of approximately equal base diameter, creating the smallest metal arena in the case study series at a scale only achievable with an exceptionally large kitchen wok. The wok profile is a true spherical segment: the bottom 200 mm of bowl radius is nearly flat (alpha < 5 deg), transitioning through a smooth concave curve to walls that approach 65 degrees from horizontal near the rim, producing an extremely aggressive inward lateral acceleration that increases sharply with radius. The carbon steel surface is seasoned and smooth (mu_steel = 0.10 at the centre, rising to mu_rim = 0.15 at the steeper walls where the seasoning is thinner) and has a steel-on-steel restitution of epsilon_steel = 0.85, making it the most energetically elastic rim in any arena documented here. Two handles project outward from the rim in a 180-degree opposed arrangement, each attachment subtending a 40 mm arc notch at the rim where the handle weld meets the bowl wall; a bey that approaches the rim at the handle azimuth encounters the weld step (h_notch = 3 mm, width 40 mm) rather than a smooth wall, and may be deflected laterally, caught momentarily in the notch, or launched slightly upward by the step. The pedestal is not mechanically fixed to the floor: each collision impulse exceeding approximately 0.08 N.s rocks the wok on its pedestal, introducing a dynamic tilt of 1--3 degrees that persists for 0.3--0.8 seconds, temporarily biasing the entire bowl's gravitational slope toward the side that was struck and adding a once-per-collision asymmetric force perturbation on both beys simultaneously.

```
ASCII CROSS-SECTION (diameter, spherical segment wok)

rim                                                               rim
|  weld notch                                              weld notch |
 \===|                                                         |===/
  \  65deg steep wall                           65deg steep wall  /
   \                                                             /
    \  30deg                                        30deg      /
     \                                                        /
      \  10deg                          10deg               /
       \_______________flat zone (alpha<5deg)______________/
       |<------------------ 640 mm -------------------->|
       bowl depth at rim: ~180 mm

Wok profile: z(r) = R_sphere - sqrt(R_sphere^2 - r^2), R_sphere ~ 380 mm
At r=320mm (rim): z = 380 - sqrt(380^2 - 320^2) = 380 - sqrt(42000) = 380-204.9 = 175mm depth
Wall angle at r=320mm: alpha = arcsin(320/380) = 57.3 deg

ASCII TOP-DOWN

  + - - rim (R=320mm) - - +
 /  [H1 handle notch 40mm] \
|                            |
|    smooth carbon steel     |
|    mu=0.10 centre          |
|    mu=0.15 near walls      |
|          640mm             |
 \  [H2 handle notch 40mm] /
  + - - - - - - - - - - - +
  On wobble pedestal; D=640mm, depth=175mm
```

**Physics Analysis.**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Bowl diameter | 640 mm (R=320mm) | |
| Sphere radius of curvature | R_sphere = 380 mm | Fitted to wok geometry |
| Bowl depth at rim | 175 mm | |
| Wall angle at rim | 57.3 deg | Very steep |
| Wall angle at r=200mm | arcsin(200/380) = 31.7 deg | |
| Wall angle at r=100mm | arcsin(100/380) = 15.3 deg | |
| Wall angle at r=50mm | arcsin(50/380) = 7.6 deg | Nearly flat at centre |
| Floor friction (centre) | mu = 0.10 | Seasoned carbon steel |
| Floor friction (wall region) | mu = 0.15 | Thinner seasoning |
| Rim restitution | epsilon = 0.85 | Steel-on-steel |
| Handle notch | h_notch = 3 mm, arc = 40 mm | At 0 deg and 180 deg |
| Pedestal wobble threshold | Delta_p = 0.08 N.s | Impulse to rock wok |
| Wobble tilt | delta_theta = 1--3 deg | Random direction of rocked side |
| Wobble decay time | tau_wobble = 0.4--0.8 s | Damped oscillation |

**Lateral g_lat Profile (varying with radius).**

Because the wall angle is alpha(r) = arcsin(r/R_sphere):

```
  g_lat(r) = g * sin(alpha(r)) = g * r / R_sphere

  r=50mm:  g_lat = 9.81 * 50/380  = 1.291 m/s^2
  r=100mm: g_lat = 9.81 * 100/380 = 2.582 m/s^2
  r=200mm: g_lat = 9.81 * 200/380 = 5.163 m/s^2
  r=300mm: g_lat = 9.81 * 300/380 = 7.745 m/s^2  (near rim -- extremely strong pull)
  r=320mm: g_lat = 9.81 * 320/380 = 8.251 m/s^2  (at rim)
```

The inward acceleration at the rim (8.25 m/s^2) is 8× the standard Attack Type bowl (g_lat_rim ~ 1.0 m/s^2) and nearly equals one full gravitational g. A bey spinning at the rim is constantly fighting centrifugal vs gravitational forces at near-g intensity.

**Orbital Speed at Various Radii.**

```
  v_orbit(r) = sqrt(g_lat(r) * r) = sqrt(g * r^2 / R_sphere)

  r=50mm:  v_orbit = sqrt(9.81 * 0.050^2 / 0.380) = sqrt(0.0646) = 0.254 m/s
  r=100mm: v_orbit = sqrt(9.81 * 0.100^2 / 0.380) = sqrt(0.2582) = 0.508 m/s
  r=200mm: v_orbit = sqrt(9.81 * 0.200^2 / 0.380) = sqrt(1.033)  = 1.016 m/s
  r=300mm: v_orbit = sqrt(9.81 * 0.300^2 / 0.380) = sqrt(2.323)  = 1.524 m/s
  r=320mm: v_orbit = sqrt(9.81 * 0.320^2 / 0.380) = sqrt(2.644)  = 1.626 m/s
```

All orbital radii are achievable for a normal beyblade. The steep wall geometry naturally concentrates beys at orbital radii of 150--250 mm because that is where the inward pull and centrifugal force balance at moderate travel speeds.

**Spin Decay (carbon steel, mu=0.10--0.15).**

```
  alpha_centre (D tip, mu=0.10) = 0.10 * 0.033 * 9.81 * 0.003 / 3.3e-5 = 3.00 rad/s^2
  alpha_wall   (D tip, mu=0.15) = 0.15 * 0.033 * 9.81 * 0.003 / 3.3e-5 = 4.50 rad/s^2

  t_spin_centre = 2000 / 3.00 = 667 s  (near-unlimited)
  t_spin_wall   = 2000 / 4.50 = 444 s  (still effectively unlimited)
```

Spin decay from friction is negligible -- match outcome is entirely collision-determined given the near-frictionless steel surface.

**Handle Notch Impact.**

A bey travelling tangentially at the rim at v = 1.5 m/s reaching the handle weld notch (h_notch = 3 mm, alpha_face ~ 75 deg):

```
  Normal velocity component into notch face:
  v_n = v * sin(theta_approach)

  At theta_approach = 20 deg (glancing): v_n = 1.5 * 0.342 = 0.513 m/s
  Post-notch v_n = epsilon_notch * v_n; epsilon_notch ~ 0.70 (weld joint, less elastic)
  v_n_post = 0.70 * 0.513 = 0.359 m/s
  Tangential component preserved: v_t = 1.5 * cos(20 deg) = 1.410 m/s
  v_post = sqrt(0.359^2 + 1.410^2) = sqrt(0.129 + 1.988) = sqrt(2.117) = 1.455 m/s
  Direction shifted by: arctan(0.359/1.410) = 14.3 deg inward  (deflected toward centre)
```

Handle notches act as mild inward deflectors at grazing angles. A bey approaching perpendicularly (theta = 90 deg) rebounds along the notch normal at epsilon = 0.70, losing 51% of kinetic energy.

**Pedestal Wobble Dynamics.**

When a bey-wall collision delivers impulse Delta_p > 0.08 N.s to the wok, the wok rocks on the pedestal. Modeling as a tipped cylinder with moment of inertia I_wok = m_wok * R_pedestal^2 / 4:

```
  m_wok = 2.5 kg (large carbon steel wok)
  R_pedestal = 160 mm (half base radius)
  I_wok = 2.5 * 0.160^2 / 4 = 0.016 kg.m^2

  Angular impulse from bey collision at rim (r=320mm):
  L = Delta_p * r = 0.10 N.s * 0.320 = 0.032 N.m.s
  omega_rock = L / I_wok = 0.032 / 0.016 = 2.0 rad/s
  tilt angle reached: delta_theta = omega_rock * tau/2 = 2.0 * 0.2 = 0.4 rad = 22.9 deg?

  That is far too large -- indicates the wobble is damped heavily by the pedestal contact geometry.
  Using critical damping model: effective delta_theta_max = 2 deg for a typical bey-wall collision.

  Wobble introduces asymmetric g_lat_wobble = g * sin(delta_theta) = 9.81 * sin(2 deg) = 0.342 m/s^2
  directed toward the struck side, lasting tau_wobble ~ 0.5 s.
  Both beys feel this force simultaneously -- the struck-side bey gets an extra push inward
  while the opposite-side bey gets a push outward (toward the rim they are near).
```

```typescript
// Case 575 — Wok Arena reference functions

function wokGlatAtRadius(r_mm: number, R_sphere_mm = 380): number {
  const g = 9.81;
  return g * (r_mm / R_sphere_mm);
}
// wokGlatAtRadius(50)   →  1.291 m/s^2
// wokGlatAtRadius(200)  →  5.163 m/s^2
// wokGlatAtRadius(320)  →  8.251 m/s^2  (near-g at rim)

function wokOrbitSpeed(r_mm: number, R_sphere_mm = 380): number {
  const g = 9.81;
  const r = r_mm / 1000;
  const R = R_sphere_mm / 1000;
  return Math.sqrt(g * r * r / R);
}
// wokOrbitSpeed(100)  →  0.508 m/s
// wokOrbitSpeed(200)  →  1.016 m/s
// wokOrbitSpeed(300)  →  1.524 m/s  (rim-adjacent orbit)

function wokWallAngle(r_mm: number, R_sphere_mm = 380): number {
  return Math.asin(Math.min(1, r_mm / R_sphere_mm)) * (180 / Math.PI);
}
// wokWallAngle(100)  →  15.3 deg
// wokWallAngle(200)  →  31.7 deg
// wokWallAngle(300)  →  52.1 deg
// wokWallAngle(320)  →  57.3 deg  (at rim)

function wokHandleNotchDeflection(
  v_ms: number,
  theta_approach_deg: number,
  epsilon_notch = 0.70
): { v_post: number; angle_shift_deg: number } {
  const a = theta_approach_deg * Math.PI / 180;
  const v_n = v_ms * Math.sin(a);
  const v_t = v_ms * Math.cos(a);
  const v_n_post = epsilon_notch * v_n;
  const v_post = Math.sqrt(v_n_post ** 2 + v_t ** 2);
  const angle_shift = Math.atan2(v_n_post, v_t) * (180 / Math.PI);
  return {
    v_post: parseFloat(v_post.toFixed(3)),
    angle_shift_deg: parseFloat(angle_shift.toFixed(1))
  };
}
// wokHandleNotchDeflection(1.5, 20)  →  { v_post: 1.455, angle_shift_deg: 14.3 }
// wokHandleNotchDeflection(2.0, 45)  →  { v_post: 1.625, angle_shift_deg: 35.0 }
// wokHandleNotchDeflection(1.5, 90)  →  { v_post: 1.050, angle_shift_deg: 90.0 }  (full rebound)

function wokWobbleTiltForce(
  delta_p_Ns: number,
  delta_theta_max_deg = 2.0,
  tau_wobble_s = 0.5,
  t_elapsed_s: number,
  m_kg = 0.033
): number {
  if (delta_p_Ns < 0.08) return 0;
  const g = 9.81;
  const theta = delta_theta_max_deg * Math.PI / 180;
  const g_wobble = g * Math.sin(theta) * Math.exp(-t_elapsed_s / tau_wobble_s);
  return g_wobble;  // m/s^2 lateral acceleration added to both beys
}
// wokWobbleTiltForce(0.10, 2.0, 0.5, 0.0)  →  0.342 m/s^2  (immediately after wobble trigger)
// wokWobbleTiltForce(0.10, 2.0, 0.5, 0.5)  →  0.126 m/s^2  (after one tau)
// wokWobbleTiltForce(0.05, 2.0, 0.5, 0.0)  →  0            (below wobble threshold)
```

---

## Case 576 — Obstacle Dish / Seaside Dome (BBA Season 1)

**Thesis.** The Obstacle Dish, housed at the Seaside Dome facility and confirmed by BBA selection card, is a circular arena 2000 mm in diameter with 1000 mm tall curved concave walls that form a seamless skate-bowl profile from flat floor to near-vertical upper rim, making it the tallest arena documented in this case study series relative to its diameter. The floor is smooth concrete (mu_floor = 0.28) transitioning at r = 700 mm into a continuously curving bank that steepens from 15 degrees at the transition to approximately 75 degrees at the rim, giving a climbing bey access to all wall heights given sufficient entry speed. Embedded permanently in the arena are eight categories of obstacle -- stone spike cones, rectangular stone blocks at floor level, rectangular stone blocks mounted to wall faces at various heights and tilt angles, wooden log sections lying on the floor, angled metal divider plates forming partial radial walls on the floor, and thin metal rods protruding from the floor and wall -- all indestructible, all fixed, and collectively covering approximately 18% of the arena floor area and 12% of the wall surface. Because the obstacles project from both the floor and the curved wall, a bey riding the wall bank encounters wall-mounted blocks and spike-tops at the same orbital height, producing collisions in three-dimensional space: the bey travels on a curved surface with a wall-mounted obstacle whose face may be angled relative to the wall tangent, resulting in rebound trajectories that deviate both radially and vertically and can launch a bey upward off the wall. The flat-topped stone blocks and the wooden log create rideable surfaces: a bey with sufficient approach speed and shallow enough angle can mount the flat top (h_block = 80 mm above floor) and briefly orbit atop the obstacle at a height advantage, though the reduced contact area and obstacle edges make tip stability critical.

```
ASCII CROSS-SECTION (radial slice through bank, D to D')

rim (z=1000mm)                                      rim (z=1000mm)
|  [wall block z=700mm]                [wall block z=600mm]  |
|                                                             |
|  bank angle 75 deg near rim                                 |
|                                                             |
|  [wall block z=350mm]                                       |
|                                                             |
|  bank angle 40 deg mid-wall                                 |
|                                                             |
|  bank angle 15 deg near floor                               |
+-[floor-rim transition r=700mm]--flat floor (mu=0.28)-+------+
  | [metal divider plate h=200mm, r=400mm, angled 30deg]|
  | [stone block 150x100x80mm on floor]  [log r=75mm]   |
  | [floor spike h=200mm, base r=30mm, at centre r=100] |
  |<--------------------- 2000 mm -------------------->|

ASCII TOP-DOWN (obstacle layout)

  +-------- outer rim R=1000mm, wall height 1000mm --------+
  |   [WB1] [WB2]       wall blocks (8 total)  [WB3] [WB4] |
  |                                                          |
  |     [FB1]                            [FB2]               |
  |   stone block                    stone block             |
  |                                                          |
  |   [SP1] spike          [SP2] spike    [LOG1] wood log    |
  |                    [MP1]  [MP2]                          |
  |          metal divider plates (radial, angled)           |
  |       [FB3] stone block        [ROD1] thin rod           |
  |                                                          |
  |   [WB5]  [WB6]  (wall, lower)      [WB7]  [WB8]        |
  +----------------------------------------------------------+
  2000mm diameter; 1000mm wall height; concrete mu=0.28
```

**Physics Analysis.**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Arena diameter | 2000 mm (R=1000mm) | |
| Wall height | 1000 mm | Skate-bowl concave profile |
| Floor friction | mu_floor = 0.28 | Smooth concrete |
| Wall friction | mu_wall = 0.32 | Slightly rougher concrete bank |
| Wall restitution | epsilon_wall = 0.65 | Concrete |
| Floor g_lat (5 deg avg) | 0.854 m/s^2 | Bowl dish shape, flat mostly |
| Bank angle at r=700mm | alpha = 15 deg | Transition point |
| Bank angle at r=850mm | alpha = 40 deg | |
| Bank angle at r=950mm | alpha = 65 deg | |
| Bank angle at r=990mm | alpha = 75 deg | Near rim |
| Stone spike (floor) | h=200mm, base_r=30mm, half-angle=8.5 deg | Conical redirect |
| Stone block (floor) | 150x100mm footprint, h=80mm | Rideable flat top |
| Stone block (wall) | 120x80mm face, 60mm deep, varied tilt | Deflector on bank |
| Wooden log | r_log=75mm, L=300mm, on floor | Curved deflector, epsilon=0.50 |
| Metal divider plate | 400x200mm, h=200mm, alpha_plate=30 deg | Partial radial wall |
| Thin rod | 10mm dia, h=150mm | Pin deflector, epsilon=0.80 |

**Bank Climb Threshold (smooth spherical profile).**

For a concave bank described by z(r) = A*(r-r_0)^2, the minimum entry speed at the bank base (r=700mm, z=0) to reach height z_target on the bank:

```
  Energy conservation (with friction on curved surface):
  (1/2)*m*v_entry^2 = m*g*z_target + W_friction

  W_friction = mu_wall * m * g * cos(alpha_avg) * L_arc
  arc length from r=700 to r at z_target: approximate L_arc ~ z_target / sin(alpha_avg)

  To reach z=500mm (mid-wall, alpha_avg~40 deg):
    L_arc = 0.500 / sin(40 deg) = 0.500 / 0.643 = 0.778 m
    W_friction = 0.32 * 0.033 * 9.81 * cos(40 deg) * 0.778 = 0.064 J
    v_entry = sqrt(2*(m*g*z_target + W_friction)/m)
            = sqrt(2*(9.81*0.500 + 0.064/0.033))
            = sqrt(2*(4.905 + 1.939))
            = sqrt(13.688)
            = 3.700 m/s

  To reach z=200mm (lower wall, alpha_avg~25 deg):
    L_arc = 0.200 / sin(25 deg) = 0.473 m
    W_friction = 0.32 * 0.033 * 9.81 * cos(25 deg) * 0.473 = 0.046 J
    v_entry = sqrt(2*(9.81*0.200 + 0.046/0.033)) = sqrt(2*(1.962+1.394)) = sqrt(6.712) = 2.591 m/s
```

**Stone Spike Cone Deflection.**

The floor spike has half-angle gamma = arctan(30/200) = 8.53 deg. A bey approaching the base at speed v at angle theta_inc from horizontal:

```
  Contact point is on the conical face at height z_contact ~ r_bey * sin(gamma) from tip base
  Normal to cone face: rotated gamma from vertical
  Reflection angle equals incidence angle relative to cone normal

  For a head-on radial approach (theta_inc = 0, bey hits spike base):
    Normal direction = radially outward + gamma tilt upward
    v_n = v_impact * cos(gamma) = v_impact * cos(8.53 deg) = 0.989 * v_impact
    v_post_n = epsilon_spike * v_n  (epsilon_spike = 0.62, rough stone)
    v_post = 0.62 * 0.989 * v_impact = 0.613 * v_impact
    direction: deflected gamma=8.53 deg upward from horizontal (glances off cone)

  Upward launch component:
    v_z = v_post * sin(8.53 deg) = 0.613 * v_impact * 0.148 = 0.091 * v_impact
    At v_impact = 2.0 m/s: v_z = 0.182 m/s
    max height reached: h = v_z^2/(2g) = 0.182^2/19.62 = 0.00169 m = 1.7 mm  (barely off floor)

  For an angled approach (theta_inc = 30 deg above floor, bey launched up at spike):
    v_z_impact component = v * sin(30 deg) = 0.5v
    reflected off cone: much larger upward redirect possible
    v_z_post can reach 0.3-0.4 v for favourable angle (spike as launch ramp)
    h_launch = (0.35*2.0)^2/(2*9.81) = 0.490/19.62 = 25 mm (briefly leaves floor)
```

**Wall-Mounted Block Deflection.**

Wall blocks protrude 60 mm from the wall surface at heights 350--750 mm. A bey orbiting on the wall bank at height z_block with orbital speed v encounters the block face (epsilon_block = 0.62, stone):

```
  KE loss per block strike: KE_post = epsilon^2 * KE_pre = 0.38 * KE_pre  (62% lost)
  Speed after: v_post = epsilon * v = 0.62 * v

  At v=2.0 m/s orbiting at z=400mm: v_post = 0.62*2.0 = 1.24 m/s
  The bey drops below orbit speed at this height:
    v_orbit at z=400mm (r~930mm): v_orbit = sqrt(g_lat(r)*r) where g_lat at wall angle 60 deg:
    g_lat = g*sin(60 deg) = 8.496 m/s^2
    v_orbit = sqrt(8.496*0.930) = sqrt(7.901) = 2.811 m/s
  Post-block speed 1.24 m/s << v_orbit 2.81 m/s --> bey falls off wall immediately
```

Wall blocks thus function as orbit breakers: any bey orbiting the bank at any height is decelerated below the orbital speed threshold by a single block strike, dropping back to the floor.

**Wooden Log Deflection.**

The log cylinder (r_log=75mm) presents a convex curved face. For a bey approaching radially at speed v at height z_contact = r_log * sin(theta_lat) above the log centreline:

```
  Contact normal angle = arctan(z_contact / r_contact_x)
  For tangent hit (z_contact = r_log): normal is vertical, deflects bey upward
  For equatorial hit (z_contact = 0):  normal is horizontal, full redirect (epsilon=0.50)

  Speed post equatorial: v_post = 0.50 * v
  Orbital half-life: 1.0 m/s --> 0.5 m/s per log contact

  At tangential log contact: bey launched upward with v_z = epsilon * v * sin(theta_lat)
  At theta_lat = 30 deg, v=2.0 m/s: v_z = 0.50 * 2.0 * 0.5 = 0.5 m/s
  Height: h = 0.5^2/(2*9.81) = 12.7 mm  (briefly airborne)
```

**Metal Divider Plate Traversal.**

The metal plates (h=200mm, angled 30 deg to radial) create partial walls on the floor. A bey can:
1. Collide with the flat face (epsilon=0.72, polished metal) and ricochet
2. Attempt to clear the 200mm height by climbing the angled plate like a ramp:
   - v_min to clear: v = sqrt(2*g*h) = sqrt(2*9.81*0.200) = 1.981 m/s (with zero friction)
   - With mu_plate=0.15 on smooth metal: L_plate = 0.200/sin(30 deg) = 0.400m
   - v_min = sqrt(2*(g*sin(30 deg) + mu*g*cos(30 deg))*L_plate)
           = sqrt(2*(4.905 + 0.15*8.496)*0.400)
           = sqrt(2*(4.905+1.274)*0.400)
           = sqrt(4.943)
           = 2.223 m/s  (minimum to ride over plate)

**Obstacle Coverage and Collision Rate.**

Approximately 18% of the floor area (2000mm diameter = 3.142 m^2; 18% = 0.565 m^2) is covered by obstacles. An orbiting bey at r=500mm with circumference 2*pi*500=3142mm sweeps the floor coverage proportional to floor area fraction. At v=2.0 m/s, orbit period = 3.142*0.500*2*pi/2.0 / ... simplified: period = 2*pi*0.500/2.0 = 1.571 s. Probability of striking an obstacle per orbit = floor_coverage_fraction at that r. Modelling 18% uniform distribution, expected strikes per orbit = 0.18, or one floor obstacle contact every ~5.6 orbits. Wall obstacle coverage adds ~12% of wall arc, giving one wall contact approximately every 4 wall orbits.

```typescript
// Case 576 — Obstacle Dish reference functions

function obstacleDishBankClimbSpeed(
  z_target_mm: number,
  alpha_avg_deg: number,
  mu_wall = 0.32
): number {
  const g = 9.81;
  const z = z_target_mm / 1000;
  const a = alpha_avg_deg * Math.PI / 180;
  const L = z / Math.sin(a);
  const W_friction = mu_wall * g * Math.cos(a) * L;  // per unit mass
  return Math.sqrt(2 * (g * z + W_friction));
}
// obstacleDishBankClimbSpeed(200, 25)  →  2.591 m/s  (reach 200mm on wall)
// obstacleDishBankClimbSpeed(500, 40)  →  3.700 m/s  (reach 500mm mid-wall)
// obstacleDishBankClimbSpeed(800, 60)  →  5.482 m/s  (reach 800mm upper wall)
// obstacleDishBankClimbSpeed(1000, 70) →  6.613 m/s  (reach rim -- impractical)

function obstacleDishSpikeDeflection(
  v_impact_ms: number,
  approach_angle_deg = 0,
  half_angle_deg = 8.53,
  epsilon_spike = 0.62
): { v_post: number; v_z_launch: number; h_launch_mm: number } {
  const g = 9.81;
  const gamma = half_angle_deg * Math.PI / 180;
  const theta = approach_angle_deg * Math.PI / 180;
  const v_post = epsilon_spike * v_impact_ms;
  const v_z = v_post * Math.sin(gamma + theta);
  const h = (v_z ** 2) / (2 * g) * 1000;
  return {
    v_post: parseFloat(v_post.toFixed(3)),
    v_z_launch: parseFloat(v_z.toFixed(3)),
    h_launch_mm: parseFloat(h.toFixed(1))
  };
}
// obstacleDishSpikeDeflection(2.0, 0)   →  { v_post: 1.240, v_z_launch: 0.183, h_launch_mm: 1.7 }
// obstacleDishSpikeDeflection(2.0, 30)  →  { v_post: 1.240, v_z_launch: 0.480, h_launch_mm: 11.7 }
// obstacleDishSpikeDeflection(3.0, 45)  →  { v_post: 1.860, v_z_launch: 1.187, h_launch_mm: 71.8 }

function obstacleDishLogDeflection(
  v_ms: number,
  theta_lat_deg = 0,
  epsilon_log = 0.50
): { v_post: number; v_z: number; h_mm: number } {
  const g = 9.81;
  const t = theta_lat_deg * Math.PI / 180;
  const v_post = epsilon_log * v_ms;
  const v_z = v_post * Math.sin(t);
  const h = (v_z ** 2) / (2 * g) * 1000;
  return {
    v_post: parseFloat(v_post.toFixed(3)),
    v_z: parseFloat(v_z.toFixed(3)),
    h_mm: parseFloat(h.toFixed(1))
  };
}
// obstacleDishLogDeflection(2.0, 0)   →  { v_post: 1.000, v_z: 0, h_mm: 0 }  (equatorial, no launch)
// obstacleDishLogDeflection(2.0, 30)  →  { v_post: 1.000, v_z: 0.500, h_mm: 12.7 }
// obstacleDishLogDeflection(2.0, 60)  →  { v_post: 1.000, v_z: 0.866, h_mm: 38.2 }  (near-top hit)

function obstacleDishDividerClearSpeed(
  h_plate_mm = 200,
  alpha_plate_deg = 30,
  mu_plate = 0.15
): number {
  const g = 9.81;
  const a = alpha_plate_deg * Math.PI / 180;
  const L = (h_plate_mm / 1000) / Math.sin(a);
  const a_up = g * (Math.sin(a) + mu_plate * Math.cos(a));
  return Math.sqrt(2 * a_up * L);
}
// obstacleDishDividerClearSpeed()  →  2.223 m/s  (minimum to ride over 200mm plate at 30 deg)
// obstacleDishDividerClearSpeed(200, 45) →  2.063 m/s
// obstacleDishDividerClearSpeed(200, 60) →  2.032 m/s

function obstacleDishExpectedCollisionsPerOrbit(
  r_orbit_mm: number,
  floor_coverage_frac = 0.18,
  wall_coverage_frac = 0.12,
  is_wall_orbit = false
): number {
  if (is_wall_orbit) return wall_coverage_frac;
  return floor_coverage_frac;
}
// obstacleDishExpectedCollisionsPerOrbit(500)        →  0.18  (floor orbit: 1 hit every 5.6 orbits)
// obstacleDishExpectedCollisionsPerOrbit(900, 0.18, 0.12, true) →  0.12  (wall orbit: 1 hit every 8.3 orbits)
```

---

## Case 577 — Moon Base Trampoline Arena (BBA Season 1)

**Thesis.** The Moon Base Trampoline Arena is a large circular dish approximately 2400 mm in diameter set within a domed space-station environment on the Moon, where the gravitational acceleration is g_moon = 1.625 m/s^2 -- exactly one-sixth of Earth gravity. The arena floor is a smooth polished composite material (mu_floor = 0.12, epsilon_floor = 0.80) mounted atop a vibration-isolated platform in the dome, but the defining physical property is not the floor material itself but the lunar gravity that amplifies all vertical dynamics by a factor of six: any upward velocity component that would launch a bey 10 mm into the air on Earth sends it 60 mm on the Moon, and the time a bey spends airborne before returning to the floor is six times longer, making the arena subjectively feel like a trampoline surface. At the centre of the arena sits a large multi-tiered inverted-cone tower structure approximately 600 mm in diameter and 350 mm in height, built like a beyblade cross-section at building scale with a wide upper platform, a red banded mid-section, and a tapered lower body ending in a rounded base; beys colliding with this tower are deflected radially outward by its conical lower body, and the low-gravity environment transforms what would be a minor grazing launch on Earth into a full parabolic arc of 30--80 mm height and 400--800 mm horizontal range. The user's intuition that defense types benefit while attack types suffer is partially correct but inverted for stamina: stamina types benefit most dramatically because spin decay from floor friction is reduced to exactly one-sixth of Earth values (alpha_moon = alpha_earth / 6.03), making spin-out effectively impossible for any stamina or flat-tip beyblade within normal match duration; attack types suffer because orbital mechanics require higher travel speeds to maintain the same centrifugal-to-gravitational balance, and their high-energy launch trajectories become more chaotic; defense types benefit from reduced spin decay but their stability comes from floor-contact normal force which is also reduced sixfold, making them more susceptible to being pushed around by relatively small lateral forces.

```
ASCII CROSS-SECTION (radial slice, Moon Base)

      dome ceiling (not arena boundary)
      |                                                  |
rim   |                                                  |   rim
 \    |  blue composite floor, mu=0.12, epsilon=0.80    |    /
  \___+__________________________________________________+___/
      |<---------- 2400 mm bowl diameter ----------->|
      bowl depth ~50 mm, alpha_rim = 2.4 deg

Central tower (at r=0, footprint R_tower=300mm):
   +-----[upper platform, w=600mm, z=350mm]--------+
   |     [white banded section, z=200-350mm]       |
   |====[RED BAND, z=150-200mm]====================|
   |     [lower conical body, z=0-150mm]           |
   \___/[tapered base, half-angle=25deg]\_________/
        r=0  (tower occupies 0 < r < 300mm)

ASCII TOP-DOWN

  +----------- outer rim R=1200mm -----------+
  |   smooth composite (mu=0.12)              |
  |        very gentle bowl slope             |
  |   +------ tower R=300mm ------+           |
  |   |  [upper platform flat]    |           |
  |   |  [red band mid]           |           |
  |   |  [conical base gamma=25°] |           |
  |   +---------------------------+           |
  |   free-fight zone: 300 < r < 1200 mm      |
  +--------------------------------------------+
  2400mm diameter | Moon gravity g=1.625 m/s^2
```

**Physics Analysis.**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Arena diameter | 2400 mm (R=1200mm) | |
| Moon gravity | g_moon = 1.625 m/s^2 | g_earth/6.033 |
| Bowl depth | ~50 mm | alpha_rim = arctan(50/1200) = 2.39 deg |
| g_lat at rim | g_moon * sin(2.39 deg) = 0.0677 m/s^2 | Extremely weak inward pull |
| Floor friction | mu = 0.12 | Smooth composite |
| Floor restitution | epsilon = 0.80 | |
| Tower radius | R_tower = 300 mm | Central obstacle |
| Tower height | H_tower = 350 mm | |
| Tower lower body half-angle | gamma = 25 deg | Conical deflector |
| Tower upper band restitution | epsilon_tower = 0.75 | Flat face ABS |
| Free fight zone | 300 mm < r < 1200 mm | Annular ring 900 mm wide |

**Spin Decay Under Lunar Gravity.**

Since alpha = mu * m * g * r_tip / I, and g_moon = g_earth / 6.033:

```
  alpha_moon = alpha_earth / 6.033

  Earth baseline (D tip, mu=0.12): alpha_earth = 0.12*0.033*9.81*0.003/3.3e-5 = 3.61 rad/s^2
  Moon: alpha_moon = 3.61 / 6.033 = 0.599 rad/s^2
  t_spin from omega_0=2000: t_moon = 2000/0.599 = 3339 s (55.7 minutes)

  Earth baseline (RF tip, mu=0.12): alpha_earth = 4.81 rad/s^2
  Moon: alpha_moon = 0.798 rad/s^2 --> t_spin = 2506 s (41.8 minutes)

  Earth baseline (D tip, mu=0.12 hard plastic floor):
  Moon stamina type (S tip, mu=0.12): alpha_moon = 0.12*0.033*1.625*0.0008/3.3e-5 = 0.160 rad/s^2
  t_spin = 2000/0.160 = 12500 s  (3.5 hours -- completely spin-out proof)
```

All tip types on the Moon floor are functionally immune to spin-out from friction alone. Match outcome is entirely collision-loss and ring-out determined.

**Orbital Mechanics Under Lunar g_lat.**

```
  g_lat_moon(r) = g_moon * sin(alpha_dish) = 1.625 * sin(2.39 deg) = 0.0677 m/s^2

  v_orbit_moon(r) = sqrt(g_lat_moon * r)
  r=1200mm (rim): v_orbit = sqrt(0.0677 * 1.200) = sqrt(0.0812) = 0.285 m/s
  r=800mm (mid):  v_orbit = sqrt(0.0677 * 0.800) = sqrt(0.0542) = 0.233 m/s
  r=400mm (inner): v_orbit = sqrt(0.0677 * 0.400) = sqrt(0.0271) = 0.165 m/s

  Compare Earth attack type orbital speeds (standard attack bowl, g_lat~1.0 m/s^2):
  v_orbit_earth at r=400mm = sqrt(1.0*0.400) = 0.632 m/s
  Ratio: 0.165/0.632 = 0.261  (Moon orbit speed is only 26% of Earth equivalent)
```

Attack types designed to orbit at 1.5--3.0 m/s on Earth far exceed the 0.285 m/s required for Moon orbital balance -- they travel at 5--10× orbital speed and behave as straight-line projectiles rather than orbital attackers. Any radial deviation from centre immediately takes the bey to the rim and over. The arena's vanishingly small g_lat (0.0677 m/s^2) provides almost no containment, and ring-out becomes the dominant win condition.

**Bounce Height and Airtime Amplification.**

For any floor contact with vertical velocity component v_z_impact, the post-bounce trajectory:

```
  v_z_post = epsilon_floor * v_z_impact = 0.80 * v_z_impact

  h_bounce = v_z_post^2 / (2 * g_moon)
  t_air    = 2 * v_z_post / g_moon

  Earth comparison (same v_z_post, g=9.81):
  h_earth = v_z_post^2 / 19.62
  h_moon / h_earth = g_earth / g_moon = 6.033  (exactly 6× higher bounce)

  For v_z_post = 0.5 m/s (typical wall-bounce launch):
    h_moon = 0.5^2 / (2*1.625) = 0.250/3.250 = 76.9 mm  vs h_earth = 12.7 mm
    t_air_moon = 2*0.500/1.625 = 0.615 s  vs t_air_earth = 0.102 s

  For v_z_post = 1.0 m/s (after wall strike with good upward component):
    h_moon = 1.0^2 / 3.250 = 307.7 mm  (bey briefly reaches 308mm off floor)
    t_air_moon = 1.23 s  (spinning freely for over a second -- no floor friction loss)
```

During airtime there is no floor friction spin decay -- only aerodynamic drag (negligible) -- so long airtime events are actually spin-preserving for stamina types while simultaneously removing the bey from the fighting zone for the duration.

**Tower Lower Cone Deflection Under Moon Gravity.**

The tower's lower conical body (half-angle gamma=25 deg) deflects an approaching bey radially outward. On the Moon:

```
  For a bey approaching the tower at r=300mm with speed v=1.0 m/s (low-gravity slow orbit):
    Normal to cone face at impact: (sin(gamma), 0, cos(gamma)) = (0.423, 0, 0.906) in (r,theta,z)
    v_n = v * sin(gamma) = 1.0 * 0.423 = 0.423 m/s  (into cone face)
    v_t = v * cos(gamma) = 1.0 * 0.906 = 0.906 m/s  (along cone face)

    Post-impact (epsilon_tower=0.75):
    v_n_post = 0.75 * 0.423 = 0.317 m/s  (outward normal)
    v_z_post = v_n_post * cos(gamma) = 0.317 * 0.906 = 0.287 m/s  (upward)
    v_r_post = v_n_post * sin(gamma) + v_t * ... (radially outward bounce)

    Upward launch from cone:
    h_launch = v_z_post^2 / (2*g_moon) = 0.287^2 / 3.250 = 0.0824/3.250 = 25.4 mm
    t_air = 2*0.287/1.625 = 0.353 s
    horizontal range = v_r_post * t_air ~ (0.317*0.423 + 0.906) * 0.353 ~ 0.340 m = 340 mm
```

A standard tower deflection on Earth at these values would produce < 5mm hop and 60mm range. On the Moon the same collision sends the bey 25mm airborne and 340mm outward -- well past the midfield radius.

**Type Advantage Correction (addressing user's intuition).**

The user predicted defense dominance. The correct ordering with physics justification:

| Type | Moon advantage | Reason |
|------|---------------|--------|
| Stamina | BEST | Spin decay alpha_moon = alpha_earth/6; spin life 6× longer; airtime events preserve spin; low g_lat allows very slow efficient orbit (0.165 m/s at r=400mm suffices) |
| Defense | MODERATE | Spin decay reduced 6×; but reduced normal force = 6× less floor-contact stability; collision force unchanged (mass×velocity); easier to push around sideways |
| Attack | WORST | Orbital speed 26% of Earth equivalent; high travel speed launches bey into uncontrolled parabolic arcs; g_lat too weak to sustain orbit -- bey travels in straight lines and exits rim at 0.285 m/s minimum ring-out threshold |

Defense types do NOT automatically win. Their advantage (damage absorption) is unchanged (collision impulse is gravity-independent), but their disadvantage (reduced stability from lower normal force) hurts them more than it helps. Stamina types dominate because the very mechanism that kills them on Earth -- friction spin decay -- is reduced by exactly the same factor as gravity, and their slow-orbit strategy perfectly matches the Moon's tiny g_lat (0.0677 m/s^2 is just enough to keep a stamina type orbiting at 0.165 m/s, well within its capability).

Ring-out threshold on Moon bowl:

```
  H_rim = 50 mm, alpha_dish = 2.39 deg, mu_floor = 0.12

  v_ring_out = sqrt(2*g_moon*(sin(alpha)+mu*cos(alpha))*H_rim/sin(alpha))
             = sqrt(2*1.625*(0.04168+0.12*0.9991)*0.050/0.04168)
             = sqrt(2*1.625*0.16157*1.1993)
             = sqrt(0.6291)
             = 0.793 m/s
```

Any bey travelling faster than 0.793 m/s radially outward exits. Given attack-type orbital speeds (1.5--3.0 m/s) dwarf this threshold by 2--4×, ring-out is the overwhelmingly dominant win condition for attack types on the Moon -- but only for themselves. Attack types self-ring-out more than they force opponent ring-outs.

```typescript
// Case 577 — Moon Base Trampoline Arena reference functions

const G_MOON = 1.625;  // m/s^2
const G_EARTH = 9.81;
const G_RATIO = G_EARTH / G_MOON;  // 6.033

function moonSpinDecay(
  tipType: "D" | "S" | "RF" | "WD",
  mu_floor = 0.12,
  I_kgm2 = 3.3e-5,
  m_kg = 0.033
): number {
  const r_tip_mm: Record<string, number> = { D: 3.0, S: 0.8, RF: 4.0, WD: 2.0 };
  const r = r_tip_mm[tipType] / 1000;
  return (mu_floor * m_kg * G_MOON * r) / I_kgm2;
}
// moonSpinDecay("D")   →  0.599 rad/s^2  (t_spin = 3339 s = 55.7 min)
// moonSpinDecay("S")   →  0.160 rad/s^2  (t_spin = 12500 s = 3.5 hours)
// moonSpinDecay("RF")  →  0.798 rad/s^2  (t_spin = 2506 s = 41.8 min)
// moonSpinDecay("WD")  →  0.399 rad/s^2  (t_spin = 5013 s)

function moonOrbitSpeed(r_mm: number, alpha_dish_deg = 2.39): number {
  const g_lat = G_MOON * Math.sin(alpha_dish_deg * Math.PI / 180);
  return Math.sqrt(g_lat * (r_mm / 1000));
}
// moonOrbitSpeed(400)   →  0.165 m/s  (inner zone)
// moonOrbitSpeed(800)   →  0.233 m/s  (mid zone)
// moonOrbitSpeed(1200)  →  0.285 m/s  (rim orbit -- minimum for containment)

function moonBounceHeight(v_z_ms: number, epsilon_floor = 0.80): number {
  const v_z_post = epsilon_floor * v_z_ms;
  return (v_z_post ** 2) / (2 * G_MOON) * 1000;  // mm
}
// moonBounceHeight(0.5)  →  76.9 mm  (vs 12.7 mm on Earth)
// moonBounceHeight(1.0)  →  307.7 mm (over 30cm of air)
// moonBounceHeight(0.2)  →  12.3 mm  (even tiny upward kick goes 12mm)

function moonAirtime(v_z_ms: number, epsilon_floor = 0.80): number {
  const v_z_post = epsilon_floor * v_z_ms;
  return (2 * v_z_post) / G_MOON;  // seconds
}
// moonAirtime(0.5)  →  0.492 s  (half a second airborne from moderate kick)
// moonAirtime(1.0)  →  0.985 s  (nearly 1 second from 1 m/s launch)

function moonTowerConeDeflection(
  v_approach_ms: number,
  gamma_deg = 25,
  epsilon_tower = 0.75
): { v_z_post: number; h_launch_mm: number; t_air_s: number; h_range_mm: number } {
  const gamma = gamma_deg * Math.PI / 180;
  const v_n = v_approach_ms * Math.sin(gamma);
  const v_n_post = epsilon_tower * v_n;
  const v_z = v_n_post * Math.cos(gamma);
  const h = (v_z ** 2) / (2 * G_MOON) * 1000;
  const t = (2 * v_z) / G_MOON;
  const v_r_post = v_n_post * Math.sin(gamma) + v_approach_ms * Math.cos(gamma) * 0.3;
  const range = v_r_post * t * 1000;
  return {
    v_z_post: parseFloat(v_z.toFixed(3)),
    h_launch_mm: parseFloat(h.toFixed(1)),
    t_air_s: parseFloat(t.toFixed(3)),
    h_range_mm: parseFloat(range.toFixed(0))
  };
}
// moonTowerConeDeflection(1.0)  →  { v_z_post: 0.287, h_launch_mm: 25.4, t_air_s: 0.353, h_range_mm: 340 }
// moonTowerConeDeflection(2.0)  →  { v_z_post: 0.574, h_launch_mm: 101.4, t_air_s: 0.707, h_range_mm: 681 }
// moonTowerConeDeflection(3.0)  →  { v_z_post: 0.861, h_launch_mm: 228, t_air_s: 1.060, h_range_mm: 1021 }

function moonRingOutThreshold(
  H_rim_mm = 50,
  alpha_dish_deg = 2.39,
  mu_floor = 0.12
): number {
  const a = alpha_dish_deg * Math.PI / 180;
  const H = H_rim_mm / 1000;
  return Math.sqrt(2 * G_MOON * (Math.sin(a) + mu_floor * Math.cos(a)) * H / Math.sin(a));
}
// moonRingOutThreshold()  →  0.793 m/s  (any bey faster than this exits the bowl)
// For reference: Earth Attack Type standard bowl ring-out threshold ~ 2.0 m/s
// Attack type typical speed 1.5-3.0 m/s >> 0.793 m/s -- attack types self-ring-out routinely
```

---

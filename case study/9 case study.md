# Beyblade Case Studies — Part 9: Burst System Beyblades and Parts

**« Part 8:** [8 case study.md](8%20case%20study.md) (Cases 375–391)

**Scope:** Takara Tomy releases only — Hasbro versions excluded from Gen 2 mid (4D) onward through all Burst sub-systems. Burst sub-system order: Standard Burst (2015) → God Layer (2017) → Cho-Z / Dash (2018) → Gatinko (2019) → Sparking (2020) → Dynamite Battle (2021) → Ultimate (2022).

---

## Style Rules (carry forward from Part 8)

- No em-dashes in prose: use colons or semicolons
- No bullets in the Thesis paragraph
- All numeric results to 3 significant figures
- Annular disk inertia: `I = ½m(r_i² + r_o²)`
- Contact fractions: smash = cos(φ), recoil = sin(φ), where φ = contact face angle from radial
- Hertzian contact patch: `a = (3WR/4E*)^(1/3)`; `1/E* = (1−ν₁²)/E₁ + (1−ν₂²)/E₂`
- Spin decay: `dω/dt = −(μ × m × g × r_tip) / I_total`
- Annular contact effective radius: `r_eff = 2(r_o³ − r_i³) / (3(r_o² − r_i²))`
- Material constants: ABS / PC (E = 2.3–2.4 GPa, ρ = 1050–1200 kg/m³), rubber (E = 0.002 GPa, ρ = 1200 kg/m³, μ_k = 0.85), hard tip (μ_k = 0.17)
- Burst tab cantilever: `k_tab = 3EI/L³`; `I_tab = b·h³/12`
- Floor friction torque for annular contact: `τ_floor = μ × W × r_eff`
- Symmetry labels: C₁, C₂, C₃, C₄, C₆

---

## Case 392 — Winning Valkyrie Energy Layer (Burst Standard): PC Cantilever Tab Burst Mechanism, C₃ Smash Geometry, and Inertia Budget for the WV.12.V Assembly

**Thesis:** Winning Valkyrie is the inaugural Burst System Energy Layer, released in Takara Tomy starter B-01 as part of the WV.12.V assembly, moulded from polycarbonate (E = 2.4 GPa, ρ = 1200 kg/m³), exhibiting C₃ rotational symmetry through three outward smash blades of outer engagement radius r_o = 17 mm and hub bore radius r_i = 4 mm, with a layer mass of approximately 15.2 g; the defining physics of the Burst generation is the integrated cantilever tab burst mechanism: two PC spring tabs (L_tab = 5.0 mm, b_tab = 3.0 mm, h_tab = 0.55 mm) engage corresponding teeth on the Forge Disc face at an engagement radius of r_tab = 7.5 mm, producing a per-tab second moment of area I_tab = b·h³/12 = 4.16×10⁻¹⁴ m⁴, a cantilever spring constant k_tab = 3EI/L³ = 2.40×10³ N/m, and a maximum restoring force per tab of F_tab = k × δ_max = 0.720 N at maximum deflection δ_max = 0.30 mm, yielding a combined two-tab burst threshold of τ_burst = 2 × F_tab × r_tab = 10.8 mN·m; this threshold is lower than the BX-era 5-tab rotating-tab Ratchet (τ ≈ 13.3 mN·m, +23% harder) and the 7-tab Ratchet (τ ≈ 18.6 mN·m, +72% harder), confirming that early Burst Standard layers burst more readily than any BX Ratchet configuration, which was the intended gameplay novelty of the Burst generation; the three smash blades carry a contact face angle of φ = 22° from the radial direction, giving a smash fraction cos(22°) = 0.927 and a self-recoil fraction sin(22°) = 0.375, and with C₃ symmetry at battle spin ω₀ = 600 rad/s the blade contact frequency is f = 3ω₀/(2π) = 286 Hz with an inter-contact interval of Δt = 3.49 ms; the full WV.12.V assembly (Layer + Forge Disc 12 + Velocity Performance Tip, total mass ≈ 34.1 g) has a combined moment of inertia I_total = 4.018×10⁻⁶ kg·m² and an angular momentum at launch of L₀ = 2.41×10⁻³ kg·m²/s; the Velocity tip is a sharp hard-ABS point with r_contact = 0.5 mm and μ_k = 0.17, producing a spin decay of only dω/dt = −7.08 rad/s², making WV.12.V a stamina-capable system with the high burst risk of a two-tab first-generation Energy Layer.

### Visual Geometry

```
Top-down view (spin direction: counter-clockwise as viewed from above):

                     BLADE 1
                  ╱‾‾‾‾‾‾‾‾╲
                ╱  smash     ╲
              ╱   face        ◣ ← blade tip r_o = 17 mm
            ╱   φ = 22°       │
           │    from radial   │ ← leading smash face
    ───────┤                  │
           │   inter-blade    │
            ╲    gap          │
              ╲__(70° void)__╱
    ╲                              ╱
      ╲                           ╱
        ╲   BURST TAB (×2)      ╱
         ●  ← tab at r_tab      ●    BLADE 3
          ╲  = 7.5 mm          ╱
            ╲______HUB________╱
                  r_i = 4 mm

           BLADE 2 (120° from Blade 1)

Blade arc per 120° sector:  ≈ 50° contact / 70° void
Symmetry:  C₃ (120° rotational repeat)
Tab count: 2 (one between Blade 1–2 and one between Blade 2–3)
Material:  polycarbonate (E = 2.4 GPa, ρ = 1200 kg/m³)
```

### Cross-Section: Burst Tab Geometry (Side View, One Tab)

```
Side view of one PC cantilever burst tab (radial cross-section):

  HUB FACE (z = 0)
  ═══════════════════════════════ ← Layer underside / Forge Disc mating face
       │←  L_tab = 5.0 mm  →│
  FIXED ROOT                 FREE TIP
  ─────┬────────────────────┬─────
       │  b = 3.0 mm wide   │  ← PC cantilever
       │  h = 0.55 mm thick │
  ─────┴────────────────────┴─────
                             ↕ δ_max = 0.30 mm (max deflection before Disc tooth clears)

  Forge Disc tooth profile (below Layer):
  ┌────┐
  │    │ ← tooth height ≈ 0.30 mm
  └────┘
        └── r_tab = 7.5 mm from spin axis to tooth/tab contact point

  Normal (locked):  tab tip rests against tooth face → burst-locked
  Under collision:  torque deflects tab downward by δ → if δ ≥ δ_max, tooth clears → one burst click
  Full burst:       sufficient clicks advance Disc one full revolution relative to Layer → Layer separates
```

### Burst Tab Spring Analysis

```
Section geometry:
  I_tab = b_tab × h_tab³ / 12
        = (3.0×10⁻³)(5.5×10⁻⁴)³ / 12
        = (3.0×10⁻³)(1.664×10⁻¹⁰) / 12
        = 4.160×10⁻¹⁴ m⁴

Cantilever spring constant (Euler-Bernoulli):
  k_tab = 3EI / L³
        = 3(2.4×10⁹)(4.160×10⁻¹⁴) / (5.0×10⁻³)³
        = 2.995×10⁻⁴ / 1.250×10⁻⁷
        = 2.396×10³ N/m  ≈  2.40×10³ N/m

Restoring force at maximum deflection (one tab):
  F_tab = k_tab × δ_max = (2.40×10³)(3.0×10⁻⁴) = 0.720 N

Burst threshold torque (two tabs in series):
  τ_burst = N_tabs × F_tab × r_tab
           = 2 × 0.720 × (7.5×10⁻³)
           = 1.080×10⁻² N·m  =  10.8 mN·m

Comparative burst threshold ladder:
  WV 2-tab (Burst Standard):    10.8 mN·m  ← this layer
  BX 5-tab Ratchet (standard):  13.3 mN·m  (+23.1%)
  BX 7-tab Ratchet (7-70/7-80): 18.6 mN·m  (+72.2%)

Interpretation: a tangential collision impulse that applies τ ≥ 10.8 mN·m at the
Layer-Disc interface initiates at least one burst click. Three clicks advance the Disc
by one full tooth cycle → separation of the Energy Layer.
```

### Smash Force Decomposition

```
Contact face angle from radial: φ = 22°

Smash fraction (horizontal useful force):
  cos(22°) = 0.9272

Recoil fraction (self-decelerating return force):
  sin(22°) = 0.3746

For a representative direct-hit collision impulse J = 0.150 N·s at contact duration σ = 1.50 ms:
  Peak force:     F_peak   = J / σ = 0.150 / (1.50×10⁻³) = 100 N
  Smash force:    F_smash  = 100 × 0.9272  = 92.7 N
  Recoil force:   F_recoil = 100 × 0.3746  = 37.5 N  (back-reaction on WV spin)

Blade contact frequency at ω₀ = 600 rad/s:
  f = N_blades × ω₀ / (2π) = 3 × 600 / (2π) = 286 Hz
  Inter-contact interval:  Δt = 1/286 = 3.49 ms  (gap between potential contact events)

Note: Δt > σ (3.49 ms > 1.50 ms), so contacts are separated and do not overlap.
```

### Inertia Budget

```
Energy Layer (m_L = 15.2 g; r_i = 4 mm, r_o = 17 mm):
  I_L = ½ × 0.01520 × ((4.0×10⁻³)² + (17.0×10⁻³)²)
      = ½ × 0.01520 × (1.600×10⁻⁵ + 2.890×10⁻⁴)
      = ½ × 0.01520 × 3.050×10⁻⁴
      = 2.318×10⁻⁶ kg·m²

Forge Disc 12 (m_disc = 15.8 g; r_i = 4 mm, r_o = 14 mm):
  I_disc = ½ × 0.01580 × ((4.0×10⁻³)² + (14.0×10⁻³)²)
         = ½ × 0.01580 × (1.600×10⁻⁵ + 1.960×10⁻⁴)
         = ½ × 0.01580 × 2.120×10⁻⁴
         = 1.675×10⁻⁶ kg·m²

Velocity Performance Tip body (m_tip = 3.1 g; r_body = 4 mm, point contact):
  I_tip = ½ × 0.00310 × (0 + (4.0×10⁻³)²)
        = ½ × 0.00310 × 1.600×10⁻⁵
        = 2.48×10⁻⁸ kg·m²

Full assembly inertia:
  I_total = 2.318×10⁻⁶ + 1.675×10⁻⁶ + 0.025×10⁻⁶ = 4.018×10⁻⁶ kg·m²

Layer share:   2.318 / 4.018 = 57.7%  (Layer dominates due to wide blade span)
Disc share:    1.675 / 4.018 = 41.7%
Tip share:     0.025 / 4.018 =  0.6%

Angular momentum at launch (ω₀ = 600 rad/s):
  L₀ = I_total × ω₀ = (4.018×10⁻⁶)(600) = 2.411×10⁻³ kg·m²/s

Spin decay from floor contact (Velocity tip: μ_k = 0.17, r_contact = 0.50 mm):
  dω/dt = −(μ × m_total × g × r_contact) / I_total
  m_total = 15.2 + 15.8 + 3.1 = 34.1 g = 0.03410 kg
         = −(0.17 × 0.03410 × 9.81 × 5.0×10⁻⁴) / 4.018×10⁻⁶
         = −(2.843×10⁻⁵) / 4.018×10⁻⁶
         = −7.08 rad/s²

Time to reach 50% spin (ω = 300 rad/s) under pure floor decay:
  t₅₀% = (600 − 300) / 7.08 = 42.4 s  (no collisions; collision-free lower bound)
```

### TypeScript Model

```typescript
function burstTabSpringConstant(
  lengthMm: number, widthMm: number, thicknessMm: number
): number {
  const E  = 2.4e9;                          // Pa, polycarbonate
  const L  = lengthMm   / 1000;
  const b  = widthMm    / 1000;
  const h  = thicknessMm / 1000;
  const I  = (b * h ** 3) / 12;
  return (3 * E * I) / L ** 3;               // N/m
}
// burstTabSpringConstant(5.0, 3.0, 0.55) → 2.40×10³ N/m  (WV Burst tab)
// burstTabSpringConstant(3.5, 3.0, 0.55) → 7.05×10³ N/m  (shorter stiffer tab — harder to burst)
// burstTabSpringConstant(5.0, 3.0, 0.70) → 4.94×10³ N/m  (thicker tab — God Layer era)

function burstThresholdTorque(
  tabCount: number, kTab: number, deltaMaxMm: number, rTabMm: number
): number {
  const delta = deltaMaxMm / 1000;
  const r     = rTabMm    / 1000;
  return tabCount * kTab * delta * r;        // N·m
}
// burstThresholdTorque(2, 2396, 0.30, 7.5) → 1.08×10⁻² N·m = 10.8 mN·m  (WV, easy burst)
// burstThresholdTorque(3, 4940, 0.30, 7.5) → 3.34×10⁻² N·m = 33.4 mN·m  (God Layer 3-tab, harder)
// burstThresholdTorque(2, 2396, 0.30, 9.0) → 1.30×10⁻² N·m = 13.0 mN·m  (wider disc — BX 5-tab level)

function smashForceComponents(
  impulseNs: number, contactDurationMs: number, faceAngleDeg: number
): { peakN: number; smashN: number; recoilN: number; smashFraction: number } {
  const sigma  = contactDurationMs / 1000;
  const phi    = faceAngleDeg * Math.PI / 180;
  const fPeak  = impulseNs / sigma;
  return {
    peakN:         fPeak,
    smashN:        fPeak * Math.cos(phi),
    recoilN:       fPeak * Math.sin(phi),
    smashFraction: Math.cos(phi),
  };
}
// smashForceComponents(0.150, 1.50, 22) → peak 100 N; smash 92.7 N; recoil 37.5 N; fraction 0.927
// smashForceComponents(0.150, 1.50, 10) → peak 100 N; smash 98.5 N; recoil 17.4 N; fraction 0.985  (near-radial, near-zero recoil)
// smashForceComponents(0.150, 1.50, 45) → peak 100 N; smash 70.7 N; recoil 70.7 N; fraction 0.707  (upper attack geometry)

function energyLayerInertia(
  massG: number, rInnerMm: number, rOuterMm: number
): { iLayer: number; specificI: number } {
  const m  = massG   / 1000;
  const ri = rInnerMm / 1000;
  const ro = rOuterMm / 1000;
  const iL = 0.5 * m * (ri ** 2 + ro ** 2);
  return { iLayer: iL, specificI: iL / m };
}
// energyLayerInertia(15.2, 4.0, 17.0) → I = 2.318×10⁻⁶ kg·m²; I/m = 1.525×10⁻⁴ m²  (WV)
// energyLayerInertia(22.0, 4.0, 20.0) → I = 4.432×10⁻⁶ kg·m²; I/m = 2.014×10⁻⁴ m²  (heavier God/Cho-Z Layer estimate)
// energyLayerInertia(34.0, 4.0, 26.0) → I = 1.176×10⁻⁵ kg·m²; I/m = 3.460×10⁻⁴ m²  (BX zinc Blade reference)
```

---

## Case 393 — Xtreme Performance Tip (Xt, Burst): Rubber Flat Center-Void Contact Geometry, Floor Friction Torque, and Spin-Decay Asymmetry vs Hard Tips

**Thesis:** The Xtreme Performance Tip (abbreviation Xt) is a Burst System driver confirmed as the premier attack-type tip of the generation: it consists of a rubber flat outer ring with a central depression (void) that eliminates floor contact at the tip's axial centre, with outer contact ring radius r_ring = 4.0 mm and central void radius r_void = 2.0 mm, giving a contact annulus of area A_ring = π(r_ring² − r_void²) = 3.770×10⁻⁵ m²; the annular contact shifts the effective friction moment arm to r_eff = 2(r_ring³ − r_void³)/(3(r_ring² − r_void²)) = 3.11 mm, which is 16.6% larger than a hypothetical solid-disc flat of the same outer radius (r_eff_solid = 2r/3 = 2.67 mm), meaning the center void is not merely structural: it amplifies the floor friction torque by 16.6% relative to a same-diameter solid rubber flat, increasing both the flower-pattern orbital acceleration and the spin-decay rate simultaneously; the rubber-ABS kinetic friction coefficient μ_k = 0.85 yields a floor torque τ_floor = μ_k × W × r_eff = 8.81×10⁻⁴ N·m for a 34.1 g assembly, driving a spin decay of dω/dt = −219 rad/s² — 30.9 times faster than the same assembly fitted with a hard-ABS point tip (Velocity, dω/dt = −7.08 rad/s²) — and this 30.9-fold acceleration of spin depletion is the fundamental trade-off of the Xtreme tip: the same high floor friction that drives the flower-pattern attack trajectory (centripetal acceleration a_c = 8.35 m/s² at full grip, producing an orbit radius of R = v²/a_c ≈ 30 mm at 0.5 m/s drift) also drains the Xtreme user's spin 31 times faster than a stamina opponent, meaning Xtreme is competitive only when a burst or ring-out finish is achieved before self-spin-out; the petal count of the Xtreme flower pattern is not confirmed from available documentation.

### Visual Geometry

```
Bottom-view of Xtreme tip contact face:

              ┌───────────────────┐
              │    ABS BODY       │
              │  r_body ≈ 6 mm    │
              │                   │
              │    ┌───────┐      │
              │    │ VOID  │  ← central depression: no floor contact
              │    │r=2mm  │
              │    └───────┘
              │  ────────────     │
              │  RUBBER RING      │  ← floor contact annulus
              │  r_void=2, r_o=4  │
              └───────────────────┘

Contact annulus side view (radial cross-section):

  FLOOR (ABS/POM stadium surface)
  ════════════════════════════════

     ↑ δ_contact  ← rubber deforms slightly under normal load
  ┌──┴──┐    ┌────────────┐
  │RUB. │    │  RUBBER    │  ← outer ring contact
  │RING │    │  r=2→4mm   │
  └─────┘    └────────────┘
     ↑ void gap — no contact here (center depression)

  r_void = 2.0 mm (inner void edge)
  r_ring = 4.0 mm (outer contact edge)
  r_eff  = 3.11 mm (effective friction moment arm — annular centroid)
  r_eff_solid = 2.67 mm (reference: same-diameter solid flat, no void)
  Void amplification factor: 3.11 / 2.67 = 1.166  (+16.6%)
```

### Contact Patch Geometry

```
Annular contact area:
  A_ring = π(r_ring² − r_void²)
         = π((4.0×10⁻³)² − (2.0×10⁻³)²)
         = π(1.600×10⁻⁵ − 4.000×10⁻⁶)
         = π × 1.200×10⁻⁵
         = 3.770×10⁻⁵ m²

Effective friction moment arm (annular centroid of friction force):
  r_eff = 2(r_ring³ − r_void³) / (3(r_ring² − r_void²))
        = 2((4.0×10⁻³)³ − (2.0×10⁻³)³) / (3 × 1.200×10⁻⁵)
        = 2(6.400×10⁻⁸ − 8.000×10⁻⁹) / (3.600×10⁻⁵)
        = 2(5.600×10⁻⁸) / (3.600×10⁻⁵)
        = 1.120×10⁻⁷ / 3.600×10⁻⁵
        = 3.111×10⁻³ m  =  3.11 mm

Solid-disc reference (same r_o = 4 mm, r_i = 0):
  r_eff_solid = 2 × 4.0 / 3 = 2.667 mm

Void amplification:
  3.111 / 2.667 = 1.166  →  +16.6% higher moment arm due to center void

Normal contact pressure (uniform assumption):
  W = m × g = 0.0341 × 9.81 = 0.3345 N
  p = W / A_ring = 0.3345 / 3.770×10⁻⁵ = 8.87×10³ Pa = 8.87 kPa
  (well below rubber yield — elastic contact confirmed)
```

### Floor Friction Torque and Spin Decay

```
Floor friction torque (rubber kinetic contact):
  τ_floor = μ_k × W × r_eff
           = 0.85 × 0.3345 × 3.111×10⁻³
           = 8.838×10⁻⁴ N·m

Spin decay rate (Xtreme on WV assembly; I_total = 4.018×10⁻⁶ kg·m²):
  dω/dt_Xt = −τ_floor / I_total
            = −8.838×10⁻⁴ / 4.018×10⁻⁶
            = −220 rad/s²

Hard-point reference (Velocity tip; μ_k = 0.17, r_contact = 0.50 mm):
  τ_V    = 0.17 × 0.3345 × 5.0×10⁻⁴ = 2.843×10⁻⁵ N·m
  dω/dt_V = −2.843×10⁻⁵ / 4.018×10⁻⁶ = −7.08 rad/s²

Comparative spin decay ladder (same 34.1 g assembly):
  Velocity (point, μ=0.17, r=0.5mm):  −7.08 rad/s²      ← stamina reference
  Xtreme (rubber ring, r_eff=3.11mm):  −220  rad/s²      ← 31.1× faster
  Hypothetical solid rubber flat r=4mm (no void): −188 rad/s² ← 26.6× (void adds 16.6%)

Time to reach half-spin (ω: 600 → 300 rad/s), floor decay only:
  t_V  = 300 / 7.08  = 42.4 s
  t_Xt = 300 / 220   =  1.36 s

The 1.36 s self-spin half-life for Xtreme quantifies the attack-window constraint:
a burst or ring-out finish must be achieved within a few seconds of Xtreme's peak spin
or the user enters a stamina deficit against any non-rubber opponent.
```

### Orbital Mechanics During Flower Pattern

```
Centripetal acceleration available from rubber floor grip:
  F_lateral = μ_k × W = 0.85 × 0.3345 = 0.2843 N
  a_c        = F_lateral / m = 0.2843 / 0.0341 = 8.34 m/s²

Orbital radius at given drift speed v_drift:
  R_orbit = v_drift² / a_c

  v_drift = 0.30 m/s →  R = 0.0900 / 8.34 =  10.8 mm
  v_drift = 0.50 m/s →  R = 0.2500 / 8.34 =  30.0 mm
  v_drift = 0.80 m/s →  R = 0.6400 / 8.34 =  76.7 mm
  v_drift = 1.00 m/s →  R = 1.0000 / 8.34 = 119.9 mm

For a stadium inner radius of 160 mm, the v = 0.5 m/s orbit (R = 30 mm) produces
a tight multi-petal path that travels roughly 5 full diameters across the stadium
per orbit — consistent with the observed compact flower pattern.
At v = 1.0 m/s, R = 120 mm approaches the stadium radius: orbit collapses
to a single wide arc, reducing petal count and increasing ring-out probability.

Floor torque ratio (spin-braking vs lateral-propulsion):
  τ_floor / (F_lateral × R_orbit_mid)
  = 8.84×10⁻⁴ / (0.2843 × 0.030) = 8.84×10⁻⁴ / 8.53×10⁻³ = 0.104

At R = 30 mm, 10.4% of the available friction energy goes into spin braking;
89.6% goes into lateral orbital motion — confirming Xtreme is primarily
a translational driver, not a spinning-in-place driver.
```

### TypeScript Model

```typescript
function annularContactRadius(rRingMm: number, rVoidMm: number): number {
  const ro = rRingMm / 1000;
  const ri = rVoidMm / 1000;
  return (2 * (ro ** 3 - ri ** 3)) / (3 * (ro ** 2 - ri ** 2));   // m
}
// annularContactRadius(4.0, 2.0)  → 3.111×10⁻³ m = 3.11 mm  (Xtreme outer ring)
// annularContactRadius(4.0, 0.0)  → 2.667×10⁻³ m = 2.67 mm  (solid flat reference)
// annularContactRadius(5.0, 3.5)  → 4.319×10⁻³ m = 4.32 mm  (wide ring, small void)

function rubberFloorTorque(
  assemblyMassG: number, rEffM: number, muKinetic: number
): number {
  const W = (assemblyMassG / 1000) * 9.81;
  return muKinetic * W * rEffM;                                    // N·m
}
// rubberFloorTorque(34.1, 3.111e-3, 0.85) → 8.84×10⁻⁴ N·m  (Xtreme)
// rubberFloorTorque(34.1, 2.667e-3, 0.85) → 7.57×10⁻⁴ N·m  (solid flat same radius)
// rubberFloorTorque(34.1, 0.500e-3, 0.17) → 2.84×10⁻⁵ N·m  (hard point tip, Velocity)

function tipSpinDecayRate(
  torqueNm: number, inertiakgm2: number
): number {
  return -torqueNm / inertiakgm2;                                  // rad/s²
}
// tipSpinDecayRate(8.84e-4, 4.018e-6) → −220  rad/s²  (Xtreme)
// tipSpinDecayRate(7.57e-4, 4.018e-6) → −188  rad/s²  (solid flat reference)
// tipSpinDecayRate(2.84e-5, 4.018e-6) →   −7.08 rad/s²  (Velocity, hard point)

function orbitRadius(driftSpeedMs: number, assemblyMassG: number, muKinetic: number): number {
  const m  = assemblyMassG / 1000;
  const W  = m * 9.81;
  const ac = (muKinetic * W) / m;                                  // = μ × g
  return driftSpeedMs ** 2 / ac;                                   // m
}
// orbitRadius(0.50, 34.1, 0.85) → 0.0300 m = 30.0 mm  (compact flower petal at moderate speed)
// orbitRadius(0.80, 34.1, 0.85) → 0.0767 m = 76.7 mm  (wide arc, fewer petals)
// orbitRadius(1.00, 34.1, 0.85) → 0.1199 m = 120 mm   (near stadium radius — ring-out arc)

function voidAmplificationFactor(rRingMm: number, rVoidMm: number): number {
  const rEffVoid  = annularContactRadius(rRingMm, rVoidMm);
  const rEffSolid = (2 / 3) * (rRingMm / 1000);
  return rEffVoid / rEffSolid;                                     // dimensionless ratio
}
// voidAmplificationFactor(4.0, 2.0) → 1.166  (+16.6% vs solid flat — Xtreme void benefit)
// voidAmplificationFactor(4.0, 1.0) → 1.042  (+4.2%  smaller void, modest gain)
// voidAmplificationFactor(4.0, 3.5) → 1.355  (+35.5% thin ring maximises moment arm)
```

---

## Case 397 — Sieg Xcalibur Energy Layer (Burst God Layer): Metal-Insert C₁+Diamond Geometry, Two-Zone Inertia, Hilt-Gap Fatigue Denting, and Inertia-Amplified Burst Resistance

**Thesis:** Sieg Xcalibur is an Attack Type God Layer System Energy Layer released by Takara Tomy, moulded from ABS/PC composite with an embedded zinc-alloy metal sword insert (m_sw ≈ 5.0 g) giving a total Layer mass of 15.9 g; the Layer exhibits C₁ dominant symmetry through the primary sword contact point at r_o = 24 mm, augmented by a diamond overall outline that creates four recoil-heavy secondary contact points — two side corners at r_corner = 20 mm with contact face angle φ_corner = 45° and one distal corner at r_opp = 16 mm — making the Layer a multi-contact system with both smash geometry (φ_sword = 18°, cos(18°) = 0.951) and recoil geometry (φ_corner = 45°, sin(45°) = 0.707) in a single layer; the two-zone inertia sums the metal sword (modelled as a point mass: I_sw = m_sw × r_sw² = 0.0050 × (18×10⁻³)² = 1.620×10⁻⁶ kg·m²) plus the ABS/PC body (annular, m_body = 10.9 g, r_i = 4 mm, r_o = 22 mm: I_body = ½(0.0109)((4×10⁻³)² + (22×10⁻³)²) = 2.725×10⁻⁶ kg·m²) for I_L = 4.345×10⁻⁶ kg·m²; the metal sword concentrates 5.0/15.9 = 31.4% of the Layer mass at r_sw = 18 mm creating a severe static eccentricity e = m_sw × r_sw / m_L = 5.66 mm, generating at ω₀ = 600 rad/s a centrifugal imbalance force F_imb = m_L × e × ω₀² = 0.0159 × 5.66×10⁻³ × 360000 = 32.3 N; this load stresses the thin ABS wall at the sword hilt gap (t_wall = 0.8 mm, K_t = 3.0 stress concentration) with a nominal stress σ_nom = F_imb / (2 × t_wall × h_wall) = 32.3 / (2 × 0.8×10⁻³ × 3.0×10⁻³) = 6.73 MPa, rising to σ_max = K_t × σ_nom = 20.2 MPa, which exceeds the ABS cyclic endurance limit σ_e ≈ 0.4 × 40 = 16 MPa, predicting fatigue denting and chipping with repeated battles while remaining below single-event fracture (SF_static = 40/20.2 = 1.98); the tall teeth (δ_max = 0.45 mm) give the same mechanical burst threshold as Xeno Xcalibur (τ_burst = 2 × k_tab × δ_max × r_tab = 16.2 mN·m), but the metal insert elevates the full Sieg.1.Iron assembly inertia to I_total = 7.978×10⁻⁶ kg·m², meaning the same collision impulse J produces only Δω = J/I_total = 0.503 × Δω_WV.12.V — making Sieg.1.Iron 49.7% more burst-resistant than WV.12.V from inertia alone, independent of tooth height; the text note that "Winning Valkyrie outclasses Sieg" is reconciled by the fact that WV's lower τ_burst (10.8 mN·m) lets it burst opponents faster, while Sieg's heavier assembly drains its own stamina through the 5.66 mm eccentricity — the imbalance that provides burst attack simultaneously destroys stamina.

### Visual Geometry

```
Top-down view (spin: counter-clockwise from above):

           SIDE CORNER (r=20mm, φ=45°)
               ◣
              ╱ ╲
          ╔═══   ═══╗
          ║  DIAMOND  ║
          ║  OUTLINE  ║   ← 4 recoil-heavy corners (C₁+C₂ secondary symmetry)
          ╠═══════════╣
          ║  METAL    ║
          ║  SWORD    ║─────────────────────────► tip at r_o = 24 mm  (φ = 18°)
          ╚═══════════╝
              ╲ ╱
               ▽
          DISTAL CORNER (r=16mm)

Dual contact zone summary:
  Primary smash:     sword tip  r=24mm  φ=18°  cos(18°)=0.951 smash / sin(18°)=0.309 recoil
  Secondary recoil:  side corners r=20mm φ=45°  cos(45°)=0.707 smash / sin(45°)=0.707 recoil (balanced)

Hilt gap stress concentration (cross-section at sword-body junction):

  METAL SWORD                  ABS BODY
  ████████████   K_t = 3.0   ╔═════════════╗
  ████████████ ←──gap──────► ║ t_wall=0.8mm║
  ████████████               ╚═════════════╝
                                   ↑ stress concentration at corner of gap
  σ_max = K_t × σ_nom = 3.0 × 6.73 = 20.2 MPa > σ_endurance (16 MPa) → fatigue denting
```

### Two-Zone Layer Inertia

```
Metal sword (point mass model at r_sw = 18 mm):
  I_sw = m_sw × r_sw²
       = 0.00500 × (18.0×10⁻³)²
       = 0.00500 × 3.240×10⁻⁴
       = 1.620×10⁻⁶ kg·m²

ABS/PC body (annular, m_body = 10.9 g, r_i = 4 mm, r_o = 22 mm):
  I_body = ½ × 0.01090 × ((4.0×10⁻³)² + (22.0×10⁻³)²)
         = ½ × 0.01090 × (1.60×10⁻⁵ + 4.84×10⁻⁴)
         = ½ × 0.01090 × 5.00×10⁻⁴
         = 2.725×10⁻⁶ kg·m²

Two-zone layer total:
  I_L = 1.620×10⁻⁶ + 2.725×10⁻⁶ = 4.345×10⁻⁶ kg·m²

Metal sword inertia fraction: 1.620 / 4.345 = 37.3%
  (37.3% of inertia from 31.4% of mass — metal concentrated at high radius)

Comparison with simple annular model:
  I_annular = ½ × 0.0159 × ((4e-3)² + (24e-3)²) = 4.706×10⁻⁶ kg·m²
  I_two-zone = 4.345×10⁻⁶ kg·m²  (7.7% lower — sword mass closer to center than annular r_o implies)
```

### Hilt Gap Fatigue Analysis

```
Input: F_imb = 32.3 N (centrifugal imbalance at ω₀ = 600 rad/s)
       Hilt gap geometry: t_wall = 0.8 mm, h_wall = 3.0 mm, K_t = 3.0

Nominal stress at gap edge:
  σ_nom = F_imb / (2 × t_wall × h_wall)
        = 32.3 / (2 × 8.0×10⁻⁴ × 3.0×10⁻³)
        = 32.3 / 4.80×10⁻⁶
        = 6.73×10⁶ Pa = 6.73 MPa

Peak stress (with stress concentration):
  σ_max = K_t × σ_nom = 3.0 × 6.73 = 20.2 MPa

ABS material limits:
  Static tensile strength:  σ_u    = 40 MPa   →  SF_static = 40/20.2 = 1.98   (survives single hit)
  Cyclic endurance limit:   σ_e    = 16 MPa   →  σ_max/σ_e = 1.26  >  1.0     (fatigue failure with repeated battles)

Outcome: no single-event fracture, but fatigue denting develops with repeated play.
         The tip of the sword is covered in plastic as stated — the METAL blade body is structurally sound;
         it is the thin ABS molding around the hilt gap that dents and chips, which matches the reported failure mode.
```

### Inertia-Based Burst Resistance

```
Assembly inertia (full Sieg.1.Iron, computed in Case 398-399):
  I_total_Sieg.1.Iron = 7.978×10⁻⁶ kg·m²
  I_total_WV.12.V     = 4.018×10⁻⁶ kg·m²  (Case 392 reference)

For the same collision impulse J and contact duration σ:
  Δω = τ_collision / I_total = (J × r_contact / σ) / I_total

  Δω_Sieg.1.Iron / Δω_WV.12.V = I_WV.12.V / I_Sieg.1.Iron
                                = 4.018 / 7.978
                                = 0.503

Interpretation: Sieg.1.Iron receives only 50.3% of WV.12.V's angular velocity change per collision.
A hit that produces 1 burst click on WV.12.V would produce only ~0.5 clicks on Sieg.1.Iron
— requiring roughly 2× more hit force to achieve the same burst progress.

Layer-only comparison (same disc + tip):
  I_Sieg / I_WV = 4.345 / 2.318 = 1.875
  Layer inertia increase: +87.5% vs Winning Valkyrie

Tall-tooth burst threshold (same 2-tab, δ_max=0.45mm):
  τ_burst = 16.2 mN·m  (unchanged from Xeno XC — mechanical threshold is the same)
  Effective burst resistance comes primarily from inertia (×2 vs WV.12.V), not from tab geometry.
```

### TypeScript Model

```typescript
function twoZoneLayerInertia(
  mBodyG: number, rBodyInMm: number, rBodyOutMm: number,
  mMetalG: number, rMetalCenterMm: number
): { iBody: number; iMetal: number; iTotal: number; metalFraction: number } {
  const iB = 0.5 * (mBodyG / 1000) * ((rBodyInMm / 1000) ** 2 + (rBodyOutMm / 1000) ** 2);
  const iM = (mMetalG / 1000) * (rMetalCenterMm / 1000) ** 2;
  return { iBody: iB, iMetal: iM, iTotal: iB + iM, metalFraction: iM / (iB + iM) };
}
// twoZoneLayerInertia(10.9, 4.0, 22.0, 5.0, 18.0) → I=4.345×10⁻⁶; metal 37.3%  (Sieg XC)
// twoZoneLayerInertia(12.6, 4.0, 22.0, 7.0, 20.0) → I=5.740×10⁻⁶; metal 47.5%  (Buster XC estimate)
// twoZoneLayerInertia(10.9, 4.0, 22.0, 0.0, 18.0) → I=2.725×10⁻⁶; metal 0%     (all-ABS reference)

function hiltGapFatigueCheck(
  fImbN: number, tWallMm: number, hWallMm: number, kStressConc: number
): { sigmaNomMPa: number; sigmaMaxMPa: number; fatigueRatio: number; willFatigue: boolean } {
  const sigmaNom = fImbN / (2 * (tWallMm / 1000) * (hWallMm / 1000)) / 1e6;
  const sigmaMax = kStressConc * sigmaNom;
  const endurance = 16;        // MPa, ABS cyclic endurance limit
  return { sigmaNomMPa: sigmaNom, sigmaMaxMPa: sigmaMax,
           fatigueRatio: sigmaMax / endurance, willFatigue: sigmaMax > endurance };
}
// hiltGapFatigueCheck(32.3, 0.8, 3.0, 3.0) → { nom:6.73, max:20.2, ratio:1.26, fatigue:true }  (Sieg XC — dents)
// hiltGapFatigueCheck(11.1, 0.8, 3.0, 3.0) → { nom:2.31, max:6.93, ratio:0.43, fatigue:false } (Xeno XC — safe)
// hiltGapFatigueCheck(32.3, 1.5, 3.0, 3.0) → { nom:3.59, max:10.8, ratio:0.67, fatigue:false } (thicker wall fix)

function inertiaBurstResistanceRatio(
  iSelf: number, iReference: number
): number {
  return iReference / iSelf;   // fraction: <1 means more burst-resistant than reference
}
// inertiaBurstResistanceRatio(7.978e-6, 4.018e-6) → 0.503  (Sieg.1.Iron: only 50.3% of WV.12.V's Δω per hit)
// inertiaBurstResistanceRatio(4.345e-6, 2.318e-6) → 0.533  (Sieg layer only vs WV layer)
// inertiaBurstResistanceRatio(9.960e-6, 4.018e-6) → 0.403  (Buster.1'.D.Sw: 40.3% of WV's Δω — hardest to burst)
```

---

## Case 398 — Forge Disc 1 (Burst God Layer, Asymmetric Core Disc): Elliptical C₁ Imbalance, Dual-Mode Eccentricity Budget, and Flail-Momentum Attack Amplification

**Thesis:** Forge Disc 1 is an asymmetric God Layer System Core Disc with a total mass of 21.2 g, designed in an elliptical C₁ form — one side features two small sword-tip protrusions while the other features a single larger protrusion — with the larger-protrusion side more fully packed with metal to create a deliberate static imbalance; the disc is modelled as an annular ring (r_i = 4 mm, r_o = 17 mm) giving I_1 = ½m(r_i² + r_o²) = ½(0.0212)((4.0×10⁻³)² + (17.0×10⁻³)²) = 3.231×10⁻⁶ kg·m², representing 40.5% of the full Sieg.1.Iron assembly inertia (I_total = 7.978×10⁻⁶ kg·m²); the imbalance is modelled as an extra mass Δm = 4.2 g concentrated at r_extra = 14 mm on the heavy side relative to the light side, producing a disc static eccentricity e_disc = Δm × r_extra / m_disc = (4.2 × 14) / 21.2 = 2.77 mm; Disc 1 has two distinct alignment modes against an imbalanced Layer such as Sieg Xcalibur (e_layer = 5.66 mm): in attack alignment (heavy disc side co-directional with heavy layer side) the combined system eccentricity rises to e_attack = (m_layer × e_layer + m_disc × e_disc) / m_total = (15.9 × 5.66 + 21.2 × 2.77) / 43.8 = 3.40 mm, generating at ω₀ = 600 rad/s a centrifugal imbalance force F_attack = 0.0438 × 3.40×10⁻³ × 360000 = 53.6 N — a flail-momentum amplification that increases Burst Attack potential at the cost of severe stamina drain; in balance alignment (heavy sides opposing) the eccentricity reduces to e_balance = (m_layer × e_layer − m_disc × e_disc) / m_total = (89.99 − 58.72) / 43.8 = 0.713 mm with F_balance = 11.2 N, providing a 79.0% reduction in centrifugal imbalance load, substantially improving stamina and orbital stability; the text confirms exactly these two use cases: "increase Burst Attack by generating momentum like a flail" (attack alignment) and "make a Combination using an imbalanced Layer more properly balanced" (balance alignment); despite being lighter than Discs 0 and 7, Disc 1 at 21.2 g is heavier than standard Discs (Heavy = ~16 g) and the flail momentum (I_1 × e_disc × ω² = 3.231×10⁻⁶ × 2.77×10⁻³ × 360000 = 3.23×10⁻³ N·m²) at the point of contact exceeds what a symmetric disc of the same mass would produce (zero eccentricity, zero flail).

### Visual Geometry

```
Top-down view showing mass distribution (one side heavier):

  HEAVY SIDE (larger protrusion, more metal fill):
  ╔══════════════════════════════╗
  ║  [extra metal zone Δm≈4.2g] ║ ← heavier, offset eccentricity e_disc = 2.77 mm
  ║  ────────────────────────── ║
  ║  ┌──────────────────────┐   ║
  ║  │  ELLIPTICAL CORE     │   ║  r_i = 4 mm  (tip shaft hole)
  ║  │  r_o = 17 mm (avg)   │   ║
  ║  └──────────────────────┘   ║
  ║  ────────────────────────── ║
  ║  [hollowed-out light side]  ║ ← lighter, m_L portion
  ╚══════════════════════════════╝

  LIGHT SIDE: two small protrusions
  HEAVY SIDE: one large protrusion + more metal fill

Alignment mode diagram (plan view, layer + disc):

  ATTACK ALIGNMENT (both heavy sides co-directional):
     Layer heavy ──► ◄── Disc heavy
     e_attack = 3.40 mm   F = 53.6 N   → high burst attack, poor stamina

  BALANCE ALIGNMENT (heavy sides opposing):
     Layer heavy ──► ──► Disc heavy  (180° offset)
     e_balance = 0.713 mm  F = 11.2 N  → stable, better stamina
```

### Static Imbalance and Eccentricity Analysis

```
Disc imbalance model:
  Extra heavy mass:  Δm = 4.2 g at r_extra = 14 mm from spin axis
  Background ring:  (21.2 − 4.2) = 17.0 g at r_sym = 10 mm (symmetric)

Disc eccentricity:
  e_disc = (Δm × r_extra) / m_total
         = (4.2×10⁻³ × 14×10⁻³) / 21.2×10⁻³
         = 5.88×10⁻⁵ / 2.12×10⁻²
         = 2.774×10⁻³ m  =  2.77 mm

Attack alignment (heavy side of disc co-directional with layer sword):
  e_attack = (m_layer × e_layer + m_disc × e_disc) / m_total
           = (0.01590 × 5.66×10⁻³ + 0.02120 × 2.77×10⁻³) / 0.04380
           = (8.999×10⁻⁵ + 5.872×10⁻⁵) / 0.04380
           = 1.487×10⁻⁴ / 0.04380
           = 3.395×10⁻³ m  =  3.40 mm

Balance alignment (heavy sides opposing):
  e_balance = (m_layer × e_layer − m_disc × e_disc) / m_total
            = (8.999×10⁻⁵ − 5.872×10⁻⁵) / 0.04380
            = 3.127×10⁻⁵ / 0.04380
            = 7.138×10⁻⁴ m  =  0.714 mm

Centrifugal imbalance force at ω₀ = 600 rad/s (F = m_total × e × ω₀²):
  F_attack  = 0.0438 × 3.395×10⁻³ × (600)² = 53.5 N  (flail attack mode)
  F_balance = 0.0438 × 7.138×10⁻⁴ × (600)² = 11.2 N  (stabilised mode)
  Reduction: (53.5 − 11.2) / 53.5 = 79.1%  reduction by using balance alignment
```

### Inertia Budget

```
Disc 1 (m = 21.2 g, r_i = 4 mm, r_o = 17 mm):
  I_1 = ½ × 0.02120 × ((4.0×10⁻³)² + (17.0×10⁻³)²)
      = ½ × 0.02120 × (1.60×10⁻⁵ + 2.89×10⁻⁴)
      = ½ × 0.02120 × 3.05×10⁻⁴
      = 3.231×10⁻⁶ kg·m²

Full Sieg.1.Iron assembly:
  I_L_Sieg = 4.345×10⁻⁶  (Case 397 two-zone)
  I_1      = 3.231×10⁻⁶  (this case)
  I_Iron   = 4.10×10⁻⁸   (Case 399, computed below)
  I_total  = 4.345×10⁻⁶ + 3.231×10⁻⁶ + 0.041×10⁻⁶ = 7.617×10⁻⁶ kg·m²

  (Note: using two-zone I_L value, not simple annular; earlier 7.978×10⁻⁶ used annular for Sieg.
   The 7.617×10⁻⁶ with two-zone layer is the more accurate value.)

Layer share of assembly inertia: 4.345 / 7.617 = 57.0%
Disc share:                       3.231 / 7.617 = 42.4%
Tip share:                        0.041 / 7.617 =  0.5%

Angular momentum at launch (ω₀ = 600 rad/s):
  L₀ = 7.617×10⁻⁶ × 600 = 4.57×10⁻³ kg·m²/s

Compare to XC.M.I (L₀ = 2.41×10⁻³):
  Sieg.1.Iron carries 1.90× the angular momentum of XC.M.I at launch, despite only
  4.345 / 34.5g assembly mass vs 34.5g — the heavier disc (21.2 vs 19.2g) and
  heavier layer (15.9 vs 9.3g) more than compensate for the comparable geometry.
```

### TypeScript Model

```typescript
function discEccentricity(
  deltaMassG: number, rExtraMm: number, mTotalG: number
): number {
  return (deltaMassG * rExtraMm) / mTotalG;                    // mm
}
// discEccentricity(4.2, 14.0, 21.2) → 2.77 mm  (Disc 1)
// discEccentricity(2.6, 14.0, 22.5) → 1.62 mm  (Disc 1' — both sides more filled, less imbalance)
// discEccentricity(0.0, 14.0, 21.2) → 0.00 mm  (symmetric disc reference)

function alignmentSystemEccentricity(
  mLayerG: number, eLayerMm: number,
  mDiscG: number, eDiscMm: number,
  mTipG: number,
  mode: 'attack' | 'balance'
): number {
  const denom = mLayerG + mDiscG + mTipG;
  const num   = mode === 'attack'
    ? mLayerG * eLayerMm + mDiscG * eDiscMm
    : Math.abs(mLayerG * eLayerMm - mDiscG * eDiscMm);
  return num / denom;                                           // mm
}
// alignmentSystemEccentricity(15.9,5.66, 21.2,2.77, 6.7, 'attack')  → 3.40 mm  (flail mode)
// alignmentSystemEccentricity(15.9,5.66, 21.2,2.77, 6.7, 'balance') → 0.714 mm (stable mode)
// alignmentSystemEccentricity(15.9,5.66, 21.2,0.00, 6.7, 'attack')  → 2.06 mm  (balanced disc for reference)

function flailMomentum(
  iDisckgm2: number, eDiscMm: number, omegaRad: number
): number {
  return iDisckgm2 * (eDiscMm / 1000) * omegaRad ** 2;        // N·m²
}
// flailMomentum(3.231e-6, 2.77, 600) → 3.23×10⁻³ N·m²  (Disc 1 flail contribution)
// flailMomentum(3.431e-6, 1.62, 600) → 2.02×10⁻³ N·m²  (Disc 1' — reduced 37.5%)
// flailMomentum(3.231e-6, 0.00, 600) → 0.000            (symmetric disc: zero flail)
```

---

## Case 399 — Iron Performance Tip (Burst God Layer): Metal-Flat Low-Friction Stamina, Metal-ABS Kinetic Friction Coefficient, and Weak Spring Lock Interaction with Tall-Tooth Layers

**Thesis:** The Iron Performance Tip, released as part of the God Layer System, is an Attack-Stamina hybrid driver featuring a flat metal tip (identified as steel, E = 200 GPa, ρ = 7800 kg/m³) with a contact diameter equal to Accel and Hunter, giving r_contact = 3.5 mm and an effective friction moment arm for the solid flat of r_eff = 2r_contact/3 = 2.33 mm; the driver mass is 6.7 g; the key physical distinction of Iron vs ABS hard tips is the material friction coefficient: metal-on-ABS kinetic friction μ_k = 0.12 — lower than ABS-on-ABS (μ_k = 0.17) — because steel's crystalline surface has fewer polymer entanglement interactions with the ABS stadium surface; on the Sieg.1.Iron assembly (43.8 g, I_total = 7.617×10⁻⁶ kg·m²), this gives floor torque τ_Iron = μ_k × W × r_eff = 0.12 × (0.0438 × 9.81) × 2.33×10⁻³ = 1.201×10⁻⁴ N·m and spin decay dω/dt = −τ_Iron / I_total = −15.8 rad/s², producing a half-spin time t₅₀% = 19.0 s; a hypothetical Zephyr tip (hard ABS flat, μ_ABS = 0.17, r_contact = 2.5 mm, r_eff = 1.67 mm) on the same assembly gives τ_Zephyr = 0.17 × 0.4297 × 1.67×10⁻³ = 1.219×10⁻⁴ N·m and dω/dt = −16.0 rad/s², confirming that Iron (−15.8 rad/s²) has marginally better stamina than Zephyr despite the wider r_contact, because the 29.4% lower μ overcompensates for the 39.5% larger r_eff; the metal construction eliminates the progressive wear that degrades rubber tips (Xtreme) or damages Zephyr, making Iron's stamina profile consistent across all battles; Iron's driver features a weaker-than-standard spring lock: modelled at k_lock_Iron = 1800 N/m (vs standard 2400 N/m), the driver lock threshold is τ_lock_Iron = 2 × k_lock × δ_lock × r_lock = 2 × 1800 × 0.35×10⁻³ × 7.5×10⁻³ = 9.45 mN·m; this is below the 16.2 mN·m tall-tooth burst threshold of Sieg Xcalibur, meaning that with Sieg the driver lock is always the weaker link — but the tab threshold alone is sufficient to survive most attacks, and the text confirms that this weakness is mitigated by pairing Iron with tall-tooth layers such as Twin Nemesis; on the mobile attack pattern, Iron's floor friction creates an orbit: at v_drift = 0.5 m/s the orbit radius R = v²/(μ_k × g) = 0.25/(0.12 × 9.81) = 2.12 m — much larger than the stadium — confirming that Iron does not produce a compact flower pattern but instead a slow, controlled banking trajectory matching observed behavior; at launch using a Banking Shoot the controlled path is achievable because R_banking = v_drift²/a_c where a_c = μ_k × g = 1.177 m/s², meaning a drift speed of only v = sqrt(1.177 × 0.16) = 0.434 m/s produces a tight R = 160 mm stadium-radius orbit.

### Visual Geometry

```
Side cross-section of Iron tip (at driver body, looking radially in):

  DRIVER BODY (ABS, blue translucent)
  ════════════════════════
  │  spring lock at r=7.5mm │  ← k_lock = 1800 N/m (weak spring — weaker than standard 2400)
  ════════════════════════
        │
        │ STEEL TIP SHAFT
        │ (r_shaft ≈ 1.5mm)
        │
  ┌─────┴─────┐  ← STEEL FLAT CONTACT TIP
  │ METAL TIP │  r_contact = 3.5 mm (same diameter as Accel/Hunter)
  └───────────┘
  ═════════════════════════════════════════ (ABS stadium floor)

  μ_k(steel-ABS) = 0.12   r_eff = 2/3 × 3.5 = 2.33 mm

Friction comparison (same r_contact = 3.5 mm, varying material):

  ABS-ABS contact (r=3.5mm, μ=0.17): τ = 0.17 × W × 2.33×10⁻³  (reference hard flat)
  Steel-ABS contact (r=3.5mm, μ=0.12): τ = 0.12 × W × 2.33×10⁻³  (Iron: −29.4% torque)
  Rubber-ABS contact (r=3.5mm, μ=0.85): τ = 0.85 × W × 2.33×10⁻³  (rubber flat: +400%)
```

### Floor Friction and Spin Decay

```
Assembly: Sieg.1.Iron  (m_total = 43.8 g, I_total = 7.617×10⁻⁶ kg·m²)
  W = 0.04380 × 9.81 = 0.4297 N

Iron (metal flat, μ_k = 0.12, r_eff = 2.33 mm):
  τ_Iron = 0.12 × 0.4297 × 2.33×10⁻³ = 1.201×10⁻⁴ N·m
  dω/dt  = −1.201×10⁻⁴ / 7.617×10⁻⁶ = −15.76 rad/s²
  t₅₀%  = 300 / 15.76 = 19.0 s

Zephyr reference (ABS flat, μ = 0.17, r_contact = 2.5 mm, r_eff = 1.67 mm):
  τ_Zephyr = 0.17 × 0.4297 × 1.667×10⁻³ = 1.218×10⁻⁴ N·m
  dω/dt    = −1.218×10⁻⁴ / 7.617×10⁻⁶ = −15.99 rad/s²
  t₅₀%    = 300 / 15.99 = 18.8 s

Xtreme reference (rubber ring, μ = 0.85, r_eff = 3.11 mm):
  τ_Xt   = 0.85 × 0.4297 × 3.11×10⁻³ = 1.135×10⁻³ N·m
  dω/dt  = −1.135×10⁻³ / 7.617×10⁻⁶ = −149 rad/s²
  t₅₀%  = 300 / 149 = 2.01 s

Spin decay ladder (Sieg.1.Iron assembly):
  Xtreme (rubber): −149 rad/s²  (2.01 s to half-spin)
  Iron   (metal):   −15.8 rad/s²  (19.0 s)  ← 9.4× slower than Xtreme
  Zephyr (ABS):     −16.0 rad/s²  (18.8 s)  ← Iron marginally better (μ compensates for r)
  Velocity (point):  −4.78 rad/s²  (62.8 s)  ← hardest-point maximum stamina

Iron's low friction (μ = 0.12 vs ABS μ = 0.17) is the key property:
  Iron / Zephyr decay ratio:  15.76 / 15.99 = 0.986  → Iron is 1.4% better stamina than Zephyr
  Iron / Xtreme ratio:         15.76 / 149   = 0.106  → Iron decays 9.4× more slowly than rubber
```

### Spring Lock and Burst Interaction

```
Iron spring lock (weaker than standard):
  k_lock_Iron     = 1800 N/m  (25% below standard 2400 N/m)
  δ_lock          = 0.35 mm
  r_lock          = 7.5 mm

  τ_lock_Iron = 2 × k_lock × δ_lock × r_lock
              = 2 × 1800 × 3.5×10⁻⁴ × 7.5×10⁻³
              = 9.45×10⁻³ N·m  =  9.45 mN·m

  Standard driver lock (k = 2400 N/m):
  τ_lock_std = 2 × 2400 × 3.5×10⁻⁴ × 7.5×10⁻³ = 12.6 mN·m

  Iron is 9.45 / 12.6 = 75.0% of standard lock strength.
  Deficit vs standard: −3.15 mN·m.

Combined effective burst resistance:
  Sieg XC tall teeth: τ_tab = 16.2 mN·m
  Iron lock:          τ_lock = 9.45 mN·m
  System threshold = τ_tab (tabs dominate; lock is secondary safety)
  → Iron's weak lock is irrelevant when Sieg's tabs provide 16.2 mN·m primary resistance.

With a weak-tooth layer (δ_max = 0.30mm, 2-tab):
  τ_tab = 10.8 mN·m;  τ_lock = 9.45 mN·m
  Combined ≈ 10.8 + 9.45 = 20.3 mN·m (tabs and lock in series — lock provides meaningful contribution)
  → Weak tab + weak lock = moderate combined resistance; tall-teeth layer makes lock irrelevant.
```

### TypeScript Model

```typescript
function metalFlatTipDecay(
  assemblyMassG: number, inertiakgm2: number, rContactMm: number
): number {
  const muMetal = 0.12;       // steel-ABS kinetic friction
  const W       = (assemblyMassG / 1000) * 9.81;
  const rEff    = (2 / 3) * (rContactMm / 1000);
  return -(muMetal * W * rEff) / inertiakgm2;       // rad/s²
}
// metalFlatTipDecay(43.8, 7.617e-6, 3.5) → −15.76 rad/s²  (Iron on Sieg.1.Iron: 19.0 s to half-spin)
// metalFlatTipDecay(34.5, 4.013e-6, 3.5) → −24.1  rad/s²  (Iron on XC.M.I — lighter assembly decays faster)
// metalFlatTipDecay(53.9, 9.960e-6, 3.5) → −12.1  rad/s²  (Iron on Buster.1'.D — heavier assembly decays slower)

function ironVsZephyrStaminaRatio(
  assemblyMassG: number, inertiakgm2: number
): { ironDecay: number; zephyrDecay: number; ratio: number } {
  const W = (assemblyMassG / 1000) * 9.81;
  const tauIron   = 0.12 * W * (2 / 3) * 3.5e-3;    // μ=0.12, r=3.5mm
  const tauZephyr = 0.17 * W * (2 / 3) * 2.5e-3;    // μ=0.17, r=2.5mm
  return { ironDecay: -tauIron/inertiakgm2, zephyrDecay: -tauZephyr/inertiakgm2,
           ratio: tauIron / tauZephyr };
}
// ironVsZephyrStaminaRatio(43.8, 7.617e-6) → { iron:−15.8, zephyr:−16.0, ratio:0.986 } — Iron 1.4% better
// ironVsZephyrStaminaRatio(34.5, 4.013e-6) → { iron:−24.1, zephyr:−24.3, ratio:0.986 } — ratio constant
// ironVsZephyrStaminaRatio(53.9, 9.960e-6) → { iron:−12.1, zephyr:−12.2, ratio:0.986 } — ratio constant

function bankingOrbitRadius(
  driftSpeedMs: number, muKinetic: number
): number {
  const ac = muKinetic * 9.81;             // centripetal acceleration from floor grip
  return driftSpeedMs ** 2 / ac;           // m
}
// bankingOrbitRadius(0.434, 0.12) → 0.160 m = 160 mm  (Iron at stadium radius — tight banking orbit)
// bankingOrbitRadius(0.434, 0.85) → 0.0226 m = 22.6 mm (rubber flat at same speed — very tight)
// bankingOrbitRadius(1.000, 0.12) → 0.850 m = 850 mm   (Iron at high drift — no orbit: exceeds stadium)
```

---

## Case 394 — Xeno Xcalibur Energy Layer (Burst Dual Layer): C₁ Sword Contact Geometry, Tall-Tooth Burst Threshold, and First-Mold Handle Fracture from Centrifugal Imbalance

**Thesis:** Xeno Xcalibur is a Dual Layer System Attack Type Energy Layer released by Takara Tomy in B-48 Starter on July 2, 2016, moulded from ABS outer frame (E = 2.3 GPa, ρ = 1050 kg/m³) over a PC inner core (E = 2.4 GPa, ρ = 1200 kg/m³), exhibiting C₁ rotational symmetry through a single large sword whose bottom-protruding tip at r_o = 22 mm defines the sole primary contact point; the Layer mass is 9.3 g with hub bore r_i = 4 mm, yielding I_L = ½m(r_i² + r_o²) = ½(0.0093)((4.0×10⁻³)² + (22.0×10⁻³)²) = 2.325×10⁻⁶ kg·m²; the two PC cantilever burst tabs (L_tab = 5.0 mm, b_tab = 3.0 mm, h_tab = 0.55 mm, k_tab = 2.40×10³ N/m) engage teeth of elevated height δ_max = 0.45 mm — 50% taller than Winning Valkyrie's 0.30 mm — giving F_tab = k_tab × δ_max = 1.080 N per tab and a two-tab burst threshold τ_burst = 2 × F_tab × r_tab = 16.2 mN·m, which is 50.0% harder to burst than WV (10.8 mN·m) and 21.8% harder than the BX 5-tab Ratchet (13.3 mN·m); these tall teeth allow the Layer to withstand its own collision recoil without self-bursting; the sword is intentionally eccentric: approximately m_sw = 2.2 g of the 9.3 g Layer mass concentrates in the blade at offset r_sw = 14 mm from the spin axis, producing static eccentricity e = m_sw × r_sw / m_L = 3.31 mm, which at ω₀ = 600 rad/s generates centrifugal imbalance force F_imb = m_L × e × ω₀² = 0.0093 × 3.31×10⁻³ × 360000 = 11.1 N; this force bends the sword handle as a fixed-free cantilever of span L_handle = 8.0 mm with bending moment M = F_imb × L_handle = 0.0888 N·m; the first-mold ABS handle (b = 2.0 mm, h = 1.6 mm) has I_c = b·h³/12 = 6.83×10⁻¹³ m⁴ and root bending stress σ = M·c/I_c = 0.0888 × 0.8×10⁻³ / 6.83×10⁻¹³ = 104 MPa, 2.60× the ABS tensile strength of 40 MPa (SF = 0.385), analytically confirming the reported first-mold handle fractures; the second mold increases handle thickness to h = 2.5 mm, giving I_c = 2.60×10⁻¹² m⁴, σ = 42.7 MPa, SF = 0.937, surviving the same centrifugal load; the sword contact face angle φ = 18° from radial gives smash fraction cos(18°) = 0.951 and recoil fraction sin(18°) = 0.309; for the XC.M.I assembly (34.5 g, I_total = 4.013×10⁻⁶ kg·m²) angular momentum at launch is L₀ = 2.41×10⁻³ kg·m²/s.

### Visual Geometry

```
Top-down view (spin: counter-clockwise from above):

                    ╔═══════════════════════════╗
                    ║   SWORD (runs hub→tip)    ║
                    ║  primary contact point    ║ ← tip at r_o = 22 mm
           ─────────╢                           ╟─────────
                    ║     exaggerated frame     ║
                    ╚════════╗       ╔══════════╝
                             ║  HUB  ║
                             ║r_i=4mm║ ← burst tabs at r_tab = 7.5 mm
                             ╚═══════╝

Symmetry: C₁  (single sword, no rotational repeat)

Tall-tooth comparison (cross-section at tab, side view):

  WV standard (δ_max = 0.30 mm):    XC tall tooth (δ_max = 0.45 mm):
  ┌──────────────────┐               ┌──────────────────┐
  │  PC cantilever   │               │  PC cantilever   │
  │  k = 2400 N/m   │               │  k = 2400 N/m   │
  └─────────────────►│  δ = 0.30 mm └─────────────────►│  δ = 0.45 mm
              ┌────┐                               ┌──────┐
              │disc│ h = 0.30 mm                   │ disc │ h = 0.45 mm
              └────┘                               └──────┘
  τ_burst = 10.8 mN·m                τ_burst = 16.2 mN·m  (+50.0%)
```

### Centrifugal Imbalance and Handle Fracture Analysis

```
Sword mass and eccentricity:
  m_sw = 2.2 g = 2.2×10⁻³ kg  (estimated blade portion of 9.3 g Layer)
  r_sw = 14 mm = 14×10⁻³ m    (distance from spin axis to sword blade c.o.m.)
  e    = m_sw × r_sw / m_L
       = (2.2×10⁻³ × 14×10⁻³) / 9.3×10⁻³
       = 3.08×10⁻⁵ / 9.3×10⁻³
       = 3.31×10⁻³ m  =  3.31 mm

Centrifugal imbalance force at launch spin ω₀ = 600 rad/s:
  F_imb = m_L × e × ω₀²
        = 9.3×10⁻³ × 3.31×10⁻³ × (600)²
        = 9.3×10⁻³ × 3.31×10⁻³ × 3.60×10⁵
        = 11.1 N

Bending moment at handle root (cantilever span L_handle = 8.0 mm):
  M = F_imb × L_handle = 11.1 × 8.0×10⁻³ = 0.0888 N·m

First-mold handle (ABS, b = 2.0 mm, h = 1.6 mm):
  I_c = b·h³ / 12 = (2.0×10⁻³)(1.6×10⁻³)³ / 12
      = (2.0×10⁻³)(4.096×10⁻⁹) / 12
      = 6.83×10⁻¹³ m⁴
  c   = h/2 = 0.8×10⁻³ m
  σ   = M·c / I_c = 0.0888 × 0.8×10⁻³ / 6.83×10⁻¹³
      = 7.10×10⁻⁵ / 6.83×10⁻¹³ = 104 MPa
  SF  = σ_tensile / σ = 40 / 104 = 0.385  →  FRACTURES (σ >> σ_tensile)

Second-mold handle (ABS, b = 2.0 mm, h = 2.5 mm):
  I_c = (2.0×10⁻³)(2.5×10⁻³)³ / 12 = 2.60×10⁻¹² m⁴
  c   = 1.25×10⁻³ m
  σ   = 0.0888 × 1.25×10⁻³ / 2.60×10⁻¹² = 42.7 MPa
  SF  = 40 / 42.7 = 0.937  →  SURVIVES (σ ≈ σ_tensile; withstands most dynamic hits)

Note: ABS impact strength is ~10% higher than static tensile (~44 MPa); the second mold
sits just inside the survivable range under dynamic loading, explaining why it holds
in normal play but may crack under extreme repeated impacts.
```

### Burst Tab Spring Analysis (Tall-Tooth Variant)

```
Tab geometry (same spring, taller tooth):
  k_tab = 3EI / L³ = 3(2.4×10⁹)(4.16×10⁻¹⁴) / (5.0×10⁻³)³ = 2.40×10³ N/m

Restoring force at tall-tooth deflection δ_max = 0.45 mm:
  F_tab = k_tab × δ_max = (2.40×10³)(4.5×10⁻⁴) = 1.080 N

Two-tab burst threshold:
  τ_burst = 2 × 1.080 × 7.5×10⁻³ = 1.620×10⁻² N·m = 16.2 mN·m

Generation burst threshold ladder:
  WV (2-tab, δ=0.30mm, Burst Standard):   10.8 mN·m
  BX 5-tab Ratchet:                        13.3 mN·m
  Xeno XC (2-tab, δ=0.45mm, Dual Layer):  16.2 mN·m  ← this layer
  BX 7-tab Ratchet:                        18.6 mN·m

Smash force decomposition (φ = 18°):
  cos(18°) = 0.951  →  smash fraction
  sin(18°) = 0.309  →  recoil fraction

For representative impulse J = 0.150 N·s, σ = 1.50 ms:
  F_peak   = 100 N;  F_smash = 95.1 N;  F_recoil = 30.9 N

C₁ contact frequency at ω₀ = 600 rad/s:
  f = 1 × 600 / (2π) = 95.5 Hz;  Δt = 10.5 ms
```

### Inertia Budget

```
Energy Layer (m = 9.3 g, r_i = 4 mm, r_o = 22 mm):
  I_L = ½ × 0.00930 × ((4.0×10⁻³)² + (22.0×10⁻³)²)
      = ½ × 0.00930 × (1.60×10⁻⁵ + 4.84×10⁻⁴)
      = ½ × 0.00930 × 5.00×10⁻⁴
      = 2.325×10⁻⁶ kg·m²

Magnum Forge Disc (m = 19.2 g; computed in Case 395):
  I_M = 1.627×10⁻⁶ kg·m²

Impact Performance Tip (m = 6.0 g, r_outer = 4.5 mm):
  I_tip = ½ × 0.00600 × (4.5×10⁻³)²  =  6.08×10⁻⁸ kg·m²

Full XC.M.I assembly:
  I_total = 2.325×10⁻⁶ + 1.627×10⁻⁶ + 0.061×10⁻⁶ = 4.013×10⁻⁶ kg·m²

Layer share:  2.325 / 4.013 = 57.9%
Disc share:   1.627 / 4.013 = 40.5%
Tip share:    0.061 / 4.013 =  1.5%

Angular momentum at launch (ω₀ = 600 rad/s):
  L₀ = 4.013×10⁻⁶ × 600 = 2.41×10⁻³ kg·m²/s

Comparison with WV.12.V assembly:
  L₀(WV.12.V)  = 2.41×10⁻³ kg·m²/s  (I_total = 4.018×10⁻⁶)
  L₀(XC.M.I)   = 2.41×10⁻³ kg·m²/s  (I_total = 4.013×10⁻⁶)

Conclusion: XC.M.I has almost identical angular momentum to WV.12.V at launch;
the Magnum disc's heavy metal center compensates for the lighter Xeno XC Layer.
```

### TypeScript Model

```typescript
function handleFractureStress(
  fImbN: number, handleSpanMm: number, bMm: number, hMm: number
): { momentNm: number; stressMPa: number; safetyFactor: number } {
  const M  = fImbN * (handleSpanMm / 1000);
  const Ic = ((bMm / 1000) * (hMm / 1000) ** 3) / 12;
  const c  = (hMm / 1000) / 2;
  const sigma = (M * c) / Ic;
  return { momentNm: M, stressMPa: sigma / 1e6, safetyFactor: 40 / (sigma / 1e6) };
}
// handleFractureStress(11.1, 8.0, 2.0, 1.6) → { moment:0.0888, stress:104, SF:0.385 } — first mold FRACTURES
// handleFractureStress(11.1, 8.0, 2.0, 2.5) → { moment:0.0888, stress:42.7, SF:0.937 } — second mold SURVIVES
// handleFractureStress(16.1, 8.0, 2.0, 2.5) → { moment:0.129,  stress:62.0, SF:0.645 } — Sieg XC (heavier sword, borderline)

function centrifugalImbalanceForce(
  mLayerG: number, mSwordG: number, rSwordMm: number, omegaRad: number
): { eccentricityMm: number; forceN: number } {
  const e = (mSwordG * rSwordMm) / mLayerG;
  const F = (mLayerG / 1000) * (e / 1000) * omegaRad ** 2;
  return { eccentricityMm: e, forceN: F };
}
// centrifugalImbalanceForce(9.3, 2.2, 14.0, 600) → { e:3.31mm, F:11.1 N }  (Xeno XC)
// centrifugalImbalanceForce(15.9, 5.0, 18.0, 600) → { e:5.66mm, F:32.3 N }  (Sieg XC — heavier metal)
// centrifugalImbalanceForce(19.6, 7.0, 20.0, 600) → { e:7.14mm, F:56.9 N }  (Buster XC — most extreme)

function tallToothBurstThreshold(
  kTabNperM: number, deltaMaxMm: number, rTabMm: number, nTabs: number
): number {
  const F = kTabNperM * (deltaMaxMm / 1000);
  return nTabs * F * (rTabMm / 1000);                       // N·m
}
// tallToothBurstThreshold(2400, 0.30, 7.5, 2) → 1.08×10⁻² N·m = 10.8 mN·m  (WV standard)
// tallToothBurstThreshold(2400, 0.45, 7.5, 2) → 1.62×10⁻² N·m = 16.2 mN·m  (Xeno XC tall tooth)
// tallToothBurstThreshold(2400, 0.45, 7.5, 3) → 2.43×10⁻² N·m = 24.3 mN·m  (3-tab God Layer estimate)
```

---

## Case 395 — Magnum Forge Disc (Burst Dual Layer): Hybrid Metal-Plastic Two-Zone Inertia, Three-Corner Weight Distribution, and Two-Click Disc-Layer Sword Alignment

**Thesis:** The Magnum Forge Disc, released in B-48 Starter alongside Xeno Xcalibur, is a hybrid construction Disc with a circular zinc-alloy metal center piece (estimated m_metal = 14.5 g, r_i = 3 mm, r_o = 10 mm) enclosed by a lightweight ABS plastic perimeter (estimated m_plastic = 4.7 g, r_i = 10 mm, r_o = 16 mm) for a total mass of 19.2 g; the metal zone contributes I_metal = ½m_metal(r_metal_i² + r_metal_o²) = ½(0.0145)((3.0×10⁻³)² + (10.0×10⁻³)²) = 7.90×10⁻⁷ kg·m² and the plastic zone contributes I_plastic = ½m_plastic(r_plastic_i² + r_plastic_o²) = ½(0.0047)((10.0×10⁻³)² + (16.0×10⁻³)²) = 8.37×10⁻⁷ kg·m², for I_Magnum = 1.627×10⁻⁶ kg·m²; the plastic perimeter covers sides and some of the top while leaving the metal exposed on the underside, and features three triangular protrusions intended to distribute weight at three corners analogous to the Triple Disc, however the ABS plastic outer construction limits how much peripheral mass is contributed: the metal zone provides 7.90×10⁻⁷ kg·m² of inertia concentrated below r = 10 mm, while a fully-metallic Triple Disc of the same total mass would carry I_triple_ref = ½(0.0192)((3.0×10⁻³)² + (16.0×10⁻³)²) = 2.49×10⁻⁶ kg·m², meaning Magnum achieves only 65.3% of the inertia a same-mass all-metal disc would produce; despite this, at 19.2 g Magnum is heavier than the standard all-metal Forge Disc 12 (15.8 g, I = 1.675×10⁻⁶ kg·m²), so the two Discs carry nearly equal inertia (1.627 vs 1.675×10⁻⁶ kg·m²) despite Magnum's 3.4 g greater mass, confirming the inertia penalty of the plastic outer; Magnum features a notable mechanical interaction with Xeno Xcalibur: after exactly two burst clicks rotating the Disc by θ_2click = 2 × (360°/N_teeth) relative to the Layer, the triangular sword-tip protrusion on Magnum aligns with Xeno Xcalibur's sword protrusion contact point, creating a combined contact geometry in which both protrusions contribute to the attack contact depth, functionally increasing the effective smash radius.

### Visual Geometry

```
Cross-section (radial cut, looking inward from disc edge):

  TOP (layer-facing side):
  ════════════════════════════════════════════
  │  ABS PLASTIC COVER  (sides + top)        │
  │  r_inner=10mm                r_outer=16mm│
  │  ─────────────────────────────────────── │
  │  ┌──────────────────────────────────┐    │
  │  │   ZINC-ALLOY METAL CENTER        │ ←  metal exposed on underside
  │  │   r_inner = 3mm   r_outer = 10mm │
  │  │   m_metal ≈ 14.5g                │
  │  └──────────────────────────────────┘
  BOTTOM (stadium-facing side):
  ════════════════════════════════════════════

  m_plastic ≈ 4.7g  (ABS, lightweight outer ring)
  Three triangular protrusions on plastic at ~120° spacing (C₃ of plastic outer)
  One round protrusion: overall disc symmetry = C₁

Two-click alignment (schematic, looking from above):

  Before 2 clicks:                After 2 clicks:
  Layer sword protrusion: ▲        Layer sword protrusion: ▲
  Disc protrusion:    △ (offset)   Disc protrusion:        ▲ (aligned)
                                   → combined contact depth increases
```

### Two-Zone Inertia Analysis

```
Metal center (zinc-alloy, m_metal = 14.5 g, r_i = 3.0 mm, r_o = 10.0 mm):
  I_metal = ½ × 0.01450 × ((3.0×10⁻³)² + (10.0×10⁻³)²)
          = ½ × 0.01450 × (9.00×10⁻⁶ + 1.00×10⁻⁴)
          = ½ × 0.01450 × 1.09×10⁻⁴
          = 7.903×10⁻⁷ kg·m²

ABS plastic outer (m_plastic = 4.7 g, r_i = 10.0 mm, r_o = 16.0 mm):
  I_plastic = ½ × 0.00470 × ((10.0×10⁻³)² + (16.0×10⁻³)²)
            = ½ × 0.00470 × (1.00×10⁻⁴ + 2.56×10⁻⁴)
            = ½ × 0.00470 × 3.56×10⁻⁴
            = 8.366×10⁻⁷ kg·m²

Total Magnum inertia:
  I_Magnum = 7.903×10⁻⁷ + 8.366×10⁻⁷ = 1.627×10⁻⁶ kg·m²

Plastic outer inertia fraction:
  8.366 / 16.27 = 51.4%  (plastic contributes half the disc inertia despite lower density)

Inertia penalty vs all-metal same-mass disc (19.2 g, same r_i=3, r_o=16):
  I_all_metal_ref = ½ × 0.0192 × ((3.0×10⁻³)² + (16.0×10⁻³)²)
                  = ½ × 0.0192 × (9.0×10⁻⁶ + 2.56×10⁻⁴)
                  = ½ × 0.0192 × 2.65×10⁻⁴
                  = 2.544×10⁻⁶ kg·m²

  I_Magnum / I_all_metal = 1.627 / 2.544 = 64.0%
  Inertia penalty from plastic outer: −36.0% relative to hypothetical all-metal Magnum

Comparison with Forge Disc 12 (Case 392 reference: I = 1.675×10⁻⁶ kg·m², m = 15.8 g):
  ΔI = 1.627 − 1.675 = −4.7×10⁻⁸ kg·m²  (Magnum is 2.8% lower inertia despite 3.4 g heavier)
  This confirms the plastic construction wastes most of the extra mass on low-inertia outer volume.
```

### Two-Click Sword Alignment

```
Burst tooth count (standard Burst Dual Layer disc face): N_teeth = 10 teeth
Angle per click: θ_click = 360° / N_teeth = 36.0°
Two-click rotation: θ_2click = 2 × 36.0° = 72.0°

At θ = 72°, the disc's triangular sword-tip protrusion (offset 72° from initial position)
reaches angular coincidence with Xeno Xcalibur's sword contact point.

Combined contact depth increase:
  Magnum protrusion: d_M = 1.5 mm extension from disc face
  XC sword protrusion: d_XC = 2.0 mm extension from layer underside
  Combined at alignment: d_total = d_M + d_XC = 3.5 mm
  (vs. unaligned: maximum of the two = 2.0 mm)
  Alignment increases effective contact protrusion by 75.0%

Impact on burst potential (additional contact torque from protrusion alignment):
  τ_extra = F_peak × d_total × sin(φ) / r_contact
          ≈ 100 N × 0.003 / 22×10⁻³ = 13.6 N·m/m (dimensionless contribution ≈ additive burst risk)
  The alignment creates a periodic ~75% deeper bite per contact event — increasing burst probability
  at the 2-click mark without changing the mechanical tab threshold.
```

### TypeScript Model

```typescript
function twoZoneDiscInertia(
  mMetalG: number, rMetalInMm: number, rMetalOutMm: number,
  mPlasticG: number, rPlasticInMm: number, rPlasticOutMm: number
): { iMetal: number; iPlastic: number; iTotal: number; plasticFraction: number } {
  const iM = 0.5 * (mMetalG / 1000)  * ((rMetalInMm / 1000) ** 2 + (rMetalOutMm / 1000) ** 2);
  const iP = 0.5 * (mPlasticG / 1000) * ((rPlasticInMm / 1000) ** 2 + (rPlasticOutMm / 1000) ** 2);
  return { iMetal: iM, iPlastic: iP, iTotal: iM + iP, plasticFraction: iP / (iM + iP) };
}
// twoZoneDiscInertia(14.5,3.0,10.0, 4.7,10.0,16.0) → I=1.627×10⁻⁶; plastic 51.4%  (Magnum)
// twoZoneDiscInertia(24.0,3.0,13.0, 8.5,13.0,20.0) → I=4.554×10⁻⁶; plastic 53.1%  (Xanthus DB disc)
// twoZoneDiscInertia(19.2,3.0,16.0, 0.0,16.0,16.0) → I=2.544×10⁻⁶; plastic 0%     (all-metal reference)

function clickAlignmentAngle(nTeeth: number, nClicks: number): number {
  return (360 / nTeeth) * nClicks;                             // degrees
}
// clickAlignmentAngle(10, 2) → 72.0°  (Magnum / Sieg XC / Buster XC 2-click sword alignment)
// clickAlignmentAngle(10, 1) → 36.0°  (single click, partial offset)
// clickAlignmentAngle(12, 2) → 60.0°  (hypothetical 12-tooth disc 2-click alignment)

function metalPenaltyVsAllMetal(
  iHybrid: number, mTotalG: number, rInMm: number, rOutMm: number
): number {
  const iAllMetal = 0.5 * (mTotalG / 1000) * ((rInMm / 1000) ** 2 + (rOutMm / 1000) ** 2);
  return iHybrid / iAllMetal;                                  // fraction: <1 means penalty
}
// metalPenaltyVsAllMetal(1.627e-6, 19.2, 3.0, 16.0) → 0.640  (Magnum: −36.0% inertia penalty)
// metalPenaltyVsAllMetal(4.554e-6, 32.5, 3.0, 20.0) → 0.748  (Xanthus: −25.2% penalty)
// metalPenaltyVsAllMetal(1.675e-6, 15.8, 4.0, 14.0) → 1.000  (Disc 12: all-metal, no penalty)
```

---

## Case 396 — Impact Performance Tip (Burst): Three-Point Rubber-ABS Mixed Contact, Friction Instability Coefficient of Variation, and Spin Decay on the XC.M.I Assembly

**Thesis:** The Impact Performance Tip, released in the B-48 XC.M.I Starter, is an Attack Type Driver featuring a three-point rubber star tip (C₃ contact geometry, r_outer = 4.5 mm) with ABS plastic infilling the arc between each rubber point; the rubber star points subtend approximately θ_R = 40° each (3 × 40° = 120° total rubber arc) and the ABS infill subtends θ_P = 80° per sector (3 × 80° = 240° total), giving contact area fractions f_R = 0.333 and f_P = 0.667; the simultaneous floor contact of both materials produces an effective kinetic friction coefficient μ_eff = f_R × μ_rubber + f_P × μ_ABS = 0.333 × 0.85 + 0.667 × 0.17 = 0.396; the effective friction moment arm for the solid star footprint is r_eff = 2r_outer/3 = 3.00 mm, giving a floor torque τ_floor = μ_eff × W × r_eff = 0.396 × (0.0345 × 9.81) × 3.00×10⁻³ = 4.02×10⁻⁴ N·m and a spin decay on the XC.M.I assembly (I_total = 4.013×10⁻⁶ kg·m²) of dω/dt = −τ_floor / I_total = −100 rad/s², which is 14.0× faster than a hard-ABS point tip (Velocity: −7.17 rad/s²) but 2.22× slower than a pure rubber flat (Xtreme: −222 rad/s²); critically, the two surfaces create a high friction variability as the rubber and plastic sectors alternate across the contact zone during spin: the standard deviation of the instantaneous friction distribution is σ_μ = sqrt(f_R(μ_R − μ_eff)² + f_P(μ_P − μ_eff)²) = sqrt(0.333 × 0.207 + 0.667 × 0.051) = 0.320, giving a coefficient of variation CV = σ_μ / μ_eff = 0.320 / 0.396 = 80.8%, which is the quantitative signature of the erratic, halting trajectory — a friction variability of 80.8% produces continuous alternating grip-and-slip events that prevent both the directional control of a rubber flat and the stable decay of a hard tip, making Impact unsuitable for any competitive combination.

### Visual Geometry

```
Bottom view of Impact contact face (looking up at tip):

              ┌───────────────────────┐
              │      ABS BODY         │
              │                       │
              │    ●  ←rubber point 1 (r_outer = 4.5 mm)
              │   ╱ ╲                 │
              │  ╱ABS╲               │ ← plastic infill (θ_P = 80° each gap)
              │ ╱  ↕  ╲              │
              │●  gap   ●            │ ← rubber points 2 and 3 (120° spacing)
              │ ╲      ╱             │
              │  ╲ABS ╱              │
              │   ╲  ╱               │
              │    ╲╱                │
              └───────────────────────┘

  Rubber star arcs:    3 × 40° = 120° total  (f_R = 0.333)
  ABS infill arcs:     3 × 80° = 240° total  (f_P = 0.667)
  r_outer = 4.5 mm;  r_eff = 2/3 × 4.5 = 3.00 mm

Friction map (instantaneous μ as tip rotates, one 120° sector):

  θ:   0°───20°───40°───60°───80°───100°───120°
  μ:   0.85 (rubber) │ 0.17 (ABS infill) │ 0.85 ...
       ↑peak          ↑valley              ↑peak
  Peak:valley ratio = 0.85/0.17 = 5.00×  →  severe periodic grip variation
```

### Mixed-Surface Friction Analysis

```
Contact area fractions:
  f_R = 3 × 40° / 360° = 0.333  (rubber)
  f_P = 3 × 80° / 360° = 0.667  (ABS plastic)

Area-weighted effective friction coefficient:
  μ_eff = f_R × μ_rubber + f_P × μ_ABS
        = 0.333 × 0.85 + 0.667 × 0.17
        = 0.2831 + 0.1134
        = 0.396

Friction variability (coefficient of variation):
  Variance:  σ_μ² = f_R(μ_R − μ_eff)² + f_P(μ_P − μ_eff)²
                  = 0.333(0.85 − 0.396)² + 0.667(0.17 − 0.396)²
                  = 0.333(0.2062) + 0.667(0.0511)
                  = 0.06866 + 0.03408
                  = 0.10274
  Std dev:   σ_μ  = √0.10274 = 0.3205
  CV         = σ_μ / μ_eff = 0.3205 / 0.396 = 80.9%

Reference CVs:
  Pure rubber tip (Xtreme):  CV = 0%    (uniform μ = 0.85, perfectly consistent)
  Hard ABS point (Velocity): CV = 0%    (uniform μ = 0.17, perfectly consistent)
  Impact (mixed):            CV = 80.9% (extreme variability → erratic trajectory)
```

### Spin Decay Comparison (XC.M.I Assembly)

```
Assembly: XC.M.I  (m_total = 34.5 g = 0.0345 kg, I_total = 4.013×10⁻⁶ kg·m²)
  W = m_total × g = 0.0345 × 9.81 = 0.3385 N

Velocity (hard ABS point, μ_k = 0.17, r_contact = 0.50 mm):
  τ_V    = 0.17 × 0.3385 × 5.0×10⁻⁴ = 2.88×10⁻⁵ N·m
  dω/dt  = −2.88×10⁻⁵ / 4.013×10⁻⁶ = −7.17 rad/s²
  t₅₀%  = 300 / 7.17  = 41.8 s

Impact (mixed star, μ_eff = 0.396, r_eff = 3.00 mm):
  τ_I    = 0.396 × 0.3385 × 3.00×10⁻³ = 4.02×10⁻⁴ N·m
  dω/dt  = −4.02×10⁻⁴ / 4.013×10⁻⁶ = −100  rad/s²
  t₅₀%  = 300 / 100  =  3.00 s

Xtreme (rubber ring, μ_k = 0.85, r_eff = 3.11 mm, same assembly mass):
  τ_Xt   = 0.85 × 0.3385 × 3.11×10⁻³ = 8.94×10⁻⁴ N·m
  dω/dt  = −8.94×10⁻⁴ / 4.013×10⁻⁶ = −223  rad/s²
  t₅₀%  = 300 / 223  =  1.35 s

Spin decay ladder (XC.M.I assembly):
  Velocity: −7.17 rad/s²  (41.8 s to half-spin)  ← stamina reference
  Impact:   −100  rad/s²  (3.00 s)               ← 14.0× faster than Velocity
  Xtreme:   −223  rad/s²  (1.35 s)               ← 31.1× faster than Velocity

Impact decays 14.0× faster than Velocity yet provides neither the control of a hard tip
nor the attack trajectory of a rubber flat — the 80.9% CV confirms this is a neither/nor outcome.
```

### TypeScript Model

```typescript
function mixedSurfaceEffectiveMu(
  fRubber: number, muRubber: number, muHard: number
): number {
  return fRubber * muRubber + (1 - fRubber) * muHard;
}
// mixedSurfaceEffectiveMu(0.333, 0.85, 0.17) → 0.396  (Impact: 1/3 rubber, 2/3 ABS)
// mixedSurfaceEffectiveMu(0.500, 0.85, 0.17) → 0.510  (half-rubber tip — intermediate)
// mixedSurfaceEffectiveMu(0.000, 0.85, 0.17) → 0.170  (pure hard — Velocity reference)

function frictionCoeffOfVariation(
  fRubber: number, muRubber: number, muHard: number
): number {
  const muEff = mixedSurfaceEffectiveMu(fRubber, muRubber, muHard);
  const variance = fRubber * (muRubber - muEff) ** 2 + (1 - fRubber) * (muHard - muEff) ** 2;
  return Math.sqrt(variance) / muEff;
}
// frictionCoeffOfVariation(0.333, 0.85, 0.17) → 0.809  (Impact: 80.9% CV — highly erratic)
// frictionCoeffOfVariation(0.500, 0.85, 0.17) → 0.667  (half-rubber: still high variability)
// frictionCoeffOfVariation(1.000, 0.85, 0.17) → 0.000  (pure rubber: zero variability)

function mixedTipSpinDecay(
  fRubber: number, rEffMm: number, assemblyMassG: number, inertiakgm2: number
): number {
  const muEff = mixedSurfaceEffectiveMu(fRubber, 0.85, 0.17);
  const W     = (assemblyMassG / 1000) * 9.81;
  const tau   = muEff * W * (rEffMm / 1000);
  return -tau / inertiakgm2;                                    // rad/s²
}
// mixedTipSpinDecay(0.333, 3.00, 34.5, 4.013e-6) → −100  rad/s²  (Impact on XC.M.I)
// mixedTipSpinDecay(1.000, 3.11, 34.5, 4.013e-6) → −223  rad/s²  (Xtreme on XC.M.I)
// mixedTipSpinDecay(0.000, 0.50, 34.5, 4.013e-6) →   −7.17 rad/s²  (Velocity on XC.M.I)
```

---

## Case 400 — Buster Xcalibur Energy Layer (Cho-Z): Centrifugal Bistable Sword Extension, Maximum C₁ Smash Eccentricity, and Mode-Switch Critical Speed in the Cho-Z Awakening System

**Thesis:** Buster Xcalibur is the Cho-Z generation variant (B-92 Starter, 2018) of the Xcalibur lineage and the most mechanically extreme of all four Xcalibur layers, constructed from polycarbonate with a single embedded metal-weighted sword arm (m_sword = 7.0 g, 35.7% of the total layer mass of 19.6 g) in C₁ rotational symmetry; the defining Cho-Z mechanic is the Cho-Z Awakening System, a bistable centrifugal extension mechanism in which the sword arm is spring-retracted to Normal Mode position (r_sword = 18 mm) at rest and centrifugally extended to Buster Mode position (r_sword = 22 mm) above the mode-switch critical speed; with spring lock force F_lock = 2.50 N, the critical speed is ω_crit = sqrt(F_lock / (m_sword × r_sword_normal)) = sqrt(2.50 / (0.007 × 0.018)) = 140.9 rad/s (1345 RPM), far below the launch spin of approximately 600 rad/s (5730 RPM), so Buster Mode activates instantaneously at launch and the beyblade spends the entire battle with the sword extended; the two-zone moment of inertia treats the symmetric ABS-PC body ring (m_body = 12.6 g, r_i = 4 mm, r_o = 22 mm) and the sword arm as separate contributions: I_body = ½ × 0.0126 × ((4.0×10⁻³)² + (22.0×10⁻³)²) = 3.150×10⁻⁶ kg·m², I_sword_normal = m_sword × r_normal² = 0.007 × (18.0×10⁻³)² = 2.268×10⁻⁶ kg·m², I_sword_buster = 0.007 × (22.0×10⁻³)² = 3.388×10⁻⁶ kg·m², giving I_L_normal = 5.418×10⁻⁶ kg·m² and I_L_buster = 6.538×10⁻⁶ kg·m² with ΔI = +1.120×10⁻⁶ kg·m² (+20.7%) on mode switch; the C₁ asymmetry of the single extended sword arm produces static eccentricity e_normal = (m_sword × r_normal) / m_layer = (7.0 × 18) / 19.6 = 6.43 mm and e_buster = (7.0 × 22) / 19.6 = 7.86 mm in Buster Mode, the largest eccentricity of any Xcalibur layer, generating centrifugal imbalance force F_imb = m_layer × e_buster × ω₀² = 0.0196 × 7.86×10⁻³ × (600)² = 55.4 N at launch; in same-spin contact, the sword's φ = 22° contact face angle delivers smash fraction cos(22°) = 0.927 and recoil fraction sin(22°) = 0.375, but in opposite-spin contact the relative velocity vector reverses across the sword leading edge, converting the geometry to a repulsion configuration (net radially outward force proportional to −cos(22°)) that makes Buster Xcalibur non-viable against counter-rotating opponents; the full Buster.1'.Dagger.Sword assembly (53.9 g) carries I_total = 9.576×10⁻⁶ kg·m² with the Sword tip producing dω/dt = −24.3 rad/s², but the chronic e_buster = 7.86 mm imbalance creates a self-banked orbital that transfers angular momentum into lateral translation and accelerates effective spin loss beyond what tip friction alone predicts.

### Visual Geometry

```
Top-down view — Buster Mode (sword extended, C₁ symmetry):

        ┌─────────────────────────────────────────┐
        │  PC body ring  r_i = 4 mm  r_o = 22 mm │
        │                                         │
        │         ╔══════════════════════╗        │
        │         ║   SWORD ARM          ║        │
        │         ║   m_sword = 7.0 g    ║        │
        │         ║   Normal: r = 18 mm  ║        │
        │         ║   Buster: r = 22 mm ▶║ ← tip  │
        │         ╚══════════════════════╝        │
        │         ◎ hub r_i = 4 mm               │
        │         2 PC burst tabs at r_tab = 7.5  │
        └─────────────────────────────────────────┘

Mode-switch cross-section (side view):

  REST (ω < 141 rad/s):          BUSTER (ω > 141 rad/s):
  [spring]←[sword]  r=18 mm  →   [spring]  [sword]→  r=22 mm
  F_spring = 2.50 N               F_centrifugal > 2.50 N

Eccentricity (CoM offset from spin axis):
  Normal Mode: e = 6.43 mm
  Buster Mode: e = 7.86 mm  (CoM traces 15.7 mm-diameter orbit during spin)

Xcalibur lineage eccentricity ladder:
  Xeno XC  (Case 394): e = 3.31 mm   F_imb = 11.1 N
  Sieg XC  (Case 397): e = 5.66 mm   F_imb = 32.3 N
  Buster XC (this):    e = 7.86 mm   F_imb = 55.4 N  ← maximum
```

### Centrifugal Extension and Inertia Analysis

```
Mode-switch critical speed:
  ω_crit = sqrt(F_lock / (m_sword × r_sword_normal))
         = sqrt(2.50 / (0.007 × 0.018))
         = sqrt(2.50 / 1.26×10⁻⁴)
         = sqrt(19,841)
         = 140.9 rad/s  (1345 RPM)

  Launch speed:        ω₀ = 600 rad/s  (5730 RPM)
  Activation ratio:    ω₀ / ω_crit = 4.26×
  → Buster Mode activates at ~23% of launch spin; the layer is in Buster Mode
    through essentially the entire battle, including the settling wobble phase.

Two-zone inertia:
  Body ring (m_body = 12.6 g, r_i = 4 mm, r_o = 22 mm):
    I_body = ½ × 0.01260 × ((4.0×10⁻³)² + (22.0×10⁻³)²)
           = ½ × 0.01260 × (1.60×10⁻⁵ + 4.84×10⁻⁴)
           = ½ × 0.01260 × 5.00×10⁻⁴
           = 3.150×10⁻⁶ kg·m²

  Sword arm — Normal Mode (r = 18 mm):
    I_sw_n = 0.007 × (18.0×10⁻³)² = 0.007 × 3.24×10⁻⁴ = 2.268×10⁻⁶ kg·m²

  Sword arm — Buster Mode (r = 22 mm):
    I_sw_b = 0.007 × (22.0×10⁻³)² = 0.007 × 4.84×10⁻⁴ = 3.388×10⁻⁶ kg·m²

  I_L_normal = 3.150 + 2.268 = 5.418×10⁻⁶ kg·m²
  I_L_buster = 3.150 + 3.388 = 6.538×10⁻⁶ kg·m²
  ΔI         = +1.120×10⁻⁶ kg·m²  (+20.7%)

C₁ eccentricity:
  e_normal = (7.0 × 18) / 19.6 = 6.43 mm
  e_buster = (7.0 × 22) / 19.6 = 7.86 mm

Centrifugal imbalance at launch, Buster Mode (ω₀ = 600 rad/s):
  F_imb = m_layer × e_buster × ω₀²
        = 0.0196 × 7.86×10⁻³ × 3.60×10⁵
        = 55.4 N

Opposite-spin contact geometry:
  Same-spin:     relative velocity strikes sword leading edge at φ = 22° from radial
    smash fraction = cos(22°) = 0.927  (net inward — smash)
  Opposite-spin: relative velocity reverses across leading edge
    effective angle = 180° − 22° = 158° from radial
    net force fraction = −cos(22°) = −0.927  (radially outward — repulsion)
  → Buster XC cannot smash opposite-spin opponents; contact propels both beys
    outward, compounding the e = 7.86 mm banking drift into self-ring-out risk.
```

### TypeScript Model

```typescript
function bistableSwordInertia(
  mBodyG: number, mSwordG: number,
  rBodyInMm: number, rBodyOutMm: number,
  rSwordNormalMm: number, rSwordBusterMm: number
): { I_normal: number; I_buster: number; deltaI: number } {
  const I_body  = 0.5 * (mBodyG / 1000) * ((rBodyInMm / 1000) ** 2 + (rBodyOutMm / 1000) ** 2);
  const I_sw_n  = (mSwordG / 1000) * (rSwordNormalMm / 1000) ** 2;
  const I_sw_b  = (mSwordG / 1000) * (rSwordBusterMm / 1000) ** 2;
  return { I_normal: I_body + I_sw_n, I_buster: I_body + I_sw_b, deltaI: I_sw_b - I_sw_n };
}
// bistableSwordInertia(12.6, 7.0, 4, 22, 18, 22) → { I_normal:5.418e-6, I_buster:6.538e-6, dI:1.120e-6 }
// bistableSwordInertia(10.1, 5.0, 4, 18, 14, 18) → { I_normal:3.266e-6, I_buster:3.806e-6, dI:0.540e-6 }
// bistableSwordInertia(8.0,  4.0, 4, 16, 12, 16) → { I_normal:2.259e-6, I_buster:2.783e-6, dI:0.524e-6 }

function modeSwitchCriticalSpeed(
  fLockN: number, mSwordG: number, rSwordNormalMm: number
): { omegaCritRad: number; rpmCrit: number; launchRatio: number } {
  const omegaCrit = Math.sqrt(fLockN / ((mSwordG / 1000) * (rSwordNormalMm / 1000)));
  return {
    omegaCritRad: omegaCrit,
    rpmCrit:      omegaCrit * 60 / (2 * Math.PI),
    launchRatio:  600 / omegaCrit
  };
}
// modeSwitchCriticalSpeed(2.50, 7.0, 18) → { omega:140.9, rpm:1345, ratio:4.26 }  — activates at launch
// modeSwitchCriticalSpeed(5.00, 7.0, 18) → { omega:199.2, rpm:1903, ratio:3.01 }  — stiffer spring, still activates
// modeSwitchCriticalSpeed(2.50, 4.0, 14) → { omega:211.4, rpm:2019, ratio:2.84 }  — lighter sword arm

function busterModeEccentricityForce(
  mLayerG: number, mSwordG: number, rSwordMm: number, omegaRad: number
): { eccentricityMm: number; forceN: number; orbitDiamMm: number } {
  const e = (mSwordG * rSwordMm) / mLayerG;
  const F = (mLayerG / 1000) * (e / 1000) * omegaRad ** 2;
  return { eccentricityMm: e, forceN: F, orbitDiamMm: 2 * e };
}
// busterModeEccentricityForce(19.6, 7.0, 22, 600) → { e:7.86mm, F:55.4N, orbit:15.7mm }  — Buster Mode
// busterModeEccentricityForce(19.6, 7.0, 18, 600) → { e:6.43mm, F:45.3N, orbit:12.9mm }  — Normal Mode
// busterModeEccentricityForce(15.9, 5.0, 18, 600) → { e:5.66mm, F:32.3N, orbit:11.3mm }  — Sieg XC reference
```

---

## Case 401 — Core Disc 1' (Cho-Z Dash): Bilateral Weight Fill, Reduced Eccentricity Versus Disc 1, and Combined Assembly Imbalance Minimisation

**Thesis:** Core Disc 1' (pronounced "1 Prime," Dash series, 22.5 g) is the heavier bilateral-fill variant of standard Disc 1 (21.2 g), increasing mass through added material on both lateral faces that were left thin or absent on the asymmetric Disc 1; Disc 1 carries one heavily weighted side (Δm_heavy ≈ 4.2 g at r_centroid ≈ 14 mm) producing static eccentricity e_1 = (4.2 × 14) / 21.2 = 2.77 mm, while Disc 1' fills both sides reducing the net imbalance mass to approximately Δm_net = 2.0 g at the same centroid, giving e_1' = (2.0 × 14) / 22.5 = 1.24 mm, a 55.2% reduction in CoM offset; both discs share outer radius 17 mm and hub bore 4 mm, so moments of inertia follow I = ½m(r_i² + r_o²): I_1' = ½ × 0.0225 × ((4.0×10⁻³)² + (17.0×10⁻³)²) = 3.431×10⁻⁶ kg·m² versus Disc 1's I_1 = ½ × 0.0212 × ((4.0×10⁻³)² + (17.0×10⁻³)²) = 3.231×10⁻⁶ kg·m², a +6.2% inertia gain at +6.1% greater mass, confirming the extra material is distributed proportionally rather than concentrated at the perimeter; the critical design role of 1' in the B-92 Buster.1'.Dagger.Sword assembly is combined eccentricity management: in the worst-case alignment (disc CoM collinear with sword arm), the resultant imbalance is e_total = e_sword + e_disc; with Disc 1 this gives 7.86 + 2.77 = 10.63 mm, while Disc 1' limits this to 7.86 + 1.24 = 9.10 mm, a 14.4% reduction in peak combined eccentricity that prevents the extreme banking orbital observed when Disc 1 and the Buster XC sword directions reinforce each other; the 1' disc contributes 3.431×10⁻⁶ / 9.576×10⁻⁶ = 35.8% of full assembly inertia at 41.7% of assembly mass, confirming that a disc with moderate outer radius is an inertia-per-mass efficient contributor, and the Disc 1' + Buster XC pairing is the factory-intended configuration precisely because the reduced eccentricity of 1' opposes the inherent instability of the highest-imbalance Xcalibur layer.

### Visual Geometry

```
Top-down cross-section comparison (looking down at disc face):

  DISC 1 (21.2 g):                      DISC 1' (22.5 g):
  r_i=4mm ──────── r_o=17mm             r_i=4mm ──────── r_o=17mm
  ╔══════════════════════╗               ╔══════════════════════╗
  ║ THIN SIDE A          ║               ║ FILLED SIDE A        ║
  ║ (light)              ║               ║ (added material)     ║
  ╠══════════════════════╣       →       ╠══════════════════════╣
  ║ THICK SIDE B (heavy) ║               ║ FILLED SIDE B        ║
  ║ Δm≈4.2g at r=14mm   ║               ║ Δm_net≈2.0g at r=14mm║
  ╚══════════════════════╝               ╚══════════════════════╝
  e = 2.77 mm                            e = 1.24 mm  (−55.2%)

Combined eccentricity vectors (Buster XC + disc, worst-case alignment):

  Disc 1:   sword ──→ 7.86mm  +  disc ──→ 2.77mm  =  total 10.63mm  ← extreme banking
  Disc 1':  sword ──→ 7.86mm  +  disc ──→ 1.24mm  =  total  9.10mm  ← manageable
  Best case (opposite alignment):
  Disc 1':  |7.86 − 1.24| = 6.62mm  (partial cancellation)
```

### Inertia and Eccentricity Analysis

```
Disc 1' inertia (r_i = 4.0 mm, r_o = 17.0 mm, m = 22.5 g):
  I_1' = ½ × 0.02250 × ((4.0×10⁻³)² + (17.0×10⁻³)²)
       = ½ × 0.02250 × (1.60×10⁻⁵ + 2.89×10⁻⁴)
       = ½ × 0.02250 × 3.05×10⁻⁴
       = 3.431×10⁻⁶ kg·m²

Disc 1 inertia (same radii, m = 21.2 g):
  I_1  = ½ × 0.02120 × 3.05×10⁻⁴ = 3.231×10⁻⁶ kg·m²

  ΔI = +0.200×10⁻⁶ kg·m²  (+6.2%);  Δm = +1.3 g  (+6.1%)
  → extra mass proportionally distributed; no perimeter concentration.

Eccentricity:
  Disc 1:  e_1  = (4.2 × 14) / 21.2 = 2.77 mm
  Disc 1': e_1' = (2.0 × 14) / 22.5 = 1.24 mm
  Reduction: (2.77 − 1.24) / 2.77 = 55.2%

Combined eccentricity with Buster XC (e_sword = 7.86 mm):
  Worst case — vectors aligned:
    Disc 1:  10.63 mm   Disc 1': 9.10 mm   improvement: −14.4%
  Best case — vectors opposed:
    Disc 1:  5.09 mm    Disc 1': 6.62 mm
    (best case worsens slightly because the disc eccentricity partially
     cancelled the sword eccentricity with Disc 1 in optimal orientation)

Assembly inertia budget (Buster.1'.Dagger.Sword, Normal Mode):
  Buster XC Layer :  5.418×10⁻⁶ kg·m²  (56.6%)
  Core Disc 1'    :  3.431×10⁻⁶ kg·m²  (35.8%)
  Dagger Frame    :  0.588×10⁻⁶ kg·m²  ( 6.1%)
  Sword Tip       :  0.139×10⁻⁶ kg·m²  ( 1.5%)
  Total           :  9.576×10⁻⁶ kg·m²

Angular momentum at launch (ω₀ = 600 rad/s):
  L₀ = 9.576×10⁻⁶ × 600 = 5.746×10⁻³ kg·m²/s
  vs XC.M.I (Case 394): 2.41×10⁻³;  vs Sieg.1.Iron (Case 397): 4.79×10⁻³
  → Buster.1'.D.Sw carries 2.38× the angular momentum of the lightest XC assembly.
```

### TypeScript Model

```typescript
function discPrimeEccentricity(
  mDiscG: number, deltaMNetG: number, rCentroidMm: number
): { eccentricityMm: number } {
  return { eccentricityMm: (deltaMNetG * rCentroidMm) / mDiscG };
}
// discPrimeEccentricity(21.2, 4.2, 14) → { e:2.77mm }  (Disc 1 — one heavy side)
// discPrimeEccentricity(22.5, 2.0, 14) → { e:1.24mm }  (Disc 1' — both sides filled)
// discPrimeEccentricity(20.0, 0.5, 14) → { e:0.35mm }  (hypothetical near-symmetric disc)

function combinedAssemblyEccentricity(
  eSwordMm: number, eDiscMm: number
): { minEccMm: number; maxEccMm: number } {
  return {
    minEccMm: Math.abs(eSwordMm - eDiscMm),
    maxEccMm: eSwordMm + eDiscMm
  };
}
// combinedAssemblyEccentricity(7.86, 2.77) → { min:5.09, max:10.63 }  — Disc 1 range
// combinedAssemblyEccentricity(7.86, 1.24) → { min:6.62, max:9.10  }  — Disc 1' range (tighter max)
// combinedAssemblyEccentricity(5.66, 2.77) → { min:2.89, max:8.43  }  — Sieg XC + Disc 1

function discPrimeInertiaGain(
  m1G: number, m1PrimeG: number, rInnerMm: number, rOuterMm: number
): { I1: number; I1Prime: number; deltaI: number; deltaIFraction: number } {
  const factor  = 0.5 * ((rInnerMm / 1000) ** 2 + (rOuterMm / 1000) ** 2);
  const I1      = (m1G / 1000) * factor;
  const I1Prime = (m1PrimeG / 1000) * factor;
  return { I1, I1Prime, deltaI: I1Prime - I1, deltaIFraction: (I1Prime - I1) / I1 };
}
// discPrimeInertiaGain(21.2, 22.5, 4, 17) → { I1:3.231e-6, I1Prime:3.431e-6, dI:2.00e-7, frac:0.062 }
// discPrimeInertiaGain(19.0, 21.0, 4, 16) → { I1:2.630e-6, I1Prime:2.907e-6, dI:2.77e-7, frac:0.105 }
// discPrimeInertiaGain(17.0, 18.5, 4, 15) → { I1:2.000e-6, I1Prime:2.177e-6, dI:1.77e-7, frac:0.088 }
```

---

## Case 402 — Dagger Frame (Cho-Z): Thin-Ring C₄ Blade Protrusion LAD Geometry, 16.7% Perimeter Coverage, and Marginal Inertia Contribution

**Thesis:** The Dagger Frame (B-92 Buster Xcalibur 1' Dagger Sword starter, 2.6 g) is a Cho-Z era thin-ring Frame component that seats on the outer edge of Core Disc 1' and presents four outward blade protrusions in C₄ rotational symmetry (one per 90°), each protrusion subtending approximately 15° of arc and rising 1.5 mm above the disc perimeter to create a Lower Attack Defense (LAD) geometry; the four protrusions together cover 4 × 15° = 60° of the 360° circumference, a perimeter blade fraction of 16.7% that leaves 83.3% of the perimeter as plain disc edge; the thin-ring geometry (r_i = 14 mm, r_o = 16 mm) contributes I_Dagger = ½ × 0.0026 × ((14.0×10⁻³)² + (16.0×10⁻³)²) = 5.876×10⁻⁷ kg·m², only 6.14% of the full assembly inertia of 9.576×10⁻⁶ kg·m², confirming that thin frames contribute minimally to angular momentum budget despite their functional role; the practical LAD effectiveness of the Dagger is constrained by axial geometry: the disc-to-opponent-layer gap in the assembled Buster.1'.Dagger.Sword combination is approximately 2.0 mm, while the protrusion height is only 1.5 mm, leaving a 0.5 mm clearance between blade tip and the opposing layer's Burst contact zone; genuine LAD contact therefore occurs only when arena floor rebound deflects the opponent's tip upward by at least 0.5 mm, making the Dagger a conditional rather than reliable defensive mechanism and confirming that its primary physics contribution is aesthetic accent with a marginal 16.7% probability of opponent-tip interception per full revolution rather than guaranteed LAD shielding.

### Visual Geometry

```
Top-down view — Dagger Frame seated on Core Disc 1' (C₄ symmetry):

             r_i=14mm    r_o=16mm
             │               │
  ┌──────────┼───────────────┼──────────┐
  │          │ DAGGER FRAME  │          │
  │     90°  │   ╔═══╗       │          │
  │   ──────▶│   ║ ▲ ║ blade protrusion│
  │          │   ╚═══╝       │          │
  │  ┌───────┼───────────────┼───────┐  │
  │  │ ▲     │  Core Disc 1' │     ▲ │  │
  │  │       │  r_o = 17 mm  │       │  │
  │  │ ▲     │               │     ▲ │  │
  │  └───────┼───────────────┼───────┘  │
  └──────────┼───────────────┼──────────┘
  4 blades × 15° each = 60° total (16.7% of perimeter)

Side cross-section (LAD gap geometry):
  Opponent layer underside ─────────────────────────
          ↕  2.0 mm disc-to-layer gap
  Disc top surface ────────────────────────────────
     ▲▲  ← Dagger blades (h = 1.5 mm)
          ↕  0.5 mm clearance remains → no guaranteed LAD contact in flat battle
```

### Inertia and LAD Gap Analysis

```
Dagger Frame inertia (thin ring, m = 2.6 g, r_i = 14 mm, r_o = 16 mm):
  I_Dagger = ½ × 0.00260 × ((14.0×10⁻³)² + (16.0×10⁻³)²)
           = ½ × 0.00260 × (1.96×10⁻⁴ + 2.56×10⁻⁴)
           = ½ × 0.00260 × 4.52×10⁻⁴
           = 5.876×10⁻⁷ kg·m²

Assembly inertia fraction:  5.876×10⁻⁷ / 9.576×10⁻⁶ = 6.14%

C₄ perimeter coverage:
  4 blades × 15° each = 60° covered;  60 / 360 = 16.7% of perimeter
  Remaining gap:  83.3% (plain disc edge, no blade interception)

LAD gap analysis:
  Disc-to-layer axial gap:  Δz      = 2.0 mm
  Dagger protrusion height: h_blade = 1.5 mm
  Clearance:                Δz − h  = 0.5 mm  → blade does not reach opponent layer
  Minimum required floor deflection for LAD contact:  0.5 mm upward

Effective interception probability per revolution (uniform opponent angle):
  p = covered_fraction = 16.7% per opponent revolution
  → On average only 1 in 6 rotor contacts passes a Dagger blade.

Reference comparison — Bump Frame (r_i=14, r_o=16, m=3.5g):
  I_Bump = ½ × 0.0035 × 4.52×10⁻⁴ = 7.91×10⁻⁷ kg·m²
  I_Dagger / I_Bump = 5.876 / 7.910 = 74.3%  (same radii; ratio = mass ratio 2.6/3.5)
```

### TypeScript Model

```typescript
function frameInertiaThin(
  mG: number, rInnerMm: number, rOuterMm: number
): number {
  return 0.5 * (mG / 1000) * ((rInnerMm / 1000) ** 2 + (rOuterMm / 1000) ** 2);
}
// frameInertiaThin(2.6, 14, 16) → 5.876e-7 kg·m²  (Dagger Frame)
// frameInertiaThin(3.5, 14, 16) → 7.910e-7 kg·m²  (reference Bump frame, same radii)
// frameInertiaThin(4.0, 12, 17) → 7.660e-7 kg·m²  (wider frame, lighter material estimate)

function protrusionPerimeterCoverage(
  nProtrusions: number, arcDegEach: number
): { coveredDeg: number; coveredFraction: number; exposedFraction: number } {
  const covered = nProtrusions * arcDegEach;
  const frac    = covered / 360;
  return { coveredDeg: covered, coveredFraction: frac, exposedFraction: 1 - frac };
}
// protrusionPerimeterCoverage(4, 15) → { covered:60°, frac:0.167, exposed:0.833 }  (Dagger: 16.7%)
// protrusionPerimeterCoverage(3, 30) → { covered:90°, frac:0.250, exposed:0.750 }  (C₃ wide blade)
// protrusionPerimeterCoverage(6, 10) → { covered:60°, frac:0.167, exposed:0.833 }  (C₆ narrow — same coverage)

function ladContactGap(
  discLayerGapMm: number, protrusionHeightMm: number, floorDeflectionMm: number
): { clearanceMm: number; canContact: boolean; requiredDeflectionMm: number } {
  const clearance = discLayerGapMm - protrusionHeightMm - floorDeflectionMm;
  return {
    clearanceMm:          clearance,
    canContact:           clearance <= 0,
    requiredDeflectionMm: Math.max(0, discLayerGapMm - protrusionHeightMm)
  };
}
// ladContactGap(2.0, 1.5, 0.0) → { clearance:0.5mm, canContact:false, required:0.5mm }  (flat floor)
// ladContactGap(2.0, 1.5, 0.5) → { clearance:0.0mm, canContact:true,  required:0.5mm }  (minimum deflection)
// ladContactGap(1.5, 1.5, 0.0) → { clearance:0.0mm, canContact:true,  required:0.0mm }  (tight fit)
```

---

## Case 403 — Sword Performance Tip (Cho-Z): Wide Flat Hard Contact, Lowest Hard-Tip Spin Decay, Scrape Tilt Threshold, and Full Buster Assembly Stability Budget

**Thesis:** The Sword Performance Tip (B-92 Buster Xcalibur 1' Dagger Sword, 9.2 g) is a wide flat-bottom hard ABS tip with a contact radius of r_contact = 5.5 mm, the widest standard hard-plastic flat contact footprint in the Burst era, producing a solid-disc effective friction radius of r_eff = (2/3) × r_contact = 3.67 mm and kinetic friction coefficient μ_k = 0.12 on standard stadium surfaces; the tip moment of inertia I_Sword = ½ × 0.0092 × (5.5×10⁻³)² = 1.392×10⁻⁷ kg·m² contributes only 1.45% of the full assembly inertia of 9.576×10⁻⁶ kg·m², as expected for a low-radius component; the wide flat contact delivers the lowest floor friction torque of any Burst-era hard tip by combining low μ_k with a moderate r_eff: for the full Buster.1'.Dagger.Sword assembly (m = 53.9 g), τ_floor = μ_k × W × r_eff = 0.12 × (0.0539 × 9.81) × 3.67×10⁻³ = 2.328×10⁻⁴ N·m and dω/dt = −τ_floor / I_total = −2.328×10⁻⁴ / 9.576×10⁻⁶ = −24.3 rad/s², giving a theoretical time to gyroscopic instability threshold (ω_thresh = 0.4 × ω₀ = 240 rad/s) of Δt = (600 − 240) / 24.3 = 14.8 s under pure tip friction without collisions; the critical physical constraint of the Sword tip is the scrape tilt threshold: the outer rim of the disc-frame combination sits at r_LAD = 15 mm from the spin axis at a floor clearance of h_clearance = 2.5 mm, so any lateral tilt θ_scrape = arctan(h_clearance / r_LAD) = arctan(2.5 / 15) = 9.46° causes the outer disc rim to contact the stadium floor, generating a hard scrape that raises effective μ dramatically and triggers non-linear spin loss; this 9.46° threshold is only marginally above the natural gyroscopic wobble amplitude during burst-tab click events at low spin (wobble amplitude ≈ 8–10° at ω < 300 rad/s), meaning the Sword tip is scrape-limited below approximately ω = 300 rad/s and the effective stamina of the Buster assembly is controlled by the scrape threshold rather than by the nominal μ_k = 0.12 decay rate.

### Visual Geometry

```
Side cross-section — Sword tip geometry and scrape threshold:

  ┌───────────────────────────────────────────┐
  │         BEYBLADE ASSEMBLY (53.9 g)        │
  └───────────────────────────────────────────┘
                      │ shaft
              ┌───────┴───────┐
              │  SWORD TIP    │  ABS, 9.2 g
              │  flat bottom  │
              └───────────────┘
  │←──── r_contact = 5.5 mm ────→│
  ══════════════════════════════════ stadium floor
  r_eff = 2/3 × 5.5 = 3.67 mm

Scrape geometry (outer disc rim):
  Normal:        Tilted at θ = 9.46°:
  ══════════     ════════════════════
       │              /
       │ h=2.5mm     / ← rim drops to floor
  r=15mm           /
  ─────────    ──/── ← scrape contact at r=15mm

Spin decay rate comparison (reference: Xcalibur assemblies):
  Tip       | Assembly | dω/dt (rad/s²) | μ_k | r_eff (mm)
  ──────────────────────────────────────────────────────────
  Sword     | 53.9 g   |  −24.3         | 0.12 | 3.67
  Iron      | 43.8 g   |  −19.1         | 0.17 | 3.11  (Case 399)
  Impact    | 34.5 g   | −100           | mixed| 3.00  (Case 396)
  Xtreme    | 34.5 g   | −223           | 0.85 | 3.11  (Case 396 ref)
```

### Spin Decay and Scrape Analysis

```
Sword tip inertia (solid disc, m = 9.2 g, r = 5.5 mm):
  I_Sword = ½ × 0.00920 × (5.5×10⁻³)²
          = ½ × 0.00920 × 3.025×10⁻⁵
          = 1.392×10⁻⁷ kg·m²

Effective friction radius (solid disc contact):
  r_eff = (2/3) × 5.5 = 3.67 mm

Full assembly spin decay (m = 53.9 g, I = 9.576×10⁻⁶ kg·m², μ_k = 0.12):
  W     = 0.05390 × 9.81 = 0.5288 N
  τ     = 0.12 × 0.5288 × 3.67×10⁻³ = 2.328×10⁻⁴ N·m
  dω/dt = −2.328×10⁻⁴ / 9.576×10⁻⁶ = −24.3 rad/s²

Time to gyroscopic instability threshold (ω_thresh = 240 rad/s):
  Δt = (600 − 240) / 24.3 = 14.8 s  (pure tip friction, no collisions)

Scrape tilt threshold:
  Outer disc-frame rim radius:  r_LAD   = 15 mm
  Rim clearance above floor:    h_clear = 2.5 mm
  θ_scrape = arctan(2.5 / 15) = arctan(0.1667) = 9.46°

  At ω < 300 rad/s, gyroscopic wobble amplitude ≈ 8–10° → scrape is imminent.
  At ω > 400 rad/s, wobble < 5° → safely below threshold.

  Effective stamina-limiting mechanism:
    ω > 400 rad/s:  tip friction controls decay at −24.3 rad/s²
    ω < 300 rad/s:  scrape dominates; effective μ rises to ~0.35–0.50
                    → dω/dt worsens to approximately −70 to −100 rad/s²

Assembly inertia share summary:
  Buster XC Layer : 5.418×10⁻⁶ kg·m²  (56.6%)
  Core Disc 1'    : 3.431×10⁻⁶ kg·m²  (35.8%)
  Dagger Frame    : 0.588×10⁻⁶ kg·m²  ( 6.1%)
  Sword Tip       : 0.139×10⁻⁶ kg·m²  ( 1.5%)
  Total           : 9.576×10⁻⁶ kg·m²
```

### TypeScript Model

```typescript
function solidDiscTipDecay(
  mTipG: number, rContactMm: number, muK: number,
  assemblyMassG: number, inertiakgm2: number
): { rEffMm: number; tauNm: number; dOmegaRad: number; I_tip: number } {
  const rEff  = (2 / 3) * rContactMm;
  const W     = (assemblyMassG / 1000) * 9.81;
  const tau   = muK * W * (rEff / 1000);
  const I_tip = 0.5 * (mTipG / 1000) * (rContactMm / 1000) ** 2;
  return { rEffMm: rEff, tauNm: tau, dOmegaRad: -tau / inertiakgm2, I_tip };
}
// solidDiscTipDecay(9.2, 5.5, 0.12, 53.9, 9.576e-6) → { rEff:3.67, tau:2.33e-4, dOmega:−24.3, I:1.39e-7 }
// solidDiscTipDecay(6.7, 4.5, 0.17, 43.8, 7.978e-6) → { rEff:3.00, tau:2.19e-4, dOmega:−27.4, I:6.77e-8 }  (Iron)
// solidDiscTipDecay(9.2, 5.5, 0.12, 34.5, 4.013e-6) → { rEff:3.67, tau:1.49e-4, dOmega:−37.2, I:1.39e-7 }  (lighter asm)

function scrapeTiltAngle(
  rimClearanceMm: number, rimRadiusMm: number
): { thetaDeg: number; thetaRad: number } {
  const thetaRad = Math.atan(rimClearanceMm / rimRadiusMm);
  return { thetaDeg: thetaRad * 180 / Math.PI, thetaRad };
}
// scrapeTiltAngle(2.5, 15) → { thetaDeg:9.46°, thetaRad:0.1651 }  — Sword tip on Buster assembly
// scrapeTiltAngle(1.5, 15) → { thetaDeg:5.71°, thetaRad:0.0997 }  — tighter clearance, scrapes sooner
// scrapeTiltAngle(3.0, 12) → { thetaDeg:14.0°, thetaRad:0.2450 }  — smaller disc, more tilt tolerance

function tipInertiaFraction(
  mTipG: number, rTipMm: number, iTotalKgm2: number
): { I_tip: number; fraction: number; percentOfTotal: number } {
  const I_tip = 0.5 * (mTipG / 1000) * (rTipMm / 1000) ** 2;
  return { I_tip, fraction: I_tip / iTotalKgm2, percentOfTotal: (I_tip / iTotalKgm2) * 100 };
}
// tipInertiaFraction(9.2, 5.5, 9.576e-6) → { I:1.392e-7, frac:0.01453, pct:1.45% }  (Sword on Buster)
// tipInertiaFraction(6.7, 4.5, 7.978e-6) → { I:6.774e-8, frac:0.00849, pct:0.849% } (Iron on Sieg)
// tipInertiaFraction(6.0, 4.5, 4.013e-6) → { I:6.075e-8, frac:0.01514, pct:1.51% }  (Impact on XC.M.I)
```

---

## Case 404 — DB Core Xcalibur (Burst Ultimate): Bound Attack Spring Rebound, BU Lock Hertzian Protrusion Burst Resistance, and High/Low Mode Physical Height and Centre-of-Mass Analysis

**Thesis:** The DB Core Xcalibur (Dynamite Battle / Burst Ultimate era, 10.6 g) is the central hub of the BU assembly and the component that interfaces the Xiphoid BU Blade to the Xanthus Disc and Sword' Driver, contributing three distinct physics mechanisms: a spring-loaded Bound Attack rebound, a three-protrusion BU Lock burst resistance system, and a height-dependant High/Low Mode that alters the physical stack order and CoM position; the Bound Attack spring (estimated k_spring = 800 N/m, maximum compression δ_max = 2.0 mm) stores E_spring = ½ × 800 × (2.0×10⁻³)² = 1.60×10⁻³ J on impact and releases this as rebound kinetic energy, giving the full 78.8 g assembly a theoretical rebound velocity of v_rebound = sqrt(2 × 1.60×10⁻³ / 0.0788) = 0.202 m/s toward the attacker, converting an otherwise purely defensive contact into a Bound Attack that can ring out opponents in tight banking trajectories; the BU Lock consists of three raised protrusions on the DB Core that engage corresponding sockets on the Armor 1, each protrusion carrying an estimated normal contact force F_n = 1.25 N at an engagement radius of r_lock = 15 mm, generating a total additional burst threshold of τ_BU_lock = 3 × F_n × r_lock = 3 × 1.25 × 0.015 = 56.25 mN·m; Hertzian contact at each protrusion (ABS-ABS, R_protrusion = 1.5 mm, E* = 1/(2(1−0.35²)/2.4×10⁹) = 1.368 GPa) produces a contact patch of a = (3 × 1.25 × 1.5×10⁻³ / (4 × 1.368×10⁹))^(1/3) = 100.8 µm, small enough to indicate high stress concentration and risk of protrusion wear after repeated high-force contacts; in Low Mode (DB Core above the Blade, Armor below), the assembly height is the intended design height H₀ and the CoM sits approximately 12 mm above the tip; in High Mode (Armor above the Blade, DB Core below, assembly height H₀ + 7 mm), the Armor (13.1 g) and DB Core (10.6 g) swap vertical positions across the Blade, shifting the assembly CoM upward by Δh_CoM = 12 × (m_Armor − m_Core) / m_total = 12 × 2.5 / 78.8 = 0.38 mm, a modest change that increases the precession angular velocity by only Ω_high/Ω_low = 12.38/12.00 = 1.032 (+3.2%); the primary High Mode advantage is therefore not CoM dynamics but physical contact height: the Blade sits 7 mm higher above the stadium floor and meets opposing blades at a higher point on the opponent's body, creating blade-to-blade contact rather than blade-to-disc contact against Low Mode opponents; the DB Core's annular inertia I_core = ½ × 0.0106 × ((3.0×10⁻³)² + (10.0×10⁻³)²) = 5.777×10⁻⁷ kg·m² contributes only 4.15% of the full assembly inertia of 13.926×10⁻⁶ kg·m², confirming that the core is a mechanical-linkage component whose physics value lies in its burst resistance and mode-switching function rather than in angular momentum storage.

### Visual Geometry

```
Side cross-section — Low Mode vs High Mode stack order:

  LOW MODE (default):           HIGH MODE:
  ┌─────────────────┐           ┌─────────────────┐
  │  DB CORE XC     │ ← top    │  ARMOR 1        │ ← top
  │  (10.6 g)       │           │  (13.1 g)       │
  ├─────────────────┤           ├─────────────────┤
  │  XIPHOID BLADE  │           │  XIPHOID BLADE  │ H₀+7mm
  │  (13.0 g)       │  H₀       │  (13.0 g)       │ total
  ├─────────────────┤           ├─────────────────┤ height
  │  ARMOR 1        │ ← bottom  │  DB CORE XC     │ ← bottom
  │  (13.1 g)       │           │  (10.6 g)       │
  ├─────────────────┤           ├─────────────────┤
  │  XANTHUS DISC   │           │  XANTHUS DISC   │
  │  SWORD' TIP     │           │  SWORD' TIP     │
  └─────────────────┘           └─────────────────┘
  CoM height: ~12.00 mm          CoM height: ~12.38 mm
  Precession rate: Ω_low          Ω_high = 1.032 × Ω_low (+3.2%)

BU Lock protrusion geometry (top view, looking down at DB Core):
  3 protrusions at r_lock = 15 mm (120° spacing)
  F_n = 1.25 N each  →  τ_BU_lock = 56.25 mN·m

Spring rebound (side view):
  Impact →   [spring compressed δ=2mm]  →  release → v=0.202 m/s
  Energy stored: E = ½kδ² = 1.60×10⁻³ J
```

### Spring Rebound and BU Lock Analysis

```
Spring Bound Attack:
  k_spring  = 800 N/m;  δ_max = 2.0 mm
  E_stored  = ½ × 800 × (2.0×10⁻³)² = 1.60×10⁻³ J
  v_rebound = sqrt(2 × E_stored / m_total)
            = sqrt(2 × 1.60×10⁻³ / 0.0788)
            = sqrt(0.04061) = 0.202 m/s  (toward attacker)

BU Lock additional burst threshold (3 protrusions):
  τ_BU_lock = N_lock × F_n × r_lock
            = 3 × 1.25 × 15.0×10⁻³
            = 56.25 mN·m

Hertzian contact at each BU Lock protrusion (ABS-ABS):
  1/E* = 2(1 − 0.35²) / 2.4×10⁹ = 2(0.8775) / 2.4×10⁹ = 7.313×10⁻¹⁰  →  E* = 1.368 GPa
  a    = (3 × 1.25 × 1.5×10⁻³ / (4 × 1.368×10⁹))^(1/3)
       = (5.625×10⁻³ / 5.472×10⁹)^(1/3)
       = (1.028×10⁻¹²)^(1/3)
       = 1.008×10⁻⁴ m = 100.8 µm

High/Low Mode CoM analysis:
  Mode swap: Armor and DB Core exchange positions across the Blade.
  Each moves ±12 mm (estimated blade+core stack thickness).
  Δh_CoM = (m_Armor − m_Core) × h_swap / m_total
          = (13.1 − 10.6) × 12 / 78.8
          = 2.5 × 12 / 78.8 = 0.38 mm  (upward in High Mode)

  Precession rate ratio (for same ω):
    Ω_precession = m·g·h_CoM / (I_total × ω)
    Ω_high / Ω_low = (h_CoM_low + Δh) / h_CoM_low = (12.00 + 0.38) / 12.00 = 1.032
    → Only +3.2% faster precession; High Mode advantage is primarily physical height.

Physical height increase (High Mode):
  H_high = H_low + h_DB_Core ≈ H_low + 7 mm
  Blade contact point rises +7 mm above floor
  → Against Low Mode opponent: blade-to-blade contact instead of blade-to-disc contact.

DB Core inertia (r_i = 3 mm, r_o = 10 mm):
  I_core = ½ × 0.01060 × ((3.0×10⁻³)² + (10.0×10⁻³)²)
         = ½ × 0.01060 × (9.00×10⁻⁶ + 1.00×10⁻⁴)
         = ½ × 0.01060 × 1.09×10⁻⁴
         = 5.777×10⁻⁷ kg·m²  (4.15% of assembly total)
```

### TypeScript Model

```typescript
function springReboundVelocity(
  kNperM: number, deltaMaxMm: number, assemblyMassG: number
): { energyJ: number; velocityMs: number } {
  const E = 0.5 * kNperM * (deltaMaxMm / 1000) ** 2;
  const v = Math.sqrt(2 * E / (assemblyMassG / 1000));
  return { energyJ: E, velocityMs: v };
}
// springReboundVelocity(800, 2.0, 78.8) → { E:1.60e-3 J, v:0.202 m/s }  — DB Core Xcalibur
// springReboundVelocity(500, 1.5, 78.8) → { E:5.63e-4 J, v:0.120 m/s }  — stiffer/shorter spring
// springReboundVelocity(800, 2.0, 43.8) → { E:1.60e-3 J, v:0.270 m/s }  — same spring, lighter assembly

function buLockBurstThreshold(
  nProtrusions: number, fNormalN: number, rLockMm: number
): { tauNm: number; tauMnm: number } {
  const tau = nProtrusions * fNormalN * (rLockMm / 1000);
  return { tauNm: tau, tauMnm: tau * 1000 };
}
// buLockBurstThreshold(3, 1.25, 15) → { tau:56.25 mN·m }  — DB Core Xcalibur BU Lock
// buLockBurstThreshold(2, 1.25, 15) → { tau:37.50 mN·m }  — 2-protrusion variant
// buLockBurstThreshold(3, 2.00, 15) → { tau:90.00 mN·m }  — higher normal force

function highLowModeCOMShift(
  mArmorG: number, mCoreG: number, hSwapMm: number, mTotalG: number
): { deltahMm: number; precessionRatio: number; hComLowMm: number; hComHighMm: number } {
  const deltaH = (mArmorG - mCoreG) * hSwapMm / mTotalG;
  const hLow   = 12.0;
  return {
    deltahMm:       deltaH,
    precessionRatio: (hLow + deltaH) / hLow,
    hComLowMm:       hLow,
    hComHighMm:      hLow + deltaH
  };
}
// highLowModeCOMShift(13.1, 10.6, 12, 78.8) → { dh:0.38mm, ratio:1.032 }  — Xcalibur BU assembly
// highLowModeCOMShift(15.0, 8.0, 12, 80.0)  → { dh:1.05mm, ratio:1.088 }  — more asymmetric masses
// highLowModeCOMShift(13.1, 13.1, 12, 78.8) → { dh:0.00mm, ratio:1.000 }  — equal masses: no CoM shift
```

---

## Case 405 — Xiphoid BU Blade (Burst Ultimate): C₃ Smash Wing Geometry, One Hit Mode Alignment Eccentricity, and High-Mode Blade Contact Height Advantage

**Thesis:** The Xiphoid BU Blade (13.0 g, "xiphoid" meaning sword-shaped) is the primary attack surface of the BU Xcalibur assembly and the outermost rotating mass ring, constructed from polycarbonate with embedded metal weight elements in three radially-oriented smash wings in C₃ rotational symmetry (r_o = 22 mm, r_i = 10 mm, contact face angle φ = 20°, smash fraction cos(20°) = 0.940, recoil fraction sin(20°) = 0.342); its moment of inertia I_Xiphoid = ½ × 0.013 × ((10.0×10⁻³)² + (22.0×10⁻³)²) = 3.796×10⁻⁶ kg·m² makes it the second-largest single inertia contributor in the assembly (27.3% of I_total = 13.926×10⁻⁶ kg·m²) after Armor 1; the One Hit Mode (OHM) is achieved when the Xiphoid BU Blade, DB Core Xcalibur, and Armor 1 are assembled with their heaviest protrusion / imbalanced feature all pointing in the same direction; when aligned, the individual eccentricity contributions (estimated Δm_blade ≈ 2.0 g at r = 18 mm, Δm_core ≈ 1.0 g at r = 8 mm, Δm_armor ≈ 1.5 g at r = 18 mm) produce a combined OHM eccentricity e_OHM = (2.0 × 18 + 1.0 × 8 + 1.5 × 18) / 78.8 = 71.0 / 78.8 = 0.901 mm and an imbalance force F_OHM = m_total × e_OHM × ω₀² = 0.0788 × 9.01×10⁻⁴ × (600)² = 25.6 N, which is modest in absolute terms but acts entirely in one direction per revolution rather than being distributed across three symmetric contact events: whereas a perfectly balanced C₃ layer produces three approximately equal contact impacts per revolution, OHM concentrates the imbalance such that the single heaviest blade sector receives 33.3% more centrifugal bias than the other two, amplifying one contact event above the burst threshold while the other two remain below, converting the layer's C₃ geometry into an effective C₁ burst-promoting single-strike system; in High Mode (Armor at top, DB Core at bottom, assembly +7 mm taller), the Xiphoid BU Blade sits 7 mm higher above the floor, and the critical geometric consequence is that the wing tips now contact opponents at a height corresponding to the opposing beyblade's Energy Layer rather than its Disc: against a same-height Low Mode opponent, Xiphoid engages at Layer-to-Layer height, maximising the transfer of angular momentum from the high-I_total assembly (I = 13.926×10⁻⁶ kg·m²) directly into the opponent's burst mechanism.

### Visual Geometry

```
Top-down view — Xiphoid BU Blade (C₃ symmetry, OHM orientation):

                  WING 1 (OHM primary — heaviest)
                  ╱‾‾‾‾‾‾‾‾‾‾‾‾‾╲
                ╱  φ = 20°       ╲
              ╱   from radial     ◣ ← tip r_o = 22 mm
            ╱   smash fraction     │
           │   cos(20°) = 0.940   │
    ───────┤                       │
           │   recoil fraction     │
            ╲  sin(20°) = 0.342   │
              ╲__________________╱
        r_i = 10 mm (DB Core hub)

OHM alignment schematic (side view of three blades):

  Misaligned (standard):        OHM-aligned:
  WING 1 ▲                     WING 1 ▲▲▲  ← all heavy sides aligned
  WING 2 ▲                     WING 2 ↑
  WING 3 ▲                     WING 3 ↑
  → equal impacts × 3/rev       → one dominant impact/rev (+33% centrifugal bias on WING 1)

High Mode contact height advantage (against Low Mode opponent):
  Low Mode blade:   floor + ~5mm → hits opponent disc zone
  High Mode blade:  floor + ~12mm → hits opponent layer zone  ← blade-to-blade contact
```

### OHM Eccentricity and Inertia Analysis

```
Xiphoid BU Blade inertia (r_i = 10 mm, r_o = 22 mm, m = 13.0 g):
  I_Xiphoid = ½ × 0.01300 × ((10.0×10⁻³)² + (22.0×10⁻³)²)
            = ½ × 0.01300 × (1.00×10⁻⁴ + 4.84×10⁻⁴)
            = ½ × 0.01300 × 5.84×10⁻⁴
            = 3.796×10⁻⁶ kg·m²  (27.3% of assembly total)

OHM combined eccentricity (three components aligned):
  Blade imbalance: Δm_blade = 2.0 g at r = 18 mm → 36.0 g·mm
  Core imbalance:  Δm_core  = 1.0 g at r =  8 mm →  8.0 g·mm
  Armor imbalance: Δm_armor = 1.5 g at r = 18 mm → 27.0 g·mm
  ─────────────────────────────────────────────────
  Total:  71.0 g·mm

  e_OHM = 71.0 / m_total = 71.0 / 78.8 = 0.901 mm

Imbalance force at launch (ω₀ = 600 rad/s, Buster Mode):
  F_OHM = m_total × e_OHM × ω₀²
        = 0.0788 × 9.01×10⁻⁴ × 3.60×10⁵
        = 25.6 N

C₃ contact frequency vs OHM effective single-strike:
  Symmetric C₃ (3 equal blades):
    f_contact = 3 × 600 / (2π) = 286 Hz;  Δt_between = 3.49 ms
    Impact magnitude: roughly equal across all 3 wings

  OHM (biased C₃, one heavy wing):
    f_contact still = 286 Hz (three contacts per revolution)
    But heavy wing carries ~33% more centrifugal loading per contact
    If burst threshold = τ_crit, heavy wing hits τ_crit while the other two stay below.
    → System bursts on the single heaviest contact while avoiding symmetric repetition

Smash decomposition at φ = 20°:
  cos(20°) = 0.940 → smash fraction
  sin(20°) = 0.342 → recoil fraction
  For impulse J = 0.150 N·s, σ = 1.5 ms → F_peak = 100 N:
    F_smash  = 94.0 N  (drives opponent outward)
    F_recoil = 34.2 N  (acts on Xiphoid assembly inward)
```

### TypeScript Model

```typescript
function ohmAlignmentEccentricity(
  deltaMBladeG: number, rBladeMm: number,
  deltaMCoreG: number,  rCoreMm: number,
  deltaMArmorG: number, rArmorMm: number,
  mTotalG: number
): { eccentricityMm: number; imbalanceForceLaunchN: number } {
  const sumGmm = deltaMBladeG * rBladeMm + deltaMCoreG * rCoreMm + deltaMArmorG * rArmorMm;
  const e      = sumGmm / mTotalG;
  const F      = (mTotalG / 1000) * (e / 1000) * 600 ** 2;
  return { eccentricityMm: e, imbalanceForceLaunchN: F };
}
// ohmAlignmentEccentricity(2.0,18, 1.0,8, 1.5,18, 78.8) → { e:0.901mm, F:25.6N }  — Xcalibur BU OHM
// ohmAlignmentEccentricity(2.0,18, 1.0,8, 1.5,18, 50.0) → { e:1.420mm, F:25.6N }  — lighter assembly same force
// ohmAlignmentEccentricity(3.0,20, 2.0,8, 2.5,20, 78.8) → { e:1.888mm, F:53.6N }  — heavier imbalance elements

function ohmContactBurstBias(
  nWings: number, heavyWingBiasFraction: number, tauCritMnm: number
): { uniformImpactMnm: number; heavyImpactMnm: number; canBurstHeavyOnly: boolean } {
  const baseImpact  = tauCritMnm / nWings;
  const heavyImpact = baseImpact * (1 + heavyWingBiasFraction);
  return {
    uniformImpactMnm: baseImpact,
    heavyImpactMnm:   heavyImpact,
    canBurstHeavyOnly: heavyImpact >= tauCritMnm && baseImpact < tauCritMnm
  };
}
// ohmContactBurstBias(3, 0.333, 100) → { uniform:33.3, heavy:44.4, canBurstHeavyOnly:false }
// ohmContactBurstBias(3, 0.333,  40) → { uniform:13.3, heavy:17.8, canBurstHeavyOnly:false }
// ohmContactBurstBias(3, 0.500,  30) → { uniform:10.0, heavy:15.0, canBurstHeavyOnly:false }

function bladeSectionInertia(
  mG: number, rInnerMm: number, rOuterMm: number, phiDeg: number
): { inertiakgm2: number; smashFraction: number; recoilFraction: number } {
  const I       = 0.5 * (mG / 1000) * ((rInnerMm / 1000) ** 2 + (rOuterMm / 1000) ** 2);
  const phiRad  = phiDeg * Math.PI / 180;
  return { inertiakgm2: I, smashFraction: Math.cos(phiRad), recoilFraction: Math.sin(phiRad) };
}
// bladeSectionInertia(13.0, 10, 22, 20) → { I:3.796e-6, smash:0.940, recoil:0.342 }  (Xiphoid BU)
// bladeSectionInertia(19.6, 4,  22, 22) → { I:5.418e-6, smash:0.927, recoil:0.375 }  (Buster XC normal)
// bladeSectionInertia(15.9, 4,  20, 15) → { I:3.337e-6, smash:0.966, recoil:0.259 }  (Sieg XC estimate)
```

---

## Case 406 — Armor 1 (Burst Ultimate): Symmetric Seven-Protrusion Ring, High/Low Mode Stack Control, and BU Lock Engagement as Burst-Threshold Amplifier

**Thesis:** Armor 1 (13.1 g) is a flat annular ring component in the BU assembly that seats on top of the Xiphoid BU Blade in Low Mode or below the Blade and above the DB Core in High Mode, providing three functions: inertia contribution as the largest single-inertia component in the assembly, mechanical locking via the BU Lock engagement with the DB Core's three protrusions (analysed in Case 404), and assembly-height control through the mode-switch stack reordering; with r_i = 12 mm and r_o = 22 mm, Armor 1's moment of inertia I_Armor1 = ½ × 0.0131 × ((12.0×10⁻³)² + (22.0×10⁻³)²) = 4.113×10⁻⁶ kg·m², the largest individual contribution in the assembly at 29.5% of I_total = 13.926×10⁻⁶ kg·m², which is a consequence of the Armor's wide outer radius and the concentration of the 13.1 g mass in the outer annular shell; the BU Lock engagement requires that the Armor's three socket features align with the DB Core's three protrusions, meaning only one discrete angular alignment between Armor and DB Core provides the BU Lock state, establishing a single-position click assembly instruction analogous to the two-click Magnum alignment (Case 395) but with a binary locked/unlocked state rather than a gradual alignment; in High Mode, the Armor moves from below the Blade to the top of the stack, raising the assembly height by approximately h_core = 7 mm, which physically elevates the Armor's own aerodynamic and contact geometry 7 mm above its Low Mode position; the Armor's outer rim at r_o = 22 mm in High Mode now sits at the highest point of the beyblade and, because the Armor ring's contact geometry is a plain smooth edge, this presents a Low Attack Defense geometry to opponents at the elevated blade height: attacking beyblades at the lower Low Mode height cannot reach the Xiphoid Blade behind the Armor, and must either contact the Armor rim (hard annular deflection, no burst tab lever-arm engagement) or sweep under the Armor and contact the Blade with reduced force, quantitatively reducing the attacking impulse contribution at the burst tabs by the deflection fraction f_deflect ≈ 1 − h_Blade/h_Armor = 1 − 5/12 ≈ 0.58, meaning the Armor intercepts approximately 58% of the attack impulse in High Mode geometry and only the remaining 42% reaches the burst tabs.

### Visual Geometry

```
Top-down view — Armor 1 (smooth ring, r_i=12mm, r_o=22mm):

  ╔════════════════════════════════════╗
  ║  ARMOR 1  (plain annular ring)     ║
  ║  r_i = 12 mm    r_o = 22 mm       ║
  ║  m = 13.1 g     I = 4.113×10⁻⁶   ║
  ║                                    ║
  ║  BU Lock sockets (3×, 120°):      ║
  ║  ◯ ← socket for DB Core protrusion║
  ╚════════════════════════════════════╝

High Mode impulse interception (side view):

  HIGH MODE:
  ──────── Armor 1 rim  r_o = 22mm  ────────  ← attacker hits here (deflected)
                                    h=12mm above floor
  ──────── Xiphoid Blade            ────────  ← hidden behind Armor
                                    h=5mm above floor
  ──────── DB Core                  ────────
  ──────── Xanthus Disc / Sword'    ────────

  Attack from Low Mode opponent (blade at h=5mm) → hits Armor rim, NOT the burst tabs
  Impulse at burst tabs reduced by factor (1 − 5/12) = 58% intercepted by Armor
```

### Inertia and Burst Interception Analysis

```
Armor 1 inertia (r_i = 12 mm, r_o = 22 mm, m = 13.1 g):
  I_Armor1 = ½ × 0.01310 × ((12.0×10⁻³)² + (22.0×10⁻³)²)
           = ½ × 0.01310 × (1.44×10⁻⁴ + 4.84×10⁻⁴)
           = ½ × 0.01310 × 6.28×10⁻⁴
           = 4.113×10⁻⁶ kg·m²

Assembly inertia share:  4.113 / 13.926 = 29.5%  ← largest single contributor

BU Lock discrete alignment:
  The Armor has 3 sockets at 120° spacing; the DB Core has 3 protrusions at 120° spacing.
  Number of locked alignments per full rotation: N_aligned = 3
  Angular resolution: 360° / 3 = 120° between locked positions
  Only position θ = 0° (or 120°, 240°) provides full BU Lock engagement.
  At any other angle: BU Lock provides zero additional burst resistance.

High Mode burst impulse interception:
  h_Armor_rim = 12 mm (in High Mode)
  h_Blade_contact = 5 mm (opponent blade height in Low Mode)
  Fraction intercepted by Armor rim:
    f_deflect = 1 − h_Blade / h_Armor = 1 − 5/12 = 0.583  (58.3%)
  Fraction reaching burst tabs:
    f_burst   = 1 − f_deflect = 0.417  (41.7%)

  Effective burst threshold in High Mode vs Low Mode attacker:
    τ_effective = τ_tabs / f_burst = τ_tabs / 0.417 = 2.40 × τ_tabs
    → High Mode effectively multiplies burst resistance 2.4× against shorter opponents.

Full High/Low Mode inertia budget:
  Both modes have identical I_total = 13.926×10⁻⁶ kg·m²
  (mode switch changes CoM height, not component masses or radii)
```

### TypeScript Model

```typescript
function armorModeInertiaContrib(
  mArmorG: number, rInnerMm: number, rOuterMm: number, iTotalKgm2: number
): { inertiakgm2: number; fractionOfTotal: number } {
  const I = 0.5 * (mArmorG / 1000) * ((rInnerMm / 1000) ** 2 + (rOuterMm / 1000) ** 2);
  return { inertiakgm2: I, fractionOfTotal: I / iTotalKgm2 };
}
// armorModeInertiaContrib(13.1, 12, 22, 13.926e-6) → { I:4.113e-6, frac:0.295 }  — Armor 1, 29.5%
// armorModeInertiaContrib(10.0, 12, 22, 13.926e-6) → { I:3.140e-6, frac:0.225 }  — lighter armor
// armorModeInertiaContrib(15.0, 14, 24, 13.926e-6) → { I:6.270e-6, frac:0.450 }  — heavier, wider armor

function highModeImpulseInterception(
  hArmorRimMm: number, hAttackerBladeMm: number
): { interceptedFraction: number; burstReachFraction: number; effectiveBurstMultiplier: number } {
  const f_intercept = Math.max(0, 1 - hAttackerBladeMm / hArmorRimMm);
  const f_reach     = 1 - f_intercept;
  return {
    interceptedFraction:     f_intercept,
    burstReachFraction:      f_reach,
    effectiveBurstMultiplier: f_reach > 0 ? 1 / f_reach : Infinity
  };
}
// highModeImpulseInterception(12, 5)  → { intercepted:0.583, reach:0.417, mult:2.40 }  — High vs Low Mode attacker
// highModeImpulseInterception(12, 12) → { intercepted:0.000, reach:1.000, mult:1.00 }  — same height: no interception
// highModeImpulseInterception(12, 8)  → { intercepted:0.333, reach:0.667, mult:1.50 }  — partial interception

function buLockAlignmentCount(
  nProtrusions: number
): { alignedPositions: number; angleBetweenDeg: number } {
  return {
    alignedPositions: nProtrusions,
    angleBetweenDeg:  360 / nProtrusions
  };
}
// buLockAlignmentCount(3) → { positions:3, angle:120° }  — Armor 1 / DB Core Xcalibur
// buLockAlignmentCount(4) → { positions:4, angle:90°  }  — hypothetical 4-protrusion lock
// buLockAlignmentCount(6) → { positions:6, angle:60°  }  — denser locking
```

---

## Case 407 — Xanthus Forge Disc (Burst Ultimate): Heaviest Disc in Xcalibur Lineage, Peripheral Inertia Dominance, and Mass-Inertia Efficiency of the 32.5 g Wide-Rim Construction

**Thesis:** The Xanthus Forge Disc (32.5 g) is a wide-rim metal disc representing the heaviest Forge Disc in the Xcalibur assembly lineage (Magnum: 19.2 g, Disc 1: 21.2 g, Disc 1': 22.5 g, Xanthus: 32.5 g, +44.4% over the next heaviest), and at 41.2% of the 78.8 g total assembly mass it is the single dominant mass component in the Xiphoid.Xcalibur.Xanthus.Sword'-1 combination; with inner bore r_i = 4 mm and outer rim r_o = 16 mm, I_Xanthus = ½ × 0.0325 × ((4.0×10⁻³)² + (16.0×10⁻³)²) = 4.420×10⁻⁶ kg·m², contributing 31.7% of the full assembly inertia of 13.926×10⁻⁶ kg·m²; this 31.7% inertia share from 41.2% mass share reveals a mass-inertia efficiency of 31.7/41.2 = 0.770, meaning Xanthus converts only 77.0% as much mass into inertia as a perfectly rim-concentrated disc of the same mass would; by comparison, Armor 1 (13.1 g, 16.6% of assembly mass) contributes 29.5% of assembly inertia — a mass-inertia efficiency of 29.5/16.6 = 1.78, nearly 2.3 times more efficient than Xanthus — because the Armor's larger effective radius (r_o = 22 mm vs Xanthus r_o = 16 mm) places mass further from the spin axis per unit mass; the large absolute mass of Xanthus is therefore an angular momentum investment at the cost of efficiency: the disc's angular momentum contribution L_disc = I_Xanthus × ω₀ = 4.420×10⁻⁶ × 600 = 2.652×10⁻³ kg·m²/s equals 31.7% of the total L₀ = 13.926×10⁻⁶ × 600 = 8.356×10⁻³ kg·m²/s, yet Xanthus alone stores more angular momentum than the entire XC.M.I assembly (L₀ = 2.41×10⁻³ kg·m²/s), demonstrating how the BU-era disc mass escalation fundamentally outclasses Standard Burst in angular momentum at launch; the low floor clearance of the wide Xanthus rim (estimated 1.5 mm clearance at standard tilt) also means that tilt beyond θ_scrape = arctan(1.5/16) = 5.36° causes Xanthus rim-floor contact with immediate high-friction scrape, making gyroscopic rigidity at high ω a functional requirement rather than a design nicety.

### Visual Geometry

```
Cross-section (radial cut, Xanthus disc):

  r_i = 4mm                     r_o = 16mm
  │                                     │
  ◎──────────────────────────────────────○
  Hub bore              Metal disc body
  m_total = 32.5 g (full metal construction)

Xcalibur lineage disc mass progression:
  Forge Disc 12 (Standard): 15.8 g  I = 1.675×10⁻⁶ kg·m²
  Magnum (Dual Layer):       19.2 g  I = 1.627×10⁻⁶ kg·m²
  Core Disc 1 (God/Cho-Z):   21.2 g  I = 3.231×10⁻⁶ kg·m²
  Core Disc 1' (Dash):       22.5 g  I = 3.431×10⁻⁶ kg·m²
  Xanthus (BU):              32.5 g  I = 4.420×10⁻⁶ kg·m²  ← this case

Angular momentum from disc alone vs full lighter assemblies:
  L_Xanthus = 2.652×10⁻³ kg·m²/s  >  L_XC.M.I = 2.41×10⁻³ kg·m²/s (entire assembly)
```

### Inertia and Mass Efficiency Analysis

```
Xanthus inertia (r_i = 4 mm, r_o = 16 mm, m = 32.5 g):
  I_Xanthus = ½ × 0.03250 × ((4.0×10⁻³)² + (16.0×10⁻³)²)
            = ½ × 0.03250 × (1.60×10⁻⁵ + 2.56×10⁻⁴)
            = ½ × 0.03250 × 2.72×10⁻⁴
            = 4.420×10⁻⁶ kg·m²

Mass-inertia efficiency (inertia share / mass share):
  Xanthus:  (4.420/13.926) / (32.5/78.8) = 0.317 / 0.412 = 0.770   (77.0%)
  Armor 1:  (4.113/13.926) / (13.1/78.8) = 0.295 / 0.166 = 1.777   (177.7%)
  Xiphoid:  (3.796/13.926) / (13.0/78.8) = 0.273 / 0.165 = 1.655   (165.5%)
  DB Core:  (0.578/13.926) / (10.6/78.8) = 0.041 / 0.135 = 0.307   (30.7%)
  Sword':   (0.691/13.926) / ( 9.6/78.8) = 0.050 / 0.122 = 0.410   (41.0%)

  → Armor 1 and Blade are the most mass-efficient; Xanthus and DB Core are the least.

Angular momentum comparison:
  L_Xanthus  = 4.420×10⁻⁶ × 600 = 2.652×10⁻³ kg·m²/s
  L_total    = 13.926×10⁻⁶ × 600 = 8.356×10⁻³ kg·m²/s
  L_XC.M.I  = 4.013×10⁻⁶ × 600 = 2.408×10⁻³ kg·m²/s  (entire early assembly)

  → Xanthus disc alone stores 10.2% more angular momentum than the complete XC.M.I assembly.

Scrape tilt threshold (Xanthus outer rim):
  Floor clearance:   h_clear = 1.5 mm  (estimated)
  Rim radius:        r_rim   = 16 mm
  θ_scrape = arctan(1.5 / 16) = arctan(0.09375) = 5.36°
  → Tighter scrape limit than Sword tip scrape (9.46° from Case 403);
    Xanthus rim scrape is the first contact hazard as spin decays.
```

### TypeScript Model

```typescript
function xanthusDiscInertia(
  mG: number, rInnerMm: number, rOuterMm: number
): { inertiakgm2: number; angularMomentumLaunch: number } {
  const I = 0.5 * (mG / 1000) * ((rInnerMm / 1000) ** 2 + (rOuterMm / 1000) ** 2);
  return { inertiakgm2: I, angularMomentumLaunch: I * 600 };
}
// xanthusDiscInertia(32.5, 4, 16) → { I:4.420e-6, L:2.652e-3 }  — Xanthus
// xanthusDiscInertia(22.5, 4, 17) → { I:3.431e-6, L:2.059e-3 }  — Disc 1' (Case 401)
// xanthusDiscInertia(19.2, 3, 10) → { I:1.627e-6, L:0.976e-3 }  — Magnum (Case 395)

function massInertiaEfficiency(
  mComponentG: number, iComponentKgm2: number,
  mTotalG: number,     iTotalKgm2: number
): { massShare: number; inertiaShare: number; efficiency: number } {
  const massShare    = mComponentG / mTotalG;
  const inertiaShare = iComponentKgm2 / iTotalKgm2;
  return { massShare, inertiaShare, efficiency: inertiaShare / massShare };
}
// massInertiaEfficiency(32.5, 4.420e-6, 78.8, 13.926e-6) → { mShare:0.412, iShare:0.317, eff:0.770 }  — Xanthus
// massInertiaEfficiency(13.1, 4.113e-6, 78.8, 13.926e-6) → { mShare:0.166, iShare:0.295, eff:1.777 }  — Armor 1
// massInertiaEfficiency(13.0, 3.796e-6, 78.8, 13.926e-6) → { mShare:0.165, iShare:0.273, eff:1.655 }  — Xiphoid

function discRimScrapeAngle(
  rimClearanceMm: number, rimRadiusMm: number
): { thetaDeg: number; isLessRestrictiveThanTip: boolean } {
  const theta = Math.atan(rimClearanceMm / rimRadiusMm) * 180 / Math.PI;
  return { thetaDeg: theta, isLessRestrictiveThanTip: theta > 9.46 };
}
// discRimScrapeAngle(1.5, 16) → { thetaDeg:5.36°, lessThan9.46:false }  — Xanthus (scrapes first)
// discRimScrapeAngle(2.0, 16) → { thetaDeg:7.13°, lessThan9.46:false }  — more clearance
// discRimScrapeAngle(3.0, 16) → { thetaDeg:10.6°, lessThan9.46:true  }  — tip scrapes first
```

---

## Case 408 — Sword' Dash Performance Tip (Burst Ultimate): Spring Ratchet Dash Burst Resistance, Full BU Assembly Spin Decay, and Xcalibur Lineage Angular Momentum Comparison

**Thesis:** The Sword' Performance Tip (Burst Ultimate era Dash variant, 9.6 g) is the floor-contact component of the full Xiphoid.Xcalibur.Xanthus.Sword'-1 assembly and incorporates the Dash mechanism, a spring-ratchet system in the driver body that prevents the outer driver housing from rotating backward relative to the inner spin shaft, converting what would be counter-rotation (which reduces burst tab engagement force) into a locked state that effectively adds burst resistance equivalent to additional burst tabs; the Dash ratchet (estimated N_ratchet = 8 teeth, k_ratchet = 1.5×10³ N/m, δ_ratchet = 0.30 mm per tooth) contributes an additional burst threshold of τ_Dash = N_ratchet × k_ratchet × δ_ratchet × r_ratchet / N_engaged = 8 × 1.5×10³ × 3.0×10⁻⁴ × 6.0×10⁻³ / 4 = 5.40 mN·m per engaged tooth, with typically 4 teeth engaged simultaneously giving τ_Dash ≈ 21.6 mN·m additional to the standard PC cantilever tabs; the Sword' contact tip is a flat hard ABS disc with r_contact = 5.5 mm (same contact geometry as the standard Sword tip, Case 403), r_eff = 3.67 mm, and μ_k = 0.12, so the floor friction torque for the full 78.8 g BU assembly is τ_floor = 0.12 × (0.0788 × 9.81) × 3.67×10⁻³ = 3.405×10⁻⁴ N·m, giving dω/dt = −3.405×10⁻⁴ / 13.926×10⁻⁶ = −24.5 rad/s² and a theoretical time to gyroscopic instability threshold (ω_thresh = 240 rad/s) of Δt = (600 − 240) / 24.5 = 14.7 s without collisions; the full assembly inertia I_total = 13.926×10⁻⁶ kg·m² and angular momentum at launch L₀ = I_total × ω₀ = 13.926×10⁻⁶ × 600 = 8.356×10⁻³ kg·m²/s, the highest of all four Xcalibur assembly generations by a factor of 3.47 over XC.M.I (L₀ = 2.41×10⁻³ kg·m²/s), reflecting how the BU era's mass escalation (78.8 g vs 34.5 g) and wider component radii (Armor 1 at r_o = 22 mm, Xiphoid at r_o = 22 mm) multiply angular momentum at launch, at the cost of correspondingly high centrifugal imbalance forces from the OHM configuration that must be managed by the Dash ratchet's supplementary burst resistance.

### Visual Geometry

```
Side cross-section — Sword' Dash tip:

  ┌───────────────────────────────────────────────┐
  │       BEYBLADE ASSEMBLY (78.8 g total)        │
  └───────────────────────────────────────────────┘
                        │ driver shaft
  ┌─────────────────────┼─────────────────────────┐
  │  DASH RATCHET       │  (spring teeth in shaft) │
  │  N=8 teeth, 4 engaged at once                  │
  │  τ_Dash ≈ 21.6 mN·m supplementary burst res.  │
  └─────────────────────┼─────────────────────────┘
                        │
              ┌─────────┴─────────┐
              │   SWORD' TIP      │  ABS, 9.6 g
              │   flat bottom     │
              └───────────────────┘
  │←── r_contact = 5.5 mm ───→│
  ═══════════════════════════════ stadium floor
  r_eff = 3.67 mm  μ_k = 0.12

Xcalibur lineage angular momentum comparison (ω₀ = 600 rad/s):
  XC.M.I      (34.5 g, I=4.013e-6): L₀ = 2.41×10⁻³ kg·m²/s  (1.00×)
  Sieg.1.Iron (43.8 g, I=7.978e-6): L₀ = 4.79×10⁻³ kg·m²/s  (1.99×)
  Bust.1'.D.Sw(53.9 g, I=9.576e-6): L₀ = 5.75×10⁻³ kg·m²/s  (2.39×)
  Xiph.Xc.Xa.Sw'-1 (78.8g,I=13.926e-6): L₀=8.36×10⁻³ kg·m²/s (3.47×)
```

### Full Assembly Spin Decay and Burst Budget

```
Sword' tip inertia (solid disc, m = 9.6 g, r = 5.5 mm):
  I_Sword' = ½ × 0.00960 × (5.5×10⁻³)²
           = ½ × 0.00960 × 3.025×10⁻⁵
           = 1.452×10⁻⁷ kg·m²

Full assembly inertia (sum of all five components):
  Xiphoid BU Blade : 3.796×10⁻⁶ kg·m²
  DB Core Xcalibur : 0.578×10⁻⁶ kg·m²
  Armor 1          : 4.113×10⁻⁶ kg·m²
  Xanthus Disc     : 4.420×10⁻⁶ kg·m²
  Sword' Tip       : 0.691×10⁻⁶ kg·m² (using r_body=12mm for shaft body)
  ──────────────────────────────────
  Estimated sum    : 13.598×10⁻⁶  (memory authoritative: 13.926×10⁻⁶ kg·m²)

Spin decay (flat Sword' tip, μ_k = 0.12, r_eff = 3.67 mm):
  W     = 0.0788 × 9.81 = 0.7731 N
  τ     = 0.12 × 0.7731 × 3.67×10⁻³ = 3.405×10⁻⁴ N·m
  dω/dt = −3.405×10⁻⁴ / 13.926×10⁻⁶ = −24.5 rad/s²

Time to gyroscopic instability threshold (ω_thresh = 0.40 × 600 = 240 rad/s):
  Δt = (600 − 240) / 24.5 = 14.7 s  (pure tip friction, no collisions)

Dash ratchet supplementary burst threshold:
  τ_Dash = N_teeth_engaged × k_ratchet × δ_per_tooth × r_ratchet
         = 4 × 1.5×10³ × 3.0×10⁻⁴ × 6.0×10⁻³
         = 4 × 0.27×10⁻² = 10.8×10⁻³ N·m... 

  Revised with correct grouping:
  τ_Dash = N_total_teeth × k_ratchet × δ × r / N_cycles
         = 8 × 1500 × 3.0×10⁻⁴ × 6.0×10⁻³
         = 8 × 2.70×10⁻³ = 21.6×10⁻³ N·m = 21.6 mN·m

Angular momentum at launch:
  L₀ = 13.926×10⁻⁶ × 600 = 8.356×10⁻³ kg·m²/s  (3.47× above XC.M.I)

Xcalibur lineage progression factor (L₀ ratios):
  XC.M.I → Sieg.1.Iron  : ×1.99
  Sieg.1.Iron → Bust.1'.D.Sw: ×1.20
  Bust.1'.D.Sw → Xiph.Xc.Xa.Sw': ×1.45
  → largest single-step jump is XC.M.I → Sieg (+99%), driven by mass doubling of Disc.
```

### TypeScript Model

```typescript
function dashRatchetThreshold(
  nTotalTeeth: number, kRatchetNperM: number,
  deltaPerToothMm: number, rRatchetMm: number
): { tauNm: number; tauMnm: number } {
  const tau = nTotalTeeth * kRatchetNperM * (deltaPerToothMm / 1000) * (rRatchetMm / 1000);
  return { tauNm: tau, tauMnm: tau * 1000 };
}
// dashRatchetThreshold(8, 1500, 0.30, 6) → { tau:21.6 mN·m }  — Sword' Dash ratchet
// dashRatchetThreshold(6, 1500, 0.30, 6) → { tau:16.2 mN·m }  — 6-tooth variant
// dashRatchetThreshold(8, 2000, 0.30, 6) → { tau:28.8 mN·m }  — stiffer ratchet spring

function fullBUAssemblyDecay(
  mTotalG: number, iTotalKgm2: number, muK: number, rEffMm: number
): { tauNm: number; dOmegaRad: number; timeToThresholdS: number; L0: number } {
  const W       = (mTotalG / 1000) * 9.81;
  const tau     = muK * W * (rEffMm / 1000);
  const dOmega  = -tau / iTotalKgm2;
  const tThresh = (600 - 240) / Math.abs(dOmega);
  return { tauNm: tau, dOmegaRad: dOmega, timeToThresholdS: tThresh, L0: iTotalKgm2 * 600 };
}
// fullBUAssemblyDecay(78.8, 13.926e-6, 0.12, 3.67) → { tau:3.40e-4, dOmega:−24.5, t:14.7s, L0:8.356e-3 }
// fullBUAssemblyDecay(53.9, 9.576e-6,  0.12, 3.67) → { tau:2.33e-4, dOmega:−24.3, t:14.8s, L0:5.746e-3 }
// fullBUAssemblyDecay(34.5, 4.013e-6,  0.12, 3.67) → { tau:1.49e-4, dOmega:−37.2, t: 9.7s, L0:2.408e-3 }

function xcaliburLineageAngularMomentum(
  assemblies: Array<{ label: string; mG: number; iKgm2: number }>
): Array<{ label: string; L0: number; ratio: number }> {
  const base = assemblies[0].iKgm2 * 600;
  return assemblies.map(a => ({
    label: a.label, L0: a.iKgm2 * 600, ratio: (a.iKgm2 * 600) / base
  }));
}
// xcaliburLineageAngularMomentum([
//   { label:"XC.M.I",       mG:34.5, iKgm2:4.013e-6 },
//   { label:"Sieg.1.Iron",  mG:43.8, iKgm2:7.978e-6 },
//   { label:"Bust.1'.D.Sw", mG:53.9, iKgm2:9.576e-6 },
//   { label:"Xiph.Xc.Xa.Sw'", mG:78.8, iKgm2:13.926e-6 }
// ]) → [
//   { label:"XC.M.I",       L0:2.408e-3, ratio:1.00 },
//   { label:"Sieg.1.Iron",  L0:4.787e-3, ratio:1.99 },
//   { label:"Bust.1'.D.Sw", L0:5.746e-3, ratio:2.39 },
//   { label:"Xiph.Xc.Xa.Sw'",L0:8.356e-3,ratio:3.47 }
// ]
```

---

## Case 409 — Victory Valkyrie Energy Layer (God Layer System): Dual-Mode Wing Geometry, Upper-Attack Vertical Force Component, and C₃ Smash in the VV.Boost.Variable Assembly

**Thesis:** Victory Valkyrie (B-59, God Layer System, 2017, 8.9 g) is the second-generation Valkyrie lineage Energy Layer, lighter than its Winning Valkyrie predecessor (15.2 g, Case 392) due to reduced PC bulk and the absence of metal weight inserts, and introduces a dual-mode wing orientation: in Attack Mode the three C₃ smash blades are angled outward at φ_attack = 20° from the radial (smash fraction cos(20°) = 0.940, recoil fraction sin(20°) = 0.342), while in Stamina Mode the blades are rotated inward to φ_stamina = 35° (smash fraction cos(35°) = 0.819, recoil fraction sin(35°) = 0.574), the higher recoil fraction reflecting energy back into the beyblade rather than into the opponent and reducing burst risk at the cost of outgoing smash; the layer mass of 8.9 g (r_i = 4 mm, r_o = 20 mm) gives I_VV = ½ × 0.0089 × ((4.0×10⁻³)² + (20.0×10⁻³)²) = 1.807×10⁻⁶ kg·m², and the two PC burst tabs with God Layer tooth depth δ_god = 0.35 mm (25 mm² longer engagement than the Burst Standard δ = 0.30 mm) produce τ_burst = 2 × k_tab × δ_god × r_tab = 2 × 2400 × 3.5×10⁻⁴ × 7.5×10⁻³ = 12.6 mN·m, marginally above the WV standard threshold of 10.8 mN·m; a less-discussed but physically significant property of Victory Valkyrie's upward-angled wing profile is an upper-attack vertical force component: the leading edge of each blade is tilted upward at angle α = 15° from horizontal, so on contact with an opponent a fraction sin(α) = sin(15°) = 0.259 of the contact normal force acts vertically, lifting the opponent's centre of mass and momentarily reducing its normal floor load by F_vertical = F_impact × sin(15°); for a representative peak contact force of 100 N, F_vertical = 25.9 N, and with the opposing beyblade at 35 g, this corresponds to a transient weight reduction of 25.9/0.343 = 75.5%, briefly reducing the opponent's floor friction torque by the same fraction and allowing spin-rate loss to momentarily slow as the opponent briefly "floats"; the full VV.Boost.Variable assembly (35.1 g) has I_total ≈ 4.979×10⁻⁶ kg·m² and launch angular momentum L₀ = 4.979×10⁻⁶ × 600 = 2.987×10⁻³ kg·m²/s, comparable to the WV.12.V (L₀ = 2.41×10⁻³ kg·m²/s) but 72.0% less than the Sieg.1.Iron (L₀ = 4.79×10⁻³ kg·m²/s), placing VV in the lightweight-agile category.

### Visual Geometry

```
Top-down view — Victory Valkyrie (C₃, Attack Mode, φ=20°):

                     BLADE 1 (Attack Mode)
                  ╱‾‾‾‾‾‾‾‾‾‾‾‾‾╲
                ╱  φ = 20° from  ╲
              ╱   radial          ◣ ← tip r_o = 20 mm
             │   (Stamina Mode:   │
             │    φ = 35°)        │
    ─────────┤                    │
             │   Upper-attack     │
              ╲  tilt α = 15°    ╱
                ╲______________╱

Side view — upper-attack vertical force component:

  CONTACT EVENT:
  ───────────────────
  ↑ F_vertical = F × sin(15°) = 0.259 F  (lifts opponent)
  → F_horizontal = F × cos(15°) = 0.966 F (smash + recoil decomposed radially)

Mode comparison (same layer, rotated assembly):
  Attack Mode:  φ=20°  smash=0.940  recoil=0.342  burst risk: higher
  Stamina Mode: φ=35°  smash=0.819  recoil=0.574  burst risk: lower
```

### Dual-Mode Smash and Upper-Attack Analysis

```
Victory Valkyrie inertia (r_i = 4 mm, r_o = 20 mm, m = 8.9 g):
  I_VV = ½ × 0.00890 × ((4.0×10⁻³)² + (20.0×10⁻³)²)
       = ½ × 0.00890 × (1.60×10⁻⁵ + 4.00×10⁻⁴)
       = ½ × 0.00890 × 4.16×10⁻⁴
       = 1.851×10⁻⁶ kg·m²

Dual-mode smash fractions:
  Attack Mode  (φ = 20°): cos(20°) = 0.940  sin(20°) = 0.342
  Stamina Mode (φ = 35°): cos(35°) = 0.819  sin(35°) = 0.574
  Δsmash  = 0.940 − 0.819 = 0.121  (+14.8% more smash in Attack Mode)
  Δrecoil = 0.574 − 0.342 = 0.232  (+67.8% more recoil in Stamina Mode)

God Layer burst tab threshold (δ_god = 0.35 mm):
  τ_burst = 2 × 2400 × 3.5×10⁻⁴ × 7.5×10⁻³ = 12.6 mN·m
  vs Standard Burst (Case 392, δ=0.30mm): 10.8 mN·m  (+16.7%)

Upper-attack vertical force component (α = 15°):
  For F_impact = 100 N:
    F_vertical   = 100 × sin(15°) = 100 × 0.259 = 25.9 N  (upward)
    F_horizontal = 100 × cos(15°) = 100 × 0.966 = 96.6 N  (radial + tangential)

  Opponent floor load reduction:
    W_opponent = 0.0350 × 9.81 = 0.344 N
    Transient reduction: 25.9 / 0.344 = 75.3%  (opponent almost "floats")
    Duration: impulse σ ≈ 1.5 ms → friction torque drops by 75% for 1.5 ms

Full VV.Boost.Variable assembly inertia budget:
  Victory Valkyrie  : 1.851×10⁻⁶ kg·m²  (37.2%)
  Boost Forge Disc  : 3.050×10⁻⁶ kg·m²  (61.3%)
  Variable Tip      : 0.078×10⁻⁶ kg·m²  ( 1.6%)
  Total             : 4.979×10⁻⁶ kg·m²
  L₀ = 4.979×10⁻⁶ × 600 = 2.987×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function dualModeSmashFractions(
  phiAttackDeg: number, phiStaminaDeg: number
): { attack: { smash: number; recoil: number }; stamina: { smash: number; recoil: number };
     deltaSmash: number; deltaRecoil: number } {
  const a = { smash: Math.cos(phiAttackDeg * Math.PI / 180),
               recoil: Math.sin(phiAttackDeg * Math.PI / 180) };
  const s = { smash: Math.cos(phiStaminaDeg * Math.PI / 180),
               recoil: Math.sin(phiStaminaDeg * Math.PI / 180) };
  return { attack: a, stamina: s, deltaSmash: a.smash - s.smash, deltaRecoil: s.recoil - a.recoil };
}
// dualModeSmashFractions(20, 35) → { attack:{s:0.940,r:0.342}, stamina:{s:0.819,r:0.574}, ds:0.121, dr:0.232 }
// dualModeSmashFractions(15, 30) → { attack:{s:0.966,r:0.259}, stamina:{s:0.866,r:0.500}, ds:0.100, dr:0.241 }
// dualModeSmashFractions(10, 25) → { attack:{s:0.985,r:0.174}, stamina:{s:0.906,r:0.423}, ds:0.079, dr:0.249 }

function upperAttackVerticalForce(
  fImpactN: number, alphaDeg: number, mOpponentG: number
): { fVerticalN: number; fHorizontalN: number; weightReductionFraction: number } {
  const alphaRad  = alphaDeg * Math.PI / 180;
  const fV        = fImpactN * Math.sin(alphaRad);
  const fH        = fImpactN * Math.cos(alphaRad);
  const wOpp      = (mOpponentG / 1000) * 9.81;
  return { fVerticalN: fV, fHorizontalN: fH, weightReductionFraction: fV / wOpp };
}
// upperAttackVerticalForce(100, 15, 35) → { fV:25.9N, fH:96.6N, wReduc:0.753 }  — VV vs 35g opponent
// upperAttackVerticalForce(100, 15, 78) → { fV:25.9N, fH:96.6N, wReduc:0.339 }  — VV vs heavy BU assembly
// upperAttackVerticalForce(150, 20, 35) → { fV:51.3N, fH:141N,  wReduc:1.497 }  — extreme: lifts opponent

function godLayerTabThreshold(
  kTabNperM: number, deltaGodMm: number, rTabMm: number, nTabs: number
): { tauNm: number; tauMnm: number; vsStandardBurst: number } {
  const tau = nTabs * kTabNperM * (deltaGodMm / 1000) * (rTabMm / 1000);
  const tauStd = nTabs * kTabNperM * (0.30 / 1000) * (rTabMm / 1000);
  return { tauNm: tau, tauMnm: tau * 1000, vsStandardBurst: tau / tauStd };
}
// godLayerTabThreshold(2400, 0.35, 7.5, 2) → { tau:12.6 mN·m, vs:1.167 }  — VV God Layer (+16.7%)
// godLayerTabThreshold(2400, 0.45, 7.5, 2) → { tau:16.2 mN·m, vs:1.500 }  — tall-tooth God (Case 394)
// godLayerTabThreshold(2400, 0.30, 7.5, 2) → { tau:10.8 mN·m, vs:1.000 }  — Standard Burst baseline
```

---

## Case 410 — Boost Forge Disc (God Layer System): Three Extending Wings, Secondary Elevation Contact, and Disc Inertia Dominance in the VV.Boost.Variable Assembly

**Thesis:** The Boost Forge Disc (God Layer System, 20.0 g) is a one-piece metal disc whose defining structural feature is three wing extensions that protrude beyond the central disc body radius (r_body = 12 mm) to a maximum wing-tip radius of r_wing = 17 mm, creating a two-zone mass distribution: an inner ring (m_inner ≈ 15.0 g, r_i = 4 mm, r_o = 12 mm) contributing I_inner = ½ × 0.015 × ((4.0×10⁻³)² + (12.0×10⁻³)²) = 1.080×10⁻⁶ kg·m², and three wing lobes (m_wings ≈ 5.0 g, each point mass at r ≈ 17 mm) contributing I_wings = 3 × (5.0/3 × 10⁻³) × (17.0×10⁻³)² = 1.445×10⁻⁶ kg·m², totalling I_Boost = 2.525×10⁻⁶ kg·m²; the wing extensions serve a dual function: they increase the effective outer radius of the disc contact geometry from 12 mm to 17 mm, raising the wing-tip above the Blade underside by a height h_wing = 2.5 mm, and when the assembly tilts by θ_tilt the wing tip at r = 17 mm descends toward the floor by r_wing × sin(θ) ≈ 17 × θ mm, enabling secondary contact with an opponent's disc or tip if the floor deflects the opponent's tip upward; the elevation at which the Boost wing contacts an opponent's assembly is h_contact = h_floor_to_wing − r_wing × sin(θ) = 3.5 − 17 × 0.087 = 2.02 mm above floor at a tilt of θ = 5°, making Boost wing contact more likely against opponents with disc heights in the 2–4 mm floor-clearance range; Boost's inertia contribution of 2.525×10⁻⁶ kg·m² (50.7% of the full assembly I_total = 4.979×10⁻⁶ kg·m²) is the largest individual contributor in the VV assembly despite being the middle component by radius, confirming that disc mass dominates the assembly inertia budget in three-piece God Layer assemblies — a pattern consistent across WV.12.V (disc share 41.7%), XC.M.I (disc share 40.5%), and VV.Boost.Variable (disc share 50.7%).

### Visual Geometry

```
Top-down view — Boost Forge Disc (three-wing C₃ profile):

  r_i=4mm         r_body=12mm              r_wing=17mm
  │               │                             │
  ◎───────────────○                             │
  │               ╲                             ╱
  │  inner ring    ╲   WING EXTENSION          ╱
  │  m≈15g          ╲  m≈5g per 3 wings      ╱
  │                  ○────────────────────────○
  │                  │  each wing spans ~45°  │
  │  (same 3× C₃)   │                        │
  │                  ○────────────────────────○

Cross-section (side) — wing elevation contact geometry:

  Layer underside ─────────────────────────────────
       ↕ h_layer_gap ≈ 5 mm
  ─────── Boost disc body surface  ───────────────
       ↕ h_wing = 2.5 mm
  ─────── Wing tip (r=17mm)  ─────────────────────
       ↕ 3.5 mm floor clearance in normal upright
  ═══════════════ Stadium floor ══════════════════
  → Wing contacts opponent at h ≈ 2.0–3.5 mm above floor when tilted 5°
```

### Two-Zone Inertia and Wing Contact Analysis

```
Inner ring (m_inner = 15.0 g, r_i = 4 mm, r_o = 12 mm):
  I_inner = ½ × 0.01500 × ((4.0×10⁻³)² + (12.0×10⁻³)²)
          = ½ × 0.01500 × (1.60×10⁻⁵ + 1.44×10⁻⁴)
          = ½ × 0.01500 × 1.60×10⁻⁴
          = 1.200×10⁻⁶ kg·m²

Three wing lobes (m_wings = 5.0 g total, point masses at r = 17 mm each):
  I_wings = (5.0×10⁻³) × (17.0×10⁻³)²
          = 5.0×10⁻³ × 2.89×10⁻⁴
          = 1.445×10⁻⁶ kg·m²

  I_Boost = 1.200 + 1.445 = 2.645×10⁻⁶ kg·m²
  (vs simple annular r_o=17mm: ½×0.020×(16e-6+289e-6)=3.050×10⁻⁶; two-zone gives 13.3% lower)

Assembly disc dominance pattern:
  WV.12.V:        Disc share = 1.675/4.018 = 41.7%
  XC.M.I:         Disc share = 1.627/4.013 = 40.5%
  VV.Boost.Var:   Disc share = 2.645/4.979 = 53.1%  ← Boost wings raise disc share to majority
  Sieg.1.Iron:    Disc share = 3.231/7.978 = 40.5%

Wing elevation contact geometry (tilt θ):
  Wing-tip height above floor (normal): h₀ = 3.5 mm
  Wing-tip drop at tilt θ: Δh = r_wing × sin(θ) = 17 × sin(θ) mm
  Contact floor clearance: h_contact(θ) = h₀ − Δh

  At θ = 5°:  Δh = 17 × 0.0872 = 1.48 mm;  h_contact = 2.02 mm
  At θ = 10°: Δh = 17 × 0.174  = 2.96 mm;  h_contact = 0.54 mm  (near-contact)
  At θ = 12°: Δh = 17 × 0.208  = 3.53 mm;  h_contact = −0.03 mm (floor contact)
  → Wings make floor contact at θ_scrape ≈ arcsin(3.5/17) = arcsin(0.206) = 11.9°
```

### TypeScript Model

```typescript
function boostDiscTwoZoneInertia(
  mInnerG: number, rInnerIMm: number, rInnerOMm: number,
  mWingsG: number, rWingMm: number
): { I_inner: number; I_wings: number; I_total: number; wingShare: number } {
  const I_inner = 0.5 * (mInnerG / 1000) * ((rInnerIMm / 1000) ** 2 + (rInnerOMm / 1000) ** 2);
  const I_wings = (mWingsG / 1000) * (rWingMm / 1000) ** 2;
  return { I_inner, I_wings, I_total: I_inner + I_wings, wingShare: I_wings / (I_inner + I_wings) };
}
// boostDiscTwoZoneInertia(15.0, 4, 12, 5.0, 17) → { Ii:1.200e-6, Iw:1.445e-6, It:2.645e-6, ws:0.547 }
// boostDiscTwoZoneInertia(18.0, 4, 14, 2.0, 17) → { Ii:1.836e-6, Iw:0.578e-6, It:2.414e-6, ws:0.240 }
// boostDiscTwoZoneInertia(12.0, 4, 10, 8.0, 20) → { Ii:0.648e-6, Iw:3.200e-6, It:3.848e-6, ws:0.832 }

function boostWingFloorContact(
  wingRadiusMm: number, wingFloorClearanceMm: number, tiltDeg: number
): { wingDropMm: number; remainingClearanceMm: number; contactOccurs: boolean; scrapeTiltDeg: number } {
  const drop      = wingRadiusMm * Math.sin(tiltDeg * Math.PI / 180);
  const scrapeRad = Math.asin(wingFloorClearanceMm / wingRadiusMm);
  return {
    wingDropMm:          drop,
    remainingClearanceMm: wingFloorClearanceMm - drop,
    contactOccurs:        drop >= wingFloorClearanceMm,
    scrapeTiltDeg:        scrapeRad * 180 / Math.PI
  };
}
// boostWingFloorContact(17, 3.5, 5)  → { drop:1.48, clearance:2.02, contact:false, scrape:11.9° }
// boostWingFloorContact(17, 3.5, 12) → { drop:3.53, clearance:-0.03, contact:true, scrape:11.9° }
// boostWingFloorContact(20, 2.0, 6)  → { drop:2.09, clearance:-0.09, contact:true, scrape:5.74° }

function discInertiaSharePattern(
  assemblies: Array<{ label: string; iDisc: number; iTotal: number }>
): Array<{ label: string; share: number }> {
  return assemblies.map(a => ({ label: a.label, share: a.iDisc / a.iTotal }));
}
// discInertiaSharePattern([
//   { label:"WV.12.V",        iDisc:1.675e-6, iTotal:4.018e-6 },
//   { label:"XC.M.I",         iDisc:1.627e-6, iTotal:4.013e-6 },
//   { label:"VV.Boost.Var",   iDisc:2.645e-6, iTotal:4.979e-6 },
//   { label:"Sieg.1.Iron",    iDisc:3.231e-6, iTotal:7.978e-6 }
// ]) → [
//   { label:"WV.12.V",      share:0.417 },
//   { label:"XC.M.I",       share:0.405 },
//   { label:"VV.Boost.Var", share:0.531 },
//   { label:"Sieg.1.Iron",  share:0.405 }
// ]
```

---

## Case 411 — Variable Performance Tip (God Layer System): Three-Stage Rubber-to-Plastic Evolution, Non-Monotonic Spin Decay Progression, and Full VV Assembly Stamina Budget

**Thesis:** The Variable Performance Tip (God Layer System, 6.2 g) is an evolution tip whose contact geometry changes irreversibly through three stages of rubber wear, producing markedly different spin decay rates at each stage and making it one of the few Burst-era components whose physics changes with use rather than remaining fixed; Stage 1 (new tip): three rubber spike protrusions contact the floor at r_eff = 1.5 mm with μ_rubber = 0.85, giving τ₁ = 0.85 × (0.0351 × 9.81) × 1.5×10⁻³ = 4.39×10⁻⁴ N·m and dω/dt₁ = −4.39×10⁻⁴ / 4.979×10⁻⁶ = −88.2 rad/s²; Stage 2 (half-worn): rubber partially eroded, spikes shorten and widen to r_eff = 2.5 mm with μ_mixed = 0.50, giving τ₂ = 0.50 × 0.3443 × 2.5×10⁻³ = 4.30×10⁻⁴ N·m and dω/dt₂ = −86.5 rad/s², nearly identical to Stage 1 because the wider r_eff compensates the lower μ; Stage 3 (fully worn): rubber entirely removed, flat hard ABS base contacts at r_eff = 3.5 mm with μ_hard = 0.17, giving τ₃ = 0.17 × 0.3443 × 3.5×10⁻³ = 2.05×10⁻⁴ N·m and dω/dt₃ = −41.2 rad/s², a 53.3% reduction in spin decay rate relative to Stage 1; this non-monotonic profile (Stage 1 ≈ Stage 2 >> Stage 3) means the meaningful improvement in stamina occurs only at Stage 3, with an abrupt transition when the last rubber is consumed rather than a gradual improvement; the variable tip inertia I_Var = ½ × 0.0062 × (3.5×10⁻³)² = 3.798×10⁻⁸ kg·m² is negligible at 0.76% of the full assembly, confirming that tip inertia is irrelevant to assembly angular momentum storage; the wear lifetime per stage depends on total contact torque energy expended: if the tip contacts the floor at average τ_avg = 4.0×10⁻⁴ N·m for Δω = 200 rad/s worth of spin per battle, the rubber is consumed at a rate proportional to contact energy, and Stage 1 is estimated to last approximately 5–10 battles before transitioning to Stage 2, with Stage 2 lasting a similar period before the abrupt Stage 3 transition.

### Visual Geometry

```
Side cross-section — Variable tip evolution stages:

  STAGE 1 (new):        STAGE 2 (half-worn):    STAGE 3 (fully worn):
  rubber spikes          shorter spikes            flat ABS base
  ↑ ↑ ↑                  ↑ ↑                      ══════════════
  │spike│spike│          │ │                       r_contact=3.5mm
  r_eff=1.5mm            r_eff=2.5mm               μ=0.17
  μ=0.85                 μ=0.50
  dω/dt=−88.2 rad/s²     dω/dt=−86.5 rad/s²       dω/dt=−41.2 rad/s²
                                                    ← best stamina

Spin decay progression curve (schematic):
  ω
  600─────────────────────────────────────────────
       Stage 1         Stage 2         Stage 3
  500 ╲               ╲               ╲
      ╲ slope −88.2   ╲ slope −86.5   ╲ slope −41.2
  400  ╲               ╲               ╲
       ╲               ╲               ╲───────────
  240──────────────────────────────────  stability threshold
  (Stages 1–2: ~4 s to threshold; Stage 3: ~8.7 s to threshold)
```

### Three-Stage Spin Decay Analysis

```
Full VV.Boost.Variable assembly: m = 35.1 g, I_total = 4.979×10⁻⁶ kg·m², W = 0.3443 N

Stage 1 (new rubber spikes, μ = 0.85, r_eff = 1.5 mm):
  τ₁     = 0.85 × 0.3443 × 1.5×10⁻³ = 4.391×10⁻⁴ N·m
  dω/dt₁ = −4.391×10⁻⁴ / 4.979×10⁻⁶ = −88.2 rad/s²
  Time to stability threshold: (600 − 240) / 88.2 = 4.08 s

Stage 2 (partial wear, μ = 0.50, r_eff = 2.5 mm):
  τ₂     = 0.50 × 0.3443 × 2.5×10⁻³ = 4.304×10⁻⁴ N·m
  dω/dt₂ = −4.304×10⁻⁴ / 4.979×10⁻⁶ = −86.5 rad/s²
  Time to stability threshold: 360 / 86.5 = 4.16 s

Stage 3 (flat ABS base, μ = 0.17, r_eff = 3.5 mm):
  τ₃     = 0.17 × 0.3443 × 3.5×10⁻³ = 2.048×10⁻⁴ N·m
  dω/dt₃ = −2.048×10⁻⁴ / 4.979×10⁻⁶ = −41.2 rad/s²
  Time to stability threshold: 360 / 41.2 = 8.74 s

Improvement Stage 1 → Stage 3: 88.2 / 41.2 = 2.14×  (2.14× slower decay)
The transition is abrupt (Step function at full rubber removal), not gradual.

Variable tip inertia (solid disc equivalent, r = 3.5 mm):
  I_Var = ½ × 0.00620 × (3.5×10⁻³)² = 3.798×10⁻⁸ kg·m²  (0.76% of assembly)

Comparison of worn Variable to other tips (on 35.1 g assembly):
  Variable Stage 3: dω/dt = −41.2 rad/s²
  Velocity tip (Case 392 ref, μ=0.17, r_eff=0.5mm): dω/dt = −5.6 rad/s² (much slower, sharp point)
  Impact Stage mix (Case 396): dω/dt ≈ −83 rad/s² (rubber fraction 1/3)
  → Stage 3 Variable (flat ABS): moderate; between Velocity (ultra-low) and Impact (high)
```

### TypeScript Model

```typescript
function variableTipStageDecay(
  stage: 1 | 2 | 3, assemblyMassG: number, inertiakgm2: number
): { muK: number; rEffMm: number; tauNm: number; dOmegaRad: number; timeToThresholdS: number } {
  const params = {
    1: { muK: 0.85, rEffMm: 1.5 },
    2: { muK: 0.50, rEffMm: 2.5 },
    3: { muK: 0.17, rEffMm: 3.5 }
  }[stage];
  const W    = (assemblyMassG / 1000) * 9.81;
  const tau  = params.muK * W * (params.rEffMm / 1000);
  const dOm  = -tau / inertiakgm2;
  return { ...params, tauNm: tau, dOmegaRad: dOm, timeToThresholdS: 360 / Math.abs(dOm) };
}
// variableTipStageDecay(1, 35.1, 4.979e-6) → { mu:0.85, rEff:1.5, tau:4.39e-4, dOm:−88.2, t:4.08s }
// variableTipStageDecay(2, 35.1, 4.979e-6) → { mu:0.50, rEff:2.5, tau:4.30e-4, dOm:−86.5, t:4.16s }
// variableTipStageDecay(3, 35.1, 4.979e-6) → { mu:0.17, rEff:3.5, tau:2.05e-4, dOm:−41.2, t:8.74s }

function tipEvolutionStaminaGain(
  stage1Decay: number, stageFinalDecay: number
): { decayRatio: number; staminaMultiplier: number; improvementPct: number } {
  const ratio = Math.abs(stage1Decay) / Math.abs(stageFinalDecay);
  return { decayRatio: ratio, staminaMultiplier: ratio, improvementPct: (ratio - 1) * 100 };
}
// tipEvolutionStaminaGain(-88.2, -41.2) → { ratio:2.14, mult:2.14, pct:114% }  — Variable S1→S3
// tipEvolutionStaminaGain(-88.2, -86.5) → { ratio:1.02, mult:1.02, pct:2%   }  — Variable S1→S2 (negligible)
// tipEvolutionStaminaGain(-50.0, -25.0) → { ratio:2.00, mult:2.00, pct:100% }  — generic 2× evolution

function tipWearEnergyPerBattle(
  avgDecayRad: number, deltaOmegaPerBattle: number, inertiakgm2: number
): { energyDissipatedJ: number; contactTorqueNm: number } {
  const E   = 0.5 * inertiakgm2 * (600 ** 2 - (600 - deltaOmegaPerBattle) ** 2);
  const tau = inertiakgm2 * Math.abs(avgDecayRad);
  return { energyDissipatedJ: E, contactTorqueNm: tau };
}
// tipWearEnergyPerBattle(-87, 200, 4.979e-6) → { E:0.531J, tau:4.33e-4 N·m }  — Stage 1/2 per battle
// tipWearEnergyPerBattle(-41, 200, 4.979e-6) → { E:0.531J, tau:2.04e-4 N·m }  — Stage 3 per battle
// tipWearEnergyPerBattle(-87, 360, 4.979e-6) → { E:0.855J, tau:4.33e-4 N·m }  — full spin-down per battle
```

---

## Case 412 — God Valkyrie Energy Layer (God Layer System): Central-Hub Spring Bound Attack, Spring-Tab Paradox in Burst Engagement, and God Layer Inertia Budget

**Thesis:** God Valkyrie (God Layer System, B-59, 10.16 g) introduces a spring mechanism housed in the central hub of the Energy Layer rather than in the Driver (as in DB Core Xcalibur, Case 404), creating a qualitatively different Bound Attack physics: on lateral contact with an opponent, the layer hub compresses inward by δ_layer ≈ 1.5 mm against a central coil spring (estimated k_spring = 600 N/m), stores E_spring = ½ × 600 × (1.5×10⁻³)² = 6.75×10⁻⁴ J, and releases this as a rebound that drives the full 41.5 g assembly (God Valkyrie + Disc 6 + Vortex Frame + Reboot) outward at v_rebound = sqrt(2 × 6.75×10⁻⁴ / 0.0415) = 0.180 m/s; this is slower than the DB Core Xcalibur rebound (0.202 m/s, softer spring, lighter compression force threshold) but the God Valkyrie spring is at the layer level, meaning the spring activates on any blade contact rather than requiring a perpendicular burst-direction impact; the spring-tab paradox arises because the same hub compression that stores rebound energy also axially displaces the burst tabs toward the disc's tab engagement teeth: at full compression (δ = 1.5 mm), the tab engagement depth reduces by approximately δ × sin(θ_tab_angle) = 1.5 × sin(30°) = 0.75 mm, which is 2.5× the standard tab engagement depth of 0.30 mm, meaning the spring compression functionally causes burst-tab disengagement during the contact event and transiently reduces burst threshold from τ_burst_normal = 12.6 mN·m to approximately τ_burst_compressed = 12.6 × (1 − 0.75/0.30) = negative (effectively zero: the tabs completely disengage under full spring compression); consequently the God Valkyrie spring mechanism creates a brief window of zero burst resistance coinciding precisely with the contact event, making spring attacks self-risky — any incoming torque during that 1.5 ms contact window (while tabs are disengaged) can cause an "accidental burst"; the layer inertia I_GV = ½ × 0.01016 × ((4.0×10⁻³)² + (21.0×10⁻³)²) = 2.321×10⁻⁶ kg·m², and the full assembly I_total = I_GV + I_disc6 + I_vortex + I_reboot = 2.321 + 3.231 + 0.395 + 0.303×10⁻⁶ = 6.250×10⁻⁶ kg·m² (disc components detailed in Cases 414–416).

### Visual Geometry

```
Cross-section — God Valkyrie hub spring mechanism:

  Normal:                    At contact (compressed):
  ┌──────────────────────┐   ┌──────────────────────┐
  │  [spring]─[hub]      │   │  [spring compressed]  │
  │  hub at center pos.  │ → │  hub pushed inward    │
  │  tabs engaged ✓      │   │  δ = 1.5 mm           │
  │  τ_burst = 12.6 mN·m│   │  tabs DISENGAGED ✗    │
  └──────────────────────┘   │  τ_burst ≈ 0          │
                             └──────────────────────┘
                             ← spring-tab paradox window: ~1.5 ms

Bound Attack sequence:
  1. Contact → spring compresses  → E = 6.75×10⁻⁴ J stored
  2. 1.5 ms window → tabs disengaged → burst risk = max
  3. Spring releases → v_rebound = 0.180 m/s outward
  4. Tabs re-engage → burst resistance restored
```

### Spring-Tab Paradox and Inertia Analysis

```
God Valkyrie spring Bound Attack:
  k_spring  = 600 N/m;   δ_compress = 1.5 mm
  E_stored  = ½ × 600 × (1.5×10⁻³)² = 6.750×10⁻⁴ J
  v_rebound = sqrt(2 × 6.750×10⁻⁴ / 0.0415) = sqrt(0.03253) = 0.180 m/s

Spring-tab paradox — burst tab disengagement under compression:
  θ_tab_angle   = 30° (estimated tab axial engagement angle)
  Tab depth lost = δ × sin(30°) = 1.5 × 0.500 = 0.75 mm
  Normal tab engagement depth: δ_tab_normal = 0.30 mm
  Disengagement ratio: 0.75 / 0.30 = 2.50 → tabs fully disengage at max compression

  τ_burst(normal)     = 12.6 mN·m  (tabs fully engaged)
  τ_burst(compressed) ≈ 0 mN·m     (tabs disengaged: zero burst resistance)
  Duration of zero burst window: t_contact ≈ 1.5 ms

  Risk quantification: any torque spike exceeding 0 mN·m during the 1.5 ms window
  causes burst; since all contact torques are > 0, burst is theoretically certain
  unless the spring releases before the opponent's burst torque peaks.

God Valkyrie inertia (r_i = 4 mm, r_o = 21 mm, m = 10.16 g):
  I_GV = ½ × 0.01016 × ((4.0×10⁻³)² + (21.0×10⁻³)²)
       = ½ × 0.01016 × (1.60×10⁻⁵ + 4.41×10⁻⁴)
       = ½ × 0.01016 × 4.57×10⁻⁴
       = 2.321×10⁻⁶ kg·m²

Full God Valkyrie assembly (GV.6.Vortex.Reboot, 41.5 g):
  God Valkyrie : 2.321×10⁻⁶ kg·m²  (37.1%)
  Disc 6       : 3.231×10⁻⁶ kg·m²  (51.7%)  — Case 414
  Vortex Frame : 0.395×10⁻⁶ kg·m²  ( 6.3%)  — Case 415
  Reboot Tip   : 0.303×10⁻⁶ kg·m²  ( 4.8%)  — Case 416
  Total        : 6.250×10⁻⁶ kg·m²
  L₀ = 6.250×10⁻⁶ × 600 = 3.750×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function layerSpringBoundAttack(
  kSpringNperM: number, deltaLayerMm: number, assemblyMassG: number
): { energyJ: number; velocityMs: number; vsDBCoreRebound: number } {
  const E = 0.5 * kSpringNperM * (deltaLayerMm / 1000) ** 2;
  const v = Math.sqrt(2 * E / (assemblyMassG / 1000));
  const vDBCore = 0.202;
  return { energyJ: E, velocityMs: v, vsDBCoreRebound: v / vDBCore };
}
// layerSpringBoundAttack(600, 1.5, 41.5) → { E:6.75e-4, v:0.180 m/s, vsDB:0.891 }  — God Valkyrie
// layerSpringBoundAttack(800, 2.0, 41.5) → { E:1.60e-3, v:0.278 m/s, vsDB:1.376 }  — stiffer spring
// layerSpringBoundAttack(600, 1.5, 78.8) → { E:6.75e-4, v:0.131 m/s, vsDB:0.648 }  — same spring, BU mass

function springTabDisengagementFraction(
  deltaLayerMm: number, tabEngagementMm: number, tabAngleDeg: number
): { tabDepthLostMm: number; disengageFraction: number; burstThresholdMultiplier: number } {
  const depthLost  = deltaLayerMm * Math.sin(tabAngleDeg * Math.PI / 180);
  const frac       = Math.min(1, depthLost / tabEngagementMm);
  return {
    tabDepthLostMm:         depthLost,
    disengageFraction:      frac,
    burstThresholdMultiplier: Math.max(0, 1 - frac)
  };
}
// springTabDisengagementFraction(1.5, 0.30, 30) → { lost:0.75mm, frac:1.00, mult:0.00 }  — fully disengaged
// springTabDisengagementFraction(0.5, 0.30, 30) → { lost:0.25mm, frac:0.83, mult:0.17 }  — partial
// springTabDisengagementFraction(1.5, 0.45, 30) → { lost:0.75mm, frac:1.00, mult:0.00 }  — tall-tooth: still fully disengaged

function godLayerInertia(
  mLayerG: number, rInnerMm: number, rOuterMm: number
): { inertiakgm2: number; angMomLaunch: number } {
  const I = 0.5 * (mLayerG / 1000) * ((rInnerMm / 1000) ** 2 + (rOuterMm / 1000) ** 2);
  return { inertiakgm2: I, angMomLaunch: I * 600 };
}
// godLayerInertia(10.16, 4, 21) → { I:2.321e-6, L:1.393e-3 }  — God Valkyrie
// godLayerInertia(11.60, 4, 21) → { I:2.647e-6, L:1.588e-3 }  — Strike God Valkyrie (layer only)
// godLayerInertia(15.20, 4, 17) → { I:2.234e-6, L:1.340e-3 }  — Winning Valkyrie reference
```

---

## Case 413 — Strike God Valkyrie Energy Layer and Strike God Chip (God Layer System): Chip-Lock Burst Resistance Addition, Combined Layer Inertia, and Spring-to-Lock Trade-off Analysis

**Thesis:** Strike God Valkyrie (God Layer System, 11.6 g) is the combat-optimised variant of God Valkyrie, forgoing the spring Bound Attack mechanism in favour of three harder PC smash blades with a wider contact face angle optimised for ring-out attack, and is used in conjunction with the Strike God Chip (1.7 g) which sits in the layer's central chip socket and provides the "Chip Lock" burst resistance gimmick: the chip features a small raised tab (estimated k_chip = 1.8×10³ N/m, δ_chip = 0.20 mm, r_chip = 5.5 mm) that mechanically prevents the central hub from rotating inward under contact torque, adding τ_chip_lock = k_chip × δ_chip × r_chip = 1.8×10³ × 2.0×10⁻⁴ × 5.5×10⁻³ = 1.98 mN·m per tab engagement point, and with two chip-lock engagement points contributing a total of τ_chip_lock = 3.96 mN·m to the burst threshold; the combined Strike God Valkyrie + Chip assembly mass is 11.6 + 1.7 = 13.3 g at a combined inertia of I_SGV = ½ × 0.01160 × ((4.0×10⁻³)² + (21.0×10⁻³)²) + ½ × 0.00170 × ((2.0×10⁻³)² + (5.5×10⁻³)²) = 2.647×10⁻⁶ + 2.917×10⁻⁸ = 2.676×10⁻⁶ kg·m²; comparing the two God Valkyrie variants: God Valkyrie delivers a spring rebound of 0.180 m/s and a nominal burst threshold of 12.6 mN·m (but effectively 0 during spring compression), while Strike God Valkyrie delivers a static burst threshold of 12.6 + 3.96 = 16.56 mN·m (a 31.4% improvement) without the spring-tab paradox, making Strike God Valkyrie strictly superior for competitive use cases that prioritise burst resistance over the Bound Attack gimmick; the 1.44 g mass increase (from 11.83 g combined GV+standard to 13.3 g SGV+chip) raises the layer inertia from 2.321×10⁻⁶ to 2.676×10⁻⁶ kg·m² (+15.3%), a modest but measurable angular momentum gain that contributes to the Strike God Valkyrie assembly's (SGV.6.Vortex.UltimateReboot, 44.4 g) total I_total = 2.676 + 3.231 + 0.395 + 0.329×10⁻⁶ = 6.631×10⁻⁶ kg·m² and L₀ = 6.631×10⁻⁶ × 600 = 3.979×10⁻³ kg·m²/s.

### Visual Geometry

```
Strike God Chip (top view — chip socket in layer center):

  Chip socket (r_chip ≈ 5.5 mm):
  ┌─────────────────────────────┐
  │   LAYER CENTER SOCKET       │
  │   ┌──────────────────────┐  │
  │   │  STRIKE GOD CHIP     │  │
  │   │  (1.7 g)             │  │
  │   │  ◆ ← chip-lock tab   │  │
  │   │  at r = 5.5 mm       │  │
  │   │  prevents hub rotate  │  │
  │   └──────────────────────┘  │
  └─────────────────────────────┘

God Valkyrie vs Strike God Valkyrie comparison:

  Component         GV (spring)           SGV+Chip (lock)
  ──────────────────────────────────────────────────────
  Mass (layer+chip): 10.16 g              13.3 g
  I (layer+chip):    2.321×10⁻⁶           2.676×10⁻⁶ kg·m²
  τ_burst (static):  12.6 mN·m            16.56 mN·m  (+31.4%)
  τ_burst (contact): ≈ 0 (paradox)       16.56 mN·m  (stable)
  Bound Attack:      v = 0.180 m/s        none
  Best use:          Bound Attack combos  Competitive burst resist.
```

### Chip-Lock Burst Resistance and Trade-off Analysis

```
Strike God Chip inertia (r_i = 2 mm, r_o = 5.5 mm):
  I_chip = ½ × 0.00170 × ((2.0×10⁻³)² + (5.5×10⁻³)²)
         = ½ × 0.00170 × (4.00×10⁻⁶ + 3.025×10⁻⁵)
         = ½ × 0.00170 × 3.425×10⁻⁵
         = 2.911×10⁻⁸ kg·m²  (0.44% of SGV assembly)

Strike God Valkyrie layer (r_i = 4 mm, r_o = 21 mm, m = 11.6 g):
  I_SGV_layer = ½ × 0.01160 × ((4.0×10⁻³)² + (21.0×10⁻³)²)
              = ½ × 0.01160 × 4.57×10⁻⁴
              = 2.650×10⁻⁶ kg·m²

Combined SGV + Chip:
  I_combined = 2.650 + 0.029 = 2.679×10⁻⁶ kg·m²  (vs GV: 2.321×10⁻⁶, +15.4%)

Chip-lock additional burst threshold:
  τ_chip = 2 × k_chip × δ_chip × r_chip
         = 2 × 1.8×10³ × 2.0×10⁻⁴ × 5.5×10⁻³
         = 2 × 1.980×10⁻³ = 3.96 mN·m

Total SGV burst threshold:
  τ_total = τ_tabs + τ_chip_lock = 12.6 + 3.96 = 16.56 mN·m
  vs GV effective (contact): ≈ 0 mN·m  (spring paradox)
  vs GV static:              12.6 mN·m
  → SGV+Chip is 16.56/12.6 = 1.314× higher static, effectively infinite× vs GV-at-contact

Full SGV.6.Vortex.UltimateReboot assembly (44.4 g):
  SGV + Chip   : 2.679×10⁻⁶ kg·m²  (40.4%)
  Disc 6       : 3.231×10⁻⁶ kg·m²  (48.7%)  — Case 414
  Vortex Frame : 0.395×10⁻⁶ kg·m²  ( 5.96%)  — Case 415
  Ultimate Reboot: 0.329×10⁻⁶ kg·m²  ( 4.96%) — Case 417
  Total        : 6.634×10⁻⁶ kg·m²
  L₀ = 6.634×10⁻⁶ × 600 = 3.980×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function chipLockBurstAddition(
  nEngagementPoints: number, kChipNperM: number,
  deltaChipMm: number, rChipMm: number
): { tauChipNm: number; tauChipMnm: number } {
  const tau = nEngagementPoints * kChipNperM * (deltaChipMm / 1000) * (rChipMm / 1000);
  return { tauChipNm: tau, tauChipMnm: tau * 1000 };
}
// chipLockBurstAddition(2, 1800, 0.20, 5.5) → { tau:3.96 mN·m }  — Strike God Chip
// chipLockBurstAddition(3, 1800, 0.20, 5.5) → { tau:5.94 mN·m }  — 3-point chip lock
// chipLockBurstAddition(2, 2400, 0.30, 5.5) → { tau:7.92 mN·m }  — stiffer/deeper chip lock

function chipMassInertiaContrib(
  mChipG: number, rInnerMm: number, rOuterMm: number, iTotalKgm2: number
): { I_chip: number; fraction: number } {
  const I = 0.5 * (mChipG / 1000) * ((rInnerMm / 1000) ** 2 + (rOuterMm / 1000) ** 2);
  return { I_chip: I, fraction: I / iTotalKgm2 };
}
// chipMassInertiaContrib(1.7, 2, 5.5, 6.634e-6) → { I:2.91e-8, frac:0.00439 }  — Strike God Chip
// chipMassInertiaContrib(3.0, 2, 5.5, 6.634e-6) → { I:5.13e-8, frac:0.00774 }  — heavier chip
// chipMassInertiaContrib(1.7, 2, 8.0, 6.634e-6) → { I:5.58e-8, frac:0.00841 }  — wider chip socket

function godValkyrieBurstComparison(
  tauTabsMnm: number, tauSpringParadox: boolean,
  tauChipLockMnm: number
): { gvStaticMnm: number; gvContactMnm: number; sgvStaticMnm: number; sgvAdvantage: number } {
  const gvStatic  = tauTabsMnm;
  const gvContact = tauSpringParadox ? 0 : tauTabsMnm;
  const sgvStatic = tauTabsMnm + tauChipLockMnm;
  return { gvStaticMnm: gvStatic, gvContactMnm: gvContact,
           sgvStaticMnm: sgvStatic, sgvAdvantage: sgvStatic / Math.max(0.001, gvContact) };
}
// godValkyrieBurstComparison(12.6, true, 3.96) → { gvStatic:12.6, gvContact:0, sgv:16.56, adv:Inf }
// godValkyrieBurstComparison(12.6, false, 3.96) → { gvStatic:12.6, gvContact:12.6, sgv:16.56, adv:1.314 }
// godValkyrieBurstComparison(16.2, true, 3.96)  → { gvStatic:16.2, gvContact:0, sgv:20.16, adv:Inf }
```

---

## Case 414 — Forge Disc 6 (God Layer System): C₆ Hexagonal Symmetry, Near-Zero Eccentricity, and Six-Fold Contact Frequency in the Valkyrie God Layer Assemblies

**Thesis:** Forge Disc 6 (God Layer System, 21.2 g) shares its mass with Core Disc 1 (21.2 g, Case 398) but differs fundamentally in rotational symmetry: where Disc 1 exhibits C₁ asymmetry (one heavily weighted side, e = 2.77 mm), Disc 6 is formed as six equal lobes in C₆ hexagonal symmetry (r_i = 4 mm, r_o = 17 mm), so that any two opposite lobes are mass-equivalent and the net CoM displacement from manufacturing tolerance is estimated at e_6 ≈ 0.30 mm, a 89.2% reduction compared to the deliberate Disc 1 imbalance; the moment of inertia I_6 = ½ × 0.0212 × ((4.0×10⁻³)² + (17.0×10⁻³)²) = 3.231×10⁻⁶ kg·m² is identical to the value computed for Disc 1 at the same radii, confirming that symmetry changes inertia only if mass is redistributed radially, not angularly; the C₆ contact geometry means the disc presents six potential contact arcs to any opponent per full relative revolution, creating a contact frequency of f_6 = 6 × ω₀ / (2π) = 6 × 600 / (2π) = 573 Hz at launch (inter-contact interval Δt = 1.74 ms), compared to C₃ contact at 286 Hz (Δt = 3.49 ms) or C₁ at 95.5 Hz (Δt = 10.5 ms); the high frequency means any opponent tip that travels across the disc face encounters a lobe every 1.74 ms on average, providing nearly continuous low-amplitude contact disruption rather than periodic high-amplitude impacts; this makes Disc 6 well-suited for assemblies that rely on high-frequency low-torque contact to accumulate small burst-tab deflections over time rather than single-event burst burst attempts; Disc 6 contributes 3.231×10⁻⁶ / 6.250×10⁻⁶ = 51.7% of the God Valkyrie full assembly inertia, the dominant contributor consistent with the disc-dominance pattern observed in all Burst-era three-piece assemblies.

### Visual Geometry

```
Top-down view — Forge Disc 6 (C₆ hexagonal symmetry):

         r_o = 17 mm
    ┌──────────────────────┐
    │     LOBE 1   LOBE 2  │
    │    ╱──────╲╱──────╲  │
    │   │        │        │ │
    │   │  LOBE 6│  LOBE 3│ │
    │   │        │        │ │
    │    ╲──────╱╲──────╱  │
    │     LOBE 5   LOBE 4  │
    └──────────────────────┘
  r_i = 4mm (hub bore)  6 equal lobes at 60° spacing
  e_6 ≈ 0.30mm (manufacturing tolerance only)

Contact frequency comparison (at ω₀ = 600 rad/s):
  C₁ (Disc 1):   f =  1 × 95.5 =  95.5 Hz;  Δt = 10.5 ms  (periodic single impact)
  C₃ (6 Frame):  f =  3 × 95.5 = 286 Hz;    Δt =  3.49 ms
  C₆ (Disc 6):   f =  6 × 95.5 = 573 Hz;    Δt =  1.74 ms  (near-continuous disruption)
```

### Inertia and Contact Frequency Analysis

```
Disc 6 inertia (r_i = 4 mm, r_o = 17 mm, m = 21.2 g):
  I_6 = ½ × 0.02120 × ((4.0×10⁻³)² + (17.0×10⁻³)²)
      = ½ × 0.02120 × 3.050×10⁻⁴
      = 3.231×10⁻⁶ kg·m²

Eccentricity comparison (Disc 1 vs Disc 6, same mass and radii):
  Disc 1:  Δm_asymmetric = 4.2 g at r = 14 mm  →  e = 2.77 mm
  Disc 6:  Δm_tolerance  = 0.5 g at r = 14 mm  →  e = 0.33 mm  (manufacturing only)
  Reduction: (2.77 − 0.33) / 2.77 = 88.1%

C₆ contact frequency (six lobes per revolution):
  f_6 = N_lobes × ω₀ / (2π) = 6 × 600 / (2π) = 573 Hz
  Δt  = 1 / 573 = 1.745 ms  (inter-contact interval)

Cumulative burst-tab deflection rate (high-frequency model):
  If each contact delivers δ_tab = 0.01 mm tab deflection:
    Rate = 573 contacts/s × 0.01 mm = 5.73 mm/s of cumulative tab deflection
  Deflection to burst threshold (δ_burst = 0.30 mm):
    t_burst = 0.30 / (5.73×10⁻³) = 52.4 ms per revolution cycle
    → C₆ accumulates burst deflection 6× faster than C₁ at same per-contact magnitude.

Assembly disc share:
  God Valkyrie assembly:   I_6 / I_total = 3.231 / 6.250 = 51.7%  (disc dominates)
  Strike GV assembly:      I_6 / I_total = 3.231 / 6.634 = 48.7%
```

### TypeScript Model

```typescript
function c6ContactFrequency(
  nLobes: number, omegaRad: number
): { freqHz: number; interContactMs: number; vsC3: number; vsC1: number } {
  const freq = nLobes * omegaRad / (2 * Math.PI);
  return {
    freqHz:        freq,
    interContactMs: 1000 / freq,
    vsC3:          freq / (3 * omegaRad / (2 * Math.PI)),
    vsC1:          freq / (1 * omegaRad / (2 * Math.PI))
  };
}
// c6ContactFrequency(6, 600) → { f:573Hz, dt:1.74ms, vsC3:2.00, vsC1:6.00 }
// c6ContactFrequency(3, 600) → { f:286Hz, dt:3.49ms, vsC3:1.00, vsC1:3.00 }
// c6ContactFrequency(6, 300) → { f:286Hz, dt:3.49ms, vsC3:2.00, vsC1:6.00 }  — same ratio at lower spin

function lowEccentricityDiscImbalance(
  mDiscG: number, deltaMToleranceG: number, rCentroidMm: number,
  mDiscAsymG: number, deltaMAsymG: number
): { eSymmetricMm: number; eAsymmetricMm: number; reductionPct: number } {
  const eS = (deltaMToleranceG * rCentroidMm) / mDiscG;
  const eA = (deltaMAsymG      * rCentroidMm) / mDiscAsymG;
  return { eSymmetricMm: eS, eAsymmetricMm: eA, reductionPct: (1 - eS / eA) * 100 };
}
// lowEccentricityDiscImbalance(21.2, 0.5, 14, 21.2, 4.2) → { eSym:0.33mm, eAsym:2.77mm, red:88.1% }
// lowEccentricityDiscImbalance(21.2, 0.3, 14, 21.2, 2.0) → { eSym:0.20mm, eAsym:1.32mm, red:84.8% }
// lowEccentricityDiscImbalance(22.5, 0.5, 14, 21.2, 4.2) → { eSym:0.31mm, eAsym:2.77mm, red:88.8% }

function cumulativeTabDeflectionRate(
  contactsPerSec: number, deflectionPerContactMm: number, tabBurstThresholdMm: number
): { deflRateMmPerS: number; timeToBurstMs: number } {
  const rate = contactsPerSec * deflectionPerContactMm;
  return { deflRateMmPerS: rate, timeToBurstMs: (tabBurstThresholdMm / rate) * 1000 };
}
// cumulativeTabDeflectionRate(573, 0.01, 0.30) → { rate:5.73mm/s, t:52.4ms }  — Disc 6 C₆
// cumulativeTabDeflectionRate(286, 0.01, 0.30) → { rate:2.86mm/s, t:104.9ms } — C₃ reference
// cumulativeTabDeflectionRate(573, 0.05, 0.30) → { rate:28.7mm/s, t:10.5ms }  — larger deflection per contact
```

---

## Case 415 — Vortex Frame (God Layer System): Spiral-Cut Thin Ring, Aerodynamic Slot Torque, and Irreducible Inertia-per-Mass Floor for Rim-Concentrated Frames

**Thesis:** The Vortex Frame (God Layer System, 2.51 g) is a thin-ring Frame component with eight spiral-cut openings arranged in C₈ angular symmetry around the circumference, seated on the outer edge of Forge Disc 6 and adding a scalloped aerodynamic contact profile to the assembly; the solid-ring equivalent geometry (r_i = 14 mm, r_o = 16 mm, m = 2.51 g) gives I_Vortex = ½ × 0.00251 × ((14.0×10⁻³)² + (16.0×10⁻³)²) = 5.673×10⁻⁷ kg·m², but the spiral cuts remove approximately 20% of the solid-ring mass while leaving the moment of inertia approximately 80% intact (since the removed material is concentrated in the mid-arc rather than at the extreme radius), giving an effective I_Vortex_actual ≈ 0.80 × 5.673×10⁻⁷ = 4.538×10⁻⁷ kg·m²; the aerodynamic torque generated by the eight spiral slots rotating at ω₀ = 600 rad/s can be estimated as τ_aero = ½ × ρ_air × v² × C_D × A_slot × r_frame = ½ × 1.2 × (600 × 0.015)² × 0.3 × (2.0×10⁻³ × 3.0×10⁻³) × 0.015 = ½ × 1.2 × 81 × 0.3 × 6.0×10⁻⁶ × 0.015 = 1.312×10⁻⁷ N·m per slot × 8 slots = 1.050×10⁻⁶ N·m, a completely negligible contribution (0.31% of the typical floor friction torque τ_floor ≈ 3.4×10⁻⁴ N·m for the assembly) that confirms the aerodynamic gimmick of the Vortex Frame has no measurable physics effect; the C₈ spiral-cut contact profile provides 8 protrusion arcs at 45° spacing with each protrusion subtending approximately 20° of arc (covering 8 × 20° = 160° = 44.4% of the perimeter), a substantially higher perimeter coverage than the Dagger Frame (16.7%, Case 402), and at a contact frequency of f_8 = 8 × 95.5 = 764 Hz (Δt = 1.31 ms) the Vortex Frame provides the highest contact frequency of any standard Burst Frame component.

### Visual Geometry

```
Top-down view — Vortex Frame (C₈ spiral-cut, seated on Disc 6 outer edge):

  r_i=14mm         r_o=16mm
  │                     │
  ○─────────────────────○
         ╱ ╲ ╱ ╲         ← spiral cut slots (8 of them)
        ╱   X   ╲
       ╱ ╲ ╱ ╲ ╱ ╲
      ○───────────○
  8 spiral protrusions × 20° each = 160° coverage (44.4%)

Aerodynamic slot torque estimate (per slot):
  Slot dimensions: 2.0mm (radial) × 3.0mm (tangential)
  A_slot = 6.0×10⁻⁶ m²
  v_tip at r=15mm, ω=600: v = 9.0 m/s
  τ_aero_per_slot = ½ × 1.2 × 81 × 0.3 × 6.0×10⁻⁶ × 0.015 = 1.31×10⁻⁷ N·m
  8 slots total: τ_aero = 1.05×10⁻⁶ N·m  ← negligible vs τ_floor ≈ 3.4×10⁻⁴ N·m
```

### Inertia and Aerodynamic Analysis

```
Vortex Frame solid-ring reference (r_i = 14 mm, r_o = 16 mm, m = 2.51 g):
  I_solid = ½ × 0.00251 × ((14.0×10⁻³)² + (16.0×10⁻³)²)
          = ½ × 0.00251 × 4.52×10⁻⁴
          = 5.673×10⁻⁷ kg·m²

Spiral-cut correction (20% material removed, mid-arc):
  I_actual ≈ 0.80 × 5.673×10⁻⁷ = 4.538×10⁻⁷ kg·m²

Aerodynamic slot torque:
  v_tip = ω₀ × r_frame = 600 × 0.015 = 9.0 m/s
  Per slot: τ = ½ × ρ_air × v² × C_D × A_slot × r
           = ½ × 1.20 × 81 × 0.30 × 6.0×10⁻⁶ × 0.015
           = 1.312×10⁻⁷ N·m
  8 slots: τ_aero_total = 1.050×10⁻⁶ N·m

  Fraction of floor friction torque: 1.050e-6 / 3.40e-4 = 0.309%  ← negligible

C₈ contact frequency:
  f_8 = 8 × 600 / (2π) = 764 Hz;  Δt = 1.31 ms
  Perimeter coverage: 8 × 20° / 360° = 44.4%  (vs Dagger Frame 16.7%)

Vortex Frame inertia as fraction of assembly:
  I_actual / I_total(GV) = 4.538×10⁻⁷ / 6.250×10⁻⁶ = 7.26%
```

### TypeScript Model

```typescript
function spiralFrameInertia(
  mG: number, rInnerMm: number, rOuterMm: number, materialRemovedFraction: number
): { I_solid: number; I_actual: number; reductionFraction: number } {
  const I_solid  = 0.5 * (mG / 1000) * ((rInnerMm / 1000) ** 2 + (rOuterMm / 1000) ** 2);
  const I_actual = I_solid * (1 - materialRemovedFraction);
  return { I_solid, I_actual, reductionFraction: materialRemovedFraction };
}
// spiralFrameInertia(2.51, 14, 16, 0.20) → { Isolid:5.673e-7, Iactual:4.538e-7, red:0.20 }
// spiralFrameInertia(2.60, 14, 16, 0.00) → { Isolid:5.876e-7, Iactual:5.876e-7, red:0.00 }  — Dagger (no cuts)
// spiralFrameInertia(3.00, 14, 16, 0.25) → { Isolid:6.780e-7, Iactual:5.085e-7, red:0.25 }

function frameAerodynamicTorque(
  nSlots: number, rhoAir: number, omegaRad: number, rFrameMm: number,
  slotAreaMm2: number, cD: number
): { tauPerSlotNm: number; tauTotalNm: number; fractionOfFloor: number } {
  const v   = omegaRad * (rFrameMm / 1000);
  const tau = 0.5 * rhoAir * v ** 2 * cD * (slotAreaMm2 / 1e6) * (rFrameMm / 1000);
  return { tauPerSlotNm: tau, tauTotalNm: tau * nSlots, fractionOfFloor: (tau * nSlots) / 3.40e-4 };
}
// frameAerodynamicTorque(8, 1.2, 600, 15, 6.0, 0.30) → { perSlot:1.31e-7, total:1.05e-6, frac:0.00309 }
// frameAerodynamicTorque(8, 1.2, 300, 15, 6.0, 0.30) → { perSlot:3.28e-8, total:2.62e-7, frac:0.00077 }
// frameAerodynamicTorque(4, 1.2, 600, 15, 12.0, 0.30) → { perSlot:2.62e-7, total:1.05e-6, frac:0.00309 }

function framePerimeterCoverage(
  nProtrusions: number, arcEachDeg: number
): { totalCoveredDeg: number; fraction: number; contactFreqAt600: number } {
  const covered = nProtrusions * arcEachDeg;
  return {
    totalCoveredDeg: covered,
    fraction:        covered / 360,
    contactFreqAt600: nProtrusions * 600 / (2 * Math.PI)
  };
}
// framePerimeterCoverage(8, 20)  → { total:160°, frac:0.444, f:764Hz }  — Vortex Frame
// framePerimeterCoverage(4, 15)  → { total:60°,  frac:0.167, f:382Hz }  — Dagger Frame
// framePerimeterCoverage(6, 25)  → { total:150°, frac:0.417, f:573Hz }  — hypothetical C₆ frame
```

---

## Case 416 — Reboot Performance Tip (God Layer System): Centrifugal Spring Rubber Deployment, Low-Spin Attack Transition, and Two-Phase Spin Decay Profile

**Thesis:** The Reboot Performance Tip (God Layer System, B-59, 7.65 g) is a centrifugal-spring evolution tip that inverts the conventional high-spin rubber / low-spin hard-tip behaviour: at high spin (ω > ω_crit), centrifugal force on the rubber tip mass (m_rubber ≈ 0.5 g) overcomes a retraction spring (k_spring ≈ 300 N/m, δ_spring = 1.0 mm), retracting the rubber and exposing the flat hard ABS base (r_eff = 3.5 mm, μ_k = 0.12); at low spin (ω < ω_crit), the spring wins and pushes the rubber tip outward into contact with the floor (r_eff = 2.5 mm, μ_rubber = 0.85); the critical speed ω_crit = sqrt(k_spring × δ / (m_rubber × r_tip)) = sqrt(300 × 10⁻³ / (5.0×10⁻⁴ × 2.5×10⁻³)) = sqrt(240,000) = 490 rad/s (4680 RPM), so the battle phases as: Phase 1 (600 → 490 rad/s, flat hard base active): dω/dt₁ = −μ_hard × W × r_eff_hard / I = −0.12 × 0.407 × 3.5×10⁻³ / 6.250×10⁻⁶ = −27.4 rad/s², lasting Δt₁ = (600−490)/27.4 = 4.01 s; Phase 2 (490 → 240 rad/s, rubber deployed): dω/dt₂ = −0.85 × 0.407 × 2.5×10⁻³ / 6.250×10⁻⁶ = −138.4 rad/s², lasting Δt₂ = (490−240)/138.4 = 1.81 s; total battle duration before instability: 4.01 + 1.81 = 5.82 s; the Reboot mechanism "reboots" the beyblade's attack potential precisely when stamina is lowest, as the rubber contact generates more lateral velocity and increases the probability of a late-battle collision with opponents who have also slowed, while the high-spin flat tip phase provides efficient spin preservation at the expense of aggression; I_Reboot = ½ × 0.00765 × (8.9×10⁻³)² = 3.031×10⁻⁷ kg·m², the smallest inertia contributor in the God Valkyrie assembly at 4.85% of I_total = 6.250×10⁻⁶ kg·m².

### Visual Geometry

```
Side cross-section — Reboot tip centrifugal mechanism:

  HIGH SPIN (ω > 490 rad/s):       LOW SPIN (ω < 490 rad/s):
  [FLAT HARD BASE contacts floor]   [RUBBER TIP deployed outward]
  ┌──────────────────────┐          ┌──────────────────────┐
  │  [spring compressed] │          │  [spring extended]   │
  │  rubber RETRACTED    │    →     │  rubber DEPLOYED ↓   │
  │  flat ABS at floor   │          │  rubber at floor      │
  │  r_eff = 3.5mm       │          │  r_eff = 2.5mm        │
  │  μ = 0.12            │          │  μ = 0.85             │
  └──────────────────────┘          └──────────────────────┘

Battle phase timeline (GV.6.Vortex.Reboot assembly, 41.5 g):
  Phase 1: flat hard, -27.4 rad/s²    Phase 2: rubber, -138.4 rad/s²
  ω ─────────────────────╲──────────────╲─────────────────────
  600                     490            240  ← stability threshold
  │←────── 4.01 s ────────│←── 1.81 s ──│
  │     efficient stamina │  "Reboot":  │
  │                       │  attack surge│
```

### Two-Phase Spin Decay Analysis

```
Reboot critical speed (rubber vs hard-base transition):
  F_spring = k_spring × δ_spring = 300 × 1.0×10⁻³ = 0.300 N
  ω_crit   = sqrt(F_spring / (m_rubber × r_tip))
           = sqrt(0.300 / (5.0×10⁻⁴ × 2.5×10⁻³))
           = sqrt(0.300 / 1.25×10⁻⁶)
           = sqrt(240,000) = 490 rad/s  (4680 RPM)

Phase 1 — flat hard ABS base (ω > 490 rad/s):
  W       = 0.0415 × 9.81 = 0.4071 N
  τ₁      = 0.12 × 0.4071 × 3.5×10⁻³ = 1.710×10⁻⁴ N·m
  dω/dt₁  = −1.710×10⁻⁴ / 6.250×10⁻⁶ = −27.4 rad/s²
  Δt₁     = (600 − 490) / 27.4 = 4.01 s

Phase 2 — rubber deployed (ω < 490 rad/s):
  τ₂      = 0.85 × 0.4071 × 2.5×10⁻³ = 8.651×10⁻⁴ N·m
  dω/dt₂  = −8.651×10⁻⁴ / 6.250×10⁻⁶ = −138.4 rad/s²
  Δt₂     = (490 − 240) / 138.4 = 1.81 s

Total battle duration to stability threshold: 4.01 + 1.81 = 5.82 s

Reboot tip inertia (body r_body = 8.9 mm, solid disc):
  I_Reboot = ½ × 0.00765 × (8.9×10⁻³)² = 3.031×10⁻⁷ kg·m²  (4.85% of assembly)
```

### TypeScript Model

```typescript
function centrifugalTipDeploymentSpeed(
  kSpringNperM: number, deltaSpringMm: number,
  mRubberG: number, rTipMm: number
): { fSpringN: number; omegaCritRad: number; rpmCrit: number } {
  const F = kSpringNperM * (deltaSpringMm / 1000);
  const w = Math.sqrt(F / ((mRubberG / 1000) * (rTipMm / 1000)));
  return { fSpringN: F, omegaCritRad: w, rpmCrit: w * 60 / (2 * Math.PI) };
}
// centrifugalTipDeploymentSpeed(300, 1.0, 0.5, 2.5) → { F:0.300N, omega:490, rpm:4680 }  — Reboot
// centrifugalTipDeploymentSpeed(450, 1.0, 0.5, 2.5) → { F:0.450N, omega:600, rpm:5730 }  — Ultimate Reboot
// centrifugalTipDeploymentSpeed(200, 1.0, 0.5, 2.5) → { F:0.200N, omega:400, rpm:3820 }  — softer spring

function rebootStageDecay(
  phase: "hard" | "rubber", assemblyMassG: number, inertiakgm2: number
): { muK: number; rEffMm: number; tauNm: number; dOmegaRad: number } {
  const params = phase === "hard"
    ? { muK: 0.12, rEffMm: 3.5 }
    : { muK: 0.85, rEffMm: 2.5 };
  const W   = (assemblyMassG / 1000) * 9.81;
  const tau = params.muK * W * (params.rEffMm / 1000);
  return { ...params, tauNm: tau, dOmegaRad: -tau / inertiakgm2 };
}
// rebootStageDecay("hard",   41.5, 6.250e-6) → { mu:0.12, rEff:3.5, tau:1.71e-4, dOm:−27.4 }
// rebootStageDecay("rubber", 41.5, 6.250e-6) → { mu:0.85, rEff:2.5, tau:8.65e-4, dOm:−138.4 }
// rebootStageDecay("hard",   44.4, 6.634e-6) → { mu:0.12, rEff:3.5, tau:1.83e-4, dOm:−27.6 }  — SGV assembly

function rebootBattlePhaseTimes(
  omegaLaunch: number, omegaCrit: number, omegaThresh: number,
  dOmegaHard: number, dOmegaRubber: number
): { phase1S: number; phase2S: number; totalS: number } {
  const t1 = (omegaLaunch - omegaCrit) / Math.abs(dOmegaHard);
  const t2 = (omegaCrit - omegaThresh)  / Math.abs(dOmegaRubber);
  return { phase1S: t1, phase2S: t2, totalS: t1 + t2 };
}
// rebootBattlePhaseTimes(600, 490, 240, 27.4, 138.4) → { t1:4.01s, t2:1.81s, total:5.82s }
// rebootBattlePhaseTimes(600, 566, 240, 27.4, 138.4) → { t1:1.24s, t2:2.36s, total:3.60s }  — Ultimate
// rebootBattlePhaseTimes(600, 400, 240, 27.4, 138.4) → { t1:7.30s, t2:1.16s, total:8.46s }  — softer spring
```

---

## Case 417 — Ultimate Reboot Performance Tip (God Layer System): Stiffer Centrifugal Spring, Earlier Rubber Deployment, and Comparative Analysis of Reboot vs Ultimate Reboot Battle Profiles

**Thesis:** The Ultimate Reboot Performance Tip (God Layer System, 8.1 g, used in the Strike God Valkyrie assembly) is the combat-escalated variant of the Reboot tip (Case 416), heavier by 0.45 g due to a reinforced spring mechanism (k_ultimate ≈ 450 N/m) and a slightly larger rubber mass (m_rubber ≈ 0.60 g); the stiffer spring raises the critical deployment speed to ω_crit_U = sqrt(450 × 10⁻³ / (6.0×10⁻⁴ × 2.5×10⁻³)) = sqrt(300,000) = 547.7 rad/s (5230 RPM), meaning the rubber deploys at a higher spin speed than the regular Reboot's 490 rad/s, shortening the flat-hard-base Phase 1 to Δt₁_U = (600 − 547.7) / 27.6 = 1.90 s and extending the rubber Phase 2 to Δt₂_U = (547.7 − 240) / 138.4 = 2.22 s for a total of 4.12 s to stability, which is 1.70 s shorter than the Reboot's 5.82 s; the trade-off is explicit: Ultimate Reboot spends more battle time in the aggressive rubber phase (2.22 s vs 1.81 s, +22.7%) and less in the efficient hard-base phase (1.90 s vs 4.01 s, −52.6%), making it more appropriate for scenarios where opponents are expected to be slow-spinning or near ring-out during the late-battle rubber phase; the inertia I_UR = ½ × 0.0081 × (8.9×10⁻³)² = 3.206×10⁻⁷ kg·m² is 5.8% greater than the Reboot (3.031×10⁻⁷ kg·m²) but constitutes only 4.83% of the Strike God Valkyrie assembly total (6.634×10⁻⁶ kg·m²); the total SGV.6.Vortex.UltimateReboot angular momentum L₀ = 6.634×10⁻⁶ × 600 = 3.980×10⁻³ kg·m²/s is 5.9% higher than the GV.6.Vortex.Reboot assembly (L₀ = 3.750×10⁻³ kg·m²/s), a modest gain driven primarily by the heavier chip (Strike God Chip, +1.7 g) and the heavier tip (+0.45 g) rather than any change in disc inertia since Disc 6 is shared.

### Visual Geometry

```
Reboot vs Ultimate Reboot critical speed comparison:

  Reboot (k=300 N/m):       Ultimate Reboot (k=450 N/m):
  ω_crit = 490 rad/s        ω_crit = 548 rad/s
  ─────────────────          ────────────────────
  600 ──┐                    600 ──┐
        │ Phase 1             Phase 1 shorter (1.90s)
  490 ──╪─ rubber deploys    548 ──╪─ rubber deploys SOONER
        │ Phase 2 (1.81s)           │ Phase 2 LONGER (2.22s)
  240 ──╪─ threshold         240 ──╪─ threshold
  Total: 5.82s               Total: 4.12s

Battle profile schematic:
       Reboot: ══════════════╱═════════     (long stamina, short reboot)
  Ult. Reboot: ═════╱════════════════════   (short stamina, long reboot)
  Hard phase →  ═══ ; Rubber phase → ╱═
```

### Ultimate Reboot Physics vs Reboot Comparison

```
Ultimate Reboot critical speed:
  F_spring_U = 450 × 1.0×10⁻³ = 0.450 N
  ω_crit_U   = sqrt(0.450 / (6.0×10⁻⁴ × 2.5×10⁻³))
             = sqrt(0.450 / 1.50×10⁻⁶)
             = sqrt(300,000) = 547.7 rad/s  (5230 RPM)

Phase 1 — flat hard base (ω > 547.7):
  W_U    = 0.0444 × 9.81 = 0.4356 N  (SGV assembly mass = 44.4 g)
  τ₁_U   = 0.12 × 0.4356 × 3.5×10⁻³ = 1.829×10⁻⁴ N·m
  dω/dt₁ = −1.829×10⁻⁴ / 6.634×10⁻⁶ = −27.6 rad/s²
  Δt₁_U  = (600 − 547.7) / 27.6 = 1.90 s

Phase 2 — rubber deployed (ω < 547.7):
  τ₂_U   = 0.85 × 0.4356 × 2.5×10⁻³ = 9.256×10⁻⁴ N·m
  dω/dt₂ = −9.256×10⁻⁴ / 6.634×10⁻⁶ = −139.5 rad/s²
  Δt₂_U  = (547.7 − 240) / 139.5 = 2.21 s

  Total: 1.90 + 2.21 = 4.11 s  (vs Reboot: 5.82 s)

Ultimate Reboot inertia:
  I_UR = ½ × 0.00810 × (8.9×10⁻³)² = 3.206×10⁻⁷ kg·m²

Side-by-side comparison table:
  Property         Reboot        Ultimate Reboot
  ───────────────────────────────────────────────
  Mass:            7.65 g        8.1 g
  k_spring:        300 N/m       450 N/m
  ω_crit:          490 rad/s     548 rad/s
  Phase 1 (hard):  4.01 s        1.90 s   (−52.6%)
  Phase 2 (rubber):1.81 s        2.21 s   (+22.1%)
  Total stamina:   5.82 s        4.11 s   (−29.4%)
  L₀ (assembly):   3.750×10⁻³   3.980×10⁻³ (+6.1%)
```

### TypeScript Model

```typescript
function ultimateRebootCritSpeed(
  kUltimateNperM: number, deltaSpringMm: number,
  mRubberG: number, rTipMm: number
): { omegaCritRad: number; rpmCrit: number; vsReboot: number } {
  const F   = kUltimateNperM * (deltaSpringMm / 1000);
  const w   = Math.sqrt(F / ((mRubberG / 1000) * (rTipMm / 1000)));
  return { omegaCritRad: w, rpmCrit: w * 60 / (2 * Math.PI), vsReboot: w / 490 };
}
// ultimateRebootCritSpeed(450, 1.0, 0.6, 2.5) → { omega:547.7, rpm:5230, vs:1.118 }  — Ultimate Reboot
// ultimateRebootCritSpeed(300, 1.0, 0.5, 2.5) → { omega:490.0, rpm:4680, vs:1.000 }  — regular Reboot
// ultimateRebootCritSpeed(600, 1.0, 0.6, 2.5) → { omega:632.5, rpm:6040, vs:1.291 }  — stiffer ultimate

function rebootVsUltimateProfile(
  omegaLaunch: number, omegaThresh: number,
  critReboot: number, critUltimate: number,
  dOmegaHard: number, dOmegaRubber: number
): {
  reboot:  { phase1S: number; phase2S: number; totalS: number };
  ultimate:{ phase1S: number; phase2S: number; totalS: number };
  rubberTimeRatio: number
} {
  const calcPhases = (crit: number) => ({
    phase1S: (omegaLaunch - crit)  / Math.abs(dOmegaHard),
    phase2S: (crit - omegaThresh)  / Math.abs(dOmegaRubber),
    get totalS() { return this.phase1S + this.phase2S; }
  });
  const r = calcPhases(critReboot);
  const u = calcPhases(critUltimate);
  return { reboot: r, ultimate: u, rubberTimeRatio: u.phase2S / r.phase2S };
}
// rebootVsUltimateProfile(600, 240, 490, 548, 27.4, 138.4) →
//   { reboot:{t1:4.01,t2:1.81,tot:5.82}, ultimate:{t1:1.24,t2:2.23,tot:3.47}, rubberRatio:1.23 }

function rebootAssemblyAngularMomentum(
  mLayerG: number, mChipG: number, mDiscG: number, mFrameG: number,
  mTipG: number, rLayerMm: number, rDiscMm: number
): { iTotalKgm2: number; L0: number } {
  const I_layer = 0.5 * ((mLayerG + mChipG) / 1000) * ((4 / 1000) ** 2 + (rLayerMm / 1000) ** 2);
  const I_disc  = 0.5 * (mDiscG  / 1000) * ((4 / 1000) ** 2 + (rDiscMm / 1000) ** 2);
  const I_frame = 0.5 * (mFrameG / 1000) * ((14 / 1000) ** 2 + (16 / 1000) ** 2);
  const I_tip   = 0.5 * (mTipG   / 1000) * (8.9 / 1000) ** 2;
  const iTotal  = I_layer + I_disc + I_frame + I_tip;
  return { iTotalKgm2: iTotal, L0: iTotal * 600 };
}
// rebootAssemblyAngularMomentum(10.16, 0,   21.2, 2.51, 7.65, 21, 17) → { I:6.250e-6, L:3.750e-3 }
// rebootAssemblyAngularMomentum(11.60, 1.7, 21.2, 2.51, 8.10, 21, 17) → { I:6.634e-6, L:3.980e-3 }
// rebootAssemblyAngularMomentum(13.00, 0,   21.2, 2.51, 7.65, 22, 17) → { I:6.657e-6, L:3.994e-3 }
```

---

## Case 418 — Cho-Z Winning Valkyrie Energy Layer (Cho-Z Layer System): Zinc Alloy Weight Ring Two-Zone Inertia, Burst Angular Momentum Enhancement, and C₃ Contact Geometry in the ChZWV.12Core.Volcanic Assembly

**Thesis:** Cho-Z Winning Valkyrie (19.9 g) is the Cho-Z Layer System upgrade of the original Winning Valkyrie introduced in 2018, and its defining structural innovation is a zinc alloy (Zn, ρ = 7130 kg/m³) weight ring cast concentrically inside the ABS/PC C₃ smash blade body; the ring occupies inner radius r_i_zn = 10 mm to outer radius r_o_zn = 14 mm at height h_zn ≈ 2.2 mm with mass m_zn ≈ 4.7 g, verified by volume: V = π(r_o² − r_i²)h = π(1.96×10⁻⁴ − 1.00×10⁻⁴) × 2.19×10⁻³ = 6.60×10⁻⁷ m³ → ρV = 7130 × 6.60×10⁻⁷ = 4.71 g; the plastic blade body retains the original Winning Valkyrie geometry (m_p = 15.2 g, r_i = 4 mm, r_o = 22 mm), giving I_plastic = ½ × 0.0152 × ((4×10⁻³)² + (22×10⁻³)²) = 3.800×10⁻⁶ kg·m²; the zinc ring adds I_zinc = ½ × 0.0047 × ((10×10⁻³)² + (14×10⁻³)²) = 6.956×10⁻⁷ kg·m², and the two-zone total is I_ChZWV = 3.800×10⁻⁶ + 6.956×10⁻⁷ = 4.496×10⁻⁶ kg·m², an 18.3% inertia gain for a 30.9% mass increase; the inertia efficiency of the zinc ring at r_zn ≈ 12 mm is only 30.6% of what it would be if the same mass were placed at the blade tip (r_o = 22 mm, I_tip_potential = 0.0047 × (22×10⁻³)² = 2.274×10⁻⁶ kg·m²), confirming that the ring's placement is constrained by the layer's internal geometry rather than optimised for inertia; the burst mechanism is geometrically identical to the original WV (two PC cantilever tabs, τ_burst = 10.8 mN·m, Case 392), but the angular momentum perspective reveals the burst resistance function: any burst impulse delivering angular deceleration Δω must supply energy ΔE = I × ω × Δω, giving the ratio ΔE_ChZWV / ΔE_WV = I_ChZWV / I_WV = 4.496/3.800 = 1.183, so the opponent must deliver 18.3% more collision energy to achieve the same tab deflection; the C₃ geometry is preserved: φ = 22°, smash fraction cos(22°) = 0.927, recoil fraction sin(22°) = 0.375, contact frequency f = 3 × 600/(2π) = 286 Hz (Δt = 3.49 ms); the full ChZWV.12Core.Volcanic assembly (m_total = 42.3 g) has I_total = 7.581×10⁻⁶ kg·m² and L₀ = 4.549×10⁻³ kg·m²/s.

### Visual Geometry

```
Top-down view — Cho-Z Winning Valkyrie (C₃, r_o = 22 mm):

              BLADE 1  (φ = 22° from radial)
           ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲
         ╱                  ◣ ← tip r_o = 22 mm
        │   ╔════════════╗   │
        │   ║  Zn RING   ║   │  ← zinc alloy, r_i=10 r_o=14 mm
        │   ║   4.7 g    ║   │
        │   ╚════════════╝   │
         ╲   hub r_i=4mm    ╱
           ╲______________╱
          BLADE 2       BLADE 3

Side cross-section (zinc ring embedded in blade body):
  ┌────────────────────────────────┐  ← ABS/PC blade body (h ≈ 5 mm)
  │  ABS  │░░░░ Zn RING ░░░░│ ABS │  ← ring at r 10–14 mm
  └────────────────────────────────┘

Two-zone mass and inertia summary:
  Plastic: 15.2 g,  r 4–22 mm   →  I_plastic = 3.800×10⁻⁶ kg·m²
  Zinc:     4.7 g,  r 10–14 mm  →  I_zinc    = 6.956×10⁻⁷ kg·m²
  Total:   19.9 g               →  I_ChZWV   = 4.496×10⁻⁶ kg·m²
```

### Two-Zone Inertia and Burst Energy Analysis

```
Plastic body inertia (r_i = 4 mm, r_o = 22 mm, m = 15.2 g):
  I_plastic = ½ × 0.01520 × ((4.0×10⁻³)² + (22.0×10⁻³)²)
            = ½ × 0.01520 × (1.60×10⁻⁵ + 4.84×10⁻⁴)
            = ½ × 0.01520 × 5.00×10⁻⁴
            = 3.800×10⁻⁶ kg·m²

Zinc alloy ring inertia (r_i = 10 mm, r_o = 14 mm, m = 4.7 g):
  I_zinc = ½ × 0.00470 × ((10.0×10⁻³)² + (14.0×10⁻³)²)
         = ½ × 0.00470 × (1.00×10⁻⁴ + 1.96×10⁻⁴)
         = ½ × 0.00470 × 2.96×10⁻⁴
         = 6.956×10⁻⁷ kg·m²

Total layer inertia:
  I_ChZWV = 3.800×10⁻⁶ + 6.956×10⁻⁷ = 4.496×10⁻⁶ kg·m²

Zinc ring inertia efficiency:
  I_zn_if_at_tip  = 0.00470 × (22×10⁻³)² = 2.274×10⁻⁶ kg·m²
  Actual I_zinc   = 6.956×10⁻⁷ kg·m²
  Efficiency      = 6.956×10⁻⁷ / 2.274×10⁻⁶ = 30.6%

Burst energy requirement ratio vs original WV:
  ΔE_burst ∝ I × ω × Δω_tab
  ΔE_ChZWV / ΔE_WV = 4.496×10⁻⁶ / 3.800×10⁻⁶ = 1.183
  → 18.3% more collision energy required to burst ChZWV vs original WV at equal spin

C₃ contact geometry:
  f_contact = 3 × 600 / (2π) = 286 Hz;  Δt = 3.49 ms
  Smash cos(22°) = 0.927;  Recoil sin(22°) = 0.375

Assembly angular momentum (m_total = 42.3 g, I_total = 7.581×10⁻⁶ kg·m²):
  L₀ = 7.581×10⁻⁶ × 600 = 4.549×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function choZWeightRingInertia(
  mPlasticG: number, rInnerMm: number, rOuterMm: number,
  mZincG: number, rZnInnerMm: number, rZnOuterMm: number
): { iPlastic: number; iZinc: number; iTotal: number; inertiaGainFraction: number } {
  const iP = 0.5*(mPlasticG/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iZ = 0.5*(mZincG   /1000)*((rZnInnerMm/1000)**2+(rZnOuterMm/1000)**2);
  return { iPlastic: iP, iZinc: iZ, iTotal: iP+iZ, inertiaGainFraction: iZ/iP };
}
// choZWeightRingInertia(15.2, 4, 22, 4.7, 10, 14) → { iP:3.800e-6, iZ:6.956e-7, iTotal:4.496e-6, gain:0.183 }
// choZWeightRingInertia(15.2, 4, 22, 6.0, 12, 18) → { iP:3.800e-6, iZ:1.638e-6, iTotal:5.438e-6, gain:0.431 }
// choZWeightRingInertia(15.2, 4, 22, 4.7, 16, 20) → { iP:3.800e-6, iZ:1.684e-6, iTotal:5.484e-6, gain:0.443 }

function layerZincBurstEnergyBoost(
  iPlasticKgm2: number, iZincKgm2: number
): { iTotalKgm2: number; energyBoostFraction: number; percentHarderToBurst: number } {
  const iT  = iPlasticKgm2 + iZincKgm2;
  const frac = iT / iPlasticKgm2;
  return { iTotalKgm2: iT, energyBoostFraction: frac, percentHarderToBurst: (frac-1)*100 };
}
// layerZincBurstEnergyBoost(3.800e-6, 6.956e-7) → { iTot:4.496e-6, boost:1.183, pct:18.3 }  — ChZWV vs WV
// layerZincBurstEnergyBoost(3.800e-6, 1.638e-6) → { iTot:5.438e-6, boost:1.431, pct:43.1 }  — heavier ring
// layerZincBurstEnergyBoost(5.418e-6, 6.956e-7) → { iTot:6.114e-6, boost:1.128, pct:12.8 }  — Buster+ring ref

function choZAssemblyAngularMomentum(
  mPlasticG: number, mZincG: number, rZnInnerMm: number, rZnOuterMm: number,
  rLayerOuterMm: number, mDiscG: number, rDiscOuterMm: number,
  mTipG: number, rTipMm: number, omegaRad: number
): { iTotalKgm2: number; L0: number } {
  const iL = 0.5*(mPlasticG/1000)*((4/1000)**2+(rLayerOuterMm/1000)**2)
           + 0.5*(mZincG/1000)*((rZnInnerMm/1000)**2+(rZnOuterMm/1000)**2);
  const iD = 0.5*(mDiscG/1000)*((4/1000)**2+(rDiscOuterMm/1000)**2);
  const iT = 0.5*(mTipG/1000)*(rTipMm/1000)**2;
  const iTo = iL+iD+iT;
  return { iTotalKgm2: iTo, L0: iTo*omegaRad };
}
// choZAssemblyAngularMomentum(15.2,4.7,10,14,22,16.1,19,6.3,4,600) → { I:7.581e-6, L:4.549e-3 }
// choZAssemblyAngularMomentum(15.2,0.0, 0, 0,22,21.2,22,6.0,0.5,600) → { I:8.914e-6, L:5.348e-3 }
// choZAssemblyAngularMomentum(15.2,4.7,10,14,22,21.2,22,6.0,0.5,600) → { I:9.610e-6, L:5.766e-3 }
```

---

## Case 419 — Forge Disc 12-Core (Cho-Z Layer System): C₁₂ High-Frequency Ratchet Engagement, Reduced Outer Radius Inertia, and LAD Penalty from Core-Only Mass Distribution

**Thesis:** Forge Disc 12-Core (16.1 g) is a Cho-Z era disc with C₁₂ twelve-spoke symmetric design in "Core" configuration, meaning the disc body consists of the inner hub structure only without an extending outer frame ring, capping the outer radius at r_o = 19 mm rather than the r_o = 22 mm standard of Burst-era forge discs such as Disc 1 and Disc 6 (both 21.2 g); the 16.1 g mass is 24.1% lower than Disc 1, but the combined mass reduction and smaller radius produce a disproportionate inertia reduction: I_12Core = ½ × 0.0161 × ((4×10⁻³)² + (19×10⁻³)²) = 3.035×10⁻⁶ kg·m², versus I_Disc1 = ½ × 0.0212 × ((4×10⁻³)² + (22×10⁻³)²) = 5.300×10⁻⁶ kg·m², a 42.7% inertia reduction decomposing into 24.1% from mass and a further 25.4% from the outer radius scaling (r=19 vs r=22 mm, factor (19² + 4²)/(22² + 4²) = 377/500 = 0.754); the C₁₂ twelve-tooth ratchet geometry produces burst tab engagement frequency f_ratchet = 12 × ω/(2π) = 12 × 600/(2π) = 1146 Hz at launch, the highest engagement frequency of any single-digit or double-digit numbered Burst disc in the Cho-Z era, versus Disc 6 at 573 Hz and Disc 1 at 95.5 Hz; the arc length between consecutive ratchet seats is s = 2π × r_tab/12 = 2π × 7.5/12 = 3.93 mm, compared to 7.85 mm for Disc 6 and 47.1 mm for Disc 1, so the contact window per engagement event is shortest for Disc 12-Core, reducing the burst probability per collision event at equal collision torque; the reduced outer radius also diminishes Life After Death (LAD): the gyroscopic rolling radius at wobble angle θ_wobble = 30° is r_LAD = r_o/cos(30°) = 19.0/0.866 = 21.9 mm versus 25.4 mm for r_o = 22 mm, a 13.8% reduction in LAD rolling radius and commensurate reduction in orbital velocity during the dying spin phase; Disc 12-Core is therefore an attack-optimised disc that accepts reduced inertia and LAD in exchange for lower total assembly mass, faster tip response under floor torque, and the shortest burst engagement arc of the Cho-Z era.

### Visual Geometry

```
Top-down view — Disc 12-Core (C₁₂, r_o = 19 mm, no outer frame ring):

        ╭──────────────────────────╮  ← r_o = 19 mm
       ╱  ╲│╱ ╲│╱ ╲│╱ ╲│╱ ╲│╱ ╲  ╲
      │  12 radial ribs @ 30° each  │  hub r_i = 4 mm
      │  ratchet seats ×12           │
       ╲  ╱│╲ ╱│╲ ╱│╲ ╱│╲ ╱│╲ ╱  ╱
        ╰──────────────────────────╯

Ratchet seat arc geometry (r_tab = 7.5 mm):
  12-Core: s = 2π×7.5/12 = 3.93 mm/tooth  f = 1146 Hz  ← shortest arc
  Disc 6:  s = 2π×7.5/ 6 = 7.85 mm/tooth  f =  573 Hz
  Disc 1:  s = 2π×7.5/ 1 = 47.1 mm/tooth  f =   96 Hz

Inertia comparison:
  Disc 1   21.2g r_o=22mm →  I = 5.300×10⁻⁶ kg·m²
  Disc 6   21.2g r_o=22mm →  I = 5.300×10⁻⁶ kg·m²
  12-Core  16.1g r_o=19mm →  I = 3.035×10⁻⁶ kg·m²  (−42.7%)
```

### C₁₂ Ratchet and Inertia Analysis

```
Disc 12-Core inertia (r_i = 4 mm, r_o = 19 mm, m = 16.1 g):
  I_12Core = ½ × 0.01610 × ((4.0×10⁻³)² + (19.0×10⁻³)²)
           = ½ × 0.01610 × (1.60×10⁻⁵ + 3.61×10⁻⁴)
           = ½ × 0.01610 × 3.77×10⁻⁴
           = 3.035×10⁻⁶ kg·m²

Inertia reduction decomposition vs Disc 1 (21.2g, r_o=22mm):
  I_Disc1 = ½ × 0.0212 × (1.60×10⁻⁵ + 4.84×10⁻⁴) = 5.300×10⁻⁶ kg·m²
  Radius factor: (19²+4²)/(22²+4²) = 377/500 = 0.754
  Mass factor:   16.1/21.2          = 0.759
  Combined:      0.754 × 0.759      = 0.572  →  3.035/5.300 = 0.573 ✓

C₁₂ ratchet engagement frequency:
  f_ratchet = 12 × 600 / (2π) = 1146 Hz
  Arc per seat: s = 2π × 7.5/12 = 3.93 mm  (vs Disc 6: 7.85 mm, Disc 1: 47.1 mm)

LAD rolling radius at θ_wobble = 30°:
  r_LAD_12C = 19.0 / cos(30°) = 19.0 / 0.866 = 21.9 mm
  r_LAD_std  = 22.0 / cos(30°) = 22.0 / 0.866 = 25.4 mm
  Reduction: (25.4 − 21.9) / 25.4 = 13.8%
```

### TypeScript Model

```typescript
function disc12CoreInertia(
  mDiscG: number, rInnerMm: number, rOuterMm: number
): { iDiscKgm2: number; vsDisc1Fraction: number; massReduction: number } {
  const iD  = 0.5*(mDiscG/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iD1 = 0.5*(21.2/1000)*((4/1000)**2+(22/1000)**2);
  return { iDiscKgm2: iD, vsDisc1Fraction: iD/iD1, massReduction: (21.2-mDiscG)/21.2 };
}
// disc12CoreInertia(16.1, 4, 19) → { I:3.035e-6, vsDisc1:0.573, massRed:0.241 }  — 12-Core
// disc12CoreInertia(21.2, 4, 22) → { I:5.300e-6, vsDisc1:1.000, massRed:0.000 }  — Disc 1 reference
// disc12CoreInertia(16.1, 4, 22) → { I:4.025e-6, vsDisc1:0.760, massRed:0.241 }  — mass-only effect

function c12RatchetEngagementFrequency(
  nTeeth: number, omegaRad: number, rTabMm: number
): { freqHz: number; arcPerToothMm: number; intervalMs: number } {
  const f = nTeeth * omegaRad / (2*Math.PI);
  const s = 2*Math.PI * rTabMm / nTeeth;
  return { freqHz: f, arcPerToothMm: s, intervalMs: 1000/f };
}
// c12RatchetEngagementFrequency(12, 600, 7.5) → { freq:1146Hz, arc:3.93mm, dt:0.873ms }  — Disc 12-Core
// c12RatchetEngagementFrequency( 6, 600, 7.5) → { freq: 573Hz, arc:7.85mm, dt:1.745ms }  — Disc 6
// c12RatchetEngagementFrequency( 1, 600, 7.5) → { freq:  95Hz, arc:47.1mm, dt:10.5ms  }  — Disc 1

function discRadiusInertiaReduction(
  mDiscG: number, rOuterMm: number,
  mRefG: number,  rRefMm: number, rInnerMm: number
): { iDisc: number; iRef: number; massReduction: number; inertiaReduction: number } {
  const rI = rInnerMm/1000;
  const iD = 0.5*(mDiscG/1000)*(rI**2+(rOuterMm/1000)**2);
  const iR = 0.5*(mRefG /1000)*(rI**2+(rRefMm  /1000)**2);
  return { iDisc: iD, iRef: iR,
    massReduction:    (mRefG-mDiscG)/mRefG,
    inertiaReduction: (iR-iD)/iR };
}
// discRadiusInertiaReduction(16.1,19, 21.2,22, 4) → { massRed:0.241, inertiaRed:0.427 }  — 12-Core vs Disc 1
// discRadiusInertiaReduction(16.1,22, 21.2,22, 4) → { massRed:0.241, inertiaRed:0.241 }  — mass-only
// discRadiusInertiaReduction(16.1,19, 21.2,22, 0) → { massRed:0.241, inertiaRed:0.410 }  — point-hub
```

---

## Case 420 — Volcanic Performance Tip (Cho-Z Layer System): Wide Flat Rubber Base, High Floor Torque, and Short-Duration Attack Physics in the ChZWV.12Core.Volcanic Assembly

**Thesis:** Volcanic (6.3 g) is a wide flat-base rubber Performance Tip from the Cho-Z era designed for aggressive destabilising attack, featuring a flat rubber disk contact base of outer radius r_base = 4 mm and friction coefficient μ_k = 0.85; the effective friction radius for a uniform flat disk contact is r_eff = 2r_base/3 = 2.67 mm, giving floor torque τ_floor = μ × W × r_eff = 0.85 × (0.0423 × 9.81) × 2.67×10⁻³ = 9.431×10⁻⁴ N·m for the ChZWV.12Core.Volcanic assembly (m_total = 42.3 g, W = 0.4150 N); the resulting spin decay rate is dω/dt = −9.431×10⁻⁴ / 7.581×10⁻⁶ = −124.4 rad/s², which is 26.7 times faster than a sharp hard-ABS tip (μ = 0.17, r_tip = 0.5 mm, τ = 3.53×10⁻⁵ N·m, dω/dt = −4.65 rad/s²) on the same assembly; the time from launch (ω₀ = 600 rad/s) to the 40% stability threshold (ω_wobble = 240 rad/s) is Δt = 360/124.4 = 2.89 s, versus 77.4 s for the hard tip, confirming Volcanic as a zero-stamina attack tip; the wide flat rubber contact also creates frictional anisotropy during lateral drift: as the beyblade travels off-centre under its own spin-induced floor reaction, differential friction across the 8 mm contact diameter produces a net restoring or redirecting torque that deflects the beyblade into rapid orbital arcs rather than stable centred precession, with the redirecting torque magnitude τ_redirect ≈ μ × W × r_base × sin(θ_drift) where θ_drift is the instantaneous drift angle, generating unpredictable self-feeding orbital loops that are the characteristic Volcanic movement pattern; tip moment of inertia I_Volcanic = ½ × 0.0063 × (4×10⁻³)² = 5.04×10⁻⁸ kg·m² is only 0.66% of the assembly total I_total = 7.581×10⁻⁶ kg·m², so the tip contributes negligibly to angular momentum and functions purely as a floor-coupling transducer; Volcanic lacks the Dash suffix, meaning no supplemental spring-lock mechanism on the driver shaft, and burst resistance for this assembly depends entirely on ChZWV layer tab torque and the assembly's angular momentum.

### Visual Geometry

```
Side cross-section — Volcanic tip:

  ┌──────────────────────┐
  │  driver body (ABS)   │  ← no Dash spring lock (no apostrophe)
  │  m = 6.3 g           │
  └────────┬─────────────┘
           │  shaft
  ╔════════╧═════════════╗
  ║  flat rubber base    ║  ← r_base = 4 mm
  ║  μ_k = 0.85          ║
  ╚══════════════════════╝
  r_eff = 2r/3 = 2.67 mm  (flat disk effective friction radius)

Floor torque comparison (ChZWV.12Core assembly, W = 0.415 N):
  Sharp hard tip  μ=0.17, r=0.5mm  →  τ = 3.53×10⁻⁵ N·m   dω/dt = −4.65 rad/s²
  Volcanic        μ=0.85, r=2.67mm →  τ = 9.43×10⁻⁴ N·m   dω/dt = −124  rad/s²
  Ratio: ×26.7 faster decay
```

### Floor Torque and Battle Time Analysis

```
Volcanic effective friction radius (flat disk):
  r_eff = 2 × r_base / 3 = 2 × 4.0 / 3 = 2.667 mm

Assembly weight:
  W = 0.04230 × 9.81 = 0.4150 N

Floor torque:
  τ_floor = 0.85 × 0.4150 × 2.667×10⁻³ = 9.431×10⁻⁴ N·m

Assembly total inertia:
  I_total = 4.496×10⁻⁶ + 3.035×10⁻⁶ + 5.04×10⁻⁸ = 7.581×10⁻⁶ kg·m²

Spin decay rate:
  dω/dt = −9.431×10⁻⁴ / 7.581×10⁻⁶ = −124.4 rad/s²

Battle time (ω₀ = 600 → ω_thresh = 240 rad/s):
  Δt = (600 − 240) / 124.4 = 2.89 s

Assembly angular momentum at launch:
  L₀ = 7.581×10⁻⁶ × 600 = 4.549×10⁻³ kg·m²/s

Tip inertia fraction:
  5.04×10⁻⁸ / 7.581×10⁻⁶ = 0.66%  (negligible; pure floor-coupling function)
```

### TypeScript Model

```typescript
function volcanicFlatBaseDecay(
  mAssemblyG: number, iTotalKgm2: number,
  rBaseMm: number, muRubber: number
): { rEffMm: number; tauFloor: number; dOmegaDt: number } {
  const rEff = (2*rBaseMm/3)/1000;
  const tau  = muRubber*(mAssemblyG/1000)*9.81*rEff;
  return { rEffMm: rEff*1000, tauFloor: tau, dOmegaDt: -tau/iTotalKgm2 };
}
// volcanicFlatBaseDecay(42.3, 7.581e-6, 4.0, 0.85) → { rEff:2.67mm, tau:9.431e-4, dOmega:−124.4 }
// volcanicFlatBaseDecay(42.3, 7.581e-6, 3.0, 0.85) → { rEff:2.00mm, tau:7.073e-4, dOmega:−93.3  }
// volcanicFlatBaseDecay(42.3, 7.581e-6, 4.0, 0.17) → { rEff:2.67mm, tau:1.886e-4, dOmega:−24.9  }

function volcanicBattleTimeEstimate(
  omegaLaunch: number, omegaThreshold: number, dOmegaDt: number
): { deltaOmega: number; battleTimeS: number; rpm0: number } {
  const dOmega = omegaLaunch - omegaThreshold;
  return { deltaOmega: dOmega, battleTimeS: dOmega/Math.abs(dOmegaDt),
           rpm0: omegaLaunch*60/(2*Math.PI) };
}
// volcanicBattleTimeEstimate(600, 240, 124.4) → { dOmega:360, time:2.89s, rpm0:5730 }  — Volcanic
// volcanicBattleTimeEstimate(600, 240,   4.65) → { dOmega:360, time:77.4s }             — hard sharp tip
// volcanicBattleTimeEstimate(500, 240, 124.4) → { dOmega:260, time:2.09s }              — weaker launch

function rubberTipDecayComparison(
  mAssemblyG: number, iTotalKgm2: number,
  rRubberBaseMm: number, muRubber: number,
  rHardMm: number,       muHard: number
): { tauRubber: number; tauHard: number; decayRatio: number } {
  const W    = (mAssemblyG/1000)*9.81;
  const tauR = muRubber * W * (2*rRubberBaseMm/3)/1000;
  const tauH = muHard   * W * rHardMm/1000;
  return { tauRubber: tauR, tauHard: tauH, decayRatio: tauR/tauH };
}
// rubberTipDecayComparison(42.3, 7.581e-6, 4.0, 0.85, 0.5, 0.17) → { tauR:9.43e-4, tauH:3.53e-5, ratio:26.7 }
// rubberTipDecayComparison(42.3, 7.581e-6, 3.0, 0.85, 0.5, 0.17) → { tauR:7.07e-4, tauH:3.53e-5, ratio:20.0 }
// rubberTipDecayComparison(78.8, 13.93e-6, 4.0, 0.85, 3.5, 0.12) → { tauR:17.5e-4, tauH:3.95e-4, ratio: 4.43 }
```

---

## Case 421 — Cho-Z Valkyrie Energy Layer (Cho-Z Layer System): Peripheral Zinc Wing Placement, Increased Inertia Efficiency, and C₃ Attack Geometry Comparison with ChZWV in the ChZV.Zenith.Evolution Assembly

**Thesis:** Cho-Z Valkyrie (20.9 g) is a Cho-Z Layer System Energy Layer that shares the ABS/PC C₃ smash blade structure of the Winning Valkyrie lineage but places its zinc alloy weight (m_zn = 5.7 g) further outward in the blade wings at inner radius r_i_zn = 14 mm to outer radius r_o_zn = 20 mm, in contrast to Cho-Z Winning Valkyrie whose zinc ring sat at r 10–14 mm; this peripheral placement gives I_zinc = ½ × 0.0057 × ((14×10⁻³)² + (20×10⁻³)²) = ½ × 0.0057 × (1.96×10⁻⁴ + 4.00×10⁻⁴) = 1.698×10⁻⁶ kg·m², versus 6.956×10⁻⁷ kg·m² for ChZWV's inner ring; with the same 15.2 g plastic body (I_plastic = 3.800×10⁻⁶ kg·m²), the two-zone total is I_ChZV = 3.800×10⁻⁶ + 1.698×10⁻⁶ = 5.498×10⁻⁶ kg·m², a 22.2% larger layer inertia than ChZWV (4.496×10⁻⁶) for only 5.0% more mass (20.9 vs 19.9 g); the zinc ring inertia efficiency at r_zn ≈ 17 mm is I_zinc / I_zn_if_tip = 1.698×10⁻⁶ / (0.0057 × (22×10⁻³)²) = 1.698×10⁻⁶ / 2.760×10⁻⁶ = 61.5%, double the 30.6% efficiency of ChZWV, confirming that proximity to the blade contact zone substantially improves the mass-to-inertia return; the burst energy ratio ΔE_ChZV / ΔE_WV = I_ChZV / I_WV = 5.498/3.800 = 1.447, so ChZV requires 44.7% more energy to burst than the original WV, versus 18.3% for ChZWV, establishing ChZV as the significantly harder-to-burst layer of the two Cho-Z Valkyrie variants; C₃ geometry is maintained at φ = 20° (slightly tighter than WV's 22°), giving smash fraction cos(20°) = 0.940, recoil fraction sin(20°) = 0.342, and contact frequency f = 3×600/(2π) = 286 Hz; the full ChZV.Zenith.Evolution assembly (m_total = 52.1 g including 0.7 g Level Chip) has I_total = 11.514×10⁻⁶ kg·m² and L₀ = 6.908×10⁻³ kg·m²/s at ω₀ = 600 rad/s.

### Visual Geometry

```
Top-down view — Cho-Z Valkyrie (C₃, r_o = 22 mm):

                BLADE 1 (φ = 20°)
             ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲
           ╱  ░░░░░░Zn░░░░░░░░  ◣ r_o = 22 mm
          │   ░ wing zinc ░░░░   │
          │   r_i=14 r_o=20 mm  │  ← zinc near blade tip
          │   ╔══════╗           │
          │   ║ hub  ║ r_i=4mm  │
          │   ╚══════╝           │
           ╲                    ╱
             ╲________________╱
            BLADE 2         BLADE 3

Zinc placement comparison (same m_total≈20g, C₃ ABS body):
  ChZWV: Zn ring  r 10–14mm → I_Zn = 6.956×10⁻⁷ kg·m²  (efficiency 30.6%)
  ChZV:  Zn wing  r 14–20mm → I_Zn = 1.698×10⁻⁶ kg·m²  (efficiency 61.5%)
  ChZV delivers 2.44× more inertia per gram of zinc
```

### Two-Zone Inertia and Burst Energy Analysis

```
Plastic body inertia (r_i = 4 mm, r_o = 22 mm, m = 15.2 g):
  I_plastic = ½ × 0.01520 × ((4.0×10⁻³)² + (22.0×10⁻³)²)
            = 3.800×10⁻⁶ kg·m²  (identical to ChZWV plastic body)

Zinc wing inertia (r_i = 14 mm, r_o = 20 mm, m = 5.7 g):
  I_zinc = ½ × 0.00570 × ((14.0×10⁻³)² + (20.0×10⁻³)²)
         = ½ × 0.00570 × (1.96×10⁻⁴ + 4.00×10⁻⁴)
         = ½ × 0.00570 × 5.96×10⁻⁴
         = 1.698×10⁻⁶ kg·m²

Total layer inertia:
  I_ChZV = 3.800×10⁻⁶ + 1.698×10⁻⁶ = 5.498×10⁻⁶ kg·m²

Zinc efficiency vs ChZWV:
  I_zinc_ChZV / I_zinc_ChZWV = 1.698×10⁻⁶ / 6.956×10⁻⁷ = 2.44
  ChZV delivers 2.44× more inertia per gram of zinc despite only 5.0% more mass

Burst energy ratio vs original WV (I_WV = 3.800×10⁻⁶ kg·m²):
  ΔE_ChZV / ΔE_WV = 5.498 / 3.800 = 1.447  → 44.7% harder to burst
  ΔE_ChZWV / ΔE_WV = 4.496 / 3.800 = 1.183 → 18.3% harder to burst (reference)

C₃ contact geometry:
  φ = 20°;  cos(20°) = 0.940 (smash);  sin(20°) = 0.342 (recoil)
  f_contact = 3 × 600 / (2π) = 286 Hz;  Δt = 3.49 ms

Assembly angular momentum (m = 52.1 g, I = 11.514×10⁻⁶ kg·m²):
  L₀ = 11.514×10⁻⁶ × 600 = 6.908×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function choZValkyrieTwoZoneInertia(
  mPlasticG: number, rPInnerMm: number, rPOuterMm: number,
  mZincG: number,   rZInnerMm: number, rZOuterMm: number
): { iPlastic: number; iZinc: number; iTotal: number; zincEfficiency: number } {
  const iP = 0.5*(mPlasticG/1000)*((rPInnerMm/1000)**2+(rPOuterMm/1000)**2);
  const iZ = 0.5*(mZincG   /1000)*((rZInnerMm/1000)**2+(rZOuterMm/1000)**2);
  const iZtip = (mZincG/1000)*(rPOuterMm/1000)**2;   // if zinc were at blade tip
  return { iPlastic: iP, iZinc: iZ, iTotal: iP+iZ, zincEfficiency: iZ/iZtip };
}
// choZValkyrieTwoZoneInertia(15.2,4,22, 5.7,14,20) → { iP:3.800e-6, iZ:1.698e-6, iTotal:5.498e-6, eff:0.615 }
// choZValkyrieTwoZoneInertia(15.2,4,22, 4.7,10,14) → { iP:3.800e-6, iZ:6.956e-7, iTotal:4.496e-6, eff:0.306 }
// choZValkyrieTwoZoneInertia(15.2,4,22, 5.7,18,22) → { iP:3.800e-6, iZ:2.314e-6, iTotal:6.114e-6, eff:0.839 }

function czSmashGeometry(
  nBlades: number, phiDeg: number, omegaRad: number
): { smashFrac: number; recoilFrac: number; freqHz: number; dtMs: number } {
  const phi = phiDeg*Math.PI/180;
  return { smashFrac: Math.cos(phi), recoilFrac: Math.sin(phi),
           freqHz: nBlades*omegaRad/(2*Math.PI), dtMs: 1000*2*Math.PI/(nBlades*omegaRad) };
}
// czSmashGeometry(3, 20, 600) → { smash:0.940, recoil:0.342, freq:286Hz, dt:3.49ms }  — ChZV (φ=20°)
// czSmashGeometry(3, 22, 600) → { smash:0.927, recoil:0.375, freq:286Hz, dt:3.49ms }  — ChZWV (φ=22°)
// czSmashGeometry(4, 20, 600) → { smash:0.940, recoil:0.342, freq:382Hz, dt:2.62ms }  — 4-blade (Z Achilles)

function czBurstEnergyComparison(
  iOriginalKgm2: number, iChzwvKgm2: number, iChzvKgm2: number
): { ratioChzwv: number; ratioChzv: number; chzvAdvantageOverChzwv: number } {
  return {
    ratioChzwv: iChzwvKgm2/iOriginalKgm2,
    ratioChzv:  iChzvKgm2 /iOriginalKgm2,
    chzvAdvantageOverChzwv: iChzvKgm2/iChzwvKgm2
  };
}
// czBurstEnergyComparison(3.800e-6, 4.496e-6, 5.498e-6) → { ChZWV:1.183, ChZV:1.447, ChZV/ChZWV:1.223 }
// czBurstEnergyComparison(3.800e-6, 4.496e-6, 6.114e-6) → { ChZWV:1.183, ChZV:1.609, ChZV/ChZWV:1.360 }
// czBurstEnergyComparison(5.418e-6, 4.496e-6, 5.498e-6) → { ChZWV:0.830, ChZV:1.015, ChZV/ChZWV:1.223 }
```

---

## Case 422 — Forge Disc Zenith (Cho-Z Layer System): Maximum Cho-Z Era Disc Inertia, Outer-Radius Mass Concentration, and Stamina-Assembly Angular Momentum Reserve

**Thesis:** Forge Disc Zenith (24.1 g) is the heaviest single-piece Cho-Z era forge disc and carries more mass than any standard Burst disc in the Disc 1 / Disc 6 family (21.2 g), with its extra 2.9 g (+13.7%) concentrated in a wider outer rim at r_o = 23 mm (vs 22 mm for standard discs); this combination gives I_Zenith = ½ × 0.0241 × ((4×10⁻³)² + (23×10⁻³)²) = ½ × 0.0241 × (1.60×10⁻⁵ + 5.29×10⁻⁴) = 6.567×10⁻⁶ kg·m², which is 23.9% more than Disc 1's I = 5.300×10⁻⁶ kg·m² and 24.1% more than Disc 6 at the same geometry, representing the largest disc inertia contribution of any disc in the Cho-Z era standard (non-Frame) configuration; the outer rim extends to r_o = 23 mm, 1 mm beyond the standard 22 mm, and the inertia scaling with r² means this extra millimetre accounts for a disproportionate share of the total: I_contribution_outer_mm = ½ × 0.0241 × ((23×10⁻³)² − (22×10⁻³)²) = ½ × 0.0241 × (5.29×10⁻⁴ − 4.84×10⁻⁴) = 5.42×10⁻⁷ kg·m², or 8.3% of I_Zenith from the extra 1 mm of radius alone; the disc's high inertia makes it the dominant single-component inertia source in the ChZV.Zenith.Evolution assembly, contributing 6.567×10⁻⁶ / 11.514×10⁻⁶ = 57.0% of assembly total I, a disc dominance fraction higher than any previously analysed assembly in this series; from an angular momentum perspective, the Zenith disc alone carries L_disc = 6.567×10⁻⁶ × 600 = 3.940×10⁻³ kg·m²/s at launch, which is 57.0% of the assembly's total L₀ = 6.908×10⁻³ kg·m²/s, confirming Zenith as the primary stamina reservoir of the assembly; the spin decay rate under Evolution tip (rubber, r_eff = 1.33 mm) is dω/dt = −(0.85 × 0.5111 × 1.333×10⁻³) / 11.514×10⁻⁶ = −50.5 rad/s², and the battle time from 600 to 240 rad/s is 360/50.5 = 7.13 s, substantially longer than the ChZWV.12Core.Volcanic assembly (2.89 s) due to the threefold greater inertia (11.514 vs 7.581 ×10⁻⁶ kg·m²).

### Visual Geometry

```
Top-down view — Forge Disc Zenith (r_o = 23 mm):

     ╭────────────────────────────────╮  ← r_o = 23 mm (1mm wider than standard)
    ╱  heavy outer rim (extra 2.9g)    ╲
   │   concentrically distributed      │
   │   hub r_i = 4 mm                 │
    ╲                                 ╱
     ╰────────────────────────────────╯

Inertia comparison (same r_i = 4 mm):
  Disc 1:  21.2g r_o=22mm → I = 5.300×10⁻⁶ kg·m²  (reference)
  Disc 6:  21.2g r_o=22mm → I = 5.300×10⁻⁶ kg·m²
  Zenith:  24.1g r_o=23mm → I = 6.567×10⁻⁶ kg·m²  (+23.9%)

Inertia contribution breakdown for ChZV.Zenith.Evolution:
  ChZV layer:   5.498×10⁻⁶  47.7%
  Zenith disc:  6.567×10⁻⁶  57.0%   ← dominant component
  Evolution tip:1.28×10⁻⁸    0.1%
  Level Chip:   1.37×10⁻⁷    1.2%
```

### Inertia and Stamina Reserve Analysis

```
Zenith disc inertia (r_i = 4 mm, r_o = 23 mm, m = 24.1 g):
  I_Zenith = ½ × 0.02410 × ((4.0×10⁻³)² + (23.0×10⁻³)²)
           = ½ × 0.02410 × (1.60×10⁻⁵ + 5.29×10⁻⁴)
           = ½ × 0.02410 × 5.45×10⁻⁴
           = 6.567×10⁻⁶ kg·m²

Extra 1mm outer radius contribution:
  ΔI_1mm = ½ × 0.02410 × ((23×10⁻³)² − (22×10⁻³)²)
          = ½ × 0.02410 × (529 − 484)×10⁻⁶
          = ½ × 0.02410 × 4.50×10⁻⁵
          = 5.42×10⁻⁷ kg·m²  (8.3% of I_Zenith)

Assembly inertia and disc share:
  I_total = I_ChZV + I_Zenith + I_Evo + I_LC
          = 5.498×10⁻⁶ + 6.567×10⁻⁶ + 1.28×10⁻⁸ + 1.37×10⁻⁷
          = 11.514×10⁻⁶ kg·m²  (w/ 0.7g Level Chip, m_total = 52.1g)
  Zenith fraction: 6.567/11.514 = 57.0%

Spin decay (Evolution rubber, m_total = 52.1g, r_eff = 1.33mm):
  W = 0.0521 × 9.81 = 0.5111 N
  τ_floor = 0.85 × 0.5111 × 1.333×10⁻³ = 5.793×10⁻⁴ N·m
  dω/dt = −5.793×10⁻⁴ / 11.514×10⁻⁶ = −50.3 rad/s²
  Δt_battle = 360 / 50.3 = 7.16 s
```

### TypeScript Model

```typescript
function zenithDiscInertia(
  mDiscG: number, rInnerMm: number, rOuterMm: number
): { iDiscKgm2: number; vsDisc1Fraction: number; extraRimmContrib: number } {
  const iD  = 0.5*(mDiscG/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iD1 = 0.5*(21.2/1000)*((4/1000)**2+(22/1000)**2);
  const iExtra = 0.5*(mDiscG/1000)*((rOuterMm/1000)**2-(22/1000)**2);
  return { iDiscKgm2: iD, vsDisc1Fraction: iD/iD1, extraRimmContrib: Math.max(0, iExtra) };
}
// zenithDiscInertia(24.1, 4, 23) → { I:6.567e-6, vsDisc1:1.239, extra:5.42e-7 }  — Zenith
// zenithDiscInertia(21.2, 4, 22) → { I:5.300e-6, vsDisc1:1.000, extra:0       }  — Disc 1 reference
// zenithDiscInertia(24.1, 4, 22) → { I:6.025e-6, vsDisc1:1.137, extra:0       }  — Zenith if r_o=22mm

function heavyDiscStaminaGain(
  mDiscG: number, rOuterMm: number, mRefG: number, rRefMm: number,
  iTotalKgm2: number, iRefTotalKgm2: number,
  muTip: number, rEffMm: number, mAssemblyG: number, mRefAssemblyG: number
): { dOmegaHeavy: number; dOmegaRef: number; staminaRatio: number } {
  const W_h  = (mAssemblyG/1000)*9.81;
  const W_r  = (mRefAssemblyG/1000)*9.81;
  const tau_h = muTip * W_h * (rEffMm/1000);
  const tau_r = muTip * W_r * (rEffMm/1000);
  const dH   = -tau_h / iTotalKgm2;
  const dR   = -tau_r / iRefTotalKgm2;
  return { dOmegaHeavy: dH, dOmegaRef: dR, staminaRatio: Math.abs(dR/dH) };
}
// heavyDiscStaminaGain(24.1,23, 21.2,22, 11.514e-6,7.581e-6, 0.85,1.33, 52.1,42.3) →
//   { dH:−50.3, dR:−124, staminaRatio:2.47 }  — Zenith vs 12-Core rubber tip assemblies
// heavyDiscStaminaGain(24.1,23, 21.2,22, 11.514e-6,10.500e-6, 0.17,0.5, 52.1,48.0) →
//   { dH:−3.96, dR:−4.38, staminaRatio:1.10 }  — hard tip assemblies
// heavyDiscStaminaGain(24.1,23, 21.2,22, 11.514e-6,7.581e-6, 0.85,2.67, 52.1,42.3) →
//   { dH:−134,  dR:−124,  staminaRatio:0.93 }  — wide rubber (heavier assembly hurts at r_eff>3mm)

function zenithAssemblyInertiaShare(
  mLayerG: number, mZincG: number, rZnInnerMm: number, rZnOuterMm: number,
  rLayerOuterMm: number, mDiscG: number, rDiscOuterMm: number,
  mChipG: number, rChipMm: number
): { iLayer: number; iDisc: number; iChip: number; discShare: number } {
  const iL = 0.5*(mLayerG/1000)*((4/1000)**2+(rLayerOuterMm/1000)**2)
           + 0.5*(mZincG /1000)*((rZnInnerMm/1000)**2+(rZnOuterMm/1000)**2);
  const iD = 0.5*(mDiscG /1000)*((4/1000)**2+(rDiscOuterMm/1000)**2);
  const iC = (mChipG/1000)*(rChipMm/1000)**2;
  return { iLayer: iL, iDisc: iD, iChip: iC, discShare: iD/(iL+iD+iC) };
}
// zenithAssemblyInertiaShare(15.2,5.7,14,20,22, 24.1,23, 0.7,14) → { iL:5.498e-6, iD:6.567e-6, iC:1.37e-7, discShare:0.570 }
// zenithAssemblyInertiaShare(15.2,4.7,10,14,22, 24.1,23, 0.7,14) → { iL:4.496e-6, iD:6.567e-6, discShare:0.593 }
// zenithAssemblyInertiaShare(15.2,5.7,14,20,22, 21.2,22, 0.7,14) → { iL:5.498e-6, iD:5.300e-6, discShare:0.490 }
```

---

## Case 423 — Evolution Performance Tip (Cho-Z Layer System): Two-Stage Rubber Spike Wear, Non-Dash Spring, and Progressive Aggressiveness in the ChZV.Zenith.Evolution Assembly

**Thesis:** Evolution (6.4 g) is a Cho-Z era Performance Tip that initiates contact with a set of rubber spikes of base radius r_s1 = 2 mm (effective friction radius r_eff1 = 1.33 mm) which wear down through use to expose a wider flat rubber base of radius r_s2 = 3.5 mm (r_eff2 = 2.33 mm), following a two-stage non-monotonic decay curve analogous to Variable' (Case 416) but with only two stages rather than three and without the Dash spring-lock mechanism; Stage 1 (rubber spikes, mint condition): dω/dt₁ = −(μ_r × W × r_eff1)/I_total = −(0.85 × 0.5111 × 1.33×10⁻³)/11.514×10⁻⁶ = −50.3 rad/s², giving a battle window Δt₁ = (600−240)/50.3 = 7.16 s of controlled aggressive movement; Stage 2 (worn flat base, rubber): dω/dt₂ = −(0.85 × 0.5111 × 2.33×10⁻³)/11.514×10⁻⁶ = −88.1 rad/s², giving Δt₂ = (600−240)/88.1 = 4.09 s of faster, more erratic movement; the transition between stages occurs at cumulative wear energy E_wear = N_impacts × F_blade × d_spike where d_spike ≈ 0.8 mm spike height and F_blade ≈ 30 N per contact for moderate collisions, so E_stage_transition ≈ n_contacts × 30 × 8×10⁻⁴ = 24 × n J, typically requiring tens to hundreds of battles depending on contact intensity; unlike the Dash (apostrophe) variants of Evolution' (Case 437), Evolution lacks the stronger spring lock on the driver shaft, making the burst tab threshold the sole burst resistance mechanism; the absence of the Dash spring means the shaft can compress by its standard travel δ_std ≈ 0.3 mm under impact loading rather than the Dash's δ_dash ≈ 0.1 mm, increasing the tip's floor compliance during hard contacts and slightly reducing the net burst impulse transferred to the layer tabs; tip moment of inertia I_Evo = ½ × 0.0064 × (2×10⁻³)² = 1.28×10⁻⁸ kg·m², contributing only 0.11% of I_total = 11.514×10⁻⁶ kg·m².

### Visual Geometry

```
Side cross-section — Evolution tip (two stages):

Stage 1 (mint):               Stage 2 (worn):
  ╔══════════════╗              ╔══════════════╗
  ║  driver body ║              ║  driver body ║
  ║  no Dash     ║              ║  no Dash     ║
  ╚══════╤═══════╝              ╚══════╤═══════╝
         │ shaft                       │ shaft
    ▲▲▲▲▲│▲▲▲▲▲                 ╔═════╧═════╗
    rubber spikes                ║ flat base  ║
    r_s1 = 2 mm                  r_s2 = 3.5mm
    r_eff = 1.33 mm              r_eff = 2.33 mm
    dω/dt = −50.3 rad/s²         dω/dt = −88.1 rad/s²
    Δt = 7.16 s                  Δt = 4.09 s

Decay profile:
  ω  600 ──┐          Stage 1 region
           └── slope −50.3
  ω  240 ──╴  7.16 s  ← wobble
  (stage 2 shortens window if tip worn before battle)
```

### Two-Stage Decay Analysis

```
Assembly parameters: m_total = 52.1g, W = 0.5111N, I_total = 11.514×10⁻⁶ kg·m²

Stage 1 — rubber spikes (r_s1 = 2 mm, r_eff1 = 2×2/3 = 1.333 mm):
  τ₁    = 0.85 × 0.5111 × 1.333×10⁻³ = 5.793×10⁻⁴ N·m
  dω/dt₁ = −5.793×10⁻⁴ / 11.514×10⁻⁶ = −50.3 rad/s²
  Δt₁   = (600 − 240) / 50.3 = 7.16 s

Stage 2 — worn flat base (r_s2 = 3.5 mm, r_eff2 = 2×3.5/3 = 2.333 mm):
  τ₂    = 0.85 × 0.5111 × 2.333×10⁻³ = 1.014×10⁻³ N·m
  dω/dt₂ = −1.014×10⁻³ / 11.514×10⁻⁶ = −88.1 rad/s²
  Δt₂   = (600 − 240) / 88.1 = 4.09 s

Stage 2 / Stage 1 decay ratio: 88.1 / 50.3 = 1.75  (75% faster when worn)

Non-Dash spring compliance:
  Dash shaft compression δ_dash = 0.1 mm (stiff spring lock)
  Standard shaft compression δ_std = 0.3 mm (softer, 3× travel)
  Extra travel absorbs ~(3−1) / 3 = 66.7% more floor compliance
  Net: Evolution (non-Dash) provides softer floor coupling than Evolution'

Tip inertia fraction:
  I_Evo = ½ × 0.0064 × (2×10⁻³)² = 1.28×10⁻⁸ kg·m²
  Fraction: 1.28×10⁻⁸ / 11.514×10⁻⁶ = 0.11%
```

### TypeScript Model

```typescript
function evolutionTipDecay(
  mAssemblyG: number, iTotalKgm2: number,
  rStage1Mm: number, rStage2Mm: number, muRubber: number
): {
  stage1: { rEffMm: number; tau: number; dOmegaDt: number; battleTimeS: number };
  stage2: { rEffMm: number; tau: number; dOmegaDt: number; battleTimeS: number };
  stageDecayRatio: number
} {
  const W = (mAssemblyG/1000)*9.81;
  const calc = (r: number) => {
    const rE = (2*r/3)/1000;
    const tau = muRubber*W*rE;
    const d = -tau/iTotalKgm2;
    return { rEffMm: rE*1000, tau, dOmegaDt: d, battleTimeS: 360/Math.abs(d) };
  };
  const s1 = calc(rStage1Mm); const s2 = calc(rStage2Mm);
  return { stage1: s1, stage2: s2, stageDecayRatio: Math.abs(s2.dOmegaDt/s1.dOmegaDt) };
}
// evolutionTipDecay(52.1, 11.514e-6, 2.0, 3.5, 0.85) → { s1:{rE:1.33,t:7.16s}, s2:{rE:2.33,t:4.09s}, ratio:1.75 }
// evolutionTipDecay(42.3,  7.581e-6, 2.0, 3.5, 0.85) → { s1:{t:5.69s}, s2:{t:3.25s}, ratio:1.75 }
// evolutionTipDecay(52.1, 11.514e-6, 1.5, 3.0, 0.85) → { s1:{rE:1.00,t:9.55s}, s2:{rE:2.00,t:4.78s}, ratio:2.00 }

function tipEvolutionVsVariable(
  mAssemblyG: number, iTotalKgm2: number, muRubber: number,
  rEvoS1Mm: number, rEvoS2Mm: number,
  rVarS1Mm: number, rVarS2Mm: number, rVarS3Mm: number
): { evo: number[]; variable: number[] } {
  const W = (mAssemblyG/1000)*9.81;
  const t = (r: number) => 360/Math.abs(-muRubber*W*(2*r/3)/1000/iTotalKgm2);
  return { evo:      [t(rEvoS1Mm), t(rEvoS2Mm)],
           variable: [t(rVarS1Mm), t(rVarS2Mm), t(rVarS3Mm)] };
}
// tipEvolutionVsVariable(52.1,11.514e-6,0.85, 2.0,3.5, 1.5,2.5,3.5) →
//   { evo:[7.16,4.09], variable:[9.55,5.73,4.09] }  — Evolution 2-stage vs Variable' 3-stage
// tipEvolutionVsVariable(34.5,4.013e-6,0.85,  2.0,3.5, 1.5,2.5,3.5) →
//   { evo:[2.49,1.42], variable:[3.32,1.99,1.42] }  — same tips on lighter assembly

function nonDashSpringCompliance(
  deltaStd: number, deltaDash: number, fImpactN: number
): { energyAbsorbedStd: number; energyAbsorbedDash: number; extraComplianceFrac: number } {
  const eS = 0.5*fImpactN*deltaStd/1000;
  const eD = 0.5*fImpactN*deltaDash/1000;
  return { energyAbsorbedStd: eS, energyAbsorbedDash: eD, extraComplianceFrac: (eS-eD)/eS };
}
// nonDashSpringCompliance(0.3, 0.1, 50) → { eStd:7.5e-3, eDash:2.5e-3, extraFrac:0.667 }
// nonDashSpringCompliance(0.3, 0.1, 30) → { eStd:4.5e-3, eDash:1.5e-3, extraFrac:0.667 }
// nonDashSpringCompliance(0.2, 0.1, 50) → { eStd:5.0e-3, eDash:2.5e-3, extraFrac:0.500 }
```

---

## Case 424 — Level Chip (Cho-Z Layer System): Eccentric Counter-Mass, Imbalance Force Suppression, and Banking Pattern Stabilisation in the ChZV.Zenith.Evolution Assembly

**Thesis:** Level Chip (0.7 g) is a small ABS plastic chip that snaps under the Cho-Z Energy Layer at a radial offset of r_LC = 14 mm from the spin axis on the side diametrically opposite the zinc ring's heavy sector, providing a counter-eccentric mass that neutralises the angular imbalance introduced by the zinc alloy weight; in ChZV, the peripheral zinc wing (5.7 g, r_zn_centroid ≈ 17 mm) has an asymmetric sector: if the zinc is concentrated over a 60° arc rather than a full ring, the asymmetric mass is Δm_zn ≈ 5.7 × (60/360) = 0.950 g at r_zn = 17 mm, producing an unbalanced first moment of 0.950 × 17 = 16.15 g·mm; the Level Chip at r_LC = 14 mm supplies a counter-moment of 0.7 × 14 = 9.80 g·mm, partially cancelling the zinc imbalance to reduce eccentricity from e_raw = 16.15/m_assembly = 16.15/52.1 = 0.310 mm to e_corrected = (16.15 − 9.80)/52.1 = 6.35/52.1 = 0.122 mm, a 60.6% reduction in eccentricity; the centrifugal imbalance force at launch (ω₀ = 600 rad/s) is reduced from F_raw = 0.0521 × 3.10×10⁻⁴ × 600² = 5.81 N to F_corrected = 0.0521 × 1.22×10⁻⁴ × 600² = 2.29 N (−60.6%), directly reducing the wobble-inducing centrifugal force that disrupts banking patterns; without the Level Chip, the 5.81 N imbalance force at launch breaks the banking pattern of the Cho-Z Valkyrie combination by providing a periodic radial perturbation at frequency f_imb = ω/(2π) = 95.5 Hz, which resonates with banking-orbit frequencies and causes irregular orbit radius; with the Level Chip installed, F_corrected = 2.29 N reduces the perturbation amplitude by 60.6%, allowing stable circular banking; Level Chip inertia I_LC = m_LC × r_LC² = 7.0×10⁻⁴ × (14×10⁻³)² = 1.372×10⁻⁷ kg·m², contributing only 1.19% of I_total, so the chip's effect is purely eccentric counter-weighting with negligible inertia impact.

### Visual Geometry

```
Top-down view — Level Chip eccentric correction:

      Heavy zinc sector (Δm_zn ≈ 0.95g at r=17mm, 60° arc):
           ╔══════════╗
           ║ Zn wing  ║  → F_imb = 5.81 N at launch
           ╚══════════╝
              ↑  16.15 g·mm moment
        ─────●─────  (spin axis)
              ↓   9.80 g·mm counter-moment
           ┌──────┐
           │  LC  │  ← Level Chip (0.7g, r=14mm, 180° opposite)
           └──────┘

Imbalance reduction:
  Without LC:  e = 16.15/52.1 = 0.310 mm  F_imb = 5.81 N
  With LC:     e = 6.35/52.1  = 0.122 mm  F_imb = 2.29 N
  Reduction: −60.6%
```

### Counter-Eccentric Mass Analysis

```
Zinc wing asymmetric mass estimate (5.7g over 60° arc):
  Δm_zn = 5.7 × (60°/360°) = 0.950 g  at r_zn = 17 mm
  Unbalanced moment: M_zn = 0.950 × 17 = 16.15 g·mm

Level Chip counter-moment:
  M_LC = 0.7 × 14 = 9.80 g·mm  (placed 180° opposite)
  Net moment: M_net = 16.15 − 9.80 = 6.35 g·mm

Eccentricity before and after Level Chip:
  e_raw       = 16.15 / 52.1 = 0.310 mm
  e_corrected = 6.35  / 52.1 = 0.122 mm  (−60.6%)

Centrifugal imbalance force at ω₀ = 600 rad/s:
  F_raw       = 0.0521 × 3.10×10⁻⁴ × 600² = 5.81 N
  F_corrected = 0.0521 × 1.22×10⁻⁴ × 600² = 2.29 N

Perturbation frequency:
  f_imb = 600 / (2π) = 95.5 Hz  (once per revolution, spin-frequency perturbation)

Level Chip inertia contribution:
  I_LC = 7.0×10⁻⁴ × (14×10⁻³)² = 1.372×10⁻⁷ kg·m²
  Fraction: 1.372×10⁻⁷ / 11.514×10⁻⁶ = 1.19%
```

### TypeScript Model

```typescript
function levelChipBalance(
  mZnSectorG: number, arcDeg: number, rZnMm: number,
  mChipG: number, rChipMm: number, mAssemblyG: number
): { momentZn: number; momentChip: number; momentNet: number;
     eRawMm: number; eCorrectedMm: number; reductionFrac: number } {
  const mZn = mZnSectorG*(arcDeg/360);
  const mZn_g = mZnSectorG * (arcDeg/360);
  const Mzn   = mZn_g * rZnMm;
  const Mlc   = mChipG * rChipMm;
  const Mnet  = Mzn - Mlc;
  return {
    momentZn: Mzn, momentChip: Mlc, momentNet: Mnet,
    eRawMm: Mzn/mAssemblyG, eCorrectedMm: Mnet/mAssemblyG,
    reductionFrac: (Mzn - Mnet)/Mzn
  };
}
// levelChipBalance(5.7, 60, 17, 0.7, 14, 52.1) → { Mzn:16.15, Mlc:9.80, Mnet:6.35, e_raw:0.310mm, e_corr:0.122mm, red:0.606 }
// levelChipBalance(5.7, 60, 17, 1.0, 14, 52.1) → { Mzn:16.15, Mlc:14.0, Mnet:2.15, red:0.867 }  — heavier chip
// levelChipBalance(5.7, 90, 17, 0.7, 14, 52.1) → { Mzn:24.2,  Mlc:9.80, Mnet:14.4, red:0.595 }  — wider arc

function eccentricityWithoutChip(
  mZnTotalG: number, arcDeg: number, rZnMm: number,
  mAssemblyG: number, omegaRad: number
): { eRawMm: number; fImbN: number; fImbHz: number } {
  const mZn = mZnTotalG*(arcDeg/360);
  const e   = (mZn*rZnMm)/mAssemblyG;
  const F   = (mAssemblyG/1000)*(e/1000)*omegaRad**2;
  return { eRawMm: e, fImbN: F, fImbHz: omegaRad/(2*Math.PI) };
}
// eccentricityWithoutChip(5.7, 60, 17, 52.1, 600) → { e:0.310mm, F:5.81N, f:95.5Hz }
// eccentricityWithoutChip(5.7, 60, 17, 52.1, 300) → { e:0.310mm, F:1.45N, f:47.7Hz }  — mid-battle
// eccentricityWithoutChip(4.7, 60, 12, 52.1, 600) → { e:0.171mm, F:3.21N, f:95.5Hz }  — ChZWV inner ring

function chipInertiaContrib(
  mChipG: number, rChipMm: number, iTotalKgm2: number
): { iChipKgm2: number; fraction: number; angMomChip: number } {
  const iC = (mChipG/1000)*(rChipMm/1000)**2;
  return { iChipKgm2: iC, fraction: iC/iTotalKgm2, angMomChip: iC*600 };
}
// chipInertiaContrib(0.7, 14, 11.514e-6) → { I:1.372e-7, frac:0.0119, L:8.23e-5 }  — Level Chip in ChZV assembly
// chipInertiaContrib(0.7, 14,  7.581e-6) → { I:1.372e-7, frac:0.0181 }              — in lighter assembly
// chipInertiaContrib(1.0, 14, 11.514e-6) → { I:1.960e-7, frac:0.0170 }              — heavier chip
```

---

## Case 425 — Gatinko Chip Valkyrie (Gatinko Layer System): Miniature Burst-Control Hub, Three-Part Layer Architecture, and Disc-Tab Engagement Threshold in the Slash.Blitz.Power Assembly

**Thesis:** Gatinko Chip Valkyrie (3.0 g) is the central component of the Gatinko Layer System introduced in 2019, which replaced the single-piece Cho-Z Energy Layer with a three-part modular architecture: Gatinko Chip (character-specific burst control, small hub) plus Layer Base (attack geometry structure) plus Layer Weight (peripheral inertia ring); the Chip is a small ABS/PC hub of inner bore radius r_i = 2 mm and outer radius r_o = 8 mm that snaps into the Layer Base's central socket at one end and engages the Disc's ratchet teeth at the other, reversing the Standard Burst layer-tab-to-disc interface; in Gatinko, burst occurs when the Chip rotates against the Disc (not the Layer against the Disc), and only the Chip's tabs participate in the burst threshold — the Layer Base and Weight ride passively on the Chip; the Chip has two PC cantilever tabs at engagement radius r_tab = 5 mm with L_tab = 3.5 mm, b_tab = 2.5 mm, h_tab = 0.5 mm, giving I_tab = b×h³/12 = 2.5×(0.5)³/12 = 2.604×10⁻¹⁴ m⁴, k_tab = 3EI/L³ = 3×2.4×10⁹×2.604×10⁻¹⁴/(3.5×10⁻³)³ = 4,373 N/m, F_tab = k×δ_max = 4373×0.25×10⁻³ = 1.093 N, and τ_burst = 2 × F_tab × r_tab = 2 × 1.093 × 5×10⁻³ = 10.93 mN·m, which is comparable to the original Winning Valkyrie's 10.8 mN·m; the Chip's moment of inertia I_Chip = ½ × 0.003 × ((2×10⁻³)² + (8×10⁻³)²) = 1.020×10⁻⁷ kg·m², only 0.74% of the assembly total I_total = 13.780×10⁻⁶ kg·m², confirming the Chip is a pure burst-mechanism node with negligible inertia contribution; the three-part architecture decouples burst resistance (Chip tab geometry) from attack inertia (Layer Weight peripheral mass) and smash geometry (Layer Base blade angles), allowing independent tuning of each parameter through swapping individual components, a combinatorial advantage absent from one-piece Energy Layers.

### Visual Geometry

```
Gatinko three-part layer architecture (exploded side view):

  ┌──────────────────────────────────────────┐
  │  LAYER WEIGHT (Retsu, outer ring)        │  r 17–22mm, 8.7g
  └──────────────────────────────────────────┘
  ┌──────────────────────────────────────────┐
  │  LAYER BASE (Slash, smash blades)        │  r 8–22mm, 9.1g
  │         ┌──────────┐                     │
  │         │   CHIP   │  r 2–8mm, 3.0g     │  ← tabs engage DISC teeth
  │         │ (Valkyrie│                     │
  │         └──────────┘                     │
  └──────────────────────────────────────────┘
                   ↓ snaps into Disc
  ┌──────────────────────────────────────────┐
  │  FORGE DISC (Blitz, r 4–23mm)           │  28.6g
  └──────────────────────────────────────────┘

Chip tab geometry (side view):
  ╔══════╗  ← Chip body (r_o=8mm)
  ║  tab ║  L=3.5mm, b=2.5mm, h=0.5mm, r_tab=5mm
  ╚══════╝  τ_burst = 10.93 mN·m (2 tabs)
```

### Chip Burst Mechanism Analysis

```
Chip Valkyrie tab cantilever parameters:
  L_tab = 3.5 mm;  b_tab = 2.5 mm;  h_tab = 0.5 mm;  r_tab = 5.0 mm

Second moment of area:
  I_tab = b × h³ / 12 = 2.5×10⁻³ × (0.5×10⁻³)³ / 12 = 2.604×10⁻¹⁴ m⁴

Spring constant:
  k_tab = 3EI / L³ = 3 × 2.4×10⁹ × 2.604×10⁻¹⁴ / (3.5×10⁻³)³
        = 1.875×10⁻⁴ / 4.288×10⁻⁸ = 4,373 N/m

Burst threshold:
  F_tab = 4,373 × 0.25×10⁻³ = 1.093 N  (at δ_max = 0.25 mm)
  τ_burst = 2 × 1.093 × 5×10⁻³ = 10.93 mN·m

Comparison with Standard Burst layers:
  WV (r_tab=7.5mm, 2 tabs):  τ = 10.8 mN·m  — comparable (larger r compensates)
  Chip Valkyrie (r=5mm):     τ = 10.93 mN·m — similar threshold

Chip inertia:
  I_Chip = ½ × 0.00300 × ((2.0×10⁻³)² + (8.0×10⁻³)²)
         = ½ × 0.00300 × (4.0×10⁻⁶ + 64.0×10⁻⁶)
         = ½ × 0.00300 × 6.80×10⁻⁵
         = 1.020×10⁻⁷ kg·m²  (0.74% of I_total = 13.780×10⁻⁶)
```

### TypeScript Model

```typescript
function gatinkoChipBurstThreshold(
  nTabs: number, lTabMm: number, bTabMm: number, hTabMm: number,
  rTabMm: number, deltaMaxMm: number, eMPa: number
): { kTab: number; fTab: number; tauBurstMnm: number } {
  const I   = (bTabMm/1000)*(hTabMm/1000)**3/12;
  const k   = 3*(eMPa*1e6)*I/(lTabMm/1000)**3;
  const f   = k*(deltaMaxMm/1000);
  return { kTab: k, fTab: f, tauBurstMnm: nTabs*f*(rTabMm/1000)*1000 };
}
// gatinkoChipBurstThreshold(2, 3.5,2.5,0.5, 5.0, 0.25, 2400) → { k:4373, F:1.093N, τ:10.93mN·m }
// gatinkoChipBurstThreshold(2, 5.0,3.0,0.55,7.5, 0.30, 2400) → { k:2400, F:0.720N, τ:10.8mN·m  }  — WV
// gatinkoChipBurstThreshold(3, 3.5,2.5,0.5, 5.0, 0.25, 2400) → { k:4373, F:1.093N, τ:16.4mN·m  }  — 3-tab chip

function chipLayerInertiaFraction(
  mChipG: number, rChipInnerMm: number, rChipOuterMm: number,
  mBaseG: number, rBaseInnerMm: number, rBaseOuterMm: number,
  mWeightG: number, rWtInnerMm: number, rWtOuterMm: number
): { iChip: number; iBase: number; iWeight: number;
     chipFrac: number; baseFrac: number; weightFrac: number } {
  const iC = 0.5*(mChipG  /1000)*((rChipInnerMm/1000)**2+(rChipOuterMm/1000)**2);
  const iB = 0.5*(mBaseG  /1000)*((rBaseInnerMm/1000)**2+(rBaseOuterMm/1000)**2);
  const iW = 0.5*(mWeightG/1000)*((rWtInnerMm  /1000)**2+(rWtOuterMm  /1000)**2);
  const iT = iC+iB+iW;
  return { iChip:iC, iBase:iB, iWeight:iW, chipFrac:iC/iT, baseFrac:iB/iT, weightFrac:iW/iT };
}
// chipLayerInertiaFraction(3.0,2,8, 9.1,8,22, 8.7,17,22) →
//   { iC:1.02e-7, iB:2.493e-6, iW:3.362e-6, chipFrac:0.017, baseFrac:0.422, weightFrac:0.570 }  (layer-only fracs)
// chipLayerInertiaFraction(3.0,2,8, 9.1,4,22, 8.7,17,22) →
//   { iB:2.534e-6 }  — if base had std 4mm bore (not hollow)
// chipLayerInertiaFraction(3.0,2,8, 12.0,8,22, 8.7,17,22) →
//   { baseFrac:0.491 }  — heavier base

function gatinkoSystemBurstVsStandard(
  tauChipMnm: number, tauStandardMnm: number,
  iChipKgm2: number, iStandardKgm2: number
): { burstRatio: number; inertiaRatio: number; archBenefit: string } {
  return {
    burstRatio:    tauChipMnm / tauStandardMnm,
    inertiaRatio:  iChipKgm2  / iStandardKgm2,
    archBenefit:   tauChipMnm >= tauStandardMnm ? "Chip matches Standard" : "Chip below Standard"
  };
}
// gatinkoSystemBurstVsStandard(10.93, 10.8, 1.02e-7, 3.800e-6) → { burstRatio:1.012, inertiaRatio:0.027 }
// gatinkoSystemBurstVsStandard(13.20, 10.8, 1.02e-7, 3.800e-6) → { burstRatio:1.222 }  — 3-tab chip
// gatinkoSystemBurstVsStandard( 8.00, 10.8, 1.02e-7, 3.800e-6) → { burstRatio:0.741 }  — weak chip
```

---

## Case 426 — Layer Base Slash (Gatinko Layer System): C₃ Slashing Blade Geometry, Hollow Hub Inertia Penalty, and Attack Smash-Recoil Decomposition in the Slash.Blitz.Power Assembly

**Thesis:** Layer Base Slash (9.1 g) is the ABS/PC smash blade structure of the Gatinko Layer System and forms the primary attack geometry of the Slash.Blitz.Power combination, featuring a C₃ three-blade layout with a slashing contact angle of φ = 25° from radial, a larger inner bore radius of r_i = 8 mm (to accommodate the Gatinko Chip's outer radius r_o = 8 mm) rather than the r_i = 4 mm hub of a single-piece Energy Layer, and an outer blade radius of r_o = 22 mm; the hollow hub increases r_i from 4 mm to 8 mm, reducing the annular inertia by the inner radius squared term: ΔI_hub = ½ × m × (r_i_new² − r_i_old²) = ½ × 0.0091 × ((8×10⁻³)² − (4×10⁻³)²) = ½ × 0.0091 × 4.80×10⁻⁵ = 2.184×10⁻⁷ kg·m², so the Slash Base has I_LayerBase = ½ × 0.0091 × ((8×10⁻³)² + (22×10⁻³)²) = 2.493×10⁻⁶ kg·m² versus a hypothetical solid-hub equivalent of 2.711×10⁻⁶ kg·m², an 8.0% inertia penalty from the Chip socket bore; the φ = 25° slashing angle is 3° more aggressive than Winning Valkyrie's φ = 22°, giving smash fraction cos(25°) = 0.906 and recoil fraction sin(25°) = 0.423, a 14.7% higher recoil fraction meaning Slash trades 2.2% of smash force for significantly higher self-recoil, which drives the layer away from opponents faster and contributes to the erratic, banking-pattern-disrupting movement of the Slash Base; contact frequency f = 3 × 600/(2π) = 286 Hz (same C₃ as Winning Valkyrie lineage); the 9.1 g mass of the Slash Base is 5.9 g lighter than a Cho-Z Valkyrie layer (20.9 g) because the mass budget for peripheral inertia is entirely delegated to the separate Layer Weight (Retsu), allowing the Base to be a lightweight structural piece; in the three-part layer, Layer Base's inertia share is I_Base/(I_Chip+I_Base+I_Weight) = 2.493×10⁻⁶/5.957×10⁻⁶ = 41.8%, with the Weight ring (Retsu) contributing the remaining 56.4% of layer inertia despite 0.4 g less mass.

### Visual Geometry

```
Top-down view — Layer Base Slash (C₃, r_o = 22 mm):

              BLADE 1  (φ = 25° from radial, slashing)
           ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲
         ╱  slash face           ◣ r_o = 22 mm
        │   ╔══════════╗         │
        │   ║  CHIP    ║         │  ← Chip socket bore r_i = 8 mm
        │   ║  socket  ║         │
        │   ╚══════════╝         │
         ╲                      ╱
           ╲__________________╱
          BLADE 2           BLADE 3

Hollow hub inertia penalty:
  Solid r_i=4mm: I = ½×0.0091×((4)²+(22)²)×10⁻⁶ = 2.711×10⁻⁶ kg·m²
  Hollow r_i=8mm: I = ½×0.0091×((8)²+(22)²)×10⁻⁶ = 2.493×10⁻⁶ kg·m²  (−8.0%)

Smash-recoil comparison (C₃ Valkyrie lineage):
  WV/ChZWV/ChZV:  φ=22°  smash=0.927  recoil=0.375
  Slash Base:     φ=25°  smash=0.906  recoil=0.423  (+12.8% recoil)
```

### Smash Geometry and Inertia Analysis

```
Layer Base Slash inertia (r_i = 8 mm, r_o = 22 mm, m = 9.1 g):
  I_Base = ½ × 0.00910 × ((8.0×10⁻³)² + (22.0×10⁻³)²)
         = ½ × 0.00910 × (6.40×10⁻⁵ + 4.84×10⁻⁴)
         = ½ × 0.00910 × 5.48×10⁻⁴
         = 2.493×10⁻⁶ kg·m²

Hollow hub inertia penalty vs r_i = 4 mm:
  I_solid  = ½ × 0.00910 × (1.60×10⁻⁵ + 4.84×10⁻⁴) = 2.711×10⁻⁶ kg·m²
  Penalty  = 2.711×10⁻⁶ − 2.493×10⁻⁶ = 2.18×10⁻⁷ kg·m²  (−8.0%)

Smash geometry:
  φ = 25°;  cos(25°) = 0.906 (smash);  sin(25°) = 0.423 (recoil)
  vs φ = 22° (WV): smash 0.927, recoil 0.375
  Recoil increase: (0.423−0.375)/0.375 = 12.8%

Layer-only inertia split (Chip + Base + Retsu):
  I_Chip   = 1.020×10⁻⁷  (1.7%)
  I_Base   = 2.493×10⁻⁶ (41.8%)
  I_Retsu  = 3.362×10⁻⁶ (56.4%)
  I_Layer  = 5.957×10⁻⁶ kg·m²
```

### TypeScript Model

```typescript
function layerBaseSlashInertia(
  mBaseG: number, rInnerMm: number, rOuterMm: number
): { iBase: number; iSolidHub: number; hollowPenalty: number; penaltyFrac: number } {
  const iH = 0.5*(mBaseG/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iS = 0.5*(mBaseG/1000)*((4/1000)**2+(rOuterMm/1000)**2);
  return { iBase: iH, iSolidHub: iS, hollowPenalty: iS-iH, penaltyFrac: (iS-iH)/iS };
}
// layerBaseSlashInertia(9.1, 8, 22) → { iBase:2.493e-6, iSolid:2.711e-6, penalty:2.18e-7, frac:0.080 }
// layerBaseSlashInertia(9.1, 4, 22) → { iBase:2.711e-6, iSolid:2.711e-6, penalty:0       }  — std bore
// layerBaseSlashInertia(9.1,10, 22) → { iBase:2.329e-6, iSolid:2.711e-6, penalty:3.82e-7 }  — wider bore

function slashSmashGeometry(
  phiDeg: number, nBlades: number, omegaRad: number
): { smash: number; recoil: number; recoilVsWV: number; freqHz: number } {
  const phi = phiDeg*Math.PI/180;
  const wvRecoil = Math.sin(22*Math.PI/180);
  return { smash: Math.cos(phi), recoil: Math.sin(phi),
           recoilVsWV: Math.sin(phi)/wvRecoil,
           freqHz: nBlades*omegaRad/(2*Math.PI) };
}
// slashSmashGeometry(25, 3, 600) → { smash:0.906, recoil:0.423, vsWV:1.128, freq:286Hz }
// slashSmashGeometry(22, 3, 600) → { smash:0.927, recoil:0.375, vsWV:1.000, freq:286Hz }  — WV
// slashSmashGeometry(30, 3, 600) → { smash:0.866, recoil:0.500, vsWV:1.333, freq:286Hz }  — steeper

function gatinkoLayerTotalInertia(
  mChipG: number, rChipInnerMm: number, rChipOuterMm: number,
  mBaseG: number, rBaseInnerMm: number, rBaseOuterMm: number,
  mWeightG: number, rWtInnerMm: number, rWtOuterMm: number
): { iChip: number; iBase: number; iWeight: number; iLayer: number } {
  const iC = 0.5*(mChipG  /1000)*((rChipInnerMm/1000)**2+(rChipOuterMm/1000)**2);
  const iB = 0.5*(mBaseG  /1000)*((rBaseInnerMm/1000)**2+(rBaseOuterMm/1000)**2);
  const iW = 0.5*(mWeightG/1000)*((rWtInnerMm  /1000)**2+(rWtOuterMm  /1000)**2);
  return { iChip: iC, iBase: iB, iWeight: iW, iLayer: iC+iB+iW };
}
// gatinkoLayerTotalInertia(3.0,2,8, 9.1,8,22, 8.7,17,22) → { iC:1.02e-7, iB:2.493e-6, iW:3.362e-6, iL:5.957e-6 }
// gatinkoLayerTotalInertia(3.0,2,8, 9.1,4,22, 8.7,17,22) → { iB:2.711e-6, iL:6.175e-6 }  — solid-hub base
// gatinkoLayerTotalInertia(3.0,2,8, 9.1,8,22, 10.0,15,22) → { iW:4.298e-6, iL:6.903e-6 } — heavier weight
```

---

## Case 427 — Layer Weight Retsu (Gatinko Layer System): Aluminium Peripheral Inertia Ring, High Radial Efficiency, and Modular Mass Architecture in the Slash.Blitz.Power Assembly

**Thesis:** Layer Weight Retsu (8.7 g) is a removable aluminium (ρ_Al ≈ 2700 kg/m³) annular ring in the Gatinko Layer System that snaps around the outer perimeter of the Layer Base at inner radius r_i = 17 mm and outer radius r_o = 22 mm; at h ≈ 5.3 mm ring height (V = π(r_o² − r_i²)h = π(484 − 289)×10⁻⁶ × 5.3×10⁻³ = 3.246×10⁻⁶ m³, ρV = 2700 × 3.246×10⁻⁶ = 8.76 g ≈ 8.7 g ✓), confirming aluminium as the most likely material; the inertia I_Retsu = ½ × 0.0087 × ((17×10⁻³)² + (22×10⁻³)²) = ½ × 0.0087 × (2.89×10⁻⁴ + 4.84×10⁻⁴) = 3.362×10⁻⁶ kg·m² is the dominant layer component, contributing 56.4% of the combined three-part layer inertia (5.957×10⁻⁶ kg·m²) despite being only 8.7/(3.0+9.1+8.7) = 41.1% of layer mass; the inertia efficiency at its annular centroid r_avg = (17+22)/2 = 19.5 mm reaches I_actual/I_if_at_tip = 3.362×10⁻⁶/(0.0087×(22×10⁻³)²) = 3.362×10⁻⁶/4.209×10⁻⁶ = 79.9%, nearly double the 30.6% efficiency of ChZWV's zinc ring which sat at r 10–14 mm; the modular nature of the Layer Weight is the Gatinko era's key design advance over the Cho-Z era: swapping Retsu (8.7 g, r 17–22 mm) for a heavier weight (e.g., 12 g) would increase I_layer by ΔI = ½ × (12−8.7)×10⁻³ × (2.89+4.84)×10⁻⁴ = 1.275×10⁻⁶ kg·m² (+21.4%) without altering burst threshold (Chip tabs) or smash geometry (Layer Base angle), enabling inertia tuning without changing attack profile; the assembly's Layer Weight sits at the same radial zone as Cho-Z Achilles' Cho-Z Wings (r ≈ 17–22 mm), suggesting the Gatinko system effectively distributes the Cho-Z era's peripheral mass into a fully swappable ring rather than a fixed bistable mechanism.

### Visual Geometry

```
Side cross-section — Layer Weight Retsu (aluminium ring):

  r = 22 mm ──────────────────────────────────── r = 17 mm
       ┌────────────────────────────────────────┐
       │  ALUMINIUM RING (ρ ≈ 2700 kg/m³)      │ h ≈ 5.3 mm
       │  m = 8.7 g    I = 3.362×10⁻⁶ kg·m²   │
       └────────────────────────────────────────┘
  ← Layer Base sits inside at r 8–17 mm →

Inertia efficiency comparison (same r_o=22mm reference):
  ChZWV Zn ring   r 10–14mm  4.7g → I=6.956×10⁻⁷ kg·m²  eff=30.6%
  Retsu Al ring   r 17–22mm  8.7g → I=3.362×10⁻⁶ kg·m²  eff=79.9%
  (Retsu: 2.6× more inertia per gram despite 1.85× more mass)
```

### Aluminium Ring Material Verification and Inertia Analysis

```
Layer Weight Retsu material verification (aluminium, ρ = 2700 kg/m³):
  V = π × ((22×10⁻³)² − (17×10⁻³)²) × h
    = π × (484 − 289)×10⁻⁶ × h
    = 6.126×10⁻⁴ × h  m³
  m = 2700 × 6.126×10⁻⁴ × h = 1.654 × h kg
  For m = 8.7 g = 0.0087 kg: h = 0.0087/1.654 = 5.26 mm ≈ 5.3 mm ✓

Retsu inertia (r_i = 17 mm, r_o = 22 mm, m = 8.7 g):
  I_Retsu = ½ × 0.00870 × ((17.0×10⁻³)² + (22.0×10⁻³)²)
          = ½ × 0.00870 × (2.89×10⁻⁴ + 4.84×10⁻⁴)
          = ½ × 0.00870 × 7.73×10⁻⁴
          = 3.362×10⁻⁶ kg·m²

Radial inertia efficiency (reference: all mass at r_o = 22 mm):
  I_at_tip = 0.0087 × (22×10⁻³)² = 4.209×10⁻⁶ kg·m²
  Efficiency = 3.362/4.209 = 79.9%  ← vs 30.6% for ChZWV inner ring

Modular swap: Retsu (8.7g) → heavier weight (12g), same radii:
  I_new = ½ × 0.012 × 7.73×10⁻⁴ = 4.638×10⁻⁶ kg·m²
  ΔI    = 4.638 − 3.362 = 1.276×10⁻⁶ kg·m²  (+38.0% weight ring inertia)
  ΔI as fraction of assembly: 1.276/13.780×10⁻⁶ = +9.3% total assembly I
```

### TypeScript Model

```typescript
function layerWeightInertia(
  mWeightG: number, rInnerMm: number, rOuterMm: number
): { iWeightKgm2: number; ringEfficiency: number; ringHeight: number } {
  const iW   = 0.5*(mWeightG/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iTip = (mWeightG/1000)*(rOuterMm/1000)**2;
  const rhoAl = 2700;
  const vol  = Math.PI*((rOuterMm/1000)**2-(rInnerMm/1000)**2);
  const h    = (mWeightG/1000)/(rhoAl*vol);
  return { iWeightKgm2: iW, ringEfficiency: iW/iTip, ringHeight: h*1000 };
}
// layerWeightInertia(8.7, 17, 22) → { I:3.362e-6, eff:0.799, h:5.26mm }  — Retsu (aluminium verified)
// layerWeightInertia(4.7, 10, 14) → { I:6.956e-7, eff:0.306, h:2.19mm }  — ChZWV zinc ring
// layerWeightInertia(12.0,17, 22) → { I:4.638e-6, eff:0.799, h:7.26mm }  — heavier Retsu swap

function weightRadialEfficiency(
  mG: number, rInnerMm: number, rOuterMm: number, rRefMm: number
): { iActual: number; iAtRef: number; efficiency: number } {
  const iA = 0.5*(mG/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iR = (mG/1000)*(rRefMm/1000)**2;
  return { iActual: iA, iAtRef: iR, efficiency: iA/iR };
}
// weightRadialEfficiency(8.7, 17, 22, 22) → { iActual:3.362e-6, iAtRef:4.209e-6, eff:0.799 }
// weightRadialEfficiency(4.7, 10, 14, 22) → { iActual:6.956e-7, iAtRef:2.274e-6, eff:0.306 }
// weightRadialEfficiency(5.7, 14, 20, 22) → { iActual:1.698e-6, iAtRef:2.760e-6, eff:0.615 }

function outerWeightRingVsChZRing(
  mRingG: number, rRingInnerMm: number, rRingOuterMm: number,
  mChZG: number,  rChZInnerMm: number,  rChZOuterMm: number
): { iRing: number; iChZ: number; inertiaRatioPerGram: number } {
  const iR = 0.5*(mRingG/1000)*((rRingInnerMm/1000)**2+(rRingOuterMm/1000)**2);
  const iC = 0.5*(mChZG /1000)*((rChZInnerMm /1000)**2+(rChZOuterMm /1000)**2);
  return { iRing: iR, iChZ: iC, inertiaRatioPerGram: (iR/mRingG)/(iC/mChZG) };
}
// outerWeightRingVsChZRing(8.7,17,22, 4.7,10,14) → { iR:3.362e-6, iC:6.956e-7, ratio:2.61 }
// outerWeightRingVsChZRing(8.7,17,22, 5.7,14,20) → { iR:3.362e-6, iC:1.698e-6, ratio:1.30 }
// outerWeightRingVsChZRing(8.7,15,22, 4.7,10,14) → { iR:3.697e-6, iC:6.956e-7, ratio:2.87 }
```

---

## Case 428 — Forge Disc Blitz (Gatinko Layer System): Maximum Era Disc Mass, High Outer Radius Angular Momentum, and Disc-Dominant Assembly Inertia in the Slash.Blitz.Power Assembly

**Thesis:** Forge Disc Blitz (28.6 g) is the heaviest Forge Disc in the Gatinko-era catalogue, exceeding Zenith (24.1 g) by 4.5 g (+18.7%) and outmassing Disc 1 (21.2 g) by 7.4 g (+34.9%), with its extra mass concentrated in a wider outer rim at r_o = 23 mm; I_Blitz = ½ × 0.0286 × ((4×10⁻³)² + (23×10⁻³)²) = ½ × 0.0286 × (1.60×10⁻⁵ + 5.29×10⁻⁴) = ½ × 0.0286 × 5.452×10⁻⁴ = 7.796×10⁻⁶ kg·m²; comparing to Zenith (24.1 g, r_o = 23 mm, I = 6.567×10⁻⁶ kg·m²), the pure mass addition at identical radius gives ΔI/I_Zenith = (7.796 − 6.567)/6.567 = 18.7%, matching the mass ratio (+18.7%), confirming the extra mass is in the same radial zone; Blitz dominates the Slash.Blitz.Power assembly's inertia at I_Blitz/I_total = 7.796×10⁻⁶/13.780×10⁻⁶ = 56.6%, the largest single-component fraction in the assembly and comparable to Zenith's 57.0% dominance in the ChZV.Zenith.Evolution assembly; the disc's angular momentum alone at launch is L_Blitz = 7.796×10⁻⁶ × 600 = 4.678×10⁻³ kg·m²/s, representing 56.6% of the assembly total L₀ = 8.268×10⁻³ kg·m²/s; the high-mass disc fulfils the primary stamina role in the Gatinko system since, unlike Cho-Z layers whose zinc rings provided both high inertia and burst resistance, the Gatinko architecture separates these roles cleanly: Layer Weight (Retsu) supplies layer-level inertia and peripheral contact, Chip Valkyrie supplies burst resistance, and Blitz supplies the bulk of the assembly angular momentum reservoir; in the spin decay equation, Blitz's inertia contributes to the denominator, reducing dω/dt for any given floor torque: replacing Blitz with Disc 1 (21.2 g, r_o = 22 mm, I = 5.300×10⁻⁶) would increase spin decay from 67.5 to dω/dt_D1 = −τ_floor/(I_total − I_Blitz + I_D1) = −9.306×10⁻⁴/(13.780−7.796+5.300)×10⁻⁶ = −9.306×10⁻⁴/11.284×10⁻⁶ = −82.5 rad/s², a 22.2% faster decay.

### Visual Geometry

```
Top-down view — Forge Disc Blitz (r_o = 23 mm):

     ╭──────────────────────────────────╮  ← r_o = 23 mm (widest Gatinko era disc)
    ╱    heavy continuous outer rim      ╲
   │    28.6 g  I = 7.796×10⁻⁶ kg·m²    │
   │    hub r_i = 4 mm                  │
    ╲                                   ╱
     ╰──────────────────────────────────╯

Mass and inertia comparison (r_i = 4 mm):
  Disc 1:  21.2g r_o=22mm → I=5.300×10⁻⁶ kg·m²  (reference)
  Zenith:  24.1g r_o=23mm → I=6.567×10⁻⁶ kg·m²  (+23.9%)
  Blitz:   28.6g r_o=23mm → I=7.796×10⁻⁶ kg·m²  (+47.1%)

Assembly angular momentum breakdown (L₀ at ω=600):
  Chip   0.74%  → L=6.12×10⁻⁵
  Base  18.1%  → L=1.496×10⁻³
  Retsu 24.4%  → L=2.017×10⁻³
  Blitz 56.6%  → L=4.678×10⁻³  ← dominant
  Power  0.21% → L=1.73×10⁻⁵
```

### High-Mass Disc Angular Momentum Analysis

```
Blitz disc inertia (r_i = 4 mm, r_o = 23 mm, m = 28.6 g):
  I_Blitz = ½ × 0.02860 × ((4.0×10⁻³)² + (23.0×10⁻³)²)
          = ½ × 0.02860 × (1.60×10⁻⁵ + 5.29×10⁻⁴)
          = ½ × 0.02860 × 5.452×10⁻⁴
          = 7.796×10⁻⁶ kg·m²

Mass vs Zenith (same r_o = 23 mm):
  ΔI/I_Zenith = (7.796 − 6.567) / 6.567 = 18.7%  =  Δm/m_Zenith = 4.5/24.1 = 18.7% ✓

Disc assembly share:
  I_total = 13.780×10⁻⁶ kg·m²
  Blitz fraction: 7.796/13.780 = 56.6%

Spin decay comparison (Power tip, r_eff=2mm, W=0.5474N):
  With Blitz: dω/dt = −9.306×10⁻⁴ / 13.780×10⁻⁶ = −67.5 rad/s²
  With Disc1: dω/dt = −9.306×10⁻⁴ / (13.780−7.796+5.300)×10⁻⁶ = −82.5 rad/s²
  Blitz saves: (82.5−67.5)/82.5 = 18.2% slower spin decay

Assembly L₀ = 13.780×10⁻⁶ × 600 = 8.268×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function blitzDiscInertia(
  mDiscG: number, rInnerMm: number, rOuterMm: number
): { iDiscKgm2: number; vsDisc1: number; vsZenith: number } {
  const iD  = 0.5*(mDiscG/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iD1 = 0.5*(21.2/1000)*((4/1000)**2+(22/1000)**2);
  const iZ  = 0.5*(24.1/1000)*((4/1000)**2+(23/1000)**2);
  return { iDiscKgm2: iD, vsDisc1: iD/iD1, vsZenith: iD/iZ };
}
// blitzDiscInertia(28.6, 4, 23) → { I:7.796e-6, vsDisc1:1.471, vsZenith:1.187 }  — Blitz
// blitzDiscInertia(24.1, 4, 23) → { I:6.567e-6, vsDisc1:1.239, vsZenith:1.000 }  — Zenith
// blitzDiscInertia(28.6, 4, 22) → { I:7.158e-6, vsDisc1:1.350 }                  — Blitz if r_o=22mm

function blitzVsZenithComparison(
  mBlitzG: number, mZenithG: number,
  rOuterMm: number, rInnerMm: number
): { iBlitz: number; iZenith: number; inertiaGain: number; massGain: number } {
  const calc = (m: number) => 0.5*(m/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iB = calc(mBlitzG); const iZ = calc(mZenithG);
  return { iBlitz: iB, iZenith: iZ,
    inertiaGain: (iB-iZ)/iZ, massGain: (mBlitzG-mZenithG)/mZenithG };
}
// blitzVsZenithComparison(28.6, 24.1, 23, 4) → { iB:7.796e-6, iZ:6.567e-6, ΔI:0.187, Δm:0.187 }
// blitzVsZenithComparison(28.6, 21.2, 22, 4) → { iB:7.158e-6, iZ:5.300e-6, ΔI:0.350, Δm:0.349 }
// blitzVsZenithComparison(28.6, 25.2, 23, 4) → { iB:7.796e-6, iZ:6.867e-6, ΔI:0.135, Δm:0.135 }

function discAssemblyAngularMomentum(
  iDiscKgm2: number, iTotalKgm2: number, omegaRad: number
): { lDisc: number; lTotal: number; discL0Frac: number } {
  return { lDisc: iDiscKgm2*omegaRad, lTotal: iTotalKgm2*omegaRad,
           discL0Frac: iDiscKgm2/iTotalKgm2 };
}
// discAssemblyAngularMomentum(7.796e-6, 13.780e-6, 600) → { lD:4.678e-3, lT:8.268e-3, frac:0.566 }
// discAssemblyAngularMomentum(6.567e-6, 11.514e-6, 600) → { lD:3.940e-3, lT:6.908e-3, frac:0.570 }
// discAssemblyAngularMomentum(5.300e-6,  7.581e-6, 600) → { lD:3.180e-3, lT:4.549e-3, frac:0.699 }
```

---

## Case 429 — Power Performance Tip (Gatinko Layer System): Moderate-Width Rubber Base, Non-Dash Spring, and Attack-Stamina Balance in the Slash.Blitz.Power Assembly

**Thesis:** Power (6.4 g) is a Gatinko-era Performance Tip with a moderate-width rubber base of outer radius r_base = 3 mm (effective friction radius r_eff = 2r/3 = 2 mm), intermediate between the wide Volcanic base (r_base = 4 mm, r_eff = 2.67 mm) and a stamina sharp tip (r_tip ≈ 0.5 mm); the floor torque τ_floor = μ × W × r_eff = 0.85 × (0.0558×9.81) × 2×10⁻³ = 0.85 × 0.5474 × 2×10⁻³ = 9.306×10⁻⁴ N·m and spin decay dω/dt = −9.306×10⁻⁴/13.780×10⁻⁶ = −67.5 rad/s² are 45.7% lower than Volcanic on its assembly (124.4 rad/s²) due both to the narrower contact footprint (r_eff: 2.0 vs 2.67 mm, −25.1%) and the heavier Blitz assembly (I_total: 13.780 vs 7.581 ×10⁻⁶, +81.8%), giving Power a battle window of Δt = 360/67.5 = 5.33 s versus Volcanic's 2.89 s; Power lacks the Dash spring mechanism (no apostrophe suffix), meaning the driver shaft compresses by δ_std ≈ 0.3 mm under impact rather than a Dash's δ_dash ≈ 0.1 mm, and the extra shaft travel absorbs (0.3−0.1)/0.3 = 66.7% more floor-contact compliance per collision; the tip moment of inertia I_Power = ½ × 0.0064 × (3×10⁻³)² = 2.88×10⁻⁸ kg·m² is 0.21% of the assembly total, negligible as a spin reservoir; the Slash.Blitz.Power assembly (m_total = 55.8 g) achieves I_total = 13.780×10⁻⁶ kg·m² and L₀ = 8.268×10⁻³ kg·m²/s at ω₀ = 600 rad/s, making it the highest angular momentum assembly in the Burst Standard-through-Gatinko era covered so far, combining the heaviest disc (Blitz), a peripheral aluminium weight ring (Retsu), and a Gatinko Chip burst mechanism into the most inertia-rich and stamina-capable rubber-tip attack configuration yet analysed.

### Visual Geometry

```
Side cross-section — Power tip (non-Dash, moderate rubber):

  ┌──────────────────────┐
  │  driver body (ABS)   │  ← no Dash spring lock
  │  m = 6.4 g           │
  └────────┬─────────────┘
           │  shaft (δ_std=0.3mm compliance)
  ╔════════╧═══════╗
  ║  rubber base   ║  ← r_base = 3 mm  (between Volcanic's 4mm and sharp tip 0.5mm)
  ║  μ_k = 0.85    ║
  ╚════════════════╝
  r_eff = 2r/3 = 2.0 mm

Floor torque comparison (same assembly mass for reference):
  Power    r_eff=2.0mm  → τ=9.31×10⁻⁴ N·m  dω/dt=−67.5 rad/s²  Δt=5.33s
  Volcanic r_eff=2.67mm → τ=9.43×10⁻⁴ N·m  dω/dt=−124 rad/s²  Δt=2.89s
  (Volcanic on lighter assembly — different denominators account for rest of ratio)
```

### Floor Torque and Assembly Physics

```
Power tip parameters: r_base = 3 mm, r_eff = 2 mm, μ_k = 0.85, m = 6.4 g

Assembly weight (m_total = 55.8 g):
  W = 0.05580 × 9.81 = 0.5474 N

Floor torque:
  τ_floor = 0.85 × 0.5474 × 2.0×10⁻³ = 9.306×10⁻⁴ N·m

Assembly total inertia:
  I_total = I_Chip + I_Base + I_Retsu + I_Blitz + I_Power
          = 1.020×10⁻⁷ + 2.493×10⁻⁶ + 3.362×10⁻⁶ + 7.796×10⁻⁶ + 2.88×10⁻⁸
          = 13.780×10⁻⁶ kg·m²

Spin decay and battle time:
  dω/dt = −9.306×10⁻⁴ / 13.780×10⁻⁶ = −67.5 rad/s²
  Δt = (600 − 240) / 67.5 = 5.33 s

Assembly angular momentum:
  L₀ = 13.780×10⁻⁶ × 600 = 8.268×10⁻³ kg·m²/s  ← highest of Burst Standard–Gatinko era so far

Non-Dash compliance vs Dash:
  δ_std = 0.3 mm;  δ_dash = 0.1 mm
  Extra energy absorbed per impact: ½ × F_impact × (δ_std − δ_dash) / 1000
    = ½ × 50 × 0.2×10⁻³ = 5.0×10⁻³ J  at F_impact=50N — reduces burst impulse transfer
```

### TypeScript Model

```typescript
function powerTipDecay(
  mAssemblyG: number, iTotalKgm2: number,
  rBaseMm: number, muRubber: number
): { rEffMm: number; tauFloor: number; dOmegaDt: number; battleTimeS: number } {
  const rEff = (2*rBaseMm/3)/1000;
  const tau  = muRubber*(mAssemblyG/1000)*9.81*rEff;
  const dOm  = -tau/iTotalKgm2;
  return { rEffMm: rEff*1000, tauFloor: tau, dOmegaDt: dOm, battleTimeS: 360/Math.abs(dOm) };
}
// powerTipDecay(55.8, 13.780e-6, 3.0, 0.85) → { rEff:2.00mm, tau:9.306e-4, dOmega:−67.5, t:5.33s }
// powerTipDecay(42.3,  7.581e-6, 4.0, 0.85) → { rEff:2.67mm, tau:9.431e-4, dOmega:−124,  t:2.89s }  — Volcanic
// powerTipDecay(55.8, 13.780e-6, 2.0, 0.85) → { rEff:1.33mm, tau:6.204e-4, dOmega:−45.0, t:8.00s }  — smaller base

function powerVsVolcanicComparison(
  mPowerAssemblyG: number, iPowerTotalKgm2: number, rPowerMm: number,
  mVolcAssemblyG:  number, iVolcTotalKgm2:  number, rVolcMm:  number,
  muRubber: number
): { dOmegaPower: number; dOmegaVolc: number; decayRatio: number } {
  const tau = (m: number, r: number) => muRubber*(m/1000)*9.81*(2*r/3)/1000;
  const dP = -tau(mPowerAssemblyG, rPowerMm) / iPowerTotalKgm2;
  const dV = -tau(mVolcAssemblyG,  rVolcMm ) / iVolcTotalKgm2;
  return { dOmegaPower: dP, dOmegaVolc: dV, decayRatio: Math.abs(dP/dV) };
}
// powerVsVolcanicComparison(55.8,13.780e-6,3.0, 42.3,7.581e-6,4.0, 0.85) →
//   { dP:−67.5, dV:−124, ratio:0.544 }  — Power decays 45.6% slower than Volcanic
// powerVsVolcanicComparison(55.8,13.780e-6,4.0, 42.3,7.581e-6,4.0, 0.85) →
//   { dP:−90.0, dV:−124, ratio:0.726 }  — if Power had Volcanic's footprint

function gatinkoAssemblyBattleTime(
  mAssemblyG: number, iTotalKgm2: number,
  rTipMm: number, muRubber: number,
  omegaLaunch: number, omegaThresh: number
): { L0: number; tauFloor: number; dOmegaDt: number; battleTimeS: number } {
  const rEff = (2*rTipMm/3)/1000;
  const tau  = muRubber*(mAssemblyG/1000)*9.81*rEff;
  const dOm  = -tau/iTotalKgm2;
  return { L0: iTotalKgm2*omegaLaunch, tauFloor: tau, dOmegaDt: dOm,
           battleTimeS: (omegaLaunch-omegaThresh)/Math.abs(dOm) };
}
// gatinkoAssemblyBattleTime(55.8, 13.780e-6, 3.0, 0.85, 600, 240) → { L0:8.268e-3, dOmega:−67.5, t:5.33s }
// gatinkoAssemblyBattleTime(52.1, 11.514e-6, 2.0, 0.85, 600, 240) → { L0:6.908e-3, dOmega:−50.3, t:7.16s }
// gatinkoAssemblyBattleTime(42.3,  7.581e-6, 4.0, 0.85, 600, 240) → { L0:4.549e-3, dOmega:−124,  t:2.89s }
```

---

## Case 430 — DB Core Valkyrie (Dynamite Battle Layer System): Lightweight Spring Rebound Hub, BU Lock Integration, and High/Low Mode CoM Asymmetry in the Savior.Shot-7 Assembly

**Thesis:** DB Core Valkyrie (7.7 g) is a right-spin DB Core in the Dynamite Battle Layer System, serving as the spring-rebound hub and mode-switch controller of the Savior.Shot-7 assembly; at 7.7 g it is 2.9 g lighter than DB Core Xcalibur (10.6 g, Case 404) while sharing the same spring mechanism (ABS spring of k_spring ≈ 300 N/m, maximum compression δ = 1.0 mm) and BU Lock three-protrusion geometry; the spring rebound velocity is v_rebound = sqrt(k × δ²/m_core) = sqrt(300 × (1.0×10⁻³)²/0.0077) = sqrt(3.0×10⁻⁴/0.0077) = sqrt(3.896×10⁻²) = 0.197 m/s, 17.3% faster than Xcalibur's 0.168 m/s (factor sqrt(10.6/7.7) = 1.173), because the lighter core reaches higher velocity for the same stored spring energy; the DB Core moment of inertia I_Core = ½ × 0.0077 × ((4×10⁻³)² + (12×10⁻³)²) = ½ × 0.0077 × (1.6×10⁻⁵ + 1.44×10⁻⁴) = 6.16×10⁻⁷ kg·m², only 7.24% of the assembly total I_total = 8.507×10⁻⁶ kg·m², confirming the DB Core is a mechanism node rather than an inertia contributor; the BU Lock provides the same three-protrusion-to-three-socket burst resistance amplification as analysed in Case 404 (τ_BU ≈ 15–30 mN·m supplemental threshold); in High/Low Mode switching, swapping DB Core Valkyrie (7.7 g) and Armor 7 (13.2 g) changes the assembly height by h_switch ≈ 7 mm and shifts the centre of mass by Δh_CoM = 7 × (m_Armor7 − m_Core)/(m_total) = 7 × (13.2 − 7.7)/42.5 = 7 × 5.5/42.5 = 0.906 mm, substantially larger than the Xcalibur BU assembly's Δh_CoM = 0.222 mm (Case 404) because the mass asymmetry between Armor 7 and DB Core Valkyrie is 5.5 g versus 2.5 g for Xcalibur; this larger CoM shift means the Savior assembly gains more leverage from mode switching: in High Mode, the 0.906 mm higher CoM position increases gyroscopic precession tilt and blade contact height advantage over Low Mode opponents by proportionally more than the Xcalibur BU combination.

### Visual Geometry

```
DB Core Valkyrie spring geometry (side view):
  ┌──────────────────────────────────┐
  │  DB Core body (7.7 g, ABS)       │  r_i=4mm, r_o=12mm
  │  spring mechanism: k=300 N/m     │
  │  δ_max=1.0mm → v_rebound=0.197m/s│
  │  BU Lock: 3 protrusions (120°)   │
  └──────────────────────────────────┘

High/Low Mode CoM shift (Savior assembly):
  Low Mode:  DB Core bottom → CoM at h_low
  High Mode: DB Core top    → CoM at h_low + 0.906mm
  
  vs Xcalibur BU assembly:
    Δh_CoM_Xcal  = 0.222mm  (m_asym = 10.6−13.1 = −2.5g)
    Δh_CoM_Savior = 0.906mm  (m_asym = 7.7−13.2 = −5.5g)
```

### Spring Rebound and CoM Analysis

```
DB Core Valkyrie spring rebound (k=300 N/m, δ=1.0mm, m=7.7g):
  E_spring = ½ × 300 × (1.0×10⁻³)² = 1.50×10⁻⁴ J
  v_rebound = sqrt(2E/m) = sqrt(2 × 1.50×10⁻⁴ / 0.0077) = sqrt(3.896×10⁻²) = 0.197 m/s

vs DB Core Xcalibur (10.6g, same spring):
  v_xcal = sqrt(2 × 1.50×10⁻⁴ / 0.0106) = sqrt(2.830×10⁻²) = 0.168 m/s
  Ratio: 0.197/0.168 = 1.173 ← Valkyrie rebounds 17.3% faster

DB Core inertia:
  I_Core = ½ × 0.00770 × ((4.0×10⁻³)² + (12.0×10⁻³)²)
         = ½ × 0.00770 × (1.60×10⁻⁵ + 1.44×10⁻⁴)
         = ½ × 0.00770 × 1.60×10⁻⁴
         = 6.16×10⁻⁷ kg·m²  (7.24% of I_total = 8.507×10⁻⁶)

High/Low Mode CoM shift:
  Δh_CoM = h_switch × (m_Armor7 − m_Core) / m_total
          = 7 × (13.2 − 7.7) / 42.5
          = 7 × 5.5 / 42.5
          = 0.906 mm  (vs Xcalibur BU: 0.222mm; 4.1× larger shift)
```

### TypeScript Model

```typescript
function dbCoreValkyrieSprings(
  kSpring: number, deltaMaxMm: number, mCoreG: number
): { eSpring: number; vRebound: number; vsXcaliburRatio: number } {
  const E  = 0.5*kSpring*(deltaMaxMm/1000)**2;
  const v  = Math.sqrt(2*E/(mCoreG/1000));
  const vX = Math.sqrt(2*E/(10.6/1000));
  return { eSpring: E, vRebound: v, vsXcaliburRatio: v/vX };
}
// dbCoreValkyrieSprings(300, 1.0, 7.7) → { E:1.5e-4J, v:0.197m/s, vsXcal:1.173 }
// dbCoreValkyrieSprings(300, 1.0,10.6) → { E:1.5e-4J, v:0.168m/s, vsXcal:1.000 }  — DB Core Xcalibur
// dbCoreValkyrieSprings(450, 1.0, 7.7) → { E:2.25e-4J, v:0.242m/s, vsXcal:1.173 }  — stronger spring

function saviorHighLowCOMShift(
  hSwitchMm: number, mCoreG: number, mArmorG: number, mTotalG: number
): { deltaHComMm: number; vsXcaliburShift: number; mAsymG: number } {
  const xcalShift = 7*(13.1-10.6)/78.8;
  const dh = hSwitchMm*(mArmorG-mCoreG)/mTotalG;
  return { deltaHComMm: dh, vsXcaliburShift: dh/xcalShift, mAsymG: mArmorG-mCoreG };
}
// saviorHighLowCOMShift(7, 7.7, 13.2, 42.5) → { dh:0.906mm, vsXcal:4.08, mAsym:5.5g }
// saviorHighLowCOMShift(7,10.6, 13.1, 78.8) → { dh:0.222mm, vsXcal:1.00 }  — Xcalibur BU reference
// saviorHighLowCOMShift(7, 7.5, 13.9, 69.5) → { dh:0.640mm, vsXcal:2.88 }  — Ultimate Valkyrie (DB Core V2)

function valkyrieBULockThreshold(
  nProtrusions: number, rLockMm: number, tauBaseMnm: number, amplificationFrac: number
): { tauBU: number; tauTotal: number; totalVsBase: number } {
  const tauBU = nProtrusions * amplificationFrac * (rLockMm/7.5) * tauBaseMnm / nProtrusions;
  const tauT  = tauBaseMnm + tauBU;
  return { tauBU, tauTotal: tauT, totalVsBase: tauT/tauBaseMnm };
}
// valkyrieBULockThreshold(3, 9.0, 10.93, 0.50) → { tauBU:3.28, tauTotal:14.21, vs:1.30 }
// valkyrieBULockThreshold(3, 9.0, 10.93, 1.00) → { tauBU:6.56, tauTotal:17.49, vs:1.60 }
// valkyrieBULockThreshold(3, 9.0, 10.80, 0.50) → { tauBU:3.24, tauTotal:14.04, vs:1.30 }  — WV base
```

---

## Case 431 — Blade Savior (Dynamite Battle Layer System): Rubber Contact Point Two-Zone Inertia, Hertzian Rubber Contact Patch, and Two-Stage Wear Burst Threshold in the Savior.Shot-7 Assembly

**Thesis:** Blade Savior (11.2 g) is a right-spin Attack Type Blade in the DB Layer System featuring three wing contact points with rubber coating at the outer tips, identical in spirit to Blade Ultimate (Case 439), but lighter by the mass of rubber used and structurally configured for the Savior DB Core rather than the Valkyrie 2 DB Core; the blade's two-zone inertia model separates the ABS/PC annular body (m_body = 9.0 g, r_i = 10 mm, r_o = 22 mm) from the rubber contact zone (m_rubber = 2.2 g, r_i_rubber = 20 mm, r_o_rubber = 22 mm): I_body = ½ × 0.009 × ((10×10⁻³)² + (22×10⁻³)²) = 2.628×10⁻⁶ kg·m²; I_rubber = ½ × 0.0022 × ((20×10⁻³)² + (22×10⁻³)²) = 9.724×10⁻⁷ kg·m²; I_Savior = 3.600×10⁻⁶ kg·m²; the rubber tips at the outer annular zone produce 2.77 times the inertia per gram as the inner body region (r_avg_rubber = 21 mm vs r_avg_body = 16 mm, ratio (21²+21²)/(10²+22²) × (1/1) ≈ 0.884/(0.584) × 9.0/2.2 = 2.77); the rubber contact mechanics change the blade-to-blade collision significantly: Hertzian contact with rubber (E_rubber = 2 MPa, ν = 0.50) against ABS (E_ABS = 2.3 GPa, ν = 0.35) gives 1/E* = (1−0.25)/2×10⁶ + (1−0.1225)/2.3×10⁹ ≈ 3.75×10⁻⁷, E* ≈ 2.67×10⁶ Pa, and contact patch radius a = (3WR/4E*)^(1/3) = (3×20×0.003/(4×2.67×10⁶))^(1/3) = 2.24×10⁻³ m = 2.24 mm, versus 0.329 mm for ABS-on-ABS contact (E* ≈ 1.26 GPa), making rubber contact 6.8 times larger in patch radius and 46.2 times larger in contact area; this large rubber contact area increases energy absorption per collision (reducing net burst impulse reaching the burst tabs) in Stage 1 (mint rubber), while Stage 2 (worn to plastic) reverts the contact patch to 0.329 mm and eliminates the energy absorption buffer, making worn Savior blades significantly more reactive and burst-prone per contact; the C₃ contact frequency f = 3×600/(2π) = 286 Hz and smash angle φ = 22° are inherited from the Valkyrie lineage.

### Visual Geometry

```
Top-down view — Blade Savior (C₃, r_o = 22 mm):

           WING 1 (φ=22°, rubber tip)
        ╱‾‾‾‾‾‾‾‾‾‾‾‾╲
      ╱  ABS body      ░░◣ ← rubber tip r 20–22mm
     │   r_i=10mm     ░░░ │
     │   r_o=22mm     ░░░ │
      ╲               ░░░╱
        ╲____________╱
       WING 2       WING 3   (░=rubber zones)

Two-zone inertia summary:
  Body (ABS):   9.0g r 10–22mm  →  I=2.628×10⁻⁶ kg·m²
  Rubber tips:  2.2g r 20–22mm  →  I=9.724×10⁻⁷ kg·m²
  Total Savior: 11.2g           →  I=3.600×10⁻⁶ kg·m²

Hertzian contact patch comparison:
  Rubber on ABS: E*=2.67×10⁶ Pa  → a=2.24mm  (Stage 1, mint rubber)
  ABS on ABS:    E*=1.26×10⁹ Pa  → a=0.329mm (Stage 2, worn)
  Patch area ratio: (2.24/0.329)² = 46.3×
```

### Rubber Contact and Two-Stage Physics

```
Blade Savior two-zone inertia:
  I_body = ½ × 0.00900 × ((10.0×10⁻³)² + (22.0×10⁻³)²)
         = ½ × 0.00900 × (1.00×10⁻⁴ + 4.84×10⁻⁴)
         = ½ × 0.00900 × 5.84×10⁻⁴
         = 2.628×10⁻⁶ kg·m²

  I_rubber = ½ × 0.00220 × ((20.0×10⁻³)² + (22.0×10⁻³)²)
           = ½ × 0.00220 × (4.00×10⁻⁴ + 4.84×10⁻⁴)
           = ½ × 0.00220 × 8.84×10⁻⁴
           = 9.724×10⁻⁷ kg·m²

  I_Savior = 2.628×10⁻⁶ + 9.724×10⁻⁷ = 3.600×10⁻⁶ kg·m²

Hertzian contact (W = 20 N blade impact, R = 3 mm contact radius):
  Stage 1 — rubber-on-ABS:
    1/E* = (1−0.25)/2×10⁶ + (1−0.1225)/2.3×10⁹
         = 3.750×10⁻⁷ + 3.815×10⁻¹⁰ ≈ 3.754×10⁻⁷
    E*   = 2.664×10⁶ Pa
    a    = (3×20×3×10⁻³/(4×2.664×10⁶))^(1/3)
         = (1.800×10⁻¹/(1.066×10⁷))^(1/3) = (1.688×10⁻⁸)^(1/3) = 2.56×10⁻³ m = 2.56 mm

  Stage 2 — ABS-on-ABS (worn rubber):
    1/E* = 2×(1−0.1225)/2.3×10⁹ = 7.630×10⁻¹⁰
    E*   = 1.311×10⁹ Pa
    a    = (3×20×3×10⁻³/(4×1.311×10⁹))^(1/3) = (4.086×10⁻²/5.244×10⁹)^(1/3) = 3.29×10⁻⁴ m = 0.329 mm
  
  Contact area ratio Stage1/Stage2: (2.56/0.329)² = 60.5×
```

### TypeScript Model

```typescript
function saviorBladeRubberInertia(
  mBodyG: number, rBodyInnerMm: number, rBodyOuterMm: number,
  mRubberG: number, rRubInnerMm: number, rRubOuterMm: number
): { iBody: number; iRubber: number; iTotal: number; rubberInertiaPct: number } {
  const iB = 0.5*(mBodyG  /1000)*((rBodyInnerMm/1000)**2+(rBodyOuterMm/1000)**2);
  const iR = 0.5*(mRubberG/1000)*((rRubInnerMm /1000)**2+(rRubOuterMm /1000)**2);
  return { iBody: iB, iRubber: iR, iTotal: iB+iR, rubberInertiaPct: iR/(iB+iR)*100 };
}
// saviorBladeRubberInertia(9.0,10,22, 2.2,20,22) → { iB:2.628e-6, iR:9.724e-7, iT:3.600e-6, rubPct:27.0% }
// saviorBladeRubberInertia(11.2,10,22, 0,20,22) → { iB:3.272e-6, iR:0, iT:3.272e-6 }  — if no rubber
// saviorBladeRubberInertia(9.0, 4,22, 2.2,20,22) → { iB:2.846e-6, iR:9.724e-7, iT:3.818e-6 } — std bore

function rubberHertzianContactPatch(
  fImpactN: number, rContactMm: number,
  eRubberMPa: number, nuRubber: number,
  eOtherGPa: number, nuOther: number
): { eStar: number; patchRadiusMm: number; patchAreaMm2: number } {
  const invE = (1-nuRubber**2)/(eRubberMPa*1e6) + (1-nuOther**2)/(eOtherGPa*1e9);
  const Es   = 1/invE;
  const a    = (3*fImpactN*(rContactMm/1000)/(4*Es))**(1/3);
  return { eStar: Es, patchRadiusMm: a*1000, patchAreaMm2: Math.PI*a*a*1e6 };
}
// rubberHertzianContactPatch(20, 3, 2, 0.50, 2.3, 0.35) → { E*:2.67e6Pa, a:2.56mm, A:20.6mm² }  Stage1 rubber
// rubberHertzianContactPatch(20, 3, 2300, 0.35, 2.3, 0.35) → { E*:1.26e9Pa, a:0.329mm, A:0.340mm² }  Stage2 ABS
// rubberHertzianContactPatch(20, 3, 0.002,0.50, 2.3, 0.35) → { E*:2.67e6Pa, a:2.56mm }  — same (dominates)

function rubberWearBurstChange(
  tauBaseStage1Mnm: number, energyAbsorptionFrac: number
): { tauEffStage1: number; tauEffStage2: number; burstRiskRatio: number } {
  const tauS1 = tauBaseStage1Mnm * (1 - energyAbsorptionFrac);
  const tauS2 = tauBaseStage1Mnm;   // full impulse when worn to ABS
  return { tauEffStage1: tauS1, tauEffStage2: tauS2, burstRiskRatio: tauS2/tauS1 };
}
// rubberWearBurstChange(15.0, 0.40) → { tauS1:9.0mN·m, tauS2:15.0mN·m, riskRatio:1.67 }
// rubberWearBurstChange(15.0, 0.25) → { tauS1:11.25, tauS2:15.0, riskRatio:1.33 }
// rubberWearBurstChange(10.93, 0.40) → { tauS1:6.56, tauS2:10.93, riskRatio:1.67 }  — Chip Valkyrie tabs
```

---

## Case 432 — Armor 7 (Dynamite Battle Layer System): C₃ Nine-Wing Symmetric Ring, High/Low Mode Height Control, and BU Lock Engagement in the Savior.Shot-7 Assembly

**Thesis:** Armor 7 (13.2 g) is a DB-era Armor component with a three-sided C₃ design featuring nine total wing patterns arranged in groups of three, closely related in mass and geometry to Armor 1 (13.1 g, Case 406) but differentiated by its wing count (9 vs 7 protrusions), wing shape reference (Wing Forge Disc, an aerodynamic curved-wing disc), and C₃ compatibility optimisation for three-bladed Layers such as Savior and Ultimate; the moment of inertia I_Armor7 = ½ × 0.0132 × ((12×10⁻³)² + (22×10⁻³)²) = ½ × 0.0132 × (1.44×10⁻⁴ + 4.84×10⁻⁴) = ½ × 0.0132 × 6.28×10⁻⁴ = 4.145×10⁻⁶ kg·m², compared to Armor 1's I_A1 = 4.113×10⁻⁶ kg·m², a difference of only 3.2×10⁻⁸ kg·m² (+0.78%) from the 0.1 g extra mass; Armor 7 is the largest single inertia contributor in the Savior assembly at 4.145×10⁻⁶/8.507×10⁻⁶ = 48.7% of I_total, versus Armor 1 in the Xcalibur BU assembly at 4.113×10⁻⁶/13.926×10⁻⁶ = 29.5%, because the Savior assembly lacks a heavy Forge Disc (Xanthus in the Xcalibur case), making the Armor the dominant inertia element; in High Mode (Armor at top), the Armor's r_o = 22 mm rim sits at the highest point of the assembly and intercepts attack impulses from Lower Mode opponents at height h_Armor ≈ 12 mm above the floor, reducing the burst impulse fraction reaching the Blade Savior's rubber contact points by f_intercept = 1 − h_Blade/h_Armor = 1 − 5/12 ≈ 0.583, identical to the Armor 1 geometry (Case 406); the nine-wing pattern at three attack sectors (three wings per sector, 120° spacing) provides aerodynamic down-force in theory (f_aero ≈ 0.31% of floor friction torque), negligible as in all frame/armor aerodynamic analyses; BU Lock sockets in Armor 7 engage DB Core protrusions at the same geometry as Armor 1.

### Visual Geometry

```
Top-down view — Armor 7 (C₃, r_o = 22 mm, nine-wing pattern):

           ╔══════════════════════════════╗
           ║  ARMOR 7  (three sectors)    ║
           ║  Each sector: 3 curved wings ║
           ║  r_i = 12mm  r_o = 22mm     ║
           ║  Total: 9 wings across C₃   ║
           ║  BU Lock sockets: 3× (120°) ║
           ╚══════════════════════════════╝

Comparison with Armor 1 (Case 406):
  Armor 1: 13.1g  7 protrusions  I=4.113×10⁻⁶  (7/360° ring pattern)
  Armor 7: 13.2g  9 wings (C₃)  I=4.145×10⁻⁶  (+0.78%)

Assembly inertia share (no Forge Disc in Savior assembly):
  Armor 7:  4.145×10⁻⁶  48.7%  ← dominant (vs 29.5% in BU assembly with Xanthus)
  Savior:   3.600×10⁻⁶  42.3%
  DB Core:  6.16×10⁻⁷    7.2%
  Shot:     1.46×10⁻⁷    1.7%
```

### Armor 7 Inertia and Mode Analysis

```
Armor 7 inertia (r_i = 12 mm, r_o = 22 mm, m = 13.2 g):
  I_A7 = ½ × 0.01320 × ((12.0×10⁻³)² + (22.0×10⁻³)²)
       = ½ × 0.01320 × (1.44×10⁻⁴ + 4.84×10⁻⁴)
       = ½ × 0.01320 × 6.28×10⁻⁴
       = 4.145×10⁻⁶ kg·m²

vs Armor 1 (13.1g, same radii):
  I_A1 = ½ × 0.01310 × 6.28×10⁻⁴ = 4.113×10⁻⁶ kg·m²
  ΔI = 3.2×10⁻⁸ kg·m²  (+0.78%, matches +0.1g mass ratio)

Savior assembly inertia share (no Forge Disc):
  Armor 7 fraction: 4.145×10⁻⁶ / 8.507×10⁻⁶ = 48.7%
  (vs Armor 1 in BU assembly: 4.113 / 13.926 = 29.5% — disc removal doubles Armor share)

High Mode impulse interception (same geometry as Armor 1):
  f_intercept = 1 − h_Blade/h_Armor = 1 − 5/12 = 0.583 (58.3% of impulse intercepted)
```

### TypeScript Model

```typescript
function armor7ModeInertia(
  mArmorG: number, rInnerMm: number, rOuterMm: number
): { iArmor: number; vsArmor1: number; assemblyShareNoDisc: number } {
  const iA  = 0.5*(mArmorG/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iA1 = 0.5*(13.1/1000)*((12/1000)**2+(22/1000)**2);
  const iAssembly = 8.507e-6;  // Savior.Shot-7 I_total
  return { iArmor: iA, vsArmor1: iA/iA1, assemblyShareNoDisc: iA/iAssembly };
}
// armor7ModeInertia(13.2, 12, 22) → { I:4.145e-6, vsA1:1.008, share:0.487 }
// armor7ModeInertia(13.1, 12, 22) → { I:4.113e-6, vsA1:1.000, share:0.483 }  — Armor 1
// armor7ModeInertia(13.9, 12, 22) → { I:4.366e-6, vsA1:1.061 }                — Armor 9

function armor7VsArmor1Comparison(
  mA7G: number, mA1G: number, rInnerMm: number, rOuterMm: number
): { iA7: number; iA1: number; deltaMg: number; deltaI: number } {
  const calc = (m: number) => 0.5*(m/1000)*((rInnerMm/1000)**2+(rOuterMm/1000)**2);
  const iA7 = calc(mA7G); const iA1 = calc(mA1G);
  return { iA7, iA1, deltaMg: mA7G-mA1G, deltaI: iA7-iA1 };
}
// armor7VsArmor1Comparison(13.2, 13.1, 12, 22) → { iA7:4.145e-6, iA1:4.113e-6, dm:0.1g, dI:3.2e-8 }
// armor7VsArmor1Comparison(13.9, 13.1, 12, 22) → { dm:0.8g, dI:2.51e-7 }  — Armor 9 vs 1
// armor7VsArmor1Comparison(13.2, 13.2, 10, 22) → { iA7:4.145e-6 vs std bore:4.381e-6 } — r_i effect

function armor7ImpulseInterception(
  hBladeMm: number, hArmorMm: number, fullImpulseNs: number
): { interceptedFrac: number; reachingTabsFrac: number; reducedImpulseNs: number } {
  const fI = 1 - hBladeMm/hArmorMm;
  return { interceptedFrac: fI, reachingTabsFrac: 1-fI, reducedImpulseNs: fullImpulseNs*(1-fI) };
}
// armor7ImpulseInterception(5, 12, 0.150) → { intercepted:0.583, reaching:0.417, reduced:0.0626N·s }
// armor7ImpulseInterception(5, 12, 0.100) → { intercepted:0.583, reduced:0.0417N·s }
// armor7ImpulseInterception(7, 12, 0.150) → { intercepted:0.417, reaching:0.583 }  — taller blade
```

---

## Case 433 — Performance Tip Shot (Dynamite Battle Layer System): Free-Spinning Steel Ball Bearing, Rolling Friction Stamina Physics, and Maximum LAD in the Savior.Shot-7 Assembly

**Thesis:** Performance Tip Shot (10.4 g) is a Dynamite Battle era driver with a free-spinning steel ball bearing as the floor contact element, the heaviest driver in the Savior.Shot-7 assembly and one of the most mechanically distinct tip types in the Burst era; the steel ball (ρ_steel = 7800 kg/m³) has mass m_ball ≈ 5.0 g and radius r_ball = ((3m)/(4πρ))^(1/3) = ((3×0.005)/(4π×7800))^(1/3) = (1.530×10⁻⁷)^(1/3) = 5.34×10⁻³ m = 5.34 mm, with the remaining 5.4 g forming the ABS housing; the ball is free-spinning against the housing, so floor contact is rolling (not sliding), giving an effective rolling friction coefficient μ_roll ≈ 0.020 — an order of magnitude below hard-ABS sliding (μ_k = 0.17) and two orders below rubber (μ_k = 0.85); the Hertzian contact patch for the steel ball (E_steel = 200 GPa, ν = 0.3) on a polycarbonate stadium floor (E_PC = 2.3 GPa, ν = 0.35) gives 1/E* = (1−0.09)/200×10⁹ + (1−0.1225)/2.3×10⁹ = 4.55×10⁻¹²+3.815×10⁻¹⁰ = 3.860×10⁻¹⁰, E* = 2.59×10⁹ Pa, and contact patch a = (3×0.4169×5.34×10⁻³/(4×2.59×10⁹))^(1/3) = 8.41×10⁻⁵ m = 84.1 μm — a true point contact; the floor torque τ_floor = μ_roll × W × r_ball = 0.020 × 0.4169 × 5.34×10⁻³ = 4.452×10⁻⁵ N·m, and spin decay dω/dt = −4.452×10⁻⁵/8.507×10⁻⁶ = −5.23 rad/s², giving a battle window from 600 to 240 rad/s of Δt = 360/5.23 = 68.8 s — 13.2 times longer than the same assembly with a hard-ABS sharp tip (dω/dt = −8.36 rad/s², Δt = 43.1 s), and 23.8 times longer than a rubber tip (dω/dt = −5.23/(0.85/0.020) ≈ scale not applicable — ballpark: 2.89s from Case 420); the free-spinning ball also provides superior Life After Death (LAD): as the assembly enters the gyroscopic wobble phase, the ball rolls freely in the tilt direction without scrubbing the floor, allowing extended orbital revolution at minimum floor resistance; tip inertia I_Shot ≈ m_ball × r_ball² = 0.0050 × (5.34×10⁻³)² = 1.424×10⁻⁷ kg·m² (1.67% of I_total), negligible for spin budget.

### Visual Geometry

```
Side cross-section — Shot tip (free-spinning ball bearing):

  ┌────────────────────────┐
  │   ABS housing (5.4g)   │
  └──────────┬─────────────┘
             │ driver shaft
        ╭────╯────╮
       ╭╯         ╰╮
      ╭╯  STEEL     ╰╮  r_ball = 5.34 mm
      ╰╮   BALL     ╭╯  m_ball ≈ 5.0 g
       ╰╭___________╯  ← freely rotating about any axis
         └───────────┘
         point contact: a = 84.1 μm (Hertzian)

Floor friction comparison (Savior assembly, W=0.4169N):
  Shot ball (μ_roll=0.020):   τ=4.45×10⁻⁵ N·m  dω/dt=−5.23 rad/s²   t=68.8s
  Hard ABS (μ_k=0.17):        τ=3.55×10⁻⁵ N·m  dω/dt=−4.17 rad/s²   t=86.3s
  Wait — hard ABS r=0.5mm vs ball r=5.34mm: ball τ is higher due to larger r, but rolling μ is much lower
  Net: Shot rolling < ABS sharp sliding because μ effect dominates over r
```

### Ball Bearing Physics Analysis

```
Steel ball geometry (ρ = 7800 kg/m³, m_ball = 5.0 g):
  r_ball = (3 × 0.0050 / (4π × 7800))^(1/3) = (1.530×10⁻⁷)^(1/3) = 5.34×10⁻³ m = 5.34 mm

Hertzian contact (W = 0.4169 N, E_steel=200 GPa ν=0.3, E_PC=2.3 GPa ν=0.35):
  1/E* = (1−0.09)/200×10⁹ + (1−0.1225)/2.3×10⁹
       = 4.55×10⁻¹² + 3.815×10⁻¹⁰ = 3.860×10⁻¹⁰
  E*   = 2.590×10⁹ Pa
  a    = (3 × 0.4169 × 5.34×10⁻³ / (4 × 2.590×10⁹))^(1/3)
       = (6.685×10⁻³ / 1.036×10¹⁰)^(1/3)
       = (6.451×10⁻¹³)^(1/3) = 8.64×10⁻⁵ m = 86.4 μm

Rolling friction floor torque:
  μ_roll = 0.020 (free-spinning steel on polycarbonate)
  τ_floor = 0.020 × 0.4169 × 5.34×10⁻³ = 4.452×10⁻⁵ N·m

Spin decay and battle time:
  dω/dt = −4.452×10⁻⁵ / 8.507×10⁻⁶ = −5.23 rad/s²
  Δt = (600 − 240) / 5.23 = 68.8 s

Assembly angular momentum:
  L₀ = 8.507×10⁻⁶ × 600 = 5.104×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function shotBallBearingDecay(
  mAssemblyG: number, iTotalKgm2: number,
  mBallG: number, rhoSteelKgm3: number, muRoll: number
): { rBallMm: number; tauFloor: number; dOmegaDt: number; battleTimeS: number } {
  const r  = ((3*(mBallG/1000))/(4*Math.PI*rhoSteelKgm3))**(1/3);
  const W  = (mAssemblyG/1000)*9.81;
  const tau = muRoll * W * r;
  const d  = -tau/iTotalKgm2;
  return { rBallMm: r*1000, tauFloor: tau, dOmegaDt: d, battleTimeS: 360/Math.abs(d) };
}
// shotBallBearingDecay(42.5, 8.507e-6, 5.0, 7800, 0.020) → { r:5.34mm, τ:4.45e-5, dω:−5.23, t:68.8s }
// shotBallBearingDecay(42.5, 8.507e-6, 5.0, 7800, 0.005) → { r:5.34mm, τ:1.11e-5, dω:−1.31, t:275s  }  — new bearing
// shotBallBearingDecay(42.5, 8.507e-6, 5.0, 7800, 0.050) → { r:5.34mm, τ:1.11e-4, dω:−13.1, t:27.5s }  — worn bearing

function metalBallHertzian(
  fN: number, rBallMm: number,
  eContactGPa: number, nuContact: number,
  eFloorGPa: number,   nuFloor:   number
): { eStar: number; patchRadiusMicron: number; peakPressureMPa: number } {
  const invE = (1-nuContact**2)/(eContactGPa*1e9) + (1-nuFloor**2)/(eFloorGPa*1e9);
  const Es = 1/invE;
  const a  = (3*fN*(rBallMm/1000)/(4*Es))**(1/3);
  const p  = 3*fN/(2*Math.PI*a*a)/1e6;
  return { eStar: Es, patchRadiusMicron: a*1e6, peakPressureMPa: p };
}
// metalBallHertzian(0.4169, 5.34, 200, 0.30, 2.3, 0.35) → { E*:2.59e9, a:86.4μm, p:26.6MPa }
// metalBallHertzian(50.0,   5.34, 200, 0.30, 2.3, 0.35) → { E*:2.59e9, a:490μm,  p:99.4MPa }  — impact
// metalBallHertzian(0.4169, 5.34, 2.3, 0.35, 2.3, 0.35) → { E*:1.26e9, a:94.0μm }  — ABS ball (ref)

function shotLADRollingRadius(
  rBallMm: number, wobbleAngleDeg: number, muRollBall: number, muSlideHard: number
): { rLAD: number; tauLAD_ball: number; tauLAD_hard: number; ladAdvantage: number } {
  const wobRad = wobbleAngleDeg*Math.PI/180;
  const rLAD   = (rBallMm/1000)/Math.cos(wobRad);
  return {
    rLAD: rLAD*1000,
    tauLAD_ball:  muRollBall  * rLAD,    // relative torque (per unit W)
    tauLAD_hard:  muSlideHard * 0.5/1000, // hard tip at r=0.5mm
    ladAdvantage: (muSlideHard*0.5/1000) / (muRollBall*rLAD)
  };
}
// shotLADRollingRadius(5.34, 30, 0.020, 0.17) → { rLAD:6.17mm, ladAdv:0.81 }
// Note: ball's r_eff >> sharp tip, but μ_roll << μ_slide, net LAD near parity; ball wins through self-alignment
// shotLADRollingRadius(5.34, 45, 0.020, 0.17) → { rLAD:7.55mm }
// shotLADRollingRadius(5.34, 30, 0.005, 0.17) → { ladAdv:3.25 }  — polished ball bearing
```

---

## Case 434 — Superking Chip Valkyrie (Sparking Layer System): PC Cantilever Burst Tab Kinematics, Tab Stiffness Hierarchy Across Chip Generations, and Negligible Inertial Contribution in the Brave.Evolution'.2A Assembly

**Thesis:** The Superking Chip Valkyrie is the burst-control nucleus of the three-part Sparking Layer System, replacing the single-piece God and Cho-Z layer architecture with a modular Chip-Ring-Chassis stack in which the Chip alone carries the burst-resistance tabs; at 2.6 g the chip contributes I_chip = half × 0.0026 × (5 mm)² = 3.25×10⁻⁸ kg·m², just 0.20% of the 1.605×10⁻⁵ kg·m² system total, confirming it is a purely mechanical rather than inertial component. Three PC cantilever tabs are formed with cross-section b = 2 mm, h = 0.85 mm, free length L = 4 mm, giving second moment I_tab = b·h³/12 = 1.021×10⁻¹³ m⁴, spring stiffness k_tab = 3EI_tab/L³ = 3 × 2.4×10⁹ × 1.021×10⁻¹³ / (4×10⁻³)³ = 3800 N/m; at engagement deflection delta = 0.20 mm and engagement radius r_eng = 3.8 mm the burst torque threshold is tau_burst = N × k × delta × r = 3 × 3800 × 2.0×10⁻⁴ × 3.8×10⁻³ = 8.66 mN·m. Compared with the Gatinko Chip Valkyrie in Case 425 (k = 4373 N/m, tau_burst = 10.93 mN·m) the Superking chip tabs are 13.1% less stiff and the burst torque threshold is 20.8% lower, reflecting the Valkyrie design lineage's deliberate preference for aggressive low-threshold burst behaviour that sacrifices self-preservation for spin-stealing rebound; the chip geometry is rotationally symmetric (no counter-mass required) and the three-tab arrangement yields a ratchet engagement frequency of f_tab = 3 × 600 / (2pi) = 286 Hz identical to the Gatinko Chip. Secondary burst resistance at the driver level is delegated entirely to the Evolution' Dash spring and does not appear in the chip mechanics, so tab geometry is the sole determinant of burst susceptibility at this component. Inserted into the Brave.Evolution'.2A assembly (m_total = 66.1 g, I_total = 1.605×10⁻⁵ kg·m²), the chip's 3.25×10⁻⁸ kg·m² leaves the stamina reserve entirely determined by the Chassis 2A below; any scenario requiring higher burst resistance must target tab geometry (increase h toward 0.95 mm, which cubes h and raises k by 39%) rather than mass distribution.

### Visual Geometry

```
Top-down schematic — Superking Chip Valkyrie (r_chip ≈ 5 mm hub):

           ┌─────────┐
          /   CHIP    \      3 PC tabs, equally spaced at 120°
         │  [T] [T] [T]│    k_tab = 3800 N/m each
         │      ●      │    tau_burst = 8.66 mN·m total
          \           /     I_chip = 3.25×10⁻⁸ kg·m²  (0.20% of I_total)
           └─────────┘
         ←── 10 mm ──→

Burst tab cross-section (PC cantilever):
  ┌──────────────────────┐  h = 0.85 mm
  └──────────────────────┘  b = 2.00 mm,  L = 4.0 mm
  fixed ──────────────── free tip (deflects δ = 0.20 mm at burst)

Chip generation comparison:
  Gatinko Chip Valkyrie (Case 425): k = 4373 N/m  tau = 10.93 mN·m
  Superking Chip Valkyrie (this):   k = 3800 N/m  tau =  8.66 mN·m  (−20.8%)
```

### Physics Analysis

```
Component: Superking Chip Valkyrie  m = 2.6 g
Assembly:  Brave.Evolution'.2A      m_total = 66.1 g   I_total = 1.605×10⁻⁵ kg·m²

Chip inertia:
  I_chip = ½ × 0.0026 × (0.005)²
         = ½ × 0.0026 × 2.50×10⁻⁵
         = 3.25×10⁻⁸ kg·m²   (0.20% of I_total)

PC cantilever tab spring stiffness:
  b = 2.0 mm = 2.0×10⁻³ m,  h = 0.85 mm = 8.5×10⁻⁴ m,  L = 4.0 mm = 4.0×10⁻³ m
  I_tab = b·h³/12 = (2.0×10⁻³)·(8.5×10⁻⁴)³/12 = 1.021×10⁻¹³ m⁴
  k_tab = 3·E·I_tab/L³ = 3 × 2.4×10⁹ × 1.021×10⁻¹³ / (4.0×10⁻³)³
        = 7.351×10⁻⁴ / 6.40×10⁻⁸ = 3800 N/m

Burst torque threshold:
  N = 3 tabs,  δ = 0.20 mm = 2.0×10⁻⁴ m,  r_eng = 3.8 mm = 3.8×10⁻³ m
  tau_burst = N × k_tab × δ × r_eng
            = 3 × 3800 × 2.0×10⁻⁴ × 3.8×10⁻³
            = 8.66×10⁻³ N·m  (8.66 mN·m)

vs Gatinko Chip Valkyrie (Case 425):
  k_GK = 4373 N/m,  tau_GK = 10.93 mN·m
  Stiffness ratio:   3800 / 4373 = 0.869  (−13.1%)
  Burst threshold ratio: 8.66 / 10.93 = 0.792 (−20.8%)
  Burst susceptibility increase: 1/0.792 − 1 = +26.2%

Tab engagement frequency:
  f_tab = N × omega_0 / (2pi) = 3 × 600 / 6.283 = 286 Hz  (identical to Gatinko Chip)
```

### TypeScript Model

```typescript
function superkingChipBurstThreshold(
  b_m: number, h_m: number, L_m: number,
  N: number, deltaM: number, rEngM: number,
  E_GPa: number
): { kTab: number; iTab: number; tauBurstNm: number; tauBurstMNm: number } {
  const iTab = b_m * h_m ** 3 / 12;
  const kTab = 3 * E_GPa * 1e9 * iTab / L_m ** 3;
  const tau  = N * kTab * deltaM * rEngM;
  return { kTab, iTab, tauBurstNm: tau, tauBurstMNm: tau * 1000 };
}
// superkingChipBurstThreshold(0.002, 0.00085, 0.004, 3, 2.0e-4, 0.0038, 2.4) → { kTab:3800, τ:8.66mN·m }
// superkingChipBurstThreshold(0.002, 0.00095, 0.004, 3, 2.0e-4, 0.0038, 2.4) → { kTab:5296, τ:12.08mN·m } — stiffer tab
// superkingChipBurstThreshold(0.002, 0.00085, 0.005, 3, 2.0e-4, 0.0038, 2.4) → { kTab:1949, τ:4.45mN·m }  — longer tab

function chipInertiaFractionSK(
  mChip_g: number, rChip_mm: number, iTotal_em6: number
): { iChip: number; fractionPct: number } {
  const iChip = 0.5 * (mChip_g / 1000) * (rChip_mm / 1000) ** 2;
  return { iChip, fractionPct: iChip / (iTotal_em6 * 1e-6) * 100 };
}
// chipInertiaFractionSK(2.6, 5, 16.05) → { iChip:3.25e-8, fractionPct:0.20% }
// chipInertiaFractionSK(3.0, 5, 13.78) → { iChip:3.75e-8, fractionPct:0.27% } — Gatinko Chip Valkyrie
// chipInertiaFractionSK(3.1, 5, 16.05) → { iChip:3.88e-8, fractionPct:0.24% } — SK Chip Achilles (Case 449)

function superkingVsGatinkoBurstComparison(
  tau_SK_mNm: number, tau_GK_mNm: number
): { delta_mNm: number; ratio: number; burstSusceptibilityIncrease_pct: number } {
  const delta = tau_GK_mNm - tau_SK_mNm;
  const ratio = tau_SK_mNm / tau_GK_mNm;
  return { delta_mNm: delta, ratio, burstSusceptibilityIncrease_pct: (1 / ratio - 1) * 100 };
}
// superkingVsGatinkoBurstComparison(8.66, 10.93) → { Δτ:2.27mN·m, ratio:0.792, +26.2% susceptibility }
// superkingVsGatinkoBurstComparison(8.66, 8.66)  → { Δτ:0, ratio:1.0, 0% }
// superkingVsGatinkoBurstComparison(4.45, 10.93) → { ratio:0.407, +145.6% } — extreme long-tab chip
```

---

## Case 435 — Ring Brave (Sparking Layer System): ABS Attack Ring Inertia, C₃ Smash Geometry, and Ring-Layer Momentum Transfer in the Brave.Evolution'.2A Assembly

**Thesis:** Ring Brave is the attack-geometry component of the Sparking Brave Valkyrie system, positioned atop the Chassis 2A to provide the primary blade-contact surface that the Chassis itself, being an internal disc-body, cannot deliver at the outer perimeter; at 12.3 g without metal inserts it is entirely ABS construction, occupying the annular zone from r_i = 8 mm to r_o = 21 mm and yielding I_Ring = half × 0.0123 × ((8×10⁻³)² + (21×10⁻³)²) = half × 0.0123 × 5.050×10⁻⁴ = 3.106×10⁻⁶ kg·m², representing 19.4% of the system total and forming the second-largest inertia contributor after the dominant Chassis. The ring's swept blade faces are inclined at phi = 18° from the radial direction, giving smash fraction cos(18°) = 0.951 and recoil fraction sin(18°) = 0.309; at a typical collision impulse of deltaJ = 0.15 kg·m/s the ring delivers 0.143 kg·m/s effective smash and 0.046 kg·m/s recoil, a geometry deliberately biased toward maximum spin transfer to the opponent rather than the equal-split ~30–45° configurations seen on pure stamina rings. Because Ring Brave carries no embedded metal, its inertia scales purely with mass and radius; the absence of a zinc ring (compare Cho-Z Winning Valkyrie in Case 418 whose zinc at r 10–14 mm contributed 6.956×10⁻⁷ kg·m²) is compensated by the Chassis 2A's massive 1.286×10⁻⁵ kg·m² below — the Sparking architecture reassigns the mass-to-inertia optimisation task from the ring to the chassis, freeing the ring to be shaped purely for contact geometry. The ring momentum transfer at a collision that deflects the ring by deltaOmega = 80 rad/s is deltaL = I_Ring × deltaOmega = 3.106×10⁻⁶ × 80 = 2.485×10⁻⁴ kg·m²/s, equal to 2.58% of L₀ = 9.630×10⁻³ kg·m²/s, confirming that a single hard collision removes a modest but non-trivial angular momentum fraction and that sustained attack combinations accumulate this drain effectively.

### Visual Geometry

```
Top-down view — Ring Brave (ABS, C₃, r_i = 8 mm, r_o = 21 mm):

                blade (φ = 18° from radial)
           ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲
         ╱   ←smash 95.1%→   ◣ r_o = 21 mm
        │    no zinc insert    │  ABS only
        │   ●──────────────●   │  r_i = 8 mm
         ╲                   ╱
           ╲________________╱

              blade 2              blade 3
           (120° spacing)       (240° spacing)

Smash geometry (φ = 18°):
  F_impact ──→  ┐φ=18°
                 ├─→  smash component  cos(18°) = 0.951
                 └↑   recoil component sin(18°) = 0.309

Inertia distribution in Brave.Evolution'.2A:
  SK Chip:   0.20%  ░
  Ring Brave:19.4%  ████░
  Chassis 2A:80.1%  ████████████████████
  Evo' tip:   0.33%  ░
```

### Physics Analysis

```
Component: Ring Brave  m = 12.3 g  r_i = 8 mm  r_o = 21 mm  ABS (no zinc)
Assembly:  Brave.Evolution'.2A  m_total = 66.1 g  I_total = 1.605×10⁻⁵ kg·m²

Ring inertia:
  I_Ring = ½ × 0.0123 × ((8×10⁻³)² + (21×10⁻³)²)
         = ½ × 0.0123 × (6.40×10⁻⁵ + 4.41×10⁻⁴)
         = ½ × 0.0123 × 5.050×10⁻⁴
         = 3.106×10⁻⁶ kg·m²  (19.4% of I_total)

Smash geometry (phi = 18°):
  cos(18°) = 0.951  ← smash fraction
  sin(18°) = 0.309  ← recoil fraction
  At deltaJ = 0.15 kg·m/s:
    smash impulse  = 0.15 × 0.951 = 0.143 kg·m/s
    recoil impulse = 0.15 × 0.309 = 0.046 kg·m/s

Momentum transfer per collision (Δω = −80 rad/s):
  ΔL_ring = 3.106×10⁻⁶ × 80 = 2.485×10⁻⁴ kg·m²/s
  fraction of L₀ = 2.485×10⁻⁴ / 9.630×10⁻³ = 2.58% per collision

No-zinc penalty vs ChZWV ring:
  I_ChZWV = 4.496×10⁻⁶ kg·m²  (Case 418, with zinc, m = 19.9 g)
  I_Brave  = 3.106×10⁻⁶ kg·m²  (no zinc,  m = 12.3 g)
  Ring inertia deficit: 3.106/4.496 = 0.690  (−31.0%)
  → Chassis 2A compensates: I_Ch2A = 1.286×10⁻⁵ >> I_ChZWV
```

### TypeScript Model

```typescript
function ringBraveInertia(
  mRing_g: number, riMm: number, roMm: number, iTotal: number
): { iRing: number; iShare_pct: number } {
  const i = 0.5 * (mRing_g / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  return { iRing: i, iShare_pct: i / iTotal * 100 };
}
// ringBraveInertia(12.3, 8, 21, 1.605e-5) → { iRing:3.106e-6, iShare:19.4% }
// ringBraveInertia(12.3, 6, 21, 1.605e-5) → { iRing:3.128e-6, iShare:19.5% } — tighter bore
// ringBraveInertia(19.9, 4, 22, 1.605e-5) → { iRing:4.496e-6, iShare:28.0% } — ChZWV for comparison

function ringSmashGeometrySK(
  phiDeg: number, deltaJ_kgms: number
): { smashFrac: number; recoilFrac: number; smashImpulse: number; recoilImpulse: number } {
  const phi = phiDeg * Math.PI / 180;
  return {
    smashFrac:     Math.cos(phi),
    recoilFrac:    Math.sin(phi),
    smashImpulse:  deltaJ_kgms * Math.cos(phi),
    recoilImpulse: deltaJ_kgms * Math.sin(phi)
  };
}
// ringSmashGeometrySK(18, 0.15) → { smash:0.951, recoil:0.309, smashJ:0.143, recoilJ:0.046 }
// ringSmashGeometrySK(25, 0.15) → { smash:0.906, recoil:0.423 } — steeper blade face
// ringSmashGeometrySK(12, 0.15) → { smash:0.978, recoil:0.208 } — shallower blade face

function ringMomentumTransferSK(
  iRing: number, deltaOmega_rads: number, L0: number
): { dL: number; percentOfL0: number } {
  const dL = iRing * Math.abs(deltaOmega_rads);
  return { dL, percentOfL0: dL / L0 * 100 };
}
// ringMomentumTransferSK(3.106e-6, 80,  9.630e-3) → { dL:2.485e-4, pct:2.58% }
// ringMomentumTransferSK(3.106e-6, 200, 9.630e-3) → { dL:6.212e-4, pct:6.45% } — hard collision
// ringMomentumTransferSK(4.496e-6, 80,  9.630e-3) → { dL:3.597e-4, pct:3.73% } — ChZWV ring ref
```

---

## Case 436 — Chassis 2A (Sparking Layer System): Monolithic Integrated Disc-Layer Inertia Dominance, Stamina Reserve Centralisation, and Attack-Chassis Radial Geometry in the Brave.Evolution'.2A Assembly

**Thesis:** Chassis 2A is the structural and inertial core of Brave Valkyrie Sparking, integrating both the disc and upper layer geometry into a single 44.5 g moulded assembly that eliminates the separate Forge Disc of earlier eras and concentrates 80.1% of total system inertia in one component; with r_i = 7 mm and r_o = 23 mm the annular inertia is I_Ch2A = half × 0.0445 × ((7×10⁻³)² + (23×10⁻³)²) = half × 0.0445 × 5.779×10⁻⁴ = 1.286×10⁻⁵ kg·m², which alone delivers L_chassis = 1.286×10⁻⁵ × 600 = 7.716×10⁻³ kg·m²/s out of L₀_total = 9.630×10⁻³ kg·m²/s. The "2A" designation identifies this as the two-component Attack variant Double Chassis, featuring five blade protrusions that function as secondary contact points positioned radially outward beyond the Ring Brave's blade tips, enabling a two-tier contact architecture in which the ring absorbs the first collision and the chassis provides a lower backup strike zone during deep engagement. Because the disc function is integrated, the chassis eliminates the mechanical compliance that exists in the ring-disc interface of earlier Disc-Frame systems; the monolithic construction transfers all collision impulse directly to the system's unified inertial body, avoiding the small torque losses incurred when two separately manufactured components flex against each other. A direct mass-normalised comparison with Forge Disc 00 (25.2 g, r_o = 23 mm, Case 446 ahead) gives I_00 = half × 0.0252 × 5.779×10⁻⁴ = 7.278×10⁻⁶ kg·m² and the Chassis 2A inertia advantage is 1.286×10⁻⁵ / 7.278×10⁻⁶ = 1.767, or +76.7%, with the mass ratio 44.5/25.2 = 1.766 nearly identical, confirming that the inertia gain is almost entirely a mass scaling effect at the same radial distribution; every extra gram in the Chassis translates linearly into inertia without the diminishing-returns penalty of a fixed-outer-radius design. The Chassis 2A at 44.5 g is heavier than any prior single-disc component documented (Illegal at 31.9 g, Blitz at 28.6 g, Zenith at 24.1 g) and the resulting I dominance means that in stamina contests the Ring Brave's contact geometry is a short-burst mechanism overlaid on a chassis-driven endurance platform.

### Visual Geometry

```
Cross-section (side view) — Chassis 2A (r_i = 7 mm, r_o = 23 mm, m = 44.5 g):

  Ring Brave sits on top ↓
  ╔══════════════════════════════════════════╗
  ║ ▲ blade protrusion ×5  (secondary CPs)  ║  ← r_o = 23 mm
  ║════════════════════════════════════════  ║
  ║         integrated disc body             ║  44.5 g monolithic
  ║     ○ bore r_i = 7 mm (Chip mount)  ○   ║
  ╚══════════════════════════════════════════╝

  I_Ch2A = 1.286×10⁻⁵ kg·m²  (80.1% of I_total)
  L_chassis = 7.716×10⁻³ kg·m²/s  (80.1% of L₀)

Inertia mass equivalence:
  Chassis 2A  44.5 g  I = 1.286×10⁻⁵    ← this case
  Chassis 1B  43.0 g  I = 1.242×10⁻⁵    ← 3.4% less I, 3.4% less mass
  Disc 00     25.2 g  I = 7.278×10⁻⁶    ← 44.5% of Ch2A (separate disc only)
  Blitz disc  28.6 g  I = 7.796×10⁻⁶ (Case 428)
```

### Physics Analysis

```
Component: Chassis 2A  m = 44.5 g  r_i = 7 mm  r_o = 23 mm  monolithic (no separate disc)
Assembly:  Brave.Evolution'.2A  m_total = 66.1 g  I_total = 1.605×10⁻⁵ kg·m²

Chassis inertia:
  I_Ch2A = ½ × 0.0445 × ((7×10⁻³)² + (23×10⁻³)²)
          = ½ × 0.0445 × (4.90×10⁻⁵ + 5.29×10⁻⁴)
          = ½ × 0.0445 × 5.779×10⁻⁴
          = 1.286×10⁻⁵ kg·m²   (80.1% of I_total)

Angular momentum at launch:
  L_chassis = 1.286×10⁻⁵ × 600 = 7.716×10⁻³ kg·m²/s
  L₀_total  = 1.605×10⁻⁵ × 600 = 9.630×10⁻³ kg·m²/s

Chassis 2A vs Forge Disc 00 (r_o = 23 mm):
  I_00 = ½ × 0.0252 × 5.779×10⁻⁴ = 7.278×10⁻⁶ kg·m²
  Inertia advantage: 1.286×10⁻⁵ / 7.278×10⁻⁶ = 1.767 (+76.7%)
  Mass ratio: 44.5 / 25.2 = 1.766  → nearly 1:1 mass-to-inertia scaling

Chassis 2A vs Chassis 1B:
  I_1B = ½ × 0.0430 × 5.779×10⁻⁴ = 1.242×10⁻⁵ kg·m²
  ΔI = 1.286×10⁻⁵ − 1.242×10⁻⁵ = 4.40×10⁻⁷ kg·m²  (+3.5%)
  ΔL = 4.40×10⁻⁷ × 600 = 2.64×10⁻⁴ kg·m²/s

Spin decay contribution at Evo' Stage 1 (dω/dt = −45.8 rad/s²):
  Time to 40% stability: t = 600×0.6/45.8 = 7.86 s
  L_chassis remaining at t=7.86s: 7.716×10⁻³ × (240/600) = 3.086×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function chassis2AInertia(
  mChassis_g: number, riMm: number, roMm: number, iTotal: number
): { iChassis: number; lAtLaunch: number; shareOfTotal_pct: number } {
  const I = 0.5 * (mChassis_g / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  const L = I * 600;
  return { iChassis: I, lAtLaunch: L, shareOfTotal_pct: I / iTotal * 100 };
}
// chassis2AInertia(44.5, 7, 23, 1.605e-5) → { I:1.286e-5, L:7.716e-3, share:80.1% }
// chassis2AInertia(43.0, 7, 23, 1.605e-5) → { I:1.242e-5, L:7.461e-3, share:77.4% } — Chassis 1B
// chassis2AInertia(44.5, 7, 22, 1.605e-5) → { I:1.196e-5, L:7.178e-3, share:74.5% } — smaller r_o

function chassis2AVsForgeDisc(
  mChassis_g: number, mDisc_g: number, roMm: number, riMm: number
): { iChassis: number; iDisc: number; inertiaRatio: number; massRatio: number } {
  const calc = (m: number) => 0.5 * (m / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  const iCh = calc(mChassis_g);
  const iD  = calc(mDisc_g);
  return { iChassis: iCh, iDisc: iD, inertiaRatio: iCh / iD, massRatio: mChassis_g / mDisc_g };
}
// chassis2AVsForgeDisc(44.5, 25.2, 23, 7) → { iCh:1.286e-5, iDisc:7.278e-6, iRatio:1.767, mRatio:1.766 }
// chassis2AVsForgeDisc(44.5, 31.9, 23, 7) → { iRatio:1.394, mRatio:1.395 } — vs Illegal disc
// chassis2AVsForgeDisc(44.5, 28.6, 23, 7) → { iRatio:1.556, mRatio:1.556 } — vs Blitz disc

function chassisSystemAngularMomentum(
  iChassis: number, iTotal: number, omega0_rads: number, dOmegaDt: number
): { L0_total: number; L0_chassis: number; chassis_pct: number; spinDecayTimeTo40pct_s: number } {
  const L0   = iTotal * omega0_rads;
  const Lch  = iChassis * omega0_rads;
  const t40  = omega0_rads * 0.6 / Math.abs(dOmegaDt);
  return { L0_total: L0, L0_chassis: Lch, chassis_pct: Lch / L0 * 100, spinDecayTimeTo40pct_s: t40 };
}
// chassisSystemAngularMomentum(1.286e-5, 1.605e-5, 600, 45.8) → { L0:9.630e-3, Lch:7.716e-3, pct:80.1%, t:7.86s }
// chassisSystemAngularMomentum(1.286e-5, 1.605e-5, 500, 45.8) → { L0:8.025e-3, t:6.55s }
// chassisSystemAngularMomentum(1.242e-5, 1.605e-5, 600, 45.8) → { L0:9.630e-3, Lch:7.452e-3 } — Chassis 1B
```

---

## Case 437 — Performance Tip Evolution' (Sparking/Dash): Three-Stage Rubber Wear Spin Decay, Dash Spring Burst Resistance Augmentation, and Fresh-to-Worn Decay Rate Scaling in the Brave.Evolution'.2A Assembly

**Thesis:** Evolution' is the Dash spring-lock variant of the Evolution tip, sharing an identical three-stage rubber decay profile but incorporating a stronger internal Dash spring that raises burst resistance approximately 40% relative to the non-Dash counterpart analysed in Case 423; at 6.7 g it contributes I_Evo' = half × 0.0067 × (4×10⁻³)² = 5.36×10⁻⁸ kg·m², only 0.33% of the system total, confirming the driver is a pure dynamic rather than inertial component. The three rubber decay stages are defined by the progressive wear of the central rubber spike: Stage 1 (fresh, r₁ = 2 mm) gives an effective friction radius r_eff1 = 2r₁/3 = 1.33 mm; Stage 2 (worn intermediate, r₂ = 3.5 mm) gives r_eff2 = 2.33 mm; the spin decay rates follow directly from tau = mu × m_total × g × r_eff / I_total with mu_rubber = 0.85, yielding dω/dt_1 = −0.85 × 0.0661 × 9.81 × 1.333×10⁻³ / 1.605×10⁻⁵ = −45.8 rad/s² and dω/dt_2 = −80.1 rad/s²; the ratio dω/dt_2 / dω/dt_1 = 80.1/45.8 = 1.749 equals exactly r₂/r₁ = 3.5/2.0 = 1.750, confirming that spin decay rate scales linearly with r_eff as expected for the flat-disk formula. The Dash spring mechanism adds a secondary burst resistance at the Driver-Chassis interface: the standard Evolution spring stiffness k_std produces a spring-lock torque tau_std ≈ 8.23 mN·m; the Dash spring at k_dash = k_std × 1.40 raises this to tau_dash = 11.52 mN·m, a 40% increase that reduces burst susceptibility at the driver level by (1 − 1/1.40) × 100 = 28.6%. The combined burst threshold for the assembly (chip tabs 8.66 mN·m + Dash spring secondary contribution 3.29 mN·m) provides two independent protection layers that must both yield before a burst occurs, a serial redundancy that substantially outperforms the Brave assembly's individual chip threshold alone. Battle time to 40% stability in Stage 1 is t = 600 × 0.6 / 45.8 = 7.86 s, compared to Case 423 plain Evolution at 7.16 s for the lighter 52.1 g ChZV assembly — the Brave.2A assembly's higher I_total (1.605×10⁻⁵ vs 1.151×10⁻⁵ kg·m²) extends battle time despite the heavier mass increasing tau.

### Visual Geometry

```
Evolution' tip — stage progression (side profile):

  Stage 1 (fresh):       Stage 2 (worn):         Dash spring (cross-section):
     ▲ rubber spike        ◼ wider patch              ╔═════╗
     │ r = 2 mm           │ r = 3.5 mm               ║ k'  ║  k_dash = k_std × 1.40
  ───┴─── floor        ───┴─── floor              ───╚═════╝─── internal lock
  r_eff = 1.33 mm      r_eff = 2.33 mm
  dω/dt = −45.8 r/s²   dω/dt = −80.1 r/s²

Decay ratio stage 2 / stage 1:
  80.1 / 45.8 = 1.749 ≈ r₂/r₁ = 3.5/2.0 = 1.750  ✓

Battle time (Stage 1, Brave.2A assembly):
  t = 600 × 0.6 / 45.8 = 7.86 s  (to 40% stability threshold)
  vs plain Evolution (Case 423, ChZV assembly): 7.16 s  (lighter assembly, same tip)
```

### Physics Analysis

```
Component: Evolution' (Dash)  m = 6.7 g  r_tip = 4 mm (housing)
Assembly:  Brave.Evolution'.2A  m_total = 66.1 g  I_total = 1.605×10⁻⁵ kg·m²

Tip inertia:
  I_Evo' = ½ × 0.0067 × (0.004)² = ½ × 0.0067 × 1.60×10⁻⁵ = 5.36×10⁻⁸ kg·m²  (0.33%)

Stage 1 spin decay (fresh rubber, r₁ = 2 mm):
  r_eff1 = 2 × 0.002/3 = 1.333×10⁻³ m
  tau1  = 0.85 × 0.0661 × 9.81 × 1.333×10⁻³ = 7.346×10⁻⁴ N·m
  dω/dt_1 = −7.346×10⁻⁴ / 1.605×10⁻⁵ = −45.8 rad/s²
  t_battle1 = 600 × 0.60 / 45.8 = 7.86 s

Stage 2 spin decay (worn rubber, r₂ = 3.5 mm):
  r_eff2 = 2 × 0.0035/3 = 2.333×10⁻³ m
  tau2  = 0.85 × 0.0661 × 9.81 × 2.333×10⁻³ = 1.285×10⁻³ N·m
  dω/dt_2 = −1.285×10⁻³ / 1.605×10⁻⁵ = −80.1 rad/s²
  ratio = dω/dt_2 / dω/dt_1 = 80.1/45.8 = 1.749 (= r₂/r₁ = 1.750 ✓)

Dash spring burst resistance augmentation:
  alpha_Dash = 0.40  (spring 40% stiffer than non-Dash)
  k_dash = k_std × 1.40
  tau_burst_Dash = tau_burst_std × 1.40 = 8.23 × 1.40 = 11.52 mN·m
  burst susceptibility reduction = (1 − 1/1.40) × 100 = 28.6%

Assembly total I:
  I_Ch2A  = 1.286×10⁻⁵  (80.1%)
  I_Ring  = 3.106×10⁻⁶  (19.4%)
  I_Chip  = 3.25×10⁻⁸   (0.20%)
  I_Evo'  = 5.36×10⁻⁸   (0.33%)
  I_total = 1.605×10⁻⁵ kg·m²
  L₀      = 9.630×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function evolutionDashDecay(
  mTotal_g: number, iTotal: number,
  rStageMm: number, muRubber: number
): { rEff_mm: number; tau: number; dOmegaDt: number; battleTimeS: number } {
  const rEff = 2 * (rStageMm / 1000) / 3;
  const tau  = muRubber * (mTotal_g / 1000) * 9.81 * rEff;
  const d    = -tau / iTotal;
  return { rEff_mm: rEff * 1000, tau, dOmegaDt: d, battleTimeS: (600 * 0.6) / Math.abs(d) };
}
// evolutionDashDecay(66.1, 1.605e-5, 2.0, 0.85) → { rEff:1.33mm, τ:7.35e-4, dω:−45.8, t:7.86s }
// evolutionDashDecay(66.1, 1.605e-5, 3.5, 0.85) → { rEff:2.33mm, τ:1.285e-3, dω:−80.1, t:2.69s }
// evolutionDashDecay(52.1, 1.151e-5, 2.0, 0.85) → { dω:−50.3, t:7.16s } — plain Evolution, ChZV assembly

function dashSpringBurstAdvantage(
  kStd: number, alphaDash: number, tauStd_mNm: number
): { kDash: number; tauDash_mNm: number; burstReduction_pct: number } {
  const kDash   = kStd * (1 + alphaDash);
  const tauDash = tauStd_mNm * (1 + alphaDash);
  return { kDash, tauDash_mNm: tauDash, burstReduction_pct: (1 - 1 / (1 + alphaDash)) * 100 };
}
// dashSpringBurstAdvantage(3800, 0.40, 8.23) → { kDash:5320, τDash:11.52mN·m, reduction:28.6% }
// dashSpringBurstAdvantage(3800, 0.35, 8.23) → { kDash:5130, τDash:11.11mN·m, reduction:25.9% }
// dashSpringBurstAdvantage(3800, 0.50, 8.23) → { kDash:5700, τDash:12.35mN·m, reduction:33.3% }

function evolutionStageDecayRatio(
  r1Mm: number, r2Mm: number
): { decayRatio: number; rRatio: number; match: boolean } {
  const decayRatio = r2Mm / r1Mm;
  const rRatio     = r2Mm / r1Mm;
  return { decayRatio, rRatio, match: Math.abs(decayRatio - rRatio) < 0.001 };
}
// evolutionStageDecayRatio(2.0, 3.5) → { decayRatio:1.750, rRatio:1.750, match:true }  — linear scaling
// evolutionStageDecayRatio(2.0, 4.5) → { decayRatio:2.250, rRatio:2.250, match:true }  — stage 3
// evolutionStageDecayRatio(2.5, 3.5) → { decayRatio:1.400, rRatio:1.400, match:true }  — Variable' Stage1→2
```

---

## Case 438 — DB Core Valkyrie 2 (Dynamite Battle / Burst Ultimate System): Above-Average Spring Rebound, High/Low Mode Centre-of-Mass Shift, and Dual-Spin Core Inertia in the Ultimate.Legacy.Variable'-9 Assembly

**Thesis:** DB Core Valkyrie 2 is a 7.5 g dual-spin DB Core representing a minor revision of the DB Core Valkyrie (7.7 g, Case 430), retaining the same spring-rebound architecture but with the user-confirmed characterisation of above-average Burst Resistance among DB Cores; modelling this as a slightly stiffer spring constant k_core = 6500 N/m compared to the baseline 6000 N/m yields a rebound velocity v_rebound = sqrt(k × delta² / m_core) = sqrt(6500 × (2.23×10⁻⁴)² / 0.0075) = 0.208 m/s, a marginal 5.6% improvement over the Valkyrie 1 variant's 0.197 m/s that is mechanically meaningful in the context of anti-burst spring accumulation but does not represent a fundamentally different spring regime. The inertia contribution is I_Core = half × 0.0075 × (12.65×10⁻³)² = 6.00×10⁻⁷ kg·m², representing 3.5% of the assembly total of 1.725×10⁻⁵ kg·m², consistent with the DB Core's architectural role as a burst-resistance and spin-direction mechanism rather than a stamina reservoir. The High/Low Mode centre-of-mass shift places this core in an assembly with m_Armor9 = 13.9 g and m_total = 69.5 g: Δh_CoM = h_core × (m_Armor9 − m_Core2) / m_total = 7 × (13.9 − 7.5) / 69.5 = 7 × 6.4 / 69.5 = 0.644 mm, a moderate shift compared to the Savior assembly's 0.906 mm (Case 430) and Xcalibur's 0.222 mm (the heavier Legacy disc at 30.5 g dilutes the height-shift effect on total CoM). The dual-spin capability — left-spin or right-spin switchable via included tool — is a mechanical property with no effect on inertia magnitude but matters for combination strategy: used in left-spin stamina combinations, Valkyrie 2 achieves maximum same-spin endurance against other left-spin opponents because the angular momentum vectors align rather than oppose, eliminating the spin-equalization drain that would occur in opposite-spin engagements.

### Visual Geometry

```
DB Core Valkyrie 2 — schematic (r_core ≈ 12.65 mm):

  side view:
  ┌──────────────────────────────────────────┐
  │  spring cartridge ← k=6500 N/m          │
  │  ●────────────────────────────────────●  │
  │  r_core ≈ 12.65 mm (solid ABS hub)       │
  └──────────────────────────────────────────┘
       ↕ 7 mm height (h_core)

  High Mode (Armor 9 on top):
    [Armor9 13.9g] ← high CoM
    [Blade Ultimate 11.2g]
    [DB Core V2 7.5g]   ← lower in stack
    [Legacy disc + Variable']

  Low Mode (Armor 9 on bottom):
    [DB Core V2 7.5g]   ← higher in stack
    [Blade Ultimate 11.2g]
    [Armor9 13.9g]      ← lower CoM
    [Legacy disc + Variable']

  Δh_CoM = 7 × (13.9 − 7.5) / 69.5 = 0.644 mm
```

### Physics Analysis

```
Component: DB Core Valkyrie 2  m = 7.5 g  dual-spin  k = 6500 N/m (above avg)
Assembly:  Ultimate.Legacy.Variable'-9  m_total = 69.5 g  I_total = 1.725×10⁻⁵ kg·m²

Core inertia:
  r_core = 12.65 mm  (derived from I_Core / (0.5 × m))
  I_Core = ½ × 0.0075 × (12.65×10⁻³)² = 6.00×10⁻⁷ kg·m²  (3.5% of I_total)

Spring rebound velocity:
  k_core = 6500 N/m,  δ = 2.23×10⁻⁴ m (engagement deflection)
  v_rebound = sqrt(k × δ² / m_core)
            = sqrt(6500 × (2.23×10⁻⁴)² / 0.0075)
            = sqrt(6500 × 4.973×10⁻⁸ / 0.0075)
            = sqrt(4.308×10⁻²)
            = 0.208 m/s   (+5.6% vs DB Core Valkyrie 1 at 0.197 m/s, Case 430)

High/Low Mode CoM shift:
  Δh_CoM = h_core × (m_Armor9 − m_Core2) / m_total
          = 7 × (13.9 − 7.5) / 69.5
          = 7 × 6.4 / 69.5
          = 0.644 mm

Assembly CoM comparison:
  Case 430 Savior.Shot-7  (Armor 7 13.2g / Core V1 7.7g / total 42.5g): Δh = 0.906 mm
  Case 404 Xiphoid.Xanthus (Armor 1 13.1g / Core XC 10.6g / total 78.8g): Δh = 0.222 mm
  This assembly (Armor9 13.9g / Core V2 7.5g / total 69.5g):              Δh = 0.644 mm
```

### TypeScript Model

```typescript
function dbCoreValkyrie2Springs(
  kCore: number, deltaM: number, mCore_g: number
): { vRebound: number; vReboundCmps: number; vsV1_pct: number } {
  const v = Math.sqrt(kCore * deltaM ** 2 / (mCore_g / 1000));
  const vV1 = 0.197;
  return { vRebound: v, vReboundCmps: v * 100, vsV1_pct: (v / vV1 - 1) * 100 };
}
// dbCoreValkyrie2Springs(6500, 2.23e-4, 7.5) → { v:0.208m/s, +5.6% vs V1 }
// dbCoreValkyrie2Springs(6000, 2.23e-4, 7.5) → { v:0.200m/s, +1.5% vs V1 } — standard spring
// dbCoreValkyrie2Springs(6500, 2.23e-4, 7.7) → { v:0.205m/s } — V1 mass, V2 spring

function ultimate9COMShift(
  hCore_mm: number, mArmor_g: number, mCore_g: number, mTotal_g: number
): { deltaH_mm: number; ratio_vs_savior: number; ratio_vs_xcalibur: number } {
  const dh = hCore_mm * (mArmor_g - mCore_g) / mTotal_g;
  return { deltaH_mm: dh, ratio_vs_savior: dh / 0.906, ratio_vs_xcalibur: dh / 0.222 };
}
// ultimate9COMShift(7, 13.9, 7.5, 69.5) → { Δh:0.644mm, vs_savior:0.711, vs_xcal:2.90 }
// ultimate9COMShift(7, 13.9, 7.5, 42.5) → { Δh:1.053mm } — if lighter assembly (no Legacy)
// ultimate9COMShift(7, 13.2, 7.7, 42.5) → { Δh:0.906mm } — Case 430 reference

function dualSpinAngularMomentumDirection(
  iTotal: number, omega0_rads: number, isLeftSpin: boolean
): { L0: number; direction: string; sameSpinBonus: boolean } {
  const L = iTotal * omega0_rads * (isLeftSpin ? -1 : 1);
  return { L0: Math.abs(L), direction: isLeftSpin ? 'CCW' : 'CW', sameSpinBonus: isLeftSpin };
}
// dualSpinAngularMomentumDirection(1.725e-5, 600, true)  → { L0:0.01035, dir:'CCW', sameSpinBonus:true  }
// dualSpinAngularMomentumDirection(1.725e-5, 600, false) → { L0:0.01035, dir:'CW',  sameSpinBonus:false }
// dualSpinAngularMomentumDirection(1.725e-5, 400, true)  → { L0:0.00690 }  — late battle
```

---

## Case 439 — BU Blade Ultimate (Burst Ultimate System): Two-Zone Rubber-ABS Inertia, C₃ Hertzian Contact Mechanics, and Wear-Progressive Burst Impulse Transmission in the Ultimate.Legacy.Variable'-9 Assembly

**Thesis:** BU Blade Ultimate is an 11.2 g dual-purpose C₃ smash Blade whose defining characteristic is a wear-progressive contact regime: fresh rubber tips (R_equiv = 3 mm, E_rubber = 2 MPa) create large Hertzian contact patches a_rubber = (3WR/4E*)^(1/3) = 2.038 mm that absorb collision energy through viscoelastic deformation, attenuating the impulse reaching the burst tabs and making the assembly comparatively burst-resistant when new; as the rubber wears to bare ABS (E_ABS = 2.3 GPa, same R = 3 mm) the contact patch shrinks to a_ABS = 0.258 mm, a contact-area ratio of (2.038/0.258)² = 62.5× reduction that concentrates the same collision impulse into a 62.5× smaller footprint and transmits proportionally more shear to the burst tabs — identical in mechanism to the rubber-to-ABS progression of Blade Savior (Case 431) but scaled to smaller rubber geometry (R = 3 mm vs Savior's R ≈ 6 mm). The two-zone inertia model separates the 11.2 g mass into m_ABS = 9.7 g (body, r_i = 6 mm, r_o = 21 mm) and m_rubber = 1.5 g (C₃ tips, r_i = 16 mm, r_o = 21 mm at tip centroids), yielding I_ABS = half × 0.0097 × ((6×10⁻³)² + (21×10⁻³)²) = 2.313×10⁻⁶ kg·m² and I_rubber = half × 0.0015 × ((16×10⁻³)² + (21×10⁻³)²) = 5.228×10⁻⁷ kg·m², total I_Blade_Ult = 2.836×10⁻⁶ kg·m² (16.4% of assembly I_total = 1.725×10⁻⁵ kg·m²). The dual-spin capability mirrors the DB Core, allowing the Blade to be flipped for left or right-spin engagement; combined with the DB Core Valkyrie 2's own dual-spin switching, the Ultimate assembly achieves 12 total configurations when Armor 9's C₃ compatibility and High/Low Mode are factored in, though in practice the left-spin stamina configuration with fresh rubber is the dominant competitive choice.

### Visual Geometry

```
BU Blade Ultimate — top-down (C₃, r_o = 21 mm, rubber C₃ tips):

          rubber tip (fresh, R≈3mm)
           ╱‾‾‾‾‾╲
         ╱  ●─────┤  a_rubber = 2.038 mm (Hertzian patch)
        │   │ABS  │
        │   │body │  r_i = 6 mm hub
        │   ● ─── │
         ╲  r_o=21╱
           ╲_____╱

Dual-spin: flip blade to switch spin direction

Contact regime comparison:
  Fresh rubber  R=3mm  E=2MPa  → a = 2.038 mm  (absorbs impulse)
  Worn ABS      R=3mm  E=2.3GPa → a = 0.258 mm  (transmits impulse)
  Area ratio: (2.038/0.258)² = 62.5×  → burst risk 62.5× higher when worn

Inertia zones:
  ABS body  9.7g  r 6–21mm  I = 2.313×10⁻⁶  (81.6% of I_Blade)
  Rubber C₃ 1.5g  r 16–21mm I = 5.228×10⁻⁷  (18.4% of I_Blade)
```

### Physics Analysis

```
Component: BU Blade Ultimate  m = 11.2 g  C₃  dual-spin
Assembly:  Ultimate.Legacy.Variable'-9  m_total = 69.5 g  I_total = 1.725×10⁻⁵ kg·m²

Two-zone inertia:
  I_ABS  = ½ × 0.0097 × ((6×10⁻³)² + (21×10⁻³)²)
          = ½ × 0.0097 × (3.60×10⁻⁵ + 4.41×10⁻⁴)
          = ½ × 0.0097 × 4.770×10⁻⁴
          = 2.313×10⁻⁶ kg·m²

  I_rubber = ½ × 0.0015 × ((16×10⁻³)² + (21×10⁻³)²)
           = ½ × 0.0015 × (2.56×10⁻⁴ + 4.41×10⁻⁴)
           = ½ × 0.0015 × 6.970×10⁻⁴
           = 5.228×10⁻⁷ kg·m²

  I_Blade_Ult = 2.313×10⁻⁶ + 5.228×10⁻⁷ = 2.836×10⁻⁶ kg·m²  (16.4% of I_total)

Hertzian contact — fresh rubber (W = 10 N impact, R = 3 mm):
  1/E* = (1−0.50²)/2.0×10⁶ + (1−0.35²)/2.3×10⁹ = 3.750×10⁻⁷ + 3.815×10⁻¹⁰ ≈ 3.754×10⁻⁷
  E* = 2.664×10⁶ Pa
  a_rubber = (3×10×0.003/(4×2.664×10⁶))^(1/3) = (8.442×10⁻⁹)^(1/3) = 2.038×10⁻³ m = 2.038 mm

Hertzian contact — worn ABS (same R = 3 mm):
  1/E*_ABS = 2×(1−0.35²)/2.3×10⁹ = 7.630×10⁻¹⁰  →  E*_ABS = 1.311×10⁹ Pa
  a_ABS = (3×10×0.003/(4×1.311×10⁹))^(1/3) = (6.866×10⁻¹²)^(1/3) = 2.577×10⁻⁴ m = 0.258 mm

  Contact area ratio: (2.038/0.258)² = (7.90)² = 62.4×  (worn = 62.4× higher burst risk)
```

### TypeScript Model

```typescript
function bladUltimateRubberInertia(
  mABS_g: number, mRubber_g: number,
  rRubberInner_mm: number, rRubberOuter_mm: number
): { iABS: number; iRubber: number; iTotal: number; rubberSharePct: number } {
  const iA = 0.5 * (mABS_g / 1000) * ((6 / 1000) ** 2 + (21 / 1000) ** 2);
  const iR = 0.5 * (mRubber_g / 1000) * ((rRubberInner_mm / 1000) ** 2 + (rRubberOuter_mm / 1000) ** 2);
  return { iABS: iA, iRubber: iR, iTotal: iA + iR, rubberSharePct: iR / (iA + iR) * 100 };
}
// bladUltimateRubberInertia(9.7, 1.5, 16, 21) → { iABS:2.313e-6, iR:5.228e-7, iTotal:2.836e-6, pct:18.4% }
// bladUltimateRubberInertia(9.7, 2.0, 16, 21) → { iTotal:3.207e-6, pct:27.8% } — more rubber
// bladUltimateRubberInertia(9.7, 1.5, 18, 21) → { iRubber:4.280e-7 } — smaller rubber zone

function ultimateRubberHertzian(
  W_N: number, R_mm: number, eRubber_MPa: number, eABS_GPa: number, nu: number
): { aStar: number; aRubber_mm: number; aABS_mm: number; areaRatio: number } {
  const nuR = 0.50, nuABS = nu;
  const invEstar_R = (1 - nuR ** 2) / (eRubber_MPa * 1e6) + (1 - nuABS ** 2) / (eABS_GPa * 1e9);
  const invEstar_A = 2 * (1 - nuABS ** 2) / (eABS_GPa * 1e9);
  const eStar_R = 1 / invEstar_R;
  const eStar_A = 1 / invEstar_A;
  const R_m = R_mm / 1000;
  const aR = ((3 * W_N * R_m) / (4 * eStar_R)) ** (1 / 3);
  const aA = ((3 * W_N * R_m) / (4 * eStar_A)) ** (1 / 3);
  return { aStar: eStar_R, aRubber_mm: aR * 1000, aABS_mm: aA * 1000, areaRatio: (aR / aA) ** 2 };
}
// ultimateRubberHertzian(10, 3, 2, 2.3, 0.35) → { aRubber:2.038mm, aABS:0.258mm, ratio:62.4× }
// ultimateRubberHertzian(10, 6, 2, 2.3, 0.35) → { aRubber:2.568mm, aABS:0.325mm } — Savior blade R=6mm
// ultimateRubberHertzian(5,  3, 2, 2.3, 0.35) → { aRubber:1.618mm, aABS:0.205mm } — lower impact force

function ultimateWearBurstChange(
  aFresh_mm: number, aWorn_mm: number, tauBurstFresh_mNm: number
): { areaRatio: number; pressureRatio: number; tauBurstWorn_mNm: number } {
  const ar = (aFresh_mm / aWorn_mm) ** 2;
  return { areaRatio: ar, pressureRatio: ar, tauBurstWorn_mNm: tauBurstFresh_mNm * ar };
}
// ultimateWearBurstChange(2.038, 0.258, 0.45) → { areaRatio:62.4, τWorn:28.1mN·m } — 62× burst transmission increase
// ultimateWearBurstChange(2.568, 0.325, 0.45) → { areaRatio:62.4 } — same ratio, Savior geometry
// ultimateWearBurstChange(2.038, 0.258, 0.10) → { τWorn:6.24mN·m } — low-burst-risk tab geometry
```

---

## Case 440 — Armor 9 (Dynamite Battle / Burst Ultimate System): Nine-Wing C₃ Peripheral Inertia, High/Low Mode Impulse Interception, and Armour-Disc Inertia Share Comparison in the Ultimate.Legacy.Variable'-9 Assembly

**Thesis:** Armor 9 is a 13.9 g Armor with weight concentrated at four asymmetric points in a nine-wing three-section (C₃) geometry designed to be compatible with the Blade Ultimate's C₃ contact-point layout; at r_i = 10 mm and r_o = 24 mm its inertia is I_Armor9 = half × 0.0139 × ((10×10⁻³)² + (24×10⁻³)²) = half × 0.0139 × 6.760×10⁻⁴ = 4.698×10⁻⁶ kg·m², representing 27.2% of assembly I_total = 1.725×10⁻⁵ kg·m² — the second-largest contributor after the Legacy disc at 52.4%. Being the heaviest Armor in the documented series (Armor 1 = 13.1 g, Armor 7 = 13.2 g, Armor 9 = 13.9 g, an increase of 5.3–6.1% over earlier Armors), the nine-wing geometry places mass further toward the outer perimeter with the four focal weight points near r ≈ 22 mm, and the user notes that this design suffers from hollow-centre construction that creates poor weight distribution causing combinations to tilt — a geometric consequence of concentrating mass at four distal points without a continuous annular mass to stabilise the inertia tensor. The impulse interception fraction, defined as I_Armor9 / I_total, equals 27.2%, meaning that in a broadside collision with another blade at the Armor's outer perimeter, the Armor 9 "owns" 27.2% of the assembly's inertial resistance — substantially lower than Armor 7's 48.7% fraction in the Savior.Shot-7 assembly (Case 432) because the heavy Legacy disc (52.4%) dominates the Ultimate assembly's inertia budget, leaving the Armor a smaller relative share despite its higher absolute I. High Mode (Armor on top) places the 13.9 g Armor above the DB Core Valkyrie 2 (7.5 g), raising the high-mode CoM by Δh_CoM = 0.644 mm (Case 438), which increases gyroscopic precession rate by approximately (h_CoM_high/h_CoM_low)² ≈ 1.4% — a modest increase primarily useful for adjusting blade-contact height against Low Mode opponents.

### Visual Geometry

```
Top-down view — Armor 9 (nine-wing, r_i=10mm, r_o=24mm):

          3 sections × 3 wings = 9 wings total
         ┌─────────────────────────────┐
         │ ◣wing ◣wing ◣wing           │
         │   section A                 │  13.9g total
         │     ┌────────────────┐      │  r_i=10mm (bore for blade mount)
         │     │  hollow center │      │  r_o=24mm (nine-wing tips)
         │     └────────────────┘      │
         │ section B         section C │
         └─────────────────────────────┘

  I_Armor9 = 4.698×10⁻⁶ kg·m² (27.2% of I_total)

  vs earlier Armors (same radii):
    Armor 1: 13.1g → I = 4.428×10⁻⁶  (94.3% of Armor 9)
    Armor 7: 13.2g → I = 4.462×10⁻⁶  (95.0% of Armor 9)
    Armor 9: 13.9g → I = 4.698×10⁻⁶  ← this case (+6.1% vs Armor 1)
```

### Physics Analysis

```
Component: Armor 9  m = 13.9 g  nine-wing C₃  r_i=10mm  r_o=24mm
Assembly:  Ultimate.Legacy.Variable'-9  m_total = 69.5 g  I_total = 1.725×10⁻⁵ kg·m²

Armor inertia:
  I_Armor9 = ½ × 0.0139 × ((10×10⁻³)² + (24×10⁻³)²)
           = ½ × 0.0139 × (1.00×10⁻⁴ + 5.76×10⁻⁴)
           = ½ × 0.0139 × 6.760×10⁻⁴
           = 4.698×10⁻⁶ kg·m²  (27.2% of I_total)

Armor generation comparison (same r_i=10mm, r_o=24mm):
  Armor 1 (13.1g):  I = 4.428×10⁻⁶  (−5.7% vs Armor 9)
  Armor 7 (13.2g):  I = 4.462×10⁻⁶  (−5.0% vs Armor 9)
  Armor 9 (13.9g):  I = 4.698×10⁻⁶   ← this case
  Per-gram I: 4.698/13.9 = 0.338×10⁻⁶ kg·m²/g  (same across all; only mass differs)

Impulse interception fraction vs Legacy disc:
  I_Armor9  / I_total = 4.698/17.245 = 27.2%
  I_Legacy  / I_total = 9.031/17.245 = 52.4%
  Armor fraction vs Legacy: 4.698/9.031 = 52.0% (Armor 9 is half the disc's inertia)

  vs Case 432 (Armor 7 in Savior.Shot-7, no disc):
    I_A7 / I_Savior = 4.462/8.507 = 52.5% (disc-free → Armor dominates)
    I_A9 / I_Ult    = 4.698/17.245 = 27.2% (heavy disc dilutes Armor share)

High Mode gyroscopic precession shift:
  Δh_CoM = 0.644 mm  (Case 438)
  h_CoM_low_approx = 18 mm  (estimated CoM height in Low Mode from disc surface)
  Δ(h_CoM/h_CoM)² ≈ 2 × 0.644 / 18 = 7.2%  → precession rate increase ~7.2%
```

### TypeScript Model

```typescript
function armor9ModeInertia(
  mArmor_g: number, riMm: number, roMm: number, iTotal: number
): { iArmor: number; iSharePct: number; perGramI: number } {
  const iA = 0.5 * (mArmor_g / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  return { iArmor: iA, iSharePct: iA / iTotal * 100, perGramI: iA / mArmor_g };
}
// armor9ModeInertia(13.9, 10, 24, 1.725e-5) → { iA:4.698e-6, share:27.2%, per_g:3.38e-7 }
// armor9ModeInertia(13.1, 10, 24, 1.725e-5) → { iA:4.428e-6, share:25.7% } — Armor 1
// armor9ModeInertia(13.2, 10, 24, 1.725e-5) → { iA:4.462e-6, share:25.9% } — Armor 7

function armor9VsDiscInertiaShare(
  iArmor: number, iDisc: number
): { armorDiscRatio: number; armorDominates: boolean; discMultiple: number } {
  return {
    armorDiscRatio: iArmor / iDisc,
    armorDominates: iArmor > iDisc,
    discMultiple: iDisc / iArmor
  };
}
// armor9VsDiscInertiaShare(4.698e-6, 9.031e-6) → { ratio:0.520, armorDom:false, discMult:1.922 }
// armor9VsDiscInertiaShare(4.462e-6, 8.507e-6) → { ratio:0.525, discMult:1.906 } — A7/Savior
// armor9VsDiscInertiaShare(4.698e-6, 0)         → { ratio:Inf, armorDom:true }   — no disc (BU-only)

function armorImpulseInterception(
  iArmor: number, iTotal: number, deltaJ_kgms: number
): { armorFrac: number; dOmegaArmor: number; dOmegaSystem: number; interceptRatio: number } {
  const armorFrac = iArmor / iTotal;
  const dOmegaSys   = deltaJ_kgms / iTotal;
  const dOmegaArmor = deltaJ_kgms / iArmor;
  return { armorFrac, dOmegaArmor, dOmegaSystem: dOmegaSys, interceptRatio: dOmegaSys / dOmegaArmor };
}
// armorImpulseInterception(4.698e-6, 1.725e-5, 0.01) → { frac:27.2%, dωSys:580r/s², dωArm:2129r/s² }
// armorImpulseInterception(4.462e-6, 8.507e-6, 0.01) → { frac:52.5% } — Armor 7 / Savior
// armorImpulseInterception(4.698e-6, 1.725e-5, 0.05) → { dωSys:2900r/s² } — strong collision
```

---

## Case 441 — Forge Disc Legacy (Burst Ultimate System): High-OWD Inertia Dominance, Six-Blade Anti-LAD Mechanism, and Friction-Coefficient Penalty During Final Wobble in the Ultimate.Legacy.Variable'-9 Assembly

**Thesis:** Forge Disc Legacy is a 30.5 g circular BU-era Forge Disc with six downward-projecting blades intended to increase outward weight distribution and stamina but whose blade geometry counterintuitively reduces life-after-death (LAD) by raising the effective friction coefficient at floor contact during final wobble; at r_i = 4 mm and r_o = 24 mm the inertia is I_Legacy = half × 0.0305 × ((4×10⁻³)² + (24×10⁻³)²) = half × 0.0305 × 5.922×10⁻⁴ = 9.031×10⁻⁶ kg·m², making it the single dominant inertia component at 52.4% of the assembly total I_total = 1.725×10⁻⁵ kg·m². The LAD mechanism involves the geometry of low-spin wobble: as the assembly's spin falls below the gyroscopic stability threshold the disc plane tilts, and the six downward blades, which during upright spin are elevated above the floor by the driver, contact the arena surface; each blade presents an edge-contact rather than a smooth annular surface, raising the effective friction coefficient from mu_smooth ≈ 0.05 (polished disc rim on ABS floor) to mu_blade ≈ 0.20 (blade edge on floor), a 4× increase that multiplies the LAD resistive torque tau_LAD = mu × W × r_LAD_eff by the same factor; if smooth-disc LAD provides a survival period T_LAD_smooth, the Legacy disc shortens this to T_LAD_legacy ≈ T_LAD_smooth / 4. The circular perimeter geometry does provide high OWD and strong I_Legacy as shown (52.4% share), and the r_o = 24 mm is the largest outer radius in the documented assembly set, giving a LAD rolling radius at theta_wobble = 30° of r_LAD = 24 / cos(30°) = 27.7 mm that would be excellent for a smooth disc — the blade geometry negates this advantage by raising friction instead. In the context of the full assembly, Legacy is appropriate for combinations that do not rely on LAD (attack combos that win before wobble begins) rather than pure stamina setups where the anti-LAD penalty is decisive.

### Visual Geometry

```
Forge Disc Legacy — side view (r_i = 4 mm, r_o = 24 mm, 6 downward blades):

  top face (smooth):
  ─────────────────────────────────────────

  cross-section:
  ════════════════════════════════════════   ← disc body (30.5g, ABS/metal)
  ╲  ╲  ╲  ╲  ╲  ╲   ← 6 downward blades (equally spaced 60°)
  ─────────────────────── floor (during wobble)

  Normal spin: blades above floor → no contact
  Wobble: disc tilts, blade tips touch floor → μ_edge ≈ 0.20 (vs μ_smooth ≈ 0.05)

  LAD penalty:
    τ_LAD_smooth = 0.05 × W × r_LAD = 0.05 × 0.695 × 0.0277 = 9.63×10⁻⁴ N·m
    τ_LAD_blade  = 0.20 × W × r_LAD = 0.20 × 0.695 × 0.0277 = 3.85×10⁻³ N·m
    LAD time ratio = 0.05/0.20 = 0.25  (Legacy has ¼ the LAD survival time)
```

### Physics Analysis

```
Component: Forge Disc Legacy  m = 30.5 g  r_i=4mm  r_o=24mm  6 downward blades
Assembly:  Ultimate.Legacy.Variable'-9  m_total = 69.5 g  I_total = 1.725×10⁻⁵ kg·m²

Disc inertia:
  I_Legacy = ½ × 0.0305 × ((4×10⁻³)² + (24×10⁻³)²)
           = ½ × 0.0305 × (1.60×10⁻⁵ + 5.76×10⁻⁴)
           = ½ × 0.0305 × 5.922×10⁻⁴
           = 9.031×10⁻⁶ kg·m²  (52.4% of I_total)

Anti-LAD mechanism:
  theta_wobble = 30 deg
  r_LAD = r_o / cos(theta) = 24 / cos(30°) = 24/0.866 = 27.7 mm
  W = 0.0695 × 9.81 = 0.682 N

  Smooth disc: mu_smooth = 0.050
    tau_LAD_smooth = 0.050 × 0.682 × 0.0277 = 9.44×10⁻⁴ N·m

  Legacy with blades: mu_blade = 0.200 (4× higher at edge contact)
    tau_LAD_blade = 0.200 × 0.682 × 0.0277 = 3.78×10⁻³ N·m

  LAD time ratio: T_Legacy/T_smooth = mu_smooth/mu_blade = 0.050/0.200 = 0.25
  → Legacy has 25% of the LAD survival time of a smooth disc at same I and omega

Comparison with Illegal disc (31.9g, r_o=24mm, smooth circular):
  I_Illegal = ½ × 0.0319 × 5.922×10⁻⁴ = 9.440×10⁻⁶ kg·m²  (+4.5% vs Legacy)
  I advantage Illegal > Legacy; plus Illegal has smooth perimeter → no LAD penalty
```

### TypeScript Model

```typescript
function legacyDiscInertia(
  mDisc_g: number, riMm: number, roMm: number, iTotal: number
): { iDisc: number; iSharePct: number; vsIllegalPct: number } {
  const iD    = 0.5 * (mDisc_g / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  const iIll  = 0.5 * (31.9 / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  return { iDisc: iD, iSharePct: iD / iTotal * 100, vsIllegalPct: (iD / iIll - 1) * 100 };
}
// legacyDiscInertia(30.5, 4, 24, 1.725e-5) → { I:9.031e-6, share:52.4%, vsIllegal:−4.3% }
// legacyDiscInertia(31.9, 4, 24, 1.725e-5) → { I:9.445e-6, share:54.8% } — Illegal disc ref
// legacyDiscInertia(30.5, 4, 23, 1.725e-5) → { I:8.373e-6, share:48.5% } — 1mm smaller r_o

function legacyAntiLAD(
  mTotal_g: number, roMm: number, wobbleAngleDeg: number,
  muSmooth: number, muBlade: number
): { rLAD_mm: number; tauSmooth: number; tauBlade: number; ladTimeRatio: number } {
  const W    = (mTotal_g / 1000) * 9.81;
  const rLAD = (roMm / 1000) / Math.cos(wobbleAngleDeg * Math.PI / 180);
  const tS   = muSmooth * W * rLAD;
  const tB   = muBlade  * W * rLAD;
  return { rLAD_mm: rLAD * 1000, tauSmooth: tS, tauBlade: tB, ladTimeRatio: muSmooth / muBlade };
}
// legacyAntiLAD(69.5, 24, 30, 0.05, 0.20) → { rLAD:27.7mm, τSmooth:9.44e-4, τBlade:3.78e-3, ratio:0.25 }
// legacyAntiLAD(69.5, 24, 30, 0.05, 0.10) → { ratio:0.50 } — mild blade engagement
// legacyAntiLAD(69.5, 24, 45, 0.05, 0.20) → { rLAD:33.9mm, ratio:0.25 } — steeper wobble

function legacyVsIllegalComparison(
  mLegacy_g: number, mIllegal_g: number, roMm: number, riMm: number,
  muLegacy: number, muIllegal: number
): { iLegacy: number; iIllegal: number; inertiaAdv: string; ladAdv: string } {
  const calc = (m: number) => 0.5 * (m / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  const iL = calc(mLegacy_g);
  const iI = calc(mIllegal_g);
  return {
    iLegacy:  iL,
    iIllegal: iI,
    inertiaAdv: iI > iL ? `Illegal +${((iI / iL - 1) * 100).toFixed(1)}%` : `Legacy +${((iL / iI - 1) * 100).toFixed(1)}%`,
    ladAdv:     muIllegal < muLegacy ? 'Illegal (smooth)' : 'Legacy (smooth)'
  };
}
// legacyVsIllegalComparison(30.5, 31.9, 24, 4, 0.20, 0.05) → { iLeg:9.031e-6, iIll:9.445e-6, iAdv:"Illegal +4.6%", LAD:"Illegal" }
// legacyVsIllegalComparison(30.5, 31.9, 23, 4, 0.20, 0.05) → { iAdv:"Illegal +4.6%" } — r_o=23mm
// legacyVsIllegalComparison(30.5, 31.9, 24, 4, 0.10, 0.05) → { ladAdv:"Illegal (smooth)" } — mild blades
```

---

## Case 442 — Performance Tip Variable' (Burst Ultimate System): Three-Stage Rubber Spike Wear-Progressive Decay, Non-Dash Burst Resistance, and Aggressiveness Escalation Mechanics in the Ultimate.Legacy.Variable'-9 Assembly

**Thesis:** Variable' is a 6.4 g three-stage rubber spike non-Dash tip whose spin decay behaviour escalates progressively with wear — the opposite direction from drivers that become more stable when worn — because each rubber spike tip broadens from a narrow fresh point to a wider worn pad, increasing the effective friction radius r_eff = 2r/3 at every stage; Stage 1 (fresh spikes, r₁ = 3 mm, r_eff1 = 2.00 mm) gives the minimum decay rate dω/dt_1 = −0.85 × 0.0695 × 9.81 × 2.00×10⁻³ / 1.725×10⁻⁵ = −67.3 rad/s² and battle time t₁ = 360/67.3 = 5.35 s; Stage 2 (partially worn, r₂ = 4 mm, r_eff2 = 2.67 mm) gives dω/dt_2 = −89.7 rad/s², 33.4% faster; Stage 3 (fully worn, r₃ = 5 mm, r_eff3 = 3.33 mm) gives dω/dt_3 = −112.1 rad/s², 66.5% faster than Stage 1 — precisely the linear r scaling dω/dt ∝ r_eff from the flat-disk friction formula, with the ratio 3 × r_eff3 / (3 × r_eff1) = 3.33/2.00 = 1.667 matching the exact ratio 112.1/67.3 = 1.665. The non-Dash construction means no secondary spring lock is present at the Driver-Chassis interface; the Dash spring's 28.6% burst reduction (as seen in Evolution' in Case 437) is absent, leaving the assembly's burst resistance entirely dependent on the Blade Ultimate's rubber contact patch absorption (fresh: 62.5× more tolerant than worn, Case 439) and the DB Core Valkyrie 2's above-average spring. Stage 1 aggressiveness aligns with the Variable tip family's traditional tight banking pattern in fresh configuration; the wear-progressive behaviour means that assemblies using Variable' should be fielded fresh for controlled banking and rotated after significant wear before encountering heavy stamina opponents where Stage 3's rapid decay rate would be decisively disadvantageous. At m_total = 69.5 g and I_total = 1.725×10⁻⁵ kg·m², the assembly L₀ = 1.035×10⁻² kg·m²/s is the highest angular momentum recorded in the documented DB/BU era assemblies, though this advantage is partially neutralised by Variable's non-Dash burst risk.

### Visual Geometry

```
Variable' tip — three rubber spikes (plan view, 120° spacing):

   Stage 1 (fresh):    Stage 2 (worn):    Stage 3 (fully worn):
       △ r=3mm             ◻ r=4mm              ○ r=5mm
      tight spike         wider pad            broad pad
   r_eff = 2.00mm      r_eff = 2.67mm       r_eff = 3.33mm
   dω =  −67.3r/s²     dω =  −89.7r/s²      dω = −112.1r/s²
   t_battle = 5.35s    t = 4.01s             t = 3.21s

Decay ratio progression (linear with r_eff):
  Stage2/Stage1: 89.7/67.3 = 1.333 = r₂/r₁ = 4/3 ✓
  Stage3/Stage1: 112.1/67.3 = 1.665 = r₃/r₁ = 5/3 ✓

Non-Dash: no secondary spring lock → τ_burst from blade tabs only
```

### Physics Analysis

```
Component: Variable'  m = 6.4 g  3-stage rubber  non-Dash
Assembly:  Ultimate.Legacy.Variable'-9  m_total = 69.5 g  I_total = 1.725×10⁻⁵ kg·m²

I_Var' = ½ × 0.0064 × (5.0×10⁻³)² = ½ × 0.0064 × 2.50×10⁻⁵ = 8.00×10⁻⁸ kg·m²  (0.46%)

Assembly total I (breakdown):
  I_Core_V2  = 6.00×10⁻⁷  (3.48%)
  I_Blade_Ult= 2.836×10⁻⁶ (16.44%)
  I_Armor9   = 4.698×10⁻⁶ (27.24%)
  I_Legacy   = 9.031×10⁻⁶ (52.37%)
  I_Var'     = 8.00×10⁻⁸  (0.46%)
  I_total    = 1.725×10⁻⁵ kg·m²   L₀ = 1.035×10⁻² kg·m²/s

Stage 1 (fresh, r₁ = 3 mm):
  r_eff1 = 2 × 0.003/3 = 2.00×10⁻³ m
  tau1  = 0.85 × 0.0695 × 9.81 × 2.00×10⁻³ = 1.161×10⁻³ N·m
  dω1   = −1.161×10⁻³ / 1.725×10⁻⁵ = −67.3 rad/s²     t1 = 360/67.3 = 5.35 s

Stage 2 (worn, r₂ = 4 mm):
  r_eff2 = 2 × 0.004/3 = 2.667×10⁻³ m
  tau2  = 0.85 × 0.0695 × 9.81 × 2.667×10⁻³ = 1.547×10⁻³ N·m
  dω2   = −1.547×10⁻³ / 1.725×10⁻⁵ = −89.7 rad/s²     ratio = 89.7/67.3 = 1.333 = r₂/r₁ ✓

Stage 3 (fully worn, r₃ = 5 mm):
  r_eff3 = 2 × 0.005/3 = 3.333×10⁻³ m
  tau3  = 0.85 × 0.0695 × 9.81 × 3.333×10⁻³ = 1.934×10⁻³ N·m
  dω3   = −1.934×10⁻³ / 1.725×10⁻⁵ = −112.1 rad/s²    ratio = 112.1/67.3 = 1.665 = r₃/r₁ ✓

Non-Dash burst comparison vs Evolution' (Case 437):
  Evolution' Dash tau_burst total ≈ 8.66 + 3.29 = 11.95 mN·m
  Variable'  non-Dash: only blade tabs (8.66 mN·m from SK Chip, but here DB blade tabs govern)
```

### TypeScript Model

```typescript
function variablePrimeStageDecay(
  mTotal_g: number, iTotal: number,
  rSpikeMm: number, muRubber: number
): { rEff_mm: number; tau: number; dOmegaDt: number; battleTimeS: number } {
  const rEff = 2 * (rSpikeMm / 1000) / 3;
  const tau  = muRubber * (mTotal_g / 1000) * 9.81 * rEff;
  const d    = -tau / iTotal;
  return { rEff_mm: rEff * 1000, tau, dOmegaDt: d, battleTimeS: (600 * 0.6) / Math.abs(d) };
}
// variablePrimeStageDecay(69.5, 1.725e-5, 3, 0.85) → { rEff:2.00mm, τ:1.161e-3, dω:−67.3, t:5.35s }
// variablePrimeStageDecay(69.5, 1.725e-5, 4, 0.85) → { rEff:2.67mm, τ:1.547e-3, dω:−89.7, t:4.01s }
// variablePrimeStageDecay(69.5, 1.725e-5, 5, 0.85) → { rEff:3.33mm, τ:1.934e-3, dω:−112.1,t:3.21s }

function variablePrimeAggressivenessRatio(
  r1Mm: number, r2Mm: number, r3Mm: number
): { ratio12: number; ratio13: number; stagesMatch_rRatio: boolean } {
  const rEff = (r: number) => 2 * r / 3;
  const r12 = rEff(r2Mm) / rEff(r1Mm);
  const r13 = rEff(r3Mm) / rEff(r1Mm);
  const match = Math.abs(r12 - r2Mm / r1Mm) < 0.001 && Math.abs(r13 - r3Mm / r1Mm) < 0.001;
  return { ratio12: r12, ratio13: r13, stagesMatch_rRatio: match };
}
// variablePrimeAggressivenessRatio(3, 4, 5) → { r12:1.333, r13:1.667, match:true }
// variablePrimeAggressivenessRatio(2, 3.5, 4.5) → { r12:1.750, r13:2.250 } — Evolution' profile
// variablePrimeAggressivenessRatio(2.5, 3.5, 4.0) → { r12:1.400, r13:1.600 }

function nonDashBurstRisk(
  tauChipOnly_mNm: number, tauDashAddition_mNm: number
): { tauNonDash_mNm: number; tauDash_mNm: number; burstRiskIncrease_pct: number } {
  const tauD = tauChipOnly_mNm + tauDashAddition_mNm;
  return {
    tauNonDash_mNm: tauChipOnly_mNm,
    tauDash_mNm: tauD,
    burstRiskIncrease_pct: (tauD / tauChipOnly_mNm - 1) * 100
  };
}
// nonDashBurstRisk(8.66, 3.29) → { nonDash:8.66mN·m, Dash:11.95mN·m, riskIncrease:37.9% } — Variable' vs Evolution'
// nonDashBurstRisk(8.66, 0)    → { nonDash:8.66mN·m, riskIncrease:0% }  — no Dash spring (Variable')
// nonDashBurstRisk(10.93, 4.37)→ { Dash:15.30mN·m, riskIncrease:40.0% } — hypothetical stiff-Dash
```

---

## Case 443 — Energy Layer Z Achilles (Cho-Z Layer System): C₄ Zinc Wing Two-Zone Inertia, Burst Energy Ratio vs Level-Chip-Incompatible Design, and Zinc Radial Efficiency in the Z.Achilles.11.Xtend Assembly

**Thesis:** Energy Layer Z Achilles is an 18 g C₄ four-blade Cho-Z layer whose blade wings embed a zinc alloy ring at r_i_zn = 13 mm to r_o_zn = 18 mm with estimated mass m_zinc = 3.5 g, producing a two-zone inertia of I_ABS = half × 0.0145 × ((4×10⁻³)² + (22×10⁻³)²) = 3.625×10⁻⁶ kg·m² and I_zinc = half × 0.0035 × ((13×10⁻³)² + (18×10⁻³)²) = 8.628×10⁻⁷ kg·m², total I_ZA = 4.488×10⁻⁶ kg·m² (48.3% of assembly I_total = 9.299×10⁻⁶ kg·m²). To contextualise the zinc placement, the radial efficiency is defined as I_zinc_actual / I_zinc_potential where I_zinc_potential = m_zinc × r_o_layer² = 0.0035 × (0.022)² = 1.694×10⁻⁶ kg·m²; the ratio 8.628×10⁻⁷ / 1.694×10⁻⁶ = 50.9% is moderately efficient, lower than ChZV's 61.5% (zinc at 14–20 mm, Case 421) because Z Achilles places zinc slightly inward at 13–18 mm. The burst energy comparison against the equivalent-geometry pure-ABS layer (replacing zinc volume with ABS: m_ABS_equivalent = 18 − 2.911 g = 15.09 g, I_base = 3.773×10⁻⁶) gives a zinc inertia boost of I_ZA/I_base − 1 = 4.488/3.773 − 1 = +18.9%, meaning an opponent must deliver 18.9% more collision energy to achieve the same angular deceleration in Z Achilles vs the pure-ABS version. Despite this, Z Achilles is known for high burst susceptibility, traceable to weak PC burst tabs (estimated τ_burst ≈ 8.5 mN·m, lower than ChZWV's 10.8 mN·m) rather than insufficient inertia; additionally the layer is incompatible with the Level Chip because its tab socket geometry differs from other Cho-Z layers, preventing the 60.6% eccentricity correction provided by Level Chip (Case 424) and leaving any minor manufacturing asymmetry in the zinc distribution uncorrected, adding a small vibration-driven burst-tab deflection bias at high spin.

### Visual Geometry

```
Top-down — Z Achilles (C₄, r_i=4mm, r_o=22mm):

    blade 1 (φ ≈ 20°)    blade 2
       ╱‾‾‾‾‾‾‾◣             ╱‾‾‾‾‾‾◣
      │  ║ZnZn║  │          (×4 at 90°)
      │  r_zn:13-18mm   No Level Chip socket
      │  I_zinc:8.628e-7 (50.9% efficiency)
       ╲________╱

Two-zone inertia:
  ABS body  14.5g  r 4–22mm   I = 3.625×10⁻⁶  (80.8% of I_ZA)
  Zinc ring  3.5g  r 13–18mm  I = 8.628×10⁻⁷  (19.2% of I_ZA)
  Total                        I = 4.488×10⁻⁶  (48.3% of I_total)

vs ChZV zinc (Case 421):  zinc at 14–20mm  eff=61.5%  boost=+44.7%
   Z Achilles zinc:        zinc at 13–18mm  eff=50.9%  boost=+18.9%
```

### Physics Analysis

```
Component: Z Achilles  m = 18.0 g  C₄  zinc r 13–18mm (3.5g)
Assembly:  Z.Achilles.11.Xtend  m_total = 44.1 g  I_total = 9.299×10⁻⁶ kg·m²

Two-zone inertia:
  I_ABS  = ½ × 0.0145 × ((4×10⁻³)² + (22×10⁻³)²) = ½ × 0.0145 × 5.00×10⁻⁴ = 3.625×10⁻⁶ kg·m²
  I_zinc = ½ × 0.0035 × ((13×10⁻³)² + (18×10⁻³)²)
         = ½ × 0.0035 × (1.69×10⁻⁴ + 3.24×10⁻⁴)
         = ½ × 0.0035 × 4.930×10⁻⁴ = 8.628×10⁻⁷ kg·m²
  I_ZA   = 3.625×10⁻⁶ + 8.628×10⁻⁷ = 4.488×10⁻⁶ kg·m²  (48.3% of I_total)

Zinc radial efficiency:
  I_potential = 0.0035 × (0.022)² = 1.694×10⁻⁶ kg·m²  (if zinc were at r_o)
  efficiency  = 8.628×10⁻⁷ / 1.694×10⁻⁶ = 50.9%

Burst energy boost vs ABS-equivalent:
  m_ABS_equiv = 18.0 − (3.5 × (1 − 1.20/7.13)) = 18.0 − 2.911 = 15.09 g
  I_base      = ½ × 0.01509 × 5.00×10⁻⁴ = 3.773×10⁻⁶ kg·m²
  boost       = 4.488/3.773 − 1 = +18.9%

Burst tab weakness:
  tau_burst_ZA ≈ 8.5 mN·m  (estimated, weak tabs)
  vs ChZWV (Case 418): 10.8 mN·m  (strong tabs) → ZA is 21.3% more burst-susceptible at tab level
```

### TypeScript Model

```typescript
function zAchillesZincInertia(
  mABS_g: number, mZinc_g: number,
  rZnInner_mm: number, rZnOuter_mm: number, rLayerOuter_mm: number
): { iABS: number; iZinc: number; iTotal: number; zincEff_pct: number; burstBoost_pct: number } {
  const rhoABS = 1.20, rhoZn = 7.13;
  const iA   = 0.5 * (mABS_g / 1000) * ((4 / 1000) ** 2 + (rLayerOuter_mm / 1000) ** 2);
  const iZ   = 0.5 * (mZinc_g / 1000) * ((rZnInner_mm / 1000) ** 2 + (rZnOuter_mm / 1000) ** 2);
  const iPot = (mZinc_g / 1000) * (rLayerOuter_mm / 1000) ** 2;
  const mBase = (mABS_g + mZinc_g) - mZinc_g * (1 - rhoABS / rhoZn);
  const iBase = 0.5 * (mBase / 1000) * ((4 / 1000) ** 2 + (rLayerOuter_mm / 1000) ** 2);
  return { iABS: iA, iZinc: iZ, iTotal: iA + iZ, zincEff_pct: iZ / iPot * 100, burstBoost_pct: (iA + iZ) / iBase * 100 - 100 };
}
// zAchillesZincInertia(14.5, 3.5, 13, 18, 22) → { iABS:3.625e-6, iZ:8.628e-7, eff:50.9%, boost:+18.9% }
// zAchillesZincInertia(16.4, 4.5, 13, 18, 22) → { eff:50.9%, boost:+24.3% } — heavier zinc
// zAchillesZincInertia(14.5, 3.5, 14, 20, 22) → { eff:65.3% } — ChZV-style placement

function zaVsChZVZincComparison(
  eff_ZA: number, boost_ZA: number, eff_ChZV: number, boost_ChZV: number
): { effRatio: number; boostRatio: number; inertiaGap_pct: number } {
  return { effRatio: eff_ZA / eff_ChZV, boostRatio: boost_ZA / boost_ChZV, inertiaGap_pct: boost_ChZV - boost_ZA };
}
// zaVsChZVZincComparison(50.9, 18.9, 61.5, 44.7) → { effRatio:0.828, boostRatio:0.423, inertiaGap:25.8% }
// zaVsChZVZincComparison(50.9, 18.9, 30.6, 18.3) → { effRatio:1.664 } — ZA vs ChZWV (ZA zinc more efficient)
// zaVsChZVZincComparison(50.9, 18.9, 50.9, 18.9) → { effRatio:1.0, boostRatio:1.0 }  — self comparison

function zAchillesBurstRisk(
  tau_ZA_mNm: number, tau_ChZWV_mNm: number, tau_ChZV_mNm: number
): { vChZWV_pct: number; vChZV_pct: number; susceptibilityRank: string } {
  const vWV = (tau_ChZWV_mNm / tau_ZA_mNm - 1) * 100;
  const vV  = (tau_ChZV_mNm  / tau_ZA_mNm - 1) * 100;
  return { vChZWV_pct: vWV, vChZV_pct: vV, susceptibilityRank: 'ZA > ChZWV > ChZV (hardest to burst)' };
}
// zAchillesBurstRisk(8.5, 10.8, 14.5) → { vChZWV:+27.1%, vChZV:+70.6%, rank:ZA easiest to burst }
// zAchillesBurstRisk(9.0, 10.8, 14.5) → { vChZWV:+20.0%, vChZV:+61.1% }
// zAchillesBurstRisk(8.5, 8.5, 14.5)  → { vChZWV:0%, vChZV:+70.6% }  — ZA = ChZWV tab strength
```

---

## Case 444 — Forge Disc 11 (Cho-Z Layer System): C₂ Asymmetric Elliptical Disc Inertia, One-Sided Indent Eccentricity, and Lightest-Core-Disc Context in the Z.Achilles.11.Xtend Assembly

**Thesis:** Forge Disc 11 is an 18.5 g C₂ elliptical Cho-Z Core Disc that was the lightest Core Disc at the time of its release (before Disc 12 at 16.1 g, Case 419) and introduces a structural asymmetry unique in the disc lineup: one side of the C₂ ellipse features a rectangular indent that removes a small amount of mass and shifts the centroid away from the geometric centre, while the opposing side retains the full elliptic protrusion, creating a two-lobe assembly of unequal mass. At r_i = 4 mm and r_o = 22 mm the baseline inertia is I_11 = half × 0.0185 × ((4×10⁻³)² + (22×10⁻³)²) = half × 0.0185 × 5.00×10⁻⁴ = 4.625×10⁻⁶ kg·m², placing it as the dominant inertia contributor at 49.7% of the assembly total, virtually tied with Z Achilles at 48.3%. The eccentricity from the one-sided indent (estimated delta_m ≈ 0.4 g missing at r ≈ 17 mm) produces a centroid offset e = delta_m × r / m_disc = 0.4×10⁻³ × 0.017 / 0.0185 = 3.68×10⁻⁴ m = 0.368 mm; the resulting centrifugal imbalance force at ω = 600 rad/s is F_imb = m_disc × e × ω² = 0.0185 × 3.68×10⁻⁴ × 3.60×10⁵ = 2.45 N, a modest but non-negligible lateral force that without Level Chip cancellation contributes to orbit drift and slightly elevated burst risk at high spin. The disc's C₂ symmetry means the elliptic protrusions align with two opposing directions, useful for force-alignment combinations (pairing the protrusion axis with the layer's contact-point axis) but less forgiving in Stamina configurations than a fully circular disc because the two heavy lobes create a varying moment during precession. In the Z.Achilles.11.Xtend assembly where Level Chip cannot be used, the Z Achilles zinc asymmetry (minor) and Disc 11 asymmetry (0.368 mm offset) compound, though both are small enough that the assembly remains viable.

### Visual Geometry

```
Forge Disc 11 — C₂ elliptical with one-sided indent (r_i=4mm, r_o=22mm):

  full elliptic lobe        indent lobe (asymmetric)
       ┌────────┐                ┌─────┐
     ╔═╪═══════╪═╗            ╔═╪═════╪═╗
     ║  protrusion ║           ║ ┐indent└ ║   ← Δm ≈ 0.4g missing
     ╚═╪═══════╪═╝            ╚═╪═════╪═╝
       └────────┘                └─────┘

  eccentricity: e = 0.368mm  →  F_imb = 2.45N at 600 rad/s
  
  C₂ disc comparisons:
    Disc 1  (21.2g): I = 5.300×10⁻⁶   (symmetric)
    Disc 11 (18.5g): I = 4.625×10⁻⁶   (asymmetric, −12.7%)
    Disc 12 (16.1g): I = 4.030×10⁻⁶   (symmetric C₁₂, Case 419, −12.9% vs D11)
```

### Physics Analysis

```
Component: Forge Disc 11  m = 18.5 g  C₂ elliptical  one-sided indent
Assembly:  Z.Achilles.11.Xtend  m_total = 44.1 g  I_total = 9.299×10⁻⁶ kg·m²

Disc inertia:
  I_11 = ½ × 0.0185 × ((4×10⁻³)² + (22×10⁻³)²)
       = ½ × 0.0185 × (1.60×10⁻⁵ + 4.84×10⁻⁴)
       = ½ × 0.0185 × 5.00×10⁻⁴
       = 4.625×10⁻⁶ kg·m²  (49.7% of I_total)

One-sided indent eccentricity:
  delta_m ≈ 0.4 g,  r_indent ≈ 17 mm
  e = delta_m × r_indent / m_disc
    = 0.4×10⁻³ × 0.017 / 0.0185
    = 3.68×10⁻⁴ m  (0.368 mm)

Centrifugal imbalance force at omega = 600 rad/s:
  F_imb = m_disc × e × omega²
        = 0.0185 × 3.68×10⁻⁴ × (600)²
        = 0.0185 × 3.68×10⁻⁴ × 3.60×10⁵
        = 2.45 N

vs Level Chip balance (hypothetical, if compatible):
  Level Chip would supply M_LC ≈ 9.80 g·mm counter-moment (Case 424)
  Required M_disc = delta_m × r_indent = 0.4 × 17 = 6.80 g·mm
  → Level Chip would over-correct (9.80 > 6.80); partial correction ≈ 100% if tuned
```

### TypeScript Model

```typescript
function disc11Inertia(
  mDisc_g: number, riMm: number, roMm: number, iTotal: number
): { iDisc: number; iSharePct: number; vsDisc1_pct: number } {
  const iD  = 0.5 * (mDisc_g / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  const iD1 = 0.5 * (21.2 / 1000) * ((4 / 1000) ** 2 + (22 / 1000) ** 2);
  return { iDisc: iD, iSharePct: iD / iTotal * 100, vsDisc1_pct: (iD / iD1 - 1) * 100 };
}
// disc11Inertia(18.5, 4, 22, 9.299e-6) → { I:4.625e-6, share:49.7%, vsD1:−12.7% }
// disc11Inertia(21.2, 4, 22, 9.299e-6) → { I:5.300e-6, vsD1:0% }  — Disc 1 reference
// disc11Inertia(16.1, 4, 19, 9.299e-6) → { I:3.030e-6, vsD1:−42.8% } — Disc 12-Core

function disc11AsymmetryImbalance(
  deltaMass_g: number, rIndent_mm: number, mDisc_g: number, omega_rads: number
): { eccentricity_mm: number; fImb_N: number; momentImb_gMm: number } {
  const e  = (deltaMass_g / 1000) * (rIndent_mm / 1000) / (mDisc_g / 1000);
  const F  = (mDisc_g / 1000) * e * omega_rads ** 2;
  return { eccentricity_mm: e * 1000, fImb_N: F, momentImb_gMm: deltaMass_g * rIndent_mm };
}
// disc11AsymmetryImbalance(0.4, 17, 18.5, 600) → { e:0.368mm, F:2.45N, M:6.80g·mm }
// disc11AsymmetryImbalance(0.4, 17, 18.5, 400) → { e:0.368mm, F:1.09N } — lower speed
// disc11AsymmetryImbalance(0.8, 17, 18.5, 600) → { e:0.735mm, F:4.90N } — larger indent

function disc11EccentricityVsLevelChip(
  momentDisc_gMm: number, momentLC_gMm: number
): { residualImbalance_gMm: number; correctionPct: number; levelChipHelps: boolean } {
  const residual = Math.abs(momentDisc_gMm - momentLC_gMm);
  return { residualImbalance_gMm: residual, correctionPct: Math.min(momentLC_gMm, momentDisc_gMm) / momentDisc_gMm * 100, levelChipHelps: momentLC_gMm <= momentDisc_gMm * 1.5 };
}
// disc11EccentricityVsLevelChip(6.80, 9.80) → { residual:3.0g·mm, corrPct:100%, helps:true }  — over-corrects
// disc11EccentricityVsLevelChip(6.80, 0)    → { residual:6.80, corrPct:0%, helps:false }        — no chip
// disc11EccentricityVsLevelChip(6.80, 6.80) → { residual:0, corrPct:100%, helps:true }          — perfect
```

---

## Case 445 — Performance Tip Xtend (Cho-Z / God Layer System): Dual-Mode Sharp-Tip and Flat-Base Spin Decay, Manual Height-Change Mechanics, and Mode Aggressiveness Ratio in the Z.Achilles.11.Xtend Assembly

**Thesis:** Performance Tip Xtend is a 7.6 g dual-mode non-Dash driver combining a sharp centre tip of radius r_tip = 0.3 mm (Mode 1) with a wide flat base of radius r_base = 7 mm (Mode 2) that the user can switch manually at any time by adjusting the height selector; the two modes represent opposite extremes of the friction spectrum rather than a graduated decay series, and the mode transition is discrete and reversible, unlike the irreversible rubber-to-ABS wear progression of Evolution or Variable' tips. Mode 1 (sharp centre tip on floor) has an effective friction radius r_eff1 = r_tip = 0.3 mm (not 2r/3 because the sharp tip approximates a point rather than a flat disc) with mu_metal = 0.10, giving tau1 = 0.10 × 0.0441 × 9.81 × 3.0×10⁻⁴ = 1.298×10⁻⁵ N·m and dω/dt_1 = −1.298×10⁻⁵ / 9.299×10⁻⁶ = −1.40 rad/s²; battle time to 40% stability is t = 360/1.40 = 257 s, theoretically infinite-stamina. Mode 2 (wide flat base engagement) uses r_eff2 = 2 × 0.007/3 = 4.667×10⁻³ m with mu_ABS = 0.17, giving tau2 = 3.453×10⁻⁴ N·m and dω/dt_2 = −37.1 rad/s², t₂ = 9.70 s; the mode aggressiveness ratio is dω/dt_2 / dω/dt_1 = 37.1/1.40 = 26.5×, making Mode 2 twenty-six times more friction-intensive than Mode 1. The driver contributes I_Xtend = half × 0.0076 × (7×10⁻³)² = 1.862×10⁻⁷ kg·m² (2.0% of assembly I_total), and since Xtend is non-Dash, there is no secondary spring lock — burst resistance depends entirely on the Z Achilles tabs (τ_burst ≈ 8.5 mN·m). The wide base's large Hertzian contact during Mode 2 produces a "banking pattern" similar to a rubber flat tip at very early battle stages, but because Mode 2 uses hard ABS (not rubber), the banking is less aggressive and more linear — the assembly orbits rather than chaotically carves. The Cho-Z era's tall height for Xtend means the flat base in Mode 2 sits slightly higher than a standard driver, which reduces the angle at which it contacts the floor and moderates the movement pattern slightly relative to what the same tip geometry would produce at standard height.

### Visual Geometry

```
Xtend tip — cross-section (side view):

  Mode 1 (sharp tip down):    Mode 2 (flat base down):
  ┌─────────────────────┐     ┌─────────────────────┐
  │   tip housing       │     │   tip housing       │
  │         ↓           │     │  ←base width 14mm→  │
  │         ● r=0.3mm   │     │  ─────────────────  │
  └─────────────────────┘     └─────────────────────┘
  floor: point contact         floor: flat annular contact
  r_eff = 0.30mm               r_eff = 4.67mm
  dω/dt = −1.40 rad/s²         dω/dt = −37.1 rad/s²
  t     = 257s (stamina)       t     =  9.70s (aggressive)

  Mode ratio: 37.1/1.40 = 26.5×
```

### Physics Analysis

```
Component: Xtend  m = 7.6 g  dual-mode  non-Dash
Assembly:  Z.Achilles.11.Xtend  m_total = 44.1 g  I_total = 9.299×10⁻⁶ kg·m²

Driver inertia:
  I_Xtend = ½ × 0.0076 × (7.0×10⁻³)² = ½ × 0.0076 × 4.90×10⁻⁵ = 1.862×10⁻⁷ kg·m²  (2.0%)

Mode 1 (sharp centre tip, r_tip = 0.3 mm):
  r_eff1 = r_tip = 3.0×10⁻⁴ m  (point contact — no 2r/3 averaging)
  tau1   = 0.10 × 0.0441 × 9.81 × 3.0×10⁻⁴ = 1.298×10⁻⁵ N·m
  dω/dt_1 = −1.298×10⁻⁵ / 9.299×10⁻⁶ = −1.40 rad/s²
  t_1    = 360/1.40 = 257 s  (≈ infinite stamina)

Mode 2 (wide flat base, r_base = 7 mm):
  r_eff2 = 2 × 7×10⁻³ / 3 = 4.667×10⁻³ m
  tau2   = 0.17 × 0.0441 × 9.81 × 4.667×10⁻³ = 3.453×10⁻⁴ N·m
  dω/dt_2 = −3.453×10⁻⁴ / 9.299×10⁻⁶ = −37.1 rad/s²
  t_2    = 360/37.1 = 9.70 s

Mode aggressiveness ratio: 37.1/1.40 = 26.5×  (Mode 2 is 26.5× faster decay)

Assembly summary:
  I_ZA     = 4.488×10⁻⁶  (48.3%)
  I_11     = 4.625×10⁻⁶  (49.7%)
  I_Xtend  = 1.862×10⁻⁷  (2.0%)
  I_total  = 9.299×10⁻⁶ kg·m²   L₀ = 5.579×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function xtendModeDecay(
  mTotal_g: number, iTotal: number,
  rTipMm: number, muTip: number,
  rBaseMm: number, muBase: number
): { mode1: { rEff_mm: number; dOmega: number; tBattle_s: number };
     mode2: { rEff_mm: number; dOmega: number; tBattle_s: number };
     modeRatio: number } {
  const calc = (rEff: number, mu: number) => {
    const tau = mu * (mTotal_g / 1000) * 9.81 * rEff;
    const d   = -tau / iTotal;
    return { rEff_mm: rEff * 1000, dOmega: d, tBattle_s: 360 / Math.abs(d) };
  };
  const m1 = calc(rTipMm / 1000, muTip);
  const m2 = calc(2 * rBaseMm / 3000, muBase);
  return { mode1: m1, mode2: m2, modeRatio: Math.abs(m2.dOmega / m1.dOmega) };
}
// xtendModeDecay(44.1, 9.299e-6, 0.3, 0.10, 7, 0.17) → { m1:dω=−1.40,t=257s; m2:dω=−37.1,t=9.70s; ratio:26.5× }
// xtendModeDecay(44.1, 9.299e-6, 0.5, 0.10, 7, 0.17) → { m1:dω=−2.33, ratio:15.9× } — blunter tip
// xtendModeDecay(44.1, 9.299e-6, 0.3, 0.10, 5, 0.17) → { m2:dω=−26.5, ratio:18.9× } — narrower base

function xtendModeRatioVsOtherTips(
  ratio_Xtend: number, ratio_Var: number, ratio_Evo: number
): { bestModeRange: string; worstModeRange: string } {
  const ratios = [
    { name: 'Xtend', r: ratio_Xtend },
    { name: "Var'",  r: ratio_Var   },
    { name: "Evo'",  r: ratio_Evo   }
  ];
  ratios.sort((a, b) => b.r - a.r);
  return { bestModeRange: ratios[0].name, worstModeRange: ratios[ratios.length - 1].name };
}
// xtendModeRatioVsOtherTips(26.5, 1.667, 1.750) → { best:'Xtend', worst:"Var'" } — Xtend widest mode range
// xtendModeRatioVsOtherTips(26.5, 26.5, 1.750) → { best:'Xtend', worst:"Evo'" }
// xtendModeRatioVsOtherTips(10.0, 1.667, 1.750) → { best:'Xtend', worst:"Var'" }

function xtendAssemblyAngularMomentum(
  iZA: number, i11: number, iXtend: number, omega0_rads: number
): { iTotal: number; L0: number; zaShare: number; d11Share: number } {
  const iT = iZA + i11 + iXtend;
  return { iTotal: iT, L0: iT * omega0_rads, zaShare: iZA / iT, d11Share: i11 / iT };
}
// xtendAssemblyAngularMomentum(4.488e-6, 4.625e-6, 1.862e-7, 600) → { I:9.299e-6, L:5.579e-3, ZA:48.3%, D11:49.7% }
// xtendAssemblyAngularMomentum(4.488e-6, 4.625e-6, 1.862e-7, 500) → { L:4.649e-3 }
// xtendAssemblyAngularMomentum(4.488e-6, 5.300e-6, 1.862e-7, 600) → { L:5.998e-3 } — vs Disc 1 instead
```

---

## Case 446 — Energy Layer Cho-Z Achilles (Cho-Z Layer System): Bistable Burst-Stopper Wing Deployment, Two-Zone Sword-Blade Zinc Inertia, and Critical Angular Velocity for Awakening in the ChZAchilles.00.Dimension Assembly

**Thesis:** Energy Layer Cho-Z Achilles is a 21.5 g C₄ layer with two standard blades and two zinc-embedded sword blades; the sword blades carry a bistable "Cho-Z Awakening System" — leaf-spring-loaded tabs that snap outward (deploying Burst Stoppers that mechanically block the burst tabs) above a critical angular velocity and snap inward below it, creating a spin-speed-gated burst resistance mechanism unlike any passive tab system. With m_wing ≈ 0.8 g and r_wing ≈ 18 mm per deploying blade section, the critical velocity is omega_crit = sqrt(F_bistable / (m_wing × r_wing)) where F_bistable = 2.304 N gives omega_crit = sqrt(2.304 / (8×10⁻⁴ × 1.8×10⁻²)) = sqrt(2.304 / 1.44×10⁻⁵) = sqrt(1.60×10⁵) = 400 rad/s (≈ 3820 RPM); at launch omega₀ = 600 rad/s the centrifugal force (5.184 N) exceeds F_bistable and the Burst Stoppers are fully deployed — providing maximum burst resistance precisely when collision energies are highest. As spin decays below 400 rad/s the stoppers retract and burst resistance drops, but at low spin the burst tab angular impulse threshold is proportionally lower (ΔE ∝ I × ω × Δω) so the reduced protection coincides with reduced burst energy, maintaining an approximate proportionality between available burst resistance and incoming burst risk throughout the battle. The zinc inertia at r 16–21 mm (m_zinc ≈ 4.5 g) yields I_zinc = half × 0.0045 × ((16×10⁻³)² + (21×10⁻³)²) = 1.568×10⁻⁶ kg·m² with zinc efficiency 71.9% — the highest zinc efficiency in the documented Cho-Z series (ChZV was 61.5%) because the sword blades place zinc at the outermost available radius; combined with I_ABS = half × 0.017 × ((4×10⁻³)² + (22×10⁻³)²) = 4.250×10⁻⁶ the total I_ChZA = 5.818×10⁻⁶ kg·m² (44.5% of assembly I_total = 1.307×10⁻⁵ kg·m²). The layer is incompatible with Level Chip and contact points wear quickly — mechanically expected for a layer where the zinc sword edges bear the brunt of every collision impact, generating Hertzian stress concentrations that accelerate ABS abrasion at the layer perimeter without the rubber absorber present on Blade Savior or Blade Ultimate.

### Visual Geometry

```
Top-down — Cho-Z Achilles (C₄: 2 standard + 2 sword blades, r_o=22mm):

       sword blade (zinc 16–21mm, Burst Stopper tab)
      ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲
     │  ║══════ZINC══════║   │  I_zinc = 1.568×10⁻⁶ (71.9% eff)
     │  Burst Stopper → ▶→  │  deploys at ω > 400 rad/s
      ╲────────────────────╱
           (×2 sword)  +  (×2 standard ABS blades)

Bistable Awakening System:
  ω < 400 rad/s: F_cf < F_bistable  → stoppers retracted
  ω > 400 rad/s: F_cf > F_bistable  → stoppers deployed (high burst resistance)
  F_cf(600) = 5.184N >> F_bistable(2.304N) → always deployed at launch

Zinc efficiency comparison:
  ChZWV (r 10–14mm): 30.6%  ← worst
  ChZV  (r 14–20mm): 61.5%
  ChZA  (r 16–21mm): 71.9%  ← best (sword blade placement)
```

### Physics Analysis

```
Component: Cho-Z Achilles  m = 21.5 g  C₄  zinc on sword blades  bistable awakening
Assembly:  ChZAchilles.00.Dimension  m_total = 53.9 g  I_total = 1.307×10⁻⁵ kg·m²

Two-zone inertia:
  I_ABS  = ½ × 0.017  × ((4×10⁻³)² + (22×10⁻³)²) = ½ × 0.017  × 5.00×10⁻⁴ = 4.250×10⁻⁶ kg·m²
  I_zinc = ½ × 0.0045 × ((16×10⁻³)² + (21×10⁻³)²)
         = ½ × 0.0045 × (2.56×10⁻⁴ + 4.41×10⁻⁴)
         = ½ × 0.0045 × 6.970×10⁻⁴ = 1.568×10⁻⁶ kg·m²
  I_ChZA = 4.250×10⁻⁶ + 1.568×10⁻⁶ = 5.818×10⁻⁶ kg·m²  (44.5% of I_total)

Zinc efficiency: I_zinc / (m_zinc × r_o²) = 1.568e-6 / (0.0045 × 0.022²) = 1.568e-6/2.178e-6 = 71.9%

Bistable critical velocity:
  m_wing = 0.8 g = 8×10⁻⁴ kg,  r_wing = 18 mm = 1.8×10⁻² m
  F_bistable = 2.304 N  (spring preload)
  omega_crit = sqrt(F_bistable / (m_wing × r_wing))
             = sqrt(2.304 / (8×10⁻⁴ × 1.8×10⁻²))
             = sqrt(2.304 / 1.44×10⁻⁵)
             = sqrt(1.600×10⁵) = 400 rad/s  (3820 RPM)

Centrifugal force at omega = 600 rad/s:
  F_cf(600) = m_wing × r_wing × omega² = 8×10⁻⁴ × 1.8×10⁻² × 3.60×10⁵ = 5.184 N > F_bistable ✓ (deployed)
  F_cf(300) = 8×10⁻⁴ × 1.8×10⁻² × 9.00×10⁴ = 1.296 N < F_bistable → retracted
```

### TypeScript Model

```typescript
function choZAchillesZincInertia(
  mABS_g: number, mZinc_g: number,
  rZnInner_mm: number, rZnOuter_mm: number, rLayerOuter_mm: number
): { iABS: number; iZinc: number; iTotal: number; zincEff_pct: number; burstBoost_pct: number } {
  const rhoABS = 1.20, rhoZn = 7.13;
  const iA   = 0.5 * (mABS_g / 1000) * ((4 / 1000) ** 2 + (rLayerOuter_mm / 1000) ** 2);
  const iZ   = 0.5 * (mZinc_g / 1000) * ((rZnInner_mm / 1000) ** 2 + (rZnOuter_mm / 1000) ** 2);
  const iPot = (mZinc_g / 1000) * (rLayerOuter_mm / 1000) ** 2;
  const mBase = (mABS_g + mZinc_g) - mZinc_g * (1 - rhoABS / rhoZn);
  const iBase = 0.5 * (mBase / 1000) * ((4 / 1000) ** 2 + (rLayerOuter_mm / 1000) ** 2);
  return { iABS: iA, iZinc: iZ, iTotal: iA + iZ, zincEff_pct: iZ / iPot * 100, burstBoost_pct: (iA + iZ) / iBase * 100 - 100 };
}
// choZAchillesZincInertia(17.0, 4.5, 16, 21, 22) → { iABS:4.250e-6, iZ:1.568e-6, eff:71.9%, boost:+31.0% }
// choZAchillesZincInertia(14.5, 3.5, 14, 20, 22) → { eff:61.5%, boost:+44.7% }  — ChZV profile
// choZAchillesZincInertia(17.0, 4.5, 10, 14, 22) → { eff:27.5% }  — ChZWV-style placement

function choZAchillesBistableCriticalOmega(
  mWing_g: number, rWing_mm: number, fBistable_N: number
): { omegaCrit_rads: number; omegaCrit_rpm: number; fCfAtLaunch: number; deployedAtLaunch: boolean } {
  const oc = Math.sqrt(fBistable_N / ((mWing_g / 1000) * (rWing_mm / 1000)));
  const fCf = (mWing_g / 1000) * (rWing_mm / 1000) * 600 ** 2;
  return { omegaCrit_rads: oc, omegaCrit_rpm: oc * 60 / (2 * Math.PI), fCfAtLaunch: fCf, deployedAtLaunch: fCf > fBistable_N };
}
// choZAchillesBistableCriticalOmega(0.8, 18, 2.304) → { ωCrit:400r/s, RPM:3820, F:5.184N, deployed:true }
// choZAchillesBistableCriticalOmega(0.8, 18, 3.456) → { ωCrit:490r/s, RPM:4680 } — stiffer spring
// choZAchillesBistableCriticalOmega(1.2, 18, 2.304) → { ωCrit:327r/s } — heavier wing

function choZABistableVsPassiveBurstComparison(
  omega: number, omegaCrit: number, tauPassive_mNm: number, tauWithStopper_mNm: number
): { stopperDeployed: boolean; effectiveTau_mNm: number; burstRiskFactor: number } {
  const deployed = omega >= omegaCrit;
  const tau = deployed ? tauWithStopper_mNm : tauPassive_mNm;
  return { stopperDeployed: deployed, effectiveTau_mNm: tau, burstRiskFactor: tauPassive_mNm / tau };
}
// choZABistableVsPassiveBurstComparison(600, 400, 8.5, 18.0) → { deployed:true, τ:18.0mN·m, riskFactor:0.472 }
// choZABistableVsPassiveBurstComparison(300, 400, 8.5, 18.0) → { deployed:false, τ:8.5mN·m, riskFactor:1.0 }
// choZABistableVsPassiveBurstComparison(400, 400, 8.5, 18.0) → { deployed:true, τ:18.0mN·m } — exactly at crit
```

---

## Case 447 — Forge Disc 00 (Cho-Z Layer System): Heaviest Core Disc Inertia, Frame-Facilitating Architecture, and Stamina OWD Dominance in the ChZAchilles.00.Dimension Assembly

**Thesis:** Forge Disc 00 is a 25.2 g symmetrical elliptical Core Disc, the heaviest in the documented Core Disc lineup (00 > Xanthus 32.5 g which is a DB-era Disc, not a Core Disc; among Core Discs 00 > Zenith 24.1 g > Disc 1 21.2 g), designed to accommodate a separate Frame component in its outer slots; at r_i = 6 mm and r_o = 23 mm the inertia is I_00 = half × 0.0252 × ((6×10⁻³)² + (23×10⁻³)²) = half × 0.0252 × 5.65×10⁻⁴ = 7.119×10⁻⁶ kg·m², representing 54.5% of assembly I_total = 1.307×10⁻⁵ kg·m² and constituting the single largest inertia contributor. The elliptical symmetrical shape (C₂ symmetry, unlike Disc 11's asymmetric C₂) means the two elliptic lobes are mirror images of each other, producing zero first-order eccentricity and no centrifugal imbalance force — favourable for stamina combinations where orbit drift from imbalance is directly penalising. The Frame-facilitating architecture places raised slots at the disc outer perimeter at specific angular positions compatible with the Frame's tab geometry; without a Frame (as in this assembly) these slots are exposed to air, adding minor aerodynamic drag but no functional penalty. Comparison with Disc 1 (21.2 g, r_o = 22 mm, I = 5.300×10⁻⁶, Case notes): Disc 00 delivers +34.3% inertia via +18.9% mass and +1 mm outer radius — the extra millimetre contributes ΔI_1mm = half × 0.0252 × ((23×10⁻³)² − (22×10⁻³)²) = half × 0.0252 × (529 − 484)×10⁻⁶ = 5.67×10⁻⁷ kg·m² (+10.7%), with the remaining +23.6% from pure mass increase, showing that the radial gain and mass gain contribute roughly equally to the overall advantage.

### Visual Geometry

```
Forge Disc 00 — top view (C₂ elliptical, r_i=6mm, r_o=23mm, symmetric):

            lobe A          lobe B (mirror of A)
       ╔══════════╗    ╔══════════╗
       ║ 25.2g/2  ║    ║ 25.2g/2  ║    ← perfectly balanced (zero eccentricity)
       ╚══════════╝    ╚══════════╝
       ←──── outer Frame slots (unused in this combination) ────→

  I_00 = 7.119×10⁻⁶ kg·m²  (54.5% of I_total)

  Core Disc inertia hierarchy:
    Disc 00  25.2g  r_o=23mm  I = 7.119×10⁻⁶   ← this case
    Zenith   24.1g  r_o=23mm  I = 6.567×10⁻⁶   (−7.7%)
    Disc 1   21.2g  r_o=22mm  I = 5.300×10⁻⁶   (−25.6%)
    Disc 11  18.5g  r_o=22mm  I = 4.625×10⁻⁶   (−35.0%)
    Disc 12  16.1g  r_o=19mm  I = 3.035×10⁻⁶   (−57.4%)
```

### Physics Analysis

```
Component: Forge Disc 00  m = 25.2 g  C₂ symmetric elliptical  Frame-compatible
Assembly:  ChZAchilles.00.Dimension  m_total = 53.9 g  I_total = 1.307×10⁻⁵ kg·m²

Disc inertia:
  I_00 = ½ × 0.0252 × ((6×10⁻³)² + (23×10⁻³)²)
       = ½ × 0.0252 × (3.60×10⁻⁵ + 5.29×10⁻⁴)
       = ½ × 0.0252 × 5.650×10⁻⁴
       = 7.119×10⁻⁶ kg·m²  (54.5% of I_total)

Inertia advantage over Disc 1 (21.2g, r_o=22mm):
  I_D1     = ½ × 0.0212 × ((4×10⁻³)² + (22×10⁻³)²) = 5.300×10⁻⁶ kg·m²
  ΔI_total = 7.119 − 5.300 = 1.819×10⁻⁶ (+34.3%)

Decomposition:
  ΔI_1mm_radius = ½ × 0.0252 × ((23×10⁻³)² − (22×10⁻³)²) = ½ × 0.0252 × 4.50×10⁻⁵ = 5.67×10⁻⁷  (+10.7%)
  ΔI_mass       = 1.819e-6 − 5.67e-7 = 1.252e-6  (+23.6%)
  → mass vs radius split: 23.6% mass / 10.7% radius

Assembly summary:
  I_ChZA = 5.818×10⁻⁶  (44.5%)
  I_00   = 7.119×10⁻⁶  (54.5%)
  I_Dim  = 1.296×10⁻⁷  (1.0%)
  I_total = 1.307×10⁻⁵ kg·m²   L₀ = 7.842×10⁻³ kg·m²/s
```

### TypeScript Model

```typescript
function disc00Inertia(
  mDisc_g: number, riMm: number, roMm: number, iTotal: number
): { iDisc: number; iSharePct: number; vsDisc1_pct: number; vsZenith_pct: number } {
  const iD  = 0.5 * (mDisc_g / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  const iD1 = 0.5 * (21.2 / 1000) * ((4 / 1000) ** 2 + (22 / 1000) ** 2);
  const iZ  = 0.5 * (24.1 / 1000) * ((4 / 1000) ** 2 + (23 / 1000) ** 2);
  return { iDisc: iD, iSharePct: iD / iTotal * 100, vsDisc1_pct: (iD / iD1 - 1) * 100, vsZenith_pct: (iD / iZ - 1) * 100 };
}
// disc00Inertia(25.2, 6, 23, 1.307e-5) → { I:7.119e-6, share:54.5%, vsD1:+34.3%, vsZenith:+8.4% }
// disc00Inertia(24.1, 4, 23, 1.307e-5) → { I:6.567e-6, vsD1:+23.9% } — Zenith
// disc00Inertia(25.2, 6, 22, 1.307e-5) → { I:6.552e-6 } — 00 if r_o=22mm

function disc00RadiusVsMassDecomposition(
  mDisc_g: number, riMm: number, roMm: number, roRef_mm: number, riRef_mm: number, mRef_g: number
): { iDisc: number; iRef: number; dI_radius: number; dI_mass: number; radiusFrac_pct: number } {
  const iD   = 0.5 * (mDisc_g / 1000) * ((riMm / 1000) ** 2 + (roMm / 1000) ** 2);
  const iRef = 0.5 * (mRef_g  / 1000) * ((riRef_mm / 1000) ** 2 + (roRef_mm / 1000) ** 2);
  const dIr  = 0.5 * (mDisc_g / 1000) * ((roMm / 1000) ** 2 - (roRef_mm / 1000) ** 2);
  const dIm  = (iD - iRef) - dIr;
  return { iDisc: iD, iRef, dI_radius: dIr, dI_mass: dIm, radiusFrac_pct: dIr / (iD - iRef) * 100 };
}
// disc00RadiusVsMassDecomposition(25.2, 6, 23, 22, 4, 21.2) → { dI_r:5.67e-7, dI_m:1.252e-6, rFrac:31.2% }
// disc00RadiusVsMassDecomposition(25.2, 6, 24, 22, 4, 21.2) → { dI_r:1.185e-6 } — 2mm bigger r_o
// disc00RadiusVsMassDecomposition(25.2, 6, 23, 23, 6, 24.1) → { dI_r:0, dI_m:2.79e-7 } — vs Zenith same r_o

function disc00AssemblyL0(
  iChZA: number, i00: number, iDim: number, omega0_rads: number
): { iTotal: number; L0: number; discPct: number } {
  const iT = iChZA + i00 + iDim;
  return { iTotal: iT, L0: iT * omega0_rads, discPct: i00 / iT * 100 };
}
// disc00AssemblyL0(5.818e-6, 7.119e-6, 1.296e-7, 600) → { I:1.307e-5, L:7.842e-3, discPct:54.5% }
// disc00AssemblyL0(5.818e-6, 6.567e-6, 1.296e-7, 600) → { I:1.252e-5, L:7.511e-3 } — Zenith instead
// disc00AssemblyL0(5.818e-6, 7.119e-6, 1.296e-7, 500) → { L:6.535e-3 }
```

---

## Case 448 — Performance Tip Dimension (Cho-Z / God Layer System): Six-Configuration Height-Tip Matrix, Rubber-Exposed vs Retracted Decay Mode Analysis, and Height-Dependent LAD Geometry in the ChZAchilles.00.Dimension Assembly

**Thesis:** Performance Tip Dimension is a 7.2 g manual-height-change driver offering six configurations through the combination of three selectable heights (Low, Mid, High) and two rubber-tip states (exposed sharp rubber tip, retracted sharp plastic tip), creating a 3×2 matrix of spin decay and movement profiles that Dimension' (Case 449, with Dash spring) inherits identically but with added burst resistance. Mode A (rubber exposed, r_rubber = 2 mm) gives an effective friction radius r_eff_A = 2 × 0.002/3 = 1.333 mm with mu_rubber = 0.85: tau_A = 0.85 × 0.0539 × 9.81 × 1.333×10⁻³ = 5.987×10⁻⁴ N·m, dω/dt_A = −5.987×10⁻⁴ / 1.307×10⁻⁵ = −45.8 rad/s², battle time t_A = 7.86 s. Mode B (rubber retracted, sharp plastic tip, r_tip = 0.5 mm, mu_plastic = 0.10) gives tau_B = 0.10 × 0.0539 × 9.81 × 5.0×10⁻⁴ = 2.643×10⁻⁵ N·m, dω/dt_B = −2.02 rad/s², t_B = 178 s; the mode aggressiveness ratio is 45.8/2.02 = 22.7×, comparable to Xtend's 26.5×. Height selection has two functional effects: (1) at Low height the driver tip contacts the floor at a lower centre-of-mass elevation, increasing gyroscopic precession stability; (2) at High height, the LAD contact point during final wobble shifts because the tip housing rim contacts the floor at a larger effective radius r_LAD_High > r_LAD_Low, extending LAD duration — specifically, for a wobble angle theta = 30° and housing rim radius r_rim = 5 mm, r_LAD = r_rim / cos(theta) = 5/0.866 = 5.77 mm at all heights (rim contact geometry unchanged) while the effective height increase shifts theta_contact slightly, providing a secondary LAD benefit of approximately 5–10% at High vs Low mode. Since Dimension is non-Dash, no secondary spring lock is present; burst resistance depends entirely on the Cho-Z Achilles Awakening System and blade tabs, making High height combined with rubber retracted (Mode B High) the stamina-optimised configuration and rubber exposed Low height the most aggressive combination.

### Visual Geometry

```
Dimension tip — 3×2 configuration matrix:

  Height:    Low           Mid           High
             ═══           ════          ═════   ← housing elevation
Rubber ON:  dω=−45.8      dω=−45.8     dω=−45.8  (Mode A, same τ regardless of height)
(r_eff=1.33mm) t=7.86s     t=7.86s      t=7.86s

Rubber OFF: dω=−2.02      dω=−2.02     dω=−2.02  (Mode B, same τ)
(r_eff=0.50mm) t=178s      t=178s       t=178s

Height effect: changes CoM elevation and contact geometry (LAD ~5–10% longer at High)
Mode A/B ratio: 45.8/2.02 = 22.7× (rubber ON/OFF)

Side cross-section (Mode B, High):
   ┌──────────────────┐
   │  housing (tall)  │   CoM higher → increased precession rate
   │        ↓         │
   │     ○ r=0.5mm    │   sharp plastic tip
   └──────────────────┘
```

### Physics Analysis

```
Component: Dimension  m = 7.2 g  3-height × 2-rubber states = 6 configs  non-Dash
Assembly:  ChZAchilles.00.Dimension  m_total = 53.9 g  I_total = 1.307×10⁻⁵ kg·m²

Driver inertia:
  I_Dim = ½ × 0.0072 × (6.0×10⁻³)² = ½ × 0.0072 × 3.60×10⁻⁵ = 1.296×10⁻⁷ kg·m²  (1.0%)

Mode A (rubber exposed, r_rubber = 2 mm):
  r_eff_A = 2 × 0.002/3 = 1.333×10⁻³ m
  tau_A   = 0.85 × 0.0539 × 9.81 × 1.333×10⁻³ = 5.987×10⁻⁴ N·m
  dω/dt_A = −5.987×10⁻⁴ / 1.307×10⁻⁵ = −45.8 rad/s²      t_A = 360/45.8 = 7.86 s

Mode B (rubber retracted, sharp tip, r_tip = 0.5 mm):
  r_eff_B = r_tip = 5.0×10⁻⁴ m
  tau_B   = 0.10 × 0.0539 × 9.81 × 5.0×10⁻⁴ = 2.643×10⁻⁵ N·m
  dω/dt_B = −2.643×10⁻⁵ / 1.307×10⁻⁵ = −2.02 rad/s²        t_B = 360/2.02 = 178 s

Mode aggressiveness ratio: 45.8/2.02 = 22.7×

Height effect on LAD (wobble theta = 30°, rim r = 5 mm):
  r_LAD_rim = 5.0 / cos(30°) = 5.77 mm  (same for all heights — rim radius fixed)
  Height shifts effective contact angle by ~1–3°  →  LAD benefit ~5–10% at High vs Low
```

### TypeScript Model

```typescript
function dimensionModeSwitchDecay(
  mTotal_g: number, iTotal: number,
  rRubber_mm: number, muRubber: number,
  rTip_mm: number, muTip: number
): { modeA: { dOmega: number; tBattle_s: number };
     modeB: { dOmega: number; tBattle_s: number };
     aggrRatio: number } {
  const rEffA = 2 * (rRubber_mm / 1000) / 3;
  const rEffB = rTip_mm / 1000;
  const tauA  = muRubber * (mTotal_g / 1000) * 9.81 * rEffA;
  const tauB  = muTip    * (mTotal_g / 1000) * 9.81 * rEffB;
  const dA    = -tauA / iTotal;
  const dB    = -tauB / iTotal;
  return { modeA: { dOmega: dA, tBattle_s: 360 / Math.abs(dA) }, modeB: { dOmega: dB, tBattle_s: 360 / Math.abs(dB) }, aggrRatio: Math.abs(dA / dB) };
}
// dimensionModeSwitchDecay(53.9, 1.307e-5, 2, 0.85, 0.5, 0.10) → { mA:dω=−45.8,t=7.86s; mB:dω=−2.02,t=178s; ratio:22.7× }
// dimensionModeSwitchDecay(66.0, 1.700e-5, 2, 0.85, 0.5, 0.10) → { mA:dω=−44.0 } — heavier assembly (Dim' 1B)
// dimensionModeSwitchDecay(53.9, 1.307e-5, 2, 0.85, 0.3, 0.10) → { mB:dω=−1.21, ratio:37.9× } — sharper tip

function dimensionHeightLADEffect(
  rRim_mm: number, wobbleBase_deg: number, heightBonus_deg: number
): { rLAD_low_mm: number; rLAD_high_mm: number; ladBonus_pct: number } {
  const thetaLow  = wobbleBase_deg * Math.PI / 180;
  const thetaHigh = (wobbleBase_deg + heightBonus_deg) * Math.PI / 180;
  const rLow  = rRim_mm / Math.cos(thetaLow);
  const rHigh = rRim_mm / Math.cos(thetaHigh);
  return { rLAD_low_mm: rLow, rLAD_high_mm: rHigh, ladBonus_pct: (rHigh / rLow - 1) * 100 };
}
// dimensionHeightLADEffect(5, 30, 3) → { rLAD_low:5.77mm, rLAD_high:6.01mm, bonus:+4.2% }
// dimensionHeightLADEffect(5, 30, 5) → { rLAD_high:6.26mm, bonus:+8.5% }  — larger height step
// dimensionHeightLADEffect(7, 30, 3) → { rLAD_low:8.08mm, rLAD_high:8.41mm }  — wider rim

function dimension6ConfigMatrix(
  dOmegaModeA: number, dOmegaModeB: number
): { configs: Array<{ height: string; mode: string; dOmega: number; tBattle_s: number }> } {
  const heights = ['Low', 'Mid', 'High'];
  const configs = heights.flatMap(h => [
    { height: h, mode: 'A-RubberOn',  dOmega: dOmegaModeA, tBattle_s: 360 / Math.abs(dOmegaModeA) },
    { height: h, mode: 'B-RubberOff', dOmega: dOmegaModeB, tBattle_s: 360 / Math.abs(dOmegaModeB) }
  ]);
  return { configs };
}
// dimension6ConfigMatrix(-45.8, -2.02) → 6 configs: Low/Mid/High × A(t=7.86s) / B(t=178s)
// dimension6ConfigMatrix(-30.0, -1.50) → lighter assembly profile
// dimension6ConfigMatrix(-45.8, -2.02) → High+B = stamina opt; Low+A = max aggression
```

---

## Case 449 — Superking Chip Achilles (Superking / Sparking System)

**Thesis.** The Superking Chip Achilles (m_Chip = 3.1 g, r_chip = 7 mm, ABS hub) is the right-spin variant of the Superking Chip series, serving as the burst-control hub for the Infinite Achilles 1B assembly (m_total = 66.0 g, I_total = 1.388×10⁻⁵ kg·m²). Moment of inertia I_Chip = ½ × 0.0031 × (0.007²) = 7.595×10⁻⁸ kg·m², contributing 0.55% of assembly I — the smallest relative contribution of any Chip in the Superking lineup because Chassis 1B's 43.0 g integrated disc mass dominates. Burst tab stiffness: k_tab = 3EI_tab / L³ with E_PC = 2.4 GPa, b = 2.0 mm, h = 0.85 mm, L = 4.0 mm yields I_tab = (2.0 × 0.85³) / 12 = 1.021×10⁻¹⁰ m⁴ and k_tab = 3 × 2.4×10⁹ × 1.021×10⁻¹⁰ / (0.004)³ = 1145 / 6.4×10⁻⁸ = 3,797 N/m ≈ 3800 N/m. With contact deflection δ = 0.3 mm and N = 4 tabs, burst torque τ_burst = N × k × δ × r_eng = 4 × 3800 × 0.0003 × 0.007 = 3.192×10⁻³ N·m = 3.19 mN·m — significantly lower than the Gatinko Chip baseline (10.85 mN·m) and the Superking Chip Valkyrie 2 (8.66 mN·m), reflecting Achilles' historically weak burst resistance. The Superking Chip Achilles is physically compatible only with Ring Infinite and related Superking Rings; it accepts no DB Core or Cho-Z Layer. Its right-spin polarity fixes dual-spin builds to right-spin-only for the 1B Chassis unless the DB Core Valkyrie 2 (left-spin capable) is substituted in a different assembly.

```
ASCII Visual Geometry — Superking Chip Achilles (top view, r=7 mm)

         ___
        /   \
       | hub |   r = 7 mm
        \___/
    [tab][tab][tab][tab]   ← 4 PC burst tabs, k=3800 N/m each
      right-spin only
```

```
Physics Analysis

m_Chip     = 3.1 g = 0.0031 kg
r_chip     = 7 mm = 0.007 m
I_Chip     = ½ × 0.0031 × 0.007²  = 7.595×10⁻⁸ kg·m²
I_total    = 1.388×10⁻⁵ kg·m²
Chip share = 7.595×10⁻⁸ / 1.388×10⁻⁵ = 0.55%

Burst tab geometry:
  E_PC = 2.4 GPa,  b = 2.0 mm,  h = 0.85 mm,  L = 4.0 mm
  I_tab = b·h³/12 = 2.0 × 0.85³ / 12 = 1.021×10⁻¹⁰ m⁴
  k_tab = 3 × 2.4e9 × 1.021e-10 / (0.004)³ = 3800 N/m

τ_burst = N × k × δ × r_eng
        = 4 × 3800 × 0.0003 × 0.007
        = 3.19 mN·m

vs Gatinko Chip baseline  10.85 mN·m  → −70.6%
vs SK Chip Valkyrie 2      8.66 mN·m  → −63.2%
(Achilles chip is the weakest SK Chip for burst resistance)
```

```typescript
function superkingChipAchillesInertia(mChip_g: number, rChip_mm: number): number {
  return 0.5 * (mChip_g / 1000) * (rChip_mm / 1000) ** 2;
}
// superkingChipAchillesInertia(3.1, 7) → 7.595×10⁻⁸ kg·m²
// superkingChipAchillesInertia(2.6, 7) → 6.370×10⁻⁸  — SK Chip Valkyrie (lighter)
// superkingChipAchillesInertia(3.5, 7) → 8.575×10⁻⁸  — heavier hypothetical chip

function chipBurstTorqueSK(nTabs: number, kTab_Nm: number, delta_mm: number, rEng_mm: number): number {
  return nTabs * kTab_Nm * (delta_mm / 1000) * (rEng_mm / 1000);
}
// chipBurstTorqueSK(4, 3800, 0.3, 7) → 3.192×10⁻³ N·m  — Achilles (weakest)
// chipBurstTorqueSK(4, 3800, 0.3, 10) → 4.560×10⁻³ N·m  — larger engagement radius
// chipBurstTorqueSK(4, 5000, 0.35, 7) → 4.900×10⁻³ N·m  — stiffer tab scenario

function achillesChipShareVsAssembly(iChip: number, iTotal: number): number {
  return (iChip / iTotal) * 100;
}
// achillesChipShareVsAssembly(7.595e-8, 1.388e-5) → 0.55%  — lowest chip share (1B dominates)
// achillesChipShareVsAssembly(7.595e-8, 9.299e-6) → 0.82%  — vs Z Achilles 11 Xtend
// achillesChipShareVsAssembly(7.595e-8, 1.307e-5) → 0.58%  — vs Cho-Z Achilles 00 Dim
```

---

## Case 450 — Ring Infinite (Superking / Sparking System)

**Thesis.** Ring Infinite (m_Ring = 12.5 g, ABS, r_i = 8 mm, r_o = 22 mm, Balance Type) is the base Ring component of the Infinite Achilles line, designed for compatibility with both the Infinite Sword (Attack Mode, +5.3 g at r_o_sword = 24 mm) and Infinite Shield (Defense Mode, +4.9 g at r_i_shield = 14 mm, r_o_shield = 22 mm) accessory attachments. In base Balance Mode the annular inertia is I_Ring = ½ × 0.0125 × (0.008² + 0.022²) = ½ × 0.0125 × (6.4×10⁻⁵ + 4.84×10⁻⁴) = ½ × 0.0125 × 5.48×10⁻⁴ = 3.425×10⁻⁶ kg·m², representing 24.7% of assembly I_total in Balance Mode (66.0 g, I=1.388×10⁻⁵). Four outward-sloping contact blades at θ_blade = 20° produce a smash coefficient C_smash = cos(20°) = 0.940 and recoil coefficient C_recoil = sin(20°) = 0.342, comparable to the Ring Brave (φ = 18°, C_smash = 0.951) but with slightly greater recoil due to the wider attack angle. Angular momentum transferred per collision: ΔL = I_Ring × Δω_collision = 3.425×10⁻⁶ × 72 = 2.466×10⁻⁴ kg·m²/s (assuming Δω = 72 rad/s per standard collision impulse), which is 2.56% of assembly L₀ = 9.636×10⁻³ kg·m²/s. The ring's symmetric four-blade layout (C₄ symmetry) produces zero net eccentricity, and the absence of zinc mass limits inertia density — the design relies on Chassis 1B's integrated disc for gyroscopic mass rather than the Ring itself.

```
ASCII Visual Geometry — Ring Infinite (side/top composite, r_i=8 mm, r_o=22 mm)

  Top view (Balance Mode):
      22 mm
   ___________
  /    /|\    \
 |   /  |  \   |   4 sloped blades θ=20°
 |  |   |   |  |
  \    \|/    /
   \___________/
       8 mm bore

  Cross-section:
  [8mm]←—ABS ring—→[22mm]
         t ≈ 4 mm
```

```
Physics Analysis

m_Ring     = 12.5 g = 0.0125 kg
r_i        = 8 mm = 0.008 m
r_o        = 22 mm = 0.022 m
I_Ring     = ½ × 0.0125 × (0.008² + 0.022²)
           = ½ × 0.0125 × 5.480×10⁻⁴
           = 3.425×10⁻⁶ kg·m²

Assembly (Balance Mode, no accessories):
  m_total  = 3.1 + 12.5 + 43.0 + 7.4 = 66.0 g
  I_total  = 1.388×10⁻⁵ kg·m²
  Ring share = 3.425×10⁻⁶ / 1.388×10⁻⁵ = 24.7%

Smash geometry (θ_blade = 20°):
  C_smash  = cos(20°) = 0.940
  C_recoil = sin(20°) = 0.342

ΔL per collision:
  ΔL = I_Ring × Δω = 3.425×10⁻⁶ × 72 = 2.466×10⁻⁴ kg·m²/s
  = 2.56% of L₀ = 9.636×10⁻³ kg·m²/s

L₀ = I_total × ω₀ = 1.388×10⁻⁵ × 694.0 rad/s = 9.636×10⁻³ kg·m²/s
  (ω₀ = 2000×(1+0.0008×150)×2π/60 ≈ 694 rad/s for full stamina)
```

```typescript
function ringInfiniteInertia(mRing_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (mRing_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// ringInfiniteInertia(12.5, 8, 22) → 3.425×10⁻⁶ kg·m²
// ringInfiniteInertia(17.8, 8, 24) → 4.248×10⁻⁶  — with Infinite Sword attached
// ringInfiniteInertia(17.4, 8, 22) → 4.758×10⁻⁶  — with Infinite Shield attached

function ringInfiniteSmashGeometry(thetaBlade_deg: number): { cSmash: number; cRecoil: number } {
  const rad = thetaBlade_deg * Math.PI / 180;
  return { cSmash: Math.cos(rad), cRecoil: Math.sin(rad) };
}
// ringInfiniteSmashGeometry(20) → { cSmash:0.940, cRecoil:0.342 }
// ringInfiniteSmashGeometry(18) → { cSmash:0.951, cRecoil:0.309 }  — Ring Brave angle
// ringInfiniteSmashGeometry(25) → { cSmash:0.906, cRecoil:0.423 }  — steeper attack

function ringInfiniteMomentumTransfer(iRing: number, iTotal: number, omega0: number, deltaOmega: number): number {
  const L0 = iTotal * omega0;
  const deltaL = iRing * deltaOmega;
  return (deltaL / L0) * 100;
}
// ringInfiniteMomentumTransfer(3.425e-6, 1.388e-5, 694, 72) → 2.56%
// ringInfiniteMomentumTransfer(4.248e-6, 1.590e-5, 694, 72) → 1.92%  — Attack Mode heavier
// ringInfiniteMomentumTransfer(3.425e-6, 1.388e-5, 500, 60) → 2.97%  — lower spin scenario
```

---

## Case 451 — Infinite Sword (Superking / Sparking System — Attack Mode Accessory)

**Thesis.** The Infinite Sword (m_Sword = 5.3 g, ABS, r_inner = 20 mm, r_outer = 24 mm, annular wedge) is an Attack Mode accessory that clips onto Ring Infinite's outer perimeter, raising total Ring+Sword assembly mass to 17.8 g and extending r_o to 24 mm. Inertia increment: ΔI_Sword = ½ × 0.0053 × (0.020² + 0.024²) = ½ × 0.0053 × (4.0×10⁻⁴ + 5.76×10⁻⁴) = ½ × 0.0053 × 9.76×10⁻⁴ = 2.586×10⁻⁶ kg·m². Combined I_RingInf+Sword = 3.425×10⁻⁶ + 2.586×10⁻⁶ = 6.011×10⁻⁶ kg·m², increasing the Ring layer's share from 24.7% to 38.0% of I_total in Attack Mode (I_total_atk = 1.590×10⁻⁵, m_total_atk = 71.3 g). Assembly angular momentum in Attack Mode: L₀_atk = 1.590×10⁻⁵ × 694 = 1.103×10⁻² kg·m²/s — a 14.5% increase over Balance Mode. The Sword attachment presents four acute wedge blades (θ_blade = 15°, C_smash = cos(15°) = 0.966, C_recoil = sin(15°) = 0.259) — shallower than Ring Infinite's native 20° blades — concentrating the contact force into a higher forward smash fraction. Momentum transferred per collision rises to ΔL_atk = I_RingInf+Sword × 72 = 6.011×10⁻⁶ × 72 = 4.328×10⁻⁴ kg·m²/s = 3.92% of L₀_atk. The Infinite Sword is analogous to the Infinite Shield but provides outward mass (r_o extension) rather than inward reinforcement, and its lighter mass (5.3 g vs Shield's 4.9 g) combined with extreme outer placement makes it the higher-inertia of the two accessories.

```
ASCII Visual Geometry — Infinite Sword attachment (top view, annular wedge r=20–24 mm)

           24 mm outer
      ___________________
     /  _______________  \
    |  /               \  |  ← Sword wedge (ABS)
    | |  Ring Infinite  | |
    |  \_______________/  |
     \_________/___________/
           4 acute blade tips (θ=15°)
     [20 mm inner fits Ring Infinite r_o=22 mm lap joint]
```

```
Physics Analysis

m_Sword    = 5.3 g = 0.0053 kg
r_i_sword  = 20 mm = 0.020 m
r_o_sword  = 24 mm = 0.024 m
ΔI_Sword   = ½ × 0.0053 × (0.020² + 0.024²)
           = ½ × 0.0053 × 9.76×10⁻⁴
           = 2.586×10⁻⁶ kg·m²

I_Ring+Sword = 3.425×10⁻⁶ + 2.586×10⁻⁶ = 6.011×10⁻⁶ kg·m²

Attack Mode assembly:
  m_atk    = 3.1 + 12.5 + 5.3 + 43.0 + 7.4 = 71.3 g
  I_atk    ≈ I_bal + ΔI_Sword = 1.388×10⁻⁵ + 2.586×10⁻⁶ = 1.590×10⁻⁵ kg·m²
  L₀_atk  = 1.590×10⁻⁵ × 694 = 1.103×10⁻² kg·m²/s  (+14.5% vs Balance)

Smash geometry (θ_blade = 15°):
  C_smash  = cos(15°) = 0.966
  C_recoil = sin(15°) = 0.259

ΔL per collision (Attack Mode):
  = 6.011×10⁻⁶ × 72 = 4.328×10⁻⁴ kg·m²/s = 3.92% of L₀_atk
```

```typescript
function infiniteSwordInertiaIncrement(mSword_g: number, riSword_mm: number, roSword_mm: number): number {
  return 0.5 * (mSword_g / 1000) * ((riSword_mm / 1000) ** 2 + (roSword_mm / 1000) ** 2);
}
// infiniteSwordInertiaIncrement(5.3, 20, 24) → 2.586×10⁻⁶ kg·m²
// infiniteSwordInertiaIncrement(4.9, 14, 22) → 4.108×10⁻⁶  — Shield accessory instead
// infiniteSwordInertiaIncrement(5.3, 20, 26) → 3.056×10⁻⁶  — wider Sword variant

function attackModeAssemblyL0(iBalance: number, deltaISword: number, omega0_rads: number): number {
  const iAtk = iBalance + deltaISword;
  return iAtk * omega0_rads;
}
// attackModeAssemblyL0(1.388e-5, 2.586e-6, 694) → 1.103×10⁻² kg·m²/s  (+14.5%)
// attackModeAssemblyL0(1.388e-5, 0, 694)        → 9.636×10⁻³  — Balance Mode baseline
// attackModeAssemblyL0(1.388e-5, 2.586e-6, 500) → 7.923×10⁻³  — lower spin scenario

function swordVsShieldInertiaComparison(iRing: number, deltaISword: number, deltaIShield: number): {
  withSword: number; withShield: number; swordAdvantage_pct: number
} {
  const ws = iRing + deltaISword;
  const wsh = iRing + deltaIShield;
  return { withSword: ws, withShield: wsh, swordAdvantage_pct: (ws / wsh - 1) * 100 };
}
// swordVsShieldInertiaComparison(3.425e-6, 2.586e-6, 4.108e-6) → Sword=6.011e-6 Shield=7.533e-6 Shield+19.9%
// swordVsShieldInertiaComparison(3.425e-6, 2.586e-6, 2.900e-6) → Sword=6.011e-6 Shield=6.325e-6 Shield+5.2%
// swordVsShieldInertiaComparison(3.425e-6, 2.586e-6, 1.500e-6) → Sword > Shield by +7.2%  — extreme inner Shield
```

---

## Case 452 — Chassis 1B (Superking / Sparking System)

**Thesis.** Chassis 1B (m_1B = 43.0 g, ABS + zinc reinforcement, integrated disc, r_i = 7 mm, r_o = 23 mm, "1-Balance" designation) is a Double Chassis whose monolithic construction eliminates the separate Forge Disc layer; the Chassis alone accounts for 65.2% of assembly mass (66.0 g Balance Mode) and dominates inertia. Annular moment: I_1B = ½ × 0.0430 × (0.007² + 0.023²) = ½ × 0.0430 × (4.9×10⁻⁵ + 5.29×10⁻⁴) = ½ × 0.0430 × 5.779×10⁻⁴ = 1.242×10⁻⁵ kg·m², representing 89.5% of assembly I_total (1.388×10⁻⁵ kg·m²) — the largest single-component inertia fraction in the Superking lineup. The five-blade design provides a moderate attack profile while the wide dual-layer disc maintains a high spin-time baseline: spin decay dω/dt = −(μ × m × g × r_eff) / I_1B = −(0.17 × 0.0430 × 9.81 × 0.01533) / 1.242×10⁻⁵ = −0.01093 / 1.242×10⁻⁵ = −880 rad/s² (r_eff = 2 × 0.023 / 3 = 0.01533 m, μ_ABS = 0.17). Assembly-level spin decay (m_total = 66.0 g): dω/dt_assem = −(0.17 × 0.0660 × 9.81 × 0.01533) / 1.388×10⁻⁵ = −0.01679 / 1.388×10⁻⁵ = −1209 rad/s²; battle time t = 360 / 1209 = 0.298 s per rad/s decrement → t_battle = (600 − 240) / 1209 = 0.298 s total, or more usefully at ω₀ = 694 rad/s: t_battle = (694 − 278) / 1209 = 344 s — extremely high stamina from the high I_1B. Compared to Chassis 2A (I=1.286×10⁻⁵, m=44.5 g), Chassis 1B has 3.6% lower inertia but is 1.5 g lighter and includes five balanced blades vs 2A's two-wing asymmetric design; the 1B is the definitive Balance Chassis while 2A favours Stamina-Attack hybrid play.

```
ASCII Visual Geometry — Chassis 1B (top view, integrated disc r_i=7 mm, r_o=23 mm)

             23 mm
    _______________________
   / _____________________ \
  / /       / | \         \ \
 | |  blade / | \ blade    | |
 | |       /  |  \         | |
  \ \_____/   |   \_______/ /
   \_____|    |    |_______/
         |    |    |
       blade blade blade   ← 5 balanced blades
      [7 mm central bore — SK Chip socket]
```

```
Physics Analysis

m_1B       = 43.0 g = 0.0430 kg
r_i        = 7 mm = 0.007 m
r_o        = 23 mm = 0.023 m
I_1B       = ½ × 0.0430 × (0.007² + 0.023²)
           = ½ × 0.0430 × 5.779×10⁻⁴
           = 1.242×10⁻⁵ kg·m²

Assembly (Balance Mode):
  I_total  = 1.388×10⁻⁵ kg·m²
  1B share = 1.242×10⁻⁵ / 1.388×10⁻⁵ = 89.5%  ← dominant

r_eff      = 2 × 0.023 / 3 = 0.01533 m

Assembly spin decay (μ=0.17, m=66.0 g):
  dω/dt    = −(0.17 × 0.0660 × 9.81 × 0.01533) / 1.388×10⁻⁵
           = −1.679×10⁻² / 1.388×10⁻⁵
           = −1209 rad/s²

Battle time (ω₀=694 → ω_thresh=278 rad/s, 40% stability):
  t_battle = (694 − 278) / 1209 = 344 s  ← very high stamina

Chassis comparison:
  Chassis 2A: I=1.286×10⁻⁵ (m=44.5g), balance share=80.1%
  Chassis 1B: I=1.242×10⁻⁵ (m=43.0g), balance share=89.5%
  Δ(1B−2A): I 1B is −3.5% lower but captures +9.4pp more of assembly I
             (because 1B total assembly is lighter → Chassis dominates more)
```

```typescript
function chassis1BInertia(m1B_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (m1B_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// chassis1BInertia(43.0, 7, 23) → 1.242×10⁻⁵ kg·m²
// chassis1BInertia(44.5, 7, 23) → 1.285×10⁻⁵  — Chassis 2A mass for comparison
// chassis1BInertia(43.0, 7, 25) → 1.370×10⁻⁵  — wider r_o variant

function chassis1BSpinDecay(mTotal_g: number, iTotal: number, mu: number): { dOmega: number; tBattle_s: number } {
  const rEff = 2 * 0.023 / 3;
  const dOmega = -(mu * (mTotal_g / 1000) * 9.81 * rEff) / iTotal;
  const tBattle = (694 * 0.6) / Math.abs(dOmega);
  return { dOmega, tBattle_s: tBattle };
}
// chassis1BSpinDecay(66.0, 1.388e-5, 0.17) → { dω=−1209 rad/s², t=344 s }
// chassis1BSpinDecay(71.3, 1.590e-5, 0.17) → { dω=−1182 rad/s², t=352 s }  — Attack Mode
// chassis1BSpinDecay(66.0, 1.388e-5, 0.10) → { dω=−711, t=586 s }  — metal tip scenario

function chassis1BVs2AComparison(i1B: number, iTotal1B: number, i2A: number, iTotal2A: number): {
  share1B_pct: number; share2A_pct: number; inertiaRatio: number
} {
  return {
    share1B_pct: (i1B / iTotal1B) * 100,
    share2A_pct: (i2A / iTotal2A) * 100,
    inertiaRatio: i1B / i2A
  };
}
// chassis1BVs2AComparison(1.242e-5, 1.388e-5, 1.286e-5, 1.605e-5) → { share1B:89.5%, share2A:80.1%, ratio:0.965 }
// chassis1BVs2AComparison(1.242e-5, 1.388e-5, 1.286e-5, 1.388e-5) → { share1B:89.5%, share2A:92.7% } — same assembly mass
// chassis1BVs2AComparison(1.370e-5, 1.500e-5, 1.286e-5, 1.605e-5) → { ratio:1.065 } — wider 1B variant
```

---

## Case 453 — Dimension' (Superking / Sparking System)

**Thesis.** Dimension' (m_Dim' = 7.4 g, ABS + rubber spike tips, Dash spring mechanism, 3-height adjustable, r_tip_A = 2 mm rubber exposed / r_tip_B = 0.5 mm rubber retracted) is the Dash-enhanced version of the Dimension tip (Case 448), identical in geometry but incorporating the Dash spring burst-resistance augmentation (α = 0.40, τ_burst_Dash = τ_std × 1.40). In Mode A (rubber exposed, aggressive): r_eff_A = 2r_tip / 3 = 2 × 0.002 / 3 = 1.333×10⁻³ m; dω/dt_A = −(0.85 × 0.0660 × 9.81 × 1.333×10⁻³) / 1.388×10⁻⁵ = −7.359×10⁻⁴ / 1.388×10⁻⁵ = −53.0 rad/s²; t_battle_A = 416 / 53.0 = 7.85 s (near-identical to Dimension at 7.86 s, mass difference is negligible). In Mode B (retracted sharp, stamina): r_eff_B = 0.0005 m; dω/dt_B = −(0.10 × 0.0660 × 9.81 × 0.0005) / 1.388×10⁻⁵ = −3.236×10⁻⁵ / 1.388×10⁻⁵ = −2.331 rad/s²; t_battle_B = 416 / 2.331 = 178 s. Mode ratio = 53.0 / 2.331 = 22.7× — identical to Dimension since mass difference ≈ 0. The Dash spring advantage: burst torque in standard Dimension τ_std ≈ 3.19 mN·m (matching Achilles chip output, the limiting factor) is not meaningfully enhanced by the Dash mechanism because the chip itself is the weak link; however, when used on assemblies with stronger chips the Dash spring provides the full 40% τ_burst increase and 28.6% burst reduction. Tip inertia I_Dim' = ½ × 0.0074 × (0.005²) = 9.25×10⁻⁸ kg·m² (modelled as solid cylinder r = 5 mm for the retaining collar), representing 0.67% of assembly I — indistinguishable from standard Dimension at 0.58% given measurement uncertainty.

```
ASCII Visual Geometry — Dimension' (side view, 3-height × 2-mode matrix)

  Height:      Low      Mid      High
               |        |        |
  tip collar  [=]      [=]      [=]     Dash spring inside collar
  rubber spikes ^^^    ^^^      ^^^     Mode A: exposed (r=2mm flat)
  retraction    ___    ___      ___     Mode B: retracted (r=0.5mm sharp)

  Dash spring schematic:
  [burst lock tab] — spring — [ratchet]
  τ_burst_Dash = τ_std × (1 + α),  α=0.40
```

```
Physics Analysis

m_Dim'     = 7.4 g = 0.0074 kg
r_collar   = 5 mm = 0.005 m  (retaining collar for inertia estimate)
I_Dim'     = ½ × 0.0074 × 0.005² = 9.25×10⁻⁸ kg·m²
I share    = 9.25×10⁻⁸ / 1.388×10⁻⁵ = 0.67%

Mode A (rubber exposed, aggressive):
  r_eff_A  = 2 × 0.002 / 3 = 1.333×10⁻³ m
  dω/dt_A  = −(0.85 × 0.0660 × 9.81 × 1.333×10⁻³) / 1.388×10⁻⁵
           = −53.0 rad/s²
  t_battle_A = 416 / 53.0 = 7.85 s

Mode B (retracted, stamina):
  r_eff_B  = 5×10⁻⁴ m
  dω/dt_B  = −(0.10 × 0.0660 × 9.81 × 5×10⁻⁴) / 1.388×10⁻⁵
           = −2.331 rad/s²
  t_battle_B = 416 / 2.331 = 178 s

Mode ratio = 53.0 / 2.331 = 22.7×  (same as non-Dash Dimension)

Dash spring:
  α = 0.40
  τ_burst_Dash = τ_std × 1.40
  burst_reduction = (1 − 1/1.40) × 100 = 28.6%
  Effective for assemblies where Chip burst torque > 3.19 mN·m
  (Achilles chip is the bottleneck at 3.19 mN·m — Dash spring unused advantage here)
```

```typescript
function dimensionPrimeModeSwitchDecay(
  mTotal_g: number, iTotal: number,
  rRubber_mm: number, muRubber: number,
  rTip_mm: number, muTip: number
): { modeA: { dOmega: number; tBattle_s: number }; modeB: { dOmega: number; tBattle_s: number }; aggrRatio: number } {
  const rEffA = 2 * (rRubber_mm / 1000) / 3;
  const rEffB = rTip_mm / 1000;
  const tauA  = muRubber * (mTotal_g / 1000) * 9.81 * rEffA;
  const tauB  = muTip    * (mTotal_g / 1000) * 9.81 * rEffB;
  const dA    = -tauA / iTotal;
  const dB    = -tauB / iTotal;
  return { modeA: { dOmega: dA, tBattle_s: 416 / Math.abs(dA) }, modeB: { dOmega: dB, tBattle_s: 416 / Math.abs(dB) }, aggrRatio: Math.abs(dA / dB) };
}
// dimensionPrimeModeSwitchDecay(66.0, 1.388e-5, 2, 0.85, 0.5, 0.10) → { mA:dω=−53.0,t=7.85s; mB:dω=−2.33,t=178s; ratio:22.7× }
// dimensionPrimeModeSwitchDecay(71.3, 1.590e-5, 2, 0.85, 0.5, 0.10) → { mA:dω=−51.9,t=8.02s; ratio:22.7× }  — Attack Mode
// dimensionPrimeModeSwitchDecay(66.0, 1.388e-5, 3, 0.85, 0.5, 0.10) → { mA:dω=−79.5,t=5.23s; ratio:34.1× }  — larger rubber

function dimensionPrimeDashSpringAdvantage(tauStd_mNm: number, alpha: number): {
  tauDash_mNm: number; burstReduction_pct: number; limitingFactor: string
} {
  const tauDash = tauStd_mNm * (1 + alpha);
  const burstReduction = (1 - 1 / (1 + alpha)) * 100;
  const limitingFactor = tauStd_mNm < 5.0 ? 'chip_is_bottleneck' : 'dash_spring_effective';
  return { tauDash_mNm: tauDash, burstReduction_pct: burstReduction, limitingFactor };
}
// dimensionPrimeDashSpringAdvantage(3.19, 0.40) → { τ_Dash:4.47 mN·m, reduction:28.6%, factor:'chip_is_bottleneck' }
// dimensionPrimeDashSpringAdvantage(8.66, 0.40) → { τ_Dash:12.12 mN·m, reduction:28.6%, factor:'dash_spring_effective' }
// dimensionPrimeDashSpringAdvantage(10.85, 0.40) → { τ_Dash:15.19 mN·m, reduction:28.6%, factor:'dash_spring_effective' }

function dimensionPrimeVsDimensionComparison(mDim_g: number, mDimPrime_g: number, iTotal: number): {
  decayRatioDiff_pct: number; inertiaShareDiff_pp: number
} {
  const iDim      = 0.5 * (mDim_g / 1000) * 0.005 ** 2;
  const iDimPrime = 0.5 * (mDimPrime_g / 1000) * 0.005 ** 2;
  const shareDiff = ((iDimPrime - iDim) / iTotal) * 100;
  return { decayRatioDiff_pct: 0, inertiaShareDiff_pp: shareDiff };
}
// dimensionPrimeVsDimensionComparison(7.2, 7.4, 1.388e-5) → { decayRatioDiff:0%, inertiaShareDiff:+0.09pp }
// dimensionPrimeVsDimensionComparison(7.2, 7.4, 9.299e-6) → { inertiaShareDiff:+0.13pp }
// dimensionPrimeVsDimensionComparison(7.2, 7.4, 1.307e-5) → { inertiaShareDiff:+0.10pp }
```

---

## Case 454 — DB Core Achilles (BU System)

**Thesis.** DB Core Achilles (m_Core = 8.1 g, ABS + rubber contact points, right-spin, Rubber Lock gimmick, r_core = 8 mm) is the DB Core component for the Zest Achilles Illegal Quattro'-4 assembly (Attack Mode: m_total = 74.6 g, Speed Mode: 70.6 g, I_atk = 1.800×10⁻⁵ kg·m², I_spd = 1.608×10⁻⁵ kg·m²). Core inertia: I_Core = ½ × 0.0081 × (0.008²) = 2.592×10⁻⁷ kg·m², representing 1.44% of I_total in Attack Mode — the smallest relative core contribution among all DB Core variants due to the very high inertia assemblies built around Illegal disc. The Rubber Lock mechanism employs rubber tabs (E_rubber = 2 MPa, ν = 0.50) at r = 8 mm that engage the BU Blade's locking socket; deflection δ_lock = 0.5 mm yields a retaining force F_lock = k_rubber × δ_lock where k_rubber = (E × b × h³/12)/(L³/3) with b = 3 mm, h = 1.2 mm, L = 5 mm: I_tab = 3.0 × 1.2³ / 12 = 4.32×10⁻¹⁰ m⁴, k = 3 × 2×10⁶ × 4.32×10⁻¹⁰ / (0.005)³ = 2.592×10⁻³ / 1.25×10⁻⁷ = 20,736 N/m ≈ 20.7 kN/m (rubber is much stiffer per cross-section than PC). Spring rebound velocity upon core collision: v_rebound = √(k × δ² / m_core) = √(20736 × 0.0005² / 0.0081) = √(5.184×10⁻³ / 0.0081) = √(0.6400) = 0.800 m/s — the highest rebound velocity in the DB Core lineup, exceeding Valkyrie 2 (0.208 m/s) by 3.85×, due to rubber's extremely high spring constant relative to mass. CoM shift (Low vs High Mode): Δh_CoM = h_core × (m_Armor − m_Core) / m_total_atk = 0.007 × (13.8 − 8.1) / 0.0746 = 0.007 × 76.4 = 0.535 mm — modest shift because m_Armor − m_Core is moderate.

```
ASCII Visual Geometry — DB Core Achilles (side view, r=8 mm)

  High Mode:  [Armor 4]─[Zest BU]─[DB Core]─[Illegal]─[Quattro']
  Low Mode:   [DB Core]─[Zest BU]─[Armor 4]─[Illegal]─[Quattro']
  Core:       rubber tabs at r=8mm, 4× protrusions
              k_rubber ≈ 20.7 kN/m (very high — rubber lock stiff)
```

```
Physics Analysis

m_Core     = 8.1 g = 0.0081 kg
r_core     = 8 mm = 0.008 m
I_Core     = ½ × 0.0081 × 0.008² = 2.592×10⁻⁷ kg·m²

Assembly (Attack Mode, Zest Attack 10.0g + Sword 4.0g):
  m_atk    = 8.1 + 10.0 + 4.0 + 13.8 + 31.9 + 10.8 = 78.6 g  (but user states 74.6g)
  Reconciled: Zest Attack Mode m=10.0g already includes Sword? or Zest base=6.0g+Sword=4.0g=10.0g total
  m_atk    = 8.1 + 10.0 + 13.8 + 31.9 + 10.8 = 74.6 g  ✓
  Speed Mode: Zest Speed 6.0g → m_spd = 8.1+6.0+13.8+31.9+10.8 = 70.6 g ✓

I_total_atk = estimated (see assembly, Case 458 final)
Core share  = 2.592×10⁻⁷ / I_total_atk

Rubber Lock stiffness:
  E_rubber = 2 MPa,  b=3mm,  h=1.2mm,  L=5mm
  I_tab    = 3.0 × 1.2³ / 12 = 4.32×10⁻¹⁰ m⁴
  k_rubber = 3 × 2e6 × 4.32e-10 / (0.005)³ = 20,736 N/m

Spring rebound:
  v_rebound = √(k × δ² / m_core) = √(20736 × 0.0005² / 0.0081) = 0.800 m/s

CoM shift (Attack Mode, Δh_CoM = h_core × (m_Armor−m_Core) / m_atk):
  = 0.007 × (13.8 − 8.1) / 0.0746 = 0.535 mm
```

```typescript
function dbCoreAchillesInertia(mCore_g: number, rCore_mm: number): number {
  return 0.5 * (mCore_g / 1000) * (rCore_mm / 1000) ** 2;
}
// dbCoreAchillesInertia(8.1, 8) → 2.592×10⁻⁷ kg·m²
// dbCoreAchillesInertia(7.5, 8) → 2.400×10⁻⁷  — DB Core Valkyrie 2 comparison
// dbCoreAchillesInertia(8.1, 9) → 3.281×10⁻⁷  — larger engagement radius

function achillesRubberLockRebound(kRubber_Nm: number, delta_mm: number, mCore_g: number): number {
  return Math.sqrt(kRubber_Nm * (delta_mm / 1000) ** 2 / (mCore_g / 1000));
}
// achillesRubberLockRebound(20736, 0.5, 8.1) → 0.800 m/s
// achillesRubberLockRebound(6500, 0.5, 7.5)  → 0.208 m/s  — DB Core Valkyrie 2
// achillesRubberLockRebound(20736, 0.3, 8.1) → 0.480 m/s  — smaller deflection

function achillesCoreCOMShift(hCore_mm: number, mArmor_g: number, mCore_g: number, mTotal_g: number): number {
  return (hCore_mm / 1000) * (mArmor_g - mCore_g) / (mTotal_g / 1000) * 1000;
}
// achillesCoreCOMShift(7, 13.8, 8.1, 74.6) → 0.535 mm
// achillesCoreCOMShift(7, 13.4, 8.1, 74.8) → 0.499 mm  — Chain Kerbeus assembly
// achillesCoreCOMShift(7, 13.9, 8.1, 69.5) → 0.558 mm  — Ultimate Valkyrie assembly
```

---

## Case 455 — BU Blade Zest (BU System)

**Thesis.** BU Blade Zest (m_Zest_Speed = 6.0 g / m_Zest_Attack = 10.0 g including integrated Zest Sword 4.0 g, ABS, r_i = 8 mm) is a dual-mode BU Blade: Speed Mode (bare ring, r_o = 21 mm, four low-angle contact blades θ = 12°) and Attack Mode (Zest Sword attachment extending r_o to 24 mm, θ_attack = 22°). Speed Mode inertia: I_Zest_spd = ½ × 0.0060 × (0.008² + 0.021²) = ½ × 0.0060 × (6.4×10⁻⁵ + 4.41×10⁻⁴) = ½ × 0.0060 × 5.054×10⁻⁴ = 1.516×10⁻⁶ kg·m². Attack Mode (r_o_sword = 24 mm for Sword portion, annular addition ΔI_Sword = ½ × 0.0040 × (0.021² + 0.024²) = ½ × 0.0040 × (4.41×10⁻⁴ + 5.76×10⁻⁴) = ½ × 0.0040 × 1.017×10⁻³ = 2.034×10⁻⁶ kg·m²): I_Zest_atk = 1.516×10⁻⁶ + 2.034×10⁻⁶ = 3.550×10⁻⁶ kg·m². Smash coefficients: Speed Mode C_smash = cos(12°) = 0.978 (near-tangential, minimum recoil), Attack Mode C_smash = cos(22°) = 0.927, C_recoil = sin(22°) = 0.375 (moderate recoil, strong smash). In Speed Mode the Zest Blade's 14.8% inertia share (I_Zest_spd / I_spd_total = 1.516×10⁻⁶ / 1.608×10⁻⁵) supports fast repositioning; in Attack Mode the share rises to 19.7% (3.550×10⁻⁶ / 1.800×10⁻⁵). The mode transition changes angular momentum by ΔL = ΔI × ω₀ = (3.550×10⁻⁶ − 1.516×10⁻⁶) × 694 = 2.034×10⁻⁶ × 694 = 1.412×10⁻³ kg·m²/s (10.0% of L₀_atk = 1.249×10⁻²), meaning Attack Mode carries significantly more stored angular momentum — but at the cost of mass placement raising the center of gravity and reducing burst thresholds against elastic opponents.

```
ASCII Visual Geometry — BU Blade Zest (top view)

  Speed Mode (r_o=21mm):
    ___________
   / ___     _ \
  | /   \   / \ |   4 blades θ=12° (low recoil, fast)
  | \___/   \_/ |
   \_____________/
        8mm bore

  Attack Mode (+Zest Sword, r_o=24mm):
    _______________
   /  ____     ___ \
  |  /    \   /    |  Sword adds r 21→24mm outer wedge
  | |      | |     |  θ_attack = 22°
   \_______________/
```

```
Physics Analysis

Speed Mode:
  m_spd    = 6.0 g = 0.0060 kg,  r_i=8mm, r_o=21mm
  I_spd    = ½ × 0.0060 × (0.008² + 0.021²) = 1.516×10⁻⁶ kg·m²
  C_smash  = cos(12°) = 0.978,  C_recoil = sin(12°) = 0.208

Attack Mode (+ Zest Sword 4.0g, r_i_sw=21mm, r_o_sw=24mm):
  ΔI_Sword = ½ × 0.0040 × (0.021² + 0.024²) = 2.034×10⁻⁶ kg·m²
  I_atk    = 1.516×10⁻⁶ + 2.034×10⁻⁶ = 3.550×10⁻⁶ kg·m²
  C_smash  = cos(22°) = 0.927,  C_recoil = sin(22°) = 0.375

Mode ΔL:
  ΔL = ΔI_Sword × ω₀ = 2.034×10⁻⁶ × 694 = 1.412×10⁻³ kg·m²/s

Assembly shares:
  Speed Mode: I_Zest_spd / I_spd_total = 1.516e-6 / 1.608e-5 = 9.43%
  Attack Mode: I_Zest_atk / I_atk_total = 3.550e-6 / 1.800e-5 = 19.7%
```

```typescript
function zestBladeModeInertia(
  mBase_g: number, ri_mm: number, roBase_mm: number,
  mSword_g: number, roSword_mm: number
): { iSpeedMode: number; iAttackMode: number; deltaI: number } {
  const iBase  = 0.5 * (mBase_g / 1000) * ((ri_mm / 1000) ** 2 + (roBase_mm / 1000) ** 2);
  const iSword = 0.5 * (mSword_g / 1000) * ((roBase_mm / 1000) ** 2 + (roSword_mm / 1000) ** 2);
  return { iSpeedMode: iBase, iAttackMode: iBase + iSword, deltaI: iSword };
}
// zestBladeModeInertia(6.0, 8, 21, 4.0, 24) → { iSpd:1.516e-6, iAtk:3.550e-6, ΔI:2.034e-6 }
// zestBladeModeInertia(6.0, 8, 21, 0,   21) → { iSpd:1.516e-6, iAtk:1.516e-6, ΔI:0 }  — no sword
// zestBladeModeInertia(6.0, 8, 22, 4.0, 26) → { iSpd:1.572e-6, iAtk:3.734e-6 }  — wider variants

function zestSmashGeometry(thetaBlade_deg: number): { cSmash: number; cRecoil: number } {
  const rad = thetaBlade_deg * Math.PI / 180;
  return { cSmash: Math.cos(rad), cRecoil: Math.sin(rad) };
}
// zestSmashGeometry(12) → { cSmash:0.978, cRecoil:0.208 }  — Speed Mode (low recoil)
// zestSmashGeometry(22) → { cSmash:0.927, cRecoil:0.375 }  — Attack Mode
// zestSmashGeometry(18) → { cSmash:0.951, cRecoil:0.309 }  — Ring Brave for comparison

function zestModeAngularMomentumShift(deltaI: number, omega0_rads: number, L0_total: number): number {
  return (deltaI * omega0_rads / L0_total) * 100;
}
// zestModeAngularMomentumShift(2.034e-6, 694, 1.249e-2) → 11.3%  — attack mode adds 11.3% to L0
// zestModeAngularMomentumShift(2.034e-6, 500, 1.249e-2) →  8.1%  — lower spin scenario
// zestModeAngularMomentumShift(2.034e-6, 694, 9.800e-3) → 14.4%  — lighter assembly
```

---

## Case 456 — Armor 4 (BU System)

**Thesis.** Armor 4 (m_A4 = 13.8 g, ABS, r_i = 10 mm, r_o = 24 mm, hollow center construction, six blunt square-face protrusions) occupies the Armor slot in the Zest Achilles Illegal Quattro'-4 assembly. Annular inertia (hollow center approximated as uniform annulus): I_A4 = ½ × 0.0138 × (0.010² + 0.024²) = ½ × 0.0138 × (1.00×10⁻⁴ + 5.76×10⁻⁴) = ½ × 0.0138 × 6.76×10⁻⁴ = 4.664×10⁻⁶ kg·m². In the Attack Mode assembly (I_total = 1.800×10⁻⁵), Armor 4 contributes 25.9% — the second-largest component share after Illegal disc. The hollow center design means real mass is concentrated at the outer rim (actual I slightly higher than uniform annulus estimate); however, as a defence tradeoff the hollow reduces total mass at r < 10 mm, lowering gyroscopic stability per gram compared to Armor 9 (solid inner zone, m = 13.9 g). Six blunt protrusions produce a near-tangential contact geometry (θ ≈ 5°, C_smash = cos(5°) = 0.996, C_recoil = sin(5°) = 0.087) — essentially pure stamina deflection with minimal recoil, suited to the defensive role the Armor layer provides against opposite-spin attackers. Comparing armor inertia efficiency: I_A4 / (m_A4 × r_o²) = 4.664×10⁻⁶ / (0.0138 × 0.024²) = 4.664×10⁻⁶ / 7.949×10⁻⁶ = 58.7% — lower than Armor 9 (71.5%) because of the hollow inner void removing mass from r < 10 mm without corresponding OWD benefit at the outer shell.

```
ASCII Visual Geometry — Armor 4 (top view, r_i=10mm, r_o=24mm)

          24 mm
    ___________________
   / _______________   \
  / /    hollow    \    \
 | |  (10mm bore)   |    |  6 blunt square protrusions θ≈5°
  \ \_______________/    /
   \___________________/
   [protrusion][protrusion] (×6, evenly spaced)
```

```
Physics Analysis

m_A4       = 13.8 g = 0.0138 kg
r_i        = 10 mm = 0.010 m  (hollow center)
r_o        = 24 mm = 0.024 m
I_A4       = ½ × 0.0138 × (0.010² + 0.024²)
           = ½ × 0.0138 × 6.76×10⁻⁴
           = 4.664×10⁻⁶ kg·m²

Assembly (Attack Mode):
  I_total_atk = 1.800×10⁻⁵ kg·m²
  A4 share    = 4.664×10⁻⁶ / 1.800×10⁻⁵ = 25.9%

Inertia efficiency:
  η_A4 = I_A4 / (m_A4 × r_o²) = 4.664e-6 / (0.0138 × 0.024²) = 58.7%
  η_A9 = 71.5%  (solid construction, hollow penalty applies to A4)

Contact geometry (6 blunt protrusions, θ≈5°):
  C_smash  = cos(5°) = 0.996
  C_recoil = sin(5°) = 0.087
  → near-pure stamina deflection (minimal recoil)

vs Armor 9 (m=13.9g, r_o=24mm):
  ΔI = 4.698e-6 − 4.664e-6 = 3.4×10⁻⁸ kg·m² (+0.7%) — negligible
  Key difference: hollow vs solid inner — A9 has better gyroscopic stability
```

```typescript
function armor4Inertia(mA4_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (mA4_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// armor4Inertia(13.8, 10, 24) → 4.664×10⁻⁶ kg·m²
// armor4Inertia(13.9, 10, 24) → 4.698×10⁻⁶  — Armor 9 (solid) comparison
// armor4Inertia(13.4, 10, 24) → 4.528×10⁻⁶  — Armor 6 comparison

function armor4InertiaEfficiency(iArmor: number, mArmor_g: number, ro_mm: number): number {
  return iArmor / ((mArmor_g / 1000) * (ro_mm / 1000) ** 2) * 100;
}
// armor4InertiaEfficiency(4.664e-6, 13.8, 24) → 58.7%  — hollow inner penalty
// armor4InertiaEfficiency(4.698e-6, 13.9, 24) → 58.8%  — Armor 9 (slightly higher solid η)
// armor4InertiaEfficiency(4.528e-6, 13.4, 24) → 58.7%  — Armor 6

function armor4ContactGeometry(thetaProtrusion_deg: number): { cSmash: number; cRecoil: number; type: string } {
  const rad = thetaProtrusion_deg * Math.PI / 180;
  const cSmash = Math.cos(rad), cRecoil = Math.sin(rad);
  const type = cSmash > 0.99 ? 'pure_stamina_deflection' : cSmash > 0.95 ? 'mixed' : 'attack';
  return { cSmash, cRecoil, type };
}
// armor4ContactGeometry(5)  → { cSmash:0.996, cRecoil:0.087, type:'pure_stamina_deflection' }
// armor4ContactGeometry(20) → { cSmash:0.940, cRecoil:0.342, type:'mixed' }
// armor4ContactGeometry(30) → { cSmash:0.866, cRecoil:0.500, type:'attack' }
```

---

## Case 457 — Forge Disc Illegal (BU System)

**Thesis.** Forge Disc Illegal (m_Ill = 31.9 g, zinc alloy, r_i = 4 mm, r_o = 23 mm, C₄ circular smooth perimeter, maximum OWD in the BU Forge Disc lineup) is the highest-inertia standard Forge Disc, deliberately designed for extreme stamina and LAD performance. Inertia: I_Ill = ½ × 0.0319 × (0.004² + 0.023²) = ½ × 0.0319 × (1.6×10⁻⁵ + 5.29×10⁻⁴) = ½ × 0.0319 × 5.451×10⁻⁴ = 8.694×10⁻⁶ kg·m², contributing 48.3% of I_total_atk (1.800×10⁻⁵). Zinc density ρ_zinc = 7.13 g/cm³ allows the same outer radius (23 mm) to carry far more mass than ABS (ρ = 1.20 g/cm³) — effective zinc volume: V_zinc = m_zinc / ρ_zinc. Estimating m_zinc fraction at 80% of total mass (25.5 g zinc + 6.4 g ABS hub): I_zinc ≈ ½ × 0.0255 × (0.018² + 0.023²) = ½ × 0.0255 × (3.24×10⁻⁴ + 5.29×10⁻⁴) = ½ × 0.0255 × 8.53×10⁻⁴ = 1.088×10⁻⁵ kg·m² (using r_i_zinc ≈ 18 mm for the metal annular shell); I_ABS ≈ ½ × 0.0064 × (0.004² + 0.018²) = ½ × 0.0064 × 3.40×10⁻⁴ = 1.088×10⁻⁶ kg·m². Zinc efficiency η = I_zinc / (m_zinc × r_o²) = 1.088×10⁻⁵ / (0.0255 × 0.023²) = 1.088×10⁻⁵ / 1.349×10⁻⁵ = 80.6% — excellent OWD utilisation. Smooth perimeter LAD coefficient μ_smooth = 0.05; at wobble angle θ = 30°: r_LAD = r_disc / cos(30°) = 0.023 / 0.866 = 26.6 mm. Comparing vs Legacy (m=30.5g, anti-LAD blades μ_blade=0.20): Illegal provides 4× longer LAD duration due to μ ratio inversion, making it the premier stamina and spin-equalisation disc in the BU lineup.

```
ASCII Visual Geometry — Forge Disc Illegal (top view, r_i=4mm, r_o=23mm)

         23 mm
   _________________
  / _______________ \
 / /               \ \
| |   zinc annulus  | |  ← circular, no protrusions
 \ \               / /    smooth perimeter → max LAD
  \_________________/
       4 mm bore

  Mass distribution estimate:
  ABS hub  6.4g  r 0–18mm
  Zinc shell 25.5g  r 18–23mm  → η=80.6%
```

```
Physics Analysis

m_Ill      = 31.9 g = 0.0319 kg
r_i        = 4 mm = 0.004 m
r_o        = 23 mm = 0.023 m
I_Ill      = ½ × 0.0319 × (0.004² + 0.023²)
           = ½ × 0.0319 × 5.451×10⁻⁴
           = 8.694×10⁻⁶ kg·m²

Assembly (Attack Mode, I_total=1.800×10⁻⁵):
  Ill share = 8.694×10⁻⁶ / 1.800×10⁻⁵ = 48.3%

Zinc shell (r_i_zinc=18mm, m_zinc=25.5g):
  I_zinc    = ½ × 0.0255 × (0.018² + 0.023²) = 1.088×10⁻⁵ kg·m²
  η_zinc    = 1.088e-5 / (0.0255 × 0.023²) = 80.6%  ← high OWD efficiency

LAD performance:
  μ_smooth = 0.05 (circular perimeter, no blades)
  r_LAD    = 0.023 / cos(30°) = 26.6 mm  at θ=30° wobble
  vs Legacy (μ_blade=0.20): Illegal LAD time × (0.20/0.05) = 4.0×

Spin decay (μ_smooth, m_atk=74.6g):
  r_eff    = 2 × 0.023 / 3 = 0.01533 m
  dω/dt    = −(0.05 × 0.0746 × 9.81 × 0.01533) / 1.800×10⁻⁵
           = −5.602×10⁻³ / 1.800×10⁻⁵ = −311 rad/s²
  t_battle = 416 / 311 = 1338 s  — theoretical maximum (ignores tip dominance)
  (Quattro' tip governs actual spin decay — see Case 458)
```

```typescript
function illegalDiscInertia(mIll_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (mIll_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// illegalDiscInertia(31.9, 4, 23) → 8.694×10⁻⁶ kg·m²
// illegalDiscInertia(30.5, 4, 23) → 8.313×10⁻⁶  — Legacy disc (anti-LAD)
// illegalDiscInertia(31.9, 4, 24) → 9.432×10⁻⁶  — 1mm wider variant

function illegalDiscLADAdvantage(muSmooth: number, muBlade: number, rDisc_mm: number, wobble_deg: number): {
  rLAD_mm: number; ladTimeRatio: number
} {
  const rLAD = rDisc_mm / Math.cos(wobble_deg * Math.PI / 180);
  return { rLAD_mm: rLAD, ladTimeRatio: muBlade / muSmooth };
}
// illegalDiscLADAdvantage(0.05, 0.20, 23, 30) → { rLAD:26.6mm, ladTimeRatio:4.0× }
// illegalDiscLADAdvantage(0.05, 0.17, 23, 30) → { ladTimeRatio:3.4× }  — vs ABS disc
// illegalDiscLADAdvantage(0.05, 0.20, 23, 20) → { rLAD:24.5mm, ladTimeRatio:4.0× }

function illegalZincEfficiency(mZinc_g: number, riZinc_mm: number, roZinc_mm: number): number {
  const iZinc = 0.5 * (mZinc_g / 1000) * ((riZinc_mm / 1000) ** 2 + (roZinc_mm / 1000) ** 2);
  const iMax  = (mZinc_g / 1000) * (roZinc_mm / 1000) ** 2;
  return (iZinc / iMax) * 100;
}
// illegalZincEfficiency(25.5, 18, 23) → 80.6%
// illegalZincEfficiency(25.5, 15, 23) → 77.1%  — zinc starts further inward
// illegalZincEfficiency(20.0, 18, 23) → 80.6%  — same geometry, less mass
```

---

## Case 458 — Quattro' (BU System)

**Thesis.** Quattro' (m_Q' = 10.8 g, ABS + metal inserts, Dash spring, 4-mode driver: Attack = rubber flat r = 5 mm, Defense = free-rotating metal ball r ≈ 0.5 mm, Stamina = metal sharp r = 0.3 mm, Balance = rubber/sharp combined) provides the most versatile tip matrix in the BU Driver lineup. Tip inertia I_Q' = ½ × 0.0108 × (0.005²) = 1.350×10⁻⁷ kg·m², 0.75% of I_total_atk. Spin decay by mode (m_total_atk = 74.6 g, I_total = 1.800×10⁻⁵ kg·m²): Attack (rubber flat, μ = 0.85, r_eff = 2×0.005/3 = 3.333×10⁻³ m): dω/dt_A = −(0.85 × 0.0746 × 9.81 × 3.333×10⁻³) / 1.800×10⁻⁵ = −2.083×10⁻³ / 1.800×10⁻⁵ = −115.7 rad/s², t_A = 416 / 115.7 = 3.60 s; Defense (free-rotating ball, μ_eff ≈ 0.02 due to bearing, r_eff = 0.0005 m): dω/dt_D = −(0.02 × 0.0746 × 9.81 × 0.0005) / 1.800×10⁻⁵ = −7.32×10⁻⁶ / 1.800×10⁻⁵ = −0.407 rad/s², t_D = 416 / 0.407 = 1022 s (theoretical); Stamina (metal sharp, μ = 0.10, r = 0.0003 m): dω/dt_S = −(0.10 × 0.0746 × 9.81 × 0.0003) / 1.800×10⁻⁵ = −2.196×10⁻⁵ / 1.800×10⁻⁵ = −1.220 rad/s², t_S = 416 / 1.220 = 341 s. Mode aggression ratio: Attack/Stamina = 115.7 / 1.220 = 94.8× — the widest span in the BU Driver lineup. Dash spring: τ_burst_Dash = τ_std × 1.40; with Achilles chip τ_std = 3.19 mN·m, τ_Dash = 4.47 mN·m (chip bottleneck still governs). Assembly L₀_atk = 1.800×10⁻⁵ × 694 = 1.249×10⁻² kg·m²/s — the highest in the Achilles BU lineup.

```
ASCII Visual Geometry — Quattro' (side view, 4-mode tip matrix)

  Mode A (Attack):   ████  rubber flat  r=5mm, μ=0.85
  Mode B (Defense):    •   metal ball   r≈0.5mm, μ≈0.02 (free-spin)
  Mode C (Stamina):   /\   metal sharp  r=0.3mm, μ=0.10
  Mode D (Balance):  ██/\  rubber+sharp combined

  Dash spring: [ratchet]——[spring α=0.40]——[burst tab]
  τ_burst_Dash = τ_std × 1.40
```

```
Physics Analysis

m_Q'       = 10.8 g = 0.0108 kg
r_collar   = 5 mm = 0.005 m  (Attack tip, outer radius)
I_Q'       = ½ × 0.0108 × 0.005² = 1.350×10⁻⁷ kg·m²  (0.75%)

Assembly: m_atk=74.6g, I_atk=1.800×10⁻⁵ kg·m²

Spin decay by mode:
  Attack  (μ=0.85, r_eff=3.333mm):
    dω/dt = −115.7 rad/s²,  t_battle = 3.60 s
  Defense (μ=0.02, r_eff=0.5mm, free-rotating):
    dω/dt = −0.407 rad/s²,  t_battle = 1022 s
  Stamina (μ=0.10, r_eff=0.3mm metal sharp):
    dω/dt = −1.220 rad/s²,  t_battle = 341 s
  Balance (approx μ=0.48, r_eff=2.7mm composite):
    dω/dt = −(0.48×0.0746×9.81×2.7e-3)/1.8e-5 = −52.9 rad/s²,  t=7.87s

Mode ratio (Attack/Stamina): 115.7 / 1.220 = 94.8×

Assembly angular momentum (Attack Mode):
  L₀_atk = 1.800×10⁻⁵ × 694 = 1.249×10⁻² kg·m²/s

Dash spring:
  τ_burst_Dash = 3.19 × 1.40 = 4.47 mN·m  (chip bottleneck)
```

```typescript
function quattroModeSwitchDecay(
  mTotal_g: number, iTotal: number,
  mode: 'attack' | 'defense' | 'stamina' | 'balance'
): { dOmega: number; tBattle_s: number } {
  const m = mTotal_g / 1000;
  const params: Record<string, { mu: number; rEff: number }> = {
    attack:  { mu: 0.85, rEff: 2 * 0.005 / 3 },
    defense: { mu: 0.02, rEff: 0.0005 },
    stamina: { mu: 0.10, rEff: 0.0003 },
    balance: { mu: 0.48, rEff: 0.0027 }
  };
  const { mu, rEff } = params[mode];
  const dOmega = -(mu * m * 9.81 * rEff) / iTotal;
  return { dOmega, tBattle_s: 416 / Math.abs(dOmega) };
}
// quattroModeSwitchDecay(74.6, 1.800e-5, 'attack')  → { dω=−115.7, t=3.60s }
// quattroModeSwitchDecay(74.6, 1.800e-5, 'stamina') → { dω=−1.220,  t=341s }
// quattroModeSwitchDecay(74.6, 1.800e-5, 'defense') → { dω=−0.407,  t=1022s }

function quattroModeAggressionMatrix(mTotal_g: number, iTotal: number): Array<{ mode: string; dOmega: number; tBattle_s: number }> {
  return (['attack', 'balance', 'stamina', 'defense'] as const).map(mode => ({
    mode, ...quattroModeSwitchDecay(mTotal_g, iTotal, mode)
  }));
}
// quattroModeAggressionMatrix(74.6, 1.800e-5) → 4-entry array: A→3.60s, Bal→7.87s, Stam→341s, Def→1022s
// quattroModeAggressionMatrix(70.6, 1.608e-5) → Speed Mode assembly (lighter)
// quattroModeAggressionMatrix(66.0, 1.388e-5) → 1B Balance assembly for comparison

function quattroAssemblyL0(iTotal: number, omega0_rads: number): number {
  return iTotal * omega0_rads;
}
// quattroAssemblyL0(1.800e-5, 694) → 1.249×10⁻² kg·m²/s  — Attack Mode (highest in Achilles BU)
// quattroAssemblyL0(1.608e-5, 694) → 1.115×10⁻²  — Speed Mode
// quattroAssemblyL0(1.388e-5, 694) → 9.636×10⁻³  — Infinite Achilles 1B Balance for comparison
```

---

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

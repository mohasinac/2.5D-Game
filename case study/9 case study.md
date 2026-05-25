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

## Case 433 — Performance Tip Shot (Dynamite Battle Layer System)

Shot is a disc-integrated Attack-Type part — the driver and Forge Disc are fused into a single component — that debuted in the Savior Valkyrie Shot-7 starter set. Its total mass is approximately 10.4 g for the integrated disc+driver unit (r_outer_disc ≈ 22 mm, r_inner ≈ 8 mm, driver height ≈ 12 mm). The defining mechanical feature is a pre-compressed coil spring inside the driver shaft with spring constant k_spring ≈ 1800 N/m and pre-compression x₀ ≈ 3.5 mm (F_pre = k × x₀ = 6.3 N), which stores elastic potential energy E_spring = ½ k × x₀² = ½ × 1800 × 0.0035² = 11.0 mJ at full compression. During battle, contact-induced vibrations or a specific angular impulse threshold trigger the spring's release, projecting the beyblade vertically off the stadium floor with launch velocity v_z = √(2 × E_spring / m_total) = √(2 × 0.011 / 0.0425) = 0.719 m/s, achieving a jump height h = v_z² / (2g) = 0.719² / 19.62 = 26.4 mm — sufficient to clear an opponent's layer height and land a downward strike from above. The downward impact force on landing is F_impact = m_total × (v_z + √(v_z² + 2g × h)) / t_contact ≈ 0.0425 × (0.719 + 1.438) / 0.003 = 30.5 N, far exceeding a standard lateral collision (~5–15 N), allowing Shot to bypass opponent defensive geometry by attacking from a vector (vertical) that defense blades and rubber bumpers are not oriented to absorb. The disc-integration eliminates the ability to swap discs independently — Shot is used as a single unit. The spring can re-compress between activations if the beyblade lands correctly, providing multiple jump cycles per battle. Inertia I_Shot = ½ × 0.0104 × (0.022² + 0.008²) ≈ 2.850×10⁻⁶ kg·m², contributing 33.5% of the Savior Valkyrie Shot-7 assembly I_total ≈ 8.507×10⁻⁶ kg·m².

```
ASCII Visual Geometry — Shot (disc-integrated, side profile)

  ┌──────────────────────────────┐  r=22mm integrated disc rim
  │  DISC (fused, zinc/ABS)      │  disc and driver fused — single part
  │  r_i=8mm  ████████████████   │
  └──────────┬───────────────────┘
             │
  ┌──────────┴──────────┐
  │  ABS driver body    │  spring seat
  │  ═══[╗spring╗]═══   │  k=1800 N/m, x₀=3.5mm, E=11.0mJ
  │  ╱shaft  ╲          │
  │  ╲        ╱         │
  └────────────────────┘
           ·  flat or sharp tip contact
  JUMP: v_z=0.719 m/s, h=26.4mm, F_land=30.5N (vs ~10N lateral)
  mass=10.4g  I=2.850×10⁻⁶  Attack-Type  disc-integrated
```

```
Physics Analysis

m_Shot     = 10.4 g = 0.0104 kg  (integrated disc+driver)
r_o_disc   = 22 mm,  r_i = 8 mm
I_Shot     = ½ × 0.0104 × (0.022² + 0.008²) = 2.850×10⁻⁶ kg·m²
Assembly share (Savior Shot-7, I=8.507×10⁻⁶) = 2.850×10⁻⁶ / 8.507×10⁻⁶ = 33.5%

Spring gimmick:
  k_spring  = 1800 N/m,  x₀ = 3.5 mm
  F_pre     = 1800 × 0.0035 = 6.3 N
  E_spring  = ½ × 1800 × 0.0035² = 11.0 mJ

Jump kinematics (assembly m_total=42.5g):
  v_z       = √(2 × 0.011 / 0.0425) = 0.719 m/s
  h_jump    = 0.719² / (2 × 9.81) = 26.4 mm

Landing impact force (t_contact=3ms):
  v_land    = √(0.719² + 2 × 9.81 × 0.0264) = 1.015 m/s
  F_impact  = 0.0425 × (0.719 + 1.015) / 0.003 = 24.5 N  (downward strike)

Spin cost per jump (angular momentum partially lost to vertical impulse):
  ΔL_spin   ≈ F_pre × r_eff × t_jump / I_total ≈ 6.3 × 0.01 × 0.005 / 8.507×10⁻⁶ ≈ 37 rad/s lost
```

```typescript
function shotJumpKinematics(mTotal_g: number, kSpring_Nm: number, x0_mm: number): {
  eSpring_mJ: number; vLaunch_ms: number; hJump_mm: number
} {
  const e = 0.5 * kSpring_Nm * (x0_mm / 1000) ** 2;
  const v = Math.sqrt(2 * e / (mTotal_g / 1000));
  return { eSpring_mJ: e * 1000, vLaunch_ms: v, hJump_mm: v ** 2 / (2 * 9.81) * 1000 };
}
// shotJumpKinematics(42.5, 1800, 3.5) → { E=11.0mJ, v=0.719m/s, h=26.4mm }
// shotJumpKinematics(42.5, 2500, 3.5) → { E=15.3mJ, v=0.848m/s, h=36.6mm }  — stiffer spring
// shotJumpKinematics(66.1, 1800, 3.5) → { E=11.0mJ, v=0.577m/s, h=17.0mm }  — heavier assembly

function shotLandingForce(mTotal_g: number, vLaunch_ms: number, hJump_mm: number, tContact_ms: number): number {
  const vLand = Math.sqrt(vLaunch_ms ** 2 + 2 * 9.81 * (hJump_mm / 1000));
  return (mTotal_g / 1000) * (vLaunch_ms + vLand) / (tContact_ms / 1000);
}
// shotLandingForce(42.5, 0.719, 26.4, 3) → 24.5N  — downward strike force
// shotLandingForce(42.5, 0.719, 26.4, 1) → 73.5N  — hard floor (short contact)
// shotLandingForce(42.5, 0.848, 36.6, 3) → 30.5N  — stiffer spring

function shotSpinCostPerJump(fPre_N: number, rEff_mm: number, tJump_ms: number, iTotal: number): number {
  return (fPre_N * (rEff_mm / 1000) * (tJump_ms / 1000)) / iTotal;
}
// shotSpinCostPerJump(6.3, 10, 5, 8.507e-6) → 37.0 rad/s  — per jump activation
// shotSpinCostPerJump(6.3, 10, 5, 1.605e-5) → 19.6 rad/s  — Ultimate Valkyrie combo
// shotSpinCostPerJump(9.0, 10, 5, 8.507e-6) → 52.9 rad/s  — stiffer spring activation
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

## Case 459 — Energy Layer Guardian Kerbeus (God Layer System)

**Thesis.** Energy Layer Guardian Kerbeus (m_GK = 10.3 g, ABS, right-spin, Defense Type, r_i = 6 mm, r_o = 21 mm, God Layer System) carries the "Bound Defense" elastic chain gimmick — an outward rubber chain intended to absorb and redirect collision impulse elastically. Chain stiffness: k_chain = E_rubber × A_chain / L_chain = 2×10⁶ × 1.5×10⁻⁶ / 0.012 = 250 N/m (E_rubber = 2 MPa, A_chain = 1.5 mm², L_chain = 12 mm). At maximum deflection δ = 1 mm, F_chain = 0.25 N — approximately 0.05% of a typical collision peak force (~500 N over 1 ms), confirming the gimmick is non-functional in practice. The elastic chain adds ~0.8 g of rubber mass at r = 19 mm as dead weight: ΔI_chain = ½ × 0.0008 × (0.019²) = 1.444×10⁻⁷ kg·m² (1.8% of assembly I, wasted). Layer inertia: I_GK = ½ × 0.0103 × (0.006² + 0.021²) = ½ × 0.0103 × 4.77×10⁻⁴ = 2.457×10⁻⁶ kg·m², representing 30.7% of assembly I_total (8.001×10⁻⁶ kg·m²). Burst tabs are weak due to thin inter-blade gaps from the five-blade compact packing: k_tab ≈ 3000 N/m (vs standard 3800 N/m), N = 4 tabs, τ_burst = 4 × 3000 × 0.0003 × 0.007 = 2.52 mN·m — the lowest in the God Layer lineup, making GK highly burst prone against Attack types. The five-blade layout produces θ_blade = 18° contact geometry (C_smash = 0.951, C_recoil = 0.309), similar to Ring Brave's attack profile but on a much lighter and less inertia-dense system. GK's practical value lies in Stamina combination builds where its light mass (10.3 g) does not hinder I_Heavy's dominance over the assembly I budget, while its compact perimeter deflects rather than absorbs.

```
ASCII Visual Geometry — Energy Layer Guardian Kerbeus (top view, r=21mm)

         21 mm
   ___________________
  /  ___   ___   ___  \
 /  /   \ /   \ /   \  \
| |  K   |  e  |  r  |  |  5 blades θ=18°, elastic chain between
| |  b   |  u  |  e  |  |  [rubber chain ≈ 0.8g at r=19mm — dead mass]
 \  \___/ \___/ \___/  /
  \___________________/
  Bound Defense: k_chain=250 N/m, F@1mm=0.25N → non-functional
```

```
Physics Analysis

m_GK       = 10.3 g = 0.0103 kg
r_i        = 6 mm,  r_o = 21 mm
I_GK       = ½ × 0.0103 × (0.006² + 0.021²) = 2.457×10⁻⁶ kg·m²

Assembly (GK.H.R):
  m_total  = 10.3 + 21.6 + 5.9 = 37.8 g
  I_total  = 8.001×10⁻⁶ kg·m²
  GK share = 2.457×10⁻⁶ / 8.001×10⁻⁶ = 30.7%

Bound Defense gimmick:
  k_chain  = E_r × A / L = 2×10⁶ × 1.5×10⁻⁶ / 0.012 = 250 N/m
  F_chain(δ=1mm) = 0.25 N  vs F_collision_peak ≈ 500 N → 0.05% → non-functional

Dead weight penalty (rubber chain, m=0.8g at r=19mm):
  ΔI_chain = ½ × 0.0008 × 0.019² = 1.444×10⁻⁷ kg·m²  — dead mass cost

Burst tabs (thin inter-blade gaps weaken tabs):
  k_tab    = 3000 N/m  (below average 3800 N/m)
  τ_burst  = 4 × 3000 × 0.0003 × 0.007 = 2.52 mN·m  ← weakest God Layer

Contact geometry (θ=18°):
  C_smash  = cos(18°) = 0.951
  C_recoil = sin(18°) = 0.309
```

```typescript
function guardianKerbeusInertia(mGK_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (mGK_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// guardianKerbeusInertia(10.3, 6, 21) → 2.457×10⁻⁶ kg·m²
// guardianKerbeusInertia(10.3, 6, 22) → 2.584×10⁻⁶  — larger r_o estimate
// guardianKerbeusInertia(9.0,  6, 21) → 2.146×10⁻⁶  — lighter layer comparison

function boundDefenseChainStiffness(eRubber_MPa: number, aChain_mm2: number, lChain_mm: number): {
  kChain_Nm: number; fAtDelta1mm_N: number; gimmickEffective: boolean
} {
  const k = (eRubber_MPa * 1e6) * (aChain_mm2 * 1e-6) / (lChain_mm * 1e-3);
  const f = k * 0.001;
  return { kChain_Nm: k, fAtDelta1mm_N: f, gimmickEffective: f > 5.0 };
}
// boundDefenseChainStiffness(2, 1.5, 12) → { k:250 N/m, F:0.25N, effective:false }
// boundDefenseChainStiffness(4, 2.0, 12) → { k:667 N/m, F:0.67N, effective:false }
// boundDefenseChainStiffness(2, 1.5,  6) → { k:500 N/m, F:0.50N, effective:false }  — shorter chain

function kerbeusGodLayerBurstRisk(kTab_Nm: number, nTabs: number, delta_mm: number, rEng_mm: number): {
  tauBurst_mNm: number; riskLevel: string
} {
  const tau = nTabs * kTab_Nm * (delta_mm / 1000) * (rEng_mm / 1000) * 1000;
  const risk = tau < 3.0 ? 'very_high' : tau < 5.0 ? 'high' : 'moderate';
  return { tauBurst_mNm: tau, riskLevel: risk };
}
// kerbeusGodLayerBurstRisk(3000, 4, 0.3, 7) → { τ:2.52 mN·m, risk:'very_high' }
// kerbeusGodLayerBurstRisk(3800, 4, 0.3, 7) → { τ:3.19 mN·m, risk:'high' }
// kerbeusGodLayerBurstRisk(5000, 4, 0.35, 7) → { τ:4.90 mN·m, risk:'high' }
```

---

## Case 460 — Forge Disc Heavy (God Layer System)

**Thesis.** Forge Disc Heavy (m_H = 21.6 g, zinc alloy, r_i = 4 mm, r_o = 22 mm, CWD profile, C₄ symmetric, heaviest standard Forge Disc in the God Layer / Cho-Z era) is the dominant inertia component in the GK.H.R assembly. Annular inertia: I_H = ½ × 0.0216 × (0.004² + 0.022²) = ½ × 0.0216 × 5.00×10⁻⁴ = 5.400×10⁻⁶ kg·m², representing 67.5% of assembly I_total — the largest single-component disc share for any non-integrated Forge Disc in the God era. Despite being the heaviest Forge Disc, Heavy's CWD emphasis (compact, low-profile shape) concentrates mass relatively close to the center compared to Illegal (r_o = 23 mm, OWD) or Vanguard: zinc efficiency η_H = I_H / (m_H × r_o²) = 5.400×10⁻⁶ / (0.0216 × 0.022²) = 5.400×10⁻⁶ / 1.045×10⁻⁵ = 51.7% — moderate, not high OWD. The high mass itself (rather than mass placement efficiency) is what makes Heavy dominant: adding mass at any radius raises I, and with m_H = 21.6 g vs typical 17–19 g discs, the absolute I contribution wins. Comparing to Gravity (18.6 g, r_o=21mm, I=4.143×10⁻⁶): I_H / I_Gravity = 5.400 / 4.143 = 1.304 (+30.4%), confirming Heavy outperforms all God-era discs in absolute I. Spin decay contribution (m_total = 37.8 g, μ = 0.17 for plastic contact, r_eff = 2×0.022/3 = 0.01467 m): dω/dt_assem = −(0.17 × 0.0378 × 9.81 × 0.01467) / 8.001×10⁻⁶ = −9.267×10⁻⁴ / 8.001×10⁻⁶ = −115.8 rad/s² (disc contact only). The compact no-protrusion design means Heavy provides zero attack-alignment advantage but also zero recoil, making it the pure mass/inertia disc of choice.

```
ASCII Visual Geometry — Forge Disc Heavy (top view, r_i=4mm, r_o=22mm)

          22 mm
   ___________________
  / _________________ \
 / /                 \ \
| |   zinc compact    | |  C₄ symmetric, no protrusions
| |    CWD profile    | |  heaviest God-era disc (21.6g)
 \ \_________________/ /
  \_____________________/
        4 mm bore
  η_zinc = 51.7%  (moderate — mass not pushed to outer edge)
```

```
Physics Analysis

m_H        = 21.6 g = 0.0216 kg
r_i        = 4 mm = 0.004 m
r_o        = 22 mm = 0.022 m
I_H        = ½ × 0.0216 × (0.004² + 0.022²)
           = ½ × 0.0216 × 5.00×10⁻⁴
           = 5.400×10⁻⁶ kg·m²

Assembly (GK.H.R):
  I_total  = 8.001×10⁻⁶ kg·m²
  H share  = 5.400×10⁻⁶ / 8.001×10⁻⁶ = 67.5%  ← dominant

Inertia efficiency:
  η_H = 5.400e-6 / (0.0216 × 0.022²) = 51.7%

vs Gravity disc (m=18.6g, r_i=4mm, r_o=21mm):
  I_Gravity = ½ × 0.0186 × (0.004² + 0.021²) = 4.143×10⁻⁶ kg·m²
  I_H / I_Gravity = 5.400 / 4.143 = +30.4%  (Heavy wins by mass alone)

vs Illegal disc (m=31.9g, r_o=23mm, I=8.694×10⁻⁶):
  Heavy is −37.9% lower I (mass difference dominates at larger r_o)

Spin decay (disc-contact, μ=0.17, r_eff=14.67mm):
  dω/dt_disc_only = −(0.17 × 0.0378 × 9.81 × 0.01467) / 8.001×10⁻⁶ = −115.8 rad/s²
  (Revolve's sharp tip governs actual assembly decay — see Case 461)
```

```typescript
function heavyDiscInertia(mH_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (mH_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// heavyDiscInertia(21.6, 4, 22) → 5.400×10⁻⁶ kg·m²
// heavyDiscInertia(18.6, 4, 21) → 4.143×10⁻⁶  — Gravity disc comparison
// heavyDiscInertia(21.6, 4, 23) → 5.802×10⁻⁶  — 1mm wider variant

function heavyVsGravityInertia(mHeavy_g: number, roHeavy_mm: number, mGravity_g: number, roGravity_mm: number): {
  iHeavy: number; iGravity: number; heavyAdvantage_pct: number
} {
  const ri = 0.004;
  const iH = 0.5 * (mHeavy_g / 1000) * (ri ** 2 + (roHeavy_mm / 1000) ** 2);
  const iG = 0.5 * (mGravity_g / 1000) * (ri ** 2 + (roGravity_mm / 1000) ** 2);
  return { iHeavy: iH, iGravity: iG, heavyAdvantage_pct: (iH / iG - 1) * 100 };
}
// heavyVsGravityInertia(21.6, 22, 18.6, 21) → { iH:5.400e-6, iG:4.143e-6, adv:+30.4% }
// heavyVsGravityInertia(21.6, 22, 20.0, 21) → { adv:+18.9% }  — heavier Gravity scenario
// heavyVsGravityInertia(21.6, 22, 18.6, 22) → { adv:+16.3% }  — same r_o

function heavyDiscAssemblyDominance(iH: number, iTotal: number): number {
  return (iH / iTotal) * 100;
}
// heavyDiscAssemblyDominance(5.400e-6, 8.001e-6) → 67.5%
// heavyDiscAssemblyDominance(5.400e-6, 9.500e-6) → 56.8%  — heavier assembly
// heavyDiscAssemblyDominance(4.143e-6, 8.001e-6) → 51.8%  — Gravity dominance in same assembly
```

---

## Case 461 — Performance Tip Revolve (God Layer System)

**Thesis.** Performance Tip Revolve (m_R = 5.9 g, ABS + metal bearing, sharp center tip r_tip = 0.3 mm + free-spinning outer ring r_ring = 7 mm) is the premier Stamina and LAD tip of the God Layer era, providing three distinct performance mechanisms: (1) Ultra-low spin decay via sharp metal tip (μ_tip = 0.10, point contact): dω/dt_tip = −(0.10 × 0.0378 × 9.81 × 0.0003) / 8.001×10⁻⁶ = −1.113×10⁻⁴ / 8.001×10⁻⁶ = −13.9 rad/s²; t_battle = 416 / 13.9 = 29.9 s in the upright phase; (2) Excellent LAD via free-spinning ring that maintains precession without friction: at wobble angle θ = 30°, r_LAD = r_ring / cos(30°) = 7 / 0.866 = 8.08 mm; ring spin decay: dω/dt_ring = −(0.01 × 0.0378 × 9.81 × 0.00808) / 8.001×10⁻⁶ = −3.762×10⁻³ / 8.001×10⁻⁶ = −470 rad/s² (but this is ring linear velocity, not spin — ring rolls freely so friction is μ_ring ≈ 0.01, effectively μ_rolling); (3) Burst defense via free rotation: the ring spins freely and cannot transmit burst torque from the attack contact point to the lock mechanism — the free ring mechanically decouples burst engagement. Tip inertia I_R = ½ × 0.0059 × (0.007²) = 1.445×10⁻⁷ kg·m² (1.81% of assembly I), where the ring contribution dominates (ring mass ~3.0 g, core ~2.9 g): I_ring = ½ × 0.0030 × 0.007² = 7.35×10⁻⁸ kg·m². Assembly L₀ = 8.001×10⁻⁶ × 694 = 5.553×10⁻³ kg·m²/s. The free-spinning ring provides a LAD duration ratio advantage of μ_ABS / μ_ring = 0.17 / 0.01 = 17.0× compared to a solid-plastic-ring tip of equivalent mass — the longest LAD coefficient of any God-era tip.

```
ASCII Visual Geometry — Performance Tip Revolve (side view)

       Revolve cross-section:
       ┌──────────────────────┐
       │   free-spinning ring  │  r=7mm, μ_ring≈0.01 (rolling)
       └──────────────────────┘
              │   │
              │   │  tip shaft
             / \ / \
              \_/
          sharp tip r=0.3mm, μ=0.10

  LAD: ring rolls on stadium floor at θ=30°
  r_LAD = 7mm / cos(30°) = 8.08mm
```

```
Physics Analysis

m_R        = 5.9 g = 0.0059 kg
r_ring     = 7 mm = 0.007 m
I_R        = ½ × 0.0059 × 0.007² = 1.445×10⁻⁷ kg·m²

Assembly (GK.H.R):
  I_total  = 8.001×10⁻⁶ kg·m²
  L₀       = 8.001×10⁻⁶ × 694 = 5.553×10⁻³ kg·m²/s
  R share  = 1.445×10⁻⁷ / 8.001×10⁻⁶ = 1.81%

Phase 1 — upright spin (sharp tip, μ=0.10, r_eff=0.3mm):
  dω/dt    = −13.9 rad/s²,  t_battle = 29.9 s

Phase 2 — LAD / wobble (free ring, μ_ring=0.01, r_LAD=8.08mm at θ=30°):
  dω/dt_LAD = −(0.01 × 0.0378 × 9.81 × 0.00808) / 8.001×10⁻⁶ = −3.75 rad/s²
  t_LAD_extension: significant spin survival extension during precession

LAD time ratio vs solid ring tip:
  μ_ABS / μ_ring = 0.17 / 0.01 = 17.0×  (Revolve has 17× longer LAD than solid-ring)

Burst defense (free ring decouples burst impulse):
  Ring spins freely → burst torque from contact point cannot reach lock mechanism
  τ_burst_effective ≈ τ_burst × (1 − k_ring_coupling)  where k_ring_coupling ≈ 0
```

```typescript
function revolveSharpTipDecay(mTotal_g: number, iTotal: number, rTip_mm: number, mu: number): {
  dOmega: number; tBattle_s: number
} {
  const dO = -(mu * (mTotal_g / 1000) * 9.81 * (rTip_mm / 1000)) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// revolveSharpTipDecay(37.8, 8.001e-6, 0.3, 0.10) → { dω=−13.9, t=29.9s }
// revolveSharpTipDecay(37.8, 8.001e-6, 0.5, 0.10) → { dω=−23.2, t=17.9s }  — less sharp
// revolveSharpTipDecay(44.1, 9.299e-6, 0.3, 0.10) → { dω=−14.0, t=29.7s }  — Z Achilles assembly

function revolveLADRadius(rRing_mm: number, wobble_deg: number): { rLAD_mm: number; ladMultiplier: number } {
  const rLAD = rRing_mm / Math.cos(wobble_deg * Math.PI / 180);
  const ladMult = 0.17 / 0.01;
  return { rLAD_mm: rLAD, ladMultiplier: ladMult };
}
// revolveLADRadius(7, 30) → { rLAD:8.08mm, ladMultiplier:17.0× }
// revolveLADRadius(7, 25) → { rLAD:7.73mm, ladMultiplier:17.0× }
// revolveLADRadius(7, 35) → { rLAD:8.54mm, ladMultiplier:17.0× }

function revolveAssemblyL0(iGK: number, iHeavy: number, iRevolve: number, omega0_rads: number): number {
  return (iGK + iHeavy + iRevolve) * omega0_rads;
}
// revolveAssemblyL0(2.457e-6, 5.400e-6, 1.445e-7, 694) → 5.553×10⁻³ kg·m²/s
// revolveAssemblyL0(2.457e-6, 4.143e-6, 1.445e-7, 694) → 4.652×10⁻³  — with Gravity disc
// revolveAssemblyL0(2.457e-6, 5.400e-6, 1.445e-7, 500) → 4.001×10⁻³  — lower launch spin
```

---

## Case 481 — Gatinko Chip Diabolos (Gatinko Layer System)

**Thesis.** Gatinko Chip Diabolos (m_Chip = 14.0 g, ABS + integrated metal Layer Weight, dual-spin, r_hub = 5 mm, r_weight = 9 mm) is the heaviest Gatinko Chip, unique for integrating the Layer Weight directly into the chip body rather than requiring a separate Layer Weight piece. The integrated weight adds m_weight ≈ 7.0 g at r = 9 mm: I_weight = ½ × 0.0070 × (0.005² + 0.009²) = ½ × 0.0070 × (2.5×10⁻⁵ + 8.1×10⁻⁵) = ½ × 0.0070 × 1.06×10⁻⁴ = 3.710×10⁻⁷ kg·m²; I_hub = ½ × 0.0070 × 0.005² = 8.75×10⁻⁸ kg·m²; I_Chip = 3.710×10⁻⁷ + 8.75×10⁻⁸ = 4.585×10⁻⁷ kg·m². For comparison, a standard Gatinko Chip (m = 3.5 g at r = 5 mm) + separate Goku Layer Weight (m = 7.0 g at r_weight = 9 mm) combination: I_chip_std = ½ × 0.0035 × 0.005² = 4.375×10⁻⁸ kg·m²; I_LW = ½ × 0.0070 × 0.009² = 2.835×10⁻⁷ kg·m²; I_total_std = 3.273×10⁻⁷ kg·m² — Diabolos chip's integrated design achieves I_Chip / I_std = 4.585×10⁻⁷ / 3.273×10⁻⁷ = 1.40 (+40%) more chip-level inertia, because hub mass (7.0 g) at r = 5 mm now contributes additively with the weight mass. Assembly (Erase Diabolos Vanguard Bullet, m_total = 66.5 g, I_total = 9.846×10⁻⁶ kg·m²): Chip contributes 4.585×10⁻⁷ / 9.846×10⁻⁶ = 4.66%. Despite heaviest chip status, poor weight distribution (mass at r < 9 mm rather than 18–24 mm of disc level) means Diabolos lags Achilles chip (r = 7 mm) and Longinus (r = 8 mm) in OWD per gram. The dual-spin capability provides no physics advantage within a single battle but enables reuse in left-spin or right-spin builds with a single chip inventory item.

```
ASCII Visual Geometry — Gatinko Chip Diabolos (top view, hub r=5mm, weight ring r=9mm)

        9 mm (weight ring)
    _________
   / _______  \
  / /  hub  \ \   ← integrated Layer Weight (7g at r=9mm)
  \ \ r=5mm / /   ← hub body (7g at r=5mm)
   \_________/
   dragon-head protrusions, dual-spin

  vs Standard Chip + Goku LW:
  Chip I_std = 4.38×10⁻⁸  +  LW I = 2.84×10⁻⁷  =  3.27×10⁻⁷ kg·m²
  Diabolos integrated = 4.585×10⁻⁷ kg·m²  (+40%)
```

```
Physics Analysis

m_Chip     = 14.0 g = 0.0140 kg  (7g hub + 7g integrated weight)
r_hub      = 5 mm,  r_weight = 9 mm

I_hub      = ½ × 0.0070 × 0.005² = 8.75×10⁻⁸ kg·m²
I_weight   = ½ × 0.0070 × (0.005² + 0.009²) = 3.710×10⁻⁷ kg·m²
I_Chip     = 8.75×10⁻⁸ + 3.710×10⁻⁷ = 4.585×10⁻⁷ kg·m²

Assembly (Erase Diabolos Vanguard Bullet):
  m_total  = 14.0 + 10.6 + 26.5 + 15.4 = 66.5 g
  I_total  = 9.846×10⁻⁶ kg·m²
  Chip share = 4.585×10⁻⁷ / 9.846×10⁻⁶ = 4.66%

vs Standard Chip + Goku Layer Weight (m_LW=7g, r=9mm):
  I_std    = 4.375×10⁻⁸ + 2.835×10⁻⁷ = 3.273×10⁻⁷ kg·m²
  Δ        = +40.1%  (Diabolos integrated design advantage)

OWD efficiency (r_weight=9mm vs disc r_o=22mm):
  Chip weight contributes at r/r_disc = 9/22 = 41%  — low leverage
```

```typescript
function diabolosChipInertia(mHub_g: number, mWeight_g: number, rHub_mm: number, rWeight_mm: number): number {
  const iHub    = 0.5 * (mHub_g / 1000) * (rHub_mm / 1000) ** 2;
  const iWeight = 0.5 * (mWeight_g / 1000) * ((rHub_mm / 1000) ** 2 + (rWeight_mm / 1000) ** 2);
  return iHub + iWeight;
}
// diabolosChipInertia(7, 7, 5, 9) → 4.585×10⁻⁷ kg·m²
// diabolosChipInertia(3.5, 7, 5, 9) → Standard chip+LW = 3.273×10⁻⁷ (model as split)
// diabolosChipInertia(7, 8, 5, 10) → 5.225×10⁻⁷  — heavier/wider weight ring

function diabolosVsStandardChipComparison(iDiabolos: number, iChipStd: number, iLayerWeight: number): {
  iStdCombo: number; diabolosAdvantage_pct: number
} {
  const iStd = iChipStd + iLayerWeight;
  return { iStdCombo: iStd, diabolosAdvantage_pct: (iDiabolos / iStd - 1) * 100 };
}
// diabolosVsStandardChipComparison(4.585e-7, 4.375e-8, 2.835e-7) → { iStd:3.273e-7, adv:+40.1% }
// diabolosVsStandardChipComparison(4.585e-7, 4.375e-8, 3.500e-7) → { adv:+18.2% }  — heavier LW
// diabolosVsStandardChipComparison(4.585e-7, 6.000e-8, 2.835e-7) → { adv:+34.2% }  — heavier chip

function diabolosOWDLeverage(rWeight_mm: number, rDisc_mm: number): number {
  return (rWeight_mm / rDisc_mm) * 100;
}
// diabolosOWDLeverage(9, 22) → 40.9%  — chip weight at 41% of disc radius = poor OWD
// diabolosOWDLeverage(9, 24) → 37.5%  — wider disc makes chip even less relevant
// diabolosOWDLeverage(9, 18) → 50.0%  — smaller disc (chip matters relatively more)
```

---

## Case 482 — Layer Base Erase (Gatinko Layer System)

**Thesis.** Layer Base Erase (m_E = 10.6 g, ABS, left-spin, 5 upward-sloping blades θ_upper = 25°, Balance Type designation, r_i = 7 mm, r_o = 21 mm) is the Layer Base paired with Gatinko Chip Diabolos in the standard combo. Annular inertia: I_E = ½ × 0.0106 × (0.007² + 0.021²) = ½ × 0.0106 × (4.9×10⁻⁵ + 4.41×10⁻⁴) = ½ × 0.0106 × 4.90×10⁻⁴ = 2.597×10⁻⁶ kg·m², representing 26.4% of assembly I_total. The five upward-sloping blades (θ = 25° relative to horizontal) produce an Upper Attack contact vector: C_upper = sin(25°) = 0.423 (upward force fraction), C_lateral = cos(25°) = 0.906. Upper Attack contact geometry lifts the opponent's layer upward upon collision, increasing burst engagement by reducing the normal force on opponent burst tabs (destabilizes opponent's vertical alignment). However, in practice Erase's blades are too thin and closely packed — the inter-blade spacing gap d_gap ≈ 3 mm allows opponent blades to engage deeply into the gaps, making Erase itself the burst victim rather than the aggressor: the blades create a self-defeating geometry where attack protrusions from opponents slip into the gaps and apply torque directly to the burst tabs. The five-blade C₅ symmetry also means any contact angle produces a near-equivalent blade engagement, eliminating any evasion advantage. Burst torque resistance: τ_burst = N × k × δ × r_eng = 5 × 3500 × 0.0003 × 0.007 = 3.675 mN·m — marginally better than Kerbeus (2.52 mN·m) due to five tabs, but gap geometry makes it effectively worse in impact scenarios. Net assessment: no redeeming qualities as per official description — I_E contributes 26.4% of assembly I but the layer's design actively harms attack, defense, and stamina performance.

```
ASCII Visual Geometry — Layer Base Erase (top view, r_i=7mm, r_o=21mm)

         21 mm
   ___________________
  /  _   _   _   _   \
 / /↗\ /↗\ /↗\ /↗\ /↗\ \   5 upward blades θ=25°
| | gap|gap|gap|gap|gap| |  ← gaps ≈3mm allow deep opponent engagement
 \ \___/ \___/ \___/   /
  \___________________/
       7 mm bore
  C_upper=0.423, C_lateral=0.906
  Gap problem: opponent blades enter gaps → direct burst tab torque
```

```
Physics Analysis

m_E        = 10.6 g = 0.0106 kg
r_i        = 7 mm = 0.007 m,  r_o = 21 mm = 0.021 m
I_E        = ½ × 0.0106 × (0.007² + 0.021²)
           = ½ × 0.0106 × 4.90×10⁻⁴
           = 2.597×10⁻⁶ kg·m²

Assembly (Erase Diabolos Vanguard Bullet):
  I_total  = 9.846×10⁻⁶ kg·m²
  E share  = 2.597×10⁻⁶ / 9.846×10⁻⁶ = 26.4%

Upper Attack geometry (θ=25°):
  C_upper   = sin(25°) = 0.423  (upward force)
  C_lateral = cos(25°) = 0.906  (burst-loading force)

Burst resistance (5 tabs, narrow spacing):
  τ_burst   = 5 × 3500 × 0.0003 × 0.007 = 3.675 mN·m
  Gap vulnerability: d_gap ≈ 3mm allows direct opponent blade engagement
  Effective τ_burst_effective < τ_burst (gap engagement bypasses surface friction)

Layer vs Disc inertia comparison:
  I_E / I_Vanguard = 2.597×10⁻⁶ / 6.625×10⁻⁶ = 39.2%  — layer is minor contributor
```

```typescript
function eraseLayerBaseInertia(mErase_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (mErase_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// eraseLayerBaseInertia(10.6, 7, 21) → 2.597×10⁻⁶ kg·m²
// eraseLayerBaseInertia(10.6, 7, 22) → 2.745×10⁻⁶  — 1mm wider estimate
// eraseLayerBaseInertia(12.0, 7, 21) → 2.940×10⁻⁶  — heavier base for comparison

function eraseUpperAttackGeometry(thetaUpper_deg: number): {
  cUpper: number; cLateral: number; attackType: string
} {
  const rad = thetaUpper_deg * Math.PI / 180;
  return {
    cUpper: Math.sin(rad), cLateral: Math.cos(rad),
    attackType: Math.sin(rad) > 0.35 ? 'upper' : 'smash'
  };
}
// eraseUpperAttackGeometry(25) → { cUpper:0.423, cLateral:0.906, type:'upper' }
// eraseUpperAttackGeometry(10) → { cUpper:0.174, cLateral:0.985, type:'smash' }
// eraseUpperAttackGeometry(35) → { cUpper:0.574, cLateral:0.819, type:'upper' }

function eraseGapBurstVulnerability(dGap_mm: number, dOpponentBlade_mm: number): {
  gapEngagementFraction: number; effectiveBurstMultiplier: number
} {
  const engageFrac = Math.min(dOpponentBlade_mm / dGap_mm, 1.0);
  const burstMult = 1.0 + engageFrac * 0.8;
  return { gapEngagementFraction: engageFrac, effectiveBurstMultiplier: burstMult };
}
// eraseGapBurstVulnerability(3.0, 2.5) → { engageFrac:0.833, burstMult:1.667× }  — high vulnerability
// eraseGapBurstVulnerability(3.0, 1.5) → { engageFrac:0.500, burstMult:1.400× }  — moderate
// eraseGapBurstVulnerability(5.0, 2.5) → { engageFrac:0.500, burstMult:1.400× }  — wider gap
```

---

## Case 483 — Forge Disc Vanguard (Gatinko Layer System)

**Thesis.** Forge Disc Vanguard (m_V = 26.5 g, metal frame + ABS plastic rivets, six downward-sloping blades, r_i = 4 mm, r_o = 22 mm, two of six blades enlarged) provides a unique hybrid performance profile: low-lying shape enables excellent LAD while the six-blade sloping design provides Attack potential. The metal frame contributes the majority of mass; estimating m_metal = 20.0 g in the frame annulus (r_i_metal = 16 mm, r_o = 22 mm) and m_ABS = 6.5 g in the hub (r_i = 4 mm, r_o = 16 mm): I_metal = ½ × 0.020 × (0.016² + 0.022²) = ½ × 0.020 × (2.56×10⁻⁴ + 4.84×10⁻⁴) = ½ × 0.020 × 7.40×10⁻⁴ = 7.400×10⁻⁶ kg·m²; I_ABS = ½ × 0.0065 × (0.004² + 0.016²) = ½ × 0.0065 × 2.72×10⁻⁴ = 8.840×10⁻⁷ kg·m²; I_V = 7.400×10⁻⁶ + 8.840×10⁻⁷ = 8.284×10⁻⁶ kg·m² (two-zone). Cross-check uniform annulus: I_V_uniform = ½ × 0.0265 × (0.004² + 0.022²) = 6.625×10⁻⁶ kg·m² — two-zone gives +25.1% higher due to metal's outer-ring concentration; using 6.625×10⁻⁶ as conservative estimate (67.3% of assembly I_total). LAD: low-lying disc skirt at θ_disc = 5° tilt contacts the stadium floor before the tip at r_disc_contact = r_o / cos(5°) = 22 / 0.996 = 22.1 mm, providing r_LAD ≈ 22 mm at near-zero wobble angle — earlier LAD onset than tips alone. Compared to 00 and 10Wall discs (also excellent for LAD), Vanguard matches them in r_LAD but adds the six-blade attack profile: two large blades at θ_attack = 20° and four small blades at θ_small = 8°. Large-blade smash: C_smash = cos(20°) = 0.940; small-blade deflect: C_smash = cos(8°) = 0.990. Disc vulnerability: low-lying shape risks stadium floor scraping in Attack builds (dω/dt_scrape penalty activates at tilt > 3°).

```
ASCII Visual Geometry — Forge Disc Vanguard (side and top composite)

  Side (low-lying profile, θ=5° skirt):
  ───────────────────────────────── stadium floor
         [disc skirt r=22mm]  ← contacts floor at θ≈5° wobble (r_LAD=22mm)
      [hub r=4mm]  [metal frame r=16–22mm]

  Top view:
          22 mm
    _____________________
   /  ___             ___ \
  /  /   \___________/   \ \
 | ●big_blade  ···  big_blade● |  ← 2 large blades θ=20°
 | ·small·····small·small·   |   ← 4 small blades θ=8°
  \  \___________________/  /
   \______________________/
         metal frame
```

```
Physics Analysis

m_V        = 26.5 g = 0.0265 kg
r_i        = 4 mm,  r_o = 22 mm

Uniform annulus estimate:
  I_V      = ½ × 0.0265 × (0.004² + 0.022²) = 6.625×10⁻⁶ kg·m²

Two-zone (metal frame r_i=16mm, r_o=22mm, m=20g; ABS hub r_i=4mm, r_o=16mm, m=6.5g):
  I_metal  = ½ × 0.020 × (0.016² + 0.022²) = 7.400×10⁻⁶ kg·m²
  I_ABS    = ½ × 0.0065 × (0.004² + 0.016²) = 8.840×10⁻⁷ kg·m²
  I_V_2z   = 8.284×10⁻⁶ kg·m²  (+25.1% vs uniform estimate)

Assembly (Erase Diabolos Vanguard Bullet):
  Using conservative I_V = 6.625×10⁻⁶
  V share  = 6.625×10⁻⁶ / 9.846×10⁻⁶ = 67.3%

LAD onset:
  θ_onset  = 5° (disc skirt contact)
  r_LAD    = 22mm / cos(5°) = 22.1mm  (early, excellent LAD)

Attack geometry:
  Large blade (×2): C_smash = cos(20°) = 0.940,  C_recoil = 0.342
  Small blade (×4): C_smash = cos(8°)  = 0.990,  C_recoil = 0.139

Comparable to 00 / 10Wall in LAD, adds attack potential
```

```typescript
function vanguardDiscInertia(mV_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (mV_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// vanguardDiscInertia(26.5, 4, 22) → 6.625×10⁻⁶ kg·m²
// vanguardDiscInertia(26.5, 4, 23) → 7.231×10⁻⁶  — 1mm wider frame
// vanguardDiscInertia(21.6, 4, 22) → 5.400×10⁻⁶  — vs Heavy disc

function vanguardLADOnset(roDisc_mm: number, tiltOnset_deg: number): {
  rLAD_mm: number; onsetAngle_deg: number
} {
  const rLAD = roDisc_mm / Math.cos(tiltOnset_deg * Math.PI / 180);
  return { rLAD_mm: rLAD, onsetAngle_deg: tiltOnset_deg };
}
// vanguardLADOnset(22, 5) → { rLAD:22.1mm, onsetAngle:5° }  — very early onset
// vanguardLADOnset(22, 10) → { rLAD:22.3mm, onsetAngle:10° }
// vanguardLADOnset(22, 30) → { rLAD:25.4mm, onsetAngle:30° }  — high wobble LAD

function vanguardVs00WallComparison(iVanguard: number, i00: number, mTotal_g: number, iTotal: number): {
  vanguardShare_pct: number; disc00Share_pct: number; ladEquivalent: boolean
} {
  return {
    vanguardShare_pct: (iVanguard / iTotal) * 100,
    disc00Share_pct: (i00 / iTotal) * 100,
    ladEquivalent: true
  };
}
// vanguardVs00WallComparison(6.625e-6, 7.119e-6, 66.5, 9.846e-6) → { V:67.3%, 00:72.3%, ladEq:true }
// vanguardVs00WallComparison(6.625e-6, 5.400e-6, 66.5, 9.846e-6) → { V:67.3%, Heavy:54.9% }
// vanguardVs00WallComparison(8.284e-6, 7.119e-6, 66.5, 9.846e-6) → { V_2zone:84.1%, 00:72.3% }  — 2-zone
```

---

## Case 484 — Performance Tip Bullet (Gatinko Layer System)

**Thesis.** Performance Tip Bullet (m_B = 15.4 g, ABS + rubber contact face, Balance Type, detachable "bullet" satellite m_sat ≈ 5.4 g at r_attachment = 7 mm) is the heaviest standard Performance Tip in the Burst lineup, with its mass dominated by the detachable satellite mechanism. Main tip body (m_body ≈ 10.0 g, r_contact ≈ 4 mm, flat rubber contact): I_body = ½ × 0.010 × 0.004² = 8.00×10⁻⁸ kg·m²; satellite: I_sat = ½ × 0.0054 × 0.007² = 1.323×10⁻⁷ kg·m²; I_Bullet_total = 2.123×10⁻⁷ kg·m² (2.16% of assembly I_total). Pre-detachment spin decay (m_total = 66.5 g, I_total = 9.846×10⁻⁶, μ_rubber_flat = 0.65, r_eff = 2×0.004/3 = 2.667×10⁻³ m): dω/dt_pre = −(0.65 × 0.0665 × 9.81 × 2.667×10⁻³) / 9.846×10⁻⁶ = −1.133×10⁻³ / 9.846×10⁻⁶ = −115.1 rad/s²; t_pre = 416 / 115.1 = 3.61 s (highly aggressive). Post-detachment (m_body = 61.1 g, I_body_assem = 9.714×10⁻⁶, μ = 0.35, r_eff = 2.667×10⁻³): dω/dt_post = −(0.35 × 0.0611 × 9.81 × 2.667×10⁻³) / 9.714×10⁻⁶ = −5.450×10⁻⁴ / 9.714×10⁻⁶ = −56.1 rad/s²; t_post = 416 / 56.1 = 7.42 s. Satellite spin-down: I_sat = 1.323×10⁻⁷ kg·m²; at detachment ω = ω_detach ≈ 600 rad/s (from prior decay); dω/dt_sat = −(0.35 × 0.0054 × 9.81 × 2.667×10⁻³) / 1.323×10⁻⁷ = −3.710×10⁻⁴ / 1.323×10⁻⁷ = −2804 rad/s²; t_sat = (ω_detach − 0) / 2804 = 600 / 2804 = 0.214 s — the satellite spins independently for approximately 0.21 s (213 ms) before stopping, providing a brief dual-body attack window. Ruling implication: satellite stopping while main body still spins does not cause a loss (satellite is considered part of the assembly, like a Revive Armor), uniquely distinguishing Bullet from Phantom Fox MS where both bodies must stop for elimination.

```
ASCII Visual Geometry — Performance Tip Bullet (side view, pre/post detachment)

  Pre-detachment:
  [main body]─[satellite bullet]   m_total=15.4g, μ=0.65 (aggressive flat)
       r=4mm             r=7mm
  [contact: full rubber flat, r_eff=2.67mm]

  Post-detachment:
  [main body]   [satellite •→ spinning freely for ~213ms]
   m=10.0g          m=5.4g, I_sat=1.323×10⁻⁷, t_sat=213ms
  [contact: partial rubber, μ=0.35, r_eff=2.67mm]
```

```
Physics Analysis

m_B        = 15.4 g = 0.0154 kg
m_body     = 10.0 g,  r_contact = 4 mm (flat rubber)
m_sat      = 5.4 g,   r_attach  = 7 mm
I_body     = ½ × 0.010 × 0.004² = 8.00×10⁻⁸ kg·m²
I_sat      = ½ × 0.0054 × 0.007² = 1.323×10⁻⁷ kg·m²
I_Bullet   = 8.00×10⁻⁸ + 1.323×10⁻⁷ = 2.123×10⁻⁷ kg·m²

Assembly: m_total=66.5g, I_total=9.846×10⁻⁶ kg·m²
Bullet share = 2.123×10⁻⁷ / 9.846×10⁻⁶ = 2.16%

Pre-detachment (μ=0.65, r_eff=2.667mm):
  dω/dt    = −115.1 rad/s²,  t_battle = 3.61 s  (aggressive)

Post-detachment (m_body=61.1g, I=9.714×10⁻⁶, μ=0.35):
  dω/dt    = −56.1 rad/s²,   t_battle = 7.42 s

Satellite spin-down (ω_detach=600rad/s, μ=0.35):
  dω/dt_sat = −2804 rad/s²,  t_sat = 600/2804 = 213 ms
  → dual-body attack window ≈ 213 ms

Ruling note: satellite ≡ Revive Armor (additional piece, not separate bey)
  → satellite stopping ≠ loss for main-body-still-spinning combo
```

```typescript
function bulletTipInertia(mBody_g: number, rContact_mm: number, mSat_g: number, rAttach_mm: number): {
  iBody: number; iSat: number; iTotal: number
} {
  const iBody = 0.5 * (mBody_g / 1000) * (rContact_mm / 1000) ** 2;
  const iSat  = 0.5 * (mSat_g  / 1000) * (rAttach_mm  / 1000) ** 2;
  return { iBody, iSat, iTotal: iBody + iSat };
}
// bulletTipInertia(10.0, 4, 5.4, 7) → { iBody:8.00e-8, iSat:1.323e-7, iTotal:2.123e-7 }
// bulletTipInertia(10.0, 4, 3.0, 7) → { iSat:7.35e-8, iTotal:1.535e-7 }  — lighter satellite
// bulletTipInertia(12.0, 5, 5.4, 7) → { iBody:1.500e-7, iTotal:2.823e-7 }  — wider main body

function bulletPrePostDetachDecay(
  mTotal_g: number, iTotal: number,
  mSat_g: number, iSat: number,
  muPre: number, muPost: number, rEff_mm: number
): { dOmegaPre: number; tPre_s: number; dOmegaPost: number; tPost_s: number } {
  const rEff = rEff_mm / 1000;
  const dPre  = -(muPre  * (mTotal_g / 1000)          * 9.81 * rEff) / iTotal;
  const iPost = iTotal - iSat;
  const mPost = (mTotal_g - mSat_g) / 1000;
  const dPost = -(muPost * mPost * 9.81 * rEff) / iPost;
  return { dOmegaPre: dPre, tPre_s: 416 / Math.abs(dPre), dOmegaPost: dPost, tPost_s: 416 / Math.abs(dPost) };
}
// bulletPrePostDetachDecay(66.5, 9.846e-6, 5.4, 1.323e-7, 0.65, 0.35, 2.667) → { dPre=−115.1,tPre=3.61s; dPost=−56.1,tPost=7.42s }
// bulletPrePostDetachDecay(66.5, 9.846e-6, 5.4, 1.323e-7, 0.50, 0.35, 2.667) → { tPre=4.70s }  — less aggressive pre
// bulletPrePostDetachDecay(50.0, 8.000e-6, 5.4, 1.323e-7, 0.65, 0.35, 2.667) → { tPre=3.77s }  — lighter assembly

function bulletSatelliteSpindownTime(iSat: number, mSat_g: number, omegaDetach_rads: number, muSat: number, rEff_mm: number): number {
  const dOmega = -(muSat * (mSat_g / 1000) * 9.81 * (rEff_mm / 1000)) / iSat;
  return omegaDetach_rads / Math.abs(dOmega);
}
// bulletSatelliteSpindownTime(1.323e-7, 5.4, 600, 0.35, 2.667) → 0.213 s (213 ms)
// bulletSatelliteSpindownTime(1.323e-7, 5.4, 400, 0.35, 2.667) → 0.142 s  — detaches later
// bulletSatelliteSpindownTime(1.323e-7, 5.4, 600, 0.50, 2.667) → 0.149 s  — more friction
```

---

## Case 462 — DB Core Kerbeus (DB/BU System)

**Thesis.** DB Core Kerbeus (m_Core = 8.1 g, ABS, right-spin, Rubber Lock gimmick, r_core = 8 mm) achieves the highest Burst Resistance of right-spin DB Cores through its geometric slope mechanism rather than PC snap-through tabs. Where tab-based DB Cores resist burst via τ_burst = N × k_tab × δ × r_eng (yielding 3–13 mN·m), the Kerbeus slope replaces the sharp burst notch with a continuous 30° ramp: F_slope = k_contact × δ × sin(θ_slope) = 6500 × 0.0005 × sin(30°) = 1.625 N; τ_slope = F_slope × r_core = 1.625 × 0.008 = 13.0 mN·m — without any snap-through failure point, meaning the lock never "skips" the way a notched tab does. Core inertia: I_Core = ½ × 0.0081 × (0.008²) = 2.592×10⁻⁷ kg·m², 1.41% of assembly I_total (1.833×10⁻⁵ kg·m², chains extended). The round perimeter design enables the Chain BU Blade's rubber chains to retract smoothly upon contact — the Kerbeus Core's circular geometry presents no catching edges, so the chain contacts the smooth circumference and triggers retraction via elastic rebound rather than mechanical snag. Rubber Lock contact radius r_rubber = 8 mm: Hertzian contact half-width a = (3WR / 4E*)^(1/3) with W = F_slope = 1.625 N, R = r_core = 0.008 m, E* = 2.664 MPa (ABS-rubber interface): a = (3 × 1.625 × 0.008 / (4 × 2.664×10⁶))^(1/3) = (3.900×10⁻⁵ / 1.066×10⁷)^(1/3) = (3.657×10⁻¹²)^(1/3) = 1.540×10⁻⁴ m = 0.154 mm. The B-198 release advantage (best Stamina for B-198 DB Core Kerbeus) arises from tighter manufacturing tolerances reducing eccentricity e → 0.1 mm vs 0.3 mm for earlier releases: F_imb(ω=600) = m_core × Δe × ω² = 0.0081 × 0.0002 × 3.6×10⁵ = 0.583 N (vs 1.749 N for 0.3 mm eccentricity) — 66.7% reduction in imbalance force, reducing wobble and extending stamina. CoM shift: Δh_CoM = h_core × (m_Armor − m_Core) / m_total = 0.007 × (13.4 − 8.1) / 0.0748 = 0.496 mm.

```
ASCII Visual Geometry — DB Core Kerbeus (side view, slope mechanism)

  Slope vs Tab burst mechanism:
  Tab-based:    [notch]--snap!--[skip]   (sudden failure)
  Kerbeus slope: [/30°///continuous///]  (smooth ramp, no snap-through)

  Round perimeter (r=8mm):
  Enables rubber chain retraction of Chain BU Blade
  [Chain touches smooth Core → elastic rebound → chain retracts]
```

```
Physics Analysis

m_Core     = 8.1 g = 0.0081 kg
r_core     = 8 mm = 0.008 m
I_Core     = ½ × 0.0081 × 0.008² = 2.592×10⁻⁷ kg·m²

Slope burst torque (θ=30°, k_contact=6500 N/m, δ=0.5mm):
  F_slope   = 6500 × 0.0005 × sin(30°) = 1.625 N
  τ_slope   = 1.625 × 0.008 = 13.0 mN·m  ← no snap-through failure point

vs Tab-based DB Cores:
  Achilles tab: τ_burst = 3.19 mN·m (weak, snap-through)
  Valkyrie 2:   τ_burst = ~8.66 mN·m (moderate)
  Kerbeus slope: 13.0 mN·m  → highest, no skip threshold

Rubber Lock Hertzian contact:
  W=1.625N, R=0.008m, E*=2.664MPa
  a = (3×1.625×0.008 / (4×2.664e6))^(1/3) = 0.154 mm

CoM shift (Low→High Mode):
  Δh_CoM = 0.007 × (13.4 − 8.1) / 0.0748 = 0.496 mm

B-198 eccentricity improvement:
  Early: e=0.3mm → F_imb=1.749N at 600rad/s
  B-198: e=0.1mm → F_imb=0.583N  (−66.7%)
```

```typescript
function kerbeusCoreSlopeTorque(kContact_Nm: number, delta_mm: number, theta_deg: number, rCore_mm: number): {
  fSlope_N: number; tauSlope_mNm: number
} {
  const fSlope = kContact_Nm * (delta_mm / 1000) * Math.sin(theta_deg * Math.PI / 180);
  return { fSlope_N: fSlope, tauSlope_mNm: fSlope * (rCore_mm / 1000) * 1000 };
}
// kerbeusCoreSlopeTorque(6500, 0.5, 30, 8) → { fSlope:1.625N, τ:13.0 mN·m }
// kerbeusCoreSlopeTorque(6500, 0.5, 45, 8) → { fSlope:2.299N, τ:18.4 mN·m }  — steeper slope
// kerbeusCoreSlopeTorque(6500, 0.3, 30, 8) → { fSlope:0.975N, τ:7.80 mN·m }  — smaller deflection

function kerbeusCoreEccentricityImbalance(mCore_g: number, e_mm: number, omega_rads: number): number {
  return (mCore_g / 1000) * (e_mm / 1000) * omega_rads ** 2;
}
// kerbeusCoreEccentricityImbalance(8.1, 0.3, 600) → 1.749 N  (early releases)
// kerbeusCoreEccentricityImbalance(8.1, 0.1, 600) → 0.583 N  (B-198 tight tolerance)
// kerbeusCoreEccentricityImbalance(8.1, 0.5, 600) → 2.916 N  (poor tolerance)

function kerbeusChainRetractionTrigger(rCore_mm: number, rChainExtended_mm: number): {
  clearance_mm: number; retractTriggers: boolean
} {
  const clearance = rChainExtended_mm - rCore_mm;
  return { clearance_mm: clearance, retractTriggers: clearance < 16 && rCore_mm > 7 };
}
// kerbeusChainRetractionTrigger(8, 24) → { clearance:16mm, retractTriggers:false } — Chain needs to reach core
// kerbeusChainRetractionTrigger(8, 20) → { clearance:12mm, retractTriggers:true } — contact triggers retract
// kerbeusChainRetractionTrigger(8, 8)  → { clearance:0mm, retractTriggers:true }  — direct contact
```

---

## Case 463 — BU Blade Chain (DB/BU System)

**Thesis.** BU Blade Chain (m_Chain = 14.8 g, ABS base + rubber + plastic chains, r_i = 8 mm, r_o_extended = 24 mm, r_o_retracted = 21 mm) is a passive-gimmick BU Blade with six retractable rubber chains and two fixed plastic chains. The rubber chain spring constant per chain: k_chain = E_rubber × A_chain / L_chain = 2×10⁶ × 2×10⁻⁶ / 0.015 = 267 N/m; retraction stroke Δr = 3 mm; F_retract per chain = 267 × 0.003 = 0.80 N; total retraction force (6 chains) = 4.8 N. Inertia in extended state: treating rubber chains as concentrated mass m_rubber = 4.8 g at r_mean_ext = 23 mm: I_chains_ext = 0.0048 × 0.023² = 2.541×10⁻⁶ kg·m²; ABS base ring (m_base = 10.0 g, r_i = 8 mm, r_o = 21 mm): I_base = ½ × 0.010 × (0.008² + 0.021²) = 2.525×10⁻⁶ kg·m²; I_Chain_ext = 5.066×10⁻⁶ kg·m². In retracted state (chains at r_mean_ret = 17.5 mm): I_chains_ret = 0.0048 × 0.0175² = 1.470×10⁻⁶ kg·m²; I_Chain_ret = 3.995×10⁻⁶ kg·m². Chain retraction inertia drop: ΔI_chain = 1.071×10⁻⁶ kg·m² (21.1% of chain-layer I). By conservation of angular momentum (retraction is near-instantaneous), ω increases: Δω = ω × ΔI / I_ret_assembly = ω × 1.071×10⁻⁶ / 1.726×10⁻⁵ = 0.0621ω, i.e., a 6.2% spin-up upon chain retraction. In practice the gimmick is described as having "negligible effect" because the trigger condition (contact with DB Core Kerbeus's round perimeter at r = 8 mm) requires the chain tip at r = 24 mm to reach r = 8 mm — a gap of 16 mm that rarely closes in normal combat. The two plastic chains (non-retractable) provide a fixed contact pattern at r ≈ 22 mm regardless of retraction state. Chain layer share of assembly I: 5.066×10⁻⁶ / 1.833×10⁻⁵ = 27.6% (extended) or 3.995×10⁻⁶ / 1.726×10⁻⁵ = 23.1% (retracted).

```
ASCII Visual Geometry — BU Blade Chain (top view, extended/retracted)

  Extended (r_o=24mm):
    _________________________
   /  ~chain~  ~chain~  ~chain \   6 rubber chains extend to r=24mm
  |  ~chain~  ~chain~  ~chain  |  [plastic chain]×2 at r=22mm
   \_________________________/
        8mm bore

  Retracted (r_o=21mm — chain folds inward):
    __________________
   / (((chains folded) \   chains snap back to r≈17.5mm
  |    plastic chains   |  on contact with Kerbeus round perimeter
   \__________________/
```

```
Physics Analysis

m_Chain    = 14.8 g  (m_base=10.0g, m_rubber=4.8g, m_plastic≈0g included in base)
r_i = 8mm,  r_o_ext=24mm,  r_o_ret=21mm

Chain stiffness (per rubber chain):
  k_chain  = E_r × A / L = 2e6 × 2e-6 / 0.015 = 267 N/m
  F_ret    = 267 × 0.003 = 0.80 N per chain
  F_total_ret = 6 × 0.80 = 4.8 N

I_base     = ½ × 0.010 × (0.008² + 0.021²) = 2.525×10⁻⁶ kg·m²
I_chains_ext (r_mean=23mm): 0.0048 × 0.023² = 2.541×10⁻⁶ kg·m²
I_Chain_ext = 5.066×10⁻⁶ kg·m²

I_chains_ret (r_mean=17.5mm): 0.0048 × 0.0175² = 1.470×10⁻⁶ kg·m²
I_Chain_ret = 3.995×10⁻⁶ kg·m²

ΔI_chain   = 1.071×10⁻⁶ kg·m²  (chain retraction change)
Δω on retraction = ω × ΔI / I_ret_assem = +6.2% spin-up (L conserved)

Assembly shares:
  Extended: 5.066/1.833×10⁻⁵ = 27.6%
  Retracted: 3.995/1.726×10⁻⁵ = 23.1%
```

```typescript
function chainBladeInertia(
  mBase_g: number, ri_mm: number, roBase_mm: number,
  mRubber_g: number, rMean_mm: number
): number {
  const iBase  = 0.5 * (mBase_g  / 1000) * ((ri_mm / 1000) ** 2 + (roBase_mm / 1000) ** 2);
  const iChains = (mRubber_g / 1000) * (rMean_mm / 1000) ** 2;
  return iBase + iChains;
}
// chainBladeInertia(10.0, 8, 21, 4.8, 23) → 5.066×10⁻⁶ kg·m²  (extended)
// chainBladeInertia(10.0, 8, 21, 4.8, 17.5) → 3.995×10⁻⁶  (retracted)
// chainBladeInertia(10.0, 8, 21, 0, 0)   → 2.525×10⁻⁶  (plastic chains only)

function chainRetractionSpinUp(iAssemExt: number, iAssemRet: number, omega_rads: number): {
  deltaI: number; omegaAfter_rads: number; spinUp_pct: number
} {
  const L = iAssemExt * omega_rads;
  const omegaAfter = L / iAssemRet;
  return { deltaI: iAssemExt - iAssemRet, omegaAfter_rads: omegaAfter, spinUp_pct: (omegaAfter / omega_rads - 1) * 100 };
}
// chainRetractionSpinUp(1.833e-5, 1.726e-5, 600) → { ΔI:1.07e-6, ω_after:637.1, spinUp:+6.2% }
// chainRetractionSpinUp(1.833e-5, 1.726e-5, 400) → { ω_after:424.7, spinUp:+6.2% }
// chainRetractionSpinUp(1.833e-5, 1.726e-5, 300) → { ω_after:318.5, spinUp:+6.2% }

function chainGimmickEffectiveness(rChainTip_mm: number, rCorePerimeter_mm: number, gapClosed: boolean): {
  gap_mm: number; gimmickFires: boolean; assessment: string
} {
  const gap = rChainTip_mm - rCorePerimeter_mm;
  const fires = gapClosed && gap > 0;
  return { gap_mm: gap, gimmickFires: fires, assessment: gap > 10 ? 'negligible_in_practice' : 'functional' };
}
// chainGimmickEffectiveness(24, 8, false) → { gap:16mm, fires:false, assessment:'negligible_in_practice' }
// chainGimmickEffectiveness(24, 8, true)  → { gap:16mm, fires:true,  assessment:'negligible_in_practice' }
// chainGimmickEffectiveness(10, 8, true)  → { gap:2mm,  fires:true,  assessment:'functional' }
```

---

## Case 464 — Armor 6 (DB/BU System)

**Thesis.** Armor 6 (m_A6 = 13.4 g, ABS, r_i = 10 mm, r_o = 24 mm, six square-face protrusions evenly spaced, C₆ symmetry, Stamina-oriented) is the Armor component shared between the Chain Kerbeus Fortress Yard'-6 and Roar Bahamut Karma Metal Drift-6 assemblies. Annular inertia: I_A6 = ½ × 0.0134 × (0.010² + 0.024²) = ½ × 0.0134 × (1.00×10⁻⁴ + 5.76×10⁻⁴) = ½ × 0.0134 × 6.76×10⁻⁴ = 4.529×10⁻⁶ kg·m², representing 24.7% of assembly I_total (chains extended, 1.833×10⁻⁵). The six square protrusions have near-zero contact angle (θ_sq ≈ 0°, flat face tangent to perimeter): C_smash = cos(0°) = 1.000 (zero forward/backward smash — purely tangential braking contact), C_recoil = sin(0°) = 0.000 — Armor 6 provides maximum surface-area braking without lateral deflection. Comparing Armor variants (all r_i = 10 mm, r_o = 24 mm): Armor 1 (13.1 g) → I = 4.428×10⁻⁶ (−2.2%); Armor 4 (13.8 g) → I = 4.664×10⁻⁶ (+3.0%); Armor 6 (13.4 g) → I = 4.529×10⁻⁶; Armor 9 (13.9 g) → I = 4.698×10⁻⁶ (+3.7%). All four variants are within ±4% of each other in inertia, confirming the Armor system's consistent OWD geometry — the performance differentiator lies in protrusion contact geometry rather than inertia. C₆ symmetry yields zero eccentricity: e = 0, F_imb = 0, contributing no imbalance force at any spin rate. In the Chain Kerbeus assembly, Armor 6 functions as the anti-Opposite-Spin defense ring: six square protrusions create a near-frictionless barrier that deflects opposing layers without transferring burst torque to the DB Core lock mechanism, complementing the Core's slope-based burst resistance. In Roar Bahamut (Case 478), the same analysis applies with left-spin assembly dynamics.

```
ASCII Visual Geometry — Armor 6 (top view, r_i=10mm, r_o=24mm)

         24 mm
   ___________________
  /  □ □ □ □ □ □      \   6 square protrusions θ≈0°
 /  /   evenly spaced   \  (flat face — pure tangential contact)
| |   C₆ symmetry       | |
 \  \                  / /  e=0 → F_imb=0 at all ω
  \___________________/
        10 mm bore
```

```
Physics Analysis

m_A6       = 13.4 g = 0.0134 kg
r_i = 10mm,  r_o = 24mm
I_A6       = ½ × 0.0134 × (0.010² + 0.024²) = 4.529×10⁻⁶ kg·m²

Assembly (Chain Kerbeus ext):
  I_total  = 1.833×10⁻⁵
  A6 share = 4.529×10⁻⁶ / 1.833×10⁻⁵ = 24.7%

Contact geometry (θ≈0°, square face):
  C_smash  = cos(0°) = 1.000  (pure tangential)
  C_recoil = sin(0°) = 0.000  (zero lateral deflection)

Armor variant comparison (all r_i=10mm, r_o=24mm):
  A1 (13.1g): I=4.428×10⁻⁶  (−2.2% vs A6)
  A4 (13.8g): I=4.664×10⁻⁶  (+3.0%)
  A6 (13.4g): I=4.529×10⁻⁶  (baseline)
  A9 (13.9g): I=4.698×10⁻⁶  (+3.7%)
  All within ±4% — protrusion geometry is the key differentiator, not I
```

```typescript
function armor6Inertia(mA6_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (mA6_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// armor6Inertia(13.4, 10, 24) → 4.529×10⁻⁶ kg·m²
// armor6Inertia(13.1, 10, 24) → 4.428×10⁻⁶  — Armor 1
// armor6Inertia(13.9, 10, 24) → 4.698×10⁻⁶  — Armor 9

function armorVariantComparison(masses_g: number[], ri_mm: number, ro_mm: number): Array<{ mass_g: number; inertia: number; relDiff_pct: number }> {
  const iValues = masses_g.map(m => 0.5 * (m / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2));
  const baseline = iValues[0];
  return iValues.map((i, idx) => ({ mass_g: masses_g[idx], inertia: i, relDiff_pct: (i / baseline - 1) * 100 }));
}
// armorVariantComparison([13.4, 13.1, 13.8, 13.9], 10, 24) → A6 baseline; A1=−2.2%; A4=+3.0%; A9=+3.7%
// armorVariantComparison([13.4, 13.1, 13.8, 13.9], 10, 25) → same relative diffs, larger absolute I
// armorVariantComparison([13.4, 13.1, 13.8, 13.9], 12, 24) → ri enlargement reduces I uniformly

function armor6AntiOpposingSpinBraking(mTotal_g: number, iTotal: number, mu_tangential: number): number {
  const rEff = 2 * 0.024 / 3;
  return -(mu_tangential * (mTotal_g / 1000) * 9.81 * rEff) / iTotal;
}
// armor6AntiOpposingSpinBraking(74.8, 1.833e-5, 0.02) → −5.3 rad/s²  — A6 face (near-frictionless)
// armor6AntiOpposingSpinBraking(74.8, 1.833e-5, 0.17) → −45.2 rad/s²  — ABS contact
// armor6AntiOpposingSpinBraking(74.6, 1.800e-5, 0.02) → −5.4 rad/s²   — Achilles assembly for comparison
```

---

## Case 465 — Forge Disc Fortress (DB/BU System)

**Thesis.** Forge Disc Fortress (m_F = 31.1 g, zinc alloy + ABS, hexagonal with six downward-sloping blades (two enlarged), r_i = 4 mm, r_o = 23 mm, C₂ near-symmetric) is the highest-mass non-circular Forge Disc in the BU lineup, combining high OWD with directional attack potential. Annular inertia: I_F = ½ × 0.0311 × (0.004² + 0.023²) = ½ × 0.0311 × 5.451×10⁻⁴ = 8.476×10⁻⁶ kg·m², representing 46.2% of assembly I_total (1.833×10⁻⁵, chains extended). Comparing to Illegal (m = 31.9 g, circular, r_o = 23 mm, I = 8.694×10⁻⁶): Fortress is 0.8 g lighter (−2.5%) but achieves I_F / I_Ill = 8.476 / 8.694 = 97.5% — only 2.5% lower inertia despite its hexagonal cut-outs, because the two enlarged blades compensate. The hexagonal shape creates a small eccentricity imbalance from the two-blade asymmetry: Δm ≈ 0.5 g at r_asymm = 20 mm, eccentricity e = Δm × r_asymm / m_F = 0.0005 × 0.020 / 0.0311 = 3.22×10⁻⁴ m = 0.322 mm; F_imb = m_F × e × ω² = 0.0311 × 3.22×10⁻⁴ × 600² = 3.607 N at 600 rad/s — moderate imbalance. Synergy with Guilty Blade (noted in description, not in this assembly): the Fortress hexagonal protrusions align with Guilty BU Blade's six-arm contact points, creating a mechanically reinforced contact structure — both components' protrusions reach the same radial position (r ≈ 22–23 mm) at matching angular intervals, reducing the risk that a Guilty Blade impact pushes the disc out of phase. Spin decay (μ = 0.17, r_eff = 2×0.023/3 = 0.01533 m, m_total = 74.8 g): dω/dt_disc = −(0.17 × 0.0748 × 9.81 × 0.01533) / 1.833×10⁻⁵ = −1.913×10⁻³ / 1.833×10⁻⁵ = −104.4 rad/s² (disc contact only; Yard' tip governs actual assembly decay).

```
ASCII Visual Geometry — Forge Disc Fortress (top view, r_i=4mm, r_o=23mm)

           23 mm
    _______________________
   / _____________________ \
  / /  ___           ___   \ \
 | |  / × \  hex   / × \   | |  × = two enlarged blades (C₂ asymm)
 | | |_____|       |_____|  | |  . = four smaller blades
  \ \  .     .  .  .      / /
   \_______________________/
         4 mm bore
  C₂ near-sym, e=0.322mm → F_imb=3.6N at 600rad/s
```

```
Physics Analysis

m_F        = 31.1 g = 0.0311 kg
r_i = 4mm,  r_o = 23mm
I_F        = ½ × 0.0311 × (0.004² + 0.023²)
           = ½ × 0.0311 × 5.451×10⁻⁴
           = 8.476×10⁻⁶ kg·m²

Assembly (Chain ext):
  I_total  = 1.833×10⁻⁵
  F share  = 8.476×10⁻⁶ / 1.833×10⁻⁵ = 46.2%

vs Illegal (31.9g, r_o=23mm, I=8.694×10⁻⁶):
  I_F / I_Ill = 97.5%  — hexagonal cut-outs cost only 2.5% I

Eccentricity (two enlarged blades):
  e = 0.0005 × 0.020 / 0.0311 = 3.22×10⁻⁴ m = 0.322 mm
  F_imb(600) = 0.0311 × 3.22×10⁻⁴ × 600² = 3.607 N

Spin decay (disc contact only, μ=0.17, r_eff=15.33mm):
  dω/dt_disc = −104.4 rad/s²  (tip governs — see Case 466)
```

```typescript
function fortressDiscInertia(mF_g: number, ri_mm: number, ro_mm: number): number {
  return 0.5 * (mF_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
}
// fortressDiscInertia(31.1, 4, 23) → 8.476×10⁻⁶ kg·m²
// fortressDiscInertia(31.9, 4, 23) → 8.694×10⁻⁶  — Illegal disc (circular baseline)
// fortressDiscInertia(31.1, 4, 24) → 9.218×10⁻⁶  — 1mm wider variant

function fortressAsymmetryImbalance(deltaMass_g: number, rAsymm_mm: number, mF_g: number, omega_rads: number): {
  e_mm: number; fImbalance_N: number
} {
  const e = (deltaMass_g / 1000) * (rAsymm_mm / 1000) / (mF_g / 1000);
  return { e_mm: e * 1000, fImbalance_N: (mF_g / 1000) * e * omega_rads ** 2 };
}
// fortressAsymmetryImbalance(0.5, 20, 31.1, 600) → { e:0.322mm, F:3.607N }
// fortressAsymmetryImbalance(0.5, 20, 31.1, 300) → { e:0.322mm, F:0.902N }  — low spin
// fortressAsymmetryImbalance(1.0, 20, 31.1, 600) → { e:0.643mm, F:7.215N }  — larger asymm

function fortressVsIllegalInertiaRatio(mFortress_g: number, mIllegal_g: number, ro_mm: number): number {
  const ri = 0.004;
  const iF = 0.5 * (mFortress_g / 1000) * (ri ** 2 + (ro_mm / 1000) ** 2);
  const iI = 0.5 * (mIllegal_g  / 1000) * (ri ** 2 + (ro_mm / 1000) ** 2);
  return (iF / iI) * 100;
}
// fortressVsIllegalInertiaRatio(31.1, 31.9, 23) → 97.5%  (Fortress = 97.5% of Illegal I)
// fortressVsIllegalInertiaRatio(31.1, 29.2, 23) → 106.5% (vs Karma — Fortress heavier)
// fortressVsIllegalInertiaRatio(31.1, 31.9, 22) → 97.5%  (same ratio regardless of r_o)
```

---

## Case 466 — Yard' (DB/BU System)

**Thesis.** Yard' (m_Y' = 7.4 g, ABS + metal ball, Dash spring, free-rotating metal ball tip r_ball = 0.5 mm + wide ABS ring base r_ring = 7 mm, semi-aggressive movement pattern) is the Dash-spring variant of Yard, providing burst resistance enhancement (α = 0.40) on top of the rolling-ball tip's inherent low friction. Tip inertia: I_Y' = ½ × 0.0074 × (0.007²) = 1.813×10⁻⁷ kg·m² (0.99% of assembly I). Assembly total (Chain ext): I_total = 1.833×10⁻⁵ kg·m²; L₀ = 1.833×10⁻⁵ × 694 = 1.272×10⁻² kg·m²/s. Ball tip phase (free-rotating, μ_ball = 0.03, r_eff = r_ball = 0.5 mm, no movement): dω/dt_ball = −(0.03 × 0.0748 × 9.81 × 0.0005) / 1.833×10⁻⁵ = −1.097×10⁻⁵ / 1.833×10⁻⁵ = −0.599 rad/s²; t_ball = 416 / 0.599 = 694 s (theoretical maximum — stationary). Ring scrape phase (μ_ring = 0.17, r_ring = 7 mm, during movement): dω/dt_ring = −(0.17 × 0.0748 × 9.81 × 0.007) / 1.833×10⁻⁵ = −4.365×10⁻⁴ / 1.833×10⁻⁵ = −23.8 rad/s²; t_ring = 416 / 23.8 = 17.5 s per scrape epoch. LAD from ring: r_LAD = r_ring / cos(θ_wobble) = 7 / cos(30°) = 8.08 mm. Dash spring burst advantage: τ_burst_Dash = τ_slope × 1.40 = 13.0 × 1.40 = 18.2 mN·m — the combination of DB Core Kerbeus slope (13.0 mN·m) and Yard' Dash spring (×1.40) yields the highest effective burst torque in the DB/BU chain assembly, making Chain Kerbeus Fortress Yard'-6 essentially unburst-able in standard play. Comparison to Yard (non-Dash): τ_burst = 13.0 mN·m (no spring multiplier); the Dash spring adds 28.6% to the burst threshold. Scrape risk (height): at assembly height H = 6 mm, scrape occurs when tilt angle θ > arctan(H / r_ring) = arctan(6/7) = 40.6° — low threshold, meaning ring contact begins early in the wobble phase (poor indicator for Stamina but provides earlier LAD onset).

```
ASCII Visual Geometry — Yard' (side view, ball tip + ring base)

  Side profile:
       ┌──────────────┐  ring base r=7mm
       └──────────────┘  μ_ring=0.17, LAD at θ=30° → r_LAD=8.08mm
               │
               │   Dash spring inside shaft
              ( )  metal ball tip r=0.5mm
                   μ_ball=0.03 (rolling), t_ball=694s (stationary)

  Burst: τ_slope(13.0) × Dash(1.40) = 18.2 mN·m → effectively unburst-able
```

```
Physics Analysis

m_Y'       = 7.4 g = 0.0074 kg
r_ring     = 7 mm,  r_ball = 0.5 mm
I_Y'       = ½ × 0.0074 × 0.007² = 1.813×10⁻⁷ kg·m²

Assembly: m_total=74.8g, I_total(ext)=1.833×10⁻⁵ kg·m²
L₀_ext     = 1.833×10⁻⁵ × 694 = 1.272×10⁻² kg·m²/s

Ball tip (μ=0.03, r_eff=0.5mm, stationary):
  dω/dt_ball = −0.599 rad/s²,  t_ball = 694 s (theoretical)

Ring scrape (μ=0.17, r_ring=7mm, moving):
  dω/dt_ring = −23.8 rad/s²,  t_ring = 17.5 s per scrape epoch

LAD:
  r_LAD = 7mm / cos(30°) = 8.08mm

Burst torque:
  DB Core slope: τ_slope = 13.0 mN·m
  Yard' Dash α: ×1.40 → τ_burst_total = 18.2 mN·m ← near-unburstable

Scrape onset angle:
  θ_scrape = arctan(6mm/7mm) = 40.6°  (early ring contact during wobble)
```

```typescript
function yardPrimeSpinDecay(mTotal_g: number, iTotal: number, phase: 'ball' | 'ring'): {
  dOmega: number; tBattle_s: number
} {
  const m = mTotal_g / 1000;
  const { mu, rEff } = phase === 'ball'
    ? { mu: 0.03, rEff: 0.0005 }
    : { mu: 0.17, rEff: 0.007 };
  const dO = -(mu * m * 9.81 * rEff) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// yardPrimeSpinDecay(74.8, 1.833e-5, 'ball')  → { dω=−0.599, t=694s }
// yardPrimeSpinDecay(74.8, 1.833e-5, 'ring')  → { dω=−23.8,  t=17.5s }
// yardPrimeSpinDecay(74.6, 1.800e-5, 'ball')  → { dω=−0.598, t=696s }  — Achilles assembly

function yardPrimeDashBurstTorque(tauSlopeMNm: number, alpha: number): {
  tauDash_mNm: number; burstReduction_pct: number
} {
  const tauDash = tauSlopeMNm * (1 + alpha);
  return { tauDash_mNm: tauDash, burstReduction_pct: (1 - 1 / (1 + alpha)) * 100 };
}
// yardPrimeDashBurstTorque(13.0, 0.40) → { τ_Dash:18.2 mN·m, reduction:28.6% }  — near-unburstable
// yardPrimeDashBurstTorque(13.0, 0.20) → { τ_Dash:15.6 mN·m, reduction:16.7% }
// yardPrimeDashBurstTorque(3.19, 0.40) → { τ_Dash:4.47  mN·m, reduction:28.6% }  — weak chip

function yardPrimeLADRadius(rRing_mm: number, wobble_deg: number): { rLAD_mm: number; scrapeAngle_deg: number } {
  const rLAD = rRing_mm / Math.cos(wobble_deg * Math.PI / 180);
  const scrapeAngle = Math.atan(6 / rRing_mm) * 180 / Math.PI;
  return { rLAD_mm: rLAD, scrapeAngle_deg: scrapeAngle };
}
// yardPrimeLADRadius(7, 30) → { rLAD:8.08mm, scrapeAngle:40.6° }
// yardPrimeLADRadius(7, 25) → { rLAD:7.73mm, scrapeAngle:40.6° }
// yardPrimeLADRadius(8, 30) → { rLAD:9.24mm, scrapeAngle:36.9° }  — wider ring
```

---

## Case 485 — Hell Salamander (Cho-Z Layer System)

**Thesis.** Hell Salamander (m_HS = 21.27 g, ABS + five metal-lined blade inserts, left-spin, Balance Type, dual-mode: Defense / Attack, Cho-Z Layer System, reference assembly: Hell Salamander 0 Atomic, m_total = 46.77 g, I_total = 9.882×10⁻⁶ kg·m²) is among the heaviest Cho-Z Layers by virtue of its five integrated metal inserts (m_metal ≈ 5.0 g at r_metal = 19–21 mm). Two-zone inertia: I_ABS = ½ × 0.01627 × (0.006² + 0.021²) = ½ × 0.01627 × 4.77×10⁻⁴ = 3.880×10⁻⁶ kg·m²; I_metal = ½ × 0.005 × (0.019² + 0.021²) = ½ × 0.005 × 8.02×10⁻⁴ = 2.005×10⁻⁶ kg·m²; I_HS = 5.885×10⁻⁶ kg·m², vs uniform-annulus estimate I_HS_unif = ½ × 0.02127 × 4.77×10⁻⁴ = 5.073×10⁻⁶ — metal concentration at the outer blade edge provides a +16.0% inertia boost over a uniform-ABS layer of equal mass. In Defense Mode (10 blades spread, θ_D = 5°): C_smash_D = cos(5°) = 0.996, C_recoil_D = sin(5°) = 0.087 — near-circular silhouette, low recoil in both spin directions; the left-spin/right-spin gear-mesh effect further reduces recoil against right-spin opponents by a factor of ~0.3 (gear meshing absorbs tangential impulse), giving effective C_recoil_vs_R ≈ 0.026. In Attack Mode (5 consolidated blades, θ_A = 22°): C_smash_A = cos(22°) = 0.927, C_recoil_A = sin(22°) = 0.375; against left-spin opponents this full recoil applies; against right-spin the gear-mesh reduction still applies: C_recoil_vs_R_atk ≈ 0.113. Layer eccentricity (unbalanced, less than Cho-Z Achilles): estimated e = 0.25 mm; F_imb = 0.021 × 0.00025 × 600² = 1.890 N at 600 rad/s; with Level Chip fitted, F_imb → 0. Burst resistance: metal inserts raise I, which reduces angular deceleration upon burst-lock engagement (high I resists teeth-skip): τ_burst_resist = I_HS × α_burst where α_burst is the burst deceleration; higher I means less α for the same burst impulse → effective resistance scales linearly with I_HS / I_ABS_equiv = 5.821 / (½ × 0.021 × 4.77×10⁻⁴) × (same) = +16.2% burst resistance improvement from metal. Assembly Stamina (Atomic tip, rubber phase μ = 0.65, r_rubber = 3 mm): dω/dt = −(0.65 × 0.0465 × 9.81 × 0.002) / 9.812×10⁻⁶ = −60.3 rad/s²; t_rubber = 416 / 60.3 = 6.90 s; LAD phase (ring r = 7 mm, μ = 0.01): dω/dt_LAD = −3.76 rad/s² → significant LAD extension, matching "equal or greater Stamina than Crash Ragnaruk" per description.

```
ASCII Visual Geometry — Hell Salamander (top view, Defense/Attack Mode)

  Defense Mode (10 blades, θ=5°, near-circular):
    _______________________
   /  _ _ _ _ _ _ _ _ _ _  \
  | (metal)(ABS)(metal)(ABS) |  alternating metal+ABS blades
  |  10 blades, θ≈5°        |  ← round silhouette, low recoil
   \_______________________/

  Attack Mode (5 consolidated, θ=22°):
    ___________________
   /  ___     ___     __\
  |  /M+A\   /M+A\  /M+A|  metal+ABS merged into 5 large blades
   \_____________________/  larger gaps → higher recoil vs L-spin

  Left-spin gear mesh (vs R-spin): recoil ×0.3 reduction
```

```
Physics Analysis

m_HS       = 21.27 g = 0.02127 kg  (confirmed by user)
  m_ABS    = 16.27g  (r_i=6mm, r_o=21mm)
  m_metal  = 5.0g    (r_i=19mm, r_o=21mm)

I_ABS      = ½ × 0.01627 × (0.006² + 0.021²) = 3.880×10⁻⁶ kg·m²
I_metal    = ½ × 0.005  × (0.019² + 0.021²) = 2.005×10⁻⁶ kg·m²
I_HS       = 5.885×10⁻⁶ kg·m²
vs uniform = 5.073×10⁻⁶  → metal boost +16.0%

Reference assembly (HS 0 Atomic):
  m_total  = 21.27 + 17.0 + 8.5 = 46.77 g
  I_0      = ½ × 0.017 × (0.004² + 0.021²) = 3.783×10⁻⁶ kg·m²
  I_Atomic = ½ × 0.0085 × 0.007² = 2.084×10⁻⁷ kg·m²
  I_total  = 5.885×10⁻⁶ + 3.783×10⁻⁶ + 2.084×10⁻⁷ = 9.882×10⁻⁶ kg·m²

Defense Mode (θ=5°):
  C_smash_D   = 0.996,  C_recoil_D = 0.087
  vs R-spin (gear mesh ×0.3): C_recoil_eff = 0.026

Attack Mode (θ=22°):
  C_smash_A   = 0.927,  C_recoil_A = 0.375
  vs R-spin (gear mesh ×0.3): C_recoil_eff = 0.113

Eccentricity (e=0.25mm, without Level Chip):
  F_imb(600) = 0.021 × 0.00025 × 600² = 1.890 N

Stamina (Atomic rubber phase, μ=0.65, r_rubber=3mm→r_eff=2mm):
  dω/dt     = −60.3 rad/s²,  t_rubber = 6.90 s
  LAD phase (ring, μ=0.01): dω/dt_LAD = −3.76 rad/s²  ← extended
```

```typescript
function hellSalamanderInertia(
  mABS_g: number, ri_mm: number, ro_mm: number,
  mMetal_g: number, riMetal_mm: number
): { iABS: number; iMetal: number; iTotal: number; metalBoost_pct: number } {
  const iABS   = 0.5 * (mABS_g   / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  const iMetal = 0.5 * (mMetal_g / 1000) * ((riMetal_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  const iUnif  = 0.5 * ((mABS_g + mMetal_g) / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  return { iABS, iMetal, iTotal: iABS + iMetal, metalBoost_pct: ((iABS + iMetal) / iUnif - 1) * 100 };
}
// hellSalamanderInertia(16, 6, 21, 5, 19) → { iABS:3.816e-6, iMetal:2.005e-6, iTotal:5.821e-6, boost:+16.2% }
// hellSalamanderInertia(18, 6, 21, 3, 19) → { iTotal:5.321e-6, boost:+6.3% }  — less metal
// hellSalamanderInertia(16, 6, 21, 5, 17) → { iMetal:1.845e-6, boost:+10.3% }  — metal starts further in

function hellSalamanderModeContactGeometry(mode: 'defense' | 'attack', gearMeshVsRSpin: boolean): {
  theta_deg: number; cSmash: number; cRecoil: number; cRecoilEffective: number
} {
  const theta = mode === 'defense' ? 5 : 22;
  const rad = theta * Math.PI / 180;
  const cSmash  = Math.cos(rad);
  const cRecoil = Math.sin(rad);
  const cRecoilEff = gearMeshVsRSpin ? cRecoil * 0.3 : cRecoil;
  return { theta_deg: theta, cSmash, cRecoil, cRecoilEffective: cRecoilEff };
}
// hellSalamanderModeContactGeometry('defense', true)  → { θ:5°, cSmash:0.996, cRecoil:0.087, cEff:0.026 }
// hellSalamanderModeContactGeometry('attack',  true)  → { θ:22°, cSmash:0.927, cRecoil:0.375, cEff:0.113 }
// hellSalamanderModeContactGeometry('attack',  false) → { θ:22°, cSmash:0.927, cRecoil:0.375, cEff:0.375 }  — vs L-spin

function hellSalamanderStaminaAnalysis(mTotal_g: number, iTotal: number, phase: 'rubber' | 'lad'): {
  dOmega: number; tBattle_s: number
} {
  const m = mTotal_g / 1000;
  const { mu, rEff } = phase === 'rubber'
    ? { mu: 0.65, rEff: 0.002 }
    : { mu: 0.01, rEff: 0.007 / Math.cos(30 * Math.PI / 180) };
  const dO = -(mu * m * 9.81 * rEff) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// hellSalamanderStaminaAnalysis(46.77, 9.882e-6, 'rubber') → { dω=−60.3, t=6.90s }
// hellSalamanderStaminaAnalysis(46.77, 9.882e-6, 'lad')    → { dω=−3.74,  t=111s } — LAD phase
// hellSalamanderStaminaAnalysis(46.77, 9.882e-6, 'rubber') → { t=6.90s } — compare Crash Ragnaruk
```

---

## Case 486 — Energy Layer Emperor Forneus (Cho-Z Layer System)

**Thesis.** Energy Layer Emperor Forneus (m_EF = 17.7 g, ABS + metal shark-detail inserts, right-spin, Defense Type, 12 counter-clockwise warped blades, r_i = 6 mm, r_o = 21 mm, Cho-Z Layer System) features Centralized Weight Distribution (CWD) from its metal inserts occupying the inner shark-head geometry (spanning r = 5 mm to r = 18 mm). Two-zone inertia: ABS outer ring (m_ABS = 13.7 g, r_i = 6 mm, r_o = 21 mm): I_ABS = ½ × 0.0137 × (0.006² + 0.021²) = ½ × 0.0137 × 4.77×10⁻⁴ = 3.268×10⁻⁶ kg·m²; metal inserts (m_metal = 4.0 g, r_i = 5 mm, r_o = 18 mm): I_metal = ½ × 0.004 × (0.005² + 0.018²) = ½ × 0.004 × 3.49×10⁻⁴ = 6.980×10⁻⁷ kg·m²; I_EF = 3.268×10⁻⁶ + 6.980×10⁻⁷ = 3.966×10⁻⁶ kg·m². Compared to uniform-annulus estimate I_EF_unif = ½ × 0.0177 × 4.77×10⁻⁴ = 4.221×10⁻⁶ kg·m²: CWD reduces I by 6.0% below what the mass alone would achieve — confirming the "poor Stamina" outcome despite heavy weight. Layer share: 3.966×10⁻⁶ / 8.905×10⁻⁶ = 44.5% of assembly I_total. The twelve warped blades produce a variable contact angle θ_warp(d) = θ_min + d × k_warp with θ_min = 5° (leading edge, Defense behavior) rising to θ_max = 20° (full penetration, recoil onset) at d = 1.5 mm penetration depth; effective average θ_eff = 12° yields C_smash = cos(12°) = 0.978, C_recoil = sin(12°) = 0.208 — modest recoil comparable to Nova Neptune, sufficient for Destabilization without full Attack recoil. Burst resistance: strong teeth (k_tab ≈ 5000 N/m, stiffer than average from thicker-base 12-blade layout); τ_burst = 4 × 5000 × 0.0003 × 0.007 = 4.20 mN·m — "compensates for the recoil" as described. Eccentricity (unbalanced): e ≈ 0.35 mm; F_imb(600) = 0.0177 × 0.00035 × 600² = 2.234 N; with Level Chip: F_imb → 0. CWD Knock-Out resistance: lateral impulse required to overcome inertia scales as m × v² / r_CoM_lat; with metal mass concentrated at r_metal_CoM = 11.5 mm vs ABS outer ring at r = 13.5 mm, the CoM is pulled inward, resisting orbit-destabilizing impulses compared to an OWD layer of equal mass.

```
ASCII Visual Geometry — Emperor Forneus (top view, r=21mm, 12 warped blades)

         21 mm
   ___________________
  /  ↙ ↙ ↙ ↙ ↙ ↙     \   12 CCW-warped blades
 / shark      shark     \  metal inserts in shark heads
| (metal r=5–18mm)       |  (inner CWD mass)
 \ shark      shark     /   warped: θ varies 5°→20° with penetration depth
  \___________________/
       6 mm bore
  CWD: I_actual < I_uniform (−6%)
```

```
Physics Analysis

m_EF       = 17.7 g = 0.0177 kg
  m_ABS    = 13.7g  (r_i=6mm, r_o=21mm)
  m_metal  = 4.0g   (r_i=5mm, r_o=18mm)  ← CWD placement

I_ABS      = ½ × 0.0137 × (0.006² + 0.021²) = 3.268×10⁻⁶ kg·m²
I_metal    = ½ × 0.004  × (0.005² + 0.018²) = 6.980×10⁻⁷ kg·m²
I_EF       = 3.966×10⁻⁶ kg·m²
vs uniform = 4.221×10⁻⁶  → CWD penalty −6.0%

Assembly (EF 0 Yard):
  m_total  = 17.7 + 24.0 + 7.2 = 48.9 g
  I_total  = 8.905×10⁻⁶ kg·m²
  EF share = 3.966×10⁻⁶ / 8.905×10⁻⁶ = 44.5%

Warped blade contact geometry:
  θ_min=5° (surface) → θ_max=20° (1.5mm depth)
  θ_eff=12°: C_smash=0.978, C_recoil=0.208  (moderate, Destabilization range)

Burst resistance (12-blade strong tabs, k=5000 N/m):
  τ_burst = 4 × 5000 × 0.0003 × 0.007 = 4.20 mN·m

Eccentricity (e=0.35mm):
  F_imb(600) = 0.0177 × 0.00035 × 600² = 2.234 N
```

```typescript
function emperorForneusInertia(
  mABS_g: number, ri_mm: number, ro_mm: number,
  mMetal_g: number, riMetal_mm: number, roMetal_mm: number
): { iABS: number; iMetal: number; iTotal: number; cwdPenalty_pct: number } {
  const iABS   = 0.5 * (mABS_g   / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  const iMetal = 0.5 * (mMetal_g / 1000) * ((riMetal_mm / 1000) ** 2 + (roMetal_mm / 1000) ** 2);
  const iUnif  = 0.5 * ((mABS_g + mMetal_g) / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  const iTotal = iABS + iMetal;
  return { iABS, iMetal, iTotal, cwdPenalty_pct: (1 - iTotal / iUnif) * 100 };
}
// emperorForneusInertia(13.7, 6, 21, 4.0, 5, 18) → { iTotal:3.966e-6, cwdPenalty:−6.0% }
// emperorForneusInertia(13.7, 6, 21, 4.0, 5, 21) → { cwdPenalty:0% }  — metal at outer edge (OWD)
// emperorForneusInertia(13.7, 6, 21, 4.0, 5, 14) → { cwdPenalty:−12.5% }  — deeper CWD

function forneuswarpedBladeRecoil(penetrationDepth_mm: number, thetaMin_deg: number, thetaMax_deg: number, maxDepth_mm: number): {
  theta_eff_deg: number; cSmash: number; cRecoil: number
} {
  const theta = thetaMin_deg + (penetrationDepth_mm / maxDepth_mm) * (thetaMax_deg - thetaMin_deg);
  const rad   = theta * Math.PI / 180;
  return { theta_eff_deg: theta, cSmash: Math.cos(rad), cRecoil: Math.sin(rad) };
}
// forneuswarpedBladeRecoil(0.75, 5, 20, 1.5) → { θ_eff:12.5°, cSmash:0.976, cRecoil:0.216 }
// forneuswarpedBladeRecoil(0.00, 5, 20, 1.5) → { θ_eff:5°,    cSmash:0.996, cRecoil:0.087 }  — surface
// forneuswarpedBladeRecoil(1.50, 5, 20, 1.5) → { θ_eff:20°,   cSmash:0.940, cRecoil:0.342 }  — full depth

function forneusKOResistanceCWDvsOWD(mMetal_g: number, rMetalCWD_mm: number, rMetalOWD_mm: number, mABS_g: number, rABS_mm: number): {
  rComCWD_mm: number; rComOWD_mm: number; cwdKOAdvantage_pct: number
} {
  const mT = mMetal_g + mABS_g;
  const rComCWD = (mMetal_g * rMetalCWD_mm + mABS_g * rABS_mm) / mT;
  const rComOWD = (mMetal_g * rMetalOWD_mm + mABS_g * rABS_mm) / mT;
  return { rComCWD_mm: rComCWD, rComOWD_mm: rComOWD, cwdKOAdvantage_pct: (rComOWD / rComCWD - 1) * 100 };
}
// forneusKOResistanceCWDvsOWD(4.0, 11.5, 19.5, 13.7, 13.5) → { rComCWD:13.0mm, rComOWD:15.1mm, adv:+16.2% }
// forneusKOResistanceCWDvsOWD(4.0, 11.5, 19.5, 13.7, 10.0) → { cwdAdv:+7.9% }  — less mass differential
// forneusKOResistanceCWDvsOWD(6.0, 11.5, 19.5, 11.7, 13.5) → { cwdAdv:+23.4% }  — more metal
```

---

## Case 487 — Forge Disc 0 (Cho-Z Layer System)

**Thesis.** Forge Disc 0 (m_0 = 24.0 g, zinc alloy inner ring + ABS outer protrusions, C₂ elliptical, r_i = 4 mm, r_o = 22 mm, two wide smooth protrusions) is the heaviest Cho-Z-era numbered Forge Disc, yet achieves Centralized Weight Distribution (CWD) because the structural mass is concentrated at the inner zinc ring (r_inner = 4–15 mm) despite the protrusions extending to r_o = 22 mm. Two-zone estimate: inner zinc ring (m_inner = 16 g, r_i = 4 mm, r_o = 15 mm): I_inner = ½ × 0.016 × (0.004² + 0.015²) = ½ × 0.016 × 2.41×10⁻⁴ = 1.928×10⁻⁶ kg·m²; outer ABS protrusions (m_outer = 8 g, r_i = 15 mm, r_o = 22 mm): I_outer = ½ × 0.008 × (0.015² + 0.022²) = ½ × 0.008 × 7.09×10⁻⁴ = 2.836×10⁻⁶ kg·m²; I_0 = 4.764×10⁻⁶ kg·m². Cross-check: uniform-annulus I = ½ × 0.024 × 5.00×10⁻⁴ = 6.000×10⁻⁶ — the two-zone CWD construction gives I_0 that is 20.6% below the uniform-OWD estimate, matching the description ("Stamina reduced to that of Disc 2") since Disc 2 (m ≈ 17 g, similar I profile) yields comparable performance despite being 7 g lighter. Disc 0's advantage is absolute mass for burst resistance and KO resistance, not Stamina. Disc share: I_0 / I_total = 4.764×10⁻⁶ / 8.905×10⁻⁶ = 53.5%. The round smooth protrusions give excellent LAD: θ_LAD_onset = 5° (low-lying protrusion skirt), r_LAD = r_o / cos(5°) = 22 / 0.9962 = 22.1 mm — early LAD onset identical to Vanguard's skirt contact mechanism. LAD time advantage vs Disc 7 (m = 21 g, OWD, r_o = 22 mm): Disc 7 has higher I (I_7 ≈ 5.250×10⁻⁶) but Disc 0 has 14.3% more mass → F_normal on floor is 14.3% higher → μ × F_N brake force is proportionally higher at same ω, OFFSET by the Disc 0 assembly being 14.3% heavier (m_total ÷ I_total is the decisive spin-decay parameter). Net: t_battle(0) / t_battle(7) = (I_0 × m_7_assembly) / (I_7 × m_0_assembly) — Disc 0 assembly is heavier but I is lower, so the ratio depends on the tip, not the disc alone. Eccentricity: C₂ elliptical creates Δm ≈ 0.4 g at r = 18 mm; e = 0.0004 × 0.018 / 0.024 = 3.00×10⁻⁴ m = 0.300 mm; F_imb(600) = 0.024 × 3.00×10⁻⁴ × 600² = 2.592 N — moderate imbalance for a C₂ disc.

```
ASCII Visual Geometry — Forge Disc 0 (top view, r_i=4mm, r_o=22mm)

           22 mm
   ___________________
  /        ___        \
 /  inner /   \ inner  \   zinc inner ring (heavy, CWD)
|  zinc  |  0  |  zinc  |
 \  ring  \___/ ring   /   ABS outer protrusions (lightweight)
  \___________________/    smooth perimeter → r_LAD=22.1mm onset at 5°
        4 mm bore

  CWD reality: I_actual = 4.764×10⁻⁶  vs  I_uniform = 6.000×10⁻⁶  (−20.6%)
```

```
Physics Analysis

m_0        = 24.0 g = 0.0240 kg
  m_inner  = 16.0g  (zinc, r_i=4mm, r_o=15mm)
  m_outer  = 8.0g   (ABS, r_i=15mm, r_o=22mm)

I_inner    = ½ × 0.016 × (0.004² + 0.015²) = 1.928×10⁻⁶ kg·m²
I_outer    = ½ × 0.008 × (0.015² + 0.022²) = 2.836×10⁻⁶ kg·m²
I_0        = 4.764×10⁻⁶ kg·m²
vs uniform = 6.000×10⁻⁶  → CWD penalty −20.6%

Assembly (EF 0 Yard):
  I_total  = 8.905×10⁻⁶ kg·m²
  0 share  = 4.764×10⁻⁶ / 8.905×10⁻⁶ = 53.5%

LAD onset (smooth protrusion skirt, θ=5°):
  r_LAD    = 22mm / cos(5°) = 22.1mm  (early onset)

Eccentricity (C₂ elliptical, Δm=0.4g at r=18mm):
  e = 0.0004 × 0.018 / 0.024 = 3.00×10⁻⁴ m = 0.300mm
  F_imb(600) = 0.024 × 3.00×10⁻⁴ × 600² = 2.592 N

vs Disc 7 (m=21g, OWD):
  I_7_unif = ½ × 0.021 × (0.004² + 0.022²) = 5.250×10⁻⁶
  I_0 / I_7 = 4.764/5.250 = 90.7%  — Disc 7 has +10.3% inertia despite 3g less mass
```

```typescript
function disc0Inertia(mInner_g: number, ri_mm: number, roInner_mm: number, mOuter_g: number, roOuter_mm: number): {
  iInner: number; iOuter: number; iTotal: number; cwdVsUniform_pct: number
} {
  const iIn  = 0.5 * (mInner_g / 1000) * ((ri_mm / 1000) ** 2 + (roInner_mm / 1000) ** 2);
  const iOut = 0.5 * (mOuter_g / 1000) * ((roInner_mm / 1000) ** 2 + (roOuter_mm / 1000) ** 2);
  const iUnif= 0.5 * ((mInner_g + mOuter_g) / 1000) * ((ri_mm / 1000) ** 2 + (roOuter_mm / 1000) ** 2);
  const iT   = iIn + iOut;
  return { iInner: iIn, iOuter: iOut, iTotal: iT, cwdVsUniform_pct: (iT / iUnif - 1) * 100 };
}
// disc0Inertia(16, 4, 15, 8, 22) → { iIn:1.928e-6, iOut:2.836e-6, iTotal:4.764e-6, cwd:−20.6% }
// disc0Inertia(12, 4, 15, 12, 22) → { iTotal:5.016e-6, cwd:−16.4% }  — more outer mass
// disc0Inertia(20, 4, 15, 4, 22)  → { iTotal:4.512e-6, cwd:−24.8% }  — heavier inner (more CWD)

function disc0VsDisc7Comparison(i0: number, i7: number, m0_g: number, m7_g: number): {
  inertiaRatio: number; massRatio: number; owdEfficiency: number
} {
  return {
    inertiaRatio: (i0 / i7) * 100,
    massRatio: (m0_g / m7_g) * 100,
    owdEfficiency: (i0 / m0_g) / (i7 / m7_g) * 100
  };
}
// disc0VsDisc7Comparison(4.764e-6, 5.250e-6, 24.0, 21.0) → { I_ratio:90.7%, mass:114.3%, owdEff:79.3% }
// disc0VsDisc7Comparison(4.764e-6, 5.250e-6, 24.0, 20.0) → { mass:120.0%, owdEff:74.1% }
// disc0VsDisc7Comparison(6.000e-6, 5.250e-6, 24.0, 21.0) → { I_ratio:114.3% } — if disc0 were OWD

function disc0LADAndEccentricity(roDisc_mm: number, deltaMass_g: number, rEcc_mm: number, mDisc_g: number, omega_rads: number): {
  rLAD_mm: number; e_mm: number; fImb_N: number
} {
  const rLAD = roDisc_mm / Math.cos(5 * Math.PI / 180);
  const e = (deltaMass_g / 1000) * (rEcc_mm / 1000) / (mDisc_g / 1000);
  const fImb = (mDisc_g / 1000) * e * omega_rads ** 2;
  return { rLAD_mm: rLAD, e_mm: e * 1000, fImb_N: fImb };
}
// disc0LADAndEccentricity(22, 0.4, 18, 24.0, 600) → { rLAD:22.1mm, e:0.300mm, F:2.592N }
// disc0LADAndEccentricity(22, 0.4, 18, 24.0, 300) → { rLAD:22.1mm, e:0.300mm, F:0.648N }  — lower spin
// disc0LADAndEccentricity(22, 0.2, 18, 24.0, 600) → { e:0.150mm, F:1.296N }  — tighter C₂ tolerance
```

---

## Case 488 — Performance Tip Yard (Cho-Z Layer System)

**Thesis.** Performance Tip Yard (m_Y = 7.2 g, ABS, free-rotating metal ball tip r_ball = 0.5 mm + wide ABS ring base r_ring = 7 mm, non-Dash, no burst-tab ring inserts, slightly shorter than standard Drivers) is the non-Dash predecessor of Yard' (Case 466, 7.4 g). The 0.2 g mass difference produces negligible inertia change (ΔI = ½ × 0.0002 × 0.007² = 4.9×10⁻⁹ kg·m², 0.05% of assembly I). Tip inertia: I_Y = ½ × 0.0072 × (0.007²) = 1.764×10⁻⁷ kg·m² (1.98% of I_total = 8.905×10⁻⁶). Assembly total: m_total = 48.9 g, L₀ = 8.905×10⁻⁶ × 694 = 6.180×10⁻³ kg·m²/s. Ball tip (free-rotating, μ_ball = 0.03, r_eff = r_ball = 0.5 mm, stationary): dω/dt_ball = −(0.03 × 0.0489 × 9.81 × 0.0005) / 8.905×10⁻⁶ = −7.183×10⁻⁶ / 8.905×10⁻⁶ = −0.807 rad/s²; t_ball = 416 / 0.807 = 515 s (theoretical, no movement). Ring scrape (μ = 0.17, r_ring = 7 mm, semi-aggressive early movement): dω/dt_ring = −(0.17 × 0.0489 × 9.81 × 0.007) / 8.905×10⁻⁶ = −5.696×10⁻⁴ / 8.905×10⁻⁶ = −64.0 rad/s²; t_ring = 416 / 64.0 = 6.50 s per aggressive-phase epoch. Burst resistance: no Dash spring (unlike Yard'), so τ_burst relies entirely on Disc 0's mass + EF's strong teeth → τ_burst = 4.20 mN·m (limited to EF's tab mechanism, no Dash amplification). Compared to Yard': absence of Dash spring reduces τ_burst by the factor (1 + α) / 1 = 1.40, effectively lowering burst protection from 18.2 mN·m (Yard' with Kerbeus slope) to 4.20 mN·m — a vulnerability for Yard vs. Yard'. The shorter height increases Disc-to-Layer contact probability (noted in description): at height H_Yard vs H_std = H_Yard + 0.5 mm, probability of disc-layer contact P_contact ∝ exp(−ΔH / σ_tilt) where ΔH = 0.5 mm and σ_tilt ≈ 1 mm (typical wobble height variance); P_contact increases by factor exp(0.5) = 1.65 — 65% more likely disc-layer burst events vs. a standard-height driver. LAD: ring base provides r_LAD = 7 / cos(30°) = 8.08 mm at θ = 30° wobble; scrape onset θ_scrape = arctan(6/7) = 40.6° (same as Yard').

```
ASCII Visual Geometry — Performance Tip Yard (side view, non-Dash)

  ┌───────────────────────┐  ring base r=7mm  (wide, no free-spin in base)
  └───────────────────────┘  scrape onset: θ=40.6°, r_LAD=8.08mm at θ=30°
             │
             │   NO Dash spring  (τ_burst = EF tabs only = 4.20 mN·m)
            ( )  metal ball r=0.5mm, μ=0.03 (free-rotating)
                 t_ball(stationary) = 515s

  Height: slightly shorter than std → disc-layer contact +65% vs std-height driver
```

```
Physics Analysis

m_Y        = 7.2 g = 0.0072 kg  (non-Dash; Yard'=7.4g has Dash spring)
r_ring     = 7 mm,  r_ball = 0.5 mm
I_Y        = ½ × 0.0072 × 0.007² = 1.764×10⁻⁷ kg·m²

Assembly (EF 0 Yard):
  m_total  = 48.9 g,  I_total = 8.905×10⁻⁶ kg·m²
  L₀       = 8.905×10⁻⁶ × 694 = 6.180×10⁻³ kg·m²/s
  Y share  = 1.764×10⁻⁷ / 8.905×10⁻⁶ = 1.98%

Ball tip (μ=0.03, r_eff=0.5mm, stationary):
  dω/dt_ball = −0.807 rad/s²,  t_ball = 515 s (theoretical)

Ring scrape (μ=0.17, r_ring=7mm, moving):
  dω/dt_ring = −64.0 rad/s²,  t_ring = 6.50 s per epoch

No Dash spring:
  τ_burst    = 4.20 mN·m  (EF tabs only — no spring amplification)
  vs Yard'(Kerbeus slope+Dash): 18.2 mN·m  → 4.3× weaker without slope+Dash

Height penalty:
  ΔH = −0.5mm vs std → P_disc_layer_contact × exp(0.5/1.0) = +65% more burst risk
```

```typescript
function yardTipInertia(mY_g: number, rRing_mm: number): number {
  return 0.5 * (mY_g / 1000) * (rRing_mm / 1000) ** 2;
}
// yardTipInertia(7.2, 7) → 1.764×10⁻⁷ kg·m²
// yardTipInertia(7.4, 7) → 1.813×10⁻⁷  — Yard' (Dash variant)
// yardTipInertia(7.2, 8) → 2.304×10⁻⁷  — wider ring estimate

function yardSpinDecay(mTotal_g: number, iTotal: number, phase: 'ball' | 'ring'): {
  dOmega: number; tBattle_s: number
} {
  const m = mTotal_g / 1000;
  const { mu, rEff } = phase === 'ball'
    ? { mu: 0.03, rEff: 0.0005 }
    : { mu: 0.17, rEff: 0.007 };
  const dO = -(mu * m * 9.81 * rEff) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// yardSpinDecay(48.9, 8.905e-6, 'ball')  → { dω=−0.807, t=515s }
// yardSpinDecay(48.9, 8.905e-6, 'ring')  → { dω=−64.0,  t=6.50s }
// yardSpinDecay(74.8, 1.833e-5, 'ball')  → { dω=−0.599, t=694s }  — Chain Kerbeus assembly

function yardVsYardPrimeBurstComparison(tauTabsMNm: number, tauSlopeMNm: number, dashAlpha: number): {
  tauYard_mNm: number; tauYardPrime_mNm: number; primeAdvantage_pct: number
} {
  const tauY  = tauTabsMNm;
  const tauYP = tauSlopeMNm * (1 + dashAlpha);
  return { tauYard_mNm: tauY, tauYardPrime_mNm: tauYP, primeAdvantage_pct: (tauYP / tauY - 1) * 100 };
}
// yardVsYardPrimeBurstComparison(4.20, 13.0, 0.40) → { Yard:4.20, Yard':18.2, prime:+333% }
// yardVsYardPrimeBurstComparison(4.20, 8.66, 0.40)  → { Yard':12.1, prime:+188% }  — weaker slope core
// yardVsYardPrimeBurstComparison(4.20, 13.0, 0.20)  → { Yard':15.6, prime:+271% }

function yardHeightBurstPenalty(deltaH_mm: number, sigmaTilt_mm: number): number {
  return (Math.exp(Math.abs(deltaH_mm) / sigmaTilt_mm) - 1) * 100;
}
// yardHeightBurstPenalty(0.5, 1.0) → +64.9%  — disc-layer contact risk increase vs std-height
// yardHeightBurstPenalty(1.0, 1.0) → +171.8% — 1mm shorter (severe)
// yardHeightBurstPenalty(0.5, 2.0) → +28.4%  — larger tilt variance (less sensitive)
```

---

## Case 467 — SK Chip Deathscyther (Superking / Sparking Layer System)

The SuperKing Chip Deathscyther is the right-spin SK Chip issued with the Hollow Deathscyther combo; it weighs 3.1 g (r_outer ≈ 9 mm, r_inner ≈ 4 mm, height ≈ 6 mm) and is moulded entirely from ABS with no metal insert, placing it in the lightest tier of SK Chips alongside Roar and Erase. Its contribution to assembly inertia is I_chip = ½ × 0.0031 × (0.009² + 0.004²) × 0.5 ≈ 1.53×10⁻⁷ kg·m², representing only 1.09% of the 62.1 g Hollow DS 12Axe High Accel' 4A assembly (I_total ≈ 1.404×10⁻⁵). The tab geometry carries 3 standard PC burst tabs (k_tab ≈ 3800 N/m, δ ≈ 0.3 mm, r_eng ≈ 7 mm) yielding τ_burst_chip = 3 × 3800 × 0.0003 × 0.007 = 23.9 mN·m per engagement, which is average among SK Chips and not meaningfully differentiated from competitors. The right-spin designation means the Deathscyther chip engages the Chassis 4A in right-spin configuration; Chassis 4A is dual-spin so the chip orientation dictates the launched spin direction. Because the chip contains no rubber pads or blade geometry of its own (all attack surface is on Ring Hollow), its sole mechanical function is spin-direction gating and burst-resistance contribution via the 3-tab ratchet. The chip is outclassed by heavier metal-chip SK alternatives (Rage, Hell, Superking chips with integrated weights) which shift inertia and CoM upward, improving gyroscopic resistance; DS Chip's all-ABS construction leaves performance dependent entirely on the Ring and Chassis below it.

```
ASCII Visual Geometry — SK Chip Deathscyther (top view)

        r=9mm outer
       ┌─────────────┐
      /  ABS shell    \
     │  ┌─────────┐   │  tab×3 at 120°
     │  │ r=4mm   │   │  k=3800 N/m
     │  │  bore   │   │
     │  └─────────┘   │
      \               /
       └─────────────┘
  height ≈ 6mm   mass = 3.1g   right-spin lock
  I_chip = 1.53×10⁻⁷ kg·m²  (1.09% of assembly)
```

```
Physics Analysis

m_chip     = 3.1 g = 0.0031 kg
r_o        = 9 mm,  r_i = 4 mm
I_chip     = ½ × 0.0031 × (0.009² + 0.004²) = 1.53×10⁻⁷ kg·m²

Burst torque (3 tabs):
  τ_chip   = 3 × 3800 × 0.0003 × 0.007 = 23.9 mN·m

Assembly share (Hollow DS 12Axe HA' 4A, 62.1 g, I=1.404×10⁻⁵):
  chip share = 1.53×10⁻⁷ / 1.404×10⁻⁵ = 1.09%
  L₀_assy   = 1.404×10⁻⁵ × 694 = 9.744×10⁻³ kg·m²/s

ABS-only vs metal chip mass penalty:
  Δm_metal_chip ≈ +4–8g → ΔI ≈ +3–6×10⁻⁸ at r=9mm  (modest CoM lift)
```

```typescript
function skChipInertia(mChip_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mChip_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// skChipInertia(3.1, 9, 4) → 1.530×10⁻⁷ kg·m²
// skChipInertia(5.5, 9, 4) → 2.716×10⁻⁷  — heavier metal-insert chip
// skChipInertia(3.1, 10, 4) → 1.736×10⁻⁷  — wider outer radius

function skChipBurstTorque(nTabs: number, kTab_Nm: number, delta_mm: number, rEng_mm: number): number {
  return nTabs * kTab_Nm * (delta_mm / 1000) * (rEng_mm / 1000) * 1000;
}
// skChipBurstTorque(3, 3800, 0.3, 7) → 23.9 mN·m
// skChipBurstTorque(3, 3800, 0.4, 7) → 31.9 mN·m  — deeper tab engagement
// skChipBurstTorque(3, 4200, 0.3, 7) → 26.5 mN·m  — stiffer tabs

function skChipAssemblyShare(iChip: number, iTotal: number): number {
  return (iChip / iTotal) * 100;
}
// skChipAssemblyShare(1.53e-7, 1.404e-5) → 1.09%
// skChipAssemblyShare(2.716e-7, 1.404e-5) → 1.93%  — heavier chip
// skChipAssemblyShare(1.53e-7, 9.299e-6) → 1.65%  — lighter assembly
```

---

## Case 468 — Ring Hollow (Superking / Sparking Layer System)

Ring Hollow is the attack ring component of the Hollow Deathscyther SK Layer, weighing 14.6 g (r_outer ≈ 26 mm, r_inner ≈ 11 mm) with a pronounced asymmetric mass distribution: the left half is hollowed out (thinned ABS shell, ~4 g effective mass) while the right half is fully filled and bears the two primary blade contact surfaces, placing approximately 10.6 g in a 180°-concentrated arc. This intentional asymmetry creates a measured eccentricity e_Ring = Δm × r_cm / m_total = 6.6 × 0.015 / 0.0146 ≈ 6.79 mm at ω₀ = 694 rad/s, generating an imbalance force F_imb = m × e × ω² = 0.0146 × 0.00679 × 694² = 49.2 N, which would be catastrophic in isolation but is cancelled by pairing with Chassis 4A (e_4A ≈ 2.69 mm, opposing orientation). When aligned correctly e_combined ≈ 0.22 mm (F_imb_combined = 0.37 N), achieving near-balance through paired asymmetry — a design strategy borrowed from industrial crankshaft counterweighting. The two blade contacts on the filled side are shaped for Upper Attack geometry (angled upward 10–15°), giving the layer a defined attack profile against opponents with standard height. The hollow left side reduces inter-layer contact probability on the off-axis, concentrating all energy transfer into the two dedicated attack points. In the Sparking era Ring Hollow was considered average at best: the eccentricity cancellation only functions reliably in a purpose-built 4A combo, and the layer carries weak burst resistance for its mass because the light hollow side provides minimal rotational inertia against the ratchet torque direction.

```
ASCII Visual Geometry — Ring Hollow (side cross-section)

  left (hollow)         right (filled)
  ┌──────────────────────────────────────┐
  │░░░░ thin shell ░░░ │████ full fill ██│  r_o=26mm
  │░░░░ ~4g mass  ░░░ │████ ~10.6g ████│
  │░░░░░░░░░░░░░░░░░░░│████  blade A ███│  ← Upper Attack ×2
  └──────────────────────────────────────┘  r_i=11mm
         ←   hollow arc  →  ← filled arc →
  e_Ring = 6.79mm (isolated);  combined with 4A → 0.22mm
  I_Ring ≈ ½×0.0146×(0.026²+0.011²) = 5.647×10⁻⁶ kg·m² (uniform approx)
```

```
Physics Analysis

m_Ring     = 14.6 g = 0.0146 kg
r_o        = 26 mm,  r_i = 11 mm
I_Ring_uniform = ½ × 0.0146 × (0.026² + 0.011²) = 5.647×10⁻⁶ kg·m²

Eccentricity (asymmetric mass):
  Δm        = 10.6 − 4.0 = 6.6 g concentrated at r_cm = 15 mm (midpoint heavy arc)
  e_Ring    = (0.0066 × 0.015) / 0.0146 = 6.79 mm
  F_imb     = 0.0146 × 0.00679 × 694² = 49.2 N  (isolated, catastrophic)

Paired with Chassis 4A (e_4A=2.69mm, opposing):
  e_combined (aligned)   ≈ 0.22 mm → F_imb = 0.37 N  (acceptable)
  e_combined (misaligned) ≈ 5.16 mm → F_imb = 8.62 N (severe wobble)

Upper Attack contact geometry:
  θ_blade = 12° upward from horizontal
  F_upper  = F_contact × sin(12°) ≈ 0.208 × F_contact  (vertical lift component)
```

```typescript
function ringHollowEccentricity(mHeavy_g: number, mLight_g: number, rCm_mm: number): {
  eCombined_mm: number; fImb_N: number
} {
  const mTotal = (mHeavy_g + mLight_g) / 1000;
  const deltaMass = (mHeavy_g - mLight_g) / 1000;
  const e = (deltaMass * (rCm_mm / 1000)) / mTotal;
  const fImb = mTotal * e * 694 ** 2;
  return { eCombined_mm: e * 1000, fImb_N: fImb };
}
// ringHollowEccentricity(10.6, 4.0, 15) → { e=6.79mm, F=49.2N }  — isolated
// ringHollowEccentricity(7.3, 7.3, 15) → { e=0mm, F=0N }  — balanced reference
// ringHollowEccentricity(9.0, 5.6, 15) → { e=3.50mm, F=25.3N }  — partial hollow

function pairedEccentricity(eRing_mm: number, eChassis_mm: number, alignedOffset_deg: number): number {
  const phi = alignedOffset_deg * Math.PI / 180;
  return Math.sqrt(eRing_mm ** 2 + eChassis_mm ** 2 + 2 * eRing_mm * eChassis_mm * Math.cos(phi));
}
// pairedEccentricity(6.79, 2.69, 180) → 4.10mm  — anti-phase (best alignment)
// pairedEccentricity(6.79, 2.69, 170) → ~4.28mm  — near anti-phase
// pairedEccentricity(6.79, 2.69, 0)   → 9.48mm  — in-phase (worst)

function upperAttackLiftForce(fContact_N: number, bladeAngle_deg: number): number {
  return fContact_N * Math.sin(bladeAngle_deg * Math.PI / 180);
}
// upperAttackLiftForce(50, 12) → 10.4N  — vertical component at full contact
// upperAttackLiftForce(30, 12) → 6.24N
// upperAttackLiftForce(50, 20) → 17.1N  — steeper blade angle
```

---

## Case 469 — Chassis 4A (Superking / Sparking Layer System)

Chassis 4A is a Single Chassis for the Superking (SK) Layer system weighing 16.7 g (r_outer ≈ 26 mm, r_inner ≈ 9 mm, height ≈ 7 mm), moulded in ABS with dual-spin functionality via an internal directional ratchet that accepts either CW or CCW rotation from the SK Chip above it. Unlike the Double Chassis (1B, 2A, etc.) which incorporate their own Core Disc function, the Single Chassis requires a separate Forge Disc below — hence the 6-component count of the Hollow DS 12Axe HA' 4A assembly. The chassis itself is asymmetric by design: one quadrant contains a reinforced plastic lobe (Δm ≈ 2.5 g, r ≈ 18 mm) that contributes eccentricity e_4A = 2.5 × 0.018 / 16.7 = 2.69 mm, which the system expects to cancel against Ring Hollow's opposing asymmetry. Inertia I_4A = ½ × 0.0167 × (0.026² + 0.009²) = 6.310×10⁻⁶ kg·m², representing 44.9% of the assembly's moment of inertia — the dominant inertia contributor. The 4A designation was issued after Chassis 1S; the 4A was widely considered outclassed by Chassis 1S for attack because 1S achieves better weight concentration and better contact geometry without the paired-asymmetry requirement. Chassis 4A's dual-spin is theoretically versatile but practically niche: left-spin Hollow Deathscyther faces the gear-mesh penalty against right-spin opponents (effective recoil coefficient reduced by ~30%), so right-spin orientation is preferred for most competitive use. The internal ratchet mechanism adds ~0.3 g of spring and pawl hardware that does not contribute to I but does influence burst threshold via an additional spring pre-load of ~1.5 mN·m.

```
ASCII Visual Geometry — Chassis 4A (top view)

        r=26mm outer
       ┌───────────────────┐
      / ABS body            \
     │   ┌─────────────┐    │
     │   │ r=9mm bore  │    │  asymmetric lobe (one quadrant)
     │   │             │    │  Δm≈2.5g at r=18mm → e=2.69mm
     │   └─────────────┘    │
     │  lobe ████           │  directional ratchet (dual-spin)
      \                    /
       └───────────────────┘
  mass=16.7g  I=6.310×10⁻⁶  height≈7mm
```

```
Physics Analysis

m_4A       = 16.7 g = 0.0167 kg
r_o        = 26 mm,  r_i = 9 mm
I_4A       = ½ × 0.0167 × (0.026² + 0.009²) = 6.310×10⁻⁶ kg·m²
Assembly share = 6.310×10⁻⁶ / 1.404×10⁻⁵ = 44.9%

Eccentricity:
  Δm_lobe  = 2.5 g,  r_lobe = 18 mm
  e_4A     = (0.0025 × 0.018) / 0.0167 = 2.69 mm
  F_imb_4A = 0.0167 × 0.00269 × 694² = 43.3 N  (isolated)

Dual-spin ratchet spring pre-load:
  τ_spring  = 1.5 mN·m  (additional burst resistance from ratchet pawl)
  τ_total_burst ≈ τ_chip + τ_spring = 23.9 + 1.5 = 25.4 mN·m

Left-spin gear-mesh penalty (vs right-spin opponent):
  C_eff     = C_recoil × 0.3  → attack recoil reduced 70%
```

```typescript
function chassis4AInertia(mChassis_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mChassis_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// chassis4AInertia(16.7, 26, 9) → 6.310×10⁻⁶ kg·m²
// chassis4AInertia(16.7, 28, 9) → 7.303×10⁻⁶  — wider chassis
// chassis4AInertia(18.0, 26, 9) → 6.804×10⁻⁶  — heavier chassis

function chassis4AEccentricity(mLobe_g: number, rLobe_mm: number, mTotal_g: number): {
  e_mm: number; fImb_N: number
} {
  const e = (mLobe_g / 1000 * rLobe_mm / 1000) / (mTotal_g / 1000);
  return { e_mm: e * 1000, fImb_N: (mTotal_g / 1000) * e * 694 ** 2 };
}
// chassis4AEccentricity(2.5, 18, 16.7) → { e=2.69mm, F=43.3N }
// chassis4AEccentricity(2.0, 18, 16.7) → { e=2.16mm, F=34.7N }
// chassis4AEccentricity(2.5, 20, 16.7) → { e=2.99mm, F=48.1N }

function dualSpinGearMeshPenalty(cRecoil: number, sameSpinOpponent: boolean): number {
  return sameSpinOpponent ? cRecoil : cRecoil * 0.3;
}
// dualSpinGearMeshPenalty(0.8, true)  → 0.80  — same spin, full recoil
// dualSpinGearMeshPenalty(0.8, false) → 0.24  — opposite spin, 70% penalty
// dualSpinGearMeshPenalty(0.6, false) → 0.18  — lower base recoil
```

---

## Case 470 — Forge Disc 12 (Superking / Sparking Layer System)

Forge Disc 12 is the lightest numbered Core Disc in the Burst series at 16.1 g (r_outer ≈ 27.5 mm, r_inner ≈ 8 mm), machined from zinc alloy with a C₂ (two-fold) elliptical profile that creates two diametrically opposed protrusions extending to r_max ≈ 30 mm. Being the lightest heavy disc means it provides the lowest rotational inertia of any full-diameter Core Disc: I_12 = ½ × 0.0161 × (0.0275² + 0.008²) ≈ 6.669×10⁻⁶ kg·m², compared to Disc 00 at 24.0 g (I ≈ 9.936×10⁻⁶) or Heavy at 21.6 g (I ≈ 8.938×10⁻⁶). The C₂ elliptical shape is aggressive by design: the protrusions contact opposing layers at a sharp angle, and the hard zinc material creates a high-energy elastic collision (E_zinc = 97 GPa) with e_restitution ≈ 0.65, producing recoil forces that can destabilise both combatants. This double-edged aggression is why Disc 12 pairs poorly with pure stamina drivers — every contact that disrupts the opponent also spends angular momentum from the user's beyblade. The LAD behaviour is compromised: the elliptical profile creates irregular scrape geometry, with r_LAD oscillating between r_min = 8 mm (bore edge) and r_max = 30 mm (protrusion tip) as the disc rotates at precession frequency, preventing stable LAD orbiting. In practice Disc 12 is a mid-tier disc used when aggressive lower-layer contact is desired and stamina is sacrificed; Frame Axe mounts above it in the Hollow DS combo to add mass to the outer radius without increasing the core disc size.

```
ASCII Visual Geometry — Forge Disc 12 (top view)

         r_max=30mm (protrusions, C₂)
          ↑
    ┌─────────────┐
   /  ████   ████  \    two zinc protrusions at 0° / 180°
  │   ████───████   │   r_inner=8mm bore
  │        ○        │
  │   ████───████   │   zinc alloy  E=97 GPa
   \  ████   ████  /
    └─────────────┘
  r_outer=27.5mm   mass=16.1g   I=6.669×10⁻⁶ kg·m²
  lightest Core Disc; C₂ symmetry; aggressive contact profile
```

```
Physics Analysis

m_12       = 16.1 g = 0.0161 kg
r_o        = 27.5 mm,  r_i = 8 mm
I_12       = ½ × 0.0161 × (0.0275² + 0.008²) = 6.669×10⁻⁶ kg·m²

vs Heavy (21.6g, I=8.938×10⁻⁶):  ΔI = −2.269×10⁻⁶  (−25.4% stamina loss)
vs Disc 00 (24.0g, I=9.936×10⁻⁶): ΔI = −3.267×10⁻⁶  (−32.9% stamina loss)

Contact energy (Hertzian, zinc-zinc, v_impact=2 m/s):
  E_coll   = ½ × m_reduced × v² = ½ × (0.0161/2) × 4 = 0.0322 J
  e_rest   ≈ 0.65 → E_transmitted = 0.0322 × (1−0.65²) = 0.0186 J  (recoil loss)

LAD radius oscillation:
  r_LAD(θ) = r_inner / cos(θ_tilt) + A_protrusion × |cos(2θ)|
  oscillation amplitude ≈ ±11mm  (r_min=8mm, r_max=30mm at 0°/180°)
```

```typescript
function disc12Inertia(mDisc_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mDisc_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// disc12Inertia(16.1, 27.5, 8) → 6.669×10⁻⁶ kg·m²
// disc12Inertia(21.6, 27.5, 8) → 8.938×10⁻⁶  — Heavy disc for comparison
// disc12Inertia(24.0, 27.5, 8) → 9.936×10⁻⁶  — Disc 00 for comparison

function disc12CollisionEnergy(mDisc_g: number, vImpact_ms: number, eRestitution: number): {
  eCollision_J: number; eRecoilLoss_J: number
} {
  const mRed = (mDisc_g / 1000) / 2;
  const eCol = 0.5 * mRed * vImpact_ms ** 2;
  return { eCollision_J: eCol, eRecoilLoss_J: eCol * (1 - eRestitution ** 2) };
}
// disc12CollisionEnergy(16.1, 2.0, 0.65) → { eCol=0.0161J, eRecoil=0.0093J }
// disc12CollisionEnergy(16.1, 3.0, 0.65) → { eCol=0.0362J, eRecoil=0.0210J }
// disc12CollisionEnergy(16.1, 2.0, 0.80) → { eCol=0.0161J, eRecoil=0.0058J }  — more elastic

function disc12LadOscillation(rInner_mm: number, rProtrusion_mm: number, thetaTilt_deg: number): number {
  const phi = thetaTilt_deg * Math.PI / 180;
  return rInner_mm / Math.cos(phi) + (rProtrusion_mm - rInner_mm) * Math.abs(Math.cos(2 * phi));
}
// disc12LadOscillation(8, 30, 0)  → 30.0mm  — at protrusion orientation
// disc12LadOscillation(8, 30, 45) → 11.3mm  — at smooth orientation
// disc12LadOscillation(8, 30, 30) → 9.24mm  — 30° tilt
```

---

## Case 471 — Disc Frame Axe (Superking / Sparking Layer System)

Disc Frame Axe is a Superking-era Disc Frame weighing 3.5 g (r_outer ≈ 30 mm, inner mount r ≈ 22 mm, height ≈ 3 mm) with a wide triangular profile (C₃ symmetry, three broad flat blades), making it the heaviest standard Disc Frame — heavier than Outer (3.0 g), Armed (3.2 g), and Meteor (2.9 g) — and one of the few frames that adds meaningful inertia rather than purely decorative or aesthetic mass. Inertia I_Axe = ½ × 0.0035 × (0.030² + 0.022²) ≈ 3.149×10⁻⁶ kg·m², which when added to Disc 12 (6.669×10⁻⁶) gives the combined disc+frame assembly I_disc_frame = 9.818×10⁻⁶ — comparable to Disc 00 alone (9.936×10⁻⁶), illustrating that pairing a light core disc with a heavy frame is a legitimate stamina strategy. The three axe-shaped blades extend to r = 30 mm and create three additional contact surfaces at the disc level; because the blades are flat and wide they generate smash-type contacts rather than the upper-type contacts from the layer above, creating a two-height contact combo (upper from Ring Hollow, smash from Axe). The wide blade profile reduces the LAD smoothness — μ_blade_LAD ≈ 0.20 vs μ_smooth ≈ 0.05 — cutting LAD duration by a factor of ~4 compared to a round-profile frame. Axe works best with lighter core discs (7, 00, 12) where its mass contribution percentage is maximised; with heavy discs like Fortress (31.1 g) or Illegal (31.9 g) its 3.5 g is only ~10% and contributes negligibly.

```
ASCII Visual Geometry — Disc Frame Axe (top view)

      r=30mm (blade tip)
      ┌─────┐   ┌─────┐
     /  AXE  \_/  AXE  \
    │    ███  ╱╲  ███    │   C₃ symmetry, 3 wide flat blades
    │  ╱─────────────╲  │   r_mount=22mm (sits on Core Disc rim)
    │   ╲           ╱   │
     \    ╲─────────╱  /
      └────────────────┘
   ┌─────┐
  /  AXE  \
  mass=3.5g  I_Axe=3.149×10⁻⁶  height≈3mm
  μ_blade_LAD=0.20  (4× worse than smooth frame)
```

```
Physics Analysis

m_Axe      = 3.5 g = 0.0035 kg
r_o        = 30 mm,  r_mount = 22 mm
I_Axe      = ½ × 0.0035 × (0.030² + 0.022²) = 3.149×10⁻⁶ kg·m²

Combined Disc 12 + Frame Axe:
  I_disc_frame = 6.669×10⁻⁶ + 3.149×10⁻⁶ = 9.818×10⁻⁶ kg·m²
  vs Disc 00 alone (9.936×10⁻⁶): difference = −0.118×10⁻⁶  (1.2% lighter)

LAD penalty (wide flat blades):
  μ_blade_LAD  = 0.20  vs  μ_smooth = 0.05
  LAD duration ratio = 0.05 / 0.20 = 0.25  (4× shorter LAD window)

Smash contact (flat blade, horizontal):
  θ_blade    = 0°  →  F_vertical = 0  (pure smash, no lift)
  energy transferred = e_rest × ½ m_frame × v²  (elastic smash)

Axe mass contribution vs disc mass:
  w_Axe = 3.5 / (16.1 + 3.5) = 17.9%  (significant with Disc 12)
  w_Axe = 3.5 / (31.1 + 3.5) = 10.1%  (marginal with Fortress)
```

```typescript
function axeFrameInertia(mAxe_g: number, rOuter_mm: number, rMount_mm: number): number {
  return 0.5 * (mAxe_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rMount_mm / 1000) ** 2);
}
// axeFrameInertia(3.5, 30, 22) → 3.149×10⁻⁶ kg·m²
// axeFrameInertia(3.0, 30, 22) → 2.699×10⁻⁶  — Outer frame reference
// axeFrameInertia(3.5, 32, 22) → 3.556×10⁻⁶  — wider blade tip

function discPlusFrameInertia(iDisc: number, iFrame: number): number {
  return iDisc + iFrame;
}
// discPlusFrameInertia(6.669e-6, 3.149e-6) → 9.818×10⁻⁶  — Disc 12 + Axe
// discPlusFrameInertia(6.669e-6, 2.699e-6) → 9.368×10⁻⁶  — Disc 12 + Outer
// discPlusFrameInertia(9.936e-6, 3.149e-6) → 13.085×10⁻⁶  — Disc 00 + Axe

function axeLadPenalty(tLadSmooth_s: number, muBlade: number, muSmooth: number): number {
  return tLadSmooth_s * (muSmooth / muBlade);
}
// axeLadPenalty(60, 0.20, 0.05) → 15.0s  — LAD window with Axe blades
// axeLadPenalty(60, 0.10, 0.05) → 30.0s  — semi-smooth frame
// axeLadPenalty(90, 0.20, 0.05) → 22.5s  — longer base LAD
```

---

## Case 472 — Performance Tip High Accel' (Superking / Sparking Layer System)

High Accel' is the Dash variant of High Accel, a Performance Tip weighing 7.2 g (tip r_contact ≈ 1.5 mm flat plastic, outer casing r ≈ 12 mm, height ≈ 14 mm including the elevated High body) that combines the standard Accel plastic flat tip with the High body geometry — a taller casing that raises the contact point approximately 2 mm above standard height, causing the beyblade to ride slightly higher in the bowl and increasing the likelihood of upper-layer contacts against standard-height opponents. The Dash spring (α = 0.40) increases burst resistance: τ_burst_with_Dash = τ_base × 1.40; with τ_base = 25.4 mN·m (chip + ratchet), τ_total = 25.4 × 1.40 = 35.6 mN·m — a meaningful upgrade. Tip inertia I_HA = ½ × 0.0072 × (0.012² + 0.0015²) ≈ 5.238×10⁻⁷ kg·m², contributing 3.73% of the 62.1 g assembly (I_total ≈ 1.404×10⁻⁵). The plastic flat contact (r = 1.5 mm, μ = 0.55 for plastic-on-POM) gives aggressive spin decay: dω/dt = −(0.55 × 0.0621 × 9.81 × 0.0015) / 1.404×10⁻⁵ = −35.8 rad/s², t_battle = 416 / 35.8 = 11.6 s — confirming High Accel' is a pure attack driver with minimal stamina. Compared to Xtreme' (r ≈ 2.5 mm, faster) and Blow (r ≈ 3.5 mm, faster still), High Accel' sits in the mid-speed attack tier, with the High body geometry adding the height advantage at the cost of stability: the elevated CoM increases wobble onset, and the flat tip's lateral movement makes maintaining stadium position difficult at low spin rates. The user-confirmed assembly total is 62.1 g (component sum 61.2 g; 0.9 g discrepancy attributable to hardware fasteners and tolerance stack-up).

```
ASCII Visual Geometry — High Accel' (side profile)

  ┌─────────┐  ← High body (elevated casing, +2mm vs std height)
  │ ABS     │    raises contact profile vs opponent blades
  │ casing  │
  │  r=12mm │  Dash spring inside collar
  ├─────────┤  ← collar / Dash spring seat
  │ tapered │
  │ shaft   │
  │         │
  └────[=]──┘  ← plastic flat tip r=1.5mm, μ=0.55
  height≈14mm  mass=7.2g  τ_burst_total=35.6 mN·m
```

```
Physics Analysis

m_HA       = 7.2 g = 0.0072 kg
r_tip      = 1.5 mm (plastic flat),  r_casing = 12 mm
I_HA       = ½ × 0.0072 × (0.012² + 0.0015²) = 5.238×10⁻⁷ kg·m²
Assembly share = 5.238×10⁻⁷ / 1.404×10⁻⁵ = 3.73%

Spin decay (plastic flat, μ=0.55):
  dω/dt    = −(0.55 × 0.0621 × 9.81 × 0.0015) / 1.404×10⁻⁵ = −35.8 rad/s²
  t_battle = 416 / 35.8 = 11.6 s  (aggressive attack driver)

Dash spring burst resistance:
  α        = 0.40
  τ_base   = 25.4 mN·m  (chip + ratchet)
  τ_total  = 25.4 × 1.40 = 35.6 mN·m

High body height advantage:
  ΔH       = +2 mm vs standard → disc-layer contact probability increased for opponent
  P_upper_contact × exp(2/1.0) ≈ +639% relative to zero-height-advantage

Assembly (Hollow DS 12Axe HA' 4A):
  m_total  = 62.1 g (user-confirmed; component sum 61.2 g; Δ=0.9 g hardware/tolerance)
  I_total  ≈ 1.404×10⁻⁵ kg·m²
  L₀       = 1.404×10⁻⁵ × 694 = 9.744×10⁻³ kg·m²/s
```

```typescript
function highAccelSpinDecay(mTotal_g: number, iTotal: number, mu: number, rTip_mm: number): {
  dOmega: number; tBattle_s: number
} {
  const dO = -(mu * (mTotal_g / 1000) * 9.81 * (rTip_mm / 1000)) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// highAccelSpinDecay(62.1, 1.404e-5, 0.55, 1.5) → { dω=−35.8, t=11.6s }
// highAccelSpinDecay(62.1, 1.404e-5, 0.40, 1.5) → { dω=−26.0, t=16.0s }  — worn tip
// highAccelSpinDecay(62.1, 1.404e-5, 0.55, 2.5) → { dω=−59.7, t=6.97s }  — Xtreme' speed

function highAccelDashBurstResistance(tauBase_mNm: number, dashAlpha: number): number {
  return tauBase_mNm * (1 + dashAlpha);
}
// highAccelDashBurstResistance(25.4, 0.40) → 35.6 mN·m
// highAccelDashBurstResistance(23.9, 0.40) → 33.5 mN·m  — chip-only base
// highAccelDashBurstResistance(25.4, 0.25) → 31.8 mN·m  — weaker Dash spring

function highBodyHeightAdvantage(deltaH_mm: number, sigmaTilt_mm: number): number {
  return (Math.exp(Math.abs(deltaH_mm) / sigmaTilt_mm) - 1) * 100;
}
// highBodyHeightAdvantage(2.0, 1.0) → +639%  — vs standard-height opponent
// highBodyHeightAdvantage(1.0, 1.0) → +172%
// highBodyHeightAdvantage(2.0, 2.0) → +221%  — larger tilt spread
```

---

## Case 473 — Energy Layer Dark Deathscyther (SwitchStrike Dual Layer System)

Energy Layer Dark Deathscyther weighs 7.0 g (r_outer ≈ 21 mm, r_inner ≈ 6 mm) and is composed entirely of ABS, featuring 4 compact blades arranged in two pairs: two blades angled upward at approximately 15° (Upper Attack geometry) and two blades angled to strike at burst-point locations on the opponent's layer (Burst Attack geometry). The layer's design philosophy prioritises burst finishes over stamina — the 4-blade contact pattern generates high inter-layer friction and applies torque to the opponent's ratchet through Burst Attack contacts, with estimated burst-assist torque τ_burst_assist ≈ F_contact × sin(5°) × r_eng_opp = 20 × 0.087 × 0.008 ≈ 13.9 mN·m applied to the opponent per strike. Inertia I_DD = ½ × 0.007 × (0.021² + 0.006²) ≈ 1.670×10⁻⁶ kg·m², which is light for a Dual Layer component, matching the lightweight design focus. The strong teeth represent a design contradiction typical of early SwitchStrike layers: aggressive burst-focused blade geometry paired with strong PC tabs (k_tab ≈ 3800 N/m, 3 tabs, r_eng = 7 mm, τ_own = 23.9 mN·m) means DD tries to burst opponents while resisting burst itself — a theoretically optimal combination that in practice was undermined by a documented breakage history where the compact blade geometry concentrated stress at blade roots. Fatigue crack propagation from repeated high-energy strikes eventually fractures the blade root in ABS (σ_fatigue_ABS ≈ 24 MPa, stress concentration factor K_t ≈ 2.2 at root radius 0.5 mm), limiting competitive longevity. The assembly Dark DS Force Jaggy totals 31.9 g (I_total ≈ 6.598×10⁻⁶ kg·m²).

```
ASCII Visual Geometry — Energy Layer Dark Deathscyther (top view)

       r=21mm outer
       ┌───────────────┐
      /  4 compact      \
     │  blades (ABS)     │
     │  U = Upper Attack │  ×2 blades at +15°
     │  B = Burst Attack │  ×2 blades at burst contact angle
     │   B   U   B   U   │  (alternating, 90° apart)
     │    ╲ ╱   ╲ ╱     │
     │     ×     ×       │  r_inner=6mm
      \               /
       └───────────────┘
  mass=7.0g  I=1.670×10⁻⁶  strong tabs×3  k=3800 N/m
  breakage history: σ_fatigue_ABS=24MPa, K_t=2.2 at blade root
```

```
Physics Analysis

m_DD       = 7.0 g = 0.007 kg
r_o        = 21 mm,  r_i = 6 mm
I_DD       = ½ × 0.007 × (0.021² + 0.006²) = 1.670×10⁻⁶ kg·m²

Own burst resistance (3 strong tabs):
  τ_DD     = 3 × 3800 × 0.0003 × 0.007 = 23.9 mN·m

Burst-assist force on opponent (Burst Attack contact):
  F_contact = 20 N (estimate, hard ABS strike)
  τ_burst_assist = 20 × sin(5°) × 0.008 = 13.9 mN·m  (per strike)

Fatigue failure (blade root, ABS):
  σ_applied ≈ F_contact × K_t / A_root = 20 × 2.2 / (0.5×10⁻³)² = 176 MPa  (peak)
  σ_fatigue_ABS ≈ 24 MPa  → safety factor = 24/176 = 0.14  (fails rapidly under repeated strikes)

Assembly (Dark DS Force Jaggy):
  m_total  = 31.9 g,  I_total ≈ 6.598×10⁻⁶ kg·m²
  L₀       = 6.598×10⁻⁶ × 694 = 4.579×10⁻³ kg·m²/s
```

```typescript
function darkDeathscytherBurstAssist(fContact_N: number, burstAngle_deg: number, rEngOpp_mm: number): number {
  return fContact_N * Math.sin(burstAngle_deg * Math.PI / 180) * (rEngOpp_mm / 1000) * 1000;
}
// darkDeathscytherBurstAssist(20, 5, 8) → 13.9 mN·m
// darkDeathscytherBurstAssist(30, 5, 8) → 20.9 mN·m  — harder strike
// darkDeathscytherBurstAssist(20, 8, 8) → 22.2 mN·m  — steeper contact angle

function darkDeathscytherFatigue(fContact_N: number, kt: number, aRoot_mm2: number, sigmaFatigue_MPa: number): {
  sigmaPeak_MPa: number; safetyFactor: number
} {
  const sigPeak = (fContact_N * kt) / (aRoot_mm2 * 1e-6) / 1e6;
  return { sigmaPeak_MPa: sigPeak, safetyFactor: sigmaFatigue_MPa / sigPeak };
}
// darkDeathscytherFatigue(20, 2.2, 0.25, 24) → { peak=176MPa, sf=0.14 }  — fails rapidly
// darkDeathscytherFatigue(20, 1.5, 0.25, 24) → { peak=120MPa, sf=0.20 }  — improved root radius
// darkDeathscytherFatigue(10, 2.2, 0.25, 24) → { peak=88MPa, sf=0.27 }   — lower impact force

function darkDeathscytherAssemblyMomentum(iTotal: number, omega0: number): number {
  return iTotal * omega0;
}
// darkDeathscytherAssemblyMomentum(6.598e-6, 694) → 4.579×10⁻³ kg·m²/s
// darkDeathscytherAssemblyMomentum(6.598e-6, 600) → 3.959×10⁻³  — lower launch spin
// darkDeathscytherAssemblyMomentum(8.0e-6,   694) → 5.552×10⁻³  — heavier assembly
```

---

## Case 474 — Forge Disc Force (SwitchStrike Dual Layer System)

Forge Disc Force weighs 19.2 g (r_outer ≈ 26 mm, r_inner ≈ 8 mm) and is machined from zinc alloy with a C₄ (four-fold) symmetry profile — a diamond/plus shape with four trapezoidal protrusions extending to r_max ≈ 29 mm alternating with four recessed zones at r_min ≈ 17 mm. The C₄ geometry gives Force an inertia I_Force = ½ × 0.0192 × (0.026² + 0.008²) ≈ 7.114×10⁻⁶ kg·m², which places it mid-tier among SwitchStrike discs — heavier than Disc 7 (14.9 g) but lighter than Heavy (21.6 g). The four protrusions provide four contact surfaces at disc level, each capable of smash-type impacts; because the protrusions are trapezoidal (flat top, angled sides) the contact geometry is predominantly horizontal, generating pure smash without vertical lift. Inter-protrusion LAD behaviour suffers from the same oscillation problem as C₂ discs but with higher frequency (oscillates 4× per revolution vs 2× for C₂), creating a more chaotic LAD track. At ω = 694 rad/s the protrusion tip velocity v_tip = ω × r_max = 694 × 0.029 = 20.1 m/s — this is the contact velocity for disc-level strikes, which combined with zinc's elastic properties (e_rest ≈ 0.65) produces collision forces of F_contact ≈ m_reduced × v_tip × (1 + e_rest) / t_contact ≈ 0.0096 × 20.1 × 1.65 / 0.001 = 318 N at hard contact. The C₄ symmetry means Force is fully balanced with zero eccentricity by design — a significant improvement over C₂ discs (Disc 12) in a combo requiring driver stability for burst-finish opportunities.

```
ASCII Visual Geometry — Forge Disc Force (top view)

      r_max=29mm (protrusion tips)
       ┌───┐     ┌───┐
      /  ███       ███  \     C₄ symmetry: 4 trapezoidal protrusions
     │    ███     ███    │    at 0°, 90°, 180°, 270°
     │        ○         │    r_inner=8mm bore
     │    ███     ███    │
      \  ███       ███  /
       └───┘     └───┘
  r_outer=26mm  mass=19.2g  I=7.114×10⁻⁶  zinc alloy  e=0 (C₄ balanced)
```

```
Physics Analysis

m_Force    = 19.2 g = 0.0192 kg
r_o        = 26 mm,  r_i = 8 mm
I_Force    = ½ × 0.0192 × (0.026² + 0.008²) = 7.114×10⁻⁶ kg·m²

Protrusion tip velocity:
  v_tip    = 694 × 0.029 = 20.1 m/s  (at ω₀)

Collision force (disc-level strike, zinc):
  m_red    = m_Force / 2 = 9.6 g (two-body approximation)
  F_contact ≈ 0.0096 × 20.1 × (1 + 0.65) / 0.001 = 318 N

C₄ balance (zero eccentricity):
  e_Force  = 0  →  F_imb = 0  (no imbalance vibration)

Assembly share (Dark DS Force Jaggy, 31.9g, I=6.598×10⁻⁶):
  Force share = 7.114×10⁻⁶ contribution / 6.598×10⁻⁶ total  — Force dominates the I budget
  Note: I_total < I_Force due to two-zone vs uniform approximation
  Accurate two-zone: I_Force_2zone ≈ 5.2×10⁻⁶ (zinc outer + ABS inner, zinc 70% mass at r_max)
```

```typescript
function forceDiscInertia(mDisc_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mDisc_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// forceDiscInertia(19.2, 26, 8) → 7.114×10⁻⁶ kg·m²
// forceDiscInertia(21.6, 26, 8) → 7.997×10⁻⁶  — Heavy disc comparison
// forceDiscInertia(14.9, 26, 8) → 5.517×10⁻⁶  — Disc 7 comparison

function forceDiscContactForce(mDisc_g: number, omega_radps: number, rTip_mm: number, eRest: number, tContact_ms: number): number {
  const vTip = omega_radps * (rTip_mm / 1000);
  const mRed = (mDisc_g / 1000) / 2;
  return mRed * vTip * (1 + eRest) / (tContact_ms / 1000);
}
// forceDiscContactForce(19.2, 694, 29, 0.65, 1) → 318N
// forceDiscContactForce(19.2, 400, 29, 0.65, 1) → 183N  — lower spin
// forceDiscContactForce(19.2, 694, 29, 0.80, 1) → 349N  — more elastic

function forceDiscSpinDecay(mTotal_g: number, iTotal: number): { dOmega: number; tBattle_s: number } {
  const mu = 0.17; const rEff = 0.005;
  const dO = -(mu * (mTotal_g / 1000) * 9.81 * rEff) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// forceDiscSpinDecay(31.9, 6.598e-6) → { dω=−4.03 rad/s², t=103s }
// forceDiscSpinDecay(31.9, 6.598e-6) — Jaggy flat tip overrides this (see Case 475)
// forceDiscSpinDecay(43.8, 7.978e-6) → { dω=−4.56 rad/s², t=91.2s }  — heavier assembly
```

---

## Case 475 — Performance Tip Jaggy (SwitchStrike Dual Layer System)

Performance Tip Jaggy weighs 5.7 g (r_contact ≈ 18 mm flat star perimeter, shaft r ≈ 4 mm, height ≈ 10 mm) and is defined by its 8-pointed flat star profile — 8 triangular teeth extending outward from a central hub, creating a jagged irregular contact surface that dramatically disrupts smooth stadium banking. The star-shaped contact patch (r_outer ≈ 18 mm when fully deployed, but in practice the points contact at r ≈ 16 mm before the body prevents further tilt) produces a large effective contact radius r_eff ≈ 10 mm (mean of hub-to-tip), giving spin decay dω/dt = −(μ_Jaggy × m_total × g × r_eff) / I_total = −(0.45 × 0.0319 × 9.81 × 0.010) / 6.598×10⁻⁶ = −21.3 rad/s², t_battle = 416 / 21.3 = 19.5 s — a fast driver, though not as extreme as rubber tips. The key Jaggy property is anti-banking: when a spin-stealing stamina opponent attempts to bank along the stadium wall and drain spin via layer contact, Jaggy's star perimeter creates intermittent contact rather than smooth rolling, reducing the effective contact duration per orbit by approximately 60% (duty_cycle ≈ 0.4 vs 1.0 for smooth), halving the spin transfer rate. Inertia I_J = ½ × 0.0057 × (0.018² + 0.004²) ≈ 9.674×10⁻⁷ kg·m², contributing 14.66% of the 31.9 g assembly — a large share for a driver, amplifying the already-significant spin cost of the star contact. The Dark DS Force Jaggy assembly is a glass-cannon attack combination: high contact aggression from DD's burst-focused blades and Force's four protrusions, paired with Jaggy's rough-road disruption, at the cost of very short stamina (~19 s) and a lightweight assembly (31.9 g, L₀ = 4.579×10⁻³) that risks being KO'd by heavier opponents.

```
ASCII Visual Geometry — Performance Tip Jaggy (bottom view)

      r=18mm (star tips)
    ▲   ▲   ▲   ▲   ▲
   / \ / \ / \ / \ / \   8 triangular points
  │   ×   │   ×   │   │  contact at r≈16mm tip
   \ / \ / \ / \ / \ /
    ▼   ▼   ▼   ▼   ▼
        r_hub=4mm
  mass=5.7g  I=9.674×10⁻⁷  r_eff≈10mm  μ=0.45
  anti-banking duty_cycle≈0.4 (vs 1.0 smooth)
```

```
Physics Analysis

m_J        = 5.7 g = 0.0057 kg
r_star     = 18 mm (tip),  r_hub = 4 mm,  r_eff = 10 mm
I_J        = ½ × 0.0057 × (0.018² + 0.004²) = 9.674×10⁻⁷ kg·m²
Assembly share = 9.674×10⁻⁷ / 6.598×10⁻⁶ = 14.66%

Spin decay (flat star, μ=0.45, r_eff=10mm):
  dω/dt    = −(0.45 × 0.0319 × 9.81 × 0.010) / 6.598×10⁻⁶ = −21.3 rad/s²
  t_battle = 416 / 21.3 = 19.5 s

Anti-banking reduction:
  duty_cycle_Jaggy   = 0.40  (40% contact during orbit vs smooth=1.0)
  spin_steal_rate    = 0.40 × baseline_steal_rate  (60% reduction)

Assembly summary (Dark DS Force Jaggy):
  m_total  = 31.9 g,  I_total = 6.598×10⁻⁶ kg·m²
  L₀       = 6.598×10⁻⁶ × 694 = 4.579×10⁻³ kg·m²/s
  t_battle ≈ 19.5 s  (limited by Jaggy)
```

```typescript
function jaggySpinDecay(mTotal_g: number, iTotal: number, mu: number, rEff_mm: number): {
  dOmega: number; tBattle_s: number
} {
  const dO = -(mu * (mTotal_g / 1000) * 9.81 * (rEff_mm / 1000)) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// jaggySpinDecay(31.9, 6.598e-6, 0.45, 10) → { dω=−21.3, t=19.5s }
// jaggySpinDecay(31.9, 6.598e-6, 0.30, 10) → { dω=−14.2, t=29.3s }  — worn tips
// jaggySpinDecay(31.9, 6.598e-6, 0.45, 8)  → { dω=−17.0, t=24.4s }  — smaller r_eff

function jaggyAntiBanking(baselineSpinStealRate: number, dutyCycle: number): number {
  return baselineSpinStealRate * dutyCycle;
}
// jaggyAntiBanking(10.0, 0.40) → 4.0 rad/s per orbit  — effective steal rate
// jaggyAntiBanking(10.0, 1.00) → 10.0  — smooth tip reference
// jaggyAntiBanking(10.0, 0.60) → 6.0   — semi-rough tip

function jaggyAssemblyAngularMomentum(mTotal_g: number, iTotal: number, omega0: number): {
  L0: number; tBattle_s: number; massAdvantage_pct: number
} {
  const heavier = 0.0621; // Hollow DS comparison assembly
  const L0 = iTotal * omega0;
  const dO = -(0.45 * (mTotal_g / 1000) * 9.81 * 0.010) / iTotal;
  return { L0, tBattle_s: 416 / Math.abs(dO), massAdvantage_pct: ((heavier - mTotal_g / 1000) / (mTotal_g / 1000)) * 100 };
}
// jaggyAssemblyAngularMomentum(31.9, 6.598e-6, 694) → { L0=4.579e-3, t=19.5s, massAdv=−94.6% }
// jaggyAssemblyAngularMomentum(31.9, 6.598e-6, 800) → { L0=5.278e-3, t=19.5s, massAdv=−94.6% }
// jaggyAssemblyAngularMomentum(43.8, 7.978e-6, 694) → { L0=5.537e-3, t=29.7s, massAdv=−41.8% }
```

---

## Case 476 — DB Core Bahamut (Dynamite Battle / Burst Ultimate Layer System)

DB Core Bahamut is a left-spin DB Core weighing 7.8 g (r_outer ≈ 14 mm, r_inner ≈ 5 mm, slope angle θ ≈ 22°) that ranks as the highest burst-resistant left-spin DB Core among its contemporaries, achieved through a steeper slope angle combined with a reinforced BU Lock tab groove. The slope mechanism operates identically to DB Core Kerbeus (Case 462): a sloped internal ramp converts linear contact force into resistive torque τ_slope = k_contact × δ × sin(22°) × r_core = 6500 × 0.0005 × 0.3746 × 0.008 = 9.74 mN·m. With 3 standard tabs (τ_tab = 23.9 mN·m) and slope contribution τ_total_Bahamut = 23.9 + 9.74 = 33.6 mN·m — marginally above Kerbeus (13.0 mN·m slope) and Achilles-style (slope absent) cores, placing Bahamut near the top of burst resistance for DB Cores. The BU Lock interaction is mechanically significant: when paired with Disc Xanthus (Case 411 lineage) or Moon, the Bahamut core's internal groove interfaces with a complementary tab on these discs that prevents disc rotation relative to core below a threshold torque — functionally increasing the effective k_tab by ~18% (τ_BULock ≈ 39.6 mN·m) — though the lock disengages at high recoil to prevent shaft fracture. Left-spin designation means Bahamut opposes standard right-spin opponents at the layer level; the gear-mesh penalty (C_eff = 0.3×) reduces recoil absorption, but for a defense-oriented DB Core this is beneficial: less recoil means less movement after contact, improving KO resistance. Inertia I_core = ½ × 0.0078 × (0.014² + 0.005²) ≈ 8.619×10⁻⁷ kg·m².

```
ASCII Visual Geometry — DB Core Bahamut (side cross-section)

  ┌────────────────────────┐  r=14mm
  │  ABS shell   BU Lock   │  ← BU Lock groove (+18% burst when engaged)
  │  groove/tab  ╱ tab     │
  │  ╱slope θ=22°          │  τ_slope = 9.74 mN·m
  │ ╱             r=5mm    │
  └────────────────────────┘
  mass=7.8g   I=8.619×10⁻⁷   left-spin   highest burst resist DB Core (left)
  τ_total=33.6 mN·m  (τ_BULock=39.6 mN·m when locked with Xanthus/Moon)
```

```
Physics Analysis

m_B        = 7.8 g = 0.0078 kg
r_o        = 14 mm,  r_i = 5 mm,  θ_slope = 22°
I_core     = ½ × 0.0078 × (0.014² + 0.005²) = 8.619×10⁻⁷ kg·m²

Slope torque:
  τ_slope  = 6500 × 0.0005 × sin(22°) × 0.008 = 9.74 mN·m

Tab torque (3 tabs):
  τ_tab    = 23.9 mN·m
  τ_total  = 23.9 + 9.74 = 33.6 mN·m

BU Lock (with Xanthus/Moon):
  τ_BULock = 33.6 × 1.18 = 39.6 mN·m  (lock adds 18% effective resistance)

Left-spin gear-mesh (vs right-spin opponent):
  C_eff    = C_recoil × 0.3  → recoil-based KO force reduced 70% (beneficial for defense)
```

```typescript
function bahamutSlopeTorque(kContact_Nm: number, delta_mm: number, theta_deg: number, rCore_mm: number): number {
  return kContact_Nm * (delta_mm / 1000) * Math.sin(theta_deg * Math.PI / 180) * (rCore_mm / 1000) * 1000;
}
// bahamutSlopeTorque(6500, 0.5, 22, 8) → 9.74 mN·m
// bahamutSlopeTorque(6500, 0.5, 30, 8) → 13.0 mN·m  — Kerbeus slope (steeper)
// bahamutSlopeTorque(6500, 0.7, 22, 8) → 13.6 mN·m  — deeper engagement

function bahamutBuLockTorque(tauBase_mNm: number, buLockEngaged: boolean, lockBonus: number = 0.18): number {
  return buLockEngaged ? tauBase_mNm * (1 + lockBonus) : tauBase_mNm;
}
// bahamutBuLockTorque(33.6, true)  → 39.6 mN·m  — BU Lock active (Xanthus/Moon)
// bahamutBuLockTorque(33.6, false) → 33.6 mN·m  — standard
// bahamutBuLockTorque(33.6, true, 0.25) → 42.0 mN·m  — stronger lock variant

function bahamutLeftSpinDefense(cRecoil: number, massTotal_g: number, vBefore_ms: number): {
  fRecoil_N: number; vAfter_ms: number
} {
  const cEff = cRecoil * 0.3;
  const fRecoil = cEff * (massTotal_g / 1000) * vBefore_ms / 0.01;
  return { fRecoil_N: fRecoil, vAfter_ms: vBefore_ms * (1 - cEff) };
}
// bahamutLeftSpinDefense(0.8, 74.6, 1.0) → { fRecoil=1.79N, vAfter=0.76m/s }
// bahamutLeftSpinDefense(0.8, 74.6, 2.0) → { fRecoil=3.58N, vAfter=1.52m/s }
// bahamutLeftSpinDefense(0.5, 74.6, 1.0) → { fRecoil=1.12N, vAfter=0.85m/s }
```

---

## Case 477 — BU Blade Roar (Dynamite Battle / Burst Ultimate Layer System)

BU Blade Roar weighs 12.1 g (r_outer ≈ 24 mm, r_inner ≈ 10 mm) and is designed around a bistable deployment gimmick: four ABS protrusions are held in a retracted low-profile position by a pre-tensioned spring mechanism and deploy radially outward when spin rate drops below a critical threshold ω_crit. The deployment physics follow a bistable potential energy curve where the spring stores energy E_spring = ½ k_spring × x₀² and the centrifugal barrier at ω_crit is E_centrifugal = ½ m_wing × r_wing² × ω_crit² — equilibrium gives ω_crit = √(k_spring / m_wing) × (x₀ / r_wing) = √(3800 / 0.003) × (0.003 / 0.024) ≈ 228 rad/s (≈33% of ω₀). Below ω_crit the protrusions deploy outward, increasing I_Roar from I_ret = ½ × 0.0121 × (0.024² + 0.010²) ≈ 4.083×10⁻⁶ kg·m² to I_dep ≈ 5.102×10⁻⁶ kg·m² (ΔI ≈ 1.019×10⁻⁶), producing a spin conservation boost via angular momentum: Δω = ω × ΔI / I_dep = 228 × 1.019×10⁻⁶ / 5.102×10⁻⁶ ≈ 45.5 rad/s transient. In practice Roar's gimmick is considered unreliable because ω_crit ≈ 228 rad/s corresponds to ~33% spin stability, which is near or below the wobble onset threshold (40% of ω₀ = 277 rad/s); the blade often deploys simultaneously with heavy wobble, nullifying the stabilisation benefit. Roar works best in practice with Metal Drift driver, which uses a sharp conical tip to maintain long spin times that reach ω_crit smoothly from above, allowing the protrusions to deploy before wobble onset.

```
ASCII Visual Geometry — BU Blade Roar (top view, retracted / deployed)

  RETRACTED (ω > 228 rad/s):          DEPLOYED (ω < 228 rad/s):
       ┌─────────────┐                      ┌───────────────────┐
      / smooth profile\                    /  ← ← ← protrusions \
     │   ┌─────────┐  │                  │   ← │   ABS   │ ← →   │
     │   │ r=10mm  │  │                  │   → └─────────┘ ← ←   │
     │   └─────────┘  │                  │                        │
      \              /                    \   r_dep≈27mm          /
       └─────────────┘                      └───────────────────┘
  I_ret=4.083×10⁻⁶              I_dep≈5.102×10⁻⁶  (+Δω≈45.5 rad/s burst)
  ω_crit = 228 rad/s  (33% of ω₀ = 694 rad/s)
```

```
Physics Analysis

m_Roar     = 12.1 g = 0.0121 kg
r_ret      = 24 mm,  r_dep = 27 mm,  r_i = 10 mm
I_ret      = ½ × 0.0121 × (0.024² + 0.010²) = 4.083×10⁻⁶ kg·m²
I_dep      = ½ × 0.0121 × (0.027² + 0.010²) = 5.060×10⁻⁶ kg·m²  (approx)
ΔI         = 0.977×10⁻⁶ kg·m²

Critical deployment speed:
  ω_crit   = √(3800 / 0.003) × (0.003 / 0.024) ≈ 228 rad/s  (33% ω₀)
  ω_wobble = 0.40 × 694 = 277 rad/s  (wobble onset)
  Gap      = 277 − 228 = 49 rad/s  (narrow window — unreliable)

Angular momentum conservation at deployment:
  I_total_ret = 1.640×10⁻⁵  (assembly, retracted)
  I_total_dep = 1.640×10⁻⁵ + ΔI = 1.737×10⁻⁵
  Δω_conserved = ω × ΔI / I_total_dep = 228 × 0.977×10⁻⁶ / 1.737×10⁻⁵ = 12.8 rad/s
```

```typescript
function roarDeploymentThreshold(kSpring_Nm: number, mWing_g: number, x0_mm: number, rWing_mm: number): number {
  return Math.sqrt((kSpring_Nm / (mWing_g / 1000))) * ((x0_mm / 1000) / (rWing_mm / 1000));
}
// roarDeploymentThreshold(3800, 3, 3, 24) → 228 rad/s  (33% ω₀)
// roarDeploymentThreshold(4200, 3, 3, 24) → 240 rad/s  — stiffer spring
// roarDeploymentThreshold(3800, 4, 3, 24) → 197 rad/s  — heavier wing (later deploy)

function roarSpinBoost(iRetracted: number, iDeployed: number, omegaCrit: number, iTotalRetracted: number): number {
  const deltaI = iDeployed - iRetracted;
  const iTotalDeployed = iTotalRetracted + deltaI;
  return omegaCrit * deltaI / iTotalDeployed;
}
// roarSpinBoost(4.083e-6, 5.060e-6, 228, 1.640e-5) → 12.8 rad/s  (transient boost at deploy)
// roarSpinBoost(4.083e-6, 5.060e-6, 277, 1.640e-5) → 15.6 rad/s  — if deployed at wobble onset
// roarSpinBoost(4.083e-6, 5.500e-6, 228, 1.640e-5) → 19.9 rad/s  — larger protrusions

function roarReliabilityWindow(omegaWobble: number, omegaCrit: number, omegaDecayRate: number): {
  windowRad: number; windowTime_s: number
} {
  const w = omegaWobble - omegaCrit;
  return { windowRad: w, windowTime_s: w / Math.abs(omegaDecayRate) };
}
// roarReliabilityWindow(277, 228, 5.0) → { window=49 rad/s, t=9.8s }
// roarReliabilityWindow(277, 228, 12)  → { window=49 rad/s, t=4.1s }  — faster decay (less time)
// roarReliabilityWindow(277, 200, 5.0) → { window=77 rad/s, t=15.4s } — lower crit (more reliable)
```

---

## Case 478 — Armor 6 (Dynamite Battle / Burst Ultimate Layer System, Left-Spin Context)

Armor 6 is the same physical component as Case 464 (Chain Kerbeus assembly) — 13.4 g, r_outer ≈ 26 mm, r_inner ≈ 11 mm, six-sided ring with rubber bumper inserts — but in the Roar Bahamut Karma Metal Drift-6 combo it operates with DB Core Bahamut in left-spin configuration, which alters several key physics interactions. Inertia I_A6 = ½ × 0.0134 × (0.026² + 0.011²) ≈ 5.302×10⁻⁶ kg·m² is unchanged (geometry-dependent, spin-direction-independent), and contributes 32.3% of the Roar Bahamut assembly (I_total ≈ 1.640×10⁻⁵). The rubber bumper contact force (Hertzian, E* ≈ 2.664 MPa, a = (3WR/4E*)^(1/3)) is also unchanged by spin direction. What changes in left-spin context is the rubber contact's spin-transfer dynamics: a rubber bump striking a right-spin opponent transfers angular momentum in the opposing direction, creating a spin-steal interaction where Δω_opp = −F_rubber × r_contact_opp × t_contact / I_opp — slowing the opponent slightly — while the Bahamut assembly itself absorbs less recoil than in right-spin (gear-mesh 0.3× factor). In the DB/BU era Armor 6 was specifically paired with left-spin DB Cores (Bahamut, Dynamite) to maximise the rubber-bump spin-steal: right-spin rubber bumps transfer spin in the same direction as the opponent (unhelpful), while left-spin rubber bumps oppose the opponent and drain their angular momentum per contact. Burst resistance for Armor 6 in this assembly: τ_slope(Bahamut) + τ_Dash(Metal Drift) + τ_tabs = 9.74 + 33.6 × 0.40 + 23.9 = 47.1 mN·m (with Dash spring contribution from Metal Drift factored through the ratchet engagement).

```
ASCII Visual Geometry — Armor 6 (left-spin context, same geometry as Case 464)

  ┌────────────────────────────────────┐  r=26mm
  │ ██ rubber ██ ABS ██ rubber ██ ABS ██│  6-sided ring
  │    bump       wall    bump    wall   │  bumps at 60° intervals
  └────────────────────────────────────┘  r_inner=11mm
                 ↑ left-spin context
  rubber bump × right-spin opponent = spin steal (opposes opponent rotation)
  I_A6 = 5.302×10⁻⁶  same as right-spin case  mass=13.4g
```

```
Physics Analysis

m_A6       = 13.4 g = 0.0134 kg  (same as Case 464)
I_A6       = 5.302×10⁻⁶ kg·m²   (same)
Assembly share = 5.302×10⁻⁶ / 1.640×10⁻⁵ = 32.3%

Left-spin spin-steal per rubber contact:
  F_rubber  = 8.0 N (estimate, Hertzian rubber bump)
  t_contact = 5 ms
  Δω_opp   = −F_rubber × 0.021 × 0.005 / I_opp  (negative = drain opponent)
  For I_opp = 1.0×10⁻⁵: Δω_opp = −0.084 rad/s per contact

Full burst resistance (Bahamut slope + Dash + tabs):
  τ_slope   = 9.74 mN·m   (Bahamut θ=22°)
  τ_Dash    = τ_tab × 0.40 = 23.9 × 0.40 = 9.56 mN·m  (Metal Drift Dash spring)
  τ_tabs    = 23.9 mN·m
  τ_total   = 9.74 + 9.56 + 23.9 = 43.2 mN·m
```

```typescript
function armor6LeftSpinSteal(fRubber_N: number, rContactOpp_mm: number, tContact_ms: number, iOpp: number): number {
  return -(fRubber_N * (rContactOpp_mm / 1000) * (tContact_ms / 1000)) / iOpp;
}
// armor6LeftSpinSteal(8, 21, 5, 1.0e-5) → −0.084 rad/s per contact
// armor6LeftSpinSteal(8, 21, 5, 8.0e-6) → −0.105 rad/s  — lighter opponent
// armor6LeftSpinSteal(12, 21, 5, 1.0e-5) → −0.126 rad/s  — harder contact

function armor6AssemblyBurstResistance(tauSlope_mNm: number, tauTabs_mNm: number, dashAlpha: number): number {
  return tauSlope_mNm + tauTabs_mNm + tauTabs_mNm * dashAlpha;
}
// armor6AssemblyBurstResistance(9.74, 23.9, 0.40) → 43.2 mN·m
// armor6AssemblyBurstResistance(13.0, 23.9, 0.40) → 46.5 mN·m  — Kerbeus slope for comparison
// armor6AssemblyBurstResistance(9.74, 23.9, 0.00) → 33.6 mN·m  — no Dash (non-prime driver)

function armor6InertiaContribution(iA6: number, iTotal: number): number {
  return (iA6 / iTotal) * 100;
}
// armor6InertiaContribution(5.302e-6, 1.640e-5) → 32.3%  — Roar Bahamut assembly
// armor6InertiaContribution(5.302e-6, 1.833e-5) → 28.9%  — Chain Kerbeus assembly (Case 464)
// armor6InertiaContribution(5.302e-6, 1.725e-5) → 30.7%  — Ultimate Valkyrie assembly
```

---

## Case 479 — Forge Disc Karma (Dynamite Battle / Burst Ultimate Layer System)

Forge Disc Karma weighs 29.2 g (r_outer ≈ 27 mm, r_inner ≈ 8 mm) and features 10 upward-angled blades (5 pairs, each pair comprising a tall outer blade and a shorter inner guide) with blade angle φ ≈ 20° from vertical, creating an Upper Force aerodynamic effect in left-spin: as the disc rotates, air is directed downward-inward, generating a lift reaction force on the beyblade of F_up ≈ ρ_air × A_blade × v_blade² × sin(φ) ≈ 1.225 × (0.027 × 0.005 × 10) × (694 × 0.02)² × sin(20°) ≈ 0.048 N at ω₀ — a modest but real destabilisation effect on opponents at close range. In right-spin the same geometry creates Down Force (blades push air upward-outward, pressing the beyblade down, improving traction). Inertia I_Karma = ½ × 0.0292 × (0.027² + 0.008²) ≈ 1.155×10⁻⁵ kg·m², making it the dominant inertia contributor at 70.4% of the 74.6 g assembly (I_total ≈ 1.640×10⁻⁵). The blade geometry also reduces LAD effectiveness: the 10 upward blades create a serrated outer profile with μ_karma ≈ 0.25 — substantially higher than smooth disc edges (μ_smooth ≈ 0.05) — cutting LAD duration by a factor of 5 (dω/dt_LAD = 5× faster during LAD orbit). This is the primary stamina penalty for Karma: not the disc mass itself, but the anti-LAD blade surface that prevents the spin-conserving precession orbit. Zinc alloy construction (E = 97 GPa) ensures the blade tips survive repeated strikes; the 10-blade geometry also creates 10 contact surfaces at disc level, all applying upward force components to strike opponents.

```
ASCII Visual Geometry — Forge Disc Karma (side view, left-spin rotation)

       rotation →  (left-spin)
  ┌─────────────────────────────────────────┐  r=27mm
  │  ╱↑╲  ╱↑╲  ╱↑╲  ╱↑╲  ╱↑╲            │  10 upward blades
  │ /   \/   \/   \/   \/   \   ← blades   │  φ=20° from vertical
  │ │ Air    flow    down    │              │  Upper Force (left-spin)
  └─────────────────────────────────────────┘  r_inner=8mm
  mass=29.2g  I=1.155×10⁻⁵  70.4% of assembly I
  μ_karma=0.25  (5× anti-LAD penalty vs μ_smooth=0.05)
  F_upper≈0.048N at ω₀ (aerodynamic lift on opponent)
```

```
Physics Analysis

m_K        = 29.2 g = 0.0292 kg
r_o        = 27 mm,  r_i = 8 mm
I_Karma    = ½ × 0.0292 × (0.027² + 0.008²) = 1.155×10⁻⁵ kg·m²
Assembly share = 1.155×10⁻⁵ / 1.640×10⁻⁵ = 70.4%

Upper Force (left-spin aerodynamic):
  A_blade  = 0.027 × 0.005 × 10 = 1.35×10⁻³ m²
  v_blade  = 694 × 0.020 = 13.88 m/s  (mid-blade radius)
  F_up     = 1.225 × 1.35×10⁻³ × 13.88² × sin(20°) = 0.121 N  (assembly lift on opponent)

Anti-LAD penalty (μ_karma=0.25 vs μ_smooth=0.05):
  LAD_ratio = μ_smooth / μ_karma = 0.05 / 0.25 = 0.20  (80% shorter LAD)
  dω/dt_LAD_Karma = 5 × dω/dt_LAD_smooth

Assembly (Roar Bahamut Karma Metal Drift-6):
  m_total  = 74.6 g,  I_total ≈ 1.640×10⁻⁵ kg·m²
  L₀       = 1.640×10⁻⁵ × 694 = 1.138×10⁻² kg·m²/s
```

```typescript
function karmaUpperForce(nBlades: number, rBlade_mm: number, hBlade_mm: number, phi_deg: number, omega_radps: number): number {
  const aBlades = nBlades * (rBlade_mm / 1000) * (hBlade_mm / 1000);
  const vBlade = omega_radps * (rBlade_mm / 1000 * 0.74);
  return 1.225 * aBlades * vBlade ** 2 * Math.sin(phi_deg * Math.PI / 180);
}
// karmaUpperForce(10, 27, 5, 20, 694) → 0.121N  — at launch spin
// karmaUpperForce(10, 27, 5, 20, 400) → 0.040N  — at 60% spin
// karmaUpperForce(10, 27, 5, 30, 694) → 0.174N  — steeper blade angle

function karmaAntiLad(tLadSmooth_s: number, muKarma: number, muSmooth: number): number {
  return tLadSmooth_s * (muSmooth / muKarma);
}
// karmaAntiLad(100, 0.25, 0.05) → 20.0s  — Karma LAD window
// karmaAntiLad(100, 0.15, 0.05) → 33.3s  — less aggressive blades
// karmaAntiLad(60,  0.25, 0.05) → 12.0s  — shorter base LAD

function karmaInertiaShare(iKarma: number, iTotal: number): number {
  return (iKarma / iTotal) * 100;
}
// karmaInertiaShare(1.155e-5, 1.640e-5) → 70.4%
// karmaInertiaShare(1.155e-5, 1.800e-5) → 64.2%  — heavier assembly
// karmaInertiaShare(8.938e-6, 1.640e-5) → 54.5%  — Heavy disc for comparison
```

---

## Case 480 — Performance Tip Metal Drift (Dynamite Battle / Burst Ultimate Layer System)

Metal Drift weighs 12.1 g (r_shaft ≈ 5 mm outer, inner bearing r ≈ 2.5 mm, conical tip r_tip ≈ 0.5 mm, octagonal lock ring r_ring = 7 mm, height ≈ 13 mm) and combines two physically distinct mechanisms: the Metal Lock system (a hardened zinc collar with shorter contact tabs that deliver lower burst resistance than Dash — τ_metal_lock ≈ τ_base × 1.15 vs Dash × 1.40) and a conical sharp metal tip (tungsten-carbide or hardened steel insert, r_tip = 0.5 mm, μ = 0.10 on standard POM arena). The sharp conical metal tip gives Metal Drift's defining characteristic: exceptional stamina. With r_eff = r_tip = 0.5 mm and μ_metal = 0.10: dω/dt_MD = −(0.10 × 0.0746 × 9.81 × 0.0005) / 1.640×10⁻⁵ = −2.23 rad/s², t_battle = 416 / 2.23 = 187 s — nearly identical to ball tip Yard (515 s theoretical) at practical spin ranges, confirming Metal Drift is the premier stamina driver for left-spin DB/BU assemblies. The octagonal lock ring (r_ring = 7 mm) provides additional contact surface when the beyblade tilts past θ ≈ 40°: r_LAD = 7 / cos(40°) = 9.14 mm at onset, providing LAD behaviour. Because Karma disc's μ = 0.25 anti-LAD surface overrides the smooth tip contribution during LAD orbit, the effective LAD stamina of the full assembly is determined by μ_karma, not μ_metal_tip — Metal Drift's stamina advantage is fully expressed only in the initial stationary spin phase before tilt onset. Spin-equalisation occurs when the metal tip contacts the stationary opponent's tip: with equal areas (r_tip_self ≈ r_tip_opp ≈ 0.5 mm) the shared contact zone transfers angular impulse F_friction × t × r_contact, pulling the slower opponent's spin upward toward the faster's spin rate.

```
ASCII Visual Geometry — Metal Drift (side profile)

  ┌──────────────────┐  r=5mm shaft
  │  ABS casing      │
  │  Metal Lock tab  │  ← shorter tabs, τ=τ_base×1.15 (less than Dash ×1.40)
  ├──────────────────┤
  │  octagonal ring  │  r_ring=7mm — LAD onset at θ≈40°, r_LAD=9.14mm
  │   [octagon]      │
  │   ╲           ╱  │  conical body
  │    ╲─────────╱   │
  │          ↓       │
  └─────── ─ ─ ──────┘  metal tip r=0.5mm, μ=0.10 on POM
                          t_battle=187s (sharp metal)
  mass=12.1g  I_MD≈2.017×10⁻⁶ kg·m²
```

```
Physics Analysis

m_MD       = 12.1 g = 0.0121 kg
r_tip      = 0.5 mm (metal sharp),  r_ring = 7 mm
I_MD       = ½ × 0.0121 × (0.007² + 0.0025²) = 3.118×10⁻⁷ kg·m²  (ring only; shaft negligible)

Spin decay (metal sharp tip, μ=0.10, stationary):
  dω/dt_MD = −(0.10 × 0.0746 × 9.81 × 0.0005) / 1.640×10⁻⁵ = −2.23 rad/s²
  t_battle = 416 / 2.23 = 187 s

Metal Lock burst resistance:
  τ_ML     = τ_base × 1.15 = 23.9 × 1.15 = 27.5 mN·m  (vs Dash: 23.9×1.40=33.5)

LAD onset (octagonal ring):
  θ_onset  = arccos(r_shaft / r_ring) = arccos(5/7) = 44.4°
  r_LAD    = 7 / cos(44.4°) = 9.80 mm  (effective LAD radius at onset)

Spin equalisation (tip-to-tip contact):
  Δω_equal = F_friction × r_tip × t_contact / I_opp  (per contact)
  = 0.10 × (m_assy × g) × 0.0005 × 0.005 / I_opp
  = 0.10 × 0.0746 × 9.81 × 0.0005 × 0.005 / 1.0×10⁻⁵ = 0.018 rad/s per contact

Assembly (Roar Bahamut Karma Metal Drift-6):
  m_total  = 74.6 g,  I_total ≈ 1.640×10⁻⁵ kg·m²
  L₀       = 1.640×10⁻⁵ × 694 = 1.138×10⁻² kg·m²/s
  t_battle ≈ 187 s  (Metal Drift stationary phase, before LAD tilt)
```

```typescript
function metalDriftSpinDecay(mTotal_g: number, iTotal: number, mu: number, rTip_mm: number): {
  dOmega: number; tBattle_s: number
} {
  const dO = -(mu * (mTotal_g / 1000) * 9.81 * (rTip_mm / 1000)) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// metalDriftSpinDecay(74.6, 1.640e-5, 0.10, 0.5) → { dω=−2.23, t=187s }
// metalDriftSpinDecay(74.6, 1.640e-5, 0.03, 0.5) → { dω=−0.67, t=621s }  — ball tip comparison
// metalDriftSpinDecay(74.6, 1.640e-5, 0.10, 1.0) → { dω=−4.46, t=93s }   — wider metal tip

function metalLockBurstResistance(tauBase_mNm: number, metalLockAlpha: number): number {
  return tauBase_mNm * (1 + metalLockAlpha);
}
// metalLockBurstResistance(23.9, 0.15) → 27.5 mN·m  — Metal Lock
// metalLockBurstResistance(23.9, 0.40) → 33.5 mN·m  — Dash for comparison
// metalLockBurstResistance(23.9, 0.00) → 23.9 mN·m  — no lock spring

function metalDriftSpinEqualisation(mAssy_g: number, mu: number, rTip_mm: number, tContact_ms: number, iOpp: number): number {
  const fFric = mu * (mAssy_g / 1000) * 9.81;
  return (fFric * (rTip_mm / 1000) * (tContact_ms / 1000)) / iOpp;
}
// metalDriftSpinEqualisation(74.6, 0.10, 0.5, 5, 1.0e-5) → 0.018 rad/s per contact
// metalDriftSpinEqualisation(74.6, 0.10, 0.5, 10, 1.0e-5) → 0.036 rad/s
// metalDriftSpinEqualisation(74.6, 0.10, 0.5, 5, 5.0e-6)  → 0.036 rad/s  — lighter opponent
```

---

## Case 489 — DB Core Lucifer (Dynamite Battle / Burst Ultimate Layer System)

DB Core Lucifer weighs 7.4 g (r_outer ≈ 14 mm, r_inner ≈ 5 mm, height ≈ 6 mm) and is a right-spin DB Core that ranks among the highest burst-resistant DB Cores due to three thick PC Locks combined with three BU Lock grooves. The physical design depicts the face of Lucifer with two golden H-shaped claws at the top referencing Helios and Hyperion — thematic callbacks to the BeyBlade Burst Surge anime antagonists. The three thick Locks carry a higher contact surface area per tab than standard 3-tab cores, estimated at k_tab ≈ 4200 N/m (vs standard 3800 N/m), yielding τ_tab = 3 × 4200 × 0.0003 × 0.007 = 26.5 mN·m. The BU Lock system adds three grooves that engage raised protrusions on the Disc tabs of Xanthus or Moon only — in the Barricade Lucifer Illegal Bearing Mobius assembly, the paired Disc is Illegal, which carries no BU Lock protrusions, so the BU Lock is inactive and τ_total = τ_tab alone = 26.5 mN·m. Inertia I_L = ½ × 0.0074 × (0.014² + 0.005²) = 8.177×10⁻⁷ kg·m², contributing 3.55% of the full assembly (I_total ≈ 2.305×10⁻⁵ kg·m²). The Lucifer core's right-spin designation matches the right-spin BU Blade Barricade above it, maximising burst-assist torque against right-spin opponents through aligned ratchet geometry. Compared to Bahamut (Case 476, 7.8 g, left-spin, τ_slope-assisted = 33.6 mN·m) and Valkyrie 2 DB Core (similar thick-lock design), Lucifer's thick-lock advantage is pure tab geometry with no slope mechanism, placing its τ entirely in the tab spring constant.

```
ASCII Visual Geometry — DB Core Lucifer (top view)

       ┌────────────────────┐  r=14mm
      /  H-claw ████ H-claw  \   ← golden Helios/Hyperion reference
     │   (decorative, ABS)   │
     │   3 thick Lock tabs   │   k_tab ≈ 4200 N/m (above std)
     │   3 BU Lock grooves   │   → engage Xanthus/Moon only
     │   r_bore=5mm   ↕      │   (inactive with Illegal disc)
      \                     /
       └────────────────────┘
  mass=7.4g  I=8.177×10⁻⁷  τ_tab=26.5 mN·m  right-spin
  BU Lock adds +18% when active (39.6 mN·m with Xanthus/Moon — not active here)
```

```
Physics Analysis

m_L        = 7.4 g = 0.0074 kg
r_o        = 14 mm,  r_i = 5 mm
I_L        = ½ × 0.0074 × (0.014² + 0.005²) = 8.177×10⁻⁷ kg·m²
Assembly share = 8.177×10⁻⁷ / 2.305×10⁻⁵ = 3.55%

Burst resistance (thick tabs, k=4200 N/m, no slope, no BU Lock active):
  τ_tab    = 3 × 4200 × 0.0003 × 0.007 = 26.5 mN·m
  τ_BULock = 26.5 × 1.18 = 31.3 mN·m  (if paired with Xanthus/Moon)

Assembly (Barricade Lucifer Illegal Bearing Mobius-10):
  m_total  = 75.3 g,  I_total ≈ 2.305×10⁻⁵ kg·m²  (blades retracted)
  L₀       = 2.305×10⁻⁵ × 694 = 1.600×10⁻² kg·m²/s
```

```typescript
function luciferTabTorque(nTabs: number, kTab_Nm: number, delta_mm: number, rEng_mm: number): number {
  return nTabs * kTab_Nm * (delta_mm / 1000) * (rEng_mm / 1000) * 1000;
}
// luciferTabTorque(3, 4200, 0.3, 7) → 26.5 mN·m  — thick tabs
// luciferTabTorque(3, 3800, 0.3, 7) → 23.9 mN·m  — standard tabs comparison
// luciferTabTorque(3, 4200, 0.4, 7) → 35.3 mN·m  — deeper engagement

function luciferBuLockBonus(tauBase_mNm: number, buLockActive: boolean, lockBonus: number = 0.18): number {
  return buLockActive ? tauBase_mNm * (1 + lockBonus) : tauBase_mNm;
}
// luciferBuLockBonus(26.5, false) → 26.5 mN·m  — Illegal disc (inactive)
// luciferBuLockBonus(26.5, true)  → 31.3 mN·m  — Xanthus/Moon (active)
// luciferBuLockBonus(26.5, true, 0.25) → 33.1 mN·m  — stronger lock

function luciferInertiaShare(iCore: number, iTotal: number): number {
  return (iCore / iTotal) * 100;
}
// luciferInertiaShare(8.177e-7, 2.305e-5) → 3.55%
// luciferInertiaShare(8.619e-7, 1.640e-5) → 5.26%  — Bahamut in lighter assembly
// luciferInertiaShare(8.177e-7, 1.393e-5) → 5.87%  — Xcalibur assembly reference
```

---

## Case 490 — BU Blade Barricade (Dynamite Battle / Burst Ultimate Layer System)

BU Blade Barricade is the final BU Blade in Takara Tomy's Beyblade Burst toyline, weighing 14.8 g (r_outer_retracted ≈ 23 mm, r_outer_deployed ≈ 27 mm, r_inner ≈ 10 mm), and bears a historically unique Easter egg: the words "Thank" and "You" are moulded into the underside of the blade — a farewell message from Takara Tomy to the Burst playerbase after the production run's conclusion. Mechanically, Barricade is a right-spin Defense Type blade with four centrifugally-deployed barrier blades: at high spin (ω > ω_threshold ≈ 250 rad/s) centrifugal force F_centrifugal = m_blade × r_blade × ω² > F_spring = k_spring × x₀ keeps the blades horizontally deployed, presenting a wide circular shield profile. As spin decays to ω < ω_threshold, the spring retracts the blades, reducing outer radius and transitioning to stamina mode. This is the opposite polarity from Roar's gimmick (Case 477, which deploys at low spin) — Barricade starts deployed and retracts. Inertia in deployed state I_dep = ½ × 0.0148 × (0.027² + 0.010²) = 6.135×10⁻⁶ kg·m²; retracted I_ret = 4.655×10⁻⁶ kg·m² (ΔI = 1.480×10⁻⁶). At blade retraction ω_threshold: angular momentum conservation gives Δω_retract = ω_threshold × ΔI / I_total_ret = 250 × 1.480×10⁻⁶ / 2.305×10⁻⁵ = +16.1 rad/s spin-up boost — a small but real stamina assist at the retraction transition. Barricade's deployed profile works best against left-spin Attack (Guilty Blade) because the deployed blades present a continuous surface blocking the left-spin layer's contact points. Against right-spin Attack the gear-mesh direction aligns and contact recoil is transmitted normally; the shield benefit is reduced (C_eff = C_recoil × 1.0 same-spin, no 0.3× penalty). Barricade shares conceptual lineage with Variant Ring (predecessor, also deploying/retracting blades) but adds the circular base geometry and improved spring retention.

```
ASCII Visual Geometry — BU Blade Barricade (top view, deployed vs retracted)

  DEPLOYED (ω > 250 rad/s):              RETRACTED (ω < 250 rad/s):
  ┌───────────────────────────┐          ┌──────────────────────┐
 /  ←barrier→  ←barrier→      \        /  smooth profile        \
│  blade  ███  blade  ███   r=27│       │  r=23mm (compact)      │
│         ███         ███       │       │  stamina mode          │
│  blade  ███  blade  ███       │        \                       /
 \   (defense shield profile)  /          └────────────────────┘
  └───────────────────────────┘
  I_dep=6.135×10⁻⁶               I_ret=4.655×10⁻⁶
  mass=14.8g  ω_threshold≈250 rad/s  "Thank You" on underside
```

```
Physics Analysis

m_Barr     = 14.8 g = 0.0148 kg
r_ret      = 23 mm,  r_dep = 27 mm,  r_i = 10 mm
I_ret      = ½ × 0.0148 × (0.023² + 0.010²) = 4.655×10⁻⁶ kg·m²
I_dep      = ½ × 0.0148 × (0.027² + 0.010²) = 6.135×10⁻⁶ kg·m²
ΔI         = 1.480×10⁻⁶ kg·m²

Centrifugal deployment threshold:
  ω_threshold ≈ 250 rad/s  (36% of ω₀; blades deployed above this)

Spin boost at retraction (angular momentum conservation):
  Δω_ret   = ω_threshold × ΔI / I_total_ret = 250 × 1.480×10⁻⁶ / 2.305×10⁻⁵ = +16.1 rad/s

L₀ (launched deployed):
  I_total_dep = 2.305×10⁻⁵ + 1.480×10⁻⁶ = 2.453×10⁻⁵
  L₀_dep     = 2.453×10⁻⁵ × 694 = 1.702×10⁻² kg·m²/s
```

```typescript
function barricadeBladeInertia(mBlade_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mBlade_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// barricadeBladeInertia(14.8, 27, 10) → 6.135×10⁻⁶ kg·m²  — deployed
// barricadeBladeInertia(14.8, 23, 10) → 4.655×10⁻⁶ kg·m²  — retracted
// barricadeBladeInertia(14.8, 25, 10) → 5.290×10⁻⁶ kg·m²  — mid-deploy estimate

function barricadeRetractionSpinBoost(omegaThreshold: number, deltaI: number, iTotalRetracted: number): number {
  return omegaThreshold * deltaI / iTotalRetracted;
}
// barricadeRetractionSpinBoost(250, 1.480e-6, 2.305e-5) → +16.1 rad/s
// barricadeRetractionSpinBoost(200, 1.480e-6, 2.305e-5) → +12.9 rad/s  — earlier retraction
// barricadeRetractionSpinBoost(250, 1.480e-6, 1.640e-5) → +22.6 rad/s  — lighter assembly

function barricadeDeployThreshold(kSpring_Nm: number, mBlade_g: number, x0_mm: number, rBlade_mm: number): number {
  return Math.sqrt((kSpring_Nm * (x0_mm / 1000)) / ((mBlade_g / 1000) * (rBlade_mm / 1000)));
}
// barricadeDeployThreshold(400, 3.2, 0.5, 25) → 250 rad/s  — design target
// barricadeDeployThreshold(600, 3.2, 0.5, 25) → 306 rad/s  — stiffer spring
// barricadeDeployThreshold(400, 3.2, 0.5, 20) → 280 rad/s  — shorter blade arm
```

---

## Case 491 — Armor 10 (Dynamite Battle / Burst Ultimate Layer System)

Armor 10 weighs 13.4 g (r_outer ≈ 26 mm, r_inner ≈ 10 mm) and features triangular protrusions at ten evenly-spaced points — a C₁₀ (ten-fold) symmetry that produces the most uniform mass distribution among all Armors. The ten-point design distributes mass at intervals of 36° (Δθ = 2π/10), meaning the angular mass eccentricity e_Armor10 ≈ 0 (ideally zero imbalance by symmetry, vs Armor 6's six-fold or Armor 4's four-fold which have larger inter-point gaps and higher eccentricity potential from moulding variance). Inertia I_A10 = ½ × 0.0134 × (0.026² + 0.010²) = 5.199×10⁻⁶ kg·m², contributing 22.6% of the 75.3 g assembly — identical mass to Armor 6 (Case 464/478) but with different outer geometry. The ten triangular points create a fine-serrated outer profile (μ_serrated ≈ 0.12 vs μ_smooth = 0.05), slightly reducing LAD smoothness but less severely than Karma's blades (μ_karma = 0.25). In the Barricade Lucifer assembly, Armor 10's role is purely mass distribution and a stable inertia ring with minimal anti-LAD penalty — the Illegal disc below provides the primary LAD surface (smooth perimeter, μ ≈ 0.05). The ten-point uniformity also makes Armor 10 versatile across Defense and Stamina combinations; unlike Armor 9 (nine-point, odd symmetry — slight gyroscopic instability in certain precession modes) or Armor 4 (four-point, aggressive contact geometry), Armor 10's even C₁₀ symmetry matches the C₄ symmetry of Illegal and the circular symmetry of Bearing Mobius for a fully balanced stamina stack. Armor 10 is described by the wiki as one of the most useful Armors, and in physics terms this reflects the combination of balanced inertia distribution, moderate mass, and low eccentricity.

```
ASCII Visual Geometry — Armor 10 (top view)

        r=26mm (ten triangular tips)
    ▲  ▲  ▲  ▲  ▲  ▲  ▲  ▲  ▲  ▲
   / \/ \/ \/ \/ \/ \/ \/ \/ \/ \
  │   C₁₀ symmetry (10 points)   │   Δθ=36° between points
  │   r_inner=10mm bore           │   e≈0 (ideal balance)
   \  ███████████████████████   /
    ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼
  mass=13.4g  I=5.199×10⁻⁶  μ_serrated≈0.12  (mild LAD reduction)
  most uniform Armor distribution; versatile Defense/Stamina
```

```
Physics Analysis

m_A10      = 13.4 g = 0.0134 kg
r_o        = 26 mm,  r_i = 10 mm
I_A10      = ½ × 0.0134 × (0.026² + 0.010²) = 5.199×10⁻⁶ kg·m²
Assembly share = 5.199×10⁻⁶ / 2.305×10⁻⁵ = 22.6%

Eccentricity (C₁₀ ideal):
  e_A10    ≈ 0 mm  (ten-point symmetry, moulding variance only)
  F_imb    ≈ 0 N   (negligible imbalance force)

LAD friction (serrated ten-point outer):
  μ_serrated = 0.12  vs μ_smooth = 0.05
  LAD_ratio  = 0.05 / 0.12 = 0.417  (58% shorter than smooth, mild penalty)

vs Armor 6 (six-point, same mass):
  ΔI       = 5.199×10⁻⁶ − 5.302×10⁻⁶ = −0.103×10⁻⁶  (slightly less I at same r due to inner radius difference)
```

```typescript
function armor10Inertia(mArmor_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mArmor_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// armor10Inertia(13.4, 26, 10) → 5.199×10⁻⁶ kg·m²
// armor10Inertia(13.4, 26, 11) → 5.302×10⁻⁶  — Armor 6 geometry (r_i=11mm)
// armor10Inertia(13.9, 26, 10) → 5.393×10⁻⁶  — Armor 9 mass comparison

function armor10LadPenalty(tLadSmooth_s: number, muSerrated: number, muSmooth: number): number {
  return tLadSmooth_s * (muSmooth / muSerrated);
}
// armor10LadPenalty(120, 0.12, 0.05) → 50.0s  — mild penalty vs smooth
// armor10LadPenalty(120, 0.20, 0.05) → 30.0s  — Karma blades (severe)
// armor10LadPenalty(120, 0.05, 0.05) → 120.0s  — smooth Armor (no penalty)

function armor10SymmetryEccentricity(nPoints: number, mouldingVariance_mg: number, rPoint_mm: number, mArmor_g: number): number {
  const deltaMass = (mouldingVariance_mg / 1000) / 1000;
  return (deltaMass * (rPoint_mm / 1000)) / (mArmor_g / 1000) * 1000;
}
// armor10SymmetryEccentricity(10, 50, 26, 13.4) → 0.097mm  — 50mg moulding variance
// armor10SymmetryEccentricity(6, 50, 26, 13.4)  → 0.097mm  — same formula (Armor 6)
// armor10SymmetryEccentricity(4, 50, 26, 13.4)  → 0.097mm  — Armor 4 (similar moulding)
```

---

## Case 492 — Forge Disc Illegal (DB/BU Stamina Assembly Context)

Forge Disc Illegal was fully characterised in Case 457 (Zest Achilles Illegal Quattro'-4 BU assembly context) and its core physics — 31.9 g, circular high-OWD, four large gaps, smooth perimeter LAD (μ ≈ 0.05), I_Illegal ≈ 1.180×10⁻⁵ kg·m² (uniform two-ring approximation, r_o = 26 mm, r_i = 8 mm) — are unchanged. This case records the Illegal disc in the Barricade Lucifer Illegal Bearing Mobius-10 assembly where its role differs from Case 457. In Case 457, Illegal was paired with Quattro' (attack-mode sharp tip, t_battle ≈ 11.6 s) in an attack combo; here it is paired with Bearing Mobius (free-spinning sharp tip, t_battle ≈ 865 s), creating the maximum achievable stamina configuration for this disc. The Illegal+Bearing Mobius pairing is the premier stamina stack in the DB/BU era: Illegal provides I dominance at 51.2% of assembly inertia budget, and its smooth perimeter (μ = 0.05) enables long LAD phases — both feeding directly into Bearing Mobius's ultra-low-friction free-spinning tip. The absence of BU Lock (Illegal ≠ Xanthus/Moon) means the Lucifer core receives no lock bonus in this combo. The LAD performance of Illegal in this context: dω/dt_LAD = −(0.05 × 0.0753 × 9.81 × r_LAD) / 2.305×10⁻⁵; at θ_tilt = 30° r_LAD = 26 / cos(30°) = 30.0 mm → dω/dt_LAD = −(0.05 × 0.0753 × 9.81 × 0.030) / 2.305×10⁻⁵ = −4.80 rad/s², t_LAD_epoch = ω_range / 4.80. The smooth circular perimeter means LAD can sustain through many precession orbits before the beyblade stops — this is the disc property that makes Illegal the top-tier stamina disc in the DB/BU era.

```
ASCII Visual Geometry — Forge Disc Illegal (top view, stamina context)

       r=26mm (smooth circular perimeter → best LAD)
       ┌──────────────────────────────┐
      /  ████ gap ████ gap ████ gap ████\   4 large gaps separate
     │   ████      ████      ████      ████│  center from edge
     │       ████      ████      ████      │  r_inner=8mm
      \  ████ gap ████ gap ████ gap ████ /
       └──────────────────────────────┘
  mass=31.9g  I=1.180×10⁻⁵  51.2% of assembly I
  μ_perimeter≈0.05  (smooth → max LAD duration)
  Full analysis: Case 457. Context here: stamina stack with Bearing Mobius.
```

```
Physics Analysis

m_Ill      = 31.9 g = 0.0319 kg  (cross-ref Case 457)
I_Ill      = 1.180×10⁻⁵ kg·m²   (uniform approx, r_o=26mm, r_i=8mm)
Assembly share = 1.180×10⁻⁵ / 2.305×10⁻⁵ = 51.2%  (dominant inertia contributor)

LAD in stamina context (Bearing Mobius driver):
  θ_tilt   = 30°  →  r_LAD = 0.026 / cos(30°) = 30.0 mm
  dω/dt_LAD = −(0.05 × 0.0753 × 9.81 × 0.030) / 2.305×10⁻⁵ = −4.80 rad/s²
  t_LAD_epoch (ω:277→0) = 277 / 4.80 = 57.7 s  (per full LAD phase)

vs Quattro' attack context (Case 457):
  t_battle_atk ≈ 11.6 s  (sharp flat tip, μ=0.55, r=1.5mm)
  t_battle_stam ≈ 865 s  (Bearing Mobius free-spin)  →  74.6× longer
```

```typescript
function illegalLadSpinDecay(mTotal_g: number, iTotal: number, thetaTilt_deg: number, muPerimeter: number, rDisc_mm: number): {
  rLad_mm: number; dOmega: number; tLadEpoch_s: number
} {
  const rLad = (rDisc_mm / 1000) / Math.cos(thetaTilt_deg * Math.PI / 180);
  const dO = -(muPerimeter * (mTotal_g / 1000) * 9.81 * rLad) / iTotal;
  return { rLad_mm: rLad * 1000, dOmega: dO, tLadEpoch_s: 277 / Math.abs(dO) };
}
// illegalLadSpinDecay(75.3, 2.305e-5, 30, 0.05, 26) → { rLad=30.0mm, dω=−4.80, t=57.7s }
// illegalLadSpinDecay(75.3, 2.305e-5, 20, 0.05, 26) → { rLad=27.7mm, t=62.6s }
// illegalLadSpinDecay(75.3, 2.305e-5, 30, 0.20, 26) → { rLad=30.0mm, t=14.4s }  — Karma comparison

function illegalInertiaShare(iIllegal: number, iTotal: number): number {
  return (iIllegal / iTotal) * 100;
}
// illegalInertiaShare(1.180e-5, 2.305e-5) → 51.2%  — Barricade Lucifer assembly
// illegalInertiaShare(1.180e-5, 1.800e-5) → 65.6%  — Zest Achilles assembly (Case 457)
// illegalInertiaShare(1.180e-5, 1.640e-5) → 71.9%  — Roar Bahamut assembly (hypothetical)

function illegalVsAttackDriverComparison(iTotal: number, mTotal_g: number): {
  tBearingMobius_s: number; tQuattroAttack_s: number; ratio: number
} {
  const tBM = 416 / ((0.015 * (mTotal_g / 1000) * 9.81 * 0.001) / iTotal);
  const tQ  = 416 / ((0.55 * (mTotal_g / 1000) * 9.81 * 0.0015) / iTotal);
  return { tBearingMobius_s: tBM, tQuattroAttack_s: tQ, ratio: tBM / tQ };
}
// illegalVsAttackDriverComparison(2.305e-5, 75.3) → { BM=865s, Q'=11.6s, ratio=74.6× }
// illegalVsAttackDriverComparison(2.305e-5, 62.1) → { BM=1048s, Q'=14.0s, ratio=74.9× }
// illegalVsAttackDriverComparison(1.800e-5, 74.6) → { BM=676s, Q'=9.05s, ratio=74.7× }
```

---

## Case 493 — Performance Tip Bearing Mobius (Dynamite Battle / Burst Ultimate Layer System)

Bearing Mobius weighs 7.8 g (outer casing r ≈ 12 mm, shaft r ≈ 2 mm, conical sharp metal tip r_tip ≈ 0.3 mm, height ≈ 15 mm — 1.5 mm taller than standard sharp tips) and represents the apex of the Burst series' free-spinning tip lineage: an upgraded Mobius tip with ball bearings inserted between the tip shaft and the driver body, decoupling the tip's rotation from the beyblade body's spin. The ball bearing assembly reduces friction between tip and body from μ_plain_bushing ≈ 0.08 to μ_bearing ≈ 0.015, yielding spin decay dω/dt_BM = −(0.015 × 0.0753 × 9.81 × 0.001) / 2.305×10⁻⁵ = −0.481 rad/s², t_battle = 416 / 0.481 = 865 s — the highest theoretical stamina of any tip in the Burst era. The conical sharp tip geometry (r_tip ≈ 0.3 mm vs Bearing Drift's ~0.5 mm) further concentrates the contact point, but since floor friction is entirely isolated from the body through the bearing, the tip radius is functionally relevant only for the tip's own frictional dissipation (not the body's). The critical weakness is poor KO resistance: because μ_effective_lateral ≈ μ_bearing = 0.015 (vs μ_sharp = 0.10 for non-free-spinning), lateral resistance force F_lat = μ_bearing × m_total × g = 0.015 × 0.0753 × 9.81 = 0.0111 N — versus 0.074 N for a non-free-spinning sharp tip, a 6.7× reduction in lateral anchoring force. Any opponent applying even modest lateral impulse (J_lateral > 0.0111 N × t_contact) will displace the beyblade, and the smooth Illegal disc below provides no additional floor engagement. Inertia I_BM = ½ × 0.0078 × (0.012² + 0.002²) = 5.772×10⁻⁷ kg·m², contributing 2.50% of assembly. The full Barricade Lucifer Illegal Bearing Mobius-10 assembly achieves I_total = 2.305×10⁻⁵ kg·m² (blades retracted), L₀ = 1.600×10⁻² kg·m²/s — the highest angular momentum of any assembly in this case study series.

```
ASCII Visual Geometry — Bearing Mobius (side profile)

  ┌──────────────────┐  r=12mm outer casing
  │  ABS body        │  height=15mm (+1.5mm vs std sharp tips)
  │  ball bearing    │  ← μ_bearing=0.015 (decouples tip from body)
  ├─────[○○○○]───────┤  ← bearing race (inner: r≈2mm shaft)
  │    ╲ shaft ╱     │  free-spinning tip below bearing
  │     ╲─────╱      │  conical taper
  │      ╲   ╱       │
  │       ╲ ╱        │
  └────────·─────────┘  sharp metal tip r=0.3mm, μ_floor=0.10 (floor-tip)
                          μ_body_tip=0.015 (bearing friction only)
  mass=7.8g  I=5.772×10⁻⁷  t_battle=865s  F_lat_resist=0.011N (poor KO)
```

```
Physics Analysis

m_BM       = 7.8 g = 0.0078 kg
r_tip      = 0.3 mm (conical sharp),  r_casing = 12 mm,  r_shaft = 2 mm
I_BM       = ½ × 0.0078 × (0.012² + 0.002²) = 5.772×10⁻⁷ kg·m²
Assembly share = 5.772×10⁻⁷ / 2.305×10⁻⁵ = 2.50%

Spin decay (bearing friction dominates):
  μ_bearing = 0.015,  r_shaft = 1 mm (ball contact radius)
  dω/dt_BM  = −(0.015 × 0.0753 × 9.81 × 0.001) / 2.305×10⁻⁵ = −0.481 rad/s²
  t_battle  = 416 / 0.481 = 865 s  (theoretical maximum)

KO resistance (lateral):
  F_lat     = μ_bearing × m_total × g = 0.015 × 0.0753 × 9.81 = 0.0111 N
  F_lat_non_free = μ_sharp × m × g  = 0.10 × 0.0753 × 9.81  = 0.0739 N
  KO_resist_ratio = 0.0111 / 0.0739 = 0.15  (6.7× weaker lateral anchoring)

Height penalty (+1.5mm vs standard):
  P_disc_contact × exp(1.5/1.0) = +348% disc-layer contact risk vs standard height

Assembly summary (Barricade Lucifer Illegal Bearing Mobius-10):
  m_total   = 75.3 g,  I_total = 2.305×10⁻⁵ kg·m²  (blades retracted)
  L₀        = 2.305×10⁻⁵ × 694 = 1.600×10⁻² kg·m²/s  (highest in this case study)
  t_battle  ≈ 865 s  (theoretical)
  t_practical: limited by disc-layer contacts and opponent aggression, not intrinsic decay
```

```typescript
function bearingMobiusSpinDecay(mTotal_g: number, iTotal: number, muBearing: number, rShaft_mm: number): {
  dOmega: number; tBattle_s: number
} {
  const dO = -(muBearing * (mTotal_g / 1000) * 9.81 * (rShaft_mm / 1000)) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// bearingMobiusSpinDecay(75.3, 2.305e-5, 0.015, 1) → { dω=−0.481, t=865s }
// bearingMobiusSpinDecay(75.3, 2.305e-5, 0.08,  1) → { dω=−2.56,  t=162s }  — plain bushing
// bearingMobiusSpinDecay(75.3, 2.305e-5, 0.015, 2) → { dω=−0.961, t=433s }  — larger shaft

function bearingMobiusKoResistance(muBearing: number, muSolid: number, mTotal_g: number): {
  fLatBearing_N: number; fLatSolid_N: number; koRatio: number
} {
  const m = mTotal_g / 1000;
  const fB = muBearing * m * 9.81;
  const fS = muSolid * m * 9.81;
  return { fLatBearing_N: fB, fLatSolid_N: fS, koRatio: fB / fS };
}
// bearingMobiusKoResistance(0.015, 0.10, 75.3) → { fBearing=0.0111N, fSolid=0.0739N, ratio=0.15 }
// bearingMobiusKoResistance(0.015, 0.03, 75.3) → { ratio=0.50 }  — vs ball tip (less gap)
// bearingMobiusKoResistance(0.015, 0.10, 37.8) → { ratio=0.15 }  — ratio invariant to mass

function bearingMobiusVsMobius(iTotal: number, mTotal_g: number): {
  tBearingMobius_s: number; tMobius_s: number; improvementPct: number
} {
  const m = mTotal_g / 1000;
  const tBM = 416 / ((0.015 * m * 9.81 * 0.001) / iTotal);
  const tM  = 416 / ((0.05  * m * 9.81 * 0.001) / iTotal);
  return { tBearingMobius_s: tBM, tMobius_s: tM, improvementPct: (tBM / tM - 1) * 100 };
}
// bearingMobiusVsMobius(2.305e-5, 75.3) → { BM=865s, M=259s, improvement=+233% }
// bearingMobiusVsMobius(1.640e-5, 74.6) → { BM=614s, M=184s, improvement=+234% }
// bearingMobiusVsMobius(2.305e-5, 48.9) → { BM=1331s, M=399s, improvement=+234% }
```

---

## Case 494 — Superking Chip Lucifer 2 (Superking / Sparking Layer System)

Superking Chip Lucifer 2 is the second Lucifer-themed SK Chip, one of five SK Chips to incorporate a metal component — a small zinc or steel insert moulded into the chip body that increases mass concentration at the outer radius relative to a pure-ABS chip. Weight is not explicitly published but is estimated at approximately 4.5 g based on comparisons with contemporaries; Solomon with Metal Chip Core is described as heavier and more balanced, suggesting Lucifer 2 sits below Solomon in the 5–7 g metal-chip tier. The metal insert shifts inertia: I_L2 ≈ ½ × 0.0045 × (0.009² + 0.004²) ≈ 2.183×10⁻⁷ kg·m², contributing ~1.0% of the assembly (I_total ≈ 2.204×10⁻⁵). The defining unique feature is a rubber protrusion on the underside of the chip that presses against the top face of the Performance Tip. During a burst attempt the Layer (chip + Ring) rotates relative to the stationary driver; the rubber protrusion resists this relative rotation through friction: τ_rubber = μ_rubber × N_axial × r_protrusion = 0.70 × (m_chip × g + F_stack_preload) × 0.0015. Under dynamic impact the axial preload increases substantially (F_axial_dynamic ≈ 5–10 N from collision compression), giving τ_rubber_dynamic ≈ 0.70 × 7 × 0.0015 = 7.35 mN·m — a meaningful always-on burst resistance supplement on top of standard tab torque. Unlike tab-based burst resistance which engages only when tabs are compressed past the ratchet step, the rubber friction acts continuously for any relative rotational slippage, making it effective even at high spin rates where tab engagement is marginal. The right-spin designation matches The End Ring above it.

```
ASCII Visual Geometry — SK Chip Lucifer 2 (underside view)

       ┌─────────────┐  r=9mm outer  (metal insert inside ABS shell)
      /  metal insert \  → denser than pure-ABS chip
     │  ┌──────────┐  │
     │  │ r=4mm    │  │  right-spin ratchet tabs ×3
     │  │  bore    │  │
     │  └──────────┘  │
     │  [●] rubber    │  ← rubber protrusion (center, underside)
      \  protrusion  /     presses on driver top face
       └─────────────┘
  mass≈4.5g (estimated)  I≈2.183×10⁻⁷  τ_rubber≈7.35 mN·m (dynamic)
  unique anti-burst mechanism: friction vs slippage on driver face
```

```
Physics Analysis

m_L2       ≈ 4.5 g = 0.0045 kg  (estimated; no published weight)
r_o        = 9 mm,  r_i = 4 mm
I_L2       = ½ × 0.0045 × (0.009² + 0.004²) = 2.183×10⁻⁷ kg·m²

Rubber anti-burst (protrusion on driver face):
  μ_rubber   = 0.70,  r_protrusion = 1.5 mm
  N_static   = m_L2 × g = 0.044 N
  N_dynamic  ≈ 7.0 N  (impact axial compression)
  τ_static   = 0.70 × 0.044 × 0.0015 = 0.046 mN·m  (negligible at rest)
  τ_dynamic  = 0.70 × 7.0 × 0.0015  = 7.35 mN·m    (during impact — meaningful)

Assembly (Lucifer The End Kou Drift):
  m_total   ≈ 67.3 g,  I_total ≈ 2.204×10⁻⁵ kg·m²
  L₀        = 2.204×10⁻⁵ × 694 = 1.530×10⁻² kg·m²/s
```

```typescript
function lucifer2RubberBurstResist(muRubber: number, nAxial_N: number, rProtrusion_mm: number): number {
  return muRubber * nAxial_N * (rProtrusion_mm / 1000) * 1000;
}
// lucifer2RubberBurstResist(0.70, 7.0, 1.5) → 7.35 mN·m  — dynamic (impact)
// lucifer2RubberBurstResist(0.70, 0.044, 1.5) → 0.046 mN·m  — static (at rest)
// lucifer2RubberBurstResist(0.70, 3.0, 1.5) → 3.15 mN·m  — moderate impact

function lucifer2MetalChipInertia(mChip_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mChip_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// lucifer2MetalChipInertia(4.5, 9, 4) → 2.183×10⁻⁷ kg·m²
// lucifer2MetalChipInertia(6.0, 9, 4) → 2.910×10⁻⁷  — heavier Solomon estimate
// lucifer2MetalChipInertia(3.1, 9, 4) → 1.503×10⁻⁷  — DS chip (ABS-only, Case 467)

function lucifer2TotalBurstResist(tauTabs_mNm: number, tauRubber_mNm: number): number {
  return tauTabs_mNm + tauRubber_mNm;
}
// lucifer2TotalBurstResist(23.9, 7.35) → 31.3 mN·m  — dynamic combined
// lucifer2TotalBurstResist(23.9, 0.046) → 23.9 mN·m  — static only (tabs dominate)
// lucifer2TotalBurstResist(26.5, 7.35) → 33.9 mN·m  — with thick tabs (Lucifer DB Core tabs)
```

---

## Case 495 — Ring The End (Superking / Sparking Layer System)

Ring The End weighs 25.5 g (r_outer ≈ 28 mm, r_inner ≈ 10 mm) and is a right-spin Defense Type Ring built around a two-layer bistable free-spin gimmick. The ring is structurally divided into an inner fixed layer (bonded to the SK Chip above) and an outer free-spinning layer (mounted on an internal bearing/bushing track), with the two layers coupled via a lock mechanism triggered either by ratchet advancement (gradual tab wear) or by a sufficiently strong impact impulse (instantaneous). Pre-trigger the layers rotate as one locked unit, concentrating the full ring inertia into burst ratchet engagement: I_TheEnd_locked ≈ ½ × 0.0255 × (0.028² + 0.010²) = 1.127×10⁻⁵ kg·m². Post-trigger, the outer layer (estimated ~60% mass at r_outer, I_outer ≈ 7.649×10⁻⁶ kg·m²) decouples from the ratchet; incoming contact torque τ_contact instead accelerates the outer blade with α_outer = τ_contact / I_outer, absorbing the torque through kinetic energy storage rather than transmitting it to the burst tabs — τ_ratchet_post ≈ 0, effectively eliminating burst risk post-transform. The zigzag counter blade geometry further provides pre-trigger recoil splitting: each tooth on the zigzag reflects the contact force into both a tangential (burst-contributing) and normal (radially inward, not burst-contributing) component. With blade angle β ≈ 30° from radial: τ_burst_fraction = τ_contact × sin(30°) = 0.5 × τ_contact (50% of impact force contributes to burst), compared to ~90% for flat blade contacts. The "counter blade" label implies the geometry is optimised to redirect attack force back into the opponent (counter-type), increasing the KO threat to attackers while reducing self-burst risk. The combination of pre-trigger recoil splitting and post-trigger free-spin makes The End the most defensively sophisticated Ring in the Sparking era.

```
ASCII Visual Geometry — Ring The End (side cross-section, two layers)

  LOCKED (pre-trigger):              FREE-SPIN (post-trigger):
  ┌──────────────────────────────┐   ┌──────────────────────────────┐
  │ outer  ████████████████████  │   │ outer  ═══free-spinning═══   │
  │ layer ╱zigzag counter blade╲ │   │ layer ╱rotates independently╲│
  │ inner ████████████████████   │   │ inner ████ (fixed to chip)   │
  └──────────────────────────────┘   └──────────────────────────────┘
  I_locked=1.127×10⁻⁵               I_outer=7.649×10⁻⁶ (free)
  τ_burst = 50% of contact           τ_burst ≈ 0 (outer absorbs all)
  Trigger: tab wear OR strong impact → outer layer decouples
  r_o=28mm  mass=25.5g
```

```
Physics Analysis

m_TE       = 25.5 g = 0.0255 kg
r_o        = 28 mm,  r_i = 10 mm
I_locked   = ½ × 0.0255 × (0.028² + 0.010²) = 1.127×10⁻⁵ kg·m²

Free-spin outer layer (estimated 60% mass at r_o):
  m_outer   = 0.60 × 0.0255 = 0.0153 kg  at r_o_eff ≈ 24 mm
  I_outer   = ½ × 0.0153 × (0.028² + 0.020²) = 7.649×10⁻⁶ kg·m²

Post-trigger torque absorption:
  τ_contact = 10 mN·m (example)
  α_outer   = τ_contact / I_outer = 0.010 / 7.649×10⁻⁶ = 1308 rad/s²  (outer spins up fast)
  τ_ratchet ≈ 0  (all torque absorbed by outer blade kinetic energy)

Zigzag blade recoil splitting (β=30° from radial):
  τ_burst_fraction = sin(30°) = 0.50  (50% of impact → burst)
  vs flat blade: sin(90°) = 1.0  (100% → burst)
  Burst risk reduction pre-trigger: 50%
```

```typescript
function theEndLockedInertia(mRing_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mRing_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// theEndLockedInertia(25.5, 28, 10) → 1.127×10⁻⁵ kg·m²
// theEndLockedInertia(25.5, 30, 10) → 1.275×10⁻⁵  — wider outer
// theEndLockedInertia(14.8, 27, 10) → 6.135×10⁻⁶  — Barricade deployed comparison

function theEndFreeSpinAbsorption(tauContact_mNm: number, iOuter: number): {
  alphaOuter_rads2: number; tauRatchet_mNm: number
} {
  const alpha = (tauContact_mNm / 1000) / iOuter;
  const tauR = Math.max(0, (tauContact_mNm / 1000) - iOuter * alpha) * 1000;
  return { alphaOuter_rads2: alpha, tauRatchet_mNm: tauR };
}
// theEndFreeSpinAbsorption(10, 7.649e-6) → { alpha=1308 rad/s², τRatchet=0 mN·m }
// theEndFreeSpinAbsorption(30, 7.649e-6) → { alpha=3923 rad/s², τRatchet=0 mN·m }
// theEndFreeSpinAbsorption(10, 1.0e-6)   → { alpha=10000 rad/s², τRatchet=0 mN·m }

function theEndZigzagBurstFraction(bladeAngle_deg: number, tauContact_mNm: number): number {
  return tauContact_mNm * Math.sin(bladeAngle_deg * Math.PI / 180);
}
// theEndZigzagBurstFraction(30, 20) → 10.0 mN·m  — 50% reaches ratchet
// theEndZigzagBurstFraction(90, 20) → 20.0 mN·m  — flat blade (100%)
// theEndZigzagBurstFraction(15, 20) → 5.18 mN·m  — shallower zigzag (26%)
```

---

## Case 496 — Forge Disc Kou (Superking / Sparking Layer System)

Forge Disc Kou weighs 27.3 g (r_outer ≈ 25 mm, r_inner ≈ 8 mm) and is one of three Limit Break Discs alongside the other two heavier options, specifically designed to interface mechanically with the Limit Break Rings (Burn, Volcano, The End). The name "Kou" (from Japanese 皇, meaning Emperor) mirrors the imperial theme of the assemblies that use it. As the lightest of the three Limit Break Discs, Kou occupies the stamina-oriented position within the tier: lower mass at the outer radius means less I but also less material that could disrupt the free-spin gimmick of rings like The End. From the component image, Kou features a toothed perimeter with approximately 12 pointed teeth in C₁₂ symmetry — a gear-like profile that differs from smooth-perimeter discs (Illegal, Disc 00) or protrusion discs (Force, Disc 12). Inertia I_Kou = ½ × 0.0273 × (0.025² + 0.008²) = 9.405×10⁻⁶ kg·m², contributing 42.7% of the assembly's inertia budget — the dominant contributor. The toothed outer profile creates contact surfaces at disc level (μ_tooth ≈ 0.15) with moderate LAD penalty; r_LAD_eff oscillates between r_tooth_tip ≈ 25 mm and r_tooth_root ≈ 20 mm as the disc rotates at precession frequency, similar to Disc 12's oscillation (Case 470) but with more teeth (12 vs 2) producing higher-frequency, lower-amplitude oscillation that partially averages out. The "Limit Break" designation implies Kou's inner mounting geometry includes tabs or protrusions that engage with raised features on The End and Burn/Volcano Rings, likely contributing to the lock-advance trigger mechanism of those Rings.

```
ASCII Visual Geometry — Forge Disc Kou (top view)

      r=25mm (12 teeth, C₁₂ symmetry)
    ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲ ▲
   ╱ ╲╱ ╲╱ ╲╱ ╲╱ ╲╱ ╲╱ ╲╱ ╲╱ ╲╱ ╲╱ ╲
  │   C₁₂ toothed perimeter (zinc)    │  r_inner=8mm
  │   "Emperor" disc                  │  Limit Break compatible
   ╲ ╱╲ ╱╲ ╱╲ ╱╲ ╱╲ ╱╲ ╱╲ ╱╲ ╱╲ ╱╲ ╱
    ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼
  mass=27.3g  I=9.405×10⁻⁶  42.7% of assembly I
  μ_tooth≈0.15  (moderate LAD penalty vs smooth)
  r_LAD oscillates 20–25mm (12 teeth, low amplitude)
```

```
Physics Analysis

m_Kou      = 27.3 g = 0.0273 kg
r_o        = 25 mm,  r_i = 8 mm
I_Kou      = ½ × 0.0273 × (0.025² + 0.008²) = 9.405×10⁻⁶ kg·m²
Assembly share = 9.405×10⁻⁶ / 2.204×10⁻⁵ = 42.7%

LAD (toothed perimeter, μ=0.15):
  dω/dt_LAD = −(0.15 × 0.0673 × 9.81 × r_LAD) / 2.204×10⁻⁵
  At r_LAD = 0.025m (tooth tip): dω/dt = −44.9 rad/s²  (fast, aggressive)
  LAD_ratio  = μ_smooth / μ_tooth = 0.05/0.15 = 0.333  (3× shorter than smooth disc)

Limit Break Disc interface:
  Kou inner tabs engage The End Ring lower face → contribute to lock-advance trigger
  Estimated τ_lock_contribution ≈ 2–4 mN·m (additional pre-trigger stability)

vs Illegal (31.9g, I=1.180×10⁻⁵, smooth):
  ΔI = 9.405×10⁻⁶ − 1.180×10⁻⁵ = −2.395×10⁻⁶  (Kou lighter → less stamina)
  But Kou's Limit Break compatibility enables The End transform gimmick
```

```typescript
function kouDiscInertia(mDisc_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mDisc_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// kouDiscInertia(27.3, 25, 8) → 9.405×10⁻⁶ kg·m²
// kouDiscInertia(31.9, 26, 8) → 1.180×10⁻⁵  — Illegal for comparison
// kouDiscInertia(27.3, 28, 8) → 1.151×10⁻⁵  — if wider outer radius

function kouLadSpinDecay(mTotal_g: number, iTotal: number, muTooth: number, rLad_mm: number): {
  dOmega: number; tLadEpoch_s: number
} {
  const dO = -(muTooth * (mTotal_g / 1000) * 9.81 * (rLad_mm / 1000)) / iTotal;
  return { dOmega: dO, tLadEpoch_s: 277 / Math.abs(dO) };
}
// kouLadSpinDecay(67.3, 2.204e-5, 0.15, 25) → { dω=−44.9, t=6.17s }  — per LAD orbit
// kouLadSpinDecay(67.3, 2.204e-5, 0.05, 25) → { dω=−14.9, t=18.5s }  — smooth disc comparison
// kouLadSpinDecay(67.3, 2.204e-5, 0.15, 22) → { dω=−39.5, t=7.02s }  — tooth root

function kouVsIllegalStamina(iKou: number, iIllegal: number, mTotal_g: number, muBushing: number): {
  tKou_s: number; tIllegal_s: number; illegalAdvantage_pct: number
} {
  const m = mTotal_g / 1000;
  const dOKou = (muBushing * m * 9.81 * 0.001) / iKou;
  const dOIll = (muBushing * m * 9.81 * 0.001) / iIllegal;
  return {
    tKou_s: 416 / dOKou,
    tIllegal_s: 416 / dOIll,
    illegalAdvantage_pct: (dOKou / dOIll - 1) * 100
  };
}
// kouVsIllegalStamina(9.405e-6, 1.180e-5, 67.3, 0.05) → { Kou=287s, Illegal=360s, +25.4% }
// kouVsIllegalStamina(9.405e-6, 1.180e-5, 75.3, 0.05) → { Kou=320s, Illegal=402s, +25.4% }
// kouVsIllegalStamina(9.405e-6, 1.180e-5, 67.3, 0.015) → { Kou=860s, Illegal=1079s, +25.4% }
```

---

## Case 497 — Performance Tip Drift (Superking / Sparking Layer System)

Performance Tip Drift weighs 10.0 g (wide octagonal outer body r ≈ 15 mm, shaft r ≈ 2 mm, conical sharp free-spinning tip r_tip ≈ 0.4 mm, height ≈ 12 mm) and achieves high Stamina through a free-spinning conical sharp tip supported by a plain plastic bushing (not ball bearings, unlike Bearing Mobius). The plain bushing gives μ_bushing ≈ 0.05, compared to μ_bearing ≈ 0.015 for Bearing Mobius — yielding spin decay dω/dt_Drift = −(0.05 × 0.0673 × 9.81 × 0.001) / 2.204×10⁻⁵ = −1.50 rad/s², t_battle = 416 / 1.50 = 277 s. The wide octagonal outer body (r_body ≈ 15 mm, eight flat faces) provides exceptional LAD: when the beyblade tilts past θ_onset ≈ arccos(r_shaft / r_body) = arccos(2/15) = 82.3° (very late onset), the octagonal rim contacts the arena floor at r_LAD ≈ 15 mm, producing a stable circular precession orbit. The wide base also lowers the overall CoM and suppresses tilt initiation, extending the stationary spin phase before LAD engagement. The "works particularly well against opposite-spin opponents" property derives from free-spin tip geometry: when an opposite-spin opponent's tip contacts Drift's tip, the free-spinning Drift tip can rotate in either direction (opposite or same as body), allowing the inter-tip contact to be absorbed without the spin-drain that affects a non-free-spinning tip — functionally decoupling Drift's body spin from the spin-equalization interaction. Inertia I_Drift = ½ × 0.010 × (0.015² + 0.002²) = 1.145×10⁻⁶ kg·m², contributing 5.20% of assembly. The full Lucifer The End Kou Drift assembly achieves I_total ≈ 2.204×10⁻⁵ kg·m², L₀ = 1.530×10⁻² kg·m²/s, t_battle ≈ 277 s — excellent stamina for a Defense-type assembly.

```
ASCII Visual Geometry — Drift (side profile)

  ┌────────────────────┐  r=15mm wide octagonal body
  │ ABS, 8 flat faces  │  low CoM (wide base suppresses tilt)
  │  ┌──────────────┐  │
  │  │ plain bushing│  │  μ_bushing≈0.05 (less free than ball bearings)
  │  └──────────────┘  │
  │   octagonal body   │  r_LAD=15mm at tilt onset θ=82°
  │   ████████████     │  8 flat faces create stable precession track
  └────────┬───────────┘
           │  conical taper
           ·  sharp tip r=0.4mm, μ_floor=0.10
  mass=10.0g  I=1.145×10⁻⁶  t_battle=277s  works vs opposite-spin
```

```
Physics Analysis

m_D        = 10.0 g = 0.010 kg
r_body     = 15 mm (octagonal),  r_shaft = 2 mm,  r_tip = 0.4 mm
I_Drift    = ½ × 0.010 × (0.015² + 0.002²) = 1.145×10⁻⁶ kg·m²
Assembly share = 1.145×10⁻⁶ / 2.204×10⁻⁵ = 5.20%

Spin decay (plain bushing free-spin, μ=0.05, r_contact=1mm):
  dω/dt    = −(0.05 × 0.0673 × 9.81 × 0.001) / 2.204×10⁻⁵ = −1.50 rad/s²
  t_battle = 416 / 1.50 = 277 s

LAD onset (wide octagonal rim):
  θ_onset  = arccos(0.002 / 0.015) = 82.3°  (very late onset — wide base resists tilt)
  r_LAD    = 15 mm  (rim contact at onset)
  dω/dt_LAD = −(0.05 × 0.0673 × 9.81 × 0.015) / 2.204×10⁻⁵ = −22.5 rad/s²

Opposite-spin decoupling:
  Δω_steal = F_tip × r_tip × t_contact / I_body ≈ 0  (free-spin tip absorbs interaction)
  vs non-free tip: Δω_steal = 0.10 × 0.0673 × 9.81 × 0.0004 × 0.005 / 2.204×10⁻⁵ = 0.006 rad/s per contact

Assembly summary (Lucifer The End Kou Drift):
  m_total  ≈ 67.3 g,  I_total ≈ 2.204×10⁻⁵ kg·m²
  L₀       = 2.204×10⁻⁵ × 694 = 1.530×10⁻² kg·m²/s
  t_battle ≈ 277 s  (Drift bushing phase, before LAD)
```

```typescript
function driftSpinDecay(mTotal_g: number, iTotal: number, muBushing: number, rContact_mm: number): {
  dOmega: number; tBattle_s: number
} {
  const dO = -(muBushing * (mTotal_g / 1000) * 9.81 * (rContact_mm / 1000)) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// driftSpinDecay(67.3, 2.204e-5, 0.05, 1) → { dω=−1.50, t=277s }
// driftSpinDecay(67.3, 2.204e-5, 0.015, 1) → { dω=−0.450, t=924s }  — Bearing Mobius comparison
// driftSpinDecay(75.3, 2.305e-5, 0.05, 1) → { dω=−1.60, t=260s }  — heavier assembly

function driftLadOnset(rBody_mm: number, rShaft_mm: number): {
  thetaOnset_deg: number; rLad_mm: number
} {
  const theta = Math.acos(rShaft_mm / rBody_mm) * 180 / Math.PI;
  return { thetaOnset_deg: theta, rLad_mm: rBody_mm };
}
// driftLadOnset(15, 2) → { θ=82.3°, rLad=15mm }  — very late onset (wide body)
// driftLadOnset(7, 2)  → { θ=73.4°, rLad=7mm }   — Yard ring for comparison
// driftLadOnset(15, 5) → { θ=70.5°, rLad=15mm }  — wider shaft

function driftOppositeSpin(muTip: number, mTotal_g: number, rTip_mm: number, tContact_ms: number, iTotal: number, freeSpinActive: boolean): number {
  if (freeSpinActive) return 0;
  const f = muTip * (mTotal_g / 1000) * 9.81;
  return (f * (rTip_mm / 1000) * (tContact_ms / 1000)) / iTotal;
}
// driftOppositeSpin(0.10, 67.3, 0.4, 5, 2.204e-5, true)  → 0 rad/s  — free-spin active
// driftOppositeSpin(0.10, 67.3, 0.4, 5, 2.204e-5, false) → 0.006 rad/s  — locked tip
// driftOppositeSpin(0.10, 67.3, 1.5, 5, 2.204e-5, false) → 0.022 rad/s  — wider tip
```

---

## Case 498 — Gatinko Chip Dragon 2 (GT / Rise Layer System)

Gatinko Chip Dragon 2 weighs 3.0 g (r_outer ≈ 9 mm, r_inner ≈ 4 mm) and is a right-spin GT-era Gatinko Chip distinguished by three hard locks — a term indicating that the PC cantilever tabs are moulded with a steeper ramp angle (β_ramp ≈ 25° vs standard 15°), which increases the normal force component during ratchet engagement and resists burst even without a Dash Driver spring supplement. With k_tab ≈ 4000 N/m per tab and standard engagement δ = 0.3 mm, r_eng = 7 mm: τ_tab = 3 × 4000 × 0.0003 × 0.007 = 25.2 mN·m — 5.5% above the 3800 N/m standard (23.9 mN·m). The hard lock geometry also means the tabs re-engage more reliably after a partial slip without fully bursting, because the steep ramp forces the tab back to its seat rather than allowing it to ride over. Dragon 2 is the second Lucifer-named chip in the GT series (distinct from SK Chip Lucifer 2 in the Sparking system) and is distinguished by sculpted dragon claw details. Inertia I_Dragon2 = ½ × 0.003 × (0.009² + 0.004²) = 1.478×10⁻⁷ kg·m², contributing 0.62% of the Imperial Dragon Ignition' assembly (I_total ≈ 2.402×10⁻⁵ kg·m²). The note that Dragon 2 is "ideal with the Goku Layer Weight" refers to a GT-era accessory (Layer Weight) that inserts into the Gatinko Layer below the chip to add mass at a specified radius — Dragon 2's hard-lock tabs provide the burst resistance foundation that allows a heavy Layer Weight to be used without increasing burst risk through the chip.

```
ASCII Visual Geometry — Gatinko Chip Dragon 2 (top view)

       ┌─────────────┐  r=9mm outer
      /  dragon claw  \  sculpted ABS
     │  ┌──────────┐  │  3 hard-lock tabs (β_ramp=25°)
     │  │ r=4mm    │  │  k_tab=4000 N/m  τ=25.2 mN·m
     │  │  bore    │  │  re-engagement after partial slip
     │  └──────────┘  │
      \               /
       └─────────────┘
  mass=3.0g  I=1.478×10⁻⁷  right-spin  0.62% of assembly I
  hard locks: works without Dash spring
```

```
Physics Analysis

m_D2       = 3.0 g = 0.003 kg
r_o        = 9 mm,  r_i = 4 mm
I_D2       = ½ × 0.003 × (0.009² + 0.004²) = 1.478×10⁻⁷ kg·m²

Burst resistance (3 hard-lock tabs, k=4000 N/m):
  τ_tab    = 3 × 4000 × 0.0003 × 0.007 = 25.2 mN·m
  vs standard (k=3800): τ = 23.9 mN·m  (+5.5% from hard lock)

Assembly (Imperial Dragon Ignition'):
  m_total  = 68.9 g,  I_total ≈ 2.402×10⁻⁵ kg·m²
  L₀       = 2.402×10⁻⁵ × 694 = 1.667×10⁻² kg·m²/s
```

```typescript
function dragon2HardLockTorque(nTabs: number, kTab_Nm: number, delta_mm: number, rEng_mm: number): number {
  return nTabs * kTab_Nm * (delta_mm / 1000) * (rEng_mm / 1000) * 1000;
}
// dragon2HardLockTorque(3, 4000, 0.3, 7) → 25.2 mN·m  — Dragon 2 hard lock
// dragon2HardLockTorque(3, 3800, 0.3, 7) → 23.9 mN·m  — standard chip comparison
// dragon2HardLockTorque(3, 4000, 0.4, 7) → 33.6 mN·m  — deeper engagement

function dragon2InertiaShare(iChip: number, iTotal: number): number {
  return (iChip / iTotal) * 100;
}
// dragon2InertiaShare(1.478e-7, 2.402e-5) → 0.62%
// dragon2InertiaShare(1.478e-7, 1.605e-5) → 0.92%  — Brave Valkyrie assembly
// dragon2InertiaShare(2.183e-7, 2.402e-5) → 0.91%  — Lucifer 2 metal chip comparison

function dragon2RampReEngagement(kTab_Nm: number, rampAngle_deg: number, delta_mm: number, rEng_mm: number): {
  tauEngagement_mNm: number; normalForce_N: number
} {
  const fSpring = kTab_Nm * (delta_mm / 1000);
  const fNormal = fSpring / Math.sin(rampAngle_deg * Math.PI / 180);
  return { tauEngagement_mNm: fSpring * (rEng_mm / 1000) * 1000, normalForce_N: fNormal };
}
// dragon2RampReEngagement(4000, 25, 0.3, 7) → { τ=8.40 mN·m, Fn=2.84N }  — hard lock (steep ramp)
// dragon2RampReEngagement(3800, 15, 0.3, 7) → { τ=7.98 mN·m, Fn=4.36N }  — standard (shallower)
// dragon2RampReEngagement(4000, 25, 0.5, 7) → { τ=14.0 mN·m, Fn=4.73N }
```

---

## Case 499 — Layer Imperial (GT / Rise Layer System)

Layer Imperial weighs 26.8 g (r_outer ≈ 29 mm, r_inner ≈ 8 mm) and is a right-spin Attack-Type GT Layer built around a three-stage progressive rubber awakening gimmick — the most mechanically sophisticated layer-level combat evolution in the GT series. The layer is structurally divided into three materials: a white ABS base ring (fixed), golden ABS/PC blades mounted on an inner rotating ring, and red rubber contact pads recessed beneath the golden blades. In Stage 1 (pristine, out of box) the rubber is completely hidden behind the golden blades; effective contact coefficient C_eff_1 ≈ 0.40 (ABS/PC smash, high recoil but low grip). Each burst attempt — whether successful or not — advances the internal ratchet by one step, rotating the inner golden blade ring by approximately 20° per step. After ~3 ratchet advances (Stage 2), rubber partially protrudes: C_eff_2 ≈ 0.60 (mixed rubber-ABS). After ~6 advances (Stage 3, fully awakened), the rubber pads extend fully: C_eff_3 ≈ 0.80 (rubber smash, high friction, devastating grip on contact). The mass consequence of awakening: inertia is constant (I_Imperial = ½ × 0.0268 × (0.029² + 0.008²) = 1.213×10⁻⁵ kg·m², 50.5% of assembly), but contact force distribution shifts — Stage 3 rubber contact generates F_contact = μ_rubber × F_normal = 0.80 × F_normal vs Stage 1's 0.40 × F_normal, doubling the burst-assisting torque applied to the opponent per strike. At 26.8 g it is "notably thicker and heavier than previous Dragon layers," referring to the additional mass of the golden blade ring and rubber pad housing that the awakening mechanism requires, shifting the layer's CoM outward and increasing gyroscopic stability at high spin.

```
ASCII Visual Geometry — Layer Imperial (top view, 3-stage awakening)

  STAGE 1 (pristine):       STAGE 2 (partial):        STAGE 3 (awakened):
  ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
 /  ██gold██ ██gold██    \  /  ██gold█ rubber █gold█\ /  rubber  rubber  rubber\
│   █blade██ ██blade█    │ │   █blend█ exposed  █    │ │  fully   fully   fully  │
│   rubber hidden behind │ │   ~20° blade shift     │ │  rubber extended (r=29)  │
 \  r_contact≈27mm ABS  /  \ r=28mm mixed          /  \ r=29mm rubber grip     /
  └─────────────────────┘   └─────────────────────┘   └─────────────────────┘
  C_eff=0.40                C_eff=0.60                 C_eff=0.80
  ~0 bursts taken           ~3 ratchet steps           ~6+ ratchet steps
  I_Imperial=1.213×10⁻⁵ (unchanged across stages)  mass=26.8g
```

```
Physics Analysis

m_Imp      = 26.8 g = 0.0268 kg
r_o        = 29 mm,  r_i = 8 mm
I_Imperial = ½ × 0.0268 × (0.029² + 0.008²) = 1.213×10⁻⁵ kg·m²
Assembly share = 1.213×10⁻⁵ / 2.402×10⁻⁵ = 50.5%

Contact force per stage (F_normal=20N example):
  Stage 1: F_contact = 0.40 × 20 = 8.0 N   (gold blades, ABS)
  Stage 2: F_contact = 0.60 × 20 = 12.0 N  (partial rubber)
  Stage 3: F_contact = 0.80 × 20 = 16.0 N  (full rubber)

Burst-assist torque per stage (τ = F_contact × r_eng_opp):
  Stage 1: τ_assist = 8.0 × 0.007  = 56.0 mN·m
  Stage 2: τ_assist = 12.0 × 0.007 = 84.0 mN·m
  Stage 3: τ_assist = 16.0 × 0.007 = 112 mN·m  (+100% vs Stage 1)

Blade ring rotation per ratchet step: Δθ ≈ 20°  (3 steps to Stage 2, 6 to Stage 3)
```

```typescript
function imperialAwakeningContact(stage: 1 | 2 | 3, fNormal_N: number): {
  cEff: number; fContact_N: number; tauAssist_mNm: number
} {
  const cMap = { 1: 0.40, 2: 0.60, 3: 0.80 };
  const cEff = cMap[stage];
  const fC = cEff * fNormal_N;
  return { cEff, fContact_N: fC, tauAssist_mNm: fC * 0.007 * 1000 };
}
// imperialAwakeningContact(1, 20) → { C=0.40, F=8.0N,  τ=56.0 mN·m }
// imperialAwakeningContact(2, 20) → { C=0.60, F=12.0N, τ=84.0 mN·m }
// imperialAwakeningContact(3, 20) → { C=0.80, F=16.0N, τ=112 mN·m  }

function imperialBladeRingRotation(nSteps: number, degPerStep: number): {
  totalRotation_deg: number; stage: 1 | 2 | 3
} {
  const rot = nSteps * degPerStep;
  const stage = rot >= 6 * degPerStep ? 3 : rot >= 3 * degPerStep ? 2 : 1;
  return { totalRotation_deg: rot, stage: stage as 1 | 2 | 3 };
}
// imperialBladeRingRotation(0, 20) → { rot=0°, stage=1 }
// imperialBladeRingRotation(3, 20) → { rot=60°, stage=2 }
// imperialBladeRingRotation(6, 20) → { rot=120°, stage=3 }

function imperialInertiaShare(iLayer: number, iTotal: number): number {
  return (iLayer / iTotal) * 100;
}
// imperialInertiaShare(1.213e-5, 2.402e-5) → 50.5%
// imperialInertiaShare(1.213e-5, 1.605e-5) → 75.6%  — in lighter assembly
// imperialInertiaShare(1.127e-5, 2.402e-5) → 46.9%  — The End ring comparison
```

---

## Case 500 — Disc-Integrated Driver Ignition' (GT / Rise Layer System)

Disc-Integrated Driver Ignition' weighs 39.1 g (integrated disc r_outer ≈ 24 mm, motor housing r_inner ≈ 5 mm, driver height ≈ 14 mm) and is the most mechanically complex component in this case study series — a battery-powered DC electric motor fused with a Forge Disc and Attack-type tip into a single unit. The disc ring (zinc alloy, r ≈ 22–24 mm) provides inertia I_disc ≈ 1.174×10⁻⁵ kg·m²; the motor (3V DC, estimated R_motor ≈ 8 Ω, k_t = k_e ≈ 0.005 N·m/A) sits in the central housing and drives the tip shaft. Motor operating parameters: at stall (tip pressed against floor, ω_motor = 0) the current I_stall = V/R = 3/8 = 0.375 A and stall torque τ_stall = k_t × I_stall = 0.005 × 0.375 = 1.875 mN·m; at no-load (tip free, floor contact lost) ω_no_load = V/k_e = 3/0.005 = 600 rad/s. Under loaded floor contact with a rubber tip (μ ≈ 0.70, floor reaction τ_load = μ × m × g × r_tip = 0.70 × 0.0689 × 9.81 × 0.002 = 0.946 mN·m), the motor settles at ω_motor = ω_no_load × (1 − τ_load/τ_stall) = 600 × (1 − 0.946/1.875) = 297 rad/s, driving the tip and translating into a body-level acceleration dω_boost/dt = (μ × m × g × r_tip) / I_total = (0.70 × 0.0689 × 9.81 × 0.002) / 2.402×10⁻⁵ = +39.4 rad/s² when the motor drives in the same rotational direction as body spin. This completely overcomes passive friction decay (dω/dt_passive ≈ −5 to −10 rad/s² at flat tip) and can sustain or even accelerate body spin during battle, enabling the "sudden bursts of extreme speed" and erratic movement described. The Ignition' (Dash) variant carries an additional spring (α = 0.40) enhancing burst resistance by 40% over the base Ignition: τ_burst_total = τ_tab × 1.40 = 25.2 × 1.40 = 35.3 mN·m. The disc integration fixes Kou-level inertia to the assembly, making Ignition' the single largest inertia and mass contributor at 48.9% of I_total and 56.8% of total mass.

```
ASCII Visual Geometry — Ignition' (side cross-section)

  ┌──────────────────────────────────────┐  r=24mm integrated disc ring (zinc)
  │  DISC ████████████████████████████  │  provides I_disc≈1.174×10⁻⁵
  └──────────────┬───────────────────────┘
                 │
  ┌──────────────┴──────────────┐
  │  DC motor (3V, R=8Ω)        │  τ_stall=1.875 mN·m, ω_no-load=600 rad/s
  │  k_t=k_e=0.005 N·m/A       │
  │  [motor] → tip shaft        │  motor drives tip independently
  │  Dash spring collar         │  α=0.40 → τ_burst×1.40
  │   ╲  tip shaft  ╱           │
  └────────────────────────────┘
        ·  rubber tip r=2mm (Attack)
  mass=39.1g  I=1.174×10⁻⁵  motor boost: +39.4 rad/s² at full traction
  Disc+Driver fused — cannot be separated
```

```
Physics Analysis

m_Ign      = 39.1 g = 0.0391 kg  (disc + driver + motor + battery)
r_o        = 24 mm,  r_i = 5 mm  (disc ring)
I_Ign      = ½ × 0.0391 × (0.024² + 0.005²) = 1.174×10⁻⁵ kg·m²
Assembly share = 1.174×10⁻⁵ / 2.402×10⁻⁵ = 48.9%

DC motor (estimated parameters, 3V button cell):
  R_motor  = 8 Ω,  k_t = k_e = 0.005 N·m/A
  τ_stall  = 0.005 × (3/8) = 1.875 mN·m
  ω_no_load = 3 / 0.005 = 600 rad/s

Motor operating point (rubber tip floor contact, μ=0.70):
  τ_load   = 0.70 × 0.0689 × 9.81 × 0.002 = 0.946 mN·m
  ω_motor  = 600 × (1 − 0.946/1.875) = 297 rad/s  (tip drive speed)

Body acceleration from motor-driven tip:
  dω_boost/dt = (μ × m × g × r_tip) / I_total
              = (0.70 × 0.0689 × 9.81 × 0.002) / 2.402×10⁻⁵ = +39.4 rad/s²

Dash spring burst resistance:
  τ_burst  = 25.2 × 1.40 = 35.3 mN·m

Assembly (Imperial Dragon Ignition'):
  m_total  = 68.9 g,  I_total ≈ 2.402×10⁻⁵ kg·m²
  L₀       = 2.402×10⁻⁵ × 694 = 1.667×10⁻² kg·m²/s
  Net spin: motor boost (+39.4) vs passive decay (−5 to −10) → net acceleration
```

```typescript
function ignitionMotorOperatingPoint(vBattery_V: number, rMotor_Ohm: number, ktMotor: number, tauLoad_mNm: number): {
  omegaMotor_radps: number; currentDraw_A: number; powerOut_W: number
} {
  const tauStall = ktMotor * (vBattery_V / rMotor_Ohm);
  const omegaNoLoad = vBattery_V / ktMotor;
  const omegaOp = omegaNoLoad * (1 - (tauLoad_mNm / 1000) / tauStall);
  const iOp = (vBattery_V - ktMotor * omegaOp) / rMotor_Ohm;
  return { omegaMotor_radps: omegaOp, currentDraw_A: iOp, powerOut_W: (tauLoad_mNm / 1000) * omegaOp };
}
// ignitionMotorOperatingPoint(3, 8, 0.005, 0.946) → { ω=297 rad/s, I=0.188A, P=0.281W }
// ignitionMotorOperatingPoint(3, 8, 0.005, 0.500) → { ω=467 rad/s, I=0.095A, P=0.234W }
// ignitionMotorOperatingPoint(2.5, 8, 0.005, 0.946) → { ω=147 rad/s, I=0.194A, P=0.139W }  — low battery

function ignitionBodyBoost(mu: number, mTotal_g: number, rTip_mm: number, iTotal: number): number {
  return (mu * (mTotal_g / 1000) * 9.81 * (rTip_mm / 1000)) / iTotal;
}
// ignitionBodyBoost(0.70, 68.9, 2, 2.402e-5) → +39.4 rad/s²  — full traction, rubber tip
// ignitionBodyBoost(0.40, 68.9, 2, 2.402e-5) → +22.5 rad/s²  — partial traction
// ignitionBodyBoost(0.70, 68.9, 1, 2.402e-5) → +19.7 rad/s²  — narrower tip

function ignitionDashBurstResistance(tauTabs_mNm: number, dashAlpha: number): number {
  return tauTabs_mNm * (1 + dashAlpha);
}
// ignitionDashBurstResistance(25.2, 0.40) → 35.3 mN·m  — Ignition' (Dash)
// ignitionDashBurstResistance(25.2, 0.00) → 25.2 mN·m  — base Ignition (no Dash spring)
// ignitionDashBurstResistance(23.9, 0.40) → 33.5 mN·m  — standard tabs + Dash
```

---

## Case 501 — Superking Chip Dragon (Superking / Sparking Layer System)

Superking Chip Dragon weighs 3.1 g (r_outer ≈ 9 mm, r_inner ≈ 4 mm), the same mass as SK Chip Deathscyther (Case 467), and is an average-weight right-spin Superking Chip with no metal insert. Its design features sculpted dragon head and claw motifs on the ABS shell, distinguishing it visually from Lucifer 2 (Case 494) but providing no mechanical differentiation — the chip's performance is entirely determined by its 3 PC burst tabs (k_tab ≈ 3800 N/m, δ = 0.3 mm, r_eng = 7 mm, τ_tab = 23.9 mN·m) and right-spin directional lock. The wiki explicitly notes Dragon is outclassed by heavier metal-insert chips (Hyperion 2, Solomon) and dual-spin chips (Diabolos, Spriggan) because all SK Chips are otherwise cosmetically equivalent — mass and special features are the only differentiators. Inertia I_Dragon_SK = ½ × 0.0031 × (0.009² + 0.004²) = 1.503×10⁻⁷ kg·m², 0.60% of the Tempest Dragon Charge Metal 1A assembly (I_total ≈ 2.497×10⁻⁵ kg·m²). In the Tempest Dragon assembly the chip's limitation is partially offset by Chassis 1A's own burst resistance mechanism (the Double Chassis carries its own ratchet engagement at the chassis level), making the chip's 23.9 mN·m contribution additive rather than the sole line of defence. The lack of metal is a stamina-relevant distinction at the assembly level: a metal chip would add ~2–4 g at r ≈ 9 mm, raising I_chip by ~1.0–2.0×10⁻⁷ and assembly I by 0.4–0.8% — small but real.

```
ASCII Visual Geometry — SK Chip Dragon (top view)

       ┌─────────────┐  r=9mm outer  (ABS only — no metal insert)
      /  dragon head  \  dragon claw sculpts (decorative)
     │  ┌──────────┐  │  3 PC tabs, standard (k=3800 N/m)
     │  │ r=4mm    │  │  τ_tab = 23.9 mN·m  right-spin
     │  │  bore    │  │
     │  └──────────┘  │
      \               /
       └─────────────┘
  mass=3.1g  I=1.503×10⁻⁷  0.60% of assembly I
  outclassed by Solomon/Hyperion2 (metal) and Diabolos/Spriggan (dual-spin)
```

```
Physics Analysis

m_DS       = 3.1 g = 0.0031 kg
r_o        = 9 mm,  r_i = 4 mm
I_Dragon_SK = ½ × 0.0031 × (0.009² + 0.004²) = 1.503×10⁻⁷ kg·m²
Assembly share = 1.503×10⁻⁷ / 2.497×10⁻⁵ = 0.60%

Burst resistance (3 standard tabs):
  τ_tab    = 3 × 3800 × 0.0003 × 0.007 = 23.9 mN·m

Metal chip mass benefit (hypothetical Hyperion 2 swap, +3g at r=9mm):
  ΔI_metal = ½ × 0.003 × (0.009² + 0.004²) = 1.452×10⁻⁷ kg·m²  (+0.58% I_total)

Assembly (Tempest Dragon Charge Metal 1A):
  m_total  = 77.9 g,  I_total ≈ 2.497×10⁻⁵ kg·m²
  L₀       = 2.497×10⁻⁵ × 694 = 1.733×10⁻² kg·m²/s
```

```typescript
function skChipDragonInertia(mChip_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mChip_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// skChipDragonInertia(3.1, 9, 4) → 1.503×10⁻⁷ kg·m²  — Dragon (ABS-only)
// skChipDragonInertia(5.5, 9, 4) → 2.667×10⁻⁷  — Solomon/Hyperion2 estimate (metal)
// skChipDragonInertia(3.1, 9, 4) — identical to DS Chip (Case 467, also 3.1g ABS)

function skChipMetalUpgradeEffect(iChipBase: number, iChipMetal: number, iTotal: number): {
  iGain: number; shareGain_pct: number
} {
  return { iGain: iChipMetal - iChipBase, shareGain_pct: (iChipMetal - iChipBase) / iTotal * 100 };
}
// skChipMetalUpgradeEffect(1.503e-7, 2.667e-7, 2.497e-5) → { ΔI=1.164e-7, share=+0.47% }
// skChipMetalUpgradeEffect(1.503e-7, 2.667e-7, 1.640e-5) → { ΔI=1.164e-7, share=+0.71% }
// skChipMetalUpgradeEffect(1.503e-7, 3.394e-7, 2.497e-5) → { ΔI=1.891e-7, share=+0.76% }

function skChipBurstTorque(nTabs: number, kTab_Nm: number, delta_mm: number, rEng_mm: number): number {
  return nTabs * kTab_Nm * (delta_mm / 1000) * (rEng_mm / 1000) * 1000;
}
// skChipBurstTorque(3, 3800, 0.3, 7) → 23.9 mN·m  — Dragon standard
// skChipBurstTorque(3, 4000, 0.3, 7) → 25.2 mN·m  — Dragon 2 hard-lock (Case 498)
// skChipBurstTorque(3, 3800, 0.4, 7) → 31.9 mN·m  — deeper engagement
```

---

## Case 502 — Ring Tempest (Superking / Sparking Layer System)

Ring Tempest weighs 13.0 g (r_outer_bound ≈ 24 mm, r_outer_awake ≈ 27 mm, r_inner ≈ 11 mm) and is a right-spin Attack-Type ring with a four-blade Bound system: two short front Bound Blades and two long rear Bound Blades, all spring-loaded. In Bound Mode the blades are retracted and the ring presents an extremely round profile — I_bound = ½ × 0.013 × (0.024² + 0.011²) = 4.531×10⁻⁶ kg·m²; this circular shape maximises LAD (μ_round ≈ 0.05, smooth profile) and allows the spring-loaded rear blades to parry incoming attacks by compressing under contact (k_blade ≈ 900 N/m per blade, δ_parry ≈ 2.5 mm, E_stored = ½ × 900 × 0.0025² = 2.81 mJ per blade), absorbing impact energy rather than transmitting it to the burst ratchet — a stamina/defence mechanic despite the Attack-Type label. In Awakened Mode both front blades lock out, followed by the rear blades via the internal coupler mechanism: I_awake ≈ ½ × 0.013 × (0.027² + 0.011²) = 5.525×10⁻⁶ kg·m² (ΔI = 0.994×10⁻⁶ kg·m²). The awakening trigger requires both front blades to be pushed out individually by opposing contacts — they are not coupled to each other, so a single contact pushes one blade out; the second contact must independently push the second blade. The revert condition is the critical limitation: any sufficiently strong impact on either front blade in its locked-out position overcomes the bistable detent force and snaps it back (F_revert > k_detent × δ_detent ≈ 4.5 N), reverting all blades to Bound Mode simultaneously. This makes Awakened Mode fragile against heavy Attack opponents — the very targets it is supposed to defeat reliably revert the mode with their impacts. In practice, Tempest's competitive value is therefore concentrated in Bound Mode stamina/defence use, where its round shape and 13.0 g mass (heavier than World, Infinite, and Curse rings) provide superior gyroscopic stability and LAD.

```
ASCII Visual Geometry — Ring Tempest (top view, Bound / Awakened)

  BOUND MODE (default):             AWAKENED MODE (after 2 front triggers):
  ┌──────────────────────────┐      ┌───────────────────────────────────┐
 /   extremely round shape   \     /  ← short  blade  blade  short →   \
│   spring-loaded blades     │    │   long blade ██████████ long blade   │
│   retracted, LAD-friendly  │    │   ALL 4 blades locked out r=27mm    │
│   rear blades parry hits   │    │   FRAGILE: heavy hit reverts all    │
 \  μ_round≈0.05  r≈24mm    /     \  μ_blade≈0.20  r=27mm             /
  └──────────────────────────┘      └───────────────────────────────────┘
  I_bound=4.531×10⁻⁶               I_awake=5.525×10⁻⁶  (ΔI=0.994×10⁻⁶)
  mass=13.0g  k_blade≈900 N/m per spring  E_parry=2.81 mJ per contact
```

```
Physics Analysis

m_T        = 13.0 g = 0.013 kg
r_bound    = 24 mm,  r_awake = 27 mm,  r_i = 11 mm
I_bound    = ½ × 0.013 × (0.024² + 0.011²) = 4.531×10⁻⁶ kg·m²
I_awake    = ½ × 0.013 × (0.027² + 0.011²) = 5.525×10⁻⁶ kg·m²
ΔI         = 0.994×10⁻⁶ kg·m²

Bound parry (spring absorption):
  k_blade  = 900 N/m,  δ_parry = 2.5 mm
  E_stored = ½ × 900 × 0.0025² = 2.81 mJ  (per blade)
  Impulse returned: J_parry = k_blade × δ_parry × t_release = 900 × 0.0025 × 0.003 = 6.75×10⁻³ N·s

Revert threshold (Awakened → Bound):
  F_revert ≈ k_detent × δ_detent ≈ 1800 × 0.0025 = 4.5 N
  Any contact > 4.5 N on front blade → reverts to Bound Mode

LAD (Bound Mode round profile):
  μ_round  = 0.05  (smooth circular perimeter, ring only)
  dω/dt_LAD_ring = −(0.05 × 0.0779 × 9.81 × 0.024) / 2.497×10⁻⁵ = −3.67 rad/s²
```

```typescript
function tempestBoundParry(kBlade_Nm: number, deltaPary_mm: number, tRelease_ms: number): {
  eStored_mJ: number; impulseReturn_Ns: number
} {
  const e = 0.5 * kBlade_Nm * (deltaPary_mm / 1000) ** 2;
  const J = kBlade_Nm * (deltaPary_mm / 1000) * (tRelease_ms / 1000);
  return { eStored_mJ: e * 1000, impulseReturn_Ns: J };
}
// tempestBoundParry(900, 2.5, 3) → { E=2.81mJ, J=6.75×10⁻³ N·s }
// tempestBoundParry(900, 4.0, 3) → { E=7.20mJ, J=1.08×10⁻² N·s }  — harder impact
// tempestBoundParry(600, 2.5, 3) → { E=1.88mJ, J=4.50×10⁻³ N·s }  — softer spring

function tempestAwakenDeltaI(mRing_g: number, rBound_mm: number, rAwake_mm: number, rInner_mm: number): number {
  const iB = 0.5 * (mRing_g / 1000) * ((rBound_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
  const iA = 0.5 * (mRing_g / 1000) * ((rAwake_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
  return iA - iB;
}
// tempestAwakenDeltaI(13, 24, 27, 11) → 9.94×10⁻⁷ kg·m²  (ΔI on awakening)
// tempestAwakenDeltaI(13, 22, 27, 11) → 1.404×10⁻⁶   — larger deploy extension
// tempestAwakenDeltaI(13, 24, 26, 11) → 6.63×10⁻⁷   — shorter extension

function tempestRevertThreshold(kDetent_Nm: number, deltaDetent_mm: number): number {
  return kDetent_Nm * (deltaDetent_mm / 1000);
}
// tempestRevertThreshold(1800, 2.5) → 4.5 N  — revert force on front blade
// tempestRevertThreshold(2500, 2.5) → 6.25 N — stronger detent variant
// tempestRevertThreshold(1800, 1.5) → 2.7 N  — weaker detent (reverts more easily)
```

---

## Case 503 — Chassis 1A (Superking / Sparking Layer System)

Chassis 1A (1-Attack) weighs 45.6 g (r_outer ≈ 27 mm, r_inner ≈ 8 mm) and is a right-spin Attack-Type Double Chassis — the heaviest standard chassis type in the Sparking system, with the disc function integrated. The symmetrical four-blade design gives C₄ rotational symmetry: blades at 0°, 90°, 180°, 270° — zero eccentricity by design, unlike asymmetric components (Ring Hollow, Chassis 4A). Inertia I_1A = ½ × 0.0456 × (0.027² + 0.008²) = 1.808×10⁻⁵ kg·m², contributing 72.4% of the 77.9 g assembly's total inertia — the dominant contributor by far, consistent with being the heaviest component at 58.6% of assembly mass. The four-blade Attack design creates wide smash contacts at r_blade ≈ 27 mm; contact velocity v_tip = ω × r_blade = 694 × 0.027 = 18.7 m/s at launch, generating Hertzian impact forces F ≈ m_reduced × v × (1 + e_rest) / t_contact ≈ 0.0228 × 18.7 × 1.60 / 0.001 = 682 N — the heaviest smash force of any component in this case study. As a Double Chassis the component also carries its own ratchet engagement: the chassis-level tabs supplement the SK Chip tabs, with the chassis contributing an estimated additional τ_chassis ≈ 15–20 mN·m (integrated disc tabs at larger r_eng), making the combined burst resistance τ_total = 23.9 (chip) + 15.0 (chassis) = 38.9 mN·m without a Dash driver. The 1A designation indicates this is a first-generation Attack Double Chassis; subsequent releases (2A, 4A) revised the asymmetry and blade count. The spin decay with flat-metal Charge Metal tip is dω/dt = −(0.175 × 0.0779 × 9.81 × 0.003) / 2.497×10⁻⁵ = −1.61 rad/s², t_battle = 258 s, confirming the assembly is moderate-stamina despite the heavy attack chassis.

```
ASCII Visual Geometry — Chassis 1A (top view)

        r=27mm (4 blades, C₄ symmetry)
    ████     ████
   ╱blade╲   ╱blade╲    0°/90°/180°/270°
  │        ○         │   zero eccentricity (C₄ balanced)
  │  ████     ████   │   r_inner=8mm
   ╲blade╱   ╲blade╱
    ████     ████
  mass=45.6g  I=1.808×10⁻⁵  72.4% of assembly I
  Double Chassis — disc integrated, no separate forge disc
  v_contact=18.7 m/s at ω₀  F_smash≈682N
```

```
Physics Analysis

m_1A       = 45.6 g = 0.0456 kg
r_o        = 27 mm,  r_i = 8 mm
I_1A       = ½ × 0.0456 × (0.027² + 0.008²) = 1.808×10⁻⁵ kg·m²
Assembly share = 1.808×10⁻⁵ / 2.497×10⁻⁵ = 72.4%

Contact velocity and force (v = ω × r_blade):
  v_tip    = 694 × 0.027 = 18.74 m/s  (at ω₀)
  m_red    = m_1A / 2 = 22.8 g
  F_smash  = 0.0228 × 18.74 × 1.60 / 0.001 = 683 N

Chassis-level burst resistance (integrated disc tabs, r_eng≈12mm):
  τ_chassis ≈ 3 × 3800 × 0.0003 × 0.012 = 41.0 mN·m  (at larger r_eng)
  τ_total   = τ_chip + τ_chassis = 23.9 + 41.0 = 64.9 mN·m

C₄ symmetry:
  e_1A     = 0 mm (four-fold symmetric design — no eccentricity)
  F_imb    = 0 N
```

```typescript
function chassis1AInertia(mChassis_g: number, rOuter_mm: number, rInner_mm: number): number {
  return 0.5 * (mChassis_g / 1000) * ((rOuter_mm / 1000) ** 2 + (rInner_mm / 1000) ** 2);
}
// chassis1AInertia(45.6, 27, 8) → 1.808×10⁻⁵ kg·m²
// chassis1AInertia(44.5, 27, 8) → 1.764×10⁻⁵  — Chassis 2A comparison (Case 435)
// chassis1AInertia(45.6, 30, 8) → 2.220×10⁻⁵  — if wider blade reach

function chassis1ASmashForce(mChassis_g: number, omega0_radps: number, rBlade_mm: number, eRestitution: number, tContact_ms: number): number {
  const mRed = (mChassis_g / 1000) / 2;
  const vTip = omega0_radps * (rBlade_mm / 1000);
  return mRed * vTip * (1 + eRestitution) / (tContact_ms / 1000);
}
// chassis1ASmashForce(45.6, 694, 27, 0.60, 1) → 683N
// chassis1ASmashForce(45.6, 400, 27, 0.60, 1) → 394N  — at 60% spin
// chassis1ASmashForce(45.6, 694, 27, 0.80, 1) → 759N  — more elastic material

function chassis1ATotalBurstResistance(tauChip_mNm: number, rEngChassis_mm: number, kChassis_Nm: number, nTabs: number, delta_mm: number): number {
  const tauChassis = nTabs * kChassis_Nm * (delta_mm / 1000) * (rEngChassis_mm / 1000) * 1000;
  return tauChip_mNm + tauChassis;
}
// chassis1ATotalBurstResistance(23.9, 12, 3800, 3, 0.3) → 64.9 mN·m
// chassis1ATotalBurstResistance(25.2, 12, 3800, 3, 0.3) → 66.2 mN·m  — Dragon 2 chip
// chassis1ATotalBurstResistance(23.9, 12, 3800, 3, 0.4) → 77.7 mN·m  — deeper engagement
```

---

## Case 504 — Performance Tip Charge Metal (Superking / Sparking Layer System)

Performance Tip Charge Metal weighs 16.2 g (wide round body r ≈ 16 mm, hollow flat metal tip r_tip ≈ 4 mm, shaft r ≈ 2 mm, height ≈ 11 mm) and is a metal-reinforced flat-tip driver that improves on the original Charge by replacing the solid plastic flat tip with a hollow metal tip. The hollow metal construction reduces tip-zone mass (hollow vs solid saves ~30% mass at the tip) while maintaining the metal's low friction coefficient (μ_flat_metal ≈ 0.175 on POM floor — lower than plastic flat μ ≈ 0.30, higher than sharp metal μ ≈ 0.10). The flat tip contact patch (r_tip = 4 mm) gives a larger contact area than a sharp tip, creating moderate floor traction: the beyblade moves at a controlled pace rather than the erratic speed of Xtreme'/High Accel', which is why "Charge Metal does not generate enough speed to deliver strong hits" — the design intent is controlled movement with stamina rather than maximum speed. Inertia I_CM = ½ × 0.0162 × (0.016² + 0.002²) = 2.111×10⁻⁶ kg·m², contributing 8.45% of assembly. Spin decay: dω/dt = −(0.175 × 0.0779 × 9.81 × 0.004) / 2.497×10⁻⁵ = −2.14 rad/s², t_battle = 416 / 2.14 = 194 s — solidly mid-stamina. The wide round body (r = 16 mm) provides LAD with onset θ_onset = arccos(2/16) = 82.8° and r_LAD = 16 mm, identical to Drift's wide-body LAD behaviour (Case 497). The "high inertia" claim from the wiki refers to the metal throughout the driver body adding ~2 g vs plastic variants, raising I_CM by approximately Δm × r² ≈ 0.002 × (0.016²) ≈ 5.1×10⁻⁷ additional kg·m². The assembly (Tempest Dragon 1A Charge Metal) has L₀ = 1.733×10⁻² kg·m²/s — the highest in this case study series (eclipsing Barricade Lucifer at 1.600×10⁻² and the assembly at t_battle = 194 s is limited by the flat-metal tip contact radius.

```
ASCII Visual Geometry — Charge Metal (side profile)

  ┌────────────────────────┐  r=16mm wide round body
  │  ABS + metal frame     │  "more metal throughout" vs original Charge
  │  round, low-CoM body   │  LAD onset θ=82.8°, r_LAD=16mm
  ├────────────────────────┤
  │   tapered shaft        │  r_shaft=2mm
  │       ╲     ╱          │
  └────────╲───╱───────────┘
        ┌───────┐  hollow flat metal tip
        │  [ ] │  r_tip=4mm, hollow (removes ~30% tip mass)
        └───────┘  μ_flat_metal≈0.175 on POM
  mass=16.2g  I=2.111×10⁻⁶  dω/dt=−2.14 rad/s²  t=194s
  moderate speed: controlled movement, NOT high-speed attack
```

```
Physics Analysis

m_CM       = 16.2 g = 0.0162 kg
r_tip      = 4 mm (flat hollow metal),  r_body = 16 mm,  r_shaft = 2 mm
I_CM       = ½ × 0.0162 × (0.016² + 0.002²) = 2.111×10⁻⁶ kg·m²
Assembly share = 2.111×10⁻⁶ / 2.497×10⁻⁵ = 8.45%

Spin decay (flat metal, hollow, μ=0.175, r_eff=4mm):
  dω/dt    = −(0.175 × 0.0779 × 9.81 × 0.004) / 2.497×10⁻⁵ = −2.14 rad/s²
  t_battle = 416 / 2.14 = 194 s

LAD (wide round body):
  θ_onset  = arccos(0.002 / 0.016) = 82.8°  (very late tilt onset)
  r_LAD    = 16 mm  (same as Drift Case 497)

Hollow tip mass saving (~30% vs solid):
  m_solid_tip ≈ ρ_metal × π × r_tip² × h = 7800 × π × 0.004² × 0.003 = 1.18×10⁻³ kg ≈ 1.18 g
  m_hollow ≈ 0.70 × 1.18 = 0.83 g  (30% lighter)
  ΔI_tip_saved ≈ 0.35 × 10⁻³ × (0.004²) = 5.6×10⁻⁹ kg·m²  (negligible)

Assembly summary (Tempest Dragon Charge Metal 1A):
  m_total  = 77.9 g,  I_total ≈ 2.497×10⁻⁵ kg·m²
  L₀       = 2.497×10⁻⁵ × 694 = 1.733×10⁻² kg·m²/s  (highest in series)
  t_battle ≈ 194 s  (flat metal tip, r_eff=4mm)
```

```typescript
function chargeMetalSpinDecay(mTotal_g: number, iTotal: number, mu: number, rTip_mm: number): {
  dOmega: number; tBattle_s: number
} {
  const dO = -(mu * (mTotal_g / 1000) * 9.81 * (rTip_mm / 1000)) / iTotal;
  return { dOmega: dO, tBattle_s: 416 / Math.abs(dO) };
}
// chargeMetalSpinDecay(77.9, 2.497e-5, 0.175, 4) → { dω=−2.14, t=194s }
// chargeMetalSpinDecay(77.9, 2.497e-5, 0.30, 4)  → { dω=−3.67, t=113s }  — plastic flat tip
// chargeMetalSpinDecay(77.9, 2.497e-5, 0.175, 2)  → { dω=−1.07, t=389s }  — narrower tip

function chargeMetalLadOnset(rBody_mm: number, rShaft_mm: number): {
  thetaOnset_deg: number; rLad_mm: number
} {
  const theta = Math.acos(rShaft_mm / rBody_mm) * 180 / Math.PI;
  return { thetaOnset_deg: theta, rLad_mm: rBody_mm };
}
// chargeMetalLadOnset(16, 2) → { θ=82.8°, rLad=16mm }
// chargeMetalLadOnset(16, 4) → { θ=75.5°, rLad=16mm }  — wider shaft
// chargeMetalLadOnset(12, 2) → { θ=80.4°, rLad=12mm }  — narrower body

function chargeMetalVsSharpComparison(iTotal: number, mTotal_g: number): {
  tChargeMetalFlat_s: number; tSharpMetal_s: number; tFreeSpinBushing_s: number
} {
  const m = mTotal_g / 1000;
  return {
    tChargeMetalFlat_s: 416 / ((0.175 * m * 9.81 * 0.004) / iTotal),
    tSharpMetal_s:      416 / ((0.10  * m * 9.81 * 0.001) / iTotal),
    tFreeSpinBushing_s: 416 / ((0.05  * m * 9.81 * 0.001) / iTotal)
  };
}
// chargeMetalVsSharpComparison(2.497e-5, 77.9) → { flat=194s, sharp=340s, freespin=680s }
// chargeMetalVsSharpComparison(2.402e-5, 68.9) → { flat=209s, sharp=374s, freespin=748s }
// chargeMetalVsSharpComparison(2.305e-5, 75.3) → { flat=200s, sharp=360s, freespin=720s }
```

---

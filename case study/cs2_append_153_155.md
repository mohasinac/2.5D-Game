
---

## Case 153 — Sharp Core RC (~1.5 g [ESTIMATED], Hasbro HMS beys) — Basic Sharp-Tip Running Core with Mold-Dependent Sharpness: Hasbro Ball-Shaped vs SonoKong Pointed, Both Below Flat Core Performance

### 1. Geometry

Sharp Core is a basic sharp-tipped Running Core with no mechanical gimmick. Its primary characteristic is its tip shape: a single sharp plastic point that produces low ground contact area, resulting in slow, centered movement with minimal floor friction. The RC body is a standard ABS housing with no metal elements and no mode-change mechanism.

**Critical mold difference:** Sharp Core exhibits the most pronounced brand-dependent mold variation of any HMS RC:
- **Hasbro version:** the tip is "noticeably less sharp — more of a ball shape." This moves behavior closer to a Semi-Flat tip than a true sharp point. Hasbro's molding tolerance or intentional safety rounding produces a tip that is functionally a rounded-sharp hybrid.
- **SonoKong version:** "even more pointed" than expected for a sharp tip. The SonoKong mold delivers a genuinely needle-like contact point, producing the lowest possible floor friction among HMS RCs.

Despite this difference, both versions share the same competitive verdict: Sharp Core is below Flat Core in competitive relevance because a sharp tip in HMS (where beys spin very fast and arena diameter is small) produces too-centered movement for attack use and insufficient spin retention for survival use. It occupies no competitive niche.

**Weight:** estimated ~1.5 g based on: Flat Core Original ≈ 1.5 g (from Case 148); Sharp Core has a similar ABS-only plastic body without metal ballast. No exact weight confirmed from any source [ESTIMATED].

### 2. Physics

```
Tip contact model:
  tipType: "sharp_point"
  tipRadius_mm: 0.5 (SonoKong)  /  1.5 (Hasbro — rounded ball tip)   [ESTIMATED]
  mu_tip: 0.08 (SonoKong)  /  0.12 (Hasbro)                          [ESTIMATED]

Floor friction torque:
  τ_friction = μ × F_normal × r_tip
  SonoKong: τ = 0.08 × F_N × 0.0005 → near-zero torque → extremely slow spin decay
  Hasbro:   τ = 0.12 × F_N × 0.0015 → still low, but slightly more grounded

Movement type:
  Both: near-stationary center-point movement (too little friction for orbital drive)
  SonoKong: slightly more prone to drifting outward at launch (low μ less able to anchor)
  Hasbro:   slightly more stable at center due to rounded contact spreading load

Spin retention:
  spinDecayRate ≈ 0.003 rad/s² (SonoKong)  /  0.005 rad/s² (Hasbro)   [ESTIMATED]
  Both: lower spin decay than Semi-Flat Core → marginally better stamina than Semi-Flat
  Both: dramatically below Bearing Core (≈ 0.0005 rad/s²) for survival use
```

### 3. Game Engine Mapping

```typescript
type SharpCoreBrand = "hasbro" | "sonokong";
interface SharpCore {
  name: "sharp_core";
  system: "HMS";
  mass_g: 1.5;                           // [ESTIMATED — ABS-only body, no metal]
  tipType: "sharp";
  // Brand-dependent tip geometry
  brand: SharpCoreBrand;
  tipRadius_mm: {
    hasbro: 1.5;                         // rounded ball shape [FACT(behavior)]
    sonokong: 0.5;                        // more pointed [FACT(behavior)]
  };
  mu: {
    hasbro: 0.12;                        // [ESTIMATED]
    sonokong: 0.08;                       // [ESTIMATED]
  };
  spinDecayRate_rads2: {
    hasbro: 0.005;                       // [ESTIMATED]
    sonokong: 0.003;                      // [ESTIMATED]
  };
  movementType: "near_stationary_center";
  competitiveTier: "non_competitive";    // no competitive niche in HMS
  vsFlat: "worse_for_attack";            // Flat Core generates orbital drive; Sharp does not
  vsBearing: "worse_for_survival";       // Bearing Core 2 spin retention >> Sharp Core
  vsMetalSemiFlat: "slight_stamina_advantage"; // marginally lower spin decay than Semi-Flat
  mold_note: "most pronounced brand mold variation in HMS RC lineup";
}
function sharpCoreMovement(rc: SharpCore, brand: SharpCoreBrand): "center" | "drift" {
  // Both brands stay near center; SonoKong has slightly higher drift at launch due to low μ
  return brand === "sonokong" && Math.random() < 0.15 ? "drift" : "center";
}
```

### 4. Verdict

**Role:** Non-competitive sharp-tip baseline. Sharp Core occupies the HMS RC hierarchy below all other options: it lacks the orbital drive of Flat Cores (attack), the friction control of Grip Flat Core (aggressive attack), the gimmick of Metal Change Core (mode-switch), or the spin retention of Bearing Core (survival). The Hasbro vs SonoKong mold difference is the most notable aspect of this RC — it is a case study in how brand-specific manufacturing tolerances create functionally different parts from nominally identical designs. No competitive HMS build uses Sharp Core. Tier: non-competitive.

---

## Case 154 — Metal Sharp Core RC (~2.5 g [ESTIMATED], SonoKong Three Kingdoms HMS) — Metal-Tipped Sharp Core with Three Kingdoms "Completely Flat" Variant: Higher Mass Than Sharp Core, Still Below Competitive Threshold

### 1. Geometry

Metal Sharp Core is a sharp-tipped Running Core with a metal shaft/tip replacing the all-plastic construction of Sharp Core (Case 153). The metal tip provides higher durability than the plastic Sharp Core, and the additional metal mass raises the RC weight to approximately 2.5 g [ESTIMATED — metal adds ~1 g over Sharp Core's ~1.5 g body].

**Three Kingdoms variant anomaly:** hmsdb.com notes that Metal Sharp Core versions found in Three Kingdoms HMS sets have "completely flat" tips rather than the sharp tip implied by the name. This creates a paradox: the "Metal Sharp Core" in these releases is functionally a "Metal Flat Core" tip on the Metal Sharp Core body. The Three Kingdoms flat variant has higher ground friction than true-sharp variants and behaves more like Metal Weight Flat Core (Case 150) with lower mass.

**Source context:** Metal Sharp Core appears in SonoKong and Korean-market HMS releases, including the Three Kingdoms series. It is less common than Sharp Core in standard Hasbro/Takara releases.

**Competitive position:** Metal Sharp Core is described on hmsdb as "behaves like taller Metal Flat Core" for the standard (non-Three Kingdoms) version. If the tip is truly sharp, movement is near-stationary (same as Sharp Core but harder). If the tip is the Three Kingdoms flat variant, it approximates Metal Weight Flat Core behavior but at lower mass — still below Flat Core New Revision (Case 149) for attack applications.

### 2. Physics

```
Standard variant (sharp tip):
  tipType: "metal_sharp"
  tipRadius_mm: 0.8   [ESTIMATED — metal allows sharper mold tolerance than plastic]
  mu_metal_sharp: 0.06  [ESTIMATED — metal on plastic, very low friction]
  spinDecayRate ≈ 0.002 rad/s²  [ESTIMATED — lower decay than plastic sharp due to metal hardness]
  movementType: "near_stationary_center" (same archetype as Sharp Core, harder surface)

Three Kingdoms flat variant:
  tipType: "metal_flat"  (despite the name)
  tipRadius_mm: 4.0   [ESTIMATED — flat face approximated as radius of flat disk contact]
  mu_metal_flat: 0.14  [ESTIMATED — metal flat on plastic, moderate friction]
  spinDecayRate ≈ 0.012 rad/s²  [ESTIMATED]
  movementType: "orbital_drive_moderate"
  → approximates Metal Weight Flat Core (Case 150) at lower mass → slightly less controllable

Height comparison:
  Metal Sharp Core is taller than Bearing Core (Case 84) by ~1–2 mm [FACT(behavior)]
  Taller RC = slightly higher pivot point → marginally more tilt-stable
```

### 3. Game Engine Mapping

```typescript
type MetalSharpCoreVariant = "standard_sharp" | "three_kingdoms_flat";
interface MetalSharpCore {
  name: "metal_sharp_core";
  system: "HMS";
  mass_g: 2.5;                           // [ESTIMATED — metal tip adds ~1g over Sharp Core]
  variant: MetalSharpCoreVariant;
  // Standard variant (sharp tip)
  standard: {
    tipType: "metal_sharp";
    tipRadius_mm: 0.8;                   // [ESTIMATED]
    mu: 0.06;                            // [ESTIMATED]
    spinDecayRate_rads2: 0.002;          // [ESTIMATED]
    movementType: "near_stationary_center";
    desc: "behaves like taller Metal Flat Core [per hmsdb] — but at this tip radius, movement is center-biased";
  };
  // Three Kingdoms variant (flat tip despite name)
  three_kingdoms: {
    tipType: "metal_flat";               // [FACT(hmsdb)] — "completely flat" tips
    tipRadius_mm: 4.0;                   // [ESTIMATED]
    mu: 0.14;                            // [ESTIMATED]
    spinDecayRate_rads2: 0.012;          // [ESTIMATED]
    movementType: "orbital_drive_moderate";
    desc: "approximates Metal Weight Flat Core at lower mass; less controllable";
  };
  heightNote: "taller than Bearing Core by ~1-2mm; slightly higher CoM";
  competitiveTier: "non_competitive";    // below Flat Core New Revision for attack; below Bearing for survival
  origin: "SonoKong / Korean market HMS (Three Kingdoms series)";
  mold_note: "Three Kingdoms variant name mismatch — Metal Sharp Core sold with flat tip";
}
function metalSharpCoreMovement(rc: MetalSharpCore): "center" | "orbital" {
  return rc.variant === "three_kingdoms_flat" ? "orbital" : "center";
}
```

### 4. Verdict

**Role:** Non-competitive metal-tipped sharp RC. Metal Sharp Core improves on Sharp Core's durability (metal tip) and marginally improves spin retention (mu = 0.06 vs 0.08 for SonoKong Sharp), but remains non-competitive. The Three Kingdoms flat-tip variant is the more practically useful version — it approximates orbital drive at lighter mass than Metal Weight Flat Core — but both variants are outclassed by confirmed competitive RCs (Flat Core New Revision for attack, Bearing Core 2 for survival). Primarily of interest as a regional/collector variant for SonoKong Three Kingdoms HMS sets. Tier: non-competitive.

---

## Case 155 — Semi-Flat Core RC (~2 g [ESTIMATED], Driger MS A-124) — First Balance-Style HMS Running Core: Ambidextrous Aggression Level Depending on Launch Style, Distinct from Metal Semi-Flat Core

### 1. Geometry

Semi-Flat Core is the first "balance" style Running Core in the HMS series, found in Driger MS (A-124). It is a basic ABS plastic RC with a semi-flat tip — a profile between sharp (very little ground contact) and flat (maximum ground contact). The semi-flat shape produces moderate ground friction, allowing the bey to either orbit aggressively or sit more centred depending on launch technique.

**This RC is distinct from Metal Semi-Flat Core (Case 87):** Metal Semi-Flat Core (from Advance Averazer) has a die-cast metal tip, wider dome profile, and weighs approximately 3 g. Semi-Flat Core (from Driger MS) is all-ABS plastic with a smaller semi-flat profile and weighs approximately 2 g [ESTIMATED]. The metal tip on Metal Semi-Flat Core provides a wider, slower contact; the plastic Semi-Flat Core's smaller tip is slightly less damped.

**Launch-style dependence (key feature):** "can function as both mildly aggressive and docile depending on launch style." This means:
- Hard power launch → more aggressive orbital movement (semi-flat tip grips the floor at higher spin speed)
- Soft/angled launch → more centred, docile movement (lower spin speed = lower centrifugal force pressing tip against floor)

This adaptability is Semi-Flat Core's distinguishing property vs other HMS RCs, which have more fixed behavior profiles.

**Limitation:** "lacks the performance of more specialized cores available later in the HMS lineup." Semi-Flat Core is an early HMS RC — the Metal Change Core (Case 134), Bearing Core 2 (Case 152), and Flat Core New Revision (Case 149) all outperform it in their respective roles.

### 2. Physics

```
Tip contact model:
  tipType: "semi_flat_plastic"
  tipRadius_mm: 2.5   [ESTIMATED — between flat 4mm and sharp 0.5mm]
  mu_plastic: 0.20    [ESTIMATED — ABS semi-flat on floor plastic, moderate friction]

Movement model — launch-speed dependent:
  High launch spin (ω ≥ 400 rad/s):
    F_centrifugal presses tip harder → μ_eff ≈ 0.22
    movementType: "mild_orbital_aggressive"
    orbitRadius_m: 0.04–0.06  [ESTIMATED]
  Low launch spin (ω < 300 rad/s):
    F_centrifugal weaker → μ_eff ≈ 0.17
    movementType: "centre_docile"

spinDecayRate ≈ 0.010 rad/s²  [ESTIMATED — plastic semi-flat, moderate floor drag]
vs Metal Semi-Flat Core (Case 87):
  Metal Semi-Flat: metal tip, wider dome, ~3g → slower docile movement, better Compact use
  Semi-Flat Core:  plastic tip, smaller dome, ~2g → mildly faster orbit when launched hard
```

### 3. Game Engine Mapping

```typescript
interface SemiFlatCore {
  name: "semi_flat_core";
  system: "HMS";
  sourceBey: "Driger MS (A-124)";
  mass_g: 2.0;                           // [ESTIMATED — all-ABS, smaller than Metal Semi-Flat]
  tipType: "semi_flat_plastic";
  tipRadius_mm: 2.5;                     // [ESTIMATED]
  mu: 0.20;                              // [ESTIMATED]
  spinDecayRate_rads2: 0.010;            // [ESTIMATED]
  // Launch-style-dependent behavior
  launchDependent: true;
  movementType: {
    hard_launch: "mild_orbital";         // ω ≥ 400 rad/s → moderate orbital drive
    soft_launch: "center_docile";        // ω < 300 rad/s → centered, slow
  };
  vsMetalSemiFlatCore: {
    material: "plastic_vs_metal_tip",    // both named "semi-flat"; fundamentally different tips
    mass: "lighter_2g_vs_3g",
    movement: "slightly_faster_orbit_when_hard_launched",
    competitiveRole: "both_non_competitive_outside_compact";
    caseRef: 87;                         // Metal Semi-Flat Core covered in Case 87
  };
  competitiveTier: "non_competitive_outside_compact";
  note: "first HMS balance-style RC; outperformed by all later specialized HMS RCs";
  distinctFrom: "metal_semi_flat_core";  // Case 87 — different part, different tip material
}
function semiFlatMovement(rc: SemiFlatCore, launchOmega_rads: number): "mild_orbital" | "center_docile" {
  return launchOmega_rads >= 400 ? "mild_orbital" : "center_docile";
}
```

### 4. Verdict

**Role:** Non-competitive outside Compact; historical HMS balance-RC baseline. Semi-Flat Core is notable as the first HMS RC to offer launch-technique-dependent behavior — a property that would be refined in later RCs (Metal Change Core's auto-switch, Manual Change Core's pre-battle modes). In Compact builds with Driger MS, Semi-Flat Core's docile mode provides stability, but Metal Semi-Flat Core (Case 87) supersedes it with a heavier metal-tip damping profile. The plastic semi-flat tip ages faster than metal, and the ~2 g mass contributes little to assembly inertia. Do not mistake Semi-Flat Core (plastic, Driger MS) for Metal Semi-Flat Core (metal, Advance Averazer) — they are different parts from different beys with different competitive contexts. Tier: non-competitive.

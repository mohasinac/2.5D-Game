---

## Case 140 — CWD Defense Ring (Sea Dragon MS / RBA2) — ~19 g [ESTIMATED] — Near-Circular Top-Tier CWD: Peer to CWD God Ring, Universal Archetype Compatibility

### 1. Geometry

CWD Defense Ring is the Customize Weight Disk of Sea Dragon MS (RBA2 — Random Booster Act 2). ABS plastic, approximately 19 g [ESTIMATED — from hmsdb.com/initial-releases/rba2-sea-dragon]. Profile: "very conservative, circular, and weighty" (hmsdb). Near-circular outer perimeter — minimal asymmetry, near-uniform mass distribution. The only CWD in HMS with a profile equivalent to CWD God Ring (Case 131, ~18 g, Shining God MS). Competitively, both Defense Ring and God Ring occupy the same tier.

Also referred to as "CWD Free Defense Ring" in combo recommendations — the "Free" prefix indicates the free-spin mounting common to all HMS CWDs.

### 2. Physics

**Moment of inertia:**
Near-circular ring profile, r_outer ≈ 23 mm, r_inner ≈ 19 mm:

    I_DefenseRing ≈ (0.019/2)(0.023² + 0.019²) ≈ 3.65 × 10⁻⁶ kg·m²

The 1g mass advantage over God Ring (19g vs 18g) at the same outer radius:

    ΔI ≈ 0.001 × (0.021²) ≈ 4.4 × 10⁻⁷ kg·m²
    Defense Ring I ≈ 3.65 × 10⁻⁶ vs God Ring ≈ 3.5 × 10⁻⁶ — marginal advantage (~4%)

**Spin decay improvement over Circle Heavy baseline:**
Circle Heavy: I ≈ 3.0 × 10⁻⁶ kg·m²
Defense Ring: I ≈ 3.65 × 10⁻⁶ kg·m²

    Improvement: (3.65 - 3.0) / 3.0 ≈ 22% slower spin decay vs Circle Heavy

**"Perfectly viable across all archetypes" (hmsdb):**
- Attack: High I ring doesn't hurt attack; its near-circular profile provides no recoil-causing geometry.
- Defense: Smooth circular perimeter deflects attacks tangentially rather than catching them.
- Stamina: Maximum I per gram for HMS CWDs — best sustained spin.
- Upper Attack: Near-circular profile doesn't create height steps that reduce upper-attack clearance.

**Seagon Attacker synergy note:**
Sea Dragon's AR (Seagon Attacker, Case 88) is an upper-attack AR. Defense Ring's near-circular profile provides no cross-contamination of the upper-attack geometry — combining upper AR + neutral CWD is architecturally correct (cf. Devil Crusher + God Ring in Case 131).

### 3. Game Engine Mapping

```typescript
interface CWDDefenseRing {
  name: "cwd_defense_ring";
  aliases: ["cwd_free_defense_ring"];
  system: "HMS";
  sourceBey: "Sea Dragon MS (RBA2)";
  mass_g: 19;                          // [ESTIMATED]
  profile: "near_circular";
  outerRadius_mm: 23;
  innerRadius_mm: 19;
  momentOfInertia_kgm2: 3.65e-6;
  spinDecayImprovementVsCircleHeavy: 0.22;
  competitiveTier: "high";
  equivalentPart: "cwd_god_ring";      // functionally peer; Defense Ring ~4% higher I
  universalArchetype: true;            // viable in attack, defense, stamina, upper
  recommendedCombos: [
    "jiraiya_blade + cwd_defense_ring + grip_flat_core_ultimate",
    "samurai_upper + cwd_defense_ring + bearing_core_2"
  ];
}
```

### 4. Verdict

**Role:** Top-tier HMS CWD — peer to CWD God Ring. Defense Ring is the original top-tier circular HMS CWD, predating God Ring by several releases. Both are mechanically equivalent: near-circular, near-19g, I ≈ 3.5–3.65 × 10⁻⁶ kg·m². The Defense Ring's marginally higher mass (~1g more) gives it a fractional I edge. Obtain from Sea Dragon MS (RBA2). Recommended in the best HMS combos (Jiraiya Blade + Defense Ring + Grip Flat Core Ultimate = one of the top three HMS attack customs). Tier: HIGH.

---

## Case 141 — Metal Upper AR (Driger MS / A-124) — ~20 g [ESTIMATED] — Rei's HMS Upper: Paired Spiral Slopes, Narrower Window than Spiral Upper, Right-Spin Primary

### 1. Geometry

Metal Upper is the HMS Attack Ring of Driger MS (A-124, Rei Kon's HMS bey). Weight: ~20 g [ESTIMATED — from hmsdb.com/initial-releases/a-124-driger-ms]. Zinc-alloy metal frame bonded to ABS caul. Upper-attack orientation: the metal frame carries paired forward-swept slopes on each face.

Note from hmsdb attack-ring-variations page: Metal Upper has mold variants. The "upper" in the name is confirmed by the attack type listed — it is an upper-attack AR, not a smash AR. Paired slopes implies two contact faces per revolution rather than Spiral Upper's continuous spiral arc.

### 2. Physics

**Paired slope upper attack (right-spin primary):**
Two slope faces per half-revolution (estimated from "paired" description). Each slope face at α_upper ≈ 30°:

    Upper fraction per face = sin(30°) = 0.500
    Contact arc per face ≈ 55–65° (vs Spiral Upper's 170° omnidirectional)

Effective upper-attack window: 2 × 60° = 120° per revolution — better than single-slope ARs but inferior to Spiral Upper (170°+).

**Comparison with Spiral Upper (Case 125, ~20g):**
| AR | Weight | Upper Window | Architecture |
|----|--------|-------------|--------------|
| Spiral Upper | ~20g | ~170° (omnidirectional) | Continuous spiral slope |
| Metal Upper | ~20g | ~120° (paired slopes) | Two discrete slope faces |

At equal weight, Spiral Upper's omnidirectional contact window is superior. Metal Upper is a viable second-choice upper-attack AR when Spiral Upper is unavailable.

**Left-spin consideration:**
Reversed slope contact in LS: slope leading-face reverses. The paired slopes become trailing-edge contacts — glancing rather than upper-attack. Left-spin produces lower-angle tangential contact:

    LS smash fraction ≈ sin(15°) ≈ 0.259 (trailing edge from reversed slope)
    Not a viable LS combat AR — use RS only

**Mold variants:**
hmsdb confirms mold variants exist. Without weight data for each mold variant, treat as same performance range (~20g ± 0.5g).

### 3. Game Engine Mapping

```typescript
interface MetalUpperAR {
  name: "metal_upper";
  system: "HMS";
  sourceBey: "Driger MS (A-124)";
  mass_g: 20;                          // [ESTIMATED]
  attackType: "upper";
  upperFractionRS: 0.500;              // sin(30°) per slope face
  contactWindowRS_deg: 120;            // 2 × ~60° faces vs Spiral Upper's 170°
  smashFractionLS: 0.259;             // trailing edge LS — not viable
  primarySpin: "right";
  moldVariants: true;
  comparedToSpiralUpper: {
    weight: "equal",
    upperWindow: "lower_by_50deg",
    verdict: "second_choice_upper_ar"
  };
  competitiveTier: "mid";
}
```

### 4. Verdict

**Role:** Second-tier HMS Upper Attack AR. Metal Upper shares Spiral Upper's weight class (~20g) and upper-attack orientation but with a narrower effective contact window (120° vs 170°). Right-spin primary; left-spin is low-value trailing contact only. A credible donor for upper-attack builds when Spiral Upper (Dranzer MS) or Samurai Upper (MA-20) are unavailable. Tier: mid — functional upper-attack AR, outclassed by both Spiral Upper and Samurai Upper in coverage, but usable and accessible from Driger MS (A-124, Initial Release).

---

## Case 142 — Jiraiya Blade AR (Jiraiya MS / MA-22) — ~22 g [ESTIMATED] — Heaviest HMS AR: Symmetric Dual-Spin Rotational Smash, Top-Tier Attack

### 1. Geometry

Jiraiya Blade is the Attack Ring of Jiraiya MS (MA-22, Gimmick Specialty Series). Weight: ~22 g [ESTIMATED — from hmsdb.com/gimmick-specialty-series/ma-22-jiraiya-ms]. At ~22g, Jiraiya Blade is the heaviest known HMS AR — 2g above Spiral Upper (~20g) and 4g above God Smasher (18g). The AR is described as "symmetrical, heavy, and a very powerful Attack-oriented AR" (hmsdb) with "considerable amount of Rotational Smash" and performance "similarly well in left-spin as it does in right-spin."

The name "Jiraiya Blade" and symmetrical design suggest multiple blade-edge contacts evenly distributed — true spin-direction symmetry (equal performance RS and LS is the rarest property in HMS ARs).

### 2. Physics

**Rotational smash at maximum AR mass:**
At 22g concentrated in metal frame at r ≈ 22 mm:

    I_AR ≈ 0.022 × (0.022)² ≈ 1.06 × 10⁻⁵ kg·m²

This is the highest AR inertia contribution in HMS. During smash contact, the AR's inertia resists self-recoil:

    ΔΩ_self ∝ 1 / (I_AR + I_WD + I_RC) → more AR mass = less self-deflection per hit

At 22g AR vs 18g God Smasher:

    Recoil reduction: Δ(4g) × (0.022)² / I_combo ≈ 1.9 × 10⁻⁶ / 2.5×10⁻⁵ ≈ 7.7% less self-deflection per hit

**Symmetric dual-spin smash:**
"Performs similarly well in left-spin as it does in right-spin" — symmetrical blade geometry means no preferred spin direction for smash delivery:

    Smash fraction RS ≈ smash fraction LS (hmsdb confirms)
    Estimated α_smash ≈ 28° (symmetric blade): sin(28°) ≈ 0.469 each direction

This dual-spin symmetry makes Jiraiya Blade uniquely versatile for counter-spin combos.

**Wear dependency:**
hmsdb notes: "performs noticeably worse on worn Grip Flat Core RC." Jiraiya Blade's high contact mass needs a fast-moving flat-tip RC to achieve sufficient orbital speed — worn rubber reduces attack velocity below Jiraiya Blade's kinematic threshold. Use only with mint or near-mint Grip Flat Core (Ultimate Mode preferred).

### 3. Game Engine Mapping

```typescript
interface JiraiyaBladeAR {
  name: "jiraiya_blade";
  system: "HMS";
  sourceBey: "Jiraiya MS (MA-22)";
  mass_g: 22;                          // [ESTIMATED]
  smashFractionRS: 0.469;              // sin(28°) symmetric blades
  smashFractionLS: 0.469;             // EQUAL RS/LS — dual-spin symmetric
  outerRadius_mm: 22;
  momentOfInertia_AR: 1.06e-5;        // heaviest HMS AR — maximum AR inertia
  selfRecoilReduction: 0.077;         // 7.7% less deflection vs God Smasher per hit
  wearSensitive: true;                // needs mint Grip Flat Core for full output
  pairedRC: "grip_flat_core_ultimate";
  pairedCWD: "cwd_defense_ring";
  competitiveTier: "high";
  spinDirectionBias: "none";          // true dual-spin
  recommendedCombo: "jiraiya_blade + cwd_defense_ring + grip_flat_core_ultimate";
}

function jiraiyaBladeEffectiveness(
  rcCondition: "mint" | "worn",
  spinDir: "right" | "left"
): number {
  const baseFraction = 0.469;
  const wornPenalty = rcCondition === "worn" ? 0.25 : 0;
  // symmetric — spinDir doesn't change output
  return baseFraction * (1 - wornPenalty);
}
```

### 4. Verdict

**Role:** Top-tier HMS Smash AR. Jiraiya Blade is the heaviest HMS AR at ~22g, delivering the highest AR-level inertia contribution in the system. Its symmetric blade geometry produces equal smash output in both spin directions — a rarity in HMS. The recommended combo (Jiraiya Blade + CWD Defense Ring + Grip Flat Core Ultimate) is one of the highest-rated HMS attack customs. Weakness: wear-sensitive — performance degrades significantly on worn rubber RCs. Always pair with mint-condition Grip Flat Core. Tier: HIGH.

---

## Case 143 — Metal Ape AR (Magical Ape MS / MA-18) — ~19 g [ESTIMATED] — Ape-Motif Upper Attack: Shared Mass Class, Mid-Tier Gimmick Specialty AR

### 1. Geometry

Metal Ape is the Attack Ring of Magical Ape MS (MA-18, Gimmick Specialty Series). Weight: ~19 g [ESTIMATED — from hmsdb.com/gimmick-specialty-series/ma-18-magical-ape-ms]. Same mass class as Devil Crusher (~19g), Knight Crusher (19g [FACT]), and God Smasher (18g [FACT]). Primate-themed ABS caul over zinc-alloy frame.

Primary competitive value of MA-18: the Flat Core (New Revision) RC that ships with it (Case 149) — the "strictly better" flat core revision. Metal Ape AR is a secondary consideration.

### 2. Physics

**19g shared mass class:**
Metal Ape joins Devil Crusher, Knight Crusher, and Upper Dragon in the ~19g HMS AR tier. Without detailed blade geometry data beyond "upper attack" designation, the analysis uses mass and architecture class:

    I_AR ≈ 0.019 × (0.021)² ≈ 8.4 × 10⁻⁶ kg·m² (same as Upper Dragon estimate)

**Upper-attack archetype:**
Magical Ape MS's AR name contains no "smash" or "crusher" descriptor — the "Ape" imagery and MA series positioning suggests an upper-attack or multi-type AR rather than pure smash. Given its place in the Gimmick Specialty line, it likely shares framework similarities with the upper-attack family (Upper Dragon / Upper Fox / Devil Crusher).

**Competitive position:**
Without detailed slope-angle data from physical measurement: Metal Ape AR is a mid-tier upper-attack AR at ~19g. Neither the worst (Knight Crusher) nor the best (Samurai Upper, Spiral Upper) in its category. Harvest value priority: Flat Core (New Revision) RC first; Metal Ape AR as secondary donor.

### 3. Game Engine Mapping

```typescript
interface MetalApeAR {
  name: "metal_ape";
  system: "HMS";
  sourceBey: "Magical Ape MS (MA-18)";
  mass_g: 19;                          // [ESTIMATED]
  attackType: "upper";                 // INFERRED from name/series position
  upperFraction: 0.45;                 // [ESTIMATED — typical HMS upper-attack range]
  outerRadius_mm: 21;
  competitiveTier: "mid";
  primaryHarvestValue: "flat_core_new_revision";  // RC is the real prize
  note: "Detailed blade geometry needs physical measurement for precise smash/upper fractions";
}
```

### 4. Verdict

**Role:** Mid-tier HMS upper-attack AR. Metal Ape AR occupies the ~19g upper-attack class but lacks the contact-window advantages of Spiral Upper or Samurai Upper. Acquire Magical Ape MS primarily for the Flat Core (New Revision) RC — the "strictly better" flat core that is the main competitive harvest. Metal Ape AR is a usable upper-attack substitute when better ARs aren't available. Tier: mid.

---

## Case 144 — Spark Dragon AR (Thunder Dragon / RBA1) — ~14 g [ESTIMATED] — Free-Spinning Plastic + Narrow Metal Frame: Width Without Contact, Non-Competitive

### 1. Geometry

Spark Dragon is the Attack Ring of Thunder Dragon (RBA1 — Random Booster Act 1). Weight: ~14 g total [ESTIMATED — hmsdb.com/initial-releases/rba1-thunder-dragon]: metal piece ~10g (narrower than Circle Heavy in diameter), free-spinning plastic component ~4g. The plastic component is attached to the metal frame but rotates freely — the same failure architecture as CWD Devil Saucer (Case 132) and CWD Chain Attacker (Case 46): free-spinning parts dissipate impact energy instead of delivering it.

Spark Dragon also reportedly included "thin pieces of sandpaper and flint" on original releases — a decorative novelty gimmick that produces sparks but has no combat relevance.

### 2. Physics

**Free-spinning plastic dissipation:**
On contact with opponent AR, the outer plastic component of Spark Dragon rotates freely:

    Impact torque → rotates plastic shell → Δω_shell = τ / I_plastic
    Effective impulse to opponent ≈ F_N × μ_plastic_on_plastic × Δt

At μ ≈ 0.30 (ABS-on-ABS) vs μ ≈ 0.15 (zinc-on-ABS for metal contact):

    Impulse ratio = μ_plastic / μ_metal ≈ 0.30 / 0.15 = 2.0 (higher friction) BUT
    The free-spin absorbs the rotational shock — shell spins away, body continues unimpeded

Net delivered impulse to opponent is governed by inelastic coupling:

    ΔJ_opponent ≈ (1 - e_freespin) × J_contact ≈ 0.1 × J_contact

~90% of impact energy goes into spinning up the free plastic shell. Only ~10% reaches the opponent.

**Metal frame too narrow:**
"Central metal piece no wider than a Circle Heavy" — the metal ring is not at the outer perimeter. Attack radius for the metal contact: r_metal ≈ 16–17mm vs typical HMS AR outer radius 22–23mm. Reduced attack reach means many opponent AR contacts happen at the plastic shell (free-spinning) before reaching the narrow metal ring.

**Verdict from hmsdb:** "utterly useless" for competitive play across all archetypes.

### 3. Game Engine Mapping

```typescript
interface SparkDragonAR {
  name: "spark_dragon";
  system: "HMS";
  sourceBey: "Thunder Dragon (RBA1)";
  mass_g: 14;                          // [ESTIMATED total]
  metalFrame_g: 10;
  plasticShell_g: 4;
  plasticShell_freeSpin: true;
  effectiveImpulseRatio: 0.10;        // 90% energy lost to free-spin shell
  metalFrameRadius_mm: 17;            // narrow — no wider than Circle Heavy
  outerPlasticRadius_mm: 23;
  sparkGimmick: true;                 // decorative only; no combat effect
  competitiveTier: "non_competitive";
  harvestValue: "cwd_free_survivor_or_saucer"; // CWDs are the actual prize
}
```

### 4. Verdict

**Role:** Non-competitive. Spark Dragon's free-spinning plastic shell absorbs 90% of impact energy; the narrow metal ring inside never reaches standard AR contact radius. The sandpaper/flint spark gimmick is purely visual. Tier: F. Acquire Thunder Dragon (RBA1) exclusively for the CWD Free Survivor / CWD Free Saucer WDs it includes — not for this AR.

---

## Case 145 — CWD Free Cross (Jiraiya MS / MA-22) — ~17 g [ESTIMATED] — Cross-Shaped CWD: Asymmetric Four-Arm Profile, Attack-Supplemental Role

### 1. Geometry

CWD Free Cross is Jiraiya MS's (MA-22) Customize Weight Disk. Weight: ~17g [ESTIMATED — from hmsdb]. Four-arm cross profile — distinctly non-circular, with four symmetric extensions at 90° intervals. The cross arms extend the effective radius at four points while leaving the 45° sectors less populated — a deliberately asymmetric mass distribution in the angular sense (four-fold, not continuous ring).

### 2. Physics

**Cross-arm mass distribution:**
Four arms at r_arm ≈ 22–24 mm, sectors between arms at r_base ≈ 14–15 mm:

    I_arms = 4 × (0.004 × 0.023²) ≈ 8.5 × 10⁻⁶ kg·m²  (arm mass at outer radius)
    I_core = 0.001 × 0.015² ≈ 2.25 × 10⁻⁷ kg·m²       (between-arm core)
    Total I ≈ 8.75 × 10⁻⁶ kg·m²   [ESTIMATED]

Compare to CWD Defense Ring: I ≈ 3.65 × 10⁻⁶ kg·m²

Free Cross appears to have higher total I than Defense Ring at the same ~17g because the cross arms act as extended radius spokes — each gram of arm mass sits farther from center than a solid ring of the same total mass.

BUT: The cross arms also create angular mass asymmetry. Four preferred wobble directions (at arm positions) vs Defense Ring's zero. At low spin rates, Free Cross generates greater precession oscillation than circular CWDs.

**Attack contribution:**
Cross arm tips at r ≈ 23 mm act as secondary contact points that extend attack reach — similar role to Wing Attacker CWD (Case 133) but with four symmetric arms instead of two asymmetric wings.

**Compatibility with Jiraiya Blade combo:**
hmsdb recommends CWD Defense Ring over CWD Free Cross in Jiraiya Blade builds. Free Cross is functionally superseded by Defense Ring for pure stamina/defense. Free Cross's value is attack supplementation from the extended arm tips.

### 3. Game Engine Mapping

```typescript
interface CWDFreeCross {
  name: "cwd_free_cross";
  system: "HMS";
  sourceBey: "Jiraiya MS (MA-22)";
  mass_g: 17;                          // [ESTIMATED]
  profile: "four_arm_cross";
  armCount: 4;
  armRadius_mm: 23;
  coreRadius_mm: 15;
  momentOfInertia_kgm2: 8.75e-6;      // [ESTIMATED — arms at outer radius]
  angularAsymmetry: true;              // 4-fold preferred wobble directions
  attackReachExtended: true;           // arm tips supplement AR contact radius
  competitiveTier: "mid";
  supersededBy: "cwd_defense_ring";    // for pure stamina/defense builds
  bestRole: "attack_supplemental";
}
```

### 4. Verdict

**Role:** Attack-supplemental CWD. Free Cross's four cross arms extend attack reach similarly to Wing Attacker CWD but with four-fold symmetry (avoiding Wing Attacker's imbalance). Total I is estimated higher than Defense Ring due to arm-tip mass placement. Weakness: angular mass asymmetry from the four-arm pattern introduces wobble at low spin. For defense/stamina builds, CWD Defense Ring is the superior choice. For aggressive attack combos where arm-tip reach supplementation is valued, Free Cross is a usable alternative. Tier: mid.

---

## Case 146 — CWD Free Survivor (Thunder Dragon / RBA1) — ~17 g [ESTIMATED] — Survival-Oriented CWD: Circular-Trend Profile, Primary Harvest from RBA1

### 1. Geometry

CWD Free Survivor is one of two CWDs included with Thunder Dragon (RBA1). Weight: ~17g [ESTIMATED — from hmsdb RBA1 page]. "Survivor" suffix indicates stamina/survival-oriented geometry — smooth perimeter profile, minimal protrusions, circular-trend distribution aimed at reducing drag and maintaining spin velocity.

### 2. Physics

**Circular-trend survival profile:**
Unlike CWD Free Saucer (Case 147, also from RBA1) which has protrusions, Free Survivor's smooth perimeter:

    Drag coefficient: low (smooth surface, no protrusions)
    I contribution ≈ mass × r_mean² → at ~17g, r_mean ≈ 21mm
    I_FreeSurvivor ≈ 0.017 × (0.021)² ≈ 7.5 × 10⁻⁶ kg·m² [ESTIMATED]

Compared to CWD Circle Wide (14g, r_outer = 27mm, I ≈ 1.0×10⁻⁵ kg·m²):
Free Survivor is heavier (17g vs 14g) but with smaller outer radius → lower I per gram than Circle Wide. The "Survivor" designation refers to its smooth profile (less recoil) rather than maximum I.

**Best role:**
Defense-type combos where a smooth CWD profile reduces opponent contact recoil without the attack-range extension of cross-armed CWDs. The ~17g mass provides adequate combo weight.

### 3. Game Engine Mapping

```typescript
interface CWDFreeSurvivor {
  name: "cwd_free_survivor";
  system: "HMS";
  sourceBey: "Thunder Dragon (RBA1)";
  mass_g: 17;                          // [ESTIMATED]
  profile: "smooth_circular_survival";
  outerRadius_mm: 21;                  // [ESTIMATED]
  momentOfInertia_kgm2: 7.5e-6;       // [ESTIMATED]
  protrusions: false;                  // smooth perimeter
  dragPenalty: "low";
  competitiveTier: "low_mid";
  bestRole: "smooth_defense_cwd";
  harvestContext: "rba1_primary_cwd";  // the survival CWD from Thunder Dragon
}
```

### 4. Verdict

**Role:** Smooth survival CWD. Free Survivor provides a clean circular-profile CWD at ~17g without the protrusion complications of Saucer or the arm-asymmetry of Free Cross. Its primary competitive value is as a smooth heavy CWD substitute when Circle Wide or Defense Ring are unavailable. Tier: low-mid. Harvest from Thunder Dragon (RBA1) alongside Free Saucer (Case 147) — both included with the same bey.

---

## Case 147 — CWD Free Saucer (Thunder Dragon / RBA1) — ~17 g [ESTIMATED] — Saucer-Profile CWD: Shallow Spin-Steal Surface, Non-Competitive Analogue to Metal Saucer

### 1. Geometry

CWD Free Saucer is the second CWD from Thunder Dragon (RBA1). Weight: ~17g [ESTIMATED]. Saucer profile — a broad shallow curve perimeter similar to the Metal Saucer AR (Case 124) but as a CWD. The saucer geometry creates a wide, nearly flat outer surface.

### 2. Physics

**Saucer CWD spin-steal (limited):**
Saucer profile at the WD level: the CWD sits below the AR. Its saucer perimeter contacts opponent ARs only if the opponent's contact point is low enough to reach CWD height. In standard HMS geometry, this occurs when:

1. The opponent is significantly shorter (height mismatch contact)
2. The opponent tilts toward the saucer face during collision

In most encounters, the AR (higher, Case 124 type) makes contact first. The CWD saucer contacts are secondary or incidental.

**Spin-steal contribution:**
    α_saucer_CWD ≈ 3–5° (same shallow geometry as AR-level saucer)
    τ_steal ≈ μ × F_N × r_CWD = 0.15 × 0.5 × 0.021 ≈ 0.0016 N·m
    Δω per contact ≈ 0.0016 × 0.003 / 0.0003 ≈ 0.016 rad/s

Non-competitive: each contact drains ~0.016 rad/s from the opponent — half of AR-level Metal Saucer's 0.028 rad/s (lower contact frequency at CWD level).

### 3. Game Engine Mapping

```typescript
interface CWDFreeSaucer {
  name: "cwd_free_saucer";
  system: "HMS";
  sourceBey: "Thunder Dragon (RBA1)";
  mass_g: 17;                          // [ESTIMATED]
  profile: "saucer_shallow";
  saucerAngle_deg: 4;
  spinStealPerContact: 0.016;         // rad/s — secondary contacts only
  contactHeight: "low";               // only contacts at tilt or height-mismatch
  competitiveTier: "low";
  analogue: "metal_saucer_ar_case124"; // same geometry, lower position
  note: "Spin-steal CWD requires opponent height-mismatch to function — rarely triggers";
}
```

### 4. Verdict

**Role:** Low-tier saucer CWD. Free Saucer replicates the Metal Saucer AR's spin-steal geometry at the CWD level — where contacts are less frequent and opponent-height-dependent. The spin drain per contact (0.016 rad/s) is sub-threshold in normal combat. Acquire from Thunder Dragon (RBA1) alongside Free Survivor — use Free Survivor for practical builds; Free Saucer is curiosity harvest. Tier: low.

---

## Case 148 — Flat Core (Original) (Gaia Dragoon MS / A-123) — ~1.5 g [ESTIMATED] — Baseline HMS Flat: Lightest of Three Flat Variants, Mid-Diameter, Aggressive Standard

### 1. Geometry

Flat Core (Original) is the Running Core of Gaia Dragoon MS (A-123, the first HMS release). Weight: ~1.5 g [ESTIMATED — derived from hmsdb: New Revision adds ~0.5g to Original, New Revision ≈ 2g → Original ≈ 1.5g]. Flat tip, mid-range diameter among the three Flat Core variants (Original, New Revision, Metal Weight). All-plastic construction (no metal insert).

### 2. Physics

**Flat tip dynamics at 1.5g RC mass:**
Flat tip contact radius r_tip ≈ 2.0–2.5 mm (mid-diameter):

    μ_flat ≈ 0.35–0.45 (ABS flat, mid-range)
    τ_tip = μ × m_combo × g × r_tip ≈ 0.40 × 0.038 × 9.81 × 0.0022 ≈ 0.0033 N·m
    dω/dt = τ / I_combo ≈ 0.0033 / 2.5×10⁻⁵ ≈ 132 rad/s²

This is aggressive spin decay — faster than Grip Flat Core's controlled rubber flat because:
1. ABS flat has less friction control than rubber
2. No metal weight ballast (contrast: Metal Weight Grip Core ~15g provides smash stability)
3. Small 1.5g mass means the RC itself adds negligible inertia resistance

**Flower pattern:**
The Flat Core (Original) can execute a flower pattern (repeated central passes alternating with wall orbits) but less stably than Grip Flat Core due to:
- Harder ABS surface (less grip → wider loops, harder to control arc)
- Lighter mass → more responsive to wall bounces (erratic direction changes)

**Comparison with other flat variants:**
| Core | Weight | Diameter | Performance |
|------|--------|----------|-------------|
| Flat Core (Original) | ~1.5g | Mid | Baseline — aggressive, less controlled |
| Flat Core (New Revision) | ~2g | Smallest | Strictly better per hmsdb |
| Metal Weight Flat Core | ~3g | Largest | Most controllable, heaviest |

### 3. Game Engine Mapping

```typescript
interface FlatCoreOriginal {
  name: "flat_core_original";
  system: "HMS";
  sourceBey: "Gaia Dragoon MS (A-123)";
  mass_g: 1.5;                        // [ESTIMATED]
  tipType: "flat_abs";
  tipRadius_mm: 2.2;                  // mid-diameter [ESTIMATED]
  mu: 0.40;
  spinDecay_radPerS2: 132;
  movementPattern: "aggressive_erratic";
  supersededBy: "flat_core_new_revision";
  note: "Baseline first-release flat core — improved by New Revision (MA-18)";
  competitiveTier: "low_mid";
}
```

### 4. Verdict

**Role:** Baseline aggressive HMS flat RC. The original flat core from the first HMS release. Provides aggressive ABS flat movement but with less control and more erratic trajectory than Grip Flat Core (rubber) or Metal Weight Flat Core (ballasted). Superseded by the New Revision from MA-18 Magical Ape MS. Tier: low-mid — use New Revision when available. Still functional for aggressive attack builds where control is not the priority.

---

## Case 149 — Flat Core (New Revision) (Magical Ape MS / MA-18) — ~2 g [ESTIMATED] — Improved Flat: Smallest Diameter, Added Center Screw, "Strictly Better" than Original

### 1. Geometry

Flat Core (New Revision) is the Running Core of Magical Ape MS (MA-18). Weight: ~2 g [ESTIMATED — from hmsdb: adds "roughly half a gram" to Original's ~1.5g, plus center screw]. Modification from Original: a screw added in the center of the tip face — this screw slightly reduces effective tip contact diameter (the screw head is harder/narrower than ABS flat), creating a functionally smaller contact patch.

hmsdb characterization: "strictly better" than Original. Smallest diameter of all three flat variants.

### 2. Physics

**Center screw effect:**
The added center screw creates a harder central point within the flat face:

    Effective tip contact = ring-shaped ABS flat + center screw hub
    Screw hub radius ≈ 0.5 mm (hard metal/plastic)
    Flat ring outer radius ≈ 1.8 mm (smaller than Original's 2.2 mm)

This composite contact has lower effective diameter than Original → tighter movement arcs (smaller r_tip → less torque per unit friction → slower spin decay than Original):

    τ_New = μ × m × g × r_new ≈ 0.40 × 0.038 × 9.81 × 0.0018 ≈ 0.0027 N·m
    dω/dt_New ≈ 107 rad/s² vs Original 132 rad/s² → 19% slower spin decay

**"Strictly better" mechanism:**
The combination of:
1. Smaller effective diameter → tighter, more controllable movement arcs
2. Center screw harder pivot → more repeatable arc radius (less random slip)
3. Slightly heavier (+0.5g) → marginally more stable on axis

...makes New Revision produce more consistent flower patterns than Original while maintaining similar speed ceiling.

### 3. Game Engine Mapping

```typescript
interface FlatCoreNewRevision {
  name: "flat_core_new_revision";
  system: "HMS";
  sourceBey: "Magical Ape MS (MA-18)";
  mass_g: 2.0;                        // [ESTIMATED]
  tipType: "flat_abs_with_center_screw";
  tipRadius_mm: 1.8;                  // smaller than Original [ESTIMATED]
  centerScrewHub: true;
  mu: 0.40;
  spinDecay_radPerS2: 107;            // 19% slower than Original
  movementPattern: "controlled_flat";
  improvesOn: "flat_core_original";
  diameterVsVariants: "smallest";     // confirmed by hmsdb
  competitiveTier: "mid";
  note: "hmsdb: strictly better than Original — use this over Original when available";
}
```

### 4. Verdict

**Role:** Improved standard HMS flat RC. The center screw modification reduces effective tip radius, producing tighter movement arcs and 19% slower spin decay than the Original — making flower patterns more consistent and aggressive attack more controllable. Use New Revision over Original whenever available. Still below Grip Flat Core's rubber traction for attack, but better than Original at all margins. Tier: mid. Primary harvest reason to acquire MA-18 Magical Ape MS (Metal Ape AR is secondary).

---

## Case 150 — Metal Weight Flat Core (Thunder Dragon / RBA1) — ~3 g [ESTIMATED] — Most Controllable HMS Flat: Largest Diameter, Heaviest Flat Variant

### 1. Geometry

Metal Weight Flat Core is the Running Core of Thunder Dragon (RBA1). Weight: ~3 g [ESTIMATED — from hmsdb RBA1 page]. The heaviest and largest-diameter flat core variant. The "Metal Weight" in the name suggests an internal metal weight insert (similar concept to Metal Weight Grip Core, Case 138) — but within a flat-tip architecture rather than rubber.

### 2. Physics

**Largest flat diameter + internal weight:**
Tip radius r_tip ≈ 2.8–3.0 mm (largest of three flat variants, per hmsdb "largest diameter"):

    τ_MWFC = μ × m × g × r_tip ≈ 0.40 × 0.038 × 9.81 × 0.0029 ≈ 0.0043 N·m
    dω/dt_MWFC ≈ 173 rad/s² — actually FASTER decay than New Revision

Wait — larger diameter = higher r_tip = more torque = faster spin decay. But hmsdb says "most controllable." Resolution: "most controllable" refers to movement arc predictability, not spin retention:

    Larger contact patch → more friction → more grip → less random slip → more predictable arc
    But: more torque = faster spin loss

The metal weight adds ballast mass at the tip center:

    ΔI_tip ≈ 0.001 × (0.003)² ≈ 9.0 × 10⁻⁹ kg·m² — negligible I contribution
    Stability contribution: lower CoM from tip-end ballast → more stable rotation axis

**Control vs speed tradeoff:**
Metal Weight Flat Core = slowest movement (most tip grip) but most predictable arc → best for bladers who prefer controlled approach over maximum speed. Grip Flat Core (Case 77, rubber) provides higher grip but with elastic rubber behavior; MWFC provides lower-elasticity metal/ABS-weighted grip.

### 3. Game Engine Mapping

```typescript
interface MetalWeightFlatCore {
  name: "metal_weight_flat_core";
  system: "HMS";
  sourceBey: "Thunder Dragon (RBA1)";
  mass_g: 3.0;                        // [ESTIMATED]
  tipType: "flat_abs_metal_weighted";
  tipRadius_mm: 2.9;                  // largest flat diameter [ESTIMATED]
  mu: 0.42;                           // slightly higher friction due to weight-loaded tip
  spinDecay_radPerS2: 173;            // faster than smaller-diameter flats
  movementPattern: "controlled_predictable";
  controlability: "highest_among_flat_cores";
  diameterVsVariants: "largest";
  massVsVariants: "heaviest";
  harvestContext: "rba1_rc";
  competitiveTier: "low_mid";
  tradeoff: "most_controllable_but_fastest_spin_decay_of_flat_variants";
}
```

### 4. Verdict

**Role:** Most controllable HMS flat RC at the cost of faster spin decay. Metal Weight Flat Core's large diameter provides predictable, gripping movement arcs — ideal for less experienced bladers or builds requiring consistent approach patterns. The trade-off is faster spin loss vs smaller-diameter flat variants. Preference order: Grip Flat Core (rubber) > Metal Weight Flat Core (controlled ABS) > Flat Core New Revision (precise ABS) > Flat Core Original (baseline ABS). Tier: low-mid. The actual RBA1 prize is the two CWDs (Free Survivor, Free Saucer) — MWFC is a tertiary harvest.

---

## Case 151 — Reverse Defenser CWD (Dranzer MF alt-color variant) — ~17 g [ESTIMATED] — Defensive Circular CWD: Smooth Perimeter, Opposite Preference to Wing Attacker, Same Bey Alternate Release

### 1. Geometry

Reverse Defenser CWD is an alternate CWD shipped with some color variants of Dranzer MF (RBA4). Weight: ~17 g [ESTIMATED — same mass class as Wing Attacker CWD, Case 133, which it replaces in alternate releases]. Profile: smooth circular perimeter — the defensive counterpart to Wing Attacker's asymmetric wing protrusions.

From linka dranzer-mf.md: "Alternate releases ship with Reverse Defenser WD instead [of Wing Attacker CWD]" — confirming it is the same bey, different CWD based on release variant.

### 2. Physics

**Circular smooth profile:**
No protrusions → near-circular profile. At ~17g with r_outer ≈ 21 mm:

    I_RD ≈ 0.5 × 0.017 × (0.021² + 0.018²) ≈ 6.5 × 10⁻⁶ kg·m²

Comparison vs Wing Attacker CWD (Case 133):
- Wing Attacker: asymmetric wings, extended smash reach, wobble risk at low spin
- Reverse Defenser: circular smooth, no smash extension, no wobble

**Defense utility:**
Smooth circular perimeter = low contact-recoil on incoming hits → suitable for defense/stamina builds. No protrusion geometry means opponents glance off smoothly rather than catching on wing tips.

At 17g, Reverse Defenser is slightly lighter than CWD Defense Ring (19g) and CWD God Ring (18g). Lower mass → lower I per gram but similar profile tier.

**Name analysis:**
"Reverse" likely indicates left-spin preference or "reverse/inverted" use case. "Defenser" = defensive archetype. The pairing with Dranzer MF (a smash-oriented bey) suggests Reverse Defenser is for survival builds with Smash Phoenix + Free Shaft Core in counter-smash defense setups.

### 3. Game Engine Mapping

```typescript
interface ReverseDefenserCWD {
  name: "reverse_defenser_cwd";
  system: "HMS";
  sourceBey: "Dranzer MF (RBA4, alt-color variant)";
  mass_g: 17;                          // [ESTIMATED]
  profile: "circular_smooth";
  outerRadius_mm: 21;
  momentOfInertia_kgm2: 6.5e-6;       // [ESTIMATED]
  protrusions: false;
  contactRecoil: "low";                // smooth deflection
  competitiveTier: "mid";
  alternativeTo: "wing_attacker_cwd";  // same bey, different release variant
  bestRole: "defense_stamina_cwd";
  pairedAR: "smash_phoenix";
  pairedRC: "free_shaft_core";
}
```

### 4. Verdict

**Role:** Defense/stamina CWD substitute on Dranzer MF. Reverse Defenser is the non-attack pairing for Dranzer MF builds: when Smash Phoenix AR's aggression is balanced by a defense-oriented CWD rather than Wing Attacker's attack extension. Lower mass (~17g) than top-tier circular CWDs (Defense Ring ~19g, God Ring ~18g) but same clean circular profile. Tier: mid — useful when CWD Defense Ring is unavailable, especially in Dranzer MF survival builds.

---

## Case 152 — Bearing Core 2 (Jiraiya MS / MA-22) — ~4 g [ESTIMATED] — Rubber Bearing Tip: Taller than Bearing Core 1, Worn-Tip-Dependent, Zombie/Balance Hybrid

### 1. Geometry

Bearing Core 2 is the Running Core of Jiraiya MS (MA-22). Weight: ~4 g [ESTIMATED — from hmsdb MA-22 page]. Architecture: plastic casing for a set of bearings, topped by a rubber tip. Two key differences from Bearing Core (Case 84):
1. **Rubber tip** — Bearing Core 1 uses a plastic sharp tip; Bearing Core 2 uses rubber
2. **Taller height** — Bearing Core 2 is notably taller than the original

The rubber tip behavior is wear-dependent: "naturally more pointed when mint" (high tip-only contact, very low friction) but "truly released when worn" (increased surface area, more grip, more aggressive contact).

### 2. Physics

**Bearing + rubber tip dual-mode:**
Bearing mechanism provides:

    Bearing friction μ_bearing ≈ 0.02–0.05 (same bearing type as Bearing Core 1)
    dω/dt_bearing ≈ (0.035 × μ × m × g × r_race) / I_combo

At mint condition (pointed rubber tip):

    Effective contact: small rubber tip r_tip ≈ 0.5 mm (pointed)
    μ_rubber_pointed ≈ 0.08–0.12 (pointed rubber, similar to metal sharp)
    dω/dt_total_mint ≈ bearing_component + pointed_rubber ≈ 12–18 rad/s²

At worn condition (flatter rubber surface):

    r_tip_worn ≈ 1.5–2.0 mm
    μ_rubber_worn ≈ 0.35–0.50 (worn rubber, increased contact area)
    dω/dt_total_worn ≈ bearing + flat_rubber ≈ 45–75 rad/s²

This is a REVERSAL from normal bearing behavior — Bearing Core 2 becomes more aggressive (faster spin decay, more lateral movement) as it wears, not less. When worn:

    Movement pattern: active orbit (rubber flat at 1.5mm radius) → zombie/balance hybrid
    When mint: near-stationary (pointed rubber barely contacts floor) → pure stamina

**Height impact:**
Taller height raises CoM → increases nutation susceptibility at low spin. This is why Bearing Core 2 does not simply replace Bearing Core 1 as the "better zombie" — the height penalty reduces stability in the LAD zone.

**Combo recommendation from hmsdb:**
Samurai Upper + CWD Defense Ring + Bearing Core 2 (worn, aggressive mode) — the worn rubber provides lateral force for repositioning while bearing mechanism maintains spin.

### 3. Game Engine Mapping

```typescript
interface BearingCore2RC {
  name: "bearing_core_2";
  system: "HMS";
  sourceBey: "Jiraiya MS (MA-22)";
  mass_g: 4;                          // [ESTIMATED]
  height: "taller_than_bearing_core_1";
  tipType: "rubber_on_bearings";
  tipConditions: {
    mint: {
      tipRadius_mm: 0.5,
      mu: 0.10,
      spinDecay_radPerS2: 15,
      movementPattern: "near_stationary"
    },
    worn: {
      tipRadius_mm: 1.8,
      mu: 0.42,
      spinDecay_radPerS2: 60,
      movementPattern: "active_orbit_rubber_flat"
    }
  };
  wearDependentPerformance: true;      // reversal: better when worn
  comHeightPenalty: true;              // taller → more nutation vs BC1
  vsBearingCore1: {
    height: "taller",
    tipMaterial: "rubber_vs_plastic_sharp",
    stabilitLow spin: "lower_due_to_height"
  };
  competitiveTier: "mid";
  pairedAR: "samurai_upper";
  pairedCWD: "cwd_defense_ring";
}

function bearingCore2Friction(wearState: "mint" | "worn"): number {
  return wearState === "mint" ? 0.10 : 0.42;
  // Mint: near-zero contact area → low friction; Worn: flat rubber → high friction
}
```

### 4. Verdict

**Role:** Wear-dependent zombie/balance hybrid RC. Bearing Core 2's rubber tip inverts the normal wear curve: mint condition = near-stationary stamina; worn condition = active rubber-flat attack orbit. The taller height vs Bearing Core 1 introduces nutation risk in the LAD zone that makes BC2 less reliable as a pure zombie base. Best used deliberately in "worn" state for active defense combos (Samurai Upper + Defense Ring + BC2 worn = controlled orbital defense). Not a replacement for Bearing Core 1 in pure zombie builds. Tier: mid — unique wear mechanic with genuine tactical applications in experienced hands.

---

## Case 250 — Cross Attacker AR (Dranzer V) — 5.6 g [FACT(PDB)] — Phoenix-Head Smash/Upper Hybrid: Four-Fold Symmetry, Compound Contact Geometry

### 1. Geometry

Cross Attacker is the Attack Ring of Dranzer V (V-Force era, Plastic Generation). It continues Dranzer's phoenix visual lineage: four phoenix heads spaced at 90° intervals, each carrying two active features per face — a sloped upper-attack ramp behind each head and a small secondary spike ahead of it. Weight: 5.6 g [FACT(PDB)].

This four-fold compound geometry means every 90° sector contains both a slope face and a spike face. In right spin, the phoenix head's leading beak makes smash contact; in left spin, the slope face catches under opponents. The combination of upward slope + forward beak produces a compound contact profile — neither pure smash nor pure upper, but a hybrid that delivers both to overlapping effect.

Outer contact radius ≈ 27 mm (wide for plastic gen). Mass at radius: I_AR ≈ 0.0056 × (0.026)² ≈ 3.8 × 10⁻⁶ kg·m².

### 2. Physics

**Right-spin compound contact:**
Phoenix beak leading edge angle α_smash ≈ 25°:

    Smash fraction = sin(25°) ≈ 0.423

Small spike supplement: additional contact point at α_spike ≈ 35°, smaller area:

    Smash fraction_spike = sin(35°) × 0.3 ≈ 0.172 (reduced by smaller contact area)
    Combined RS smash ≈ 0.423 + 0.172 × (contact_ratio) ≈ 0.46 effective

**Left-spin upper attack:**
Phoenix slope behind each head, α_upper ≈ 28°:

    Upper fraction = sin(28°) ≈ 0.469

LS upper attack from the slope face is the primary LS combat mode. Combined with the beak reversed:
- Slope face is now leading → upper-attack contact
- Beak reversed → high recoil risk in LS

LS is secondary compared to RS; avoid LS combat unless specifically building left-spin smash/upper.

**Mass comparison vs Double Snake (Case 120a, ~5g):**
Cross Attacker (5.6g) is heavier by 0.6g. At equivalent geometry, the additional mass increases AR inertia:

    ΔI ≈ 0.0006 × (0.026)² ≈ 4.1 × 10⁻⁷ kg·m² — 11% more AR inertia than Double Snake

**Competitive position:**
Four-fold symmetry provides contact every 90° — no dead zones. The compound beak + slope contact means almost every hit has both a smash component and an upper component. However, 5.6g is mid-range for plastic gen ARs; heavier ARs (Mountain Hammer 6.5g+, Triple Tiger 6.3g) deliver more impulse per contact.

### 3. Game Engine Mapping

```typescript
interface CrossAttackerAR {
  name: "cross_attacker";
  system: "SGS";
  sourceBey: "Dranzer V";
  mass_g: 5.6;                        // [FACT(PDB)]
  foldSymmetry: 4;
  contactType: "compound_beak_slope";
  smashFractionRS: 0.46;              // beak + spike compound
  upperFractionLS: 0.469;             // sin(28°) slope face
  outerRadius_mm: 27;
  contactEvery_deg: 90;               // no dead zones
  phoenixHeads: 4;
  competitiveTier: "B";               // B-tier smash+upper hybrid
  primarySpinDir: "right";
  secondarySpinDir: "left_upper";
  dranzervForceLineage: true;
}

function crossAttackerDamage(
  spinDir: "right" | "left",
  F_N: number
): { smash: number; upper: number } {
  if (spinDir === "right") {
    return { smash: F_N * 0.46, upper: F_N * 0.15 };   // compound RS
  } else {
    return { smash: F_N * 0.10, upper: F_N * 0.469 };  // slope-dominant LS
  }
}
```

### 4. Verdict

**Role:** B-tier Smash/Upper Hybrid AR. Cross Attacker's four phoenix heads provide compound beak + slope contacts at every 90° approach angle — no dead zones. The 5.6g weight is adequate for smash generation without excessive recoil. Right-spin is primary (beak smash); left-spin upper is viable secondary. Outclassed by Mountain Hammer or Triple Tiger for pure smash, and by Penta Wing for dedicated upper attack, but Cross Attacker's compound geometry makes it more versatile than either. Best used in RS attack combos on aggressive BBs (Dranzer V's Flame Change Base pairing).

---

## Case 251 — Ten Spike AR (Draciel V) — 4.1 g [FACT(PDB)] — Uneven Ten-Protrusion Ring: Alternating Large/Small Spikes, Extreme Recoil, Non-Competitive

### 1. Geometry

Ten Spike is Draciel V's Attack Ring. Ten protrusions ring the perimeter in an alternating large–small–large–small pattern: five large spikes interspersed with five small ones. Weight: 4.1 g [FACT(PDB)].

The alternating size pattern is the critical geometry flaw: the five large spikes and five small spikes sit at different radii (large spike r ≈ 27 mm, small spike r ≈ 23 mm). This creates non-uniform rotational inertia — the bey's effective mass at radius is not evenly distributed by fold angle.

Outer radius (large spike tip): ≈ 27 mm. Effective attack perimeter: ten contacts per revolution (unlike Eight Spiker's 8 symmetric contacts, Case 189).

### 2. Physics

**Spike contact geometry:**
Large spike face angle α_large ≈ 80–85° from tangent (nearly perpendicular):

    Smash fraction = sin(85°) ≈ 0.996 — maximal radial impulse
    Self-recoil = cos(5°) ≈ 0.996 — equal self-recoil

This is essentially a blunt perpendicular contact — same failure mode as Knight Crusher AR (Case 128) but worse because:
1. Plastic (ABS) contact → additional energy absorption at impact vs HMS zinc alloy
2. Small spike interspersed → inconsistent contact pattern per revolution

**Rotational imbalance from alternating radii:**
Large spike I_contribution ≈ 0.0003 × (0.027)² ≈ 2.2 × 10⁻⁷ kg·m²
Small spike I_contribution ≈ 0.0001 × (0.023)² ≈ 5.3 × 10⁻⁸ kg·m²
Difference per pair: 1.67 × 10⁻⁷ kg·m² × 5 pairs ≈ 8.4 × 10⁻⁷ kg·m² non-uniform I

This non-uniform I promotes nutation wobble at mid spin (stability < 0.7 × ω_max):

    Wobble onset: earlier than symmetric ARs — Ten Spike destabilizes itself faster

**Recoil accumulation:**
At 200 rad/s, each large spike contact:

    J_self = (m_bey / (m_bey + m_opp)) × F_N × Δt × sin(85°) ≈ 0.019 × 0.7 ≈ 0.013 N·s backward

Over 10 hits (one full AR revolution contact):

    Δv_self_total ≈ 0.13 N·s / 0.038 kg ≈ 3.4 m/s total backward impulse — ring-out risk from own hits

### 3. Game Engine Mapping

```typescript
interface TenSpikeAR {
  name: "ten_spike";
  system: "SGS";
  sourceBey: "Draciel V";
  mass_g: 4.1;                        // [FACT(PDB)]
  spikeCount: 10;
  largeSpikes: 5;
  smallSpikes: 5;
  contactAngle_large_deg: 85;
  smashFraction: 0.996;               // near-perpendicular spikes
  selfRecoilFraction: 0.996;          // equal self-recoil
  rotationalImbalance: true;          // alternating large/small radii
  nutationOnset: "early";             // non-uniform I → wobble ahead of norm
  competitiveTier: "F";
  donorValue: false;
  note: "Distinct from Eight Spiker (Case 189) — different part, 10 vs 8 spikes, different geometry";
}
```

### 4. Verdict

**Role:** Non-competitive. Ten Spike's near-perpendicular spike faces generate maximum self-recoil with negligible KO impulse to opponents. The alternating large/small spike pattern introduces rotational imbalance that accelerates nutation onset. At 4.1g, the AR mass is insufficient to resist the self-inflicted recoil from its own spike contacts. Tier: F. Note: distinct from Eight Spiker (Case 189, 4.3g, eight symmetric contacts) — Ten Spike's uneven alternating geometry is strictly worse.

---

## Case 252 — Eight Spike AR (Draciel F) — 4.2 g [FACT(PDB)] — Eight Symmetric Blunt Spikes: No Smash Angle, No Competitive Value

### 1. Geometry

Eight Spike is Draciel Final's (Draciel F) Attack Ring — not to be confused with Eight Spiker (Case 189, 4.3g, Gaia Dragoon). Weight: 4.2 g [FACT(PDB)]. Eight evenly-spaced spikes at identical radii around the perimeter. Unlike Ten Spike's alternating pattern, Eight Spike is geometrically symmetric — all eight spikes at the same outer radius ≈ 26 mm. No ramp, no slope, no upper-attack geometry.

### 2. Physics

**Symmetric perpendicular contact:**
All eight spike faces at α ≈ 88–90° from tangent:

    Smash fraction = sin(90°) = 1.00 (maximum radial, same both spins)
    Self-recoil = cos(0°) = 1.00

Unlike Ten Spike, Eight Spike has no rotational imbalance (all spikes same radius → symmetric I distribution). This means it doesn't self-destabilize as quickly. But the contact geometry is equally useless: perpendicular spikes produce equal-and-opposite KO potential, meaning the attacker suffers the same ring-out risk as the opponent.

**Comparison vs Eight Spiker (Case 189):**
| Part | Spikes | Angle | Geometry | Verdict |
|------|--------|-------|----------|---------|
| Eight Spiker | 8 | ~30–35° attack slope | Multi-tier attack faces | Viable benchmark |
| Eight Spike | 8 | ~90° perpendicular | Blunt spike only | Non-competitive |

The names differ by one letter. The geometry is entirely different. Eight Spiker has angular smash faces; Eight Spike has blunt perpendicular tips.

**Mass comparison:**
8 × 0.00052g per spike at r = 26mm (estimated) → I_AR ≈ 0.0042 × (0.025)² ≈ 2.6 × 10⁻⁶ kg·m².

### 3. Game Engine Mapping

```typescript
interface EightSpikeAR {
  name: "eight_spike";
  system: "SGS";
  sourceBey: "Draciel F";
  mass_g: 4.2;                        // [FACT(PDB)]
  spikeCount: 8;
  contactAngle_deg: 90;               // perpendicular blunt
  smashFraction: 1.00;                // maximum radial — also maximum self-recoil
  selfRecoilFraction: 1.00;
  rotationalImbalance: false;         // symmetric 8 spikes → no imbalance
  competitiveTier: "non_competitive";
  distinctFrom: "eight_spiker";       // Case 189 — different part, different geometry
  donorValue: false;
}
```

### 4. Verdict

**Role:** Non-competitive. Eight Spike's symmetric blunt spikes produce maximum recoil equally in both directions — the bey self-KOs as readily as it KOs opponents. Unlike Ten Spike, the symmetric design avoids rotational imbalance, but this only means it fails gracefully rather than catastrophically. No smash angle → no KO potential beyond random perpendicular contact. Tier: non-competitive (equivalent to Knight Crusher, Case 128). Distinct from Eight Spiker (Case 189) by geometry and performance — do not confuse.

---

## Case 253 — Weight Ring WD (Hayate-type beys) — 12.4 g [FACT(PDB)] — Specialty Non-Universal WD: Hayate Base-Only Channel Fit, Same Mass as Wide Survivor

### 1. Geometry

Weight Ring is a specialty Weight Disk exclusive to Hayate-type beys (plastic generation). Weight: 12.4 g [FACT(PDB)] — identical to Wide Survivor's weight, but different geometry. The Weight Ring's defining feature is its internal mounting groove: it is machined to fit the Hayate Base's internal channel specifically. Standard SGS/EGS blade bases cannot accept Weight Ring, and Hayate Base cannot accept standard WDs.

Profile: Compact outer ring with channel-fit mounting geometry. Outer radius ≈ 24–25 mm (estimate). The "ring" name reflects its appearance: a simple ring-shaped WD without the spoked architecture of most plastic gen WDs.

### 2. Physics

**Non-universal mounting:**
Hayate Base's internal channel is narrower and recessed differently than standard SGS WD slots:

    Hayate channel width ≈ 2.5 mm internal ring fit
    Standard WD slot width ≈ 3.5 mm
    Incompatibility: Weight Ring's inner tab geometry is matched to Hayate only

This means Weight Ring cannot be used in any competitive SG/EG combo outside of Hayate Base builds. It is purpose-designed hardware.

**Mass and inertia:**
12.4 g at r ≈ 24 mm. As a compact ring (not spoke-and-rim):

    I_WeightRing ≈ 0.5 × 0.0124 × (0.024² + 0.021²) ≈ 6.5 × 10⁻⁶ kg·m²

For comparison:
- Wide Survivor (12.4g, r_outer = 27mm): I_WS ≈ 7.0 × 10⁻⁶ kg·m²
- Weight Ring: I ≈ 6.5 × 10⁻⁶ kg·m² — 7% less than Wide Survivor despite equal mass

The difference is outer radius: Wide Survivor's wider rim places more mass farther out. Weight Ring's compact ring concentrates mass at slightly lower radius.

**Hayate Base assembly function:**
The Hayate Base's internal channel integrates the Weight Ring as a structural member — it is not just a replaceable WD but a functional component of the base mechanism. Removing the Weight Ring and substituting another WD is mechanically impossible (incompatible fit).

    Hayate combo: AR + Weight Ring (fixed pairing) + Hayate Base
    No WD substitution possible → Weight Ring defines the Hayate archetype

### 3. Game Engine Mapping

```typescript
interface WeightRingWD {
  name: "weight_ring";
  system: "SGS";
  mass_g: 12.4;                       // [FACT(PDB)]
  profile: "compact_ring";
  outerRadius_mm: 24;
  innerRadius_mm: 21;
  momentOfInertia_kgm2: 6.5e-6;
  universal: false;                   // ONLY fits Hayate Base's internal channel
  compatibleBases: ["hayate_base"];
  functionallyEquivalentTo: null;     // unique — no standard WD substitutes
  sameWeightAs: "wide_survivor";      // 12.4g but 7% less I due to smaller radius
  competitiveUse: "hayate_only";
  note: "Cannot be used outside Hayate-type assemblies — structural component, not swap part";
}
```

### 4. Verdict

**Role:** Purpose-fit Hayate Base structural WD. Weight Ring is not a competitive WD in the normal sense — it cannot be substituted into any other combo, and no other WD can replace it in Hayate Base. Its inertia (6.5 × 10⁻⁶ kg·m²) is 7% lower than Wide Survivor despite equal mass, due to the compact ring profile. As a Hayate Base component, it defines that base's stamina behavior: adequate mass for zombie/stamina combos but not top-tier vs Wide Survivor + SG Bearing Base setups. Tier: specialty.

---

## Case 254 — Balance WD / Eight Balance WD — 14.1 g [FACT(PDB)] — Eight-Spoke Compact Distribution: Mid-Weight Universal WD, Heaviest Compact Class

### 1. Geometry

Balance WD (also sold as "Eight Balance" on some releases) — 14.1 g [FACT(PDB)]. Eight-spoke architecture similar in profile to other octagonal WDs. Sources: Balance variant — Frostic Dranzer, Spark Knight, Makendo, Wing Attacker beys. Eight Balance variant — Draciel S, Draciel F, Wolborg 2, Dranzer S, Driger F, Death Driger, Knight Dranzer, Griffolyon.

Both variants share the same 14.1 g weight and functional architecture. The name difference reflects branding across different bey lines. An "Eight" prefix typically denotes the 8-spoke octagonal design in plastic gen WD naming. "Balance" without prefix uses the same 8-spoke form.

### 2. Physics

**Octagonal 8-spoke mass distribution:**
Eight spokes at 45° intervals, perimeter rim, central hub. Mass concentrated in the rim ring:

    I_Eight_Balance ≈ m_rim × r_rim² ≈ 0.010 × (0.025)² = 6.25 × 10⁻⁶ kg·m²
    (remaining 4.1g in spokes + hub contributes less due to lower radius)
    Total I ≈ 6.8 × 10⁻⁶ kg·m² [estimated]

**Position in WD hierarchy:**
| WD | Mass | I_est | Class |
|----|------|-------|-------|
| Wide Survivor | 12.4g | 7.0×10⁻⁶ | Light, wide |
| Eight Wide (hard) | 12.7g | 7.2×10⁻⁶ | Light, wide |
| Eight Balance / Balance | 14.1g | 6.8×10⁻⁶ | Mid-heavy, compact |
| Wide Defense | 14.5g | 8.5×10⁻⁶ | Mid-heavy, wide |
| Eight Heavy | 15.3g | 7.8×10⁻⁶ | Heavy, compact |

Eight Balance occupies the middle of the WD mass spectrum. Its 8-spoke compact distribution provides more mass than Eight Wide (better smash stability) but less I per gram than Wide Defense or Wide Survivor (both more peripheral). It is the transition WD between "light wide" and "heavy compact."

**Competition use:**
Eight Balance is the most widely-distributed competitive WD across S1 releases — it ships with many top-tier beys (Driger S, Dranzer S, etc.) and provides reliable stamina/compact performance. Not best-in-class for any single archetype but broadly usable.

### 3. Game Engine Mapping

```typescript
interface EightBalanceWD {
  name: "eight_balance";           // also "balance" — same part different branding
  system: "SGS";
  mass_g: 14.1;                    // [FACT(PDB)]
  profile: "eight_spoke_octagonal";
  outerRadius_mm: 25;
  momentOfInertia_kgm2: 6.8e-6;   // [ESTIMATED]
  wdClass: "compact_mid_heavy";
  universalFit: true;
  aliases: ["balance_wd"];        // same part, different bey releases
  competitiveTier: "mid";
  bestRole: "general_purpose_compact";
  distributionBias: "compact";    // vs Wide/Wide Defense which are peripheral
}
```

### 4. Verdict

**Role:** Universal mid-weight compact WD. Eight Balance/Balance is the most common mid-tier WD in plastic gen and the benchmark against which heavier compact WDs (Eight Heavy, Heavy, Heavy Attack) are measured. Its 14.1g and octagonal distribution provides solid base stamina for standard attack/compact combos. Not best-in-class for stamina (Wide Survivor wins) or smash stability (Ten Heavy wins) but reliable in both roles and easily obtained. Tier: mid — universal workhorse.

---

## Case 255 — Eight Heavy WD (Driger S / Dranzer F / Master Dragoon) — 15.3 g / 15.5 g [FACT(PDB)] — Eight-Spoke Heavy: Two Molds, Maximum Mass 8-Spoke WD

### 1. Geometry

Eight Heavy WD — 15.3 g (Regular mold) / 15.5 g (Indent mold) [FACT(PDB)]. Same 8-spoke octagonal architecture as Eight Balance but heavier rim. The indent mold adds small indentations along the outer rim — mass and I contribution nearly identical per PlasticsDB ("practically identical performance"). Source beys: Driger S, Dranzer F, Master Dragoon.

### 2. Physics

**Additional mass vs Eight Balance:**
Eight Heavy adds 1.2g over Eight Balance at same r_rim:

    ΔI ≈ 0.0012 × (0.025)² = 7.5 × 10⁻⁷ kg·m² additional inertia
    Total I_Eight_Heavy ≈ 6.8×10⁻⁶ + 7.5×10⁻⁷ ≈ 7.55 × 10⁻⁶ kg·m²

**Spin decay improvement:**
dω/dt ∝ 1/I. Eight Heavy vs Eight Balance:

    Improvement = (I_EH - I_EB) / I_EB = 7.5×10⁻⁷ / 6.8×10⁻⁶ ≈ 11%
    Effectively: 11% slower spin decay per unit floor torque

**Position in heavy WD hierarchy:**
| WD | Mass | I_est |
|----|------|-------|
| Eight Balance | 14.1g | 6.8×10⁻⁶ |
| Heavy WD | 15.3g | 7.0×10⁻⁶ (compact) |
| Eight Heavy Regular | 15.3g | 7.55×10⁻⁶ (8-spoke) |
| Eight Heavy Indent | 15.5g | 7.60×10⁻⁶ |
| Wide Defense | 14.5g | 8.5×10⁻⁶ (wide) |
| Ten Heavy | 16.1g | 8.9×10⁻⁶ (10-spoke) |

Eight Heavy and Heavy WD share the same 15.3g mass but different profiles: Eight Heavy's 8-spoke perimeter places mass farther out (better I) than Heavy's compact round center.

**Mold difference:**
Regular vs Indent: 0.2g difference, practically identical spin decay. Prefer Regular for simplicity; Indent adds nothing measurable.

### 3. Game Engine Mapping

```typescript
interface EightHeavyWD {
  name: "eight_heavy";
  system: "SGS";
  mass_g: 15.3;                    // [FACT(PDB)] regular; 15.5g indent
  profile: "eight_spoke_octagonal_heavy";
  outerRadius_mm: 25;
  momentOfInertia_kgm2: 7.55e-6;  // [ESTIMATED]
  molds: ["regular_15_3g", "indent_15_5g"];
  moldPerformanceDiff: "negligible";
  universalFit: true;
  competitiveTier: "mid_high";
  vsEightBalance: { spinDecayImprovement: 0.11 };
  vsTenHeavy: { massDiff: -0.8, iDiff: -1.35e-6 }; // Ten Heavy still better for pure stamina
  sourceBeys: ["driger_s", "dranzer_f", "master_dragoon"];
}
```

### 4. Verdict

**Role:** Heavy 8-spoke WD — best 8-spoke option below Ten Heavy. Eight Heavy's 15.3g provides an 11% spin decay improvement over Eight Balance while maintaining the familiar octagonal profile. It fills the gap between Eight Balance and Ten Heavy for custom builds where Ten Heavy mass isn't required. The indent mold variant adds 0.2g with no performance difference — prefer the regular. Tier: mid-high. Use when Ten Heavy is unavailable or when the additional 0.8g of Ten Heavy would push the combo over an effective weight threshold.

---

## Case 256 — Heavy WD — 15.3 g [FACT(PDB)] — Compact Round Heavy: Same Mass as Eight Heavy, Lower I per Gram, High Unit-to-Unit Variance

### 1. Geometry

Heavy WD — 15.3 g [FACT(PDB)]. Compact round profile — not 8-spoke, not wide. The perimeter is a solid rounded outer ring with less spoke-and-rim articulation than Eight Heavy. Source beys: Saizo, Bistool, Bakushin-Oh, and many others. PlasticsDB notes "broad weight variance across individual copies (no discrete named molds)" — some units significantly heavier or lighter than 15.3g due to production variability.

### 2. Physics

**Compact vs 8-spoke distribution:**
Heavy WD's solid compact profile concentrates mass at moderate radius vs Eight Heavy's perimeter-concentrated spokes:

    Estimated r_mean_heavy ≈ 21–22 mm (solid ring, lower outer radius than 8-spoke)
    I_Heavy ≈ 0.5 × 0.0153 × (0.023² + 0.019²) ≈ 7.0 × 10⁻⁶ kg·m²

    vs Eight Heavy I ≈ 7.55 × 10⁻⁶ kg·m²

At same 15.3g mass, Eight Heavy produces 7.8% more inertia due to better peripheral distribution.

**Weight variance implication:**
"Broad weight variance" means the 15.3g figure is a nominal average. Some Heavy WDs measure 14.8g, others 15.8g. In competitive play, always weigh individual units; do not assume the nominal.

**When to use over Eight Heavy:**
Height-sensitive combos (low base height requiring compact vertical profile): Heavy WD's solid ring is shorter/flatter than Eight Heavy's 8-spoke, enabling lower center-of-mass in tight-fit configurations. This is the only case where Heavy outperforms Eight Heavy.

### 3. Game Engine Mapping

```typescript
interface HeavyWD {
  name: "heavy";
  system: "SGS";
  mass_g: 15.3;                    // [FACT(PDB)] — nominal; high unit variance
  profile: "solid_compact_round";
  outerRadius_mm: 22;              // [ESTIMATED] — more compact than 8-spoke
  momentOfInertia_kgm2: 7.0e-6;   // [ESTIMATED]
  weightVariance: "high";          // broad across individual copies
  universalFit: true;
  competitiveTier: "mid";
  vsEightHeavy: {
    massEqual: true;
    iLower: true;
    heightLower: true;             // compact profile → lower CoM in tight bases
    preferEightHeavy: "generally";
    preferHeavy: "height_sensitive_combo";
  };
  sourceBeys: ["saizo_bey", "bistool", "bakushin_oh", "others"];
}
```

### 4. Verdict

**Role:** Compact round heavy WD. Heavy WD matches Eight Heavy's mass (15.3g) but with 7.8% less inertia due to its compact solid profile. In most combos, Eight Heavy is the superior choice at the same weight. Heavy WD's advantage is dimensional: its flatter, more compact vertical profile suits height-sensitive bases where Eight Heavy's taller spoke architecture won't seat correctly. High unit-to-unit weight variance means always measure individual copies. Tier: mid — functional, but prefer Eight Heavy unless height constraints apply.

---

## Case 257 — Heavy Attack WD (Gaia Dragoon / all variants) — 16.0 g [FACT(PDB)] — Compact High-Mass: Heaviest Non-Ten WD, Gaia Dragoon Exclusive Distribution

### 1. Geometry

Heavy Attack WD — 16.0 g [FACT(PDB)]. Compact profile similar to Heavy WD but heavier by 0.7g. Sources: Gaia Dragoon (all color variants) — the widest distribution of any single WD to one beyblade across its color range. Unlike Ten Heavy (16.1g, 10-spoke wide distribution) or Eight Heavy (15.3g, 8-spoke), Heavy Attack uses a compact round architecture with 16.0g mass.

### 2. Physics

**Mass position in WD spectrum:**
| WD | Mass | Profile | I_est |
|----|------|---------|-------|
| Eight Heavy | 15.3g | 8-spoke | 7.55×10⁻⁶ |
| Heavy Attack | 16.0g | compact round | 7.3×10⁻⁶ |
| Ten Heavy | 16.1g | 10-spoke wide | 8.9×10⁻⁶ |

Heavy Attack (16.0g compact) vs Ten Heavy (16.1g wide):
- Nearly same mass but dramatically different I: Ten Heavy has peripheral spokes at larger radius
- Heavy Attack loses I per gram vs Ten Heavy
- But: Heavy Attack's compact round profile is 7.3 × 10⁻⁶ kg·m² vs Heavy WD's 7.0 × 10⁻⁶ — marginally better than plain Heavy

**Attack-oriented name:**
"Attack" suffix in plastic gen WDs typically indicates a design optimized for lower CoM (compact) to sit closer to the AR contact zone, providing better mass coupling during smash hits. The compact round profile at 16.0g means the bey's inertial mass resists post-contact angular deflection well without extending to wide-distribution stamina territory.

**Spin decay rate:**
τ_floor ≈ μ_tip × m_total × g × r_tip (depends on BB)
I contribution from Heavy Attack WD:
    I_HA ≈ 7.3 × 10⁻⁶ kg·m²
    dω/dt from WD alone: 13% improvement over Eight Balance baseline

### 3. Game Engine Mapping

```typescript
interface HeavyAttackWD {
  name: "heavy_attack";
  system: "SGS";
  mass_g: 16.0;                    // [FACT(PDB)]
  profile: "compact_round_heavy";
  outerRadius_mm: 23;              // [ESTIMATED]
  momentOfInertia_kgm2: 7.3e-6;   // [ESTIMATED]
  universalFit: true;
  competitiveTier: "mid";
  note: "Heaviest compact WD — but Ten Heavy (16.1g, 10-spoke) has better I at near-same mass";
  sourceBeys: ["gaia_dragoon", "gaia_dragoon_color_variants"];
  vsTenHeavy: {
    massDiff: -0.1,
    iDiff: -1.6e-6,
    profileAdvantage: "compact_for_low_attack_combos"
  };
}
```

### 4. Verdict

**Role:** Compact high-mass attack WD. Heavy Attack WD's 16.0g in a compact profile fills the niche between Eight Heavy (lighter, 8-spoke) and Ten Heavy (heavier, 10-spoke, wider). For pure stamina/I maximization, Ten Heavy (16.1g, I ≈ 8.9×10⁻⁶) is superior — 0.1g more mass, much better I per gram. For attack combos needing compact low CoM at maximum available mass without wide-distribution risks, Heavy Attack is the best option. Available from all Gaia Dragoon color variants — one of the most accessible heavy compact WDs. Tier: mid — useful, but Ten Heavy wins for stamina and competitive use.

---

## Case 258 — Viper Metal Ball Base (Draciel V) — 8.2 g [FACT(PDB)] — Ball-in-Shaft Design: Metal Ball Tip on Metal Pole, Magnecore-Dependent, Non-Competitive

### 1. Geometry

Viper Metal Ball Base is the Blade Base of Draciel V (Draciel Viper, V-Force era). Weight: 8.2 g [FACT(PDB)]. Tip mechanism: a somewhat free-spinning small metal ball connected to the SG (Spin Gear) by a metal pole. The metal pole rests in contact with the ball — the ball is the floor contact point, the pole is the structural mount. Magnecore is integrated to prevent the metal balls from moving outward (a failure mode in predecessor Draciel bases: SG Metal Ball Base, Case 248, which kept the metal balls in the base body rather than the shaft).

### 2. Physics

**Ball-in-shaft vs body-ball design:**
| Feature | SG Metal Ball Base (Case 248) | Viper Metal Ball Base |
|---------|------------------------------|----------------------|
| Ball location | Base body housing | Metal shaft/pole tip |
| Ball count | Multiple (housing) | Single at pole tip |
| μ contact | 0.12 (steel-on-ABS) | 0.12–0.15 [ESTIMATED] |
| Magnecore | Optional (standard SG) | Required (prevents ball migration) |
| Competitive tier | Tier 2 defense | Non-competitive |

The key difference: Viper Metal Ball Base mounts a single metal ball at the END of a metal pole. This pole-and-ball assembly has more compliance than SG Metal Ball Base's housing-contained balls — the pole can flex or wobble slightly, introducing instability.

**Magnecore dependency:**
Without Magnecore, the metal ball tends to migrate outward on the pole contact — reducing tip contact stability. The Magnecore's field provides lateral constraint that substitutes for mechanical housing containment. This means Viper Metal Ball Base is architecturally dependent on Magnecore Beys / V-Force MGS builds.

**Performance vs SG Metal Ball Base:**
SG Metal Ball Base (8.2g equivalent to 6.1g base + 2.0g ball hardware) with μ = 0.12 achieves Tier 2 defense. Viper Metal Ball Base at 8.2g total with single-ball pole tip:

    Stability: LOWER than SG Metal Ball Base (pole compliance, single contact point)
    Defense: LOWER (less floor-hold from single ball vs multi-ball housing)
    Attack resistance: LOWER ("severely susceptible to low attackers" — PlasticsDB)

PlasticsDB verdict: "a totally useless part."

**Draciel V context:**
Draciel V is a V-Force era bey (early S2) — a transitional design before the SG Metal Ball Base was optimized. The Viper Metal Ball Base represents an early attempt to put metal ball contact in a compact form factor that failed mechanically.

### 3. Game Engine Mapping

```typescript
interface ViperMetalBallBase {
  name: "viper_metal_ball_base";
  system: "SGS";
  sourceBey: "Draciel V (Draciel Viper)";
  mass_g: 8.2;                       // [FACT(PDB)]
  tipType: "metal_ball_on_pole";
  tipBallRadius_mm: 1.5;             // [ESTIMATED small ball]
  mu: 0.14;                          // [ESTIMATED — steel-on-plastic, pole compliance]
  magnecoreRequired: true;           // prevents ball outward migration
  poleCompliance: true;              // introduces tilt instability
  competitiveTier: "non_competitive";
  vsSGMetalBallBase: {
    mass: "equal_approx",
    stability: "lower",
    defense: "lower",
    attackResistance: "much_lower"
  };
  plasticdbNote: "totally useless part";
  historicalNote: "Early attempt at compact metal ball tip — superseded by SG Metal Ball Base";
}
```

### 4. Verdict

**Role:** Non-competitive transitional base. Viper Metal Ball Base was an early V-Force era attempt to deliver metal ball floor contact in a compact, pole-mounted form. The single metal ball on a pole tip provides less stability and defense than SG Metal Ball Base (Case 248), requires Magnecore to function, and is "severely susceptible to low attackers" (PlasticsDB). No competitive donor applications. Historical interest only: it represents the prototype concept for metal ball tips that SG Metal Ball Base later perfected. Tier: non-competitive. Do not use when SG Metal Ball Base is available.

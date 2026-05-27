---

## Case 124 — Metal Saucer AR (Gaia Dragoon MS / Strata Dragoon MS) — ~15 g [ESTIMATED] — Spin-Steal Saucer: Smooth Arc Perimeter + Shared-Frame Inheritance + Left-Spin Orbit Drain

### 1. Geometry

Metal Saucer is an HMS Attack Ring for Gaia Dragoon MS (A-123, Takara; Hasbro: Strata Dragoon MS), Daichi Sumeragi's HMS iteration. The AR is constructed with an ABS plastic caul bonded to a die-cast zinc-alloy metal frame. Unlike the acute-slope upper-attack geometry dominant in most HMS ARs, Metal Saucer's metal frame traces a saucer-disc silhouette: a broad shallow curve around the full perimeter with no steep angle breaks. This continuous arc face means that approaching opponents glance along the saucer curve rather than catching on a smash slope.

Weight: ~15 g [ESTIMATED — linka HMSDB cache]. Outer contact radius ≈ 23 mm (wide HMS AR). Frame material: zinc alloy (ρ ≈ 6,600 kg/m³). Fold symmetry: approximately 2-fold (saucer geometry). Contact type: tangential glancing. The shared metal frame designation ("shared Metal Frame" per linka bey file) indicates the saucer frame appears across multiple HMS spin-steal builds.

### 2. Physics

**Spin-steal via glancing contact:**
The saucer perimeter angle θ_saucer ≈ 3–5° from tangent. Smash fraction sin(3°) ≈ 0.052 — negligible outward impulse. Recoil fraction cos(3°) ≈ 0.999 — almost all contact force is redirected back along the saucer curve, absorbed without imparting substantial KO impulse.

The critical mechanic is spin-steal. On contact duration Δt ≈ 2–4 ms, the saucer surface slides along the opponent's AR. The friction force:

    F_fric = μ_metal × F_N,    μ_metal ≈ 0.15 (zinc–ABS)
    τ_steal = F_fric × r_eff ≈ 0.15 × 0.8 × 0.023 ≈ 0.0028 N·m

Integrated over contact duration Δt = 0.003 s, spin stolen per contact:

    Δω_steal ≈ τ_steal × Δt / J_opponent ≈ 0.0028 × 0.003 / 0.0003 ≈ 0.028 rad/s

This is sub-threshold per hit, but repeated orbital contacts (typically 6–12 passes per battle in a sustained orbit approach) accumulate:

    Σ Δω_steal (10 hits) ≈ 0.28 rad/s — measurable opponent spin drain over battle duration

**Mass at radius:**
At ~15 g total AR mass, majority concentrated in the metal frame at r ≈ 20–22 mm:

    ΔI_AR ≈ 0.012 × (0.021)² ≈ 5.3 × 10⁻⁶ kg·m²

This contributes to the combo's rotational inertia, supporting sustained orbit at lower spin rates (a spin-steal archetype benefit — the AR's own I contributes to survival during orbit).

**Gaia Dragoon MS full assembly:**
- AR: Metal Saucer ~15 g
- WD: Circle Heavy ~16 g
- RC: Flat Core (aggressive flat metal tip, μ ≈ 0.35–0.45 steel-on-ABS floor)
- Estimated total: ~15 + 16 + 7–9 (Flat Core + BP) ≈ 38–40 g

The Flat Core RC's aggressive flat movement propels Gaia Dragoon MS across the stadium at speed, enabling repeated saucer-perimeter contacts with the opponent. Each orbit pass = one spin-steal pulse.

**Daichi's dual-spin:**
Left-spin orientation rotates the saucer contact geometry so outward-facing contact runs right-to-left relative to the opponent, shifting spin-steal torque direction. Both spin directions produce valid glancing-contact spin-steal profiles; right-spin is conventional, left-spin enables same-directional orbit against right-spin opponents (co-rotation approach).

### 3. Game Engine Mapping

```typescript
interface MetalSaucerAR {
  name: "metal_saucer";
  system: "HMS";
  sourceBey: "Gaia Dragoon MS / Strata Dragoon MS";
  mass_g: 15;                    // [ESTIMATED]
  contactAngle_deg: 4;           // saucer glancing angle
  smashFraction: 0.070;          // sin(4°) — negligible smash
  recoilFraction: 0.997;         // cos(4°) — almost all tangential
  spinStealRate_perContact: 0.028; // rad/s per 3 ms contact
  outerRadius_mm: 23;
  foldSymmetry: 2;
  contactMaterial: "zinc_alloy";
  competitiveTier: "mid_spin_steal";
  archetype: "orbit_drain";
  sharedMetalFrame: true;        // frame shared with other HMS spin-steal ARs
  pairedRC: "flat_core";         // orbit-based attack pattern RC
}

function saucerSpinDrainPerBattle(
  contactsPerBattle: number,      // typically 8–12
  deltaOmegaPerContact: number    // ≈ 0.028 rad/s
): number {
  return contactsPerBattle * deltaOmegaPerContact;
  // 10 contacts × 0.028 = 0.28 rad/s opponent drain
}
```

### 4. Verdict

**Role:** Spin-steal / orbit attacker. Metal Saucer's saucer perimeter is the defining mechanic: near-zero smash angle means no KO impulse, but sustained orbit contacts drain opponent spin via friction. The Flat Core RC (Gaia Dragoon MS stock) is the natural partner — it drives the orbit pattern needed for repeated saucer contacts. Competitive tier: mid — spin-steal ARs are niche in HMS (Upper Attack dominates), but Metal Saucer is a credible donor part for spin-steal custom builds. The "Spike Saw" anime special (Daichi's orbital shearing attack) correctly represents the mechanic: many grazing contacts = cumulative spin drain, not single-hit KO.

---

## Case 125 — Spiral Upper AR (Dranzer MS) — ~20 g [ESTIMATED] — Omnidirectional Slope: Spiral Geometry Eliminates Contact-Angle Dead Zones

### 1. Geometry

Spiral Upper is the HMS Attack Ring of Dranzer MS (A-131, Kai Hiwatari's 7th bey). The zinc-alloy metal frame traces spiral curves around the AR perimeter — unlike straight-slope upper-attack ARs whose attack angle peaks at a single leading edge and drops off symmetrically, the spiral curve maintains a consistent slope angle across the full perimeter arc.

Weight: ~20 g [ESTIMATED — linka HMSDB cache]. Contact geometry: spiral-wound slope, upper-attack orientation. Coverage of attack-viable arc: spiral wraps continuously → ≈ 180° effective upper-attack arc vs. ~60–80° for typical straight-slope ARs. The phoenix-wing motif continues Dranzer's visual identity (Cross Attacker plastic-gen AR → Spiral Upper HMS AR).

### 2. Physics

**Omnidirectional upper attack:**
For a straight-slope upper AR (e.g., Samurai Upper), the upper-attack angle α is maximal at the leading edge and near-zero at the trailing edge. The effective upper-attack window per face is:

    θ_window_straight ≈ 60–70°

For Spiral Upper, the spiral curvature keeps α approximately constant as the opponent approaches from any angle within the spiral arc:

    θ_window_spiral ≈ 160–180° (effectively omnidirectional)

This means Spiral Upper generates consistent upper-attack lift regardless of the approach angle — an opponent approaching from the side, from slightly behind, or head-on all encounter a viable upper-attack ramp.

**Upper-attack lift:**
At α_effective ≈ 35° (spiral slope angle, estimated):

    F_upper = F_N × sin(35°) = F_N × 0.574

For a contact normal force F_N ≈ 8 N (typical HMS close-range contact):

    F_upper ≈ 4.6 N   (vertical component, opposes gravity and destabilizes opponent tilt)

The upper-attack impulse lifts the opponent AR, shifting its contact point upward and reducing its gyroscopic coupling with the floor, triggering tilt-amplification (precession → nutation → stadium exit).

**Mass contribution:**
~20 g at r ≈ 22 mm: ΔI_AR ≈ 0.020 × (0.022)² ≈ 9.7 × 10⁻⁶ kg·m². Substantial I contribution — the heavy AR increases rotational inertia, improving spin conservation during the upper-attack exchange.

**Dranzer MS assembly:**
Manual Change Core (pre-battle tip selection) + Circle Balance WD + Spiral Upper AR. Kai's typical use: Attack tip (manual pre-set) for aggressive launch, switching to Survival tip against defensive opponents. Spiral Upper remains effective regardless of which tip is selected since the AR geometry determines contact profile, not the RC.

### 3. Game Engine Mapping

```typescript
interface SpiralUpperAR {
  name: "spiral_upper";
  system: "HMS";
  sourceBey: "Dranzer MS";
  mass_g: 20;                     // [ESTIMATED]
  slopeAngle_deg: 35;             // spiral slope angle (estimated)
  upperAttackFraction: 0.574;     // sin(35°)
  effectiveWindowDeg: 170;        // omnidirectional vs 70° for straight-slope
  outerRadius_mm: 22;
  attackType: "upper_omnidirectional";
  spiralGeometry: true;           // eliminates dead zones
  competitiveTier: "high";
  pairedRC: "manual_change_core";
  phoenixWingMotif: true;
}

function spiralUpperContactProbability(
  approachAngle_deg: number       // opponent approach angle relative to leading edge
): number {
  // Straight-slope: P = (θ_window / 360) = 0.19
  // Spiral: much wider — constant contact across full 170° arc
  return approachAngle_deg <= 170 ? 0.574 : 0.0;
  // Simplified: any approach within 170° arc hits the upper slope
}
```

### 4. Verdict

**Role:** Top-tier HMS Upper Attack AR. The spiral geometry eliminates the dead-zone problem that limits straight-slope upper ARs — opponents cannot approach from an "off-angle" to avoid the slope. Dranzer MS's pairing with the Manual Change Core is appropriate: Kai selects the attack tip when Spiral Upper's omnidirectional ramp can launch opponents, and the survival tip when endurance is needed. Competitive tier: HIGH — Spiral Upper is among the best upper-attack ARs in the HMS system, rivaling Samurai Upper in practical coverage.

---

## Case 126 — Upper Dragon AR (Dragoon MF) — 19 g [FACT] — Shared-Frame Dual Attack: Left-Spin Metal Smash Primary, Right-Spin Upper Attack Blocked

### 1. Geometry

Upper Dragon is the HMS Attack Ring for Dragoon MF (RBA3 prize, Tyson Granger's manga HMS bey). The zinc-alloy metal frame is shared across three Gimmick Specialty ARs: Upper Dragon, Upper Fox (Phantom Fox MS), and Devil Crusher (Bloody Devil MS). All three carry identical frame geometry; the ABS plastic caul shape determines each AR's performance differential.

Weight: 19 g [FACT — from linka dragoon-mf.md]. Material: ABS plastic body + die-cast zinc alloy frame. Contact asymmetry: in right spin, the ABS caul BLOCKS the lower portion of the metal frame's upper-attack slopes, reducing upper attack output. In left spin, the metal frame spikes are exposed at the perimeter, enabling direct metal-contact smash. Additional ABS caul spikes add secondary smash contact points.

### 2. Physics

**Left-spin smash (primary role):**
Metal frame spikes exposed in left spin produce direct zinc-alloy contact:

    α_smash_LS ≈ 20° (estimated from exposed spike geometry)
    Smash fraction = sin(20°) ≈ 0.342
    Contact material: zinc alloy → high elastic modulus (E ≈ 85 GPa), low deformation → clean impulse delivery

Metal-contact smash vs plastic-contact smash: for equivalent contact force F_N, metal contact produces approximately 35–50% higher impulse magnitude due to lower energy absorption during collision (metal elastic, ABS viscoelastic). Upper Dragon's left-spin metal spike contacts thus outperform same-angle ABS-dominant contacts in smash effectiveness.

**Right-spin upper attack (blocked):**
The ABS caul covers the bottom portion of the upper-attack ramp:

    Effective upper-attack angle (right spin): α_UA_eff ≈ 20° (reduced from frame's nominal 35°)
    Upper fraction = sin(20°) ≈ 0.342 (vs. 0.574 for unobstructed 35° slope)
    Output: ~60% of Spiral Upper's omnidirectional upper — weaker, lower

**Mass at radius:**
19 g at r_eff ≈ 21 mm: ΔI_AR ≈ 0.019 × (0.021)² ≈ 8.4 × 10⁻⁶ kg·m². Substantial I contribution.

**Shared frame family:**
| AR | Left-Spin | Right-Spin | Key Differentiator |
|----|-----------|-----------|-------------------|
| Upper Dragon | Metal smash (strongest) | Upper attack (blocked) | Most exposed metal in LS |
| Upper Fox | Metal smash (mid) | Upper attack | Plastic caul less aggressive LS geometry |
| Devil Crusher | Metal smash (weakest, round caul) | Upper attack | Most circular ABS caul — Defense viability in LS |

### 3. Game Engine Mapping

```typescript
interface UpperDragonAR {
  name: "upper_dragon";
  system: "HMS";
  sourceBey: "Dragoon MF";
  mass_g: 19;                      // [FACT]
  smashFractionLS: 0.342;          // sin(20°), metal contact
  upperAttackFractionRS: 0.342;    // sin(20°) — blocked by ABS caul
  contactMaterialLS: "zinc_alloy_exposed";
  contactMaterialRS: "abs_caul_blocks";
  sharedMetalFrame: ["upper_fox", "devil_crusher"];
  bestSpinDirection: "left";       // left-spin smash is primary role
  competitiveTier: "low_mid";
  outerRadius_mm: 21;
  secondarySpikes: 2;              // ABS caul spikes add secondary contact
}

function upperDragonSmashEffectiveness(
  spinDir: "left" | "right",
  F_N: number
): number {
  if (spinDir === "left") {
    // Metal exposed — higher impulse
    return F_N * 0.342 * 1.4;   // ×1.4 = metal contact bonus vs ABS
  } else {
    // ABS caul blocks → weaker upper attack
    return F_N * 0.342 * 0.8;   // reduced by caul obstruction
  }
}
```

### 4. Verdict

**Role:** Left-spin Smash Attack AR with secondary right-spin upper option. Upper Dragon is Tyson's HMS AR — a credible mid-tier donor for left-spin smash builds when Jiraiya Blade is unavailable. Its shared frame with Upper Fox and Devil Crusher makes all three ARs interchangeable at the frame level; the caul shape determines which spin direction receives priority. Left-spin Metal Weight Grip Core combos leverage both the metal spike smash and the RC's controlled rubber attack. Competitive tier: low-mid — functional, but Jiraiya Blade outperforms for dedicated smash builds.

---

## Case 127 — Devil Crusher AR (Bloody Devil MS) — ~19 g [ESTIMATED] — Shared-Frame Upper with Circular Caul: Weakest Smash, Most Defense Potential in Left Spin

### 1. Geometry

Devil Crusher is Bloody Devil MS's (MA-23) HMS Attack Ring. Its zinc-alloy metal frame is identical to Upper Dragon and Upper Fox — the same shared-frame acute-angled upper-attack geometry appears across all three Gimmick Specialty ARs. What distinguishes Devil Crusher is its ABS plastic caul: the most circular caul of the three, wrapping more completely around the metal frame and reducing the effective metal contact surface.

Weight: ~19 g [ESTIMATED — from linka bloody-devil-ms.md]. Two ABS contact points per caul face for right-spin smash. In left spin, the near-circular ABS caul dominates contact — three small protrusions per side provide secondary spin-steal contacts but minimal smash force.

### 2. Physics

**Right-spin upper attack:**
Metal frame slopes identical to Upper Dragon/Upper Fox. But ABS caul coverage is heavier — the caul blocks a larger portion of the slope base:

    α_UA_RS ≈ 18° (more blocked than Upper Dragon)
    Upper fraction = sin(18°) ≈ 0.309
    Two ABS contact points supplement but do not restore metal-slope upper output

**Left-spin defense:**
Circular ABS caul ≈ Defense profile (approaching constant tangential geometry):

    Contact angle LS ≈ 5–8° (very low smash angle due to caul roundness)
    Smash fraction LS ≈ sin(6°) ≈ 0.105

The round profile deflects incoming attacks back to the attacker:

    Recoil fraction = cos(6°) ≈ 0.995 — opponent suffers full recoil

Three ABS protrusions passively shave opponent spin via friction (μ_ABS ≈ 0.30):

    Δω_steal_LS ≈ 0.015 rad/s per contact — minor but non-zero

**Competitive use:**
Devil Crusher as Samurai Upper substitute: provides upper-attack geometry for custom builds when Samurai Upper is unavailable. As a left-spin defense substitute: circular profile approximates a low-recoil defense shell — usable in left-spin defense customs pairing with Bearing Core or Shooter Change Core Gamma.

### 3. Game Engine Mapping

```typescript
interface DevilCrusherAR {
  name: "devil_crusher";
  system: "HMS";
  sourceBey: "Bloody Devil MS";
  mass_g: 19;                          // [ESTIMATED]
  upperAttackFractionRS: 0.309;        // sin(18°) — caul blocks more than Upper Dragon
  smashFractionLS: 0.105;             // sin(6°) — near-circular caul
  recoilFractionLS: 0.995;            // cos(6°) — deflects attacks
  spinStealLS_perContact: 0.015;      // minor passive spin steal
  sharedMetalFrame: ["upper_dragon", "upper_fox"];
  leftSpinRole: "defense_substitute";
  rightSpinRole: "upper_attack_substitute";
  caul: "most_circular_of_shared_frame";
  competitiveTier: "low_mid";
}
```

### 4. Verdict

**Role:** Flexible substitute AR — right-spin upper attack (weaker than Samurai Upper), left-spin defense (via circular caul). Devil Crusher is the weakest attacker among the shared-frame family but the best defender. Its circular caul is a practical defense upgrade for Bloody Devil MS's gimmick architecture. The Shooter Change Core Alpha's pre-launch tip selection pairs naturally — left-spin = semi-flat tip (controlled defense) + Devil Crusher's circular defense profile. Tier: low-mid, useful as a parts donor when top-tier options are unavailable.

---

## Case 128 — Knight Crusher AR (Aero Knight MS) — 19 g [FACT] — High-Recoil Symmetric Nub: No Viable Attack or Defense in Either Spin

### 1. Geometry

Knight Crusher is Aero Knight MS's (MA-21) Attack Ring — one of the weakest HMS ARs ever released. The zinc-alloy metal frame consists of two symmetric blunt nub protrusions embedded in an ABS plastic body. Unlike slope-based ARs (upper or smash), the nubs are short and perpendicular to the contact plane: no ramp geometry → no upper attack, no extended smash slope.

Weight: 19 g [FACT — from linka aero-knight-ms.md]. Contact type: sudden blunt impact (nub geometry). Both right and left spin produce the same outcome: the leading nub face contacts the opponent head-on, generating maximum recoil with minimum forward impulse.

### 2. Physics

**Blunt contact impulse analysis:**
For a nub protruding at α_nub ≈ 90° from tangent (direct perpendicular):

    Smash fraction = sin(90°) = 1.00   (maximum radial impulse)
    Recoil fraction = cos(0°) = 1.00   (maximum self-recoil)

This means BOTH beys receive equal and opposite impulses — Knight Crusher hits the opponent hard radially but simultaneously kicks itself backward equally. In asymmetric mass cases (Knight Crusher combo ~38 g vs opponent ~38 g):

    J_contact = (m1 × m2 / (m1 + m2)) × Δv_rel ≈ 0.019 × 2.0 ≈ 0.038 N·s
    Δv_KnightCrusher = 0.038 / 0.038 = 1.0 m/s backward

This backward kick is KO-dangerous: the Aero Core RC is tall and the Aero Wing adds drag — Knight Crusher's own recoil destabilizes the bey before it can destabilize the opponent.

**Left-spin additional penalty:**
In left spin, the plastic ABS surrounding the metal nubs presents as the leading face before the metal. Sudden plastic-face collision → nub arrives with reduced velocity after ABS deformation:

    Effective smash velocity: 85% of right-spin (ABS absorption layer)
    Recoil is unchanged → recoil-to-smash ratio worsens in LS

**Net verdict per spin:**
- Right spin: equal smash + equal recoil = net neutral at best, dangerous against heavier opponents
- Left spin: reduced smash + full recoil = negative net → actively harmful

### 3. Game Engine Mapping

```typescript
interface KnightCrusherAR {
  name: "knight_crusher";
  system: "HMS";
  sourceBey: "Aero Knight MS";
  mass_g: 19;                     // [FACT]
  nubCount: 2;                    // symmetric blunt nubs
  contactAngle_deg: 90;           // perpendicular nub contact
  smashFraction: 1.00;            // maximum radial impulse
  selfRecoilFraction: 1.00;       // equal self-recoil
  leftSpinPenalty: 0.15;          // ABS absorption before metal
  competitiveTier: "non_competitive";
  primaryRole: "none";
  harvestValue: "circle_wide_wd"; // Circle Wide is the reason to acquire this bey
  donorValue: false;
}
```

### 4. Verdict

**Role:** None. Knight Crusher is among the weakest HMS ARs — the symmetric blunt nubs generate equal recoil in both spin directions, making it actively harmful to the user. The only reason to acquire Aero Knight MS is the Circle Wide Weight Disk (14 g, best available from this bey). Knight Crusher has no donor applications; it should be set aside immediately on acquisition. Tier: F.

---

## Case 129 — God Smasher AR (Shining God MS) — 18 g [FACT] — Wide-Caul Smash: Force Smash Left Weak, Right Smash Moderate; Shared Frame with Smash Leopard and Smash Phoenix

### 1. Geometry

God Smasher is the final HMS AR released under Takara's Original Series (MA-24, Shining God MS). Its zinc-alloy metal frame is shared with Smash Leopard (Dark Leopard MS) and Smash Phoenix (Dranzer MF). The distinguishing feature is God Smasher's large, aggressively shaped ABS caul — wider than Smash Leopard — extending the overall contact perimeter. Two ABS contact points per side in right spin; in left spin the metal frame delivers Force Smash.

Weight: 18 g [FACT — from linka shining-god-ms.md]. Frame family: Smash Leopard / God Smasher / Smash Phoenix share the same zinc-alloy smash-oriented frame (contrast with upper-attack family: Upper Dragon / Upper Fox / Devil Crusher).

### 2. Physics

**Left-spin Force Smash:**
Force Smash geometry is a compound contact: the leading edge catches under the opponent AR, then the following slope face lifts. In left spin for God Smasher's metal frame:

    α_Force_LS ≈ 22° (slope angle on LS-facing frame surface)
    Force Smash = sin(22°) ≈ 0.374 (upward component)

However, the large ABS caul partially covers the metal frame's force-smash faces:

    Effective Force Smash fraction ≈ 0.374 × 0.75 = 0.281 (caul coverage reduces delivery)

This is weaker than dedicated force-smash ARs earlier in the HMS line (e.g., dedicated slope-profile ARs on competitive beys).

**Right-spin smash:**
Two ABS contact points per face, contact angle α_RS ≈ 25°:

    Smash fraction RS = sin(25°) ≈ 0.423
    Material: ABS → moderate energy absorption, reduces effective impulse by ~20–25%
    Effective smash: ≈ 0.423 × 0.78 = 0.330

The wider ABS caul gives God Smasher broader attack range than Smash Leopard — contacts occur over a wider arc but each individual contact is weaker (plastic-dominant).

**Comparative table — smash frame family:**
| AR | LS Force Smash | RS Smash | Contact Width |
|----|---------------|---------|--------------|
| Smash Leopard | ~0.35 (narrow) | ~0.35 | Narrower |
| God Smasher | ~0.281 (caul reduces) | ~0.330 | Wider |
| Smash Phoenix | ~0.35 (wing-profile) | ~0.35 | Wide (wing protrusions) |

### 3. Game Engine Mapping

```typescript
interface GodSmasherAR {
  name: "god_smasher";
  system: "HMS";
  sourceBey: "Shining God MS";
  mass_g: 18;                          // [FACT]
  forceSmashFractionLS: 0.281;         // sin(22°) × 0.75 caul reduction
  smashFractionRS: 0.330;             // sin(25°) × 0.78 ABS absorption
  contactWidthBonus: 1.15;            // wider than Smash Leopard
  sharedMetalFrame: ["smash_leopard", "smash_phoenix"];
  plasticDominantContact: true;        // ABS caul is primary RS contact
  competitiveTier: "low";
  pairedRC: "shooter_change_core_gamma";
  acquireFor: "cwd_god_ring";
}
```

### 4. Verdict

**Role:** Low-tier Smash AR. God Smasher arrives late in the HMS lifecycle when better smash options already exist. Its wide ABS caul gives broader range than Smash Leopard but at the cost of weaker per-contact impulse (ABS vs metal contact). The force smash (left-spin) output is reduced by caul coverage. Its primary use is enabling Shining God MS builds where CWD God Ring is the real prize — God Smasher is the donor tax. Tier: low. Use only when Jiraiya Blade and other top smash ARs are unavailable.

---

## Case 130 — Smash Phoenix AR (Dranzer MF) — ~18 g [ESTIMATED] — Wide-Wing Horizontal Smash: Phoenix-Wing Perimeter, Metal-Reinforced Mid-Tier Smash, Kai's Final HMS AR

### 1. Geometry

Smash Phoenix is Dranzer MF's Attack Ring — Kai Hiwatari's final HMS iteration (manga: Bakuten Shoot Beyblade: Rising; no anime appearance). The zinc-alloy metal frame is shared with Smash Leopard and God Smasher. The ABS caul is shaped as wide phoenix wings, extending outward at the contact perimeter — this differs from God Smasher's caul by providing a distinctly wider lateral attack surface via the wing-profile protrusions.

Weight: ~18 g [ESTIMATED — from linka dranzer-mf.md]. Spin: both RS primary, LS secondary (contact angle shifts). The phoenix-wing motif continues the Cross Attacker → Spiral Upper → Smash Phoenix Dranzer evolutionary design line.

### 2. Physics

**Right-spin smash (primary):**
Wing-shaped ABS perimeter contact at α_RS ≈ 25° (horizontal smash orientation):

    Smash fraction RS = sin(25°) ≈ 0.423
    Contact material: ABS dominant with metal frame behind → effective impulse ≈ 0.423 × 0.85 = 0.360

The wide wing profile means contact occurs over a broader arc than God Smasher or Smash Leopard:

    Contact arc RS ≈ 80° vs ~55° for Smash Leopard → 45% more contact opportunities per pass

**Left-spin geometry shift:**
Contact angle shifts to α_LS ≈ 18° (wing-back contact surface):

    Smash fraction LS = sin(18°) ≈ 0.309 — usable secondary smash

**Comparative advantage vs Smash Leopard:**
Smash Phoenix's wider wing caul gives it 45% more contact arc surface than Smash Leopard. At equivalent smash fractions, this translates to 45% more KO opportunities per battle in aggressive orbit use.

**Free Shaft Core RC synergy:**
The Free Shaft Core's decoupled inner shaft absorbs smash recoil — the outer body pivots on impact while the inner shaft continues spinning. This means Smash Phoenix + Free Shaft Core effectively reduces self-spin-loss per hit by approximately 20–30%, enabling sustained smash trading that a conventional flat-tip AR + RC combination cannot achieve.

### 3. Game Engine Mapping

```typescript
interface SmashPhoenixAR {
  name: "smash_phoenix";
  system: "HMS";
  sourceBey: "Dranzer MF";
  mass_g: 18;                          // [ESTIMATED]
  smashFractionRS: 0.360;             // sin(25°) × 0.85 material factor
  smashFractionLS: 0.309;             // sin(18°) secondary LS
  contactArcRS_deg: 80;               // wide wing profile
  contactArcSmashLeopard_deg: 55;     // reference: Smash Leopard narrower
  contactArcAdvantageVsSmashLeopard: 1.45;
  sharedMetalFrame: ["smash_leopard", "god_smasher"];
  primaryRole: "horizontal_smash_rs";
  phoenixWingProfile: true;
  pairedRC: "free_shaft_core";        // spin retention on smash exchange
  competitiveTier: "mid";
  pilotCanon: "Kai Hiwatari (manga only)";
}
```

### 4. Verdict

**Role:** Mid-tier HMS Smash AR. Smash Phoenix is Kai's final classical-era HMS AR and a credible mid-tier donor for smash builds. The wide wing perimeter increases contact opportunities over Smash Leopard, and the metal frame delivers real impulse on RS contact. Paired with the Free Shaft Core, it achieves a sustained smash-trading capability that makes Dranzer MF a viable aggressive balance build. Tier: mid — behind Jiraiya Blade and Samurai Upper in raw output but more accessible than Random Booster prize RCs.

---

## Case 131 — CWD God Ring (Shining God MS) — 18 g [FACT] — Near-Circular Mass Ring: Peer to CWD Defense Ring, Top-Tier HMS Weight Disk

### 1. Geometry

CWD God Ring is the Customize Weight Disk of Shining God MS (MA-24), and the most competitively valuable part in the set. Its ABS construction traces an almost complete circle — minimal asymmetry, near-uniform perimeter mass. Weight: 18 g [FACT — from linka shining-god-ms.md]. Profile: near-circular, heavy, centralized mass distribution. Unlike CWD Circle Wide (largest, lightest) or CWD Circle Heavy (heaviest, center-concentrated), God Ring sits between Circle Heavy and Circle Balance in mass while closely approximating Circle Defenser shape.

### 2. Physics

**Moment of inertia:**
Near-circular ring, r_outer ≈ 23 mm, wall thickness ≈ 4 mm, r_inner ≈ 19 mm:

    I_GodRing ≈ (m/2)(r_outer² + r_inner²) = (0.018/2)(0.023² + 0.019²) ≈ 3.5 × 10⁻⁶ kg·m²

For comparison:
- CWD Circle Heavy (16 g, more center-massed): I ≈ 3.0 × 10⁻⁶ kg·m²
- CWD Defense Ring from Sea Dragon (18 g, near-identical): I ≈ 3.5 × 10⁻⁶ kg·m²

God Ring and Defense Ring are mechanically equivalent — the "not fixed" distinction from Defense Ring has no practical consequence in competitive use (both seat equally well under HMS architecture loading).

**Spin velocity retention:**
The high I from perimeter mass directly increases angular momentum L = I × ω. For a given deceleration torque τ_tip:

    dω/dt = τ_tip / I

At I = 3.5 × 10⁻⁶ kg·m² vs baseline I_WD = 2.8 × 10⁻⁶ kg·m² (Circle Heavy reference):

    Spin decay improvement ≈ (3.5 - 2.8) / 2.8 = 25% slower spin decay per unit torque

God Ring's near-circular profile also minimizes wobble trigger from asymmetric mass distribution — contributing to gyroscopic stability at low spin rates (critical for late-battle zombie/compact combos).

**Controllability:**
Near-circular mass → zero preferential wobble direction → bey settles to precession axis smoothly when approaching stadium edge (LAD-favorable).

### 3. Game Engine Mapping

```typescript
interface CWDGodRing {
  name: "cwd_god_ring";
  system: "HMS";
  sourceBey: "Shining God MS";
  mass_g: 18;                          // [FACT]
  profile: "near_circular";
  outerRadius_mm: 23;
  innerRadius_mm: 19;
  momentOfInertia_kgm2: 3.5e-6;
  spinDecayImprovement: 0.25;          // 25% slower vs Circle Heavy baseline
  competitiveTier: "high";
  peerPart: "cwd_defense_ring";        // functionally equivalent
  isFixed: false;                      // non-fixed unlike Defense Ring (no difference in practice)
  bestRoles: ["upper_attack", "defense", "stamina"];
  notedAbsenceOf: "asymmetric_wobble"; // near-circular = zero preferential wobble axis
}
```

### 4. Verdict

**Role:** Top-tier HMS Weight Disk. CWD God Ring is functionally equivalent to CWD Defense Ring from Sea Dragon — both are the optimal HMS CWD for any Defense or Upper Attack build. The high moment of inertia and near-circular profile give superior spin retention, gyroscopic stability, and LAD support vs. the standard Circle WDs. Tier: HIGH. The primary reason to acquire Shining God MS; God Smasher AR and Shooter Change Core Gamma are secondary considerations.

---

## Case 132 — CWD Devil Saucer (Bloody Devil MS) — ~17 g [ESTIMATED] — Free-Spinning Spike CWD: Wide Attack Range with Zero Net Benefit

### 1. Geometry

CWD Devil Saucer is Bloody Devil MS's Customize Weight Disk. ABS plastic, approximately 17 g [ESTIMATED — from linka bloody-devil-ms.md]. Eight large spikes ring the perimeter, giving it the widest attack footprint of any standard HMS component. The CWD is free-spinning — it rotates independently of the bey body on its mounting shaft.

### 2. Physics

**Free-spin penalty:**
A free-spinning CWD decouples its rotational momentum from the bey body. When a spike contacts an opponent:

    J_spike = τ_contact × Δt

But since the disk is free-spinning relative to the body, the contact torque acts on the disk's own moment of inertia (I_disk), not the bey:

    I_disk_spike ≈ 0.017 × (0.024)² ≈ 9.8 × 10⁻⁶ kg·m²
    Δω_disk = J_spike / I_disk — the spike slows, not the opponent

The opponent receives an impulse proportional only to the linear momentum transferred via friction, which is:

    F_impact_effective ≈ μ × F_N (tangential only) ≈ 0.3 × 0.5 = 0.15 N (negligible)

**Self-damage:**
The free-spinning disk's spikes brush the stadium floor and walls as the bey orbits. Each floor brush:

    Torque_floor ≈ μ_floor × m_disk × g × r_mean ≈ 0.4 × 0.017 × 9.81 × 0.022 ≈ 0.0015 N·m
    Spin loss per floor brush ≈ τ × Δt / I_bey ≈ 0.0015 × 0.005 / 2.5×10⁻⁵ ≈ 0.30 rad/s

This is the host bey losing spin from its own CWD's floor drag — the CWD actively degrades the bey it belongs to.

**Net result:** Opponent damage ≈ 0.15 N (negligible). Host spin loss ≈ 0.30 rad/s per orbit pass. CWD Devil Saucer inflicts net-negative combat performance on Bloody Devil MS.

### 3. Game Engine Mapping

```typescript
interface CWDDevilSaucer {
  name: "cwd_devil_saucer";
  system: "HMS";
  sourceBey: "Bloody Devil MS";
  mass_g: 17;                       // [ESTIMATED]
  spikeCount: 8;
  freeSpin: true;
  attackRangeBonus: 1.30;           // 30% wider than typical HMS AR
  effectiveDamageToOpponent: 0.005; // near-zero — free-spin dissipates impact
  selfSpinLossPerOrbit_radPerS: 0.30; // host bey loses spin from own CWD drag
  competitiveTier: "non_competitive";
  acquireFor: "shooter_change_core_alpha";
  alternativeNote: "Structural architecture (WD-at-bottom RC) is the harvested value";
}
```

### 4. Verdict

**Role:** Non-competitive. CWD Devil Saucer's free-spinning design neutralizes all spike contacts against the opponent while adding floor-drag spin loss to the host bey. The widest attack surface in HMS produces zero net benefit. Acquire Bloody Devil MS for Shooter Change Core Alpha (WD-at-bottom architecture) and the upper-attack combo potential of Devil Crusher — not for this CWD. Tier: F.

---

## Case 133 — Wing Attacker CWD (Dranzer MF) — ~17 g [ESTIMATED] — Asymmetric Wing Protrusions: Smash-Attack Radius Extender

### 1. Geometry

Wing Attacker is a non-circular HMS Customize Weight Disk from Dranzer MF (Random Booster Act 4). ABS plastic, ~17 g [ESTIMATED — from linka dranzer-mf.md]. Two large wing-shaped protrusions extend outward from the disk body at symmetric positions — unlike all circular HMS CWDs, Wing Attacker deliberately extends the attack footprint via wing edges that reach beyond the standard AR perimeter.

Alternate releases ship with Reverse Defenser WD instead — this note indicates Wing Attacker is the "offensive" variant CWD and Reverse Defenser is the "defensive" variant for the same bey.

### 2. Physics

**Effective attack radius extension:**
Standard HMS AR outer radius ≈ 22–23 mm. Wing Attacker wing protrusion outer edge ≈ 26–28 mm (estimated from extension profile):

    ΔR_wing ≈ 4–5 mm extension beyond AR perimeter

This increases the effective attack radius from the ~22 mm AR to ~26 mm at the wing tip:

    ΔI_wing_mass ≈ 0.014 × (0.027)² = 1.0 × 10⁻⁵ kg·m²

The wing tips contact opponents that the AR alone would miss — especially in scenarios where the AR's contact geometry is partly blocked by the WD level.

**Smash via wing edge:**
Wing edge contact angle α_wing ≈ 30° (estimated from wing-tip geometry):

    Smash fraction = sin(30°) = 0.500

ABS material: effective impulse ≈ 0.500 × 0.75 = 0.375 per contact

Wing Attacker + Smash Phoenix AR combined smash footprint ≈ AR arc 80° + wing supplemental 40° ≈ 120° total — substantially wider than either component alone.

**Stamina/Defense penalty:**
Asymmetric protrusions create uneven mass distribution → wobble axis at wing positions → reduced gyroscopic stability at low spin rates. Wing Attacker is not suitable for stamina or defense builds.

### 3. Game Engine Mapping

```typescript
interface WingAttackerCWD {
  name: "wing_attacker_cwd";
  system: "HMS";
  sourceBey: "Dranzer MF";
  mass_g: 17;                       // [ESTIMATED]
  profile: "asymmetric_wing";
  wingCount: 2;
  baseRadius_mm: 22;
  wingTipRadius_mm: 27;             // [ESTIMATED]
  wingSmashFraction: 0.375;         // sin(30°) × 0.75 ABS factor
  smashFootprintExtension_deg: 40;  // supplemental smash arc beyond AR
  wobbleRisk: true;                 // asymmetric mass → gyro instability low spin
  staminaCompatible: false;
  defenseCompatible: false;
  competitiveTier: "mid";
  bestRole: "smash_attack_extender";
  pairedAR: "smash_phoenix";
}
```

### 4. Verdict

**Role:** Smash attack radius extender. Wing Attacker is designed to complement Smash Phoenix's wide contact profile by adding further reach via wing protrusions. In aggressive smash builds (Smash Phoenix + Wing Attacker + Free Shaft Core), the combined contact footprint approaches 120° — ensuring smash contact from almost any approach angle. Not suitable for defense or stamina. Tier: mid for attack builds; avoid for defense/stamina. Alternate Reverse Defenser WD is superior for non-attack configurations.

---

## Case 134 — Metal Change Core RC (Death Gargoyle MS) — ~3 g [ESTIMATED] — Angle-Activated Auto-Switch: Sharp (Level) → Flat (Tilted), Flower Pattern

### 1. Geometry

Metal Change Core is Death Gargoyle MS's Running Core and the origin of the HMS "Metal Change" mechanic — the same archetype that appeared in Driger S's Metal Change Base (plastic gen). The tip design is a central sharp metal point surrounded by a broad flat metal collar. When the bey spins level, it balances on the sharp point (Survival mode). When the bey tilts (from a hit or Sliding Shoot), the broad collar contacts the stadium floor (Attack mode).

Weight: ~3 g [ESTIMATED — from linka death-gargoyle-ms.md]. Height: LOW (short profile — designed to complement Circle Upper's upper-attack geometry by keeping the bey's height low for getting under opponents). Tip material: metal throughout (both point and collar).

### 2. Physics

**Tip geometry:**
- Sharp point: r_point ≈ 0.2–0.3 mm (metal sharp tip Hertz contact)
- Flat collar: r_collar ≈ 3–4 mm (broad metal flat contact)

**Mode switch angle:**
The bey switches from sharp to flat when tilt angle θ exceeds the collar contact angle:

    θ_switch ≈ arctan(h_tip / (r_collar - r_point)) ≈ arctan(0.5 / 3.5) ≈ 8°

So at θ > 8° tilt (easily triggered by a hit or Sliding Shoot), the broad collar engages:

    μ_metal_flat ≈ 0.15 (metal-on-ABS floor): aggressive movement
    At θ < 8°: sharp tip engaged: μ_metal_sharp ≈ 0.08–0.12 (stationary survival)

**Flower pattern (Sliding Shoot activation):**
Sliding Shoot biases the initial launch tilt → collar mode activates at launch. As the bey orbits the stadium wall, it alternates between:
- Near wall: higher speed, some tilt → collar active → aggressive movement phase
- Stadium center: lower speed, levels → sharp tip → survival/stationary phase

This creates the "flower pattern": repeated center-passes in survival mode alternating with wall-orbit attack phases. The pattern is mechanically self-sustaining because the collar's friction keeps the bey moving outward (toward wall tilt) and the sharp tip allows recovery (central survival).

**Spin decay comparison:**
| Mode | μ | dω/dt (35g combo) |
|------|---|-------------------|
| Sharp tip | 0.10 | ~8 rad/s² |
| Flat collar | 0.15 | ~12 rad/s² |
| Flower pattern (50/50) | 0.125 avg | ~10 rad/s² |

### 3. Game Engine Mapping

```typescript
interface MetalChangeCoreRC {
  name: "metal_change_core";
  system: "HMS";
  sourceBey: "Death Gargoyle MS";
  mass_g: 3;                        // [ESTIMATED]
  height: "low";
  tipModes: ["sharp_survival", "flat_attack"];
  switchAngle_deg: 8;               // tilt threshold for mode switch
  mu_sharpTip: 0.10;
  mu_flatCollar: 0.15;
  spinDecay_sharp_radPerS2: 8;
  spinDecay_flat_radPerS2: 12;
  autoSwitch: true;                 // passive, angle-triggered
  slidingShootPattern: "flower";    // center-survival + wall-attack alternation
  pairedAR: "circle_upper";         // low height complements upper-attack AR
}

function metalChangeCoreTipMode(tiltAngle_deg: number): "sharp" | "flat" {
  return tiltAngle_deg > 8 ? "flat" : "sharp";
}

function metalChangeCoreSpinDecay(
  tiltAngle_deg: number, mass_g: number
): number {
  const mu = tiltAngle_deg > 8 ? 0.15 : 0.10;
  // τ_tip = μ × m × g × r_eff
  const r_eff = tiltAngle_deg > 8 ? 0.003 : 0.0003;
  const tau = mu * (mass_g / 1000) * 9.81 * r_eff;
  const I = 2.5e-5; // typical 38g combo
  return tau / I;   // rad/s²
}
```

### 4. Verdict

**Role:** Auto-switching survival/attack RC. Metal Change Core's dual-mode metal tip is a genuine mechanical innovation for HMS: passive, angle-triggered, no pre-battle setup required. The flower pattern (Sliding Shoot) makes Death Gargoyle MS a center-threatening balance type that catches stationary opponents in their "safe zone." At ~3 g, it is among the lightest HMS RCs — keeping overall combo weight modest to complement Circle Upper's rim-heavy I distribution. A well-designed gimmick RC with real competitive application in balance-type builds. Tier: mid — not as specialized as Bearing Core for zombie or Grip Flat Core for attack, but uniquely versatile.

---

## Case 135 — Manual Change Core RC (Dranzer MS) — ~2 g [ESTIMATED] — Pre-Battle Mode Selector: Three-Tip Configuration, Kai's HMS Tactical Choice

### 1. Geometry

Manual Change Core is Dranzer MS's Running Core — the direct HMS-era continuation of Dranzer's tip-switch tradition (Dranzer S's Spiral Change Base → Dranzer F's Flame Change → Dranzer V's Volcano Change → Dranzer MS's Manual Change Core). Unlike the automatic Metal Change Core (angle-triggered) or the Shooter Change Cores (spin-direction triggered), the Manual Change Core requires the player to physically rotate the tip mount before launch to select from three configurations.

Weight: ~2 g [FACT — from linka hms/running-cores.md]. Height: MEDIUM. Three selectable tip modes: Attack Flat, Survival Sharp, Hybrid Semi-Flat.

### 2. Physics

**Three mode physics:**

| Mode | Tip | μ | dω/dt | Movement | Best vs |
|------|-----|---|-------|---------|---------|
| Attack Flat | Flat (ABS or metal) | 0.35–0.45 | ~72 rad/s² | Aggressive orbit | Defensive/stationary opponents |
| Survival Sharp | Sharp (metal) | 0.08–0.12 | ~8 rad/s² | Stationary | Attackers needing contact |
| Hybrid Semi-Flat | Semi-flat | 0.20–0.30 | ~40 rad/s² | Moderate orbit | Unknown opponents |

**Pre-battle tactical decision:**
Unlike mid-battle auto-switches, Manual Change Core forces Kai to commit to a tip before launch. The meta-game implication:
- Correct pick: ±20–30% battle performance advantage
- Wrong pick: significant disadvantage (attack tip vs. superior attacker → self-KO; survival tip vs. heavy attacker → gets KO'd while stationary)

This creates the "Kai's mode-reading" mechanic: the Manual Change Core's value depends entirely on correctly predicting the opponent's archetype before launch.

**Dranzer tradition:**
Every Dranzer BB (plastic gen) and every Dranzer RC (HMS) uses a tip-switch gimmick. Manual Change Core is the most explicit version — it makes the player directly manipulate the mechanism, removing any automatic trigger. The "manual" designation is intentional: this is the base-form tip selector from which all other Dranzer automatic variants (spiral-triggered, magnet-triggered, clutch-triggered) descend.

### 3. Game Engine Mapping

```typescript
type ManualChangeCoreMode = "attack_flat" | "survival_sharp" | "hybrid_semi_flat";

interface ManualChangeCoreRC {
  name: "manual_change_core";
  system: "HMS";
  sourceBey: "Dranzer MS";
  mass_g: 2;                         // [ESTIMATED]
  modes: ManualChangeCoreMode[];
  setupTiming: "pre_battle";          // player selects before launch
  mu: {
    attack_flat: 0.40;
    survival_sharp: 0.10;
    hybrid_semi_flat: 0.25;
  };
  spinDecay_radPerS2: {
    attack_flat: 72;
    survival_sharp: 8;
    hybrid_semi_flat: 40;
  };
  dranzertradition: "spiral_change_flame_change_volcano_change_manual_change";
}

function manualChangeCoreBestMode(
  opponentArchetype: "attacker" | "defender" | "stamina" | "unknown"
): ManualChangeCoreMode {
  switch (opponentArchetype) {
    case "attacker": return "survival_sharp";   // stationary — let attacker self-destruct
    case "defender": return "attack_flat";      // orbit and wear down stationary bey
    case "stamina":  return "hybrid_semi_flat"; // moderate orbit, outlast via Spiral Upper
    case "unknown":  return "hybrid_semi_flat"; // balanced choice vs unknown
  }
}
```

### 4. Verdict

**Role:** Pre-battle tactical mode selector. Manual Change Core rewards opponent-reading: correct mode selection gives a 20–30% performance advantage in the chosen dimension. It is the most lightweight HMS RC at ~2 g, keeping Dranzer MS combos lean and agile. Its weakness vs. automatic-switch RCs (Metal Change Core, Shooter Change Cores) is inflexibility mid-battle — once launched, the tip cannot change. Tier: mid. An excellent narrative gimmick (Kai's strategic thinking) that has real competitive implications in the HMS meta when mode-read correctly.

---

## Case 136 — Shooter Change Core Alpha RC (Bloody Devil MS) — ~8 g [ESTIMATED] — Spin-Direction Tip Preset: Right→Flat Attack, Left→Semi-Flat Defense; WD-at-Bottom Upper Mode Architecture

### 1. Geometry

Shooter Change Core Alpha is Bloody Devil MS's (MA-23) Running Core — the first iteration of the Shooter Change gimmick (Alpha; Gamma in Shining God MS is the improvement). The internal mechanism reads launcher spin direction pre-launch and deploys the corresponding tip. The defining architectural feature is inverted WD mounting: the CWD attaches to the BOTTOM of the RC rather than above it (as on all standard HMS Beyblades), creating a gap between the AR and RC body.

Weight: ~8 g [ESTIMATED — from linka bloody-devil-ms.md]. Tip material: ABS plastic throughout (limits attack ceiling vs. metal-tipped RCs). WD position: bottom-mounted (unique architecture).

### 2. Physics

**Tip deployment by spin direction:**
- Right-spin: Flat tip deployed → μ_flat ≈ 0.40–0.50 (ABS flat), aggressive movement
- Left-spin: Semi-flat tip deployed → μ_semi ≈ 0.20–0.30, moderate controlled movement

The mechanism is pre-set at launch — no mid-battle change. The flat tip width equals Battle Change Core's flat (per linka file):

    r_flat_tip ≈ 2.5–3.0 mm (moderate flat, not full-width)
    dω/dt_flat ≈ 55–65 rad/s² (plastic flat — weaker than metal flat)

**WD-at-bottom architecture:**
Standard HMS assembly: [AR] → [CWD/WD] → [RC] → [tip]
Shooter Change Core Alpha: [AR] → [gap] → [RC body] → [CWD] → [tip]

The gap between AR and RC body is the correct height for Upper Attack CWDs (e.g., CWD Circle Attacker from Phantom Fox MS):

    Gap_height ≈ 8–10 mm — Upper Attack CWD clearance

This enables Upper Mode combos that cannot be assembled on any other HMS RC. The inverted position also shifts CoM toward the stadium floor:

    CoM_shift_downward ≈ 6 mm vs standard configuration

Lower CoM → more defense floor-hold stability. But: if the bey tilts > ~15°, the bottom-mounted CWD scrapes the stadium:

    Scrape risk: CWD_bottom contacts floor at tilt_angle > arctan(h_CWD / r_bey) ≈ 15°
    Result: immediate spin loss spike (~100+ rad/s² instantaneous) → KO

**Comparison vs Shooter Change Core Gamma (successor):**
| Feature | Alpha | Gamma |
|---------|-------|-------|
| Right-spin tip | Flat (ABS) | Flat (ABS) |
| Left-spin tip | Semi-flat | Sharp (better defense) |
| Weight | ~8g | 6g |
| WD position | Bottom | Bottom |
| Upper Mode | Yes | Yes |
| Attack ceiling | ABS flat (lower) | ABS flat (lower) |

### 3. Game Engine Mapping

```typescript
interface ShooterChangeCoreAlphaRC {
  name: "shooter_change_core_alpha";
  system: "HMS";
  sourceBey: "Bloody Devil MS";
  mass_g: 8;                        // [ESTIMATED]
  gimmick: "spin_direction_tip_preset";
  rightSpin: { tipType: "flat_abs"; mu: 0.45; spinDecay_radPerS2: 60; };
  leftSpin: { tipType: "semi_flat_abs"; mu: 0.25; spinDecay_radPerS2: 38; };
  tipSetTiming: "pre_launch";       // locked at launch, cannot change mid-battle
  wdMountPosition: "bottom_of_rc";  // inverted from standard
  upperModeGapEnabled: true;        // gap allows Upper Attack CWDs to function
  upperModeCWD: "cwd_circle_attacker"; // compatible CWD for Upper Mode
  comShiftDown_mm: 6;               // CoM moves toward floor vs standard
  scrapeTiltThreshold_deg: 15;      // WD contacts floor at > 15° tilt
  successorPart: "shooter_change_core_gamma";
  competitiveTier: "experimental";
}
```

### 4. Verdict

**Role:** Experimental spin-direction mode RC with unique WD-at-bottom architecture. The pre-launch tip selection is real tactical value: right-spin Attack mode or left-spin semi-flat Defense mode. The WD-at-bottom architecture enables Upper Mode with compatible Upper Attack CWDs — unique in HMS. Its plastic tip limits attack ceiling vs. metal RCs. The self-KO risk from CWD floor-scrape requires careful build management. Tier: experimental/low-mid. The successor Shooter Change Core Gamma (Shining God MS) is strictly better for the same role — acquire Alpha only if Gamma is unavailable or for Upper Mode experimentation.

---

## Case 137 — Shooter Change Core Gamma RC (Shining God MS) — 6 g [FACT] — Improved Spin-Direction Tip Preset: Right→Flat, Left→Sharp (Superior Defense); WD-at-Bottom Upper Mode

### 1. Geometry

Shooter Change Core Gamma (Shining God MS, MA-24) is the improved version of Shooter Change Core Alpha. Same core architecture (WD-at-bottom, spin-direction tip selection) but with a critical improvement in left-spin: the semi-flat tip (Alpha's defense mode) is replaced by a sharp tip — better defense capability with lower friction and higher gyroscopic stability at low spin rates.

Weight: 6 g [FACT — from linka shining-god-ms.md]. Height: LOW-MED. WD position: bottom-mounted (same as Alpha). Tip options: Flat (RS, Attack) or Sharp (LS, Defense/Stamina).

### 2. Physics

**Left-spin sharp tip (defense/stamina mode):**
Sharp tip in left-spin:

    r_sharp ≈ 0.3–0.5 mm
    μ_sharp ≈ 0.08–0.10 (metal-equivalent ABS sharp, lower than Alpha's semi-flat)
    dω/dt_sharp ≈ 10–15 rad/s² — near-bearing Core territory for ABS

This is a 60% improvement in left-spin spin decay rate over Alpha's semi-flat:
- Alpha LS: dω/dt ≈ 38 rad/s²
- Gamma LS: dω/dt ≈ 12 rad/s² → 3× better stamina retention

**Right-spin flat tip (attack mode):**
Same as Alpha — ABS flat, μ ≈ 0.45, dω/dt ≈ 60 rad/s².

**WD-at-bottom self-KO risk:**
Identical to Alpha. Tilt > 15° → CWD floor contact → spin collapse. This risk is inherent to the architecture and not resolved in Gamma.

**Best defensive combo (Gamma LS):**
Samurai Upper AR + CWD God Ring (or CWD Defense Ring) + Shooter Change Core Gamma (sharp, LS):
- Samurai Upper's upper-attack geometry keeps the bey level (reduces tilt-triggered scrape)
- God Ring's high I supports sustained survival
- Gamma's sharp tip minimizes floor friction — effective balance/zombie build

### 3. Game Engine Mapping

```typescript
interface ShooterChangeCoreGammaRC {
  name: "shooter_change_core_gamma";
  system: "HMS";
  sourceBey: "Shining God MS";
  mass_g: 6;                        // [FACT]
  gimmick: "spin_direction_tip_preset";
  rightSpin: { tipType: "flat_abs"; mu: 0.45; spinDecay_radPerS2: 60; };
  leftSpin: { tipType: "sharp"; mu: 0.09; spinDecay_radPerS2: 12; };
  tipSetTiming: "pre_launch";
  wdMountPosition: "bottom_of_rc";
  upperModeGapEnabled: true;
  scrapeTiltThreshold_deg: 15;
  improvement_vs_alpha: { leftSpin: "sharp_replaces_semi_flat"; spinDecayFactor: 3 };
  competitiveTier: "low_mid_experimental";
}
```

### 4. Verdict

**Role:** Best spin-direction mode RC in HMS. The sharp left-spin tip makes Gamma a credible defense/stamina option when paired with appropriate ARs and CWDs. The WD-at-bottom architecture enables Upper Mode experimentation with compatible CWDs. Self-KO risk from CWD floor scrape remains the critical limitation — must avoid heavy tilt. At 6 g, lighter than Alpha (8 g), reducing total combo weight modestly. Tier: low-mid/experimental — genuinely useful for defense builds that can't access Bearing Core; the Upper Mode architecture is unique in HMS.

---

## Case 138 — Metal Weight Grip Core RC (Dragoon MF) — ~14–16 g [ESTIMATED] — Hardened Rubber Flat + Internal Metal Ballast: Controlled Attack with Smash-Recoil Resistance

### 1. Geometry

Metal Weight Grip Core is Dragoon MF's Running Core (RBA3 prize). It uses a hardened rubber flat tip — stiffer compound than Grip Flat Core and Ultimate Grip Flat Core — mounted on an ABS body containing an internal metal weight core. This makes it ~2–3× heavier than rubber-only Grip Flat Cores and the heaviest single HMS RC in regular circulation.

Weight: ~14–16 g [ESTIMATED — from linka dragoon-mf.md range "~2-3× heavier than Grip Flat Core"]. Grip Flat Core ≈ 5 g → Metal Weight Grip Core ≈ 10–16 g. Tip diameter: smaller than Grip Flat Core (tighter movement arcs).

### 2. Physics

**Rubber flat tip dynamics:**
Hardened rubber tip (μ_rubber ≈ 0.55–0.70 vs. ABS flat 0.35–0.45):

    dω/dt_rubber = τ_tip / I_combo
    τ_tip = μ × m × g × r_tip ≈ 0.62 × 0.038 × 9.81 × 0.003 ≈ 0.0069 N·m

Smaller tip diameter (r_tip ≈ 2.5–3.0 mm vs Grip Flat Core's 4–5 mm):

    Spin decay: τ_MWGC / τ_GFC ≈ 3.0/4.5 ≈ 0.67 — 33% lower torque per unit friction

**Internal metal weight contribution:**
The metal insert (~6–10 g estimated) sits at the RC body center:

    ΔI_metal ≈ 0.008 × (0.005)² ≈ 2.0 × 10⁻⁷ kg·m² (negligible I contribution — small radius)
    Inertia benefit: minimal (central mass adds little I)
    Stability benefit: substantial — lower CoM + added central mass reduces wobble at low spin

**Smash exchange behavior:**
On lateral smash contact, heavier RC (14–16 g) resists angular deflection better than lighter Grip Flat Core (5 g):

    ΔΩ_deflection ∝ 1 / (I_RC + I_combo)

Heavier RC → lower deflection → bey stays on attack trajectory after taking a hit. This is the "smash-recoil resistance" effect: not full spin retention (the outer shell still absorbs the hit), but the central heavy mass contributes inertia that keeps the bottom stable.

**Controllability:**
Smaller tip diameter + stiffer rubber → shorter, tighter movement arcs vs Grip Flat Core. Inexperienced bladers benefit: the bey orbits closer to center and doesn't sling-out erratically. Experienced bladers prefer Grip Flat Core's speed; MWGC is their fallback.

### 3. Game Engine Mapping

```typescript
interface MetalWeightGripCoreRC {
  name: "metal_weight_grip_core";
  system: "HMS";
  sourceBey: "Dragoon MF";
  mass_g: 15;                       // [ESTIMATED midpoint]
  tipType: "hardened_rubber_flat";
  tipRadius_mm: 2.8;                // smaller than Grip Flat Core
  mu_rubber: 0.62;
  spinDecay_radPerS2: 42;           // lower than GFC due to smaller r_tip
  internalMetalWeight_g: 8;        // [ESTIMATED]
  controlFactor: "moderate";        // tighter arcs vs GFC
  smashRecoilResistance: true;      // heavier RC resists deflection
  vsGripFlatCore: {
    speed: "lower_by_30pct";
    control: "higher";
    recoilResist: "higher";
    spinDecay: "similar";
  };
  competitiveTier: "low_mid";
  targetBlader: "beginner_attacker";
}
```

### 4. Verdict

**Role:** Controlled rubber-flat Attack RC. Metal Weight Grip Core is the entry-level rubber attack option in HMS — more controllable than Grip Flat Core at the cost of some speed. The internal metal ballast adds smash-recoil resistance (the bey stays on trajectory after taking a hit better than lighter RCs). The heavy weight (~15 g) makes it the heaviest HMS RC — useful for stability in some builds but unwieldy in lightweight combos. Tier: low-mid. Replace with Grip Flat Core for experienced attack builds; keep MWGC for controlled setups or when Grip Flat Core is unavailable.

---

## Case 139 — Free Shaft Core RC (Dranzer MF) — ~8 g [ESTIMATED] — Decoupled Inner Shaft: Spin-Retention on Smash Contact via Shaft-Body Mechanical Isolation

### 1. Geometry

Free Shaft Core is Dranzer MF's Running Core (RBA4 prize). The "Free" in the name refers to the inner shaft: the spindle connecting the Metal Flat tip to the RC body is mechanically free to rotate relative to the outer ABS shell. On hard lateral smash contact, the outer shell absorbs and disperses rotational shock while the inner shaft and tip continue spinning independently.

Weight: ~8 g [ESTIMATED — from linka dranzer-mf.md]. Tip type: Metal Flat (hard, non-rubber, metal contact material). Tip width: wide (high contact area with stadium floor). Movement pattern: aggressive, erratic (metal flat).

### 2. Physics

**Shaft decoupling on smash impact:**
In a fixed-shaft RC, lateral smash impact transfers torque Δτ_smash to the entire spinning body:

    Δω_fixed = Δτ_smash / I_total → high spin loss

In Free Shaft Core, the outer shell receives Δτ_smash. The inner shaft is isolated from shell torque by the free rotation mechanism:

    Δω_shaft = 0 (shaft continues spinning undisturbed)
    Δω_shell = Δτ_smash / I_shell

Since the shell couples back to the shaft via friction in the shaft bearing (μ_bearing ≈ 0.05):

    Δω_shaft_via_coupling ≈ μ_bearing × (Δω_shell - Δω_shaft) × Δt / I_shaft

Approximating, spin retention factor vs fixed shaft:

    SpinRetained_FreeSHaft ≈ 1 - (I_shaft / I_total) × coupling_factor
    I_shaft / I_total ≈ 0.15 (shaft is 15% of total inertia)
    Coupling_factor ≈ 0.3 (bearing friction)
    SpinRetained ≈ 1 - 0.15 × 0.3 ≈ 0.955 → 4.5% less spin lost per hit

Over a 20-hit battle:
    Cumulative spin retention ≈ 0.955^20 ≈ 0.40 (40% more spin retained vs fixed shaft)

This is meaningful: Dranzer MF can outlast a conventional flat-tip RC bey in an extended smash-trading battle.

**Metal Flat tip dynamics:**
Metal contact (hard, low deformation):

    μ_metal_flat ≈ 0.15 (lower friction than ABS flat)
    dω/dt ≈ 20–25 rad/s² (lower spin decay than rubber flat, similar to Grip Flat Core in steel-floor contact)

Erratic movement pattern: metal flat contact is high-speed but less predictable than rubber flat — sharp rebounds off walls, wide stadium coverage.

**Dranzer legacy:**
The Free Shaft Core continues the Dranzer shaft-decoupling tradition: Dranzer S's Spiral Change Base had a mode-switching shaft; Dranzer F's Flame Change Base had a paired SG gimmick. Free Shaft Core adds the passive mechanical coupling variant — no setup, no spin direction choice, automatically activates on impact.

### 3. Game Engine Mapping

```typescript
interface FreeShaftCoreRC {
  name: "free_shaft_core";
  system: "HMS";
  sourceBey: "Dranzer MF";
  mass_g: 8;                        // [ESTIMATED]
  tipType: "metal_flat";
  tipWidth_mm: 3.5;                 // [ESTIMATED]
  mu_metalFlat: 0.15;
  spinDecay_radPerS2: 22;
  shaftDecoupled: true;
  spinRetentionPerHit: 0.955;       // 4.5% less spin loss vs fixed shaft per smash hit
  cumulativeRetention_20hits: 0.40; // 40% more spin after 20 smash exchanges
  movementPattern: "aggressive_erratic";
  gimmick: "passive_on_smash_impact";
  dranzertip_lineage: true;
  pairedAR: "smash_phoenix";
  pairedCWD: "wing_attacker_cwd";
  competitiveTier: "mid";
}

function freeShaftRetainedSpin(
  initialSpin: number,
  hitCount: number
): number {
  const retentionPerHit = 0.955;
  return initialSpin * Math.pow(retentionPerHit, hitCount);
  // After 20 hits: 0.955^20 ≈ 0.40 of initial spin — 40% more than fixed shaft
}
```

### 4. Verdict

**Role:** Smash-resistant Attack RC. The Free Shaft Core's decoupled shaft provides real spin retention benefit: ~4.5% less spin loss per hard smash hit, cumulating to 40% more spin after 20 exchanges vs a fixed-shaft equivalent. This makes Dranzer MF (Smash Phoenix + Wing Attacker + Free Shaft Core) a sustained smash-trading attacker rather than a glass-cannon. The Metal Flat tip produces aggressive stadium coverage. Tier: mid — genuinely competitive in attack builds; the spin-retention gimmick adds real battle longevity. The RBA4 prize-only distribution limits accessibility. The successor Dranzer tradition (passive shaft decoupling → later Burst-era shaft mechanisms) is a meaningful mechanical lineage.

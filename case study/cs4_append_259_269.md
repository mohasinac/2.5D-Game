
---

## Case 259 — Great Dragon AR (5.4 g [FACT(PDB)], Gaia Dragoon) — Top-Tier Symmetric Smash Ring with Interchangeable Wing Sub-Ring SAR: Equal RS/LS Ridge Attack and Best SAR-Slot Donor

### 1. Geometry

Great Dragon AR is a two-component plastic gen AR: a thin-construction core ring (3.9 g [FACT(PDB)]) with ridge-based contact points, paired with the Wing Sub-Ring SAR (1.5 g [FACT(PDB)], free-spinning). The core ring's ridges sit at equatorial height — they engage opposing ARs directly rather than reaching WD level, so this is a pure smash AR with no upper-attack slope.

Critically, the ridge geometry is bilaterally symmetric in the plane of rotation — the contact angle for RS and LS is equal on both sides. This makes Great Dragon one of the very few plastic gen ARs with genuine both-spin smash parity (smashFractionRS = smashFractionLS ≈ 0.52).

The Wing Sub-Ring SAR slot accepts any compatible SAR (War Lion SAR, War Bear SAR, Dragon Saucer SAR, etc.). The most competitive build strips the Wing Sub-Ring and uses War Lion Core AR + Dragon Saucer SAR instead — but Great Dragon Core AR's core ridge is where the attack power originates.

**Sources of contact force:**
- Core ridges: primary smash on both spin directions
- Wing Sub-Ring SAR: free-spin → absorbs ~25% contact moment via angular momentum exchange with the ring (reduces recoil to the bearer)

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 30 mm, r_inner ≈ 13 mm,  m_total = 5.4 g
  I = (m/2)(r_o² + r_i²) = (0.0054/2)(0.030² + 0.013²)
    = 0.0027 × (0.000900 + 0.000169) = 0.0027 × 0.001069 ≈ 2.9 × 10⁻⁶ kg·m²

SAR free-spin effect on contact:
  J_delivered_to_opponent = J_base × 0.75  (SAR absorbs ~25% of contact moment)
  spinStealFactor_SAR ≈ 0.04              (mild spin steal via orbital contact)

Smash model:
  smashFractionRS = 0.52  [FACT(PDB) — symmetric ridge geometry, "excellent Smash both spins"]
  smashFractionLS = 0.52  [FACT(PDB) — both-spin parity confirmed]
  recoilFactor    = 0.32  [ESTIMATED — "competitive with appropriate base"; managed by Defense Grip Base]

Best base pairing: Defense Grip Base or SG Metal Ball Base (recoil absorbed → net outward force)
```

### 3. Game Engine Mapping

```typescript
interface GreatDragonAR {
  name: "great_dragon_ar";
  system: "SGS";
  sourceBey: "Gaia Dragoon";
  mass_g: 5.4;                         // [FACT(PDB)] core 3.9g + Wing Sub-Ring 1.5g
  coreAR_g: 3.9;                       // [FACT(PDB)]
  sarName: "wing_sub_ring";
  sar_g: 1.5;                          // [FACT(PDB)]
  sarFreeSpin: true;
  I_kgm2: 2.9e-6;                      // [ESTIMATED — ring model]
  contactType: "smash_ridge";
  smashFractionRS: 0.52;               // [FACT(PDB)] symmetric ridge
  smashFractionLS: 0.52;               // [FACT(PDB)] both-spin parity
  upperFraction: 0.05;                 // minimal — ridges at equatorial, not upper height
  recoilFactor: 0.32;
  sarSpinStealFactor: 0.04;
  competitiveTier: "top_tier_smash";
  sarCompatible: ["wing_sub_ring", "war_lion_sar", "dragon_saucer_sar", "war_bear_sar"];
  bestSAR: "dragon_saucer_sar";        // Dragon Saucer SAR = best defensive partner
  notesBothSpin: "equal smash RS and LS — use for attack builds in either spin direction";
}
function greatDragonContact(ar: GreatDragonAR, J_base: number): number {
  // SAR absorbs 25% of impact moment; core delivers 75%
  const J_core = J_base * 0.75;
  return J_core * ar.smashFractionRS;  // same value for either spin
}
```

### 4. Verdict

**Role:** Top-tier both-spin smash AR. Great Dragon AR's symmetric ridge contacts deliver smashFractionRS = smashFractionLS = 0.52 — one of the only plastic gen ARs with genuine spin-direction parity. The Wing Sub-Ring SAR slot is the key asset: swap in Dragon Saucer SAR for the best zombie/defense configuration, or War Lion SAR for a lighter defensive option. The core ridge attack performance is independent of SAR choice. Use with Defense Grip Base to contain recoil. Tier: top-tier smash.

---

## Case 260 — Dark Wing AR (6.4 g [FACT(PDB)], Dark Draciel / Dark Dragoon / Dark Dranzer / Dark Driger / Dark Gaia Dragoon) — Hyper-Aggro Three-Sided Thick Contact Ring with Matching Sub-AR: Maximum Offensive Power at High Recoil Cost

### 1. Geometry

Dark Wing AR is a two-component 3-fold-symmetric AR: a core ring (4.9 g [FACT(PDB)]) featuring three thick, slightly outward-angled contact blades, plus a matching Sub AR (1.5 g [FACT(PDB)]). Unlike most SARs, the Dark Wing Sub AR is not free-spinning — it is a matched outer ring that reinforces and extends the core's contact geometry, adding thickness and depth to each of the three blades.

The outward-angled contact points are designed for maximum offensive force: the angle tilts the contact face toward the opponent's WD/AR boundary, ensuring high-pressure smash impact at the cost of poor recoil management. The combined 6.4 g mass is towards the heavy end of plastic gen ARs, and the three evenly-spaced thick contacts make it one of the most reliably aggressive ARs for "Hyper Aggro" (attack-only) builds.

**Weakness:** The design "struggles against heavy, low-recoil defenses" — the thick blades that generate force also bounce back hard against slow, heavy opponents (recoilFactor ≈ 0.52). Against Zombie builds or rounded defense ARs, the High recoil returns more angular momentum to the attacker than it delivers to the target.

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 32 mm, r_inner ≈ 13 mm,  m_total = 6.4 g
  I = (0.0064/2)(0.032² + 0.013²) = 0.0032 × (0.001024 + 0.000169)
    = 0.0032 × 0.001193 ≈ 3.8 × 10⁻⁶ kg·m²

Contact model (3-fold C₃ symmetry, thick blades):
  smashFractionRS = 0.56  [FACT(PDB) — "impressive striking force" RS-primary]
  smashFractionLS = 0.40  [ESTIMATED — thick blades have RS geometry bias]
  recoilFactor    = 0.52  [FACT(PDB) — "notable rotational recoil"; struggles vs heavy defenses]
  contactThickness_m: 0.010  [ESTIMATED — "very thick contact points"]

Net offensive output vs median-defense opponent:
  F_net = F_smash × (1 − recoilFactor × 0.85) ≈ smash × 0.56
  Against heavy defense: F_net drops to ~0.32 (recoil dominates)

Heavy Metal Core pairing: +~2g to assembly → lowers recoil-induced self-destabilization
```

### 3. Game Engine Mapping

```typescript
interface DarkWingAR {
  name: "dark_wing_ar";
  system: "SGS";
  sourceBey: "Dark Draciel | Dark Dragoon | Dark Dranzer | Dark Driger | Dark Gaia Dragoon";
  mass_g: 6.4;                         // [FACT(PDB)] core 4.9g + sub AR 1.5g
  coreAR_g: 4.9;                       // [FACT(PDB)]
  subAR_g: 1.5;                        // [FACT(PDB)] — NOT free-spin; matched contact extension
  sarFreeSpin: false;
  I_kgm2: 3.8e-6;                      // [ESTIMATED — ring model]
  contactType: "smash_thick_blade";
  contactFold: 3;                      // C₃ symmetry
  smashFractionRS: 0.56;               // [FACT(PDB)] RS-primary, impressive striking force
  smashFractionLS: 0.40;               // [ESTIMATED] geometry bias RS
  recoilFactor: 0.52;                  // [FACT(PDB)] notable recoil
  contactThickness_m: 0.010;
  competitiveTier: "hyper_aggro_C_tier"; // loses to heavy defenses, wins vs mid-defense
  recommendedBase: "heavy_metal_core"; // +mass dampens self-destabilization
  vsHeavyDefense: "poor";              // "struggles against heavy, low-recoil defenses"
}
function darkWingNetForce(ar: DarkWingAR, opponentDefense: "light" | "heavy"): number {
  const recoilPenalty = opponentDefense === "heavy" ? 0.85 : 0.45;
  return ar.smashFractionRS * (1 - ar.recoilFactor * recoilPenalty);
}
```

### 4. Verdict

**Role:** Hyper-aggro attack AR, C-tier. Dark Wing AR delivers one of the strongest raw smash outputs in plastic gen (smashFractionRS = 0.56) but the thick-blade geometry generates recoilFactor = 0.52 that limits effectiveness against heavy defense. Best in "Hyper Aggro" tournament formats where all opponents run attack/mid builds — the high recoil is less punishing when everyone is similarly aggressive. Against Zombie or Compact defense, the recoil typically self-destructs the build before the opponent is knocked out. Use Heavy Metal Core to partially counter self-destabilization. Tier: C-tier competitive (niche aggressive).

---

## Case 261 — Wing Attack Ring (6.1 g [FACT(PDB)], Wing Attacker) — Centripetally-Deployed Spring Wings: Zombie Spin-Steal AR with Unique Indirect-Hit Fold Mechanism

### 1. Geometry

Wing Attack Ring (WAR) is a 6.1 g AR using spring-loaded retractable wings as the primary contact mechanism — a design unique among plastic gen ARs. At rest or at low spin, the wings fold inward (collapsed). When spin is above the centripetal deployment threshold (~300 RPM equivalent), centrifugal force unfurls the wings outward to their extended position.

**Deployed wings:** the wing tips grind along the opponent's AR/WD rather than delivering sharp smash impacts. This grinding contact is the opposite of smash: it transfers moderate spin energy (spinStealFactor ≈ 0.12) while keeping recoilFactor low (≈ 0.22), making WAR ideal for Zombie and right-spin spin-steal builds.

**Indirect hits (wings fold inward):** when struck from behind or at an angle that doesn't engage the wing tip, the wings fold inward under contact force. This "absorbs" the opponent's attack — recoil to the bearer is dramatically reduced (recoilFactor_indirect ≈ 0.08). The net effect is a bey that takes hits without destabilizing.

**Fragility risk:** the wing hinge sections are thin and prone to breaking under high-force attacks. Against heavy smash ARs (smashFraction > 0.55), the probability of wing breakage is elevated (~20% per match estimate).

### 2. Physics

```
Moment of inertia (ring model, wings deployed):
  r_outer ≈ 34 mm (wing tip at full extension), r_inner ≈ 13 mm,  m = 6.1 g
  I = (0.0061/2)(0.034² + 0.013²) = 0.00305 × (0.001156 + 0.000169)
    = 0.00305 × 0.001325 ≈ 4.0 × 10⁻⁶ kg·m²

Wing deployment (centripetal threshold):
  F_centripetal = m_wing × ω² × r_wing
  Threshold ω ≈ 200 rad/s (~1910 RPM launch) → wings deploy immediately on launch
  Below ω ≈ 80 rad/s (~760 RPM) → wings retract (Zombie survival range)

Grinding contact model:
  smashFractionRS: 0.28   [ESTIMATED — wing tip grinding, not blade smash]
  spinStealFactor: 0.12   [FACT(PDB) — "grinding action"; key zombie mechanism]
  recoilFactor_direct:   0.22  [ESTIMATED — low; wing tips flex rather than bounce]
  recoilFactor_indirect: 0.08  [ESTIMATED — wings fold; absorbs attack]

Zombie effectiveness (low spin):
  Wing tip contact at ω < 200 rad/s → wings retracted → pure stamina contact
  spinStealFactor_retracted ≈ 0.05 (tip-only; very gentle)
  This is the end-game stamina phase: WAR outspins depleted opponents via steady spin drain
```

### 3. Game Engine Mapping

```typescript
interface WingAttackRing {
  name: "wing_attack_ring";
  system: "SGS";
  sourceBey: "Wing Attacker";
  mass_g: 6.1;                          // [FACT(PDB)]
  I_kgm2: 4.0e-6;                       // [ESTIMATED — ring model, wings deployed]
  // Wing mechanism
  springWingMechanism: true;
  deployThreshold_rads: 200;             // ≈ 1910 RPM; wings unfurl above this
  retractThreshold_rads: 80;             // ≈ 760 RPM; wings collapse below this
  // Contact geometry (wings deployed — active battle phase)
  contactType: "grinding_wing_tip";
  smashFractionRS: 0.28;                 // low direct smash; grinding contact
  spinStealFactor: 0.12;                 // primary zombie mechanism
  recoilFactor_direct: 0.22;            // low; wings flex on hit
  recoilFactor_indirect: 0.08;          // very low; wings fold inward, absorb attack
  // Contact geometry (wings retracted — end-game stamina)
  spinStealFactor_retracted: 0.05;       // gentle tip contact at low spin
  recoilFactor_retracted: 0.05;
  // Durability
  wingBreakRisk_vs_heavySmash: 0.20;     // ~20% breakage probability vs smashFraction > 0.55 AR
  competitiveTier: "top_tier_zombie";    // best or near-best plastic gen zombie/spin-steal AR
  spinPreference: "right_spin";          // RS zombie; LS lacks wing geometry advantage
}
function wingARContactMode(ar: WingAttackRing, omega_rads: number): "grinding" | "retracted" {
  return omega_rads >= ar.retractThreshold_rads ? "grinding" : "retracted";
}
function wingARSpinSteal(ar: WingAttackRing, omega_rads: number): number {
  const mode = wingARContactMode(ar, omega_rads);
  return mode === "grinding" ? ar.spinStealFactor : ar.spinStealFactor_retracted;
}
```

### 4. Verdict

**Role:** Top-tier zombie/spin-steal AR. Wing Attack Ring's centripetally-deployed spring wings create a grinding contact that transfers spin (spinStealFactor = 0.12) while keeping recoil low (0.22) — the ideal profile for a Zombie build that needs to survive attacks and outspin opponents. The indirect-hit fold mechanism (recoilFactor_indirect = 0.08) turns incoming smash attacks into near-zero-damage events for the WAR bearer. Fragility is the limiting factor — avoid matchups against Dark Wing AR or similar heavy smash (> 0.55) builds where wing breakage risk is ~20%. In tournament Zombie formats, WAR is the reference AR against which other zombie contenders are measured. Tier: top-tier zombie.

---

## Case 262 — Corona Saber AR (7.4 g [FACT(PDB)], Apollon / Apollon G) — Combined Upper Attack + Smash Via Wing-Tip Slopes and Angular Edges: Heaviest Competitive Plastic Gen AR with RS Primary Orientation

### 1. Geometry

Corona Saber AR is the heaviest confirmed plastic gen AR at 7.4 g [FACT(PDB)], sourced from Apollon and Apollon G. The design features two geometric elements working in tandem: angled slopes for Upper Attack / Upward Smash, plus an angular/square wing edge for Smash Attack. This combination makes Corona Saber one of only a handful of plastic gen ARs with simultaneous Upper + Smash output (alongside Cross Attacker, Case 250, and Upper Claw, Case 143).

**RS primary orientation:** the wing-tip slopes face correctly for RS rotation, giving peak upper attack output. In LS, the slopes are reversed — they still generate upper attack but the force vector direction changes, making LS performance "respectable but less powerful" than RS.

**Recoil management:** at 7.4 g, the AR's moment of inertia is high — the large mass helps resist self-destabilization from recoil but does not eliminate it. "Considerable recoil issues" means Corona Saber needs a recoil-absorbing BB (Defense Grip Base or SG Metal Ball Base) to perform at its rated tier.

The name "Corona" (crown) reflects the radially symmetric ring shape; "Saber" refers to the angular cutting edges that provide the smash component.

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 34 mm, r_inner ≈ 14 mm,  m = 7.4 g
  I = (0.0074/2)(0.034² + 0.014²) = 0.0037 × (0.001156 + 0.000196)
    = 0.0037 × 0.001352 ≈ 5.0 × 10⁻⁶ kg·m²

Contact geometry (hybrid Upper + Smash):
  upperFractionRS  = 0.45  [FACT(PDB) — "slopes for Upper Attack/Upward Smash"; RS primary]
  smashFractionRS  = 0.50  [FACT(PDB) — "square angular shape provides Smash Attack"]
  upperFractionLS  = 0.38  [FACT(PDB) — "respectable for Upper Attack" in LS]
  smashFractionLS  = 0.30  [ESTIMATED — "lacks smash effectiveness in LS"]
  recoilFactor     = 0.48  [FACT(PDB) — "considerable recoil issues"]

Combined contact output (RS):
  J_net = J_base × (0.50 × smash_weight + 0.45 × upper_weight)
  At equal contact probability: J_net ≈ J_base × 0.475

Effective combo requirement: recoilFactor = 0.48 → Defense Grip Base or SG Metal Ball Base needed
```

### 3. Game Engine Mapping

```typescript
interface CoronaSaberAR {
  name: "corona_saber_ar";
  system: "SGS";
  sourceBey: "Apollon | Apollon G";
  mass_g: 7.4;                           // [FACT(PDB)] — heaviest plastic gen AR confirmed
  I_kgm2: 5.0e-6;                        // [ESTIMATED — ring model]
  contactType: "upper_smash_hybrid";
  // Right spin (primary orientation)
  upperFractionRS: 0.45;                 // [FACT(PDB)] slopes for Upper Attack
  smashFractionRS: 0.50;                 // [FACT(PDB)] angular edges provide Smash
  // Left spin
  upperFractionLS: 0.38;                 // [FACT(PDB)] reversed slopes, "respectable"
  smashFractionLS: 0.30;                 // [ESTIMATED] reduced smash in LS
  recoilFactor: 0.48;                    // [FACT(PDB)] considerable recoil
  competitiveTier: "B_tier_upper_smash"; // high raw output; recoil limits reliability
  baseRequirement: ["defense_grip_base", "sg_metal_ball_base"]; // recoil management
  vsCompare: "cross_attacker_ar";        // Case 250: Cross Attacker 5.6g, lower recoil
  noteHeaviest: "7.4g = heaviest plastic gen AR; high I helps self-stabilization despite recoil";
}
function coronaSaberContact(ar: CoronaSaberAR, spin: "RS" | "LS", J_base: number): number {
  const upper = spin === "RS" ? ar.upperFractionRS : ar.upperFractionLS;
  const smash = spin === "RS" ? ar.smashFractionRS : ar.smashFractionLS;
  const gross = J_base * (upper * 0.5 + smash * 0.5);  // equal probability of slope vs edge contact
  return gross * (1 - ar.recoilFactor * 0.5);           // net after recoil penalty
}
```

### 4. Verdict

**Role:** B-tier hybrid Upper Attack + Smash. Corona Saber AR delivers one of the strongest simultaneous upper + smash contact profiles in plastic gen (upperFractionRS = 0.45, smashFractionRS = 0.50) but the 0.48 recoilFactor requires a recoil-absorbing Blade Base to realize that output. RS primary — use in right-spin builds with Defense Grip Base or SG Metal Ball Base. In LS it functions as a respectable upper attack option but loses the smash advantage. At 7.4 g it is the heaviest plastic gen AR, providing high moment of inertia that partially self-stabilizes against recoil hits. Compare to Cross Attacker AR (Case 250, 5.6 g) — lighter with lower recoil but also lower raw output. Tier: B-tier (upper-smash attack RS primary).

---

## Case 263 — Genocide Circle AR (5.9 g [FACT(PDB)], Dark Effigy G / Death Gargoyle) — Inconsistent Contact Geometry: Wing Protrusions with Pole Extensions Produce Either Reasonable Smash or Zero Impact

### 1. Geometry

Genocide Circle AR is a 5.9 g AR featuring aggressive wing-like protrusions with pole extensions at each end. The design attempts to combine two contact mechanisms in a single AR: the wing body provides angled smash contact, while the pole extensions at each wing tip add a second contact surface.

**Critical design flaw:** the wing + pole geometry creates two very different contact scenarios depending on exact collision angle:
1. Wing face contact: reasonable smash force + high recoil (smashFraction ≈ 0.48)
2. Pole-tip contact or miss-edge: zero effective force transfer ("no impact at all")

This binary outcome — "either reasonable power with high recoil or no impact at all" — makes Genocide Circle fundamentally unreliable. A contact that would be decisive on a consistent AR (e.g. Triple Tiger, Case 192) is a coin flip on Genocide Circle.

**Niche use:** the only practical application is outspinning specific defensive setups on certain Blade Bases, where the Zombie-mode spin contact happens to engage the wing face consistently (a very narrow and base-dependent use case).

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 30 mm, r_inner ≈ 13 mm,  m = 5.9 g
  I = (0.0059/2)(0.030² + 0.013²) = 0.00295 × 0.001069 ≈ 3.2 × 10⁻⁶ kg·m²

Contact consistency model:
  contactConsistency: 0.35   [FACT(PDB) — binary outcome, "either smash or no impact"]
  smashFraction_success: 0.48  [ESTIMATED — "reasonable power" scenario]
  smashFraction_failure: 0.00  [FACT(PDB) — "no impact at all" scenario]
  expected_smashFraction = 0.35 × 0.48 + 0.65 × 0.00 = 0.168 (effective average)
  recoilFactor: 0.58  [ESTIMATED — "high recoil" on success contacts]

The effective smashFraction of 0.168 puts Genocide Circle below all competitive ARs.
```

### 3. Game Engine Mapping

```typescript
interface GenocideCircleAR {
  name: "genocide_circle_ar";
  system: "SGS";
  sourceBey: "Dark Effigy G | Death Gargoyle";
  mass_g: 5.9;                           // [FACT(PDB)]
  I_kgm2: 3.2e-6;                        // [ESTIMATED]
  contactType: "inconsistent_wing_pole";
  // Binary contact outcome (probabilistic)
  contactConsistency: 0.35;              // [FACT(PDB)] 35% successful impact, 65% miss/glance
  smashFraction_hit: 0.48;               // when contact succeeds
  smashFraction_miss: 0.00;              // when pole tip or gap makes contact
  effectiveSmashFraction: 0.168;         // = consistency × smashFraction_hit
  recoilFactor: 0.58;                    // [ESTIMATED] high recoil on successful contacts
  competitiveTier: "non_competitive";
  nicheUse: "outspin_specific_bases";    // very narrow situational use only
  vs: "not_recommended_over_any_top_ar"; // no scenario where Genocide Circle outperforms competitive ARs
}
function genocideCircleContact(ar: GenocideCircleAR, J_base: number): number {
  // Probabilistic contact: successful hit 35% of the time
  const hit = Math.random() < ar.contactConsistency;
  if (!hit) return 0;
  return J_base * ar.smashFraction_hit * (1 - ar.recoilFactor * 0.5);
}
```

### 4. Verdict

**Role:** Non-competitive; avoid. Genocide Circle AR's wing + pole geometry creates a fundamentally unreliable contact profile — 65% of contacts produce zero force transfer. The effective smashFraction of 0.168 (averaged across the contact probability distribution) is lower than any tier-competitive AR. The name "Genocide Circle" reflects the aggressive design intent, but the execution fails. Historical interest only: the Dark Effigy G and Death Gargoyle builds with Genocide Circle are notable only as cautionary examples of how contact-point inconsistency negates raw geometric aggression. Tier: non-competitive.

---

## Case 264 — Hammer Tusk AR (4.7 g [FACT(PDB)], Rushing Boar) — Three-Sided Spiked Wing Grinding: Stamina-Drain via Low-Recoil Spike Contact, Not Smash

### 1. Geometry

Hammer Tusk AR is a 4.7 g three-sided AR from Rushing Boar. The design features three evenly-spaced spiked wings as the primary contact points. Unlike smash ARs (which use large flat or angled blade faces), Hammer Tusk's spikes are narrow and pointed — they engage the opponent's AR at small contact area, producing a grinding/scraping contact rather than a force-transfer smash.

This grinding contact mechanism has a specific physics property: it slowly strips spin energy from the opponent (spin steal via scraping friction) while maintaining low recoil for the Hammer Tusk bearer. The result is a slow stamina drain — not a high-damage OHKO attacker, but a persistent spin-reducer that can outspin opponents in extended battles.

**Use case:** right-spin attack combos where the goal is to grind the opponent's spin down over several contacts rather than knock out immediately. Also viable in right-spin spin-steal (not zombie — Hammer Tusk bearer is not a pure survivor).

**Limitation:** "lacks the raw power for true top-tier status." Against pure attack builds, Hammer Tusk does not deliver enough per-hit force to win before it is knocked out.

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 27 mm, r_inner ≈ 12 mm,  m = 4.7 g
  I = (0.0047/2)(0.027² + 0.012²) = 0.00235 × (0.000729 + 0.000144)
    = 0.00235 × 0.000873 ≈ 2.1 × 10⁻⁶ kg·m²

Grinding contact model (spikes):
  smashFractionRS: 0.30  [ESTIMATED — spikes grind, not smash; low direct force]
  spinStealFactor: 0.06  [FACT(PDB) — "grinding abilities allow it to wear down opponents"]
  recoilFactor:    0.25  [FACT(PDB) — "relatively low recoil" relative to spike geometry]

Stamina drain per contact:
  Δω_opponent ≈ −(spinStealFactor × J_base × r_spike) / I_opponent
  Δω_bearer  ≈ −(recoilFactor × J_base) / I_bearer   (small; self-decay)

At 4–6 contacts: cumulative Δω_opponent ≈ −18–27 rad/s (meaningful spin drain vs 500 rad/s launch)
```

### 3. Game Engine Mapping

```typescript
interface HammerTuskAR {
  name: "hammer_tusk_ar";
  system: "SGS";
  sourceBey: "Rushing Boar";
  mass_g: 4.7;                           // [FACT(PDB)]
  I_kgm2: 2.1e-6;                        // [ESTIMATED]
  contactType: "spike_grinding";
  contactFold: 3;                        // C₃ three-sided symmetry
  smashFractionRS: 0.30;                 // [ESTIMATED] low direct smash
  spinStealFactor: 0.06;                 // [FACT(PDB)] grinding spin drain
  recoilFactor: 0.25;                    // [FACT(PDB)] low recoil for spike type
  competitiveTier: "mid_niche";          // viable in specific stamina-contest formats
  role: "spin_steal_grinder";            // not a knockout AR; a spin-drain AR
  spinPreference: "right_spin";          // RS attack + spin-steal combos
  vsLightDefense: "viable";              // can outspin light defense over multiple contacts
  vsHeavySmash: "loses";                 // not enough per-hit force to win before being KO'd
}
function hammerTuskSpinDrain(
  ar: HammerTuskAR, omega_opponent: number, J_base: number, contactCount: number
): number {
  // Cumulative spin drain across multiple contacts
  const drainPerContact = ar.spinStealFactor * J_base * 0.03; // 0.03 = spike contact ratio
  return omega_opponent - drainPerContact * contactCount;
}
```

### 4. Verdict

**Role:** Mid-tier stamina-drain attacker (niche). Hammer Tusk AR's three spiked wings create a grinding contact (spinStealFactor = 0.06) with low recoil (0.25), making it suitable for right-spin attack builds that want to drain opponent spin over multiple hits rather than score a knockout. In same-spin matchups it performs well; against light defense it outspins reliably over 4–6 contacts. Against pure attack builds it lacks the per-hit force to win before being knocked out. Historical interest: Hammer Tusk introduced the "grinding stamina attack" archetype in plastic gen, later refined by Tip types in MFB. Tier: mid-tier niche (spin-drain).

---

## Case 265 — Jungle Shock AR (4.1 g [FACT(PDB)], Trygator) — Left-Spin Alligator Head Protrusions: Solid LS Smash with Obstructed RS Contact

### 1. Geometry

Jungle Shock AR is a 4.1 g round-profile AR with prominent alligator head protrusions from Trygator. The alligator snout shapes are the contact points — the snout geometry creates angled surfaces that work well as smash contacts in left-spin (LS) but become obstructed in right-spin (RS) due to the directional orientation of the snout angles.

**LS performance:** in LS, the snout protrusions lead into contact — the alligator jaw geometry presents the hardest snout face to opposing ARs, generating "solid Smash with moderate recoil" comparable to similar left-spin attack ARs.

**RS performance:** in RS, the same snouts now trail into contact — the jaw geometry works against the contact direction, obstructing the contact surface and reducing effective smash to the point where Jungle Shock "underperforms significantly." This is not a minor preference difference; the RS performance is actively poor (smashFractionRS ≈ 0.18).

**Use case:** left-spin attack combos only. In LS it is a secondary option behind dedicated LS attack ARs (Reverse Dragon, Case 103), but it is a viable choice.

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 25 mm, r_inner ≈ 12 mm,  m = 4.1 g
  I = (0.0041/2)(0.025² + 0.012²) = 0.00205 × (0.000625 + 0.000144)
    = 0.00205 × 0.000769 ≈ 1.6 × 10⁻⁶ kg·m²

Contact model (alligator-snout directional):
  smashFractionLS: 0.45  [FACT(PDB) — "solid Smash with moderate recoil" in LS]
  smashFractionRS: 0.18  [FACT(PDB) — "underperforms significantly" in RS; obstructed contacts]
  recoilFactor_LS: 0.32  [ESTIMATED — "moderate recoil"]
  recoilFactor_RS: 0.50  [ESTIMATED — obstructed geometry → poor energy transfer → high recoil]

LS performance benchmark:
  vs. Reverse Dragon LS (smashFractionLS ≈ 0.55): Jungle Shock = secondary option
  vs. Double Wing LS  (smashFractionLS ≈ 0.52): Jungle Shock = slightly below
```

### 3. Game Engine Mapping

```typescript
interface JungleShockAR {
  name: "jungle_shock_ar";
  system: "SGS";
  sourceBey: "Trygator";
  mass_g: 4.1;                           // [FACT(PDB)]
  I_kgm2: 1.6e-6;                        // [ESTIMATED]
  contactType: "directional_snout_smash";
  theme: "alligator_heads";
  // Left spin (intended direction)
  smashFractionLS: 0.45;                 // [FACT(PDB)] solid LS smash
  recoilFactor_LS: 0.32;                 // moderate
  // Right spin (obstructed)
  smashFractionRS: 0.18;                 // [FACT(PDB)] poor; snouts obstruct RS contact
  recoilFactor_RS: 0.50;                 // high; obstructed geometry bounces
  spinPreference: "left_spin";           // strong directional dependency
  competitiveTier: "LS_secondary";       // viable LS option; outclassed by Reverse Dragon, Double Wing
}
function jungleShockSmash(ar: JungleShockAR, spin: "RS" | "LS", J_base: number): number {
  const frac = spin === "LS" ? ar.smashFractionLS : ar.smashFractionRS;
  const recoil = spin === "LS" ? ar.recoilFactor_LS : ar.recoilFactor_RS;
  return J_base * frac * (1 - recoil * 0.5);
}
```

### 4. Verdict

**Role:** Left-spin secondary attack AR. Jungle Shock AR delivers solid LS smash (smashFractionLS = 0.45) from its alligator snout protrusions but is essentially non-functional in RS (smashFractionRS = 0.18 due to geometry obstruction). In LS builds it is a viable secondary choice behind Reverse Dragon (Case 103, 3.5g preferred for lower recoil) and Double Wing (Case 243), but Trygator is notable as a donor for left-spin combos where Jungle Shock AR is the only available LS option. Tier: LS secondary (viable but outclassed).

---

## Case 266 — Panther Claw AR (4.5 g [FACT(PDB)], Flash Leopard / Flash Leopard Hasbro Magnacore Version) — Compact Wider Profile with Wing Gaps: RS Smash with Manageable Recoil, Low-Moderate Tier

### 1. Geometry

Panther Claw AR is a 4.5 g AR from Flash Leopard and its Hasbro Magnacore variant. The design is "relatively compact but wider than comparable options" — it sits mid-range between tight (Tiger Defenser, 3.6 g) and wide (Triple Tiger, 6.3 g) AR profiles. The defining geometric feature is "a rather large gap between the two parts of each wing," creating an aggressive visual profile.

The wing gap creates a two-phase contact: the wing leading edge strikes first (smash), and if the opponent passes into the gap, a second "catch" contact occurs. This does not improve force output — it introduces variability in contact behavior similar to (but less severe than) Genocide Circle (Case 263).

**RS primary:** the wing geometry is optimized for RS rotation — in RS the wings present their leading faces correctly. LS performance is not mentioned as competitive.

**Hasbro Magnacore version:** identical AR geometry; the difference is Magnecore integration in the BB. AR weight is the same (4.5 g).

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 26 mm, r_inner ≈ 12 mm,  m = 4.5 g
  I = (0.0045/2)(0.026² + 0.012²) = 0.00225 × (0.000676 + 0.000144)
    = 0.00225 × 0.000820 ≈ 1.8 × 10⁻⁶ kg·m²

Contact model (wing with gap):
  smashFractionRS: 0.42  [FACT(PDB) — "decent Smash Attack in Right Spin"]
  smashFractionLS: 0.15  [ESTIMATED — not mentioned as viable in LS]
  recoilFactor:    0.38  [ESTIMATED — "recoil issues that compromise stamina and defense"]
  gapContactVariance: 0.12  [ESTIMATED — wing gap introduces secondary contact uncertainty]

Net RS performance:
  F_net_RS = smashFractionRS × (1 − recoilFactor × 0.5) ≈ 0.42 × 0.81 = 0.34
  vs. Tiger Defenser (Case 102): Tiger Defenser = D-tier (defense), Panther Claw = RS attack only
  vs. Triple Tiger (Case 192): Triple Tiger smashFraction = 0.48 → Panther Claw clearly below S-tier
```

### 3. Game Engine Mapping

```typescript
interface PantherClawAR {
  name: "panther_claw_ar";
  system: "SGS";
  sourceBey: "Flash Leopard | Flash Leopard (Hasbro Magnacore)";
  mass_g: 4.5;                           // [FACT(PDB)]
  I_kgm2: 1.8e-6;                        // [ESTIMATED]
  contactType: "wing_with_gap";
  smashFractionRS: 0.42;                 // [FACT(PDB)] decent RS smash
  smashFractionLS: 0.15;                 // [ESTIMATED] not viable in LS
  recoilFactor: 0.38;                    // recoil issues limit stamina applications
  gapContactVariance: 0.12;             // secondary catch contact uncertainty
  spinPreference: "right_spin";
  competitiveTier: "low_moderate";       // "outclassed by Tiger Defenser for balanced applications"
  nicheUse: "rs_spin_steal_secondary";  // occasionally used in RS spin-steal combinations
  hasbro_magnacore_variant: {
    arIdentical: true,                   // same AR geometry
    massChange: 0,
    noteDifference: "BB only: Magnecore integrated"
  };
}
function pantherClawSmash(ar: PantherClawAR, spin: "RS" | "LS", J_base: number): number {
  const frac = spin === "RS" ? ar.smashFractionRS : ar.smashFractionLS;
  return J_base * frac * (1 - ar.recoilFactor * 0.5);
}
```

### 4. Verdict

**Role:** Low-to-moderate tier RS attack AR. Panther Claw AR offers decent RS smash (smashFractionRS = 0.42) with manageable recoil (0.38) but is "outclassed" by higher-tier ARs (Triple Tiger at 0.48, Eight Spiker at similar values) for competitive attack builds. Its flash leopard source beys provide access in Flash Leopard combos where it serves as a placeholder RS attack ring before obtaining better ARs. The Hasbro Magnacore version has the same AR. Niche use in RS spin-steal setups where the compact profile suits Zombie combos with wider WDs. Tier: low-moderate (borderline competitive).

---

## Case 267 — Cross Dragon AR (2.7 g [FACT(PDB)], Ultimate Dragoon / Megaro Arm / Makendo) — Lightest Confirmed Plastic Gen AR: Flat Faces, Excessive Recoil, No Competitive Role

### 1. Geometry

Cross Dragon AR is the lightest confirmed plastic gen AR at 2.7 g [FACT(PDB)], sourced from Ultimate Dragoon, Megaro Arm, and Makendo (international variants of the same bey). The AR is very compact with flat faces as the contact surface — "flat faces produce a fair amount of recoil without providing worthwhile contact points for attack."

The flat-face geometry is the worst possible AR design: flat surfaces generate high recoil (the collision is nearly elastic — the two ARs bounce off each other) while delivering low net force transfer to the opponent. The low mass (2.7 g) further limits the moment of inertia, meaning Cross Dragon AR cannot contribute meaningfully to either attack or defense.

**Two molds exist:** the second mold is reinforced to address durability concerns from the original. The reinforcement adds structural stability but does not improve contact geometry or competitive performance.

**Mold 1 (fragile):** thin construction → high breakage risk against heavy smash ARs
**Mold 2 (reinforced):** improved durability → prefer Mold 2 if available, still non-competitive

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 22 mm, r_inner ≈ 11 mm,  m = 2.7 g
  I = (0.0027/2)(0.022² + 0.011²) = 0.00135 × (0.000484 + 0.000121)
    = 0.00135 × 0.000605 ≈ 0.82 × 10⁻⁶ kg·m²

Contact model (flat face):
  smashFractionRS: 0.15  [FACT(PDB) — "without worthwhile contact points for attack"]
  smashFractionLS: 0.15  [ESTIMATED — symmetric flat face, equally poor both directions]
  recoilFactor:    0.55  [FACT(PDB) — "fair amount of recoil"; flat face = near-elastic collision]

Low-mass inertia consequence:
  At ω = 500 rad/s, kinetic energy E = ½ × 0.82e-6 × 500² = 0.103 J (AR contribution only)
  Compare Wide Defense WD (I = 8.5e-6 kg·m²): E_WD ≈ 1.06 J — 10× the energy contribution
  Cross Dragon AR contributes negligibly to the assembly's angular momentum budget
```

### 3. Game Engine Mapping

```typescript
interface CrossDragonAR {
  name: "cross_dragon_ar";
  system: "SGS";
  sourceBey: "Ultimate Dragoon | Megaro Arm | Makendo";
  mass_g: 2.7;                           // [FACT(PDB)] — lightest plastic gen AR confirmed
  I_kgm2: 0.82e-6;                       // [ESTIMATED]
  contactType: "flat_face";
  smashFractionRS: 0.15;                 // [FACT(PDB)] poor contact geometry
  smashFractionLS: 0.15;                 // [ESTIMATED] symmetric flat = equal both ways
  recoilFactor: 0.55;                    // [FACT(PDB)] high recoil from flat-face bounce
  competitiveTier: "non_competitive";
  molds: 2;                              // Mold 1 fragile; Mold 2 reinforced
  breakageRisk_mold1: 0.35;             // ~35% per match vs heavy smash ARs
  breakageRisk_mold2: 0.12;            // improved but not reliable
  donor_value: "none";                   // no competitive applications
  historicalNote: "from early gen1 Dragoon variants; lightest AR in plastic gen lineage";
}
```

### 4. Verdict

**Role:** Non-competitive; no donor applications. Cross Dragon AR is the lightest plastic gen AR (2.7 g) but achieves this by sacrificing all contact-point geometry — flat faces generate recoilFactor = 0.55 with smashFraction = 0.15. The second reinforced mold improves durability but does not rescue competitive performance. There is no build in the plastic gen metagame where Cross Dragon AR outperforms any other AR. Historical note: appears in early Dragoon continuation variants (Ultimate Dragoon) as a placeholder before the series received proper attack ARs. Tier: non-competitive.

---

## Case 268 — Knight Claws Ring (3.5 g [FACT(PDB)], Knight Dranzer / Master Driger) — Fragile Thin AR with Severe Recoil: Design Intent (Aggressive Claws) Negated by Structural Failure Risk

### 1. Geometry

Knight Claws Ring is a 3.5 g AR from Knight Dranzer and Master Driger. The design uses a thin, aggressive claw profile intended to deliver attack — but the thinness that creates the sharp claw geometry also makes the AR "remarkably fragile."

The contact points are "poorly positioned" — the claw tips that should engage the opponent AR instead produce "severe recoil while having relatively limited power in either direction." The combination of fragility + high recoil + low power output across both RS and LS makes Knight Claws Ring one of the worst plastic gen ARs for any role.

**One noted exception:** "promise with RC Super Flat Bases, where reduced recoil could enhance aggressive properties — but this combination isn't currently legal in tournament play." This means the theoretical pairing that might salvage Knight Claws Ring is banned from competitive use.

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 23 mm, r_inner ≈ 11 mm,  m = 3.5 g
  I = (0.0035/2)(0.023² + 0.011²) = 0.00175 × (0.000529 + 0.000121)
    = 0.00175 × 0.000650 ≈ 1.1 × 10⁻⁶ kg·m²

Contact model (thin claw):
  smashFractionRS: 0.20  [FACT(PDB) — "relatively limited power in either direction"]
  smashFractionLS: 0.20  [FACT(PDB) — equally poor both directions]
  recoilFactor:    0.60  [FACT(PDB) — "severe recoil"]

Breakage model:
  breakageRisk_vs_heavySmash: 0.40  [ESTIMATED — "remarkably fragile"]
  expectedLifespan_matches:  5–8    [ESTIMATED — thin claw tips break rapidly in competitive use]
```

### 3. Game Engine Mapping

```typescript
interface KnightClawsRing {
  name: "knight_claws_ring";
  system: "SGS";
  sourceBey: "Knight Dranzer | Master Driger";
  mass_g: 3.5;                           // [FACT(PDB)]
  I_kgm2: 1.1e-6;                        // [ESTIMATED]
  contactType: "thin_claw_aggressive";
  smashFractionRS: 0.20;                 // [FACT(PDB)] limited power
  smashFractionLS: 0.20;                 // [FACT(PDB)] limited power both directions
  recoilFactor: 0.60;                    // [FACT(PDB)] severe recoil
  breakageRisk_per_match: 0.40;         // [ESTIMATED] fragile construction
  competitiveTier: "non_competitive";
  theoreticPairing: "rc_super_flat_base"; // potentially viable but tournament-illegal
  tournamentLegal: false;                 // the only potentially viable combo is banned
}
```

### 4. Verdict

**Role:** Non-competitive; fragile. Knight Claws Ring combines the worst attack properties (smashFraction = 0.20, recoilFactor = 0.60) with high fragility — the thin claw construction breaks readily in competitive use. The only theoretically viable pairing (RC Super Flat Base) is not legal in tournament play. No competitive applications. The AR exists as a thematic accessory for the "knight" bey aesthetic rather than as a functional part. Tier: non-competitive.

---

## Case 269 — Max Shield AR (3.5 g [FACT(PDB)], Draciel Metal Ball Defenser) — Flat-Face Non-Competitive AR: Identical Weight to Knight Claws Ring, Even Fewer Contact Points

### 1. Geometry

Max Shield AR is a 3.5 g AR from Draciel Metal Ball Defenser. The name "Max Shield" implies defensive capability, but the actual contact geometry is purely flat faces — "flat faces cause heavy recoil and tend to be somewhat fragile." This is functionally identical to the Cross Dragon AR failure mode (Case 267) but slightly heavier (3.5 g vs 2.7 g).

As a defensive AR, Max Shield provides no benefits — a defensive AR needs rounded, smooth geometry (like Tiger Defenser, Case 102) to redirect contact force. Flat faces on a defensive AR are counterproductive: they generate high recoil that destabilizes the bearer (negative defense) while also providing no attack output.

The AR has no competitive role in any format. Its notable appearance in Draciel Metal Ball Defenser — a bey specifically designed for defense — underscores a disconnect between the bey's defensive BB design (Metal Ball Base, Case 248) and the non-functional AR. The Metal Ball Base is the entire value of that bey; the Max Shield AR contributes nothing.

**Circle Defenser note:** plasticsdb lists "Circle Defenser" under the Spin Gear section (not Attack Rings) — it is a SG defense shell, not an AR. Max Shield AR is the Draciel Metal Ball Defenser AR, distinct from any SG-level defense component.

### 2. Physics

```
Moment of inertia (ring model):
  r_outer ≈ 22 mm, r_inner ≈ 11 mm,  m = 3.5 g
  I = (0.0035/2)(0.022² + 0.011²) = 0.00175 × (0.000484 + 0.000121)
    = 0.00175 × 0.000605 ≈ 1.1 × 10⁻⁶ kg·m²  [same as Knight Claws Ring]

Contact model (flat face):
  smashFractionRS: 0.10  [FACT(PDB) — "no competitive use"; even weaker than Cross Dragon]
  smashFractionLS: 0.10  [ESTIMATED — equally poor]
  recoilFactor:    0.62  [FACT(PDB) — "heavy recoil" from flat face]
  defenseValue:    0.00  [FACT(PDB) — flat face is anti-defensive; generates recoil to bearer]
```

### 3. Game Engine Mapping

```typescript
interface MaxShieldAR {
  name: "max_shield_ar";
  system: "SGS";
  sourceBey: "Draciel Metal Ball Defenser";
  mass_g: 3.5;                           // [FACT(PDB)]
  I_kgm2: 1.1e-6;                        // [ESTIMATED]
  contactType: "flat_face";
  smashFractionRS: 0.10;                 // [FACT(PDB)] no attack value
  smashFractionLS: 0.10;                 // [ESTIMATED]
  recoilFactor: 0.62;                    // [FACT(PDB)] heavy recoil
  defenseValue: 0.00;                    // flat face = anti-defense on a "defense" bey
  competitiveTier: "non_competitive";
  beyValue: "metal_ball_base_only";      // the bey's entire competitive value is the BB
  circleDefenserNote: "Circle Defenser on plasticsdb is a Spin Gear defense shell, not an AR";
}
```

### 4. Verdict

**Role:** Non-competitive; the Draciel Metal Ball Defenser is only useful for its Metal Ball Base (Case 248). Max Shield AR provides no attack or defense value — flat faces generate the heaviest recoil in this size class (0.62) with smashFraction = 0.10. The "shield" in the name is decorative, not functional. Harvest Draciel Metal Ball Defenser solely for the Metal Ball Base SG component; discard or ignore Max Shield AR. Tier: non-competitive.

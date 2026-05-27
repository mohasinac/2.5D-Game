# Case Studies — Part 14: Launchers, Grips, and Accessories

> Cross-generation launcher physics: pull mechanics, launch energy transfer, spin initialization, ripcord and string systems.
> Cases 759–780

---

## Case 759 — Launch Physics Fundamentals: Energy Transfer from Pull to Beyblade Spin

### 1. Geometry

A Beyblade launcher converts the blader's pulling motion into rotational kinetic energy stored in the spinning top. The fundamental energy chain:

    Pull energy E_pull = F_pull × d_pull  (N × m = J)
    Rotational KE stored: KE_spin = 0.5 × I_bey × ω₀²

The gear ratio η_gear between the launcher gear and the beyblade's tip/shaft determines how much of E_pull becomes spin:

    ω₀ = (η_gear × F_pull × d_pull) / (I_bey × r_gear)

### 2. Physics

**Typical launch parameters:**
| Parameter | Ripcord | String Launcher | Remarks |
|-----------|---------|-----------------|---------|
| Pull distance d | 250–280 mm | 600–800 mm | String >> ripcord |
| Pull force F | 40–80 N | 40–80 N | Same user effort |
| Energy E | 10–22 J | 24–64 J | 2–3× advantage for string |
| Launch ω₀ | 260–520 rad/s | 520–900 rad/s | 2500–8500 RPM |

**Beyblade inertia reference:**
Plastic gen combo I ≈ 2.0–3.5 × 10⁻⁵ kg·m²
MFB combo I ≈ 2.5–4.0 × 10⁻⁵ kg·m²
Burst combo I ≈ 1.5–3.0 × 10⁻⁵ kg·m²

**Gear ratio efficiency:**
Real launchers have η_gear ≈ 0.65–0.85 (15–35% energy lost to friction in launcher gear teeth). String launchers have fewer gear stages → η ≈ 0.80–0.90 (less friction loss).

**Launch speed to RPM:**
    ω₀ = 500 rad/s → RPM = ω₀ × 60 / (2π) ≈ 4775 RPM

**Ripcord wear:**
Each launch partially wears the ripcord teeth. After ~50–100 launches, tooth deformation reduces effective engagement:

    ω₀_worn ≈ 0.85 × ω₀_new (15% launch speed reduction from worn ripcord)

### 3. Game Engine Mapping

```typescript
interface LaunchParams {
  launcherType: LauncherType;
  pullForce_N: number;           // player input (40–80N typical)
  pullDistance_mm: number;       // ripcord draw length
  gearEfficiency: number;        // η: 0.65–0.90
  beyInertia_kgm2: number;       // combo I
}

function computeLaunchSpin(p: LaunchParams): number {
  const energy = p.pullForce_N * (p.pullDistance_mm / 1000);
  const useful = energy * p.gearEfficiency;
  return Math.sqrt(2 * useful / p.beyInertia_kgm2); // rad/s
}

// Standard ripcord: computeLaunchSpin({ pullForce_N:60, pullDistance_mm:265, gearEfficiency:0.75, beyInertia_kgm2:2.5e-5 })
// → ω₀ ≈ 489 rad/s ≈ 4670 RPM

// String launcher: computeLaunchSpin({ pullForce_N:60, pullDistance_mm:700, gearEfficiency:0.85, beyInertia_kgm2:2.5e-5 })
// → ω₀ ≈ 844 rad/s ≈ 8065 RPM
```

### 4. Verdict

String launchers provide 2–3× more launch energy at equivalent blader effort. Ripcord launchers are baseline (plastic gen standard); string launchers (MFB BeyStringer, Burst String Launcher) represent a meaningful competitive physics upgrade. Launch consistency (angle, power) is as important as launcher type — a well-executed ripcord launch outperforms a poorly executed string pull.

---

## Case 760 — Winder / Snap Launcher (Plastic Gen S1) — Manual Crank Pre-Ripcord Launch Mechanism

### 1. Geometry

The Winder is the earliest plastic generation launch tool — predating the ripcord. The blader manually cranks a handle to wind the bey's internal gear train before placing it in the stadium. No ripcord pull; all energy stored in a pre-wound spring mechanism.

Weight: ~20–30 g [ESTIMATED]. Pull equivalent: the winding mechanism limits maximum stored energy to the spring constant × compression:

    E_winder ≈ 0.5 × k_spring × x² (spring energy)
    Typical: k ≈ 800–1200 N/m, x ≈ 8–12 mm
    E_winder ≈ 0.5 × 1000 × (0.010)² ≈ 0.050 J

This is drastically less energy than a ripcord pull (10–22 J). Winder-launched beys spin at ~50–150 rad/s at most — well below competitive levels (400+ rad/s).

### 2. Physics

**Launch spin:**
    ω₀_winder ≈ √(2 × 0.050 / 2.5×10⁻⁵) ≈ 63 rad/s ≈ 600 RPM

Compared to ripcord: ~13% of ripcord launch spin. Winder-launched beys cannot compete in any competitive setting — they destabilize immediately due to low spin (stability < 0.4 × ω_max threshold from game mechanics).

**Historical context:**
The Winder predates the Ripcord era (pre-Bakuten Shoot / original Beyblade 1999 S1). Replaced by standard ripcord launchers by S1 mid-run. Retained only as a nostalgic toy mechanic.

### 3. Game Engine Mapping

```typescript
interface Winder {
  name: "winder";
  generation: "plastic_gen_pre_ripcord";
  launchType: "spring_wind";
  maxEnergy_J: 0.05;
  launchSpin_radPerS: 63;             // ~600 RPM — non-competitive
  competitiveUse: false;
}
```

### 4. Verdict

Pre-ripcord starter mechanism. Non-competitive. Historical significance as the origin format. Replaced by standard ripcord launchers.

---

## Case 761 — Standard Ripcord Launcher (EZ Shooter) — Plastic Gen Baseline

### 1. Geometry

The Standard Ripcord Launcher (marketed as "EZ Shooter" in Hasbro markets) is the baseline plastic generation launcher used throughout S1–S3 and into the V-Force / G-Revolution era. A plastic housing contains a gear assembly; the blader inserts the beyblade onto the launcher gear spindle and pulls a ripcord through the mechanism to spin the bey.

Weight: ~35–45 g. Pull distance: 250–270 mm (ripcord length limits maximum draw). Ripcord width: 5–6 mm.

### 2. Physics

**Standard ripcord energy:**
At F_pull = 60 N, d = 260 mm:

    E = 60 × 0.260 = 15.6 J
    η_gear ≈ 0.73 (standard plastic gear train)
    E_useful = 11.4 J
    ω₀ ≈ √(2 × 11.4 / 2.5×10⁻⁵) ≈ 954 rad/s   ← theoretical max at peak force
    Realistic average (F ≈ 45N, consistent): ω₀ ≈ 735 rad/s ≈ 7020 RPM

**Ripcord tooth engagement:**
Standard ripcord: 15–20 gear teeth engage during full pull. Each tooth engagement advances bey rotation by ~0.2–0.3 rad. Total rotation ≈ 15 × 0.25 = 3.75 rad during pull.

The launch angle (angle of ripcord relative to horizontal) affects launch tilt:

    Pull angle ≈ 20–45° above horizontal → launch tilt ≈ 0–15° (Sliding Shoot territory)
    Standard power launch: ripcord pulled horizontally → near-zero initial tilt

### 3. Game Engine Mapping

```typescript
interface StandardRipcordLauncher {
  name: "ez_shooter";
  generation: "plastic_gen";
  pullDistance_mm: 260;
  gearEfficiency: 0.73;
  launchSpin_radPerS: 735;             // realistic average
  peakSpin_radPerS: 954;               // peak force
  ripcordTeeth: 18;
  slidingShootCapable: true;           // angle-dependent tilt
  rightSpinOnly: true;                 // standard right-spin
  competitiveUse: true;
  era: "S1_through_G_Revolution";
}
```

### 4. Verdict

The universal baseline for plastic gen competitive play. All plastic gen launch speed comparisons reference this launcher. Accessible, reliable, supports Sliding Shoot technique. The Customize Grip attachment (Case 765) improves ergonomics. Replaced by HMS Shooter for HMS format.

---

## Case 762 — Reverse Shooter / Left Spin Shooter (SonoKong / Hasbro) — Left-Spin Launch Mechanism

### 1. Geometry

The Reverse Shooter (or Left Spin Shooter) is the left-spin-capable ripcord launcher for beys requiring Counter-Clockwise (CCW) rotation. Standard ripcord launchers pull the ripcord rightward, spinning the bey clockwise (RS). The Reverse Shooter reverses gear direction — pulling the ripcord spins the bey counter-clockwise.

Weight: ~35–45 g (same form factor as EZ Shooter). Pull distance: 250–270 mm. Available from: SonoKong (Asia markets), Hasbro (some LS bey releases).

### 2. Physics

**Mirror-image launch:**
The internal gear train direction is reversed. Energy calculations are identical to the Standard EZ Shooter (Case 761):

    E_reverse = F_pull × d_pull × η_gear ≈ 11.4 J
    ω₀_LS ≈ 735 rad/s CCW

**Left-spin strategy physics:**
Left-spin launch enables:
1. Same-direction co-rotation against LS opponents (stamina matching)
2. Counter-rotation spin-steal against RS opponents
3. Upper-attack ARs with left-spin geometry (Penta Wing, Reverse Dragon)

The game physics consequences of left-spin vs right-spin are entirely AR and BB dependent (Cases 103, 172, 240, etc.) — the launcher itself contributes only spin direction, not spin magnitude.

### 3. Game Engine Mapping

```typescript
interface ReverseShooter {
  name: "reverse_shooter";
  generation: "plastic_gen";
  spinDirection: "left";               // CCW
  pullDistance_mm: 260;
  launchSpin_radPerS: 735;             // identical to EZ Shooter magnitude
  gearEfficiency: 0.73;
  mirrorOfStandard: true;
  competitiveUse: true;
  note: "Required for competitive left-spin AR builds (Penta Wing, Reverse Dragon, etc.)";
}
```

### 4. Verdict

Required equipment for left-spin bey competitive use. Physics identical to Standard Ripcord Launcher in magnitude. Enables counter-spin meta strategies across all left-spin AR archetypes documented in CS2–CS4.

---

## Case 763 — HMS Double Shooter (HMS Era) — Compact High-Gear-Ratio Launcher for Small-Diameter HMS Beys

### 1. Geometry

The HMS Double Shooter (also: HMS Shooter) is purpose-designed for the Hard Metal System format. HMS beys are smaller diameter (≈ 35–38 mm outer) than plastic gen beys (≈ 45–55 mm outer). The standard EZ Shooter's gear spindle diameter is too large for HMS beys' launch shaft. The HMS Double Shooter uses a narrower spindle matched to the HMS bit protector recess.

Weight: ~40–55 g. Pull distance: 240–260 mm. Includes gear ratio adjustment for the smaller HMS diameter.

### 2. Physics

**Gear ratio compensation:**
HMS bey outer radius ≈ 18–20 mm vs plastic gen ≈ 24–28 mm. At same ripcord pull energy:

    ω₀_HMS = ω₀_plastic × (r_plastic / r_HMS) × (I_plastic / I_HMS)^0.5

HMS combos: I ≈ 1.0–1.8 × 10⁻⁵ kg·m² (lighter, smaller diameter)
Plastic gen combos: I ≈ 2.0–3.5 × 10⁻⁵ kg·m²

At equal pull energy (11.4 J):

    ω₀_HMS ≈ √(2 × 11.4 / 1.3×10⁻⁵) ≈ 1322 rad/s ≈ 12,630 RPM

HMS beys launch at substantially higher RPM than plastic gen at equal energy input — their smaller, lighter format achieves much higher rotational speed from the same pull. This is why HMS meta is faster-paced (higher initial spin rates) than plastic gen.

**Compatibility:**
HMS Double Shooter is incompatible with plastic gen beys (spindle too narrow) and incompatible with MFB+ (different shaft architecture). Dedicated HMS-only hardware.

### 3. Game Engine Mapping

```typescript
interface HMSDoubleShoter {
  name: "hms_double_shooter";
  generation: "HMS";
  compatibleSystem: ["HMS"];
  pullDistance_mm: 250;
  gearEfficiency: 0.75;
  launchSpin_radPerS: 1322;            // HMS combo at peak — ~12,600 RPM
  realisticSpin_radPerS: 1000;         // practical average
  spindle: "narrow_hms_fit";
  rightSpinCapable: true;
  leftSpinCapable: true;               // double = both spin directions
  incompatibleWith: ["plastic_gen", "MFB", "burst"];
}
```

### 4. Verdict

The correct launcher for HMS competitive play. Higher launch RPM than plastic gen launchers due to smaller HMS bey inertia — HMS meta dynamics depend on this higher initial spin baseline. The "Double" designation indicates dual left/right spin capability in a single unit. Essential equipment for any HMS competitive blader.

---

## Case 764 — BeyStringer / String Launcher (MFB Era) — 2–3× Pull Distance, Highest Launch Energy

### 1. Geometry

The BeyStringer (also: String Launcher) replaces the ripcord with a long-pull string mechanism. Instead of a rigid ripcord with fixed teeth, the string wraps around the launch spool multiple times. Pull distance: 600–800 mm (vs ripcord's 250–280 mm) with comparable user effort per unit distance.

Weight: ~60–80 g (launcher body + string assembly). String length (usable wrap): 650–750 mm.

### 2. Physics

**Energy advantage:**
At F = 60 N, d = 700 mm:

    E_string = 60 × 0.700 = 42 J
    η_string ≈ 0.85 (fewer gear stages, string wraps directly → less mechanical loss)
    E_useful = 35.7 J vs ripcord's 11.4 J → 3.1× more energy

**Launch spin:**
    ω₀_string ≈ √(2 × 35.7 / 2.5×10⁻⁵) ≈ 1689 rad/s ≈ 16,130 RPM

This is well above ripcord launch speed (7020 RPM). String launcher builds sustain spin long enough to outlast ripcord-launched opponents in stamina matches — the initial spin advantage translates directly to battle duration.

**String tension consistency:**
String launchers provide more uniform force application than ripcords (no gear-tooth discretization). The string unwinds continuously → smoother angular acceleration profile → less launch shock → marginally better launch tilt control.

**Wear:**
String fraying over ~200–300 launches. String tensioners can adjust for minor stretch. Critical check: kinked strings introduce uneven unwinding → tilt anomalies.

### 3. Game Engine Mapping

```typescript
interface BeyStringer {
  name: "beystringer";
  generation: "MFB";
  pullDistance_mm: 700;
  gearEfficiency: 0.85;
  launchSpin_radPerS: 1689;            // ~16,100 RPM at 60N pull
  vsRipcord: {
    energyMultiplier: 3.1,
    rpmMultiplier: 2.3,
    consistencyBonus: true
  };
  forceCurve: "continuous";            // no tooth discretization
  rightSpinOnly: false;                // L/R variants exist
  wearMode: "string_fray";
  competitiveUse: true;
  recommendedFor: ["stamina", "balance", "competitive_MFB"];
}
```

### 4. Verdict

The highest-energy mainstream launcher. BeyStringer's 3× energy advantage over standard ripcords is the dominant reason MFB-era competitive metas shifted to string-launched combos. Stamina builds especially benefit: the extra launch spin translates directly to battle time. Required equipment for MFB+ serious competitive play.

---

## Case 765 — Launcher Grip / Customize Grip (Cross-Gen) — Ergonomic Platform: Angle and Force Transfer Enhancement

### 1. Geometry

Launcher Grips are handles that attach beneath the launcher body, converting a top-held launcher into a pistol-grip configuration. Types: Standard Grip (90° handle), Catapult Grip (extended lever arm), Sniper Grip (low-angle), Customize Grip (modular, plastic gen — accepts SP attachments). Weight: 30–60 g depending on type.

### 2. Physics

**Mechanical advantage from extended handle:**
A launcher grip extends the moment arm from the blader's hand to the launcher:

    Standard launcher (no grip): moment arm ≈ 80 mm (held at body)
    With catapult grip: moment arm ≈ 160 mm (2× extension)

Mechanical advantage → blader can generate more torque with same hand-force:

    F_effective = F_hand × (L_grip / L_launcher)
    At L_grip = 160mm, L_launcher = 80mm, F_hand = 40N:
    F_effective = 40 × (160/80) = 80N

This doubles the effective pull force → doubles launch energy:

    E_catapult = 80N × 0.260m = 20.8J vs standard 10.4J → 2× energy from grip alone

**Angle control:**
Grip configuration allows more consistent launch angle maintenance. Without grip, wrist angle varies ±10–15°. With grip, mechanical constraint → ±5°. Tighter angle = more consistent tilt initialization = better Sliding Shoot execution.

**Customize Grip (plastic gen):**
The Customize Grip accepts Support Part (SP) attachments on a secondary rail. Competitive builds could attach Defense Ring SP (Case 149 from CS3) or custom extensions, though this is primarily aesthetic.

### 3. Game Engine Mapping

```typescript
interface LauncherGrip {
  name: "launcher_grip";
  types: ["standard", "catapult", "sniper", "customize"];
  momentArmExtension_mm: { standard: 80, catapult: 80, sniper: 60 }; // extension over bare launcher
  forceMultiplier: { catapult: 2.0, standard: 1.5, sniper: 1.3 };
  angleConsistencyBonus: { standard: 0.50, catapult: 0.65, sniper: 0.55 }; // tighter launch angle
  crossGen: true;
  competitiveUse: true;
  note: "Catapult Grip doubles effective pull force — significant energy boost for strong bladers";
}
```

### 4. Verdict

A high-impact competitive accessory. The catapult grip variant doubles effective launch force through mechanical advantage — translating directly to doubled launch energy without any physical effort increase. Standard Grip provides angle stability benefits. Recommended for all competitive play; Catapult Grip is the strongest performer. Customize Grip is plastic gen's modular variant with SP attachment support.

---

## Case 766 — Light Launcher 2 (MFB Era) — Compact Reduced-Pull Entry Launcher

### 1. Geometry

Light Launcher 2 is a compact version of the standard MFB launcher. Pull distance: 180–200 mm (vs full launcher 260 mm). Weight: ~25–30 g (lighter plastic construction). Designed for younger players or as a secondary/practice launcher.

### 2. Physics

**Reduced energy from shorter pull:**
At F = 50N, d = 190mm:

    E_LL2 = 50 × 0.190 = 9.5 J
    η = 0.72
    E_useful = 6.8 J
    ω₀_LL2 ≈ √(2 × 6.8 / 2.5×10⁻⁵) ≈ 737 rad/s ≈ 7040 RPM

~73% of full launcher spin output. Usable for casual play but at a competitive disadvantage vs full launchers.

**Use case:**
Launch-accuracy practice: shorter pull = faster completion cycle = more practice launches per session. Professional bladers sometimes practice launch angle with Light Launcher 2 before switching to full launcher for competition.

### 3. Game Engine Mapping

```typescript
interface LightLauncher2 {
  name: "light_launcher_2";
  generation: "MFB";
  pullDistance_mm: 190;
  gearEfficiency: 0.72;
  launchSpin_radPerS: 737;
  vsFullLauncher: { spinFraction: 0.73 };
  competitiveUse: "casual_or_practice";
}
```

### 4. Verdict

Practice and casual launcher. 73% of full launcher energy — acceptable for casual play, insufficient for competitive. Valid as a practice tool for launch angle consistency drills.

---

## Case 767 — Burst Launcher (Standard Ripcord, L/R) — Generation 3 Standard: Lock-Tooth Ripcord for Burst Format

### 1. Geometry

The Burst Launcher (sold with B-series starters) is the standard ripcord launcher for the Burst generation. Two variants: Right-spin (Rk) and Left-spin (Lk). Pull distance: 260–280 mm. New feature vs plastic gen: toothed "locking" mechanism that holds the beyblade more securely on the launcher tip during loading, preventing accidental release before the pull.

Weight: ~40–50 g. Gear material: nylon reinforced (more durable than plastic gen ABS gears).

### 2. Physics

**Burst-format launch requirements:**
Burst beys have a burst mechanism activated at a damage threshold. Launch spin must exceed minimum competitive spin to prevent self-burst on first opponent contact:

    ω₀_required ≥ ω_burst_threshold × (1 + margin) ≈ 350 × 1.5 = 525 rad/s minimum

Standard Burst Launcher at F = 55N, d = 270mm:

    E = 55 × 0.270 = 14.85J
    η = 0.76
    E_useful = 11.3J
    ω₀ ≈ √(2 × 11.3 / 2.0×10⁻⁵) ≈ 1062 rad/s ≈ 10,145 RPM

Well above burst threshold. Lock-tooth mechanism increases secure engagement:

    Tooth engagement ratio: 95% vs plastic gen 85% → 10% fewer false-engagement launches

### 3. Game Engine Mapping

```typescript
interface BurstLauncher {
  name: "burst_launcher";
  generation: "burst";
  variants: ["right_rk", "left_lk"];
  pullDistance_mm: 270;
  gearEfficiency: 0.76;
  launchSpin_radPerS: 1062;
  lockToothEngagement: 0.95;
  burstThresholdClearance: true;
  nylonGears: true;                    // more durable than plastic gen ABS
  compatibleWith: ["burst_standard", "burst_dl", "burst_god", "burst_cz", "burst_gt", "burst_sk", "burst_db", "burst_bu"];
}
```

### 4. Verdict

Standard Burst era launcher. Higher engagement reliability (lock-tooth mechanism) and adequate spin output for all Burst format beys. Nylon gear construction extends service life. Replace plastic gen launcher with this for any Burst competitive context.

---

## Case 768 — Burst String Launcher (B-88 / B-99 Variants) — String Mechanism for Burst Era

### 1. Geometry

The Burst String Launcher applies the BeyStringer's string-pull mechanism to the Burst format. Pull distance: 650–720 mm. Compatible with Burst beys' shaft dimensions. Released as B-88 (Standard) and B-99 (upgraded) variants in Japan.

### 2. Physics

**Burst string energy:**
At F = 60N, d = 680mm:

    E = 60 × 0.680 = 40.8J
    η_string = 0.86
    E_useful = 35.1J
    ω₀_burst_string ≈ √(2 × 35.1 / 2.0×10⁻⁵) ≈ 1873 rad/s ≈ 17,890 RPM

vs Burst ripcord ~1062 rad/s: 76% higher spin from string launcher. In Burst format, this translates to:

**Burst resistance bonus:**
    At ω₀_string = 1873 rad/s vs ω₀_ripcord = 1062 rad/s:
    Time above burst-resist threshold (ω > ω_burst) scales with ω₀:
    String launcher provides ~76% longer burst-resist window

This is the primary competitive advantage: string-launched Burst beys are significantly harder to burst in the first half of the battle.

### 3. Game Engine Mapping

```typescript
interface BurstStringLauncher {
  name: "burst_string_launcher";
  variants: ["b88", "b99"];
  generation: "burst";
  pullDistance_mm: 680;
  gearEfficiency: 0.86;
  launchSpin_radPerS: 1873;
  vsBurstRipcord: {
    spinMultiplier: 1.76,
    burstResistExtension: 0.76       // 76% longer burst-resist window
  };
  competitiveUse: true;
  recommendedFor: ["competitive_burst", "stamina", "defense"];
}
```

### 4. Verdict

Top competitive Burst launcher. 76% higher launch spin than standard ripcord → extended burst resistance in early battle, longer overall spin duration. B-99 revision improves string feeding consistency over B-88. Essential for serious Burst competitive play.

---

## Case 769 — BX Launcher (Gen 4 / X Series) — Ratchet-Click Mechanism, Consistent High-Energy Pull

### 1. Geometry

The BX Launcher (sold with all BX-series starters) uses a ratchet-click pull mechanism — the ripcord engages a ratchet gear that prevents back-slip during the pull. This provides a notched, click-feel pull that ensures consistent tooth engagement regardless of pull technique variation. Pull distance: 270–290 mm. Weight: ~50–60 g. Available in R (right) and L (left) spin variants.

### 2. Physics

**Ratchet consistency bonus:**
Standard ripcord launchers (plastic gen, Burst) can have variable tooth engagement based on pull angle and speed. The BX ratchet mechanism eliminates back-slip:

    Tooth engagement rate: ~99% (ratchet locks each tooth advance)
    vs standard ripcord: ~85–92% engagement rate
    Consistency improvement: ~10% reduction in launch variance

**BX launch energy:**
At F = 65N, d = 280mm:

    E = 65 × 0.280 = 18.2J
    η_ratchet = 0.78 (ratchet has slight additional friction vs plain ripcord)
    E_useful = 14.2J
    ω₀_BX ≈ √(2 × 14.2 / 1.8×10⁻⁵) ≈ 1256 rad/s ≈ 12,000 RPM

BX beys have lower inertia (smaller, lighter) → higher RPM at equivalent energy vs larger beys.

**Ratchet wear pattern:**
The ratchet pawl wears over ~300–500 launches (later than standard ripcord at 50–100). When the pawl wears, back-slip reappears → drops to standard ripcord consistency. Replace launcher assembly or pawl component at this point.

### 3. Game Engine Mapping

```typescript
interface BXLauncher {
  name: "bx_launcher";
  generation: "BX";
  variants: ["right_r", "left_l"];
  pullDistance_mm: 280;
  gearEfficiency: 0.78;
  launchSpin_radPerS: 1256;
  ratchetMechanism: true;
  engagementRate: 0.99;               // near-perfect tooth engagement
  launchVariance: "very_low";
  wearLifeLaunches: 400;              // ratchet outlasts ripcord teeth ~4×
  compatibleWith: ["BX_basic", "BX_unique", "BX_custom"];
  incompatibleWith: ["plastic_gen", "HMS", "MFB", "burst"];
}
```

### 4. Verdict

The most consistent launcher per pull-force input. The ratchet mechanism virtually eliminates variable engagement — every pull converts energy reliably. BX-specific shaft geometry means it cannot be used with older beys. Combined with BX's lighter-inertia beyblade format, launch RPM exceeds older generation launchers significantly. Recommended over all plastic alternatives for BX competitive play.

---

## Case 770 — Ripcord (Consumable Accessory) — Tooth Wear Physics, Launch Force Transmission

### 1. Geometry

The ripcord is the consumable pull-string component of ripcord launchers. Plastic (nylon reinforced), 250–290 mm usable length. Gear teeth molded into one face at 8–12 mm intervals. Each tooth engages one launcher gear step.

Weight: ~3–5 g. Standard colors: white, black, red, grey.

### 2. Physics

**Tooth engagement mechanics:**
Each tooth advances the launcher gear by:

    Δθ_per_tooth ≈ (2π / N_launcher_gear_teeth)
    At N_gear = 30 teeth: Δθ = 0.209 rad per ripcord tooth
    Full pull of 18 teeth: Δθ_total = 18 × 0.209 = 3.76 rad rotation

**Wear progression:**
| Launches | Tooth Height Remaining | Effective Pull Force Transmission |
|---------|----------------------|----------------------------------|
| 0–20 | 100% | 100% |
| 20–50 | 90–95% | 95–100% |
| 50–100 | 75–85% | 80–90% |
| 100+ | 60–75% | 65–78% |

Each launch shears the tooth tip slightly. At 100+ launches:

    ω₀_worn / ω₀_new ≈ √(E_worn / E_new) ≈ √(0.72) ≈ 0.85
    15% launch speed reduction at 100+ launches — competitive threshold

**Replace when:**
- Launch spin audibly drops (bey sounds slower)
- Slipping observed mid-pull (tooth skip)
- Visual: tooth height < 50% of original

### 3. Game Engine Mapping

```typescript
interface Ripcord {
  name: "ripcord";
  usableLength_mm: 265;
  toothCount: 18;
  toothEngageAngle_rad: 0.209;
  totalBeyRotation_rad: 3.76;
  wearCurve: {
    launches_0_50: 1.00,             // 100% efficiency
    launches_50_100: 0.90,           // 90% efficiency
    launches_100plus: 0.80           // 80% — replace recommended
  };
  replacementThreshold_launches: 100;
  consumable: true;
  compatibleWith: ["ez_shooter", "reverse_shooter", "burst_launcher"];
}
```

### 4. Verdict

Consumable hardware requiring replacement every 50–100 competitive launches. Worn ripcords cost ~15–20% launch spin — a measurable competitive disadvantage. Maintain a stock of fresh ripcords; replace proactively every ~75 launches in competitive settings.

---

## Case 771 — Launcher Grip Level 5 / Custom Grip (Burst Era) — Spring-Loaded Grip, Wrist Angle Lock

### 1. Geometry

The Launcher Grip Level 5 (Takara Tomy, Burst era) is an advanced grip attachment with a spring-loaded wrist support that locks launch angle at a pre-set degree. Weight: ~80–100 g. Compatible with Burst launchers and string launchers. The spring mechanism dampens wrist deviation during pull, constraining launch angle to within ±3° of target.

### 2. Physics

**Angle constraint physics:**
Without grip: launch angle variance ±10–15° (wrist fatigue + biomechanical variation)
With Level 5 Grip: launch angle variance ±3–4° (spring constraint + wrist support)

At a 15° tilt angle reduction in variance, the spread of launch tilt effects:

    Δω_initial_tilt_variance (no grip): ≈ 50 rad/s spread
    Δω_initial_tilt_variance (Level 5): ≈ 15 rad/s spread → 70% reduction in launch inconsistency

**Ergonomic force multiplier:**
Extended handle: L_grip = 120 mm:

    Force multiplier ≈ (L_grip + L_launcher) / L_launcher = (120 + 80) / 80 = 2.5×
    At F_hand = 50N: F_effective = 125N pull force
    E_Level5 = 125 × 0.270 = 33.75J vs ungrippped 13.5J → 2.5× energy

Combined with angle consistency: Level 5 is the highest-performance grip accessory.

### 3. Game Engine Mapping

```typescript
interface LauncherGripLevel5 {
  name: "launcher_grip_level_5";
  generation: "burst";
  springLoaded: true;
  angleVariance_deg: 3;                // constrained from ±12° to ±3°
  forceMultiplier: 2.5;
  launchConsistencyImprovement: 0.70;  // 70% reduction in launch variance
  compatibleWith: ["burst_launcher", "burst_string_launcher", "bx_launcher"];
  competitiveUse: true;
}
```

### 4. Verdict

The highest-performance grip accessory in the competitive game. The spring-loaded wrist support eliminates most launch angle variance — producing more consistent initial tilt and energy transfer than any lower-tier grip. Combined force multiplier (2.5×) provides near-string-launcher energy from a ripcord pull. Standard tournament equipment for serious Burst-era bladers.

---

## Case 772 — Winder (Spring Wind Accessory, Burst Era) — Motor-Wound Gyroscope Precession Stabilizer

### 1. Geometry

The "Winder" concept reappears in Burst era not as a primary launcher but as a precession-stabilization tool: a small motor device that pre-spins a bey on a stand to test LAD angle and stadium entry behavior before a match. Weight: ~60–80 g (includes motor). Not a competition launcher — demonstration and tuning tool.

### 2. Physics

**Pre-spin stabilization testing:**
At ω_winder ≈ 200–300 rad/s (low motor speed):

    Gyroscopic moment: L = I × ω ≈ 2.5×10⁻⁵ × 250 = 6.25×10⁻³ N·m·s
    Precession rate: Ω_p = τ_gravity / L ≈ (m × g × h_CoM) / L

Blader can observe precession direction and tilt angle onset to tune SG/RC bottom choice before committing to a match launch. This informs:
- BB height adjustment for bottom-height-sensitive ARs
- WD substitution choice (circular vs asymmetric wobble test)
- Tilt threshold calibration for Mode-Change cores

Non-competitive use; no match launch function.

### 3. Game Engine Mapping

```typescript
interface BurstWinder {
  name: "burst_winder";
  generation: "burst";
  motorRPM: 2500;                      // ~260 rad/s
  function: "pre_match_tuning";
  competitiveUse: false;
  diagnosticValue: true;               // precession observation before launch
}
```

### 4. Verdict

Tuning tool. No direct competitive function as a launcher. Valuable for pre-match combo tuning — observing precession at low spin reveals tilt susceptibility and WD balance issues before a full-power launch. Not counted in competition equipment; supplementary accessory.

---

## Case 773 — RC Shooter / RC EG Launcher (Plastic Gen G-Rev Era) — Remote-Controlled Launch System

### 1. Geometry

The RC Shooter (Dragoon G version) and RC EG Launcher are remote-control capable launchers for G-Revolution Engine Gear beys. An RF transmitter in the launcher handle allows the blader to trigger the Engine Gear spring release mid-battle (up to 8 meters range). Weight: ~120–150 g (includes battery compartment). Pull mechanism: standard ripcord (non-remote), plus RF trigger for EG release timing.

### 2. Physics

**Remote EG trigger timing:**
Engine Gear spring release (the "Final Clutch" or "Battle Change" trigger) normally activates at a spin threshold (mechanical). With RC Shooter, the blader can trigger it manually:

    E_EG_spring ≈ 0.5 × k_spring × x²  (same spring, manual trigger)
    Optimal trigger timing: at battle contact (adds ~15–25 rad/s spin boost during collision)

The RC adds strategic timing control to EG mechanics — blader chooses the optimal tactical moment rather than relying on mechanical auto-trigger.

**RF range and latency:**
At 8 m range, RF signal latency ≈ 0.1 ms — negligible vs battle contact duration (~3 ms). The trigger command effectively arrives instantaneously at human-relevant timescales.

### 3. Game Engine Mapping

```typescript
interface RCShooter {
  name: "rc_shooter";
  generation: "plastic_gen_g_rev";
  ripcordEnergy_J: 11.4;              // standard ripcord component
  remoteTrigger: true;
  rfRange_m: 8;
  rfLatency_ms: 0.1;
  egReleaseControl: true;             // manual timing of EG spring release
  batteryRequired: true;
  competitiveStatus: "banned_in_most_formats"; // unfair remote advantage
  historicalNote: "Introduced remote EG timing — novel mechanic, rarely legal";
}
```

### 4. Verdict

Mechanically interesting but competitively problematic. The remote EG trigger gives one blader real-time control unavailable to opponents without the same equipment. Most tournament formats banned or restricted RC Shooters. Historical value: demonstrates the design space for launcher-mediated mid-battle intervention. Not recommended for competitive play.

---

## Case 774 — Sliding Shoot Technique (All Ripcord Launchers) — Angle-Dependent Launch Tilt Initialization

### 1. Geometry

Sliding Shoot is not a separate launcher but a launch technique achievable with any ripcord launcher. By tilting the launcher at an angle during the pull (rather than pulling horizontally), the blader imparts an initial tilt angle to the beyblade at launch:

    Initial tilt θ_launch ≈ 0.5 × launch_angle_from_horizontal

At a 30° downward pull angle: θ_launch ≈ 8–15° (depending on AR geometry and launch height).

### 2. Physics

**Tilt-to-flower pattern conversion:**
An initial tilt θ > θ_switch activates tip mode changes (Metal Change Core, Case 134 — switch angle 8°; Spiral Change Base — mode switch angle 10°+):

    θ_launch > θ_switch → mode activates at launch → pattern begins immediately

Without Sliding Shoot, the bey must receive a hit to reach θ_switch. Sliding Shoot pre-activates the pattern from the first moment of contact with the stadium floor.

**Power-Sliding Shoot:**
Combined high-force pull + angled release:

    F_pull = 70N (strong blader)
    d = 260mm
    θ = 25° downward angle
    E_pull = 70 × 0.260 = 18.2J
    Initial tilt delivered simultaneously with high energy → offensive pattern immediately

Power-Sliding Shoot is the standard technique for Metal Change Core, Grip Flat Core, and all flat-tip attack builds.

**Stadium entry position:**
Sliding Shoot angle also controls where the bey enters the stadium. Steeper angle → lands further from center → immediate wall contact. Blader can target the bey to enter on the opponent's side of the stadium on launch.

### 3. Game Engine Mapping

```typescript
function slidingShootTilt(
  launchAngle_deg: number,
  launchHeight_mm: number
): number {
  // Approximate initial tilt from launch angle and entry geometry
  const tilt = launchAngle_deg * 0.4 + (launchHeight_mm / 100) * 2;
  return Math.min(tilt, 45); // cap at 45° physical maximum
}

function isModeActivatedAtLaunch(
  initialTilt_deg: number,
  tipSwitchAngle_deg: number
): boolean {
  return initialTilt_deg > tipSwitchAngle_deg;
  // Metal Change Core: tipSwitchAngle = 8° → Sliding Shoot with 20° angle → activated
}
```

### 4. Verdict

The highest-impact technique in plastic gen/HMS competitive play. Sliding Shoot's tilt initialization activates mode-change RCs from launch, controls stadium entry position, and applies the blader's strongest pull-force burst simultaneously. Any launcher (EZ Shooter, HMS Double Shooter, BeyStringer) can execute Sliding Shoot — the technique is launcher-independent. Masters of Power-Sliding Shoot (steep angle + maximum force) dominate Metal Change Core, Grip Flat Core, and Free Shaft Core builds.

---

## Case 775 — Beypointer / BeyLogger (Burst Era) — Electronic Spin-Tracking Accessory

### 1. Geometry

The Beypointer (Takara Tomy, Burst era) is an electronic handheld device that:
1. Tracks accumulated BeyPoints from battles
2. Reads QR codes on Burst beys to register the combo
3. Displays battle records and unlocks in-game content

Not a launcher — a data accessory. Weight: ~60–80 g (handheld device). Requires AAA batteries. Bluetooth connectivity for app integration (optional).

### 2. Physics

**No direct physics contribution** to battle mechanics. The Beypointer records:

    BeyPoints: function(result, spin_time) → points
    Spin_time measured via internal clock from battle start to beyblade stop

Competitive physics relevance: zero. The device has no bearing on launch energy, spin speed, or contact mechanics.

**Data value:**
Accumulated spin-time data across battles provides empirical stamina measurements (real I and μ values for the combo used). Advanced bladers can extract:

    μ_empirical = 2 × I_combo × Δω / (m × g × r_tip × Δt)

By measuring Δω (spin loss) over Δt (time) under known conditions. This is a useful calibration tool for verifying engine constants.

### 3. Game Engine Mapping

```typescript
interface Beypointer {
  name: "beypointer";
  generation: "burst";
  competitiveImpact: "none";
  dataFunction: ["qr_read", "beypoint_track", "spin_time_record"];
  calibrationUse: "empirical_mu_measurement";
  batteryType: "AAA";
  note: "No battle physics effect — data accessory only";
}
```

### 4. Verdict

Electronic accessory — zero competitive physics impact. Valuable for empirical calibration of combo stamina and friction constants. Collect if running data-driven combo optimization; ignore for pure competitive play.

---

## Case 776 — Power Launcher / BeyMax Shooter (Plastic Gen Enhanced) — Spring-Tension Boost Mechanism

### 1. Geometry

The Power Launcher (also marketed as BeyMax Shooter in some regions) incorporates a spring-tension pre-loader inside the launcher body. Before pulling the ripcord, the blader compresses a spring mechanism in the grip, storing additional potential energy:

    E_spring_preload = 0.5 × k_spring × x²
    At k = 900 N/m, x = 15 mm: E_preload = 0.5 × 900 × (0.015)² = 0.10 J

This adds to the ripcord pull energy:

    E_total = E_ripcord + E_preload = 11.4 + 0.10 = 11.5 J

The 0.10 J spring contribution is ~0.9% of total energy — negligible performance improvement. The Power Launcher's competitive advantage over standard EZ Shooter is minimal.

### 2. Physics

**Energy budget:**
The spring pre-load adds less than 1% to total energy. At ω₀_EZShooter ≈ 735 rad/s:

    Δω₀_preload ≈ 735 × (√(11.5/11.4) - 1) ≈ 735 × 0.0044 ≈ 3.2 rad/s improvement

3.2 rad/s is below the noise floor of launch variability (~±30 rad/s). Power Launcher's spring mechanism is primarily a marketing differentiator, not a competitive edge.

### 3. Game Engine Mapping

```typescript
interface PowerLauncher {
  name: "power_launcher";
  generation: "plastic_gen";
  baseEnergy_J: 11.4;
  springPreload_J: 0.10;
  totalEnergy_J: 11.5;
  spinImprovement_radPerS: 3;          // negligible
  marketingClaim: true;
  actualAdvantage: "minimal";
  vsEZShooter: { energyDiff: "less_than_1_percent" };
}
```

### 4. Verdict

Marketing upgrade — minimal competitive benefit. The spring pre-load adds < 1% energy over standard EZ Shooter. Prefer standard EZ Shooter + Catapult Grip (which provides 2× energy via mechanical advantage) over Power Launcher's negligible spring supplement. No meaningful competitive differentiation.

---

## Case 777 — Launcher Compatibility Matrix (Cross-Gen Reference) — Which Launcher Works With Which Bey

### 1. Geometry

Each beyblade generation uses a different launcher spindle diameter and mechanism interface. Cross-generation compatibility is limited.

### 2. Compatibility Table

| Launcher | Plastic Gen | HMS | MFB/4D/ZeroG | Burst All | BX/UX/CX |
|----------|------------|-----|-------------|-----------|---------|
| EZ Shooter (ripcord) | ✓ | ✗ | ✓ (adapter) | ✗ | ✗ |
| Reverse Shooter | ✓ (LS) | ✗ | ✗ | ✗ | ✗ |
| HMS Double Shooter | ✗ | ✓ | ✗ | ✗ | ✗ |
| BeyStringer (L/R) | ✗ | ✗ | ✓ | ✓ (adapter) | ✗ |
| Burst Launcher Rk/Lk | ✗ | ✗ | ✗ | ✓ | ✗ |
| Burst String Launcher | ✗ | ✗ | ✗ | ✓ | ✗ |
| BX Launcher R/L | ✗ | ✗ | ✗ | ✗ | ✓ |
| Light Launcher 2 | ✗ | ✗ | ✓ | ✓ (reduced) | ✗ |

Note: Some adapters allow cross-gen use at reduced efficiency (5–15% energy loss).

### 3. Game Engine Mapping

```typescript
const launcherCompatibility: Record<string, string[]> = {
  ez_shooter:            ["plastic_gen_sgs", "plastic_gen_egs", "plastic_gen_mgs", "mfb_adapter"],
  reverse_shooter:       ["plastic_gen_left_spin"],
  hms_double_shooter:   ["hms"],
  beystringer:           ["mfb", "4d", "zerog", "burst_adapter"],
  burst_launcher_rk:    ["burst_std", "burst_dl", "burst_god", "burst_cz", "burst_gt", "burst_sk", "burst_db", "burst_bu"],
  burst_string_launcher: ["burst_std_up"],
  bx_launcher:           ["bx_basic", "bx_unique", "bx_custom"],
  light_launcher_2:      ["mfb", "burst_reduced"],
};
```

### 4. Verdict

Reference table for cross-gen setup validation. HMS and BX formats require their dedicated launchers — no cross-compatibility. Plastic gen beys require EZ Shooter or Reverse Shooter; adapters exist for MFB use with EZ Shooter at minor energy loss.

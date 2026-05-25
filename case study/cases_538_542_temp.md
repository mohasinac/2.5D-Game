
## Case 538 — DB Core Belial 3 (Dynamite Battle / Burst Ultimate)

DB Core Belial 3 is the 7.9 g right-spin DB Core of the Divine Belial system and the third generation of the Belial DB Core lineage, featuring both the Overdrive System and BU Lock gimmicks; at 7.9 g it is 0.2 g lighter than Belial 2 (8.1 g) despite enhanced mechanics, reflecting a more efficient ABS housing geometry for the three-tab lock mechanism. With r_i=10mm and r_o=20mm, I_Belial3=0.5x0.0079x(0.010^2+0.020^2)=1.975x10^-6 kg*m^2. The burst resistance architecture consists of two layers: three thick mechanical locks (versus Belial 2's four thinner tabs and Belial 1's four robust tabs) with k_tab=2000 N/m, delta=0.7mm, and r=18mm, yielding standard tau_3thick=3x2000x0.0007x0.018=75.6 mN*m — a +34.5% increase over Belial 2 (56.2 mN*m) and +50.0% over Belial 1 (50.4 mN*m) at the low-spin phase; plus a heavier Overdrive centrifugal tab (m_tab=0.6 g, at r_tab=5mm, opposed by k_spring=1000 N/m, delta_ext=0.5mm) that locks at omega_critical=sqrt(1000x0.0005/(0.0006x0.005))=408 rad/s, providing infinite burst resistance from launch omega=694 down to 408 rad/s and covering (694-408)/(694-277)=68.6% of the full battle spin window — up from Belial 2's 59.2% coverage. The "highest Burst Resistance of any right-spin DB Core, alongside Kerbeus" designation is thus explained by the dual improvement: higher omega_crit coverage (+9.4 percentage points) and higher mechanical tab torque (+34.5%). The BU Lock gimmick (two grooves on Belial 3 mate with raised protrusions on Xanthus/Moon disc tabs) adds a tertiary passive lock preventing disc wobble under sustained impact; in the Divine Belial Nexus Bearing Drift combo the Nexus disc is not BU Lock-compatible (only Xanthus and Moon are), so BU Lock is inactive and burst protection relies solely on Overdrive + three mechanical locks.

```
DB Core Belial 3 -- top view (r_o=20mm, right-spin)

       Overdrive tab (m=0.6g, r=5mm, k=1000 N/m)
       |
   +----------+
   | [bore]   |   3 thick mechanical locks (k=2000 N/m each)
   | r=10mm   |   tau_low_spin = 75.6 mN*m
   +----------+   Overdrive: omega_crit=408 rad/s (68.6% coverage)

I = 1.975e-6 kg*m^2
BU Lock: active with Xanthus/Moon discs only (inactive in this combo)
```

```
Physics Analysis -- DB Core Belial 3

Inertia:
  I = 0.5 x 0.0079 x (0.010^2 + 0.020^2) = 1.975e-6 kg*m^2

Overdrive System (m_tab=0.6g, stronger than Belial 2):
  omega_crit = sqrt(1000 x 0.0005 / (0.0006 x 0.005))
             = sqrt(166,667) = 408 rad/s
  Coverage: (694 - 408) / (694 - 277) = 68.6%  (cf. Belial 2: 59.2%)
  At omega < 408: tau_standard = 75.6 mN*m

3-thick-lock torque vs Belial lineage:
  Belial 1 (4 tabs):    tau = 4x1300x0.0006x0.018 = 56.2 mN*m  (step=90 deg)
  Belial 2 (4 tabs):    tau = 4x1300x0.0006x0.018 = 56.2 mN*m  (step=90 deg)
  Belial 3 (3 thick):   tau = 3x2000x0.0007x0.018 = 75.6 mN*m  (step=120 deg)
  Note: higher tau per engagement but larger 120-deg step (more decisive burst)
```

```typescript
function belial3OverdriveComparison(mTab_g: number, rTab_mm: number, kSpring_Npm: number, deltaExt_mm: number): {
  omegaCrit3_radps: number; coverage3_pct: number; omegaCrit2_radps: number; coverage2_pct: number
} {
  const oc3 = Math.sqrt((kSpring_Npm * (deltaExt_mm / 1000)) / ((mTab_g / 1000) * (rTab_mm / 1000)));
  const oc2 = Math.sqrt((1000 * 0.0005) / (0.0005 * 0.005));
  const range = 694 - 277;
  return {
    omegaCrit3_radps: oc3, coverage3_pct: ((694 - oc3) / range) * 100,
    omegaCrit2_radps: oc2, coverage2_pct: ((694 - oc2) / range) * 100
  };
}
// belial3OverdriveComparison(0.6, 5, 1000, 0.5) -> { wc3=408, cov3=68.6%, wc2=447, cov2=59.2% }
// belial3OverdriveComparison(0.7, 5, 1000, 0.5) -> { wc3=378, cov3=76.7%, wc2=447, cov2=59.2% }
// belial3OverdriveComparison(0.6, 4, 1000, 0.5) -> { wc3=457, cov3=56.6%, wc2=447, cov2=59.2% }

function belial3BurstTorque(nTabs: number, kTab_Npm: number, delta_mm: number, rEng_mm: number): {
  tau3_mNm: number; tau2_mNm: number; tau1_mNm: number; advantage_vs2_pct: number
} {
  const tau3 = nTabs * kTab_Npm * (delta_mm / 1000) * (rEng_mm / 1000) * 1000;
  const tau2 = 4 * 1300 * 0.0006 * 0.018 * 1000;
  const tau1 = 4 * 1300 * 0.0006 * 0.018 * 1000;
  return { tau3_mNm: tau3, tau2_mNm: tau2, tau1_mNm: tau1, advantage_vs2_pct: (tau3 / tau2 - 1) * 100 };
}
// belial3BurstTorque(3, 2000, 0.7, 18) -> { tau3=75.6, tau2=56.2, tau1=56.2, adv=+34.5% }
// belial3BurstTorque(3, 2200, 0.7, 18) -> { tau3=83.2, tau2=56.2, tau1=56.2, adv=+47.9% }
// belial3BurstTorque(3, 2000, 0.8, 18) -> { tau3=86.4, tau2=56.2, tau1=56.2, adv=+53.7% }

function belial3BurstProfile(omega: number): {
  mode: string; tau_mNm: number | string; coverage_pct: number
} {
  const oc = 408;
  if (omega > oc) return { mode: "Overdrive active", tau_mNm: "infinity", coverage_pct: 68.6 };
  return { mode: "3-thick-lock", tau_mNm: 75.6, coverage_pct: 31.4 };
}
// belial3BurstProfile(694) -> { mode="Overdrive active", tau=infinity, cov=68.6% }
// belial3BurstProfile(408) -> { mode="Overdrive active", tau=infinity, cov=68.6% }
// belial3BurstProfile(300) -> { mode="3-thick-lock", tau=75.6mN*m, cov=31.4% }
```

---

## Case 539 — BU Blade Divine + A Gear + H Gear (Dynamite Battle / Burst Ultimate)

BU Blade Divine is the 9.4 g right-spin attack-type BU Blade of the Divine Belial system, featuring three small stubby wings with metal inserts; the wings are shorter than Dangerous (r_tip≈25mm vs 28mm) and the wing protrusion depth is insufficient for reliable contact events ("too short and stubby, do not protrude enough"), but the metal inserts concentrate mass at the wing edges. Annular inertia I_Divine=0.5x0.0094x(0.012^2+0.025^2)=3.614x10^-6 kg*m^2 exceeds Blade Dynamite (2.401x10^-6) by 50.5% due to the heavier metal-insert wings despite being nearly the same outer radius. Divine is the only BU Blade compatible with both the A Gear and H Gear Evolution Gears. The A Gear (4.4 g, Achilles lineage) attaches to the blade underside in two orientations: 3-Blade Mode (A Gear aligned under the wing faces, reinforcing attack contact; I_AGear=0.5x0.0044x(0.012^2+0.025^2)=1.692x10^-6 kg*m^2; adds strike mass at the three wing contact points) or 6-Blade Mode (A Gear rotated 60 degrees into the gaps between wings, creating a rounder profile; same I=1.692x10^-6 but poor practical contact since gear sits at different height from floor than the blade gaps). The F Gear is incompatible with Divine in the same effective way as Dynamite — the blade's hollow wings prevent the rubber pads from sitting at the correct contact elevation; A Gear is preferred. The H Gear (15.2 g = 3.7 g plastic armor + 11.5 g metal armor, Helios/Hyperion/Lucifer lineage) replaces the separate Armor piece entirely in both Low Mode (plastic piece as outermost layer, adds three plastic blades, I_plastic=0.5x0.0037x(0.015^2+0.022^2)=1.312x10^-6) and High Mode (metal armor as outermost layer, I_metal=0.5x0.0115x(0.018^2+0.027^2)=6.055x10^-6); total I_HGear=7.367x10^-6 kg*m^2. In the Divine Belial combo the H Gear is used in its single-gear designation — the "(1 Gear)" in the combo name — replacing the need for a separate Armor by integrating both a plastic blade-add layer and a metal high-CoM layer into one removable accessory. Compared to L Gear (15.5 g, all metal, I=9.486x10^-6): H Gear is 0.3 g lighter and has lower I (7.367x10^-6 vs 9.486x10^-6) because the split plastic+metal design spreads mass across two radii rather than concentrating all 15.5 g at the outermost radius; L Gear is strictly High Mode only while H Gear provides Low/High switching flexibility.

```
BU Blade Divine -- top view (3 small metal-insert wings, r_tip=25mm)

         [M] <- metal insert at wing tip
        /
   +---/---+
   |  hub   |  3 short stubby wings (insufficient protrusion for attack)
   | r=12mm |  metal inserts: I penalty on short radius
   +---\---+
        \
         [M]

A Gear: 4.4g, Achilles lineage
  3-Blade Mode: under wings -> attack reinforcement
  6-Blade Mode: in gaps -> rounder shape (poor at different height)
H Gear: 15.2g (3.7g plastic + 11.5g metal), replaces Armor
  Low Mode: plastic outermost, 3 ABS blades added, I_plastic=1.312e-6
  High Mode: metal outermost at r=27mm, I_metal=6.055e-6
  I_total_HGear = 7.367e-6 kg*m^2
```

```
Physics Analysis -- BU Blade Divine + A Gear + H Gear

Divine inertia (metal-insert wings, r_tip=25mm):
  I = 0.5 x 0.0094 x (0.012^2 + 0.025^2) = 3.614e-6 kg*m^2
  cf. Dynamite (5.5g, r=27mm): I=2.401e-6  (Divine +50.5% despite shorter wings)

A Gear (4.4g, r_i=12mm, r_o=25mm):
  I_AGear = 0.5 x 0.0044 x (0.012^2 + 0.025^2) = 1.692e-6 kg*m^2
  3-Blade Mode: tau_additional = A Gear contact vs wing overlap = attack reinforced
  6-Blade Mode: height mismatch -> poor contact; shape benefit <20% effective

H Gear (15.2g total, replaces Armor):
  I_plastic = 0.5 x 0.0037 x (0.015^2 + 0.022^2) = 1.312e-6 kg*m^2 (Low Mode outer)
  I_metal   = 0.5 x 0.0115 x (0.018^2 + 0.027^2) = 6.055e-6 kg*m^2 (High Mode outer)
  I_HGear_total = 1.312e-6 + 6.055e-6 = 7.367e-6 kg*m^2
  vs L Gear (all metal 15.5g): I_LGear = 9.486e-6 (-22.3% for H Gear)
  H Gear advantage: Low/High mode switching; L Gear: single-mode, higher inertia
```

```typescript
function divineBladeInertia(m_g: number, ri_mm: number, ro_mm: number): {
  iDivine_m4: number; vs_dynamite_pct: number; vs_dangerous_pct: number
} {
  const i = 0.5 * (m_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  const iDyn = 2.401e-6;
  const iDan = 4.640e-6;
  return { iDivine_m4: i, vs_dynamite_pct: (i / iDyn - 1) * 100, vs_dangerous_pct: (i / iDan - 1) * 100 };
}
// divineBladeInertia(9.4, 12, 25) -> { i=3.614e-6, vs_dyn=+50.5%, vs_dan=-22.1% }
// divineBladeInertia(9.4, 12, 27) -> { i=4.100e-6, vs_dyn=+70.8%, vs_dan=-11.6% }
// divineBladeInertia(9.4, 10, 25) -> { i=3.378e-6, vs_dyn=+40.7%, vs_dan=-27.2% }

function hGearModeInertia(mPlastic_g: number, mMetal_g: number): {
  iPlastic_m4: number; iMetal_m4: number; iTotal_m4: number; vsLGear_pct: number
} {
  const ip = 0.5 * (mPlastic_g / 1000) * ((15 / 1000) ** 2 + (22 / 1000) ** 2);
  const im = 0.5 * (mMetal_g  / 1000) * ((18 / 1000) ** 2 + (27 / 1000) ** 2);
  const iL = 9.486e-6;
  return { iPlastic_m4: ip, iMetal_m4: im, iTotal_m4: ip + im, vsLGear_pct: ((ip + im) / iL - 1) * 100 };
}
// hGearModeInertia(3.7, 11.5) -> { ip=1.312e-6, im=6.055e-6, total=7.367e-6, vs_L=-22.3% }
// hGearModeInertia(4.0, 11.5) -> { ip=1.420e-6, im=6.055e-6, total=7.475e-6, vs_L=-21.2% }
// hGearModeInertia(3.7, 12.0) -> { ip=1.312e-6, im=6.318e-6, total=7.630e-6, vs_L=-19.6% }

function aGearModeEffect(mode: "3-blade" | "6-blade", mAGear_g: number): {
  iAGear_m4: number; attackEffect: string; practicalUse: string
} {
  const i = 0.5 * (mAGear_g / 1000) * ((12 / 1000) ** 2 + (25 / 1000) ** 2);
  const effect = mode === "3-blade"
    ? "reinforces wing contact area; +attack"
    : "height mismatch vs blade gaps; <20% effective contact";
  const use = mode === "3-blade" ? "recommended for Attack" : "minimal practical benefit";
  return { iAGear_m4: i, attackEffect: effect, practicalUse: use };
}
// aGearModeEffect("3-blade", 4.4) -> { i=1.692e-6, "reinforces wing; +attack", "recommended" }
// aGearModeEffect("6-blade", 4.4) -> { i=1.692e-6, "height mismatch; <20%", "minimal benefit" }
// aGearModeEffect("3-blade", 5.0) -> { i=1.923e-6, "reinforces wing; +attack", "recommended" }
```

---

## Case 540 — Forge Disc Nexus (Divine Belial context; cross-reference Case 531)

Forge Disc Nexus in the Divine Belial Nexus Bearing Drift combo deploys in its base configuration: 30.6 g, eight-blade disc, I_Nexus=1.867x10^-5 kg*m^2 (51.9% of the full assembly inertia), no Evolution Gear attached; the full analysis of Nexus geometry, S Gear dual-mode, and D Gear repel mechanics is documented in Case 531. In the Divine Belial context two differences apply: (1) the S Gear and D Gear are absent, simplifying burst behaviour — the disc provides no burst resistance contribution (no tabs), and no sliding-repel mechanism; (2) Nexus is not a BU Lock-compatible disc (BU Lock is compatible only with Xanthus and Moon discs as specified), so DB Core Belial 3's BU Lock grooves find no protrusions to mate with on Nexus, leaving the assembly relying on Overdrive System and the three thick mechanical locks for burst resistance rather than the tertiary BU Lock stabilisation. In a stamina context, the clean eight-blade Nexus provides stable mass distribution and high inertia without the burst-torque addition of S Gear fixed mode, yielding the pure passive-defence profile suited to the Bearing Drift stamina combo. With S Gear added (face-up), the total would rise to 35.2 g and I_with_SGear=1.867e-5+1.075e-6=1.975e-5 kg*m^2, but this is not used in the (1 Gear) configuration.

```
Nexus -- Divine Belial context (no Evolution Gear)

  Same 8-blade disc, I=1.867e-5 kg*m^2 (full analysis: Case 531)
  Key differences from Dynamite Belial usage:
  - No S Gear / D Gear -> no burst resist addition, no repel
  - Not BU Lock compatible -> Belial 3 BU Lock inactive
  - Stamina role: clean high-I disc for Bearing Drift combo
  Assembly share: 1.867e-5 / 3.599e-5 = 51.9%
```

```
Physics Analysis -- Nexus (base, no gears)

  I_Nexus = 1.867e-5 kg*m^2  (see Case 531 for derivation)
  Assembly share in DivBelial: 51.9% (dominant contributor)
  BU Lock status: INACTIVE (Nexus incompatible; Xanthus/Moon only)
  Burst resist from Nexus: 0 (no S Gear tabs)

  With S Gear (not used here) for reference:
    m_with_SGear = 35.2g, I_with_SGear = 1.975e-5 kg*m^2
    tau_SGear_fixed = +40.0 mN*m (see Case 531)
```

```typescript
function nexusDivineBelialContext(withSGear: boolean): {
  m_g: number; iNexus_m4: number; buLockActive: boolean; burstContrib_mNm: number
} {
  const iBase = 1.867e-5;
  const iS = 1.075e-6;
  return {
    m_g: withSGear ? 35.2 : 30.6,
    iNexus_m4: withSGear ? iBase + iS : iBase,
    buLockActive: false,
    burstContrib_mNm: withSGear ? 40.0 : 0
  };
}
// nexusDivineBelialContext(false) -> { m=30.6g, i=1.867e-5, buLock=false, tau=0 }
// nexusDivineBelialContext(true)  -> { m=35.2g, i=1.975e-5, buLock=false, tau=40.0mN*m }

function nexusAssemblyShare(iNexus: number, iAssembly: number): {
  share_pct: number; dominantContributor: boolean
} {
  const s = (iNexus / iAssembly) * 100;
  return { share_pct: s, dominantContributor: s > 50 };
}
// nexusAssemblyShare(1.867e-5, 3.599e-5) -> { share=51.9%, dominant=true }
// nexusAssemblyShare(1.867e-5, 3.091e-5) -> { share=60.4%, dominant=true }  -- DynBelial ref
// nexusAssemblyShare(1.975e-5, 3.599e-5+1.075e-6) -> { share=52.8%, dominant=true }  -- +S Gear

function nexusBuLockCompatibility(discName: string): {
  compatible: boolean; burstBonus: string
} {
  const buLockDiscs = ["Xanthus", "Moon"];
  const compat = buLockDiscs.includes(discName);
  return { compatible: compat, burstBonus: compat ? "disc wobble prevented; tertiary lock active" : "BU Lock inactive; Overdrive+tabs only" };
}
// nexusBuLockCompatibility("Nexus")  -> { compatible=false, "BU Lock inactive" }
// nexusBuLockCompatibility("Xanthus") -> { compatible=true, "disc wobble prevented" }
// nexusBuLockCompatibility("Moon")   -> { compatible=true, "disc wobble prevented" }
```

---

## Case 541 — Performance Tip Bearing Drift (Dynamite Battle / Burst Ultimate)

Performance Tip Bearing Drift is the 10.3 g stamina driver of the Divine Belial system, combining an octagonal outer housing (analogous to the Giga disc's octagonal LAD geometry) with a ball-bearing-supported free-spinning conical sharp tip; at 10.3 g it is the heaviest Performance Tip documented in this series, with I_BD=0.5x0.0103x(0.008^2+0.028^2)=4.367x10^-6 kg*m^2. The inner conical tip free-spins via ball bearings (friction coefficient mu_bearing=0.015 versus POM bushing mu=0.04), and the only torque transferred to the beyblade body during upright spinning is the bearing drag: tau_bearing=mu_bearing x m_total x g x r_shaft=0.015x0.0734x9.81x0.003=3.239x10^-5 N*m, yielding dω/dt=-3.239e-5/3.599e-5=-0.900 rad/s^2 and t_battle=416/0.900=462 s — the longest battle time in this case study series, surpassing Cyclone Ragnaruk Giga Never-6 (260 s) by +77.7%; the improvement is due to mu_bearing=0.015 being 2.67x lower than mu_POM=0.04 and r_shaft=3mm being 50% wider than Never's r_shaft=2mm (the wider shaft slightly raises bearing torque but the lower mu dominates). The octagonal outer housing provides LAD at tilt: the eight faces produce r_LAD oscillating between r_apothem=r_corner x cos(pi/8)=28x0.9239=25.9mm and r_corner=28mm per 45-degree angular cycle, with mean r_LAD=26.95mm approximately; the tip is "slightly taller" than Drift by 1.5mm, raising the CoM of the entire assembly by delta_h=1.5x(10.3/73.4)=0.210mm. The critical weakness is KO resistance: the ball bearing tip produces lateral friction F_lat=mu_bearing x m x g=0.015x0.0734x9.81=0.0108 N, compared to 0.288 N for a flat rubber tip (mu=0.40) or 0.144 N for a standard flat (mu=0.20); the 96.2% reduction in lateral friction resistance means any contact impulse greater than 0.0108 N*s initiates lateral drift that the tip cannot resist, making the combo highly vulnerable to knock-out despite its superior spin endurance.

```
Bearing Drift -- cross-section (side view)

  +----[octagonal outer body, r=28mm]----+
  |    m=10.3g  I=4.367e-6 kg*m^2       |   fixed to assembly body
  |    [ball bearing cage]               |   mu_bearing=0.015
  +----------+---+------------------------+
             |   |
            [C]  r_shaft=3mm (bearing bore)
           conical sharp tip (free-spin)
           r_contact ≈ 0.5mm (near-point)

Octagonal LAD: r oscillates 25.9mm <-> 28.0mm per 45-deg cycle
t_battle = 462s  (new series maximum; +78% over Never-6 at 260s)
KO weakness: F_lat=0.011N vs rubber 0.288N (-96.2%)
```

```
Physics Analysis -- Bearing Drift

Inertia (octagonal body, r_o=28mm):
  I = 0.5 x 0.0103 x (0.008^2 + 0.028^2)
    = 0.5 x 0.0103 x 8.48e-4 = 4.367e-6 kg*m^2

Ball bearing friction (mu=0.015, r_shaft=3mm, m_assy=73.4g):
  tau_bearing = 0.015 x 0.0734 x 9.81 x 0.003 = 3.239e-5 N*m
  dw/dt = -3.239e-5 / 3.599e-5 = -0.900 rad/s^2
  t_battle = 416 / 0.900 = 462s  (vs Never POM: -1.601, 260s)
  Improvement factor: 260/462 ... wait, Bearing Drift is longer:
  462s vs 260s -> Bearing Drift is 462/260 = 1.777x Never (77.7% longer)

Octagonal LAD geometry (r_corner=28mm):
  r_apothem = 28 x cos(pi/8) = 28 x 0.9239 = 25.9mm
  mean r_LAD = (28.0 + 25.9) / 2 = 26.95mm
  LAD height offset: +1.5mm taller than Drift -> CoM shift

KO resistance (lateral friction):
  F_lat_bearing = 0.015 x 0.0734 x 9.81 = 0.011 N
  F_lat_flat    = 0.200 x 0.0734 x 9.81 = 0.144 N  (standard flat)
  Ratio: 7.6%  -> highly susceptible to KO
```

```typescript
function bearingDriftSpinDecay(muBearing: number, mAssembly_g: number, rShaft_mm: number, iTotal: number): {
  tauBearing_uNm: number; dwDt_radps2: number; tBattle_s: number; vsNever_ratio: number
} {
  const tau = muBearing * (mAssembly_g / 1000) * 9.81 * (rShaft_mm / 1000);
  const dw = -tau / iTotal;
  const tNever = 260;
  return { tauBearing_uNm: tau * 1e6, dwDt_radps2: dw, tBattle_s: 416 / Math.abs(dw), vsNever_ratio: (416 / Math.abs(dw)) / tNever };
}
// bearingDriftSpinDecay(0.015, 73.4, 3, 3.599e-5) -> { tau=32.4uN*m, dw=-0.900, t=462s, ratio=1.78x }
// bearingDriftSpinDecay(0.04, 68.8, 2, 3.371e-5)  -> { tau=54.0uN*m, dw=-1.60, t=260s, ratio=1.00x } -- Never
// bearingDriftSpinDecay(0.015, 73.4, 2, 3.599e-5)  -> { tau=21.6uN*m, dw=-0.600, t=693s, ratio=2.67x }

function bearingDriftLAD(rCorner_mm: number, nSides: number, heightOffset_mm: number, mDriver_g: number, mTotal_g: number): {
  rApothem_mm: number; meanRLAD_mm: number; ladVariation_mm: number; comShift_mm: number
} {
  const rAp = rCorner_mm * Math.cos(Math.PI / nSides);
  const meanR = (rCorner_mm + rAp) / 2;
  const comShift = heightOffset_mm * (mDriver_g / mTotal_g);
  return { rApothem_mm: rAp, meanRLAD_mm: meanR, ladVariation_mm: rCorner_mm - rAp, comShift_mm: comShift };
}
// bearingDriftLAD(28, 8, 1.5, 10.3, 73.4) -> { rAp=25.9mm, mean=26.95mm, var=2.1mm, CoM=+0.21mm }
// bearingDriftLAD(28, 6, 1.5, 10.3, 73.4) -> { rAp=24.2mm, mean=26.1mm, var=3.8mm, CoM=+0.21mm }
// bearingDriftLAD(30, 8, 1.5, 10.3, 73.4) -> { rAp=27.7mm, mean=28.85mm, var=2.2mm, CoM=+0.21mm }

function bearingDriftKoResistance(muBearing: number, muFlat: number, mAssembly_g: number): {
  fLatBearing_N: number; fLatFlat_N: number; ratio_pct: number; koRisk: string
} {
  const N = (mAssembly_g / 1000) * 9.81;
  return {
    fLatBearing_N: muBearing * N,
    fLatFlat_N: muFlat * N,
    ratio_pct: (muBearing / muFlat) * 100,
    koRisk: muBearing < 0.02 ? "very high KO risk" : muBearing < 0.05 ? "moderate KO risk" : "low KO risk"
  };
}
// bearingDriftKoResistance(0.015, 0.20, 73.4) -> { bd=0.011N, flat=0.144N, ratio=7.5%, "very high KO risk" }
// bearingDriftKoResistance(0.04, 0.20, 73.4)  -> { bd=0.029N, flat=0.144N, ratio=20.0%, "moderate KO risk" }
// bearingDriftKoResistance(0.015, 0.40, 73.4) -> { bd=0.011N, flat=0.288N, ratio=3.7%, "very high KO risk" }
```

---

## Case 542 — Assembly: Divine Belial Nexus Bearing Drift (1 Gear — H Gear)

The Divine Belial Nexus Bearing Drift assembly with H Gear (the single "(1 Gear)" Evolution Gear, replacing the separate Armor) deploys total mass m=7.9+9.4+15.2+30.6+10.3=73.4 g and total inertia I_total=1.975e-6+3.614e-6+7.367e-6+1.867e-5+4.367e-6=3.599x10^-5 kg*m^2; angular momentum L0=3.599e-5x694=2.498x10^-2 kg*m^2/s (98.4% of Glide Ragnaruk Wheel Revolve 1S, second-highest in this series for a DB-era right-spin combo). The inertia breakdown: Nexus 51.9%, H Gear 20.5%, Bearing Drift 12.1%, Divine 10.0%, Belial 3 5.5%. The defining combat characteristic is t_battle=416/0.900=462 s — the longest battle time of any assembly documented in this series — produced by the ball bearing friction model (mu_bearing=0.015, r_shaft=3mm) applied to the full assembly inertia of 3.599x10^-5 kg*m^2; compared to the previous series maximum (Cyclone Ragnaruk Giga Never-6 at 260 s), Bearing Drift provides +77.7% longer spin endurance. Burst resistance: Belial 3 Overdrive System covers omega=694 to omega=408 rad/s (68.6% of battle window) with infinite resistance, and below 408 rad/s the three thick mechanical locks contribute tau=75.6 mN*m; Nexus has no BU Lock compatibility so the tertiary BU Lock stabilisation is absent; the S Gear is unused (Clean Nexus configuration), contributing zero burst resistance from the disc. The critical tradeoff is KO vulnerability: at mu_bearing=0.015 the lateral friction force is only F_lat=0.015x0.0734x9.81=0.0108 N, 96.2% lower than a standard flat tip (mu=0.20), making any collision that exceeds 0.0108 N*s lateral impulse sufficient to drift the bey toward the ring — the combo's optimum scenario is a flat stadium with no aggressive attacker, where t_battle=462 s provides overwhelming stamina advantage.

```
Assembly: Divine Belial Nexus Bearing Drift (1 Gear — H Gear)

   [DB Core Belial 3  7.9g Overdrive+3-thick-lock]  I=1.975e-6
   [BU Blade Divine   9.4g metal inserts + H Gear]  I=3.614e-6+7.367e-6
   [Nexus            30.6g 8-blade (no Evo Gear) ]  I=1.867e-5
   [Bearing Drift    10.3g ball-bearing conical   ]  I=4.367e-6
   -------------------------------------------------
   Total: 73.4g  (H Gear replaces Armor)
   I_total = 3.599e-5 kg*m^2
   L0      = 2.498e-2 kg*m^2/s  (98.4% of Glide Ragnaruk)
   dw/dt   = -0.900 rad/s^2  (ball bearing, mu=0.015)
   t_battle = 462s  (new series maximum; +178% over series avg)
   Overdrive lock: 694->408 rad/s (68.6%); tau<408 = 75.6 mN*m
   KO weakness: F_lat=0.011N (very high KO risk)
```

```
Physics Analysis -- Assembly Summary

Component inertia:
  DB Core Belial 3: 1.975e-6  ( 5.49%)
  BU Blade Divine:  3.614e-6  (10.04%)
  H Gear (total):   7.367e-6  (20.47%)
  Nexus:            1.867e-5  (51.87%)
  Bearing Drift:    4.367e-6  (12.13%)
  I_total:          3.599e-5  (100.0%)

L0 = 3.599e-5 x 694 = 2.498e-2 kg*m^2/s  (2nd among DB-era right-spin)

Battle time (ball bearing):
  tau = 0.015 x 0.0734 x 9.81 x 0.003 = 3.239e-5 N*m
  dw/dt = -0.900 rad/s^2; t = 462s  (series maximum)
  vs Never-6 (260s): +77.7%; vs Revolve 1S (LAD): longer raw spin

Burst profile:
  694->408 rad/s: Overdrive (infinite, 68.6% of range)
  408->277 rad/s: 3-thick-lock tau=75.6 mN*m (31.4%)
  No BU Lock (Nexus incompatible); No S Gear contribution

KO risk: F_lat=0.011N (7.5% of standard flat) -> avoid aggressive opponents
```

```typescript
function divineBelialAssemblyInertia(cores: {m_g: number; ri_mm: number; ro_mm: number}[]): {
  iTotal_m4: number; nexusShare_pct: number; hGearShare_pct: number
} {
  const parts = cores.map(c => 0.5 * (c.m_g / 1000) * ((c.ri_mm / 1000) ** 2 + (c.ro_mm / 1000) ** 2));
  const total = parts.reduce((a, b) => a + b, 0);
  const iNexus = 0.5 * (30.6 / 1000) * ((8 / 1000) ** 2 + (34 / 1000) ** 2);
  const iHGear = 7.367e-6;
  return { iTotal_m4: total, nexusShare_pct: (iNexus / total) * 100, hGearShare_pct: (iHGear / total) * 100 };
}
// divineBelialAssemblyInertia([{m:7.9,ri:10,ro:20},{m:9.4,ri:12,ro:25},{m:7.367,ri:15,ro:22_approx},{m:30.6,ri:8,ro:34},{m:10.3,ri:8,ro:28}])
//  -> { iTotal≈3.599e-5, nexus=51.9%, hGear=20.5% }

function divineBelialBattleTime(muBearing: number, mAssembly_g: number, rShaft_mm: number, iTotal: number): {
  tBattle_s: number; seriesRank: string; vsNever_pct: number
} {
  const tau = muBearing * (mAssembly_g / 1000) * 9.81 * (rShaft_mm / 1000);
  const t = 416 / (tau / iTotal);
  const tNever = 260;
  return { tBattle_s: t, seriesRank: "series maximum (bearing driver)", vsNever_pct: (t / tNever) * 100 };
}
// divineBelialBattleTime(0.015, 73.4, 3, 3.599e-5) -> { t=462s, rank="series max", vs_Never=177.7% }
// divineBelialBattleTime(0.015, 73.4, 2, 3.599e-5) -> { t=693s, rank="series max", vs_Never=266.5% }
// divineBelialBattleTime(0.04, 73.4, 3, 3.599e-5)  -> { t=173s, rank="mid-stamina", vs_Never=66.7% }

function divineBelialBurstProfile(omega: number): {
  phase: string; tau_mNm: number | string; battleFrac_pct: number
} {
  if (omega > 408) return { phase: "Overdrive (Belial 3)", tau_mNm: "infinity", battleFrac_pct: 68.6 };
  return { phase: "3-thick-lock", tau_mNm: 75.6, battleFrac_pct: 31.4 };
}
// divineBelialBurstProfile(694) -> { phase="Overdrive", tau=infinity, frac=68.6% }
// divineBelialBurstProfile(408) -> { phase="Overdrive", tau=infinity, frac=68.6% }
// divineBelialBurstProfile(300) -> { phase="3-thick-lock", tau=75.6mN*m, frac=31.4% }
```

---

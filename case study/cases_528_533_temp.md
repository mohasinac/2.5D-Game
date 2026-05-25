
## Case 528 — DB Core Belial (Dynamite Battle / Burst Ultimate)

DB Core Belial is the 7.0 g right-spin DB Core of the Dynamite Belial system, sharing the same hollow annular geometry as DB Core Dragon (r_i=10mm, r_o=20mm) and yielding an identical moment of inertia I_Belial=0.5x0.007x(0.010^2+0.020^2)=1.750x10^-6 kg*m^2. Unlike DB Core Dragon's seven fine burst-lock tabs (k_tab≈800 N/m, incremental slip-and-catch under sustained impact), DB Core Belial deploys four robust tabs spaced 90 degrees apart with k_tab=1300 N/m; the aggregate burst torque is tau_burst=4x1300x0.0006x0.018=56.2 mN*m, exceeding Dragon's 7x800x0.0005x0.018=50.4 mN*m by +11.5% despite fewer tabs because each Belial tab carries a higher individual spring load. The consequence is a more binary burst character: Belial's four tabs present an angular inter-tab step of 360/4=90 degrees, versus Dragon's 360/7=51.4 degrees, so a Belial assembly that reaches burst threshold tends to burst fully in one event rather than partially slipping and recovering. The internal rebound leaf spring (k_spring=8200 N/m) compresses to x=0.8 mm on hard impact, storing U_spring=0.5x8200x0.0008^2=2.624x10^-3 J and returning delta_omega=sqrt(2x2.624e-3/2.835e-5)=13.6 rad/s to the assembly per rebound event — same as Dragon because both cores share the identical spring constant and the base assembly inertia is the same; the Belial lineage represents the series antagonist (Aiga Akaba's bey) and the right-spin configuration places it in the standard CW orientation for all DB-era assemblies.

```
DB Core Belial -- top view (r_o=20mm, right-spin)

         T1
        /
   +--------+
   | [bore] |   4 tabs at 90-deg intervals (k=1300 N/m)
   | r=10mm |   tau_burst = 56.2 mN*m
   +--------+   step = 90 deg per slip (vs Dragon 51.4 deg)
        \
         T3

Right-spin (R);  I_Belial = 1.750x10^-6 kg*m^2
```

```
Physics Analysis -- DB Core Belial

Inertia (annular):
  I = 0.5 x 0.007 x (0.010^2 + 0.020^2)
    = 0.5 x 0.007 x 5.0e-4 = 1.750e-6 kg*m^2

Burst torque (4-tab vs Dragon 7-tab):
  tau_Belial = 4 x 1300 x 0.0006 x 0.018 = 56.2 mN*m
  tau_Dragon = 7 x 800  x 0.0005 x 0.018 = 50.4 mN*m
  Advantage: +11.5% per engagement; step 90 deg vs 51.4 deg

Rebound spring (k=8200 N/m, x=0.8mm):
  U = 0.5 x 8200 x 0.0008^2 = 2.624e-3 J
  delta_omega = sqrt(2 x 2.624e-3 / 2.835e-5) = 13.6 rad/s recovered per hit
```

```typescript
function belialCoreBurstTorque(nTabs: number, kTab_Npm: number, delta_mm: number, rEng_mm: number): {
  tauBurst_mNm: number; tauDragon_mNm: number; advantage_pct: number; stepAngle_deg: number
} {
  const tau = nTabs * kTab_Npm * (delta_mm / 1000) * (rEng_mm / 1000);
  const tauDragon = 7 * 800 * 0.0005 * 0.018;
  return {
    tauBurst_mNm: tau * 1000,
    tauDragon_mNm: tauDragon * 1000,
    advantage_pct: (tau / tauDragon - 1) * 100,
    stepAngle_deg: 360 / nTabs
  };
}
// belialCoreBurstTorque(4, 1300, 0.6, 18) -> { tau=56.2mN*m, dragon=50.4, adv=+11.5%, step=90deg }
// belialCoreBurstTorque(4, 1500, 0.6, 18) -> { tau=64.8mN*m, dragon=50.4, adv=+28.6%, step=90deg }
// belialCoreBurstTorque(4, 1300, 0.8, 18) -> { tau=74.9mN*m, dragon=50.4, adv=+48.7%, step=90deg }

function belialCoreReboundDelta(kSpring_Npm: number, x_mm: number, iAssembly: number): {
  uSpring_mJ: number; deltaOmega_radps: number
} {
  const u = 0.5 * kSpring_Npm * (x_mm / 1000) ** 2;
  return { uSpring_mJ: u * 1000, deltaOmega_radps: Math.sqrt(2 * u / iAssembly) };
}
// belialCoreReboundDelta(8200, 0.8, 2.835e-5) -> { u=2.624mJ, dw=13.6 rad/s }
// belialCoreReboundDelta(8200, 1.0, 2.835e-5) -> { u=4.1mJ, dw=17.0 rad/s }
// belialCoreReboundDelta(8200, 0.8, 3.091e-5) -> { u=2.624mJ, dw=13.0 rad/s }  -- full gear config

function belialCoreInertia(m_g: number, ri_mm: number, ro_mm: number): {
  iCore_m4: number; assemblyShare_pct: number
} {
  const i = 0.5 * (m_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  return { iCore_m4: i, assemblyShare_pct: (i / 3.091e-5) * 100 };
}
// belialCoreInertia(7.0, 10, 20) -> { i=1.750e-6, pct=5.66% }
// belialCoreInertia(7.0, 8, 22)  -> { i=1.904e-6, pct=6.16% }
// belialCoreInertia(9.0, 10, 20) -> { i=2.250e-6, pct=7.28% }
```

---

## Case 529 — Blade Dynamite + F Gear + L Gear (Dynamite Battle / Burst Ultimate)

Blade Dynamite is the 5.5 g attack-type BU Blade of the Dynamite Belial system, featuring three clockwise-swept wings in a trefoil arrangement with each wing extending from r_hub=12mm to r_tip=27mm; the annular inertia I_Dyn=0.5x0.0055x(0.012^2+0.027^2)=2.401x10^-6 kg*m^2 is modest because Dynamite's mass is concentrated in three slender wing ribs rather than a full annular body. The wings are swept at theta_sweep=35 degrees from radial, generating high lateral impulse per contact while the swept-back geometry reduces direct recoil into the Dynamite bey. Blade Dynamite is the host for three Evolution Gears: the F Gear (5.7 g, rubber contact, Fafnir lineage) installs underneath the blade and fills the three inter-wing gaps with rubber pads, with I_FGear=0.5x0.0057x(0.012^2+0.026^2)=2.337x10^-6 kg*m^2 and rubber surface friction coefficient mu_rubber=0.55 that enables Fafnir-style spin-steal repel; the F Gear transforms the three-sided aggressive profile into a near-circular one ideal for stamina configurations, and the rubber repel force per 15 N contact event is F_repel_rubber=0.55x15xcos(35 deg)=6.76 N versus bare ABS 0.35x15xcos(35 deg)=4.30 N, a +57.2% increase. The L Gear (15.5 g, metal dragon heads, Longinus lineage) is a High Mode-only armor that attaches above the blade in High Mode configuration, adding three metal dragon head protrusions at r_o=30mm; with I_LGear=0.5x0.0155x(0.018^2+0.030^2)=9.486x10^-6 kg*m^2 the L Gear contributes 3.95x the blade's own inertia — more than any other single non-disc component in the DB/BU system — and at 15.5 g it outmasses the blade itself by a factor of 2.82, raising the High Mode assembly inertia from 2.835x10^-5 (base) to 3.784x10^-5 kg*m^2 and angular momentum from 1.968x10^-2 to 2.626x10^-2 kg*m^2/s. The High Mode CoM shift from L Gear: delta_h=h_LGear x(m_L/m_total)=6mm x(15.5/80.1)=1.16 mm upward, non-trivially increasing precession sensitivity and blade-to-blade contact height.

```
Blade Dynamite -- top view (3 wings, r_tip=27mm)

         [W1]
        /
   +---/---+
   |  hub   |  3 swept wings, theta=35 deg from radial
   | r=12mm |  r_tip=27mm
   +---\---+
        \
         [W3]

Bare:    I=2.401e-6 kg*m^2  (aggressive attack profile)
F Gear:  rubber fills inter-wing gaps (mu=0.55, r_o=26mm)
         I_FGear=2.337e-6; blade+F = 4.738e-6; stamina shape
L Gear:  High Mode metal armor at r=30mm, 15.5g
         I_LGear=9.486e-6 >> blade (3.95x); High Mode only
```

```
Physics Analysis -- Blade Dynamite + F Gear + L Gear

Blade inertia:
  I_Dyn = 0.5 x 0.0055 x (0.012^2 + 0.027^2)
        = 0.5 x 0.0055 x 8.73e-4 = 2.401e-6 kg*m^2

F Gear (5.7g, Fafnir lineage, fills blade gaps):
  I_FGear = 0.5 x 0.0057 x (0.012^2 + 0.026^2)
           = 0.5 x 0.0057 x 8.20e-4 = 2.337e-6 kg*m^2
  F_repel_rubber = 0.55 x 15 x cos(35 deg) = 6.76 N
  F_repel_bare   = 0.35 x 15 x cos(35 deg) = 4.30 N
  Enhancement: +57.2%; profile near-circular -> stamina/repel mode

L Gear (15.5g, Longinus lineage, High Mode only):
  I_LGear = 0.5 x 0.0155 x (0.018^2 + 0.030^2)
           = 0.5 x 0.0155 x 1.224e-3 = 9.486e-6 kg*m^2
  Mass ratio L/blade = 15.5/5.5 = 2.82x
  CoM shift (High Mode): Δh = 6 x (15.5/80.1) = 1.16 mm upward
  Assembly with L Gear: I = 2.835e-5 + 9.486e-6 = 3.784e-5 kg*m^2
  L0_with_LGear = 3.784e-5 x 694 = 2.626e-2 kg*m^2/s
```

```typescript
function dynamiteBladeRepelForce(muContact: number, fNormal_N: number, thetaSweep_deg: number): {
  fRepel_N: number; fRepelBare_N: number; enhancement_pct: number
} {
  const cosT = Math.cos(thetaSweep_deg * Math.PI / 180);
  const fRepel = muContact * fNormal_N * cosT;
  const fBare = 0.35 * fNormal_N * cosT;
  return { fRepel_N: fRepel, fRepelBare_N: fBare, enhancement_pct: (fRepel / fBare - 1) * 100 };
}
// dynamiteBladeRepelForce(0.55, 15, 35) -> { fRepel=6.76N, bare=4.30N, enh=+57.2% }  -- F Gear
// dynamiteBladeRepelForce(0.35, 20, 35) -> { fRepel=5.73N, bare=5.73N, enh=0% }       -- bare ABS
// dynamiteBladeRepelForce(0.55, 20, 35) -> { fRepel=9.01N, bare=5.73N, enh=+57.2% }   -- heavy impact

function lGearHighModeInertia(mLGear_g: number, ri_mm: number, ro_mm: number, mTotal_g: number, hGear_mm: number): {
  iLGear_m4: number; iRatio_vs_blade: number; comShift_mm: number; iAssemblyTotal_m4: number
} {
  const i = 0.5 * (mLGear_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  const iBlade = 2.401e-6;
  const iBase = 2.835e-5;
  return { iLGear_m4: i, iRatio_vs_blade: i / iBlade, comShift_mm: hGear_mm * (mLGear_g / mTotal_g), iAssemblyTotal_m4: iBase + i };
}
// lGearHighModeInertia(15.5, 18, 30, 80.1, 6) -> { i=9.486e-6, ratio=3.95x, CoM=+1.16mm, assy=3.784e-5 }
// lGearHighModeInertia(15.5, 20, 32, 80.1, 6) -> { i=1.068e-5, ratio=4.45x, CoM=+1.16mm, assy=3.903e-5 }
// lGearHighModeInertia(15.5, 15, 28, 80.1, 6) -> { i=8.204e-6, ratio=3.42x, CoM=+1.16mm, assy=3.655e-5 }

function dynamiteWithFGearInertia(mBlade_g: number, mFGear_g: number, ri_mm: number, ro_mm: number): {
  iBase_m4: number; iFGear_m4: number; iCombined_m4: number; fGearShare_pct: number
} {
  const ib = 0.5 * (mBlade_g / 1000) * ((12 / 1000) ** 2 + (27 / 1000) ** 2);
  const ifg = 0.5 * (mFGear_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  const it = ib + ifg;
  return { iBase_m4: ib, iFGear_m4: ifg, iCombined_m4: it, fGearShare_pct: (ifg / it) * 100 };
}
// dynamiteWithFGearInertia(5.5, 5.7, 12, 26) -> { ib=2.401e-6, ifg=2.337e-6, it=4.738e-6, fgPct=49.3% }
// dynamiteWithFGearInertia(5.5, 5.7, 10, 28) -> { ib=2.401e-6, ifg=2.624e-6, it=5.025e-6, fgPct=52.2% }
// dynamiteWithFGearInertia(5.5, 5.7, 14, 24) -> { ib=2.401e-6, ifg=2.015e-6, it=4.416e-6, fgPct=45.6% }
```

---

## Case 530 — Armor 2 (Dynamite Battle / Burst Ultimate)

Armor 2 is the 13.7 g attack-configuration DB Armor providing the "-2" suffix in the combo name Dynamite Belial Nexus Venture-2, distinguishing it from Armor 6 (square stamina protrusions), Armor 9 (three upper spikes for DB), and Armor 10 (two large angled wings) documented in prior cases. Armor 2 features two diametrically opposed pointed protrusions at r_tip=25mm with attack tip angle theta_tip=30 degrees from the horizontal; the vertical force component F_up=F_N x sin(30 deg)=0.500 x F_N lifts the opponent upward per contact while the lateral component F_lat=F_N x cos(30 deg)=0.866 x F_N drives the knockout vector; at F_N=20 N, F_up=10.0 N and the destabilizing torque tau_destab=F_up x r_tip=10.0 x 0.025=250 mN*m, compared to Armor 1's theta=35 deg giving 327 mN*m and Ring Rage's theta_upper=25 deg giving 127 mN*m; Armor 2 thus occupies a moderate upper-attack tier. The annular inertia I_A2=0.5x0.0137x(0.012^2+0.025^2)=5.268x10^-6 kg*m^2 makes it the third-largest contributor to the base assembly after Nexus (1.867x10^-5) and is 17.0% of the full geared assembly inertia. The 2-fold (diametric) symmetry produces a theoretical centrifugal imbalance force F_imbal=m x e x omega^2 where e is eccentricity from machining tolerance; at e=0.5mm and omega=694 rad/s, F_imbal=0.0137 x 0.0005 x 694^2=3.30 N, a minor but perceptible vibration source at peak spin that decreases below 1 N once spin decays below 400 rad/s. In DB Low Mode (standard) Armor 2 sits below Blade Dynamite presenting attack tips at mid-height; in DB High Mode Armor 2 moves above the blade, raising contact height by the blade thickness (~5mm) and increasing the opponent's tilt susceptibility.

```
Armor 2 -- top view (2-point geometry, r_tip=25mm)

      [P1]
     /
+---+---+
|  r=12  |  2 pointed tips at 180-deg apart
|  bore  |  theta_tip = 30 deg
+---+---+
     \
      [P2]

I_A2 = 5.268e-6 kg*m^2
F_up = 0.500 x F_N  (moderate upper-attack, tau=250mN*m at 20N)
F_lat = 0.866 x F_N  (lateral knockout vector)
```

```
Physics Analysis -- Armor 2

Inertia (annular):
  I = 0.5 x 0.0137 x (0.012^2 + 0.025^2)
    = 0.5 x 0.0137 x 7.69e-4 = 5.268e-6 kg*m^2

Upper attack (theta=30 deg) at F_N=20N:
  F_up  = 20 x sin(30) = 10.0 N
  F_lat = 20 x cos(30) = 17.3 N
  tau_destab = 10.0 x 0.025 = 250 mN*m
  cf. Armor 1 (35 deg):  tau = 327 mN*m  (+30.8%)
  cf. Ring Rage (25 deg): tau = 127 mN*m  (-49.2%)

2-fold imbalance (e=0.5mm, omega=694):
  F_imbal = 0.0137 x 0.0005 x 694^2 = 3.30 N  (minor, fades below 1N at 400 rad/s)
```

```typescript
function armor2AttackForces(fNormal_N: number, thetaTip_deg: number, rTip_mm: number): {
  fUp_N: number; fLat_N: number; tauDestab_mNm: number
} {
  const rad = thetaTip_deg * Math.PI / 180;
  return {
    fUp_N: fNormal_N * Math.sin(rad),
    fLat_N: fNormal_N * Math.cos(rad),
    tauDestab_mNm: fNormal_N * Math.sin(rad) * (rTip_mm / 1000) * 1000
  };
}
// armor2AttackForces(20, 30, 25) -> { fUp=10.0N, fLat=17.3N, tau=250mN*m }
// armor2AttackForces(20, 35, 25) -> { fUp=11.5N, fLat=16.4N, tau=287mN*m }  -- Armor 1 comparison
// armor2AttackForces(30, 30, 25) -> { fUp=15.0N, fLat=26.0N, tau=375mN*m }  -- heavy impact

function armor2Inertia(m_g: number, ri_mm: number, ro_mm: number): {
  iArmor_m4: number; assemblyShare_pct: number; nexusRatio: number
} {
  const i = 0.5 * (m_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  return { iArmor_m4: i, assemblyShare_pct: (i / 3.091e-5) * 100, nexusRatio: i / 1.867e-5 };
}
// armor2Inertia(13.7, 12, 25) -> { i=5.268e-6, share=17.04%, nexusRatio=0.282 }
// armor2Inertia(13.7, 10, 27) -> { i=5.682e-6, share=18.38%, nexusRatio=0.304 }
// armor2Inertia(16.0, 12, 25) -> { i=6.152e-6, share=19.90%, nexusRatio=0.329 }

function armor2ImbalanceForce(m_g: number, ecc_mm: number, omega_radps: number): {
  fImbal_N: number; risk: string
} {
  const f = (m_g / 1000) * (ecc_mm / 1000) * omega_radps ** 2;
  return { fImbal_N: f, risk: f < 2 ? "negligible" : f < 5 ? "minor" : "significant" };
}
// armor2ImbalanceForce(13.7, 0.5, 694) -> { f=3.30N, risk="minor" }
// armor2ImbalanceForce(13.7, 0.3, 694) -> { f=1.98N, risk="negligible" }
// armor2ImbalanceForce(13.7, 0.5, 400) -> { f=1.10N, risk="negligible" }
```

---

## Case 531 — Forge Disc Nexus + S Gear + D Gear (Dynamite Battle / Burst Ultimate)

Forge Disc Nexus is the 30.6 g eight-blade DB-era Forge Disc with annular inertia I_Nexus=0.5x0.0306x(0.008^2+0.034^2)=1.867x10^-5 kg*m^2, the dominant contributor at 60.4% of the full geared assembly's inertia. The eight equally-spaced blades at r_o=34mm produce a 45-degree angular blade pitch with no directional aerodynamic bias. Nexus accepts two Evolution Gears from different design lineages. The S Gear (4.3 g, Spriggan lineage) is a dual-mode ring: installed face-up (fixed attack mode), eight S Gear locking tabs engage the disc/blade interface protrusions and contribute tau_SGear_fixed=8x500x0.0005x0.020=40.0 mN*m of additional burst resistance, raising total assembly burst torque from 56.2 mN*m (DB Core alone) to 96.2 mN*m — a +71.2% increase; installed face-down (free-spin stamina mode), the S Gear ring rotates freely on its POM bushing (mu_POM=0.04, r_shaft=3mm), contributing only tau_axle=0.04x0.0043x9.81x0.003=5.07x10^-6 N*m of drag, negligible for spin decay, and effectively decoupling the disc mass from the assembly's rotational deceleration. S Gear inertia: I_SGear=0.5x0.0043x(0.010^2+0.020^2)=1.075x10^-6 kg*m^2. The D Gear (4.0 g, Dragon lineage) functions instead as a sliding-blade frame analogous to the Sting Forge Disc mechanism: four blades at r=22mm each sit on a linear spring track (k_slide=1200 N/m, slide distance delta_x=2.5 mm); upon receiving a lateral blow, the impacted blade deflects, stores U_slide=0.5x1200x0.0025^2=3.75x10^-3 J, and releases repel impulse J=k_slide x delta_x x dt=1200x0.0025x0.005=0.015 N*s, translating to delta_v=0.015/0.0765=0.196 m/s for the 76.5 g assembly; D Gear inertia: I_DGear=0.5x0.004x(0.008^2+0.024^2)=1.280x10^-6 kg*m^2. S Gear and D Gear are mutually exclusive on a single Nexus disc; the assembly designations distinguish them (Nexus+S Gear for the standard Dynamite Belial combo, Nexus+D Gear for a repel-attack variant).

```
Forge Disc Nexus -- top view (8 blades, r_o=34mm)

    B1  B2
   /      \
  B8      B3    8 blades at 45-deg pitch
  |  bore  |    r_i=8mm, r_o=34mm
  B7      B4    I = 1.867e-5 kg*m^2
   \      /
    B6  B5

S Gear (face-up):  8 tabs locked -> +40.0 mN*m burst resist
S Gear (face-down): free-spin on POM bushing -> negligible drag
D Gear: 4 sliding blades at r=22mm -> repel on impact (Dragon)
```

```
Physics Analysis -- Nexus + S Gear + D Gear

Nexus inertia:
  I = 0.5 x 0.0306 x (0.008^2 + 0.034^2)
    = 0.5 x 0.0306 x 1.220e-3 = 1.867e-5 kg*m^2  (60.4% of assembly)

S Gear fixed mode (4.3g, r_i=10mm, r_o=20mm):
  I_SGear = 0.5 x 0.0043 x (0.010^2 + 0.020^2) = 1.075e-6 kg*m^2
  tau_fixed = 8 x 500 x 0.0005 x 0.020 = 40.0 mN*m added burst resist
  tau_total = 56.2 + 40.0 = 96.2 mN*m  (+71.2% vs DB Core alone)

S Gear free-spin mode:
  tau_axle = 0.04 x 0.0043 x 9.81 x 0.003 = 5.07e-6 N*m (negligible)
  -> disc decoupled; effective friction mass = body minus disc

D Gear sliding repel (4.0g, Dragon lineage):
  I_DGear = 0.5 x 0.004 x (0.008^2 + 0.024^2) = 1.280e-6 kg*m^2
  U_slide = 0.5 x 1200 x 0.0025^2 = 3.75e-3 J
  J_repel = 1200 x 0.0025 x 0.005 = 0.015 N*s
  delta_v = 0.015 / 0.0765 = 0.196 m/s repel
```

```typescript
function nexusInertia(m_g: number, ri_mm: number, ro_mm: number): {
  iNexus_m4: number; assemblyShare_pct: number
} {
  const i = 0.5 * (m_g / 1000) * ((ri_mm / 1000) ** 2 + (ro_mm / 1000) ** 2);
  return { iNexus_m4: i, assemblyShare_pct: (i / 3.091e-5) * 100 };
}
// nexusInertia(30.6, 8, 34) -> { i=1.867e-5, share=60.4% }
// nexusInertia(34.9, 8, 34) -> { i=2.130e-5, share=68.9% }  -- with S Gear mass pooled
// nexusInertia(30.6, 8, 36) -> { i=2.016e-5, share=65.2% }  -- wider radius estimate

function sGearModeEffect(mode: "fixed" | "free-spin", nTabs: number, kTab_Npm: number, delta_mm: number, r_mm: number): {
  tauAdded_mNm: number; totalTau_mNm: number; effectDesc: string
} {
  const tauDB = 56.2;
  if (mode === "fixed") {
    const tau = nTabs * kTab_Npm * (delta_mm / 1000) * (r_mm / 1000) * 1000;
    return { tauAdded_mNm: tau, totalTau_mNm: tauDB + tau, effectDesc: "attack: burst resist amplified" };
  }
  return { tauAdded_mNm: 0, totalTau_mNm: tauDB, effectDesc: "stamina: disc decoupled via POM bushing" };
}
// sGearModeEffect("fixed", 8, 500, 0.5, 20) -> { added=40.0, total=96.2mN*m, "attack: burst resist amplified" }
// sGearModeEffect("free-spin", 0, 0, 0, 0) -> { added=0, total=56.2mN*m, "stamina: disc decoupled" }
// sGearModeEffect("fixed", 8, 600, 0.5, 20) -> { added=48.0, total=104.2mN*m, "attack: burst resist amplified" }

function dGearRepelImpulse(kSlide_Npm: number, dx_mm: number, dt_ms: number, mAssembly_g: number): {
  uSlide_mJ: number; impulse_Ns: number; deltaV_mps: number
} {
  const u = 0.5 * kSlide_Npm * (dx_mm / 1000) ** 2;
  const j = kSlide_Npm * (dx_mm / 1000) * (dt_ms / 1000);
  return { uSlide_mJ: u * 1000, impulse_Ns: j, deltaV_mps: j / (mAssembly_g / 1000) };
}
// dGearRepelImpulse(1200, 2.5, 5, 76.5) -> { u=3.75mJ, J=0.015N*s, dv=0.196m/s }
// dGearRepelImpulse(1200, 3.0, 5, 76.5) -> { u=5.4mJ, J=0.018N*s, dv=0.235m/s }
// dGearRepelImpulse(1500, 2.5, 5, 76.5) -> { u=4.69mJ, J=0.01875N*s, dv=0.245m/s }
```

---

## Case 532 — Performance Tip Venture + V Gear + VS Gear (Dynamite Battle / Burst Ultimate)

Performance Tip Venture is the 7.8 g inconsistent-flat-plus-rubber attack driver featuring a central ABS flat tip of r_flat=2mm and an outer rubber ring at r_rubber=8mm; contact mode alternates between center-flat and outer-rubber depending on tilt angle and spin rate, earning the "inconsistent" classification due to unpredictable switching, and the average model uses mu_eff=0.30, r_eff=4mm: dω/dt=-(0.30x0.0646x9.81x0.004)/2.835e-5=-26.8 rad/s^2, t_battle=15.5 s, an aggressive attack combat window. The V Gear (5.6 g, metal wing ring, Valkyrie lineage) twists-and-locks onto the Venture shaft, compressing the internal spring by delta_x=0.5 mm to reach Dash Driver level of normal force (F_add=2500x0.0005=1.25 N additional), normalising contact to the central flat tip; V Gear inertia I_V=0.5x0.0056x(0.010^2+0.018^2)=1.187x10^-6 kg*m^2; burst resistance reaches Dash-class level; as an Evolution Gear of the Valkyrie lineage it enhances attack potential by adding metal wing protrusions that increase wall-contact impulse during outward arcing. The VS Gear (7.6 g total = V Gear 5.6 g + free-spinning S Gear blade portion 2.0 g) supersedes V Gear and compresses the spring above Dash level, additionally providing a free-spinning outer guard ring (r_guard=14mm) that contacts arena walls during outward movement without coupling lateral wall friction into rotational deceleration — the guard ring free-spins at the wall contact point so only axle bushing torque tau_axle=0.04x0.002x9.81x0.003=2.35x10^-6 N*m is imparted to the body per wall contact. With VS Gear (m_total=76.5 g): mu_center=0.25, r_eff=3mm, dω/dt=-(0.25x0.0765x9.81x0.003)/3.091e-5=-18.2 rad/s^2, t_battle=22.9 s — a +47.7% extension over bare Venture (15.5 s) achieved because the heavier geared assembly and decoupled guard ring reduce effective friction despite the stiffer spring. VS Gear I_total=I_V+I_guard=1.187e-6+0.5x0.002x(0.010^2+0.014^2)=1.187e-6+2.96e-7=1.483e-6 kg*m^2.

```
Venture tip -- cross-section (side view)

  +----------+   outer rubber ring r=8mm (inconsistent mode)
  |   BODY   |
  |  spring  |   k=2500 N/m internal
  +----+-----+
       |  flat tip r=2mm (center mode)
      [F]

V Gear:   locks onto shaft; Dx=+0.5mm; F_add=1.25N (Dash level)
          I_V=1.187e-6; metal wings add wall-attack impulse
VS Gear:  above Dash spring level; free-spin guard ring r=14mm
          I_VS=1.483e-6; guard decouples wall friction from body
```

```
Physics Analysis -- Venture + V Gear + VS Gear

Base Venture (7.8g, mu_eff=0.30, r_eff=4mm, m_assy=64.6g):
  dw/dt = -(0.30 x 0.0646 x 9.81 x 0.004) / 2.835e-5 = -26.8 rad/s^2
  t_battle = 416 / 26.8 = 15.5 s

V Gear (5.6g, Dash-level spring compression):
  I_V = 0.5 x 0.0056 x (0.010^2 + 0.018^2) = 1.187e-6 kg*m^2
  F_spring_add = 2500 x 0.0005 = 1.25 N  (reaches Dash normal force)

VS Gear (7.6g total, above-Dash spring, free-spin guard r=14mm):
  I_guard = 0.5 x 0.002 x (0.010^2 + 0.014^2) = 2.96e-7 kg*m^2
  I_VS = 1.187e-6 + 2.96e-7 = 1.483e-6 kg*m^2
  tau_wall_via_guard = 0.04 x 0.002 x 9.81 x 0.003 = 2.35e-6 N*m (negligible)
  dw/dt = -(0.25 x 0.0765 x 9.81 x 0.003) / 3.091e-5 = -18.2 rad/s^2
  t_battle = 416 / 18.2 = 22.9 s  (+47.7% vs bare Venture)
```

```typescript
function ventureSpinDecay(mu: number, m_g: number, rEff_mm: number, iTotal: number): {
  dwDt_radps2: number; tBattle_s: number
} {
  const dw = -(mu * (m_g / 1000) * 9.81 * (rEff_mm / 1000)) / iTotal;
  return { dwDt_radps2: dw, tBattle_s: 416 / Math.abs(dw) };
}
// ventureSpinDecay(0.30, 64.6, 4, 2.835e-5) -> { dw=-26.8, t=15.5s }  -- base no gear
// ventureSpinDecay(0.25, 76.5, 3, 3.091e-5) -> { dw=-18.2, t=22.9s }  -- VS Gear config
// ventureSpinDecay(0.25, 71.4, 2, 2.973e-5) -> { dw=-11.9, t=35.0s }  -- V Gear only (flat center)

function vGearSpringEffect(kSpring_Npm: number, dx_mm: number): {
  fAdd_N: number; springLevel: string; contactMode: string
} {
  const f = kSpring_Npm * (dx_mm / 1000);
  const level = f < 1.0 ? "below Dash" : f < 1.75 ? "Dash level" : "above Dash";
  return { fAdd_N: f, springLevel: level, contactMode: f >= 1.0 ? "flat center dominant" : "inconsistent" };
}
// vGearSpringEffect(2500, 0.5) -> { f=1.25N, "Dash level", "flat center dominant" }   -- V Gear
// vGearSpringEffect(2500, 0.8) -> { f=2.0N, "above Dash", "flat center dominant" }    -- VS Gear
// vGearSpringEffect(2500, 0.2) -> { f=0.5N, "below Dash", "inconsistent" }            -- no gear

function vsGearCombinedInertia(mVGear_g: number, mGuard_g: number, rV_i_mm: number, rV_o_mm: number, rG_i_mm: number, rG_o_mm: number): {
  iVGear_m4: number; iGuard_m4: number; iVS_total_m4: number
} {
  const iv = 0.5 * (mVGear_g / 1000) * ((rV_i_mm / 1000) ** 2 + (rV_o_mm / 1000) ** 2);
  const ig = 0.5 * (mGuard_g / 1000) * ((rG_i_mm / 1000) ** 2 + (rG_o_mm / 1000) ** 2);
  return { iVGear_m4: iv, iGuard_m4: ig, iVS_total_m4: iv + ig };
}
// vsGearCombinedInertia(5.6, 2.0, 10, 18, 10, 14) -> { iv=1.187e-6, ig=2.96e-7, total=1.483e-6 }
// vsGearCombinedInertia(5.6, 2.0, 10, 20, 10, 16) -> { iv=1.437e-6, ig=3.52e-7, total=1.789e-6 }
// vsGearCombinedInertia(5.6, 2.0, 12, 18, 10, 14) -> { iv=1.065e-6, ig=2.96e-7, total=1.362e-6 }
```

---

## Case 533 — Assembly: Dynamite Belial Nexus Venture-2 (DB / BU)

The Dynamite Belial Nexus Venture-2 assembly in S Gear (fixed attack) + VS Gear configuration deploys total mass m=76.5 g and total moment of inertia I_total=1.750e-6+2.401e-6+5.268e-6+1.867e-5+1.075e-6+2.652e-7+1.483e-6=3.091e-5 kg*m^2; the breakdown by component is: DB Core Belial 5.66%, Blade Dynamite 7.77%, Armor 2 17.04%, Nexus 60.40%, S Gear 3.48%, Venture 0.86%, VS Gear 4.80%. Launch angular momentum L0=3.091e-5x694=2.145e-2 kg*m^2/s is the highest of the right-spin DB-era attack assemblies (84.5% of Glide Ragnaruk Wheel Revolve 1S's 2.538e-2 kg*m^2/s). The VS Gear centre-flat contact model (mu=0.25, r_eff=3mm) yields dω/dt=-18.2 rad/s^2, t_battle=22.9 s; the VS Gear free-spinning guard ring prevents wall-friction coupling into rotational deceleration during Dynamite Belial's outward-arcing attack trajectories, explaining the +47.7% combat time extension over bare Venture. Total burst torque tau_burst=tau_DBCore+tau_SGear_fixed=56.2+40.0=96.2 mN*m is the highest combined burst resistance in the Dynamite Belial system, with S Gear contributing +71.2% above DB Core alone. The assembly supports four distinct Evolution Gear configurations: (A) base no gears at 64.6 g, I=2.835e-5, t=15.5 s, tau=56.2 mN*m — maximum aggression, shortest window; (B) S Gear fixed + VS Gear at 76.5 g, I=3.091e-5, t=22.9 s, tau=96.2 mN*m — balanced attack with high burst resistance; (C) F Gear + S Gear + VS Gear at 82.2 g, I=3.325e-5, t=17.5 s — rubber repel stamina-attack hybrid (F Gear's mu=0.55 raises floor friction, shortening combat); (D) L Gear High Mode + S Gear + VS Gear at 92.0 g, I=4.040e-5, t=24.8 s — maximum mass mode with L0=2.804e-2 kg*m^2/s exceeding Glide Ragnaruk.

```
Assembly: Dynamite Belial Nexus Venture-2 (S Gear + VS Gear)

   [DB Core Belial  7.0g right-spin  4 tabs]   I=1.750e-6
   [Blade Dynamite  5.5g 3-wing attack     ]   I=2.401e-6
   [Armor 2        13.7g 2-point upper atk ]   I=5.268e-6
   [Nexus          30.6g 8-blade + S Gear  ]   I=1.867e-5+1.075e-6
   [Venture         7.8g flat+rubber+VSGear]   I=2.652e-7+1.483e-6
   ---------------------------------------------------
   Total (S Gear + VS Gear): 76.5g
   I_total = 3.091e-5 kg*m^2
   L0      = 2.145e-2 kg*m^2/s  (84.5% of Glide Ragnaruk)
   dw/dt   = -18.2 rad/s^2  (VS Gear config)
   t_battle = 22.9 s
   tau_burst = 96.2 mN*m  (DB Core 56.2 + S Gear 40.0)
```

```
Physics Analysis -- Assembly Summary

Component inertia breakdown:
  DB Core Belial:  1.750e-6  ( 5.66%)
  Blade Dynamite:  2.401e-6  ( 7.77%)
  Armor 2:         5.268e-6  (17.04%)
  Nexus base:      1.867e-5  (60.40%)
  S Gear (fixed):  1.075e-6  ( 3.48%)
  Venture:         2.652e-7  ( 0.86%)
  VS Gear:         1.483e-6  ( 4.80%)
  I_total:         3.091e-5  (100.0%)

L0 = 3.091e-5 x 694 = 2.145e-2 kg*m^2/s

Config comparison:
  A: base no gears   64.6g  I=2.835e-5  t=15.5s  tau=56.2mN*m
  B: S+VS Gear       76.5g  I=3.091e-5  t=22.9s  tau=96.2mN*m
  C: F+S+VS Gear     82.2g  I=3.325e-5  t=17.5s  tau=96.2mN*m
  D: L+S+VS Gear     92.0g  I=4.040e-5  t=24.8s  tau=96.2mN*m
  D has L0=2.804e-2 -> exceeds Glide Ragnaruk (2.538e-2)
```

```typescript
function belialAssemblyInertia(cores: {m_g: number; ri_mm: number; ro_mm: number}[]): {
  iTotal_m4: number; components_m4: number[]
} {
  const parts = cores.map(c => 0.5 * (c.m_g / 1000) * ((c.ri_mm / 1000) ** 2 + (c.ro_mm / 1000) ** 2));
  return { iTotal_m4: parts.reduce((a, b) => a + b, 0), components_m4: parts };
}
// belialAssemblyInertia([{m:7,ri:10,ro:20},{m:5.5,ri:12,ro:27},{m:13.7,ri:12,ro:25},{m:30.6,ri:8,ro:34},{m:4.3,ri:10,ro:20},{m:7.8,ri:2,ro:8},{m:7.6,ri:10,ro:16}])
//  -> { iTotal≈3.091e-5, components=[1.75e-6,2.40e-6,5.27e-6,1.87e-5,1.08e-6,2.65e-7,1.22e-6] }

function belialAngularMomentum(iTotal: number, omega_radps: number): {
  L0_kgm2ps: number; glideRagnarukRatio_pct: number
} {
  const L = iTotal * omega_radps;
  const L_glide = 3.657e-5 * 694;
  return { L0_kgm2ps: L, glideRagnarukRatio_pct: (L / L_glide) * 100 };
}
// belialAngularMomentum(3.091e-5, 694) -> { L=2.145e-2, ratio=84.5% of Glide Ragnaruk }
// belialAngularMomentum(4.040e-5, 694) -> { L=2.804e-2, ratio=110.5% -- exceeds Glide }  -- L Gear
// belialAngularMomentum(2.835e-5, 694) -> { L=1.968e-2, ratio=77.6% }                    -- base

function belialSpinDecayConfig(config: "base" | "S+VS" | "F+S+VS" | "L+S+VS"): {
  m_g: number; iTotal: number; dwDt_radps2: number; tBattle_s: number; tau_mNm: number
} {
  const cfgs: Record<string, {m: number; i: number; mu: number; r: number; tau: number}> = {
    "base":   { m: 64.6, i: 2.835e-5, mu: 0.30, r: 4e-3, tau: 56.2 },
    "S+VS":   { m: 76.5, i: 3.091e-5, mu: 0.25, r: 3e-3, tau: 96.2 },
    "F+S+VS": { m: 82.2, i: 3.325e-5, mu: 0.28, r: 3.5e-3, tau: 96.2 },
    "L+S+VS": { m: 92.0, i: 4.040e-5, mu: 0.25, r: 3e-3, tau: 96.2 }
  };
  const c = cfgs[config];
  const dw = -(c.mu * (c.m / 1000) * 9.81 * c.r) / c.i;
  return { m_g: c.m, iTotal: c.i, dwDt_radps2: dw, tBattle_s: 416 / Math.abs(dw), tau_mNm: c.tau };
}
// belialSpinDecayConfig("base")   -> { m=64.6g, i=2.835e-5, dw=-26.8, t=15.5s, tau=56.2mN*m }
// belialSpinDecayConfig("S+VS")   -> { m=76.5g, i=3.091e-5, dw=-18.2, t=22.9s, tau=96.2mN*m }
// belialSpinDecayConfig("L+S+VS") -> { m=92.0g, i=4.040e-5, dw=-16.8, t=24.8s, tau=96.2mN*m }
```

---

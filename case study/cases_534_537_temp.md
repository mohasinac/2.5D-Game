
## Case 534 — DB Core Belial 2 (Dynamite Battle / Burst Ultimate)

DB Core Belial 2 is the 8.1 g right-spin DB Core of the Dangerous Belial system, heavier than the original Belial (7.0 g) by 1.1 g due to the internal Overdrive System mechanism; with r_i=10mm and r_o=22mm (slightly wider than Belial's 20mm to accommodate the centrifugal tab housing), I_Belial2=0.5x0.0081x(0.010^2+0.022^2)=2.365x10^-6 kg*m^2. The defining feature is the Overdrive System: a centrifugal burst-lock tab (m_tab=0.5g, mounted at r_tab=5mm from the core axis on a radial track, opposed by a return spring k_spring=1000 N/m) that extends outward at high spin and obstructs the disc from advancing to the burst position. The critical angular velocity for lock engagement is omega_critical=sqrt(k_spring x delta_ext/(m_tab x r_tab))=sqrt(1000x0.0005/(0.0005x0.005))=447 rad/s; at launch omega=694 rad/s the centrifugal force F_cf=0.0005x0.005x694^2=1.204 N exceeds the spring restoring force F_spring=1000x0.0005=0.500 N, producing net lock engagement force 0.704 N — effectively infinite burst resistance during the high-spin phase (694 to 447 rad/s, spanning the first 247/416 = 59.4% of the battle window). Below omega=447 rad/s the spring retracts the tab and standard 4-tab torque tau_standard=4x1300x0.0006x0.018=56.2 mN*m applies; this two-phase burst resistance profile makes Belial 2 "comparable to Kerbeus" in overall burst defence. The second mold introduces a BU Lock: raised protrusions on compatible discs (Xanthus, Moon) lock into two additional grooves on the core, preventing disc oscillation under sustained hits; this mechanic is not active in the Almight assembly since Almight is not BU-Lock-compatible. As a standalone core for stamina combos, Belial 2's higher Stamina over Kerbeus derives from its smoother disc-to-core interface geometry producing lower parasitic friction between tab-release events.

```
DB Core Belial 2 -- top view (r_o=22mm, right-spin)

       Overdrive tab (centrifugal, m=0.5g at r=5mm)
       |
   +----------+
   | [bore]   |   Overdrive lock: omega > 447 rad/s -> infinite resist
   | r=10mm   |   Standard 4 tabs (k=1300): tau=56.2 mN*m at low spin
   +----------+
       |
       spring k=1000 N/m (return)

I = 2.365e-6 kg*m^2
omega_crit = 447 rad/s  (64.4% of launch; lock active above this)
```

```
Physics Analysis -- DB Core Belial 2

Inertia (annular, r_o=22mm for Overdrive housing):
  I = 0.5 x 0.0081 x (0.010^2 + 0.022^2)
    = 0.5 x 0.0081 x 5.84e-4 = 2.365e-6 kg*m^2

Overdrive System centrifugal lock:
  omega_crit = sqrt(k x delta / (m_tab x r_tab))
             = sqrt(1000 x 0.0005 / (0.0005 x 0.005))
             = sqrt(200,000) = 447 rad/s
  At launch (694 rad/s): F_cf=1.204N > F_spring=0.500N -> locked
  Net lock force = 0.704 N; burst torque = infinity (high spin)
  Below 447 rad/s: standard tau = 56.2 mN*m (4-tab fallback)

Battle window analysis:
  High-spin (lock active): 694 -> 447 rad/s  (first 59.4% of range)
  Low-spin (tabs only):    447 -> 277 rad/s  (remaining 40.6%)
```

```typescript
function belial2OverdriveLock(mTab_g: number, rTab_mm: number, kSpring_Npm: number, deltaExt_mm: number): {
  omegaCrit_radps: number; fCfAtLaunch_N: number; fSpring_N: number; netLockForce_N: number
} {
  const omegaCrit = Math.sqrt((kSpring_Npm * (deltaExt_mm / 1000)) / ((mTab_g / 1000) * (rTab_mm / 1000)));
  const fCf = (mTab_g / 1000) * (rTab_mm / 1000) * 694 ** 2;
  const fSp = kSpring_Npm * (deltaExt_mm / 1000);
  return { omegaCrit_radps: omegaCrit, fCfAtLaunch_N: fCf, fSpring_N: fSp, netLockForce_N: fCf - fSp };
}
// belial2OverdriveLock(0.5, 5, 1000, 0.5) -> { wCrit=447, fCf=1.204N, fSp=0.500N, net=0.704N }
// belial2OverdriveLock(0.5, 5, 800, 0.5)  -> { wCrit=400, fCf=1.204N, fSp=0.400N, net=0.804N }
// belial2OverdriveLock(0.5, 4, 1000, 0.5) -> { wCrit=500, fCf=0.963N, fSp=0.500N, net=0.463N }

function belial2BurstProfile(omega: number): {
  mode: string; burstTorque_mNm: number | string; lockActive: boolean
} {
  const omegaCrit = 447;
  if (omega > omegaCrit) {
    return { mode: "Overdrive active", burstTorque_mNm: "infinity", lockActive: true };
  }
  return { mode: "standard tabs", burstTorque_mNm: 56.2, lockActive: false };
}
// belial2BurstProfile(694) -> { mode="Overdrive active", tau=infinity, locked=true }
// belial2BurstProfile(447) -> { mode="Overdrive active", tau=infinity, locked=true }
// belial2BurstProfile(300) -> { mode="standard tabs", tau=56.2mN*m, locked=false }

function belial2VsKerbeusBurstWindow(omegaLaunch: number, omegaStability: number, omegaCrit: number): {
  overdriveFraction_pct: number; tabFraction_pct: number; effectiveBurstResist: string
} {
  const total = omegaLaunch - omegaStability;
  const overdriveRange = Math.max(0, Math.min(omegaLaunch, omegaCrit + (omegaLaunch - omegaCrit)) - omegaCrit);
  const odPct = ((omegaLaunch - omegaCrit) / total) * 100;
  return {
    overdriveFraction_pct: odPct,
    tabFraction_pct: 100 - odPct,
    effectiveBurstResist: "infinite (high-spin) -> 56.2mN*m (low-spin)"
  };
}
// belial2VsKerbeusBurstWindow(694, 277, 447) -> { OD=59.4%, tabs=40.6%, "infinite -> 56.2mN*m" }
// belial2VsKerbeusBurstWindow(694, 277, 350) -> { OD=83.4%, tabs=16.6%, "infinite -> 56.2mN*m" }
// belial2VsKerbeusBurstWindow(694, 277, 500) -> { OD=46.7%, tabs=53.3%, "infinite -> 56.2mN*m" }
```

---

## Case 535 — Blade Dangerous (Dynamite Battle / Burst Ultimate)

Blade Dangerous is the 10.0 g attack-type BU Blade of the Dangerous Belial system, featuring three wings in a trefoil arrangement with hard red rubber insert segments at the outer tip of each wing at r_tip=28mm; the blade is 4.5 g heavier than Dynamite (5.5 g) due to the three built-in rubber inserts, and its annular inertia I_Dan=0.5x0.010x(0.012^2+0.028^2)=4.640x10^-6 kg*m^2 is 93.2% higher than Dynamite (2.401x10^-6) because the rubber mass sits at the outer radius. The hard rubber (mu_rubber_hard≈0.50, lower deformability than Fafnir's soft compound) at each wing tip produces a repel force per contact event of F_repel=0.50x15xcos(35 deg)=6.14 N; compared to bare ABS at 0.35x15xcos(35 deg)=4.30 N this is +42.8%, but the rubber is constrained to the wing tips only — the wide gaps between wings (each gap ≈ 80 degrees of arc versus the ~40-degree contact arc of each wing tip) means effective contact coverage is approximately 3x40/360=33% versus Dynamite with F Gear at ~80%; the spaced contact creates high-force but intermittent collision events with reduced total repel torque over a battle. The F Gear (5.7 g) is compatible with Dangerous but less effective: the inter-wing gaps of Dangerous have a different curvature from Dynamite's gaps, so F Gear rubber pads cannot fill the gaps completely into a smooth circle, resulting in approximately 50% gap-fill versus Dynamite's 90%; the F Gear's contact efficiency on Dangerous is roughly half that on Dynamite. The L Gear (15.5 g, High Mode only, Longinus lineage) attaches identically to Dynamite: I_LGear=9.486x10^-6 kg*m^2, CoM shift delta_h=6x(15.5/82.2)=1.13 mm for the Dangerous Belial base assembly with L Gear (82.2 = 56.2+15.5+10.5g estimate for other components without armor), same as previously documented.

```
Blade Dangerous -- top view (3 wings, r_tip=28mm)

         [R] <- hard red rubber insert at tip
        /
   +---/---+
   |  hub   |  3 wings with rubber at tips ONLY
   | r=12mm |  gaps between wings: ~80 deg arc each
   +---\---+   contact coverage ≈ 33% vs F Gear 80%
        \
         [R]

I_Dan = 4.640e-6 kg*m^2  (1.93x Dynamite due to rubber tip mass at r=28mm)
F_repel = 6.14N per 15N contact (hard rubber mu=0.50)
F Gear on Dangerous: ~50% effective (gap curvature mismatch)
L Gear: same as Dynamite (High Mode only, 15.5g, I_L=9.486e-6)
```

```
Physics Analysis -- Blade Dangerous

Inertia (annular, outer tip mass at r=28mm):
  I = 0.5 x 0.010 x (0.012^2 + 0.028^2)
    = 0.5 x 0.010 x 9.28e-4 = 4.640e-6 kg*m^2
  cf. Dynamite: 2.401e-6 -> Dangerous is +93.2% higher

Rubber tip repel (hard rubber, mu=0.50, theta=35 deg):
  F_repel  = 0.50 x 15 x cos(35) = 6.14 N
  F_bare   = 0.35 x 15 x cos(35) = 4.30 N
  Enhancement: +42.8%  (vs Dynamite+F Gear: +57.2%)
  Contact coverage: 3x40deg/360 = 33% arc (gaps between wings)

F Gear effectiveness on Dangerous vs Dynamite:
  Dynamite gaps: match F Gear shape -> ~90% fill -> near-circular profile
  Dangerous gaps: curvature mismatch -> ~50% fill -> partial circle only
  F Gear on Dangerous not recommended; rubber at tips already sufficient
```

```typescript
function dangerousBladeRepelForce(muRubber: number, fNormal_N: number, thetaSweep_deg: number): {
  fRepel_N: number; fBare_N: number; enhancement_pct: number; contactCoverage_pct: number
} {
  const cosT = Math.cos(thetaSweep_deg * Math.PI / 180);
  return {
    fRepel_N: muRubber * fNormal_N * cosT,
    fBare_N: 0.35 * fNormal_N * cosT,
    enhancement_pct: (muRubber / 0.35 - 1) * 100,
    contactCoverage_pct: 33
  };
}
// dangerousBladeRepelForce(0.50, 15, 35) -> { fRepel=6.14N, bare=4.30N, enh=+42.8%, cov=33% }
// dangerousBladeRepelForce(0.50, 20, 35) -> { fRepel=8.19N, bare=5.73N, enh=+42.8%, cov=33% }
// dangerousBladeRepelForce(0.55, 15, 35) -> { fRepel=6.76N, bare=4.30N, enh=+57.2%, cov=33% }  -- F Gear ref

function dangerousVsDynamite(mDangerous_g: number, mDynamite_g: number, rTip_mm: number, rHub_mm: number): {
  iDangerous_m4: number; iDynamite_m4: number; inertiaDiff_pct: number
} {
  const id = 0.5 * (mDangerous_g / 1000) * ((rHub_mm / 1000) ** 2 + (rTip_mm / 1000) ** 2);
  const idyn = 0.5 * (mDynamite_g / 1000) * ((12 / 1000) ** 2 + (27 / 1000) ** 2);
  return { iDangerous_m4: id, iDynamite_m4: idyn, inertiaDiff_pct: (id / idyn - 1) * 100 };
}
// dangerousVsDynamite(10.0, 5.5, 28, 12) -> { id=4.640e-6, idyn=2.401e-6, diff=+93.2% }
// dangerousVsDynamite(10.0, 5.5, 30, 12) -> { id=4.980e-6, idyn=2.401e-6, diff=+107.4% }
// dangerousVsDynamite(10.0, 5.5, 26, 12) -> { id=4.300e-6, idyn=2.401e-6, diff=+79.1% }

function dangerousFGearEffectiveness(gapFillFraction: number, muRubber: number, fNormal_N: number, thetaDeg: number): {
  effectiveRepel_N: number; vsFullFill_pct: number
} {
  const cosT = Math.cos(thetaDeg * Math.PI / 180);
  const fullFill = muRubber * fNormal_N * cosT;
  return { effectiveRepel_N: fullFill * gapFillFraction, vsFullFill_pct: gapFillFraction * 100 };
}
// dangerousFGearEffectiveness(0.50, 0.55, 15, 35) -> { eff=3.38N, pct=50% } -- partial fill
// dangerousFGearEffectiveness(0.90, 0.55, 15, 35) -> { eff=6.08N, pct=90% } -- Dynamite reference
// dangerousFGearEffectiveness(0.33, 0.55, 15, 35) -> { eff=2.23N, pct=33% } -- worst case
```

---

## Case 536 — Performance Tip Almight + S Gear + D Gear + V Gear (Dynamite Battle / Burst Ultimate)

Performance Tip Almight is the 38.1 g Disc-Integrated Driver of the Dangerous Belial system, combining the functions of both Forge Disc and Performance Tip into a single component; at 38.1 g it is heavier than any standalone disc in the DB/BU series (Nexus 30.6 g, Giga 32.8 g, Karma 29.2 g) and its annular inertia I_Almight=0.5x0.0381x(0.008^2+0.036^2)=2.591x10^-5 kg*m^2 is the highest for any single non-chassis component documented in this series. The dual launch-power mechanism determines tip behaviour: a strong launch engages a torque-triggered latch that fixes the tip shaft, producing a hole-flat contact geometry (tip contacts at the rim of a small central hole, r_eff≈1.5mm, mu_ABS=0.15) with dω/dt=-(0.15x0.0661x9.81x0.0015)/3.518e-5=-4.15 rad/s^2 and t_battle=100s; a light launch does not engage the latch and the tip shaft free-spins on its POM bushing (mu_POM=0.04, r_shaft=2.5mm), with only the body (I_body=I_Belial2+I_Dangerous=7.005x10^-6) decelerating via bushing drag: dω_body/dt=-(0.04x0.0661x9.81x0.0025)/7.005e-6=-9.25 rad/s^2, t_body=45 s; the free-spinning Almight outer disc ring maintains its own high angular momentum independent of the body, providing extended LAD (gyroscopic stability) after body spin drops. Almight accepts three Evolution Gears: the S Gear (4.3 g, 4 tabs, Spriggan lineage) in fixed mode adds tau_SGear_fixed=4x500x0.0005x0.020=20.0 mN*m burst resistance and in free-spin mode decouples the disc; the D Gear (4.0 g, Dragon lineage, same sliding-blade mechanism as on Nexus with J_repel=0.015 N*s repel impulse); the V Gear (5.6 g, Valkyrie lineage) on Almight increases LAD radius from the irregular disc edge (r_LAD≈24mm mean) to a consistent circular V Gear rim at r_LAD=28mm, increasing effective LAD contact radius by +16.7% and adding I_V=1.187x10^-6 kg*m^2; the V Gear also adds weight at r≈18mm, further extending the assembly's gyroscopic stability window.

```
Almight -- cross-section (side view, disc-integrated driver)

  +--[outer disc ring, r=36mm]--+
  |      m=38.1g total          |   disc + driver in one body
  |  [latch mechanism]          |   strong launch -> tip fixed (hole flat)
  +--------+------+             |   light launch -> tip free-spins (POM)
           |shaft |
          [F]  r=1.5mm hole-flat tip (fixed mode)
        or free-spin on POM bushing r=2.5mm (free mode)

I_Almight = 2.591e-5 kg*m^2  (highest single non-chassis component)
Strong launch: t=100s  (hole flat, full assembly I)
Free-spin:     t_body=45s  (body only I=7.005e-6, disc provides LAD)
V Gear: r_LAD 24mm -> 28mm (+16.7% LAD radius)
S Gear (4 tabs on Almight): tau_fixed=20.0 mN*m; free-spin=decoupled
```

```
Physics Analysis -- Almight + Evolution Gears

Almight inertia (disc-integrated, annular):
  I = 0.5 x 0.0381 x (0.008^2 + 0.036^2)
    = 0.5 x 0.0381 x 1.360e-3 = 2.591e-5 kg*m^2

Strong launch (fixed hole-flat, mu=0.15, r=1.5mm, m=66.1g):
  dw/dt = -(0.15 x 0.0661 x 9.81 x 0.0015) / 3.518e-5 = -4.15 rad/s^2
  t_battle = 416 / 4.15 = 100s

Free-spin mode (POM bushing, r=2.5mm, body I=7.005e-6):
  dw_body/dt = -(0.04 x 0.0661 x 9.81 x 0.0025) / 7.005e-6 = -9.25 rad/s^2
  t_body = 416 / 9.25 = 45s  (disc LAD continues beyond this)

S Gear on Almight (4 grooves, not 8 like Nexus):
  tau_fixed = 4 x 500 x 0.0005 x 0.020 = 20.0 mN*m  (half of Nexus S Gear)
  Total with DB Core: 56.2 + 20.0 = 76.2 mN*m

V Gear on Almight (round shape, r_LAD: 24mm -> 28mm):
  LAD radius increase: +16.7%; I_V=1.187e-6 kg*m^2 added
```

```typescript
function almightSpinDecay(mode: "fixed" | "free-spin", m_g: number, iTotal: number, iBody: number): {
  dwDt_radps2: number; tBattle_s: number; limitingI: number
} {
  if (mode === "fixed") {
    const dw = -(0.15 * (m_g / 1000) * 9.81 * 0.0015) / iTotal;
    return { dwDt_radps2: dw, tBattle_s: 416 / Math.abs(dw), limitingI: iTotal };
  }
  const dw = -(0.04 * (m_g / 1000) * 9.81 * 0.0025) / iBody;
  return { dwDt_radps2: dw, tBattle_s: 416 / Math.abs(dw), limitingI: iBody };
}
// almightSpinDecay("fixed", 66.1, 3.518e-5, 7.005e-6) -> { dw=-4.15, t=100s, I=3.518e-5 }
// almightSpinDecay("free-spin", 66.1, 3.518e-5, 7.005e-6) -> { dw=-9.25, t=45s, I=7.005e-6 }
// almightSpinDecay("fixed", 56.2, 3.291e-5, 7.005e-6) -> { dw=-3.87, t=107s, I=3.291e-5 }  -- no gears

function almightVGearLad(rLadBase_mm: number, rLadVGear_mm: number, iVGear: number): {
  ladIncrease_pct: number; iAdded_m4: number; roundnessGain: string
} {
  return {
    ladIncrease_pct: (rLadVGear_mm / rLadBase_mm - 1) * 100,
    iAdded_m4: iVGear,
    roundnessGain: "irregular disc edge -> full circular rim; consistent LAD contact"
  };
}
// almightVGearLad(24, 28, 1.187e-6) -> { lad=+16.7%, i=1.187e-6, "irregular -> circular" }
// almightVGearLad(22, 28, 1.187e-6) -> { lad=+27.3%, i=1.187e-6, "irregular -> circular" }
// almightVGearLad(24, 30, 1.187e-6) -> { lad=+25.0%, i=1.187e-6, "irregular -> circular" }

function almightSGearTorque(nTabs: number, kTab_Npm: number, delta_mm: number, r_mm: number, mode: "fixed" | "free-spin"): {
  tauSGear_mNm: number; tauTotal_mNm: number; nexusComparison: string
} {
  const tauDB = 56.2;
  if (mode === "free-spin") {
    return { tauSGear_mNm: 0, tauTotal_mNm: tauDB, nexusComparison: "decoupled (stamina mode)" };
  }
  const tau = nTabs * kTab_Npm * (delta_mm / 1000) * (r_mm / 1000) * 1000;
  return { tauSGear_mNm: tau, tauTotal_mNm: tauDB + tau, nexusComparison: `${tau}mN*m vs Nexus S Gear 40.0mN*m (${(tau/40*100).toFixed(0)}%)` };
}
// almightSGearTorque(4, 500, 0.5, 20, "fixed") -> { tau=20.0, total=76.2mN*m, "50% of Nexus" }
// almightSGearTorque(4, 500, 0.5, 20, "free-spin") -> { tau=0, total=56.2mN*m, "decoupled" }
// almightSGearTorque(4, 600, 0.5, 20, "fixed") -> { tau=24.0, total=80.2mN*m, "60% of Nexus" }
```

---

## Case 537 — Assembly: Dangerous Belial Almight (Perfect Gear)

The Dangerous Belial Almight assembly in Perfect Gear configuration (S Gear free-spin + V Gear on Almight) deploys total mass m=8.1+10.0+38.1+4.3+5.6=66.1 g with total inertia I_total=2.365e-6+4.640e-6+2.591e-5+1.075e-6+1.187e-6=3.518x10^-5 kg*m^2; angular momentum L0=3.518e-5x694=2.441x10^-2 kg*m^2/s (96.2% of Glide Ragnaruk Wheel Revolve 1S). The inertia breakdown is dominated by Almight at 73.7% of total I, followed by Dangerous (13.2%), Armor absent (no armor in this three-part combo), S Gear (3.06%), V Gear (3.37%), and DB Core Belial 2 (6.72%). The strong-launch (hole-flat fixed, mu=0.15, r=1.5mm) yields the longest battle time of any right-spin assembly documented in this series: dω/dt=-4.15 rad/s^2, t_battle=100s, enabled by the combined effect of Almight's massive inertia (2.591x10^-5), the small-radius hole-flat contact minimising friction torque, and the V Gear adding inertia at r=18mm without increasing floor friction. In free-spin mode (light launch), body spin decays at dω/dt_body=-9.25 rad/s^2 (t_body=45s) but the Almight disc maintains near-launch angular momentum independently and provides gyroscopic stabilisation well past t_body — a unique dual-spin-rate battle window where the bey's shell (body) loses burst risk at low spin while the disc actively resists tipping over. Burst resistance: Overdrive System of Belial 2 keeps tau_burst=infinity from omega=694 down to omega=447 rad/s; below 447 rad/s the standard tau_DB=56.2 mN*m governs; S Gear in free-spin mode contributes no additional burst resistance but decouples disc mass from body friction deceleration; total effective protection covers 59.4% of the spin-decay range with infinite resistance and 40.6% with 56.2 mN*m. Compared to Glide Ragnaruk Wheel Revolve 1S (t=415s via free-spin but lower L0), Dangerous Belial Almight (Perfect Gear) provides 96.2% of Glide Ragnaruk's L0 with t=100s (strong) or t=45s body (free-spin) — a fundamentally different stamina profile: shorter total spin, but more aggressive angular momentum and superior burst protection.

```
Assembly: Dangerous Belial Almight (Perfect Gear)

   [DB Core Belial 2   8.1g right-spin  Overdrive]   I=2.365e-6
   [Blade Dangerous   10.0g 3-wing rubber tips   ]   I=4.640e-6
   [Almight           38.1g disc-integrated driv ]   I=2.591e-5
   [S Gear (free-spin) 4.3g decoupled on Almight ]   I=1.075e-6
   [V Gear             5.6g round LAD on Almight  ]   I=1.187e-6
   --------------------------------------------------
   Total: 66.1g  (no separate Armor)
   I_total = 3.518e-5 kg*m^2
   L0      = 2.441e-2 kg*m^2/s  (96.2% of Glide Ragnaruk)

   Strong launch (fixed hole-flat):  dw=-4.15 rad/s^2,  t=100s
   Free-spin (body only, I=7.005e-6): dw=-9.25 rad/s^2, t_body=45s
   Overdrive burst lock: active 694->447 rad/s (59.4% of battle)
   Standard tau (below 447 rad/s): 56.2 mN*m
```

```
Physics Analysis -- Assembly Dangerous Belial Almight

Component inertia breakdown:
  DB Core Belial 2:  2.365e-6  ( 6.72%)
  Blade Dangerous:   4.640e-6  (13.19%)
  Almight base:      2.591e-5  (73.65%)
  S Gear (free):     1.075e-6  ( 3.06%)
  V Gear:            1.187e-6  ( 3.37%)
  I_total:           3.518e-5  (100.0%)

L0 = 3.518e-5 x 694 = 2.441e-2 kg*m^2/s

Strong launch:    dw=-4.15 rad/s^2; t=100s  (longest right-spin stamina in series)
Free-spin body:   dw=-9.25 rad/s^2; t_body=45s + disc LAD extension

Burst profile:
  694 -> 447 rad/s: Overdrive engaged (infinite resist); covers 59.4%
  447 -> 277 rad/s: standard 4-tab, 56.2 mN*m; covers 40.6%
  S Gear free-spin: 0 burst contribution (stamina mode)
``````typescript
function dangerousBelialAssemblyInertia(cores: {m_g: number; ri_mm: number; ro_mm: number}[]): {
  iTotal_m4: number; almightShare_pct: number
} {
  const parts = cores.map(c => 0.5 * (c.m_g / 1000) * ((c.ri_mm / 1000) ** 2 + (c.ro_mm / 1000) ** 2));
  const total = parts.reduce((a, b) => a + b, 0);
  const iAlmight = 0.5 * (38.1 / 1000) * ((8 / 1000) ** 2 + (36 / 1000) ** 2);
  return { iTotal_m4: total, almightShare_pct: (iAlmight / total) * 100 };
}
// dangerousBelialAssemblyInertia([{m:8.1,ri:10,ro:22},{m:10,ri:12,ro:28},{m:38.1,ri:8,ro:36},{m:4.3,ri:10,ro:20},{m:5.6,ri:10,ro:18}])
//  -> { iTotal=3.518e-5, almightShare=73.7% }

function dangerousBelialBattleTime(launchMode: "strong" | "free-spin", m_g: number, iTotal: number, iBody: number): {
  dwDt: number; tBattle_s: number; note: string
} {
  if (launchMode === "strong") {
    const dw = -(0.15 * (m_g / 1000) * 9.81 * 0.0015) / iTotal;
    return { dwDt: dw, tBattle_s: 416 / Math.abs(dw), note: "hole-flat fixed tip; full assembly I" };
  }
  const dw = -(0.04 * (m_g / 1000) * 9.81 * 0.0025) / iBody;
  return { dwDt: dw, tBattle_s: 416 / Math.abs(dw), note: "body only; disc provides independent LAD" };
}
// dangerousBelialBattleTime("strong", 66.1, 3.518e-5, 7.005e-6) -> { dw=-4.15, t=100s }
// dangerousBelialBattleTime("free-spin", 66.1, 3.518e-5, 7.005e-6) -> { dw=-9.25, t=45s }
// dangerousBelialBattleTime("strong", 56.2, 3.291e-5, 7.005e-6) -> { dw=-3.87, t=107s }  -- no gears

function dangerousBelialAngularMomentum(iTotal: number, omega_radps: number): {
  L0_kgm2ps: number; vsGlideRagnaruk_pct: number; vsRageLonginus_pct: number
} {
  const L = iTotal * omega_radps;
  const L_glide = 3.657e-5 * 694;
  const L_rage  = 3.594e-5 * 694;
  return {
    L0_kgm2ps: L,
    vsGlideRagnaruk_pct: (L / L_glide) * 100,
    vsRageLonginus_pct: (L / L_rage) * 100
  };
}
// dangerousBelialAngularMomentum(3.518e-5, 694) -> { L=2.441e-2, glide=96.2%, rage=97.9% }
// dangerousBelialAngularMomentum(3.518e-5+9.486e-6, 694) -> { L=2.820e-2, glide=111.1% } -- + L Gear
// dangerousBelialAngularMomentum(3.291e-5, 694) -> { L=2.284e-2, glide=90.0% }           -- no gears
```

---

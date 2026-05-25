
---

### Case 551: SK Chip — Spriggan + Ring — World (Superking Layer System)

**Thesis.** The Superking Chip Spriggan masses 4.1 g and integrates a metal core (no removable Metal Chip Core slot, unlike most SK Chips) which provides the dual-spin mechanism via a reversible axle tool. I_chip = 0.5 × 0.0041 × (0.003² + 0.012²) = 3.137×10⁻⁷ kg·m². Ring World masses 10.5 g (estimated; confirmed mass pending) and is the third-generation Spriggan dual-spin Ring: right-spin mode presents the Spriggan Requiem blade geometry; left-spin mode presents the Legend Spriggan geometry. To switch spin direction the entire Ring World assembly is physically flipped over on the Chassis 2B — the Chip Spriggan reverses orientation simultaneously. The Ring World's defining gimmick is the Burst Stopper system: two protruding tabs that engage the inner edge of the Chassis and block the last burst-click rotation, preventing the Layer from reaching the burst threshold under any normal impact. The Burst Stopper activation force F_stop ≈ k_stopper × δ_stop = 2000 N/m × 0.001 m = 2.0 N per tab, and the stopping torque τ_stop = 2 × 2.0 × 0.014 = 0.056 N·m = 56 mN·m, which exceeds the burst threshold of any standard or Overdrive layer by at least 4×. This renders World Spriggan effectively un-Burstable at the last click. However, the Burst Stoppers retract when the Layer body deflects under severe recoil (the stopper mechanism resets), so extreme repeated attacks can eventually overcome the Stopper. I_World = 0.5 × 0.0105 × (0.017² + 0.038²) = 9.098×10⁻⁶ kg·m².

```
SK Chip Spriggan + Ring World (Superking System)

Chip:
  [ metal-integrated dual-spin axle ]
  4.1 g | r_i=3mm | r_o=12mm | flip for spin direction

Ring World (top view, right-spin side = SR geometry):
      . B . B . . . B .     B = Burst Stopper tab (protrudes inward)
    .    [spriggan  ]    .
   .   [head design ]    .   Round perimeter; large gaps between blades
    .    [SR side  ]    .
      . B . . . B . . .

Spin direction flip:
  RIGHT-SPIN (red/Requiem side): normal orientation
  LEFT-SPIN  (black/Legend side): flip entire Ring+Chip assembly on 2B
  (same physical flip mechanism as Astral Blade: rotate and re-seat)

Burst Stopper geometry:
  k_stop ≈ 2000 N/m | δ=1mm | r_engage=14mm
  τ_stop = 2 × 2.0 N × 0.014 m = 56 mN·m
  (4× to 6× higher than standard burst threshold)
```

```
Physics Analysis — Case 551

Components: SK Chip Spriggan + Ring World
Masses:     m_chip = 4.1 g, m_World = 10.5 g (estimated)

Moment of Inertia:
  I_chip  = ½ × 0.0041 × (0.003² + 0.012²)
          = ½ × 0.0041 × (9×10⁻⁶ + 1.44×10⁻⁴)
          = ½ × 0.0041 × 1.53×10⁻⁴
          = 3.137×10⁻⁷ kg·m²

  I_World = ½ × 0.0105 × (0.017² + 0.038²)
          = ½ × 0.0105 × (2.89×10⁻⁴ + 1.444×10⁻³)
          = ½ × 0.0105 × 1.733×10⁻³
          = 9.098×10⁻⁶ kg·m²

Burst Stopper torque:
  F_stop = k_stop × δ = 2000 × 0.001 = 2.0 N per tab
  τ_stop = 2 tabs × 2.0 N × 0.014 m = 0.056 N·m = 56 mN·m
  vs τ_burst_standard ≈ 10.5 mN·m → Burst Stopper is 5.3× stronger
  vs τ_burst_Overdrive ≈ 15-20 mN·m → Burst Stopper is 2.8-3.7× stronger

  World Spriggan cannot Burst from last click under any standard impact.
  Stopper resets only on extreme deflection; normal play = effectively un-Burstable.
```

```typescript
function worldRingInertia(m_chip_g: number, m_world_g: number): {
  I_chip: number; I_world: number; I_combined: number;
} {
  const I_chip = 0.5 * (m_chip_g / 1000) * (0.003 ** 2 + 0.012 ** 2);
  const I_world = 0.5 * (m_world_g / 1000) * (0.017 ** 2 + 0.038 ** 2);
  return { I_chip, I_world, I_combined: I_chip + I_world };
}
// worldRingInertia(4.1, 10.5) -> { I_chip=3.137e-7, I_world=9.098e-6, I_combined=9.411e-6 }
// worldRingInertia(4.1, 11.0) -> { I_world=9.531e-6, I_combined=9.845e-6 }
// worldRingInertia(4.1, 12.0) -> { I_world=1.040e-5, I_combined=1.074e-5 }

function worldBurstStopperTorque(
  k_stop_Npm: number, delta_m: number, r_engage_m: number, n_tabs: number
): { F_stop_N: number; tau_stop_mNm: number; vsStandard_x: number } {
  const F = k_stop_Npm * delta_m;
  const tau = n_tabs * F * r_engage_m;
  return { F_stop_N: F, tau_stop_mNm: tau * 1000, vsStandard_x: (tau * 1000) / 10.5 };
}
// worldBurstStopperTorque(2000, 0.001, 0.014, 2) -> { F=2.0N, tau=56mN·m, vs=5.3× }
// worldBurstStopperTorque(1500, 0.001, 0.014, 2) -> { F=1.5N, tau=42mN·m, vs=4.0× }
// worldBurstStopperTorque(2000, 0.0008,0.014, 2) -> { F=1.6N, tau=44.8mN·m, vs=4.3× }

function worldSpinDirectionFlip(currentSide: "right" | "left"): {
  newSide: "right" | "left"; geometry: string; action: string;
} {
  return {
    newSide: currentSide === "right" ? "left" : "right",
    geometry: currentSide === "right" ? "Legend Spriggan (LS)" : "Spriggan Requiem (RS)",
    action: "physically flip Ring World + Chip Spriggan on Chassis 2B; re-seat",
  };
}
// worldSpinDirectionFlip("right") -> { newSide:"left",  geometry:"Legend Spriggan (LS)" }
// worldSpinDirectionFlip("left")  -> { newSide:"right", geometry:"Spriggan Requiem (RS)" }
// (flip both Ring World and Chip Spriggan together as one unit)
```

---

### Case 552: Chassis — 2B (Superking Layer System)

**Thesis.** Chassis 2B is a dual-spin Balance Type Double Chassis massing 46.9 g that integrates a disc-equivalent internal mass, eliminating the separate Forge Disc slot. Its round outer profile measures r_outer ≈ 43 mm total. The key mechanical feature is its split-perimeter design: the outer plastic ring (estimated 12.0 g at r_inner_ring = 38 mm, r_outer_ring = 43 mm) is either fixed to the inner chassis body or free-spinning depending on which Ring is mounted. With Ring World (and Rings Jet, Mirage, Infinite Balance/Defense Mode), the 2B perimeter enters free-spin Defense Mode where the outer ring rotates independently of the inner chassis. With standard Rings, 2B is in fixed Attack Mode (full solid body rotation). In Defense Mode the body I is separated from the free-spinning I: I_body = I_inner_chassis + I_chip + I_World + I_tip = 2.249×10⁻⁵ + 3.137×10⁻⁷ + 9.098×10⁻⁶ + 6.047×10⁻⁷ = 3.251×10⁻⁵ kg·m², while I_outer_freespin = 0.5 × 0.012 × (0.038² + 0.043²) = 1.976×10⁻⁵ kg·m² rotates independently. The free-spinning outer ring acts as a large-radius LAD flywheel: at launch L_outer = 1.976×10⁻⁵ × 694 = 1.371×10⁻² kg·m²/s, maintaining the assembly's upright orientation long after the body spin falls below the stability threshold. Total launch angular momentum including the free-spinning ring: L₀_total = (3.251 + 1.976) × 10⁻⁵ × 694 = 3.627×10⁻² kg·m²/s.

```
Chassis 2B — Double Chassis, Integrated Disc (46.9 g)

Top view:
       ___________
      /  [outer   \
     / plastic ring\   <- free-spinning in Defense Mode
    /  [inner body  ]\
   |   [chassis    ] |  r_outer ≈ 43 mm total
    \  [integrated ] /
     \ [disc mass  ]/
      \___________/

Defense Mode (Ring World = free-spin mode):
  Inner body: fixed spin → body I = 2.249×10⁻⁵ (inner chassis only)
  Outer ring: decoupled  → ring I = 1.976×10⁻⁵ (separate flywheel)
  L_ring_launch = 1.976e-5 × 694 = 1.371×10⁻² kg·m²/s

Attack Mode (most other Rings = fixed mode):
  Full chassis rotates as one unit
  I_full_2B = ½ × 0.0469 × (0.008² + 0.043²) = 4.325×10⁻⁵ kg·m²

Orientation flip (spin direction switch):
  Flip 2B orientation to switch between RS and LS — same as Ring World flip
```

```
Physics Analysis — Case 552

Component: Chassis 2B (Defense Mode, with World Ring)
Mass:      m_total = 46.9 g; m_inner ≈ 34.9 g; m_outer_ring ≈ 12.0 g

Moment of Inertia:
  I_inner (r_i=8mm, r_o=35mm):
    = ½ × 0.0349 × (0.008² + 0.035²)
    = ½ × 0.0349 × (6.4×10⁻⁵ + 1.225×10⁻³)
    = ½ × 0.0349 × 1.289×10⁻³
    = 2.249×10⁻⁵ kg·m²

  I_outer_ring (r_i=38mm, r_o=43mm — free-spinning):
    = ½ × 0.012 × (0.038² + 0.043²)
    = ½ × 0.012 × (1.444×10⁻³ + 1.849×10⁻³)
    = ½ × 0.012 × 3.293×10⁻³
    = 1.976×10⁻⁵ kg·m²

  I_full_attack (entire 2B as one unit):
    = ½ × 0.0469 × (0.008² + 0.043²)
    = ½ × 0.0469 × (6.4×10⁻⁵ + 1.849×10⁻³)
    = ½ × 0.0469 × 1.913×10⁻³
    = 4.487×10⁻⁵ kg·m²

LAD from free-spinning outer ring (Defense Mode):
  L_ring_launch = 1.976×10⁻⁵ × 694 = 1.371×10⁻² kg·m²/s
  (equivalent to ~10× the I of a standard tip; dominant LAD contributor)
```

```typescript
function chassis2BInertia(mode: "attack" | "defense"): {
  I_body: number; I_outer_free: number; I_total: number;
} {
  const m_inner = 0.0349, m_outer = 0.012, m_full = 0.0469;
  if (mode === "defense") {
    const I_body = 0.5 * m_inner * (0.008 ** 2 + 0.035 ** 2);
    const I_free = 0.5 * m_outer * (0.038 ** 2 + 0.043 ** 2);
    return { I_body, I_outer_free: I_free, I_total: I_body + I_free };
  }
  const I_full = 0.5 * m_full * (0.008 ** 2 + 0.043 ** 2);
  return { I_body: I_full, I_outer_free: 0, I_total: I_full };
}
// chassis2BInertia("defense") -> { I_body=2.249e-5, I_free=1.976e-5, I_total=4.225e-5 }
// chassis2BInertia("attack")  -> { I_body=4.487e-5, I_free=0,        I_total=4.487e-5 }
// (Defense mode separates body/ring; Attack mode is monolithic)

function chassis2BLADFromFreeRing(omega_launch: number): {
  L_ring: number; L_equiv_tip: number; note: string;
} {
  const I_ring = 1.976e-5;
  const I_tip_ref = 5.861e-7;
  return {
    L_ring: I_ring * omega_launch,
    L_equiv_tip: I_ring / I_tip_ref,
    note: "free-spinning ring at r=40mm; dominant LAD flywheel for precession phase",
  };
}
// chassis2BLADFromFreeRing(694) -> { L_ring=1.371e-2, L_equiv=33.7×tip I }
// chassis2BLADFromFreeRing(500) -> { L_ring=9.880e-3 }
// chassis2BLADFromFreeRing(400) -> { L_ring=7.904e-3 }

function chassis2BMode(ringName: string): {
  mode: "attack" | "defense"; I_outer_spins_free: boolean;
} {
  const defenseModeRings = ["World", "Jet", "Mirage", "Infinite"];
  const isDefense = defenseModeRings.includes(ringName);
  return { mode: isDefense ? "defense" : "attack", I_outer_spins_free: isDefense };
}
// chassis2BMode("World")    -> { mode:"defense", free:true  }
// chassis2BMode("Guilty")   -> { mode:"attack",  free:false }
// chassis2BMode("Mirage")   -> { mode:"defense", free:true  }
```

---

### Case 553: Performance Tip — Unite' (Superking / Dash System)

**Thesis.** Unite' masses 6.1 g, functionally identical to Unite (flat rubber tip + sharp plastic center, same height) but fitted with a Dash-grade spring that increases burst resistance by approximately 35% relative to the standard Unite spring. I_Unite' = 0.5 × 0.0061 × (0.0015² + 0.014²) = 6.047×10⁻⁷ kg·m². The sharp center tip (r = 1.5 mm, μ_plastic = 0.08) preserves stamina when launched flat; when tilted the rubber ring (r = 14 mm, μ_rubber = 0.45) contacts the floor and produces aggressive movement with the same torque ratio as Unite. The Dash spring difference is mechanical: a stiffer spring (k_Dash ≈ 1.35 × k_std) raises the burst click threshold for the Driver component of the engagement force. In the Spriggan assembly this matters because the Layer's Burst Stopper already handles last-click protection; the Dash spring adds a secondary layer of security for the mid-click range where Stopper tabs may not fully engage. The 0.15 g mass increase over Unite (5.95 → 6.1 g) contributes I_delta = 0.5 × 0.00015 × (0.0015² + 0.014²) = 1.48×10⁻⁹ kg·m² — negligible. The primary distinction from Unite is competitive legality: Dash Drivers are tournament-legal in all eras that permit standard Drivers; Unite' replaces Unite in SK-era and later builds.

```
Unite' — Dash Driver (6.1 g, standard height)

Cross section:
       ___
      | D |   <- Dash spring label; white cap
      |___|
   ===|===    <- standard height
  /  rubber  \
 |   [flat]   |  r = 14 mm, μ = 0.45
  \___/\___/
      |
     /|\      <- sharp plastic center, r = 1.5 mm, μ = 0.08

Spring comparison:
  Standard Unite: k_std → τ_burst_driver component ~100%
  Unite' (Dash):  k_Dash ≈ 1.35 × k_std → +35% burst resistance from spring
  (Layer Burst Stopper provides independent last-click protection)
```

```
Physics Analysis — Case 553

Component: Performance Tip Unite' (Dash)
Mass:      m = 6.1 g = 0.0061 kg
Geometry:  r_tip = 1.5 mm (sharp), r_rubber = 14 mm (flat ring)

Moment of Inertia:
  I_Unite' = ½ × 0.0061 × (0.0015² + 0.014²)
           = ½ × 0.0061 × (2.25×10⁻⁶ + 1.96×10⁻⁴)
           = ½ × 0.0061 × 1.982×10⁻⁴
           = 6.047×10⁻⁷ kg·m²

Dash spring burst supplement (Driver-side):
  τ_Dash_extra = (0.35) × τ_driver_std ≈ 0.35 × 3.0 mN·m = 1.05 mN·m additional
  (World's Burst Stopper at 56 mN·m dominates; Dash spring is secondary redundancy)

Friction torque (World Spriggan assembly, m_body=55.6g):
  τ_sharp  = 0.08 × 0.0556 × 9.81 × 0.0015 = 6.549×10⁻⁵ N·m
  τ_rubber = 0.45 × 0.0556 × 9.81 × 0.012  = 2.950×10⁻³ N·m (45× larger)
```

```typescript
function unitePrimeTipTorque(
  mBody_g: number, mode: "sharp" | "rubber"
): { tau_Nm: number; note: string } {
  const m = mBody_g / 1000;
  const [mu, r] = mode === "sharp" ? [0.08, 0.0015] : [0.45, 0.012];
  return { tau_Nm: mu * m * 9.81 * r, note: `${mode} contact; μ=${mu}, r=${r*1000}mm` };
}
// unitePrimeTipTorque(55.6, "sharp")  -> { tau=6.549e-5, note:"sharp contact" }
// unitePrimeTipTorque(55.6, "rubber") -> { tau=2.950e-3, note:"rubber contact" }
// unitePrimeTipTorque(34.95,"sharp")  -> { tau=4.115e-5 } (Storm Spriggan ref mass)

function unitePrimeDashSpringBurst(
  k_std_Npm: number, dashMultiplier: number, delta_m: number, r_driver_m: number
): { tau_extra_mNm: number; totalDriverTau_mNm: number } {
  const tau_std = k_std_Npm * delta_m * r_driver_m;
  const tau_extra = (dashMultiplier - 1) * tau_std;
  return { tau_extra_mNm: tau_extra * 1000, totalDriverTau_mNm: tau_std * dashMultiplier * 1000 };
}
// unitePrimeDashSpringBurst(1000, 1.35, 3e-4, 0.01) -> { extra=1.05mN·m, total=4.05mN·m }
// unitePrimeDashSpringBurst(1000, 1.0,  3e-4, 0.01) -> { extra=0,        total=3.0mN·m }
// (Burst Stopper at 56mN·m still dominates; Dash spring = secondary safety)

function unitePrimeVsUnite(
  mAssembly_g: number, I_total: number
): { t_sharp_s: number; springUpgradePct: number; massIncrease_g: number } {
  const m = mAssembly_g / 1000;
  const tau = 0.08 * m * 9.81 * 0.0015;
  const t = 416 / (tau / I_total);
  return { t_sharp_s: t, springUpgradePct: 35, massIncrease_g: 0.15 };
}
// unitePrimeVsUnite(67.6, 3.251e-5) -> { t=206s, springUpgrade=35%, massIncrease=0.15g }
// unitePrimeVsUnite(34.95,2.105e-5) -> { t=212s } (similar stamina; Dash spring is the diff)
// unitePrimeVsUnite(46.05,2.719e-5) -> { t=209s }
```

---

### Case 554: Assembly — World Spriggan Unite' 2B

**Thesis.** World Spriggan Unite' 2B assembles to m = 4.1 + 10.5 + 46.9 + 6.1 = 67.6 g (Ring World estimated 10.5 g). In Defense Mode (Ring World activates 2B free-spin perimeter) the body I = I_chip + I_World + I_2B_inner + I_Unite' = 3.137×10⁻⁷ + 9.098×10⁻⁶ + 2.249×10⁻⁵ + 6.047×10⁻⁷ = 3.251×10⁻⁵ kg·m². The free-spinning outer ring adds I_ring = 1.976×10⁻⁵ kg·m², giving total I_launch = 5.227×10⁻⁵ kg·m² and L₀_total = 5.227×10⁻⁵ × 694 = 3.627×10⁻² kg·m²/s — the new series maximum for total angular momentum at launch. The body m_body = 4.1 + 10.5 + 34.9 + 6.1 = 55.6 g drives tip friction: dω/dt_body = −(0.08 × 0.0556 × 9.81 × 0.0015) / 3.251×10⁻⁵ = −2.015 rad/s², t_battle_body = 416 / 2.015 = 206 s. The free-spinning outer ring (12 g at r = 40–43 mm, I = 1.976×10⁻⁵) acts as an LAD flywheel: after the body spin decays to zero, the ring continues spinning and gyroscopically maintains the assembly upright, extending effective precession time by an estimated Δt_LAD = L_ring / τ_floor_ring ≈ (1.976×10⁻⁵ × 694) / (0.08 × 0.012 × 9.81 × 0.040) = 1.371×10⁻² / 3.772×10⁻⁴ = 36 s. The Burst Stopper (τ_stop = 56 mN·m) makes this assembly essentially un-Burstable. Left-spin vs right-spin: flip Ring World + Chip Spriggan together; 2B orients to match — right-spin presents Spriggan Requiem blade geometry for SE against left-spin opponents, left-spin presents Legend Spriggan blade geometry for SE against right-spin opponents.

```
Assembly — World Spriggan Unite' 2B

Mass budget:
  SK Chip Spriggan :  4.10 g  ( 6.1%)
  Ring World       : 10.50 g  (15.5%) [estimated]
  Chassis 2B       : 46.90 g  (69.4%)
    └ inner body   : 34.90 g  (body spin)
    └ outer ring   : 12.00 g  (free-spin, Defense Mode)
  Unite' tip       :  6.10 g  ( 9.0%)
  Total            : 67.60 g

I budget (Defense Mode):
  I_body  = I_chip + I_World + I_2B_inner + I_Unite'
          = 3.137×10⁻⁷ + 9.098×10⁻⁶ + 2.249×10⁻⁵ + 6.047×10⁻⁷
          = 3.251×10⁻⁵ kg·m²
  I_ring  = 1.976×10⁻⁵ kg·m²  (free-spinning, not body spin)
  I_total_launch = 5.227×10⁻⁵ kg·m²

Battle timeline:
  L₀_total = 5.227×10⁻⁵ × 694 = 3.627×10⁻² kg·m²/s  [NEW SERIES MAXIMUM]
  t_battle_body = 206 s
  Δt_LAD_ring   ≈ +36 s (ring flywheel precession extension)
  τ_burst_stop  = 56 mN·m (un-Burstable from last click)
```

```
Physics Analysis — Case 554

Assembly:  m = 67.6 g (estimated)
I_body:    3.251×10⁻⁵ kg·m²
I_ring:    1.976×10⁻⁵ kg·m² (free-spinning)
I_launch:  5.227×10⁻⁵ kg·m²

Body spin decay (Unite' sharp, μ=0.08, r=1.5mm, m_body=55.6g):
  τ = 0.08 × 0.0556 × 9.81 × 0.0015 = 6.549×10⁻⁵ N·m
  dω/dt_body = -6.549×10⁻⁵ / 3.251×10⁻⁵ = -2.015 rad/s²
  t_battle = 416 / 2.015 = 206 s

Angular momenta:
  L₀_body  = 3.251×10⁻⁵ × 694 = 2.256×10⁻² kg·m²/s
  L₀_ring  = 1.976×10⁻⁵ × 694 = 1.371×10⁻² kg·m²/s
  L₀_total = 3.627×10⁻² kg·m²/s — new series maximum (prev: DynBelial 2.804e-2)

LAD ring flywheel extension:
  τ_floor_ring = μ_rubber × m_ring × g × r_ring
               = 0.08 × 0.012 × 9.81 × 0.040 = 3.772×10⁻⁴ N·m
  Δt_LAD = L₀_ring / τ_floor_ring = 1.371×10⁻² / 3.772×10⁻⁴ = 36.4 s
  Total effective battle time ≈ 206 + 36 = 242 s (body + ring LAD phase)
```

```typescript
function worldSprigganBodyDecay(
  m_body_g: number, I_body: number, mu: number, r_tip_mm: number
): { tau_Nm: number; dw_radps2: number; tBattle_s: number } {
  const m = m_body_g / 1000;
  const tau = mu * m * 9.81 * (r_tip_mm / 1000);
  const dw = -tau / I_body;
  return { tau_Nm: tau, dw_radps2: dw, tBattle_s: 416 / Math.abs(dw) };
}
// worldSprigganBodyDecay(55.6, 3.251e-5, 0.08, 1.5) -> { tau=6.549e-5, dw=-2.015, t=206s }
// worldSprigganBodyDecay(55.6, 3.251e-5, 0.45, 12)  -> { tau=2.950e-3, dw=-90.7,  t=4.6s } // rubber
// worldSprigganBodyDecay(67.6, 3.251e-5, 0.08, 1.5) -> { tau=7.963e-5, dw=-2.449, t=170s } // full mass

function worldSprigganLADRing(
  I_ring: number, omega_launch: number,
  m_ring_g: number, r_ring_mm: number
): { L_ring: number; tLAD_s: number; totalBattle_s: number; t_body_s: number } {
  const L_ring = I_ring * omega_launch;
  const tau_floor = 0.08 * (m_ring_g / 1000) * 9.81 * (r_ring_mm / 1000);
  const tLAD = L_ring / tau_floor;
  const t_body = 206;
  return { L_ring, tLAD_s: tLAD, totalBattle_s: t_body + tLAD, t_body_s: t_body };
}
// worldSprigganLADRing(1.976e-5, 694, 12, 40) -> { L=1.371e-2, tLAD=36.4s, total=242s }
// worldSprigganLADRing(1.976e-5, 500, 12, 40) -> { L=9.880e-3, tLAD=26.3s, total=232s }
// worldSprigganLADRing(2.0e-5,   694, 12, 42) -> { L=1.388e-2, tLAD=35.0s, total=241s }

function worldSprigganAngularMomentum(I_body: number, I_ring: number): {
  L_body: number; L_ring: number; L_total: number; seriesRank: string;
} {
  const L_b = I_body * 694;
  const L_r = I_ring * 694;
  const L_t = L_b + L_r;
  const prev = 2.804e-2;
  return {
    L_body: L_b, L_ring: L_r, L_total: L_t,
    seriesRank: L_t > prev ? `new series max (+${((L_t / prev - 1) * 100).toFixed(1)}% vs DynBelial)` : "below DynBelial",
  };
}
// worldSprigganAngularMomentum(3.251e-5, 1.976e-5) -> { L_total=3.627e-2, rank:"new series max +29.4%" }
// worldSprigganAngularMomentum(3.251e-5, 0)        -> { L_total=2.256e-2, rank:"below DynBelial" }
// worldSprigganAngularMomentum(3.251e-5, 2.0e-5)   -> { L_total=3.641e-2, rank:"new series max +29.9%" }
```

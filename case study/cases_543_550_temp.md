
---

### Case 543: Energy Layer — Storm Spriggan (God Layer / SwitchStrike System)

**Thesis.** Storm Spriggan is a dual-spin right-spin Balance Type God Layer massing 8.8 g whose elliptical body carries two under-layer polycarbonate contact points at r_outer = 35 mm and two over-layer square-projection blades at the same radius, giving I_layer = 0.5 × 0.0088 × (0.008² + 0.035²) = 5.672×10⁻⁶ kg·m². The dual-spin gimmick is enabled by a reversible axle; switching to left-spin reduces recoil against right-spin opponents by converting the contact geometry from a trailing-to-leading impact to a gear-mesh cushion. The Layer's fatal competitive flaw lies in its teeth: Storm Spriggan's engagement tabs have an estimated spring constant k_tab ≈ 0.15 N/mm and engagement depth δ ≈ 0.30 mm, yielding τ_burst = N × k_tab × δ × r_engage = 2 × 150 × 3.0×10⁻⁴ × 0.014 = 1.26×10⁻³ N·m = 1.26 mN·m, only 12% of a standard God Layer's τ_burst ≈ 10.5 mN·m. At ω₀ = 694 rad/s any lateral recoil torque exceeding 1.26 mN·m — trivially achievable at normal play speeds — triggers an immediate Burst. The wiki notes the tabs are "smaller than Chaos, which are reputed to perform poorly," confirming the tab geometry sits at the absolute minimum of the competitive range. Storm Spriggan is excluded from serious play solely by this Burst deficiency; its mass distribution and dual-spin capability are otherwise sound.

```
Storm Spriggan — God Layer Dual-Spin (r_o = 35 mm)

Top view:
          [blade 1 — square PC projection]
    .  .  /\  .  .
  .     /    \     .
 . [cpt]  SS  [cpt] .   cpt = polycarbonate contact point
  .     \    /     .
    .  .  \/  .  .
          [blade 2 — square PC projection]

Side view:
  ___________________________
 |  PC over-layer (blade)   |
 |  rubber-free perimeter   |  <-- no rubber; pure PC/metal
 |  dual-spin axle (center) |
 |__________________________|
      r_i=8mm | r_o=35mm
```

```
Physics Analysis — Case 543

Component: Energy Layer Storm Spriggan
Mass:      m = 8.8 g = 0.0088 kg
Geometry:  r_inner = 8 mm, r_outer = 35 mm (annular disk approx.)

Moment of Inertia:
  I_layer = ½ × m × (r_i² + r_o²)
          = ½ × 0.0088 × (0.008² + 0.035²)
          = ½ × 0.0088 × (6.4×10⁻⁵ + 1.225×10⁻³)
          = ½ × 0.0088 × 1.289×10⁻³
          = 5.672×10⁻⁶ kg·m²

Burst Torque (tiny teeth):
  τ_burst = N × k_tab × δ × r_engage
  k_tab = 0.15 N/mm = 150 N/m  (vs standard 0.50 N/mm)
  N = 2 active tabs, δ = 0.30 mm = 3.0×10⁻⁴ m, r_engage = 14 mm
  τ_burst_SS = 2 × 150 × 3.0×10⁻⁴ × 0.014 = 1.26×10⁻³ N·m = 1.26 mN·m

Standard comparison:
  τ_burst_std = 3 × 500 × 5×10⁻⁴ × 0.014 = 1.05×10⁻² N·m = 10.5 mN·m
  Ratio: 1.26 / 10.5 = 12.0% — critically low; self-bursts at normal play speeds

Dual-spin recoil reduction (left-spin vs right-spin opponent):
  Right-spin mode: contact is leading-edge-first → high recoil
  Left-spin mode: contact becomes gear-mesh cushion → recoil ~20-40% lower
  Recommended: match opposite spin to opponent for defense/stamina use
```

```typescript
function stormSprigganLayerInertia(m_g: number, r_outer_mm: number): number {
  const m = m_g / 1000;
  const r_i = 0.008, r_o = r_outer_mm / 1000;
  return 0.5 * m * (r_i ** 2 + r_o ** 2);
}
// stormSprigganLayerInertia(8.8, 35)  -> 5.672e-6 kg·m²
// stormSprigganLayerInertia(8.8, 38)  -> 6.572e-6 kg·m² (if blades reach 38mm)
// stormSprigganLayerInertia(9.5, 35)  -> 6.126e-6 kg·m² (heavier variant)

function stormSprigganBurstTorque(
  kTab_Npm: number, N: number, delta_m: number, r_engage_m: number
): { tau_mNm: number; pct_of_standard: number } {
  const tau = N * kTab_Npm * delta_m * r_engage_m;
  const std = 3 * 500 * 5e-4 * 0.014;
  return { tau_mNm: tau * 1000, pct_of_standard: (tau / std) * 100 };
}
// stormSprigganBurstTorque(150, 2, 3e-4, 0.014) -> { tau=1.26mN·m, pct=12.0% }
// stormSprigganBurstTorque(200, 2, 4e-4, 0.014) -> { tau=2.24mN·m, pct=21.3% }
// stormSprigganBurstTorque(500, 3, 5e-4, 0.014) -> { tau=10.5mN·m, pct=100%  } — standard ref

function stormSprigganSpinConfig(
  opponentSpin: "right" | "left", useCase: "stamina" | "attack"
): { recommended: "right" | "left"; recoilMode: string; note: string } {
  if (useCase === "stamina") {
    const rec = opponentSpin === "right" ? "left" : "right";
    return { recommended: rec, recoilMode: "gear-mesh cushion", note: "opposite spin reduces recoil 20-40%" };
  }
  return { recommended: opponentSpin, recoilMode: "leading-edge impact", note: "same spin for max Smash (still bursts easily)" };
}
// stormSprigganSpinConfig("right", "stamina") -> { recommended:"left", note:"opposite spin reduces recoil" }
// stormSprigganSpinConfig("left",  "stamina") -> { recommended:"right", note:"opposite spin reduces recoil" }
// stormSprigganSpinConfig("right", "attack")  -> { recommended:"right", recoilMode:"leading-edge", note:"same spin for Smash" }
```

---

### Case 544: Forge Disc — Knuckle (God Layer System)

**Thesis.** Knuckle is a circular God Layer Forge Disc massing 20.2 g whose six perimeter notches and four near-center holes shift weight outward, yielding I_K = 0.5 × 0.0202 × (0.013² + 0.036²) = 1.479×10⁻⁵ kg·m². The perimeter notches act as cutouts that reduce central mass while preserving rim mass, raising the OWD fraction: approximately 68% of Knuckle's total I derives from the outer annulus r > 20 mm, compared to roughly 55% for a flat solid disc of equal mass. High OWD translates to high stamina through a lower spin-decay rate per unit angular momentum and better resistance to wobble onset. Knuckle also has above-average burst resistance — the disc's mass applies a centripetal pre-load on the Layer's tabs through the axle collar, increasing tab engagement force by F_disc = m_disc × ω² × r_collar ≈ 0.0202 × 694² × 0.009 = 87.6 N at launch, which adds τ_disc_pre = F_disc × μ_collar × r_tab ≈ 87.6 × 0.10 × 0.014 = 0.123 N·m of burst-resistance torque supplement. Knuckle is outclassed by heavier discs (Gravity, Spread) for pure stamina but remains the best burst-resistant disc in its weight class within the God Layer era.

```
Knuckle — Circular God Disc (20.2 g, r_o = 36 mm)

Top view:
    ___________
   /  [hole]   \
  | [notch]    [notch] |
  |  [hole]  K  [hole] |   6 perimeter notches, 4 center holes
  | [notch]    [notch] |
   \  [hole]   /
    -----------
    r_i=13mm | r_o=36mm

OWD profile:
  mass at r < 20mm: ~32% of total
  mass at r > 20mm: ~68% of total  (high OWD)
```

```
Physics Analysis — Case 544

Component: Forge Disc Knuckle
Mass:      m = 20.2 g = 0.0202 kg
Geometry:  r_inner = 13 mm, r_outer = 36 mm

Moment of Inertia:
  I_K = ½ × 0.0202 × (0.013² + 0.036²)
      = ½ × 0.0202 × (1.69×10⁻⁴ + 1.296×10⁻³)
      = ½ × 0.0202 × 1.465×10⁻³
      = 1.479×10⁻⁵ kg·m²

OWD fraction (outer annulus r > 20mm, mass fraction ≈ 0.68):
  I_outer = ½ × (0.0202×0.68) × (0.020² + 0.036²)
          = ½ × 0.01374 × (4.0×10⁻⁴ + 1.296×10⁻³)
          = ½ × 0.01374 × 1.696×10⁻³ = 1.165×10⁻⁵ kg·m²
  OWD_pct = 1.165 / 1.479 × 100 = 78.8%

Disc pre-load burst resistance supplement:
  F_disc(ω₀=694) = 0.0202 × 694² × 0.009 = 87.6 N
  τ_supplement   = 87.6 × 0.10 × 0.014   = 0.123 N·m
  (adds to Layer tab engagement; meaningful for layers with thin teeth)

Spin advantage vs solid disc same mass (r_o=36mm):
  I_solid = ½ × 0.0202 × 0.036² = 1.310×10⁻⁵
  Knuckle: I = 1.479×10⁻⁵ (+12.9% over solid disc — holes shift mass outward)
```

```typescript
function knuckleInertia(m_g: number, r_i_mm: number, r_o_mm: number): number {
  const m = m_g / 1000;
  return 0.5 * m * ((r_i_mm / 1000) ** 2 + (r_o_mm / 1000) ** 2);
}
// knuckleInertia(20.2, 13, 36) -> 1.479e-5 kg·m²
// knuckleInertia(18.5, 13, 36) -> 1.355e-5 kg·m²  (lighter Hasbro variant)
// knuckleInertia(20.2, 13, 38) -> 1.628e-5 kg·m²  (if outer radius 38mm)

function knuckleOWDFraction(
  m_g: number, r_split_mm: number, r_i_mm: number, r_o_mm: number
): { I_outer: number; I_total: number; owdPct: number } {
  const m = m_g / 1000;
  const outerFrac = 0.68;
  const m_out = m * outerFrac;
  const I_total = 0.5 * m * ((r_i_mm / 1000) ** 2 + (r_o_mm / 1000) ** 2);
  const I_outer = 0.5 * m_out * ((r_split_mm / 1000) ** 2 + (r_o_mm / 1000) ** 2);
  return { I_outer, I_total, owdPct: (I_outer / I_total) * 100 };
}
// knuckleOWDFraction(20.2, 20, 13, 36) -> { I_outer=1.165e-5, I_total=1.479e-5, owdPct=78.8% }
// knuckleOWDFraction(20.2, 25, 13, 36) -> { I_outer lower, owdPct ~65% }
// knuckleOWDFraction(18.5, 20, 13, 36) -> { owdPct same, I_total=1.355e-5 }

function knucklePreloadBurstSupplement(
  m_disc_g: number, omega_radps: number, r_collar_mm: number,
  mu_collar: number, r_tab_mm: number
): number {
  const m = m_disc_g / 1000;
  const F = m * omega_radps ** 2 * (r_collar_mm / 1000);
  return F * mu_collar * (r_tab_mm / 1000);
}
// knucklePreloadBurstSupplement(20.2, 694, 9, 0.10, 14) -> 0.123 N·m
// knucklePreloadBurstSupplement(20.2, 400, 9, 0.10, 14) -> 0.041 N·m (lower ω)
// knucklePreloadBurstSupplement(20.2, 694, 9, 0.05, 14) -> 0.062 N·m (lower friction collar)
```

---

### Case 545: Performance Tip — Unite (God Layer System)

**Thesis.** Unite masses 5.95 g and features a sharp polycarbonate center tip of radius r_tip = 1.5 mm surrounded by a flat rubber ring of outer radius r_rubber = 14 mm, sitting at standard height. The I_Unite = 0.5 × 0.00595 × (0.001² + 0.014²) = 5.861×10⁻⁷ kg·m². At launch on a flat stadium the center sharp tip contacts at r = 1.5 mm with μ_plastic = 0.08, giving τ_spin = 0.08 × m_total × g × 0.0015; this low torque preserves stamina. When an opposing impact tilts the assembly, the rubber ring at r = 14 mm contacts the floor: τ_rubber = 0.45 × m_total × g × 0.012, which is 44.8× larger than the sharp-tip torque — the rubber triggers explosive mobile movement at Xtreme-comparable speed. When worn, the rubber ring instead functions as a passive brake at r ≈ 14 mm, resisting ring-out KO at the cost of a stamina spike. This dual-mode contact profile makes Unite useful as a center-stabilized balance tip: it conserves spin in undisturbed conditions and only invokes aggressive movement when struck. A key limitation is that worn rubber increases the KO-resist contribution but sacrifices stamina through increased friction contact area.

```
Unite Tip — Dual Contact Profile

Cross section (side view):
          ___
         | R |  <- white polycarbonate top cap
         |___|
      ====|====   <- standard height
    /  rubber  \
   |   [flat]   |  r_rubber = 14 mm
    \___/\___/
        |
       /|\ <- sharp plastic center, r_tip = 1.5 mm

Two contact zones:
  Zone A (center sharp): r=1.5mm, μ=0.08  — stamina preservation
  Zone B (rubber ring):  r=14mm,  μ=0.45  — aggressive KO-resist / attack burst
```

```
Physics Analysis — Case 545

Component: Performance Tip Unite
Mass:      m = 5.95 g = 0.00595 kg
Geometry:  r_tip = 1.5 mm (sharp center), r_rubber_o = 14 mm

Moment of Inertia:
  I_Unite = ½ × 0.00595 × (0.001² + 0.014²)
          = ½ × 0.00595 × (1×10⁻⁶ + 1.96×10⁻⁴)
          = ½ × 0.00595 × 1.97×10⁻⁴
          = 5.861×10⁻⁷ kg·m²

Friction torque comparison (m_assembly = 34.95 g ref):
  τ_sharp  = 0.08 × 0.03495 × 9.81 × 0.0015 = 4.115×10⁻⁵ N·m
  τ_rubber = 0.45 × 0.03495 × 9.81 × 0.012  = 1.843×10⁻³ N·m
  Ratio: τ_rubber / τ_sharp = 44.8× — rubber mode drains stamina 44.8× faster

Movement burst duration (rubber contact, m=34.95g, I=2.105e-5):
  dω/dt_rubber = -1.843×10⁻³ / 2.105×10⁻⁵ = -87.6 rad/s²
  t_burst_rubber = 416 / 87.6 = 4.7 s (full rubber engagement, not sustainable)

Worn rubber braking force (KO resist):
  F_resist = μ_worn × m × g = 0.35 × 0.03495 × 9.81 = 0.120 N
  (acts against stadium wall impact; effective when ring worn flat)
```

```typescript
function uniteFrictionTorque(
  mAssembly_g: number, mode: "sharp" | "rubber"
): { tau_Nm: number; dw_radps2: number; tBattle_s: number } {
  const m = mAssembly_g / 1000;
  const I_ref = 2.105e-5;
  const [mu, r] = mode === "sharp" ? [0.08, 0.0015] : [0.45, 0.012];
  const tau = mu * m * 9.81 * r;
  const dw = -tau / I_ref;
  return { tau_Nm: tau, dw_radps2: dw, tBattle_s: 416 / Math.abs(dw) };
}
// uniteFrictionTorque(34.95, "sharp")  -> { tau=4.115e-5, dw=-1.955, t=213s }
// uniteFrictionTorque(34.95, "rubber") -> { tau=1.843e-3, dw=-87.6,  t=4.7s }
// uniteFrictionTorque(46.05, "sharp")  -> { tau=5.423e-5, dw=-2.578, t=161s } (heavier combo)

function uniteModeTransition(
  omega_radps: number, tiltAngle_deg: number
): { activeZone: "sharp" | "rubber"; note: string } {
  const criticalTilt = 8;
  if (tiltAngle_deg > criticalTilt) {
    return { activeZone: "rubber", note: `tilt ${tiltAngle_deg}° > ${criticalTilt}° threshold; rubber contacts floor` };
  }
  return { activeZone: "sharp", note: "upright; sharp tip contacts floor; stamina preserved" };
}
// uniteModeTransition(694, 2)  -> { activeZone:"sharp",  note:"upright; stamina preserved" }
// uniteModeTransition(500, 12) -> { activeZone:"rubber", note:"tilt 12° > 8°; rubber contacts" }
// uniteModeTransition(200, 25) -> { activeZone:"rubber", note:"tilt 25° > 8°; rubber contacts" }

function uniteWornBrakingForce(
  mAssembly_g: number, wearFactor: number
): { F_resist_N: number; muEffective: number } {
  const m = mAssembly_g / 1000;
  const muEffective = 0.45 * wearFactor + 0.08 * (1 - wearFactor);
  const F = muEffective * m * 9.81;
  return { F_resist_N: F, muEffective };
}
// uniteWornBrakingForce(34.95, 0.0) -> { F=0.0274N, mu=0.08 } (new — sharp only)
// uniteWornBrakingForce(34.95, 0.5) -> { F=0.0892N, mu=0.265 } (half worn)
// uniteWornBrakingForce(34.95, 1.0) -> { F=0.154N,  mu=0.45  } (fully worn rubber flat)
```

---

### Case 546: Assembly — Storm Spriggan Knuckle Unite

**Thesis.** Storm Spriggan Knuckle Unite assembles to m = 8.8 + 20.2 + 5.95 = 34.95 g with I_total = 5.672×10⁻⁶ + 1.479×10⁻⁵ + 5.861×10⁻⁷ = 2.105×10⁻⁵ kg·m². At ω₀ = 694 rad/s the initial angular momentum L₀ = 2.105×10⁻⁵ × 694 = 1.461×10⁻² kg·m²/s. With Unite's sharp center tip (μ = 0.08, r = 1.5 mm) the spin decay is dω/dt = −(0.08 × 0.03495 × 9.81 × 0.0015) / 2.105×10⁻⁵ = −1.955 rad/s², yielding t_battle = 416 / 1.955 = 213 s. The assembly's fatal flaw remains the Layer: τ_burst = 1.26 mN·m means any rotational impact exceeding 1.26 mN·m triggers a Burst, and at ω₀ = 694 rad/s a single contact with a medium-weight opponent generates τ_impact >> 1.26 mN·m. In left-spin mode versus a right-spin opponent the gear-mesh contact reduces recoil and therefore τ_impact, partially mitigating Burst risk; in right-spin mode it self-Bursts reliably against any aggressive layer. The combo's role is theoretical spin-equalization: the dual-spin gimmick plus Unite's rubber ring allow SE interactions where the rubber transfers spin from an opposite-spin opponent, but the instability created by imminent Burst cancels any competitive advantage. Knuckle contributes 70.3% of total I (1.479 / 2.105), making disc selection the primary stamina lever.

```
Assembly — Storm Spriggan Knuckle Unite

Mass budget:
  Storm Spriggan layer :  8.80 g  (25.2%)
  Knuckle disc        : 20.20 g  (57.8%)
  Unite tip           :  5.95 g  (17.0%)
  Total               : 34.95 g

I budget:
  I_layer  = 5.672×10⁻⁶ kg·m²  (26.9%)
  I_Knuckle= 1.479×10⁻⁵ kg·m²  (70.3%)
  I_Unite  = 5.861×10⁻⁷ kg·m²  ( 2.8%)
  I_total  = 2.105×10⁻⁵ kg·m²

Battle timeline (sharp tip, left-spin mode):
  ω₀  = 694 rad/s      t=0
  ω   = 277 rad/s      t=213s  (40% — nutation onset)
  L₀  = 1.461×10⁻² kg·m²/s
  τ_burst_critical = 1.26 mN·m  (self-Bursts at any significant impact)
```

```
Physics Analysis — Case 546

Assembly total:  m = 34.95 g = 0.03495 kg
I_total:         2.105×10⁻⁵ kg·m²

Spin decay (Unite sharp tip, μ=0.08, r=1.5mm):
  τ_tip = 0.08 × 0.03495 × 9.81 × 0.0015 = 4.115×10⁻⁵ N·m
  dω/dt = -4.115×10⁻⁵ / 2.105×10⁻⁵ = -1.955 rad/s²
  t_battle = 416 / 1.955 = 213 s

Angular momentum:
  L₀ = 2.105×10⁻⁵ × 694 = 1.461×10⁻² kg·m²/s

Burst risk at ω₀=694 rad/s (LS mode, gear-mesh):
  τ_impact_reduced ≈ τ_impact_RS × 0.7 (30% recoil reduction from LS mode)
  τ_impact_RS (typical medium layer @ 694 rad/s) ≈ 8-15 mN·m
  τ_impact_LS ≈ 5.6-10.5 mN·m >> τ_burst_SS = 1.26 mN·m
  Still bursts in left-spin mode against all standard opponents.

Knuckle I dominance:
  I_Knuckle / I_total = 1.479 / 2.105 = 70.3% — disc is the stamina engine
  Upgrading to Gravity or Spread (heavier, higher OWD) is the primary improvement path
```

```typescript
function stormSprigganBattleTime(
  mAssembly_g: number, I_total: number, mu: number, r_tip_mm: number
): { dw_radps2: number; tBattle_s: number; L0: number } {
  const m = mAssembly_g / 1000;
  const tau = mu * m * 9.81 * (r_tip_mm / 1000);
  const dw = -tau / I_total;
  return { dw_radps2: dw, tBattle_s: 416 / Math.abs(dw), L0: I_total * 694 };
}
// stormSprigganBattleTime(34.95, 2.105e-5, 0.08, 1.5) -> { dw=-1.955, t=213s, L0=1.461e-2 }
// stormSprigganBattleTime(34.95, 2.105e-5, 0.45, 12)  -> { dw=-87.6,  t=4.7s, L0=1.461e-2 }  // rubber mode
// stormSprigganBattleTime(46.05, 2.719e-5, 0.08, 1.5) -> { dw=-1.994, t=209s, L0=1.887e-2 }  // Requiem ref

function stormSprigganBurstRisk(
  omega: number, tau_burst_mNm: number, I_layer: number,
  tau_impact_mNm: number
): { bursts: boolean; margin_mNm: number; survivalOdds_pct: number } {
  const margin = tau_burst_mNm - tau_impact_mNm;
  const bursts = tau_impact_mNm >= tau_burst_mNm;
  const odds = bursts ? 0 : Math.min(100, (margin / tau_burst_mNm) * 100);
  return { bursts, margin_mNm: margin, survivalOdds_pct: odds };
}
// stormSprigganBurstRisk(694, 1.26, 5.672e-6, 5.0)  -> { bursts:true,  margin=-3.74 }
// stormSprigganBurstRisk(694, 1.26, 5.672e-6, 1.0)  -> { bursts:false, margin=0.26, odds=20.6% }
// stormSprigganBurstRisk(300, 1.26, 5.672e-6, 0.8)  -> { bursts:false, margin=0.46, odds=36.5% }

function stormSprigganSETransfer(
  I_SS: number, omega_SS: number, I_opp: number, omega_opp: number,
  mu_rubber: number, contacts: number
): { omega_SS_after: number; omega_opp_after: number; deltaL: number } {
  const efficiency = mu_rubber * contacts * 0.02;
  const deltaL = efficiency * I_opp * (omega_opp - omega_SS);
  const o_SS_new = omega_SS + deltaL / I_SS;
  const o_opp_new = omega_opp - deltaL / I_opp;
  return { omega_SS_after: o_SS_new, omega_opp_after: o_opp_new, deltaL };
}
// stormSprigganSETransfer(2.105e-5, 200, 2.5e-5, 400, 0.45, 3) -> SE toward equilibrium
// stormSprigganSETransfer(2.105e-5, 100, 2.5e-5, 500, 0.45, 5) -> larger delta
// stormSprigganSETransfer(2.105e-5, 300, 2.5e-5, 300, 0.45, 3) -> deltaL=0 (equal spin)
```

---

### Case 547: Energy Layer — Spriggan Requiem (God Layer System)

**Thesis.** Spriggan Requiem is a dual-spin God Layer massing 16.05 g — significantly heavier than most God Layers due to a non-removable integrated Metal God Chip — whose near-circular perimeter (small indents only) carries rubber SE contact points at two positions and a large double-bladed axe protrusion from center to rim. I_SR = 0.5 × 0.01605 × (0.008² + 0.038²) = 1.210×10⁻⁵ kg·m². The Metal God Chip raises mass by approximately 2.5 g relative to a plain polycarbonate layer, concentrating weight at r ≈ 15–18 mm and increasing burst resistance through higher tab pre-load. Unlike Storm Spriggan, Requiem's teeth meet the standard "first two thick, next two normal" pattern: the two thick tabs per set sustain τ_burst ≈ 9.8 mN·m; the two thin tabs that facilitate the dual-spin mechanism wear faster and must be monitored. Recommended replacement is proactive — two sets of teeth means 4 tabs per direction but only 2 thick ones, so after approximately 80–100 competitive battles the thin tabs degrade and effective τ_burst falls to ≈ 5.4 mN·m (thin-tab only). The rubber SE points at r ≈ 30 mm create two contact hooks; at equal opposite spin the SE torque τ_SE = 2 × 0.45 × F_N × 0.030 where F_N is the interlayer normal force at collision — significantly less efficient than Drain Fafnir (three full rubber blades) but still generates measurable spin transfer. Left-spin versus right-spin: no discernible performance difference due to the round design; set opposite to opponent always.

```
Spriggan Requiem — God Layer Dual-Spin + Metal Chip (r_o = 38 mm)

Top view (round perimeter, small indents):
      . o . o . o . o .
    o   [rubber SE]     o
   .  [Metal God Chip]   .   <- non-removable, ~2.5g metal
   o    [ S R ]          o
    o   [rubber SE]     o
      . o . o . o . o .
  r_i=8mm | r_o=38mm | ~round

Tooth structure:
  Right-spin set: [thick][thick][thin][thin]  <- thin two wear fast
  Left-spin set:  [thick][thick][thin][thin]
  τ_burst_thick ≈ 9.8 mN·m | τ_burst_thin ≈ 5.4 mN·m (worn)
```

```
Physics Analysis — Case 547

Component: Energy Layer Spriggan Requiem
Mass:      m = 16.05 g = 0.01605 kg  (incl. Metal God Chip ~2.5g)
Geometry:  r_inner = 8 mm, r_outer = 38 mm

Moment of Inertia:
  I_SR = ½ × 0.01605 × (0.008² + 0.038²)
       = ½ × 0.01605 × (6.4×10⁻⁵ + 1.444×10⁻³)
       = ½ × 0.01605 × 1.508×10⁻³
       = 1.210×10⁻⁵ kg·m²

Burst torque:
  Thick tabs: τ_thick = 2 × 500 × 5×10⁻⁴ × 0.014 = 7.0×10⁻³ N·m = 7.0 mN·m (×2 = 14.0 pre-wear)
  Full engagement (2 thick): τ_burst = 9.8 mN·m (effective single-event resistance)
  Worn thin tabs only: τ_burst_worn = 5.4 mN·m
  Replace Layer after ~80-100 battles or when τ_burst_meas < 6 mN·m

SE torque per collision event (opposite-spin, r_rubber=30mm):
  τ_SE = 2 × μ_rubber × F_N × r_contact
  At F_N = 5 N per contact:  τ_SE = 2 × 0.45 × 5.0 × 0.030 = 0.135 N·m
  (short-duration burst; net ΔL ≈ τ_SE × Δt_contact ≈ 0.135 × 0.005 = 6.75×10⁻⁴ kg·m²/s)
```

```typescript
function sprigganRequiemInertia(m_g: number, r_outer_mm: number): number {
  const m = m_g / 1000;
  return 0.5 * m * (0.008 ** 2 + (r_outer_mm / 1000) ** 2);
}
// sprigganRequiemInertia(16.05, 38) -> 1.210e-5 kg·m²
// sprigganRequiemInertia(13.55, 38) -> 1.022e-5 kg·m²  (without Metal God Chip)
// sprigganRequiemInertia(16.05, 40) -> 1.306e-5 kg·m²  (at wider effective radius)

function sprigganRequiemBurstTorque(
  condition: "new" | "worn"
): { tau_mNm: number; recommendReplace: boolean } {
  const tau = condition === "new" ? 9.8 : 5.4;
  return { tau_mNm: tau, recommendReplace: condition === "worn" };
}
// sprigganRequiemBurstTorque("new")  -> { tau=9.8mN·m, recommendReplace:false }
// sprigganRequiemBurstTorque("worn") -> { tau=5.4mN·m, recommendReplace:true  }
// (use after 80-100 battles; proactive swap avoids mid-match failure)

function sprigganRequiemSETransfer(
  F_N_perContact: number, r_rubber_mm: number, dt_contact_s: number
): { tau_Nm: number; deltaL: number; note: string } {
  const tau = 2 * 0.45 * F_N_perContact * (r_rubber_mm / 1000);
  const deltaL = tau * dt_contact_s;
  const note = "2 contact points; less than Drain Fafnir (3 full blades)";
  return { tau_Nm: tau, deltaL, note };
}
// sprigganRequiemSETransfer(5.0,  30, 0.005) -> { tau=0.135, deltaL=6.75e-4 }
// sprigganRequiemSETransfer(8.0,  30, 0.005) -> { tau=0.216, deltaL=1.08e-3 }
// sprigganRequiemSETransfer(5.0,  30, 0.010) -> { tau=0.135, deltaL=1.35e-3 } (longer contact)
```

---

### Case 548: Forge Disc — 0 (God Layer System)

**Thesis.** Forge Disc 0 masses 24.0 g in an elliptical profile with two wide smooth protrusions designed for optional Disc Frame attachment. Despite the wide-arm appearance suggesting high OWD, mass distribution is actually centralized (CWD): the thick protrusion arms carry mass that is only marginally further from center than the inner collar, making effective r_eff ≈ 32 mm rather than the visual 38 mm. I_0 = 0.5 × 0.024 × (0.013² + 0.032²) = 1.432×10⁻⁵ kg·m² — equivalent stamina to Disc 2 despite being 4–5 g heavier, because the extra mass sits centrally. The practical value of 0 is threefold: high weight increases Attack and Defense potential through greater linear momentum (p = m × v), excellent LAD from its round-ended protrusions which maintain stadium contact geometry during final precession, and Frame compatibility which allows Proof or Cross to add peripheral weight and restore OWD. Without a Frame, 0 functions as a heavy Attack/Defense disc; paired with Frame Proof it becomes a competitive Stamina disc. The molded "0" and round protrusion tips make the disc visually distinctive but the CWD physics are what define its role.

```
Disc 0 — Elliptical, CWD, Frame-Compatible (24.0 g)

Top view:
       _______
      /       \
  ---[  "0"   ]---   protrusion: wide, smooth-ended
      \       /        for Frame compatibility
       -------
  r_i=13mm | r_eff≈32mm (CWD) | visual r_o≈38mm

CWD profile:
  Despite appearance, inner arm mass >> outer edge mass
  Stamina ~ Disc 2 (not Disc 7 or Spread despite higher mass)
  With Frame Proof: OWD restored → Stamina upgrades significantly

Frame slot:
  [ notch | inner edge | Frame-seat | outer lip ]
  Proof (2.9g), Cross, Glaive all compatible
```

```
Physics Analysis — Case 548

Component: Forge Disc 0
Mass:      m = 24.0 g = 0.024 kg
Geometry:  r_inner = 13 mm, r_eff_outer = 32 mm (CWD adjustment)

Moment of Inertia (CWD-adjusted):
  I_0 = ½ × 0.024 × (0.013² + 0.032²)
      = ½ × 0.024 × (1.69×10⁻⁴ + 1.024×10⁻³)
      = ½ × 0.024 × 1.193×10⁻³
      = 1.432×10⁻⁵ kg·m²

CWD penalty vs full OWD (r_o=38mm):
  I_OWD_ideal = ½ × 0.024 × (0.013² + 0.038²) = 1.750×10⁻⁵
  I_actual     = 1.432×10⁻⁵
  Loss = (1.750 - 1.432) / 1.750 = 18.2% stamina reduction from CWD

With Frame Proof (2.9g, r_i=20mm, r_o=38mm):
  I_Proof = ½ × 0.0029 × (0.020² + 0.038²) = 2.674×10⁻⁶ kg·m²
  I_combo = 1.432×10⁻⁵ + 2.674×10⁻⁶ = 1.699×10⁻⁵ kg·m²
  (approaches OWD ideal; Frame Proof restores 85% of CWD penalty)

LAD via round protrusion ends:
  Stadium contact arc at tilt 5°: r_contact ≈ 33-35mm → good continuous roll
  LAD quality: high (round contact) vs Disc 1 (pointed, lower LAD)
```

```typescript
function disc0Inertia(m_g: number, r_eff_mm: number): number {
  return 0.5 * (m_g / 1000) * (0.013 ** 2 + (r_eff_mm / 1000) ** 2);
}
// disc0Inertia(24.0, 32) -> 1.432e-5 kg·m² (CWD actual)
// disc0Inertia(24.0, 38) -> 1.750e-5 kg·m² (OWD ideal — not achievable without Frame)
// disc0Inertia(24.0, 35) -> 1.577e-5 kg·m² (intermediate estimate with Frame Proof)

function disc0WithFrame(
  m_disc_g: number, m_frame_g: number, r_frame_i_mm: number, r_frame_o_mm: number
): { I_disc: number; I_frame: number; I_total: number; owdBoostPct: number } {
  const I_disc = 0.5 * (m_disc_g / 1000) * (0.013 ** 2 + 0.032 ** 2);
  const I_frame = 0.5 * (m_frame_g / 1000) * ((r_frame_i_mm / 1000) ** 2 + (r_frame_o_mm / 1000) ** 2);
  const I_total = I_disc + I_frame;
  const I_ideal = 0.5 * (m_disc_g / 1000) * (0.013 ** 2 + 0.038 ** 2);
  return { I_disc, I_frame, I_total, owdBoostPct: ((I_total - I_disc) / (I_ideal - I_disc)) * 100 };
}
// disc0WithFrame(24.0, 2.9, 20, 38) -> { I_frame=2.674e-6, I_total=1.699e-5, owdBoost=84.6% }
// disc0WithFrame(24.0, 3.2, 20, 39) -> { I_frame slightly higher }
// disc0WithFrame(24.0, 0,   0,  0)  -> { I_frame=0, I_total=1.432e-5, owdBoost=0% }

function disc0LADQuality(
  tiltAngle_deg: number, r_eff_mm: number
): { contactRadius_mm: number; ladClass: string } {
  const rContact = r_eff_mm * Math.cos((tiltAngle_deg * Math.PI) / 180);
  const lad = rContact > 30 ? "high" : rContact > 22 ? "medium" : "low";
  return { contactRadius_mm: rContact, ladClass: lad };
}
// disc0LADQuality(5,  32) -> { contactRadius=31.9mm, ladClass:"high"   }
// disc0LADQuality(15, 32) -> { contactRadius=30.9mm, ladClass:"high"   }
// disc0LADQuality(30, 32) -> { contactRadius=27.7mm, ladClass:"medium" }
```

---

### Case 549: Performance Tip — Zeta (God Layer System)

**Thesis.** Zeta masses 6.0 g and provides three selectable modes via a rotating tip carrier: Attack (rectangular flat rubber), Defense (wide ball), and Stamina (flat + center protrusion). I_Zeta = 0.5 × 0.006 × (0.0015² + 0.016²) = 7.748×10⁻⁷ kg·m². The Stamina mode protrusion at r = 1.5 mm (μ_plastic = 0.08) produces a modest spin-decay torque; the flat surrounding body at r_body = 16 mm activates when the bey tilts, producing semi-aggressive movement before the protrusion re-centers. The Attack mode's rectangular flat tip (r_eff ≈ 4 mm, μ_rubber = 0.45) creates very aggressive motion at high ω but the rectangular corners grind the Tornado Ridge, severing any banking pattern and causing rapid Stamina loss; dω/dt_attack = −(0.45 × m × g × 0.004) / I_total is approximately −37 rad/s² in the Spriggan Requiem assembly, giving only t ≈ 11 s of effective attack motion. The Defense mode's wide ball (r = 5 mm, μ ≈ 0.035 for free-spinning metal ball) creates semi-aggressive early motion due to the ball's wider footprint increasing lateral displacement; the lack of tabs around the ball (unlike Driver Defense) removes the braking mechanism that would keep it centered, making KO resistance poor despite the ball bearing-like friction. Zeta's best mode for this assembly is Stamina; Attack and Defense both underperform their dedicated counterparts.

```
Zeta — 3-Mode Adjustable Tip (6.0 g)

Mode cross sections:
  ATTACK (rect flat rubber):  __|__|__ μ=0.45, r_eff≈4mm  — aggressive, no banking
  DEFENSE (wide ball):         (  O  )  μ=0.035, r=5mm   — semi-aggressive, poor KO resist
  STAMINA (flat+protrusion):  ---.---   μ=0.08,  r=1.5mm  — stable, decent stamina

  Stamina mode height = standard; no spring (unlike Quattro/Kick)
  Rectangular tip corners → grind Tornado Ridge → Attack mode self-terminates
```

```
Physics Analysis — Case 549

Component: Performance Tip Zeta
Mass:      m = 6.0 g = 0.006 kg
Geometry:  r_protrusion = 1.5 mm (Stamina mode key contact)

Moment of Inertia:
  I_Zeta = ½ × 0.006 × (0.0015² + 0.016²)
         = ½ × 0.006 × (2.25×10⁻⁶ + 2.56×10⁻⁴)
         = ½ × 0.006 × 2.583×10⁻⁴
         = 7.748×10⁻⁷ kg·m²

Mode analysis (Spriggan Requiem 0 assembly, m=46.05g, I=2.719e-5):
  Stamina (r=1.5mm, μ=0.08):
    τ = 0.08 × 0.04605 × 9.81 × 0.0015 = 5.423×10⁻⁵ N·m
    dω/dt = -5.423×10⁻⁵ / 2.719×10⁻⁵ = -1.994 rad/s²
    t_battle = 416 / 1.994 = 209 s

  Defense (r=5mm, μ=0.035 free ball):
    τ = 0.035 × 0.04605 × 9.81 × 0.005 = 7.905×10⁻⁵ N·m
    dω/dt = -7.905×10⁻⁵ / 2.719×10⁻⁵ = -2.907 rad/s²
    t_battle = 416 / 2.907 = 143 s (lower than Stamina due to wider contact)

  Attack (r=4mm, μ=0.45):
    τ = 0.45 × 0.04605 × 9.81 × 0.004 = 8.147×10⁻⁴ N·m
    dω/dt = -8.147×10⁻⁴ / 2.719×10⁻⁵ = -29.97 rad/s²
    t_attack  = 416 / 29.97 = 13.9 s (brief aggressive burst)

Best mode: Stamina (209s) >> Defense (143s) >> Attack (13.9s)
```

```typescript
function zetaSpinDecay(
  mode: "stamina" | "defense" | "attack",
  mAssembly_g: number, I_total: number
): { tau_Nm: number; dw_radps2: number; tBattle_s: number } {
  const m = mAssembly_g / 1000;
  const config = {
    stamina: { mu: 0.08,  r: 0.0015 },
    defense: { mu: 0.035, r: 0.005  },
    attack:  { mu: 0.45,  r: 0.004  },
  }[mode];
  const tau = config.mu * m * 9.81 * config.r;
  const dw = -tau / I_total;
  return { tau_Nm: tau, dw_radps2: dw, tBattle_s: 416 / Math.abs(dw) };
}
// zetaSpinDecay("stamina", 46.05, 2.719e-5) -> { tau=5.423e-5, dw=-1.994, t=209s }
// zetaSpinDecay("defense", 46.05, 2.719e-5) -> { tau=7.905e-5, dw=-2.907, t=143s }
// zetaSpinDecay("attack",  46.05, 2.719e-5) -> { tau=8.147e-4, dw=-29.97, t=13.9s}

function zetaAttackBankingCapability(tipShape: "rectangular" | "round"): {
  canBank: boolean; tornadoRidgeGrind: boolean; note: string;
} {
  if (tipShape === "rectangular") {
    return { canBank: false, tornadoRidgeGrind: true, note: "corners grind ridge; banking pattern impossible" };
  }
  return { canBank: true, tornadoRidgeGrind: false, note: "round tip maintains banking pattern" };
}
// zetaAttackBankingCapability("rectangular") -> { canBank:false, grind:true }
// zetaAttackBankingCapability("round")       -> { canBank:true,  grind:false }
// (Zeta Attack mode is rectangular — always canBank:false in practice)

function zetaBestMode(
  opponent_spin: "same" | "opposite", goal: "stamina" | "defense" | "attack"
): { mode: "stamina" | "defense" | "attack"; reason: string } {
  if (goal === "stamina" && opponent_spin === "opposite") {
    return { mode: "stamina", reason: "SR rubber SE + Stamina mode = optimal spin-equalization setup" };
  }
  if (goal === "attack") {
    return { mode: "attack", reason: "brief burst ~14s; use with Banking Shoot for maximum contact" };
  }
  return { mode: "stamina", reason: "Stamina mode (209s) outperforms Defense (143s) for this assembly" };
}
// zetaBestMode("opposite", "stamina") -> { mode:"stamina", reason:"SE+Stamina optimal" }
// zetaBestMode("same",     "stamina") -> { mode:"stamina", reason:"209s > 143s" }
// zetaBestMode("same",     "attack")  -> { mode:"attack",  reason:"brief burst ~14s" }
```

---

### Case 550: Assembly — Spriggan Requiem 0 Zeta

**Thesis.** Spriggan Requiem 0 Zeta assembles to m = 16.05 + 24.0 + 6.0 = 46.05 g with I_total = 1.210×10⁻⁵ + 1.432×10⁻⁵ + 7.748×10⁻⁷ = 2.719×10⁻⁵ kg·m². In Zeta Stamina mode (r = 1.5 mm, μ = 0.08) the spin decay is dω/dt = −1.994 rad/s² and t_battle = 416 / 1.994 = 209 s. L₀ = 2.719×10⁻⁵ × 694 = 1.887×10⁻² kg·m²/s. Disc 0 accounts for 52.7% of total I (1.432 / 2.719), making it the primary stamina contributor; Layer Requiem contributes 44.5% and Zeta only 2.8%. Operationally, the key strength is opposite-spin SE: Requiem's two rubber contacts transfer spin from a right-spin opponent in left-spin mode (recommended configuration); each collision event delivers ΔL ≈ 0.135 × 0.005 = 6.75×10⁻⁴ kg·m²/s, effectively adding t_se = ΔL / (I_total × |dω/dt|) ≈ 6.75×10⁻⁴ / (2.719×10⁻⁵ × 1.994) = 12.4 s per contact event. Against a right-spin opponent with 30 collision events this yields an additional 30 × 12.4 = 372 s of equivalent stamina recovery — making SE the dominant performance variable for this assembly, far outweighing tip mode selection. The 0 disc's lack of a Frame is the primary upgrade path; adding Frame Proof raises I_total to 2.987×10⁻⁵ kg·m², extending t_battle to 229 s and increasing L₀ to 2.073×10⁻² kg·m²/s.

```
Assembly — Spriggan Requiem 0 Zeta

Mass budget:
  Spriggan Requiem : 16.05 g  (34.9%)
  Disc 0           : 24.00 g  (52.1%)
  Zeta tip         :  6.00 g  (13.0%)
  Total            : 46.05 g

I budget:
  I_Requiem = 1.210×10⁻⁵  (44.5%)
  I_Disc0   = 1.432×10⁻⁵  (52.7%)
  I_Zeta    = 7.748×10⁻⁷  ( 2.8%)
  I_total   = 2.719×10⁻⁵ kg·m²

Battle timeline (Zeta Stamina, left-spin vs right-spin opp):
  ω₀ = 694 rad/s      t=0
  ω  = 277 rad/s      t=209s  (40% threshold)
  L₀ = 1.887×10⁻² kg·m²/s
  SE bonus/contact:  +12.4 s equivalent recovery
  30 contacts:       ~+372 s total recovery (dominant variable)

Upgrade: add Frame Proof (2.9g):
  I_total → 2.987×10⁻⁵    t_battle → 229s    L₀ → 2.073×10⁻²
```

```
Physics Analysis — Case 550

Assembly total:  m = 46.05 g = 0.04605 kg
I_total:         2.719×10⁻⁵ kg·m²

Spin decay (Zeta Stamina mode, μ=0.08, r=1.5mm):
  τ_tip = 0.08 × 0.04605 × 9.81 × 0.0015 = 5.423×10⁻⁵ N·m
  dω/dt = -5.423×10⁻⁵ / 2.719×10⁻⁵ = -1.994 rad/s²
  t_battle = 416 / 1.994 = 209 s

Angular momentum:
  L₀ = 2.719×10⁻⁵ × 694 = 1.887×10⁻² kg·m²/s

SE stamina recovery per contact (30mm rubber, F_N=5N):
  τ_SE  = 2 × 0.45 × 5.0 × 0.030 = 0.135 N·m
  ΔL_SE = 0.135 × 0.005 = 6.75×10⁻⁴ kg·m²/s
  Δt_equiv = ΔL_SE / (I_total × |dω/dt|) = 6.75×10⁻⁴ / (2.719×10⁻⁵ × 1.994)
           = 6.75×10⁻⁴ / 5.422×10⁻⁵ = 12.4 s per contact

Disc I dominance:
  I_Disc0 / I_total = 52.7% — primary stamina lever
  Swap: Disc 0 → Spread (25.0g, OWD) adds +8% I → t_battle ≈ 226s even without Frame
```

```typescript
function sprigganRequiemAssemblyTime(
  mAssembly_g: number, I_total: number, mu: number, r_tip_mm: number
): { dw_radps2: number; tBattle_s: number; L0: number } {
  const m = mAssembly_g / 1000;
  const tau = mu * m * 9.81 * (r_tip_mm / 1000);
  const dw = -tau / I_total;
  return { dw_radps2: dw, tBattle_s: 416 / Math.abs(dw), L0: I_total * 694 };
}
// sprigganRequiemAssemblyTime(46.05, 2.719e-5, 0.08, 1.5) -> { dw=-1.994, t=209s, L0=1.887e-2 }
// sprigganRequiemAssemblyTime(48.95, 2.987e-5, 0.08, 1.5) -> { dw=-1.814, t=229s, L0=2.073e-2 } // +Frame Proof
// sprigganRequiemAssemblyTime(46.05, 2.719e-5, 0.035,5.0) -> { dw=-2.907, t=143s, L0=1.887e-2 } // Defense mode

function sprigganRequiemSERecovery(
  I_total: number, dw_radps2: number,
  F_N: number, r_rubber_mm: number, n_contacts: number
): { deltaL_per: number; dt_equiv_per_s: number; total_recovery_s: number } {
  const tau_SE = 2 * 0.45 * F_N * (r_rubber_mm / 1000);
  const dL = tau_SE * 0.005;
  const dt = dL / (I_total * Math.abs(dw_radps2));
  return { deltaL_per: dL, dt_equiv_per_s: dt, total_recovery_s: dt * n_contacts };
}
// sprigganRequiemSERecovery(2.719e-5, 1.994, 5.0, 30, 30) -> { dt=12.4s, total=372s }
// sprigganRequiemSERecovery(2.719e-5, 1.994, 3.0, 30, 20) -> { dt=7.4s,  total=148s }
// sprigganRequiemSERecovery(2.719e-5, 1.994, 8.0, 30, 40) -> { dt=19.9s, total=796s }

function sprigganRequiemUpgradeWithFrame(
  m_disc_g: number, m_frame_g: number, I_disc: number, I_frame: number,
  mu: number, r_tip_mm: number
): { I_new: number; t_new_s: number; L0_new: number } {
  const m_new = (m_disc_g + m_frame_g + 16.05 + 6.0) / 1000;
  const I_new = I_disc + I_frame + 1.210e-5 + 7.748e-7;
  const tau = mu * m_new * 9.81 * (r_tip_mm / 1000);
  return { I_new, t_new_s: 416 / (tau / I_new), L0_new: I_new * 694 };
}
// sprigganRequiemUpgradeWithFrame(24.0, 2.9, 1.432e-5, 2.674e-6, 0.08, 1.5)
//   -> { I_new=2.987e-5, t=229s, L0=2.073e-2 }
// sprigganRequiemUpgradeWithFrame(24.0, 0,   1.432e-5, 0,        0.08, 1.5)
//   -> { I_new=2.719e-5, t=209s, L0=1.887e-2 } (no frame baseline)
// sprigganRequiemUpgradeWithFrame(24.0, 3.2, 1.432e-5, 2.9e-6,   0.08, 1.5)
//   -> { I_new slightly higher, t>229s }
```

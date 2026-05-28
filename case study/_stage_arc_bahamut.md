
## Case 1376 — Energy Layer: Arc Bahamut (Burst God)

**Generation:** Burst God  
**Type:** Defense  
**Spin:** Left (counter-clockwise)  
**Mass:** 12.7 g  
**Material:** ABS plastic (high-grade, navy)

### Geometry
- 6 clockwise-oriented blades with rounded contact faces
- Outer circumradius r_o = 40 mm; inner hub r_i = 15 mm
- Movable sub-layer: 6 inner-ring segments that extend radially outward (centrifugal) to fill inter-blade gaps at 3/4 burst threshold
- Ratchet tooth count: 3 (very short teeth)

### Moment of Inertia
```
I_Bahamut = ½ × m × (r_i² + r_o²)
           = ½ × 0.0127 × (0.015² + 0.040²)
           = ½ × 0.0127 × (2.25×10⁻⁴ + 1.600×10⁻³)
           = ½ × 0.0127 × 1.8225×10⁻³
           = 1.157×10⁻⁵ kg·m²
```

### Sub-Layer Gimmick Analysis
At 3/4 burst threshold advancement (ratchet under progressive load), the 6 segments extend to r ≈ 25 mm and cover each inter-blade gap:
- Gap closure: ~30° arc per gap × 6 gaps = 180° effective gap coverage
- Before closure: 6 discrete blade faces; after closure: near-continuous perimeter
- Distributed-contact gain: peak contact stress σ drops by ~50% at previously open sites
- Practical ceiling: gimmick rarely reaches activation before KO or burst occurs in competitive play; functions as a last-resort layer stiffener

### Left-Spin vs Right-Spin Opponent
Opposite-spin contact (LS Bahamut vs RS opponent):
- Relative surface velocity at contact = ω_LS + ω_RS (constructive) → high relative speed
- LS blade orientation (clockwise blades on LS layer) presents rounded deflecting geometry to RS opponent
- Burst-advancing torque on Arc Bahamut from RS impact is directed ANTI-burst (same reaction as re-tightening direction for LS)
- Arc Bahamut's ratchet is pushed toward the locked position by the same impulse that advances RS opponents' ratchets
- 3 short teeth compensated by: (1) left-spin anti-burst reaction from opposite-spin opponents; (2) Atomic free-spin dampening; (3) sub-layer gap closure under sustained pressure

### Re-tightening Note
With Bearing Driver: counter-rotation applies reverse shaft torque → continuously advances ratchet back toward locked position.  
With Atomic (this combo): free-rotating ball absorbs impact torque spikes, reducing ratchet advancement rate per collision.

### Gear-Collision Metric
Relative angular velocity at contact surface (LS + RS, battle conditions):
ω_rel = ω_battle_LS + ω_battle_RS ≈ 420 + 420 = 840 rad/s  
At this surface speed, contacts are predominantly glancing; rounded LS blades deflect past RS blades rather than locking → reduced mutual burst risk.

---

## Case 1377 — Forge Disc: 2 (Burst God)

**Generation:** Burst God  
**Mass:** 21.21 g  
**Material:** Zinc alloy die-cast

### Geometry
- Symmetrical elliptical profile: semi-major axis ≈ 40 mm, semi-minor ≈ 36 mm
- Even-numbered disc → accepts Frame attachment (tab + socket system)
- Inner bore r_i = 6 mm; outer rim r_o = 40 mm

### Moment of Inertia
```
I_2 = ½ × m × (r_i² + r_o²)
    = ½ × 0.02121 × (0.006² + 0.040²)
    = ½ × 0.02121 × (3.60×10⁻⁵ + 1.600×10⁻³)
    = ½ × 0.02121 × 1.636×10⁻³
    = 1.734×10⁻⁵ kg·m²
```

### Angular Momentum at Launch (ω₀ = 700 rad/s)
```
L_2 = I_2 × ω₀ = 1.734×10⁻⁵ × 700 = 1.214×10⁻² N·m·s
Fraction of assembly L₀ (see Case 1380): 51.3%
```

### Design Properties
- Symmetrical mass distribution: no preferred attack axis → neutral across all matchup types
- Weight class: average among Burst God Core Discs (lighter than 0/00 ~25 g, heavier than 4 ~19 g)
- Even-number pairing enables Bump Frame, which adds outer-ring mass raising assembly stability and adding attack surface bumps
- Jack-of-all-Trades: supports Attack, Defense, and Stamina configurations without dominant advantage or weakness

---

## Case 1378 — Disc Frame: Bump (Burst God)

**Generation:** Burst God  
**Mass:** 3.27 g  
**Material:** ABS plastic

### Geometry
- Round ring profile; 16 hemispherical bumps around outer perimeter
- Bump crest radius r_o = 40 mm; mounting socket radius r_i = 35 mm
- Frame thickness: among the thickest in the Burst God Frame lineup (heavier than Meteor; lighter frames = Glaive, Cross)

### Moment of Inertia
```
I_Bump = ½ × m × (r_i² + r_o²)
       = ½ × 0.00327 × (0.035² + 0.040²)
       = ½ × 0.00327 × (1.225×10⁻³ + 1.600×10⁻³)
       = ½ × 0.00327 × 2.825×10⁻³
       = 4.619×10⁻⁶ kg·m²
```

Thin-ring check at r_mid = 37.5 mm:  
I_thin = m × r² = 0.00327 × 0.0375² = 4.597×10⁻⁶ kg·m² ✓ (consistent)

### Bump-Contact Physics
- 16 bumps at 22.5° spacing; each bump height h ≈ 1.5 mm above frame surface
- Lateral strike contact: point contact on bump → high local stress, ABS deflects ~0.05 mm (E_ABS ≈ 2.5 GPa, Hertz contact)
- Impulse during bump contact: slightly elevated vs smooth frame (rough perimeter increases normal force component during grazing contact)
- Attack potential: Bump outperforms Glaive/Cross for initiating lateral spin-off via rough-surface friction transfer

### Context in Stamina/Defense
- Bumps add aerodynamic drag (ΔC_D ≈ +6% vs Glaive) → minor stamina penalty at high ω
- Glaive Frame preferred for pure Defense (smooth, lower drag); Bump preferred when attack potential is desired alongside disc mass
- In this combination (2Bump) the added attack roughness pairs with Arc Bahamut's defense-layer geometry to handle aggressive same-spin opponents

---

## Case 1379 — Performance Tip: Atomic (Burst God)

**Generation:** Burst God  
**Mass:** 8.8 g (est.; Takara Tomy release)  
**Material:** ABS plastic body; polycarbonate free-rotating ball; ABS four-tab outer ring

### Geometry
- Primary contact: free-rotating polycarbonate ball
  r_ball = 7.0 mm  (based on user-stated 1.3× Orbit ball diameter; Orbit r_ball ≈ 5.4 mm → 5.4 × 1.3 = 7.0 mm)
- Four-tab outer ring (Life After Death / LAD surface): r_tab = 12.0 mm, free-spinning around driver shaft
- Driver body height: ~10.5 mm (standard God era driver)
- Ball protrudes ~3 mm below housing; free-spin via ball-bearing race in tip housing

### Moment of Inertia
```
Driver body (5.8 g, stem + housing, r_eff ≈ 5 mm):
  I_body = ½ × 0.0058 × 0.005² = 7.25×10⁻⁸ kg·m²

Ball (1.8 g, r = 7 mm, solid sphere — free-rotating, decoupled from assembly I):
  I_ball = ⅖ × 0.0018 × 0.007² = 3.53×10⁻⁸ kg·m²  [does NOT add to assembly spin]

Four-tab ring (1.2 g, r = 12 mm):
  I_ring = m × r² = 0.0012 × 0.012² = 1.728×10⁻⁷ kg·m²

Effective I_Atomic (excluding decoupled ball):
  I_eff = I_body + I_ring = 7.25×10⁻⁸ + 1.728×10⁻⁷ = 2.453×10⁻⁷ kg·m²
```

### Friction Model
| Mode | Condition | μ | r_contact |
|------|-----------|---|-----------|
| Ball (primary) | Normal battle | 0.02 | 7.0 mm |
| Four-tab ring (LAD) | Wobble/low spin | 0.08 | 12.0 mm |

Ball mode dominates during full-spin battle phase. Tab ring activates during wobble phase (ω < 280 rad/s) when tilt angle becomes large enough for ring to graze stadium.

### Burst-Resistance Contribution
Free-rotating ball: impact torque spike at layer cannot spin up the ball (it already rotates freely relative to the driver housing). The torque pathway to the ratchet spring is:
  Impact → layer → burst spring → ratchet

The ball contact point provides a mechanically isolated axis that does not transmit rotational impulse through the spring pathway. This decoupling reduces the effective burst-advancing impulse per collision vs a fixed-tip driver.

### Hasbro Variant Notes
1. First Hasbro: tighter bearing tolerance → μ_ball ≈ 0.05 (reduced free-spin)
2. Second Hasbro (best): matches TT performance; μ_ball ≈ 0.02
3. Third Hasbro: bump added to ball tip → partial plastic contact alongside ball → μ_mixed ≈ 0.10

### Comparison to Orbit Driver
| Property | Atomic | Orbit |
|----------|--------|-------|
| Ball r | 7.0 mm | 5.4 mm |
| μ_ball | 0.02 | 0.04 |
| LAD ring | 4-tab (r = 12 mm) | none (ring integrated) |
| Burst resistance | High (free-spin) | High (free-spin) |
| t_stall (this assembly) | 374 s | ~247 s |

---

## Case 1380 — Full Assembly: Arc Bahamut 2Bump Atomic (Burst God)

**Generation:** Burst God  
**Configuration:** Left-spin Defense  
**Total mass:** 12.7 + 21.21 + 3.27 + 8.8 = 45.98 g  
**Launch ω₀:** 700 rad/s (LR String Launcher)

### Component Inertia Summary
| Part | Mass (g) | I (kg·m²) |
|------|---------|-----------|
| Arc Bahamut | 12.70 | 1.157×10⁻⁵ |
| Forge Disc 2 | 21.21 | 1.734×10⁻⁵ |
| Frame Bump | 3.27 | 4.619×10⁻⁶ |
| Atomic (eff.) | 8.80 | 2.453×10⁻⁷ |
| **Total** | **45.98** | **3.380×10⁻⁵** |

### Angular Momentum at Launch
```
L₀ = I_total × ω₀ = 3.380×10⁻⁵ × 700 = 2.366×10⁻² N·m·s
```

### Angular Momentum Fractions
| Component | L share |
|-----------|---------|
| Arc Bahamut | 34.2% |
| Forge Disc 2 | 51.3% |
| Frame Bump | 13.7% |
| Atomic (eff.) | 0.7% |
| Disc + Frame combined | 65.0% |

### Spin Decay (Atomic ball contact, primary mode)
```
τ = μ_ball × m × g × r_ball
  = 0.02 × 0.04598 × 9.81 × 0.007
  = 6.316×10⁻⁵ N·m

dω/dt = τ / I = 6.316×10⁻⁵ / 3.380×10⁻⁵ = 1.869 rad/s²

t_stall = ω₀ / (dω/dt) = 700 / 1.869 = 374.5 s
```

**Comparison — Atomic vs Orbit on same assembly:**
```
Orbit: μ = 0.04, r = 5.4 mm → τ = 9.76×10⁻⁵ N·m → dω/dt = 2.89 rad/s² → t_stall = 242 s
Atomic: t_stall = 375 s  (+55% over Orbit)
```

### Battle Parameters
| Parameter | Value |
|-----------|-------|
| ω_battle (60% ω₀) | 420 rad/s |
| ω_wobble threshold (40% ω₀) | 280 rad/s |
| L_battle | 1.420×10⁻² N·m·s |
| KE_battle | ½ × 3.380×10⁻⁵ × 420² = 2.980 J |

### LAD Phase (Atomic tab ring, ω < 280 rad/s)
```
τ_tab = μ_tab × m × g × r_tab
      = 0.08 × 0.04598 × 9.81 × 0.012
      = 4.338×10⁻⁴ N·m

dω/dt_tab = 4.338×10⁻⁴ / 3.380×10⁻⁵ = 12.83 rad/s²
```
Tab-ring LAD phase is brief (ω decreases quickly from 280 → 0 at 12.83 rad/s²):
```
t_LAD = 280 / 12.83 = 21.8 s  (from wobble onset to stall)
Total combat time estimate: 375 − 21.8 = ~353 s full-spin + 21.8 s wobble
```

### Opposite-Spin Burst Mechanics
When LS Arc Bahamut (ω = 420 rad/s) is struck by RS opponent at contact point r_c = 38 mm:
- Tangential contact velocity (LS): v_LS = 420 × 0.038 = 15.96 m/s (leftward)
- Tangential contact velocity (RS opponent): v_RS = 420 × 0.038 = 15.96 m/s (rightward)
- Relative contact speed: v_rel = 31.92 m/s
- Impulse duration: Δt ≈ 0.5 ms (typical contact)
- Torque on Bahamut's ratchet = impact force × r_ratchet (direction: TOWARD locked position for LS vs RS)

The LS anti-burst reaction is the primary defensive mechanism here, supplemented by Atomic's impact dampening and the sub-layer gap-filling at high stress states.

### Assembly Verdict
| Property | Rating | Notes |
|----------|--------|-------|
| Stamina | S-tier | t_stall = 374 s; Atomic best-in-class friction |
| Opposite-spin defense | A-tier | LS re-tightening, rounded blade geometry |
| Same-spin burst resist | B-tier | Only 3 short teeth; relies on Atomic dampening |
| Attack | D-tier | Not the purpose of this combo |
| Recommended use | Opposite-spin defense, stamina duels, survival builds |

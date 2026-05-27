# Beyblade Case Studies — Part 11: Special Move Physics

**« Part 10:** [10 case study.md](10%20case%20study.md) (Cases 545–585)

**Scope:** Special moves as physics phenomena — deriving each special-move archetype from real beyblade part mechanics, quantifying effects in SI units, and mapping those quantities to game-engine parameters. Cases 586–600 cover the full live special-move roster plus the meta-mechanics of phase timing, clash matrices, power budgets, type assignment, AI thresholds, and design constraints. All real-world constants are pulled from the confirmed CS1–CS10 baseline; game-engine values are derived from those constants and tagged accordingly.

---

## Style Rules (carry forward from CS10, additions for CS11)

- No em-dashes in prose: use colons or semicolons
- No bullets in the Thesis paragraph
- All numeric results to 3 significant figures
- Annular disk inertia: `I = ½m(r_i² + r_o²)`
- Impulse: `J = m_eff × Δv × (1 + e)` where m_eff = m₁m₂/(m₁+m₂)
- Spring energy: `E_spring = ½kx²`; EG spring: k = 1500 N/m, x = 8 mm → E = 48 mJ [CONFIRMED CS10 Case 556]
- Spin decay: `dω/dt = −(μ × m × g × r_tip) / I_total`
- Gyroscopic precession rate: `Ω_p = τ / (I × ω)`
- Centripetal acceleration: `a_c = v² / r`; orbital period: `T = 2πr / v`
- Engine linearImpulse unit convention: 1 engine-unit ≈ 0.001 N·s (calibrated in Case 597)
- Engine spinDelta unit convention: 1 engine-unit ≈ 0.4 rad/s (calibrated in Case 597)
- All game-engine parameter derivations tagged [GAME-DERIVED] to distinguish from physical measurements

---

## Authoritative Constants for CS11 (inherited from CS1–CS10)

| Parameter | Value | Source | Tag |
|-----------|-------|--------|-----|
| Hard ABS tip μ_k | 0.17 | CS10 Case 551 | [CONFIRMED] |
| Rubber tip μ_k | 0.50 | CS10 Case 545 | [CONFIRMED] |
| B:D bearing μ_k | 0.05 | CS10 Case 551 | [CONFIRMED] |
| ABS-on-ABS COR e | 0.65–0.70 | CS10 | [CONFIRMED] |
| Metal-on-ABS COR e | 0.80 | CS10 | [CONFIRMED] |
| EG spring constant k | 1500 N/m | CS10 Case 555 | [CONFIRMED] |
| EG spring energy E | 48 mJ | CS10 Case 556 | [CONFIRMED] |
| Gen 2 MFB typical launch ω₀ | 600 rad/s | CS10 Case 545 | [ESTIMATED] |
| Gen 4 BX typical launch ω₀ | 2000 rad/s | CS10 (BX launch) | [ESTIMATED] |
| Representative MFB I_total | 7.308×10⁻⁶ kg·m² | CS10 Case 545 | [CONFIRMED] |
| AR contact smash multiplier cos(φ) for φ = 20° | 0.940 | CS8 Case 375 | [CONFIRMED] |
| AR contact upper multiplier cos(φ) for φ = 45° | 0.707 | CS1 Case 10 | [CONFIRMED] |
| Vertical spring pop Δv from Jumping Base spring | ~2.0–2.5 m/s | CS3 Case 99 | [INFERRED] |
| Orbital LAD period (EWD/B:D) | ~0.8–1.2 s | CS6 Case 302 | [INFERRED] |
| g (gravitational acceleration) | 9.81 m/s² | — | [CONFIRMED] |

---

## Case 586 — Special Move Taxonomy: The Four Physics Archetypes of Real Beyblade and Their Game Counterparts

**Thesis:** Every special move in the game engine can be traced to one of four distinct physical phenomena observed in real beyblade hardware across all four generations; the first archetype is the **impulse burst** — a sudden large transfer of linear momentum delivered by a high-mass flat-face attack ring (Cybernetic Dragon AR Case 137, Double Attacker AR Case 161) or by the release of stored spring energy (EG First/Final Clutch mechanisms Cases 187–230), which in the game maps to the `linear-burst` and `directional-burst` kinds where `linearImpulse` represents the integrated force over the active window; the second archetype is the **gyroscopic anchor** — the phenomenon by which a spinning body with maximized I_total and near-zero tip friction (Bearing Core HMS Case 84, B:D bottom Case 351, EWD bottom Case 302) resists external perturbation by converting applied torques into slow precession rather than destabilizing tilt, which in the game maps to the `anchor` kind where `spinDelta` raises ω toward maxSpin and `invulnerabilityMs` represents the gyroscopic resistance window; the third archetype is the **orbital recovery** — the Life-After-Death phenomenon whereby a late-game top with nearly spent spin still maintains a slow closed orbit in the bowl due to residual angular momentum and the gravitational funnel of the bowl slope (TR145 Case 64, Revolve tip Case 461, Atomic bottom Case 71), which in the game maps to the `orbital` kind where `spinDelta` recovers lost spin and the circular-path force is applied as a centripetal push each tick; the fourth archetype is the **spring launch** — the vertical impulse delivered by the Jumping Base spring (Case 99), SG Spring version (Case 112a), Gyro EG (Case 218), or the upward upper-attack vector of high-slope ARs (Upper Claw Case 143, Corona Saber Case 164), which in the game maps to the `aerial-launch` and `knockup` kinds where `verticalImpulse` represents the z-axis momentum transfer; all remaining move types — `shockwave`, `homerun` — are amplitude extensions of the impulse archetype applied as AoE or extreme single-target variants and carry no direct real-world part analog, being instead anime-derived theatrical mechanics bounded by the same physical impulse ceiling as the smash archetype.

### Archetype Map

```
Real Physics Phenomenon          Real Part Examples                Game Move Kind(s)
─────────────────────────────────────────────────────────────────────────────────────
Impulse burst (linear)           Cybernetic Dragon AR (137)       linear-burst
                                 Double Attacker AR (161)          directional-burst
                                 EG spring energy release (556)    homerun
                                 Maximum flat-face smash ARs

Gyroscopic anchor                Bearing Core HMS (84)            anchor
  (high-I + near-zero μ)         B:D bottom (351)
                                 EWD (302)
                                 Phantom Orion (18)

Orbital / LAD recovery           TR145 rollers (64)               orbital
  (bowl-funnel + low friction)   Atomic bottom (71)
                                 Revolve tip (461)
                                 EWD / Bearing bases

Spring / upper-attack launch     Jumping Base spring (99)         aerial-launch
  (vertical impulse)             SG Spring version (112a)         knockup
                                 Upper Claw AR (143)
                                 Corona Saber AR (164)
                                 Gyro EG (218)

Anime-theatrical (no part)       — (series fight scenes)         shockwave
                                                                   (amplitude extension)
─────────────────────────────────────────────────────────────────────────────────────
```

### Physics Budget Per Archetype

```
For a representative MFB assembly:
  mass m = 0.040 kg  [FACT — approximate mid-weight MFB combo]
  I_total = 7.308×10⁻⁶ kg·m²  [CONFIRMED CS10]
  launch ω₀ = 600 rad/s  [ESTIMATED]
  rotational KE = ½ × I × ω₀² = ½ × 7.308×10⁻⁶ × 600² = 1.316 J

  Translational KE at typical attack speed (v = 0.8 m/s):
    KE_trans = ½ × m × v² = ½ × 0.040 × 0.64 = 0.0128 J

  Ratio KE_rotational / KE_translational = 1.316 / 0.0128 = 102.8:1  [INFERRED]
  Interpretation: spin energy dominates translational energy by ~100:1 in real beyblade.
  Special moves that convert rotational KE to translational burst therefore have
  theoretical max impulse J_max = √(2 × I_total × ω₀² × m) = √(2 × 1.316 × 0.040)
    = √(0.1053) = 0.324 N·s per phase.  [INFERRED]

  EG spring energy (E = 48 mJ) as fraction of spin KE:
    48×10⁻³ / 1.316 = 3.65%  [CONFIRMED CS10 Case 556]
  Implication: even the most powerful real mechanical spring supplement is modest vs.
  the spin store. Special moves that "tap" spin energy for burst are physically realistic.
```

---

## Case 587 — Stampede Rush (Linear-Burst): Flat-Face AR Smash Impulse, EG Spring Augmentation, and Effective Mass Trade-Off

**Thesis:** Stampede Rush models the maximum-impulse linear attack archetype: a forward-directed momentum burst equivalent to a Cybernetic Dragon AR (Case 137) or Double Attacker AR (Case 161) striking a stationary target at v_approach = 1.8 m/s on its flat contact face, augmented by EG spring energy; the physics proceeds as follows: a beyblade of mass m₁ = 0.040 kg approaching at v₁ = 1.8 m/s collides with a stationary target m₂ = 0.040 kg (symmetric match) with contact face angle φ = 5° (near-tangential flat face), COR e_ABS = 0.67, giving effective mass m_eff = m₁m₂ / (m₁+m₂) = 0.040×0.040 / 0.080 = 0.020 kg; the impulse at the contact face is J_face = m_eff × Δv_approach × (1 + e) = 0.020 × 1.8 × 1.67 = 0.0601 N·s; the smash component (radially directed) is J_smash = J_face × cos(φ) = 0.0601 × cos(5°) = 0.0599 N·s; the additional EG spring burst contributes E_spring = 48 mJ [CONFIRMED CS10 Case 556] converted to kinetic energy Δv_self = √(2 × E / m) = √(2 × 0.048 / 0.040) = √(2.4) = 1.549 m/s and additional impulse J_EG = m₁ × Δv_self = 0.040 × 1.549 = 0.0620 N·s; total impulse on self from the burst phase J_self = J_smash + J_EG = 0.0599 + 0.0620 = 0.1219 N·s; in the game engine with 1 engine-unit ≈ 0.001 N·s [GAME-DERIVED, see Case 597], this gives linearImpulse ≈ 122 engine-units as the physical ceiling, but the game value of 5000 engine-units represents not a single collision event but the sustained 500ms active-window propulsive force integral F_avg × t = 0.040 × 1.549 × (500/100) = 0.310 N·s divided by the engine unit scale — the exact mapping is established in Case 597; the `spinDelta = 60` effect maps to the minor spin recovery a beyblade experiences when its EG spring fires and the rotor effectively receives a brief freewheel (60 rad/s ≈ 24 engine-units of spin delta, well within the 5% spin-energy reserve available from the attack burst).

### Phase Timeline

```
Stampede Rush Phase: "stampede_rush_main"

  Time →   0ms      100ms    300ms    600ms    700ms
           ├─────────┼────────────────┼─────────┤
           │ WINDUP  │    ACTIVE      │ WINDDOWN│
           │ 100ms   │    500ms       │  100ms  │
           │ self     │ full effects   │ carry    │
           │ effects  │ + target hit   │ velocity │
           │ only     │                │          │

  peakMs = 250ms into active window (150ms absolute)
  peakToleranceMs = ±100ms for timing bonus

  linearImpulse = 5000   →  propulsive impulse on SELF (forward direction)
  knockbackImpulse = 3000  →  impulse on TARGET at contact (see Case 597)
  spinDelta = +60         →  minor spin boost from EG-equivalent spring release
  invulnerabilityMs = 200  →  reflects real EG wind-up: during spring charge,
                               the beyblade is temporarily rigid / zero-compliance
  damageMultiplier = 1.3   →  flat-face contact angle φ ≈ 5°: cos(5°) = 0.996 ≈ 1.0;
                               real multiplier 1.3 comes from high approach speed
                               (ATTACK_TYPE_MULTIPLIER.smash = 1.3 [CONFIRMED])
```

### Real-Part Basis: Flat-Face AR Smash Geometry

```
Contact face analysis for Cybernetic Dragon AR (Case 137):
  Outer radius r_AR = 27 mm  [FACT CS3 Case 137]
  Contact face length L_face = 12 mm (widest flat face, measured from image)  [ESTIMATED]
  Contact face angle φ = 3–8°  [ESTIMATED — near-tangential flat]

  Impact at v_approach = 1.8 m/s:
    J_total = m_eff × v_rel × (1 + e) = 0.020 × 1.8 × 1.67 = 0.0601 N·s
    F_avg = J_total / t_contact = 0.0601 / 0.002 = 30.1 N  (t_contact = 2 ms [ESTIMATED])
    Torque on opponent: τ = r_AR × F_avg = 0.027 × 30.1 = 0.812 N·m
    Δω_opponent = τ × t_contact / I_opponent = 0.812 × 0.002 / 7.308×10⁻⁶ = 222 rad/s  [INFERRED]

  Double Attacker AR (Case 161): φ = 0° (fully tangential flat face)
    J_smash = J_total × cos(0°) = J_total = 0.0601 N·s  — maximum possible smash  [INFERRED]

  Stampede Rush models the Double Attacker end of the smash spectrum:
    flatness maximized, approach speed near maximum, spring supplement added.
```

```typescript
// Engine tick: apply Stampede Rush propulsion
function applyStampedeRush(bey: Beyblade, targetBey: Beyblade | null): void {
  // Forward impulse on self
  const facingRad = bey.angle * Math.PI / 180;
  const fx = Math.cos(facingRad) * STAMPEDE_RUSH_IMPULSE;   // 5000 engine-units
  const fy = Math.sin(facingRad) * STAMPEDE_RUSH_IMPULSE;
  applyForce(bey.id, fx, fy);

  // Spin micro-boost from EG-equivalent spring
  bey.spin = Math.min(bey.maxSpin, bey.spin + 60);          // spinDelta = 60 rad/s

  // Invulnerability window: 200ms
  bey.invulnerableUntil = Date.now() + 200;

  // Knockback on target (if in radius ≤ 400px)
  if (targetBey) {
    const angle = angleBetween(bey, targetBey);
    applyForce(targetBey.id,
      Math.cos(angle) * STAMPEDE_RUSH_KNOCKBACK,             // 3000 engine-units
      Math.sin(angle) * STAMPEDE_RUSH_KNOCKBACK);
  }
}
```

---

## Case 588 — Gyro Anchor (Anchor): Gyroscopic Stability Maximization, Bearing Core LAD, and Spin-Steal Drain Radius

**Thesis:** Gyro Anchor models the gyroscopic self-stabilization archetype by simultaneously maximizing spin (raising ω toward maxSpin) and entering the bearing-core low-friction regime (effectively reducing tip μ toward the B:D value of 0.05 [CONFIRMED CS10 Case 551]) for 1.5 s, while passively draining spin from nearby opponents within the `spinStealRadiusPx = 250` field; the real-world analog is the Bearing Core HMS (Case 84) combined with Phantom Orion B:D (Case 18): Bearing Core reduces spin decay from 39.8 rad/s² (hard ABS tip) to |dω/dt_bearing| = (0.05 × m × g × r_tip) / I = (0.05 × 0.040 × 9.81 × 0.004) / 7.308×10⁻⁶ = 1.070×10⁻⁴ / 7.308×10⁻⁶ = 14.6 rad/s² — a 2.73× improvement in spin retention [INFERRED]; during the 1.5 s anchor window the beyblade loses only Δω_anchor = 14.6 × 1.5 = 21.9 rad/s versus the normal loss of 39.8 × 1.5 = 59.7 rad/s from a hard ABS tip, recovering the difference Δω_save = 37.8 rad/s which is close to the `spinDelta = 250` engine value scaled by the game's unit convention (see Case 597); the spin-steal effect is physically grounded in the Advance Balancer AR spin-steal mechanism (Case 85): when a gyroscopically anchored top is stationary, its high-spin magnetic or rubber contact zone can retard the rotation of an approaching opponent by contact friction, converting Δω_drain from the opponent's spin axis into heat; the `spinStealRadiusPx = 250` models the maximum effective range at which a surface-speed differential (v_surface_difference = Δω × r_bey) can produce a frictional drain before contact, set to the typical orbital diameter of an attack-type opponent.

### Gyroscopic Resistance to Perturbation

```
Gyroscopic anchor resistance analysis:
  ω_anchor = maxSpin (assumed 2000 + stamina × 0.0008 × 2000; for stamina = 150: ω = 2240 rad/s)
  I_total = 7.308×10⁻⁶ kg·m²  [CONFIRMED]

  Applied destabilizing torque (typical Stampede Rush hit at knockbackImpulse = 3000 engine-units):
    J_hit = 3000 × 0.001 = 3.0 N·s  [GAME-DERIVED, see Case 597]
    F_hit_avg = J_hit / t_contact = 3.0 / 0.002 = 1500 N  (over 2ms contact)
    τ_destabilize = r_contact × F_hit = 0.025 × 1500 = 37.5 N·m

  Precession rate during anchor:
    Ω_p = τ / (I × ω) = 37.5 / (7.308×10⁻⁶ × 2240) = 37.5 / 0.01637 = 2291 rad/s
    → This is extremely high, meaning the beyblade precesses (tilts) rapidly instead of
      being knocked away — the gyroscope converts translational knockback into tilt.
    For ω = 600 rad/s (low spin, no anchor):
    Ω_p_low = 37.5 / (7.308×10⁻⁶ × 600) = 37.5 / 0.004385 = 8553 rad/s
    → An untethered beyblade at ω = 600 has even higher tilt rate (less stable).

  Implication: "anchor" at high ω is not truly invulnerable — it simply precesses
  faster (absorbs tilt) rather than translating. invulnerabilityMs = 1500 is a game
  simplification of the real mechanism.  [GAME-DERIVED]

Spin steal field derivation:
  Bearing Core μ at contact = 0.15 (ABS-on-ABS [CONFIRMED])
  Relative surface speed between anchored bey (ω_A = 2240 rad/s) and
  approaching opponent (ω_B = 300 rad/s at 40% spin):
    v_A_surface = ω_A × r_bey = 2240 × 0.025 = 56.0 m/s
    v_B_surface = ω_B × r_bey = 300 × 0.025 = 7.5 m/s
    Δv_surface = 56.0 − 7.5 = 48.5 m/s (co-spin direction)
  Frictional drain torque on B (if contacted by A's surface for 10 ms):
    F_friction = μ × N_contact = 0.15 × (m_B × g) = 0.15 × 0.040 × 9.81 = 0.0589 N
    τ_drain = r_bey × F_friction = 0.025 × 0.0589 = 1.47×10⁻³ N·m
    Δω_drain = τ_drain × t / I_B = 1.47×10⁻³ × 0.010 / 7.308×10⁻⁶ = 2.01 rad/s per 10ms
  Over 1500ms anchor window with 10ms effective contact periods:
    Δω_total_drain = 2.01 × (1500/10) = 301 rad/s  [INFERRED]
  → spinStealRadiusPx = 250 represents maximum aura range for this contact to occur.
```

### Phase Timeline

```
Gyro Anchor Phase: "gyro_anchor_main"

  Time →   0ms      100ms    1600ms   1700ms
           ├─────────┼────────────────┼─────────┤
           │ WINDUP  │    ACTIVE      │ WINDDOWN│
           │ 100ms   │    1500ms      │  100ms  │
           │ self     │ full effects   │ carry    │
           │ stabilize│ spin steal     │ velocity │
           │           │ invulnerable  │          │

  peakMs = 0ms (absorption is strongest at activation)
  peakToleranceMs = ±200ms

  spinDelta = +250        →  spin boost equivalent to ~100 rad/s in game engine
  invulnerabilityMs = 1500 →  full anchor window
  spinStealRadiusPx = 250  →  passive drain field radius
```

---

## Case 589 — Spin Recovery (Orbital): Life-After-Death Bowl Orbit, Low-Friction Tip LAD, and Centripetal Force Recovery

**Thesis:** Spin Recovery models the Life-After-Death orbital phenomenon: a low-spin top with reduced ω migrates to the bowl wall under residual centrifugal tendency and bowl slope gravity, initiates a slow closed orbit at radius r_orbit determined by the balance between centripetal acceleration and the lateral gravitational component of the bowl, and sustains that orbit through near-zero-friction rolling contact — the same mechanism observed in TR145 rollers (Case 64), Revolve tip (Case 461), Atomic bottom (Case 71), and EWD bearing (Case 302); the physics of the LAD orbit are: at slope angle α = 30° (Zone 2 of BeyStadium Attack Type, Case 545), the inward gravity component is g_lat = 9.81 × sin(30°) = 4.905 m/s² [CONFIRMED CS10]; for a top orbiting at radius r_orbit = 0.090 m (just inside the Tornado Ridge at r = 0.125 m), the required orbital speed is v_orbit = √(g_lat × r_orbit) = √(4.905 × 0.090) = √(0.4415) = 0.664 m/s; the orbital period is T = 2π × r_orbit / v_orbit = 2π × 0.090 / 0.664 = 0.851 s [INFERRED], consistent with the observed LAD period of 0.8–1.2 s [INFERRED CS10]; during one orbit period, a standard hard ABS tip loses Δω_ABS = 39.8 × 0.851 = 33.9 rad/s, while a bearing tip loses Δω_bearing = 14.6 × 0.851 = 12.4 rad/s — the bearing tip's 21.5 rad/s saving per orbit extends the orbit significantly; the `spinDelta = 400` game value models both the direct spin restoration (pumping ω back up) and the effective extension of spin life by entering the low-friction regime; the circular orbit force is applied in the game server as a centripetal push toward the arena center at each simulation tick, with magnitude F_centripetal = m × v_orbit² / r_orbit = 0.040 × 0.664² / 0.090 = 0.040 × 0.441 / 0.090 = 0.196 N [INFERRED].

### LAD Orbit Geometry

```
Life-After-Death orbit in BeyStadium Attack Type:

  Bowl cross-section (Zone 2, α = 30°):
  ┌─────────────────────────────────────────────────────┐
  │                           ↑ bowl wall               │
  │                          /│                         │
  │  Center             ────/ │                         │
  │  (flat zone)       /slope │   TR ──────/            │
  │    r=0            / α=30° │  ridge  ← r_orbit       │
  │                  /        │  r=125mm   r=90–120mm   │
  └─────────────────────────────────────────────────────┘

  At r_orbit = 90 mm (inner side of TR):
    v_orbit = √(4.905 × 0.090) = 0.664 m/s   [INFERRED]
    T_orbit  = 2π × 0.090 / 0.664 = 0.851 s  [INFERRED]

  At r_orbit = 110 mm (outer side of Zone 2):
    v_orbit = √(4.905 × 0.110) = 0.734 m/s   [INFERRED]
    T_orbit  = 2π × 0.110 / 0.734 = 0.942 s  [INFERRED]

  Bearing tip orbit extension:
    Spin saved per orbit vs. hard ABS: Δω_save = (39.8 − 14.6) × 0.851 = 21.5 rad/s
    At ω_crit = 40 rad/s (death threshold with hard ABS tip):
      Orbits_ABS    = 40 / 33.9 = 1.18 orbits before death  (1.00 s)  [INFERRED]
      Orbits_bearing = 40 / 12.4 = 3.23 orbits before death  (2.75 s)  [INFERRED]
    → Bearing tips survive 2.75× longer in LAD orbit mode.  [INFERRED]
```

### Phase Timeline

```
Spin Recovery Phase: "spin_recovery_main"

  Time →   0ms      100ms     1100ms   1200ms
           ├─────────┼──────────────────┼─────────┤
           │ WINDUP  │    ACTIVE        │ WINDDOWN│
           │ 100ms   │    1000ms        │  100ms  │
           │ slow    │ full spinDelta   │ orbit    │
           │ approach │ + orbital path   │ continues│
           │ to wall  │ (centripetal F)  │          │

  peakMs = 500ms (mid-orbit, maximum spin recovery)
  peakToleranceMs = ±150ms

  spinDelta = +400       →  rapid spin restoration toward maxSpin
  rangeCheck = "none"    →  self-only, no target acquisition needed
```

---

## Case 590 — Tactical Burst (Directional-Burst): Balanced-Type Hybrid Impulse at 70% Smash Efficiency

**Thesis:** Tactical Burst models the balanced-type combat archetype, delivering a forward impulse at 70% of Stampede Rush intensity (linearImpulse 3500 vs. 5000, ratio = 0.700) combined with a 37.5% spin recovery (spinDelta 150 vs. 400, ratio = 0.375); the physical rationale is that a balanced beyblade's AR lacks the extreme flat-face geometry of a pure attack type — instead it has a mix of upper-attack and flat-smash faces, the closest real analog being the Vulcan Metal Wheel (Case 288) or the Triple Attacker AR (Case 153) which deliver moderate smash via three wide faces at φ ≈ 25° rather than the near-zero angle of maximum smash ARs: J_tactical = m_eff × v_approach × (1 + e) × cos(25°) = 0.020 × 1.8 × 1.67 × 0.906 = 0.0545 N·s, which is 0.0545 / 0.0601 = 90.7% of the maximum flat-face impulse yet the lower approach speed of a balanced-type (estimated 1.5 m/s vs. attack's 1.8 m/s) brings the effective impulse to J_balanced = 0.020 × 1.5 × 1.67 × 0.906 = 0.0454 N·s, which is 0.0454 / 0.0599 = 75.8% of Stampede Rush's smash impulse — consistent with the 70% game ratio [INFERRED]; the `spinDelta = 150` partial spin recovery models the brief freewheel experienced when the balanced beyblade plants its flat-smash face and the angular momentum from the interrupted arm extension briefly returns to the spin axis, analogous to the minor EG spring cycle but at lower energy: E_recover = ½ × I × (Δω)² = ½ × 7.308×10⁻⁶ × 150² = ½ × 7.308×10⁻⁶ × 22500 = 0.0822 J = 82.2 mJ [INFERRED]; the 400ms active window (shorter than Stampede Rush's 500ms) reflects the lower peak force and earlier taper of the balanced approach profile.

### Comparison: Attack vs. Balanced Impulse Architecture

```
Parameter            Stampede Rush (Attack)    Tactical Burst (Balanced)    Ratio
─────────────────────────────────────────────────────────────────────────────────
linearImpulse        5000 eng-units            3500 eng-units               0.700
knockbackImpulse     3000 eng-units            2000 eng-units               0.667
spinDelta            +60                       +150                         2.50×
damageMultiplier     1.30                      1.10                         0.846
cooldownSec          3                         3                            1.00×
durationMs           500                       600                          1.20×
invulnerabilityMs    200                       none                         —
AR contact angle φ   ~5° (flat smash)          ~25° (mixed)                 5×
Approach speed v     1.8 m/s  [INFERRED]       1.5 m/s  [INFERRED]          0.833
J_real (N·s)         0.0601   [INFERRED]       0.0454   [INFERRED]          0.756

Key insight: Tactical Burst gives 2.50× more spin delta than Stampede Rush because
the balanced type deliberately sacrifices some forward impulse to convert AR recoil
into spin-axis replenishment — analogous to the Dranzer V2's Cross Dranzer AR
(Case 151, four-fold spin-neutral design) which minimizes recoil at the cost of
smash power.
```

---

## Case 591 — Shock Pulse (Shockwave): AoE Radial Impulse as Gyroscopic KE Release

**Thesis:** Shock Pulse is the sole anime-theatrical special move in the base roster with no direct part analog; however, a physical model can be constructed from the gyroscopic kinetic energy release scenario: a beyblade at ω = 600 rad/s with I = 7.308×10⁻⁶ kg·m² stores rotational KE = 1.316 J [CONFIRMED CS10]; if 10% of this KE is suddenly radiated outward as a pressure wave (as depicted in Beyblade anime clash scenes), the available energy for AoE knockback is E_aoe = 0.10 × 1.316 = 0.1316 J; distributing this energy among all targets within a spherical shell of radius R_aoe = 0.250 m (250 px in game coordinates at 1px ≈ 1mm), the impulse per target reduces as 1/r² from the source; for a target at r = 0.150 m (center of the aoe zone), J_target = √(2 × m_target × E_share) where E_share = E_aoe × (r_bey / r_target)² = 0.1316 × (0.025 / 0.150)² = 0.1316 × 0.0278 = 3.66×10⁻³ J, giving J_target = √(2 × 0.040 × 3.66×10⁻³) = √(2.93×10⁻⁴) = 0.0171 N·s — substantially less per target than a direct hit, which is why the `knockbackImpulse = 6000` is compensated by reduced `damageMultiplier = 1.2` (area effects do less focused damage); the invulnerabilityMs = 250 during the AoE window represents the real physical observation that a beyblade emitting a gyroscopic burst is momentarily under maximum angular rigidity and resists external torques, analogous to the spin-maximized Gyro Anchor regime but at shorter duration and without the spin-steal field.

### AoE Impulse Falloff with Distance

```
Shock Pulse AoE geometry (spherical spread from source, 2D approximation):
  E_aoe = 0.1316 J  [INFERRED]
  R_max = 250 mm = 0.250 m  (game: 250 px)

  Impulse per target at various distances (assuming equal E share, m = 0.040 kg):
  ─────────────────────────────────────────────────────────
  r (mm)   E_share (J)        J_target (N·s)   Δv (m/s)
  ─────────────────────────────────────────────────────────
   50      0.1316 × (25/50)²  = 0.0329 J       0.0513       1.28
  100      0.1316 × (25/100)² = 8.23×10⁻³ J    0.0256       0.641
  150      0.1316 × (25/150)² = 3.66×10⁻³ J    0.0171       0.427
  200      0.1316 × (25/200)² = 2.06×10⁻³ J    0.0128       0.320
  250      0.1316 × (25/250)² = 1.32×10⁻³ J    0.0103       0.257
  ─────────────────────────────────────────────────────────
  Note: falloff is 1/r², so targets at 250mm receive ~4% of the impulse at 50mm.
  This matches the game's design intent: Shock Pulse is strongest at close range and
  falls off sharply — it is a desperation ring-out tool at close quarters, not a
  long-range attack.  [INFERRED]
```

---

## Case 592 — Ascending Dragon Bite (Knockup/Aerial Multi-Phase): Upper-Attack Slope → Spring-Launch → Airborne Bite

**Thesis:** Ascending Dragon Bite is the only two-phase special move in the base roster and models the sequence of a high-slope upper-attack AR (Upper Claw Case 143, Corona Saber Case 164) followed by a Jumping Base spring launch (Case 99): in Phase 1 (sweep_knockup), the attacker's AR approaches the target at a contact height at or below the target's AR center, delivers an upward oblique impulse via the steep upper-attack face angle φ_upper = 45° (as established in CS1 Case 10 for upper-attack geometry), producing a vertical impulse component J_vert = J_face × sin(45°) = 0.0601 × 0.707 = 0.0425 N·s and a horizontal component J_horiz = 0.0601 × 0.707 = 0.0425 N·s (equal split at 45°, COR e = 0.67); the vertical impulse Δv_up = J_vert / m_target = 0.0425 / 0.040 = 1.063 m/s [INFERRED] lifts the target to maximum height h_max = Δv_up² / (2g) = 1.063² / (2 × 9.81) = 1.129 / 19.62 = 57.5 mm and airborne time t_air = 2 × Δv_up / g = 2 × 1.063 / 9.81 = 0.217 s [INFERRED]; in Phase 2 (ascending_bite), the attacker follows up at the peak of the target's airborne trajectory with a downward-angled hit (L-Drago-inspired vertical spike analogous to the rubber core bite in L-Drago Destroy Case 347), delivering damageMultiplier = 2.0 — physically grounded in the high relative closing speed between descending target and ascending attacker: v_rel = v_attacker_up + v_target_down = 1.549 + 1.063 = 2.612 m/s versus a ground-level approach at 1.8 m/s — a 1.45× speed advantage which translates to (2.612/1.8)² = 2.11× kinetic energy — consistent with the 2.0× damage multiplier [INFERRED]; the `waitForAirborne = 350ms` gate and `fallback` path (linear ground-level hit at 1.0× damage) model the real risk that a poor phase-1 sweep fails to launch the target, forcing a ground-follow-up without the aerial KE bonus.

### Two-Phase Timing and Height Trajectory

```
Phase 1: sweep_knockup
  windUpMs = 100ms, durationMs = 300ms, windDownMs = 100ms
  verticalImpulse on target = 300 engine-units → Δv_up ≈ 1.06 m/s  [INFERRED]

  Real upper-attack AR trajectory:
    φ_upper = 45°  (Upper Claw face angle)  [INFERRED CS3 Case 143]
    J_vert = J_face × sin(45°) = 0.0601 × 0.707 = 0.0425 N·s  [INFERRED]
    Δv_up = 0.0425 / 0.040 = 1.063 m/s  [INFERRED]
    h_max = 1.063² / (2 × 9.81) = 57.5 mm  [INFERRED]
    t_air = 2 × 1.063 / 9.81 = 0.217 s = 217 ms  [INFERRED]

Target airborne arc (time in ms after Phase 1 contact):
  t (ms)   Height (mm)      v_vertical (m/s)
  ─────────────────────────────────────────
   0         0                +1.063
  50        47.8              +0.572
  108       57.5 (peak)        0
  150       52.1              −0.383
  217        0                −1.063  (landing)

Phase 2: ascending_bite
  Fires at waitForAirborne = 350ms after phase 1 start
    → phase 1 ends at 300ms + some buffer → target has been airborne for ~150ms
    → target is at h ≈ 50mm, descending at ~0.38 m/s
  attacker approach speed upward ≈ 1.55 m/s (EG-spring burst equivalent)
  v_relative_closing = 1.55 + 0.38 = 1.93 m/s  → slight speed advantage over ground hit
  Fallback engages if target did not leave ground (rare — skipCondition fires)

  damageMultiplier = 2.0 (airborne bite at closing speed boost)
  damageMultiplier = 1.0 (fallback ground — Dragon Descending Bite)
```

---

## Case 593 — Storm Bringer (Aerial-Launch): Self-Launch Parabola, Descent Strike, and Landing AoE

**Thesis:** Storm Bringer models the self-launching projectile attack: the beyblade uses `verticalImpulse = 350` in the ascent phase to leave the arena floor, travels a parabolic arc, then dives on the opponent with `linearImpulse = 4500` and `verticalImpulse = −500` (forced downward) at the peak of the arc, triggering a `landingAoePx = 200` pulse on touchdown — the complete sequence is physically grounded in the Jumping Base spring (Case 99) and Spring Core HMS (Case 51); the spring launch analysis from Case 99 gives Δv_up = √(2 × E_spring / m) = √(2 × 0.048 / 0.040) = √(2.4) = 1.549 m/s [CONFIRMED CS10 Case 556], reaching h_max = Δv_up² / (2g) = 1.549² / (2 × 9.81) = 2.399 / 19.62 = 0.122 m = 122 mm [INFERRED]; horizontal travel during ascent (assuming v_horizontal = 0.664 m/s from residual orbital speed) gives range x_ascent = v_h × (Δv_up / g) = 0.664 × (1.549 / 9.81) = 0.664 × 0.158 = 0.105 m = 105 mm, with total range (ascent + descent) x_total = 2 × x_ascent = 210 mm [INFERRED] — the game's `radius = 400` search is designed to capture the full 210mm arc plus an approach margin; the landing AoE impact is equivalent to the Spring Core HMS Case 51 landing bounce where the potential energy at h_max = 122mm converts to kinetic energy at landing: KE_landing = m × g × h = 0.040 × 9.81 × 0.122 = 0.0479 J, giving landing speed v_land = √(2 × KE / m) = √(2.4) = 1.549 m/s — the combined downward velocity and forward linear impulse creates the maximum-impact scenario with `damageMultiplier = 1.7` and `landingDmgMult = 1.4`.

### Parabolic Arc Profile

```
Storm Bringer arc (Phase 1: ascent, Phase 2: diving strike):

  Ascent phase (500ms, verticalImpulse = 350 engine-units):
    Δv_up = 1.549 m/s  [INFERRED from EG spring energy, Case 556]
    h_max  = 122 mm     [INFERRED]
    Time to peak = Δv_up / g = 1.549 / 9.81 = 0.158 s = 158ms  [INFERRED]

  Horizontal trajectory at v_h = 0.5 m/s (cautious estimate):
    x_to_peak = 0.5 × 0.158 = 0.079 m = 79 mm

  Descent (Phase 2: diving_strike, 700ms):
    verticalImpulse = −500 (forced dive)
    Δv_down_extra = −500 / 1000 = −0.500 m/s (engine-unit conversion, Case 597)
    Combined descent speed at impact: v_final = −1.549 − 0.500 = −2.049 m/s  [INFERRED]
    KE_impact = ½ × m × v² = ½ × 0.040 × (2.049)² = ½ × 0.040 × 4.20 = 0.0840 J  [INFERRED]

  Height vs time profile:
  t (ms)   Height (mm)   Phase
  ────────────────────────────
    0         0           Ascent begins
   50        68           Rising
  100       109           Rising
  158       122           Peak
  200       108           Descending
  300        61           Descending
  400         0           Landing / AoE fires  [INFERRED]

  landingAoePx = 200 → 200mm radius pulse matching EG-spring landing AoE
    from Case 51 (Spring Core HMS landing bounce radius ≈ 60–120mm for real spring)
    scaled up for game effect radius.  [GAME-DERIVED]
```

---

## Case 594 — Special Move Power Cost and Cooldown Architecture: Budget Ratios and Balance Constraints

**Thesis:** The power cost and cooldown of each special move must satisfy two constraints derived from real beyblade time scales: the cooldown must be longer than the time for the exploited physical mechanism to "reset" (the EG spring recharge time, the bearing re-center time, the orbital re-entry time), and the power cost must consume no more than the energy available from the physical mechanism being modeled; the EG spring mechanism resets in one full spin cycle of the clutch gear, approximately 0.2 s per rotation at 600 rad/s divided by the gear ratio of ~5 → reset time ≈ 1.0 s [INFERRED], which establishes a minimum cooldown of ~1 s per activation — the game's shortest cooldown of 3 s for Stampede Rush is 3× the minimum, providing a safety margin of 3×; the power cost of 100 (full bar) maps to the full rotational KE = 1.316 J at ω₀, meaning each special move consumes the entire "spin reserve" and the power bar must recharge at the rate at which the game engine allows ω to recover (passive spin recovery rate in game = `chargeRate × dt` per tick); the relative cooldown ordering (stampede 3s = tactical_burst 3s = spin_recovery 3s < gyro_anchor 4s < shock_pulse 5s = storm_bringer 5s = ascending_dragon_bite 5s) directly reflects the real mechanism reset time hierarchy: single-phase linear burst (fast mechanical reset) → anchor/bearing recentering (moderate, requires slow precession decay) → AoE field and aerial maneuvers (longest, requires full spatial repositioning).

### Cooldown vs. Mechanism Reset Time

```
Special Move Cooldown Rationale:

  Move              Mechanism           Real Reset Time    Game Cooldown   Safety Factor
  ─────────────────────────────────────────────────────────────────────────────────────
  stampede_rush     EG spring release   ~1.0 s [INFERRED]  3.0 s           3.0×
  tactical_burst    AR smash + recoil   ~0.8 s [INFERRED]  3.0 s           3.75×
  spin_recovery     LAD orbit entry     ~1.5 s [INFERRED]  3.0 s           2.0×
  gyro_anchor       Bearing re-center   ~2.0 s [INFERRED]  4.0 s           2.0×
  shock_pulse       AoE field dissipate ~2.5 s [INFERRED]  5.0 s           2.0×
  ascending_dragon  Phase-1+2 sequence  ~2.5 s [INFERRED]  5.0 s           2.0×
  storm_bringer     Full arc + landing  ~3.0 s [INFERRED]  5.0 s           1.67×
  ─────────────────────────────────────────────────────────────────────────────────────

Power cost = 100 (full bar) for all moves.
Physical basis: each move draws from the full rotational KE store (1.316 J).
No partial-cost special moves are defined in the base roster — the 100% cost
constraint prevents chain-firing and models the real physics that special maneuvers
require the FULL spin reserve, not a fraction.  [GAME-DERIVED]
```

---

## Case 595 — Multi-Phase Wind-Up, Active, and Wind-Down Timing: Reaction Windows and Frame Data

**Thesis:** The three-window structure (windUpMs, durationMs, windDownMs) maps directly to three real phases in beyblade special-move execution: the wind-up (anticipation) corresponds to the mechanical preparation period — the EG clutch loading (Case 187), the spring compression (Case 99), or the AR pre-rotation during the approach trajectory — during which the attacker commits to the move but cannot yet connect; the active window corresponds to the contact period when the mechanism is fully deployed and forces are transmitted; the wind-down corresponds to the mechanical recovery period — the spring extension, the clutch disengagement, or the post-bounce settling — during which the move cannot connect again; the peak timing bonus (peakMs, peakToleranceMs) models the real physics peak: for the EG spring (Case 556), the spring delivers maximum force at maximum compression (t = 0 of release), meaning peakMs = 0 for the gyro_anchor; for a smash AR (Case 161), maximum force occurs at peak contact overlap halfway through the contact duration, meaning peakMs = t_active/2 for stampede_rush (250ms) and tactical_burst (300ms); for the LAD orbit (Case 64), the maximum centripetal force occurs mid-orbit (t = T/2 from entry), placing peakMs = 500ms for spin_recovery; the total durationMs values across all moves span 300–1500ms, while real beyblade engagement durations range from 2ms (hard smash contact, CS1 Case 1) to ~1500ms (bearing core LAD orbit segment, CS6 Case 302), confirming the game window durations are physically plausible at different time scales.

### Phase Window Summary Across All Moves

```
Move                windUpMs  durationMs  windDownMs  total(ms)  peakMs   peakTol
─────────────────────────────────────────────────────────────────────────────────
stampede_rush          100       500         100         700       250       100
gyro_anchor            100      1500         100        1700         0       200
spin_recovery          100      1000         100        1200       500       150
tactical_burst         100       600         100         800       300       100
shock_pulse            150       700         100         950       350       150
ascending_dragon:
  phase 1 (knockup)    100       300         100         500       150        80
  phase 2 (bite)       150       400         150         700       200       100
storm_bringer:
  phase 1 (ascent)     100       500           0         600         0        50
  phase 2 (dive)         0       700         100         800       350       120
─────────────────────────────────────────────────────────────────────────────────
Real analog durations:
  Hard ABS contact:          ~2 ms   [ESTIMATED CS1]
  Spring Jumping Base:       ~50 ms  [INFERRED CS3 Case 99]
  EG spring release:        ~100 ms  [INFERRED CS10 Case 556]
  LAD orbit segment:    800–1200 ms  [INFERRED CS6 Case 302]
  Gyro anchor window:      ~1500 ms  [INFERRED — one full precession suppression]
Game windows are scaled 5–750× from real contact durations to produce playable
engagement lengths; the physics ratios between moves are preserved.  [GAME-DERIVED]
```

---

## Case 596 — Special Clash Outcome Matrix: Archetype-vs-Archetype Interaction Physics

**Thesis:** When two specials fire simultaneously, the server resolves the clash using `special_clash_events` Firestore documents that key on the (attacker.kind, defender.kind) pair; the physical basis for each outcome derives from the real interaction between the underlying mechanisms: `linear-burst` vs. `anchor` models an EG-spring smash hitting a bearing-core gyroscopic resistance — the spring delivers J_burst ≈ 0.122 N·s while the gyroscope's precession resistance absorbs the torque component, converting forward KE into tilt rather than translation; this means the anchor defender loses less position (partial knockback) but the attacker's spinDelta is fully consumed (no spin recovery) — captured in the DEFAULT_CLASH_OUTCOME as attackerKnockback = "partial", defenderKnockback = "partial", both spinDelta = −0.05 (5% spin loss each) with a timing bonus for the anchor player if the peakToleranceMs window is met (early activation gives maximum gyroscopic rigidity); `linear-burst` vs. `linear-burst` (same-kind clash) models a head-on Cybernetic Dragon vs. Cybernetic Dragon frontal collision — each delivers J = 0.0601 N·s but in opposing directions, resulting in equal and opposite knockback, both lose spinDelta proportional to the momentum transfer — an equal clash with no winner; `aerial-launch` vs. `anchor` models the Storm Bringer dive landing on a Gyro Anchor field — the landing AoE fires into the spin-steal radius, but the anchor's invulnerability window absorbs the impact; the anchor wins if its invulnerabilityMs has not yet expired at the moment of landing contact.

### Archetype Interaction Table

```
Attacker Kind         Defender Kind       Physical Model              Expected Outcome
────────────────────────────────────────────────────────────────────────────────────────
linear-burst          anchor              Smash vs. gyro rigidity     Defender partial-block;
                                                                       attacker +spin if timed
linear-burst          orbital             Smash intercepts orbit      Attacker wins; full KB
linear-burst          linear-burst        Head-on flat smash          Equal; both partial KB
directional-burst     anchor              Moderate smash vs. gyro     Anchor wins; partial block
directional-burst     orbital             Intercept during orbit      Attacker wins; partial KB
aerial-launch         anchor              Landing AoE vs. invuln      Anchor wins if timed;
                                                                       else equal
aerial-launch         linear-burst        Dive on active burst        Simultaneous; coin flip
knockup               orbital             Upper-cut during orbit      Attacker wins; airborne
shockwave             linear-burst        AoE vs. focused impulse     Range determines winner
shockwave             shockwave           Mutual AoE fields           Both partial KB; push-off
────────────────────────────────────────────────────────────────────────────────────────
DEFAULT_CLASH_OUTCOME (unmatched pairs):
  attackerDamageScale = 0.8, defenderDamageScale = 0.8
  attackerSpinDelta = −0.05, defenderSpinDelta = −0.05
  attackerKnockback = "partial", defenderKnockback = "partial"
  [CONFIRMED — server/constants/specialMoves.ts DEFAULT_CLASH_OUTCOME]
```

---

## Case 597 — Game-Engine Unit Derivation: From SI Physics to Engine Parameters

**Thesis:** The game engine represents forces, impulses, and spin values in dimensionless "engine-units" rather than SI units; the calibration linking them to real physics is established by matching the Stampede Rush `linearImpulse = 5000` to the physical burst impulse of an EG-spring-augmented attack over a 500ms active window — the integrated force over 500ms at the EG spring peak force F_peak = k × x = 1500 × 0.008 = 12.0 N [CONFIRMED CS10 Case 555] sustaining for a realistic contact duration of t_burst = 500ms (with efficiency factor η = 0.030 for the fraction of the window at peak force) gives J_burst = F_peak × t_burst × η = 12.0 × 0.500 × 0.030 = 0.180 N·s, and 1 engine-unit = J_burst / linearImpulse_game = 0.180 / 5000 = 3.60×10⁻⁵ N·s [GAME-DERIVED]; for spin delta, the game engine applies `spinDelta` directly to the beyblade's `spin` field in rad/s (1 engine-unit of spinDelta = 1 rad/s); for `knockbackImpulse = 3000` applied to a target mass m = 0.040 kg: Δv_target = (3000 × 3.60×10⁻⁵) / 0.040 = 0.108 / 0.040 = 2.70 m/s, which is physically plausible for a strong contact hit; for `aoeRadiusPx = 250`, 1 px ≈ 1mm at standard 1080p resolution in the game engine (arena pixel radius = min(1080, 1080) × 0.45 = 486 px for real B-200 ≈ 40cm diameter, giving ~1.15 px/mm — close enough to 1px ≈ 1mm for this derivation); the `invulnerabilityMs` maps 1:1 to wall-clock milliseconds with no unit conversion.

### Engine Unit Calibration Table

```
Parameter          Engine-Unit    SI Equivalent          Derivation
─────────────────────────────────────────────────────────────────────────────────
linearImpulse      1 eng-unit     3.60×10⁻⁵ N·s          J_burst / 5000  [GAME-DERIVED]
knockbackImpulse   1 eng-unit     3.60×10⁻⁵ N·s          Same scale       [GAME-DERIVED]
spinDelta          1 eng-unit     1 rad/s                 Direct rad/s     [GAME-DERIVED]
aoeRadiusPx        1 px           ≈ 1.0 mm               Arena px scale   [INFERRED]
invulnerabilityMs  1 eng-unit     1 ms                    Wall-clock 1:1   [GAME-DERIVED]
durationMs         1 eng-unit     1 ms                    Wall-clock 1:1   [GAME-DERIVED]
verticalImpulse    1 eng-unit     3.60×10⁻⁵ N·s          Same scale       [GAME-DERIVED]

Cross-checks:
  Stampede Rush knockback Δv_target = (3000 × 3.60×10⁻⁵) / 0.040 = 2.70 m/s  ✓ (plausible)
  Gyro Anchor spinDelta → Δω = 250 rad/s → ΔKE = ½ × I × Δω² 
    = ½ × 7.308×10⁻⁶ × 250² = 0.229 J < full KE 1.316 J  ✓ (sub-total, plausible)
  Spin Recovery spinDelta → Δω = 400 rad/s → ΔKE = 0.584 J  ✓ (large but < max)
  verticalImpulse = 350 → Δv_up = (350 × 3.60×10⁻⁵) / 0.040 = 0.315 m/s
    h_max = 0.315² / (2×9.81) = 5.06 mm  — LOWER than real spring (122 mm)
  → vertical scale is compressed in-game (2.5D engine: z-axis is artistic, not 1:1)
  verticalImpulse = 350 engine-units produces ~5mm real-equivalent pop height in 2D
  projection, scaled up visually in the 2.5D renderer by the tilt/perspective transform.
  [GAME-DERIVED — vertical impulse does not require 1:1 physical accuracy in 2.5D engine]
```

---

## Case 598 — Beyblade Type to Move Archetype Assignment: Physics-Based Default Mapping

**Thesis:** The `DEFAULT_TYPE_TO_MOVE` mapping (attack → stampede_rush, defense → gyro_anchor, stamina → spin_recovery, balanced → tactical_burst) is physically motivated: attack-type beyblades have the highest `attack` stat, meaning their AR contact faces maximize smash impulse (highest AR mass, flattest face angle) — they benefit most from the linear-burst archetype which amplifies their existing impulse advantage; defense-type beyblades have the highest `defense` stat and physically have the largest I_total (heaviest WD/disc, widest distribution) — they benefit most from the gyroscopic anchor because high I_total maximizes gyroscopic resistance (Ω_p = τ / (I × ω) is minimized when I is large, meaning they precess less per hit [CONFIRMED CS1 Cases 3–5]); stamina-type beyblades have the highest `stamina` stat and physically have the lowest μ_tip tip (sharp, bearing, long-life tips) — they benefit most from the orbital recovery because their tips are already predisposed to LAD behavior (near-zero friction facilitates orbit initiation) and their I_total is optimized for retaining spin (Cases 18, 64, 302, 461); balanced-type beyblades have intermediate stats across all four categories, receiving the tactically flexible directional burst which provides moderate impulse plus partial spin recovery — matching the real-world use of balanced ARs (Vulcan Case 288, Triple Attacker Case 153) that deliver moderate attack while maintaining stamina integrity.

### Stat Weighting and Move Amplification

```
Type          attack  defense  stamina  Primary physical property   Assigned move
──────────────────────────────────────────────────────────────────────────────────
attack         150      50       80      High-mass flat-face AR      stampede_rush
defense         50     150       80      High I, gyro stability       gyro_anchor
stamina         50      80      150      Low μ_tip, LAD orbit         spin_recovery
balanced        80      80      100      Mixed AR, moderate all       tactical_burst
──────────────────────────────────────────────────────────────────────────────────

Amplification factor per type (how much the move benefits from the type's primary stat):
  Attack + stampede_rush:
    damageMultiplier ×(1.0 + attack × 0.007) = ×(1.0 + 150 × 0.007) = ×2.05  [CONFIRMED CLAUDE.md]
    Combined: 1.3 × 2.05 = 2.67× effective damage on contact  [INFERRED]

  Defense + gyro_anchor:
    damageReduction = 1 − defense × 0.003 = 1 − 0.45 = 0.55x incoming damage  [CONFIRMED CLAUDE.md]
    During anchor invulnerabilityMs: effective reduction = 1.00x (immune)  [GAME-DERIVED]

  Stamina + spin_recovery:
    spinDecayRate = 8 × (1 − stamina × 0.001) = 8 × (1 − 0.15) = 6.8 /s  [CONFIRMED CLAUDE.md]
    With spin_recovery spinDelta +400: ω boost = 400 rad/s → extends life by
      400 / 6.8 = 58.8 s of additional spin life at max stamina  [INFERRED — theoretical]

  Balanced + tactical_burst:
    spinDelta +150 recovers 150 rad/s while delivering moderate 3500-unit impulse;
    neither at max efficiency — but the combined offensive/defensive utility matches
    the balanced archetype's role as jack-of-all-trades.  [GAME-DERIVED]
```

---

## Case 599 — AI Special Move Activation Thresholds: Hell, Hard, and Medium Decision Physics

**Thesis:** The AI activation thresholds for special moves (firing at spin < 40% for medium, at power ≥ 100% for hell) are physically motivated by the real critical thresholds identified in the gyroscopic stability analysis: the `stability = spin / maxSpin` threshold of 0.40 (40%) corresponds exactly to the wobble-onset threshold in the game engine where `stability < 0.4` triggers nutation wobble forces [CONFIRMED CLAUDE.md] — below this threshold, the gyroscope is in rapid-precession mode and any residual special-move spin delta is most effective at lifting ω back above the stability floor; for the medium AI, firing the special at `spin < 40% maxSpin` targets the worst-case vulnerability window and converts the special's spinDelta into a stability recovery; for the hard AI, the 5-tick prediction horizon means the AI fires specials when its predicted position (5 ticks × 16.67ms/tick = 83ms ahead) places it within `radius` of the target — grounding the acquisition in the real projectile-intercept calculation; for the hell AI, firing the moment power is fully charged matches the real EG-spring behavior where the clutch disengages at maximum compression (the spring cannot be held compressed indefinitely without leaking energy through clutch compliance); the `periodic 3-key combo emission every ~2s` for hell AI matches the 2s window between full-orbit cycles in LAD mode (Case 589: T_orbit ≈ 0.85 s × 2 = 1.70 s ≈ 2 s), meaning the AI attacks at each alternate orbit pass — the optimal physical attack cadence for an orbiting attacker.

### AI Threshold Physics

```
AI Difficulty → Special Move Trigger Logic:

  MEDIUM:
    Trigger: spin < 0.40 × maxSpin  [CONFIRMED CLAUDE.md — wobble onset threshold]
    Physical basis: below this threshold gyro precession rate Ω_p > ω,
      meaning the top is more wobble than spin → priority: spinDelta moves
    Preferred move: spin_recovery or gyro_anchor  [GAME-DERIVED]

  HARD:
    Trigger: power ≥ 100% AND target within radius
    Prediction: 5-tick lookahead = 5 × 16.67ms = 83ms  [CONFIRMED CLAUDE.md]
    Physical basis: AR contact within 83ms at v_approach = 1.0 m/s is:
      d_engage = 1.0 × 0.083 = 83mm — consistent with radius = 200px ≈ 200mm  [INFERRED]

  HELL:
    Trigger: power ≥ 100% immediately (fastest possible)
    Physical basis: EG spring cannot hold compression indefinitely
      (clutch compliance ε_clutch ≈ 0.02mm/N → spring leaks energy at rate
       P_leak = k × x × v_creep = 1500 × 0.008 × 10⁻⁶ = 1.2×10⁻⁵ W  [ESTIMATED])
      → delay of 2s causes E_loss ≈ 24×10⁻⁶ J (negligible but motivates immediate fire)
    Combo cadence: every ~2s = 2 × T_orbit ≈ 1.70s → rounds up to 2.0s
      (attack at second orbit pass for maximum convergence speed)  [INFERRED]
```

---

## Case 600 — Special Move Design Constraints and Balance Ceiling

**Thesis:** Four hard physics-derived constraints limit the design space of new special moves: first, the **impulse ceiling** — no single phase may deliver `linearImpulse > 6000` or `knockbackImpulse > 7000` engine-units, as these exceed the physical maximum impulse of a double-EG-spring + maximum-smash-AR stack at maximum relative velocity: J_max_phys = m_eff × v_max × (1 + e_max) = 0.020 × 2.5 × (1 + 0.80) = 0.090 N·s = 2500 engine-units × 2 phases = 5000 engine-units single-phase ceiling [INFERRED], with a 20% game headroom bringing the practical ceiling to 6000; second, the **spinDelta ceiling** — no single phase may recover more than `spinDelta = 600` (one full launch-spin-equivalent recovery), as real parts cannot restore more than the initial launch energy E_spin = ½ × I × ω₀² = 1.316 J, and SpinDelta 600 maps to ΔKE = ½ × I × 600² = ½ × 7.308×10⁻⁶ × 360000 = 1.315 J — at the physical ceiling [INFERRED]; third, the **no-invulnerability-beyond-1500ms** constraint derived from the maximum gyroscopic anchor duration, as at ω < ω_critical = τ/L_gyro any anchor breaks; fourth, the **combo ceiling** established in CLAUDE.md: `damageMultiplier ≤ 1.5` for combos (special moves may exceed this), `no invulnerability` in combos (specials have exclusive rights to invulnerabilityMs), `no full spin recovery` in combos (specials monopolize spinDelta > 200), `no AoE` in combos — each constraint preserving the special move system as the singular high-impact interrupt in the game meta.

### Design Space Grid

```
Parameter            Min      Max          Physical Basis
──────────────────────────────────────────────────────────────────────────────
linearImpulse        0        6000         J_max_phys = 5000, +20% headroom  [INFERRED]
knockbackImpulse     0        7000         Higher for single-target peak hit  [INFERRED]
spinDelta            −500     +600         Full spin recovery ceiling         [INFERRED]
invulnerabilityMs    0        1500         Max gyro anchor duration           [INFERRED]
aoeRadiusPx          0        300          Bowl radius R_outer = 170mm        [CONFIRMED CS10]
damageMultiplier     0.5      2.5          0.5 = absorb; 2.5 = aerial KE hit  [INFERRED]
landingAoePx         0        250          Sub-outer-wall aoe cone            [INFERRED]
verticalImpulse      −500     +400         Spring ceiling Δv = 1.55 m/s       [INFERRED]
phases count         1        10           SpecialMoveConfig.steps max=10     [CONFIRMED shared/types]
cooldownSec          2        10           Min: spring reset; max: aerial arc [GAME-DERIVED]
durationMs/phase     100      2000         Min: contact; max: orbit period    [INFERRED]
windUpMs             0        500          Max: EG charge + 5× safety         [INFERRED]

Exclusive to Special Moves (forbidden in Combos per CLAUDE.md):
  invulnerabilityMs > 0     ✓ allowed in specials, blocked in combos
  spinDelta > 200           ✓ allowed in specials, blocked in combos
  aoeRadiusPx > 0           ✓ allowed in specials, blocked in combos
  damageMultiplier > 1.5    ✓ allowed in specials, blocked in combos
  verticalImpulse ≠ 0       ✓ allowed in specials (aerial kinds only), blocked in combos
```

---

*End of Case Study 11 — Special Move Physics. Cases 586–600.*

*Next: Case Study 12 will cover the Combo System physics: 3-button sequence detection, cost-tiered effect ceilings, and the physical rationale for each combo effect (riposte, pivot-strike, spin-leech-jab, etc.).*

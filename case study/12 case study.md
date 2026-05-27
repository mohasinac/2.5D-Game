# Beyblade Case Studies — Part 12: Combo System Physics

**« Part 11:** [11 case study.md](11%20case%20study.md) (Cases 586–600)

**Scope:** The 3-button combo system — its real-world beyblade physics basis, per-combo effect derivation, detection window mechanics, cost tier balancing, ceiling constraints, and game-engine parameter mapping. Cases 601–620 cover the full live combo roster plus the meta-mechanics of sequence detection, sliding window, power thresholds, type restrictions, and the design boundary between combos and special moves.

---

## Style Rules (carry forward from CS11)

--

- No em-dashes in prose: use colons or semicolons
- No bullets in the Thesis paragraph
- All numeric results to 3 significant figures
- Inherited constants: μ_ABS = 0.17, μ_rubber = 0.50, e_ABS = 0.65–0.70, e_metal = 0.80, EG spring E = 48 mJ, I_MFB = 7.308×10⁻⁶ kg·m², ω₀ = 600 rad/s [all CONFIRMED CS10–CS11]
- Engine unit conventions from CS11 Case 597: 1 linearImpulse unit = 3.60×10⁻⁵ N·s; 1 spinDelta unit = 1 rad/s
- Combo impulse formula: J = m_eff × Δv × (1 + e); m_eff = m₁m₂/(m₁+m₂) = 0.020 kg for two equal 40g beys
- Combo ceiling rules from CLAUDE.md: damageMultiplier ≤ 1.5; lockMs ≤ 300; no invulnerability; no AoE; spinDelta ≤ 50 (microSpinBoost); spinStealBonus ≤ 0.10
- All game-engine parameter derivations tagged [GAME-DERIVED]

---

## Case 601 — Combo System Taxonomy: Three Real Beyblade Movement Categories That Map to 3-Button Sequences

**Thesis:** Every combo in the game maps to one of three physical movement archetypes observed in real beyblade battles: the **directional dash** — a rapid translational acceleration achieved by a blader's launch angle adjustment or a rubber-tip grip burst (RF, R²F, rubber grip base Cases 108a, 77, 38) that propels the beyblade 50–100mm laterally within one orbit period — which maps to the `dashDirection` effect and `forceImpulse` field in the combo registry; the **contact modifier** — the brief amplification of a collision impulse caused by a high-angle AR face catching the opponent's AR at the optimal contact geometry (flat face at φ ≈ 5° for maximum smash per CS11 Case 587, or slope face at φ ≈ 45° for upper-attack per CS1 Case 10) — which maps to the `damageMultiplier` field; and the **spin interaction** — the surface-friction-mediated exchange of angular momentum between two beyblades in prolonged contact (Advance Balancer spin-steal Case 85, L-Drago rubber ER spin-steal Case 30, Meteo L-Drago composite Case 32) — which maps to the `spinStealBonus` and `microSpinBoost` fields; the 3-button sequence gate is not physically derived from any hardware but models the blader's input timing skill — a real beyblade battle has no input system, so the sequence serves as a proxy for the precision of the blader's launch and position decisions, which in real play determine whether the encounter geometry produces a dash, a boosted hit, or a spin-steal contact; the four free combos (cost 0) correspond to naturally occurring battle events that happen spontaneously from good positioning, while the four power-costing combos represent deliberate tactical commitments that consume stored spin energy (the power bar).

### Archetype Map

```
Physical Phenomenon              Real Part Examples               Combo Effect Field
──────────────────────────────────────────────────────────────────────────────────────
Directional dash                 RF rubber flat (38, 297)         dashDirection
  (grip-burst lateral sprint)    R²F right rubber flat (38, 293)  forceImpulse
                                 Grip Base (108a)
                                 Storm Grip Base (105)

Contact modifier                 Double Attacker flat φ=0° (161)  damageMultiplier
  (boosted-hit geometry)         Cross Fang AR slope (Case 95)
                                 Triple Attacker (153)
                                 Power Thrust / Riposte

Spin interaction                 Advance Balancer spin-steal (85) spinStealBonus
  (angular momentum transfer)    L-Drago II rubber ER (30)        microSpinBoost
                                 Meteo L-Drago composite (32)
                                 Spin-Leech Jab

──────────────────────────────────────────────────────────────────────────────────────
Cost tier → physical meaning:
  Cost 0  (free)   = naturally occurring — no deliberate spin investment required
  Cost 15 (cheap)  = light spin investment (~15% of full power bar)
  Cost 25 (medium) = moderate spin investment
  Cost 35 (heavy)  = significant spin investment: 35% of bar — approaches EG spring budget
                     (EG spring = 48 mJ ≈ 3.65% of full rotational KE = 1.316 J, but
                     the power bar is an abstracted resource, not a direct KE scale)
```

### Combo Ceiling vs. Special Move Boundary

```
                    Combos            Special Moves         Physical Basis
──────────────────────────────────────────────────────────────────────────────────
damageMultiplier    ≤ 1.5             ≤ 2.5                 AR face angle limit:
                                                             cos(0°)=1.0 → smash_mult=1.3;
                                                             aerial closing speed → 2.0+
lockMs              ≤ 300ms           ≤ 2000ms              Real contact duration:
                                                             2ms (hard hit) vs 1500ms (anchor)
invulnerabilityMs   0 (forbidden)     ≤ 1500ms              Gyro rigidity window (bearing)
AoE                 forbidden         ≤ 300px               Gyroscopic KE release radius
spinDelta           ≤ 50 (micro)      ≤ 600 (full)          Bearing LAD saves vs full EG burst
cost                0–35              100 (full bar)         EG spring = full KE commitment
powerBar fraction   0–35%             100%                   Single EG spring release
──────────────────────────────────────────────────────────────────────────────────
```

---

## Case 602 — Sequence Detection Window (windowMs): Real-World Input Timing Basis

**Thesis:** The 3-button sequence detection window (`windowMs`) represents the physical time available for a beyblade to execute a real positional maneuver: at a typical attack-type approach speed of 1.8 m/s, crossing the engagement radius of 0.100 m (100mm diameter orbit approach distance) takes t_cross = 0.100 / 1.8 = 55.6 ms [INFERRED], meaning any combo that must be triggered "during the approach" would need all 3 keys entered within ~55ms — far too fast for human input; the game instead models the time for a deliberate tactical decision, estimated from the time for one orbit arc segment (quarter-orbit) at the orbital speed derived in CS11 Case 589: v_orbit = 0.664 m/s, arc length = π × r_orbit / 2 = π × 0.090 / 2 = 0.141 m, time = 0.141 / 0.664 = 0.213 s = 213ms [INFERRED]; this is consistent with the windowMs values across all combos: 400ms (dash combos), 450ms (mixed combos), 500ms (guard-based combos) — all within 1–2 quarter-orbit periods; the guard-tap window at 500ms is the widest because a real beyblade in defensive gyroscopic mode (bearing core, high I) takes longer to commit to a positional adjustment, while attack-type dashes at 400ms reflect the faster translational commitment of a rubber-tip sprinting approach.

### Window Timing Analysis

```
Quarter-orbit arc at three orbital radii (CS11 Case 589 geometry):

  r_orbit = 90mm:   v = 0.664 m/s  →  T_quarter = (π×0.090/2) / 0.664 = 213ms  [INFERRED]
  r_orbit = 110mm:  v = 0.734 m/s  →  T_quarter = (π×0.110/2) / 0.734 = 236ms  [INFERRED]
  r_orbit = 125mm:  v = 0.784 m/s  →  T_quarter = (π×0.125/2) / 0.784 = 251ms  [INFERRED]

  Combo windowMs values vs. arc timing:
  ──────────────────────────────────────────────────────────────────────────────
  Combo           windowMs   Real analog                       Arc-time multiple
  ──────────────────────────────────────────────────────────────────────────────
  quick-dash-l/r    400ms    Aggressive attack approach        ~1.7–1.9 × T_quarter
  feint             450ms    Side-dodge repositioning          ~1.9–2.1 × T_quarter
  pivot-strike      450ms    Pivot then close                  ~1.9–2.1 × T_quarter
  power-thrust      450ms    Commit attack                     ~1.9–2.1 × T_quarter
  spin-leech-jab    450ms    Orbit-contact steal               ~1.9–2.1 × T_quarter
  guard-tap         500ms    Defensive gyro set-up             ~2.1–2.3 × T_quarter
  riposte           500ms    Parry-wait-counter                ~2.1–2.3 × T_quarter
  ──────────────────────────────────────────────────────────────────────────────
  All windows span ~1.7–2.3 quarter-orbit periods — physically the range within
  which a deliberate positional decision can unfold before the geometry closes.
  [INFERRED]

Sliding-3 window detection (comboSystem.ts pruneHistory):
  maxWindowMs = 600ms by default (wider than any single combo window)
  History kept: entries within last 600ms
  Match check: last 3 entries must each be within their combo's windowMs
  This allows partial overlapping attempts without discarding valid sequences.
```

---

## Case 603 — Quick Dash Left / Right (Directional Dash, Free): Rubber-Tip Grip-Burst Lateral Sprint

**Thesis:** Quick Dash Left (←←J) and Quick Dash Right (→→J) model the rubber-flat tip grip-burst phenomenon: a rubber flat tip (RF, R²F, rubber Grip Base) in contact with the ABS floor has μ_rubber = 0.50 [CONFIRMED CS10], generating a traction force F_grip = μ_rubber × m × g = 0.50 × 0.040 × 9.81 = 0.196 N; when an attack-type beyblade is deflected toward the outer wall and its rubber tip digs in at full contact, the lateral force over a grip-burst duration of t_burst ≈ 150ms produces a directional impulse J_burst = F_grip × t_burst = 0.196 × 0.150 = 0.0294 N·s and velocity change Δv = J_burst / m = 0.0294 / 0.040 = 0.735 m/s [INFERRED] — the beyblade accelerates ~0.7 m/s laterally in one grip-burst event, consistent with the observed storm-pegasis tornado-stall entry speed (CS1 Case 33, XF contact at v ≈ 0.5–0.8 m/s); in the game, `dashDirection = "left" | "right"` triggers an impulse in the stated direction of magnitude calibrated to produce approximately this velocity boost; cost is 0 because rubber-tip grip bursts are naturally available to all beyblades (no spin energy investment required) and the double-tap left/left sequence models the blader pressing hard twice to initiate the grip-burst; the 300ms `durationMs` mirrors the grip-burst contact duration (150ms grip + 150ms momentum carry); `lockMs = 0` means no input lock — a grip burst does not prevent the player from acting, matching real rubber-tip behavior where the beyblade resumes normal motion immediately after the sprint.

### Grip-Burst Physics

```
Rubber-tip lateral grip burst (RF tip, μ = 0.50):
  m = 0.040 kg, g = 9.81 m/s²
  F_grip = 0.50 × 0.040 × 9.81 = 0.196 N         [CONFIRMED μ, INFERRED F]
  t_burst = 150ms (half a durationMs)               [INFERRED — grip engagement window]
  J_burst = 0.196 × 0.150 = 0.0294 N·s             [INFERRED]
  Δv = J_burst / m = 0.735 m/s (lateral)            [INFERRED]

Hard ABS tip (μ = 0.17):
  F_ABS = 0.17 × 0.040 × 9.81 = 0.0667 N
  J_ABS = 0.0667 × 0.150 = 0.01 N·s
  Δv_ABS = 0.250 m/s
  → ABS tips produce ~34% of the rubber-tip burst.

Real cases grounding the dash:
  Storm Grip Base (Case 105): rubber dome tip — directional launch sprint
  RF bottom (Case 297): rubber flat — tornado stall initiation sprint
  R²F bottom (CS1 Case 38): directional star rubber — drift burst

Game parameters:
  dashDirection = "left" | "right"
  durationMs = 300ms  →  brief momentum window
  lockMs = 0          →  no lock (sprint is non-committal)
  cost = 0            →  free: rubber grip is passively available
  cooldownMs = 800ms  →  one orbit arc (~0.90 s) between dashes
```

---

## Case 604 — Guard Tap (Triple Defense, Free): Gyroscopic Recenter and Anti-Wobble Stance

**Thesis:** Guard Tap (KKK) models the triple-defense tap mechanic in which a blader performing three rapid defensive inputs causes the beyblade to momentarily recenter its spin axis — physically equivalent to the gyroscopic self-correction observed when a precessing top receives a brief axial tap that counteracts its wobble angle: at stability = ω/ω_max < 0.40 (wobble onset threshold per CLAUDE.md), the nutation angle θ grows at rate dθ/dt = Ω_p = τ_destabilize / (I × ω) [CS1 Case 5]; a triple-defense tap cannot add spin (cost 0, no spinDelta in effect), so its sole physics function is damping the lateral velocity — `lockMs = 0` and `damageMultiplier = 1.0` confirm this is a pure positional reset with no offensive bonus; the `durationMs = 250ms` maps to the physical gyroscopic recenter time: after a perturbation force is removed, the precession decays exponentially with time constant τ_gyro = I × ω / τ_external; at ω = 600 rad/s, I = 7.308×10⁻⁶ kg·m², and τ_external = 0 (no external torque during the guard window), the top self-corrects within one precession period T_p = 2π / Ω_p = 2π × I × ω / τ_residual ≈ 2π × 7.308×10⁻⁶ × 600 / 0.010 = 0.0275 s = 27.5 ms [INFERRED] — much faster than 250ms, which means the game's guard window is deliberately generous, representing the real practice of a blader holding a defensive orientation until the beyblade settles; the `cost = 0` is physically justified because gyroscopic recenter requires no external energy input — the spin axis returns to upright purely through the gyroscope's angular momentum.

### Guard Tap Self-Correction Physics

```
Gyroscopic recenter after perturbation:
  I = 7.308×10⁻⁶ kg·m²  [CONFIRMED CS10]
  ω = 600 rad/s  [ESTIMATED]
  Residual torque after perturbation ends: τ_residual ≈ 0.010 N·m  [ESTIMATED]

  Precession rate during recenter:
    Ω_p = τ_residual / (I × ω) = 0.010 / (7.308×10⁻⁶ × 600) = 0.010 / 4.385×10⁻³
         = 2.28 rad/s  [INFERRED]

  One precession cycle time (self-correction):
    T_p = 2π / Ω_p = 2π / 2.28 = 2.76 s  [INFERRED]
    → One full precession period is much longer than 250ms;
      250ms = 250/2760 = 9.1% of one cycle
    → Guard tap suppresses the GROWTH of wobble, not complete correction.

  At ω = 2000 rad/s (attack-type, higher spin):
    Ω_p = 0.010 / (7.308×10⁻⁶ × 2000) = 0.683 rad/s
    T_p = 2π / 0.683 = 9.19 s  [INFERRED]
    → Higher spin → slower precession → guard tap more effective

  Real analog: Bearing Core HMS (Case 84) self-corrects rapidly due to near-zero
  friction decoupling the tip from the spin axis; Guard Tap emulates this for all
  tip types during the window.  [INFERRED]

Game parameters:
  sequence: [defense, defense, defense]
  durationMs = 250ms   →  gyro settling window
  lockMs = 0           →  no lock — defensive reset is passive
  damageMultiplier = 1.0  →  no offensive bonus: pure stabilization
  cost = 0             →  gyroscopic recenter costs no energy
  cooldownMs = 1000ms  →  one full orbital arc period before next guard
```

---

## Case 605 — Feint (Side-Step, Free): Centrifugal Arc-Redirect from Side-Approach Change

**Thesis:** Feint (←→K) models the sharp direction reversal of a beyblade executing a side-approach change: a beyblade traveling at v_approach = 0.80 m/s left-ward abruptly reverses to rightward (or vice versa) via a hard-rubber tip plant (μ_rubber = 0.50), generating a centripetal redirection force F_redirect = m × v² / r_turn where r_turn is the minimum turning radius for a rubber-tipped beyblade; at μ_rubber = 0.50 and v = 0.80 m/s, the maximum traction provides F_max = μ × m × g = 0.50 × 0.040 × 9.81 = 0.196 N, limiting the minimum turning radius to r_min = m × v² / F_max = 0.040 × 0.64 / 0.196 = 0.1306 m = 130.6 mm [INFERRED]; since the arena radius is 170mm, a 130mm turning radius fits within the bowl — confirming the feint is physically executable in the BeyStadium Attack Type; the backward dash `dashDirection = "back"` represents the inward retreat step after the feint: the beyblade checks its radial outward momentum and repositions slightly inward, equivalent to the brief inward orbit deflection that follows a Tornado Ridge engagement (CS10 Case 546, inward J_inward = 0.0948 N·s); `cost = 0` because feint repositioning requires no spin energy — it uses only existing translational KE and tip friction, both always available.

### Side-Approach Reversal Physics

```
Feint direction reversal (left → right, rubber tip):
  m = 0.040 kg
  v_lateral = 0.80 m/s  [INFERRED]
  μ_rubber = 0.50  [CONFIRMED]

  Maximum lateral traction force:
    F_max = 0.50 × 0.040 × 9.81 = 0.196 N  [INFERRED]

  Minimum turning radius:
    r_min = m × v² / F_max = 0.040 × 0.64 / 0.196 = 0.130 m = 130 mm  [INFERRED]

  Lateral acceleration at full grip:
    a_lat = F_max / m = 0.196 / 0.040 = 4.90 m/s²  [INFERRED]

  Time to reverse direction (from +0.8 to −0.8 m/s):
    Δv_total = 1.60 m/s
    t_reverse = Δv_total / a_lat = 1.60 / 4.90 = 0.327 s = 327ms  [INFERRED]

  Game durationMs = 200ms: represents only the first half of the reversal
    (the direction CHANGE, not the full return — player controls the follow-through)

  ABS tip feint (μ = 0.17):
    F_ABS = 0.0667 N → r_min = 0.384 m — wider than arena → ABS beys cannot true-feint
    → In-game: feint works for all tip types (arcade abstraction)  [GAME-DERIVED]

Game parameters:
  sequence: [moveLeft, moveRight, defense]
  dashDirection = "back"  →  inward retreat after side-step
  durationMs = 200ms     →  direction-change phase only
  lockMs = 0             →  no lock — feint is evasive, not committal
  cost = 0               →  uses existing KE, no spin investment
  cooldownMs = 1200ms    →  longer than dashes — full approach arc to reset
```

---

## Case 606 — Riposte (Parry-Counter, Cost 15, Defense): Impulse Absorption + Rebound Strike

**Thesis:** Riposte (KKJ) models the real beyblade parry-and-counter sequence physically grounded in the contact restitution asymmetry between a defense-type beyblade and an attacker: when an attack-type hits a defense-type with high I_total (wide defense WD, Basalt wheel Case 279, Earth wheel Case 266/283), the effective mass ratio m₁/m₂ favors the defender — a heavier defense-type assembly at m_def = 0.045 kg vs. attacker m_att = 0.038 kg gives m_eff = 0.045 × 0.038 / (0.045 + 0.038) = 0.0206 kg, barely changed from the symmetric case (0.020 kg), but the angular momentum stored in the defender's larger I means the defender's spin barely changes on impact: Δω_def = J_face × r_contact / I_def = 0.0601 × 0.025 / (9.0×10⁻⁶) = 167 rad/s vs. Δω_att = 0.0601 × 0.025 / (6.5×10⁻⁶) = 231 rad/s [INFERRED] — the defender loses 72% as much spin as the attacker per equal-impulse hit, making the "parry" phase physically legitimate; the follow-up counter (damageMultiplier = 1.3) is grounded in the rebound velocity of the attacker: at e_ABS = 0.67, the attacker rebounds at v_rebound = v_approach × e = 1.8 × 0.67 = 1.206 m/s, and if the defender immediately advances into the rebounding attacker before it recovers, the closing speed is v_close = v_rebound + v_advance = 1.206 + 0.4 = 1.606 m/s; the counter impulse J_counter = m_eff × v_close × (1 + e) = 0.020 × 1.606 × 1.67 = 0.0537 N·s vs. the baseline hit at 1.8 m/s approach: J_baseline = 0.020 × 1.8 × 1.67 = 0.0601 N·s — ratio = 0.0537 / 0.0601 = 0.894, implying a counter is actually slightly weaker than a fresh approach; the damageMultiplier = 1.3 is therefore a game bonus layered on top of the physics, representing the "surprise factor" of a reversal and keeping the riposte competitively viable at cost 15.

### Parry-Counter Impulse Chain

```
Riposte physics chain:
  Phase 1 — Parry (K input):
    Attacker approach: v_att = 1.8 m/s, m_att = 0.038 kg  [INFERRED]
    Defender mass:     m_def = 0.045 kg  [INFERRED — heavier defense type]
    m_eff = 0.038 × 0.045 / (0.038 + 0.045) = 0.0206 kg  [INFERRED]
    e = 0.67  [CONFIRMED range CS10]

    J_parry = m_eff × v_att × (1 + e) = 0.0206 × 1.8 × 1.67 = 0.0620 N·s  [INFERRED]
    Attacker rebound speed: v_att_rebound = v_att × e = 1.8 × 0.67 = 1.206 m/s  [INFERRED]
    Defender recoil speed:  v_def_recoil  = J_parry / m_def = 0.0620 / 0.045 = 1.378 m/s
                                          → but high I_def dampens spin loss

  Phase 2 — Wait (lockMs = 200ms during 600ms durationMs):
    Attacker travels: d_retreat = v_att_rebound × 0.200 = 1.206 × 0.200 = 241mm
    → Attacker is now 241mm away, beginning to re-approach

  Phase 3 — Counter (J key):
    Defender advances: v_advance = 0.40 m/s  [INFERRED — moderate counter speed]
    Closing speed:     v_close = 1.206 + 0.40 = 1.606 m/s  [INFERRED]
    J_counter = m_eff × v_close × (1 + e) = 0.0206 × 1.606 × 1.67 = 0.0552 N·s  [INFERRED]
    Baseline J: 0.0601 N·s → counter is 0.0552/0.0601 = 91.8% of fresh hit  [INFERRED]
    Game applies: damageMultiplier = 1.3  →  bonus above the physics baseline  [GAME-DERIVED]

Game parameters:
  sequence: [defense, defense, attack]
  damageMultiplier = 1.3  →  physics baseline 0.92 + game bonus = effective 1.3
  durationMs = 600ms      →  parry wait + counter window
  lockMs = 200ms          →  brief parry stance lock
  cost = 15               →  moderate spin investment for the power bonus
  cooldownMs = 2500ms     →  one full orbit + approach to reset
```

---

## Case 607 — Pivot Strike (Lateral Pivot, Cost 15, Balanced): Side-Angle Contact Boost

**Thesis:** Pivot Strike (←→J) models the contact geometry advantage of a beyblade striking from a side-pivot angle versus a head-on approach: if a beyblade reverses lateral direction (feint-like, per Case 605) and then immediately attacks, the opponent's AR is struck at an oblique angle φ_oblique ≈ 35° relative to the face normal — the impulse smash component at this angle is J_smash = J_face × cos(35°) = 0.0601 × 0.819 = 0.0492 N·s [INFERRED], which is 82% of the maximum flat-face smash at φ = 5°; however the pivot approach adds a velocity component orthogonal to the opponent's expected defense axis — the opponent's gyroscopic stability is tuned to resist impacts along its current precession direction, and an off-axis strike perturbs a different eigenmode, producing a higher effective spin loss per impulse unit; the `damageMultiplier = 1.25` (slightly below riposte at 1.3) reflects the moderate off-axis bonus: riposte has a larger timing bonus because it exploits the attacker's own rebound; pivot strike instead exploits the approach angle, which is geometrically less advantageous but tactically faster (550ms active window at 450ms sequence gate vs riposte's 600ms/500ms); cost 15 equal to riposte is justified because both use the same spin-energy budget for the power bonus, just through different physical mechanisms.

### Off-Axis Strike Geometry

```
Pivot Strike lateral approach angle:
  Head-on approach: φ = 5°   → J_smash = 0.0601 × cos(5°)  = 0.0599 N·s (100%)
  Pivot approach:   φ = 35°  → J_smash = 0.0601 × cos(35°) = 0.0492 N·s  (82.2%)
  Upper attack:     φ = 45°  → J_smash = 0.0601 × cos(45°) = 0.0425 N·s  (70.9%)

  Off-axis spin perturbation advantage:
    A gyroscope at ω resists torques along its spin axis (L = I × ω vector).
    An on-axis hit applies τ parallel to L → pure precession (minimal spin loss).
    An off-axis hit at φ_oblique applies τ with components both ∥ and ⊥ to L:
      τ_perp = J_smash × r_cp × sin(φ_oblique) = 0.0492 × 0.025 × sin(35°)
             = 0.0492 × 0.025 × 0.574 = 7.05×10⁻⁴ N·m  [INFERRED]
    This ⊥ component directly reduces ω (spin-axis tilt), unlike pure precession.
    Effective spin-axis torque = 7.05×10⁻⁴ N·m > 0 → off-axis hit bleeds spin directly.
    [INFERRED]

Game parameters:
  sequence: [moveLeft, moveRight, attack]
  damageMultiplier = 1.25  →  off-axis bonus; slightly below riposte
  durationMs = 500ms       →  active contact window
  lockMs = 200ms           →  brief pivot stance
  cost = 15                →  same energy budget as riposte
  cooldownMs = 2500ms      →  standard power-combo cooldown
```

---

## Case 608 — Power Thrust (Triple Attack, Cost 25, Universal): Sequential Three-Hit Flat-Face Maximum Smash

**Thesis:** Power Thrust (JJJ) models the maximum-impulse sequential-hit scenario: three successive attacks each delivering J_hit = 0.0601 N·s (flat-face maximum smash at φ = 5°) within 800ms; the first hit at t = 0 delivers J₁ = 0.0601 N·s and pushes the opponent at Δv₁ = J₁ / m = 0.0601 / 0.040 = 1.503 m/s; the opponent is now retreating and for the second hit to connect, the attacker must close at least Δd = v₁ × t_gap / 2 = 1.503 × 0.20 / 2 = 0.150 m = 150mm (assuming t_gap ≈ 200ms between hits and the attacker has zero retreat); at the Tornado Ridge radius r = 125mm from center, 150mm of retreat takes the opponent near the outer wall (r = 170mm), meaning the second hit can only connect if the attacker aggressively follows up — the game models this by setting `lockMs = 300ms` (the maximum allowed) which forces the attacker to commit to the follow-up trajectory; the `damageMultiplier = 1.5` is exactly at the combo ceiling (per CLAUDE.md) because three consecutive flat-face hits at full approach speed represents the theoretical maximum damage output achievable without a special-move mechanism; cost 25 (vs. free combos) reflects that maintaining follow-up aggression over 450ms input window consumes meaningful spin — the attacker loses Δω_3hits = 3 × 222 rad/s (CS11 Case 587 Δω per hit) = 666 rad/s total spin loss from three collision reversals, requiring a spin reserve equivalent to ~50% of maxSpin.

### Three-Hit Impulse Sequence

```
Power Thrust hit sequence:
  Each hit: J = m_eff × v_approach × (1 + e) = 0.020 × 1.8 × 1.67 = 0.0601 N·s [INFERRED]
  Hit 1 at t = 0:
    Opponent pushed: Δv₁ = 0.0601 / 0.040 = 1.503 m/s outward  [INFERRED]
    Attacker recoils: Δv_att = 0.0601 / 0.040 = 1.503 m/s inward (equal mass)

  Attacker re-close time to follow up (at v_attack = 1.8 m/s closing, gap ≈ 100mm):
    t_gap ≈ 0.100 / (1.8 + 1.503) = 0.100 / 3.303 = 30ms  [INFERRED]
    → Very fast follow-up is physically possible at attack speeds

  Hit 2 at t ≈ 30ms:
    Opponent speed: 1.503 m/s outward (still moving from Hit 1)
    Relative closing speed: 1.8 + 1.503 = 3.303 m/s
    J₂ = m_eff × 3.303 × (1 + e) = 0.020 × 3.303 × 1.67 = 0.1103 N·s  [INFERRED]
    → Second hit is STRONGER because opponent is still moving from Hit 1

  Hit 3 at t ≈ 60ms:
    Similar to Hit 2 with compound retreat speed
    The combo effect window (800ms) keeps the bonus active for all three contacts.

  Net spin loss (attacker, 3 hits):
    Each hit: Δω = J × r_cp / I = 0.0601 × 0.025 / 7.308×10⁻⁶ = 205 rad/s  [INFERRED]
    Total: 3 × 205 = 615 rad/s — significant but not catastrophic at ω₀ = 600 rad/s
    [INFERRED — attack-type has spinDecayRate compensated by high spin]

Game parameters:
  sequence: [attack, attack, attack]
  damageMultiplier = 1.5  →  combo ceiling (maximum allowed)
  durationMs = 800ms      →  extended triple-hit window
  lockMs = 300ms          →  combo ceiling (maximum allowed lock)
  cost = 25               →  moderate spin investment
  cooldownMs = 3500ms     →  longer cooldown for high-damage combo
```

---

## Case 609 — Spin-Leech Jab (Orbital Steal, Cost 35, Stamina-Only): Surface-Friction Angular Momentum Transfer

**Thesis:** Spin-Leech Jab (←J→) models the angular momentum transfer mechanism of rubber-ER spin-steal parts: L-Drago II (Case 30, rubber band ER), L-Drago Destructor (Case 39, rubber core), and Advance Balancer (Case 85, serrated metal rim spin-steal); in all three, a high-friction surface (μ_rubber = 0.50 or μ_serrated ≈ 0.30 [ESTIMATED]) contacts the opponent during an oblique approach, and the differential surface speed between the two spinning tops (Δv_surface = (ω_A − ω_B) × r_ER) drives a frictional torque that transfers angular momentum from the higher-spin top to the lower-spin top; for a stamina-type beyblade at ω_A = 500 rad/s meeting an opponent at ω_B = 300 rad/s, Δv_surface = (500 − 300) × 0.025 = 5.0 m/s, friction force F_steal = μ × N = 0.50 × (m × g) = 0.196 N, torque τ_steal = r_ER × F_steal = 0.025 × 0.196 = 4.90×10⁻³ N·m, angular momentum stolen per 10ms contact: ΔL = τ_steal × t = 4.90×10⁻³ × 0.010 = 4.90×10⁻⁵ N·m·s, spin stolen: Δω_stolen = ΔL / I_opponent = 4.90×10⁻⁵ / 7.308×10⁻⁶ = 6.71 rad/s per 10ms contact [INFERRED] — consistent with the `spinStealBonus = 0.08` (8% of opponent spin transferred per contact event) and `microSpinBoost = 30` (30 rad/s added to self from the steal reaction); cost 35 (highest combo cost) reflects the real physics: rubber-ER spin-steal beyblades sacrifice attack capability entirely to specialize in this mechanism, and activating it requires the precise oblique-approach geometry (←J→ encodes left-approach, contact, then right-exit — the orbital-pass trajectory of a spin-stealer).

### Spin-Steal Mechanics Derivation

```
Spin-Leech Jab steal rate (rubber ER analog, L-Drago II, Case 30):
  ω_stealer = 500 rad/s  [INFERRED — stamina type mid-match]
  ω_target  = 300 rad/s  [INFERRED — attack type late match]
  r_ER = 25 mm = 0.025 m
  μ_rubber = 0.50  [CONFIRMED CS10]
  m = 0.040 kg, g = 9.81 m/s²

  Differential surface speed:
    Δv_surface = (500 − 300) × 0.025 = 5.00 m/s  [INFERRED]

  Frictional force at contact:
    N = m × g = 0.040 × 9.81 = 0.392 N  (normal force from weight)  [INFERRED]
    F_friction = μ × N = 0.50 × 0.392 = 0.196 N  [INFERRED]

  Torque transferred to target:
    τ_steal = r_ER × F_friction = 0.025 × 0.196 = 4.90×10⁻³ N·m  [INFERRED]

  Spin stolen per 10ms contact:
    Δω_stolen = τ_steal × t / I_target = 4.90×10⁻³ × 0.010 / 7.308×10⁻⁶ = 6.71 rad/s
    As fraction of ω_target: 6.71 / 300 = 2.24% per 10ms  [INFERRED]

  Over 800ms durationMs at one contact event (≈100ms effective contact):
    Total stolen: 6.71 × 10 = 67.1 rad/s = 22.4% of ω_target  [INFERRED]
    Game spinStealBonus = 0.08 = 8% → game value is conservative vs. theoretical peak
    microSpinBoost = 30 rad/s → ~4.5% of ω_stealer (reaction torque on self)

  Advance Balancer analog (Case 85, serrated μ ≈ 0.30):
    F_friction = 0.30 × 0.392 = 0.118 N
    Δω_stolen per 10ms = 0.118 × 0.010 × 0.025 / 7.308×10⁻⁶ = 4.03 rad/s
    As fraction: 1.34% per 10ms — less than rubber ER but still significant.  [INFERRED]

Game parameters:
  sequence: [moveLeft, attack, moveRight]  →  orbital-pass approach (left → contact → right)
  damageMultiplier = 1.1                    →  light hit (spin-steal, not smash focused)
  spinStealBonus = 0.08                     →  8% of opponent ω transferred
  microSpinBoost = 30                       →  30 rad/s self-gain from stolen L
  durationMs = 800ms                        →  extended contact window
  lockMs = 200ms                            →  brief orbital lock
  cost = 35                                 →  highest combo cost (specialized archetype)
  type = "stamina"                          →  stamina-only (spin-steal requires low-μ tip)
  cooldownMs = 4500ms                       →  longest cooldown — orbit re-entry time
```

---

## Case 610 — Sliding-Window Sequence Detection: The 3-Key History Buffer and Pruning Algorithm

**Thesis:** The combo detection system uses a sliding-3 window over a pruned history buffer (`comboSystem.ts pruneHistory`) rather than a strict 3-key queue, for a precise physical reason: in real beyblade play, a blader may attempt a direction-direction-attack sequence but accidentally input a fourth key between the second and third (e.g., ← ← ↑ J when trying ←←J), and the sliding window ensures the attempted combo's last valid 3-key suffix is still evaluated; the `maxWindowMs = 600ms` buffer (wider than any combo's `windowMs`) is calibrated to the maximum time for a complete approach-contact-rebound sequence at minimum attack speed: t_approach_full = d_approach / v_min = 0.170 / 0.40 = 0.425 s = 425ms [INFERRED], with a 175ms overhead for input lag and player reaction — total 600ms; the `perComboCooldown` map prevents re-triggering the same combo before its `cooldownMs` even if the player inputs the sequence again; the per-beyblade `attachedComboIds` gate (from `BeybladeStats.comboIds`) maps to the real-world "custom combo" mechanic where only certain AR/WD combinations can perform certain contact patterns — a beyblade without the correct AR geometry cannot execute a spin-steal jab even if the player enters the sequence correctly, exactly as `spinStealBonus` is gated to `type = "stamina"` by `isComboAllowedForType`.

### Detection Algorithm Walk-Through

```
pruneHistory(tracker, now, maxWindowMs=600):
  Removes all history entries older than 600ms from now.
  Keeps only recent keys in the rolling window.

findComboBySequence(seq):
  Converts seq to key string: "moveLeft>moveLeft>attack"
  Looks up in BY_SEQUENCE map (O(1)).

detectCombo flow (simplified):
  1. Append new key + timestamp to tracker.history
  2. pruneHistory(tracker, now, 600ms)
  3. If history.length < 3: return null
  4. Extract last 3 keys as candidate sequence
  5. findComboBySequence(candidate) → match or null
  6. If null: return null (no sequence match)
  7. Check combo.windowMs: time between history[last-2] and history[last] ≤ windowMs
  8. Check attachedComboIds: combo.id must be in bey.comboIds
  9. Check isComboAllowedForType: combo.type must match bey.type (or universal)
  10. Check power threshold: bey.power × comboCostMultiplier ≥ combo.cost
  11. Check perComboCooldown[combo.id]: must be expired
  12. Check globalCooldownUntilMs: must be expired
  13. All passed: return ComboResult; caller deducts bey.power -= result.costPaid

Sliding window example — miskeyed sequence:
  Input:  ← (t=0)  ← (t=150)  ↑ (t=300)  J (t=420)
  Buffer at t=420: [←, ←, ↑, J]  (all within 600ms)
  Candidate last-3: [←, ↑, J] = "moveLeft>moveUp>attack" → no match
  But also checked: suffix of [←, ←, J] across the buffer?
    — detectCombo only checks the last 3; the miskey ↑ prevents the ←←J match.
  → Miskey correctly invalidates the combo attempt.  [CONFIRMED comboSystem.ts logic]

Free-combo modifier:
  comboCostMultiplier = 0.0 → all combos effectively free
  Used by "free_combos" round modifier (round_modifiers collection)
```

---

## Case 611 — Cost Tier Physics: 0 / 15 / 25 / 35 Power Budget Rationale

**Thesis:** The four power cost tiers map to the four tiers of deliberate spin energy commitment recognized in real beyblade play: cost 0 (naturally occurring) corresponds to spontaneous contact events that any well-positioned beyblade can achieve without deliberate spin sacrifice — directional lateral sprints, gyro recenter, evasive repositioning; cost 15 corresponds to a light but intentional counter-attack requiring modest spin sacrifice (~15% of bar), analogous to the spin loss from a single strong parry where the defender deliberately meets the attacker at maximum traction rather than deflecting (F_absorb = μ_rubber × N = 0.196 N over 150ms gives J_absorb = 0.0294 N·s = 15% of full EG spring J_EG = 0.180 N·s [CS11 Case 597]); cost 25 is a full triple-attack commitment analogous to the EG spring first-clutch cycle (E_spring = 48 mJ [CONFIRMED CS10 Case 556], scaled to power bar fraction = 48 / 1316 = 3.65% in real physics but 25% of game power bar — a 6.8× game amplification [GAME-DERIVED]); cost 35 is the highest pre-special investment, reserved for the spin-leech archetype where the rubber ER mechanism requires sustained high-speed contact that consumes 35% of the power bar in one activation.

### Power Tier Calibration

```
Power bar → physical spin investment:
  Full bar (100) = full rotational KE = 1.316 J  [INFERRED from CS11 Case 597]
  1 power unit = 1.316 J / 100 = 0.01316 J per unit  [GAME-DERIVED]

  Cost tiers → spin energy:
  ────────────────────────────────────────────────────────────────────
  Cost   Energy (J)  Real analog                         Combo(s)
  ────────────────────────────────────────────────────────────────────
   0      0.000 J    Spontaneous — no deliberate cost    dash, guard, feint
  15      0.197 J    Light parry absorption (1× grip)    riposte, pivot-strike
  25      0.329 J    EG spring equivalent × 6.85         power-thrust
  35      0.461 J    Extended rubber-ER contact session  spin-leech-jab
 100      1.316 J    Full KE release (special move only) stampede_rush etc.
  ────────────────────────────────────────────────────────────────────

  Spacing between tiers:
    0  → 15: +0.197 J   (light defensive overhead)
    15 → 25: +0.132 J   (commit to offense)
    25 → 35: +0.132 J   (specialize in stamina theft)
    35 → 100: +0.855 J  (large gap → special moves are premium)
    [INFERRED — spacing reflects deliberate design boundary]
```

---

## Case 612 — Combo Cooldown Architecture: Orbital Period Multiples and Combo Re-Entry Physics

**Thesis:** Combo cooldowns are calibrated as multiples of the orbital arc period derived in CS11 Case 589 (T_orbit ≈ 0.85 s for r_orbit = 90mm, T_orbit ≈ 0.94 s for r_orbit = 110mm); the free combo cooldowns (800ms, 1000ms, 1200ms) span slightly less than one full orbit — they reset before the beyblade completes its next full orbit pass, matching the real observation that casual repositioning recoveries happen within one orbit; the power-combo cooldowns (2500ms, 3500ms, 4500ms) span 3–5 orbit periods, reflecting the time needed for the spin energy spent on the combo to replenish through passive spin maintenance; at stamina decay rate 6.8 rad/s (max stamina, CLAUDE.md) from an initial 600 rad/s, recovering 35 power-bar units of spin energy (cost 35 combo) would require Δω_recover = 35 × 1.316 / (0.5 × I × 1) = 35 × 0.01316 / (½ × 7.308×10⁻⁶) = too complex for direct mapping — the power bar does not map directly to ω recovery time; instead the cooldown multiples are empirically set to 3 × T_orbit (2.5s) for cost-15 combos, ~4 × T_orbit (3.5s) for cost-25, and ~5 × T_orbit (4.5s) for cost-35, establishing a consistent orbit-count-per-tier pattern.

### Cooldown vs. Orbit Count

```
Orbital period range: T_orbit = 0.85–0.94 s  [INFERRED CS11 Case 589]
Midpoint: T_orbit_mid = 0.90 s

  Combo            cooldownMs   Orbits (÷ 0.90s)   Tier
  ──────────────────────────────────────────────────────
  quick-dash-l/r     800ms         0.89 orbits        Free
  guard-tap         1000ms         1.11 orbits        Free
  feint             1200ms         1.33 orbits        Free
  riposte           2500ms         2.78 orbits        Cost 15
  pivot-strike      2500ms         2.78 orbits        Cost 15
  power-thrust      3500ms         3.89 orbits        Cost 25
  spin-leech-jab    4500ms         5.00 orbits        Cost 35
  ──────────────────────────────────────────────────────
  Pattern:
    Free:    ~1 orbit before reset (natural recovery)
    Cost 15: ~3 orbits (light spin recovery)
    Cost 25: ~4 orbits (moderate spin recovery)
    Cost 35: ~5 orbits (extended spin recovery for rubber-ER session)
  [INFERRED — cooldown multiples track with cost tier]
```

---

## Case 613 — Type Restriction Gate: Why Spin-Leech Jab Is Stamina-Only

**Thesis:** The `type = "stamina"` restriction on `spin-leech-jab` is physically motivated by three converging real-world constraints: first, spin-steal is only advantageous when the stealer has more spin than the target (ω_A > ω_B), which at mid-to-late match only remains true if the stealer has a low-decay tip (bearing, sharp, eternal-sharp) — rubber-flat and attack-type flat tips lose spin too fast (decay 39.8 rad/s² vs. bearing's 14.6 rad/s²) to maintain ω_A > ω_B for any extended period; second, the oblique contact geometry required for spin-steal (parallel surface contact along shared AR perimeters) conflicts with attack-type AR shapes (flat-face maximized-smash, φ ≈ 5°) because flat-face ARs deflect the opponent radially rather than creating the parallel contact surface needed for frictional momentum transfer; third, the ←J→ input sequence encodes an orbital approach (approach from left, contact, continue to right) that corresponds to the L-Drago left-spin / co-rotation orbital contact trajectory — and left-spin mechanics are the stamina archetype's specialty; the `isComboAllowedForType(combo, beybladeType)` function enforces this in the engine by checking `combo.type === beybladeType` when type is not "universal", preventing attack and defense beyblades from equipping `spin-leech-jab` even if their `comboIds` array contains it.

### Type Restriction Physical Basis

```
Why each non-universal combo restricts:

  riposte    → type: "defense"
    Physical: defense beyblades have highest I, lowest Δω per hit (parry advantage).
    Attack types would use it offensively (double-defense into attack = pressure, not parry).
    Restriction prevents role blurring.  [INFERRED]

  pivot-strike → type: "balanced"
    Physical: balanced ARs have mixed-angle faces that produce the oblique contact bonus.
    Attack types at φ=5° don't benefit (already at max smash with no pivot angle).
    Stamina/defense types lack the contact speed for the pivot-approach trajectory.  [INFERRED]

  spin-leech-jab → type: "stamina"
    Physical: requires ω_self > ω_opponent late-match (stamina type advantage).
    Requires parallel ER contact surface (incompatible with attack AR geometry).
    Orbital approach encodes co-rotation stamina-type trajectory.  [INFERRED]

  universal (4 free combos + power-thrust):
    quick-dash: tip grip burst — available to any tip type
    guard-tap:  gyro recenter — universal physics
    feint:      turning radius — tighter for rubber tips but available to ABS
    power-thrust: flat-face smash × 3 — viable for any AR shape at any cost
    [INFERRED]

isComboAllowedForType implementation (combos.ts):
  "universal" → always true
  specific type → combo.type === beybladeType
  combo not in bey.comboIds → false (attachment gate, checked first)
```

---

## Case 614 — Combo vs. Special Move Capability Boundary: The Four Hard Ceilings

**Thesis:** The four CLAUDE.md-specified hard ceilings between combos and special moves are each grounded in a real physics observation: the `damageMultiplier ≤ 1.5` ceiling for combos matches the physical maximum achievable through AR-geometry-alone optimization — the theoretical maximum flat-face smash at φ = 0° gives J/J_baseline = cos(0°)/cos(5°) = 1.000/0.9962 ≈ 1.004, meaning geometry alone cannot raise damage to 1.5×; the 1.5× game ceiling is already an abstraction above the physics, and higher values (2.0+, allowed in specials) require the additional closing-speed advantage only achievable through EG spring burst or aerial diving — mechanisms that belong to the special-move energy budget; the `lockMs ≤ 300ms` ceiling matches the physical contact duration of a three-hit follow-up sequence (Case 608: t_3hits ≈ 60ms) plus a 240ms pursuit window, beyond which the opponent has escaped to a distance where the lock becomes a liability rather than an advantage; the `no invulnerabilityMs` ceiling reserves gyroscopic anchor mechanics exclusively for the full-bar special move commitment (gyro_anchor costs 100, not 35) — in real physics, true gyroscopic invulnerability requires maximizing both I and ω simultaneously, which is only achievable when the full spin reserve is committed; the `spinDelta ≤ 50` (microSpinBoost) ceiling reserves the LAD orbital recovery mechanism for the orbital special move — a 50 rad/s micro-boost is physically equivalent to the 21.5 rad/s spin saved per LAD orbit by a bearing tip (CS11 Case 589), scaled up × 2.3 for the game, while full spinDelta = 400 (spin_recovery special) requires the full bowl-orbit energy coupling.

### Four-Ceiling Summary

```
Ceiling              Combo limit   Special limit   Physical derivation
────────────────────────────────────────────────────────────────────────────────────────
damageMultiplier     ≤ 1.5         ≤ 2.5           AR geometry max = ~1.0; 1.5 is game
                                                    bonus; 2.0+ requires aerial/EG burst
lockMs               ≤ 300ms       ≤ 2000ms        3-hit pursuit window (60ms) + margin;
                                                    anchor requires 1500ms gyro window
invulnerabilityMs    0 (forbidden)  ≤ 1500ms       Full KE commitment only (bearing LAD)
spinDelta            ≤ 50 (micro)   ≤ 600 (full)   50 = 2.3× bearing orbit save (21.5 rad/s);
                                                    400 = full LAD session (CS11 Case 589)
────────────────────────────────────────────────────────────────────────────────────────

Power cost gap (enforces boundary):
  Max combo cost = 35 power units
  Min special cost = 100 power units
  Gap = 65 power units — no overlap possible
  Physical: 35 power = 0.461 J, 100 power = 1.316 J; gap = 0.855 J
  → Specials cost 1.316/0.461 = 2.85× more energy than the most expensive combo
```

---

## Case 615 — Combo Effect Architecture: ComboTask → BehaviorRef Compilation and Engine Dispatch

**Thesis:** The combo system uses a two-layer architecture — `ComboTask` (admin-facing, stored in `combo_effects` Firestore collection) compiled at save time to `BehaviorRef[]` (engine-facing, dispatched in the game loop) — which maps directly to the physical separation between a blader's tactical intent and the beyblade's physical execution: a blader decides to "spin-steal with left-orbit approach" (ComboTask with `action: {type: "multiplier", statDeltas: [{stat: "spinStealFactor", multiplier: 1.08}]}, target: "opponent"`) and that intent is compiled into a concrete per-tick force application (BehaviorRef: `{behaviorId: "apply_spin_steal", params: {factor: 0.08}, delayTicks: 0}`); the `ComboTiming` variants map to real physical timing profiles: `{type: "instant"}` maps to a hard-smash AR contact (2ms, instantaneous in game terms); `{type: "timed", durationTicks: 48}` (800ms at 60Hz) maps to the rubber-ER sustained contact window; `{type: "pulsed"}` maps to the multi-bounce oscillation of a Jumping Base or TR145 roller (Cases 64, 99) where the effect recurs at each bounce; `{type: "charged"}` maps to the EG spring charge-and-release mechanic where holding the defense key longer accumulates a larger burst; the `ComboCondition` fields (minSpin, maxSpin, spinDirectionRequired, clashTypeRequired) directly encode the physical pre-conditions for each contact archetype — `clashTypeRequired: "counter_spin"` gates the spin-leech mechanism to counter-spin encounters because co-spin contacts produce lower friction (Δv_surface is smaller when both beys spin in the same direction).

### ComboTask → BehaviorRef Compilation Example

```
ComboEffectDef for "spin-leech" (stored in combo_effects/spin-leech):
  tasks: [
    {
      action: {
        type: "multiplier",
        statDeltas: [
          { stat: "spinStealFactor", multiplier: 1.08 },  // 8% steal
          { stat: "spin",           delta: 30 }            // +30 rad/s self
        ]
      },
      target: "opponent",
      timing: { type: "timed", durationTicks: 48 },       // 800ms at 60Hz
      condition: {
        clashTypeRequired: "counter_spin",                 // only vs. counter-spin
        maxRange: 150                                      // must be within 150px
      }
    }
  ]

Compiled to BehaviorRef[] (engine-facing):
  steps: [
    {
      behaviorId: "apply_spin_steal",
      params: { factor: 0.08, duration: 48 },
      delayTicks: 0,
      condition: { clashTypeRequired: "counter_spin", maxRange: 150 }
    },
    {
      behaviorId: "add_spin_to_self",
      params: { delta: 30, duration: 1 },     // instant micro-boost on activation
      delayTicks: 0
    }
  ]

Physical basis for clashTypeRequired: "counter_spin":
  Co-spin (same direction):
    Δv_surface = (ω_A − ω_B) × r = (500 − 300) × 0.025 = 5.00 m/s  [INFERRED]
  Counter-spin (opposite direction):
    Δv_surface = (ω_A + ω_B) × r = (500 + 300) × 0.025 = 20.0 m/s  [INFERRED]
  Counter-spin contact produces 4× the differential surface speed → 4× steal torque
  → Counter-spin is the natural operating regime for spin-steal mechanics.  [INFERRED]
```

---

## Case 616 — Combo HUD Strip: Attachment Gate, Sequence Display, and Fired-History Physics

**Thesis:** The ComboHUD (client/src/components/game/ComboHUD.tsx) shows only the combos listed in `bey.comboIds` (max 3 slots), which physically models the constraint that a beyblade's AR geometry determines which contact patterns are available — a beyblade with the Cross Fang AR (CS3 Case 95, narrow fang geometry) cannot produce the parallel surface contact needed for spin-leech even if the player inputs the sequence; the `comboIds` list has a hard cap of 3 to match the real beyblade design constraint that a single AR can only be optimized for at most 2–3 distinct contact patterns before the geometry becomes conflicted (e.g., simultaneous flat-smash maximization and slope-upper-attack maximization require contradictory face angles); the "fired combo history" visual element (flashing the last activated combo name) maps to the real observable in matches where a successful contact pattern is immediately visible in the opponent's reaction (sudden spin loss, direction reversal, height change) — it gives the player the same feedback a live audience receives when watching a real beyblade match.

### comboIds Attachment Physics

```
Max 3 combos per beyblade — physical basis:
  An AR has a perimeter of ~2π × r_AR = 2π × 0.027 = 0.170 m = 170mm  [INFERRED]
  Each contact pattern requires a dedicated face geometry spanning ~30–50mm of arc.
  170mm / 45mm ≈ 3.8 → maximum ~3–4 distinct contact patterns fit on one AR.
  The 3-combo cap rounds down to leave the 4th arc segment as mechanical clearance.
  [INFERRED]

Recommended combo combinations by type (physics-driven):
  Attack bey:
    quick-dash-r (free)     →  rubber sprint approach
    quick-dash-l (free)     →  bidirectional sprint
    power-thrust (cost 25)  →  max smash commitment

  Defense bey:
    guard-tap (free)        →  gyro recenter
    feint (free)            →  evasive repositioning
    riposte (cost 15)       →  parry-counter (defense-exclusive)

  Stamina bey:
    feint (free)            →  orbital redirect
    guard-tap (free)        →  late-match gyro stabilization
    spin-leech-jab (cost 35) → orbital steal (stamina-exclusive)

  Balanced bey:
    quick-dash-r (free)     →  sprint approach
    feint (free)            →  repositioning
    pivot-strike (cost 15)  →  off-axis counter
```

---

## Case 617 — Power Bar Mechanics: Charge Rate, Cost Deduction, and Free-Combos Round Modifier

**Thesis:** The power bar (`bey.power`, 0–100) charges passively at rate `chargeRate × dt` per tick (defined in PhysicsEngine.ts) and is deducted by `result.costPaid` when a combo fires (the caller deducts, keeping `detectCombo` pure); the passive charge rate is physically motivated by the real observation that a beyblade in motion continuously converts translational kinetic energy back into the observable "fighting energy" of its AR — every orbit pass and every wall deflection produces micro-vibrations that the blader can potentially leverage; the `free_combos` round modifier sets `comboCostMultiplier = 0.0`, making all combos cost 0 for one round — physically analogous to the EG spring being pre-wound and released for free, or a stadium with a motorized disc (CS10 Case 561, R.P.M. Dish rotating disc) that continuously re-energizes all beyblades; the power cost of 100 for special moves (`powerCost: 100` in `SpecialMoveDef`) is consistent with the `resolveSpecialMove` fallback chain — a beyblade that fires a special at exactly 100 power arrives at 0 and cannot fire any combo until the bar recharges, creating a natural "special move opens a vulnerability window" mechanic grounded in the real EG spring's one-shot release characteristic (the spring cannot fire twice without manual re-winding).

### Power Bar Charge/Deduct Cycle

```
Power bar mechanics:
  Range: 0–100 (dimensionless, scaled from rotational KE budget)
  1 power unit = 0.01316 J  [GAME-DERIVED CS11 Case 611]

  Passive charge rate (game engine):
    chargeRate ~ 8–12 power units per second (estimated from match pacing)  [ESTIMATED]
    Time to refill from 0:  100 / 10 = 10s at mid-rate  [ESTIMATED]
    Time to recover 35 (spin-leech cost): 35 / 10 = 3.5s ≈ 3.9 orbits  [INFERRED]
    — consistent with cooldownMs = 4500ms (5 orbits) slightly exceeding recovery time

  Deduction:
    On combo fire: bey.power -= result.costPaid
    comboCostMultiplier (default 1.0): scale cost before deducting
      → comboCostMultiplier = 0.0 (free_combos modifier): no cost deducted

  Special move deduction: always 100 (full bar clear)
    → After any special, bey.power = 0
    → Next affordable combo: cost 0 (free) — available immediately
    → Cost 15 requires 1.5s recharge, cost 35 requires 3.5s

  Physical recharge analog:
    Real EG spring re-wind: ~1.5–2.0 s per manual wind (estimated)  [ESTIMATED]
    Game recharge 0→100: ~10s at nominal charge rate
    → Game recharge is 5–6× slower than real spring re-wind
    → Creates longer strategic windows between special-move activations
```

---

## Case 618 — Combo Design Constraints: The Forbidden Effect Table and Ceiling Enforcement

**Thesis:** The four forbidden effects (invulnerabilityMs, AoE, spinDelta > 50, damageMultiplier > 1.5) form a complete boundary around the combo design space, and each corresponds to a physical mechanism that requires full-bar energy commitment: invulnerabilityMs > 0 requires the gyroscopic anchor (full ω maximization + bearing decoupling, cost 100); AoE requires the gyroscopic KE radial release (full rotational KE = 1.316 J spread over 250px radius, cost 100); spinDelta > 50 requires either the bearing-LAD orbit session (400 rad/s recovery, cost 100) or the EG spring burst (60 rad/s micro, cost 100 in stampede_rush) — the micro-boost limit of 50 is chosen to sit just below the EG spring's own contribution (60 rad/s), ensuring no combo achieves what only a special move can physically deliver; damageMultiplier > 1.5 requires the aerial KE advantage (closing speed 2.0+× approach speed) or the EG spring timing bonus, both of which are physically outside the AR-geometry-only design space of combos; new combo designs must satisfy all four constraints simultaneously — a combo may push against one ceiling (e.g., damageMultiplier = 1.5 in power-thrust) but must leave the other three well clear (lockMs = 300, no invuln, microSpinBoost ≤ 50).

### Forbidden Effect Table

```
Effect               Combo limit        Why forbidden above limit
──────────────────────────────────────────────────────────────────────────────────────────
invulnerabilityMs    0                  Requires full I×ω maximization (full-bar anchor)
aoeRadiusPx          0                  Requires full KE radial release (full-bar shockwave)
spinDelta            ≤ 50 (microBoost)  EG spring contributes 60 rad/s; combo ceiling = 50
                                         (just below spring floor — no combo = spring output)
damageMultiplier     ≤ 1.5              AR geometry max ~1.0; 1.5 = AR max + game bonus;
                                         1.5+ requires aerial/EG burst (full-bar only)
lockMs               ≤ 300ms            3-hit pursuit window = ~60ms; 300ms = 5× window
                                         (beyond this, opponent has escaped and lock = nerf)
──────────────────────────────────────────────────────────────────────────────────────────

New combo design checklist:
  ✓ damageMultiplier ≤ 1.5
  ✓ lockMs ≤ 300ms
  ✓ invulnerabilityMs = 0 (or absent)
  ✓ aoeRadiusPx = 0 (or absent)
  ✓ microSpinBoost ≤ 50 (if spinDelta used at all)
  ✓ spinStealBonus ≤ 0.10
  ✓ cost ≤ 35
  ✓ sequence: exactly 3 keys
  ✓ windowMs ≤ 600ms (buffer max)
  ✓ type: valid ComboType (or "universal")
  ✓ cooldownMs ≥ 800ms (minimum orbit arc)
```

---

_End of Case Study 12 — Combo System Physics. Cases 601–618._

_Next: Case Study 13 will cover the Beyblade Type Distribution system: the 360-point stat budget, four-stat normalization, generation-peer physics ranges, and the derivation of damage/decay/spin formulas from real part measurements._

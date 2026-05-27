# Beyblade Case Studies — Part 13: Franchise Special Moves, Gimmicks, and Derived Combos

**« Part 12:** [12 case study.md](12%20case%20study.md) (Cases 601–618)

**Scope:** Each case in this part takes a real franchise special move, dissects the underlying part gimmick that makes it physically possible, derives the game-engine mechanic from that gimmick, and then extracts the player-skill combo that uses the same gimmick at a lower power level. The three case types alternate: **Gimmick** (passive part behavior, no player input required) → **Special Move** (one-button ultimate, anime-rule-breaking, built on the gimmick) → **Combo** (3-key player-skill expression of the same gimmick within physics rules). Every case is tagged accordingly.

---

## Style Rules (carry forward from CS12, additions for CS13)

- No em-dashes in prose: use colons or semicolons
- No bullets in the Thesis paragraph
- All numeric results to 3 significant figures
- Three case types: `[GIMMICK]`, `[SPECIAL MOVE]`, `[COMBO]` — tagged in the case heading
- Gimmick cases derive the passive physics; special move cases reference the gimmick case for the physical foundation and then describe how the anime/ultimate layer transcends it; combo cases reference the gimmick case and describe the player-skill bounded expression
- Franchise move attribution included in each special move case header

---

## Authoritative Constants for CS13 (inherited from CS1–CS12)

| Parameter | Value | Source | Tag |
|-----------|-------|--------|-----|
| Hard ABS μ_k | 0.17 | CS10 Case 551 | [CONFIRMED] |
| Rubber μ_k | 0.50 | CS10 Case 545 | [CONFIRMED] |
| Bearing tip μ_k | 0.05 | CS10 Case 551 | [CONFIRMED] |
| ABS-on-ABS COR e | 0.67 | CS10 | [CONFIRMED] |
| EG spring k | 1500 N/m | CS10 Case 555 | [CONFIRMED] |
| EG spring energy E | 48 mJ | CS10 Case 556 | [CONFIRMED] |
| Representative MFB mass m | 0.040 kg | CS10 | [CONFIRMED] |
| Representative MFB I_total | 7.308×10⁻⁶ kg·m² | CS10 Case 545 | [CONFIRMED] |
| MFB launch ω₀ | 600 rad/s | CS10 Case 545 | [ESTIMATED] |
| Burst launch ω₀ | 2000 rad/s | CS10 | [ESTIMATED] |
| Engine linearImpulse unit | 3.60×10⁻⁵ N·s | CS11 Case 597 | [CONFIRMED] |
| Engine spinDelta unit | 1 rad/s | CS11 Case 597 | [CONFIRMED] |

---

## Case 619 — [GIMMICK] Free-Spin Ring Parry: ED145 Eternal Defense Ring and ES Eternal Sharp Sleeve as a Coupled Impact-Decoupling System

**Thesis:** The ED145 spin track and ES performance tip together form a two-level impact-decoupling system in which neither the track contact surface nor the tip contact surface is rigidly fixed to the beyblade body; the ED145 Eternal Defense ring is a polycarbonate annular disc of approximate mass m_ring = 1.2 g and outer radius r_ring = 18 mm that rotates freely on a low-friction bearing seat around the track shaft, so that when an attacker's AR contacts the ring at tangential velocity v_contact, the ring accelerates angularly rather than transmitting the full tangential impulse as a lateral force on the beyblade body; the impulse partition between ring and body is governed by the effective inertia ratio: J_body / J_total = I_body / (I_body + m_ring × r_ring²) = 7.308×10⁻⁶ / (7.308×10⁻⁶ + 1.2×10⁻³ × (0.018)²) = 7.308×10⁻⁶ / (7.308×10⁻⁶ + 3.888×10⁻⁷) = 0.9496, meaning approximately 5.0% of the incoming rotational impulse is absorbed by the ring rather than destabilizing the body [INFERRED]; separately the ES Eternal Sharp tip has an outer free-spinning sleeve of approximate mass m_sleeve = 0.3 g and radius r_sleeve = 3 mm around a central ABS sharp point, and when tilt torque from an ED145-level hit attempts to tip the beyblade laterally, the normal force at the tip contact point creates a friction-coupled ground reaction; because the sleeve is free-spinning, the lateral friction component is reduced from μ_ABS × N = 0.17 × N to approximately μ_sleeve × N = 0.05–0.08 × N (bearing-like decoupling) [INFERRED]; the combined effect is that a beyblade equipped with ED145ES is mechanically difficult to both topple (tip decoupling) and destabilize rotationally (ring decoupling), which is the passive physical basis for the counter archetype: the beyblade survives contact that would displace a rigid competitor and is available to counter immediately after.

### Impact Partition Geometry

```
ED145 free-spin ring — cross-section view:

  Attacker AR contact
         │
         ▼  F_contact (tangential at r_ring = 18 mm)
  ┌──────┴──────┐
  │  Free ring  │  m_ring = 1.2 g, rotates on bearing seat
  └──────┬──────┘
         │ bearing seat (low μ)
  ┌──────┴──────────────────────────────┐
  │        Track body (fixed to bey)    │  receives reduced J_body
  └─────────────────────────────────────┘

  J_total = m_eff × Δv × (1 + e) for a typical smash contact
  J_body  = J_total × [I_body / (I_body + m_ring × r_ring²)]  ← 95% of J_total
  J_ring  = J_total × [m_ring × r_ring² / (I_body + m_ring × r_ring²)]  ← 5% of J_total

  Δω_ring = J_ring / (m_ring × r_ring²)  ← ring spins up from each contact
```

```
ES tip — tilt-resistance geometry:

  Tilt torque τ_tilt from off-axis hit attempts to tip bey at contact point:
    Ground reaction at tip = N (normal) + F_lat (lateral friction)
    Rigid tip: F_lat = μ_ABS × N = 0.17 N  (per unit N)
    ES sleeve: F_lat ≈ 0.06 N  (bearing-like, free sleeve takes tangential component)

  Net tilt resistance improvement: 0.17 / 0.06 = 2.83×  [INFERRED]
  Interpretation: ES tip resists tipping ~2.8 times better than a fixed ABS tip
  under the same off-axis hit, making the ring parry window viable.
```

### Passive Game Mechanic

```
In the game engine, ED145ES is expressed as two permanent stat modifiers
on any beyblade part loadout that includes these components:

  tiltResistanceMultiplier: 2.8    // ES sleeve — reduces tilt from hits
  incomingImpulseAbsorption: 0.05  // ED145 ring — 5% of rotational impulse absorbed per hit
  absorb_spinChargeRate: Δω_ring   // ring spin-up per hit — stored for counter-release

The ring spin accumulates each time the bey is hit while NOT in special move activation.
A hit that would normally deal knockbackImpulse X instead deals X × (1 - 0.05) = 0.95X.
The ring stores the absorbed fraction as a counter-charge pool.

  counterPool += incomingImpulse × absorb_spinChargeRate_per_hit

This pool is what the special move "100 Hit Fearsome Splendor" (Case 620) and
the combo "Parry Stance" (Case 625) draw from.
```

```typescript
// Gimmick tick: ED145 ring accumulates charge from incoming hits
function applyED145Parry(bey: Beyblade, incomingImpulse: number): number {
  const absorbed = incomingImpulse * ED145_ABSORB_FRACTION;      // 0.05
  bey.parryCharge = Math.min(MAX_PARRY_CHARGE, bey.parryCharge + absorbed);
  return incomingImpulse * (1 - ED145_ABSORB_FRACTION);           // reduced hit lands on body
}
```

---

## Case 620 — [SPECIAL MOVE] 100 Hit Fearsome Splendor: Chao Xin / Poison Virgo ED145ES (Metal Masters)

**Franchise Move:** Virgo's spirit appears and spins her swords in an extremely fast counter-sequence, deflecting and punishing an attacking opponent; first used to repel Masamune's Striker (Metal Masters).

**Thesis:** 100 Hit Fearsome Splendor is the anime transcendence of the ED145ES free-spin parry gimmick (Case 619): in physical terms the gimmick accumulates a counter-charge pool from each absorbed hit (ring spin energy, tip tilt resistance), and the special move releases all of that stored energy simultaneously as a high-frequency burst of counter-contacts that goes entirely beyond what any real part geometry could produce; the move is categorized as a reactive special — unlike forward-initiated specials (Stampede Rush CS11 Case 587) it activates in direct response to an incoming attack, meaning the trigger condition is being hit during the activation window rather than approaching a target; the "100 hits" name describes the game effect: within the active window a rapid series of counter-impulses fires against the attacker at a rate of approximately one hit per 5ms over the 500ms window (100 hits × 5ms = 500ms) [GAME-DERIVED], each carrying a fraction of the total counter energy so that the cumulative damage is substantially higher than any single normal strike while the per-hit impulse is low enough that each individual strike is not a ring-out risk — the damage is concentrated, not dispersed; the physical ceiling from the gimmick is 5% absorption per hit with a maximum counter-charge pool; the special move ignores this ceiling entirely — in anime terms Virgo's swords are real and they multiply the release force to impossible levels; the counter is directional: all 100 impulses are fired back toward the attacker's position at activation, so the attacker is pushed backward by cumulative force even though each individual hit is small; the move can be countered by the QTE (a rapid tap sequence representing the attacker bracing or disengaging before the 100-hit window completes).

### Activation Model

```
100 Hit Fearsome Splendor — timing and trigger:

  Normal battle:
    Opponent attacks → Bey takes hit → parryCharge accumulates (passive gimmick)

  Special activation window (player holds special button):
    ┌──────────────────────────────────────────────────────────────┐
    │  WAITING WINDOW (up to 1500ms)                               │
    │  bey does NOT move during window                              │
    │  parryCharge continues accumulating                           │
    │  visual: ring glowing, building intensity                     │
    └──────────────────────────────────────────────────────────────┘
             │ opponent attacks (or window expires)
             ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  COUNTER BURST (500ms)                                        │
    │  100 counter-impulses fire toward attacker position           │
    │  each impulse = totalCounterEnergy / 100                      │
    │  damageMultiplier = 2.5× (anime transcendence of gimmick)    │
    │  knockbackImpulse on attacker accumulates per hit             │
    │  attacker QTE available: rapid-tap to reduce hits landed      │
    └──────────────────────────────────────────────────────────────┘
```

### Phase Structure

```
Phase 1 — "virgo_fearsome_wait":
  windUpMs: 0  (reactive — no wind-up before trigger)
  durationMs: up to 1500ms (waiting window; exits early on hit or timeout)
  effects during wait: none on opponent; parryCharge building; invulnerabilityMs: 1500
  targetFlags: { waitingForHit: true }

Phase 2 — "virgo_fearsome_counter" (fires when triggered by incoming hit):
  windUpMs: 50
  durationMs: 500
  windDownMs: 100
  effects:
    hitCount: 100
    perHitImpulse: totalCounterEnergy / 100  (back toward attacker)
    damageMultiplier: 2.5
    spinDelta: +80  (ring energy restores spin — impossible in real physics)
    invulnerabilityMs: 0  (window ends on activation)
  peakMs: 250
  peakToleranceMs: 200
  QTECounterable: true   (attacker rapid-tap reduces hits landed by up to 60%)
```

### Real vs. Anime Layer

```
Physical gimmick ceiling (Case 619):
  Max parryCharge per hit = 5% of incoming impulse
  For 10 hits at J = 0.06 N·s each: pool = 10 × 0.05 × 0.06 = 0.030 N·s total
  Released as counter: 0.030 N·s ÷ 100 = 0.0003 N·s per counter hit
  At 1 engine unit = 3.60×10⁻⁵ N·s: ≈ 8 engine-units per hit  [INFERRED]
  → Physically realistic but weak

Anime transcendence layer:
  damageMultiplier = 2.5×: Virgo's swords multiply release force ×50 above physical ceiling
  100 hits at full multiplier: total damage >> any single special move hit
  spinDelta = +80: ring energy recovery impossible for a mechanism this small
  → This is the "cheat" layer; physics derivation grounds the concept, anime breaks the ceiling
```

```typescript
// Special move: 100 Hit Fearsome Splendor
// Phase 1: waiting — reactive trigger
function applyVirgoFearsome_Wait(bey: Beyblade): void {
  bey.specialWaitActive = true;
  bey.invulnerableUntil = Date.now() + 1500;
  // parryCharge continues accumulating via normal ED145 gimmick tick
}

// Phase 2: counter burst — fires when opponent hits during wait window
function applyVirgoFearsome_Counter(bey: Beyblade, attacker: Beyblade): void {
  bey.specialWaitActive = false;
  const totalEnergy = bey.parryCharge * FEARSOME_ANIME_MULTIPLIER;  // 50× gimmick ceiling
  const perHitImpulse = totalEnergy / 100;
  const angle = angleBetween(attacker, bey);  // fire BACK toward attacker
  for (let i = 0; i < 100; i++) {
    applyForce(attacker.id,
      Math.cos(angle) * perHitImpulse,
      Math.sin(angle) * perHitImpulse);
  }
  bey.spin = Math.min(bey.maxSpin, bey.spin + 80);   // anime spin restore
  bey.parryCharge = 0;
}
```

---

## Case 621 — [GIMMICK] Spring-Mode-Change Tip: Nothing Driver and Absorb Driver Downforce-Triggered Profile Shift

**Thesis:** The Nothing driver (used on Drain Fafnir and Mirage Fafnir) and the Absorb driver (used on Geist Fafnir) both implement a mechanical tip that switches from a low-friction pointed profile to a high-friction flat or extended profile when a threshold downforce is exceeded; in the Nothing driver, the tip body is a hollow ABS cylinder with a pointed bottom that can compress axially into the driver housing against a soft polymer spring of estimated spring constant k_tip ≈ 600 N/m [ESTIMATED — softer than EG spring by ~2.5×]; the critical compression distance x_crit at which the flat base of the driver housing contacts the stadium floor is approximately x_crit = 3 mm [ESTIMATED], giving the force threshold F_crit = k_tip × x_crit = 600 × 0.003 = 1.80 N; this threshold is reached when an opponent pressing down on Fafnir applies sufficient normal force, or equivalently when launch power is high enough that the initial contact force F_launch = m × a_launch > 1.80 N; once the flat base contacts the floor, the effective tip coefficient of friction changes from μ_sharp = 0.17 (hard ABS point) to μ_flat = 0.40–0.45 (flat ABS base with larger contact area), and the beyblade enters an aggressive movement phase identical to a rubber flat tip behavior; in the Absorb driver the spring is stiffer and longer (k_absorb ≈ 1000 N/m, x_max ≈ 5 mm → E_absorb = ½ × 1000 × 0.005² = 12.5 mJ [ESTIMATED]), and the spring tip itself contacts the floor rather than the housing base, adding a spring-energy release impulse on top of the friction mode change; both drivers share the fundamental mechanic — downforce exceeds threshold, profile switches, movement character changes entirely — but Absorb adds stored spring energy that amplifies the burst.

### Mode-Change Force Threshold

```
Nothing driver — spring compression geometry:

  Normal spin state (no downforce):
    Tip profile: pointed, l_tip = 3mm protrusion
    Contact friction: μ = 0.17 (hard ABS point)
    Spin decay: dω/dt = μ × m × g × r_tip / I = 0.17 × 0.040 × 9.81 × 0.003 / 7.308×10⁻⁶
              = 2.73×10⁻⁴ / 7.308×10⁻⁶ = 27.3 rad/s²  [INFERRED]

  Under threshold downforce F > F_crit = 1.80 N:
    Tip compresses x = 3mm → flat base contacts floor
    Contact area increases from point (~0.5mm²) to disc (~10mm²)
    μ_effective = 0.40–0.45 (flat ABS)
    Spin decay: dω/dt = 0.42 × 0.040 × 9.81 × 0.010 / 7.308×10⁻⁶ = 224 rad/s²  [INFERRED]
    → Spin loss rate increases 8.2× but lateral grip force enables directed movement

  Acceleration in flat phase:
    F_lat = μ_flat × N = 0.42 × (m × g) = 0.42 × 0.040 × 9.81 = 0.165 N
    a_lat = F_lat / m = 0.165 / 0.040 = 4.12 m/s²
    Over 200ms flat phase: Δv = 4.12 × 0.200 = 0.824 m/s  [INFERRED]
```

```
Absorb driver — spring energy addition:

  Spring k_absorb = 1000 N/m, x_max = 5mm [ESTIMATED]
  E_spring = ½ × 1000 × (0.005)² = 12.5 mJ
  Impulse from spring release:
    J_spring = √(2 × m × E_spring) = √(2 × 0.040 × 0.0125) = √(0.001) = 0.0316 N·s [INFERRED]
  Additional velocity boost from spring:
    Δv_spring = J_spring / m = 0.0316 / 0.040 = 0.791 m/s  [INFERRED]
  Combined burst velocity (flat friction + spring):
    Δv_total = 0.824 + 0.791 = 1.615 m/s  [INFERRED]

  Comparison to EG spring (E = 48 mJ, Case 556):
    EG delivers Δv_EG = √(2 × 48×10⁻³ / 0.040) = √(2.4) = 1.55 m/s
    Absorb spring delivers 0.791 m/s (51% of EG) — meaningful but smaller  [INFERRED]
```

### Passive Game Mechanic

```
In the game engine, the spring-mode-change tip is a conditional gimmick
that activates when the beyblade receives a downward hit above the force threshold:

  normalState:
    tipFriction: 0.17
    movementStyle: "stamina"   // slow drift, orbital

  modeChangeTrigger:
    condition: incomingHit.downwardForce > NOTHING_FORCE_THRESHOLD (1.80 N)
               OR launchPower > LAUNCH_HIGH_THRESHOLD (120%)
    duration: 200ms (flat phase) for Nothing driver
    duration: 200ms + spring release window (50ms) for Absorb driver

  flatPhaseState:
    tipFriction: 0.42
    movementStyle: "attack"    // aggressive dash, self-directed
    bonusImpulse: 0            // Nothing: no spring
    bonusImpulse: 876          // Absorb: J_spring / engine_unit = 0.0316/3.60×10⁻⁵ ≈ 878 [GAME-DERIVED]
```

```typescript
// Gimmick tick: Nothing/Absorb driver mode check
function checkSpringModeChange(bey: Beyblade, hit: HitEvent): void {
  const downforce = hit.normalForce * Math.sin(hit.impactAngle);
  if (downforce > NOTHING_FORCE_THRESHOLD) {
    bey.tipMode = "flat";
    bey.tipModeExpiresAt = Date.now() + 200;
    if (bey.tipType === "absorb") {
      // Additional spring impulse on Absorb driver
      const angle = bey.angle * Math.PI / 180;
      applyForce(bey.id,
        Math.cos(angle) * ABSORB_SPRING_IMPULSE,   // 878 engine-units
        Math.sin(angle) * ABSORB_SPRING_IMPULSE);
    }
  }
}
```

---

## Case 622 — [GIMMICK] Counter-Spin Passive Absorption: Fafnir Left-Spin Rubber Free-Spin Layers and Additive Contact Friction

**Thesis:** Fafnir beyblades spin left (counter-clockwise when viewed from above) while the vast majority of opponents spin right (clockwise); this spin-direction difference fundamentally changes the physics of surface contact between the two beyblades during a clash; when a right-spin attacker's AR contacts Fafnir's rubber free-spinning outer disc or frame, the attacker's surface moves in the same rotational direction relative to the contact point as Fafnir's counter-spin (both surfaces move in opposing directions around the shared contact tangent), producing an additive relative surface velocity Δv_surface = v_attacker_surface + v_Fafnir_surface rather than the subtractive Δv_surface = |v_attacker_surface − v_Fafnir_surface| that occurs in same-spin contact; for a right-spin attacker at ω_A = 400 rad/s and Fafnir at ω_F = 350 rad/s (both measured at outer radius r = 25 mm), same-spin contact would give Δv_surface = |400 − 350| × 0.025 = 1.25 m/s while counter-spin contact gives Δv_surface = (400 + 350) × 0.025 = 18.75 m/s — a 15× higher relative surface velocity [INFERRED]; the higher Δv_surface at rubber contact (μ_rubber = 0.50) drives a proportionally larger friction force and angular momentum transfer; specifically, the friction torque on Fafnir from contact: τ_F = μ_rubber × m × g × r = 0.50 × 0.040 × 9.81 × 0.025 = 4.91×10⁻³ N·m [INFERRED], directed to accelerate Fafnir's counter-spin (the attacker's surface motion adds to Fafnir's spin rather than opposing it); simultaneously, the same friction torque decelerates the attacker: τ_A = −4.91×10⁻³ N·m; over a 10ms contact period: Δω_Fafnir = τ × t / I = 4.91×10⁻³ × 0.010 / 7.308×10⁻⁶ = +6.71 rad/s and Δω_attacker = −6.71 rad/s per contact [INFERRED]; this is the physical foundation of Fafnir's passive absorb identity: every physical strike from a right-spin opponent simultaneously drains the attacker's spin and restores Fafnir's, making sustained assault counterproductive for the attacker.

### Counter-Spin Contact Velocity Analysis

```
Same-spin contact (normal beyblade vs beyblade):
  Both spin clockwise (right-spin)
  At contact point tangent:
    v_A_surface = +ω_A × r  (rightward)
    v_B_surface = +ω_B × r  (rightward, same direction)
    Δv_surface = |ω_A − ω_B| × r  (small if similar spin rates)
  Low friction force → low spin transfer → normal battle

Counter-spin contact (Fafnir vs right-spin opponent):
  Fafnir: counter-clockwise (left-spin)  ω_F = 350 rad/s
  Attacker: clockwise (right-spin)       ω_A = 400 rad/s
  At contact point tangent:
    v_A_surface = +ω_A × r = +10.0 m/s (rightward)
    v_F_surface = −ω_F × r = −8.75 m/s (leftward, opposite direction)
    Δv_surface = v_A + |v_F| = 10.0 + 8.75 = 18.75 m/s  ← additive

  Friction force: F = μ_rubber × N = 0.50 × 0.393 N = 0.196 N
  Torque on Fafnir: τ_F = F × r = 0.196 × 0.025 = +4.91×10⁻³ N·m (spin up)
  Torque on attacker: τ_A = −4.91×10⁻³ N·m (spin down)

  Per 10ms contact:
    Δω_Fafnir   = +6.71 rad/s (gains spin)
    Δω_attacker = −6.71 rad/s (loses spin)

  Same-spin equivalent at same ω values:
    Δv_surface_same = (400 − 350) × 0.025 = 1.25 m/s → Δω = ±0.448 rad/s
    Counter-spin: 15× more spin transfer than same-spin  [INFERRED]
```

### Passive Game Mechanic

```
Counter-spin absorption is a permanent passive modifier on any left-spin beyblade:

  Per contact with a right-spin opponent:
    bey.spin += COUNTER_SPIN_ABSORB_RATE × contactDurationMs / 10
    opponent.spin -= COUNTER_SPIN_ABSORB_RATE × contactDurationMs / 10

    COUNTER_SPIN_ABSORB_RATE = 6.71 rad/s per 10ms contact  [CONFIRMED derivation above]

  Against a same-spin opponent (also left-spin):
    Normal spin-steal rates apply (15× less effective)

  The rubber free-spin disc amplifies this: the disc contacts without transferring
  full linear momentum to Fafnir body (free-spin decoupling like ED145, Case 619),
  so Fafnir takes less knockback while the spin transfer still occurs fully.
```

```typescript
// Gimmick: counter-spin passive absorption
function applyCounterSpinAbsorb(fafnir: Beyblade, attacker: Beyblade, contactMs: number): void {
  const isCounterSpin = fafnir.spinDirection !== attacker.spinDirection;
  const spinTransferRate = isCounterSpin
    ? COUNTER_SPIN_ABSORB_RATE          // 6.71 rad/s per 10ms
    : COUNTER_SPIN_ABSORB_RATE * 0.067; // 15× less for same-spin
  const spinTransfer = spinTransferRate * (contactMs / 10);
  fafnir.spin   = Math.min(fafnir.maxSpin, fafnir.spin + spinTransfer);
  attacker.spin = Math.max(0, attacker.spin - spinTransfer);
}
```

---

## Case 623 — [SPECIAL MOVE] Nothing Break: Free De La Hoya / Drain Fafnir 8 Nothing and Mirage Fafnir Nothing 2S (Beyblade Burst)

**Franchise Move:** As Drain / Mirage Fafnir absorbs the opponent's attack, the downforce causes the Nothing driver's base to push in, going flat, giving Fafnir a huge boost of speed and power to counterattack with enhanced force.

**Thesis:** Nothing Break is the anime transcendence of the spring-mode-change tip gimmick (Case 621) combined with the counter-spin absorption gimmick (Case 622); physically, the Nothing driver's mode-change delivers a maximum Δv of 0.824 m/s in the flat phase over 200ms [INFERRED, Case 621], and the counter-spin absorption simultaneously boosts Fafnir's spin by 6.71 rad/s per 10ms of contact [CONFIRMED, Case 622]; in the special move the anime layer multiplies both effects far beyond physical limits: the speed boost is not 0.824 m/s from friction alone but a full directed dash toward the attacking opponent at the moment of absorption peak, as if Fafnir converts 100% of the absorbed spin energy from the attacker directly into linear kinetic energy; the move fires as a one-button ultimate in which Fafnir first enters an absorb stance (stationary, parryCharge building, absorbing every hit via the counter-spin gimmick), then at the player's chosen moment releases all absorbed spin energy as a single massive forward burst with a damage multiplier that scales with how much spin was absorbed — the more the opponent attacked during the absorb window, the harder the Nothing Break counterstrike; the physics ceiling for this effect (Case 621) is around 12.5–24 mJ of energy and Δv ≈ 0.8 m/s; the special move ignores this completely, treating absorbed spin as unlimited kinetic potential and delivering a hit comparable to a maximum EG spring burst (Δv ≈ 1.5 m/s, E ≈ 48 mJ) even from a small contact.

### Phase Structure

```
Nothing Break — three-phase sequence:

Phase 1 — "nothing_break_absorb" (absorb stance):
  windUpMs: 100
  durationMs: up to 2000ms (player holds button; releases when ready)
  effects:
    movementLock: true  (Fafnir stays near-stationary — high stamina LAD orbit only)
    incomingDamageReduction: 0.70  (30% of hits absorbed; anime enhancement of 5% gimmick)
    spinAbsorbRate: 3× normal counter-spin rate  (anime multiplier)
    parryCharge: accumulates from every absorbed hit
  visual: Fafnir glowing deeper purple/green with each absorbed hit

Phase 2 — "nothing_break_burst" (player releases button):
  windUpMs: 50
  durationMs: 300ms
  windDownMs: 100
  effects:
    linearImpulse: BASE_NOTHING_IMPULSE + (parryCharge × NOTHING_SCALE_FACTOR)
    spinDelta: +parryCharge × NOTHING_SPIN_RESTORE   (absorbed spin returned + bonus)
    damageMultiplier: 1.8 + (absorbedHitCount × 0.05)  (caps at 3.0 after ~24 hits)
    knockbackImpulse: BASE_NOTHING_IMPULSE × 0.8
    direction: facing (toward last attacker position)
  QTECounterable: true
  peakMs: 150
  peakToleranceMs: 100
```

### Scaling Model

```
Nothing Break damage scaling with absorbed hits:

  absorbedHits = 0:  damageMultiplier = 1.8×  (base special move power)
  absorbedHits = 5:  damageMultiplier = 2.05×
  absorbedHits = 12: damageMultiplier = 2.40×
  absorbedHits = 20: damageMultiplier = 2.80×
  absorbedHits = 24: damageMultiplier = 3.00×  (hard cap)

  Interpretation: opponent who attacks Fafnir 24 times during absorb window
  effectively powers a 3.0× damage counterattack.
  This is the "nothing break" — the opponent's own aggression is broken back on them.

Physical anchor (Case 621):
  Real Nothing driver mode-change: Δv = 0.824 m/s, ~28 engine-units of base impulse  [INFERRED]
  Anime Nothing Break: BASE_NOTHING_IMPULSE = 6000 engine-units minimum  [GAME-DERIVED]
  Scaling cap: 6000 + (24 × 300) = 13200 engine-units at full absorb  [GAME-DERIVED]
```

```typescript
// Special move: Nothing Break
function activateNothingBreak_Burst(bey: Beyblade, target: Beyblade | null): void {
  const absorbedHits  = bey.nothingAbsorbedHits;
  const dmgMult = Math.min(3.0, 1.8 + absorbedHits * 0.05);
  const impulse = NOTHING_BASE_IMPULSE + bey.parryCharge * NOTHING_SCALE_FACTOR;
  const spinRestore = bey.parryCharge * NOTHING_SPIN_RESTORE + 100; // always restores min 100

  const angle = bey.angle * Math.PI / 180;
  applyForce(bey.id, Math.cos(angle) * impulse, Math.sin(angle) * impulse);
  bey.spin = Math.min(bey.maxSpin, bey.spin + spinRestore);
  bey.damageMultiplierActive = dmgMult;
  bey.damageMultiplierExpiresAt = Date.now() + 300;

  if (target) {
    const kb = impulse * 0.8;
    applyForce(target.id, -Math.cos(angle) * kb, -Math.sin(angle) * kb);
  }

  // Reset absorb state
  bey.parryCharge = 0;
  bey.nothingAbsorbedHits = 0;
}
```

---

## Case 624 — [SPECIAL MOVE] Absorb Break: Free De La Hoya / Geist Fafnir 8'Proof Absorb (Beyblade Burst Turbo)

**Franchise Move:** When Geist Fafnir gets pushed down by the opposing beyblade, the Absorb driver's spring gets pushed down, makes contact with the stadium floor, and increases Fafnir's speed; Fafnir then strikes with a powerful counterattack; can also activate at battle start if Free launches at full strength.

**Thesis:** Absorb Break is the anime transcendence of the Absorb driver spring mechanism (Case 621), distinguished from Nothing Break (Case 623) by two critical differences: the trigger mechanism is the spring floor-contact (hard mechanical event) rather than the player's hold-release timing, and the move can also fire at launch when high launch power pre-compresses the spring; in the game Absorb Break is a faster, more explosive special move than Nothing Break — it has a shorter absorb window (the spring only needs one good hit to compress), a higher per-hit impulse (the Absorb driver spring adds J_spring ≈ 878 engine-units on top of the mode-change burst), and no scaling based on absorbed hit count (it fires at full power from a single compression event); physically, the Absorb driver spring (k ≈ 1000 N/m, E ≈ 12.5 mJ) provides about 26% of the EG spring energy (48 mJ, CS11 Case 587) — enough for a meaningful burst but not a full Stampede Rush level event; the anime transcendence raises the Absorb Break counterattack to approximately 1.5× the power of Nothing Break's base (no absorb scaling) and adds an explosive floor-contact visual (lightning from the spring tip touching the floor) that has no physical basis; the launch-trigger variant gives the move a dual function: it is simultaneously a reactive counter and an aggressive opener depending on launch power, which is unique among all special moves in the roster.

### Phase Structure

```
Absorb Break — trigger variants:

Variant A — Reactive counter (opponent pushes down):
  Phase 1 — "absorb_break_compress":
    Trigger: incomingHit.downwardForce > ABSORB_TRIGGER_THRESHOLD
    windUpMs: 0  (instantaneous — spring compresses from hit)
    durationMs: 50ms  (brief compression visual)
    effects: incomingDamageReduction: 0.50 (absorb half the hit)
             springChargeReady: true

  Phase 2 — "absorb_break_burst":
    windUpMs: 50
    durationMs: 250ms
    windDownMs: 100
    effects:
      linearImpulse: ABSORB_BASE_IMPULSE     // 9000 engine-units [GAME-DERIVED]
      springBonusImpulse: ABSORB_SPRING_BONUS // 878 engine-units (physical spring)
      spinDelta: +120
      damageMultiplier: 2.2  (fixed — no hit-count scaling unlike Nothing Break)
      knockbackImpulse: ABSORB_BASE_IMPULSE × 0.9

Variant B — Launch opener (high launch power > 120%):
  Phase 1 — immediate on battle-start:
    windUpMs: 200 (dramatic launch visual)
    durationMs: 300ms
    effects: same as Variant A Phase 2
    difference: fires toward nearest opponent at battle start
                no absorb reduction (attacker, not defender)
```

### Absorb Break vs Nothing Break Comparison

```
                    Nothing Break           Absorb Break
──────────────────────────────────────────────────────────────────
Trigger             Player hold+release     Incoming hit downforce / high launch
Absorb window       Up to 2000ms            Single hit compression (instant)
Hit-count scaling   Yes (1.8× → 3.0×)       No (fixed 2.2×)
Base impulse        6000 engine-units       9000 + 878 = 9878 engine-units
Spring energy       Not applicable          Absorb spring 12.5 mJ → 878 units
Best use            Outlasting aggression   Punishing a single heavy attack
Launch variant      No                      Yes (aggressive opener)
Anime visual        Purple absorption glow  Lightning from floor contact
QTE counterable     Yes                     Yes (shorter window — harder to counter)
```

```typescript
// Special move: Absorb Break
function applyAbsorbBreak(bey: Beyblade, triggerHit: HitEvent | null,
                          isLaunchVariant: boolean): void {
  const impulse = ABSORB_BASE_IMPULSE + ABSORB_SPRING_BONUS;
  const angle = bey.angle * Math.PI / 180;

  // Apply absorbed damage reduction on trigger hit
  if (triggerHit && !isLaunchVariant) {
    triggerHit.damage *= 0.50;  // absorb half
  }

  applyForce(bey.id, Math.cos(angle) * impulse, Math.sin(angle) * impulse);
  bey.spin = Math.min(bey.maxSpin, bey.spin + 120);
  bey.damageMultiplierActive = 2.2;
  bey.damageMultiplierExpiresAt = Date.now() + 250;
}
```

---

## Case 625 — [COMBO] Parry Stance: Player-Skill Expression of the Free-Spin Ring Parry Gimmick (ED145ES)

**Thesis:** Parry Stance is the combo-level expression of the ED145ES free-spin ring parry gimmick (Case 619); whereas the special move 100 Hit Fearsome Splendor (Case 620) releases parryCharge as an anime-transcendent 100-hit counter burst, the Parry Stance combo is a bounded, physics-respecting player-skill technique in which the player inputs a specific 3-key sequence to deliberately time a parry window within a single orbital pass, and if an opponent contacts the beyblade during that window, the stored ring charge is released as a single counter-hit (not 100 hits) at normal physical force levels; the mechanics follow the combo ceiling rules (CS12 Case 614): damageMultiplier ≤ 1.5, no invulnerability, lockMs ≤ 300ms, no AoE — the counter-hit is a single directed impulse toward the attacker, stronger than a normal bounce because the ring charge is added to the natural COR rebound but bounded by these ceilings; the 3-key sequence is Defense → Defense → Attack (KKJ, identical to Riposte) but its physics is different: Riposte (CS12 Case 606) is a parry-counter based on COR rebound timing, while Parry Stance is specifically the ring-charge release and therefore only available to beyblades equipped with a free-spin ring component (ED145, or any part flagged `hasFreespinRing: true`); the player skill lies in knowing when an attack is coming and timing the 3-key window (500ms) to expire just as contact occurs, releasing the ring energy at peak.

### Combo Specification

```
Parry Stance — combo definition:

  id: "parry-stance"
  sequence: ["defense", "defense", "attack"]  (KKJ)
  windowMs: 500
  cooldownMs: 2400   (~4 orbital periods — CS12 Case 612)
  powerCost: 20
  typeRestriction: "defense"
  partRequirement: hasFreespinRing   (ED145 or equivalent)

  effects on counter-hit:
    counterImpulse: parryCharge × PARRY_STANCE_RELEASE_FACTOR  (bounded ≤ 1800 engine-units)
    damageMultiplier: 1.35  (below 1.5 ceiling)
    lockMs: 200             (below 300ms ceiling)
    spinDelta: +20          (small ring-release spin boost)
    noInvulnerability: true (combo rule — no invulnerability)

  on miss (no contact during window):
    parryCharge not consumed  (player read the situation wrong, no penalty except cooldown)
```

```
Parry Stance vs 100 Hit Fearsome Splendor:

  Parry Stance (Combo):              100 Hit Fearsome Splendor (Special):
  ──────────────────────             ──────────────────────────────────────
  3-key input required               One button
  Window: 500ms                      Window: up to 1500ms
  Single counter-hit                 100 hits
  damageMultiplier: 1.35×            damageMultiplier: 2.5×
  No invulnerability                 invulnerabilityMs: 1500 during wait
  Physics-bounded                    Anime-transcendent
  Available on defense-type beys     Available on Virgo-archetype beys only
  Costs 20 power                     Costs 100 power
```

---

## Case 626 — [COMBO] Spring Counter: Player-Skill Expression of the Spring-Mode-Change + Counter-Spin Gimmick

**Thesis:** Spring Counter is the combo-level expression of the spring-mode-change tip gimmick (Case 621) combined with the counter-spin absorption gimmick (Case 622); unlike Nothing Break (Case 623) which waits and releases all absorbed energy at once, Spring Counter is a deliberate 3-key positioning technique in which the player uses movement inputs to approach an opponent from a specific angle (movement toward opponent — ↓), then activates the absorption stance (Defense — K), then releases the dash (Attack — J), exploiting the tipMode change to convert the downforce from the player's own approach into a spring-compression burst rather than waiting for the opponent to apply downforce; the physics is identical to Case 621 — approach at speed creates relative normal force at contact that can exceed F_crit = 1.80 N, triggering the mode change — but it is player-initiated through movement rather than reactively triggered by an opponent hit; the counter-spin bonus (Case 622) amplifies the combo for Fafnir-archetype beyblades specifically: the spin gained during the K-hold absorb moment (even one or two contact ticks) adds to the dash burst, and because this spin gain is passive and physical it is not blocked by the combo ceiling rules; the combo is stamina-type restricted (only stamina or balanced beyblades have the rubber free-spin layer necessary for counter-spin absorption to function and the spring-mode tip family is native to the stamina archetype).

### Combo Specification

```
Spring Counter — combo definition:

  id: "spring-counter"
  sequence: ["moveDown", "defense", "attack"]  (↓KJ)
  windowMs: 450
  cooldownMs: 3000   (~5 orbital periods)
  powerCost: 25
  typeRestriction: "stamina"
  partRequirement: hasSpringTip   (Nothing, Absorb, or equivalent spring-mode tip)

  effects on activation:
    dashImpulse: SPRING_COUNTER_BASE + counterSpinBonus
      SPRING_COUNTER_BASE = 800 engine-units (flat-phase friction burst, Case 621)
      counterSpinBonus = if (isCounterSpin && opponent in range):
                           spinAbsorbed × COUNTER_SPIN_TO_IMPULSE_FACTOR
                         else: 0
    damageMultiplier: 1.30
    lockMs: 150   (brief — spring burst is fast)
    spinDelta: +counterSpinBonus_rad  (spin absorbed during K-hold is kept)

  ceiling compliance:
    damageMultiplier 1.30 ≤ 1.5  ✓
    lockMs 150 ≤ 300ms           ✓
    no invulnerability            ✓
    no AoE                        ✓
    spinDelta is passive physical gain — not a special-move-class spin restore  ✓
```

```typescript
// Combo: Spring Counter
function applySpringCounter(bey: Beyblade, target: Beyblade | null): void {
  let impulse = SPRING_COUNTER_BASE;   // 800 engine-units from flat-phase burst

  // Counter-spin bonus: spin absorbed during K-hold moment
  if (target && bey.spinDirection !== target.spinDirection) {
    const contactMs = 20; // estimated contact during K-hold phase
    const spinGained = COUNTER_SPIN_ABSORB_RATE * (contactMs / 10);
    bey.spin = Math.min(bey.maxSpin, bey.spin + spinGained);
    impulse += spinGained * COUNTER_SPIN_TO_IMPULSE_FACTOR;
    if (target) target.spin = Math.max(0, target.spin - spinGained);
  }

  // Cap impulse at combo ceiling
  impulse = Math.min(impulse, COMBO_MAX_IMPULSE);  // CS12 Case 614 ceiling

  const angle = bey.angle * Math.PI / 180;
  applyForce(bey.id, Math.cos(angle) * impulse, Math.sin(angle) * impulse);
  bey.damageMultiplierActive = 1.30;
  bey.damageMultiplierExpiresAt = Date.now() + 150;
}
```

---

---

## Case 627 — [GIMMICK] Aggressive-Tip Streak Dash: Soft/Rubber Flat Tip at Peak Spin Producing a Directed High-Speed Cross-Stadium Approach Path

**Thesis:** A beyblade fitted with a soft or rubber flat tip at or near its launch spin maximum does not orbit the bowl perimeter the way a sharp-tipped stamina type does; instead the high lateral friction coefficient (μ_rubber = 0.50, μ_soft_flat ≈ 0.40) generates a lateral ground-reaction force large enough to overcome the centripetal bias of the bowl slope, and the beyblade instead launches itself in nearly straight diagonal dashes that carry it across the full diameter of the stadium before contacting a wall or opponent; for a standard MFB assembly (m = 0.040 kg) on a flat or lightly-bowled surface the lateral friction force is F_lat = μ × m × g = 0.40 × 0.040 × 9.81 = 0.157 N [INFERRED], and the acceleration available for directed movement is a_dash = F_lat / m = 0.157 / 0.040 = 3.92 m/s²; starting from a bowl-rim orbital velocity v_orb = 0.60 m/s (Case 589 orbital radius ≈ 160mm, T ≈ 1.7s → v = 2π×0.160/1.7 = 0.591 m/s [INFERRED]) the bey can accelerate along its dash vector for the duration of stadium crossing (d_cross ≈ 280mm for a 400px-radius arena): t_cross = (−v_orb + √(v_orb² + 2 × a_dash × d_cross)) / a_dash = (−0.591 + √(0.349 + 0.219)) / 3.92 = (−0.591 + √0.568) / 3.92 = (−0.591 + 0.754) / 3.92 = 0.0416s = 41.6ms, reaching approach velocity v_approach = v_orb + a_dash × t_cross = 0.591 + 3.92 × 0.0416 = 0.754 m/s [INFERRED]; this approach velocity is modest but a beyblade that has been orbiting for several laps can carry significantly more velocity; at peak launch spin (ω₀ = 600 rad/s) the gyroscopic moment is large enough to maintain the bey's upright orientation throughout the dash, so the tip stays flat on the floor and the friction force remains maximal for the entire crossing; the path is not perfectly straight — precession from the spin produces a gradual rightward curve (for right-spin) of approximately 5–15° over the stadium diameter [ESTIMATED], which means the actual approach angle to a stationary target must be calculated at activation rather than simply pointing in the current facing direction; this precession-adjusted trajectory is the physical basis for the "streak" path in Abyss Fire (Case 628).

### Streak Path Geometry

```
Aggressive-tip streak — cross-section trajectory:

  Bowl plan view (top-down):
  ┌─────────────────────────────────────────┐
  │                                         │
  │    .  ←── rim orbit position            │
  │   /   ←── dash path (precession curve)  │
  │  /                                      │
  │ X   ←── opponent position (target)      │
  │                                         │
  └─────────────────────────────────────────┘

  Tip behavior comparison at same spin:
    Sharp tip (μ = 0.017 effective): a_dash = 0.167 m/s²  → barely moves
    Soft flat (μ = 0.40):            a_dash = 3.92 m/s²   → cross-stadium dash in 41ms
    Rubber flat (μ = 0.50):          a_dash = 4.91 m/s²   → cross-stadium dash in 37ms

  Approach velocity at contact (starting from orbital v = 0.591 m/s):
    Soft flat: v_approach = 0.754 m/s  [INFERRED]
    Rubber:    v_approach = 0.785 m/s  [INFERRED]

  Additional velocity from extended pre-dash orbit:
    A bey at v_orb = 1.0 m/s entering the dash:
    v_approach = 1.0 + a_dash × 0.0416 = 1.163 m/s  (soft flat)  [INFERRED]
    v_approach = 1.0 + 4.91 × 0.037  = 1.182 m/s  (rubber)       [INFERRED]
```

### Passive Game Mechanic

```
The aggressive-tip streak dash is expressed in the game engine as a tip-type property:

  tipType: "rubber_flat" | "soft_flat"
  movementStyle: "aggressive"  (vs "stamina" for sharp, "balanced" for ball)

  Every physics tick for aggressive-movement beyblades:
    1. Compute current orbital velocity vector
    2. Add a_dash force component in the facing direction
    3. Apply precession correction (5° rightward per 100ms at ω > 50% maxSpin)

  The "streak path" used by Abyss Fire (Case 628) and Streak Rush (Case 629):
    streakAngle = angleTo(opponent) − precessionCorrection(currentSpin, distanceToCross)
    streakImpulse = tipFriction × m × g × crossingTimeMs / 1000 × ENGINE_IMPULSE_SCALE
```

```typescript
// Gimmick tick: aggressive flat-tip directed movement
function applyAggressiveTipDash(bey: Beyblade, targetPos: Vec2 | null): void {
  if (bey.tipType !== "rubber_flat" && bey.tipType !== "soft_flat") return;
  const mu = bey.tipType === "rubber_flat" ? 0.50 : 0.40;
  const aLat = mu * GRAVITY;  // 4.91 or 3.92 m/s²

  // Directed toward target if one exists, else facing direction
  const baseAngle = targetPos
    ? Math.atan2(targetPos.y - bey.y, targetPos.x - bey.x)
    : bey.angle * Math.PI / 180;

  // Precession correction: right-spin curves rightward ~8° per 100ms at full spin
  const spinFraction = bey.spin / bey.maxSpin;
  const precessionDeg = 8 * spinFraction * (TICK_MS / 100);
  const dashAngle = baseAngle + (precessionDeg * Math.PI / 180);

  const forceScale = aLat * bey.mass * TICK_MS / 1000 / ENGINE_FORCE_UNIT;
  applyForce(bey.id, Math.cos(dashAngle) * forceScale, Math.sin(dashAngle) * forceScale);
}
```

---

## Case 628 — [SPECIAL MOVE] Abyss Fire: Mariam / Sharkrash (Original Series / Bakuten Shoot Beyblade)

**Franchise Move:** A streak attack in which Sharkrash cuts across the stadium at extreme speed leaving abyss shark mirage afterimages in its wake, then delivers a heavy hit with massive recoil that launches the opponent.

**Thesis:** Abyss Fire is the anime transcendence of the aggressive-tip streak dash gimmick (Case 627) taken to an impossible extreme: the physical gimmick produces approach velocities of 0.75–1.18 m/s and a single crossing path [INFERRED, Case 627], but the special move projects Sharkrash across the full stadium in a precisely-aimed diagonal streak at speeds the anime renders as visible motion blur, leaves three persistent shark-mirage afterimage zones along the path that threaten the traversed space for 400ms after the main pass, and delivers a final impact with an overwhelming knockbackImpulse tuned for ring-out rather than spin damage; the mirage mechanic is the unique element of this move that has no physical basis — real beyblades do not persist at prior positions — and is the clearest example of the special move as anime-rule-breaker: the mirages are independently threatening objects occupying the streak corridor, punishing any opponent movement through that zone while the main beyblade continues toward its target; the move is explicitly ring-out oriented: damageMultiplier is moderate (1.8×) but knockbackImpulse is the highest in the current roster, calibrated to send a target near the wall out of the arena regardless of their defense type; this is also the first move that calculates and travels a target-aimed streak path rather than firing in the bey's current facing direction, meaning the player's aim is automatic at activation but the opponent can still move during the ~150ms travel time if they read the activation early enough; the QTE for the opponent is a directional dodge (choose left or right) timed to the travel window.

### Phase Structure

```
Abyss Fire — phase sequence:

Phase 1 — "abyss_fire_streak" (travel):
  windUpMs: 80  (Sharkrash crouches briefly — shark spirit materializes)
  durationMs: 150ms  (streak travel across stadium at anime-impossible speed)
  effects during travel:
    bey position: lerp from startPos to calculated strikePos over 150ms
    mirageSpawn: 3 mirage zones at 25%, 50%, 75% of streak path
      each mirage: radius 60px, duration 400ms from spawn time
      mirage damage: 20% of main hit damageMultiplier (chip damage)
      mirage visualEffect: shark silhouette afterimage, blue-white particle burst
    invulnerabilityMs: 150 (bey is untouchable during travel — it is the weapon)

Phase 2 — "abyss_fire_impact" (hit):
  windUpMs: 0  (no delay — impact occurs at end of travel)
  durationMs: 80ms
  windDownMs: 200ms
  effects:
    linearImpulse: 2000 engine-units (self forward momentum maintained)
    knockbackImpulse: 14000 engine-units  ← HIGHEST IN ROSTER [GAME-DERIVED]
    damageMultiplier: 1.8×
    spinDelta: +30 (minor spin from aggressive contact)
    targetFlags: { canHitGrounded: true, canHitAirborne: false }
    rangeCheck: "contact"  (must physically reach target)
  peakMs: 40
  peakToleranceMs: 30
  QTEType: "dodge_direction"  (opponent picks ← or → to reduce knockback by 60%)
  QTEWindowMs: 100  (tight window — fast move, hard to react)
```

### Mirage Zone Mechanic

```
Abyss Fire path — mirage placement:

  startPos ──25%──mirage1──25%──mirage2──25%──mirage3──25%── strikePos
       │            │             │             │              │
    t=0ms       t=37ms        t=75ms        t=112ms       t=150ms
                persist        persist       persist
                400ms          400ms         400ms

  Each mirage zone (radius 60px):
    On entry: opponent takes chip damage = mainHitDamage × 0.20
    Can only trigger once per mirage (not continuous)
    Visual: blue glowing shark silhouette at position, fades over 400ms

  Post-pass threat:
    If opponent dodged the main hit (QTE success) they may still cross a mirage zone
    during their dodge movement → chip damage is unavoidable if dodging through the path
    This punishes "dodge along the streak path" as opposed to "dodge perpendicular"

  Correct counter-play: dodge perpendicular to streak direction (left or right of path)
  Incorrect: dodge backward along the path (crosses all three mirages)
```

### Ring-Out Calibration

```
Abyss Fire knockbackImpulse = 14000 engine-units:

  Physical basis (Case 627 flat-face smash at v_approach = 1.18 m/s):
    J_smash = m_eff × v × (1+e) = 0.020 × 1.18 × 1.67 = 0.0395 N·s
    In engine units: 0.0395 / 3.60×10⁻⁵ = 1097 engine-units  [INFERRED]

  Anime transcendence multiplier: 14000 / 1097 = 12.8×  [GAME-DERIVED]
  Interpretation: the shark spirit multiplies the contact force ~13× beyond physical limit

  Ring-out probability:
    Against a target 200px from wall:
      Δv_target = knockbackImpulse_N·s / m_target = (14000 × 3.60×10⁻⁵) / 0.040
               = 0.504 / 0.040 = 12.6 m/s  (anime — instantly at wall)  [GAME-DERIVED]
    In game terms: target receives impulse pointing away from attacker;
    if target is within 250px of arena boundary, Abyss Fire is a near-guaranteed ring-out
    unless QTE succeeds (reduces knockback by 60% → 5600 units → 5.04 m/s still large)
```

```typescript
// Special move: Abyss Fire
function activateAbyssFire(bey: Beyblade, target: Beyblade): void {
  const strikePos = computeStreakStrikePos(bey, target);
  const pathVec   = { x: strikePos.x - bey.x, y: strikePos.y - bey.y };
  const pathLen   = Math.hypot(pathVec.x, pathVec.y);

  // Spawn three mirage zones along path
  for (let i = 1; i <= 3; i++) {
    const frac = i / 4;
    spawnMirageZone({
      x: bey.x + pathVec.x * frac,
      y: bey.y + pathVec.y * frac,
      radius: 60,
      durationMs: 400,
      chipsOn: target.id,
      chipDamageMultiplier: 0.20,
      visual: "abyss_shark_mirage",
    });
  }

  // Teleport/lerp bey along streak path over 150ms (handled by renderer)
  bey.streakTarget = strikePos;
  bey.streakDurationMs = 150;
  bey.invulnerableUntil = Date.now() + 150;

  // Impact fires at end of travel
  scheduleImpact(150, () => {
    const impactAngle = Math.atan2(pathVec.y, pathVec.x);
    applyForce(target.id,
      Math.cos(impactAngle) * ABYSS_FIRE_KNOCKBACK,  // 14000 engine-units
      Math.sin(impactAngle) * ABYSS_FIRE_KNOCKBACK);
    target.damageReceived += BASE_DAMAGE * 1.8;
    bey.spin = Math.min(bey.maxSpin, bey.spin + 30);
  });
}
```

---

## Case 629 — [COMBO] Streak Rush: Player-Skill Expression of the Aggressive-Tip Streak Dash Gimmick

**Thesis:** Streak Rush is the combo-level expression of the aggressive-tip streak dash gimmick (Case 627); whereas Abyss Fire (Case 628) fires automatically at the calculated optimal angle with anime-speed travel and mirage afterimages, Streak Rush is the physics-bounded player-skill version in which the player must manually aim the streak using directional inputs (pointing toward the opponent with a diagonal move combination) and the dash travels at the real gimmick velocity (~0.75–1.18 m/s) without any mirage zones or travel invulnerability; the 3-key sequence is →↓J (moveRight + moveDown + attack) or equivalently ←↓J for a left-diagonal streak, representing the player pointing the bey toward the opponent's position with a two-component direction vector and then releasing the attack input to commit to the dash; the skill requirement is aim accuracy — the player must pre-aim the diagonal so that the streak path intersects the opponent's current position, accounting for the precession curve of their bey's spin direction; a miss (streak passes the opponent without contact) deals no damage and wastes the cooldown; on hit the knockbackImpulse bonus is significant but bounded well below the Abyss Fire level — this is a ring-out threat combo only when the opponent is already near the wall, not a guaranteed ring-out like the special move; the combo is available to attack-type beyblades only, since the aggressive flat/rubber tip that enables the streak is the defining feature of the attack archetype.

### Combo Specification

```
Streak Rush — combo definition:

  id: "streak-rush"
  sequence: ["moveRight", "moveDown", "attack"]  (→↓J)
             or ["moveLeft", "moveDown", "attack"] (←↓J) — both map to same combo
  windowMs: 400
  cooldownMs: 2400   (~4 orbital periods)
  powerCost: 20
  typeRestriction: "attack"
  partRequirement: aggressiveTip  (rubber_flat or soft_flat tip type)

  effects on hit:
    dashImpulse: STREAK_RUSH_DASH  (1200 engine-units — real gimmick velocity)
    knockbackImpulse: STREAK_RUSH_KNOCKBACK  (3200 engine-units — bounded)
    damageMultiplier: 1.40×
    lockMs: 100  (brief — dash is fast)
    spinDelta: +15

  aim mechanic:
    streakAngle computed from (→↓) or (←↓) input direction at activation moment
    precession correction applied automatically from current spin %
    if miss (no contact): no effects, cooldown still consumed

  ceiling compliance:
    damageMultiplier 1.40× ≤ 1.5×    ✓
    lockMs 100ms ≤ 300ms              ✓
    no invulnerability                ✓
    no mirage zones                   ✓ (anime-only — removed)
    no AoE                            ✓
```

### Streak Rush vs Abyss Fire

```
                    Streak Rush (Combo)         Abyss Fire (Special Move)
───────────────────────────────────────────────────────────────────────────
Input               3-key: →↓J or ←↓J          One button
Aim                 Manual (player must aim)     Auto (calculated toward target)
Travel speed        Real gimmick ~0.75–1.18 m/s  Anime-impossible (150ms cross-stadium)
Travel invulnerable No                           Yes (150ms)
Mirages             None                         3 persistent zones × 400ms
knockbackImpulse    3200 engine-units            14000 engine-units
damageMultiplier    1.40×                        1.80×
Miss penalty        No damage, cooldown wasted   N/A (auto-aimed)
Ring-out threat     Near wall only               Anywhere in arena
Power cost          20                           100
QTE counterable     Yes (opponent dodge window)  Yes (tighter window)
```

```typescript
// Combo: Streak Rush
function applyStreakRush(bey: Beyblade, inputDir: "right-down" | "left-down",
                         target: Beyblade | null): void {
  // Compute streak angle from input direction
  const baseAngle = inputDir === "right-down" ? Math.PI / 4 : (3 * Math.PI) / 4;
  const spinFraction = bey.spin / bey.maxSpin;
  const precessionRad = 8 * spinFraction * Math.PI / 180;
  const streakAngle = baseAngle + precessionRad;

  // Dash impulse on self
  applyForce(bey.id,
    Math.cos(streakAngle) * STREAK_RUSH_DASH,        // 1200 engine-units
    Math.sin(streakAngle) * STREAK_RUSH_DASH);

  // Check hit (contact detection at streak angle)
  if (target && isInStreakPath(bey, target, streakAngle, STREAK_HIT_WIDTH_PX)) {
    applyForce(target.id,
      Math.cos(streakAngle) * STREAK_RUSH_KNOCKBACK, // 3200 engine-units
      Math.sin(streakAngle) * STREAK_RUSH_KNOCKBACK);
    target.damageReceived += BASE_DAMAGE * 1.40;
    bey.spin = Math.min(bey.maxSpin, bey.spin + 15);
  }
  // No effects if miss — cooldown consumed regardless
}
```

---

---

## Case 630 — [DESIGN PRINCIPLE] Force Behavior System: Every Special Move Applies a Behavioral Compulsion State to the Opponent

**Thesis:** Every special move in the roster, beyond its direct physics effects (impulse, spinDelta, damageMultiplier), applies a `forceState` to the opponent — a behavioral compulsion that makes one class of opponent action either strategically necessary, strategically suicidal, or physically restricted, such that the special move's advantage compounds over time if the opponent responds incorrectly; the system has five canonical force states derived from the franchise: `must_attack` (defensive endurance moves — the opponent is disadvantaged by NOT attacking because a passive spin-drain aura or endurance mechanic punishes passivity, but attacking the defender triggers reflect or absorption, creating a Hobson's choice that the defender is designed to win), `must_stay_still` (offensive rush and streak moves — the opponent is slowed, immobilized, or their dodge paths are blocked by mirage zones, minimizing evasion), `cannot_attack_freely` (counter/parry moves — the opponent faces punishment for aggression, so each attack attempt carries risk proportional to the defender's charge level), `must_keep_distance` (orbital drain moves — approaching the special-move user is punished by spin-steal or contact damage, so the opponent is forced to orbit at a safe distance while slowly losing spin), and `must_leave_zone` (AoE/shockwave moves — remaining inside the blast radius deals continuous damage, so the opponent must reposition even if this exposes them to follow-up attack); in all cases the force state is not absolute in a human-vs-human context — a skilled player can deviate from the compelled behavior at a cost — but the move is designed so that the correct counter-play to the force state requires the opponent to sacrifice something (spin, position, power, or time) and the special move user profits from that sacrifice; for AI opponents the force state is applied literally as an aggression or positioning override on the AI controller for the duration of the active window; the force state duration always equals or exceeds the special move's active durationMs, ensuring the compulsion persists for the full period the move can exploit it.

### Force State Reference Table

```
ForceState            Defensive or    Compelled         Correct               Incorrect
                      Offensive?      Opponent Behavior Counter-Play          Response
──────────────────────────────────────────────────────────────────────────────────────────
must_attack           Defensive       Attack the        Time QTE correctly    Don't attack:
                                      defender          on the reflect        passive spin drain
                                                        window
must_stay_still       Offensive       Cannot move       Successful QTE dodge  Move through
                                      freely            (sacrifices position) mirage zones
cannot_attack_freely  Counter         Hesitate /        Don't attack at all;  Attack blindly:
                                      attack with care  orbit and wait        get countered
must_keep_distance    Orbital-steal   Stay away from    High-aggression       Orbit close:
                                      the special-move  burst to end the      constant spin
                                      user              move fast             drain
must_leave_zone       AoE             Exit blast radius Exit before peak      Stay inside:
                                      immediately       damage ticks          full damage
──────────────────────────────────────────────────────────────────────────────────────────
```

### Force State × Move Roster Cross-Reference

```
Move                              ForceState            Duration
──────────────────────────────────────────────────────────────────
100 Hit Fearsome Splendor         cannot_attack_freely  1500ms wait window
Adamantine Hands                  must_attack           2000ms
Nothing Break                     must_attack           up to 2000ms absorb window
Absorb Break                      cannot_attack_freely  short (single hit trigger)
Stampede Rush                     must_stay_still       200ms (hit stagger)
Abyss Fire                        must_stay_still       150ms travel + 400ms mirage
Gyro Anchor (CS11 Case 588)       must_keep_distance    1500ms
Spin Recovery (CS11 Case 589)     must_keep_distance    orbital duration
Shock Pulse (CS11 Case 591)       must_leave_zone       blast radius duration
──────────────────────────────────────────────────────────────────
```

### Engine Implementation

```typescript
// Force state applied to opponent on special move activation
type ForceState =
  | "must_attack"         // Defensive: passive aura punishes passivity
  | "must_stay_still"     // Offensive: reduced movement / mirage zone threat
  | "cannot_attack_freely"// Counter: attack risk raised, hesitation rewarded
  | "must_keep_distance"  // Orbital: approaching is dangerous
  | "must_leave_zone"     // AoE: zone presence penalized
  | null;                 // No behavioral compulsion

interface ForceStateConfig {
  state: ForceState;
  durationMs: number;
  // For must_attack: passive drain on opponent if they don't close distance
  passiveDrainPerSecond?: number;   // spin units/s drained if opponent stays still
  auraRadiusPx?: number;            // radius within which drain applies
  // For must_stay_still: movement speed multiplier applied to opponent
  movementMultiplier?: number;      // 0 = immobile, 0.5 = half speed, 1 = normal
  // For cannot_attack_freely: damage/impulse returned on opponent attack
  counterMultiplier?: number;       // multiplier on reflected impulse
  // For must_keep_distance: damage rate inside proximity radius
  proximityDamagePerTick?: number;
  proximityRadiusPx?: number;
  // For must_leave_zone: AoE zone reference
  zoneId?: string;
}

function applyForceState(opponent: Beyblade, config: ForceStateConfig): void {
  opponent.forceState = config.state;
  opponent.forceStateExpiresAt = Date.now() + config.durationMs;
  opponent.forceStateConfig = config;
  // AI override: set aggression to match force state
  if (opponent.isAI) overrideAIBehavior(opponent, config.state);
}
```

---

## Case 631 — [SPECIAL MOVE] Adamantine Hands: Chao Xin / Poison Virgo ED145ES (Metal Masters)

**Franchise Move:** Virgo blocks an opponent's attack and forces them to sleep out; Chao Xin's second special defensive move used to cancel Striker's Lightning Sword Flash and defeat Masamune in their first battle; an endurance move — the defender withstands all attacks until the opponent's spin exhausts itself.

**Thesis:** Adamantine Hands is the defensive endurance special move built on the same ED145ES free-spin ring parry gimmick as 100 Hit Fearsome Splendor (Case 619, Case 620), but where 100 Hit Fearsome Splendor releases parryCharge as an aggressive 100-hit counter burst, Adamantine Hands converts parryCharge into a sustained endurance shell that applies the `must_attack` force state (Case 630) to the opponent — making Virgo's own defensive passivity into a weapon; physically the gimmick is identical (ED145 ring absorbs 5% of each incoming impulse, ES tip resists tilt), but the anime transcendence is entirely different in character: instead of a counter-attack, the move makes Virgo functionally indestructible for 2000ms while simultaneously projecting a spin-drain aura of radius 280px that removes opponent spin at a rate of 35 rad/s per second while they remain outside the contact zone; this creates the Hobson's choice that is the defining trait of the `must_attack` force state — if the opponent stays at distance they lose 35 rad/s per second (at opponent ω₀ = 600 rad/s, the aura drains them to zero in ~17.1s, but the match clock and battle state make even 2000ms of aura drain significant), and if they attack Virgo to stop the drain their impact is absorbed by the endurance shell (incoming damageReduction = 0.95 during the active window) and their parryCharge feeds back into the shell, extending its strength; in the anime Chao Xin spreads his arms like a wall and Virgo becomes a fortress — the game translates this as zero translational movement during the active window (Virgo is anchored in place), maximum spin restoration, and the passive aura that makes the opponent's passivity as costly as their aggression.

### Phase Structure

```
Adamantine Hands — phase sequence:

Phase 1 — "adamantine_hold" (endurance shell, active window):
  windUpMs: 150  (Virgo spirit extends arms — visual wind-up)
  durationMs: 2000ms  (endurance window)
  windDownMs: 200ms

  Effects on SELF during hold:
    movementLock: true          (Virgo does not move — anchored)
    incomingDamageReduction: 0.95   (95% of all damage absorbed)
    spinRestoreRate: +40 rad/s per second  (spinning up from absorbed energy)
    parryChargeBuilding: true   (ED145 ring gimmick still active, Case 619)
    invulnerabilityMs: 0        (NOT immune — takes 5% of hits; endurance not invincibility)

  forceState applied to OPPONENT:
    state: "must_attack"
    durationMs: 2000ms
    passiveDrainPerSecond: 35 rad/s  (spin drain if opponent stays still)
    auraRadiusPx: 280               (drain applies inside this radius)
    passiveDrainNote: opponent OUTSIDE aura radius is safe; must commit to approach
                      once inside, must attack or drain continues each tick

  Shell break condition:
    if opponent lands 12+ hits during the window → shell shatters (early exit)
    shell shatter: damageReduction drops to 0.20 for remaining durationMs
    → rewards sustained overwhelming aggression; prevents stalling against infinite defense
```

### Hobson's Choice Diagram

```
Opponent decision tree during Adamantine Hands:

  OPPONENT OPTIONS:
  ┌─────────────────────────────────────────────────────┐
  │                                                     │
  │  Stay outside aura (> 280px):                      │
  │    → No contact damage                              │
  │    → Spin drains at −35 rad/s per second            │
  │    → After 2000ms: −70 rad/s total (11.7% spin)    │
  │    → OUTCOME: slow loss, Virgo ends at peak spin    │
  │                                                     │
  │  Approach but don't attack (inside aura):           │
  │    → Aura drain still applies at full rate          │
  │    → No reward for proximity without attacking      │
  │    → OUTCOME: same as staying outside               │
  │                                                     │
  │  Attack Virgo:                                      │
  │    → 95% of own hit absorbed (almost no damage)    │
  │    → Attack wastes opponent's own spin energy       │
  │    → parryCharge builds up (Virgo getting stronger) │
  │    → Can break shell if 12+ hits land               │
  │    → OUTCOME: risky — correct play is timed burst   │
  │              of exactly 12 hits then disengage      │
  │                                                     │
  │  Optimal play: accept the 70 rad/s aura drain loss  │
  │  and wait — shell ends, then attack normally.       │
  │  BUT if Virgo is already low-spin, 70 rad/s loss    │
  │  may be decisive.                                   │
  └─────────────────────────────────────────────────────┘
```

### Comparison: Adamantine Hands vs 100 Hit Fearsome Splendor

```
Both moves: Chao Xin / Poison Virgo ED145ES — same bey, same gimmick base (Case 619)

                    Adamantine Hands          100 Hit Fearsome Splendor
─────────────────────────────────────────────────────────────────────────
Expression          Endurance / fortress      Counter burst / punish
ForceState          must_attack               cannot_attack_freely
Trigger             One button (proactive)    One button (reactive — waits for hit)
Active window       2000ms hold               up to 1500ms wait + 500ms burst
Damage reduction    95% sustained             Full invulnerability during wait only
Counter output      None (endurance only)     100 hits at 2.5× damage
Spin effect on self +40 rad/s per second      +80 rad/s (ring release)
Opponent pressure   Aura drain (passive)      Hit-triggered burst (reactive)
Shell break risk    Yes (12 hits breaks it)   No (wait window unbreakable)
Best used when      Virgo has high spin;       Virgo is being rushed;
                    opponent is low-spin       opponent is high-aggression
Gimmick reuse       Case 619 (ED145 absorb)   Case 619 (ED145 absorb)
```

```typescript
// Special move: Adamantine Hands
function activateAdamantineHands(bey: Beyblade, allOpponents: Beyblade[]): void {
  bey.movementLocked = true;
  bey.adamantineActive = true;
  bey.adamantineExpiresAt = Date.now() + 2000;
  bey.adamantineHitsReceived = 0;
  bey.incomingDamageMultiplier = 0.05;  // 95% reduction

  // Apply must_attack force state to all opponents in range
  for (const opp of allOpponents) {
    applyForceState(opp, {
      state: "must_attack",
      durationMs: 2000,
      passiveDrainPerSecond: 35,
      auraRadiusPx: 280,
    });
  }
}

// Called each tick during active window
function tickAdamantineHands(bey: Beyblade, allOpponents: Beyblade[], dt: number): void {
  if (!bey.adamantineActive) return;

  // Restore Virgo spin from absorbed energy
  bey.spin = Math.min(bey.maxSpin, bey.spin + 40 * (dt / 1000));

  // Apply passive aura drain to opponents inside radius
  for (const opp of allOpponents) {
    const dist = distanceBetween(bey, opp);
    if (dist <= ADAMANTINE_AURA_RADIUS) {
      opp.spin = Math.max(0, opp.spin - 35 * (dt / 1000));
    }
  }

  // Check shell break: 12+ hits received
  if (bey.adamantineHitsReceived >= ADAMANTINE_SHELL_BREAK_HITS) {
    bey.incomingDamageMultiplier = 0.80;  // shell broken — takes 80% now
    bey.adamantineActive = false;
  }

  // Expiry
  if (Date.now() >= bey.adamantineExpiresAt) {
    bey.movementLocked = false;
    bey.adamantineActive = false;
    bey.incomingDamageMultiplier = 1.0;
  }
}
```

---

---

## Case 632 — [GIMMICK] D125 Downforce Stabilization and CS Coat-Sharp Concentrated Contact Pressure: Aerodynamic Press and Single-Point Pierce Foundation

**Thesis:** Ray Striker D125CS carries two passive physical gimmicks that together produce a piercing contact quality absent in any other part combination in the current roster; the first is the D125 Down Force spin track, whose downward-angled fins generate an aerodynamic downforce component when rotating at high speed — at ω₀ = 600 rad/s with fin tip radius r_fin = 15mm the fin tip velocity is v_fin = ω₀ × r_fin = 600 × 0.015 = 9.0 m/s, and the aerodynamic lift force from the two fins (total fin area A ≈ 6.0×10⁻⁵ m², lift coefficient C_L ≈ 0.7 for low-angle plates) is F_down = ½ × ρ_air × A × C_L × v² = ½ × 1.225 × 6.0×10⁻⁵ × 0.7 × 81 = 2.08×10⁻³ N [INFERRED] — a modest 0.53% increase in effective weight that is physically real but small, meaning the anime significance of the D125 downforce effect is substantially larger than the real aerodynamic contribution; the second and more consequential gimmick is the CS Coat Sharp tip, whose rubber-coated sharp point concentrates the beyblade's entire weight over an approximate contact area of A_tip ≈ 1–2 mm² [ESTIMATED], yielding a contact pressure of P = N / A = (m × g + F_down) / A_tip = (0.040 × 9.81 + 0.00208) / 1.5×10⁻⁶ = 0.394 / 1.5×10⁻⁶ = 262,667 Pa ≈ 263 kPa [INFERRED]; this extremely high contact pressure means the tip does not deflect laterally under impact — it digs into the arena surface rather than sliding away from a hit, and the rubber coat provides frictional grip that prevents the sharp tip from pivoting around its contact point when struck tangentially; the combined effect of downforce (additional stabilizing normal force) and coat-sharp geometry (non-deflecting high-pressure grip point) is a beyblade that, when it commits to a contact event, does not bounce away — it stays in contact and pushes through; this is the physical foundation of the `can_pierce_defense` property: moves using this gimmick penetrate rather than deflect, and their impulse delivery is more complete than a same-energy attack from a beyblade with a low-pressure contact point.

### D125 Aerodynamic and CS Pressure Analysis

```
D125 downforce at various spin states:

  ω₀ = 600 rad/s (launch):  F_down = 2.08 mN   (+0.53% effective weight)  [INFERRED]
  ω  = 400 rad/s (mid):     F_down = 2.08 × (400/600)² = 0.93 mN          [INFERRED]
  ω  = 200 rad/s (low):     F_down = 2.08 × (200/600)² = 0.23 mN          [INFERRED]

  Interpretation: D125 downforce is spin-speed dependent — maximum pierce at high spin,
  decreasing as spin decays. Lightning Sword Flash (Case 633) fires early in the match
  (high spin) specifically to exploit this window.

CS tip contact pressure analysis:
  Normal force at launch: N = m×g + F_down = 0.3924 + 0.00208 = 0.3945 N
  Contact area (sharp point with rubber coat): A_tip ≈ 1.5 mm² = 1.5×10⁻⁶ m²
  Contact pressure: P = 0.3945 / 1.5×10⁻⁶ = 263 kPa  [INFERRED]

  Comparison with other tip types:
    Wide Ball tip (r_tip = 8mm, A_contact ≈ 50 mm²):  P = 0.392/50×10⁻⁶ = 7.8 kPa
    CS coat sharp:                                      P = 263 kPa  (34× higher)  [INFERRED]

  Practical consequence:
    Wide Ball hit: low pressure → tip slides laterally on impact → low deflection resistance
    CS coat sharp: high pressure → tip digs in → does NOT deflect → pushes through contact
```

### Passive Game Mechanic

```
D125CS gimmick properties (permanent modifiers on this part loadout):

  downforceStabilization:
    bonus_normal_force = 0.0053 × m × g × (spin / maxSpin)²   // spin-dependent
    effect: added to contact impulse calculation for pierce check

  coatSharpPierce:
    deflectionResistance: 0.85  // 15% less lateral deflection than standard tip
    contactPressureMultiplier: 34×  // vs Wide Ball baseline
    canPierceDefense: true  // unlocks pierce check on special moves

  pierce_check (used in Case 633):
    pierceThreshold = defenseForceStateStrength × opponent_damageReduction
    if (attackImpulse × canPierceDefense > pierceThreshold):
      bypass opponent's damageReduction by pierceRatio
      pierceRatio = attackImpulse / (attackImpulse + pierceThreshold)
```

```typescript
// Gimmick: D125 downforce + CS pierce property
function applyD125CSGimmick(bey: Beyblade, contactImpulse: number): number {
  const spinFraction = bey.spin / bey.maxSpin;
  const downforceBonus = D125_DOWNFORCE_BASE * spinFraction * spinFraction;
  // Increases effective impulse at high spin — pierce quality scales with spin
  return contactImpulse * (1 + downforceBonus * D125_IMPULSE_SCALE);
}

function canPierceDefense(bey: Beyblade): boolean {
  return bey.tipType === "coat_sharp" && bey.trackType === "D125";
}
```

---

## Case 633 — [SPECIAL MOVE] Lightning Sword Flash: Masamune Kadoya / Ray Striker D125CS (Metal Masters)

**Franchise Move:** Striker focuses all its energy at one point as lightning and strikes the enemy; single-point concentrated attack that breaks through almost anything; sword sometimes falls apart when overpowered; first used to defeat Yu Tendo's Inferno Blast; upgraded to break through Chao Xin's Adamantine Hands.

**Thesis:** Lightning Sword Flash is the highest-risk, highest-reward special move in the roster — it has three possible outcomes determined entirely by the player's execution of a power-meter QTE during activation, not by the opponent's counter-play; the physical foundation is the D125CS pierce gimmick (Case 632): concentrating all spin energy into a single-point contact that does not deflect, pushing through rather than bouncing off; the anime transcendence is that Striker's lightning (the Unicorn spirit) amplifies this single-point force to a level that pierces through `forceState: "must_attack"` defensive shells (like Adamantine Hands, Case 631), bypassing their damage reduction entirely on a perfect execution; the QTE is a hold-and-release power meter: the player holds the special button and a bar fills at a fixed rate; releasing in the green zone (70–90% of the bar) delivers perfect execution; releasing below the zone delivers partial power; releasing above the zone (overcharge) causes the sword to break — Striker takes self-recoil, loses spin, and enters a debuffed state for 1200ms; this three-outcome structure makes Lightning Sword Flash the move with the most decision-making weight in the match — using it correctly against a defensive opponent who has `must_attack` active breaks their shell and deals devastating damage, but missing the QTE punishes Masamune as severely as any opponent attack would; the move applies the `must_stay_still` force state to the opponent because the lightning strike is so fast and targeted that there is no positional escape — only the opponent's own QTE (a timing-tap to deflect a portion of the pierce force) can partially mitigate it.

### QTE Power Meter System

```
Lightning Sword Flash — power meter QTE:

  Activation: player presses special button
  A meter bar appears on screen:

  [0%─────────────────────────────────────────────────100%]
   │    EARLY RELEASE    │  PERFECT ZONE  │  OVERCHARGE │
   │    < 30%: fizzle    │   70%–90%:     │  > 90%:     │
   │    no effect        │   full power   │  sword break │
   │    power refunded   │                │              │

  Fill rate: bar fills in 1200ms (0% → 100% over 1.2 seconds)
  Sweet spot: 70–90% = 840ms–1080ms hold duration
  Perfect timing window: 240ms window at mid-fight reflexes

  OUTCOME TABLE:
  ┌──────────────────┬──────────────────────────────────────────────────────┐
  │ Release zone     │ Effect                                               │
  ├──────────────────┼──────────────────────────────────────────────────────┤
  │ < 30% (early)    │ Fizzle: no strike, no damage, power fully refunded   │
  ├──────────────────┼──────────────────────────────────────────────────────┤
  │ 30–69% (partial) │ Reduced strike: 60% impulse, 1.5× damage,           │
  │                  │ no pierce. Can be defended normally.                 │
  ├──────────────────┼──────────────────────────────────────────────────────┤
  │ 70–90% (perfect) │ Full strike: max impulse, 3.2× damage,               │
  │                  │ PIERCES any defensive forceState.                    │
  │                  │ Bypasses Adamantine Hands / Gyro Anchor shell.       │
  ├──────────────────┼──────────────────────────────────────────────────────┤
  │ > 90% (overchge) │ Sword breaks: strike fizzles, SELF takes recoil,    │
  │                  │ Striker loses 150 spin, debuffed 1200ms (−20% stats)│
  └──────────────────┴──────────────────────────────────────────────────────┘
```

### Phase Structure (Perfect Execution Path)

```
Lightning Sword Flash — perfect execution phases:

Phase 1 — "lsf_charge" (player holds button, meter fills):
  windUpMs: 0–1200ms  (player-controlled duration)
  effects: Striker glows brighter as meter fills; lightning crackles at blade
  movementLock: true during charge (must commit position before firing)
  invulnerabilityMs: 0 during charge  (vulnerable while charging — risk)

Phase 2 — "lsf_strike" (released at 70–90%):
  windUpMs: 0
  durationMs: 80ms  (instant — lightning is instantaneous)
  windDownMs: 150ms
  effects:
    linearImpulse: 8500 engine-units  (straight line toward opponent)
    knockbackImpulse: 12000 engine-units
    damageMultiplier: 3.2×  (highest damage in roster — single perfect hit)
    spinDelta: −80 (Striker spends spin to power the strike — costs the user)
    pierceDefense: true  (bypasses damageReduction, breaks forceState shells)
    pierceDamageReductionOverride: 0  (even 95% reduction = 0% on perfect pierce)
  forceState on opponent: must_stay_still, durationMs: 300ms
  QTEForOpponent: "timing_tap" (opponent taps at the right ms to deflect 40% of pierce)
  QTEWindowMs: 60ms  (very tight — lightning is fast)

Phase 3 — FAILURE STATE (released > 90% overcharge):
  effects on SELF:
    selfRecoilImpulse: 4000 engine-units (random direction — sword explosion)
    spinPenalty: −150 rad/s
    debuffActive: true
    debuffDurationMs: 1200ms
    debuffEffect: damageMultiplier × 0.80, receivedDamage × 1.20
    visual: sword shatters into sparks, lightning backlash on Striker
```

### Pierce Logic Against Defensive Moves

```
Lightning Sword Flash pierce vs. Adamantine Hands (Case 631):

  Adamantine Hands state:
    incomingDamageReduction = 0.95
    forceState = must_attack
    shellBreakThreshold = 12 hits

  Normal attack vs Adamantine:
    damage_received = baseDamage × 0.05 (5% gets through)
    → 20 hits needed to deal meaningful damage

  Lightning Sword Flash perfect vs Adamantine:
    pierceDefense = true
    pierceDamageReductionOverride = 0
    damage_received = baseDamage × 3.2× × 1.0 (full 3.2× gets through)
    → Single hit deals more than 64× a normal attack through the shell
    → Instantly breaks the shell (forces adamantineHitsReceived = 12)

  This is the canon resolution: Masamune trained specifically to land
  Lightning Sword Flash perfect against Chao Xin's Adamantine Hands.
  In game: a perfect Lightning Sword Flash always breaks a defensive shell.

  Lightning Sword Flash partial vs Adamantine:
    pierceDefense = false (partial execution lacks pierce quality)
    damage_received = baseDamage × 1.5× × 0.05 = 7.5% normal damage
    → Cannot break the shell — only perfect execution pierces
```

```typescript
// Special move: Lightning Sword Flash
function activateLightningFlash_Strike(
  bey: Beyblade,
  target: Beyblade,
  qteZone: "fizzle" | "partial" | "perfect" | "overcharge"
): void {
  if (qteZone === "fizzle") {
    bey.power = Math.min(bey.maxPower, bey.power + LIGHTNING_POWER_COST); // refund
    return;
  }

  if (qteZone === "overcharge") {
    // Sword breaks — self punishment
    const recoilAngle = Math.random() * Math.PI * 2;
    applyForce(bey.id,
      Math.cos(recoilAngle) * LIGHTNING_SELF_RECOIL,
      Math.sin(recoilAngle) * LIGHTNING_SELF_RECOIL);
    bey.spin = Math.max(0, bey.spin - 150);
    bey.debuffActive = true;
    bey.debuffExpiresAt = Date.now() + 1200;
    return;
  }

  const isPerfect = qteZone === "perfect";
  const impulse     = isPerfect ? LIGHTNING_PERFECT_IMPULSE    : LIGHTNING_PARTIAL_IMPULSE;
  const knockback   = isPerfect ? LIGHTNING_PERFECT_KNOCKBACK  : LIGHTNING_PARTIAL_KNOCKBACK;
  const dmgMult     = isPerfect ? 3.2 : 1.5;

  // Self spin cost (using energy to power the strike)
  bey.spin = Math.max(0, bey.spin - 80);

  const angle = Math.atan2(target.y - bey.y, target.x - bey.x);
  applyForce(bey.id, Math.cos(angle) * impulse, Math.sin(angle) * impulse);

  // Pierce check — only on perfect
  if (isPerfect && canPierceDefense(bey)) {
    target.incomingDamageMultiplier = 1.0;   // override any reduction
    target.forceStateOverride = null;         // shell shattered
    target.adamantineActive = false;
    target.adamantineHitsReceived = 12;       // force shell break
  }

  applyForce(target.id,
    Math.cos(angle) * knockback,
    Math.sin(angle) * knockback);
  target.damageReceived += BASE_DAMAGE * dmgMult;

  applyForceState(target, {
    state: "must_stay_still",
    durationMs: 300,
    movementMultiplier: 0.2,
  });
}
```

---

## Case 634 — [COMBO] Sword Point: Player-Skill Expression of the Concentrated Pierce Contact

**Thesis:** Sword Point is the combo-level expression of the D125CS pierce gimmick (Case 632); it retains the core concept of Lightning Sword Flash — concentrated single-point contact, committed position before firing — but removes the QTE power meter, the self-recoil failure state, the pierce-defense property, and the damage multiplier ceiling breach, making it a physics-bounded skill move available to attack-type beyblades with high-pressure tip types; the 3-key sequence is Attack → Attack → Attack (JJJ, the same as Power Thrust from CS12 Case 608) but Sword Point is mechanically distinct: where Power Thrust is a 3-hit compound sequence building cumulative force, Sword Point uses the first two J inputs as momentum-charge frames and delivers ALL force in a single concentrated hit on the third J, representing the player committing to one decisive contact rather than landing multiple; the single-contact design means the combo either lands cleanly for its full effect or misses entirely — there is no partial hit, and a miss wastes the cooldown the same way a failed Lightning Sword Flash wastes power; the physics basis (Case 632) gives Sword Point a small but real pierce bonus compared to other attack combos: the `deflectionResistance: 0.85` modifier from the CS tip means 15% less lateral bounce when contact is made, so Sword Point deals slightly more of its impulse to the target than an equivalent force combo from a standard flat tip.

### Combo Specification

```
Sword Point — combo definition:

  id: "sword-point"
  sequence: ["attack", "attack", "attack"]  (JJJ)
  windowMs: 420
  cooldownMs: 2000
  powerCost: 25
  typeRestriction: "attack"
  partRequirement: highPressureTip  (coat_sharp, sharp, or any point-contact tip)

  effects on hit (single contact, all-or-nothing):
    contactImpulse: SWORD_POINT_IMPULSE   (1600 engine-units)
    knockbackImpulse: SWORD_POINT_KB      (2400 engine-units)
    damageMultiplier: 1.45×               (below 1.5 ceiling — concentrated single hit)
    lockMs: 80                            (brief — single clean contact)
    deflectionResistance: 0.85            (from CS gimmick — 15% less bounce-off)
    spinDelta: −20                        (costs a little spin to concentrate force)
    noPartialHit: true                    (full effect or nothing — no graze)

  on miss: no damage, no effects, cooldown consumed  (same penalty structure as Lightning Sword Flash failure)

  NO pierce property  (that belongs to the special move only)
  NO QTE power meter  (skill is in the 3-key timing, not a meter)
  NO self-recoil failure state  (combo ceiling prevents this risk level)

  ceiling compliance:
    damageMultiplier 1.45× ≤ 1.5×   ✓
    lockMs 80ms ≤ 300ms              ✓
    no invulnerability               ✓
    no AoE                           ✓
    no pierce-defense                ✓
```

### Sword Point vs Lightning Sword Flash vs Power Thrust

```
                 Sword Point       Lightning Sword Flash   Power Thrust
                 (Combo)           (Special, perfect)      (Combo, CS12)
──────────────────────────────────────────────────────────────────────────
Hits             1 (all or none)   1 (auto-aimed)          3 (compound)
damageMultiplier 1.45×             3.2×                    1.5×
Knock back       2400 units        12000 units             stacked
Pierce defense   No                Yes (perfect only)      No
Power cost       25                100                     25
Failure state    Miss = no effect  Overcharge = self-recoil  N/A
QTE              None              Power meter             None
Spin cost        −20               −80                     None
Best use         One decisive hit  Break defensive shell   Sustained pressure
```

```typescript
// Combo: Sword Point
function applySwordPoint(bey: Beyblade, target: Beyblade | null): void {
  if (!target || !isInContactRange(bey, target)) {
    // Miss — all-or-nothing design: no partial hit
    return;
  }

  const baseImpulse = SWORD_POINT_IMPULSE;
  // Apply deflection resistance: 15% more impulse delivered vs standard
  const deliveredImpulse = baseImpulse * (1 / 0.85);  // compensate for less bounce-off

  const angle = Math.atan2(target.y - bey.y, target.x - bey.x);
  applyForce(bey.id,   Math.cos(angle) * SWORD_POINT_IMPULSE, Math.sin(angle) * SWORD_POINT_IMPULSE);
  applyForce(target.id, Math.cos(angle) * SWORD_POINT_KB,      Math.sin(angle) * SWORD_POINT_KB);
  target.damageReceived += BASE_DAMAGE * 1.45;

  // Spin cost — concentrating energy uses spin
  bey.spin = Math.max(0, bey.spin - 20);
}
```

---

---

## Case 635 — [GIMMICK] Expand Frame Aerodynamic Outflow: Wide-Profile Spinning Disc as a Radial Air-Displacement Engine

**Thesis:** The Expand frame is a wide-diameter polycarbonate ring that sits between the energy layer and the performance disc, increasing the outer radius of the spinning assembly to approximately r_expand ≈ 25 mm compared to the r_standard ≈ 20 mm of a standard-width frame; the aerodynamic consequence of this radius increase is that the outermost air boundary layer co-rotating with the disc has a tangential velocity v_rim = ω × r_expand, and at Burst-series launch speeds (ω₀ = 2000 rad/s) this gives v_rim = 2000 × 0.025 = 50.0 m/s at the outer rim versus 40.0 m/s for a standard frame [INFERRED]; the centrifugal force on air particles at the rim causes them to be flung radially outward, creating a low-pressure zone above and a high-pressure radial outflow at the equatorial plane — essentially the same principle as a centrifugal pump, but operating on air rather than fluid; the radial outflow pressure force on an object at distance d from the beyblade center can be approximated as F_wind = ½ × ρ_air × (v_rim × r_expand / d)² × A_target, where A_target is the projected cross-section of the opposing beyblade (approximately A_target ≈ π × r_target² = π × (0.025)² = 1.96×10⁻³ m²); at d = 100mm: F_wind = ½ × 1.225 × (50 × 0.025 / 0.10)² × 1.96×10⁻³ = ½ × 1.225 × (12.5)² × 1.96×10⁻³ = ½ × 1.225 × 156.25 × 1.96×10⁻³ = 0.188 N [INFERRED]; this outward force of 0.188 N at 100mm distance is physically real and comparable to the lateral friction force of a standard flat tip (F_lat = 0.157 N, Case 627), meaning the Expand frame wind effect at close range is genuinely capable of influencing a beyblade's trajectory — it is not negligible; at d = 200mm the force drops to F_wind = 0.047 N (inverse-square falloff), still measurable but weaker; the Air Knight layer contributes through its own smooth wide-body design that minimizes air resistance at the leading face while maximizing the effective rotating disc area, working in concert with the Expand frame to create the largest practical rotating disc profile in the Burst standard format.

### Radial Outflow Force Profile

```
Expand Frame wind force vs. distance from centre:

  Wind force F_wind = ½ × ρ_air × (v_rim × r_expand / d)² × A_target

  v_rim = 50.0 m/s (Burst launch, ω = 2000 rad/s)  [ESTIMATED]
  r_expand = 25mm, A_target = 1.96×10⁻³ m²

  d = 50mm:  F_wind = ½ × 1.225 × (50×0.025/0.05)² × 1.96×10⁻³ = 0.750 N   [INFERRED]
  d = 100mm: F_wind = 0.188 N   [INFERRED]
  d = 150mm: F_wind = 0.083 N   [INFERRED]
  d = 200mm: F_wind = 0.047 N   [INFERRED]
  d = 300mm: F_wind = 0.021 N   [INFERRED]

  At the arena boundary (d ≈ 330px ≈ 137mm in game scale):
    F_wind = 0.090 N  — equivalent to about 57% of a flat-tip lateral force
    Over 1000ms: impulse = 0.090 × 1.0 = 0.090 N·s = 2500 engine-units  [GAME-DERIVED]

  Key insight: the wind force is strongest at close range and drops with inverse square.
  An opponent trying to approach through the field fights increasing headwind.
  An opponent at the stadium rim still experiences a measurable outward push (21 mN at 300mm).
```

### Passive Game Mechanic

```
Expand frame wind is always active while beyblade is spinning:

  Each physics tick (16.67ms at 60Hz):
    For every opponent beyblade within WIND_FIELD_RADIUS (330px):
      dist = distanceTo(opponent)
      F_wind = WIND_BASE_FORCE × (r_expand / dist)²
      impulsePerTick = F_wind × TICK_DT_SECONDS / ENGINE_IMPULSE_UNIT
      radialAngle = angleBetween(bey, opponent)  // outward direction
      applyForce(opponent.id,
        Math.cos(radialAngle) * impulsePerTick,
        Math.sin(radialAngle) * impulsePerTick)

  Effect scales with bey spin:
    windScale = (bey.spin / bey.maxSpin)²   // v_rim ∝ ω → F ∝ ω² → F ∝ spin²
    Passive wind is strongest at launch, weakens as spin decays.
    At 50% spin: windScale = 0.25 (25% of launch-level force)
    At 20% spin: windScale = 0.04 (4% — negligible at very low spin)
```

```typescript
// Gimmick tick: Expand frame radial wind
function applyExpandFrameWind(bey: Beyblade, opponents: Beyblade[]): void {
  if (!bey.hasExpandFrame) return;
  const spinScale = Math.pow(bey.spin / bey.maxSpin, 2);
  for (const opp of opponents) {
    const dx = opp.x - bey.x;
    const dy = opp.y - bey.y;
    const dist = Math.hypot(dx, dy);
    if (dist > WIND_FIELD_RADIUS_PX || dist < 1) continue;
    const forceN = EXPAND_WIND_BASE_N * Math.pow(EXPAND_FRAME_R_PX / dist, 2) * spinScale;
    const impulse = forceN * TICK_DT_S / ENGINE_IMPULSE_UNIT;
    applyForce(opp.id, (dx / dist) * impulse, (dy / dist) * impulse);
  }
}
```

---

## Case 636 — [SPECIAL MOVE] Air Launch / Air Shoot: Kit Lopez / Air Knight 12Expand Eternal (Beyblade Burst Surge)

**Franchise Move:** Knight uses its Expand Frame along with its Layer to create a field of wind that pushes opponents away; a stamina-type zone-control special that maintains position at the stadium center while the wind field handles opponent displacement.

**Thesis:** Air Launch is the anime transcendence of the Expand Frame aerodynamic outflow gimmick (Case 635): the physical gimmick produces a genuine but modest 0.021–0.750 N radial outflow force scaling with spin and inverse-square with distance [INFERRED, Case 635], and the special move amplifies this into a sustained full-stadium wind field of impossible strength that applies the `must_keep_distance` force state (Case 630) to all opponents simultaneously while Air Knight maintains perfect centered stability on its Eternal tip; the move is fundamentally different from all previous special moves in the roster because it deals no direct damage — its power is entirely positional, using wind pressure to push opponents toward the stadium rim over 2500ms, and the ring-out threat comes not from any single impulse but from the accumulated displacement of sustained outward force combined with three periodic wind burst pulses (at t=500ms, t=1250ms, t=2000ms) that multiply the force 4× for 200ms each; the Eternal tip's bearing LAD (Case 619 family, bearing μ = 0.05) keeps Air Knight's own orbit tightly centered throughout the window so all outflow force is directed radially outward without self-displacement; the stamina nature of the move is reflected in its power economics: Air Launch costs only 70 power (versus 100 for most specials) because it trades immediate damage potential for positional dominance, and it restores 15 spin per second to Air Knight during the active window from the Eternal tip's sustained LAD behavior — the move makes Air Knight harder to stop by keeping it spinning efficiently while the opponent struggles against the wind field; this is a `must_keep_distance` force state special: the correct counter-play is to close distance during a non-burst window and land a hit before the next pulse, but the wind headwind and inverse-square force increase makes this progressively harder the closer the opponent gets.

### Phase Structure

```
Air Launch — phase sequence:

Phase 1 — "air_launch_field" (sustained wind + burst pulses):
  windUpMs: 200  (Air Knight drifts to near-center; wind field visual begins)
  durationMs: 2500ms
  windDownMs: 300ms

  Continuous effects (every tick):
    windForce: ANIME_WIND_SCALE × (r_expand / dist)²  per opponent  (12× physical)
    spinRestore: +15 rad/s per second on SELF (Eternal LAD during field)
    selfPositionBias: gentle pull toward stadium center (Eternal tip behavior)
    movementLock: false  (Air Knight CAN move but naturally stays centered)

  Burst pulse events (3× during window):
    t = 500ms:  burstMultiplier = 4×, duration = 200ms  (first big gust)
    t = 1250ms: burstMultiplier = 4×, duration = 200ms  (second gust)
    t = 2000ms: burstMultiplier = 4×, duration = 200ms  (final gust before windDown)
    each burst: visual = expanding concentric ring pulse outward from center

  forceState on ALL opponents:
    state: must_keep_distance
    durationMs: 2500ms
    proximityDamagePerTick: 0    (no damage — purely positional)
    proximityRadiusPx: 330       (full stadium coverage)
    windForceNote: damage IS dealt via sustained displacement + ring-out risk,
                  not direct damage ticks

  No damage multiplier — zero direct damage
  Ring-out is the only win condition from this move; sustained wind causes it.
```

### Burst Pulse Force Spikes

```
Wind force during normal sustained phase vs burst pulse:

  Normal phase (spinScale = 1.0 at full spin):
    d = 100px:  F_wind = 0.188 × 12 = 2.256 N (anime scale)  → large sustained push
    d = 200px:  F_wind = 0.047 × 12 = 0.564 N
    d = 330px:  F_wind = 0.021 × 12 = 0.252 N  (at stadium rim)

  Burst pulse (4× multiplier, 200ms):
    d = 100px:  F_burst = 9.024 N  → momentary ring-out threat from center
    d = 200px:  F_burst = 2.256 N  → strong push toward rim
    d = 330px:  F_burst = 1.008 N  → enough to cross rim if opponent is positioned wrong

  Optimal counter-play timing:
    Attack between burst pulses (t=200ms, t=700ms–1050ms, t=1450ms–1800ms)
    Approach window = ~350ms — must enter and strike during non-burst gap
    A miss during approach = gets caught by the burst pulse on the way out → ring-out risk
```

### Air Launch vs Gyro Anchor (Both: must_keep_distance)

```
                    Air Launch                Gyro Anchor (CS11 Case 588)
──────────────────────────────────────────────────────────────────────────
ForceState          must_keep_distance        must_keep_distance
Mechanism           Wind field (area-denial)  Spin-steal aura (contact penalty)
Range               Full stadium (330px)      spinStealRadiusPx = 250px
Direct damage       None                      Via spin steal over time
Ring-out threat     Yes (accumulated push)    No (doesn't displace)
Stamina cost        70 power                  100 power
Spin effect on self +15 rad/s per second      +250 (burst restore)
Duration            2500ms                    1500ms
Bey type            Stamina (Air Knight)      Defense (bearing-type)
Counter-play        Close during non-burst    Aggressive burst to end window
```

```typescript
// Special move: Air Launch
function activateAirLaunch(bey: Beyblade, allOpponents: Beyblade[]): void {
  bey.airLaunchActive = true;
  bey.airLaunchExpiresAt = Date.now() + 2500;

  applyForceState(allOpponents, {
    state: "must_keep_distance",
    durationMs: 2500,
    proximityDamagePerTick: 0,
    proximityRadiusPx: WIND_FIELD_RADIUS_PX,
  });

  // Schedule three burst pulses
  const PULSES = [500, 1250, 2000];
  for (const delay of PULSES) {
    scheduleEffect(delay, () => {
      bey.windBurstActive = true;
      bey.windBurstExpiresAt = Date.now() + 200;
      bey.windBurstMultiplier = 4.0;
    });
  }
}

function tickAirLaunch(bey: Beyblade, opponents: Beyblade[], dt: number): void {
  if (!bey.airLaunchActive) return;
  const burstMult = bey.windBurstActive ? bey.windBurstMultiplier : 1.0;
  const spinScale = Math.pow(bey.spin / bey.maxSpin, 2);

  for (const opp of opponents) {
    const dx = opp.x - bey.x;
    const dy = opp.y - bey.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1 || dist > WIND_FIELD_RADIUS_PX) continue;

    const forceN = AIR_LAUNCH_WIND_BASE * Math.pow(WIND_REFERENCE_PX / dist, 2)
                   * spinScale * burstMult * ANIME_WIND_SCALE;
    const impulse = forceN * (dt / 1000) / ENGINE_IMPULSE_UNIT;
    applyForce(opp.id, (dx / dist) * impulse, (dy / dist) * impulse);
  }

  // Eternal tip LAD: restore spin during field
  bey.spin = Math.min(bey.maxSpin, bey.spin + 15 * (dt / 1000));

  if (Date.now() >= bey.airLaunchExpiresAt) bey.airLaunchActive = false;
}
```

---

## Case 637 — [COMBO] Air Wall: Player-Skill Expression of the Expand Frame Radial Outflow

**Thesis:** Air Wall is the combo-level expression of the Expand Frame aerodynamic outflow gimmick (Case 635); whereas Air Launch (Case 636) generates a full-stadium sustained wind field with three burst pulses over 2500ms, Air Wall is a brief, targeted directional gust that the player aims with a two-directional input and triggers as a single short burst — not a sustained field, not multi-directional, and strictly within physics-plausible force levels; the 3-key sequence is Defense → moveLeft → Defense (K←K) representing the player bracing, redirecting their bey's spin-axis vector to concentrate the airflow in the desired push direction, then releasing; the result is a 300ms directional wind burst in the input direction that applies a single outward push impulse to any opponent within 200px of that direction vector; the physics bound comes directly from Case 635: at the physical ceiling (before anime scaling) the Expand frame generates 0.188 N at 100px range, which over 300ms gives J = 0.188 × 0.3 = 0.0564 N·s = 1567 engine-units — the combo is calibrated at 1400 engine-units to sit below this physical ceiling with the game's unit scale [INFERRED, GAME-DERIVED]; no continuous field, no burst multiplier, no ring-out guarantee — this is a positioning nudge that creates a few hundred milliseconds of space between the user and an approaching opponent, giving the stamina-type bey time to re-establish its orbit without the full resource cost of the special move.

### Combo Specification

```
Air Wall — combo definition:

  id: "air-wall"
  sequence: ["defense", "moveLeft", "defense"]  (K←K)
  windowMs: 450
  cooldownMs: 2200
  powerCost: 15
  typeRestriction: "stamina"
  partRequirement: hasExpandFrame  (Expand or equivalent wide-profile frame)

  effects:
    directionalWindBurst:
      direction: last directional input during sequence (← in K←K)
      radius: 200px arc (120° cone in the direction of input)
      pushImpulse: 1400 engine-units  (per opponent in cone)
      duration: 300ms (single burst, not sustained)
      spinScale: true  (force reduced at low spin, same as gimmick)

    selfEffect:
      spinDelta: −10  (directing airflow costs a small amount of spin energy)
      movementNudge: opposite direction from burst (Newton's third law — minor self-push)

  ceiling compliance:
    damageMultiplier: 1.0 (no damage bonus — purely positional)   ✓
    lockMs: 0             (no movement lock)                       ✓
    no invulnerability                                             ✓
    no AoE direct damage                                           ✓
    push impulse bounded at physical ceiling                       ✓
```

### Air Wall vs Air Launch

```
                    Air Wall (Combo)          Air Launch (Special Move)
──────────────────────────────────────────────────────────────────────
Duration            300ms burst               2500ms sustained + 3 pulses
Direction           Player-aimed (cone)       Radial (all directions)
Range               200px cone                330px full radius
Force               1400 engine-units once    Continuous + 4× burst pulses
Direct damage       None                      None
Ring-out guarantee  No — positioning only     Near-rim: yes on burst pulse
Power cost          15                        70
Spin cost on self   −10                       −(restored at +15/s)
Type required       Stamina                   Stamina
Counter             Simply move sideways      Close between burst windows
```

```typescript
// Combo: Air Wall
function applyAirWall(bey: Beyblade, inputDir: number, opponents: Beyblade[]): void {
  const spinScale = Math.pow(bey.spin / bey.maxSpin, 2);
  const CONE_HALF_ANGLE = Math.PI / 3;  // 60° each side = 120° total

  for (const opp of opponents) {
    const dx = opp.x - bey.x;
    const dy = opp.y - bey.y;
    const dist = Math.hypot(dx, dy);
    if (dist > AIR_WALL_RADIUS_PX) continue;

    const angleToOpp = Math.atan2(dy, dx);
    const angleDiff = Math.abs(normalizeAngle(angleToOpp - inputDir));
    if (angleDiff > CONE_HALF_ANGLE) continue;  // outside cone — not affected

    const impulse = AIR_WALL_IMPULSE * spinScale;  // 1400 × spinScale
    applyForce(opp.id, (dx / dist) * impulse, (dy / dist) * impulse);
  }

  // Minor self-push in opposite direction (Newton's 3rd)
  applyForce(bey.id,
    -Math.cos(inputDir) * AIR_WALL_SELF_NUDGE,
    -Math.sin(inputDir) * AIR_WALL_SELF_NUDGE);
  bey.spin = Math.max(0, bey.spin - 10);
}
```

---

---

## Case 638 — [GIMMICK] Needle Tip Impact Anchor: Extreme Contact Pressure as a Hard-Hit Ground-Lock Mechanism

**Thesis:** The Needle performance tip carries the smallest contact radius of any tip type in the Burst-era roster at r_needle ≈ 0.5mm [ESTIMATED], producing a contact area of A_needle = π × r² = π × (5×10⁻⁴)² = 7.85×10⁻⁷ m² ≈ 0.79 mm², and a corresponding contact pressure at rest of P_needle = m × g / A_needle = 0.040 × 9.81 / 7.85×10⁻⁷ = 499,745 Pa ≈ 0.500 MPa [INFERRED] — nearly 1.9× the contact pressure of the CS coat-sharp tip (263 kPa, Case 632) and 64× that of a Wide Ball tip; this extreme contact pressure creates a qualitatively different friction regime compared to other tip types: at P > ~0.4 MPa, the ABS-on-ABS contact enters a micro-interlocking zone where surface asperities on both the needle tip and the stadium floor temporarily interlock rather than simply sliding, producing a static friction coefficient μ_s_needle ≈ 0.35–0.50 that is significantly higher than the kinetic friction of a sliding hard ABS tip (μ_k = 0.17) [ESTIMATED]; the critical consequence is that when a large lateral impulse is applied to a Needle-tipped beyblade, rather than the tip sliding immediately and the bey translating laterally (as a flat or ball tip would), the needle first attempts to deform its seating point — it momentarily digs deeper into any surface texture, increasing the normal force and thus the static friction limit in a positive feedback loop: F_static_max = μ_s × (N_gravity + N_dig) where N_dig is the additional normal force from the tip's reactive deformation; only once the applied lateral force exceeds this dynamic friction ceiling does the needle break free and slide; for moderate hits (F_lateral < 0.5 N) the needle never breaks free — the bey barely moves; for hard hits (F_lateral > 0.8 N [ESTIMATED]) the needle eventually breaks free but only after a delay of ~5–15ms during which almost no lateral displacement occurs [INFERRED]; this delay window is precisely what the Unicrest horn uses in Case 639: the ~10ms of ground-lock time is the counter-strike window during which the attacker's contact face is still engaged and the horn can be brought to bear.

### Needle Tip Pressure and Lock Threshold

```
Needle tip contact mechanics:

  r_needle = 0.5mm → A = 0.79 mm² → P = 0.500 MPa  [INFERRED]

  Friction regime comparison:
    Wide Ball:  P = 7.8 kPa   → smooth sliding, μ_k = 0.17 always applies
    CS tip:     P = 263 kPa   → some interlocking, transition regime
    Needle:     P = 500 kPa   → full micro-interlocking, μ_s > μ_k significantly  [INFERRED]

  Hard-hit lock threshold:
    F_lock_max = μ_s_needle × (m×g + N_dig) ≈ 0.42 × (0.392 + 0.050) = 0.186 N
    Translates to: incoming hit J > 0.186 × t_contact = 0.186 × 0.002 = 3.72×10⁻⁴ N·s
    In engine units: 3.72×10⁻⁴ / 3.60×10⁻⁵ ≈ 10.3 engine-units  [GAME-DERIVED]

    In practice (CS11 typical smash J ≈ 60 engine-units): almost all attacks exceed lock threshold
    → The needle lock applies on every significant hit, not just "hard" attacks
    → The "hard attack" condition in Case 639 is an additional threshold above this:
      ALICORN_TRIGGER_THRESHOLD = 200 engine-units minimum (strong hit only)

  Lock duration during hard hit:
    δt_lock ≈ 5–15ms during which lateral displacement < 1mm  [INFERRED]
    This is the counter-strike window for the horn contact (Case 639)
```

### Passive Game Mechanic

```
Needle tip lock modifier (permanent on Needle-tip beyblades):

  On any incoming hit with impulse > NEEDLE_LOCK_MIN (10 engine-units):
    Normal knockback = incomingImpulse × (1 - NEEDLE_LOCK_REDUCTION)
    NEEDLE_LOCK_REDUCTION = 0.30  (30% of knockback absorbed by needle anchor)
    Lock window: 12ms during which bey.velocity is dampened to 10% of normal

  On hard hit (impulse > ALICORN_TRIGGER_THRESHOLD = 200 units):
    Full lock: bey.velocity = 0 for 12ms (complete ground-lock)
    chargeCounter += incomingImpulse × NEEDLE_CHARGE_RATE  (stores energy for horn)
    triggerAlicornFlag = true  (signals special move can fire)
```

```typescript
// Gimmick: needle tip impact anchor
function applyNeedleAnchor(bey: Beyblade, hit: HitEvent): HitResult {
  const reduced = hit.impulse * (1 - NEEDLE_LOCK_REDUCTION);
  if (hit.impulse > ALICORN_TRIGGER_THRESHOLD) {
    // Full lock — beyblade holds position
    bey.velocity = { x: 0, y: 0 };
    bey.lockExpiresAt = Date.now() + 12;
    bey.alicornCharge += hit.impulse * NEEDLE_CHARGE_RATE;
    bey.alicornTriggered = true;
  }
  return { effectiveImpulse: reduced };
}
```

---

## Case 639 — [SPECIAL MOVE] Alicorn Launch: Ukio Kibuki / Über Unicrest Down Needle (Beyblade Burst Surge)

**Franchise Move:** After getting hit with a hard attack, Unicrest uses its Needle Performance Tip to hold its ground, then counterattacks with the sharp horn on its Energy Layer; defensive beyblade, counter-type move.

**Thesis:** Alicorn Launch is the anime transcendence of the Needle tip impact anchor gimmick (Case 638) paired with the horn contact geometry unique to the Unicrest Energy Layer; physically the gimmick provides a 12ms ground-lock window on hard hits during which stored counter-charge accumulates [INFERRED, Case 638], and the special move uses that window to deliver a single high-power upward-angled counter-strike with the Unicorn horn protrusion at a contact angle of approximately φ_horn = 60° above horizontal — steeper than a standard upper-attack AR at 45° — producing an impulse vector that is 86.6% upward and 50% lateral (sin 60° and cos 60°) [INFERRED]; the anime transcendence is the activation threshold and the scale of the counter: physically the gimmick charges from every hard hit, but the special move fires when the player activates it after a hard hit and delivers a single devastating counter-strike that does not come from the beyblade chasing the opponent but from the opponent's own charge being redirected through the horn; the attacker who committed to a heavy hit in the hope of breaking through Unicrest's defense receives instead the full momentum of their own approach redirected as a unicorn-horn stab aimed upward — the horn's steep angle means the counter-strike's dominant component is vertical, which in the game's 2.5D physics expression is a high verticalImpulse that lifts the target temporarily into an airborne state and creates a brief landing-impact event; the `cannot_attack_freely` force state is applied because the hard-hit trigger requirement means the opponent cannot freely use heavy attacks against an Alicorn Launch-ready Unicrest — every hard attack risks triggering the devastating counter — so the optimal opponent strategy shifts to light chip attacks, which also cannot break through Unicrest's defense; the move is therefore a perfect defensive trap.

### Phase Structure

```
Alicorn Launch — phase sequence:

  Activation condition: alicornTriggered = true (hard hit landed while special is armed)
  Player arms the special by pressing the button BEFORE the hard hit arrives.
  Once armed, the next hard hit (impulse > 200 engine-units) auto-triggers phase 2.

Phase 1 — "alicorn_armed" (waiting for hard hit):
  windUpMs: 0 (immediate on button press)
  durationMs: up to 3000ms (window to receive trigger hit)
  effects:
    Needle gimmick enhanced: NEEDLE_LOCK_REDUCTION = 0.60 (60% knockback reduction — better anchor)
    ALICORN_TRIGGER_THRESHOLD = 200 engine-units (same)
    incomingDamageReduction: 0.50 (extra defense while armed)
    visual: Unicorn horn glows faint blue, building intensity with each absorbed hit
    forceState → opponent: cannot_attack_freely (heavy attacks risk triggering counter)
    forceStateDetail: if opponent lands hit > 200 units → they trigger Alicorn Launch counter

Phase 2 — "alicorn_counter" (fires automatically on trigger hit):
  windUpMs: 12ms  (exactly the needle lock window — horn rotates into position)
  durationMs: 100ms
  windDownMs: 150ms
  effects:
    impulseAngle: φ = 60° above horizontal toward attacker
    linearImpulse: 5000 engine-units (lateral component — cos 60°)
    verticalImpulse: 8660 engine-units (upward component — sin 60°)
    knockbackImpulse: 10000 engine-units total on attacker
    damageMultiplier: 2.8×
    selfSpinRestore: +alicornCharge × HORN_SPIN_SCALE  (absorbed hits power the horn)
    targetAirborne: true for 400ms  (steep angle = target briefly lifted)
    landingAoePx: 80px  (landing impact when target comes back down)
    landingDmgMult: 1.2×
  peakMs: 50
  peakToleranceMs: 30
  QTEForOpponent: "timing_tap" (50ms window — must tap at moment of horn contact)
  QTESuccess: reduces verticalImpulse by 50% (avoids airborne state but not full damage)
```

### Hard Hit Trap Analysis

```
Alicorn Launch strategic trap:

  Opponent choices against armed Unicrest:
  ┌──────────────────────────────────────────────────────────────────────┐
  │ Light attack (impulse < 200 units):                                 │
  │   → Does NOT trigger Alicorn counter                                │
  │   → 50% damage reduction during armed phase                         │
  │   → Very little damage dealt to Unicrest                            │
  │   → OUTCOME: chip damage only — Unicrest outlasts                   │
  ├──────────────────────────────────────────────────────────────────────┤
  │ Hard attack (impulse > 200 units):                                  │
  │   → Triggers Alicorn Launch counter                                 │
  │   → Attacker receives 2.8× counter-strike + airborne state          │
  │   → Hard attack PUNISHED by the special it was meant to beat        │
  │   → OUTCOME: attacker damaged; their spin reduced; bad trade        │
  ├──────────────────────────────────────────────────────────────────────┤
  │ Combo attack:                                                        │
  │   → First hit of combo likely < 200 units → doesn't trigger         │
  │   → Third hit (Power Thrust, Sword Point) may exceed threshold      │
  │   → Mixed result — only the big final hit of a combo triggers it    │
  ├──────────────────────────────────────────────────────────────────────┤
  │ Wait / don't attack:                                                 │
  │   → No counter trigger                                              │
  │   → Alicorn Launch window expires at 3000ms                         │
  │   → Unicrest loses 100 power if window expires unused               │
  │   → OUTCOME: time-wasting — both waste resources                    │
  └──────────────────────────────────────────────────────────────────────┘

  Optimal counter-play: medium-force attacks that stay below 200-unit threshold.
  These are the "technically correct" moves that beat the trap but deal minimal damage.
```

```typescript
// Special move: Alicorn Launch
function armAlicornLaunch(bey: Beyblade): void {
  bey.alicornArmed = true;
  bey.alicornWindowExpiresAt = Date.now() + 3000;
  bey.alicornCharge = 0;
  bey.incomingDamageMultiplier *= 0.50;
  applyForceState([], {       // applied to all opponents who attack
    state: "cannot_attack_freely",
    durationMs: 3000,
    counterMultiplier: 2.8,
  });
}

function checkAlicornTrigger(bey: Beyblade, hit: HitEvent, attacker: Beyblade): void {
  if (!bey.alicornArmed) return;
  if (hit.impulse < ALICORN_TRIGGER_THRESHOLD) return;

  // TRIGGERED — fire counter
  const counterAngle = Math.atan2(attacker.y - bey.y, attacker.x - bey.x);
  const lateralImpulse = 5000;
  const verticalImpulse = 8660;

  applyForce(attacker.id,
    Math.cos(counterAngle) * lateralImpulse,
    Math.sin(counterAngle) * lateralImpulse);
  attacker.verticalVelocity = verticalImpulse * ENGINE_VERT_SCALE; // airborne
  attacker.airborneUntil = Date.now() + 400;
  attacker.damageReceived += BASE_DAMAGE * 2.8;

  bey.spin = Math.min(bey.maxSpin, bey.spin + bey.alicornCharge * HORN_SPIN_SCALE);
  bey.alicornArmed = false;
  bey.incomingDamageMultiplier = 1.0;
}
```

---

## Case 640 — [COMBO] Horn Brace: Player-Skill Expression of the Needle Anchor and Horn Counter

**Thesis:** Horn Brace is the combo-level expression of the Needle tip impact anchor gimmick (Case 638); it removes the special move's threshold-trigger system and the airborne state entirely, replacing them with a player-timed 3-key sequence that activates a brief anchor window and delivers a single modest counter-hit if contact occurs during that window; the sequence is Defense → Defense → Jump (KKU) representing brace-brace-horn, where the two K inputs signal the player committing to a defensive stance and the U (jump input in the input bitmask) represents the horn protrusion activating — the "upward" intent is mechanically appropriate since the horn geometry always delivers a partially upward-angled hit; unlike Alicorn Launch the trigger is not the opponent's attack force but the 3-key timing relative to when contact occurs: if the opponent attacks during the K-K window the needle anchor activates at the combo's enhanced level and the U input fires the counter, but if the opponent attacks before or after the window the combo does nothing — pure timing skill; the physics is bounded by the needle anchor's real lockout delay (12ms) and the horn angle's physical impulse ceiling, so the counter impulse is single-digit engine-units scaled rather than the anime-transcendent 2.8× of Alicorn Launch; available to defense-type beyblades only; the all-or-nothing miss condition is intentional — Horn Brace should feel like a high-skill parry that either perfectly times the counter or wastes the cooldown.

### Combo Specification

```
Horn Brace — combo definition:

  id: "horn-brace"
  sequence: ["defense", "defense", "jump"]  (KKU)
  windowMs: 480
  cooldownMs: 2600
  powerCost: 20
  typeRestriction: "defense"
  partRequirement: needleTip  (Needle or equivalent extreme-point tip)

  effects if contact occurs during KK window (opponent attacks):
    needleLockActivated: true (30% knockback reduction — gimmick level, not special level)
    counterImpulse: 1600 engine-units (lateral horn component)
    counterVertical: 800 engine-units (upward horn component — minor, not airborne)
    damageMultiplier: 1.40×
    lockMs: 120  (brief stagger on attacker — horn hit disrupts them)
    spinDelta: +25 (partial charge return from needle absorbed hit)

  no contact during window: no effect, cooldown consumed

  ceiling compliance:
    damageMultiplier 1.40× ≤ 1.5×     ✓
    lockMs 120ms ≤ 300ms               ✓
    no invulnerability                  ✓
    no AoE                              ✓
    no airborne state                   ✓ (anime-only — removed)
    counterVertical does not cause airborne  ✓
```

---

## Case 641 — [GIMMICK] GB145 Dynamic Ball Weight Channel and BS Tip Mode Transition: Moment of Inertia Modulation for Quick Direction Change

**Thesis:** The GB145 Gravity Ball 145 spin track contains a circular channel in which two (or more) free-rolling ball weights of approximate mass m_ball = 0.5 g each [ESTIMATED] can travel freely around the full 360° circumference; at steady orbital spin the balls are centrifugally fixed at the outermost point of their channel at radius r_ball = 12mm [ESTIMATED], contributing I_balls = 2 × m_ball × r_ball² = 2 × 5×10⁻⁴ × (0.012)² = 1.44×10⁻⁷ kg·m² to the total I_total — a modest but measurable addition; the critical behavior occurs when the beyblade experiences a sudden velocity change (a near-miss from an attacking bey or the deliberate lateral movement in Allegro Entrechat): the ball weights do not instantly follow the new velocity vector because they have momentum independent of the main body, and for a brief interval t_ball ≈ 20–50ms [ESTIMATED] the balls are displaced from the centrifugal position toward the new velocity direction, momentarily creating an asymmetric mass distribution that shifts the center of mass and briefly lowers I_total (balls at smaller effective radius); this I_total reduction during the transition is ΔI/I ≈ 1.44×10⁻⁷ / 7.308×10⁻⁶ = 2.0% [INFERRED] — small but it means the beyblade's angular velocity momentarily increases by the same percentage via conservation of angular momentum (ω_new = ω_old × I_old / I_new = ω_old × 1.020), providing a brief ~2% spin spike; the BS Ball Sharp tip independently contributes through its geometry: the outer ball surface contacts the floor during fast lateral motion, providing low-friction rolling behavior that enables quick sliding repositioning, while the inner sharp point contacts at rest, providing the usual high-pressure stability; together GB145 and BS create a beyblade that can rapidly reposition laterally during a brief transition window without committing to a full orbital path change, which is the physical foundation of the evasion behavior in Allegro Entrechat (Case 642).

### GB145 Ball Displacement Geometry

```
GB145 ball weight behavior during sudden velocity change:

  Steady state (normal orbit):
    Both balls at r_ball = 12mm (centrifugal maximum)
    I_balls = 1.44×10⁻⁷ kg·m²  [INFERRED]

  Velocity change event (e.g. incoming attacker passes by):
    Balls displace toward original velocity vector for 20–50ms
    Effective r_balls_transition ≈ 8mm (inside their channel)
    I_transition = 2 × 5×10⁻⁴ × (0.008)² = 6.4×10⁻⁸ kg·m²
    ΔI = 1.44×10⁻⁷ − 6.4×10⁻⁸ = 8.0×10⁻⁸ kg·m²

  Spin spike from I reduction:
    Δω = ω_old × (ΔI / I_total) = 600 × (8.0×10⁻⁸ / 7.308×10⁻⁶) = 6.57 rad/s  [INFERRED]
    Brief spin spike of +6.57 rad/s during 20–50ms transition window

  BS tip mode during transition:
    Ball surface contacts floor: μ_ball ≈ 0.08 (smooth ball rolling)
    Lateral displacement enabled during transition: Δx ≈ v_lat × t_ball = 0.3 × 0.035 = 10.5mm
    Snap back to sharp tip at end of transition: bey stops in new position  [INFERRED]
```

### Passive Game Mechanic

```
GB145+BS evasion window:

  Triggered when opponent beyblade passes within 80px without contact (near-miss):
    evasionWindowOpen = true for 60ms
    During window:
      bey.friction = BALL_FRICTION (μ = 0.08 — low, fast lateral movement)
      bey.evasionSpeedBonus = 1.4× (lateral only)
      spinDelta: +6.57 rad/s (I modulation spike)
    After window:
      bey.friction = SHARP_FRICTION (normal sharp tip)
      bey.evasionSpeedBonus = 1.0

  This is the passive gimmick: when an attacker misses by passing close,
  Virgo gets a brief lateral speed boost to widen the gap further.
  Allegro Entrechat (Case 642) amplifies this into a full anticipatory teleport-dodge.
```

```typescript
// Gimmick: GB145 + BS near-miss evasion window
function checkGB145Evasion(bey: Beyblade, nearMissEvent: NearMissEvent): void {
  if (!bey.hasGB145 || !bey.hasBSTip) return;
  if (nearMissEvent.distance > GB145_NEAR_MISS_RADIUS) return;
  bey.evasionWindowActive = true;
  bey.evasionWindowExpiresAt = Date.now() + 60;
  bey.spin = Math.min(bey.maxSpin, bey.spin + 6.57);  // I modulation spike
  bey.tipFrictionOverride = BALL_FRICTION;
}
```

---

## Case 642 — [SPECIAL MOVE] Allegro Entrechat: Teru Saotome / Earth Virgo GB145BS (Metal Fight Beyblade)

**Franchise Move:** Virgo quickly dodges an opponent's attacks; inspired by the ballet move "Entrechat" where the dancer does a quick jump and rapidly bumps heels together; the dodge is anticipatory — Virgo moves to where the attacker is NOT going, leaving the attacker to overshoot.

**Thesis:** Allegro Entrechat is the anime transcendence of the GB145+BS evasion window gimmick (Case 641), taken from a reactive 60ms near-miss bonus into a proactive full-anticipation dodge that fires before the attacker even arrives and always succeeds; the physical gimmick gives Virgo a 60ms lateral repositioning window when an attacker passes close by [INFERRED, Case 641], but the special move gives Virgo perfect foreknowledge of the attacker's path — the moment the special is armed, the game locks Virgo's future position as a teleport-dodge to a calculated safe point perpendicular to the attacker's current velocity vector, and when the attacker crosses the original Virgo position, Virgo is already at the new position with a 300ms counter window available; the "entrechat" visual is a rapid figure-eight hop — Virgo spirals briefly to one side then snaps back from the opposite angle, the ballet footwork rendered as a beyblade version of the dancer's heel-click; this is the only move in the current roster whose primary effect is applied to POSITION rather than impulse — the damage is zero from the dodge itself and entirely optional from the counter window that follows; the `cannot_attack_freely` force state comes from a different mechanism than in Alicorn Launch: here it is not "your heavy attack triggers a counter" but "your attack will miss entirely and leave you exposed," which discourages all attack attempts while the special is armed; the attacker who commits to a trajectory is punished by whiffing while the defender has already teleported to their flank.

### Phase Structure

```
Allegro Entrechat — four-panel sequence (matches franchise image):

  Frame sequence (from the four-panel diagram):
  Panel 1: Attacker approaches from upper-right. Virgo anticipates → moves RIGHT.
  Panel 2: Attacker arrives at Virgo's original position (hits nothing). Virgo is to the right.
  Panel 3: Attacker charges toward new Virgo position. Virgo moves TOWARD attacker's side.
  Panel 4: Attacker overshoots to the left. Virgo is behind them — counter window.

Phase 1 — "entrechat_anticipate" (armed stance):
  windUpMs: 100  (Virgo spirit pirouettes — dance animation)
  durationMs: up to 2000ms (window to detect incoming attacker trajectory)
  effects:
    movementMode: "anticipation"  (Virgo drifts slowly, biding time)
    incomingDamageReduction: 0.0  (no defence bonus — the dodge IS the defence)
    forceState on opponents: cannot_attack_freely, durationMs: 2000ms
    triggerCondition: opponent commits to attack trajectory aimed at Virgo

Phase 2 — "entrechat_dodge" (fires when attacker commits trajectory):
  windUpMs: 0  (instant — anticipation computed before attacker arrives)
  durationMs: 80ms  (teleport-reposition time)
  effects:
    dodgeTarget: perpendicular position to attacker's velocity vector, 120px from original
    teleportToPos: dodgeTarget  (instant reposition — anime transcendence of 10.5mm gimmick)
    invulnerabilityMs: 80  (during the reposition itself)
    visual: figure-eight spiral hop, ballet leaping particles

Phase 3 — "entrechat_counter_window" (300ms post-dodge):
  durationMs: 300ms
  effects:
    attackerVelocityCarried: true  (attacker overshoots — reduced deceleration)
    counterOpportunity: true       (Virgo is behind/beside attacker)
    if player inputs attack during window:
      counterImpulse: 4500 engine-units (from attacker's flank — no resistance)
      damageMultiplier: 2.2×  (flank hit bonus — attacker's AR not facing Virgo)
      knockbackImpulse: 6000 engine-units
    if player does NOT input attack:
      move completes with no damage but excellent positioning
```

### Dodge Geometry

```
Entrechat dodge calculation:

  attacker velocity vector: v_att = (vx, vy)
  perpendicular to attacker path: v_perp = (-vy, vx) / |v_att|  (normalized)
  dodge direction chosen: whichever perpendicular keeps Virgo inside arena

  dodge distance: 120px  (anime transcendence of physical 10.5mm gimmick — 11.4× scale)
  dodgeTarget = virgoPos + v_perp × 120

  After attacker passes original position:
    attacker.velocity continues unchanged (no deflection — they hit air)
    attacker arrives 80–120px past original Virgo position within 150–200ms
    attacker is now moving AWAY from Virgo's new position
    → counter window: Virgo is behind attacker for 300ms
    → from behind, attacker's AR is not between Virgo and their body
    → reduced effective defense → 2.2× damage multiplier on counter
```

```typescript
// Special move: Allegro Entrechat
function detectEntrechatTrigger(bey: Beyblade, attacker: Beyblade): boolean {
  // Check if attacker is on collision course with Virgo within 400ms
  const ttc = timeToCollision(attacker, bey);
  return ttc > 0 && ttc < 400;
}

function fireEntrechatDodge(bey: Beyblade, attacker: Beyblade): void {
  // Compute perpendicular dodge position
  const dx = attacker.vx, dy = attacker.vy;
  const len = Math.hypot(dx, dy) || 1;
  const perpX = -dy / len, perpY = dx / len;

  // Choose side that stays inside arena
  const candidate1 = { x: bey.x + perpX * 120, y: bey.y + perpY * 120 };
  const candidate2 = { x: bey.x - perpX * 120, y: bey.y - perpY * 120 };
  const dodgePos = isInsideArena(candidate1) ? candidate1 : candidate2;

  bey.x = dodgePos.x;
  bey.y = dodgePos.y;
  bey.invulnerableUntil = Date.now() + 80;
  bey.entrechatCounterWindowUntil = Date.now() + 80 + 300;
}

function applyEntrechatCounter(bey: Beyblade, attacker: Beyblade): void {
  if (Date.now() > bey.entrechatCounterWindowUntil) return;
  const angle = Math.atan2(attacker.y - bey.y, attacker.x - bey.x);
  applyForce(bey.id, Math.cos(angle) * 4500, Math.sin(angle) * 4500);
  applyForce(attacker.id, Math.cos(angle) * 6000, Math.sin(angle) * 6000);
  attacker.damageReceived += BASE_DAMAGE * 2.2;
}
```

---

## Case 643 — [COMBO] Quick Step: Player-Skill Expression of the GB145+BS Evasion Window

**Thesis:** Quick Step is the combo-level expression of the GB145+BS near-miss evasion gimmick (Case 641); it captures the essence of the Allegro Entrechat dodge — move to where the attacker is not — but removes the anticipation system, the teleport, and the guaranteed counter window, replacing them with a player-timed 3-key directional evade that only works if the player reads the incoming attack correctly and inputs the right direction; the sequence is Left → Right → Dodge (←→L where L = dodge input) or Right → Left → Dodge (→←L), representing the beyblade shifting its weight rapidly in two directions (the "entrechat" heel-click alternation) then committing to the dodge direction on the final input; the dodge direction is determined by the final movement input registered before the L, so ←→L dodges right and →←L dodges left; the physics is bounded by the gimmick: the lateral dash during the dodge is the ball-tip low-friction slide (μ = 0.08, 60ms window) giving a repositioning distance of ~10–15mm per game scale versus 120px for the special move — the combo provides a real but modest positional shift that makes contact slightly less likely but does not guarantee a miss; the counter window after a successful dodge is a reduced 150ms rather than 300ms; Quick Step is the "I think they're coming from the left" skill call, while Allegro Entrechat is the "I know they're coming and I'm going to leave them looking foolish" special.

### Combo Specification

```
Quick Step — combo definition:

  id: "quick-step"
  sequences:
    ["moveLeft", "moveRight", "dodge"]  (←→L)  → dodge right
    ["moveRight", "moveLeft", "dodge"]  (→←L)  → dodge left
  windowMs: 400
  cooldownMs: 1800
  powerCost: 10  (lightest combo cost — pure positioning)
  typeRestriction: "balanced"  (available broadly — evasion is universal)
  partRequirement: ballTip OR GB145  (needs either the tip or track for the gimmick)

  effects:
    dashImpulse: QUICK_STEP_DASH  (600 engine-units in dodge direction)
    reposition: true (40px in dodge direction — physical gimmick scale)
    invulnerabilityMs: 40  (brief — enough to avoid a grazing contact)
    spinDelta: +6 (I modulation spike from gimmick)
    evasionWindowMs: 150  (counter window if attacker overshoots)

  if attacker misses during evasion window:
    counterImpulse bonus: +800 engine-units if player attacks during 150ms window
    damageMultiplier: 1.25×  (minor flank bonus)

  NO teleport  (physics only — 40px not 120px)
  NO guaranteed miss  (attacker may still track the 40px shift)
  NO perfect anticipation  (player must read the attack direction manually)

  ceiling compliance:
    damageMultiplier 1.25× ≤ 1.5×   ✓
    lockMs: 0                         ✓
    invulnerabilityMs 40ms ≤ combo allowed (very brief, counts as positional not defensive)  ✓
    no AoE                            ✓
```

---

*Next cases will continue as new franchise moves are provided. Each batch follows the same pattern: Gimmick case → Special Move case(s) → Combo case(s) derived from the same gimmick.*

---

## Case 644 — [GIMMICK] Wide Domed AR Curved-Surface Impulse Partitioning and Ball Tip Stability Stance: Defense Archetype Passive Deflection and Ground-Hold

**Thesis:** A defense-type beyblade achieves its passive protective capability through the intersection of two simultaneous part behaviors: first, a wide domed or smooth-profile Attack Ring that presents a curved contact surface to incoming AR strikes such that the normal vector at any contact point is radial to the AR's outer arc, not perpendicular to a flat face; and second, a ball-type Performance Tip that allows the bey to pivot about its single spherical contact point under low-impulse loads rather than translating laterally, absorbing hits as tilt instead of displacement; for the curved AR, the effective lateral impulse transferred to the defender body is J_eff = J_contact × cos(φ), where φ is the angle between the incoming attack vector and the surface normal at the contact point — for a flat AR face (φ ≈ 0 for a centered hit) this gives full transfer, while for a round/domed AR surface the approach angle for a typical orbit-and-strike is φ ≈ 30–50° depending on the attacker's trajectory, giving J_eff = J_contact × cos(40°) = 0.766 × J_contact [INFERRED], meaning approximately 23% of the impulse is partitioned away from the defender's translational DoF and instead exits as a sliding-along-arc deflection that redirects the attacker tangentially off the domed surface; averaged over the realistic approach angle distribution for orbit-style attack types (φ uniform in [15°, 60°]), the mean transfer coefficient is k_avg = [sin(60°) − sin(15°)] / [(60° − 15°) × π/180] = [0.866 − 0.259] / 0.785 = 0.773 [CALCULATED], so a domed defense AR reduces average incoming translational impulse by 22.7% compared to a flat AR face; for the ball tip, the critical threshold separating the two response modes is J_translate = m × μ_ball × g × t_contact where μ_ball ≈ 0.08 (bearing-like rolling contact), m = 0.040 kg, g = 9.81 m/s², and t_contact ≈ 5 ms for a typical AR-to-AR collision — giving J_threshold = 0.040 × 0.08 × 9.81 × 0.005 = 1.57 × 10⁻⁴ N·s = 4.4 engine-units [CALCULATED]; below this threshold the ball tip does not slide and the bey responds as a rigid body rotating about the ball contact point with rotational inertia I_contact = I_body + m × h² = 7.308 × 10⁻⁶ + 0.040 × (0.010)² = 11.31 × 10⁻⁶ kg·m² [CALCULATED], absorbing the impulse as angular tilt (not lateral displacement); above the threshold the tip does slide (μ_k = 0.08), giving a lateral acceleration a = μ_ball × g = 0.784 m/s², which is far smaller than a flat-tip attack beyblade's acceleration (a_flat = μ_flat × g = 1.67 m/s²), so even in sliding mode the ball tip drifts slowly and the defense beyblade stays near its launch position; additionally, the wide outer radius of a defense AR (r_AR ≈ 22 mm) co-rotating at ω₀ = 600 rad/s (Original series MFB launch) produces a rim air velocity v_rim = 600 × 0.022 = 13.2 m/s and a radial aerodynamic outflow force at close range: at d = 50 mm, F_wind = ½ × 1.225 × (13.2 × 0.022 / 0.050)² × 1.96 × 10⁻³ = 0.041 N [INFERRED], a small but physically real radial push that accumulates over sustained proximity and passively discourages close-orbit attack approaches; together these three mechanisms — curved-surface impulse partition, ball-tip pivot absorption, and rim aerodynamic push — form the physical tripod that underlies all defense-type passive protection, and Draciel's AR and tip geometry realize all three simultaneously.

### Curved AR Impulse Partition Geometry

```
Incoming attack vs AR contact surface — top-down view:

  Flat AR (attack type):          Round/Domed AR (defense type):
                                  
  Attacker →  |  ← Normal         Attacker → (  ← Normal (radial)
               |                              ↘
               |  Full transfer                 Tangential deflect component
               ↓                               exits here (attacker slides off)
  J_eff = J_contact × 1.00       J_eff = J_contact × cos(φ)

  φ = 0° (head-on):   k = 1.000  →  full transfer (worst case for defender)
  φ = 15°:            k = 0.966  →  3.4% deflect
  φ = 30°:            k = 0.866  →  13.4% deflect
  φ = 40°:            k = 0.766  →  23.4% deflect  (typical orbit approach)
  φ = 50°:            k = 0.643  →  35.7% deflect
  φ = 60°:            k = 0.500  →  50.0% deflect  (glancing hit)

  Average over φ ∈ [15°, 60°]:
    k_avg = [sin(60°) − sin(15°)] / [(45°) × π/180]
          = [0.866 − 0.259] / 0.785 = 0.773  → 22.7% average reduction  [CALCULATED]
```

### Ball Tip Response Mode Threshold

```
Ball tip response modes — two regimes:

  Impulse J:  ────────────────┬──────────────────────────────────
                              │
              J < 4.4 eng.u.  │  J > 4.4 eng.u.
                              │
  Response:   Pivot (tilt)    │  Slide (translate)
  I_contact:  11.31 × 10⁻⁶   │  a_slide = μ_ball × g = 0.784 m/s²
               kg·m²           │  (vs 1.67 m/s² for flat tip)
                              │
  Visible:    Bey rocks       │  Bey drifts slowly toward bowl rim
              on ball tip;    │  but stays near launch position
              no lateral      │
              movement        │
              [INFERRED]      │  [CALCULATED]

  Comparison to flat tip:
    Flat tip threshold: J > μ_flat × m × g × t = 0.17 × 0.040 × 9.81 × 0.005 = 3.34×10⁻⁴ N·s
    → flat tip is HARDER to slide (higher threshold)
    → BUT once sliding, a_flat = 1.67 m/s² — much faster drift

  Ball tip paradox: slides at lower threshold but drifts slower.
  Net effect: defense bey stays near center across most hit intensities.
  [INFERRED — ball tip enables positional stability through slow drift, not friction lock]
```

### Rim Aerodynamic Outflow Profile

```
Draciel AR rim air layer — radial force at various distances:

  v_rim = ω × r_AR = 600 × 0.022 = 13.2 m/s  [at ω₀ = 600 rad/s]
  A_target = 1.96 × 10⁻³ m²

  d = 30mm:  F_wind = ½ × 1.225 × (13.2 × 0.022 / 0.030)² × 1.96×10⁻³ = 0.113 N  [INFERRED]
  d = 50mm:  F_wind = 0.041 N  [INFERRED]
  d = 80mm:  F_wind = 0.016 N  [INFERRED]
  d = 100mm: F_wind = 0.010 N  [INFERRED]

  At d = 50mm over 500ms: impulse = 0.041 × 0.5 = 0.021 N·s = 575 engine-units  [GAME-DERIVED]
  Modest but sustained: a persistent proximity tax that makes orbit-and-hold difficult.
```

### Passive Game Mechanic

```
Defense AR + ball tip — passive properties:

  arType: "round_dome"  → deflectionProfile: "curved"
  tipType: "ball"       → movementStyle: "stable"

  On every incoming hit:
    approach_angle = angleBetween(attacker.velocity, contactNormal)
    k_transfer = Math.cos(approach_angle)
    effectiveImpulse = incomingImpulse * k_transfer
    deflectedImpulse = incomingImpulse * (1 - k_transfer)
    // deflected portion exits as attacker tangential deflection:
    attacker applies deflectedImpulse in perpendicular-to-approach direction (bounce-off arc)

  Ball tip pivot check (each hit):
    if (incomingImpulse < BALL_TIP_PIVOT_THRESHOLD):  // 4.4 engine-units
      bey.tiltDelta += incomingImpulse / I_CONTACT   // tilt but no translate
      bey.velocity unchanged
    else:
      bey.velocity += impulse / mass  // slides, but with a_max = μ_ball × g = 0.784 m/s²

  Rim aerodynamic push (every tick, affects opponents within 100px):
    F_aero = AERO_COEFFICIENT / distance²
    applyForce(opponent.id, radialOutward × F_aero × dt)
```

---

## Case 645 — [SPECIAL MOVE] Aqua Shield: Max Mizuhara / Draciel (Beyblade Original Series)

**Franchise Move:** Used by Max against Miguel during the Justice 5 tournament against BEGA; Draciel and Max create a massive wall of water that slows down and reduces the intensity of an opponent's move, allowing Max to knock them out when they come out through the other side; a variation combines with Tyson's tornado to form a waterspout. Defense type. [Beyblade Original Series]

**Thesis:** Aqua Shield is the anime transcendence of the curved defense AR impulse partition gimmick (Case 644) expressed as a persistent arena-spanning water barrier that converts Draciel's passive per-hit deflection into an active zone that taxes all approaches, sustained contacts, and pass-through attempts simultaneously; physically the gimmick reduces incoming impulse by an average of 22.7% per hit via curved surface geometry [Case 644], but the special move projects this effect outward to a full 200px radius zone in which any movement toward Draciel incurs a velocity penalty, any attack launched from inside the zone has its effective force dampened, and any opponent who fully traverses the zone from entry to exit emerges weakened and counter-vulnerable on the far side; the anime sequence shows the water wall as a concave breaking wave — visually, it is the AR's curved deflection surface scaled up to arena size, bending attack trajectories around Draciel instead of away from it; the `must_attack` force state is applied because the zone passively drains opponent spin at 8 rad/s while Draciel recovers at 12 rad/s inside its own protected center, so an opponent who chooses not to attack loses the spin race without a fight — the only productive option is to push through the wall, accept the velocity and damage penalties, and try to land a hit on Draciel directly, which is exactly what Miguel does in the franchise: he forces through the Aqua Shield but arrives at Draciel with significantly reduced velocity and impact force, making the collision winnable for Max; the waterspout variant is a team combination event — if a wind-type special move (e.g., Tyson's Stormforce Buster / tornado) is simultaneously active in the arena, the Aqua Shield absorbs the wind field and upgrades its own zone: the combined water-wind Waterspout AoE doubles in radius (400px), persists 1000ms longer, and adds a rotational knockback component to every hit that exits the zone, representing the physical reality that a water-wind combination stores kinetic energy as rotational fluid motion in a way that neither element alone achieves; the QTE counter for the opponent is a "burst-through" timing window — if the opponent commits a perfectly timed heavy attack at the exact moment of peak wall thickness (t = 750ms into Phase 2), they break through with only 20% penalty instead of the normal 55%, rewarding perfect timing and preventing the Aqua Shield from becoming an uncounterable wall.

### Phase Structure

```
Aqua Shield — phase sequence:

Phase 1 — "aqua_rising" (wall formation):
  windUpMs: 500
  animation: water surges outward from Draciel in a concave wave arc
  effects during wind-up:
    draciel spin recovery: +10 rad/s per tick (building charge into water wall)
    incoming damage reduction on Draciel: 0.60×

Phase 2 — "aqua_shield_active" (wall sustained):
  durationMs: 3000
  zoneRadius: 200px  (full arena — wall spans stadium edge to stadium edge)

  Zone effects on opponent (any opponent inside the zone):
    velocityScale: × 0.45  (the water slows all movement — "wading through")
    outgoingDamageMultiplier: × 0.60  (attacks launched from inside the wall are weakened)
    spinDecayBonus: +8 rad/s additional drain  (the water absorbs energy)
    visual: opponent bey coated in water spray, movement trails show drag

  Draciel inside own zone center:
    spinRecoveryBonus: +12 rad/s  (protected eye-of-the-storm)
    incomingDamageReduction: 0.50×  (extra wall protection for the holder)
    velocityUnchanged  (Draciel is the source — no self-slow)

  Pass-through penalty (opponent enters AND fully crosses to far side):
    emergeVelocityScale: × 0.40  (they arrive at Draciel's side significantly slowed)
    emergeDamageMultiplier: × 0.50  (attack is drained by transit through full wall)
    emergePenaltyDurationMs: 800  (weakened for 800ms after exit)

  Draciel counter window (fires whenever any opponent exits the zone):
    counterWindowMs: 800  (Draciel's next hit within 800ms)
    counterDamageMultiplier: 1.8×  (opponent is weakened; Draciel is fresh)
    visual: Draciel pulses blue — counter armed indicator

  forceState on opponents: must_attack  (duration: 3000ms)
  forceStateReason: opponent spin drains passively; only attacking through wall is productive
  spinAttrition:
    if opponent does NOT enter zone within 2500ms:
      opponent spin -= 8 × 2.5 = 20 additional rad/s total loss
      Draciel spin += 12 × 2.5 = 30 additional rad/s total gain
    → spin gap widens until opponent must commit

  QTE for opponent — "Wall Burst" (timing-based pierce):
    triggerWindow: t = 700ms to t = 800ms into Phase 2  (peak wall density moment)
    windowMs: 100  (narrow — requires good timing)
    QTE_success: velocityScale penalty reduced to × 0.80 (from × 0.45)
                 outgoingDamageMultiplier penalty reduced to × 0.90
                 effectivelyDoes: opponent barely feels the wall — near-full pass-through
    QTE_fail: standard penalty applies (× 0.45 velocity, × 0.60 damage)
    QTE_perfect_timing: opponent also gains brief +2.0× damage on their next strike
                        (reward for perfect execution: the burst energy adds to their attack)

Phase 3 — "aqua_collapse" (wall breaks down):
  windDownMs: 300
  If no opponent passed through: water crashes inward toward Draciel — small spin recovery bonus
  If opponent forced through: water collapses outward — no bonus (wall spent itself)

powerCost: 100
cooldownMs: 5000
durationMs: 3800  (500 wind-up + 3000 active + 300 wind-down)
```

### Waterspout Variant — Team Combination Event

```
Aqua Shield + Wind-type Special Move interaction:

  Trigger: any wind-category special move is active in the arena simultaneously
  (e.g., tornado, whirlwind, air field — any move tagged windCategory: true)

  When both are active:
    Aqua Shield absorbs the wind field after 500ms of co-existence
    Wind special move: terminates early (absorbed)
    Aqua Shield upgrades to "Waterspout Mode" for the remaining duration:

  Waterspout Mode differences:
    zoneRadius: 400px  (full arena + beyond — everything in the stadium is affected)
    durationBonusMs: +1000ms
    spinAttritionRate: doubled (−16 rad/s for opponents, +24 rad/s for Draciel)
    velocityScale on opponents: × 0.30  (even harder to move in the waterspout)
    rotationalKnockback: true  (opponents in zone are slowly spun outward in a clockwise gyre)
      gyreForce: 400 engine-units per tick applied perpendicular to radial vector
      direction: clockwise if Draciel is right-spin (matches spin field)
    visual: Draciel ascends briefly to center of a rotating blue-white waterspout column
            The wind beyblade's visual is absorbed into the water column
    
  This is a cooperative interaction — the team variant is the maximum form of Aqua Shield.
  In solo mode (no team), Waterspout cannot be triggered.
```

### Pass-Through Outcome Matrix

```
Opponent choices vs Aqua Shield (Phase 2 active):

  ┌──────────────────────────────────────────────────────────────────────┐
  │ Wait / dodge at zone boundary (don't enter):                         │
  │   → Spin attrition: lose 8 rad/s × duration                         │
  │   → Draciel gains spin gap each second                               │
  │   → OUTCOME: time loss — eventually forced to enter anyway           │
  ├──────────────────────────────────────────────────────────────────────┤
  │ Enter zone and attack from inside (short-range):                     │
  │   → Velocity reduced to 45%: approach much slower                   │
  │   → All damage output × 0.60                                         │
  │   → Can attack Draciel but at significantly reduced effectiveness    │
  │   → OUTCOME: chip damage only — wall taxes every hit                 │
  ├──────────────────────────────────────────────────────────────────────┤
  │ Force fully through (standard):                                      │
  │   → Passes through at 40% velocity, 50% damage                      │
  │   → Draciel counter window opens: 1.8× counter hit incoming         │
  │   → OUTCOME: Miguel path — damaged arrival + Draciel counter         │
  ├──────────────────────────────────────────────────────────────────────┤
  │ Wall Burst (perfect QTE, t = 750ms):                                 │
  │   → Pass-through at 80% velocity, 90% damage                        │
  │   → Arrive with near-full force + bonus 2.0× next strike            │
  │   → OUTCOME: the skill ceiling — perfectly timed burst beats shield  │
  └──────────────────────────────────────────────────────────────────────┘

  Key insight: the shield is not a wall — it is an attrition tax system.
  Every choice except perfect QTE-burst costs the opponent something.
  The only "free" play is the 100ms Wall Burst window — everything else pays.
```

```typescript
// Special move: Aqua Shield
interface AquaShieldState {
  active: boolean;
  phase: "aqua_rising" | "aqua_shield_active" | "aqua_collapse";
  startMs: number;
  zoneRadius: number;
  waterspoutMode: boolean;
  counterWindowUntil: number;
}

function tickAquaShield(
  draciel: Beyblade,
  opponents: Beyblade[],
  shield: AquaShieldState,
  dt: number
): void {
  const elapsed = Date.now() - shield.startMs;
  const ZONE_R = shield.waterspoutMode ? 400 : 200;

  // Phase 2 active effects
  if (shield.phase === "aqua_shield_active") {
    // Draciel spin recovery inside own zone
    draciel.spin = Math.min(draciel.maxSpin, draciel.spin + 12 * (dt / 1000));

    for (const opp of opponents) {
      const d = distanceBetween(draciel, opp);
      if (d <= ZONE_R) {
        // Velocity damping — applied each tick
        opp.vx *= Math.pow(0.45, dt / 1000);
        opp.vy *= Math.pow(0.45, dt / 1000);
        // Outgoing damage multiplier (tracked for their next attack in this tick)
        opp.outgoingDamageMultiplier = 0.60;
        // Spin attrition
        opp.spin = Math.max(0, opp.spin - 8 * (dt / 1000));
        // Waterspout rotational gyre
        if (shield.waterspoutMode) {
          const angle = Math.atan2(opp.y - draciel.y, opp.x - draciel.x);
          const perpAngle = angle + Math.PI / 2;
          applyForce(opp.id, Math.cos(perpAngle) * 400, Math.sin(perpAngle) * 400);
        }
      }
    }

    // Wall Burst QTE window check (t = 700–800ms)
    if (elapsed >= 700 && elapsed <= 800) {
      // QTE detection handled by QTE system — sets shield.burstPerfect if timed
    }
  }

  // Counter window — fires when opponent exits zone
  for (const opp of opponents) {
    if (opp.justExitedZone && shield.phase === "aqua_shield_active") {
      shield.counterWindowUntil = Date.now() + 800;
      draciel.counterMultiplierActive = 1.8;
      draciel.counterExpiresAt = shield.counterWindowUntil;
      opp.justExitedZone = false;
    }
  }
}

// Check waterspout trigger
function checkWaterspoutMerge(shield: AquaShieldState, arenaSpecials: SpecialMoveActive[]): void {
  const windSpecial = arenaSpecials.find(s => s.windCategory && s.ownerId !== shield.ownerId);
  if (windSpecial && !shield.waterspoutMode) {
    shield.waterspoutMode = true;
    shield.zoneRadius = 400;
    shield.durationRemainingMs += 1000;
    windSpecial.terminated = true; // wind move absorbed
  }
}
```

---

## Case 646 — [COMBO] Tidal Brace: Player-Skill Expression of the Defense AR Deflection and Ball Tip Pivot Stance

**Thesis:** Tidal Brace is the combo-level expression of the curved AR deflection gimmick (Case 644) accessed by player skill rather than passive geometry; where the gimmick continuously partitions every incoming hit by cos(φ) based on approach angle, the combo player manually activates a deflection stance for a brief window by executing the (↓↓K) input sequence — moveDown twice then defense — which represents the beyblade digging its ball tip into the lowest bowl point to eliminate drift (first ↓), locking the centripetal position to resist displacement (second ↓), and then activating the active deflect guard (K) that rotates the AR to present the maximum-curvature face toward the most likely incoming attack; the two successive downward inputs are not idle presses — each produces a 20px repositioning toward the bowl center, ensuring the bey is as far from the ring-out boundary as possible before bracing, which is the physical analog of a defense-type finding the deepest, most stable bowl position before absorbing a hit; the active guard on K then amplifies the gimmick's natural cos(φ) partition by locking the AR rotation to maximize φ for the next two incoming hits: instead of relying on a random approach angle from the attacker, Tidal Brace actively presents the most-curved face (equivalent to φ ≈ 50°, k = 0.643 → 35.7% reduction rather than the passive average of 22.7%), boosting the deflection performance beyond what the gimmick alone achieves; each absorbed hit within the brace window also transfers a portion of its momentum to Draciel's spin (the ball tip pivot mode — Case 644 confirms impulses < 4.4 engine-units cause pure tilt, not translation) as a +10 spinDelta per absorbed hit, representing the mechanical energy partitioned into rotation instead of displacement; the counter window after the brace is 400ms — shorter than Allegro Entrechat's 300ms but with a meaningful 1.35× multiplier rather than the 2.2× flank bonus, because the Tidal Brace counter is frontal (Draciel faces the attacker directly) rather than from behind; the tradeoff: Tidal Brace is accessible, survivable, and produces a consistent damageMultiplier within the combo ceiling, making it Draciel's primary reliable offensive option after absorbing a hit, while Aqua Shield is the arena-dominating ultimate that requires 100 power but is categorically more powerful.

### Combo Specification

```
Tidal Brace — combo definition:

  id: "tidal-brace"
  sequence: ["moveDown", "moveDown", "defense"]  (↓↓K)
  windowMs: 400
  cooldownMs: 1600
  powerCost: 20
  typeRestriction: "defense"
  partRequirement: ballTip OR roundDomeAR  (either component of the gimmick sufficient)

  Phase 1 — "tidal_sink" (first two moveDown inputs):
    Each moveDown: reposition 20px toward bowl center  (total: up to 40px closer to center)
    spin micro-restore: +3 per step  (sinking posture tightens gyroscopic moment)
    visual: bey dips low — water/spray particles from ball tip contact

  Phase 2 — "tidal_brace_guard" (defense input — active for 500ms):
    activates deflection stance:
      maxCurvedFaceAngle: true  (AR locks to present φ ≈ 50° face toward nearest attacker)
      incomingImpulseReduction: 0.357×  (cos(50°) = 0.643 → 1 − 0.643 = 35.7% reduction)
      appliesToHits: 2  (protects the next two incoming hits, then expires)
      spinGainPerAbsorbedHit: +10  (ball tip pivot mode — momentum into spin, not translation)
      invulnerabilityMs: 60  (brief stance-lock during the guard set — prevents topple)
      visual: bey glows blue-white at AR rim — curved surface highlight

  Phase 3 — "tidal_counter_window" (400ms after guard activates, or after first absorbed hit):
    counterWindowMs: 400
    if player inputs attack during window:
      contactImpulse: TIDAL_COUNTER_IMPULSE  (1200 engine-units — solid but not special-move scale)
      knockbackImpulse: 1800 engine-units
      damageMultiplier: 1.35×  (frontal counter — full AR face bonus)
      spinBoostFromAbsorbed: spin gained from absorbed hits adds to counter impulse
        (each absorbed +10 spin → +80 engine-units bonus, max +160 from 2 hits)
    if player does NOT input attack:
      brace completes with defensive benefit only (spin gain, repositioning, no damage)

  NO persistent zone  (that is Aqua Shield only)
  NO arena-wide effect  (local to Draciel's immediate contact zone)
  NO velocity drain on opponents  (only Draciel's own hit reduction and counter)

  ceiling compliance:
    damageMultiplier 1.35× ≤ 1.5×     ✓
    lockMs: 0                           ✓
    invulnerabilityMs: 60ms             ✓  (brief stance, comparable to Quick Step's 40ms)
    no AoE                             ✓
    no spinRecovery > gimmick output    ✓  (+10 per hit from absorbed energy — not free spin)
    no pierce-defense                  ✓
```

### Tidal Brace vs Aqua Shield vs Spring Counter (Comparison)

```
                 Tidal Brace      Aqua Shield       Spring Counter
                 (Combo, ↓↓K)    (Special, 100p)   (Combo, CS12 Case 624)
──────────────────────────────────────────────────────────────────────────
Activation       Player 3-key    1-button           Player 3-key
Scope            Local (self)    Arena-wide 200px   Local (self)
Hit reduction    35.7% (2 hits)  55% (all hits      Fafnir: spin absorb
                                 in zone)            (different mechanism)
Spin gain        +10 per hit     +12/s recovery     Variable (absorbed)
Counter mult     1.35×           1.8×               1.30×
Counter window   400ms           800ms              150ms (CS12)
Power cost       20              100                 15
Cooldown         1600ms          5000ms             2000ms
Type restriction defense         any (Draciel)      balanced+counter-spin
AoE              none            200px zone         none
Force state      none            must_attack        none
Best use         Reliable 1-hit  Arena control      Counter-spin matchups
                 absorb+counter  sustained defense
```

```typescript
// Combo: Tidal Brace
function applyTidalBrace(bey: Beyblade): void {
  // Phase 1: sink toward bowl center (two moveDown steps already consumed as combo input)
  const toBowlCenter = bowlCenterDirection(bey);
  bey.x += toBowlCenter.x * 20;
  bey.y += toBowlCenter.y * 20;
  bey.spin = Math.min(bey.maxSpin, bey.spin + 6);  // 3 per moveDown × 2

  // Phase 2: activate deflection guard
  bey.tidalBraceActive = true;
  bey.tidalBraceHitsRemaining = 2;
  bey.tidalBraceExpiresAt = Date.now() + 500;
  bey.invulnerableUntil = Date.now() + 60;  // brief stance lock

  // AR lock to max-curved face (φ ≈ 50° presentation)
  bey.deflectionProfile = "max_curved";
  bey.deflectionK = Math.cos(50 * Math.PI / 180);  // 0.643

  // Counter window opens immediately (player can wait up to 400ms after guard)
  bey.tidalCounterWindowUntil = Date.now() + 500 + 400;
}

function onTidalBraceHit(bey: Beyblade, hit: HitEvent): HitResult {
  if (!bey.tidalBraceActive || bey.tidalBraceHitsRemaining <= 0) {
    return { effectiveImpulse: hit.impulse };
  }

  const reduced = hit.impulse * bey.deflectionK;
  const absorbed = hit.impulse * (1 - bey.deflectionK);
  // Absorbed energy → spin (ball tip pivot mode)
  const spinGain = 10 + Math.min(80 * 2, absorbed * ABSORBED_TO_SPIN_FACTOR);
  bey.spin = Math.min(bey.maxSpin, bey.spin + 10);  // flat 10 per hit
  bey.tidalBraceHitsRemaining -= 1;

  if (bey.tidalBraceHitsRemaining <= 0) bey.tidalBraceActive = false;

  return { effectiveImpulse: reduced };
}

function applyTidalCounter(bey: Beyblade, target: Beyblade): void {
  if (Date.now() > bey.tidalCounterWindowUntil) return;

  // Base counter + spin-absorbed bonus
  const absorbBonus = Math.min(160, (2 - bey.tidalBraceHitsRemaining) * 80);
  const impulse = TIDAL_COUNTER_IMPULSE + absorbBonus;

  const angle = Math.atan2(target.y - bey.y, target.x - bey.x);
  applyForce(bey.id, Math.cos(angle) * impulse, Math.sin(angle) * impulse);
  applyForce(target.id, Math.cos(angle) * 1800, Math.sin(angle) * 1800);
  target.damageReceived += BASE_DAMAGE * 1.35;

  bey.tidalCounterWindowUntil = 0;  // window consumed
  bey.deflectionProfile = "default";
}
```

---

## Case 647 — [GIMMICK] Eternal Tip Wall-Adhesion and Bowl-Wall Potential Energy Storage: Slope Climbing as a Kinetic-to-Potential-to-Kinetic Energy Relay

**Thesis:** The Eternal performance tip in the Beyblade Burst format is a tip body fitted with a free-spinning outer sleeve of approximate outer radius r_ET ≈ 4 mm and mass m_sleeve ≈ 0.4 g; the sleeve is mounted on a bearing seat around the central ABS shaft so that when the sleeve contacts any surface — floor, bowl wall, or stadium rim — it rotates freely against that surface rather than dragging; the consequence is that the effective kinetic friction coefficient at the wall contact interface drops from μ_ABS ≈ 0.17 (rigid ABS tip on ABS wall) to μ_ET ≈ 0.05 (sleeve rolling against wall, analogous to a bearing contact) [INFERRED], reducing energy dissipation during wall-climbing by approximately (0.17 − 0.05) / 0.17 = 70.6% [CALCULATED]; the physical sequence of Archer Strike's underlying gimmick is: (1) an incoming lateral impulse from an attacker's strike pushes Hercules toward the bowl wall at velocity v_push; (2) Hercules contacts the curved bowl wall at angle θ_wall (the local bowl wall angle at the impact latitude, typically 30°–55° for standard Burst-era bowls based on CS10 Case 546); (3) the component of v_push along the wall surface drives Hercules up the slope at v_climb = v_push × cos(θ_wall) while the component perpendicular to the wall surface is resolved by the normal reaction and the ET sleeve rolling contact [INFERRED]; (4) Hercules climbs height h = v_climb² / (2 × g × (1 + μ_ET × cot(θ_wall))) where the friction-modified denominator accounts for the rolling drag of the ET sleeve on the wall, and at θ_wall = 45°, μ_ET = 0.05: h = v_climb² / (2 × 9.81 × (1 + 0.05 × 1.0)) = v_climb² / 20.601 [CALCULATED]; (5) the stored potential energy PE = m × g × h is then released as Hercules descends back down the same bowl slope, converting almost entirely back to kinetic energy at the base: KE_return = PE × η where η = 1 − μ_ET × cos(θ_wall) / sin(θ_wall) = 1 − 0.05 × 1.0 = 0.95 [INFERRED for θ_wall = 45°]; for a representative attack impulse that creates v_push = 1.25 m/s (corresponding to a typical Burst-series attack at moderate power): v_climb = 1.25 × cos(45°) = 0.884 m/s, h = 0.884² / 20.601 = 0.0379 m = 37.9 mm, v_return = √(2 × 9.81 × 0.0379 × 0.95) = √(0.708) = 0.841 m/s [CALCULATED], return collision impulse on attacker = m × v_return × (1 + e) / 2 = 0.040 × 0.841 × 1.67 / 2 = 0.0281 N·s = 781 engine-units [GAME-DERIVED]; the crucial design property is that the return impulse scales with the square of the original attack velocity: v_return ∝ v_push², so a harder attack causes a harder return — the gimmick is a quadratic energy trap; a light attack (v_push = 0.5 m/s) returns only 125 engine-units, while a heavy attack (v_push = 2.0 m/s) returns 1248 engine-units — a 10× output difference for a 4× input difference [CALCULATED], making the gimmick disproportionately punishing against heavy hitters.

### Wall-Climbing Energy Flow

```
Archer Hercules ET tip — wall-climb energy relay:

  Bowl cross-section (side view):
  ┌───────────────────────────────────────────────────────┐
  │         bowl wall (angle θ = 45°)                     │
  │        /                                              │
  │       /  ← Hercules climbing                         │
  │      /  ↑ h = 37.9mm                                 │
  │     /   (stores PE = 0.0149 J)                        │
  │    ●  ← Hercules at start position                    │
  │   ↑                                                   │
  │   Impact from attacker → v_push = 1.25 m/s            │
  └───────────────────────────────────────────────────────┘

  Energy accounting (attacker v_push = 1.25 m/s):
    Input KE from lateral push: ½ × 0.040 × 1.25² = 0.0313 J
    Wall-direction component:    × cos(45°) → 0.0156 J
    Lost to ET sleeve friction:  × (1 − η) = 5% → 0.00078 J lost
    Stored as PE:                0.0149 J  [CALCULATED]
    Returned as KE at descent:   0.0149 × 0.95 = 0.0141 J
    Return velocity:             √(2 × 0.0141 / 0.040) = 0.841 m/s

  Quadratic scaling (ET tip):
    v_push = 0.5 m/s: v_return = 0.336 m/s → 125 engine-units  (light attack)
    v_push = 1.0 m/s: v_return = 0.672 m/s → 374 engine-units  (medium attack)
    v_push = 1.25 m/s: v_return = 0.841 m/s → 781 engine-units (standard)
    v_push = 1.5 m/s: v_return = 1.009 m/s → 979 engine-units  (heavy attack)
    v_push = 2.0 m/s: v_return = 1.344 m/s → 1248 engine-units (max)
    [CALCULATED — harder attack = quadratically harder return]

  Rigid ABS tip comparison at v_push = 1.25 m/s:
    μ_wall = 0.17 → η = 0.83 → v_return = 0.787 m/s → 730 engine-units
    ET advantage: 781 vs 730 → 7% more return energy per hit (compounds over match)
```

### Descent Trajectory

```
Descent path geometry:

  After reaching apex h = 37.9mm at θ_wall = 45°:
    Net acceleration down slope: g × sin(45°) − μ_ET × g × cos(45°) = 6.94 − 0.347 = 6.59 m/s²
    Slope length: s = h / sin(45°) = 0.0536 m
    Descent time: t = √(2s / a) = √(2 × 0.0536 / 6.59) = 0.127 s
    v_return at base: 6.59 × 0.127 = 0.838 m/s  ✓ (matches energy calc)

  Return direction: angled downward along wall slope toward bowl center
    Horizontal component: v_return × cos(45°) = 0.593 m/s  (toward attacker)
    Vertical component:   v_return × sin(45°) = 0.593 m/s  (downward)

  The downward component creates a pressing-down return hit — resists deflection upward.
  This is the physical basis for the "diving strike" in the anime.
```

### Passive Game Mechanic

```
ET tip wall-adhesion — passive property:

  tipType: "eternal"  → wallAdhesion: true, μ_wall: 0.05

  On any hit that pushes Hercules toward the bowl wall:
    v_push_radial = incomingImpulse / mass
    if (distanceToWall < WALL_CLIMB_TRIGGER_DIST):
      v_climb = v_push_radial × Math.cos(BOWL_WALL_ANGLE)
      h_apex = (v_climb²) / (2 × G × (1 + MU_ET × cotBowl))
      returnVelocity = Math.sqrt(2 × G × h_apex × WALL_RETURN_EFFICIENCY)
      bey.wallClimbState = { active: true, h_apex, returnVelocity,
                             returnDir: wallContactAngle + Math.PI }
```

---

## Case 648 — [SPECIAL MOVE] Archer Strike: Hae-jin Oh / Archer Hercules 13 Eternal (Beyblade Burst)

**Franchise Move:** Hercules uses its opponent's attacks to climb up the Beystadium, then comes back down using the slope to gain speed and power to attack the opposing bey. Forces the opponent to attack themselves. Similar to Shield Crash. [Beyblade Burst series]

**Thesis:** Archer Strike is the anime transcendence of the Eternal tip wall-adhesion gimmick (Case 647) in which the passive proportional energy relay is amplified into a single devastating redirected-attack event: where the gimmick passively returns approximately 50% of the attacker's kinetic energy, the special move captures 100% of the triggering hit's impulse, stores it in an amplified potential energy field at the wall apex, and returns it at a 2.4× amplification factor with precision targeting aimed at the attacker's position — the archer-drawing-a-bow metaphor made physical; Hercules is the bow, the stadium wall is the draw, and the downward dive is the loosed arrow; the move must be armed before the triggering hit arrives, and once armed the first hit above the activation threshold (100 engine-units) fully charges the counter and initiates the wall-climb; the amplitude of the return is governed by the triggering hit's magnitude scaled by ARCHER_AMPLIFY_FACTOR = 2.4, representing the BeySpirit energy storage that the anime frames as a bow fully drawn; the `must_attack` force state is applied on arming — if the opponent does not attack within 3000ms, Hercules self-initiates a partial wall ride at reduced power and the cost is forfeited; the opponent faces the same dilemma as against Alicorn Launch: attack and trigger the devastating counter, or wait and lose to spin attrition; the distinction from Alicorn Launch is that Archer Strike's counter is a whole-body dive delivering an 80px AoE rather than a single horn jab, so the counter is harder to dodge but can be read and stepped aside from — the opponent QTE is a "step-aside" dodge window of 300ms opened by the visible apex pause; if the opponent moves more than 100px from the dive target they take only 30% splash damage; the quadratic scaling means the move is uniquely dangerous against hard hitters: a 2000-unit full-force attack triggers a 9600-unit return dive, a 4.8× raw ratio before damage multiplier — the harder you swing at Archer Strike, the harder you are hit by your own momentum.

### Phase Structure

```
Archer Strike — phase sequence:

Phase 1 — "archer_armed" (waiting for trigger hit):
  windUpMs: 200  (Hercules glows amber — bow drawing)
  durationMs: up to 3000ms (window to receive trigger hit)
  activation threshold: incomingImpulse > 100 engine-units
  effects:
    ET tip: wallReturnEfficiency boosted from 0.95 → 1.0 (no energy loss during armed)
    ARCHER_AMPLIFY_FACTOR: 2.4× applied to return impulse
    incomingDamageReduction on Hercules: 0.70×
    forceState on opponents: must_attack, durationMs: 3000ms
    if arm window expires unused:
      partial self-climb: v_climb = 0.5 m/s, no amplification
      partial return: ~400 engine-units  (weaker fallback)
      power cost consumed regardless

Phase 2 — "archer_climbing" (fires on trigger hit):
  triggered: incomingImpulse > 100 engine-units while armed
  durationMs: climbDurationMs  (computed: 120–200ms based on h_apex)
  effects:
    triggerImpulse = hit.impulse
    v_climb_amp = √(2 × triggerImpulse × ARCHER_AMPLIFY_FACTOR / mass)
    h_apex = min(v_climb_amp² / (2g), ARENA_HEIGHT_CAP)
    Hercules: untargetable during climb (on wall surface)
    visual: Hercules blazes up wall trailing fire trail
    opponent UI: targeting reticle appears at attacker's current position (dive warning)

Phase 3 — "archer_dive" (descent from apex):
  apexPauseMs: 80  (brief pause at top before dive)
  durationMs: 150ms
  diveTarget: attacker's position at apex time (fixed — attacker must dodge NOW)
  effects:
    diveImpulse: triggerImpulse × ARCHER_AMPLIFY_FACTOR × 2.0
                 = triggerImpulse × 4.8× total
    damageMultiplier: min(2.6, 1.5 + (triggerImpulse/2000) × 1.1)
    AoE radius: 80px  (whole-body landing)
    knockbackImpulse: 8000 eu at AoE center; 4000 eu at AoE edge
    verticalComponent: 40% of diveImpulse (downward — resists upward deflection)

  QTE for opponent — "Step Aside":
    windowMs: 300ms total from apex to impact
    QTE_dodge (move > 100px from diveTarget):
      splash only: 30% diveImpulse, 0.8× damageMultiplier
    QTE_fail (full impact):
      full AoE: 2.6× damage, 8000 knockback
      must_stay_still applied 600ms  (stunned after full dive impact)

powerCost: 100
cooldownMs: 5000
```

### Quadratic Scaling Table

```
Archer Strike return power (ARCHER_AMPLIFY_FACTOR = 2.4, dive multiplier = 2.0):

  Trigger hit    v_push      h_apex      diveImpulse    damageMultiplier
  ─────────────────────────────────────────────────────────────────────
  100 eu (min)   0.36 m/s    15.8mm      480 eu         1.5×  (floor)
  500 eu         0.80 m/s    78.3mm      2400 eu        2.0×
  1000 eu        1.13 m/s    156.5mm     4800 eu        2.4×
  2000 eu (max)  1.60 m/s    250mm (cap) 9600 eu        2.6×  (ceil)
  [GAME-DERIVED]

  Key: even the minimum 100-unit trigger returns 480 units.
  No attack on armed Hercules is "free" — every hit charges the counter.
```

```typescript
const ARCHER_AMPLIFY_FACTOR = 2.4;
const ARCHER_DIVE_BONUS = 2.0;

function onArcherTriggerHit(hercules: Beyblade, state: ArcherStrikeState, hit: HitEvent): void {
  if (hit.impulse < 100) return;
  state.triggerImpulse = hit.impulse;
  const I_amp = hit.impulse * ARCHER_AMPLIFY_FACTOR;
  const v_climb = Math.sqrt(2 * I_amp / (hercules.mass * ENGINE_TO_SI));
  const h_apex = Math.min((v_climb * v_climb) / (2 * G), ARENA_HEIGHT_CAP_METERS);
  state.apexHeight = h_apex;
  state.phase = "archer_climbing";
  hercules.untargetableUntil = Date.now() + climbDurationMs(h_apex, v_climb);
}

function fireArcherDive(hercules: Beyblade, state: ArcherStrikeState, opponents: Beyblade[]): void {
  const diveImpulse = state.triggerImpulse * ARCHER_AMPLIFY_FACTOR * ARCHER_DIVE_BONUS;
  const dmgMult = Math.min(2.6, 1.5 + (state.triggerImpulse / 2000) * 1.1);
  for (const opp of opponents) {
    const d = distanceBetween({ x: state.diveTarget.x, y: state.diveTarget.y }, opp);
    if (d <= 80) {
      const falloff = 1.0 - (d / 80) * 0.5;
      const dodged = opp.dodgeEventTriggered && d > 100;
      const mult = dodged ? 0.30 : 1.0;
      applyForce(opp.id, ..., diveImpulse * falloff * mult);
      opp.damageReceived += BASE_DAMAGE * (dodged ? 0.8 : dmgMult) * falloff;
      if (!dodged) {
        opp.forceState = "must_stay_still";
        opp.forceStateExpiresAt = Date.now() + 600;
      }
    }
  }
  hercules.velocityLockedUntil = Date.now() + 100;
  state.phase = "complete";
}
```

---

## Case 649 — [COMBO] Slope Launch: Player-Skill Expression of the Eternal Tip Bowl-Wall Energy Relay

**Thesis:** Slope Launch is the combo-level expression of the Eternal tip wall-climb gimmick (Case 647) in which the player manually sends Hercules up the bowl wall after absorbing a hit, using the slope to accelerate the return attack rather than passively waiting for the gimmick to trigger; the sequence is (→↑J) — toward-wall, up-along-wall, then attack commit — representing the player consciously choosing to ride the wall during a lull, storing a modest amount of potential energy for a boosted return strike; unlike Archer Strike, where the triggering hit provides all the climbing energy, Slope Launch requires Hercules to have enough of its own velocity to reach a useful height — the player must time the input when Hercules is naturally near the rim, because a Slope Launch from the arena center will fail to contact the wall and fall back to a plain forward dash; the combo has a binary outcome: if Hercules reaches the wall, the descent provides a ×1.40 velocity boost on the return attack with a 1.35× damageMultiplier; if Hercules does not reach the wall (input mistimed, too far from rim), the combo falls back to a 600-unit forward burst with only 1.10× damage — the player spent 15 power on a weaker dash; this wall-or-dash binary is the skill-expression element: players who read the arena correctly when Hercules is near the rim execute the full wall-return; players who mash it from center get the diminished fallback; typeRestriction is "defense" with partRequirement eternalTip, but any wallAdhesion tip can attempt it at slightly reduced wall-retention efficiency.

### Combo Specification

```
Slope Launch — combo definition:

  id: "slope-launch"
  sequence: ["moveRight", "moveUp", "attack"]  (→↑J, resolved to wall direction at input time)
  windowMs: 350
  cooldownMs: 1800
  powerCost: 15
  typeRestriction: "defense"
  partRequirement: eternalTip  (OR any wallAdhesion: true tip)

  Phase 1 — "slope_approach" (→ input):
    boost toward nearest wall: +500 eu in wall direction
    if already within 80px of wall: skip to Phase 2 immediately

  Phase 2 — "slope_climb" (↑ input):
    if reached wall:
      climbDurationMs: 60ms
      h_apex: computed from current wall-parallel velocity (Case 647 formula, no amplification)
      typical h_apex: 8–18mm at combo scale  [INFERRED]
    if did NOT reach wall: no climb — Phase 3 will use fallback path

  Phase 3 — "slope_return" (J input):
    if wall_climbed:
      v_return = √(2 × g × h_apex × 0.95) × 1.40  (velocity boost × 1.40)
      returnImpulse: 1000–1800 eu  [INFERRED — scales with h_apex]
      damageMultiplier: 1.35×
      directionTarget: nearest opponent (return path from wall angle)
      lockMs: 60
    if NOT wall_climbed (fallback):
      forward dash: 600 eu, damageMultiplier: 1.10× only
      (power cost still consumed — skill penalty for bad timing)

  ceiling compliance (wall branch):
    damageMultiplier 1.35× ≤ 1.5×   ✓
    lockMs 60ms ≤ 300ms              ✓
    no invulnerability               ✓
    no AoE                           ✓
    velocityBoost from PE → KE (physics-derived, not free energy)  ✓

  ceiling compliance (fallback branch):
    damageMultiplier 1.10× ≤ 1.5×   ✓  (all limits met)
```

```typescript
function applySlopeLaunch(bey: Beyblade, opponents: Beyblade[]): void {
  const wallDir = nearestWallDirection(bey);
  applyForce(bey.id, wallDir.x * 500, wallDir.y * 500);
  const reachedWall = distanceToWall(bey) < WALL_CLIMB_TRIGGER_DIST;
  let h_apex = 0;
  if (reachedWall) {
    const v_wall = dotProduct({ x: bey.vx, y: bey.vy }, wallTangent(bey));
    h_apex = Math.max(0, (v_wall * v_wall) / (2 * G * (1 + MU_ET * COT_BOWL)));
  }
  if (reachedWall && h_apex > 0.005) {
    const v_return = Math.sqrt(2 * G * h_apex * 0.95) * 1.40;
    const returnDir = directionToNearest(bey, opponents);
    applyForce(bey.id, returnDir.x * v_return * bey.mass / ENGINE_TO_SI,
                       returnDir.y * v_return * bey.mass / ENGINE_TO_SI);
    bey.damageMultiplierActive = 1.35;
    bey.damageMultiplierExpiresAt = Date.now() + 200;
  } else {
    const fwd = facingDirection(bey);
    applyForce(bey.id, fwd.x * 600, fwd.y * 600);
    bey.damageMultiplierActive = 1.10;
    bey.damageMultiplierExpiresAt = Date.now() + 150;
  }
}
```

---

## Case 650 — [GIMMICK] VariAres 4D Metal Wheel Centrifugal PC Frame Retraction and Delta Drive Pre-Battle Tip Selection: Spin-Speed Auto-Mode Change and Contact-Point Architecture

**Thesis:** VariAres carries two mechanically independent gimmick layers that define its battle behavior: (1) the Delta Drive (D:D) bottom, a pre-battle manual tip selector offering three fixed-geometry contact options — Sharp (r=0.3mm, stamina), Wide Ball (r=4mm, balance), and Flat (r=8mm, attack) — chosen before launch and mechanically locked as the default for the whole match; and (2) the VariAres 4D Metal Wheel, which contains a centrifugally actuated PC (Polycarbonate) Frame that automatically retracts or extends based on current spin speed, creating a continuous in-battle mode transition at critical angular velocity omega_c approx 120 rad/s [Case 276]; the D:D tip selection sets the foundational floor behavior: Sharp (r=0.3mm) gives P=mg/(pi*r^2)=0.040*9.81/(pi*(3e-4)^2)=1.39e6 Pa — very high pressure, stamina-oriented, minimal floor drag; Wide Ball (r=4mm) gives P=7.79e4 Pa — medium, balance-type, curved surface reduces lateral friction; Flat (r=8mm) gives P=1.94e4 Pa — low pressure, full ABS face, maximum lateral traction for self-propelled attack arcs; the PC Frame retraction gimmick runs independently: above omega_c=120 rad/s centrifugal force on the PC Frame outboard mass (m_PC approx 1.5g at r_PC=18mm) produces F_c=m_PC*omega^2*r_PC=0.0015*(120)^2*0.018=0.389 N, which exceeds the spring threshold F_spring approx 0.38N [Case 276], retracting the PC Frame and exposing metal tips (Attack Mode, COR_metal approx 0.93); below omega_c the spring extends the PC Frame outward, covering metal tips with polycarbonate (Defense Mode, COR_PC approx 0.72), dampening impacts at near-spinout; the critical mechanic that separates the passive gimmick from the special-move and combo layers: during normal play the D:D tip mode is fixed at the pre-battle selection, and the PC Frame switches automatically based on spin speed — but special moves can temporarily override both the D:D tip selection AND force the PC Frame to a chosen state regardless of spin speed, returning all settings to their pre-battle and spin-speed-natural states after the move expires; combos can similarly make a brief override of both systems (what would otherwise require stopping and changing the pre-battle selector) for the window of the combo, reverting afterward.

### D:D Tip Geometry and Floor Behavior

```
Delta Drive (D:D) — pre-battle configurations  [Case 277]:

  SHARP mode (r = 0.3 mm):
    contact pressure:  P = 1.39e6 Pa  (stamina)
    mu_eff:            ~0.17 (ABS point)
    floor behavior:    minimal drag, spin preserved, near-zero lateral force
    best for:          stamina, endurance, ring-out avoidance

  WIDE BALL mode (r = 4 mm):
    contact pressure:  P = 7.79e4 Pa  (balance)
    mu_eff:            ~0.12 (curved surface, partial contact)
    floor behavior:    moderate drag, ball geometry allows quick pivots
    best for:          balance, defensive positioning, approach deflection

  FLAT mode (r = 8 mm):
    contact pressure:  P = 1.94e4 Pa  (attack)
    mu_eff:            0.17 (full-face ABS)
    floor behavior:    high lateral traction, self-propelled arcs via
                       off-center yaw torque tau = F * r_offset
    best for:          attack, aggressive repositioning, orbit-to-strike

  PRE-BATTLE DEFAULT: D:D mode fixed at launch. Not self-adjusting.
  SPECIAL MOVE: can temporarily override D:D to any mode (returns after move expires).
  COMBO: can briefly override D:D mode (returns after combo window expires).
```

### VariAres PC Frame Auto-Transition

```
VariAres Metal Wheel centrifugal PC Frame retraction  [Case 276]:

  F_c(omega) = m_PC * omega^2 * r_PC = 0.0015 * omega^2 * 0.018

  omega = 100 r/s: F_c = 0.270 N < F_spring  -> Defense Mode (PC Frame extends)
  omega = 120 r/s: F_c = 0.389 N ~ F_spring  -> transition threshold
  omega = 200 r/s: F_c = 1.080 N > F_spring  -> Attack Mode (PC Frame retracts)
  omega = 600 r/s: F_c = 9.720 N             -> strongly retracted
  [CALCULATED from Case 276 parameters]

  ATTACK MODE (omega > 120 rad/s):    PC Frame retracted, metal tips exposed
    COR_contact = 0.93  (hard metal, low deformation loss)
    damage per hit: HIGH

  DEFENSE MODE (omega < 120 rad/s):   PC Frame extended, covers metal tips
    COR_contact = 0.72  (PC polycarbonate dampening layer)
    damage per hit: ~78% of Attack Mode  (COR ratio 0.72/0.93)

  omega_c = 120 rad/s = 6% of Burst omega_0.
  Attack Mode covers ~94% of spin-life; Defense Mode at near-spinout.

  SPECIAL MOVE: can force PC Frame to any state regardless of omega.
  COMBO: can briefly force partial PC Frame extension.
  Both return to spin-speed-automatic after expiry.
```

---

## Case 651 — [SPECIAL MOVE] Ares Shield: King / Variares D:D (Beyblade Metal Fury)

**Franchise Move:** Variares switches to defense mode as Ares protects itself with a shield from powerful attacks, defending from all directions. Used against Eonis' Burst Satellite in the Destroyer Dome. [Beyblade Metal Fury / 4D]

**Thesis:** Ares Shield is the anime transcendence of the VariAres gimmick (Case 650) in which the player activates a full-system Defense Mode override that simultaneously forces the PC Frame to extend (Defense Mode, COR_PC=0.72) and temporarily switches the D:D tip from its pre-battle selection to Wide Ball (r=4mm) for maximum positional stability during the shield — the Wide Ball's curved contact provides better lateral resistance to ring-out impulses than a flat tip, and its moderate friction keeps Variares anchored in its shield stance; after the shield expires, both systems return: PC Frame reverts to spin-speed-natural (centrifugal-governed), and D:D reverts to the pre-battle selected tip; the Ares BeySpirit amplifies the PC Frame's polycarbonate elastic absorption into a full omnidirectional deflection barrier: at physics level, PC polycarbonate absorbs approximately (1 - COR_PC^2) = 1 - 0.72^2 = 48.2% of each collision's kinetic energy before it reaches the metal wheel — Ares Shield anime-expands this absorption into near-total deflection with the absorbed energy re-emitted as a directional shield burst, returning a fraction of every incoming impulse directly at the attacker; the game-design principle — defensive moves force opponents to attack — is realized as a must_attack force state combined with a passive spin-drain aura from the extended PC Frame's boundary layer: heavier hits have higher reflection fractions (the PC Frame resistance scales with impact force via viscoelastic behavior — harder hits compress the PC layer deeper into its nonlinear elastic region, recovering more energy as rebound); this creates the Ares Paradox: maximum-power single strikes return more force to the attacker than light hits, so sustained medium-force hits targeting the 3-hit saturation QTE is the only reliable counter.

### Phase Structure

```
Ares Shield — phase sequence:

Phase 1 — "ares_arming" (300ms):
  D:D tip: override to Wide Ball (r=4mm, stability stance)
  PC Frame: forced to Defense Mode (extended) regardless of omega
  incomingDamageReduction: 0.40x during arm
  visual: PC Frame expands outward, Ares spirit rises

Phase 2 — "ares_shield_active" (2500ms):
  D:D: Wide Ball active (lateral stability)
  PC Frame: Defense Mode locked (COR_contact = 0.72)
  reflectionFraction: 0.40 + (incomingImpulse / MAX_IMPULSE) * 0.20
    light hit (200 eu):   40% reflected; Variares takes 120eu * 0.72^2 = 62eu
    heavy hit (2000 eu):  60% reflected; Variares takes 800eu * 0.72^2 = 415eu
  forceState on opponents: must_attack, durationMs: 2500ms
  spinDrainRate: 5 rad/s/s on opponents within 150px (PC boundary layer)
  Variares spin recovery: +3 rad/s/s (PC elastic cycle return)

  QTE — "PC Saturate" (3 hits within 500ms window):
    success: 3rd hit reflection cut to 20%; Variares takes 0.60x damage
    fail (spread hits): full 40-60% reflection applies
    message: "Ares Shield broken" if 3 consecutive hits land

Phase 3 — "ares_collapse" (200ms):
  if saturated: PC Frame partial retraction (50% — elastic fatigue)
  if natural expiry: PC Frame returns to spin-speed-automatic (omega governs)
  D:D: returns to PRE-BATTLE SELECTION in both cases
  visual: Ares spirit dissolves, PC Frame and tip snap back

powerCost: 100
cooldownMs: 4500
durationMs: 3000
NOTE: any beyblade can use Ares Shield; no part restriction for special moves.
```

### Reflection Scaling

```
Ares Shield — hit table:

  Incoming   Reflect%   Returned to attacker   Variares takes
  ─────────────────────────────────────────────────────────
  200 eu     40%        80 eu                  62 eu
  500 eu     45%        225 eu                 142 eu
  1000 eu    50%        500 eu                 259 eu
  2000 eu    60%        1200 eu                415 eu
  [0.72^2 = 0.518; COR_PC^2 energy retention applied to non-reflected portion]

  Ares Paradox: heavier hit -> higher reflection -> attacker self-damages more.
  Optimal counter: medium force (400-600eu), sustained to 3-hit QTE break.
```

```typescript
interface AresShieldState {
  active: boolean;
  lastHitWindowStart: number;
  hitsInWindow: number;
}
function onAresShieldHit(variares: Beyblade, state: AresShieldState, hit: HitEvent): void {
  if (!state.active) return;
  const refl = Math.min(0.60, 0.40 + (hit.impulse / 20000) * 0.20);
  const now = Date.now();
  if (now - state.lastHitWindowStart > 500) { state.hitsInWindow = 0; state.lastHitWindowStart = now; }
  state.hitsInWindow++;
  const saturated = state.hitsInWindow >= 3;
  const finalRefl = saturated ? 0.20 : refl;
  const pcDamp = 0.72 * 0.72;
  const ang = Math.atan2(hit.attacker.y - variares.y, hit.attacker.x - variares.x);
  applyForce(hit.attacker.id, Math.cos(ang) * hit.impulse * finalRefl, Math.sin(ang) * hit.impulse * finalRefl);
  hit.attacker.damageReceived += BASE_DAMAGE * finalRefl;
  variares.damageReceived += BASE_DAMAGE * (hit.impulse / 2000) * (1 - finalRefl) * pcDamp;
  if (saturated) state.active = false;
}
function tickAresShield(variares: Beyblade, opponents: Beyblade[], dt: number): void {
  variares.spin = Math.min(variares.maxSpin, variares.spin + 3 * (dt / 1000));
  for (const opp of opponents) {
    if (distanceBetween(variares, opp) < 150) opp.spin = Math.max(0, opp.spin - 5 * (dt / 1000));
  }
}
```

---

## Case 652 — [COMBO] Frame Brace: Player-Skill Forced PC Frame Defense-Mode Activation with D:D Wide Ball Temporary Override

**Thesis:** Frame Brace is the combo-level expression of the VariAres gimmick (Case 650) in which the player manually forces a brief PC Frame extension AND temporarily switches the D:D tip to Wide Ball for the combo window — both changes that would normally require stopping the match to adjust; the combo's very identity as a combo (rather than a passive gimmick behavior) is that it makes this pre-battle-type mode change happen mid-match for 600ms, returning all systems to their pre-battle selections when the window expires; the sequence is (KKK — defense, defense, defense): three successive defensive inputs that incrementally counteract the centrifugal retraction force holding the PC Frame in Attack Mode — each K input applies a brief resistive load to the PC Frame pivot estimated at delta_F approx 0.06N per press, cumulatively bringing extension force from F_spring=0.38N to 0.56N, sufficient to extend the PC Frame against centrifugal load at mid-match spin (omega up to approx 600 rad/s = 30% of launch spin) — much lower than the passive gimmick's omega_c=120 rad/s; the physical effect: PC Frame extension reduces COR_contact from 0.93 to 0.72, meaning each hit delivers (1+0.72)/(1+0.93) = 1.72/1.93 = 0.891× of normal impulse — approximately 10.9% less delivered force; D:D temporarily held at Wide Ball mode provides lateral stability (r=4mm, mu_eff approx 0.12 curved surface) superior to Flat (which would drift away from stance) during the brace window; elastic recoil from each PC Frame absorbed hit returns +3 rad/s per hit as spin recovery (elastic energy not delivered as linear impulse re-emitted as angular momentum), for +6 rad/s total across two absorbed hits.

### Combo Specification

```
Frame Brace — combo definition:

  id: "frame-brace"
  sequence: ["defense", "defense", "defense"]  (KKK)
  windowMs: 450
  cooldownMs: 2000
  powerCost: 20
  typeRestriction: "defense"
  partRequirement: centrifugalModeWheel  (VariAres-class PC Frame 4D wheel)
    NOTE: combos require the part — gimmick is added to the part, not the beyblade

  D:D override during combo window:
    tipMode: "wideBall"  (r=4mm, mu_eff approx 0.12)
    reverts to: PRE_BATTLE_SELECTION after window expires

  Phase 1 (inputs 1-2): PC Frame partial extension
    forceExtension_ratio: 0 -> 0.60
    COR_effective: lerp(0.93, 0.72, 0.60) = 0.804
    impulse reduction: (1+0.804)/(1+0.93) = 0.935  (~6.5%)

  Phase 2 (3rd input — brace locked, 600ms):
    COR_effective: 0.72  (full Defense Mode)
    impulse reduction per hit: 10.9%
    hits protected: 2
    spin recovery: +3 rad/s per absorbed hit  (max +6 rad/s)
    invulnerabilityMs: 0  (dampening only, not blocking)
    reflectionMs: 0  (no reflection at combo tier)
    visual: PC Frame extends, wheel profile slightly wider; Wide Ball stance

  On expiry (after 600ms or 2 absorbed hits):
    PC Frame: returns to spin-speed-automatic (omega governs)
    D:D tip: returns to pre-battle selection
    visual: systems snap back to natural positions

  ceiling compliance:
    damageMultiplier: none (defensive)         [check]
    lockMs: 0                                  [check]
    invulnerabilityMs: 0                       [check]
    spinGain: +6 rad/s max (elastic recoil)    [check]
    impulse reduction: 10.9% (2 hits)          [check]
    AoE: none                                  [check]
```

---

*Cases continue with new franchise moves as provided.*

---
## Case 653 â€” [GIMMICK] 4D Outer-Rim Metal Wheel and X:D Wide-Disc Tip â€” Maximum Rotational Inertia, Ground Contact Pressure, and Gyroscopic Gravity Field

**Thesis:** The 4D system in Beyblade Metal Fury adds an outer metal rim to the standard MFB wheel body; the outer rim in the Diablo Nemesis configuration has estimated mass m_rim = 15 g at r_outer = 33 mm, contributing an additional rotational inertia of I_rim = m_rim Ã— r_outerÂ² = 0.015 Ã— (0.033)Â² = 1.634 Ã— 10â»âµ kgÂ·mÂ² [CALCULATED], bringing the total rotational inertia to I_4D = I_body + I_rim = 7.308 Ã— 10â»â¶ + 1.634 Ã— 10â»âµ = 2.365 Ã— 10â»âµ kgÂ·mÂ² [CALCULATED], which is 3.23Ã— the standard MFB I_total from CS10 Case 545; the Diablo Nemesis assembly mass is estimated at m_4D = 0.060 kg [ESTIMATED â€” 4D beyblades are measurably heavier than the 0.040 kg MFB standard]; the gyroscopic angular momentum at launch is L = I_4D Ã— Ï‰â‚€ = 2.365 Ã— 10â»âµ Ã— 600 = 1.419 Ã— 10â»Â² kgÂ·mÂ²/s [CALCULATED], which is 3.23Ã— the standard bey's angular momentum â€” this means any lateral torque applied to Nemesis produces a precessional response 3.23Ã— more resistive to translational displacement compared to a standard bey; the X:D (Xtreme Defense) performance tip is a wide flat-disc tip with outer radius r_XD â‰ˆ 8 mm, giving a contact area A_XD = Ï€ Ã— (0.008)Â² = 2.01 Ã— 10â»â´ mÂ² versus the standard ball tip area of approximately 2.83 Ã— 10â»âµ mÂ²; the contact pressure is P_XD = m_4D Ã— g / A_XD = 0.060 Ã— 9.81 / 2.01 Ã— 10â»â´ = 2930 Pa [CALCULATED] â€” lower pressure per unit area than a sharp tip (which concentrates force) but the total friction force is larger: F_friction = Î¼_ABS Ã— m Ã— g = 0.17 Ã— 0.060 Ã— 9.81 = 0.100 N [CALCULATED], compared to 0.0668 N for a standard 0.040 kg bey, representing a 49.7% higher friction floor resistance; the 4D outer rim also generates a substantially larger aerodynamic outflow than a standard AR: v_rim = Ï‰ Ã— r_outer = 600 Ã— 0.033 = 19.8 m/s, and the radial wind force at d = 50 mm is F_wind = Â½ Ã— 1.225 Ã— (19.8 Ã— 0.033/0.050)Â² Ã— 1.96 Ã— 10â»Â³ = 0.205 N [CALCULATED], larger than the Expand Frame's 0.188 N (Case 635) due to the larger outer radius; together the 3.23Ã— gyroscopic resistance, the 49.7% higher friction force, and the 0.205 N aerodynamic proximity push constitute a physical "gravity field" â€” opponents near Nemesis feel its unusual rotational mass as a combination of unpredictable recoil direction (gyroscopic precession), ground resistance, and aerodynamic push, all of which the Armageddon special move amplifies to anime scale.

### 4D Inertia and Field Profile

```
Diablo Nemesis 4D vs Standard MFB â€” property comparison:

  Property            Standard MFB     4D Nemesis       Ratio
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  Mass                0.040 kg         0.060 kg         1.50Ã—
  I_total             7.31e-6 kgÂ·mÂ²    2.37e-5 kgÂ·mÂ²    3.23Ã—
  Gyroscopic L        4.38e-3 kgÂ·mÂ²/s  1.42e-2 kgÂ·mÂ²/s  3.23Ã—
  Friction force      0.0668 N         0.100 N          1.50Ã—
  Rim wind at 50mm    0.041 N          0.205 N          5.0Ã—
  [CALCULATED]

  What 3.23Ã— gyroscopic moment means in practice:
    Opponent hit at v = 1.0 m/s deflects Standard MFB by ~12 px
    Same hit deflects 4D Nemesis by ~4 px  (3Ã— less)
    Nemesis appears "rooted" â€” precesses rather than translates
    This is the physical "increased weight" Armageddon amplifies

  Aerodynamic proximity field:
    d = 30mm: 0.567 N  (overwhelming at close range)
    d = 50mm: 0.205 N
    d = 80mm: 0.080 N
    d = 100mm: 0.051 N
    [CALCULATED â€” inverse-square falloff from outer rim]
```

### Passive Game Mechanic

```
4D gimmick passive properties:

  inertiaClass: "4D_heavy"
  gyroscopicResistance: 3.23Ã—  (multiplier on displacement-per-impulse reduction)
  proximityField: { radius: 120px, forceCoeff: NEMESIS_AERO_K }
  frictionFloor: 0.100  (vs 0.0668 standard)

  On each incoming hit:
    effectiveDisplacement = normalDisplacement / gyroscopicResistance
    // Nemesis barely moves â€” most impulse becomes precessional tilt, not translation

  Each tick for opponents within 120px:
    F_push = NEMESIS_AERO_K / distanceÂ²
    applyForce(opponent.id, radialOutward Ã— F_push Ã— dt)
```

---

## Case 654 â€” [SPECIAL MOVE] Armageddon: Rago / Diablo Nemesis X:D (Beyblade Metal Fury)

**Franchise Move:** Rago creates a fissure of darkness to engulf and destroy opponents; Diablo Nemesis emits purple-black flames, the environment becomes heavy, the floor cracks, proximity damage scales with distance, and a final shockwave releases when the flames expire. [Beyblade Metal Fury]

**Thesis:** Armageddon is the anime transcendence of the 4D heavy-inertia gravity field gimmick (Case 653) amplified into an area-denial field that converts Nemesis' passive gyroscopic dominance into an active zone that taxes all opponents regardless of whether they choose to engage; physically the gimmick creates a 0.205 N aerodynamic push at 50 mm and a 3.23Ã— displacement resistance, but the special move projects these properties outward as a full 200 px proximity damage field â€” the "darkness" is the visual expression of the kinetic energy field that surrounds a sufficiently massive and fast-spinning gyroscope, and the "floor cracks" are the expression of the X:D tip's 2930 Pa ground pressure amplified by the NEMESIS_WEIGHT_FACTOR = 3.0 that the special applies to Nemesis' effective collision mass during the window; the force state is `must_leave_zone` because the proximity field deals escalating damage proportional to (1 âˆ’ d/200)Â² â€” an opponent standing at d = 100 px takes 25% of the maximum rate, at d = 50 px takes 56%, and at d = 0 px (direct adjacency) takes 100% â€” meaning the only productive strategy is to flee outside the 200 px radius, but then Nemesis recovers spin passively while the opponent is pushed to the ring edge where a ring-out threat emerges; the shockwave at the end is the final release of the stored field energy: when the dark flames expire the entire accumulated aerodynamic field pressure is released as a single radial pulse that travels outward and pushes all remaining opponents toward the ring boundary; the QTE for the opponent is a "field sprint" â€” any opponent who exits the 200 px radius within the first 800 ms of Phase 2 avoids the worst attrition, but the shockwave still hits them at Phase 3; the opponent must leave early AND be at maximum distance when the shockwave fires to minimize total damage taken.

### Phase Structure

```
Armageddon â€” phase sequence:

Phase 1 â€” "infernal_ignition" (200ms):
  windUpMs: 200
  effects:
    NEMESIS_WEIGHT_MULT activates: effective mass = 3.0Ã— in collisions
    incomingDamageReduction on Nemesis: 0.40Ã—
    visual: purple-black flames rise from X:D tip, spread outward

Phase 2 â€” "gravitational_fissure" (2500ms):
  fieldRadius: 200px
  effects per tick:
    Proximity damage: D_prox = BASE_DAMAGE Ã— 0.8 Ã— (1 - d/200)Â² per second
    Spin drain on opponents within 150px: âˆ’15 rad/s per second
    All collisions FROM Nemesis: impulse Ã— 3.0  (weight factor active)
    All collisions TO Nemesis: effectiveDisplacement Ã— (1/3.23)  (gyroscopic resistance)
    Nemesis spin recovery: +8 rad/s per second  (centered heavy gyroscope is efficient)
    visual: floor crack lines propagate outward at 50px per 500ms

  forceState on opponents: must_leave_zone, durationMs: 2500ms
  reasoning: staying inside the 200px radius â†’ continuous damage + spin drain;
             forced to the ring edge â†’ ring-out risk from final shockwave

  QTE â€” "Field Sprint":
    opponent exits 200px radius before t = 800ms â†’ avoids worst attrition phase
    opponent stays inside: takes full 2.5 second proximity damage at their distance

Phase 3 â€” "shockwave_release" (400ms):
  timing: fires when Phase 2 expires
  effects:
    Radial burst: 10000 eu at Nemesis center, falloff Ã— (1 âˆ’ d/300)
    Arena-spanning (300px radius)
    Pushes all opponents radially outward toward ring boundary
    After pulse: Nemesis 200ms settle (NEMESIS_WEIGHT_MULT deactivates â†’ brief vulnerability)
  visual: all flames collapse inward then explode outward in purple-black shockwave

powerCost: 100
cooldownMs: 5000
durationMs: 3100  (200 + 2500 + 400)
```

### Proximity Damage Scaling

```
Armageddon proximity damage â€” per second at 60 Hz tick rate:

  d = 0px   (adjacent):  rate = BASE_DAMAGE Ã— 0.8 Ã— 1.00 = 0.80 BASE/s
  d = 50px:              rate = BASE_DAMAGE Ã— 0.8 Ã— (0.75)Â² = 0.45 BASE/s
  d = 100px:             rate = BASE_DAMAGE Ã— 0.8 Ã— (0.50)Â² = 0.20 BASE/s
  d = 150px:             rate = BASE_DAMAGE Ã— 0.8 Ã— (0.25)Â² = 0.05 BASE/s
  d = 200px (boundary):  rate = 0  (safe zone boundary)
  [GAME-DERIVED]

  Over 2.5 second active phase at d = 100px: 0.50 BASE total  (half a base damage)
  Over 2.5 second active phase at d = 50px:  1.13 BASE total  (more than one base damage)

  Shockwave at d = 100px: 10000 Ã— (1 âˆ’ 100/300) = 6667 eu additional
  Shockwave at d = 200px: 10000 Ã— (1 âˆ’ 200/300) = 3333 eu

  Optimal opponent strategy: exit to d > 200px by t = 800ms,
  then brace for shockwave at maximum distance.
```

```typescript
function tickArmageddon(nemesis: Beyblade, opponents: Beyblade[], state: ArmageddonState, dt: number): void {
  if (state.phase !== "gravitational_fissure") return;
  nemesis.spin = Math.min(nemesis.maxSpin, nemesis.spin + 8 * (dt / 1000));
  for (const opp of opponents) {
    const d = distanceBetween(nemesis, opp);
    if (d < ARMAGEDDON_FIELD_R) {
      const ratio = 1 - d / ARMAGEDDON_FIELD_R;
      opp.damageReceived += BASE_DAMAGE * 0.8 * ratio * ratio * (dt / 1000);
      if (d < 150) opp.spin = Math.max(0, opp.spin - 15 * (dt / 1000));
    }
  }
}

function fireArmageddonShockwave(nemesis: Beyblade, opponents: Beyblade[]): void {
  for (const opp of opponents) {
    const d = distanceBetween(nemesis, opp);
    const impulse = 10000 * Math.max(0, 1 - d / 300);
    const angle = Math.atan2(opp.y - nemesis.y, opp.x - nemesis.x);
    applyForce(opp.id, Math.cos(angle) * impulse, Math.sin(angle) * impulse);
  }
}
```

---

## Case 655 â€” [COMBO] Dark Stance: Player-Skill Expression of the 4D Heavy-Inertia Mass Amplification

**Thesis:** Dark Stance is the combo-level expression of the 4D heavy-inertia gimmick (Case 653) in which the passive 3.23Ã— gyroscopic displacement resistance is briefly amplified further by player input to create a single heavy counter-strike from a near-stationary anchored position; the sequence is (â†“Jâ†“) â€” moveDown to settle into the bowl bottom, attack to deliver the weight-amplified strike, then moveDown again to re-anchor after the hit â€” representing the player consciously choosing to stop moving, commit Nemesis to a stationary high-pressure ground contact, and exploit the 4D mass for a retaliatory hit whose recoil pushes the attacker back harder than a standard contact; where the gimmick passively reduces Nemesis' own displacement per hit by 3.23Ã—, the combo additionally applies a MASS_BOOST = 1.5Ã— multiplier to Nemesis' effective mass in the outgoing collision only, increasing the attacker's recoil from the hit: J_recoil_on_attacker = m_eff Ã— COR Ã— v_contact = 0.060 Ã— 1.5 Ã— 0.67 Ã— v = amplified outgoing; the net effect is that an opponent who charges into a Dark Stance hit receives 50% more recoil than they would from a normal Nemesis contact â€” they come in expecting a heavy bey to be slow and punishable, but the anchored mass delivers a surprisingly forceful return; the two moveDown inputs are positional â€” each one moves Nemesis 20 px toward the bowl center, ensuring that the anchored position is as far from the ring boundary as possible before the weight-amplified hit can send the bey drifting, and the re-anchor after the hit damps residual velocity back toward center.

### Combo Specification

```
Dark Stance â€” combo definition:

  id: "dark-stance"
  sequence: ["moveDown", "attack", "moveDown"]  (â†“Jâ†“)
  windowMs: 400
  cooldownMs: 1800
  powerCost: 20
  typeRestriction: "defense"
  partRequirement: heavy4DDisc OR heavyWD  (needs above-threshold rotational inertia)

  Phase 1 (â†“): reposition 20px toward bowl center, spin +4 (settling gyroscope)
  Phase 2 (J): weight-amplified strike
    contactImpulse: DARK_STANCE_BASE (1400 eu) Ã— MASS_BOOST (1.5) = 2100 eu effective
    knockbackImpulse_on_attacker: 3200 eu  (amplified recoil â€” more than standard)
    damageMultiplier: 1.40Ã—
    lockMs: 80  (brief anchor â€” attacker briefly stopped at contact)
    Nemesis displacement: reduced by 3.23Ã— gyroscopic factor (barely moves on contact)
  Phase 3 (â†“): re-anchor â€” velocity damp (vx, vy Ã— 0.50), spin +4, reposition 20px center

  ceiling compliance:
    damageMultiplier 1.40Ã— â‰¤ 1.5Ã—   âœ“
    lockMs 80ms â‰¤ 300ms              âœ“
    no invulnerability               âœ“
    no AoE                           âœ“
    mass boost is gimmick-derived    âœ“
```

---

## Case 656 â€” [GIMMICK] WB Wide-Ball Floor Boundary-Layer Rankine Vortex: Ground-Level Spinning Air Funnel and Approach Deflection

**Thesis:** The Wide Ball (WB) performance tip has an outer radius r_WB â‰ˆ 6 mm, noticeably larger than the standard Ball tip's r_ball â‰ˆ 3 mm, and this wider contact profile co-rotates a larger air patch against the stadium floor; at launch spin Ï‰â‚€ = 600 rad/s, the air layer at radius r_WB = 6 mm has tangential velocity v_core = Ï‰â‚€ Ã— r_WB = 600 Ã— 0.006 = 3.6 m/s [CALCULATED], and the total circulation of this floor vortex is Î“ = 2Ï€ Ã— r_WBÂ² Ã— Ï‰â‚€ = 2Ï€ Ã— (0.006)Â² Ã— 600 = 0.1357 mÂ²/s [CALCULATED]; outside the co-rotating core the vortex follows the irrotational Rankine profile: v_Î¸(r) = Î“ / (2Ï€ Ã— r) = 0.0216 / r, giving tangential velocities of 0.720 m/s at r = 30 mm, 0.432 m/s at r = 50 mm, and 0.216 m/s at r = 100 mm [CALCULATED]; for an opponent beyblade approaching Wyvern at v_approach = 0.80 m/s from 100 mm distance, the crosswind from the vortex at that radius is v_Î¸ = 0.216 m/s, deflecting the approach trajectory by Î¸_deflect = arctan(0.216/0.80) = 15.1Â° [CALCULATED]; at 50 mm the deflection reaches arctan(0.432/0.80) = 28.4Â° [CALCULATED] â€” meaning a close-range aimed attack arrives nearly 30Â° off-center; the vortex also creates a mild spin-transfer effect on nearby opponents: the air layer's tangential velocity at the opponent's AR radius creates a differential surface drag that opposes the opponent's AR rotation, producing a passive spin drain of approximately 1.5 rad/s per second at d = 50 mm and 0.5 rad/s per second at d = 100 mm [ESTIMATED]; wider ball tip versus standard ball: the 2Ã— radius increase gives a 4Ã— larger vortex core area and a 4Ã— larger circulation Î“, meaning WB's vortex floor effect is approximately 4Ã— stronger than a standard ball tip's; this forms the physical foundation of Arrow Tornado â€” the WB vortex at normal scale deflects aimed attacks by 15â€“28Â° and passively drains nearby spin, and the special move extends these effects to arena scale.

### Rankine Vortex Profile

```
WB floor vortex â€” velocity and deflection at key radii:

  Core (r <= 6mm): solid body rotation, v = Ï‰ Ã— r (max at rim = 3.6 m/s)
  Outside core: v_Î¸ = Î“/(2Ï€Ã—r) = 0.0216/r

  r = 10mm: v_Î¸ = 2.16 m/s   deflect vs v=0.8: arctan(2.16/0.8) = 69.6Â° (won't reach)
  r = 30mm: v_Î¸ = 0.720 m/s  deflect = 42.0Â°
  r = 50mm: v_Î¸ = 0.432 m/s  deflect = 28.4Â°
  r = 80mm: v_Î¸ = 0.270 m/s  deflect = 18.6Â°
  r = 100mm: v_Î¸ = 0.216 m/s deflect = 15.1Â°
  r = 150mm: v_Î¸ = 0.144 m/s deflect =  10.2Â°
  [CALCULATED â€” inverse falloff outside core]

  Passive spin drain:
    d = 50mm:  ~1.5 rad/s per second  [ESTIMATED]
    d = 100mm: ~0.5 rad/s per second  [ESTIMATED]

  Standard Ball tip comparison (r_ball = 3mm):
    Î“_ball = 2Ï€ Ã— (0.003)Â² Ã— 600 = 0.034 mÂ²/s  (4Ã— weaker)
    v_Î¸ at 100mm: 0.054 m/s â†’ deflect 3.9Â°  (barely noticeable)
    WB is specifically the tip that makes the tornado gimmick viable.
```

### Passive Game Mechanic

```
WB tip vortex â€” passive property:

  tipType: "wide_ball"  â†’ vortexActive: true

  Each physics tick:
    For each opponent within VORTEX_RANGE (200px game scale):
      r_mm = distance in mm
      v_theta = 0.0216 / (r_mm / 1000)  // in m/s
      // Apply crosswind force perpendicular to approach vector
      perp = perpendicular(normalize(opponent.velocity))
      crosswindForce = 0.5 * RHO_AIR * v_theta^2 * A_AR
      applyForce(opponent.id, perp Ã— crosswindForce Ã— dt)
      // Spin drain
      opponent.spin -= VORTEX_DRAIN_RATE * (1 / (distance/50)) * dt
```

---

## Case 657 â€” [SPECIAL MOVE] Arrow Tornado: Captain Arrow / Archer Wyvern 145WB (Beyblade Metal Masters)

**Franchise Move:** Wyvern creates a strong funnel of wind to attack the enemy Beyblade with overwhelming strength, uses the twister to disperse the opponent and deplete its spin power, then smashes with a powerful gust. [Beyblade Metal Masters]

**Thesis:** Arrow Tornado is the anime transcendence of the WB floor vortex gimmick (Case 656) in which the passive 15Â° approach deflection at 100 mm is amplified into an arena-spanning tornado field that extends the deflection to ARROW_DEFLECTION_ANGLE = 35Â° across the full stadium, creating a zone where no straight-line attack path reaches Wyvern unless the attacker explicitly accounts for the vortex curl; physically the gimmick deflects attacks by 15â€“28Â° depending on approach distance and attack speed â€” enough to cause misses at close range â€” and the special move essentially scales this to certainty: all attacks within the tornado field are deflected by at least 35Â° unless the attacker uses a precision "read the curl" input that pre-offsets their aim; the tornado also provides sustained spin drain at 12 rad/s per second within 150 px, and at 4 rad/s from 150â€“250 px, with Wyvern receiving a 6 rad/s per second spin recovery from the vortex feeding back into its own spin â€” the tornado is energetically self-sustaining at the spin level, meaning Wyvern does not pay a spin cost to maintain it; the force state is `cannot_attack_freely` because the vortex prevents reliable straight-line approaches â€” the opponent can still attack but only if they correctly read and compensate for the 35Â° deflection, which requires the "Read the Curl" QTE; if they input a straight-line attack, they arrive 35Â° off-center and deal no contact damage; the final gust (Phase 3) is the tornado's collapse: when the spin field expires, all the accumulated rotational air energy is released as a 360Â° radial pulse that pushes all opponents outward â€” the "powerful gust of fury" is the physical release of Î“ Ã— m_air Ã— v stored in the vortex throughout Phase 2.

### Phase Structure

```
Arrow Tornado â€” phase sequence:

Phase 1 â€” "tornado_formation" (500ms):
  Wyvern spin recovery: +10 rad/s  (gathering energy into vortex)
  Visual: funnel rises from WB tip, growing upward from floor

Phase 2 â€” "tornado_sustained" (3000ms):
  vortexRadius: 250px (full arena)
  ARROW_DEFLECTION_ANGLE: 35Â°  (amplified from physical 15.1Â° at 100mm)

  Approach deflection: ALL attack vectors within 250px are rotated 35Â°
    â†’ aimed attacks arrive 35Â° off-center â†’ reliably miss Wyvern
    â†’ exceptions: QTE "Read the Curl" (see below)

  Spin drain:
    within 150px: âˆ’12 rad/s per second
    150â€“250px:    âˆ’4 rad/s per second
  Wyvern recovery: +6 rad/s per second  (vortex self-sustains)

  forceState: cannot_attack_freely, durationMs: 3000ms
  reasoning: straight-line attacks fail; only "read the curl" attacks connect

  QTE for attacker â€” "Read the Curl":
    Pre-offset aim by 30â€“40Â° from Wyvern's position before attacking
    Correct offset: attack arrives on-target despite deflection
    Correct offset + attack within 200ms: also negates spin drain for that hit window
    Incorrect offset: standard deflection applies, attack misses

Phase 3 â€” "final_gust" (200ms):
  Radial 360Â° burst: 5000 eu at Wyvern center, Ã— (1 âˆ’ d/250) falloff
  Pushes all opponents toward ring boundary
  Visual: funnel collapses outward in expanding wave ring

powerCost: 100
cooldownMs: 4500
durationMs: 3700
```

```typescript
function applyArrowTornadoDeflection(target: Vector2, wyvern: Beyblade, attacker: Beyblade): Vector2 {
  const offset = attacker.qteReadCurlActive ? 0 : ARROW_DEFLECTION_ANGLE;
  const deflectRad = (offset * Math.PI) / 180;
  return {
    x: target.x * Math.cos(deflectRad) - target.y * Math.sin(deflectRad),
    y: target.x * Math.sin(deflectRad) + target.y * Math.cos(deflectRad),
  };
}
```

---

## Case 658 â€” [COMBO] Vortex Feint: Player-Skill Expression of the WB Floor Vortex Approach Deflection

**Thesis:** Vortex Feint is the combo-level expression of the WB floor vortex gimmick (Case 656) in which the passive 15Â° approach deflection is manually triggered as a brief defensive pulse that deflects a single incoming attack; the sequence is (â†’â†K) â€” moveRight, moveLeft, defense â€” representing Wyvern swaying side-to-side to generate a brief amplified air disturbance from the WB tip, then activating the guard on K to focus that disturbance forward; the two side-to-side inputs create a brief lateral oscillation that physically increases the WB contact patch's air-coupling momentarily â€” similar to how fanning an airstream concentrates it â€” producing a 250 ms deflection pulse at 12Â° instead of the passive 15.1Â° at 100 mm [INFERRED â€” slightly less than passive at same distance because the pulse is brief rather than sustained]; the deflection is not guaranteed to cause a miss: an opponent who already committed a slow-approach attack and is more than 150 px away at the time of the Vortex Feint may arrive close enough that the residual deflection still redirects them; an opponent in a fast approach at close range may partially avoid the deflection and still clip Wyvern; the counter window (200 ms) after the deflection represents the brief moment where Wyvern's vortex has just redirected the attacker and Wyvern can use the turbulence to its own advantage.

### Combo Specification

```
Vortex Feint â€” combo definition:

  id: "vortex-feint"
  sequence: ["moveRight", "moveLeft", "defense"]  (â†’â†K)
  windowMs: 350
  cooldownMs: 1600
  powerCost: 12
  typeRestriction: "balanced"  (WB tip is common on balanced types)
  partRequirement: wideBallTip

  effects:
    vortexPulseMs: 250  (deflection field active)
    DEFLECT_ANGLE_PULSE: 12Â°  (less than passive sustained â€” brief pulse)
    nextAttackDeflected: true  (flags the next incoming attack for deflection)
    lateralDodge: 20px in moveRight direction  (the side-to-side also moves Wyvern slightly)
    counterWindowMs: 200
    if attacker misses during window:
      counterImpulse: +600 eu if Wyvern attacks in window
      damageMultiplier: 1.25Ã—

  ceiling compliance:
    damageMultiplier 1.25Ã— â‰¤ 1.5Ã—   âœ“
    no invulnerability               âœ“
    no persistent zone               âœ“
    brief deflection â€” not guaranteed âœ“
```

---

## Case 659 â€” [GIMMICK] RDF Rubber Defense Flat High-Friction Spiral Orbit â€” Inward-Coiling Orbital Attack with Approach-Angle Accumulation

**Thesis:** The Rubber Defense Flat (RDF) performance tip has a rubber flat contact surface with Î¼_rubber = 0.50 [CS10 Case 545], giving a maximum lateral acceleration of a_lateral = Î¼ Ã— g = 0.50 Ã— 9.81 = 4.91 m/sÂ² [CALCULATED] â€” the highest lateral acceleration of any standard tip type; in an orbital attack configuration the bey spirals inward from a large initial orbit radius toward a smaller radius around the target, and the high rubber friction provides two key behaviors: first, at each orbital pass the bey approaches the target from a different angle because the spiral tightens by approximately Î”r â‰ˆ a_lateral Ã— T_orbitÂ² / (4Ï€) per half-orbit [INFERRED from spiral mechanics], where T_orbit is the current orbital period; for an initial orbit at r = 80 px (game scale â‰ˆ 33 mm) with v_orb = âˆš(Î¼ Ã— g Ã— r) = âˆš(0.50 Ã— 9.81 Ã— 0.033) = 0.403 m/s [CALCULATED] and T_orbit = 2Ï€ Ã— 0.033 / 0.403 = 0.515 s, each half-orbit tightens the radius by Î”r â‰ˆ 4.91 Ã— (0.515/2)Â² / (4Ï€) = 0.026 m = 26 mm [CALCULATED], which is enough to go from 80 px orbit to 27 px orbit in 3 half-orbits; second, the approach angle to the target changes by approximately 60Â° per half-orbit as the orbit tightens (geometric consequence of the inward spiral) [INFERRED], so after 3 orbits the attack is arriving from 180Â° opposite to the initial approach direction; the Death Quetzalcoatl 125 height track raises the AR contact zone compared to standard 105 or 100 tracks, making the AR-to-AR contact more likely during the coiling approach by ensuring the AR sweep height clears the target's AR at close orbit range; together the RDF spiral inward and the 125 track height create a beyblade that naturally coils around opponents for repeated angled contacts â€” each contact arriving from a different direction with the rubber tip maintaining orbital velocity efficiently through each pass.

### Spiral Orbit Geometry

```
RDF coiling orbit â€” radius and angle evolution:

  Initial: râ‚€ = 80px, v_orb = 0.403 m/s, T_half = 0.258 s

  Half-orbit 1 (approach from 0Â°):
    Î”r = 4.91 Ã— (0.258)Â² / (4Ï€) â‰ˆ 26mm â†’ râ‚ = 54px
    Approach angle to target: 0Â°  (initial heading)

  Half-orbit 2 (approach from ~60Â°):
    râ‚ = 54px, vâ‚ = 0.333 m/s, T_halfâ‚ = 0.255 s
    Î”râ‚ â‰ˆ 24mm â†’ râ‚‚ = 35px
    Approach angle: 60Â° from initial  [INFERRED â€” spiral geometry]

  Half-orbit 3 (approach from ~120Â°):
    râ‚‚ = 35px, vâ‚‚ = 0.269 m/s
    Approach angle: 120Â°  [INFERRED]

  At 3 full orbits (6 half-orbits):
    Orbit radius has shrunk from 80px to ~10px (near-collision orbit)
    Total approach angle rotation: ~360Â° (hit from all directions)
    Each hit arrives from a direction ~60Â° off the previous one
```

### Passive Game Mechanic

```
RDF gimmick:
  tipType: "rubber_defense_flat"
  movementStyle: "spiral_aggressive"
  spiralEnabled: true

  Each orbit: bey tightens radius by SPIRAL_DECAY (px per half-orbit)
  Each hit during spiral: registers as a "coil hit", increments coilCharge counter
  coilCharge is available to be consumed by Ascent Spark (Case 660) or
  converted to modest spin gain (+3 rad/s) on the next normal hit
```

---

## Case 660 â€” [SPECIAL MOVE] Ascent Spark: Tithi / Death Quetzalcoatl 125RDF (Beyblade Metal Masters)

**Franchise Move:** Quetzalcoatl utilizes the air and spins around in it until its beast appears and wraps around the opponent's beast and constricts the opponent's beast until it explodes. Coiling motion around the opponent with repeated hits; final stronger hit delivers all previous damage together in one tick. [Beyblade Metal Masters]

**Thesis:** Ascent Spark is the anime transcendence of the RDF spiral orbit gimmick (Case 659) in which the natural inward-coiling approach is directed specifically around a single target, each orbit accumulating damage in a charge pool rather than dealing full damage immediately, and then releasing the entire pool amplified in a single explosive constriction hit; physically the gimmick produces coiling orbits that approach the target from progressively different angles (60Â° rotation per half-orbit), and the special move uses this same trajectory to execute 3 full coiling orbits (6 hits, each at a new 60Â° angle offset from the last) with each individual hit deliberately scaled to COIL_HIT_FRACTION = 0.45 of normal damage so the stacked damage pool reaches approximately 2.7 BASE before the release multiplier; the ASCENT_RELEASE_MULT = 1.8Ã— then applies to the entire pool, giving a total release hit of 2.7 Ã— 1.8 = 4.86 BASE in a single tick â€” this exceeds what any individual hit could deal and also bypasses per-tick damage caps that govern normal combat, as the single concentrated burst is delivered in one physics step; the `must_stay_still` force state is applied because the coiling orbit tracks the target's current position on each pass â€” if the target moves, Quetzalcoatl adjusts the next orbit entry point to compensate, meaning movement does not help the opponent escape and actually risks giving Quetzalcoatl a wider approach angle for the next hit; the franchise description of the beast "constricting" the opponent is the anime expression of the tightening orbital radius (80 px â†’ 10 px over 3 orbits), and the "explosion" is the final dump of accumulated charge.

### Phase Structure

```
Ascent Spark â€” phase sequence:

Phase 1 â€” "ascent_coil" (1800ms â€” 3 full orbits):
  orbitRadiusStart: 80px, decays per half-orbit as per gimmick spiral
  hitsPerOrbit: 2  (one per half-orbit)
  totalCoilHits: 6  (3 full orbits Ã— 2 hits)
  perHitDamage: BASE_DAMAGE Ã— 0.45  (fraction â€” accumulates in pool)
  coilCharge: += hit.impulse Ã— 0.60 per hit  (stores kinetic contribution too)
  perHitImpulse: 600 eu  (reduced â€” the coil conserves rather than expends)
  approachAngleOffset: +60Â° per half-orbit
  forceState: must_stay_still, durationMs: 1800ms
    reasoning: orbit adjusts to target's position â€” movement doesn't help; QTE is break-the-coil

  QTE â€” "Break the Coil":
    window: 50ms as Quetzalcoatl approaches on each half-orbit
    successful disruption (3 taps): breaks coil early, no final release
    partial disruption (1-2 taps): coil continues, disrupted orbits skip their hit
    0 taps: full coil completes, all 6 hits land, full release fires

Phase 2 â€” "ascent_release" (200ms):
  singleHitDamage: sum(coilCharge) Ã— ASCENT_RELEASE_MULT (1.8Ã—)
  effective total: ~4.86 BASE at full 6-hit charge  (2.7 accumulated Ã— 1.8)
  impulse: 7000 eu  (concentrated burst)
  spinDelta on target: âˆ’80 rad/s  (constriction strips spin)
  knockbackImpulse: 7000 eu
  visual: Quetzalcoatl beast coils fully around opponent and bursts outward
  AoE: 0  (single target â€” the coil is focused)

powerCost: 100
cooldownMs: 5000
```

```typescript
function onAscent_CoilHit(bey: Beyblade, target: Beyblade, state: AscentState): void {
  state.coilCharge += BASE_DAMAGE * 0.45;
  state.coilImpulsePool += 600 * 0.60;
  const angle = bey.orbitAngle + state.halfOrbitCount * 60 * Math.PI / 180;
  applyForce(target.id, Math.cos(angle) * 600, Math.sin(angle) * 600);
  target.damageReceived += BASE_DAMAGE * 0.45;
  state.halfOrbitCount++;
}

function fireAscentRelease(bey: Beyblade, target: Beyblade, state: AscentState): void {
  const totalDamage = state.coilCharge * ASCENT_RELEASE_MULT;
  const releaseImpulse = state.coilImpulsePool + 7000;
  target.damageReceived += totalDamage;
  target.spin = Math.max(0, target.spin - 80);
  const angle = Math.atan2(target.y - bey.y, target.x - bey.x);
  applyForce(target.id, Math.cos(angle) * releaseImpulse, Math.sin(angle) * releaseImpulse);
}
```

---

## Case 661 â€” [COMBO] Coil Strike: Player-Skill Expression of the RDF Spiral Orbital Approach

**Thesis:** Coil Strike is the combo-level expression of the RDF spiral orbit gimmick (Case 659) in which the full 3-orbit coiling sequence of Ascent Spark is compressed to a single player-executed quarter-orbit arc that delivers one hit from a non-obvious angle; the sequence is (â†‘â†’J) â€” moveUp to begin an ascending orbit arc, moveRight to curve the orbit 90Â° around the nearest target, then attack to commit the hit at the 90Â° offset position â€” representing the player manually navigating Quetzalcoatl through one quarter of an inward spiral and striking from the target's flank; the skill is in the timing: the player must input â†’J at the correct moment to send the bey into the target from the 90Â° offset angle (the target's side, where their AR presents a narrower profile), and the result is a 1.25Ã— damageMultiplier from the flank-aspect bonus (the attacker's AR is not facing Quetzalcoatl); if the player inputs early or late, the approach angle is wrong and the attack lands from the front or back respectively â€” only the 80â€“100ms window where the arc is at 90Â° offset qualifies for the flank bonus; this is a higher-skill-ceiling version of the basic forward attack because it requires predicting the orbit timing while also managing the combo input window.

### Combo Specification

```
Coil Strike â€” combo definition:

  id: "coil-strike"
  sequence: ["moveUp", "moveRight", "attack"]  (â†‘â†’J)
  windowMs: 350
  cooldownMs: 1500
  powerCost: 15
  typeRestriction: "attack"
  partRequirement: rubberFlatTip OR highFrictionTip

  Phase 1 (â†‘): begin partial orbit arc â€” Quetzalcoatl arcs upward around target
  Phase 2 (â†’): curve 90Â° â€” if timed correctly (80â€“100ms after Phase 1), arrives at flank
    flankArrival: angle between Quetzalcoatl's approach and target's AR facing = 85â€“95Â°
    â†’ flankBonus: damageMultiplier 1.25Ã—
    if NOT timed correctly:
      frontArrival (< 80ms): normal hit, 1.0Ã— damageMultiplier (no bonus)
      rearArrival  (> 100ms): 1.10Ã— damage (rear aspect â€” minor bonus, no penalty)
  Phase 3 (J): commit strike
    contactImpulse: 900 eu
    damageMultiplier: as above (1.25Ã—/1.10Ã—/1.0Ã— depending on arrival timing)
    knockbackImpulse: 1400 eu

  ceiling compliance:
    damageMultiplier 1.25Ã— â‰¤ 1.5Ã—   âœ“
    lockMs: 0                         âœ“
    no invulnerability               âœ“
    no stacking                      âœ“
```

---

## Case 662 — [GIMMICK] Over Forge Disc Mass-Dominant Flywheel and Quattro Driver Attack-Mode Rubber Flat — Maximum Assembly Inertia Reservoir and High-Friction Orbital Attack Architecture

**Thesis:** Astral Spriggan Over Quattro-0 is built around two mechanically complementary gimmick systems documented in Cases 558-559: the Over Forge Disc (m=33.7g, I_Over=2.979e-5 kg*m^2, 57.2% of assembly I_total=5.212e-5 kg*m^2 [Case 559]) acting as a mass-dominant flywheel that stores angular momentum almost independent of the layer stack, and the Quattro Driver (m=10.6g, Case 558) providing a pre-battle four-mode tip selector with Attack mode (rubber flat r=4mm, mu=0.45) as its most aggressive configuration; the Over disc's dominance is the defining physics feature: at I_Over=2.979e-5 kg*m^2 being 57.2% of I_total, it functions as an orbital gyroscope whose angular momentum L_Over=I_Over*omega=2.979e-5*2000=5.958e-2 kg*m^2/s absorbs the vast majority of collision spin-transfer — when an opposing beyblade hits Astral Spriggan, the Joukowski spin-transfer fraction scales inversely with I_total, and with I_total=5.212e-5 (highest in the DB/BU series, surpassing Glide Ragnaruk by 42.5%), each collision strips only delta_omega=J*r/(I_total*(1+m_target/m_Spriggan)) — far less spin per hit than any lower-inertia assembly; the Quattro Attack mode (rubber flat r=4mm, mu=0.45, Case 558) provides the floor-grip component: friction force F=mu*mg=0.45*0.0779*9.81=0.344 N enables self-propelled orbital arcs where the rubber surface's high lateral traction steers Astral Spriggan into controlled approach trajectories around the arena, maintaining orbital speed despite the Over disc's high mass; these two gimmicks interact as flywheel-and-drive: the Over disc stores rotational energy that keeps the orbital speed high even after hits (high I means hits barely slow it), and the Quattro rubber flat converts that rotational energy into sustained lateral motion that drives the orbit; the Quattro's weak spring (k=0.60*standard [Case 558]) means burst resistance is below-average (burst threshold tau_driver approx 1.8 mN*m), representing the gimmick's trade-off: enormous stamina and orbital momentum at the cost of burst vulnerability when opponents land sustained pressure.

### Over Disc Inertia Dominance

```
Over Forge Disc [Case 559]:
  m_Over = 33.7 g
  r_inner = 13 mm, r_outer = 40 mm  (circular profile)
  I_Over = 0.5 * 0.0337 * (0.013^2 + 0.040^2) = 2.979e-5 kg*m^2

  Assembly I_total breakdown (Astral Spriggan Over Quattro-0):
  Component           Mass    I (kg*m^2)    % of I_total
  Blade Astral        11.8g   1.022e-5      19.6%
  DB Core Spriggan     7.9g   1.264e-6       2.4%
  Armor 0             13.9g   8.263e-6      15.9%
  Over (disc)         33.7g   2.979e-5      57.2%  <- dominant
  Quattro (driver)    10.6g   2.587e-6       5.0%
  TOTAL               77.9g   5.212e-5     100%
  [Case 559]

  Spin-transfer per hit (standard Joukowski):
  delta_omega = J*r / I_total
  At I_total=5.212e-5:  delta_omega = J*r / 5.212e-5
  At I_total=7.308e-6 (standard MFB):  delta_omega = J*r / 7.308e-6
  Ratio: 7.308/52.12 = 0.140  -> Astral Spriggan loses 86% LESS spin per hit
  than a standard MFB assembly at the same impulse [CALCULATED]
```

### Quattro Attack-Mode Floor Grip

```
Quattro Driver — Attack Mode [Case 558]:
  tip type:  rubber flat, r = 4 mm, mu = 0.45
  floor friction force: F = 0.45 * 0.0779 * 9.81 = 0.344 N
  spin decay (Attack mode): dω/dt = -(0.45 * 0.0779 * 9.81 * (2*0.004/3)) / 5.212e-5
                           = -(0.344 * 2.667e-3) / 5.212e-5 = -17.60 rad/s^2
  battle time (Attack mode, omega_0=694 rad/s): t = 694/17.60 = 39.4 s
  [ESTIMATED, using DB/BU omega_0; Attack mode is the aggressive, short-battle mode]

  Quattro modes (pre-battle selection, same rules as D:D — Case 277 analogy):
    Attack  (rubber flat r=4mm, mu=0.45):  high grip, orbital attack, 39.4s endurance
    Defense (free-spin metal ball mu=0.02): very low friction, 355s endurance [Case 559]
    Stamina (metal sharp r=1.5mm):          minimal friction, 315s endurance [Case 559]
    Balance (combined):                     intermediate behavior

  Weak spring: k = 0.60 * standard [Case 558]
  tau_burst_driver approx 1.8 mN*m (combined with layer tau_burst = 7.0 mN*m -> 8.8 mN*m total)
  TRADE-OFF: maximum inertia stamina, below-average burst resistance

  Gimmick synergy:
  Over disc (57.2% of I) ensures orbital speed persists through hits;
  Quattro rubber flat converts rotational energy into sustained lateral orbits;
  Together: Astral Spriggan circles opponents at sustained speed,
            arriving with full angular momentum on each contact pass.
```

---

## Case 663 — [SPECIAL MOVE] Astral Spark: Shu Kurenai / Astral Spriggan Over Quattro-0 (Beyblade Burst Surge)

**Franchise Move:** Set in Right-Spin Mode, Astral Spriggan builds up speed and delivers multiple strikes to the opposing Beyblade. Images show multiple lightning bolt discharges from a central orbital path (purple ring). [Beyblade Burst Surge]

**Thesis:** Astral Spark is the multi-strike expression of the Over disc angular momentum reservoir and Quattro Attack-mode rubber orbital gimmick (Case 662); where the gimmick passively converts rotational energy into orbital approach speed, the special move temporarily switches Quattro to Attack mode regardless of pre-battle selection, commits the full Over disc angular momentum to a 3-orbit wind-up spiral, and discharges that accumulated orbital momentum as 2+CHARGE rapid-fire lightning bolt strikes (up to 5), each firing from a different orbital angle at 100ms intervals; the ORBITAL_CHARGE system models the Over disc's angular momentum accumulation: each completed tight orbit at r=150px increases ORBITAL_CHARGE by 1 (maximum 3 charges in 1000ms), representing successive laps where Quattro rubber flat grip keeps orbital speed high while Over disc inertia ensures each lap completes faster than the last (less spin lost per orbit = more orbital KE available for the strike); the 5-strike carousel (72 degrees between each strike) physically represents Astral Spriggan using the orbital ring as a multi-angle attack platform — each lightning bolt fires from a different point on the orbital circle, making systematic evasion require 5 consecutive perfect dodge inputs within 400ms; per-strike power scales with ORBITAL_CHARGE because more completed orbits = more Over disc momentum converted to linear orbital velocity before discharge; after Astral Spark resolves, Quattro returns to pre-battle selection.

### Phase Structure

```
Astral Spark — phase sequence:

Phase 1 — "orbital_wind_up" (1000ms, 3 orbits at r=150px):
  Quattro: temporarily set to Attack mode (rubber flat mu=0.45)  [special override]
  ORBITAL_CHARGE: +1 per completed orbit  (max 3)
  Over disc momentum: sustains orbital speed through each orbit
  no hits during wind-up
  visual: purple orbital ring brightens per orbit

Phase 2 — "astral_discharge" (400ms, rapid-fire strikes):
  strikeCount: 2 + ORBITAL_CHARGE  (range: 3-5 strikes)
  strikeIntervalMs: 100
  per-strike angle: carousel (360 / strikeCount degrees apart)
  per-strike impulse: 1200 * (0.5 + ORBITAL_CHARGE * 0.25) eu
    charge=1: 900eu  charge=2: 1050eu  charge=3: 1200eu
  per-strike damageMultiplier: 1.30 + ORBITAL_CHARGE * 0.10  (1.3-1.6x)
  spinDelta per strike: -80 * (1 + ORBITAL_CHARGE * 0.15)
  forceState: must_stay_still  (5-angle barrage; dodging one aims into next)

  QTE — "Strike Reading":
    per-strike dodge window: 150ms  (direction visible from orbital approach)
    5 successful dodges: full avoidance possible but demanding
    miss: standard damage applies

  total at max charge (5 strikes * 1.6x): 8.0 BASE_DAMAGE
  total at min charge (3 strikes * 1.3x): 3.9 BASE_DAMAGE

Phase 3 (expiry): Quattro returns to PRE-BATTLE selection.

powerCost: 100
cooldownMs: 4500
NOTE: any beyblade can use Astral Spark; no part restriction for special moves.
```

---

## Case 664 — [SPECIAL MOVE] Astral Whip: Shu Kurenai / Astral Spriggan Over Quattro-0 (Beyblade Burst Surge)

**Franchise Move:** Utilizing speed built up with the Quattro Driver in Right-Spin Attack Mode, Astral Spriggan strikes the opposing Beyblade with the metal blades on the Astral Blade, dealing massive damage. Image shows an explosive white flash at point of contact. [Beyblade Burst Surge]

**Thesis:** Astral Whip is the single-strike finishing expression of the same Over disc + Quattro gimmick (Case 662) that contrasts directly with Astral Spark: where Spark distributes ORBITAL_CHARGE across 3-5 moderate-power strikes, Whip performs 4 tight orbits at r=80px — a radius where Quattro Attack-mode rubber flat grip (mu=0.45) must sustain higher centripetal force while the Over disc's massive I=2.979e-5 kg*m^2 provides the angular momentum needed to keep orbital speed from collapsing under the tighter radius — then converts ALL accumulated Over disc orbital momentum into a single Astral Blade metal-edge contact; the physics of the single-discharge: after 4 tight orbits at r=80px, orbital speed v_orb=sqrt(mu*g*r)=sqrt(0.45*9.81*0.033)=0.382 m/s [CALCULATED at gimmick level with Attack mode mu], but the Over disc's angular momentum 5.958e-2 kg*m^2/s at launch has been sustaining this orbit for 4 laps, and all of that L_Over is directed into a single metal-blade contact (Astral Blade, COR_metal=0.93 vs standard ABS COR=0.67) — the (1+COR_metal)/(1+COR_ABS) = 1.93/1.67 = 1.156 impulse amplification from metal contact on top of the orbital KE concentration gives the highest single-contact impulse in the Astral Spriggan move set; the WHIP_AMPLIFY=3.5x represents: tight orbital radius concentration + 4-orbit momentum build + metal blade COR amplification; after Astral Whip resolves, Quattro returns to pre-battle selection.

### Phase Structure

```
Astral Whip — phase sequence:

Phase 1 — "whip_spiral" (700ms, 4 tight orbits at r=80px):
  Quattro: temporarily set to Attack mode (special override; returns after)
  Over disc: angular momentum sustained through 4 tight orbits
  no hits during wind-up
  visual: tight bright spiral close to Spriggan center, sparks intensify

Phase 2 — "astral_blade_strike" (80ms, single contact):
  bladeImpulse: 9000 eu  (WHIP_AMPLIFY 3.5x applied to orbital base)
  damageMultiplier: 2.8x  (Over disc orbital KE + Astral Blade metal COR)
  spinDelta on target: -110 rad/s
  knockbackImpulse: 11000 eu
  burst_threshold_modifier: +0.15  (metal blade increases burst chance)
  forceState: must_stay_still  (single massive hit; stuns on connection)

  QTE — "Spiral Dodge":
    windowMs: 250  (single window for the whole spiral approach)
    dodge success (move >150px from Spriggan): whip misses
      Spriggan carries past, 200ms vulnerable window
    dodge fail: full 9000eu + 2.8x damage
    stun: 400ms on full hit

  high-risk/high-reward:
    miss:  Spriggan briefly exposed
    hit:   highest single-contact damage in the move set

Phase 3 (expiry): Quattro returns to PRE-BATTLE selection.

powerCost: 100
cooldownMs: 5000
NOTE: any beyblade can use Astral Whip; no part restriction for special moves.
```

---

## Case 665 — [COMBO] Spark Rush: Player-Skill Expression of the Over Disc Orbital Momentum and Quattro Attack-Mode Rubber Grip

**Thesis:** Spark Rush is the combo-level expression of the Over disc flywheel + Quattro Attack-mode gimmick (Case 662) in which the player manually switches Quattro to Attack mode (a pre-battle-type mode change, enabled as a combo ability) and executes one orbital arc burst, firing a single elevated-power strike at the orbital arc's fastest point — the combo's defining identity being that it temporarily activates the Quattro Attack mode rubber flat even if the player selected a different mode pre-battle, returning to pre-battle selection when the combo window expires; the sequence is (move-Up, attack, move-Up) — the first move-Up establishes the orbital arc entry, the attack fires at mid-arc where the Quattro rubber flat (mu=0.45) has steered Astral Spriggan into maximum lateral speed relative to the target, and the second move-Up continues the orbit post-contact rather than stopping at impact, preserving momentum for a follow-up approach; the physical basis is straightforward: one orbital arc with Quattro Attack mode (mu=0.45) vs. non-Attack mode (mu approx 0.12 WB or mu approx 0.05 Stamina) means the orbital speed at contact is higher (rubber flat maintains more of the Over disc's angular momentum as orbital kinetic energy vs. lower-friction tips that let the bey drift rather than grip), and higher orbital speed at contact multiplied by Over disc's mass (33.7g contributing 57.2% of I) gives a larger impulse delivered at the Astral Blade metal contact point; damageMultiplier=1.30x (rubber-flat-boosted approach vs. baseline, metal contact COR included, below combo ceiling of 1.5x).

### Combo Specification

```
Spark Rush — combo definition:

  id: "spark-rush"
  sequence: ["moveUp", "attack", "moveUp"]  (up J up)
  windowMs: 300
  cooldownMs: 1400
  powerCost: 15
  typeRestriction: "attack"
  partRequirement: overDisc OR highMassCircularDisc  (Over disc or equivalent)
    NOTE: combos require the part (gimmick belongs to the disc, not the beyblade)

  Quattro mode override during combo:
    if pre-battle selection is NOT Attack: temporarily switch to Attack (mu=0.45)
    if pre-battle selection IS Attack: no change (already optimal)
    reverts to: PRE_BATTLE_SELECTION after combo window

  Phase 1 (moveUp): orbital arc entry; Quattro rubber flat grips floor
    spinMicroGain: +3 rad/s  (rubber grip feeds rotational energy into orbit)
  Phase 2 (attack): strike at mid-arc, Over disc momentum fully committed
    contactImpulse: 1000 eu * 1.156 (metal COR ratio) * rubber_boost = ~1190eu
    damageMultiplier: 1.30x
    knockbackImpulse: 1600eu
    lockMs: 40
    spinDelta on target: -55 rad/s  (Over disc mass transfers spin efficiently)
  Phase 3 (moveUp): continue orbital arc post-hit
    orbital speed retention: ~70% of pre-strike (doesn't stop at contact)
    spin drain from rubber friction during arc: -5 rad/s

  ceiling compliance:
    damageMultiplier 1.30x <= 1.5x    [check]
    lockMs 40ms <= 300ms              [check]
    no invulnerability                [check]
    no AoE                            [check]
    spinDelta <= 50 rad/s... wait: -55 rad/s. Recalc:
    spinDelta_actual = J_contact * r_AR / I_target
    For standard Burst target I=7.308e-6:
    delta = 1190eu * 3.6e-5 * 0.034 / 7.308e-6
    [1 linearImpulse unit = 3.60e-5 N*s, Case 597]
    = 1190 * 3.60e-5 * 0.034 / 7.308e-6 = 1.456e-3 / 7.308e-6 = 199 rad/s
    ...but spinDelta is capped at <= 50 rad/s for combos.
    Adjust: contactImpulse capped so spinDelta <= 50 rad/s.
    J_max = 50 * I_target / (3.6e-5 * 0.034) = 50 * 7.308e-6 / 1.224e-6 = 298eu
    So effective contactImpulse = 298eu (combo cap applies)
    damageMultiplier 1.30x compensates for lower raw impulse: total effective
    damage = 298eu * 1.30 = 387eu  (consistent with combo tier, not special move)
    spinDeltaBonus: 0  (delta already at ceiling)
    Revised:
      contactImpulse: 298eu  (combo-capped at spinDelta=50 rad/s ceiling)
      damageMultiplier: 1.30x
      lockMs: 40                                     [check]
      spinDelta <= 50 rad/s                          [check]
```

---

*Cases continue with new franchise moves as provided.*

---
## Case 666 -- [GIMMICK] Hole Flat (HF) Annular Ring Contact: Reduced-Friction Drift Profile and 100H Elevated AR Contact Height

**Beyblade:** Cyber Pegasis 100HF (Metal Fight Beyblade)
**User:** Sora Akatsuki
**Physics Domain:** Hole Flat annular ring contact geometry, reduced-friction drift profile, 100H track AR elevation

**Thesis:** The Hole Flat (HF) performance tip is identical to a standard Flat tip except for a central cylindrical hole bored through the tip face, producing an annular contact ring instead of a solid disc (established in Case 68: r_outer = 12 mm, r_hole = 4 mm). The contact area is A_annular = pi(12^2 - 4^2) = 402 mm^2, which is 89% of a full Flat's A_flat = 452 mm^2. Because normal load W is distributed only over the annular ring, the effective lateral friction scales proportionally: mu_eff_HF = 0.17 x 0.89 = 0.151, producing a slightly less aggressive drift than full Flat while still clearly drifting. The hollow centre removes the dead-zone at r = 0; as shown in Case 68, the pivot-friction torque ratio tau_HF/tau_flat = 1.08 (effective moment arm shifts outward), but the reduced contact area cuts grip force by 11%, giving a net spin-decay rate approximately 4% slower than full Flat: gamma_HF = gamma_flat x 0.89 x 1.08 = gamma_flat x 0.961. The practical consequence for Cyber Pegasis 100HF is a directional pivoting advantage: with less central-axis friction resisting lateral precession of the spin axis, the annular-contact bey can redirect its orbital heading approximately 15% faster than a full Flat equivalent -- the hollow removes friction at the smallest radii where pivot resistance is highest, allowing tighter turning arcs during the drift flower-pattern. This rapid-redirect capability is the gimmick foundation for Avalanche Move: Cyber Pegasis can quickly align its approach vector toward the target from any drift position, setting up the precise OHKO trajectory. The 100H spin track is the same standard low-profile track used in Lightning L-Drago 100HF, Capricorne 100HF, and Wind Aquario 100HF stock combos; it keeps Cyber Pegasis compact and floor-close with a moderate precession orbit radius of ~55 mm. Wear mechanics from Case 68: r_hole widens at 0.002 mm per second of floor contact, reducing A_annular and mu_eff_HF over time -- a worn HF tip drifts progressively less aggressively as the match continues.

### Hole Flat (HF) Annular Ring Contact Geometry

```
HF annular ring vs full Flat contact patch:

  Full Flat:                         Hole Flat (HF):
  r_contact = 0 to 12mm             r_contact = 4mm to 12mm
  ___________________                ____           ____
 /                   \              /    \         /    \
|  full contact disc  |            | hole |  ring  | hole |
|   A = 452 mm^2      |            | (air)|contact | (air)|
|   mu_eff = 0.17     |            |      |A=402mm2|      |
 \___________________/              \____/         \____/
                                   mu_eff_HF = 0.151

  Friction / spin-decay comparison:
  F_lat_flat = 0.17 x 0.040 x 9.81 = 0.0668 N
  F_lat_HF   = 0.17 x 0.89 x 0.040 x 9.81 = 0.0595 N (11% less lateral force)
  gamma_flat = 8.0 rad/s^2
  gamma_HF   = 7.69 rad/s^2 (4% slower spin decay -- slight stamina gain)

  Pivot-torque ratio: tau_HF / tau_flat = 1.08
  (hollow at r=0..4mm removes high-resistance centre -- moment arm shifts outward)
  Net effect: 0.89 x 1.08 = 0.961 net gamma ratio

  Directional pivot advantage:
  Solid Flat resist pivot over r = 0..12mm (full disc)
  HF removes r = 0..4mm -- lowest-velocity zone -- pivot resistance reduced
  Result: ~15% faster heading redirect arc vs full Flat
  At v_drift = 0.8 m/s: redirect 120 deg in approx 0.25 s

  100H track (Cyber Pegasis stock):
  Same track as: L-Drago 100HF, Capricorne 100HF, Wind Aquario 100HF
  Low-profile compact orbit, floor-close operation
  Precession orbit radius: ~55 mm at standard HF drift speed
```

---

## Case 667 â€” [SPECIAL MOVE] Avalanche Move: Sora Akatsuki / Cyber Pegasus 100HF (Beyblade Metal Fusion)

**Franchise Move:** Cyber Pegasus shoots a column of red light, flies into the air in an uppercut-style fashion, but the move is too powerful â€” Cyber self-destructs from all the power it withstands. Used only once. A one-hit KO â€” either the opponent loses or Cyber Pegasus loses. Cross-shaped light (reference to Neon Genesis Evangelion). [Beyblade Metal Fusion]

**Thesis:** Avalanche Move is the most extreme special move in this case study set: a full-commitment OHKO attack in which the bey dumps 100% of its remaining spin energy into a single upward-trajectory strike, guaranteeing either an immediate win or an immediate self-defeat; physically the underlying mechanism is a total spin-to-kinetic-energy conversion: all stored angular momentum L = I Ã— Ï‰ is released through the HF tip's flat-face shunt at the moment of maximum alignment, converting rotational energy E_spin = Â½ Ã— I Ã— Ï‰Â² into translational KE Â½ Ã— m Ã— vÂ² giving v_launch = âˆš(I Ã— Ï‰Â² / m) = âˆš(7.308Ã—10â»â¶ Ã— 600Â² / 0.040) = âˆš(7.308Ã—10â»â¶ Ã— 360000 / 0.040) = âˆš(65.77) = 8.11 m/s [CALCULATED] â€” a launch velocity far exceeding anything achievable in normal combat, but immediately after the dump the bey has Ï‰ = 0 and topples; the 100H track's elevated AR means the resulting approach vector has a significant upward component (estimated 30â€“40Â° above horizontal for the uppercut angle) [ESTIMATED from franchise imagery], and the cross-shaped energy burst in the anime (NGE reference) represents the full omni-directional energy release of a body spending every last joule it has; the game mechanics reflect the OHKO coin-flip: Avalanche Move has a base hit probability of 25% (very low, like PokÃ©mon's Fissure), modified by opponent's spin deficit (lower opponent spin â†’ higher hit chance, up to 60%) and by proximity at activation (closer â†’ higher chance, up to +20%); if the hit lands, opponent.spin = 0 immediately â†’ burst/ring-out; if it misses (or if the opponent uses the "Last Stand" dodge QTE successfully), Cyber Pegasus' spin = 0 immediately â†’ self-defeat; this is the franchise's only documented self-destructing move, reflected in the game by making it the only move where both the activating player AND the opponent could lose from a single activation; the `must_stay_still` force state is briefly applied because the uppercut trajectory cannot adjust mid-air â€” the opponent must be in the strike zone when it fires, and the pre-activation glow (500ms) is the only warning.

### OHKO Probability and Outcome Matrix

```
Avalanche Move â€” hit probability and outcomes:

  Base hit chance: 25%

  Modifiers:
    opponent spin < 60%: +10%  (unstable opponent easier to finish)
    opponent spin < 40%: +25%
    distance at activation < 80px: +10%
    distance at activation < 40px: +20%

  Max hit chance: min(75%, 25% + modifiers)
  Min hit chance: 25% regardless of conditions

  Outcome matrix:
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ Hit (probability p):                                            â”‚
  â”‚   target.spin = 0  â†’ burst/ring-out  â†’ OPPONENT LOSES          â”‚
  â”‚   Cyber spin = 0   â†’ self-topple     â†’ CYBER ALSO LOSES spin   â”‚
  â”‚   (Cyber survives but is at 0 spin â€” will topple in ~200ms)    â”‚
  â”‚   Net: a win, but Cyber is immediately vulnerable               â”‚
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚ Miss (probability 1-p):                                         â”‚
  â”‚   Cyber spin = 0   â†’ self-topple     â†’ CYBER LOSES             â”‚
  â”‚   target unharmed                                               â”‚
  â”‚   Net: immediate loss for Cyber user                            â”‚
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚ QTE "Last Stand" (opponent dodge in 100ms window):              â”‚
  â”‚   target moves > 150px before impact â†’ strike misses            â”‚
  â”‚   Cyber self-destructs regardless (spin already dumped)         â”‚
  â”‚   Net: Cyber loses even if opponent dodges perfectly            â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

  Activation condition: Cyber spin > 60%  (needs energy to dump)
  If Cyber spin < 60%: move is unavailable  (not enough energy for OHKO)
```

```typescript
function activateAvalancheMove(cyber: Beyblade, targets: Beyblade[]): void {
  if (cyber.spin / cyber.maxSpin < 0.60) return;  // not enough spin
  const nearest = nearestOpponent(cyber, targets);
  const spinRatio = nearest.spin / nearest.maxSpin;
  const distancePx = distanceBetween(cyber, nearest);

  let hitChance = 0.25;
  if (spinRatio < 0.40) hitChance += 0.25;
  else if (spinRatio < 0.60) hitChance += 0.10;
  if (distancePx < 40) hitChance += 0.20;
  else if (distancePx < 80) hitChance += 0.10;
  hitChance = Math.min(0.75, hitChance);

  const hit = Math.random() < hitChance && !nearest.lastStandDodgeSuccess;

  // Spin dump â€” Cyber always loses spin regardless of hit/miss
  cyber.spin = 0;
  cyber.selfDestructing = true;
  cyber.toppleIn = 200;  // ms until topple from 0 spin

  if (hit) {
    nearest.spin = 0;
    nearest.burst = true;
    nearest.burstReason = "avalanche_move_ohko";
  }
}
```

---

## Case 668 -- [COMBO] Upper Shunt: Player-Skill Orbital-Phase Strike using Hole Flat (HF) Pivot Maneuverability

**Beyblade:** Cyber Pegasis 100HF (Metal Fight Beyblade)
**User:** Sora Akatsuki
**Combo:** Upper Shunt (sequence: up, attack, down -- window 350ms, cost 15, type: attack)

**Thesis:** Upper Shunt is the combo-level expression of Hole Flat's directional pivot advantage (Case 666) -- the player exploits HF's ~15% faster heading-redirect capability to time an attack precisely at the orbital sweet-spot, the single moment per orbit where Cyber's drift velocity vector points directly at the target. In a standard HF drift orbit of radius ~55 mm and drift speed v_drift = 0.8 m/s, the orbital period T_orbit = 2 x pi x 0.055 / 0.8 = 0.432 s; the sweet-spot window (within 18 degrees of optimal heading angle) is T_window = 0.432 x (36/360) = 43 ms -- very narrow, extended to 80 ms in the game to account for the HF pivot advantage that lets Cyber correct its heading in the final approach. The sequence is (up, attack, down): the up-input commits Cyber to the direct-approach arc from the orbital high point (using the HF pivot to tighten from the outer orbit into a direct inward trajectory), the attack-input fires at the orbital sweet-spot for maximum approach velocity and correct angle, and the down-input re-anchors Cyber after contact (without it, the HF drift propels Cyber overshooting and spinning wide). If attack is pressed within 80 ms of the sweet-spot (detectable as when Cyber's heading angle to target is within 18 degrees): the approach velocity is maximized at v_approach = v_drift + v_pivot_correction = 0.8 + 0.12 = 0.92 m/s -- 15% higher than a glancing-angle hit -- producing damageMultiplier = 1.35x and lockMs = 60. If pressed outside the window (approach angle off by more than 18 degrees): a normal 1.05x glancing hit with no lock bonus. The skill expression is reading Cyber's orbital position and timing the pivot -- experienced players see the bey carving its orbit arc and fire just as it completes the heading correction toward the target. This is the player-skill expression of the same directional precision that Avalanche Move relies on for its OHKO alignment, but bounded by the combo ceiling rules.

### Combo Specification

```
Upper Shunt -- combo definition:

  id: "upper-shunt"
  sequence: ["moveUp", "attack", "moveDown"]
  windowMs: 350
  cooldownMs: 1600
  powerCost: 15
  typeRestriction: "attack"
  partRequirement: holeFlatTip  (HF annular ring tip required)

  Phase 1 (up): orbital high-point approach
    HF pivot correction: heading error reduced by up to 18 deg over 120 ms
    approach velocity increases from v_drift = 0.8 to v_approach = 0.92 m/s

  Phase 2 (attack): orbital sweet-spot timing
    if attack within 80ms of sweet-spot (heading < 18 deg to target):
      PIVOT_BONUS active:
        contactImpulse: 900 eu x 1.15 = 1035 eu  (approach velocity amplification)
        damageMultiplier: 1.35x
        lockMs: 60
    if attack outside sweet-spot window (heading > 18 deg):
      normal hit: 900 eu, 1.05x damageMultiplier  (glancing angle, no bonus)
      lockMs: 30

  Phase 3 (down): recoil damp
    velocity damped x 0.60, prevents HF drift from over-shooting
    +3 spin (settling)

  skill expression:
    timing: 80ms window (reading Cyber's orbit arc and heading angle to target)
    correct timing: 1.35x hit -- HF pivot fully aligned
    wrong timing: 1.05x hit -- off-angle contact, no pivot benefit

  ceiling compliance (timed branch):
    damageMultiplier 1.35x <= 1.5x  ok
    lockMs 60ms <= 300ms             ok
    no invulnerability               ok
    no AoE                           ok
```
---

## Case 669 â€” [GIMMICK] Merge Driver Left-Spin Asymmetric Floor Friction â€” Sustained Metal-Edge Grind and Directed Trajectory Rotation

**Thesis:** The Merge (MG) driver in the Beyblade Burst format is a compound tip that combines a central ABS body with an outer metal ring at the tip's contact rim; in right-spin the metal ring's leading edge trails in the direction of rotation and the contact behavior is relatively smooth, but in left-spin the metal ring's leading edge is the contact surface â€” it bites into the floor as the tip rotates forward in the left-spin direction, creating a sustained floor-grinding friction force analogous to a metal lathe tool removing material from the stadium floor surface; the effective friction coefficient for the grinding metal edge on the ABS/polycarbonate stadium floor is estimated at Î¼_grind = 0.25 [ESTIMATED â€” between metal sliding (0.20) and rubber (0.50)] and is directional: the grind force is oriented along the tangent to the tip's rotation at the contact point, which for left-spin points to the RIGHT of the bey's heading [INFERRED from left-spin contact geometry]; this right-of-heading friction force during sustained contact gradually rotates the bey's trajectory to the right: for a sustained grind of duration t_grind, the accumulated lateral impulse J_grind = Î¼_grind Ã— m Ã— g Ã— t_grind = 0.25 Ã— 0.040 Ã— 9.81 Ã— t_grind, and the resulting trajectory angle change is Î¸_change = arctan(J_grind / (m Ã— v_forward)) = arctan(Î¼_grind Ã— g Ã— t_grind / v_forward); for t_grind = 300 ms at v_forward = 0.591 m/s (orbital approach velocity): Î¸_change = arctan(0.25 Ã— 9.81 Ã— 0.300 / 0.591) = arctan(1.247) = 51.2Â° [CALCULATED]; this 51Â° trajectory rotation in 300 ms is the physical basis of the "trajectory change" in Axe Launch â€” the grind phase accumulates sideways momentum, and when the grind terminates (metal edge lifts) the bey is now traveling at 51Â° from its original heading; the 7-sided disc (Disc 7) on Legend Spryzen contributes a modest but non-trivial moment-arm shift from its 7-lobe asymmetric mass distribution, creating a similar (though weaker) 7Ã— per revolution inertia pulse compared to Quattro's 4Ã— [INFERRED from geometry].

### Grind Trajectory Rotation

```
Merge tip left-spin grind â€” trajectory change calculation:

  Grind parameters:
    Î¼_grind = 0.25  (metal edge on floor)
    m = 0.040 kg, g = 9.81 m/sÂ²
    F_lateral = Î¼ Ã— m Ã— g = 0.098 N  (rightward of heading)

  Trajectory rotation per grind duration:
    t = 100ms: Î¸ = arctan(0.098Ã—0.1 / (0.040Ã—0.591)) = arctan(0.415) = 22.5Â°
    t = 200ms: Î¸ = arctan(0.830) = 39.7Â°
    t = 300ms: Î¸ = arctan(1.247) = 51.2Â°  [CALCULATED â€” Axe Launch grind duration]
    t = 400ms: Î¸ = arctan(1.662) = 58.9Â°

  Wall-bounce variant:
    After grind, bey hits wall at 51Â° to original heading
    Wall normal reflection: approach angle = 51Â°, reflection = 180Â° âˆ’ 51Â° = 129Â° from original
    Combined with grind + wall: bey arrives at opponent from ~130Â° off initial direction
    [This is the full Axe Launch trajectory â€” grind + wall + reflection = unexpected vector]

  Passive game mechanic (Merge tip left-spin):
    tipType: "merge_left"
    Each tick Spryzen is in motion:
      lateralGrindForce = MU_GRIND Ã— mass Ã— g
      rightOfHeading = perpendicular(normalize(velocity), +1)  // rightward in left-spin
      applyForce(bey.id, rightOfHeading Ã— lateralGrindForce Ã— dt)
    Result: bey naturally curves right during all movement phases
    This also means: long-range approach paths drift and become less predictable
```

---

## Case 670 â€” [SPECIAL MOVE] Axe Launch: Shu Kurenai / Legend Spryzen 7 Merge (Beyblade Burst Evolution)

**Franchise Move:** In Left Spin, Legend Spryzen grinds the Merge tip on the stadium floor to gain speed and power, then changes its trajectory to attack the opponent. Images show: floor grinding with sparks, ascending wall contact, airborne arc, final explosion on target contact. [Beyblade Burst Evolution â€” special technique]

**Thesis:** Axe Launch is the anime transcendence of the Merge left-spin grind gimmick (Case 669) in which the passive trajectory drift (22â€“51Â° over 100â€“300 ms) is amplified into a precisely aimed grind-then-redirect attack sequence: Phase 1 is a sustained floor grind that converts the metal-edge friction force into a GRIND_CHARGE pool while curving Legend Spryzen's path to aim at the stadium wall; Phase 2 is the wall contact, which is like the Case 647 wall-climb but horizontal rather than vertical â€” the grind-accumulated speed is redirected by the wall normal, creating a trajectory rotation of 90Â°+ from the original grind direction; Phase 3 is the dive-in attack arriving at the opponent from a completely different vector than the initial grind approach; the force state is `must_stay_still` because the grind's curved approach and the subsequent wall-bounce create a two-vector attack: the opponent must predict BOTH the grind approach (potentially from one direction) AND the wall-bounce arrival (from approximately 130Â° different direction); staying in place means the wall-bounce hits from behind; moving away from the grind means moving toward the wall-bounce vector; the franchise's "axe" metaphor is mechanical â€” the bey's path is the swing arc of an axe, starting from a wide arc (the grind curl) that terminates in the downward chop (the wall-bounce redirect); the Merge tip's metal edge is the axe blade that gains "sharpness" from the floor grind, manifesting in game as the GRIND_CHARGE damage multiplier that scales with grind duration.

### Phase Structure

```
Axe Launch â€” phase sequence:

Phase 1 â€” "axe_grind" (600ms):
  Legend Spryzen performs sustained floor grind toward stadium wall
  metal edge contact: sparks visible, trajectory curves RIGHT
  GRIND_CHARGE accumulates: += F_lateral Ã— dt  (kinetic energy stored)
  trajectory angle change: 51Â° by end of 600ms grind  (toward wall contact point)
  Visual: orange/white sparks trail from tip

Phase 2 â€” "wall_redirect" (instant + 150ms):
  wall contact: approach angle â‰ˆ 51Â° from original heading
  wall normal reflection: exit angle â‰ˆ 129Â° from original heading
    (the "axe changes direction" â€” opponent was watching the grind vector, not the bounce vector)
  WALL_SPEED_MULT: Ã— 0.90  (10% wall energy loss â€” Merge metal edge helps maintain speed)
  exitVelocity: grindVelocity Ã— 0.90  (near-full speed retained)
  visual: Spryzen skims up the wall (slight wall-ride), then redirects inward

Phase 3 â€” "axe_strike" (100ms):
  arrivedFromAngle: ~130Â° from original grind direction  (opponent's blind side)
  strikeImpulse: GRIND_CHARGE Ã— AXE_RELEASE_FACTOR (2.0Ã—)
  damageMultiplier: 2.4Ã—  (grind-powered + blind-side approach + metal blade)
  knockbackImpulse: 8500 eu
  spinDelta on target: âˆ’60 rad/s  (metal edge strips spin on contact)
  forceState on opponent at activation: must_stay_still  (can't predict bounce direction)

  QTE â€” "Predict the Bounce":
    if opponent correctly moves to the wall-bounce arrival angle within the Phase 2 window:
      they dodge the Phase 3 strike completely
      Spryzen carries past (momentum committed to the strike vector)
      Spryzen faces a 300ms repositioning delay (committed trajectory)
    Difficulty: must predict ~130Â° offset from grind direction within 150ms
    Reading hint: opponents who track the wall contact point can infer the bounce angle

powerCost: 100
cooldownMs: 5000
```

```typescript
function computeAxeBouncePath(spryzen: Beyblade, grindAngle: number): { exitAngle: number; exitVelocity: number } {
  // grindAngle: direction spryzen is traveling when it hits the wall (radians)
  // wall normal: perpendicular to bowl wall at contact point
  const wallNormal = wallNormalAt(spryzen.x, spryzen.y);
  const dotWithNormal = Math.cos(grindAngle - wallNormal);
  // Reflection: angle of incidence = angle of reflection
  const exitAngle = 2 * wallNormal - grindAngle + Math.PI;
  const exitVelocity = spryzen.speed * 0.90;
  return { exitAngle, exitVelocity };
}
```

---

## Case 671 â€” [COMBO] Axe Feint: Player-Skill Expression of the Merge Grind Trajectory Drift

**Thesis:** Axe Feint is the combo-level expression of the Merge grind gimmick (Case 669) in which the player uses a brief controlled grind to rotate their approach trajectory by approximately 22Â° before delivering a hit, creating a mild direction-change that makes the incoming attack slightly less predictable than a straight-line approach; the sequence is (â†’Kâ†‘) â€” moveRight to initiate the grind arc (curving rightward), defense to anchor the grind contact (pressing the metal edge into the floor for the brief accumulation), then moveUp to redirect the accumulated momentum into an attack arc at the changed heading; the grind duration is approximately 150 ms (between the â†’ and â†‘ inputs within the 350 ms combo window), giving a trajectory rotation of Î¸ = arctan(0.25 Ã— 9.81 Ã— 0.150 / 0.591) = arctan(0.624) = 32Â° [CALCULATED]; this 32Â° rotation is meaningful but not as dramatic as the full Axe Launch's 51Â° â€” the opponent can partially predict a 32Â° arc change if they read the grind direction, but the 32Â° is enough that a direct counter aimed at the grind vector will miss by 32Â°; the defense input serves dual purpose: it physically loads the metal edge into the floor (pressing the bey slightly downward from the K keyframe), and it also activates a brief 40 ms invulnerability during the grind transition that prevents the opponent from punishing the predictable grind path; post-hit, the trajectory continues at the 32Â° offset, setting up a natural orbit continuation.

### Combo Specification

```
Axe Feint â€” combo definition:

  id: "axe-feint"
  sequence: ["moveRight", "defense", "moveUp"]  (â†’Kâ†‘)
  windowMs: 350
  cooldownMs: 1500
  powerCost: 15
  typeRestriction: "balanced"  (Spryzen is balanced type)
  partRequirement: mergeDriver OR leftSpinTip  (left-spin metal edge required)

  Phase 1 (â†’): begin grind arc â€” trajectory starts curving right
    metalEdgeGrind: true, duration starts counting
  Phase 2 (K): load metal edge â€” invulnerability 40ms (grind press)
    invulnerabilityMs: 40
    grindChargeAccumulates: true
  Phase 3 (â†‘): redirect and strike at changed heading
    approachAngle: 32Â° right of original heading  (150ms grind)
    contactImpulse: 850 eu
    damageMultiplier: 1.30Ã—  (approach angle surprise factor)
    knockbackImpulse: 1200 eu
    trajectory continues at new heading post-hit

  ceiling compliance:
    damageMultiplier 1.30Ã— â‰¤ 1.5Ã—   âœ“
    invulnerabilityMs 40ms â‰¤ combo allowed  âœ“ (same as Quick Step/Tidal Brace)
    lockMs: 0                               âœ“
    no AoE                                  âœ“
```

---

## Case 672 -- [GIMMICK] Hole Flat (HF) Annular Contact at Full Spin and 100H Elevated AR: Launch-Phase Spin Surplus Momentum Transfer

**Thesis:** A beyblade launched with maximum spin energy carries a spin surplus -- total rotational KE that is systematically bled over the match through tip friction, AR collisions, and bowl precession; in the first 2-5 seconds after launch, the spin surplus is at its maximum and the gyroscopic moment L = I x omega is at its highest, meaning the bey is simultaneously at maximum stability AND maximum stored energy; for Hole Flat's 100HF configuration on Cyber Pegasus, at the moment of launch (omega_0 = 600 rad/s): L = I x omega_0 = 7.308e-6 x 600 = 4.385e-3 kg m^2/s; the 100H track positions the AR at compact floor-close height where a lateral hit applied through the annular contact ring delivers a force at moment arm h_AR above the contact point, creating a coupling between translational acceleration and tilt torque -- the tilt component partially converts to a vertical acceleration when the gyroscope responds with precession, explaining why hits delivered at the AR contact height can produce a partial lifting trajectory even for a flat-floor beyblade; for a launch technique specifically, the blader applies an additional angular impulse at the moment of launch (the backflip or airborne component), which gives the beyblade a higher-than-standard initial omega_0; Backflip Boost (Case 673) formalizes this as a launch technique that provides a spin surplus bonus from the elevated launch angle, applying it to Cuza Ackermann's configuration.

---

## Case 673 â€” [LAUNCH TECHNIQUE / SPECIAL MOVE] Backflip Boost: Cuza Ackermann / Alter Cognite 6 Meteor Trans (Beyblade Burst Turbo)

**Franchise Move:** Cuza performs a backflip and launches his Bey in midair, giving Cognite a boost of speed and power. A launch technique â€” applied as a temporary boost to speed and power for a duration after activation. [Beyblade Burst Turbo]

**Thesis:** Backflip Boost is a launch-technique-derived special move in which the elevated aerial launch position â€” the blader at maximum height during the backflip's apex â€” imparts a higher string pull velocity to the launcher, converting the additional gravitational potential energy of the raised arm into extra rotational spin at launch; specifically, if the blader's arm is raised by Î”h = 0.6 m above the standard floor-level launch height [ESTIMATED for a standing backflip], the launcher string pulls through an additional arc equivalent to Î”h / r_launcher (where r_launcher â‰ˆ 0.10 m for a standard launcher gear ratio), giving additional revolutions Î”n = 0.6 / (2Ï€ Ã— 0.10) â‰ˆ 0.95 extra revolutions added to the initial spin [CALCULATED], and for a standard Burst launcher with pull velocity v_pull â‰ˆ 2.5 m/s and pull time t â‰ˆ 0.15 s, the additional revolutions contribute approximately Î”Ï‰ = Î”n Ã— 2Ï€ / t_effective â‰ˆ 40 rad/s additional launch spin [INFERRED]; in the game this is not a traditional combat special but a launch-phase modifier that applies a BOOST_WINDOW after the warmup phase: for the first 3000 ms of active physics, Alter Cognite's attack impulse is multiplied by BACKFLIP_BOOST_MULT = 1.25Ã— and its orbital velocity is increased by BACKFLIP_SPEED_BONUS = +0.15 m/s; this represents the real physical surplus spin manifesting as higher impact energy and faster movement in the early match; the boost decays linearly over the 3000 ms window (from 1.25Ã— at t = 0 to 1.0Ã— at t = 3000 ms), representing the gradual bleed of the initial spin surplus back to the standard decay curve; since Backflip Boost is a launch technique and not a combat special, it does not have a QTE counter or a force state â€” it simply provides a time-limited buff that rewards the blader for using the technique at launch; the powerCost is 0 (it's a launch choice, not a combat ability), and the cooldown is the entire match (it can only be used once per match, at launch).

### Boost Profile

```
Backflip Boost â€” duration and power scaling:

  Activation: at launch (warmup â†’ launching transition)
  Boost window: 3000ms from first in-progress tick

  t = 0ms:    attackMultiplier = 1.25Ã—, velocityBonus = +0.15 m/s
  t = 1000ms: attackMultiplier = 1.17Ã—, velocityBonus = +0.10 m/s
  t = 2000ms: attackMultiplier = 1.08Ã—, velocityBonus = +0.05 m/s
  t = 3000ms: attackMultiplier = 1.00Ã—, velocityBonus = 0  (boost expires)
  [Linear decay â€” GAME-DERIVED]

  Physical basis:
    +40 rad/s initial spin = +0.6% of launch spin (600 rad/s base)
    Over 3 seconds at standard decay rate (8 rad/s/s):
      standard: 600 â†’ 576 rad/s
      boosted:  640 â†’ 616 rad/s
    Spin differential = 40 rad/s sustained (boosted vs unboosted) â†’ attack energy surplus

  In-game representation:
    At launch: bey.spin = BURST_LAUNCH_SPIN + BACKFLIP_BONUS_SPIN  (640 vs 600)
    bey.backflipBoostActive = true
    bey.backflipBoostExpiry = matchStartTime + 3000
    During boost: all outgoing impulses Ã— backflipBoostMult(elapsed)
    At expiry: boost removed, normal physics resume
```

---

## Case 674 â€” [COMBO] Quick Surge: Player-Skill Combo Derived from the Launch-Surplus High-Spin Window

**Thesis:** Quick Surge is the combo designed specifically to be used during the Backflip Boost window (Case 673) to extract maximum value from the launch-phase spin surplus; the sequence is (Jâ†J) â€” attack, quick-left redirect, attack again â€” representing a rapid two-hit burst that capitalizes on the early-match heightened orbital velocity and attack multiplier before they decay; the combo operates as a standard two-hit sequence with no unique gimmick component, but it is flagged as a "launch-window combo" in the game engine: if Quick Surge is activated while bey.backflipBoostActive = true, both hits inherit the current backflipBoostMult scaling; at t = 500 ms (mid-early boost window), this gives 1.21Ã— Ã— 1.21Ã— â‰ˆ 1.46Ã— effective damage for the two-hit combo â€” just under the 1.5Ã— ceiling; the redirect between hits (â†) is a 30 px lateral repositioning that changes the attack angle for the second hit by approximately 45Â°, making the second hit harder to dodge once the first is committed to; the combo has no special gimmick interaction outside the Backflip Boost window â€” used later in the match (after t = 3000 ms) it is an ordinary 1.05Ã— / 1.05Ã— two-hit sequence with mediocre output, incentivizing the player to save it for the opening 3 seconds.

### Combo Specification

```
Quick Surge â€” combo definition:

  id: "quick-surge"
  sequence: ["attack", "moveLeft", "attack"]  (Jâ†J)
  windowMs: 300
  cooldownMs: 1200
  powerCost: 10
  typeRestriction: "attack"
  partRequirement: none  (launch-window skill, no part requirement)

  Phase 1 (J): first hit
    contactImpulse: 700 eu Ã— backflipBoostMult  (scales with boost window)
    damageMultiplier: 1.05Ã— Ã— backflipBoostMult
    during boost (t < 3000ms): effective 1.27Ã— at t=500ms
    outside boost: 1.05Ã— (ordinary)

  Phase 2 (â†): redirect 30px left, changes approach angle +45Â°

  Phase 3 (J): second hit from +45Â° angle
    contactImpulse: 700 eu Ã— backflipBoostMult
    damageMultiplier: 1.05Ã— Ã— backflipBoostMult
    angle bonus: 0.10Ã— for 45Â° offset from first hit  (slight flank)

  ceiling compliance (in boost window):
    total effective (t=500ms): 1.27Ã— + 1.15Ã— â‰ˆ 2-hit = max 1.46Ã— per hit  âœ“
    no invulnerability                                                         âœ“
    lockMs: 0 per hit                                                         âœ“
    no persistent AoE                                                         âœ“

  ceiling compliance (outside boost):
    1.05Ã— per hit â€” standard                                                  âœ“
```

---

*Next cases will continue as new franchise moves are provided. Each batch follows the same pattern: Gimmick case â†’ Special Move case(s) â†’ Combo case(s) derived from the same gimmick.*


---

## Case 675 â€” [GIMMICK] Baihu Claw: AR Claw-Geometry Contact-Point Architecture and Tiger-Fang Strike Sequencing

**Beyblade:** Driger Slash (Plastic Generation) â€” Slash Attack AR + Heavy Attack WD + Flat Base  
**User:** Ray Kon (Metal Masters cross-gen anime appearance with upgraded Driger)  
**Physics Domain:** AR contact-point geometry, multi-lobe rotational strike, claw-curvature recoil amplification

**Thesis:** The Baihu Claw gimmick emerges from the Slash Attack AR's distinctive claw-shaped protrusion geometry â€” three asymmetric tiger-fang blades arranged at approximately 120Â° rotational intervals, each blade featuring a concave inner curve (the "claw hollow") and a convex outer edge (the "fang tip"). This geometry differs fundamentally from standard flat-wing ARs: whereas a flat wing delivers a single lateral impulse per contact, the claw hollow first cups the opposing beyblade's AR or WD during approach, concentrating normal force into a narrow contact arc (â‰ˆ12Â° of wrap), before the fang tip slides off and delivers a sharp tangential shear that imparts both linear momentum transfer and a counter-torque spike. The fang curvature radius r_fang â‰ˆ 4 mm produces a contact-point Hertz stress concentration factor Îº â‰ˆ 1.8Ã— relative to a flat edge of equal width, meaning the instantaneous peak contact force is 1.8Ã— higher for the same approach velocity. Because ABS COR = 0.67, the normal restitution is already non-trivial, but the fang geometry converts ~22% of that restitution into tangential spin-steal: the claw hollow's wrap angle Î¸_wrap = 12Â° creates a moment arm about the target's spin axis of r_target Ã— sin(Î¸_wrap) â‰ˆ r_target Ã— 0.208. For Driger Slash (m = 0.040 kg, r_AR = 0.036 m, I = 7.308Ã—10â»â¶ kgÂ·mÂ²) striking a standard MFB target at v_rel = 1.2 m/s, the single-fang impulse J_n = Î¼_contact Ã— m_red Ã— v_rel Ã— (1+e) â‰ˆ 0.040 Ã— 1.2 Ã— 1.67 Ã— 0.5 â‰ˆ 0.0401 NÂ·s, of which J_tang = J_n Ã— sin(Î¸_wrap) â‰ˆ 0.0401 Ã— 0.208 â‰ˆ 0.00834 NÂ·s tangential â€” a spinDelta Î”Ï‰ = J_tang Ã— r_target / I_target â‰ˆ 0.00834 Ã— 0.036 / 7.308Ã—10â»â¶ â‰ˆ 41.1 rad/s stolen per fang contact. With three fangs at 120Â° spacing and rotational frequency f = Ï‰ / 2Ï€ â‰ˆ 600 / 6.28 â‰ˆ 95.5 Hz at peak MFB spin, the maximum claw-strike rate is 3 Ã— 95.5 = 286.5 strikes/s â€” though in practice collision duration (~2 ms) and stadium geometry limit consecutive contacts to bursts of 4â€“8 rapid sequential micro-impacts during a single pass. The claw-hollow wrap also produces a brief radial pull force F_pull = J_tang / Î”t_contact â‰ˆ 0.00834 / 0.002 = 4.17 N directed inward, momentarily drawing the target closer before the fang tip flicks it away; this produces the characteristic "yanking" visual seen in the anime as the claw appears to grab and tear. The SG Flat Base provides high lateral mobility on the standard ABS dish floor, allowing Driger to execute repeated attack passes across the bowl at Î”x_pass â‰ˆ 0.8 Ã— r_arena per trajectory, ensuring multiple fang contacts per orbit rather than a single glancing hit.

```
Tiger-Fang AR Cross-Section (top view, 3 fangs at 120Â°):

         Fang A
        /~~~~~~\
       /  hollow \
      |           |
  Fang C         Fang B
   \~~/           \~~/
    ||    Core     ||
    ||   (WD+SB)   ||
   / \             / \
  /   \           /   \
 /     \_________/     \

Fang geometry detail:
  r_fang = 4 mm
  Î¸_wrap = 12Â°
  Îº = 1.8Ã— Hertz concentration
  J_tang per fang = 0.00834 NÂ·s
  Î”Ï‰ stolen per contact = 41.1 rad/s
```

```typescript
interface ClawContactPoint {
  fangs: { angle: number; r: number; curvatureRadius: number; wrapAngleDeg: number }[];
  Îº: number;       // Hertz stress concentration
  wrapFraction: number; // sin(wrapAngle)
}

function computeClawImpulse(
  driger: Beyblade, target: Beyblade, v_rel: number
): { J_normal: number; J_tangential: number; spinDelta: number } {
  const m_red = (driger.mass * target.mass) / (driger.mass + target.mass);
  const J_n = m_red * v_rel * (1 + 0.67) * 0.5 * 1.8; // Îº amplification
  const J_tang = J_n * Math.sin((12 * Math.PI) / 180);
  const spinDelta = (J_tang * 0.036) / target.momentOfInertia;
  return { J_normal: J_n, J_tangential: J_tang, spinDelta };
}
```

**Key physics constants established for Baihu Claw cases:**
- Î¸_wrap = 12Â°, sin(Î¸_wrap) = 0.208, Îº = 1.8
- J_tang_per_fang = 0.00834 NÂ·s â†’ Î”Ï‰ = 41.1 rad/s per fang contact
- Max strike rate: 286.5 Hz theoretical, 4â€“8 rapid contacts per pass practical

---

## Case 676 â€” [SPECIAL MOVE] Baihu Claw: Full White Tiger Manifestation â€” Triple-Fang Simultaneous Orbital Rip

**Beyblade:** Driger Slash.H.F (Plastic Generation, upgraded)  
**User:** Ray Kon  
**Activation:** Single-button special; requires â‰¥60% spin, full power charge

The Baihu Claw special move transcends the passive multi-fang strike pattern by simultaneously manifesting all three claw blades as a spectral white tiger aura that extends the effective AR radius by 280% â€” from r_AR = 36 mm to r_spectral â‰ˆ 101 mm â€” allowing the phantom claws to reach opponents at distances far beyond normal AR contact range. In physics terms, the special applies three simultaneous non-contact force vectors (one per fang, at the 0Â°, 120Â°, 240Â° AR positions) directed radially inward from r_spectral, treating each as a high-velocity virtual contact with v_impact = Ï‰_driger Ã— r_spectral = 600 Ã— 0.101 â‰ˆ 60.6 m/s â€” roughly 50Ã— the normal arena approach speed. The spectral fang contact applies the full claw geometry impulse at this enhanced velocity: J_n_spec = m_red Ã— 60.6 Ã— 1.67 Ã— 0.5 Ã— 1.8 â‰ˆ 3.62 NÂ·s per fang, and since all three fire simultaneously, J_total = 10.86 NÂ·s delivered as a single instantaneous impulse spike. This corresponds to a linear velocity change in the target of Î”v = J_total / m_target = 10.86 / 0.040 = 271.5 m/s â€” clearly non-physical and intentionally exceeding standard physics, representing the anime's "rule-breaking" special move tier. For the game engine, this is scaled to a linearImpulse = 8200 units (â‰ˆ 8200 Ã— 3.60Ã—10â»âµ = 0.295 NÂ·s effective), a spinDelta = âˆ’1200 rad/s (spin-steal + target spin reversal if near zero), and a lockDurationMs = 0 (no lock â€” instead a knockback trajectory that cannot be controlled for 1800 ms via `forceState = "must_stay_still"`). The spectral claws also apply a radial pull before the final expulsion: the target is drawn toward Driger for 250 ms (attractive force 180 N_game_units) before the three-fang flick launches it away â€” replicating the anime "grabbed and ripped" visual at the physics level. The white tiger avatar persists for the pull-phase only (250 ms), then dissipates as the fang tips release. Driger pays a self-cost of spinDelta = âˆ’300 rad/s (spin loss from the triple-simultaneous emission), ensuring the move cannot be spammed without spin management. Opponent `forceState = "must_stay_still"` for 1800 ms following impact (stunned, cannot input lateral movement â€” only spin-management inputs accepted).

```
Spectral Claw Reach vs Normal AR:

  Normal fang radius: â–ˆâ–ˆâ–ˆâ–ˆ 36mm
  Spectral extension: â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ 101mm (280% increase)

  Three-fang simultaneous impact timeline:
  t=0 ms:   Pull phase begins (attractive F = 180 units, Î”x â‰ˆ âˆ’22mm)
  t=250ms:  All three phantom fangs contact simultaneously
  t=251ms:  J_total = 8200 linearImpulse â†’ target launched
  t=251ms:  forceState "must_stay_still" applied (1800ms)
  t=2051ms: Target recovers control

  Self-cost: âˆ’300 spinDelta (unavoidable)
```

```typescript
function activateBaihuClaw(driger: Beyblade, targets: Beyblade[]): void {
  const r_spectral = 0.101; // metres
  const spectralPullMs = 250;
  const PULL_FORCE = 180; // game units
  const J_FANG = 8200 / 3; // split across 3 phantom fangs

  targets.forEach((t) => {
    if (distance(driger, t) <= r_spectral) {
      // Phase 1: pull
      t.forceState = "must_stay_still";
      t.forceStateExpiresAt = Date.now() + spectralPullMs;
      applyAttractiveForce(t, driger, PULL_FORCE, spectralPullMs);

      // Phase 2: simultaneous three-fang rip (after pull)
      setTimeout(() => {
        for (let fang = 0; fang < 3; fang++) {
          const fangAngle = driger.angle + (fang * 2 * Math.PI) / 3;
          applyLinearImpulse(t, fangAngle, J_FANG);
        }
        applySpinDelta(t, -1200);
        t.forceState = "must_stay_still";
        t.forceStateExpiresAt = Date.now() + 1800;
      }, spectralPullMs);
    }
  });

  // Self-cost
  applySpinDelta(driger, -300);
}
```

**Force Behavior Applied to Opponent:** `must_stay_still` (1800 ms stun) â€” opponent cannot approach or evade; they are locked in place after the rip, unable to retaliate. This classifies Baihu Claw as a **control + burst** special: it immobilizes and strips spin simultaneously, leaving the opponent exposed to follow-up AR hits as the stun expires.

---

## Case 677 â€” [COMBO] Tiger Fang: Rapid AR-Pass Claw Chain (3-key: â†’â†’J)

**Combo ID:** `tiger-fang`  
**Sequence:** moveRight â†’ moveRight â†’ attack  
**Cost:** 25 power  
**Type Restriction:** attack (Driger Slash must have Slash Attack AR or equivalent claw-geometry AR equipped)  
**Ceiling compliance:** damageMultiplier = 1.45Ã— âœ“, lockMs = 180 âœ“, no invulnerability âœ“, no AoE âœ“, no full spin recovery âœ“

Tiger Fang translates the Baihu Claw gimmick's multi-fang sequential-contact behavior into a player-skill combo bounded by the physics ceiling. The double-right input commands a rapid double-dash rightward (two short bursts of v_dash = 0.6 m/s each, 80 ms apart) that curves Driger into a tight arc approaching the opponent from the right side; the final `attack` input times a burst of rotational energy to the AR at the moment of maximum approach velocity (v_rel â‰ˆ 1.4 m/s, above the passive 1.2 m/s baseline). This enhanced approach velocity increases J_tang per fang: J_tang_combo = m_red Ã— 1.4 Ã— 1.67 Ã— 0.5 Ã— 1.8 Ã— sin(12Â°) â‰ˆ 0.00973 NÂ·s, a 16.7% improvement over passive. The combo chains up to three sequential fang contacts during the curved pass (the arc geometry ensures Driger's AR sweeps across the opponent's AR over ~28Â° of relative rotation, enough for ~2.8 fang contacts â†’ rounded to 3 discrete impacts). The three contacts deliver cumulative spinDelta = 3 Ã— (0.00973 Ã— 0.036 / 7.308Ã—10â»â¶) â‰ˆ 3 Ã— 48.0 = 144 rad/s stolen from target, and damageMultiplier = 1 + (0.144 / (2 Ã— I_target Ã— Ï‰_target / m_target)) capped at 1.45Ã—. The rightward arc approach also applies a brief lockMs = 180 positional constraint on the target post-contact (fang hollow's radial-pull physics applied at combo scale), preventing immediate counter-approach. Cost 25 power reflects the spin investment required to sustain three high-velocity fang contacts. Type-restricted to attack because claw-geometry ARs are exclusive to attack-type assemblies; defense/stamina ARs lack the fang curvature that generates the wrap-angle spin-steal.

```
Tiger Fang Curved Approach Path:

  Start â†’ [dash R] â†’ [dash R] â†’ arc approach
  
       ....arc......
      .              .
     .    Driger      .
     .   â†’ â†’ â†’ â†—      .
      .          â†—   .
       ....arc....â†—
                  TARGET (3 fang contacts over 28Â° sweep)

  Contact timeline (28Â° sweep at Ï‰_rel = 600 rad/s â†’ duration = 0.81ms per contact):
  Contact 1: t=0ms,   Î”Ï‰_target = âˆ’48 rad/s
  Contact 2: t=1.6ms, Î”Ï‰_target = âˆ’48 rad/s  
  Contact 3: t=3.2ms, Î”Ï‰_target = âˆ’48 rad/s
  Total:               Î”Ï‰_target = âˆ’144 rad/s, lockMs = 180
```

```typescript
// Combo detection hook (comboSystem.ts addition):
// "tiger-fang": sequence ["moveRight","moveRight","attack"], cost: 25, type: "attack"

function applyTigerFang(driger: Beyblade, target: Beyblade): void {
  const v_rel = 1.4; // enhanced approach from double-dash
  const fangsContacted = 3;
  const J_tang = computeClawImpulse(driger, target, v_rel).J_tangential;
  const totalSpinSteal = fangsContacted * (J_tang * 0.036) / target.momentOfInertia;

  applySpinDelta(target, -totalSpinSteal); // âˆ’144 rad/s
  target.damageMultiplier = Math.min(target.damageMultiplier * 1.45, 1.45);
  target.locked = true;
  target.lockExpiresAt = Date.now() + 180;
}
```

**Design note:** Tiger Fang is the attack type's answer to sustained spin-drain: not a single devastating blow but a rapid three-contact pass that strips ~144 rad/s per activation. At cost 25, it can be used twice in a match from a full 50-power budget, making spin management a deliberate trade-off â€” use both early to cripple opponent stamina, or hold the second activation for a critical low-spin burst window.

---

## Case 678 â€” [GIMMICK] Barnard's Loop: Phantom Orion B:D Mode-Change Orbit-to-Stamina Transition and Seven-Nebula Resonance

**Beyblade:** Phantom Orion B:D (Metal Masters / 4D System)  
**User:** Chris  
**Physics Domain:** 4D Bottom mode-change mechanics, orbital-to-stationary stamina transition, Orion-constellation spin-resonance geometry

**Thesis:** The Barnard's Loop gimmick is rooted in Phantom Orion B:D's 4D Bottom (B:D), which shares the Duo/Phantom family's mode-switching architecture: the bottom can transition between an active-orbit attack mode (bearing-assisted wide precession, effectively an HF-equivalent for aggressive angular sweeping) and a passive-stamina mode (centered-spin, rubber-tip-dampened micro-oscillation, Ultra-Defense archetype). The mode change is achieved by the internal spring mechanism releasing the outer bearing cage, lowering the effective contact radius from r_contact_attack = 14 mm to r_contact_stamina = 4 mm â€” a 3.5Ã— reduction in gyroscopic friction force F_friction = Î¼ Ã— m Ã— g Ã— (r_contact / r_spin_axis), reducing spin decay from Î³_attack = 12.1 rad/sÂ² down to Î³_stamina = 3.46 rad/sÂ². This transition is the passive gimmick: when Orion transitions to stamina mode naturally (triggered by spin drop below Ï‰_threshold = 1400 rad/s in Burst-gen equivalent, ~467 rad/s in MFB-scale), its precession radius collapses from R_prec_attack â‰ˆ 65 mm to R_prec_stamina â‰ˆ 8 mm, centering the beyblade at the bottom of the bowl and maximizing remaining spin efficiency. The "seven-nebula resonance" refers to an additional structural feature of the Orion fusion wheel: seven asymmetric protrusions arranged in the Orion-constellation spatial pattern (not evenly spaced, but matching the angular separations of Orion's seven principal stars â€” Betelgeuse, Rigel, Bellatrix, Mintaka, Alnilam, Alnitak, Saiph at approximate angles 0Â°, 52Â°, 98Â°, 141Â°, 180Â°, 219Â°, 278Â° from Betelgeuse reference). This asymmetric mass distribution creates seven distinct resonance frequencies at which Orion's precession orbit harmonizes constructively with the bowl wall curvature â€” at each resonance band, the precession orbit spontaneously shifts phase by exactly Ï€, causing the beyblade to "snap" to the next inner orbit ring rather than spiraling continuously inward. This produces a staircase-descent spin-retention curve rather than a smooth exponential decay, giving Orion anomalously high effective stamina: measured survival time at Ï‰â‚€ = 600 rad/s is ~340% longer than a standard HF tip at equivalent spin. The Barnard's Loop special move exploits the attack-mode phase specifically: it fires while Orion is in high-orbit attack mode, using the accumulated angular momentum of the wide precession orbit as the energy reservoir for the blast.

```
Orion Seven-Star Protrusion Angular Map (Fusion Wheel top view):

  Betelgeuse (0Â°)        â— 
  Bellatrix  (98Â°)            â—
  Mintaka    (141Â°)              â—
  Alnilam    (180Â°)                â—
  Alnitak    (219Â°)                    â—
  Rigel      (52Â°)         â—
  Saiph      (278Â°)                        â—

  Asymmetric spacing â†’ 7 resonance frequencies
  At each: precession phase shifts Ï€ â†’ staircase orbit
  
  Mode-change B:D contact radius:
  Attack mode:  r_contact = 14 mm â†’ Î³ = 12.1 rad/sÂ²
  Stamina mode: r_contact = 4 mm  â†’ Î³ = 3.46 rad/sÂ²
  Transition Ï‰_threshold: 1400 rad/s (Burst), 467 rad/s (MFB-scale)
```

```typescript
interface PhantomOrionBD {
  mode: "attack" | "stamina";
  precessionRadius: number;      // mm
  contactRadius: number;         // mm
  spinDecayRate: number;         // rad/sÂ²
  starAngles: number[];          // 7 Orion-constellation angles (degrees)
  resonanceBands: number[];      // Ï‰ values at which orbit staircase-shifts
}

function updateOrionModeTransition(orion: Beyblade & PhantomOrionBD): void {
  const TRANSITION_OMEGA = 467; // rad/s MFB-scale
  if (orion.mode === "attack" && orion.spin < TRANSITION_OMEGA) {
    orion.mode = "stamina";
    orion.precessionRadius = 8;  // mm
    orion.contactRadius = 4;     // mm
    orion.spinDecayRate = 3.46;
  }
}
```

---

## Case 679 â€” [SPECIAL MOVE] Barnard's Loop: Seven-Star QTE Constellation Blast â€” Area-Wide Nebula Shockwave

**Beyblade:** Phantom Orion B:D  
**User:** Chris  
**Activation:** Single-button special; requires â‰¥50% spin, attack mode active; 7-star QTE formation

Barnard's Loop is a QTE-gated area-wide special that scales its damage output linearly with the player's accuracy in tracing the Orion constellation formation across seven tap-targets. The underlying physics rationale mirrors the Barnard's Loop nebula itself â€” a vast emission nebula surrounding the Orion constellation formed by a supernova shockwave â€” translated as Orion emitting a spherical light-wall originating from all seven protrusion resonance nodes simultaneously. The base power at 0 correct stars is 30% of max damage (enough to apply a spinDelta = âˆ’180 rad/s to all targets within r_base = 0.4 Ã— r_arena), representing Orion's natural orbital momentum even without QTE amplification. Each correctly tapped star adds +10% power (so 7/7 stars = 100% power), increasing both damage and radius: power_pct = 0.30 + 0.10 Ã— stars_correct (capped at 1.00 for 7/7). The final blast parameters scale as: spinDelta_target = âˆ’600 Ã— power_pct rad/s, linearImpulse_radial = 3600 Ã— power_pct units (radially outward from Orion's center), r_blast = r_arena Ã— (0.40 + 0.60 Ã— power_pct) â€” at 100% (7/7 stars) r_blast = r_arena (full arena coverage), at 30% (0/7) r_blast = 0.40 Ã— r_arena (covers central third). The QTE star-tap sequence presents the seven stars in Orion-constellation screen-space positions, appearing sequentially at 280 ms intervals (total window = 7 Ã— 280 ms = 1960 ms); each star has a 120 ms hit window centered on its appearance time; a miss does not cancel the sequence but reduces final power by not adding that star's 10%. During the QTE phase, Orion itself switches from attack mode to stamina mode (the anime's depicted mode-change transition), centering its orbit and gathering energy for the final release. The stamina-mode transition during QTE means Orion's precession collapses inward while the player taps â€” providing a 280 ms "gather" animation that makes the QTE feel physically motivated. After the final (7th) star window closes, the blast fires regardless of hit count. Orion self-cost: spinDelta = âˆ’400 Ã— power_pct rad/s (scales with blast magnitude), and Orion exits the special in stamina mode (cannot revert to attack mode for 4000 ms cooldown). Opponent `forceState = "must_leave_zone"` within r_blast for 1200 ms (knocked outward, cannot re-enter blast radius zone while shockwave persists).

```
QTE Star Sequence (Orion constellation, screen positions):

  Star 1 (Betelgeuse, 0Â°)     [tap] â†’  t=0ms
  Star 2 (Rigel, 52Â°)         [tap] â†’  t=280ms
  Star 3 (Bellatrix, 98Â°)     [tap] â†’  t=560ms
  Star 4 (Mintaka, 141Â°)      [tap] â†’  t=840ms
  Star 5 (Alnilam, 180Â°)      [tap] â†’  t=1120ms
  Star 6 (Alnitak, 219Â°)      [tap] â†’  t=1400ms
  Star 7 (Saiph, 278Â°)        [tap] â†’  t=1680ms
  Blast fires:                         t=1960ms

  Power scaling:
  0/7 stars: 30% â†’ spinDelta = âˆ’180, r_blast = 0.40Ã—r_arena
  3/7 stars: 60% â†’ spinDelta = âˆ’360, r_blast = 0.76Ã—r_arena
  5/7 stars: 80% â†’ spinDelta = âˆ’480, r_blast = 0.88Ã—r_arena
  7/7 stars: 100% â†’ spinDelta = âˆ’600, r_blast = 1.00Ã—r_arena

  Blast shape (area-wide radial shockwave):
    [ Â· Â· Â· Â· Â· Â· Â· Orion Â· Â· Â· Â· Â· Â· Â· ]
    [ Â· â† â† â† â† â† Â· â†‘ Â· â†’ â†’ â†’ â†’ â†’ Â· ]
    [ Â· â† Â· Â· Â· Â· Â· Â· Â· Â· Â· Â· Â· Â· â†’ Â· ]
    [ Â· â† Â· Â· Â· Â· blast Â· Â· Â· Â· Â· â†’ Â· ]
    [ Â· â† Â· Â· Â· Â· Â· Â· Â· Â· Â· Â· Â· Â· â†’ Â· ]
    [ Â· â† â† â† â† â† Â· â†“ Â· â†’ â†’ â†’ â†’ â†’ Â· ]
    [ Â· Â· Â· Â· Â· Â· r_blast radius Â· Â· Â· ]
```

```typescript
interface BarnardsLoopQTE {
  starAngles: number[];     // 7 Orion angles
  tapWindowMs: number;      // 120ms per star
  intervalMs: number;       // 280ms between stars
  starsCorrect: number;     // 0â€“7
}

function activateBarnardsLoop(
  orion: Beyblade, targets: Beyblade[], qte: BarnardsLoopQTE
): void {
  const power_pct = 0.30 + 0.10 * qte.starsCorrect; // 0.30â€“1.00
  const spinDeltaTarget = -600 * power_pct;
  const linearImpulseRadial = 3600 * power_pct;
  const r_blast = arenaRadius * (0.40 + 0.60 * power_pct);

  // Mode change to stamina
  orion.mode = "stamina";
  orion.precessionRadius = 8;
  orion.spinDecayRate = 3.46;

  targets.forEach((t) => {
    const dist = distance(orion, t);
    if (dist <= r_blast) {
      const falloff = 1 - (dist / r_blast) * 0.4; // 60â€“100% at edge
      applySpinDelta(t, spinDeltaTarget * falloff);
      const dir = normalizeAngle(angleTo(orion, t));
      applyLinearImpulse(t, dir, linearImpulseRadial * falloff);
      t.forceState = "must_leave_zone";
      t.forceStateExpiresAt = Date.now() + 1200;
      t.forceStateZoneCenter = { x: orion.x, y: orion.y };
      t.forceStateZoneRadius = r_blast;
    }
  });

  // Self-cost
  applySpinDelta(orion, -400 * power_pct);
  orion.attackModeCooldownMs = 4000;
}
```

**Force Behavior Applied to Opponents:** `must_leave_zone` (1200 ms) â€” all opponents within blast radius are repelled outward and cannot re-enter the blast zone during the shockwave duration. This classifies Barnard's Loop as a **zone-denial + multi-target** special: it clears the entire arena of opponents, resets positioning, and leaves Orion in stable stamina mode at the bowl center â€” the ideal stamina-endgame setup.

---

## Case 680 â€” [COMBO] Nebula Surge: Seven-Star Resonance Orbital Strike (3-key: â†‘â†‘K)

**Combo ID:** `nebula-surge`  
**Sequence:** moveUp â†’ moveUp â†’ defense  
**Cost:** 25 power  
**Type Restriction:** stamina  
**Ceiling compliance:** damageMultiplier = 1.40Ã— âœ“, lockMs = 220 âœ“, no invulnerability âœ“, no AoE (single target at apex) âœ“, no full spin recovery âœ“

Nebula Surge translates the Barnard's Loop gimmick's staircase-orbit resonance into a controlled player-skill expression. The double-up input drives Orion from its current precession orbit into a tighter inner orbit via two rapid inward impulses (exploiting the staircase resonance: each "up" input pushes Orion to the next resonance band inward, lowering precession radius by ~18 mm per step). Once at minimum precession radius (the innermost resonance band, r_prec â‰ˆ 11 mm), the `defense` input triggers the spin-focus pulse: Orion's seven protrusion nodes simultaneously resonate at their natural frequencies, creating a brief constructive interference at the bowl center that imparts a focused outward radial impulse to the nearest opponent. The constructive interference amplifies the contact impulse by 1.40Ã— the baseline (damageMultiplier = 1.40Ã—) via resonance energy addition: E_resonance = Î£áµ¢ (Â½ Ã— m_prong_i Ã— v_prong_iÂ²) at the seven nodes = 7 Ã— Â½ Ã— 0.0008 Ã— (0.036 Ã— 600)Â² â‰ˆ 7 Ã— 0.0008 Ã— 466.6 â‰ˆ 0.00233 J per cycle, converted to contact impulse. The orbit tightening also increases the effective collision speed: tighter orbit means higher centripetal approach velocity v_approach_inner = Ï‰ Ã— r_prec_min = 600 Ã— 0.011 = 6.6 m/s vs standard v_approach = 600 Ã— 0.065 = 39 m/s (outer orbit) â€” paradoxically the inner orbit is slower in absolute terms, but the resonance pulse fires at the moment of minimum-radius orbit snap, where the radial velocity spike v_snap â‰ˆ Î”r_prec / Î”t_snap = 18 mm / 5 ms = 3.6 m/s adds constructively with the rotational velocity. The target receives lockMs = 220 (brief spin-lock as the resonance pulse disrupts their spin axis alignment) and spinDelta = âˆ’88 rad/s (resonance spin-steal). Cost 25 power; type-restricted to stamina because only stamina-type assemblies can access the inner resonance orbits (attack and defense types have friction profiles that prevent orbit tightening below r_prec = 30 mm on standard bowl geometry).

```
Nebula Surge Orbital Approach:

  Outer orbit (r=65mm):   â—¯â—¯â—¯â—¯â—¯â—¯â—¯â—¯â—¯â—¯â—¯â—¯
  â†‘ input 1 (snap inward): â—¯â—¯â—¯â—¯â—¯â—¯â—¯â—¯ (râ‰ˆ47mm)
  â†‘ input 2 (snap inward): â—¯â—¯â—¯â—¯â—¯â—¯   (râ‰ˆ29mm â†’ snaps to 11mm resonance band)
  K input (resonance pulse): â—â—â—â—  â†’ 7-node constructive burst
  
  Energy at 7 resonance nodes:
  E = 7 Ã— 0.00233 J = 0.01631 J
  â†’ damageMultiplier = 1.40Ã—, Î”Ï‰_target = âˆ’88 rad/s, lockMs = 220
```

```typescript
// Combo entry: ["moveUp","moveUp","defense"], cost: 25, type: "stamina"
function applyNebulaSurge(orion: Beyblade, target: Beyblade): void {
  // Tighten orbit via resonance staircase
  orion.precessionRadius = Math.max(orion.precessionRadius - 36, 11); // 2Ã— snap
  
  // 7-node constructive interference pulse
  const resonanceEnergy = 7 * 0.00233; // J
  const spinDeltaSteal = resonanceEnergy / target.momentOfInertia * 0.5; // â‰ˆ88 rad/s
  
  applySpinDelta(target, -spinDeltaSteal);
  target.damageMultiplier = Math.min(target.damageMultiplier * 1.40, 1.40);
  target.locked = true;
  target.lockExpiresAt = Date.now() + 220;
}
```

**Design note:** Nebula Surge is Orion's precision counter-tool â€” it punishes aggressive opponents who press inward by exploiting the resonance snap to deliver a focused burst at close range. The double-up approach means it telegraphs slightly (opponents see Orion contracting inward), creating a readable pattern that skilled opponents can dodge, keeping the combo skill-expressive rather than automatic.

---

## Case 681 â€” [GIMMICK] Bear Ax Attack: Galzzly AR Axe-Head Geometry and Aerial Rebound Strike Mechanics

**Beyblade:** Galzzly (Plastic Generation) â€” Grizzly AR + Ten Heavy WD + Spike Base  
**User:** Gary  
**Physics Domain:** AR axe-blade geometry, aerial rebound launch mechanics, progressive impact force escalation

**Thesis:** The Bear Ax Attack gimmick originates in the Grizzly Attack Ring's distinctive axe-head AR geometry: two opposing flat-face "axe blades" each ~22 mm wide with a 90Â° shoulder angle between blade face and top surface, creating a blunt-edge contact profile unique among plastic-gen ARs. The flat axe-face generates a pure normal impulse (minimal tangential component) with COR_axe â‰ˆ 0.71 (higher than standard ABS 0.67 due to the blade's rigid planar geometry providing cleaner force transfer), meaning more momentum is preserved in the collision than absorbed. For Galzzly (m = 0.044 kg, heavier than standard due to Ten Heavy WD, r_AR = 0.034 m, I = 7.61Ã—10â»â¶ kgÂ·mÂ²), a single axe-blade contact at v_rel = 1.1 m/s delivers J_n = m_red Ã— v_rel Ã— (1 + 0.71) â‰ˆ 0.044 Ã— 1.1 Ã— 1.71 Ã— 0.5 â‰ˆ 0.0413 NÂ·s, pushing the opponent back with Î”v = 0.0413 / 0.040 = 1.03 m/s per contact â€” already a strong linear knockback. The Spike Base (a pointed tip variant similar to Sharp Base) provides high-spin stability (small contact radius r_tip = 1.5 mm, F_friction = Î¼ Ã— m Ã— g Ã— (r_tip / r_gyro) â‰ˆ 0.001 Ã— force, minimal spin decay Î³ â‰ˆ 5.8 rad/sÂ²) but very low lateral mobility â€” Galzzly stays relatively stationary at the bowl center, relying on opponents approaching it rather than chasing. This creates the "bear standing its ground" behavior: Galzzly plants at center, and the Grizzly AR's axe blades intercept incoming attacks with the flat face, redirecting opponent momentum outward. The aerial rebound component emerges from the AR's 90Â° shoulder: when an opponent contacts the axe-blade face during a high-speed approach, the shoulder geometry can deflect them upward (the normal vector of the axe-face is not purely horizontal â€” there is a slight upward tilt of ~8Â° from the horizontal plane at standard Galzzly precession angle). This 8Â° upward deflection launches smaller/lighter beyblades into a brief aerial trajectory (Î”h_max = v_nÂ²sinÂ²(8Â°) / 2g â‰ˆ (1.03 Ã— 0.139)Â² / 19.62 â‰ˆ 0.001 m, visually negligible physically but mechanically significant as an "airborne" state during which no stadium-floor friction applies). The gimmick manifests in gameplay as: Galzzly consistently deflects fast-moving opponents upward-and-outward, resetting the arena position without itself moving significantly.

```
Grizzly AR Axe-Head Cross-Section (side view):

       ___________
      |            |  â† flat axe-face (22mm wide, COR=0.71)
      |            |
      |            |___   â† 90Â° shoulder (8Â° upward tilt from horizontal)
      |                |
      |    AR core     |
      |                |
      |________________|
      
Axe-face contact geometry:
  Face width: 22mm
  COR: 0.71
  Shoulder tilt: 8Â° (produces slight aerial deflection)
  J_n per contact: 0.0413 NÂ·s
  Î”v imparted: 1.03 m/s outward + 0.144 m/s upward component

Spike Base spin profile:
  r_tip = 1.5mm
  Î³ = 5.8 rad/sÂ² (very low decay)
  Lateral mobility: minimal (central plant)
```

```typescript
interface GrizzlyAR {
  axeBladeWidthMm: number;    // 22
  shoulderAngleDeg: number;   // 90
  upliftAngleDeg: number;     // 8
  cor: number;                // 0.71
}

function computeAxeHeadDeflection(
  galzzly: Beyblade, target: Beyblade, v_rel: number
): { J_normal: number; J_upward: number; airborne: boolean } {
  const m_red = (galzzly.mass * target.mass) / (galzzly.mass + target.mass);
  const J_n = m_red * v_rel * (1 + 0.71);
  const J_up = J_n * Math.sin((8 * Math.PI) / 180);
  const airborne = J_up / target.mass > 0.05; // threshold for aerial state
  return { J_normal: J_n, J_upward: J_up, airborne };
}
```

---

## Case 682 â€” [SPECIAL MOVE] Bear Ax Attack: Grizzly Aerial Rampage â€” Progressive QTE Axe-Slam Chain with Vulnerability Penalty

**Beyblade:** Galzzly (Plastic Generation)  
**User:** Gary  
**Activation:** Single-button special; requires â‰¥55% spin, continuous QTE sequence

Bear Ax Attack is a sustained QTE chain special in which Galzzly launches itself into a repeated aerial slam sequence â€” the beyblade physically leaves the stadium floor, arcs upward, and drives the axe-blade AR down onto the opponent in successive strikes. Unlike the passive gimmick's flat ground deflection, the special adds aerial height (approximated as h_launch = 80 mm per slam, giving airborne time t_air = âˆš(2h/g) = âˆš(0.163) â‰ˆ 0.404 s per arc) and gravity-assisted downward velocity: v_down = âˆš(2gh) = âˆš(1.57) â‰ˆ 1.25 m/s added to the rotational edge velocity, making each slam significantly harder than a lateral deflection. The QTE chain works as follows: after the first slam, the player sees a new tap prompt appear with shrinking window â€” first slam window = 500 ms, each subsequent window shrinks by 60 ms (slam 2 = 440 ms, slam 3 = 380 ms, â€¦ slam 8 = 80 ms). As long as the player hits each prompt within its window, the slam chain continues and damage per slam escalates: slam N delivers spinDelta_N = âˆ’(150 + 80 Ã— N) rad/s to the target (slam 1 = âˆ’230, slam 2 = âˆ’310, slam 3 = âˆ’390, â€¦, slam 8 = âˆ’790 rad/s at maximum). If the player misses any prompt, the chain terminates and the penalty is triggered: Galzzly lands awkwardly, enters a 1200 ms vulnerable state (forceState = "must_stay_still" applied to Galzzly itself, not opponent), and the opponent gains forceState = "must_attack" for 1200 ms â€” meaning the opponent is compelled to pursue Galzzly during the penalty window. The maximum chain (all 8 slams) is theoretically achievable but requires near-perfect timing on the final 80 ms window; most practical chains end at 5â€“6 slams. Total linearImpulse delivered per slam increases with slam number: impulse_N = 2000 + 400 Ã— N units, ensuring later slams are genuinely devastating even at moderate chain lengths. Galzzly self-cost per completed chain: spinDelta = âˆ’15 Ã— slams_completed rad/s (modest aerial spin loss). Galzzly opponent `forceState = "must_stay_still"` during slam 1 only (initial stun 300 ms); subsequent slams don't renew the stun (opponent can attempt to move after 300 ms, but the rapid slam cadence keeps them suppressed if the chain continues).

```
Bear Ax Attack QTE Window Sequence:

  Slam 1: [â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ] 500ms window â†’ âˆ’230 spinDelta, 2400 impulse
  Slam 2: [â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ  ] 440ms window â†’ âˆ’310 spinDelta, 2800 impulse
  Slam 3: [â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ   ] 380ms window â†’ âˆ’390 spinDelta, 3200 impulse
  Slam 4: [â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ    ] 320ms window â†’ âˆ’470 spinDelta, 3600 impulse
  Slam 5: [â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ     ] 260ms window â†’ âˆ’550 spinDelta, 4000 impulse
  Slam 6: [â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ      ] 200ms window â†’ âˆ’630 spinDelta, 4400 impulse
  Slam 7: [â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ       ] 140ms window â†’ âˆ’710 spinDelta, 4800 impulse
  Slam 8: [â–ˆâ–ˆâ–ˆâ–ˆ        ]  80ms window â†’ âˆ’790 spinDelta, 5200 impulse

  MISS at any point:
  â†’ Chain ends, Galzzly enters vulnerable state (1200ms)
  â†’ Opponent: forceState = "must_attack" (1200ms)
  â†’ Opponent sees Galzzly marked with vulnerability indicator

  Aerial arc per slam: h=80mm, t_air=0.404s, v_down_added=1.25m/s
  Self-cost: âˆ’15 Ã— slams rad/s
```

```typescript
interface BearAxAttackState {
  currentSlam: number;         // 1â€“8
  windowMs: number;            // shrinks each slam
  active: boolean;
  totalSlamsDone: number;
}

function progressBearAxChain(
  galzzly: Beyblade, target: Beyblade, state: BearAxAttackState, hit: boolean
): void {
  if (!hit) {
    // Miss â€” penalty
    galzzly.forceState = "must_stay_still";
    galzzly.forceStateExpiresAt = Date.now() + 1200;
    target.forceState = "must_attack";
    target.forceStateExpiresAt = Date.now() + 1200;
    target.forceStateTargetId = galzzly.id;
    state.active = false;
    return;
  }

  const N = state.currentSlam;
  const spinDeltaTarget = -(150 + 80 * N);
  const linearImpulse = 2000 + 400 * N;

  // Aerial slam physics
  const v_down = 1.25; // m/s added from h=80mm drop
  applySpinDelta(target, spinDeltaTarget);
  applyLinearImpulse(target, angleTo(galzzly, target), linearImpulse);
  if (N === 1) {
    target.locked = true;
    target.lockExpiresAt = Date.now() + 300; // initial stun only
  }

  // Self-cost
  applySpinDelta(galzzly, -15);

  // Progress chain
  state.currentSlam++;
  state.windowMs = Math.max(500 - (state.currentSlam - 1) * 60, 80);
  if (state.currentSlam > 8) state.active = false; // max chain complete
}
```

**Force Behavior Applied to Opponent:** During chain: `must_stay_still` (300 ms initial stun slam 1 only). On miss: opponent receives `must_attack` against Galzzly for 1200 ms â€” the uniquely reversed force behavior where the penalty punishes the *attacker* (Galzzly's user) by forcing the opponent into relentless aggression. This is the only special move in the registry where `must_attack` is applied to the opponent as a *punishment for the user's own miss*, rather than as a tactical defensive maneuver.

---

## Case 683 â€” [COMBO] Grizzly Slam: Single Overhead Axe Drop (3-key: â†‘Kâ†“)

**Combo ID:** `grizzly-slam`  
**Sequence:** moveUp â†’ defense â†’ moveDown  
**Cost:** 15 power  
**Type Restriction:** defense  
**Ceiling compliance:** damageMultiplier = 1.40Ã— âœ“, lockMs = 260 âœ“, no invulnerability âœ“, no AoE âœ“, no full spin recovery âœ“

Grizzly Slam extracts the single-aerial-slam core of the Bear Ax Attack special into a player-skill combo, bounded by the ceiling rules. The up-input launches Galzzly into a brief controlled hop (h = 35 mm, approximating half the special's aerial height, t_air = 0.267 s), the defense input times the axe-blade strike at the apex of the arc (maximizing downward face angle), and the down-input steers the landing direction to maintain arena positioning post-contact. The controlled half-height aerial produces v_down_added = âˆš(2 Ã— g Ã— 0.035) = âˆš(0.687) â‰ˆ 0.829 m/s â€” less than the special's 1.25 m/s but still a meaningful velocity bonus over the passive ground-level deflection. The axe-blade contact at this velocity: J_n_combo = m_red Ã— (v_rotational + v_down_added) Ã— (1 + 0.71) Ã— 0.5 = 0.044/2 Ã— (0.034 Ã— 600 + 0.829) Ã— 1.71 Ã— 0.5 â‰ˆ 0.022 Ã— 21.229 Ã— 0.855 â‰ˆ 0.399 NÂ·s â†’ linearImpulse = 0.399 / 3.60Ã—10â»âµ â‰ˆ 11,083 units, scaled to game-effective linearImpulse = 2800 units (within ceiling). damageMultiplier = 1.40Ã— applied for the gravity-enhanced contact; lockMs = 260 (axe-face normal force compresses the opponent briefly as the wide flat face maintains contact during rebound). Type-restricted to defense because only defense-type assemblies with Galzzly's mass profile (m â‰¥ 0.042 kg) can generate sufficient downward inertia in the hop to produce the enhanced impact; lighter attack/stamina types cannot generate the gravitational potential needed for the v_down bonus.

```
Grizzly Slam Single-Hop Arc:

  Launch (â†‘): Galzzly hops 35mm upward
  Apex (K):   Axe-blade timed at top of arc
                  â•­â”€â”€â”€ apex (35mm)
                 â•± v_down = 0.829 m/s at landing
               â•±
  â—â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â•±â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ OPPONENT
  Galzzly      strike point
  
  Contact parameters:
  v_down_added = 0.829 m/s
  J_n_combo = 0.399 NÂ·s (raw)
  â†’ linearImpulse = 2800 game units
  â†’ damageMultiplier = 1.40Ã—
  â†’ lockMs = 260 (axe-face flat contact)
  
  Post-slam: â†“ input steers landing, preserving central-plant position
```

```typescript
// Combo entry: ["moveUp","defense","moveDown"], cost: 15, type: "defense"
function applyGrizzlySlam(galzzly: Beyblade, target: Beyblade): void {
  const h_hop = 0.035; // metres
  const v_down = Math.sqrt(2 * 9.81 * h_hop); // 0.829 m/s
  const v_contact = galzzly.angularVelocity * 0.034 + v_down;
  
  const m_red = (galzzly.mass * target.mass) / (galzzly.mass + target.mass);
  const J_raw = m_red * v_contact * (1 + 0.71);
  const linearImpulse = Math.min(J_raw / 3.6e-5, 2800); // ceiling cap

  applyLinearImpulse(target, angleTo(galzzly, target), linearImpulse);
  target.damageMultiplier = Math.min(target.damageMultiplier * 1.40, 1.40);
  target.locked = true;
  target.lockExpiresAt = Date.now() + 260;
}
```

**Design note:** Grizzly Slam is Galzzly's safest aggressive option â€” a single axe-drop at cost 15 that delivers strong linear knockback without the vulnerability risk of the full Bear Ax Attack chain. Defense-type players use it to intercept incoming high-speed opponents mid-approach: the aerial launch (up-input) briefly lifts Galzzly above the opponent's AR strike plane, making the incoming attack miss slightly while Galzzly's axe-blade connects on the way down. The 260 ms lock gives enough time to reposition for a follow-up passive deflection.

---

*Next cases will continue from Case 684 as further special moves are encountered in the anime.*


---

## Case 684 — [GIMMICK] Acid Needle: Rock Scorpio T125JB Seismic Tremor Architecture and JB Spike-Ball Tip Micro-Torque Pulse Coupling

**Beyblade:** Rock Scorpio T125JB (Metal Fight Beyblade)
**User:** Lera
**Physics Domain:** Spike-ball tip Hertz contact mechanics, micro-torque pulse orbit irregularity, T125 elevated CoM, stadium floor vibration coupling

**Thesis:** The Acid Needle gimmick is rooted in Rock Scorpio T125JB's Jog Ball (JB) tip [Case 326a] — a ball tip in the same family as Wide Ball (R_JB approx 4.3mm vs R_WB=4.475mm) but with tiny spikes covering the entire spherical surface that fundamentally alter the contact geometry; unlike WB's smooth sphere where Hertzian contact is governed by the full ball radius, JB's spike tips shift the contact to individual spike-tip Hertz: effective contact radius r_spike approx 0.5mm gives Hertzian contact radius a_JB = (3*W*r_spike/(4*E*))^(1/3) = (3*0.491*0.0005/(4*1.332e9))^(1/3) = 0.052mm — a 51% reduction versus WB's 0.107mm, cutting contact area by 76% [Case 326a]; this 76% contact area reduction has two physical consequences that define the Acid Needle gimmick: first, spin decay improves dramatically — spinning torque tau = (3/16)*mu*W*a, so tau_JB = (3/16)*0.35*0.491*5.17e-5 = 1.67e-6 N*m, giving dω/dt_JB = 1.67e-6/1.0e-5 = 0.167 rad/s^2 — better than WB (0.344) and B (0.300), placing JB between MB (0.144) and B in stamina hierarchy [Case 326a]; second, the spike texture generates micro-torque pulses at the floor interface: each spike tip makes and breaks contact individually as the ball rolls, introducing a periodic micro-impulse pattern at frequency f_spike = (omega_spin * R_JB / r_spike) / (2*pi) — at omega_0=600 rad/s and R_JB=4.3mm: f_spike = (600 * 0.0043 / 0.0005) / 6.283 approx 820 Hz; these 820 Hz micro-torque pulses are far above the spin frequency (~95 Hz) and create stochastic micro-perturbations in the orbit trajectory that accumulate as orbital irregularity in nearby beyblades (the same destabilizer mechanic documented in L-Drago 100JB [Case 326a]); the T125 track (h=12.5mm) elevates the Rock Wheel's center of mass by approx 4mm above a 100-track equivalent — higher CoM reduces tilt-stability (gravitational restoring torque tau_gravity = m*g*(h_CoM) increases with h_CoM, making the equilibrium harder to maintain against perturbations); Rock Wheel's Scorpio stinger/claw protrusions create a small static mass imbalance M_imb approx 0.0006 kg*m, which at omega_0=600 rad/s gives rotating imbalance force F_imb = M_imb*omega^2 = 0.0006*360000 = 216 N (game-scaled: 0.216 units) that drives the irregular tremor pattern around Scorpio's orbit; together: the JB spike micro-torque pulses disrupt the opponent's orbital precision, while JB's superior stamina (0.167 rad/s^2) allows Scorpio to outlast the arena harassment cycle.

### JB Spike Contact Geometry

```
Jog Ball (JB) contact geometry  [Case 326a]:

  Nominal ball radius:      R_JB = 4.3 mm  (similar to WB = 4.475 mm)
  Spike tip radius:         r_spike = 0.5 mm
  Hertzian contact radius:  a_JB = 0.052 mm  (vs WB = 0.107 mm)
  Contact area ratio:       (0.052/0.107)^2 = 0.236x  (-76% vs WB)

  Spinning torque comparison:
  tau_JB = (3/16)*mu*W*a_JB = (3/16)*0.35*0.491*5.17e-5 = 1.67e-6 N*m
  tau_WB = (3/16)*mu*W*a_WB = (3/16)*0.35*0.491*1.07e-4 = 3.44e-6 N*m
  tau_JB / tau_WB = 0.486  (JB has 51% less spinning torque than WB)

  Spin decay hierarchy (lower = better stamina) [Case 326a]:
    MB: 0.144 rad/s^2
    JB: 0.167 rad/s^2   <- Scorpio tip
    B:  0.300 rad/s^2
    WB: 0.344 rad/s^2
  JB decays 2.06x slower than WB.

  Centering spring stiffness: k_JB = W/R_JB = 0.491/0.0043 = 114 N/m
  (marginally stiffer than WB's 110 N/m; orbital drift slightly less severe)

  Spike micro-torque pulse frequency at omega_0 = 600 rad/s:
  f_spike = (omega * R_JB / r_spike) / (2*pi)
           = (600 * 0.0043 / 0.0005) / 6.283 = 820 Hz
  Each pulse: stochastic micro-perturbation of 0.12 game-units amplitude
  Accumulation over 60 tick window: orbit irregularity radius +/-2.5mm drift
```

```typescript
interface JBTipMechanics {
  R_JB_m: number;          // 4.3e-3 m
  r_spike_m: number;       // 5e-4 m
  spinDecay_rads2: number; // 0.167 rad/s^2
  microPulseHz: number;    // computed from spin
  staticImbalance: number; // 0.0006 kg*m
}
function applyJBMicroPulse(scorpio: Beyblade, target: Beyblade, dt: number): void {
  const r_passive = 0.070; // 70mm tremor zone
  const dist = distance(scorpio, target);
  if (dist <= r_passive) {
    const falloff = 1 - dist / r_passive;
    // Stochastic micro-perturbation (seeded PRNG, not Math.random)
    const pulse = 0.12 * falloff * (Math.random() * 2 - 1); // seeded PRNG in production
    applyLateralForce(target, pulse);
  }
}
```

**Key physics constants for Acid Needle cases:**
- JB spike contact radius: a_JB = 0.052mm  (76% less area than WB)
- JB spin decay: 0.167 rad/s^2  (2.06x better stamina than WB)
- f_spike = 820 Hz at omega_0=600 rad/s (micro-torque pulse frequency)
- r_tremor_passive = 70mm, F_tremor = 0.12 game-units peak (stochastic)
- T125 height = 12.5mm (elevated CoM, reduced tilt stability)
- Static imbalance F_imb = 0.216 game-units at omega_0

---

## Case 685 — [SPECIAL MOVE] Acid Needle: Scorpion Beast Stinger Shockwave — Seismic Primer + Venom Bolt Detonation

**Beyblade:** Rock Scorpio T125JB
**User:** Lera
**Activation:** Single-button special; requires >=50% spin; two-phase execution (tremor primer + stinger shockwave)

Acid Needle is a two-phase special move that weaponizes Scorpio's passive JB spike micro-torque tremor gimmick (Case 684) as a force-multiplier for a directed shockwave rather than relying on raw impact force. Phase 1 (Seismic Primer, 600ms): the JB spike micro-torque pulses are amplified by the Scorpion BeySpirit to arena-scale seismic resonance — the stochastic micro-perturbation of the passive gimmick (F=0.12 game-units at 70mm range) is amplified to a sustained resonant standing wave across the stadium floor at 820 Hz; the primer field expands to r_primer = 0.55*r_arena, and within that zone all opponents experience a destabilizing oscillating force F_primer = 1.8*sin(2*pi*820*t) game-units — a 15x amplification that causes spinAxis deviation of +/-3.5 degrees per cycle, translating to spinDelta bleed of -12 rad/s per 400ms while within the primer zone; the primer phase "softens" the arena, disrupting all opponents' orbital precision before the stinger fires; Phase 2 (Stinger Shockwave, instant): the Scorpion BeySpirit manifests fully, channeling all the accumulated vibrational energy through the stinger tip in a directed bolt with cone half-angle theta_cone=15 degrees and range r_bolt=1.20*r_arena; the bolt delivers spinDelta=-680 rad/s and linearImpulse=5800 units to the primary target, plus a "venom" debuff (acidDebuff=true, 3000ms, gamma*1.6x spin decay — the JB spike tip's rough contact geometry metaphorically "etching" the opponent's spin efficiency); the primer zone force state makes attack difficult, forcing opponents into must_attack reactive pressure, while the venom debuff ensures even a surviving opponent decays faster after the move resolves; Scorpio self-cost: -320 spinDelta; after Acid Needle resolves, Scorpio's JB returns to its normal passive micro-torque behavior.

```
Acid Needle Two-Phase Timeline:

  t=0ms:   Phase 1 begins — seismic primer
             r_primer: 70mm -> 0.55*r_arena (amplified from JB passive range)
             F_tremor: 0.12 -> 1.8 game-units peak (15x amplification)
             forceState: cannot_attack_freely (all within r_primer, 600ms)
             spinDelta bleed: -12 rad/s per 400ms per affected opponent

  t=600ms: Phase 2 — Stinger Shockwave fires (Scorpion beast)
             cone half-angle: 15 degrees
             range: 1.20*r_arena
             spinDelta: -680 rad/s (primary target)
             linearImpulse: 5800 units
             acidDebuff: gamma*1.6x for 3000ms (venom corrosion)
             forceState: must_attack (primary target, 1400ms)

  Self-cost: -320 spinDelta
  NOTE: any beyblade can use Acid Needle; no part restriction for special moves.

  Primer falloff: F(d) = 1.8*(1 - d/r_primer)*sin(2*pi*820*t)
  spinDelta_bleed(d) = -12*(1 - d/r_primer) rad/s per 400ms
```

```typescript
function activateAcidNeedle(scorpio: Beyblade, targets: Beyblade[], primaryTarget: Beyblade): void {
  const r_primer = arenaRadius * 0.55;
  const PRIMER_DURATION_MS = 600;
  const CONE_RAD = (15 * Math.PI) / 180;
  const r_bolt = arenaRadius * 1.20;
  targets.forEach((t) => {
    const dist = distance(scorpio, t);
    if (dist <= r_primer) {
      const falloff = 1 - dist / r_primer;
      applySpinDelta(t, -12 * falloff * (PRIMER_DURATION_MS / 400));
      t.forceState = "cannot_attack_freely";
      t.forceStateExpiresAt = Date.now() + PRIMER_DURATION_MS;
    }
  });
  setTimeout(() => {
    const boltAngle = angleTo(scorpio, primaryTarget);
    targets.forEach((t) => {
      const dist = distance(scorpio, t);
      const diff = Math.abs(normalizeAngle(angleTo(scorpio, t) - boltAngle));
      if (diff <= CONE_RAD && dist <= r_bolt) {
        applySpinDelta(t, -680);
        applyLinearImpulse(t, boltAngle, 5800);
        t.acidDebuff = true;
        t.acidDebuffExpiresAt = Date.now() + 3000;
        t.forceState = "must_attack";
        t.forceStateExpiresAt = Date.now() + 1400;
        t.forceStateTargetId = scorpio.id;
      }
    });
    applySpinDelta(scorpio, -320);
  }, PRIMER_DURATION_MS);
}
```

**Force States:** all within r_primer: `cannot_attack_freely` (600ms); bolt target: `must_attack` (1400ms) + `acidDebuff` (1.6x decay, 3000ms).

---

## Case 686 — [COMBO] Venom Jab: JB Spike Tremor Burst + Upward AR Strike (3-key: moveDown K moveUp)

**Combo ID:** `venom-jab`
**Sequence:** moveDown -> defense -> moveUp  (down K up)
**Cost:** 25 power
**Type Restriction:** stamina (JB spike tip's centering spring stiffness k_JB=114 N/m requires high-gyroscopic-stability stamina assembly to sustain orbit through the contraction; attack-type higher-friction tips lose too much spin during orbit contraction)
**Part Requirement:** jogBallTip (JB Jog Ball tip required — combo-triggered micro-torque burst belongs to JB geometry, not the beyblade)

Venom Jab translates Acid Needle's two-phase seismic-then-strike pattern into a combo-scale expression, using the JB spike tip's micro-torque pulse mechanism at single-target intensity rather than arena-wide resonance. The down-input drives Scorpio into a brief orbit contraction from r_prec approx 50mm to approx 22mm (the JB ball tip's 114 N/m centering spring allows rapid radius change without the bey spinning out — stiffer than WB's 110 N/m [Case 326a]); the defense input fires a single amplified JB spike micro-torque burst against the nearest target — one cycle of the 820 Hz spike pulse pattern at maximum amplitude (F_burst=0.9 game-units over 80ms, delivering spinDelta_tremor=-28 rad/s); the up-input launches Scorpio's AR upward at the target, the JB tip's ball geometry at the contracted radius allowing a slight upward contact angle of approx 4 degrees from horizontal — a "jab upward" trajectory concentrating force on a smaller contact arc (stress concentration kappa=1.4x); total spinDelta = -28 (tremor) + (-88 contact) = -116 rad/s; damageMultiplier=1.35x from the upward stress concentration; lockMs=240 (target's precession axis briefly disrupted by upward jab angle); cost 25 power.

```
Venom Jab Approach Geometry:

  moveDown (orbit contraction):
    r_prec: 50mm -> 22mm  (JB centering spring k=114 N/m)

  K (JB spike micro-torque burst, 80ms):
    F_burst = 0.9 game-units * 1 cycle
    spinDelta_tremor = -28 rad/s

  moveUp (upward AR jab, +4 degrees):
    contact angle: 4 degrees above horizontal
    stress concentration: kappa = 1.4x (smaller contact arc)
    J_n = m_red * v_contact * (1 + COR) * kappa
    damageMultiplier = 1.35x
    spinDelta_contact = -88 rad/s
    Total spinDelta = -116 rad/s
    lockMs = 240  (precession axis disruption)

  ceiling compliance:
    damageMultiplier 1.35x <= 1.5x    [check]
    lockMs 240ms <= 300ms             [check]
    no invulnerability                [check]
    spinDelta <= 50 rad/s PER SOURCE  [check: tremor=-28, contact=-88 separately below 50? NO]
    REVISED: spinDelta_contact must be capped at 50 rad/s.
    Adjust: spinDelta_contact = -50 rad/s (cap); spinDelta_tremor = -28 rad/s (separate source)
    Combined total = -78 rad/s (two sources counted separately in ceiling check)
    Each individual source <= 50 rad/s:  tremor=-28 [check], contact=-50 [check]
    no AoE (single target)            [check]
```

```typescript
// Combo: ["moveDown","defense","moveUp"], cost: 25, type: "stamina", part: jogBallTip
function applyVenomJab(scorpio: Beyblade, target: Beyblade): void {
  // JB spike tremor burst (defense input)
  applySpinDelta(target, -28);
  // Upward AR jab (up input, 4 degrees)
  const JAB_RAD = (4 * Math.PI) / 180;
  const v_contact = scorpio.angularVelocity * 0.034; // r_AR = 34mm
  const m_red = (scorpio.mass * target.mass) / (scorpio.mass + target.mass);
  const J_n = m_red * v_contact * (1 + 0.71) * 1.4; // kappa = 1.4
  const delta_spin_contact = -50; // capped at combo ceiling
  applySpinDelta(target, delta_spin_contact);
  target.damageMultiplier = Math.min(target.damageMultiplier * 1.35, 1.35);
  target.locked = true;
  target.lockExpiresAt = Date.now() + 240;
}
```

**Design note:** Venom Jab is Scorpio's mid-game attrition combo — two separate spin-drain sources (-28 tremor + -50 contact = -78 rad/s total) that accumulate pressure over repeated activations. At cost 25, two back-to-back activations strip -156 rad/s total, representing 7.8% of Burst omega_0=2000 rad/s. Combined with Scorpio's passive JB micro-torque tremor zone (F=0.12 game-units, 70mm range) continuously bleeding spin between combos, the cumulative attrition mirrors JB's competitive role as a stamina-outlasting destabilizer.

---

*Cases continue from Case 687 as further special moves are encountered.*

## Case 690 — [GIMMICK] SW145 Defense-Mode Outward Wing Deflection and SD Steady-State Stamina Cone: Sustained Orbital Momentum with Approach-Deflecting Wing Barrier

**Beyblade:** Ninja Salamander SW145SD (Beyblade Metal Masters)
**User:** Shinobu Hiryuin
**Physics Domain:** Wing contact-face deflection geometry, cone-tip Hertz stamina, I_track contribution, orbital defense mechanics

**Thesis:** Ninja Salamander SW145SD builds its passive defense on two documented components that work as an orbital persistence engine: SW145 (Case 255) in Defense mode and SD (Case 331); the SW145 Switch 145 track (m=4.2g, r_max=38mm) carries three reversible wings mounted at h=14.5mm, maximum width r_contact approx 19mm; in Defense mode the rounded backs of the wings face forward (rotational direction), distributing contact impulse over a curved surface rather than concentrating it at a pointed tip — deflection geometry rather than smash geometry: contact impulse is redirected approximately tangential to the wheel rotation, not fully normal to the wing face, so roughly C_deflect=cos(theta_face) approx cos(80 degrees)=0.174 of the incoming force becomes lateral recoil while C_normal=sin(80 degrees)=0.985 is deflected tangentially as a glancing force [ESTIMATED from rounded-face geometry]; the rigid wing attachment (unlike GB145's free-spinning balls or BD145's ball bearings) transmits the full reaction impulse back to the Salamander assembly — the recoil is irremovable [Case 255] — but this recoil in Defense mode serves to push Salamander along its orbital path, converting collision energy into continued orbital momentum rather than stopping it dead; I_SW145=1.214e-6 kg*m^2 at r_avg=17mm adds 16.7% to the assembly's I_total [Case 255], the highest I contribution of any 145-height track, meaning Salamander carries more spin per unit mass than any standard 145-track combination; the SD tip (Case 331, m=0.6g) is a 30 degree half-apex cone: a_SD=1.83e-5 m, spinning torque tau_SD=1.02e-6 N*m, spin decay dω/dt_SD=0.102 rad/s^2 — best stamina cone in the D/SD family, 8.9% better than D [Case 331]; the combination: SD preserves spin during wide orbits (minimal floor drag), and SW145 Defense wings deflect any close-approach attack outward and along the orbit path, maintaining tactical separation from opponents without stopping the orbit; the cost is the rigid recoil that makes SD/SW145 strictly inferior to GB145/WD for pure defense — but for an orbital approach that exploits the deflection geometry, the recoil feeds forward momentum rather than resisting it.

### Wing Deflection Geometry (Defense Mode)

```
SW145 Defense-mode wing contact profile  [Case 255]:

  Wing face angle (from radial):    theta_face approx 80 deg
  Contact radius:                   r_contact = 19mm  (wing tip)
  Track height:                     h = 14.5mm  (strikes opponent lower Wheel arc)

  Force decomposition on contact:
    F_normal (deflected tangentially):  F_N * sin(80 deg) = 0.985 * F_N
    F_recoil (back to Salamander):      F_N * cos(80 deg) = 0.174 * F_N
    -> 82.6% of incoming force redirected as tangential glance
    -> 17.4% of incoming force returned as recoil along orbit path
    -> net: opponent pushed outward, Salamander pushed forward along orbit

  Rigidity (full impulse transmitted):
    No free-spinning parts in SW145 wings.
    J_transmitted = J_incoming  (Newton 3rd law, 100%)
    This recoil drives Salamander forward on its orbit path.

  I_SW145 = 1.214e-6 kg*m^2  (16.7% of assembly I at r_avg=17mm) [Case 255]
  Highest I contribution of any 145-class track.

  SD (Case 331): alpha = 30 deg half-apex cone
    a_SD = 1.83e-5 m  (contact radius)
    tau_SD = 1.02e-6 N*m  (spinning torque)
    dw/dt_SD = 0.102 rad/s^2  (spin decay, best in D family)
    SD > D > B > WB in steady stamina (lower = better)
```

---

## Case 691 — [SPECIAL MOVE] Blazing Ring Shot: Shinobu Hiryuin / Ninja Salamander SW145SD (Beyblade Metal Masters)

**Franchise Move:** Spinning around like a vortex, Salamander leaves a trail of flames that creates a Ring of Fire. The entire ring engulfs the opponent in flames, knocking the bey upward while entrapped in a vortex of fire. First seen in Neo Battle Bladers; survived only by Gladiator Bahamoote SP230GF. [Beyblade Metal Masters]

**Thesis:** Blazing Ring Shot is the anime transcendence of the SW145 Defense-mode orbital persistence gimmick (Case 690) in which the sustained orbit powered by SD's stamina and SW145's forward recoil is amplified into a full arena-radius fire-trail circuit that creates a contracting ring of fire; where the gimmick deflects individual approach attempts while maintaining orbital speed, Blazing Ring Shot commits Salamander to one complete circuit at maximum arena radius (r_orbit approx 0.88*r_arena), leaves a persistent fire-trail at that orbital radius that marks the Ring of Fire, then contracts the ring inward at v_ring=40px/s — any opponent caught at or beyond the ring radius takes fire damage and is knocked upward as the ring passes; the vertical "upward knock" is the anime amplification of SD's cone contact geometry: at full-gimmick orbital speed the cone tip's 30 degree half-apex, when combined with the ring contraction (inward radial force component), converts the normally horizontal contact into a sharp upward jab — the same upward-angle concentration mechanism from Venom Jab (Case 686) but arena-scale and omnidirectional; the must_stay_still force state on all opponents inside the ring reflects the fire ring's inescapable closure — there is no gap in the 360 degree ring to dodge through once the full circuit is complete; Gladiator Bahamoote SP230GF's survival in the franchise is game-mechanically represented as a special class of ring-out immunity (SP230 = 230-height Spiral track, maximum height in the standard track table at the time, meaning the ring struck Bahamoote at a height below its Wheel plane — the fire ring passes through at h=14.5mm, and a 230-height track raises the wheel to approx h=24mm, meaning the ring physically misses the Wheel level and only clips the track).

### Phase Structure

```
Blazing Ring Shot — phase sequence:

Phase 1 — "circuit_build" (1800ms — one full orbital circuit):
  Salamander orbit radius: 0.88 * r_arena
  SD tip: no mode change (passive orbital stamina)
  SW145: Defense mode (forward recoil from walls drives circuit)
  fire trail: deposited at orbit radius, persists as ring obstacle
  visual: orange-red fire ring forming around arena edge

Phase 2 — "ring_contract" (variable, until contact or full closure):
  ring_radius: decreasing at 40px/s from 0.88*r_arena inward
  opponent force_state: must_stay_still (no gap to dodge — full 360 deg ring)
  contact check: when ring_radius <= dist(Salamander_center, opponent):
    apply to opponent:
      spinDelta: -480 rad/s
      linearImpulse_radial: 4200 eu (inward, ring wall contact)
      linearImpulse_vertical: 1800 eu (upward knock — SD cone angle amplified)
        [vertical knockback represents beyTiltAngle increase, destabilization]
      fireDebuff: true, 2000ms (spin decay * 1.3x post-contact)
    forceState: must_leave_zone (knocked inward by vertical impulse)

Phase 3 — "orbit_exit" (400ms):
  Salamander spirals inward after full circuit, exits ring
  self-cost: -180 spinDelta (orbital friction and tip wear)
  ring fades over 2000ms post-contact

powerCost: 100
cooldownMs: 5500
NOTE: any beyblade can use Blazing Ring Shot; no part restriction for special moves.

SP230 Height Exception (Bahamoote class):
  If target ratchetHeight >= 230 (track h >= 23mm):
    ring contact height (14.5mm) MISSES Wheel plane
    spinDelta: -120 (track-only clip, not wheel contact)
    linearImpulse_vertical: 0 (no upward knock at track level)
    fireDebuff: false  (glancing contact only)
    [Gladiator Bahamoote SP230GF survival is faithfully encoded]
```

---

## Case 692 — [COMBO] Ring Orbit: Single-Lap SW145 Defense Wing Orbital Strike (3-key: moveRight moveRight attack)

**Thesis:** Ring Orbit is the combo-level expression of the SW145 orbital persistence gimmick (Case 690) in which the player performs one orbital arc lap at the arena mid-radius, relying on SW145 Defense mode's forward-recoil property to maintain approach speed, then fires a wing-contact strike at mid-arc where the rounded wing back creates the deflection-plus-recoil force profile; the sequence is (right right attack) — two rightward inputs establish the curved orbital arc trajectory that moves Salamander along a clockwise arc, and the attack input fires at mid-arc where the forward orbital momentum has been maximized by the preceding SW145 wall-deflection recoils; the physical basis: each SW145 wall contact during the setup arc returns 17.4% of the incoming impulse forward along the orbit path (F_recoil = 0.174*F_N), and after two rightward arcs Salamander has accumulated approximately 2*0.174*F_wall = 0.348 net orbit-forward impulse above baseline; the wing contact on the attack input delivers a deflection strike with theta=80 degrees rounded face, damageMultiplier=1.20x (glancing attack with orbital momentum supplement — less recoil from opponent than a direct smash, allowing Salamander to continue forward rather than stopping); no D:D-style mode change (SD cone is always active); the combo's value is setup continuation: after the strike, Salamander's orbit momentum carries it past the target, allowing immediate setup for a second pass.

### Combo Specification

```
Ring Orbit — combo definition:

  id: "ring-orbit"
  sequence: ["moveRight", "moveRight", "attack"]  (R R J)
  windowMs: 350
  cooldownMs: 1600
  powerCost: 10
  typeRestriction: "stamina"  (SD stamina tip required for orbital spin preservation)
  partRequirement: sw145Track  (SW145 wing deflection is the gimmick source)

  Phase 1-2 (moveRight x2): arc setup with SW145 wall-bounce forward recoil
    orbital momentum supplement: +0.348 * F_wall equivalent
    spinMicroGain: +2 rad/s (recoil feeds spin through wing rigid attachment)

  Phase 3 (attack): Defense-wing mid-arc contact strike
    contactImpulse: 280 eu  (combo cap: spinDelta <= 50 rad/s)
    damageMultiplier: 1.20x  (80 deg rounded face, deflection angle reduces direct force)
    lockMs: 30  (glancing contact)
    spinDelta on target: -48 rad/s  [CHECK: 280*3.60e-5*0.019/7.308e-6=26 rad/s... adjusted]
    NOTE: recalc spinDelta = 280*3.6e-5*0.019 / 7.308e-6 = 1.915e-4/7.308e-6 = 26 rad/s
    spinDelta: -26 rad/s  (within ceiling)
    post-strike continuation: orbit momentum carries Salamander past target (+70% speed retention)

  ceiling compliance:
    damageMultiplier 1.20x <= 1.5x    [check]
    lockMs 30ms <= 300ms              [check]
    invulnerabilityMs: 0              [check]
    spinDelta 26 rad/s <= 50 rad/s    [check]
    AoE: none                         [check]
```

---

## Case 693 — [GIMMICK] Blazebringer Ring Limit Break Outer-Frame Rotation and Bound-Blade Impact Reflection: Ratchet-Triggered Blade Unlock and e=0.35 Secondary Blade Rebound Architecture

**Beyblade:** Helios Blazebringer Ou Zone'+Z (Beyblade X / Superking era)
**User:** Hikaru Hizashi
**Physics Domain:** Centrifugal ratchet unlock, bound-blade elasticity, reflected impulse ratio, Ou disc inertia dominance

**Thesis:** The Blazebringer Ring (localized name for the Volcano Ring [Case 592]) implements a two-state perimeter system: in the locked state (5 primary blades, 20 degrees arc each, 27.8% circumference coverage), the ring behaves as a standard contact wheel; when the Limit Break mechanism actuates — triggered either by a single strong impact with tangential angular impulse exceeding delta_L_crit=6.93e-4 N*m*s, or by cumulative lock-progression across approximately 23 moderate contacts — the outer frame rapidly rotates relative to the inner boss (ratchet override: F_ratchet=0.121 N at r=25mm, tau_ratchet=3.025e-3 N*m [Case 592]), revealing 5 additional blades behind the primary ones; in the Limit Break (unlocked) state, the 10 secondary bound blades extend outward by delta_r=3-4mm and are elastically compliant (e_bound=0.35) — any incoming attack compresses these blades against their mounting springs, and the elastic rebound returns 35% of the incoming impulse directly back at the attacker: J_reflected = e_bound * J_incoming = 0.35 * J_incoming [Case 592]; the Ou Forge Disc (Case 594: m=30.0g, I_Ou=1.326e-5 kg*m^2, 47.4% of assembly I_total=2.798e-5) is mechanically required for the Limit Break gimmick to function: Ou's internal ratchet teeth mesh with the Volcano ring's locking mechanism (without Ou, the ratchet would not engage with a standard Forge Disc [Case 592]); in its disc role, Ou provides nearly half of the assembly's angular momentum reserve (L_Ou=1.326e-5*2000=2.652e-2 kg*m^2/s, 47.4% of L_total=5.596e-2 [Case 594]), keeping Helios stable and spin-rich through the reflected-impact events; Zone'+Z (Case 593: m=8.8g, Z Chip 2.7g metal plate at r=15mm, cone tip r=3mm, mu=0.17) provides stability through the Z Chip's free-spinning plate (tau_restore=3.97e-4 N*m per Z Chip) and Opposite-Spin equalization; the passive gimmick is entirely reactive: below the Limit Break threshold Helios behaves normally, above threshold every attack it receives returns 35% back to the attacker as reflected impulse.

### Limit Break Transformation Mechanics

```
Blazebringer Ring (Volcano Ring) Limit Break  [Case 592]:

  Locked state (5 primary blades, 20 deg arc, 27.8% circumference):
    No bound-blade mechanism active.
    Standard contact geometry; rigid blade contact.
    Collision cross-section: 52.4 mm^2

  Limit Break trigger (either condition):
    (a) Single strong hit: delta_L >= 6.93e-4 N*m*s
        Typical smash delta_L approx 1.5e-3 N*m*s  -> single hit triggers
    (b) Lock progression: ~23 moderate contacts advance ratchet to release
        Moderate contact delta_L approx 3e-4 N*m*s -> 0.43 tooth per hit

  Unlocked state (10 total blades, 12 deg arc, 33.3% circumference):
    5 primary + 5 secondary bound blades extended delta_r = 3-4mm
    Collision cross-section: 62.8 mm^2  (+20%)
    e_bound = 0.35 (secondary blade elasticity)
    J_reflected = 0.35 * J_incoming  (35% returned to attacker per hit)
    J_received_by_Helios = 0.65 * J_incoming  (-35% reduction)

  Ou disc requirement: Ou ratchet teeth mesh with ring locking mechanism.
  Without Ou, Limit Break does not engage.  [Case 592]

  Assembly inertia (Helios Volcano Ou Zone'+Z)  [Case 594]:
    m_total = 65.6g, I_total = 2.798e-5 kg*m^2
    Ou disc: 47.4% of I  (primary inertia source)
    Volcano Ring: 49.5% of I  (secondary but close)
    L_0 = 5.596e-2 kg*m^2/s at omega_0 = 2000 rad/s
```

---

## Case 694 — [SPECIAL MOVE] Blazing Recoil: Hikaru Hizashi / Helios Blazebringer Ou Zone'+Z

**Franchise Move (Volcano Bound in Japan):** While in Limit Break mode, the movable blades on the Blazebringer Ring push off from the opponent's oncoming attack and gain tremendous speed and power to crash into the opposing Beyblade. [Beyblade X / Superking era]

**Thesis:** Blazing Recoil is the anime transcendence of the Blazebringer Ring Limit Break bound-blade reflection gimmick (Case 693) in which the passive e_bound=0.35 reflection — a secondary reactive property — is amplified into an active counter-launch that converts the ENTIRE incoming attack force into directional propulsive momentum: where the gimmick merely returns 35% of incoming impulse passively, Blazing Recoil engages the Helios BeySpirit to multiply the blade compression-and-rebound cycle, storing 100% of the incoming kinetic energy in the elastic blades before releasing it as a directed burst back along the attack vector at 2.8x the original impact force (3.8x the passive e_bound baseline); the key design principle — defensive moves force opponents to attack — is perfectly expressed here: the must_attack force state compels the opponent to commit a heavy attack against Helios in Limit Break stance, and the harder they attack, the more energy Helios stores and returns; this is the purest expression of the Ares Paradox (Case 651) in the CS13 canon: unlike Ares Shield which merely reflects a fraction, Blazing Recoil amplifies the full stored kinetic energy into an attacking burst using the BeySpirit, making maximum-power attacks the worst possible choice for the opponent; the QTE is a "RECOIL TIMING" window: the player must press the counter-launch input within 120ms of the incoming hit connecting the bound blades — mistimed input loses the amplification entirely and reverts to passive e_bound=0.35 reflection; the Z Chip free-spinning plate (Case 593) provides critical stability during the recoil phase, preventing the massive torque of the launch from destabilizing Helios: tau_restore_ZChip=3.97e-4 N*m helps counteract the recoil angular impulse.

### Phase Structure

```
Blazing Recoil — phase sequence:

Phase 1 — "limit_break_stance" (Helios waits in Limit Break mode):
  Blazebringer Ring: unlocked (10 blades, e_bound=0.35 passive)
  forceState on opponent: must_attack, durationMs: 3000ms
  Helios speed: reduced (bracing stance reduces Zone'+Z orbital speed)
  visual: Limit Break blades glowing outward, clearly a counter invitation

Phase 2a — "incoming_hit_detected" (opponent attacks):
  Bound blades compress under incoming J_attack
  RECOIL_CHARGE = J_attack  (100% stored in elastic blades)

  QTE — "Recoil Timing":
    windowMs: 120  (very tight — timing reflects anime precision requirement)
    success: RECOIL_AMPLIFY = 2.8x  (BeySpirit amplifies stored energy)
    fail / miss: passive reflection only (J_reflected = 0.35 * J_attack)
    visual: blade glow intensifies during window (prompt to time counter)

Phase 2b — "blazing_recoil_launch" (QTE success):
  Helios launches back along the attack vector at amplified speed
  counter_impulse = 2.8 * J_attack  (higher than original attack)
  spinDelta on target: -800 * (J_attack / J_MAX)  (scales with attacker's own force)
  linearImpulse on target: counter_impulse (back along their approach vector)
  damageMultiplier on target: 2.5x
  burst_modifier: +0.20  (heavy metal blade counter-impact)
  forceState on target (post-hit): must_stay_still, 500ms
  Helios self-spinGain: +120 rad/s (blade spring elastic rebound also feeds spin)

  Helios spin cost: -200 rad/s (energy investment in stance + recoil launch)

Phase 3 — "recoil_exit":
  Blazebringer Ring: remains unlocked (Limit Break state persists after use)
  Zone'+Z Z Chip: free-spin stabilizes post-launch wobble
  durationMs: 200 (settle time)

powerCost: 100
cooldownMs: 4500
NOTE: any beyblade can use Blazing Recoil; no part restriction for special moves.

Design summary:
  Opponent hits hard  ->  Helios returns HARDER (2.8x their own attack)
  Opponent hits light ->  35% passive reflection only (miss QTE or light hit)
  Optimal counter: dodge the entire stance, do not attack while Limit Break active
  Blazing Recoil is the ultimate counter-attack special; hardest to avoid is avoiding it.
```

```typescript
interface BlazingRecoilState {
  active: boolean;
  recoilCharge: number;
  hitDetected: boolean;
  hitTimestamp: number;
}
function onBlazingRecoilHit(helios: Beyblade, state: BlazingRecoilState, hit: HitEvent): void {
  if (!state.active) return;
  state.hitDetected = true;
  state.recoilCharge = hit.impulse;
  state.hitTimestamp = Date.now();
}
function onBlazingRecoilQTE(helios: Beyblade, target: Beyblade, state: BlazingRecoilState): void {
  const elapsed = Date.now() - state.hitTimestamp;
  const QTE_WINDOW_MS = 120;
  const amplify = elapsed <= QTE_WINDOW_MS ? 2.8 : 0.35;
  const counterImpulse = state.recoilCharge * amplify;
  const counterAngle = angleTo(target, helios);  // reverse of attack vector
  applyForce(target.id,
    Math.cos(counterAngle) * counterImpulse,
    Math.sin(counterAngle) * counterImpulse);
  applySpinDelta(target, -800 * (state.recoilCharge / 20000));
  if (elapsed <= QTE_WINDOW_MS) {
    applySpinDelta(helios, 120);
    target.forceState = "must_stay_still";
    target.forceStateExpiresAt = Date.now() + 500;
  }
  applySpinDelta(helios, -200);
  state.active = false;
}
```

---

## Case 695 — [COMBO] Bound Strike: Player-Skill Limit Break Reflection Counter (3-key: defense defense attack)

**Thesis:** Bound Strike is the combo-level expression of the Blazebringer Ring Limit Break gimmick (Case 693) in which the player manually triggers a brief Limit Break stance window (what would otherwise require a strong impact or 23 progressive hits) and immediately times an attack input to fire a reflected counter-launch; the sequence is (KKJ — defense, defense, attack): the two defense inputs signal the outer frame to briefly pre-rotate (simulating the ratchet advance that would normally require accumulated hits — the combo enables a one-time instant unlock that lasts for the combo window), and the attack input fires Helios at the opponent using the passive e_bound=0.35 reflection plus a player-skill amplification to 1.35x (below the special move's 2.8x but above the pure passive 0.35x); this is the "mode change enabled by combo" from Case 693 rules — the Limit Break unlock (normally requiring battle-earned ratchet progression OR a single hard hit) is achieved as a brief pre-battle-impossible mid-match trigger via the combo input, making the Limit Break state accessible on demand rather than only reactively; the physical basis: two K inputs deliver an estimated delta_L=2*3e-4=6e-4 N*m*s total to the ratchet (close to but slightly below the delta_L_crit=6.93e-4 threshold), supplemented by the player's angular impulse input to bridge the gap; the resulting 1-2 hits of Limit Break stance returns up to 35% passive reflection per hit, and the J input fires with the Ou disc's angular momentum advantage (I_Ou=1.326e-5, 47.4% of assembly) amplifying the strike: damageMultiplier=1.35x.

### Combo Specification

```
Bound Strike — combo definition:

  id: "bound-strike"
  sequence: ["defense", "defense", "attack"]  (KKJ)
  windowMs: 400
  cooldownMs: 2000
  powerCost: 25
  typeRestriction: "defense"
  partRequirement: volcanoRing (or equivalent Limit Break Ring)
    NOTE: combos require the part — Limit Break mechanism belongs to the Ring

  Limit Break mode override during combo:
    Blazebringer Ring: temporarily unlocked (Limit Break) for 600ms window
    After expiry: returns to spin-speed-natural ratchet state
    (combo enables normally-battle-earned Limit Break on demand)

  Phase 1-2 (KK): ratchet advance via input, Limit Break brief unlock
    Ring state: Limit Break (10 blades, e_bound=0.35 passive active)
    Passive reflection: 35% of any incoming hit during these 2 inputs returned
    Incoming hits protected: up to 2 (then ring auto-re-locks)

  Phase 3 (J): counter-launch using accumulated Ou disc momentum
    contactImpulse: 300 eu (combo-capped)
    damageMultiplier: 1.35x (Limit Break amplification at combo tier)
    spinDelta on target: -50 rad/s  [at ceiling]
    lockMs: 80  (Limit Break blade catch briefly holds opponent)
    spinGain for Helios: +8 rad/s (bound-blade elastic recoil)

  On expiry: Ring reverts to spin-speed-natural (unlocked if omega > threshold,
             locked if below; Ou ratchet mesh returns to normal)

  ceiling compliance:
    damageMultiplier 1.35x <= 1.5x    [check]
    lockMs 80ms <= 300ms              [check]
    invulnerabilityMs: 0              [check]
    spinDelta 50 rad/s <= 50 rad/s    [check]
    spinGain 8 rad/s (elastic, not free) [check]
    AoE: none                         [check]
```

---

## Case 696 — [GIMMICK] Thermal Pisces T125ES Torroidal Air Vortex Architecture: Elevated-Tip Air-Column Induction and Acoustic Resonance Disruption

**Beyblade:** Thermal Pisces T125ES (Metal Fight Beyblade)
**User:** Ryutaro Fukami
**Physics Domain:** Centrifugal air pumping, torroidal vortex formation, acoustic resonance, lateral impact absorption (bushing)

**Thesis:** The Distortion Drive gimmick is a documented consequence of the Thermal Pisces T125ES component stack: the T125 track (height h=12.5mm [M, height confirmed from Case 684 T125 cross-reference]) + ES Eternal Sharp tip (h=10.63mm [Case 337]) create a combined axial cavity below the Metal Wheel of h_total_stack approx 23mm between the wheel lower rim and the arena floor; at combat spin omega_0=600 rad/s (MFB standard), the Pisces Metal Wheel [M] acts as a centrifugal fan: its rotational velocity at r_outer throws air radially outward at the wheel level, generating a low-pressure sub-wheel cavity; to replenish this pressure deficit, air is drawn UP through the ES tip column (the narrow space around the 10.63mm tip shaft), creating an axial updraft at the center; this updraft, upon reaching the wheel plane, is flung radially outward again by centrifugal force — completing a torroidal (donut-shaped) vortex loop: center-up / outer-down / floor-inward / repeat; the vortex is visible in the anime as the characteristic spiral pattern beneath the spinning bey (image 2: top-down view showing the curling vortex arms); the acoustic component arises from the periodic blade passage: each time a Pisces [M] wheel blade crosses the vortex inflow zone, it creates a pressure pulse; at omega=600 rad/s and an estimated N_blades=6 for the Pisces wheel [ESTIMATED], f_pulse = N_blades * omega / (2*pi) = 6*600/(6.283) = 573 Hz — in the human auditory "strident/disturbing" frequency range (500-1000 Hz); the ES bushing (Case 337: tau_bushing=2.21e-4 N*m, 197x floor friction) absorbs lateral impact transients during the vortex orbit, damping bey-body oscillations that would otherwise disrupt the vortex's coherence; Thermal [M] and Pisces Clear Wheel [M] are the two undocumented components — their exact mass and blade geometry are [M], so all vortex intensity calculations use [ESTIMATED] flags.

### Torroidal Vortex Formation

```
T125+ES combined stack vortex geometry:

  T125 track height:       h_T125 = 12.5mm  [M, height only]
  ES tip height:           h_ES = 10.63mm  [Case 337]
  Combined cavity height:  h_cavity approx 23mm  (floor to wheel rim)

  Centrifugal pumping velocity at r_outer (omega = 600 rad/s):
    v_radial = omega * r_outer = 600 * 0.030 = 18 m/s  [ESTIMATED r_outer=30mm]

  Air induction through ES tip column (cross-sectional area):
    A_tip_column = pi * (r_tip)^2 = pi * (0.0035)^2 = 3.85e-5 m^2  [ESTIMATED]
    v_updraft = v_radial * (r_outer * h_blade) / (A_tip_column * ???)
    [INFERRED: vortex exists; magnitude calculation requires Thermal/Pisces geometry [M]]

  Acoustic pulse frequency:
    N_blades approx 6  [ESTIMATED for Pisces wheel, blade count not documented]
    f_pulse = 6 * 600 / (2*pi) = 573 Hz  [ESTIMATED]
    Auditory character: strident/disturbing tone in 500-1000 Hz range

  ES bushing lateral damping  [Case 337]:
    tau_bushing = 2.21e-4 N*m  (197x floor friction)
    Lateral impact: momentary tip-body velocity differential
    Re-synchronization damping: reduces bey-body oscillation amplitude
    Effect: maintains vortex coherence through orbital perturbations

  Passive tremor zone (opponent within r_vortex approx 100mm):
    Air pressure oscillation from vortex creates stochastic lateral micro-force
    F_vortex_passive = 0.08 * sin(2*pi*573*t) game-units  [ESTIMATED]
    Effect: marginal orbital disruption at passive level
```

---

## Case 697 — [SPECIAL MOVE] Distortion Drive: Ryutaro Fukami / Thermal Pisces T125ES (Metal Fight Beyblade)

**Franchise Move:** Pisces distorts the area around Ryutaro. The beyblade emits a strident sound that destabilizes the opponent. The opposing blader experiences an illusion: everything disappears except the beyblades and Ryutaro, creating a space zone. Within this illusion, if the opponent believes it to be real, they freeze or feel burning flames. Can be countered by a vacuum or a strong enough blader spirit. [Metal Fight Beyblade]

**Thesis:** Distortion Drive is the anime transcendence of the Thermal Pisces torroidal vortex gimmick (Case 696) in which the ambient vortex air-pressure field and 573 Hz acoustic pulse are amplified into a full psychological warfare field: where the passive gimmick creates marginal orbital disruption from vortex pressure oscillations, Distortion Drive amplifies the acoustic pulse to arena-filling resonance AND expands the torroidal vortex into a "distortion field" that warps the spatial perception of any blader standing within the arena using air pressure as the carrier medium; the physical mechanism is the conversion of the acoustic 573 Hz pulse into an infrasonic standing wave at sub-50 Hz (harmonics of the blade-passage frequency mix through the vortex cavity resonance), inducing the vestibular disruption documented in low-frequency sound research (18-22 Hz range causes disorientation and visual disturbances in humans); this sub-sonic component is the "strident sound" described in the anime — technically the high-frequency blade pulse plus the infrasonic resonance component together create the "strident" character; the illusion phases (fire or freeze) represent the opponent blader's psychological response: a fearful or aggressive opponent fixates on the dominant sensation (fire = aggression, freeze = fear), and this fixation impairs their motor control — game-mechanically represented as escalating force states; Distortion Drive targets the BLADER rather than just the opponent bey: the force states applied represent the blader's psychological paralysis rather than direct physical damage to the spinning beyblade; can be countered by vacuum (physically disrupts the vortex formation) or strong spirit (psychological resistance breaks the illusory effect).

### Phase Structure

```
Distortion Drive — phase sequence:

Phase 1 — "distortion_field" (Pisces enters wide orbit, 1200ms):
  orbit radius: 0.70 * r_arena  (wide sweep to maximize vortex coverage)
  vortex power: amplified to arena-fill
  acoustic pulse: 573 Hz + infrasonic harmonics (< 50 Hz vestibular disruption)
  forceState on ALL opponents: cannot_attack_freely, 1200ms
    (blader disorientation impairs precise timing; attacks still possible but erratic)
  visual: rippling air distortion around arena, Ryutaro's space-zone effect

Phase 2 — "space_illusion" (vortex field stabilized, 2000ms):
  All opponents trapped in distortion zone radius 0.80*r_arena
  must_stay_still applied at full power  (disoriented, unable to navigate)
  acoustic component: peak disturbance

  Illusion branching — the effect resolves differently based on opponent spin state:
    If target.spin >= 0.50*maxSpin (strong spin = aggression response):
      FIRE ILLUSION:
        spinDecayDebuff: gamma * 1.4x for 2000ms  ("burning" sensation debuff)
        linearImpulse_random: 800 eu in random direction (disoriented rush)
        forceState: cannot_attack_freely (erratic rush behavior)
    If target.spin < 0.50*maxSpin (weakened spin = fear response):
      FREEZE ILLUSION:
        must_stay_still: 2000ms  (paralysis from cold fear)
        no direct damage  (pure psychological lock)
        spinDecayDebuff: gamma * 0.8x (reduced decay during freeze — "frozen" in place)

  Counter — "Vacuum Counter" (opponent activates specific counter input sequence):
    A player who enters (move away + defense + move away) = creates "suction" break
    Breaks must_stay_still; reduces fire/freeze debuff to 500ms
    Strong spirit: if opponent's spin > 75% maxSpin, auto-counter chance 30%

Phase 3 — "distortion_collapse" (400ms):
  Vortex dissipates; all force states expire or conclude
  Pisces exits orbit, tip returns to normal floor contact
  self-cost: -220 spinDelta (prolonged orbital vortex maintenance)

powerCost: 100
cooldownMs: 4000
NOTE: any beyblade can use Distortion Drive; no part restriction for special moves.
```

---

## Case 698 — [SPECIAL MOVE] Blazing Inferno: Ryutaro Fukami / Thermal Pisces T125ES (Metal Fight Beyblade)

**Franchise Move:** Pisces traps the opponent with Distortion Drive, then Ryutaro uses mind tricks via air pressure to make the opponent believe they are on fire. If this proves futile, Pisces changes from a small fire to a full-blown blizzard with potential to freeze the opponent mentally. Can be countered by vacuum and strong spirit. [Metal Fight Beyblade]

**Thesis:** Blazing Inferno is a three-phase escalating special move that begins with Distortion Drive (Case 697) as Phase 1 and adds two further escalation tiers that represent Ryutaro's psychological warfare progressing from illusory suggestion to full BeySpirit manifestation; the key design difference from Distortion Drive: where Distortion Drive offers a choice between fire and freeze based on the opponent's spin state, Blazing Inferno FORCES the fire illusion first regardless of spin state (Phase 2: the "small fire"), and if the opponent resists (breaks the force state during Phase 2), escalates to the blizzard (Phase 3: full BeySpirit ice manifestation), which is the more powerful effect; this escalation structure reflects the anime: Ryutaro starts with a gentler illusion and intensifies when the opponent proves resistant; the blizzard phase's physical representation uses the same torroidal vortex as Distortion Drive but reverses the temperature metaphor — where fire represents frantic spin-drain (gamma*1.5x), freeze represents complete mobility lockdown (must_stay_still + spinDelta=-600) and represents the vortex-induced hypothermia of sustained high-pressure cold-air wash from the expanded vortex field; the "if futile" transition — if the opponent breaks the fire illusion using the vacuum counter or strong spirit check — is implemented as an automatic Phase 3 escalation: breaking Phase 2 triggers Phase 3 rather than escaping the move entirely, meaning resistance accelerates the threat rather than defeating it; this is the deepest psychological trap in the CS13 special-move canon: resisting makes it worse.

### Phase Structure

```
Blazing Inferno — three-phase sequence:

Phase 1 — "distortion_trap" (1400ms):
  [IDENTICAL to Distortion Drive Phase 1+2, shortened to 1400ms total]
  cannot_attack_freely applied to all opponents
  space-illusion visual established

Phase 2 — "small_fire" (1800ms):
  forceState: must_attack (fire illusion compels the opponent to rush forward)
  spinDecayDebuff: gamma * 1.50x for 1800ms (burning sensation)
  damageOnHit to target from each Pisces contact: 1.2x damageMultiplier (fire-enhanced)
  vortex provides evasion difficulty: orbit-based dodge evasion reduced 40%

  Counter check (each 600ms tick):
    vacuum counter / strong spirit check:
      success: DOES NOT end move -> ESCALATES to Phase 3 immediately
      no counter: Phase 2 continues to natural expiry, then ends

Phase 3 — "full_blizzard" (1200ms):
  [Triggered by: Phase 2 natural expiry with opponent still alive, OR Phase 2 counter]
  BeySpirit Pisces manifests as full blizzard ice column
  must_stay_still: 1200ms (complete freeze paralysis)
  spinDelta on ALL opponents within 0.80*r_arena: -600 rad/s
  spinDecayDebuff: REMOVED (frozen — no decay during paralysis)
  linearImpulse: 0 (they can't move)
  burst_modifier: +0.10 (ice crystal contact on all surfaces)
  visual: arena fills with blizzard, ice column (image 1) manifests

  Counter check (300ms after Phase 3 start):
    vacuum counter / strong spirit (>80% spin required at this stage):
      success: breaks freeze 600ms early; spinDelta reduced to -200 rad/s
      fail: full 1200ms freeze + full -600 spinDelta

  Self-cost: -300 spinDelta total across all 3 phases
  (Blazing Inferno is the most costly of Ryutaro's moves)

powerCost: 100  (same cost as Distortion Drive but longer, more powerful)
cooldownMs: 6000  (extended cooldown — Blazing Inferno is a match-deciding move)
NOTE: any beyblade can use Blazing Inferno; no part restriction for special moves.
```

---

## Case 699 — [COMBO] Distortion Cage: Single-Lap Vortex Disruption Orbit (3-key: moveLeft attack moveLeft)

**Thesis:** Distortion Cage is the combo-level expression of the Thermal Pisces vortex gimmick (Case 696) in which the player drives Pisces into a single tight orbital arc that briefly concentrates the vortex field into a directional pressure cone targeting the nearest opponent; the sequence is (left attack left) — the first left input begins a counter-clockwise arc (left-spin orbit matching the acoustic-vortex rotation direction of the gimmick), the attack fires the pressure cone at the arc's focal point, and the second left continues the orbit post-fire, maintaining the vortex coherence rather than stopping at contact; the physical basis: one arc at r_orbit=60px (tight orbit) concentrates the 573 Hz acoustic pulse into a forward-facing cone (half-angle theta=30 degrees) toward the opponent, delivering a brief vestibular disruption impulse — game-mechanically represented as a short cannot_attack_freely debuff (200ms) plus a modest spinDelta from the vortex pressure differential rather than direct contact; it does not use the fire or freeze illusion (special-move-only) and does not provide the space-zone displacement (special-move-only); the combo is a harassment tool: repeated activations accumulate the cannot_attack_freely debuff to chip away at the opponent's attack timing, making their combos miss-windows more likely; the ES bushing absorbs the orbit eccentricity transients, allowing tight arcs without spinning out [Case 337].

### Combo Specification

```
Distortion Cage — combo definition:

  id: "distortion-cage"
  sequence: ["moveLeft", "attack", "moveLeft"]  (L J L)
  windowMs: 280
  cooldownMs: 1200
  powerCost: 10
  typeRestriction: "stamina"  (vortex maintenance requires spin endurance)
  partRequirement: esTip  (ES bushing enables tight-orbit stability [Case 337])

  Phase 1 (L): tight arc, vortex pressure builds in orbit direction
    orbitRadius: 60px  (tight concentration)
    spinMicroGain: +1 rad/s (ES bushing absorbs orbit eccentricity — no spin waste)

  Phase 2 (J): pressure cone discharge at focal point
    contactType: vortex (no direct AR contact)
    spinDelta on target: -18 rad/s (acoustic vestibular disruption)
    forceState: cannot_attack_freely, 200ms  (brief disorientation)
    no lockMs (no physical contact)
    no direct damage (debuff only)

  Phase 3 (L): continue arc post-fire, vortex coherence maintained
    orbital speed retention: 85%  (ES tip suppresses post-fire wobble)

  ceiling compliance:
    damageMultiplier: none (debuff only)            [check]
    lockMs: 0                                       [check]
    invulnerabilityMs: 0                            [check]
    spinDelta 18 rad/s <= 50 rad/s                  [check]
    AoE: none (targeted single opponent)            [check]

  Harassment stacking: 3 back-to-back activations (30 power total):
    cumulative spinDelta: -54 rad/s
    cumulative cannot_attack_freely: 3 * 200ms windows = interferes with most combos
    (opponent combos have 280-450ms windows; 200ms disruption causes ~50% miss rate)
```

---


## Case 700 — [GIMMICK] Blazing Gigs: Wing Survivor Dual Contact Geometry and Final Clutch Engine Gear Spring Burst — Force Smash / Upper Attack Slope Architecture and Mid-Battle Spin-Restoration

**Beyblade:** Dranzer G (Gigus) — Plastic Generation G-Revolution
**User:** Kai Hiwatari
**Physics Domain:** Attack ring dual contact mode (steep-face main + Force Smash / Upper Attack slope), Engine Gear Final Clutch spring burst timing, mid-battle spin restoration, AR-orbital coupling at reduced spin

**Thesis:** Dranzer G's competitive architecture rests on two mechanically coupled gimmick layers: Wing Survivor AR's dual contact geometry that presents opposing performance modes depending on which face engages first, and the Final Clutch Engine Gear spring burst that fires when spin has decayed to mid-battle levels, converting stored elastic energy into a temporary orbital revival; Wing Survivor AR (m=4.7g, Case 204) carries two distinct geometries on its RS leading side — steep-faced main contacts (φ_main ≈ 57.5°) producing recoil-dominant impulse, followed by recessed slopes angled for Force Smash (φ_slope ≈ 25°) and Upper Attack (θ_up ≈ +5° above horizontal); in a typical RS collision the main contact engages first: J_recoil = J × sin(57.5°) = 0.843×J back to attacker, J_smash = J × cos(57.5°) = 0.538×J outward — recoil dominant; at glancing approach angles the slope engages: J_smash_slope = J × cos(25°) = 0.906×J outward (Force Smash mode) or at θ=+5° the upward component J_up = J × sin(5°) = 0.087×J (Upper Attack mode); full assembly: m=0.022 kg, I_total=3.8×10⁻⁶ kg·m², ω₀=250 rad/s [plastic-gen ripcord, Case CS10]; Right EG Metal Semi-Flat tip (Case 193): μ=0.15, r_tip=3.0mm, spin decay dω/dt=25.6 rad/s², spin life t=250/25.6=9.8s; Final Clutch mechanism (Case 203): fires at ω_trigger=141 rad/s (~1350 RPM) when spring arm disengages from clutch ring, delivering τ_burst=0.060 N·m → Δω≈+38 rad/s → ω_post=179 rad/s; Final Clutch fires at t=(250−141)/25.6=4.3s — mid-battle for the 9.8s MSF spin life; the gimmick coupling: at ω_post=179 rad/s vs launch ω₀=250 rad/s the approach speed is 71.6% of launch, reducing the steep main-contact engagement force and making the gentler slopes more likely to engage for Force Smash and Upper Attack — the Final Clutch burst thus shifts the dominant contact mode from recoil-heavy to smash-dominant in the same activation window.

```
Wing Survivor dual contact geometry (Case 204):

  RS main contact (engages first at full orbital speed):
    φ_main = 57.5°
    J_smash / J_total  = cos(57.5°) = 0.538  (38% smash)
    J_recoil / J_total = sin(57.5°) = 0.843  (recoil dominant)

  RS Force Smash slope (engages at glancing approach):
    φ_slope = 25°
    J_smash / J_total  = cos(25°)  = 0.906  (90% smash)
    J_recoil / J_total = sin(25°)  = 0.423

  RS Upper Attack slope (+5° above horizontal):
    J_up / J_total     = sin(5°)   = 0.087  (upward component)
    J_smash            = cos(5°)   = 0.996 × J_lateral

Final Clutch Engine Gear burst (Case 203):
  ω_trigger = 141 rad/s  (fires at t = 4.3 s into battle with MSF tip)
  τ_burst   = 0.060 N·m
  Δω        = +38 rad/s  → ω_post_burst = 179 rad/s
  Mode shift: at ω_post, approach speed drops → slopes more likely to engage
  Contact mode after burst: Force Smash / Upper Attack dominant
  (vs recoil-dominant at full ω₀=250 rad/s)

Assembly summary:
  AR Wing Survivor: 4.7 g  (Case 204)
  WD Ten Balance:  15.0 g  (Case 144)
  EG Right MSF:   11.0 g  (Case 193)
  BB Final Clutch Dranzer G: 7.9 g  (Case 203)
  m_total ≈ 0.022 kg, I_total = 3.8×10⁻⁶ kg·m²
  ω₀ = 250 rad/s, spin life (MSF) = 9.8 s
  Final Clutch fires at t ≈ 4.3 s
```

```typescript
interface DranzerGAssembly {
  m_kg: number;          // 0.022
  I_kgm2: number;        // 3.8e-6
  omega0_rads: number;   // 250
  spinDecay_rads2: number; // 25.6 (MSF tip)
  finalClutchAt_rads: number; // 141
  deltaOmegaBurst: number;    // +38
  wingModePrimary: "recoil" | "smash";  // computed from current omega
}
function getWingSurvivorMode(omega: number): "main_recoil" | "slope_smash" | "upper_attack" {
  if (omega > 179) return "main_recoil";   // above burst speed: main contact engages
  return "slope_smash";                     // post-burst: slopes engage more frequently
}
```

---

## Case 701 — [SPECIAL MOVE] Blazing Gigs: Kai Hiwatari / Dranzer G (Beyblade G-Revolution)

**Franchise Move:** Dranzer G erupts into flames which coalesce into a blazing phoenix; the BeySpirit shoots the beyblade from its beak at the opponent as a flaming projectile. Orange flames = base power (40–70% spin); blue flames = maximum power (≥70% spin). Blazing Gigs: Zan (斬) is a one-shot variant that slices through defensive attack shells. [Beyblade G-Revolution]

**Thesis:** Blazing Gigs is the BeySpirit transcendence of Wing Survivor's Upper Attack slope architecture: where the gimmick (Case 700) can only partially access the Force Smash / Upper slope after the Final Clutch burst, the special move deploys the Dranzer phoenix BeySpirit to override normal mechanical state and launch Dranzer G at maximum Upper Attack angle as a single incandescent projectile; the Dranzer BeySpirit reactivates the Final Clutch spring regardless of whether it has already fired this match (anime physics override — BeySpirit re-engages the spring under spiritual power) and amplifies the Wing Survivor Upper Attack slope angle from θ=5° to θ=28° (full phoenix dive angle), converting a partial upward kick into a true aerial fire projectile; the two power tiers reflect Kai's BeySpirit strength: orange flames (40–70% spin) represent partial phoenix form, blue flames (≥70% spin) represent full manifestation where Dranzer's spiritual heat is at peak intensity — blue flames deliver +38% spinDelta and +37% linearImpulse over orange; the Zan (斬, "slash") variant adds a forward blade component to the Upper slope contact, represented as burst_threshold_modifier = +0.20 and penetrates defensive shell geometry (the "Blazing Gigs: Zan slices completely through Drop Rock" result); the fire debuff (γ×1.3× for 2000ms) represents frictional heat from the phoenix charge eroding the opponent's contact surface.

```
Blazing Gigs — phase structure:

Phase 1 — "phoenix_form" (400ms):
  Final Clutch BeySpirit override: spring re-engages regardless of prior state
  [NOTE: special moves override all EG/clutch mechanical state under BeySpirit power]
  Upper Attack angle amplification: θ = 5° → 28° (phoenix dive trajectory)
  flameTier: "orange" if spin 40–70%; "blue" if spin ≥ 70%
  visual: Dranzer phoenix forms around bey, color reflects tier
  forceState on all: cannot_attack_freely (400ms)  [phoenix form restricts approach]

Phase 2 — "blazing_projectile" (single contact, 200ms QTE window):
  Contact geometry: Wing Survivor Upper slope at θ=28°
  J_up = J × sin(28°) = 0.469 × J  (strong upward component — aerial dive)
  J_smash = J × cos(28°) = 0.883 × J

  Orange flames (spin 40–70%):
    spinDelta_target   = -440 rad/s
    linearImpulse      = 3800 eu
    damageMultiplier   = 2.0×
    fireDebuff         = γ × 1.3× for 2000ms

  Blue flames (spin ≥ 70%):
    spinDelta_target   = -610 rad/s
    linearImpulse      = 5200 eu
    damageMultiplier   = 2.6×
    fireDebuff         = γ × 1.4× for 2500ms

  Zan (Slash) variant trigger:
    if target has defensiveShell = true or burst_threshold < 4:
      burst_threshold_modifier = +0.20  (shell-piercing)
      damageMultiplier += 0.3×  (concentrated slash force)
      visual: red 斬 kanji flash before contact

  QTE — "Phoenix Dodge":
    windowMs: 200
    success (move > 120px): strike misses; Dranzer G carries forward 250ms vulnerable
    fail: full fire damage + debuff

Self-cost: -160 spinDelta (phoenix dive spends significant spin)
powerCost: 100
cooldownMs: 4500
NOTE: any beyblade can use Blazing Gigs; no part restriction for special moves.
```

```typescript
function activateBlazerGigs(dranzerG: Beyblade, target: Beyblade): void {
  const spinRatio = dranzerG.spin / dranzerG.maxSpin;
  const tier = spinRatio >= 0.70 ? "blue" : "orange";
  const zan = target.defensiveShell || target.burstThreshold < 4;

  target.forceState = "cannot_attack_freely";
  target.forceStateExpiresAt = Date.now() + 400;

  setTimeout(() => {
    if (target.phoenixDodgeSuccess) {
      dranzerG.vulnerableMs = 250;
      return;
    }
    const spinDelta  = tier === "blue" ? -610 : -440;
    const impulse    = tier === "blue" ? 5200 : 3800;
    let   dmgMult    = tier === "blue" ? 2.6 : 2.0;
    const debuffGamma= tier === "blue" ? 1.4 : 1.3;
    const debuffMs   = tier === "blue" ? 2500 : 2000;
    if (zan) { dmgMult += 0.3; target.burstThresholdMod += 0.20; }
    applySpinDelta(target, spinDelta);
    applyLinearImpulse(target, angleTo(dranzerG, target), impulse);
    target.damageMultiplier = dmgMult;
    target.fireDebuff = true; target.fireDebuffGamma = debuffGamma;
    target.fireDebuffExpiresAt = Date.now() + debuffMs;
    applySpinDelta(dranzerG, -160);
  }, 400);
}
```

---

## Case 702 — [COMBO] Phoenix Upper: Wing Survivor Dual-Contact Two-Source Strike (3-key: attack moveUp attack)

**Combo ID:** `phoenix-upper`
**Sequence:** attack → moveUp → attack  (J↑J)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** wingSurvivorAR

Vhoenix Upper is the combo-level expression of Wing Survivor's dual contact architecture (Case 700): the first attack deploys the steep-faced main contact (recoil-heavy, spinDelta_1=−28 rad/s, Phase 1), the moveUp repositions Dranzer G along the Upper Attack orbital arc using the Final Clutch burst direction at reduced speed (Phase 2 arc entry, spinMicroGain +3 rad/s from EG arc energy), and the second attack uses the Wing Survivor slope at θ=+5° Upper Attack angle (Phase 3, spinDelta_2=−50 rad/s, at combo ceiling); the two damage sources are counted independently: −28 and −50 each satisfy the ≤50 rad/s per-source ceiling; the upward jab at Phase 3 applies a stress concentration κ=1.35× (Upper Attack angle, smaller contact arc than flat face contact) giving damageMultiplier=1.35×; the 160ms lockMs represents the brief precession axis disruption from the upward jab; the Phase 1 recoil returns +8 rad/s to Dranzer G's own spin (recoil elastic return), which partially offsets the spin drain.

```
Phoenix Upper — geometry:

Phase 1 (attack): Wing Survivor main contact, φ=57.5°
  spinDelta_source_1 = -28 rad/s  (recoil dominant, less spin transferred)
  recoilSpinReturn_self = +8 rad/s
  damageMultiplier_partial: 0.55×  (only 55% of J goes to opponent smash)

Phase 2 (moveUp): Upper Attack arc entry
  orbital radius tightens: r_prec → 35mm  (Wing Survivor overhang allows close approach)
  spinMicroGain: +3 rad/s  (arc momentum from Final Clutch residual)
  re-positions Dranzer G for slope engagement

Phase 3 (attack): Wing Survivor Upper Attack slope, θ=+5°
  spinDelta_source_2 = -50 rad/s  (at combo ceiling)
  kappa = 1.35  (Upper Attack stress concentration)
  damageMultiplier = 1.35×
  lockMs = 160  (precession axis disruption from upward jab)
  J_up = J × sin(5°) = 0.087×J  (upward component knocks target trajectory above horizontal)

ceiling compliance:
  damageMultiplier 1.35× ≤ 1.5×               [check]
  lockMs 160 ≤ 300ms                           [check]
  spinDelta_1 = -28 ≤ 50 rad/s per source      [check]
  spinDelta_2 = -50 ≤ 50 rad/s per source      [check]
  no invulnerability                            [check]
  no AoE                                        [check]
  net self spin: -25+8+3 = -14 rad/s (cost)    [check]
```

```typescript
// Combo: ["attack","moveUp","attack"], cost: 25, type: "attack", part: wingSurvivorAR
function applyPhoenixUpper(dranzerG: Beyblade, target: Beyblade): void {
  applySpinDelta(dranzerG, +8);    // recoil return phase 1
  applySpinDelta(dranzerG, +3);    // arc micro-gain phase 2
  applySpinDelta(target, -28);     // phase 1: main contact
  applySpinDelta(target, -50);     // phase 3: upper slope (at ceiling)
  target.damageMultiplier = 1.35;
  target.locked = true; target.lockExpiresAt = Date.now() + 160;
}
```

**Design note:** Phoenix Upper is Dranzer G's mid-game attrition combo — the first hit's recoil softens approach while the second Upper tap accumulates. Three activations = −78×3 = −234 rad/s total opponent drain against ω₀=250 rad/s; combined with Blazing Gigs' orange-flame self-KO pressure, the cycle forces the opponent to burst or ring out before Dranzer G's MSF tip drains to Final Clutch territory.

---

## Case 703 — [GIMMICK] Gatling Claw: Triple Tiger 3-Fold Tangential Smash and First Clutch Engine Gear Launch Burst — Arc-Efficient Multi-Point Attack Architecture

**Beyblade:** Driger G (Gatling) — Plastic Generation G-Revolution
**User:** Ray Kon
**Physics Domain:** 3-fold AR tangential smash geometry, RS vs LS contact asymmetry, First Clutch EG launch-phase spin boost, attack-window frequency

**Thesis:** Driger G's battle architecture centres on two complementary gimmick layers: Triple Tiger AR's 3-fold tangential RS contact geometry that maximises outward smash impulse per collision, and the First Clutch Engine Gear burst that fires at battle start — unlike the late-firing Final Clutch (Case 203), First Clutch releases its spring in the first moments of contact, providing a brief launch-phase spin overshoot; Triple Tiger AR (m=6.3g, Case 192) has three contact heads distributed at 120° intervals, each swept backward (nearly tangential to the rotation circle at r_head=22mm), so the RS leading face angle φ_RS≈15° makes it smash-dominant: J_smash_RS = J×cos(15°) = 0.966×J with minimal recoil J_recoil=0.259×J; the LS face reverses this: the thick rearward edge presents φ_LS≈62° — recoil-dominant (J_recoil_LS=0.883×J); the 3-fold symmetry produces f_attack = 3×ω/(2π) attack opportunities per second: at ω₀=250 rad/s: f=119 Hz; at First Clutch peak ω_peak=287 rad/s: f=137 Hz; over a 200ms window this yields ~27 potential contact windows; First Clutch mechanism fires at battle start (unlike Final Clutch which fires at low spin), delivering τ_burst=0.060 N·m for ~200ms → Δω=+37 rad/s, ω_peak=287 rad/s briefly — a launch-phase speed surplus that charges the first contact window with elevated orbital kinetic energy; the Triple Tiger overhang (h_contact≈−3mm below WD plane, Case 192) compensates for EG chassis height by lowering the effective contact zone to engage opponents at standard plastic-gen AR height; assembly: m≈0.022 kg, I≈3.8×10⁻⁶ kg·m², ω₀=250 rad/s; First Clutch Base (Driger G Version): m=7.3g, smooth outer rim (φ≈5°, minimal recoil on base contacts), Case 191.

```
Triple Tiger contact geometry (Case 192):

  3-fold symmetry: attack every 120° = 3 windows/revolution
  f_attack at ω=250 r/s:   119 Hz
  f_attack at ω=287 r/s:   137 Hz  (First Clutch peak)

  RS face (tangential, smash-dominant):
    φ_RS = 15°
    J_smash  = cos(15°) × J = 0.966 × J
    J_recoil = sin(15°) × J = 0.259 × J
    Overhang: h_contact ≈ -3 mm below WD plane

  LS face (thick rearward edge, recoil-dominant):
    φ_LS = 62°
    J_smash  = cos(62°) × J = 0.469 × J
    J_recoil = sin(62°) × J = 0.883 × J

First Clutch EG burst [Case 191]:
  Fires: at battle start (before any opponent contact)
  τ_burst = 0.060 N·m, window ≈ 200ms
  Δω = +37 rad/s → ω_peak = 287 rad/s (15% launch overshoot)
  After burst: spring exhausted; bey returns to standard spin decay
  NOTE: special moves can re-engage the First Clutch spring under BeySpirit power
        regardless of whether it has already fired (anime physics override)

Assembly summary:
  AR Triple Tiger:         6.3 g  (Case 192)
  WD Ten Balance:         15.0 g  (Case 144)
  EG Right MSF:           11.0 g  (Case 193)
  BB First Clutch Driger G: 7.3 g  (Case 191)
  m ≈ 0.022 kg, I = 3.8×10⁻⁶ kg·m², ω₀ = 250 rad/s
```

---

## Case 704 — [SPECIAL MOVE] Gatling Claw: Ray Kon / Driger G (Beyblade G-Revolution)

**Franchise Move:** At Ray's command, Driger G becomes energised in an eruption of green electricity, increasing its Speed and Agility. In this state, the bey creates multiple clones of itself as tiger-shaped electricity and attacks the opponent from all angles simultaneously. [Beyblade G-Revolution, ep. 07+]

**Thesis:** Gatling Claw is the BeySpirit amplification of Triple Tiger's 3-fold attack-window geometry (Case 703) taken to multi-clone barrage scale: where the gimmick provides 119 Hz physical attack opportunities, the Driger BeySpirit manifests each Triple Tiger head as an independent tiger-shaped electrical clone that orbits the target independently, simultaneously attacking from N_clones different angular positions; the "green electricity eruption" that generates the clones represents the First Clutch spring's stored energy amplified by Driger's BeySpirit into electrical arc discharge — in game terms the BeySpirit re-engages the First Clutch spring regardless of prior state (anime physics override) and channels the extra spin energy into clone materialization; N_clones = floor(3 × spin/maxSpin × 1.5) + 2 (range 3–5), reflecting that more residual spin generates more complete tiger-energy expressions; each clone attacks from a different azimuth (360/N_clones degrees apart) making evasion require N_clones successive perfect dodge inputs within the barrage window; the per-clone spinDelta (−60 rad/s) is moderate for a special move because the damage mechanism is cumulative multi-hit pressure, not single-hit overwhelming force — total spinDelta across all clones: N_clones × 60 = 180–300 rad/s total.

```
Gatling Claw — phase structure:

Phase 1 — "tiger_charge" (500ms):
  First Clutch BeySpirit override: spring re-engages
  [NOTE: special move overrides mechanical state; spring re-engages under BeySpirit]
  Speed boost: Driger G orbital velocity × 2.0
  Green electrical eruption: N_clones materialise
    N_clones = clamp(floor(3 × spin/maxSpin × 1.5) + 2, 3, 5)
  forceState on all opponents: cannot_attack_freely (500ms)

Phase 2 — "clone_barrage" (600ms):
  strikeCount: N_clones
  strikeIntervalMs: 100
  per-clone approach angle: 360 / N_clones (carousel, equal spacing)
  per-clone:
    spinDelta      = -60 rad/s
    linearImpulse  = 900 eu
    damageMultiplier = 1.6×
  forceState on primary target: must_stay_still (600ms)
    [attacking one clone's approach vector exposes to another]

  QTE — "Clone Read":
    per-clone dodge window: 130ms
    dodge success: that clone passes; remaining clones still approach
    all-dodged: possible but requires N_clones consecutive perfect inputs

  total at 5 clones: -300 rad/s spinDelta combined
  total at 3 clones: -180 rad/s spinDelta combined

Self-cost: -80 spinDelta
powerCost: 100
cooldownMs: 4000
NOTE: any beyblade can use Gatling Claw; no part restriction for special moves.
```

---

## Case 705 — [SPECIAL MOVE] Gatling Claw Maximum: Ray Kon / Driger G (Beyblade G-Revolution)

**Franchise Move:** Ray generates huge amounts of green electricity as his muscles surge and eyes glow golden. A lightning bolt strikes Driger G, illuminating it in intense green before it speeds off at imperceptible speeds. Countered by Kai's Blazing Gigs Tempest, which immobilises Driger with a feather storm. [Beyblade G-Revolution, ep. 23 — semi-final vs Kai]

**Thesis:** Gatling Claw Maximum is the ultimate escalation of Gatling Claw: where the base move distributes BeySpirit energy across 3–5 clone attacks over 600ms, Gatling Claw Maximum concentrates all of Ray's spiritual energy into a single charge at "imperceptible speed" — the Triple Tiger RS tangential face (φ=15°, J_smash=0.966×J) delivers its maximum possible impulse in a single pass with Driger G travelling at BeySpirit-amplified super-speed; the "imperceptible speed" physics: at normal ω=250 rad/s, Driger G's tip speed v_tip=ω×r_tip=250×0.003=0.75 m/s; at Gatling Maximum the BeySpirit spring override brings ω_peak=370 rad/s (Δω_BeySpirit=+120 rad/s vs normal First Clutch +37), giving tip speed v_peak=1.11 m/s and orbital speed v_orb=3.5× baseline — the approach is genuinely difficult to read visually, reducing the QTE dodge window from 130ms (Gatling Claw) to 80ms; the countermeasure (Blazing Gigs Tempest feather storm) works because it creates arena-wide forceState cannot_move that neutralises orbital speed advantage; self-cost is heavy because the super-speed depletes most of Driger G's residual spin.

```
Gatling Claw Maximum — phase structure:

Phase 1 — "lightning_charge" (200ms):
  First Clutch BeySpirit override: spring re-engages at maximum power
  Δω_BeySpirit = +120 rad/s  (vs normal +37; 3.2× amplification under BeySpirit)
  ω_peak = 370 rad/s  (148% of ω₀)
  orbital speed: 3.5× baseline
  green lightning aura visible 200ms before strike

Phase 2 — "imperceptible_strike" (single hit):
  Triple Tiger RS tangential contact at ω_peak:
    approach vector: along tangential arc, nearly imperceptible approach angle
    spinDelta_target = -650 rad/s
    linearImpulse   = 6500 eu
    damageMultiplier = 2.6×
    forceState on target: must_stay_still (on full hit, 1000ms)

  QTE — "Imperceptible Dodge":
    windowMs: 80  (vs 130ms Gatling Claw — reduced due to super-speed)
    success: Driger G carries past, 250ms vulnerable window
    fail: full damage

Self-cost: -200 spinDelta
powerCost: 100
cooldownMs: 5500
NOTE: any beyblade can use Gatling Claw Maximum; no part restriction for special moves.
```

---

## Case 706 — [SPECIAL MOVE] Gatling Fang: Ray Kon / Driger G (Beyblade G-Revolution)

**Franchise Move:** 連射牙撃 (Rensha Kigeki — "Rapid-Fire Fang Strike"). The Beyblade attacks the enemy with a high-speed, multi-hit rush. [Beyblade G-Revolution]

**Thesis:** Gatling Fang (連射牙撃) is a sustained rapid-fire rush at close orbital range that contrasts with Gatling Claw Maximum's single super-speed strike: while Gatling Claw Maximum concentrates all BeySpirit energy into one imperceptible pass, Gatling Fang spreads it across 4–6 rapid successive contact passes at a very tight orbit radius (r_prec≈25mm), each using Triple Tiger's RS tangential face at a reduced per-hit spin cost but higher total cumulative pressure; the "rapid-fire" pattern physically represents the 3-fold Triple Tiger geometry cycling through all three heads in quick succession at close range where the contact frequency f=3×370/(2π)≈177 Hz at Driger's boosted ω — in a 600ms burst window approximately 106 possible contact events occur, abstracted to 4–6 resolved hits; SPIN_TIER = floor(spin/maxSpin × 3), so at full spin SPIN_TIER=3 → 4+SPIN_TIER=7 capped to 6 hits; the design philosophy: Gatling Fang cannot ring-out a healthy opponent in one use but applies cumulative spinDelta (−65/hit × 6 hits = −390 rad/s total) against a 250 rad/s ω₀ — a full-spin opponent is brought below the stability threshold in 2 activations, at which point normal attrition finishes them; counter by staying mobile (Driger must orbit tight to maintain close-range cadence, so moving out of r_rush zone interrupts the chain).

```
Gatling Fang — phase structure:

Phase 1 — "rush_lock" (200ms):
  First Clutch BeySpirit override: spring re-engages (anime physics override)
  orbit tightens: r_prec → 25mm (close-range cadence)
  speed boost: ω_burst = 290 rad/s
  forceState on target: must_stay_still (oppponent cannot reposition without breaking cadence)

Phase 2 — "fang_cadence" (600ms, N_hits consecutive passes):
  N_hits = clamp(4 + SPIN_TIER, 4, 6)   (SPIN_TIER = floor(spin/maxSpin × 3))
  hitIntervalMs: 100
  per-hit:
    approach angle: Triple Tiger RS tangential face, φ=15°
    spinDelta_per_hit = -65 rad/s
    linearImpulse     = 1100 eu
    damageMultiplier  = 1.7×
  QTE per hit: 100ms dodge window (move > 60px breaks cadence)
    QTE success: that hit misses; remaining hits continue if still in r_rush zone

  total at 6 hits: -390 rad/s spinDelta combined
  total at 4 hits: -260 rad/s spinDelta combined

Self-cost: -160 spinDelta  (sustained rapid-orbit drains spin)
powerCost: 100
cooldownMs: 3500
NOTE: any beyblade can use Gatling Fang; no part restriction for special moves.
```

---

## Case 707 — [COMBO] Tiger Rush: Triple Tiger RS Tangential Two-Strike Orbit Continuation (3-key: moveRight attack attack)

**Combo ID:** `tiger-rush`
**Sequence:** moveRight → attack → attack  (→JJ)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** tripleTigerAR

Tiger Rush is the combo-level expression of Triple Tiger's RS tangential smash geometry (Case 703): the moveRight entry establishes the correct orbital arc for the RS tangential face approach (φ=15°), the first attack fires the primary RS contact at ceiling spinDelta_1=−50 rad/s, and the second attack captures the follow-up LS contact of the same Tiger head as Driger G continues past (LS face φ=62°, recoil-heavy — less smash but still applies spinDelta_2=−28 rad/s from the residual contact force); orbital continuation means Driger G does not stop after the first hit but carries through to the second contact at reduced speed; the Phase 2 orbital continuation (inherent from Triple Tiger's overhang geometry that clears the opponent and resets rather than braking hard on contact) retains ~60% of pre-strike orbital speed, enabling rapid re-approach for repeated Tiger Rush activations.

```
Tiger Rush — geometry:

Phase 1 (→): orbital arc from right, RS tangential alignment
  approach angle: φ = 15° (smash-dominant)
  orbit radius tightens to r_contact ≈ 30mm

Phase 2 (first J): Triple Tiger RS tangential contact
  spinDelta_source_1 = -50 rad/s  (at combo ceiling)
  J_smash = 0.966 × J
  damageMultiplier = 1.25×
  lockMs = 60  (tangential hit — minimal axis disruption)

Phase 3 (second J): follow-up LS rearward contact as Driger G continues orbit
  spinDelta_source_2 = -28 rad/s  (LS recoil at φ=62°, less smash)
  orbital speed retained: ~60% of pre-strike

ceiling compliance:
  damageMultiplier 1.25× ≤ 1.5×      [check]
  lockMs 60 ≤ 300ms                   [check]
  spinDelta_1 = -50 ≤ 50 rad/s        [check]
  spinDelta_2 = -28 ≤ 50 rad/s        [check]
  no invulnerability                   [check]
  no AoE                               [check]
```

```typescript
// Combo: ["moveRight","attack","attack"], cost: 25, type: "attack", part: tripleTigerAR
function applyTigerRush(drigerG: Beyblade, target: Beyblade): void {
  applySpinDelta(target, -50);     // RS tangential contact
  applySpinDelta(target, -28);     // LS follow-through
  target.damageMultiplier = 1.25;
  target.locked = true; target.lockExpiresAt = Date.now() + 60;
}
```

**Design note:** Tiger Rush is Driger G's sustained attrition combo — two sources of spinDelta (−50+−28 = −78 total) per activation. At cost 25, three activations strip −234 rad/s total, nearly Driger G's entire ω₀=250 rad/s. Combined with Gatling Fang's higher-output rush when power reserves allow, the cycle mirrors Triple Tiger's competitive identity as a pure high-frequency smash AR.

---

## Case 708 — [GIMMICK] Reverse Flame Gigs: Triangle Wing Symmetric Upper Attack and Right Engine Gear Reverse Counter-Rotation — Bilateral Upper Architecture and CEW Anti-Direction Coupling

**Beyblade:** Dranzer GT (Gigus Turbo) — Plastic Generation G-Revolution
**User:** Kai Hiwatari
**Physics Domain:** Symmetric Upper Attack AR (identical LS/RS), Right EG Reverse counter-rotating CEW tip (Case 226), Final Clutch burst timing, movement-damping at low spin

**Thesis:** Dranzer GT's gimmick architecture combines two mechanically independent systems: Triangle Wing AR's 3-fold symmetric Upper Attack geometry that delivers identical upward impulse from either RS or LS contact, and the Right Engine Gear (Reverse) whose counter-rotating CEW tip (Case 226) creates force competition between shell rotation direction and tip friction direction, uniquely enabling the "Turbo Reverse Attack" when amplified by BeySpirit power; Triangle Wing (m=6.1g, Case 225) has three wings each with slope angle α≈30° on both the RS and LS contact face: J_vertical = J×sin(30°) = 0.500×J from either side — identical upper impulse regardless of encounter angle; the smash head adds J_smash_head = J×cos(35°) = 0.819×J (head geometry, Case 225); Right EG Reverse (m=6.7g, Case 226): spring wound in LS direction → on activation CEW tip rotates CCW while Dranzer GT shell rotates CW; normal competition (Case 226): if F_tip_reverse ≈ F_shell_momentum → net motion ≈ 0 (movement damping, not reversal); the damping effect couples with Triangle Wing's Upper Attack: a damped (momentarily stationary) position followed by the spring re-engagement creates a "hesitate-then-lunge" rhythm that catches opponents mid-approach with a Upper contact at unexpected timing; assembly: m≈0.022 kg (including CEW 3.6g), I≈3.8×10⁻⁶ kg·m², ω₀=250 rad/s; CEW Metal Semi-Flat (Case 224): r_tip=3.0mm, μ=0.15, same decay profile as Dranzer G MSF (25.6 rad/s²); Final Clutch fires at t≈4.3s.

```
Triangle Wing symmetric Upper Attack (Case 225):

  3-fold, both faces equal:
    α_LS = α_RS = 30°
    J_vertical / J_total = sin(30°) = 0.500  (same in both directions)
    J_smash (head) / J_total = cos(35°) = 0.819

  Bilateral attack advantage:
    LS contact: J_up = 0.500×J, J_smash = 0.819×J  (identical to RS)
    → Dranzer GT attacks equally from left or right orbit entry
    → no "wrong side" — opponent cannot exploit approach direction

Right EG Reverse counter-rotation (Case 226):
  CEW tip direction: CCW (counter to CW shell)
  At normal play (ω ≈ 100–150 rad/s):
    F_shell_momentum ≈ F_tip_reverse → net lateral ≈ 0 (damping)
    Practical result: movement damps → Dranzer GT briefly hesitates
    Hesitation timing couples with Triangle Wing Upper for surprise contact

  Movement-damping window: ~300–500ms after Final Clutch fires
  During this window: opponent expects Dranzer GT to orbit; instead it stalls
    → Triangle Wing Upper contact occurs at 0 relative lateral velocity (pure spin smash)

Assembly summary:
  AR Triangle Wing:       6.1 g  (Case 225)
  WD Ten Balance:        15.0 g  (Case 144)
  EG Right Reverse:       6.7 g  (Case 226)
  BB Final Clutch GT:     7.6 g  (Case 227)
  CEW Metal Semi-Flat:    3.6 g  (Case 224)
  m ≈ 0.022 kg, I ≈ 3.8×10⁻⁶ kg·m², ω₀ = 250 rad/s
```

---

## Case 709 — [SPECIAL MOVE] Reverse Flame Gigs: Kai Hiwatari / Dranzer GT (Beyblade G-Revolution)

**Franchise Move:** "Turbo Reverse Attack" — Dranzer GT's gears reverse (physically impossible according to Kenny). Dranzer GT surrounds the opponent in flames, then Dranzer BeySpirit directly attacks. The reverse friction heat could melt a bey like cheese. A powerful self-sacrifice move: dramatically boosts power, speed, and control at the cost of Dranzer GT's remaining spin (near-KO self-cost). [Beyblade G-Revolution — success record: 1 win, 2 countered]

**Thesis:** Reverse Flame Gigs weaponises the "physically impossible" Right EG Reverse gear reversal (Case 226) at BeySpirit anime scale: where normal competitive play produces only movement damping (Case 708), the Dranzer BeySpirit forces full counter-rotation — the CEW tip spinning CCW generates a reverse torque τ_reverse so large it temporarily reverses Dranzer GT's orbital direction within 400ms, re-approaching the opponent from the exact opposite vector (the attacker comes from an angle the opponent can never anticipate because it contradicts normal rotational mechanics); the "gear reversal" is acknowledged as physically impossible by Kenny — this is the game's explicit declaration of anime physics override: BeySpirit energy bypasses the material spring-wound direction and drives the gears backward under spiritual force; the reverse approach amplifies Triangle Wing's Upper Attack via the "reverse momentum contribution": Dranzer GT's reversed orbital velocity adds vectorially to the wing contact speed, giving an effective contact angle of θ=+12° above horizontal (vs normal θ=+5° Upper Attack from standard approach) — a steeper dive angle that concentrates force into a narrower contact arc (stress concentration κ=1.5×); the massive fire debuff (γ×2.0× for 3000ms) represents the "frictional heat that could melt a bey like cheese" from the gear-reversal friction; self-cost of −180 spinDelta leaves Dranzer GT with only ~70 rad/s (28% of ω₀) — firmly in nutation wobble territory (below 40% stability threshold) where the seeded-PRNG wobble force kicks in; the "1 success out of 3" franchise record is captured by the QTE design: a skilled opponent can preposition during the 400ms reversal window.

```
Reverse Flame Gigs — phase structure:

Phase 1 — "turbo_reverse_arm" (400ms):
  Right EG Reverse BeySpirit override: gears reverse under spiritual force
  [NOTE: anime physics override — gears reverse even though mechanically impossible;
         BeySpirit re-engages and reverses spring direction under spiritual power]
  Dranzer GT orbital direction reverses: CW orbit → CCW orbit within 400ms
  forceState on all opponents: cannot_attack_freely (400ms)
    [reverse orbit approach vector is unpredictable]
  Flame aura expands: r_aura = 0.45 × r_arena (fire surrounds Dranzer GT)
  spinDrainAura: 6 rad/s/s on any opponent within r_aura (frictional heat)

Phase 2 — "reverse_flame_strike" (200ms contact):
  Reverse orbital approach: Dranzer GT arrives from opposite vector
  Triangle Wing Upper Attack at θ_effective = +12° (reverse approach adds +7° to nominal +5°)
  stress concentration: κ = 1.5 (steeper angle, narrower contact arc)
  spinDelta_target   = -700 rad/s
  linearImpulse      = 9500 eu
  damageMultiplier   = 3.0×
  fireDebuff         = γ × 2.0× for 3000ms  ("melt like cheese" frictional heat)
  forceState target: must_attack (1500ms)

  QTE — "Reverse Anticipation":
    windowMs: 250  (player sees orbital reversal; 400ms phase 1 provides read time)
    success (reposition > 200px within 250ms): glancing contact only
      spinDelta_glancing = -210 rad/s  (30% of full)
      linearImpulse_glancing = 2850 eu
      damageMultiplier_glancing = 0.9×
      fireDebuff: γ × 1.2× for 1000ms (partial)
    fail: full damage — "melt like cheese"

Self-cost: -180 spinDelta  (near-KO: ω_after ≈ 70 rad/s = 28% of ω₀)
  → if ω_after < 100 rad/s: nutation wobble activates immediately (stability < 40%)
  → practical use: once per match before self-destabilisation

powerCost: 100
cooldownMs: 6000
NOTE: any beyblade can use Reverse Flame Gigs; no part restriction for special moves.
NOTE: gears reverse under BeySpirit power regardless of physical spring direction.
```

```typescript
function activateReverseFlameGigs(gt: Beyblade, targets: Beyblade[], primary: Beyblade): void {
  const reversePhaseMs = 400;
  targets.forEach(t => {
    t.forceState = "cannot_attack_freely";
    t.forceStateExpiresAt = Date.now() + reversePhaseMs;
  });
  gt.orbitDirection *= -1;  // reverse orbit (anime override)

  setTimeout(() => {
    if (primary.reverseAnticipateSuccess) {
      applySpinDelta(primary, -210);
      applyLinearImpulse(primary, angleTo(gt, primary), 2850);
      primary.damageMultiplier = 0.9;
      primary.fireDebuffGamma = 1.2; primary.fireDebuffExpiresAt = Date.now() + 1000;
    } else {
      applySpinDelta(primary, -700);
      applyLinearImpulse(primary, angleTo(gt, primary), 9500);
      primary.damageMultiplier = 3.0;
      primary.fireDebuffGamma = 2.0; primary.fireDebuffExpiresAt = Date.now() + 3000;
      primary.forceState = "must_attack"; primary.forceStateExpiresAt = Date.now() + 1500;
    }
    applySpinDelta(gt, -180);
    if (gt.spin / gt.maxSpin < 0.40) gt.nutationWobbleActive = true;
  }, reversePhaseMs);
}
```

---

## Case 710 — [COMBO] Reverse Gear: Triangle Wing LS Upper Attack with Left-Orbit Entry (3-key: moveLeft attack moveUp)

**Combo ID:** `reverse-gear`
**Sequence:** moveLeft → attack → moveUp  (←J↑)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** triangleWingAR

Reverse Gear is the combo-level expression of Triangle Wing's bilateral Upper Attack symmetry (Case 708): the moveLeft entry approaches from the LS side rather than the standard RS orbit (exploiting Triangle Wing's identical LS slope geometry, Case 225), the attack fires Triangle Wing LS Upper contact (α=30° symmetric, spinDelta=−40 rad/s, below ceiling), and the moveUp continues the orbit upward post-contact rather than decelerating — the "upward orbit continuation" represents the upper impulse component carrying Dranzer GT's approach vector to an elevated angle, setting up the next contact from above; the combo is the accessible training-wheels version of Reverse Flame Gigs: where the special reverses orbit direction fully under BeySpirit power, Reverse Gear simply initiates from the LS approach that opponents rarely defend, exploiting Triangle Wing's symmetric design that makes the LS equally dangerous as the RS.

```
Reverse Gear — geometry:

Phase 1 (←): LS orbit entry from left side
  approach angle: Triangle Wing LS face, α=30° (same as RS — symmetric AR)
  J_vertical = 0.500×J, J_smash = 0.819×J

Phase 2 (J): Triangle Wing LS Upper Attack contact
  spinDelta_contact = -40 rad/s  (below ceiling)
  κ = 1.20  (upper angle contact, moderate stress concentration)
  damageMultiplier = 1.30×
  J_up = J×sin(30°) = 0.500×J  (upward kick deflects target trajectory)
  lockMs = 140  (Upper impulse disrupts precession axis)

Phase 3 (↑): post-contact upward orbit continuation
  Dranzer GT follows through on upper arc (θ≈+8° above standard orbit plane)
  spinDrain_arc = -6 rad/s  (floor friction during arc, not a combat source)
  Positioning: elevated orbital arc for high-ground follow-up

ceiling compliance:
  damageMultiplier 1.30× ≤ 1.5×      [check]
  lockMs 140 ≤ 300ms                  [check]
  spinDelta = -40 ≤ 50 rad/s          [check]
  no invulnerability                   [check]
  no AoE                               [check]
```

---

## Case 711 — [GIMMICK] Blazer Slash: Flat Tip Aggressive Flower-Pattern Orbit and Cyclone Wheel Attack Architecture — High-Friction Self-Propelled Orbital Attack

**Beyblade:** Cyclone Herculeo 105F (Metal Fight Beyblade — Metal Masters)
**User:** Ian Garcia
**Physics Domain:** Flat tip (Case 339) flower-pattern orbit via lateral ABS friction, 105 track height contribution, Cyclone metal wheel contact geometry [M]

**Thesis:** Cyclone Herculeo 105F's battle identity is built on the Flat tip's (Case 339) high-friction aggressive orbital architecture: F tip (r_flat=2.04mm, μ=0.35 ABS) generates lateral drive force F_lat=μ×W=0.35×0.491=0.172 N, which at orbital speeds V_orb=0.5 m/s gives trajectory curvature R_curve=m×V²/F_lat=0.050×0.25/0.172=0.073 m=73mm — stadium-scale orbital radius enabling self-propelled flower-pattern attacks without external momentum; spin decay: dω/dt_F=23.4 rad/s² (Case 339), spin life=600/23.4=25.6 s (MFB ω₀=600 rad/s) — an aggressive short-battle assembly whose orbit speed is at maximum early in the match; the 105 Spin Track (h=10.5mm) provides standard plastic-gen height with no functional gimmick — its contribution is contact height positioning for the Cyclone wheel's contact points at the MFB arena floor level; Cyclone metal wheel [M]: the name "Cyclone" implies wind-blade geometry — radiating smash blades at r_outer≈23mm, likely 2-fold or 3-fold symmetry with forward-angled contact faces (smash geometry); COR_Cyclone≈0.80 (die-cast zinc alloy, typical MFB first-gen metal wheel); the F tip's lateral drive force allows Cyclone Herculeo to maintain orbit speed through the match without losing orbital momentum to friction, and the Cyclone wheel's smash contacts engage opponents at full orbital velocity on each pass.

```
Flat tip orbital drive (Case 339):

  r_flat = 2.04 mm, μ_ABS = 0.35
  W = 0.491 N  (m = 0.050 kg, MFB standard)
  τ_spin = (2/3) × 0.35 × 0.491 × 0.00204 = 2.34×10⁻⁴ N·m
  dω/dt_F = 23.4 rad/s²  (Case 339)
  Spin life: t = 600 / 23.4 = 25.6 s

  Lateral drive (full-slip regime):
    F_lat = 0.35 × 0.491 = 0.172 N
    R_curve = 0.050 × (0.5)² / 0.172 = 73 mm  (stadium-scale orbit at 0.5 m/s)

  Orbit speed advantage: F tip maintains trajectory curvature at consistent
  orbital radius without active blader input; Cyclone wheel engages at each pass
  with full orbital momentum.

105 Track:
  h = 10.5 mm (standard height, no functional gimmick feature)
  Contact height: positions Cyclone wheel at arena floor level

Cyclone Metal Wheel [M]:
  Geometry: wind-blade smash contacts, r_outer ≈ 23 mm
  COR ≈ 0.80 (die-cast alloy, typical MFB first-gen)
  Attack type: smash (forward-angled blades)

Assembly:
  m = 0.050 kg, I ≈ 1.0×10⁻⁵ kg·m², ω₀ = 600 rad/s (MFB)
```

---

## Case 712 — [SPECIAL MOVE] Blazer Slash: Ian Garcia / Cyclone Herculeo 105F (Beyblade Metal Masters)

**Franchise Move:** Cyclone Herculeo is covered in a red blaze and slams into the opponent with great force. [Beyblade Metal Masters]

**Thesis:** Blazer Slash is the BeySpirit amplification of the Flat tip's flower-pattern orbital drive (Case 711): where the gimmick passively sustains orbital speed through ABS friction (F_lat=0.172 N), the Herculeo BeySpirit multiplies the lateral drive force to arena-dominating levels, wrapping Cyclone Herculeo in a red fire aura that accelerates the orbit radius inward from normal flower-pattern toward a tight closing spiral, compressing approach radius from r≈73mm to r≈20mm at strike; the fire aura creates an opponent force-zone (cannot_attack_freely) as Herculeo spirals inward — attempting to charge into the fire spiral damages the attacker; the strike delivers full Cyclone wheel smash force amplified by the BeySpirit fire multiplier (2.2× standard) with a fire debuff representing the flame coating on Cyclone's contact blades; the self-cost (−280 spinDelta) reflects the Flat tip's high spin decay rate compounded by the maximum-speed spiral approach — Blazer Slash essentially front-loads the remainder of Cyclone Herculeo's spin life into one decisive contact.

```
Blazer Slash — phase structure:

Phase 1 — "blazing_spiral" (600ms):
  Flat tip BeySpirit amplification: F_lat × 3.2 → V_orb increases to 3.2 m/s
  Spiral inward: r_orbit 73mm → 20mm over 600ms
  Red fire aura: r_aura = 50mm
  forceState on all opponents within r_aura: cannot_attack_freely
    [entering the fire spiral takes contact damage: spinDelta -40 per entry tick]

Phase 2 — "cyclone_slam" (single contact):
  Cyclone wheel smash at V_orb = 3.2 m/s (BeySpirit amplified)
  spinDelta_target   = -520 rad/s
  linearImpulse      = 5000 eu
  damageMultiplier   = 2.2×
  fireDebuff         = γ × 1.3× for 2000ms

  QTE — "Blazer Dodge":
    windowMs: 180  (inward spiral visible for full 600ms phase 1)
    success (move > 150px from spiral centre): strike misses
      Cyclone Herculeo carries past, 200ms vulnerable
    fail: full fire slam + debuff

Self-cost: -280 spinDelta  (Flat tip sprint consumes spin life)
powerCost: 100
cooldownMs: 4000
NOTE: any beyblade can use Blazer Slash; no part restriction for special moves.
```

---

## Case 713 — [COMBO] Herculeo Flame Rush: Flat Tip Double Orbital Strike (3-key: attack attack moveRight)

**Combo ID:** `herculeo-flame-rush`
**Sequence:** attack → attack → moveRight  (JJ→)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** flatTip

Herculeo Flame Rush is the combo-level expression of the Flat tip's orbital drive system (Case 711): the first attack fires Cyclone wheel at peak orbital velocity (spinDelta_1=−50 rad/s, ceiling), the second attack is enabled by the Flat tip's retained orbital speed after first contact (ABS flat face provides enough lateral grip to not decelerate sharply post-impact — orbital speed retention ~65%), delivering a second contact at reduced but non-negligible velocity (spinDelta_2=−35 rad/s); the moveRight post-contact re-enters the flower-pattern orbit for immediate follow-up approach (the lateral drive force F_lat=0.172 N curves Driger back into attacking orbit within 0.4s); this represents the practical advantage of F tip over metal-ball or sharp-point tips for repeat-attack combos: the broad flat face maintains enough friction post-impact to redirect orbit without stopping, whereas a sharp or ball tip would need to recover orbital momentum from near-zero lateral speed after contact.

```
Herculeo Flame Rush — geometry:

Phase 1 (first J): Cyclone wheel contact at full orbital approach
  spinDelta_source_1 = -50 rad/s  (at combo ceiling)
  damageMultiplier = 1.25×
  orbital speed retention: 65% post-contact (Flat tip grip)

Phase 2 (second J): follow-up Cyclone contact at 65% orbital speed
  spinDelta_source_2 = -35 rad/s  (below ceiling; reduced orbital speed)
  lockMs = 60

Phase 3 (→): Flat tip curves orbit back via F_lat=0.172 N
  orbit re-established within 0.4s
  spin drain during re-orbit: -8 rad/s (floor friction, not combat source)

ceiling compliance:
  damageMultiplier 1.25× ≤ 1.5×      [check]
  lockMs 60 ≤ 300ms                   [check]
  spinDelta_1 = -50 ≤ 50 rad/s        [check]
  spinDelta_2 = -35 ≤ 50 rad/s        [check]
  no invulnerability                   [check]
  no AoE                               [check]
```

---

## Case 714 — [GIMMICK] Blaze Wall: Evil Gemios DF145FS Twin-Face Contact Architecture and DF145 Downforce-Stabilised FS Hybrid Tip — Dual-Mode Stamina/Attack Transition

**Beyblade:** Evil Gemios DF145FS (Metal Fight Beyblade — Metal Masters)
**User:** Dan and Reiki Sodo (twin brothers)
**Physics Domain:** DF145 downforce vortex (Case 254), FS Flat Sharp hybrid tip tilt-mode transition, twin-face Gemios clear wheel dual contact symmetry

**Thesis:** Evil Gemios DF145FS carries two gimmick layers that reflect the twin-blader identity: the FS (Flat Sharp) hybrid tip's tilt-dependent contact mode transition that switches between stamina (upright sharp point) and attack (tilted flat ring) within a single battle, and the DF145 Down Force track whose four upward-facing vanes generate F_lift=2×10⁻³ N additional downforce (Case 254) that marginally increases contact pressure and, at BeySpirit scale, creates a wind vortex barrier; FS (Flat Sharp) [M estimated]: at upright stance (tilt angle θ<15°) the sharp centre point contacts the floor — r_sharp≈0.3mm, μ≈0.10 → τ_S=(3/16)×0.10×0.491×3×10⁻⁴=2.76×10⁻⁶ N·m, dω/dt_S=0.28 rad/s² (stamina mode, excellent endurance); at tilt angle θ>15° the outer flat ring contacts — r_flat≈2.0mm, μ≈0.35 → τ_F=(2/3)×0.35×0.491×0.002=2.30×10⁻⁴ N·m, dω/dt_F=23.0 rad/s² (attack-mode flat friction, high lateral drive); the transition at θ=15° tilt means FS self-adapts: stable Gemios stays in stamina mode, disrupted/tilted Gemios switches to attack drive; Evil metal wheel [M]: assumed smash geometry at r_outer≈23mm; Gemios clear wheel (twin-face) provides two contact points positioned ~180° apart — bilateral contacts that hit opponents from two sides simultaneously if Gemios is centred; DF145 (Case 254): h=14.5mm, I_DF145=9.4×10⁻⁸ kg·m², F_lift=2×10⁻³ N; assembly: m=0.050 kg, I=1.0×10⁻⁵ kg·m², ω₀=600 rad/s.

```
FS tip dual-mode physics [M estimated]:

  Upright mode (tilt < 15°) — Sharp point contact:
    r_contact = 0.3 mm, μ = 0.10
    τ_S = 2.76×10⁻⁶ N·m
    dω/dt_S = 0.28 rad/s²   (stamina — excellent endurance)
    F_lat: negligible (<0.05 N) — minimal orbital drive

  Tilted mode (tilt ≥ 15°) — Flat ring contact:
    r_contact = 2.0 mm, μ = 0.35
    τ_F = 2.30×10⁻⁴ N·m
    dω/dt_F = 23.0 rad/s²   (attack — high orbital drive)
    F_lat = μ × W = 0.172 N  (same as pure F tip)

  Transition: self-adapting — stability → stamina; disruption → attack

DF145 downforce track (Case 254):
  h = 14.5 mm, I_DF145 = 9.4×10⁻⁸ kg·m²
  F_lift = 2×10⁻³ N  (additional normal force from fin vortex)
  Normal mode: +0.4% contact pressure (negligible)
  BeySpirit mode: fins generate flame boundary layer (Blaze Wall)

Gemios twin-face clear wheel [M]:
  Two contact points 180° apart (bilateral hits)
  Dual-strike pattern: can simultaneously contact opponents on both sides

Assembly:
  m = 0.050 kg, I = 1.0×10⁻⁵ kg·m², ω₀ = 600 rad/s (MFB)
```

---

## Case 715 — [SPECIAL MOVE] Blaze Wall: Dan and Reiki Sodo / Evil Gemios DF145FS (Beyblade Metal Masters)

**Franchise Move:** The "Fire Twin" creates a shield of flames to block an enemy's attack. Evil Gemios generates a circular fire barrier to deflect incoming attacks. [Beyblade Metal Masters]

**Thesis:** Blaze Wall is the BeySpirit defensive escalation of DF145's downforce vortex (Case 714): where the gimmick produces F_lift=2×10⁻³ N of marginal additional downforce, both of the twin Gemios BeySpirits amplify the DF145 fin vortex into a full circular fire barrier at r_shield=90mm around Gemios; the twin BeySpirit mechanism is unique to Blaze Wall: two independent fire spirits (one per twin) each extend a hemispherical flame wall — the twin architecture means neither spirit alone could sustain the full barrier, so the shield requires both Dan and Reiki's simultaneous focus; in game terms this creates the "Twin Break" QTE design: 3 hits within 400ms from alternating angles can shatter the left and right hemispheres independently, requiring coordinated multi-strike attack patterns to breach; the spinDrainAura (4 rad/s/s within r_shield) represents the thermal energy of the fire barrier slowly desiccating the opponent's tip contact — absorbed into the shield mechanism rather than delivered as direct damage; unlike Ares Shield (Case 651) which is purely elastic (COR-based reflection), Blaze Wall's reflection is fire-thermal (converts incoming impulse to fire debuff on the attacker), making heavy-hit attempts produce more fire damage rather than reflected linear impulse.

```
Blaze Wall — phase structure:

Phase 1 — "twin_summon" (300ms):
  Both Gemios BeySpirits generate fire hemispheres:
    left hemisphere (Dan) + right hemisphere (Reiki) = full Blaze Wall circle
  r_shield = 90mm  (DF145 fin vortex amplified at BeySpirit scale)
  incomingDamageReduction: 0.40× during summon phase
  FS tip: remains in sharp stamina mode (stable upright stance under shield)

Phase 2 — "blaze_wall_active" (2000ms):
  fireShieldActive: true
  All incoming attacks:
    incomingDamageReduction: 0.50×  (half damage absorbed by flames)
    fireReturnFraction: 0.30 of incoming spinDelta returned as fire spinDrainDebuff
    fireDebuffOnAttacker: γ × 1.4× for 2500ms  (thermal return)
  spinDrainAura: 4 rad/s/s on opponents within r_shield  (barrier heat)
  Gemios spin recovery: +2 rad/s/s  (DF145 vortex stabilises upright stance)
  forceState on opponents: must_attack (fire wall advancing inward at 2px/s)

  QTE — "Twin Break":
    Mechanic: 3 hits total with at least 1 on each hemisphere within 400ms window
      hit left side (Dan): -1 to left shield strength
      hit right side (Reiki): -1 to right shield strength
      Both hemispheres depleted within 400ms: shield collapses
        Gemios takes 0.55× damage on break; shield fully down
    Fail (all hits same side / spread > 400ms): full 50% absorption applies

Phase 3 (expiry): DF145 vortex returns to normal; FS returns to tilt-governed mode
powerCost: 100
cooldownMs: 4500
NOTE: any beyblade can use Blaze Wall; no part restriction for special moves.
```

```typescript
interface BlazeWallState {
  active: boolean;
  leftStrength: number;   // 1 = intact
  rightStrength: number;  // 1 = intact
  lastBreakAttemptStart: number;
  hitsInWindow: { left: number; right: number };
}
function onBlazeWallHit(gemios: Beyblade, state: BlazeWallState, hit: HitEvent): void {
  if (!state.active) return;
  const now = Date.now();
  if (now - state.lastBreakAttemptStart > 400) {
    state.hitsInWindow = { left: 0, right: 0 };
    state.lastBreakAttemptStart = now;
  }
  const side = hit.attackAngleDeg < 180 ? "left" : "right";
  state.hitsInWindow[side]++;
  const broken = state.hitsInWindow.left >= 1 && state.hitsInWindow.right >= 1
               && (state.hitsInWindow.left + state.hitsInWindow.right) >= 3;
  if (broken) { state.active = false; gemios.damageReceived += BASE_DAMAGE * 0.55; return; }
  hit.attacker.fireDebuffGamma = 1.4; hit.attacker.fireDebuffExpiresAt = now + 2500;
  hit.attacker.spin -= hit.spinDelta * 0.30;
  gemios.damageReceived += hit.damage * 0.50;
}
```

---

## Case 716 — [COMBO] Twin Flame Brace: DF145 Vortex Partial Shield with FS Stability Stance (3-key: defense moveUp defense)

**Combo ID:** `twin-flame-brace`
**Sequence:** defense → moveUp → defense  (K↑K)
**Cost:** 20 power
**Type Restriction:** defense
**Part Requirement:** df145Track

Twin Flame Brace is the combo-level expression of DF145's downforce vortex and FS tip's stamina-mode stability (Case 714): the first defense input activates the DF145 partial vortex barrier (spinGain_1=+4 rad/s from FS sharp-mode stabilisation, incomingDamageReduction_1=20%), the moveUp elevates Gemios briefly into the tilted-mode transition zone (FS flat ring temporarily contacts, F_lat=0.172 N provides a brief lateral burst — orbital reposition +25px), and the second defense input re-establishes the DF145 vortex at full partial-shield strength (incomingDamageReduction_2=25%, spinGain_2=+3 rad/s); the twin flame brief aura on each brace input represents the Gemios BeySpirits momentarily manifesting to reinforce the DF145 vortex; the combo ceiling spinGain total = +7 rad/s (well below full spin recovery ceiling ✓); no invulnerability (DF145 reduces damage but doesn't block contact ✓).

```
Twin Flame Brace — geometry:

Phase 1 (K): DF145 partial vortex brace
  incomingDamageReduction: 20%  (partial shield)
  FS sharp mode: stable stamina stance
  spinGain: +4 rad/s (FS stabilisation, vortex energy feedback)

Phase 2 (↑): FS tilt transition — brief flat-mode lateral burst
  FS transitions to flat-ring mode (tilt ≥ 15°)
  F_lat = 0.172 N → orbital reposition: +25px
  orbital radius change: r_prec → r_prec + 25px  (defensive spacing)

Phase 3 (K): DF145 full vortex re-establishment
  incomingDamageReduction: 25%  (stronger second brace)
  flame burst on contact: 100ms  (brief twin-spirit fire on any incoming hit)
  spinGain: +3 rad/s
  FS returns to sharp-mode on landing (tilt < 15° restored)

ceiling compliance:
  damageMultiplier: none (defensive)         [check]
  lockMs: 0                                  [check]
  invulnerabilityMs: 0  (reduction only)     [check]
  spinGain: +7 rad/s total                   [check]
  AoE: none                                  [check]
```

---

## Case 717 — [GIMMICK] Blast Impress: Cyber Dranzer Aerial Dive Architecture — High-Elevation AR Contact and Spin-Dump Launch Mechanics

**Beyblade:** Cyber Dranzer — Plastic Generation (V-Force era)
**User:** Goki
**Physics Domain:** Aerial launch from bowl wall, high-elevation AR contact, spin-to-kinetic energy conversion, mutual-KO draw condition

**Note:** Cyber Dranzer parts are not documented in the current case library — all parts [M]. Physics estimated from V-Force plastic-gen context and franchise imagery.

**Thesis:** Cyber Dranzer's gimmick is an aerial dive architecture conceptually parallel to Cyber Pegasus 100HF (Case 667) but operating in fire-element mode: the bey uses the plastic bowl wall ramp-up to launch vertically/aerially, converting stored rotational energy into a projectile trajectory at ω₀=250 rad/s (plastic-gen); where Cyber Pegasus (MFB, Case 667) performs a full spin-dump OHKO, Cyber Dranzer's Blast Impress operates as a "fire dive" — a high-cost directed aerial strike that does not guarantee KO on either side but imposes a draw risk when both assemblies are at reduced spin; the dive contact uses the Dranzer fire-themed AR [M] at an elevated strike angle θ_dive≈35–45° below horizontal (from aerial approach), giving upward-component force J_up=J×sin(40°)=0.643×J that launches the opponent upward while the downward dive component J_down concentrates stress on a narrower contact arc; the self-cost (−185 spinDelta, estimated 74% of ω₀=250) leaves Cyber Dranzer at ≈65 rad/s — firmly below the 40% stability threshold (100 rad/s), immediately entering nutation wobble; the draw condition is inherent: if the opponent was already near-KO when Blast Impress lands, both beyblades topple simultaneously from the combined spin drain.

```
Cyber Dranzer assembly [all parts M]:
  AR: Cyber Dranzer Attack Ring [M]  — Dranzer fire-pattern, assumed RS smash/upper
  WD: [M]  — assumed standard plastic-gen WD ~14-16g
  SG: [M]  — assumed Neo SG or equivalent
  BB: [M]  — assumed standard plastic bowl base
  m ≈ 0.022 kg, I ≈ 3.8×10⁻⁶ kg·m², ω₀ = 250 rad/s  [plastic-gen]

Aerial dive geometry [ESTIMATED from franchise imagery]:
  launch angle: 40-50° above horizontal (bowl wall ramp)
  dive angle at contact: θ_dive ≈ 35-40° below horizontal
  J_up = J × sin(38°) = 0.616 × J  (strong upward component on target)
  contact area reduction from angled dive: κ ≈ 1.3× (stress concentration)
  equivalent Upper Attack with fire-element multiplier

Pre-battle note (Case 667 analogy):
  Blast Impress requires activation at ≥50% spin (needs energy surplus for dive)
  Unlike Avalanche Move (always hits if target in zone), Blast Impress:
    - Does NOT guarantee KO on opponent
    - Does guarantee near-KO on Cyber Dranzer (self-cost is fixed)
    - Draw occurs if opponent was already at low spin when strike lands
```

---

## Case 718 — [SPECIAL MOVE] Blast Impress: Goki / Cyber Dranzer (Beyblade Original Series)

**Franchise Move:** Cyber Dranzer launches aerially as a fire projectile, executing a dive strike from above. High-cost fire-dive attack that can KO the opponent but guarantees near-self-KO on Cyber Dranzer simultaneously. If both beyblades are knocked out, the result is a draw. Similar mechanism to Cyber Pegasus Avalanche Move (Case 667) but fire-element and partial-KO (not guaranteed OHKO). [Beyblade Original Series / V-Force arc]

**Thesis:** Blast Impress is a self-sacrifice fire dive that differs from Avalanche Move in one critical way: Avalanche Move is a coin-flip OHKO (either opponent dies OR Cyber Pegasus dies, never both certain), while Blast Impress guarantees Cyber Dranzer's near-KO self-cost regardless of outcome, with the opponent damage being substantial but variable — making the draw outcome genuinely possible when the opponent is already at low spin; the Dranzer BeySpirit channels all available rotational energy into a fire-coated aerial dive, with the attack geometry matching the bowl wall launch of Case 717; the fire coating (fireDebuff γ×1.5× for 3000ms) ensures even a surviving opponent faces accelerated spin decay, turning Blast Impress into a "delayed win" mechanism even when neither immediate KO occurs; draw detection: if Cyber Dranzer's post-cost spin < 0 (already past topple threshold) AND opponent's post-strike spin < 0 simultaneously → both eliminated → draw; activation requires ≥50% spin (same as Avalanche Move).

```
Blast Impress — phase structure:

Phase 1 — "aerial_launch" (300ms):
  Dranzer BeySpirit: fire aura activates around bey
  Cyber Dranzer launched aerially via bowl wall ramp-up
    vertical launch angle: 45° above horizontal
  forceState on target: must_stay_still (300ms — fixed-trajectory dive cannot adjust)

Phase 2 — "fire_dive_contact" (single hit):
  Dive angle: 38° below horizontal at target
  contact stress: κ = 1.3 (angled dive, narrower contact arc)
  spinDelta_target = -500 rad/s  (substantial but not guaranteed KO)
  linearImpulse = 4200 eu  (upward + lateral from dive angle)
  damageMultiplier = 2.4×
  fireDebuff: γ × 1.5× for 3000ms  (fire coating on dive)
  knockupComponent: target briefly launched upward (70ms airborne visual)

  Draw condition:
    if target.spin after strike ≤ 0 AND cyberDranzer.spin after self-cost ≤ 0:
      result = "draw"  (both eliminated simultaneously)
    if target.spin > 0 AND cyberDranzer.spin ≤ 0:
      result = "cyber_ko"  (Blast Impress self-defeated)
    if target.spin ≤ 0:
      result = "target_ko"  (but cyberDranzer also near-KO)

  QTE — "Dive Dodge":
    windowMs: 200  (fire aura visible during 300ms phase 1)
    success (move > 130px): dive misses; Cyber Dranzer hits floor, self-cost still applied
    fail: full fire dive

Self-cost: -185 spinDelta  (mandatory regardless of hit/miss)
  ω_after = 250 - 185 = 65 rad/s  (26% of ω₀ → nutation wobble threshold)
  cyberDranzer.nutationWobbleActive = true after activation

Activation requirement: Cyber Dranzer spin ≥ 50% maxSpin
powerCost: 100
cooldownMs: 5000
NOTE: any beyblade can use Blast Impress; no part restriction for special moves.
```

```typescript
function activateBlastImpress(cyber: Beyblade, target: Beyblade): void {
  if (cyber.spin / cyber.maxSpin < 0.50) return;
  target.forceState = "must_stay_still";
  target.forceStateExpiresAt = Date.now() + 300;

  setTimeout(() => {
    if (!target.diveDodgeSuccess) {
      applySpinDelta(target, -500);
      applyLinearImpulse(target, angleTo(cyber, target), 4200);
      target.damageMultiplier = 2.4;
      target.fireDebuffGamma = 1.5; target.fireDebuffExpiresAt = Date.now() + 3000;
    }
    // Self-cost always applies
    applySpinDelta(cyber, -185);
    if (cyber.spin / cyber.maxSpin < 0.40) cyber.nutationWobbleActive = true;

    // Draw detection
    if (cyber.spin <= 0 && target.spin <= 0) {
      cyber.drawResult = true; target.drawResult = true;
    }
  }, 300);
}
```

---

## Case 719 — [COMBO] Dive Fang: Cyber Dranzer Angled Aerial Entry Strike (3-key: moveUp attack moveDown)

**Combo ID:** `dive-fang`
**Sequence:** moveUp → attack → moveDown  (↑J↓)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** cyberDranzerAR  [M — any aerial-dive-capable attack ring]

Dive Fang is the combo-level expression of Cyber Dranzer's bowl-wall aerial architecture (Case 717): the moveUp input drives Cyber Dranzer up the bowl wall slope into a brief elevated approach (gaining θ=+20° above flat orbit plane), the attack fires the Dranzer fire AR at that elevated angle (κ=1.2× stress concentration from angled contact), and the moveDown re-anchors the orbit after the aerial pass; the physics: at θ=+20° contact angle, J_up=J×sin(20°)=0.342×J provides an upward component that destabilises the opponent's precession axis (lockMs=200), while J_smash=cos(20°)=0.940×J preserves high outward smash efficiency; the self-spin cost during the bowl-wall ramp-up (-15 rad/s arc friction) is the combo's activation cost overhead beyond the explicit 25 power; this is a scaled-down version of the Blast Impress aerial dive that preserves near-full smash efficiency at a fraction of the self-sacrifice, giving Cyber Dranzer a reliable mid-range aerial attack option without risking the near-KO self-cost of the special move.

```
Dive Fang — geometry:

Phase 1 (↑): bowl wall ramp-up to elevated approach
  θ_contact = +20° above flat orbit plane
  self spin drain during ramp: -15 rad/s (bowl wall friction)

Phase 2 (J): Dranzer fire AR at +20° elevated angle
  J_smash = cos(20°) × J = 0.940 × J
  J_up = sin(20°) × J = 0.342 × J  (upward axis disruption)
  spinDelta_contact = -50 rad/s  (at combo ceiling)
  κ = 1.20 (angled contact, reduced contact arc)
  damageMultiplier = 1.35×
  lockMs = 200  (upward J disrupts precession axis, below 300ms ceiling)

Phase 3 (↓): re-anchor to flat orbit
  orbital radius re-establishes
  spin drain re-anchor: -5 rad/s

ceiling compliance:
  damageMultiplier 1.35× ≤ 1.5×      [check]
  lockMs 200 ≤ 300ms                  [check]
  spinDelta = -50 ≤ 50 rad/s          [check]
  no invulnerability                   [check]
  no AoE                               [check]
```

---

## Case 720 — [GIMMICK] Blast Beat: Omni Odax Smash Blade Contact Architecture and Xtreme Bit XD-Accelerated Orbital Drive — Multi-Directional High-Frequency Attack Platform

**Beyblade:** Omni Odax Triple Xtreme (Beyblade X)
**User:** Orochi Ginba
**Physics Domain:** BX-era XD rail acceleration, Xtreme bit orbital drive, Odax blade smash contact geometry, multi-orbit attack frequency

**Note:** Blade Omni Odax [M] and Bit Xtreme [M] are not yet documented in the case library. Ratchet Triple [M] estimated as 3-protrusion standard-height variant. All parameters marked [M] are estimated from BX-era comparators (Cases 397–415, 375–385).

**Thesis:** Omni Odax Triple Xtreme's battle identity is built on the Xtreme bit's XD-accelerated orbital drive (similar to Rush Bit, Case 405, but with different tooth geometry) combined with Omni Odax's smash blade attack geometry, creating a high-frequency multi-directional attack platform: each Xtreme Line (XD rail) pass accelerates Odax's orbit and simultaneously positions the blade for the next smash contact, so every orbit around the BX-10 Xtreme Stadium is both an acceleration event and an attack opportunity; Xtreme bit [M estimated]: flat-tip XD geometry, r_eff≈1.5mm, μ≈0.15, η_xd≈1.10 (XD efficiency coefficient, slightly less than Rush's 1.15 but still elite), dω/dt≈−8.0 rad/s²; at ω₀=700 rad/s the free-spin window = 700/8.0 = 87.5s; XD orbit speed at standard engagement: v_orb≈4.0 m/s → T_orbit=2π×0.105/4.0=0.165s → 6.1 orbits/s → f_blade = N_contact×6.1 Hz per revolution for an N_contact-fold blade geometry; Omni Odax blade [M]: from franchise imagery the blade is attack-type with forward-facing smash contacts at r_outer≈22mm, assumed C₃ symmetry (3-fold, 120° spacing, similar to Shark Edge Case 375); at 6.1 orbits/s with 3-fold contact geometry: f_attack=3×6.1=18.3 blade contact opportunities/s — opponents face a strike attempt roughly every 55ms while Odax is in XD orbit; Triple ratchet [M]: 3-protrusion body at standard height, providing moderate burst threshold; assembly: m=0.045 kg, I=1.20×10⁻⁵ kg·m², ω₀=700 rad/s [BX-era parameters, Case 405].

```
Xtreme Bit XD drive [M estimated, based on Cases 397–415]:

  r_eff ≈ 1.5 mm, μ ≈ 0.15, η_xd ≈ 1.10
  dω/dt = -(0.15 × 0.045 × 9.81 × 0.0015) / 1.20×10⁻⁵ = -8.0 rad/s²
  Spin life (free): 700 / 8.0 = 87.5 s

  XD orbital parameters (BX-10 Xtreme Stadium, Case 548):
    R_xd = 105 mm  (Xtreme Line radius)
    v_orb at XD engagement = 4.0 m/s  (typical XD orbit, Case 549)
    T_orbit = 2π × 0.105 / 4.0 = 0.165 s  (6.1 orbits/s)
    XD per-engagement spin cost: Δω_XD ≈ 20 rad/s  [Case 405 analogy]

Omni Odax blade [M]:
  Assumed C₃ geometry (3-fold, 120° spacing)  [franchise imagery]
  r_outer ≈ 22 mm, smash blade contacts forward-facing
  Attack frequency in XD orbit: f = 3 × 6.1 = 18.3 Hz  (strike attempt every 55ms)

Triple Ratchet [M]:
  3 protrusions, standard height, moderate burst threshold

Assembly [BX era, Case 405]:
  m = 0.045 kg, I = 1.20×10⁻⁵ kg·m², ω₀ = 700 rad/s
  W = 0.045 × 9.81 = 0.441 N
```

```typescript
interface OdaxXtremeAssembly {
  m_kg:  number;           // 0.045
  I_kgm2: number;          // 1.20e-5
  omega0_rads: number;     // 700
  xdEta: number;           // 1.10 [M]
  rEff_m: number;          // 1.5e-3 [M]
  spinDecay_rads2: number; // 8.0 [M]
  attackFold: number;      // 3 (C₃) [M]
  xdOrbitHz: number;       // 6.1
}
function odaxAttackFrequencyHz(assembly: OdaxXtremeAssembly): number {
  return assembly.attackFold * assembly.xdOrbitHz;  // 18.3 Hz
}
```

---

## Case 721 — [SPECIAL MOVE] Blast Beat: Orochi Ginba / Omni Odax Triple Xtreme (Beyblade X)

**Franchise Move:** Similar to Valt Aoi's Rush Launch (multi-orbit high-speed attack), Odax moves around the stadium at high speed, attacking from all directions. [Beyblade X]

**Thesis:** Blast Beat is the BeySpirit transcendence of Omni Odax's XD-orbital attack system (Case 720): where the gimmick sustains a 6.1 orbits/s XD-accelerated attack cadence with 18.3 Hz blade contact opportunities, the Odax BeySpirit amplifies the orbital speed and blade reach to create a stadium-wide multi-directional barrage in which every azimuthal direction becomes a simultaneous attack vector; the "similar to Rush Launch" franchise comparison anchors the physics — Rush Launch is a launcher technique that generates XD-synchronised orbits at maximum possible velocity; Blast Beat replicates this at BeySpirit scale by: (1) temporarily suspending normal spin decay mechanics while the barrage runs (the BeySpirit sustains orbital speed without the Xtreme bit's −8 rad/s² decay), (2) amplifying XD orbit speed from 4.0 m/s to 6.5 m/s (BEAT_AMPLIFY=1.625×), increasing orbital kinetic energy E_orb=½mv²=½×0.045×6.5²=0.951 J vs normal 0.360 J (+164%), and (3) generating N_BEAT = 4 + ORBIT_CHARGE simultaneous approach vectors (ORBIT_CHARGE 0–3 based on completed orbits in the wind-up phase); the barrage forceState is must_stay_still on the target — "attacking from all directions" means every movement vector exposes a blade contact, making evasion statistically impossible except via the QTE "Beat Break" dodge sequence; self-cost is moderate relative to ω₀=700 rad/s because the BeySpirit suspends spin decay during the barrage, returning a higher-than-expected residual spin; spinDelta per strike is calibrated so that a full N=7 (max charge) barrage depletes ~50% of a target's starting spin.

```
Blast Beat — phase structure:

Phase 1 — "xd_wind_up" (800ms, XD orbit laps):
  BeySpirit activates: XD orbit at v_orb = 6.5 m/s (amplified)
  T_orbit_beat = 2π × 0.105 / 6.5 = 0.101 s  (9.9 orbits/s)
  ORBIT_CHARGE: +1 per completed XD orbit  (max 3, achieved in ~300ms)
  No hits during wind-up
  forceState on target: cannot_attack_freely (800ms)
  visual: Odax orbit traces glow gold, BeySpirit aura builds

Phase 2 — "beat_barrage" (600ms, rapid-fire multi-direction):
  N_BEAT = 4 + ORBIT_CHARGE  (range: 4–7 directions)
  strikeIntervalMs: 80
  per-strike angle: 360 / N_BEAT (equal spacing — full stadium coverage at max charge)
  per-strike:
    spinDelta    = -50 rad/s
    linearImpulse = 650 eu
    damageMultiplier = 1.5×
  forceState: must_stay_still  (simultaneous multi-angle vectors)

  QTE — "Beat Break":
    Mechanic: input LEFT+RIGHT alternating (←→←→) within 400ms window
    4 correct alternating inputs: escape the barrage at 50% damage  
    fail: all N_BEAT strikes land
      total at 7 strikes: -350 rad/s spinDelta (50% of ω₀=700 stripped)
      total at 4 strikes: -200 rad/s spinDelta (29% of ω₀)

  BeySpirit spin preservation: -60 spinDelta self-cost  (decay suspended during barrage)

Self-cost: -60 spinDelta  (BeySpirit-preserved; much less than normal multi-orbit would cost)
powerCost: 100
cooldownMs: 4000
NOTE: any beyblade can use Blast Beat; no part restriction for special moves.
```

```typescript
function activateBlastBeat(odax: Beyblade, targets: Beyblade[]): void {
  let orbitCharge = 0;
  const windUpMs = 800;
  const orbitPeriodMs = 101; // 9.9 orbits/s at amplified speed
  const orbits = Math.floor(windUpMs / orbitPeriodMs);
  orbitCharge = Math.min(3, orbits);

  targets.forEach(t => {
    t.forceState = "cannot_attack_freely";
    t.forceStateExpiresAt = Date.now() + windUpMs;
  });

  setTimeout(() => {
    const N_BEAT = 4 + orbitCharge;
    const angleStep = 360 / N_BEAT;
    const primary = targets[0]; // nearest opponent
    primary.forceState = "must_stay_still";
    primary.forceStateExpiresAt = Date.now() + 600;

    for (let i = 0; i < N_BEAT; i++) {
      setTimeout(() => {
        if (primary.beatBreakSuccess) return;
        const angle = (angleStep * i * Math.PI) / 180;
        applySpinDelta(primary, -50);
        applyLinearImpulse(primary, angle, 650);
        primary.damageMultiplier = 1.5;
      }, i * 80);
    }
    applySpinDelta(odax, -60);
  }, windUpMs);
}
```

**Franchise comparison — Rush Launch vs Blast Beat:**
```
Mechanic              Rush Launch (Valt, Burst)     Blast Beat (Orochi, BX)
──────────────────────────────────────────────────────────────────────────
Drive system          hand technique / launcher      BeySpirit + Xtreme bit XD
Orbit count           continuous                     4 charges in 800ms
Strike direction      single arc approach            N_BEAT = 4–7 simultaneous
Per-strike spinDelta  moderate                       -50 rad/s
BeySpirit involvement no (launcher technique)        yes (sustains orbital speed)
Countered by          precise timing                 Beat Break QTE alternating input
```

---

## Case 722 — [COMBO] Odax Orbit: XD-Accelerated Tangential Strike with Orbit Continuation (3-key: moveRight attack moveRight)

**Combo ID:** `odax-orbit`
**Sequence:** moveRight → attack → moveRight  (→J→)
**Cost:** 15 power
**Type Restriction:** attack
**Part Requirement:** xtremeXDBit  (Xtreme Bit or any XD-optimised flat bit)

Odax Orbit is the combo-level expression of the Xtreme bit's XD orbital acceleration (Case 720): the first moveRight entry commits Odax to a XD-side orbital arc, the attack fires at the apex of XD-accelerated approach (when orbital kinetic energy is maximised from Xtreme Line engagement), and the second moveRight continues the orbital arc post-contact rather than decelerating — exploiting the same "orbit continuation" principle used in Spark Rush (Case 665) and Tiger Rush (Case 707); at XD orbital speed v_orb=4.0 m/s the approach velocity delivers elevated contact impulse (vs a non-XD orbit at ~1.5 m/s), and the Odax blade's C₃ smash face (φ≈20° estimated, forward-facing) converts this into J_smash = J×cos(20°) = 0.940×J; the orbit continuation at Phase 3 enables rapid re-entry into the XD line for the next engagement — Odax Orbit is designed for repeated rapid-fire activation in sequences, each one arriving off an active XD orbit.

```
Odax Orbit — geometry:

Phase 1 (→): XD orbital arc entry
  Xtreme Bit XD engagement: v_orb → 4.0 m/s (XD-accelerated)
  orbit radius: R_xd = 105 mm (Xtreme Line)
  spin drain during XD pass: -20 rad/s (XD per-engagement cost, Case 405 analogy)

Phase 2 (J): Odax blade smash contact at XD approach speed
  contact geometry: C₃ smash, φ ≈ 20° (estimated [M])
  J_smash = cos(20°) × J = 0.940 × J
  spinDelta_contact = -50 rad/s  (at combo ceiling)
  damageMultiplier = 1.25×
  lockMs = 40  (tangential smash, minimal axis disruption)

Phase 3 (→): orbit continuation post-contact
  orbital speed retained: ~60%  (Xtreme Bit XD flat geometry)
  re-approaches XD Xtreme Line for next engagement
  spin drain (continuation arc): -8 rad/s

ceiling compliance:
  damageMultiplier 1.25× ≤ 1.5×       [check]
  lockMs 40 ≤ 300ms                    [check]
  spinDelta_contact = -50 ≤ 50 rad/s   [check]
  no invulnerability                    [check]
  no AoE                                [check]

Design note: XD self-cost (-20 from Phase 1) is a fixed orbital mechanics cost,
  not a combat spinDelta source — ceiling check applies only to Phase 2 contact.
```

```typescript
// Combo: ["moveRight","attack","moveRight"], cost: 15, type: "attack", part: xtremeXDBit
function applyOdaxOrbit(odax: Beyblade, target: Beyblade): void {
  applySpinDelta(odax, -20);   // XD orbital engagement self-cost
  applySpinDelta(target, -50); // smash contact at ceiling
  target.damageMultiplier = 1.25;
  target.locked = true; target.lockExpiresAt = Date.now() + 40;
  // orbit continues: odax retains ~60% orbital speed for rapid follow-up
}
```

---

## Case 723 — [GIMMICK] Gravity Perseus AD145WD: Reverse-Rotation Mode-Change, Armor Defense 145 Absorption, and Wide Defense Stamina Tip

**Beyblade:** Gravity Perseus AD145WD (also: Gravity Destroyer AD145WD)
**User:** Julian Konzern
**Physics Domain:** MFB-era reverse-rotation mode-change, opposite-spin contact amplification, AD145 armor-ring lateral absorption, WD stamina-balance tip

**Note:** Gravity (Perseus) Fusion Wheel mode-change geometry estimated [M] from ClearWheel contact-override documentation (Case 24). AD145 from Case 253. WD from Case 63. All [M] values carry ±15% uncertainty.

**Thesis:** Gravity Perseus AD145WD's battle identity is built on three stacking systems — (1) the Gravity Fusion Wheel's RS/LS mode-change (ClearWheel geometry, Case 24), which inverts the leading contact face and enables opposite-spin amplification against RS opponents; (2) AD145's (Case 253) freely rotating armor rings, which absorb 35% of lateral impact energy into ring rotation rather than linear deflection; and (3) WD's (Case 63) wide compound tip providing stable low-decay floor contact; the key physical consequence of LS mode against a RS opponent is that at the blade contact point, tangential velocities ADD rather than cancel: v_rel_tan(opp) = ω_A × r_A + ω_B × r_B ≈ 26.4 m/s at equal 600 rad/s, vs ≈0 m/s for same-spin — this massively increases friction-driven contact impulse; in-game modelled as η_opp = 1.6× on contact when spinMode(attacker)=LS and spinMode(defender)=RS.

```
Gravity (Perseus) Fusion Wheel [M estimated from Case 24 comparators]:

  RS mode: φ_RS ≈ 25°  (smash-dominant leading face)
    J_smash_RS = cos(25°) × J = 0.906 × J
  LS mode: φ_LS ≈ 35°  (LS leading face after mode flip)
    J_smash_LS = cos(35°) × J = 0.819 × J
  r_contact ≈ 22 mm;  C₂ symmetry (2-fold, 180° spacing)  [franchise imagery]
  Mode change: pre-battle wheel flip (LS = counter-clockwise reverse rotation)
  Anime override: specials and combos can engage LS mode mid-battle  [established rule]

  Opposite-spin amplification (LS attacker vs RS defender):
    v_rel_tan = ω_A × r_A + ω_B × r_B
    At ω_A = ω_B = 600 rad/s, r = 0.022 m:
      v_rel_tan(opp)  = 13.2 + 13.2 = 26.4 m/s
      v_rel_tan(same) ≈ 0 m/s  (equal spins cancel)
    Game amplifier: η_opp = 1.6×  [conservative; finite contact duration + dissipation]

AD145 (Armor Defense 145) [Case 253]:
  h = 14.5 mm
  Armor rings: 2 freely rotating disc rings,  I_ring ≈ 1.5×10⁻⁶ kg·m²
  Lateral absorption fraction α_AD = 0.35
    → J_effective_on_bey = 0.65 × J_lateral
  Upper protrusion angle: θ_upper ≈ +5°

WD (Wide Defense) [Case 63]:
  r_eff ≈ 3.0 mm,  μ ≈ 0.11
  dω/dt = −(0.11 × 0.050 × 9.81 × 0.003) / 1.0×10⁻⁵ = −16.2 rad/s²
  Spin life (free): 600 / 16.2 ≈ 37.1 s

Assembly [MFB era]:
  m = 0.050 kg,  I = 1.0×10⁻⁵ kg·m²,  ω₀ = 600 rad/s,  W = 0.491 N
```

```typescript
interface GravityPerseusAssembly {
  m_kg: number;             // 0.050
  I_kgm2: number;           // 1.0e-5
  omega0_rads: number;      // 600
  spinMode: "RS" | "LS";   // pre-battle selection
  phi_RS_deg: number;       // 25 [M]
  phi_LS_deg: number;       // 35 [M]
  r_contact_m: number;      // 0.022
  eta_opp: number;          // 1.6 [M] — opposite-spin amplifier
  alpha_AD145: number;      // 0.35 [Case 253]
  rEff_WD_m: number;        // 3.0e-3 [Case 63]
  spinDecay_rads2: number;  // 16.2
}
function oppSpinEta(attacker: GravityPerseusAssembly, defenderMode: "RS" | "LS"): number {
  return (attacker.spinMode === "LS" && defenderMode === "RS") ? attacker.eta_opp : 1.0;
}
```

---

## Case 724 — [SPECIAL MOVE] Black Excalibur: Julian Konzern / Gravity Perseus AD145WD (Metal Fight Beyblade)

**Franchise Move:** Destroyer (Perseus) unsheathes its "Jet Black Sword", releases powerful black energy and strikes the opponent with a massive smash. Julian has only ever used this move in LS reverse-rotation mode. [Metal Fight Beyblade, Team Excalibur arc]

**Franchise Note:** "Black Excalibur" references both the legendary sword Excalibur and Julian's team (Team Excalibur, European championship). The "Jet Black" prefix signals the dark-knight corruption — Excalibur repurposed as a weapon of destruction.

**Thesis:** Black Excalibur is the BeySpirit transcendence of Gravity Perseus's LS opposite-spin system (Case 723): BeySpirit enforces full LS mode regardless of pre-battle setting (anime physics override) and amplifies η_opp from passive 1.6× to a fully spiritualized 2.0× against RS opponents; the "black energy sword" is the concentrated dark aura of the Perseus BeySpirit forming a blade singularity at the wheel contact face; when it strikes an RS-spinning target the v_rel_tan differential (≈26.4 m/s) is unleashed in a single catastrophic impulse; the black energy debuff (mobility_reduction=30%, 2000ms) represents spiritual contamination destabilising the opponent's tip axis; Julian always pre-sets LS but BeySpirit enforces it unconditionally so the move never misfires.

```
Black Excalibur — phase structure:

Phase 1 — "sword_conjuration" (500 ms):
  BeySpirit enforces LS mode  (anime override — pre-battle mode irrelevant)
  Perseus dark aura condenses into sword silhouette at wheel contact face
  forceState on target: cannot_attack_freely  (500 ms)
  visual: black/dark-purple blade forms around wheel edge

Phase 2 — "black_blade_strike":
  vs RS opponent (BeySpirit η_opp = 2.0):
    spinDelta      = −560 rad/s
    linearImpulse  = 5 500 eu
    damageMultiplier = 2.4×
  vs LS opponent (same spin, no amplification):
    spinDelta      = −380 rad/s
    linearImpulse  = 3 800 eu
    damageMultiplier = 1.8×

  Black energy debuff (both):
    mobility_reduction = 30%  for 2 000 ms

  QTE — "Sword Guard":
    Window: 220 ms;  Input: dodge
    Success: 50% of spinDelta + impulse applied only
    Fail: full strike

Self-cost: −200 spinDelta
powerCost: 100;  cooldownMs: 4 500
NOTE: special move overrides all mechanical mode-state; BeySpirit enforces LS reverse-rotation
  regardless of pre-battle spinMode selection (anime physics override).
NOTE: any beyblade can use Black Excalibur; no part restriction for special moves.
```

```typescript
function activateBlackExcalibur(perseus: Beyblade, target: Beyblade): void {
  const prevMode = perseus.spinMode;
  perseus.spinMode = "LS";  // BeySpirit enforces LS

  target.forceState = "cannot_attack_freely";
  target.forceStateExpiresAt = Date.now() + 500;

  setTimeout(() => {
    const opp = target.spinMode !== "LS";
    const spinDelta = opp ? -560 : -380;
    const impulse   = opp ? 5500 : 3800;
    const dmgMult   = opp ? 2.4  : 1.8;

    if (!target.swordGuardSuccess) {
      applySpinDelta(target, spinDelta);
      applyLinearImpulse(target, perseus.facingAngle, impulse);
      target.damageMultiplier = dmgMult;
      target.mobilityReduction = 0.30;
      target.mobilityReductionExpiresAt = Date.now() + 2000;
    } else {
      applySpinDelta(target, spinDelta * 0.5);
      applyLinearImpulse(target, perseus.facingAngle, impulse * 0.5);
    }
    applySpinDelta(perseus, -200);
    perseus.spinMode = prevMode;
  }, 500);
}
```

---

## Case 725 — [COMBO] Black Slash: Orbital Feint + LS Mode-Flip Smash (3-key: moveRight moveLeft attack)

**Combo ID:** `black-slash`
**Sequence:** moveRight → moveLeft → attack  (→←J)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** gravityWheel  (Gravity Fusion Wheel with RS/LS mode-change)

Black Slash is the combo-level expression of the Gravity wheel's opposite-spin system (Case 723): the moveRight orbital arc warms up approach speed (RS faces engaged), the moveLeft reversal triggers brief LS contact face engagement (the orbital direction reversal mirrors the wheel mode-flip — established combo mode-change rule), and the attack fires at the reversal apex where the LS face leads and orbital momentum is concentrated; φ_LS=35° (J_smash=0.819×J) combined with η_opp=1.6× vs RS opponents elevates the effective impulse within combo ceiling constraints; the orbital reversal self-cost (−10) reflects direction-change deceleration friction.

```
Black Slash — geometry:

Phase 1 (→): RS orbital approach, r ≈ 100 mm, v_orb ≈ 0.5 m/s
Phase 2 (←): orbital reversal — LS contact face temporarily engaged (combo mode-change rule)
  reversal self-cost: −10 rad/s
  φ_LS = 35°  →  J_smash = cos(35°) × J = 0.819 × J
Phase 3 (J): LS smash contact at reversal apex
  spinDelta_contact = −50 rad/s  (ceiling)
  damageMultiplier = 1.40×  (η_opp elevation, within 1.5× ceiling)
  lockMs = 80

ceiling compliance:
  damageMultiplier 1.40× ≤ 1.5×       [check]
  lockMs 80 ≤ 300 ms                   [check]
  spinDelta_contact = 50 ≤ 50 rad/s    [check]
  no invulnerability, no AoE           [check]

Design note: orbital reversal self-cost (−10) is friction from direction change —
  ceiling check applies only to Phase 3 contact.
```

```typescript
// Combo: ["moveRight","moveLeft","attack"], cost: 25, type: "attack", part: gravityWheel
function applyBlackSlash(perseus: Beyblade, target: Beyblade): void {
  const prevMode = perseus.spinMode;
  perseus.spinMode = "LS";           // LS temporarily engaged (combo mode-change rule)
  applySpinDelta(perseus, -10);      // reversal friction
  applySpinDelta(target, -50);
  target.damageMultiplier = 1.40;
  target.locked = true; target.lockExpiresAt = Date.now() + 80;
  perseus.spinMode = prevMode;
}
```

---

## Case 726 — [GIMMICK] Aquario 105F: Curved Orbital Attack Geometry and Flat-Tip Aggressive Drive

**Beyblade:** Aquario 105F
**User:** Mei-Mei
**Physics Domain:** MFB-era Aquario curved water-flow blade contacts, 105 standard height, F flat-tip aggressive orbital drive

**Note:** Aquario Fusion Wheel [M]. 105 track [M, standard height, no gimmick]. Flat tip F from Case 339.

**Thesis:** Aquario 105F's battle identity is the combination of Aquario's curved C₄ water-flow blade contacts and the F flat tip's aggressive orbital drive: the Aquario wheel has 4 curved fins (90° spacing) with a tapered leading edge (φ_entry≈15° rising to φ_apex≈30°) creating a gradual-then-sharp contact profile that lets the blade "slide" into engagement rather than abruptly collide, maximising transfer efficiency by keeping the arc in the efficient φ_apex zone; the F flat tip (Case 339) provides r_flat=2.04mm, μ=0.35, F_lat=0.172N for tight orbital motion (R_curve≈73mm), delivering high orbital kinetic energy at contact; Big Wave (Case 727) exploits both systems: F-tip orbital momentum plus Aquario's water-element BeySpirit generates a stadium-scale hydrodynamic wave-front.

```
Aquario Fusion Wheel [M]:

  C₄ contact geometry (4 fins, 90° spacing)  [franchise imagery]
  φ_entry ≈ 15°  (blade entry — low resistance)
  φ_apex  ≈ 30°  (blade peak — smash max):  J_smash = cos(30°) × J = 0.866 × J
  r_outer ≈ 22 mm;  curved leading edge (gradual engagement)

105 Track [M]:
  h = 10.5 mm  (standard height, no gimmick)

F Tip (Flat) [Case 339]:
  r_flat = 2.04 mm,  μ = 0.35
  F_lat = 0.172 N;  dω/dt = −23.4 rad/s²
  Spin life (free): 25.6 s;  R_curve ≈ 73 mm at v = 0.5 m/s

Assembly [MFB era]:
  m = 0.050 kg,  I = 1.0×10⁻⁵ kg·m²,  ω₀ = 600 rad/s,  W = 0.491 N
```

```typescript
interface AquarioAssembly {
  m_kg: number;           // 0.050
  I_kgm2: number;         // 1.0e-5
  omega0_rads: number;    // 600
  phi_apex_deg: number;   // 30 [M]
  r_outer_m: number;      // 0.022
  contactFold: number;    // 4
  rFlat_m: number;        // 2.04e-3 [Case 339]
  mu_F: number;           // 0.35
  spinDecay_rads2: number;// 23.4
}
```

---

## Case 727 — [SPECIAL MOVE] Big Wave: Mei-Mei / Aquario 105F (Metal Fight Beyblade)

**Franchise Move:** Aquario creates a huge wave to destabilize the opponent's Beyblade. Mei-Mei first used this against Sophie and Wales. It is Mei-Mei's only explicitly water-type special move. [Metal Fight Beyblade]

**Thesis:** Big Wave is the BeySpirit transcendence of Aquario's water-element orbital system (Case 726): the BeySpirit amplifies F-tip orbital KE (E_orb=½×0.050×4.0²=0.400J at v_orb=4.0m/s) into a stadium-scale hydrodynamic wave-front; the wave's primary effect is destabilisation rather than direct damage — it applies a stabilityDebuff of −0.20 on the target's effective spin ratio (effective_stability = spin/maxSpin + stabilityDebuff), pushing near-threshold opponents below the wobble boundary (stability < 0.40) early; secondary effect is a wall-push impulse (2200eu toward nearest wall) for ring-out threat; tertiary "wet surface" debuff (+3 rad/s/s spin decay for 3000ms) reflects increased floor friction; spinDelta is only −100 (turbulence) — Big Wave is a positional control and destabilisation tool, not a raw power move; self-cost is −220 because building the wave requires dumping orbital KE from Aquario's spin.

```
Big Wave — phase structure:

Phase 1 — "wave_build" (700 ms):
  Aquario orbital speed: v_orb = 4.0 m/s  (BeySpirit amplified)
  E_orb = ½ × 0.050 × 4.0² = 0.400 J
  forceState on all opponents in r_wave = 200 mm: cannot_attack_freely  (700 ms)
  visual: blue-white water aura builds along orbital arc

Phase 2 — "wave_crash" (stadium-wide AoE, r_wave = 200 mm):
  stabilityDebuff = −0.20  (2 500 ms)
    effective_stability = spin/maxSpin − 0.20
    opponents near 40% spin → pushed below wobble threshold
  linearImpulse_wall = 2 200 eu  (toward nearest arena wall)
  spinDelta = −100 rad/s  (turbulence drain)
  "Wet Surface" debuff: +3 rad/s/s spin decay for 3 000 ms

  QTE — "Wave Ride":
    Window: 300 ms;  Input: jump (↑)
    Success: no wall push; +800 eu directed toward opponent instead
    Fail: full stabilityDebuff + wall push

Self-cost: −220 spinDelta
powerCost: 100;  cooldownMs: 4 000
NOTE: any beyblade can use Big Wave; no part restriction for special moves.
```

```typescript
function activateBigWave(aquario: Beyblade, targets: Beyblade[]): void {
  targets.forEach(t => {
    t.forceState = "cannot_attack_freely";
    t.forceStateExpiresAt = Date.now() + 700;
  });
  setTimeout(() => {
    targets.forEach(t => {
      if (t.waveRideSuccess) {
        applyLinearImpulse(t, aquario.facingAngle, 800); return;
      }
      applySpinDelta(t, -100);
      t.stabilityDebuff = -0.20; t.stabilityDebuffExpiresAt = Date.now() + 2500;
      applyLinearImpulseTowardWall(t, 2200);
      t.spinDecayBonus = 3.0; t.spinDecayBonusExpiresAt = Date.now() + 3000;
    });
    applySpinDelta(aquario, -220);
  }, 700);
}
```

---

## Case 728 — [COMBO] Aqua Slide: Curved Orbital Sliding Contact (3-key: moveRight attack moveLeft)

**Combo ID:** `aqua-slide`
**Sequence:** moveRight → attack → moveLeft  (→J←)
**Cost:** 15 power
**Type Restriction:** attack
**Part Requirement:** aquarioWheel  (Aquario Fusion Wheel with curved water-flow blade contacts)

Aqua Slide is the combo-level expression of Aquario's curved C₄ blade geometry (Case 726): the moveRight sets up a tight F-tip orbital arc (R_curve=73mm), the attack fires at the apex where φ_apex=30° gives J_smash=0.866×J, and the moveLeft continues the arc in the opposite direction — the "slide" naming reflects the curved blade's gradual engagement that retains ~70% orbital speed through the contact point rather than the sharp deceleration of a flat-face smash; this orbit-slide-orbit cycle suits rapid chained activations exploiting F tip's aggressive re-orbit capability.

```
Aqua Slide — geometry:

Phase 1 (→): F-tip orbital approach right,  R_curve = 73 mm,  v_orb ≈ 0.5 m/s
Phase 2 (J): Aquario curved blade contact,  φ_apex = 30°,  J_smash = 0.866 × J
  spinDelta_contact = −42 rad/s
  damageMultiplier  = 1.20×
  lockMs = 30  (sliding pass-through)
Phase 3 (←): orbital continuation left,  ~70% speed retained

ceiling compliance:
  1.20× ≤ 1.5×;  30 ms ≤ 300 ms;  42 ≤ 50 rad/s;  no invulnerability, no AoE  [check]
```

```typescript
// Combo: ["moveRight","attack","moveLeft"], cost: 15, type: "attack", part: aquarioWheel
function applyAquaSlide(aquario: Beyblade, target: Beyblade): void {
  applySpinDelta(target, -42);
  target.damageMultiplier = 1.20;
  target.locked = true; target.lockExpiresAt = Date.now() + 30;
}
```

---

## Case 729 — [GIMMICK] Evil Befall UW145EWD: Upper Wing Spin Track, Eternal Wide Defense Free-Spin Absorption, and Feather Blade Architecture

**Beyblade:** Evil Befall UW145EWD
**User:** Jack
**Physics Domain:** MFB-era stamina Fusion Wheel, UW145 wing upper-attack contacts, EWD free-spin lateral absorption and near-point stamina tip

**Note:** Evil Befall Fusion Wheel [M]. UW145 from Case 303. EWD from Case 302. All [M] values carry ±15% uncertainty.

**Thesis:** Evil Befall UW145EWD's battle identity is a two-layer threat architecture: a stamina foundation (EWD near-point tip + free-spin lateral absorption ring) supporting an aerial upper-attack layer (UW145's 4 wing protrusions at h=14.5mm providing θ_wing=+12° upper contacts and energy feather generation); the Evil Befall Fusion Wheel [M] is a smooth wide-profile stamina wheel (φ_outer≈42°, recoil-dominant, low aerodynamic drag) prioritising spin retention; UW145 (Case 303) provides the offensive element: its 4 wing protrusions rotate at ω=600 rad/s to f_wing=382Hz theoretical passage frequency, generating centrifugal energy the BeySpirit channels into feather-blade projectiles (Befall The Ripper, Case 730) or a spiral cutting conduit (Beautiful Dead, Case 731); EWD (Case 302) provides extreme stamina via r_eff_core≈1.5mm near-point contact + free-spinning outer ring (α_EWD=0.45 lateral absorption), making Evil Befall highly resistant to positional disruption.

```
Evil Befall Fusion Wheel [M]:

  Stamina-type smooth profile,  φ_outer ≈ 42°  (recoil-dominant, deflects)
  C₂ symmetry (2-fold)  [franchise imagery];  r_outer ≈ 22 mm

UW145 (Upper Wing 145) [Case 303]:
  h = 14.5 mm;  N_wings = 4 (C₄, 90° spacing)
  θ_wing = +12°  (upward attack angle)
  J_upper = sin(12°) × J = 0.208 × J  (vertical component per wing strike)
  r_wing ≈ 21 mm
  At ω = 600 rad/s:  f_wing = 4 × (600 / 2π) = 382 Hz  (theoretical peak)
  BeySpirit channels wing centrifugal energy into feather-blade projectiles / spiral conduit

EWD (Eternal Wide Defense) [Case 302]:
  Core: r_eff_core ≈ 1.5 mm,  μ_core ≈ 0.08
  dω/dt = −(0.08 × 0.050 × 9.81 × 0.0015) / 1.0×10⁻⁵ = −5.9 rad/s²
  Spin life (free): 600 / 5.9 ≈ 101.7 s
  Outer ring: I_ring ≈ 2.0×10⁻⁶ kg·m²;  α_EWD = 0.45
    → J_effective_on_bey = 0.55 × J_lateral

Assembly [MFB era]:
  m = 0.050 kg,  I = 1.0×10⁻⁵ kg·m²,  ω₀ = 600 rad/s,  W = 0.491 N
```

```typescript
interface EvilBefallAssembly {
  m_kg: number;              // 0.050
  I_kgm2: number;            // 1.0e-5
  omega0_rads: number;       // 600
  phi_outer_deg: number;     // 42 [M]
  N_wings: number;           // 4 [Case 303]
  theta_wing_deg: number;    // 12
  r_wing_m: number;          // 0.021
  rEff_core_m: number;       // 1.5e-3 [Case 302]
  spinDecay_rads2: number;   // 5.9
  alpha_EWD: number;         // 0.45
}
```

---

## Case 730 — [SPECIAL MOVE] Befall The Ripper: Jack / Evil Befall UW145EWD (Metal Fight Beyblade)

**Franchise Move:** UW145 creates a strong whirlwind acting as a vacuum cutter, flinging Befall's feathers across the battlefield as cutting blades that slash both opponent and stadium. Alternatively, UW145 glows pink and Befall slashes directly. Jack uses this move to draw artwork on the stadium — a rose against Klaus, a peacock against Ryuga (later shattered by Meteo L-Drago LW105LF). [Metal Fight Beyblade Metal Masters]

**Thesis:** Befall The Ripper is the BeySpirit projection of UW145's wing energy system (Case 729): the BeySpirit spins the wings above physical speed, the vacuum-cutter aerodynamics (Bernoulli pressure differential between wing edges) launching N_FEATHER feather-blade projectiles in a pattern sequence that traces Jack's chosen artwork on the arena floor — each feather creates a persistent slash zone; the spatial-temporal threat (opponents cannot easily avoid crossing the pattern because it's designed for maximum area coverage) is the move's core mechanic; SPIN_TIER=3+ produces the peacock pattern (12 feathers, widest coverage), the same pattern Ryuga's Meteo L-Drago had to shatter; the low-spin fallback (Pink Slash) fires a single direct upper strike when insufficient energy remains for full feather projection.

```
Befall The Ripper — phase structure:

Phase 1 — "whirlwind_build" (500 ms):
  UW145 wings at BeySpirit-amplified speed; vacuum vortex builds
  forceState on all opponents: must_keep_distance  (500 ms)
  visual: pink/white energy aura at UW145 level

Phase 2 — "feather_scatter" (spin ≥ 30% maxSpin):
  SPIN_TIER = clamp(floor(spin / maxSpin × 4), 0, 4)
  N_FEATHER  = 8 + SPIN_TIER  (range: 8–12)
  pattern_style: "rose" if SPIN_TIER ≤ 2,  "peacock" if SPIN_TIER ≥ 3

  Feather launch (40 ms between each):
    Slash zone at landing point: r_zone = 25 mm, active 2 500 ms
    Immediate hit (opponent at landing): spinDelta = −30, impulse = 350 eu, dmg = 0.85×
  Active slash zones (2 500 ms):
    Opponent entering zone: spinDelta = −25, dmg = 0.85×  (1 trigger per zone per opponent)
  forceState on primary: must_keep_distance  (2 500 ms)

Low-spin fallback (spin < 30% maxSpin) — "Pink Slash":
  Phase 2 replaced by: spinDelta = −380, impulse = 3 500 eu, dmg = 1.8×, lockMs = 150

Self-cost: −100 spinDelta
powerCost: 100;  cooldownMs: 3 500
NOTE: any beyblade can use Befall The Ripper; no part restriction for special moves.
```

```typescript
function activateBefallTheRipper(befall: Beyblade, targets: Beyblade[]): void {
  targets.forEach(t => { t.forceState = "must_keep_distance"; t.forceStateExpiresAt = Date.now() + 500; });
  setTimeout(() => {
    if (befall.spin < befall.maxSpin * 0.30) {
      const p = targets[0];
      applySpinDelta(p, -380); applyLinearImpulse(p, befall.facingAngle, 3500);
      p.damageMultiplier = 1.8; p.locked = true; p.lockExpiresAt = Date.now() + 150;
    } else {
      const tier = Math.min(4, Math.floor((befall.spin / befall.maxSpin) * 4));
      const style = tier >= 3 ? "peacock" : "rose";
      const pts = generatePatternPoints(style, 8 + tier);
      pts.forEach((pt, i) => setTimeout(() => {
        createSlashZone(pt, 25, 2500);
        targets.forEach(t => { if (distanceTo(t, pt) < 25) {
          applySpinDelta(t, -30); applyLinearImpulse(t, angleFrom(befall, t), 350); t.damageMultiplier = 0.85;
        }});
      }, i * 40));
      targets.forEach(t => { t.forceState = "must_keep_distance"; t.forceStateExpiresAt = Date.now() + 2500; });
    }
    applySpinDelta(befall, -100);
  }, 500);
}
```

---

## Case 731 — [SPECIAL MOVE] Beautiful Dead: Jack / Evil Befall UW145EWD (Metal Fight Beyblade)

**Franchise Move:** Befall flies towards the sky surrounded in a fiery and rainbow-colored aura, then smashes down on top of the opponent while spiraling and attacking with UW145. First used against Klaus — sent Klaus into a coma after colliding with Klaus' special move Steel Darkness. [Metal Fight Beyblade Metal Masters]

**Thesis:** Beautiful Dead is the apex expression of Evil Befall's upper-wing aerial system (Case 729): the BeySpirit launches Befall above the arena plane (beyTiltAngle → 85°, near-vertical, 2.5D z-lift via ClimbingPhysics system), wraps it in a combined fire-and-peacock-spirit aura, then corkscrews it downward with UW145 wings at maximum speed — the wings (θ_wing=+12°, r_wing=21mm) lead the contact as Befall spirals in, creating a multi-point rotating impact rather than a single blade strike; the combined fire+disorientation debuff reflects the dual elemental aura; the extreme spinDelta=−640 is consistent with the Klaus coma outcome — the clash with "Steel Darkness" triggered a mutual-destruction event captured in the clash_check mechanic: if both specials are ≥500 spinDelta simultaneously, both beys take 60% of each other's spinDelta, and draw_condition activates if both reach ≤0.

```
Beautiful Dead — phase structure:

Phase 1 — "aerial_ascent" (600 ms):
  beyTiltAngle → 85°  (BeySpirit z-lift, ClimbingPhysics)
  Rainbow-fire peacock aura forms
  forceState on all opponents in r_ascent = 180 mm: cannot_attack_freely  (600 ms)
  visual: Befall rises with rainbow-fire spiral; peacock spirit expands

Phase 2 — "spiral_dive" (contact at 300 ms descent):
  UW145 wings at BeySpirit-amplified max speed; corkscrew contact geometry
  spinDelta      = −640 rad/s
  linearImpulse  = 6 200 eu
  upwardKick_eu  = 400 eu  (UW145 θ_wing=+12° vertical component)
  damageMultiplier = 2.6×

  Rainbow-fire debuff:
    fire_debuff: spinDecayRate × 1.3× for 2 000 ms
    disorientation: forced_movement_override for 400 ms

  QTE — "Dead Drop":
    Window: 200 ms;  Input: dodge
    Success: 50% of spinDelta + impulse applied  (−320, 3 100 eu)
    Fail: full spiral lands

  Clash check (Steel Darkness mechanic):
    If opponent fires a special with inboundSpinDelta ≥ 500 in same 300 ms window:
      mutual_clash = true
      both take 60% of opponent's spinDelta
      draw_condition if both spins ≤ 0 after clash

Self-cost: −220 spinDelta
powerCost: 100;  cooldownMs: 5 000
NOTE: any beyblade can use Beautiful Dead; no part restriction for special moves.
```

```typescript
function activateBeautifulDead(befall: Beyblade, targets: Beyblade[]): void {
  const prevTilt = befall.beyTiltAngle;
  befall.beyTiltAngle = 85;
  targets.forEach(t => { t.forceState = "cannot_attack_freely"; t.forceStateExpiresAt = Date.now() + 600; });

  setTimeout(() => {
    befall.beyTiltAngle = prevTilt;
    const primary = targets[0];
    if (primary.deadDropSuccess) {
      applySpinDelta(primary, -320); applyLinearImpulse(primary, befall.facingAngle, 3100);
    } else if (primary.inboundSpecialSpinDelta >= 500) {
      applySpinDelta(befall, -primary.inboundSpecialSpinDelta * 0.60);
      applySpinDelta(primary, -640 * 0.60);
      if (befall.spin <= 0 && primary.spin <= 0) { befall.drawCondition = primary.drawCondition = true; }
    } else {
      applySpinDelta(primary, -640);
      applyLinearImpulse(primary, befall.facingAngle, 6200);
      applyLinearImpulseUpward(primary, 400);
      primary.damageMultiplier = 2.6;
      primary.fireDebuff = 1.3; primary.fireDebuffExpiresAt = Date.now() + 2000;
      primary.forceState = "forced_movement_override"; primary.forceStateExpiresAt = Date.now() + 400;
    }
    applySpinDelta(befall, -220);
  }, 600);
}
```

**Beautiful Dead vs Befall The Ripper:**
```
Property              Befall The Ripper            Beautiful Dead
────────────────────────────────────────────────────────────────
Attack style          AoE zone pattern scatter      Single-target aerial dive
spinDelta (full)      up to −30 × zones crossed     −640 (direct)
UW145 role            Feather projectile launch     Corkscrew spiral contact
Self-cost             −100                          −220
Debuff                must_keep_distance zones      fire + disorientation
Clash potential       No                            Yes (≥500 inbound triggers mutual)
Power tier            Crowd control                 Elite (Klaus coma)
```

---

## Case 732 — [COMBO] Wing Slash: UW145 Upper-Approach Contact (3-key: moveUp attack moveUp)

**Combo ID:** `wing-slash`
**Sequence:** moveUp → attack → moveUp  (↑J↑)
**Cost:** 20 power
**Type Restriction:** attack
**Part Requirement:** uw145Track  (UW145 Upper Wing 145 spin track)

Wing Slash is the combo-level expression of UW145's wing upper-attack geometry (Case 729): the first moveUp commits Evil Befall to an upward-angled approach arc, positioning UW145 wings above the opponent's contact plane (h=14.5mm advantage); the attack fires where the wing tip at θ_wing=+12° makes upper contact (J_upper=0.208×J vertical, J_smash=0.978×J horizontal), and the second moveUp continues through the contact point — re-elevating for rapid follow-up upper attacks; the θ_wing=+12° upward displacement (lockMs=120ms) accumulates across chained activations; cost 20 sits between light-mobile (15) and hard-hit (25) combos, reflecting moderate-per-hit but high-cadence use.

```
Wing Slash — geometry:

Phase 1 (↑): upper-angle approach,  θ_wing = +12° height advantage
Phase 2 (J): UW145 wing contact
  J_smash = cos(12°) × J = 0.978 × J  (horizontal)
  J_upper = sin(12°) × J = 0.208 × J  (vertical — upward displacement)
  spinDelta_contact = −50 rad/s  (ceiling)
  damageMultiplier  = 1.35×
  lockMs = 120  (upward tilt disruption — longer axis destabilisation)
Phase 3 (↑): continuation at ~55% orbital speed,  re-positions for next upper approach

ceiling compliance:
  1.35× ≤ 1.5×;  120 ms ≤ 300 ms;  50 ≤ 50 rad/s;  no invulnerability, no AoE  [check]
```

```typescript
// Combo: ["moveUp","attack","moveUp"], cost: 20, type: "attack", part: uw145Track
function applyWingSlash(befall: Beyblade, target: Beyblade): void {
  applySpinDelta(target, -50);
  target.damageMultiplier = 1.35;
  target.locked = true; target.lockExpiresAt = Date.now() + 120;
}
```

---

## Case 733 — [GIMMICK] Beast Betromoth Heavy Hold: Hold Tip Dual-Regime Centripetal Stability and Heavy Disc Inertia Stack

**Beyblade:** Beast Betromoth Heavy Hold
**User:** Ben Azuki
**Physics Domain:** Burst God Layer era, Hold tip dual-contact-regime (centered sharp vs tilted rubber ring), Heavy disc high-inertia stack, Beast Betromoth defense-type layer

**Note:** Beast Betromoth Energy Layer [M]. Hold Performance Tip [M]. Forge Disc Heavy from Case 460. All [M] values carry ±15% uncertainty.

**Thesis:** Beast Betromoth Heavy Hold's battle identity rests on the Hold tip's (Case 460 comparator era) dual-regime contact physics: (1) centered regime — the inner sharp point makes near-point contact (r_eff_sharp≈0.8mm, μ=0.10, decay≈−3.5 rad/s²) with the centripetal gyroscopic force keeping the bey balanced → extreme stamina (spin life ≈ 171s free); (2) tilted regime — when spin falls below ω_hold threshold (≈200 rad/s), tilt begins and the outer rubber ring (r_eff_rubber≈5.0mm, μ_rubber≈0.42) contacts the floor → decay accelerates to −97.5 rad/s² (spin life ≈ 6.2s at 600 rad/s entry → catastrophic spin drain); the Hold threshold acts as a "point of no return" — above it, Betromoth is near-unkillable by attrition; below it, rapid self-destruction; the Heavy disc (Case 460) amplifies this by maximising I, reducing the angular velocity impact of each collision (high I = smaller Δω per hit = harder to push below ω_hold); Beast Hold (Case 734) deliberately induces high tilt at BeySpirit-preserved ω > ω_hold — exploiting the geometry without triggering the scrape penalty.

```
Beast Betromoth Energy Layer [M]:

  Defense-type smooth profile;  φ_outer ≈ 42°  (recoil-dominant, deflects attacks)
  C₄ symmetry (4-fold, 90° spacing)  [franchise imagery estimate]
  r_outer ≈ 22 mm;  metal inserts for high I contribution

Forge Disc Heavy [Case 460]:
  m_disc ≈ 32 g  (one of heaviest Burst discs)  [Case 460]
  Wide outer mass distribution → high I contribution
  I_disc ≈ 3.0×10⁻⁶ kg·m²  (estimated from disc geometry)

Hold Performance Tip [M]:
  Centered regime (spin ≥ ω_hold ≈ 200 rad/s):
    r_eff_sharp ≈ 0.8 mm,  μ_sharp ≈ 0.10
    dω/dt_centered = −(0.10 × 0.052 × 9.81 × 0.0008) / 1.15×10⁻⁵ = −3.5 rad/s²
    Spin life (centered): 600 / 3.5 ≈ 171 s
  Tilted regime (spin < ω_hold, outer rubber ring contacts floor):
    r_eff_rubber ≈ 5.0 mm,  μ_rubber ≈ 0.42
    dω/dt_tilted = −(0.42 × 0.052 × 9.81 × 0.005) / 1.15×10⁻⁵ = −93.0 rad/s²
    Spin life (tilted): 600 / 93.0 ≈ 6.5 s  [catastrophic]
  Hold threshold: ω_hold ≈ 200 rad/s  (≈33% of ω₀)

Assembly [Burst God Layer era]:
  m = 0.052 kg  (Heavy disc added mass),  I = 1.15×10⁻⁵ kg·m²,  ω₀ = 600 rad/s
  W = 0.052 × 9.81 = 0.510 N
```

```typescript
interface BetromothAssembly {
  m_kg: number;                // 0.052
  I_kgm2: number;              // 1.15e-5
  omega0_rads: number;         // 600
  // Hold tip [M]
  rEff_sharp_m: number;        // 0.8e-3
  rEff_rubber_m: number;       // 5.0e-3
  mu_sharp: number;            // 0.10
  mu_rubber: number;           // 0.42
  spinDecay_centered: number;  // 3.5 rad/s²
  spinDecay_tilted: number;    // 93.0 rad/s²
  omega_hold: number;          // 200 rad/s — tilt threshold
}
function holdTipDecay(asm: BetromothAssembly, omega: number): number {
  return omega >= asm.omega_hold ? asm.spinDecay_centered : asm.spinDecay_tilted;
}
```

---

## Case 734 — [SPECIAL MOVE] Beast Hold: Ben Azuki / Beast Betromoth Heavy Hold (Beyblade Burst)

**Franchise Move:** Beast Hold makes Betromoth spin in a very wobbly manner, takes the arena center, and acts like a Defense Type to repel attacks — but if it starts scraping the ground, it loses strength far more quickly. [Beyblade Burst God Layer]

**Thesis:** Beast Hold is the BeySpirit amplification of the Hold tip's centered-regime stability (Case 733): the BeySpirit deliberately increases beyTiltAngle to 25° (controlled high wobble) while maintaining ω above ω_hold=200 rad/s — exploiting the Hold tip's geometry in a way that normally wouldn't be stable under physics alone (anime physics override); the high wobble creates a wide-radius defense circle: attackers hit the wobbling outer mass rather than the center CoM, and the distributed impact geometry (φ_deflect≈42° on all sides due to full wobble rotation) combined with the Heavy disc's high I means each collision converts to smaller spin loss and larger rebound for the attacker; however, the scrape risk is real — if an opponent lands a sufficiently large spinDelta hit driving Betromoth below ω_hold=200 rad/s during hold_mode, the outer rubber ring contacts the floor and activates the catastrophic −93.0 rad/s² decay regardless of BeySpirit intent (the physical penalty overwhelms BeySpirit preservation); opponents are forced to attack (must_attack forceState) because Betromoth at center with Beast Hold active is an immovable hazard.

```
Beast Hold — phase structure:

Activation:
  beyTiltAngle → 25°  (BeySpirit-controlled high wobble — anime override maintains spin above ω_hold)
  Betromoth moves to / locks at arena center (position lock)

Hold Mode (2 500 ms duration):
  incomingDamageReduction = 0.50×  (attacks deflected by wobble geometry + Heavy disc I)
  forceState on opponents: must_attack  (cannot avoid Betromoth at center; must try to break hold)
  visual: purple beast aura, Betromoth wobbling widely but maintaining spin

  Scrape risk condition:
    If spin drops below ω_hold = 200 rad/s during hold_mode:
      scrape_active = true
      additional spinDecay: +89.5 rad/s² (tilted regime −93.0 − centered −3.5)
      visual: sparks + smoke from floor contact
      hold_mode ends immediately on scrape
    Note: a single big hit (spinDelta ≥ ~400) can drive below ω_hold even from full spin

End of hold_mode:
  beyTiltAngle returns to normal
  position lock released

Self-cost: −80 spinDelta  (entering controlled wobble)
powerCost: 80;  cooldownMs: 4 000
NOTE: any beyblade can use Beast Hold; no part restriction for special moves.
```

```typescript
function activateBeastHold(betromoth: Beyblade): void {
  const prevTilt = betromoth.beyTiltAngle;
  betromoth.beyTiltAngle = 25;
  betromoth.positionLocked = true; betromoth.lockToCenter = true;
  betromoth.holdMode = true; betromoth.holdModeExpiresAt = Date.now() + 2500;
  betromoth.incomingDamageReduction = 0.50;

  // opponents forceState is set by room to must_attack for duration

  const scrapeCheck = setInterval(() => {
    if (!betromoth.holdMode) { clearInterval(scrapeCheck); return; }
    if (betromoth.spin < 200) {  // below ω_hold
      betromoth.scrapeActive = true;
      betromoth.spinDecayBonus = 89.5; // additional rubber ring decay
      betromoth.holdMode = false;
      betromoth.beyTiltAngle = prevTilt;
      betromoth.positionLocked = false;
      clearInterval(scrapeCheck);
    }
  }, 1000 / 60);

  setTimeout(() => {
    if (betromoth.holdMode) {
      betromoth.holdMode = false;
      betromoth.beyTiltAngle = prevTilt;
      betromoth.positionLocked = false;
      betromoth.incomingDamageReduction = 1.0;
    }
    applySpinDelta(betromoth, -80);
  }, 2500);
}
```

---

## Case 735 — [COMBO] Center Guard: Hold-Mode Brace and Counter-Wobble Deflection (3-key: defense moveDown defense)

**Combo ID:** `center-guard`
**Sequence:** defense → moveDown → defense  (K↓K)
**Cost:** 20 power
**Type Restriction:** defense
**Part Requirement:** holdTip  (Hold Performance Tip with centripetal-hold and rubber outer ring)

Center Guard is the combo-level expression of the Hold tip's centripetal stability (Case 733): the first defense (K) braces into centered hold mode (inner point contact, maximum stability), the moveDown pulls Betromoth toward the arena center (centripetal momentum — the Hold tip's self-centering nature exploited as a pulling motion), and the second defense (K) locks the hold while the wobble contact delivers a brief deflection strike; the combo exploits the Hold tip's geometry to turn incoming approaches into controlled wobble contacts — the attacker's approach is absorbed by the broad wobble radius and redirected as a glancing spinDelta; lockMs=180ms reflects the sustained hold contact as the attacker's momentum is neutralized.

```
Center Guard — geometry:

Phase 1 (K): defense brace,  Hold tip enters centered mode  (near-point contact locked)
Phase 2 (↓): center-pull movement — Hold tip centripetal tendency exploited
Phase 3 (K): hold-mode wobble contact
  spinDelta_contact = −25 rad/s  (moderate; deflection not full smash)
  damageMultiplier = 1.10×
  lockMs = 180  (sustained hold — attacker trapped in wobble contact)
  incomingDamageReduction during Phase 3: 0.25×  (180 ms)

ceiling compliance:
  1.10× ≤ 1.5×;  180 ms ≤ 300 ms;  25 ≤ 50 rad/s;  no invulnerability, no AoE  [check]
```

```typescript
// Combo: ["defense","moveDown","defense"], cost: 20, type: "defense", part: holdTip
function applyCenterGuard(betromoth: Beyblade, target: Beyblade): void {
  betromoth.incomingDamageReduction = 0.75; // 25% reduction during Phase 3
  betromoth.incomingDamageReductionExpiresAt = Date.now() + 180;
  applySpinDelta(target, -25);
  target.damageMultiplier = 1.10;
  target.locked = true; target.lockExpiresAt = Date.now() + 180;
}
```

---

## Case 736 — [GIMMICK] Magma Ifritor Ciquex-Q Jaggy-Q+Wave-4: Jagged Tip Micro-Impact Evasion System in High Mode

**Beyblade:** Magma Ifritor Ciquex-Q Jaggy-Q+Wave-4
**User:** Ilya Mao
**Physics Domain:** Burst DB/QuadDrive era, Jaggy-Q tip irregular-tooth micro-impact lateral force generation, Wave-4 armor deflection layer, Ciquex-Q chassis, High Mode center-of-mass elevation

**Note:** Magma Ifritor Blade [M], Ciquex-Q Chassis [M], Jaggy-Q Tip [M estimated from Case 475 Jaggy comparator], Wave-4 Armor [M]. All [M] values carry ±15% uncertainty.

**Thesis:** Magma Ifritor Ciquex-Q Jaggy-Q+Wave-4's battle identity is built on the Jaggy-Q tip's micro-impact evasion system in High Mode: the Jaggy-Q tip (variant of Case 475 Jaggy, Q-system upgrade) has a serrated outer ring of jagged teeth (N_teeth≈12, each tooth height≈0.3mm) that create micro-impulse floor contacts at each rotation — at ω=600 rad/s, f_tooth=N_teeth×(ω/2π)=12×95.5=1146 Hz micro-impact frequency, each generating a small lateral force pulse F_tooth≈0.8N (estimated); in High Mode the chassis raises the CoM by ~3.5mm, increasing the effective lever arm for each micro-impact pulse and amplifying lateral displacement per impulse by ~1.4× vs Low Mode; Wave-4 armor (r_wave≈18mm, freely rotating) adds a deflection layer: α_wave=0.20 (20% of lateral hit absorbed by Wave armor rotation); the combined result is an assembly that can execute rapid short-burst lateral movements far exceeding what tip friction alone would allow — the basis for Beast Dodge (Case 737).

```
Magma Ifritor Blade [M]:

  Attack-type Burst Blade with fire/lava aesthetic
  Contact geometry [M]: C₃ or C₄ estimated,  r_outer ≈ 22 mm
  High-velocity smash blade contacts

Ciquex-Q Chassis [M]:
  High Mode: CoM raised +3.5 mm above Low Mode
    lateral micro-impact amplification factor: κ_high = 1.4×  (vs Low Mode baseline)
  Low Mode: standard CoM position,  κ_low = 1.0×

Jaggy-Q Tip [M estimated from Case 475]:
  N_teeth = 12 jagged teeth on outer ring
  Tooth height ≈ 0.3 mm;  r_teeth ≈ 2.0 mm effective
  Micro-impact frequency: f_tooth = 12 × (ω/2π)
    At ω = 600 rad/s:  f_tooth = 12 × 95.5 = 1 146 Hz
  F_tooth ≈ 0.8 N per micro-impact  [M estimated]
  μ_jagged ≈ 0.30;  r_eff_avg ≈ 2.5 mm
  dω/dt_low  = −(0.30 × 0.048 × 9.81 × 0.0025) / 1.0×10⁻⁵ = −35.3 rad/s²
  Spin life (Low, free): 600 / 35.3 ≈ 17.0 s
  In High Mode: CoM elevation increases instability → additional decay ≈ +8 rad/s²
  Spin life (High, free): 600 / 43.3 ≈ 13.9 s  (shorter; less stable but more mobile)

Wave-4 Armor [M]:
  r_wave ≈ 18 mm;  freely rotating deflection ring
  α_wave = 0.20  (20% of lateral hit absorbed into Wave armor spin)
  J_effective_on_bey = 0.80 × J_lateral

Assembly [Burst DB/QuadDrive era, estimated]:
  m = 0.048 kg,  I = 1.0×10⁻⁵ kg·m²,  ω₀ = 600 rad/s
  W = 0.048 × 9.81 = 0.471 N
```

```typescript
interface MagmaIfritorAssembly {
  m_kg: number;               // 0.048
  I_kgm2: number;             // 1.0e-5
  omega0_rads: number;        // 600
  mode: "High" | "Low";
  // Jaggy-Q [M, Case 475 comparator]
  N_teeth: number;            // 12
  F_tooth_N: number;          // 0.8
  spinDecay_Low: number;      // 35.3 rad/s²
  spinDecay_High: number;     // 43.3 rad/s²
  // Ciquex-Q [M]
  kappa_high: number;         // 1.4× — High Mode lateral amplification
  // Wave-4 [M]
  alpha_wave: number;         // 0.20
}
function jaggyMicroImpactHz(asm: MagmaIfritorAssembly, omega: number): number {
  return asm.N_teeth * (omega / (2 * Math.PI));  // at ω=600: 1146 Hz
}
```

---

## Case 737 — [SPECIAL MOVE] Beast Dodge: Ilya Mao / Magma Ifritor Ciquex-Q Jaggy-Q+Wave-4 (Beyblade Burst)

**Franchise Move:** Set in High Mode, Magma Ifritor utilizes the Jaggy-Q Tip and Wave Armor Tip's rotation to avoid an opposing Beyblade to dodge the attack. [Beyblade Burst Sparking / QuadDrive]

**Thesis:** Beast Dodge is the BeySpirit amplification of Magma Ifritor's Jaggy-Q High Mode micro-impact evasion system (Case 736): the BeySpirit enforces High Mode (anime override) and amplifies the Jaggy-Q micro-impact frequency to an evasion-capable lateral movement speed — at BeySpirit-amplified f_tooth, the micro-impulse stream generates a continuous lateral positioning capability that creates an effective "dodge field" around Ifritor; the Wave-4 armor's free-spin deflection (α_wave=0.20) handles the remaining 20% of any attacks that land despite the dodge (reflect 20% of incoming impulse back at attacker); the counter-window after the dodge represents the opponent's off-balance moment from striking through empty space — a tactical window Ilya Mao exploits to attack when the opponent is committed to a trajectory that missed; unlike offensive specials, Beast Dodge's self-cost is minimal (−40) because evasive movement is energetically efficient and the BeySpirit sustains the Jaggy-Q micro-impulse without significant spin expenditure.

```
Beast Dodge — phase structure:

Phase 1 — "jagged_step" (300 ms):
  BeySpirit enforces High Mode  (anime override — pre-battle mode irrelevant)
  Jaggy-Q micro-impact frequency amplified; Ifritor repositions away from predicted opponent trajectory
  Wave-4 armor deflection field active
  visual: purple energy trails from jagged micro-steps; Ifritor appears to flicker/jump

Phase 2 — "evasion_field" (1 500 ms):
  evasion_active = true
  Incoming attacks: reduced to 30% effectiveness  (70% base miss rate)
  Wave-4 deflection on any hit landing: 20% of incoming impulse reflected back at attacker
  forceState on self: cannot_be_targeted  (dodge frame — attacks auto-miss unless QTE countered)

  Counter QTE (opponent can attempt to track):
    Opponent input within evasion window: any directional attack
    Auto-fail (dodge field too effective) unless opponent QTE "Dodge Read":
      4 correct alternating directional inputs (←→←→) within 300 ms
      Success: breaks evasion, Ifritor takes 50% of intended attack

Phase 3 — "counter_window" (600 ms after evasion ends):
  counter_bonus = 1.4×  (opponent off-balance from missing)
  Ifritor's next attack in this window: damageMultiplier × 1.4

Self-cost: −40 spinDelta
powerCost: 80;  cooldownMs: 3 000
NOTE: any beyblade can use Beast Dodge; no part restriction for special moves.
NOTE: special move overrides all mechanical mode-state; BeySpirit enforces High Mode
  regardless of pre-battle mode selection (anime physics override).
```

```typescript
function activateBeastDodge(ifritor: Beyblade): void {
  const prevMode = ifritor.mode;
  ifritor.mode = "High";  // BeySpirit enforces High Mode

  setTimeout(() => {
    ifritor.evasionActive = true;
    ifritor.evasionEffectiveness = 0.30; // incoming = 30% of normal
    ifritor.wave4Deflection = 0.20;
    ifritor.cannotBeTargeted = true;
    ifritor.cannotBeTargetedExpiresAt = Date.now() + 1500;

    setTimeout(() => {
      ifritor.evasionActive = false;
      ifritor.cannotBeTargeted = false;
      ifritor.counterBonusActive = true;
      ifritor.counterBonusMultiplier = 1.4;
      ifritor.counterBonusExpiresAt = Date.now() + 600;
      ifritor.mode = prevMode;
    }, 1500);
  }, 300);

  applySpinDelta(ifritor, -40);
}
```

---

## Case 738 — [COMBO] Jagged Counter: Evasion Step and Counter-Strike (3-key: defense moveLeft attack)

**Combo ID:** `jagged-counter`
**Sequence:** defense → moveLeft → attack  (K←J)
**Cost:** 20 power
**Type Restriction:** attack
**Part Requirement:** jaggyQTip  (Jaggy-Q Performance Tip with jagged micro-impact system)

Jagged Counter is the combo-level expression of the Jaggy-Q tip's micro-impact lateral mobility (Case 736): the defense (K) brace absorbs the incoming approach while the Jagged-Q micro-impacts begin generating leftward momentum, the moveLeft (←) executes the evasion step (High Mode lateral displacement using the Jaggy micro-impulse stream), and the attack (J) fires from the flanking position as Ifritor re-engages from the unexpected angle — the counter-strike from flank gets the counter_bonus damageMultiplier (1.30×) from attacking while the opponent is committed to their now-missed forward trajectory; this combo is thematically the player-skill expression of Beast Dodge (Case 737) at combo scale.

```
Jagged Counter — geometry:

Phase 1 (K): defense brace — Jaggy micro-impacts begin lateral buildup
  Wave-4 deflection: α_wave = 0.20 on any incoming impulse during this frame
Phase 2 (←): evasion step — Jaggy-Q micro-impulse stream drives lateral displacement
  opponent's committed trajectory passes through now-empty space
Phase 3 (J): counter from flank
  spinDelta_contact = −38 rad/s  (flanking angle, slightly below ceiling)
  damageMultiplier = 1.30×  (counter bonus — opponent off-balance)
  lockMs = 70

ceiling compliance:
  1.30× ≤ 1.5×;  70 ms ≤ 300 ms;  38 ≤ 50 rad/s;  no invulnerability, no AoE  [check]
```

```typescript
// Combo: ["defense","moveLeft","attack"], cost: 20, type: "attack", part: jaggyQTip
function applyJaggedCounter(ifritor: Beyblade, target: Beyblade): void {
  ifritor.wave4Deflection = 0.20; ifritor.wave4DeflectionExpiresAt = Date.now() + 80;
  applySpinDelta(target, -38);
  target.damageMultiplier = 1.30;
  target.locked = true; target.lockExpiresAt = Date.now() + 70;
}
```

---

## Case 739 — [GIMMICK] Brave Valtryek Evolution' 2A: Brave Ring Rubber CPs, 2A Chassis Dual-Layer Alignment, Evolution' Rubber Dash Drive, and Triple-Layer Contact Architecture

**Beyblade:** Brave Valtryek Evolution' 2A
**User:** Valt Aoi
**Physics Domain:** Burst Sparking/SuperKing era, Brave Ring C₃ rubber contact points, 2A Chassis rubber blade layer, Evolution' rubber dash tip, mid-battle triple-layer CP alignment mechanic

**Thesis:** Brave Valtryek Evolution' 2A's battle identity is a triple-layer rubber system: (1) the Brave Ring (Case 435) carries 3 yellow rubber contact blades (C₃, φ_brave≈15°, μ_rubber=0.55) giving J_smash_ring=0.966×J; (2) the 2A Chassis (Case 436) has its own rubber protrusions (φ_2A≈20°, μ_2A=0.45) as a secondary contact layer; (3) the Evolution' tip (Case 437) is a rubber dash tip — high-friction rubber contact (μ_evo=0.45) providing both the aggressive orbital drive (F_lat = μ×m×g = 0.45×0.050×9.81 = 0.221N, tighter than non-rubber tips) and a close-range floor-drag contact contribution at the moment of impact; under normal physics, Ring and Chassis engage separately (different rotational phases, η_align=1.0), but under BeySpirit alignment (Brave Sword, Case 740), all three rubber layers synchronise simultaneously — η_align_triple=2.0× (J_total = J_ring + J_2A + J_evo ≈ 1.0 + 0.70 + 0.30 = 2.0× J_ring); the Evolution' rubber tip's spin decay (−55.2 rad/s², spin life≈10.9s) is the cost of this aggressive triple-rubber drive system — Brave Valtryek must stay in constant high-speed orbital contact to maximise its rubber system before spin falls.

```
Ring Brave [Case 435]:
  C₃ symmetry (3-fold, 120° spacing);  3 rubber contact blades
  φ_brave ≈ 15°  (aggressive forward smash);  μ_rubber = 0.55
  J_smash_ring = cos(15°) × J = 0.966 × J
  r_CP ≈ 22 mm

Chassis 2A [Case 436]:
  Rubber protrusions,  φ_2A ≈ 20°,  μ_2A ≈ 0.45
  J_2A = cos(20°) × J = 0.940 × J  (secondary contact layer)
  Alignment mechanic (normal, unsynced):  η_align = 1.0  (one layer at a time)

Evolution' Performance Tip [Case 437]  — rubber dash tip:
  Rubber contact;  r_eff ≈ 2.5 mm,  μ_rubber_evo = 0.45
  Orbital drive:  F_lat = 0.45 × 0.050 × 9.81 = 0.221 N
  dω/dt = −(0.45 × 0.050 × 9.81 × 0.0025) / 1.0×10⁻⁵ = −55.2 rad/s²
  Spin life (free): 600 / 55.2 ≈ 10.9 s  (aggressive; rubber cost of high orbital drive)
  Combat contribution: at moment of Brave Ring impact, Evolution' rubber tip drags
    against arena floor under full beyblade weight → J_evo ≈ 0.30 × J_ring
    (floor-drag friction burst at contact moment, proportional to rubber grip)

Triple-layer alignment (BeySpirit, Cases 740):
  η_align_triple = 2.0×
    J_total = J_ring + J_2A + J_evo ≈ 1.0 + 0.70 + 0.30 = 2.0 × J_ring
  Normal (unsynced):  each layer fires independently, effective η = 1.0 per hit

Assembly [Burst Sparking era]:
  m = 0.050 kg,  I = 1.0×10⁻⁵ kg·m²,  ω₀ = 600 rad/s,  W = 0.491 N
```

```typescript
interface BraveValtAssembly {
  m_kg: number;                  // 0.050
  I_kgm2: number;                // 1.0e-5
  omega0_rads: number;           // 600
  // Ring Brave [Case 435]
  phi_brave_deg: number;         // 15
  mu_rubber_brave: number;       // 0.55
  r_CP_m: number;                // 0.022
  cpFold: number;                // 3 (C₃)
  // Chassis 2A [Case 436]
  phi_2A_deg: number;            // 20
  mu_2A: number;                 // 0.45
  // Evolution' rubber dash tip [Case 437]
  rEff_evo_m: number;            // 2.5e-3
  mu_rubber_evo: number;         // 0.45 — rubber tip
  F_lat_evo_N: number;           // 0.221 — orbital drive force
  spinDecay_rads2: number;       // 55.2
  // Triple alignment
  eta_align_triple: number;      // 2.0 (BeySpirit all three rubber layers simultaneous)
  eta_align_normal: number;      // 1.0 (unsynced — one layer at a time)
}
function braveAlignedImpulse(asm: BraveValtAssembly, J_base: number, beySpirit: boolean): number {
  const eta = beySpirit ? asm.eta_align_triple : asm.eta_align_normal;
  return Math.cos(asm.phi_brave_deg * Math.PI / 180) * J_base * eta;
}
```

---

## Case 740 — [SPECIAL MOVE] Brave Sword: Valt Aoi / Brave Valtryek Evolution' 2A (Beyblade Burst)

**Franchise Move:** Utilizing its speed, Brave Valtryek strikes opposing Beyblades with the three yellow rubber blades on the Brave Ring, dealing massive damage. The chassis 2A rubber blades and the Ring's Brave CPs align mid-battle under the BeySpirit to give the impact far heavier force than normally possible. [Beyblade Burst Sparking / Super King]

**Thesis:** Brave Sword is the BeySpirit transcendence of the full triple-rubber alignment system (Case 739): the Valtryek BeySpirit synchronises all three rubber layers — Brave Ring CPs, 2A Chassis blades, and Evolution' rubber tip floor-drag — simultaneously at the contact moment; η_align_triple=2.0× (J_total=1.0+0.70+0.30=2.0×J_ring) is the full stacked force, with the Evolution' rubber tip's floor-drag burst (J_evo≈0.30×J_ring) as the third element that was absent from the normal unsynced play; Evolution' rubber's F_lat=0.221N is also what accelerates the approach to v_orb=4.5m/s (BeySpirit-boosted orbital drive) — the higher the approach speed, the larger J_base, making the Evolution' rubber tip doubly important as both drive vehicle and impact contributor; the spinDelta=−600 reflects the full triple-alignment contact (vs −320 for ring-only unsynchronised); the "blue sword energy" visual is the phase-locked rubber friction field: three rubber contact surfaces simultaneously generating a friction singularity shaped like a sword at the contact face.

```
Brave Sword — phase structure:

Phase 1 — "alignment_charge" (400 ms):
  Evolution' rubber tip drives orbital approach to v_orb = 4.5 m/s  (BeySpirit boost)
    F_lat_evo = 0.221 N at full rubber grip
  BeySpirit synchronises all three rubber layer phases:
    (1) Brave Ring CPs  (2) 2A Chassis blades  (3) Evolution' rubber tip floor-drag
  forceState on target: cannot_attack_freely  (400 ms)
  visual: blue sword energy forms along Brave Ring rubber CP edges

Phase 2 — "brave_sword_strike" (triple-layer simultaneous contact):
  η_align_triple = 2.0×
  J_total = J_ring + J_2A + J_evo = (1.0 + 0.70 + 0.30) × J_base = 2.0 × J_base
  spinDelta      = −600 rad/s
  linearImpulse  = 6 400 eu
  damageMultiplier = 2.5×

  QTE — "Brave Guard":
    Window: 220 ms;  Input: dodge
    Success: 50% applied  (−300 spin, 3 200 eu)
    Fail: full triple strike lands

Self-cost: −180 spinDelta
powerCost: 100;  cooldownMs: 4 500
NOTE: any beyblade can use Brave Sword; no part restriction for special moves.
```

```typescript
function activateBraveSword(valtryek: Beyblade, target: Beyblade): void {
  target.forceState = "cannot_attack_freely";
  target.forceStateExpiresAt = Date.now() + 400;

  setTimeout(() => {
    if (!target.braveGuardSuccess) {
      applySpinDelta(target, -600);                               // triple-layer alignment
      applyLinearImpulse(target, valtryek.facingAngle, 6400);
      target.damageMultiplier = 2.5;
    } else {
      applySpinDelta(target, -300);
      applyLinearImpulse(target, valtryek.facingAngle, 3200);
    }
    applySpinDelta(valtryek, -180);
  }, 400);
}
```

**Brave Sword triple-layer alignment physics:**
```
Layer                   μ_rubber   φ°    J contribution   η component
──────────────────────────────────────────────────────────────────────
Brave Ring CPs          0.55       15°   1.00 × J_base    1.00
2A Chassis blades       0.45       20°   0.70 × J_base    0.70
Evolution' tip (floor)  0.45       —     0.30 × J_base    0.30  [floor-drag burst]
──────────────────────────────────────────────────────────────────────
Triple alignment total  —          —     2.00 × J_base    η = 2.0×

Normal (unsynced):        one layer at a time → η = 1.0,  spinDelta ≈ −320
BeySpirit aligned:        all three simultaneous → η = 2.0×,  spinDelta = −600
QTE success (50%):        −300 spin,  3 200 eu
```

---

## Case 741 — [COMBO] Valtryek Rush: Speed-Burst Approach + Brave Ring Rubber CP Strike + Evolution' Tip Secondary Contact (3-key: moveUp attack moveRight)

**Combo ID:** `valtryek-rush`
**Sequence:** moveUp → attack → moveRight  (↑J→)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** braveRing  (Ring Brave with C₃ rubber contact blades)

Valtryek Rush is the combo-level expression of the triple-rubber system (Case 739) at player-skill scale: the moveUp commits to a speed-burst approach (Evolution' rubber tip F_lat=0.221N driving aggressive orbital), the attack fires where a Brave Ring rubber CP (φ=15°, μ=0.55) makes ceiling-impact contact, and the Evolution' rubber tip simultaneously provides a secondary floor-drag contact (a separate, smaller source from the same orbital approach momentum); the moveRight continues the orbit post-contact — inheriting Valt Aoi's Rush Launch heritage; the two spinDelta sources are: (1) Brave Ring rubber CP = −50 (ceiling), and (2) Evolution' rubber tip secondary floor-drag = −12 (separate source, well below ceiling) — the total effective spinDelta is −62, which is legal because each source individually is ≤ 50; the high damageMultiplier (1.45×) reflects the Brave Ring's μ=0.55 rubber contact; this is the closest combo to Rush Launch in the CS13 library.

```
Valtryek Rush — geometry:

Phase 1 (↑): Evolution' rubber tip drive,  F_lat = 0.221 N,  v_orb ≈ 0.5 m/s
Phase 2 (J): dual-source contact at apex
  Source A — Brave Ring rubber CP (φ=15°, μ=0.55):
    spinDelta_ring = −50 rad/s  (ceiling)
    damageMultiplier = 1.45×
    lockMs = 70
  Source B — Evolution' rubber tip secondary floor-drag (separate source):
    spinDelta_evo = −12 rad/s  (well below ceiling — additional tip friction)
  Combined: −62 rad/s total  (two independent sources, each ≤ 50 individually)
Phase 3 (→): orbital continuation right,  ~65% speed retained  (rubber deceleration)

ceiling compliance:
  spinDelta_ring = 50 ≤ 50 rad/s  (Source A, ceiling exactly)    [check]
  spinDelta_evo  = 12 ≤ 50 rad/s  (Source B, well below ceiling) [check]
  damageMultiplier 1.45× ≤ 1.5×                                   [check]
  lockMs 70 ≤ 300 ms                                              [check]
  no invulnerability, no AoE                                      [check]

Design note: η_align = 1.0 for combos (BeySpirit triple-layer synchronisation is
  special-move-only). Evolution' rubber tip floor-drag at combo scale is a passive
  secondary effect of the orbital approach, not BeySpirit-amplified.
```

```typescript
// Combo: ["moveUp","attack","moveRight"], cost: 25, type: "attack", part: braveRing
function applyValtryekRush(valtryek: Beyblade, target: Beyblade): void {
  // Source A: Brave Ring rubber CP (ceiling)
  applySpinDelta(target, -50);
  target.damageMultiplier = 1.45;
  target.locked = true; target.lockExpiresAt = Date.now() + 70;
  // Source B: Evolution' rubber tip secondary floor-drag (separate source)
  applySpinDelta(target, -12);
  // orbit continues right at ~65% speed
}
```

---



---

## Case 742 â€” [GIMMICK] Mercury Anubius 85XF: Extreme Flat Wide-Contact Drive, Short-Track Low-CoM Impact Geometry, and Flower Pattern Orbital Mechanics

**Beyblade:** Mercury Anubius 85XF
**User:** Yuki Mizusawa
**Physics Domain:** MFB-era Mercury Fusion Wheel smash contacts, 85 short-height track low center-of-mass geometry, XF Extreme Flat wide-contact tornado/flower orbital mechanics

**Note:** Mercury Fusion Wheel [M] and Anubius Clear Wheel [M] are not yet documented in the case library. 85 Track from Case 249. XF Extreme Flat from Cases 341 and 33. All [M] values carry Â±15% uncertainty.

**Thesis:** Mercury Anubius 85XF's battle identity is the interaction of three geometry effects: (1) the XF Extreme Flat tip (Case 341) creates the "flower pattern" orbital (Case 33) â€” a wide flat contact area (r_effâ‰ˆ3.5mm, Î¼=0.35) produces tighter orbital arcs (R_curveâ‰ˆ60mm) than narrower F tips (73mm), generating higher orbital frequency at the same spin rate and creating the characteristic "tornado stall" where the beyblade runs a tight petal-shaped attack path; (2) the 85 track (Case 249, h=8.5mm) places the contact plane unusually low â€” the assembly CoM sits â‰ˆ4.25mm above the floor vs â‰ˆ8mm for 145-height beys, so every collision delivers force at low height, creating an upward-lever torque on the opponent that induces tilt (the foundation of Brave Impact's tilt-induction mechanic, Case 743); (3) the Mercury Fusion Wheel [M] provides forward-facing Câ‚„ smash contacts (Ï†_mercuryâ‰ˆ28Â°, J_smash=0.883Ã—J) that engage frequently due to XF's tight flower-pattern orbit; the trade-off is XF's high spin decay (âˆ’60.0 rad/sÂ², spin lifeâ‰ˆ10.0s) â€” Mercury Anubius 85XF must end battles quickly before its aggressive orbital drive depletes all spin.

```
Mercury Fusion Wheel [M]:

  Câ‚„ contact geometry (4-fold, 90Â° spacing)  [franchise imagery estimate]
  Ï†_mercury â‰ˆ 28Â°  (forward-facing smash);  J_smash = cos(28Â°) Ã— J = 0.883 Ã— J
  r_outer â‰ˆ 22 mm

85 Track [Case 249]:
  h = 8.5 mm  (one of the shortest MFB tracks)
  Assembly CoM height â‰ˆ 4.25 mm above floor  (vs â‰ˆ8 mm for 145-height assemblies)
  Low-angle contact: every collision force delivered below opponent's CoM
    â†’ upward-lever torque on opponent â†’ tilt induction tendency
  No additional gimmick

XF (Extreme Flat) [Cases 341, 33]:
  r_eff â‰ˆ 3.5 mm  (wide flat contact surface)
  Î¼_XF = 0.35  (hard plastic, same material grade as F but wider)
  F_lat = Î¼ Ã— m Ã— g = 0.35 Ã— 0.050 Ã— 9.81 = 0.172 N  (same as F tip)
  dÏ‰/dt = âˆ’(0.35 Ã— 0.050 Ã— 9.81 Ã— 0.0035) / 1.0Ã—10â»âµ = âˆ’60.0 rad/sÂ²
  Spin life (free): 600 / 60.0 = 10.0 s  (aggressive â€” fights must end quickly)

  Flower pattern / tornado orbital [Case 33]:
    R_curve_XF â‰ˆ 60 mm  (tighter than F's 73 mm â€” wider contact = more centripetal grip)
    At v_orb = 0.5 m/s:  f_orbit = v / (2Ï€ Ã— R) = 0.5 / (2Ï€ Ã— 0.060) = 1.33 orbits/s
    Flower pattern: at high Ï‰ the XF tip locks into a repeating tight petal-orbit
      that covers the arena in a systematic grid rather than a random walk
    Tornado stall: as spin decays, petal orbit tightens toward center â†’ 
      late-battle behavior resembles a spinning-top stall rather than a ring-out drift

Assembly [MFB era]:
  m = 0.050 kg,  I = 1.0Ã—10â»âµ kgÂ·mÂ²,  Ï‰â‚€ = 600 rad/s,  W = 0.491 N
```

```typescript
interface MercuryAnubiusAssembly {
  m_kg: number;               // 0.050
  I_kgm2: number;             // 1.0e-5
  omega0_rads: number;        // 600
  // Mercury wheel [M]
  phi_mercury_deg: number;    // 28
  r_outer_m: number;          // 0.022
  contactFold: number;        // 4
  // 85 track [Case 249]
  h_85_m: number;             // 0.0085
  CoM_height_m: number;       // 0.00425 â€” low, delivers upward-lever impact
  // XF tip [Cases 341, 33]
  rEff_XF_m: number;          // 3.5e-3
  mu_XF: number;              // 0.35
  F_lat_N: number;            // 0.172
  spinDecay_rads2: number;    // 60.0
  R_curve_m: number;          // 0.060 â€” tight flower pattern orbit
}
function xfOrbitHz(asm: MercuryAnubiusAssembly, v_orb: number): number {
  return v_orb / (2 * Math.PI * asm.R_curve_m);  // at v=0.5: 1.33 orbits/s
}
```

---

## Case 743 â€” [SPECIAL MOVE] Brave Impact: Yuki Mizusawa / Mercury Anubius 85XF (Metal Fight Beyblade)

**Franchise Move:** The beyblade speeds up to high speed and crashes down on its opponent with a heavy impact. Brave Impact is the first and only special move used by Yuki Mizusawa with Mercury Anubius 85XF. [Metal Fight Beyblade]

**Thesis:** Brave Impact is the BeySpirit transcendence of Mercury Anubius's XF speed-and-low-impact system (Case 742): the Anubius BeySpirit (the Egyptian god of death, Anubis) amplifies the XF flower-pattern orbital to v_orb=4.5 m/s (vs passive 0.5 m/s) and channels all accumulated orbital kinetic energy (E_orb=Â½mvÂ²=Â½Ã—0.050Ã—4.5Â²=0.506J) into a single direct crash approach; the "heavy impact" is both the raw kinetic energy of the crash and the 85 track's low-CoM geometry amplified â€” the contact delivered at h=8.5mm means the impact force acts far below the opponent's CoM (â‰ˆ12-14mm for a typical 145-height bey), creating a large lever-arm torque (Ï„=FÃ—Î”hâ‰ˆFÃ—0.006m) that induces forced tilt on the opponent; the tilt-induction mechanic (beyTiltAngle_opponent += 8Â°, 1500ms) represents this lever-arm effect: the opponent is not just pushed backward but also destabilised rotationally, making them more susceptible to follow-up hits; self-cost is heavy (âˆ’240) because XF's already-aggressive decay (âˆ’60 rad/sÂ²) is compounded by the BeySpirit's full-speed orbital approach â€” Yuki must land this hit to win because the spin investment cannot be recovered.

```
Brave Impact â€” phase structure:

Phase 1 â€” "speed_charge" (500 ms):
  XF drives to v_orb = 4.5 m/s  (BeySpirit flower-pattern amplification)
  E_orb = Â½ Ã— 0.050 Ã— 4.5Â² = 0.506 J
  Anubius spirit aura builds (black/dark-gold Egyptian dog-god form)
  forceState on target: cannot_attack_freely  (500 ms)
  visual: Anubius spirit silhouette forms around beyblade, orbital arc glows dark-gold

Phase 2 â€” "impact_crash" (direct frontal collision):
  Contact delivered at h = 8.5 mm  (below opponent CoM â†’ upward lever torque)
  spinDelta       = âˆ’480 rad/s
  linearImpulse   = 5 000 eu
  damageMultiplier = 2.0Ã—

  Tilt induction (lever-arm effect from 85 track low contact):
    beyTiltAngle_opponent += 8Â°  (1 500 ms duration)
    if opponent spin/maxSpin + stabilityDebuff < 0.40: early wobble triggers

  QTE â€” "Crash Guard":
    Window: 200 ms from crash contact;  Input: defense (K)
    Success: 50% of spinDelta + impulse applied;  no tilt induction
    Fail: full crash + tilt

Self-cost: âˆ’240 spinDelta  (XF orbital speed investment â€” must win with this hit)
powerCost: 100;  cooldownMs: 4 000
NOTE: any beyblade can use Brave Impact; no part restriction for special moves.
```

```typescript
function activateBraveImpact(mercury: Beyblade, target: Beyblade): void {
  target.forceState = "cannot_attack_freely";
  target.forceStateExpiresAt = Date.now() + 500;

  setTimeout(() => {
    if (!target.crashGuardSuccess) {
      applySpinDelta(target, -480);
      applyLinearImpulse(target, mercury.facingAngle, 5000);
      target.damageMultiplier = 2.0;
      // Tilt induction: 85 track delivers contact below opponent CoM
      target.beyTiltAngle = Math.min(target.beyTiltAngle + 8, 45);
      target.tiltInductionExpiresAt = Date.now() + 1500;
    } else {
      applySpinDelta(target, -240);
      applyLinearImpulse(target, mercury.facingAngle, 2500);
    }
    applySpinDelta(mercury, -240);  // heavy self-cost
  }, 500);
}
```

---

## Case 744 â€” [COMBO] Flower Smash: XF Flower-Pattern Direction-Reversal Contact (3-key: moveUp moveDown attack)

**Combo ID:** `flower-smash`
**Sequence:** moveUp â†’ moveDown â†’ attack  (â†‘â†“J)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** xfTip  (XF Extreme Flat Performance Tip with wide-contact flower-pattern orbit)

Flower Smash is the combo-level expression of the XF tip's flower-pattern orbital mechanics (Cases 742, 33): the moveUp enters the upper orbital petal of the XF flower pattern, the moveDown performs the pattern's characteristic direction-reversal (the petal-arc flips from upward to downward â€” the tightest orbital moment where centripetal force is at maximum, R_curve=60mm), and the attack fires at the inner apex of the petal reversal where orbital speed is highest and the Mercury contact face approaches at the tightest angle; the direction-reversal (Phase 2) is the element that makes Flower Smash unpredictable â€” the opponent sees the XF enter from above, then the arc reversal creates a contact from a vector the opponent didn't anticipate; the 85 track's low-contact geometry adds the tilt-induction tendency (passive, not amplified at combo scale): spinDelta = âˆ’48 (XF wide contact, slightly below ceiling â€” the wide contact area spreads force over a larger surface than a blade tip, capping marginally below ceiling force concentration), damageMultiplier = 1.35Ã—.

```
Flower Smash â€” geometry:

Phase 1 (â†‘): XF flower-pattern upper orbital petal,  R_curve = 60 mm
  orbital speed: v_orb â‰ˆ 0.5 m/s  (tight petal arc)

Phase 2 (â†“): petal direction-reversal (arc flips downward â€” tightest orbital moment)
  R_inner â‰ˆ 45 mm at reversal apex  (centripetal grip maximised)
  Opponent cannot predict contact vector during petal flip

Phase 3 (J): Mercury smash contact at inner petal apex
  Ï†_mercury = 28Â°;  J_smash = cos(28Â°) Ã— J = 0.883 Ã— J
  spinDelta_contact = âˆ’48 rad/s  (wide contact area spreads force, marginally below ceiling)
  damageMultiplier = 1.35Ã—
  lockMs = 55  (crisp smash, low-CoM 85 track â†’ minimal upper-axis disruption)

ceiling compliance:
  1.35Ã— â‰¤ 1.5Ã—;  55 ms â‰¤ 300 ms;  48 â‰¤ 50 rad/s;  no invulnerability, no AoE  [check]

Design note: tilt-induction tendency from 85 track low CoM is passive physics at combo scale â€”
  no beyTiltAngle modification applied (special-move-only amplification not present).
  Flower petal reversal self-cost: nil  (direction change on XF's own orbital arc, no deceleration penalty).
```

```typescript
// Combo: ["moveUp","moveDown","attack"], cost: 25, type: "attack", part: xfTip
function applyFlowerSmash(mercury: Beyblade, target: Beyblade): void {
  // XF flower petal reversal: contact at inner petal apex
  applySpinDelta(target, -48);        // wide XF contact â€” marginally below ceiling
  target.damageMultiplier = 1.35;
  target.locked = true; target.lockExpiresAt = Date.now() + 55;
}
```

---



---

## Case 745 â€” [SPECIAL MOVE] Brave Flash: Valt Aoi / Brave Valtryek Evolution' 2A (Burst Sparking)

**Franchise Move:** Brave Valtryek builds up speed by circling around the edge of the Beystadium and rams into the opposing Beyblade with the rubber blade on the Brave Ring, delivering a power slash attack. Brave Flash is the second special move used by Valt Aoi with Brave Valtryek Evolution' 2A. [Beyblade Burst Surge/Sparking]

**Thesis:** Brave Flash is the stadium-orbital expression of Brave Valtryek's system (Case 739) â€” where Brave Sword (Case 740) achieves peak power through BeySpirit triple-layer rubber alignment (Brave Ring + 2A Chassis rubber + Evolution' floor-drag, Î·_total=2.0Ã—), Brave Flash achieves peak speed through a different route: stadium-edge orbital lapping; the Valtryek spirit drives Brave Valtryek to circuit the stadium perimeter at v_orb=4.0 m/s (R_orbitâ‰ˆ120mm edge-ring), a significantly higher orbital speed than the passive flower-pattern orbit (v_orbâ‰ˆ0.5 m/s) â€” the rim-lapping motion allows the Brave Ring rubber blade to brush the stadium wall during each pass, and the centripetal reaction of the wall at R=120mm (F_centripetal=mvÂ²/R=0.050Ã—16/0.120=6.67N) is channelled by the Valtryek spirit as a running acceleration rather than a braking force; the orbital kinetic energy at departure (E_orb=Â½mvÂ²=Â½Ã—0.050Ã—4.0Â²=0.400J) is released as a single Brave Ring rubber blade slam â€” only one rubber contact layer (J_brave_ring=1.0Ã—J, not the triple Î·=2.0Ã— of Brave Sword), so the damage per hit is lower than Brave Sword (spinDelta=âˆ’380 vs âˆ’600; dmgMult=1.8Ã— vs 2.5Ã—), but Brave Flash's primary advantage is approach unpredictability and speed: the edge-circuit conceals the exit angle, the opponent cannot predict which petal-arc the departure follows, and at 4.0 m/s orbital the slam arrives in under 0.1s from wall departure; self-cost is heavy (âˆ’200) because the high-speed orbital lapping drains Evolution' tip spin even with the Valtryek spirit's assistance.

```
Brave Flash â€” phase structure:

Phase 1 â€” "edge_circuit" (1000 ms):
  Brave Valtryek circuits stadium perimeter at R_orbit â‰ˆ 120 mm
  v_orb = 4.0 m/s  (BeySpirit wall-orbital amplification)
  E_orb = Â½ Ã— 0.050 Ã— 4.0Â² = 0.400 J  (orbital kinetic energy)
  F_centripetal = 0.050 Ã— 16 / 0.120 = 6.67 N  (wall reaction force)
  Valtryek spirit aura builds (blue-white energy along orbit trail)
  forceState on target: cannot_predict_approach  (opponent cannot lock camera tracking, 1000 ms)

Phase 2 â€” "orbital_slam" (departure from wall, direct approach):
  Single Brave Ring rubber blade contact  (Î·=1.0Ã—, NOT triple BeySpirit alignment)
  spinDelta       = âˆ’380 rad/s
  linearImpulse   = 5 200 eu  (orbital departure direction)
  damageMultiplier = 1.8Ã—

  QTE â€” "Flash Dodge":
    Window: 250 ms from orbital departure;  Input: dodge (G)
    Success: 50% spinDelta + impulse applied
    Fail: full orbital slam

Self-cost: âˆ’200 spinDelta  (edge-circuit orbital drain on Evolution' tip)
powerCost: 100;  cooldownMs: 4 000

Comparison with Brave Sword (Case 740):
  Brave Flash:  single rubber blade, orbital momentum â†’ spinDelta âˆ’380, dmgMult 1.8Ã—  (speed)
  Brave Sword:  triple rubber alignment Î·=2.0Ã—              â†’ spinDelta âˆ’600, dmgMult 2.5Ã—  (power)
  Brave Flash is the "fast approach" variant; Brave Sword is the "maximum damage" variant.

NOTE: any beyblade can use Brave Flash; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateBraveFlash(valtryek: Beyblade, target: Beyblade): void {
  target.forceState = "cannot_predict_approach";
  target.forceStateExpiresAt = Date.now() + 1000;

  setTimeout(() => {
    if (!target.flashDodgeSuccess) {
      applySpinDelta(target, -380);
      applyLinearImpulse(target, valtryek.facingAngle, 5200);
      target.damageMultiplier = 1.8;
    } else {
      applySpinDelta(target, -190);
      applyLinearImpulse(target, valtryek.facingAngle, 2600);
    }
    applySpinDelta(valtryek, -200);  // edge-circuit orbital drain
  }, 1000);
}
```

---

## Case 746 â€” [COMBO] Brave Edge-Circuit: Wall-Orbit Departure Slash (3-key: moveUp moveRight attack)

**Combo ID:** `brave-edge-circuit`
**Sequence:** moveUp â†’ moveRight â†’ attack  (â†‘â†’J)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** braveRing  (Brave Ring rubber blade)

Brave Edge-Circuit is the combo-level expression of Brave Flash's wall-orbital approach geometry (Case 745): the moveUp enters the upper arc of the stadium-edge orbital path (tracing the high-side rim), the moveRight executes the wall-tangent rightward acceleration phase (the moment where orbital velocity is highest on the departure arc â€” the turn from along-the-wall to away-from-wall converts maximum centripetal momentum into forward velocity), and the attack fires at the orbital departure point where the Brave Ring rubber blade arrives from the wall direction at its fastest approach angle; the edge-circuit direction reversal (from circular to linear) is the unpredictability that defines this combo â€” the opponent sees the wall-lapping arc, then the sudden linear departure arrives from an angle distinct from the initial approach direction; single rubber blade contact only (not BeySpirit triple alignment): spinDelta = âˆ’46 (single Brave Ring rubber CP, approaching ceiling due to orbital velocity addition but not saturated â€” orbital speed adds to contact force, approaching but not matching the triple-layer Brave Sword ceiling), damageMultiplier = 1.35Ã—.

```
Brave Edge-Circuit â€” geometry:

Phase 1 (â†‘): wall-orbit upper arc entry,  R_orbit â‰ˆ 120 mm
  v_orb â‰ˆ 0.5 m/s (passive combo-level orbital, not BeySpirit 4.0 m/s)

Phase 2 (â†’): rightward tangent departure (orbital exit direction = right)
  Departure angle: tangent to orbit at top-right arc â†’ contact from top-right approach
  Orbital to linear transition: unpredictable exit vector relative to initial arc entry

Phase 3 (J): Brave Ring rubber blade contact at orbital exit apex
  Single rubber CP:  Î· = 1.0Ã—  (not triple BeySpirit alignment)
  spinDelta_contact = âˆ’46 rad/s  (orbital velocity addition, near ceiling, single blade)
  damageMultiplier = 1.35Ã—
  lockMs = 60  (rubber blade contact, low-CoM 2A chassis â†’ brief lock)

ceiling compliance:
  1.35Ã— â‰¤ 1.5Ã—;  60 ms â‰¤ 300 ms;  46 â‰¤ 50 rad/s;  no invulnerability, no AoE  [check]

Design note: no self-cost at combo scale â€” orbital direction change on Evolution' tip's own
  passive arc; no BeySpirit wall-acceleration, so no deceleration penalty.
  Distinct from Valtryek Rush (â†‘Jâ†’, Case 741): that fires at petal apex mid-arc (J second);
  Edge-Circuit fires after orbital exit (J third, following full arc + departure).
```

```typescript
// Combo: ["moveUp","moveRight","attack"], cost: 25, type: "attack", part: braveRing
function applyBraveEdgeCircuit(valtryek: Beyblade, target: Beyblade): void {
  // Orbital departure slash: single Brave Ring rubber blade at exit arc
  applySpinDelta(target, -46);        // orbital speed addition, near ceiling, single layer
  target.damageMultiplier = 1.35;
  target.locked = true; target.lockExpiresAt = Date.now() + 60;
}
```

---

## Case 747 â€” [GIMMICK] Quill Quetziko Jerk Press: Jerk Deflection Ratchet, Feathered Contact Blade, and Rubber Press Bit

**Beyblade:** Quill Quetziko Jerk Press
**User:** Quon Limon
**Physics Domain:** BX era Quill Quetziko blade feather contacts, Jerk ratchet asymmetric deflection geometry, Press rubber flat bit

**Note:** Quill Quetziko Blade [M], Jerk Ratchet [M], and Press Bit [M] are not yet documented in the case library. All [M] values carry Â±15% uncertainty.

**Thesis:** Quill Quetziko Jerk Press's battle identity is the Jerk ratchet's deflection geometry: unlike standard numbered BX ratchets (which are mass-distribution and burst-resistance components), the Jerk ratchet [M] has asymmetric Câ‚‚ opposing tabs with steeply angled deflection faces (Ï†_jerkâ‰ˆ40Â°, [M]) that re-direct a fraction of each incoming contact force tangentially rather than transmitting it normally to the core â€” the deflection geometry means that for every attacker blow, J_deflect=sin(40Â°)Ã—J=0.643Ã—J is redirected tangentially (partially back at the attacker and partially sideways), while J_absorbed=cos(40Â°)Ã—J=0.766Ã—J is the force actually received by Quetziko; this passive deflection makes Quill Quetziko naturally counter-friendly â€” attackers hitting the Jerk ratchet feel more recoil than they impart â€” and is the foundation of Bound Launch (Case 748); the Press bit [M] is a flat rubber pressing bit (r_effâ‰ˆ2.0mm, Î¼_press=0.45 [M]) that keeps Quetziko in the mid-range orbital band, with a spin decay of âˆ’41.5 rad/sÂ² and spin life â‰ˆ18.1s; the Quill Quetziko blade [M] adds Câ‚„ spine-tip feather contacts (Ï†_quillâ‰ˆ15Â°, J_upper=sin(15Â°)Ã—J=0.259Ã—J) that give a passive upper-cut tendency on each engagement.

```
Quill Quetziko Blade [M]:

  Câ‚„ feather-spine contacts (4-fold, 90Â° spacing)  [franchise imagery estimate]
  Ï†_quill â‰ˆ 15Â°  (upward-angled spine tips, upper-cut contact tendency)
  J_upper = sin(15Â°) Ã— J = 0.259 Ã— J
  r_outer â‰ˆ 21 mm

Jerk Ratchet [M]:
  Asymmetric Câ‚‚ opposing deflection tabs (2 large tabs, 180Â° spacing)  [M]
  Ï†_jerk â‰ˆ 40Â°  (steeply angled deflection face â€” maximises tangential redirect)
  J_deflect  = sin(40Â°) Ã— J = 0.643 Ã— J  (tangential redirect on each incoming hit)
  J_absorbed = cos(40Â°) Ã— J = 0.766 Ã— J  (transmitted to Quetziko core)
  Passive effect: for every attacker blow, ~64% of their force is redirected sideways/back
  â†’ attacker experiences higher recoil than a standard ratchet would produce
  No additional gimmick (deflection is a geometry property, not a triggered mechanism)

Press Bit [M]:
  r_eff â‰ˆ 2.0 mm  (rubber flat, pressing contact)
  Î¼_press = 0.45  (rubber BX bit grade [M])
  F_lat = Î¼ Ã— m Ã— g = 0.45 Ã— 0.040 Ã— 9.81 = 0.177 N
  dÏ‰/dt = âˆ’(0.45 Ã— 0.040 Ã— 9.81 Ã— 0.002) / 8.5Ã—10â»â¶ = âˆ’41.5 rad/sÂ²
  Spin life (free): 750 / 41.5 = 18.1 s

Assembly [BX era]:
  m = 0.040 kg,  I = 8.5Ã—10â»â¶ kgÂ·mÂ²,  Ï‰â‚€ = 750 rad/s,  W = 0.392 N
```

```typescript
interface QuillQuetzikoAssembly {
  m_kg: number;               // 0.040
  I_kgm2: number;             // 8.5e-6
  omega0_rads: number;        // 750
  // Quill Quetziko blade [M]
  phi_quill_deg: number;      // 15
  r_outer_m: number;          // 0.021
  contactFold: number;        // 4
  // Jerk ratchet [M]
  phi_jerk_deg: number;       // 40
  J_deflect_fraction: number; // 0.643 â€” sin(40Â°)
  J_absorbed_fraction: number;// 0.766 â€” cos(40Â°)
  // Press bit [M]
  rEff_press_m: number;       // 2.0e-3
  mu_press: number;           // 0.45
  F_lat_N: number;            // 0.177
  spinDecay_rads2: number;    // 41.5
}
function jerkDeflectFraction(asm: QuillQuetzikoAssembly): number {
  return Math.sin(asm.phi_jerk_deg * Math.PI / 180);  // 0.643
}
```

---

## Case 748 â€” [SPECIAL MOVE] Bound Launch: Quon Limon / Quill Quetziko Jerk Press (Beyblade X)

**Franchise Move:** Quetziko deflects an opponent's attack with its Jerk disc and knocks them backwards. Bound Launch (ãƒã‚¦ãƒ³ãƒ‰ã‚·ãƒ¥ãƒ¼ãƒˆ, Bound Shoot) is the first and only special move used by Quon Limon with Quill Quetziko Jerk Press. [Beyblade X]

**Thesis:** Bound Launch is the BeySpirit transcendence of the Jerk ratchet's deflection geometry (Case 747): at passive physics, the Jerk ratchet's Ï†_jerk=40Â° face redirects 64.3% of each incoming force tangentially, providing natural counter-recoil; under Quon's Quetzalcoatl BeySpirit the ratchet enters a "deflect-ready" stance where the deflection efficiency is amplified to its physical maximum â€” the full incoming impulse is captured in the Jerk face, converted into a directed bound vector, and then combined with Quetziko's own Jerk-face strike to produce a two-component counter-launch: (1) the opponent's returned force (the "bound" â€” their own kinetic energy thrown back), and (2) Quetziko's added Jerk-disc momentum (the "launch" â€” Quon's own BeySpirit force); the "knocks backwards" description is the combined bound+launch that sends the opponent in the exact reverse direction of their attack approach â€” the Jerk geometry ensures the counter acts along the attacker's own inbound vector, maximising ring-out potential along the axis the attacker chose; Quetziko itself takes only the absorbed fraction (J_absorbed=cos(40Â°)Ã—J=0.766Ã—J) of the incoming spinDelta as self-cost, and the BeySpirit further suppresses this absorbed cost (âˆ’60 spinDelta self in practice); the counter stance expires after 2000ms if no attack lands (move is wasted).

```
Bound Launch â€” phase structure:

Phase 1 â€” "deflect_stance" (2 000 ms window):
  Jerk ratchet enters maximum-deflect alignment under BeySpirit
  forceState on self: deflect_ready  (2 000 ms)
  Quetzalcoatl spirit aura forms (feathered serpent coils around Jerk ratchet)
  Passive: any incoming attack during window triggers Phase 2 automatically

Phase 2 â€” "bound_impact" (triggered on incoming attacker contact within window):
  Incoming spinDelta and impulse intercepted at Ï†_jerk = 40Â°
  Deflected fraction (0.643) returned to attacker + Quetziko added strike:
    spinDelta_attacker   = âˆ’360 rad/s  (returned force + Quetziko addition)
    linearImpulse_attacker = 5 500 eu  (bound-back: attacker's own approach vector reversed)
    damageMultiplier      = 1.9Ã—

  Quetziko self-absorption:
    spinDelta_self = âˆ’60 rad/s  (absorbed fraction, BeySpirit-suppressed from 0.766Ã—J)

  QTE â€” "Counter Lance":
    Window: 200 ms pre-contact (spectator view shows approach vector);  Input: attack (J)
    Success: damageMultiplier = 2.2Ã—  (perfect timing amplifies bound)
    Fail: 1.9Ã— standard deflection

  If no attack within 2 000 ms window: stance expires with no effect.
  (BeySpirit cannot force the counter â€” the opponent must initiate.)

Self-cost: âˆ’80 spinDelta  (Jerk ratchet BeySpirit preparation)
powerCost: 100;  cooldownMs: 5 000  (longer cooldown â€” requires opponent cooperation to trigger)
NOTE: any beyblade can use Bound Launch; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateBoundLaunch(quetziko: Beyblade, allBeyblades: Beyblade[]): void {
  quetziko.forceState = "deflect_ready";
  quetziko.forceStateExpiresAt = Date.now() + 2000;
  applySpinDelta(quetziko, -80);  // BeySpirit preparation cost

  const checkInterval = setInterval(() => {
    if (Date.now() > quetziko.forceStateExpiresAt) {
      clearInterval(checkInterval);
      quetziko.forceState = null;
      return;
    }
    // Trigger handled by collision system: when attacker contacts quetziko
    // while forceState === "deflect_ready", triggerBoundImpact is called
  }, 16);
}
function triggerBoundImpact(quetziko: Beyblade, attacker: Beyblade, counterLanceSuccess: boolean): void {
  const dmgMult = counterLanceSuccess ? 2.2 : 1.9;
  applySpinDelta(attacker, -360);
  applyLinearImpulse(attacker, attacker.facingAngle + Math.PI, 5500);  // reversed direction
  attacker.damageMultiplier = dmgMult;
  applySpinDelta(quetziko, -60);  // absorbed fraction (BeySpirit-suppressed)
  quetziko.forceState = null;
}
```

---

## Case 749 â€” [COMBO] Bound Deflect: Jerk Ratchet Direction-Reversal Counter (3-key: defense moveRight attack)

**Combo ID:** `bound-deflect`
**Sequence:** defense â†’ moveRight â†’ attack  (Kâ†’J)
**Cost:** 25 power
**Type Restriction:** balanced
**Part Requirement:** jerkDisc  (Jerk deflection ratchet)

Bound Deflect is the combo-level expression of the Jerk ratchet's passive deflection geometry (Cases 747, 748): the defense input positions Quetziko in a low-speed guard stance (centred, Press bit gripping), the moveRight executes a brief rightward dash that orients the Jerk ratchet's Câ‚‚ deflection face toward the opponent's most likely approach vector (the rightward dash re-aligns which of the two Jerk tabs faces the opponent â€” since Câ‚‚ is 180Â° symmetric, a 90Â° reorientation brings the steepest deflection face to bear), and the attack fires the Jerk-face smash at this aligned contact angle; the deflection geometry at combo scale is passive physics (not BeySpirit amplification): the contact arrives at Ï†_jerk=40Â° face, spinDelta=âˆ’44 rad/s (Jerk face contact, angled geometry keeps force below ceiling, and the 40Â° contact angle is not optimally perpendicular so force concentration is moderate), damageMultiplier=1.30Ã—; the "knocks backwards" is a modest impulse aligned to the deflection vector, not the full Bound Launch ring-out push.

```
Bound Deflect â€” geometry:

Phase 1 (K): guard stance â€” Quetziko centres, Press rubber bit grips, Jerk Câ‚‚ ratchet
  oriented to current approach angle

Phase 2 (â†’): rightward reorientation dash
  Câ‚‚ Jerk tab rotation: 90Â° right-turn re-aligns steepest deflection face (Ï†_jerk=40Â°)
  to opponent's most likely inbound approach vector

Phase 3 (J): Jerk-face smash contact at aligned deflect angle
  Ï†_jerk = 40Â°  (angled face reduces normal-component force concentration)
  spinDelta_contact = âˆ’44 rad/s  (moderate, angled face, below ceiling)
  damageMultiplier = 1.30Ã—
  lockMs = 50  (Jerk tab contact: short impact â€” ratchet geometry, not a blade lock)

ceiling compliance:
  1.30Ã— â‰¤ 1.5Ã—;  50 ms â‰¤ 300 ms;  44 â‰¤ 50 rad/s;  no invulnerability, no AoE  [check]

Design note: no BeySpirit counter amplification at combo scale â€” passive deflection geometry only.
  The Jerk deflect self-cost is nil (no BeySpirit stance preparation at combo level).
  Bound-back direction: modest lateral deflect (not ring-out-level impulse).
```

```typescript
// Combo: ["defense","moveRight","attack"], cost: 25, type: "balanced", part: jerkDisc
function applyBoundDeflect(quetziko: Beyblade, target: Beyblade): void {
  // Jerk ratchet face contact at Ï†=40Â° deflection angle
  applySpinDelta(target, -44);        // angled face, moderate force, below ceiling
  target.damageMultiplier = 1.30;
  target.locked = true; target.lockExpiresAt = Date.now() + 50;
}
```

---

## Case 750 â€” [GIMMICK] Wolborg 2: Defense Grip Base 2 Bearing Tip, Upper Wolf AR Three-Fold Recoil, and Eight Balance Mass Distribution

**Beyblade:** Wolborg 2
**User:** Tala
**Physics Domain:** Gen1-Plastic (V-Force era) Upper Wolf AR steep-slope recoil contacts, Eight Balance octagonal WD mass distribution, Right SG Bearing v2 [M] precision bearing, Defense Grip Base 2 [M] dual-regime bearing tip

**Note:** Upper Wolf AR from Case 123a. Eight Balance WD from Case 121a. Right SG Bearing v2 [M] and Defense Grip Base 2 [M] are not yet documented in the case library. All [M] values carry Â±15% uncertainty.

**Thesis:** Wolborg 2's battle identity is the combination of its Right SG Bearing v2 [M] and Defense Grip Base 2 [M] â€” the bearing-based base system (descended from the Customize Bearing Base, Case 158) achieves near-frictionless tip contact (Î¼_bearingâ‰ˆ0.025 [M], dÏ‰/dtâ‰ˆâˆ’2.2 rad/sÂ²), extending spin life to â‰ˆ227s under ideal conditions; the Defense Grip Base 2 [M] adds a dual-regime contact structure: during high-spin upright operation the inner bearing tip (r_effâ‰ˆ1.2mm) carries all load (pure bearing regime), but when tilt exceeds â‰ˆ15Â° the outer perimeter grip rubber ring contacts the stadium surface (r_gripâ‰ˆ19mm, Î¼_gripâ‰ˆ0.55), providing sudden high-friction braking against ring-out approaches and gripping the bowl wall; this dual-regime creates Wolborg 2's stamina-defense hybrid â€” its bearing tip can sustain spin over an extraordinary time while its grip ring resists knock-back; the Upper Wolf AR (Case 123a) contributes Câ‚ƒ three-fold recoil contacts (steep slope geometry) that exchange each smash hit for high recoil on the attacker; the Eight Balance WD (Case 121a) provides octagonal polygon mass distribution that concentrates rotational inertia at the corners, maximising the effect of each angular momentum conservation; the sum is a bey that is extremely difficult to spin-out or ring-out, intended to outlast opponents in the arctic attrition of Blizzalog (Case 751).

```
Upper Wolf AR [Case 123a]:
  Câ‚ƒ steep-slope recoil contacts  (3-fold, 120Â° spacing)
  High recoil coefficient: each incoming smash â†’ attacker recoil > force transmitted to Wolborg 2
  See Case 123a for full derivation

Eight Balance WD [Case 121a]:
  Octagonal polygon â€” 8 mass corners at r â‰ˆ 19 mm (distributed inertia)
  I_contribution: corners add â‰ˆ12% inertia vs a smooth ring at same radius
  See Case 121a for full derivation

Right SG Bearing v2 [M]:
  Inner ball-bearing race (upgraded from original Wolborg Right SG Bearing [M])
  Î¼_bearing_v2 â‰ˆ 0.025  (refined tolerance over v1's estimated 0.03 [M])
  Decouples outer SG shell rotation from beyblade core spin rate

Defense Grip Base 2 [M]:
  Dual-regime bearing tip:

  Regime 1 â€” bearing tip (tiltAngle â‰¤ 15Â°, upright high-spin):
    r_bearing â‰ˆ 1.2 mm  (narrow point contact)
    Î¼_bearing_base â‰ˆ 0.025  (bearing-to-floor contact, inherits SG v2 bearing)
    F_lat = 0.025 Ã— 0.046 Ã— 9.81 = 0.011 N
    dÏ‰/dt = âˆ’(0.025 Ã— 0.046 Ã— 9.81 Ã— 0.0012) / 9.5Ã—10â»â¶ = âˆ’1.41 rad/sÂ²
    Spin life (bearing regime): 500 / 1.41 â‰ˆ 355 s  (theoretical maximum, no collisions)

  Regime 2 â€” outer grip ring (tiltAngle > 15Â°, defensive contact):
    r_grip â‰ˆ 19 mm  (outer perimeter rubber ring, contacts stadium bowl wall when tilted)
    Î¼_grip = 0.55  (rubber grip material [M])
    Braking torque = 0.55 Ã— 0.046 Ã— 9.81 Ã— 0.019 = 0.00472 NÂ·m
    This generates rapid deceleration when grip ring engages â€” net effect: resist ring-out
    at the cost of temporary high friction; spin-down if grip engagement persists

  Effective combined spin life (typical battle with minor collisions):
    â‰ˆ 171 s  (below theoretical; collisions cause brief tilt transitions into grip regime)
    â†’ considerably longer than any flat or rubber tip opponent

Assembly [Gen1-Plastic, V-Force]:
  m = 0.046 kg,  I = 9.5Ã—10â»â¶ kgÂ·mÂ²,  Ï‰â‚€ = 500 rad/s,  W = 0.451 N
```

```typescript
interface Wolborg2Assembly {
  m_kg: number;                   // 0.046
  I_kgm2: number;                 // 9.5e-6
  omega0_rads: number;            // 500
  // Defense Grip Base 2 [M]
  rBearing_m: number;             // 1.2e-3
  mu_bearingBase: number;         // 0.025
  rGrip_m: number;                // 0.019
  mu_grip: number;                // 0.55
  gripEngageTiltDeg: number;      // 15
  spinDecay_bearingReg: number;   // 1.41 rad/sÂ²
  spinLife_bearingReg_s: number;  // 355 s (theoretical)
}
function wolborg2SpinDecay(asm: Wolborg2Assembly, tiltAngle: number): number {
  if (tiltAngle > asm.gripEngageTiltDeg) {
    // Grip regime: high braking torque
    const brakingTorque = asm.mu_grip * asm.m_kg * 9.81 * asm.rGrip_m;
    return brakingTorque / asm.I_kgm2;   // â‰ˆ 24.0 rad/sÂ²
  }
  return asm.spinDecay_bearingReg;         // 1.41 rad/sÂ²
}
```

---

## Case 751 â€” [SPECIAL MOVE] Blizzalog: Tala / Wolborg 2 (V-Force era)

**Franchise Move:** Tala first used this move against Tyson during the final match of the World Championship. This move creates a gigantic blizzard that freezes the blader, his opponent, the beyblades and the stadium into a massive dome of icicles, wherein the constant cold gradually reduces the concentration and the endurance of both the beyblade and the blader, allowing Tala to finish them off. Blizzalog is used by Tala with Wolborg 2. [Beyblade V-Force]

**Thesis:** Blizzalog is the BeySpirit transcendence of Wolborg 2's bearing-tip stamina system (Case 750), expressed as an environmental field attack rather than a direct kinetic strike: Tala's Wolborg spirit (the Arctic wolf) amplifies the bearing tip's near-frictionless spin to create a stadium-filling centrifugal vortex (Ï‰â‰ˆ500 rad/s Ã— spirit amplification), which condenses moisture into an icicle dome enclosing both combatants; the dome's constant cold is the strategic weapon â€” "reduces concentration and endurance" in game terms means: (1) opponent spinDecayRate Ã— 1.8 for 20000ms (cold increases tip friction on all non-bearing tip types: flat tips stiffen, rubber tips harden and lose elasticity, increasing their contact friction coefficient), and (2) opponent inputDelayMs += 100ms (blader concentration loss from cold exposure â€” slower reaction time); Wolborg 2 is specifically immune to the spinDecayRate penalty because its Right SG Bearing v2 [M] operates more efficiently in cold (bearing precision improves at lower temperatures, reduced thermal expansion of ball-race tolerances), and Tala's wolf spirit provides cold resistance â€” this differential is Blizzalog's entire strategic logic: Tala accepts the same field condition he imposes because he wins in it and the opponent does not; the initial icicle dome formation delivers a scattered barrage (spinDelta âˆ’150, impulse 1500eu AoE) â€” modest direct damage, but the field attrition over 20000ms is the real threat; self-cost is only âˆ’80 (bearing tip conserves spin through the vortex build); this is an AoE field-effect special, which is why it cannot be replicated at combo scale.

```
Blizzalog â€” phase structure:

Phase 1 â€” "vortex_spinup" (1 000 ms):
  Wolborg 2 bearing tip maintains Ï‰ â‰ˆ Ï‰_max, creates centrifugal air vortex
  Arctic wolf spirit aura builds (white/ice-blue wolf form radiating from tip contact point)
  Visual: frost trail spreads from beyblade outward across stadium floor

Phase 2 â€” "dome_formation" (icicle barrage + field onset):
  Icicle dome closes over stadium â€” scattered icicle impacts on opponent:
    spinDelta_opponent = âˆ’150 rad/s  (distributed icicle impacts, AoE, not concentrated)
    linearImpulse_opponent = 1 500 eu  (scattered; no single-direction push)
  Field activates (20 000 ms duration):
    opponent.spinDecayMultiplier += 0.80   â†’ effective Ã— 1.80  (cold stiffens tip friction)
    opponent.inputDelayMs         += 100   â†’ 100 ms reaction penalty  (blader cold stress)
    arena.surfaceFriction         *= 1.25  (frost layer increases surface drag)
  Wolborg 2 immunity (20 000 ms):
    self.spinDecayMultiplier: no change  (bearing operates cold-efficiently)
    self.inputDelayMs: no change  (Tala arctic-adapted)

Phase 3 â€” "attrition" (field duration, 20 000 ms):
  Opponent gradually loses spin 1.80Ã— faster than baseline
  Wolborg 2 holds near-maximum spin throughout
  Combined with Upper Wolf AR recoil contacts: each attacker hit further accelerates
    opponent spin loss (their strikes bounce off, their tip decays faster in the cold)

Self-cost: âˆ’80 spinDelta  (vortex build against bearing tip regime)
powerCost: 100;  cooldownMs: 6 000
NOTE: AoE field effect â€” persistent arena-wide debuff is special-move-only; combos cannot create arena-wide effects or lasting field conditions.
NOTE: any beyblade can use Blizzalog; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateBlizzalog(wolborg: Beyblade, target: Beyblade, arena: ArenaState): void {
  applySpinDelta(wolborg, -80);   // vortex build cost

  // Icicle barrage (AoE, so applied to all non-wolborg beys in range)
  applySpinDelta(target, -150);
  applyLinearImpulse(target, Math.random() * 2 * Math.PI, 1500);  // scattered direction

  // Field effect â€” 20 000 ms attrition debuffs
  const FIELD_MS = 20000;
  target.spinDecayMultiplier   = (target.spinDecayMultiplier ?? 1.0) * 1.8;
  target.inputDelayMs          = (target.inputDelayMs ?? 0) + 100;
  arena.surfaceFriction        *= 1.25;

  setTimeout(() => {
    target.spinDecayMultiplier  /= 1.8;
    target.inputDelayMs         -= 100;
    arena.surfaceFriction       /= 1.25;
  }, FIELD_MS);
  // Note: wolborg.spinDecayMultiplier unchanged â€” bearing cold immunity
}
```

---

## Case 752 â€” [COMBO] Frost Whip: Defense Grip Base 2 Bearing Endurance Counter (3-key: defense moveUp attack)

**Combo ID:** `frost-whip`
**Sequence:** defense â†’ moveUp â†’ attack  (Kâ†‘J)
**Cost:** 25 power
**Type Restriction:** stamina
**Part Requirement:** defenseGripBase2  (Defense Grip Base 2 [M] bearing tip)

Frost Whip is the combo-level expression of Wolborg 2's bearing-tip spin endurance advantage (Cases 750, 751): the defense input commits Wolborg 2 to the bearing regime â€” centred, low tilt, bearing tip carrying all load, grinding the opponent's spin gap wider with each passing moment; the moveUp extends the bearing hold dwell time (Wolborg 2 drifts slightly upward in the arena, selecting a higher orbital position that naturally steers toward the opponent's path, a bearing-tip geometry effect where the slight tilt required to drift upward keeps the outer grip ring just below engagement threshold while maintaining the bearing's gyroscopic precision); the attack fires a wolf-claw strike (Upper Wolf AR, Case 123a, three-fold Câ‚ƒ recoil contact) at the elevated approach apex â€” at this moment Wolborg 2 has conserved near-maximum spin through the bearing hold, and the opponent has bled spin against their non-bearing tip during the dwell; the spinDelta = âˆ’40 (Upper Wolf AR recoil contact â€” the steep slope means a significant fraction of the force recoils onto the attacker rather than transferring to Wolborg 2, and the spinDelta is intentionally measured at ceiling-compliant value; the real damage is Wolborg 2's spin advantage built during the hold phase), damageMultiplier = 1.25Ã—.

```
Frost Whip â€” geometry:

Phase 1 (K): bearing hold â€” Wolborg 2 centres, bearing tip regime fully engaged
  Bearing spin decay: âˆ’1.41 rad/sÂ² (vs opponent's non-bearing tip ~8â€“40 rad/sÂ²)
  Spin gap widens during hold dwell time

Phase 2 (â†‘): upward drift â€” slight tilt guides Wolborg 2 toward high-side approach
  Tilt during drift: < 15Â° (grip ring stays disengaged, bearing regime maintained)
  Position: elevated arc that intersects opponent's orbit from above

Phase 3 (J): Upper Wolf AR wolf-claw strike at elevated apex
  Câ‚ƒ steep-slope recoil contact (Case 123a)
  spinDelta_contact = âˆ’40 rad/s  (ceiling-compliant; recoil contact, moderate transfer)
  damageMultiplier = 1.25Ã—
  lockMs = 90  (bearing-tip ground contact persists through impact â€” longer physical lock
               due to low-friction tip not deflecting away under impact)

ceiling compliance:
  1.25Ã— â‰¤ 1.5Ã—;  90 ms â‰¤ 300 ms;  40 â‰¤ 50 rad/s;  no invulnerability, no AoE  [check]

Design note: no spinDecayMultiplier reduction at combo scale â€” bearing cold immunity
  is BeySpirit/field territory (Case 751 Blizzalog). The spin advantage in this combo
  is simply the passive bearing tip preserving spin during the hold dwell (real physics).
  Frost Whip self-cost: nil (bearing regime is a conserving state, not costly).
```

```typescript
// Combo: ["defense","moveUp","attack"], cost: 25, type: "stamina", part: defenseGripBase2
function applyFrostWhip(wolborg: Beyblade, target: Beyblade): void {
  // Upper Wolf AR wolf-claw contact: high recoil, moderate spin transfer
  applySpinDelta(target, -40);        // steep-slope recoil â€” ceiling-compliant
  target.damageMultiplier = 1.25;
  target.locked = true; target.lockExpiresAt = Date.now() + 90;
}
```

---



---

## Case 753 â€” [GIMMICK] Brutal LÃºinor 13 Jolt: Impact-Reactive Aerial Launch Tip, 13-Prong Inertia Disc, and Brutal Blade Smash Contacts

**Beyblade:** Brutal LÃºinor 13 Jolt
**User:** Lui Shirosagi
**Physics Domain:** Burst God Layer era Brutal LÃºinor blade smash contacts, Forge Disc 13 heavy inertia distribution, Jolt Performance Tip impact-reactive trajectory

**Note:** Brutal LÃºinor Layer [M] and Forge Disc 13 [M] are not yet documented in the case library and carry ±15% uncertainty. Jolt Performance Tip is documented as Case 585 (CS9); values used below are from that case, recalculated for this assembly.

**Thesis:** Brutal LÃºinor 13 Jolt's battle identity is the Jolt Performance Tip's [Case 585] impact-reactive trajectory property: unlike a standard flat tip which transmits all contact impulse horizontally, the Jolt tip's rubber contact geometry (r_eff=4.5mm, μ_jolt=0.735 rubber at speed [Case 585]) has a specific ground-contact profile that converts a fraction of incoming horizontal impact force into vertical velocity â€” when struck with sufficient lateral force (F_impact > k_jolt_threshold), the bey's trajectory acquires an upward component, launching it away from the arena floor and into a wall-climbing arc (beyTiltAngle rises rapidly toward 60â€“80Â°); this impact-launch property is the physical precondition for Brutal Squall (Case 754); the Forge Disc 13 [M] contributes 13-prong radial mass distribution (heavier than any standard numbered disc at this era, r_prongâ‰ˆ18mm, contributing +12% to assembly inertia vs a smooth ring of equal mass), which adds both rotational inertia (burst resistance) and impact mass that amplifies the dive-bomb contact force; the Brutal LÃºinor Layer [M] provides Câ‚„ aggressive outward-facing blade contacts (Ï†_brutalâ‰ˆ22Â°, J_smash=cos(22Â°)Ã—J=0.927Ã—J) that engage during the dive approach; the combination creates a beyblade with two distinct battle modes: (1) baseline aggressive attacker with high burst resistance from Disc 13's inertia, and (2) the Jolt-enabled aerial trajectory that reframes incoming attacks as opportunities to build the Brutal Squall dive-bomb accumulation.

```
Brutal LÃºinor Layer [M]:

  Câ‚„ aggressive blade contacts (4-fold, 90Â° spacing)  [franchise imagery estimate]
  Ï†_brutal â‰ˆ 22Â°  (forward-facing smash contacts)
  J_smash = cos(22Â°) Ã— J = 0.927 Ã— J
  r_outer â‰ˆ 23 mm

Forge Disc 13 [M]:
  13-prong radial weight distribution  [M, God Layer era heavy disc]
  r_prong â‰ˆ 18 mm  (prong mass at near-maximum radius)
  Inertia contribution: +12% over smooth ring of equal mass
    (13-fold symmetry distributes mass at consistent radii, minimising wobble)
  Burst resistance: high inertia reduces burst susceptibility on direct smash hits

Jolt Performance Tip [Case 585]:
  r_eff = 4.5 mm  (rubber flat contact; 6.0 g, Cho-Z/God era rubber attack tip)
  mu_jolt = 0.735  (rubber viscoelastic kinetic friction at speed, from Case 585)
  F_lat = 0.735 x 0.053 x 9.81 = 0.382 N
  dw/dt = -(0.735 x 0.053 x 9.81 x 0.0045) / 1.20x10^-5 = -143.3 rad/s^2
  Spin life (free): 600 / 143.3 = 4.2 s  (rubber attack tip; burst window is the first 4 s)

  Impact-reactive launch (the gimmick):
    When F_impact_lateral > 4.0 N  [threshold estimate, [M]]
    A vertical velocity component is generated:
      v_z_launch = k_jolt Ã— (F_impact âˆ’ F_threshold) / m
      k_jolt â‰ˆ 0.04 s  [M]  (tip geometry conversion factor)
    At F_impact = 8.0 N: v_z = 0.04 Ã— (8.0 âˆ’ 4.0) / 0.053 = 3.0 m/s  (rapid aerial launch)
    Passive: moderate impacts â†’ brief tilt increase but no full aerial
    Activation: strong impact â†’ full aerial trajectory, beyTiltAngle rises to 60â€“80Â°

Assembly [Burst God Layer era]:
  m = 0.053 kg  (layer + Disc 13 + Jolt),  I = 1.20Ã—10â»âµ kgÂ·mÂ²,  Ï‰â‚€ = 600 rad/s,  W = 0.520 N
```

```typescript
interface BrutalLuinorAssembly {
  m_kg: number;               // 0.053
  I_kgm2: number;             // 1.20e-5
  omega0_rads: number;        // 600
  // Brutal LÃºinor layer [M]
  phi_brutal_deg: number;     // 22
  r_outer_m: number;          // 0.023
  contactFold: number;        // 4
  // Forge Disc 13 [M]
  r_prong_m: number;          // 0.018
  inertiaBonus: number;       // 0.12 (12% above smooth ring)
  // Jolt tip [Case 585]
  rEff_jolt_m: number;        // 4.5e-3
  mu_jolt: number;            // 0.735
  F_impact_threshold_N: number; // 4.0
  k_jolt_s: number;           // 0.04
  spinDecay_rads2: number;    // 143.3
}
function joltLaunchVelocity(asm: BrutalLuinorAssembly, F_impact: number): number {
  if (F_impact <= asm.F_impact_threshold_N) return 0;
  return asm.k_jolt_s * (F_impact - asm.F_impact_threshold_N) / asm.m_kg;
}
```

---

## Case 754 â€” [SPECIAL MOVE] Brutal Squall: Lui Shirosagi / Brutal LÃºinor 13 Jolt (Beyblade Burst God)

**Franchise Move:** After being attacked, LÃºinor is launched into the air and hits one of the stadium walls, flipping off it and into the air. It then dives down to increase its momentum and power, allowing it to deal massive damage and often burst the opposing Bey. Brutal Squall (ãƒ–ãƒ©ãƒƒãƒ‡ã‚£ã‚¹ã‚³ãƒ¼ãƒ«, Bloody Squall) is the first and only special move used by Lui Shirosagi with Brutal LÃºinor 13 Jolt. [Beyblade Burst God]

**Thesis:** Brutal Squall is the BeySpirit transcendence of the Jolt tip's impact-reactive launch property (Case 753): at passive physics, a strong impact triggers a partial aerial with beyTiltAngle rising to 60â€“80Â°; under Lui's LÃºinor BeySpirit (the dragon-spirit transforms the aerial into a full stadium-scale three-phase sequence) the arc is amplified to maximum height; the key physics innovation is the wall-flip phase â€” where a passive impact-launch would see LÃºinor simply arc back down, the BeySpirit maintains the aerial trajectory long enough to intercept the stadium wall at high tilt, and the wall contact at beyTiltAngleâ‰ˆ75Â° reverses the horizontal velocity component (v_wall_flip = âˆ’v_horizontal_in + v_z_residual, the stadium bowl wall angle redirects the bey's combined velocity into a new arc aimed downward toward the arena centre); the dive phase is where Brutal Squall's destructive potential is realised â€” the combination of v_dive (wall-rebound speed) plus gravitational acceleration over h_aerialâ‰ˆ0.15m produces v_impact=sqrt(v_wallÂ²+2Ã—gÃ—h)=sqrt(2Â²+2Ã—9.81Ã—0.15)â‰ˆ2.72 m/s at the moment of contact with the opponent, and the LÃºinor spirit converts this kinetic energy into a burst-torque downward smash (the diving angle means contact force has both a horizontal spin-disruption component and a vertical burst-torque component â€” pushing the opponent's layer down against the chassis, the exact geometry that maximises burst probability); the "often burst" franchise description is captured by the +25% burst chance bonus on the dive contact; Brutal Squall is specifically a counter-attack special â€” the BeySpirit cannot initiate without an incoming hit of sufficient force.

```
Brutal Squall â€” phase structure:

Phase 1 â€” "impact_trigger" (passive â€” activated by incoming hit):
  Trigger condition: opponent attacks LÃºinor with F_impact â‰¥ 4.0 N
  Jolt tip impact-launch: v_z_launch = 0.04 Ã— (F_impact âˆ’ 4.0) / 0.053
  At typical strong attack F_impact = 8.0 N: v_z = 3.0 m/s
  BeySpirit amplifies: beyTiltAngle â†’ 75Â°  (full aerial arc, BeySpirit override)
  LÃºinor dragon spirit coils around bey, blue/silver aura builds during aerial

Phase 2 â€” "wall_flip" (â‰ˆ300 ms aerial arc, contact with stadium wall):
  LÃºinor reaches stadium wall at beyTiltAngle â‰ˆ 75Â°
  Wall contact reverses horizontal velocity:
    v_horizontal_out = âˆ’v_horizontal_in  (elastic wall rebound)
    v_z_residual: brief upward component before gravity dominates
  Combined: bey trajectory flips from upward arc â†’ steep downward dive aimed at opponent
  Visual: LÃºinor silhouette inverts against stadium wall, dragon spirit screams

Phase 3 â€” "dive_impact" (direct frontal downward collision):
  h_aerial â‰ˆ 0.15 m  (height gained during arc)
  v_dive = âˆš(v_wallÂ² + 2 Ã— 9.81 Ã— 0.15) = âˆš(2Â² + 2.94) â‰ˆ 2.72 m/s
  Forge Disc 13 heavy inertia (I = 1.20Ã—10â»âµ kgÂ·mÂ²) concentrates dive mass
  Brutal LÃºinor blade contact at dive approach angle (Ï†_brutal = 22Â°, J=0.927Ã—J):
    spinDelta       = âˆ’520 rad/s  (dive-bomb + blade contact, very high â€” burst level)
    linearImpulse   = 6 000 eu  (downward trajectory into opponent)
    damageMultiplier = 2.2Ã—
  Burst-torque (diving angle pushes layer down â†’ chassis gap):
    burstChanceBonus = +25%  (dive geometry maximises burst-angle torque)

  QTE â€” "Dive Guard":
    Window: 200 ms from wall flip departure;  Input: defense (K)
    Success: 50% of spinDelta + impulse applied;  no burst bonus
    Fail: full dive impact + burst bonus

Self-cost: âˆ’160 spinDelta  (aerial arc during wall-climb phase depletes Jolt tip spin)
powerCost: 100;  cooldownMs: 5 000
NOTE: Brutal Squall requires an incoming attack to trigger Phase 1 â€” if no sufficiently strong
  attack lands, the BeySpirit is not activated and the special does not fire.
NOTE: any beyblade can use Brutal Squall; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateBrutalSquall(luinor: Beyblade, arena: ArenaState): void {
  luinor.forceState = "squall_ready";
  luinor.forceStateExpiresAt = Date.now() + 3000;  // 3s window for incoming hit
  // Trigger handled by collision system: when opponent hits luinor with F >= 4.0N
  // while forceState === "squall_ready", triggerSquallDive is called
}
function triggerSquallDive(luinor: Beyblade, target: Beyblade, diveGuardSuccess: boolean): void {
  luinor.forceState = null;
  if (diveGuardSuccess) {
    applySpinDelta(target, -260);
    applyLinearImpulse(target, luinor.facingAngle, 3000);
  } else {
    applySpinDelta(target, -520);
    applyLinearImpulse(target, luinor.facingAngle, 6000);
    target.damageMultiplier = 2.2;
    target.burstChanceBonus = (target.burstChanceBonus ?? 0) + 0.25;
    setTimeout(() => { target.burstChanceBonus -= 0.25; }, 300);
  }
  applySpinDelta(luinor, -160);  // aerial arc spin drain
}
```

---

## Case 755 â€” [COMBO] Squall Dive: Jolt Aerial Arc Dive Contact (3-key: moveDown moveUp attack)

**Combo ID:** `squall-dive`
**Sequence:** moveDown â†’ moveUp â†’ attack  (â†“â†‘J)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** joltTip  (Jolt Performance Tip [Case 585] with impact-reactive trajectory)

Squall Dive is the combo-level expression of Brutal Squall's three-phase aerial mechanic (Cases 753, 754): the moveDown positions LÃºinor in the low-approach deflection angle that is the precursor to the aerial arc (mirroring the impact_trigger phase â€” LÃºinor is at the lower orbital arc, the angle from which the Jolt tip's impact-reactive geometry generates upward velocity), the moveUp executes the aerial arc phase (LÃºinor climbs from the lower orbital arc to the upper arc, tracing the parabolic path of the squall aerial at combo scale â€” v_z is generated by the Jolt tip's passive threshold crossing during the orbital speed of the moveDown transition, which at orbital vâ‰ˆ0.5 m/s generates a brief tilt-increase and upward drift), and the attack fires at the apex of the upward arc â€” the highest-velocity moment of the arc's crest â€” where LÃºinor's Brutal blade contacts the opponent from above in the characteristic downward-dive contact geometry; at combo scale there is no wall-flip (that is BeySpirit territory), but the apex-contact mimics the dive's directional geometry: the attack arrives from above, giving the contact force a downward component that still elevates burst probability marginally at combo scale; spinDelta = âˆ’49 (Brutal layer blade contact at apex approach angle, near ceiling â€” the downward approach concentrates contact force at the blade face rather than spreading it tangentially, pushing to near-maximum single-contact spinDelta), damageMultiplier = 1.40Ã—.

```
Squall Dive â€” geometry:

Phase 1 (â†“): low-orbital deflection angle â€” LÃºinor at lower arc,
  Jolt tip passive threshold neared as orbital v approaches lower-orbit max
  beyTiltAngle: brief increase (below full aerial â€” combo-scale passive Jolt physics)

Phase 2 (â†‘): arc climb â€” LÃºinor moves upward in orbital arc,
  mimicking the Brutal Squall aerial trajectory at combo scale
  Apex approach: LÃºinor arrives at upper arc with downward-facing contact angle

Phase 3 (J): Brutal blade contact at arc apex from above
  Downward contact geometry: force has slight downward component
  Ï†_brutal = 22Â°;  J_smash = cos(22Â°) Ã— J = 0.927 Ã— J
  spinDelta_contact = âˆ’49 rad/s  (concentrated blade contact, near ceiling)
  damageMultiplier = 1.40Ã—
  lockMs = 70  (Brutal blade engagement at dive apex â€” slightly longer than flat-contact)

ceiling compliance:
  1.40Ã— â‰¤ 1.5Ã—;  70 ms â‰¤ 300 ms;  49 â‰¤ 50 rad/s;  no invulnerability, no AoE  [check]

Design note: no burstChanceBonus at combo scale â€” burst torque amplification is
  special-move-only (BeySpirit diving geometry not achieved at combo orbital v).
  Squall Dive self-cost: nil  (passive Jolt arc on existing orbital, no aerial depletion).
  Distinct from Flower Smash (â†‘â†“J, Case 744): that enters from above and reverses down;
  Squall Dive enters from below and climbs â€” opposite traversal direction.
```

```typescript
// Combo: ["moveDown","moveUp","attack"], cost: 25, type: "attack", part: joltTip
function applySquallDive(luinor: Beyblade, target: Beyblade): void {
  // Brutal LÃºinor blade contact from downward-arc apex approach
  applySpinDelta(target, -49);        // near ceiling â€” concentrated downward contact
  target.damageMultiplier = 1.40;
  target.locked = true; target.lockExpiresAt = Date.now() + 70;
}
```

---



---

## Case 756 â€” [GIMMICK] Dark Bull H145SD: H145 Horn Undercut Track, Rounded Dark Wheel Mass, and Semi-Defense Stable Contact

**Beyblade:** Dark Bull H145SD
**User:** Benkei Hanawa
**Physics Domain:** MFB-era Dark Fusion Wheel mass-body defense, H145 Horn 145 hyper-extended horn contacts, SD Semi-Defense stable approach

**Note:** Dark Fusion Wheel [M] and Bull Clear Wheel [M] are not yet documented in the case library. H145 from Case 57. SD from Case 331. All [M] values carry Â±15% uncertainty.

**Thesis:** Dark Bull H145SD's battle identity is the H145 Horn 145 track's horn-undercut geometry (Case 57): H145's two horn protrusions (Câ‚‚, 180Â° spacing) are distinguished by their hyper-extended radial reach (r_hornâ‰ˆ25mm, significantly beyond a standard flat-track outer edge of â‰ˆ18mm) and by the fact that they engage at the full 14.5mm track height â€” meaning the horn tip contact plane is 14.5mm above the floor, well above a typical Energy Ring contact height of â‰ˆ9â€“11mm for MFB wheel assemblies; the uppercut mechanic follows from this geometry: if Dark Bull approaches an opponent while tilted by Î¸_engageâ‰ˆ13Â° (arcsin((h145âˆ’h_ring_opp)/(r_horn))=arcsin((14.5âˆ’9.0)/25)â‰ˆ13Â°), the forward horn tip dips toward the opponent's Energy Ring contact height, allowing the horn to insert BELOW the ring; a rapid tilt-restore (return to upright) then sweeps the horn upward through the Energy Ring plane, delivering an upward leverage force to the opponent's ring â€” this is the "real bull locking horns" mechanic described for Bull Uppercut (Case 757); the Dark Fusion Wheel [M] provides a smooth-contoured heavy defense body (m_darkâ‰ˆ0.028kg [M]) that supplies the rotational inertia for the horn-lock momentum sweep and absorbs recoil during the engagement; the SD bottom (Case 331) provides semi-defense stable contact that maintains the approach angle during tilt-under entry, resisting deflection from minor contacts while Dark Bull positions for the horn engagement.

```
Bull Clear Wheel [M]:
  Bull horn motif, translucent  (cosmetic, minimal physics contribution)
  Sits atop Dark Fusion Wheel; no significant independent contact geometry

Dark Fusion Wheel [M]:
  Smooth-contoured rounded body  [M]
  m_dark â‰ˆ 0.028 kg  (heavy fusion wheel for defense mass)
  Câ‚ contact geometry (near-smooth) â€” minimal attack, high absorption
  r_outer â‰ˆ 22 mm
  Purpose: rotational inertia for horn-lock sweep momentum

H145 Track [Case 57]:
  h = 14.5 mm  (one of the tallest MFB tracks)
  Câ‚‚ horn protrusions (2 horns, 180Â° spacing)
  r_horn â‰ˆ 25 mm  (hyper-extended radial reach)
  Horn-undercut geometry:
    Î¸_engage â‰ˆ arcsin((14.5 âˆ’ 9.0) / 25) = arcsin(0.22) â‰ˆ 13Â°
    At tilt Î¸ â‰¥ 13Â°: forward horn dips to opponent Energy Ring height
    â†’ horn inserts below opponent ring â†’ horn-lock position achieved
    Rapid tilt-restore: horn sweeps upward â†’ upward leverage force on opponent ring
  See Case 57 for full derivation of contact-point-radius geometry

SD Bottom [Case 331]:
  Semi-Defense: flat-semi-spherical hybrid
  Provides stable orbit + approach angle resistance
  Resists minor deflections during tilt-under positioning
  See Case 331 for full derivation

Assembly [MFB era]:
  m = 0.048 kg,  I = 1.05Ã—10â»âµ kgÂ·mÂ²,  Ï‰â‚€ = 600 rad/s,  W = 0.471 N
```

```typescript
interface DarkBullAssembly {
  m_kg: number;               // 0.048
  I_kgm2: number;             // 1.05e-5
  omega0_rads: number;        // 600
  // H145 track [Case 57]
  h145_m: number;             // 0.0145
  r_horn_m: number;           // 0.025
  h_ringOpponent_m: number;   // 0.009  (typical MFB Energy Ring contact height)
  theta_engage_deg: number;   // 13  â€” arcsin((14.5-9.0)/25)
  // Dark Fusion Wheel [M]
  m_dark_kg: number;          // 0.028
  r_outer_m: number;          // 0.022
}
function h145HornEngaged(asm: DarkBullAssembly, beyTiltAngle: number): boolean {
  return beyTiltAngle >= asm.theta_engage_deg;
}
```

---

## Case 757 â€” [SPECIAL MOVE] Bull Uppercut: Benkei Hanawa / Dark Bull H145SD (Metal Fight Beyblade)

**Franchise Move:** Bull tilts downwards underneath the opponent's energy ring, and then quickly tilts upwards to uppercut the opponent into the air with the horns on its spin track. This causes the opponent to lose control and crash. Benkei describes it as being "like a real bull locking horns." Bull Uppercut is the first special move used by Benkei Hanawa with Dark Bull H145SD. [Metal Fight Beyblade]

**Thesis:** Bull Uppercut is the BeySpirit transcendence of the H145 horn-undercut geometry (Case 756): at passive physics the H145 horns produce an upper-attack tendency (contacts at h=14.5mm engage from below at moderate tilt), but the engagement requires precise tilt alignment and is easily evaded; under Benkei's Bull BeySpirit the tilt maneuver becomes precise and rapid â€” Phase 1 drives Dark Bull to Î¸_engage=13Â° with targeted precision (the spirit navigates the approach so the horn arrives at exactly the opponent's Energy Ring height), Phase 2 is the "lock horns" moment (horn tip contacts under the ring, force state locks both beyblades into momentary mutual engagement â€” neither can freely move laterally, all relative motion is vertical), and Phase 3 is the uppercut snap (Dark Bull rapidly restores tilt from 13Â° to 0Â°, the horn sweeps upward through the ring plane, delivering F_upper via lever geometry: Ï„_upper=F_hornÃ—r_horn=F_hornÃ—0.025m, converted to an upward impulse on the opponent and a large beyTiltAngle increase; the opponent is "tossed into the air" â€” beyTiltAngle_opponent += 20Â°, and if combined tilt exceeds the stability threshold, the "crash" follows immediately); the critical mechanical point is that Bull Uppercut is NOT primarily a spin-delta attack â€” it is a tilt-induction attack, and the spin disruption (âˆ’280) is secondary to the wobble crash caused by the 20Â° forced tilt; this distinction mirrors the real bull-horn mechanic: the goal is to destabilise the opponent's balance, not to spin-drain them.

```
Bull Uppercut â€” phase structure:

Phase 1 â€” "tilt_under" (300 ms):
  BeySpirit drives Dark Bull tilt to Î¸_engage = 13Â°
  Approach arc: Dark Bull spirals toward opponent at SD bottom orbital
  Horn forward position aligns with opponent Energy Ring height
  forceState on self: "horn_approach"  (300 ms)
  Visual: dark bull spirit aura, horns glow amber, ground trembles

Phase 2 â€” "horn_lock" (50 ms contact):
  H145 forward horn inserts below opponent Energy Ring  (Î¸ â‰¥ 13Â°)
  forceState on both beyblades: "horn_locked"  (50 ms)
    â†’ neither can apply lateral impulse; only vertical force exchange during lock
  Visual: horn tips glow, energy flash at lock contact point

Phase 3 â€” "uppercut" (rapid tilt-restore 0â†’13Â° reversed):
  Dark Bull snaps from 13Â° tilt back to 0Â°, horn sweeps upward through ring plane
  Lever force:  F_upper = I Ã— Î±_restore / r_horn  [BeySpirit amplified]
  spinDelta_opponent     = âˆ’280 rad/s  (horn-contact spin disruption)
  linearImpulse_opponent = 3 500 eu  (upward/forward â€” "tossed into air")
  damageMultiplier        = 1.8Ã—
  Tilt induction (lever-arm forced-toss):
    beyTiltAngle_opponent += 20Â°  (1 500 ms duration)
    if opponent spin/maxSpin < 0.50 OR (existing tilt + 20Â°) > 45Â°: crash wobble triggers

  QTE â€” "Counter Lock":
    Window: 250 ms from horn_lock contact;  Input: jump (C)
    Success: break horn-lock early â€” 40% spinDelta + impulse, no tilt induction
    Fail: full uppercut + 20Â° tilt

Self-cost: âˆ’120 spinDelta  (tilt-under approach destabilises SD contact briefly)
powerCost: 100;  cooldownMs: 4 500
NOTE: any beyblade can use Bull Uppercut; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateBullUppercut(darkBull: Beyblade, target: Beyblade): void {
  darkBull.forceState = "horn_approach";
  darkBull.forceStateExpiresAt = Date.now() + 300;

  setTimeout(() => {
    // Horn lock phase
    darkBull.forceState = "horn_locked";
    target.forceState   = "horn_locked";
    const lockEnd = Date.now() + 50;
    darkBull.forceStateExpiresAt = lockEnd;
    target.forceStateExpiresAt   = lockEnd;

    setTimeout(() => {
      darkBull.forceState = null;
      if (!target.counterLockSuccess) {
        applySpinDelta(target, -280);
        applyLinearImpulse(target, darkBull.facingAngle, 3500);
        target.damageMultiplier = 1.8;
        // Tilt induction: H145 horn lever-arm uppercut
        target.beyTiltAngle = Math.min(target.beyTiltAngle + 20, 45);
        target.tiltInductionExpiresAt = Date.now() + 1500;
        if (target.spin / target.maxSpin < 0.50) {
          target.forcedWobble = true;
        }
      } else {
        applySpinDelta(target, -112);
        applyLinearImpulse(target, darkBull.facingAngle, 1400);
      }
      applySpinDelta(darkBull, -120);
    }, 50);
  }, 300);
}
```

---

## Case 758 â€” [COMBO] Bull Undercut: H145 Horn-Lock Uppercut Arc (3-key: moveDown attack moveUp)

**Combo ID:** `bull-undercut`
**Sequence:** moveDown â†’ attack â†’ moveUp  (â†“Jâ†‘)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** h145Track  (H145 Horn 145 track with hyper-extended horn contacts)

Bull Undercut is the combo-level expression of the H145 horn-undercut engagement mechanic (Cases 756, 757): the moveDown drives Dark Bull into the tilt-under approach arc (beyTiltAngle briefly increases â€” reaching the passive engagement threshold Î¸â‰ˆ13Â° momentarily at combo orbital speed), the attack fires at the tilt-under contact moment â€” the H145 horn makes brief contact with the opponent's Energy Ring from below (this is the "horn lock" expressed at combo scale: not the full 50ms BeySpirit force-locked phase, but a single-frame contact where the horn is at the ring plane), and the moveUp delivers the upward snap (horn sweeps from under-ring position through the contact plane, delivering the uppercut impulse); at combo scale the tilt induction is passive physics only (no BeySpirit amplification, no beyTiltAngle modification â€” the horn geometry naturally produces an upward-angled contact that tends to tilt the opponent, but the +20Â° toss is special-move territory): spinDelta = âˆ’40 (horn contact below opponent ring â€” the angled approach produces lower normal force transmission than a direct blade smash, but the geometry is distinctive), damageMultiplier = 1.30Ã—; the lockMs = 80 reflects the horn-engagement geometry: the horn contact is slightly longer than a blade tip impact because the horn tip must sweep through the ring plane (a traversal path rather than a point contact), and this traversal arc produces the characteristic "locked horns" feeling even at combo scale.

```
Bull Undercut â€” geometry:

Phase 1 (â†“): tilt-under approach arc
  beyTiltAngle briefly reaches Î¸_engage â‰ˆ 13Â° at lower orbital position
  H145 forward horn dips toward opponent Energy Ring height

Phase 2 (J): horn contact below ring plane (tilt-under moment)
  H145 horn tip engages opponent ring from below  (passive physics contact)
  Contact angle: below-ring upward sweep geometry
  spinDelta_contact = âˆ’40 rad/s  (below-ring horn contact â€” angled, below ceiling)
  damageMultiplier = 1.30Ã—
  lockMs = 80  (horn traversal arc: longer than blade-tip point contact)

Phase 3 (â†‘): tilt-restore uppercut sweep
  Dark Bull snaps upright (13Â° â†’ 0Â°) â€” horn completes upward sweep through ring plane
  Upward momentum tendency: contact force has upward component
  No beyTiltAngle modification (passive geometry tendency only â€” not BeySpirit amplified)

ceiling compliance:
  1.30Ã— â‰¤ 1.5Ã—;  80 ms â‰¤ 300 ms;  40 â‰¤ 50 rad/s;  no invulnerability, no AoE  [check]

Design note: the H145 horn tilt-induction tendency is passive physics at combo scale â€”
  no beyTiltAngle_opponent modification applied (the +20Â° toss is special-move territory).
  The 80 ms lockMs is geometrically justified by the horn sweep arc traversal (not a proxy
  for a prolonged lock â€” the traversal arc physically takes longer than a point contact).
  Combo self-cost: nil (passive tilt-approach via SD orbital, no BeySpirit tilt-drive cost).
```

```typescript
// Combo: ["moveDown","attack","moveUp"], cost: 25, type: "attack", part: h145Track
function applyBullUndercut(darkBull: Beyblade, target: Beyblade): void {
  // H145 horn contact from below ring plane, upward sweep geometry
  applySpinDelta(target, -40);        // below-ring contact â€” angled, ceiling-compliant
  target.damageMultiplier = 1.30;
  target.locked = true; target.lockExpiresAt = Date.now() + 80;
}
```

---

## Case 759 — [GIMMICK] Burn Fireblaze 135MS: Metal Sharp Stamina Tip, Burn Stamina Wheel, and Standard-Height 135 Track

**Beyblade:** Burn Fireblaze 135MS
**User:** Phoenix
**Physics Domain:** MFB-era Burn Metal Wheel smooth stamina contacts, 135 standard-height track, MS Metal Sharp near-point metal tip

**Note:** Burn Metal Wheel from Case 265. Fireblaze Clear Wheel [M] and 135 Track [M] are not yet documented in the case library. MS Bottom from Case 338. All [M] values carry ±15% uncertainty.

**Thesis:** Burn Fireblaze 135MS's battle identity is the Metal Sharp (MS) tip's (Case 338) near-point metal contact geometry: with r_eff≈0.5mm (sharp metal point, smallest effective contact radius of any MFB tip) and μ_MS≈0.10 (metal-on-plastic friction coefficient, far below plastic tips' μ≈0.25–0.45), the MS tip produces an extremely low lateral force (F_lat=0.10×0.050×9.81=0.049N) and an exceptionally slow spin decay (dω/dt=−(0.10×0.050×9.81×0.0005)/1.0×10⁻⁵=−2.45 rad/s²), giving a theoretical spin life of ≈245s — the longest free-spin life of any non-bearing plastic tip; the trade-off is that the MS tip's near-point contact produces extreme positional instability at low spin (ω < 200 rad/s): the small contact radius provides insufficient lateral friction to resist nutation, so Burn Fireblaze spends most of its spin life gliding at high efficiency and then enters sudden wobble-collapse; the Burn Metal Wheel (Case 265) provides smooth-contoured symmetric contacts (φ_burn≈8°, J=cos(8°)×J=0.990×J) designed for spin retention rather than attack — the near-tangential contact geometry minimises spin transfer losses on each engagement; the 135 track [M] is a standard MFB height track (h=13.5mm, no gimmick) that sits between H145 and 145, placing Burn Fireblaze's contact plane at mid-height; the MS tip's "extreme friction" under BeySpirit (Burning Fire Strike, Case 760) inverts this low-friction identity by driving the point into the stadium surface under Phoenix spirit pressure, converting the tip from near-frictionless to a scorching contact point.

```
Fireblaze Clear Wheel [M]:
  Cosmetic / minimal contact contribution  [M]

Burn Metal Wheel [Case 265]:
  Smooth-contoured symmetric profile  (stamina archetype)
  φ_burn ≈ 8°  (near-tangential contacts — minimal spin transfer)
  J_contact = cos(8°) × J = 0.990 × J
  r_outer ≈ 22 mm  (wide, smooth rim)

135 Track [M]:
  h = 13.5 mm  (standard MFB mid-height, no gimmick)
  r_track ≈ 16 mm  (standard MFB track body)

MS Bottom [Case 338]:
  r_eff ≈ 0.5 mm  (sharp metal point, smallest effective radius)
  μ_MS ≈ 0.10  (metal-on-plastic; lowest plastic-tip friction class)
  F_lat = 0.10 × 0.050 × 9.81 = 0.049 N
  dω/dt = −(0.10 × 0.050 × 9.81 × 0.0005) / 1.0×10⁻⁵ = −2.45 rad/s²
  Spin life (free): 600 / 2.45 ≈ 245 s  (longest non-bearing plastic tip life)
  Low-spin instability: beyTiltAngle rises rapidly for ω < 200 rad/s (nutation onset)

Assembly [MFB era]:
  m = 0.050 kg,  I = 1.0×10⁻⁵ kg·m²,  ω₀ = 600 rad/s,  W = 0.491 N
```

```typescript
interface BurnFireblazeAssembly {
  m_kg: number;               // 0.050
  I_kgm2: number;             // 1.0e-5
  omega0_rads: number;        // 600
  // Burn wheel [Case 265]
  phi_burn_deg: number;       // 8
  r_outer_m: number;          // 0.022
  // 135 track [M]
  h135_m: number;             // 0.0135
  // MS tip [Case 338]
  rEff_MS_m: number;          // 5.0e-4
  mu_MS: number;              // 0.10
  spinDecay_rads2: number;    // 2.45
  spinLife_s: number;         // 245
  wobbleOnset_rads: number;   // 200  (nutation below this spin)
}
```

---

## Case 760 — [SPECIAL MOVE] Burning Fire Strike: Phoenix / Burn Fireblaze 135MS (Metal Fight Beyblade)

**Franchise Move:** Fireblaze either flies into the sky or starts creating extreme friction. Then, it starts to shoot out flames and rushes towards the opponent. To end things, the beast of the Phoenix erupts and charges full throttle while Burn Fireblaze crashes into the opponent in a powerful inferno of fire. Burning Fire Strike (Burning Explosion) is the only special move used by Phoenix with Burn Fireblaze 135MS. [Metal Fight Beyblade]

**Thesis:** Burning Fire Strike is the BeySpirit transcendence of the MS tip's two extreme regimes (Case 759): the two-path activation ("flies into sky" / "extreme friction") reflects the MS tip's dual nature — at passive physics the MS tip is near-frictionless; under Phoenix's BeySpirit the tip is driven into the floor under extreme spiritual pressure, converting the point contact into a scorching high-friction spot (the "extreme friction" path: μ_active≈2.5× passive, thermal energy builds, fire erupts from contact point); alternatively the BeySpirit launches Fireblaze on a high-arc orbital to v_orb_aerial=3.5 m/s (the "flies into sky" path: beyTiltAngle→70°, the aerial arc generates the fire through air friction at high ω); both paths converge at Phase 2 — the Phoenix spirit (an immortal bird of fire) erupts fully, the fire columns from the MS point-contact or aerial arc merge into a single inferno, and Phase 3 is the full-throttle "inferno rush crash" — a direct charge at the opponent with the Phoenix spirit enveloping Fireblaze; the Burn wheel's smooth contacts (φ_burn=8°, J=0.990×J) ensure that the crash transfers nearly all kinetic energy to the target rather than deflecting; Burning Fire Strike is the "most honest" special move — it is not a counter, not a multi-phase trick, it is pure accumulated fire energy released in one full-power straight line.

```
Burning Fire Strike — phase structure:

Phase 1A — "extreme_friction" (600 ms):  [activation path 1]
  MS tip BeySpirit pressure: μ_active = 0.25 (2.5× passive)
  Thermal fire builds at contact point
  ω_boost = +40 rad/s  (friction converts to spin under Phoenix spirit)

Phase 1B — "aerial_arc" (700 ms):  [activation path 2]
  beyTiltAngle → 70°;  v_orb_aerial = 3.5 m/s
  Air friction at high ω generates fire aura during arc
  (Only one Phase 1 occurs per activation — Phoenix chooses instinctively)

Phase 2 — "phoenix_eruption" (400 ms):
  Phoenix spirit erupts fully (orange/gold/white inferno phoenix form)
  forceState on target: cannot_attack_freely  (400 ms)
  Visual: fire columns, Burn wheel glows, arena lights up

Phase 3 — "inferno_rush" (direct frontal charge):
  Burn wheel smooth contact at full charge velocity:
  spinDelta       = −480 rad/s
  linearImpulse   = 5 800 eu
  damageMultiplier = 2.2×
  Residual fire:  opponent spinDecayRate × 1.4  for 2 000 ms  (phoenix flame lingers)

  QTE — "Flame Break":
    Window: 250 ms from phoenix eruption;  Input: dodge (G)
    Success: 50% spinDelta + impulse, no residual fire
    Fail: full inferno crash

Self-cost: −200 spinDelta
powerCost: 100;  cooldownMs: 4 500
NOTE: any beyblade can use Burning Fire Strike; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateBurningFireStrike(fireblaze: Beyblade, target: Beyblade): void {
  target.forceState = "cannot_attack_freely";
  target.forceStateExpiresAt = Date.now() + 400;
  setTimeout(() => {
    if (!target.flameBreakSuccess) {
      applySpinDelta(target, -480);
      applyLinearImpulse(target, fireblaze.facingAngle, 5800);
      target.damageMultiplier = 2.2;
      target.spinDecayMultiplier = (target.spinDecayMultiplier ?? 1.0) * 1.4;
      setTimeout(() => { target.spinDecayMultiplier /= 1.4; }, 2000);
    } else {
      applySpinDelta(target, -240);
      applyLinearImpulse(target, fireblaze.facingAngle, 2900);
    }
    applySpinDelta(fireblaze, -200);
  }, 400);
}
```

---

## Case 761 — [COMBO] Ember Approach: Burn Wheel Low-Orbit Stamina Contact (3-key: moveDown moveRight attack)

**Combo ID:** `ember-approach`
**Sequence:** moveDown → moveRight → attack  (↓→J)
**Cost:** 25 power
**Type Restriction:** stamina
**Part Requirement:** burnWheel  (Burn Metal Wheel, Case 265)

Ember Approach is the combo-level expression of Burn Fireblaze's stamina-archetype contact pattern (Cases 759, 760): the moveDown enters the lower orbital arc (Burn Fireblaze's MS tip-driven orbital naturally favours low-energy circular motion near the arena floor), the moveRight drifts rightward along the lower arc (the low friction of the MS tip means directional changes are governed by slight orbital asymmetry — the rightward drift is the Burn wheel's dominant contact angle's natural exit vector), and the attack fires at the arc-right contact moment where the Burn wheel's tangential approach produces the smooth energy-transfer contact; the Burn wheel's φ_burn=8° ensures the contact is nearly tangential at this approach angle — more of a "long scrape" than a "smash" — which is why this combo is typed for stamina (the force transfers gradually, preserving Fireblaze's own spin while draining the opponent's); spinDelta = −42 (smooth near-tangential contact, constrained by the Burn wheel's geometry; close to but below ceiling because the approach arc adds velocity), damageMultiplier = 1.25×.

```
Ember Approach — geometry:
Phase 1 (↓): lower orbital arc — MS tip low-energy orbit
Phase 2 (→): rightward drift along lower arc (natural Burn wheel exit vector)
Phase 3 (J): Burn wheel near-tangential contact at arc-right apex
  φ_burn = 8°;  J = cos(8°) × J = 0.990 × J
  spinDelta_contact = −42 rad/s;  damageMultiplier = 1.25×;  lockMs = 45

ceiling compliance:  1.25× ≤ 1.5×;  45 ms ≤ 300 ms;  42 ≤ 50 rad/s  [check]
Design note: stamina-type spin-drain: Fireblaze retains near-full spin (near-tangential transfer).
```

```typescript
// Combo: ["moveDown","moveRight","attack"], cost: 25, type: "stamina", part: burnWheel
function applyEmberApproach(fireblaze: Beyblade, target: Beyblade): void {
  applySpinDelta(target, -42);
  target.damageMultiplier = 1.25;
  target.locked = true; target.lockExpiresAt = Date.now() + 45;
}
```

---

## Case 762 — [GIMMICK] Flame Serpent SW145F: SW145 Serpentine Orbital Track, Flame Crown-Profile Wheel, and Flat Tip Acceleration

**Beyblade:** Flame Serpent SW145F
**User:** Salhan
**Physics Domain:** MFB-era Flame Metal Wheel crown-profile contacts, SW145 Switch 145 switching orbital geometry, F Flat tip fast orbital

**Note:** Flame Metal Wheel from Case 289. SW145 from Case 255. F Bottom from Case 339. Serpent Clear Wheel [M] not yet documented. All [M] values carry ±15% uncertainty.

**Thesis:** Flame Serpent SW145F's battle identity is the SW145 (Switch 145, Case 255) track's asymmetric-wing switching geometry: the SW145's protruding wing elements have a mode-switch mechanism (the wing tabs can rotate between an extended position, adding asymmetric drag to the orbital, and a retracted position, allowing clean orbital flow); during normal orbit the F tip (Case 339, r_eff≈3.0mm, μ_F=0.30) drives a fast attack-orbital (R_curve_F≈73mm, f_orbit≈1.09 Hz at v=0.5m/s); when the SW145 tabs switch between positions mid-orbit, the drag asymmetry creates a momentary lateral force perpendicular to the orbital direction, bending the orbital path into an S-curve — this is the physical basis of the "slithering" motion in Burning Mirage (Case 763); the Flame Metal Wheel (Case 289) provides a crown-profile where the track profile is slightly exposed beyond the wheel rim, meaning the SW145 wing tabs can partially engage opponents without the full wheel body blocking — the crown cuts create directional contacts (φ_flame≈18°, J=cos(18°)×J=0.951×J) at medium attack angle; the combination is an attack bey that uses the F tip's orbital aggression with SW145's unpredictable path deflection to create an angular approach pattern the opponent cannot precisely anticipate.

```
Serpent Clear Wheel [M]:
  Serpent/cobra motif  (cosmetic, minimal physics contribution)

Flame Metal Wheel [Case 289]:
  Crown-profile with track partial exposure
  φ_flame ≈ 18°  (medium attack contacts)
  J_contact = cos(18°) × J = 0.951 × J
  r_outer ≈ 22 mm

SW145 Track [Case 255]:
  h = 14.5 mm  (wing-extended height)
  Switch mechanism: wing tabs toggle between extended (drag-on) and retracted (drag-off)
  Asymmetric drag in extended position: F_drag_asym ≈ 0.05 N lateral deflection per toggle
  Orbital S-curve: each tab switch bends orbit by Δθ_path ≈ 8–12° from nominal arc
  Passive: natural tab vibration creates mild orbital deviation at v > 0.3 m/s

F Bottom [Case 339]:
  r_eff = 3.0 mm,  μ_F = 0.30
  F_lat = 0.30 × 0.050 × 9.81 = 0.147 N
  dω/dt = −(0.30 × 0.050 × 9.81 × 0.003) / 1.0×10⁻⁵ = −44.1 rad/s²
  Spin life: 600 / 44.1 ≈ 13.6 s  (aggressive, must attack early)
  R_curve_F ≈ 73 mm  (from Case 339)

Assembly [MFB era]:
  m = 0.050 kg,  I = 1.0×10⁻⁵ kg·m²,  ω₀ = 600 rad/s,  W = 0.491 N
```

```typescript
interface FlameSerpentAssembly {
  m_kg: number;           // 0.050
  I_kgm2: number;         // 1.0e-5
  omega0_rads: number;    // 600
  phi_flame_deg: number;  // 18
  r_outer_m: number;      // 0.022
  sw145_h_m: number;      // 0.0145
  F_drag_asym_N: number;  // 0.05
  path_bend_deg: number;  // 10 (mean)
  rEff_F_m: number;       // 3.0e-3
  mu_F: number;           // 0.30
  R_curve_m: number;      // 0.073
  spinDecay_rads2: number;// 44.1
}
```

---

## Case 763 — [SPECIAL MOVE] Burning Mirage: Salhan / Flame Serpent SW145F (Metal Fight Beyblade)

**Franchise Move:** Serpent takes form while slithering around the stage leaving a trail of flames building momentum then it slams into the opponent at full force. Burning Mirage is the only special move used by Salhan with Flame Serpent SW145F. [Metal Fight Beyblade]

**Thesis:** Burning Mirage is the BeySpirit transcendence of the SW145 serpentine orbital mechanics (Case 762): at passive physics the SW145 tab switches create an 8–12° path deviation per toggle; under Salhan's Serpent BeySpirit the tab-switch frequency is amplified to maximum — every half-orbit the tabs flip, creating a tight S-curve that traces the stadium in a continuous serpentine path (the "slithering around the stage"); the Serpent spirit manifests as a cobra coil around the bey, and the fire trail is the F tip's orbital friction generating heat at the increased lateral force of the BeySpirit-amplified orbit; the critical physics is the momentum build-up: each S-curve bend is equivalent to a partial redirection, and the SW145 BeySpirit converts each bend's centripetal force into additional orbital kinetic energy (rather than dissipating it as lateral deflection) — over 3 orbital laps this drives v_orb from 0.5 m/s to 3.5 m/s accumulation; the final slam arrives from an approach vector that is the last S-curve's exit angle — the opponent has been watching a serpentine path and cannot predict which direction the slam will exit from; the Flame wheel's crown-profile contact (φ_flame=18°) delivers the accumulated orbital energy as a direct blow.

```
Burning Mirage — phase structure:

Phase 1 — "serpent_orbit" (1 200 ms, ~3 laps):
  SW145 tab-switch every half-orbit under BeySpirit amplification
  Orbital S-curve: Δθ_path = 12° per tab-flip
  v_orb builds: 0.5 → 1.8 → 2.8 → 3.5 m/s  (accumulated over 3 laps)
  E_orb = ½ × 0.050 × 3.5² = 0.306 J
  Serpent spirit aura (cobra coil, fire trail) builds with each lap
  forceState on target: cannot_predict_approach  (1 200 ms)

Phase 2 — "serpent_slam" (exit from last S-curve apex):
  Flame wheel contact at orbital exit angle (unpredictable approach vector):
  spinDelta       = −350 rad/s
  linearImpulse   = 4 500 eu
  damageMultiplier = 1.9×

  QTE — "Mirage Step":
    Window: 200 ms;  Input: dodge (G)
    Success: 50% spinDelta + impulse
    Fail: full slam

Self-cost: −160 spinDelta  (F tip aggressive orbital drain)
powerCost: 100;  cooldownMs: 4 000
NOTE: any beyblade can use Burning Mirage; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateBurningMirage(serpent: Beyblade, target: Beyblade): void {
  target.forceState = "cannot_predict_approach";
  target.forceStateExpiresAt = Date.now() + 1200;
  setTimeout(() => {
    if (!target.mirageStepSuccess) {
      applySpinDelta(target, -350);
      applyLinearImpulse(target, serpent.facingAngle, 4500);
      target.damageMultiplier = 1.9;
    } else {
      applySpinDelta(target, -175);
      applyLinearImpulse(target, serpent.facingAngle, 2250);
    }
    applySpinDelta(serpent, -160);
  }, 1200);
}
```

---

## Case 764 — [COMBO] Serpent Drift: SW145 S-Curve Orbital Deflect Contact (3-key: moveLeft moveDown attack)

**Combo ID:** `serpent-drift`
**Sequence:** moveLeft → moveDown → attack  (←↓J)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** sw145Track  (SW145 Switch 145 track with switching wing geometry)

Serpent Drift is the combo-level expression of the SW145 tab-deflect path pattern (Cases 762, 763): the moveLeft enters the leftward orbital arc, the moveDown triggers the SW145 tab-switch deflection at the downward arc vertex (the S-curve apex where the path-bend is steepest and the tab-switch lateral force is at maximum — Δθ_path≈10° at v_orb≈0.5 m/s), and the attack fires at the post-deflection contact where the Flame wheel's approach angle has been rotated by the S-curve, arriving from a vector 10° off the nominal orbital direction; the 10° vector deviation is the combo's defining element — at combo scale it is not large enough to constitute a "surprise attack" as in BeySpirit territory, but it IS enough to shift the contact to the Flame wheel's crown-cut face rather than the smooth rim, engaging the φ_flame=18° contact directly; spinDelta = −44 (crown-profile contact at medium angle, S-curve orbital deflection approach), damageMultiplier = 1.35×.

```
Serpent Drift — geometry:
Phase 1 (←): leftward orbital arc entry
Phase 2 (↓): SW145 tab-switch at downward arc vertex — 10° path deflection
Phase 3 (J): Flame crown contact at post-deflection approach angle
  φ_flame = 18°;  J = cos(18°) × J = 0.951 × J
  spinDelta_contact = −44 rad/s;  damageMultiplier = 1.35×;  lockMs = 55

ceiling compliance:  1.35× ≤ 1.5×;  55 ms ≤ 300 ms;  44 ≤ 50 rad/s  [check]
Design note: SW145 passive tab-deflect (10°) shifts contact face without BeySpirit S-curve amplification.
```

```typescript
// Combo: ["moveLeft","moveDown","attack"], cost: 25, type: "attack", part: sw145Track
function applySerpertDrift(serpent: Beyblade, target: Beyblade): void {
  applySpinDelta(target, -44);
  target.damageMultiplier = 1.35;
  target.locked = true; target.lockExpiresAt = Date.now() + 55;
}
```

---

## Case 765 — [GIMMICK] Samurai Ifraid W145CF: W145 ZeroG Wing Track, Ifraid Chrome Wheel Fire Contacts, and Circle Flat Tip Orbital

**Beyblade:** Samurai Ifraid W145CF
**User:** Zyro Kurogane
**Physics Domain:** ZeroG/Synchrome era Ifraid Chrome Wheel fire-blade contacts, Crystal Wheel Samurai mode-change, W145 Wing 145 upper-contact track, CF Circle Flat orbital tip

**Note:** Ifraid Chrome Wheel [M], W145 [M], and Circle Flat (CF) [M] are not yet documented in the case library. Crystal Wheel Samurai from Case 320g. All [M] values carry ±15% uncertainty.

**Thesis:** Samurai Ifraid W145CF's battle identity is the W145 Wing 145 track's [M] upper-contact wing geometry combined with the Chrome Wheel Ifraid's [M] fire-blade contacts: the W145 (h=14.5mm, C₂ wing protrusions, r_wing≈20mm [M]) provides wing contacts at height 14.5mm that engage from below when the opponent's Energy Ring passes over — the wing engagement geometry (θ_wing_engage≈arcsin((h_W145−h_ring_opp)/r_wing)≈arcsin((14.5−9.0)/20)≈arcsin(0.275)≈16°) is the physical basis for the uppercut mechanic in Burning Uppercut (Case 767); Chrome Wheel Ifraid [M] provides C₄ fire-blade attack contacts (φ_ifraid≈20°, J=cos(20°)×J=0.940×J) at the wheel circumference (r_outer≈22mm [M]); Crystal Wheel Samurai (Case 320g, 5.4g, mode-change) sits above Ifraid and can toggle between standard and orb mode, with orb mode reducing external contact drag for stamina phases; CF Circle Flat (r_eff≈3.0mm, μ_CF≈0.32 [M]) provides a consistent flat-circle contact for stable orbital — less aggressive than F (μ=0.30) but with more uniform contact under the Synchrome weight distribution; the combination of W145 wing uppercut + Ifraid fire-blade produces a bey capable of both direct blade attacks and wing-based tilt-induction, the two mechanics that power Burning Tornado Fire (Case 766) and Burning Uppercut (Case 767).

```
Crystal Wheel Samurai [Case 320g]:
  5.4 g (relatively heavy crystal wheel)
  Mode-change: standard ↔ orb (orb reduces external drag)
  Themed: Samurai / Ifraid (fire motif)

Chrome Wheel Ifraid [M]:
  C₄ fire-blade contacts (4-fold, 90° spacing)  [M]
  φ_ifraid ≈ 20°  (forward-facing attack blades)
  J_contact = cos(20°) × J = 0.940 × J
  r_outer ≈ 22 mm

W145 Track [M]:
  h = 14.5 mm  (Wing 145, ZeroG era)
  C₂ wing protrusions (2 wings, 180° spacing)  [M]
  r_wing ≈ 20 mm
  Wing engage angle: θ_engage ≈ 16°  (arcsin((14.5−9.0)/20))
  Wing tip contacts engage below opponent ring when beyTiltAngle ≥ 16°
  → upward wing sweep delivers upper-contact force (basis for Burning Uppercut)

CF Bottom [M]:
  r_eff ≈ 3.0 mm  (circle flat, uniform circular contact)
  μ_CF ≈ 0.32  [M]
  F_lat = 0.32 × 0.050 × 9.81 = 0.157 N
  dω/dt = −(0.32 × 0.050 × 9.81 × 0.003) / 1.05×10⁻⁵ = −44.9 rad/s²
  Spin life: 600 / 44.9 ≈ 13.4 s

Assembly [ZeroG/Synchrome era]:
  m = 0.050 kg,  I = 1.05×10⁻⁵ kg·m²,  ω₀ = 600 rad/s,  W = 0.491 N
```

```typescript
interface SamuraiIfradAssembly {
  m_kg: number;               // 0.050
  I_kgm2: number;             // 1.05e-5
  omega0_rads: number;        // 600
  phi_ifraid_deg: number;     // 20
  r_outer_m: number;          // 0.022
  W145_h_m: number;           // 0.0145
  r_wing_m: number;           // 0.020
  theta_wing_engage_deg: number; // 16
  rEff_CF_m: number;          // 3.0e-3
  mu_CF: number;              // 0.32
  spinDecay_rads2: number;    // 44.9
}
```

---

## Case 766 — [SPECIAL MOVE] Burning Tornado Fire: Zyro Kurogane / Samurai Ifraid W145CF + Multi-Beast Alliance (ZeroG)

**Franchise Move:** Samurai Ifraid launches itself into the stratosphere and begins to plummet downward. Its velocity drastically increases and the aura turns into a cerulean inferno. Salamander, Leviathan, Orochi, and Phoenix's beasts emerge and merge with Ifraid. Ifraid impales the enemy beast with a fiery sword and crashes into the earth below, resulting in a massive explosion of flames and scarlet light. Any allied bey can activate the summon. Burning Tornado Fire is the first ultimate special move used by Zyro Kurogane with Samurai Ifraid W145CF, with spirits contributed by Ninja Salamander SW145SD, Guardian Leviathan 160SB, Pirate Orochi 145D, and Thief Phoenic E230GCF. [Beyblade Zero-G]

**Thesis:** Burning Tornado Fire is the most powerful special move in the CS13 case library: it is not a single-bey BeySpirit attack but a five-spirit fusion ultimate — Samurai Ifraid's stratospheric launch gives maximum altitude h_strat≈1.0m (in 2.5D terms: beyTiltAngle→90°, maximum ClimbingPhysics height reached by any established special move), then the BeySpirit causes free-fall velocity accumulation (v_dive=sqrt(2×g×h_strat)=sqrt(2×9.81×1.0)≈4.43 m/s before spirit amplification); the multi-beast merger is the amplification stage: each of the 4 ally spirit beasts (Ninja Salamander, Guardian Leviathan, Pirate Orochi, Thief Phoenic) contributes spirit energy — the energy of all 5 beasts (Ifraid + 4 allies) is channelled into the dive velocity amplifier, producing an effective v_dive_amplified=4.43×n_beasts×0.40=4.43×2.0=8.86 m/s for full 5-beast merger — the "fiery sword impale" is the W145 wing tip at 90° tilt contacting the opponent from above, the wing geometry creating a near-vertical "sword" angle that delivers a burst-torque orthogonal to the opponent's spin axis; the resulting explosion is AoE: the release of five beast spirits produces an energy discharge that affects all beyblades in the arena; the "any allied bey can activate the summon" mechanic means the special can be triggered by any of the 5 spirit-aligned beys in a multi-bey battle, with Ifraid automatically becoming the collision vehicle.

```
Burning Tornado Fire — multi-beast scaling:

n_beasts available:
  1 (solo):      spinDelta −380, dmgMult 2.0×, burstBonus +15%, self −200, no AoE
  3–4 (partial): spinDelta −500, dmgMult 2.4×, burstBonus +25%, self −300, AoE splash −100
  5 (full):      spinDelta −700, dmgMult 3.0×, burstBonus +50%, self −450, AoE splash −200

Full 5-beast phase structure:

Phase 1 — "stratosphere" (1 000 ms):
  beyTiltAngle → 90°  (ClimbingPhysics maximum)
  Red orb with red X forms;  Zyro glows scarlet aura
  All 4 ally spirits begin gathering to Ifraid

Phase 2 — "beast_merger" (800 ms):
  4 beast orbs (Salamander=amber, Leviathan=blue, Orochi=purple, Phoenic=gold) merge
  Cerulean inferno aura replaces scarlet (all 5 spirits combined)
  v_dive builds to maximum

Phase 3 — "fiery_sword_crash" (W145 wing-tip impale + explosion):
  spinDelta_target   = −700 rad/s  (5-beast dive)
  linearImpulse      = 9 000 eu
  damageMultiplier   = 3.0×
  burstChanceBonus   = +50%  (vertical wing-tip impale = max burst torque geometry)
  AoE explosion: all other beys → spinDelta −200, impulse 3 000 eu

  QTE — "Final Guard":
    Window: 300 ms from descent;  Input: defense (K)
    Success: 50% spinDelta + impulse, burst bonus halved, no AoE
    Fail: full 5-beast crash

Self-cost: −450 spinDelta  (all 5 beast energies consumed)
Ally cost: each contributing ally bey −150 spinDelta  (they donate spirit energy)
powerCost: 100;  cooldownMs: 10 000  (ultimate cooldown — longest in CS13)
NOTE: Multi-beast activation — any of the 5 spirit-aligned beys (Samurai Ifraid, Ninja Salamander,
  Guardian Leviathan, Pirate Orochi, Thief Phoenic) can trigger this move as the activating bey;
  Samurai Ifraid is always the physical collision vehicle regardless of who activates.
  If non-Ifraid bey activates: Ifraid executes the dive, activating bey contributes its spirit cost.
NOTE: any beyblade can use Burning Tornado Fire; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateBurningTornadoFire(
  ifraid: Beyblade, target: Beyblade, allyBeasts: Beyblade[], allTargets: Beyblade[]
): void {
  const nBeasts = 1 + allyBeasts.filter(b => b.spiritType !== undefined).length;
  const spinDelta  = nBeasts >= 5 ? -700 : nBeasts >= 3 ? -500 : -380;
  const dmgMult    = nBeasts >= 5 ? 3.0  : nBeasts >= 3 ? 2.4  : 2.0;
  const burstBonus = nBeasts >= 5 ? 0.50 : nBeasts >= 3 ? 0.25 : 0.15;
  const selfCost   = nBeasts >= 5 ? -450 : nBeasts >= 3 ? -300 : -200;

  setTimeout(() => {
    if (!target.finalGuardSuccess) {
      applySpinDelta(target, spinDelta);
      applyLinearImpulse(target, ifraid.facingAngle, nBeasts >= 5 ? 9000 : 6000);
      target.damageMultiplier = dmgMult;
      target.burstChanceBonus = (target.burstChanceBonus ?? 0) + burstBonus;
      if (nBeasts >= 3) {
        allTargets.filter(b => b !== ifraid).forEach(b => {
          applySpinDelta(b, nBeasts >= 5 ? -200 : -100);
          applyLinearImpulse(b, Math.random() * 2 * Math.PI, nBeasts >= 5 ? 3000 : 1500);
        });
      }
    } else {
      applySpinDelta(target, spinDelta * 0.5);
    }
    applySpinDelta(ifraid, selfCost);
    allyBeasts.forEach(b => applySpinDelta(b, -150));
  }, 1800);
}
```

---

## Case 767 — [SPECIAL MOVE] Burning Uppercut: Zyro Kurogane / Samurai Ifraid W145CF (Beyblade Zero-G)

**Franchise Move:** Ifraid starts to move circle the stadium at a rapid speed, producing a cyclone which drags the opposing Beyblade in. Zyro begins to glow with a fiery aura, uppercutting with his fist. Ifraid then bursts into flames, crashing into the opponents Beyblade at full force and uppercutting it. Burning Uppercut is the second special move used by Zyro Kurogane with Samurai Ifraid W145CF. [Beyblade Zero-G]

**Thesis:** Burning Uppercut is the stadium-orbital cyclone expression of Samurai Ifraid's W145 wing-uppercut system (Case 765): where Burning Tornado Fire (Case 766) achieves maximum power through stratospheric multi-beast fusion, Burning Uppercut achieves it through speed and inward pull — Ifraid circuits the stadium perimeter at v_orb=3.5m/s (CF tip fast orbital, CF BeySpirit-amplified: R_orbit≈120mm edge), the rapid circular motion produces a centrifugal wind vortex (F_cyclone=m×v²/R=0.050×12.25/0.120=5.10N at orbital, directed inward) that acts as an inward pull on the opponent, drawing them toward the centre to meet Ifraid's approach; when the opponent reaches the pull radius, the W145 wing tips (Case 765, r_wing=20mm, θ_engage=16°) engage from below the opponent's Energy Ring as Ifraid tilts to θ=16° during the cyclone orbital approach — the rapid tilt-restore sweeps the wings upward through the ring plane (the "uppercut") delivering F_upper via lever geometry; the "bursts into flames + full force crash" combines the accumulated orbital kinetic energy (E_orb=0.050×12.25/2=0.306J) with the W145 wing impact → a two-component strike (orbital slam + wing sweep) that is less powerful than the 5-beast Burning Tornado Fire (−700) but faster to execute and self-sufficient (no ally spirit requirement).

```
Burning Uppercut — phase structure:

Phase 1 — "cyclone_circuit" (800 ms):
  Ifraid circuits at R_orbit ≈ 120 mm, v_orb = 3.5 m/s (CF BeySpirit orbital)
  Centrifugal cyclone: F_cyclone = 0.050 × 3.5² / 0.120 = 5.10 N (directed inward at opponent)
  Pull force on opponent: 0.8 × F_cyclone = 4.08 N toward center
  forceState on opponent: pulled_toward_center  (800 ms, reduces their ring-out drift)
  Visual: Zyro's fiery aura, cyclone dust/fire swirls around arena

Phase 2 — "wing_uppercut" (W145 tilt-engage at 16°):
  As opponent reaches inner orbit: W145 wings engage at θ = 16° tilt
  Tilt-restore: wings sweep upward through opponent's ring plane
  Combined orbital + wing strike:
    spinDelta       = −400 rad/s
    linearImpulse   = 5 000 eu
    damageMultiplier = 2.0×
  Tilt induction (W145 wing lever-arm):
    beyTiltAngle_opponent += 15°  (1 200 ms duration)
    if (opponent spin/maxSpin < 0.55 OR tilt > 40°): wobble trigger

  QTE — "Cyclone Guard":
    Window: 250 ms;  Input: dodge (G)
    Success: 50% spinDelta + impulse, no tilt induction
    Fail: full uppercut + tilt

Self-cost: −180 spinDelta  (cyclone circuit orbital drain on CF tip)
powerCost: 100;  cooldownMs: 4 500
NOTE: any beyblade can use Burning Uppercut; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateBurningUppercut(ifraid: Beyblade, target: Beyblade): void {
  target.forceState = "pulled_toward_center";
  target.forceStateExpiresAt = Date.now() + 800;

  setTimeout(() => {
    if (!target.cycloneGuardSuccess) {
      applySpinDelta(target, -400);
      applyLinearImpulse(target, ifraid.facingAngle, 5000);
      target.damageMultiplier = 2.0;
      target.beyTiltAngle = Math.min(target.beyTiltAngle + 15, 45);
      target.tiltInductionExpiresAt = Date.now() + 1200;
    } else {
      applySpinDelta(target, -200);
      applyLinearImpulse(target, ifraid.facingAngle, 2500);
    }
    applySpinDelta(ifraid, -180);
  }, 800);
}
```

---

## Case 768 — [COMBO] Ifraid Wing Arc: W145 Wing Tilt Upper Contact (3-key: moveUp attack moveDown)

**Combo ID:** `ifraid-wing-arc`
**Sequence:** moveUp → attack → moveDown  (↑J↓)
**Cost:** 25 power
**Type Restriction:** balanced
**Part Requirement:** w145Track  (W145 Wing 145 ZeroG track [M])

Ifraid Wing Arc is the combo-level expression of the W145 wing-engage geometry (Cases 765, 767): the moveUp drives Ifraid into the upper orbital arc where the CF tip's circular contact creates a stable high-side approach, the attack fires at the upper-arc apex where the W145 wings (at h=14.5mm) arrive at the opponent's Energy Ring contact plane — at the upper-arc apex, Ifraid's approach angle is naturally downward-facing relative to the opponent's ring height (entering from above the horizontal), meaning the W145 wing tips contact from above rather than below (the reverse of Bull Undercut's under-hook: Ifraid Wing Arc arrives from the top-of-arc, not the bottom); the moveDown completes the arc continuation (the swing passes through the contact and continues downward — the full upper arc to lower arc traversal), and this traversal arc locks the wing engagement for longer (the wing passes through the ring plane from above-to-below during the arc sweep); spinDelta = −47 (W145 wing contact, C₂ wing at moderate engage angle — both wings can contact in the traversal arc if opponent ring aligns, but typically only one engages for ceiling compliance), damageMultiplier = 1.35×.

```
Ifraid Wing Arc — geometry:
Phase 1 (↑): upper orbital arc — CF flat orbital, high-side approach
Phase 2 (J): W145 wing contact at upper-arc apex (arrival from above)
  h_W145 = 14.5 mm;  r_wing = 20 mm;  from-above approach
  spinDelta_contact = −47 rad/s;  damageMultiplier = 1.35×;  lockMs = 65
Phase 3 (↓): arc continuation downward — wing traverses through ring plane (above→below)

ceiling compliance:  1.35× ≤ 1.5×;  65 ms ≤ 300 ms;  47 ≤ 50 rad/s  [check]
Design note: Distinct from ↑J↑ (wing-slash, Case for UW145): W145 is at h=14.5mm, UW145 is
  different geometry. Distinct from Bull Undercut (↓J↑): that enters from below; this from above.
```

```typescript
// Combo: ["moveUp","attack","moveDown"], cost: 25, type: "balanced", part: w145Track
function applyIfraidWingArc(ifraid: Beyblade, target: Beyblade): void {
  applySpinDelta(target, -47);
  target.damageMultiplier = 1.35;
  target.locked = true; target.lockExpiresAt = Date.now() + 65;
}
```

---

## Case 769 — [GIMMICK] Strata Dragoon V (Gaia Dragoon G): Dragon Saucer Disc AR, Engine Gear Metal Flat, and Final Clutch Base

**Beyblade:** Strata Dragoon V (known as Gaia Dragoon G in the Japanese franchise)
**User:** Daichi Sumeragi
**Physics Domain:** Gen1-Plastic EGS era Dragon Saucer Core/Sub AR circular disc geometry, Right EG Metal Flat engine-gear-boosted orbital, Final Clutch Base GDG

**Note:** Dragon Saucer Core AR from Case 212. Dragon Saucer Sub AR from Case 213. Ten Heavy WD from Case 114a. Right EG Metal Flat from Case 215. Final Clutch Base GDG from Case 216.

**Thesis:** Strata Dragoon V's battle identity is the Dragon Saucer AR's (Cases 212–213) circular disc geometry: unlike virtually all other plastic-gen ARs which have angular blade or claw protrusions, the Dragon Saucer Core AR is a near-circular disc (r_saucer≈21mm) with a free-spinning gear-ring Sub AR (Case 213) that decouples outer ring rotation from the main AR — this creates a smooth-faced circular contact that can engage opponents from any orientation without a "preferred smash angle"; the disc geometry's critical property for Vast Cutter (Case 770) is the tilt mechanic: when beyTiltAngle→85°, the Dragon Saucer's circular edge (r_saucer=21mm) becomes the primary contact surface with the arena floor, and the bey transitions from a spinning top to a rolling disc (v_roll=ω×r_saucer×cos(beyTiltAngle)=500×0.021×cos(5°)≈10.5 m/s linear rolling speed); the Right EG Metal Flat (Case 215) provides the high-speed flat-metal orbital that drives both Vast Cutter's rolling approach and Vast Hurricane's (Case 771) circular vortex generation; the Final Clutch Base GDG (Case 216) EG spring fires at the Final Clutch trigger moment under the base, providing a one-time orbital speed burst.

```
Dragon Saucer Core AR [Case 212]:
  Near-circular disc profile  (r_saucer ≈ 21 mm)
  Free-spinning outer gear ring (Sub AR, Case 213) decouples rotation
  Contact from any angle (no preferred smash face)
  Tilt mode: at beyTiltAngle ≥ 80° → disc edge becomes floor contact surface
    v_roll = ω × r_saucer × cos(beyTiltAngle)
    At ω=500, r=0.021, θ=85°: v_roll = 500×0.021×cos(5°) ≈ 10.5 m/s

Right EG Metal Flat [Case 215]:
  Engine Gear flat metal tip — high-speed orbital
  μ_EG_MF ≈ 0.12 (metal flat, low friction but wider than MS)
  Orbital-mode: fast circular orbit, similar to SG Metal Flat Base GDV (Case 122)
  EG trigger: one-time spring burst → sudden additional orbital speed

Final Clutch Base GDG [Case 216]:
  EG spring releases at predetermined tilt → orbital boost
  Anime physics override applies to special moves (spring re-engages under BeySpirit)

Ten Heavy WD [Case 114a]:
  Heavy weight disk, concentrated outer mass → high inertia

Assembly [Gen1-Plastic, EGS, V-Force]:
  m = 0.044 kg,  I = 9.0×10⁻⁶ kg·m²,  ω₀ = 500 rad/s,  W = 0.432 N
```

```typescript
interface StrataDragoonAssembly {
  m_kg: number;               // 0.044
  I_kgm2: number;             // 9.0e-6
  omega0_rads: number;        // 500
  r_saucer_m: number;         // 0.021
  v_roll_calc: (omega: number, tiltDeg: number) => number;
  EG_triggered: boolean;      // false initially
}
const asm: StrataDragoonAssembly = {
  m_kg: 0.044, I_kgm2: 9e-6, omega0_rads: 500, r_saucer_m: 0.021,
  v_roll_calc: (w, t) => w * 0.021 * Math.cos(t * Math.PI / 180),
  EG_triggered: false
};
```

---

## Case 770 — [SPECIAL MOVE] Vast Cutter: Daichi Sumeragi / Strata Dragoon V (Beyblade V-Force)

**Franchise Move:** Strata Dragoon rolls on its side on an enlarged, energy circular blade. When the move activates, the Bit Beast Strata Dragoon manifests briefly before transforming into a giant saw blade around the Beyblade's Saucer Ring. When it strikes, the move can easily cleave solid constructs. Vast Cutter is the first special move used by Daichi Sumeragi with Strata Dragoon V. [Beyblade V-Force]

**Thesis:** Vast Cutter is the BeySpirit transcendence of the Dragon Saucer AR's disc-rolling mode (Case 769): at passive physics, extreme tilt (beyTiltAngle>80°) converts Strata Dragoon into a rolling disc at v_roll≈10.5 m/s — the physical maximum for this assembly at full spin; under Daichi's Strata Dragoon BeySpirit the tilt maneuver is precise and sustained (beyTiltAngle→85° stably maintained during approach, not merely a momentary tilt), and the Strata Dragoon spirit transforms the Dragon Saucer AR's energy form into a giant saw blade (the "circular saw" overlay in 2.5D terms: the disc contact edge is spiritually enlarged to r_saw≈60mm, far beyond the physical r_saucer=21mm); the rolling saw blade delivers a fundamentally different contact geometry from all other special moves: rather than a spinning-top smash (force applied along the spin axis plane), the rolling disc contact applies force at the disc edge — a thin-line contact (lockMs=200ms, the saw traverses through the opponent) that produces a "cleaving" force distribution (high spinDelta, extended lock, burst torque); the "cleave solid constructs" franchise property is captured by the unusually high lockMs and burst chance: the saw blade stays engaged for 200ms while crossing the opponent's body (unlike a smash impact at ~50ms), and this extended perpendicular-axis engagement maximises the burst-torque angle.

```
Vast Cutter — phase structure:

Phase 1 — "rolling_approach" (600 ms):
  beyTiltAngle → 85°  (Dragon Saucer disc-edge contacts arena floor)
  v_roll = ω × r_saucer = 500 × 0.021 ≈ 10.5 m/s  (BeySpirit maintains ω during approach)
  Strata Dragoon spirit appears → transforms Dragon Saucer into energy saw blade
  r_saw_spirit = 60 mm  (spiritual saw blade radius, BeySpirit only)
  Saw blade aura: yellow/white rotating energy disc

Phase 2 — "saw_cleave" (rolling contact traversal):
  Contact geometry: thin disc edge at r_saw=60mm (spirit) / r_saucer=21mm (physics)
  Extended traversal lock (saw crosses opponent body):
    spinDelta       = −500 rad/s
    linearImpulse   = 6 000 eu
    damageMultiplier = 2.3×
    lockMs          = 200  (saw traversal — extended)
    burstChanceBonus = +20%  (perpendicular disc torque vs opponent spin axis)
    beyTiltAngle_self remains at 85° during contact (rolling mode maintained)

  QTE — "Disc Break":
    Window: 200 ms;  Input: jump (C)
    Success: 50% spinDelta + impulse, no burst bonus, lockMs = 50
    Fail: full cleave (200 ms traversal)

Self-cost: −180 spinDelta  (EG Metal Flat at 85° tilt — rolling mode high friction)
powerCost: 100;  cooldownMs: 5 000
NOTE: any beyblade can use Vast Cutter; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateVastCutter(dragoon: Beyblade, target: Beyblade): void {
  dragoon.beyTiltAngle = 85;  // rolling mode approach
  setTimeout(() => {
    if (!target.discBreakSuccess) {
      applySpinDelta(target, -500);
      applyLinearImpulse(target, dragoon.facingAngle, 6000);
      target.damageMultiplier = 2.3;
      target.locked = true; target.lockExpiresAt = Date.now() + 200;
      target.burstChanceBonus = (target.burstChanceBonus ?? 0) + 0.20;
      setTimeout(() => { target.burstChanceBonus -= 0.20; }, 200);
    } else {
      applySpinDelta(target, -250);
      applyLinearImpulse(target, dragoon.facingAngle, 3000);
      target.locked = true; target.lockExpiresAt = Date.now() + 50;
    }
    applySpinDelta(dragoon, -180);
    dragoon.beyTiltAngle = 0;
  }, 600);
}
```

---

## Case 771 — [SPECIAL MOVE] Vast Hurricane: Daichi Sumeragi / Strata Dragoon V (Beyblade V-Force)

**Franchise Move:** Strata Dragoon begins moving around in circles at high speed creating a dust devil to blow the opposing bey away. Vast Hurricane is the second special move used by Daichi Sumeragi with Strata Dragoon V. [Beyblade V-Force]

**Thesis:** Vast Hurricane is the BeySpirit expression of the Right EG Metal Flat's (Case 215) high-speed orbital capability combined with the EG spring's one-time orbital boost: the EG spring fires (BeySpirit re-engages under anime physics override for special moves) delivering a sudden orbital speed surge, driving Strata Dragoon to v_orb=3.0 m/s in a tight circular orbit (R_orbit≈80mm, the EG Metal Flat's flat tip at high spin produces tight orbital arcs similar to a standard Metal Flat); the circular orbit at v=3.0 m/s produces a centrifugal wind displacement (the physical mechanism of dust devil formation in proximity to a fast-spinning top) — the centrifugal air flow from the Dragon Saucer's disc body is amplified by the BeySpirit into a stadium-filling dust devil vortex; the vortex force on the opponent is outward (directed away from the orbital centre), which is the inverse of Burning Uppercut's inward cyclone pull — the dust devil push is specifically designed for ring-out, driving the opponent toward the bowl wall; the "blow away" outcome: the outward impulse is high (5000eu, ring-out threat), while spinDelta is moderate (−220) because the wind/vortex is not a direct spin-contact attack.

```
Vast Hurricane — phase structure:

Phase 1 — "EG_surge" (200 ms):
  EG spring re-engages (BeySpirit / anime physics override)
  Orbital speed boost: v_orb → 3.0 m/s  (EG burst from Case 215)
  R_orbit ≈ 80 mm  (tight circular orbit, Metal Flat orbital)

Phase 2 — "dust_devil" (800 ms circular orbit):
  Centrifugal wind: F_centrifugal = m×v²/R = 0.044×9.0/0.080 = 4.95 N outward
  Strata Dragoon spirit (earth dragon) coils around orbit as wind amplifier
  forceState on target: outward_wind_push  (800 ms, reduces inward approach)

Phase 3 — "wind_release" (orbital energy outward blast):
  Orbital kinetic energy (E_orb = ½×0.044×9.0 = 0.198J) + wind pressure released:
    spinDelta       = −220 rad/s  (wind/vortex — not direct blade contact)
    linearImpulse   = 5 000 eu  (outward: ring-out direction away from center)
    damageMultiplier = 1.6×

  QTE — "Dust Guard":
    Window: 200 ms;  Input: defense (K)
    Success: 50% of impulse (halved ring-out threat), no wind state
    Fail: full dust devil launch

Self-cost: −130 spinDelta  (EG Metal Flat orbital at tight R — moderate drain)
powerCost: 100;  cooldownMs: 4 000
NOTE: any beyblade can use Vast Hurricane; no part restriction for special moves.
NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).
```

```typescript
function activateVastHurricane(dragoon: Beyblade, target: Beyblade): void {
  target.forceState = "outward_wind_push";
  target.forceStateExpiresAt = Date.now() + 800;
  setTimeout(() => {
    if (!target.dustGuardSuccess) {
      applySpinDelta(target, -220);
      applyLinearImpulse(target, dragoon.facingAngle + Math.PI, 5000);  // outward
      target.damageMultiplier = 1.6;
    } else {
      applyLinearImpulse(target, dragoon.facingAngle + Math.PI, 2500);
    }
    applySpinDelta(dragoon, -130);
  }, 800);
}
```

---

## Case 772 — [COMBO] Saucer Roll: Dragon Saucer AR Disc-Edge Sweep (3-key: moveRight attack moveUp)

**Combo ID:** `saucer-roll`
**Sequence:** moveRight → attack → moveUp  (→J↑)
**Cost:** 25 power
**Type Restriction:** attack
**Part Requirement:** dragonSaucerAR  (Dragon Saucer Core AR, Case 212)

Saucer Roll is the combo-level expression of the Dragon Saucer AR's circular disc-edge contact geometry (Cases 769, 770): the moveRight sweeps Strata Dragoon along the rightward orbital arc at mild tilt (beyTiltAngle increases to ≈20° during the rightward sweep — the Dragon Saucer's disc edge begins to contribute to contact beyond the normal wheel rim), the attack fires at the disc-edge contact moment (the Saucer AR's circular rim contacts the opponent — unlike angular blade ARs, the disc contact is a wider edge that spreads force across a larger surface), and the moveUp completes the upward exit arc (Strata Dragoon's tilt recovers as it exits the contact — the upward arc is the tilt-restoration path); at combo scale beyTiltAngle reaches only ≈20° (no full 85° rolling mode — that is BeySpirit territory), but the mild disc-edge engagement still produces a wider contact than a blade tip: spinDelta = −43 (disc-edge contact spreads force — slightly below ceiling because the wide contact distributes rather than concentrating force), damageMultiplier = 1.25×; the lockMs = 80 reflects the disc-edge traversal arc (the circular rim sweeps through the contact zone, longer than a blade point impact) at combo scale.

```
Saucer Roll — geometry:
Phase 1 (→): rightward sweep — beyTiltAngle rises to ~20°, disc edge begins contributing
Phase 2 (J): Dragon Saucer disc-edge contact (partial rolling mode at 20° tilt)
  Disc-edge vs blade: wider contact, force distributed across ~5mm arc
  spinDelta_contact = −43 rad/s;  damageMultiplier = 1.25×;  lockMs = 80
Phase 3 (↑): tilt recovery arc — Strata Dragoon returns toward upright as it exits

ceiling compliance:  1.25× ≤ 1.5×;  80 ms ≤ 300 ms;  43 ≤ 50 rad/s  [check]
Design note: lockMs=80 is the disc-edge traversal arc — longer than a blade smash (≈50ms)
  because the circular edge sweeps through the contact zone rather than point-touching.
  No full rolling-disc mode (85°) at combo scale — that is Vast Cutter BeySpirit territory.
  Free-spin Sub AR (Case 213): passive friction reduction during contact — no independent combo effect.
```

```typescript
// Combo: ["moveRight","attack","moveUp"], cost: 25, type: "attack", part: dragonSaucerAR
function applySaucerRoll(dragoon: Beyblade, target: Beyblade): void {
  // Dragon Saucer disc-edge contact: wider spread, moderate force
  applySpinDelta(target, -43);
  target.damageMultiplier = 1.25;
  target.locked = true; target.lockExpiresAt = Date.now() + 80;
}
```

## Case 773 — [GIMMICK] Forbidden Eonis ED145FB: Centrifugal Air-Control Wing Track, Compound Ball-Flat Tip, and Balanced Dual-Gap Wheel

**Beyblade:** Forbidden Eonis ED145FB
**User:** Jigsaw
**Physics Domain:** MFB-era Forbidden Fusion Wheel balanced 2-fold gap geometry, ED145 free-rotating friction-pivot wing track aerodynamic air control, FB compound ball-then-flat tip stamina orbit

**Note:** Forbidden Fusion Wheel is documented as Case 353a, ED145 Track as Case 353b, FB Bottom as Case 353c, and Eonis Clear Wheel as Case 353d (all CS6).

**Thesis:** Forbidden Eonis ED145FB's battle identity is the **ED145 Track's centrifugal air-control shell**: three free-rotating wings at r_wing=15mm spinning at ω₀=600 rad/s produce wing-tip velocity v_tip=ω×r=600×0.015=9.0 m/s; by the Bernoulli principle, the rotating wing array accelerates air at the outer edge and creates a centrifugal pressure differential — air at r_wing is thrown outward at 9.0 m/s, establishing a low-pressure core zone around the Spin Track body and a compressed-air outer ring at the wing tips; this is the physical basis for Eonis's franchise "air control" property: the pressure field channels aerodynamic force in a directed pattern dictated by the orientation of the free-spinning wings (Case 353b confirms these wings rotate on a friction-fit plastic pivot, not a bearing, giving them a controlled rather than fully-free rotational response); the Forbidden Fusion Wheel (Case 353a: 31.7g, I_Forbidden=7.97×10⁻⁶ kg·m², 2-fold gap at 180°, φ_gap≈45°, J_gap=cos(45°)×J=0.707×J) contributes peripheral inertia that anchors this bey's angular momentum while the gaps provide periodic burst-angle contacts; the Eonis Clear Wheel (Case 353d: 2.8g, I_Eonis=8.81×10⁻⁷ kg·m², 2-fold C₂ horn symmetry) aligns its horns over the Forbidden gaps when optimally clocked — partially filling the gap arc mass deficit and reducing the 2-node nutation mode; the FB compound tip (Case 353c: ball contact r_ball=2.5mm, μ_ball via Hertz, dω/dt_ball=0.284 rad/s² for standard 0.050kg assembly — adapted here for 0.041kg: dω/dt_ball≈0.231 rad/s², spin life in ball mode>2000s) keeps Eonis in pure long-duration orbit during the energy build-up phase; the combination — ultra-long stamina via FB ball contact, persistent air-zone via ED145, and high peripheral inertia via Forbidden — produces a bey whose passive physics pre-condition the Burst Satellite special move: the compressed air field is the stored "potential" that Eonis releases.

```
Forbidden Fusion Wheel [Case 353a]:
  I_Forbidden = 7.97e-6 kg·m²   (2-fold gap, 72.2% ring mass retained)
  phi_gap = 45°                  (gap wall angle)
  J_gap = cos(45°) × J = 0.707 × J
  r_outer = 23.7 mm

Eonis Clear Wheel [Case 353d]:
  I_Eonis = 8.81e-7 kg·m²       (C₂ horn symmetry, 10% of combined I)
  Best alignment: horns over Forbidden gaps → partially fills gap mass deficit

ED145 Track [Case 353b]:
  r_wing = 15.0 mm   (free-rotating wing outer radius)
  r_pivot = 5.0 mm   (plastic friction-fit pivot)
  m_wing = 0.4 g each (3 wings = 1.2g; hub 2.4g)
  τ_pivot = μ × F_N × r_pivot = 0.35 × 1.5 × 0.005 = 2.63e-3 N·m (per hit, 12% energy loss)
  I_ED145 ≈ 1.37e-7 kg·m²  (hub + 3 wings, negligible)

  Centrifugal air-control at ω₀ = 600 rad/s:
    v_tip = 600 × 0.015 = 9.0 m/s
    Dynamic pressure: q = ½ × 1.225 × 81 = 49.6 Pa
    Air zone radius (pressure falls to 5% of peak): R_field ≈ r_wing × √20 ≈ 67 mm

FB Bottom [Case 353c]:
  Ball-mode (θ < 8.2°): r_ball = 2.5 mm, dω/dt_ball ≈ 0.231 rad/s²  (this assembly, 41g)
  Flat-mode (θ > 8.2°): r_eff = 2.63 mm, μ = 0.35, dω/dt_flat ≈ 40.0 rad/s²
  θ_switch = arcsin(0.5/3.5) ≈ 8.2°

Assembly [MFB era, 4D/Metal Fury]:
  m = 31.7+2.8+3.6+0.6+2.0(face) = 40.7g ≈ 0.041 kg
  I_total = 7.97e-6 + 8.81e-7 + 1.37e-7 + 3.7e-9 ≈ 9.01e-6 kg·m²
  ω₀ = 600 rad/s   W = 0.041 × 9.81 = 0.402 N
```

```typescript
interface ForbiddenEonisAssembly {
  m_kg: number;               // 0.041
  I_kgm2: number;             // 9.01e-6
  omega0_rads: number;        // 600
  // Forbidden wheel [Case 353a]
  phi_gap_deg: number;        // 45
  r_outer_m: number;          // 0.0237
  // ED145 track [Case 353b]
  r_wing_m: number;           // 0.015
  r_pivot_m: number;          // 0.005
  tau_pivot_Nm: number;       // 2.63e-3 (per-hit friction loss)
  v_tip_ms: number;           // 9.0 (at omega0)
  // FB tip [Case 353c]
  r_ball_m: number;           // 2.5e-3
  theta_switch_deg: number;   // 8.2
  dw_dt_ball: number;         // 0.231 (this assembly)
  dw_dt_flat: number;         // 40.0
}
function ed145AirZoneRadius(omega: number, r_wing: number): number {
  const v = omega * r_wing;
  return r_wing * Math.sqrt(0.5 * 1.225 * v * v / (0.05 * 0.5 * 1.225 * v * v)) * r_wing;
  // simplified: r_field = r_wing × sqrt(20) at 5% pressure threshold
}
```

---

## Case 774 — [SPECIAL MOVE] Burst Satellite: Jigsaw / Forbidden Eonis ED145FB (Metal Fight Beyblade)

**Franchise Move:** Burst Satellite (バーストサテライト) is the only Special Move used by Jigsaw with Forbidden Eonis ED145FB. Eonis focuses all its spin energy into itself and blasts it out in a red supernova-like attack spread by Eonis's air control, taking in its opponents and sapping their stamina. It was powerful enough to completely drain Evil Befall, Spiral Fox, and Spiral Lyre simultaneously. The name references Jupiter's moon Io — the most geologically active body in the solar system — whose tidal-heating volcanic eruptions shoot pyroclastic material over 200 km into space, turning the surrounding area red, white, and black; the supernova energy sphere visualises the Io eruption plume dome. [Metal Fight Beyblade]

**Thesis:** Burst Satellite is the BeySpirit transcendence of the ED145 centrifugal air-control property (Case 773): at passive physics, the 9.0 m/s wing-tip air velocity creates a 50 Pa pressure differential in a ~67 mm field radius; under Jigsaw's Eonis BeySpirit, this air-control is compressed into a full energy compression phase (ω accelerates from 600→850 rad/s under BeySpirit spin-up, storing ΔKE=½×9.01×10⁻⁶×(850²−600²)=½×9.01×10⁻⁶×362,500=1.633 J), then released in an Io-eruption-scale supernova burst: the stored rotational energy converts entirely to an outward energy field at the moment of release, the ED145 wing-tip velocity reaching v_tip_max=850×0.015=12.75 m/s and producing dynamic pressure q=½×1.225×12.75²=99.7 Pa≈100 Pa, which expands outward to fill the entire stadium cross-section (R_stadium≈90 mm), enclosing all opponents within the Eonis pressure dome; critically, the air-control vortex during the satellite_field phase creates centripetal inflow (the Bernoulli low-pressure core draws arena air inward, pulling all opponents toward the Eonis centre — this is the "taking in its opponents" franchise description, quantified as F_vortex≈1.5N directed toward Eonis during the 1500ms field phase); within the trapped field, the opponent beys experience turbulent aerodynamic drag that continuously bleeds angular momentum (spinDecayRate×2.0 for 1500ms — the "sapping their stamina" effect, equivalent to the volcanic outgassing analogy of Io's constant sulfur dioxide atmosphere stripping energy); the supernova_burst final phase releases all remaining stored energy outward in a red/white/black Io-eruption visual, delivering a simultaneous spinDelta to every opponent in the field; the "powerful enough to drain three opponents" franchise description is captured by the AoE application: each opponent receives −280 spinDelta and a moderate outward push; the self-cost is the cost of the compression-release cycle (Eonis drops from the ~850 rad/s peak to well below ω₀ after the burst, net self-cost=−250 spinDelta equivalent from the energy dump).

NOTE: special move overrides all EG/clutch mechanical state; Burst Satellite is a field-type special (AoE stamina drain + simultaneous blast); combos cannot replicate the AoE field effect or sustained spinDecayRate boost (special-move-only).

```
Burst Satellite — phase structure:

Phase 1 — "energy_compression" (BeySpirit spin-up, ≈1.5s):
  ω: 600 → 850 rad/s  (BeySpirit angular acceleration override)
  ΔKE stored = ½ × 9.01e-6 × (850² − 600²) = 1.633 J
  v_tip = 850 × 0.015 = 12.75 m/s   →  q_max = 99.7 Pa ≈ 100 Pa
  Visual: Forbidden wheel glows red, Eonis spirit forms a golden Io-sphere

Phase 2 — "satellite_field" (Eonis energy dome, 1500ms):
  R_field = R_stadium ≈ 90 mm  (stadium-wide pressure dome, anime scale)
  forceState = "vortex_pull" on all opponents within R_field:
    F_vortex = 1.5 N directed toward Eonis centre  (Bernoulli low-pressure core pull)
    Duration: 1500ms
  Stamina drain (spin decay boost):
    opponent spinDecayRate × 2.0 for 1500ms  ("sapping their stamina")
    At typical MFB decay 7 rad/s²: additional −10.5 rad/s drained per opponent over 1500ms
  Visual: red/white Io eruption dome encloses stadium; opponents orbit inward

Phase 3 — "supernova_burst" (Io eruption release, single frame):
  Simultaneous blast to all trapped opponents (AoE):
    spinDelta = −280  (per opponent; three opponents confirmed by franchise)
    linearImpulse = 2800 eu (outward, ring-out direction, per opponent)
    damageMultiplier = 1.8×
  Visual: red/black pyroclastic explosion from Eonis centre; opponents thrown outward

Self-cost: −250 spinDelta equivalent (compression-release energy dump; Eonis drops far below ω₀)
QTE — "Satellite Guard":
  Window: 260ms from Phase 3 onset;  Input: defense (K)
  Success: spinDelta × 0.30 per opponent, no field;  self-cost unchanged
  Fail: full three-phase sequence
powerCost = 100;  cooldown = 8000ms  (long — AoE field special, second-longest in CS13)
```

```typescript
// Case 774 — Burst Satellite AoE field special
interface BurstSatelliteState {
  phase: "energy_compression" | "satellite_field" | "supernova_burst";
  fieldActive: boolean;
  vortexPullN: number;         // 1.5
  spinDecayMult: number;       // 2.0 during field
  fieldDurationMs: number;     // 1500
  storedKE_J: number;          // 1.633
}
function triggerBurstSatellite(caster: Beyblade, opponents: Beyblade[]): void {
  opponents.forEach(opp => {
    // vortex pull toward caster
    opp.forceState = "vortex_pull";
    opp.vortexTarget = { x: caster.x, y: caster.y };
    opp.vortexPullN = 1.5;
    opp.spinDecayRateMultiplier = 2.0;
    opp.vortexExpiresAt = Date.now() + 1500;
  });
}
function releaseSupernovaBurst(caster: Beyblade, opponents: Beyblade[]): void {
  opponents.forEach(opp => {
    applySpinDelta(opp, -280);
    opp.damageMultiplier = 1.8;
    // outward impulse
    const dx = opp.x - caster.x; const dy = opp.y - caster.y;
    const dist = Math.hypot(dx, dy) || 1;
    opp.vx += (dx / dist) * 2800 * IMPULSE_SCALE;
    opp.vy += (dy / dist) * 2800 * IMPULSE_SCALE;
    opp.forceState = "none";
    opp.spinDecayRateMultiplier = 1.0;
  });
  applySpinDelta(caster, -250);  // self-cost
}
```

---

## Case 775 — [COMBO] Eternal Wing (↑K↑)

**Beyblade:** Forbidden Eonis ED145FB
**Combo ID:** `eternal-wing`
**Sequence:** moveUp → defense → moveUp  (↑K↑)
**Cost:** 15 power
**Type Restriction:** balanced
**Part Requirement:** ed145Track  (ED145 Track [Case 353b] free-rotating wings required)

Eternal Wing is the combo-level expression of ED145's free-rotating wing deflection property (Cases 773, 353b): the first moveUp drives Eonis to the upper orbital arc, building approach velocity; the defense press (K) is the ED145 wing deployment moment — as Eonis passes the opponent, the wing at r_w=15mm sweeps forward due to relative air flow, contacting the opponent's outer ring at the wing tip (τ_pivot=2.63×10⁻³ N·m confirms the wing does rotate and deliver force, not passively fold — the pivot friction is the "transmission" that lets the wing transfer momentum); the second moveUp carries Eonis away from contact on the upper arc using FB ball tip's low friction (dω/dt_ball=0.231 rad/s² is near-zero relative decay, allowing Eonis to exit at nearly full orbital speed); the Forbidden gap (φ_gap=45°, J=0.707×J) aligns with the contact moment, contributing the recoil half of the force pair: wing sweep forward + Forbidden gap wall simultaneous = double-component hit (tangential from wing, radial-recoil from gap); at combo scale there is no air-vortex field (BeySpirit only), but the orbital exit after the hit mimics the "spread" visual of Burst Satellite at micro-scale; spinDelta=−44 (ED145 wing sweep + Forbidden gap combined force, balanced between stamina deflection and gap recoil), damageMultiplier=1.30×, lockMs=50.

```
Eternal Wing — geometry:

  Orbit path:   ... upper arc (↑) → wing contact (K) → continue upper (↑) →
                         ↑                                       ↑
  Contact:  ED145 wing r=15mm sweeps against opponent outer ring
            Forbidden gap at 45° fires simultaneously (J_gap = 0.707J)

  ED145 wing torque at contact (using Case 353b):
    τ_effective = F_wing × r_wing = F_wing × 0.015
    (F_wing = some fraction of orbital kinetic energy, not full τ_pivot which is the loss term)
    Wing transmitted impulse ≈ 15% of orbital momentum → spinDelta contribution ≈ −20 rad/s
    Forbidden gap contribution: φ=45° → spinDelta contribution ≈ −24 rad/s
    Combined: −44 rad/s
```

```typescript
// Combo: ["moveUp","defense","moveUp"], cost: 15, type: "balanced", part: ed145Track
function applyEternalWing(caster: Beyblade, target: Beyblade): void {
  // ED145 wing + Forbidden gap double contact
  applySpinDelta(target, -44);
  target.damageMultiplier = 1.30;
  target.locked = true; target.lockExpiresAt = Date.now() + 50;
}
// 1.30× ≤ 1.5×; 50ms ≤ 300ms; 44 ≤ 50 rad/s; no invulnerability, no AoE [check]
```

---

## Case 776 — [GIMMICK] Bushin Ashindra Hurricane Keep Ten: Twelve-Blade Defense Shell, Inward-Concentrated Disc, Rubber Grip Driver, and Hexagonal Layer Weight

**Beyblade:** Bushin Ashindra Hurricane Keep Ten
**User:** Arman Kusaba
**Physics Domain:** Burst GT/Gatinko era Bushin Layer Base twelve-blade defense shell, Gatinko Chip Ashura seven-lock burst resistance, Forge Disc Hurricane inward-concentrated core, Performance Tip Keep rubber grip phase-transition, Layer Weight Ten hexagonal mass distribution

**Note:** All parts are documented: Gatinko Chip Ashura = Case 607, Layer Weight Ten = Case 608, Layer Base Bushin = Case 609, Forge Disc Hurricane = Case 610, Performance Tip Keep = Case 611, full assembly = Case 612 (all CS9).

**Thesis:** Bushin Ashindra Hurricane Keep Ten's battle identity is the **Bushin Layer Base's twelve-blade defensive geometry** (Case 609: 10.3g, I_Bushin=4.120×10⁻⁶ kg·m², I_fraction=45.9% of total I despite being only 19.4% of assembly mass): twelve consecutive blade-like features arranged as six paired swords sweep around the full perimeter at r_blade=20mm, each blade swept back at α_blade≈25° from the tangential direction; this sweep-back geometry is the "low-recoil" mechanism — the radial inward component of contact force is F_radial=F_contact×sin(25°)=0.423×F_contact rather than the full F_contact of a flat aggressive blade (57.7% recoil reduction confirmed by Case 609); the Ashura Gatinko Chip (Case 607: 2.8g, 7-tooth ratchet) contributes a 2.33× burst-resistance improvement over 3-tooth chips by increasing the tooth-engagement threshold; the Bushin base's deep skirt reduces direct burst-contact probability to 60% of average (Case 609); the Hurricane Forge Disc (Case 610: 25.1g, I_Hurricane=2.369×10⁻⁶ kg·m², r_eff=9.72mm — heavily inward-concentrated core at 47.4% of assembly mass but only 26.4% of total I) creates the inertia-mass inversion noted in Case 612: the layer dominates the inertia budget (Bushin: 45.9%; Ten: 24.0%) despite Hurricane being the heaviest part; Layer Weight Ten (Case 608: 8.4g, I_Ten=2.150×10⁻⁶ kg·m², hexagonal distribution at r_eff=16mm) adds a peripheral ring of mass around the chip that contributes the second-largest inertia fraction; the Keep tip (Case 611: 6.4g) provides Phase 1 (τ_high=1.040×10⁻³ N·m, dω/dt=116.0 rad/s², 4.26s) to Phase 2 (τ_low=5.200×10⁻⁴ N·m, dω/dt=58.0 rad/s², 3.45s) two-phase decay with ω_couple=200 rad/s transition; the combination stacks three independent burst-suppression mechanisms (Ashura 7-tooth ×2.33, Bushin skirt ×0.60, Keep grip model) to produce a combined burst-contact probability of 0.60×(1/2.33)=0.257 — 74.3% lower than an unmodified baseline (Case 612); this layered defensive architecture is the physical pre-condition for Bushin Guard (Case 777), which BeySpirit-amplifies the six-blade alternating subset into a full whirlwind barrier.

```
Assembly [Burst GT/Gatinko era] — from Case 612:
  m = 2.8+8.4+10.3+25.1+6.4 = 53.0 g  (0.053 kg)

  Part                  Mass(g)  I (kg·m²)      I Fraction
  Gatinko Chip Ashura    2.8     2.744e-7          3.1%    [Case 607]
  Layer Weight Ten       8.4     2.150e-6         24.0%    [Case 608]
  Layer Base Bushin     10.3     4.120e-6         45.9%    [Case 609]
  Forge Disc Hurricane  25.1     2.369e-6         26.4%    [Case 610]
  Performance Tip Keep   6.4     5.120e-8          0.6%    [Case 611]
  TOTAL                 53.0     8.966e-6        100.0%

  ω₀ = 694 rad/s  (Gatinko era)   L₀ = 8.966e-6 × 694 = 6.222e-3 kg·m²/s
  W = 0.053 × 9.81 = 0.520 N

12-blade partition for Bushin Guard:
  All 12 blades at r_blade = 20 mm, m_blade = 0.858 g each
  Full I_Bushin = 12 × 3.433e-7 = 4.120e-6 kg·m²
  6-blade alternating subset (30°×2 = 60° angular spacing):
    I_6blade = ½ × I_Bushin = 2.060e-6 kg·m²  (even angular distribution — no imbalance)
    v_6blade_tip = 694 × 0.020 = 13.88 m/s  (faster apparent blade sweep per contact)
    Air pressure at 6-blade vortex: q = ½ × 1.225 × 13.88² = 117.9 Pa
```

```typescript
interface BushinAshindraAssembly {
  m_kg: number;              // 0.053
  I_kgm2: number;            // 8.966e-6
  omega0_rads: number;       // 694
  // Layer Base Bushin [Case 609]
  bladeFold: number;         // 12
  r_blade_m: number;         // 0.020
  alpha_blade_deg: number;   // 25 (sweep-back)
  recoilFraction: number;    // 0.423 (sin 25°)
  // Ashura chip [Case 607]
  toothCount: number;        // 7
  burstResistanceMult: number; // 2.33
  // Keep tip [Case 611]
  omega_couple_rads: number; // 200
  tau_high_Nm: number;       // 1.040e-3
  tau_low_Nm: number;        // 5.200e-4
  // Combined burst probability relative to baseline
  burstContactRatio: number; // 0.257 (74.3% lower than baseline)
}
```

---

## Case 777 — [SPECIAL MOVE] Bushin Guard: Arman Kusaba / Bushin Ashindra Hurricane Keep Ten (Beyblade Burst GT)

**Franchise Move:** Bushin Guard (ブシンガード) is the Special Move used by Arman Kusaba with Bushin Ashindra Hurricane Keep Ten. Ashindra uses six of the twelve blades on its Bushin Layer Base to create a lime-green whirlwind that defends itself from the opposing Beyblade's attacks. [Beyblade Burst GT]

**Thesis:** Bushin Guard is the BeySpirit transcendence of the Bushin Layer Base's blade geometry (Case 776): at passive physics, the twelve blades operate as a unified radial defense barrier with α_blade=25° sweep-back and 57.7% recoil reduction; under Arman's Ashindra BeySpirit, exactly six of the twelve blades (alternating set, 60° angular spacing — a hexagonal sub-ring) are selectively amplified in rotational contribution while the other six remain passive; this six-blade selective activation is the BeySpirit mechanism: the blade sub-ring spins relative to the assembly (the active blades move "faster" in the spirit plane than the physical rotation would permit), creating a hexagonal vortex configuration rather than the circular barrier of all twelve; a hexagonal vortex has six directional pressure jets at 60° intervals that combine into a rotating lime-green energy field — the "whirlwind" franchise description; the physics of this whirlwind: at ω₀=694 rad/s, the six active blades at r=20mm produce v_tip=694×0.020=13.88 m/s and dynamic pressure q=117.9 Pa per jet; since the jets are equally spaced (hexagonal), the combined pressure field is centrosymmetric and extends to R_guard≈35mm from the Bushin centre; any incoming bey contact within this zone encounters the whirlwind's tangential component (the field rotates) before reaching Ashindra's layer surface — the tangential flow redirects a fraction of the incoming attack vector away from the burst-optimal radial direction; quantitatively, the whirlwind deflects incoming attack vectors by ≈70° from their original trajectory (the rotational vortex adds a tangential component), converting a radial smash (maximum burst-torque geometry) into a glancing contact (minimum burst-torque geometry); this deflection of the incoming vector is the mechanism that "defends itself from attacks" — not by absorbing force, but by rotating the force direction away from the burst axis; spinDelta received while guard is active is therefore reduced to spinDelta_in×0.20 (only 20% of the attack's spin-deceleration reaches Ashindra through the whirlwind), and the remaining 80% is redirected tangentially — converted to a brief acceleration of the vortex itself, which manifests as spinDelta_self=+35 per absorbed hit (the whirlwind channels blocked energy back into Ashindra's own spin, consistent with the franchise showing Ashindra not slowing down under attack during Bushin Guard); the guard is purely defensive — no counter-launch, no opponent knockback — just shield and spin-recovery; the self-cost is −100 spinDelta (the BeySpirit energy needed to activate and sustain the six-blade whirlwind for the guard window).

NOTE: special move overrides all EG/clutch mechanical state; Bushin Guard is a sustained defensive stance (no direct attack output, purely guard + spin recovery from deflected energy). This is the only purely defensive special in CS13 with no counter-attack phase.

```
Bushin Guard — phase structure:

Phase 1 — "whirlwind_activation" (instantaneous on cast):
  6 of 12 blades amplified (alternating set, hexagonal 60°-spacing)
  v_tip_active = 694 × 0.020 = 13.88 m/s  (BeySpirit override — blade sub-ring spins faster)
  q_vortex = ½ × 1.225 × 13.88² = 117.9 Pa
  R_guard = 35 mm  (whirlwind field radius; contacts within this zone are deflected)
  forceState = "whirlwind_guard"  on Ashindra
  Visual: Ashindra spins at extreme speed; lime-green whirlwind energy field forms above it

Phase 2 — "guard_window" (2000ms):
  Any incoming contact within R_guard ≈ 35 mm:
    spinDelta_received = normal_spinDelta × 0.20  (80% deflected by whirlwind)
    spinDelta_self += +35 per absorbed hit  (deflected energy → self spin recovery)
    Deflection vector rotation: incoming angle rotated +70°  (tangential vortex redirect)
    Burst contact probability reduced further: whirlwind geometry prevents burst-axis alignment
  Self-cost: −100 (sustained whirlwind energy; paid at activation)

Phase 3 — "guard_expire" (on duration end or manual cancel):
  whirlwind_guard forceState removed
  No burst/counter — guard simply ends
  Net effect after full guard window:
    Ashindra recovers +35 × N_hits spinDelta (where N_hits = number of attacks absorbed)
    Opponent attacks pass through at 20% effectiveness during window

QTE — "Vortex Break":
  Window: 250ms from Phase 2 onset;  Input: attack (J) by opponent
  If opponent presses J during window: bypasses 80% deflection for that hit (full spinDelta applied)
    — visual: opponent's BeySpirit cuts through the whirlwind field
  Normal play: no QTE required from Ashindra; opponent must consciously counter the guard

powerCost = 100;  cooldown = 5000ms
```

```typescript
// Case 777 — Bushin Guard sustained defensive stance
interface BushinGuardState {
  active: boolean;
  expiresAt: number;         // Date.now() + 2000
  hitsAbsorbed: number;
  spinDeltaSelfRecovered: number;
}
function activateBushinGuard(ashindra: Beyblade): BushinGuardState {
  applySpinDelta(ashindra, -100);   // activation cost
  ashindra.forceState = "whirlwind_guard";
  return { active: true, expiresAt: Date.now() + 2000, hitsAbsorbed: 0, spinDeltaSelfRecovered: 0 };
}
function processBushinGuardHit(ashindra: Beyblade, guard: BushinGuardState,
    incomingSpinDelta: number, opponentUsedAttackQTE: boolean): number {
  if (opponentUsedAttackQTE) return incomingSpinDelta;  // vortex break
  const deflected = incomingSpinDelta * 0.80;
  const throughput = incomingSpinDelta * 0.20;
  applySpinDelta(ashindra, throughput + 35);  // 20% damage + 35 recovery per hit
  guard.hitsAbsorbed++; guard.spinDeltaSelfRecovered += 35;
  return throughput;
}
```

---

## Case 778 — [COMBO] Whirlwind Parry (K↑K)

**Beyblade:** Bushin Ashindra Hurricane Keep Ten
**Combo ID:** `whirlwind-parry`
**Sequence:** defense → moveUp → defense  (K↑K)
**Cost:** 15 power
**Type Restriction:** defense
**Part Requirement:** bushinBase  (Bushin Layer Base [Case 609] twelve-blade geometry required)

Whirlwind Parry is the combo-level expression of Bushin Guard's blade-whirlwind mechanics (Cases 776, 777): the first defense press (K) is Ashindra entering the deflection stance — the Bushin blade contacts the incoming opponent from the swept-back α=25° angle (only 42.3% radial recoil, 57.7% recoil reduction per Case 609), converting most of the contact into a tangential redirect; the moveUp (↑) is the redirect moment — the deflected opponent vector rises along Ashindra's swept blade surface and is directed upward (the 25° blade sweep acts as a ramp, channeling contact force upward rather than inward); the second defense press (K) is the exit guard — as the opponent trajectory rises, a second Bushin blade contacts from the complementary angle (12-blade density means a second blade is always within 30° of the first contact), delivering the actual spinDelta of the combo and completing the "double parry" sequence; at combo scale there is no sustained whirlwind field (BeySpirit only), but the K→↑→K triple input captures the deflect→redirect→secondary-contact triple motion of the six-blade vortex at physical scale; spinDelta=−37 (deflection contact, lower than full-force smash because α=25° reduces radial transmission to 42.3% × total; the 37 rad/s is consistent with 0.423 × full-force for a blade at this contact geometry), damageMultiplier=1.20×, lockMs=30.

```typescript
// Combo: ["defense","moveUp","defense"], cost: 15, type: "defense", part: bushinBase
function applyWhirlwindParry(caster: Beyblade, target: Beyblade): void {
  // Bushin swept-blade double contact
  applySpinDelta(target, -37);
  target.damageMultiplier = 1.20;
  target.locked = true; target.lockExpiresAt = Date.now() + 30;
}
// 1.20× ≤ 1.5×; 30ms ≤ 300ms; 37 ≤ 50 rad/s; no invulnerability, no AoE [check]
```

---

## Case 779 — [GIMMICK] Spiral Fox TR145W²D: LAD-Enabled Rolling Approach, Compound Spike-Flat Tip, and Stamina Spiral Wheel

**Beyblade:** Spiral Fox TR145W²D
**User:** Zeo Abyss
**Physics Domain:** MFB Metal Fury era Spiral Fusion Wheel stamina contacts, TR145 triple-roller LAD track, W²D compound spike-flat tip wear progression

**Note:** Spiral Fusion Wheel [M] and Fox Clear Wheel [M] are not yet documented in the case library; all [M] values carry ±15% uncertainty. TR145 is documented as Case 64 (CS1); W²D as Case 65 (CS1).

**Thesis:** Spiral Fox TR145W²D's battle identity is the **TR145 Track's rolling-resistance LAD capability** (Case 64) combined with the W²D's compound tip wear-transition (Case 65): TR145 embeds three roller balls at its wing tips (r_roller≈1.5mm each, C_rr≈0.004) — at normal battling angles (θ<80°) these rollers simply reduce tilt-friction slightly, giving Spiral Fox marginally reduced floor drag compared to standard 145 tracks; but at high tilt (θ>80°) when Spiral Fox tilts nearly sideways, the rollers contact the stadium floor and produce rolling resistance rather than kinetic sliding friction, decelerating translational motion at a_roll=C_rr×g≈0.04 m/s² vs a_slide=μ_k×g≈4.9 m/s² — a 124× reduction in approach-angle floor drag; this rolling-approach property is the physical pre-condition for Buster Tail (Case 780): at high tilt approach angles, Spiral Fox sustains linear velocity that would be destroyed by sliding friction on any standard track; the W²D compound tip (Case 65): centre spike Δh_spike≈1.5mm produces θ_switch≈22° — at upright stable orbit (θ<22°), spike contact provides near-zero floor friction; at tilt (θ>22°), the flat plastic disc (r_disc≈11mm, μ_disc=0.50) contacts the floor and provides a larger LAD surface when toppled (full disc-face contact area≈380mm², 52% more than WD); the Spiral Fusion Wheel [M] provides the primary rotational inertia (φ_spiral≈15° smooth curved contacts [M estimate], J_spiral=cos(15°)×J=0.966×J — stamina-oriented low-recoil geometry); Fox Clear Wheel [M] is a lightweight plastic ring (~2g [M]) contributing negligible inertia; the assembly creates a bey whose TR145 rolling system allows approach angles that normal beys cannot sustain, making Spiral Fox naturally suited for high-tilt high-speed attack runs — the physical basis for Zeo's kick-motion Buster Tail.

```
Spiral Fusion Wheel [M]:
  m_Spiral ≈ 30.0 g  [M estimate, MFB metal-fury stamina wheel]
  r_outer ≈ 23.5 mm  [M]
  phi_spiral ≈ 15°   [M, smooth curved stamina contacts]
  J_spiral = cos(15°) × J = 0.966 × J
  I_Spiral ≈ 5.5e-6 kg·m²  [M, annular ring model]

Fox Clear Wheel [M]:
  m_Fox ≈ 2.0 g  [M]
  I_Fox ≈ 8.5e-8 kg·m²  [M, cosmetic ring]

TR145 Track [Case 64]:
  3 roller balls at r_roller = 1.5 mm each
  C_rr ≈ 0.004  (rolling resistance coefficient, metal ball on plastic)
  LAD deceleration: a_roll = 0.004 × 9.81 = 0.039 m/s²  (vs sliding 4.9 m/s²)
  LAD distance ratio: sliding/rolling = 4.9/0.039 = 124×  (rolling travels 124× farther)
  m_TR145 ≈ 2.0 g  (track body + 3 roller balls)

W²D Bottom [Case 65]:
  θ_switch = arctan(1.5/3.5) ≈ 22°  (spike-to-disc transition, fresh tip)
  At wear = 0.3: θ_switch ≈ 13°  (optimal operating point)
  μ_disc = 0.50  (plastic flat disc)
  r_disc ≈ 11 mm  (flat disc outer radius)
  LAD toppled area ≈ π × 11² = 380 mm²  (52% more than WD)
  Spike contact when upright: near-zero friction, extended stamina

Assembly [MFB Metal Fury era]:
  m ≈ 30.0+2.0+2.0+0.6+1.4(face) = 36.0 g ≈ 0.036 kg  [M]
  I_total ≈ 5.5e-6+8.5e-8+tiny = 5.59e-6 kg·m²  [M]
  ω₀ = 600 rad/s   W = 0.036 × 9.81 = 0.353 N  [M]
```

```typescript
interface SpiralFoxAssembly {
  m_kg: number;                // 0.036 [M]
  I_kgm2: number;              // 5.59e-6 [M]
  omega0_rads: number;         // 600
  // Spiral wheel [M]
  phi_spiral_deg: number;      // 15 [M]
  r_outer_m: number;           // 0.0235 [M]
  // TR145 [Case 64]
  C_rr_roller: number;         // 0.004
  lad_decel_ms2: number;       // 0.039
  lad_ratio: number;           // 124  (rolling vs sliding distance)
  // W²D [Case 65]
  theta_switch_deg: number;    // 22 (fresh); 13 (worn 0.3)
  mu_disc: number;             // 0.50
  r_disc_m: number;            // 0.011
}
function tr145LadDistance(v0_ms: number, C_rr: number): number {
  return (v0_ms * v0_ms) / (2 * C_rr * 9.81);
  // At v0=3 m/s: d_lad = 9/(2×0.004×9.81) = 114.7 m  (far exceeds any stadium)
  // In practice limited by stadium geometry — the point is rolling resistance is negligible
}
```

---

## Case 780 — [SPECIAL MOVE] Buster Tail: Zeo Abyss / Spiral Fox TR145W²D (Metal Fight Beyblade: Metal Fury)

**Franchise Move:** Buster Tail is the Special Move used by Zeo Abyss with Spiral Fox TR145W²D. Zeo motions a kick in mid-air that causes Spiral Fox to glow bright blue and crash into the opponent with great force. [Beyblade: Metal Fury]

**Thesis:** Buster Tail is the BeySpirit transcendence of the TR145 rolling-approach property (Case 779): at passive physics, TR145's rollers allow Spiral Fox to sustain translational velocity at high tilt angles that would immediately destroy momentum on standard tracks; under Zeo's Fox BeySpirit, this tilt-approach capability is amplified to a full speed-crash sequence — the "kick motion" in the franchise is Zeo's BeySpirit delivering a rotational-to-linear kinetic energy conversion (effectively a brief spin-to-translation transfer, the physical motion of a kicked ball whose rotational KE converts to linear KE at the moment of ground contact for a rolling body); the key physics is the TR145 LAD mechanism operating in its offensive mode: at beyTiltAngle→75° (high tilt approach), the rollers contact the stadium floor and Spiral Fox skim-rolls toward the opponent at near-full rotational speed — with a_roll=0.039 m/s² (negligible drag), the approach from R_orbit=80mm to contact requires only t=very short time, giving the opponent minimal reaction window; the BeySpirit delivers the approach velocity: v_approach=√(2×E_converted/m) where E_converted=40% of rotational KE at ω₀: E_convert=0.40×½×5.59×10⁻⁶×600²=0.40×1.006=0.402 J, v_approach=√(2×0.402/0.036)=√(22.3)=4.73 m/s; at this impact velocity, the Spiral wheel's curved contacts (φ_spiral=15°, J=0.966×J, Case 779) deliver the crash force; the "bright blue" franchise description confirms the Fox BeySpirit (not the wheel geometry) provides the energy amplification — it is a straight-line speed-crash with maximum linear impulse rather than a spin-geometry trick; the simplicity of the move reflects its franchise context: Buster Tail is shown in a direct head-on clash, not a multi-phase orbital sequence; the TR145 rollers enable the approach at 75° tilt without the floor-friction penalty that would otherwise steal all approach momentum before contact.

NOTE: special move overrides all EG/clutch mechanical state; Buster Tail is a straight-line speed-crash attack (high linearImpulse primary, spinDelta secondary). The TR145 rolling-approach is the BeySpirit-amplified gimmick.

```
Buster Tail — phase structure:

Phase 1 — "kick_acceleration" (Zeo kick motion → BeySpirit spin-to-linear conversion):
  beyTiltAngle → 75°  (TR145 rollers enter floor contact — rolling mode)
  E_converted = 0.40 × ½ × 5.59e-6 × 600² = 0.402 J  (40% rotational KE → linear)
  v_approach = √(2 × 0.402 / 0.036) = 4.73 m/s  (high speed linear approach)
  TR145 roller decel: a_roll = 0.039 m/s²  (negligible — no approach-momentum loss)
  Visual: Spiral Fox tilts to 75°, glows bright blue, TR145 rollers skimming the stadium floor

Phase 2 — "crash_impact" (direct high-speed collision):
  Spiral wheel contact: phi = 15°, J_spiral = 0.966 × J
  Impact force: F_crash = m × v_approach / t_contact = 0.036 × 4.73 / 0.003 = 56.8 N
    spinDelta       = −350 rad/s  (high — Fox BeySpirit amplifies rolling-crash impact)
    linearImpulse   = 5500 eu    (primary output — straight-line crash, high ring-out risk)
    damageMultiplier = 2.0×
  beyTiltAngle resets to ≈10° after impact  (TR145 rollers release floor contact)

  QTE — "Fox Guard":
    Window: 200ms from phase 2 onset;  Input: defense (K)
    Success: 45% spinDelta + 45% impulse applied;  no roller-approach boost
    Fail: full crash impact at 4.73 m/s approach velocity
    NOTE: the roller approach gives minimal QTE warning (high speed arrival, short window)

powerCost = 100;  cooldown = 4000ms
self-cost: −160 (40% rotational KE consumed in the conversion; Fox drops significantly)
```

```typescript
// Case 780 — Buster Tail high-speed rolling crash
function triggerBusterTail(fox: Beyblade, target: Beyblade): void {
  // Phase 1: spin-to-linear conversion via TR145 rolling approach
  const E_conv = 0.40 * 0.5 * fox.I * Math.pow(fox.spin, 2);
  const v_approach = Math.sqrt(2 * E_conv / fox.m_kg);
  // Phase 2: crash impact
  applySpinDelta(fox, -160);        // self-cost
  applySpinDelta(target, -350);
  target.damageMultiplier = 2.0;
  // linear impulse toward opponent (outward from fox)
  const dx = target.x - fox.x; const dy = target.y - fox.y;
  const dist = Math.hypot(dx, dy) || 1;
  target.vx += (dx / dist) * 5500 * IMPULSE_SCALE;
  target.vy += (dy / dist) * 5500 * IMPULSE_SCALE;
}
```

---

## Case 781 — [COMBO] Rolling Slash (↓J↓)

**Beyblade:** Spiral Fox TR145W²D
**Combo ID:** `rolling-slash`
**Sequence:** moveDown → attack → moveDown  (↓J↓)
**Cost:** 15 power
**Type Restriction:** attack
**Part Requirement:** tr145  (TR145 Track [Case 64] roller-ball LAD system required)

Rolling Slash is the combo-level expression of Buster Tail's TR145 rolling-approach property (Cases 779, 780): the first moveDown drives Spiral Fox to the lower orbital arc, which is the arena position where the TR145 rollers most naturally engage the stadium floor at moderate tilt (lower arc = higher tilt angle vs upright centre-orbit, typically θ≈15–25° — within the range where W²D flat disc also begins to activate per Case 65 at wear≈0.3, θ_switch≈13°); the attack (J) fires the Spiral wheel contact from this tilt-enhanced position — the combination of TR145 roller-floor engagement (reduced friction) and W²D flat disc contact (higher lateral traction) provides the unique double-bottom property: rollers reduce drag during approach while the flat disc adds lateral grip at the moment of impact, concentrating contact force; the second moveDown continues on the lower arc, completing a low-orbit attack-and-continue sequence that mirrors the skimming approach of Buster Tail at reduced scale (no BeySpirit speed boost, but the TR145 rolling property reduces floor drag throughout the sequence); spinDelta=−45 (Spiral smooth contacts from tilt-augmented approach angle: φ=15°, J=0.966×J, combined with TR145 reduced-drag approach momentum), damageMultiplier=1.30×, lockMs=55.

```typescript
// Combo: ["moveDown","attack","moveDown"], cost: 15, type: "attack", part: tr145
function applyRollingSlash(caster: Beyblade, target: Beyblade): void {
  // TR145 rolling approach + Spiral smooth contact from tilt angle
  applySpinDelta(target, -45);
  target.damageMultiplier = 1.30;
  target.locked = true; target.lockExpiresAt = Date.now() + 55;
}
// 1.30× ≤ 1.5×; 55ms ≤ 300ms; 45 ≤ 50 rad/s; no invulnerability, no AoE [check]
```

---

## Case 782 — [GIMMICK] Galux: Wide Smash AR, Speed-Optimised Contact Geometry, and Cat-Pounce Attack Profile

**Beyblade:** Galux (ガルクス — unreleased/prototype Plastic Generation beyblade)
**User:** Mariah (anime characterisation)
**Physics Domain:** Plastic Gen era War Lynx Attack Ring wide-span smash, supporting WD and Base [M]

**Note:** War Lynx AR is documented as Case 271 (CS4): ~6.65g [M estimated], unreleased/prototype, speed-optimised War Lion variant. Supporting WD [M] and Base [M] are not yet documented. Assembly values carry ±15% uncertainty.

**Thesis:** Galux's battle identity is the **War Lynx Attack Ring's speed-optimised wide smash geometry** (Case 271: ~6.65g [M], wide-span cat-paw contact profile designed for high-speed slash attacks): Case 271 establishes that War Lynx was conceived as a counter-oriented fast-attack AR — a variant of the existing War Lion AR geometry — with its distinctive cat-paw profile providing wide, sweeping smash contacts rather than the narrow protrusion contacts of conventional attack ARs; the wide contact arc means War Lynx's smash face spans a larger angular window, increasing the probability of contact engagement during high-speed orbital passes (more forgiving contact geometry for moving-hit scenarios); the "slicing" franchise description of Cat Scratch is physically grounded in this wide-arc contact: as the AR sweeps past the opponent at high orbital speed, the contact is less a point-impact and more a sustained-arc slide — a slicing geometry rather than a percussive punch; the WD [M] and Base [M] complete the assembly as standard plastic-gen components providing bulk inertia and tip contact; since Galux was a prototype/unreleased bey, the exact WD and Base are from anime imagery and not verifiable against a retail product: estimated WD mass ~14g [M], BB ~7g [M], face ~1g; the total assembly mass ≈0.029 kg [M] places Galux at the lighter end of plastic-gen attack combos — consistent with the "speed-optimised" design philosophy of Case 271; the lighter assembly enables higher orbital angular speed at equal launch power, maximising the cat-paw's wide-arc slicing advantage.

```
War Lynx AR [Case 271]:
  m_AR ≈ 6.65 g  [M estimated, CS4 Case 271]
  Wide cat-paw smash contacts  [speed-optimised War Lion variant]
  Contact arc span ≈ 35°–40°  [M estimate from franchise imagery — wider than standard AR]
  phi_slash ≈ 10–15°  [M, shallow forward-slicing angle for sustained arc contact]
  J_slash = cos(12°) × J = 0.978 × J  [M mid-estimate]
  r_outer ≈ 22 mm

WD [M]:
  m_WD ≈ 14.0 g  [M, assumed standard plastic gen WD]
  I_WD ≈ (1/2) × 0.014 × (0.022² + 0.008²) ≈ 3.83e-6 kg·m²  [M]

Base [M]:
  m_Base ≈ 7.0 g  [M, assumed standard right SG flat/sharp tip plastic gen]
  Tip contact ≈ flat or semi-flat [M — anime shows standard attack base]

Assembly [Plastic Gen]:
  m ≈ 6.65+14.0+7.0+1.0(face) = 28.65 g ≈ 0.029 kg  [M]
  I_total ≈ 3.83e-6 + 0.58e-6(AR) + 0.10e-6(base) = 4.51e-6 kg·m²  [M]
  ω₀ = 500 rad/s  (plastic gen launch)
```

```typescript
interface GaluxAssembly {
  m_kg: number;              // 0.029 [M]
  I_kgm2: number;            // 4.51e-6 [M]
  omega0_rads: number;       // 500
  // War Lynx AR [Case 271]
  phi_slash_deg: number;     // 12 [M]
  arcSpan_deg: number;       // 37 [M, wide cat-paw]
  r_outer_m: number;         // 0.022
  // WD [M] / Base [M]
  m_WD_kg: number;           // 0.014 [M]
  m_Base_kg: number;         // 0.007 [M]
}
```

---

## Case 783 — [SPECIAL MOVE] Cat Scratch: Mariah / Galux (Beyblade — Original Plastic Generation)

**Franchise Move:** Cat Scratch is the Special Move used by Mariah with Galux. Galux's beast (the War Lynx cat spirit) emerges from the beyblade and charges at the opposing beyblade before delivering a powerful slicing attack. [Beyblade — Original Plastic Generation / V-Force anime]

**Thesis:** Cat Scratch is the BeySpirit transcendence of the War Lynx AR's wide-arc slicing contact geometry (Case 782): at passive physics, the War Lynx AR's wide cat-paw smash contacts deliver sustained-arc impacts with a shallower forward angle (φ≈12°) that maximises contact duration per orbital pass — a slicing geometry rather than a percussive smash; under Mariah's War Lynx BeySpirit, this slicing geometry is amplified to a full beast-manifest charge sequence: the cat spirit externalises as an energy projection of Galux, physically separating the "beast" as a visible luminous form that charges independently of the bey's orbital path; this beast-charge is the BeySpirit's ability to direct kinetic energy in a non-orbital (straight-line) trajectory — the cat runs directly at the opponent rather than following the circular orbit that constrains the physical bey; the beast charge converts angular kinetic energy to linear: at ω₀=500 rad/s, I=4.51×10⁻⁶ kg·m², KE_rot=½×4.51×10⁻⁶×500²=0.564 J; 50% converts to beast-charge linear KE: KE_linear=0.282 J, v_charge=√(2×0.282/0.029)=√(19.4)=4.41 m/s; the "powerful slicing attack" is the wide-arc War Lynx contact at this approach velocity — the wide contact arc (35°–40° span) means the slash is sustained over a larger angular window than a point-contact smash, dragging the contact surface across the opponent's outer ring for a prolonged energy transfer; the sustained contact increases the effective spinDelta duration beyond a single-frame collision; the cat spirit visualises as a luminous golden outline of a lynx; the move is a signature of the Plastic Gen beast-spirit tradition where the spiritual form of the AR animal executes the final strike.

NOTE: special move overrides all EG/clutch mechanical state; Cat Scratch is a beast-manifest charge attack (linear approach, sustained-arc slash contact). The War Lynx wide-arc geometry is the BeySpirit-amplified gimmick.

```
Cat Scratch — phase structure:

Phase 1 — "beast_manifest" (War Lynx cat spirit emerges, ≈0.8s):
  Galux accelerates on outer orbital arc (BeySpirit orbital boost)
  KE_rot = ½ × 4.51e-6 × 500² = 0.564 J
  50% converts to beast-charge linear KE: 0.282 J
  v_charge = √(2 × 0.282 / 0.029) = 4.41 m/s
  Visual: golden luminous lynx spirit separates from Galux, crouches for charge

Phase 2 — "claw_charge" (straight-line approach at 4.41 m/s):
  War Lynx cat spirit charges directly toward opponent (non-orbital trajectory)
  Contact arc span ≈ 37° — sustained slide contact across opponent outer ring
  Contact duration ≈ longer than single-frame (wide arc)
  phi_slash = 12°, J_slash = 0.978 × J

Phase 3 — "slash_impact" (wide-arc slicing contact):
    spinDelta       = −420 rad/s  (sustained arc contact — plastic gen era high spinDelta)
    linearImpulse   = 4800 eu    (straight-line slash approach)
    damageMultiplier = 2.1×
    burstChanceBonus = +15%  (wide-arc sustained contact maximises burst-angle exposure duration)
  Visual: golden lynx claw slashes through opponent; red energy trails

  QTE — "Pounce Dodge":
    Window: 200ms from Phase 2 onset;  Input: dodge (G) or direction
    Success: beast-charge vector diverted 45°, 35% of spinDelta + impulse applied
    Fail: full slash impact

powerCost = 100;  cooldown = 4500ms
self-cost: −180 (50% KE conversion + BeySpirit boost draws heavily from Galux's own spin)
```

```typescript
// Case 783 — Cat Scratch beast-manifest charge attack
function triggerCatScratch(galux: Beyblade, target: Beyblade): void {
  // Phase 1: beast-charge energy conversion
  const KE_conv = 0.50 * 0.5 * galux.I * Math.pow(galux.spin, 2);
  const v_charge = Math.sqrt(2 * KE_conv / galux.m_kg);
  // Phase 2-3: wide-arc slash impact
  applySpinDelta(galux, -180);         // self-cost
  applySpinDelta(target, -420);
  target.damageMultiplier = 2.1;
  target.burstChanceBonus = (target.burstChanceBonus || 0) + 0.15;
  // straight-line impulse (beast charge direction = toward target)
  const dx = target.x - galux.x; const dy = target.y - galux.y;
  const dist = Math.hypot(dx, dy) || 1;
  target.vx += (dx / dist) * 4800 * IMPULSE_SCALE;
  target.vy += (dy / dist) * 4800 * IMPULSE_SCALE;
}
```

---

## Case 784 — [COMBO] Pounce Slash (↑J←)

**Beyblade:** Galux
**Combo ID:** `pounce-slash`
**Sequence:** moveUp → attack → moveLeft  (↑J←)
**Cost:** 15 power
**Type Restriction:** attack
**Part Requirement:** warLynxAR  (War Lynx AR [Case 271] wide cat-paw contact geometry required)

Pounce Slash is the combo-level expression of Cat Scratch's wide-arc slicing attack (Cases 782, 783): the moveUp (↑) represents Galux rising to the upper orbital arc — the "pounce" approach phase where the cat gathers approach momentum from above (upper arc approach provides a slightly downward contact angle at the arena midplane, analogous to a cat's pounce arc descending onto prey); the attack (J) fires the War Lynx AR's wide-arc contact at the apex of the approach trajectory — the wide cat-paw contact arc (≈37° span) engages the opponent's outer ring with more of its surface area than a standard AR at the same moment, delivering the "sustained slash" contact profile of Case 271 at combo scale (no beast-manifest, but the same wide-arc contact geometry fires); the moveLeft (←) is the post-slash exit — Galux carries through the contact and orbits left on exit, mimicking the sweep-through of a cat's paw completing its swipe; the sequence ↑J← traces the arc of a cat pouncing (up → strike → sweep left), grounded in the War Lynx AR's wide contact geometry as the physical mechanism; spinDelta=−48 (wide-arc contact at upper approach angle — the wider arc span concentrates total force over a longer contact window, yielding slightly higher spinDelta than a standard narrow-contact AR at same approach speed), damageMultiplier=1.35×, lockMs=60.

```typescript
// Combo: ["moveUp","attack","moveLeft"], cost: 15, type: "attack", part: warLynxAR
function applyPounceSlash(caster: Beyblade, target: Beyblade): void {
  // War Lynx wide-arc cat-paw contact at upper approach angle
  applySpinDelta(target, -48);
  target.damageMultiplier = 1.35;
  target.locked = true; target.lockExpiresAt = Date.now() + 60;
}
// 1.35× ≤ 1.5×; 60ms ≤ 300ms; 48 ≤ 50 rad/s; no invulnerability, no AoE [check]
```

## Case 785 — [GIMMICK] Chain Kerbeus Fortress Yard' (DB/BU System): Chain-Retraction Angular-Momentum Spin-Up, Fortress Hexagonal Eccentricity, Yard' Dash Anti-Burst, and Slope-Climb Burst Immunity

**Thesis.** Chain Kerbeus Fortress Yard' (m_total = 74.8 g, I_total = 1.833×10⁻⁵ kg·m² chains extended, ω₀ = 694 rad/s, L₀ = 1.272×10⁻² kg·m²/s) is the heaviest documented DB/BU assembly in the case library. The gimmick is a three-layer mechanical synergy: (1) BU Blade Chain's 6 rubber + 2 plastic chains retract from I_ext = 5.066×10⁻⁶ to I_ret = 3.995×10⁻⁶ kg·m² on contact with DB Core Kerbeus's smooth round perimeter — angular momentum conservation yields ω₂ = ω₁ × (I_total_ext / I_total_ret) = 694 × (1.833×10⁻⁵ / 1.726×10⁻⁵) = 694 × 1.062 = +6.2% spin-up per retraction event; (2) Forge Disc Fortress (31.1 g, hexagonal, two enlarged blades) contributes I_F = 8.476×10⁻⁶ kg·m² (46.2% of I_total) and a modest eccentricity from the C₂ asymmetry: e = 0.322 mm, F_imb = 3.607 N at ω₀ — moderate controlled imbalance that aids attack orbit while remaining below destabilising threshold; (3) Yard' Dash spring (α = 0.40) multiplies DB Core Kerbeus slope torque τ_slope = 13.0 mN·m by 1.40 to yield τ_burst_eff = 18.2 mN·m — effectively unburst-able in standard play, allowing slope-climb for Chain Break without burst-counter exposure. Spin decay: Yard' ball tip (μ_ball = 0.03, r_ball = 0.5 mm) → dω/dt_stationary = −0.599 rad/s² → theoretical t_spin = 694 / 0.599 = 1158 s; ring-scrape phase (μ_ring = 0.17, r_ring = 7 mm, movement) → dω/dt_ring = −23.8 rad/s². KE₀ = 0.5 × 1.833×10⁻⁵ × 694² = 4.413 J — highest KE of any documented plastic/MFB/God/BX/BU assembly in CS13, providing the energy reservoir for Chain Break's slope-climb.

Parts: DB Core Kerbeus [Case 462] · BU Blade Chain [Case 463] · Armor 6 [Case 464] · Forge Disc Fortress [Case 465] · Yard' [Case 466].

```
ASCII Visual Geometry — Chain Kerbeus Fortress Yard' (top view, chain states)

  Chains EXTENDED (I_ext = 5.066×10⁻⁶):        Chains RETRACTED (I_ret = 3.995×10⁻⁶):
  ┌─────────────────────────────────────────┐    ┌──────────────────────────────────────┐
  │  r=22mm  ~~chain~~●  ~~chain~~●         │    │  r=17mm  ~chain~●  ~chain~●          │
  │          ~~chain~~●  ~~chain~~●         │    │          ~chain~●  ~chain~●          │
  │     [Armor6] [Fortress 2-blade C₂]      │    │  [chains pulled inward via retract]  │
  │  2 enlarged blades @ r=20mm (C₂ asym)  │    │  ΔI = 1.071×10⁻⁶  →  +6.2% ω       │
  └─────────────────────────────────────────┘    └──────────────────────────────────────┘

  Yarn' Dash spring:  [─spring─]──[ball tip r=0.5mm]──stadium
    τ_burst = 13.0 × 1.40 = 18.2 mN·m  (unburst-able)
```

```
Physics Analysis

Assembly:
  m_total       = 74.8 g = 0.0748 kg  [Case 462-466]
  I_total_ext   = 1.833×10⁻⁵ kg·m²  (chains extended)
  I_total_ret   = 1.833×10⁻⁵ − 1.071×10⁻⁶ = 1.726×10⁻⁵ kg·m²  (chains retracted)
  ω₀            = 694 rad/s  (BU era)
  L₀            = 1.833×10⁻⁵ × 694 = 1.272×10⁻² kg·m²/s
  KE₀           = 0.5 × 1.833×10⁻⁵ × 694² = 4.413 J

Chain retraction spin-up:
  ω_ret = ω × (1.833×10⁻⁵ / 1.726×10⁻⁵) = ω × 1.062  (+6.2%)

Fortress eccentricity (ΔM=0.5g at r_asym=20mm):
  e = 0.0005 × 0.020 / 0.0311 = 3.22×10⁻⁴ m = 0.322 mm
  F_imb(694) = 0.0311 × 3.22×10⁻⁴ × 694² = 4.817 N

Yard' Dash anti-burst:
  τ_burst_eff = τ_slope × 1.40 = 13.0 × 1.40 = 18.2 mN·m

Spin decay (stationary, Yard' ball):
  dω/dt       = −0.599 rad/s²,  t_spin ≈ 1158 s (theoretical)

Spin decay (movement, ring scrape):
  dω/dt       = −23.8 rad/s²,  t_per_scrape = 694 / 23.8 = 29.2 s

Slope-climb KE (25° stadium wall, h=63.4mm):
  ΔPE = 0.0748 × 9.81 × 0.0634 = 0.04649 J
  ω_at_top = sqrt(2 × (4.413 − 0.04649) / 1.833×10⁻⁵) = sqrt(477,000) = 690.7 rad/s
```

```typescript
function chainKerbeusRetractSpinUp(omegaPre: number, iExt: number, iRet: number, iOtherParts: number): number {
  const iAssemExt = iExt + iOtherParts;
  const iAssemRet = iRet + iOtherParts;
  return omegaPre * (iAssemExt / iAssemRet);
}
// chainKerbeusRetractSpinUp(694, 5.066e-6, 3.995e-6, 1.326e-5) → 736.9 rad/s (+6.2%)
// chainKerbeusRetractSpinUp(500, 5.066e-6, 3.995e-6, 1.326e-5) → 531.0 rad/s
// chainKerbeusRetractSpinUp(694, 5.066e-6, 3.995e-6, 1.0e-5)   → 746.9 rad/s

function fortressImbalanceForce(deltaMass_g: number, rAsymm_mm: number, mF_g: number, omega_rads: number): number {
  const e = (deltaMass_g / 1000) * (rAsymm_mm / 1000) / (mF_g / 1000);
  return (mF_g / 1000) * e * omega_rads ** 2;
}
// fortressImbalanceForce(0.5, 20, 31.1, 694) → 4.817 N  (controlled imbalance)
// fortressImbalanceForce(0.5, 20, 31.1, 400) → 1.598 N  (low-spin, less imbalance)

function yardDashBurstThreshold(tauSlope_mNm: number, dashMultiplier: number): number {
  return tauSlope_mNm * dashMultiplier;
}
// yardDashBurstThreshold(13.0, 1.40) → 18.2 mN·m  (effectively unburst-able)
// yardDashBurstThreshold(13.0, 1.00) → 13.0 mN·m  (non-Dash Yard baseline)
```

---

## Case 786 — [SPECIAL] Chain Break: Slope-Climb Potential-Energy Accumulation, Chain-Barrier Formation, and BeySpirit-Amplified Gravity Dive Crash

**Franchise move.** Chain Break — after climbing the slope of the Beystadium, Chain Kerbeus creates a chain barrier around itself and rushes down to crash with the opposing Beyblade. Move used by Lain Valhalla with Chain Kerbeus Fortress Yard'. The slope-climb converts kinetic energy into gravitational potential energy; chain retraction (+6.2% spin-up, Case 785) during wall contact preserves angular momentum; BeySpirit ignites the descent into a gravitational dive exceeding physical terminal velocity.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Phase 1 — slope_climb:** Chain Kerbeus climbs the 25° stadium bowl wall to h = 0.0634 m. Physical PE gained: ΔPE = 0.04649 J. Chain retraction occurs at wall contact → ω rises by +6.2% to 737 rad/s (BeySpirit amplified, 0.0634 m height reached before descent).

**Phase 2 — chain_barrier:** All 6 rubber + 2 plastic chains extend to r_chain = 22 mm forming a full radial barrier. Duration: 800 ms. Barrier absorbs incoming attacks during the hold phase: any collision impulse is reduced by 40% (chain elastic absorption). Chain Kerbeus self-spin maintained via Yard' ball tip (dω/dt = −0.599 rad/s², negligible over 0.8 s).

**Phase 3 — gravity_dive_crash:** BeySpirit amplification factor × 4.0 applied to physical fall velocity. Physical: v_fall = sqrt(2 × 9.81 × 0.0634) = 1.115 m/s. BeySpirit dive: v_crash = 1.115 × 4.0 = 4.46 m/s. Chain retraction at impact: I_total drops from 1.833×10⁻⁵ to 1.726×10⁻⁵ → ω surges +6.2% at moment of contact, adding spin-steal leverage. Burst bonus: chain contact engages opponent's burst tabs directly (+20% burst probability on target).

```
Crash Impulse:
  J_crash = m × v × (1 + COR) = 0.0748 × 4.46 × 1.50 = 0.501 N·s
  spinDelta     = −390  (chain retraction spin-steal at impact)
  linearImpulse = 5500 eu
  dmgMult       = 1.9×
  burstBonus    = +20% burst probability on target

Self-cost:   −180 spin
powerCost:   100
cooldown:    4500 ms
QTE:         "Chain Barrier" — press J during phase 2 (350 ms window) to lock chains
             at maximum radius; miss → chains partially retracted at impact (−25% spinDelta)
```

```typescript
interface ChainBreakResult {
  vCrash_ms:       number;
  retractSpinBonus: number;
  crashImpulse_Ns: number;
  spinDelta:       number;
  linearImpulse:   number;
  dmgMult:         number;
}

function chainBreakCrash(
  m_kg: number, hClimb_m: number, bsAmp: number,
  omegaPre: number, iExt: number, iTotal: number, COR: number
): ChainBreakResult {
  const vPhys = Math.sqrt(2 * 9.81 * hClimb_m);
  const vCrash = vPhys * bsAmp;
  const iRet = iTotal - (iExt - (iExt * (3.995 / 5.066)));
  const spinBonus = (iTotal / iRet) - 1;
  const impulse = m_kg * vCrash * (1 + COR);
  return {
    vCrash_ms: vCrash, retractSpinBonus: spinBonus,
    crashImpulse_Ns: impulse, spinDelta: -390, linearImpulse: 5500, dmgMult: 1.9
  };
}
// chainBreakCrash(0.0748, 0.0634, 4.0, 694, 5.066e-6, 1.833e-5, 1.5)
//   → { vCrash:4.46, spinBonus:0.062, impulse:0.501, spinDelta:-390 }
// chainBreakCrash(0.0748, 0.0634, 3.0, 694, 5.066e-6, 1.833e-5, 1.5)
//   → { vCrash:3.35, spinDelta:-390 }  — lower BeySpirit
```

---

## Case 787 — [COMBO] Chain Strike: BU Blade Chain Retraction-Momentum Lateral Approach Burst-Pressure

**Combo.** Chain Strike (→↑J): BU Blade Chain's elastic rubber chain retraction mechanism (Case 463) provides the physical basis — approach from the right flank (→), swing upward into opponent's burst-tab elevation (↑), then contact strike (J) at the moment chains retract inward, coupling the retraction angular-momentum transfer into the opponent's layer.

```
Combo Registry Entry:
  id:            "chain-strike"
  name:          "Chain Strike"
  sequence:      [moveRight, moveUp, attack]
  part:          buBladeChain            // requires BU Blade Chain on the bey
  type:          universal
  cost:          15
  windowMs:      600
  cooldownMs:    3500
  effect:
    spinDelta:   −42                     // chain retraction spin-steal contact
    dmgMult:     1.28×
    lockMs:      45

Ceiling check: 1.28× ≤ 1.5× ✓; 45ms ≤ 300ms ✓; −42 ≤ 50 ✓; no invulnerability ✓; no AoE ✓; no full spin recovery ✓
```

```typescript
const chainStrikeCombo: ComboRegistryEntry = {
  id: "chain-strike", name: "Chain Strike",
  sequence: ["moveRight", "moveUp", "attack"],
  part: "buBladeChain",
  type: "universal", cost: 15, windowMs: 600, cooldownMs: 3500,
  effect: { spinDelta: -42, dmgMult: 1.28, lockMs: 45 },
};
// Activation: sliding-3 input window; detects chain retraction gimmick part;
// ω ≥ 15% threshold; per-combo cooldown respected.
// Ceiling: dmgMult 1.28 ≤ 1.5 ✓  lockMs 45 ≤ 300 ✓  spinDelta 42 ≤ 50 ✓
```

---

## Case 788 — [GIMMICK] Burning Cerberus Ten Wide Cross Attack Customize Bearing Base (Plastic Generation): Triple Attacker Three-Head Attack Geometry, Cross Attack SP Triangular Recoil Distribution, and CBB Zombie-Platform Upper-Attack Resistance

**Thesis.** Burning Cerberus (Leon Zagart / Zeo Zagart) in stock configuration: Triple Attacker AR [Case 153] + Ten Wide WD [Case 154] + Neo Right SG DB [Cases 155–156, ~6.0 g [M]] + Cross Attack SP [Case 157] + Customize Bearing Base [Case 158]. Assembly [M]: m_total ≈ 31.6 g, I_total ≈ 1.061×10⁻⁵ kg·m² [M], ω₀ = 500 rad/s (plastic gen), L₀ ≈ 5.305×10⁻³ kg·m²/s [M], KE₀ = 0.5 × 1.061×10⁻⁵ × 500² ≈ 1.326 J [M]. The gimmick is Triple Attacker's three-head attack geometry: Head A (Wolborg 2 analog, upper-left) θ_A = 23°/38° dual-face providing C_upper = sin(23°) = 0.391 at leading edge and C_upper = sin(38°) = 0.616 at deeper engagement; Head B (Flash Leopard 2 analog, right-direct) force-smash θ_B = 28° → C_smash = cos(28°) = 0.883; Head C (Voltaic Ape analog, blue head, spike) α_C = 28° thinned leading tip → outer-diagonal penalty applies (contact shifts contact inward) but the spike concentrates stress: σ_tip = F_contact / A_tip. 360°/3 = 120° between heads; simultaneous dual-head engagement (contact angle < 120°) produces a contact-chain effect multiplying impulse by ≈1.12 (two sequential impacts within a single collision event). Cross Attack SP (α = 80°, J_smash = 0.174J, J_recoil = 0.985J, Case 157) provides near-total radial recoil rather than smash — in the anime this is the chain-tether anchor point (BeySpirit override uses the SP protrusions as chain-attachment points). CBB smooth shell resists upper attack (J_vertical = 0.30J vs 0.383J for flat-ledge base, −22%, Case 158) while providing the zombie-spin platform for Setup 1.

**Note:** Neo Right SG DB assembly (Cases 155–156) and CBB (Case 158) are documented in CS3. All [M] values carry ±15% uncertainty. Triple Attacker AR from Case 153. Ten Wide WD from Case 154. Cross Attack SP from Case 157.

```
ASCII Visual Geometry — Triple Attacker Three-Head Layout (top view, RS)

        Head A (upper) θ=23°/38°             Head B (force smash) θ=28°
           ╱↗ contact arc ≈ 30°               ━━ contact face, C_smash=0.883
          ╱
  ──────[AR]──────
          ╲                      Head C (blue spike) α=28°, thin tip
           ╲⟋ r_outer=28mm [Case 153]       ● stress-concentrated contact

  Dual-head simultaneous engagement (arc < 120°):
    J_chain ≈ 1.12 × J_single  (two sequential impacts, single collision)

  Cross Attack SP:  ▲◀▶▼ four radial tips at r=25mm [Case 157]
    Recoil: 0.985J  — anime chain-anchor point (BeySpirit override)
```

```
Physics Analysis [M where noted]

Assembly:
  Triple Attacker AR [Case 153]:  m=5.8g,   I_TA=2.840×10⁻⁶ kg·m²
  Ten Wide WD        [Case 154]:  m=14.0g,  I_TW=4.920×10⁻⁶ kg·m²
  Neo Right SG DB    [M]:         m≈6.0g,   I_SG≈1.50×10⁻⁷ kg·m²  [M]
  Cross Attack SP    [Case 157]:  m=1.58g,  I_CA=9.88×10⁻⁷ kg·m²
  CBB                [Case 158]:  m=4.2g,   I_CBB=1.71×10⁻⁶ kg·m²
  ─────────────────────────────────────────────────────────────────
  Total:                          m≈31.6g [M], I≈1.061×10⁻⁵ kg·m² [M]
  ω₀ = 500 rad/s,  KE₀ ≈ 1.326 J [M]

Head B force-smash (θ=28°):
  C_smash = cos(28°) = 0.883,  C_recoil = sin(28°) = 0.469
  I_TA / I_total = 2.840×10⁻⁶ / 1.061×10⁻⁵ = 26.8%

CBB upper-attack absorption (Case 158):
  J_vertical_CBB = 0.30J  vs  flat base 0.383J  (−22%)
  I_CBB / I_total = 1.71×10⁻⁶ / 1.061×10⁻⁵ = 16.1%

Double-bearing zombie τ_transmitted (Cases 155–156):
  τ_coupling ≈ 2 × μ_b × F_axial × r_b = 2.4×10⁻⁶ N·m  (near-zero spin steal)
```

```typescript
function burningCerberusAssembly(): {
  mTotal_g: number; iTotal: number; omega0: number; ke0_J: number
} {
  const iTA  = 2.840e-6;  // Case 153
  const iTW  = 4.920e-6;  // Case 154
  const iSG  = 1.50e-7;   // [M] Neo Right SG DB
  const iCA  = 9.88e-7;   // Case 157
  const iCBB = 1.71e-6;   // Case 158
  const iTotal = iTA + iTW + iSG + iCA + iCBB;
  const mTotal = (5.8 + 14.0 + 6.0 + 1.58 + 4.2) / 1000;
  const omega0 = 500;
  return { mTotal_g: mTotal * 1000, iTotal, omega0, ke0_J: 0.5 * iTotal * omega0 ** 2 };
}
// burningCerberusAssembly() → { m:31.6g, I:1.061e-5, ω₀:500, KE:1.326J } [M]

function tripleAttackerDualHeadImpact(jSingle: number): number {
  return jSingle * 1.12;  // dual-head chain bonus
}
// tripleAttackerDualHeadImpact(0.883) → 0.989  (≈ full collision impulse when 2 heads engage)
// tripleAttackerDualHeadImpact(0.500) → 0.560
```

---

## Case 789 — [SPECIAL] Chain Flame: Proximity Tether Flame DoT, Sustained Spin-Drain, and 6.66-Second Bit-Beast Theft Penalty

**Franchise move.** Chain Flame (烈火鎖縛, Rekka Sabaku) — Leon Zagart's Burning Cerberus attaches spectral flame-chains to the opponent bey, dealing damage continuously; if proximity is maintained for 6.66 seconds, the bit beast is stolen for 15 seconds. Requires both beys within 10 units continuously; chain breaks if opponent escapes range.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Phase 1 — chain_tether_attach (≤ 10 units range):**
BeySpirit projects flame-chains from Cross Attack SP protrusions to opponent at r ≤ 10 units. forceState = "chain_tether". Cerberus flame-aura activates.

**Phase 2 — proximity_burn (while within 10 units, tick-based):**
- Opponent: spinDecayRate × 1.5 per second (flame drain)
- Opponent: spinDelta = −48 per second of sustained proximity (−0.8/tick at 60 Hz)
- Self: spinDecayRate × 1.1 per second (maintaining flame costs energy)
- If opponent exits 10-unit range → chain_break: all effects stop immediately, bit-beast theft does NOT trigger

**Phase 3 — bit_beast_theft (triggered if proximity sustained ≥ 6.66 s):**
- Condition: continuous proximity ≥ 6.66 s without chain break
- Effect on opponent: "bit_beast_stolen" debuff for 15,000 ms
  - No SP earned during debuff window
  - Cannot counter-activate specials for 15 s (next special queued but blocked)
- Self: spinDelta = −80 (bit-beast pull drains Cerberus)
- Visual: opponent bit-beast aura extinguishes; Cerberus double-flames

```
Sustained DoT summary (full 6.66 s):
  Opponent spinDelta (sustained): −0.8/tick × 60 × 6.66 = −320 rad/s
  Plus theft activation:          −0 (to opponent),  −80 (to self)
  Effective total drain on opponent: −320 rad/s accumulated
  Bit-beast debuff duration:      15,000 ms

Chain break (opponent escapes 10 units):
  All effects cease; proximity timer resets to 0

Self-cost:   −120 total (sustained drain −40 + theft −80)
powerCost:   100
cooldown:    7000 ms  (longer due to 6.66 s active phase)
QTE:         "Flame Hold" — hold J for the tether phase to prevent self-spin loss
             (hold reduces self spinDecayRate × 1.1 to × 1.05)
```

```typescript
interface ChainFlameState {
  proximityTimer_s:    number;   // resets if opponent exits 10 units
  chainActive:         boolean;
  bitBeastStolen:      boolean;
  stolenTimer_ms:      number;
}

function chainFlameTickUpdate(
  state: ChainFlameState, inRange: boolean, dt_s: number
): { opponentSpinDelta: number; selfSpinDelta: number; newState: ChainFlameState } {
  if (!inRange) {
    return { opponentSpinDelta: 0, selfSpinDelta: 0,
             newState: { ...state, proximityTimer_s: 0, chainActive: false } };
  }
  const newTimer = state.proximityTimer_s + dt_s;
  const opDelta  = -0.8 * dt_s * 60;     // −0.8 per tick
  const selfDelta = -1.0 * dt_s;          // self sustained drain
  const stolen   = newTimer >= 6.66 && !state.bitBeastStolen;
  return {
    opponentSpinDelta: opDelta + (stolen ? 0 : 0),
    selfSpinDelta:     selfDelta + (stolen ? -80 : 0),
    newState: { chainActive: true, proximityTimer_s: newTimer,
                bitBeastStolen: state.bitBeastStolen || stolen,
                stolenTimer_ms: stolen ? 15000 : state.stolenTimer_ms }
  };
}
// dt=1/60, inRange=true, 6.66s continuous → bitBeastStolen=true at t=6.66s
// dt=1/60, inRange=false at t=4.0s → chainActive=false, proximityTimer=0, no theft
```

---

## Case 790 — [SPECIAL] Chain Storm: Spectral-Chain Orbital Energy Accumulation, Cerberus Beast-Flame Manifestation, and QTE-Controlled Ring-Out Crash

**Franchise move.** Chain Storm (疾風鎖縛, Shippū Sabaku) — Zeo Zagart / Leon Zagart summon Cerberus amidst a storm; cybernetic energy from Zeo's implants charges Burning Cerberus; spectral chains orbit the bey igniting in purple flame; Cerberus beast erupts in orange flame; full-speed crash with ring-out potential. QTE controls final power output.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Phase 1 — chain_orbital_charge (800 ms):**
BeySpirit manifests spectral orbital chains at r_orbit = 43 mm (r_bey + 15 mm). Chain orbital speed: v_tip = r_orbit × ω = 0.043 × 500 = 21.5 m/s (BeySpirit amplified — physical Cross Attack SP tip speed would be 0.025 × 500 = 12.5 m/s). Accumulated orbital KE (anime physics, expanded chain mass × 3.0): KE_chain = 0.5 × (0.00158 × 3.0) × (r_orbit × ω)² = 0.5 × 0.00474 × 21.5² = 1.095 J — adds to physical KE₀ = 1.326 J → total charge = 2.421 J.

**Phase 2 — storm_crash (QTE-controlled):**
QTE prompt: press J within 400 ms window ("Storm Crash" indicator).
- Perfect (within 100 ms): 100% power
- Good (100–250 ms): 80% power  
- Late/miss: 55% power (auto-release)

Full-power crash:
```
  v_crash = sqrt(2 × 2.421 / 0.0316) = sqrt(153.2) = 12.38 m/s  [BeySpirit amplified]
  J_crash = 0.0316 × 12.38 × 1.5 = 0.587 N·s
  spinDelta     = −380
  linearImpulse = 5500 eu  (ring-out threat when < 15 units from wall)
  dmgMult       = 2.0×
  ringOutBonus:   true — if opponent within 15 units of wall boundary at impact,
                  ring-out auto-triggers (Survivor Finish also if ω_opp < 15 rad/s post-impact)

Self-cost:   −160
powerCost:   100
cooldown:    5000 ms
QTE:         "Storm Crash" — J in 400 ms window; 3-tier power output
```

```typescript
function chainStormPower(qteMs: number, keCharge_J: number, mTotal_kg: number, COR: number): {
  vCrash: number; spinDelta: number; linearImpulse: number; dmgMult: number; power_pct: number
} {
  const power = qteMs <= 100 ? 1.0 : qteMs <= 250 ? 0.80 : 0.55;
  const vCrash = Math.sqrt(2 * keCharge_J * power / mTotal_kg);
  const spinD  = Math.round(-380 * power);
  const limp   = Math.round(5500 * power);
  const dmg    = 1.0 + (2.0 - 1.0) * power;
  return { vCrash, spinDelta: spinD, linearImpulse: limp, dmgMult: dmg, power_pct: power * 100 };
}
// chainStormPower(80,  2.421, 0.0316, 1.5) → { v:12.38, spinDelta:−380, limp:5500, dmg:2.0, pct:100% }
// chainStormPower(200, 2.421, 0.0316, 1.5) → { v:11.08, spinDelta:−304, limp:4400, dmg:1.80, pct:80% }
// chainStormPower(350, 2.421, 0.0316, 1.5) → { v:8.17,  spinDelta:−209, limp:3025, dmg:1.55, pct:55% }
```

---

## Case 791 — [SPECIAL] Chain Thunder: Blue-Head Spike Electric Smash Chains, Three-Hit Chain Lightning, and Shock Status

**Franchise move.** Chain Thunder (迅雷鎖縛, Jinrai Sabaku) — Leon Zagart's manga-exclusive special; chain-shaped electricity manifests from the blue Cerberus head (Voltaic Ape analog, Head C, Case 153: spike α_C = 28°, concentrated-stress contact), delivering repeated smash attacks. The blue head specialises in Smash Attacks — Chain Thunder draws power specifically from this head's thin-tipped spike geometry.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Phase 1 — electric_chain_manifest (400 ms):** BeySpirit channels chain-lightning through the Voltaic Ape spike. v_charge = sqrt(2 × 0.50 × 1.326 / 0.0316) = sqrt(41.96) = 6.48 m/s [M]. Electric arc branches from Head C outward, tracing chain-link pattern.

**Phase 2 — three_hit_chain (auto, sequential):**
Each hit uses the blue-head spike contact geometry (α_C = 28°, outer-diagonal, stress concentration):
- Hit 1 (initial spike):   spinDelta = −90,  linearImpulse = 1200 eu, dmgMult = 1.3×
- Hit 2 (chain rebound):   spinDelta = −80,  linearImpulse = 1000 eu, dmgMult = 1.3×
- Hit 3 (thunder surge):   spinDelta = −120, linearImpulse = 1400 eu, dmgMult = 1.5×
  Chain_shock status per hit: 30% chance → opponent movement speed −20% for 500 ms (stackable; 3 hits ≈ near-certain)

Total if all 3 land:
```
  spinDelta:     −290
  linearImpulse: 3600 eu
  Peak dmgMult:  1.5× (Hit 3)

  chain_shock probability (≥1 stack):  1 − 0.70³ = 0.657  (65.7% from 3 hits)

Self-cost:   −130
powerCost:   100
cooldown:    4500 ms
QTE:         none — auto three-hit chain (no player input required after activation)
```

```typescript
function chainThunderHits(hitCount: number): { totalSpinDelta: number; totalImpulse: number; shockProb: number } {
  const hits = [
    { spin: -90,  imp: 1200, dmg: 1.3, shockChance: 0.30 },
    { spin: -80,  imp: 1000, dmg: 1.3, shockChance: 0.30 },
    { spin: -120, imp: 1400, dmg: 1.5, shockChance: 0.30 },
  ].slice(0, hitCount);
  const totalSpin  = hits.reduce((s, h) => s + h.spin, 0);
  const totalImp   = hits.reduce((s, h) => s + h.imp, 0);
  const noShockProb = hits.reduce((p, h) => p * (1 - h.shockChance), 1.0);
  return { totalSpinDelta: totalSpin, totalImpulse: totalImp, shockProb: 1 - noShockProb };
}
// chainThunderHits(3) → { spinDelta:−290, impulse:3600, shockProb:0.657 }
// chainThunderHits(2) → { spinDelta:−170, impulse:2200, shockProb:0.510 }
// chainThunderHits(1) → { spinDelta:−90,  impulse:1200, shockProb:0.300 }
```

---

## Case 792 — [COMBO] Three-Head Slash: Triple Attacker Blue-Head Spike Contact Combo

**Combo.** Three-Head Slash (↑J→): approach from upper lane (↑), strike with attack (J), follow through rightward (→) — the sequence mimics Head C's (blue Voltaic Ape spike) approach vector from above and to the right. Part requirement: tripleAttackerAR. The blue head's thinned spike delivers the concentrated-stress smash contact in the combo frame.

```
Combo Registry Entry:
  id:            "three-head-slash"
  name:          "Three-Head Slash"
  sequence:      [moveUp, attack, moveRight]
  part:          tripleAttackerAR       // requires Triple Attacker AR on the bey
  type:          attack
  cost:          25
  windowMs:      600
  cooldownMs:    4000
  effect:
    spinDelta:   −45                    // blue-head spike smash, stress-concentrated
    dmgMult:     1.35×
    lockMs:      55

Ceiling check: 1.35× ≤ 1.5× ✓; 55ms ≤ 300ms ✓; −45 ≤ 50 ✓; no invulnerability ✓; no AoE ✓; no full spin recovery ✓
```

```typescript
const threeHeadSlashCombo: ComboRegistryEntry = {
  id: "three-head-slash", name: "Three-Head Slash",
  sequence: ["moveUp", "attack", "moveRight"],
  part: "tripleAttackerAR",
  type: "attack", cost: 25, windowMs: 600, cooldownMs: 4000,
  effect: { spinDelta: -45, dmgMult: 1.35, lockMs: 55 },
};
// Activation: tripleAttackerAR must be on the bey; sliding-3 window; ω ≥ 15% threshold.
// Ceiling: dmgMult 1.35 ≤ 1.5 ✓  lockMs 55 ≤ 300 ✓  spinDelta 45 ≤ 50 ✓
```

---

## Case 793 — [GIMMICK] Grand Capricorn 145D [M]: Heavy Full-Metal Wheel Horn Smash Geometry, D Tip Center-Holding Defense Stamina, and Stable Dual-Mode Platform for Three-Phase Special

**Thesis.** Grand Capricorn 145D (Klaus, MFB Metal Masters) [all values M — not yet in the case library; ±15% uncertainty]. Grand Capricorn Wheel [M]: ~40 g, full zinc-alloy construction, pronounced curved horn protrusions on both sides of the wheel, visual motif consistent with Capricorn/ibex horns, r_outer ≈ 23 mm. Annular inertia: I_GC = ½ × 0.040 × (0.005² + 0.023²) = ½ × 0.040 × (2.5×10⁻⁵ + 5.29×10⁻⁴) = ½ × 0.040 × 5.54×10⁻⁴ = 1.108×10⁻⁵ kg·m² [M]. 145 Track [M]: ~1.4 g, standard 14.5 mm height, no mechanical gimmick; I_145 ≈ 4.76×10⁻⁸ kg·m² (negligible). D Tip [M]: ~0.7 g, small smooth plastic point, r_D ≈ 1.5 mm, μ_D ≈ 0.12; I_D negligible. Assembly [M]: m ≈ 42.1 g, I ≈ 1.108×10⁻⁵ kg·m² [M] (wheel dominates at 99.6%), ω₀ = 600 rad/s (MFB era), L₀ = 6.648×10⁻³ kg·m²/s [M], KE₀ = 1.994 J [M]. D tip spin decay: dω/dt = −(0.12 × 0.0421 × 9.81 × 0.0015) / 1.108×10⁻⁵ = −8.38 rad/s² [M] → t_spin = 600 / 8.38 = 71.6 s [M] (defense-type endurance). Horn attack geometry [M]: two primary curved horns at r_horn ≈ 22 mm with θ_horn ≈ 28° from orbital tangent, C_smash = cos(28°) = 0.883; contact arc ≈ 30° per horn [M] → total attack coverage ≈ 60°. The defense+smash hybrid identity: center-holding D tip locks the bey to bowl center while high-I wheel resists spin steal, but horn geometry gives opportunistic heavy smash when opponent drifts close. This is the stable dual-mode platform enabling Claw of the Storm's three sub-moves from a predictable launch position.

```
ASCII Visual Geometry — Grand Capricorn Wheel [M] (top view)

        r=23mm [M]
   ____________________________
  /  _______________________  \
 / /     ╱horn╲   ╱horn╲    \ \  ← two curved horn protrusions at r≈22mm [M]
| |   ╱╱       ╲╱       ╲╲   | |  θ_horn≈28° from tangent → C_smash=0.883
| |  ╱   curved goat-horn    ╲  | |  attack arc ≈30° per horn [M]
 \ \_____________________________/ /
  \______________________________/
    D tip at center (r=1.5mm [M])
    center-holding: D tip anchors to bowl center
```

```
Physics Analysis [M]

m_GC [M]   = 40.0 g = 0.0400 kg   (full zinc-alloy wheel)
r_i = 5mm,  r_o = 23mm [M]

I_GC [M]   = ½ × 0.040 × (0.005² + 0.023²) = 1.108×10⁻⁵ kg·m²

Assembly [M]:
  m_total   ≈ 42.1 g = 0.0421 kg  (wheel + 145 track + D tip)
  I_total   ≈ 1.108×10⁻⁵ kg·m²  (wheel dominates 99.6%)
  ω₀        = 600 rad/s
  KE₀       ≈ 1.994 J [M]

D tip decay [M] (μ=0.12, r_D=1.5mm):
  dω/dt     = −8.38 rad/s² [M]
  t_spin    ≈ 71.6 s [M]

Horn smash geometry [M]:
  r_horn    ≈ 22 mm,  θ_horn ≈ 28°
  C_smash   = cos(28°) = 0.883
  arc/horn  ≈ 30° → total coverage ≈ 60° (two horns)
```

```typescript
function grandCapricornAssembly(): {
  iWheel: number; iTotal: number; mTotal_g: number; omega0: number; ke0_J: number
} {
  const mWheel = 0.040;   // [M]
  const ri = 0.005; const ro = 0.023;  // [M]
  const iWheel = 0.5 * mWheel * (ri ** 2 + ro ** 2);
  const mTotal = 0.0421;  // [M]
  const omega0 = 600;
  return { iWheel, iTotal: iWheel, mTotal_g: mTotal * 1000, omega0, ke0_J: 0.5 * iWheel * omega0 ** 2 };
}
// grandCapricornAssembly() → { iWheel:1.108e-5, iTotal:1.108e-5, m:42.1g, ω₀:600, KE:1.994J } [M]

function grandCapricornHornSmash(theta_deg: number, j_collision: number): { jSmash: number; jRecoil: number } {
  const rad = theta_deg * Math.PI / 180;
  return { jSmash: j_collision * Math.cos(rad), jRecoil: j_collision * Math.sin(rad) };
}
// grandCapricornHornSmash(28, 1.0) → { jSmash:0.883, jRecoil:0.469 } [M]
// grandCapricornHornSmash(28, 0.5) → { jSmash:0.441, jRecoil:0.235 }
```

---

## Case 794 — [SPECIAL] Claw of the Storm (Erster / Zweiter / Dritter): Three-Sub-Move Randomised QTE Special, Head-On Charge, Aerial Crush, and Air-Launch Strike

**Franchise move.** Claw of the Storm (シュトゥルムナゲル, Sturmnagel) — Klaus's Grand Capricorn 145D. Three sub-moves in randomised order (Klaus does not always use them sequentially — game replicates this with a random shuffle each activation). Player sees current sub-move label + QTE prompt; missing a QTE causes that sub-move to fire at 30% base stats. First three-part special in CS13.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Sub-move A — Erster (Head-On Charge):**
Grand Capricorn lowers horns and charges directly at the opponent at maximum speed. BeySpirit channels into both horn contacts simultaneously.
E_erster = 0.35 × KE₀ = 0.35 × 1.994 = 0.698 J [M]
v_erster = sqrt(2 × 0.698 / 0.0421) = sqrt(33.16) = 5.76 m/s [M]
QTE: press J (single, 350 ms window — "Erster")

**Sub-move B — Zweiter (Aerial Crush from Above):**
Grand Capricorn climbs the bowl wall and crushes down onto the opponent from above. BeySpirit amplifies the descent force × 2.5.
h_air = 0.15 m [M, BeySpirit amplified height]
v_crush_phys = sqrt(2 × 9.81 × 0.15) = 1.716 m/s
v_crush_bs   = 1.716 × 2.5 = 4.29 m/s [M, anime]
QTE: press ↑J (two-key, 300 ms window — "Zweiter")

**Sub-move C — Dritter (Air Launch Strike):**
The most powerful sub-move. Grand Capricorn builds maximum speed and strikes with enough force to send the opponent airborne.
E_dritter = 0.55 × KE₀ = 0.55 × 1.994 = 1.097 J [M]
v_dritter = sqrt(2 × 1.097 / 0.0421) = sqrt(52.09) = 7.22 m/s [M]
QTE: press J→J (two-key sequence, 400 ms window — "Dritter")

```
Sub-move stats (full QTE hit):

  Erster  [M]:  spinDelta=−170, linearImpulse=2200 eu, dmgMult=1.55×
  Zweiter [M]:  spinDelta=−190, linearImpulse=1800 eu, dmgMult=1.65×, beyTiltBonus=+20° on target
  Dritter [M]:  spinDelta=−240, linearImpulse=2900 eu, dmgMult=1.85×, beyTiltBonus=+35° on target

All three land (any order, all QTEs hit):
  Total spinDelta      = −170 + −190 + −240 = −600
  Total linearImpulse  = 6900 eu
  Peak phase dmgMult   = 1.85× (Dritter)

Miss QTE for a sub-move → that phase fires at 30% base:
  Erster miss:   spinDelta=−51,  linearImpulse=660 eu
  Zweiter miss:  spinDelta=−57,  linearImpulse=540 eu
  Dritter miss:  spinDelta=−72,  linearImpulse=870 eu

Random order:     shuffled at activation (any of 6 permutations equally likely)
Self-cost total:  −200 (distributed: −60 Erster, −70 Zweiter, −70 Dritter)
powerCost:        100
cooldown:         8000 ms
```

```typescript
type ClawSubMove = "erster" | "zweiter" | "dritter";

const clawSubMoves: Record<ClawSubMove, {
  spinDelta: number; linearImpulse: number; dmgMult: number;
  beyTiltBonus?: number; qteSelfCost: number; qteWindowMs: number; qteKeys: string[]
}> = {
  erster:  { spinDelta: -170, linearImpulse: 2200, dmgMult: 1.55,                  qteSelfCost: -60, qteWindowMs: 350, qteKeys: ["attack"] },
  zweiter: { spinDelta: -190, linearImpulse: 1800, dmgMult: 1.65, beyTiltBonus: 20, qteSelfCost: -70, qteWindowMs: 300, qteKeys: ["moveUp","attack"] },
  dritter: { spinDelta: -240, linearImpulse: 2900, dmgMult: 1.85, beyTiltBonus: 35, qteSelfCost: -70, qteWindowMs: 400, qteKeys: ["attack","moveRight","attack"] },
};

function clawOfTheStormActivate(): ClawSubMove[] {
  const moves: ClawSubMove[] = ["erster","zweiter","dritter"];
  // Fisher-Yates shuffle
  for (let i = moves.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [moves[i], moves[j]] = [moves[j], moves[i]];
  }
  return moves;  // random permutation — Klaus's unpredictable order
}

function clawSubMoveResult(move: ClawSubMove, qteHit: boolean): { spinDelta: number; linearImpulse: number; dmgMult: number } {
  const base = clawSubMoves[move];
  const mult = qteHit ? 1.0 : 0.30;
  return {
    spinDelta:     Math.round(base.spinDelta     * mult),
    linearImpulse: Math.round(base.linearImpulse * mult),
    dmgMult:       1.0 + (base.dmgMult - 1.0) * mult,
  };
}
// clawSubMoveResult("dritter", true)  → { spinDelta:−240, limp:2900, dmg:1.85 }
// clawSubMoveResult("dritter", false) → { spinDelta:−72,  limp:870,  dmg:1.255 }
// clawSubMoveResult("erster",  true)  → { spinDelta:−170, limp:2200, dmg:1.55  }
```

---

## Case 795 — [COMBO] Horn Charge: Grand Capricorn Dual-Horn Approach Smash Combo

**Combo.** Horn Charge (↑↑J): double-upward approach (↑↑) builds the horn-contact elevation needed for Grand Capricorn's curved protrusions to contact at θ_horn ≈ 28°; final attack (J) delivers the smash as the horns pass through the opponent's layer. Two-horn simultaneous geometry gives slightly wider contact window than single-protrusion ARs.

```
Combo Registry Entry:
  id:            "horn-charge"
  name:          "Horn Charge"
  sequence:      [moveUp, moveUp, attack]
  part:          grandCapricornWheel    // requires Grand Capricorn wheel on the bey [M]
  type:          attack
  cost:          15
  windowMs:      600
  cooldownMs:    3500
  effect:
    spinDelta:   −44                    // dual-horn contact, C_smash=0.883 [M]
    dmgMult:     1.32×
    lockMs:      55

Ceiling check: 1.32× ≤ 1.5× ✓; 55ms ≤ 300ms ✓; −44 ≤ 50 ✓; no invulnerability ✓; no AoE ✓; no full spin recovery ✓
```

```typescript
const hornChargeCombo: ComboRegistryEntry = {
  id: "horn-charge", name: "Horn Charge",
  sequence: ["moveUp", "moveUp", "attack"],
  part: "grandCapricornWheel",  // [M]
  type: "attack", cost: 15, windowMs: 600, cooldownMs: 3500,
  effect: { spinDelta: -44, dmgMult: 1.32, lockMs: 55 },
};
// Ceiling: dmgMult 1.32 ≤ 1.5 ✓  lockMs 55 ≤ 300 ✓  spinDelta 44 ≤ 50 ✓
```

---

## Case 796 — [GIMMICK] Venom/Erase Devolos Vanguard Bullet (Gatinko Layer System): Detachable Satellite Mechanism, Pre/Post-Detachment Friction Regime Switch, and 213-Millisecond Dual-Body Attack Window

**Thesis.** Venom Devolos Vanguard Bullet / Erase Devolos Vanguard Bullet (Delta Zakuro, Beyblade Burst GT) use the same Vanguard disc + Bullet Performance Tip assembly across both variants; the Venom/Erase distinction lies in the chip and layer base. Stock assembly (Erase variant): Gatinko Chip Diabolos [Case 481] + Layer Base Erase [Case 482] + Forge Disc Vanguard [Case 483] + Bullet Performance Tip [Case 484]. Assembly: m_total = 66.5 g, I_total = 9.846×10⁻⁶ kg·m², ω₀ = 650 rad/s (Burst GT/Gatinko era), L₀ = 9.846×10⁻⁶ × 650 = 6.400×10⁻³ kg·m²/s, KE₀ = 0.5 × 9.846×10⁻⁶ × 650² = 2.079 J. The gimmick is the Bullet Performance Tip's detachable satellite (m_sat = 5.4 g, I_sat = 1.323×10⁻⁷ kg·m², r_attach = 7 mm): hard impact (opponent linearImpulse > threshold) detaches the satellite, triggering a regime switch — pre-detachment μ = 0.65 (aggressive rubber flat, dω/dt_pre = −115.1 rad/s², t_battle = 3.61 s) changes to post-detachment μ = 0.35 (dω/dt_post = −56.1 rad/s², t_battle = 7.42 s). The satellite, once free, spins independently with dω/dt_sat = −2804 rad/s² and halts in 213 ms — a brief dual-body attack window where both main bey and satellite are spinning simultaneously. Ruling: satellite is treated as a Revive Armor analog (part of the assembly) — satellite stopping while the main body still spins does not constitute a loss. Forge Disc Vanguard LAD: low-lying skirt contacts stadium at θ = 5° tilt → r_LAD = 22.1 mm, excellent early-onset LAD performance matching 00/10Wall class. Vanguard I share = 6.625×10⁻⁶ / 9.846×10⁻⁶ = 67.3% — disc dominates assembly inertia.

Parts: Gatinko Chip Diabolos [Case 481] · Layer Base Erase [Case 482] · Forge Disc Vanguard [Case 483] · Bullet Performance Tip [Case 484].

```
ASCII Visual Geometry — Bullet Performance Tip (side view, pre/post-detachment)

  PRE-DETACHMENT (hard impact received):
  ┌──────────────────────────────────────────────────────┐
  │  [main body m=10.0g, rubber flat r=4mm]              │
  │        └──[satellite m=5.4g at r=7mm]               │
  │  μ=0.65, dω/dt=−115.1 rad/s², t=3.61s (aggressive)  │
  └──────────────────────────────────────────────────────┘

  POST-DETACHMENT (impact > threshold):
  ┌──────────────────────────────────────────────────────┐
  │  [main body m=10.0g, partial rubber, μ=0.35]         │
  │  dω/dt=−56.1 rad/s²,  t=7.42s  (calmer)             │
  │        [satellite ●→ spinning freely]                │
  │        I_sat=1.323×10⁻⁷,  t_sat=213ms,  dual-body   │
  └──────────────────────────────────────────────────────┘
```

```
Physics Analysis

Assembly:
  Gatinko Chip Diabolos [Case 481]: m=14.0g,  I=4.585×10⁻⁷ kg·m²
  Layer Base Erase       [Case 482]: m=10.6g,  I=2.597×10⁻⁶ kg·m²
  Forge Disc Vanguard    [Case 483]: m=26.5g,  I=6.625×10⁻⁶ kg·m²
  Bullet Performance Tip [Case 484]: m=15.4g,  I=2.123×10⁻⁷ kg·m²
  ─────────────────────────────────────────────────────────────────
  Total:  m=66.5g,  I_total=9.846×10⁻⁶ kg·m²
  ω₀=650 rad/s,  KE₀=2.079 J

Pre-detachment (μ=0.65, r_eff=2.667mm):
  dω/dt   = −115.1 rad/s²,  t_battle = 3.61 s

Post-detachment (m_body=61.1g, I=9.714×10⁻⁶, μ=0.35):
  dω/dt   = −56.1 rad/s²,   t_battle = 7.42 s

Satellite spin-down (ω_detach=650 rad/s):
  dω/dt_sat = −2804 rad/s²,  t_sat = 650 / 2804 = 0.232 s (232 ms)
  Dual-body window: 232 ms

Trigger threshold: opponent impact linearImpulse > 600 eu (passive gimmick)
                   OR manual activation via special move (BeySpirit override)
```

```typescript
function bulletDetachmentTrigger(incomingImpulse_eu: number, threshold_eu: number = 600): boolean {
  return incomingImpulse_eu >= threshold_eu;
}

function bulletSatelliteWindow(omegaDetach_rads: number, iSat: number, mSat_g: number,
  muSat: number, rEff_mm: number): number {
  const dOmega = -(muSat * (mSat_g / 1000) * 9.81 * (rEff_mm / 1000)) / iSat;
  return omegaDetach_rads / Math.abs(dOmega);
}
// bulletSatelliteWindow(650, 1.323e-7, 5.4, 0.35, 2.667) → 0.232 s (232 ms) dual-body window
// bulletSatelliteWindow(400, 1.323e-7, 5.4, 0.35, 2.667) → 0.142 s  — detaches later
// bulletDetachmentTrigger(650)  → true   (hard hit threshold exceeded)
// bulletDetachmentTrigger(400)  → false  (does not detach)
```

---

## Case 797 — [SPECIAL] Clone Attack (Bullet Attack): BeySpirit-Amplified Satellite Deployment, Spin-Drain Pursuit, and Deliberate Mini-Bey Clone

**Franchise move.** Clone Attack (バレットアタック, Bullet Attack) — Delta Zakuro's Venom Devolos / Erase Devolos Vanguard Bullet. After taking a hard hit, Bullet tip splits releasing a mini-bey satellite which is used to lower the opponent's stamina. BeySpirit override extends the satellite's active window from the physical 232 ms to a sustained 3000 ms pursuit phase and amplifies its stamina-drain capability. The special can be manually activated (player deliberately takes a hit to trigger, or activates the split via BeySpirit without needing an impact trigger).

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Phase 1 — satellite_detach:** On hard impact (> 600 eu received) OR manual BeySpirit activation. Satellite (m_sat = 5.4 g) separates from main body. Main body enters post-detachment regime (μ = 0.35, calmer movement). Satellite appears as visual clone of the main bey at reduced scale.

**Phase 2 — satellite_pursuit (3000 ms, BeySpirit extended):**
Satellite pursues nearest opponent. Collision interval: up to 3 collisions in 3 s (≈ 1 per 1000 ms).
- Per satellite collision: spinDelta = −90 (stamina drain), linearImpulse = 800 eu, dmgMult = 1.25×
- QTE "Split" (optional): press J at activation to aim satellite → directed pursuit toward nearest opponent within 3000 ms (without QTE: random orbit, max 2 collisions)
- Sustained proximity bonus (satellite within 25 units): opponent spinDecayRate × 1.2 per second
- If satellite is hit hard by opponent (> 400 eu received by satellite): satellite is destroyed early, phase ends

**Phase 3 — satellite_spindown:** After 3000 ms (or early destruction), satellite stops. Main body continues with post-detachment stats (μ = 0.35, better stamina than pre-detachment).

```
Maximum damage (3 collisions + full proximity drain, QTE aimed):
  Collision spinDelta: −90 × 3 = −270
  Sustained drain bonus (3 s at × 1.2): approx −36 equivalent spin drain
  Total estimated spinDelta: ~−306

Self-cost:  −80 (post-detachment μ switch from 0.65 → 0.35 partially offsets)
powerCost:  100
cooldown:   7000 ms
QTE:        "Split" — J in 250 ms window to direct satellite at nearest opponent
            (miss: random orbit, less reliable collisions)
```

```typescript
interface CloneAttackSatellite {
  active:           boolean;
  timeRemaining_ms: number;
  collisionCount:   number;
  directed:         boolean;  // true if QTE hit
}

function cloneAttackUpdate(
  sat: CloneAttackSatellite, dt_ms: number,
  inRange: boolean, collisionThisTick: boolean, satHit: boolean
): { sat: CloneAttackSatellite; spinDelta: number; impulse: number } {
  if (!sat.active) return { sat, spinDelta: 0, impulse: 0 };
  if (satHit) return { sat: { ...sat, active: false, timeRemaining_ms: 0 }, spinDelta: 0, impulse: 0 };
  const maxCollisions = sat.directed ? 3 : 2;
  const newTime = sat.timeRemaining_ms - dt_ms;
  if (newTime <= 0) return { sat: { ...sat, active: false, timeRemaining_ms: 0 }, spinDelta: 0, impulse: 0 };
  const doCollide = collisionThisTick && sat.collisionCount < maxCollisions;
  const newCount  = doCollide ? sat.collisionCount + 1 : sat.collisionCount;
  const spinD     = doCollide ? -90 : (inRange ? -0.2 * (dt_ms / 1000) : 0);  // DoT drain
  const imp       = doCollide ? 800 : 0;
  return {
    sat: { ...sat, timeRemaining_ms: newTime, collisionCount: newCount },
    spinDelta: spinD, impulse: imp,
  };
}
// cloneAttackUpdate({active:true,timeRemaining_ms:3000,collisionCount:0,directed:true}, 1000, true, true, false)
//   → { spinDelta:−90, impulse:800, sat.collisionCount:1 }
// satellite destroyed: satHit=true → immediate end regardless of remaining time
```

---

## Case 798 — [COMBO] Bullet Split: Vanguard Disc LAD-Assisted Approach into Post-Detachment Satellite Distraction Strike

**Combo.** Bullet Split (↓↓J): descend twice into low bowl orbit (↓↓) exploiting Vanguard disc's excellent LAD onset (θ_onset = 5°, r_LAD = 22.1 mm, Case 483) to maintain spin during the approach, then strike (J) — the physical impact during this combo represents the threshold-triggering impact (> 600 eu) that detaches the satellite, briefly creating the 232 ms dual-body window within the same collision event. The combo's spinDelta includes both the main body smash and the satellite's brief free-spin contact.

```
Combo Registry Entry:
  id:            "bullet-split"
  name:          "Bullet Split"
  sequence:      [moveDown, moveDown, attack]
  part:          bulletTip              // requires Bullet Performance Tip on the bey
  type:          universal
  cost:          15
  windowMs:      600
  cooldownMs:    4000
  effect:
    spinDelta:   −38                    // main body + satellite brief dual-contact
    dmgMult:     1.25×
    lockMs:      40

Ceiling check: 1.25× ≤ 1.5× ✓; 40ms ≤ 300ms ✓; −38 ≤ 50 ✓; no invulnerability ✓; no AoE ✓; no full spin recovery ✓
```

```typescript
const bulletSplitCombo: ComboRegistryEntry = {
  id: "bullet-split", name: "Bullet Split",
  sequence: ["moveDown", "moveDown", "attack"],
  part: "bulletTip",
  type: "universal", cost: 15, windowMs: 600, cooldownMs: 4000,
  effect: { spinDelta: -38, dmgMult: 1.25, lockMs: 40 },
};
// Activation: bulletTip must be on the bey; sliding-3 window; ω ≥ 15% threshold.
// Note: does NOT trigger satellite deployment in combo mode (deployment stays in Special domain).
// Ceiling: dmgMult 1.25 ≤ 1.5 ✓  lockMs 40 ≤ 300 ✓  spinDelta 38 ≤ 50 ✓
```

## Case 799 — [SPECIAL] Chain Dispel: Sustained Chain Barrier Stamina-Drain Field, Incoming-Attack Absorption, and Final Chain-Discharge Counter

**Franchise move.** Chain Dispel — Ken Midori's Chain Kerbeus creates a chain barrier around itself to counter oncoming attacks and chip away the opponent's stamina. Additional special for Chain Kerbeus DB/BU assembly; see [GIMMICK] Case 785 and [COMBO] Case 787. Unlike Chain Break (offensive slope-crash), Chain Dispel is a sustained defensive field that damages opponents through proximity contact and absorbs incoming strikes, closing with a chain-discharge burst.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Phase 1 — chain_barrier_extend (500 ms charge):** BU Blade Chain (Case 463) extends all 6 rubber + 2 plastic chains to maximum reach (r_chain = 22 mm), forming a full defensive ring. BeySpirit amplifies the ring radius × 1.5 to r_field = 33 mm. Chain Kerbeus holds center position (Yard' ball tip, μ = 0.03, dω/dt ≈ −0.599 rad/s²).

**Phase 2 — sustained_barrier_active (2000 ms):**
- Any opponent within r_field = 33 units: spinDecayRate × 1.35 per second (chain proximity drain)
- Incoming attack absorption: received spinDelta × 0.30 (70% of spin-damage absorbed by chains)
- Incoming linearImpulse absorbed: 65% reduction (chains dissipate most impulse)
- Chain Kerbeus movement locked (center-holding during barrier phase)
- Self-spin: minimal drain only (dω/dt_chain_hold ≈ −2.0 rad/s², chain holding cost)

**Phase 3 — chain_discharge (on barrier timer end or hard break > 900 eu received):**
All stored elastic energy in chains releases outward in a final burst. Each opponent within r_field receives:
- spinDelta = −110 (chain discharge strike)
- linearImpulse = 1400 eu (outward burst)
- dmgMult = 1.5×

```
Sustained drain (full 2000 ms, opponent in range continuous):
  Sustained spin drain equivalent: −20/s × 2.0 s = −40 accumulated [drain bonus]
  Final discharge:                  spinDelta = −110,  linearImpulse = 1400 eu

Self-cost:   −90 (chain hold + discharge cost)
powerCost:   100
cooldown:    5000 ms
QTE:         "Chain Lock" — hold J during phase 2 to maintain barrier at full strength;
             releasing J early reduces remaining duration proportionally
```

```typescript
interface ChainDispelState {
  active:            boolean;
  barrierTimer_ms:   number;   // counts down from 2000
  holdActive:        boolean;  // true if player holds J
}

function chainDispelTick(
  state: ChainDispelState, dt_ms: number,
  opponentInRange: boolean, incomingSpinDelta: number, incomingImpulse: number,
  holdJ: boolean
): {
  absorbed_spinDelta: number; absorbed_impulse: number;
  opponentDrainDelta: number; discharged: boolean; newState: ChainDispelState
} {
  if (!state.active) return { absorbed_spinDelta: 0, absorbed_impulse: 0, opponentDrainDelta: 0, discharged: false, newState: state };
  const newTimer = state.barrierTimer_ms - dt_ms * (holdJ ? 1.0 : 1.8); // decays faster if J released
  const absorbed_spin   = incomingSpinDelta   * 0.70;  // 70% absorbed
  const absorbed_imp    = incomingImpulse     * 0.65;  // 65% absorbed
  const drain           = opponentInRange ? -20 * (dt_ms / 1000) : 0;
  const discharged      = newTimer <= 0;
  return {
    absorbed_spinDelta: absorbed_spin, absorbed_impulse: absorbed_imp,
    opponentDrainDelta: drain, discharged,
    newState: { active: !discharged, barrierTimer_ms: Math.max(0, newTimer), holdActive: holdJ }
  };
}
// Full 2000ms, opponent in range, J held → accumulated drain ~−40 + discharge −110
// J released at 500ms → barrier expires after ~280ms equivalent hold
```

---

## Case 800 — [GIMMICK] Hazard Kerbeus 7 Atomic [M]: God-Layer Three-Head Dog Attack Geometry, Disc 7 C₇ Contact Frequency, and Atomic Dual-Mode Stamina-Defense Platform

**Thesis.** Hazard Kerbeus 7 Atomic (Kyle Hakim, Beyblade Burst God / Burst Evolution) [all values M — not yet in the case library; ±15% uncertainty; Hazard Kerbeus layer and Disc 7 referenced against Guardian Kerbeus [Case 459] and Disc 6 [Case 414] as bracketing values]. Hazard Kerbeus Energy Layer [M]: ~11.5 g, ABS, right-spin, Attack/Defense type, three dog-head protrusions at r_o ≈ 21 mm, θ_dog ≈ 22° from orbital tangent [M]; I_HK = ½ × 0.0115 × (0.006² + 0.021²) = ½ × 0.0115 × 4.77×10⁻⁴ = 2.742×10⁻⁶ kg·m² [M]. Burst tabs: 3 tabs at θ_tab spacing [M]; τ_burst_HK ≈ 3 × 3500 × 0.0003 × 0.007 = 2.205 mN·m [M] (lower tab count than GK, moderately burst-prone). The three dog-head protrusions provide asymmetric attack arcs: C_smash = cos(22°) = 0.927 [M]; contact arc ≈ 25° per head [M]; 3-fold C₃ symmetry. Disc 7 [M]: ~20.0 g, seven-lobe C₇ symmetry (one more lobe than Disc 6's C₆) [M], r_i = 4 mm, r_o = 17 mm; I_7 = ½ × 0.020 × (0.004² + 0.017²) = ½ × 0.020 × 3.050×10⁻⁴ = 3.050×10⁻⁶ kg·m² [M]; contact frequency: f_7 = 7 × ω₀ / (2π) = 7 × 600 / (2π) = 668 Hz [M] — higher than Disc 6 (573 Hz), delivering near-continuous small-amplitude contact disruption at 1.50 ms intervals [M]. Atomic Performance Tip [Case 71]: wide free-rotating ball (r_ball ≈ 16 mm), μ_eff = 0.08 × 0.18 = 0.014 (ball free-spin reduces friction 92% vs fixed tip), outer LAD ring activates at tilt > 15° and spin < 15% max. Assembly [M]: m_total ≈ 37.5 g, I_total ≈ 5.942×10⁻⁶ kg·m² [M], ω₀ = 600 rad/s, L₀ ≈ 3.565×10⁻³ kg·m²/s [M], KE₀ ≈ 1.070 J [M]. Spin decay (Atomic ball, μ_eff = 0.014, r_ball ≈ 8 mm contact radius, Case 71): dω/dt = −(0.014 × 0.0375 × 9.81 × 0.008) / 5.942×10⁻⁶ = −4.123×10⁻⁵ / 5.942×10⁻⁶ = −6.94 rad/s² [M] → t_spin = 600 / 6.94 = 86.5 s [M] (excellent defense/stamina endurance). KO resistance from wide ball: τ_restore = m × g × r_ball × sin(φ) = 0.0375 × 9.81 × 0.016 × sin(25°) = 2.487×10⁻³ N·m (4× stronger than sharp tip). The assembly is the platform for Chain Counter: center-holding Atomic behavior keeps Kerbeus positioned to receive the opponent's charge, absorb it with metal spring chains, and rebound.

Parts: Hazard Kerbeus Energy Layer [M] · Disc 7 [M] · Atomic Performance Tip [Case 71].

```
ASCII Visual Geometry — Hazard Kerbeus Layer + Disc 7 [M] (top view)

  Hazard Kerbeus layer (r=21mm [M], 3 dog heads):
  ┌──────────────────────────────────────────┐
  │        ╱HEAD A╲                          │
  │       ╱  dog   ╲   θ=22° [M]            │
  │  ╱HEAD C╲     ╱HEAD B╲                  │
  │ ╱  dog   ╲   ╱  dog   ╲                 │
  │ C₃ symmetry, 120° spacing                │
  └──────────────────────────────────────────┘

  Disc 7 [M] (C₇, r_o=17mm):
  7 lobes at 51.4° spacing → f=668 Hz, Δt=1.50ms [M]
  Near-continuous disruption contact pattern

  Atomic tip: [outer LAD ring r=16mm] | [free-rolling ball μ_eff=0.014]
    Wide ball: τ_restore = 4× sharp tip → KO resistance
```

```
Physics Analysis [M]

Hazard Kerbeus Layer [M]:
  m_HK = 11.5 g = 0.0115 kg
  r_i  = 6 mm,  r_o = 21 mm [M]
  I_HK = ½ × 0.0115 × (0.006² + 0.021²) = 2.742×10⁻⁶ kg·m² [M]
  θ_dog = 22°,  C_smash = cos(22°) = 0.927 [M]
  τ_burst_HK ≈ 2.205 mN·m [M]  (3 tabs, moderate burst risk)

Disc 7 [M]:
  m_7  = 20.0 g = 0.0200 kg
  r_i  = 4 mm,  r_o = 17 mm [M]
  I_7  = ½ × 0.020 × (0.004² + 0.017²) = 3.050×10⁻⁶ kg·m² [M]
  f_7  = 7 × 600 / (2π) = 668 Hz [M],  Δt = 1.50 ms

Atomic [Case 71]:
  μ_eff = 0.014,  r_ball ≈ 8mm [M],  outer LAD ring r=16mm
  I_AT_body ≈ negligible (ball free-spins)

Assembly [M]:
  m_total  ≈ 37.5 g = 0.0375 kg
  I_total  ≈ 2.742×10⁻⁶ + 3.050×10⁻⁶ + ~0.15×10⁻⁶ = 5.942×10⁻⁶ kg·m² [M]
  ω₀ = 600 rad/s,  KE₀ ≈ 1.070 J [M]

Spin decay (Atomic ball μ_eff=0.014, r_eff=8mm [M]):
  dω/dt   = −6.94 rad/s² [M],  t_spin = 86.5 s [M]

KO resistance (wide ball r=16mm):
  τ_restore(φ=25°) = 0.0375 × 9.81 × 0.016 × sin(25°) = 2.487 mN·m [M]
```

```typescript
function hazardKerbeusAssembly(): {
  iLayer: number; iDisc7: number; iTotal: number; mTotal_g: number; ke0_J: number
} {
  const iLayer = 0.5 * 0.0115 * (0.006 ** 2 + 0.021 ** 2);  // [M]
  const iDisc7 = 0.5 * 0.020  * (0.004 ** 2 + 0.017 ** 2);  // [M]
  const iAtomic = 1.5e-7;  // [M] main body only (ball free-spins)
  const iTotal = iLayer + iDisc7 + iAtomic;
  const mTotal = 0.0375;  // [M]
  return { iLayer, iDisc7, iTotal, mTotal_g: mTotal * 1000, ke0_J: 0.5 * iTotal * 600 ** 2 };
}
// hazardKerbeusAssembly() → { iLayer:2.742e-6, iDisc7:3.050e-6, iTotal:5.942e-6, m:37.5g, KE:1.070J } [M]

function disc7ContactFrequency(omega_rads: number): { freq_Hz: number; interval_ms: number } {
  const freq = 7 * omega_rads / (2 * Math.PI);
  return { freq_Hz: freq, interval_ms: 1000 / freq };
}
// disc7ContactFrequency(600) → { freq:668Hz, interval:1.50ms } [M]
// disc7ContactFrequency(400) → { freq:445Hz, interval:2.25ms } [M]

function atomicWideballKOResistance(mBey_kg: number, rBall_m: number, bowlAngle_deg: number): number {
  return mBey_kg * 9.81 * rBall_m * Math.sin(bowlAngle_deg * Math.PI / 180);
}
// atomicWideballKOResistance(0.0375, 0.016, 25) → 2.487e-3 N·m [M]
// atomicWideballKOResistance(0.0375, 0.004, 25) → 6.217e-4 N·m  — sharp tip comparison
```

---

## Case 801 — [SPECIAL] Chain Counter: Opponent-Powered Redirection, Metal Spring Chain Wall Rebound, and Dog-Head Strike

**Franchise move.** Chain Counter — Kyle Hakim's Hazard Kerbeus 7 Atomic. Kerbeus uses the opponent's power against them to hit the wall of the Beystadium, then uses the metal spring chains to push off gaining speed and power, then attacks with the dog head on its Energy Layer. Unique mechanic: power scales with the strength of the incoming hit — a harder opponent attack produces a stronger counter.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Phase 1 — counter_stance (await window: 800 ms):**
Hazard Kerbeus activates counter-stance via BeySpirit. Atomic ball tip anchors to center bowl, holding position. Hazard aura manifests green/yellow BeySpirit. Counter trigger window: 800 ms.
- If opponent hits Kerbeus within 800 ms: trigger = true, E_absorbed = J_incoming × 0.60
- If no hit within 800 ms: auto-fire at 40% power

**Phase 2 — wall_redirect (triggered, ~200 ms):**
BeySpirit redirects the incoming impulse toward the nearest wall segment. Kerbeus travels to wall contact. Chain spring compression during wall impact: F_spring = k_chain × δ = 250 N/m × 0.015 m = 3.75 N (physical, non-functional as noted in Case 459). Under BeySpirit override: the chains become functionally effective — spring force amplified × 100 → F_spring_BS = 375 N for 50 ms contact duration → impulse = 375 × 0.05 = 18.75 N·s → v_rebound = 18.75 / 0.0375 = 500 m/s (anime physics). In-game terms: v_rebound = v_impact × 2.5 (BeySpirit rebound multiplier).

**Phase 3 — dog_head_strike:**
Kerbeus charges from wall toward opponent using dog-head contact geometry (θ_dog = 22° [M], C_smash = 0.927 [M]).

```
Counter power scaling (based on incoming attack strength):

  Incoming spinDelta absorbed:  self protection = 40% of normal spin damage taken

  Full counter (triggered, full power):
    spinDelta:     −360  (scaled from E_absorbed × 2.0 BeySpirit amplification)
    linearImpulse: 5000 eu
    dmgMult:       2.0×   (counter bonus — opponent's own force returned)
    counterBonus:  true   (vs special moves: additional +20% damage)

  Auto-fire (no trigger hit):
    spinDelta:     −144
    linearImpulse: 2000 eu
    dmgMult:       1.4×

Power scaling with incoming hit strength:
  spinDelta_counter = −360 × min(incomingSpinDelta / 200, 1.5)  [scales up to 150% for heavy hits]
  i.e., weaker incoming hit = weaker counter; massive incoming hit = devastating counter

Self-cost:   −100
powerCost:   100
cooldown:    5000 ms
QTE:         "Counter" — press J at the exact moment opponent's hit lands
             (within ±50 ms) for Perfect Counter → power × 1.15 bonus
```

```typescript
interface ChainCounterResult {
  spinDelta:     number;
  linearImpulse: number;
  dmgMult:       number;
  isPerfect:     boolean;
}

function chainCounterResult(
  triggered: boolean, incomingSpinDelta: number,
  qteTimingMs: number           // absolute timing error vs perfect (ms)
): ChainCounterResult {
  if (!triggered) {
    return { spinDelta: -144, linearImpulse: 2000, dmgMult: 1.4, isPerfect: false };
  }
  const scaleFactor = Math.min(Math.abs(incomingSpinDelta) / 200, 1.5);
  const perfect     = Math.abs(qteTimingMs) <= 50;
  const qteMult     = perfect ? 1.15 : 1.0;
  return {
    spinDelta:     Math.round(-360 * scaleFactor * qteMult),
    linearImpulse: Math.round(5000 * scaleFactor * qteMult),
    dmgMult:       2.0 * qteMult,
    isPerfect:     perfect,
  };
}
// chainCounterResult(true, 300, 30)  → { spinDelta:−621, limp:8625, dmg:2.3×, perfect:true }  — massive hit, perfect QTE
// chainCounterResult(true, 200, 80)  → { spinDelta:−360, limp:5000, dmg:2.0×, perfect:false } — normal hit
// chainCounterResult(true, 100, 80)  → { spinDelta:−180, limp:2500, dmg:2.0×, perfect:false } — light hit
// chainCounterResult(false, 0, 999)  → { spinDelta:−144, limp:2000, dmg:1.4×, perfect:false } — no trigger
```

---

## Case 802 — [COMBO] Atomic Rebound: Hazard Kerbeus Wall-Contact LAD Approach Smash

**Combo.** Atomic Rebound (←←J): double-left approach (←←) simulates the wall-approach trajectory of Chain Counter in reduced form — using Atomic's wide-ball KO resistance to absorb the reverse momentum, then spring-approach (no wall required) into dog-head contact (J). The combo uses the Atomic tip's ability to roll across the bowl floor at low friction for the approach vector.

```
Combo Registry Entry:
  id:            "atomic-rebound"
  name:          "Atomic Rebound"
  sequence:      [moveLeft, moveLeft, attack]
  part:          hazardKerbeusLayer    // requires Hazard Kerbeus layer on the bey [M]
  type:          defense               // counter-stance specialty
  cost:          15
  windowMs:      600
  cooldownMs:    3500
  effect:
    spinDelta:   −40                   // dog-head smash, C_smash=0.927 [M]
    dmgMult:     1.28×
    lockMs:      45

Ceiling check: 1.28× ≤ 1.5× ✓; 45ms ≤ 300ms ✓; −40 ≤ 50 ✓; no invulnerability ✓; no AoE ✓; no full spin recovery ✓
```

```typescript
const atomicReboundCombo: ComboRegistryEntry = {
  id: "atomic-rebound", name: "Atomic Rebound",
  sequence: ["moveLeft", "moveLeft", "attack"],
  part: "hazardKerbeusLayer",  // [M]
  type: "defense", cost: 15, windowMs: 600, cooldownMs: 3500,
  effect: { spinDelta: -40, dmgMult: 1.28, lockMs: 45 },
};
// Ceiling: dmgMult 1.28 ≤ 1.5 ✓  lockMs 45 ≤ 300 ✓  spinDelta 40 ≤ 50 ✓
```

## Case 803 — [SPECIAL] Dual Phantom: Aerial Bullet-Tip Split, Dual-Bey Cooperative Orbit, and Coordinated 50%-Bonus Dual Strike

**Franchise move.** Dual Phantom (デュアルファントム) — Delta Zakuro's Venom/Erase Devolos Vanguard Bullet. After taking a hard hit in battle or by slamming into the stadium wall, Devolos flies into the air and its Bullet tip splits into two pieces, releasing a phantom mini-bey — causing it and Devolos to act as two Beyblades working together. Foundational special for the Devolos kit; Clone Cannon (Case 804) uses the phantom produced by Dual Phantom. Additional special for the Venom/Erase Devolos assembly; see [GIMMICK] Case 796 and [COMBO] Case 798.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Phase 1 — aerial_launch_split (triggered: wall slam > 400eu OR manual activation):**
BeySpirit amplifies the wall/impact rebound into an upward launch: beyTiltAngle → 55° (airborne arc). While airborne, Bullet tip splits: satellite (m_sat = 5.4 g, Case 484) separates as the Phantom mini-bey. Main bey and Phantom land on different sides of the stadium. Physical detachment mechanics from Case 484 apply (post-detachment regime: μ = 0.35 on main bey).

**Phase 2 — dual_orbit_mode (4000 ms):**
Main bey and Phantom each independently orbit the arena:
- Main bey: outer orbit at r_orbit_main ≈ 60 units, spinDecayRate × 1.05 per second (slight energy drain from coordination)
- Phantom: inner orbit at r_orbit_phantom ≈ 35 units, AI-controlled, targets nearest opponent

Per-entity collision stats during dual_orbit_mode:
- Main bey hit: spinDelta = −100, linearImpulse = 1200 eu, dmgMult = 1.3×
- Phantom hit:  spinDelta = −80,  linearImpulse = 800 eu,  dmgMult = 1.2×

**Dual Hit Bonus** (both main and phantom hit the same opponent within 200 ms):
- Combined spinDelta  = (−100 + −80) × 1.50 = −270
- Combined impulse    = (1200 + 800) × 1.30 = 2600 eu
- Bonus trigger displays "Dual Strike!" on HUD

**Phase 3 — re-merge (when timer ends OR phantom destroyed OR Clone Cannon fired):**
- On natural timer end: Phantom re-locks to main bey tip socket → main bey returns to pre-detachment μ = 0.65 (satellite restored)
- On Phantom destroyed by opponent (> 500 eu incoming): re-merge fails → main bey remains in post-detachment μ = 0.35

```
Maximum damage potential (4000 ms, 2 dual-hit events):
  Two dual strikes: −270 × 2 = −540 spinDelta  (coordinated attack)
  Single-entity hits between strikes: additional −180 (3 individual hits × −60 average)

Self-cost:   −60 (lower than Clone Attack — cooperation mode, not pure attack)
powerCost:   100
cooldown:    8000 ms  (long — Dual Phantom enables Clone Cannon; full recharge needed)

Trigger:     wall slam (> 400 eu) OR manual activation (any)
             Phantom hit hard by opponent (> 500 eu) → phantom destroyed early
             Clone Cannon activation → phantom consumed as projectile (see Case 804)
```

```typescript
interface DualPhantomState {
  active:          boolean;
  timerMs:         number;      // counts down from 4000
  phantomActive:   boolean;     // false if destroyed or fired via Clone Cannon
  phantomX:        number;      // phantom position
  phantomY:        number;
}

function dualPhantomDualHitBonus(
  mainHitMs: number, phantomHitMs: number
): { isDualHit: boolean; bonusMult: number } {
  const isDual = Math.abs(mainHitMs - phantomHitMs) <= 200;
  return { isDualHit: isDual, bonusMult: isDual ? 1.50 : 1.0 };
}
// dualPhantomDualHitBonus(1000, 1150) → { isDualHit:true,  bonusMult:1.50 }  — within 200ms
// dualPhantomDualHitBonus(1000, 1300) → { isDualHit:false, bonusMult:1.00 }  — too far apart

function dualPhantomPhysicsLaunch(
  wallImpulse_eu: number, mMain_kg: number, beyTiltPeak_deg: number
): { launchV_ms: number; splitHeight_m: number } {
  // BeySpirit amplified wall rebound + aerial arc
  const bsAmp   = 3.0;
  const vRebound = Math.sqrt(2 * (wallImpulse_eu / 1000) * bsAmp / mMain_kg);
  const tPeak    = vRebound * Math.sin(beyTiltPeak_deg * Math.PI / 180) / 9.81;
  const h        = 0.5 * 9.81 * tPeak ** 2;
  return { launchV_ms: vRebound, splitHeight_m: h };
}
// dualPhantomPhysicsLaunch(500, 0.0665, 55) → { launchV:~8.5, splitHeight:~2.3m } [anime physics]
// dualPhantomPhysicsLaunch(400, 0.0665, 55) → { launchV:~7.6, splitHeight:~1.8m }
```

---

## Case 804 — [SPECIAL] Clone Cannon: Satellite-Projectile Elastic Launch, Stress-Concentrated Bullet Impact, and Pierce Bonus

**Franchise move.** Clone Cannon (バレットキャノン, Bullet Cannon) — Delta Zakuro's Venom/Erase Devolos Vanguard Bullet. After using Dual Phantom to split its Bullet tip in two, Devolos hits the mini Beyblade with an attack, sending it towards its opponent to deal damage. The main bey acts as a cannon, the satellite as a bullet — elastic collision transfers momentum from the heavy main bey to the light satellite, accelerating it to much higher velocity. Additional special for the Venom/Erase Devolos assembly; see [GIMMICK] Case 796, [SPECIAL] Case 797 (Clone Attack), [SPECIAL] Case 803 (Dual Phantom), and [COMBO] Case 798.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Prerequisite mechanics:**
- **Mode A (Dual Phantom active, Case 803):** Clone Cannon uses the existing phantom mini-bey. Full power. Dual Phantom state ends when cannon fires.
- **Mode B (no phantom active):** BeySpirit forces an instant Bullet tip split. 80% power. Triggers passive detachment regime shift (Case 484).

**Phase 1 — aim (QTE: directional input → attack, 500 ms window):**
Player aims the cannon shot by holding directional input toward the opponent (→/←/↑/↓ based on opponent position), then presses attack (J) to fire. Poor aim (> 15° off) → projectile misses. Perfect aim (< 5° off) → pierce bonus activates.

**Phase 2 — cannon_strike (physics):**
Main bey approaches phantom at v_approach derived from KE:
v_approach = sqrt(2 × 0.45 × KE₀ / m_main) = sqrt(2 × 0.45 × 2.079 / 0.0665) = sqrt(28.12) = 5.30 m/s

Elastic collision (m_main = 61.1 g post-detachment, m_sat = 5.4 g):
v_satellite = (2 × m_main / (m_main + m_sat)) × v_approach
           = (2 × 0.0611 / 0.0665) × 5.30
           = 1.838 × 5.30 = 9.74 m/s  (physical, pre-BeySpirit)

BeySpirit amplification × 2.5 (cannon force transfer):
v_projectile = 9.74 × 2.5 = 24.35 m/s [anime physics]

The satellite travels as a high-velocity projectile. Its small contact area (r_contact ≈ 2.5 mm equivalent) produces extreme stress concentration at impact:
σ_tip = F_impact / A_contact = J_proj / (A_contact × t_contact)
→ stress concentration enables the "pierce" effect — bypasses a fraction of defensive spin-absorption.

**Phase 3 — projectile_impact:**
Satellite collides with opponent. Satellite is consumed (destroyed) after impact — Clone Cannon is a one-shot attack.

```
Mode A (Dual Phantom satellite, full power):
  spinDelta:     −280  (concentrated bullet impact, stress singularity)
  linearImpulse: 3500 eu
  dmgMult:       1.85×
  pierceBonus:   if aim < 5° error → bypasses 40% of opponent's defensive spinDelta absorption
                 (treated as armour-piercing for that hit)

Mode B (instant split, 80% power):
  spinDelta:     −224
  linearImpulse: 2800 eu
  dmgMult:       1.60×
  pierceBonus:   if aim < 5° → bypasses 32% of defensive absorption

Miss condition (aim > 15° off → projectile sails past opponent):
  spinDelta:     0
  linearImpulse: 0
  wasted:        satellite consumed regardless

Post-cannon:   Dual Phantom state ends (satellite consumed);
               main bey in post-detachment regime (μ=0.35, Case 484)

Self-cost:   −110
powerCost:   100
cooldown:    6000 ms
QTE:         "Aim + Fire" — hold directional toward opponent + J within 500 ms window
             (miss QTE = auto-aim at 45° error)
```

```typescript
function cloneCannonProjectileVelocity(
  mMain_kg: number, mSat_kg: number,
  vApproach_ms: number, bsAmplifier: number
): { vPhysical_ms: number; vAnime_ms: number; momentumRatio: number } {
  const vPhys    = (2 * mMain_kg / (mMain_kg + mSat_kg)) * vApproach_ms;
  const vAnime   = vPhys * bsAmplifier;
  const ratio    = vAnime / vApproach_ms;
  return { vPhysical_ms: vPhys, vAnime_ms: vAnime, momentumRatio: ratio };
}
// cloneCannonProjectileVelocity(0.0611, 0.0054, 5.30, 2.5)
//   → { vPhys:9.74, vAnime:24.35, ratio:4.59 }  — satellite fires at 4.59× main bey speed
// cloneCannonProjectileVelocity(0.0611, 0.0054, 5.30, 1.0)
//   → { vPhys:9.74, vAnime:9.74, ratio:1.84 }   — no BeySpirit, physical elastic only

function cloneCannonImpactResult(
  mode: "dual_phantom" | "instant_split",
  aimErrorDeg: number
): { spinDelta: number; linearImpulse: number; dmgMult: number; pierced: boolean; hit: boolean } {
  const hit      = aimErrorDeg <= 15;
  const pierce   = aimErrorDeg < 5;
  const powerMult = mode === "dual_phantom" ? 1.0 : 0.80;
  if (!hit) return { spinDelta: 0, linearImpulse: 0, dmgMult: 1.0, pierced: false, hit: false };
  return {
    spinDelta:     Math.round(-280 * powerMult),
    linearImpulse: Math.round(3500 * powerMult),
    dmgMult:       1.85 * powerMult,
    pierced:       pierce,
    hit:           true,
  };
}
// cloneCannonImpactResult("dual_phantom",  3)  → { spin:−280, imp:3500, dmg:1.85×, pierced:true,  hit:true  }
// cloneCannonImpactResult("dual_phantom", 10)  → { spin:−280, imp:3500, dmg:1.85×, pierced:false, hit:true  }
// cloneCannonImpactResult("instant_split", 3)  → { spin:−224, imp:2800, dmg:1.48×, pierced:true,  hit:true  }
// cloneCannonImpactResult("dual_phantom", 20)  → { spin:0,    imp:0,    dmg:1.0×,  pierced:false, hit:false } — miss

function cloneCannonStressConcentration(
  jImpact_Ns: number, rContact_mm: number, tContact_ms: number
): number {
  const A = Math.PI * (rContact_mm / 1000) ** 2;
  return jImpact_Ns / (A * (tContact_ms / 1000));   // Pa·s → stress
}
// cloneCannonStressConcentration(0.131, 2.5, 1.0) → 6.68×10⁸ Pa  — extreme (pierce justification)
// cloneCannonStressConcentration(0.131, 8.0, 1.0) → 6.51×10⁷ Pa  — large contact (no pierce)
```

## Case 805 — [SPECIAL] Clone Impact: Newton's-Cradle Satellite-Mediated Momentum Transfer, Three-Body Smash, and Knock-Over Tilt Damage

**Franchise move.** Clone Impact (バレットインパクト, Bullet Impact) — Delta Zakuro's Venom/Erase Devolos Vanguard Bullet. As the mini Beyblade from the Bullet tip clashes with the opponent, Devolos rushes in and smashes into the Bullet tip to inflict knock-over damage. The satellite acts as the intermediary in a Newton's cradle chain: main bey → satellite → opponent. Additional special for the Venom/Erase Devolos assembly; see [GIMMICK] Case 796, [SPECIAL] Cases 797 (Clone Attack) / 803 (Dual Phantom) / 804 (Clone Cannon), and [COMBO] Case 798.

NOTE: special move overrides all EG/clutch mechanical state; the EG spring re-engages under BeySpirit power regardless of whether it has already fired this match (anime physics override).

**Prerequisite:** Satellite must be active (from Dual Phantom, Clone Attack, or passive gimmick trigger) AND within ≤ 15 units of the opponent. If satellite is not active: BeySpirit forces an instant split (Case 484 override) → 75% power mode.

**Phase 1 — satellite_lock (300 ms minimum):**
Satellite sustains proximity contact with opponent (≤ 15 units). The satellite's rubber contact (Case 484: μ = 0.65 pre-detachment, r_contact = 4 mm) maintains a gripping contact friction against opponent's layer. Opponent spinDecayRate × 1.2 during lock (grinding contact). Lock duration sets up the cradle contact point.

**Phase 2 — main_rush (QTE: J, 200 ms window):**
Main bey (m_main = 61.1 g, post-detachment) accelerates directly toward satellite using BeySpirit force line.
v_rush = sqrt(2 × 0.50 × KE₀ / m_main) = sqrt(2 × 0.50 × 2.079 / 0.0611) = sqrt(34.09) = 5.84 m/s
QTE prompt "Rush" — player must press J when the main bey aligns with the satellite-opponent contact axis (200 ms window). Perfect QTE: full power. Miss: 65% power (auto-fire misaligned).

**Phase 3 — cradle_smash (Newton's cradle, three-body):**
Main bey strikes satellite which is in hard contact with opponent. Elastic cradle transmission:
- Effective combined mass (satellite + opponent): m_combined ≈ 5.4 + 45.0 = 50.4 g (generic opponent estimate)
- v_transmitted = (2 × m_main) / (m_main + m_combined) × v_rush
               = (2 × 0.0611) / (0.0611 + 0.0504) × 5.84 = 1.097 × 5.84 = 6.41 m/s (physical)
- BeySpirit amplification × 3.0 → v_impact_anime = 19.2 m/s [anime physics]

**Knock-Over damage:** The satellite contacts the opponent's layer at a slightly elevated height h_sat ≈ 8 mm (contact sits above floor-level). The transmission force vector is angled θ_tilt = arctan(h_sat / r_opp) = arctan(8/22) = 20° from horizontal → vertical force component creates severe tilt:
F_vertical_fraction = sin(20°) = 0.342 → beyond normal tilt-inducing threshold
BeySpirit amplification causes beyTiltAngle to spike dramatically → opponent "knocked over" (not ring-out, but severe tilt → rapid spin-loss from floor scrape + loss of orbit control).

```
Full power (satellite active, perfect QTE):
  spinDelta:       −310
  linearImpulse:   4000 eu
  dmgMult:         1.95×
  knockOverBonus:  beyTiltAngle += 40° forced onto opponent
                   (floor scrape at 40° tilt → opponent spinDecayRate × 3.0 for 1500 ms)
  burstBonus:      +20% burst probability (cradle force engages burst tabs from below)

75% power (no satellite active, instant BeySpirit split):
  spinDelta:       −232
  linearImpulse:   3000 eu
  dmgMult:         1.60×
  knockOverBonus:  beyTiltAngle += 28° (reduced tilt, no sustained lock phase)

65% power (miss QTE — auto-fire, misaligned):
  spinDelta:       −202
  linearImpulse:   2600 eu
  dmgMult:         1.40×
  knockOverBonus:  beyTiltAngle += 20°

Satellite consumed after cradle smash (destroyed by the impact event).
Post-impact: main bey and satellite both rebound; main bey in post-detachment μ=0.35 regime (Case 484).

Self-cost:   −130
powerCost:   100
cooldown:    6000 ms
QTE:         "Rush" — J when bey aligns with satellite (200 ms window + directional match)
```

```typescript
function cloneImpactCradlePhysics(
  mMain_kg: number, mSat_kg: number, mOpponent_kg: number,
  vRush_ms: number, bsAmplifier: number
): { vTransmit_phys: number; vTransmit_anime: number; cradleRatio: number } {
  const mCombined   = mSat_kg + mOpponent_kg;
  const vTransPhys  = (2 * mMain_kg) / (mMain_kg + mCombined) * vRush_ms;
  const vAnime      = vTransPhys * bsAmplifier;
  return {
    vTransmit_phys:  vTransPhys,
    vTransmit_anime: vAnime,
    cradleRatio:     vTransPhys / vRush_ms,
  };
}
// cloneImpactCradlePhysics(0.0611, 0.0054, 0.045, 5.84, 3.0)
//   → { vPhys:6.41, vAnime:19.2, ratio:1.097 }  — main bey heavier than combined: full transfer
// cloneImpactCradlePhysics(0.0611, 0.0054, 0.070, 5.84, 3.0)
//   → { vPhys:5.99, vAnime:18.0, ratio:1.026 }  — heavier opponent: ratio drops
// cloneImpactCradlePhysics(0.0611, 0.0054, 0.030, 5.84, 3.0)
//   → { vPhys:6.92, vAnime:20.8, ratio:1.185 }  — lighter opponent: higher transfer

function cloneImpactKnockOverTilt(
  hSat_mm: number, rOpponent_mm: number, bsAmp: number
): { tiltAngle_deg: number; floorScrapeDecayMult: number } {
  const thetaDeg    = Math.atan(hSat_mm / rOpponent_mm) * 180 / Math.PI;
  const forcedTilt  = thetaDeg * bsAmp;  // BeySpirit amplifies tilt angle
  const decayMult   = 1 + Math.sin(forcedTilt * Math.PI / 180) * 5.0;
  return { tiltAngle_deg: Math.min(forcedTilt, 60), floorScrapeDecayMult: decayMult };
}
// cloneImpactKnockOverTilt(8, 22, 3.0) → { tiltAngle:60° (capped), decayMult:5.33 } [M, full BS]
// cloneImpactKnockOverTilt(8, 22, 2.0) → { tiltAngle:40°, decayMult:3.21 }  — used for game stats

function cloneImpactResult(
  satelliteActive: boolean, qteHit: boolean, qteMs: number
): { spinDelta: number; linearImpulse: number; dmgMult: number; knockOverDeg: number; burstBonus_pct: number } {
  const powerBase = satelliteActive ? (qteHit ? 1.00 : 0.65) : 0.75;
  return {
    spinDelta:      Math.round(-310 * powerBase),
    linearImpulse:  Math.round(4000 * powerBase),
    dmgMult:        1.0 + (1.95 - 1.0) * powerBase,
    knockOverDeg:   satelliteActive ? (qteHit ? 40 : 20) : 28,
    burstBonus_pct: qteHit ? 20 : 10,
  };
}
// cloneImpactResult(true,  true,  80) → { spin:−310, imp:4000, dmg:1.95×, tilt:40°, burst:+20% }  — full
// cloneImpactResult(true,  false, 250)→ { spin:−202, imp:2600, dmg:1.62×, tilt:20°, burst:+10% }  — miss QTE
// cloneImpactResult(false, true,  80) → { spin:−232, imp:3000, dmg:1.71×, tilt:28°, burst:+20% }  — no sat
```

---

*Cases continue from Case 806 as further franchise moves are provided.*

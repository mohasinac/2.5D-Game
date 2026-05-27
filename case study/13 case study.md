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

## Case 650 — [GIMMICK] D:D 4D Bottom Mode-Switching: Defense Prong Deployment and Tip Contact-Geometry Transformation

**Thesis:** The D:D (Defense:Defense) 4D Bottom is a Beyblade Metal series compound tip assembly with two independently deployable states — in its neutral configuration the central tip contacts the floor like a standard ABS bottom (moderate friction, standard acceleration behavior) and the defensive prongs are retracted flush with the bottom shell; under sufficient centrifugal load or when triggered by a lateral impact force exceeding a threshold, the prongs extend outward and downward, changing the contact geometry from a single-point tip to a multi-contact footing that spreads the ground reaction across multiple prong tips simultaneously; the key physical consequence of prong deployment is threefold: first, the effective contact radius expands from r_tip ≈ 2 mm (central point) to r_prong_outer ≈ 12 mm (outer prong tips, four prongs at approximately 90° spacing), increasing the tipping moment resistance by (r_prong_outer / r_tip)² = (12/2)² = 36× — a beyblade stabilized by prong contact is 36 times harder to topple than the same bey on a single-point tip [CALCULATED]; second, the multi-contact footprint increases the total friction force available for ground resistance: four prong tips each at μ_ABS ≈ 0.17 contribute F_friction_total = 4 × μ_ABS × (m × g / 4) = μ_ABS × m × g = 0.17 × 0.040 × 9.81 = 0.0668 N (same total as single tip but spread over a larger base, so lateral displacement requires overcoming torque about a wider moment arm); third, the prong geometry creates interlocking contact: each prong tip is shaped with a slight inward hook that catches on stadium floor texture, and a lateral impulse that would slide a single-point tip now must instead topple the four-prong footing by lifting at least one prong off the floor, which requires a vertical component equal to the bey's weight divided by four (0.040 × 9.81 / 4 = 0.098 N per prong) before the prong can be disengaged; the mode switch itself is physics-accurate in the 4D bottom design: the prong deployment spring mechanism is loaded by the beyblade's own spin-generated centrifugal force at the prong mass (m_prong ≈ 0.5 g per prong, pivot radius r_pivot ≈ 8 mm) → F_centrifugal = m_prong × ω² × r_pivot = 0.0005 × (600)² × 0.008 = 1.44 N per prong [CALCULATED], and this centrifugal force exceeds the prong's return spring threshold at spin speeds above ω_threshold ≈ 300 rad/s, meaning prongs deploy automatically above half of launch spin and retract below that spin level; this spin-dependent deployment creates a natural defense-to-stamina transition: at high spin the prong footing provides maximum stability; as spin decays below ω_threshold the prongs retract and the bey returns to a single-point tip with lower friction, preserving the remaining spin as stamina.

### Prong Deployment Geometry

```
D:D bottom — prong contact transformation:

  Retracted state (spin < 300 rad/s or neutral):
  ┌─────────────────────────────────────────────┐
  │         Variares body                       │
  │         ┴  ← single central ABS tip        │
  │         r_contact ≈ 2mm                     │
  │         Tipping moment arm: 2mm             │
  └─────────────────────────────────────────────┘

  Extended state (spin > 300 rad/s):
  ┌─────────────────────────────────────────────┐
  │         Variares body                       │
  │   ╱─────┼─────╲  ← four prongs deployed    │
  │  ●   ●  ●  ●   ●  ← prong tips (r=12mm)    │
  │         r_outer ≈ 12mm                      │
  │         Tipping moment arm: 12mm            │
  │         Tipping resistance: 36× baseline   │
  └─────────────────────────────────────────────┘

  Centrifugal prong force at various spin speeds:
    ω = 200 rad/s: F_c = 0.0005 × 200² × 0.008 = 0.160 N  (below spring threshold)
    ω = 300 rad/s: F_c = 0.0005 × 300² × 0.008 = 0.360 N  (≈ deployment threshold)
    ω = 400 rad/s: F_c = 0.0005 × 400² × 0.008 = 0.640 N  (fully deployed)
    ω = 600 rad/s: F_c = 0.0005 × 600² × 0.008 = 1.440 N  (maximum extension)
    [CALCULATED — linear spring: deploy_threshold ≈ 0.36 N → ω_threshold ≈ 300 rad/s]
```

### Mode Transition Physics

```
Spin-dependent mode transition:

  HIGH SPIN (ω > 300 rad/s) — Defense Mode:
    prongs: extended
    contact radius: 12mm
    tipping resistance: 36× baseline
    floor friction: 4-point contact
    incomingImpulseReduction: ~30%  (prong interlocking)
    movementStyle: "anchored"  (resists lateral displacement)
    visual: prongs visibly deployed, low-profile wide stance

  LOW SPIN (ω < 300 rad/s) — Stamina/Transition Mode:
    prongs: retracted
    contact radius: 2mm
    tipping resistance: baseline
    floor friction: single-point (lower friction → spin preserved)
    movementStyle: "standard"
    visual: tip retracts, bey reverts to standard bottom profile

  The transition is continuous (not binary in game):
    prong_extension_ratio = clamp((bey.spin - PRONG_RETRACT_SPIN) / 
                             (PRONG_FULL_DEPLOY_SPIN - PRONG_RETRACT_SPIN), 0, 1)
    effective_contact_radius = lerp(2mm, 12mm, prong_extension_ratio)
    tipping_resistance_mult  = lerp(1.0, 36.0, prong_extension_ratio²)
    impulse_reduction        = lerp(0.0, 0.30, prong_extension_ratio)
```

---

## Case 651 — [SPECIAL MOVE] Ares Shield: King / Variares D:D (Beyblade Metal Fury)

**Franchise Move:** Variares switches to defense mode as Ares protects itself with a shield from powerful attacks; the defense prongs on the bey shield it from incoming attacks from all directions. Used to defend against Eonis' Burst Satellite in the Destroyer Dome. [Beyblade Metal Fury / 4D]

**Thesis:** Ares Shield is the anime transcendence of the D:D bottom spin-dependent prong deployment gimmick (Case 650) in which the gradual centrifugal prong extension is replaced by an instantaneous full-deployment triggered by player input regardless of current spin speed, combined with an anime-layer energy shield projection that extends the physical prong footprint into a full omnidirectional deflection aura; where the gimmick deploys prongs passively only when spin exceeds ω_threshold = 300 rad/s, Ares Shield forces full prong deployment at any spin level and simultaneously activates the Ares BeySpirit barrier — a shield that provides 360° attack deflection for the duration, converting every hit that lands during the shield window from a damaging blow into a reflected impulse that returns a portion of the incoming force directly at the attacker; the key design principle — defensive moves force opponents to attack — is realized here as a must_attack force state combined with the reflected impulse: if the opponent does not attack during the shield, Ares Shield passively drains opponent spin via a radial prong-tip air-vortex (the shield rotation creates a low-pressure zone that pulls near-field air inward, creating a counterrotating backwash that costs the opponent approximately 6 rad/s per second while Variares is in shield stance); if the opponent attacks during the shield, every hit is partially reflected — the opponent is literally attacking themselves; the reflection fraction scales with the impulse magnitude: light hits reflect 40%, heavy hits reflect 60% (the prong interlocking is more effective against heavy blows because the prong hooks catch harder on the stadium floor, increasing their resistance precisely when the attacker needs the momentum to carry through); this creates the "Ares paradox" — the stronger the attack, the larger the percentage reflected, so maximum-effort attacks against Ares Shield return more of their own force than light probing attacks; the QTE for the attacker is a "break-through" timing event: if the attacker perfectly times a sustained 3-hit combo (not a single heavy blow) within a 500ms window, they can saturate the prong interlocking defense and partially collapse the shield — reducing reflection to 20% for the final hit; this "sustained pressure" counter is the only reliable way to overcome Ares Shield in the franchise and in the game.

### Phase Structure

```
Ares Shield — phase sequence:

Phase 1 — "ares_arming" (shield deployment):
  windUpMs: 300  (prongs deploy visibly, Ares spirit rises)
  effects during arm:
    prong_extension_ratio: 0 → 1.0 (full deploy regardless of spin)
    incomingDamageReduction: 0.40× (partial shield during deploy)

Phase 2 — "ares_shield_active" (full shield):
  durationMs: 2500
  effects:
    prong stance: fully locked (contact radius = 12mm, tipping resistance = 36×)
    reflectionFraction: base 0.40 + (incomingImpulse / MAX_IMPULSE) × 0.20
      → light hit: 40% reflected back at attacker
      → heavy hit (2000eu): min(0.60, 0.40 + 0.20) = 60% reflected
    incomingDamageToVariares: × 0.35  (70% reduction — shield absorbs most damage)
    reflected impulse direction: exactly back along attacker's approach vector
    visual: hits flash as glowing shield parry; reflected beam visible

  Spin attrition (omnidirectional passive drain on opponents):
    range: 150px from Variares center
    spinDrainRate: 6 rad/s per second while in range
    Variares spin recovery: +4 rad/s per second  (shield stance is efficient)

  forceState on opponents: must_attack, durationMs: 2500ms
  forceStateReason: passive spin drain punishes waiting; attacks are reflected but
                    still better than losing spin for free

  QTE for attacker — "Prong Saturate" (sustained combo counter):
    triggerCondition: 3 hits land within a 500ms window on the shield
    QTE_success: third hit reflection reduced to 20%; Variares takes 0.60× damage on third hit
               (prong hooks briefly overloaded by sustained pressure)
    QTE_fail (single heavy hits): full 40–60% reflection applies
    Message: "Ares Shield broken" flash if all 3 hits land — shield collapses early

Phase 3 — "ares_collapse" (shield down):
  windDownMs: 200
  if shield was saturated (QTE): prongs retract to partial (50% extension)
  if shield expired naturally: full prong retract → stamina mode (low friction)
  visual: Ares spirit dissolves, prongs visibly retract or partially collapse

powerCost: 100
cooldownMs: 4500
durationMs: 3000  (300 arm + 2500 active + 200 collapse)
```

### Reflection Scaling

```
Ares Shield — hit reflection table:

  Incoming impulse   Reflection %   Returned to attacker   Variares takes
  ─────────────────────────────────────────────────────────────────────────
  200 eu (light)     40%            80 eu                  120 eu × 0.35 = 42 eu
  500 eu (medium)    45%            225 eu                 275 eu × 0.35 = 96 eu
  1000 eu (heavy)    50%            500 eu                 500 eu × 0.35 = 175 eu
  2000 eu (max)      60%            1200 eu                800 eu × 0.35 = 280 eu
  [GAME-DERIVED]

  Key: a 2000-unit max hit returns 1200 units to the attacker and only
  delivers 280 units to Variares. The attacker deals more to themselves
  than to Variares on a max-power strike.

  Ares Paradox: harder attacks = higher reflection % = more self-damage.
  Optimal attacker play: medium-force repeated hits (400–600eu range).
  These give 45% reflection but still advance QTE saturation toward the 3-hit break.
```

```typescript
// Special move: Ares Shield
interface AresShieldState {
  active: boolean;
  hitsAbsorbed: number;
  lastHitWindowStart: number;
  hitsInWindow: number;
}

function onAresShieldHit(variares: Beyblade, state: AresShieldState, hit: HitEvent): void {
  if (!state.active) return;

  // Reflection fraction scales with hit magnitude
  const reflectionFraction = Math.min(0.60, 0.40 + (hit.impulse / 20000) * 0.20);

  // QTE saturation tracking
  const now = Date.now();
  if (now - state.lastHitWindowStart > 500) {
    state.hitsInWindow = 0;
    state.lastHitWindowStart = now;
  }
  state.hitsInWindow++;

  const saturated = state.hitsInWindow >= 3;
  const finalReflect = saturated ? 0.20 : reflectionFraction;
  const damageReduct = saturated ? 0.60 : 0.35;

  // Reflect impulse at attacker
  const reflectedImpulse = hit.impulse * finalReflect;
  const attackerAngle = Math.atan2(hit.attacker.y - variares.y, hit.attacker.x - variares.x);
  applyForce(hit.attacker.id,
    Math.cos(attackerAngle) * reflectedImpulse,
    Math.sin(attackerAngle) * reflectedImpulse);
  hit.attacker.damageReceived += BASE_DAMAGE * finalReflect;

  // Reduced damage to Variares
  variares.damageReceived += BASE_DAMAGE * (hit.impulse / 2000) * damageReduct;

  if (saturated) {
    state.active = false;  // shield broken by sustained combo
  }
}

function tickAresShield(variares: Beyblade, opponents: Beyblade[], dt: number): void {
  // Spin attrition field
  variares.spin = Math.min(variares.maxSpin, variares.spin + 4 * (dt / 1000));
  for (const opp of opponents) {
    if (distanceBetween(variares, opp) < 150) {
      opp.spin = Math.max(0, opp.spin - 6 * (dt / 1000));
    }
  }
}
```

---

## Case 652 — [COMBO] Prong Brace: Player-Skill Expression of the D:D Prong Deployment Stance

**Thesis:** Prong Brace is the combo-level expression of the D:D mode-switching gimmick (Case 650) in which the spin-dependent prong deployment is manually accelerated by the player through a 3-key input that forces prong extension for a brief window regardless of the current spin threshold; the sequence is (KKK — defense, defense, defense) representing three successive defensive inputs that each incrementally engage the prong deployment mechanism beyond the centrifugal baseline, the three-press sequence physically analogous to pressing all four prong release latches simultaneously by overccoming the return-spring resistance through sustained input rather than centrifugal force; the passive gimmick deploys prongs at ω > 300 rad/s naturally, but Prong Brace forces deployment down to ω_min = 150 rad/s — halfway to spinout — by using player input to supplement the centrifugal force deficit: the 3-key window provides an effective additional centrifugal load equivalent to (0.36 − 0.160) = 0.200 N per prong [using Case 650's centrifugal formula], bridging the gap between ω = 200 rad/s (naturally subthreshold) and the deployment threshold; this makes Prong Brace uniquely valuable in the late-match scenario where Variares is running low on spin and the passive gimmick has disengaged — at 30% spin, the opponent is most likely to push for a ring-out or burst finish, and Prong Brace allows a brief re-activation of the defensive stance at exactly the moment it matters most; the combo provides: a 600ms window of increased tipping resistance (partial prong extension at 60% ratio), a 25% incoming impulse reduction for two hits during the window, and a modest spin recovery (+8 rad/s total from the mechanical loading of the prongs); it does not provide reflection (that is exclusive to the special move) and does not provide the 36× full tipping resistance of full prong deployment — the combo is bounded by physics, providing the benefit of partial extension at below-threshold spin rather than the anime-level full shield of Ares Shield.

### Combo Specification

```
Prong Brace — combo definition:

  id: "prong-brace"
  sequence: ["defense", "defense", "defense"]  (KKK)
  windowMs: 450
  cooldownMs: 2000
  powerCost: 20
  typeRestriction: "defense"
  partRequirement: modeSwitchBottom  (D:D bottom, or any documented mode-switch tip/bottom)

  Phase 1 — "prong_engage" (first two defense inputs):
    prong extension forced: 0 → 0.60 (partial, regardless of current spin)
    effective contact radius: lerp(2mm, 12mm, 0.60) = 8mm
    tipping resistance: lerp(1.0, 36.0, 0.60²) = 1 + 35 × 0.36 = 13.6×
    spin micro-gain: +4 rad/s  (spring load energy partially transferred to spin)

  Phase 2 — "prong_brace_active" (third defense input — brace locked):
    durationMs: 600ms
    effects:
      incomingImpulseReduction: 0.25 for next 2 hits  (25% reduction from partial prong)
      tipping resistance: 13.6× (partial prong — significantly better than baseline 1×)
      invulnerabilityMs: 0  (no invulnerability — prong brace is positional, not dodge)
      spinRecovery: +4 rad/s additional (spring tension release)
      total spin gain: +8 rad/s  (4 from engage + 4 from brace — not free, spring-derived)
      visual: prongs partially visible below bey body, stance widens slightly

  Counter behavior (no auto-counter):
    Unlike Tidal Brace, Prong Brace does NOT open a counter window.
    It is a pure defensive stance — absorb and hold position.
    Player must manually chain an attack combo after the brace expires.

  NO reflection  (special move only)
  NO spin attrition on opponents  (no aura — just stance)
  NO full 36× tipping resistance  (partial prongs = partial benefit)

  ceiling compliance:
    damageMultiplier: none (no offensive component)             ✓
    lockMs: 0                                                   ✓
    invulnerabilityMs: 0                                        ✓
    spin gain: +8 rad/s total (spring-derived, not free)        ✓
    impulse reduction: 25% (2 hits) — below special move level  ✓
```

### Prong Brace vs Ares Shield vs Tidal Brace

```
                 Prong Brace      Ares Shield       Tidal Brace
                 (Combo, KKK)     (Special, 100p)   (Combo, Case 646, ↓↓K)
──────────────────────────────────────────────────────────────────────────
Activation       Manual 3-press   1-button          Manual 3-key
Prong extension  60% (partial)    100% (full)       N/A (different gimmick)
Tipping resist.  13.6× baseline   36× baseline      N/A
Hit reduction    25% (2 hits)     65% per hit        35.7% (2 hits)
Counter window   None             None (reflect)     400ms
Reflection       None             40–60% returned   None
Spin gain        +8 rad/s         +4 rad/s passive   +10 per absorbed hit
Force state      None             must_attack        None
Works at low ω?  Yes (min 150)    Yes (any spin)     Yes (ball tip)
Best use         Late-match       Arena control      Defense + counter
                 low-spin brace   + reflection       

Key difference: Prong Brace is the late-game survival tool; Ares Shield is the
arena-dominating ultimate. Both derived from the same D:D prong deployment gimmick.
```

---

*Next cases will continue as new franchise moves are provided. Each batch follows the same pattern: Gimmick case → Special Move case(s) → Combo case(s) derived from the same gimmick.*

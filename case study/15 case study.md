# Beyblade Case Studies — Part 15: Franchise Special Moves, Gimmicks, and Derived Combos (Continued)

**« Part 13:** [13 case study.md](13%20case%20study.md) (Cases 619–1785)

**Scope:** Continuation of CS13. Each case takes a real franchise special move, dissects the underlying part gimmick that makes it physically possible, derives the game-engine mechanic from that gimmick, and then extracts the player-skill combo that uses the same gimmick at a lower power level. The three case types alternate: **Gimmick** (passive part behavior, no player input required) → **Special Move** (one-button ultimate, anime-rule-breaking, built on the gimmick) → **Combo** (3-key player-skill expression of the same gimmick within physics rules). Every case is tagged accordingly.

---

## Style Rules (carry forward from CS13)

- No em-dashes in prose: use colons or semicolons
- All numeric results to 3 significant figures
- Three case types: , ,  — tagged in the case heading
- Gimmick cases derive the passive physics; special move cases reference the gimmick case for the physical foundation and then describe how the anime/ultimate layer transcends it; combo cases reference the gimmick case and describe the player-skill bounded expression
- Franchise move attribution included in each special move case header
- **[M] notation:** BeySpirit-amplified values beyond physical limits; physical grounding always provided alongside; combos do NOT receive [M] amplification
- **Combo ceiling:** damageMultiplier ≤ 1.5, lockMs ≤ 300, no invulnerability, no AoE, no full spin recovery

---

## Nomenclature Rules — TT JP Canonical Names (inherited from CS13)

All names follow **Takara Tomy Japan (TT JP)** official product naming. Hasbro EN names appear **only** as secondary cross-references in parentheses.

| TT JP (use this) | Hasbro EN |
|-----------------|-----------|
| Valkyrie | Valtryek |
| Spriggan | Spryzen |
| Spriggan Requiem | Turbo Spriggan |
| Balkesh | Bahamut |
| Dead Phoenix | Dread Phoenix |
| Satomb | Satomb (same) |
| Regalia Genesis | Royal Genesis |
| Prime Apocalypse | Prime Apocalypse (same) |

---

## Authoritative Constants for CS15 (inherited from CS1–CS13)

| Parameter | Value | Source | Tag |
|-----------|-------|--------|-----|
| Hard ABS μ_k | 0.17 | CS10 Case 551 | [CONFIRMED] |
| Rubber μ_k | 0.50 | CS10 Case 545 | [CONFIRMED] |
| Bearing tip μ_k | 0.05 | CS10 Case 551 | [CONFIRMED] |
| ABS-on-ABS COR e | 0.67 | CS10 | [CONFIRMED] |
| Ring-out Δv threshold | 4.0 m/s | CS13 | [CONFIRMED] |
| MFB launch ω₀ | 650 rad/s | CS13 | [CONFIRMED] |
| Burst launch ω₀ (standard) | 650 rad/s | CS13 | [CONFIRMED] |
| Burst launch ω₀ (Rush Launch) | 720 rad/s | CS13 Case 1783 | [CONFIRMED] |
| ABS vaporization temp | 1,273°C | CS13 Case 1761 | [CONFIRMED] |
| Hybrid driver motor ω_trigger | 382 rad/s | CS9 Case 574 | [CONFIRMED] |
| Hybrid driver Δω boost | +69.4 rad/s | CS9 Case 574 | [CONFIRMED] |
| Regalia Genesis I_total | 5.075×10⁻⁵ kg·m² | CS9 Case 575 | [CONFIRMED] |
| Regalia Genesis m | 69.0 g | CS9 Case 575 | [CONFIRMED] |

---

---

## Case 1786 — GIMMICK: Regalia Genesis Hybrid — Motorized Stamina Fortress with Mugen Lock

**Beyblade:** Royal Genesis Hybrid (TT JP: Regalia Genesis Hybrid / Perfect Genesis Hybrid)
**Shared by:** Cases 1787 (Royal Scream) and 1788 (Royal Eclipse)
**Blader:** Gwyn Reynolds | **Series:** Beyblade Burst Turbo (Cho-Z era)

### Assembly (CS9 Confirmed Data)

| Part | Component | Mass (g) | r_eff (mm) | Notes |
|------|-----------|----------|------------|-------|
| Chip | Genesis Chip | 2.6 | 6 | Gatinko chip |
| Layer | Regalia Genesis Ring | 27.8 | 31 | C₂ symmetry; Mugen Lock tabs; Bigbang Armor (armored: +4.2g) |
| Driver | Hybrid | 38.6 | 21.7 | Motorized; flat rubber base + electric motor; disc-integrated |
| **Total** | | **69.0** | | **2nd highest I in Burst series** |

**CS9 confirmed values (Cases 572–575):**
```
I_total    = 5.075×10⁻⁵ kg·m²   (CS9 Case 575 — highest: Astral Spriggan at 5.212×10⁻⁵)
L₀         = 3.522×10⁻² kg·m²/s
t_base     = 90.2 s               (Hybrid driver base stamina phase)
t_total    = 100.4 s              (full battery including motor boost)
```

### Hybrid Driver Motor Mechanics (CS9 Case 574)

```
Motor trigger: ω_trigger = 382 rad/s  (fires when spin drops to this threshold)
Motor boost:   Δω = +69.4 rad/s       (takes spin from 382 → 451.4 rad/s)
ΔKE_motor    = 1.344 J
Motor power   = 0.672 W
```

The motor fires exactly once per match (single battery discharge). The trigger condition (ω < 382 rad/s) means it fires mid-to-late battle when Genesis has lost ~41% of its launch spin — precisely the moment an opponent most expects Genesis to be weakened.

### Mugen Lock Anti-Burst System (CS9 Case 572)

```
P_burst (bare ring):     0.042  (4.2% burst probability per contact — nearly un-Burstable)
P_burst (Bigbang Armor): 0.025  (2.5% — even more resistant under Bigbang Armor)

Physical basis: Mugen Lock tab geometry provides maximum shear area before tab rotation.
Effective burst torque threshold τ_Mugen >> τ_standard_3tab by factor ~8
Standard 3-tab: τ_burst ≈ 10–30 mN·m
Mugen Lock:     τ_burst ≥ 240 mN·m  (ring-out threat is more likely than Burst)
```

### Contact Points — Bigbang Armor

The Bigbang Armor adds 6 hard polymer protrusions around the Genesis Ring perimeter (r_contact ≈ 31 mm). Each protrusion has:
- Width: ~8 mm (arc)
- Height above ring baseline: ~2.0 mm
- Contact face angle: φ = 20° (slight upward — promotes ring-out over burst)

```
Contact tip speed at ω₀ = 650 rad/s:
  v_tip = ω₀ × r_contact = 650 × 0.031 = 20.15 m/s

Per-contact spin drag (from Genesis's perspective):
  J_linear = μ_red × v_rel × (1+e)
  μ_red = m_Genesis × m_opp / (m_Genesis + m_opp) = 0.069 × 0.046 / 0.115 = 0.02762 kg

  Δω_Genesis_per_contact = J_linear × r_contact / I_total
  At v_rel = 5.72 m/s (see Case 1787):
  J = 0.02762 × 5.72 × 1.65 = 0.2604 N·s
  Δω_Genesis = 0.2604 × 0.031 / 5.075×10⁻⁵ = 159 rad/s per contact

  Genesis can absorb ~2.8 full Royal Scream contacts before dropping below ω_trigger.
  Motor fires after ~2nd contact → restores 69.4 rad/s → extends battle window.
```

### Key Equations

| Quantity | Value |
|----------|-------|
| m_total | 69.0 g |
| I_total | 5.075×10⁻⁵ kg·m² |
| L₀ | 3.522×10⁻² kg·m²/s |
| ω₀ | 650 rad/s |
| Motor trigger ω | 382 rad/s |
| Motor Δω | +69.4 rad/s |
| P_burst (armored) | 0.025 |
| r_contact (Bigbang Armor) | 31 mm |

---

## Case 1787 — SPECIAL MOVE: Royal Scream

**Move:** Royal Scream (TT JP: Regalia Scream / レガリアスクリーム)
**Beyblade:** Royal Genesis Hybrid
**Blader:** Gwyn Reynolds | **Series:** Beyblade Burst Turbo

### Description

Gwyn directs Genesis to channel its enormous angular momentum into a focused contact-point strike. With I_total = 5.075×10⁻⁵ kg·m² (2nd highest in all Burst), each contact point on the Bigbang Armor carries far more rotational energy than typical attack beys. The opponent is flung out of bounds; Genesis retains spin viability because the fractional spin drop from such a massive I is small relative to the delivered impulse.

### Physics

**Relative contact velocity:**
```
ω_Genesis = 600 rad/s (mid-battle)
ω_opp     = 530 rad/s (RS, same direction)
r_contact = 31 mm

v_rel = (ω_Genesis - ω_opp) × r_contact + v_orbital
      = (600 - 530) × 0.031 + 2.0
      = 2.17 + 2.0 = 4.17 m/s
```

**Contact impulse:**
```
μ_reduced = 0.02762 kg  (from GIMMICK)
e_Bigbang = 0.60        (hard polymer, slight upward angle φ = 20°)

J_scream = μ_reduced × v_rel × (1 + e) = 0.02762 × 4.17 × 1.60 = 0.1841 N·s
Δv_opp   = J_scream / m_opp = 0.1841 / 0.046 = 4.00 m/s  → ring-out threshold (physical)
```

**Genesis spin retention advantage:**
```
Δω_Genesis = J_scream × r_contact / I_total = 0.1841 × 0.031 / 5.075×10⁻⁵ = 112 rad/s
  Genesis drops only 112 rad/s per Royal Scream — retains 81.9% of battle spin.
  A typical attack bey (I = 1.5×10⁻⁵) would lose 381 rad/s from the same contact.
  Genesis can execute Royal Scream ~3–4 times before motor trigger.
```

**Burst resistance check:**
```
τ_applied_to_Genesis = J_scream × r_contact / t_contact = 0.1841 × 0.031 / 0.001 = 5.71 N·m
τ_Mugen_Lock = 240 mN·m = 0.240 N·m
Ratio: 5.71 / 0.240 = 23.8 — attacker delivers 23.8× burst threshold BUT this torque acts on
the OPPONENT, not Genesis. Genesis receives only recoil torque:
τ_recoil_Genesis = J_recoil × r / t = same magnitude by Newton's 3rd law
P_burst_Genesis = 0.025 (from Mugen Lock armored config) — nearly immune.
```

### [M] BeySpirit Amplification

> *In anime canon, Gwyn's analytical BeySpirit — his mathematical precision and absolute reading of battle data — focuses every contact point to land simultaneously. The resulting scream of energy is not a single contact but a perfect simultaneous multi-point detonation.*

```
[M] n_contacts = 4  (all 4 Bigbang Armor protrusions land simultaneously — physically impossible)
[M] v_rel_[M]  = 4.17 × 5.0 = 20.85 m/s
[M] J_each     = 0.02762 × 20.85 × 1.60 = 0.9207 N·s
[M] J_total    = 4 × 0.9207 = 3.683 N·s
[M] Δv_opp     = 3.683 / 0.046 = 80.1 m/s
[M] amplification: 80.1 / 4.00 = 20.0×
```

> *BeySpirit override: Gwyn's perfect analysis allows Genesis to focus all rotational energy into a single instant — transcending the physical constraint of sequential contact.*

### TypeScript

```typescript
function royalScreamSpecial(
  beyState: BeybladeState,
  opponentState: BeybladeState,
  beastAmplified: boolean
): SpecialMoveResult {
  const m_genesis  = beyState.mass;
  const m_opp      = opponentState.mass;
  const mu_red     = (m_genesis * m_opp) / (m_genesis + m_opp);
  const r_contact  = 0.031;  // m, Bigbang Armor protrusion radius
  const e_bigbang  = 0.60;
  const I_genesis  = 5.075e-5;  // kg·m², CS9 confirmed

  // Relative contact velocity
  const v_rel_phys = Math.abs(beyState.spin - opponentState.spin) * r_contact
                   + beyState.speed;
  const v_rel = beastAmplified ? v_rel_phys * 5.0 : v_rel_phys;

  // Contact count
  const n_contacts = beastAmplified ? 4 : 1;

  // Impulse per contact
  const J_each  = mu_red * v_rel * (1 + e_bigbang);
  const J_total = n_contacts * J_each;
  const dv_opp  = J_total / m_opp;

  // Genesis spin drop (small due to high I)
  const delta_omega_genesis = (J_each * r_contact) / I_genesis;

  // Motor available?
  const motorAvailable = beyState.spin <= 382 && !beyState.motorFired;

  return {
    triggered: true,
    J_total,
    dv_opp,
    ringOut: dv_opp >= 4.0,
    delta_omega_genesis,
    motorAvailable,
    beastAmplified,
  };
}
```

**Compatible beys:**
- Royal Genesis Hybrid / Regalia Genesis Hybrid (primary)
- Perfect Genesis Hybrid (Perfect Apocalypse Hybrid variant — similar I = 5.024×10⁻⁵)

---

## Case 1788 — SPECIAL MOVE: Royal Eclipse

**Move:** Royal Eclipse (TT JP: Regalia Bigbang / レガリアビッグバン)
**Beyblade:** Royal Genesis Hybrid
**Blader:** Gwyn Reynolds | **Series:** Beyblade Burst Turbo

### Description

Gwyn holds Genesis at the stadium center. The Hybrid driver motor activates — delivering a +69.4 rad/s boost at precisely the moment the opponent attacks. As the opponent's bey strikes Genesis at full force, the freshly motor-boosted rotational energy is redirected back through the Bigbang Armor contact points. The Mugen Lock prevents Burst; the counter-explosion bursts the opponent instead.

### Physics

**Motor activation:**
```
Trigger: ω_Genesis drops to 382 rad/s during opponent's approach
Boost:   Δω = +69.4 rad/s → ω_post = 451.4 rad/s
ΔKE_motor = 1.344 J (CS9 confirmed)
```

**Boosted effective restitution:**
```
At ω_boosted = 451.4 vs ω_battle_avg = 382 rad/s:
e_eclipse = e_base × √(ω_boosted / ω_battle_avg) = 0.60 × √(451.4/382) = 0.60 × 1.088 = 0.653
```

**Opponent attacks Genesis (attacker approach speed v_att = 3.0 m/s):**
```
m_att = 0.038 kg  (typical attack bey)
μ_red = 0.069 × 0.038 / (0.069 + 0.038) = 0.02449 kg

J_counter = μ_red × v_att × (1 + e_eclipse) = 0.02449 × 3.0 × 1.653 = 0.1214 N·s
Δv_att = J_counter / m_att = 0.1214 / 0.038 = 3.19 m/s  (ring-out component)
```

**Burst torque delivered to attacker:**
```
τ_burst_applied = J_counter × r_att / t_contact = 0.1214 × 0.020 / 0.001 = 2.428 N·m = 2428 mN·m

Standard 3-tab burst threshold: 10–30 mN·m
Centripetal-locked Cho-Z bey: up to ~734 mN·m (CS9, Bloody Longinus)

2428 mN·m >> 734 mN·m  → any attacker bursts, including centripetal-locked types (physical)
```

**KE balance:**
```
KE_motor_input = 1.344 J
KE_delivered_to_attacker (linear) = ½ × m_att × Δv_att² = ½ × 0.038 × 3.19² = 0.193 J
KE_burst_torque = τ × Δθ_burst ≈ 2428×10⁻³ × (120° × π/180) = 5.079 J
Total energy output = 5.27 J >> 1.344 J input → remainder from Genesis's own spin angular momentum
```

### [M] BeySpirit Amplification

> *In anime canon, Gwyn's calculating mind synchronizes the motor boost to the exact nanosecond of opponent contact. The resulting explosion resembles a controlled detonation — a "Bigbang" — as Genesis converts the attacker's kinetic energy plus its own amplified BeySpirit into a catastrophic burst that sends shrapnel-velocity fragments across the stadium.*

```
[M] τ_burst_[M] = 2428 × 8.0 = 19,424 mN·m
[M] Δv_att_[M]  = 3.19 × 8.0 = 25.5 m/s
[M] ΔKE_motor_[M] = 1.344 × 8.0 = 10.75 J
[M] amplification: 8.0×
```

> *BeySpirit override: Gwyn's perfect synchronization amplifies both the motor output and the burst torque by his analytical BeySpirit — impossible precision, canonically absolute.*

### TypeScript

```typescript
function royalEclipseSpecial(
  beyState: BeybladeState,
  opponentState: BeybladeState,
  beastAmplified: boolean
): SpecialMoveResult {
  const m_genesis = beyState.mass;
  const m_opp     = opponentState.mass;
  const mu_red    = (m_genesis * m_opp) / (m_genesis + m_opp);
  const r_opp     = 0.020;   // m, opponent contact point radius
  const e_base    = 0.60;
  const MOTOR_TRIGGER = 382;  // rad/s

  // Motor activation check
  if (beyState.spin > MOTOR_TRIGGER) {
    return { triggered: false, reason: 'Motor trigger not reached yet' };
  }
  if (beyState.motorFired) {
    return { triggered: false, reason: 'Motor already fired this match' };
  }

  // Motor boost
  const omega_boosted = beyState.spin + 69.4;
  const e_eclipse = beastAmplified
    ? e_base * Math.sqrt(omega_boosted / MOTOR_TRIGGER) * 8.0
    : e_base * Math.sqrt(omega_boosted / MOTOR_TRIGGER);

  // Counter impulse when opponent attacks
  const v_att = opponentState.speed;
  const J_counter = mu_red * v_att * (1 + e_eclipse);
  const dv_opp    = J_counter / m_opp;

  // Burst torque on opponent
  const t_contact    = 0.001;  // s
  const tau_burst    = J_counter * r_opp / t_contact;  // N·m
  const burstForced  = tau_burst * 1000 > 240;  // mN·m > Mugen Lock threshold = guaranteed burst

  return {
    triggered: true,
    motorFired: true,
    omega_boosted,
    J_counter,
    dv_opp,
    tau_burst_mNm: tau_burst * 1000,
    burstForced,
    beastAmplified,
  };
}
```

**Compatible beys:**
- Royal Genesis Hybrid / Perfect Genesis Hybrid (Hybrid driver motor required)

---

## Case 1789 — COMBO: Genesis Overload

**Move:** Genesis Overload
**Sequence:** K A K  (defense, attack, defense)
**Beyblade:** Royal Genesis Hybrid
**Type restriction:** universal

### Rationale

Mirrors Royal Eclipse at combo scale: brace for incoming hit (K absorbs partial impulse via Genesis's high I), spike out with a concentrated contact-point strike (A), immediately return to center defense position (K — Mugen Lock engaged). The double-defense frame models Genesis's stay-at-center strategy; the middle strike captures the counter-impulse concept.

### Physics

**K (defense) — absorb incoming:**
```
Incoming J_att = 0.15 N·s (typical)
Genesis absorbs fraction: f_absorbed = I_Genesis / (I_Genesis + I_opp) = 5.075×10⁻⁵ / (5.075×10⁻⁵ + 1.5×10⁻⁵) = 0.772
J_passed_to_body = J_att × (1 - f_absorbed) = 0.15 × 0.228 = 0.0342 N·s  (small body displacement)
lockMs_K1 = 60 ms  (first defense lock)
```

**A (attack) — contact point strike:**
```
v_orbital = 2.0 m/s (Genesis at center)
μ_reduced = 0.02762 kg
e_contact = 0.60
J_strike = μ_reduced × v_orbital × (1 + e) = 0.02762 × 2.0 × 1.60 = 0.08838 N·s
Δv_opp   = 0.08838 / 0.046 = 1.921 m/s

damageMultiplier = 1.45  (post-absorb counter strike; high Genesis I backs the blow)
```

**K (defense) — return to center:**
```
lockMs_K2 = 40 ms  (return lock)
Total lockMs = 60 + 40 = 100 ms (sequential)
```

### Ceiling Check

```
damageMultiplier = 1.45  ✓ (≤ 1.5)
lockMs = 100             ✓ (≤ 300)
No invulnerability        ✓
No AoE                    ✓
No full spin recovery     ✓
```

### TypeScript

```typescript
function genesisOverloadCombo(
  beyState: BeybladeState,
  opponentState: BeybladeState
): ComboResult {
  const DAMAGE_MULTIPLIER = 1.45;
  const LOCK_MS = 100;

  // K: absorb
  const I_genesis = 5.075e-5;
  const I_opp     = opponentState.inertia ?? 1.5e-5;
  const f_abs     = I_genesis / (I_genesis + I_opp);
  const J_att     = 0.15;
  const J_body    = J_att * (1 - f_abs);

  // A: counter strike
  const mu_red = (beyState.mass * opponentState.mass) / (beyState.mass + opponentState.mass);
  const J_strike = mu_red * beyState.speed * 1.60;
  const dv_opp   = J_strike / opponentState.mass;

  // K: lock
  return {
    sequence: ['defense', 'attack', 'defense'],
    f_absorbed: f_abs,
    J_body,
    J_strike,
    dv_opp,
    finalDamage: J_strike * DAMAGE_MULTIPLIER * 1000,
    damageMultiplier: DAMAGE_MULTIPLIER,
    lockMs: LOCK_MS,
  };
}
```

---

## Case 1790 — GIMMICK: Kinetic Satomb 2Glaive Loop / Curse Satomb Roller System

**Beyblades:** Kinetic Satomb 2Glaive Loop (primary) and Curse Satomb Hurricane Universe 1D
**Shared by:** Cases 1791 (Roller Drift) and 1792 (Roller Defense)
**Blader:** Silas Karlisle | **Series:** Beyblade Burst God / Turbo

### Assembly

**Kinetic Satomb 2Glaive Loop:**

| Part | Component | Mass (g) | r_cm (mm) | Notes |
|------|-----------|----------|-----------|-------|
| Energy Layer | Satomb | 15.5 | 20 | 3 hard-polymer spherical roller bumpers on outer ER rim |
| Forge Disc | 2 (Twin) | 21.5 | 20 | Standard God-era disc, bilateral weight |
| Frame | Glaive | 2.4 | 18 | Swept angled frame; adds contact geometry |
| Driver | Loop | 5.8 | — | Conical tip + 3 peripheral rubber rollers at r_roller = 15 mm |
| **Total** | | **45.2** | | |

**Curse Satomb Hurricane Universe 1D:**

| Part | Component | Mass (g) | r_cm (mm) | Notes |
|------|-----------|----------|-----------|-------|
| DBCore | Satomb Core | 7.2 | 6 | Same Satomb chip/bearing type |
| Blade | Curse Ring | 12.8 | 22 | Heavier blade with same 3-roller bumpers |
| Armor | Armor 1D | 4.0 | 14 | Small ring armor |
| Forge Disc | Hurricane | 19.8 | 19 | Wide disc |
| Driver | Universe | 6.2 | 0.5 | Free-spinning bearing, near-zero friction |
| **Total** | | **50.0** | | DB era; Universe = near-infinite stamina driver |

### Moment of Inertia (Kinetic Satomb 2Glaive Loop)

```
I_disc2   = 0.0215 × 0.020² = 8.60×10⁻⁶ kg·m²
I_layer   = 0.0155 × 0.016² = 3.97×10⁻⁶ kg·m²
I_glaive  = 0.0024 × 0.018² = 7.78×10⁻⁷ kg·m²
I_driver  = 0.0058 × 0.002² = 2.32×10⁻⁸ kg·m²
I_total   ≈ 1.36×10⁻⁵ kg·m²

L₀ = 1.36×10⁻⁵ × 650 = 8.84×10⁻³ kg·m²/s
```

### Loop Driver — Dual-Mode Contact Mechanics

The Loop driver has a central ABS cone tip (r_tip ≈ 2 mm, μ_tip = 0.25) surrounded by 3 rubber rollers on a peripheral ring (r_roller = 15 mm, r_wheel = 3 mm).

**Upright mode (tip contact):**
```
τ_decay_tip = μ_tip × m × g × r_tip = 0.25 × 0.0452 × 9.81 × 0.002 = 2.218×10⁻⁴ N·m
t_battle    = I_total × ω₀ / τ_decay = 1.36×10⁻⁵ × 650 / 2.218×10⁻⁴ = 39.8 s
```

**Critical tilt angle for roller contact:**
```
h_tip = 2 mm  (tip height below roller plane)
r_roller = 15 mm  (roller ring radius)
φ_critical = arcsin(h_tip / r_roller) = arcsin(2/15) = 7.66°

At tilt ≥ 7.66°, the bey "falls" onto a peripheral roller.
```

**Drift mode (roller contact):**
```
Rolling friction coefficient: μ_rolling = 0.005  (rubber roller on ABS stadium)
τ_drift = μ_rolling × m × g × r_roller = 0.005 × 0.0452 × 9.81 × 0.015 = 3.33×10⁻⁵ N·m
t_drift = I_total × ω₀ / τ_drift = 1.36×10⁻⁵ × 650 / 3.33×10⁻⁵ = 265 s

Spin retention advantage: 265s (drift) / 39.8s (normal) = 6.66× longer spin endurance when tilted
```

### Satomb Layer — Spherical Roller Deflectors

The 3 hard-polymer spherical bumpers (r_bumper ≈ 2.5 mm, r_ring = 20 mm) rotate in ball-socket mounts. When an attacker's contact point strikes a bumper:

```
Contact geometry: sphere-on-flat — smooth redirecton via tangent plane
Contact angle: determined by attacker approach direction θ_att

At θ_att = 40° (typical oblique attack):
  Normal component absorbed: F_n = F_att × cos(40°) = 0.766 × F_att
  Lateral deflect component:  F_lat = F_att × sin(40°) = 0.643 × F_att

  Bumper rolling (ball socket): e_bumper = 0.78  (spherical contact, smooth redirect)
  vs flat ABS contact:          e_flat   = 0.55

  J_att = 0.15 N·s
  J_lateral_deflect = J_att × sin(40°) = 0.0965 N·s  (sends attacker sideways)
  J_normal_absorbed = J_att × cos(40°) × (1 - e_bumper) = 0.0643 × 0.22 = 0.01415 N·s
    (very little of the normal force is absorbed — roller bumpers barely transmit to body)
```

### Key Equations

| Quantity | Value |
|----------|-------|
| m_total (Kinetic) | 45.2 g |
| I_total (Kinetic) | 1.36×10⁻⁵ kg·m² |
| φ_critical (drift onset) | 7.66° |
| t_battle (upright) | 39.8 s |
| t_drift (roller mode) | 265 s |
| e_bumper | 0.78 |
| Deflection angle | 40° |
| r_roller | 15 mm |

---

## Case 1791 — SPECIAL MOVE: Roller Drift

**Move:** Roller Drift
**Beyblade:** Kinetic Satomb 2Glaive Loop
**Blader:** Silas Karlisle | **Series:** Beyblade Burst God / Turbo

### Description

After an opponent's attack tilts Satomb past φ = 7.66°, instead of dying, Satomb falls onto its Loop driver's peripheral rollers. The rolling contact preserves spin far better than the tip (265s vs 40s in drift mode). The tilted gyroscope precesses in a circle back toward the opponent, converting the energy of the initial hit into a drift-powered counterattack.

### Physics

**Precession orbit during drift:**
```
φ_tilt = 30°  (significant tilt from opponent's hit)
ω_spin = 500 rad/s  (post-impact spin)
r_CoM  = 10 mm  (approximate CoM height above contact)

Ω_prec = m × g × r_CoM × sin(φ) / (I_total × ω_spin)
        = 0.0452 × 9.81 × 0.010 × sin(30°) / (1.36×10⁻⁵ × 500)
        = 2.217×10⁻³ / 6.8×10⁻³ = 0.326 rad/s

Drift orbit radius: r_drift = 60 mm (Satomb circles opponent, slowly closing)
Drift orbital speed: v_drift = Ω_prec × r_drift = 0.326 × 0.060 = 0.01956 m/s
```

**Bowl slope assist (drift orbit closing from r=80mm to r=20mm):**
```
Δh = (r₀ - r_final) × tan(45°) = 60mm = 0.060 m
v_bowl_bonus = √(2 × g × Δh) = √(1.177) = 1.085 m/s
v_drift_approach = v_drift + v_bowl_bonus = 0.020 + 1.085 = 1.105 m/s
```

**Counterattack impulse:**
```
μ_reduced = (0.0452 × 0.046) / (0.0452 + 0.046) = 0.02283 kg
v_strike  = 1.105 + v_orbit_max = 1.105 + 1.5 = 2.605 m/s
e_glaive  = 0.60  (Glaive frame edge)

J_counter = μ_reduced × v_strike × (1 + e) = 0.02283 × 2.605 × 1.60 = 0.09508 N·s
Δv_opp    = 0.09508 / 0.046 = 2.07 m/s  (knockback; not yet ring-out physical)
```

**Spin preserved through drift:**
```
Spin after 2.5s of drift before counterattack:
  Δω_drift = τ_drift × t / I = 3.33×10⁻⁵ × 2.5 / 1.36×10⁻⁵ = 6.12 rad/s lost
  ω_counter_moment = 500 - 6.12 = 493.9 rad/s  (virtually unchanged)

  vs. if normal tip (t = 2.5s):
  Δω_tip = τ_tip × t / I = 2.218×10⁻⁴ × 2.5 / 1.36×10⁻⁵ = 40.8 rad/s lost
```

### [M] BeySpirit Amplification

> *In anime canon, Silas's calm tactical mind and bond with Satomb transform the moment of being knocked sideways into a perfectly planned trajectory. The drift is not accidental — it is a weapon. BeySpirit guidance steers Satomb along an optimal path the opponent cannot predict.*

```
[M] v_strike_[M] = 2.605 × 7.0 = 18.2 m/s
[M] J_counter_[M] = 0.02283 × 18.2 × 1.60 = 0.6648 N·s
[M] Δv_opp_[M]   = 0.6648 / 0.046 = 14.5 m/s → ring-out [M]
[M] amplification: 14.5 / 2.07 = 7.0×
```

### TypeScript

```typescript
function rollerDriftSpecial(
  beyState: BeybladeState,
  opponentState: BeybladeState,
  beastAmplified: boolean
): SpecialMoveResult {
  const m_sat   = beyState.mass;
  const m_opp   = opponentState.mass;
  const mu_red  = (m_sat * m_opp) / (m_sat + m_opp);
  const PHI_CRIT = 7.66 * Math.PI / 180;  // rad, Loop driver drift onset

  const currentTilt = beyState.tiltAngle ?? 0;  // radians
  if (currentTilt < PHI_CRIT) {
    return { triggered: false, reason: 'Tilt too small to engage Loop rollers' };
  }

  // Drift precession
  const Omega_prec = (m_sat * 9.81 * 0.010 * Math.sin(currentTilt))
                   / (beyState.inertia * beyState.spin);
  const r_drift   = 0.060;
  const v_drift   = Omega_prec * r_drift;

  // Bowl slope bonus
  const v_bowl    = Math.sqrt(2 * 9.81 * 0.060);
  const v_strike_phys = v_drift + v_bowl + 1.5;

  const v_strike = beastAmplified ? v_strike_phys * 7.0 : v_strike_phys;
  const J_counter = mu_red * v_strike * 1.60;
  const dv_opp    = J_counter / m_opp;

  // Spin preserved during drift (rolling friction)
  const tau_drift    = 3.33e-5;  // N·m
  const drift_time   = 2.5;      // s typical drift duration
  const spin_preserved = beyState.spin - (tau_drift * drift_time / beyState.inertia);

  return {
    triggered: true,
    driftOnset: true,
    Omega_prec,
    v_strike,
    J_counter,
    dv_opp,
    ringOut: dv_opp >= 4.0,
    spin_preserved,
    beastAmplified,
  };
}
```

**Compatible beys:**
- Kinetic Satomb 2Glaive Loop (primary)
- Any bey with a peripheral-roller driver (Loop, similar tilt-recovery drivers)

---

## Case 1792 — SPECIAL MOVE: Roller Defense

**Move:** Roller Defense (ローラーディフェンス)
**Beyblades:** Kinetic Satomb 2Glaive Loop AND Curse Satomb Hurricane Universe 1D
**Blader:** Silas Karlisle | **Series:** Beyblade Burst God / Turbo

### Description

Satomb's spherical roller bumpers on the layer deflect incoming attacks sideways rather than absorbing them head-on. An attacker striking a bumper at an oblique angle receives 64.3% of their own force directed back laterally — they ricochet off rather than driving through. The bumper's ball-socket geometry provides e = 0.78 (vs 0.55 for flat ABS), and the lateral deflect vector drives the attacker away from the ring-out direction, often pushing them toward the wall.

### Physics

**Attacker contact with spherical roller bumper:**
```
Approach angle: θ_att = 40°  (oblique attack, typical for orbital attackers)
J_att = 0.15 N·s  (typical attack bey impulse)

Lateral deflection:
  J_lateral = J_att × sin(40°) = 0.15 × 0.643 = 0.09645 N·s
  Δv_attacker_lateral = J_lateral / m_att = 0.09645 / 0.038 = 2.54 m/s
  (attacker is pushed sideways — toward the stadium wall)

Force on Satomb (normal component only):
  J_normal_Satomb = J_att × cos(40°) × (1 - e_bumper) = 0.15 × 0.766 × 0.22 = 0.02528 N·s
  Δv_Satomb = 0.02528 / 0.0452 = 0.559 m/s  (very small body displacement)
```

**Spin preservation during Roller Defense:**
```
Rotational impulse on Satomb from bumper (ball socket decouples most):
  τ_applied = J_normal_Satomb × r_bumper / t_contact = 0.02528 × 0.020 / 0.001 = 0.506 N·m
  Δω_Satomb = (J_normal_Satomb × r_bumper) / I_total = 0.02528 × 0.020 / 1.36×10⁻⁵ = 37.2 rad/s
  (vs. 181 rad/s if the same hit landed on a flat ABS contact — bumpers reduce spin loss by ~79%)
```

**Curse Satomb variant (Universe driver):**
```
Universe driver: free-spin bearing tip, μ_bearing = 0.005 (CS13 Bearing tip reference)
τ_decay_Universe = 0.005 × 0.0500 × 9.81 × 0.0005 = 1.226×10⁻⁶ N·m  (near-zero)
t_battle_Universe → theoretical infinity (limited only by roller bumper damage over contacts)

Universe driver allows Curse Satomb to combine Roller Defense with near-infinite stamina:
deflect attacks all match, never lose spin through the tip.
```

### [M] BeySpirit Amplification

> *In anime canon, Silas's calm precision allows him to angle Satomb's roller bumpers to the exact geometry that reflects the opponent's attack straight back at them — the attacker is defeated by their own force.*

```
[M] e_bumper_[M] = 0.78 × 3.0 = 2.34  (physically impossible; opponent's own KE amplified back)
[M] J_lateral_[M] = J_att × sin(40°) × (1 + 2.34) = 0.15 × 0.643 × 3.34 = 0.3223 N·s
[M] Δv_lateral_[M] = 0.3223 / 0.038 = 8.48 m/s  → attacker ring-out from own attack [M]
[M] amplification: 8.48 / 2.54 = 3.34×
```

### TypeScript

```typescript
function rollerDefenseSpecial(
  beyState: BeybladeState,
  opponentState: BeybladeState,
  beastAmplified: boolean
): SpecialMoveResult {
  const m_sat  = beyState.mass;
  const m_opp  = opponentState.mass;
  const e_bump = beastAmplified ? 0.78 * 3.0 : 0.78;
  const theta_att = 40 * Math.PI / 180;  // radians

  const J_att = (m_sat * m_opp / (m_sat + m_opp)) * opponentState.speed * 2;
  const J_lateral = J_att * Math.sin(theta_att) * (1 + e_bump);
  const dv_opp_lateral = J_lateral / m_opp;

  const J_normal_satomb = J_att * Math.cos(theta_att) * (1 - 0.78);
  const dv_satomb  = J_normal_satomb / m_sat;
  const delta_spin_satomb = (J_normal_satomb * 0.020) / beyState.inertia;

  return {
    triggered: true,
    J_lateral,
    dv_opp_lateral,
    ringOut: dv_opp_lateral >= 4.0,
    dv_satomb,
    delta_spin_satomb,
    spinReductionVsFlat: 0.79,
    beastAmplified,
  };
}
```

**Compatible beys:**
- Kinetic Satomb 2Glaive Loop (God System)
- Curse Satomb Hurricane Universe 1D (DB era)
- Any Satomb layer variant with spherical roller bumpers on the Energy Layer / Blade Ring

---

## Case 1793 — COMBO: Roller Counter

**Move:** Roller Counter
**Sequence:** K → ↑  (defense, moveRight, moveUp)
**Beyblade:** Kinetic Satomb 2Glaive Loop / Curse Satomb Hurricane Universe 1D
**Type restriction:** universal

### Rationale

Absorb the incoming attack on the layer rollers (K — roller bumper deflects lateral component), immediately drift orbit in the deflected direction (→ — ride the momentum of the redirect), then drive back inward with the accumulated drift speed for a counterattack (↑ — Satomb's return arc).

### Physics

**K (defense) — roller absorb + redirect:**
```
J_att = 0.15 N·s
J_lateral = J_att × sin(40°) = 0.09645 N·s  (gives Satomb momentum in → direction)
v_Satomb_lateral = 0.09645 / 0.0452 = 2.134 m/s
```

**→ (moveRight) — drift orbit boost:**
```
v_right = 1.5 m/s  (additional orbital boost)
v_combined = 2.134 + 1.5 = 3.634 m/s  (total → direction speed)
```

**↑ (moveUp) — return counterattack:**
```
v_total = 3.634 m/s  (orbit already building; ↑ redirects inward toward opponent)
μ_reduced = 0.02283 kg
e_return = 0.60

J_counter = μ_reduced × v_total × (1 + e) = 0.02283 × 3.634 × 1.60 = 0.1327 N·s
Δv_opp    = 0.1327 / 0.046 = 2.88 m/s  (strong knockback)

damageMultiplier = 1.38  (deflected momentum conversion bonus)
lockMs = 70  (roller drift stabilization during → phase)
```

### Ceiling Check

```
damageMultiplier = 1.38  ✓ (≤ 1.5)
lockMs = 70              ✓ (≤ 300)
No invulnerability        ✓
No AoE                    ✓
No full spin recovery     ✓
```

### TypeScript

```typescript
function rollerCounterCombo(
  beyState: BeybladeState,
  opponentState: BeybladeState
): ComboResult {
  const DAMAGE_MULTIPLIER = 1.38;
  const LOCK_MS = 70;

  // K: roller deflect gives Satomb lateral momentum
  const J_att     = 0.15;
  const theta_att = 40 * Math.PI / 180;
  const v_lateral = (J_att * Math.sin(theta_att)) / beyState.mass;  // 2.134 m/s

  // →: drift orbit boost
  const v_right   = 1.5;
  const v_combined = v_lateral + v_right;  // 3.634 m/s

  // ↑: return counter
  const mu_red  = (beyState.mass * opponentState.mass) / (beyState.mass + opponentState.mass);
  const J_count = mu_red * v_combined * 1.60;
  const dv_opp  = J_count / opponentState.mass;

  return {
    sequence: ['defense', 'moveRight', 'moveUp'],
    v_lateral,
    v_combined,
    J_count,
    dv_opp,
    finalDamage: J_count * DAMAGE_MULTIPLIER * 1000,
    damageMultiplier: DAMAGE_MULTIPLIER,
    lockMs: LOCK_MS,
  };
}
```

---

## Case 1794 — GIMMICK: Roar Balkesh Giga Moment-10 — Moment Driver Traction-Switch System

**Beyblade:** Roar Balkesh Giga Moment-10 (Hasbro EN: Roar Bahamut; TT JP: ローアーバルケッシュ)
**Blader:** Bashara Suiro | **Series:** Beyblade Burst DB (Dynamite Battle)

### Assembly

| Part | Component | Mass (g) | r_cm (mm) | Notes |
|------|-----------|----------|-----------|-------|
| DBCore | Roar (DB) | 7.8 | 6 | Confirmed from CS9 Roar Bahamut lineage |
| Blade | Balkesh Ring | 12.1 | 26 | Confirmed: "Roar 12.1g" CS9 |
| Armor | Armor 10 | 15.5 | 28 | Wider armor ring vs Armor 6 (13.4g CS9); outer contact surface |
| Forge Disc | Giga | 32.8 | 30 | Confirmed: CS9 Cyclone Ragnaruk Giga = 32.8g |
| Driver | Moment | 11.5 | — | Wide crown-serrated ring; dual-mode tip (see below) |
| **Total** | | **79.7** | | Very heavy DB bey |

### Moment of Inertia

Using Roar Bahamut Karma Metal Drift-6 (CS9 confirmed: I = 1.640×10⁻⁵, m = 74.6g) as delta baseline:

```
ΔI_disc: Giga (32.8g, r=30mm) vs Karma (29.2g, r=26mm)
  I_Giga  = 0.0328 × 0.030² = 2.952×10⁻⁵ kg·m²
  I_Karma = 0.0292 × 0.026² = 1.975×10⁻⁵ kg·m²
  ΔI_disc = 9.77×10⁻⁶ kg·m²

ΔI_armor: Armor10 (15.5g, r=28mm) vs Armor6 (13.4g, r=28mm)
  ΔI_armor = (0.0155 - 0.0134) × 0.028² = 1.646×10⁻⁶ kg·m²

ΔI_driver: Moment (11.5g) vs Metal Drift-6 (12.1g) — similar radius; ΔI ≈ 0

I_total = 1.640×10⁻⁵ + 9.77×10⁻⁶ + 1.646×10⁻⁶ = 2.782×10⁻⁵ kg·m²

L₀ = 2.782×10⁻⁵ × 650 = 1.808×10⁻² kg·m²/s
```

### Moment Driver — Dual-Mode Traction Architecture

The Moment driver has two concentric contact zones:

**Outer ring (glide mode):** smooth rubber ring at r_outer = 18 mm
```
μ_glide = 0.08  (smooth rubber on polystyrene, low friction)
τ_glide = μ_glide × m × g × r_outer = 0.08 × 0.0797 × 9.81 × 0.018 = 1.127×10⁻³ N·m
t_glide  = I × ω₀ / τ_glide = 2.782×10⁻⁵ × 650 / 1.127×10⁻³ = 16.0 s
```

**Crown teeth (crash mode):** 8 ABS serrated teeth at r_teeth = 12 mm
```
μ_teeth = 0.45  (serrated ABS biting into polystyrene stadium floor)
τ_teeth = 0.45 × 0.0797 × 9.81 × 0.012 = 4.226×10⁻³ N·m
t_teeth  = 2.782×10⁻⁵ × 650 / 4.226×10⁻³ = 4.28 s  (rapid spin loss in crash mode)
```

**Traction switch — course change mechanics:**

The bey switches from glide to crash mode when it tilts above ~8° (similar to Loop driver critical angle). However, Bashara actively induces this tilt via aggressive orbital acceleration — creating a controlled spin-down of the outer ring and forcing the teeth to contact.

```
Tilt induction by orbital acceleration:
  Centripetal acceleration: a_c = v² / r_orbit = 3.5² / 0.08 = 153 m/s²
  This creates gyroscopic precession torque that can be steered by input direction.

Traction-switch lateral force impulse:
  ΔF_traction = (μ_teeth - μ_glide) × m × g = (0.45 - 0.08) × 0.0797 × 9.81 = 0.289 N
  Over t_switch = 15 ms: Δv_lateral = 0.289 × 0.015 / 0.0797 = 0.0544 m/s per switch event

  Over 6 sequential tooth engagements (rapid switching, 90 ms total):
  Total Δv_redirect = 6 × 0.0544 = 0.326 m/s lateral velocity change
  Original orbital speed: v = 3.5 m/s
  New heading angle: Δθ = arctan(0.326 / 3.5) = 5.32° per 90 ms burst

  At maximum: 12 switch events over 180 ms → Δθ_max = 10.6° course change
```

### Key Equations

| Quantity | Value |
|----------|-------|
| m_total | 79.7 g |
| I_total | 2.782×10⁻⁵ kg·m² |
| L₀ | 1.808×10⁻² kg·m²/s |
| μ_glide (outer ring) | 0.08 |
| μ_teeth (crown) | 0.45 |
| t_glide | 16.0 s |
| Course change per 90ms burst | 5.32°–10.6° |

---

## Case 1795 — SPECIAL MOVE: Ringing Crash

**Move:** Ringing Crash (TT JP: Moment Crash / モーメントクラッシュ)
**Beyblade:** Roar Balkesh Giga Moment-10
**Blader:** Bashara Suiro | **Series:** Beyblade Burst DB

### Description

Bashara commands Balkesh to activate Crash mode. The Moment driver's crown teeth bite into the stadium, switching from glide to grip in rapid succession. This creates a sharp course alteration at full orbital speed — the opponent cannot predict the new trajectory. Balkesh then rams at maximum orbital velocity with the full mass of the Giga disc behind it, the Armor 10's wide contact surface delivering a massive impact.

### Physics

**Pre-crash orbital state:**
```
v_orbital = 3.5 m/s  (Balkesh, heavy bey — maintains speed well)
ω_Balkesh = 580 rad/s  (mid-battle)
```

**Moment driver course change:**
```
Δθ = 10.6° over 180 ms (from GIMMICK — 12 tooth engagements)
v_new_direction = v_orbital = 3.5 m/s  (speed maintained through course change via tooth engagement)

The teeth act like a rail — the course changes without losing speed (unlike a normal orbital deflection).
Speed retention: v_post_change / v_pre = (1 - μ_teeth × m × g × t_switch / (m × v_orbital))^n
  At each switch: Δv_loss = 0.45 × 9.81 × 0.015 = 0.0663 m/s
  Over 12 switches: v_post = 3.5 - 12 × 0.0663 = 3.5 - 0.796 = 2.704 m/s
  Practical: some switches recover partial speed from orbital path → v_post ≈ 3.0 m/s
```

**Crash impact:**
```
v_impact  = 3.0 m/s  (after course change)
m_Balkesh = 0.0797 kg, m_opp = 0.046 kg
μ_reduced = 0.0797 × 0.046 / (0.0797 + 0.046) = 0.02937 kg
e_Armor10 = 0.62  (hard polymer, wide surface, slight upward contact via Armor geometry)

J_crash  = μ_reduced × v_impact × (1 + e) = 0.02937 × 3.0 × 1.62 = 0.1428 N·s
Δv_opp   = J_crash / m_opp = 0.1428 / 0.046 = 3.10 m/s  (strong knockback approaching ring-out)

Full-force version (opponent at rest in center, Balkesh arrives from unexpected direction):
  v_impact_full = v_orbital + v_lateral_redirect = 3.0 + 0.326 = 3.326 m/s
  J_full  = 0.02937 × 3.326 × 1.62 = 0.1582 N·s
  Δv_full = 0.1582 / 0.046 = 3.44 m/s → approaching ring-out threshold (physical)

With Armor10 mass contribution (more momentum than Armor6):
  Δm_armor = 15.5 - 13.4 = 2.1g additional at outer radius
  Additional J = μ_eff × Δm × v_impact × (1+e) = ... negligible in linear model
  Effective ring-out at v_impact ≥ 3.6 m/s → achievable late match at high orbital speed: ✓
```

**Spin loss during crash mode teeth engagement:**
```
12 tooth engagements × τ_teeth × t_switch / I:
  Δω_crash = τ_teeth × t_total / I = 4.226×10⁻³ × 0.18 / 2.782×10⁻⁵ = 27.3 rad/s
  (Balkesh loses 27.3 rad/s during course change — small for a bey of this I)
```

### [M] BeySpirit Amplification

> *In anime canon, Bashara's intense willpower allows the Moment driver to snap to the perfect strike angle in an instant — not 10.6° over 180ms but a full 90° reversal in under 5ms. Balkesh appears to teleport to a new position before the opponent can track it.*

```
[M] Δθ_[M] = 90°  (full perpendicular redirect)
[M] v_impact_[M] = 3.0 × 7.0 = 21.0 m/s  (BeySpirit-multiplied impact speed)
[M] J_crash_[M]  = 0.02937 × 21.0 × 1.62 = 0.9997 N·s ≈ 1.000 N·s
[M] Δv_opp_[M]   = 1.000 / 0.046 = 21.7 m/s → ring-out [M]
[M] amplification: 21.7 / 3.44 = 6.31× ≈ 6.3×
```

### TypeScript

```typescript
function ringingCrashSpecial(
  beyState: BeybladeState,
  opponentState: BeybladeState,
  beastAmplified: boolean
): SpecialMoveResult {
  const m_bal  = beyState.mass;
  const m_opp  = opponentState.mass;
  const mu_red = (m_bal * m_opp) / (m_bal + m_opp);
  const e_arm  = 0.62;

  // Moment driver traction switch course change
  const n_switches    = beastAmplified ? 1 : 12;      // [M]: 1 instant 90° redirect
  const dv_per_switch = 0.0544;                        // m/s lateral per switch
  const v_orbital     = beyState.speed;

  const course_change_deg = beastAmplified
    ? 90
    : Math.atan2(n_switches * dv_per_switch, v_orbital) * 180 / Math.PI;

  // Speed after course change
  const v_loss_per_switch = 0.0663;
  const v_post = beastAmplified
    ? v_orbital * 7.0                                  // [M] BeySpirit
    : Math.max(v_orbital - n_switches * v_loss_per_switch, v_orbital * 0.7);

  // Impact
  const v_impact = v_post + n_switches * dv_per_switch;
  const J_crash  = mu_red * v_impact * (1 + e_arm);
  const dv_opp   = J_crash / m_opp;

  // Spin cost of tooth engagement
  const tau_teeth = 4.226e-3;  // N·m
  const t_total   = beastAmplified ? 0.005 : 0.18;
  const delta_omega = tau_teeth * t_total / beyState.inertia;

  return {
    triggered: true,
    course_change_deg,
    v_post,
    v_impact,
    J_crash,
    dv_opp,
    ringOut: dv_opp >= 4.0,
    delta_omega,
    beastAmplified,
  };
}
```

**Compatible beys:**
- Roar Balkesh Giga Moment-10 (primary; Moment driver required)
- Any DB-era bey with the Moment Performance Tip

---

## Case 1796 — COMBO: Moment Dash

**Move:** Moment Dash
**Sequence:** → ↑ A  (moveRight, moveUp, attack)
**Beyblade:** Roar Balkesh Giga Moment-10
**Type restriction:** universal

### Rationale

Simplified Ringing Crash: dash along the orbital arc (→), engage Moment teeth pivot to redirect inward (↑ = the course change), then strike at the new heading (A = the ram). The ↑ following → represents the Moment driver's tooth-bite turn, redirecting the → momentum toward the opponent.

### Physics

**→ (moveRight) — orbital dash:**
```
v_right = 1.50 m/s  (orbital boost)
```

**↑ (moveUp) — Moment teeth redirect:**
```
Tooth-bite lateral force: ΔF = (μ_teeth - μ_glide) × m × g = 0.289 N
t_pivot = 0.015 s
v_up = ΔF × t_pivot / m = 0.289 × 0.015 / 0.0797 = 0.0544 m/s
  (this is the physical pivot; the ↑ input initiates the tilt-and-bite sequence)

v_approach = √(v_right² + v_up²) = √(1.50² + 0.0544²) = 1.501 m/s  (mostly → direction)
Redirect bonus: the course change multiplies effective contact angle → +20% contact efficiency
```

**A (attack) — Balkesh ram from redirected heading:**
```
v_strike = v_approach × 1.20 (redirect contact efficiency) = 1.501 × 1.20 = 1.801 m/s
μ_reduced = 0.02937 kg
e_Armor10 = 0.62

J_strike = μ_reduced × v_strike × (1 + e) = 0.02937 × 1.801 × 1.62 = 0.08567 N·s
Δv_opp   = 0.08567 / 0.046 = 1.862 m/s

damageMultiplier = 1.35  (unpredictable redirect angle; Giga mass behind impact)
lockMs = 60  (Moment teeth engagement during ↑ pivot phase)
```

### Ceiling Check

```
damageMultiplier = 1.35  ✓ (≤ 1.5)
lockMs = 60              ✓ (≤ 300)
No invulnerability        ✓
No AoE                    ✓
No full spin recovery     ✓
```

### TypeScript

```typescript
function momentDashCombo(
  beyState: BeybladeState,
  opponentState: BeybladeState
): ComboResult {
  const DAMAGE_MULTIPLIER = 1.35;
  const LOCK_MS = 60;

  // → orbital dash
  const v_right = 1.50;

  // ↑ Moment teeth pivot
  const mu_diff    = 0.45 - 0.08;
  const t_pivot    = 0.015;
  const v_up       = (mu_diff * beyState.mass * 9.81 * t_pivot) / beyState.mass;
  const v_approach = Math.sqrt(v_right ** 2 + v_up ** 2);

  // A strike with redirect efficiency bonus
  const v_strike  = v_approach * 1.20;
  const mu_red    = (beyState.mass * opponentState.mass) / (beyState.mass + opponentState.mass);
  const J_strike  = mu_red * v_strike * (1 + 0.62);
  const dv_opp    = J_strike / opponentState.mass;

  return {
    sequence: ['moveRight', 'moveUp', 'attack'],
    v_right,
    v_up,
    v_approach,
    v_strike,
    J_strike,
    dv_opp,
    finalDamage: J_strike * DAMAGE_MULTIPLIER * 1000,
    damageMultiplier: DAMAGE_MULTIPLIER,
    lockMs: LOCK_MS,
  };
}
```



---

## Case 1797 — GIMMICK: Shelter Regulus 5Star Tower — Claw Retraction & Tower Elevation System

**Beyblade:** Shelter Regulus 5Star Tower (TT JP: シェルターレグルス 5スタータワー; Hasbro EN: same)
**Blader:** Ren Wu Sun | **Series:** Beyblade Burst (God Layer / B-69)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Shelter Regulus | 13.4 | 28.0 |
| Forge Disc | 5 | 22.0 | 30.0 |
| Disc Frame | Star | 2.4 | 33.0 |
| Performance Tip | Tower | 5.5 | 5.0 |
| **Total** | | **43.3** | |

**I_total (extended claws) = 3.490×10⁻⁵ kg·m²** (CS9 Case 1515)
ω₀ = 650 rad/s (standard Burst God launch)
L₀ = I_ext × ω₀ = 3.490×10⁻⁵ × 650 = 2.269×10⁻² kg·m²/s

---

### 1. Shelter Layer — Claw Retraction Gimmick

Shelter Regulus carries four extending claw-blades that present a wide attack profile at large radius. In Shelter Defense mode the claws fold inward to a compact, smooth-edged cylindrical profile.

**Claw geometry:**

| Parameter | Extended (attack) | Retracted (shelter) |
|-----------|-------------------|---------------------|
| r_claw (mm) | 38 | 23 |
| m_claw (g) | 4.5 | 4.5 |
| I_claw contribution (kg·m²) | 6.498×10⁻⁶ | 2.381×10⁻⁶ |

ΔI_claw = m_claw × (r_ext² − r_ret²)
         = 4.5×10⁻³ × (0.038² − 0.023²)
         = 4.5×10⁻³ × (1.444×10⁻³ − 5.290×10⁻⁴)
         = 4.5×10⁻³ × 9.150×10⁻⁴
         = **4.118×10⁻⁶ kg·m²**

I_retracted = 3.490×10⁻⁵ − 4.118×10⁻⁶ = **3.078×10⁻⁵ kg·m²**

**Conservation of angular momentum (frictionless retraction):**

```
ω_ret = I_ext × ω₀ / I_ret
      = 3.490×10⁻⁵ × 650 / 3.078×10⁻⁵
      = 736.9 rad/s
```

Spin boost: Δω = **+86.9 rad/s (+13.4%)**

ΔKE from retraction = ½ × L₀ × (ω_ret − ω₀)
                    = ½ × 2.269×10⁻² × 86.9
                    = **0.985 J** (drawn from BeySpirit / claw-spring mechanism)

---

### 2. Tower Performance Tip — Height Elevation

The Tower tip body stands h_tower = 18 mm total. A standard flat/point tip contacts the floor at h_ref = 3 mm.

**Elevation gain:** Δh = 15 mm = 0.015 m

| Parameter | Standard tip | Tower tip (retracted) |
|-----------|-------------|----------------------|
| h_contact above floor (mm) | 3 | 18 |
| Δh_elevation (mm) | — | **15** |
| h_CoM (mm above floor) | 12 | **27** |
| Ω_prec (rad/s) | 0.225 | **0.506** |
| Precession ratio | 1.00× | **2.25×** |

**Precession calculation:**

```
Ω_prec = m × g × h_CoM / L₀
Ω_standard = 0.0433 × 9.81 × 0.012 / 2.269×10⁻² = 0.225 rad/s
Ω_tower    = 0.0433 × 9.81 × 0.027 / 2.269×10⁻² = 0.506 rad/s
```

Tighter precession orbit (2.25×) means the gyroscopic axis redirects lateral perturbations around the precession cone rather than through the bey body — incoming forces are shed rather than absorbed.

**Tower tip friction (rubber contact, r_tip = 2.5 mm, μ = 0.55):**

```
τ_Tower = μ × m × g × r_tip = 0.55 × 0.0433 × 9.81 × 0.0025 = 5.85×10⁻⁴ N·m
t_spin   = L₀ / τ_Tower = 2.269×10⁻² / 5.85×10⁻⁴ = 38.8 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 43.3 g |
| I_ext | 3.490×10⁻⁵ kg·m² |
| I_ret | 3.078×10⁻⁵ kg·m² |
| ΔI_claw | 4.118×10⁻⁶ kg·m² |
| ω₀ | 650 rad/s |
| ω_ret | 736.9 rad/s |
| Δω | +86.9 rad/s (+13.4%) |
| ΔKE | 0.985 J |
| Δh_elevation | 15 mm |
| h_CoM (Tower) | 27 mm |
| Ω_prec (Tower) | 0.506 rad/s |
| t_spin (Tower, retracted) | 38.8 s |

---

## Case 1798 — SPECIAL: Shelter Defense — Ren Wu Sun / Shelter Regulus 5Star Tower

**Blader:** Ren Wu Sun | **Beyblade:** Shelter Regulus 5Star Tower | **Type:** defense

### Description

Shelter Defense is a two-phase defensive special move. In Phase 1 the energy layer's claws retract (angular momentum conserved, spin boosted). In Phase 2 the Tower tip elevates the bey's CoM, tightening gyroscopic precession and presenting a smooth-edged profile. Any incoming bey contacts the smooth retracted surface and is deflected with a near-elastic impulse; simultaneously the elevated geometry imparts a downward component to the attacker, pressing them into the floor and stripping traction.

### Phase 1 — Claw Retraction (instantaneous; from Case 1797)

ΔI = 4.118×10⁻⁶ kg·m² → ω: 650 → **736.9 rad/s** (+86.9 rad/s, +13.4%)

### Phase 2 — Elevation & Gyroscopic Deflection (contact event)

**Collision model (smooth retracted surface, e = 0.70):**

Parameters:
- m_att = 50 g (representative attacker), v_att = 2.0 m/s
- m_def = 43.3 g; ω_def = 736.9 rad/s; r_contact = 24 mm (retracted layer edge)

```
m_eff = (0.050 × 0.0433) / (0.050 + 0.0433) = 2.320×10⁻² kg

J_n = m_eff × (1 + e) × v_att
    = 2.320×10⁻² × 1.70 × 2.0
    = 7.888×10⁻² N·s
```

**Effect on attacker:**
```
Δv_att  = J_n / m_att = 7.888×10⁻² / 0.050 = 1.578 m/s  (speed removed)
v_after = 2.0 − 1.578 = 0.422 m/s  (79 % speed reduction)
```
→ "deflect incoming attacks"

**Effect on Shelter Regulus (spin drain at contact):**
```
Δω_def   = J_n × r_c / I_ret = 7.888×10⁻² × 0.024 / 3.078×10⁻⁵ = 61.5 rad/s
ω_remain = 736.9 − 61.5 = 675.4 rad/s  (91.6 % retained)
```
→ "keep its stability"

**Downward impulse from Tower elevation geometry (θ_contact = 10.6°):**
```
Height differential Δh = 15 mm, horizontal separation Δr ≈ 80 mm:
θ_contact = arctan(15/80) = 10.6° below horizontal

J_down  = J_n × sin(10.6°) = 7.888×10⁻² × 0.184 = 1.451×10⁻² N·s
Δv_down = J_down / m_att   = 0.290 m/s  (attacker pressed into floor → added friction)
```
→ contributes to "knock away opponents" (attacker loses traction at floor)

**Physical summary:** Δv_att (horizontal) = **1.578 m/s** (attacker speed reduction per impact)

---

**[M] BeySpirit amplification:**
BeySpirit sharpens the gyroscopic repulsion beyond physical contact mechanics, reversing the attacker's trajectory entirely.

[M] factor = **5.0 ×**
[M] Δv = 1.578 × 5.0 = **7.9 m/s** (clear ring-out; attacker ejected from arena)

> **Note:** Physical values describe Tower-elevated claw-retraction deflection mechanics. [M] values represent BeySpirit-overridden gyroscopic force that exceeds normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function shelterDefenseSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: claw retraction — angular momentum conserved, Δω = +86.9 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 87);
  // Anchor stance: zero orbital velocity (Tower tip grounds the bey)
  setVelocity(bey.id, 0, 0);
  // Phase 2: Tower elevation → gyroscopic deflection of incoming bey
  // Physical J_n = 7.888×10⁻² N·s; [M] 5.0× → J_M ≈ 0.394 N·s
  const J_phys = 0.0789;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.0; // [M] BeySpirit 5.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  bey.invulnerableMs = 1500; // 1.5 s Tower-stance defense window
}
```

**Compatible beys:** Any beyblade using a retractable-claw Energy Layer (Shelter Regulus or equivalent) equipped with the Tower Performance Tip. Without the Tower tip the elevation component is absent (deflection force halved); without a retractable layer the spin boost phase is absent. Standard game instance: Shelter Regulus 5Star Tower (Ren Wu Sun).

---

## Case 1799 — COMBO: Shell Guard — Shelter Regulus

**Sequence:** K → E → K (defense · dodge · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Ren Wu Sun

### Physics Justification

A short claw-pulse retraction draws the contact points inward for approximately one rotation (~87 ms at 736 rad/s), absorbing an incoming strike and snapping the blades back outward. The dodge (E) mid-sequence represents the brief inward retreat before re-extension. This partial retraction recovers 30 rad/s of spin (≈ ⅓ of the full Shelter Defense Δω = 86.9 rad/s) and returns with a 1.20× counter strike on re-extension.

**Parameters:**
- spinGain: +30 rad/s (partial claw pulse; ⅓ of full Δω)
- damageMultiplier: 1.20 (snap-back counter strike on re-extension)
- lockMs: 0 (pure parry timing — no lock)

### TypeScript

```typescript
function shellGuardCombo(bey: Beyblade, target: Beyblade): void {
  // Partial claw retraction → partial spin restoration
  bey.spin = Math.min(bey.maxSpin, bey.spin + 30);
  // Snap-back re-extension: counter strike on attacker
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +30 rad/s (partial) | ✓ |



---

## Case 1800 — GIMMICK: Wild/Tempest Wyvron — Free-Spin Ring & Bowl Trajectory System

**Beyblades:** Wild Wyvron Vertical Orbit (Standard Burst); Tempest Wyvron 4Glaive Atomic (God Layer / B-98)
**Blader:** Wakiya Murasaki | **Series:** Beyblade Burst (Standard → God Layer arc)

### Assembly Comparison

| Part | Wild Wyvron Vertical Orbit | Tempest Wyvron 4Glaive Atomic |
|------|---------------------------|-------------------------------|
| Energy Layer | Wyvron (free-ring ~2g) | Tornado Wyvern (free-ring ~2g) |
| Layer mass (g) | ~8.5 | 9.2 |
| Forge Disc | Vertical (~15g) | 4 + Glaive frame (21.11 + 2.34g) |
| Performance Tip | Orbit (~6.0g) | Atomic (~6.0g) |
| **Total (g)** | **~29.5** | **40.05** |
| **I_body (kg·m²)** | **~1.0×10⁻⁵ (est.)** | **1.531×10⁻⁵ (CS9 Case 543)** |

ω₀ = 650 rad/s (both; standard Burst launch)
L₀_Tempest = 1.531×10⁻⁵ × 650 = 9.952×10⁻³ kg·m²/s

---

### 1. Free-Spin Ring — Burst Torque Absorption

Both Wyvron layers carry a free-spinning outer ring. When struck, the ring decouples from the core and rotates independently, diverting the attacker's burst torque into the ring rather than the burst tabs.

From CS9 Case 543 (Tornado Wyvern):
- RS attacker: 85 % of burst torque absorbed by ring
- LS attacker: 60 % absorbed

**Contact mechanics (free-spin absorption):**
The free-ring presents e_ring = 0.35 (semi-inelastic, ring absorbs energy).
For an incoming attacker (m_att = 50 g, v_att = 2.5 m/s):

```
m_eff = (0.04005 × 0.050) / (0.04005 + 0.050) = 2.224×10⁻² kg

J_received = m_eff × (1 + e_ring) × v_att
           = 2.224×10⁻² × 1.35 × 2.5
           = 7.506×10⁻² N·s
```

Wyvron velocity gain (redirected toward bowl wall):
```
Δv_Wyv = J_received / m_Wyv = 7.506×10⁻²/ 0.04005 = 1.873 m/s
v_Wyv_post = v_orbital_pre + 1.873 ≈ 2.873 m/s  (toward bowl wall)
```

---

### 2. Bowl Wall Trajectory (Tempest Wyvron, Atomic Tip)

**Bowl parameters:**
- Wall angle: φ = 35°
- Bowl wall height: Δh = 55 mm = 0.055 m
- Atomic tip rubber contact: r_tip = 6 mm, μ = 0.70

**Ascending the wall:**

```
Normal force on wall: N = m × (v² / r_bowl + g × cos φ) ≈ 1.761 N  (r_bowl = 200 mm)
Friction work (ascent): W_fric = μ × N × L  where L = Δh / sin φ = 0.055/0.574 = 0.09582 m
W_fric = 0.70 × (m×g×cos φ) × L = 0.70 × 0.04005×9.81×0.8192 × 0.09582 = 0.02157 J
Gravity work: W_grav = m×g×Δh = 0.04005×9.81×0.055 = 0.02161 J

v_top² = v_entry² − 2(W_grav + W_fric)/m
       = 2.873² − 2×(0.02161 + 0.02157)/0.04005
       = 8.254 − 2.157
       = 6.097   →  v_top = 2.469 m/s
```

**Descending and crashing (symmetric friction path):**

```
v_crash² = v_top² + 2×W_grav/m − 2×W_fric/m
          = 6.097 + 2×0.02161/0.04005 − 2×0.02157/0.04005
          = 6.097 + 1.080 − 1.077 = 6.100

v_crash = 2.470 m/s  (Shield Crash impact speed)
```

### Key Parameters Summary

| Quantity | Wild Wyvron (est.) | Tempest Wyvron (CS9) |
|---------|-------------------|---------------------|
| m | ~29.5 g | 40.05 g |
| I_body | ~1.0×10⁻⁵ kg·m² | 1.531×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s | 650 rad/s |
| e_ring | 0.35 (RS 85 % absorb) | 0.35 (RS 85 % absorb) |
| v_entry (bowl) | ~2.35 m/s | 2.873 m/s |
| v_crash | ~2.02 m/s | **2.470 m/s** |

---

## Case 1801 — SPECIAL: Shield Crash — Wakiya Murasaki / Wild Wyvron & Tempest Wyvron

**Blader:** Wakiya Murasaki | **Beyblades:** Wild Wyvron Vertical Orbit; Tempest Wyvron 4Glaive Atomic | **Type:** attack / balance

### Description

Shield Crash is a two-phase counter-attack. Phase 1: Wyvron absorbs an incoming hit using the free-spin ring (ring decouples, burst torque diverted). Phase 2: the absorbed momentum redirects Wyvron toward the bowl wall, which it climbs and uses as a launch ramp to crash head-on at full speed against the same opponent.

### Phase 1 — Free-Ring Absorption (from Case 1800)

J_received = 7.506×10⁻² N·s; Δv_Wyv = 1.873 m/s → v_entry_bowl = 2.873 m/s

### Phase 2 — Bowl Crash (from Case 1800)

v_crash = **2.470 m/s**

**Crash impact model (Tempest Wyvron vs. attacker, e = 0.65):**

```
m_eff = (0.04005 × 0.050) / (0.09005) = 2.224×10⁻² kg

J_crash = m_eff × (1 + e) × v_crash
        = 2.224×10⁻² × 1.65 × 2.470
        = 2.224×10⁻² × 4.076
        = 9.065×10⁻² N·s
```

Effect on target:
```
Δv_target = J_crash / m_target = 9.065×10⁻² / 0.050 = 1.813 m/s
```

Effect on Wyvron (spin drain at contact r_c = 28 mm):
```
Δω_Wyv = J_crash × r_c / I_body = 9.065×10⁻² × 0.028 / 1.531×10⁻⁵ = 165.8 rad/s
ω_remain = 650 − 165.8 = 484.2 rad/s  (74.5 % retained)
```

**Physical summary:** Δv_target = **1.813 m/s**

---

**[M] BeySpirit amplification:**
BeySpirit supercharges the bowl descent; Wyvron crashes with legendary speed.

[M] factor = **5.5 ×**
[M] Δv = 1.813 × 5.5 = **9.97 ≈ 10.0 m/s** (ring-out guaranteed)

> **Note:** Physical values describe bowl-wall kinematic energy gain with Atomic rubber traction. [M] values represent BeySpirit-overridden descent force. Combos do not receive [M] amplification.

### TypeScript

```typescript
function shieldCrashSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: free-ring absorption — velocity redirected toward bowl
  // (no spin cost; ring decouples and absorbs burst torque)
  // Phase 2: bowl descent → crash impulse on original attacker
  // Physical J = 9.065×10⁻² N·s; [M] 5.5× → J_M ≈ 0.499 N·s
  const J_phys = 0.0907;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.5; // [M] BeySpirit 5.5×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Velocity burst toward target (bowl descent speed)
  bey.vx += (dx / dist) * 2.47;
  bey.vy += (dy / dist) * 2.47;
}
```

**Compatible beys:** Any beyblade with a free-spin outer ring Energy Layer (Wyvron family) capable of redirecting incoming momentum via the bowl wall. Standard instances: Wild Wyvron Vertical Orbit (Wakiya, Burst Standard) and Tempest Wyvron 4Glaive Atomic (Wakiya, God Layer). The crash speed scales with bowl wall height and the initial impact momentum absorbed.

---

## Case 1802 — COMBO: Bowl Rider — Wild/Tempest Wyvron

**Sequence:** E → ↓ → A (dodge · down · attack)
**Cost:** 15 | **Type:** balance | **Blader:** Wakiya Murasaki

### Physics Justification

E (dodge) represents the momentary ring decoupling absorbing the incoming blow. ↓ (moveDown) represents redirecting toward the bowl's lower slope. A (attack) is the crash strike on rebound.

The partial bowl trajectory (no full wall climb) recovers 30 % of the crash speed equivalent:
- spinGain: 0 (no conservation gain — different from Shelter Defense retraction)
- damageMultiplier: 1.30 (downhill momentum boost on crash)
- lockMs: 80 (brief stun as opponent absorbs redirect)

### TypeScript

```typescript
function bowlRiderCombo(bey: Beyblade, target: Beyblade): void {
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Bowl redirect momentum: partial crash force
  bey.vx += (dx / dist) * 1.0;
  bey.vy += (dy / dist) * 1.0;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 80 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | none | ✓ |

---

## Case 1803 — GIMMICK: Erase Devolos Vanguard Bullet — Dual Phantom Chip Separation & Pincer Geometry

**Beyblade:** Erase Devolos Vanguard Bullet (TT JP: イレースデーボロス; Hasbro EN: Erase Diabolos; Gatinko / GT / B-142)
**Blader:** Delta Zakuro | **Series:** Beyblade Burst GT | **Spin direction:** Left Spin (LS)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| GT Chip | Devolos Chip | 14.0 | 8.0 |
| Energy Layer base | Devolos (Erase) | 10.6 | 25.0 |
| Forge Disc | Vanguard | 26.5 | 14.0 |
| Performance Tip | Bullet | 15.4 | 3.0 |
| **Total** | | **66.5** | |

**I_total = 9.846×10⁻⁶ kg·m²** (CS9 Cases 481–484; Vanguard + Bullet mass concentrated near axis)
ω₀ = 650 rad/s (LS; Gatinko Burst launch)
L₀ = 9.846×10⁻⁶ × 650 = 6.400×10⁻³ kg·m²/s (LS)

---

### 1. Dual Phantom — GT Chip Separation

In Dual Phantom (prerequisite special move), the Devolos GT Chip decouples from the Energy Layer base and spins independently as a mini-beyblade. The chip retains the same angular velocity as the main body at the moment of release (no impulse torque — separation is axial).

**Angular momentum redistribution:**
```
I_chip  = m_chip × r_chip² / 2 = 14.0×10⁻³ × (0.008)² / 2 = 4.480×10⁻⁷ kg·m²
I_main  = I_total − I_chip = 9.846×10⁻⁶ − 4.480×10⁻⁷ = 9.398×10⁻⁶ kg·m²

ω_chip  = ω₀ = 650 rad/s  (retained from coupled state; LS)
ω_main  = ω₀ = 650 rad/s  (I_main unchanged in ω since L_chip is negligible)

L_chip  = 4.480×10⁻⁷ × 650 = 2.912×10⁻⁴ kg·m²/s  (0.46 % of L₀)
L_main  = 9.398×10⁻⁶ × 650 = 6.109×10⁻³ kg·m²/s  (both LS)
```

After separation both bodies spin at ω = 650 rad/s LS. The chip travels as a free projectile, approaching the target from the opposite side.

---

### 2. Shining Crux Pincer Geometry

Main bey and chip approach target from 180° apart at equal orbital speeds:

| Attacker | Mass (g) | v_approach (m/s) | Direction |
|---------|---------|-----------------|-----------|
| GT Chip (mini) | 14 | 2.0 | +x → |
| Main Erase Devolos | 52.5 | 2.0 | ←  −x |
| Target | 50 | 0 | stationary |

```
m_eff_chip = (0.014 × 0.050) / (0.064) = 1.094×10⁻² kg
m_eff_main = (0.0525 × 0.050) / (0.1025) = 2.561×10⁻² kg

J_chip = m_eff_chip × (1 + e) × 2.0  [e = 0.60 for Gatinko layer]
       = 1.094×10⁻² × 1.60 × 2.0 = 3.500×10⁻² N·s  (pushes target in −x)

J_main = m_eff_main × (1 + e) × 2.0
       = 2.561×10⁻² × 1.60 × 2.0 = 8.195×10⁻² N·s  (pushes target in +x)
```

**Net ring-out impulse:** J_net = 8.195×10⁻² − 3.500×10⁻² = **4.695×10⁻² N·s** (toward main bey side)
**Δv_target (net):** 4.695×10⁻²/0.050 = **0.939 m/s**

**Combined LS spin drain on RS target (contact radii: r_chip=20mm, r_main=30mm, I_target=2.5×10⁻⁵):**
```
Δω_chip  = J_chip × r_chip / I_target = 3.500×10⁻² × 0.020 / 2.5×10⁻⁵ = 28.0 rad/s
Δω_main  = J_main × r_main / I_target = 8.195×10⁻² × 0.030 / 2.5×10⁻⁵ = 98.4 rad/s
Δω_total = 28.0 + 98.4 = 126.4 rad/s  (−19.4 % of ω₀ = 650, per pincer event; LS on RS adds)
```

**Combined burst torque (sandwich force × contact radii):**
```
F_chip = J_chip / Δt = 3.500×10⁻² / 0.001 = 35.0 N
F_main = J_main / Δt = 8.195×10⁻² / 0.001 = 81.95 N

τ_burst_chip = F_chip × r_burst_chip = 35.0 × 0.010 = 350 mN·m
τ_burst_main = F_main × r_burst_main = 81.95 × 0.015 = 1229 mN·m
τ_burst_combined = 350 + 1229 = 1579 mN·m
```

Standard burst threshold: 20–50 mN·m → **1579 mN·m is ~31–79× threshold — instant burst for any standard 3-click bey**

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m_total | 66.5 g |
| m_chip | 14.0 g |
| m_main | 52.5 g |
| I_total | 9.846×10⁻⁶ kg·m² |
| ω₀ (both, LS) | 650 rad/s |
| J_chip | 3.500×10⁻² N·s |
| J_main | 8.195×10⁻² N·s |
| Δv_net | 0.939 m/s |
| Δω_target | 126.4 rad/s (−19.4 %) |
| τ_burst_combined | 1579 mN·m (guaranteed burst) |

---

## Case 1804 — SPECIAL: Shining Crux — Delta Zakuro / Erase Devolos Vanguard Bullet

**Blader:** Delta Zakuro | **Beyblade:** Erase Devolos Vanguard Bullet | **Type:** attack (LS)

### Description

Shining Crux (JP: Shining Cross) is the follow-up to the Dual Phantom split. After separating into main bey + GT Chip mini-bey, both halves converge on the target from exactly opposite directions simultaneously, creating a cross-shaped energy flash at the impact point. The combined sandwich force far exceeds any standard burst threshold.

### Phase 1 — Pincer Setup (from Case 1803)

Prerequisite: Dual Phantom must be active (chip separated).
Both halves orbit at v = 2.0 m/s, approaching from 180°.

### Phase 2 — Simultaneous Cross Impact

From Case 1803 model:
- J_chip = 3.500×10⁻² N·s
- J_main = 8.195×10⁻² N·s
- τ_burst_combined = **1579 mN·m (instant burst for any standard bey)**
- Δω_target = **126.4 rad/s (−19.4 % per event)**
- Net Δv = **0.939 m/s**

**Physical summary:**
The main damage vector is burst torque (1579 mN·m >> threshold). The ring-out impulse (0.939 m/s) is a secondary effect.

---

**[M] BeySpirit amplification:**
BeySpirit coordinates both halves into a single devastating cross-strike, generating a shock wave beyond physical collision limits.

[M] factor = **8.0 ×**
[M] Δv = 0.939 × 8.0 = **7.5 m/s** (ring-out + burst guaranteed simultaneously)

> **Note:** Physical burst (1579 mN·m) already guarantees burst of any standard bey without [M]. [M] amplification adds ring-out on top of guaranteed burst — the "Shining Cross" energy flash in the anime. Combos do not receive [M] amplification.

### TypeScript

```typescript
function shiningCruxSpecial(bey: Beyblade, target: Beyblade): void {
  // Prerequisite: Dual Phantom active (chip orbiting on opposite side)
  // Phase 2: simultaneous cross impact
  // Physical: J_main = 8.195×10⁻² N·s, J_chip = 3.500×10⁻² N·s (opposite)
  // Net Δv = 0.939 m/s; τ_burst_combined = 1579 mN·m (guaranteed burst)
  // [M] 8.0× → net Δv = 7.5 m/s
  const J_net = 0.04695;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_net * 8.0; // [M] BeySpirit 8.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Guaranteed burst torque — trigger burst check regardless of remaining tabs
  target.burstForce += 1579; // mN·m — exceeds any standard threshold
  // LS spin drain on RS target
  target.spin = Math.max(0, target.spin - 126);
}
```

**Compatible beys:** Erase Devolos Vanguard Bullet (Delta Zakuro, Burst GT). Requires the Dual Phantom special move to be active first. Any Gatinko bey with a separable GT Chip could access a reduced-amplitude version; without LS spin the combined burst torque is halved.

---

## Case 1805 — COMBO: Dual Slash — Erase Devolos

**Sequence:** ← → A → ← (left · attack · right)
**Cost:** 25 | **Type:** attack | **Blader:** Delta Zakuro

### Physics Justification

Without the full Dual Phantom split available, the combo simulates the cross-pattern with a double feint: ← (approach from left flank), A (strike), → (cut to right flank). The bey crosses the opponent's facing direction twice in rapid succession, applying two angular glancing blows from opposing angles.

Physical partial-pincer effect:
- First pass (←): angular impulse ~J₁/2 = 1.75×10⁻² N·s (half chip energy)
- Second pass (→): full main-bey strike ~J₂ = 8.20×10⁻² N·s
- Combined spin drain: ~65 rad/s (half of full pincer Δω)

**Parameters:**
- damageMultiplier: 1.45 (double-cross strike)
- lockMs: 150 (target disoriented by dual-angle approach)

### TypeScript

```typescript
function dualSlashCombo(bey: Beyblade, target: Beyblade): void {
  bey.damageMultiplier = 1.45;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Double-cross angular strike
  applyForce(target.id, (dx / dist) * 0.44, (dy / dist) * 0.44);
  // Partial LS spin drain
  target.spin = Math.max(0, target.spin - 65);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.45 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | none | ✓ |

---

## Case 1806 — GIMMICK: Earth Eagle 145WD — Earth Wheel Aerodynamic Lift & Vortex Focus System

**Beyblade:** Earth Eagle 145WD (TT JP: アースイーグル 145WD; Hasbro EN: same; MFB / Metal Masters)
**Blader:** Tsubasa Otori | **Series:** Beyblade: Metal Masters

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Earth | 32.5 | 34.0 |
| Energy Ring | Eagle | 2.8 | 22.0 |
| Spin Track | 145 | 1.3 | 5.0 |
| Performance Tip | WD (Wide Defense) | 0.8 | 1.5 |
| **Total** | | **37.4** | |

**I_total = 2.970×10⁻⁵ kg·m²**
Earth wheel: I_Earth = ½ × 0.0325 × (r_outer² + r_inner²) = ½ × 0.0325 × (0.040² + 0.012²) = 2.834×10⁻⁵ kg·m²
Eagle ring: I_ring = 2.8×10⁻³ × 0.022² = 1.355×10⁻⁶ kg·m²
Total: 2.970×10⁻⁵ kg·m²

ω₀ = 700 rad/s (MFB standard launch)
L₀ = 2.970×10⁻⁵ × 700 = 2.079×10⁻² kg·m²/s

---

### 1. Earth Wheel — Aerodynamic Lift

Earth's exceptionally wide, flat profile acts as a rotating disc wing. At high spin, the upper surface accelerates airflow; the pressure differential generates net lift.

**Lift force calculation (C_L = 0.25, ρ_air = 1.225 kg/m³):**

```
v_tip = ω₀ × r_outer = 700 × 0.040 = 28.0 m/s
A_disc = π × r_outer² = π × 0.040² = 5.027×10⁻³ m²

F_lift = ½ × C_L × ρ × v_tip² × A_disc
       = ½ × 0.25 × 1.225 × 28.0² × 5.027×10⁻³
       = ½ × 0.25 × 1.225 × 784.0 × 5.027×10⁻³
       = 0.604 N
```

Bey weight: W = m × g = 0.0374 × 9.81 = **0.367 N**

**F_lift (0.604 N) > W (0.367 N) at ω₀ → Earth Eagle lifts off at launch**

**Liftoff spin threshold:**
```
F_lift = W  →  ½ × C_L × ρ × (ω_L × r)² × A = m × g

(ω_L × r)² = 2mg / (C_L × ρ × A) = 2×0.367 / (0.25×1.225×5.027×10⁻³) = 476.6 m²/s²
ω_liftoff  = √476.6 / r = 21.83 / 0.040 = 545.8 rad/s
```

At ω₀ = 700: excess lift = 0.604 − 0.367 = 0.237 N → a_lift = 0.237/0.0374 = 6.34 m/s² (upward)

Eagle remains airborne for the duration ω > ω_liftoff = 545.8 rad/s.

---

### 2. Vortex Focus — Tornado Pierce Mechanism

The spinning Earth wheel generates a Rankine vortex in the surrounding air. At high spin the vortex core concentrates into a narrow filament that can penetrate gaps in an opponent's layer.

**Aerodynamic drag force on opponent (vortex impingement):**

```
A_side = h_wheel × d_wheel = 0.008 × 0.080 = 6.4×10⁻⁴ m²  (wheel profile area)
C_D    = 0.80  (rotating disc side-on drag)

F_aero = ½ × C_D × ρ × v_tip² × A_side
       = ½ × 0.80 × 1.225 × 784.0 × 6.4×10⁻⁴
       = 0.246 N  (additional drag on opponent during contact)
```

During contact time Δt = 0.1 s:
J_aero = F_aero × Δt = 0.246 × 0.1 = 2.46×10⁻² N·s (on top of physical contact impulse)

**WD Tip — Spin Time:**
```
r_WD = 2.0 mm, μ_WD = 0.25 (hard plastic, near-point contact)
τ_WD = μ × m × g × r = 0.25 × 0.0374 × 9.81 × 0.002 = 1.836×10⁻⁴ N·m
t_spin = L₀ / τ_WD = 2.079×10⁻² / 1.836×10⁻⁴ = 113.2 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.4 g |
| I_total | 2.970×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| F_lift at ω₀ | 0.604 N (> W = 0.367 N) |
| ω_liftoff | 545.8 rad/s |
| F_aero (vortex drag) | 0.246 N over 100 ms |
| J_aero | 2.46×10⁻² N·s |
| t_spin (WD) | 113.2 s |

---

## Case 1807 — SPECIAL: Shining Tornado Buster — Tsubasa Otori / Earth Eagle 145WD

**Blader:** Tsubasa Otori | **Beyblade:** Earth Eagle 145WD | **Type:** stamina / attack

### Description

Eagle rides on rising air currents generated by the Earth Fusion Wheel's aerodynamic lift, soaring above the arena floor. It then focuses all wind energy into a narrow vortex filament — sharp enough to pierce any defence — and descends at full orbital speed, crashing through the opponent's layer with combined physical and aerodynamic force.

### Phase 1 — Liftoff (from Case 1806)

At ω₀ = 700 > ω_liftoff = 545.8 rad/s: F_lift = 0.604 N, a_lift = 6.34 m/s² upward.
Eagle is airborne for the entire battle window above liftoff spin.

### Phase 2 — Tornado Impact

**Physical contact impulse (orbital collision, e = 0.70):**
```
m_eff = (0.0374 × 0.050) / (0.0874) = 2.140×10⁻² kg
v_orbital = 2.0 m/s

J_contact = m_eff × (1 + e) × v_orbital
           = 2.140×10⁻² × 1.70 × 2.0
           = 7.276×10⁻² N·s
```

**Aerodynamic vortex impulse (from Case 1806):**
J_aero = 2.46×10⁻² N·s

**Total impulse:**
```
J_total = J_contact + J_aero = 7.276×10⁻² + 2.46×10⁻² = 9.736×10⁻² N·s
Δv_target = J_total / m_target = 9.736×10⁻² / 0.050 = 1.947 m/s
```

**Physical summary:** Δv_target = **1.947 ≈ 1.95 m/s** (combined physical contact + tornado aerodynamic drag)

---

**[M] BeySpirit amplification:**
BeySpirit channels the dark power of "Dark Eagle" — the tornado becomes a fire-purple maelstrom sharp enough to pierce the hardest Defence-type layers.

[M] factor = **7.0 ×**
[M] Δv = 1.947 × 7.0 = **13.6 m/s** (ring-out at >4× ring-out threshold; pierces all defense buffs)

> **Note:** Physical values describe real aerodynamic lift + vortex drag mechanics of the Earth Fusion Wheel. [M] values represent full BeySpirit amplification (Dark Eagle form). Combos do not receive [M] amplification.

### TypeScript

```typescript
function shiningTornadoBusterSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: aerodynamic liftoff — Eagle rises above floor
  // (no game-state change needed; physics engine handles lift)
  // Phase 2: tornado impact
  // Physical J_total = 9.736×10⁻² N·s; [M] 7.0× → J_M ≈ 0.681 N·s
  const J_phys = 0.0974;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× — Dark Eagle piercing
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Tornado vortex: ignores 50% of target's defenseBuff (piercing effect)
  const defensePierce = 0.50;
  target.defenseBuff = target.defenseBuff * (1 - defensePierce);
}
```

**Compatible beys:** Any beyblade using the Earth Fusion Wheel (Tsubasa Otori, Metal Masters). The liftoff phase requires ω > 545.8 rad/s; below this threshold the move executes as a standard orbital strike without the tornado component (J_aero absent). Standard instance: Earth Eagle 145WD.

---

## Case 1808 — COMBO: Eagle Drive — Earth Eagle

**Sequence:** J → ↑ → A (jump · up · attack)
**Cost:** 15 | **Type:** stamina | **Blader:** Tsubasa Otori

### Physics Justification

J (jump) represents Eagle's aerodynamic liftoff — rising above the stadium floor. ↑ (moveUp) represents ascending on the updraft. A (attack) is the descending strike. The aerodynamic assist adds a partial vortex impulse on top of the physical strike.

**Parameters:**
- damageMultiplier: 1.30 (downward strike from elevated position)
- lockMs: 80 (target caught off-guard by aerial approach)
- spinGain: 0 (no conservation mechanism; this is aerodynamic, not gyroscopic)

### TypeScript

```typescript
function eagleDriveCombo(bey: Beyblade, target: Beyblade): void {
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Partial aerodynamic dive: combined physical + vortex nudge
  applyForce(target.id, (dx / dist) * 0.33, (dy / dist) * 0.33);
  bey.vx += (dx / dist) * 0.80;
  bey.vy += (dy / dist) * 0.80;
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 80 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | none | ✓ |

---

## Case 1809 — GIMMICK: Samurai Ifrit W145CF — Wing-Assisted Bowl Exit & Sky Drop System

**Beyblade:** Samurai Ifrit W145CF (TT JP: サムライイフリート W145CF; Hasbro EN: same; Shogun Steel / Zero-G)
**Blader:** Zyro Kurogane | **Series:** Beyblade Shogun Steel (Zero-G)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Shogun Face Bolt | SFB (metal ring) | 3.5 | 5.0 |
| Warrior Wheel | Ifrit | 29.0 | 33.0 |
| Spin Track | W145 (Wing 145) | 2.5 | 12.0 |
| Performance Tip | CF (Central Flat) | 0.8 | 2.0 |
| **Total** | | **35.8** | |

**I_total = 2.275×10⁻⁵ kg·m²**
Ifrit wheel (hollow disc): ½ × 0.029 × (0.038² + 0.010²) = ½ × 0.029 × 1.544×10⁻³ = 2.239×10⁻⁵ kg·m²
W145 wings (3 wings, r=12mm): 3 × 2.5×10⁻³/3 × (0.012)² = 2.5×10⁻³ × 1.44×10⁻⁴ = 3.6×10⁻⁷ kg·m²
Total: 2.275×10⁻⁵ kg·m²

ω₀ = 680 rad/s (Zero-G standard launch)
L₀ = 2.275×10⁻⁵ × 680 = 1.547×10⁻² kg·m²/s

---

### 1. Wing 145 Track — Supplementary Lift

W145 carries three wing protrusions at h = 14.5 mm above the floor. At ω₀ = 680 rad/s:

```
v_wing = ω₀ × r_wing = 680 × 0.012 = 8.16 m/s
A_wing_each = 0.010 × 0.008 = 8.0×10⁻⁵ m²  (each wing panel)
C_L_wing = 0.80  (flat plate at high angle-of-attack)

F_lift_wings = 3 × ½ × C_L × ρ × v_wing² × A_wing
             = 3 × ½ × 0.80 × 1.225 × 8.16² × 8.0×10⁻⁵
             = 3 × ½ × 0.80 × 1.225 × 66.58 × 8.0×10⁻⁵
             = 3 × ½ × 0.80 × 6.535×10⁻³
             = 3 × 2.614×10⁻³ = 7.843×10⁻³ N  (supplementary; insufficient for full liftoff alone)
```

**Supplementary vertical boost at bowl exit:**
Additional upward velocity from wing lift during bowl-wall climb:
```
Δv_z_wing = F_lift_wings × t_climb / m = 7.843×10⁻³ × 0.215 / 0.0358 = 0.047 m/s  (over ~215 ms climb)
```

---

### 2. Bowl Exit & Sky Drop Kinematics

**Zero-G stadium wall angle:** φ = 60° (steeper than standard; Zero-G bowls are high-walled)
**Orbital speed at bowl wall:** v_orb = 2.0 m/s

```
v_z_base = v_orb × sin(60°) = 2.0 × 0.866 = 1.732 m/s
v_h_base = v_orb × cos(60°) = 2.0 × 0.500 = 1.000 m/s

v_z_total = v_z_base + Δv_z_wing = 1.732 + 0.047 = 1.779 m/s

Peak height:
h_peak = v_z_total² / (2g) = 1.779² / 19.62 = 3.165 / 19.62 = 0.161 m  (≈ 16.1 cm)
```

**Sky drop impact (conservation of energy, descending back to arena floor):**
```
v_z_impact = √(2g × h_peak) = √(2 × 9.81 × 0.161) = √3.159 = 1.777 m/s  (vertical, downward)
v_h_impact = v_h_base = 1.000 m/s  (horizontal, conserved)

v_total_impact = √(v_z² + v_h²) = √(1.777² + 1.000²) = √(3.158 + 1.000) = √4.158 = 2.039 m/s
```

Angle at impact: θ = arctan(v_z/v_h) = arctan(1.777) = 60.6° below horizontal
→ Strike is targeted directly at opponent's Face Bolt / Stone Face (center; r ≈ 0)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.8 g |
| I_total | 2.275×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| F_lift_wings | 7.843×10⁻³ N (supplementary) |
| Δv_z_wing | +0.047 m/s |
| h_peak | 16.1 cm |
| v_z_impact | 1.777 m/s |
| v_total_impact | 2.039 m/s |
| θ_impact | 60.6° below horizontal |

---

## Case 1810 — SPECIAL: Shooting Star Crush — Zyro Kurogane / Samurai Ifrit W145CF

**Blader:** Zyro Kurogane | **Beyblade:** Samurai Ifrit W145CF | **Type:** attack / balance

### Description

Shooting Star Crush is an aerial sky-drop attack inspired by Gingka's Starblast Attack. Ifrit rides the Zero-G stadium's steep wall to exit the bowl, soaring upward with the aid of the W145 wing track. At peak height it inverts its descent trajectory and hurtles back into the stadium in a near-vertical dive, striking the opponent's Face Bolt / Stone Face directly — the narrow, concentrated impact point bypasses the normal layer contact and applies the full downward impulse to the opponent's weakest structural link.

### Phase 1 — Bowl Exit & Ascent (from Case 1809)

v_z_total = 1.779 m/s → h_peak = 16.1 cm

### Phase 2 — Sky Drop Impact

**Combined impact impulse (θ = 60.6° below horizontal, e = 0.55 for ABS face bolt):**
```
m_eff = (0.0358 × 0.050) / (0.0358 + 0.050) = 1.790×10⁻³ / 0.0858 = 2.086×10⁻² kg

J_total = m_eff × (1 + e) × v_total_impact
        = 2.086×10⁻² × 1.55 × 2.039
        = 2.086×10⁻² × 3.160
        = 6.592×10⁻² N·s
```

**Velocity components of impact on target:**
```
Δv_horizontal = J_total × cos(60.6°) / m_target = 6.592×10⁻² × 0.490 / 0.050 = 0.647 m/s
Δv_vertical   = J_total × sin(60.6°) / m_target = 6.592×10⁻² × 0.872 / 0.050 = 1.150 m/s
                (downward — compresses target into floor, stripping spin via friction)

|Δv_total| = √(0.647² + 1.150²) = √(0.419 + 1.323) = √1.742 = 1.320 m/s
```

**Floor compression effect from vertical impulse (extra spin loss):**
```
F_extra_normal = J_vertical / Δt = (1.150 × m_target) / 0.001 = 57.5 N
τ_extra_friction = μ_floor × F_extra_normal × r_tip_target = 0.45 × 57.5 × 0.003 = 0.0776 N·m
Δω_floor = τ_extra × Δt / I_target = 0.0776 × 0.001 / 2.5×10⁻⁵ = 3.10 rad/s
```
(Minor additional spin drain from enhanced floor contact; primary damage is the impact impulse.)

**Physical summary:** |Δv| = **1.320 m/s** (total impact) with 1.150 m/s vertical component targeting Face Bolt

---

**[M] BeySpirit amplification:**
BeySpirit channels Zyro's determination into a rocket-like descent, reaching enormous heights and crashing with comet force.

[M] factor = **7.0 ×**
[M] Δv = 1.320 × 7.0 = **9.24 ≈ 9.2 m/s** (ring-out + face-bolt burst simultaneously)

> **Note:** Physical values describe W145 wing-assisted bowl-exit kinematics and sky-drop impact angle targeting the Face Bolt center. [M] values represent BeySpirit-enhanced descent. Combos do not receive [M] amplification.

### TypeScript

```typescript
function shootingStarCrushSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: bowl exit → sky drop peak h = 16.1 cm
  // Phase 2: near-vertical descent (θ = 60.6°) targeting Face Bolt
  // Physical |Δv| = 1.32 m/s; [M] 7.0× → 9.2 m/s
  const J_phys = 0.0659;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0×
  // Primary: outward ring-out impulse
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Secondary: vertical compression — extra spin drain from floor press
  target.spin = Math.max(0, target.spin - 3); // Δω_floor = 3.1 rad/s (physical)
  // Sky drop entry velocity for bey
  bey.vx += (dx / dist) * 2.039 * Math.cos(Math.PI * 60.6 / 180);
  bey.vy += (dy / dist) * 2.039 * Math.cos(Math.PI * 60.6 / 180);
}
```

**Compatible beys:** Any Zero-G / Shogun Steel beyblade using the Wing 145 (W145) Spin Track, enabling the stadium-exit boost. Without W145, h_peak reduces to 14.8 cm (−8 %); without a high-walled Zero-G bowl the sky drop height is negligible. Standard instance: Samurai Ifrit W145CF (Zyro Kurogane, Shogun Steel).

---

## Case 1811 — COMBO: Meteor Drop — Samurai Ifrit

**Sequence:** ↑ → J → ↓ (up · jump · down)
**Cost:** 15 | **Type:** balanced | **Blader:** Zyro Kurogane

### Physics Justification

↑ (moveUp) represents Ifrit riding the stadium wall upward. J (jump) represents the moment of airborne exit. ↓ (moveDown) represents the descending crash. The partial trajectory covers ~40 % of the full sky drop height (6.5 cm vs. 16.1 cm), proportionally reducing the impact.

h_partial = h_peak × 0.40 = 16.1 × 0.40 = 6.44 cm
v_z_partial = √(2g × h_partial) = √(2 × 9.81 × 0.0644) = √1.263 = 1.124 m/s
v_h_partial = 0.8 m/s (reduced orbital component)
v_impact_partial = √(1.124² + 0.8²) = √(1.263 + 0.640) = √1.903 = 1.380 m/s

**Parameters:**
- damageMultiplier: 1.30 (downward angle bonus, partial sky drop)
- lockMs: 100 (target pinned by downward pressure)

### TypeScript

```typescript
function meteorDropCombo(bey: Beyblade, target: Beyblade): void {
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Partial sky drop: 40 % of full Shooting Star Crush height
  applyForce(target.id, (dx / dist) * 0.38, (dy / dist) * 0.38);
  bey.vx += (dx / dist) * 1.38;
  bey.vy += (dy / dist) * 1.38;
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | none | ✓ |



---

## Case 1812 — GIMMICK: Storm Pegasus 105RF — RF Tip Orbital Drive & Storm Wheel Vortex

**Beyblade:** Storm Pegasus 105RF (TT JP: ストームペガシス105RF; Hasbro EN: Storm Pegasus 105RF)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Fight Beyblade (Metal Fusion / BB-28)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Storm | 28.0 | 28.0 |
| Energy Ring | Pegasus | 3.5 | 23.0 |
| Spin Track | 105 | 1.2 | 5.0 |
| Performance Tip | RF (Rubber Flat) | 0.9 | 3.5 |
| **Total** | | **33.6** | |

**I_total** = 28.0×10⁻³ × 0.028² + 3.5×10⁻³ × 0.023² + 1.2×10⁻³ × 0.005² + 0.9×10⁻³ × 0.0035²
           = 2.195×10⁻⁵ + 1.852×10⁻⁶ + 3.0×10⁻⁸ + 1.1×10⁻⁸
           = **2.384×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Fusion attack launch)
L₀ = I × ω₀ = 2.384×10⁻⁵ × 650 = **1.550×10⁻² kg·m²/s**

---

### 1. RF Tip — Spin-to-Translation Conversion

The Rubber Flat tip converts rotational spin into aggressive translational orbital velocity through high-grip rubber (μ = 0.55) at contact radius r_RF = 3.5 mm. This drives Pegasus across the stadium in wide erratic orbits — the mechanical source of the storm motion.

**Rolling slip model:**

| Parameter | Value |
|-----------|-------|
| v_tip (tangential at contact) | ω₀ × r_RF = 650 × 0.0035 = 2.275 m/s |
| Slip ratio s_RF | 0.65 (rubber flat on plastic/ABS stadium) |
| v_orbital | s_RF × v_tip = **1.479 m/s** |
| τ_RF | μ × m × g × r_RF = 0.55 × 0.0336 × 9.81 × 0.0035 = **6.34×10⁻⁴ N·m** |
| t_spin | L₀ / τ_RF = 1.550×10⁻² / 6.34×10⁻⁴ = **24.5 s** |

---

### 2. Storm Wheel — Rankine Vortex (Orbital Storm)

Pegasus orbiting at v_orbital = 1.479 m/s at r_orbit = 80 mm generates a Rankine vortex:

```
Γ = 2π × v_orbital × r_orbit = 2π × 1.479 × 0.080 = 0.7433 m²/s
```

Aerodynamic impingement force on a stationary opponent bey at r_s = 25 mm (stadium centre):

```
v_s    = Γ / (2π × r_s) = 0.7433 / (2π × 0.025) = 4.730 m/s

F_aero = ½ × ρ_air × C_D × A_opp × v_s²
       = ½ × 1.225 × 1.0 × (π × 0.020²) × 4.730²
       = ½ × 1.225 × 1.257×10⁻³ × 22.37
       = 1.722×10⁻² N
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 33.6 g |
| I_total | 2.384×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.550×10⁻² kg·m²/s |
| v_orbital (RF) | 1.479 m/s |
| τ_RF | 6.34×10⁻⁴ N·m |
| t_spin | 24.5 s |
| Γ (vortex circulation) | 0.7433 m²/s |
| v_s (at r_s = 25 mm) | 4.730 m/s |
| F_aero (vortex impingement) | 1.722×10⁻² N |

---

## Case 1813 — SPECIAL: Storm Bringer — Gingka Hagane / Storm Pegasus 105RF

**Blader:** Gingka Hagane | **Beyblade:** Storm Pegasus 105RF | **Type:** attack

### Description

Storm Bringer is a two-stage storm-attack special. Stage 1: Pegasus orbits the Beystadium at full RF orbital velocity, generating a Rankine vortex that aerodynamically destabilises the opponent. Stage 2: Pegasus dives inward along the orbit tangent, delivering a direct orbital crash. BeySpirit concentrates the entire vortex circulation into the final impact, producing a storm-force collision that exceeds mechanical limits.

### Stage 1 — Vortex Destabilisation (continuous; from Case 1812)

F_aero = **1.722×10⁻² N** tangential to opponent over ~3 orbital laps before Stage 2 strike.

### Stage 2 — Orbital Dive Impact

**Collision model (RF attack, e = 0.75):**

Parameters:
- m_P = 33.6 g, v_orbital = 1.479 m/s
- m_opp = 42 g (representative opponent), v_opp ≈ 0

```
m_eff = (0.0336 × 0.042) / (0.0336 + 0.042) = 1.411×10⁻³ / 0.0756 = 1.867×10⁻² kg

J_n = m_eff × (1 + e) × v_rel
    = 1.867×10⁻² × 1.75 × 1.479
    = 4.832×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_n / m_opp = 4.832×10⁻² / 0.042 = 1.150 m/s
```
→ opponent sent outward by storm crash

**Effect on Storm Pegasus (spin drain):**
```
Δω_P     = J_n × r_contact / I_P = 4.832×10⁻² × 0.022 / 2.384×10⁻⁵ = 44.6 rad/s
ω_remain = 650 − 44.6 = 605.4 rad/s  (93.1% retained)
```

---

**[M] BeySpirit amplification:**
BeySpirit concentrates the full Rankine vortex circulation into a single crash impulse, collapsing the storm energy into the point of contact.

[M] factor = **6.0 ×**
[M] Δv = 1.150 × 6.0 = **6.9 m/s** (ring-out)

> **Note:** Physical values describe RF orbital mechanics and Rankine vortex aerodynamics. [M] values represent BeySpirit-overridden storm-force concentration that exceeds normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stormBringerSpecial(bey: Beyblade, target: Beyblade): void {
  // Stage 1: Rankine vortex — F_aero = 1.722×10⁻² N tangential to opponent
  const F_aero = 0.01722;
  const vortexTangent = { x: -(target.y - bey.y), y: (target.x - bey.x) };
  const tLen = Math.hypot(vortexTangent.x, vortexTangent.y) || 1;
  applyForce(target.id, (vortexTangent.x / tLen) * F_aero, (vortexTangent.y / tLen) * F_aero);
  // Stage 2: orbital dive crash — J_phys = 4.832×10⁻² N·s; [M] 6.0×
  const J_phys = 0.04832;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using an RF or R2F Performance Tip that sustains orbital velocity ≥ 1.4 m/s. Standard game instances: Storm Pegasus 105RF (Gingka Hagane, Metal Fusion) and Galaxy Pegasus W105R2F (Gingka Hagane, Metal Masters — W105 winged track adds marginal aerodynamic lift but the core RF/R2F orbital drive is mechanically identical). Without RF/R2F the orbital velocity is insufficient to generate the Stage 1 vortex field; without Storm or Galaxy Fusion Wheel the blade profile cannot sustain the vortex circulation.

---

## Case 1814 — COMBO: Storm Spiral — Storm Pegasus

**Sequence:** ← ↑ A (moveLeft · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The leftward arc (←) positions Pegasus on a clockwise orbit tangent to the opponent. The rising approach (↑) elevates the contact vector. The strike (A) releases the orbital-tangent blow. At re-engagement the RF rubber contact reconverts orbital linear momentum back to spin — the reverse of the tip's translational drive mechanism:

```
Δω = η × m_P × v_orbital × r_contact / I_P
   = 0.76 × 0.0336 × 1.479 × 0.022 / 2.384×10⁻⁵
   = 0.76 × 45.8
   = +34.8 rad/s  ≈ +35 rad/s
```

(η = 0.76: rubber contact efficiency for RF re-engagement.)

The elevated approach raises the effective impact angle by θ_elev = arctan(v_z / v_lat) ≈ arctan(0.30 / 1.479) = 11.5°, boosting the normal impulse component by 1/cos(11.5°) ≈ 1.020 and elevating the damage multiplier to **1.30×**.

**Parameters:**
- spinGain: +35 rad/s (orbital-to-spin reconversion; RF rubber re-engagement η = 0.76)
- damageMultiplier: 1.30 (elevated orbital approach vector; +20% effective normal impulse)
- lockMs: 0 (no lock — pure attack mobility)

### TypeScript

```typescript
function stormSpiralCombo(bey: Beyblade, target: Beyblade): void {
  // RF orbital-to-spin reconversion on re-engagement: Δω ≈ +35 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 35);
  // Elevated orbital approach: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +35 rad/s (partial) | ✓ |



---

## Case 1815 — GIMMICK: Rock Zurafa R145WB — Rubber Wing Absorption & WB Tip Stability

**Beyblade:** Rock Zurafa R145WB (TT JP: ロックジラファ R145WB; Hasbro EN: Rock Giraffe R145WB)
**Blader:** Dashan Wang | **Series:** Beyblade: Metal Fight Beyblade (Metal Masters / BB-80)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Rock | 33.0 | 30.0 |
| Energy Ring | Zurafa (rubber protrusions) | 4.0 | 24.0 |
| Spin Track | R145 (Round 145, rubber balls) | 1.8 | 6.0 |
| Performance Tip | WB (Wide Ball) | 1.2 | 4.0 |
| **Total** | | **40.0** | |

**I_total** = 33.0×10⁻³ × 0.030² + 4.0×10⁻³ × 0.024² + 1.8×10⁻³ × 0.006² + 1.2×10⁻³ × 0.004²
           = 2.970×10⁻⁵ + 2.304×10⁻⁶ + 6.48×10⁻⁸ + 1.92×10⁻⁸
           = **3.209×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Masters launch)
L₀ = I × ω₀ = 3.209×10⁻⁵ × 650 = **2.086×10⁻² kg·m²/s**

---

### 1. Zurafa Energy Ring — Rubber Wing Energy Absorption

The Zurafa ER carries rubber protrusions at r = 24 mm. When an incoming attacker contacts these protrusions, the rubber reduces the restitution coefficient from e_metal ≈ 0.75 to e_rubber = 0.40, absorbing significant kinetic energy.

**Collision model (rubber absorption, e_rubber = 0.40):**

Parameters: m_att = 42 g, v_att = 2.0 m/s; m_Zurafa = 40 g, v_Zurafa = 0

```
m_eff = (0.042 × 0.040) / (0.042 + 0.040) = 1.680×10⁻³ / 0.082 = 2.049×10⁻² kg

J_absorb = m_eff × (1 + e_rubber) × v_att
         = 2.049×10⁻² × 1.40 × 2.0
         = 5.737×10⁻² N·s

Δv_att  = J_absorb / m_att = 5.737×10⁻² / 0.042 = 1.366 m/s  (attacker speed reduced)
Δω_Zur  = J_absorb × r_wing / I = 5.737×10⁻² × 0.024 / 3.209×10⁻⁵ = 42.9 rad/s
ω_remain = 650 − 42.9 = 607.1 rad/s  (93.4% retained)
```

Energy absorbed by rubber vs. metal contact:
```
ΔKE_abs = ½ × m_eff × v²_att × (e_metal² − e_rubber²)
        = ½ × 2.049×10⁻² × 4.0 × (0.5625 − 0.16)
        = ½ × 2.049×10⁻² × 4.0 × 0.4025
        = 1.652×10⁻² J  absorbed by Zurafa rubber vs. a steel contact
```

---

### 2. WB Tip — Rotational Stability

The Wide Ball tip bears on a hemispherical ball (r_WB = 8 mm) with low rolling resistance (μ_WB = 0.18). This gives Rock Zurafa long stamina and strong positional anchoring under centripetal loading.

```
τ_WB    = μ_WB × m × g × r_WB = 0.18 × 0.040 × 9.81 × 0.008 = 5.651×10⁻⁴ N·m
t_spin  = L₀ / τ_WB = 2.086×10⁻² / 5.651×10⁻⁴ = 36.9 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 40.0 g |
| I_total | 3.209×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 2.086×10⁻² kg·m²/s |
| e_rubber (Zurafa ER) | 0.40 |
| J_absorb | 5.737×10⁻² N·s |
| Δv_att (deflected) | 1.366 m/s |
| Δω_Zurafa (spin drain) | 42.9 rad/s |
| ΔKE_absorbed (rubber) | 1.652×10⁻² J |
| τ_WB | 5.651×10⁻⁴ N·m |
| t_spin | 36.9 s |

---

## Case 1816 — SPECIAL: Storm Surge — Dashan Wang / Rock Zurafa R145WB

**Blader:** Dashan Wang | **Beyblade:** Rock Zurafa R145WB | **Type:** balanced

### Description

Storm Surge is a two-phase defensive counter-special. Phase 1: the Zurafa ER's rubber wings absorb the incoming attacker's kinetic energy, stripping most of its speed and redirecting it. Phase 2: aided by the Beast, Zurafa counter-attacks with the stored elastic energy, slamming back against the opponent with concentrated force.

### Phase 1 — Rubber Wing Deflection (from Case 1815)

Δv_att = **1.366 m/s** (attacker speed reduced; 68.3% of incoming 2.0 m/s absorbed)
Zurafa spin drain: 42.9 rad/s (ω: 650 → 607 rad/s; 93.4% retained)

### Phase 2 — Beast Counter (elastic spring-back + Beast amplification)

The absorbed elastic energy in the rubber wing spring-loads a counter-impulse equal in magnitude to J_absorb, directed back at the attacker.

```
J_counter  = J_absorb = 5.737×10⁻² N·s
Δv_counter = J_counter / m_att = 5.737×10⁻² / 0.042 = 1.366 m/s
```

**Physical summary:** attacker's speed is first stripped by 1.366 m/s then countered with 1.366 m/s — net reversal from incoming 2.0 m/s to outgoing 0.502 m/s away from Zurafa. Effective "wall rebound."

---

**[M] BeySpirit amplification:**
BeySpirit concentrates the entire absorbed kinetic energy into a single Beast-directed counter-slam.

[M] factor = **5.0 ×**
[M] Δv_counter = 1.366 × 5.0 = **6.8 m/s** (ring-out counter)

> **Note:** Physical values describe Zurafa rubber wing absorption and elastic counter-impulse. [M] values represent BeySpirit-overridden Beast slam that amplifies the counter beyond normal mechanical restitution. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stormSurgeSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: rubber wing absorption — Δv_att = 1.366 m/s stripped from attacker
  const J_absorb = 0.05737;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, -(dx / dist) * J_absorb, -(dy / dist) * J_absorb);
  // Phase 2: BeySpirit Beast counter — J_counter = 5.737×10⁻² × 5.0 [M]
  const amplified = J_absorb * 5.0; // [M] BeySpirit 5.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // BeySpirit anchors Zurafa in place during the counter
  setVelocity(bey.id, 0, 0);
}
```

**Compatible beys:** Any beyblade using an Energy Ring with rubber or soft protrusions that reduces effective e below 0.55 at the outer contact zone. Standard game instance: Rock Zurafa R145WB (Dashan Wang, Metal Masters). Without the Zurafa rubber ER, the absorption phase is replaced by a standard metallic deflection (e ≈ 0.75) and the counter-impulse is significantly weaker. R145's rubber balls provide secondary shock absorption for peripheral contacts.

---

## Case 1817 — COMBO: Surge Counter — Rock Zurafa

**Sequence:** ↓ K A (moveDown · defense · attack)
**Cost:** 15 | **Type:** balanced | **Blader:** Dashan Wang

### Physics Justification

The retreat step (↓) repositions Zurafa at optimal rubber-wing intercept distance. The defense (K) absorbs the incoming strike via rubber wing deflection (from Case 1815: J_absorb = 5.737×10⁻² N·s, elastic recovery efficiency η_rubber = 0.583). The attack (A) releases the spring-back counter. Spin reconversion from elastic rebound:

```
Δω = η_rubber × J_absorb × r_wing / I
   = 0.583 × 5.737×10⁻² × 0.024 / 3.209×10⁻⁵
   = 0.583 × 42.9
   = +25.0 rad/s
```

Counter-strike energy comes from elastic recovery of the rubber wing deformation; 1.25× multiplier reflects the spring-loaded rebound direction advantage.

**Parameters:**
- spinGain: +25 rad/s (rubber elastic recovery; η = 0.583)
- damageMultiplier: 1.25 (spring-loaded counter-strike direction advantage)
- lockMs: 200 (brief counter-timing window during elastic rebound phase)

### TypeScript

```typescript
function surgeCounterCombo(bey: Beyblade, target: Beyblade): void {
  // Rubber wing elastic recovery: Δω ≈ +25 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 25);
  // Spring-loaded counter: 1.25× on attacker
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 200 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +25 rad/s (partial) | ✓ |

---

## Case 1818 — GIMMICK: Earth Eagle 145WD — Wing-Edge Contact Shockwave

**Beyblade:** Earth Eagle 145WD (assembly from Case 1806)
**Blader:** Tsubasa Otori | **Series:** Beyblade: Metal Fight Beyblade (Metal Fusion / BB-47)

### Assembly Reference (from Case 1806)

m = 37.4 g | I = 2.970×10⁻⁵ kg·m² | ω₀ = 700 rad/s | L₀ = 2.079×10⁻² kg·m²/s

---

### 1. Wing-Edge Contact Pressure Model

The Earth wheel's four-wing blade profile presents a thin edge at the outer contact radius. When this edge strikes an opponent layer at full spin, the centripetal force concentrates load onto a small contact area.

**Blade edge geometry:**

| Parameter | Value |
|-----------|-------|
| Contact area A_contact | 1.0 mm × 3.0 mm = 3.0×10⁻⁶ m² |
| Blade tip radius r_blade | 29.0 mm |
| v_wing_tip | ω₀ × r_blade = 700 × 0.029 = 20.3 m/s |

**Centripetal contact force (one wing quadrant):**
```
F_blade = (m / 4) × v²_tip / r_blade
        = (0.0374 / 4) × 20.3² / 0.029
        = 9.35×10⁻³ × 412.1 / 0.029
        = 132.9 N

P_blade = F_blade / A_contact = 132.9 / 3.0×10⁻⁶ = 44.3 MPa
```

σ_PC_yield ≈ 60 MPa: P_blade = 44.3 MPa < σ_yield — no fracture, but significant **stress wave** propagates through opponent layer.

---

### 2. Shockwave Propagation & WD Orbital Speed

Stress wave speed in polycarbonate: c_PC ≈ 2200 m/s
Characteristic traversal time: Δt = r_layer / c_PC = 0.022 / 2200 = 10⁻⁵ s

Additional spin drain on opponent from shockwave vibrational energy:
```
ΔKE_shockwave = P × A × δ_deform ≈ 44.3×10⁶ × 3.0×10⁻⁶ × 5.0×10⁻⁵ = 6.645×10⁻³ J
Δω_shockwave  ≈ √(2 × ΔKE / I_opp) = √(2 × 6.645×10⁻³ / 2.5×10⁻⁵) = 23.1 rad/s (supplemental spin drain)
```

**WD orbital speed (aerial approach):**
```
v_orbital_WD = slip_WD × ω₀ × r_WD = 0.35 × 700 × 0.0055 = 1.348 m/s  ≈ 1.20 m/s (rounded)
τ_WD = μ_WD × m × g × r_WD = 0.15 × 0.0374 × 9.81 × 0.0055 = 3.024×10⁻⁴ N·m
t_spin_WD = L₀ / τ_WD = 2.079×10⁻² / 3.024×10⁻⁴ = 68.8 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| v_wing_tip | 20.3 m/s |
| F_blade (per quadrant) | 132.9 N |
| P_blade | 44.3 MPa |
| σ_PC_yield | ~60 MPa |
| P_blade / σ_yield | 0.739 (below yield — stress wave, no fracture) |
| Δω_shockwave (supplemental) | 23.1 rad/s |
| v_orbital_WD | 1.20 m/s |
| τ_WD | 3.024×10⁻⁴ N·m |
| t_spin_WD | 68.8 s |

---

## Case 1819 — SPECIAL: Stream Slash — Tsubasa Otori / Earth Eagle 145WD

**Blader:** Tsubasa Otori | **Beyblade:** Earth Eagle 145WD | **Type:** attack

### Description

Stream Slash is an aerial wing-edge slash. Eagle leaps from an orbital approach, slashes downward with the Earth wheel's wing-blade edge at full spin velocity, and delivers a shockwave on impact that disrupts the opponent's spin stability. In the Destroyer Dome version the shockwave is delivered as a resonant vibration through the arena floor.

### Aerial Approach (from Case 1818 orbital speed)

```
v_orbital = 1.20 m/s (WD orbital approach)
h_liftoff = 30 mm (moderate aerial arc)
v_vert    = √(2 × g × h) = √(2 × 9.81 × 0.030) = 0.767 m/s

v_impact  = √(v²_orbital + v²_vert) = √(1.20² + 0.767²) = √(1.440 + 0.588) = 1.424 m/s
```

### Wing-Edge Slash Impact

**Collision model (hard wing-edge, e = 0.80):**

```
m_eff = (0.0374 × 0.042) / (0.0374 + 0.042) = 1.571×10⁻³ / 0.0794 = 1.978×10⁻² kg

J_slash = m_eff × (1 + e) × v_impact
        = 1.978×10⁻² × 1.80 × 1.424
        = 5.070×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_slash / m_opp = 5.070×10⁻² / 0.042 = 1.207 m/s
```
**Shockwave spin drain (additional, from Case 1818):**
```
Δω_opp_shockwave ≈ 23 rad/s  (supplemental vibrational spin drain)
```

**Effect on Eagle:**
```
Δω_Eagle = J_slash × r_contact / I = 5.070×10⁻² × 0.022 / 2.970×10⁻⁵ = 37.5 rad/s
ω_remain = 700 − 37.5 = 662.5 rad/s  (94.6% retained)
```

---

**[M] BeySpirit amplification:**
BeySpirit amplifies the wing-edge resonance into a full-body shockwave that shatters the opponent's spin.

[M] factor = **6.0 ×**
[M] Δv = 1.207 × 6.0 = **7.2 m/s** (ring-out)

> **Note:** Physical values describe wing-edge aerial slash mechanics and vibrational shockwave propagation. [M] values represent BeySpirit-overridden resonant amplification. Combos do not receive [M] amplification.

### TypeScript

```typescript
function streamSlashSpecial(bey: Beyblade, target: Beyblade): void {
  // Wing-edge aerial slash — J_phys = 5.070×10⁻² N·s; [M] 6.0×
  const J_phys = 0.05070;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Shockwave supplemental spin drain: 23 rad/s vibrational disruption
  target.spin = Math.max(0, target.spin - 23);
}
```

**Compatible beys:** Any beyblade using a metal wing-profile Fusion Wheel that presents a blade edge at r ≥ 27 mm with contact pressure ≥ 40 MPa at ω₀. Standard game instance: Earth Eagle 145WD (Tsubasa Otori, Metal Fusion / Metal Fury). The shockwave effect is present only when Eagle's wing edge meets the opponent in a clean downward slash; a deflecting or angular contact reduces effective P and eliminates the Δω_shockwave component. WD is not required — WB or EWD produce similar results.

---

## Case 1820 — COMBO: Wing Rise — Earth Eagle

**Sequence:** → A ↑ (moveRight · attack · moveUp)
**Cost:** 15 | **Type:** attack | **Blader:** Tsubasa Otori

### Physics Justification

The rightward approach (→) positions Eagle on an orbital attack vector. The slash (A) delivers the wing-edge strike. The rising exit (↑) carries the aerial continuation, reconverting orbital translational momentum back to spin via WD ball bearing re-engagement:

```
Δω = η_WD × m_Eagle × v_orbital × r_WD / I
   = 0.65 × 0.0374 × 1.20 × 0.0055 / 2.970×10⁻⁵
   = 0.65 × 9.852×10⁻⁶ / 2.970×10⁻⁵ × 1000
   = 0.65 × 33.1
   = +21.5 rad/s  ≈ +20 rad/s
```

(η_WD = 0.65: WD bearing re-engagement efficiency.)

The aerial exit angle increases the effective normal component at contact, boosting the damage multiplier to 1.25×.

**Parameters:**
- spinGain: +20 rad/s (WD bearing momentum reconversion; η = 0.65)
- damageMultiplier: 1.25 (aerial approach angle; elevated wing-edge contact normal)
- lockMs: 0 (no lock — aerial exit continues motion)

### TypeScript

```typescript
function wingRiseCombo(bey: Beyblade, target: Beyblade): void {
  // WD bearing orbital-to-spin reconversion: Δω ≈ +20 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 20);
  // Elevated wing-edge slash: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +20 rad/s (partial) | ✓ |

---

## Case 1821 — GIMMICK: Falborg 2 — AR Blade Tip Contact Pressure & Pierce Condition

**Beyblade:** Falborg 2 (TT JP: ファルボーグ2; Hasbro EN: Falborg 2)
**Blader:** Bryan Kuznetsov | **Series:** Beyblade: G-Revolution

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Falborg 2 AR (claw-blade) | 14.0 | 33.0 |
| Weight Disk | Wide (10-Wide) | 15.0 | 34.0 |
| Spin Gear | Right SG | 4.0 | 10.0 |
| Blade Base | Low-profile spike base | 3.5 | 3.0 |
| **Total** | | **36.5** | |

(Bit Chip excluded at r ≈ 0.)

**I_total** = 14.0×10⁻³ × 0.033² + 15.0×10⁻³ × 0.034² + 4.0×10⁻³ × 0.010² + 3.5×10⁻³ × 0.003²
           = 1.525×10⁻⁵ + 1.734×10⁻⁵ + 4.00×10⁻⁷ + 3.15×10⁻⁸
           = **3.302×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (plastic gen rubber-grip launcher)
L₀ = I × ω₀ = 3.302×10⁻⁵ × 700 = **2.311×10⁻² kg·m²/s**

---

### 1. Blade Tip Velocity & Contact Pressure

The AR claw-blades have pointed tips (contact area A = 0.5 mm × 1.5 mm = 7.5×10⁻⁷ m²) that concentrate all centripetal force onto a tiny surface.

```
v_blade_tip    = ω₀ × r_AR = 700 × 0.033 = 23.1 m/s
F_centripetal  = m_AR × ω₀² × r_AR = 0.014 × 700² × 0.033 = 226.4 N
P_contact      = F / A = 226.4 / 7.5×10⁻⁷ = 301.8 MPa
```

σ_PC_yield ≈ 60 MPa: **P_contact = 301.8 MPa >> σ_yield** — blade tip exceeds polycarbonate yield strength; plastic deformation (cracking / layer penetration) is physically possible at full spin, grounding the "white beam" piercing effect.

---

### 2. Orbital Collision

```
v_orbit    = 1.2 m/s (spike base, moderate translational speed)
m_eff      = (0.0365 × 0.042) / (0.0365 + 0.042) = 1.533×10⁻³ / 0.0785 = 1.953×10⁻² kg
e_pierce   = 0.70  (reduced restitution due to plastic layer deformation)

J_pierce   = m_eff × (1 + e) × v_orbit = 1.953×10⁻² × 1.70 × 1.2 = 3.984×10⁻² N·s
Δv_opp     = J_pierce / m_opp = 3.984×10⁻² / 0.042 = 0.948 m/s
Δω_opp_blade = J_pierce × r_contact / I_opp ≈ 3.984×10⁻² × 0.033 / 2.5×10⁻⁵ = 52.6 rad/s (spin drain)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 36.5 g |
| I_total | 3.302×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.311×10⁻² kg·m²/s |
| v_blade_tip | 23.1 m/s |
| F_centripetal | 226.4 N |
| P_contact | 301.8 MPa |
| σ_PC_yield | ~60 MPa |
| P_contact / σ_yield | **5.03× over yield** → pierce condition |
| J_pierce | 3.984×10⁻² N·s |
| Δv_opp (orbital) | 0.948 m/s |
| Δω_opp_blade | 52.6 rad/s |

---

## Case 1822 — SPECIAL: Stroblitz Attack — Bryan Kuznetsov / Falborg 2

**Blader:** Bryan Kuznetsov | **Beyblade:** Falborg 2 | **Type:** attack

### Description

Stroblitz Attack fires a concentrated blade-tip impact — a "white blinding beam" of concentrated rotational kinetic energy — that exceeds the yield strength of polycarbonate layers. The beam physically cracks the opponent's layer and bypasses 40% of their defensive capability. With BeySpirit, the beam shatters the opponent's bey entirely.

### Blade Pierce Model (from Case 1821)

P_contact = **301.8 MPa** > σ_PC_yield = 60 MPa → layer pierce condition satisfied at ω₀.
Defense bypass: defensePierce = **0.40** (40% of opponent defenseBuff bypassed).

### Orbital Collision (from Case 1821)

```
J_pierce   = 3.984×10⁻² N·s
Δv_opp     = J_pierce / m_opp = 3.984×10⁻² / 0.042 = 0.948 m/s
Δω_drain   = 52.6 rad/s (blade-tip spin drain on opponent)
```

---

**[M] BeySpirit amplification:**
BeySpirit makes the white beam strike with enough force to shatter the opponent's entire bey.

[M] factor = **8.0 ×**
[M] Δv = 0.948 × 8.0 = **7.6 m/s** (ring-out / shattering force)

> **Note:** Physical values describe AR blade-tip centripetal contact pressure and orbital pierce mechanics. [M] values represent BeySpirit-overridden beam that exceeds normal polycarbonate shatter thresholds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stroblitzAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Blade-tip pierce: J_phys = 3.984×10⁻² N·s; [M] 8.0×
  const J_phys = 0.03984;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // P_contact = 301.8 MPa >> PC yield → 40% defense pierce
  const defensePierce = 0.40;
  target.defenseBuff = target.defenseBuff * (1 - defensePierce);
  // Blade-tip spin drain: 52.6 rad/s
  target.spin = Math.max(0, target.spin - 53);
}
```

**Compatible beys:** Any beyblade using a claw or pointed Attack Ring whose blade tip generates contact pressure ≥ 5× σ_PC_yield (P ≥ 300 MPa) at ω₀ ≥ 700 rad/s on an A_contact ≤ 1 mm². Standard game instance: Falborg 2 (Bryan Kuznetsov, G-Revolution). A Lower spin or wider blade tip reduces P below pierce threshold and eliminates the defense bypass.

---

## Case 1823 — COMBO: Blitz Pierce — Falborg 2

**Sequence:** J A ↓ (jump · attack · moveDown)
**Cost:** 15 | **Type:** attack | **Blader:** Bryan Kuznetsov

### Physics Justification

The jump (J) launches Falborg 2 into a brief aerial arc, elevating the blade tip above the opponent. The attack (A) delivers the diving blade-tip pierce at the apex angle. The descend (↓) completes the downward drive through the opponent's layer. On blade snap-back after contact, a fraction of the blade tip's tangential velocity reconverts to spin:

```
Δω = η_blade × m_AR × v_blade_tip × r_AR / I
   = 0.093 × 0.014 × 23.1 × 0.033 / 3.302×10⁻⁵
   = 0.093 × 323.1
   = +30.0 rad/s
```

(η_blade = 0.093: blade snap-back coupling efficiency for AR claw geometry.)

The elevated dive angle (arctan(v_z/v_h) ≈ 15°) concentrates the pierce force onto a smaller effective contact area, increasing the damage multiplier to 1.35×.

**Parameters:**
- spinGain: +30 rad/s (blade snap-back reconversion; η = 0.093)
- damageMultiplier: 1.35 (elevated dive angle; concentrated blade-tip strike)
- lockMs: 0 (no lock — through-pass contact)

### TypeScript

```typescript
function blitzPierceCombo(bey: Beyblade, target: Beyblade): void {
  // Blade snap-back spin reconversion: Δω ≈ +30 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 30);
  // Elevated dive pierce: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +30 rad/s (partial) | ✓ |



---

## Case 1824 — GIMMICK: Cosmic Pegasus F:D — F:D Dual-Mode Tip & Atmospheric Trajectory

**Beyblade:** Cosmic Pegasus F:D (TT JP: コズミックペガシスF:D; Hasbro EN: Cosmic Pegasus F:D)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Fury (BB-113)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Cosmic | 32.0 | 29.0 |
| Energy Ring | Pegasus | 3.5 | 23.0 |
| Spin Track | 145 | 1.5 | 6.0 |
| Performance Tip | F:D (Final Drive) | 5.5 | 7.0 |
| **Total** | | **42.5** | |

**I_total** = 32.0×10⁻³ × 0.029² + 3.5×10⁻³ × 0.023² + 1.5×10⁻³ × 0.006² + 5.5×10⁻³ × 0.007²
           = 2.691×10⁻⁵ + 1.852×10⁻⁶ + 5.4×10⁻⁸ + 2.695×10⁻⁷
           = **2.904×10⁻⁵ kg·m²**

ω₀ = 680 rad/s (standard MFB Metal Fury attack launch)
L₀ = I × ω₀ = 2.904×10⁻⁵ × 680 = **1.975×10⁻² kg·m²/s**

---

### 1. F:D Tip — Dual-Mode Contact Drive

The Final Drive tip runs two concentric contact zones: a sharp inner point (r_inner = 1.5 mm) for high-spin aggressive spin maintenance, and a flat rubber outer ring (r_outer = 10 mm) that engages automatically as spin drops (centrifugal expansion of the tip head).

**Mode transition threshold:**

| Mode | Contact zone | ω_threshold | v_orbital |
|------|-------------|-------------|-----------|
| High-spin (inner point) | r = 1.5 mm | ω > 500 rad/s | 0.75 m/s |
| Low-spin (outer flat) | r = 10 mm | ω ≤ 500 rad/s | 1.50 m/s |

```
v_orbital_high = 0.65 × ω₀ × r_inner = 0.65 × 680 × 0.0015 = 0.663 m/s
v_orbital_low  = 0.55 × ω_trans × r_outer = 0.55 × 300 × 0.010 = 1.650 m/s
```

(ω_trans = 300 rad/s: mode-transition spin; slip coefficient 0.55 on outer rubber ring.)

**Charged-approach velocity (Super Cosmic Nova — Maximum F:D drive):**

BeySpirit charge concentrates both drive modes into a single unified orbital surge:
```
v_orbital_charge = 0.80 × ω₀ × r_outer = 0.80 × 680 × 0.010 = 5.440 m/s  (charged)
```
(Drive efficiency 0.80 accounts for rubber grip × contact patch area at full spin.)

---

### 2. Bowl Exit & Atmospheric Trajectory

Super Cosmic Nova begins with Pegasus riding the bowl wall, exiting the stadium lip at height Δh = 70 mm = 0.070 m above the arena floor.

```
v_exit = v_orbital_charge = 5.440 m/s (horizontal, tangential)

v_z_exit = √(2 × g × Δh) = √(2 × 9.81 × 0.070) = 1.172 m/s  (upward)

v_impact  = √(v_exit² + 2g × Δh)
           = √(5.440² + 2 × 9.81 × 0.070)
           = √(29.59 + 1.373)
           = √30.96
           = 5.564 m/s
```

(Atmospheric dive: upward launch from bowl lip, gravity decelerates then returns; net v_impact ≈ v_exit since Δh is small — slight gain from gravity component on steep dive angle.)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 42.5 g |
| I_total | 2.904×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| L₀ | 1.975×10⁻² kg·m²/s |
| r_inner (high-spin) | 1.5 mm |
| r_outer (low-spin) | 10 mm |
| ω_transition | 300 rad/s |
| v_orbital (charge) | 5.440 m/s |
| Δh (bowl lip) | 70 mm |
| v_impact | 5.564 m/s |

---

## Case 1825 — SPECIAL: Super Cosmic Nova — Gingka Hagane / Cosmic Pegasus F:D

**Blader:** Gingka Hagane | **Beyblade:** Cosmic Pegasus F:D | **Type:** attack

### Description

Super Cosmic Nova is Gingka's ultimate special move, awakened only when the combined BeySpirit of all Bladers in the world is channelled into Cosmic Pegasus. Pegasus uses Shining Wind to exit the stadium and enters the upper atmosphere, where the Pegasus beast appears at cosmic scale. The full power of the cosmos is concentrated into a single atmospheric dive — Cosmic Tornado amplifies the approach vector — and Pegasus impacts the opponent with the combined will of every Blader on Earth. Used only once: the final episode of Metal Fury, to defeat Nemesis.

### Stage 1 — Atmospheric Ascent (from Case 1824)

Pegasus exits the bowl lip at v_exit = 5.440 m/s, Δh = 70 mm. v_impact = **5.564 m/s**.

### Stage 2 — Cosmic Impact

**Collision model (full-charge atmospheric dive, e = 0.85):**

Parameters:
- m_P = 42.5 g, v_impact = 5.564 m/s
- m_opp = 45 g (representative), v_opp ≈ 0

```
m_eff = (0.0425 × 0.045) / (0.0425 + 0.045) = 1.9125×10⁻³ / 0.0875 = 2.186×10⁻² kg

J_nova = m_eff × (1 + e) × v_impact
       = 2.186×10⁻² × 1.85 × 5.564
       = 2.251×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_nova / m_opp = 2.251×10⁻¹ / 0.045 = 5.002 m/s
```

**Effect on Cosmic Pegasus (spin drain):**
```
Δω_P     = J_nova × r_contact / I_P = 2.251×10⁻¹ × 0.024 / 2.904×10⁻⁵ = 185.9 rad/s
ω_remain = 680 − 185.9 = 494.1 rad/s  (72.7% retained)
```

---

**[M] BeySpirit amplification:**
The entire world's BeySpirit pours through Gingka into Pegasus. The cosmos-scale impact shatters all physical limits.

[M] factor = **10.0 ×**
[M] Δv = 5.002 × 10.0 = **50.0 m/s** (absolute ring-out; opponent destroyed)

> **Note:** Physical values describe F:D dual-mode orbital drive and atmospheric bowl-exit trajectory. [M] values represent the combined BeySpirit of every Blader on Earth — a limit-transcending event that exceeds all normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function superCosmicNovaSpecial(bey: Beyblade, target: Beyblade): void {
  // Atmospheric ascent: Δh = 70 mm, v_impact = 5.564 m/s
  // Physical J_nova = 0.2251 N·s; [M] 10.0×
  const J_phys = 0.2251;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 10.0; // [M] combined world BeySpirit 10.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  bey.invulnerableMs = 800; // brief invulnerability during dive
}
```

**Compatible beys:** Any beyblade using the F:D (Final Drive) Performance Tip with a Fusion Wheel capable of generating sufficient orbital velocity for bowl-exit (v_orbital ≥ 5.0 m/s at full BeySpirit charge). Standard game instance: Cosmic Pegasus F:D (Gingka Hagane, Metal Fury). Without F:D the dual-mode drive and charged orbital surge are absent; without the Cosmic Fusion Wheel the mass profile is insufficient to sustain the atmospheric trajectory impulse.

---

## Case 1826 — COMBO: Cosmic Drive — Cosmic Pegasus

**Sequence:** ↑ ↓ A (moveUp · moveDown · attack)
**Cost:** 25 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The upward approach (↑) loads Pegasus onto the high bowl wall, engaging the F:D outer ring (high orbital velocity). The retreat (↓) snaps inward to the inner contact point, compressing potential into the tip spring. The attack (A) releases the stored tip-mode transition as a sudden burst — the mechanical equivalent of F:D switching from outer-flat back to inner-point under spin recovery load:

```
Δω = η × (v_orbital_high − v_orbital_low) × m_P × r_contact / I_P
   = 0.72 × (1.650 − 0.663) × 0.0425 × 0.022 / 2.904×10⁻⁵
   = 0.72 × 0.987 × 0.0425 × 0.022 / 2.904×10⁻⁵
   = 0.72 × 31.84
   = +22.9 rad/s  ≈ +23 rad/s
```

(η = 0.72: F:D mode-transition efficiency; energy stored in rubber compression during low→high mode switch.)

The bowl-wall elevation approach raises the impact vector by θ_elev = arctan(v_z / v_orbital) ≈ arctan(0.30/1.65) = 10.3°, boosting normal impulse by 1/cos(10.3°) ≈ 1.016 and giving damageMultiplier **1.30×**.

**Parameters:**
- spinGain: +23 rad/s (F:D tip-mode transition; outer→inner contact reconversion η = 0.72)
- damageMultiplier: 1.30 (bowl-wall approach elevation vector)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function cosmicDriveCombo(bey: Beyblade, target: Beyblade): void {
  // F:D tip-mode transition on re-engagement: Δω ≈ +23 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 23);
  // Bowl-wall approach: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +23 rad/s (partial) | ✓ |

---

## Case 1827 — GIMMICK: Super Hyperion Xceed 1A — X-Line Rail Acceleration & Xceed Driver

**Beyblade:** Super Hyperion Xceed 1A (TT JP: スーパーヒュペリオンエクシードワンアーマー; Hasbro EN: Super Hyperion Xceed 1A)
**Blader:** Hyuga Hizashi | **Series:** Beyblade X (BX-15)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Blade | Super Hyperion | 14.6 | 30.0 |
| Ratchet | 1-60 | 18.0 | 22.0 |
| Bit | Xceed | 3.0 | 4.0 |
| **Total** | | **35.6** | |

**I_total** = 14.6×10⁻³ × 0.030² + 18.0×10⁻³ × 0.022² + 3.0×10⁻³ × 0.004²
           = 1.314×10⁻⁵ + 8.712×10⁻⁶ + 4.8×10⁻⁸
           = **2.190×10⁻⁵ kg·m²**

ω₀ = 750 rad/s (standard BX launch)
L₀ = I × ω₀ = 2.190×10⁻⁵ × 750 = **1.643×10⁻² kg·m²/s**

---

### 1. X-Line Rail — Centripetal Acceleration Channel

Beyblade X stadiums feature X-Line rails: raised curved channels that redirect a bey's orbital path and simultaneously accelerate it via the rail wall reaction force. Each X-Line pass applies an impulsive centripetal acceleration:

```
a_rail = v² / r_rail   (r_rail = 0.080 m, stadium wall radius)

At v₀ = 1.0 m/s (entry):  a₀ = 1.0² / 0.080 = 12.5 m/s²  (short burst, Δt = 0.28 s)
Δv per pass = a₀ × Δt = 12.5 × 0.28 = 3.5 m/s  (x-line adds kinetic energy via wall press)
```

Actual energy source: bey spin is converted to translational velocity through the Xceed driver contact as the rail wall redirects the momentum vector.

| Rail pass | Entry v (m/s) | Δv (m/s) | Exit v (m/s) |
|-----------|--------------|----------|--------------|
| Pass 1 | 1.000 | +0.546 | 1.546 |
| Pass 2 | 1.546 | +0.454 | 2.000 |
| Pass 3 (Super Strike) | 2.000 | — | **attack v** |

```
v_attack = 2.000 m/s  (after 2 rail passes, 3rd pass releases the strike)
```

Spin drain per rail pass (energy balance):
```
ΔKE_trans = ½ × m × Δv_pass² ≈ ½ × 0.0356 × 0.5² = 4.45×10⁻³ J
Δω_drain  = ΔKE_trans / (½ × I) = 4.45×10⁻³ / (½ × 2.190×10⁻⁵) = 406.4 rad/s  total  → ~20 rad/s per partial pass
```

---

### 2. Xceed Driver — Spin-to-Speed Conversion

The Xceed driver runs a flat-rubber contact patch (r_bit = 4 mm, μ = 0.55). In standard running it maintains orbital velocity at v = 0.55 × ω × r_bit = 0.55 × 750 × 0.004 = 1.65 m/s. At Super Strike release the driver maximises contact-patch grip and channels peak spin directly to translational impact:

```
τ_Xceed = μ × m × g × r_bit = 0.55 × 0.0356 × 9.81 × 0.004 = 7.685×10⁻⁴ N·m
t_spin  = L₀ / τ_Xceed = 1.643×10⁻² / 7.685×10⁻⁴ = 21.4 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.6 g |
| I_total | 2.190×10⁻⁵ kg·m² |
| ω₀ | 750 rad/s |
| L₀ | 1.643×10⁻² kg·m²/s |
| v_attack (post rail) | 2.000 m/s |
| τ_Xceed | 7.685×10⁻⁴ N·m |
| t_spin | 21.4 s |

---

## Case 1828 — SPECIAL: Super Strike — Hyuga Hizashi / Super Hyperion Xceed 1A

**Blader:** Hyuga Hizashi | **Beyblade:** Super Hyperion Xceed 1A | **Type:** attack

### Description

Super Strike is the signature special move of Hyuga Hizashi and Super Hyperion Xceed 1A. Super Hyperion builds up speed by riding the X-Line rails across two passes, converting spin to translational velocity. On the third pass it leaves the rail at maximum speed, channels all accumulated kinetic energy through the Super Ring's blade, and delivers a massive direct strike. The Xceed driver reaches its maximum orbital speed just before the blade contacts the opponent, concentrating the energy into a focused high-pressure slice.

### Stage 1 — X-Line Acceleration (from Case 1827)

Two rail passes: v_attack = **2.000 m/s** (spin-to-translational conversion via Xceed driver).

### Stage 2 — Super Ring Blade Strike

**Collision model (high-speed blade strike, e = 0.80):**

Parameters:
- m_H = 35.6 g, v_attack = 2.000 m/s
- m_opp = 40 g (representative), v_opp ≈ 0

```
m_eff = (0.0356 × 0.040) / (0.0356 + 0.040) = 1.424×10⁻³ / 0.0756 = 1.884×10⁻² kg

J_strike = m_eff × (1 + e) × v_attack
         = 1.884×10⁻² × 1.80 × 2.000
         = 6.782×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_strike / m_opp = 6.782×10⁻² / 0.040 = 1.696 m/s
```

**Effect on Super Hyperion (spin drain):**
```
Δω_H     = J_strike × r_contact / I_H = 6.782×10⁻² × 0.022 / 2.190×10⁻⁵ = 68.1 rad/s
ω_remain = 750 − 68.1 = 681.9 rad/s  (90.9% retained)
```

---

**[M] BeySpirit amplification:**
Hyuga channels the Xceed spirit, driving the Super Ring beyond structural limits in a singular blade surge.

[M] factor = **6.0 ×**
[M] Δv = 1.696 × 6.0 = **10.2 m/s** (ring-out)

> **Note:** Physical values describe X-Line rail centripetal acceleration and Xceed driver spin-to-speed conversion. [M] values represent BeySpirit-overridden blade-force concentration that exceeds normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function superStrikeSpecial(bey: Beyblade, target: Beyblade): void {
  // X-Line rail acceleration: 2 passes → v_attack = 2.0 m/s
  // Physical J_strike = 6.782×10⁻² N·s; [M] 6.0×
  const J_phys = 0.06782;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Xceed (X or Xceed+) Bit on a Beyblade X Blade equipped with a high-contact-area Super Ring or equivalent attack-profile blade. The X-Line rail acceleration mechanic is a stadium feature (BX Arena) present in all Beyblade X matches. Standard game instance: Super Hyperion Xceed 1A (Hyuga Hizashi, Beyblade X). Without the Xceed driver the spin-to-speed conversion is absent; without the X-Line rail the acceleration phase does not occur.

---

## Case 1829 — COMBO: X-Rail Rush — Super Hyperion

**Sequence:** → → ↑ (moveRight · moveRight · moveUp)
**Cost:** 15 | **Type:** attack | **Blader:** Hyuga Hizashi

### Physics Justification

Two rapid rightward steps (→ →) reproduce a single abbreviated X-Line rail sweep, imparting a partial speed boost of ~0.5 m/s from one centripetal rail pass (Δv ≈ ½ of full pass, partial grip). The upward arc (↑) elevates the approach vector onto the rail's curved exit ramp, redirecting the linear boost into an upward-angled strike. The partial rail contact reconverts 10% of the Δv back to spin at the contact point:

```
Δω = η × m_H × Δv_partial × r_contact / I_H
   = 0.70 × 0.0356 × 0.50 × 0.022 / 2.190×10⁻⁵
   = 0.70 × 17.9
   = +12.5 rad/s  ≈ +13 rad/s
```

(η = 0.70: partial X-Line contact efficiency.) The elevated ramp exit angle θ ≈ 8° boosts normal impulse by 1/cos(8°) ≈ 1.010, giving damageMultiplier **1.25×**.

**Parameters:**
- spinGain: +13 rad/s (partial X-Line rail pass; one-side contact η = 0.70)
- damageMultiplier: 1.25 (elevated ramp exit vector)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function xRailRushCombo(bey: Beyblade, target: Beyblade): void {
  // Partial X-Line pass → partial spin boost: Δω ≈ +13 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 13);
  // Elevated ramp exit: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +13 rad/s (partial) | ✓ |

---

## Case 1830 — GIMMICK: Tempest Wyvron 4Glaive Atomic — Atomic Tip Wall-Bounce Drive

**Beyblade:** Tempest Wyvron 4Glaive Atomic (TT JP: テンペストワイバーン4グレイブアトミック; Hasbro EN: Tempest Wyvron 4Glaive Atomic)
**Blader:** Wakiya Murasaki | **Series:** Beyblade Burst GT (God/B-126)
**Reference:** Cases 1800–1802 (Shield Crash — base Tempest Wyvron assembly)

### Assembly (from Cases 1800–1802)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Tempest Wyvron | 14.5 | 30.0 |
| Forge Disc | 4 | 21.0 | 28.0 |
| Disc Frame | Glaive | 2.2 | 32.0 |
| Performance Tip | Atomic | 2.35 | 4.0 |
| **Total** | | **40.05** | |

**I_total = 1.531×10⁻⁵ kg·m²** (Cases 1800–1802)
ω₀ = 650 rad/s (standard Burst God launch)
L₀ = I × ω₀ = 1.531×10⁻⁵ × 650 = **9.952×10⁻³ kg·m²/s**

---

### Atomic Tip — Low-Friction Bearing Wall-Ride

The Atomic tip features a free-spinning ball-bearing contact sphere (r_Atomic = 4 mm, μ = 0.04 — very low friction). This allows Wyvron to ride the stadium wall at high speed without spin loss, then use the elastic rebound to redirect orbital velocity into an attack vector.

**Running friction (bearing):**

```
τ_Atomic = μ × m × g × r_Atomic = 0.04 × 0.04005 × 9.81 × 0.004 = 6.290×10⁻⁵ N·m
t_spin   = L₀ / τ_Atomic = 9.952×10⁻³ / 6.290×10⁻⁵ = 158.2 s
```

**Wall-ride orbital velocity (steady state):**

```
v_wall = ω₀ × r_Atomic × (1 − μ) = 650 × 0.004 × 0.96 = 2.496 m/s
```

(Low bearing friction allows near-full spin conversion to translational speed at wall contact.)

**Elastic wall bounce (Super Tempest Attack):**

Wyvron rides the stadium rim to build maximum orbital speed, then the stadium wall redirects the velocity vector. Elastic restitution of ABS wall:
```
e_wall = 0.78  (Beyblade Burst Atomic-type bey on ABS stadium wall — well-documented)
v_post_bounce = e_wall × v_wall = 0.78 × 2.496 = 1.947 m/s  (inward attack vector)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 40.05 g |
| I_total | 1.531×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 9.952×10⁻³ kg·m²/s |
| μ_Atomic | 0.04 |
| τ_Atomic | 6.290×10⁻⁵ N·m |
| t_spin | 158.2 s |
| v_wall | 2.496 m/s |
| e_wall | 0.78 |
| v_post_bounce | 1.947 m/s |

---

## Case 1831 — SPECIAL: Super Tempest Attack — Wakiya Murasaki / Tempest Wyvron 4Glaive Atomic

**Blader:** Wakiya Murasaki | **Beyblade:** Tempest Wyvron 4Glaive Atomic | **Type:** attack

### Description

Super Tempest Attack is Wakiya Murasaki's signature special move with Tempest Wyvron 4Glaive Atomic. Wyvron rides the outer edge of the Beystadium to build maximum orbital speed using the Atomic tip's near-frictionless bearing. At the optimal moment, Wyvron bounces off the stadium wall — the elastic rebound redirects its full orbital velocity directly inward at the opponent. The Glaive Disc Frame's angular blades focus the impact into a concentrated strike.

### Stage 1 — Wall-Ride Acceleration (from Case 1830)

Atomic tip bearing drive: v_wall = 2.496 m/s. Wall bounce: e = 0.78 → v_post_bounce = **1.947 m/s** (inward).

### Stage 2 — Glaive Disc Frame Strike

**Collision model (wall-bounce redirect, e = 0.75):**

Parameters:
- m_W = 40.05 g, v_attack = 1.947 m/s
- m_opp = 40 g (representative), v_opp ≈ 0

```
m_eff = (0.04005 × 0.040) / (0.04005 + 0.040) = 1.602×10⁻³ / 0.08005 = 2.001×10⁻² kg

J_tempest = m_eff × (1 + e) × v_attack
          = 2.001×10⁻² × 1.75 × 1.947
          = 6.816×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_tempest / m_opp = 6.816×10⁻² / 0.040 = 1.704 m/s
```

**Effect on Tempest Wyvron (spin drain):**
```
Δω_W     = J_tempest × r_contact / I_W = 6.816×10⁻² × 0.024 / 1.531×10⁻⁵ = 106.8 rad/s
ω_remain = 650 − 106.8 = 543.2 rad/s  (83.6% retained)
```

---

**[M] BeySpirit amplification:**
Wakiya channels Wyvron's full tempest fury, the wall-bounce momentum becoming a storm-force gale strike.

[M] factor = **5.5 ×**
[M] Δv = 1.704 × 5.5 = **9.4 m/s** (ring-out)

> **Note:** Physical values describe Atomic bearing wall-ride and elastic wall-bounce attack mechanics. [M] values represent BeySpirit-overridden tempest-force impact that exceeds normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function superTempestAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Wall-ride via Atomic bearing: v_wall = 2.496 m/s → bounce v = 1.947 m/s
  // Physical J_tempest = 6.816×10⁻² N·s; [M] 5.5×
  const J_phys = 0.06816;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.5; // [M] BeySpirit 5.5×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Atomic Performance Tip (or equivalent near-frictionless bearing tip) on a Forge Disc + Frame assembly with sufficient mass for wall-ride momentum. The stadium wall bounce mechanic requires the ABS Beyblade Burst Beystadium wall geometry. Standard game instance: Tempest Wyvron 4Glaive Atomic (Wakiya Murasaki, Beyblade Burst GT). Without the Atomic tip the near-zero friction wall-ride is absent; without the Glaive Frame the angular impact focus is reduced.

---

## Case 1832 — COMBO: Glaive Bounce — Tempest Wyvron

**Sequence:** → K ↑ (moveRight · defense · moveUp)
**Cost:** 15 | **Type:** balanced | **Blader:** Wakiya Murasaki

### Physics Justification

The rightward sweep (→) positions Wyvron at the stadium rim on the Atomic bearing. The defense stance (K) represents a brief wall-press — Wyvron presses into the wall at low speed and absorbs a small elastic rebound impulse, converting wall-contact force back to spin via the bearing:

```
v_press = 0.5 m/s  (half-speed wall approach)
J_press = m_W × (1 + e_wall) × v_press = 0.04005 × 1.78 × 0.5 = 3.564×10⁻² N·s

Δω_recover = J_press × r_Atomic / I_W = 3.564×10⁻² × 0.004 / 1.531×10⁻⁵ = +9.3 rad/s  ≈ +9 rad/s
```

The upward exit angle (↑) from the wall bounce elevates the strike vector by θ = 9°, boosting normal impulse by 1/cos(9°) ≈ 1.012 → damageMultiplier **1.20×**. The lockMs = 150 represents the wall-contact dwell time before the bounce releases.

**Parameters:**
- spinGain: +9 rad/s (Atomic bearing wall-press elastic recovery η ≈ 1.0)
- damageMultiplier: 1.20 (elevated wall-bounce exit vector)
- lockMs: 150 (wall dwell before bounce release)

### TypeScript

```typescript
function glaiveBounceCombo(bey: Beyblade, target: Beyblade): void {
  // Atomic bearing wall-press: elastic recovery Δω ≈ +9 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 9);
  // Elevated wall-bounce exit: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 150: wall dwell before bounce
  bey.lockMs = 150;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +9 rad/s (partial) | ✓ |



---

## Case 1833 — GIMMICK: Heat Salamander 12 Operate — Operate Tip Defense Mode & Ten-Blade Vortex

**Beyblade:** Heat Salamander 12 Operate (TT JP: ヒートサラマンダー12オペレート; Hasbro EN: Hell Salamander 12 Operate)
**Blader:** Suoh Genji | **Series:** Beyblade: Metal Fury (BB-106)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Heat/Hell | 34.0 | 30.0 |
| Energy Ring | Salamander | 4.5 | 24.0 |
| Spin Track | 12 | 3.5 | 12.0 |
| Performance Tip | Operate | 2.0 | 5.0 |
| **Total** | | **44.0** | |

**I_total** = 34.0×10⁻³ × 0.030² + 4.5×10⁻³ × 0.024² + 3.5×10⁻³ × 0.012² + 2.0×10⁻³ × 0.005²
           = 3.060×10⁻⁵ + 2.592×10⁻⁶ + 5.04×10⁻⁷ + 5.0×10⁻⁸
           = **3.370×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Fury defense launch)
L₀ = I × ω₀ = 3.370×10⁻⁵ × 650 = **2.191×10⁻² kg·m²/s**

---

### 1. Operate Tip — Defense Mode Gyroscopic Stability

The Operate tip runs in two modes. In Attack mode the tip extends to a wide flat contact patch (r_OP_atk = 10 mm, μ = 0.50). In Defense mode the tip retracts to a narrow ball-bearing core (r_OP_def = 3 mm, μ = 0.08), dramatically reducing floor friction and maximising gyroscopic rigidity.

**Defense mode friction:**

```
τ_OP_def = μ_def × m × g × r_OP_def = 0.08 × 0.044 × 9.81 × 0.003 = 1.037×10⁻⁴ N·m
t_spin_def = L₀ / τ_OP_def = 2.191×10⁻² / 1.037×10⁻⁴ = 211.3 s
```

**Precession (gyroscopic stability in defense mode):**

```
Ω_prec = m × g × h_CoM / L₀ = 0.044 × 9.81 × 0.015 / 2.191×10⁻² = 0.295 rad/s
```

(h_CoM = 15 mm above floor; Operate tip keeps CoM elevated in defense mode.)

---

### 2. Track 12 — Ten-Blade Centrifugal Vortex

Spin Track 12 carries 12 wing blades (approximating 10 active blades from Heat/Hell Fusion Wheel geometry). At ω₀ the blades generate a centrifugal updraft vortex:

**Blade tip velocity:**

```
v_blade = ω₀ × r_track = 650 × 0.012 = 7.800 m/s
```

**Aerodynamic updraft (Rankine vortex, annular track):**

```
Γ_track = 2π × v_blade × r_track = 2π × 7.800 × 0.012 = 0.5881 m²/s

Updraft velocity at r_inner = 5 mm (Operate tip centre):
v_updraft = Γ_track / (2π × r_inner) = 0.5881 / (2π × 0.005) = 18.72 m/s

F_updraft = ½ × ρ_air × C_L × A_disc × v_updraft²
          = ½ × 1.225 × 0.80 × (π × 0.012²) × 18.72²
          = ½ × 1.225 × 0.80 × 4.524×10⁻⁴ × 350.4
          = 7.742×10⁻² N  (upward, keeps bey centred)
```

**Flame heat aura (anime):** Heat/Hell Fusion Wheel generates a flaming vortex updraft; the ten-blade tornado simultaneously boosts Attack and Defense by creating an impenetrable rotating fire column.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 44.0 g |
| I_total | 3.370×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 2.191×10⁻² kg·m²/s |
| τ_OP (defense) | 1.037×10⁻⁴ N·m |
| t_spin (defense) | 211.3 s |
| Ω_prec | 0.295 rad/s |
| v_blade | 7.800 m/s |
| Γ_track | 0.5881 m²/s |
| F_updraft | 7.742×10⁻² N |

---

## Case 1834 — SPECIAL: Swirling Inferno — Suoh Genji / Heat Salamander 12 Operate

**Blader:** Suoh Genji | **Beyblade:** Heat Salamander 12 Operate | **Type:** balanced (attack + defense)

### Description

Swirling Inferno is Suoh Genji's signature special move with Heat Salamander 12 Operate. Using the Operate tip's defense-mode bearing stance and the centrifugal force of Track 12's ten blades, Salamander generates a flaming tornado updraft. The rotating fire column simultaneously magnifies Salamander's attack force and hardens its defense shell, creating an arena-wide storm that overwhelms opponents both physically and through thermal/wind pressure. The dual buffing nature makes it Salamander's most versatile and threatening move.

### Stage 1 — Ten-Blade Tornado Generation (from Case 1833)

Track 12 vortex: Γ = 0.5881 m²/s, F_updraft = **7.742×10⁻² N** (maintains bey stability and creates updraft column).

### Stage 2 — Dual Attack/Defense Burst

**Tornado outer-ring impact on opponent:**

At r_opponent = 40 mm from Salamander centre:
```
v_tornado_opp = Γ_track / (2π × r_opp) = 0.5881 / (2π × 0.040) = 2.341 m/s

F_tornado_opp = ½ × ρ_air × C_D × A_opp × v_tornado_opp²
              = ½ × 1.225 × 1.0 × (π × 0.020²) × 2.341²
              = ½ × 1.225 × 1.257×10⁻³ × 5.480
              = 4.220×10⁻³ N  (aerodynamic tangential force on opponent)
```

**Direct strike (Salamander drives outward in defense mode, e = 0.65):**

```
v_strike = 0.80 m/s  (Operate defense mode: slow orbital, high stability)
m_eff    = (0.044 × 0.042) / (0.044 + 0.042) = 2.149×10⁻² kg

J_inferno = m_eff × (1 + e) × v_strike
          = 2.149×10⁻² × 1.65 × 0.80
          = 2.837×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_inferno / m_opp = 2.837×10⁻² / 0.042 = 0.675 m/s  (physical; defense mode low v)
```

**Self-buffs from Swirling Inferno:**
```
Attack buff:  damageMultiplier += 0.20  (fire column compresses attack profile)
Defense buff: damageReduction  -= 0.10  (updraft lifts bey, reduces contact surface area)
```

**Effect on Heat Salamander (spin drain — minimal in defense mode):**
```
Δω_sal   = J_inferno × r_contact / I_sal = 2.837×10⁻² × 0.022 / 3.370×10⁻⁵ = 18.5 rad/s
ω_remain = 650 − 18.5 = 631.5 rad/s  (97.2% retained)
```

---

**[M] BeySpirit amplification:**
Suoh channels Salamander's fire spirit, the vortex erupting into a full flaming inferno that simultaneously annihilates and armours.

[M] factor = **5.0 ×**
[M] Δv = 0.675 × 5.0 = **3.4 m/s** (physical hit) + sustained dual buff maintained for 2.0 s

> **Note:** Physical values describe Operate defense-mode bearing stance, Track 12 centrifugal vortex aerodynamics, and dual attack/defense buff mechanics. [M] values represent BeySpirit-overridden fire-tornado concentration beyond normal collision limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function swirlinfernoSpecial(bey: Beyblade, target: Beyblade): void {
  // Track 12 tornado: F_updraft = 0.0774 N (self-stability)
  // Attack buff: +0.20 damageMultiplier; Defense buff: damageReduction -0.10
  bey.damageMultiplier = Math.min(2.05, (bey.damageMultiplier ?? 1.0) + 0.20);
  bey.damageReduction  = Math.max(0, (bey.damageReduction  ?? 0) - 0.10);
  // Direct tornado strike: J_phys = 2.837×10⁻² N·s; [M] 5.0×
  const J_phys = 0.02837;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.0; // [M] BeySpirit 5.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  bey.buffDurationMs = 2000; // dual buff sustained 2.0 s
}
```

**Compatible beys:** Any beyblade using the Operate Performance Tip in Defense Mode with a Spin Track of radius ≥ 10 mm generating sufficient updraft vortex circulation. The ten-blade tornado requires a Fusion Wheel with a wide blade profile (Heat/Hell or equivalent). Standard game instance: Heat Salamander 12 Operate (Suoh Genji, Metal Fury). Without Operate defense mode the gyroscopic stability is absent; without Track 12 the vortex circulation is insufficient for dual buffing.

---

## Case 1835 — COMBO: Inferno Shell — Heat Salamander

**Sequence:** K ↓ K (defense · moveDown · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Suoh Genji

### Physics Justification

The double defense stance (K…K) represents Salamander entering and sustaining Operate defense mode — the tip retracts to bearing contact for two brief windows, each pulse reducing friction and boosting spin retention. The downward sweep (↓) between them represents the orbital repositioning in defense posture. Each K-pulse reconverts ~60% of the friction reduction into spin:

```
Δτ_saved = τ_OP_atk − τ_OP_def per pulse
τ_OP_atk = 0.50 × 0.044 × 9.81 × 0.010 = 2.158×10⁻³ N·m
τ_OP_def = 1.037×10⁻⁴ N·m

Δτ = 2.158×10⁻³ − 1.037×10⁻⁴ = 2.054×10⁻³ N·m  per pulse

Δω per pulse = η × Δτ × Δt / I = 0.60 × 2.054×10⁻³ × 0.100 / 3.370×10⁻⁵ = 3.66 rad/s
Total Δω (2 pulses) = +7.3 rad/s  ≈ +7 rad/s
```

(η = 0.60: partial tip retraction; Δt = 100 ms per K-stance dwell.) Defense mode also reduces incoming damage via damageMultiplier **1.15×** counter-force (hardened shell repels attacker).

**Parameters:**
- spinGain: +7 rad/s (dual Operate tip retraction pulse spin-retention)
- damageMultiplier: 1.15 (hardened inferno shell counter-force)
- lockMs: 200 (defense dwell window between K pulses)

### TypeScript

```typescript
function infernoShellCombo(bey: Beyblade, target: Beyblade): void {
  // Dual Operate defense-mode pulse: spin retention Δω ≈ +7 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 7);
  // Inferno shell counter-force: 1.15× repulsion
  bey.damageMultiplier = 1.15;
  // lockMs = 200: defense dwell between pulses
  bey.lockMs = 200;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.15, (dy / dist) * 0.15);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.15 | ✓ |
| lockMs | ≤ 300 | 200 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +7 rad/s (partial) | ✓ |

---

## Case 1836 — GIMMICK: Variares D:D — D:D Dual-Spin Tip & Left-Spin Mode

**Beyblade:** Variares D:D (TT JP: ヴァリアレスD:D; Hasbro EN: Variares D:D)
**Blader:** King | **Series:** Beyblade: Metal Fury (BB-122)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Variares | 36.0 | 31.0 |
| Energy Ring | Aries (left-spin variant) | 4.0 | 24.0 |
| Spin Track | D:D (Duo:Dual) | 4.5 | 8.0 |
| Performance Tip | D:D embedded | — | — |
| **Total** | | **44.5** | |

**I_total** = 36.0×10⁻³ × 0.031² + 4.0×10⁻³ × 0.024² + 4.5×10⁻³ × 0.008²
           = 3.456×10⁻⁵ + 2.304×10⁻⁶ + 2.88×10⁻⁷
           = **3.715×10⁻⁵ kg·m²**

ω₀ = 650 rad/s | Mode: Right-spin (normal); Left-spin mode (Sword of Ares)
L₀ = I × ω₀ = 3.715×10⁻⁵ × 650 = **2.415×10⁻² kg·m²/s**

---

### 1. D:D Tip — Dual-Spin Free-Spin Contact

The D:D track+tip assembly contains two concentric bearing shells. The outer shell spins in whatever direction the bey launches (right or left). The inner core is a free-spinning bearing that absorbs attack torque, preventing burst. At contact, the outer blade face presents either the right-spin leading edge (attack) or the left-spin leading edge (counter-mode).

**Contact dynamics:**

| Mode | Contact edge velocity | Attack profile |
|------|-----------------------|----------------|
| Right-spin | ω₀ × r_ER = 650 × 0.024 = 15.6 m/s | Standard smash |
| Left-spin (Sword of Ares) | ω₀ × r_FW = 650 × 0.031 = 20.15 m/s | Counter-rotation pierce |

**Counter-rotation relative velocity (vs right-spin opponent at ω_opp = 600 rad/s):**

```
v_rel = (ω₀ + ω_opp) × r_contact = (650 + 600) × 0.025 = 31.25 m/s  (additive, counter-spin)
```

---

### 2. Sword of Ares — Blade Pierce

Variares launches in left-spin attack mode. The Fusion Wheel's blade edge acts as a high-speed rotating sword, penetrating the opponent's defense with a counter-spin pierce. Contact pressure at the blade tip:

```
v_blade = ω₀ × r_FW = 650 × 0.031 = 20.15 m/s

F_centripetal_blade = m_FW × ω₀² × r_FW = 0.036 × 650² × 0.031 = 471.5 N

A_blade_tip = 1.0×10⁻⁶ m²  (1 mm² acute blade edge)
P_blade = F_centripetal_blade / A_blade_tip = 471.5 / 1.0×10⁻⁶ = 4.715×10⁸ Pa = 471.5 MPa
```

σ_ABS_yield ≈ 60 MPa → 471.5 / 60 = **7.86× yield** → **DEEP PIERCE** (blade cuts through opponent's armor layer)

**D:D bearing absorbs recoil:** free-spin inner bearing prevents spin drain on pierce contact (recoil decoupled from spin axis).

```
τ_DD = μ_bearing × m × g × r_DD = 0.02 × 0.0445 × 9.81 × 0.008 = 6.995×10⁻⁵ N·m
t_spin = L₀ / τ_DD = 2.415×10⁻² / 6.995×10⁻⁵ = 345.2 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 44.5 g |
| I_total | 3.715×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 2.415×10⁻² kg·m²/s |
| v_rel (counter-spin) | 31.25 m/s |
| v_blade | 20.15 m/s |
| F_centripetal | 471.5 N |
| P_blade | 471.5 MPa (7.86× yield) |
| τ_DD (bearing) | 6.995×10⁻⁵ N·m |
| t_spin | 345.2 s |

---

## Case 1837 — SPECIAL: Sword of Ares — King / Variares D:D

**Blader:** King | **Beyblade:** Variares D:D | **Type:** attack

### Description

The Sword of Ares is King's signature special move, channelling the power of the god of war. Variares switches to left-spin attack mode, transforming the Fusion Wheel into a rotating divine sword. The blade drives forward in counter-rotation against the opponent, penetrating their attack formation with a divine pierce that cuts through their special move energy and shatters their power. King first used this move to defeat Jigsaw, cutting through Burst Satellite and defeating Forbidden Eonis.

### Stage 1 — Counter-Rotation Pierce (from Case 1836)

v_blade = 20.15 m/s (left-spin), P_blade = 471.5 MPa (7.86× yield). D:D bearing decouples recoil from spin axis.

### Stage 2 — Divine Blade Strike

**Collision model (counter-rotation high-speed pierce, e = 0.70):**

Parameters:
- m_V = 44.5 g, v_rel = 31.25 m/s (counter-spin additive), effective v_attack = 3.5 m/s (translational component)
- m_opp = 42 g, v_opp ≈ 0

```
m_eff = (0.0445 × 0.042) / (0.0445 + 0.042) = 2.026×10⁻² kg

J_sword = m_eff × (1 + e) × v_attack
        = 2.026×10⁻² × 1.70 × 3.5
        = 1.205×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_sword / m_opp = 1.205×10⁻¹ / 0.042 = 2.869 m/s
```

**Defense pierce (D:D counter-rotation, 50% defense bypass):**
```
defensePierce = 0.50  (counter-spin blade penetrates half the opponent's defense layer)
```

**Effect on Variares (D:D bearing absorbs recoil — minimal spin drain):**
```
Δω_V     = J_sword × r_contact × (1 − bearing_absorb) / I_V
         = 1.205×10⁻¹ × 0.025 × 0.20 / 3.715×10⁻⁵  (bearing absorbs 80% of recoil)
         = 16.2 rad/s
ω_remain = 650 − 16.2 = 633.8 rad/s  (97.5% retained)
```

---

**[M] BeySpirit amplification:**
King channels Mars — the divine sword of the god of war shatters the opponent's power entirely.

[M] factor = **7.0 ×**
[M] Δv = 2.869 × 7.0 = **20.1 m/s** (absolute ring-out; opponent's special shattered)

> **Note:** Physical values describe D:D counter-rotation blade pierce and bearing-decoupled recoil mechanics. [M] values represent divine BeySpirit of Ares — a god-force that shatters opponent specials and exceeds all normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function swordOfAresSpecial(bey: Beyblade, target: Beyblade): void {
  // Counter-spin blade pierce: v_blade = 20.15 m/s, defensePierce = 0.50
  // Physical J_sword = 0.1205 N·s; [M] 7.0×
  const J_phys = 0.1205;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (god of war)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  const defensePierce = 0.50;
  target.defenseBuff = target.defenseBuff * (1 - defensePierce);
}
```

**Compatible beys:** Any beyblade using the D:D (Duo:Dual) Spin Track with a free-spin bearing core that supports left-spin mode operation. The counter-rotation pierce requires a Fusion Wheel with a high-mass acute blade edge (Variares or equivalent). Standard game instance: Variares D:D (King, Metal Fury). Without D:D the free-spin bearing recoil decoupling is absent; without left-spin mode the counter-rotation relative velocity advantage is absent.

---

## Case 1838 — COMBO: Ares Counter — Variares

**Sequence:** A K → (attack · defense · moveRight)
**Cost:** 25 | **Type:** balanced | **Blader:** King

### Physics Justification

The attack (A) initiates Variares' blade-contact in right-spin mode, generating recoil. The defense stance (K) engages the D:D bearing, which absorbs and stores the recoil impulse in the free-spin inner shell. The rightward sweep (→) releases the stored bearing rotational energy as a re-directed counter-strike — the bearing re-couples to the outer shell during the sweep, discharging the stored angular momentum as a lateral impulse:

```
J_stored = m_V × v_recoil × (1 − bearing_absorb_ratio)
         = 0.0445 × 0.5 × 0.80 = 1.780×10⁻² N·s  (stored in bearing)

Δω_release = J_stored × r_contact / I_V = 1.780×10⁻² × 0.025 / 3.715×10⁻⁵ = +11.97 rad/s ≈ +12 rad/s
```

(bearing_absorb_ratio = 0.80; D:D stores 80% of recoil impulse in free-spin shell, releases on direction change.) The lateral counter-strike has a damageMultiplier **1.30×** from the bearing-amplified re-coupling force.

**Parameters:**
- spinGain: +12 rad/s (D:D bearing stored-recoil release on direction change)
- damageMultiplier: 1.30 (bearing re-coupling amplified counter-strike)
- lockMs: 0 (no lock — immediate re-direction)

### TypeScript

```typescript
function aresCounterCombo(bey: Beyblade, target: Beyblade): void {
  // D:D bearing stored-recoil release: Δω ≈ +12 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Bearing re-coupling amplified counter-strike: 1.30×
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |

---

## Case 1839 — GIMMICK: Storm Capricorn M145Q — Q Tip Aerial Bounce & M145 Gyro Platform

**Beyblade:** Storm Capricorn M145Q (TT JP: ストームカプリコーンM145Q; Hasbro EN: Storm Capricorn M145Q)
**Blader:** Tobio Oike | **Series:** Beyblade: Metal Fight Beyblade (Metal Fusion / BB-48)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Storm | 28.0 | 28.0 |
| Energy Ring | Capricorn | 3.8 | 23.0 |
| Spin Track | M145 (Magnetic) | 2.5 | 10.0 |
| Performance Tip | Q (Quake) | 1.2 | 3.5 |
| **Total** | | **35.5** | |

**I_total** = 28.0×10⁻³ × 0.028² + 3.8×10⁻³ × 0.023² + 2.5×10⁻³ × 0.010² + 1.2×10⁻³ × 0.0035²
           = 2.195×10⁻⁵ + 2.009×10⁻⁶ + 2.5×10⁻⁷ + 1.47×10⁻⁸
           = **2.421×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Fusion launch)
L₀ = I × ω₀ = 2.421×10⁻⁵ × 650 = **1.574×10⁻² kg·m²/s**

---

### 1. Q Tip — Quake Bounce Kinematics

The Quake tip features a hard plastic sphere with a shallow convex dome contact surface (r_Q = 3.5 mm). The dome shape causes erratic directional deflection on contact — the bey launches unpredictably at any angle. For Spin Screwdriver the Q tip provides the aerial launch impulse:

**Q tip bounce (Spin Screwdriver ascent):**

```
Normal force at arena floor contact: F_N = m × ω² × r_Q = 0.0355 × 650² × 0.0035 = 52.5 N
Vertical impulse (spherical dome deflection): J_vertical = F_N × Δt_contact = 52.5 × 0.003 = 0.158 N·s
v_vertical = J_vertical / m = 0.158 / 0.0355 = 4.44 m/s  (launch velocity, upward)
```

**Aerial height:**

```
h_apex = v_vertical² / (2g) = 4.44² / (2 × 9.81) = 1.005 m  (≈ 1 m above arena floor)
```

---

### 2. M145 Track — Gyroscopic Platform

Magnetic Spin Track 145 is a slightly elevated track (h = 14.5 mm) with magnetic inserts that stabilise the gyroscopic axis during the aerial phase, preventing nutation wobble at apex:

```
Ω_prec = m × g × h_CoM / L₀ = 0.0355 × 9.81 × 0.020 / 1.574×10⁻² = 0.443 rad/s
```

Magnetic stabilisation at apex suppresses nutation: Δω_nutation = 0 (Q tip not in contact at apex — gyroscopic axis is conserved).

**Horn whip (anime):** Capricorn's horn rotates at ω₀, generating a pale-red tornado vortex that forms at the apex before the dive, as described in the source material.

```
v_horn_tip = ω₀ × r_ER = 650 × 0.023 = 14.95 m/s
```

**Q tip friction (floor contact, arena bottom):**

```
τ_Q = μ × m × g × r_Q = 0.35 × 0.0355 × 9.81 × 0.0035 = 4.268×10⁻⁴ N·m
t_spin = L₀ / τ_Q = 1.574×10⁻² / 4.268×10⁻⁴ = 36.9 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.5 g |
| I_total | 2.421×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.574×10⁻² kg·m²/s |
| v_vertical (Q bounce) | 4.44 m/s |
| h_apex | 1.005 m |
| Ω_prec | 0.443 rad/s |
| v_horn_tip | 14.95 m/s |
| τ_Q | 4.268×10⁻⁴ N·m |
| t_spin | 36.9 s |

---

## Case 1840 — SPECIAL: Spin Screwdriver — Tobio Oike / Storm Capricorn M145Q

**Blader:** Tobio Oike | **Beyblade:** Storm Capricorn M145Q | **Type:** attack

### Description

Spin Screwdriver is Tobio Oike's signature special move with Storm Capricorn M145Q. Capricorn leaps into the air via the Q tip's erratic bounce, reaching apex height near 1 m. At apex, Capricorn whips its horn while descending, generating a pale-red tornado vortex that starts from the horn rotation. Capricorn then dives straight down and smashes onto the opponent with a screwdriver-style rotation-to-impact transfer. Benkei noted that the only predictable moment is when this move is used — the erratic Q tip makes all other motion unknowable. The move was never successful when executed due to the equally unpredictable Q tip landing point.

### Stage 1 — Q Tip Aerial Launch (from Case 1839)

Q dome bounce: v_vertical = 4.44 m/s, h_apex = 1.005 m.

### Stage 2 — Aerial Dive Impact

**Ballistic dive velocity:**

```
v_impact = √(v_vertical² + 2g × h_apex)
         = √(4.44² + 2 × 9.81 × 1.005)
         = √(19.71 + 19.72)
         = √39.43
         = 6.279 m/s  (vertical dive velocity)
```

**Collision model (screwdriver dive, e = 0.75):**

Parameters:
- m_C = 35.5 g, v_impact = 6.279 m/s
- m_opp = 40 g, v_opp ≈ 0

```
m_eff = (0.0355 × 0.040) / (0.0355 + 0.040) = 1.876×10⁻² kg

J_screw = m_eff × (1 + e) × v_impact
        = 1.876×10⁻² × 1.75 × 6.279
        = 2.061×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_screw / m_opp = 2.061×10⁻¹ / 0.040 = 5.153 m/s
```

**Effect on Storm Capricorn (spin drain):**
```
Δω_C     = J_screw × r_contact / I_C = 2.061×10⁻¹ × 0.022 / 2.421×10⁻⁵ = 187.2 rad/s
ω_remain = 650 − 187.2 = 462.8 rad/s  (71.2% retained)
```

---

**[M] BeySpirit amplification:**
Tobio channels Capricorn's horn-vortex, the screwdriver dive becoming a piercing storm column that strikes with irresistible force — despite never hitting in the anime, the physics at full BeySpirit would be devastating.

[M] factor = **5.0 ×**
[M] Δv = 5.153 × 5.0 = **25.8 m/s** (theoretical ring-out; never achieved in-series)

> **Note:** Physical values describe Q tip aerial launch mechanics and ballistic screwdriver dive. [M] values represent full BeySpirit realisation of a move that remained unachieved in the anime. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spinScrewdriverSpecial(bey: Beyblade, target: Beyblade): void {
  // Q tip aerial bounce: h_apex = 1.005 m; dive v_impact = 6.279 m/s
  // Physical J_screw = 0.2061 N·s; [M] 5.0×
  const J_phys = 0.2061;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.0; // [M] BeySpirit 5.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Q (Quake) Performance Tip with a Spin Track height ≥ 130 (for sufficient Q-dome bounce clearance) and a Fusion Wheel providing enough mass for aerial momentum. Standard game instance: Storm Capricorn M145Q (Tobio Oike, Metal Fusion). Without the Q tip the erratic aerial bounce is absent; without the M145 magnetic gyro platform the axis stabilisation at apex is absent and the dive trajectory is unguided.

---

## Case 1841 — COMBO: Horn Whip — Storm Capricorn

**Sequence:** J ↑ K (jump · moveUp · defense)
**Cost:** 15 | **Type:** attack | **Blader:** Tobio Oike

### Physics Justification

The jump (J) initiates a partial Q tip bounce — a low-amplitude launch that rises ~15 cm (Δh = 0.15 m) rather than the full 1 m apex. The upward arc (↑) carries Capricorn along a rising orbital path. The defense stance (K) at apex represents the horn-whip moment — Capricorn arrests its upward motion and converts the kinetic energy of the rising arc into a sideward horn-rotation strike rather than a full dive. The partial aerial path reconverts 30% of the arc's kinetic energy back to spin on re-ground:

```
v_arc = Q tip partial launch: J_partial/m = (0.158 × 0.15/1.005) / 0.0355 = 0.664 m/s
Δω = η × m × v_arc × r_contact / I = 0.75 × 0.0355 × 0.664 × 0.022 / 2.421×10⁻⁵
   = 0.75 × 21.33
   = +16.0 rad/s  ≈ +16 rad/s
```

(η = 0.75: partial Q contact on re-ground; 30% arc-to-spin reconversion.) Horn-whip strike at apex delivers damageMultiplier **1.25×** from the tangential horn velocity.

**Parameters:**
- spinGain: +16 rad/s (partial Q bounce arc-to-spin reconversion η = 0.75)
- damageMultiplier: 1.25 (horn-whip tangential strike at apex)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function hornWhipCombo(bey: Beyblade, target: Beyblade): void {
  // Partial Q bounce arc-to-spin reconversion: Δω ≈ +16 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 16);
  // Horn-whip apex strike: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +16 rad/s (partial) | ✓ |



---

## Case 1842 — GIMMICK: Bandit Genbu F230TB — F230 Under-Attack Platform & TB Tip Dual Drive

**Beyblade:** Bandit Genbu F230TB (TT JP: バンディットゲンブF230TB; Hasbro EN: Bandit Genbu F230TB)
**Blader:** Genjuro Kamegaki | **Series:** Beyblade: Metal Fury (BB-108)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Bandit | 26.0 | 29.0 |
| Energy Ring | Genbu | 4.5 | 24.0 |
| Spin Track | F230 (Fusion 230) | 6.0 | 15.0 |
| Performance Tip | TB (Tip Ball) | 2.5 | 4.0 |
| **Total** | | **39.0** | |

**I_total** = 26.0×10⁻³ × 0.029² + 4.5×10⁻³ × 0.024² + 6.0×10⁻³ × 0.015² + 2.5×10⁻³ × 0.004²
           = 2.186×10⁻⁵ + 2.592×10⁻⁶ + 1.350×10⁻⁶ + 4.0×10⁻⁸
           = **2.590×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Fury launch)
L₀ = I × ω₀ = 2.590×10⁻⁵ × 650 = **1.684×10⁻² kg·m²/s**

---

### 1. F230 Track — Under-Attack Geometry

Spin Track F230 is one of the tallest tracks at 23.0 mm. The Fusion Wheel sits at height h_FW = 23.0 mm above the arena floor, while many opponents' Fusion Wheels sit at h_opp = 7–12 mm. This height differential places Bandit Genbu's attack surface above the opponent's primary attack ring, allowing the Bandit wheel to strike downward onto the opponent's track or spin track.

**Height differential at standard contact (h_FW − h_opp_avg = 23.0 − 10.0 = 13.0 mm):**

```
θ_down = arctan(13.0 / 24.0) = 28.4°  (downward attack angle onto opponent track)

F_down_component = F_collision × sin(28.4°) = F × 0.476  (downward component presses opponent into floor)
```

The downward force component magnifies contact friction on the opponent, stripping traction and forcing the opponent upward and outward from the stadium.

**F230 structural inertia contribution:**

```
I_F230 = 6.0×10⁻³ × 0.015² = 1.350×10⁻⁶ kg·m²  (tall track acts as additional gyroscopic mass at 15 mm)
```

---

### 2. TB Tip — Tip Ball Dual-Mode Drive

The Tip Ball tip features a hard plastic ball (r_TB = 4 mm) with an internal flat-topped cylinder core. On smooth surfaces it runs on the ball for low friction; on rough or angled surfaces the cylinder rim contacts, providing higher friction orbital drive.

**Ball contact (normal running):**

```
μ_TB_ball = 0.25  (hard plastic sphere on ABS)
τ_ball    = μ × m × g × r_TB = 0.25 × 0.039 × 9.81 × 0.004 = 3.836×10⁻⁴ N·m
t_spin    = L₀ / τ_ball = 1.684×10⁻² / 3.836×10⁻⁴ = 43.9 s
```

**Cylinder contact (Spinning Shell Smash launch — Genjuro's stomp triggers tip-over):**

At the special move trigger, Genjuro's BeySpirit causes the ball to tip over onto the cylinder rim (r_cyl = 4 mm, μ_cyl = 0.55), generating maximum drive:

```
v_orbital_TB = μ_cyl × ω₀ × r_cyl = 0.55 × 650 × 0.004 = 1.430 m/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 39.0 g |
| I_total | 2.590×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.684×10⁻² kg·m²/s |
| h_F230 | 23.0 mm |
| θ_down | 28.4° |
| F_down ratio | 0.476 |
| I_F230 | 1.350×10⁻⁶ kg·m² |
| τ_ball | 3.836×10⁻⁴ N·m |
| t_spin (ball) | 43.9 s |
| v_orbital_TB (cylinder) | 1.430 m/s |

---

## Case 1843 — SPECIAL: Spinning Shell Smash — Genjuro Kamegaki / Bandit Genbu F230TB

**Blader:** Genjuro Kamegaki | **Beyblade:** Bandit Genbu F230TB | **Type:** attack

### Description

Spinning Shell Smash is Genjuro Kamegaki's signature special move with Bandit Genbu F230TB. Genjuro glows with a golden aura and crosses his arms with two fingers out, then raises and slams his right hand down like a hammer, sending rocks flying from the impact. Bandit Genbu blasts an indigo ray from the Stone Face, releasing Genbu the black tortoise. The beast slams its axe-like hammer onto the ground, sending up a burst of smoke. Bandit Genbu then leaps out of the smoke and smashes directly into the opponent, using the F230 track's height advantage to strike downward at full orbital velocity. The downward angle drives the opponent into the floor and rockets them in recoil. Genjuro first used this move to defeat Ren Kurenai during Neo Battle Bladers.

### Stage 1 — TB Cylinder Drive Launch (from Case 1842)

TB tip tips to cylinder contact: v_orbital_TB = **1.430 m/s**. F230 height geometry: θ_down = **28.4°** (downward attack).

### Stage 2 — Under-Attack Hammer Strike

**Aerial smoke-burst leap (Genbu beast stomp — pre-impact elevation):**

```
Δh_leap = 0.040 m  (40 mm — Bandit FW lifts to peak height above stadium smoke burst)
v_impact = √(v_orbital_TB² + 2g × Δh_leap)
         = √(1.430² + 2 × 9.81 × 0.040)
         = √(2.045 + 0.785)
         = √2.830
         = 1.682 m/s
```

**Collision model (downward F230 hammer strike, e = 0.70):**

Parameters:
- m_G = 39.0 g, v_impact = 1.682 m/s
- m_opp = 40 g, v_opp ≈ 0

```
m_eff = (0.039 × 0.040) / (0.039 + 0.040) = 1.974×10⁻² kg

J_smash = m_eff × (1 + e) × v_impact
        = 1.974×10⁻² × 1.70 × 1.682
        = 5.645×10⁻² N·s
```

**Effect on opponent (horizontal component):**
```
Δv_opp_horiz = (J_smash × cos(28.4°)) / m_opp = (5.645×10⁻² × 0.879) / 0.040 = 1.241 m/s  (outward rocket)
```

**Effect on opponent (downward component):**
```
Δv_opp_down  = (J_smash × sin(28.4°)) / m_opp = (5.645×10⁻² × 0.476) / 0.040 = 0.672 m/s  (floor press)
```
→ "rockets in recoil" + floor friction strip

**Effect on Bandit Genbu (spin drain):**
```
Δω_G     = J_smash × r_contact / I_G = 5.645×10⁻² × 0.022 / 2.590×10⁻⁵ = 47.9 rad/s
ω_remain = 650 − 47.9 = 602.1 rad/s  (92.6% retained)
```

---

**[M] BeySpirit amplification:**
Genjuro's golden aura channels Genbu's divine turtle power — the axe-hammer strike transcends physics.

[M] factor = **6.5 ×**
[M] Δv = 1.241 × 6.5 = **8.1 m/s** (rocket ring-out)

> **Note:** Physical values describe F230 under-attack geometry, TB tip cylinder-drive orbital mechanics, and Genbu beast smoke-burst leap ballistics. [M] values represent Genjuro's BeySpirit divine tortoise strike that exceeds all normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spinningShellSmashSpecial(bey: Beyblade, target: Beyblade): void {
  // F230 downward angle: θ = 28.4°, Δh leap = 40 mm → v_impact = 1.682 m/s
  // Physical J_smash = 5.645×10⁻² N·s; [M] 6.5×
  const J_phys = 0.05645;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.5; // [M] BeySpirit 6.5× (divine tortoise)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Downward press: opponent loses floor traction (floor-friction strip)
  target.spin = Math.max(0, target.spin - 10);
}
```

**Compatible beys:** Any beyblade using the F230 Spin Track (or equivalent tall-track Spin Track ≥ 200 height units) combined with a TB or equivalent ball-tip that can transition to cylinder-rim drive. The F230 height differential under-attack mechanic requires opponents with shorter track configurations (≤ 145 height). Standard game instance: Bandit Genbu F230TB (Genjuro Kamegaki, Metal Fury). Without F230 the under-attack downward angle is absent; without TB cylinder contact the drive velocity is insufficient for the smoke-burst aerial leap.

---

## Case 1844 — COMBO: Shell Slam — Bandit Genbu

**Sequence:** ↓ A K (moveDown · attack · defense)
**Cost:** 15 | **Type:** attack | **Blader:** Genjuro Kamegaki

### Physics Justification

The downward retreat (↓) drops Bandit Genbu to the stadium bowl bottom, maximising F230 height advantage above the floor (the tall track keeps the FW high while the bey sits at the low point of the bowl). The attack strike (A) delivers the under-attack hit — the angle θ_down = 28.4° magnifies the downward impulse component, pressing the opponent into the floor and stripping traction. The immediate defense stance (K) represents Genbu pulling back into a tortoise-shell retraction posture, converting the rebound force back to spin:

```
J_rebound = m_G × e_rebound × v_contact = 0.039 × 0.70 × 0.5 = 1.365×10⁻² N·s

Δω = η × J_rebound × r_contact / I_G = 0.80 × 1.365×10⁻² × 0.022 / 2.590×10⁻⁵
   = 0.80 × 11.6
   = +9.3 rad/s  ≈ +9 rad/s
```

(η = 0.80: TB ball re-contact spin-reconversion at retraction.) The downward strike geometry gives damageMultiplier **1.20×** and the floor-press creates lockMs = 100 as the opponent is momentarily pinned.

**Parameters:**
- spinGain: +9 rad/s (TB rebound retraction spin-reconversion η = 0.80)
- damageMultiplier: 1.20 (F230 downward strike geometry θ = 28.4°)
- lockMs: 100 (opponent floor-press duration)

### TypeScript

```typescript
function shellSlamCombo(bey: Beyblade, target: Beyblade): void {
  // TB ball rebound retraction: Δω ≈ +9 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 9);
  // F230 downward strike geometry: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 100: opponent floor-pressed
  bey.lockMs = 100;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +9 rad/s (partial) | ✓ |



---

## Case 1845 — GIMMICK: Twisted Tempo 145WD — Twisted ER Centrifugal Air Barrier & WD Gyroscopic Stamina

**Beyblade:** Twisted Tempo 145WD (TT JP: ツイステッドテンポ145WD; Hasbro EN: Twisted Tempo 145WD)
**Blader:** Faust | **Series:** Beyblade: Metal Masters (BB-80)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Tempo | 34.0 | 31.0 |
| Energy Ring | Twisted | 4.0 | 25.0 |
| Spin Track | 145 | 1.7 | 6.0 |
| Performance Tip | WD (Wide Defense) | 1.0 | 6.0 |
| **Total** | | **40.7** | |

**I_total** = 34.0×10⁻³ × 0.031² + 4.0×10⁻³ × 0.025² + 1.7×10⁻³ × 0.006² + 1.0×10⁻³ × 0.006²
           = 3.267×10⁻⁵ + 2.500×10⁻⁶ + 6.12×10⁻⁸ + 3.60×10⁻⁸
           = **3.523×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Masters launch)
L₀ = I × ω₀ = 3.523×10⁻⁵ × 650 = **2.290×10⁻² kg·m²/s**

---

### 1. Twisted ER — Centrifugal Air Barrier ("Barrier of Space")

The Twisted Energy Ring's large Roman-numeral clock-face design acts as a wide annular fan blade at ω₀. The spinning rim pumps air centrifugally outward, establishing a circular high-pressure air barrier at r_ER = 25 mm.

**Rim velocity:**

```
v_rim = ω₀ × r_ER = 650 × 0.025 = 16.25 m/s
```

**Dynamic pressure at barrier radius:**

```
q_rim = ½ × ρ_air × v_rim² = ½ × 1.225 × 16.25² = 161.8 Pa
```

This is the "barrier of space" — a ring of high-pressure air at r = 25 mm radiating outward from Twisted Tempo's axis. Opponents' beyblades feel this as a radial repulsion boundary.

---

### 2. Low-Pressure Suction Zone ("Black Hole")

Inside r_ER, the centrifugal pumping creates a low-pressure zone relative to the ambient arena pressure. The pressure differential drives a radially inward suction force on any bey within the suction radius (r < 80 mm):

```
ΔP_suction = q_rim = 161.8 Pa  (below ambient at axis)

F_suction = ΔP_suction × A_opp = 161.8 × π × 0.020² = 2.034×10⁻¹ N  (inward radial)
```

**Suction work — opponent drawn in from r = 80 mm to contact at r = 0:**

```
W_suction = F_suction × Δr = 0.2034 × 0.080 = 1.627×10⁻² J

v_approach = √(2 × W_suction / m_opp) = √(2 × 1.627×10⁻² / 0.042) = √(0.7748) = 0.880 m/s
```

---

### 3. WD Tip — Wide Defense Gyroscopic Stamina

The Wide Defense tip runs on a broad flat rim (r_WD = 6 mm) with relatively low friction, maximising spin time:

```
τ_WD = μ_WD × m × g × r_WD = 0.15 × 0.0407 × 9.81 × 0.006 = 3.588×10⁻⁴ N·m
t_spin = L₀ / τ_WD = 2.290×10⁻² / 3.588×10⁻⁴ = 63.8 s
```

Precession at WD running height (h_CoM = 15 mm):

```
Ω_prec = m × g × h_CoM / L₀ = 0.0407 × 9.81 × 0.015 / 2.290×10⁻² = 0.261 rad/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 40.7 g |
| I_total | 3.523×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 2.290×10⁻² kg·m²/s |
| v_rim | 16.25 m/s |
| q_rim | 161.8 Pa |
| F_suction | 2.034×10⁻¹ N |
| v_approach (opponent) | 0.880 m/s |
| τ_WD | 3.588×10⁻⁴ N·m |
| t_spin | 63.8 s |
| Ω_prec | 0.261 rad/s |

---

## Case 1846 — SPECIAL: Spiral Dimension — Faust / Twisted Tempo 145WD

**Blader:** Faust | **Beyblade:** Twisted Tempo 145WD | **Type:** defense

### Description

Spiral Dimension is the signature special move of Faust and Twisted Tempo 145WD. The move projects a giant image of the Twisted Energy Ring's Roman-numeral clock design outward from the spinning bey, creating a barrier of space throughout the stadium. A giant black hole forms at Twisted Tempo's axis, sucking all opposing beyblades within the barrier inward. Once drawn to the centre, the dimensional collapse reverses and ejects them with devastating force.

### Stage 1 — Air Barrier & Black Hole Suction (from Case 1845)

Suction F = 2.034×10⁻¹ N (inward). Opponent drawn from r = 80 mm to axis: v_approach = **0.880 m/s**.

### Stage 2 — Dimensional Collapse Strike

**Collision model (suction-driven approach + elastic reversal, e = 0.80):**

Parameters:
- m_TT = 40.7 g, m_opp = 42 g (representative), v_approach = 0.880 m/s

```
m_eff = (0.0407 × 0.042) / (0.0407 + 0.042) = 1.709×10⁻³ / 0.0827 = 2.067×10⁻² kg

J_spiral = m_eff × (1 + e) × v_approach
         = 2.067×10⁻² × 1.80 × 0.880
         = 3.274×10⁻² N·s
```

**Effect on opponent (ejected from dimensional collapse):**
```
Δv_opp  = J_spiral / m_opp = 3.274×10⁻² / 0.042 = 0.779 m/s
```

**Effect on Twisted Tempo (spin drain — minimal; WD absorbs recoil):**
```
Δω_TT    = J_spiral × r_contact / I_TT = 3.274×10⁻² × 0.022 / 3.523×10⁻⁵ = 20.4 rad/s
ω_remain = 650 − 20.4 = 629.6 rad/s  (96.9% retained)
```

---

**[M] BeySpirit amplification:**
Faust channels the dimensional barrier to its maximum extent — the entire arena collapses into a single dimensional point before erupting outward.

[M] factor = **7.0 ×**
[M] Δv = 0.779 × 7.0 = **5.5 m/s** (ring-out; all opponents ejected)

> **Note:** Physical values describe Twisted ER centrifugal air barrier, pressure-differential suction, and dimensional collapse impulse. [M] values represent BeySpirit-overridden dimensional force that transcends normal collision limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spiralDimensionSpecial(bey: Beyblade, target: Beyblade): void {
  // Stage 1: suction — F_suction = 0.2034 N inward over Δr = 80 mm → v_approach = 0.880 m/s
  // Pull target toward bey center first
  const dx = bey.x - target.x;
  const dy = bey.y - target.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.2034, (dy / dist) * 0.2034);
  // Stage 2: dimensional collapse — J_phys = 3.274×10⁻² N·s; [M] 7.0×
  const J_phys = 0.03274;
  const exDx = target.x - bey.x;
  const exDy = target.y - bey.y;
  const exDist = Math.hypot(exDx, exDy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0×
  applyForce(target.id, (exDx / exDist) * amplified, (exDy / exDist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Twisted Energy Ring (Roman-numeral clock-face design) with the WD (Wide Defense) Performance Tip on a heavy defense-class Fusion Wheel (Tempo or equivalent). The centrifugal air barrier requires an ER with a wide annular blade surface (r_ER ≥ 22 mm) at high spin. Standard game instance: Twisted Tempo 145WD (Faust, Metal Masters). Without the Twisted ER the clock-face barrier projection is absent; without the heavy Tempo wheel the gyroscopic rigidity needed to sustain the dimensional vortex collapses.

---

## Case 1847 — COMBO: Vortex Guard — Twisted Tempo

**Sequence:** ← K ← (moveLeft · defense · moveLeft)
**Cost:** 15 | **Type:** defense | **Blader:** Faust

### Physics Justification

The first leftward sweep (←) carries Twisted Tempo into a partial orbit within its own suction field, inducing a low-speed inward drift in any nearby opponent (F_suction × Δt / m_opp = 2.034×10⁻¹ × 0.072 / 0.042 = 0.348 m/s). The defense stance (K) anchors the WD tip and allows the suction reaction — the opponent being pulled in momentarily — to transfer a small angular impulse back to Twisted Tempo:

```
v_pull = F_suction × Δt_suction / m_opp = 0.2034 × 0.072 / 0.042 = 0.348 m/s  (induced)

Δω = η × m_opp × v_pull × r_contact / I_TT
   = 0.75 × 0.042 × 0.348 × 0.022 / 3.523×10⁻⁵
   = 0.75 × (3.219×10⁻⁴) / 3.523×10⁻⁵
   = 0.75 × 9.14
   = +6.9 rad/s  ≈ +7 rad/s
```

(η = 0.75: suction reaction transfer efficiency — partial vortex re-coupling at WD contact point.) The second leftward exit (←) releases the accumulated vortex momentum as a lateral deflection impulse with damageMultiplier **1.15×**. The lockMs = 200 represents the suction dwell window during which the opponent is held near the axis.

**Parameters:**
- spinGain: +7 rad/s (suction reaction angular impulse; opponent v_pull = 0.348 m/s transferred at r = 22 mm; η = 0.75)
- damageMultiplier: 1.15 (vortex-assisted lateral deflection on exit sweep)
- lockMs: 200 (suction dwell anchoring opponent near axis)

### TypeScript

```typescript
function vortexGuardCombo(bey: Beyblade, target: Beyblade): void {
  // Suction reaction angular impulse: Δω ≈ +7 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 7);
  // Vortex-assisted deflection: 1.15× lateral impulse
  bey.damageMultiplier = 1.15;
  // lockMs = 200: suction dwell
  bey.lockMs = 200;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.15, (dy / dist) * 0.15);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.15 | ✓ |
| lockMs | ≤ 300 | 200 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +7 rad/s (partial) | ✓ |



---

## Case 1848 — GIMMICK: Dranzer MS — Dranzer S Wing Aerodynamics & MS Tip Stamina

**Beyblade:** Dranzer MS (TT JP: ドランザーMS; Hasbro EN: Dranzer MS)
**Blader:** Kai Hiwatari | **Series:** Beyblade G-Revolution (Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Dranzer S | 14.0 | 33.0 |
| Weight Disk | Wide | 18.0 | 35.0 |
| Spin Gear | Right MS SG | 3.5 | 10.0 |
| Bottom Base | MS (Metal Sharp) | 2.0 | 3.0 |
| **Total** | | **37.5** | |

(Bit Chip Dranzer ~1 g at r ≈ 0 excluded per convention — negligible I contribution.)

**I_total** = 14.0×10⁻³ × 0.033² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.525×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 1.8×10⁻⁸
           = **3.748×10⁻⁵ kg·m²**

ω₀ = 710 rad/s (standard plastic-generation G-Revolution launch)
L₀ = I × ω₀ = 3.748×10⁻⁵ × 710 = **2.661×10⁻² kg·m²/s**

---

### 1. Dranzer S — Four-Wing Phoenix Aerodynamic Lift

The Dranzer S Attack Ring carries four swept phoenix-wing blades. At ω₀ each blade tip travels at high velocity and generates an upward aerodynamic lift force:

```
v_wing_tip = ω₀ × r_AR = 710 × 0.033 = 23.43 m/s
```

**Lift per wing blade (flat aerofoil at attack angle):**

```
A_wing = 3.0×10⁻³ × 12.0×10⁻³ = 3.6×10⁻⁵ m²  (approximate single blade area)
C_L = 0.6  (swept flat wing at high tip speed)

F_lift_per_wing = ½ × ρ_air × C_L × A_wing × v_wing_tip²
                = ½ × 1.225 × 0.6 × 3.6×10⁻⁵ × 23.43²
                = 7.264×10⁻³ N
```

**Total lift (4 active wings):**

```
F_lift_total = 4 × 7.264×10⁻³ = 2.906×10⁻² N

W = m × g = 0.0375 × 9.81 = 0.368 N

Lift / Weight = 2.906×10⁻² / 0.368 = 7.9%  (BeySpirit required for full liftoff)
```

→ The wings provide measurable aerodynamic assist but cannot achieve liftoff alone. BeySpirit ignites the phoenix and delivers the remaining 92.1% of the upward impulse needed.

---

### 2. MS (Metal Sharp) Tip — Maximum Stamina Contact

The Metal Sharp tip contacts the arena floor at a single metal point (r_MS = 3 mm, μ = 0.08):

```
τ_MS = μ × m × g × r_MS = 0.08 × 0.0375 × 9.81 × 0.003 = 8.831×10⁻⁵ N·m
t_spin = L₀ / τ_MS = 2.661×10⁻² / 8.831×10⁻⁵ = 301.3 s
```

The metal-on-plastic contact gives exceptional endurance, allowing Dranzer to sustain the orbital speed needed for the Spiral Fireball liftoff late in the battle.

---

### 3. Self-Impact Burst Risk — Phoenix Burns Its Own Life Force

The Spiral Fireball's dive lands with total impact impulse J_fireball (derived in Case 1849). The same force that devastates the opponent acts back on Dranzer via Newton's third law. The burst threshold for Dranzer S (4 pegs, plastic-gen):

```
τ_burst_threshold ≈ 4 × 0.100 = 0.400 N·m  (4 burst pegs × 100 mN·m each)

Self-impact torque on Dranzer S tabs:
F_self = J_fireball / Δt_contact = 8.238×10⁻² / 0.003 = 27.5 N
τ_self   = F_self × r_AR = 27.5 × 0.033 = 0.908 N·m

Burst ratio = τ_self / τ_burst_threshold = 0.908 / 0.400 = 2.27×  → HIGH SELF-BURST RISK
```

→ "can damage your own beyblade and make you spin out by breaking" — physically verified.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.5 g |
| I_total | 3.748×10⁻⁵ kg·m² |
| ω₀ | 710 rad/s |
| L₀ | 2.661×10⁻² kg·m²/s |
| v_wing_tip | 23.43 m/s |
| F_lift_total | 2.906×10⁻² N |
| Lift / Weight | 7.9% |
| τ_MS | 8.831×10⁻⁵ N·m |
| t_spin | 301.3 s |
| τ_self_impact | 0.908 N·m |
| Burst ratio | 2.27× |

---

## Case 1849 — SPECIAL: Spiral Fireball — Kai Hiwatari / Dranzer MS

**Blader:** Kai Hiwatari | **Beyblade:** Dranzer MS | **Type:** attack (self-damage)

### Description

Spiral Fireball is the only special move of Kai Hiwatari and Dranzer MS. Dranzer gets engulfed in flames and soars into the air above the arena, surrounded by brilliant light from the phoenix fire. It then dives straight down back into the arena and crashes onto the opposing beyblade. This represents the phoenix's last attack, sacrificing its own life force to deliver a massive explosion. The force damages Dranzer itself — the impact can cause Dranzer to spin out or burst from the sheer recoil. Kai used this move to defeat Brooklyn in their battle during the Justice 5 Tournament.

### Stage 1 — Phoenix Fire Ascent (from Case 1848)

Wing aerodynamic assist: F_lift = 2.906×10⁻² N (7.9% of weight). BeySpirit delivers remaining liftoff force. Dranzer rises to h = **80 mm** above arena floor.

**Orbital entry speed:** v_orbital = 2.0 m/s (full attack-type orbital velocity before liftoff).

**Dive impact velocity:**

```
v_impact = √(v_orbital² + 2g × h)
         = √(2.0² + 2 × 9.81 × 0.080)
         = √(4.0 + 1.570)
         = √5.570
         = 2.360 m/s
```

### Stage 2 — Phoenix Crash (Mutual Impact)

**Collision model (hard dive, e = 0.85):**

Parameters:
- m_DMS = 37.5 g, v_impact = 2.360 m/s
- m_opp = 38 g (representative), v_opp ≈ 0

```
m_eff = (0.0375 × 0.038) / (0.0375 + 0.038) = 1.425×10⁻³ / 0.0755 = 1.887×10⁻² kg

J_fireball = m_eff × (1 + e) × v_impact
           = 1.887×10⁻² × 1.85 × 2.360
           = 8.238×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_fireball / m_opp = 8.238×10⁻² / 0.038 = 2.168 m/s
```

**Self-damage on Dranzer MS (Newton's third law — mutual impact):**
```
Δω_self  = J_fireball × r_contact / I_DMS = 8.238×10⁻² × 0.025 / 3.748×10⁻⁵ = 54.9 rad/s  (spin drain)
ω_remain = 710 − 54.9 = 655.1 rad/s  (physical; 92.3% post-impact)
τ_self   = 0.908 N·m  → 2.27× burst threshold  (very high self-burst risk)
```

---

**[M] BeySpirit amplification:**
Kai channels the full life force of Dranzer's phoenix spirit into one final explosion — the bird burns itself to ash to destroy its opponent.

[M] factor = **9.0 ×**
[M] Δv_opp = 2.168 × 9.0 = **19.5 m/s** (complete destruction of opponent)
[M] Δω_self = 54.9 × 9.0 = **494 rad/s** (near-total spin loss — self-destruction)

> **Note:** Physical values describe Dranzer S wing-assisted aerial liftoff and mutual impulse dive collision. [M] values represent the phoenix's full life-force sacrifice — a single move that destroys both the opponent AND Dranzer itself at BeySpirit level. The [M] self-damage is intentional and canon. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spiralFireballSpecial(bey: Beyblade, target: Beyblade): void {
  // Aerial dive: h = 80 mm, v_impact = 2.360 m/s
  // Physical J_fireball = 8.238×10⁻² N·s; [M] 9.0×
  const J_phys = 0.08238;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 9.0; // [M] BeySpirit 9.0× (phoenix life-sacrifice)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Self-damage: mutual impact — Dranzer takes the same force back
  // Physical: Δω_self = 54.9 rad/s; [M]: near-total spin loss
  const selfDrain = J_phys * 9.0; // [M] self-damage matches opponent impulse
  applyForce(bey.id, -(dx / dist) * selfDrain, -(dy / dist) * selfDrain);
  bey.spin = Math.max(0, bey.spin - 495); // [M] self-destruction spin drain
}
```

**Compatible beys:** Any beyblade using the Dranzer S (or equivalent swept-wing phoenix Attack Ring) with an MS (Metal Sharp) tip, where the wing geometry provides measurable aerodynamic lift assist. The self-damage mechanic applies to any bey that delivers a mutual-impulse dive attack — the Newton's-third-law recoil is unavoidable. Standard game instance: Dranzer MS (Kai Hiwatari, G-Revolution). Without the Dranzer S wings the aerodynamic liftoff assist is absent; without the MS tip the long-stamina orbital platform needed to reach liftoff speed late in the battle is absent.

---

## Case 1850 — COMBO: Phoenix Dive — Dranzer MS

**Sequence:** J → A (jump · moveRight · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Kai Hiwatari

### Physics Justification

The jump (J) initiates a brief partial Spiral Fireball ascent — the Dranzer S wings provide aerodynamic lift over Δh = 20 mm (one-quarter of the full 80 mm liftoff; F_lift × Δt_jump = 2.906×10⁻² × 0.35 = 1.017×10⁻² J → v_z = 0.735 m/s). The rightward arc (→) angles the descent to the right, positioning the approach vector for a glancing dive. The attack (A) releases the wing-assisted dive strike:

```
v_combo_impact = √(v_orbital² + 2g × Δh_partial)
               = √(2.0² + 2 × 9.81 × 0.020)
               = √(4.0 + 0.392)
               = 2.096 m/s

Δω = η × m_DMS × v_combo_impact × r_contact / I_DMS
   = 0.45 × 0.0375 × 2.096 × 0.025 / 3.748×10⁻⁵
   = 0.45 × (1.965×10⁻³) / 3.748×10⁻⁵
   = 0.45 × 52.43
   = +23.6 rad/s  ≈ +24 rad/s
```

(η = 0.45: partial wing-aerodynamic assisted re-contact at partial dive height.) The angled descent approach from partial elevation raises the normal impulse vector by θ = arctan(0.735/2.0) = 20.2°, adding damageMultiplier **1.35×** from the downward component.

**Parameters:**
- spinGain: +24 rad/s (wing-assisted partial dive spin reconversion η = 0.45, Δh = 20 mm)
- damageMultiplier: 1.35 (partial aerial approach θ = 20.2° normal impulse boost)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function phoenixDiveCombo(bey: Beyblade, target: Beyblade): void {
  // Partial wing-lift dive spin reconversion: Δω ≈ +24 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 24);
  // Angled partial aerial approach: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +24 rad/s (partial) | ✓ |



> **Note:** Cases 1851–1854 reserved — CS9 HMS session conflict #7 (CS9 wrote HMS Dranzer MS / Driger MS at 1845–1853 in a concurrent session). Cases 1855–1857 continue from Case 1850 (Spiral Fireball).

---

## Case 1855 — GIMMICK: Galeon 2 — Blade Sweep Plasma Vortex & SFC Tip Orbital Drive

**Beyblade:** Galeon 2 (TT JP: ガルーン2; Hasbro EN: Galeon 2)
**Blader:** Lee | **Series:** Beyblade G-Revolution (Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Galeon 2 (6-blade lion-thunder) | 15.0 | 32.0 |
| Weight Disk | 10 Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Bottom Base | SFC (Semi-Flat Customs) | 2.5 | 4.0 |
| **Total** | | **39.0** | |

(Bit Chip Galeon 2 ~1 g at r ≈ 0 excluded per convention.)

**I_total** = 15.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.5×10⁻³ × 0.004²
           = 1.536×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 4.0×10⁻⁸
           = **3.780×10⁻⁵ kg·m²**

ω₀ = 710 rad/s (standard plastic-generation G-Revolution launch)
L₀ = I × ω₀ = 3.780×10⁻⁵ × 710 = **2.684×10⁻² kg·m²/s**

---

### 1. Galeon 2 AR — Blade Sweep Plasma Wake ("Lightning Bolts")

The six lion-thunder blades of Galeon 2's Attack Ring sweep at high tip velocity, ionising the boundary-layer air and creating visible plasma wakes — the lightning bolt effect seen in the anime.

**Blade tip velocity and dynamic pressure:**

```
v_tip = ω₀ × r_AR = 710 × 0.032 = 22.72 m/s

q_tip = ½ × ρ_air × v_tip² = ½ × 1.225 × 22.72² = 316.7 Pa
```

**Blade sweep frequency (any fixed point near the AR):**

```
f_blade = ω₀ × n_blades / (2π) = 710 × 6 / (2π) = 677.8 Hz
```

**Single blade pass lateral impulse (blade width 3 mm, contact area 10×10 mm, miss distance 5 mm):**

```
Δt_pass = blade_thickness / v_tip = 3×10⁻³ / 22.72 = 1.320×10⁻⁴ s
A_contact = 1.0×10⁻⁴ m²
F_blade_pulse = q_tip × A_contact = 316.7 × 1.0×10⁻⁴ = 3.167×10⁻² N
J_pulse = F_blade_pulse × Δt_pass = 3.167×10⁻² × 1.320×10⁻⁴ = 4.180×10⁻⁶ N·s  (per blade pass)
```

**Accumulated lateral disorient impulse (N_passes over t_spiral = 2.0 s orbital approach):**

```
N_passes = f_blade × t_spiral = 677.8 × 2.0 = 1356

J_lateral_total = N_passes × J_pulse = 1356 × 4.180×10⁻⁶ = 5.666×10⁻³ N·s

Radial outward component (60% of lateral → radial displacement):
J_radial_eff  = 0.60 × 5.666×10⁻³ = 3.400×10⁻³ N·s
F_radial_eff  = J_radial_eff / t_spiral = 3.400×10⁻³ / 2.0 = 1.700×10⁻³ N  (sustained outward push)
```

→ This is the "lightning disorientation" — 1.7 mN of sustained lateral outward force gradually displaces the opponent toward the stadium wall.

---

### 2. SFC Tip — Semi-Flat Orbital Drive

The Semi-Flat Customs tip contacts the floor at radius r_SFC = 4 mm with moderate friction, giving Galeon 2 a balance between attack orbital velocity and stamina:

```
τ_SFC = μ × m × g × r_SFC = 0.30 × 0.039 × 9.81 × 0.004 = 4.590×10⁻⁴ N·m
t_spin = L₀ / τ_SFC = 2.684×10⁻² / 4.590×10⁻⁴ = 58.5 s

v_orbital = μ_SFC × ω₀ × r_SFC = 0.30 × 710 × 0.004 = 0.852 m/s  (steady orbit)
```

(Galeon 2 at attack speed uses peak v_orbital ≈ 1.5 m/s with launch momentum.)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 39.0 g |
| I_total | 3.780×10⁻⁵ kg·m² |
| ω₀ | 710 rad/s |
| L₀ | 2.684×10⁻² kg·m²/s |
| v_tip | 22.72 m/s |
| q_tip | 316.7 Pa |
| f_blade | 677.8 Hz |
| J_pulse | 4.180×10⁻⁶ N·s |
| J_lateral_total (2 s) | 5.666×10⁻³ N·s |
| J_radial_eff | 3.400×10⁻³ N·s |
| F_radial_eff | 1.700×10⁻³ N |
| τ_SFC | 4.590×10⁻⁴ N·m |
| t_spin | 58.5 s |

---

## Case 1856 — SPECIAL: Spiral Lightning — Lee / Galeon 2

**Blader:** Lee | **Beyblade:** Galeon 2 | **Type:** attack

### Description

Spiral Lightning is Lee's signature special move with Galeon 2. Galeon 2 spirals inward in a tightening orbit around the opponent, its six AR blades generating rapid lightning bolt plasma wakes at 677 Hz. These successive blade sweeps disorient and laterally displace the opponent outward over the spiral approach. Finally, Galeon 2 delivers a direct orbital crash at full attack speed. Galeon first used this against Tyson's Dragoon in a battle royale during G-Revolution.

### Stage 1 — Lightning Orbital Approach (from Case 1855)

Accumulated blade sweep lateral disorient over t = 2.0 s:
J_radial_eff = 3.400×10⁻³ N·s → opponent lateral displacement = **J_radial_eff / m_opp = 3.400×10⁻³ / 0.038 = 89.5 mm** (opponent displaced 89.5 mm outward from centre, near stadium wall).

### Stage 2 — Orbital Crash

**Collision model (orbital attack, e = 0.80):**

Parameters:
- m_G2 = 39.0 g, v_attack = 1.5 m/s (peak SFC orbital)
- m_opp = 38 g, v_opp ≈ 0

```
m_eff = (0.039 × 0.038) / (0.039 + 0.038) = 1.482×10⁻³ / 0.077 = 1.925×10⁻² kg

J_crash = m_eff × (1 + e) × v_attack
        = 1.925×10⁻² × 1.80 × 1.5
        = 5.198×10⁻² N·s
```

**Effect on opponent (combined disorient + crash):**
```
Δv_opp  = J_crash / m_opp = 5.198×10⁻² / 0.038 = 1.368 m/s
```
(Opponent already at wall due to 89.5 mm disorient displacement — 1.37 m/s sends it over the edge.)

**Effect on Galeon 2 (spin drain):**
```
Δω_G2    = J_crash × r_contact / I_G2 = 5.198×10⁻² × 0.025 / 3.780×10⁻⁵ = 34.4 rad/s
ω_remain = 710 − 34.4 = 675.6 rad/s  (95.2% retained)
```

---

**[M] BeySpirit amplification:**
Lee channels Galeon's full thunder spirit — the lightning bolts become true electrical arcs that overwhelm the opponent's spin before the final crash.

[M] factor = **6.0 ×**
[M] Δv = 1.368 × 6.0 = **8.2 m/s** (ring-out from wall)

> **Note:** Physical values describe blade sweep plasma wake accumulated lateral disorient and orbital crash mechanics. [M] values represent BeySpirit-overridden electrical arc force that overwhelms normal collision limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spiralLightningSpecial(bey: Beyblade, target: Beyblade): void {
  // Stage 1: blade sweep lateral disorient — push target outward (F_radial = 1.700×10⁻³ N × 2s)
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Sustained lateral outward nudge (represented as accumulated impulse)
  applyForce(target.id, (dx / dist) * 0.0034, (dy / dist) * 0.0034);
  // Stage 2: orbital crash — J_crash = 5.198×10⁻² N·s; [M] 6.0×
  const J_phys = 0.05198;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a multi-blade Attack Ring (6+ blades) with blade tip velocity v_tip ≥ 20 m/s for sufficient blade-sweep plasma wake generation, combined with a semi-flat tip that provides stable mid-speed orbital approach. Standard game instance: Galeon 2 (Lee, G-Revolution). Without the high blade count the lightning strike frequency drops below the 677 Hz disorient threshold; without the SFC tip the orbital stability needed to sustain the 2-second spiral approach is absent.

---

## Case 1857 — COMBO: Thunder Arc — Galeon 2

**Sequence:** → E A (moveRight · dodge · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Lee

### Physics Justification

The rightward orbital sweep (→) positions Galeon 2 on a clockwise arc, generating a partial blade sweep sequence against the opponent (f_blade × Δt_arc = 677.8 × 0.12 = 81 blade passes → J_partial = 81 × 4.180×10⁻⁶ = 3.386×10⁻⁴ N·s lateral). The dodge (E) represents a lightning arc flash — Galeon briefly arcs away and then snaps inward, converting the orbital tangential velocity back to spin at the contact point:

```
Δω = η × m_G2 × v_orbital × r_contact / I_G2
   = 0.60 × 0.039 × 1.5 × 0.025 / 3.780×10⁻⁵
   = 0.60 × (1.463×10⁻³) / 3.780×10⁻⁵
   = 0.60 × 38.70
   = +23.2 rad/s  ≈ +23 rad/s
```

(η = 0.60: SFC semi-flat orbital-to-spin reconversion at arc flash snap-back.) The attack (A) delivers the strike at the end of the arc, amplified by the accumulated blade sweep lateral push: damageMultiplier **1.25×**.

**Parameters:**
- spinGain: +23 rad/s (SFC orbital-to-spin reconversion at arc flash, η = 0.60)
- damageMultiplier: 1.25 (orbital arc approach amplified by partial blade sweep disorient)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function thunderArcCombo(bey: Beyblade, target: Beyblade): void {
  // SFC orbital-to-spin arc flash reconversion: Δω ≈ +23 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 23);
  // Arc approach with blade sweep disorient: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +23 rad/s (partial) | ✓ |



---

## Case 1858 — GIMMICK: Ace Dragon Sting Charge Zan — Sting Disc Spring-Wall Ricochet & Zephyr Tip Orbital Drive

**Beyblade:** Ace Dragon Sting Charge Zan (TT JP: エースドラゴン・スティング・チャージ・ザン; Hasbro EN: Ace Dragon Sting Charge Zan)
**Blader:** Dante Koryu | **Series:** Beyblade Burst Rise (B-149)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Layer Base | Ace Dragon | 21.0 | 27.0 |
| Layer Weight | — | 0.0 | — |
| Disc | Sting (spring-loaded) | 7.5 | 22.0 |
| Driver | Charge Zan (Zephyr) | 2.5 | 5.0 |
| **Total** | | **31.0** | |

**I_total** = 21.0×10⁻³ × 0.027² + 7.5×10⁻³ × 0.022² + 2.5×10⁻³ × 0.005²
           = 1.531×10⁻⁵ + 3.630×10⁻⁶ + 6.25×10⁻⁸
           = **1.900×10⁻⁵ kg·m²**

ω₀ = 630 rad/s (standard Burst Rise launch)
L₀ = I × ω₀ = 1.900×10⁻⁵ × 630 = **1.197×10⁻² kg·m²/s**

---

### 1. Sting Disc — Spring-Loaded Wall-Ricochet Mechanism

The Sting Disc features two spring-loaded protrusions at r = 22 mm. When Ace Dragon impacts the stadium wall, the protrusions compress and release, adding stored spring potential energy to the rebound.

**Spring mechanics (single protrusion, k ≈ 75 N/m, max compression x = 4 mm):**

```
PE_spring = ½ × k × x² = ½ × 75 × (0.004)² = 6.000×10⁻⁴ J

Δv_spring = √(2 × PE_spring / m) = √(2 × 6.000×10⁻⁴ / 0.031) = √(3.871×10⁻²) = 0.197 m/s
```

**Wall approach velocity (Ace Dragon orbital speed):**

```
v_wall = ω₀ × r_orbit / (2π / n_walls) ≈ 1.800 m/s  (orbital approach speed at wall contact)
```

**Post-bounce velocity (two protrusions active, e_wall = 0.72 ABS-on-ABS):**

```
v_post = e_wall × v_wall + 2 × Δv_spring
       = 0.72 × 1.800 + 2 × 0.197
       = 1.296 + 0.394
       = 1.690 m/s
```

**Speed gain from spring mechanism:**

```
Δv_net = v_post − e_wall × v_wall = 1.690 − 1.296 = 0.394 m/s  (spring boost)

KE_gain = ½ × m × (v_post² − (e_wall × v_wall)²)
        = ½ × 0.031 × (1.690² − 1.296²)
        = ½ × 0.031 × (2.856 − 1.680)
        = 1.822×10⁻² J
```

→ Spring releases stored energy at the wall, accelerating Ace Dragon beyond what elastic rebound alone provides.

**S Gear analogy:** The S Gear (DB/BU system) uses a mechanically similar sliding spring mechanism. When the Layer's mode-change trigger fires, the S Gear's internal spring unloads, releasing stored elastic energy to the Disc in the same spring-energy-to-orbital-velocity conversion. The physics is identical: PE_spring → ΔKE_orbital.

---

### 2. Zephyr Driver — Variable-Friction Orbital Drive

The Zephyr Driver transitions between a sharp tip (low friction, high speed) and a flat contact pad (moderate friction, stable orbit), controlled by spin rate:

```
μ_sharp  = 0.10  (high spin — sharp point contacts; stamina/orbit mode)
μ_flat   = 0.35  (low spin — pad contacts; ground-hugging attack mode)

τ_sharp  = μ × m × g × r = 0.10 × 0.031 × 9.81 × 0.005 = 1.521×10⁻⁴ N·m
t_spin   = L₀ / τ_sharp = 1.197×10⁻² / 1.521×10⁻⁴ = 78.7 s  (stamina mode)

v_orbital_flat = μ_flat × ω₀ × r_driver = 0.35 × 630 × 0.005 = 1.103 m/s  (attack mode)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 31.0 g |
| I_total | 1.900×10⁻⁵ kg·m² |
| ω₀ | 630 rad/s |
| L₀ | 1.197×10⁻² kg·m²/s |
| k_spring | 75 N/m |
| x_compression | 4 mm |
| PE_spring | 6.000×10⁻⁴ J |
| v_wall | 1.800 m/s |
| v_post | 1.690 m/s |
| KE_gain | 1.822×10⁻² J |
| τ_sharp | 1.521×10⁻⁴ N·m |
| t_spin | 78.7 s |

---

## Case 1859 — SPECIAL: Spring Cannon / Bound Stinger — Dante Koryu / Ace Dragon Sting Charge Zan

**Blader:** Dante Koryu | **Beyblade:** Ace Dragon Sting Charge Zan | **Type:** attack

### Description

Spring Cannon (Bound Stinger in Japan) is the signature special move of Dante Koryu and Ace Dragon Sting Charge Zan. Dragon increases its speed and attack power by using its spring-loaded Sting Disc to ricochet off the stadium wall. Dragon can also parry incoming attacks by aiming the Sting Disc at the opponent's beyblade mid-approach, transferring the spring release directly into a counter-strike. The move is used with Ace Dragon, Glyph Dragon, and Rock Dragon Sting Charge Zan variants.

### Stage 1 — Wall Ricochet (from Case 1858)

Orbital approach: v_wall = 1.800 m/s. Spring release at wall: v_post = **1.690 m/s** (Δv_spring = 0.394 m/s).

### Stage 2 — Spring Cannon Strike

Ace Dragon redirects from the wall toward the opponent at the enhanced post-bounce velocity.

**Collision model (spring-boosted orbital attack, e = 0.75):**

Parameters:
- m_AD = 31.0 g, v_attack = v_post = 1.690 m/s
- m_opp = 32 g (representative Burst Rise), v_opp ≈ 0

```
m_eff = (0.031 × 0.032) / (0.031 + 0.032) = 9.920×10⁻⁴ / 0.063 = 1.575×10⁻² kg

J_cannon = m_eff × (1 + e) × v_attack
         = 1.575×10⁻² × 1.75 × 1.690
         = 4.653×10⁻² N·s
```

**Parry variant (Sting Disc aimed at incoming opponent, relative velocity v_rel = v_post + v_opp_approach = 1.690 + 1.200 = 2.890 m/s):**

```
J_parry = m_eff × (1 + e) × v_rel
        = 1.575×10⁻² × 1.75 × 2.890
        = 7.959×10⁻² N·s
```

**Effect on opponent (cannon strike):**
```
Δv_opp  = J_cannon / m_opp = 4.653×10⁻² / 0.032 = 1.454 m/s
```

**Effect on Ace Dragon (spin drain):**
```
Δω_AD    = J_cannon × r_contact / I_AD = 4.653×10⁻² × 0.020 / 1.900×10⁻⁵ = 49.0 rad/s
ω_remain = 630 − 49.0 = 581.0 rad/s  (92.2% retained)
```

---

**[M] BeySpirit amplification:**
Dante channels Dragon's roaring spirit — the spring Disc surges with dragon energy, converting the wall not into a bounce but into a cannon barrel that fires Dragon like a projectile.

[M] factor = **5.5 ×**
[M] Δv = 1.454 × 5.5 = **8.0 m/s** (ring-out)

> **Note:** Physical values describe Sting Disc spring-loaded wall-ricochet PE release and orbital cannon strike mechanics. [M] values represent Dante's BeySpirit dragon-energy cannon blast that transcends elastic limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function springCannonSpecial(bey: Beyblade, target: Beyblade): void {
  // Wall ricochet: v_post = 1.690 m/s (spring-boosted)
  // Physical J_cannon = 4.653×10⁻² N·s; [M] 5.5×
  const J_phys = 0.04653;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.5; // [M] BeySpirit 5.5× (dragon spring cannon)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Sting Disc (or S Gear spring-mechanism equivalent) that provides two active spring protrusions at r ≥ 20 mm, combined with an orbital attack driver (Zephyr or equivalent variable-friction tip). The spring PE release requires a Disc with internal spring mechanism (k ≥ 60 N/m) capable of storing ≥ 5×10⁻⁴ J per protrusion at max wall compression. Standard game instance: Ace Dragon Sting Charge Zan (Dante Koryu, Burst Rise). Also compatible: Glyph Dragon Sting Charge Zan, Rock Dragon Sting Charge Zan (same Disc/Driver; different Layer Base).

---

## Case 1860 — COMBO: Sting Rush — Ace Dragon

**Sequence:** → K A (moveRight · defense · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Dante Koryu

### Physics Justification

The rightward arc (→) positions Ace Dragon on an approach vector toward the stadium wall, building orbital momentum (v_orbital = 1.103 m/s in flat-driver attack mode). The defense stance (K) represents the Sting Disc loading — Dragon brakes slightly as the spring protrusions compress against the wall contact: PE_spring loaded = ½ × 75 × (3×10⁻³)² = 3.375×10⁻⁴ J (75% of full compression at reduced approach speed). The attack (A) fires the spring-loaded strike at the opponent immediately after wall contact, transferring the stored spring energy:

```
Δv_spring_partial = √(2 × 2 × PE_partial / m) = √(2 × 2 × 3.375×10⁻⁴ / 0.031) = 0.209 m/s

v_attack_combo = v_orbital + Δv_spring_partial = 1.103 + 0.209 = 1.312 m/s

Δω = η × m × v_attack_combo × r_contact / I_AD
   = 0.55 × 0.031 × 1.312 × 0.020 / 1.900×10⁻⁵
   = 0.55 × (8.134×10⁻⁴) / 1.900×10⁻⁵
   = 0.55 × 42.81
   = +23.5 rad/s  ≈ +24 rad/s
```

(η = 0.55: Zephyr flat-contact spin reconversion at spring-release wall kick.) damageMultiplier **1.25×** from spring-boosted closing velocity above standard orbital.

**Parameters:**
- spinGain: +24 rad/s (Zephyr flat-contact spring-release reconversion η = 0.55)
- damageMultiplier: 1.25 (spring-boosted orbital strike above standard closing speed)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function stingRushCombo(bey: Beyblade, target: Beyblade): void {
  // Sting spring-release wall kick spin reconversion: Δω ≈ +24 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 24);
  // Spring-boosted approach: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +24 rad/s (partial) | ✓ |

---

## Case 1861 — GIMMICK: Galaxy Pegasus W105R2F — W105 Wing Aerodynamic Lift Platform & R2F Orbital Burst Drive

**Beyblade:** Galaxy Pegasus W105R2F (TT JP: ギャラクシーペガシスW105R2F; Hasbro EN: Galaxy Pegasus W105R2F)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Masters (BB-70)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Galaxy | 30.0 | 30.0 |
| Energy Ring | Pegasus II | 4.0 | 24.0 |
| Spin Track | W105 (Wing 105) | 2.5 | 20.0 |
| Performance Tip | R2F (Rubber Double Flat) | 2.0 | 6.0 |
| **Total** | | **38.5** | |

**I_total** = 30.0×10⁻³ × 0.030² + 4.0×10⁻³ × 0.024² + 2.5×10⁻³ × 0.020² + 2.0×10⁻³ × 0.006²
           = 2.700×10⁻⁵ + 2.304×10⁻⁶ + 1.000×10⁻⁶ + 7.20×10⁻⁸
           = **3.034×10⁻⁵ kg·m²**

ω₀ = 680 rad/s (standard MFB Metal Masters launch)
L₀ = I × ω₀ = 3.034×10⁻⁵ × 680 = **2.063×10⁻² kg·m²/s**

---

### 1. W105 Track — Wing Aerodynamic Lift Platform

Spin Track W105 carries two swept wing blades at r = 20 mm height, 105 mm track height. The wings generate upward aerodynamic lift as Galaxy Pegasus circles the stadium at orbital speed.

**Wing tip velocity and lift:**

```
v_wing = ω₀ × r_W105 = 680 × 0.020 = 13.60 m/s

A_wing = 5.0×10⁻³ × 15.0×10⁻³ = 7.5×10⁻⁵ m²  (single wing blade area)
C_L    = 0.55  (swept flat wing at track height)

F_lift_per_wing = ½ × ρ_air × C_L × A_wing × v_wing²
               = ½ × 1.225 × 0.55 × 7.5×10⁻⁵ × 13.60²
               = 5.243×10⁻³ N
```

**Total lift (2 active wings):**

```
F_lift_total = 2 × 5.243×10⁻³ = 1.049×10⁻² N

W = m × g = 0.0385 × 9.81 = 0.378 N

Lift / Weight = 1.049×10⁻² / 0.378 = 2.8%  (BeySpirit required for full liftoff)
```

**Orbital speed contribution from W105 wings:**

The wings also produce a small tangential thrust component (swept angle α = 20°):

```
F_thrust = F_lift_total × sin(20°) = 1.049×10⁻² × 0.342 = 3.588×10⁻³ N  (tangential)
a_orbital = F_thrust / m = 3.588×10⁻³ / 0.0385 = 0.0932 m/s²
v_orbital_gain (over 1 orbit, t_orbit ≈ 0.5s) = 0.0932 × 0.5 = 4.66×10⁻² m/s  (small boost)
```

---

### 2. R2F Tip — Rubber Double Flat Orbital Burst Drive

The R2F tip has a wide rubber double-flat surface (r_R2F = 6 mm, μ_rubber = 0.80) giving extremely aggressive orbital movement with rapid spin decay:

```
τ_R2F   = μ × m × g × r_R2F = 0.80 × 0.0385 × 9.81 × 0.006 = 1.817×10⁻³ N·m
t_spin  = L₀ / τ_R2F = 2.063×10⁻² / 1.817×10⁻³ = 11.4 s  (aggressive attack stamina)

v_orbital = μ_rubber × ω₀ × r_R2F = 0.80 × 680 × 0.006 = 3.264 m/s  (peak orbital velocity)
```

→ The R2F gives Galaxy Pegasus the highest orbital speed of any Pegasus variant — 3.264 m/s vs Storm Pegasus RF's 2.040 m/s (Case 1812). This is the momentum source for the Starbooster stadium circle and liftoff.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 38.5 g |
| I_total | 3.034×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| L₀ | 2.063×10⁻² kg·m²/s |
| v_wing | 13.60 m/s |
| F_lift_total | 1.049×10⁻² N |
| Lift / Weight | 2.8% |
| τ_R2F | 1.817×10⁻³ N·m |
| t_spin | 11.4 s |
| v_orbital | 3.264 m/s |

---

## Case 1862 — SPECIAL: Starbooster Attack / Stargazer — Gingka Hagane / Galaxy Pegasus W105R2F

**Blader:** Gingka Hagane | **Beyblade:** Galaxy Pegasus W105R2F | **Type:** attack

### Description

Starbooster Attack (Stargazer in Japan) is the first special move used by Gingka Hagane and Galaxy Pegasus W105R2F. Galaxy Pegasus circles around the stadium at full R2F orbital speed, building centripetal momentum. It then uses this accumulated orbital energy to take flight into the air, and crashes back down onto the opponent. Galaxy Pegasus has also used this move when knocked airborne by an opponent. The move is similar to Storm Pegasus's Starblast Attack but uses the W105 wing lift platform and higher R2F orbital speed.

### Stage 1 — Stadium Circle Momentum Build (from Case 1861)

R2F orbital speed: v_orbital = **3.264 m/s**. After N = 2 full orbits at r_arena = 0.200 m (stadium inner radius):

```
t_circle = 2 × (2π × r_arena / v_orbital) = 2 × (2π × 0.200 / 3.264) = 2 × 0.385 = 0.770 s

W105 wing lift over t_circle: F_lift × t_circle = 1.049×10⁻² × 0.770 = 8.078×10⁻³ N·s (upward impulse)
v_liftoff_assist = 8.078×10⁻³ / m = 8.078×10⁻³ / 0.0385 = 0.210 m/s  (wing-assisted liftoff v_z)
```

**Total liftoff velocity (orbital tangential converted to vertical + wing assist):**

```
η_liftoff = 0.35  (fraction of orbital KE convertible to vertical at R2F grip release)
v_z_orbital = η_liftoff × v_orbital = 0.35 × 3.264 = 1.142 m/s

v_z_total = v_z_orbital + v_liftoff_assist = 1.142 + 0.210 = 1.352 m/s
```

**Apex height:**

```
h_apex = v_z_total² / (2g) = 1.352² / (2 × 9.81) = 1.828 / 19.62 = 0.0932 m  ≈ 93 mm
```

### Stage 2 — Aerial Crash

**Dive impact velocity:**

```
v_impact = √(v_orbital² + 2g × h_apex)
         = √(3.264² + 2 × 9.81 × 0.0932)
         = √(10.65 + 1.829)
         = √12.48
         = 3.533 m/s
```

**Collision model (high-speed aerial orbital dive, e = 0.80):**

Parameters:
- m_GP = 38.5 g, v_impact = 3.533 m/s
- m_opp = 40 g (representative), v_opp ≈ 0

```
m_eff = (0.0385 × 0.040) / (0.0385 + 0.040) = 1.540×10⁻³ / 0.0785 = 1.962×10⁻² kg

J_booster = m_eff × (1 + e) × v_impact
          = 1.962×10⁻² × 1.80 × 3.533
          = 1.248×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_booster / m_opp = 1.248×10⁻¹ / 0.040 = 3.120 m/s
```

**Effect on Galaxy Pegasus (spin drain):**
```
Δω_GP    = J_booster × r_contact / I_GP = 1.248×10⁻¹ × 0.025 / 3.034×10⁻⁵ = 102.8 rad/s
ω_remain = 680 − 102.8 = 577.2 rad/s  (84.9% retained)
```

---

**[M] BeySpirit amplification:**
Gingka channels Pegasus's full celestial spirit — the stadium circle becomes a spiral galaxy orbit that launches Pegasus as a star-speed projectile.

[M] factor = **8.0 ×**
[M] Δv = 3.120 × 8.0 = **24.96 m/s** (ring-out at star velocity)

> **Note:** Physical values describe W105 wing aerodynamic lift-assisted liftoff, R2F orbital momentum conversion, and aerial dive impulse. [M] values represent Gingka's BeySpirit Pegasus star-launch that transcends orbital mechanics. Combos do not receive [M] amplification.

### TypeScript

```typescript
function starboosterAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Stadium circle: v_orbital = 3.264 m/s; h_apex = 93 mm → v_impact = 3.533 m/s
  // Physical J_booster = 1.248×10⁻¹ N·s; [M] 8.0×
  const J_phys = 0.1248;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Pegasus star velocity)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the W105 Spin Track (Wing 105) combined with an R2F or equivalent high-friction rubber flat driver that produces orbital speed ≥ 3 m/s. The W105 wing lift assist requires the wing blades to be at track height 105 to generate measurable upward impulse during the stadium circle. Standard game instance: Galaxy Pegasus W105R2F (Gingka Hagane, Metal Masters). Without W105 the wing-assisted liftoff component is absent; without R2F the orbital speed needed to convert to sufficient apex height for the full crash impulse is absent.

---

## Case 1863 — COMBO: Orbit Crash — Galaxy Pegasus

**Sequence:** ↑ → A (moveUp · moveRight · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The upward arc (↑) sends Galaxy Pegasus into a high orbital sweep, building momentum at R2F speed (v_orbital = 3.264 m/s × fraction, estimated 2.2 m/s at partial orbit completion). The rightward redirect (→) converts the upward arc tangential velocity into a rightward approach vector — this represents Galaxy Pegasus redirecting its circular path toward the opponent. The attack (A) delivers the orbital strike at the redirected velocity:

```
v_attack_combo = √(v_up² + v_right²) = √(2.2² + 2.2²) / √2 = 2.2 m/s  (resultant diagonal)

Δω = η × m_GP × v_attack_combo × r_contact / I_GP
   = 0.50 × 0.0385 × 2.2 × 0.025 / 3.034×10⁻⁵
   = 0.50 × (2.118×10⁻³) / 3.034×10⁻⁵
   = 0.50 × 69.8
   = +34.9 rad/s  ≈ +35 rad/s
```

(η = 0.50: R2F rubber contact orbital-to-spin momentum reconversion at arc redirect.) The orbital approach angle from two arcs raises the damageMultiplier to **1.35×** from combined directional momentum.

**Parameters:**
- spinGain: +35 rad/s (R2F rubber orbital-to-spin arc redirect reconversion η = 0.50)
- damageMultiplier: 1.35 (combined ↑→ arc approach directional momentum)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function orbitCrashCombo(bey: Beyblade, target: Beyblade): void {
  // R2F rubber arc redirect spin reconversion: Δω ≈ +35 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 35);
  // Combined arc approach: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +35 rad/s (partial) | ✓ |

---

## Case 1864 — GIMMICK(2): Storm Pegasus 105RF — RF Tip Orbital-to-Liftoff Aerodynamic Launch

**Beyblade:** Storm Pegasus 105RF (TT JP: ストームペガシス105RF; Hasbro EN: Storm Pegasus 105RF)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Fusion (BB-28)

> **GIMMICK(1)** — Storm Pegasus orbital vortex, Rankine vortex model, and RF tip orbital mechanics are documented in **Case 1812**. This GIMMICK(2) focuses specifically on the RF tip's orbital-to-liftoff aerodynamic transition that enables Starblast Attack.

### Assembly (reference)

Storm Pegasus 105RF: m = 37.0 g, I_total = 2.783×10⁻⁵ kg·m², ω₀ = 680 rad/s, L₀ = 1.892×10⁻² kg·m²/s (from Case 1812).

---

### RF Tip — Orbital-to-Vertical Liftoff Aerodynamics

At peak orbital speed, the RF (Rubber Flat) tip provides v_orbital = 2.040 m/s (from Case 1812). When Storm Pegasus reaches the stadium wall or receives an upward impact, the orbital velocity vector is redirected vertically.

**Vertical velocity at liftoff (η_launch = 0.30: RF grip-release liftoff efficiency):**

```
v_z = η_launch × v_orbital = 0.30 × 2.040 = 0.612 m/s
```

**Additional vertical velocity from external upward strike (opponent knock-up):**

When the opponent's attack hits Storm Pegasus upward (J_up ≈ 2.0×10⁻² N·s):

```
v_z_strike = J_up / m = 2.0×10⁻² / 0.037 = 0.541 m/s

v_z_total = v_z + v_z_strike = 0.612 + 0.541 = 1.153 m/s  (knock-up assisted liftoff)
```

**Apex height (self-launch only):**

```
h_apex_self = v_z² / (2g) = 0.612² / (2 × 9.81) = 0.3745 / 19.62 = 19.1 mm
```

**Apex height (knock-up assisted):**

```
h_apex_knockup = v_z_total² / (2g) = 1.153² / (2 × 9.81) = 1.329 / 19.62 = 67.8 mm
```

→ Storm Pegasus can initiate Starblast Attack voluntarily (self-launch, h ≈ 19 mm) or via opponent knock-up (h ≈ 68 mm for a harder dive).

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| v_orbital | 2.040 m/s (from Case 1812) |
| η_launch | 0.30 |
| v_z (self) | 0.612 m/s |
| h_apex (self) | 19.1 mm |
| v_z (knock-up) | 1.153 m/s |
| h_apex (knock-up) | 67.8 mm |

---

## Case 1865 — SPECIAL: Starblast Attack / Shooting Star Attack — Gingka Hagane / Storm Pegasus 105RF

**Blader:** Gingka Hagane | **Beyblade:** Storm Pegasus 105RF (also used with Cosmic Pegasus F:D) | **Type:** attack

### Description

Starblast Attack (Shooting Star Attack in Japan) is the first special move used by Gingka Hagane. In the anime it was used with Storm Pegasus 105RF and later with Cosmic Pegasus F:D. In the manga it was used with Pegasis 105F and Storm Pegasis 10Glaive Quick'. Pegasus soars into the sky voluntarily or launched by the opponent's own attack, then crashes directly onto the opponent in a nose dive. This is Gingka's signature move throughout Beyblade Metal Fusion.

### Stage 1 — Liftoff (from Case 1864)

Self-launch: h_apex = **19.1 mm**, v_z = 0.612 m/s.
Knock-up variant: h_apex = **67.8 mm**, v_z = 1.153 m/s.

**Dive impact velocity (self-launch):**

```
v_impact_self = √(v_orbital² + 2g × h_apex_self)
              = √(2.040² + 2 × 9.81 × 0.0191)
              = √(4.162 + 0.375)
              = √4.537
              = 2.130 m/s
```

**Dive impact velocity (knock-up variant):**

```
v_impact_knockup = √(v_orbital² + 2g × h_apex_knockup)
                 = √(2.040² + 2 × 9.81 × 0.0678)
                 = √(4.162 + 1.331)
                 = √5.493
                 = 2.344 m/s
```

### Stage 2 — Nose Dive Crash

**Collision model (nose dive, e = 0.80 — using knock-up variant as primary):**

Parameters:
- m_SP = 37.0 g, v_impact = 2.344 m/s
- m_opp = 38 g, v_opp ≈ 0

```
m_eff = (0.037 × 0.038) / (0.037 + 0.038) = 1.406×10⁻³ / 0.075 = 1.875×10⁻² kg

J_starblast = m_eff × (1 + e) × v_impact
            = 1.875×10⁻² × 1.80 × 2.344
            = 7.901×10⁻² N·s
```

**Self-launch variant (v_impact = 2.130 m/s):**

```
J_starblast_self = 1.875×10⁻² × 1.80 × 2.130 = 7.189×10⁻² N·s
```

**Effect on opponent (knock-up variant):**
```
Δv_opp  = J_starblast / m_opp = 7.901×10⁻² / 0.038 = 2.079 m/s
```

**Effect on Storm Pegasus (spin drain):**
```
Δω_SP    = J_starblast × r_contact / I_SP = 7.901×10⁻² × 0.025 / 2.783×10⁻⁵ = 71.0 rad/s
ω_remain = 680 − 71.0 = 609.0 rad/s  (89.6% retained)
```

---

**[M] BeySpirit amplification:**
Gingka channels Pegasus's blazing star spirit — the dive becomes a shooting star that burns through the opponent with the full force of a falling celestial body.

[M] factor = **7.0 ×**
[M] Δv = 2.079 × 7.0 = **14.6 m/s** (ring-out as shooting star)

> **Note:** Physical values describe RF tip orbital-to-vertical liftoff, self-launch and knock-up variant apex heights, and nose-dive collision impulse. [M] values represent Gingka's BeySpirit shooting-star force that overwhelms normal collision limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function starblastAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Nose dive: h_apex = 67.8 mm (knock-up) → v_impact = 2.344 m/s
  // Physical J_starblast = 7.901×10⁻² N·s; [M] 7.0×
  const J_phys = 0.07901;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (shooting star)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the RF (Rubber Flat) driver or equivalent high-grip rubber flat tip with orbital speed ≥ 1.8 m/s. The liftoff mechanic requires sufficient orbital velocity for the η_launch × v_orbital vertical component to achieve measurable apex height; the knock-up variant is available to any bey that can redirect an upward impact force. Standard game instance: Storm Pegasus 105RF (Gingka Hagane, Metal Fusion). Also compatible: Cosmic Pegasus F:D (Metal Fury — same blader, same move; F:D driver provides comparable orbital velocity). The nose-dive crash impulse depends primarily on v_impact at the liftoff height achieved; higher v_orbital (Galaxy Pegasus R2F in Case 1862) gives a harder version of the same move.

---

## Case 1866 — COMBO: Star Dive — Storm Pegasus

**Sequence:** ↑ A ↓ (moveUp · attack · moveDown)
**Cost:** 15 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The upward arc (↑) initiates the self-launch liftoff — Storm Pegasus redirects orbital momentum vertically (v_z = 0.612 m/s, h_apex = 19.1 mm). The attack (A) at apex fires the nose dive, using self-launch impact velocity (v_impact_self = 2.130 m/s). The downward exit (↓) represents Storm Pegasus driving the landing — RF rubber ground contact at the dive end converts the residual downward velocity back to spin:

```
v_land = √(2g × h_apex_self) = √(2 × 9.81 × 0.0191) = 0.612 m/s  (terminal at apex self-launch)

Δω = η × m_SP × v_land × r_contact / I_SP
   = 0.55 × 0.037 × 0.612 × 0.025 / 2.783×10⁻⁵
   = 0.55 × (5.661×10⁻⁴) / 2.783×10⁻⁵
   = 0.55 × 20.34
   = +11.2 rad/s  ≈ +11 rad/s
```

(η = 0.55: RF rubber landing-impact spin reconversion.) The self-launch nose dive angle (straight vertical: θ = 90°) gives pure downward impulse on the opponent, boosting damageMultiplier to **1.20×** from the added vertical strike vector.

**Parameters:**
- spinGain: +11 rad/s (RF rubber landing-impact spin reconversion η = 0.55)
- damageMultiplier: 1.20 (vertical nose-dive impact vector)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function starDiveCombo(bey: Beyblade, target: Beyblade): void {
  // RF rubber landing spin reconversion: Δω ≈ +11 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 11);
  // Vertical nose dive: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +11 rad/s (partial) | ✓ |



> **Note:** Cases 1867–1873 reserved — CS9 HMS session conflict #8 (CS9 wrote Round Shell MS at 1865–1868 and Samurai Changer MS at 1869–1873 in concurrent sessions; CS15 Cases 1865–1866 overlap with Round Shell MS blocks). Cases 1874–1876 continue from Case 1866 (Star Dive).

---

## Case 1874 — GIMMICK(2): Galaxy Pegasus W105R2F — R2F Warm-Up Friction Increase & Space-Launch Altitude

**Beyblade:** Galaxy Pegasus W105R2F (TT JP: ギャラクシーペガシスW105R2F; Hasbro EN: Galaxy Pegasus W105R2F)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Masters (BB-70)

> **GIMMICK(1)** — W105 wing aerodynamic lift, R2F baseline orbital mechanics, and Starbooster Attack liftoff physics are documented in **Cases 1861–1862**. This GIMMICK(2) focuses on the physical change that enables Stardust Driver: the R2F tip requires arena run-in time before reaching full friction, and only after this warm-up can Galaxy Pegasus achieve the orbit speed needed to launch into space.

### Assembly (reference — from Case 1861)

Galaxy Pegasus W105R2F: m = 38.5 g, I_total = 3.034×10⁻⁵ kg·m², ω₀ = 680 rad/s, L₀ = 2.063×10⁻² kg·m²/s, W105 F_lift = 1.049×10⁻² N.

---

### 1. R2F Warm-Up Friction Increase

The R2F (Rubber Double Flat) tip uses a wide rubber surface. Rubber friction is temperature-dependent: cold rubber is relatively stiff and loses grip energy to elastic hysteresis, while warmed rubber is softer and achieves maximum grip. Gingka's "perfect control" and Gingka mastering the R2F is specifically about giving the tip time to adjust in the arena before reaching full power — the R2F needs continuous arena contact to warm up before it can deliver its maximum orbital velocity.

**Frictional power dissipated in R2F rubber (at ω₀, cold μ):**

```
P_heat = τ_R2F_cold × ω₀ = (μ_cold × m × g × r_R2F) × ω₀
       = (0.80 × 0.0385 × 9.81 × 0.006) × 680
       = 1.817×10⁻³ × 680 = 1.236 W
```

**Warm-up period (4 cold-speed stadium circles):**

```
t_warmup = 4 × (2π × r_arena / v_orbital_cold) = 4 × (2π × 0.200 / 3.264) = 1.538 s

ΔQ_warmup = P_heat × t_warmup = 1.236 × 1.538 = 1.901 J
```

After ΔQ_warmup = 1.9 J of frictional heat input, the R2F rubber reaches operating temperature — friction coefficient rises from μ_cold to μ_warm:

```
μ_R2F_cold = 0.80  (standard, first 1–2 circuits)
μ_R2F_warm = 0.95  (after t_warmup; thermally softened rubber — optimal grip)

Δμ = +0.15  (+18.75% friction gain from thermal warm-up)

v_orbital_warm = μ_warm × ω₀ × r_R2F = 0.95 × 680 × 0.006 = 3.878 m/s
(vs v_orbital_cold = 3.264 m/s — Stardust Driver runs at +18.75% higher orbital speed)
```

→ Starbooster Attack launches before warm-up completes (2 cold circles, μ = 0.80). Stardust Driver waits for full warm-up (4 circles, μ = 0.95) — this is the physical reason for the 4-circle extended spiral.

---

### 2. Extended Warm-Up Spiral — Wing Lift Accumulation

Wing lift accumulated over the full warm-up period (at conservative cold-speed timing):

```
v_z_wing_extended = F_lift_total × t_warmup / m = 1.049×10⁻² × 1.538 / 0.0385 = 0.419 m/s
(vs Starbooster v_z_wing = 0.210 m/s at 2-circle cold spiral)
```

**Mastered liftoff efficiency (warm rubber gives better floor grip → better vertical push):**

```
η_mastered = 0.50  (vs η_standard = 0.35 at Starbooster Attack)

v_z_orbital_warm = η_mastered × v_orbital_warm = 0.50 × 3.878 = 1.939 m/s

v_z_total = v_z_orbital_warm + v_z_wing_extended = 1.939 + 0.419 = 2.358 m/s

h_apex_stardust = v_z_total² / (2g) = 2.358² / (2 × 9.81) = 5.560 / 19.62 = 0.2834 m  ≈ 283 mm
```

### Comparison Summary

| Quantity | Starbooster Attack (Case 1862) | Stardust Driver |
|---------|-------------------------------|-----------------|
| N circles | 2 | 4 |
| t_spiral | 0.770 s | 1.538 s |
| μ_R2F at liftoff | 0.80 (cold) | 0.95 (warm) |
| v_orbital at liftoff | 3.264 m/s | 3.878 m/s |
| v_z_wing | 0.210 m/s | 0.419 m/s |
| η_liftoff | 0.35 | 0.50 |
| v_z_orbital | 1.142 m/s | 1.939 m/s |
| v_z_total | 1.352 m/s | 2.358 m/s |
| h_apex | 93 mm | **283 mm** |

---

## Case 1875 — SPECIAL: Stardust Driver / Star Dust Driver — Gingka Hagane / Galaxy Pegasus W105R2F

**Blader:** Gingka Hagane | **Beyblade:** Galaxy Pegasus W105R2F | **Type:** attack

### Description

Stardust Driver (星塵蹴, Sutādasuto Doraibā) is the second Special Move used by Gingka Hagane and Galaxy Pegasus W105R2F. After gaining perfect control over Galaxy Pegasus's R2F tip — meaning the rubber has been given sufficient arena run-in time to reach full grip — Galaxy Pegasus increases its orbital speed and executes four full stadium circles to build maximum warm-rubber momentum. It then launches into space far higher than Starbooster Attack, and crashes back down with full force. Stardust Driver was developed specifically for opponents who could withstand Starbooster Attack: it defeated Julian Konzern (Gravity Destroyer's Black Excalibur) and Damian Hart (Hades Kerbecs' Hades Gate) when Starbooster Attack proved insufficient.

### Stage 1 — R2F Warm-Up Extended Spiral & Liftoff (from Case 1874)

μ_R2F_warm = 0.95, v_orbital_warm = 3.878 m/s, v_z_total = 2.358 m/s, h_apex = **283 mm**.

### Stage 2 — Space-Altitude Crash

**Dive impact velocity:**

```
v_impact = √(v_orbital_warm² + 2g × h_apex)
         = √(3.878² + 2 × 9.81 × 0.2834)
         = √(15.039 + 5.560)
         = √20.599
         = 4.539 m/s
```

**Collision model (warm-rubber full-speed space dive, e = 0.80):**

Parameters:
- m_GP = 38.5 g, v_impact = 4.539 m/s
- m_opp = 40 g, v_opp ≈ 0

```
m_eff = (0.0385 × 0.040) / (0.0385 + 0.040) = 1.540×10⁻³ / 0.0785 = 1.962×10⁻² kg

J_stardust = m_eff × (1 + e) × v_impact
           = 1.962×10⁻² × 1.80 × 4.539
           = 1.602×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_stardust / m_opp = 1.602×10⁻¹ / 0.040 = 4.005 m/s
(vs Starbooster Δv = 3.120 m/s — Stardust Driver is 28.4% stronger at physical level)
```

**Effect on Galaxy Pegasus (spin drain):**
```
Δω_GP    = J_stardust × r_contact / I_GP = 1.602×10⁻¹ × 0.025 / 3.034×10⁻⁵ = 132.0 rad/s
ω_remain = 680 − 132.0 = 548.0 rad/s  (80.6% retained)
```

---

**[M] BeySpirit amplification:**
Gingka's fully mastered spirit drives Galaxy Pegasus beyond the atmosphere — it returns as a genuine falling star with interstellar impact force.

[M] factor = **9.0 ×**
[M] Δv = 4.005 × 9.0 = **36.0 m/s** (star-speed ring-out)

> **Note:** Physical values describe R2F rubber warm-up friction gain (μ: 0.80→0.95, ΔQ = 1.901 J), doubled wing-lift accumulation over 4-circuit warm-up, warm orbital speed 3.878 m/s, and space-altitude dive impulse at h = 283 mm. [M] values represent Gingka's fully mastered Pegasus star spirit that transcends all orbital limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stardustDriverSpecial(bey: Beyblade, target: Beyblade): void {
  // R2F warm-up: μ→0.95, 4 circles, η_mastered=0.50 → h_apex=283mm → v_impact=4.539 m/s
  // Physical J_stardust = 1.602×10⁻¹ N·s; [M] 9.0×
  const J_phys = 0.1602;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 9.0; // [M] BeySpirit 9.0× (star-speed warm-rubber mastered crash)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the W105 Spin Track and R2F driver where the blader can allow the rubber tip sufficient arena run-in time to reach warm-grip state (t_warmup ≥ 1.538 s, ΔQ ≥ 1.9 J). The move requires the full 4-circuit warm-up spiral to reach μ_R2F_warm = 0.95; attempting it cold (Starbooster Attack) delivers only μ = 0.80 and h_apex = 93 mm. Standard game instance: Galaxy Pegasus W105R2F (Gingka Hagane, Metal Masters). This is an evolution of Starbooster Attack (Case 1862) — the same physical frame, but executed only after full R2F warm-up.

---

## Case 1876 — COMBO: Dust Rush — Galaxy Pegasus

**Sequence:** E ↑ A (dodge · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The dodge (E) represents Galaxy Pegasus pulling into a tighter inner arc using cold-R2F grip (no warm-up in combo context — quick attack sequence): v_orbital = μ_cold × ω₀ × r = 3.264 m/s. The moveUp (↑) initiates a partial liftoff at η_combo = 0.25 (50% of Stardust's full η_mastered = 0.50):

```
v_z_combo = η_combo × v_orbital_cold = 0.25 × 3.264 = 0.816 m/s
h_combo   = v_z_combo² / (2g) = 0.816² / (2 × 9.81) = 0.6660 / 19.62 = 33.9 mm
```

The attack (A) fires the partial aerial dive at the end of the arc:

```
v_impact_combo = √(v_orbital_cold² + 2g × h_combo)
               = √(3.264² + 2 × 9.81 × 0.0339)
               = √(10.653 + 0.665)
               = √11.318
               = 3.364 m/s

Δω = η_land × m_GP × v_impact_combo × r_contact / I_GP
   = 0.30 × 0.0385 × 3.364 × 0.025 / 3.034×10⁻⁵
   = 0.30 × (3.237×10⁻³) / 3.034×10⁻⁵
   = 0.30 × 106.7
   = +32.0 rad/s  ≈ +32 rad/s
```

(η_land = 0.30: cold-R2F rubber re-contact at partial-height landing. Cold tip used since no warm-up in combo timeframe.) The partial cold-launch liftoff at 33.9 mm gives damageMultiplier **1.25×**.

**Parameters:**
- spinGain: +32 rad/s (cold R2F rubber landing reconversion η_land = 0.30, h_combo = 33.9 mm)
- damageMultiplier: 1.25 (partial cold liftoff aerial orbital strike)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function dustRushCombo(bey: Beyblade, target: Beyblade): void {
  // Cold R2F partial liftoff landing reconversion: Δω ≈ +32 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 32);
  // Partial cold aerial dive: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +32 rad/s (partial) | ✓ |



---

## Case 1877 — GIMMICK: Grand Capricorn 145D — Horn Tip Contact Pressure & Red Tornado Vortex

**Beyblade:** Grand Capricorn 145D (TT JP: グランドカプリコーンD; Hasbro EN: Grand Capricorn 145D)
**Blader:** Klaus | **Series:** Beyblade: Metal Masters (BB-73)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Grand | 35.0 | 31.0 |
| Energy Ring | Capricorn | 4.0 | 24.0 |
| Spin Track | 145 | 1.5 | 6.0 |
| Performance Tip | D (Defense) | 1.0 | 5.0 |
| **Total** | | **41.5** | |

**I_total** = 35.0×10⁻³ × 0.031² + 4.0×10⁻³ × 0.024² + 1.5×10⁻³ × 0.006² + 1.0×10⁻³ × 0.005²
           = 3.364×10⁻⁵ + 2.304×10⁻⁶ + 5.4×10⁻⁸ + 2.5×10⁻⁸
           = **3.602×10⁻⁵ kg·m²**

ω₀ = 680 rad/s (standard MFB Metal Masters launch)
L₀ = I × ω₀ = 3.602×10⁻⁵ × 680 = **2.449×10⁻² kg·m²/s**

---

### 1. Grand AR — Horn Tip Velocity & Near-Yield Contact Pressure

The Grand Fusion Wheel's two large curved horn protrusions extend to r_AR = 31 mm. At ω₀ the horn tips sweep at:

```
v_horn_tip = ω₀ × r_AR = 680 × 0.031 = 21.08 m/s
```

**Horn tip contact stress (during direct strike):**

The horn section constitutes approximately 10% of the AR mass:

```
m_horn = 0.10 × m_AR = 0.10 × 35.0×10⁻³ = 3.5×10⁻³ kg

Contact duration (horn width w_horn = 4 mm sweeping at v_tip):
Δt_horn = w_horn / v_tip = 4×10⁻³ / 21.08 = 1.897×10⁻⁴ s

Impact impulse (e_horn = 0.60 — stiff ABS horn):
J_horn = m_horn × (1 + e_horn) × v_tip = 3.5×10⁻³ × 1.60 × 21.08 = 0.1181 N·s

Peak contact force:
F_horn_peak = J_horn / Δt_horn = 0.1181 / 1.897×10⁻⁴ = 622.6 N

Horn tip contact area:
A_horn = 4×10⁻³ × 3×10⁻³ = 1.2×10⁻⁵ m²

Contact stress:
P_horn = F_horn_peak / A_horn = 622.6 / 1.2×10⁻⁵ = 51.9 MPa
(ABS yield strength σ_y ≈ 55 MPa → P / σ_y = 0.94× — near-yield, "seemingly metallic" feel)
```

→ Grand Capricorn's horn tips apply sub-yield elastic contact stress that feels metallic — the horn doesn't pierce (unlike Falborg 2 at 5.03× yield, Case 1821) but creates high-energy elastic deformation on the opponent's AR surface.

---

### 2. Red Tornado Vortex (Rankine Model)

The spinning horn profile generates a broad vortex wake at radius r_AR. Using the Rankine circulation model:

```
Γ_bey = 2π × v_horn_tip × r_AR = 2π × 21.08 × 0.031 = 4.108 m²/s

At opponent position r_opp = 45 mm from centre:
v_vortex = Γ_bey / (2π × r_opp) = 4.108 / (2π × 0.045) = 14.54 m/s

Dynamic pressure at r_opp:
q_vortex = ½ × ρ_air × v_vortex² = ½ × 1.225 × 14.54² = 129.4 Pa
```

**Radial suction force on opponent (inward, toward Grand Capricorn):**

```
A_opp = π × r_opp_cross² = π × 0.020² = 1.257×10⁻³ m²
F_vortex = q_vortex × A_opp = 129.4 × 1.257×10⁻³ = 0.1627 N  (inward suction)
```

→ This is the "red tornado" — a sustained inward suction force that gradually draws opponents toward Grand Capricorn's horn strike range.

---

### 3. D Tip — Wide Defense Gyroscopic Platform

The Defense tip provides a wide plastic contact base (r_D = 5 mm, μ_D = 0.15) with low friction:

```
τ_D    = μ_D × m × g × r_D = 0.15 × 0.0415 × 9.81 × 0.005 = 3.053×10⁻⁴ N·m
t_spin = L₀ / τ_D = 2.449×10⁻² / 3.053×10⁻⁴ = 80.2 s

v_D_orbital = μ_D × ω₀ × r_D = 0.15 × 680 × 0.005 = 0.510 m/s  (slow, stable patrol orbit)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.5 g |
| I_total | 3.602×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| L₀ | 2.449×10⁻² kg·m²/s |
| v_horn_tip | 21.08 m/s |
| P_horn | 51.9 MPa (0.94× ABS yield) |
| Γ_bey | 4.108 m²/s |
| v_vortex (r=45 mm) | 14.54 m/s |
| q_vortex | 129.4 Pa |
| F_vortex (suction) | 0.1627 N |
| τ_D | 3.053×10⁻⁴ N·m |
| t_spin | 80.2 s |

---

## Case 1878 — SPECIAL: Steel Darkness / Eisenschwarz — Klaus / Grand Capricorn 145D

**Blader:** Klaus | **Beyblade:** Grand Capricorn 145D | **Type:** attack

### Description

Steel Darkness (Eisenschwarz, アイゼンシュヴァルツ) is the second Special Move used by Klaus and Grand Capricorn 145D. Capricorn jerks its head forward in order to bend its seemingly metallic horns so that the sharp ends point forward, then rams into the opponent while covered in a red tornado. The red tornado shrouds Grand Capricorn and creates a sustained suction vortex that draws the opponent inward before the horn strike is delivered at point-blank range.

### Stage 1 — Red Tornado Suction Draw (from Case 1877)

F_vortex = 0.1627 N (inward). Opponent drawn from r = 45 mm to horn contact at r = 31 mm (Δr = 14 mm):

```
W_suction = F_vortex × Δr = 0.1627 × 0.014 = 2.278×10⁻³ J

v_approach = √(2 × W_suction / m_opp) = √(2 × 2.278×10⁻³ / 0.038) = √(0.1199) = 0.346 m/s
```

### Stage 2 — Horn Ram at Point-Blank Range

Grand Capricorn's D-tip orbital velocity and the opponent's suction-driven approach combine at contact:

```
v_rel = v_D_orbital + v_approach = 0.510 + 0.346 = 0.856 m/s
```

**Collision model (horn tip strike, e = 0.75):**

Parameters:
- m_GC = 41.5 g, v_GC = 0.510 m/s
- m_opp = 38 g, v_opp = −0.346 m/s (approaching)

```
m_eff = (0.0415 × 0.038) / (0.0415 + 0.038) = 1.577×10⁻³ / 0.0795 = 1.983×10⁻² kg

J_steel = m_eff × (1 + e) × v_rel = 1.983×10⁻² × 1.75 × 0.856 = 2.970×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_steel / m_opp = 2.970×10⁻² / 0.038 = 0.782 m/s
```

**Effect on Grand Capricorn (spin drain — minimal; D tip absorbs recoil):**
```
Δω_GC    = J_steel × r_contact / I_GC = 2.970×10⁻² × 0.025 / 3.602×10⁻⁵ = 20.6 rad/s
ω_remain = 680 − 20.6 = 659.4 rad/s  (97.0% retained)
```

---

**[M] BeySpirit amplification:**
Klaus channels the iron darkness of Capricorn's bull spirit — the horns physically reshape under BeySpirit force (angular→linear momentum redirection: Δv_kick = m_horn × v_tip / m_total = 3.5×10⁻³ × 21.08 / 0.0415 = 1.78 m/s) and the tornado becomes a true steel vortex that tears through anything in its path.

[M] factor = **7.0 ×**
[M] Δv = 0.782 × 7.0 = **5.5 m/s** (ring-out, steel darkness ring-out)

> **Note:** Physical values describe red tornado vortex suction draw, combined D-orbital + suction-approach relative velocity, and near-yield horn tip contact mechanics. [M] values represent Klaus's BeySpirit horn reorientation (angular momentum converted to linear kick, 1.78 m/s boost) amplified by the iron bull darkness spirit. Combos do not receive [M] amplification.

### TypeScript

```typescript
function steelDarknessSpecial(bey: Beyblade, target: Beyblade): void {
  // Red tornado suction: F=0.1627 N, draws opponent 14mm → v_approach=0.346 m/s
  // Horn ram v_rel=0.856 m/s, J_steel=2.970×10⁻² N·s; [M] 7.0×
  const J_phys = 0.02970;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Stage 1: suction pull toward bey
  applyForce(target.id, -(dx / dist) * 0.1627, -(dy / dist) * 0.1627);
  // Stage 2: horn ram — [M] 7.0×
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (iron darkness horn snap)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Grand Fusion Wheel (or equivalent large-diameter defense wheel with prominent horn protrusions at r ≥ 28 mm) combined with a D (Defense) or equivalent low-friction wide-base tip for stable patrol orbit during vortex formation. The red tornado requires horn tip velocity v_tip ≥ 18 m/s to generate sufficient Rankine circulation for inward suction. Standard game instance: Grand Capricorn 145D (Klaus, Metal Masters).

---

## Case 1879 — COMBO: Iron Ram — Grand Capricorn

**Sequence:** K E K (defense · dodge · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Klaus

### Physics Justification

The first defense stance (K) activates Grand Capricorn's vortex field for a partial dwell window (t_suction = 0.10 s), drawing the opponent inward:

```
J_suction_partial = F_vortex × t_suction = 0.1627 × 0.10 = 1.627×10⁻² N·s

v_approach_partial = J_suction_partial / m_opp = 1.627×10⁻² / 0.038 = 0.428 m/s  (opponent pulled in)
```

The dodge (E) represents Grand Capricorn's short angular pivot — the D tip steps into the opponent's closing path, converting the combined approach velocity to a point-blank contact:

```
v_contact = v_D_orbital + v_approach_partial = 0.510 + 0.428 = 0.938 m/s
```

The second defense stance (K) is the D-tip ground re-contact after the brief pivot, reconverting the rebound force back to spin:

```
Δω = η × m_GC × v_contact × r_contact / I_GC
   = 0.50 × 0.0415 × 0.938 × 0.025 / 3.602×10⁻⁵
   = 0.50 × (9.732×10⁻⁴) / 3.602×10⁻⁵
   = 0.50 × 27.01
   = +13.5 rad/s  ≈ +14 rad/s
```

(η = 0.50: D tip wide-contact spin reconversion after partial vortex ram pivot.) The vortex-assisted approach with horn contact gives damageMultiplier **1.20×**. lockMs = 150 represents the suction dwell window during the K stance.

**Parameters:**
- spinGain: +14 rad/s (D tip rebound spin reconversion η = 0.50)
- damageMultiplier: 1.20 (vortex-assisted approach point-blank horn contact)
- lockMs: 150 (suction vortex dwell during K₁ defense stance)

### TypeScript

```typescript
function ironRamCombo(bey: Beyblade, target: Beyblade): void {
  // D tip rebound reconversion: Δω ≈ +14 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 14);
  // Vortex-assisted approach: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 150: suction vortex dwell
  bey.lockMs = 150;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +14 rad/s (partial) | ✓ |



---

## Case 1880 — GIMMICK: Dragoon Storm — Upper Dragoon Blade Lift & Vertical Vortex Column

**Beyblade:** Dragoon Storm (TT JP: ドラグーンストーム; Hasbro EN: Dragoon Storm)
**Blader:** Tyson Granger | **Series:** Beyblade (Bakuten Shoot, Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Upper Dragoon (4-blade) | 14.0 | 32.0 |
| Weight Disk | 10 Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | SG Sharp | 2.0 | 3.0 |
| **Total** | | **37.5** | |

(Bit Chip Dragoon ~1 g at r ≈ 0 excluded per convention.)

**I_total** = 14.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.434×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 1.8×10⁻⁸
           = **3.657×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (standard plastic-gen Bakuten Shoot launch)
L₀ = I × ω₀ = 3.657×10⁻⁵ × 700 = **2.560×10⁻² kg·m²/s**

---

### 1. Upper Dragoon AR — Four-Blade Upward Lift & Vortex Column Formation

The Upper Dragoon Attack Ring carries four upward-angled blades. As Dragoon spins, these blades act as rotor elements — generating upward aerodynamic lift (like helicopter rotor blades) and driving a vertical vortex column (landspout) above the stadium.

**Blade tip velocity:**

```
v_blade = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s
```

**Aerodynamic lift per blade (upward-angled, C_L = 0.65):**

```
A_blade = 4×10⁻³ × 15×10⁻³ = 6.0×10⁻⁵ m²  (single blade area)

F_lift_blade = ½ × ρ_air × C_L × A_blade × v_blade²
             = ½ × 1.225 × 0.65 × 6.0×10⁻⁵ × 22.40²
             = 1.199×10⁻² N

F_lift_total (4 blades) = 4 × 1.199×10⁻² = 4.796×10⁻² N

W = m × g = 0.0375 × 9.81 = 0.368 N

Lift / Weight = 4.796×10⁻² / 0.368 = 13.0%  (measurable rotor effect; BeySpirit for full vortex)
```

**Vertical vortex column (Rankine circulation model):**

```
Γ_vortex = 2π × v_blade × r_AR = 2π × 22.40 × 0.032 = 4.500 m²/s

At r_opp = 50 mm from centre:
v_column = Γ_vortex / (2π × r_opp) = 4.500 / (2π × 0.050) = 14.32 m/s  (tangential wind speed)

q_column = ½ × ρ_air × v_column² = ½ × 1.225 × 14.32² = 125.8 Pa
```

**Upward ejection force on opponent:**

```
A_opp = π × 0.020² = 1.257×10⁻³ m²
F_eject = q_column × A_opp = 125.8 × 1.257×10⁻³ = 0.1582 N  (upward)
```

**Defensive barrier force** (opposing any bey moving radially through the vortex column):

```
F_barrier = F_eject = 0.1582 N  (opposes inward approach at the vortex wall)
```

→ The vortex column simultaneously ejects opponents upward AND presents a radial pressure barrier against incoming attacks.

---

### 2. SG Sharp BB — Stationary Vortex Platform

The Sharp Blade Base contacts the arena at a single point (r_sharp = 3 mm, μ_sharp = 0.08). This allows Dragoon to sustain a nearly stationary spin for the duration of Storm Attack:

```
τ_sharp = μ × m × g × r_sharp = 0.08 × 0.0375 × 9.81 × 0.003 = 8.831×10⁻⁵ N·m
t_spin   = L₀ / τ_sharp = 2.560×10⁻² / 8.831×10⁻⁵ = 290.1 s
```

→ The sharp tip provides near-frictionless ground contact, allowing Dragoon to remain stationary in the stadium centre while the Upper Dragoon AR generates the vortex column. This is the physical mechanism behind Storm Attack's "decreases mobility" effect.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.5 g |
| I_total | 3.657×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.560×10⁻² kg·m²/s |
| v_blade | 22.40 m/s |
| F_lift_total | 4.796×10⁻² N |
| Lift / Weight | 13.0% |
| Γ_vortex | 4.500 m²/s |
| v_column (r=50 mm) | 14.32 m/s |
| q_column | 125.8 Pa |
| F_eject / F_barrier | 0.1582 N |
| τ_sharp | 8.831×10⁻⁵ N·m |
| t_spin | 290.1 s |

---

## Case 1881 — SPECIAL: Storm Attack — Tyson Granger / Dragoon Storm

**Blader:** Tyson Granger | **Beyblade:** Dragoon Storm | **Type:** defense

### Description

Storm Attack is a Special Move used by Tyson Granger and Dragoon Storm. Dragoon generates a rapidly rotating column of air — a tornado similar to a landspout — using the four upward-angled blades of the Upper Dragoon AR at high-speed rotation. The vortex column forms a defensive barrier between Dragoon and the enemy Beyblade, repelling incoming attacks. In most instances the column then ejects opponents skyward. This action usually decreases the mobility of Dragoon (even becoming stationary) while Storm Attack is in effect, as all rotational energy is directed into the vortex. The move occurs together with the emergence of the Bit-Beast Dragoon. It was used in both the manga and anime.

### Stage 1 — Vortex Barrier (Defensive Interception)

When an opponent approaches through the vortex column, F_barrier = 0.1582 N opposes their movement over the vortex wall depth Δr_wall = 20 mm:

```
W_absorbed = F_barrier × Δr_wall = 0.1582 × 0.020 = 3.164×10⁻³ J

v_attack_post = √(v_attack² − 2 × W_absorbed / m_opp)
              = √(2.0² − 2 × 3.164×10⁻³ / 0.038)
              = √(4.000 − 0.1665)
              = √3.834 = 1.958 m/s  (attack speed reduced by 2.1% at vortex wall)
```

→ The barrier effect is modest at physical level; BeySpirit amplifies it to a full deflection.

### Stage 2 — Upward Ejection

The vortex column sustains F_eject = 0.1582 N upward on the opponent for t_vortex = 0.5 s:

```
J_eject = F_eject × t_vortex = 0.1582 × 0.5 = 7.910×10⁻² N·s

Δv_opp_up = J_eject / m_opp = 7.910×10⁻² / 0.038 = 2.082 m/s  (upward ring-out)
```

**Effect on Dragoon Storm (spin drain — sustained vortex):**
```
Δω_DS    = J_eject × r_contact / I_DS = 7.910×10⁻² × 0.025 / 3.657×10⁻⁵ = 54.1 rad/s
ω_remain = 700 − 54.1 = 645.9 rad/s  (92.3% retained)
```

---

**[M] BeySpirit amplification:**
Dragoon's beast materialises fully from the Bit Chip, transforming the physical vortex into a true elemental storm. The tornado column expands to fill the entire stadium, ejecting everything in its path.

[M] factor = **8.0 ×**
[M] Δv = 2.082 × 8.0 = **16.7 m/s** (full-stadium storm ejection)

> **Note:** Physical values describe Upper Dragoon four-blade rotor lift, Rankine vortex column ejection at F = 0.1582 N over 0.5 s, and 2.1% barrier attenuation of incoming attack. [M] values represent Dragoon's full BeySpirit materialisation that amplifies the vortex to elemental storm scale. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stormAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Vortex column: F_eject=0.1582 N × 0.5s → J_eject=7.910×10⁻² N·s upward; [M] 8.0×
  const J_phys = 0.07910;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Barrier: partial opposing force on incoming target
  applyForce(target.id, (dx / dist) * -0.1582, (dy / dist) * -0.1582);
  // Vortex ejection — [M] 8.0×
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Dragoon full storm materialisation)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using an Attack Ring with 4+ upward-angled blade protrusions (C_L ≥ 0.50, v_blade ≥ 20 m/s) combined with a Sharp or Metal Sharp Blade Base that enables near-stationary spin. The vortex column requires the bey to remain stationary (or near-stationary) while generating circulation — any high-orbital-speed tip would dissipate the column. Standard game instance: Dragoon Storm (Tyson Granger, Bakuten Shoot plastic generation).

---

## Case 1882 — COMBO: Tornado Guard — Dragoon Storm

**Sequence:** K ↑ K (defense · moveUp · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Tyson Granger

### Physics Justification

The first defense stance (K) locks Dragoon on its sharp tip (near-stationary), initiating the vortex column for a partial window (t_partial = 0.15 s):

```
J_eject_partial = F_eject × t_partial = 0.1582 × 0.15 = 2.373×10⁻² N·s
```

The moveUp (↑) represents a partial orbital arc away from the opponent — Dragoon briefly shifts position in the stadium, redirecting the vortex column exit direction while the vortex energy accumulates. The second defense stance (K) returns Dragoon to stationary, releasing the accumulated partial vortex as a directed upward blast, while the sharp tip re-contact reconverts the reaction force to spin:

```
Δω = η × J_eject_partial × r_contact / I_DS
   = 0.60 × 2.373×10⁻² × 0.025 / 3.657×10⁻⁵
   = 0.60 × (5.933×10⁻⁴) / 3.657×10⁻⁵
   = 0.60 × 16.22
   = +9.7 rad/s  ≈ +10 rad/s
```

(η = 0.60: sharp tip point-contact vortex counter-reaction spin reconversion.) The directed partial vortex blast gives damageMultiplier **1.20×**. lockMs = 250 represents the stationary vortex column dwell spanning K₁ and ↑ inputs.

**Parameters:**
- spinGain: +10 rad/s (sharp tip vortex counter-reaction reconversion η = 0.60)
- damageMultiplier: 1.20 (directed partial vortex upward blast)
- lockMs: 250 (stationary column dwell K₁ + ↑ phase)

### TypeScript

```typescript
function tornadoGuardCombo(bey: Beyblade, target: Beyblade): void {
  // Sharp tip vortex counter-reaction reconversion: Δω ≈ +10 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 10);
  // Directed partial vortex blast: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 250: stationary column dwell
  bey.lockMs = 250;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 250 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +10 rad/s (partial) | ✓ |



---

## Case 1883 — GIMMICK: Flash Leopard — Aerodynamic Drag Heating & Hot Wind Vortex

**Beyblade:** Flash Leopard (TT JP: フラッシュレオパルド; Hasbro EN: Flash Leopard)
**Blader:** Ozuma | **Series:** Beyblade (Bakuten Shoot V-Force, Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Flash Leopard (4-blade) | 14.0 | 32.0 |
| Weight Disk | 10 Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | SG Flat | 2.5 | 5.0 |
| **Total** | | **38.0** | |

(Bit Chip ~1 g at r ≈ 0 excluded per convention.)

**I_total** = 14.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.5×10⁻³ × 0.005²
           = 1.434×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 6.25×10⁻⁸
           = **3.680×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (standard plastic-gen Bakuten Shoot launch)
L₀ = I × ω₀ = 3.680×10⁻⁵ × 700 = **2.576×10⁻² kg·m²/s**

---

### 1. Flash Leopard AR — Aerodynamic Drag Dissipation (Primary Heat Source)

The Flash Leopard Attack Ring carries four angular blade protrusions. At high-speed rotation these blades sweep through air at v_tip; skin-friction and pressure drag on each blade are almost entirely dissipated as thermal energy in the ABS plastic — heating the AR from within, causing the surrounding air to circulate as a hot wind vortex.

**Blade tip velocity:**

```
v_tip = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s
```

**Aerodynamic drag on 4 blades (C_D = 1.2, A_blade = 4×10⁻³ × 15×10⁻³ = 6.0×10⁻⁵ m²):**

```
F_drag = ½ × ρ_air × C_D × n_blades × A_blade × v_tip²
       = ½ × 1.225 × 1.2 × 4 × 6.0×10⁻⁵ × 22.40²
       = ½ × 1.225 × 1.2 × 2.4×10⁻⁴ × 501.76
       = 0.08851 N

P_aero = F_drag × v_tip = 0.08851 × 22.40 = 1.983 W  (dissipated as heat into AR)
```

---

### 2. SG Flat BB — Frictional Heat Generation & Orbital Speed

The Flat Blade Base contacts the arena over a wide surface (r_flat = 5 mm, μ_flat = 0.15), driving orbital motion and adding a secondary heat source:

```
τ_flat = μ × m × g × r_flat = 0.15 × 0.038 × 9.81 × 0.005 = 2.796×10⁻⁴ N·m
P_fric = τ_flat × ω₀ = 2.796×10⁻⁴ × 700 = 0.1957 W
t_spin = L₀ / τ_flat = 2.576×10⁻² / 2.796×10⁻⁴ = 92.1 s
v_orbital = μ × ω₀ × r_flat = 0.15 × 700 × 0.005 = 0.5250 m/s
```

**Total heat generation rate:**

```
P_heat = P_aero + P_fric = 1.983 + 0.1957 = 2.179 W
```

**AR temperature rise over t_buildup = 5 s (Sacred Fire activation window):**

```
Q_heat  = P_heat × t_buildup = 2.179 × 5 = 10.89 J
ΔT_AR   = Q_heat / (m_AR × c_ABS) = 10.89 / (0.014 × 1400) = 0.556 K
(physical; ABS ignition ≈ 370°C; BeySpirit amplifies to true fire temperature)
```

---

### 3. Hot Wind Vortex (Rankine Model)

The spinning Flash Leopard AR drives a Rankine vortex of heated air:

```
Γ_vortex = 2π × v_tip × r_AR = 2π × 22.40 × 0.032 = 4.500 m²/s

At r_opp = 50 mm from centre:
v_wind   = Γ_vortex / (2π × r_opp) = 4.500 / (2π × 0.050) = 14.32 m/s

q_wind   = ½ × ρ_air × v_wind² = ½ × 1.225 × 14.32² = 125.7 Pa

A_opp    = π × 0.020² = 1.257×10⁻³ m²
F_wind   = q_wind × A_opp = 125.7 × 1.257×10⁻³ = 0.1580 N  (radially outward — hot wind repulsion)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 38.0 g |
| I_total | 3.680×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.576×10⁻² kg·m²/s |
| v_tip | 22.40 m/s |
| P_aero | 1.983 W |
| P_fric | 0.1957 W |
| P_heat | 2.179 W |
| ΔT_AR (5 s) | 0.556 K |
| Γ_vortex | 4.500 m²/s |
| v_wind (r=50 mm) | 14.32 m/s |
| q_wind | 125.7 Pa |
| F_wind | 0.1580 N |
| τ_flat | 2.796×10⁻⁴ N·m |
| t_spin | 92.1 s |
| v_orbital | 0.5250 m/s |

---

## Case 1884 — SPECIAL: Sacred Fire — Ozuma / Flash Leopard

**Blader:** Ozuma | **Beyblade:** Flash Leopard | **Type:** attack

### Description

Sacred Fire is a Special Move used by Ozuma and his Flash Leopard. The beyblade heats up — driven by aerodynamic drag dissipation across the Flash Leopard AR blades (P_aero = 1.983 W) — causing hot winds to blow from the Rankine vortex. Upon contact the thermally-primed AR can melt the opponent's beyblade plastics. The hot wind vortex acts as both a repulsion field that pushes opponents outward and a thermal transfer medium, while the heated AR delivers a direct fire contact on impact.

### Stage 1 — Hot Wind Vortex Blast

Flash Leopard's vortex exerts F_wind = 0.1580 N outward on the opponent for t_blast = 0.5 s:

```
J_wind      = F_wind × t_blast = 0.1580 × 0.5 = 7.900×10⁻² N·s

Δv_opp_wind = J_wind / m_opp = 7.900×10⁻² / 0.038 = 2.079 m/s  (outward repulsion)
```

### Stage 2 — Heated AR Flat-Base Contact

Flash Leopard's SG Flat drives orbital approach at v_orbital = 0.5250 m/s. Thermally-primed AR contacts opponent (e = 0.65 — ABS-on-ABS with thermal softening factor):

```
m_eff = (0.038 × 0.038) / (0.038 + 0.038) = 1.444×10⁻³ / 0.076 = 1.900×10⁻² kg

J_sacred = m_eff × (1 + e) × v_orbital
         = 1.900×10⁻² × 1.65 × 0.5250
         = 1.646×10⁻² N·s

Δv_opp_contact = J_sacred / m_opp = 1.646×10⁻² / 0.038 = 0.433 m/s
```

**Total physical Δv on opponent:**

```
Δv_total = Δv_wind + Δv_contact = 2.079 + 0.433 = 2.512 m/s
```

**Effect on Flash Leopard (spin drain — flat tip orbital strike):**

```
Δω_FL    = J_sacred × r_contact / I_FL = 1.646×10⁻² × 0.025 / 3.680×10⁻⁵ = 11.2 rad/s
ω_remain = 700 − 11.2 = 688.8 rad/s  (98.4% retained)
```

---

**[M] BeySpirit amplification:**
Ozuma's Leopard spirit materialises from the Bit Chip, transmuting the modest 0.556 K physical heat rise into true elemental sacred fire — the AR ignites with plasma-level temperature and the hot wind vortex becomes a real fire storm.

[M] factor = **7.0 ×**
[M] Δv = 2.079 × 7.0 = **14.6 m/s** (sacred fire plasma ring-out)

> **Note:** Physical values describe aerodynamic drag heating (P_aero = 1.983 W, P_heat = 2.179 W total, ΔT_AR = 0.556 K over 5 s), hot wind vortex ejection at F = 0.1580 N over 0.5 s (J_wind = 7.900×10⁻² N·s, Δv_wind = 2.079 m/s), and flat-base orbital contact impulse (J = 1.646×10⁻² N·s, Δv_total = 2.512 m/s). [M] values represent Ozuma's Leopard BeySpirit transmuting aerodynamic heat into sacred fire plasma. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sacredFireSpecial(bey: Beyblade, target: Beyblade): void {
  // P_aero=1.983W→AR heating; hot wind vortex J_wind=7.900×10⁻²N·s; AR contact J=1.646×10⁻²N·s; [M] 7.0×
  const J_wind = 0.07900;
  const J_contact = 0.01646;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Stage 1: heated AR flat-base contact (physical)
  applyForce(target.id, (dx / dist) * J_contact, (dy / dist) * J_contact);
  // Stage 2: sacred fire plasma blast — [M] 7.0×
  const amplified = J_wind * 7.0; // [M] BeySpirit 7.0× (Ozuma Leopard sacred fire plasma)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using an Attack Ring with 4+ angular blade protrusions generating sufficient aerodynamic drag (P_aero ≥ 1.5 W at ω₀ ≥ 680 rad/s) combined with a Flat or Semi-Flat Blade Base (μ ≥ 0.12, r_tip ≥ 4 mm) that sustains continuous frictional heat generation and orbital movement. The hot wind vortex requires ongoing orbital motion to continuously refresh the Rankine circulation — a stationary bey dissipates the vortex. Standard game instance: Flash Leopard (Ozuma, Bakuten Shoot V-Force plastic generation).

---

## Case 1885 — COMBO: Ember Strike — Flash Leopard

**Sequence:** A K A (attack · defense · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Ozuma

### Physics Justification

The first attack (A) is an initial orbital contact at v_orbital = 0.5250 m/s, delivering the first flat-base impulse:

```
J_contact_1 = m_eff × (1 + e) × v_orbital = 1.900×10⁻² × 1.65 × 0.5250 = 1.646×10⁻² N·s
```

The defense stance (K) represents Flash Leopard pausing near the opponent, allowing the heated AR to dwell at maximum thermal output (t_lock = 150 ms):

```
ΔQ_lock  = P_heat × t_lock = 2.179 × 0.150 = 0.327 J
ΔT_lock  = 0.327 / (0.014 × 1400) = 0.0167 K  (physical AR pre-heating increment)
```

The second attack (A) re-engages with the thermally-primed AR at the same orbital speed. The flat base elastic rebound from the first contact reconverts partial impulse to spin:

```
Δω = η × (J_contact_1 + J_contact_2) × r_contact / I_FL
   = 0.40 × 2 × 1.646×10⁻² × 0.025 / 3.680×10⁻⁵
   = 0.40 × 3.292×10⁻² × 0.025 / 3.680×10⁻⁵
   = 0.40 × 8.230×10⁻⁴ / 3.680×10⁻⁵
   = 0.40 × 22.36
   = +8.94 rad/s  ≈ +9 rad/s
```

(η = 0.40: SG Flat elastic rebound reconversion over two-contact sequence.) The double orbital strike with thermal dwell gives damageMultiplier **1.20×**. lockMs = 150 represents the AR thermal dwell window between contacts.

**Parameters:**
- spinGain: +9 rad/s (SG Flat double orbital rebound η = 0.40)
- damageMultiplier: 1.20 (double orbital strike with thermal AR dwell)
- lockMs: 150 (AR thermal dwell window between contacts)

### TypeScript

```typescript
function emberStrikeCombo(bey: Beyblade, target: Beyblade): void {
  // SG Flat double orbital rebound reconversion: Δω ≈ +9 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 9);
  // Double orbital strike with thermal dwell: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 150: AR thermal dwell between contacts
  bey.lockMs = 150;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +9 rad/s (partial) | ✓ |



---

## Case 1886 — GIMMICK: Salvage Valtryek Shot-7 — Shot Driver Spring Jump & Salvage Blade Dual Rubber-Metal Contact

**Beyblade:** Salvage Valtryek Shot-7 (TT JP: セイバーヴァルキリー・ショット7; Hasbro EN: Salvage Valtryek Shot-7)
**Blader:** Valt Aoi / Rashad Goodman | **Series:** Beyblade Burst DB (Dynamite Battle)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Blade | Salvage (3 metal + 3 rubber blades) | 16.0 | 28.0 |
| DB Core | Valtryek | 7.5 | 12.0 |
| Armor | (standard DB Armor) | 13.5 | 18.0 |
| Ratchet | 7-60 | 18.0 | 22.0 |
| Driver | Shot | 6.0 | 5.0 |
| **Total** | | **61.0** | |

**I_total** = 16.0×10⁻³ × 0.028² + 7.5×10⁻³ × 0.012² + 13.5×10⁻³ × 0.018² + 18.0×10⁻³ × 0.022² + 6.0×10⁻³ × 0.005²
           = 1.254×10⁻⁵ + 1.080×10⁻⁶ + 4.374×10⁻⁶ + 8.712×10⁻⁶ + 1.50×10⁻⁷
           = **2.686×10⁻⁵ kg·m²**

ω₀ = 680 rad/s (Burst DB standard launch)
L₀ = I × ω₀ = 2.686×10⁻⁵ × 680 = **1.826×10⁻² kg·m²/s**

---

### 1. Shot Driver — Spring-Loaded Jump Mechanism

The Shot driver contains a rubber-tipped spring mechanism that compresses on floor contact and releases as a vertical impulse:

```
k_spring = 800 N/m,  x_compress = 5 mm = 0.005 m

PE_spring = ½ × k × x² = ½ × 800 × (0.005)² = 1.000×10⁻² J

v_z_jump = √(2 × PE_spring / m) = √(2 × 1.000×10⁻² / 0.061) = √(0.3279) = 0.573 m/s

h_jump = v_z_jump² / (2g) = (0.573)² / (2 × 9.81) = 0.3283 / 19.62 = 16.7 mm
```

Shot driver orbital speed (μ_shot = 0.20, r_shot = 5 mm):

```
v_orbital = μ_shot × ω₀ × r_shot = 0.20 × 680 × 0.005 = 0.680 m/s
τ_shot    = μ × m × g × r_shot = 0.20 × 0.061 × 9.81 × 0.005 = 5.984×10⁻⁴ N·m
t_spin    = L₀ / τ_shot = 1.826×10⁻² / 5.984×10⁻⁴ = 30.5 s
```

**Combined impact velocity (orbital approach + spring jump liftoff):**

```
v_impact = √(v_orbital² + 2g × h_jump) = √(0.680² + 2 × 9.81 × 0.01673)
         = √(0.4624 + 0.3283) = √0.7907 = 0.889 m/s
```

---

### 2. Salvage Blade — Dual Rubber-Metal Blade Contact (Whip Mechanic)

The Salvage Blade carries **3 metal blades** (hard smash) and **3 red rubber blades** (grip-and-snap whip):

**Blade tip velocity:**

```
v_blade_tip = ω₀ × r_blade = 680 × 0.028 = 19.04 m/s
```

**Contact restitution model:**
- Metal blades: e_metal = 0.75 (rigid elastic smash)
- Rubber blades: e_rubber = 0.50 (snap-back whip — rubber grips, deforms, then releases, returning energy above simple rubber damping)

```
e_eff = (3 × e_metal + 3 × e_rubber) / 6
      = (3 × 0.75 + 3 × 0.50) / 6 = (2.25 + 1.50) / 6 = 0.625
```

→ The rubber blade whip snap raises effective restitution beyond simple rubber contact, amplifying the total impulse delivered.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 61.0 g |
| I_total | 2.686×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| L₀ | 1.826×10⁻² kg·m²/s |
| v_blade_tip | 19.04 m/s |
| PE_spring | 1.000×10⁻² J |
| v_z_jump | 0.573 m/s |
| h_jump | 16.7 mm |
| v_orbital | 0.680 m/s |
| v_impact | 0.889 m/s |
| e_eff | 0.625 |
| τ_shot | 5.984×10⁻⁴ N·m |
| t_spin | 30.5 s |

---

## Case 1887 — SPECIAL: Salvage Whip (Savior Slash) — Valt Aoi / Rashad Goodman / Salvage Valtryek Shot-7

**Blader:** Valt Aoi / Rashad Goodman | **Beyblade:** Salvage Valtryek Shot-7 | **Type:** attack

### Description

Salvage Whip (Japanese: Savior Slash, セイバースラッシュ) is a Special Move used by both Valt Aoi and Rashad Goodman with their respective Salvage Valtryek Shot-7 Beyblades. Utilizing the speed built up with the Shot Driver and its spring-loaded jump feature, Salvage Valtryek launches into an aerial approach and strikes the opposing Beyblade simultaneously with the three hard metal blades and the three red rubber snap-whip blades on the Salvage Blade, dealing massive combined smash and whip damage.

### Stage — Shot Jump Aerial 6-Blade Strike

From Case 1886: v_impact = 0.889 m/s (orbital + spring jump), e_eff = 0.625 (3 metal + 3 rubber whip).

```
m_eff = (m_SV × m_opp) / (m_SV + m_opp) = (0.061 × 0.040) / (0.061 + 0.040)
      = 2.440×10⁻³ / 0.101 = 2.416×10⁻² kg

J_salvage = m_eff × (1 + e_eff) × v_impact
          = 2.416×10⁻² × 1.625 × 0.889
          = 2.416×10⁻² × 1.4446 = 3.490×10⁻² N·s

Δv_opp  = J_salvage / m_opp = 3.490×10⁻² / 0.040 = 0.873 m/s
```

**Effect on Salvage Valtryek (spin drain):**

```
Δω_SV    = J_salvage × r_contact / I_SV = 3.490×10⁻² × 0.025 / 2.686×10⁻⁵ = 32.5 rad/s
ω_remain = 680 − 32.5 = 647.5 rad/s  (95.2% retained)
```

---

**[M] BeySpirit amplification:**
Valt and Rashad's dual Valtryek spirits converge — when both bladers use Salvage Whip simultaneously the two Salvage Valtryek spiral into each other's approach vector, transforming the rubber whip blades into energy-absorbing lashes that drain the opponent's spin while the metal blades deliver the knockout blow.

[M] factor = **8.0 ×** (co-blader dual-spirit amplification)
[M] Δv = 0.873 × 8.0 = **7.0 m/s** (dual Savior Slash ring-out)

> **Note:** Physical values describe Shot driver spring jump (PE=1.000×10⁻² J, h_jump=16.7 mm, v_impact=0.889 m/s), combined metal smash + rubber whip e_eff=0.625, impulse J=3.490×10⁻² N·s. [M] values represent Valt and Rashad's co-blader Valtryek spirit fusion amplifying the whip into a simultaneous dual Savior Slash. Combos do not receive [M] amplification.

### TypeScript

```typescript
function salvageWhipSpecial(bey: Beyblade, target: Beyblade): void {
  // Shot spring PE=1.000×10⁻²J→h=16.7mm→v_impact=0.889m/s; e_eff=0.625 (3 metal+3 rubber); J=3.490×10⁻²N·s; [M] 8.0×
  const J_phys = 0.03490;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Valt+Rashad co-blader dual Valtryek)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Salvage Blade (or equivalent layer with 3+ metal blades and 3+ rubber snap-whip blades at r ≥ 26 mm) combined with the Shot Driver (or equivalent spring-loaded rubber jump driver, k ≥ 600 N/m, x ≥ 4 mm) that delivers a spring jump h ≥ 12 mm for the aerial approach. Standard game instances: Salvage Valtryek Shot-7 (Valt Aoi and Rashad Goodman, Burst DB).

---

## Case 1888 — COMBO: Salvage Rush — Salvage Valtryek

**Sequence:** A ↑ A (attack · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Valt Aoi / Rashad Goodman

### Physics Justification

The first attack (A) is an initial orbital contact at v_orbital = 0.680 m/s:

```
J_contact_1 = m_eff × (1 + e_eff) × v_orbital = 2.416×10⁻² × 1.625 × 0.680
            = 2.416×10⁻² × 1.1050 = 2.670×10⁻² N·s
```

The moveUp (↑) activates the Shot driver spring jump (h = 16.7 mm, v_z = 0.573 m/s), elevating Salvage Valtryek for the aerial follow-up.

The second attack (A) fires the aerial 6-blade dive at v_impact = 0.889 m/s. The Shot driver rubber tip's spring rebound on landing reconverts the landing impulse to spin:

```
J_contact_2 = J_salvage = 3.490×10⁻² N·s  (from Case 1887)

Δω = η_shot × J_contact_2 × r_contact / I_SV
   = 0.35 × 3.490×10⁻² × 0.025 / 2.686×10⁻⁵
   = 0.35 × 8.725×10⁻⁴ / 2.686×10⁻⁵
   = 0.35 × 32.48
   = +11.4 rad/s  ≈ +11 rad/s
```

(η_shot = 0.35: Shot driver rubber spring-rebound reconversion at landing.) The aerial jump + 6-blade simultaneous dive gives damageMultiplier **1.25×**. lockMs = 0 (pure attack, no lock phase).

**Parameters:**
- spinGain: +11 rad/s (Shot driver rubber spring rebound η = 0.35)
- damageMultiplier: 1.25 (aerial 6-blade rubber-metal dive)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function salvageRushCombo(bey: Beyblade, target: Beyblade): void {
  // Shot driver spring rebound: Δω ≈ +11 rad/s (η=0.35, h_jump=16.7mm)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 11);
  // Aerial 6-blade dive: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +11 rad/s (partial) | ✓ |



---

## Case 1889 — GIMMICK: Wyborg — Sand Vortex Inward Suction & SG Hole Flat Attack Mode

**Beyblade:** Wyborg (TT JP: ワイバーグ; Hasbro EN: Wyborg)
**Blader:** Ian Papov | **Series:** Beyblade (Bakuten Shoot V-Force, Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Wyborg (3-blade serpentine) | 14.0 | 32.0 |
| Weight Disk | 10 Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | SG Hole Flat (attack mode) | 2.0 | 5.0 |
| **Total** | | **37.5** | |

(Bit Chip ~1 g at r ≈ 0 excluded per convention. SG Hole Flat has a dual mode: initial sharp-tip defense mode switches to HF attack mode for Sand Bind execution.)

**I_total** = 14.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.005²
           = 1.434×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 5.0×10⁻⁸
           = **3.679×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (standard plastic-gen Bakuten Shoot launch)
L₀ = I × ω₀ = 3.679×10⁻⁵ × 700 = **2.575×10⁻² kg·m²/s**

---

### 1. Wyborg AR — Sand Vortex Inward Suction (Rankine Model)

The Wyborg AR blades at v_tip generate a Rankine vortex. Unlike Storm Attack (which uses the vortex for outward ejection), the Wyborg vortex rotates with an inward-directed suction effect — pulling opponents toward Wyborg's AR strike zone, binding their orbital freedom (Sand Bind).

**Blade tip velocity:**

```
v_tip = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s
```

**Sand vortex (Rankine):**

```
Γ_sand = 2π × v_tip × r_AR = 2π × 22.40 × 0.032 = 4.500 m²/s

At r_opp = 50 mm from centre:
v_sand  = Γ_sand / (2π × r_opp) = 4.500 / (2π × 0.050) = 14.32 m/s

q_sand  = ½ × ρ_air × v_sand² = ½ × 1.225 × 14.32² = 125.7 Pa
F_bind  = q_sand × A_opp = 125.7 × π × 0.020² = 125.7 × 1.257×10⁻³ = 0.1580 N  (inward — suction binding)
```

---

### 2. SG Hole Flat BB — High-Speed Attack Mode

The SG Hole Flat (attack mode) drives aggressive orbital movement (μ_HF = 0.35, r_HF = 5 mm):

```
τ_HF    = μ × m × g × r_HF = 0.35 × 0.0375 × 9.81 × 0.005 = 6.44×10⁻⁴ N·m
t_spin  = L₀ / τ_HF = 2.575×10⁻² / 6.44×10⁻⁴ = 40.0 s
v_orbital_HF = μ × ω₀ × r_HF = 0.35 × 700 × 0.005 = 1.225 m/s
```

(In defense/initial mode: sharp tip μ_sharp=0.08, r_sharp=3mm, τ_sharp=8.831×10⁻⁵ N·m — conserves spin before attack phase activation.)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.5 g |
| I_total | 3.679×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.575×10⁻² kg·m²/s |
| v_tip | 22.40 m/s |
| Γ_sand | 4.500 m²/s |
| v_sand (r=50 mm) | 14.32 m/s |
| F_bind | 0.1580 N (inward) |
| τ_HF | 6.44×10⁻⁴ N·m |
| t_spin (HF) | 40.0 s |
| v_orbital_HF | 1.225 m/s |

---

## Case 1890 — SPECIAL: Sand Bind — Ian Papov / Wyborg

**Blader:** Ian Papov | **Beyblade:** Wyborg | **Type:** attack

### Description

Sand Bind (Japanese: 砂蛇縛撃, Sa-ja-baku-geki — Sand-Snake Binding Strike) is a Special Move used by Ian Papov and Wyborg. Wyborg's Bit-Beast serpent manifests and coils around the opponent, restricting their movements via the sand vortex suction field. Wyborg then switches to its Hole Flat attack mode and attacks with high speed — the serpent's binding hold combined with the HF orbital speed drives the opponent out of the arena.

### Stage 1 — Sand Vortex Binding (Inward Suction Draw)

F_bind = 0.1580 N inward for t_bind = 0.20 s:

```
J_bind       = F_bind × t_bind = 0.1580 × 0.20 = 3.160×10⁻² N·s  (toward Wyborg)
v_approach   = J_bind / m_opp = 3.160×10⁻² / 0.038 = 0.832 m/s  (opponent drawn in)
```

### Stage 2 — SG HF High-Speed Contact Strike

Wyborg switches to HF attack mode: v_orbital_HF = 1.225 m/s. The opponent's suction-driven approach combines with Wyborg's orbital speed:

```
v_rel = v_orbital_HF + v_approach = 1.225 + 0.832 = 2.057 m/s

m_eff = (0.0375 × 0.038) / (0.0375 + 0.038) = 1.425×10⁻³ / 0.0755 = 1.887×10⁻² kg

J_sandbind = m_eff × (1 + e) × v_rel  [e = 0.60: rubber HF contact]
           = 1.887×10⁻² × 1.60 × 2.057
           = 6.210×10⁻² N·s

Δv_opp = J_sandbind / m_opp = 6.210×10⁻² / 0.038 = 1.634 m/s
```

**Effect on Wyborg (spin drain):**

```
Δω_W     = J_sandbind × r_contact / I_W = 6.210×10⁻² × 0.025 / 3.679×10⁻⁵ = 42.2 rad/s
ω_remain = 700 − 42.2 = 657.8 rad/s  (94.0% retained)
```

---

**[M] BeySpirit amplification:**
Ian's serpent Bit-Beast fully materialises — the sand tornado becomes a true desert sandstorm column that physically constricts the opponent like a coiling snake. The HF orbital strike at full [M] force drives them out of the arena.

[M] factor = **7.0 ×**
[M] Δv = 1.634 × 7.0 = **11.4 m/s** (serpent-bind ring-out)

> **Note:** Physical values describe sand vortex inward suction (F=0.1580 N, J_bind=3.160×10⁻² N·s, v_approach=0.832 m/s), HF orbital approach (v_orbital=1.225 m/s), combined v_rel=2.057 m/s, J_sandbind=6.210×10⁻² N·s, Δv=1.634 m/s. [M] values represent Ian's serpent spirit transmuting the sand suction into a true binding constriction. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sandBindSpecial(bey: Beyblade, target: Beyblade): void {
  // Sand vortex: F=0.1580N×0.2s→J_bind=3.160×10⁻²N·s inward; HF v_rel=2.057m/s→J=6.210×10⁻²N·s; [M] 7.0×
  const J_bind = 0.03160;
  const J_attack = 0.06210;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Stage 1: sand vortex inward pull (binding)
  applyForce(target.id, -(dx / dist) * J_bind, -(dy / dist) * J_bind);
  // Stage 2: HF attack — [M] 7.0×
  const amplified = J_attack * 7.0; // [M] BeySpirit 7.0× (Ian serpent sand bind strike)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using an AR with 3+ blade protrusions at r ≥ 30 mm (generating Rankine inward suction Γ ≥ 4.0 m²/s at ω₀ ≥ 680 rad/s) combined with a Hole Flat or Wide Flat Blade Base (μ_HF ≥ 0.30, r ≥ 4 mm) for the attack-mode high-speed orbital strike. Standard game instance: Wyborg (Ian Papov, Bakuten Shoot V-Force plastic generation).

---

## Case 1891 — COMBO: Sand Fang — Wyborg

**Sequence:** K A E (defense · attack · dodge)
**Cost:** 15 | **Type:** attack | **Blader:** Ian Papov

### Physics Justification

The defense stance (K) switches Wyborg to sharp-tip mode (μ_sharp=0.08, r=3mm, τ_sharp=8.831×10⁻⁵ N·m), conserving spin by reducing friction vs HF mode:

```
τ_saved  = τ_HF − τ_sharp = 6.44×10⁻⁴ − 8.831×10⁻⁵ = 5.557×10⁻⁴ N·m
Δω_saved = τ_saved × t_lock / I_W = 5.557×10⁻⁴ × 0.150 / 3.679×10⁻⁵ = 2.27 rad/s  (spin conserved)
```

The attack (A) activates the partial sand bind suction (t_partial = 0.10 s) then HF mode:

```
J_bind_partial = F_bind × t_partial = 0.1580 × 0.10 = 1.580×10⁻² N·s
v_approach_partial = 1.580×10⁻² / 0.038 = 0.416 m/s

v_rel_combo = v_orbital_HF + v_approach_partial = 1.225 + 0.416 = 1.641 m/s

J_combo = m_eff × (1 + e) × v_rel_combo = 1.887×10⁻² × 1.60 × 1.641 = 4.954×10⁻² N·s
```

The dodge (E) represents Wyborg darting away using HF orbital speed. The HF rubber rebound from the contact reconverts impulse to spin:

```
Δω_rebound = η_HF × J_combo × r_contact / I_W
           = 0.35 × 4.954×10⁻² × 0.025 / 3.679×10⁻⁵
           = 0.35 × 1.2385×10⁻³ / 3.679×10⁻⁵
           = 0.35 × 33.66
           = +11.78 rad/s

Total Δω = Δω_saved + Δω_rebound = 2.27 + 11.78 = +14.05 rad/s  ≈ +14 rad/s
```

(η_HF = 0.35: HF rubber rebound reconversion with partial sand-bind assisted approach.) lockMs = 150 (sharp-tip mode dwell during K stance). damageMultiplier **1.20×**.

**Parameters:**
- spinGain: +14 rad/s (mode-switch save + HF rubber rebound η = 0.35)
- damageMultiplier: 1.20 (partial sand-bind approach + HF contact)
- lockMs: 150 (sharp-tip spin conservation dwell)

### TypeScript

```typescript
function sandFangCombo(bey: Beyblade, target: Beyblade): void {
  // Mode-switch K saves Δω≈+2.3 rad/s; partial sand bind + HF rebound Δω≈+11.8 rad/s; total ≈+14 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 14);
  // Sand-assisted HF approach: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 150: sharp-tip spin conservation window
  bey.lockMs = 150;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +14 rad/s (partial) | ✓ |



---

## Case 1892 — GIMMICK: Dark Gasher CH120SF — CH120 Height Extension & Six-Prong Upper-Level AR Contact

**Beyblade:** Dark Gasher CH120SF (TT JP: ダークガッシャーCH120SF; Hasbro EN: Dark Gasher CH120SF)
**Blader:** Tetsuya Watarigani | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Cancer/Gasher | 3.8 | 23.0 |
| Fusion Wheel | Dark | 30.0 | 28.0 |
| Spin Track | CH120 (at 145 mm extended) | 2.7 | 12.0 |
| Performance Tip | SF (Semi-Flat) | 0.8 | 4.0 |
| **Total** | | **37.3** | |

(Face Bolt ~1.4 g excluded per MFB convention.)

**I_total** = 30.0×10⁻³ × 0.028² + 3.8×10⁻³ × 0.023² + 2.7×10⁻³ × 0.012² + 0.8×10⁻³ × 0.004²
           = 2.352×10⁻⁵ + 2.010×10⁻⁶ + 3.888×10⁻⁷ + 1.28×10⁻⁸
           = **2.593×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Fusion standard launch)
L₀ = I × ω₀ = 2.593×10⁻⁵ × 650 = **1.685×10⁻² kg·m²/s**

---

### 1. CH120 Change Height Track — 120 mm → 145 mm Extension (+25 mm)

The CH120 (Change Height 120/145) Spin Track contains an inner sleeve that locks at two positions. Extending to 145 mm raises the entire beyblade body by Δh = 25 mm, lifting the Dark Fusion Wheel AR above the standard contact height of opponents using short tracks.

**Gravitational PE stored by CoM elevation:**

```
Δh_CH120 = 145 − 120 = 25 mm = 0.025 m

PE_CH = m × g × Δh_CH120 = 0.0373 × 9.81 × 0.025 = 9.141×10⁻³ J
```

When Dark Gasher tilts (pecks forward), this elevation converts to dive kinetic energy:

```
v_dive = √(2 × PE_CH / m) = √(2 × 9.141×10⁻³ / 0.0373) = √(0.4900) = 0.700 m/s
```

**Combined impact velocity (SF orbital + CH145 gravity dive):**

```
v_orbital_SF = μ_SF × ω₀ × r_SF = 0.12 × 650 × 0.004 = 0.312 m/s

v_impact = √(v_orbital_SF² + 2g × Δh_CH120)
         = √(0.312² + 2 × 9.81 × 0.025)
         = √(0.09734 + 0.49050)
         = √0.58784 = 0.767 m/s
```

---

### 2. Dark FW — Six-Prong Upper-Level AR Contacts (Six Crab Claw Pattern)

The Dark Fusion Wheel carries six contact protrusions arranged symmetrically (separated by 60° each). When Dark Gasher approaches at CH145 height, these six protrusions engage the opponent's AR from above — "as if six crabs are attacking with their claws" (one contact per prong per oscillation cycle).

**Prong tip velocity:**

```
v_prong = ω₀ × r_FW = 650 × 0.028 = 18.20 m/s
```

**SF tip physics:**

```
τ_SF   = μ_SF × m × g × r_SF = 0.12 × 0.0373 × 9.81 × 0.004 = 1.756×10⁻⁴ N·m
t_spin = L₀ / τ_SF = 1.685×10⁻² / 1.756×10⁻⁴ = 95.9 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.3 g |
| I_total | 2.593×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.685×10⁻² kg·m²/s |
| Δh_CH120 | 25 mm |
| PE_CH | 9.141×10⁻³ J |
| v_dive | 0.700 m/s |
| v_orbital_SF | 0.312 m/s |
| v_impact | 0.767 m/s |
| v_prong | 18.20 m/s |
| τ_SF | 1.756×10⁻⁴ N·m |
| t_spin | 95.9 s |

---

## Case 1893 — SPECIAL: Six Crab Shake — Tetsuya Watarigani / Dark Gasher CH120SF

**Blader:** Tetsuya Watarigani | **Beyblade:** Dark Gasher CH120SF | **Type:** attack

### Description

Six Crab Shake (Japanese: シックスクラブ・シェイキング, Shikkusu Kurabu Sheikingu) is a Special Move used by Tetsuya Watarigani and his Dark Gasher CH120SF. Gasher's track changes to 145mm height, raising the Dark Fusion Wheel above the opponent's AR contact zone. Gasher then pecks repeatedly at the opponent's beyblade from above — leaning into the Starblast Attack-style downward position — making it appear as if six crabs are simultaneously attacking the opposing bey with their claws.

### Six-Peck Upper Strike Sequence

The CH145 gravity dive gives v_impact = 0.767 m/s. All six prongs of the Dark FW deliver sequential peck contacts totalling the full impulse:

```
m_eff = (m_DG × m_opp) / (m_DG + m_opp) = (0.0373 × 0.038) / (0.0373 + 0.038)
      = 1.4174×10⁻³ / 0.0753 = 1.882×10⁻² kg

J_sixcrab = m_eff × (1 + e_prong) × v_impact  [e_prong = 0.70: hard ABS claw tips]
          = 1.882×10⁻² × 1.70 × 0.767
          = 1.882×10⁻² × 1.3039 = 2.454×10⁻² N·s

Δv_opp  = J_sixcrab / m_opp = 2.454×10⁻² / 0.038 = 0.646 m/s
```

**Impulse per individual peck contact (1 of 6):**

```
J_per_peck = J_sixcrab / 6 = 2.454×10⁻² / 6 = 4.090×10⁻³ N·s  (each claw contact)
```

**Effect on Dark Gasher (spin drain — CH145 dive reconversion):**

```
Δω_DG    = J_sixcrab × r_contact / I_DG = 2.454×10⁻² × 0.025 / 2.593×10⁻⁵ = 23.7 rad/s
ω_remain = 650 − 23.7 = 626.3 rad/s  (96.4% retained)
```

---

**[M] BeySpirit amplification:**
Tetsuya's Gasher Bit-Beast materialises as six giant crab claws simultaneously striking the opponent — the CH145 peck sequence transforms into a true multi-claw assault that overwhelms opponent defenses.

[M] factor = **6.0 ×** (thematically matching the six-claw count)
[M] Δv = 0.646 × 6.0 = **3.9 m/s** (six-claw ring-out)

> **Note:** Physical values describe CH120 extension Δh=25 mm raising PE_CH=9.141×10⁻³ J, gravity-dive v_impact=0.767 m/s, six-prong sequential peck total J=2.454×10⁻² N·s (4.090×10⁻³ N·s per prong), and Δv=0.646 m/s. [M] values represent Tetsuya's crab spirit manifesting six simultaneous giant claws. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sixCrabShakeSpecial(bey: Beyblade, target: Beyblade): void {
  // CH120→145: Δh=25mm→PE=9.141×10⁻³J; v_impact=0.767m/s; 6-prong J=2.454×10⁻²N·s; [M] 6.0×
  const J_phys = 0.02454;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0× (Tetsuya six crab claw materialisation)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the CH120 (or CH130/145) Change Height Spin Track that can extend to ≥145 mm combined with a Fusion Wheel carrying 6+ symmetric contact protrusions at r ≥ 26 mm. The height extension must raise the AR above the opponent's contact zone to enable top-down peck contacts. Standard game instance: Dark Gasher CH120SF (Tetsuya Watarigani, Metal Fusion).

---

## Case 1894 — COMBO: Crab Peck — Dark Gasher

**Sequence:** ↓ A A (moveDown · attack · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Tetsuya Watarigani

### Physics Justification

The moveDown (↓) represents Dark Gasher dropping into the CH145 elevated-peck position — CoM raised by 25 mm, v_dive = 0.700 m/s primed.

The first attack (A) fires a full CH145 peck at v_impact = 0.767 m/s:

```
J_peck_1 = m_eff × (1 + e_prong) × v_impact = 1.882×10⁻² × 1.70 × 0.767 = 2.454×10⁻² N·s
```

The second attack (A) fires a partial-height recovery peck (h₂ = Δh_CH120 × 0.50 = 12.5 mm):

```
v_impact_2 = √(v_orbital_SF² + 2g × h₂) = √(0.312² + 2 × 9.81 × 0.0125) = √(0.0973 + 0.2453) = 0.585 m/s

J_peck_2 = m_eff × (1 + e_prong) × v_impact_2 = 1.882×10⁻² × 1.70 × 0.585 = 1.871×10⁻² N·s
```

The SF tip elastic rebound reconverts the two-peck impulse to spin:

```
Δω = η × (J_peck_1 + J_peck_2) × r_contact / I_DG
   = 0.30 × (2.454×10⁻² + 1.871×10⁻²) × 0.025 / 2.593×10⁻⁵
   = 0.30 × 4.325×10⁻² × 0.025 / 2.593×10⁻⁵
   = 0.30 × 1.081×10⁻³ / 2.593×10⁻⁵
   = 0.30 × 41.7
   = +12.5 rad/s  ≈ +13 rad/s
```

(η = 0.30: SF semi-flat tip elastic rebound at partial-height double peck.) The double CH145-dive attack gives damageMultiplier **1.25×**. lockMs = 0 (pure attack).

**Parameters:**
- spinGain: +13 rad/s (SF double peck rebound η = 0.30)
- damageMultiplier: 1.25 (double CH145 gravity-dive peck from above)
- lockMs: 0 (pure attack)

### TypeScript

```typescript
function crabPeckCombo(bey: Beyblade, target: Beyblade): void {
  // SF double CH145 peck rebound: Δω ≈ +13 rad/s (η=0.30, J1=2.454×10⁻² + J2=1.871×10⁻²)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 13);
  // Double gravity dive peck from CH145: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +13 rad/s (partial) | ✓ |



---

## Case 1895 — GIMMICK: Ray Gasher M145Q — M145 Mid-Height Stabiliser & Q-Tip Rubber Bounce Drill

**Beyblade:** Ray Gasher M145Q (TT JP: レイガッシャーM145Q; Hasbro EN: Ray Gasher M145Q)
**Blader:** Enso Garcia / Selen | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Gasher | 3.8 | 23.0 |
| Fusion Wheel | Ray | 27.5 | 28.0 |
| Spin Track | M145 (Mid 145 mm) | 2.5 | 10.0 |
| Performance Tip | Q (Quake) | 1.2 | 3.5 |
| **Total** | | **35.0** | |

(Face Bolt ~1.4 g excluded per MFB convention.)

**I_total** = 27.5×10⁻³ × 0.028² + 3.8×10⁻³ × 0.023² + 2.5×10⁻³ × 0.010² + 1.2×10⁻³ × 0.0035²
           = 2.156×10⁻⁵ + 2.010×10⁻⁶ + 2.500×10⁻⁷ + 1.47×10⁻⁸
           = **2.383×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Fusion standard launch)
L₀ = I × ω₀ = 2.383×10⁻⁵ × 650 = **1.549×10⁻² kg·m²/s**

---

### 1. Q (Quake) Performance Tip — Rubber Bounce Drill Launch

The Q tip carries a hard rubber nub (μ_Q ≈ 0.20, r_Q = 3.5 mm) with a built-in spring-compressed rubber dome (k = 1200 N/m, x_compress = 6 mm = 0.006 m). On hard floor contact, the rubber dome compresses and releases a vertical bounce impulse — driving the signature Quake bounce and the upward drill-spin entry:

```
PE_Q = ½ × k × x² = ½ × 1200 × (0.006)² = 2.160×10⁻² J

v_vert = √(2 × PE_Q / m) = √(2 × 2.160×10⁻² / 0.0350) = √(1.2343) = 1.111 m/s

h_apex = v_vert² / (2g) = (1.111)² / (2 × 9.81) = 1.2343 / 19.62 = 62.9 mm  ≈ 63 mm
```

Q tip orbital speed:

```
v_orbital_Q = μ_Q × ω₀ × r_Q = 0.20 × 650 × 0.0035 = 0.4550 m/s
τ_Q         = μ_Q × m × g × r_Q = 0.20 × 0.0350 × 9.81 × 0.0035 = 2.401×10⁻⁴ N·m
t_spin      = L₀ / τ_Q = 1.549×10⁻² / 2.401×10⁻⁴ = 64.5 s
```

**Combined impact velocity (orbital + Q bounce apex re-entry):**

```
v_impact = √(v_orbital_Q² + 2g × h_apex)
         = √(0.4550² + 2 × 9.81 × 0.0629)
         = √(0.2070 + 1.2345)
         = √1.4415 = 1.201 m/s
```

---

### 2. Ray FW & M145 — Drill-Tornado Spin Column

The Ray Fusion Wheel's swept blade protrusions at r = 28 mm generate a rotating spiral wash (drill vortex) as Ray Gasher ascends from the Q bounce into its overhead strike. The M145 mid-height track stabilises this ascent at 145 mm without the change-height locking mechanism, keeping the AR elevation constant.

**Blade tip velocity:**

```
v_blade_tip = ω₀ × r_FW = 650 × 0.028 = 18.20 m/s
```

**Drill-vortex dynamic pressure at r_opp = 50 mm:**

```
Γ_drill = 2π × v_blade_tip × r_FW = 2π × 18.20 × 0.028 = 3.205 m²/s

v_drill  = Γ_drill / (2π × r_opp) = 3.205 / (2π × 0.050) = 10.18 m/s

q_drill  = ½ × ρ_air × v_drill² = ½ × 1.225 × 10.18² = 63.52 Pa
F_drill  = q_drill × A_opp = 63.52 × π × 0.020² = 63.52 × 1.257×10⁻³ = 0.07983 N
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.0 g |
| I_total | 2.383×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.549×10⁻² kg·m²/s |
| v_blade_tip | 18.20 m/s |
| PE_Q | 2.160×10⁻² J |
| v_vert | 1.111 m/s |
| h_apex | 63 mm |
| v_orbital_Q | 0.4550 m/s |
| v_impact | 1.201 m/s |
| Γ_drill | 3.205 m²/s |
| F_drill | 0.07983 N |
| τ_Q | 2.401×10⁻⁴ N·m |
| t_spin | 64.5 s |

---

## Case 1896 — SPECIAL: Slumdog Driver — Enso Garcia / Selen / Ray Gasher M145Q

**Blader:** Enso Garcia / Selen | **Beyblade:** Ray Gasher M145Q | **Type:** attack

### Description

Slumdog Driver (Japanese: スラムドッグ・ドライバー, Suramu Doggu Doraibā) is a Special Move used by both Enso Garcia and Selen with their Ray Gasher M145Q Beyblades. Ray Gasher consumes itself in a drill-like tornado and slams the opponent from above. The Q tip's rubber bounce launches Ray Gasher skyward at h ≈ 63 mm, spinning as a vertical drill column, before it crashes back down on the opposing beyblade with full aerial smash force. When both Selen and Enso use this move simultaneously, it becomes Double Slumdog Driver — two drill columns converging on the same target for doubled destructive force.

### Stage — Q Bounce Drill Aerial Overhead Smash

From Case 1895: v_impact = 1.201 m/s (Q orbital + bounce apex re-entry), e = 0.75 (hard Ray FW smash blades).

```
m_eff = (m_RG × m_opp) / (m_RG + m_opp) = (0.0350 × 0.038) / (0.0350 + 0.038)
      = 1.330×10⁻³ / 0.0730 = 1.822×10⁻² kg

J_slumdog = m_eff × (1 + e) × v_impact
          = 1.822×10⁻² × 1.75 × 1.201
          = 1.822×10⁻² × 2.1018 = 3.829×10⁻² N·s

Δv_opp  = J_slumdog / m_opp = 3.829×10⁻² / 0.038 = 1.008 m/s
```

**Effect on Ray Gasher (spin drain):**

```
Δω_RG    = J_slumdog × r_contact / I_RG = 3.829×10⁻² × 0.025 / 2.383×10⁻⁵ = 40.1 rad/s
ω_remain = 650 − 40.1 = 609.9 rad/s  (93.8% retained)
```

---

**[M] BeySpirit amplification:**
Enso and Selen's Ray Gasher Bit-Beasts converge into Double Slumdog Driver — both crab-beast spirits materialise as twin drill tornadoes spiralling down onto the same point, delivering twice the Quake bounce energy in a single combined overhead slam.

[M] factor = **8.0 ×** (Double Slumdog co-blader dual-drill amplification)
[M] Δv = 1.008 × 8.0 = **8.1 m/s** (twin-drill ring-out)

> **Note:** Physical values describe Q-tip rubber bounce (PE=2.160×10⁻² J, h=63 mm, v_impact=1.201 m/s), Ray FW drill smash (e=0.75), impulse J=3.829×10⁻² N·s, Δv=1.008 m/s. [M] values represent Enso and Selen's co-blader Gasher spirits fusing into Double Slumdog Driver — two drill columns in a single convergent overhead strike. Combos do not receive [M] amplification.

### TypeScript

```typescript
function slumdogDriverSpecial(bey: Beyblade, target: Beyblade): void {
  // Q bounce PE=2.160×10⁻²J→h=63mm→v_impact=1.201m/s; e=0.75 drill smash; J=3.829×10⁻²N·s; [M] 8.0×
  const J_phys = 0.03829;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Enso+Selen co-blader Double Slumdog drill)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Q (Quake) Performance Tip (or equivalent spring-compressed rubber bounce tip, k ≥ 900 N/m, x ≥ 5 mm) combined with a Fusion Wheel carrying swept smash blades at r ≥ 26 mm (generating drill-tornado approach at ω₀ ≥ 630 rad/s) on a mid-height track (M145 or equivalent ≥ 140 mm). The Q bounce must reach h ≥ 50 mm for a valid overhead drill entry. Standard game instances: Ray Gasher M145Q (Enso Garcia and Selen, Metal Fusion).

---

## Case 1897 — COMBO: Tornado Dash — Ray Gasher

**Sequence:** ↑ A ↑ (moveUp · attack · moveUp)
**Cost:** 15 | **Type:** attack | **Blader:** Enso Garcia / Selen

### Physics Justification

The first moveUp (↑) activates the Q tip rubber bounce (PE = 2.160×10⁻² J, h = 63 mm, v_vert = 1.111 m/s) — Ray Gasher launches upward in drill-spin mode.

The attack (A) fires the mid-air Ray FW overhead drill smash at v_impact = 1.201 m/s:

```
J_drill = J_slumdog = 3.829×10⁻² N·s  (from Case 1896)
```

The second moveUp (↑) represents the Q tip rubber spring rebound on landing — re-compressing the rubber dome and reconverting landing impulse back to spin:

```
Δω = η_Q × J_drill × r_contact / I_RG
   = 0.30 × 3.829×10⁻² × 0.025 / 2.383×10⁻⁵
   = 0.30 × 9.573×10⁻⁴ / 2.383×10⁻⁵
   = 0.30 × 40.17
   = +12.1 rad/s  ≈ +12 rad/s
```

(η_Q = 0.30: Q rubber bounce dome recompression reconversion on landing.) The Q bounce aerial drill smash gives damageMultiplier **1.25×**. lockMs = 0 (pure aerial attack, no lock phase).

**Parameters:**
- spinGain: +12 rad/s (Q rubber bounce rebound η = 0.30)
- damageMultiplier: 1.25 (Q bounce aerial drill overhead smash)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function tornadoDashCombo(bey: Beyblade, target: Beyblade): void {
  // Q bounce rebound: Δω ≈ +12 rad/s (η=0.30, h=63mm, J=3.829×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Aerial drill overhead smash: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |



---

## Case 1898 — GIMMICK: Storm Capricorn M145Q — M145 Targeting Stance & Q Horizontal Dash Release

**Beyblade:** Storm Capricorn M145Q (TT JP: ストームカプリコーンM145Q; Hasbro EN: Storm Capricorn M145Q)
**Blader:** Tobio Oike | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Capricorn | 3.8 | 23.0 |
| Fusion Wheel | Storm | 28.0 | 28.0 |
| Spin Track | M145 | 2.5 | 10.0 |
| Performance Tip | Q (Quake) | 1.2 | 3.5 |
| **Total** | | **35.5** | |

(Face Bolt ~1.4 g excluded per MFB convention. Assembly analysis here focuses on the Sniper Shot mechanism — horizontal spring dash + ER horn point-strike — distinct from Spin Screwdriver's vertical Q bounce, Cases 1839–1841.)

**I_total** = 28.0×10⁻³ × 0.028² + 3.8×10⁻³ × 0.023² + 2.5×10⁻³ × 0.010² + 1.2×10⁻³ × 0.0035²
           = 2.195×10⁻⁵ + 2.010×10⁻⁶ + 2.500×10⁻⁷ + 1.47×10⁻⁸
           = **2.423×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Fusion standard launch)
L₀ = I × ω₀ = 2.423×10⁻⁵ × 650 = **1.575×10⁻² kg·m²/s**

---

### 1. Q Tip — Horizontal Spring Dash Release

The Q tip rubber dome (k = 1200 N/m, x_compress = 6 mm = 0.006 m) normally fires vertically for Spin Screwdriver's bounce. In Sniper Shot, Tobio's aiming stance channels the spring release horizontally — the compressed dome fires Storm Capricorn forward in a straight-line dash toward the locked target:

```
PE_Q = ½ × k × x² = ½ × 1200 × (0.006)² = 2.160×10⁻² J

v_dash = √(2 × PE_Q / m) = √(2 × 2.160×10⁻² / 0.0355) = √(1.2169) = 1.103 m/s
```

Q tip orbital speed and spin decay:

```
v_orbital_Q = μ_Q × ω₀ × r_Q = 0.20 × 650 × 0.0035 = 0.4550 m/s
τ_Q         = μ_Q × m × g × r_Q = 0.20 × 0.0355 × 9.81 × 0.0035 = 2.44×10⁻⁴ N·m
t_spin      = L₀ / τ_Q = 1.575×10⁻² / 2.44×10⁻⁴ = 64.5 s
```

---

### 2. ER Capricorn Horn — Bullet-Point Contact Pressure

The Capricorn Energy Ring carries a prominent forward horn protrusion (tip radius r_horn = 1.5 mm, A_horn = π × r_horn² = 7.069×10⁻⁶ m²). At the moment of Sniper Shot contact, the horn tip concentrates the entire impact force at a single point — mimicking a bullet's penetrator nose:

```
v_horn_tip = ω₀ × r_ER = 650 × 0.023 = 14.95 m/s

F_horn = m × (v_horn_tip / t_c)  [t_c = 0.5 ms hard-tip contact duration]
       = 0.0355 × (14.95 / 5×10⁻⁴) = 0.0355 × 29900 = 1062 N

P_horn = F_horn / A_horn = 1062 / 7.069×10⁻⁶ = 1.502×10⁸ Pa = 150.2 MPa

σ_ratio = P_horn / σ_y_ABS = 150.2 / 55 = 2.73 × ABS yield
```

At 2.73× ABS yield the ER horn point exceeds the opponent's plastic yield stress — consistent with the anime's claim of the strike piercing through movable walls.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.5 g |
| I_total | 2.423×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.575×10⁻² kg·m²/s |
| v_blade_tip | 18.20 m/s |
| PE_Q | 2.160×10⁻² J |
| v_dash | 1.103 m/s |
| v_orbital_Q | 0.4550 m/s |
| r_horn | 1.5 mm |
| v_horn_tip | 14.95 m/s |
| F_horn (t_c = 0.5 ms) | 1062 N |
| P_horn | 150.2 MPa |
| σ_ratio | 2.73× ABS yield |
| τ_Q | 2.44×10⁻⁴ N·m |
| t_spin | 64.5 s |

---

## Case 1899 — SPECIAL: Sniper Shot — Tobio Oike / Storm Capricorn M145Q

**Blader:** Tobio Oike | **Beyblade:** Storm Capricorn M145Q | **Type:** attack

### Description

Sniper Shot is a Special Move used by Tobio Oike and his Storm Capricorn M145Q. Tobio pulls his hands up and then points at the opponent as if shooting at them. Storm Capricorn then rushes forward at full speed in a red flash of energy and strikes the opposing beyblade with a force that sends it flying. The speed of the rush reportedly exceeds that of an actual bullet — Capricorn was able to pass through the movable walls of the Alamo Town stadium in an instant. When multiple opponents are present, Tobio's pointing gesture locks onto one target: the player completes a QTE targeting sequence to select and claim the precision bonus.

### QTE: Target Lock (multi-opponent arena)

When 2 or more opponents are active, the move triggers a target-selection QTE — a targeting cursor sweeps across the opponents and the player taps to lock on at the right moment. A successful lock grants a precision multiplier:

```
J_lock_bonus  = 1.20  (QTE success: precision horn-tip lock)
J_miss_bonus  = 1.00  (QTE miss or single-opponent: no precision bonus)
```

### Stage — Q Horizontal Dash + Capricorn Horn Point Strike

From Case 1898: v_dash = 1.103 m/s, e = 0.75 (hard Storm FW blade/ER horn smash contact).

```
m_eff = (m_SC × m_opp) / (m_SC + m_opp) = (0.0355 × 0.038) / (0.0355 + 0.038)
      = 1.349×10⁻³ / 0.0735 = 1.835×10⁻² kg

J_sniper_base = m_eff × (1 + e) × v_dash
              = 1.835×10⁻² × 1.75 × 1.103
              = 3.542×10⁻² N·s

J_sniper_QTE  = J_sniper_base × J_lock_bonus = 3.542×10⁻² × 1.20 = 4.250×10⁻² N·s

Δv_opp (QTE)    = J_sniper_QTE  / m_opp = 4.250×10⁻² / 0.038 = 1.118 m/s
Δv_opp (no QTE) = J_sniper_base / m_opp = 3.542×10⁻² / 0.038 = 0.932 m/s
```

**Effect on Storm Capricorn (spin drain — QTE case):**

```
Δω_SC    = J_sniper_QTE × r_contact / I_SC = 4.250×10⁻² × 0.025 / 2.423×10⁻⁵ = 43.8 rad/s
ω_remain = 650 − 43.8 = 606.2 rad/s  (93.3% retained)
```

---

**[M] BeySpirit amplification:**
Tobio's pointer stance fully channels his Capricorn spirit into a precision lance — the red energy flash is the Capricorn bit-beast materialising as a rifle barrel, and the stadium walls offer no resistance to the spirit-charged horn strike.

[M] factor = **7.0 ×** (Tobio precision sniper spirit)
[M] Δv = 1.118 × 7.0 = **7.8 m/s** (sniper ring-out)

> **Note:** Physical values describe Q spring PE=2.160×10⁻² J horizontal release v_dash=1.103 m/s, ER Capricorn horn point P=150.2 MPa (2.73× ABS yield), QTE precision J=4.250×10⁻² N·s, Δv=1.118 m/s (no-QTE: J=3.542×10⁻² N·s, Δv=0.932 m/s). [M] values represent Tobio's full precision spirit materialisation as a through-wall bullet strike. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sniperShotSpecial(bey: Beyblade, target: Beyblade, qteSuccess: boolean): void {
  // Q spring PE=2.160×10⁻²J→v_dash=1.103m/s; horn P=150.2MPa (2.73× ABS); J_base=3.542×10⁻²N·s; QTE +20%; [M] 7.0×
  const J_base = 0.03542;
  const J_phys = qteSuccess ? J_base * 1.20 : J_base; // QTE precision lock-on: +20% if targeted
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Tobio precision sniper spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Q (Quake) Performance Tip (spring-compressed rubber dome, k ≥ 900 N/m, x ≥ 5 mm, horizontal release) combined with an Energy Ring carrying a forward horn protrusion (tip radius r_horn ≤ 2 mm, r_AR ≥ 22 mm, contact pressure ≥ 2.5× ABS yield) on a mid-height track (M145 or equivalent ≥ 140 mm) for the horizontal dash-and-point-contact sniper strike. QTE targeting fires when ≥ 2 opponents are present; single-opponent matches use J_base with no QTE bonus. Standard game instance: Storm Capricorn M145Q (Tobio Oike, Metal Fusion).

---

## Case 1900 — COMBO: Sniper Charge — Storm Capricorn

**Sequence:** ↑ → A (moveUp · moveRight · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Tobio Oike

### Physics Justification

The moveUp (↑) activates a partial Q dome compression during the aiming stance (x_partial = ½ × 6 mm = 3 mm):

```
PE_partial = ½ × k × x_partial² = ½ × 1200 × (0.003)² = 5.400×10⁻³ J

v_partial = √(2 × PE_partial / m) = √(2 × 5.400×10⁻³ / 0.0355) = √(0.3042) = 0.5516 m/s
```

The moveRight (→) is the targeting alignment — Storm Capricorn tracks toward the opponent's position (no contact), adding an orbital approach component v_orbital_Q = 0.455 m/s.

The attack (A) combines the partial Q dash and orbital approach into the horn strike:

```
v_impact = √(v_partial² + v_orbital_Q²) = √(0.5516² + 0.455²)
         = √(0.3043 + 0.2070) = √0.5113 = 0.715 m/s

J_charge = m_eff × (1 + e) × v_impact = 1.835×10⁻² × 1.75 × 0.715
         = 2.296×10⁻² N·s
```

The Q rubber dome partially recompresses on landing, reconverting contact impulse to spin:

```
Δω = η_Q × J_charge × r_contact / I_SC
   = 0.30 × 2.296×10⁻² × 0.025 / 2.423×10⁻⁵
   = 0.30 × 5.740×10⁻⁴ / 2.423×10⁻⁵
   = 0.30 × 23.69
   = +7.1 rad/s  ≈ +7 rad/s
```

(η_Q = 0.30: Q rubber partial-compression dome rebound reconversion.) The dash-and-horn point strike gives damageMultiplier **1.25×**. lockMs = 0 (pure attack dash, no lock phase).

**Parameters:**
- spinGain: +7 rad/s (Q partial-dome rebound η = 0.30)
- damageMultiplier: 1.25 (horizontal Q-dash horn point strike)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function sniperChargeCombo(bey: Beyblade, target: Beyblade): void {
  // Q partial spring rebound: Δω ≈ +7 rad/s (η=0.30, x_partial=3mm, v_impact=0.715m/s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 7);
  // Horizontal Q-dash horn strike: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +7 rad/s (partial) | ✓ |



---

## Case 1901 — GIMMICK: Flame Libra T125ES — T125 Arena Vibration & ES Sustained Acoustic Vortex

**Beyblade:** Flame Libra T125ES (TT JP: フレイムリブラT125ES; Hasbro EN: Flame Libra T125ES)
**Blader:** Yu Tendo | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Libra | 4.2 | 24.0 |
| Fusion Wheel | Flame | 27.0 | 27.0 |
| Spin Track | T125 (Triangle 125) | 1.7 | 6.0 |
| Performance Tip | ES (Eternal Sharp) | 1.5 | 1.5 |
| **Total** | | **34.4** | |

(Face Bolt ~1.4 g excluded per MFB convention. This case covers Sonic Buster's vibration-and-vortex mechanism; Sonic Wave's resonance-amplified variant is covered in Cases 1904–1906.)

**I_total** = 27.0×10⁻³ × 0.027² + 4.2×10⁻³ × 0.024² + 1.7×10⁻³ × 0.006² + 1.5×10⁻³ × 0.0015²
           = 1.968×10⁻⁵ + 2.419×10⁻⁶ + 6.12×10⁻⁸ + 3.375×10⁻⁹
           = **2.217×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Fusion standard launch)
L₀ = I × ω₀ = 2.217×10⁻⁵ × 650 = **1.441×10⁻² kg·m²/s**

---

### 1. T125 Triangular Fins — Arena Vibration Frequency & Sand Destabilization

The T125 (Triangle 125) Spin Track carries 3 triangular protrusions. As Libra spins, each fin delivers a periodic pressure impulse to the arena floor:

```
f_vib = N_fins × ω₀ / (2π) = 3 × 650 / (2π) = 310.4 Hz

F_cent = m_T125 × ω₀² × r_T125 = 1.7×10⁻³ × 650² × 0.006 = 4.310 N  (per fin, centrifugal)

Contact displacement amplitude (compacted arena: k_arena = 2×10⁶ N/m):
A_vib = F_cent / k_arena = 4.310 / 2×10⁶ = 2.155×10⁻⁶ m = 2.155 μm  (per fin pass)
```

At 310.4 Hz the micro-displacement (2.155 μm) repeatedly breaks inter-particle compaction bonds in the granular arena substrate, converting the compacted surface into loose sand within the vibration radius. Opponent μ_sand = 0.45 vs normal μ_normal = 0.30 → Δμ = +0.15:

```
τ_sand_drain = Δμ × m_opp × g × r_tip_opp = 0.15 × 0.038 × 9.81 × 0.005 = 2.796×10⁻⁴ N·m
(additional spin drain torque on opponent in sand zone)
```

---

### 2. ES Bearing Tip & Flame FW — Sustained Acoustic Vortex

The ES (Eternal Sharp) bearing tip enables long-duration spin, sustaining both the T125 vibration and the Flame FW acoustic vortex output:

```
τ_ES    = μ_ES × m × g × r_ES = 0.04 × 0.0344 × 9.81 × 0.0015 = 2.024×10⁻⁵ N·m
t_spin  = L₀ / τ_ES = 1.441×10⁻² / 2.024×10⁻⁵ = 712 s  (≈ 11.9 min sustained vibration)
```

The Flame FW at v_tip generates a Rankine acoustic vortex — the characteristic "terrible shrieking noise":

```
v_tip  = ω₀ × r_FW = 650 × 0.027 = 17.55 m/s

Γ_L    = 2π × v_tip × r_FW = 2π × 17.55 × 0.027 = 2.977 m²/s

At r_opp = 50 mm:
v_L    = Γ_L / (2π × r_opp) = 2.977 / (2π × 0.050) = 9.477 m/s
q_L    = ½ × ρ_air × v_L² = ½ × 1.225 × 9.477² = 55.01 Pa
F_sonic = q_L × A_opp = 55.01 × π × 0.020² = 55.01 × 1.257×10⁻³ = 0.06913 N  (outward)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 34.4 g |
| I_total | 2.217×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.441×10⁻² kg·m²/s |
| v_tip | 17.55 m/s |
| f_vib (T125 3-fin) | 310.4 Hz |
| A_vib | 2.155 μm |
| τ_sand_drain | 2.796×10⁻⁴ N·m |
| Γ_L | 2.977 m²/s |
| F_sonic (r=50mm) | 0.06913 N |
| τ_ES | 2.024×10⁻⁵ N·m |
| t_spin | 712 s |

---

## Case 1902 — SPECIAL: Sonic Buster — Yu Tendo / Flame Libra T125ES

**Blader:** Yu Tendo | **Beyblade:** Flame Libra T125ES | **Type:** attack

### Description

Sonic Buster (originally referred to as "Sonic Wave") is the first special move used by Yu Tendo and his Flame Libra T125ES. Libra vibrates extremely fast, turning the field around it into vulnerable sand. Libra then makes a terrible shrieking noise that pierces the ears of the opponent, delivering an acoustic pressure impulse that disrupts their balance.

### Stage 1 — Arena Sand Destabilization (T125 Vibration Zone)

From Case 1901: f_vib = 310.4 Hz, A_vib = 2.155 μm → arena sand mode within vibration radius.

Sand zone effect on opponent (t_sand = 0.5 s duration):

```
Additional spin drain torque: τ_sand_drain = 2.796×10⁻⁴ N·m
Δω_opp_drain ≈ τ_sand_drain × t_sand / I_opp_est (continuous opponent spin reduction from sand friction)
```

### Stage 2 — Sonic Wave (Acoustic Vortex Impulse, t_wave = 0.5 s)

From Case 1901: F_sonic = 0.06913 N at r_opp = 50 mm.

```
J_sonic = F_sonic × t_wave = 0.06913 × 0.5 = 3.457×10⁻² N·s

Δv_opp = J_sonic / m_opp = 3.457×10⁻² / 0.038 = 0.910 m/s
```

**Effect on Flame Libra (spin drain):**

```
Δω_L    = J_sonic × r_contact / I_L = 3.457×10⁻² × 0.025 / 2.217×10⁻⁵ = 39.0 rad/s
ω_remain = 650 − 39.0 = 611.0 rad/s  (94.0% retained)
```

---

**[M] BeySpirit amplification:**
Yu's Libra bit-beast fully manifests as a green-glowing winged spirit — the T125 vibration amplifies into a true arena-wide sonic collapse that physically disintegrates the opponent's stability while the shrieking shockwave crushes them from all directions.

[M] factor = **7.0 ×** (Yu's Libra sonic spirit)
[M] Δv = 0.910 × 7.0 = **6.4 m/s** (sonic ring-out)

> **Note:** Physical values describe T125 3-fin vibration at 310.4 Hz (A_vib=2.155 μm) converting arena to sand (Δμ=+0.15, τ_drain=2.796×10⁻⁴ N·m on opponent), acoustic vortex F=0.06913 N sustained 0.5s → J=3.457×10⁻² N·s, Δv=0.910 m/s. [M] values represent Yu's Libra spirit amplifying the vibration into a true arena-collapse shockwave. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sonicBusterSpecial(bey: Beyblade, target: Beyblade): void {
  // T125 310.4Hz vibration→sand (A_vib=2.155μm, τ_drain=2.796×10⁻⁴N·m); F_sonic=0.06913N×0.5s→J=3.457×10⁻²N·s; [M] 7.0×
  const J_phys = 0.03457;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Yu Libra sonic spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a multi-fin Spin Track (3+ fins at r ≥ 5 mm, generating floor-contact vibration at f ≥ 300 Hz) combined with a smooth Fusion Wheel (r_FW ≥ 25 mm, generating Rankine vortex F ≥ 0.05 N at r=50 mm) and a low-friction bearing tip (μ ≤ 0.05, t_spin ≥ 600 s) for sustained vibration and acoustic output. Standard game instance: Flame Libra T125ES (Yu Tendo, Metal Fusion).

---

## Case 1903 — COMBO: Sound Burst — Flame Libra

**Sequence:** A ↑ A (attack · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Yu Tendo

### Physics Justification

The first attack (A) fires a partial sonic wave burst (t_wave1 = 0.20 s):

```
J_wave1 = F_sonic × t_wave1 = 0.06913 × 0.20 = 1.383×10⁻² N·s
```

The moveUp (↑) elevates Flame Libra using T125's 125 mm height, raising the vortex output axis for a top-down wave propagation. The higher launch angle concentrates the wave energy on the second attack (T125 height factor: 1.25×):

The second attack (A) fires at T125-height-enhanced amplitude:

```
J_wave2 = J_wave1 × 1.25 = 1.383×10⁻² × 1.25 = 1.729×10⁻² N·s
```

The ES bearing free-spin mechanism reconverts the wave recoil impulse back to spin on the bearing inner race rebound:

```
Δω = η_ES × (J_wave1 + J_wave2) × r_contact / I_L
   = 0.35 × (1.383×10⁻² + 1.729×10⁻²) × 0.025 / 2.217×10⁻⁵
   = 0.35 × 3.112×10⁻² × 0.025 / 2.217×10⁻⁵
   = 0.35 × 35.09
   = +12.3 rad/s  ≈ +12 rad/s
```

(η_ES = 0.35: ES bearing free-spin recoil reconversion — near-frictionless inner race returns more energy than rubber.) Double partial wave with T125 elevation boost gives damageMultiplier **1.20×**. lockMs = 0 (pure wave attack, no dwell).

**Parameters:**
- spinGain: +12 rad/s (ES bearing free-spin recoil η = 0.35)
- damageMultiplier: 1.20 (double partial sonic wave, T125 height boost ×1.25)
- lockMs: 0 (pure attack)

### TypeScript

```typescript
function soundBurstCombo(bey: Beyblade, target: Beyblade): void {
  // ES bearing recoil: Δω ≈ +12 rad/s (η=0.35; J1=1.383×10⁻²+J2=1.729×10⁻²; T125 ×1.25)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Double partial wave + T125 height: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |



---

## Case 1904 — GIMMICK: Flame Libra T125ES — Resonance Amplification & Arena-Wide Sonic Collapse

**Beyblade:** Flame Libra T125ES (TT JP: フレイムリブラT125ES; Hasbro EN: Flame Libra T125ES)
**Blader:** Yu Tendo | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

(Same as Case 1901. Repeated for reference.)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Libra | 4.2 | 24.0 |
| Fusion Wheel | Flame | 27.0 | 27.0 |
| Spin Track | T125 (Triangle 125) | 1.7 | 6.0 |
| Performance Tip | ES (Eternal Sharp) | 1.5 | 1.5 |
| **Total** | | **34.4** | |

(Face Bolt ~1.4 g excluded per MFB convention. This case covers Sonic Wave's resonance-amplified collapse mechanism; the baseline Sonic Buster vibration is covered in Cases 1901–1903.)

**I_total** = 2.217×10⁻⁵ kg·m²  (same as Case 1901)
ω₀ = 650 rad/s | L₀ = 1.441×10⁻² kg·m²/s

---

### 1. T125 Resonance Amplification (Q-factor = 10)

Sonic Wave sustains the T125 vibration long enough for the arena to reach structural resonance — the substrate oscillation frequency (310.4 Hz) couples with the arena bowl's natural frequency. The Q (quality) factor of a rigid-walled stadium arena ≈ 10:

```
A_vib_base    = 2.155×10⁻⁶ m  (per Case 1901: per-fin micro-displacement)

A_resonance   = Q_factor × A_vib_base = 10 × 2.155×10⁻⁶ = 2.155×10⁻⁵ m = 21.55 μm
```

At 21.55 μm amplitude the entire arena substrate (sand/compacted granular fill) transitions to full fluidisation — all inter-particle contact bonds broken over the complete arena floor:

```
r_wave = arena radius = 150 mm  (full arena coverage at resonance)
τ_sand_wave = Δμ × m_opp × g × r_tip_opp = 0.15 × 0.038 × 9.81 × 0.005 = 2.796×10⁻⁴ N·m
(same Δμ = +0.15; full-arena coverage vs. local zone in Sonic Buster)
```

---

### 2. Structural Cyclic Stress — Critical Spin Threshold

The amplified vibration subjects the Flame FW to cyclic bending stress at each oscillation:

```
σ_cyclic = E_ABS × A_resonance / r_FW
         = 2.0×10⁹ × 2.155×10⁻⁵ / 0.027
         = 1.596×10⁶ Pa = 1.596 MPa

Safety factor at full spin:
SF = σ_y_ABS / σ_cyclic = 55×10⁶ / 1.596×10⁶ = 34.5  (safe at ω₀)

Safety factor at 40% spin (ω = 260 rad/s):
A_resonance_low = (260/650)² × 2.155×10⁻⁵ = 0.16 × 2.155×10⁻⁵ = 3.448×10⁻⁶ m
σ_cyclic_low = 2.0×10⁹ × 3.448×10⁻⁶ / 0.027 = 0.2554 MPa  (SF = 215 — safe)
```

The vibration amplitude scales with ω², keeping the bey safe at any spin. The risk is pure spin drain from the extended acoustic output.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 34.4 g |
| I_total | 2.217×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.441×10⁻² kg·m²/s |
| Q_factor | 10 |
| A_vib_base | 2.155 μm |
| A_resonance | 21.55 μm |
| r_wave | 150 mm (full arena) |
| τ_sand_wave | 2.796×10⁻⁴ N·m |
| σ_cyclic (full spin) | 1.596 MPa |
| SF (full spin) | 34.5 |
| τ_ES | 2.024×10⁻⁵ N·m |
| t_spin | 712 s |

---

## Case 1905 — SPECIAL: Sonic Wave — Yu Tendo / Flame Libra T125ES

**Blader:** Yu Tendo | **Beyblade:** Flame Libra T125ES | **Type:** attack

### Description

Sonic Wave is the second and more powerful special move used by Yu Tendo and his Flame Libra T125ES. In this move, Libra creates a massive sonic vortex that expands outward from the arena centre, converting the entire stadium floor into a fluidised sand field. The shrieking sound wave is orders of magnitude more powerful than Sonic Buster — it engulfs the whole arena and has been shown to crack stadium walls and send opponents flying in all directions. Yu first used Sonic Wave during his second battle against Gingka in Metal Fusion.

### Stage 1 — Full-Arena Resonance Sand Collapse (t_sand = 1.0 s)

From Case 1904: A_resonance = 21.55 μm, r_wave = 150 mm (full arena). Opponent fully immersed in fluidised zone for entire move duration.

```
Additional spin drain on opponent during t_sand:
τ_sand_wave = 2.796×10⁻⁴ N·m  (full arena sand mode, same Δμ per Case 1901)
```

### Stage 2 — Extended Sonic Vortex (t_wave = 1.0 s)

From Case 1901: F_sonic = 0.06913 N (Rankine vortex at r_opp = 50 mm). Sustained full second at resonance amplitude:

```
J_sonic_wave = F_sonic × t_wave = 0.06913 × 1.0 = 6.913×10⁻² N·s

Δv_opp = J_sonic_wave / m_opp = 6.913×10⁻² / 0.038 = 1.819 m/s
```

**Effect on Flame Libra (spin drain — extended resonance output):**

```
Δω_L    = J_sonic_wave × r_contact / I_L = 6.913×10⁻² × 0.025 / 2.217×10⁻⁵ = 78.0 rad/s
ω_remain = 650 − 78.0 = 572.0 rad/s  (88.0% retained)
```

---

**[M] BeySpirit amplification:**
Yu's Libra spirit fully manifests in Sonic Wave — the entire arena becomes a resonating instrument of Libra's will, the fluidised sand rises in a column of sound and the shrieking shockwave expands until the stadium walls themselves begin to fracture.

[M] factor = **7.0 ×** (Yu's Libra sonic resonance spirit)
[M] Δv = 1.819 × 7.0 = **12.7 m/s** (arena-wide sonic ring-out)

> **Note:** Physical values describe T125 resonance amplification Q=10, A_resonance=21.55 μm → full-arena sand (r=150mm, τ_drain=2.796×10⁻⁴ N·m on opponent), extended Rankine vortex F=0.06913 N × 1.0s → J=6.913×10⁻² N·s, Δv=1.819 m/s; Libra self-drain Δω=78.0 rad/s. [M] values represent Yu's Libra spirit amplifying the resonance into a true arena-collapse sonic catastrophe. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sonicWaveSpecial(bey: Beyblade, target: Beyblade): void {
  // Q=10 resonance: A_resonance=21.55μm→full-arena sand; F_sonic=0.06913N×1.0s→J=6.913×10⁻²N·s; [M] 7.0×
  const J_phys = 0.06913;
  const primeThreshold = bey.maxSpin * 0.40;
  const selfDrain = bey.spin < primeThreshold ? 156.0 : 78.0; // doubled if below 40% (resonance overload)
  bey.spin = Math.max(0, bey.spin - selfDrain);
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Yu Libra arena-resonance spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a multi-fin Spin Track (3+ fins at r ≥ 5 mm, vibration ≥ 300 Hz) combined with a smooth Fusion Wheel generating Rankine vortex F ≥ 0.05 N at r=50 mm and a bearing tip (μ ≤ 0.05, t_spin ≥ 600 s) — with enough sustained spin for resonance to develop (ω₀ ≥ 600 rad/s and t_active ≥ 1.0 s). Standard game instance: Flame Libra T125ES (Yu Tendo, Metal Fusion).

---

## Case 1906 — COMBO: Resonant Strike — Flame Libra

**Sequence:** K A A (defense · attack · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Yu Tendo

### Physics Justification

The defense input (K) represents Libra sinking into a resonance-prime stance — the ES bearing locks into a rigid-contact mode for one tick, coupling the T125 vibration more efficiently into the floor. This primes the Q-factor from a baseline of Q=3 to Q=6 (doubled resonance depth):

```
A_prime = 6 × 2.155×10⁻⁶ = 1.293×10⁻⁵ m = 12.93 μm  (partial resonance)
```

The first attack (A) fires the primed partial resonance wave (t_wave1 = 0.15 s):

```
J_wave1 = F_sonic × t_wave1 × (A_prime / A_vib_base)_scale
        ≈ 0.06913 × 0.15 × 1.0  (scaled to base F_sonic; partial resonance captured in timing)
        = 1.037×10⁻² N·s
```

The second attack (A) fires a full resonance-boosted wave (t_wave2 = 0.15 s, amplitude gain ×1.5 over first attack from resonance buildup):

```
J_wave2 = J_wave1 × 1.50 = 1.037×10⁻² × 1.50 = 1.556×10⁻² N·s
```

The ES bearing rebound reconverts the resonance wave recoil to spin (η_ES = 0.35):

```
Δω = η_ES × (J_wave1 + J_wave2) × r_contact / I_L
   = 0.35 × (1.037×10⁻² + 1.556×10⁻²) × 0.025 / 2.217×10⁻⁵
   = 0.35 × 2.593×10⁻² × 0.025 / 2.217×10⁻⁵
   = 0.35 × 29.24
   = +10.2 rad/s  ≈ +10 rad/s
```

(η_ES = 0.35: ES bearing near-frictionless inner race rebound.) The resonance-primed double wave gives damageMultiplier **1.20×**. lockMs = 150 (brief resonance dwell — priming cycle holds contact).

**Parameters:**
- spinGain: +10 rad/s (ES bearing resonance recoil η = 0.35)
- damageMultiplier: 1.20 (resonance-primed double partial sonic wave)
- lockMs: 150 (priming stance dwell)

### TypeScript

```typescript
function resonantStrikeCombo(bey: Beyblade, target: Beyblade): void {
  // ES resonance recoil: Δω ≈ +10 rad/s (η=0.35; J1=1.037×10⁻²+J2=1.556×10⁻²; ×1.5 buildup)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 10);
  // Resonance-primed double partial wave: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +10 rad/s (partial) | ✓ |



---

## Case 1907 — GIMMICK: Vortex Ape (Bakuten Shoot) — Flat Tip Charge Sprint & Triboelectric Spark Shield

**Beyblade:** Vortex Ape (Bakuten Shoot: Beyblade)
**Blader:** Dunga | **Series:** Beyblade (Bakuten Shoot, plastic generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Vortex Ape AR | 15.0 | 32.0 |
| Weight Disk | 10-Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | Flat Base (BB) | 2.0 | 3.0 |
| **Total** | | **38.5** | |

(Bit Chip ~1.0 g excluded per plastic-gen convention; contributes negligible I at r ≈ 0.)

**I_total** = 15.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.536×10⁻⁵ + 2.205×10⁻⁵ + 3.500×10⁻⁶ + 1.80×10⁻⁸
           = **4.093×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (plastic-gen Bakuten Shoot standard launch)
L₀ = I × ω₀ = 4.093×10⁻⁵ × 700 = **2.865×10⁻² kg·m²/s**

---

### 1. Flat Blade Base — Charge Sprint (Friction-Driven Run)

The Flat Blade Base has high rubber-contact friction (μ_flat = 0.35) that drives aggressive orbital motion. On the smooth stadium bowl Dunga commands a straight-line charge sprint toward the opponent — friction accelerates the bey from its orbital path into a direct dash:

```
a_flat = μ_flat × g = 0.35 × 9.81 = 3.434 m/s²  (sprint acceleration)

Over sprint distance r_sprint = 0.15 m (half-arena radius):
v_charge = √(2 × a_flat × r_sprint) = √(2 × 3.434 × 0.15) = √(1.030) = 1.015 m/s
```

Flat tip orbital speed and spin decay:

```
v_orbital_flat = μ_flat × ω₀ × r_BB = 0.35 × 700 × 0.003 = 0.735 m/s
τ_flat  = μ_flat × m × g × r_BB = 0.35 × 0.0385 × 9.81 × 0.003 = 3.980×10⁻⁴ N·m
t_spin  = L₀ / τ_flat = 2.865×10⁻² / 3.980×10⁻⁴ = 72.0 s
```

---

### 2. AR Vortex Ape — Triboelectric Spark Shield

The Vortex Ape AR carries wide swept protrusions at r_AR = 32 mm. At ω₀ = 700 rad/s, the blade tips charge triboelectrically by air friction (ABS on air):

```
v_tip = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s

σ_e = ε₀ × E_breakdown × (v_tip / v_ref)
    = 8.854×10⁻¹² × 3×10⁶ × (22.40 / 343)
    = 2.657×10⁻⁵ × 0.06531
    = 1.735×10⁻⁶ C/m²

Contact arc area per blade tip (t_c = 0.5 ms contact, arc width ≈ 5 mm):
A_arc = v_tip × t_c × w_blade = 22.40 × 5×10⁻⁴ × 0.005 = 5.600×10⁻⁵ m²

Q_total = σ_e × A_arc × N_blades  [N_blades = 6 Vortex Ape protrusions]
        = 1.735×10⁻⁶ × 5.600×10⁻⁵ × 6 = 5.830×10⁻¹⁰ C

Gap capacitance at d = 1 mm:
C_gap = ε₀ × A_arc / d = 8.854×10⁻¹² × 5.600×10⁻⁵ / 1×10⁻³ = 4.959×10⁻¹³ F
V_spark = Q_total / C_gap = 5.830×10⁻¹⁰ / 4.959×10⁻¹³ = 1175 V  (> 300 V breakdown → spark)
E_spark = ½ × C_gap × V_spark² = ½ × 4.959×10⁻¹³ × 1175² = 3.424×10⁻⁷ J
```

The spark discharge slightly increases the effective coefficient of restitution at blade contact (electrostatic repulsion adds to mechanical rebound): e_base = 0.65 → e_eff = 0.65 × 1.20 = **0.78** (+20% spark restitution boost).

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 38.5 g |
| I_total | 4.093×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.865×10⁻² kg·m²/s |
| v_tip | 22.40 m/s |
| a_flat | 3.434 m/s² |
| v_charge | 1.015 m/s |
| v_orbital_flat | 0.735 m/s |
| σ_e | 1.735×10⁻⁶ C/m² |
| V_spark | 1175 V |
| E_spark | 3.424×10⁻⁷ J |
| e_eff (with spark) | 0.78 |
| τ_flat | 3.980×10⁻⁴ N·m |
| t_spin | 72.0 s |

---

## Case 1908 — SPECIAL: Spark Hammer — Dunga / Vortex Ape

**Blader:** Dunga | **Beyblade:** Vortex Ape | **Type:** attack

### Description

Spark Hammer (Japanese: スパークハンマー) is a Special Move used by Dunga and his Vortex Ape Beyblade. Dunga commands Vortex Ape to charge in a straight line across the arena at maximum flat-tip speed. As Vortex Ape's AR protrusions charge with static electricity from the high-speed air friction, a ring of sparks surrounds the blade like a shield — the "Spark Hammer" effect. The electrified AR then delivers a hammer-blow collision that sends the opponent flying with extra force from the spark discharge.

### Stage — Flat Tip Sprint + Spark-Enhanced AR Smash

From Case 1907: v_charge = 1.015 m/s, e_eff = 0.78 (spark-boosted restitution).

```
m_eff = (m_VA × m_opp) / (m_VA + m_opp) = (0.0385 × 0.038) / (0.0385 + 0.038)
      = 1.4630×10⁻³ / 0.0765 = 1.912×10⁻² kg

J_spark = m_eff × (1 + e_eff) × v_charge
        = 1.912×10⁻² × 1.78 × 1.015
        = 1.912×10⁻² × 1.8067 = 3.456×10⁻² N·s

Δv_opp = J_spark / m_opp = 3.456×10⁻² / 0.038 = 0.909 m/s
```

**Effect on Vortex Ape (spin drain):**

```
Δω_VA    = J_spark × r_contact / I_VA = 3.456×10⁻² × 0.030 / 4.093×10⁻⁵ = 25.3 rad/s
ω_remain = 700 − 25.3 = 674.7 rad/s  (96.4% retained)
```

---

**[M] BeySpirit amplification:**
Dunga's Ape Bit-Beast fully charges the Vortex Ape AR into a crackling ball of lightning — the spark shield becomes a true electrical storm that hammers the opponent with both physical smash force and a full electrostatic discharge blast.

[M] factor = **7.0 ×** (Dunga Ape spirit electric storm)
[M] Δv = 0.909 × 7.0 = **6.4 m/s** (spark hammer ring-out)

> **Note:** Physical values describe flat-tip sprint a=3.434 m/s² over 0.15m → v_charge=1.015 m/s, triboelectric spark e_boost=+20% (e_eff=0.78), J=3.456×10⁻² N·s, Δv=0.909 m/s. [M] values represent Dunga's Ape spirit igniting the full Spark Hammer lightning blast. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sparkHammerSpecial(bey: Beyblade, target: Beyblade): void {
  // Flat sprint a=3.434m/s²×0.15m→v=1.015m/s; spark e_eff=0.78 (+20%); J=3.456×10⁻²N·s; [M] 7.0×
  const J_phys = 0.03456;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Dunga Ape electric storm)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a Flat Blade Base (or equivalent flat-contact tip, μ ≥ 0.30) combined with an Attack Ring carrying 6+ swept protrusions at r_AR ≥ 30 mm (generating triboelectric spark at v_tip ≥ 20 m/s, V_spark ≥ 300 V). The flat tip drives the charge sprint; AR spark discharges at contact for +20% restitution. Standard game instance: Vortex Ape (Dunga, Bakuten Shoot Beyblade).

---

## Case 1909 — COMBO: Electric Charge — Vortex Ape

**Sequence:** → J A (moveRight · jump · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Dunga

### Physics Justification

The moveRight (→) begins the flat-tip sprint across the arena (partial charge, r_partial = 0.075 m — half the full sprint distance):

```
v_partial = √(2 × a_flat × r_partial) = √(2 × 3.434 × 0.075) = √(0.5151) = 0.7177 m/s
```

The jump (J) is a short hop — the flat base bounces off the arena floor (elastic contact, e_hop = 0.40):

```
v_hop = e_hop × v_orbital_flat = 0.40 × 0.735 = 0.294 m/s  (upward)
h_hop = v_hop² / (2g) = 0.294² / 19.62 = 4.4 mm
```

The attack (A) fires at landing from the hop, combining the sprint approach velocity with the descent re-entry speed:

```
v_impact = √(v_partial² + 2g × h_hop)
         = √(0.7177² + 2 × 9.81 × 0.0044)
         = √(0.5151 + 0.08632)
         = √0.6014 = 0.7755 m/s

J_elec = m_eff × (1 + e_eff) × v_impact = 1.912×10⁻² × 1.78 × 0.7755
       = 1.912×10⁻² × 1.3804 = 2.640×10⁻² N·s
```

The flat base friction rebound on landing reconverts contact impulse to spin:

```
Δω = η_flat × J_elec × r_contact / I_VA
   = 0.28 × 2.640×10⁻² × 0.030 / 4.093×10⁻⁵
   = 0.28 × 7.920×10⁻⁴ / 4.093×10⁻⁵
   = 0.28 × 19.35
   = +5.4 rad/s  ≈ +5 rad/s
```

(η_flat = 0.28: flat tip moderate-rebound recoil reconversion.) The sprint-hop-smash AR contact gives damageMultiplier **1.25×**. lockMs = 0 (pure attack dash, no dwell).

**Parameters:**
- spinGain: +5 rad/s (flat base hop rebound η = 0.28)
- damageMultiplier: 1.25 (sprint-hop spark AR smash)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function electricChargeCombo(bey: Beyblade, target: Beyblade): void {
  // Flat hop rebound: Δω ≈ +5 rad/s (η=0.28, h_hop=4.4mm, v_impact=0.7755m/s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 5);
  // Sprint-hop spark AR smash: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +5 rad/s (partial) | ✓ |



---

## Case 1910 — GIMMICK: Dranzer F (Bakuten Shoot) — Wing AR Lift & Aerial Overhead Descent Strike

**Beyblade:** Dranzer F (Bakuten Shoot: Beyblade)
**Blader:** Kai Hiwatari | **Series:** Beyblade (Bakuten Shoot, plastic generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Dranzer (4-wing phoenix) | 14.0 | 32.0 |
| Weight Disk | Circle Balance | 14.0 | 34.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | Flat Base (BB) | 2.0 | 3.0 |
| **Total** | | **33.5** | |

(Bit Chip ~1.0 g excluded per plastic-gen convention.)

**I_total** = 14.0×10⁻³ × 0.032² + 14.0×10⁻³ × 0.034² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.434×10⁻⁵ + 1.619×10⁻⁵ + 3.500×10⁻⁶ + 1.80×10⁻⁸
           = **3.405×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (plastic-gen standard launch)
L₀ = I × ω₀ = 3.405×10⁻⁵ × 700 = **2.384×10⁻² kg·m²/s**

---

### 1. Dranzer AR — Four-Wing Lift Force

The Dranzer Attack Ring carries four swept phoenix-wing protrusions designed to generate aerodynamic lift at high spin. Each wing is modelled as a flat-plate aerofoil (C_L = 0.6, A_wing = 1.2×10⁻⁴ m² per wing):

```
v_tip = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s

F_lift_total = N_wings × ½ × ρ_air × v_tip² × C_L × A_wing
             = 4 × ½ × 1.225 × 22.40² × 0.6 × 1.2×10⁻⁴
             = 4 × ½ × 1.225 × 501.76 × 7.2×10⁻⁵
             = 4 × 2.218×10⁻² = 8.871×10⁻² N

Weight: W = m × g = 0.0335 × 9.81 = 0.3286 N

Lift fraction: F_lift / W = 8.871×10⁻² / 0.3286 = 26.99%  ≈ 27%
```

Effective gravity during upward flight (lift partially opposes gravity):

```
g_eff = g × (1 − F_lift / W) = 9.81 × (1 − 0.2699) = 9.81 × 0.7301 = 7.165 m/s²
```

---

### 2. Bowl-Exit Trajectory — Apex Height & Descent Strike

Dranzer F uses the bowl wall to redirect from horizontal orbit into a vertical launch (bowl wall angle θ = 60°):

```
v_orbital = μ_flat × ω₀ × r_BB = 0.35 × 700 × 0.003 = 0.735 m/s

v_z (upward at bowl exit) = v_orbital × tan(60°) = 0.735 × 1.732 = 1.273 m/s

Apex height (under g_eff — lift active during ascent):
h_apex = v_z² / (2 × g_eff) = 1.273² / (2 × 7.165) = 1.6205 / 14.330 = 113.1 mm ≈ 113 mm

Descent velocity (full g — lift decays as spin reduces at apex):
v_descent = √(2 × g × h_apex) = √(2 × 9.81 × 0.1131) = √(2.219) = 1.490 m/s

Combined impact velocity (orbital component + descent):
v_impact = √(v_orbital² + v_descent²) = √(0.735² + 1.490²) = √(0.5402 + 2.2201) = √2.7603 = 1.661 m/s
```

**Flat base spin decay:**

```
τ_flat  = μ_flat × m × g × r_BB = 0.35 × 0.0335 × 9.81 × 0.003 = 3.461×10⁻⁴ N·m
t_spin  = L₀ / τ_flat = 2.384×10⁻² / 3.461×10⁻⁴ = 68.9 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 33.5 g |
| I_total | 3.405×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.384×10⁻² kg·m²/s |
| v_tip | 22.40 m/s |
| F_lift_total | 8.871×10⁻² N |
| Lift fraction | 27% |
| g_eff | 7.165 m/s² |
| v_orbital | 0.735 m/s |
| v_z | 1.273 m/s |
| h_apex | 113 mm |
| v_descent | 1.490 m/s |
| v_impact | 1.661 m/s |
| τ_flat | 3.461×10⁻⁴ N·m |
| t_spin | 68.9 s |

---

## Case 1911 — SPECIAL: Spin Fire — Kai Hiwatari / Dranzer F

**Blader:** Kai Hiwatari | **Beyblade:** Dranzer F | **Type:** attack

### Description

Spin Fire is a Special Move used by Kai Hiwatari and his Dranzer F Beyblade. Dranzer rides the bowl wall and launches high into the air, its four phoenix wings generating enough lift to carry it to a significant apex height before it crashes back down on the opponent from above in a blazing overhead strike. The Flat Base drives a high-speed orbital approach, the bowl wall redirects into a vertical launch, and Dranzer descends like a meteor. This move is similar in mechanism to Mountain Cat Attack — a high-angle bowl-wall launch into an aerial overhead smash — but Dranzer's wing lift extends the apex height considerably. Kai first used Spin Fire in his earliest battles in Bakuten Shoot Season 1.

### Stage — Bowl-Wall Launch + Wing-Lift Aerial Overhead Descent Strike

From Case 1910: v_impact = 1.661 m/s (orbital + wing-lift ascent + full-g descent), e = 0.75 (hard ABS AR smash blades).

```
m_eff = (m_D × m_opp) / (m_D + m_opp) = (0.0335 × 0.038) / (0.0335 + 0.038)
      = 1.273×10⁻³ / 0.0715 = 1.780×10⁻² kg

J_spinfire = m_eff × (1 + e) × v_impact
           = 1.780×10⁻² × 1.75 × 1.661
           = 1.780×10⁻² × 2.9068 = 5.174×10⁻² N·s

Δv_opp = J_spinfire / m_opp = 5.174×10⁻² / 0.038 = 1.361 m/s
```

**Effect on Dranzer F (spin drain):**

```
Δω_D    = J_spinfire × r_contact / I_D = 5.174×10⁻² × 0.030 / 3.405×10⁻⁵ = 45.6 rad/s
ω_remain = 700 − 45.6 = 654.4 rad/s  (93.5% retained)
```

---

**[M] BeySpirit amplification:**
Kai's Dranzer Bit-Beast fully materialises as a blazing phoenix — the wings ignite with spirit fire at the apex, the descent becomes a true meteor strike that hurls the opponent out of the stadium in a column of flames.

[M] factor = **8.0 ×** (Kai Hiwatari — Dranzer phoenix fire spirit, iconic move)
[M] Δv = 1.361 × 8.0 = **10.9 m/s** (phoenix fire ring-out)

> **Note:** Physical values describe four-wing lift F=8.871×10⁻² N (27% weight), g_eff=7.165 m/s², bowl-wall launch v_z=1.273 m/s, h_apex=113 mm, v_impact=1.661 m/s, impulse J=5.174×10⁻² N·s, Δv=1.361 m/s. [M] values represent Kai's Dranzer phoenix spirit igniting the aerial descent into a blazing meteor strike. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spinFireSpecial(bey: Beyblade, target: Beyblade): void {
  // 4-wing lift 27%→g_eff=7.165m/s²; bowl launch v_z=1.273m/s→h=113mm; v_impact=1.661m/s; J=5.174×10⁻²N·s; [M] 8.0×
  const J_phys = 0.05174;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Kai Dranzer phoenix fire spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a flat-contact Blade Base (μ ≥ 0.30) combined with an Attack Ring carrying 4+ upward-angled wing protrusions at r_AR ≥ 30 mm generating measurable lift (F_lift ≥ 0.06 N at ω₀ ≥ 680 rad/s), launched via a 50–70° bowl wall for vertical ascent. Standard game instance: Dranzer F (Kai Hiwatari, Bakuten Shoot Beyblade).

---

## Case 1912 — COMBO: Flame Dive — Dranzer F

**Sequence:** ↑ A K (moveUp · attack · defense)
**Cost:** 15 | **Type:** attack | **Blader:** Kai Hiwatari

### Physics Justification

The moveUp (↑) launches Dranzer F up the bowl wall at half-orbit speed (v_partial = v_orbital × 0.5 = 0.735 × 0.5 = 0.3675 m/s). With wing lift active, this gives a partial ascent:

```
v_z_partial = v_partial × tan(60°) = 0.3675 × 1.732 = 0.6365 m/s

h_partial = v_z_partial² / (2 × g_eff) = 0.6365² / (2 × 7.165) = 0.4051 / 14.330 = 28.3 mm
```

The attack (A) fires at descent apex — Dranzer strikes downward at v_descent_partial:

```
v_descent_partial = √(2 × g × h_partial) = √(2 × 9.81 × 0.0283) = √(0.5553) = 0.7452 m/s

v_impact_partial = √(v_partial² + v_descent_partial²) = √(0.3675² + 0.7452²)
                 = √(0.1351 + 0.5553) = √0.6904 = 0.8309 m/s

J_partial = m_eff × (1 + e) × v_impact_partial = 1.780×10⁻² × 1.75 × 0.8309
          = 1.780×10⁻² × 1.4541 = 2.588×10⁻² N·s
```

The defense (K) is the wing-guard follow-through — Dranzer angles the phoenix wings downward on contact, shielding from counter-strike and reconverting contact recoil to spin (η_wing = 0.30, wing deflects recoil into rotation):

```
Δω = η_wing × J_partial × r_contact / I_D
   = 0.30 × 2.588×10⁻² × 0.030 / 3.405×10⁻⁵
   = 0.30 × 7.764×10⁻⁴ / 3.405×10⁻⁵
   = 0.30 × 22.80
   = +6.8 rad/s  ≈ +7 rad/s
```

(η_wing = 0.30: phoenix wing deflection recoil reconversion.) The partial aerial dive with wing-guard gives damageMultiplier **1.25×**. lockMs = 100 (wing-guard hold on landing).

**Parameters:**
- spinGain: +7 rad/s (wing deflection recoil η = 0.30)
- damageMultiplier: 1.25 (partial aerial overhead dive with wing guard)
- lockMs: 100 (wing-guard dwell)

### TypeScript

```typescript
function flameDiveCombo(bey: Beyblade, target: Beyblade): void {
  // Wing recoil: Δω ≈ +7 rad/s (η=0.30, h_partial=28.3mm, J=2.588×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 7);
  // Partial aerial dive + wing guard: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +7 rad/s (partial) | ✓ |



---

## Case 1913 — GIMMICK: Thermal Lacerta WA130HF — WA130 Wing-Arm Sweep & HF Aggressive Orbit

**Beyblade:** Thermal Lacerta WA130HF (TT JP: サーマルラセルタWA130HF; Hasbro EN: Thermal Lacerta WA130HF)
**Blader:** Chiyun Li | **Series:** Beyblade: Metal Masters (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Lacerta | 4.0 | 24.0 |
| Fusion Wheel | Thermal | 29.0 | 28.0 |
| Spin Track | WA130 (Wing Attack 130) | 3.5 | 14.0 |
| Performance Tip | HF (High Flat) | 0.9 | 3.5 |
| **Total** | | **37.4** | |

(Face Bolt ~1.4 g excluded per MFB convention.)

**I_total** = 29.0×10⁻³ × 0.028² + 4.0×10⁻³ × 0.024² + 3.5×10⁻³ × 0.014² + 0.9×10⁻³ × 0.0035²
           = 2.274×10⁻⁵ + 2.304×10⁻⁶ + 6.860×10⁻⁷ + 1.103×10⁻⁸
           = **2.580×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Masters standard launch)
L₀ = I × ω₀ = 2.580×10⁻⁵ × 650 = **1.677×10⁻² kg·m²/s**

---

### 1. WA130 Wing Attack Spin Track — Lateral Wing Sweep

The WA130 (Wing Attack 130) Spin Track extends two wide lateral arms perpendicular to the spin axis at 130 mm height. Each arm (length L_arm = 20 mm, width w_arm = 8 mm, A_arm = 1.600×10⁻⁴ m²) sweeps through the air and contacts the opponent's lower track/tip region on close approach — a lateral tail-sweep attack at mid-height.

**Wing-arm tip velocity:**

```
v_arm = ω₀ × r_arm_tip = 650 × (0.028 + 0.020) = 650 × 0.048 = 31.20 m/s
```

**Wing-arm aerodynamic lateral sweep force (drag mode on approach):**

```
F_sweep = ½ × ρ_air × v_arm² × C_D × A_arm × N_arms
        = ½ × 1.225 × 31.20² × 1.2 × 1.600×10⁻⁴ × 2
        = ½ × 1.225 × 973.44 × 1.2 × 3.200×10⁻⁴
        = ½ × 1.225 × 973.44 × 3.840×10⁻⁴
        = 0.2289 N  (lateral sweep force per pass)
```

**Wing-arm impact impulse (contact duration t_c = 2 ms):**

```
J_sweep = F_sweep × t_c = 0.2289 × 2×10⁻³ = 4.578×10⁻⁴ N·s  (per arm contact)
```

---

### 2. HF (High Flat) Tip — Aggressive Orbit Drive

The HF tip combines sharp-center focus with a flat ring surround (μ_HF = 0.30, r_HF = 3.5 mm) for fast aggressive orbit with controlled destabilisation bursts:

```
v_orbital_HF = μ_HF × ω₀ × r_HF = 0.30 × 650 × 0.0035 = 0.6825 m/s

τ_HF   = μ_HF × m × g × r_HF = 0.30 × 0.0374 × 9.81 × 0.0035 = 3.858×10⁻⁴ N·m
t_spin = L₀ / τ_HF = 1.677×10⁻² / 3.858×10⁻⁴ = 43.5 s
```

**Combined impact velocity (HF orbital + WA130 arm sweep lateral component):**

```
v_impact = √(v_orbital_HF² + (F_sweep × t_c / m)²)
         = √(0.6825² + (4.578×10⁻⁴ / 0.0374)²)
         = √(0.4658 + (1.224×10⁻²)²)
         = √(0.4658 + 1.498×10⁻⁴)
         = √0.4660 = 0.6826 m/s  ≈ 0.683 m/s  (WA130 arm sweep lateral component minor vs orbital)
```

For the Tempestuous Whirlwind Sword slam the dominant component is the full-body overhead slam entry, modelled as orbital v_orbital_HF = 0.6825 m/s direct approach with e = 0.75.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.4 g |
| I_total | 2.580×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.677×10⁻² kg·m²/s |
| v_arm | 31.20 m/s |
| F_sweep | 0.2289 N |
| J_sweep | 4.578×10⁻⁴ N·s (per arm) |
| v_orbital_HF | 0.6825 m/s |
| v_impact | 0.683 m/s |
| τ_HF | 3.858×10⁻⁴ N·m |
| t_spin | 43.5 s |

---

## Case 1914 — SPECIAL: Tempestuous Whirlwind Sword — Chiyun Li / Thermal Lacerta WA130HF

**Blader:** Chiyun Li | **Beyblade:** Thermal Lacerta WA130HF | **Type:** attack

### Description

Tempestuous Whirlwind Sword (Japanese: 疾風迅雷剣, Shippū Jinrai Ken) is the third and most powerful Special Move used by Chiyun Li and his Thermal Lacerta WA130HF. Chiyun Li summons Lacerta to slash with its tail, slamming the opponent with serious damage while the bey attacks covered in a pink aura. The WA130 wing arms generate the sweeping "tail slash" lateral impact, and the pink aura is the aerodynamic wake shed from the rapidly rotating wing tips. Chiyun Li first used this move to counter Tsubasa's Diving Crush.

### Stage — WA130 Wing-Arm Tail Slash + HF Orbital Approach Slam

The Tempestuous Whirlwind Sword is a two-component strike: the WA130 wing-arms deliver the lateral "tail slash" sweep while the HF-driven orbital approach contributes the body slam. Combined entry velocity:

```
v_combined = √(v_orbital_HF² + v_arm_lateral²)
```

Lateral velocity from WA130 arm sweep impulse applied to body:

```
v_arm_lateral = J_sweep × N_arms / m = (4.578×10⁻⁴ × 2) / 0.0374 = 9.156×10⁻⁴ / 0.0374 = 0.02448 m/s

v_combined = √(0.6825² + 0.02448²) = √(0.4658 + 5.99×10⁻⁴) ≈ 0.6829 m/s
```

Using v_combined ≈ 0.683 m/s and e = 0.75 (hard Thermal FW smash):

```
m_eff = (m_TL × m_opp) / (m_TL + m_opp) = (0.0374 × 0.038) / (0.0374 + 0.038)
      = 1.4212×10⁻³ / 0.0754 = 1.885×10⁻² kg

J_whirlwind = m_eff × (1 + e) × v_combined
            = 1.885×10⁻² × 1.75 × 0.683
            = 1.885×10⁻² × 1.1953 = 2.253×10⁻² N·s

Δv_opp = J_whirlwind / m_opp = 2.253×10⁻² / 0.038 = 0.593 m/s
```

**Effect on Thermal Lacerta (spin drain):**

```
Δω_TL    = J_whirlwind × r_contact / I_TL = 2.253×10⁻² × 0.025 / 2.580×10⁻⁵ = 21.8 rad/s
ω_remain = 650 − 21.8 = 628.2 rad/s  (96.6% retained)
```

---

**[M] BeySpirit amplification:**
Chiyun Li's Lacerta Bit-Beast materialises as a great lizard spirit wreathed in a pink tempest aura — the WA130 wing arms become Lacerta's slashing tail, and the full Thermal FW body becomes a whirlwind blade that sweeps the opponent from the arena in a devastating pink storm.

[M] factor = **7.0 ×** (Chiyun Li — Lacerta pink tempest spirit)
[M] Δv = 0.593 × 7.0 = **4.2 m/s** (whirlwind sword ring-out)

> **Note:** Physical values describe WA130 arm sweep F=0.2289 N (J=4.578×10⁻⁴ N·s per arm, t_c=2ms), HF orbital v=0.6825 m/s, combined v_combined=0.683 m/s, total impulse J=2.253×10⁻² N·s, Δv=0.593 m/s. [M] values represent Chiyun Li's Lacerta spirit manifesting the WA130 arms as a dragon tail slash through a pink tempest aura. Combos do not receive [M] amplification.

### TypeScript

```typescript
function tempestuousWhirlwindSwordSpecial(bey: Beyblade, target: Beyblade): void {
  // WA130 wing sweep F=0.2289N t_c=2ms; HF orbital v=0.6825m/s; J=2.253×10⁻²N·s; [M] 7.0×
  const J_phys = 0.02253;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Chiyun Li Lacerta pink tempest spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a WA (Wing Attack) Spin Track (WA130 or equivalent, arm extension ≥ 15 mm beyond r_FW, A_arm ≥ 1.2×10⁻⁴ m² per arm, sweep F ≥ 0.15 N) combined with an aggressive flat/high-flat tip (μ ≥ 0.25, v_orbital ≥ 0.60 m/s). The wing arms must reach the opponent's lower track level for lateral tail-sweep contact. Standard game instance: Thermal Lacerta WA130HF (Chiyun Li, Metal Masters).

---

## Case 1915 — COMBO: Lacerta Slash — Thermal Lacerta

**Sequence:** → ↑ A (moveRight · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Chiyun Li

### Physics Justification

The moveRight (→) drives HF aggressive orbit approach (v_partial = v_orbital_HF × 0.70 = 0.6825 × 0.70 = 0.4778 m/s orbital component):

```
v_approach = 0.4778 m/s
```

The moveUp (↑) raises Lacerta's contact height along the WA130 130 mm track, maximising the wing-arm sweep arc. The elevation channels the lateral arm sweep more directly onto the target (height focus factor: 1.15×):

The attack (A) fires the WA130 arm sweep + orbital approach combined:

```
J_sweep_combo = F_sweep × t_c × 1.15  (height focus boost)
              = 0.2289 × 2×10⁻³ × 1.15 = 5.265×10⁻⁴ N·s  (per arm × 2 arms)

v_arm_lateral_combo = (5.265×10⁻⁴ × 2) / 0.0374 = 1.053×10⁻³ / 0.0374 = 0.02815 m/s

v_impact_combo = √(v_approach² + v_arm_lateral_combo²)
               = √(0.4778² + 0.02815²)
               = √(0.2283 + 7.92×10⁻⁴)
               ≈ 0.4786 m/s

J_slash = m_eff × (1 + e) × v_impact_combo = 1.885×10⁻² × 1.75 × 0.4786
        = 1.885×10⁻² × 0.8375 = 1.579×10⁻² N·s
```

The HF tip high-flat contact on landing reconverts the lateral arm sweep recoil to spin (η_HF = 0.28):

```
Δω = η_HF × J_slash × r_contact / I_TL
   = 0.28 × 1.579×10⁻² × 0.025 / 2.580×10⁻⁵
   = 0.28 × 3.948×10⁻⁴ / 2.580×10⁻⁵
   = 0.28 × 15.30
   = +4.3 rad/s  ≈ +4 rad/s
```

(η_HF = 0.28: HF flat contact rebound lateral arm recoil reconversion.) The WA130 height-focused wing sweep gives damageMultiplier **1.20×**. lockMs = 0 (pure attack sweep, no lock phase).

**Parameters:**
- spinGain: +4 rad/s (HF lateral arm recoil η = 0.28)
- damageMultiplier: 1.20 (WA130 height-focused wing sweep attack)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function lacertaSlashCombo(bey: Beyblade, target: Beyblade): void {
  // HF arm recoil: Δω ≈ +4 rad/s (η=0.28, J=1.579×10⁻²N·s, WA130 ×1.15 height boost)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 4);
  // WA130 height-focused sweep: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +4 rad/s (partial) | ✓ |



---

## Case 1916 — GIMMICK: Dranzer MF (Wing Attacker CWD) — CWD Wide-Wing Aerodynamic Amplification & Phoenix Fire Column

**Beyblade:** Dranzer MF with Wing Attacker CWD (TT JP: ドランザーMF ウィングアタッカーCWD)
**Blader:** Kai Hiwatari | **Series:** Beyblade (Bakuten Shoot manga, final chapter)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Dranzer MS (Metal System) | 16.0 | 33.0 |
| Weight Disk | Wing Attacker CWD | 22.0 | 38.0 |
| Spin Gear | Right SG (Metal) | 4.5 | 10.0 |
| Blade Base | Metal Flat Base (MFB) | 3.0 | 3.0 |
| **Total** | | **45.5** | |

(Bit Chip ~1.0 g excluded per plastic-gen convention. Wing Attacker CWD is a Customize Weight Disk with wide-span aerodynamic wings at maximum radius — the manga's final special move.)

**I_total** = 16.0×10⁻³ × 0.033² + 22.0×10⁻³ × 0.038² + 4.5×10⁻³ × 0.010² + 3.0×10⁻³ × 0.003²
           = 1.742×10⁻⁵ + 3.178×10⁻⁵ + 4.500×10⁻⁶ + 2.70×10⁻⁸
           = **5.398×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (plastic-gen Bakuten Shoot standard launch)
L₀ = I × ω₀ = 5.398×10⁻⁵ × 700 = **3.779×10⁻² kg·m²/s**

---

### 1. Wing Attacker CWD — Wide-Wing Aerodynamic Amplification

The Wing Attacker CWD extends four wide aerodynamic wings at r_CWD = 38 mm. Each wing (A_wing = 2.0×10⁻⁴ m² per wing, C_L = 0.6) generates lift at high spin:

```
v_CWD_tip = ω₀ × r_CWD = 700 × 0.038 = 26.60 m/s

F_lift_CWD = N_wings × ½ × ρ_air × v_CWD_tip² × C_L × A_wing
           = 4 × ½ × 1.225 × 26.60² × 0.6 × 2.0×10⁻⁴
           = 4 × ½ × 1.225 × 707.56 × 1.2×10⁻⁴
           = 4 × 5.199×10⁻² = 0.2080 N

Weight: W = m × g = 0.0455 × 9.81 = 0.4465 N

Lift fraction: F_lift_CWD / W = 0.2080 / 0.4465 = 46.6%
```

Effective gravity during ascent:

```
g_eff_MF = g × (1 − F_lift_CWD / W) = 9.81 × (1 − 0.466) = 9.81 × 0.534 = 5.239 m/s²
```

---

### 2. Bowl-Exit Trajectory — Phoenix Fire Ascent

Dranzer MF uses the bowl wall (θ = 65°) for maximum vertical launch:

```
v_orbital_MF = μ_flat × ω₀ × r_BB = 0.35 × 700 × 0.003 = 0.735 m/s

v_z_MF = v_orbital_MF × tan(65°) = 0.735 × 2.145 = 1.577 m/s

h_apex_MF = v_z_MF² / (2 × g_eff_MF) = 1.577² / (2 × 5.239) = 2.487 / 10.478 = 237.3 mm ≈ 237 mm
```

Descent (full g, CWD lift diminished as spin decays at apex):

```
v_descent_MF = √(2 × g × h_apex_MF) = √(2 × 9.81 × 0.2373) = √(4.655) = 2.157 m/s

v_impact_MF = √(v_orbital_MF² + v_descent_MF²) = √(0.735² + 2.157²) = √(0.5402 + 4.6527) = √5.193 = 2.279 m/s
```

**Metal Flat Base spin decay:**

```
τ_MFB  = μ_flat × m × g × r_BB = 0.35 × 0.0455 × 9.81 × 0.003 = 4.698×10⁻⁴ N·m
t_spin = L₀ / τ_MFB = 3.779×10⁻² / 4.698×10⁻⁴ = 80.4 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 45.5 g |
| I_total | 5.398×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 3.779×10⁻² kg·m²/s |
| v_CWD_tip | 26.60 m/s |
| F_lift_CWD | 0.2080 N |
| Lift fraction | 46.6% |
| g_eff_MF | 5.239 m/s² |
| v_orbital_MF | 0.735 m/s |
| v_z_MF | 1.577 m/s |
| h_apex_MF | 237 mm |
| v_descent_MF | 2.157 m/s |
| v_impact_MF | 2.279 m/s |
| τ_MFB | 4.698×10⁻⁴ N·m |
| t_spin | 80.4 s |

---

## Case 1917 — SPECIAL: The End of Fire — Kai Hiwatari / Dranzer MF

**Blader:** Kai Hiwatari | **Beyblade:** Dranzer MF (Wing Attacker CWD) | **Type:** attack

### Description

The End of Fire (Japanese: 爆風炎撃, Bakufū Engeki — "Explosive Wind Fire Strike") is a Special Move used by Kai Hiwatari with his Dranzer MF Beyblade, debuting in the final chapter of the Bakuten Shoot Beyblade manga. Kai and Dranzer combine their full power into a swirling mass of fire — Dranzer rises from the flames like a phoenix reborn and descends in a catastrophic explosive strike. The Wing Attacker CWD provides massive aerodynamic lift that launches Dranzer to an unprecedented apex height of 237 mm, and the descent impacts with full gravitational energy amplified by the CWD mass. The explosion looks like Dranzer rising from its own ashes, combining the power of both Kai and Dranzer in a final burst.

### Stage — CWD Wing-Lift Phoenix Ascent + Catastrophic Fire-Column Descent

From Case 1916: v_impact_MF = 2.279 m/s, e = 0.80 (maximum energy — manga finale move, hardest ABS/metal contact).

```
m_eff = (m_DMF × m_opp) / (m_DMF + m_opp) = (0.0455 × 0.038) / (0.0455 + 0.038)
      = 1.729×10⁻³ / 0.0835 = 2.071×10⁻² kg

J_endfire = m_eff × (1 + e) × v_impact_MF
          = 2.071×10⁻² × 1.80 × 2.279
          = 2.071×10⁻² × 4.1022 = 8.495×10⁻² N·s

Δv_opp = J_endfire / m_opp = 8.495×10⁻² / 0.038 = 2.235 m/s
```

**Effect on Dranzer MF (spin drain):**

```
Δω_DMF   = J_endfire × r_contact / I_DMF = 8.495×10⁻² × 0.035 / 5.398×10⁻⁵ = 55.1 rad/s
ω_remain = 700 − 55.1 = 644.9 rad/s  (92.1% retained)
```

---

**[M] BeySpirit amplification:**
Kai and Dranzer's spirits fully merge into one at the climax of the manga — the Wing Attacker CWD ignites with all of Dranzer's fire energy as the phoenix rises from the ashes and descends in a catastrophic explosion that consumes the entire arena in flame.

[M] factor = **9.0 ×** (Kai + Dranzer ultimate dual-spirit fusion — manga finale)
[M] Δv = 2.235 × 9.0 = **20.1 m/s** (phoenix fire annihilation)

> **Note:** Physical values describe Wing Attacker CWD 4-wing lift F=0.2080 N (46.6% weight), g_eff=5.239 m/s², bowl launch v_z=1.577 m/s, h_apex=237 mm, v_impact=2.279 m/s, impulse J=8.495×10⁻² N·s, Δv=2.235 m/s. [M] values represent Kai and Dranzer's ultimate spirit fusion in the manga finale — a dual-spirit phoenix fire explosion. Combos do not receive [M] amplification.

### TypeScript

```typescript
function endOfFireSpecial(bey: Beyblade, target: Beyblade): void {
  // CWD 4-wing lift 46.6%→g_eff=5.239m/s²; bowl launch h_apex=237mm; v_impact=2.279m/s; J=8.495×10⁻²N·s; [M] 9.0×
  const J_phys = 0.08495;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 9.0; // [M] BeySpirit 9.0× (Kai+Dranzer ultimate dual-spirit manga finale)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a Wing Attacker CWD (or equivalent maximum-radius aerodynamic weight disk, r_CWD ≥ 36 mm, 4+ wings, A_wing ≥ 1.8×10⁻⁴ m², F_lift ≥ 0.18 N) combined with a flat-contact Metal Base (μ ≥ 0.30) and a large-radius AR (r_AR ≥ 30 mm) on a bowl wall θ ≥ 60°. CWD lift fraction must reach ≥ 40% of weight for valid phoenix ascent. Standard game instance: Dranzer MF with Wing Attacker CWD (Kai Hiwatari, Bakuten Shoot manga finale).

---

## Case 1918 — COMBO: Ash Rise — Dranzer MF

**Sequence:** ↑ ↑ A (moveUp · moveUp · attack)
**Cost:** 35 | **Type:** attack | **Blader:** Kai Hiwatari

### Physics Justification

The first moveUp (↑) launches Dranzer MF onto the bowl wall in rising-flame mode — partial CWD lift elevation (h_partial_1 = h_apex_MF × 0.25 = 237 × 0.25 = 59.3 mm):

```
v_z_1 = √(2 × g_eff_MF × h_partial_1) = √(2 × 5.239 × 0.0593) = √(0.6213) = 0.7882 m/s

v_descent_1 = √(2 × g × h_partial_1) = √(2 × 9.81 × 0.0593) = √(1.164) = 1.079 m/s
```

The second moveUp (↑) is the Dranzer ash-rise — Dranzer ascends from the bowl a second time using the residual CWD lift, reaching second-stage height (h_partial_2 = h_apex_MF × 0.50 = 118.5 mm):

```
v_z_2 = √(2 × g_eff_MF × h_partial_2) = √(2 × 5.239 × 0.1185) = √(1.2417) = 1.1143 m/s

v_descent_2 = √(2 × g × h_partial_2) = √(2 × 9.81 × 0.1185) = √(2.325) = 1.525 m/s
```

The attack (A) fires the combined dual-stage descent strike:

```
v_impact_ash = √(v_orbital_MF² + v_descent_2²) = √(0.735² + 1.525²) = √(0.5402 + 2.3256) = √2.8658 = 1.693 m/s

J_ash = m_eff × (1 + e) × v_impact_ash = 2.071×10⁻² × 1.80 × 1.693
      = 2.071×10⁻² × 3.0474 = 6.311×10⁻² N·s
```

The Metal Flat Base rebounds on landing with CWD angular momentum transfer (η_CWD = 0.32):

```
Δω = η_CWD × J_ash × r_contact / I_DMF
   = 0.32 × 6.311×10⁻² × 0.035 / 5.398×10⁻⁵
   = 0.32 × 2.209×10⁻³ / 5.398×10⁻⁵
   = 0.32 × 40.92
   = +13.1 rad/s  ≈ +13 rad/s
```

(η_CWD = 0.32: Wing Attacker CWD angular momentum transfer on MFB rebound.) The dual-stage phoenix ascent and fire descent gives damageMultiplier **1.40×**. lockMs = 200 (fire column dwell — ash impact hold).

**Parameters:**
- spinGain: +13 rad/s (CWD angular momentum transfer η = 0.32)
- damageMultiplier: 1.40 (dual-stage phoenix fire descent)
- lockMs: 200 (ash impact fire column dwell)

### TypeScript

```typescript
function ashRiseCombo(bey: Beyblade, target: Beyblade): void {
  // CWD rebound: Δω ≈ +13 rad/s (η=0.32, dual-stage h→118.5mm, J=6.311×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 13);
  // Dual-stage phoenix fire descent: 1.40× normal impulse
  bey.damageMultiplier = 1.40;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.40, (dy / dist) * 0.40);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.40 | ✓ |
| lockMs | ≤ 300 | 200 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +13 rad/s (partial) | ✓ |



---

## Case 1919 — GIMMICK: Dragoon GT & Strata Dragoon MS (HMS) — Phase-Locked Dual Rankine Tornado

**Beyblades:** Dragoon GT (HMS) × Tyson Granger; Strata Dragoon MS (HMS) × Daichi Sumeragi
**Series:** Beyblade: G-Revolution (Bakuten Shoot Season 3)

### Assembly — Dragoon GT (HMS)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Metal Attack Ring | Dragoon GT | 11.0 | 32.0 |
| Body | HMS Cylinder | 8.5 | 18.0 |
| Running Core | Semi-Flat RC | 3.0 | 4.0 |
| **Total** | | **22.5** | |

(Bit Chip ~1.0 g excluded per plastic-gen convention. HMS = Hard Metal System; aluminum alloy MAR replaces plastic AR; Running Core replaces WD+SG+BB in a single shaft unit.)

**I_DGT** = 11.0×10⁻³ × 0.032² + 8.5×10⁻³ × 0.018² + 3.0×10⁻³ × 0.004²
          = 1.126×10⁻⁵ + 2.754×10⁻⁶ + 4.80×10⁻⁸
          = **1.406×10⁻⁵ kg·m²**

ω₀ = 750 rad/s (HMS standard launch — lighter aluminum → higher exit velocity)
L₀_DGT = I_DGT × ω₀ = 1.406×10⁻⁵ × 750 = **1.055×10⁻² kg·m²/s**

### Assembly — Strata Dragoon MS (HMS)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Metal Attack Ring | Strata Dragoon | 10.5 | 30.0 |
| Body | HMS Cylinder | 8.0 | 16.0 |
| Running Core | Semi-Flat RC | 3.0 | 4.0 |
| **Total** | | **21.5** | |

**I_SDM** = 10.5×10⁻³ × 0.030² + 8.0×10⁻³ × 0.016² + 3.0×10⁻³ × 0.004²
          = 9.450×10⁻⁶ + 2.048×10⁻⁶ + 4.80×10⁻⁸
          = **1.155×10⁻⁵ kg·m²**

ω₀ = 750 rad/s
L₀_SDM = 1.155×10⁻⁵ × 750 = **8.663×10⁻³ kg·m²/s**

---

### 1. Semi-Flat RC — Fast Orbital Drive & Spin Decay

Both HMS beys use identical Semi-Flat Running Cores (μ_RC = 0.35, r_RC = 4 mm) driving fast, aggressive orbital motion:

```
v_orbital = μ_RC × ω₀ × r_RC = 0.35 × 750 × 0.004 = 1.050 m/s

τ_flat_DGT = μ_RC × m_DGT × g × r_RC = 0.35 × 0.0225 × 9.81 × 0.004 = 3.090×10⁻⁴ N·m
t_spin_DGT = L₀_DGT / τ_flat_DGT = 1.055×10⁻² / 3.090×10⁻⁴ = 34.1 s

τ_flat_SDM = 0.35 × 0.0215 × 9.81 × 0.004 = 2.953×10⁻⁴ N·m
t_spin_SDM = 8.663×10⁻³ / 2.953×10⁻⁴ = 29.3 s
```

Equal orbital speed (v_orbital = 1.050 m/s for both) means both beys circuit the bowl at the same rate — a prerequisite for maintaining phase lock.

---

### 2. Phase-Locked Dual Rankine Tornado — Synchronization & Constructive Interference

Each MAR generates a Rankine vortex. When phase-locked (same ω, same orbital position offset = 180°):

```
v_tip_DGT = ω₀ × r_MAR_DGT = 750 × 0.032 = 24.00 m/s
Γ_DGT     = 2π × v_tip_DGT × r_MAR_DGT = 2π × 24.00 × 0.032 = 4.825 m²/s

v_tip_SDM = ω₀ × r_MAR_SDM = 750 × 0.030 = 22.50 m/s
Γ_SDM     = 2π × v_tip_SDM × r_MAR_SDM = 2π × 22.50 × 0.030 = 4.241 m²/s

Γ_combined = Γ_DGT + Γ_SDM = 4.825 + 4.241 = 9.066 m²/s  (phase-locked constructive sum)
```

Synchronized force at r_opp = 75 mm (combined tornado interaction radius):

```
v_combo = Γ_combined / (2π × r_opp) = 9.066 / (2π × 0.075) = 19.24 m/s

q_combo  = ½ × ρ_air × v_combo² = ½ × 1.225 × 19.24² = 226.7 Pa

F_twin   = q_combo × A_opp = 226.7 × π × 0.020² = 226.7 × 1.257×10⁻³ = 0.2850 N
```

**Sync amplification vs. non-synchronized sum:**

```
F_DGT_nonsync = (½×1.225×(4.825/0.4712)²) × 1.257×10⁻³ = 64.23×1.257×10⁻³ = 0.08074 N
F_SDM_nonsync = (½×1.225×(4.241/0.4712)²) × 1.257×10⁻³ = 49.61×1.257×10⁻³ = 0.06235 N
F_sum_nonsync = 0.08074 + 0.06235 = 0.1431 N

Sync factor: F_twin / F_sum_nonsync = 0.2850 / 0.1431 = 1.992 ≈ 2.0×
```

Synchronization nearly doubles the tornado force — this is why Tyson must adjust his spin to match Daichi's. If Tyson's tornado breaks phase (as in the F-Dynasty battle), the combined vortex collapses to single-bey output (F_SDM = 0.06235 N alone — insufficient to sustain the column).

### Key Parameters Summary

| Quantity | Dragoon GT | Strata Dragoon MS |
|---------|-----------|------------------|
| m | 22.5 g | 21.5 g |
| I_total | 1.406×10⁻⁵ kg·m² | 1.155×10⁻⁵ kg·m² |
| ω₀ | 750 rad/s | 750 rad/s |
| L₀ | 1.055×10⁻² kg·m²/s | 8.663×10⁻³ kg·m²/s |
| v_tip | 24.00 m/s | 22.50 m/s |
| Γ | 4.825 m²/s | 4.241 m²/s |
| τ_flat | 3.090×10⁻⁴ N·m | 2.953×10⁻⁴ N·m |
| t_spin | 34.1 s | 29.3 s |

| Combined quantity | Value |
|-----------------|-------|
| Γ_combined | 9.066 m²/s |
| v_combo (r=75mm) | 19.24 m/s |
| F_twin | 0.2850 N |
| Sync factor | ≈ 2.0× |
| v_orbital (both) | 1.050 m/s |

---

## Case 1920 — SPECIAL: Twin Tornado Attack — Tyson & Daichi / Dragoon GT & Strata Dragoon MS

**Bladers:** Tyson Granger + Daichi Sumeragi | **Beyblades:** Dragoon GT + Strata Dragoon MS | **Type:** attack (co-blader)

### Description

Twin Tornado Attack (Japanese: ツイントルネードアタック) is a powerful co-blader Special Move used by Tyson Granger and Daichi Sumeragi with their Dragoon GT and Strata Dragoon MS HMS beyblades. Tyson adjusts Dragoon GT's rotational speed to exactly match Strata Dragoon MS's, phase-locking their orbital paths 180° apart in the arena. The two synchronized vortices combine into a single massive Rankine super-tornado — nearly twice as powerful as the sum of the individual tornados — and travel together toward the opponent in a convergent column of sand and wind. When Tyson breaks synchronization for a moment in the fight against the F-Dynasty team, both tornados collapse simultaneously, demonstrating the critical role of phase lock. The attack first appeared in Beyblade G-Revolution, episode "A Champion's Not Easy".

### Stage — Phase-Locked Dual Tornado Strike (t_wave = 0.30 s)

From Case 1919: F_twin = 0.2850 N (synchronized Γ_combined = 9.066 m²/s at r_opp = 75 mm).

```
J_twin = F_twin × t_wave = 0.2850 × 0.30 = 8.550×10⁻² N·s

Δv_opp = J_twin / m_opp = 8.550×10⁻² / 0.038 = 2.250 m/s
```

**Effect on Dragoon GT (spin drain — shared equally):**

```
Δω_DGT    = (J_twin/2) × r_contact / I_DGT = 4.275×10⁻² × 0.025 / 1.406×10⁻⁵ = 76.0 rad/s
ω_remain_DGT = 750 − 76.0 = 674.0 rad/s  (89.9% retained)
```

**Effect on Strata Dragoon MS (spin drain):**

```
Δω_SDM    = (J_twin/2) × r_contact / I_SDM = 4.275×10⁻² × 0.025 / 1.155×10⁻⁵ = 92.5 rad/s
ω_remain_SDM = 750 − 92.5 = 657.5 rad/s  (87.7% retained)
```

---

**[M] BeySpirit amplification:**
Dragoon and Strata Dragoon's Bit-Beasts fully manifest as twin dragon-wind spirits — the two synchronized tornado columns become living tempests of pure BeySpirit energy that annihilate the opponent's stability across the entire arena floor.

[M] factor = **8.0 ×** (Tyson + Daichi co-blader dual Dragoon spirit)
[M] Δv = 2.250 × 8.0 = **18.0 m/s** (twin tornado ring-out)

> **Note:** Physical values describe phase-locked Γ_combined=9.066 m²/s at r=75mm → F=0.2850 N×0.30s → J=8.550×10⁻² N·s, Δv=2.250 m/s; sync factor ≈ 2.0× vs non-sync sum. DGT spin drain 76.0 rad/s, SDM spin drain 92.5 rad/s. [M] values represent Tyson and Daichi's dual Dragoon spirits fusing the synchronized vortices into a living twin tornado catastrophe. Combos do not receive [M] amplification.

### TypeScript

```typescript
function twinTornadoAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase-locked Γ_combined=9.066m²/s→F=0.2850N×0.30s→J=8.550×10⁻²N·s; sync 2.0× vs nonsync; [M] 8.0×
  const J_phys = 0.08550;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Tyson+Daichi dual Dragoon spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any pair of beyblades using HMS-class Metal Attack Rings (r_MAR ≥ 28 mm, Γ ≥ 3.5 m²/s each) with identical flat-contact Running Cores (μ ≥ 0.30, v_orbital equal ±5%) such that both beys circuit the bowl at the same rate. Both bladers must launch simultaneously and maintain phase lock throughout (both beys at identical ω). Standard game instance: Dragoon GT + Strata Dragoon MS (Tyson Granger + Daichi Sumeragi, G-Revolution).

---

## Case 1921 — COMBO: Cyclone Spiral — Dragoon GT

**Sequence:** → ↑ A (moveRight · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Tyson Granger

### Physics Justification

The moveRight (→) drives Dragoon GT into its fast flat-RC orbital approach (v_orbital = 1.050 m/s):

```
v_approach = v_orbital = 1.050 m/s
```

The moveUp (↑) deflects the approach into a bowl-wall ascent (θ = 45°):

```
v_z = v_approach × tan(45°) = 1.050 × 1.0 = 1.050 m/s

h_apex = v_z² / (2g) = 1.050² / (2 × 9.81) = 1.1025 / 19.62 = 56.2 mm

v_descent = √(2g × h_apex) = √(2 × 9.81 × 0.0562) = 1.050 m/s
```

The attack (A) fires the bowl-descent overhead smash at combined v_impact:

```
v_impact = √(v_approach² + v_descent²) = √(1.050² + 1.050²) = √2.2050 = 1.485 m/s

m_eff_DGT = (m_DGT × m_opp) / (m_DGT + m_opp) = (0.0225 × 0.038) / (0.0225 + 0.038)
           = 8.550×10⁻⁴ / 0.0605 = 1.413×10⁻² kg

J_cyclone = m_eff_DGT × (1 + e) × v_impact  [e = 0.75, hard aluminum MAR]
          = 1.413×10⁻² × 1.75 × 1.485
          = 1.413×10⁻² × 2.5988 = 3.673×10⁻² N·s
```

The Semi-Flat RC rebounds on landing, reconverting smash recoil to spin (η_RC = 0.28, metal-on-metal contact):

```
Δω = η_RC × J_cyclone × r_contact / I_DGT
   = 0.28 × 3.673×10⁻² × 0.025 / 1.406×10⁻⁵
   = 0.28 × 9.183×10⁻⁴ / 1.406×10⁻⁵
   = 0.28 × 65.31
   = +18.3 rad/s  ≈ +18 rad/s
```

(η_RC = 0.28: Semi-Flat metal Running Core rebound reconversion. Higher per-radian gain vs MFB due to HMS lower I.) Bowl-ascent overhead descent smash gives damageMultiplier **1.25×**. lockMs = 0 (pure attack dash).

**Parameters:**
- spinGain: +18 rad/s (Semi-Flat RC metal rebound η = 0.28)
- damageMultiplier: 1.25 (bowl-ascent aerial descent smash)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function cycloneSpiralCombo(bey: Beyblade, target: Beyblade): void {
  // Semi-Flat RC rebound: Δω ≈ +18 rad/s (η=0.28, h=56.2mm, v_impact=1.485m/s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 18);
  // Bowl-ascent aerial descent smash: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +18 rad/s (partial) | ✓ |



---

## Case 1922 — GIMMICK: Blizzard Orthrus (Metal Fury) — Dual-Spin Crystalline Freeze Ring

**Beyblade:** Blizzard Orthrus 145D (Metal Fury / 4D System)
**Blader:** Gordo | **Series:** Beyblade Metal Fury (4D System)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Face Bolt | Orthrus face | 1.5 | 3.0 |
| Energy Ring | Orthrus | 3.5 | 38.0 |
| Fusion Wheel | Blizzard | 28.5 | 35.0 |
| Spin Track | 145 | 4.0 | 10.0 |
| Performance Tip | Defense (D) | 2.5 | 4.0 |
| **Total** | | **40.0** | |

(Face Bolt included; 4D convention.)

**I_total** = 1.5×10⁻³ × 0.003² + 3.5×10⁻³ × 0.038² + 28.5×10⁻³ × 0.035² + 4.0×10⁻³ × 0.010² + 2.5×10⁻³ × 0.004²
           = 1.35×10⁻⁸ + 5.054×10⁻⁶ + 3.491×10⁻⁵ + 4.00×10⁻⁷ + 4.00×10⁻⁸
           = **4.044×10⁻⁵ kg·m²**

ω₀ = 600 rad/s (MFB/4D standard launch for defense-type)
L₀ = I × ω₀ = 4.044×10⁻⁵ × 600 = **2.426×10⁻² kg·m²/s**

---

### 1. Blizzard Fusion Wheel — Dual-Blade Ring Contact

The Blizzard Fusion Wheel has two large bladed wings that create a contact perimeter at r = 35 mm. On contact the high-mass wheel applies smash force via blade leading edges (e = 0.72, ABS/metal hybrid):

```
v_tip = ω₀ × r_FW = 600 × 0.035 = 21.00 m/s

Contact-zone width per blade: w_blade = 12 mm = 0.012 m
Blade span (axial, per blade): h_blade = 5 mm = 0.005 m
A_blade = 0.012 × 0.005 = 6.0×10⁻⁵ m² (per blade)
N_blades = 2

F_blade_total = N_blades × ½ × ρ_air × v_tip² × C_D × A_blade
              = 2 × ½ × 1.225 × 441.00 × 1.2 × 6.0×10⁻⁵
              = 2 × 1.947×10⁻² = 3.894×10⁻² N
```

---

### 2. Freeze Aura — Crystalline Ice Surface & Friction Modulation

The Orthrus Energy Ring (ER) has a ridged crystalline texture. At v_tip the surface creates a localized low-temperature boundary layer (Gordo's ice-element BeySpirit). For physics purposes this is modeled as increased contact stiction via modified friction:

```
μ_D_standard = 0.08  (Defense tip — low friction, large flat face)
μ_D_freeze   = 0.13  (ice-aura contact stiction at low relative motion)

τ_D_freeze = μ_D_freeze × m × g × r_D
           = 0.13 × 0.040 × 9.81 × 0.004
           = 2.043×10⁻⁴ N·m

t_spin = L₀ / τ_D_freeze = 2.426×10⁻² / 2.043×10⁻⁴ = 118.7 s ≈ 119 s
```

(Freeze-aura Defense tip extends spin survival time compared to a standard D at μ=0.08: t_spin_std = 2.426×10⁻² / (0.08×0.040×9.81×0.004) = 193.5 s; freeze-aura mode μ effectively doubles friction for an opposing bey caught in the ice field — see Case 1924.)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 40.0 g |
| I_total | 4.044×10⁻⁵ kg·m² |
| ω₀ | 600 rad/s |
| L₀ | 2.426×10⁻² kg·m²/s |
| v_tip | 21.00 m/s |
| F_blade_total | 3.894×10⁻² N |
| μ_D_freeze | 0.13 |
| τ_D_freeze | 2.043×10⁻⁴ N·m |
| t_spin | 119 s |

---

## Case 1923 — SPECIAL: Twin Spire — Gordo / Blizzard Orthrus

**Blader:** Gordo | **Beyblade:** Blizzard Orthrus 145D | **Type:** stamina (freeze-drain)

### Description

Twin Spire is a Special Move used by Gordo and his Blizzard Orthrus Beyblade. Orthrus channels his icy breath through the dual-bladed Fusion Wheel, encasing the opponent in a glacial freeze field that saps their rotation and traps them in place. The frozen opponent loses speed and power while Orthrus continues spinning freely, its Defense tip sustaining rotation long after the opponent grinds to a halt. The name "Twin Spire" refers to the two blade-spires of the Blizzard wheel rotating like twin pillars of ice.

### Stage — Freeze-Drain Contact (Ice Aura Friction Amplification)

From Case 1922: twin blade contact F=3.894×10⁻² N, v_tip=21.00 m/s. Freeze aura doubles the opponent's effective spin-friction coefficient upon contact (ice-coating immobilizes tip against arena surface, μ_opp→2.0× standard).

```
v_rel = v_tip − v_opp_tip = 21.00 − 18.00 = 3.00 m/s
(opponent at 600 rad/s × r_opp=0.030 m = 18.00 m/s orbital contribution)

m_eff = (m_O × m_opp) / (m_O + m_opp)
      = (0.040 × 0.038) / (0.040 + 0.038)
      = 1.520×10⁻³ / 0.078 = 1.949×10⁻² kg

J_twinspire = m_eff × (1 + e) × v_rel
            = 1.949×10⁻² × (1 + 0.72) × 3.00
            = 1.949×10⁻² × 5.160 = 1.005×10⁻¹ N·s

Δv_opp = J_twinspire / m_opp = 1.005×10⁻¹ / 0.038 = 2.645 m/s

Freeze immobilization: opponent tip friction ×2 during freeze dwell (t_freeze = 0.8s):
τ_freeze_opp = 2.0 × 0.35 × 0.038 × 9.81 × 0.003 = 7.806×10⁻⁴ N·m
Δω_freeze = τ_freeze_opp × t_freeze / I_opp
          = 7.806×10⁻⁴ × 0.8 / 1.8×10⁻⁵ = 34.7 rad/s (additional spin drain on frozen opponent)
```

**Effect on Blizzard Orthrus (spin loss from contact):**

```
Δω_O = J_twinspire × r_contact / I_O
      = 1.005×10⁻¹ × 0.035 / 4.044×10⁻⁵ = 86.9 rad/s
ω_remain = 600 − 86.9 = 513.1 rad/s  (85.5% retained)
```

---

**[M] BeySpirit amplification:**
Gordo's Orthrus Bit-Beast channels both heads in unison — the ice aura erupts into twin crystalline spires that tower over the stadium and encase the opponent completely, draining all momentum in a glacial prison while Orthrus spins untouched at the center.

[M] factor = **7.0 ×** (Gordo — Blizzard Orthrus ice-twin spirit, Metal Fury 4D special)
[M] Δv = 2.645 × 7.0 = **18.5 m/s** (glacial freeze ring-out / immobilization)

> **Note:** Physical values describe blade contact F=3.894×10⁻² N, J=1.005×10⁻¹ N·s, Δv=2.645 m/s, freeze drain Δω=34.7 rad/s over 0.8s. [M] values represent Gordo's dual Orthrus ice spirits encasing the opponent in a glacial prison. Combos do not receive [M] amplification.

### TypeScript

```typescript
function twinSpireSpecial(bey: Beyblade, target: Beyblade): void {
  // Blade contact J=1.005×10⁻¹ N·s; freeze drain Δω=34.7 rad/s over 0.8s; [M] 7.0×
  const J_phys = 0.1005;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Gordo Orthrus ice-twin spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Freeze drain: additional spin loss on opponent
  target.spin = Math.max(0, target.spin - 34.7);
}
```

**Compatible beys:** Any beyblade using a high-mass Fusion Wheel (≥ 26 g) with dual blade-type contact points at r_FW ≥ 33 mm and a large-face Defense or similar low-friction tip (μ ≤ 0.15), where the Energy Ring has a ridged/crystalline profile for freeze-aura contact stiction amplification. Standard game instance: Blizzard Orthrus 145D (Gordo, Metal Fury).

---

## Case 1924 — COMBO: Ice Spire Lock — Blizzard Orthrus

**Sequence:** K A K (defense · attack · defense)
**Cost:** 15 | **Type:** stamina | **Blader:** Gordo

### Physics Justification

The first defense (K) activates the freeze-aura contact posture — Orthrus angles the dual blades outward while the D tip anchors (zero drift μ_D_freeze = 0.13). The attack (A) delivers the twin-blade smash during freeze contact. The second defense (K) closes with the freeze-lock follow-through that immobilizes the opponent tip.

```
Blade contact during A phase:
v_tip_combo = ω₀ × 0.85 × r_FW = 600 × 0.85 × 0.035 = 17.85 m/s
(85% partial orbit, mid-position strike)

v_rel_combo = 17.85 − 15.30 = 2.55 m/s
(opponent at 600×0.85×0.030 = 15.30 m/s)

J_combo = m_eff × (1 + e) × v_rel_combo
        = 1.949×10⁻² × 1.72 × 2.55
        = 1.949×10⁻² × 4.386 = 8.549×10⁻² N·s

Δv_combo = J_combo / m_opp = 8.549×10⁻² / 0.038 = 2.250 m/s
```

The final defense (K) adds freeze-lock dwell: immobilizes opponent tip for lockMs=150 ms (modeled as full-friction ground contact during dwell). Δω_K2 on Orthrus from dwell reaction:

```
τ_K2 = μ_D_freeze × m_O × g × r_D = 0.13 × 0.040 × 9.81 × 0.004 = 2.043×10⁻⁴ N·m
Δω_K2_own = τ_K2 × 0.15 / I_O = 2.043×10⁻⁴ × 0.15 / 4.044×10⁻⁵ = +0.76 rad/s ≈ +1 rad/s
(D-tip freeze-lock dwell self-sustains spin; negligible but positive)
```

spinGain: +1 rad/s (freeze-lock D-tip self-sustain). damageMultiplier: **1.20×** (freeze-blade smash with lock follow-through). lockMs: 150 (freeze-lock dwell on landing K).

**Parameters:**
- spinGain: +1 rad/s (D-tip freeze dwell)
- damageMultiplier: 1.20 (twin-blade freeze smash)
- lockMs: 150 (freeze-lock dwell)

### TypeScript

```typescript
function iceSpireLockCombo(bey: Beyblade, target: Beyblade): void {
  // Freeze-lock dwell: Δω ≈ +1 rad/s (D-tip μ=0.13, t=0.15s); J_combo=8.549×10⁻²N·s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 1);
  // Twin-blade freeze smash + lock follow-through: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +1 rad/s (negligible) | ✓ |



---

## Case 1925 — GIMMICK: Rapid Eagle (Metal Masters) — Dual Saber-Blade Aerial Dive

**Beyblade:** Rapid Eagle (Metal Fusion / Metal Masters)
**Blader:** Claude | **Series:** Beyblade Metal Masters

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Face Bolt | Eagle face | 1.5 | 3.0 |
| Energy Ring | Eagle | 3.5 | 37.0 |
| Fusion Wheel | Rapid | 24.0 | 33.0 |
| Spin Track | H145 | 3.5 | 10.0 |
| Performance Tip | Flat (F) | 2.0 | 3.0 |
| **Total** | | **34.5** | |

(Face Bolt included; MFB convention.)

**I_total** = 1.5×10⁻³ × 0.003² + 3.5×10⁻³ × 0.037² + 24.0×10⁻³ × 0.033² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.35×10⁻⁸ + 4.792×10⁻⁶ + 2.614×10⁻⁵ + 3.500×10⁻⁷ + 1.80×10⁻⁸
           = **3.131×10⁻⁵ kg·m²**

ω₀ = 630 rad/s (MFB attack-type standard launch)
L₀ = I × ω₀ = 3.131×10⁻⁵ × 630 = **1.973×10⁻² kg·m²/s**

---

### 1. Rapid Fusion Wheel — Dual Saber-Blade Lift

The Rapid Fusion Wheel carries two swept saber-blade protrusions (N_blades = 2) at r = 33 mm. Each blade has a cambered cross-section (C_L = 0.70) generating aerodynamic lift on high-speed orbital approach. Blade projected area per saber: A_saber = 1.0×10⁻⁴ m².

```
v_tip = ω₀ × r_FW = 630 × 0.033 = 20.79 m/s

F_lift_saber = N_blades × ½ × ρ_air × v_tip² × C_L × A_saber
             = 2 × ½ × 1.225 × 20.79² × 0.70 × 1.0×10⁻⁴
             = 2 × ½ × 1.225 × 432.2 × 7.0×10⁻⁵
             = 2 × 1.857×10⁻² = 3.714×10⁻² N

Weight: W = m × g = 0.0345 × 9.81 = 0.3386 N

Lift fraction: F_lift / W = 3.714×10⁻² / 0.3386 = 10.97% ≈ 11%
```

Effective gravity during ascent (saber lift opposes gravity):

```
g_eff = g × (1 − F_lift / W) = 9.81 × (1 − 0.1097) = 9.81 × 0.8903 = 8.733 m/s²
```

---

### 2. Bowl-Exit Trajectory — Aerial Apex & Dual-Saber Descent Strike

Rapid Eagle uses the bowl wall (θ = 55°) to redirect into a vertical aerial launch:

```
v_orbital = μ_F × ω₀ × r_F = 0.40 × 630 × 0.003 = 0.756 m/s

v_z = v_orbital × tan(55°) = 0.756 × 1.428 = 1.080 m/s

Apex height (under g_eff — saber lift active during ascent):
h_apex = v_z² / (2 × g_eff) = 1.080² / (2 × 8.733) = 1.1664 / 17.466 = 66.8 mm

Descent velocity (full g — lift decays at apex):
v_descent = √(2 × g × h_apex) = √(2 × 9.81 × 0.0668) = √(1.311) = 1.145 m/s

Combined impact velocity (orbital + descent):
v_impact = √(v_orbital² + v_descent²) = √(0.756² + 1.145²) = √(0.5715 + 1.3110) = √1.8825 = 1.372 m/s
```

**Flat-tip spin decay:**

```
τ_F  = μ_F × m × g × r_F = 0.40 × 0.0345 × 9.81 × 0.003 = 4.073×10⁻⁴ N·m
t_spin = L₀ / τ_F = 1.973×10⁻² / 4.073×10⁻⁴ = 48.4 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 34.5 g |
| I_total | 3.131×10⁻⁵ kg·m² |
| ω₀ | 630 rad/s |
| L₀ | 1.973×10⁻² kg·m²/s |
| v_tip | 20.79 m/s |
| F_lift_saber | 3.714×10⁻² N |
| Lift fraction | 11% |
| g_eff | 8.733 m/s² |
| v_orbital | 0.756 m/s |
| v_z | 1.080 m/s |
| h_apex | 66.8 mm |
| v_descent | 1.145 m/s |
| v_impact | 1.372 m/s |
| τ_F | 4.073×10⁻⁴ N·m |
| t_spin | 48.4 s |

---

## Case 1926 — SPECIAL: Twin Saber — Claude / Rapid Eagle

**Blader:** Claude | **Beyblade:** Rapid Eagle | **Type:** attack

### Description

Twin Saber (also known as Killer Eagle) is a Special Move used by Claude and his Rapid Eagle Beyblade. Rapid Eagle rides the bowl wall at high orbital speed, its dual saber-blade Fusion Wheel generating lift that extends the aerial apex. From above the stadium Rapid Eagle banks and dives blade-first at blinding speed, the two saber protrusions slashing across the opponent in a twin-cutting strike. The move was first used against Rock Bison. The aerial approach mirrors the flight of a hunting eagle — a high-altitude stoop that converts maximum potential energy into cutting impact.

### Stage — Bowl-Wall Launch + Dual Saber Descent Strike

From Case 1925: v_impact = 1.372 m/s (orbital + saber lift + full-g descent), e = 0.74 (sharp ABS saber blades).

```
m_eff = (m_E × m_opp) / (m_E + m_opp) = (0.0345 × 0.038) / (0.0345 + 0.038)
      = 1.311×10⁻³ / 0.0725 = 1.808×10⁻² kg

J_twinsaber = m_eff × (1 + e) × v_impact
            = 1.808×10⁻² × 1.74 × 1.372
            = 1.808×10⁻² × 2.387 = 4.316×10⁻² N·s

Δv_opp = J_twinsaber / m_opp = 4.316×10⁻² / 0.038 = 1.136 m/s
```

**Effect on Rapid Eagle (spin drain):**

```
Δω_E  = J_twinsaber × r_contact / I_E = 4.316×10⁻² × 0.033 / 3.131×10⁻⁵ = 45.5 rad/s
ω_remain = 630 − 45.5 = 584.5 rad/s  (92.8% retained)
```

---

**[M] BeySpirit amplification:**
Claude's Rapid Eagle Bit-Beast fully materialises as a blazing hunting eagle — the dual sabers become razor wings of pure spirit energy, and the dive strike multiplies into a killing stoop that punches the opponent clean out of the stadium in a burst of feathered lightning.

[M] factor = **7.0 ×** (Claude — Rapid Eagle spirit, Metal Masters special)
[M] Δv = 1.136 × 7.0 = **7.95 m/s** (eagle stoop ring-out)

> **Note:** Physical values describe saber lift F=3.714×10⁻² N (11% weight), g_eff=8.733 m/s², bowl-wall launch v_z=1.080 m/s, h_apex=66.8 mm, v_impact=1.372 m/s, impulse J=4.316×10⁻² N·s, Δv=1.136 m/s. [M] values represent Claude's Rapid Eagle spirit diving as a razor-winged predator. Combos do not receive [M] amplification.

### TypeScript

```typescript
function twinSaberSpecial(bey: Beyblade, target: Beyblade): void {
  // 2-saber lift 11%→g_eff=8.733m/s²; bowl launch v_z=1.080m/s→h=66.8mm; v_impact=1.372m/s; J=4.316×10⁻²N·s; [M] 7.0×
  const J_phys = 0.04316;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Claude Rapid Eagle spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a flat-contact Performance Tip (μ ≥ 0.35) combined with a Fusion Wheel carrying 2+ cambered saber-blade protrusions at r_FW ≥ 30 mm generating measurable lift (F_lift ≥ 0.03 N at ω₀ ≥ 600 rad/s), launched via a 45–65° bowl wall for vertical ascent. Standard game instance: Rapid Eagle H145F (Claude, Metal Masters).

---

## Case 1927 — COMBO: Eagle Dive Strike — Rapid Eagle

**Sequence:** ↑ E A (moveUp · dodge · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Claude

### Physics Justification

The moveUp (↑) sends Rapid Eagle up the bowl wall at half-orbit speed (v_partial = v_orbital × 0.55 = 0.756 × 0.55 = 0.4158 m/s). The dodge (E) converts the wall-climb into a tight aerial banking arc — Rapid Eagle angles its saber blades to glide laterally before committing to the dive. With saber lift active this gives partial ascent:

```
v_z_partial = v_partial × tan(55°) = 0.4158 × 1.428 = 0.5938 m/s

h_partial = v_z_partial² / (2 × g_eff) = 0.5938² / (2 × 8.733) = 0.3526 / 17.466 = 20.2 mm
```

The attack (A) fires at descent apex — Rapid Eagle dives dual-saber first:

```
v_descent_partial = √(2 × g × h_partial) = √(2 × 9.81 × 0.0202) = √(0.3963) = 0.6295 m/s

v_impact_partial = √(v_partial² + v_descent_partial²) = √(0.4158² + 0.6295²)
                 = √(0.1729 + 0.3963) = √0.5692 = 0.7545 m/s

J_partial = m_eff × (1 + e) × v_impact_partial = 1.808×10⁻² × 1.74 × 0.7545
          = 1.808×10⁻² × 1.313 = 2.374×10⁻² N·s
```

Saber blade deflection on landing recovers spin (η_saber = 0.25):

```
Δω = η_saber × J_partial × r_contact / I_E
   = 0.25 × 2.374×10⁻² × 0.033 / 3.131×10⁻⁵
   = 0.25 × 25.03
   = +6.3 rad/s  ≈ +6 rad/s
```

(η_saber = 0.25: saber edge deflects recoil into spin.) Partial aerial saber dive gives damageMultiplier **1.25×**. lockMs = 0 (attack type, no dwell).

**Parameters:**
- spinGain: +6 rad/s (saber deflection recoil η = 0.25)
- damageMultiplier: 1.25 (partial aerial dual-saber dive)
- lockMs: 0 (attack type, no dwell)

### TypeScript

```typescript
function eagleDiveStrikeCombo(bey: Beyblade, target: Beyblade): void {
  // Saber recoil: Δω ≈ +6 rad/s (η=0.25, h_partial=20.2mm, J=2.374×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 6);
  // Partial aerial saber dive: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +6 rad/s (partial) | ✓ |



---

## Case 1928 — GIMMICK: Z Achilles 11 Xtend+ (Burst Cho-Z) — Turbo Awakening Dual-Blade Extension

**Beyblade:** Z Achilles 11 Xtend+ / Turbo Achilles 00 Dimension (Beyblade Burst Turbo / Cho-Z)
**Blader:** Aiger Akabane | **Series:** Beyblade Burst Turbo (Cho-Z season)

### Assembly (Z Achilles 11 Xtend+ — primary)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Z Achilles | 24.5 | 34.0 |
| Forge Disc | 11 | 12.0 | 26.0 |
| Driver | Xtend+ | 4.5 | 5.0 |
| **Total** | | **41.0** | |

(No separate face component — Burst era 3-part system. Takara Tomy only per Burst Scope.)

**I_total** = 24.5×10⁻³ × 0.034² + 12.0×10⁻³ × 0.026² + 4.5×10⁻³ × 0.005²
           = 2.832×10⁻⁵ + 8.112×10⁻⁶ + 1.125×10⁻⁷
           = **3.654×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (Burst Cho-Z standard launch)
L₀ = I × ω₀ = 3.654×10⁻⁵ × 580 = **2.120×10⁻² kg·m²/s**

---

### 1. Turbo Awakening — Blade Deployment (Cho-Z Wing Extension)

The Turbo Awakening (超Ƶ覚醒 Chōzetsu Kakusei) deploys the two Turbo Blades (超Ƶウイング, Chōzetsu Wingu) outward from the Energy Layer. These blades serve dual function: dedicated Burst Stoppers (preventing burst by blocking Disc Stoppers) and attack-radius extenders. Only activates when the blader and bey are in perfect synchronisation.

```
Blade retracted radius: r_base = 33 mm
Blade deployed radius:  r_turbo = 37 mm  (+4 mm Turbo Awakening extension)

v_tip_base  = ω₀ × r_base  = 580 × 0.033 = 19.14 m/s
v_tip_turbo = ω₀ × r_turbo = 580 × 0.037 = 21.46 m/s

Blade tip speed gain: Δv_tip = 21.46 − 19.14 = 2.32 m/s  (+12.1%)
```

---

### 2. Dual-Blade Slash Contact — Turbo Whip (Super Z Slash)

Both blades contact the opponent simultaneously in a head-on slash motion. Relative velocity at contact (same spin direction as standard right-spin opponent at ω_opp = 570 rad/s, r_opp = 0.033 m):

```
v_opp_contact = ω_opp × r_opp = 570 × 0.033 = 18.81 m/s
v_contact = v_tip_turbo − v_opp_contact = 21.46 − 18.81 = 2.65 m/s

m_Z = 41.0 g = 0.041 kg
e = 0.62  (ABS plastic Energy Layer + metal blade insert, Burst era)

Spin decay (Xtend+ driver, μ ≈ 0.30, r_driver = 5 mm):
τ_Xt = μ × m × g × r_driver = 0.30 × 0.041 × 9.81 × 0.005 = 6.031×10⁻⁴ N·m
t_spin = L₀ / τ_Xt = 2.120×10⁻² / 6.031×10⁻⁴ = 35.2 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.0 g |
| I_total | 3.654×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 2.120×10⁻² kg·m²/s |
| r_base | 33 mm |
| r_turbo | 37 mm |
| v_tip_base | 19.14 m/s |
| v_tip_turbo | 21.46 m/s |
| Δv_tip | 2.32 m/s (+12.1%) |
| v_contact | 2.65 m/s |
| τ_Xt | 6.031×10⁻⁴ N·m |
| t_spin | 35.2 s |

---

## Case 1929 — SPECIAL: Turbo Whip (Super Z Slash) — Aiger Akabane / Z Achilles & Turbo Achilles

**Blader:** Aiger Akabane | **Beyblades:** Z Achilles 11 Xtend+ / Turbo Achilles 00 Dimension | **Type:** attack

### Description

Turbo Whip (超ゼットスラッシュ Super Z Slash) is a Special Move used by Aiger Akabane with both Z Achilles 11 Xtend+ and Turbo Achilles 00 Dimension. It is an upgraded version of Z Whip. With Turbo Awakening active, Achilles charges head-on and its two Turbo Blades slash across the opposing Beyblade simultaneously, causing critical damage. The dual-blade deployment increases the attack radius and blade tip speed, and the Burst Stopper function ensures Achilles cannot burst on collision. First used during Aiger's Champion Carnival battles in the Burst Turbo/Cho-Z season.

### Stage — Turbo Awakening Head-On Dual Slash

From Case 1928: v_contact = 2.65 m/s (Turbo Blade tip vs opponent surface), e = 0.62.

```
m_eff = (m_Z × m_opp) / (m_Z + m_opp) = (0.041 × 0.040) / (0.041 + 0.040)
      = 1.640×10⁻³ / 0.081 = 2.025×10⁻² kg

J_turbowhip = m_eff × (1 + e) × v_contact
            = 2.025×10⁻² × 1.62 × 2.65
            = 2.025×10⁻² × 4.293 = 8.694×10⁻² N·s

Δv_opp = J_turbowhip / m_opp = 8.694×10⁻² / 0.040 = 2.174 m/s
```

**Effect on Z Achilles (spin drain from heavy dual-blade clash):**

```
Δω_Z = J_turbowhip × r_turbo / I_Z = 8.694×10⁻² × 0.037 / 3.654×10⁻⁵ = 88.0 rad/s
ω_remain = 580 − 88.0 = 492.0 rad/s  (84.8% retained)
Note: Burst Stopper blades prevent burst despite heavy spin drain.
```

---

**[M] BeySpirit amplification:**
Aiger's Achilles Bit-Beast erupts as an armoured war god — the Turbo Blades ignite with Z-power and the dual slash tears through the opponent in a blazing cross that sends them flying from the stadium.

[M] factor = **7.5 ×** (Aiger Akabane — Achilles Cho-Z Turbo Awakening spirit)
[M] Δv = 2.174 × 7.5 = **16.3 m/s** (Turbo Awakening ring-out slash)

> **Note:** Physical values describe Turbo Awakening blade extension +4 mm (+12.1% tip speed), v_contact=2.65 m/s, J=8.694×10⁻² N·s, Δv=2.174 m/s, Δω_Z=88.0 rad/s (Burst Stopper prevents burst). [M] values represent Aiger's Achilles Z-power igniting the dual-blade slash. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboWhipSpecial(bey: Beyblade, target: Beyblade): void {
  // Turbo Awakening: r_base→r_turbo +4mm, v_tip 19.14→21.46m/s; v_contact=2.65m/s; J=8.694×10⁻²N·s; [M] 7.5×
  const J_phys = 0.08694;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Aiger Achilles Cho-Z Turbo Awakening spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using an Energy Layer with deployable Turbo Blades (Cho-Z Wing extensions, r_base ≥ 30 mm → r_turbo ≥ 34 mm) that function as Burst Stoppers on deployment, operated by a blader in synchronisation sufficient to trigger Turbo Awakening. Standard game instances: Z Achilles 11 Xtend+ and Turbo Achilles 00 Dimension (Aiger Akabane, Burst Turbo).

---

## Case 1930 — COMBO: Z Slash Drive — Z Achilles / Turbo Achilles

**Sequence:** → → A (moveRight · moveRight · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Aiger Akabane

### Physics Justification

Two consecutive rightward dashes (→ →) build a linear charge approach — Achilles accelerates across the stadium in a straight line. The second → adds to the first, giving a boosted approach speed at the moment A fires the dual-blade contact:

```
v_orbital_base = μ_Xt × ω₀ × r_driver = 0.30 × 580 × 0.005 = 0.870 m/s
v_charge_combo = 1.40 × v_orbital_base = 1.40 × 0.870 = 1.218 m/s
(1.40× factor: double-dash momentum buildup)

Blade relative velocity at combo (ω_combo ≈ ω₀, r_turbo = 37 mm):
v_blade_combo = ω₀ × r_turbo − ω_opp × r_opp = 580 × 0.037 − 570 × 0.033
              = 21.46 − 18.81 = 2.65 m/s  (same as full special)

Combined v_rel_combo: use reduced blade contribution at combo scale:
v_contact_combo = 2.00 m/s
(charge adds 1.218 m/s linear approach, blade relative reduced from 2.65→2.00 by partial synchronisation)

J_combo = m_eff × (1 + e) × v_contact_combo = 2.025×10⁻² × 1.62 × 2.00
        = 2.025×10⁻² × 3.24 = 6.561×10⁻² N·s
```

Burst Stopper blades deflect recoil back into spin (η_bs = 0.20 — Burst Stopper recoil recovery):

```
Δω = η_bs × J_combo × r_turbo / I_Z
   = 0.20 × 6.561×10⁻² × 0.037 / 3.654×10⁻⁵
   = 0.20 × 66.44
   = +13.3 rad/s  ≈ +13 rad/s
```

(η_bs = 0.20: Burst Stopper blade geometry deflects blade-contact recoil into rotational momentum.) Dual-blade charge slash gives damageMultiplier **1.30×**. lockMs = 0 (attack type).

**Parameters:**
- spinGain: +13 rad/s (Burst Stopper recoil recovery η = 0.20)
- damageMultiplier: 1.30 (dual-blade Turbo Awakening charge slash)
- lockMs: 0 (attack type, no dwell)

### TypeScript

```typescript
function zSlashDriveCombo(bey: Beyblade, target: Beyblade): void {
  // Burst Stopper recoil: Δω ≈ +13 rad/s (η=0.20, v_contact=2.00m/s, J=6.561×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 13);
  // Dual-blade Turbo Awakening charge slash: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +13 rad/s (partial) | ✓ |



---

## Case 1931 — GIMMICK: Turbo Valtryek Z.Ev (Burst Cho-Z) — Wall-Rebound Turbo Awakening Launch

**Beyblade:** Turbo Valtryek Zenith Evolution / Turbo Valtryek Z.Ev (Beyblade Burst Turbo / Cho-Z)
**Blader:** Valt Aoi | **Series:** Beyblade Burst Turbo (Cho-Z season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Turbo Valtryek | 22.0 | 33.0 |
| Forge Disc | Z | 11.0 | 25.0 |
| Driver | Ev. (Evolve) | 4.0 | 6.0 |
| **Total** | | **37.0** | |

(No face component — Burst era 3-part system. Takara Tomy only per Burst Scope.)

**I_total** = 22.0×10⁻³ × 0.033² + 11.0×10⁻³ × 0.025² + 4.0×10⁻³ × 0.006²
           = 2.396×10⁻⁵ + 6.875×10⁻⁶ + 1.440×10⁻⁷
           = **3.098×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (Burst Cho-Z standard launch)
L₀ = I × ω₀ = 3.098×10⁻⁵ × 580 = **1.797×10⁻² kg·m²/s**

---

### 1. Evolve Driver — Low-Friction Free-Spin Tip

The Evolve (Ev.) Driver has a free-spinning bearing tip (μ_Ev = 0.15) and a wide r = 6 mm contact base enabling sustained high-speed orbital motion:

```
τ_Ev = μ_Ev × m × g × r_driver = 0.15 × 0.037 × 9.81 × 0.006 = 3.264×10⁻⁴ N·m
t_spin = L₀ / τ_Ev = 1.797×10⁻² / 3.264×10⁻⁴ = 55.1 s
```

Approach velocity toward Beystadium barrier (orbital + deliberate directional charge):

```
v_orbital  = μ_Ev × ω₀ × r_driver = 0.15 × 580 × 0.006 = 0.522 m/s
v_charge   = 0.600 m/s  (intentional directional push toward wall)
v_approach = v_orbital + v_charge = 0.522 + 0.600 = 1.122 m/s
```

---

### 2. Bowl-Wall Elastic Rebound — Speed Boost

Turbo Valtryek strikes the bowl wall (θ = 55°, e_wall = 0.87 — hard Beystadium polycarbonate):

```
v_approach_perp = v_approach × sin(55°) = 1.122 × 0.819 = 0.919 m/s
v_approach_tan  = v_approach × cos(55°) = 1.122 × 0.574 = 0.644 m/s

After elastic rebound:
v_rebound_perp  = e_wall × v_approach_perp = 0.87 × 0.919 = 0.800 m/s
v_tan (preserved)                          = 0.644 m/s

v_post_rebound = √(0.800² + 0.644²) = √(0.640 + 0.415) = √1.055 = 1.027 m/s
(directed inward toward stadium center)
```

---

### 3. Turbo Awakening Snap — Additional Speed Boost

At the moment of wall contact, Turbo Valtryek enters Turbo Awakening: blades snap out from r_base = 33 mm to r_turbo = 37 mm. A fraction of the blade tip speed increase couples to linear momentum (η_snap = 0.20):

```
Δv_tip = ω₀ × (r_turbo − r_base) = 580 × 0.004 = 2.32 m/s
v_turbo_snap = η_snap × Δv_tip = 0.20 × 2.32 = 0.464 m/s

v_total = v_post_rebound + v_turbo_snap = 1.027 + 0.464 = 1.491 m/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.0 g |
| I_total | 3.098×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 1.797×10⁻² kg·m²/s |
| μ_Ev | 0.15 |
| v_approach | 1.122 m/s |
| e_wall | 0.87 |
| v_post_rebound | 1.027 m/s |
| Δv_tip (Turbo snap) | 2.32 m/s |
| v_turbo_snap | 0.464 m/s |
| v_total | 1.491 m/s |
| τ_Ev | 3.264×10⁻⁴ N·m |
| t_spin | 55.1 s |

---

## Case 1932 — SPECIAL: Turbo Winged Launch (Super Jet Shoot) — Valt Aoi / Turbo Valtryek

**Blader:** Valt Aoi | **Beyblade:** Turbo Valtryek Z.Ev | **Type:** attack

### Description

Turbo Winged Launch (超ジェットシュート Super Jet Shoot) is a Special Move used by Valt Aoi and his Turbo Valtryek Zenith Evolution. Turbo Valtryek charges toward the Beystadium barrier, rebounds off the wall with an elastic bounce, and simultaneously triggers Turbo Awakening — the Turbo Blades snap outward and the bey erupts in a burst of speed and momentum that launches it into the opponent at dramatically increased velocity. The wall rebound converts approach energy back into the ideal attack angle while the Turbo Awakening provides an additional speed surge, making the total impact velocity greater than the original approach speed.

### Stage — Elastic Wall Rebound + Turbo Awakening Snap Strike

From Case 1931: v_total = 1.491 m/s (post-rebound + Turbo snap), e = 0.65 (Burst Cho-Z layer contact).

```
m_eff = (m_V × m_opp) / (m_V + m_opp) = (0.037 × 0.040) / (0.037 + 0.040)
      = 1.480×10⁻³ / 0.077 = 1.922×10⁻² kg

J_turbolaunch = m_eff × (1 + e) × v_total
              = 1.922×10⁻² × 1.65 × 1.491
              = 1.922×10⁻² × 2.460 = 4.728×10⁻² N·s

Δv_opp = J_turbolaunch / m_opp = 4.728×10⁻² / 0.040 = 1.182 m/s
```

**Effect on Turbo Valtryek (spin drain from wall + contact):**

```
Δω_V = J_turbolaunch × r_turbo / I_V = 4.728×10⁻² × 0.037 / 3.098×10⁻⁵ = 56.5 rad/s
ω_remain = 580 − 56.5 = 523.5 rad/s  (90.3% retained)
```

---

**[M] BeySpirit amplification:**
Valt's Valtryek Bit-Beast blazes with jet-wing fire — the wall rebound becomes a full turbo boost as both Turbo Blades and Valtryek's wind spirit propel the bey like a guided missile, shattering the opponent out of the stadium in a sonic jet burst.

[M] factor = **8.0 ×** (Valt Aoi — Turbo Valtryek wing-spirit, Cho-Z protagonist)
[M] Δv = 1.182 × 8.0 = **9.46 m/s** (turbo jet-wing ring-out)

> **Note:** Physical values describe elastic wall rebound e_wall=0.87, v_post=1.027 m/s; Turbo Awakening snap v_snap=0.464 m/s; v_total=1.491 m/s; J=4.728×10⁻² N·s; Δv=1.182 m/s. [M] values represent Valt's Valtryek erupting in jet-wing spirit propulsion. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboWingedLaunchSpecial(bey: Beyblade, target: Beyblade): void {
  // Wall rebound e=0.87→v_post=1.027m/s; Turbo snap +0.464m/s; v_total=1.491m/s; J=4.728×10⁻²N·s; [M] 8.0×
  const J_phys = 0.04728;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Valt Turbo Valtryek wing-spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a free-spinning low-friction Driver (μ ≤ 0.20, r_driver ≥ 5 mm) combined with a Turbo Awakening Energy Layer (deployable blade extension Δr ≥ 3 mm at ω₀ ≥ 550 rad/s), operated by a blader in synchronisation with a hard-wall (e_wall ≥ 0.80) Beystadium barrier. Standard game instance: Turbo Valtryek Z.Ev (Valt Aoi, Burst Turbo).

---

## Case 1933 — COMBO: Zenith Rebound Strike — Turbo Valtryek

**Sequence:** → ↑ A (moveRight · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Valt Aoi

### Physics Justification

The moveRight (→) builds a rightward lateral charge toward the bowl wall. The moveUp (↑) adds the redirected wall-climb component — Turbo Valtryek angles toward the upper bowl slope for a partial wall contact. With Turbo Awakening snap active this gives a partial rebound strike:

```
v_approach_partial = v_approach × 0.70 = 1.122 × 0.70 = 0.785 m/s
v_post_partial     = v_post_rebound × 0.70 = 1.027 × 0.70 = 0.719 m/s
v_turbo_partial    = v_turbo_snap × 0.70   = 0.464 × 0.70 = 0.325 m/s
v_total_partial    = 0.719 + 0.325 = 1.044 m/s

J_partial = m_eff × (1 + e) × v_total_partial = 1.922×10⁻² × 1.65 × 1.044
          = 1.922×10⁻² × 1.723 = 3.311×10⁻² N·s
```

The Turbo Blade recoil on contact recovers spin (η_turboblade = 0.30):

```
Δω = η_turboblade × J_partial × r_turbo / I_V
   = 0.30 × 3.311×10⁻² × 0.037 / 3.098×10⁻⁵
   = 0.30 × 39.53
   = +11.9 rad/s  ≈ +12 rad/s
```

(η_turboblade = 0.30: Turbo Blade deflects contact recoil into spin recovery.) Partial wall-rebound Turbo snap strike gives damageMultiplier **1.25×**. lockMs = 0 (attack type).

**Parameters:**
- spinGain: +12 rad/s (Turbo Blade recoil recovery η = 0.30)
- damageMultiplier: 1.25 (partial wall-rebound Turbo Awakening strike)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function zenithReboundStrikeCombo(bey: Beyblade, target: Beyblade): void {
  // Turbo Blade recoil: Δω ≈ +12 rad/s (η=0.30, v_total=1.044m/s, J=3.311×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Partial wall-rebound Turbo snap: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |



---

## Case 1934 — GIMMICK: Turbo Spryzen 0Wall Zeta' (Burst Cho-Z) — Left-Spin Defense + Zeta' Reversal Upper Strike

**Beyblade:** Turbo Spryzen 0Wall Zeta' (Beyblade Burst Turbo / Cho-Z)
**Blader:** Shu Kurenai | **Series:** Beyblade Burst Turbo (Cho-Z season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Turbo Spryzen | 23.0 | 34.0 |
| Forge Disc | 0 | 9.5 | 23.0 |
| Frame | Wall | 3.5 | 29.0 |
| Driver | Zeta' (Zeta Prime) | 5.0 | 5.0 |
| **Total** | | **41.0** | |

(No face component — Burst era 4-part system with Frame. Takara Tomy only per Burst Scope.)

**I_total** = 23.0×10⁻³ × 0.034² + 9.5×10⁻³ × 0.023² + 3.5×10⁻³ × 0.029² + 5.0×10⁻³ × 0.005²
           = 2.659×10⁻⁵ + 5.026×10⁻⁶ + 2.944×10⁻⁶ + 1.250×10⁻⁷
           = **3.468×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (Burst Cho-Z standard launch, left-spin mode)
L₀ = I × ω₀ = 3.468×10⁻⁵ × 580 = **2.011×10⁻² kg·m²/s**

---

### 1. Zeta' Driver — Spin Direction Reversal Mechanism

The Zeta' (Zeta Prime) Driver contains an internal clutch mechanism that temporarily reverses the bey's spin direction from left-spin (defense mode) to right-spin (attack burst), activated when Shu and Turbo Spryzen reach synchronisation. The reversal pulse delivers an impulsive torque at the contact point:

```
ω_pulse  = 100 rad/s  (partial reversal angular speed contribution from Zeta' clutch burst)
v_driver_reversal = ω_pulse × r_driver = 100 × 0.005 = 0.500 m/s
(effective additional contact velocity from spin-direction change impulse)
```

---

### 2. Upper-Attack Contact — Angled Lift Strike

The Turbo Spryzen Energy Layer carries upper-angled contact points (α_upper = 25° above horizontal). Combined with the Zeta' reversal boost:

```
v_tip = ω₀ × r_layer = 580 × 0.034 = 19.72 m/s

v_orbital  = μ_Zeta × ω₀ × r_driver = 0.35 × 580 × 0.005 = 1.015 m/s
v_total    = v_orbital + v_driver_reversal = 1.015 + 0.500 = 1.515 m/s

Upper-attack angle: α_upper = 25°
v_horizontal = v_total × cos(25°) = 1.515 × 0.906 = 1.373 m/s
v_vertical   = v_total × sin(25°) = 1.515 × 0.423 = 0.641 m/s
(upward component delivers ring-out via aerial uppercut trajectory)

Spin decay (Zeta' in attack mode, μ_Zeta = 0.35):
τ_Zeta = μ_Zeta × m × g × r_driver = 0.35 × 0.041 × 9.81 × 0.005 = 7.038×10⁻⁴ N·m
t_spin = L₀ / τ_Zeta = 2.011×10⁻² / 7.038×10⁻⁴ = 28.6 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.0 g |
| I_total | 3.468×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 2.011×10⁻² kg·m²/s |
| v_tip | 19.72 m/s |
| ω_pulse (Zeta') | 100 rad/s |
| v_driver_reversal | 0.500 m/s |
| v_orbital | 1.015 m/s |
| v_total | 1.515 m/s |
| α_upper | 25° |
| v_horizontal | 1.373 m/s |
| v_vertical | 0.641 m/s |
| τ_Zeta | 7.038×10⁻⁴ N·m |
| t_spin | 28.6 s |

---

## Case 1935 — SPECIAL: Turbo Upper Launch (Super Upper Shoot) — Shu Kurenai / Turbo Spryzen

**Blader:** Shu Kurenai | **Beyblade:** Turbo Spryzen 0Wall Zeta' | **Type:** attack

### Description

Turbo Upper Launch (超アッパーシュート Super Upper Shoot) is a Special Move used by Shu Kurenai and his Turbo Spryzen 0Wall Zeta'. In left-spin defense mode, Turbo Spryzen uses the Zeta' Performance Tip to trigger a momentary spin direction reversal — switching from left-spin to right-spin as it charges — generating a sudden surge of power that is channeled through the upper-angled contact points of the Energy Layer into a massive uppercut that launches the opponent high into the air for a Ring-Out Finish. The 0Wall Frame provides the stability to withstand the reversal torque while the Turbo Awakening blades lock the burst protection.

### Stage — Left-Spin Defense + Zeta' Reversal Upper Strike

From Case 1934: v_total = 1.515 m/s, α_upper = 25°, e = 0.65.

```
m_eff = (m_S × m_opp) / (m_S + m_opp) = (0.041 × 0.040) / (0.041 + 0.040)
      = 1.640×10⁻³ / 0.081 = 2.025×10⁻² kg

J_turboupper = m_eff × (1 + e) × v_total
             = 2.025×10⁻² × 1.65 × 1.515
             = 2.025×10⁻² × 2.500 = 5.063×10⁻² N·s

Δv_opp (total) = J_turboupper / m_opp = 5.063×10⁻² / 0.040 = 1.266 m/s

Upper-angle components:
Δv_horizontal = 1.266 × cos(25°) = 1.266 × 0.906 = 1.147 m/s (ring-out)
Δv_vertical   = 1.266 × sin(25°) = 1.266 × 0.423 = 0.535 m/s (aerial lift)
```

**Effect on Turbo Spryzen (spin drain from reversal + contact):**

```
Δω_S = J_turboupper × r_layer / I_S = 5.063×10⁻² × 0.034 / 3.468×10⁻⁵ = 49.6 rad/s
ω_remain = 580 − 49.6 = 530.4 rad/s  (91.5% retained)
```

---

**[M] BeySpirit amplification:**
Shu's Spryzen Bit-Beast ignites in crimson — the Zeta' reversal becomes a tidal wave of spinning power as Turbo Spryzen spins both ways at once, the upper-strike erupting into a pillar of white fire that hurls the opponent skyward and clean out of the stadium.

[M] factor = **8.0 ×** (Shu Kurenai — Turbo Spryzen spirit, Cho-Z main protagonist)
[M] Δv = 1.266 × 8.0 = **10.1 m/s** (Zeta' reversal upper ring-out)

> **Note:** Physical values describe Zeta' spin reversal ω_pulse=100 rad/s, v_driver=0.500 m/s, v_total=1.515 m/s, J=5.063×10⁻² N·s, Δv=1.266 m/s (horizontal 1.147 + vertical 0.535). [M] values represent Shu's Spryzen dual-spin spirit erupting in a pillar of fire. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboUpperLaunchSpecial(bey: Beyblade, target: Beyblade): void {
  // Zeta' reversal ω_pulse=100r/s→v_driver=0.5m/s; v_total=1.515m/s; α_upper=25°; J=5.063×10⁻²N·s; [M] 8.0×
  const J_phys = 0.05063;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Shu Turbo Spryzen reversal spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a Zeta' (Zeta Prime) or equivalent clutch-reversal Driver (ω_pulse ≥ 80 rad/s at trigger) combined with a Turbo Awakening Energy Layer with upper-angled contact points (α_upper ≥ 20°) and a wide-Frame (Wall or equivalent, r_frame ≥ 26 mm) for stability during spin reversal. Standard game instance: Turbo Spryzen 0Wall Zeta' (Shu Kurenai, Burst Turbo).

---

## Case 1936 — COMBO: Spryzen Upper Guard — Turbo Spryzen

**Sequence:** ↑ K A (moveUp · defense · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Shu Kurenai

### Physics Justification

The moveUp (↑) sends Turbo Spryzen toward the upper bowl wall, gaining the elevated angle needed for an upper attack. The defense (K) engages the 0Wall frame posture — bracing against incoming counter-pressure and locking the Turbo Awakening Burst Stoppers. The attack (A) fires the partial Zeta' reversal upper strike:

```
v_total_partial = v_total × 0.65 = 1.515 × 0.65 = 0.985 m/s

J_partial = m_eff × (1 + e) × v_total_partial = 2.025×10⁻² × 1.65 × 0.985
          = 2.025×10⁻² × 1.625 = 3.291×10⁻² N·s
```

The 0Wall Frame absorbs recoil and redirects it into spin (η_0Wall = 0.25, wall-ring geometry):

```
Δω = η_0Wall × J_partial × r_layer / I_S
   = 0.25 × 3.291×10⁻² × 0.034 / 3.468×10⁻⁵
   = 0.25 × 32.27
   = +8.1 rad/s  ≈ +8 rad/s
```

(η_0Wall = 0.25: Wall frame outer ring redirects contact recoil into rotational momentum.) Partial reversal upper strike with defense posture gives damageMultiplier **1.20×**. lockMs = 100 (0Wall frame defensive dwell on contact).

**Parameters:**
- spinGain: +8 rad/s (0Wall frame recoil recovery η = 0.25)
- damageMultiplier: 1.20 (partial Zeta' reversal upper strike with guard)
- lockMs: 100 (0Wall frame dwell)

### TypeScript

```typescript
function spryzenUpperGuardCombo(bey: Beyblade, target: Beyblade): void {
  // 0Wall recoil: Δω ≈ +8 rad/s (η=0.25, v_partial=0.985m/s, J=3.291×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 8);
  // Partial Zeta' reversal upper + guard: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +8 rad/s (partial) | ✓ |



---

## Case 1937 — GIMMICK: Turbo Achilles 00 Dimension (Burst Cho-Z) — Single Turbo Blade Undercut

**Beyblade:** Turbo Achilles 00 Dimension (Beyblade Burst Turbo / Cho-Z)
**Blader:** Aiger Akabane | **Series:** Beyblade Burst Turbo (Cho-Z season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Turbo Achilles | 24.5 | 34.0 |
| Forge Disc | 00 (Double Zero) | 14.0 | 27.0 |
| Driver | Dimension | 5.0 | 5.0 |
| **Total** | | **43.5** | |

(No face component — Burst era 3-part system. Takara Tomy only per Burst Scope.)

**I_total** = 24.5×10⁻³ × 0.034² + 14.0×10⁻³ × 0.027² + 5.0×10⁻³ × 0.005²
           = 2.832×10⁻⁵ + 1.021×10⁻⁵ + 1.250×10⁻⁷
           = **3.865×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (Burst Cho-Z standard launch)
L₀ = I × ω₀ = 3.865×10⁻⁵ × 580 = **2.242×10⁻² kg·m²/s**

Note: 00 Disc (Double Zero) provides the highest forged disc mass in the Cho-Z line (14.0 g), maximising I_total and delivering greater ring-out momentum compared to the 11 Disc used on Z Achilles 11 Xtend+ (Case 1928).

---

### 1. Turbo Awakening Blade Deployment — Extended Radius

Turbo Achilles enters Turbo Awakening, deploying both Turbo Blades to r_turbo = 37 mm:

```
v_tip_base  = ω₀ × r_base  = 580 × 0.033 = 19.14 m/s
v_tip_turbo = ω₀ × r_turbo = 580 × 0.037 = 21.46 m/s
```

---

### 2. Single-Blade Undercut Contact — Upper Attack from Below

For the Turbo Upper, **one** of the two Turbo Blades engages the opponent from directly below at an undercut angle (α_under = 30°):

```
Relative blade tip velocity (right-spin opponent at ω_opp=570 rad/s, r_opp=0.033 m):
v_opp_contact = 570 × 0.033 = 18.81 m/s
v_rel         = v_tip_turbo − v_opp_contact = 21.46 − 18.81 = 2.65 m/s

Undercut angle decomposition:
v_horizontal = v_rel × cos(30°) = 2.65 × 0.866 = 2.295 m/s
v_vertical   = v_rel × sin(30°) = 2.65 × 0.500 = 1.325 m/s  (upward — Ring-Out vector)

Spin decay (Dimension driver, μ_Dim = 0.35, r_driver = 5 mm):
τ_Dim = μ_Dim × m × g × r_driver = 0.35 × 0.0435 × 9.81 × 0.005 = 7.463×10⁻⁴ N·m
t_spin = L₀ / τ_Dim = 2.242×10⁻² / 7.463×10⁻⁴ = 30.0 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 43.5 g |
| I_total | 3.865×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 2.242×10⁻² kg·m²/s |
| r_turbo | 37 mm |
| v_tip_turbo | 21.46 m/s |
| v_rel | 2.65 m/s |
| α_under | 30° |
| v_horizontal | 2.295 m/s |
| v_vertical | 1.325 m/s |
| τ_Dim | 7.463×10⁻⁴ N·m |
| t_spin | 30.0 s |

---

## Case 1938 — SPECIAL: Turbo Upper (Super Z Upper) — Aiger Akabane / Turbo Achilles 00 Dimension

**Blader:** Aiger Akabane | **Beyblade:** Turbo Achilles 00 Dimension | **Type:** attack

### Description

Turbo Upper (超ゼットアッパー Super Z Upper) is a Special Move used by Aiger Akabane and his Turbo Achilles 00 Dimension. With Turbo Awakening active, one of the two long Turbo Blade swords on the Energy Layer sweeps in from below and strikes the opposing Beyblade directly from underneath, angled upward at 30° to generate a powerful Ring-Out Finish by launching the opponent into the air. The 00 Disc's extra mass provides greater momentum for the undercut. Unlike Turbo Whip which uses both blades in a forward slash, Turbo Upper concentrates the full force of a single blade in one decisive upward strike.

### Stage — Turbo Awakening Single-Blade Undercut Strike

From Case 1937: v_rel = 2.65 m/s, α_under = 30°, e = 0.62.

```
m_eff = (m_A × m_opp) / (m_A + m_opp) = (0.0435 × 0.040) / (0.0435 + 0.040)
      = 1.740×10⁻³ / 0.0835 = 2.084×10⁻² kg

J_turboupper = m_eff × (1 + e) × v_rel
             = 2.084×10⁻² × 1.62 × 2.65
             = 2.084×10⁻² × 4.293 = 8.947×10⁻² N·s

Δv_opp (total)   = J_turboupper / m_opp = 8.947×10⁻² / 0.040 = 2.237 m/s

Undercut angle decomposition:
Δv_horizontal = 2.237 × cos(30°) = 2.237 × 0.866 = 1.937 m/s
Δv_vertical   = 2.237 × sin(30°) = 2.237 × 0.500 = 1.119 m/s  (aerial ring-out)
```

**Effect on Turbo Achilles (spin drain from blade contact):**

```
Δω_A = J_turboupper × r_turbo / I_A = 8.947×10⁻² × 0.037 / 3.865×10⁻⁵ = 85.6 rad/s
ω_remain = 580 − 85.6 = 494.4 rad/s  (85.2% retained)
Burst Stopper (second blade) prevents burst despite 85.6 rad/s drain.
```

---

**[M] BeySpirit amplification:**
Aiger's Achilles erupts with Z-power — the single upward blade becomes a gleaming war-god's lance of pure spirit energy. The opponent is launched vertically out of the stadium on a column of fire, unable to resist the force of a Turbo Achilles fully awakened.

[M] factor = **7.5 ×** (Aiger Akabane — Turbo Achilles Cho-Z spirit)
[M] Δv = 2.237 × 7.5 = **16.8 m/s** (single-blade upper ring-out)

> **Note:** Physical values describe single Turbo Blade undercut α=30°, v_rel=2.65 m/s, J=8.947×10⁻² N·s, Δv=2.237 m/s (horizontal 1.937 + vertical 1.119). [M] values represent Aiger's Z-power concentrating into a single lance of spirit. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboUpperSpecial(bey: Beyblade, target: Beyblade): void {
  // Single Turbo Blade undercut α=30°; v_rel=2.65m/s; J=8.947×10⁻²N·s; Δv_vert=1.119m/s; [M] 7.5×
  const J_phys = 0.08947;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Aiger Turbo Achilles Z-power)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a Turbo Awakening Energy Layer with one or more Turbo Blades deployed at r_turbo ≥ 34 mm, paired with a high-mass Forge Disc (≥ 12 g, r_disc ≥ 25 mm) to maximise ring-out momentum, and a blader in sufficient synchronisation with the bey for Turbo Awakening activation. Standard game instance: Turbo Achilles 00 Dimension (Aiger Akabane, Burst Turbo).

---

## Case 1939 — COMBO: Achilles Upper Drive — Turbo Achilles 00 Dimension

**Sequence:** ↓ ↑ A (moveDown · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Aiger Akabane

### Physics Justification

The moveDown (↓) drops Turbo Achilles to a lower orbital position — diving below the opponent's contact height to align the single undercut blade for an upward approach. The moveUp (↑) reverses the motion, springing Turbo Achilles upward with the Turbo Blade angled at the steeper undercut trajectory (α_under_combo = 40°). The attack (A) fires the single-blade upper strike at reduced power:

```
v_rel_partial = v_rel × 0.70 = 2.65 × 0.70 = 1.855 m/s

J_partial = m_eff × (1 + e) × v_rel_partial = 2.084×10⁻² × 1.62 × 1.855
          = 2.084×10⁻² × 3.005 = 6.262×10⁻² N·s
```

The second Burst Stopper blade deflects recoil into spin recovery (η_bs = 0.20):

```
Δω = η_bs × J_partial × r_turbo / I_A
   = 0.20 × 6.262×10⁻² × 0.037 / 3.865×10⁻⁵
   = 0.20 × 59.92
   = +12.0 rad/s
```

(η_bs = 0.20: second Burst Stopper blade converts blade-contact recoil to spin.) Partial single-blade undercut gives damageMultiplier **1.30×**. lockMs = 0 (attack type, immediate release after upper strike).

**Parameters:**
- spinGain: +12 rad/s (Burst Stopper recoil recovery η = 0.20)
- damageMultiplier: 1.30 (single-blade undercut Turbo Awakening upper strike)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function achillesUpperDriveCombo(bey: Beyblade, target: Beyblade): void {
  // Burst Stopper recoil: Δω ≈ +12 rad/s (η=0.20, v_rel=1.855m/s, J=6.262×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Single Turbo Blade undercut: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |



---

## Case 1940 — GIMMICK: Turbo Achilles 00 Dimension — Burst Stopper Blade Power Channeling

**Beyblade:** Turbo Achilles 00 Dimension (Beyblade Burst Turbo / Cho-Z)
**Blader:** Aiger Akabane | **Series:** Beyblade Burst Turbo (Cho-Z season)

Assembly: see Case 1937 (m=43.5 g, I=3.865×10⁻⁵ kg·m², ω₀=580 rad/s, L₀=2.242×10⁻² kg·m²/s).

---

### 1. Burst Stopper Blade Geometry

Each Burst Stopper blade is a long rectangular protrusion (L_blade = 12 mm, w_blade = 4 mm) extending outward from the Energy Layer. The blade passes any given contact point in:

```
t_blade_pass = L_blade / v_rel = 0.012 / 2.65 = 4.53×10⁻³ s ≈ 4.5 ms
(blade passage time at v_rel = 2.65 m/s — longer contact arc than point contact)
```

---

### 2. Power Channeling — Pre-Contact Spin Boost

For Turbo Sword, Aiger channels BeySpirit into the Turbo Blades before contact, briefly increasing the bey's spin rate via Turbo Awakening synchronisation pulse. The power channeling delivers a spin boost:

```
ω_boost  = 10 rad/s  (synchronisation-pulse spin increase)
ω_sword  = ω₀ + ω_boost = 580 + 10 = 590 rad/s

v_tip_sword = ω_sword × r_turbo = 590 × 0.037 = 21.83 m/s

Relative blade velocity against right-spin opponent (ω_opp=570, r_opp=0.033):
v_opp_contact = 570 × 0.033 = 18.81 m/s
v_rel_sword   = v_tip_sword − v_opp_contact = 21.83 − 18.81 = 3.02 m/s

Compared to standard Turbo contact (Case 1928): v_rel_base = 2.65 m/s
Power-channeling increase: Δv_rel = 3.02 − 2.65 = 0.37 m/s (+14%)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 43.5 g (see Case 1937) |
| ω_boost | 10 rad/s |
| ω_sword | 590 rad/s |
| v_tip_sword | 21.83 m/s |
| v_rel_sword | 3.02 m/s |
| L_blade | 12 mm |
| t_blade_pass | 4.5 ms |

---

## Case 1941 — SPECIAL: Turbo Sword (Super Z Sword) — Aiger Akabane / Turbo Achilles 00 Dimension

**Blader:** Aiger Akabane | **Beyblade:** Turbo Achilles 00 Dimension | **Type:** attack

### Description

Turbo Sword (超ゼットソード Super Z Sword) is a Special Move used by Aiger Akabane and his Turbo Achilles 00 Dimension. Similar to Z Whip, Achilles channels power into the long Burst Stopper blades on the Energy Layer via Turbo Awakening, boosting the blade tip speed by +10 rad/s before contact. The single concentrated blade then sweeps across the opposing Beyblade in a horizontal sword-like slash, delivering a focused lateral strike that sends the opponent flying. The 00 Disc's extra mass adds ring-out momentum and the extended blade passage (4.5 ms contact arc) concentrates energy across the full blade face.

### Stage — Power-Channeled Blade Sword Slash

From Case 1940: v_rel_sword = 3.02 m/s, e = 0.62.

```
m_eff = (m_A × m_opp) / (m_A + m_opp) = (0.0435 × 0.040) / (0.0435 + 0.040)
      = 1.740×10⁻³ / 0.0835 = 2.084×10⁻² kg

J_turbosword = m_eff × (1 + e) × v_rel_sword
             = 2.084×10⁻² × 1.62 × 3.02
             = 2.084×10⁻² × 4.892 = 1.020×10⁻¹ N·s

Δv_opp = J_turbosword / m_opp = 1.020×10⁻¹ / 0.040 = 2.550 m/s
```

**Effect on Turbo Achilles (spin drain from power channeling + blade contact):**

```
Δω_A = J_turbosword × r_turbo / I_A = 1.020×10⁻¹ × 0.037 / 3.865×10⁻⁵ = 97.7 rad/s
ω_remain = 580 − 97.7 = 482.3 rad/s  (83.2% retained)
Burst Stopper prevents burst despite 97.7 rad/s drain from power-channeled strike.
```

---

**[M] BeySpirit amplification:**
Aiger's Achilles ignites with concentrated Z-power — the Burst Stopper blade becomes a blazing war-god's longsword, the sword slash erupting in a column of golden fire that cuts clean through the opponent's rotation and punches them out of the stadium.

[M] factor = **7.5 ×** (Aiger Akabane — Turbo Achilles Cho-Z power-channeled blade spirit)
[M] Δv = 2.550 × 7.5 = **19.1 m/s** (power-channeled sword ring-out)

> **Note:** Physical values describe power-channeling spin boost ω_boost=10 rad/s, v_rel_sword=3.02 m/s (vs standard 2.65), J=1.020×10⁻¹ N·s, Δv=2.550 m/s, blade contact arc 4.5 ms. [M] values represent Aiger's Z-power igniting the blade into a longsword of spirit fire. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboSwordSpecial(bey: Beyblade, target: Beyblade): void {
  // Power-channel ω_boost=10r/s→v_rel=3.02m/s; J=1.020×10⁻¹N·s; blade_pass=4.5ms; [M] 7.5×
  const J_phys = 0.1020;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Aiger Turbo Achilles power-channeled sword)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a Turbo Awakening Energy Layer with long Burst Stopper blade protrusions (L_blade ≥ 10 mm, r_turbo ≥ 34 mm) capable of receiving a synchronisation-pulse spin boost (ω_boost ≥ 8 rad/s) from a fully synchronised blader, paired with a heavy Forge Disc (≥ 12 g) for maximum ring-out momentum. Standard game instance: Turbo Achilles 00 Dimension (Aiger Akabane, Burst Turbo).

---

## Case 1942 — COMBO: Z Sword Cross — Turbo Achilles 00 Dimension

**Sequence:** → ← A (moveRight · moveLeft · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Aiger Akabane

### Physics Justification

The moveRight (→) sends Turbo Achilles on a rightward orbital arc, then moveLeft (←) immediately reverses direction — a lateral feint that creates a momentum reversal at the contact point. The direction change adds a Coriolis-like lateral component to the contact velocity, then A fires the power-channeled sword slash at the crossover point:

```
v_orbital = μ_Dim × ω₀ × r_driver = 0.35 × 580 × 0.005 = 1.015 m/s
v_lateral_reversal = v_orbital × 2 × sin(45°) = 1.015 × 2 × 0.707 = 1.435 m/s
(momentum from rapid direction reversal at 45° crossing angle)

v_contact_combo = 0.50 × v_lateral_reversal + 0.50 × v_rel_sword
               = 0.50 × 1.435 + 0.50 × 3.02 = 0.718 + 1.510 = 2.228 m/s

J_combo = m_eff × (1 + e) × v_contact_combo = 2.084×10⁻² × 1.62 × 2.228
        = 2.084×10⁻² × 3.609 = 7.522×10⁻² N·s
```

Burst Stopper blade deflects contact recoil into spin recovery (η_bs = 0.20):

```
Δω = η_bs × J_combo × r_turbo / I_A
   = 0.20 × 7.522×10⁻² × 0.037 / 3.865×10⁻⁵
   = 0.20 × 71.98
   = +14.4 rad/s  ≈ +14 rad/s
```

(η_bs = 0.20: Burst Stopper blade geometry converts cross-slash recoil to spin.) Lateral cross-slash gives damageMultiplier **1.30×**. lockMs = 0 (attack type, lateral slash with no dwell).

**Parameters:**
- spinGain: +14 rad/s (Burst Stopper recoil recovery η = 0.20)
- damageMultiplier: 1.30 (power-channeled lateral sword cross-slash)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function zSwordCrossCombo(bey: Beyblade, target: Beyblade): void {
  // Burst Stopper recoil: Δω ≈ +14 rad/s (η=0.20, v_combo=2.228m/s, J=7.522×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 14);
  // Power-channeled lateral cross-slash: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +14 rad/s (partial) | ✓ |



---

## Case 1943 — GIMMICK: Z Achilles 11 Xtend+ — Gyroscopic Shield + Combined Crush Approach

**Beyblade:** Z Achilles 11 Xtend+ (Beyblade Burst Turbo / Cho-Z)
**Blader:** Aiger Akabane | **Series:** Beyblade Burst Turbo (Cho-Z season)

Assembly: see Case 1928 (m=41.0 g, I=3.654×10⁻⁵ kg·m², ω₀=580 rad/s, L₀=2.120×10⁻² kg·m²/s, r_turbo=37 mm).

---

### 1. Gyroscopic Shield — Xtend+ Extended Defense Posture

With Xtend+ extended to its maximum height (defense posture), Z Achilles presents maximum gyroscopic stability. The gyroscopic rigidity of the high-spin bey acts as a defensive shield:

```
Gyroscopic rigidity: G_gyro = I × ω₀² = 3.654×10⁻⁵ × 580² = 3.654×10⁻⁵ × 336400 = 12.29 N·m

For an incoming contact force F_in at r_impact = 35 mm:
τ_in = F_in × r_impact

Precession threshold (below which gyroscopic resistance deflects the hit):
F_threshold = ω_tilt × L₀ / r_impact = 2.0 × 2.120×10⁻² / 0.035 = 1.211 N

Shield attenuation: incoming impulse ≤ (F_threshold × t_c) is fully deflected;
Z Achilles retains near-full ω₀ during the shield phase.
```

---

### 2. Combined Crush Approach — Orbital + Turbo Blade Contact

For the crush phase, Z Achilles charges from its high-spin defense posture directly into the opponent, combining orbital approach velocity with Turbo Blade blade contact velocity:

```
Orbital approach:
v_orbital = μ_Xt × ω₀ × r_driver = 0.30 × 580 × 0.005 = 0.870 m/s

Turbo Blade contact (same as Case 1928):
v_tip_turbo = ω₀ × r_turbo = 580 × 0.037 = 21.46 m/s
v_opp_contact = ω_opp × r_opp = 570 × 0.033 = 18.81 m/s
v_rel_blades  = 21.46 − 18.81 = 2.65 m/s

Combined crush velocity:
v_crush_total = v_orbital + v_rel_blades = 0.870 + 2.65 = 3.52 m/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.0 g (see Case 1928) |
| G_gyro | 12.29 N·m |
| F_threshold | 1.211 N |
| v_orbital | 0.870 m/s |
| v_rel_blades | 2.65 m/s |
| v_crush_total | 3.52 m/s |

---

## Case 1944 — SPECIAL: Turbo Crush (Super Z Press) — Aiger Akabane / Z Achilles 11 Xtend+

**Blader:** Aiger Akabane | **Beyblade:** Z Achilles 11 Xtend+ | **Type:** attack

### Description

Turbo Crush (超ゼットプレス Super Z Press) is a Special Move used by Aiger Akabane and his Z Achilles 11 Xtend+. Z Achilles increases its defense power via Turbo Awakening, entering a gyroscopic shield posture that deflects incoming attacks while sustaining near-full spin. The Xtend+ driver locks into its extended defense height for maximum stability. Then, from this fortified high-spin state, Achilles charges directly into the opponent — combining its full orbital approach speed with the Turbo Blade tip velocity in a concentrated full-body press that smashes the opponent with serious damage. The Burst Stopper Turbo Blades protect against burst during the high-drain contact.

### Stage — Gyroscopic Shield Defense → Full-Body Crush Contact

From Case 1943: v_crush_total = 3.52 m/s, e = 0.55 (Xtend+ in defense posture — deliberate heavy contact).

```
m_eff = (m_Z × m_opp) / (m_Z + m_opp) = (0.041 × 0.040) / (0.041 + 0.040)
      = 1.640×10⁻³ / 0.081 = 2.025×10⁻² kg

J_turbocrush = m_eff × (1 + e) × v_crush_total
             = 2.025×10⁻² × 1.55 × 3.52
             = 2.025×10⁻² × 5.456 = 1.105×10⁻¹ N·s

Δv_opp = J_turbocrush / m_opp = 1.105×10⁻¹ / 0.040 = 2.763 m/s
```

**Effect on Z Achilles (spin drain from shield-into-crush contact):**

```
Δω_Z = J_turbocrush × r_turbo / I_Z = 1.105×10⁻¹ × 0.037 / 3.654×10⁻⁵ = 111.9 rad/s
ω_remain = 580 − 111.9 = 468.1 rad/s  (80.7% retained)
Burst Stopper Turbo Blades prevent burst despite 111.9 rad/s drain from press contact.
```

---

**[M] BeySpirit amplification:**
Aiger's Achilles erupts in a full-body Z-power explosion — the shield becomes an impenetrable war-god's fortress that then transforms into a comet of concentrated energy, smashing into the opponent with such force that the bey is obliterated out of the stadium in a shockwave of compressed Z-power.

[M] factor = **7.5 ×** (Aiger Akabane — Turbo Achilles Cho-Z shield-crush spirit)
[M] Δv = 2.763 × 7.5 = **20.7 m/s** (gyroscopic shield crush ring-out)

> **Note:** Physical values describe gyroscopic shield G_gyro=12.29 N·m, F_threshold=1.211 N; crush v_orbital=0.870 + v_rel_blades=2.65 → v_total=3.52 m/s; J=1.105×10⁻¹ N·s; Δv=2.763 m/s; Burst Stopper prevents burst at Δω=111.9 rad/s. [M] values represent Aiger's Z-power shield fortress detonating into a full-body crush. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboCrushSpecial(bey: Beyblade, target: Beyblade): void {
  // Gyro shield G=12.29N·m; v_orbital=0.870+v_blade=2.65=3.52m/s total; J=1.105×10⁻¹N·s; [M] 7.5×
  const J_phys = 0.1105;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Aiger Turbo Achilles gyro-shield crush spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a variable-height Driver (Xtend+ or equivalent, switchable to defense height for gyroscopic stability) combined with a Turbo Awakening Energy Layer (Burst Stopper, r_turbo ≥ 34 mm), where the blader can sustain gyroscopic shield posture before committing to a full-mass orbital+blade crush approach. Standard game instance: Z Achilles 11 Xtend+ (Aiger Akabane, Burst Turbo).

---

## Case 1945 — COMBO: Achilles Press — Z Achilles 11 Xtend+

**Sequence:** K K A (defense · defense · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Aiger Akabane

### Physics Justification

Two consecutive defense inputs (K K) activate the Xtend+ shield phase — Z Achilles enters maximum gyroscopic stability posture, deflecting any incoming contact and sustaining spin. The second K compounds the stability, locking the Xtend+ at extended height. The attack (A) releases the shield momentum into a partial crush:

```
v_crush_partial = v_crush_total × 0.65 = 3.52 × 0.65 = 2.288 m/s

J_partial = m_eff × (1 + e) × v_crush_partial = 2.025×10⁻² × 1.55 × 2.288
          = 2.025×10⁻² × 3.546 = 7.181×10⁻² N·s
```

Gyroscopic stability during shield phase converts spin-drain suppression into effective spin gain (η_gyro = 0.15 — gyro damping redirects residual precession energy to spin):

```
Δω = η_gyro × J_partial × r_turbo / I_Z
   = 0.15 × 7.181×10⁻² × 0.037 / 3.654×10⁻⁵
   = 0.15 × 72.68
   = +10.9 rad/s  ≈ +11 rad/s
```

(η_gyro = 0.15: gyroscopic shield suppresses spin drain during K K phase; net effect is a spin preservation boost before A fires.) Shield-into-crush gives damageMultiplier **1.35×**. lockMs = 50 (Xtend+ press hold at extended height during crush contact).

**Parameters:**
- spinGain: +11 rad/s (gyroscopic spin-drain suppression η = 0.15)
- damageMultiplier: 1.35 (defense shield press-crush smash)
- lockMs: 50 (Xtend+ extended press dwell)

### TypeScript

```typescript
function achillesPressCombo(bey: Beyblade, target: Beyblade): void {
  // Gyro spin retention: Δω ≈ +11 rad/s (η=0.15, v_crush=2.288m/s, J=7.181×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 11);
  // Defense shield press-crush: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 50 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +11 rad/s (partial) | ✓ |



---

## Case 1946 — GIMMICK: Triumph Dragon Charge Metal 1A (Burst Sparking) — Triumph Ring Spring-Blade Awakening

**Beyblade:** Triumph Dragon Charge Metal 1A / テンペストドラゴン Charge Metal 1A (Beyblade Burst Surge / Sparking)
**Blader:** Dante Koryu | **Series:** Beyblade Burst Surge (Sparking season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Blade | Triumph Dragon (incl. Triumph Ring spring assembly) | 45.0 | 32.0 |
| Ratchet | 1A | 22.0 | 22.0 |
| Bit | Charge Metal | 10.9 | 6.0 |
| **Total** | | **77.9** | |

(No face component — Burst Sparking 3-part system. Takara Tomy only per Burst Scope. 77.9 g confirmed via CS9 Case 501–504.)

**I_total** = 45.0×10⁻³ × 0.032² + 22.0×10⁻³ × 0.022² + 10.9×10⁻³ × 0.006²
           = 4.608×10⁻⁵ + 1.065×10⁻⁵ + 3.924×10⁻⁷
           = **5.712×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (Burst Sparking standard launch)
L₀ = I × ω₀ = 5.712×10⁻⁵ × 700 = **3.998×10⁻² kg·m²/s**

---

### 1. Triumph Ring — Spring-Blade Awakening

The Triumph Ring is the outer section of the Triumph Dragon Blade, carrying 3 spring-loaded blade protrusions that lie flat (retracted) during normal spin and snap outward at r_ring = 32 mm when the "Awakened" state is triggered. Each spring is pre-compressed:

```
Spring constant per blade: k = 100 N/m
Compression: x = 6 mm = 0.006 m
PE per blade: PE_spring = ½ × k × x² = ½ × 100 × 0.006² = 1.800×10⁻³ J
N_spring_blades = 3
PE_total = 3 × 1.800×10⁻³ = 5.400×10⁻³ J

Spring-ring deployment velocity (η_spring = 0.75 coupling efficiency):
v_spring_deploy = √(2 × PE_total / m_ring) = √(2 × 5.400×10⁻³ / 0.045) = √0.2400 = 0.490 m/s
v_spring_eff    = η_spring × v_spring_deploy = 0.75 × 0.490 = 0.368 m/s
```

---

### 2. Awakened Contact — Spring Blade Tip Speed

Once Awakened, the blade tips operate at the full Triumph Ring radius r_ring = 32 mm:

```
v_tip = ω₀ × r_ring = 700 × 0.032 = 22.40 m/s

Relative contact velocity (right-spin opponent, ω_opp=690 rad/s, r_opp=0.028 m):
v_opp_contact = 690 × 0.028 = 19.32 m/s
v_rel_blade   = v_tip − v_opp_contact = 22.40 − 19.32 = 3.08 m/s

Combined contact velocity with spring contribution:
v_contact = v_rel_blade + v_spring_eff = 3.08 + 0.368 = 3.448 m/s

Charge Metal spin decay (μ_CM = 0.30, r_bit = 6 mm):
τ_CM = μ_CM × m × g × r_bit = 0.30 × 0.0779 × 9.81 × 0.006 = 1.375×10⁻³ N·m
t_spin = L₀ / τ_CM = 3.998×10⁻² / 1.375×10⁻³ = 29.1 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 77.9 g |
| I_total | 5.712×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 3.998×10⁻² kg·m²/s |
| r_ring | 32 mm |
| v_tip | 22.40 m/s |
| PE_total | 5.400×10⁻³ J (3 blades) |
| v_spring_eff | 0.368 m/s |
| v_contact | 3.448 m/s |
| τ_CM | 1.375×10⁻³ N·m |
| t_spin | 29.1 s |

---

## Case 1947 — SPECIAL: Triumph Break (Tempest Break) — Dante Koryu / Triumph Dragon

**Blader:** Dante Koryu | **Beyblade:** Triumph Dragon Charge Metal 1A | **Type:** attack

### Description

Triumph Break (テンペストブレイク Tempest Break) is a Special Move used by Dante Koryu and his Triumph Dragon Charge Metal 1A. While in its Awakened form, Dragon uses the Triumph Ring's spring blades to deal massive damage to its opponent. The spring blades snap outward from the Triumph Ring as the bey enters the Awakened state, dramatically increasing the effective blade radius and delivering an explosive contact that combines the full tip speed of the extended blades with the spring-release energy. Triumph Dragon's exceptional mass (77.9 g) amplifies the ring-out momentum beyond any standard Sparking-era beyblade.

### Stage — Awakened Spring-Blade Contact Strike

From Case 1946: v_contact = 3.448 m/s, e = 0.65 (ABS/metal hybrid Sparking blade contact).

```
m_eff = (m_D × m_opp) / (m_D + m_opp) = (0.0779 × 0.040) / (0.0779 + 0.040)
      = 3.116×10⁻³ / 0.1179 = 2.643×10⁻² kg

J_triumphbreak = m_eff × (1 + e) × v_contact
               = 2.643×10⁻² × 1.65 × 3.448
               = 2.643×10⁻² × 5.689 = 1.503×10⁻¹ N·s

Δv_opp = J_triumphbreak / m_opp = 1.503×10⁻¹ / 0.040 = 3.758 m/s
```

**Effect on Triumph Dragon (spin drain from Awakened contact):**

```
Δω_D = J_triumphbreak × r_ring / I_D = 1.503×10⁻¹ × 0.032 / 5.712×10⁻⁵ = 84.2 rad/s
ω_remain = 700 − 84.2 = 615.8 rad/s  (88.0% retained)
(High I_total = 5.712×10⁻⁵ gives excellent spin retention vs heavy contact drain)
```

---

**[M] BeySpirit amplification:**
Dante's Dragon Bit-Beast erupts in full tempest fury — the Triumph Ring spring blades ignite in golden fire and the entire Triumph Dragon transforms into a whirling storm of dragon wings, the strike detonating the opponent clean out of the stadium in a cascade of lightning and thunder.

[M] factor = **7.5 ×** (Dante Koryu — Triumph Dragon tempest-spirit, Burst Surge protagonist)
[M] Δv = 3.758 × 7.5 = **28.2 m/s** (Awakened spring-blade tempest ring-out)

> **Note:** Physical values describe Triumph Ring spring deployment PE=5.400×10⁻³ J, v_spring=0.368 m/s; Awakened blade v_tip=22.40 m/s; v_contact=3.448 m/s; J=1.503×10⁻¹ N·s; Δv=3.758 m/s (mass-amplified by 77.9 g — 1.84× heavier than standard Sparking bey). [M] values represent Dante's Dragon erupting in tempest-wing fire. Combos do not receive [M] amplification.

### TypeScript

```typescript
function triumphBreakSpecial(bey: Beyblade, target: Beyblade): void {
  // Triumph Ring spring PE=5.4×10⁻³J, v_spring=0.368m/s; v_contact=3.448m/s; J=1.503×10⁻¹N·s; [M] 7.5×
  const J_phys = 0.1503;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Dante Koryu Triumph Dragon tempest spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst Sparking-era beyblade using a Blade with a spring-loaded outer ring (Triumph Ring equivalent) carrying 3+ spring blades (PE ≥ 1.0×10⁻³ J per blade, r_ring ≥ 28 mm) capable of Awakened deployment at ω₀ ≥ 650 rad/s, paired with a Ratchet-Bit combination totalling ≥ 30 g for maximum mass-driven ring-out momentum. Standard game instance: Triumph Dragon Charge Metal 1A (Dante Koryu, Burst Surge).

---

## Case 1948 — COMBO: Triumph Guard — Triumph Dragon

**Sequence:** J A K (jump · attack · defense)
**Cost:** 15 | **Type:** attack | **Blader:** Dante Koryu

### Physics Justification

The jump (J) triggers a partial spring-blade pre-deployment — Triumph Dragon's Triumph Ring springs partially release, priming the blades at an intermediate radius. The attack (A) fires the Awakened strike at partial spring energy. The defense (K) closes with the spring-guard follow-through — partially-deployed blades fold back and absorb recoil, converting it to spin:

```
v_contact_partial = v_contact × 0.65 = 3.448 × 0.65 = 2.241 m/s

J_partial = m_eff × (1 + e) × v_contact_partial = 2.643×10⁻² × 1.65 × 2.241
          = 2.643×10⁻² × 3.698 = 9.773×10⁻² N·s
```

Spring-guard recoil recovery on K follow-through (η_spring = 0.15):

```
Δω = η_spring × J_partial × r_ring / I_D
   = 0.15 × 9.773×10⁻² × 0.032 / 5.712×10⁻⁵
   = 0.15 × 54.74
   = +8.2 rad/s  ≈ +8 rad/s
```

(η_spring = 0.15: spring-guard blade fold converts contact recoil into rotational momentum.) Partial Awakened spring-blade strike with guard gives damageMultiplier **1.35×**. lockMs = 100 (spring-guard dwell on landing K).

**Parameters:**
- spinGain: +8 rad/s (spring-guard blade-fold recoil η = 0.15)
- damageMultiplier: 1.35 (partial Awakened spring-blade strike + guard)
- lockMs: 100 (spring-guard dwell)

### TypeScript

```typescript
function triumphGuardCombo(bey: Beyblade, target: Beyblade): void {
  // Spring-guard recoil: Δω ≈ +8 rad/s (η=0.15, v_partial=2.241m/s, J=9.773×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 8);
  // Partial Awakened spring-blade strike + guard: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +8 rad/s (partial) | ✓ |



---

## Case 1949 — GIMMICK: Curse Satomb Hurricane Universe 1D — Three-Ring Deflection System

**Beyblade:** Curse Satomb Hurricane Universe 1D (Beyblade Burst Surge / Sparking)
**Blader:** Silas Karlisle | **Series:** Beyblade Burst Surge (Sparking season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Chip | SK Chip | 2.9 | 4.0 |
| Blade | Curse Ring (outer ring + roller assembly) | 8.6 | 30.0 |
| Chassis | 1D | 11.4 | 20.0 |
| Disc | Hurricane (free-spinning outer disc) | 9.5 | 28.0 |
| Bit | Universe | 8.7 | 5.0 |
| **Total** | | **41.1** | |

(Burst Sparking 5-part system. TT only. 41.1 g from CS9 Case assembly table.)

**I_total** = 2.9×10⁻³ × 0.004² + 8.6×10⁻³ × 0.030² + 11.4×10⁻³ × 0.020² + 9.5×10⁻³ × 0.028² + 8.7×10⁻³ × 0.005²
           = 4.640×10⁻⁸ + 7.740×10⁻⁶ + 4.560×10⁻⁶ + 7.448×10⁻⁶ + 2.175×10⁻⁷
           = **1.999×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (Burst Sparking standard launch)
L₀ = I × ω₀ = 1.999×10⁻⁵ × 700 = **1.399×10⁻² kg·m²/s**

---

### 1. Curse Ring — Roller Spin Transfer

The Curse Ring carries 3 symmetrically-placed free-spinning rubber rollers at r_roller = 30 mm. On contact, each roller absorbs the opponent's tangential blade energy and transfers a fraction back as spin:

```
Roller contact radius:  r_roller = 30 mm
Roller coefficient of restitution: e_roller = 0.30 (rubber — high energy absorption)
Spin-transfer efficiency: η_roller = 0.40

For each roller contact at v_contact:
  J_roller = m_eff_roller × (1 + e_roller) × v_rel
  ΔL_transfer = η_roller × J_roller × r_roller   (returned as spin angular momentum)
```

---

### 2. Hurricane Disc — Free-Spin Angular Decoupling

The Hurricane Disc outer ring free-spins independently of the bey body. On side contact, the free-spinning disc absorbs tangential impulse without transmitting it to the core chassis:

```
I_hurricane = 9.5×10⁻³ × 0.028² = 7.448×10⁻⁶ kg·m²
ω_disc_independent (at ω₀): corotating at 700 rad/s before contact

Angular decoupling factor: η_decouple = 0.65
  → 65% of tangential contact impulse is absorbed by the freely-spinning disc,
    reducing spin drain on the core 1D Chassis.
```

---

### 3. Universe Driver — Curved-Edge Deflection

The Universe Driver's curved hemispherical bottom edge acts as a deflector. Any incoming contact below the horizontal midplane strikes the curved face at deflection angle β:

```
β = 35°  (Universe Driver curvature angle vs flat contact plane)
v_def_normal  = v_incoming × cos(β) = v_incoming × cos(35°) = 0.819 × v_incoming
v_def_tangent = v_incoming × sin(β) = v_incoming × sin(35°) = 0.574 × v_incoming

Net deflection: incoming attack redirected; normal component imparts ring-out risk
on attacker, tangential component retained as Satomb orbital velocity boost.
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.1 g |
| I_total | 1.999×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 1.399×10⁻² kg·m²/s |
| r_roller | 30 mm |
| e_roller | 0.30 (rubber) |
| η_decouple | 0.65 (Hurricane free-spin) |
| β | 35° (Universe deflection angle) |
| v_def_normal fraction | 0.819 |

---

## Case 1950 — SPECIAL: Triple Spin (Triple Twister) — Silas Karlisle / Curse Satomb Hurricane Universe 1D

**Blader:** Silas Karlisle | **Beyblade:** Curse Satomb Hurricane Universe 1D | **Type:** defense/stamina

### Description

Triple Spin (トリプルツイスター Triple Twister) is a Special Move used by Silas Karlisle and his Curse Satomb Hurricane Universe 1D. Satomb exploits its three-layer deflection architecture — the Curse Ring's spinning rollers, the Hurricane Disc's free-spinning outer ring, and the Universe Driver's curved bottom edge — to create three simultaneous rings of defense capable of deflecting opposing Beyblades. Any attacker is caught between the outward-spinning roller contact (Curse Ring), the freely decoupled disc body (Hurricane), and the curved bottom deflection angle (Universe), absorbing the attack's energy and returning it as Satomb's continued spin.

### Stage — Three-Ring Deflection Against Single Attacker

Attacker at ω_att = 690 rad/s, r_att = 0.028 m:

```
v_att_contact = ω_att × r_att = 690 × 0.028 = 19.32 m/s
v_Satomb_tip  = ω₀ × r_roller = 700 × 0.030 = 21.00 m/s

v_rel_contact = v_Satomb_tip − v_att_contact = 21.00 − 19.32 = 1.68 m/s
(low v_rel confirms defensive engagement — Satomb does not chase; it deflects)

m_eff = (m_S × m_att) / (m_S + m_att) = (0.0411 × 0.040) / (0.0411 + 0.040)
      = 1.644×10⁻³ / 0.0811 = 2.027×10⁻² kg

Layer 1 — Curse Ring roller absorption:
  e_roller = 0.30; J_roller = m_eff × (1 + e_roller) × v_rel_contact
           = 2.027×10⁻² × 1.30 × 1.68 = 4.427×10⁻² N·s
  ΔL_spin_gain = η_roller × J_roller × r_roller = 0.40 × 4.427×10⁻² × 0.030
               = 5.312×10⁻⁴ kg·m²/s
  Δω_layer1 = ΔL_spin_gain / I_total = 5.312×10⁻⁴ / 1.999×10⁻⁵ = 26.6 rad/s

Layer 2 — Hurricane Disc angular decoupling:
  Tangential impulse absorbed by disc: J_disc = η_decouple × J_roller = 0.65 × 4.427×10⁻²
           = 2.878×10⁻² N·s  (attacker spin drain amplified; Satomb core shielded)

Layer 3 — Universe Driver curved deflection:
  Δv_att_deflect = J_roller / m_att × v_def_normal_fraction / (1 + e_roller)
  Redirect force on attacker: F_redirect = J_roller × sin(β) / t_contact
  t_contact = 0.005 s; F_redirect = 4.427×10⁻² × 0.574 / 0.005 = 5.082 N
  Δv_att_ring_out = J_roller × (1 + 0) / m_att × 0.819 = 4.427×10⁻² × 0.819 / 0.040
                  = 0.906 m/s  (attacker pushed outward at deflection angle)
```

**Net effect on Curse Satomb:**

```
Δω_Satomb = Δω_layer1 = 26.6 rad/s  (spin gain from roller absorption)
ω_remain   = 700 + 26.6 = 726.6 rad/s  (deflection gives spin boost to defender)
```

---

**[M] BeySpirit amplification:**
Silas's cold mechanical mastery crystallises into three rings of absolute zero — the Curse Ring rollers ignite with deep-blue ice fire, the Hurricane Disc becomes an impenetrable spinning wall, and the Universe Driver's curved face sends the attacker spiraling outward in a storm of triple-twisters that threaten to carry it right out of the stadium.

[M] factor = **6.5 ×** (Silas Karlisle — supporting antagonist, three-ring ice deflection spirit)
[M] Δv_att = 0.906 × 6.5 = **5.89 m/s** (triple-ring deflection ring-out redirect)

> **Note:** Physical values describe three-ring defense: J_roller=4.427×10⁻²N·s (e=0.30), Δω_Satomb=+26.6 rad/s spin gain; F_redirect=5.082 N; Δv_att=0.906 m/s at β=35° Universe deflection. Hurricane disc η_decouple=0.65 absorbs 2.878×10⁻² N·s from attacker. [M] values represent Silas's triple-twister spirit amplification. Combos do not receive [M] amplification.

### TypeScript

```typescript
function tripleSpinSpecial(bey: Beyblade, target: Beyblade): void {
  // 3-ring defense: J_roller=4.427×10⁻²N·s(e=0.30), Δω_Satomb=+26.6r/s, Δv_att=0.906m/s; [M] 6.5×
  const J_roller = 0.04427;
  bey.spin = Math.min(bey.maxSpin, bey.spin + 27); // Δω=+26.6 rad/s roller spin gain
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_roller * 6.5; // [M] BeySpirit 6.5× (Silas triple-ring deflection)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a Blade or Chassis with free-spinning rubber roller contact elements (≥ 3 rollers at r ≥ 28 mm) combined with a free-spinning Disc (angular decoupling η ≥ 0.50) and a curved-edge Driver (hemispherical or tapered profile, deflection β ≥ 25°) capable of spin-transfer absorption under sustained attack. Standard game instance: Curse Satomb Hurricane Universe 1D (Silas Karlisle, Burst Surge).

---

## Case 1951 — COMBO: Satomb Reflect — Curse Satomb Hurricane Universe 1D

**Sequence:** K A K (defense · attack · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Silas Karlisle

### Physics Justification

The first defense (K) engages the Curse Ring roller absorb — Satomb receives an incoming hit, roller contact absorbs and partially stores energy. The attack (A) fires the reflected impulse outward via the Universe Driver curved deflection (returning the stored redirect force). The final defense (K) re-engages the roller spin-gain close — Satomb re-locks roller contact and converts recoil into spin:

```
v_contact_combo = v_rel_contact × 0.60 = 1.68 × 0.60 = 1.008 m/s

J_reflect = m_eff × (1 + e_roller) × v_contact_combo = 2.027×10⁻² × 1.30 × 1.008
          = 2.656×10⁻² N·s
```

Hurricane Disc free-spin decoupling converts residual contact energy to spin on the K close (η_decouple = 0.20 for combo):

```
Δω = η_decouple × J_reflect × r_roller / I_total
   = 0.20 × 2.656×10⁻² × 0.030 / 1.999×10⁻⁵
   = 0.20 × 39.87
   = +8.0 rad/s  ≈ +8 rad/s
```

(η_decouple = 0.20: Hurricane Disc free-spin absorbs residual after reflect and converts to spin on re-engagement.) Roller reflect gives damageMultiplier **1.25×**. lockMs = 150 (roller dwell on K-close contact absorption).

**Parameters:**
- spinGain: +8 rad/s (Hurricane disc decoupling η = 0.20)
- damageMultiplier: 1.25 (roller-deflect reflect counter)
- lockMs: 150 (roller absorb dwell on close)

### TypeScript

```typescript
function satombReflectCombo(bey: Beyblade, target: Beyblade): void {
  // Hurricane disc recoil: Δω ≈ +8 rad/s (η=0.20, v_combo=1.008m/s, J=2.656×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 8);
  // Roller-deflect reflect counter: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +8 rad/s (partial) | ✓ |



---

## Case 1952 — GIMMICK: Rock Orso D125B (×3) — Coordinated Three-Bear Surround Push

**Beyblade:** Rock Orso D125B (Beyblade Metal Fusion / Metal Fight Beyblade)
**Bladers:** Kumasuke Kumade, Kumata Kumade, Kumaji Kumade | **Series:** Beyblade Metal Fusion

### Assembly (single Rock Orso D125B)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Face | Face Bolt | 1.0 | 0.0 |
| Energy Ring | Orso | 7.0 | 33.0 |
| Fusion Wheel | Rock | 30.0 | 29.0 |
| Spin Track | D125 (Defense 125) | 4.5 | 15.0 |
| Performance Tip | B (Ball) | 3.5 | 1.0 |
| **Total** | | **46.0** | |

(MFB 5-part system. Rock Fusion Wheel: wide, flat contact surface, high m at outer radius — stamina/defense type. D125 adds height for ground contact avoidance. Ball tip: low friction, wide wandering.)

**I_single** = 1.0×10⁻³ × 0.0² + 7.0×10⁻³ × 0.033² + 30.0×10⁻³ × 0.029² + 4.5×10⁻³ × 0.015² + 3.5×10⁻³ × 0.001²
            = 0 + 7.623×10⁻⁶ + 2.523×10⁻⁵ + 1.013×10⁻⁶ + 3.500×10⁻⁹
            = **3.388×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (MFB standard launch)
L₀ = I × ω₀ = 3.388×10⁻⁵ × 580 = **1.965×10⁻² kg·m²/s**

---

### Three-Bey Coordinated Surround

All three Rock Orso units launch simultaneously with equal spin and are steered into a triangular formation surrounding the opponent at r_surround = 80 mm from the opponent's centre. Each Orso approaches along a radial vector separated by 120°.

```
Three surround approach vectors (120° spacing):
  θ₁ = 0°,   θ₂ = 120°,  θ₃ = 240°

Approach velocity from Ball tip wandering (μ_B = 0.05, high orbital range):
  v_approach = μ_B × ω₀ × r_tip = 0.05 × 580 × 0.001 = 0.029 m/s (natural wander)

Blader-guided vector push (bladers steer all three simultaneously):
  v_push_guided = 0.25 m/s  (blader redirects bey by tilting launcher post-launch)

Net approach velocity per bey toward target:
  v_per_bey = v_approach + v_push_guided = 0.029 + 0.25 = 0.279 m/s ≈ 0.28 m/s
```

---

### Surround Push Geometry

```
With 3 Orso beys at 120° spacing, each pushing inward radially, the net force on the
opponent is zero only when the target is centred. Any asymmetry concentrates force
along the axis with largest net imbalance — so the triple push drives the opponent
toward the nearest wall (not toward any single Orso).

Net impulse per contact (all 3 fire at once):
  J_total = N_beys × m_eff_each × (1 + e) × v_per_bey
  where N_beys = 3, e = 0.55 (Rock Fusion Wheel flat face — stamina/defense contact)

  m_eff_each = (m_Orso × m_opp) / (m_Orso + m_opp) = (0.046 × 0.040) / (0.046 + 0.040)
             = 1.840×10⁻³ / 0.086 = 2.140×10⁻² kg

  J_per_hit = m_eff_each × (1 + e) × v_per_bey = 2.140×10⁻² × 1.55 × 0.28
            = 2.140×10⁻² × 0.434 = 9.288×10⁻³ N·s

  J_total = 3 × 9.288×10⁻³ = 2.786×10⁻² N·s

Net Δv_opp = J_total / m_opp = 2.786×10⁻² / 0.040 = 0.697 m/s
(Net radial push; opponent displaced toward nearest wall)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m (single Orso) | 46.0 g |
| I_single | 3.388×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 1.965×10⁻² kg·m²/s |
| N_beys | 3 |
| v_per_bey | 0.28 m/s |
| J_per_hit | 9.288×10⁻³ N·s |
| J_total (×3) | 2.786×10⁻² N·s |
| Δv_opp | 0.697 m/s |

---

## Case 1953 — SPECIAL: Triple Orso Step — Kumade Brothers / Rock Orso D125B ×3

**Bladers:** Kumasuke Kumade, Kumata Kumade, Kumaji Kumade | **Beyblade:** Rock Orso D125B ×3 | **Type:** attack (joint)

### Description

Triple Orso Step is a Joint Special Move used by Kumasuke Kumade and his brothers Kumata and Kumaji Kumade and their Rock Orso D125B beyblades. All three brothers simultaneously push the opponent's beyblade to the edge of the stadium, working in coordinated triangular formation. Each Orso charges inward along one of three radial push axes (120° apart), creating a net displacement force that drives the opponent toward the nearest wall. This technique was first used against Tsubasa and his Earth Eagle 145WD.

### Stage — Coordinated Triple Surround Push

From Case 1952: J_total = 2.786×10⁻² N·s, Δv_opp = 0.697 m/s (net radial toward nearest wall).

```
Opponent initial position: at arena centre; arena radius R_arena = 400 mm (MFB standard)
Net displacement per push phase: Δx = Δv_opp × t_push = 0.697 × 0.8 = 0.558 m  (too large — clamp to 60% arena)

Realistic push: 3 × hits over 0.8s with natural deceleration friction
  Effective cumulative Δv = J_total / m_opp × η_push = 0.697 × 0.80 = 0.557 m/s
  (η_push = 0.80: friction and reaction offset during guided push)

Repeat cycle: brothers execute 2 push cycles before opponent reaches wall:
  Cycle 1: Δv_1 = 0.557 m/s; Cycle 2 (residual, tighter formation): Δv_2 = 0.557 × 0.70 = 0.390 m/s
  Total push velocity before wall: Δv_total = 0.557 + 0.390 = 0.947 m/s

Wall impact (arena wall, e_wall = 0.50):
  v_wall = Δv_total = 0.947 m/s
  If opponent at wall edge: 0.947 m/s > ring-out escape threshold (0.60 m/s for 40g bey)
  → ring-out achieved by combined push
```

---

**[M] BeySpirit amplification:**
The three Kumade brothers' bear spirits rise together — three massive grizzlies erupting in earth-shaking unison, their Rock Wheels crashing inward from all sides and the ground itself trembling under the Orso Step. The opponent's bey is engulfed in a wall of brown-gold spirit fire and crushed straight out of the arena in a single coordinated bear-rush.

[M] factor = **5.5 ×** (Kumade brothers — supporting comic-relief trio, bear-spirit team bond)
[M] Δv_total = 0.947 × 5.5 = **5.21 m/s** (coordinated triple bear-push ring-out)

> **Note:** Physical values describe 3-bey surround push: J_per_hit=9.288×10⁻³ N·s, J_total=2.786×10⁻² N·s; two push cycles Δv_total=0.947 m/s; exceeds 40g ring-out escape threshold 0.60 m/s. [M] values represent the three brothers' grizzly bear-spirits erupting in unison. Combos do not receive [M] amplification. This is a joint move requiring all 3 brothers' beys on the field simultaneously.

### TypeScript

```typescript
function tripleOrsoStepSpecial(bey: Beyblade, target: Beyblade): void {
  // 3-bey surround: J_total=2.786×10⁻²N·s(3×), 2 push cycles Δv=0.947m/s; [M] 5.5×
  const J_total = 0.02786;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_total * 5.5; // [M] BeySpirit 5.5× (Kumade brothers bear-spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any MFB-era beyblade using a wide flat-contact Fusion Wheel (defense/stamina type, r_CoM ≥ 27 mm) and a wandering Performance Tip (Ball or equivalent, μ ≤ 0.10) that can be blader-guided post-launch via tilt, used in a 3-bey coordinated surround formation at 120° spacing. Standard game instance: Rock Orso D125B ×3 (Kumade brothers, Metal Fusion). Joint move — requires 3 beys of the same type on the field simultaneously.

---

## Case 1954 — COMBO: Orso Triangle — Rock Orso D125B

**Sequence:** → ↑ ← (moveRight · moveUp · moveLeft)
**Cost:** 15 | **Type:** attack | **Blader:** Kumasuke Kumade (lead brother)

### Physics Justification

The three directional moves simulate the three legs of the triangular surround approach: moveRight (→) sends the lead Orso clockwise; moveUp (↑) drives the approach inward toward the centre; moveLeft (←) completes the triangular arc. At the crossover of all three vectors, the Rock Wheel's flat wide face delivers the concentrated three-leg-contact push impulse:

```
v_orbital_lead = μ_B × ω₀ × r_tip = 0.05 × 580 × 0.001 = 0.029 m/s (Ball tip orbital)
v_guided_push  = 0.25 m/s  (blader-guided push, same as Case 1952)
v_arc_bonus    = v_orbital_lead × 2 × sin(60°) = 0.029 × 2 × 0.866 = 0.0503 m/s
(triangular arc momentum at 60° per leg)

v_contact_combo = v_guided_push + v_arc_bonus = 0.25 + 0.0503 = 0.300 m/s

J_combo = m_eff_each × (1 + e) × v_contact_combo = 2.140×10⁻² × 1.55 × 0.300
        = 2.140×10⁻² × 0.465 = 9.951×10⁻³ N·s
```

Ball tip wide orbital converts triangle arc into a spin retention loop (η_B = 0.10):

```
Δω = η_B × J_combo × r_tip / I_single
   = 0.10 × 9.951×10⁻³ × 0.001 / 3.388×10⁻⁵
   = 0.10 × 0.2937
   = +0.029 rad/s  → round to +1 rad/s minimum (floor)
```

(η_B = 0.10: Ball tip orbital momentum loop; negligible spin gain, purely positional. Flat Rock Wheel gives consistent moderate damageMultiplier.) Triangle arc push gives damageMultiplier **1.20×**. lockMs = 0 (attack type, continuous orbital sweep).

**Parameters:**
- spinGain: +1 rad/s (Ball tip orbital minimum)
- damageMultiplier: 1.20 (triangular arc flat-face push)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function orsoTriangleCombo(bey: Beyblade, target: Beyblade): void {
  // Ball orbital arc: Δω ≈ +1 rad/s minimum (η=0.10, v_combo=0.300m/s, J=9.951×10⁻³N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 1);
  // Triangle arc flat-face push: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +1 rad/s (minimum) | ✓ |



---

## Case 1955 — GIMMICK: Blade Sharks Formation — Triangle Attack Geometry (Bakuten Shoot / G-Revolution)

**Beyblade:** Blade Sharks plastic-generation attack beys (representative: Dranzer S-type equivalent)
**Bladers:** Blade Sharks gang members (3) | **Series:** Beyblade (Bakuten Shoot / G-Revolution)

### Assembly (representative single Blade Sharks bey — sharp attack type)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Bit Chip | Standard | 1.0 | 0.0 |
| Attack Ring | Sharp 4-wing (narrow, aggressive contact) | 9.0 | 35.0 |
| Weight Disk | Wide (standard) | 14.0 | 26.0 |
| Spin Gear | Standard Right | 5.0 | 10.0 |
| Blade Base | Flat Base (aggressive wandering) | 6.0 | 2.0 |
| **Total** | | **35.0** | |

(Plastic generation 5-part system. Representative of Blade Sharks attack-type beys used in group scenes. Flat Base gives high orbital speed for coordinated strike. 35.0 g estimated — standard plastic-gen light attack type.)

**I_single** = 1.0×10⁻³ × 0.0² + 9.0×10⁻³ × 0.035² + 14.0×10⁻³ × 0.026² + 5.0×10⁻³ × 0.010² + 6.0×10⁻³ × 0.002²
            = 0 + 1.103×10⁻⁵ + 9.464×10⁻⁶ + 5.000×10⁻⁷ + 2.400×10⁻⁸
            = **2.097×10⁻⁵ kg·m²**

ω₀ = 500 rad/s (plastic-gen standard launch)
L₀ = I × ω₀ = 2.097×10⁻⁵ × 500 = **1.049×10⁻² kg·m²/s**

---

### Triangle Attack — Coordinated Strike Formation

Three beys positioned at triangle vertices (equilateral, side = 120 mm) surrounding the target at formation radius r_formation = 70 mm from the opponent's centre:

```
Formation geometry: equilateral triangle, r_formation = 70 mm
  θ₁ = 90°,  θ₂ = 210°,  θ₃ = 330°  (vertex positions)

Each Blade Sharks bey charges inward along its radial vector simultaneously.
Flat Base high-speed wandering provides natural orbital approach:
  v_flat = μ_flat × ω₀ × r_tip = 0.70 × 500 × 0.002 = 0.700 m/s
  (μ_flat = 0.70 — aggressive plastic Flat Base friction; high translational velocity)

Coordinated charge approach velocity per bey:
  v_attack = v_flat = 0.700 m/s (Flat Base drives direct aggressive dash to target)
```

---

### Contact Physics — Sharp Attack Ring Impact

Each of the 3 Blade Sharks beys delivers a concentrated sharp-wing attack ring blow:

```
m_eff_each = (m_BS × m_opp) / (m_BS + m_opp) = (0.035 × 0.040) / (0.035 + 0.040)
           = 1.400×10⁻³ / 0.075 = 1.867×10⁻² kg

e_sharp = 0.70 (sharp plastic attack ring — high restitution, less energy absorption)

J_per_hit = m_eff_each × (1 + e_sharp) × v_attack = 1.867×10⁻² × 1.70 × 0.700
          = 1.867×10⁻² × 1.190 = 2.222×10⁻² N·s

J_triangle = 3 × J_per_hit = 3 × 2.222×10⁻² = 6.666×10⁻² N·s
(simultaneous three-point impact; net resultant pushes opponent toward nearest wall)

Δv_opp = J_triangle / m_opp = 6.666×10⁻² / 0.040 = 1.667 m/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m (single) | 35.0 g |
| I_single | 2.097×10⁻⁵ kg·m² |
| ω₀ | 500 rad/s |
| L₀ | 1.049×10⁻² kg·m²/s |
| N_beys | 3 |
| v_attack | 0.700 m/s |
| e_sharp | 0.70 |
| J_per_hit | 2.222×10⁻² N·s |
| J_triangle (×3) | 6.666×10⁻² N·s |
| Δv_opp | 1.667 m/s |

---

## Case 1956 — SPECIAL: Triangle Attack — Blade Sharks ×3

**Bladers:** Blade Sharks gang members (3) | **Beyblade:** Plastic attack-type beys ×3 | **Type:** attack (joint)

### Description

Triangle Attack is a Joint Special Move used by the Blade Sharks gang and their plastic-generation attack-type beyblades. Three beys are coordinated into an equilateral triangle formation surrounding the target, then all charge inward simultaneously along their radial vectors. The simultaneous three-point impact overwhelms the opponent's ability to react — each hit comes from a different direction, with the combined impulse driving the opponent's bey toward the wall or into a ring-out. Unlike the Orso Step's sustained push, the Triangle Attack is a single concentrated burst — all three beys crash in and strike at the same instant.

### Stage — Simultaneous Three-Point Triangle Strike

From Case 1955: J_triangle = 6.666×10⁻² N·s, Δv_opp = 1.667 m/s.

```
Net impulse direction: net resultant depends on formation asymmetry vs opponent position.
For opponent displaced d = 30 mm from exact centre of the triangle:
  Net J_resultant = √(J_triangle² × asymmetry_factor) ≈ J_triangle × 0.90
  (0.90: slight off-centre reduces perfect cancellation; 90% of peak J translates as net push)
  J_net = 0.90 × 6.666×10⁻² = 5.999×10⁻² N·s

  Δv_net = J_net / m_opp = 5.999×10⁻² / 0.040 = 1.500 m/s

Spin drain per Blade Sharks bey from sharp contact:
  Δω_each = J_per_hit × r_AR / I_single = 2.222×10⁻² × 0.035 / 2.097×10⁻⁵ = 37.1 rad/s
  ω_remain_each = 500 − 37.1 = 462.9 rad/s  (92.6% retained)
```

---

**[M] BeySpirit amplification:**
The Blade Sharks' predatory gang-spirit ignites — three beyblades transform into charging sharks, all converging at once from three directions in a triangular flash of teeth and blades. The opponent's bey is engulfed in a spinning triangle of force and smashed out of the stadium before it can react.

[M] factor = **4.5 ×** (Blade Sharks — minor gang antagonists, plastic-gen; lowered for non-protagonist trio)
[M] Δv_net = 1.500 × 4.5 = **6.75 m/s** (triangle strike ring-out)

> **Note:** Physical values describe 3-bey triangle formation: J_per_hit=2.222×10⁻²N·s (e=0.70 sharp AR), J_triangle=6.666×10⁻²N·s; net Δv=1.500 m/s (90% transfer at 30mm offset). Each Blade Sharks bey loses 37.1 rad/s per strike. [M] values represent the gang's shark-spirit predator charge. Combos do not receive [M] amplification. Joint move — requires all 3 beys on field simultaneously.

### TypeScript

```typescript
function triangleAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // 3-bey triangle strike: J_triangle=6.666×10⁻²N·s(×3), J_net=5.999×10⁻²N·s, Δv=1.500m/s; [M] 4.5×
  const J_net = 0.05999;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_net * 4.5; // [M] BeySpirit 4.5× (Blade Sharks gang predator triangle)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any plastic-generation beyblade using a sharp or aggressive wide-contact Attack Ring (r_AR ≥ 32 mm, e ≥ 0.60) and a high-speed wandering Blade Base (Flat Base or equivalent, μ ≥ 0.50, v_flat ≥ 0.60 m/s) capable of coordinated blader-guided simultaneous approach in a triangle formation. Standard game instance: Blade Sharks plastic attack-type beys ×3 (Blade Sharks gang, Bakuten Shoot). Joint move — requires 3 beys of the same type on the field simultaneously.

---

## Case 1957 — COMBO: Shark Triangle — Blade Sharks plastic attack bey

**Sequence:** ↑ ↓ A (moveUp · moveDown · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Blade Sharks lead member

### Physics Justification

The moveUp (↑) drives the lead Blade Sharks bey straight at the opponent, building approach momentum. The moveDown (↓) reverses briefly — the lead bey pulls back and angled wide, simulating the shark's classic feint-and-bite. The attack (A) fires the sharp attack ring strike at the pull-back snap point:

```
v_approach  = v_flat = 0.700 m/s  (Flat Base from Case 1955)
v_feint_pullback = v_flat × 0.50 = 0.350 m/s  (partial reversal)
v_snap_bite = v_approach + v_feint_pullback = 0.700 + 0.350 = 1.050 m/s
(snap-back creates a whip-like closing velocity as bey reverses into attack arc)

J_snap = m_eff_each × (1 + e_sharp) × v_snap_bite = 1.867×10⁻² × 1.70 × 1.050
       = 1.867×10⁻² × 1.785 = 3.333×10⁻² N·s
```

Flat Base orbital rotation converts snap recoil into spin recovery (η_flat = 0.05 — minimal for attack type):

```
Δω = η_flat × J_snap × r_AR / I_single
   = 0.05 × 3.333×10⁻² × 0.035 / 2.097×10⁻⁵
   = 0.05 × 55.58
   = +2.8 rad/s  ≈ +3 rad/s
```

(η_flat = 0.05: Flat Base dissipates most momentum as translational movement, minimal spin recovery.) Shark feint-snap gives damageMultiplier **1.30×**. lockMs = 0 (attack type, snap bite with no dwell).

**Parameters:**
- spinGain: +3 rad/s (Flat Base snap-back minimal recovery)
- damageMultiplier: 1.30 (sharp AR feint-snap bite)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function sharkTriangleCombo(bey: Beyblade, target: Beyblade): void {
  // Flat Base snap: Δω ≈ +3 rad/s (η=0.05, v_snap=1.050m/s, J=3.333×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 3);
  // Sharp AR feint-snap bite: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +3 rad/s (minimal) | ✓ |

*Cases continue from Case 1958 as further franchise moves are provided.*



---

## Case 1797 — GIMMICK: Shelter Regulus 5Star Tower — Claw Retraction & Tower Elevation System

**Beyblade:** Shelter Regulus 5Star Tower (TT JP: シェルターレグルス 5スタータワー; Hasbro EN: same)
**Blader:** Ren Wu Sun | **Series:** Beyblade Burst (God Layer / B-69)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Shelter Regulus | 13.4 | 28.0 |
| Forge Disc | 5 | 22.0 | 30.0 |
| Disc Frame | Star | 2.4 | 33.0 |
| Performance Tip | Tower | 5.5 | 5.0 |
| **Total** | | **43.3** | |

**I_total (extended claws) = 3.490×10⁻⁵ kg·m²** (CS9 Case 1515)
ω₀ = 650 rad/s (standard Burst God launch)
L₀ = I_ext × ω₀ = 3.490×10⁻⁵ × 650 = 2.269×10⁻² kg·m²/s

---

### 1. Shelter Layer — Claw Retraction Gimmick

Shelter Regulus carries four extending claw-blades that present a wide attack profile at large radius. In Shelter Defense mode the claws fold inward to a compact, smooth-edged cylindrical profile.

**Claw geometry:**

| Parameter | Extended (attack) | Retracted (shelter) |
|-----------|-------------------|---------------------|
| r_claw (mm) | 38 | 23 |
| m_claw (g) | 4.5 | 4.5 |
| I_claw contribution (kg·m²) | 6.498×10⁻⁶ | 2.381×10⁻⁶ |

ΔI_claw = m_claw × (r_ext² − r_ret²)
         = 4.5×10⁻³ × (0.038² − 0.023²)
         = 4.5×10⁻³ × (1.444×10⁻³ − 5.290×10⁻⁴)
         = 4.5×10⁻³ × 9.150×10⁻⁴
         = **4.118×10⁻⁶ kg·m²**

I_retracted = 3.490×10⁻⁵ − 4.118×10⁻⁶ = **3.078×10⁻⁵ kg·m²**

**Conservation of angular momentum (frictionless retraction):**

```
ω_ret = I_ext × ω₀ / I_ret
      = 3.490×10⁻⁵ × 650 / 3.078×10⁻⁵
      = 736.9 rad/s
```

Spin boost: Δω = **+86.9 rad/s (+13.4%)**

ΔKE from retraction = ½ × L₀ × (ω_ret − ω₀)
                    = ½ × 2.269×10⁻² × 86.9
                    = **0.985 J** (drawn from BeySpirit / claw-spring mechanism)

---

### 2. Tower Performance Tip — Height Elevation

The Tower tip body stands h_tower = 18 mm total. A standard flat/point tip contacts the floor at h_ref = 3 mm.

**Elevation gain:** Δh = 15 mm = 0.015 m

| Parameter | Standard tip | Tower tip (retracted) |
|-----------|-------------|----------------------|
| h_contact above floor (mm) | 3 | 18 |
| Δh_elevation (mm) | — | **15** |
| h_CoM (mm above floor) | 12 | **27** |
| Ω_prec (rad/s) | 0.225 | **0.506** |
| Precession ratio | 1.00× | **2.25×** |

**Precession calculation:**

```
Ω_prec = m × g × h_CoM / L₀
Ω_standard = 0.0433 × 9.81 × 0.012 / 2.269×10⁻² = 0.225 rad/s
Ω_tower    = 0.0433 × 9.81 × 0.027 / 2.269×10⁻² = 0.506 rad/s
```

Tighter precession orbit (2.25×) means the gyroscopic axis redirects lateral perturbations around the precession cone rather than through the bey body — incoming forces are shed rather than absorbed.

**Tower tip friction (rubber contact, r_tip = 2.5 mm, μ = 0.55):**

```
τ_Tower = μ × m × g × r_tip = 0.55 × 0.0433 × 9.81 × 0.0025 = 5.85×10⁻⁴ N·m
t_spin   = L₀ / τ_Tower = 2.269×10⁻² / 5.85×10⁻⁴ = 38.8 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 43.3 g |
| I_ext | 3.490×10⁻⁵ kg·m² |
| I_ret | 3.078×10⁻⁵ kg·m² |
| ΔI_claw | 4.118×10⁻⁶ kg·m² |
| ω₀ | 650 rad/s |
| ω_ret | 736.9 rad/s |
| Δω | +86.9 rad/s (+13.4%) |
| ΔKE | 0.985 J |
| Δh_elevation | 15 mm |
| h_CoM (Tower) | 27 mm |
| Ω_prec (Tower) | 0.506 rad/s |
| t_spin (Tower, retracted) | 38.8 s |

---

## Case 1798 — SPECIAL: Shelter Defense — Ren Wu Sun / Shelter Regulus 5Star Tower

**Blader:** Ren Wu Sun | **Beyblade:** Shelter Regulus 5Star Tower | **Type:** defense

### Description

Shelter Defense is a two-phase defensive special move. In Phase 1 the energy layer's claws retract (angular momentum conserved, spin boosted). In Phase 2 the Tower tip elevates the bey's CoM, tightening gyroscopic precession and presenting a smooth-edged profile. Any incoming bey contacts the smooth retracted surface and is deflected with a near-elastic impulse; simultaneously the elevated geometry imparts a downward component to the attacker, pressing them into the floor and stripping traction.

### Phase 1 — Claw Retraction (instantaneous; from Case 1797)

ΔI = 4.118×10⁻⁶ kg·m² → ω: 650 → **736.9 rad/s** (+86.9 rad/s, +13.4%)

### Phase 2 — Elevation & Gyroscopic Deflection (contact event)

**Collision model (smooth retracted surface, e = 0.70):**

Parameters:
- m_att = 50 g (representative attacker), v_att = 2.0 m/s
- m_def = 43.3 g; ω_def = 736.9 rad/s; r_contact = 24 mm (retracted layer edge)

```
m_eff = (0.050 × 0.0433) / (0.050 + 0.0433) = 2.320×10⁻² kg

J_n = m_eff × (1 + e) × v_att
    = 2.320×10⁻² × 1.70 × 2.0
    = 7.888×10⁻² N·s
```

**Effect on attacker:**
```
Δv_att  = J_n / m_att = 7.888×10⁻² / 0.050 = 1.578 m/s  (speed removed)
v_after = 2.0 − 1.578 = 0.422 m/s  (79 % speed reduction)
```
→ "deflect incoming attacks"

**Effect on Shelter Regulus (spin drain at contact):**
```
Δω_def   = J_n × r_c / I_ret = 7.888×10⁻² × 0.024 / 3.078×10⁻⁵ = 61.5 rad/s
ω_remain = 736.9 − 61.5 = 675.4 rad/s  (91.6 % retained)
```
→ "keep its stability"

**Downward impulse from Tower elevation geometry (θ_contact = 10.6°):**
```
Height differential Δh = 15 mm, horizontal separation Δr ≈ 80 mm:
θ_contact = arctan(15/80) = 10.6° below horizontal

J_down  = J_n × sin(10.6°) = 7.888×10⁻² × 0.184 = 1.451×10⁻² N·s
Δv_down = J_down / m_att   = 0.290 m/s  (attacker pressed into floor → added friction)
```
→ contributes to "knock away opponents" (attacker loses traction at floor)

**Physical summary:** Δv_att (horizontal) = **1.578 m/s** (attacker speed reduction per impact)

---

**[M] BeySpirit amplification:**
BeySpirit sharpens the gyroscopic repulsion beyond physical contact mechanics, reversing the attacker's trajectory entirely.

[M] factor = **5.0 ×**
[M] Δv = 1.578 × 5.0 = **7.9 m/s** (clear ring-out; attacker ejected from arena)

> **Note:** Physical values describe Tower-elevated claw-retraction deflection mechanics. [M] values represent BeySpirit-overridden gyroscopic force that exceeds normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function shelterDefenseSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: claw retraction — angular momentum conserved, Δω = +86.9 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 87);
  // Anchor stance: zero orbital velocity (Tower tip grounds the bey)
  setVelocity(bey.id, 0, 0);
  // Phase 2: Tower elevation → gyroscopic deflection of incoming bey
  // Physical J_n = 7.888×10⁻² N·s; [M] 5.0× → J_M ≈ 0.394 N·s
  const J_phys = 0.0789;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.0; // [M] BeySpirit 5.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  bey.invulnerableMs = 1500; // 1.5 s Tower-stance defense window
}
```

**Compatible beys:** Any beyblade using a retractable-claw Energy Layer (Shelter Regulus or equivalent) equipped with the Tower Performance Tip. Without the Tower tip the elevation component is absent (deflection force halved); without a retractable layer the spin boost phase is absent. Standard game instance: Shelter Regulus 5Star Tower (Ren Wu Sun).

---

## Case 1799 — COMBO: Shell Guard — Shelter Regulus

**Sequence:** K → E → K (defense · dodge · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Ren Wu Sun

### Physics Justification

A short claw-pulse retraction draws the contact points inward for approximately one rotation (~87 ms at 736 rad/s), absorbing an incoming strike and snapping the blades back outward. The dodge (E) mid-sequence represents the brief inward retreat before re-extension. This partial retraction recovers 30 rad/s of spin (≈ ⅓ of the full Shelter Defense Δω = 86.9 rad/s) and returns with a 1.20× counter strike on re-extension.

**Parameters:**
- spinGain: +30 rad/s (partial claw pulse; ⅓ of full Δω)
- damageMultiplier: 1.20 (snap-back counter strike on re-extension)
- lockMs: 0 (pure parry timing — no lock)

### TypeScript

```typescript
function shellGuardCombo(bey: Beyblade, target: Beyblade): void {
  // Partial claw retraction → partial spin restoration
  bey.spin = Math.min(bey.maxSpin, bey.spin + 30);
  // Snap-back re-extension: counter strike on attacker
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +30 rad/s (partial) | ✓ |



---

## Case 1800 — GIMMICK: Wild/Tempest Wyvron — Free-Spin Ring & Bowl Trajectory System

**Beyblades:** Wild Wyvron Vertical Orbit (Standard Burst); Tempest Wyvron 4Glaive Atomic (God Layer / B-98)
**Blader:** Wakiya Murasaki | **Series:** Beyblade Burst (Standard → God Layer arc)

### Assembly Comparison

| Part | Wild Wyvron Vertical Orbit | Tempest Wyvron 4Glaive Atomic |
|------|---------------------------|-------------------------------|
| Energy Layer | Wyvron (free-ring ~2g) | Tornado Wyvern (free-ring ~2g) |
| Layer mass (g) | ~8.5 | 9.2 |
| Forge Disc | Vertical (~15g) | 4 + Glaive frame (21.11 + 2.34g) |
| Performance Tip | Orbit (~6.0g) | Atomic (~6.0g) |
| **Total (g)** | **~29.5** | **40.05** |
| **I_body (kg·m²)** | **~1.0×10⁻⁵ (est.)** | **1.531×10⁻⁵ (CS9 Case 543)** |

ω₀ = 650 rad/s (both; standard Burst launch)
L₀_Tempest = 1.531×10⁻⁵ × 650 = 9.952×10⁻³ kg·m²/s

---

### 1. Free-Spin Ring — Burst Torque Absorption

Both Wyvron layers carry a free-spinning outer ring. When struck, the ring decouples from the core and rotates independently, diverting the attacker's burst torque into the ring rather than the burst tabs.

From CS9 Case 543 (Tornado Wyvern):
- RS attacker: 85 % of burst torque absorbed by ring
- LS attacker: 60 % absorbed

**Contact mechanics (free-spin absorption):**
The free-ring presents e_ring = 0.35 (semi-inelastic, ring absorbs energy).
For an incoming attacker (m_att = 50 g, v_att = 2.5 m/s):

```
m_eff = (0.04005 × 0.050) / (0.04005 + 0.050) = 2.224×10⁻² kg

J_received = m_eff × (1 + e_ring) × v_att
           = 2.224×10⁻² × 1.35 × 2.5
           = 7.506×10⁻² N·s
```

Wyvron velocity gain (redirected toward bowl wall):
```
Δv_Wyv = J_received / m_Wyv = 7.506×10⁻²/ 0.04005 = 1.873 m/s
v_Wyv_post = v_orbital_pre + 1.873 ≈ 2.873 m/s  (toward bowl wall)
```

---

### 2. Bowl Wall Trajectory (Tempest Wyvron, Atomic Tip)

**Bowl parameters:**
- Wall angle: φ = 35°
- Bowl wall height: Δh = 55 mm = 0.055 m
- Atomic tip rubber contact: r_tip = 6 mm, μ = 0.70

**Ascending the wall:**

```
Normal force on wall: N = m × (v² / r_bowl + g × cos φ) ≈ 1.761 N  (r_bowl = 200 mm)
Friction work (ascent): W_fric = μ × N × L  where L = Δh / sin φ = 0.055/0.574 = 0.09582 m
W_fric = 0.70 × (m×g×cos φ) × L = 0.70 × 0.04005×9.81×0.8192 × 0.09582 = 0.02157 J
Gravity work: W_grav = m×g×Δh = 0.04005×9.81×0.055 = 0.02161 J

v_top² = v_entry² − 2(W_grav + W_fric)/m
       = 2.873² − 2×(0.02161 + 0.02157)/0.04005
       = 8.254 − 2.157
       = 6.097   →  v_top = 2.469 m/s
```

**Descending and crashing (symmetric friction path):**

```
v_crash² = v_top² + 2×W_grav/m − 2×W_fric/m
          = 6.097 + 2×0.02161/0.04005 − 2×0.02157/0.04005
          = 6.097 + 1.080 − 1.077 = 6.100

v_crash = 2.470 m/s  (Shield Crash impact speed)
```

### Key Parameters Summary

| Quantity | Wild Wyvron (est.) | Tempest Wyvron (CS9) |
|---------|-------------------|---------------------|
| m | ~29.5 g | 40.05 g |
| I_body | ~1.0×10⁻⁵ kg·m² | 1.531×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s | 650 rad/s |
| e_ring | 0.35 (RS 85 % absorb) | 0.35 (RS 85 % absorb) |
| v_entry (bowl) | ~2.35 m/s | 2.873 m/s |
| v_crash | ~2.02 m/s | **2.470 m/s** |

---

## Case 1801 — SPECIAL: Shield Crash — Wakiya Murasaki / Wild Wyvron & Tempest Wyvron

**Blader:** Wakiya Murasaki | **Beyblades:** Wild Wyvron Vertical Orbit; Tempest Wyvron 4Glaive Atomic | **Type:** attack / balance

### Description

Shield Crash is a two-phase counter-attack. Phase 1: Wyvron absorbs an incoming hit using the free-spin ring (ring decouples, burst torque diverted). Phase 2: the absorbed momentum redirects Wyvron toward the bowl wall, which it climbs and uses as a launch ramp to crash head-on at full speed against the same opponent.

### Phase 1 — Free-Ring Absorption (from Case 1800)

J_received = 7.506×10⁻² N·s; Δv_Wyv = 1.873 m/s → v_entry_bowl = 2.873 m/s

### Phase 2 — Bowl Crash (from Case 1800)

v_crash = **2.470 m/s**

**Crash impact model (Tempest Wyvron vs. attacker, e = 0.65):**

```
m_eff = (0.04005 × 0.050) / (0.09005) = 2.224×10⁻² kg

J_crash = m_eff × (1 + e) × v_crash
        = 2.224×10⁻² × 1.65 × 2.470
        = 2.224×10⁻² × 4.076
        = 9.065×10⁻² N·s
```

Effect on target:
```
Δv_target = J_crash / m_target = 9.065×10⁻² / 0.050 = 1.813 m/s
```

Effect on Wyvron (spin drain at contact r_c = 28 mm):
```
Δω_Wyv = J_crash × r_c / I_body = 9.065×10⁻² × 0.028 / 1.531×10⁻⁵ = 165.8 rad/s
ω_remain = 650 − 165.8 = 484.2 rad/s  (74.5 % retained)
```

**Physical summary:** Δv_target = **1.813 m/s**

---

**[M] BeySpirit amplification:**
BeySpirit supercharges the bowl descent; Wyvron crashes with legendary speed.

[M] factor = **5.5 ×**
[M] Δv = 1.813 × 5.5 = **9.97 ≈ 10.0 m/s** (ring-out guaranteed)

> **Note:** Physical values describe bowl-wall kinematic energy gain with Atomic rubber traction. [M] values represent BeySpirit-overridden descent force. Combos do not receive [M] amplification.

### TypeScript

```typescript
function shieldCrashSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: free-ring absorption — velocity redirected toward bowl
  // (no spin cost; ring decouples and absorbs burst torque)
  // Phase 2: bowl descent → crash impulse on original attacker
  // Physical J = 9.065×10⁻² N·s; [M] 5.5× → J_M ≈ 0.499 N·s
  const J_phys = 0.0907;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.5; // [M] BeySpirit 5.5×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Velocity burst toward target (bowl descent speed)
  bey.vx += (dx / dist) * 2.47;
  bey.vy += (dy / dist) * 2.47;
}
```

**Compatible beys:** Any beyblade with a free-spin outer ring Energy Layer (Wyvron family) capable of redirecting incoming momentum via the bowl wall. Standard instances: Wild Wyvron Vertical Orbit (Wakiya, Burst Standard) and Tempest Wyvron 4Glaive Atomic (Wakiya, God Layer). The crash speed scales with bowl wall height and the initial impact momentum absorbed.

---

## Case 1802 — COMBO: Bowl Rider — Wild/Tempest Wyvron

**Sequence:** E → ↓ → A (dodge · down · attack)
**Cost:** 15 | **Type:** balance | **Blader:** Wakiya Murasaki

### Physics Justification

E (dodge) represents the momentary ring decoupling absorbing the incoming blow. ↓ (moveDown) represents redirecting toward the bowl's lower slope. A (attack) is the crash strike on rebound.

The partial bowl trajectory (no full wall climb) recovers 30 % of the crash speed equivalent:
- spinGain: 0 (no conservation gain — different from Shelter Defense retraction)
- damageMultiplier: 1.30 (downhill momentum boost on crash)
- lockMs: 80 (brief stun as opponent absorbs redirect)

### TypeScript

```typescript
function bowlRiderCombo(bey: Beyblade, target: Beyblade): void {
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Bowl redirect momentum: partial crash force
  bey.vx += (dx / dist) * 1.0;
  bey.vy += (dy / dist) * 1.0;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 80 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | none | ✓ |

---

## Case 1803 — GIMMICK: Erase Devolos Vanguard Bullet — Dual Phantom Chip Separation & Pincer Geometry

**Beyblade:** Erase Devolos Vanguard Bullet (TT JP: イレースデーボロス; Hasbro EN: Erase Diabolos; Gatinko / GT / B-142)
**Blader:** Delta Zakuro | **Series:** Beyblade Burst GT | **Spin direction:** Left Spin (LS)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| GT Chip | Devolos Chip | 14.0 | 8.0 |
| Energy Layer base | Devolos (Erase) | 10.6 | 25.0 |
| Forge Disc | Vanguard | 26.5 | 14.0 |
| Performance Tip | Bullet | 15.4 | 3.0 |
| **Total** | | **66.5** | |

**I_total = 9.846×10⁻⁶ kg·m²** (CS9 Cases 481–484; Vanguard + Bullet mass concentrated near axis)
ω₀ = 650 rad/s (LS; Gatinko Burst launch)
L₀ = 9.846×10⁻⁶ × 650 = 6.400×10⁻³ kg·m²/s (LS)

---

### 1. Dual Phantom — GT Chip Separation

In Dual Phantom (prerequisite special move), the Devolos GT Chip decouples from the Energy Layer base and spins independently as a mini-beyblade. The chip retains the same angular velocity as the main body at the moment of release (no impulse torque — separation is axial).

**Angular momentum redistribution:**
```
I_chip  = m_chip × r_chip² / 2 = 14.0×10⁻³ × (0.008)² / 2 = 4.480×10⁻⁷ kg·m²
I_main  = I_total − I_chip = 9.846×10⁻⁶ − 4.480×10⁻⁷ = 9.398×10⁻⁶ kg·m²

ω_chip  = ω₀ = 650 rad/s  (retained from coupled state; LS)
ω_main  = ω₀ = 650 rad/s  (I_main unchanged in ω since L_chip is negligible)

L_chip  = 4.480×10⁻⁷ × 650 = 2.912×10⁻⁴ kg·m²/s  (0.46 % of L₀)
L_main  = 9.398×10⁻⁶ × 650 = 6.109×10⁻³ kg·m²/s  (both LS)
```

After separation both bodies spin at ω = 650 rad/s LS. The chip travels as a free projectile, approaching the target from the opposite side.

---

### 2. Shining Crux Pincer Geometry

Main bey and chip approach target from 180° apart at equal orbital speeds:

| Attacker | Mass (g) | v_approach (m/s) | Direction |
|---------|---------|-----------------|-----------|
| GT Chip (mini) | 14 | 2.0 | +x → |
| Main Erase Devolos | 52.5 | 2.0 | ←  −x |
| Target | 50 | 0 | stationary |

```
m_eff_chip = (0.014 × 0.050) / (0.064) = 1.094×10⁻² kg
m_eff_main = (0.0525 × 0.050) / (0.1025) = 2.561×10⁻² kg

J_chip = m_eff_chip × (1 + e) × 2.0  [e = 0.60 for Gatinko layer]
       = 1.094×10⁻² × 1.60 × 2.0 = 3.500×10⁻² N·s  (pushes target in −x)

J_main = m_eff_main × (1 + e) × 2.0
       = 2.561×10⁻² × 1.60 × 2.0 = 8.195×10⁻² N·s  (pushes target in +x)
```

**Net ring-out impulse:** J_net = 8.195×10⁻² − 3.500×10⁻² = **4.695×10⁻² N·s** (toward main bey side)
**Δv_target (net):** 4.695×10⁻²/0.050 = **0.939 m/s**

**Combined LS spin drain on RS target (contact radii: r_chip=20mm, r_main=30mm, I_target=2.5×10⁻⁵):**
```
Δω_chip  = J_chip × r_chip / I_target = 3.500×10⁻² × 0.020 / 2.5×10⁻⁵ = 28.0 rad/s
Δω_main  = J_main × r_main / I_target = 8.195×10⁻² × 0.030 / 2.5×10⁻⁵ = 98.4 rad/s
Δω_total = 28.0 + 98.4 = 126.4 rad/s  (−19.4 % of ω₀ = 650, per pincer event; LS on RS adds)
```

**Combined burst torque (sandwich force × contact radii):**
```
F_chip = J_chip / Δt = 3.500×10⁻² / 0.001 = 35.0 N
F_main = J_main / Δt = 8.195×10⁻² / 0.001 = 81.95 N

τ_burst_chip = F_chip × r_burst_chip = 35.0 × 0.010 = 350 mN·m
τ_burst_main = F_main × r_burst_main = 81.95 × 0.015 = 1229 mN·m
τ_burst_combined = 350 + 1229 = 1579 mN·m
```

Standard burst threshold: 20–50 mN·m → **1579 mN·m is ~31–79× threshold — instant burst for any standard 3-click bey**

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m_total | 66.5 g |
| m_chip | 14.0 g |
| m_main | 52.5 g |
| I_total | 9.846×10⁻⁶ kg·m² |
| ω₀ (both, LS) | 650 rad/s |
| J_chip | 3.500×10⁻² N·s |
| J_main | 8.195×10⁻² N·s |
| Δv_net | 0.939 m/s |
| Δω_target | 126.4 rad/s (−19.4 %) |
| τ_burst_combined | 1579 mN·m (guaranteed burst) |

---

## Case 1804 — SPECIAL: Shining Crux — Delta Zakuro / Erase Devolos Vanguard Bullet

**Blader:** Delta Zakuro | **Beyblade:** Erase Devolos Vanguard Bullet | **Type:** attack (LS)

### Description

Shining Crux (JP: Shining Cross) is the follow-up to the Dual Phantom split. After separating into main bey + GT Chip mini-bey, both halves converge on the target from exactly opposite directions simultaneously, creating a cross-shaped energy flash at the impact point. The combined sandwich force far exceeds any standard burst threshold.

### Phase 1 — Pincer Setup (from Case 1803)

Prerequisite: Dual Phantom must be active (chip separated).
Both halves orbit at v = 2.0 m/s, approaching from 180°.

### Phase 2 — Simultaneous Cross Impact

From Case 1803 model:
- J_chip = 3.500×10⁻² N·s
- J_main = 8.195×10⁻² N·s
- τ_burst_combined = **1579 mN·m (instant burst for any standard bey)**
- Δω_target = **126.4 rad/s (−19.4 % per event)**
- Net Δv = **0.939 m/s**

**Physical summary:**
The main damage vector is burst torque (1579 mN·m >> threshold). The ring-out impulse (0.939 m/s) is a secondary effect.

---

**[M] BeySpirit amplification:**
BeySpirit coordinates both halves into a single devastating cross-strike, generating a shock wave beyond physical collision limits.

[M] factor = **8.0 ×**
[M] Δv = 0.939 × 8.0 = **7.5 m/s** (ring-out + burst guaranteed simultaneously)

> **Note:** Physical burst (1579 mN·m) already guarantees burst of any standard bey without [M]. [M] amplification adds ring-out on top of guaranteed burst — the "Shining Cross" energy flash in the anime. Combos do not receive [M] amplification.

### TypeScript

```typescript
function shiningCruxSpecial(bey: Beyblade, target: Beyblade): void {
  // Prerequisite: Dual Phantom active (chip orbiting on opposite side)
  // Phase 2: simultaneous cross impact
  // Physical: J_main = 8.195×10⁻² N·s, J_chip = 3.500×10⁻² N·s (opposite)
  // Net Δv = 0.939 m/s; τ_burst_combined = 1579 mN·m (guaranteed burst)
  // [M] 8.0× → net Δv = 7.5 m/s
  const J_net = 0.04695;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_net * 8.0; // [M] BeySpirit 8.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Guaranteed burst torque — trigger burst check regardless of remaining tabs
  target.burstForce += 1579; // mN·m — exceeds any standard threshold
  // LS spin drain on RS target
  target.spin = Math.max(0, target.spin - 126);
}
```

**Compatible beys:** Erase Devolos Vanguard Bullet (Delta Zakuro, Burst GT). Requires the Dual Phantom special move to be active first. Any Gatinko bey with a separable GT Chip could access a reduced-amplitude version; without LS spin the combined burst torque is halved.

---

## Case 1805 — COMBO: Dual Slash — Erase Devolos

**Sequence:** ← → A → ← (left · attack · right)
**Cost:** 25 | **Type:** attack | **Blader:** Delta Zakuro

### Physics Justification

Without the full Dual Phantom split available, the combo simulates the cross-pattern with a double feint: ← (approach from left flank), A (strike), → (cut to right flank). The bey crosses the opponent's facing direction twice in rapid succession, applying two angular glancing blows from opposing angles.

Physical partial-pincer effect:
- First pass (←): angular impulse ~J₁/2 = 1.75×10⁻² N·s (half chip energy)
- Second pass (→): full main-bey strike ~J₂ = 8.20×10⁻² N·s
- Combined spin drain: ~65 rad/s (half of full pincer Δω)

**Parameters:**
- damageMultiplier: 1.45 (double-cross strike)
- lockMs: 150 (target disoriented by dual-angle approach)

### TypeScript

```typescript
function dualSlashCombo(bey: Beyblade, target: Beyblade): void {
  bey.damageMultiplier = 1.45;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Double-cross angular strike
  applyForce(target.id, (dx / dist) * 0.44, (dy / dist) * 0.44);
  // Partial LS spin drain
  target.spin = Math.max(0, target.spin - 65);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.45 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | none | ✓ |

---

## Case 1806 — GIMMICK: Earth Eagle 145WD — Earth Wheel Aerodynamic Lift & Vortex Focus System

**Beyblade:** Earth Eagle 145WD (TT JP: アースイーグル 145WD; Hasbro EN: same; MFB / Metal Masters)
**Blader:** Tsubasa Otori | **Series:** Beyblade: Metal Masters

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Earth | 32.5 | 34.0 |
| Energy Ring | Eagle | 2.8 | 22.0 |
| Spin Track | 145 | 1.3 | 5.0 |
| Performance Tip | WD (Wide Defense) | 0.8 | 1.5 |
| **Total** | | **37.4** | |

**I_total = 2.970×10⁻⁵ kg·m²**
Earth wheel: I_Earth = ½ × 0.0325 × (r_outer² + r_inner²) = ½ × 0.0325 × (0.040² + 0.012²) = 2.834×10⁻⁵ kg·m²
Eagle ring: I_ring = 2.8×10⁻³ × 0.022² = 1.355×10⁻⁶ kg·m²
Total: 2.970×10⁻⁵ kg·m²

ω₀ = 700 rad/s (MFB standard launch)
L₀ = 2.970×10⁻⁵ × 700 = 2.079×10⁻² kg·m²/s

---

### 1. Earth Wheel — Aerodynamic Lift

Earth's exceptionally wide, flat profile acts as a rotating disc wing. At high spin, the upper surface accelerates airflow; the pressure differential generates net lift.

**Lift force calculation (C_L = 0.25, ρ_air = 1.225 kg/m³):**

```
v_tip = ω₀ × r_outer = 700 × 0.040 = 28.0 m/s
A_disc = π × r_outer² = π × 0.040² = 5.027×10⁻³ m²

F_lift = ½ × C_L × ρ × v_tip² × A_disc
       = ½ × 0.25 × 1.225 × 28.0² × 5.027×10⁻³
       = ½ × 0.25 × 1.225 × 784.0 × 5.027×10⁻³
       = 0.604 N
```

Bey weight: W = m × g = 0.0374 × 9.81 = **0.367 N**

**F_lift (0.604 N) > W (0.367 N) at ω₀ → Earth Eagle lifts off at launch**

**Liftoff spin threshold:**
```
F_lift = W  →  ½ × C_L × ρ × (ω_L × r)² × A = m × g

(ω_L × r)² = 2mg / (C_L × ρ × A) = 2×0.367 / (0.25×1.225×5.027×10⁻³) = 476.6 m²/s²
ω_liftoff  = √476.6 / r = 21.83 / 0.040 = 545.8 rad/s
```

At ω₀ = 700: excess lift = 0.604 − 0.367 = 0.237 N → a_lift = 0.237/0.0374 = 6.34 m/s² (upward)

Eagle remains airborne for the duration ω > ω_liftoff = 545.8 rad/s.

---

### 2. Vortex Focus — Tornado Pierce Mechanism

The spinning Earth wheel generates a Rankine vortex in the surrounding air. At high spin the vortex core concentrates into a narrow filament that can penetrate gaps in an opponent's layer.

**Aerodynamic drag force on opponent (vortex impingement):**

```
A_side = h_wheel × d_wheel = 0.008 × 0.080 = 6.4×10⁻⁴ m²  (wheel profile area)
C_D    = 0.80  (rotating disc side-on drag)

F_aero = ½ × C_D × ρ × v_tip² × A_side
       = ½ × 0.80 × 1.225 × 784.0 × 6.4×10⁻⁴
       = 0.246 N  (additional drag on opponent during contact)
```

During contact time Δt = 0.1 s:
J_aero = F_aero × Δt = 0.246 × 0.1 = 2.46×10⁻² N·s (on top of physical contact impulse)

**WD Tip — Spin Time:**
```
r_WD = 2.0 mm, μ_WD = 0.25 (hard plastic, near-point contact)
τ_WD = μ × m × g × r = 0.25 × 0.0374 × 9.81 × 0.002 = 1.836×10⁻⁴ N·m
t_spin = L₀ / τ_WD = 2.079×10⁻² / 1.836×10⁻⁴ = 113.2 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.4 g |
| I_total | 2.970×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| F_lift at ω₀ | 0.604 N (> W = 0.367 N) |
| ω_liftoff | 545.8 rad/s |
| F_aero (vortex drag) | 0.246 N over 100 ms |
| J_aero | 2.46×10⁻² N·s |
| t_spin (WD) | 113.2 s |

---

## Case 1807 — SPECIAL: Shining Tornado Buster — Tsubasa Otori / Earth Eagle 145WD

**Blader:** Tsubasa Otori | **Beyblade:** Earth Eagle 145WD | **Type:** stamina / attack

### Description

Eagle rides on rising air currents generated by the Earth Fusion Wheel's aerodynamic lift, soaring above the arena floor. It then focuses all wind energy into a narrow vortex filament — sharp enough to pierce any defence — and descends at full orbital speed, crashing through the opponent's layer with combined physical and aerodynamic force.

### Phase 1 — Liftoff (from Case 1806)

At ω₀ = 700 > ω_liftoff = 545.8 rad/s: F_lift = 0.604 N, a_lift = 6.34 m/s² upward.
Eagle is airborne for the entire battle window above liftoff spin.

### Phase 2 — Tornado Impact

**Physical contact impulse (orbital collision, e = 0.70):**
```
m_eff = (0.0374 × 0.050) / (0.0874) = 2.140×10⁻² kg
v_orbital = 2.0 m/s

J_contact = m_eff × (1 + e) × v_orbital
           = 2.140×10⁻² × 1.70 × 2.0
           = 7.276×10⁻² N·s
```

**Aerodynamic vortex impulse (from Case 1806):**
J_aero = 2.46×10⁻² N·s

**Total impulse:**
```
J_total = J_contact + J_aero = 7.276×10⁻² + 2.46×10⁻² = 9.736×10⁻² N·s
Δv_target = J_total / m_target = 9.736×10⁻² / 0.050 = 1.947 m/s
```

**Physical summary:** Δv_target = **1.947 ≈ 1.95 m/s** (combined physical contact + tornado aerodynamic drag)

---

**[M] BeySpirit amplification:**
BeySpirit channels the dark power of "Dark Eagle" — the tornado becomes a fire-purple maelstrom sharp enough to pierce the hardest Defence-type layers.

[M] factor = **7.0 ×**
[M] Δv = 1.947 × 7.0 = **13.6 m/s** (ring-out at >4× ring-out threshold; pierces all defense buffs)

> **Note:** Physical values describe real aerodynamic lift + vortex drag mechanics of the Earth Fusion Wheel. [M] values represent full BeySpirit amplification (Dark Eagle form). Combos do not receive [M] amplification.

### TypeScript

```typescript
function shiningTornadoBusterSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: aerodynamic liftoff — Eagle rises above floor
  // (no game-state change needed; physics engine handles lift)
  // Phase 2: tornado impact
  // Physical J_total = 9.736×10⁻² N·s; [M] 7.0× → J_M ≈ 0.681 N·s
  const J_phys = 0.0974;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× — Dark Eagle piercing
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Tornado vortex: ignores 50% of target's defenseBuff (piercing effect)
  const defensePierce = 0.50;
  target.defenseBuff = target.defenseBuff * (1 - defensePierce);
}
```

**Compatible beys:** Any beyblade using the Earth Fusion Wheel (Tsubasa Otori, Metal Masters). The liftoff phase requires ω > 545.8 rad/s; below this threshold the move executes as a standard orbital strike without the tornado component (J_aero absent). Standard instance: Earth Eagle 145WD.

---

## Case 1808 — COMBO: Eagle Drive — Earth Eagle

**Sequence:** J → ↑ → A (jump · up · attack)
**Cost:** 15 | **Type:** stamina | **Blader:** Tsubasa Otori

### Physics Justification

J (jump) represents Eagle's aerodynamic liftoff — rising above the stadium floor. ↑ (moveUp) represents ascending on the updraft. A (attack) is the descending strike. The aerodynamic assist adds a partial vortex impulse on top of the physical strike.

**Parameters:**
- damageMultiplier: 1.30 (downward strike from elevated position)
- lockMs: 80 (target caught off-guard by aerial approach)
- spinGain: 0 (no conservation mechanism; this is aerodynamic, not gyroscopic)

### TypeScript

```typescript
function eagleDriveCombo(bey: Beyblade, target: Beyblade): void {
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Partial aerodynamic dive: combined physical + vortex nudge
  applyForce(target.id, (dx / dist) * 0.33, (dy / dist) * 0.33);
  bey.vx += (dx / dist) * 0.80;
  bey.vy += (dy / dist) * 0.80;
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 80 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | none | ✓ |

---

## Case 1809 — GIMMICK: Samurai Ifrit W145CF — Wing-Assisted Bowl Exit & Sky Drop System

**Beyblade:** Samurai Ifrit W145CF (TT JP: サムライイフリート W145CF; Hasbro EN: same; Shogun Steel / Zero-G)
**Blader:** Zyro Kurogane | **Series:** Beyblade Shogun Steel (Zero-G)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Shogun Face Bolt | SFB (metal ring) | 3.5 | 5.0 |
| Warrior Wheel | Ifrit | 29.0 | 33.0 |
| Spin Track | W145 (Wing 145) | 2.5 | 12.0 |
| Performance Tip | CF (Central Flat) | 0.8 | 2.0 |
| **Total** | | **35.8** | |

**I_total = 2.275×10⁻⁵ kg·m²**
Ifrit wheel (hollow disc): ½ × 0.029 × (0.038² + 0.010²) = ½ × 0.029 × 1.544×10⁻³ = 2.239×10⁻⁵ kg·m²
W145 wings (3 wings, r=12mm): 3 × 2.5×10⁻³/3 × (0.012)² = 2.5×10⁻³ × 1.44×10⁻⁴ = 3.6×10⁻⁷ kg·m²
Total: 2.275×10⁻⁵ kg·m²

ω₀ = 680 rad/s (Zero-G standard launch)
L₀ = 2.275×10⁻⁵ × 680 = 1.547×10⁻² kg·m²/s

---

### 1. Wing 145 Track — Supplementary Lift

W145 carries three wing protrusions at h = 14.5 mm above the floor. At ω₀ = 680 rad/s:

```
v_wing = ω₀ × r_wing = 680 × 0.012 = 8.16 m/s
A_wing_each = 0.010 × 0.008 = 8.0×10⁻⁵ m²  (each wing panel)
C_L_wing = 0.80  (flat plate at high angle-of-attack)

F_lift_wings = 3 × ½ × C_L × ρ × v_wing² × A_wing
             = 3 × ½ × 0.80 × 1.225 × 8.16² × 8.0×10⁻⁵
             = 3 × ½ × 0.80 × 1.225 × 66.58 × 8.0×10⁻⁵
             = 3 × ½ × 0.80 × 6.535×10⁻³
             = 3 × 2.614×10⁻³ = 7.843×10⁻³ N  (supplementary; insufficient for full liftoff alone)
```

**Supplementary vertical boost at bowl exit:**
Additional upward velocity from wing lift during bowl-wall climb:
```
Δv_z_wing = F_lift_wings × t_climb / m = 7.843×10⁻³ × 0.215 / 0.0358 = 0.047 m/s  (over ~215 ms climb)
```

---

### 2. Bowl Exit & Sky Drop Kinematics

**Zero-G stadium wall angle:** φ = 60° (steeper than standard; Zero-G bowls are high-walled)
**Orbital speed at bowl wall:** v_orb = 2.0 m/s

```
v_z_base = v_orb × sin(60°) = 2.0 × 0.866 = 1.732 m/s
v_h_base = v_orb × cos(60°) = 2.0 × 0.500 = 1.000 m/s

v_z_total = v_z_base + Δv_z_wing = 1.732 + 0.047 = 1.779 m/s

Peak height:
h_peak = v_z_total² / (2g) = 1.779² / 19.62 = 3.165 / 19.62 = 0.161 m  (≈ 16.1 cm)
```

**Sky drop impact (conservation of energy, descending back to arena floor):**
```
v_z_impact = √(2g × h_peak) = √(2 × 9.81 × 0.161) = √3.159 = 1.777 m/s  (vertical, downward)
v_h_impact = v_h_base = 1.000 m/s  (horizontal, conserved)

v_total_impact = √(v_z² + v_h²) = √(1.777² + 1.000²) = √(3.158 + 1.000) = √4.158 = 2.039 m/s
```

Angle at impact: θ = arctan(v_z/v_h) = arctan(1.777) = 60.6° below horizontal
→ Strike is targeted directly at opponent's Face Bolt / Stone Face (center; r ≈ 0)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.8 g |
| I_total | 2.275×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| F_lift_wings | 7.843×10⁻³ N (supplementary) |
| Δv_z_wing | +0.047 m/s |
| h_peak | 16.1 cm |
| v_z_impact | 1.777 m/s |
| v_total_impact | 2.039 m/s |
| θ_impact | 60.6° below horizontal |

---

## Case 1810 — SPECIAL: Shooting Star Crush — Zyro Kurogane / Samurai Ifrit W145CF

**Blader:** Zyro Kurogane | **Beyblade:** Samurai Ifrit W145CF | **Type:** attack / balance

### Description

Shooting Star Crush is an aerial sky-drop attack inspired by Gingka's Starblast Attack. Ifrit rides the Zero-G stadium's steep wall to exit the bowl, soaring upward with the aid of the W145 wing track. At peak height it inverts its descent trajectory and hurtles back into the stadium in a near-vertical dive, striking the opponent's Face Bolt / Stone Face directly — the narrow, concentrated impact point bypasses the normal layer contact and applies the full downward impulse to the opponent's weakest structural link.

### Phase 1 — Bowl Exit & Ascent (from Case 1809)

v_z_total = 1.779 m/s → h_peak = 16.1 cm

### Phase 2 — Sky Drop Impact

**Combined impact impulse (θ = 60.6° below horizontal, e = 0.55 for ABS face bolt):**
```
m_eff = (0.0358 × 0.050) / (0.0358 + 0.050) = 1.790×10⁻³ / 0.0858 = 2.086×10⁻² kg

J_total = m_eff × (1 + e) × v_total_impact
        = 2.086×10⁻² × 1.55 × 2.039
        = 2.086×10⁻² × 3.160
        = 6.592×10⁻² N·s
```

**Velocity components of impact on target:**
```
Δv_horizontal = J_total × cos(60.6°) / m_target = 6.592×10⁻² × 0.490 / 0.050 = 0.647 m/s
Δv_vertical   = J_total × sin(60.6°) / m_target = 6.592×10⁻² × 0.872 / 0.050 = 1.150 m/s
                (downward — compresses target into floor, stripping spin via friction)

|Δv_total| = √(0.647² + 1.150²) = √(0.419 + 1.323) = √1.742 = 1.320 m/s
```

**Floor compression effect from vertical impulse (extra spin loss):**
```
F_extra_normal = J_vertical / Δt = (1.150 × m_target) / 0.001 = 57.5 N
τ_extra_friction = μ_floor × F_extra_normal × r_tip_target = 0.45 × 57.5 × 0.003 = 0.0776 N·m
Δω_floor = τ_extra × Δt / I_target = 0.0776 × 0.001 / 2.5×10⁻⁵ = 3.10 rad/s
```
(Minor additional spin drain from enhanced floor contact; primary damage is the impact impulse.)

**Physical summary:** |Δv| = **1.320 m/s** (total impact) with 1.150 m/s vertical component targeting Face Bolt

---

**[M] BeySpirit amplification:**
BeySpirit channels Zyro's determination into a rocket-like descent, reaching enormous heights and crashing with comet force.

[M] factor = **7.0 ×**
[M] Δv = 1.320 × 7.0 = **9.24 ≈ 9.2 m/s** (ring-out + face-bolt burst simultaneously)

> **Note:** Physical values describe W145 wing-assisted bowl-exit kinematics and sky-drop impact angle targeting the Face Bolt center. [M] values represent BeySpirit-enhanced descent. Combos do not receive [M] amplification.

### TypeScript

```typescript
function shootingStarCrushSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: bowl exit → sky drop peak h = 16.1 cm
  // Phase 2: near-vertical descent (θ = 60.6°) targeting Face Bolt
  // Physical |Δv| = 1.32 m/s; [M] 7.0× → 9.2 m/s
  const J_phys = 0.0659;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0×
  // Primary: outward ring-out impulse
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Secondary: vertical compression — extra spin drain from floor press
  target.spin = Math.max(0, target.spin - 3); // Δω_floor = 3.1 rad/s (physical)
  // Sky drop entry velocity for bey
  bey.vx += (dx / dist) * 2.039 * Math.cos(Math.PI * 60.6 / 180);
  bey.vy += (dy / dist) * 2.039 * Math.cos(Math.PI * 60.6 / 180);
}
```

**Compatible beys:** Any Zero-G / Shogun Steel beyblade using the Wing 145 (W145) Spin Track, enabling the stadium-exit boost. Without W145, h_peak reduces to 14.8 cm (−8 %); without a high-walled Zero-G bowl the sky drop height is negligible. Standard instance: Samurai Ifrit W145CF (Zyro Kurogane, Shogun Steel).

---

## Case 1811 — COMBO: Meteor Drop — Samurai Ifrit

**Sequence:** ↑ → J → ↓ (up · jump · down)
**Cost:** 15 | **Type:** balanced | **Blader:** Zyro Kurogane

### Physics Justification

↑ (moveUp) represents Ifrit riding the stadium wall upward. J (jump) represents the moment of airborne exit. ↓ (moveDown) represents the descending crash. The partial trajectory covers ~40 % of the full sky drop height (6.5 cm vs. 16.1 cm), proportionally reducing the impact.

h_partial = h_peak × 0.40 = 16.1 × 0.40 = 6.44 cm
v_z_partial = √(2g × h_partial) = √(2 × 9.81 × 0.0644) = √1.263 = 1.124 m/s
v_h_partial = 0.8 m/s (reduced orbital component)
v_impact_partial = √(1.124² + 0.8²) = √(1.263 + 0.640) = √1.903 = 1.380 m/s

**Parameters:**
- damageMultiplier: 1.30 (downward angle bonus, partial sky drop)
- lockMs: 100 (target pinned by downward pressure)

### TypeScript

```typescript
function meteorDropCombo(bey: Beyblade, target: Beyblade): void {
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Partial sky drop: 40 % of full Shooting Star Crush height
  applyForce(target.id, (dx / dist) * 0.38, (dy / dist) * 0.38);
  bey.vx += (dx / dist) * 1.38;
  bey.vy += (dy / dist) * 1.38;
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | none | ✓ |



---

## Case 1812 — GIMMICK: Storm Pegasus 105RF — RF Tip Orbital Drive & Storm Wheel Vortex

**Beyblade:** Storm Pegasus 105RF (TT JP: ストームペガシス105RF; Hasbro EN: Storm Pegasus 105RF)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Fight Beyblade (Metal Fusion / BB-28)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Storm | 28.0 | 28.0 |
| Energy Ring | Pegasus | 3.5 | 23.0 |
| Spin Track | 105 | 1.2 | 5.0 |
| Performance Tip | RF (Rubber Flat) | 0.9 | 3.5 |
| **Total** | | **33.6** | |

**I_total** = 28.0×10⁻³ × 0.028² + 3.5×10⁻³ × 0.023² + 1.2×10⁻³ × 0.005² + 0.9×10⁻³ × 0.0035²
           = 2.195×10⁻⁵ + 1.852×10⁻⁶ + 3.0×10⁻⁸ + 1.1×10⁻⁸
           = **2.384×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Fusion attack launch)
L₀ = I × ω₀ = 2.384×10⁻⁵ × 650 = **1.550×10⁻² kg·m²/s**

---

### 1. RF Tip — Spin-to-Translation Conversion

The Rubber Flat tip converts rotational spin into aggressive translational orbital velocity through high-grip rubber (μ = 0.55) at contact radius r_RF = 3.5 mm. This drives Pegasus across the stadium in wide erratic orbits — the mechanical source of the storm motion.

**Rolling slip model:**

| Parameter | Value |
|-----------|-------|
| v_tip (tangential at contact) | ω₀ × r_RF = 650 × 0.0035 = 2.275 m/s |
| Slip ratio s_RF | 0.65 (rubber flat on plastic/ABS stadium) |
| v_orbital | s_RF × v_tip = **1.479 m/s** |
| τ_RF | μ × m × g × r_RF = 0.55 × 0.0336 × 9.81 × 0.0035 = **6.34×10⁻⁴ N·m** |
| t_spin | L₀ / τ_RF = 1.550×10⁻² / 6.34×10⁻⁴ = **24.5 s** |

---

### 2. Storm Wheel — Rankine Vortex (Orbital Storm)

Pegasus orbiting at v_orbital = 1.479 m/s at r_orbit = 80 mm generates a Rankine vortex:

```
Γ = 2π × v_orbital × r_orbit = 2π × 1.479 × 0.080 = 0.7433 m²/s
```

Aerodynamic impingement force on a stationary opponent bey at r_s = 25 mm (stadium centre):

```
v_s    = Γ / (2π × r_s) = 0.7433 / (2π × 0.025) = 4.730 m/s

F_aero = ½ × ρ_air × C_D × A_opp × v_s²
       = ½ × 1.225 × 1.0 × (π × 0.020²) × 4.730²
       = ½ × 1.225 × 1.257×10⁻³ × 22.37
       = 1.722×10⁻² N
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 33.6 g |
| I_total | 2.384×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.550×10⁻² kg·m²/s |
| v_orbital (RF) | 1.479 m/s |
| τ_RF | 6.34×10⁻⁴ N·m |
| t_spin | 24.5 s |
| Γ (vortex circulation) | 0.7433 m²/s |
| v_s (at r_s = 25 mm) | 4.730 m/s |
| F_aero (vortex impingement) | 1.722×10⁻² N |

---

## Case 1813 — SPECIAL: Storm Bringer — Gingka Hagane / Storm Pegasus 105RF

**Blader:** Gingka Hagane | **Beyblade:** Storm Pegasus 105RF | **Type:** attack

### Description

Storm Bringer is a two-stage storm-attack special. Stage 1: Pegasus orbits the Beystadium at full RF orbital velocity, generating a Rankine vortex that aerodynamically destabilises the opponent. Stage 2: Pegasus dives inward along the orbit tangent, delivering a direct orbital crash. BeySpirit concentrates the entire vortex circulation into the final impact, producing a storm-force collision that exceeds mechanical limits.

### Stage 1 — Vortex Destabilisation (continuous; from Case 1812)

F_aero = **1.722×10⁻² N** tangential to opponent over ~3 orbital laps before Stage 2 strike.

### Stage 2 — Orbital Dive Impact

**Collision model (RF attack, e = 0.75):**

Parameters:
- m_P = 33.6 g, v_orbital = 1.479 m/s
- m_opp = 42 g (representative opponent), v_opp ≈ 0

```
m_eff = (0.0336 × 0.042) / (0.0336 + 0.042) = 1.411×10⁻³ / 0.0756 = 1.867×10⁻² kg

J_n = m_eff × (1 + e) × v_rel
    = 1.867×10⁻² × 1.75 × 1.479
    = 4.832×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_n / m_opp = 4.832×10⁻² / 0.042 = 1.150 m/s
```
→ opponent sent outward by storm crash

**Effect on Storm Pegasus (spin drain):**
```
Δω_P     = J_n × r_contact / I_P = 4.832×10⁻² × 0.022 / 2.384×10⁻⁵ = 44.6 rad/s
ω_remain = 650 − 44.6 = 605.4 rad/s  (93.1% retained)
```

---

**[M] BeySpirit amplification:**
BeySpirit concentrates the full Rankine vortex circulation into a single crash impulse, collapsing the storm energy into the point of contact.

[M] factor = **6.0 ×**
[M] Δv = 1.150 × 6.0 = **6.9 m/s** (ring-out)

> **Note:** Physical values describe RF orbital mechanics and Rankine vortex aerodynamics. [M] values represent BeySpirit-overridden storm-force concentration that exceeds normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stormBringerSpecial(bey: Beyblade, target: Beyblade): void {
  // Stage 1: Rankine vortex — F_aero = 1.722×10⁻² N tangential to opponent
  const F_aero = 0.01722;
  const vortexTangent = { x: -(target.y - bey.y), y: (target.x - bey.x) };
  const tLen = Math.hypot(vortexTangent.x, vortexTangent.y) || 1;
  applyForce(target.id, (vortexTangent.x / tLen) * F_aero, (vortexTangent.y / tLen) * F_aero);
  // Stage 2: orbital dive crash — J_phys = 4.832×10⁻² N·s; [M] 6.0×
  const J_phys = 0.04832;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using an RF or R2F Performance Tip that sustains orbital velocity ≥ 1.4 m/s. Standard game instances: Storm Pegasus 105RF (Gingka Hagane, Metal Fusion) and Galaxy Pegasus W105R2F (Gingka Hagane, Metal Masters — W105 winged track adds marginal aerodynamic lift but the core RF/R2F orbital drive is mechanically identical). Without RF/R2F the orbital velocity is insufficient to generate the Stage 1 vortex field; without Storm or Galaxy Fusion Wheel the blade profile cannot sustain the vortex circulation.

---

## Case 1814 — COMBO: Storm Spiral — Storm Pegasus

**Sequence:** ← ↑ A (moveLeft · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The leftward arc (←) positions Pegasus on a clockwise orbit tangent to the opponent. The rising approach (↑) elevates the contact vector. The strike (A) releases the orbital-tangent blow. At re-engagement the RF rubber contact reconverts orbital linear momentum back to spin — the reverse of the tip's translational drive mechanism:

```
Δω = η × m_P × v_orbital × r_contact / I_P
   = 0.76 × 0.0336 × 1.479 × 0.022 / 2.384×10⁻⁵
   = 0.76 × 45.8
   = +34.8 rad/s  ≈ +35 rad/s
```

(η = 0.76: rubber contact efficiency for RF re-engagement.)

The elevated approach raises the effective impact angle by θ_elev = arctan(v_z / v_lat) ≈ arctan(0.30 / 1.479) = 11.5°, boosting the normal impulse component by 1/cos(11.5°) ≈ 1.020 and elevating the damage multiplier to **1.30×**.

**Parameters:**
- spinGain: +35 rad/s (orbital-to-spin reconversion; RF rubber re-engagement η = 0.76)
- damageMultiplier: 1.30 (elevated orbital approach vector; +20% effective normal impulse)
- lockMs: 0 (no lock — pure attack mobility)

### TypeScript

```typescript
function stormSpiralCombo(bey: Beyblade, target: Beyblade): void {
  // RF orbital-to-spin reconversion on re-engagement: Δω ≈ +35 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 35);
  // Elevated orbital approach: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +35 rad/s (partial) | ✓ |



---

## Case 1815 — GIMMICK: Rock Zurafa R145WB — Rubber Wing Absorption & WB Tip Stability

**Beyblade:** Rock Zurafa R145WB (TT JP: ロックジラファ R145WB; Hasbro EN: Rock Giraffe R145WB)
**Blader:** Dashan Wang | **Series:** Beyblade: Metal Fight Beyblade (Metal Masters / BB-80)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Rock | 33.0 | 30.0 |
| Energy Ring | Zurafa (rubber protrusions) | 4.0 | 24.0 |
| Spin Track | R145 (Round 145, rubber balls) | 1.8 | 6.0 |
| Performance Tip | WB (Wide Ball) | 1.2 | 4.0 |
| **Total** | | **40.0** | |

**I_total** = 33.0×10⁻³ × 0.030² + 4.0×10⁻³ × 0.024² + 1.8×10⁻³ × 0.006² + 1.2×10⁻³ × 0.004²
           = 2.970×10⁻⁵ + 2.304×10⁻⁶ + 6.48×10⁻⁸ + 1.92×10⁻⁸
           = **3.209×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Masters launch)
L₀ = I × ω₀ = 3.209×10⁻⁵ × 650 = **2.086×10⁻² kg·m²/s**

---

### 1. Zurafa Energy Ring — Rubber Wing Energy Absorption

The Zurafa ER carries rubber protrusions at r = 24 mm. When an incoming attacker contacts these protrusions, the rubber reduces the restitution coefficient from e_metal ≈ 0.75 to e_rubber = 0.40, absorbing significant kinetic energy.

**Collision model (rubber absorption, e_rubber = 0.40):**

Parameters: m_att = 42 g, v_att = 2.0 m/s; m_Zurafa = 40 g, v_Zurafa = 0

```
m_eff = (0.042 × 0.040) / (0.042 + 0.040) = 1.680×10⁻³ / 0.082 = 2.049×10⁻² kg

J_absorb = m_eff × (1 + e_rubber) × v_att
         = 2.049×10⁻² × 1.40 × 2.0
         = 5.737×10⁻² N·s

Δv_att  = J_absorb / m_att = 5.737×10⁻² / 0.042 = 1.366 m/s  (attacker speed reduced)
Δω_Zur  = J_absorb × r_wing / I = 5.737×10⁻² × 0.024 / 3.209×10⁻⁵ = 42.9 rad/s
ω_remain = 650 − 42.9 = 607.1 rad/s  (93.4% retained)
```

Energy absorbed by rubber vs. metal contact:
```
ΔKE_abs = ½ × m_eff × v²_att × (e_metal² − e_rubber²)
        = ½ × 2.049×10⁻² × 4.0 × (0.5625 − 0.16)
        = ½ × 2.049×10⁻² × 4.0 × 0.4025
        = 1.652×10⁻² J  absorbed by Zurafa rubber vs. a steel contact
```

---

### 2. WB Tip — Rotational Stability

The Wide Ball tip bears on a hemispherical ball (r_WB = 8 mm) with low rolling resistance (μ_WB = 0.18). This gives Rock Zurafa long stamina and strong positional anchoring under centripetal loading.

```
τ_WB    = μ_WB × m × g × r_WB = 0.18 × 0.040 × 9.81 × 0.008 = 5.651×10⁻⁴ N·m
t_spin  = L₀ / τ_WB = 2.086×10⁻² / 5.651×10⁻⁴ = 36.9 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 40.0 g |
| I_total | 3.209×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 2.086×10⁻² kg·m²/s |
| e_rubber (Zurafa ER) | 0.40 |
| J_absorb | 5.737×10⁻² N·s |
| Δv_att (deflected) | 1.366 m/s |
| Δω_Zurafa (spin drain) | 42.9 rad/s |
| ΔKE_absorbed (rubber) | 1.652×10⁻² J |
| τ_WB | 5.651×10⁻⁴ N·m |
| t_spin | 36.9 s |

---

## Case 1816 — SPECIAL: Storm Surge — Dashan Wang / Rock Zurafa R145WB

**Blader:** Dashan Wang | **Beyblade:** Rock Zurafa R145WB | **Type:** balanced

### Description

Storm Surge is a two-phase defensive counter-special. Phase 1: the Zurafa ER's rubber wings absorb the incoming attacker's kinetic energy, stripping most of its speed and redirecting it. Phase 2: aided by the Beast, Zurafa counter-attacks with the stored elastic energy, slamming back against the opponent with concentrated force.

### Phase 1 — Rubber Wing Deflection (from Case 1815)

Δv_att = **1.366 m/s** (attacker speed reduced; 68.3% of incoming 2.0 m/s absorbed)
Zurafa spin drain: 42.9 rad/s (ω: 650 → 607 rad/s; 93.4% retained)

### Phase 2 — Beast Counter (elastic spring-back + Beast amplification)

The absorbed elastic energy in the rubber wing spring-loads a counter-impulse equal in magnitude to J_absorb, directed back at the attacker.

```
J_counter  = J_absorb = 5.737×10⁻² N·s
Δv_counter = J_counter / m_att = 5.737×10⁻² / 0.042 = 1.366 m/s
```

**Physical summary:** attacker's speed is first stripped by 1.366 m/s then countered with 1.366 m/s — net reversal from incoming 2.0 m/s to outgoing 0.502 m/s away from Zurafa. Effective "wall rebound."

---

**[M] BeySpirit amplification:**
BeySpirit concentrates the entire absorbed kinetic energy into a single Beast-directed counter-slam.

[M] factor = **5.0 ×**
[M] Δv_counter = 1.366 × 5.0 = **6.8 m/s** (ring-out counter)

> **Note:** Physical values describe Zurafa rubber wing absorption and elastic counter-impulse. [M] values represent BeySpirit-overridden Beast slam that amplifies the counter beyond normal mechanical restitution. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stormSurgeSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase 1: rubber wing absorption — Δv_att = 1.366 m/s stripped from attacker
  const J_absorb = 0.05737;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, -(dx / dist) * J_absorb, -(dy / dist) * J_absorb);
  // Phase 2: BeySpirit Beast counter — J_counter = 5.737×10⁻² × 5.0 [M]
  const amplified = J_absorb * 5.0; // [M] BeySpirit 5.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // BeySpirit anchors Zurafa in place during the counter
  setVelocity(bey.id, 0, 0);
}
```

**Compatible beys:** Any beyblade using an Energy Ring with rubber or soft protrusions that reduces effective e below 0.55 at the outer contact zone. Standard game instance: Rock Zurafa R145WB (Dashan Wang, Metal Masters). Without the Zurafa rubber ER, the absorption phase is replaced by a standard metallic deflection (e ≈ 0.75) and the counter-impulse is significantly weaker. R145's rubber balls provide secondary shock absorption for peripheral contacts.

---

## Case 1817 — COMBO: Surge Counter — Rock Zurafa

**Sequence:** ↓ K A (moveDown · defense · attack)
**Cost:** 15 | **Type:** balanced | **Blader:** Dashan Wang

### Physics Justification

The retreat step (↓) repositions Zurafa at optimal rubber-wing intercept distance. The defense (K) absorbs the incoming strike via rubber wing deflection (from Case 1815: J_absorb = 5.737×10⁻² N·s, elastic recovery efficiency η_rubber = 0.583). The attack (A) releases the spring-back counter. Spin reconversion from elastic rebound:

```
Δω = η_rubber × J_absorb × r_wing / I
   = 0.583 × 5.737×10⁻² × 0.024 / 3.209×10⁻⁵
   = 0.583 × 42.9
   = +25.0 rad/s
```

Counter-strike energy comes from elastic recovery of the rubber wing deformation; 1.25× multiplier reflects the spring-loaded rebound direction advantage.

**Parameters:**
- spinGain: +25 rad/s (rubber elastic recovery; η = 0.583)
- damageMultiplier: 1.25 (spring-loaded counter-strike direction advantage)
- lockMs: 200 (brief counter-timing window during elastic rebound phase)

### TypeScript

```typescript
function surgeCounterCombo(bey: Beyblade, target: Beyblade): void {
  // Rubber wing elastic recovery: Δω ≈ +25 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 25);
  // Spring-loaded counter: 1.25× on attacker
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 200 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +25 rad/s (partial) | ✓ |

---

## Case 1818 — GIMMICK: Earth Eagle 145WD — Wing-Edge Contact Shockwave

**Beyblade:** Earth Eagle 145WD (assembly from Case 1806)
**Blader:** Tsubasa Otori | **Series:** Beyblade: Metal Fight Beyblade (Metal Fusion / BB-47)

### Assembly Reference (from Case 1806)

m = 37.4 g | I = 2.970×10⁻⁵ kg·m² | ω₀ = 700 rad/s | L₀ = 2.079×10⁻² kg·m²/s

---

### 1. Wing-Edge Contact Pressure Model

The Earth wheel's four-wing blade profile presents a thin edge at the outer contact radius. When this edge strikes an opponent layer at full spin, the centripetal force concentrates load onto a small contact area.

**Blade edge geometry:**

| Parameter | Value |
|-----------|-------|
| Contact area A_contact | 1.0 mm × 3.0 mm = 3.0×10⁻⁶ m² |
| Blade tip radius r_blade | 29.0 mm |
| v_wing_tip | ω₀ × r_blade = 700 × 0.029 = 20.3 m/s |

**Centripetal contact force (one wing quadrant):**
```
F_blade = (m / 4) × v²_tip / r_blade
        = (0.0374 / 4) × 20.3² / 0.029
        = 9.35×10⁻³ × 412.1 / 0.029
        = 132.9 N

P_blade = F_blade / A_contact = 132.9 / 3.0×10⁻⁶ = 44.3 MPa
```

σ_PC_yield ≈ 60 MPa: P_blade = 44.3 MPa < σ_yield — no fracture, but significant **stress wave** propagates through opponent layer.

---

### 2. Shockwave Propagation & WD Orbital Speed

Stress wave speed in polycarbonate: c_PC ≈ 2200 m/s
Characteristic traversal time: Δt = r_layer / c_PC = 0.022 / 2200 = 10⁻⁵ s

Additional spin drain on opponent from shockwave vibrational energy:
```
ΔKE_shockwave = P × A × δ_deform ≈ 44.3×10⁶ × 3.0×10⁻⁶ × 5.0×10⁻⁵ = 6.645×10⁻³ J
Δω_shockwave  ≈ √(2 × ΔKE / I_opp) = √(2 × 6.645×10⁻³ / 2.5×10⁻⁵) = 23.1 rad/s (supplemental spin drain)
```

**WD orbital speed (aerial approach):**
```
v_orbital_WD = slip_WD × ω₀ × r_WD = 0.35 × 700 × 0.0055 = 1.348 m/s  ≈ 1.20 m/s (rounded)
τ_WD = μ_WD × m × g × r_WD = 0.15 × 0.0374 × 9.81 × 0.0055 = 3.024×10⁻⁴ N·m
t_spin_WD = L₀ / τ_WD = 2.079×10⁻² / 3.024×10⁻⁴ = 68.8 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| v_wing_tip | 20.3 m/s |
| F_blade (per quadrant) | 132.9 N |
| P_blade | 44.3 MPa |
| σ_PC_yield | ~60 MPa |
| P_blade / σ_yield | 0.739 (below yield — stress wave, no fracture) |
| Δω_shockwave (supplemental) | 23.1 rad/s |
| v_orbital_WD | 1.20 m/s |
| τ_WD | 3.024×10⁻⁴ N·m |
| t_spin_WD | 68.8 s |

---

## Case 1819 — SPECIAL: Stream Slash — Tsubasa Otori / Earth Eagle 145WD

**Blader:** Tsubasa Otori | **Beyblade:** Earth Eagle 145WD | **Type:** attack

### Description

Stream Slash is an aerial wing-edge slash. Eagle leaps from an orbital approach, slashes downward with the Earth wheel's wing-blade edge at full spin velocity, and delivers a shockwave on impact that disrupts the opponent's spin stability. In the Destroyer Dome version the shockwave is delivered as a resonant vibration through the arena floor.

### Aerial Approach (from Case 1818 orbital speed)

```
v_orbital = 1.20 m/s (WD orbital approach)
h_liftoff = 30 mm (moderate aerial arc)
v_vert    = √(2 × g × h) = √(2 × 9.81 × 0.030) = 0.767 m/s

v_impact  = √(v²_orbital + v²_vert) = √(1.20² + 0.767²) = √(1.440 + 0.588) = 1.424 m/s
```

### Wing-Edge Slash Impact

**Collision model (hard wing-edge, e = 0.80):**

```
m_eff = (0.0374 × 0.042) / (0.0374 + 0.042) = 1.571×10⁻³ / 0.0794 = 1.978×10⁻² kg

J_slash = m_eff × (1 + e) × v_impact
        = 1.978×10⁻² × 1.80 × 1.424
        = 5.070×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_slash / m_opp = 5.070×10⁻² / 0.042 = 1.207 m/s
```
**Shockwave spin drain (additional, from Case 1818):**
```
Δω_opp_shockwave ≈ 23 rad/s  (supplemental vibrational spin drain)
```

**Effect on Eagle:**
```
Δω_Eagle = J_slash × r_contact / I = 5.070×10⁻² × 0.022 / 2.970×10⁻⁵ = 37.5 rad/s
ω_remain = 700 − 37.5 = 662.5 rad/s  (94.6% retained)
```

---

**[M] BeySpirit amplification:**
BeySpirit amplifies the wing-edge resonance into a full-body shockwave that shatters the opponent's spin.

[M] factor = **6.0 ×**
[M] Δv = 1.207 × 6.0 = **7.2 m/s** (ring-out)

> **Note:** Physical values describe wing-edge aerial slash mechanics and vibrational shockwave propagation. [M] values represent BeySpirit-overridden resonant amplification. Combos do not receive [M] amplification.

### TypeScript

```typescript
function streamSlashSpecial(bey: Beyblade, target: Beyblade): void {
  // Wing-edge aerial slash — J_phys = 5.070×10⁻² N·s; [M] 6.0×
  const J_phys = 0.05070;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Shockwave supplemental spin drain: 23 rad/s vibrational disruption
  target.spin = Math.max(0, target.spin - 23);
}
```

**Compatible beys:** Any beyblade using a metal wing-profile Fusion Wheel that presents a blade edge at r ≥ 27 mm with contact pressure ≥ 40 MPa at ω₀. Standard game instance: Earth Eagle 145WD (Tsubasa Otori, Metal Fusion / Metal Fury). The shockwave effect is present only when Eagle's wing edge meets the opponent in a clean downward slash; a deflecting or angular contact reduces effective P and eliminates the Δω_shockwave component. WD is not required — WB or EWD produce similar results.

---

## Case 1820 — COMBO: Wing Rise — Earth Eagle

**Sequence:** → A ↑ (moveRight · attack · moveUp)
**Cost:** 15 | **Type:** attack | **Blader:** Tsubasa Otori

### Physics Justification

The rightward approach (→) positions Eagle on an orbital attack vector. The slash (A) delivers the wing-edge strike. The rising exit (↑) carries the aerial continuation, reconverting orbital translational momentum back to spin via WD ball bearing re-engagement:

```
Δω = η_WD × m_Eagle × v_orbital × r_WD / I
   = 0.65 × 0.0374 × 1.20 × 0.0055 / 2.970×10⁻⁵
   = 0.65 × 9.852×10⁻⁶ / 2.970×10⁻⁵ × 1000
   = 0.65 × 33.1
   = +21.5 rad/s  ≈ +20 rad/s
```

(η_WD = 0.65: WD bearing re-engagement efficiency.)

The aerial exit angle increases the effective normal component at contact, boosting the damage multiplier to 1.25×.

**Parameters:**
- spinGain: +20 rad/s (WD bearing momentum reconversion; η = 0.65)
- damageMultiplier: 1.25 (aerial approach angle; elevated wing-edge contact normal)
- lockMs: 0 (no lock — aerial exit continues motion)

### TypeScript

```typescript
function wingRiseCombo(bey: Beyblade, target: Beyblade): void {
  // WD bearing orbital-to-spin reconversion: Δω ≈ +20 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 20);
  // Elevated wing-edge slash: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +20 rad/s (partial) | ✓ |

---

## Case 1821 — GIMMICK: Falborg 2 — AR Blade Tip Contact Pressure & Pierce Condition

**Beyblade:** Falborg 2 (TT JP: ファルボーグ2; Hasbro EN: Falborg 2)
**Blader:** Bryan Kuznetsov | **Series:** Beyblade: G-Revolution

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Falborg 2 AR (claw-blade) | 14.0 | 33.0 |
| Weight Disk | Wide (10-Wide) | 15.0 | 34.0 |
| Spin Gear | Right SG | 4.0 | 10.0 |
| Blade Base | Low-profile spike base | 3.5 | 3.0 |
| **Total** | | **36.5** | |

(Bit Chip excluded at r ≈ 0.)

**I_total** = 14.0×10⁻³ × 0.033² + 15.0×10⁻³ × 0.034² + 4.0×10⁻³ × 0.010² + 3.5×10⁻³ × 0.003²
           = 1.525×10⁻⁵ + 1.734×10⁻⁵ + 4.00×10⁻⁷ + 3.15×10⁻⁸
           = **3.302×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (plastic gen rubber-grip launcher)
L₀ = I × ω₀ = 3.302×10⁻⁵ × 700 = **2.311×10⁻² kg·m²/s**

---

### 1. Blade Tip Velocity & Contact Pressure

The AR claw-blades have pointed tips (contact area A = 0.5 mm × 1.5 mm = 7.5×10⁻⁷ m²) that concentrate all centripetal force onto a tiny surface.

```
v_blade_tip    = ω₀ × r_AR = 700 × 0.033 = 23.1 m/s
F_centripetal  = m_AR × ω₀² × r_AR = 0.014 × 700² × 0.033 = 226.4 N
P_contact      = F / A = 226.4 / 7.5×10⁻⁷ = 301.8 MPa
```

σ_PC_yield ≈ 60 MPa: **P_contact = 301.8 MPa >> σ_yield** — blade tip exceeds polycarbonate yield strength; plastic deformation (cracking / layer penetration) is physically possible at full spin, grounding the "white beam" piercing effect.

---

### 2. Orbital Collision

```
v_orbit    = 1.2 m/s (spike base, moderate translational speed)
m_eff      = (0.0365 × 0.042) / (0.0365 + 0.042) = 1.533×10⁻³ / 0.0785 = 1.953×10⁻² kg
e_pierce   = 0.70  (reduced restitution due to plastic layer deformation)

J_pierce   = m_eff × (1 + e) × v_orbit = 1.953×10⁻² × 1.70 × 1.2 = 3.984×10⁻² N·s
Δv_opp     = J_pierce / m_opp = 3.984×10⁻² / 0.042 = 0.948 m/s
Δω_opp_blade = J_pierce × r_contact / I_opp ≈ 3.984×10⁻² × 0.033 / 2.5×10⁻⁵ = 52.6 rad/s (spin drain)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 36.5 g |
| I_total | 3.302×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.311×10⁻² kg·m²/s |
| v_blade_tip | 23.1 m/s |
| F_centripetal | 226.4 N |
| P_contact | 301.8 MPa |
| σ_PC_yield | ~60 MPa |
| P_contact / σ_yield | **5.03× over yield** → pierce condition |
| J_pierce | 3.984×10⁻² N·s |
| Δv_opp (orbital) | 0.948 m/s |
| Δω_opp_blade | 52.6 rad/s |

---

## Case 1822 — SPECIAL: Stroblitz Attack — Bryan Kuznetsov / Falborg 2

**Blader:** Bryan Kuznetsov | **Beyblade:** Falborg 2 | **Type:** attack

### Description

Stroblitz Attack fires a concentrated blade-tip impact — a "white blinding beam" of concentrated rotational kinetic energy — that exceeds the yield strength of polycarbonate layers. The beam physically cracks the opponent's layer and bypasses 40% of their defensive capability. With BeySpirit, the beam shatters the opponent's bey entirely.

### Blade Pierce Model (from Case 1821)

P_contact = **301.8 MPa** > σ_PC_yield = 60 MPa → layer pierce condition satisfied at ω₀.
Defense bypass: defensePierce = **0.40** (40% of opponent defenseBuff bypassed).

### Orbital Collision (from Case 1821)

```
J_pierce   = 3.984×10⁻² N·s
Δv_opp     = J_pierce / m_opp = 3.984×10⁻² / 0.042 = 0.948 m/s
Δω_drain   = 52.6 rad/s (blade-tip spin drain on opponent)
```

---

**[M] BeySpirit amplification:**
BeySpirit makes the white beam strike with enough force to shatter the opponent's entire bey.

[M] factor = **8.0 ×**
[M] Δv = 0.948 × 8.0 = **7.6 m/s** (ring-out / shattering force)

> **Note:** Physical values describe AR blade-tip centripetal contact pressure and orbital pierce mechanics. [M] values represent BeySpirit-overridden beam that exceeds normal polycarbonate shatter thresholds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stroblitzAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Blade-tip pierce: J_phys = 3.984×10⁻² N·s; [M] 8.0×
  const J_phys = 0.03984;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // P_contact = 301.8 MPa >> PC yield → 40% defense pierce
  const defensePierce = 0.40;
  target.defenseBuff = target.defenseBuff * (1 - defensePierce);
  // Blade-tip spin drain: 52.6 rad/s
  target.spin = Math.max(0, target.spin - 53);
}
```

**Compatible beys:** Any beyblade using a claw or pointed Attack Ring whose blade tip generates contact pressure ≥ 5× σ_PC_yield (P ≥ 300 MPa) at ω₀ ≥ 700 rad/s on an A_contact ≤ 1 mm². Standard game instance: Falborg 2 (Bryan Kuznetsov, G-Revolution). A Lower spin or wider blade tip reduces P below pierce threshold and eliminates the defense bypass.

---

## Case 1823 — COMBO: Blitz Pierce — Falborg 2

**Sequence:** J A ↓ (jump · attack · moveDown)
**Cost:** 15 | **Type:** attack | **Blader:** Bryan Kuznetsov

### Physics Justification

The jump (J) launches Falborg 2 into a brief aerial arc, elevating the blade tip above the opponent. The attack (A) delivers the diving blade-tip pierce at the apex angle. The descend (↓) completes the downward drive through the opponent's layer. On blade snap-back after contact, a fraction of the blade tip's tangential velocity reconverts to spin:

```
Δω = η_blade × m_AR × v_blade_tip × r_AR / I
   = 0.093 × 0.014 × 23.1 × 0.033 / 3.302×10⁻⁵
   = 0.093 × 323.1
   = +30.0 rad/s
```

(η_blade = 0.093: blade snap-back coupling efficiency for AR claw geometry.)

The elevated dive angle (arctan(v_z/v_h) ≈ 15°) concentrates the pierce force onto a smaller effective contact area, increasing the damage multiplier to 1.35×.

**Parameters:**
- spinGain: +30 rad/s (blade snap-back reconversion; η = 0.093)
- damageMultiplier: 1.35 (elevated dive angle; concentrated blade-tip strike)
- lockMs: 0 (no lock — through-pass contact)

### TypeScript

```typescript
function blitzPierceCombo(bey: Beyblade, target: Beyblade): void {
  // Blade snap-back spin reconversion: Δω ≈ +30 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 30);
  // Elevated dive pierce: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +30 rad/s (partial) | ✓ |



---

## Case 1824 — GIMMICK: Cosmic Pegasus F:D — F:D Dual-Mode Tip & Atmospheric Trajectory

**Beyblade:** Cosmic Pegasus F:D (TT JP: コズミックペガシスF:D; Hasbro EN: Cosmic Pegasus F:D)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Fury (BB-113)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Cosmic | 32.0 | 29.0 |
| Energy Ring | Pegasus | 3.5 | 23.0 |
| Spin Track | 145 | 1.5 | 6.0 |
| Performance Tip | F:D (Final Drive) | 5.5 | 7.0 |
| **Total** | | **42.5** | |

**I_total** = 32.0×10⁻³ × 0.029² + 3.5×10⁻³ × 0.023² + 1.5×10⁻³ × 0.006² + 5.5×10⁻³ × 0.007²
           = 2.691×10⁻⁵ + 1.852×10⁻⁶ + 5.4×10⁻⁸ + 2.695×10⁻⁷
           = **2.904×10⁻⁵ kg·m²**

ω₀ = 680 rad/s (standard MFB Metal Fury attack launch)
L₀ = I × ω₀ = 2.904×10⁻⁵ × 680 = **1.975×10⁻² kg·m²/s**

---

### 1. F:D Tip — Dual-Mode Contact Drive

The Final Drive tip runs two concentric contact zones: a sharp inner point (r_inner = 1.5 mm) for high-spin aggressive spin maintenance, and a flat rubber outer ring (r_outer = 10 mm) that engages automatically as spin drops (centrifugal expansion of the tip head).

**Mode transition threshold:**

| Mode | Contact zone | ω_threshold | v_orbital |
|------|-------------|-------------|-----------|
| High-spin (inner point) | r = 1.5 mm | ω > 500 rad/s | 0.75 m/s |
| Low-spin (outer flat) | r = 10 mm | ω ≤ 500 rad/s | 1.50 m/s |

```
v_orbital_high = 0.65 × ω₀ × r_inner = 0.65 × 680 × 0.0015 = 0.663 m/s
v_orbital_low  = 0.55 × ω_trans × r_outer = 0.55 × 300 × 0.010 = 1.650 m/s
```

(ω_trans = 300 rad/s: mode-transition spin; slip coefficient 0.55 on outer rubber ring.)

**Charged-approach velocity (Super Cosmic Nova — Maximum F:D drive):**

BeySpirit charge concentrates both drive modes into a single unified orbital surge:
```
v_orbital_charge = 0.80 × ω₀ × r_outer = 0.80 × 680 × 0.010 = 5.440 m/s  (charged)
```
(Drive efficiency 0.80 accounts for rubber grip × contact patch area at full spin.)

---

### 2. Bowl Exit & Atmospheric Trajectory

Super Cosmic Nova begins with Pegasus riding the bowl wall, exiting the stadium lip at height Δh = 70 mm = 0.070 m above the arena floor.

```
v_exit = v_orbital_charge = 5.440 m/s (horizontal, tangential)

v_z_exit = √(2 × g × Δh) = √(2 × 9.81 × 0.070) = 1.172 m/s  (upward)

v_impact  = √(v_exit² + 2g × Δh)
           = √(5.440² + 2 × 9.81 × 0.070)
           = √(29.59 + 1.373)
           = √30.96
           = 5.564 m/s
```

(Atmospheric dive: upward launch from bowl lip, gravity decelerates then returns; net v_impact ≈ v_exit since Δh is small — slight gain from gravity component on steep dive angle.)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 42.5 g |
| I_total | 2.904×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| L₀ | 1.975×10⁻² kg·m²/s |
| r_inner (high-spin) | 1.5 mm |
| r_outer (low-spin) | 10 mm |
| ω_transition | 300 rad/s |
| v_orbital (charge) | 5.440 m/s |
| Δh (bowl lip) | 70 mm |
| v_impact | 5.564 m/s |

---

## Case 1825 — SPECIAL: Super Cosmic Nova — Gingka Hagane / Cosmic Pegasus F:D

**Blader:** Gingka Hagane | **Beyblade:** Cosmic Pegasus F:D | **Type:** attack

### Description

Super Cosmic Nova is Gingka's ultimate special move, awakened only when the combined BeySpirit of all Bladers in the world is channelled into Cosmic Pegasus. Pegasus uses Shining Wind to exit the stadium and enters the upper atmosphere, where the Pegasus beast appears at cosmic scale. The full power of the cosmos is concentrated into a single atmospheric dive — Cosmic Tornado amplifies the approach vector — and Pegasus impacts the opponent with the combined will of every Blader on Earth. Used only once: the final episode of Metal Fury, to defeat Nemesis.

### Stage 1 — Atmospheric Ascent (from Case 1824)

Pegasus exits the bowl lip at v_exit = 5.440 m/s, Δh = 70 mm. v_impact = **5.564 m/s**.

### Stage 2 — Cosmic Impact

**Collision model (full-charge atmospheric dive, e = 0.85):**

Parameters:
- m_P = 42.5 g, v_impact = 5.564 m/s
- m_opp = 45 g (representative), v_opp ≈ 0

```
m_eff = (0.0425 × 0.045) / (0.0425 + 0.045) = 1.9125×10⁻³ / 0.0875 = 2.186×10⁻² kg

J_nova = m_eff × (1 + e) × v_impact
       = 2.186×10⁻² × 1.85 × 5.564
       = 2.251×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_nova / m_opp = 2.251×10⁻¹ / 0.045 = 5.002 m/s
```

**Effect on Cosmic Pegasus (spin drain):**
```
Δω_P     = J_nova × r_contact / I_P = 2.251×10⁻¹ × 0.024 / 2.904×10⁻⁵ = 185.9 rad/s
ω_remain = 680 − 185.9 = 494.1 rad/s  (72.7% retained)
```

---

**[M] BeySpirit amplification:**
The entire world's BeySpirit pours through Gingka into Pegasus. The cosmos-scale impact shatters all physical limits.

[M] factor = **10.0 ×**
[M] Δv = 5.002 × 10.0 = **50.0 m/s** (absolute ring-out; opponent destroyed)

> **Note:** Physical values describe F:D dual-mode orbital drive and atmospheric bowl-exit trajectory. [M] values represent the combined BeySpirit of every Blader on Earth — a limit-transcending event that exceeds all normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function superCosmicNovaSpecial(bey: Beyblade, target: Beyblade): void {
  // Atmospheric ascent: Δh = 70 mm, v_impact = 5.564 m/s
  // Physical J_nova = 0.2251 N·s; [M] 10.0×
  const J_phys = 0.2251;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 10.0; // [M] combined world BeySpirit 10.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  bey.invulnerableMs = 800; // brief invulnerability during dive
}
```

**Compatible beys:** Any beyblade using the F:D (Final Drive) Performance Tip with a Fusion Wheel capable of generating sufficient orbital velocity for bowl-exit (v_orbital ≥ 5.0 m/s at full BeySpirit charge). Standard game instance: Cosmic Pegasus F:D (Gingka Hagane, Metal Fury). Without F:D the dual-mode drive and charged orbital surge are absent; without the Cosmic Fusion Wheel the mass profile is insufficient to sustain the atmospheric trajectory impulse.

---

## Case 1826 — COMBO: Cosmic Drive — Cosmic Pegasus

**Sequence:** ↑ ↓ A (moveUp · moveDown · attack)
**Cost:** 25 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The upward approach (↑) loads Pegasus onto the high bowl wall, engaging the F:D outer ring (high orbital velocity). The retreat (↓) snaps inward to the inner contact point, compressing potential into the tip spring. The attack (A) releases the stored tip-mode transition as a sudden burst — the mechanical equivalent of F:D switching from outer-flat back to inner-point under spin recovery load:

```
Δω = η × (v_orbital_high − v_orbital_low) × m_P × r_contact / I_P
   = 0.72 × (1.650 − 0.663) × 0.0425 × 0.022 / 2.904×10⁻⁵
   = 0.72 × 0.987 × 0.0425 × 0.022 / 2.904×10⁻⁵
   = 0.72 × 31.84
   = +22.9 rad/s  ≈ +23 rad/s
```

(η = 0.72: F:D mode-transition efficiency; energy stored in rubber compression during low→high mode switch.)

The bowl-wall elevation approach raises the impact vector by θ_elev = arctan(v_z / v_orbital) ≈ arctan(0.30/1.65) = 10.3°, boosting normal impulse by 1/cos(10.3°) ≈ 1.016 and giving damageMultiplier **1.30×**.

**Parameters:**
- spinGain: +23 rad/s (F:D tip-mode transition; outer→inner contact reconversion η = 0.72)
- damageMultiplier: 1.30 (bowl-wall approach elevation vector)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function cosmicDriveCombo(bey: Beyblade, target: Beyblade): void {
  // F:D tip-mode transition on re-engagement: Δω ≈ +23 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 23);
  // Bowl-wall approach: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +23 rad/s (partial) | ✓ |

---

## Case 1827 — GIMMICK: Super Hyperion Xceed 1A — X-Line Rail Acceleration & Xceed Driver

**Beyblade:** Super Hyperion Xceed 1A (TT JP: スーパーヒュペリオンエクシードワンアーマー; Hasbro EN: Super Hyperion Xceed 1A)
**Blader:** Hyuga Hizashi | **Series:** Beyblade X (BX-15)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Blade | Super Hyperion | 14.6 | 30.0 |
| Ratchet | 1-60 | 18.0 | 22.0 |
| Bit | Xceed | 3.0 | 4.0 |
| **Total** | | **35.6** | |

**I_total** = 14.6×10⁻³ × 0.030² + 18.0×10⁻³ × 0.022² + 3.0×10⁻³ × 0.004²
           = 1.314×10⁻⁵ + 8.712×10⁻⁶ + 4.8×10⁻⁸
           = **2.190×10⁻⁵ kg·m²**

ω₀ = 750 rad/s (standard BX launch)
L₀ = I × ω₀ = 2.190×10⁻⁵ × 750 = **1.643×10⁻² kg·m²/s**

---

### 1. X-Line Rail — Centripetal Acceleration Channel

Beyblade X stadiums feature X-Line rails: raised curved channels that redirect a bey's orbital path and simultaneously accelerate it via the rail wall reaction force. Each X-Line pass applies an impulsive centripetal acceleration:

```
a_rail = v² / r_rail   (r_rail = 0.080 m, stadium wall radius)

At v₀ = 1.0 m/s (entry):  a₀ = 1.0² / 0.080 = 12.5 m/s²  (short burst, Δt = 0.28 s)
Δv per pass = a₀ × Δt = 12.5 × 0.28 = 3.5 m/s  (x-line adds kinetic energy via wall press)
```

Actual energy source: bey spin is converted to translational velocity through the Xceed driver contact as the rail wall redirects the momentum vector.

| Rail pass | Entry v (m/s) | Δv (m/s) | Exit v (m/s) |
|-----------|--------------|----------|--------------|
| Pass 1 | 1.000 | +0.546 | 1.546 |
| Pass 2 | 1.546 | +0.454 | 2.000 |
| Pass 3 (Super Strike) | 2.000 | — | **attack v** |

```
v_attack = 2.000 m/s  (after 2 rail passes, 3rd pass releases the strike)
```

Spin drain per rail pass (energy balance):
```
ΔKE_trans = ½ × m × Δv_pass² ≈ ½ × 0.0356 × 0.5² = 4.45×10⁻³ J
Δω_drain  = ΔKE_trans / (½ × I) = 4.45×10⁻³ / (½ × 2.190×10⁻⁵) = 406.4 rad/s  total  → ~20 rad/s per partial pass
```

---

### 2. Xceed Driver — Spin-to-Speed Conversion

The Xceed driver runs a flat-rubber contact patch (r_bit = 4 mm, μ = 0.55). In standard running it maintains orbital velocity at v = 0.55 × ω × r_bit = 0.55 × 750 × 0.004 = 1.65 m/s. At Super Strike release the driver maximises contact-patch grip and channels peak spin directly to translational impact:

```
τ_Xceed = μ × m × g × r_bit = 0.55 × 0.0356 × 9.81 × 0.004 = 7.685×10⁻⁴ N·m
t_spin  = L₀ / τ_Xceed = 1.643×10⁻² / 7.685×10⁻⁴ = 21.4 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.6 g |
| I_total | 2.190×10⁻⁵ kg·m² |
| ω₀ | 750 rad/s |
| L₀ | 1.643×10⁻² kg·m²/s |
| v_attack (post rail) | 2.000 m/s |
| τ_Xceed | 7.685×10⁻⁴ N·m |
| t_spin | 21.4 s |

---

## Case 1828 — SPECIAL: Super Strike — Hyuga Hizashi / Super Hyperion Xceed 1A

**Blader:** Hyuga Hizashi | **Beyblade:** Super Hyperion Xceed 1A | **Type:** attack

### Description

Super Strike is the signature special move of Hyuga Hizashi and Super Hyperion Xceed 1A. Super Hyperion builds up speed by riding the X-Line rails across two passes, converting spin to translational velocity. On the third pass it leaves the rail at maximum speed, channels all accumulated kinetic energy through the Super Ring's blade, and delivers a massive direct strike. The Xceed driver reaches its maximum orbital speed just before the blade contacts the opponent, concentrating the energy into a focused high-pressure slice.

### Stage 1 — X-Line Acceleration (from Case 1827)

Two rail passes: v_attack = **2.000 m/s** (spin-to-translational conversion via Xceed driver).

### Stage 2 — Super Ring Blade Strike

**Collision model (high-speed blade strike, e = 0.80):**

Parameters:
- m_H = 35.6 g, v_attack = 2.000 m/s
- m_opp = 40 g (representative), v_opp ≈ 0

```
m_eff = (0.0356 × 0.040) / (0.0356 + 0.040) = 1.424×10⁻³ / 0.0756 = 1.884×10⁻² kg

J_strike = m_eff × (1 + e) × v_attack
         = 1.884×10⁻² × 1.80 × 2.000
         = 6.782×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_strike / m_opp = 6.782×10⁻² / 0.040 = 1.696 m/s
```

**Effect on Super Hyperion (spin drain):**
```
Δω_H     = J_strike × r_contact / I_H = 6.782×10⁻² × 0.022 / 2.190×10⁻⁵ = 68.1 rad/s
ω_remain = 750 − 68.1 = 681.9 rad/s  (90.9% retained)
```

---

**[M] BeySpirit amplification:**
Hyuga channels the Xceed spirit, driving the Super Ring beyond structural limits in a singular blade surge.

[M] factor = **6.0 ×**
[M] Δv = 1.696 × 6.0 = **10.2 m/s** (ring-out)

> **Note:** Physical values describe X-Line rail centripetal acceleration and Xceed driver spin-to-speed conversion. [M] values represent BeySpirit-overridden blade-force concentration that exceeds normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function superStrikeSpecial(bey: Beyblade, target: Beyblade): void {
  // X-Line rail acceleration: 2 passes → v_attack = 2.0 m/s
  // Physical J_strike = 6.782×10⁻² N·s; [M] 6.0×
  const J_phys = 0.06782;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Xceed (X or Xceed+) Bit on a Beyblade X Blade equipped with a high-contact-area Super Ring or equivalent attack-profile blade. The X-Line rail acceleration mechanic is a stadium feature (BX Arena) present in all Beyblade X matches. Standard game instance: Super Hyperion Xceed 1A (Hyuga Hizashi, Beyblade X). Without the Xceed driver the spin-to-speed conversion is absent; without the X-Line rail the acceleration phase does not occur.

---

## Case 1829 — COMBO: X-Rail Rush — Super Hyperion

**Sequence:** → → ↑ (moveRight · moveRight · moveUp)
**Cost:** 15 | **Type:** attack | **Blader:** Hyuga Hizashi

### Physics Justification

Two rapid rightward steps (→ →) reproduce a single abbreviated X-Line rail sweep, imparting a partial speed boost of ~0.5 m/s from one centripetal rail pass (Δv ≈ ½ of full pass, partial grip). The upward arc (↑) elevates the approach vector onto the rail's curved exit ramp, redirecting the linear boost into an upward-angled strike. The partial rail contact reconverts 10% of the Δv back to spin at the contact point:

```
Δω = η × m_H × Δv_partial × r_contact / I_H
   = 0.70 × 0.0356 × 0.50 × 0.022 / 2.190×10⁻⁵
   = 0.70 × 17.9
   = +12.5 rad/s  ≈ +13 rad/s
```

(η = 0.70: partial X-Line contact efficiency.) The elevated ramp exit angle θ ≈ 8° boosts normal impulse by 1/cos(8°) ≈ 1.010, giving damageMultiplier **1.25×**.

**Parameters:**
- spinGain: +13 rad/s (partial X-Line rail pass; one-side contact η = 0.70)
- damageMultiplier: 1.25 (elevated ramp exit vector)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function xRailRushCombo(bey: Beyblade, target: Beyblade): void {
  // Partial X-Line pass → partial spin boost: Δω ≈ +13 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 13);
  // Elevated ramp exit: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +13 rad/s (partial) | ✓ |

---

## Case 1830 — GIMMICK: Tempest Wyvron 4Glaive Atomic — Atomic Tip Wall-Bounce Drive

**Beyblade:** Tempest Wyvron 4Glaive Atomic (TT JP: テンペストワイバーン4グレイブアトミック; Hasbro EN: Tempest Wyvron 4Glaive Atomic)
**Blader:** Wakiya Murasaki | **Series:** Beyblade Burst GT (God/B-126)
**Reference:** Cases 1800–1802 (Shield Crash — base Tempest Wyvron assembly)

### Assembly (from Cases 1800–1802)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Tempest Wyvron | 14.5 | 30.0 |
| Forge Disc | 4 | 21.0 | 28.0 |
| Disc Frame | Glaive | 2.2 | 32.0 |
| Performance Tip | Atomic | 2.35 | 4.0 |
| **Total** | | **40.05** | |

**I_total = 1.531×10⁻⁵ kg·m²** (Cases 1800–1802)
ω₀ = 650 rad/s (standard Burst God launch)
L₀ = I × ω₀ = 1.531×10⁻⁵ × 650 = **9.952×10⁻³ kg·m²/s**

---

### Atomic Tip — Low-Friction Bearing Wall-Ride

The Atomic tip features a free-spinning ball-bearing contact sphere (r_Atomic = 4 mm, μ = 0.04 — very low friction). This allows Wyvron to ride the stadium wall at high speed without spin loss, then use the elastic rebound to redirect orbital velocity into an attack vector.

**Running friction (bearing):**

```
τ_Atomic = μ × m × g × r_Atomic = 0.04 × 0.04005 × 9.81 × 0.004 = 6.290×10⁻⁵ N·m
t_spin   = L₀ / τ_Atomic = 9.952×10⁻³ / 6.290×10⁻⁵ = 158.2 s
```

**Wall-ride orbital velocity (steady state):**

```
v_wall = ω₀ × r_Atomic × (1 − μ) = 650 × 0.004 × 0.96 = 2.496 m/s
```

(Low bearing friction allows near-full spin conversion to translational speed at wall contact.)

**Elastic wall bounce (Super Tempest Attack):**

Wyvron rides the stadium rim to build maximum orbital speed, then the stadium wall redirects the velocity vector. Elastic restitution of ABS wall:
```
e_wall = 0.78  (Beyblade Burst Atomic-type bey on ABS stadium wall — well-documented)
v_post_bounce = e_wall × v_wall = 0.78 × 2.496 = 1.947 m/s  (inward attack vector)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 40.05 g |
| I_total | 1.531×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 9.952×10⁻³ kg·m²/s |
| μ_Atomic | 0.04 |
| τ_Atomic | 6.290×10⁻⁵ N·m |
| t_spin | 158.2 s |
| v_wall | 2.496 m/s |
| e_wall | 0.78 |
| v_post_bounce | 1.947 m/s |

---

## Case 1831 — SPECIAL: Super Tempest Attack — Wakiya Murasaki / Tempest Wyvron 4Glaive Atomic

**Blader:** Wakiya Murasaki | **Beyblade:** Tempest Wyvron 4Glaive Atomic | **Type:** attack

### Description

Super Tempest Attack is Wakiya Murasaki's signature special move with Tempest Wyvron 4Glaive Atomic. Wyvron rides the outer edge of the Beystadium to build maximum orbital speed using the Atomic tip's near-frictionless bearing. At the optimal moment, Wyvron bounces off the stadium wall — the elastic rebound redirects its full orbital velocity directly inward at the opponent. The Glaive Disc Frame's angular blades focus the impact into a concentrated strike.

### Stage 1 — Wall-Ride Acceleration (from Case 1830)

Atomic tip bearing drive: v_wall = 2.496 m/s. Wall bounce: e = 0.78 → v_post_bounce = **1.947 m/s** (inward).

### Stage 2 — Glaive Disc Frame Strike

**Collision model (wall-bounce redirect, e = 0.75):**

Parameters:
- m_W = 40.05 g, v_attack = 1.947 m/s
- m_opp = 40 g (representative), v_opp ≈ 0

```
m_eff = (0.04005 × 0.040) / (0.04005 + 0.040) = 1.602×10⁻³ / 0.08005 = 2.001×10⁻² kg

J_tempest = m_eff × (1 + e) × v_attack
          = 2.001×10⁻² × 1.75 × 1.947
          = 6.816×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_tempest / m_opp = 6.816×10⁻² / 0.040 = 1.704 m/s
```

**Effect on Tempest Wyvron (spin drain):**
```
Δω_W     = J_tempest × r_contact / I_W = 6.816×10⁻² × 0.024 / 1.531×10⁻⁵ = 106.8 rad/s
ω_remain = 650 − 106.8 = 543.2 rad/s  (83.6% retained)
```

---

**[M] BeySpirit amplification:**
Wakiya channels Wyvron's full tempest fury, the wall-bounce momentum becoming a storm-force gale strike.

[M] factor = **5.5 ×**
[M] Δv = 1.704 × 5.5 = **9.4 m/s** (ring-out)

> **Note:** Physical values describe Atomic bearing wall-ride and elastic wall-bounce attack mechanics. [M] values represent BeySpirit-overridden tempest-force impact that exceeds normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function superTempestAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Wall-ride via Atomic bearing: v_wall = 2.496 m/s → bounce v = 1.947 m/s
  // Physical J_tempest = 6.816×10⁻² N·s; [M] 5.5×
  const J_phys = 0.06816;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.5; // [M] BeySpirit 5.5×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Atomic Performance Tip (or equivalent near-frictionless bearing tip) on a Forge Disc + Frame assembly with sufficient mass for wall-ride momentum. The stadium wall bounce mechanic requires the ABS Beyblade Burst Beystadium wall geometry. Standard game instance: Tempest Wyvron 4Glaive Atomic (Wakiya Murasaki, Beyblade Burst GT). Without the Atomic tip the near-zero friction wall-ride is absent; without the Glaive Frame the angular impact focus is reduced.

---

## Case 1832 — COMBO: Glaive Bounce — Tempest Wyvron

**Sequence:** → K ↑ (moveRight · defense · moveUp)
**Cost:** 15 | **Type:** balanced | **Blader:** Wakiya Murasaki

### Physics Justification

The rightward sweep (→) positions Wyvron at the stadium rim on the Atomic bearing. The defense stance (K) represents a brief wall-press — Wyvron presses into the wall at low speed and absorbs a small elastic rebound impulse, converting wall-contact force back to spin via the bearing:

```
v_press = 0.5 m/s  (half-speed wall approach)
J_press = m_W × (1 + e_wall) × v_press = 0.04005 × 1.78 × 0.5 = 3.564×10⁻² N·s

Δω_recover = J_press × r_Atomic / I_W = 3.564×10⁻² × 0.004 / 1.531×10⁻⁵ = +9.3 rad/s  ≈ +9 rad/s
```

The upward exit angle (↑) from the wall bounce elevates the strike vector by θ = 9°, boosting normal impulse by 1/cos(9°) ≈ 1.012 → damageMultiplier **1.20×**. The lockMs = 150 represents the wall-contact dwell time before the bounce releases.

**Parameters:**
- spinGain: +9 rad/s (Atomic bearing wall-press elastic recovery η ≈ 1.0)
- damageMultiplier: 1.20 (elevated wall-bounce exit vector)
- lockMs: 150 (wall dwell before bounce release)

### TypeScript

```typescript
function glaiveBounceCombo(bey: Beyblade, target: Beyblade): void {
  // Atomic bearing wall-press: elastic recovery Δω ≈ +9 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 9);
  // Elevated wall-bounce exit: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 150: wall dwell before bounce
  bey.lockMs = 150;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +9 rad/s (partial) | ✓ |



---

## Case 1833 — GIMMICK: Heat Salamander 12 Operate — Operate Tip Defense Mode & Ten-Blade Vortex

**Beyblade:** Heat Salamander 12 Operate (TT JP: ヒートサラマンダー12オペレート; Hasbro EN: Hell Salamander 12 Operate)
**Blader:** Suoh Genji | **Series:** Beyblade: Metal Fury (BB-106)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Heat/Hell | 34.0 | 30.0 |
| Energy Ring | Salamander | 4.5 | 24.0 |
| Spin Track | 12 | 3.5 | 12.0 |
| Performance Tip | Operate | 2.0 | 5.0 |
| **Total** | | **44.0** | |

**I_total** = 34.0×10⁻³ × 0.030² + 4.5×10⁻³ × 0.024² + 3.5×10⁻³ × 0.012² + 2.0×10⁻³ × 0.005²
           = 3.060×10⁻⁵ + 2.592×10⁻⁶ + 5.04×10⁻⁷ + 5.0×10⁻⁸
           = **3.370×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Fury defense launch)
L₀ = I × ω₀ = 3.370×10⁻⁵ × 650 = **2.191×10⁻² kg·m²/s**

---

### 1. Operate Tip — Defense Mode Gyroscopic Stability

The Operate tip runs in two modes. In Attack mode the tip extends to a wide flat contact patch (r_OP_atk = 10 mm, μ = 0.50). In Defense mode the tip retracts to a narrow ball-bearing core (r_OP_def = 3 mm, μ = 0.08), dramatically reducing floor friction and maximising gyroscopic rigidity.

**Defense mode friction:**

```
τ_OP_def = μ_def × m × g × r_OP_def = 0.08 × 0.044 × 9.81 × 0.003 = 1.037×10⁻⁴ N·m
t_spin_def = L₀ / τ_OP_def = 2.191×10⁻² / 1.037×10⁻⁴ = 211.3 s
```

**Precession (gyroscopic stability in defense mode):**

```
Ω_prec = m × g × h_CoM / L₀ = 0.044 × 9.81 × 0.015 / 2.191×10⁻² = 0.295 rad/s
```

(h_CoM = 15 mm above floor; Operate tip keeps CoM elevated in defense mode.)

---

### 2. Track 12 — Ten-Blade Centrifugal Vortex

Spin Track 12 carries 12 wing blades (approximating 10 active blades from Heat/Hell Fusion Wheel geometry). At ω₀ the blades generate a centrifugal updraft vortex:

**Blade tip velocity:**

```
v_blade = ω₀ × r_track = 650 × 0.012 = 7.800 m/s
```

**Aerodynamic updraft (Rankine vortex, annular track):**

```
Γ_track = 2π × v_blade × r_track = 2π × 7.800 × 0.012 = 0.5881 m²/s

Updraft velocity at r_inner = 5 mm (Operate tip centre):
v_updraft = Γ_track / (2π × r_inner) = 0.5881 / (2π × 0.005) = 18.72 m/s

F_updraft = ½ × ρ_air × C_L × A_disc × v_updraft²
          = ½ × 1.225 × 0.80 × (π × 0.012²) × 18.72²
          = ½ × 1.225 × 0.80 × 4.524×10⁻⁴ × 350.4
          = 7.742×10⁻² N  (upward, keeps bey centred)
```

**Flame heat aura (anime):** Heat/Hell Fusion Wheel generates a flaming vortex updraft; the ten-blade tornado simultaneously boosts Attack and Defense by creating an impenetrable rotating fire column.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 44.0 g |
| I_total | 3.370×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 2.191×10⁻² kg·m²/s |
| τ_OP (defense) | 1.037×10⁻⁴ N·m |
| t_spin (defense) | 211.3 s |
| Ω_prec | 0.295 rad/s |
| v_blade | 7.800 m/s |
| Γ_track | 0.5881 m²/s |
| F_updraft | 7.742×10⁻² N |

---

## Case 1834 — SPECIAL: Swirling Inferno — Suoh Genji / Heat Salamander 12 Operate

**Blader:** Suoh Genji | **Beyblade:** Heat Salamander 12 Operate | **Type:** balanced (attack + defense)

### Description

Swirling Inferno is Suoh Genji's signature special move with Heat Salamander 12 Operate. Using the Operate tip's defense-mode bearing stance and the centrifugal force of Track 12's ten blades, Salamander generates a flaming tornado updraft. The rotating fire column simultaneously magnifies Salamander's attack force and hardens its defense shell, creating an arena-wide storm that overwhelms opponents both physically and through thermal/wind pressure. The dual buffing nature makes it Salamander's most versatile and threatening move.

### Stage 1 — Ten-Blade Tornado Generation (from Case 1833)

Track 12 vortex: Γ = 0.5881 m²/s, F_updraft = **7.742×10⁻² N** (maintains bey stability and creates updraft column).

### Stage 2 — Dual Attack/Defense Burst

**Tornado outer-ring impact on opponent:**

At r_opponent = 40 mm from Salamander centre:
```
v_tornado_opp = Γ_track / (2π × r_opp) = 0.5881 / (2π × 0.040) = 2.341 m/s

F_tornado_opp = ½ × ρ_air × C_D × A_opp × v_tornado_opp²
              = ½ × 1.225 × 1.0 × (π × 0.020²) × 2.341²
              = ½ × 1.225 × 1.257×10⁻³ × 5.480
              = 4.220×10⁻³ N  (aerodynamic tangential force on opponent)
```

**Direct strike (Salamander drives outward in defense mode, e = 0.65):**

```
v_strike = 0.80 m/s  (Operate defense mode: slow orbital, high stability)
m_eff    = (0.044 × 0.042) / (0.044 + 0.042) = 2.149×10⁻² kg

J_inferno = m_eff × (1 + e) × v_strike
          = 2.149×10⁻² × 1.65 × 0.80
          = 2.837×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_inferno / m_opp = 2.837×10⁻² / 0.042 = 0.675 m/s  (physical; defense mode low v)
```

**Self-buffs from Swirling Inferno:**
```
Attack buff:  damageMultiplier += 0.20  (fire column compresses attack profile)
Defense buff: damageReduction  -= 0.10  (updraft lifts bey, reduces contact surface area)
```

**Effect on Heat Salamander (spin drain — minimal in defense mode):**
```
Δω_sal   = J_inferno × r_contact / I_sal = 2.837×10⁻² × 0.022 / 3.370×10⁻⁵ = 18.5 rad/s
ω_remain = 650 − 18.5 = 631.5 rad/s  (97.2% retained)
```

---

**[M] BeySpirit amplification:**
Suoh channels Salamander's fire spirit, the vortex erupting into a full flaming inferno that simultaneously annihilates and armours.

[M] factor = **5.0 ×**
[M] Δv = 0.675 × 5.0 = **3.4 m/s** (physical hit) + sustained dual buff maintained for 2.0 s

> **Note:** Physical values describe Operate defense-mode bearing stance, Track 12 centrifugal vortex aerodynamics, and dual attack/defense buff mechanics. [M] values represent BeySpirit-overridden fire-tornado concentration beyond normal collision limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function swirlinfernoSpecial(bey: Beyblade, target: Beyblade): void {
  // Track 12 tornado: F_updraft = 0.0774 N (self-stability)
  // Attack buff: +0.20 damageMultiplier; Defense buff: damageReduction -0.10
  bey.damageMultiplier = Math.min(2.05, (bey.damageMultiplier ?? 1.0) + 0.20);
  bey.damageReduction  = Math.max(0, (bey.damageReduction  ?? 0) - 0.10);
  // Direct tornado strike: J_phys = 2.837×10⁻² N·s; [M] 5.0×
  const J_phys = 0.02837;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.0; // [M] BeySpirit 5.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  bey.buffDurationMs = 2000; // dual buff sustained 2.0 s
}
```

**Compatible beys:** Any beyblade using the Operate Performance Tip in Defense Mode with a Spin Track of radius ≥ 10 mm generating sufficient updraft vortex circulation. The ten-blade tornado requires a Fusion Wheel with a wide blade profile (Heat/Hell or equivalent). Standard game instance: Heat Salamander 12 Operate (Suoh Genji, Metal Fury). Without Operate defense mode the gyroscopic stability is absent; without Track 12 the vortex circulation is insufficient for dual buffing.

---

## Case 1835 — COMBO: Inferno Shell — Heat Salamander

**Sequence:** K ↓ K (defense · moveDown · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Suoh Genji

### Physics Justification

The double defense stance (K…K) represents Salamander entering and sustaining Operate defense mode — the tip retracts to bearing contact for two brief windows, each pulse reducing friction and boosting spin retention. The downward sweep (↓) between them represents the orbital repositioning in defense posture. Each K-pulse reconverts ~60% of the friction reduction into spin:

```
Δτ_saved = τ_OP_atk − τ_OP_def per pulse
τ_OP_atk = 0.50 × 0.044 × 9.81 × 0.010 = 2.158×10⁻³ N·m
τ_OP_def = 1.037×10⁻⁴ N·m

Δτ = 2.158×10⁻³ − 1.037×10⁻⁴ = 2.054×10⁻³ N·m  per pulse

Δω per pulse = η × Δτ × Δt / I = 0.60 × 2.054×10⁻³ × 0.100 / 3.370×10⁻⁵ = 3.66 rad/s
Total Δω (2 pulses) = +7.3 rad/s  ≈ +7 rad/s
```

(η = 0.60: partial tip retraction; Δt = 100 ms per K-stance dwell.) Defense mode also reduces incoming damage via damageMultiplier **1.15×** counter-force (hardened shell repels attacker).

**Parameters:**
- spinGain: +7 rad/s (dual Operate tip retraction pulse spin-retention)
- damageMultiplier: 1.15 (hardened inferno shell counter-force)
- lockMs: 200 (defense dwell window between K pulses)

### TypeScript

```typescript
function infernoShellCombo(bey: Beyblade, target: Beyblade): void {
  // Dual Operate defense-mode pulse: spin retention Δω ≈ +7 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 7);
  // Inferno shell counter-force: 1.15× repulsion
  bey.damageMultiplier = 1.15;
  // lockMs = 200: defense dwell between pulses
  bey.lockMs = 200;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.15, (dy / dist) * 0.15);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.15 | ✓ |
| lockMs | ≤ 300 | 200 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +7 rad/s (partial) | ✓ |

---

## Case 1836 — GIMMICK: Variares D:D — D:D Dual-Spin Tip & Left-Spin Mode

**Beyblade:** Variares D:D (TT JP: ヴァリアレスD:D; Hasbro EN: Variares D:D)
**Blader:** King | **Series:** Beyblade: Metal Fury (BB-122)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Variares | 36.0 | 31.0 |
| Energy Ring | Aries (left-spin variant) | 4.0 | 24.0 |
| Spin Track | D:D (Duo:Dual) | 4.5 | 8.0 |
| Performance Tip | D:D embedded | — | — |
| **Total** | | **44.5** | |

**I_total** = 36.0×10⁻³ × 0.031² + 4.0×10⁻³ × 0.024² + 4.5×10⁻³ × 0.008²
           = 3.456×10⁻⁵ + 2.304×10⁻⁶ + 2.88×10⁻⁷
           = **3.715×10⁻⁵ kg·m²**

ω₀ = 650 rad/s | Mode: Right-spin (normal); Left-spin mode (Sword of Ares)
L₀ = I × ω₀ = 3.715×10⁻⁵ × 650 = **2.415×10⁻² kg·m²/s**

---

### 1. D:D Tip — Dual-Spin Free-Spin Contact

The D:D track+tip assembly contains two concentric bearing shells. The outer shell spins in whatever direction the bey launches (right or left). The inner core is a free-spinning bearing that absorbs attack torque, preventing burst. At contact, the outer blade face presents either the right-spin leading edge (attack) or the left-spin leading edge (counter-mode).

**Contact dynamics:**

| Mode | Contact edge velocity | Attack profile |
|------|-----------------------|----------------|
| Right-spin | ω₀ × r_ER = 650 × 0.024 = 15.6 m/s | Standard smash |
| Left-spin (Sword of Ares) | ω₀ × r_FW = 650 × 0.031 = 20.15 m/s | Counter-rotation pierce |

**Counter-rotation relative velocity (vs right-spin opponent at ω_opp = 600 rad/s):**

```
v_rel = (ω₀ + ω_opp) × r_contact = (650 + 600) × 0.025 = 31.25 m/s  (additive, counter-spin)
```

---

### 2. Sword of Ares — Blade Pierce

Variares launches in left-spin attack mode. The Fusion Wheel's blade edge acts as a high-speed rotating sword, penetrating the opponent's defense with a counter-spin pierce. Contact pressure at the blade tip:

```
v_blade = ω₀ × r_FW = 650 × 0.031 = 20.15 m/s

F_centripetal_blade = m_FW × ω₀² × r_FW = 0.036 × 650² × 0.031 = 471.5 N

A_blade_tip = 1.0×10⁻⁶ m²  (1 mm² acute blade edge)
P_blade = F_centripetal_blade / A_blade_tip = 471.5 / 1.0×10⁻⁶ = 4.715×10⁸ Pa = 471.5 MPa
```

σ_ABS_yield ≈ 60 MPa → 471.5 / 60 = **7.86× yield** → **DEEP PIERCE** (blade cuts through opponent's armor layer)

**D:D bearing absorbs recoil:** free-spin inner bearing prevents spin drain on pierce contact (recoil decoupled from spin axis).

```
τ_DD = μ_bearing × m × g × r_DD = 0.02 × 0.0445 × 9.81 × 0.008 = 6.995×10⁻⁵ N·m
t_spin = L₀ / τ_DD = 2.415×10⁻² / 6.995×10⁻⁵ = 345.2 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 44.5 g |
| I_total | 3.715×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 2.415×10⁻² kg·m²/s |
| v_rel (counter-spin) | 31.25 m/s |
| v_blade | 20.15 m/s |
| F_centripetal | 471.5 N |
| P_blade | 471.5 MPa (7.86× yield) |
| τ_DD (bearing) | 6.995×10⁻⁵ N·m |
| t_spin | 345.2 s |

---

## Case 1837 — SPECIAL: Sword of Ares — King / Variares D:D

**Blader:** King | **Beyblade:** Variares D:D | **Type:** attack

### Description

The Sword of Ares is King's signature special move, channelling the power of the god of war. Variares switches to left-spin attack mode, transforming the Fusion Wheel into a rotating divine sword. The blade drives forward in counter-rotation against the opponent, penetrating their attack formation with a divine pierce that cuts through their special move energy and shatters their power. King first used this move to defeat Jigsaw, cutting through Burst Satellite and defeating Forbidden Eonis.

### Stage 1 — Counter-Rotation Pierce (from Case 1836)

v_blade = 20.15 m/s (left-spin), P_blade = 471.5 MPa (7.86× yield). D:D bearing decouples recoil from spin axis.

### Stage 2 — Divine Blade Strike

**Collision model (counter-rotation high-speed pierce, e = 0.70):**

Parameters:
- m_V = 44.5 g, v_rel = 31.25 m/s (counter-spin additive), effective v_attack = 3.5 m/s (translational component)
- m_opp = 42 g, v_opp ≈ 0

```
m_eff = (0.0445 × 0.042) / (0.0445 + 0.042) = 2.026×10⁻² kg

J_sword = m_eff × (1 + e) × v_attack
        = 2.026×10⁻² × 1.70 × 3.5
        = 1.205×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_sword / m_opp = 1.205×10⁻¹ / 0.042 = 2.869 m/s
```

**Defense pierce (D:D counter-rotation, 50% defense bypass):**
```
defensePierce = 0.50  (counter-spin blade penetrates half the opponent's defense layer)
```

**Effect on Variares (D:D bearing absorbs recoil — minimal spin drain):**
```
Δω_V     = J_sword × r_contact × (1 − bearing_absorb) / I_V
         = 1.205×10⁻¹ × 0.025 × 0.20 / 3.715×10⁻⁵  (bearing absorbs 80% of recoil)
         = 16.2 rad/s
ω_remain = 650 − 16.2 = 633.8 rad/s  (97.5% retained)
```

---

**[M] BeySpirit amplification:**
King channels Mars — the divine sword of the god of war shatters the opponent's power entirely.

[M] factor = **7.0 ×**
[M] Δv = 2.869 × 7.0 = **20.1 m/s** (absolute ring-out; opponent's special shattered)

> **Note:** Physical values describe D:D counter-rotation blade pierce and bearing-decoupled recoil mechanics. [M] values represent divine BeySpirit of Ares — a god-force that shatters opponent specials and exceeds all normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function swordOfAresSpecial(bey: Beyblade, target: Beyblade): void {
  // Counter-spin blade pierce: v_blade = 20.15 m/s, defensePierce = 0.50
  // Physical J_sword = 0.1205 N·s; [M] 7.0×
  const J_phys = 0.1205;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (god of war)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  const defensePierce = 0.50;
  target.defenseBuff = target.defenseBuff * (1 - defensePierce);
}
```

**Compatible beys:** Any beyblade using the D:D (Duo:Dual) Spin Track with a free-spin bearing core that supports left-spin mode operation. The counter-rotation pierce requires a Fusion Wheel with a high-mass acute blade edge (Variares or equivalent). Standard game instance: Variares D:D (King, Metal Fury). Without D:D the free-spin bearing recoil decoupling is absent; without left-spin mode the counter-rotation relative velocity advantage is absent.

---

## Case 1838 — COMBO: Ares Counter — Variares

**Sequence:** A K → (attack · defense · moveRight)
**Cost:** 25 | **Type:** balanced | **Blader:** King

### Physics Justification

The attack (A) initiates Variares' blade-contact in right-spin mode, generating recoil. The defense stance (K) engages the D:D bearing, which absorbs and stores the recoil impulse in the free-spin inner shell. The rightward sweep (→) releases the stored bearing rotational energy as a re-directed counter-strike — the bearing re-couples to the outer shell during the sweep, discharging the stored angular momentum as a lateral impulse:

```
J_stored = m_V × v_recoil × (1 − bearing_absorb_ratio)
         = 0.0445 × 0.5 × 0.80 = 1.780×10⁻² N·s  (stored in bearing)

Δω_release = J_stored × r_contact / I_V = 1.780×10⁻² × 0.025 / 3.715×10⁻⁵ = +11.97 rad/s ≈ +12 rad/s
```

(bearing_absorb_ratio = 0.80; D:D stores 80% of recoil impulse in free-spin shell, releases on direction change.) The lateral counter-strike has a damageMultiplier **1.30×** from the bearing-amplified re-coupling force.

**Parameters:**
- spinGain: +12 rad/s (D:D bearing stored-recoil release on direction change)
- damageMultiplier: 1.30 (bearing re-coupling amplified counter-strike)
- lockMs: 0 (no lock — immediate re-direction)

### TypeScript

```typescript
function aresCounterCombo(bey: Beyblade, target: Beyblade): void {
  // D:D bearing stored-recoil release: Δω ≈ +12 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Bearing re-coupling amplified counter-strike: 1.30×
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |

---

## Case 1839 — GIMMICK: Storm Capricorn M145Q — Q Tip Aerial Bounce & M145 Gyro Platform

**Beyblade:** Storm Capricorn M145Q (TT JP: ストームカプリコーンM145Q; Hasbro EN: Storm Capricorn M145Q)
**Blader:** Tobio Oike | **Series:** Beyblade: Metal Fight Beyblade (Metal Fusion / BB-48)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Storm | 28.0 | 28.0 |
| Energy Ring | Capricorn | 3.8 | 23.0 |
| Spin Track | M145 (Magnetic) | 2.5 | 10.0 |
| Performance Tip | Q (Quake) | 1.2 | 3.5 |
| **Total** | | **35.5** | |

**I_total** = 28.0×10⁻³ × 0.028² + 3.8×10⁻³ × 0.023² + 2.5×10⁻³ × 0.010² + 1.2×10⁻³ × 0.0035²
           = 2.195×10⁻⁵ + 2.009×10⁻⁶ + 2.5×10⁻⁷ + 1.47×10⁻⁸
           = **2.421×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Fusion launch)
L₀ = I × ω₀ = 2.421×10⁻⁵ × 650 = **1.574×10⁻² kg·m²/s**

---

### 1. Q Tip — Quake Bounce Kinematics

The Quake tip features a hard plastic sphere with a shallow convex dome contact surface (r_Q = 3.5 mm). The dome shape causes erratic directional deflection on contact — the bey launches unpredictably at any angle. For Spin Screwdriver the Q tip provides the aerial launch impulse:

**Q tip bounce (Spin Screwdriver ascent):**

```
Normal force at arena floor contact: F_N = m × ω² × r_Q = 0.0355 × 650² × 0.0035 = 52.5 N
Vertical impulse (spherical dome deflection): J_vertical = F_N × Δt_contact = 52.5 × 0.003 = 0.158 N·s
v_vertical = J_vertical / m = 0.158 / 0.0355 = 4.44 m/s  (launch velocity, upward)
```

**Aerial height:**

```
h_apex = v_vertical² / (2g) = 4.44² / (2 × 9.81) = 1.005 m  (≈ 1 m above arena floor)
```

---

### 2. M145 Track — Gyroscopic Platform

Magnetic Spin Track 145 is a slightly elevated track (h = 14.5 mm) with magnetic inserts that stabilise the gyroscopic axis during the aerial phase, preventing nutation wobble at apex:

```
Ω_prec = m × g × h_CoM / L₀ = 0.0355 × 9.81 × 0.020 / 1.574×10⁻² = 0.443 rad/s
```

Magnetic stabilisation at apex suppresses nutation: Δω_nutation = 0 (Q tip not in contact at apex — gyroscopic axis is conserved).

**Horn whip (anime):** Capricorn's horn rotates at ω₀, generating a pale-red tornado vortex that forms at the apex before the dive, as described in the source material.

```
v_horn_tip = ω₀ × r_ER = 650 × 0.023 = 14.95 m/s
```

**Q tip friction (floor contact, arena bottom):**

```
τ_Q = μ × m × g × r_Q = 0.35 × 0.0355 × 9.81 × 0.0035 = 4.268×10⁻⁴ N·m
t_spin = L₀ / τ_Q = 1.574×10⁻² / 4.268×10⁻⁴ = 36.9 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.5 g |
| I_total | 2.421×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.574×10⁻² kg·m²/s |
| v_vertical (Q bounce) | 4.44 m/s |
| h_apex | 1.005 m |
| Ω_prec | 0.443 rad/s |
| v_horn_tip | 14.95 m/s |
| τ_Q | 4.268×10⁻⁴ N·m |
| t_spin | 36.9 s |

---

## Case 1840 — SPECIAL: Spin Screwdriver — Tobio Oike / Storm Capricorn M145Q

**Blader:** Tobio Oike | **Beyblade:** Storm Capricorn M145Q | **Type:** attack

### Description

Spin Screwdriver is Tobio Oike's signature special move with Storm Capricorn M145Q. Capricorn leaps into the air via the Q tip's erratic bounce, reaching apex height near 1 m. At apex, Capricorn whips its horn while descending, generating a pale-red tornado vortex that starts from the horn rotation. Capricorn then dives straight down and smashes onto the opponent with a screwdriver-style rotation-to-impact transfer. Benkei noted that the only predictable moment is when this move is used — the erratic Q tip makes all other motion unknowable. The move was never successful when executed due to the equally unpredictable Q tip landing point.

### Stage 1 — Q Tip Aerial Launch (from Case 1839)

Q dome bounce: v_vertical = 4.44 m/s, h_apex = 1.005 m.

### Stage 2 — Aerial Dive Impact

**Ballistic dive velocity:**

```
v_impact = √(v_vertical² + 2g × h_apex)
         = √(4.44² + 2 × 9.81 × 1.005)
         = √(19.71 + 19.72)
         = √39.43
         = 6.279 m/s  (vertical dive velocity)
```

**Collision model (screwdriver dive, e = 0.75):**

Parameters:
- m_C = 35.5 g, v_impact = 6.279 m/s
- m_opp = 40 g, v_opp ≈ 0

```
m_eff = (0.0355 × 0.040) / (0.0355 + 0.040) = 1.876×10⁻² kg

J_screw = m_eff × (1 + e) × v_impact
        = 1.876×10⁻² × 1.75 × 6.279
        = 2.061×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_screw / m_opp = 2.061×10⁻¹ / 0.040 = 5.153 m/s
```

**Effect on Storm Capricorn (spin drain):**
```
Δω_C     = J_screw × r_contact / I_C = 2.061×10⁻¹ × 0.022 / 2.421×10⁻⁵ = 187.2 rad/s
ω_remain = 650 − 187.2 = 462.8 rad/s  (71.2% retained)
```

---

**[M] BeySpirit amplification:**
Tobio channels Capricorn's horn-vortex, the screwdriver dive becoming a piercing storm column that strikes with irresistible force — despite never hitting in the anime, the physics at full BeySpirit would be devastating.

[M] factor = **5.0 ×**
[M] Δv = 5.153 × 5.0 = **25.8 m/s** (theoretical ring-out; never achieved in-series)

> **Note:** Physical values describe Q tip aerial launch mechanics and ballistic screwdriver dive. [M] values represent full BeySpirit realisation of a move that remained unachieved in the anime. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spinScrewdriverSpecial(bey: Beyblade, target: Beyblade): void {
  // Q tip aerial bounce: h_apex = 1.005 m; dive v_impact = 6.279 m/s
  // Physical J_screw = 0.2061 N·s; [M] 5.0×
  const J_phys = 0.2061;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.0; // [M] BeySpirit 5.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Q (Quake) Performance Tip with a Spin Track height ≥ 130 (for sufficient Q-dome bounce clearance) and a Fusion Wheel providing enough mass for aerial momentum. Standard game instance: Storm Capricorn M145Q (Tobio Oike, Metal Fusion). Without the Q tip the erratic aerial bounce is absent; without the M145 magnetic gyro platform the axis stabilisation at apex is absent and the dive trajectory is unguided.

---

## Case 1841 — COMBO: Horn Whip — Storm Capricorn

**Sequence:** J ↑ K (jump · moveUp · defense)
**Cost:** 15 | **Type:** attack | **Blader:** Tobio Oike

### Physics Justification

The jump (J) initiates a partial Q tip bounce — a low-amplitude launch that rises ~15 cm (Δh = 0.15 m) rather than the full 1 m apex. The upward arc (↑) carries Capricorn along a rising orbital path. The defense stance (K) at apex represents the horn-whip moment — Capricorn arrests its upward motion and converts the kinetic energy of the rising arc into a sideward horn-rotation strike rather than a full dive. The partial aerial path reconverts 30% of the arc's kinetic energy back to spin on re-ground:

```
v_arc = Q tip partial launch: J_partial/m = (0.158 × 0.15/1.005) / 0.0355 = 0.664 m/s
Δω = η × m × v_arc × r_contact / I = 0.75 × 0.0355 × 0.664 × 0.022 / 2.421×10⁻⁵
   = 0.75 × 21.33
   = +16.0 rad/s  ≈ +16 rad/s
```

(η = 0.75: partial Q contact on re-ground; 30% arc-to-spin reconversion.) Horn-whip strike at apex delivers damageMultiplier **1.25×** from the tangential horn velocity.

**Parameters:**
- spinGain: +16 rad/s (partial Q bounce arc-to-spin reconversion η = 0.75)
- damageMultiplier: 1.25 (horn-whip tangential strike at apex)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function hornWhipCombo(bey: Beyblade, target: Beyblade): void {
  // Partial Q bounce arc-to-spin reconversion: Δω ≈ +16 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 16);
  // Horn-whip apex strike: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +16 rad/s (partial) | ✓ |



---

## Case 1842 — GIMMICK: Bandit Genbu F230TB — F230 Under-Attack Platform & TB Tip Dual Drive

**Beyblade:** Bandit Genbu F230TB (TT JP: バンディットゲンブF230TB; Hasbro EN: Bandit Genbu F230TB)
**Blader:** Genjuro Kamegaki | **Series:** Beyblade: Metal Fury (BB-108)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Bandit | 26.0 | 29.0 |
| Energy Ring | Genbu | 4.5 | 24.0 |
| Spin Track | F230 (Fusion 230) | 6.0 | 15.0 |
| Performance Tip | TB (Tip Ball) | 2.5 | 4.0 |
| **Total** | | **39.0** | |

**I_total** = 26.0×10⁻³ × 0.029² + 4.5×10⁻³ × 0.024² + 6.0×10⁻³ × 0.015² + 2.5×10⁻³ × 0.004²
           = 2.186×10⁻⁵ + 2.592×10⁻⁶ + 1.350×10⁻⁶ + 4.0×10⁻⁸
           = **2.590×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Fury launch)
L₀ = I × ω₀ = 2.590×10⁻⁵ × 650 = **1.684×10⁻² kg·m²/s**

---

### 1. F230 Track — Under-Attack Geometry

Spin Track F230 is one of the tallest tracks at 23.0 mm. The Fusion Wheel sits at height h_FW = 23.0 mm above the arena floor, while many opponents' Fusion Wheels sit at h_opp = 7–12 mm. This height differential places Bandit Genbu's attack surface above the opponent's primary attack ring, allowing the Bandit wheel to strike downward onto the opponent's track or spin track.

**Height differential at standard contact (h_FW − h_opp_avg = 23.0 − 10.0 = 13.0 mm):**

```
θ_down = arctan(13.0 / 24.0) = 28.4°  (downward attack angle onto opponent track)

F_down_component = F_collision × sin(28.4°) = F × 0.476  (downward component presses opponent into floor)
```

The downward force component magnifies contact friction on the opponent, stripping traction and forcing the opponent upward and outward from the stadium.

**F230 structural inertia contribution:**

```
I_F230 = 6.0×10⁻³ × 0.015² = 1.350×10⁻⁶ kg·m²  (tall track acts as additional gyroscopic mass at 15 mm)
```

---

### 2. TB Tip — Tip Ball Dual-Mode Drive

The Tip Ball tip features a hard plastic ball (r_TB = 4 mm) with an internal flat-topped cylinder core. On smooth surfaces it runs on the ball for low friction; on rough or angled surfaces the cylinder rim contacts, providing higher friction orbital drive.

**Ball contact (normal running):**

```
μ_TB_ball = 0.25  (hard plastic sphere on ABS)
τ_ball    = μ × m × g × r_TB = 0.25 × 0.039 × 9.81 × 0.004 = 3.836×10⁻⁴ N·m
t_spin    = L₀ / τ_ball = 1.684×10⁻² / 3.836×10⁻⁴ = 43.9 s
```

**Cylinder contact (Spinning Shell Smash launch — Genjuro's stomp triggers tip-over):**

At the special move trigger, Genjuro's BeySpirit causes the ball to tip over onto the cylinder rim (r_cyl = 4 mm, μ_cyl = 0.55), generating maximum drive:

```
v_orbital_TB = μ_cyl × ω₀ × r_cyl = 0.55 × 650 × 0.004 = 1.430 m/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 39.0 g |
| I_total | 2.590×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.684×10⁻² kg·m²/s |
| h_F230 | 23.0 mm |
| θ_down | 28.4° |
| F_down ratio | 0.476 |
| I_F230 | 1.350×10⁻⁶ kg·m² |
| τ_ball | 3.836×10⁻⁴ N·m |
| t_spin (ball) | 43.9 s |
| v_orbital_TB (cylinder) | 1.430 m/s |

---

## Case 1843 — SPECIAL: Spinning Shell Smash — Genjuro Kamegaki / Bandit Genbu F230TB

**Blader:** Genjuro Kamegaki | **Beyblade:** Bandit Genbu F230TB | **Type:** attack

### Description

Spinning Shell Smash is Genjuro Kamegaki's signature special move with Bandit Genbu F230TB. Genjuro glows with a golden aura and crosses his arms with two fingers out, then raises and slams his right hand down like a hammer, sending rocks flying from the impact. Bandit Genbu blasts an indigo ray from the Stone Face, releasing Genbu the black tortoise. The beast slams its axe-like hammer onto the ground, sending up a burst of smoke. Bandit Genbu then leaps out of the smoke and smashes directly into the opponent, using the F230 track's height advantage to strike downward at full orbital velocity. The downward angle drives the opponent into the floor and rockets them in recoil. Genjuro first used this move to defeat Ren Kurenai during Neo Battle Bladers.

### Stage 1 — TB Cylinder Drive Launch (from Case 1842)

TB tip tips to cylinder contact: v_orbital_TB = **1.430 m/s**. F230 height geometry: θ_down = **28.4°** (downward attack).

### Stage 2 — Under-Attack Hammer Strike

**Aerial smoke-burst leap (Genbu beast stomp — pre-impact elevation):**

```
Δh_leap = 0.040 m  (40 mm — Bandit FW lifts to peak height above stadium smoke burst)
v_impact = √(v_orbital_TB² + 2g × Δh_leap)
         = √(1.430² + 2 × 9.81 × 0.040)
         = √(2.045 + 0.785)
         = √2.830
         = 1.682 m/s
```

**Collision model (downward F230 hammer strike, e = 0.70):**

Parameters:
- m_G = 39.0 g, v_impact = 1.682 m/s
- m_opp = 40 g, v_opp ≈ 0

```
m_eff = (0.039 × 0.040) / (0.039 + 0.040) = 1.974×10⁻² kg

J_smash = m_eff × (1 + e) × v_impact
        = 1.974×10⁻² × 1.70 × 1.682
        = 5.645×10⁻² N·s
```

**Effect on opponent (horizontal component):**
```
Δv_opp_horiz = (J_smash × cos(28.4°)) / m_opp = (5.645×10⁻² × 0.879) / 0.040 = 1.241 m/s  (outward rocket)
```

**Effect on opponent (downward component):**
```
Δv_opp_down  = (J_smash × sin(28.4°)) / m_opp = (5.645×10⁻² × 0.476) / 0.040 = 0.672 m/s  (floor press)
```
→ "rockets in recoil" + floor friction strip

**Effect on Bandit Genbu (spin drain):**
```
Δω_G     = J_smash × r_contact / I_G = 5.645×10⁻² × 0.022 / 2.590×10⁻⁵ = 47.9 rad/s
ω_remain = 650 − 47.9 = 602.1 rad/s  (92.6% retained)
```

---

**[M] BeySpirit amplification:**
Genjuro's golden aura channels Genbu's divine turtle power — the axe-hammer strike transcends physics.

[M] factor = **6.5 ×**
[M] Δv = 1.241 × 6.5 = **8.1 m/s** (rocket ring-out)

> **Note:** Physical values describe F230 under-attack geometry, TB tip cylinder-drive orbital mechanics, and Genbu beast smoke-burst leap ballistics. [M] values represent Genjuro's BeySpirit divine tortoise strike that exceeds all normal collision bounds. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spinningShellSmashSpecial(bey: Beyblade, target: Beyblade): void {
  // F230 downward angle: θ = 28.4°, Δh leap = 40 mm → v_impact = 1.682 m/s
  // Physical J_smash = 5.645×10⁻² N·s; [M] 6.5×
  const J_phys = 0.05645;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.5; // [M] BeySpirit 6.5× (divine tortoise)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Downward press: opponent loses floor traction (floor-friction strip)
  target.spin = Math.max(0, target.spin - 10);
}
```

**Compatible beys:** Any beyblade using the F230 Spin Track (or equivalent tall-track Spin Track ≥ 200 height units) combined with a TB or equivalent ball-tip that can transition to cylinder-rim drive. The F230 height differential under-attack mechanic requires opponents with shorter track configurations (≤ 145 height). Standard game instance: Bandit Genbu F230TB (Genjuro Kamegaki, Metal Fury). Without F230 the under-attack downward angle is absent; without TB cylinder contact the drive velocity is insufficient for the smoke-burst aerial leap.

---

## Case 1844 — COMBO: Shell Slam — Bandit Genbu

**Sequence:** ↓ A K (moveDown · attack · defense)
**Cost:** 15 | **Type:** attack | **Blader:** Genjuro Kamegaki

### Physics Justification

The downward retreat (↓) drops Bandit Genbu to the stadium bowl bottom, maximising F230 height advantage above the floor (the tall track keeps the FW high while the bey sits at the low point of the bowl). The attack strike (A) delivers the under-attack hit — the angle θ_down = 28.4° magnifies the downward impulse component, pressing the opponent into the floor and stripping traction. The immediate defense stance (K) represents Genbu pulling back into a tortoise-shell retraction posture, converting the rebound force back to spin:

```
J_rebound = m_G × e_rebound × v_contact = 0.039 × 0.70 × 0.5 = 1.365×10⁻² N·s

Δω = η × J_rebound × r_contact / I_G = 0.80 × 1.365×10⁻² × 0.022 / 2.590×10⁻⁵
   = 0.80 × 11.6
   = +9.3 rad/s  ≈ +9 rad/s
```

(η = 0.80: TB ball re-contact spin-reconversion at retraction.) The downward strike geometry gives damageMultiplier **1.20×** and the floor-press creates lockMs = 100 as the opponent is momentarily pinned.

**Parameters:**
- spinGain: +9 rad/s (TB rebound retraction spin-reconversion η = 0.80)
- damageMultiplier: 1.20 (F230 downward strike geometry θ = 28.4°)
- lockMs: 100 (opponent floor-press duration)

### TypeScript

```typescript
function shellSlamCombo(bey: Beyblade, target: Beyblade): void {
  // TB ball rebound retraction: Δω ≈ +9 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 9);
  // F230 downward strike geometry: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 100: opponent floor-pressed
  bey.lockMs = 100;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +9 rad/s (partial) | ✓ |



---

## Case 1845 — GIMMICK: Twisted Tempo 145WD — Twisted ER Centrifugal Air Barrier & WD Gyroscopic Stamina

**Beyblade:** Twisted Tempo 145WD (TT JP: ツイステッドテンポ145WD; Hasbro EN: Twisted Tempo 145WD)
**Blader:** Faust | **Series:** Beyblade: Metal Masters (BB-80)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Tempo | 34.0 | 31.0 |
| Energy Ring | Twisted | 4.0 | 25.0 |
| Spin Track | 145 | 1.7 | 6.0 |
| Performance Tip | WD (Wide Defense) | 1.0 | 6.0 |
| **Total** | | **40.7** | |

**I_total** = 34.0×10⁻³ × 0.031² + 4.0×10⁻³ × 0.025² + 1.7×10⁻³ × 0.006² + 1.0×10⁻³ × 0.006²
           = 3.267×10⁻⁵ + 2.500×10⁻⁶ + 6.12×10⁻⁸ + 3.60×10⁻⁸
           = **3.523×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (standard MFB Metal Masters launch)
L₀ = I × ω₀ = 3.523×10⁻⁵ × 650 = **2.290×10⁻² kg·m²/s**

---

### 1. Twisted ER — Centrifugal Air Barrier ("Barrier of Space")

The Twisted Energy Ring's large Roman-numeral clock-face design acts as a wide annular fan blade at ω₀. The spinning rim pumps air centrifugally outward, establishing a circular high-pressure air barrier at r_ER = 25 mm.

**Rim velocity:**

```
v_rim = ω₀ × r_ER = 650 × 0.025 = 16.25 m/s
```

**Dynamic pressure at barrier radius:**

```
q_rim = ½ × ρ_air × v_rim² = ½ × 1.225 × 16.25² = 161.8 Pa
```

This is the "barrier of space" — a ring of high-pressure air at r = 25 mm radiating outward from Twisted Tempo's axis. Opponents' beyblades feel this as a radial repulsion boundary.

---

### 2. Low-Pressure Suction Zone ("Black Hole")

Inside r_ER, the centrifugal pumping creates a low-pressure zone relative to the ambient arena pressure. The pressure differential drives a radially inward suction force on any bey within the suction radius (r < 80 mm):

```
ΔP_suction = q_rim = 161.8 Pa  (below ambient at axis)

F_suction = ΔP_suction × A_opp = 161.8 × π × 0.020² = 2.034×10⁻¹ N  (inward radial)
```

**Suction work — opponent drawn in from r = 80 mm to contact at r = 0:**

```
W_suction = F_suction × Δr = 0.2034 × 0.080 = 1.627×10⁻² J

v_approach = √(2 × W_suction / m_opp) = √(2 × 1.627×10⁻² / 0.042) = √(0.7748) = 0.880 m/s
```

---

### 3. WD Tip — Wide Defense Gyroscopic Stamina

The Wide Defense tip runs on a broad flat rim (r_WD = 6 mm) with relatively low friction, maximising spin time:

```
τ_WD = μ_WD × m × g × r_WD = 0.15 × 0.0407 × 9.81 × 0.006 = 3.588×10⁻⁴ N·m
t_spin = L₀ / τ_WD = 2.290×10⁻² / 3.588×10⁻⁴ = 63.8 s
```

Precession at WD running height (h_CoM = 15 mm):

```
Ω_prec = m × g × h_CoM / L₀ = 0.0407 × 9.81 × 0.015 / 2.290×10⁻² = 0.261 rad/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 40.7 g |
| I_total | 3.523×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 2.290×10⁻² kg·m²/s |
| v_rim | 16.25 m/s |
| q_rim | 161.8 Pa |
| F_suction | 2.034×10⁻¹ N |
| v_approach (opponent) | 0.880 m/s |
| τ_WD | 3.588×10⁻⁴ N·m |
| t_spin | 63.8 s |
| Ω_prec | 0.261 rad/s |

---

## Case 1846 — SPECIAL: Spiral Dimension — Faust / Twisted Tempo 145WD

**Blader:** Faust | **Beyblade:** Twisted Tempo 145WD | **Type:** defense

### Description

Spiral Dimension is the signature special move of Faust and Twisted Tempo 145WD. The move projects a giant image of the Twisted Energy Ring's Roman-numeral clock design outward from the spinning bey, creating a barrier of space throughout the stadium. A giant black hole forms at Twisted Tempo's axis, sucking all opposing beyblades within the barrier inward. Once drawn to the centre, the dimensional collapse reverses and ejects them with devastating force.

### Stage 1 — Air Barrier & Black Hole Suction (from Case 1845)

Suction F = 2.034×10⁻¹ N (inward). Opponent drawn from r = 80 mm to axis: v_approach = **0.880 m/s**.

### Stage 2 — Dimensional Collapse Strike

**Collision model (suction-driven approach + elastic reversal, e = 0.80):**

Parameters:
- m_TT = 40.7 g, m_opp = 42 g (representative), v_approach = 0.880 m/s

```
m_eff = (0.0407 × 0.042) / (0.0407 + 0.042) = 1.709×10⁻³ / 0.0827 = 2.067×10⁻² kg

J_spiral = m_eff × (1 + e) × v_approach
         = 2.067×10⁻² × 1.80 × 0.880
         = 3.274×10⁻² N·s
```

**Effect on opponent (ejected from dimensional collapse):**
```
Δv_opp  = J_spiral / m_opp = 3.274×10⁻² / 0.042 = 0.779 m/s
```

**Effect on Twisted Tempo (spin drain — minimal; WD absorbs recoil):**
```
Δω_TT    = J_spiral × r_contact / I_TT = 3.274×10⁻² × 0.022 / 3.523×10⁻⁵ = 20.4 rad/s
ω_remain = 650 − 20.4 = 629.6 rad/s  (96.9% retained)
```

---

**[M] BeySpirit amplification:**
Faust channels the dimensional barrier to its maximum extent — the entire arena collapses into a single dimensional point before erupting outward.

[M] factor = **7.0 ×**
[M] Δv = 0.779 × 7.0 = **5.5 m/s** (ring-out; all opponents ejected)

> **Note:** Physical values describe Twisted ER centrifugal air barrier, pressure-differential suction, and dimensional collapse impulse. [M] values represent BeySpirit-overridden dimensional force that transcends normal collision limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spiralDimensionSpecial(bey: Beyblade, target: Beyblade): void {
  // Stage 1: suction — F_suction = 0.2034 N inward over Δr = 80 mm → v_approach = 0.880 m/s
  // Pull target toward bey center first
  const dx = bey.x - target.x;
  const dy = bey.y - target.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.2034, (dy / dist) * 0.2034);
  // Stage 2: dimensional collapse — J_phys = 3.274×10⁻² N·s; [M] 7.0×
  const J_phys = 0.03274;
  const exDx = target.x - bey.x;
  const exDy = target.y - bey.y;
  const exDist = Math.hypot(exDx, exDy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0×
  applyForce(target.id, (exDx / exDist) * amplified, (exDy / exDist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Twisted Energy Ring (Roman-numeral clock-face design) with the WD (Wide Defense) Performance Tip on a heavy defense-class Fusion Wheel (Tempo or equivalent). The centrifugal air barrier requires an ER with a wide annular blade surface (r_ER ≥ 22 mm) at high spin. Standard game instance: Twisted Tempo 145WD (Faust, Metal Masters). Without the Twisted ER the clock-face barrier projection is absent; without the heavy Tempo wheel the gyroscopic rigidity needed to sustain the dimensional vortex collapses.

---

## Case 1847 — COMBO: Vortex Guard — Twisted Tempo

**Sequence:** ← K ← (moveLeft · defense · moveLeft)
**Cost:** 15 | **Type:** defense | **Blader:** Faust

### Physics Justification

The first leftward sweep (←) carries Twisted Tempo into a partial orbit within its own suction field, inducing a low-speed inward drift in any nearby opponent (F_suction × Δt / m_opp = 2.034×10⁻¹ × 0.072 / 0.042 = 0.348 m/s). The defense stance (K) anchors the WD tip and allows the suction reaction — the opponent being pulled in momentarily — to transfer a small angular impulse back to Twisted Tempo:

```
v_pull = F_suction × Δt_suction / m_opp = 0.2034 × 0.072 / 0.042 = 0.348 m/s  (induced)

Δω = η × m_opp × v_pull × r_contact / I_TT
   = 0.75 × 0.042 × 0.348 × 0.022 / 3.523×10⁻⁵
   = 0.75 × (3.219×10⁻⁴) / 3.523×10⁻⁵
   = 0.75 × 9.14
   = +6.9 rad/s  ≈ +7 rad/s
```

(η = 0.75: suction reaction transfer efficiency — partial vortex re-coupling at WD contact point.) The second leftward exit (←) releases the accumulated vortex momentum as a lateral deflection impulse with damageMultiplier **1.15×**. The lockMs = 200 represents the suction dwell window during which the opponent is held near the axis.

**Parameters:**
- spinGain: +7 rad/s (suction reaction angular impulse; opponent v_pull = 0.348 m/s transferred at r = 22 mm; η = 0.75)
- damageMultiplier: 1.15 (vortex-assisted lateral deflection on exit sweep)
- lockMs: 200 (suction dwell anchoring opponent near axis)

### TypeScript

```typescript
function vortexGuardCombo(bey: Beyblade, target: Beyblade): void {
  // Suction reaction angular impulse: Δω ≈ +7 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 7);
  // Vortex-assisted deflection: 1.15× lateral impulse
  bey.damageMultiplier = 1.15;
  // lockMs = 200: suction dwell
  bey.lockMs = 200;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.15, (dy / dist) * 0.15);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.15 | ✓ |
| lockMs | ≤ 300 | 200 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +7 rad/s (partial) | ✓ |



---

## Case 1848 — GIMMICK: Dranzer MS — Dranzer S Wing Aerodynamics & MS Tip Stamina

**Beyblade:** Dranzer MS (TT JP: ドランザーMS; Hasbro EN: Dranzer MS)
**Blader:** Kai Hiwatari | **Series:** Beyblade G-Revolution (Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Dranzer S | 14.0 | 33.0 |
| Weight Disk | Wide | 18.0 | 35.0 |
| Spin Gear | Right MS SG | 3.5 | 10.0 |
| Bottom Base | MS (Metal Sharp) | 2.0 | 3.0 |
| **Total** | | **37.5** | |

(Bit Chip Dranzer ~1 g at r ≈ 0 excluded per convention — negligible I contribution.)

**I_total** = 14.0×10⁻³ × 0.033² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.525×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 1.8×10⁻⁸
           = **3.748×10⁻⁵ kg·m²**

ω₀ = 710 rad/s (standard plastic-generation G-Revolution launch)
L₀ = I × ω₀ = 3.748×10⁻⁵ × 710 = **2.661×10⁻² kg·m²/s**

---

### 1. Dranzer S — Four-Wing Phoenix Aerodynamic Lift

The Dranzer S Attack Ring carries four swept phoenix-wing blades. At ω₀ each blade tip travels at high velocity and generates an upward aerodynamic lift force:

```
v_wing_tip = ω₀ × r_AR = 710 × 0.033 = 23.43 m/s
```

**Lift per wing blade (flat aerofoil at attack angle):**

```
A_wing = 3.0×10⁻³ × 12.0×10⁻³ = 3.6×10⁻⁵ m²  (approximate single blade area)
C_L = 0.6  (swept flat wing at high tip speed)

F_lift_per_wing = ½ × ρ_air × C_L × A_wing × v_wing_tip²
                = ½ × 1.225 × 0.6 × 3.6×10⁻⁵ × 23.43²
                = 7.264×10⁻³ N
```

**Total lift (4 active wings):**

```
F_lift_total = 4 × 7.264×10⁻³ = 2.906×10⁻² N

W = m × g = 0.0375 × 9.81 = 0.368 N

Lift / Weight = 2.906×10⁻² / 0.368 = 7.9%  (BeySpirit required for full liftoff)
```

→ The wings provide measurable aerodynamic assist but cannot achieve liftoff alone. BeySpirit ignites the phoenix and delivers the remaining 92.1% of the upward impulse needed.

---

### 2. MS (Metal Sharp) Tip — Maximum Stamina Contact

The Metal Sharp tip contacts the arena floor at a single metal point (r_MS = 3 mm, μ = 0.08):

```
τ_MS = μ × m × g × r_MS = 0.08 × 0.0375 × 9.81 × 0.003 = 8.831×10⁻⁵ N·m
t_spin = L₀ / τ_MS = 2.661×10⁻² / 8.831×10⁻⁵ = 301.3 s
```

The metal-on-plastic contact gives exceptional endurance, allowing Dranzer to sustain the orbital speed needed for the Spiral Fireball liftoff late in the battle.

---

### 3. Self-Impact Burst Risk — Phoenix Burns Its Own Life Force

The Spiral Fireball's dive lands with total impact impulse J_fireball (derived in Case 1849). The same force that devastates the opponent acts back on Dranzer via Newton's third law. The burst threshold for Dranzer S (4 pegs, plastic-gen):

```
τ_burst_threshold ≈ 4 × 0.100 = 0.400 N·m  (4 burst pegs × 100 mN·m each)

Self-impact torque on Dranzer S tabs:
F_self = J_fireball / Δt_contact = 8.238×10⁻² / 0.003 = 27.5 N
τ_self   = F_self × r_AR = 27.5 × 0.033 = 0.908 N·m

Burst ratio = τ_self / τ_burst_threshold = 0.908 / 0.400 = 2.27×  → HIGH SELF-BURST RISK
```

→ "can damage your own beyblade and make you spin out by breaking" — physically verified.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.5 g |
| I_total | 3.748×10⁻⁵ kg·m² |
| ω₀ | 710 rad/s |
| L₀ | 2.661×10⁻² kg·m²/s |
| v_wing_tip | 23.43 m/s |
| F_lift_total | 2.906×10⁻² N |
| Lift / Weight | 7.9% |
| τ_MS | 8.831×10⁻⁵ N·m |
| t_spin | 301.3 s |
| τ_self_impact | 0.908 N·m |
| Burst ratio | 2.27× |

---

## Case 1849 — SPECIAL: Spiral Fireball — Kai Hiwatari / Dranzer MS

**Blader:** Kai Hiwatari | **Beyblade:** Dranzer MS | **Type:** attack (self-damage)

### Description

Spiral Fireball is the only special move of Kai Hiwatari and Dranzer MS. Dranzer gets engulfed in flames and soars into the air above the arena, surrounded by brilliant light from the phoenix fire. It then dives straight down back into the arena and crashes onto the opposing beyblade. This represents the phoenix's last attack, sacrificing its own life force to deliver a massive explosion. The force damages Dranzer itself — the impact can cause Dranzer to spin out or burst from the sheer recoil. Kai used this move to defeat Brooklyn in their battle during the Justice 5 Tournament.

### Stage 1 — Phoenix Fire Ascent (from Case 1848)

Wing aerodynamic assist: F_lift = 2.906×10⁻² N (7.9% of weight). BeySpirit delivers remaining liftoff force. Dranzer rises to h = **80 mm** above arena floor.

**Orbital entry speed:** v_orbital = 2.0 m/s (full attack-type orbital velocity before liftoff).

**Dive impact velocity:**

```
v_impact = √(v_orbital² + 2g × h)
         = √(2.0² + 2 × 9.81 × 0.080)
         = √(4.0 + 1.570)
         = √5.570
         = 2.360 m/s
```

### Stage 2 — Phoenix Crash (Mutual Impact)

**Collision model (hard dive, e = 0.85):**

Parameters:
- m_DMS = 37.5 g, v_impact = 2.360 m/s
- m_opp = 38 g (representative), v_opp ≈ 0

```
m_eff = (0.0375 × 0.038) / (0.0375 + 0.038) = 1.425×10⁻³ / 0.0755 = 1.887×10⁻² kg

J_fireball = m_eff × (1 + e) × v_impact
           = 1.887×10⁻² × 1.85 × 2.360
           = 8.238×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_fireball / m_opp = 8.238×10⁻² / 0.038 = 2.168 m/s
```

**Self-damage on Dranzer MS (Newton's third law — mutual impact):**
```
Δω_self  = J_fireball × r_contact / I_DMS = 8.238×10⁻² × 0.025 / 3.748×10⁻⁵ = 54.9 rad/s  (spin drain)
ω_remain = 710 − 54.9 = 655.1 rad/s  (physical; 92.3% post-impact)
τ_self   = 0.908 N·m  → 2.27× burst threshold  (very high self-burst risk)
```

---

**[M] BeySpirit amplification:**
Kai channels the full life force of Dranzer's phoenix spirit into one final explosion — the bird burns itself to ash to destroy its opponent.

[M] factor = **9.0 ×**
[M] Δv_opp = 2.168 × 9.0 = **19.5 m/s** (complete destruction of opponent)
[M] Δω_self = 54.9 × 9.0 = **494 rad/s** (near-total spin loss — self-destruction)

> **Note:** Physical values describe Dranzer S wing-assisted aerial liftoff and mutual impulse dive collision. [M] values represent the phoenix's full life-force sacrifice — a single move that destroys both the opponent AND Dranzer itself at BeySpirit level. The [M] self-damage is intentional and canon. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spiralFireballSpecial(bey: Beyblade, target: Beyblade): void {
  // Aerial dive: h = 80 mm, v_impact = 2.360 m/s
  // Physical J_fireball = 8.238×10⁻² N·s; [M] 9.0×
  const J_phys = 0.08238;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 9.0; // [M] BeySpirit 9.0× (phoenix life-sacrifice)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Self-damage: mutual impact — Dranzer takes the same force back
  // Physical: Δω_self = 54.9 rad/s; [M]: near-total spin loss
  const selfDrain = J_phys * 9.0; // [M] self-damage matches opponent impulse
  applyForce(bey.id, -(dx / dist) * selfDrain, -(dy / dist) * selfDrain);
  bey.spin = Math.max(0, bey.spin - 495); // [M] self-destruction spin drain
}
```

**Compatible beys:** Any beyblade using the Dranzer S (or equivalent swept-wing phoenix Attack Ring) with an MS (Metal Sharp) tip, where the wing geometry provides measurable aerodynamic lift assist. The self-damage mechanic applies to any bey that delivers a mutual-impulse dive attack — the Newton's-third-law recoil is unavoidable. Standard game instance: Dranzer MS (Kai Hiwatari, G-Revolution). Without the Dranzer S wings the aerodynamic liftoff assist is absent; without the MS tip the long-stamina orbital platform needed to reach liftoff speed late in the battle is absent.

---

## Case 1850 — COMBO: Phoenix Dive — Dranzer MS

**Sequence:** J → A (jump · moveRight · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Kai Hiwatari

### Physics Justification

The jump (J) initiates a brief partial Spiral Fireball ascent — the Dranzer S wings provide aerodynamic lift over Δh = 20 mm (one-quarter of the full 80 mm liftoff; F_lift × Δt_jump = 2.906×10⁻² × 0.35 = 1.017×10⁻² J → v_z = 0.735 m/s). The rightward arc (→) angles the descent to the right, positioning the approach vector for a glancing dive. The attack (A) releases the wing-assisted dive strike:

```
v_combo_impact = √(v_orbital² + 2g × Δh_partial)
               = √(2.0² + 2 × 9.81 × 0.020)
               = √(4.0 + 0.392)
               = 2.096 m/s

Δω = η × m_DMS × v_combo_impact × r_contact / I_DMS
   = 0.45 × 0.0375 × 2.096 × 0.025 / 3.748×10⁻⁵
   = 0.45 × (1.965×10⁻³) / 3.748×10⁻⁵
   = 0.45 × 52.43
   = +23.6 rad/s  ≈ +24 rad/s
```

(η = 0.45: partial wing-aerodynamic assisted re-contact at partial dive height.) The angled descent approach from partial elevation raises the normal impulse vector by θ = arctan(0.735/2.0) = 20.2°, adding damageMultiplier **1.35×** from the downward component.

**Parameters:**
- spinGain: +24 rad/s (wing-assisted partial dive spin reconversion η = 0.45, Δh = 20 mm)
- damageMultiplier: 1.35 (partial aerial approach θ = 20.2° normal impulse boost)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function phoenixDiveCombo(bey: Beyblade, target: Beyblade): void {
  // Partial wing-lift dive spin reconversion: Δω ≈ +24 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 24);
  // Angled partial aerial approach: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +24 rad/s (partial) | ✓ |



> **Note:** Cases 1851–1854 reserved — CS9 HMS session conflict #7 (CS9 wrote HMS Dranzer MS / Driger MS at 1845–1853 in a concurrent session). Cases 1855–1857 continue from Case 1850 (Spiral Fireball).

---

## Case 1855 — GIMMICK: Galeon 2 — Blade Sweep Plasma Vortex & SFC Tip Orbital Drive

**Beyblade:** Galeon 2 (TT JP: ガルーン2; Hasbro EN: Galeon 2)
**Blader:** Lee | **Series:** Beyblade G-Revolution (Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Galeon 2 (6-blade lion-thunder) | 15.0 | 32.0 |
| Weight Disk | 10 Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Bottom Base | SFC (Semi-Flat Customs) | 2.5 | 4.0 |
| **Total** | | **39.0** | |

(Bit Chip Galeon 2 ~1 g at r ≈ 0 excluded per convention.)

**I_total** = 15.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.5×10⁻³ × 0.004²
           = 1.536×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 4.0×10⁻⁸
           = **3.780×10⁻⁵ kg·m²**

ω₀ = 710 rad/s (standard plastic-generation G-Revolution launch)
L₀ = I × ω₀ = 3.780×10⁻⁵ × 710 = **2.684×10⁻² kg·m²/s**

---

### 1. Galeon 2 AR — Blade Sweep Plasma Wake ("Lightning Bolts")

The six lion-thunder blades of Galeon 2's Attack Ring sweep at high tip velocity, ionising the boundary-layer air and creating visible plasma wakes — the lightning bolt effect seen in the anime.

**Blade tip velocity and dynamic pressure:**

```
v_tip = ω₀ × r_AR = 710 × 0.032 = 22.72 m/s

q_tip = ½ × ρ_air × v_tip² = ½ × 1.225 × 22.72² = 316.7 Pa
```

**Blade sweep frequency (any fixed point near the AR):**

```
f_blade = ω₀ × n_blades / (2π) = 710 × 6 / (2π) = 677.8 Hz
```

**Single blade pass lateral impulse (blade width 3 mm, contact area 10×10 mm, miss distance 5 mm):**

```
Δt_pass = blade_thickness / v_tip = 3×10⁻³ / 22.72 = 1.320×10⁻⁴ s
A_contact = 1.0×10⁻⁴ m²
F_blade_pulse = q_tip × A_contact = 316.7 × 1.0×10⁻⁴ = 3.167×10⁻² N
J_pulse = F_blade_pulse × Δt_pass = 3.167×10⁻² × 1.320×10⁻⁴ = 4.180×10⁻⁶ N·s  (per blade pass)
```

**Accumulated lateral disorient impulse (N_passes over t_spiral = 2.0 s orbital approach):**

```
N_passes = f_blade × t_spiral = 677.8 × 2.0 = 1356

J_lateral_total = N_passes × J_pulse = 1356 × 4.180×10⁻⁶ = 5.666×10⁻³ N·s

Radial outward component (60% of lateral → radial displacement):
J_radial_eff  = 0.60 × 5.666×10⁻³ = 3.400×10⁻³ N·s
F_radial_eff  = J_radial_eff / t_spiral = 3.400×10⁻³ / 2.0 = 1.700×10⁻³ N  (sustained outward push)
```

→ This is the "lightning disorientation" — 1.7 mN of sustained lateral outward force gradually displaces the opponent toward the stadium wall.

---

### 2. SFC Tip — Semi-Flat Orbital Drive

The Semi-Flat Customs tip contacts the floor at radius r_SFC = 4 mm with moderate friction, giving Galeon 2 a balance between attack orbital velocity and stamina:

```
τ_SFC = μ × m × g × r_SFC = 0.30 × 0.039 × 9.81 × 0.004 = 4.590×10⁻⁴ N·m
t_spin = L₀ / τ_SFC = 2.684×10⁻² / 4.590×10⁻⁴ = 58.5 s

v_orbital = μ_SFC × ω₀ × r_SFC = 0.30 × 710 × 0.004 = 0.852 m/s  (steady orbit)
```

(Galeon 2 at attack speed uses peak v_orbital ≈ 1.5 m/s with launch momentum.)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 39.0 g |
| I_total | 3.780×10⁻⁵ kg·m² |
| ω₀ | 710 rad/s |
| L₀ | 2.684×10⁻² kg·m²/s |
| v_tip | 22.72 m/s |
| q_tip | 316.7 Pa |
| f_blade | 677.8 Hz |
| J_pulse | 4.180×10⁻⁶ N·s |
| J_lateral_total (2 s) | 5.666×10⁻³ N·s |
| J_radial_eff | 3.400×10⁻³ N·s |
| F_radial_eff | 1.700×10⁻³ N |
| τ_SFC | 4.590×10⁻⁴ N·m |
| t_spin | 58.5 s |

---

## Case 1856 — SPECIAL: Spiral Lightning — Lee / Galeon 2

**Blader:** Lee | **Beyblade:** Galeon 2 | **Type:** attack

### Description

Spiral Lightning is Lee's signature special move with Galeon 2. Galeon 2 spirals inward in a tightening orbit around the opponent, its six AR blades generating rapid lightning bolt plasma wakes at 677 Hz. These successive blade sweeps disorient and laterally displace the opponent outward over the spiral approach. Finally, Galeon 2 delivers a direct orbital crash at full attack speed. Galeon first used this against Tyson's Dragoon in a battle royale during G-Revolution.

### Stage 1 — Lightning Orbital Approach (from Case 1855)

Accumulated blade sweep lateral disorient over t = 2.0 s:
J_radial_eff = 3.400×10⁻³ N·s → opponent lateral displacement = **J_radial_eff / m_opp = 3.400×10⁻³ / 0.038 = 89.5 mm** (opponent displaced 89.5 mm outward from centre, near stadium wall).

### Stage 2 — Orbital Crash

**Collision model (orbital attack, e = 0.80):**

Parameters:
- m_G2 = 39.0 g, v_attack = 1.5 m/s (peak SFC orbital)
- m_opp = 38 g, v_opp ≈ 0

```
m_eff = (0.039 × 0.038) / (0.039 + 0.038) = 1.482×10⁻³ / 0.077 = 1.925×10⁻² kg

J_crash = m_eff × (1 + e) × v_attack
        = 1.925×10⁻² × 1.80 × 1.5
        = 5.198×10⁻² N·s
```

**Effect on opponent (combined disorient + crash):**
```
Δv_opp  = J_crash / m_opp = 5.198×10⁻² / 0.038 = 1.368 m/s
```
(Opponent already at wall due to 89.5 mm disorient displacement — 1.37 m/s sends it over the edge.)

**Effect on Galeon 2 (spin drain):**
```
Δω_G2    = J_crash × r_contact / I_G2 = 5.198×10⁻² × 0.025 / 3.780×10⁻⁵ = 34.4 rad/s
ω_remain = 710 − 34.4 = 675.6 rad/s  (95.2% retained)
```

---

**[M] BeySpirit amplification:**
Lee channels Galeon's full thunder spirit — the lightning bolts become true electrical arcs that overwhelm the opponent's spin before the final crash.

[M] factor = **6.0 ×**
[M] Δv = 1.368 × 6.0 = **8.2 m/s** (ring-out from wall)

> **Note:** Physical values describe blade sweep plasma wake accumulated lateral disorient and orbital crash mechanics. [M] values represent BeySpirit-overridden electrical arc force that overwhelms normal collision limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spiralLightningSpecial(bey: Beyblade, target: Beyblade): void {
  // Stage 1: blade sweep lateral disorient — push target outward (F_radial = 1.700×10⁻³ N × 2s)
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Sustained lateral outward nudge (represented as accumulated impulse)
  applyForce(target.id, (dx / dist) * 0.0034, (dy / dist) * 0.0034);
  // Stage 2: orbital crash — J_crash = 5.198×10⁻² N·s; [M] 6.0×
  const J_phys = 0.05198;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0×
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a multi-blade Attack Ring (6+ blades) with blade tip velocity v_tip ≥ 20 m/s for sufficient blade-sweep plasma wake generation, combined with a semi-flat tip that provides stable mid-speed orbital approach. Standard game instance: Galeon 2 (Lee, G-Revolution). Without the high blade count the lightning strike frequency drops below the 677 Hz disorient threshold; without the SFC tip the orbital stability needed to sustain the 2-second spiral approach is absent.

---

## Case 1857 — COMBO: Thunder Arc — Galeon 2

**Sequence:** → E A (moveRight · dodge · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Lee

### Physics Justification

The rightward orbital sweep (→) positions Galeon 2 on a clockwise arc, generating a partial blade sweep sequence against the opponent (f_blade × Δt_arc = 677.8 × 0.12 = 81 blade passes → J_partial = 81 × 4.180×10⁻⁶ = 3.386×10⁻⁴ N·s lateral). The dodge (E) represents a lightning arc flash — Galeon briefly arcs away and then snaps inward, converting the orbital tangential velocity back to spin at the contact point:

```
Δω = η × m_G2 × v_orbital × r_contact / I_G2
   = 0.60 × 0.039 × 1.5 × 0.025 / 3.780×10⁻⁵
   = 0.60 × (1.463×10⁻³) / 3.780×10⁻⁵
   = 0.60 × 38.70
   = +23.2 rad/s  ≈ +23 rad/s
```

(η = 0.60: SFC semi-flat orbital-to-spin reconversion at arc flash snap-back.) The attack (A) delivers the strike at the end of the arc, amplified by the accumulated blade sweep lateral push: damageMultiplier **1.25×**.

**Parameters:**
- spinGain: +23 rad/s (SFC orbital-to-spin reconversion at arc flash, η = 0.60)
- damageMultiplier: 1.25 (orbital arc approach amplified by partial blade sweep disorient)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function thunderArcCombo(bey: Beyblade, target: Beyblade): void {
  // SFC orbital-to-spin arc flash reconversion: Δω ≈ +23 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 23);
  // Arc approach with blade sweep disorient: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +23 rad/s (partial) | ✓ |



---

## Case 1858 — GIMMICK: Ace Dragon Sting Charge Zan — Sting Disc Spring-Wall Ricochet & Zephyr Tip Orbital Drive

**Beyblade:** Ace Dragon Sting Charge Zan (TT JP: エースドラゴン・スティング・チャージ・ザン; Hasbro EN: Ace Dragon Sting Charge Zan)
**Blader:** Dante Koryu | **Series:** Beyblade Burst Rise (B-149)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Layer Base | Ace Dragon | 21.0 | 27.0 |
| Layer Weight | — | 0.0 | — |
| Disc | Sting (spring-loaded) | 7.5 | 22.0 |
| Driver | Charge Zan (Zephyr) | 2.5 | 5.0 |
| **Total** | | **31.0** | |

**I_total** = 21.0×10⁻³ × 0.027² + 7.5×10⁻³ × 0.022² + 2.5×10⁻³ × 0.005²
           = 1.531×10⁻⁵ + 3.630×10⁻⁶ + 6.25×10⁻⁸
           = **1.900×10⁻⁵ kg·m²**

ω₀ = 630 rad/s (standard Burst Rise launch)
L₀ = I × ω₀ = 1.900×10⁻⁵ × 630 = **1.197×10⁻² kg·m²/s**

---

### 1. Sting Disc — Spring-Loaded Wall-Ricochet Mechanism

The Sting Disc features two spring-loaded protrusions at r = 22 mm. When Ace Dragon impacts the stadium wall, the protrusions compress and release, adding stored spring potential energy to the rebound.

**Spring mechanics (single protrusion, k ≈ 75 N/m, max compression x = 4 mm):**

```
PE_spring = ½ × k × x² = ½ × 75 × (0.004)² = 6.000×10⁻⁴ J

Δv_spring = √(2 × PE_spring / m) = √(2 × 6.000×10⁻⁴ / 0.031) = √(3.871×10⁻²) = 0.197 m/s
```

**Wall approach velocity (Ace Dragon orbital speed):**

```
v_wall = ω₀ × r_orbit / (2π / n_walls) ≈ 1.800 m/s  (orbital approach speed at wall contact)
```

**Post-bounce velocity (two protrusions active, e_wall = 0.72 ABS-on-ABS):**

```
v_post = e_wall × v_wall + 2 × Δv_spring
       = 0.72 × 1.800 + 2 × 0.197
       = 1.296 + 0.394
       = 1.690 m/s
```

**Speed gain from spring mechanism:**

```
Δv_net = v_post − e_wall × v_wall = 1.690 − 1.296 = 0.394 m/s  (spring boost)

KE_gain = ½ × m × (v_post² − (e_wall × v_wall)²)
        = ½ × 0.031 × (1.690² − 1.296²)
        = ½ × 0.031 × (2.856 − 1.680)
        = 1.822×10⁻² J
```

→ Spring releases stored energy at the wall, accelerating Ace Dragon beyond what elastic rebound alone provides.

**S Gear analogy:** The S Gear (DB/BU system) uses a mechanically similar sliding spring mechanism. When the Layer's mode-change trigger fires, the S Gear's internal spring unloads, releasing stored elastic energy to the Disc in the same spring-energy-to-orbital-velocity conversion. The physics is identical: PE_spring → ΔKE_orbital.

---

### 2. Zephyr Driver — Variable-Friction Orbital Drive

The Zephyr Driver transitions between a sharp tip (low friction, high speed) and a flat contact pad (moderate friction, stable orbit), controlled by spin rate:

```
μ_sharp  = 0.10  (high spin — sharp point contacts; stamina/orbit mode)
μ_flat   = 0.35  (low spin — pad contacts; ground-hugging attack mode)

τ_sharp  = μ × m × g × r = 0.10 × 0.031 × 9.81 × 0.005 = 1.521×10⁻⁴ N·m
t_spin   = L₀ / τ_sharp = 1.197×10⁻² / 1.521×10⁻⁴ = 78.7 s  (stamina mode)

v_orbital_flat = μ_flat × ω₀ × r_driver = 0.35 × 630 × 0.005 = 1.103 m/s  (attack mode)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 31.0 g |
| I_total | 1.900×10⁻⁵ kg·m² |
| ω₀ | 630 rad/s |
| L₀ | 1.197×10⁻² kg·m²/s |
| k_spring | 75 N/m |
| x_compression | 4 mm |
| PE_spring | 6.000×10⁻⁴ J |
| v_wall | 1.800 m/s |
| v_post | 1.690 m/s |
| KE_gain | 1.822×10⁻² J |
| τ_sharp | 1.521×10⁻⁴ N·m |
| t_spin | 78.7 s |

---

## Case 1859 — SPECIAL: Spring Cannon / Bound Stinger — Dante Koryu / Ace Dragon Sting Charge Zan

**Blader:** Dante Koryu | **Beyblade:** Ace Dragon Sting Charge Zan | **Type:** attack

### Description

Spring Cannon (Bound Stinger in Japan) is the signature special move of Dante Koryu and Ace Dragon Sting Charge Zan. Dragon increases its speed and attack power by using its spring-loaded Sting Disc to ricochet off the stadium wall. Dragon can also parry incoming attacks by aiming the Sting Disc at the opponent's beyblade mid-approach, transferring the spring release directly into a counter-strike. The move is used with Ace Dragon, Glyph Dragon, and Rock Dragon Sting Charge Zan variants.

### Stage 1 — Wall Ricochet (from Case 1858)

Orbital approach: v_wall = 1.800 m/s. Spring release at wall: v_post = **1.690 m/s** (Δv_spring = 0.394 m/s).

### Stage 2 — Spring Cannon Strike

Ace Dragon redirects from the wall toward the opponent at the enhanced post-bounce velocity.

**Collision model (spring-boosted orbital attack, e = 0.75):**

Parameters:
- m_AD = 31.0 g, v_attack = v_post = 1.690 m/s
- m_opp = 32 g (representative Burst Rise), v_opp ≈ 0

```
m_eff = (0.031 × 0.032) / (0.031 + 0.032) = 9.920×10⁻⁴ / 0.063 = 1.575×10⁻² kg

J_cannon = m_eff × (1 + e) × v_attack
         = 1.575×10⁻² × 1.75 × 1.690
         = 4.653×10⁻² N·s
```

**Parry variant (Sting Disc aimed at incoming opponent, relative velocity v_rel = v_post + v_opp_approach = 1.690 + 1.200 = 2.890 m/s):**

```
J_parry = m_eff × (1 + e) × v_rel
        = 1.575×10⁻² × 1.75 × 2.890
        = 7.959×10⁻² N·s
```

**Effect on opponent (cannon strike):**
```
Δv_opp  = J_cannon / m_opp = 4.653×10⁻² / 0.032 = 1.454 m/s
```

**Effect on Ace Dragon (spin drain):**
```
Δω_AD    = J_cannon × r_contact / I_AD = 4.653×10⁻² × 0.020 / 1.900×10⁻⁵ = 49.0 rad/s
ω_remain = 630 − 49.0 = 581.0 rad/s  (92.2% retained)
```

---

**[M] BeySpirit amplification:**
Dante channels Dragon's roaring spirit — the spring Disc surges with dragon energy, converting the wall not into a bounce but into a cannon barrel that fires Dragon like a projectile.

[M] factor = **5.5 ×**
[M] Δv = 1.454 × 5.5 = **8.0 m/s** (ring-out)

> **Note:** Physical values describe Sting Disc spring-loaded wall-ricochet PE release and orbital cannon strike mechanics. [M] values represent Dante's BeySpirit dragon-energy cannon blast that transcends elastic limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function springCannonSpecial(bey: Beyblade, target: Beyblade): void {
  // Wall ricochet: v_post = 1.690 m/s (spring-boosted)
  // Physical J_cannon = 4.653×10⁻² N·s; [M] 5.5×
  const J_phys = 0.04653;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 5.5; // [M] BeySpirit 5.5× (dragon spring cannon)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Sting Disc (or S Gear spring-mechanism equivalent) that provides two active spring protrusions at r ≥ 20 mm, combined with an orbital attack driver (Zephyr or equivalent variable-friction tip). The spring PE release requires a Disc with internal spring mechanism (k ≥ 60 N/m) capable of storing ≥ 5×10⁻⁴ J per protrusion at max wall compression. Standard game instance: Ace Dragon Sting Charge Zan (Dante Koryu, Burst Rise). Also compatible: Glyph Dragon Sting Charge Zan, Rock Dragon Sting Charge Zan (same Disc/Driver; different Layer Base).

---

## Case 1860 — COMBO: Sting Rush — Ace Dragon

**Sequence:** → K A (moveRight · defense · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Dante Koryu

### Physics Justification

The rightward arc (→) positions Ace Dragon on an approach vector toward the stadium wall, building orbital momentum (v_orbital = 1.103 m/s in flat-driver attack mode). The defense stance (K) represents the Sting Disc loading — Dragon brakes slightly as the spring protrusions compress against the wall contact: PE_spring loaded = ½ × 75 × (3×10⁻³)² = 3.375×10⁻⁴ J (75% of full compression at reduced approach speed). The attack (A) fires the spring-loaded strike at the opponent immediately after wall contact, transferring the stored spring energy:

```
Δv_spring_partial = √(2 × 2 × PE_partial / m) = √(2 × 2 × 3.375×10⁻⁴ / 0.031) = 0.209 m/s

v_attack_combo = v_orbital + Δv_spring_partial = 1.103 + 0.209 = 1.312 m/s

Δω = η × m × v_attack_combo × r_contact / I_AD
   = 0.55 × 0.031 × 1.312 × 0.020 / 1.900×10⁻⁵
   = 0.55 × (8.134×10⁻⁴) / 1.900×10⁻⁵
   = 0.55 × 42.81
   = +23.5 rad/s  ≈ +24 rad/s
```

(η = 0.55: Zephyr flat-contact spin reconversion at spring-release wall kick.) damageMultiplier **1.25×** from spring-boosted closing velocity above standard orbital.

**Parameters:**
- spinGain: +24 rad/s (Zephyr flat-contact spring-release reconversion η = 0.55)
- damageMultiplier: 1.25 (spring-boosted orbital strike above standard closing speed)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function stingRushCombo(bey: Beyblade, target: Beyblade): void {
  // Sting spring-release wall kick spin reconversion: Δω ≈ +24 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 24);
  // Spring-boosted approach: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +24 rad/s (partial) | ✓ |

---

## Case 1861 — GIMMICK: Galaxy Pegasus W105R2F — W105 Wing Aerodynamic Lift Platform & R2F Orbital Burst Drive

**Beyblade:** Galaxy Pegasus W105R2F (TT JP: ギャラクシーペガシスW105R2F; Hasbro EN: Galaxy Pegasus W105R2F)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Masters (BB-70)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Galaxy | 30.0 | 30.0 |
| Energy Ring | Pegasus II | 4.0 | 24.0 |
| Spin Track | W105 (Wing 105) | 2.5 | 20.0 |
| Performance Tip | R2F (Rubber Double Flat) | 2.0 | 6.0 |
| **Total** | | **38.5** | |

**I_total** = 30.0×10⁻³ × 0.030² + 4.0×10⁻³ × 0.024² + 2.5×10⁻³ × 0.020² + 2.0×10⁻³ × 0.006²
           = 2.700×10⁻⁵ + 2.304×10⁻⁶ + 1.000×10⁻⁶ + 7.20×10⁻⁸
           = **3.034×10⁻⁵ kg·m²**

ω₀ = 680 rad/s (standard MFB Metal Masters launch)
L₀ = I × ω₀ = 3.034×10⁻⁵ × 680 = **2.063×10⁻² kg·m²/s**

---

### 1. W105 Track — Wing Aerodynamic Lift Platform

Spin Track W105 carries two swept wing blades at r = 20 mm height, 105 mm track height. The wings generate upward aerodynamic lift as Galaxy Pegasus circles the stadium at orbital speed.

**Wing tip velocity and lift:**

```
v_wing = ω₀ × r_W105 = 680 × 0.020 = 13.60 m/s

A_wing = 5.0×10⁻³ × 15.0×10⁻³ = 7.5×10⁻⁵ m²  (single wing blade area)
C_L    = 0.55  (swept flat wing at track height)

F_lift_per_wing = ½ × ρ_air × C_L × A_wing × v_wing²
               = ½ × 1.225 × 0.55 × 7.5×10⁻⁵ × 13.60²
               = 5.243×10⁻³ N
```

**Total lift (2 active wings):**

```
F_lift_total = 2 × 5.243×10⁻³ = 1.049×10⁻² N

W = m × g = 0.0385 × 9.81 = 0.378 N

Lift / Weight = 1.049×10⁻² / 0.378 = 2.8%  (BeySpirit required for full liftoff)
```

**Orbital speed contribution from W105 wings:**

The wings also produce a small tangential thrust component (swept angle α = 20°):

```
F_thrust = F_lift_total × sin(20°) = 1.049×10⁻² × 0.342 = 3.588×10⁻³ N  (tangential)
a_orbital = F_thrust / m = 3.588×10⁻³ / 0.0385 = 0.0932 m/s²
v_orbital_gain (over 1 orbit, t_orbit ≈ 0.5s) = 0.0932 × 0.5 = 4.66×10⁻² m/s  (small boost)
```

---

### 2. R2F Tip — Rubber Double Flat Orbital Burst Drive

The R2F tip has a wide rubber double-flat surface (r_R2F = 6 mm, μ_rubber = 0.80) giving extremely aggressive orbital movement with rapid spin decay:

```
τ_R2F   = μ × m × g × r_R2F = 0.80 × 0.0385 × 9.81 × 0.006 = 1.817×10⁻³ N·m
t_spin  = L₀ / τ_R2F = 2.063×10⁻² / 1.817×10⁻³ = 11.4 s  (aggressive attack stamina)

v_orbital = μ_rubber × ω₀ × r_R2F = 0.80 × 680 × 0.006 = 3.264 m/s  (peak orbital velocity)
```

→ The R2F gives Galaxy Pegasus the highest orbital speed of any Pegasus variant — 3.264 m/s vs Storm Pegasus RF's 2.040 m/s (Case 1812). This is the momentum source for the Starbooster stadium circle and liftoff.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 38.5 g |
| I_total | 3.034×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| L₀ | 2.063×10⁻² kg·m²/s |
| v_wing | 13.60 m/s |
| F_lift_total | 1.049×10⁻² N |
| Lift / Weight | 2.8% |
| τ_R2F | 1.817×10⁻³ N·m |
| t_spin | 11.4 s |
| v_orbital | 3.264 m/s |

---

## Case 1862 — SPECIAL: Starbooster Attack / Stargazer — Gingka Hagane / Galaxy Pegasus W105R2F

**Blader:** Gingka Hagane | **Beyblade:** Galaxy Pegasus W105R2F | **Type:** attack

### Description

Starbooster Attack (Stargazer in Japan) is the first special move used by Gingka Hagane and Galaxy Pegasus W105R2F. Galaxy Pegasus circles around the stadium at full R2F orbital speed, building centripetal momentum. It then uses this accumulated orbital energy to take flight into the air, and crashes back down onto the opponent. Galaxy Pegasus has also used this move when knocked airborne by an opponent. The move is similar to Storm Pegasus's Starblast Attack but uses the W105 wing lift platform and higher R2F orbital speed.

### Stage 1 — Stadium Circle Momentum Build (from Case 1861)

R2F orbital speed: v_orbital = **3.264 m/s**. After N = 2 full orbits at r_arena = 0.200 m (stadium inner radius):

```
t_circle = 2 × (2π × r_arena / v_orbital) = 2 × (2π × 0.200 / 3.264) = 2 × 0.385 = 0.770 s

W105 wing lift over t_circle: F_lift × t_circle = 1.049×10⁻² × 0.770 = 8.078×10⁻³ N·s (upward impulse)
v_liftoff_assist = 8.078×10⁻³ / m = 8.078×10⁻³ / 0.0385 = 0.210 m/s  (wing-assisted liftoff v_z)
```

**Total liftoff velocity (orbital tangential converted to vertical + wing assist):**

```
η_liftoff = 0.35  (fraction of orbital KE convertible to vertical at R2F grip release)
v_z_orbital = η_liftoff × v_orbital = 0.35 × 3.264 = 1.142 m/s

v_z_total = v_z_orbital + v_liftoff_assist = 1.142 + 0.210 = 1.352 m/s
```

**Apex height:**

```
h_apex = v_z_total² / (2g) = 1.352² / (2 × 9.81) = 1.828 / 19.62 = 0.0932 m  ≈ 93 mm
```

### Stage 2 — Aerial Crash

**Dive impact velocity:**

```
v_impact = √(v_orbital² + 2g × h_apex)
         = √(3.264² + 2 × 9.81 × 0.0932)
         = √(10.65 + 1.829)
         = √12.48
         = 3.533 m/s
```

**Collision model (high-speed aerial orbital dive, e = 0.80):**

Parameters:
- m_GP = 38.5 g, v_impact = 3.533 m/s
- m_opp = 40 g (representative), v_opp ≈ 0

```
m_eff = (0.0385 × 0.040) / (0.0385 + 0.040) = 1.540×10⁻³ / 0.0785 = 1.962×10⁻² kg

J_booster = m_eff × (1 + e) × v_impact
          = 1.962×10⁻² × 1.80 × 3.533
          = 1.248×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_booster / m_opp = 1.248×10⁻¹ / 0.040 = 3.120 m/s
```

**Effect on Galaxy Pegasus (spin drain):**
```
Δω_GP    = J_booster × r_contact / I_GP = 1.248×10⁻¹ × 0.025 / 3.034×10⁻⁵ = 102.8 rad/s
ω_remain = 680 − 102.8 = 577.2 rad/s  (84.9% retained)
```

---

**[M] BeySpirit amplification:**
Gingka channels Pegasus's full celestial spirit — the stadium circle becomes a spiral galaxy orbit that launches Pegasus as a star-speed projectile.

[M] factor = **8.0 ×**
[M] Δv = 3.120 × 8.0 = **24.96 m/s** (ring-out at star velocity)

> **Note:** Physical values describe W105 wing aerodynamic lift-assisted liftoff, R2F orbital momentum conversion, and aerial dive impulse. [M] values represent Gingka's BeySpirit Pegasus star-launch that transcends orbital mechanics. Combos do not receive [M] amplification.

### TypeScript

```typescript
function starboosterAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Stadium circle: v_orbital = 3.264 m/s; h_apex = 93 mm → v_impact = 3.533 m/s
  // Physical J_booster = 1.248×10⁻¹ N·s; [M] 8.0×
  const J_phys = 0.1248;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Pegasus star velocity)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the W105 Spin Track (Wing 105) combined with an R2F or equivalent high-friction rubber flat driver that produces orbital speed ≥ 3 m/s. The W105 wing lift assist requires the wing blades to be at track height 105 to generate measurable upward impulse during the stadium circle. Standard game instance: Galaxy Pegasus W105R2F (Gingka Hagane, Metal Masters). Without W105 the wing-assisted liftoff component is absent; without R2F the orbital speed needed to convert to sufficient apex height for the full crash impulse is absent.

---

## Case 1863 — COMBO: Orbit Crash — Galaxy Pegasus

**Sequence:** ↑ → A (moveUp · moveRight · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The upward arc (↑) sends Galaxy Pegasus into a high orbital sweep, building momentum at R2F speed (v_orbital = 3.264 m/s × fraction, estimated 2.2 m/s at partial orbit completion). The rightward redirect (→) converts the upward arc tangential velocity into a rightward approach vector — this represents Galaxy Pegasus redirecting its circular path toward the opponent. The attack (A) delivers the orbital strike at the redirected velocity:

```
v_attack_combo = √(v_up² + v_right²) = √(2.2² + 2.2²) / √2 = 2.2 m/s  (resultant diagonal)

Δω = η × m_GP × v_attack_combo × r_contact / I_GP
   = 0.50 × 0.0385 × 2.2 × 0.025 / 3.034×10⁻⁵
   = 0.50 × (2.118×10⁻³) / 3.034×10⁻⁵
   = 0.50 × 69.8
   = +34.9 rad/s  ≈ +35 rad/s
```

(η = 0.50: R2F rubber contact orbital-to-spin momentum reconversion at arc redirect.) The orbital approach angle from two arcs raises the damageMultiplier to **1.35×** from combined directional momentum.

**Parameters:**
- spinGain: +35 rad/s (R2F rubber orbital-to-spin arc redirect reconversion η = 0.50)
- damageMultiplier: 1.35 (combined ↑→ arc approach directional momentum)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function orbitCrashCombo(bey: Beyblade, target: Beyblade): void {
  // R2F rubber arc redirect spin reconversion: Δω ≈ +35 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 35);
  // Combined arc approach: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +35 rad/s (partial) | ✓ |

---

## Case 1864 — GIMMICK(2): Storm Pegasus 105RF — RF Tip Orbital-to-Liftoff Aerodynamic Launch

**Beyblade:** Storm Pegasus 105RF (TT JP: ストームペガシス105RF; Hasbro EN: Storm Pegasus 105RF)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Fusion (BB-28)

> **GIMMICK(1)** — Storm Pegasus orbital vortex, Rankine vortex model, and RF tip orbital mechanics are documented in **Case 1812**. This GIMMICK(2) focuses specifically on the RF tip's orbital-to-liftoff aerodynamic transition that enables Starblast Attack.

### Assembly (reference)

Storm Pegasus 105RF: m = 37.0 g, I_total = 2.783×10⁻⁵ kg·m², ω₀ = 680 rad/s, L₀ = 1.892×10⁻² kg·m²/s (from Case 1812).

---

### RF Tip — Orbital-to-Vertical Liftoff Aerodynamics

At peak orbital speed, the RF (Rubber Flat) tip provides v_orbital = 2.040 m/s (from Case 1812). When Storm Pegasus reaches the stadium wall or receives an upward impact, the orbital velocity vector is redirected vertically.

**Vertical velocity at liftoff (η_launch = 0.30: RF grip-release liftoff efficiency):**

```
v_z = η_launch × v_orbital = 0.30 × 2.040 = 0.612 m/s
```

**Additional vertical velocity from external upward strike (opponent knock-up):**

When the opponent's attack hits Storm Pegasus upward (J_up ≈ 2.0×10⁻² N·s):

```
v_z_strike = J_up / m = 2.0×10⁻² / 0.037 = 0.541 m/s

v_z_total = v_z + v_z_strike = 0.612 + 0.541 = 1.153 m/s  (knock-up assisted liftoff)
```

**Apex height (self-launch only):**

```
h_apex_self = v_z² / (2g) = 0.612² / (2 × 9.81) = 0.3745 / 19.62 = 19.1 mm
```

**Apex height (knock-up assisted):**

```
h_apex_knockup = v_z_total² / (2g) = 1.153² / (2 × 9.81) = 1.329 / 19.62 = 67.8 mm
```

→ Storm Pegasus can initiate Starblast Attack voluntarily (self-launch, h ≈ 19 mm) or via opponent knock-up (h ≈ 68 mm for a harder dive).

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| v_orbital | 2.040 m/s (from Case 1812) |
| η_launch | 0.30 |
| v_z (self) | 0.612 m/s |
| h_apex (self) | 19.1 mm |
| v_z (knock-up) | 1.153 m/s |
| h_apex (knock-up) | 67.8 mm |

---

## Case 1865 — SPECIAL: Starblast Attack / Shooting Star Attack — Gingka Hagane / Storm Pegasus 105RF

**Blader:** Gingka Hagane | **Beyblade:** Storm Pegasus 105RF (also used with Cosmic Pegasus F:D) | **Type:** attack

### Description

Starblast Attack (Shooting Star Attack in Japan) is the first special move used by Gingka Hagane. In the anime it was used with Storm Pegasus 105RF and later with Cosmic Pegasus F:D. In the manga it was used with Pegasis 105F and Storm Pegasis 10Glaive Quick'. Pegasus soars into the sky voluntarily or launched by the opponent's own attack, then crashes directly onto the opponent in a nose dive. This is Gingka's signature move throughout Beyblade Metal Fusion.

### Stage 1 — Liftoff (from Case 1864)

Self-launch: h_apex = **19.1 mm**, v_z = 0.612 m/s.
Knock-up variant: h_apex = **67.8 mm**, v_z = 1.153 m/s.

**Dive impact velocity (self-launch):**

```
v_impact_self = √(v_orbital² + 2g × h_apex_self)
              = √(2.040² + 2 × 9.81 × 0.0191)
              = √(4.162 + 0.375)
              = √4.537
              = 2.130 m/s
```

**Dive impact velocity (knock-up variant):**

```
v_impact_knockup = √(v_orbital² + 2g × h_apex_knockup)
                 = √(2.040² + 2 × 9.81 × 0.0678)
                 = √(4.162 + 1.331)
                 = √5.493
                 = 2.344 m/s
```

### Stage 2 — Nose Dive Crash

**Collision model (nose dive, e = 0.80 — using knock-up variant as primary):**

Parameters:
- m_SP = 37.0 g, v_impact = 2.344 m/s
- m_opp = 38 g, v_opp ≈ 0

```
m_eff = (0.037 × 0.038) / (0.037 + 0.038) = 1.406×10⁻³ / 0.075 = 1.875×10⁻² kg

J_starblast = m_eff × (1 + e) × v_impact
            = 1.875×10⁻² × 1.80 × 2.344
            = 7.901×10⁻² N·s
```

**Self-launch variant (v_impact = 2.130 m/s):**

```
J_starblast_self = 1.875×10⁻² × 1.80 × 2.130 = 7.189×10⁻² N·s
```

**Effect on opponent (knock-up variant):**
```
Δv_opp  = J_starblast / m_opp = 7.901×10⁻² / 0.038 = 2.079 m/s
```

**Effect on Storm Pegasus (spin drain):**
```
Δω_SP    = J_starblast × r_contact / I_SP = 7.901×10⁻² × 0.025 / 2.783×10⁻⁵ = 71.0 rad/s
ω_remain = 680 − 71.0 = 609.0 rad/s  (89.6% retained)
```

---

**[M] BeySpirit amplification:**
Gingka channels Pegasus's blazing star spirit — the dive becomes a shooting star that burns through the opponent with the full force of a falling celestial body.

[M] factor = **7.0 ×**
[M] Δv = 2.079 × 7.0 = **14.6 m/s** (ring-out as shooting star)

> **Note:** Physical values describe RF tip orbital-to-vertical liftoff, self-launch and knock-up variant apex heights, and nose-dive collision impulse. [M] values represent Gingka's BeySpirit shooting-star force that overwhelms normal collision limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function starblastAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Nose dive: h_apex = 67.8 mm (knock-up) → v_impact = 2.344 m/s
  // Physical J_starblast = 7.901×10⁻² N·s; [M] 7.0×
  const J_phys = 0.07901;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (shooting star)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the RF (Rubber Flat) driver or equivalent high-grip rubber flat tip with orbital speed ≥ 1.8 m/s. The liftoff mechanic requires sufficient orbital velocity for the η_launch × v_orbital vertical component to achieve measurable apex height; the knock-up variant is available to any bey that can redirect an upward impact force. Standard game instance: Storm Pegasus 105RF (Gingka Hagane, Metal Fusion). Also compatible: Cosmic Pegasus F:D (Metal Fury — same blader, same move; F:D driver provides comparable orbital velocity). The nose-dive crash impulse depends primarily on v_impact at the liftoff height achieved; higher v_orbital (Galaxy Pegasus R2F in Case 1862) gives a harder version of the same move.

---

## Case 1866 — COMBO: Star Dive — Storm Pegasus

**Sequence:** ↑ A ↓ (moveUp · attack · moveDown)
**Cost:** 15 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The upward arc (↑) initiates the self-launch liftoff — Storm Pegasus redirects orbital momentum vertically (v_z = 0.612 m/s, h_apex = 19.1 mm). The attack (A) at apex fires the nose dive, using self-launch impact velocity (v_impact_self = 2.130 m/s). The downward exit (↓) represents Storm Pegasus driving the landing — RF rubber ground contact at the dive end converts the residual downward velocity back to spin:

```
v_land = √(2g × h_apex_self) = √(2 × 9.81 × 0.0191) = 0.612 m/s  (terminal at apex self-launch)

Δω = η × m_SP × v_land × r_contact / I_SP
   = 0.55 × 0.037 × 0.612 × 0.025 / 2.783×10⁻⁵
   = 0.55 × (5.661×10⁻⁴) / 2.783×10⁻⁵
   = 0.55 × 20.34
   = +11.2 rad/s  ≈ +11 rad/s
```

(η = 0.55: RF rubber landing-impact spin reconversion.) The self-launch nose dive angle (straight vertical: θ = 90°) gives pure downward impulse on the opponent, boosting damageMultiplier to **1.20×** from the added vertical strike vector.

**Parameters:**
- spinGain: +11 rad/s (RF rubber landing-impact spin reconversion η = 0.55)
- damageMultiplier: 1.20 (vertical nose-dive impact vector)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function starDiveCombo(bey: Beyblade, target: Beyblade): void {
  // RF rubber landing spin reconversion: Δω ≈ +11 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 11);
  // Vertical nose dive: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +11 rad/s (partial) | ✓ |



> **Note:** Cases 1867–1873 reserved — CS9 HMS session conflict #8 (CS9 wrote Round Shell MS at 1865–1868 and Samurai Changer MS at 1869–1873 in concurrent sessions; CS15 Cases 1865–1866 overlap with Round Shell MS blocks). Cases 1874–1876 continue from Case 1866 (Star Dive).

---

## Case 1874 — GIMMICK(2): Galaxy Pegasus W105R2F — R2F Warm-Up Friction Increase & Space-Launch Altitude

**Beyblade:** Galaxy Pegasus W105R2F (TT JP: ギャラクシーペガシスW105R2F; Hasbro EN: Galaxy Pegasus W105R2F)
**Blader:** Gingka Hagane | **Series:** Beyblade: Metal Masters (BB-70)

> **GIMMICK(1)** — W105 wing aerodynamic lift, R2F baseline orbital mechanics, and Starbooster Attack liftoff physics are documented in **Cases 1861–1862**. This GIMMICK(2) focuses on the physical change that enables Stardust Driver: the R2F tip requires arena run-in time before reaching full friction, and only after this warm-up can Galaxy Pegasus achieve the orbit speed needed to launch into space.

### Assembly (reference — from Case 1861)

Galaxy Pegasus W105R2F: m = 38.5 g, I_total = 3.034×10⁻⁵ kg·m², ω₀ = 680 rad/s, L₀ = 2.063×10⁻² kg·m²/s, W105 F_lift = 1.049×10⁻² N.

---

### 1. R2F Warm-Up Friction Increase

The R2F (Rubber Double Flat) tip uses a wide rubber surface. Rubber friction is temperature-dependent: cold rubber is relatively stiff and loses grip energy to elastic hysteresis, while warmed rubber is softer and achieves maximum grip. Gingka's "perfect control" and Gingka mastering the R2F is specifically about giving the tip time to adjust in the arena before reaching full power — the R2F needs continuous arena contact to warm up before it can deliver its maximum orbital velocity.

**Frictional power dissipated in R2F rubber (at ω₀, cold μ):**

```
P_heat = τ_R2F_cold × ω₀ = (μ_cold × m × g × r_R2F) × ω₀
       = (0.80 × 0.0385 × 9.81 × 0.006) × 680
       = 1.817×10⁻³ × 680 = 1.236 W
```

**Warm-up period (4 cold-speed stadium circles):**

```
t_warmup = 4 × (2π × r_arena / v_orbital_cold) = 4 × (2π × 0.200 / 3.264) = 1.538 s

ΔQ_warmup = P_heat × t_warmup = 1.236 × 1.538 = 1.901 J
```

After ΔQ_warmup = 1.9 J of frictional heat input, the R2F rubber reaches operating temperature — friction coefficient rises from μ_cold to μ_warm:

```
μ_R2F_cold = 0.80  (standard, first 1–2 circuits)
μ_R2F_warm = 0.95  (after t_warmup; thermally softened rubber — optimal grip)

Δμ = +0.15  (+18.75% friction gain from thermal warm-up)

v_orbital_warm = μ_warm × ω₀ × r_R2F = 0.95 × 680 × 0.006 = 3.878 m/s
(vs v_orbital_cold = 3.264 m/s — Stardust Driver runs at +18.75% higher orbital speed)
```

→ Starbooster Attack launches before warm-up completes (2 cold circles, μ = 0.80). Stardust Driver waits for full warm-up (4 circles, μ = 0.95) — this is the physical reason for the 4-circle extended spiral.

---

### 2. Extended Warm-Up Spiral — Wing Lift Accumulation

Wing lift accumulated over the full warm-up period (at conservative cold-speed timing):

```
v_z_wing_extended = F_lift_total × t_warmup / m = 1.049×10⁻² × 1.538 / 0.0385 = 0.419 m/s
(vs Starbooster v_z_wing = 0.210 m/s at 2-circle cold spiral)
```

**Mastered liftoff efficiency (warm rubber gives better floor grip → better vertical push):**

```
η_mastered = 0.50  (vs η_standard = 0.35 at Starbooster Attack)

v_z_orbital_warm = η_mastered × v_orbital_warm = 0.50 × 3.878 = 1.939 m/s

v_z_total = v_z_orbital_warm + v_z_wing_extended = 1.939 + 0.419 = 2.358 m/s

h_apex_stardust = v_z_total² / (2g) = 2.358² / (2 × 9.81) = 5.560 / 19.62 = 0.2834 m  ≈ 283 mm
```

### Comparison Summary

| Quantity | Starbooster Attack (Case 1862) | Stardust Driver |
|---------|-------------------------------|-----------------|
| N circles | 2 | 4 |
| t_spiral | 0.770 s | 1.538 s |
| μ_R2F at liftoff | 0.80 (cold) | 0.95 (warm) |
| v_orbital at liftoff | 3.264 m/s | 3.878 m/s |
| v_z_wing | 0.210 m/s | 0.419 m/s |
| η_liftoff | 0.35 | 0.50 |
| v_z_orbital | 1.142 m/s | 1.939 m/s |
| v_z_total | 1.352 m/s | 2.358 m/s |
| h_apex | 93 mm | **283 mm** |

---

## Case 1875 — SPECIAL: Stardust Driver / Star Dust Driver — Gingka Hagane / Galaxy Pegasus W105R2F

**Blader:** Gingka Hagane | **Beyblade:** Galaxy Pegasus W105R2F | **Type:** attack

### Description

Stardust Driver (星塵蹴, Sutādasuto Doraibā) is the second Special Move used by Gingka Hagane and Galaxy Pegasus W105R2F. After gaining perfect control over Galaxy Pegasus's R2F tip — meaning the rubber has been given sufficient arena run-in time to reach full grip — Galaxy Pegasus increases its orbital speed and executes four full stadium circles to build maximum warm-rubber momentum. It then launches into space far higher than Starbooster Attack, and crashes back down with full force. Stardust Driver was developed specifically for opponents who could withstand Starbooster Attack: it defeated Julian Konzern (Gravity Destroyer's Black Excalibur) and Damian Hart (Hades Kerbecs' Hades Gate) when Starbooster Attack proved insufficient.

### Stage 1 — R2F Warm-Up Extended Spiral & Liftoff (from Case 1874)

μ_R2F_warm = 0.95, v_orbital_warm = 3.878 m/s, v_z_total = 2.358 m/s, h_apex = **283 mm**.

### Stage 2 — Space-Altitude Crash

**Dive impact velocity:**

```
v_impact = √(v_orbital_warm² + 2g × h_apex)
         = √(3.878² + 2 × 9.81 × 0.2834)
         = √(15.039 + 5.560)
         = √20.599
         = 4.539 m/s
```

**Collision model (warm-rubber full-speed space dive, e = 0.80):**

Parameters:
- m_GP = 38.5 g, v_impact = 4.539 m/s
- m_opp = 40 g, v_opp ≈ 0

```
m_eff = (0.0385 × 0.040) / (0.0385 + 0.040) = 1.540×10⁻³ / 0.0785 = 1.962×10⁻² kg

J_stardust = m_eff × (1 + e) × v_impact
           = 1.962×10⁻² × 1.80 × 4.539
           = 1.602×10⁻¹ N·s
```

**Effect on opponent:**
```
Δv_opp  = J_stardust / m_opp = 1.602×10⁻¹ / 0.040 = 4.005 m/s
(vs Starbooster Δv = 3.120 m/s — Stardust Driver is 28.4% stronger at physical level)
```

**Effect on Galaxy Pegasus (spin drain):**
```
Δω_GP    = J_stardust × r_contact / I_GP = 1.602×10⁻¹ × 0.025 / 3.034×10⁻⁵ = 132.0 rad/s
ω_remain = 680 − 132.0 = 548.0 rad/s  (80.6% retained)
```

---

**[M] BeySpirit amplification:**
Gingka's fully mastered spirit drives Galaxy Pegasus beyond the atmosphere — it returns as a genuine falling star with interstellar impact force.

[M] factor = **9.0 ×**
[M] Δv = 4.005 × 9.0 = **36.0 m/s** (star-speed ring-out)

> **Note:** Physical values describe R2F rubber warm-up friction gain (μ: 0.80→0.95, ΔQ = 1.901 J), doubled wing-lift accumulation over 4-circuit warm-up, warm orbital speed 3.878 m/s, and space-altitude dive impulse at h = 283 mm. [M] values represent Gingka's fully mastered Pegasus star spirit that transcends all orbital limits. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stardustDriverSpecial(bey: Beyblade, target: Beyblade): void {
  // R2F warm-up: μ→0.95, 4 circles, η_mastered=0.50 → h_apex=283mm → v_impact=4.539 m/s
  // Physical J_stardust = 1.602×10⁻¹ N·s; [M] 9.0×
  const J_phys = 0.1602;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 9.0; // [M] BeySpirit 9.0× (star-speed warm-rubber mastered crash)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the W105 Spin Track and R2F driver where the blader can allow the rubber tip sufficient arena run-in time to reach warm-grip state (t_warmup ≥ 1.538 s, ΔQ ≥ 1.9 J). The move requires the full 4-circuit warm-up spiral to reach μ_R2F_warm = 0.95; attempting it cold (Starbooster Attack) delivers only μ = 0.80 and h_apex = 93 mm. Standard game instance: Galaxy Pegasus W105R2F (Gingka Hagane, Metal Masters). This is an evolution of Starbooster Attack (Case 1862) — the same physical frame, but executed only after full R2F warm-up.

---

## Case 1876 — COMBO: Dust Rush — Galaxy Pegasus

**Sequence:** E ↑ A (dodge · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Gingka Hagane

### Physics Justification

The dodge (E) represents Galaxy Pegasus pulling into a tighter inner arc using cold-R2F grip (no warm-up in combo context — quick attack sequence): v_orbital = μ_cold × ω₀ × r = 3.264 m/s. The moveUp (↑) initiates a partial liftoff at η_combo = 0.25 (50% of Stardust's full η_mastered = 0.50):

```
v_z_combo = η_combo × v_orbital_cold = 0.25 × 3.264 = 0.816 m/s
h_combo   = v_z_combo² / (2g) = 0.816² / (2 × 9.81) = 0.6660 / 19.62 = 33.9 mm
```

The attack (A) fires the partial aerial dive at the end of the arc:

```
v_impact_combo = √(v_orbital_cold² + 2g × h_combo)
               = √(3.264² + 2 × 9.81 × 0.0339)
               = √(10.653 + 0.665)
               = √11.318
               = 3.364 m/s

Δω = η_land × m_GP × v_impact_combo × r_contact / I_GP
   = 0.30 × 0.0385 × 3.364 × 0.025 / 3.034×10⁻⁵
   = 0.30 × (3.237×10⁻³) / 3.034×10⁻⁵
   = 0.30 × 106.7
   = +32.0 rad/s  ≈ +32 rad/s
```

(η_land = 0.30: cold-R2F rubber re-contact at partial-height landing. Cold tip used since no warm-up in combo timeframe.) The partial cold-launch liftoff at 33.9 mm gives damageMultiplier **1.25×**.

**Parameters:**
- spinGain: +32 rad/s (cold R2F rubber landing reconversion η_land = 0.30, h_combo = 33.9 mm)
- damageMultiplier: 1.25 (partial cold liftoff aerial orbital strike)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function dustRushCombo(bey: Beyblade, target: Beyblade): void {
  // Cold R2F partial liftoff landing reconversion: Δω ≈ +32 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 32);
  // Partial cold aerial dive: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +32 rad/s (partial) | ✓ |



---

## Case 1877 — GIMMICK: Grand Capricorn 145D — Horn Tip Contact Pressure & Red Tornado Vortex

**Beyblade:** Grand Capricorn 145D (TT JP: グランドカプリコーンD; Hasbro EN: Grand Capricorn 145D)
**Blader:** Klaus | **Series:** Beyblade: Metal Masters (BB-73)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Fusion Wheel | Grand | 35.0 | 31.0 |
| Energy Ring | Capricorn | 4.0 | 24.0 |
| Spin Track | 145 | 1.5 | 6.0 |
| Performance Tip | D (Defense) | 1.0 | 5.0 |
| **Total** | | **41.5** | |

**I_total** = 35.0×10⁻³ × 0.031² + 4.0×10⁻³ × 0.024² + 1.5×10⁻³ × 0.006² + 1.0×10⁻³ × 0.005²
           = 3.364×10⁻⁵ + 2.304×10⁻⁶ + 5.4×10⁻⁸ + 2.5×10⁻⁸
           = **3.602×10⁻⁵ kg·m²**

ω₀ = 680 rad/s (standard MFB Metal Masters launch)
L₀ = I × ω₀ = 3.602×10⁻⁵ × 680 = **2.449×10⁻² kg·m²/s**

---

### 1. Grand AR — Horn Tip Velocity & Near-Yield Contact Pressure

The Grand Fusion Wheel's two large curved horn protrusions extend to r_AR = 31 mm. At ω₀ the horn tips sweep at:

```
v_horn_tip = ω₀ × r_AR = 680 × 0.031 = 21.08 m/s
```

**Horn tip contact stress (during direct strike):**

The horn section constitutes approximately 10% of the AR mass:

```
m_horn = 0.10 × m_AR = 0.10 × 35.0×10⁻³ = 3.5×10⁻³ kg

Contact duration (horn width w_horn = 4 mm sweeping at v_tip):
Δt_horn = w_horn / v_tip = 4×10⁻³ / 21.08 = 1.897×10⁻⁴ s

Impact impulse (e_horn = 0.60 — stiff ABS horn):
J_horn = m_horn × (1 + e_horn) × v_tip = 3.5×10⁻³ × 1.60 × 21.08 = 0.1181 N·s

Peak contact force:
F_horn_peak = J_horn / Δt_horn = 0.1181 / 1.897×10⁻⁴ = 622.6 N

Horn tip contact area:
A_horn = 4×10⁻³ × 3×10⁻³ = 1.2×10⁻⁵ m²

Contact stress:
P_horn = F_horn_peak / A_horn = 622.6 / 1.2×10⁻⁵ = 51.9 MPa
(ABS yield strength σ_y ≈ 55 MPa → P / σ_y = 0.94× — near-yield, "seemingly metallic" feel)
```

→ Grand Capricorn's horn tips apply sub-yield elastic contact stress that feels metallic — the horn doesn't pierce (unlike Falborg 2 at 5.03× yield, Case 1821) but creates high-energy elastic deformation on the opponent's AR surface.

---

### 2. Red Tornado Vortex (Rankine Model)

The spinning horn profile generates a broad vortex wake at radius r_AR. Using the Rankine circulation model:

```
Γ_bey = 2π × v_horn_tip × r_AR = 2π × 21.08 × 0.031 = 4.108 m²/s

At opponent position r_opp = 45 mm from centre:
v_vortex = Γ_bey / (2π × r_opp) = 4.108 / (2π × 0.045) = 14.54 m/s

Dynamic pressure at r_opp:
q_vortex = ½ × ρ_air × v_vortex² = ½ × 1.225 × 14.54² = 129.4 Pa
```

**Radial suction force on opponent (inward, toward Grand Capricorn):**

```
A_opp = π × r_opp_cross² = π × 0.020² = 1.257×10⁻³ m²
F_vortex = q_vortex × A_opp = 129.4 × 1.257×10⁻³ = 0.1627 N  (inward suction)
```

→ This is the "red tornado" — a sustained inward suction force that gradually draws opponents toward Grand Capricorn's horn strike range.

---

### 3. D Tip — Wide Defense Gyroscopic Platform

The Defense tip provides a wide plastic contact base (r_D = 5 mm, μ_D = 0.15) with low friction:

```
τ_D    = μ_D × m × g × r_D = 0.15 × 0.0415 × 9.81 × 0.005 = 3.053×10⁻⁴ N·m
t_spin = L₀ / τ_D = 2.449×10⁻² / 3.053×10⁻⁴ = 80.2 s

v_D_orbital = μ_D × ω₀ × r_D = 0.15 × 680 × 0.005 = 0.510 m/s  (slow, stable patrol orbit)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.5 g |
| I_total | 3.602×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| L₀ | 2.449×10⁻² kg·m²/s |
| v_horn_tip | 21.08 m/s |
| P_horn | 51.9 MPa (0.94× ABS yield) |
| Γ_bey | 4.108 m²/s |
| v_vortex (r=45 mm) | 14.54 m/s |
| q_vortex | 129.4 Pa |
| F_vortex (suction) | 0.1627 N |
| τ_D | 3.053×10⁻⁴ N·m |
| t_spin | 80.2 s |

---

## Case 1878 — SPECIAL: Steel Darkness / Eisenschwarz — Klaus / Grand Capricorn 145D

**Blader:** Klaus | **Beyblade:** Grand Capricorn 145D | **Type:** attack

### Description

Steel Darkness (Eisenschwarz, アイゼンシュヴァルツ) is the second Special Move used by Klaus and Grand Capricorn 145D. Capricorn jerks its head forward in order to bend its seemingly metallic horns so that the sharp ends point forward, then rams into the opponent while covered in a red tornado. The red tornado shrouds Grand Capricorn and creates a sustained suction vortex that draws the opponent inward before the horn strike is delivered at point-blank range.

### Stage 1 — Red Tornado Suction Draw (from Case 1877)

F_vortex = 0.1627 N (inward). Opponent drawn from r = 45 mm to horn contact at r = 31 mm (Δr = 14 mm):

```
W_suction = F_vortex × Δr = 0.1627 × 0.014 = 2.278×10⁻³ J

v_approach = √(2 × W_suction / m_opp) = √(2 × 2.278×10⁻³ / 0.038) = √(0.1199) = 0.346 m/s
```

### Stage 2 — Horn Ram at Point-Blank Range

Grand Capricorn's D-tip orbital velocity and the opponent's suction-driven approach combine at contact:

```
v_rel = v_D_orbital + v_approach = 0.510 + 0.346 = 0.856 m/s
```

**Collision model (horn tip strike, e = 0.75):**

Parameters:
- m_GC = 41.5 g, v_GC = 0.510 m/s
- m_opp = 38 g, v_opp = −0.346 m/s (approaching)

```
m_eff = (0.0415 × 0.038) / (0.0415 + 0.038) = 1.577×10⁻³ / 0.0795 = 1.983×10⁻² kg

J_steel = m_eff × (1 + e) × v_rel = 1.983×10⁻² × 1.75 × 0.856 = 2.970×10⁻² N·s
```

**Effect on opponent:**
```
Δv_opp  = J_steel / m_opp = 2.970×10⁻² / 0.038 = 0.782 m/s
```

**Effect on Grand Capricorn (spin drain — minimal; D tip absorbs recoil):**
```
Δω_GC    = J_steel × r_contact / I_GC = 2.970×10⁻² × 0.025 / 3.602×10⁻⁵ = 20.6 rad/s
ω_remain = 680 − 20.6 = 659.4 rad/s  (97.0% retained)
```

---

**[M] BeySpirit amplification:**
Klaus channels the iron darkness of Capricorn's bull spirit — the horns physically reshape under BeySpirit force (angular→linear momentum redirection: Δv_kick = m_horn × v_tip / m_total = 3.5×10⁻³ × 21.08 / 0.0415 = 1.78 m/s) and the tornado becomes a true steel vortex that tears through anything in its path.

[M] factor = **7.0 ×**
[M] Δv = 0.782 × 7.0 = **5.5 m/s** (ring-out, steel darkness ring-out)

> **Note:** Physical values describe red tornado vortex suction draw, combined D-orbital + suction-approach relative velocity, and near-yield horn tip contact mechanics. [M] values represent Klaus's BeySpirit horn reorientation (angular momentum converted to linear kick, 1.78 m/s boost) amplified by the iron bull darkness spirit. Combos do not receive [M] amplification.

### TypeScript

```typescript
function steelDarknessSpecial(bey: Beyblade, target: Beyblade): void {
  // Red tornado suction: F=0.1627 N, draws opponent 14mm → v_approach=0.346 m/s
  // Horn ram v_rel=0.856 m/s, J_steel=2.970×10⁻² N·s; [M] 7.0×
  const J_phys = 0.02970;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Stage 1: suction pull toward bey
  applyForce(target.id, -(dx / dist) * 0.1627, -(dy / dist) * 0.1627);
  // Stage 2: horn ram — [M] 7.0×
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (iron darkness horn snap)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Grand Fusion Wheel (or equivalent large-diameter defense wheel with prominent horn protrusions at r ≥ 28 mm) combined with a D (Defense) or equivalent low-friction wide-base tip for stable patrol orbit during vortex formation. The red tornado requires horn tip velocity v_tip ≥ 18 m/s to generate sufficient Rankine circulation for inward suction. Standard game instance: Grand Capricorn 145D (Klaus, Metal Masters).

---

## Case 1879 — COMBO: Iron Ram — Grand Capricorn

**Sequence:** K E K (defense · dodge · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Klaus

### Physics Justification

The first defense stance (K) activates Grand Capricorn's vortex field for a partial dwell window (t_suction = 0.10 s), drawing the opponent inward:

```
J_suction_partial = F_vortex × t_suction = 0.1627 × 0.10 = 1.627×10⁻² N·s

v_approach_partial = J_suction_partial / m_opp = 1.627×10⁻² / 0.038 = 0.428 m/s  (opponent pulled in)
```

The dodge (E) represents Grand Capricorn's short angular pivot — the D tip steps into the opponent's closing path, converting the combined approach velocity to a point-blank contact:

```
v_contact = v_D_orbital + v_approach_partial = 0.510 + 0.428 = 0.938 m/s
```

The second defense stance (K) is the D-tip ground re-contact after the brief pivot, reconverting the rebound force back to spin:

```
Δω = η × m_GC × v_contact × r_contact / I_GC
   = 0.50 × 0.0415 × 0.938 × 0.025 / 3.602×10⁻⁵
   = 0.50 × (9.732×10⁻⁴) / 3.602×10⁻⁵
   = 0.50 × 27.01
   = +13.5 rad/s  ≈ +14 rad/s
```

(η = 0.50: D tip wide-contact spin reconversion after partial vortex ram pivot.) The vortex-assisted approach with horn contact gives damageMultiplier **1.20×**. lockMs = 150 represents the suction dwell window during the K stance.

**Parameters:**
- spinGain: +14 rad/s (D tip rebound spin reconversion η = 0.50)
- damageMultiplier: 1.20 (vortex-assisted approach point-blank horn contact)
- lockMs: 150 (suction vortex dwell during K₁ defense stance)

### TypeScript

```typescript
function ironRamCombo(bey: Beyblade, target: Beyblade): void {
  // D tip rebound reconversion: Δω ≈ +14 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 14);
  // Vortex-assisted approach: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 150: suction vortex dwell
  bey.lockMs = 150;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +14 rad/s (partial) | ✓ |



---

## Case 1880 — GIMMICK: Dragoon Storm — Upper Dragoon Blade Lift & Vertical Vortex Column

**Beyblade:** Dragoon Storm (TT JP: ドラグーンストーム; Hasbro EN: Dragoon Storm)
**Blader:** Tyson Granger | **Series:** Beyblade (Bakuten Shoot, Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Upper Dragoon (4-blade) | 14.0 | 32.0 |
| Weight Disk | 10 Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | SG Sharp | 2.0 | 3.0 |
| **Total** | | **37.5** | |

(Bit Chip Dragoon ~1 g at r ≈ 0 excluded per convention.)

**I_total** = 14.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.434×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 1.8×10⁻⁸
           = **3.657×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (standard plastic-gen Bakuten Shoot launch)
L₀ = I × ω₀ = 3.657×10⁻⁵ × 700 = **2.560×10⁻² kg·m²/s**

---

### 1. Upper Dragoon AR — Four-Blade Upward Lift & Vortex Column Formation

The Upper Dragoon Attack Ring carries four upward-angled blades. As Dragoon spins, these blades act as rotor elements — generating upward aerodynamic lift (like helicopter rotor blades) and driving a vertical vortex column (landspout) above the stadium.

**Blade tip velocity:**

```
v_blade = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s
```

**Aerodynamic lift per blade (upward-angled, C_L = 0.65):**

```
A_blade = 4×10⁻³ × 15×10⁻³ = 6.0×10⁻⁵ m²  (single blade area)

F_lift_blade = ½ × ρ_air × C_L × A_blade × v_blade²
             = ½ × 1.225 × 0.65 × 6.0×10⁻⁵ × 22.40²
             = 1.199×10⁻² N

F_lift_total (4 blades) = 4 × 1.199×10⁻² = 4.796×10⁻² N

W = m × g = 0.0375 × 9.81 = 0.368 N

Lift / Weight = 4.796×10⁻² / 0.368 = 13.0%  (measurable rotor effect; BeySpirit for full vortex)
```

**Vertical vortex column (Rankine circulation model):**

```
Γ_vortex = 2π × v_blade × r_AR = 2π × 22.40 × 0.032 = 4.500 m²/s

At r_opp = 50 mm from centre:
v_column = Γ_vortex / (2π × r_opp) = 4.500 / (2π × 0.050) = 14.32 m/s  (tangential wind speed)

q_column = ½ × ρ_air × v_column² = ½ × 1.225 × 14.32² = 125.8 Pa
```

**Upward ejection force on opponent:**

```
A_opp = π × 0.020² = 1.257×10⁻³ m²
F_eject = q_column × A_opp = 125.8 × 1.257×10⁻³ = 0.1582 N  (upward)
```

**Defensive barrier force** (opposing any bey moving radially through the vortex column):

```
F_barrier = F_eject = 0.1582 N  (opposes inward approach at the vortex wall)
```

→ The vortex column simultaneously ejects opponents upward AND presents a radial pressure barrier against incoming attacks.

---

### 2. SG Sharp BB — Stationary Vortex Platform

The Sharp Blade Base contacts the arena at a single point (r_sharp = 3 mm, μ_sharp = 0.08). This allows Dragoon to sustain a nearly stationary spin for the duration of Storm Attack:

```
τ_sharp = μ × m × g × r_sharp = 0.08 × 0.0375 × 9.81 × 0.003 = 8.831×10⁻⁵ N·m
t_spin   = L₀ / τ_sharp = 2.560×10⁻² / 8.831×10⁻⁵ = 290.1 s
```

→ The sharp tip provides near-frictionless ground contact, allowing Dragoon to remain stationary in the stadium centre while the Upper Dragoon AR generates the vortex column. This is the physical mechanism behind Storm Attack's "decreases mobility" effect.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.5 g |
| I_total | 3.657×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.560×10⁻² kg·m²/s |
| v_blade | 22.40 m/s |
| F_lift_total | 4.796×10⁻² N |
| Lift / Weight | 13.0% |
| Γ_vortex | 4.500 m²/s |
| v_column (r=50 mm) | 14.32 m/s |
| q_column | 125.8 Pa |
| F_eject / F_barrier | 0.1582 N |
| τ_sharp | 8.831×10⁻⁵ N·m |
| t_spin | 290.1 s |

---

## Case 1881 — SPECIAL: Storm Attack — Tyson Granger / Dragoon Storm

**Blader:** Tyson Granger | **Beyblade:** Dragoon Storm | **Type:** defense

### Description

Storm Attack is a Special Move used by Tyson Granger and Dragoon Storm. Dragoon generates a rapidly rotating column of air — a tornado similar to a landspout — using the four upward-angled blades of the Upper Dragoon AR at high-speed rotation. The vortex column forms a defensive barrier between Dragoon and the enemy Beyblade, repelling incoming attacks. In most instances the column then ejects opponents skyward. This action usually decreases the mobility of Dragoon (even becoming stationary) while Storm Attack is in effect, as all rotational energy is directed into the vortex. The move occurs together with the emergence of the Bit-Beast Dragoon. It was used in both the manga and anime.

### Stage 1 — Vortex Barrier (Defensive Interception)

When an opponent approaches through the vortex column, F_barrier = 0.1582 N opposes their movement over the vortex wall depth Δr_wall = 20 mm:

```
W_absorbed = F_barrier × Δr_wall = 0.1582 × 0.020 = 3.164×10⁻³ J

v_attack_post = √(v_attack² − 2 × W_absorbed / m_opp)
              = √(2.0² − 2 × 3.164×10⁻³ / 0.038)
              = √(4.000 − 0.1665)
              = √3.834 = 1.958 m/s  (attack speed reduced by 2.1% at vortex wall)
```

→ The barrier effect is modest at physical level; BeySpirit amplifies it to a full deflection.

### Stage 2 — Upward Ejection

The vortex column sustains F_eject = 0.1582 N upward on the opponent for t_vortex = 0.5 s:

```
J_eject = F_eject × t_vortex = 0.1582 × 0.5 = 7.910×10⁻² N·s

Δv_opp_up = J_eject / m_opp = 7.910×10⁻² / 0.038 = 2.082 m/s  (upward ring-out)
```

**Effect on Dragoon Storm (spin drain — sustained vortex):**
```
Δω_DS    = J_eject × r_contact / I_DS = 7.910×10⁻² × 0.025 / 3.657×10⁻⁵ = 54.1 rad/s
ω_remain = 700 − 54.1 = 645.9 rad/s  (92.3% retained)
```

---

**[M] BeySpirit amplification:**
Dragoon's beast materialises fully from the Bit Chip, transforming the physical vortex into a true elemental storm. The tornado column expands to fill the entire stadium, ejecting everything in its path.

[M] factor = **8.0 ×**
[M] Δv = 2.082 × 8.0 = **16.7 m/s** (full-stadium storm ejection)

> **Note:** Physical values describe Upper Dragoon four-blade rotor lift, Rankine vortex column ejection at F = 0.1582 N over 0.5 s, and 2.1% barrier attenuation of incoming attack. [M] values represent Dragoon's full BeySpirit materialisation that amplifies the vortex to elemental storm scale. Combos do not receive [M] amplification.

### TypeScript

```typescript
function stormAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Vortex column: F_eject=0.1582 N × 0.5s → J_eject=7.910×10⁻² N·s upward; [M] 8.0×
  const J_phys = 0.07910;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Barrier: partial opposing force on incoming target
  applyForce(target.id, (dx / dist) * -0.1582, (dy / dist) * -0.1582);
  // Vortex ejection — [M] 8.0×
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Dragoon full storm materialisation)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using an Attack Ring with 4+ upward-angled blade protrusions (C_L ≥ 0.50, v_blade ≥ 20 m/s) combined with a Sharp or Metal Sharp Blade Base that enables near-stationary spin. The vortex column requires the bey to remain stationary (or near-stationary) while generating circulation — any high-orbital-speed tip would dissipate the column. Standard game instance: Dragoon Storm (Tyson Granger, Bakuten Shoot plastic generation).

---

## Case 1882 — COMBO: Tornado Guard — Dragoon Storm

**Sequence:** K ↑ K (defense · moveUp · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Tyson Granger

### Physics Justification

The first defense stance (K) locks Dragoon on its sharp tip (near-stationary), initiating the vortex column for a partial window (t_partial = 0.15 s):

```
J_eject_partial = F_eject × t_partial = 0.1582 × 0.15 = 2.373×10⁻² N·s
```

The moveUp (↑) represents a partial orbital arc away from the opponent — Dragoon briefly shifts position in the stadium, redirecting the vortex column exit direction while the vortex energy accumulates. The second defense stance (K) returns Dragoon to stationary, releasing the accumulated partial vortex as a directed upward blast, while the sharp tip re-contact reconverts the reaction force to spin:

```
Δω = η × J_eject_partial × r_contact / I_DS
   = 0.60 × 2.373×10⁻² × 0.025 / 3.657×10⁻⁵
   = 0.60 × (5.933×10⁻⁴) / 3.657×10⁻⁵
   = 0.60 × 16.22
   = +9.7 rad/s  ≈ +10 rad/s
```

(η = 0.60: sharp tip point-contact vortex counter-reaction spin reconversion.) The directed partial vortex blast gives damageMultiplier **1.20×**. lockMs = 250 represents the stationary vortex column dwell spanning K₁ and ↑ inputs.

**Parameters:**
- spinGain: +10 rad/s (sharp tip vortex counter-reaction reconversion η = 0.60)
- damageMultiplier: 1.20 (directed partial vortex upward blast)
- lockMs: 250 (stationary column dwell K₁ + ↑ phase)

### TypeScript

```typescript
function tornadoGuardCombo(bey: Beyblade, target: Beyblade): void {
  // Sharp tip vortex counter-reaction reconversion: Δω ≈ +10 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 10);
  // Directed partial vortex blast: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 250: stationary column dwell
  bey.lockMs = 250;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 250 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +10 rad/s (partial) | ✓ |



---

## Case 1883 — GIMMICK: Flash Leopard — Aerodynamic Drag Heating & Hot Wind Vortex

**Beyblade:** Flash Leopard (TT JP: フラッシュレオパルド; Hasbro EN: Flash Leopard)
**Blader:** Ozuma | **Series:** Beyblade (Bakuten Shoot V-Force, Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Flash Leopard (4-blade) | 14.0 | 32.0 |
| Weight Disk | 10 Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | SG Flat | 2.5 | 5.0 |
| **Total** | | **38.0** | |

(Bit Chip ~1 g at r ≈ 0 excluded per convention.)

**I_total** = 14.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.5×10⁻³ × 0.005²
           = 1.434×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 6.25×10⁻⁸
           = **3.680×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (standard plastic-gen Bakuten Shoot launch)
L₀ = I × ω₀ = 3.680×10⁻⁵ × 700 = **2.576×10⁻² kg·m²/s**

---

### 1. Flash Leopard AR — Aerodynamic Drag Dissipation (Primary Heat Source)

The Flash Leopard Attack Ring carries four angular blade protrusions. At high-speed rotation these blades sweep through air at v_tip; skin-friction and pressure drag on each blade are almost entirely dissipated as thermal energy in the ABS plastic — heating the AR from within, causing the surrounding air to circulate as a hot wind vortex.

**Blade tip velocity:**

```
v_tip = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s
```

**Aerodynamic drag on 4 blades (C_D = 1.2, A_blade = 4×10⁻³ × 15×10⁻³ = 6.0×10⁻⁵ m²):**

```
F_drag = ½ × ρ_air × C_D × n_blades × A_blade × v_tip²
       = ½ × 1.225 × 1.2 × 4 × 6.0×10⁻⁵ × 22.40²
       = ½ × 1.225 × 1.2 × 2.4×10⁻⁴ × 501.76
       = 0.08851 N

P_aero = F_drag × v_tip = 0.08851 × 22.40 = 1.983 W  (dissipated as heat into AR)
```

---

### 2. SG Flat BB — Frictional Heat Generation & Orbital Speed

The Flat Blade Base contacts the arena over a wide surface (r_flat = 5 mm, μ_flat = 0.15), driving orbital motion and adding a secondary heat source:

```
τ_flat = μ × m × g × r_flat = 0.15 × 0.038 × 9.81 × 0.005 = 2.796×10⁻⁴ N·m
P_fric = τ_flat × ω₀ = 2.796×10⁻⁴ × 700 = 0.1957 W
t_spin = L₀ / τ_flat = 2.576×10⁻² / 2.796×10⁻⁴ = 92.1 s
v_orbital = μ × ω₀ × r_flat = 0.15 × 700 × 0.005 = 0.5250 m/s
```

**Total heat generation rate:**

```
P_heat = P_aero + P_fric = 1.983 + 0.1957 = 2.179 W
```

**AR temperature rise over t_buildup = 5 s (Sacred Fire activation window):**

```
Q_heat  = P_heat × t_buildup = 2.179 × 5 = 10.89 J
ΔT_AR   = Q_heat / (m_AR × c_ABS) = 10.89 / (0.014 × 1400) = 0.556 K
(physical; ABS ignition ≈ 370°C; BeySpirit amplifies to true fire temperature)
```

---

### 3. Hot Wind Vortex (Rankine Model)

The spinning Flash Leopard AR drives a Rankine vortex of heated air:

```
Γ_vortex = 2π × v_tip × r_AR = 2π × 22.40 × 0.032 = 4.500 m²/s

At r_opp = 50 mm from centre:
v_wind   = Γ_vortex / (2π × r_opp) = 4.500 / (2π × 0.050) = 14.32 m/s

q_wind   = ½ × ρ_air × v_wind² = ½ × 1.225 × 14.32² = 125.7 Pa

A_opp    = π × 0.020² = 1.257×10⁻³ m²
F_wind   = q_wind × A_opp = 125.7 × 1.257×10⁻³ = 0.1580 N  (radially outward — hot wind repulsion)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 38.0 g |
| I_total | 3.680×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.576×10⁻² kg·m²/s |
| v_tip | 22.40 m/s |
| P_aero | 1.983 W |
| P_fric | 0.1957 W |
| P_heat | 2.179 W |
| ΔT_AR (5 s) | 0.556 K |
| Γ_vortex | 4.500 m²/s |
| v_wind (r=50 mm) | 14.32 m/s |
| q_wind | 125.7 Pa |
| F_wind | 0.1580 N |
| τ_flat | 2.796×10⁻⁴ N·m |
| t_spin | 92.1 s |
| v_orbital | 0.5250 m/s |

---

## Case 1884 — SPECIAL: Sacred Fire — Ozuma / Flash Leopard

**Blader:** Ozuma | **Beyblade:** Flash Leopard | **Type:** attack

### Description

Sacred Fire is a Special Move used by Ozuma and his Flash Leopard. The beyblade heats up — driven by aerodynamic drag dissipation across the Flash Leopard AR blades (P_aero = 1.983 W) — causing hot winds to blow from the Rankine vortex. Upon contact the thermally-primed AR can melt the opponent's beyblade plastics. The hot wind vortex acts as both a repulsion field that pushes opponents outward and a thermal transfer medium, while the heated AR delivers a direct fire contact on impact.

### Stage 1 — Hot Wind Vortex Blast

Flash Leopard's vortex exerts F_wind = 0.1580 N outward on the opponent for t_blast = 0.5 s:

```
J_wind      = F_wind × t_blast = 0.1580 × 0.5 = 7.900×10⁻² N·s

Δv_opp_wind = J_wind / m_opp = 7.900×10⁻² / 0.038 = 2.079 m/s  (outward repulsion)
```

### Stage 2 — Heated AR Flat-Base Contact

Flash Leopard's SG Flat drives orbital approach at v_orbital = 0.5250 m/s. Thermally-primed AR contacts opponent (e = 0.65 — ABS-on-ABS with thermal softening factor):

```
m_eff = (0.038 × 0.038) / (0.038 + 0.038) = 1.444×10⁻³ / 0.076 = 1.900×10⁻² kg

J_sacred = m_eff × (1 + e) × v_orbital
         = 1.900×10⁻² × 1.65 × 0.5250
         = 1.646×10⁻² N·s

Δv_opp_contact = J_sacred / m_opp = 1.646×10⁻² / 0.038 = 0.433 m/s
```

**Total physical Δv on opponent:**

```
Δv_total = Δv_wind + Δv_contact = 2.079 + 0.433 = 2.512 m/s
```

**Effect on Flash Leopard (spin drain — flat tip orbital strike):**

```
Δω_FL    = J_sacred × r_contact / I_FL = 1.646×10⁻² × 0.025 / 3.680×10⁻⁵ = 11.2 rad/s
ω_remain = 700 − 11.2 = 688.8 rad/s  (98.4% retained)
```

---

**[M] BeySpirit amplification:**
Ozuma's Leopard spirit materialises from the Bit Chip, transmuting the modest 0.556 K physical heat rise into true elemental sacred fire — the AR ignites with plasma-level temperature and the hot wind vortex becomes a real fire storm.

[M] factor = **7.0 ×**
[M] Δv = 2.079 × 7.0 = **14.6 m/s** (sacred fire plasma ring-out)

> **Note:** Physical values describe aerodynamic drag heating (P_aero = 1.983 W, P_heat = 2.179 W total, ΔT_AR = 0.556 K over 5 s), hot wind vortex ejection at F = 0.1580 N over 0.5 s (J_wind = 7.900×10⁻² N·s, Δv_wind = 2.079 m/s), and flat-base orbital contact impulse (J = 1.646×10⁻² N·s, Δv_total = 2.512 m/s). [M] values represent Ozuma's Leopard BeySpirit transmuting aerodynamic heat into sacred fire plasma. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sacredFireSpecial(bey: Beyblade, target: Beyblade): void {
  // P_aero=1.983W→AR heating; hot wind vortex J_wind=7.900×10⁻²N·s; AR contact J=1.646×10⁻²N·s; [M] 7.0×
  const J_wind = 0.07900;
  const J_contact = 0.01646;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Stage 1: heated AR flat-base contact (physical)
  applyForce(target.id, (dx / dist) * J_contact, (dy / dist) * J_contact);
  // Stage 2: sacred fire plasma blast — [M] 7.0×
  const amplified = J_wind * 7.0; // [M] BeySpirit 7.0× (Ozuma Leopard sacred fire plasma)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using an Attack Ring with 4+ angular blade protrusions generating sufficient aerodynamic drag (P_aero ≥ 1.5 W at ω₀ ≥ 680 rad/s) combined with a Flat or Semi-Flat Blade Base (μ ≥ 0.12, r_tip ≥ 4 mm) that sustains continuous frictional heat generation and orbital movement. The hot wind vortex requires ongoing orbital motion to continuously refresh the Rankine circulation — a stationary bey dissipates the vortex. Standard game instance: Flash Leopard (Ozuma, Bakuten Shoot V-Force plastic generation).

---

## Case 1885 — COMBO: Ember Strike — Flash Leopard

**Sequence:** A K A (attack · defense · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Ozuma

### Physics Justification

The first attack (A) is an initial orbital contact at v_orbital = 0.5250 m/s, delivering the first flat-base impulse:

```
J_contact_1 = m_eff × (1 + e) × v_orbital = 1.900×10⁻² × 1.65 × 0.5250 = 1.646×10⁻² N·s
```

The defense stance (K) represents Flash Leopard pausing near the opponent, allowing the heated AR to dwell at maximum thermal output (t_lock = 150 ms):

```
ΔQ_lock  = P_heat × t_lock = 2.179 × 0.150 = 0.327 J
ΔT_lock  = 0.327 / (0.014 × 1400) = 0.0167 K  (physical AR pre-heating increment)
```

The second attack (A) re-engages with the thermally-primed AR at the same orbital speed. The flat base elastic rebound from the first contact reconverts partial impulse to spin:

```
Δω = η × (J_contact_1 + J_contact_2) × r_contact / I_FL
   = 0.40 × 2 × 1.646×10⁻² × 0.025 / 3.680×10⁻⁵
   = 0.40 × 3.292×10⁻² × 0.025 / 3.680×10⁻⁵
   = 0.40 × 8.230×10⁻⁴ / 3.680×10⁻⁵
   = 0.40 × 22.36
   = +8.94 rad/s  ≈ +9 rad/s
```

(η = 0.40: SG Flat elastic rebound reconversion over two-contact sequence.) The double orbital strike with thermal dwell gives damageMultiplier **1.20×**. lockMs = 150 represents the AR thermal dwell window between contacts.

**Parameters:**
- spinGain: +9 rad/s (SG Flat double orbital rebound η = 0.40)
- damageMultiplier: 1.20 (double orbital strike with thermal AR dwell)
- lockMs: 150 (AR thermal dwell window between contacts)

### TypeScript

```typescript
function emberStrikeCombo(bey: Beyblade, target: Beyblade): void {
  // SG Flat double orbital rebound reconversion: Δω ≈ +9 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 9);
  // Double orbital strike with thermal dwell: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 150: AR thermal dwell between contacts
  bey.lockMs = 150;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +9 rad/s (partial) | ✓ |



---

## Case 1886 — GIMMICK: Salvage Valtryek Shot-7 — Shot Driver Spring Jump & Salvage Blade Dual Rubber-Metal Contact

**Beyblade:** Salvage Valtryek Shot-7 (TT JP: セイバーヴァルキリー・ショット7; Hasbro EN: Salvage Valtryek Shot-7)
**Blader:** Valt Aoi / Rashad Goodman | **Series:** Beyblade Burst DB (Dynamite Battle)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Blade | Salvage (3 metal + 3 rubber blades) | 16.0 | 28.0 |
| DB Core | Valtryek | 7.5 | 12.0 |
| Armor | (standard DB Armor) | 13.5 | 18.0 |
| Ratchet | 7-60 | 18.0 | 22.0 |
| Driver | Shot | 6.0 | 5.0 |
| **Total** | | **61.0** | |

**I_total** = 16.0×10⁻³ × 0.028² + 7.5×10⁻³ × 0.012² + 13.5×10⁻³ × 0.018² + 18.0×10⁻³ × 0.022² + 6.0×10⁻³ × 0.005²
           = 1.254×10⁻⁵ + 1.080×10⁻⁶ + 4.374×10⁻⁶ + 8.712×10⁻⁶ + 1.50×10⁻⁷
           = **2.686×10⁻⁵ kg·m²**

ω₀ = 680 rad/s (Burst DB standard launch)
L₀ = I × ω₀ = 2.686×10⁻⁵ × 680 = **1.826×10⁻² kg·m²/s**

---

### 1. Shot Driver — Spring-Loaded Jump Mechanism

The Shot driver contains a rubber-tipped spring mechanism that compresses on floor contact and releases as a vertical impulse:

```
k_spring = 800 N/m,  x_compress = 5 mm = 0.005 m

PE_spring = ½ × k × x² = ½ × 800 × (0.005)² = 1.000×10⁻² J

v_z_jump = √(2 × PE_spring / m) = √(2 × 1.000×10⁻² / 0.061) = √(0.3279) = 0.573 m/s

h_jump = v_z_jump² / (2g) = (0.573)² / (2 × 9.81) = 0.3283 / 19.62 = 16.7 mm
```

Shot driver orbital speed (μ_shot = 0.20, r_shot = 5 mm):

```
v_orbital = μ_shot × ω₀ × r_shot = 0.20 × 680 × 0.005 = 0.680 m/s
τ_shot    = μ × m × g × r_shot = 0.20 × 0.061 × 9.81 × 0.005 = 5.984×10⁻⁴ N·m
t_spin    = L₀ / τ_shot = 1.826×10⁻² / 5.984×10⁻⁴ = 30.5 s
```

**Combined impact velocity (orbital approach + spring jump liftoff):**

```
v_impact = √(v_orbital² + 2g × h_jump) = √(0.680² + 2 × 9.81 × 0.01673)
         = √(0.4624 + 0.3283) = √0.7907 = 0.889 m/s
```

---

### 2. Salvage Blade — Dual Rubber-Metal Blade Contact (Whip Mechanic)

The Salvage Blade carries **3 metal blades** (hard smash) and **3 red rubber blades** (grip-and-snap whip):

**Blade tip velocity:**

```
v_blade_tip = ω₀ × r_blade = 680 × 0.028 = 19.04 m/s
```

**Contact restitution model:**
- Metal blades: e_metal = 0.75 (rigid elastic smash)
- Rubber blades: e_rubber = 0.50 (snap-back whip — rubber grips, deforms, then releases, returning energy above simple rubber damping)

```
e_eff = (3 × e_metal + 3 × e_rubber) / 6
      = (3 × 0.75 + 3 × 0.50) / 6 = (2.25 + 1.50) / 6 = 0.625
```

→ The rubber blade whip snap raises effective restitution beyond simple rubber contact, amplifying the total impulse delivered.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 61.0 g |
| I_total | 2.686×10⁻⁵ kg·m² |
| ω₀ | 680 rad/s |
| L₀ | 1.826×10⁻² kg·m²/s |
| v_blade_tip | 19.04 m/s |
| PE_spring | 1.000×10⁻² J |
| v_z_jump | 0.573 m/s |
| h_jump | 16.7 mm |
| v_orbital | 0.680 m/s |
| v_impact | 0.889 m/s |
| e_eff | 0.625 |
| τ_shot | 5.984×10⁻⁴ N·m |
| t_spin | 30.5 s |

---

## Case 1887 — SPECIAL: Salvage Whip (Savior Slash) — Valt Aoi / Rashad Goodman / Salvage Valtryek Shot-7

**Blader:** Valt Aoi / Rashad Goodman | **Beyblade:** Salvage Valtryek Shot-7 | **Type:** attack

### Description

Salvage Whip (Japanese: Savior Slash, セイバースラッシュ) is a Special Move used by both Valt Aoi and Rashad Goodman with their respective Salvage Valtryek Shot-7 Beyblades. Utilizing the speed built up with the Shot Driver and its spring-loaded jump feature, Salvage Valtryek launches into an aerial approach and strikes the opposing Beyblade simultaneously with the three hard metal blades and the three red rubber snap-whip blades on the Salvage Blade, dealing massive combined smash and whip damage.

### Stage — Shot Jump Aerial 6-Blade Strike

From Case 1886: v_impact = 0.889 m/s (orbital + spring jump), e_eff = 0.625 (3 metal + 3 rubber whip).

```
m_eff = (m_SV × m_opp) / (m_SV + m_opp) = (0.061 × 0.040) / (0.061 + 0.040)
      = 2.440×10⁻³ / 0.101 = 2.416×10⁻² kg

J_salvage = m_eff × (1 + e_eff) × v_impact
          = 2.416×10⁻² × 1.625 × 0.889
          = 2.416×10⁻² × 1.4446 = 3.490×10⁻² N·s

Δv_opp  = J_salvage / m_opp = 3.490×10⁻² / 0.040 = 0.873 m/s
```

**Effect on Salvage Valtryek (spin drain):**

```
Δω_SV    = J_salvage × r_contact / I_SV = 3.490×10⁻² × 0.025 / 2.686×10⁻⁵ = 32.5 rad/s
ω_remain = 680 − 32.5 = 647.5 rad/s  (95.2% retained)
```

---

**[M] BeySpirit amplification:**
Valt and Rashad's dual Valtryek spirits converge — when both bladers use Salvage Whip simultaneously the two Salvage Valtryek spiral into each other's approach vector, transforming the rubber whip blades into energy-absorbing lashes that drain the opponent's spin while the metal blades deliver the knockout blow.

[M] factor = **8.0 ×** (co-blader dual-spirit amplification)
[M] Δv = 0.873 × 8.0 = **7.0 m/s** (dual Savior Slash ring-out)

> **Note:** Physical values describe Shot driver spring jump (PE=1.000×10⁻² J, h_jump=16.7 mm, v_impact=0.889 m/s), combined metal smash + rubber whip e_eff=0.625, impulse J=3.490×10⁻² N·s. [M] values represent Valt and Rashad's co-blader Valtryek spirit fusion amplifying the whip into a simultaneous dual Savior Slash. Combos do not receive [M] amplification.

### TypeScript

```typescript
function salvageWhipSpecial(bey: Beyblade, target: Beyblade): void {
  // Shot spring PE=1.000×10⁻²J→h=16.7mm→v_impact=0.889m/s; e_eff=0.625 (3 metal+3 rubber); J=3.490×10⁻²N·s; [M] 8.0×
  const J_phys = 0.03490;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Valt+Rashad co-blader dual Valtryek)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Salvage Blade (or equivalent layer with 3+ metal blades and 3+ rubber snap-whip blades at r ≥ 26 mm) combined with the Shot Driver (or equivalent spring-loaded rubber jump driver, k ≥ 600 N/m, x ≥ 4 mm) that delivers a spring jump h ≥ 12 mm for the aerial approach. Standard game instances: Salvage Valtryek Shot-7 (Valt Aoi and Rashad Goodman, Burst DB).

---

## Case 1888 — COMBO: Salvage Rush — Salvage Valtryek

**Sequence:** A ↑ A (attack · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Valt Aoi / Rashad Goodman

### Physics Justification

The first attack (A) is an initial orbital contact at v_orbital = 0.680 m/s:

```
J_contact_1 = m_eff × (1 + e_eff) × v_orbital = 2.416×10⁻² × 1.625 × 0.680
            = 2.416×10⁻² × 1.1050 = 2.670×10⁻² N·s
```

The moveUp (↑) activates the Shot driver spring jump (h = 16.7 mm, v_z = 0.573 m/s), elevating Salvage Valtryek for the aerial follow-up.

The second attack (A) fires the aerial 6-blade dive at v_impact = 0.889 m/s. The Shot driver rubber tip's spring rebound on landing reconverts the landing impulse to spin:

```
J_contact_2 = J_salvage = 3.490×10⁻² N·s  (from Case 1887)

Δω = η_shot × J_contact_2 × r_contact / I_SV
   = 0.35 × 3.490×10⁻² × 0.025 / 2.686×10⁻⁵
   = 0.35 × 8.725×10⁻⁴ / 2.686×10⁻⁵
   = 0.35 × 32.48
   = +11.4 rad/s  ≈ +11 rad/s
```

(η_shot = 0.35: Shot driver rubber spring-rebound reconversion at landing.) The aerial jump + 6-blade simultaneous dive gives damageMultiplier **1.25×**. lockMs = 0 (pure attack, no lock phase).

**Parameters:**
- spinGain: +11 rad/s (Shot driver rubber spring rebound η = 0.35)
- damageMultiplier: 1.25 (aerial 6-blade rubber-metal dive)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function salvageRushCombo(bey: Beyblade, target: Beyblade): void {
  // Shot driver spring rebound: Δω ≈ +11 rad/s (η=0.35, h_jump=16.7mm)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 11);
  // Aerial 6-blade dive: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +11 rad/s (partial) | ✓ |



---

## Case 1889 — GIMMICK: Wyborg — Sand Vortex Inward Suction & SG Hole Flat Attack Mode

**Beyblade:** Wyborg (TT JP: ワイバーグ; Hasbro EN: Wyborg)
**Blader:** Ian Papov | **Series:** Beyblade (Bakuten Shoot V-Force, Plastic Generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Wyborg (3-blade serpentine) | 14.0 | 32.0 |
| Weight Disk | 10 Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | SG Hole Flat (attack mode) | 2.0 | 5.0 |
| **Total** | | **37.5** | |

(Bit Chip ~1 g at r ≈ 0 excluded per convention. SG Hole Flat has a dual mode: initial sharp-tip defense mode switches to HF attack mode for Sand Bind execution.)

**I_total** = 14.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.005²
           = 1.434×10⁻⁵ + 2.205×10⁻⁵ + 3.5×10⁻⁷ + 5.0×10⁻⁸
           = **3.679×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (standard plastic-gen Bakuten Shoot launch)
L₀ = I × ω₀ = 3.679×10⁻⁵ × 700 = **2.575×10⁻² kg·m²/s**

---

### 1. Wyborg AR — Sand Vortex Inward Suction (Rankine Model)

The Wyborg AR blades at v_tip generate a Rankine vortex. Unlike Storm Attack (which uses the vortex for outward ejection), the Wyborg vortex rotates with an inward-directed suction effect — pulling opponents toward Wyborg's AR strike zone, binding their orbital freedom (Sand Bind).

**Blade tip velocity:**

```
v_tip = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s
```

**Sand vortex (Rankine):**

```
Γ_sand = 2π × v_tip × r_AR = 2π × 22.40 × 0.032 = 4.500 m²/s

At r_opp = 50 mm from centre:
v_sand  = Γ_sand / (2π × r_opp) = 4.500 / (2π × 0.050) = 14.32 m/s

q_sand  = ½ × ρ_air × v_sand² = ½ × 1.225 × 14.32² = 125.7 Pa
F_bind  = q_sand × A_opp = 125.7 × π × 0.020² = 125.7 × 1.257×10⁻³ = 0.1580 N  (inward — suction binding)
```

---

### 2. SG Hole Flat BB — High-Speed Attack Mode

The SG Hole Flat (attack mode) drives aggressive orbital movement (μ_HF = 0.35, r_HF = 5 mm):

```
τ_HF    = μ × m × g × r_HF = 0.35 × 0.0375 × 9.81 × 0.005 = 6.44×10⁻⁴ N·m
t_spin  = L₀ / τ_HF = 2.575×10⁻² / 6.44×10⁻⁴ = 40.0 s
v_orbital_HF = μ × ω₀ × r_HF = 0.35 × 700 × 0.005 = 1.225 m/s
```

(In defense/initial mode: sharp tip μ_sharp=0.08, r_sharp=3mm, τ_sharp=8.831×10⁻⁵ N·m — conserves spin before attack phase activation.)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.5 g |
| I_total | 3.679×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.575×10⁻² kg·m²/s |
| v_tip | 22.40 m/s |
| Γ_sand | 4.500 m²/s |
| v_sand (r=50 mm) | 14.32 m/s |
| F_bind | 0.1580 N (inward) |
| τ_HF | 6.44×10⁻⁴ N·m |
| t_spin (HF) | 40.0 s |
| v_orbital_HF | 1.225 m/s |

---

## Case 1890 — SPECIAL: Sand Bind — Ian Papov / Wyborg

**Blader:** Ian Papov | **Beyblade:** Wyborg | **Type:** attack

### Description

Sand Bind (Japanese: 砂蛇縛撃, Sa-ja-baku-geki — Sand-Snake Binding Strike) is a Special Move used by Ian Papov and Wyborg. Wyborg's Bit-Beast serpent manifests and coils around the opponent, restricting their movements via the sand vortex suction field. Wyborg then switches to its Hole Flat attack mode and attacks with high speed — the serpent's binding hold combined with the HF orbital speed drives the opponent out of the arena.

### Stage 1 — Sand Vortex Binding (Inward Suction Draw)

F_bind = 0.1580 N inward for t_bind = 0.20 s:

```
J_bind       = F_bind × t_bind = 0.1580 × 0.20 = 3.160×10⁻² N·s  (toward Wyborg)
v_approach   = J_bind / m_opp = 3.160×10⁻² / 0.038 = 0.832 m/s  (opponent drawn in)
```

### Stage 2 — SG HF High-Speed Contact Strike

Wyborg switches to HF attack mode: v_orbital_HF = 1.225 m/s. The opponent's suction-driven approach combines with Wyborg's orbital speed:

```
v_rel = v_orbital_HF + v_approach = 1.225 + 0.832 = 2.057 m/s

m_eff = (0.0375 × 0.038) / (0.0375 + 0.038) = 1.425×10⁻³ / 0.0755 = 1.887×10⁻² kg

J_sandbind = m_eff × (1 + e) × v_rel  [e = 0.60: rubber HF contact]
           = 1.887×10⁻² × 1.60 × 2.057
           = 6.210×10⁻² N·s

Δv_opp = J_sandbind / m_opp = 6.210×10⁻² / 0.038 = 1.634 m/s
```

**Effect on Wyborg (spin drain):**

```
Δω_W     = J_sandbind × r_contact / I_W = 6.210×10⁻² × 0.025 / 3.679×10⁻⁵ = 42.2 rad/s
ω_remain = 700 − 42.2 = 657.8 rad/s  (94.0% retained)
```

---

**[M] BeySpirit amplification:**
Ian's serpent Bit-Beast fully materialises — the sand tornado becomes a true desert sandstorm column that physically constricts the opponent like a coiling snake. The HF orbital strike at full [M] force drives them out of the arena.

[M] factor = **7.0 ×**
[M] Δv = 1.634 × 7.0 = **11.4 m/s** (serpent-bind ring-out)

> **Note:** Physical values describe sand vortex inward suction (F=0.1580 N, J_bind=3.160×10⁻² N·s, v_approach=0.832 m/s), HF orbital approach (v_orbital=1.225 m/s), combined v_rel=2.057 m/s, J_sandbind=6.210×10⁻² N·s, Δv=1.634 m/s. [M] values represent Ian's serpent spirit transmuting the sand suction into a true binding constriction. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sandBindSpecial(bey: Beyblade, target: Beyblade): void {
  // Sand vortex: F=0.1580N×0.2s→J_bind=3.160×10⁻²N·s inward; HF v_rel=2.057m/s→J=6.210×10⁻²N·s; [M] 7.0×
  const J_bind = 0.03160;
  const J_attack = 0.06210;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  // Stage 1: sand vortex inward pull (binding)
  applyForce(target.id, -(dx / dist) * J_bind, -(dy / dist) * J_bind);
  // Stage 2: HF attack — [M] 7.0×
  const amplified = J_attack * 7.0; // [M] BeySpirit 7.0× (Ian serpent sand bind strike)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using an AR with 3+ blade protrusions at r ≥ 30 mm (generating Rankine inward suction Γ ≥ 4.0 m²/s at ω₀ ≥ 680 rad/s) combined with a Hole Flat or Wide Flat Blade Base (μ_HF ≥ 0.30, r ≥ 4 mm) for the attack-mode high-speed orbital strike. Standard game instance: Wyborg (Ian Papov, Bakuten Shoot V-Force plastic generation).

---

## Case 1891 — COMBO: Sand Fang — Wyborg

**Sequence:** K A E (defense · attack · dodge)
**Cost:** 15 | **Type:** attack | **Blader:** Ian Papov

### Physics Justification

The defense stance (K) switches Wyborg to sharp-tip mode (μ_sharp=0.08, r=3mm, τ_sharp=8.831×10⁻⁵ N·m), conserving spin by reducing friction vs HF mode:

```
τ_saved  = τ_HF − τ_sharp = 6.44×10⁻⁴ − 8.831×10⁻⁵ = 5.557×10⁻⁴ N·m
Δω_saved = τ_saved × t_lock / I_W = 5.557×10⁻⁴ × 0.150 / 3.679×10⁻⁵ = 2.27 rad/s  (spin conserved)
```

The attack (A) activates the partial sand bind suction (t_partial = 0.10 s) then HF mode:

```
J_bind_partial = F_bind × t_partial = 0.1580 × 0.10 = 1.580×10⁻² N·s
v_approach_partial = 1.580×10⁻² / 0.038 = 0.416 m/s

v_rel_combo = v_orbital_HF + v_approach_partial = 1.225 + 0.416 = 1.641 m/s

J_combo = m_eff × (1 + e) × v_rel_combo = 1.887×10⁻² × 1.60 × 1.641 = 4.954×10⁻² N·s
```

The dodge (E) represents Wyborg darting away using HF orbital speed. The HF rubber rebound from the contact reconverts impulse to spin:

```
Δω_rebound = η_HF × J_combo × r_contact / I_W
           = 0.35 × 4.954×10⁻² × 0.025 / 3.679×10⁻⁵
           = 0.35 × 1.2385×10⁻³ / 3.679×10⁻⁵
           = 0.35 × 33.66
           = +11.78 rad/s

Total Δω = Δω_saved + Δω_rebound = 2.27 + 11.78 = +14.05 rad/s  ≈ +14 rad/s
```

(η_HF = 0.35: HF rubber rebound reconversion with partial sand-bind assisted approach.) lockMs = 150 (sharp-tip mode dwell during K stance). damageMultiplier **1.20×**.

**Parameters:**
- spinGain: +14 rad/s (mode-switch save + HF rubber rebound η = 0.35)
- damageMultiplier: 1.20 (partial sand-bind approach + HF contact)
- lockMs: 150 (sharp-tip spin conservation dwell)

### TypeScript

```typescript
function sandFangCombo(bey: Beyblade, target: Beyblade): void {
  // Mode-switch K saves Δω≈+2.3 rad/s; partial sand bind + HF rebound Δω≈+11.8 rad/s; total ≈+14 rad/s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 14);
  // Sand-assisted HF approach: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  // lockMs = 150: sharp-tip spin conservation window
  bey.lockMs = 150;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +14 rad/s (partial) | ✓ |



---

## Case 1892 — GIMMICK: Dark Gasher CH120SF — CH120 Height Extension & Six-Prong Upper-Level AR Contact

**Beyblade:** Dark Gasher CH120SF (TT JP: ダークガッシャーCH120SF; Hasbro EN: Dark Gasher CH120SF)
**Blader:** Tetsuya Watarigani | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Cancer/Gasher | 3.8 | 23.0 |
| Fusion Wheel | Dark | 30.0 | 28.0 |
| Spin Track | CH120 (at 145 mm extended) | 2.7 | 12.0 |
| Performance Tip | SF (Semi-Flat) | 0.8 | 4.0 |
| **Total** | | **37.3** | |

(Face Bolt ~1.4 g excluded per MFB convention.)

**I_total** = 30.0×10⁻³ × 0.028² + 3.8×10⁻³ × 0.023² + 2.7×10⁻³ × 0.012² + 0.8×10⁻³ × 0.004²
           = 2.352×10⁻⁵ + 2.010×10⁻⁶ + 3.888×10⁻⁷ + 1.28×10⁻⁸
           = **2.593×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Fusion standard launch)
L₀ = I × ω₀ = 2.593×10⁻⁵ × 650 = **1.685×10⁻² kg·m²/s**

---

### 1. CH120 Change Height Track — 120 mm → 145 mm Extension (+25 mm)

The CH120 (Change Height 120/145) Spin Track contains an inner sleeve that locks at two positions. Extending to 145 mm raises the entire beyblade body by Δh = 25 mm, lifting the Dark Fusion Wheel AR above the standard contact height of opponents using short tracks.

**Gravitational PE stored by CoM elevation:**

```
Δh_CH120 = 145 − 120 = 25 mm = 0.025 m

PE_CH = m × g × Δh_CH120 = 0.0373 × 9.81 × 0.025 = 9.141×10⁻³ J
```

When Dark Gasher tilts (pecks forward), this elevation converts to dive kinetic energy:

```
v_dive = √(2 × PE_CH / m) = √(2 × 9.141×10⁻³ / 0.0373) = √(0.4900) = 0.700 m/s
```

**Combined impact velocity (SF orbital + CH145 gravity dive):**

```
v_orbital_SF = μ_SF × ω₀ × r_SF = 0.12 × 650 × 0.004 = 0.312 m/s

v_impact = √(v_orbital_SF² + 2g × Δh_CH120)
         = √(0.312² + 2 × 9.81 × 0.025)
         = √(0.09734 + 0.49050)
         = √0.58784 = 0.767 m/s
```

---

### 2. Dark FW — Six-Prong Upper-Level AR Contacts (Six Crab Claw Pattern)

The Dark Fusion Wheel carries six contact protrusions arranged symmetrically (separated by 60° each). When Dark Gasher approaches at CH145 height, these six protrusions engage the opponent's AR from above — "as if six crabs are attacking with their claws" (one contact per prong per oscillation cycle).

**Prong tip velocity:**

```
v_prong = ω₀ × r_FW = 650 × 0.028 = 18.20 m/s
```

**SF tip physics:**

```
τ_SF   = μ_SF × m × g × r_SF = 0.12 × 0.0373 × 9.81 × 0.004 = 1.756×10⁻⁴ N·m
t_spin = L₀ / τ_SF = 1.685×10⁻² / 1.756×10⁻⁴ = 95.9 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.3 g |
| I_total | 2.593×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.685×10⁻² kg·m²/s |
| Δh_CH120 | 25 mm |
| PE_CH | 9.141×10⁻³ J |
| v_dive | 0.700 m/s |
| v_orbital_SF | 0.312 m/s |
| v_impact | 0.767 m/s |
| v_prong | 18.20 m/s |
| τ_SF | 1.756×10⁻⁴ N·m |
| t_spin | 95.9 s |

---

## Case 1893 — SPECIAL: Six Crab Shake — Tetsuya Watarigani / Dark Gasher CH120SF

**Blader:** Tetsuya Watarigani | **Beyblade:** Dark Gasher CH120SF | **Type:** attack

### Description

Six Crab Shake (Japanese: シックスクラブ・シェイキング, Shikkusu Kurabu Sheikingu) is a Special Move used by Tetsuya Watarigani and his Dark Gasher CH120SF. Gasher's track changes to 145mm height, raising the Dark Fusion Wheel above the opponent's AR contact zone. Gasher then pecks repeatedly at the opponent's beyblade from above — leaning into the Starblast Attack-style downward position — making it appear as if six crabs are simultaneously attacking the opposing bey with their claws.

### Six-Peck Upper Strike Sequence

The CH145 gravity dive gives v_impact = 0.767 m/s. All six prongs of the Dark FW deliver sequential peck contacts totalling the full impulse:

```
m_eff = (m_DG × m_opp) / (m_DG + m_opp) = (0.0373 × 0.038) / (0.0373 + 0.038)
      = 1.4174×10⁻³ / 0.0753 = 1.882×10⁻² kg

J_sixcrab = m_eff × (1 + e_prong) × v_impact  [e_prong = 0.70: hard ABS claw tips]
          = 1.882×10⁻² × 1.70 × 0.767
          = 1.882×10⁻² × 1.3039 = 2.454×10⁻² N·s

Δv_opp  = J_sixcrab / m_opp = 2.454×10⁻² / 0.038 = 0.646 m/s
```

**Impulse per individual peck contact (1 of 6):**

```
J_per_peck = J_sixcrab / 6 = 2.454×10⁻² / 6 = 4.090×10⁻³ N·s  (each claw contact)
```

**Effect on Dark Gasher (spin drain — CH145 dive reconversion):**

```
Δω_DG    = J_sixcrab × r_contact / I_DG = 2.454×10⁻² × 0.025 / 2.593×10⁻⁵ = 23.7 rad/s
ω_remain = 650 − 23.7 = 626.3 rad/s  (96.4% retained)
```

---

**[M] BeySpirit amplification:**
Tetsuya's Gasher Bit-Beast materialises as six giant crab claws simultaneously striking the opponent — the CH145 peck sequence transforms into a true multi-claw assault that overwhelms opponent defenses.

[M] factor = **6.0 ×** (thematically matching the six-claw count)
[M] Δv = 0.646 × 6.0 = **3.9 m/s** (six-claw ring-out)

> **Note:** Physical values describe CH120 extension Δh=25 mm raising PE_CH=9.141×10⁻³ J, gravity-dive v_impact=0.767 m/s, six-prong sequential peck total J=2.454×10⁻² N·s (4.090×10⁻³ N·s per prong), and Δv=0.646 m/s. [M] values represent Tetsuya's crab spirit manifesting six simultaneous giant claws. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sixCrabShakeSpecial(bey: Beyblade, target: Beyblade): void {
  // CH120→145: Δh=25mm→PE=9.141×10⁻³J; v_impact=0.767m/s; 6-prong J=2.454×10⁻²N·s; [M] 6.0×
  const J_phys = 0.02454;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 6.0; // [M] BeySpirit 6.0× (Tetsuya six crab claw materialisation)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the CH120 (or CH130/145) Change Height Spin Track that can extend to ≥145 mm combined with a Fusion Wheel carrying 6+ symmetric contact protrusions at r ≥ 26 mm. The height extension must raise the AR above the opponent's contact zone to enable top-down peck contacts. Standard game instance: Dark Gasher CH120SF (Tetsuya Watarigani, Metal Fusion).

---

## Case 1894 — COMBO: Crab Peck — Dark Gasher

**Sequence:** ↓ A A (moveDown · attack · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Tetsuya Watarigani

### Physics Justification

The moveDown (↓) represents Dark Gasher dropping into the CH145 elevated-peck position — CoM raised by 25 mm, v_dive = 0.700 m/s primed.

The first attack (A) fires a full CH145 peck at v_impact = 0.767 m/s:

```
J_peck_1 = m_eff × (1 + e_prong) × v_impact = 1.882×10⁻² × 1.70 × 0.767 = 2.454×10⁻² N·s
```

The second attack (A) fires a partial-height recovery peck (h₂ = Δh_CH120 × 0.50 = 12.5 mm):

```
v_impact_2 = √(v_orbital_SF² + 2g × h₂) = √(0.312² + 2 × 9.81 × 0.0125) = √(0.0973 + 0.2453) = 0.585 m/s

J_peck_2 = m_eff × (1 + e_prong) × v_impact_2 = 1.882×10⁻² × 1.70 × 0.585 = 1.871×10⁻² N·s
```

The SF tip elastic rebound reconverts the two-peck impulse to spin:

```
Δω = η × (J_peck_1 + J_peck_2) × r_contact / I_DG
   = 0.30 × (2.454×10⁻² + 1.871×10⁻²) × 0.025 / 2.593×10⁻⁵
   = 0.30 × 4.325×10⁻² × 0.025 / 2.593×10⁻⁵
   = 0.30 × 1.081×10⁻³ / 2.593×10⁻⁵
   = 0.30 × 41.7
   = +12.5 rad/s  ≈ +13 rad/s
```

(η = 0.30: SF semi-flat tip elastic rebound at partial-height double peck.) The double CH145-dive attack gives damageMultiplier **1.25×**. lockMs = 0 (pure attack).

**Parameters:**
- spinGain: +13 rad/s (SF double peck rebound η = 0.30)
- damageMultiplier: 1.25 (double CH145 gravity-dive peck from above)
- lockMs: 0 (pure attack)

### TypeScript

```typescript
function crabPeckCombo(bey: Beyblade, target: Beyblade): void {
  // SF double CH145 peck rebound: Δω ≈ +13 rad/s (η=0.30, J1=2.454×10⁻² + J2=1.871×10⁻²)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 13);
  // Double gravity dive peck from CH145: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +13 rad/s (partial) | ✓ |



---

## Case 1895 — GIMMICK: Ray Gasher M145Q — M145 Mid-Height Stabiliser & Q-Tip Rubber Bounce Drill

**Beyblade:** Ray Gasher M145Q (TT JP: レイガッシャーM145Q; Hasbro EN: Ray Gasher M145Q)
**Blader:** Enso Garcia / Selen | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Gasher | 3.8 | 23.0 |
| Fusion Wheel | Ray | 27.5 | 28.0 |
| Spin Track | M145 (Mid 145 mm) | 2.5 | 10.0 |
| Performance Tip | Q (Quake) | 1.2 | 3.5 |
| **Total** | | **35.0** | |

(Face Bolt ~1.4 g excluded per MFB convention.)

**I_total** = 27.5×10⁻³ × 0.028² + 3.8×10⁻³ × 0.023² + 2.5×10⁻³ × 0.010² + 1.2×10⁻³ × 0.0035²
           = 2.156×10⁻⁵ + 2.010×10⁻⁶ + 2.500×10⁻⁷ + 1.47×10⁻⁸
           = **2.383×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Fusion standard launch)
L₀ = I × ω₀ = 2.383×10⁻⁵ × 650 = **1.549×10⁻² kg·m²/s**

---

### 1. Q (Quake) Performance Tip — Rubber Bounce Drill Launch

The Q tip carries a hard rubber nub (μ_Q ≈ 0.20, r_Q = 3.5 mm) with a built-in spring-compressed rubber dome (k = 1200 N/m, x_compress = 6 mm = 0.006 m). On hard floor contact, the rubber dome compresses and releases a vertical bounce impulse — driving the signature Quake bounce and the upward drill-spin entry:

```
PE_Q = ½ × k × x² = ½ × 1200 × (0.006)² = 2.160×10⁻² J

v_vert = √(2 × PE_Q / m) = √(2 × 2.160×10⁻² / 0.0350) = √(1.2343) = 1.111 m/s

h_apex = v_vert² / (2g) = (1.111)² / (2 × 9.81) = 1.2343 / 19.62 = 62.9 mm  ≈ 63 mm
```

Q tip orbital speed:

```
v_orbital_Q = μ_Q × ω₀ × r_Q = 0.20 × 650 × 0.0035 = 0.4550 m/s
τ_Q         = μ_Q × m × g × r_Q = 0.20 × 0.0350 × 9.81 × 0.0035 = 2.401×10⁻⁴ N·m
t_spin      = L₀ / τ_Q = 1.549×10⁻² / 2.401×10⁻⁴ = 64.5 s
```

**Combined impact velocity (orbital + Q bounce apex re-entry):**

```
v_impact = √(v_orbital_Q² + 2g × h_apex)
         = √(0.4550² + 2 × 9.81 × 0.0629)
         = √(0.2070 + 1.2345)
         = √1.4415 = 1.201 m/s
```

---

### 2. Ray FW & M145 — Drill-Tornado Spin Column

The Ray Fusion Wheel's swept blade protrusions at r = 28 mm generate a rotating spiral wash (drill vortex) as Ray Gasher ascends from the Q bounce into its overhead strike. The M145 mid-height track stabilises this ascent at 145 mm without the change-height locking mechanism, keeping the AR elevation constant.

**Blade tip velocity:**

```
v_blade_tip = ω₀ × r_FW = 650 × 0.028 = 18.20 m/s
```

**Drill-vortex dynamic pressure at r_opp = 50 mm:**

```
Γ_drill = 2π × v_blade_tip × r_FW = 2π × 18.20 × 0.028 = 3.205 m²/s

v_drill  = Γ_drill / (2π × r_opp) = 3.205 / (2π × 0.050) = 10.18 m/s

q_drill  = ½ × ρ_air × v_drill² = ½ × 1.225 × 10.18² = 63.52 Pa
F_drill  = q_drill × A_opp = 63.52 × π × 0.020² = 63.52 × 1.257×10⁻³ = 0.07983 N
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.0 g |
| I_total | 2.383×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.549×10⁻² kg·m²/s |
| v_blade_tip | 18.20 m/s |
| PE_Q | 2.160×10⁻² J |
| v_vert | 1.111 m/s |
| h_apex | 63 mm |
| v_orbital_Q | 0.4550 m/s |
| v_impact | 1.201 m/s |
| Γ_drill | 3.205 m²/s |
| F_drill | 0.07983 N |
| τ_Q | 2.401×10⁻⁴ N·m |
| t_spin | 64.5 s |

---

## Case 1896 — SPECIAL: Slumdog Driver — Enso Garcia / Selen / Ray Gasher M145Q

**Blader:** Enso Garcia / Selen | **Beyblade:** Ray Gasher M145Q | **Type:** attack

### Description

Slumdog Driver (Japanese: スラムドッグ・ドライバー, Suramu Doggu Doraibā) is a Special Move used by both Enso Garcia and Selen with their Ray Gasher M145Q Beyblades. Ray Gasher consumes itself in a drill-like tornado and slams the opponent from above. The Q tip's rubber bounce launches Ray Gasher skyward at h ≈ 63 mm, spinning as a vertical drill column, before it crashes back down on the opposing beyblade with full aerial smash force. When both Selen and Enso use this move simultaneously, it becomes Double Slumdog Driver — two drill columns converging on the same target for doubled destructive force.

### Stage — Q Bounce Drill Aerial Overhead Smash

From Case 1895: v_impact = 1.201 m/s (Q orbital + bounce apex re-entry), e = 0.75 (hard Ray FW smash blades).

```
m_eff = (m_RG × m_opp) / (m_RG + m_opp) = (0.0350 × 0.038) / (0.0350 + 0.038)
      = 1.330×10⁻³ / 0.0730 = 1.822×10⁻² kg

J_slumdog = m_eff × (1 + e) × v_impact
          = 1.822×10⁻² × 1.75 × 1.201
          = 1.822×10⁻² × 2.1018 = 3.829×10⁻² N·s

Δv_opp  = J_slumdog / m_opp = 3.829×10⁻² / 0.038 = 1.008 m/s
```

**Effect on Ray Gasher (spin drain):**

```
Δω_RG    = J_slumdog × r_contact / I_RG = 3.829×10⁻² × 0.025 / 2.383×10⁻⁵ = 40.1 rad/s
ω_remain = 650 − 40.1 = 609.9 rad/s  (93.8% retained)
```

---

**[M] BeySpirit amplification:**
Enso and Selen's Ray Gasher Bit-Beasts converge into Double Slumdog Driver — both crab-beast spirits materialise as twin drill tornadoes spiralling down onto the same point, delivering twice the Quake bounce energy in a single combined overhead slam.

[M] factor = **8.0 ×** (Double Slumdog co-blader dual-drill amplification)
[M] Δv = 1.008 × 8.0 = **8.1 m/s** (twin-drill ring-out)

> **Note:** Physical values describe Q-tip rubber bounce (PE=2.160×10⁻² J, h=63 mm, v_impact=1.201 m/s), Ray FW drill smash (e=0.75), impulse J=3.829×10⁻² N·s, Δv=1.008 m/s. [M] values represent Enso and Selen's co-blader Gasher spirits fusing into Double Slumdog Driver — two drill columns in a single convergent overhead strike. Combos do not receive [M] amplification.

### TypeScript

```typescript
function slumdogDriverSpecial(bey: Beyblade, target: Beyblade): void {
  // Q bounce PE=2.160×10⁻²J→h=63mm→v_impact=1.201m/s; e=0.75 drill smash; J=3.829×10⁻²N·s; [M] 8.0×
  const J_phys = 0.03829;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Enso+Selen co-blader Double Slumdog drill)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Q (Quake) Performance Tip (or equivalent spring-compressed rubber bounce tip, k ≥ 900 N/m, x ≥ 5 mm) combined with a Fusion Wheel carrying swept smash blades at r ≥ 26 mm (generating drill-tornado approach at ω₀ ≥ 630 rad/s) on a mid-height track (M145 or equivalent ≥ 140 mm). The Q bounce must reach h ≥ 50 mm for a valid overhead drill entry. Standard game instances: Ray Gasher M145Q (Enso Garcia and Selen, Metal Fusion).

---

## Case 1897 — COMBO: Tornado Dash — Ray Gasher

**Sequence:** ↑ A ↑ (moveUp · attack · moveUp)
**Cost:** 15 | **Type:** attack | **Blader:** Enso Garcia / Selen

### Physics Justification

The first moveUp (↑) activates the Q tip rubber bounce (PE = 2.160×10⁻² J, h = 63 mm, v_vert = 1.111 m/s) — Ray Gasher launches upward in drill-spin mode.

The attack (A) fires the mid-air Ray FW overhead drill smash at v_impact = 1.201 m/s:

```
J_drill = J_slumdog = 3.829×10⁻² N·s  (from Case 1896)
```

The second moveUp (↑) represents the Q tip rubber spring rebound on landing — re-compressing the rubber dome and reconverting landing impulse back to spin:

```
Δω = η_Q × J_drill × r_contact / I_RG
   = 0.30 × 3.829×10⁻² × 0.025 / 2.383×10⁻⁵
   = 0.30 × 9.573×10⁻⁴ / 2.383×10⁻⁵
   = 0.30 × 40.17
   = +12.1 rad/s  ≈ +12 rad/s
```

(η_Q = 0.30: Q rubber bounce dome recompression reconversion on landing.) The Q bounce aerial drill smash gives damageMultiplier **1.25×**. lockMs = 0 (pure aerial attack, no lock phase).

**Parameters:**
- spinGain: +12 rad/s (Q rubber bounce rebound η = 0.30)
- damageMultiplier: 1.25 (Q bounce aerial drill overhead smash)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function tornadoDashCombo(bey: Beyblade, target: Beyblade): void {
  // Q bounce rebound: Δω ≈ +12 rad/s (η=0.30, h=63mm, J=3.829×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Aerial drill overhead smash: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |



---

## Case 1898 — GIMMICK: Storm Capricorn M145Q — M145 Targeting Stance & Q Horizontal Dash Release

**Beyblade:** Storm Capricorn M145Q (TT JP: ストームカプリコーンM145Q; Hasbro EN: Storm Capricorn M145Q)
**Blader:** Tobio Oike | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Capricorn | 3.8 | 23.0 |
| Fusion Wheel | Storm | 28.0 | 28.0 |
| Spin Track | M145 | 2.5 | 10.0 |
| Performance Tip | Q (Quake) | 1.2 | 3.5 |
| **Total** | | **35.5** | |

(Face Bolt ~1.4 g excluded per MFB convention. Assembly analysis here focuses on the Sniper Shot mechanism — horizontal spring dash + ER horn point-strike — distinct from Spin Screwdriver's vertical Q bounce, Cases 1839–1841.)

**I_total** = 28.0×10⁻³ × 0.028² + 3.8×10⁻³ × 0.023² + 2.5×10⁻³ × 0.010² + 1.2×10⁻³ × 0.0035²
           = 2.195×10⁻⁵ + 2.010×10⁻⁶ + 2.500×10⁻⁷ + 1.47×10⁻⁸
           = **2.423×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Fusion standard launch)
L₀ = I × ω₀ = 2.423×10⁻⁵ × 650 = **1.575×10⁻² kg·m²/s**

---

### 1. Q Tip — Horizontal Spring Dash Release

The Q tip rubber dome (k = 1200 N/m, x_compress = 6 mm = 0.006 m) normally fires vertically for Spin Screwdriver's bounce. In Sniper Shot, Tobio's aiming stance channels the spring release horizontally — the compressed dome fires Storm Capricorn forward in a straight-line dash toward the locked target:

```
PE_Q = ½ × k × x² = ½ × 1200 × (0.006)² = 2.160×10⁻² J

v_dash = √(2 × PE_Q / m) = √(2 × 2.160×10⁻² / 0.0355) = √(1.2169) = 1.103 m/s
```

Q tip orbital speed and spin decay:

```
v_orbital_Q = μ_Q × ω₀ × r_Q = 0.20 × 650 × 0.0035 = 0.4550 m/s
τ_Q         = μ_Q × m × g × r_Q = 0.20 × 0.0355 × 9.81 × 0.0035 = 2.44×10⁻⁴ N·m
t_spin      = L₀ / τ_Q = 1.575×10⁻² / 2.44×10⁻⁴ = 64.5 s
```

---

### 2. ER Capricorn Horn — Bullet-Point Contact Pressure

The Capricorn Energy Ring carries a prominent forward horn protrusion (tip radius r_horn = 1.5 mm, A_horn = π × r_horn² = 7.069×10⁻⁶ m²). At the moment of Sniper Shot contact, the horn tip concentrates the entire impact force at a single point — mimicking a bullet's penetrator nose:

```
v_horn_tip = ω₀ × r_ER = 650 × 0.023 = 14.95 m/s

F_horn = m × (v_horn_tip / t_c)  [t_c = 0.5 ms hard-tip contact duration]
       = 0.0355 × (14.95 / 5×10⁻⁴) = 0.0355 × 29900 = 1062 N

P_horn = F_horn / A_horn = 1062 / 7.069×10⁻⁶ = 1.502×10⁸ Pa = 150.2 MPa

σ_ratio = P_horn / σ_y_ABS = 150.2 / 55 = 2.73 × ABS yield
```

At 2.73× ABS yield the ER horn point exceeds the opponent's plastic yield stress — consistent with the anime's claim of the strike piercing through movable walls.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 35.5 g |
| I_total | 2.423×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.575×10⁻² kg·m²/s |
| v_blade_tip | 18.20 m/s |
| PE_Q | 2.160×10⁻² J |
| v_dash | 1.103 m/s |
| v_orbital_Q | 0.4550 m/s |
| r_horn | 1.5 mm |
| v_horn_tip | 14.95 m/s |
| F_horn (t_c = 0.5 ms) | 1062 N |
| P_horn | 150.2 MPa |
| σ_ratio | 2.73× ABS yield |
| τ_Q | 2.44×10⁻⁴ N·m |
| t_spin | 64.5 s |

---

## Case 1899 — SPECIAL: Sniper Shot — Tobio Oike / Storm Capricorn M145Q

**Blader:** Tobio Oike | **Beyblade:** Storm Capricorn M145Q | **Type:** attack

### Description

Sniper Shot is a Special Move used by Tobio Oike and his Storm Capricorn M145Q. Tobio pulls his hands up and then points at the opponent as if shooting at them. Storm Capricorn then rushes forward at full speed in a red flash of energy and strikes the opposing beyblade with a force that sends it flying. The speed of the rush reportedly exceeds that of an actual bullet — Capricorn was able to pass through the movable walls of the Alamo Town stadium in an instant. When multiple opponents are present, Tobio's pointing gesture locks onto one target: the player completes a QTE targeting sequence to select and claim the precision bonus.

### QTE: Target Lock (multi-opponent arena)

When 2 or more opponents are active, the move triggers a target-selection QTE — a targeting cursor sweeps across the opponents and the player taps to lock on at the right moment. A successful lock grants a precision multiplier:

```
J_lock_bonus  = 1.20  (QTE success: precision horn-tip lock)
J_miss_bonus  = 1.00  (QTE miss or single-opponent: no precision bonus)
```

### Stage — Q Horizontal Dash + Capricorn Horn Point Strike

From Case 1898: v_dash = 1.103 m/s, e = 0.75 (hard Storm FW blade/ER horn smash contact).

```
m_eff = (m_SC × m_opp) / (m_SC + m_opp) = (0.0355 × 0.038) / (0.0355 + 0.038)
      = 1.349×10⁻³ / 0.0735 = 1.835×10⁻² kg

J_sniper_base = m_eff × (1 + e) × v_dash
              = 1.835×10⁻² × 1.75 × 1.103
              = 3.542×10⁻² N·s

J_sniper_QTE  = J_sniper_base × J_lock_bonus = 3.542×10⁻² × 1.20 = 4.250×10⁻² N·s

Δv_opp (QTE)    = J_sniper_QTE  / m_opp = 4.250×10⁻² / 0.038 = 1.118 m/s
Δv_opp (no QTE) = J_sniper_base / m_opp = 3.542×10⁻² / 0.038 = 0.932 m/s
```

**Effect on Storm Capricorn (spin drain — QTE case):**

```
Δω_SC    = J_sniper_QTE × r_contact / I_SC = 4.250×10⁻² × 0.025 / 2.423×10⁻⁵ = 43.8 rad/s
ω_remain = 650 − 43.8 = 606.2 rad/s  (93.3% retained)
```

---

**[M] BeySpirit amplification:**
Tobio's pointer stance fully channels his Capricorn spirit into a precision lance — the red energy flash is the Capricorn bit-beast materialising as a rifle barrel, and the stadium walls offer no resistance to the spirit-charged horn strike.

[M] factor = **7.0 ×** (Tobio precision sniper spirit)
[M] Δv = 1.118 × 7.0 = **7.8 m/s** (sniper ring-out)

> **Note:** Physical values describe Q spring PE=2.160×10⁻² J horizontal release v_dash=1.103 m/s, ER Capricorn horn point P=150.2 MPa (2.73× ABS yield), QTE precision J=4.250×10⁻² N·s, Δv=1.118 m/s (no-QTE: J=3.542×10⁻² N·s, Δv=0.932 m/s). [M] values represent Tobio's full precision spirit materialisation as a through-wall bullet strike. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sniperShotSpecial(bey: Beyblade, target: Beyblade, qteSuccess: boolean): void {
  // Q spring PE=2.160×10⁻²J→v_dash=1.103m/s; horn P=150.2MPa (2.73× ABS); J_base=3.542×10⁻²N·s; QTE +20%; [M] 7.0×
  const J_base = 0.03542;
  const J_phys = qteSuccess ? J_base * 1.20 : J_base; // QTE precision lock-on: +20% if targeted
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Tobio precision sniper spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using the Q (Quake) Performance Tip (spring-compressed rubber dome, k ≥ 900 N/m, x ≥ 5 mm, horizontal release) combined with an Energy Ring carrying a forward horn protrusion (tip radius r_horn ≤ 2 mm, r_AR ≥ 22 mm, contact pressure ≥ 2.5× ABS yield) on a mid-height track (M145 or equivalent ≥ 140 mm) for the horizontal dash-and-point-contact sniper strike. QTE targeting fires when ≥ 2 opponents are present; single-opponent matches use J_base with no QTE bonus. Standard game instance: Storm Capricorn M145Q (Tobio Oike, Metal Fusion).

---

## Case 1900 — COMBO: Sniper Charge — Storm Capricorn

**Sequence:** ↑ → A (moveUp · moveRight · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Tobio Oike

### Physics Justification

The moveUp (↑) activates a partial Q dome compression during the aiming stance (x_partial = ½ × 6 mm = 3 mm):

```
PE_partial = ½ × k × x_partial² = ½ × 1200 × (0.003)² = 5.400×10⁻³ J

v_partial = √(2 × PE_partial / m) = √(2 × 5.400×10⁻³ / 0.0355) = √(0.3042) = 0.5516 m/s
```

The moveRight (→) is the targeting alignment — Storm Capricorn tracks toward the opponent's position (no contact), adding an orbital approach component v_orbital_Q = 0.455 m/s.

The attack (A) combines the partial Q dash and orbital approach into the horn strike:

```
v_impact = √(v_partial² + v_orbital_Q²) = √(0.5516² + 0.455²)
         = √(0.3043 + 0.2070) = √0.5113 = 0.715 m/s

J_charge = m_eff × (1 + e) × v_impact = 1.835×10⁻² × 1.75 × 0.715
         = 2.296×10⁻² N·s
```

The Q rubber dome partially recompresses on landing, reconverting contact impulse to spin:

```
Δω = η_Q × J_charge × r_contact / I_SC
   = 0.30 × 2.296×10⁻² × 0.025 / 2.423×10⁻⁵
   = 0.30 × 5.740×10⁻⁴ / 2.423×10⁻⁵
   = 0.30 × 23.69
   = +7.1 rad/s  ≈ +7 rad/s
```

(η_Q = 0.30: Q rubber partial-compression dome rebound reconversion.) The dash-and-horn point strike gives damageMultiplier **1.25×**. lockMs = 0 (pure attack dash, no lock phase).

**Parameters:**
- spinGain: +7 rad/s (Q partial-dome rebound η = 0.30)
- damageMultiplier: 1.25 (horizontal Q-dash horn point strike)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function sniperChargeCombo(bey: Beyblade, target: Beyblade): void {
  // Q partial spring rebound: Δω ≈ +7 rad/s (η=0.30, x_partial=3mm, v_impact=0.715m/s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 7);
  // Horizontal Q-dash horn strike: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +7 rad/s (partial) | ✓ |



---

## Case 1901 — GIMMICK: Flame Libra T125ES — T125 Arena Vibration & ES Sustained Acoustic Vortex

**Beyblade:** Flame Libra T125ES (TT JP: フレイムリブラT125ES; Hasbro EN: Flame Libra T125ES)
**Blader:** Yu Tendo | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Libra | 4.2 | 24.0 |
| Fusion Wheel | Flame | 27.0 | 27.0 |
| Spin Track | T125 (Triangle 125) | 1.7 | 6.0 |
| Performance Tip | ES (Eternal Sharp) | 1.5 | 1.5 |
| **Total** | | **34.4** | |

(Face Bolt ~1.4 g excluded per MFB convention. This case covers Sonic Buster's vibration-and-vortex mechanism; Sonic Wave's resonance-amplified variant is covered in Cases 1904–1906.)

**I_total** = 27.0×10⁻³ × 0.027² + 4.2×10⁻³ × 0.024² + 1.7×10⁻³ × 0.006² + 1.5×10⁻³ × 0.0015²
           = 1.968×10⁻⁵ + 2.419×10⁻⁶ + 6.12×10⁻⁸ + 3.375×10⁻⁹
           = **2.217×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Fusion standard launch)
L₀ = I × ω₀ = 2.217×10⁻⁵ × 650 = **1.441×10⁻² kg·m²/s**

---

### 1. T125 Triangular Fins — Arena Vibration Frequency & Sand Destabilization

The T125 (Triangle 125) Spin Track carries 3 triangular protrusions. As Libra spins, each fin delivers a periodic pressure impulse to the arena floor:

```
f_vib = N_fins × ω₀ / (2π) = 3 × 650 / (2π) = 310.4 Hz

F_cent = m_T125 × ω₀² × r_T125 = 1.7×10⁻³ × 650² × 0.006 = 4.310 N  (per fin, centrifugal)

Contact displacement amplitude (compacted arena: k_arena = 2×10⁶ N/m):
A_vib = F_cent / k_arena = 4.310 / 2×10⁶ = 2.155×10⁻⁶ m = 2.155 μm  (per fin pass)
```

At 310.4 Hz the micro-displacement (2.155 μm) repeatedly breaks inter-particle compaction bonds in the granular arena substrate, converting the compacted surface into loose sand within the vibration radius. Opponent μ_sand = 0.45 vs normal μ_normal = 0.30 → Δμ = +0.15:

```
τ_sand_drain = Δμ × m_opp × g × r_tip_opp = 0.15 × 0.038 × 9.81 × 0.005 = 2.796×10⁻⁴ N·m
(additional spin drain torque on opponent in sand zone)
```

---

### 2. ES Bearing Tip & Flame FW — Sustained Acoustic Vortex

The ES (Eternal Sharp) bearing tip enables long-duration spin, sustaining both the T125 vibration and the Flame FW acoustic vortex output:

```
τ_ES    = μ_ES × m × g × r_ES = 0.04 × 0.0344 × 9.81 × 0.0015 = 2.024×10⁻⁵ N·m
t_spin  = L₀ / τ_ES = 1.441×10⁻² / 2.024×10⁻⁵ = 712 s  (≈ 11.9 min sustained vibration)
```

The Flame FW at v_tip generates a Rankine acoustic vortex — the characteristic "terrible shrieking noise":

```
v_tip  = ω₀ × r_FW = 650 × 0.027 = 17.55 m/s

Γ_L    = 2π × v_tip × r_FW = 2π × 17.55 × 0.027 = 2.977 m²/s

At r_opp = 50 mm:
v_L    = Γ_L / (2π × r_opp) = 2.977 / (2π × 0.050) = 9.477 m/s
q_L    = ½ × ρ_air × v_L² = ½ × 1.225 × 9.477² = 55.01 Pa
F_sonic = q_L × A_opp = 55.01 × π × 0.020² = 55.01 × 1.257×10⁻³ = 0.06913 N  (outward)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 34.4 g |
| I_total | 2.217×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.441×10⁻² kg·m²/s |
| v_tip | 17.55 m/s |
| f_vib (T125 3-fin) | 310.4 Hz |
| A_vib | 2.155 μm |
| τ_sand_drain | 2.796×10⁻⁴ N·m |
| Γ_L | 2.977 m²/s |
| F_sonic (r=50mm) | 0.06913 N |
| τ_ES | 2.024×10⁻⁵ N·m |
| t_spin | 712 s |

---

## Case 1902 — SPECIAL: Sonic Buster — Yu Tendo / Flame Libra T125ES

**Blader:** Yu Tendo | **Beyblade:** Flame Libra T125ES | **Type:** attack

### Description

Sonic Buster (originally referred to as "Sonic Wave") is the first special move used by Yu Tendo and his Flame Libra T125ES. Libra vibrates extremely fast, turning the field around it into vulnerable sand. Libra then makes a terrible shrieking noise that pierces the ears of the opponent, delivering an acoustic pressure impulse that disrupts their balance.

### Stage 1 — Arena Sand Destabilization (T125 Vibration Zone)

From Case 1901: f_vib = 310.4 Hz, A_vib = 2.155 μm → arena sand mode within vibration radius.

Sand zone effect on opponent (t_sand = 0.5 s duration):

```
Additional spin drain torque: τ_sand_drain = 2.796×10⁻⁴ N·m
Δω_opp_drain ≈ τ_sand_drain × t_sand / I_opp_est (continuous opponent spin reduction from sand friction)
```

### Stage 2 — Sonic Wave (Acoustic Vortex Impulse, t_wave = 0.5 s)

From Case 1901: F_sonic = 0.06913 N at r_opp = 50 mm.

```
J_sonic = F_sonic × t_wave = 0.06913 × 0.5 = 3.457×10⁻² N·s

Δv_opp = J_sonic / m_opp = 3.457×10⁻² / 0.038 = 0.910 m/s
```

**Effect on Flame Libra (spin drain):**

```
Δω_L    = J_sonic × r_contact / I_L = 3.457×10⁻² × 0.025 / 2.217×10⁻⁵ = 39.0 rad/s
ω_remain = 650 − 39.0 = 611.0 rad/s  (94.0% retained)
```

---

**[M] BeySpirit amplification:**
Yu's Libra bit-beast fully manifests as a green-glowing winged spirit — the T125 vibration amplifies into a true arena-wide sonic collapse that physically disintegrates the opponent's stability while the shrieking shockwave crushes them from all directions.

[M] factor = **7.0 ×** (Yu's Libra sonic spirit)
[M] Δv = 0.910 × 7.0 = **6.4 m/s** (sonic ring-out)

> **Note:** Physical values describe T125 3-fin vibration at 310.4 Hz (A_vib=2.155 μm) converting arena to sand (Δμ=+0.15, τ_drain=2.796×10⁻⁴ N·m on opponent), acoustic vortex F=0.06913 N sustained 0.5s → J=3.457×10⁻² N·s, Δv=0.910 m/s. [M] values represent Yu's Libra spirit amplifying the vibration into a true arena-collapse shockwave. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sonicBusterSpecial(bey: Beyblade, target: Beyblade): void {
  // T125 310.4Hz vibration→sand (A_vib=2.155μm, τ_drain=2.796×10⁻⁴N·m); F_sonic=0.06913N×0.5s→J=3.457×10⁻²N·s; [M] 7.0×
  const J_phys = 0.03457;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Yu Libra sonic spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a multi-fin Spin Track (3+ fins at r ≥ 5 mm, generating floor-contact vibration at f ≥ 300 Hz) combined with a smooth Fusion Wheel (r_FW ≥ 25 mm, generating Rankine vortex F ≥ 0.05 N at r=50 mm) and a low-friction bearing tip (μ ≤ 0.05, t_spin ≥ 600 s) for sustained vibration and acoustic output. Standard game instance: Flame Libra T125ES (Yu Tendo, Metal Fusion).

---

## Case 1903 — COMBO: Sound Burst — Flame Libra

**Sequence:** A ↑ A (attack · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Yu Tendo

### Physics Justification

The first attack (A) fires a partial sonic wave burst (t_wave1 = 0.20 s):

```
J_wave1 = F_sonic × t_wave1 = 0.06913 × 0.20 = 1.383×10⁻² N·s
```

The moveUp (↑) elevates Flame Libra using T125's 125 mm height, raising the vortex output axis for a top-down wave propagation. The higher launch angle concentrates the wave energy on the second attack (T125 height factor: 1.25×):

The second attack (A) fires at T125-height-enhanced amplitude:

```
J_wave2 = J_wave1 × 1.25 = 1.383×10⁻² × 1.25 = 1.729×10⁻² N·s
```

The ES bearing free-spin mechanism reconverts the wave recoil impulse back to spin on the bearing inner race rebound:

```
Δω = η_ES × (J_wave1 + J_wave2) × r_contact / I_L
   = 0.35 × (1.383×10⁻² + 1.729×10⁻²) × 0.025 / 2.217×10⁻⁵
   = 0.35 × 3.112×10⁻² × 0.025 / 2.217×10⁻⁵
   = 0.35 × 35.09
   = +12.3 rad/s  ≈ +12 rad/s
```

(η_ES = 0.35: ES bearing free-spin recoil reconversion — near-frictionless inner race returns more energy than rubber.) Double partial wave with T125 elevation boost gives damageMultiplier **1.20×**. lockMs = 0 (pure wave attack, no dwell).

**Parameters:**
- spinGain: +12 rad/s (ES bearing free-spin recoil η = 0.35)
- damageMultiplier: 1.20 (double partial sonic wave, T125 height boost ×1.25)
- lockMs: 0 (pure attack)

### TypeScript

```typescript
function soundBurstCombo(bey: Beyblade, target: Beyblade): void {
  // ES bearing recoil: Δω ≈ +12 rad/s (η=0.35; J1=1.383×10⁻²+J2=1.729×10⁻²; T125 ×1.25)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Double partial wave + T125 height: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |



---

## Case 1904 — GIMMICK: Flame Libra T125ES — Resonance Amplification & Arena-Wide Sonic Collapse

**Beyblade:** Flame Libra T125ES (TT JP: フレイムリブラT125ES; Hasbro EN: Flame Libra T125ES)
**Blader:** Yu Tendo | **Series:** Beyblade: Metal Fusion (MFB)

### Assembly

(Same as Case 1901. Repeated for reference.)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Libra | 4.2 | 24.0 |
| Fusion Wheel | Flame | 27.0 | 27.0 |
| Spin Track | T125 (Triangle 125) | 1.7 | 6.0 |
| Performance Tip | ES (Eternal Sharp) | 1.5 | 1.5 |
| **Total** | | **34.4** | |

(Face Bolt ~1.4 g excluded per MFB convention. This case covers Sonic Wave's resonance-amplified collapse mechanism; the baseline Sonic Buster vibration is covered in Cases 1901–1903.)

**I_total** = 2.217×10⁻⁵ kg·m²  (same as Case 1901)
ω₀ = 650 rad/s | L₀ = 1.441×10⁻² kg·m²/s

---

### 1. T125 Resonance Amplification (Q-factor = 10)

Sonic Wave sustains the T125 vibration long enough for the arena to reach structural resonance — the substrate oscillation frequency (310.4 Hz) couples with the arena bowl's natural frequency. The Q (quality) factor of a rigid-walled stadium arena ≈ 10:

```
A_vib_base    = 2.155×10⁻⁶ m  (per Case 1901: per-fin micro-displacement)

A_resonance   = Q_factor × A_vib_base = 10 × 2.155×10⁻⁶ = 2.155×10⁻⁵ m = 21.55 μm
```

At 21.55 μm amplitude the entire arena substrate (sand/compacted granular fill) transitions to full fluidisation — all inter-particle contact bonds broken over the complete arena floor:

```
r_wave = arena radius = 150 mm  (full arena coverage at resonance)
τ_sand_wave = Δμ × m_opp × g × r_tip_opp = 0.15 × 0.038 × 9.81 × 0.005 = 2.796×10⁻⁴ N·m
(same Δμ = +0.15; full-arena coverage vs. local zone in Sonic Buster)
```

---

### 2. Structural Cyclic Stress — Critical Spin Threshold

The amplified vibration subjects the Flame FW to cyclic bending stress at each oscillation:

```
σ_cyclic = E_ABS × A_resonance / r_FW
         = 2.0×10⁹ × 2.155×10⁻⁵ / 0.027
         = 1.596×10⁶ Pa = 1.596 MPa

Safety factor at full spin:
SF = σ_y_ABS / σ_cyclic = 55×10⁶ / 1.596×10⁶ = 34.5  (safe at ω₀)

Safety factor at 40% spin (ω = 260 rad/s):
A_resonance_low = (260/650)² × 2.155×10⁻⁵ = 0.16 × 2.155×10⁻⁵ = 3.448×10⁻⁶ m
σ_cyclic_low = 2.0×10⁹ × 3.448×10⁻⁶ / 0.027 = 0.2554 MPa  (SF = 215 — safe)
```

The vibration amplitude scales with ω², keeping the bey safe at any spin. The risk is pure spin drain from the extended acoustic output.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 34.4 g |
| I_total | 2.217×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.441×10⁻² kg·m²/s |
| Q_factor | 10 |
| A_vib_base | 2.155 μm |
| A_resonance | 21.55 μm |
| r_wave | 150 mm (full arena) |
| τ_sand_wave | 2.796×10⁻⁴ N·m |
| σ_cyclic (full spin) | 1.596 MPa |
| SF (full spin) | 34.5 |
| τ_ES | 2.024×10⁻⁵ N·m |
| t_spin | 712 s |

---

## Case 1905 — SPECIAL: Sonic Wave — Yu Tendo / Flame Libra T125ES

**Blader:** Yu Tendo | **Beyblade:** Flame Libra T125ES | **Type:** attack

### Description

Sonic Wave is the second and more powerful special move used by Yu Tendo and his Flame Libra T125ES. In this move, Libra creates a massive sonic vortex that expands outward from the arena centre, converting the entire stadium floor into a fluidised sand field. The shrieking sound wave is orders of magnitude more powerful than Sonic Buster — it engulfs the whole arena and has been shown to crack stadium walls and send opponents flying in all directions. Yu first used Sonic Wave during his second battle against Gingka in Metal Fusion.

### Stage 1 — Full-Arena Resonance Sand Collapse (t_sand = 1.0 s)

From Case 1904: A_resonance = 21.55 μm, r_wave = 150 mm (full arena). Opponent fully immersed in fluidised zone for entire move duration.

```
Additional spin drain on opponent during t_sand:
τ_sand_wave = 2.796×10⁻⁴ N·m  (full arena sand mode, same Δμ per Case 1901)
```

### Stage 2 — Extended Sonic Vortex (t_wave = 1.0 s)

From Case 1901: F_sonic = 0.06913 N (Rankine vortex at r_opp = 50 mm). Sustained full second at resonance amplitude:

```
J_sonic_wave = F_sonic × t_wave = 0.06913 × 1.0 = 6.913×10⁻² N·s

Δv_opp = J_sonic_wave / m_opp = 6.913×10⁻² / 0.038 = 1.819 m/s
```

**Effect on Flame Libra (spin drain — extended resonance output):**

```
Δω_L    = J_sonic_wave × r_contact / I_L = 6.913×10⁻² × 0.025 / 2.217×10⁻⁵ = 78.0 rad/s
ω_remain = 650 − 78.0 = 572.0 rad/s  (88.0% retained)
```

---

**[M] BeySpirit amplification:**
Yu's Libra spirit fully manifests in Sonic Wave — the entire arena becomes a resonating instrument of Libra's will, the fluidised sand rises in a column of sound and the shrieking shockwave expands until the stadium walls themselves begin to fracture.

[M] factor = **7.0 ×** (Yu's Libra sonic resonance spirit)
[M] Δv = 1.819 × 7.0 = **12.7 m/s** (arena-wide sonic ring-out)

> **Note:** Physical values describe T125 resonance amplification Q=10, A_resonance=21.55 μm → full-arena sand (r=150mm, τ_drain=2.796×10⁻⁴ N·m on opponent), extended Rankine vortex F=0.06913 N × 1.0s → J=6.913×10⁻² N·s, Δv=1.819 m/s; Libra self-drain Δω=78.0 rad/s. [M] values represent Yu's Libra spirit amplifying the resonance into a true arena-collapse sonic catastrophe. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sonicWaveSpecial(bey: Beyblade, target: Beyblade): void {
  // Q=10 resonance: A_resonance=21.55μm→full-arena sand; F_sonic=0.06913N×1.0s→J=6.913×10⁻²N·s; [M] 7.0×
  const J_phys = 0.06913;
  const primeThreshold = bey.maxSpin * 0.40;
  const selfDrain = bey.spin < primeThreshold ? 156.0 : 78.0; // doubled if below 40% (resonance overload)
  bey.spin = Math.max(0, bey.spin - selfDrain);
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Yu Libra arena-resonance spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a multi-fin Spin Track (3+ fins at r ≥ 5 mm, vibration ≥ 300 Hz) combined with a smooth Fusion Wheel generating Rankine vortex F ≥ 0.05 N at r=50 mm and a bearing tip (μ ≤ 0.05, t_spin ≥ 600 s) — with enough sustained spin for resonance to develop (ω₀ ≥ 600 rad/s and t_active ≥ 1.0 s). Standard game instance: Flame Libra T125ES (Yu Tendo, Metal Fusion).

---

## Case 1906 — COMBO: Resonant Strike — Flame Libra

**Sequence:** K A A (defense · attack · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Yu Tendo

### Physics Justification

The defense input (K) represents Libra sinking into a resonance-prime stance — the ES bearing locks into a rigid-contact mode for one tick, coupling the T125 vibration more efficiently into the floor. This primes the Q-factor from a baseline of Q=3 to Q=6 (doubled resonance depth):

```
A_prime = 6 × 2.155×10⁻⁶ = 1.293×10⁻⁵ m = 12.93 μm  (partial resonance)
```

The first attack (A) fires the primed partial resonance wave (t_wave1 = 0.15 s):

```
J_wave1 = F_sonic × t_wave1 × (A_prime / A_vib_base)_scale
        ≈ 0.06913 × 0.15 × 1.0  (scaled to base F_sonic; partial resonance captured in timing)
        = 1.037×10⁻² N·s
```

The second attack (A) fires a full resonance-boosted wave (t_wave2 = 0.15 s, amplitude gain ×1.5 over first attack from resonance buildup):

```
J_wave2 = J_wave1 × 1.50 = 1.037×10⁻² × 1.50 = 1.556×10⁻² N·s
```

The ES bearing rebound reconverts the resonance wave recoil to spin (η_ES = 0.35):

```
Δω = η_ES × (J_wave1 + J_wave2) × r_contact / I_L
   = 0.35 × (1.037×10⁻² + 1.556×10⁻²) × 0.025 / 2.217×10⁻⁵
   = 0.35 × 2.593×10⁻² × 0.025 / 2.217×10⁻⁵
   = 0.35 × 29.24
   = +10.2 rad/s  ≈ +10 rad/s
```

(η_ES = 0.35: ES bearing near-frictionless inner race rebound.) The resonance-primed double wave gives damageMultiplier **1.20×**. lockMs = 150 (brief resonance dwell — priming cycle holds contact).

**Parameters:**
- spinGain: +10 rad/s (ES bearing resonance recoil η = 0.35)
- damageMultiplier: 1.20 (resonance-primed double partial sonic wave)
- lockMs: 150 (priming stance dwell)

### TypeScript

```typescript
function resonantStrikeCombo(bey: Beyblade, target: Beyblade): void {
  // ES resonance recoil: Δω ≈ +10 rad/s (η=0.35; J1=1.037×10⁻²+J2=1.556×10⁻²; ×1.5 buildup)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 10);
  // Resonance-primed double partial wave: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +10 rad/s (partial) | ✓ |



---

## Case 1907 — GIMMICK: Vortex Ape (Bakuten Shoot) — Flat Tip Charge Sprint & Triboelectric Spark Shield

**Beyblade:** Vortex Ape (Bakuten Shoot: Beyblade)
**Blader:** Dunga | **Series:** Beyblade (Bakuten Shoot, plastic generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Vortex Ape AR | 15.0 | 32.0 |
| Weight Disk | 10-Wide | 18.0 | 35.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | Flat Base (BB) | 2.0 | 3.0 |
| **Total** | | **38.5** | |

(Bit Chip ~1.0 g excluded per plastic-gen convention; contributes negligible I at r ≈ 0.)

**I_total** = 15.0×10⁻³ × 0.032² + 18.0×10⁻³ × 0.035² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.536×10⁻⁵ + 2.205×10⁻⁵ + 3.500×10⁻⁶ + 1.80×10⁻⁸
           = **4.093×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (plastic-gen Bakuten Shoot standard launch)
L₀ = I × ω₀ = 4.093×10⁻⁵ × 700 = **2.865×10⁻² kg·m²/s**

---

### 1. Flat Blade Base — Charge Sprint (Friction-Driven Run)

The Flat Blade Base has high rubber-contact friction (μ_flat = 0.35) that drives aggressive orbital motion. On the smooth stadium bowl Dunga commands a straight-line charge sprint toward the opponent — friction accelerates the bey from its orbital path into a direct dash:

```
a_flat = μ_flat × g = 0.35 × 9.81 = 3.434 m/s²  (sprint acceleration)

Over sprint distance r_sprint = 0.15 m (half-arena radius):
v_charge = √(2 × a_flat × r_sprint) = √(2 × 3.434 × 0.15) = √(1.030) = 1.015 m/s
```

Flat tip orbital speed and spin decay:

```
v_orbital_flat = μ_flat × ω₀ × r_BB = 0.35 × 700 × 0.003 = 0.735 m/s
τ_flat  = μ_flat × m × g × r_BB = 0.35 × 0.0385 × 9.81 × 0.003 = 3.980×10⁻⁴ N·m
t_spin  = L₀ / τ_flat = 2.865×10⁻² / 3.980×10⁻⁴ = 72.0 s
```

---

### 2. AR Vortex Ape — Triboelectric Spark Shield

The Vortex Ape AR carries wide swept protrusions at r_AR = 32 mm. At ω₀ = 700 rad/s, the blade tips charge triboelectrically by air friction (ABS on air):

```
v_tip = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s

σ_e = ε₀ × E_breakdown × (v_tip / v_ref)
    = 8.854×10⁻¹² × 3×10⁶ × (22.40 / 343)
    = 2.657×10⁻⁵ × 0.06531
    = 1.735×10⁻⁶ C/m²

Contact arc area per blade tip (t_c = 0.5 ms contact, arc width ≈ 5 mm):
A_arc = v_tip × t_c × w_blade = 22.40 × 5×10⁻⁴ × 0.005 = 5.600×10⁻⁵ m²

Q_total = σ_e × A_arc × N_blades  [N_blades = 6 Vortex Ape protrusions]
        = 1.735×10⁻⁶ × 5.600×10⁻⁵ × 6 = 5.830×10⁻¹⁰ C

Gap capacitance at d = 1 mm:
C_gap = ε₀ × A_arc / d = 8.854×10⁻¹² × 5.600×10⁻⁵ / 1×10⁻³ = 4.959×10⁻¹³ F
V_spark = Q_total / C_gap = 5.830×10⁻¹⁰ / 4.959×10⁻¹³ = 1175 V  (> 300 V breakdown → spark)
E_spark = ½ × C_gap × V_spark² = ½ × 4.959×10⁻¹³ × 1175² = 3.424×10⁻⁷ J
```

The spark discharge slightly increases the effective coefficient of restitution at blade contact (electrostatic repulsion adds to mechanical rebound): e_base = 0.65 → e_eff = 0.65 × 1.20 = **0.78** (+20% spark restitution boost).

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 38.5 g |
| I_total | 4.093×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.865×10⁻² kg·m²/s |
| v_tip | 22.40 m/s |
| a_flat | 3.434 m/s² |
| v_charge | 1.015 m/s |
| v_orbital_flat | 0.735 m/s |
| σ_e | 1.735×10⁻⁶ C/m² |
| V_spark | 1175 V |
| E_spark | 3.424×10⁻⁷ J |
| e_eff (with spark) | 0.78 |
| τ_flat | 3.980×10⁻⁴ N·m |
| t_spin | 72.0 s |

---

## Case 1908 — SPECIAL: Spark Hammer — Dunga / Vortex Ape

**Blader:** Dunga | **Beyblade:** Vortex Ape | **Type:** attack

### Description

Spark Hammer (Japanese: スパークハンマー) is a Special Move used by Dunga and his Vortex Ape Beyblade. Dunga commands Vortex Ape to charge in a straight line across the arena at maximum flat-tip speed. As Vortex Ape's AR protrusions charge with static electricity from the high-speed air friction, a ring of sparks surrounds the blade like a shield — the "Spark Hammer" effect. The electrified AR then delivers a hammer-blow collision that sends the opponent flying with extra force from the spark discharge.

### Stage — Flat Tip Sprint + Spark-Enhanced AR Smash

From Case 1907: v_charge = 1.015 m/s, e_eff = 0.78 (spark-boosted restitution).

```
m_eff = (m_VA × m_opp) / (m_VA + m_opp) = (0.0385 × 0.038) / (0.0385 + 0.038)
      = 1.4630×10⁻³ / 0.0765 = 1.912×10⁻² kg

J_spark = m_eff × (1 + e_eff) × v_charge
        = 1.912×10⁻² × 1.78 × 1.015
        = 1.912×10⁻² × 1.8067 = 3.456×10⁻² N·s

Δv_opp = J_spark / m_opp = 3.456×10⁻² / 0.038 = 0.909 m/s
```

**Effect on Vortex Ape (spin drain):**

```
Δω_VA    = J_spark × r_contact / I_VA = 3.456×10⁻² × 0.030 / 4.093×10⁻⁵ = 25.3 rad/s
ω_remain = 700 − 25.3 = 674.7 rad/s  (96.4% retained)
```

---

**[M] BeySpirit amplification:**
Dunga's Ape Bit-Beast fully charges the Vortex Ape AR into a crackling ball of lightning — the spark shield becomes a true electrical storm that hammers the opponent with both physical smash force and a full electrostatic discharge blast.

[M] factor = **7.0 ×** (Dunga Ape spirit electric storm)
[M] Δv = 0.909 × 7.0 = **6.4 m/s** (spark hammer ring-out)

> **Note:** Physical values describe flat-tip sprint a=3.434 m/s² over 0.15m → v_charge=1.015 m/s, triboelectric spark e_boost=+20% (e_eff=0.78), J=3.456×10⁻² N·s, Δv=0.909 m/s. [M] values represent Dunga's Ape spirit igniting the full Spark Hammer lightning blast. Combos do not receive [M] amplification.

### TypeScript

```typescript
function sparkHammerSpecial(bey: Beyblade, target: Beyblade): void {
  // Flat sprint a=3.434m/s²×0.15m→v=1.015m/s; spark e_eff=0.78 (+20%); J=3.456×10⁻²N·s; [M] 7.0×
  const J_phys = 0.03456;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Dunga Ape electric storm)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a Flat Blade Base (or equivalent flat-contact tip, μ ≥ 0.30) combined with an Attack Ring carrying 6+ swept protrusions at r_AR ≥ 30 mm (generating triboelectric spark at v_tip ≥ 20 m/s, V_spark ≥ 300 V). The flat tip drives the charge sprint; AR spark discharges at contact for +20% restitution. Standard game instance: Vortex Ape (Dunga, Bakuten Shoot Beyblade).

---

## Case 1909 — COMBO: Electric Charge — Vortex Ape

**Sequence:** → J A (moveRight · jump · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Dunga

### Physics Justification

The moveRight (→) begins the flat-tip sprint across the arena (partial charge, r_partial = 0.075 m — half the full sprint distance):

```
v_partial = √(2 × a_flat × r_partial) = √(2 × 3.434 × 0.075) = √(0.5151) = 0.7177 m/s
```

The jump (J) is a short hop — the flat base bounces off the arena floor (elastic contact, e_hop = 0.40):

```
v_hop = e_hop × v_orbital_flat = 0.40 × 0.735 = 0.294 m/s  (upward)
h_hop = v_hop² / (2g) = 0.294² / 19.62 = 4.4 mm
```

The attack (A) fires at landing from the hop, combining the sprint approach velocity with the descent re-entry speed:

```
v_impact = √(v_partial² + 2g × h_hop)
         = √(0.7177² + 2 × 9.81 × 0.0044)
         = √(0.5151 + 0.08632)
         = √0.6014 = 0.7755 m/s

J_elec = m_eff × (1 + e_eff) × v_impact = 1.912×10⁻² × 1.78 × 0.7755
       = 1.912×10⁻² × 1.3804 = 2.640×10⁻² N·s
```

The flat base friction rebound on landing reconverts contact impulse to spin:

```
Δω = η_flat × J_elec × r_contact / I_VA
   = 0.28 × 2.640×10⁻² × 0.030 / 4.093×10⁻⁵
   = 0.28 × 7.920×10⁻⁴ / 4.093×10⁻⁵
   = 0.28 × 19.35
   = +5.4 rad/s  ≈ +5 rad/s
```

(η_flat = 0.28: flat tip moderate-rebound recoil reconversion.) The sprint-hop-smash AR contact gives damageMultiplier **1.25×**. lockMs = 0 (pure attack dash, no dwell).

**Parameters:**
- spinGain: +5 rad/s (flat base hop rebound η = 0.28)
- damageMultiplier: 1.25 (sprint-hop spark AR smash)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function electricChargeCombo(bey: Beyblade, target: Beyblade): void {
  // Flat hop rebound: Δω ≈ +5 rad/s (η=0.28, h_hop=4.4mm, v_impact=0.7755m/s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 5);
  // Sprint-hop spark AR smash: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +5 rad/s (partial) | ✓ |



---

## Case 1910 — GIMMICK: Dranzer F (Bakuten Shoot) — Wing AR Lift & Aerial Overhead Descent Strike

**Beyblade:** Dranzer F (Bakuten Shoot: Beyblade)
**Blader:** Kai Hiwatari | **Series:** Beyblade (Bakuten Shoot, plastic generation)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Dranzer (4-wing phoenix) | 14.0 | 32.0 |
| Weight Disk | Circle Balance | 14.0 | 34.0 |
| Spin Gear | Right SG | 3.5 | 10.0 |
| Blade Base | Flat Base (BB) | 2.0 | 3.0 |
| **Total** | | **33.5** | |

(Bit Chip ~1.0 g excluded per plastic-gen convention.)

**I_total** = 14.0×10⁻³ × 0.032² + 14.0×10⁻³ × 0.034² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.434×10⁻⁵ + 1.619×10⁻⁵ + 3.500×10⁻⁶ + 1.80×10⁻⁸
           = **3.405×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (plastic-gen standard launch)
L₀ = I × ω₀ = 3.405×10⁻⁵ × 700 = **2.384×10⁻² kg·m²/s**

---

### 1. Dranzer AR — Four-Wing Lift Force

The Dranzer Attack Ring carries four swept phoenix-wing protrusions designed to generate aerodynamic lift at high spin. Each wing is modelled as a flat-plate aerofoil (C_L = 0.6, A_wing = 1.2×10⁻⁴ m² per wing):

```
v_tip = ω₀ × r_AR = 700 × 0.032 = 22.40 m/s

F_lift_total = N_wings × ½ × ρ_air × v_tip² × C_L × A_wing
             = 4 × ½ × 1.225 × 22.40² × 0.6 × 1.2×10⁻⁴
             = 4 × ½ × 1.225 × 501.76 × 7.2×10⁻⁵
             = 4 × 2.218×10⁻² = 8.871×10⁻² N

Weight: W = m × g = 0.0335 × 9.81 = 0.3286 N

Lift fraction: F_lift / W = 8.871×10⁻² / 0.3286 = 26.99%  ≈ 27%
```

Effective gravity during upward flight (lift partially opposes gravity):

```
g_eff = g × (1 − F_lift / W) = 9.81 × (1 − 0.2699) = 9.81 × 0.7301 = 7.165 m/s²
```

---

### 2. Bowl-Exit Trajectory — Apex Height & Descent Strike

Dranzer F uses the bowl wall to redirect from horizontal orbit into a vertical launch (bowl wall angle θ = 60°):

```
v_orbital = μ_flat × ω₀ × r_BB = 0.35 × 700 × 0.003 = 0.735 m/s

v_z (upward at bowl exit) = v_orbital × tan(60°) = 0.735 × 1.732 = 1.273 m/s

Apex height (under g_eff — lift active during ascent):
h_apex = v_z² / (2 × g_eff) = 1.273² / (2 × 7.165) = 1.6205 / 14.330 = 113.1 mm ≈ 113 mm

Descent velocity (full g — lift decays as spin reduces at apex):
v_descent = √(2 × g × h_apex) = √(2 × 9.81 × 0.1131) = √(2.219) = 1.490 m/s

Combined impact velocity (orbital component + descent):
v_impact = √(v_orbital² + v_descent²) = √(0.735² + 1.490²) = √(0.5402 + 2.2201) = √2.7603 = 1.661 m/s
```

**Flat base spin decay:**

```
τ_flat  = μ_flat × m × g × r_BB = 0.35 × 0.0335 × 9.81 × 0.003 = 3.461×10⁻⁴ N·m
t_spin  = L₀ / τ_flat = 2.384×10⁻² / 3.461×10⁻⁴ = 68.9 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 33.5 g |
| I_total | 3.405×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 2.384×10⁻² kg·m²/s |
| v_tip | 22.40 m/s |
| F_lift_total | 8.871×10⁻² N |
| Lift fraction | 27% |
| g_eff | 7.165 m/s² |
| v_orbital | 0.735 m/s |
| v_z | 1.273 m/s |
| h_apex | 113 mm |
| v_descent | 1.490 m/s |
| v_impact | 1.661 m/s |
| τ_flat | 3.461×10⁻⁴ N·m |
| t_spin | 68.9 s |

---

## Case 1911 — SPECIAL: Spin Fire — Kai Hiwatari / Dranzer F

**Blader:** Kai Hiwatari | **Beyblade:** Dranzer F | **Type:** attack

### Description

Spin Fire is a Special Move used by Kai Hiwatari and his Dranzer F Beyblade. Dranzer rides the bowl wall and launches high into the air, its four phoenix wings generating enough lift to carry it to a significant apex height before it crashes back down on the opponent from above in a blazing overhead strike. The Flat Base drives a high-speed orbital approach, the bowl wall redirects into a vertical launch, and Dranzer descends like a meteor. This move is similar in mechanism to Mountain Cat Attack — a high-angle bowl-wall launch into an aerial overhead smash — but Dranzer's wing lift extends the apex height considerably. Kai first used Spin Fire in his earliest battles in Bakuten Shoot Season 1.

### Stage — Bowl-Wall Launch + Wing-Lift Aerial Overhead Descent Strike

From Case 1910: v_impact = 1.661 m/s (orbital + wing-lift ascent + full-g descent), e = 0.75 (hard ABS AR smash blades).

```
m_eff = (m_D × m_opp) / (m_D + m_opp) = (0.0335 × 0.038) / (0.0335 + 0.038)
      = 1.273×10⁻³ / 0.0715 = 1.780×10⁻² kg

J_spinfire = m_eff × (1 + e) × v_impact
           = 1.780×10⁻² × 1.75 × 1.661
           = 1.780×10⁻² × 2.9068 = 5.174×10⁻² N·s

Δv_opp = J_spinfire / m_opp = 5.174×10⁻² / 0.038 = 1.361 m/s
```

**Effect on Dranzer F (spin drain):**

```
Δω_D    = J_spinfire × r_contact / I_D = 5.174×10⁻² × 0.030 / 3.405×10⁻⁵ = 45.6 rad/s
ω_remain = 700 − 45.6 = 654.4 rad/s  (93.5% retained)
```

---

**[M] BeySpirit amplification:**
Kai's Dranzer Bit-Beast fully materialises as a blazing phoenix — the wings ignite with spirit fire at the apex, the descent becomes a true meteor strike that hurls the opponent out of the stadium in a column of flames.

[M] factor = **8.0 ×** (Kai Hiwatari — Dranzer phoenix fire spirit, iconic move)
[M] Δv = 1.361 × 8.0 = **10.9 m/s** (phoenix fire ring-out)

> **Note:** Physical values describe four-wing lift F=8.871×10⁻² N (27% weight), g_eff=7.165 m/s², bowl-wall launch v_z=1.273 m/s, h_apex=113 mm, v_impact=1.661 m/s, impulse J=5.174×10⁻² N·s, Δv=1.361 m/s. [M] values represent Kai's Dranzer phoenix spirit igniting the aerial descent into a blazing meteor strike. Combos do not receive [M] amplification.

### TypeScript

```typescript
function spinFireSpecial(bey: Beyblade, target: Beyblade): void {
  // 4-wing lift 27%→g_eff=7.165m/s²; bowl launch v_z=1.273m/s→h=113mm; v_impact=1.661m/s; J=5.174×10⁻²N·s; [M] 8.0×
  const J_phys = 0.05174;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Kai Dranzer phoenix fire spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a flat-contact Blade Base (μ ≥ 0.30) combined with an Attack Ring carrying 4+ upward-angled wing protrusions at r_AR ≥ 30 mm generating measurable lift (F_lift ≥ 0.06 N at ω₀ ≥ 680 rad/s), launched via a 50–70° bowl wall for vertical ascent. Standard game instance: Dranzer F (Kai Hiwatari, Bakuten Shoot Beyblade).

---

## Case 1912 — COMBO: Flame Dive — Dranzer F

**Sequence:** ↑ A K (moveUp · attack · defense)
**Cost:** 15 | **Type:** attack | **Blader:** Kai Hiwatari

### Physics Justification

The moveUp (↑) launches Dranzer F up the bowl wall at half-orbit speed (v_partial = v_orbital × 0.5 = 0.735 × 0.5 = 0.3675 m/s). With wing lift active, this gives a partial ascent:

```
v_z_partial = v_partial × tan(60°) = 0.3675 × 1.732 = 0.6365 m/s

h_partial = v_z_partial² / (2 × g_eff) = 0.6365² / (2 × 7.165) = 0.4051 / 14.330 = 28.3 mm
```

The attack (A) fires at descent apex — Dranzer strikes downward at v_descent_partial:

```
v_descent_partial = √(2 × g × h_partial) = √(2 × 9.81 × 0.0283) = √(0.5553) = 0.7452 m/s

v_impact_partial = √(v_partial² + v_descent_partial²) = √(0.3675² + 0.7452²)
                 = √(0.1351 + 0.5553) = √0.6904 = 0.8309 m/s

J_partial = m_eff × (1 + e) × v_impact_partial = 1.780×10⁻² × 1.75 × 0.8309
          = 1.780×10⁻² × 1.4541 = 2.588×10⁻² N·s
```

The defense (K) is the wing-guard follow-through — Dranzer angles the phoenix wings downward on contact, shielding from counter-strike and reconverting contact recoil to spin (η_wing = 0.30, wing deflects recoil into rotation):

```
Δω = η_wing × J_partial × r_contact / I_D
   = 0.30 × 2.588×10⁻² × 0.030 / 3.405×10⁻⁵
   = 0.30 × 7.764×10⁻⁴ / 3.405×10⁻⁵
   = 0.30 × 22.80
   = +6.8 rad/s  ≈ +7 rad/s
```

(η_wing = 0.30: phoenix wing deflection recoil reconversion.) The partial aerial dive with wing-guard gives damageMultiplier **1.25×**. lockMs = 100 (wing-guard hold on landing).

**Parameters:**
- spinGain: +7 rad/s (wing deflection recoil η = 0.30)
- damageMultiplier: 1.25 (partial aerial overhead dive with wing guard)
- lockMs: 100 (wing-guard dwell)

### TypeScript

```typescript
function flameDiveCombo(bey: Beyblade, target: Beyblade): void {
  // Wing recoil: Δω ≈ +7 rad/s (η=0.30, h_partial=28.3mm, J=2.588×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 7);
  // Partial aerial dive + wing guard: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +7 rad/s (partial) | ✓ |



---

## Case 1913 — GIMMICK: Thermal Lacerta WA130HF — WA130 Wing-Arm Sweep & HF Aggressive Orbit

**Beyblade:** Thermal Lacerta WA130HF (TT JP: サーマルラセルタWA130HF; Hasbro EN: Thermal Lacerta WA130HF)
**Blader:** Chiyun Li | **Series:** Beyblade: Metal Masters (MFB)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Ring | Lacerta | 4.0 | 24.0 |
| Fusion Wheel | Thermal | 29.0 | 28.0 |
| Spin Track | WA130 (Wing Attack 130) | 3.5 | 14.0 |
| Performance Tip | HF (High Flat) | 0.9 | 3.5 |
| **Total** | | **37.4** | |

(Face Bolt ~1.4 g excluded per MFB convention.)

**I_total** = 29.0×10⁻³ × 0.028² + 4.0×10⁻³ × 0.024² + 3.5×10⁻³ × 0.014² + 0.9×10⁻³ × 0.0035²
           = 2.274×10⁻⁵ + 2.304×10⁻⁶ + 6.860×10⁻⁷ + 1.103×10⁻⁸
           = **2.580×10⁻⁵ kg·m²**

ω₀ = 650 rad/s (MFB Metal Masters standard launch)
L₀ = I × ω₀ = 2.580×10⁻⁵ × 650 = **1.677×10⁻² kg·m²/s**

---

### 1. WA130 Wing Attack Spin Track — Lateral Wing Sweep

The WA130 (Wing Attack 130) Spin Track extends two wide lateral arms perpendicular to the spin axis at 130 mm height. Each arm (length L_arm = 20 mm, width w_arm = 8 mm, A_arm = 1.600×10⁻⁴ m²) sweeps through the air and contacts the opponent's lower track/tip region on close approach — a lateral tail-sweep attack at mid-height.

**Wing-arm tip velocity:**

```
v_arm = ω₀ × r_arm_tip = 650 × (0.028 + 0.020) = 650 × 0.048 = 31.20 m/s
```

**Wing-arm aerodynamic lateral sweep force (drag mode on approach):**

```
F_sweep = ½ × ρ_air × v_arm² × C_D × A_arm × N_arms
        = ½ × 1.225 × 31.20² × 1.2 × 1.600×10⁻⁴ × 2
        = ½ × 1.225 × 973.44 × 1.2 × 3.200×10⁻⁴
        = ½ × 1.225 × 973.44 × 3.840×10⁻⁴
        = 0.2289 N  (lateral sweep force per pass)
```

**Wing-arm impact impulse (contact duration t_c = 2 ms):**

```
J_sweep = F_sweep × t_c = 0.2289 × 2×10⁻³ = 4.578×10⁻⁴ N·s  (per arm contact)
```

---

### 2. HF (High Flat) Tip — Aggressive Orbit Drive

The HF tip combines sharp-center focus with a flat ring surround (μ_HF = 0.30, r_HF = 3.5 mm) for fast aggressive orbit with controlled destabilisation bursts:

```
v_orbital_HF = μ_HF × ω₀ × r_HF = 0.30 × 650 × 0.0035 = 0.6825 m/s

τ_HF   = μ_HF × m × g × r_HF = 0.30 × 0.0374 × 9.81 × 0.0035 = 3.858×10⁻⁴ N·m
t_spin = L₀ / τ_HF = 1.677×10⁻² / 3.858×10⁻⁴ = 43.5 s
```

**Combined impact velocity (HF orbital + WA130 arm sweep lateral component):**

```
v_impact = √(v_orbital_HF² + (F_sweep × t_c / m)²)
         = √(0.6825² + (4.578×10⁻⁴ / 0.0374)²)
         = √(0.4658 + (1.224×10⁻²)²)
         = √(0.4658 + 1.498×10⁻⁴)
         = √0.4660 = 0.6826 m/s  ≈ 0.683 m/s  (WA130 arm sweep lateral component minor vs orbital)
```

For the Tempestuous Whirlwind Sword slam the dominant component is the full-body overhead slam entry, modelled as orbital v_orbital_HF = 0.6825 m/s direct approach with e = 0.75.

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.4 g |
| I_total | 2.580×10⁻⁵ kg·m² |
| ω₀ | 650 rad/s |
| L₀ | 1.677×10⁻² kg·m²/s |
| v_arm | 31.20 m/s |
| F_sweep | 0.2289 N |
| J_sweep | 4.578×10⁻⁴ N·s (per arm) |
| v_orbital_HF | 0.6825 m/s |
| v_impact | 0.683 m/s |
| τ_HF | 3.858×10⁻⁴ N·m |
| t_spin | 43.5 s |

---

## Case 1914 — SPECIAL: Tempestuous Whirlwind Sword — Chiyun Li / Thermal Lacerta WA130HF

**Blader:** Chiyun Li | **Beyblade:** Thermal Lacerta WA130HF | **Type:** attack

### Description

Tempestuous Whirlwind Sword (Japanese: 疾風迅雷剣, Shippū Jinrai Ken) is the third and most powerful Special Move used by Chiyun Li and his Thermal Lacerta WA130HF. Chiyun Li summons Lacerta to slash with its tail, slamming the opponent with serious damage while the bey attacks covered in a pink aura. The WA130 wing arms generate the sweeping "tail slash" lateral impact, and the pink aura is the aerodynamic wake shed from the rapidly rotating wing tips. Chiyun Li first used this move to counter Tsubasa's Diving Crush.

### Stage — WA130 Wing-Arm Tail Slash + HF Orbital Approach Slam

The Tempestuous Whirlwind Sword is a two-component strike: the WA130 wing-arms deliver the lateral "tail slash" sweep while the HF-driven orbital approach contributes the body slam. Combined entry velocity:

```
v_combined = √(v_orbital_HF² + v_arm_lateral²)
```

Lateral velocity from WA130 arm sweep impulse applied to body:

```
v_arm_lateral = J_sweep × N_arms / m = (4.578×10⁻⁴ × 2) / 0.0374 = 9.156×10⁻⁴ / 0.0374 = 0.02448 m/s

v_combined = √(0.6825² + 0.02448²) = √(0.4658 + 5.99×10⁻⁴) ≈ 0.6829 m/s
```

Using v_combined ≈ 0.683 m/s and e = 0.75 (hard Thermal FW smash):

```
m_eff = (m_TL × m_opp) / (m_TL + m_opp) = (0.0374 × 0.038) / (0.0374 + 0.038)
      = 1.4212×10⁻³ / 0.0754 = 1.885×10⁻² kg

J_whirlwind = m_eff × (1 + e) × v_combined
            = 1.885×10⁻² × 1.75 × 0.683
            = 1.885×10⁻² × 1.1953 = 2.253×10⁻² N·s

Δv_opp = J_whirlwind / m_opp = 2.253×10⁻² / 0.038 = 0.593 m/s
```

**Effect on Thermal Lacerta (spin drain):**

```
Δω_TL    = J_whirlwind × r_contact / I_TL = 2.253×10⁻² × 0.025 / 2.580×10⁻⁵ = 21.8 rad/s
ω_remain = 650 − 21.8 = 628.2 rad/s  (96.6% retained)
```

---

**[M] BeySpirit amplification:**
Chiyun Li's Lacerta Bit-Beast materialises as a great lizard spirit wreathed in a pink tempest aura — the WA130 wing arms become Lacerta's slashing tail, and the full Thermal FW body becomes a whirlwind blade that sweeps the opponent from the arena in a devastating pink storm.

[M] factor = **7.0 ×** (Chiyun Li — Lacerta pink tempest spirit)
[M] Δv = 0.593 × 7.0 = **4.2 m/s** (whirlwind sword ring-out)

> **Note:** Physical values describe WA130 arm sweep F=0.2289 N (J=4.578×10⁻⁴ N·s per arm, t_c=2ms), HF orbital v=0.6825 m/s, combined v_combined=0.683 m/s, total impulse J=2.253×10⁻² N·s, Δv=0.593 m/s. [M] values represent Chiyun Li's Lacerta spirit manifesting the WA130 arms as a dragon tail slash through a pink tempest aura. Combos do not receive [M] amplification.

### TypeScript

```typescript
function tempestuousWhirlwindSwordSpecial(bey: Beyblade, target: Beyblade): void {
  // WA130 wing sweep F=0.2289N t_c=2ms; HF orbital v=0.6825m/s; J=2.253×10⁻²N·s; [M] 7.0×
  const J_phys = 0.02253;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Chiyun Li Lacerta pink tempest spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a WA (Wing Attack) Spin Track (WA130 or equivalent, arm extension ≥ 15 mm beyond r_FW, A_arm ≥ 1.2×10⁻⁴ m² per arm, sweep F ≥ 0.15 N) combined with an aggressive flat/high-flat tip (μ ≥ 0.25, v_orbital ≥ 0.60 m/s). The wing arms must reach the opponent's lower track level for lateral tail-sweep contact. Standard game instance: Thermal Lacerta WA130HF (Chiyun Li, Metal Masters).

---

## Case 1915 — COMBO: Lacerta Slash — Thermal Lacerta

**Sequence:** → ↑ A (moveRight · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Chiyun Li

### Physics Justification

The moveRight (→) drives HF aggressive orbit approach (v_partial = v_orbital_HF × 0.70 = 0.6825 × 0.70 = 0.4778 m/s orbital component):

```
v_approach = 0.4778 m/s
```

The moveUp (↑) raises Lacerta's contact height along the WA130 130 mm track, maximising the wing-arm sweep arc. The elevation channels the lateral arm sweep more directly onto the target (height focus factor: 1.15×):

The attack (A) fires the WA130 arm sweep + orbital approach combined:

```
J_sweep_combo = F_sweep × t_c × 1.15  (height focus boost)
              = 0.2289 × 2×10⁻³ × 1.15 = 5.265×10⁻⁴ N·s  (per arm × 2 arms)

v_arm_lateral_combo = (5.265×10⁻⁴ × 2) / 0.0374 = 1.053×10⁻³ / 0.0374 = 0.02815 m/s

v_impact_combo = √(v_approach² + v_arm_lateral_combo²)
               = √(0.4778² + 0.02815²)
               = √(0.2283 + 7.92×10⁻⁴)
               ≈ 0.4786 m/s

J_slash = m_eff × (1 + e) × v_impact_combo = 1.885×10⁻² × 1.75 × 0.4786
        = 1.885×10⁻² × 0.8375 = 1.579×10⁻² N·s
```

The HF tip high-flat contact on landing reconverts the lateral arm sweep recoil to spin (η_HF = 0.28):

```
Δω = η_HF × J_slash × r_contact / I_TL
   = 0.28 × 1.579×10⁻² × 0.025 / 2.580×10⁻⁵
   = 0.28 × 3.948×10⁻⁴ / 2.580×10⁻⁵
   = 0.28 × 15.30
   = +4.3 rad/s  ≈ +4 rad/s
```

(η_HF = 0.28: HF flat contact rebound lateral arm recoil reconversion.) The WA130 height-focused wing sweep gives damageMultiplier **1.20×**. lockMs = 0 (pure attack sweep, no lock phase).

**Parameters:**
- spinGain: +4 rad/s (HF lateral arm recoil η = 0.28)
- damageMultiplier: 1.20 (WA130 height-focused wing sweep attack)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function lacertaSlashCombo(bey: Beyblade, target: Beyblade): void {
  // HF arm recoil: Δω ≈ +4 rad/s (η=0.28, J=1.579×10⁻²N·s, WA130 ×1.15 height boost)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 4);
  // WA130 height-focused sweep: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +4 rad/s (partial) | ✓ |



---

## Case 1916 — GIMMICK: Dranzer MF (Wing Attacker CWD) — CWD Wide-Wing Aerodynamic Amplification & Phoenix Fire Column

**Beyblade:** Dranzer MF with Wing Attacker CWD (TT JP: ドランザーMF ウィングアタッカーCWD)
**Blader:** Kai Hiwatari | **Series:** Beyblade (Bakuten Shoot manga, final chapter)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Attack Ring | Dranzer MS (Metal System) | 16.0 | 33.0 |
| Weight Disk | Wing Attacker CWD | 22.0 | 38.0 |
| Spin Gear | Right SG (Metal) | 4.5 | 10.0 |
| Blade Base | Metal Flat Base (MFB) | 3.0 | 3.0 |
| **Total** | | **45.5** | |

(Bit Chip ~1.0 g excluded per plastic-gen convention. Wing Attacker CWD is a Customize Weight Disk with wide-span aerodynamic wings at maximum radius — the manga's final special move.)

**I_total** = 16.0×10⁻³ × 0.033² + 22.0×10⁻³ × 0.038² + 4.5×10⁻³ × 0.010² + 3.0×10⁻³ × 0.003²
           = 1.742×10⁻⁵ + 3.178×10⁻⁵ + 4.500×10⁻⁶ + 2.70×10⁻⁸
           = **5.398×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (plastic-gen Bakuten Shoot standard launch)
L₀ = I × ω₀ = 5.398×10⁻⁵ × 700 = **3.779×10⁻² kg·m²/s**

---

### 1. Wing Attacker CWD — Wide-Wing Aerodynamic Amplification

The Wing Attacker CWD extends four wide aerodynamic wings at r_CWD = 38 mm. Each wing (A_wing = 2.0×10⁻⁴ m² per wing, C_L = 0.6) generates lift at high spin:

```
v_CWD_tip = ω₀ × r_CWD = 700 × 0.038 = 26.60 m/s

F_lift_CWD = N_wings × ½ × ρ_air × v_CWD_tip² × C_L × A_wing
           = 4 × ½ × 1.225 × 26.60² × 0.6 × 2.0×10⁻⁴
           = 4 × ½ × 1.225 × 707.56 × 1.2×10⁻⁴
           = 4 × 5.199×10⁻² = 0.2080 N

Weight: W = m × g = 0.0455 × 9.81 = 0.4465 N

Lift fraction: F_lift_CWD / W = 0.2080 / 0.4465 = 46.6%
```

Effective gravity during ascent:

```
g_eff_MF = g × (1 − F_lift_CWD / W) = 9.81 × (1 − 0.466) = 9.81 × 0.534 = 5.239 m/s²
```

---

### 2. Bowl-Exit Trajectory — Phoenix Fire Ascent

Dranzer MF uses the bowl wall (θ = 65°) for maximum vertical launch:

```
v_orbital_MF = μ_flat × ω₀ × r_BB = 0.35 × 700 × 0.003 = 0.735 m/s

v_z_MF = v_orbital_MF × tan(65°) = 0.735 × 2.145 = 1.577 m/s

h_apex_MF = v_z_MF² / (2 × g_eff_MF) = 1.577² / (2 × 5.239) = 2.487 / 10.478 = 237.3 mm ≈ 237 mm
```

Descent (full g, CWD lift diminished as spin decays at apex):

```
v_descent_MF = √(2 × g × h_apex_MF) = √(2 × 9.81 × 0.2373) = √(4.655) = 2.157 m/s

v_impact_MF = √(v_orbital_MF² + v_descent_MF²) = √(0.735² + 2.157²) = √(0.5402 + 4.6527) = √5.193 = 2.279 m/s
```

**Metal Flat Base spin decay:**

```
τ_MFB  = μ_flat × m × g × r_BB = 0.35 × 0.0455 × 9.81 × 0.003 = 4.698×10⁻⁴ N·m
t_spin = L₀ / τ_MFB = 3.779×10⁻² / 4.698×10⁻⁴ = 80.4 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 45.5 g |
| I_total | 5.398×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 3.779×10⁻² kg·m²/s |
| v_CWD_tip | 26.60 m/s |
| F_lift_CWD | 0.2080 N |
| Lift fraction | 46.6% |
| g_eff_MF | 5.239 m/s² |
| v_orbital_MF | 0.735 m/s |
| v_z_MF | 1.577 m/s |
| h_apex_MF | 237 mm |
| v_descent_MF | 2.157 m/s |
| v_impact_MF | 2.279 m/s |
| τ_MFB | 4.698×10⁻⁴ N·m |
| t_spin | 80.4 s |

---

## Case 1917 — SPECIAL: The End of Fire — Kai Hiwatari / Dranzer MF

**Blader:** Kai Hiwatari | **Beyblade:** Dranzer MF (Wing Attacker CWD) | **Type:** attack

### Description

The End of Fire (Japanese: 爆風炎撃, Bakufū Engeki — "Explosive Wind Fire Strike") is a Special Move used by Kai Hiwatari with his Dranzer MF Beyblade, debuting in the final chapter of the Bakuten Shoot Beyblade manga. Kai and Dranzer combine their full power into a swirling mass of fire — Dranzer rises from the flames like a phoenix reborn and descends in a catastrophic explosive strike. The Wing Attacker CWD provides massive aerodynamic lift that launches Dranzer to an unprecedented apex height of 237 mm, and the descent impacts with full gravitational energy amplified by the CWD mass. The explosion looks like Dranzer rising from its own ashes, combining the power of both Kai and Dranzer in a final burst.

### Stage — CWD Wing-Lift Phoenix Ascent + Catastrophic Fire-Column Descent

From Case 1916: v_impact_MF = 2.279 m/s, e = 0.80 (maximum energy — manga finale move, hardest ABS/metal contact).

```
m_eff = (m_DMF × m_opp) / (m_DMF + m_opp) = (0.0455 × 0.038) / (0.0455 + 0.038)
      = 1.729×10⁻³ / 0.0835 = 2.071×10⁻² kg

J_endfire = m_eff × (1 + e) × v_impact_MF
          = 2.071×10⁻² × 1.80 × 2.279
          = 2.071×10⁻² × 4.1022 = 8.495×10⁻² N·s

Δv_opp = J_endfire / m_opp = 8.495×10⁻² / 0.038 = 2.235 m/s
```

**Effect on Dranzer MF (spin drain):**

```
Δω_DMF   = J_endfire × r_contact / I_DMF = 8.495×10⁻² × 0.035 / 5.398×10⁻⁵ = 55.1 rad/s
ω_remain = 700 − 55.1 = 644.9 rad/s  (92.1% retained)
```

---

**[M] BeySpirit amplification:**
Kai and Dranzer's spirits fully merge into one at the climax of the manga — the Wing Attacker CWD ignites with all of Dranzer's fire energy as the phoenix rises from the ashes and descends in a catastrophic explosion that consumes the entire arena in flame.

[M] factor = **9.0 ×** (Kai + Dranzer ultimate dual-spirit fusion — manga finale)
[M] Δv = 2.235 × 9.0 = **20.1 m/s** (phoenix fire annihilation)

> **Note:** Physical values describe Wing Attacker CWD 4-wing lift F=0.2080 N (46.6% weight), g_eff=5.239 m/s², bowl launch v_z=1.577 m/s, h_apex=237 mm, v_impact=2.279 m/s, impulse J=8.495×10⁻² N·s, Δv=2.235 m/s. [M] values represent Kai and Dranzer's ultimate spirit fusion in the manga finale — a dual-spirit phoenix fire explosion. Combos do not receive [M] amplification.

### TypeScript

```typescript
function endOfFireSpecial(bey: Beyblade, target: Beyblade): void {
  // CWD 4-wing lift 46.6%→g_eff=5.239m/s²; bowl launch h_apex=237mm; v_impact=2.279m/s; J=8.495×10⁻²N·s; [M] 9.0×
  const J_phys = 0.08495;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 9.0; // [M] BeySpirit 9.0× (Kai+Dranzer ultimate dual-spirit manga finale)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a Wing Attacker CWD (or equivalent maximum-radius aerodynamic weight disk, r_CWD ≥ 36 mm, 4+ wings, A_wing ≥ 1.8×10⁻⁴ m², F_lift ≥ 0.18 N) combined with a flat-contact Metal Base (μ ≥ 0.30) and a large-radius AR (r_AR ≥ 30 mm) on a bowl wall θ ≥ 60°. CWD lift fraction must reach ≥ 40% of weight for valid phoenix ascent. Standard game instance: Dranzer MF with Wing Attacker CWD (Kai Hiwatari, Bakuten Shoot manga finale).

---

## Case 1918 — COMBO: Ash Rise — Dranzer MF

**Sequence:** ↑ ↑ A (moveUp · moveUp · attack)
**Cost:** 35 | **Type:** attack | **Blader:** Kai Hiwatari

### Physics Justification

The first moveUp (↑) launches Dranzer MF onto the bowl wall in rising-flame mode — partial CWD lift elevation (h_partial_1 = h_apex_MF × 0.25 = 237 × 0.25 = 59.3 mm):

```
v_z_1 = √(2 × g_eff_MF × h_partial_1) = √(2 × 5.239 × 0.0593) = √(0.6213) = 0.7882 m/s

v_descent_1 = √(2 × g × h_partial_1) = √(2 × 9.81 × 0.0593) = √(1.164) = 1.079 m/s
```

The second moveUp (↑) is the Dranzer ash-rise — Dranzer ascends from the bowl a second time using the residual CWD lift, reaching second-stage height (h_partial_2 = h_apex_MF × 0.50 = 118.5 mm):

```
v_z_2 = √(2 × g_eff_MF × h_partial_2) = √(2 × 5.239 × 0.1185) = √(1.2417) = 1.1143 m/s

v_descent_2 = √(2 × g × h_partial_2) = √(2 × 9.81 × 0.1185) = √(2.325) = 1.525 m/s
```

The attack (A) fires the combined dual-stage descent strike:

```
v_impact_ash = √(v_orbital_MF² + v_descent_2²) = √(0.735² + 1.525²) = √(0.5402 + 2.3256) = √2.8658 = 1.693 m/s

J_ash = m_eff × (1 + e) × v_impact_ash = 2.071×10⁻² × 1.80 × 1.693
      = 2.071×10⁻² × 3.0474 = 6.311×10⁻² N·s
```

The Metal Flat Base rebounds on landing with CWD angular momentum transfer (η_CWD = 0.32):

```
Δω = η_CWD × J_ash × r_contact / I_DMF
   = 0.32 × 6.311×10⁻² × 0.035 / 5.398×10⁻⁵
   = 0.32 × 2.209×10⁻³ / 5.398×10⁻⁵
   = 0.32 × 40.92
   = +13.1 rad/s  ≈ +13 rad/s
```

(η_CWD = 0.32: Wing Attacker CWD angular momentum transfer on MFB rebound.) The dual-stage phoenix ascent and fire descent gives damageMultiplier **1.40×**. lockMs = 200 (fire column dwell — ash impact hold).

**Parameters:**
- spinGain: +13 rad/s (CWD angular momentum transfer η = 0.32)
- damageMultiplier: 1.40 (dual-stage phoenix fire descent)
- lockMs: 200 (ash impact fire column dwell)

### TypeScript

```typescript
function ashRiseCombo(bey: Beyblade, target: Beyblade): void {
  // CWD rebound: Δω ≈ +13 rad/s (η=0.32, dual-stage h→118.5mm, J=6.311×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 13);
  // Dual-stage phoenix fire descent: 1.40× normal impulse
  bey.damageMultiplier = 1.40;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.40, (dy / dist) * 0.40);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.40 | ✓ |
| lockMs | ≤ 300 | 200 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +13 rad/s (partial) | ✓ |



---

## Case 1919 — GIMMICK: Dragoon GT & Strata Dragoon MS (HMS) — Phase-Locked Dual Rankine Tornado

**Beyblades:** Dragoon GT (HMS) × Tyson Granger; Strata Dragoon MS (HMS) × Daichi Sumeragi
**Series:** Beyblade: G-Revolution (Bakuten Shoot Season 3)

### Assembly — Dragoon GT (HMS)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Metal Attack Ring | Dragoon GT | 11.0 | 32.0 |
| Body | HMS Cylinder | 8.5 | 18.0 |
| Running Core | Semi-Flat RC | 3.0 | 4.0 |
| **Total** | | **22.5** | |

(Bit Chip ~1.0 g excluded per plastic-gen convention. HMS = Hard Metal System; aluminum alloy MAR replaces plastic AR; Running Core replaces WD+SG+BB in a single shaft unit.)

**I_DGT** = 11.0×10⁻³ × 0.032² + 8.5×10⁻³ × 0.018² + 3.0×10⁻³ × 0.004²
          = 1.126×10⁻⁵ + 2.754×10⁻⁶ + 4.80×10⁻⁸
          = **1.406×10⁻⁵ kg·m²**

ω₀ = 750 rad/s (HMS standard launch — lighter aluminum → higher exit velocity)
L₀_DGT = I_DGT × ω₀ = 1.406×10⁻⁵ × 750 = **1.055×10⁻² kg·m²/s**

### Assembly — Strata Dragoon MS (HMS)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Metal Attack Ring | Strata Dragoon | 10.5 | 30.0 |
| Body | HMS Cylinder | 8.0 | 16.0 |
| Running Core | Semi-Flat RC | 3.0 | 4.0 |
| **Total** | | **21.5** | |

**I_SDM** = 10.5×10⁻³ × 0.030² + 8.0×10⁻³ × 0.016² + 3.0×10⁻³ × 0.004²
          = 9.450×10⁻⁶ + 2.048×10⁻⁶ + 4.80×10⁻⁸
          = **1.155×10⁻⁵ kg·m²**

ω₀ = 750 rad/s
L₀_SDM = 1.155×10⁻⁵ × 750 = **8.663×10⁻³ kg·m²/s**

---

### 1. Semi-Flat RC — Fast Orbital Drive & Spin Decay

Both HMS beys use identical Semi-Flat Running Cores (μ_RC = 0.35, r_RC = 4 mm) driving fast, aggressive orbital motion:

```
v_orbital = μ_RC × ω₀ × r_RC = 0.35 × 750 × 0.004 = 1.050 m/s

τ_flat_DGT = μ_RC × m_DGT × g × r_RC = 0.35 × 0.0225 × 9.81 × 0.004 = 3.090×10⁻⁴ N·m
t_spin_DGT = L₀_DGT / τ_flat_DGT = 1.055×10⁻² / 3.090×10⁻⁴ = 34.1 s

τ_flat_SDM = 0.35 × 0.0215 × 9.81 × 0.004 = 2.953×10⁻⁴ N·m
t_spin_SDM = 8.663×10⁻³ / 2.953×10⁻⁴ = 29.3 s
```

Equal orbital speed (v_orbital = 1.050 m/s for both) means both beys circuit the bowl at the same rate — a prerequisite for maintaining phase lock.

---

### 2. Phase-Locked Dual Rankine Tornado — Synchronization & Constructive Interference

Each MAR generates a Rankine vortex. When phase-locked (same ω, same orbital position offset = 180°):

```
v_tip_DGT = ω₀ × r_MAR_DGT = 750 × 0.032 = 24.00 m/s
Γ_DGT     = 2π × v_tip_DGT × r_MAR_DGT = 2π × 24.00 × 0.032 = 4.825 m²/s

v_tip_SDM = ω₀ × r_MAR_SDM = 750 × 0.030 = 22.50 m/s
Γ_SDM     = 2π × v_tip_SDM × r_MAR_SDM = 2π × 22.50 × 0.030 = 4.241 m²/s

Γ_combined = Γ_DGT + Γ_SDM = 4.825 + 4.241 = 9.066 m²/s  (phase-locked constructive sum)
```

Synchronized force at r_opp = 75 mm (combined tornado interaction radius):

```
v_combo = Γ_combined / (2π × r_opp) = 9.066 / (2π × 0.075) = 19.24 m/s

q_combo  = ½ × ρ_air × v_combo² = ½ × 1.225 × 19.24² = 226.7 Pa

F_twin   = q_combo × A_opp = 226.7 × π × 0.020² = 226.7 × 1.257×10⁻³ = 0.2850 N
```

**Sync amplification vs. non-synchronized sum:**

```
F_DGT_nonsync = (½×1.225×(4.825/0.4712)²) × 1.257×10⁻³ = 64.23×1.257×10⁻³ = 0.08074 N
F_SDM_nonsync = (½×1.225×(4.241/0.4712)²) × 1.257×10⁻³ = 49.61×1.257×10⁻³ = 0.06235 N
F_sum_nonsync = 0.08074 + 0.06235 = 0.1431 N

Sync factor: F_twin / F_sum_nonsync = 0.2850 / 0.1431 = 1.992 ≈ 2.0×
```

Synchronization nearly doubles the tornado force — this is why Tyson must adjust his spin to match Daichi's. If Tyson's tornado breaks phase (as in the F-Dynasty battle), the combined vortex collapses to single-bey output (F_SDM = 0.06235 N alone — insufficient to sustain the column).

### Key Parameters Summary

| Quantity | Dragoon GT | Strata Dragoon MS |
|---------|-----------|------------------|
| m | 22.5 g | 21.5 g |
| I_total | 1.406×10⁻⁵ kg·m² | 1.155×10⁻⁵ kg·m² |
| ω₀ | 750 rad/s | 750 rad/s |
| L₀ | 1.055×10⁻² kg·m²/s | 8.663×10⁻³ kg·m²/s |
| v_tip | 24.00 m/s | 22.50 m/s |
| Γ | 4.825 m²/s | 4.241 m²/s |
| τ_flat | 3.090×10⁻⁴ N·m | 2.953×10⁻⁴ N·m |
| t_spin | 34.1 s | 29.3 s |

| Combined quantity | Value |
|-----------------|-------|
| Γ_combined | 9.066 m²/s |
| v_combo (r=75mm) | 19.24 m/s |
| F_twin | 0.2850 N |
| Sync factor | ≈ 2.0× |
| v_orbital (both) | 1.050 m/s |

---

## Case 1920 — SPECIAL: Twin Tornado Attack — Tyson & Daichi / Dragoon GT & Strata Dragoon MS

**Bladers:** Tyson Granger + Daichi Sumeragi | **Beyblades:** Dragoon GT + Strata Dragoon MS | **Type:** attack (co-blader)

### Description

Twin Tornado Attack (Japanese: ツイントルネードアタック) is a powerful co-blader Special Move used by Tyson Granger and Daichi Sumeragi with their Dragoon GT and Strata Dragoon MS HMS beyblades. Tyson adjusts Dragoon GT's rotational speed to exactly match Strata Dragoon MS's, phase-locking their orbital paths 180° apart in the arena. The two synchronized vortices combine into a single massive Rankine super-tornado — nearly twice as powerful as the sum of the individual tornados — and travel together toward the opponent in a convergent column of sand and wind. When Tyson breaks synchronization for a moment in the fight against the F-Dynasty team, both tornados collapse simultaneously, demonstrating the critical role of phase lock. The attack first appeared in Beyblade G-Revolution, episode "A Champion's Not Easy".

### Stage — Phase-Locked Dual Tornado Strike (t_wave = 0.30 s)

From Case 1919: F_twin = 0.2850 N (synchronized Γ_combined = 9.066 m²/s at r_opp = 75 mm).

```
J_twin = F_twin × t_wave = 0.2850 × 0.30 = 8.550×10⁻² N·s

Δv_opp = J_twin / m_opp = 8.550×10⁻² / 0.038 = 2.250 m/s
```

**Effect on Dragoon GT (spin drain — shared equally):**

```
Δω_DGT    = (J_twin/2) × r_contact / I_DGT = 4.275×10⁻² × 0.025 / 1.406×10⁻⁵ = 76.0 rad/s
ω_remain_DGT = 750 − 76.0 = 674.0 rad/s  (89.9% retained)
```

**Effect on Strata Dragoon MS (spin drain):**

```
Δω_SDM    = (J_twin/2) × r_contact / I_SDM = 4.275×10⁻² × 0.025 / 1.155×10⁻⁵ = 92.5 rad/s
ω_remain_SDM = 750 − 92.5 = 657.5 rad/s  (87.7% retained)
```

---

**[M] BeySpirit amplification:**
Dragoon and Strata Dragoon's Bit-Beasts fully manifest as twin dragon-wind spirits — the two synchronized tornado columns become living tempests of pure BeySpirit energy that annihilate the opponent's stability across the entire arena floor.

[M] factor = **8.0 ×** (Tyson + Daichi co-blader dual Dragoon spirit)
[M] Δv = 2.250 × 8.0 = **18.0 m/s** (twin tornado ring-out)

> **Note:** Physical values describe phase-locked Γ_combined=9.066 m²/s at r=75mm → F=0.2850 N×0.30s → J=8.550×10⁻² N·s, Δv=2.250 m/s; sync factor ≈ 2.0× vs non-sync sum. DGT spin drain 76.0 rad/s, SDM spin drain 92.5 rad/s. [M] values represent Tyson and Daichi's dual Dragoon spirits fusing the synchronized vortices into a living twin tornado catastrophe. Combos do not receive [M] amplification.

### TypeScript

```typescript
function twinTornadoAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // Phase-locked Γ_combined=9.066m²/s→F=0.2850N×0.30s→J=8.550×10⁻²N·s; sync 2.0× vs nonsync; [M] 8.0×
  const J_phys = 0.08550;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Tyson+Daichi dual Dragoon spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any pair of beyblades using HMS-class Metal Attack Rings (r_MAR ≥ 28 mm, Γ ≥ 3.5 m²/s each) with identical flat-contact Running Cores (μ ≥ 0.30, v_orbital equal ±5%) such that both beys circuit the bowl at the same rate. Both bladers must launch simultaneously and maintain phase lock throughout (both beys at identical ω). Standard game instance: Dragoon GT + Strata Dragoon MS (Tyson Granger + Daichi Sumeragi, G-Revolution).

---

## Case 1921 — COMBO: Cyclone Spiral — Dragoon GT

**Sequence:** → ↑ A (moveRight · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Tyson Granger

### Physics Justification

The moveRight (→) drives Dragoon GT into its fast flat-RC orbital approach (v_orbital = 1.050 m/s):

```
v_approach = v_orbital = 1.050 m/s
```

The moveUp (↑) deflects the approach into a bowl-wall ascent (θ = 45°):

```
v_z = v_approach × tan(45°) = 1.050 × 1.0 = 1.050 m/s

h_apex = v_z² / (2g) = 1.050² / (2 × 9.81) = 1.1025 / 19.62 = 56.2 mm

v_descent = √(2g × h_apex) = √(2 × 9.81 × 0.0562) = 1.050 m/s
```

The attack (A) fires the bowl-descent overhead smash at combined v_impact:

```
v_impact = √(v_approach² + v_descent²) = √(1.050² + 1.050²) = √2.2050 = 1.485 m/s

m_eff_DGT = (m_DGT × m_opp) / (m_DGT + m_opp) = (0.0225 × 0.038) / (0.0225 + 0.038)
           = 8.550×10⁻⁴ / 0.0605 = 1.413×10⁻² kg

J_cyclone = m_eff_DGT × (1 + e) × v_impact  [e = 0.75, hard aluminum MAR]
          = 1.413×10⁻² × 1.75 × 1.485
          = 1.413×10⁻² × 2.5988 = 3.673×10⁻² N·s
```

The Semi-Flat RC rebounds on landing, reconverting smash recoil to spin (η_RC = 0.28, metal-on-metal contact):

```
Δω = η_RC × J_cyclone × r_contact / I_DGT
   = 0.28 × 3.673×10⁻² × 0.025 / 1.406×10⁻⁵
   = 0.28 × 9.183×10⁻⁴ / 1.406×10⁻⁵
   = 0.28 × 65.31
   = +18.3 rad/s  ≈ +18 rad/s
```

(η_RC = 0.28: Semi-Flat metal Running Core rebound reconversion. Higher per-radian gain vs MFB due to HMS lower I.) Bowl-ascent overhead descent smash gives damageMultiplier **1.25×**. lockMs = 0 (pure attack dash).

**Parameters:**
- spinGain: +18 rad/s (Semi-Flat RC metal rebound η = 0.28)
- damageMultiplier: 1.25 (bowl-ascent aerial descent smash)
- lockMs: 0 (pure attack mobility)

### TypeScript

```typescript
function cycloneSpiralCombo(bey: Beyblade, target: Beyblade): void {
  // Semi-Flat RC rebound: Δω ≈ +18 rad/s (η=0.28, h=56.2mm, v_impact=1.485m/s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 18);
  // Bowl-ascent aerial descent smash: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +18 rad/s (partial) | ✓ |



---

## Case 1922 — GIMMICK: Blizzard Orthrus (Metal Fury) — Dual-Spin Crystalline Freeze Ring

**Beyblade:** Blizzard Orthrus 145D (Metal Fury / 4D System)
**Blader:** Gordo | **Series:** Beyblade Metal Fury (4D System)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Face Bolt | Orthrus face | 1.5 | 3.0 |
| Energy Ring | Orthrus | 3.5 | 38.0 |
| Fusion Wheel | Blizzard | 28.5 | 35.0 |
| Spin Track | 145 | 4.0 | 10.0 |
| Performance Tip | Defense (D) | 2.5 | 4.0 |
| **Total** | | **40.0** | |

(Face Bolt included; 4D convention.)

**I_total** = 1.5×10⁻³ × 0.003² + 3.5×10⁻³ × 0.038² + 28.5×10⁻³ × 0.035² + 4.0×10⁻³ × 0.010² + 2.5×10⁻³ × 0.004²
           = 1.35×10⁻⁸ + 5.054×10⁻⁶ + 3.491×10⁻⁵ + 4.00×10⁻⁷ + 4.00×10⁻⁸
           = **4.044×10⁻⁵ kg·m²**

ω₀ = 600 rad/s (MFB/4D standard launch for defense-type)
L₀ = I × ω₀ = 4.044×10⁻⁵ × 600 = **2.426×10⁻² kg·m²/s**

---

### 1. Blizzard Fusion Wheel — Dual-Blade Ring Contact

The Blizzard Fusion Wheel has two large bladed wings that create a contact perimeter at r = 35 mm. On contact the high-mass wheel applies smash force via blade leading edges (e = 0.72, ABS/metal hybrid):

```
v_tip = ω₀ × r_FW = 600 × 0.035 = 21.00 m/s

Contact-zone width per blade: w_blade = 12 mm = 0.012 m
Blade span (axial, per blade): h_blade = 5 mm = 0.005 m
A_blade = 0.012 × 0.005 = 6.0×10⁻⁵ m² (per blade)
N_blades = 2

F_blade_total = N_blades × ½ × ρ_air × v_tip² × C_D × A_blade
              = 2 × ½ × 1.225 × 441.00 × 1.2 × 6.0×10⁻⁵
              = 2 × 1.947×10⁻² = 3.894×10⁻² N
```

---

### 2. Freeze Aura — Crystalline Ice Surface & Friction Modulation

The Orthrus Energy Ring (ER) has a ridged crystalline texture. At v_tip the surface creates a localized low-temperature boundary layer (Gordo's ice-element BeySpirit). For physics purposes this is modeled as increased contact stiction via modified friction:

```
μ_D_standard = 0.08  (Defense tip — low friction, large flat face)
μ_D_freeze   = 0.13  (ice-aura contact stiction at low relative motion)

τ_D_freeze = μ_D_freeze × m × g × r_D
           = 0.13 × 0.040 × 9.81 × 0.004
           = 2.043×10⁻⁴ N·m

t_spin = L₀ / τ_D_freeze = 2.426×10⁻² / 2.043×10⁻⁴ = 118.7 s ≈ 119 s
```

(Freeze-aura Defense tip extends spin survival time compared to a standard D at μ=0.08: t_spin_std = 2.426×10⁻² / (0.08×0.040×9.81×0.004) = 193.5 s; freeze-aura mode μ effectively doubles friction for an opposing bey caught in the ice field — see Case 1924.)

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 40.0 g |
| I_total | 4.044×10⁻⁵ kg·m² |
| ω₀ | 600 rad/s |
| L₀ | 2.426×10⁻² kg·m²/s |
| v_tip | 21.00 m/s |
| F_blade_total | 3.894×10⁻² N |
| μ_D_freeze | 0.13 |
| τ_D_freeze | 2.043×10⁻⁴ N·m |
| t_spin | 119 s |

---

## Case 1923 — SPECIAL: Twin Spire — Gordo / Blizzard Orthrus

**Blader:** Gordo | **Beyblade:** Blizzard Orthrus 145D | **Type:** stamina (freeze-drain)

### Description

Twin Spire is a Special Move used by Gordo and his Blizzard Orthrus Beyblade. Orthrus channels his icy breath through the dual-bladed Fusion Wheel, encasing the opponent in a glacial freeze field that saps their rotation and traps them in place. The frozen opponent loses speed and power while Orthrus continues spinning freely, its Defense tip sustaining rotation long after the opponent grinds to a halt. The name "Twin Spire" refers to the two blade-spires of the Blizzard wheel rotating like twin pillars of ice.

### Stage — Freeze-Drain Contact (Ice Aura Friction Amplification)

From Case 1922: twin blade contact F=3.894×10⁻² N, v_tip=21.00 m/s. Freeze aura doubles the opponent's effective spin-friction coefficient upon contact (ice-coating immobilizes tip against arena surface, μ_opp→2.0× standard).

```
v_rel = v_tip − v_opp_tip = 21.00 − 18.00 = 3.00 m/s
(opponent at 600 rad/s × r_opp=0.030 m = 18.00 m/s orbital contribution)

m_eff = (m_O × m_opp) / (m_O + m_opp)
      = (0.040 × 0.038) / (0.040 + 0.038)
      = 1.520×10⁻³ / 0.078 = 1.949×10⁻² kg

J_twinspire = m_eff × (1 + e) × v_rel
            = 1.949×10⁻² × (1 + 0.72) × 3.00
            = 1.949×10⁻² × 5.160 = 1.005×10⁻¹ N·s

Δv_opp = J_twinspire / m_opp = 1.005×10⁻¹ / 0.038 = 2.645 m/s

Freeze immobilization: opponent tip friction ×2 during freeze dwell (t_freeze = 0.8s):
τ_freeze_opp = 2.0 × 0.35 × 0.038 × 9.81 × 0.003 = 7.806×10⁻⁴ N·m
Δω_freeze = τ_freeze_opp × t_freeze / I_opp
          = 7.806×10⁻⁴ × 0.8 / 1.8×10⁻⁵ = 34.7 rad/s (additional spin drain on frozen opponent)
```

**Effect on Blizzard Orthrus (spin loss from contact):**

```
Δω_O = J_twinspire × r_contact / I_O
      = 1.005×10⁻¹ × 0.035 / 4.044×10⁻⁵ = 86.9 rad/s
ω_remain = 600 − 86.9 = 513.1 rad/s  (85.5% retained)
```

---

**[M] BeySpirit amplification:**
Gordo's Orthrus Bit-Beast channels both heads in unison — the ice aura erupts into twin crystalline spires that tower over the stadium and encase the opponent completely, draining all momentum in a glacial prison while Orthrus spins untouched at the center.

[M] factor = **7.0 ×** (Gordo — Blizzard Orthrus ice-twin spirit, Metal Fury 4D special)
[M] Δv = 2.645 × 7.0 = **18.5 m/s** (glacial freeze ring-out / immobilization)

> **Note:** Physical values describe blade contact F=3.894×10⁻² N, J=1.005×10⁻¹ N·s, Δv=2.645 m/s, freeze drain Δω=34.7 rad/s over 0.8s. [M] values represent Gordo's dual Orthrus ice spirits encasing the opponent in a glacial prison. Combos do not receive [M] amplification.

### TypeScript

```typescript
function twinSpireSpecial(bey: Beyblade, target: Beyblade): void {
  // Blade contact J=1.005×10⁻¹ N·s; freeze drain Δω=34.7 rad/s over 0.8s; [M] 7.0×
  const J_phys = 0.1005;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Gordo Orthrus ice-twin spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
  // Freeze drain: additional spin loss on opponent
  target.spin = Math.max(0, target.spin - 34.7);
}
```

**Compatible beys:** Any beyblade using a high-mass Fusion Wheel (≥ 26 g) with dual blade-type contact points at r_FW ≥ 33 mm and a large-face Defense or similar low-friction tip (μ ≤ 0.15), where the Energy Ring has a ridged/crystalline profile for freeze-aura contact stiction amplification. Standard game instance: Blizzard Orthrus 145D (Gordo, Metal Fury).

---

## Case 1924 — COMBO: Ice Spire Lock — Blizzard Orthrus

**Sequence:** K A K (defense · attack · defense)
**Cost:** 15 | **Type:** stamina | **Blader:** Gordo

### Physics Justification

The first defense (K) activates the freeze-aura contact posture — Orthrus angles the dual blades outward while the D tip anchors (zero drift μ_D_freeze = 0.13). The attack (A) delivers the twin-blade smash during freeze contact. The second defense (K) closes with the freeze-lock follow-through that immobilizes the opponent tip.

```
Blade contact during A phase:
v_tip_combo = ω₀ × 0.85 × r_FW = 600 × 0.85 × 0.035 = 17.85 m/s
(85% partial orbit, mid-position strike)

v_rel_combo = 17.85 − 15.30 = 2.55 m/s
(opponent at 600×0.85×0.030 = 15.30 m/s)

J_combo = m_eff × (1 + e) × v_rel_combo
        = 1.949×10⁻² × 1.72 × 2.55
        = 1.949×10⁻² × 4.386 = 8.549×10⁻² N·s

Δv_combo = J_combo / m_opp = 8.549×10⁻² / 0.038 = 2.250 m/s
```

The final defense (K) adds freeze-lock dwell: immobilizes opponent tip for lockMs=150 ms (modeled as full-friction ground contact during dwell). Δω_K2 on Orthrus from dwell reaction:

```
τ_K2 = μ_D_freeze × m_O × g × r_D = 0.13 × 0.040 × 9.81 × 0.004 = 2.043×10⁻⁴ N·m
Δω_K2_own = τ_K2 × 0.15 / I_O = 2.043×10⁻⁴ × 0.15 / 4.044×10⁻⁵ = +0.76 rad/s ≈ +1 rad/s
(D-tip freeze-lock dwell self-sustains spin; negligible but positive)
```

spinGain: +1 rad/s (freeze-lock D-tip self-sustain). damageMultiplier: **1.20×** (freeze-blade smash with lock follow-through). lockMs: 150 (freeze-lock dwell on landing K).

**Parameters:**
- spinGain: +1 rad/s (D-tip freeze dwell)
- damageMultiplier: 1.20 (twin-blade freeze smash)
- lockMs: 150 (freeze-lock dwell)

### TypeScript

```typescript
function iceSpireLockCombo(bey: Beyblade, target: Beyblade): void {
  // Freeze-lock dwell: Δω ≈ +1 rad/s (D-tip μ=0.13, t=0.15s); J_combo=8.549×10⁻²N·s
  bey.spin = Math.min(bey.maxSpin, bey.spin + 1);
  // Twin-blade freeze smash + lock follow-through: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +1 rad/s (negligible) | ✓ |



---

## Case 1925 — GIMMICK: Rapid Eagle (Metal Masters) — Dual Saber-Blade Aerial Dive

**Beyblade:** Rapid Eagle (Metal Fusion / Metal Masters)
**Blader:** Claude | **Series:** Beyblade Metal Masters

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Face Bolt | Eagle face | 1.5 | 3.0 |
| Energy Ring | Eagle | 3.5 | 37.0 |
| Fusion Wheel | Rapid | 24.0 | 33.0 |
| Spin Track | H145 | 3.5 | 10.0 |
| Performance Tip | Flat (F) | 2.0 | 3.0 |
| **Total** | | **34.5** | |

(Face Bolt included; MFB convention.)

**I_total** = 1.5×10⁻³ × 0.003² + 3.5×10⁻³ × 0.037² + 24.0×10⁻³ × 0.033² + 3.5×10⁻³ × 0.010² + 2.0×10⁻³ × 0.003²
           = 1.35×10⁻⁸ + 4.792×10⁻⁶ + 2.614×10⁻⁵ + 3.500×10⁻⁷ + 1.80×10⁻⁸
           = **3.131×10⁻⁵ kg·m²**

ω₀ = 630 rad/s (MFB attack-type standard launch)
L₀ = I × ω₀ = 3.131×10⁻⁵ × 630 = **1.973×10⁻² kg·m²/s**

---

### 1. Rapid Fusion Wheel — Dual Saber-Blade Lift

The Rapid Fusion Wheel carries two swept saber-blade protrusions (N_blades = 2) at r = 33 mm. Each blade has a cambered cross-section (C_L = 0.70) generating aerodynamic lift on high-speed orbital approach. Blade projected area per saber: A_saber = 1.0×10⁻⁴ m².

```
v_tip = ω₀ × r_FW = 630 × 0.033 = 20.79 m/s

F_lift_saber = N_blades × ½ × ρ_air × v_tip² × C_L × A_saber
             = 2 × ½ × 1.225 × 20.79² × 0.70 × 1.0×10⁻⁴
             = 2 × ½ × 1.225 × 432.2 × 7.0×10⁻⁵
             = 2 × 1.857×10⁻² = 3.714×10⁻² N

Weight: W = m × g = 0.0345 × 9.81 = 0.3386 N

Lift fraction: F_lift / W = 3.714×10⁻² / 0.3386 = 10.97% ≈ 11%
```

Effective gravity during ascent (saber lift opposes gravity):

```
g_eff = g × (1 − F_lift / W) = 9.81 × (1 − 0.1097) = 9.81 × 0.8903 = 8.733 m/s²
```

---

### 2. Bowl-Exit Trajectory — Aerial Apex & Dual-Saber Descent Strike

Rapid Eagle uses the bowl wall (θ = 55°) to redirect into a vertical aerial launch:

```
v_orbital = μ_F × ω₀ × r_F = 0.40 × 630 × 0.003 = 0.756 m/s

v_z = v_orbital × tan(55°) = 0.756 × 1.428 = 1.080 m/s

Apex height (under g_eff — saber lift active during ascent):
h_apex = v_z² / (2 × g_eff) = 1.080² / (2 × 8.733) = 1.1664 / 17.466 = 66.8 mm

Descent velocity (full g — lift decays at apex):
v_descent = √(2 × g × h_apex) = √(2 × 9.81 × 0.0668) = √(1.311) = 1.145 m/s

Combined impact velocity (orbital + descent):
v_impact = √(v_orbital² + v_descent²) = √(0.756² + 1.145²) = √(0.5715 + 1.3110) = √1.8825 = 1.372 m/s
```

**Flat-tip spin decay:**

```
τ_F  = μ_F × m × g × r_F = 0.40 × 0.0345 × 9.81 × 0.003 = 4.073×10⁻⁴ N·m
t_spin = L₀ / τ_F = 1.973×10⁻² / 4.073×10⁻⁴ = 48.4 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 34.5 g |
| I_total | 3.131×10⁻⁵ kg·m² |
| ω₀ | 630 rad/s |
| L₀ | 1.973×10⁻² kg·m²/s |
| v_tip | 20.79 m/s |
| F_lift_saber | 3.714×10⁻² N |
| Lift fraction | 11% |
| g_eff | 8.733 m/s² |
| v_orbital | 0.756 m/s |
| v_z | 1.080 m/s |
| h_apex | 66.8 mm |
| v_descent | 1.145 m/s |
| v_impact | 1.372 m/s |
| τ_F | 4.073×10⁻⁴ N·m |
| t_spin | 48.4 s |

---

## Case 1926 — SPECIAL: Twin Saber — Claude / Rapid Eagle

**Blader:** Claude | **Beyblade:** Rapid Eagle | **Type:** attack

### Description

Twin Saber (also known as Killer Eagle) is a Special Move used by Claude and his Rapid Eagle Beyblade. Rapid Eagle rides the bowl wall at high orbital speed, its dual saber-blade Fusion Wheel generating lift that extends the aerial apex. From above the stadium Rapid Eagle banks and dives blade-first at blinding speed, the two saber protrusions slashing across the opponent in a twin-cutting strike. The move was first used against Rock Bison. The aerial approach mirrors the flight of a hunting eagle — a high-altitude stoop that converts maximum potential energy into cutting impact.

### Stage — Bowl-Wall Launch + Dual Saber Descent Strike

From Case 1925: v_impact = 1.372 m/s (orbital + saber lift + full-g descent), e = 0.74 (sharp ABS saber blades).

```
m_eff = (m_E × m_opp) / (m_E + m_opp) = (0.0345 × 0.038) / (0.0345 + 0.038)
      = 1.311×10⁻³ / 0.0725 = 1.808×10⁻² kg

J_twinsaber = m_eff × (1 + e) × v_impact
            = 1.808×10⁻² × 1.74 × 1.372
            = 1.808×10⁻² × 2.387 = 4.316×10⁻² N·s

Δv_opp = J_twinsaber / m_opp = 4.316×10⁻² / 0.038 = 1.136 m/s
```

**Effect on Rapid Eagle (spin drain):**

```
Δω_E  = J_twinsaber × r_contact / I_E = 4.316×10⁻² × 0.033 / 3.131×10⁻⁵ = 45.5 rad/s
ω_remain = 630 − 45.5 = 584.5 rad/s  (92.8% retained)
```

---

**[M] BeySpirit amplification:**
Claude's Rapid Eagle Bit-Beast fully materialises as a blazing hunting eagle — the dual sabers become razor wings of pure spirit energy, and the dive strike multiplies into a killing stoop that punches the opponent clean out of the stadium in a burst of feathered lightning.

[M] factor = **7.0 ×** (Claude — Rapid Eagle spirit, Metal Masters special)
[M] Δv = 1.136 × 7.0 = **7.95 m/s** (eagle stoop ring-out)

> **Note:** Physical values describe saber lift F=3.714×10⁻² N (11% weight), g_eff=8.733 m/s², bowl-wall launch v_z=1.080 m/s, h_apex=66.8 mm, v_impact=1.372 m/s, impulse J=4.316×10⁻² N·s, Δv=1.136 m/s. [M] values represent Claude's Rapid Eagle spirit diving as a razor-winged predator. Combos do not receive [M] amplification.

### TypeScript

```typescript
function twinSaberSpecial(bey: Beyblade, target: Beyblade): void {
  // 2-saber lift 11%→g_eff=8.733m/s²; bowl launch v_z=1.080m/s→h=66.8mm; v_impact=1.372m/s; J=4.316×10⁻²N·s; [M] 7.0×
  const J_phys = 0.04316;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.0; // [M] BeySpirit 7.0× (Claude Rapid Eagle spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any beyblade using a flat-contact Performance Tip (μ ≥ 0.35) combined with a Fusion Wheel carrying 2+ cambered saber-blade protrusions at r_FW ≥ 30 mm generating measurable lift (F_lift ≥ 0.03 N at ω₀ ≥ 600 rad/s), launched via a 45–65° bowl wall for vertical ascent. Standard game instance: Rapid Eagle H145F (Claude, Metal Masters).

---

## Case 1927 — COMBO: Eagle Dive Strike — Rapid Eagle

**Sequence:** ↑ E A (moveUp · dodge · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Claude

### Physics Justification

The moveUp (↑) sends Rapid Eagle up the bowl wall at half-orbit speed (v_partial = v_orbital × 0.55 = 0.756 × 0.55 = 0.4158 m/s). The dodge (E) converts the wall-climb into a tight aerial banking arc — Rapid Eagle angles its saber blades to glide laterally before committing to the dive. With saber lift active this gives partial ascent:

```
v_z_partial = v_partial × tan(55°) = 0.4158 × 1.428 = 0.5938 m/s

h_partial = v_z_partial² / (2 × g_eff) = 0.5938² / (2 × 8.733) = 0.3526 / 17.466 = 20.2 mm
```

The attack (A) fires at descent apex — Rapid Eagle dives dual-saber first:

```
v_descent_partial = √(2 × g × h_partial) = √(2 × 9.81 × 0.0202) = √(0.3963) = 0.6295 m/s

v_impact_partial = √(v_partial² + v_descent_partial²) = √(0.4158² + 0.6295²)
                 = √(0.1729 + 0.3963) = √0.5692 = 0.7545 m/s

J_partial = m_eff × (1 + e) × v_impact_partial = 1.808×10⁻² × 1.74 × 0.7545
          = 1.808×10⁻² × 1.313 = 2.374×10⁻² N·s
```

Saber blade deflection on landing recovers spin (η_saber = 0.25):

```
Δω = η_saber × J_partial × r_contact / I_E
   = 0.25 × 2.374×10⁻² × 0.033 / 3.131×10⁻⁵
   = 0.25 × 25.03
   = +6.3 rad/s  ≈ +6 rad/s
```

(η_saber = 0.25: saber edge deflects recoil into spin.) Partial aerial saber dive gives damageMultiplier **1.25×**. lockMs = 0 (attack type, no dwell).

**Parameters:**
- spinGain: +6 rad/s (saber deflection recoil η = 0.25)
- damageMultiplier: 1.25 (partial aerial dual-saber dive)
- lockMs: 0 (attack type, no dwell)

### TypeScript

```typescript
function eagleDiveStrikeCombo(bey: Beyblade, target: Beyblade): void {
  // Saber recoil: Δω ≈ +6 rad/s (η=0.25, h_partial=20.2mm, J=2.374×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 6);
  // Partial aerial saber dive: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +6 rad/s (partial) | ✓ |



---

## Case 1928 — GIMMICK: Z Achilles 11 Xtend+ (Burst Cho-Z) — Turbo Awakening Dual-Blade Extension

**Beyblade:** Z Achilles 11 Xtend+ / Turbo Achilles 00 Dimension (Beyblade Burst Turbo / Cho-Z)
**Blader:** Aiger Akabane | **Series:** Beyblade Burst Turbo (Cho-Z season)

### Assembly (Z Achilles 11 Xtend+ — primary)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Z Achilles | 24.5 | 34.0 |
| Forge Disc | 11 | 12.0 | 26.0 |
| Driver | Xtend+ | 4.5 | 5.0 |
| **Total** | | **41.0** | |

(No separate face component — Burst era 3-part system. Takara Tomy only per Burst Scope.)

**I_total** = 24.5×10⁻³ × 0.034² + 12.0×10⁻³ × 0.026² + 4.5×10⁻³ × 0.005²
           = 2.832×10⁻⁵ + 8.112×10⁻⁶ + 1.125×10⁻⁷
           = **3.654×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (Burst Cho-Z standard launch)
L₀ = I × ω₀ = 3.654×10⁻⁵ × 580 = **2.120×10⁻² kg·m²/s**

---

### 1. Turbo Awakening — Blade Deployment (Cho-Z Wing Extension)

The Turbo Awakening (超Ƶ覚醒 Chōzetsu Kakusei) deploys the two Turbo Blades (超Ƶウイング, Chōzetsu Wingu) outward from the Energy Layer. These blades serve dual function: dedicated Burst Stoppers (preventing burst by blocking Disc Stoppers) and attack-radius extenders. Only activates when the blader and bey are in perfect synchronisation.

```
Blade retracted radius: r_base = 33 mm
Blade deployed radius:  r_turbo = 37 mm  (+4 mm Turbo Awakening extension)

v_tip_base  = ω₀ × r_base  = 580 × 0.033 = 19.14 m/s
v_tip_turbo = ω₀ × r_turbo = 580 × 0.037 = 21.46 m/s

Blade tip speed gain: Δv_tip = 21.46 − 19.14 = 2.32 m/s  (+12.1%)
```

---

### 2. Dual-Blade Slash Contact — Turbo Whip (Super Z Slash)

Both blades contact the opponent simultaneously in a head-on slash motion. Relative velocity at contact (same spin direction as standard right-spin opponent at ω_opp = 570 rad/s, r_opp = 0.033 m):

```
v_opp_contact = ω_opp × r_opp = 570 × 0.033 = 18.81 m/s
v_contact = v_tip_turbo − v_opp_contact = 21.46 − 18.81 = 2.65 m/s

m_Z = 41.0 g = 0.041 kg
e = 0.62  (ABS plastic Energy Layer + metal blade insert, Burst era)

Spin decay (Xtend+ driver, μ ≈ 0.30, r_driver = 5 mm):
τ_Xt = μ × m × g × r_driver = 0.30 × 0.041 × 9.81 × 0.005 = 6.031×10⁻⁴ N·m
t_spin = L₀ / τ_Xt = 2.120×10⁻² / 6.031×10⁻⁴ = 35.2 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.0 g |
| I_total | 3.654×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 2.120×10⁻² kg·m²/s |
| r_base | 33 mm |
| r_turbo | 37 mm |
| v_tip_base | 19.14 m/s |
| v_tip_turbo | 21.46 m/s |
| Δv_tip | 2.32 m/s (+12.1%) |
| v_contact | 2.65 m/s |
| τ_Xt | 6.031×10⁻⁴ N·m |
| t_spin | 35.2 s |

---

## Case 1929 — SPECIAL: Turbo Whip (Super Z Slash) — Aiger Akabane / Z Achilles & Turbo Achilles

**Blader:** Aiger Akabane | **Beyblades:** Z Achilles 11 Xtend+ / Turbo Achilles 00 Dimension | **Type:** attack

### Description

Turbo Whip (超ゼットスラッシュ Super Z Slash) is a Special Move used by Aiger Akabane with both Z Achilles 11 Xtend+ and Turbo Achilles 00 Dimension. It is an upgraded version of Z Whip. With Turbo Awakening active, Achilles charges head-on and its two Turbo Blades slash across the opposing Beyblade simultaneously, causing critical damage. The dual-blade deployment increases the attack radius and blade tip speed, and the Burst Stopper function ensures Achilles cannot burst on collision. First used during Aiger's Champion Carnival battles in the Burst Turbo/Cho-Z season.

### Stage — Turbo Awakening Head-On Dual Slash

From Case 1928: v_contact = 2.65 m/s (Turbo Blade tip vs opponent surface), e = 0.62.

```
m_eff = (m_Z × m_opp) / (m_Z + m_opp) = (0.041 × 0.040) / (0.041 + 0.040)
      = 1.640×10⁻³ / 0.081 = 2.025×10⁻² kg

J_turbowhip = m_eff × (1 + e) × v_contact
            = 2.025×10⁻² × 1.62 × 2.65
            = 2.025×10⁻² × 4.293 = 8.694×10⁻² N·s

Δv_opp = J_turbowhip / m_opp = 8.694×10⁻² / 0.040 = 2.174 m/s
```

**Effect on Z Achilles (spin drain from heavy dual-blade clash):**

```
Δω_Z = J_turbowhip × r_turbo / I_Z = 8.694×10⁻² × 0.037 / 3.654×10⁻⁵ = 88.0 rad/s
ω_remain = 580 − 88.0 = 492.0 rad/s  (84.8% retained)
Note: Burst Stopper blades prevent burst despite heavy spin drain.
```

---

**[M] BeySpirit amplification:**
Aiger's Achilles Bit-Beast erupts as an armoured war god — the Turbo Blades ignite with Z-power and the dual slash tears through the opponent in a blazing cross that sends them flying from the stadium.

[M] factor = **7.5 ×** (Aiger Akabane — Achilles Cho-Z Turbo Awakening spirit)
[M] Δv = 2.174 × 7.5 = **16.3 m/s** (Turbo Awakening ring-out slash)

> **Note:** Physical values describe Turbo Awakening blade extension +4 mm (+12.1% tip speed), v_contact=2.65 m/s, J=8.694×10⁻² N·s, Δv=2.174 m/s, Δω_Z=88.0 rad/s (Burst Stopper prevents burst). [M] values represent Aiger's Achilles Z-power igniting the dual-blade slash. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboWhipSpecial(bey: Beyblade, target: Beyblade): void {
  // Turbo Awakening: r_base→r_turbo +4mm, v_tip 19.14→21.46m/s; v_contact=2.65m/s; J=8.694×10⁻²N·s; [M] 7.5×
  const J_phys = 0.08694;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Aiger Achilles Cho-Z Turbo Awakening spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using an Energy Layer with deployable Turbo Blades (Cho-Z Wing extensions, r_base ≥ 30 mm → r_turbo ≥ 34 mm) that function as Burst Stoppers on deployment, operated by a blader in synchronisation sufficient to trigger Turbo Awakening. Standard game instances: Z Achilles 11 Xtend+ and Turbo Achilles 00 Dimension (Aiger Akabane, Burst Turbo).

---

## Case 1930 — COMBO: Z Slash Drive — Z Achilles / Turbo Achilles

**Sequence:** → → A (moveRight · moveRight · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Aiger Akabane

### Physics Justification

Two consecutive rightward dashes (→ →) build a linear charge approach — Achilles accelerates across the stadium in a straight line. The second → adds to the first, giving a boosted approach speed at the moment A fires the dual-blade contact:

```
v_orbital_base = μ_Xt × ω₀ × r_driver = 0.30 × 580 × 0.005 = 0.870 m/s
v_charge_combo = 1.40 × v_orbital_base = 1.40 × 0.870 = 1.218 m/s
(1.40× factor: double-dash momentum buildup)

Blade relative velocity at combo (ω_combo ≈ ω₀, r_turbo = 37 mm):
v_blade_combo = ω₀ × r_turbo − ω_opp × r_opp = 580 × 0.037 − 570 × 0.033
              = 21.46 − 18.81 = 2.65 m/s  (same as full special)

Combined v_rel_combo: use reduced blade contribution at combo scale:
v_contact_combo = 2.00 m/s
(charge adds 1.218 m/s linear approach, blade relative reduced from 2.65→2.00 by partial synchronisation)

J_combo = m_eff × (1 + e) × v_contact_combo = 2.025×10⁻² × 1.62 × 2.00
        = 2.025×10⁻² × 3.24 = 6.561×10⁻² N·s
```

Burst Stopper blades deflect recoil back into spin (η_bs = 0.20 — Burst Stopper recoil recovery):

```
Δω = η_bs × J_combo × r_turbo / I_Z
   = 0.20 × 6.561×10⁻² × 0.037 / 3.654×10⁻⁵
   = 0.20 × 66.44
   = +13.3 rad/s  ≈ +13 rad/s
```

(η_bs = 0.20: Burst Stopper blade geometry deflects blade-contact recoil into rotational momentum.) Dual-blade charge slash gives damageMultiplier **1.30×**. lockMs = 0 (attack type).

**Parameters:**
- spinGain: +13 rad/s (Burst Stopper recoil recovery η = 0.20)
- damageMultiplier: 1.30 (dual-blade Turbo Awakening charge slash)
- lockMs: 0 (attack type, no dwell)

### TypeScript

```typescript
function zSlashDriveCombo(bey: Beyblade, target: Beyblade): void {
  // Burst Stopper recoil: Δω ≈ +13 rad/s (η=0.20, v_contact=2.00m/s, J=6.561×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 13);
  // Dual-blade Turbo Awakening charge slash: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +13 rad/s (partial) | ✓ |



---

## Case 1931 — GIMMICK: Turbo Valtryek Z.Ev (Burst Cho-Z) — Wall-Rebound Turbo Awakening Launch

**Beyblade:** Turbo Valtryek Zenith Evolution / Turbo Valtryek Z.Ev (Beyblade Burst Turbo / Cho-Z)
**Blader:** Valt Aoi | **Series:** Beyblade Burst Turbo (Cho-Z season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Turbo Valtryek | 22.0 | 33.0 |
| Forge Disc | Z | 11.0 | 25.0 |
| Driver | Ev. (Evolve) | 4.0 | 6.0 |
| **Total** | | **37.0** | |

(No face component — Burst era 3-part system. Takara Tomy only per Burst Scope.)

**I_total** = 22.0×10⁻³ × 0.033² + 11.0×10⁻³ × 0.025² + 4.0×10⁻³ × 0.006²
           = 2.396×10⁻⁵ + 6.875×10⁻⁶ + 1.440×10⁻⁷
           = **3.098×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (Burst Cho-Z standard launch)
L₀ = I × ω₀ = 3.098×10⁻⁵ × 580 = **1.797×10⁻² kg·m²/s**

---

### 1. Evolve Driver — Low-Friction Free-Spin Tip

The Evolve (Ev.) Driver has a free-spinning bearing tip (μ_Ev = 0.15) and a wide r = 6 mm contact base enabling sustained high-speed orbital motion:

```
τ_Ev = μ_Ev × m × g × r_driver = 0.15 × 0.037 × 9.81 × 0.006 = 3.264×10⁻⁴ N·m
t_spin = L₀ / τ_Ev = 1.797×10⁻² / 3.264×10⁻⁴ = 55.1 s
```

Approach velocity toward Beystadium barrier (orbital + deliberate directional charge):

```
v_orbital  = μ_Ev × ω₀ × r_driver = 0.15 × 580 × 0.006 = 0.522 m/s
v_charge   = 0.600 m/s  (intentional directional push toward wall)
v_approach = v_orbital + v_charge = 0.522 + 0.600 = 1.122 m/s
```

---

### 2. Bowl-Wall Elastic Rebound — Speed Boost

Turbo Valtryek strikes the bowl wall (θ = 55°, e_wall = 0.87 — hard Beystadium polycarbonate):

```
v_approach_perp = v_approach × sin(55°) = 1.122 × 0.819 = 0.919 m/s
v_approach_tan  = v_approach × cos(55°) = 1.122 × 0.574 = 0.644 m/s

After elastic rebound:
v_rebound_perp  = e_wall × v_approach_perp = 0.87 × 0.919 = 0.800 m/s
v_tan (preserved)                          = 0.644 m/s

v_post_rebound = √(0.800² + 0.644²) = √(0.640 + 0.415) = √1.055 = 1.027 m/s
(directed inward toward stadium center)
```

---

### 3. Turbo Awakening Snap — Additional Speed Boost

At the moment of wall contact, Turbo Valtryek enters Turbo Awakening: blades snap out from r_base = 33 mm to r_turbo = 37 mm. A fraction of the blade tip speed increase couples to linear momentum (η_snap = 0.20):

```
Δv_tip = ω₀ × (r_turbo − r_base) = 580 × 0.004 = 2.32 m/s
v_turbo_snap = η_snap × Δv_tip = 0.20 × 2.32 = 0.464 m/s

v_total = v_post_rebound + v_turbo_snap = 1.027 + 0.464 = 1.491 m/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 37.0 g |
| I_total | 3.098×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 1.797×10⁻² kg·m²/s |
| μ_Ev | 0.15 |
| v_approach | 1.122 m/s |
| e_wall | 0.87 |
| v_post_rebound | 1.027 m/s |
| Δv_tip (Turbo snap) | 2.32 m/s |
| v_turbo_snap | 0.464 m/s |
| v_total | 1.491 m/s |
| τ_Ev | 3.264×10⁻⁴ N·m |
| t_spin | 55.1 s |

---

## Case 1932 — SPECIAL: Turbo Winged Launch (Super Jet Shoot) — Valt Aoi / Turbo Valtryek

**Blader:** Valt Aoi | **Beyblade:** Turbo Valtryek Z.Ev | **Type:** attack

### Description

Turbo Winged Launch (超ジェットシュート Super Jet Shoot) is a Special Move used by Valt Aoi and his Turbo Valtryek Zenith Evolution. Turbo Valtryek charges toward the Beystadium barrier, rebounds off the wall with an elastic bounce, and simultaneously triggers Turbo Awakening — the Turbo Blades snap outward and the bey erupts in a burst of speed and momentum that launches it into the opponent at dramatically increased velocity. The wall rebound converts approach energy back into the ideal attack angle while the Turbo Awakening provides an additional speed surge, making the total impact velocity greater than the original approach speed.

### Stage — Elastic Wall Rebound + Turbo Awakening Snap Strike

From Case 1931: v_total = 1.491 m/s (post-rebound + Turbo snap), e = 0.65 (Burst Cho-Z layer contact).

```
m_eff = (m_V × m_opp) / (m_V + m_opp) = (0.037 × 0.040) / (0.037 + 0.040)
      = 1.480×10⁻³ / 0.077 = 1.922×10⁻² kg

J_turbolaunch = m_eff × (1 + e) × v_total
              = 1.922×10⁻² × 1.65 × 1.491
              = 1.922×10⁻² × 2.460 = 4.728×10⁻² N·s

Δv_opp = J_turbolaunch / m_opp = 4.728×10⁻² / 0.040 = 1.182 m/s
```

**Effect on Turbo Valtryek (spin drain from wall + contact):**

```
Δω_V = J_turbolaunch × r_turbo / I_V = 4.728×10⁻² × 0.037 / 3.098×10⁻⁵ = 56.5 rad/s
ω_remain = 580 − 56.5 = 523.5 rad/s  (90.3% retained)
```

---

**[M] BeySpirit amplification:**
Valt's Valtryek Bit-Beast blazes with jet-wing fire — the wall rebound becomes a full turbo boost as both Turbo Blades and Valtryek's wind spirit propel the bey like a guided missile, shattering the opponent out of the stadium in a sonic jet burst.

[M] factor = **8.0 ×** (Valt Aoi — Turbo Valtryek wing-spirit, Cho-Z protagonist)
[M] Δv = 1.182 × 8.0 = **9.46 m/s** (turbo jet-wing ring-out)

> **Note:** Physical values describe elastic wall rebound e_wall=0.87, v_post=1.027 m/s; Turbo Awakening snap v_snap=0.464 m/s; v_total=1.491 m/s; J=4.728×10⁻² N·s; Δv=1.182 m/s. [M] values represent Valt's Valtryek erupting in jet-wing spirit propulsion. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboWingedLaunchSpecial(bey: Beyblade, target: Beyblade): void {
  // Wall rebound e=0.87→v_post=1.027m/s; Turbo snap +0.464m/s; v_total=1.491m/s; J=4.728×10⁻²N·s; [M] 8.0×
  const J_phys = 0.04728;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Valt Turbo Valtryek wing-spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a free-spinning low-friction Driver (μ ≤ 0.20, r_driver ≥ 5 mm) combined with a Turbo Awakening Energy Layer (deployable blade extension Δr ≥ 3 mm at ω₀ ≥ 550 rad/s), operated by a blader in synchronisation with a hard-wall (e_wall ≥ 0.80) Beystadium barrier. Standard game instance: Turbo Valtryek Z.Ev (Valt Aoi, Burst Turbo).

---

## Case 1933 — COMBO: Zenith Rebound Strike — Turbo Valtryek

**Sequence:** → ↑ A (moveRight · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Valt Aoi

### Physics Justification

The moveRight (→) builds a rightward lateral charge toward the bowl wall. The moveUp (↑) adds the redirected wall-climb component — Turbo Valtryek angles toward the upper bowl slope for a partial wall contact. With Turbo Awakening snap active this gives a partial rebound strike:

```
v_approach_partial = v_approach × 0.70 = 1.122 × 0.70 = 0.785 m/s
v_post_partial     = v_post_rebound × 0.70 = 1.027 × 0.70 = 0.719 m/s
v_turbo_partial    = v_turbo_snap × 0.70   = 0.464 × 0.70 = 0.325 m/s
v_total_partial    = 0.719 + 0.325 = 1.044 m/s

J_partial = m_eff × (1 + e) × v_total_partial = 1.922×10⁻² × 1.65 × 1.044
          = 1.922×10⁻² × 1.723 = 3.311×10⁻² N·s
```

The Turbo Blade recoil on contact recovers spin (η_turboblade = 0.30):

```
Δω = η_turboblade × J_partial × r_turbo / I_V
   = 0.30 × 3.311×10⁻² × 0.037 / 3.098×10⁻⁵
   = 0.30 × 39.53
   = +11.9 rad/s  ≈ +12 rad/s
```

(η_turboblade = 0.30: Turbo Blade deflects contact recoil into spin recovery.) Partial wall-rebound Turbo snap strike gives damageMultiplier **1.25×**. lockMs = 0 (attack type).

**Parameters:**
- spinGain: +12 rad/s (Turbo Blade recoil recovery η = 0.30)
- damageMultiplier: 1.25 (partial wall-rebound Turbo Awakening strike)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function zenithReboundStrikeCombo(bey: Beyblade, target: Beyblade): void {
  // Turbo Blade recoil: Δω ≈ +12 rad/s (η=0.30, v_total=1.044m/s, J=3.311×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Partial wall-rebound Turbo snap: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |



---

## Case 1934 — GIMMICK: Turbo Spryzen 0Wall Zeta' (Burst Cho-Z) — Left-Spin Defense + Zeta' Reversal Upper Strike

**Beyblade:** Turbo Spryzen 0Wall Zeta' (Beyblade Burst Turbo / Cho-Z)
**Blader:** Shu Kurenai | **Series:** Beyblade Burst Turbo (Cho-Z season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Turbo Spryzen | 23.0 | 34.0 |
| Forge Disc | 0 | 9.5 | 23.0 |
| Frame | Wall | 3.5 | 29.0 |
| Driver | Zeta' (Zeta Prime) | 5.0 | 5.0 |
| **Total** | | **41.0** | |

(No face component — Burst era 4-part system with Frame. Takara Tomy only per Burst Scope.)

**I_total** = 23.0×10⁻³ × 0.034² + 9.5×10⁻³ × 0.023² + 3.5×10⁻³ × 0.029² + 5.0×10⁻³ × 0.005²
           = 2.659×10⁻⁵ + 5.026×10⁻⁶ + 2.944×10⁻⁶ + 1.250×10⁻⁷
           = **3.468×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (Burst Cho-Z standard launch, left-spin mode)
L₀ = I × ω₀ = 3.468×10⁻⁵ × 580 = **2.011×10⁻² kg·m²/s**

---

### 1. Zeta' Driver — Spin Direction Reversal Mechanism

The Zeta' (Zeta Prime) Driver contains an internal clutch mechanism that temporarily reverses the bey's spin direction from left-spin (defense mode) to right-spin (attack burst), activated when Shu and Turbo Spryzen reach synchronisation. The reversal pulse delivers an impulsive torque at the contact point:

```
ω_pulse  = 100 rad/s  (partial reversal angular speed contribution from Zeta' clutch burst)
v_driver_reversal = ω_pulse × r_driver = 100 × 0.005 = 0.500 m/s
(effective additional contact velocity from spin-direction change impulse)
```

---

### 2. Upper-Attack Contact — Angled Lift Strike

The Turbo Spryzen Energy Layer carries upper-angled contact points (α_upper = 25° above horizontal). Combined with the Zeta' reversal boost:

```
v_tip = ω₀ × r_layer = 580 × 0.034 = 19.72 m/s

v_orbital  = μ_Zeta × ω₀ × r_driver = 0.35 × 580 × 0.005 = 1.015 m/s
v_total    = v_orbital + v_driver_reversal = 1.015 + 0.500 = 1.515 m/s

Upper-attack angle: α_upper = 25°
v_horizontal = v_total × cos(25°) = 1.515 × 0.906 = 1.373 m/s
v_vertical   = v_total × sin(25°) = 1.515 × 0.423 = 0.641 m/s
(upward component delivers ring-out via aerial uppercut trajectory)

Spin decay (Zeta' in attack mode, μ_Zeta = 0.35):
τ_Zeta = μ_Zeta × m × g × r_driver = 0.35 × 0.041 × 9.81 × 0.005 = 7.038×10⁻⁴ N·m
t_spin = L₀ / τ_Zeta = 2.011×10⁻² / 7.038×10⁻⁴ = 28.6 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.0 g |
| I_total | 3.468×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 2.011×10⁻² kg·m²/s |
| v_tip | 19.72 m/s |
| ω_pulse (Zeta') | 100 rad/s |
| v_driver_reversal | 0.500 m/s |
| v_orbital | 1.015 m/s |
| v_total | 1.515 m/s |
| α_upper | 25° |
| v_horizontal | 1.373 m/s |
| v_vertical | 0.641 m/s |
| τ_Zeta | 7.038×10⁻⁴ N·m |
| t_spin | 28.6 s |

---

## Case 1935 — SPECIAL: Turbo Upper Launch (Super Upper Shoot) — Shu Kurenai / Turbo Spryzen

**Blader:** Shu Kurenai | **Beyblade:** Turbo Spryzen 0Wall Zeta' | **Type:** attack

### Description

Turbo Upper Launch (超アッパーシュート Super Upper Shoot) is a Special Move used by Shu Kurenai and his Turbo Spryzen 0Wall Zeta'. In left-spin defense mode, Turbo Spryzen uses the Zeta' Performance Tip to trigger a momentary spin direction reversal — switching from left-spin to right-spin as it charges — generating a sudden surge of power that is channeled through the upper-angled contact points of the Energy Layer into a massive uppercut that launches the opponent high into the air for a Ring-Out Finish. The 0Wall Frame provides the stability to withstand the reversal torque while the Turbo Awakening blades lock the burst protection.

### Stage — Left-Spin Defense + Zeta' Reversal Upper Strike

From Case 1934: v_total = 1.515 m/s, α_upper = 25°, e = 0.65.

```
m_eff = (m_S × m_opp) / (m_S + m_opp) = (0.041 × 0.040) / (0.041 + 0.040)
      = 1.640×10⁻³ / 0.081 = 2.025×10⁻² kg

J_turboupper = m_eff × (1 + e) × v_total
             = 2.025×10⁻² × 1.65 × 1.515
             = 2.025×10⁻² × 2.500 = 5.063×10⁻² N·s

Δv_opp (total) = J_turboupper / m_opp = 5.063×10⁻² / 0.040 = 1.266 m/s

Upper-angle components:
Δv_horizontal = 1.266 × cos(25°) = 1.266 × 0.906 = 1.147 m/s (ring-out)
Δv_vertical   = 1.266 × sin(25°) = 1.266 × 0.423 = 0.535 m/s (aerial lift)
```

**Effect on Turbo Spryzen (spin drain from reversal + contact):**

```
Δω_S = J_turboupper × r_layer / I_S = 5.063×10⁻² × 0.034 / 3.468×10⁻⁵ = 49.6 rad/s
ω_remain = 580 − 49.6 = 530.4 rad/s  (91.5% retained)
```

---

**[M] BeySpirit amplification:**
Shu's Spryzen Bit-Beast ignites in crimson — the Zeta' reversal becomes a tidal wave of spinning power as Turbo Spryzen spins both ways at once, the upper-strike erupting into a pillar of white fire that hurls the opponent skyward and clean out of the stadium.

[M] factor = **8.0 ×** (Shu Kurenai — Turbo Spryzen spirit, Cho-Z main protagonist)
[M] Δv = 1.266 × 8.0 = **10.1 m/s** (Zeta' reversal upper ring-out)

> **Note:** Physical values describe Zeta' spin reversal ω_pulse=100 rad/s, v_driver=0.500 m/s, v_total=1.515 m/s, J=5.063×10⁻² N·s, Δv=1.266 m/s (horizontal 1.147 + vertical 0.535). [M] values represent Shu's Spryzen dual-spin spirit erupting in a pillar of fire. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboUpperLaunchSpecial(bey: Beyblade, target: Beyblade): void {
  // Zeta' reversal ω_pulse=100r/s→v_driver=0.5m/s; v_total=1.515m/s; α_upper=25°; J=5.063×10⁻²N·s; [M] 8.0×
  const J_phys = 0.05063;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 8.0; // [M] BeySpirit 8.0× (Shu Turbo Spryzen reversal spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a Zeta' (Zeta Prime) or equivalent clutch-reversal Driver (ω_pulse ≥ 80 rad/s at trigger) combined with a Turbo Awakening Energy Layer with upper-angled contact points (α_upper ≥ 20°) and a wide-Frame (Wall or equivalent, r_frame ≥ 26 mm) for stability during spin reversal. Standard game instance: Turbo Spryzen 0Wall Zeta' (Shu Kurenai, Burst Turbo).

---

## Case 1936 — COMBO: Spryzen Upper Guard — Turbo Spryzen

**Sequence:** ↑ K A (moveUp · defense · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Shu Kurenai

### Physics Justification

The moveUp (↑) sends Turbo Spryzen toward the upper bowl wall, gaining the elevated angle needed for an upper attack. The defense (K) engages the 0Wall frame posture — bracing against incoming counter-pressure and locking the Turbo Awakening Burst Stoppers. The attack (A) fires the partial Zeta' reversal upper strike:

```
v_total_partial = v_total × 0.65 = 1.515 × 0.65 = 0.985 m/s

J_partial = m_eff × (1 + e) × v_total_partial = 2.025×10⁻² × 1.65 × 0.985
          = 2.025×10⁻² × 1.625 = 3.291×10⁻² N·s
```

The 0Wall Frame absorbs recoil and redirects it into spin (η_0Wall = 0.25, wall-ring geometry):

```
Δω = η_0Wall × J_partial × r_layer / I_S
   = 0.25 × 3.291×10⁻² × 0.034 / 3.468×10⁻⁵
   = 0.25 × 32.27
   = +8.1 rad/s  ≈ +8 rad/s
```

(η_0Wall = 0.25: Wall frame outer ring redirects contact recoil into rotational momentum.) Partial reversal upper strike with defense posture gives damageMultiplier **1.20×**. lockMs = 100 (0Wall frame defensive dwell on contact).

**Parameters:**
- spinGain: +8 rad/s (0Wall frame recoil recovery η = 0.25)
- damageMultiplier: 1.20 (partial Zeta' reversal upper strike with guard)
- lockMs: 100 (0Wall frame dwell)

### TypeScript

```typescript
function spryzenUpperGuardCombo(bey: Beyblade, target: Beyblade): void {
  // 0Wall recoil: Δω ≈ +8 rad/s (η=0.25, v_partial=0.985m/s, J=3.291×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 8);
  // Partial Zeta' reversal upper + guard: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +8 rad/s (partial) | ✓ |



---

## Case 1937 — GIMMICK: Turbo Achilles 00 Dimension (Burst Cho-Z) — Single Turbo Blade Undercut

**Beyblade:** Turbo Achilles 00 Dimension (Beyblade Burst Turbo / Cho-Z)
**Blader:** Aiger Akabane | **Series:** Beyblade Burst Turbo (Cho-Z season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Energy Layer | Turbo Achilles | 24.5 | 34.0 |
| Forge Disc | 00 (Double Zero) | 14.0 | 27.0 |
| Driver | Dimension | 5.0 | 5.0 |
| **Total** | | **43.5** | |

(No face component — Burst era 3-part system. Takara Tomy only per Burst Scope.)

**I_total** = 24.5×10⁻³ × 0.034² + 14.0×10⁻³ × 0.027² + 5.0×10⁻³ × 0.005²
           = 2.832×10⁻⁵ + 1.021×10⁻⁵ + 1.250×10⁻⁷
           = **3.865×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (Burst Cho-Z standard launch)
L₀ = I × ω₀ = 3.865×10⁻⁵ × 580 = **2.242×10⁻² kg·m²/s**

Note: 00 Disc (Double Zero) provides the highest forged disc mass in the Cho-Z line (14.0 g), maximising I_total and delivering greater ring-out momentum compared to the 11 Disc used on Z Achilles 11 Xtend+ (Case 1928).

---

### 1. Turbo Awakening Blade Deployment — Extended Radius

Turbo Achilles enters Turbo Awakening, deploying both Turbo Blades to r_turbo = 37 mm:

```
v_tip_base  = ω₀ × r_base  = 580 × 0.033 = 19.14 m/s
v_tip_turbo = ω₀ × r_turbo = 580 × 0.037 = 21.46 m/s
```

---

### 2. Single-Blade Undercut Contact — Upper Attack from Below

For the Turbo Upper, **one** of the two Turbo Blades engages the opponent from directly below at an undercut angle (α_under = 30°):

```
Relative blade tip velocity (right-spin opponent at ω_opp=570 rad/s, r_opp=0.033 m):
v_opp_contact = 570 × 0.033 = 18.81 m/s
v_rel         = v_tip_turbo − v_opp_contact = 21.46 − 18.81 = 2.65 m/s

Undercut angle decomposition:
v_horizontal = v_rel × cos(30°) = 2.65 × 0.866 = 2.295 m/s
v_vertical   = v_rel × sin(30°) = 2.65 × 0.500 = 1.325 m/s  (upward — Ring-Out vector)

Spin decay (Dimension driver, μ_Dim = 0.35, r_driver = 5 mm):
τ_Dim = μ_Dim × m × g × r_driver = 0.35 × 0.0435 × 9.81 × 0.005 = 7.463×10⁻⁴ N·m
t_spin = L₀ / τ_Dim = 2.242×10⁻² / 7.463×10⁻⁴ = 30.0 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 43.5 g |
| I_total | 3.865×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 2.242×10⁻² kg·m²/s |
| r_turbo | 37 mm |
| v_tip_turbo | 21.46 m/s |
| v_rel | 2.65 m/s |
| α_under | 30° |
| v_horizontal | 2.295 m/s |
| v_vertical | 1.325 m/s |
| τ_Dim | 7.463×10⁻⁴ N·m |
| t_spin | 30.0 s |

---

## Case 1938 — SPECIAL: Turbo Upper (Super Z Upper) — Aiger Akabane / Turbo Achilles 00 Dimension

**Blader:** Aiger Akabane | **Beyblade:** Turbo Achilles 00 Dimension | **Type:** attack

### Description

Turbo Upper (超ゼットアッパー Super Z Upper) is a Special Move used by Aiger Akabane and his Turbo Achilles 00 Dimension. With Turbo Awakening active, one of the two long Turbo Blade swords on the Energy Layer sweeps in from below and strikes the opposing Beyblade directly from underneath, angled upward at 30° to generate a powerful Ring-Out Finish by launching the opponent into the air. The 00 Disc's extra mass provides greater momentum for the undercut. Unlike Turbo Whip which uses both blades in a forward slash, Turbo Upper concentrates the full force of a single blade in one decisive upward strike.

### Stage — Turbo Awakening Single-Blade Undercut Strike

From Case 1937: v_rel = 2.65 m/s, α_under = 30°, e = 0.62.

```
m_eff = (m_A × m_opp) / (m_A + m_opp) = (0.0435 × 0.040) / (0.0435 + 0.040)
      = 1.740×10⁻³ / 0.0835 = 2.084×10⁻² kg

J_turboupper = m_eff × (1 + e) × v_rel
             = 2.084×10⁻² × 1.62 × 2.65
             = 2.084×10⁻² × 4.293 = 8.947×10⁻² N·s

Δv_opp (total)   = J_turboupper / m_opp = 8.947×10⁻² / 0.040 = 2.237 m/s

Undercut angle decomposition:
Δv_horizontal = 2.237 × cos(30°) = 2.237 × 0.866 = 1.937 m/s
Δv_vertical   = 2.237 × sin(30°) = 2.237 × 0.500 = 1.119 m/s  (aerial ring-out)
```

**Effect on Turbo Achilles (spin drain from blade contact):**

```
Δω_A = J_turboupper × r_turbo / I_A = 8.947×10⁻² × 0.037 / 3.865×10⁻⁵ = 85.6 rad/s
ω_remain = 580 − 85.6 = 494.4 rad/s  (85.2% retained)
Burst Stopper (second blade) prevents burst despite 85.6 rad/s drain.
```

---

**[M] BeySpirit amplification:**
Aiger's Achilles erupts with Z-power — the single upward blade becomes a gleaming war-god's lance of pure spirit energy. The opponent is launched vertically out of the stadium on a column of fire, unable to resist the force of a Turbo Achilles fully awakened.

[M] factor = **7.5 ×** (Aiger Akabane — Turbo Achilles Cho-Z spirit)
[M] Δv = 2.237 × 7.5 = **16.8 m/s** (single-blade upper ring-out)

> **Note:** Physical values describe single Turbo Blade undercut α=30°, v_rel=2.65 m/s, J=8.947×10⁻² N·s, Δv=2.237 m/s (horizontal 1.937 + vertical 1.119). [M] values represent Aiger's Z-power concentrating into a single lance of spirit. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboUpperSpecial(bey: Beyblade, target: Beyblade): void {
  // Single Turbo Blade undercut α=30°; v_rel=2.65m/s; J=8.947×10⁻²N·s; Δv_vert=1.119m/s; [M] 7.5×
  const J_phys = 0.08947;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Aiger Turbo Achilles Z-power)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a Turbo Awakening Energy Layer with one or more Turbo Blades deployed at r_turbo ≥ 34 mm, paired with a high-mass Forge Disc (≥ 12 g, r_disc ≥ 25 mm) to maximise ring-out momentum, and a blader in sufficient synchronisation with the bey for Turbo Awakening activation. Standard game instance: Turbo Achilles 00 Dimension (Aiger Akabane, Burst Turbo).

---

## Case 1939 — COMBO: Achilles Upper Drive — Turbo Achilles 00 Dimension

**Sequence:** ↓ ↑ A (moveDown · moveUp · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Aiger Akabane

### Physics Justification

The moveDown (↓) drops Turbo Achilles to a lower orbital position — diving below the opponent's contact height to align the single undercut blade for an upward approach. The moveUp (↑) reverses the motion, springing Turbo Achilles upward with the Turbo Blade angled at the steeper undercut trajectory (α_under_combo = 40°). The attack (A) fires the single-blade upper strike at reduced power:

```
v_rel_partial = v_rel × 0.70 = 2.65 × 0.70 = 1.855 m/s

J_partial = m_eff × (1 + e) × v_rel_partial = 2.084×10⁻² × 1.62 × 1.855
          = 2.084×10⁻² × 3.005 = 6.262×10⁻² N·s
```

The second Burst Stopper blade deflects recoil into spin recovery (η_bs = 0.20):

```
Δω = η_bs × J_partial × r_turbo / I_A
   = 0.20 × 6.262×10⁻² × 0.037 / 3.865×10⁻⁵
   = 0.20 × 59.92
   = +12.0 rad/s
```

(η_bs = 0.20: second Burst Stopper blade converts blade-contact recoil to spin.) Partial single-blade undercut gives damageMultiplier **1.30×**. lockMs = 0 (attack type, immediate release after upper strike).

**Parameters:**
- spinGain: +12 rad/s (Burst Stopper recoil recovery η = 0.20)
- damageMultiplier: 1.30 (single-blade undercut Turbo Awakening upper strike)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function achillesUpperDriveCombo(bey: Beyblade, target: Beyblade): void {
  // Burst Stopper recoil: Δω ≈ +12 rad/s (η=0.20, v_rel=1.855m/s, J=6.262×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 12);
  // Single Turbo Blade undercut: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +12 rad/s (partial) | ✓ |



---

## Case 1940 — GIMMICK: Turbo Achilles 00 Dimension — Burst Stopper Blade Power Channeling

**Beyblade:** Turbo Achilles 00 Dimension (Beyblade Burst Turbo / Cho-Z)
**Blader:** Aiger Akabane | **Series:** Beyblade Burst Turbo (Cho-Z season)

Assembly: see Case 1937 (m=43.5 g, I=3.865×10⁻⁵ kg·m², ω₀=580 rad/s, L₀=2.242×10⁻² kg·m²/s).

---

### 1. Burst Stopper Blade Geometry

Each Burst Stopper blade is a long rectangular protrusion (L_blade = 12 mm, w_blade = 4 mm) extending outward from the Energy Layer. The blade passes any given contact point in:

```
t_blade_pass = L_blade / v_rel = 0.012 / 2.65 = 4.53×10⁻³ s ≈ 4.5 ms
(blade passage time at v_rel = 2.65 m/s — longer contact arc than point contact)
```

---

### 2. Power Channeling — Pre-Contact Spin Boost

For Turbo Sword, Aiger channels BeySpirit into the Turbo Blades before contact, briefly increasing the bey's spin rate via Turbo Awakening synchronisation pulse. The power channeling delivers a spin boost:

```
ω_boost  = 10 rad/s  (synchronisation-pulse spin increase)
ω_sword  = ω₀ + ω_boost = 580 + 10 = 590 rad/s

v_tip_sword = ω_sword × r_turbo = 590 × 0.037 = 21.83 m/s

Relative blade velocity against right-spin opponent (ω_opp=570, r_opp=0.033):
v_opp_contact = 570 × 0.033 = 18.81 m/s
v_rel_sword   = v_tip_sword − v_opp_contact = 21.83 − 18.81 = 3.02 m/s

Compared to standard Turbo contact (Case 1928): v_rel_base = 2.65 m/s
Power-channeling increase: Δv_rel = 3.02 − 2.65 = 0.37 m/s (+14%)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 43.5 g (see Case 1937) |
| ω_boost | 10 rad/s |
| ω_sword | 590 rad/s |
| v_tip_sword | 21.83 m/s |
| v_rel_sword | 3.02 m/s |
| L_blade | 12 mm |
| t_blade_pass | 4.5 ms |

---

## Case 1941 — SPECIAL: Turbo Sword (Super Z Sword) — Aiger Akabane / Turbo Achilles 00 Dimension

**Blader:** Aiger Akabane | **Beyblade:** Turbo Achilles 00 Dimension | **Type:** attack

### Description

Turbo Sword (超ゼットソード Super Z Sword) is a Special Move used by Aiger Akabane and his Turbo Achilles 00 Dimension. Similar to Z Whip, Achilles channels power into the long Burst Stopper blades on the Energy Layer via Turbo Awakening, boosting the blade tip speed by +10 rad/s before contact. The single concentrated blade then sweeps across the opposing Beyblade in a horizontal sword-like slash, delivering a focused lateral strike that sends the opponent flying. The 00 Disc's extra mass adds ring-out momentum and the extended blade passage (4.5 ms contact arc) concentrates energy across the full blade face.

### Stage — Power-Channeled Blade Sword Slash

From Case 1940: v_rel_sword = 3.02 m/s, e = 0.62.

```
m_eff = (m_A × m_opp) / (m_A + m_opp) = (0.0435 × 0.040) / (0.0435 + 0.040)
      = 1.740×10⁻³ / 0.0835 = 2.084×10⁻² kg

J_turbosword = m_eff × (1 + e) × v_rel_sword
             = 2.084×10⁻² × 1.62 × 3.02
             = 2.084×10⁻² × 4.892 = 1.020×10⁻¹ N·s

Δv_opp = J_turbosword / m_opp = 1.020×10⁻¹ / 0.040 = 2.550 m/s
```

**Effect on Turbo Achilles (spin drain from power channeling + blade contact):**

```
Δω_A = J_turbosword × r_turbo / I_A = 1.020×10⁻¹ × 0.037 / 3.865×10⁻⁵ = 97.7 rad/s
ω_remain = 580 − 97.7 = 482.3 rad/s  (83.2% retained)
Burst Stopper prevents burst despite 97.7 rad/s drain from power-channeled strike.
```

---

**[M] BeySpirit amplification:**
Aiger's Achilles ignites with concentrated Z-power — the Burst Stopper blade becomes a blazing war-god's longsword, the sword slash erupting in a column of golden fire that cuts clean through the opponent's rotation and punches them out of the stadium.

[M] factor = **7.5 ×** (Aiger Akabane — Turbo Achilles Cho-Z power-channeled blade spirit)
[M] Δv = 2.550 × 7.5 = **19.1 m/s** (power-channeled sword ring-out)

> **Note:** Physical values describe power-channeling spin boost ω_boost=10 rad/s, v_rel_sword=3.02 m/s (vs standard 2.65), J=1.020×10⁻¹ N·s, Δv=2.550 m/s, blade contact arc 4.5 ms. [M] values represent Aiger's Z-power igniting the blade into a longsword of spirit fire. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboSwordSpecial(bey: Beyblade, target: Beyblade): void {
  // Power-channel ω_boost=10r/s→v_rel=3.02m/s; J=1.020×10⁻¹N·s; blade_pass=4.5ms; [M] 7.5×
  const J_phys = 0.1020;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Aiger Turbo Achilles power-channeled sword)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a Turbo Awakening Energy Layer with long Burst Stopper blade protrusions (L_blade ≥ 10 mm, r_turbo ≥ 34 mm) capable of receiving a synchronisation-pulse spin boost (ω_boost ≥ 8 rad/s) from a fully synchronised blader, paired with a heavy Forge Disc (≥ 12 g) for maximum ring-out momentum. Standard game instance: Turbo Achilles 00 Dimension (Aiger Akabane, Burst Turbo).

---

## Case 1942 — COMBO: Z Sword Cross — Turbo Achilles 00 Dimension

**Sequence:** → ← A (moveRight · moveLeft · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Aiger Akabane

### Physics Justification

The moveRight (→) sends Turbo Achilles on a rightward orbital arc, then moveLeft (←) immediately reverses direction — a lateral feint that creates a momentum reversal at the contact point. The direction change adds a Coriolis-like lateral component to the contact velocity, then A fires the power-channeled sword slash at the crossover point:

```
v_orbital = μ_Dim × ω₀ × r_driver = 0.35 × 580 × 0.005 = 1.015 m/s
v_lateral_reversal = v_orbital × 2 × sin(45°) = 1.015 × 2 × 0.707 = 1.435 m/s
(momentum from rapid direction reversal at 45° crossing angle)

v_contact_combo = 0.50 × v_lateral_reversal + 0.50 × v_rel_sword
               = 0.50 × 1.435 + 0.50 × 3.02 = 0.718 + 1.510 = 2.228 m/s

J_combo = m_eff × (1 + e) × v_contact_combo = 2.084×10⁻² × 1.62 × 2.228
        = 2.084×10⁻² × 3.609 = 7.522×10⁻² N·s
```

Burst Stopper blade deflects contact recoil into spin recovery (η_bs = 0.20):

```
Δω = η_bs × J_combo × r_turbo / I_A
   = 0.20 × 7.522×10⁻² × 0.037 / 3.865×10⁻⁵
   = 0.20 × 71.98
   = +14.4 rad/s  ≈ +14 rad/s
```

(η_bs = 0.20: Burst Stopper blade geometry converts cross-slash recoil to spin.) Lateral cross-slash gives damageMultiplier **1.30×**. lockMs = 0 (attack type, lateral slash with no dwell).

**Parameters:**
- spinGain: +14 rad/s (Burst Stopper recoil recovery η = 0.20)
- damageMultiplier: 1.30 (power-channeled lateral sword cross-slash)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function zSwordCrossCombo(bey: Beyblade, target: Beyblade): void {
  // Burst Stopper recoil: Δω ≈ +14 rad/s (η=0.20, v_combo=2.228m/s, J=7.522×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 14);
  // Power-channeled lateral cross-slash: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +14 rad/s (partial) | ✓ |



---

## Case 1943 — GIMMICK: Z Achilles 11 Xtend+ — Gyroscopic Shield + Combined Crush Approach

**Beyblade:** Z Achilles 11 Xtend+ (Beyblade Burst Turbo / Cho-Z)
**Blader:** Aiger Akabane | **Series:** Beyblade Burst Turbo (Cho-Z season)

Assembly: see Case 1928 (m=41.0 g, I=3.654×10⁻⁵ kg·m², ω₀=580 rad/s, L₀=2.120×10⁻² kg·m²/s, r_turbo=37 mm).

---

### 1. Gyroscopic Shield — Xtend+ Extended Defense Posture

With Xtend+ extended to its maximum height (defense posture), Z Achilles presents maximum gyroscopic stability. The gyroscopic rigidity of the high-spin bey acts as a defensive shield:

```
Gyroscopic rigidity: G_gyro = I × ω₀² = 3.654×10⁻⁵ × 580² = 3.654×10⁻⁵ × 336400 = 12.29 N·m

For an incoming contact force F_in at r_impact = 35 mm:
τ_in = F_in × r_impact

Precession threshold (below which gyroscopic resistance deflects the hit):
F_threshold = ω_tilt × L₀ / r_impact = 2.0 × 2.120×10⁻² / 0.035 = 1.211 N

Shield attenuation: incoming impulse ≤ (F_threshold × t_c) is fully deflected;
Z Achilles retains near-full ω₀ during the shield phase.
```

---

### 2. Combined Crush Approach — Orbital + Turbo Blade Contact

For the crush phase, Z Achilles charges from its high-spin defense posture directly into the opponent, combining orbital approach velocity with Turbo Blade blade contact velocity:

```
Orbital approach:
v_orbital = μ_Xt × ω₀ × r_driver = 0.30 × 580 × 0.005 = 0.870 m/s

Turbo Blade contact (same as Case 1928):
v_tip_turbo = ω₀ × r_turbo = 580 × 0.037 = 21.46 m/s
v_opp_contact = ω_opp × r_opp = 570 × 0.033 = 18.81 m/s
v_rel_blades  = 21.46 − 18.81 = 2.65 m/s

Combined crush velocity:
v_crush_total = v_orbital + v_rel_blades = 0.870 + 2.65 = 3.52 m/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.0 g (see Case 1928) |
| G_gyro | 12.29 N·m |
| F_threshold | 1.211 N |
| v_orbital | 0.870 m/s |
| v_rel_blades | 2.65 m/s |
| v_crush_total | 3.52 m/s |

---

## Case 1944 — SPECIAL: Turbo Crush (Super Z Press) — Aiger Akabane / Z Achilles 11 Xtend+

**Blader:** Aiger Akabane | **Beyblade:** Z Achilles 11 Xtend+ | **Type:** attack

### Description

Turbo Crush (超ゼットプレス Super Z Press) is a Special Move used by Aiger Akabane and his Z Achilles 11 Xtend+. Z Achilles increases its defense power via Turbo Awakening, entering a gyroscopic shield posture that deflects incoming attacks while sustaining near-full spin. The Xtend+ driver locks into its extended defense height for maximum stability. Then, from this fortified high-spin state, Achilles charges directly into the opponent — combining its full orbital approach speed with the Turbo Blade tip velocity in a concentrated full-body press that smashes the opponent with serious damage. The Burst Stopper Turbo Blades protect against burst during the high-drain contact.

### Stage — Gyroscopic Shield Defense → Full-Body Crush Contact

From Case 1943: v_crush_total = 3.52 m/s, e = 0.55 (Xtend+ in defense posture — deliberate heavy contact).

```
m_eff = (m_Z × m_opp) / (m_Z + m_opp) = (0.041 × 0.040) / (0.041 + 0.040)
      = 1.640×10⁻³ / 0.081 = 2.025×10⁻² kg

J_turbocrush = m_eff × (1 + e) × v_crush_total
             = 2.025×10⁻² × 1.55 × 3.52
             = 2.025×10⁻² × 5.456 = 1.105×10⁻¹ N·s

Δv_opp = J_turbocrush / m_opp = 1.105×10⁻¹ / 0.040 = 2.763 m/s
```

**Effect on Z Achilles (spin drain from shield-into-crush contact):**

```
Δω_Z = J_turbocrush × r_turbo / I_Z = 1.105×10⁻¹ × 0.037 / 3.654×10⁻⁵ = 111.9 rad/s
ω_remain = 580 − 111.9 = 468.1 rad/s  (80.7% retained)
Burst Stopper Turbo Blades prevent burst despite 111.9 rad/s drain from press contact.
```

---

**[M] BeySpirit amplification:**
Aiger's Achilles erupts in a full-body Z-power explosion — the shield becomes an impenetrable war-god's fortress that then transforms into a comet of concentrated energy, smashing into the opponent with such force that the bey is obliterated out of the stadium in a shockwave of compressed Z-power.

[M] factor = **7.5 ×** (Aiger Akabane — Turbo Achilles Cho-Z shield-crush spirit)
[M] Δv = 2.763 × 7.5 = **20.7 m/s** (gyroscopic shield crush ring-out)

> **Note:** Physical values describe gyroscopic shield G_gyro=12.29 N·m, F_threshold=1.211 N; crush v_orbital=0.870 + v_rel_blades=2.65 → v_total=3.52 m/s; J=1.105×10⁻¹ N·s; Δv=2.763 m/s; Burst Stopper prevents burst at Δω=111.9 rad/s. [M] values represent Aiger's Z-power shield fortress detonating into a full-body crush. Combos do not receive [M] amplification.

### TypeScript

```typescript
function turboCrushSpecial(bey: Beyblade, target: Beyblade): void {
  // Gyro shield G=12.29N·m; v_orbital=0.870+v_blade=2.65=3.52m/s total; J=1.105×10⁻¹N·s; [M] 7.5×
  const J_phys = 0.1105;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Aiger Turbo Achilles gyro-shield crush spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a variable-height Driver (Xtend+ or equivalent, switchable to defense height for gyroscopic stability) combined with a Turbo Awakening Energy Layer (Burst Stopper, r_turbo ≥ 34 mm), where the blader can sustain gyroscopic shield posture before committing to a full-mass orbital+blade crush approach. Standard game instance: Z Achilles 11 Xtend+ (Aiger Akabane, Burst Turbo).

---

## Case 1945 — COMBO: Achilles Press — Z Achilles 11 Xtend+

**Sequence:** K K A (defense · defense · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Aiger Akabane

### Physics Justification

Two consecutive defense inputs (K K) activate the Xtend+ shield phase — Z Achilles enters maximum gyroscopic stability posture, deflecting any incoming contact and sustaining spin. The second K compounds the stability, locking the Xtend+ at extended height. The attack (A) releases the shield momentum into a partial crush:

```
v_crush_partial = v_crush_total × 0.65 = 3.52 × 0.65 = 2.288 m/s

J_partial = m_eff × (1 + e) × v_crush_partial = 2.025×10⁻² × 1.55 × 2.288
          = 2.025×10⁻² × 3.546 = 7.181×10⁻² N·s
```

Gyroscopic stability during shield phase converts spin-drain suppression into effective spin gain (η_gyro = 0.15 — gyro damping redirects residual precession energy to spin):

```
Δω = η_gyro × J_partial × r_turbo / I_Z
   = 0.15 × 7.181×10⁻² × 0.037 / 3.654×10⁻⁵
   = 0.15 × 72.68
   = +10.9 rad/s  ≈ +11 rad/s
```

(η_gyro = 0.15: gyroscopic shield suppresses spin drain during K K phase; net effect is a spin preservation boost before A fires.) Shield-into-crush gives damageMultiplier **1.35×**. lockMs = 50 (Xtend+ press hold at extended height during crush contact).

**Parameters:**
- spinGain: +11 rad/s (gyroscopic spin-drain suppression η = 0.15)
- damageMultiplier: 1.35 (defense shield press-crush smash)
- lockMs: 50 (Xtend+ extended press dwell)

### TypeScript

```typescript
function achillesPressCombo(bey: Beyblade, target: Beyblade): void {
  // Gyro spin retention: Δω ≈ +11 rad/s (η=0.15, v_crush=2.288m/s, J=7.181×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 11);
  // Defense shield press-crush: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 50 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +11 rad/s (partial) | ✓ |



---

## Case 1946 — GIMMICK: Triumph Dragon Charge Metal 1A (Burst Sparking) — Triumph Ring Spring-Blade Awakening

**Beyblade:** Triumph Dragon Charge Metal 1A / テンペストドラゴン Charge Metal 1A (Beyblade Burst Surge / Sparking)
**Blader:** Dante Koryu | **Series:** Beyblade Burst Surge (Sparking season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Blade | Triumph Dragon (incl. Triumph Ring spring assembly) | 45.0 | 32.0 |
| Ratchet | 1A | 22.0 | 22.0 |
| Bit | Charge Metal | 10.9 | 6.0 |
| **Total** | | **77.9** | |

(No face component — Burst Sparking 3-part system. Takara Tomy only per Burst Scope. 77.9 g confirmed via CS9 Case 501–504.)

**I_total** = 45.0×10⁻³ × 0.032² + 22.0×10⁻³ × 0.022² + 10.9×10⁻³ × 0.006²
           = 4.608×10⁻⁵ + 1.065×10⁻⁵ + 3.924×10⁻⁷
           = **5.712×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (Burst Sparking standard launch)
L₀ = I × ω₀ = 5.712×10⁻⁵ × 700 = **3.998×10⁻² kg·m²/s**

---

### 1. Triumph Ring — Spring-Blade Awakening

The Triumph Ring is the outer section of the Triumph Dragon Blade, carrying 3 spring-loaded blade protrusions that lie flat (retracted) during normal spin and snap outward at r_ring = 32 mm when the "Awakened" state is triggered. Each spring is pre-compressed:

```
Spring constant per blade: k = 100 N/m
Compression: x = 6 mm = 0.006 m
PE per blade: PE_spring = ½ × k × x² = ½ × 100 × 0.006² = 1.800×10⁻³ J
N_spring_blades = 3
PE_total = 3 × 1.800×10⁻³ = 5.400×10⁻³ J

Spring-ring deployment velocity (η_spring = 0.75 coupling efficiency):
v_spring_deploy = √(2 × PE_total / m_ring) = √(2 × 5.400×10⁻³ / 0.045) = √0.2400 = 0.490 m/s
v_spring_eff    = η_spring × v_spring_deploy = 0.75 × 0.490 = 0.368 m/s
```

---

### 2. Awakened Contact — Spring Blade Tip Speed

Once Awakened, the blade tips operate at the full Triumph Ring radius r_ring = 32 mm:

```
v_tip = ω₀ × r_ring = 700 × 0.032 = 22.40 m/s

Relative contact velocity (right-spin opponent, ω_opp=690 rad/s, r_opp=0.028 m):
v_opp_contact = 690 × 0.028 = 19.32 m/s
v_rel_blade   = v_tip − v_opp_contact = 22.40 − 19.32 = 3.08 m/s

Combined contact velocity with spring contribution:
v_contact = v_rel_blade + v_spring_eff = 3.08 + 0.368 = 3.448 m/s

Charge Metal spin decay (μ_CM = 0.30, r_bit = 6 mm):
τ_CM = μ_CM × m × g × r_bit = 0.30 × 0.0779 × 9.81 × 0.006 = 1.375×10⁻³ N·m
t_spin = L₀ / τ_CM = 3.998×10⁻² / 1.375×10⁻³ = 29.1 s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 77.9 g |
| I_total | 5.712×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 3.998×10⁻² kg·m²/s |
| r_ring | 32 mm |
| v_tip | 22.40 m/s |
| PE_total | 5.400×10⁻³ J (3 blades) |
| v_spring_eff | 0.368 m/s |
| v_contact | 3.448 m/s |
| τ_CM | 1.375×10⁻³ N·m |
| t_spin | 29.1 s |

---

## Case 1947 — SPECIAL: Triumph Break (Tempest Break) — Dante Koryu / Triumph Dragon

**Blader:** Dante Koryu | **Beyblade:** Triumph Dragon Charge Metal 1A | **Type:** attack

### Description

Triumph Break (テンペストブレイク Tempest Break) is a Special Move used by Dante Koryu and his Triumph Dragon Charge Metal 1A. While in its Awakened form, Dragon uses the Triumph Ring's spring blades to deal massive damage to its opponent. The spring blades snap outward from the Triumph Ring as the bey enters the Awakened state, dramatically increasing the effective blade radius and delivering an explosive contact that combines the full tip speed of the extended blades with the spring-release energy. Triumph Dragon's exceptional mass (77.9 g) amplifies the ring-out momentum beyond any standard Sparking-era beyblade.

### Stage — Awakened Spring-Blade Contact Strike

From Case 1946: v_contact = 3.448 m/s, e = 0.65 (ABS/metal hybrid Sparking blade contact).

```
m_eff = (m_D × m_opp) / (m_D + m_opp) = (0.0779 × 0.040) / (0.0779 + 0.040)
      = 3.116×10⁻³ / 0.1179 = 2.643×10⁻² kg

J_triumphbreak = m_eff × (1 + e) × v_contact
               = 2.643×10⁻² × 1.65 × 3.448
               = 2.643×10⁻² × 5.689 = 1.503×10⁻¹ N·s

Δv_opp = J_triumphbreak / m_opp = 1.503×10⁻¹ / 0.040 = 3.758 m/s
```

**Effect on Triumph Dragon (spin drain from Awakened contact):**

```
Δω_D = J_triumphbreak × r_ring / I_D = 1.503×10⁻¹ × 0.032 / 5.712×10⁻⁵ = 84.2 rad/s
ω_remain = 700 − 84.2 = 615.8 rad/s  (88.0% retained)
(High I_total = 5.712×10⁻⁵ gives excellent spin retention vs heavy contact drain)
```

---

**[M] BeySpirit amplification:**
Dante's Dragon Bit-Beast erupts in full tempest fury — the Triumph Ring spring blades ignite in golden fire and the entire Triumph Dragon transforms into a whirling storm of dragon wings, the strike detonating the opponent clean out of the stadium in a cascade of lightning and thunder.

[M] factor = **7.5 ×** (Dante Koryu — Triumph Dragon tempest-spirit, Burst Surge protagonist)
[M] Δv = 3.758 × 7.5 = **28.2 m/s** (Awakened spring-blade tempest ring-out)

> **Note:** Physical values describe Triumph Ring spring deployment PE=5.400×10⁻³ J, v_spring=0.368 m/s; Awakened blade v_tip=22.40 m/s; v_contact=3.448 m/s; J=1.503×10⁻¹ N·s; Δv=3.758 m/s (mass-amplified by 77.9 g — 1.84× heavier than standard Sparking bey). [M] values represent Dante's Dragon erupting in tempest-wing fire. Combos do not receive [M] amplification.

### TypeScript

```typescript
function triumphBreakSpecial(bey: Beyblade, target: Beyblade): void {
  // Triumph Ring spring PE=5.4×10⁻³J, v_spring=0.368m/s; v_contact=3.448m/s; J=1.503×10⁻¹N·s; [M] 7.5×
  const J_phys = 0.1503;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_phys * 7.5; // [M] BeySpirit 7.5× (Dante Koryu Triumph Dragon tempest spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst Sparking-era beyblade using a Blade with a spring-loaded outer ring (Triumph Ring equivalent) carrying 3+ spring blades (PE ≥ 1.0×10⁻³ J per blade, r_ring ≥ 28 mm) capable of Awakened deployment at ω₀ ≥ 650 rad/s, paired with a Ratchet-Bit combination totalling ≥ 30 g for maximum mass-driven ring-out momentum. Standard game instance: Triumph Dragon Charge Metal 1A (Dante Koryu, Burst Surge).

---

## Case 1948 — COMBO: Triumph Guard — Triumph Dragon

**Sequence:** J A K (jump · attack · defense)
**Cost:** 15 | **Type:** attack | **Blader:** Dante Koryu

### Physics Justification

The jump (J) triggers a partial spring-blade pre-deployment — Triumph Dragon's Triumph Ring springs partially release, priming the blades at an intermediate radius. The attack (A) fires the Awakened strike at partial spring energy. The defense (K) closes with the spring-guard follow-through — partially-deployed blades fold back and absorb recoil, converting it to spin:

```
v_contact_partial = v_contact × 0.65 = 3.448 × 0.65 = 2.241 m/s

J_partial = m_eff × (1 + e) × v_contact_partial = 2.643×10⁻² × 1.65 × 2.241
          = 2.643×10⁻² × 3.698 = 9.773×10⁻² N·s
```

Spring-guard recoil recovery on K follow-through (η_spring = 0.15):

```
Δω = η_spring × J_partial × r_ring / I_D
   = 0.15 × 9.773×10⁻² × 0.032 / 5.712×10⁻⁵
   = 0.15 × 54.74
   = +8.2 rad/s  ≈ +8 rad/s
```

(η_spring = 0.15: spring-guard blade fold converts contact recoil into rotational momentum.) Partial Awakened spring-blade strike with guard gives damageMultiplier **1.35×**. lockMs = 100 (spring-guard dwell on landing K).

**Parameters:**
- spinGain: +8 rad/s (spring-guard blade-fold recoil η = 0.15)
- damageMultiplier: 1.35 (partial Awakened spring-blade strike + guard)
- lockMs: 100 (spring-guard dwell)

### TypeScript

```typescript
function triumphGuardCombo(bey: Beyblade, target: Beyblade): void {
  // Spring-guard recoil: Δω ≈ +8 rad/s (η=0.15, v_partial=2.241m/s, J=9.773×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 8);
  // Partial Awakened spring-blade strike + guard: 1.35× normal impulse
  bey.damageMultiplier = 1.35;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.35, (dy / dist) * 0.35);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.35 | ✓ |
| lockMs | ≤ 300 | 100 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +8 rad/s (partial) | ✓ |



---

## Case 1949 — GIMMICK: Curse Satomb Hurricane Universe 1D — Three-Ring Deflection System

**Beyblade:** Curse Satomb Hurricane Universe 1D (Beyblade Burst Surge / Sparking)
**Blader:** Silas Karlisle | **Series:** Beyblade Burst Surge (Sparking season)

### Assembly

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Chip | SK Chip | 2.9 | 4.0 |
| Blade | Curse Ring (outer ring + roller assembly) | 8.6 | 30.0 |
| Chassis | 1D | 11.4 | 20.0 |
| Disc | Hurricane (free-spinning outer disc) | 9.5 | 28.0 |
| Bit | Universe | 8.7 | 5.0 |
| **Total** | | **41.1** | |

(Burst Sparking 5-part system. TT only. 41.1 g from CS9 Case assembly table.)

**I_total** = 2.9×10⁻³ × 0.004² + 8.6×10⁻³ × 0.030² + 11.4×10⁻³ × 0.020² + 9.5×10⁻³ × 0.028² + 8.7×10⁻³ × 0.005²
           = 4.640×10⁻⁸ + 7.740×10⁻⁶ + 4.560×10⁻⁶ + 7.448×10⁻⁶ + 2.175×10⁻⁷
           = **1.999×10⁻⁵ kg·m²**

ω₀ = 700 rad/s (Burst Sparking standard launch)
L₀ = I × ω₀ = 1.999×10⁻⁵ × 700 = **1.399×10⁻² kg·m²/s**

---

### 1. Curse Ring — Roller Spin Transfer

The Curse Ring carries 3 symmetrically-placed free-spinning rubber rollers at r_roller = 30 mm. On contact, each roller absorbs the opponent's tangential blade energy and transfers a fraction back as spin:

```
Roller contact radius:  r_roller = 30 mm
Roller coefficient of restitution: e_roller = 0.30 (rubber — high energy absorption)
Spin-transfer efficiency: η_roller = 0.40

For each roller contact at v_contact:
  J_roller = m_eff_roller × (1 + e_roller) × v_rel
  ΔL_transfer = η_roller × J_roller × r_roller   (returned as spin angular momentum)
```

---

### 2. Hurricane Disc — Free-Spin Angular Decoupling

The Hurricane Disc outer ring free-spins independently of the bey body. On side contact, the free-spinning disc absorbs tangential impulse without transmitting it to the core chassis:

```
I_hurricane = 9.5×10⁻³ × 0.028² = 7.448×10⁻⁶ kg·m²
ω_disc_independent (at ω₀): corotating at 700 rad/s before contact

Angular decoupling factor: η_decouple = 0.65
  → 65% of tangential contact impulse is absorbed by the freely-spinning disc,
    reducing spin drain on the core 1D Chassis.
```

---

### 3. Universe Driver — Curved-Edge Deflection

The Universe Driver's curved hemispherical bottom edge acts as a deflector. Any incoming contact below the horizontal midplane strikes the curved face at deflection angle β:

```
β = 35°  (Universe Driver curvature angle vs flat contact plane)
v_def_normal  = v_incoming × cos(β) = v_incoming × cos(35°) = 0.819 × v_incoming
v_def_tangent = v_incoming × sin(β) = v_incoming × sin(35°) = 0.574 × v_incoming

Net deflection: incoming attack redirected; normal component imparts ring-out risk
on attacker, tangential component retained as Satomb orbital velocity boost.
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m | 41.1 g |
| I_total | 1.999×10⁻⁵ kg·m² |
| ω₀ | 700 rad/s |
| L₀ | 1.399×10⁻² kg·m²/s |
| r_roller | 30 mm |
| e_roller | 0.30 (rubber) |
| η_decouple | 0.65 (Hurricane free-spin) |
| β | 35° (Universe deflection angle) |
| v_def_normal fraction | 0.819 |

---

## Case 1950 — SPECIAL: Triple Spin (Triple Twister) — Silas Karlisle / Curse Satomb Hurricane Universe 1D

**Blader:** Silas Karlisle | **Beyblade:** Curse Satomb Hurricane Universe 1D | **Type:** defense/stamina

### Description

Triple Spin (トリプルツイスター Triple Twister) is a Special Move used by Silas Karlisle and his Curse Satomb Hurricane Universe 1D. Satomb exploits its three-layer deflection architecture — the Curse Ring's spinning rollers, the Hurricane Disc's free-spinning outer ring, and the Universe Driver's curved bottom edge — to create three simultaneous rings of defense capable of deflecting opposing Beyblades. Any attacker is caught between the outward-spinning roller contact (Curse Ring), the freely decoupled disc body (Hurricane), and the curved bottom deflection angle (Universe), absorbing the attack's energy and returning it as Satomb's continued spin.

### Stage — Three-Ring Deflection Against Single Attacker

Attacker at ω_att = 690 rad/s, r_att = 0.028 m:

```
v_att_contact = ω_att × r_att = 690 × 0.028 = 19.32 m/s
v_Satomb_tip  = ω₀ × r_roller = 700 × 0.030 = 21.00 m/s

v_rel_contact = v_Satomb_tip − v_att_contact = 21.00 − 19.32 = 1.68 m/s
(low v_rel confirms defensive engagement — Satomb does not chase; it deflects)

m_eff = (m_S × m_att) / (m_S + m_att) = (0.0411 × 0.040) / (0.0411 + 0.040)
      = 1.644×10⁻³ / 0.0811 = 2.027×10⁻² kg

Layer 1 — Curse Ring roller absorption:
  e_roller = 0.30; J_roller = m_eff × (1 + e_roller) × v_rel_contact
           = 2.027×10⁻² × 1.30 × 1.68 = 4.427×10⁻² N·s
  ΔL_spin_gain = η_roller × J_roller × r_roller = 0.40 × 4.427×10⁻² × 0.030
               = 5.312×10⁻⁴ kg·m²/s
  Δω_layer1 = ΔL_spin_gain / I_total = 5.312×10⁻⁴ / 1.999×10⁻⁵ = 26.6 rad/s

Layer 2 — Hurricane Disc angular decoupling:
  Tangential impulse absorbed by disc: J_disc = η_decouple × J_roller = 0.65 × 4.427×10⁻²
           = 2.878×10⁻² N·s  (attacker spin drain amplified; Satomb core shielded)

Layer 3 — Universe Driver curved deflection:
  Δv_att_deflect = J_roller / m_att × v_def_normal_fraction / (1 + e_roller)
  Redirect force on attacker: F_redirect = J_roller × sin(β) / t_contact
  t_contact = 0.005 s; F_redirect = 4.427×10⁻² × 0.574 / 0.005 = 5.082 N
  Δv_att_ring_out = J_roller × (1 + 0) / m_att × 0.819 = 4.427×10⁻² × 0.819 / 0.040
                  = 0.906 m/s  (attacker pushed outward at deflection angle)
```

**Net effect on Curse Satomb:**

```
Δω_Satomb = Δω_layer1 = 26.6 rad/s  (spin gain from roller absorption)
ω_remain   = 700 + 26.6 = 726.6 rad/s  (deflection gives spin boost to defender)
```

---

**[M] BeySpirit amplification:**
Silas's cold mechanical mastery crystallises into three rings of absolute zero — the Curse Ring rollers ignite with deep-blue ice fire, the Hurricane Disc becomes an impenetrable spinning wall, and the Universe Driver's curved face sends the attacker spiraling outward in a storm of triple-twisters that threaten to carry it right out of the stadium.

[M] factor = **6.5 ×** (Silas Karlisle — supporting antagonist, three-ring ice deflection spirit)
[M] Δv_att = 0.906 × 6.5 = **5.89 m/s** (triple-ring deflection ring-out redirect)

> **Note:** Physical values describe three-ring defense: J_roller=4.427×10⁻²N·s (e=0.30), Δω_Satomb=+26.6 rad/s spin gain; F_redirect=5.082 N; Δv_att=0.906 m/s at β=35° Universe deflection. Hurricane disc η_decouple=0.65 absorbs 2.878×10⁻² N·s from attacker. [M] values represent Silas's triple-twister spirit amplification. Combos do not receive [M] amplification.

### TypeScript

```typescript
function tripleSpinSpecial(bey: Beyblade, target: Beyblade): void {
  // 3-ring defense: J_roller=4.427×10⁻²N·s(e=0.30), Δω_Satomb=+26.6r/s, Δv_att=0.906m/s; [M] 6.5×
  const J_roller = 0.04427;
  bey.spin = Math.min(bey.maxSpin, bey.spin + 27); // Δω=+26.6 rad/s roller spin gain
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_roller * 6.5; // [M] BeySpirit 6.5× (Silas triple-ring deflection)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any Burst-era beyblade using a Blade or Chassis with free-spinning rubber roller contact elements (≥ 3 rollers at r ≥ 28 mm) combined with a free-spinning Disc (angular decoupling η ≥ 0.50) and a curved-edge Driver (hemispherical or tapered profile, deflection β ≥ 25°) capable of spin-transfer absorption under sustained attack. Standard game instance: Curse Satomb Hurricane Universe 1D (Silas Karlisle, Burst Surge).

---

## Case 1951 — COMBO: Satomb Reflect — Curse Satomb Hurricane Universe 1D

**Sequence:** K A K (defense · attack · defense)
**Cost:** 15 | **Type:** defense | **Blader:** Silas Karlisle

### Physics Justification

The first defense (K) engages the Curse Ring roller absorb — Satomb receives an incoming hit, roller contact absorbs and partially stores energy. The attack (A) fires the reflected impulse outward via the Universe Driver curved deflection (returning the stored redirect force). The final defense (K) re-engages the roller spin-gain close — Satomb re-locks roller contact and converts recoil into spin:

```
v_contact_combo = v_rel_contact × 0.60 = 1.68 × 0.60 = 1.008 m/s

J_reflect = m_eff × (1 + e_roller) × v_contact_combo = 2.027×10⁻² × 1.30 × 1.008
          = 2.656×10⁻² N·s
```

Hurricane Disc free-spin decoupling converts residual contact energy to spin on the K close (η_decouple = 0.20 for combo):

```
Δω = η_decouple × J_reflect × r_roller / I_total
   = 0.20 × 2.656×10⁻² × 0.030 / 1.999×10⁻⁵
   = 0.20 × 39.87
   = +8.0 rad/s  ≈ +8 rad/s
```

(η_decouple = 0.20: Hurricane Disc free-spin absorbs residual after reflect and converts to spin on re-engagement.) Roller reflect gives damageMultiplier **1.25×**. lockMs = 150 (roller dwell on K-close contact absorption).

**Parameters:**
- spinGain: +8 rad/s (Hurricane disc decoupling η = 0.20)
- damageMultiplier: 1.25 (roller-deflect reflect counter)
- lockMs: 150 (roller absorb dwell on close)

### TypeScript

```typescript
function satombReflectCombo(bey: Beyblade, target: Beyblade): void {
  // Hurricane disc recoil: Δω ≈ +8 rad/s (η=0.20, v_combo=1.008m/s, J=2.656×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 8);
  // Roller-deflect reflect counter: 1.25× normal impulse
  bey.damageMultiplier = 1.25;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.25, (dy / dist) * 0.25);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.25 | ✓ |
| lockMs | ≤ 300 | 150 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +8 rad/s (partial) | ✓ |



---

## Case 1952 — GIMMICK: Rock Orso D125B (×3) — Coordinated Three-Bear Surround Push

**Beyblade:** Rock Orso D125B (Beyblade Metal Fusion / Metal Fight Beyblade)
**Bladers:** Kumasuke Kumade, Kumata Kumade, Kumaji Kumade | **Series:** Beyblade Metal Fusion

### Assembly (single Rock Orso D125B)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Face | Face Bolt | 1.0 | 0.0 |
| Energy Ring | Orso | 7.0 | 33.0 |
| Fusion Wheel | Rock | 30.0 | 29.0 |
| Spin Track | D125 (Defense 125) | 4.5 | 15.0 |
| Performance Tip | B (Ball) | 3.5 | 1.0 |
| **Total** | | **46.0** | |

(MFB 5-part system. Rock Fusion Wheel: wide, flat contact surface, high m at outer radius — stamina/defense type. D125 adds height for ground contact avoidance. Ball tip: low friction, wide wandering.)

**I_single** = 1.0×10⁻³ × 0.0² + 7.0×10⁻³ × 0.033² + 30.0×10⁻³ × 0.029² + 4.5×10⁻³ × 0.015² + 3.5×10⁻³ × 0.001²
            = 0 + 7.623×10⁻⁶ + 2.523×10⁻⁵ + 1.013×10⁻⁶ + 3.500×10⁻⁹
            = **3.388×10⁻⁵ kg·m²**

ω₀ = 580 rad/s (MFB standard launch)
L₀ = I × ω₀ = 3.388×10⁻⁵ × 580 = **1.965×10⁻² kg·m²/s**

---

### Three-Bey Coordinated Surround

All three Rock Orso units launch simultaneously with equal spin and are steered into a triangular formation surrounding the opponent at r_surround = 80 mm from the opponent's centre. Each Orso approaches along a radial vector separated by 120°.

```
Three surround approach vectors (120° spacing):
  θ₁ = 0°,   θ₂ = 120°,  θ₃ = 240°

Approach velocity from Ball tip wandering (μ_B = 0.05, high orbital range):
  v_approach = μ_B × ω₀ × r_tip = 0.05 × 580 × 0.001 = 0.029 m/s (natural wander)

Blader-guided vector push (bladers steer all three simultaneously):
  v_push_guided = 0.25 m/s  (blader redirects bey by tilting launcher post-launch)

Net approach velocity per bey toward target:
  v_per_bey = v_approach + v_push_guided = 0.029 + 0.25 = 0.279 m/s ≈ 0.28 m/s
```

---

### Surround Push Geometry

```
With 3 Orso beys at 120° spacing, each pushing inward radially, the net force on the
opponent is zero only when the target is centred. Any asymmetry concentrates force
along the axis with largest net imbalance — so the triple push drives the opponent
toward the nearest wall (not toward any single Orso).

Net impulse per contact (all 3 fire at once):
  J_total = N_beys × m_eff_each × (1 + e) × v_per_bey
  where N_beys = 3, e = 0.55 (Rock Fusion Wheel flat face — stamina/defense contact)

  m_eff_each = (m_Orso × m_opp) / (m_Orso + m_opp) = (0.046 × 0.040) / (0.046 + 0.040)
             = 1.840×10⁻³ / 0.086 = 2.140×10⁻² kg

  J_per_hit = m_eff_each × (1 + e) × v_per_bey = 2.140×10⁻² × 1.55 × 0.28
            = 2.140×10⁻² × 0.434 = 9.288×10⁻³ N·s

  J_total = 3 × 9.288×10⁻³ = 2.786×10⁻² N·s

Net Δv_opp = J_total / m_opp = 2.786×10⁻² / 0.040 = 0.697 m/s
(Net radial push; opponent displaced toward nearest wall)
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m (single Orso) | 46.0 g |
| I_single | 3.388×10⁻⁵ kg·m² |
| ω₀ | 580 rad/s |
| L₀ | 1.965×10⁻² kg·m²/s |
| N_beys | 3 |
| v_per_bey | 0.28 m/s |
| J_per_hit | 9.288×10⁻³ N·s |
| J_total (×3) | 2.786×10⁻² N·s |
| Δv_opp | 0.697 m/s |

---

## Case 1953 — SPECIAL: Triple Orso Step — Kumade Brothers / Rock Orso D125B ×3

**Bladers:** Kumasuke Kumade, Kumata Kumade, Kumaji Kumade | **Beyblade:** Rock Orso D125B ×3 | **Type:** attack (joint)

### Description

Triple Orso Step is a Joint Special Move used by Kumasuke Kumade and his brothers Kumata and Kumaji Kumade and their Rock Orso D125B beyblades. All three brothers simultaneously push the opponent's beyblade to the edge of the stadium, working in coordinated triangular formation. Each Orso charges inward along one of three radial push axes (120° apart), creating a net displacement force that drives the opponent toward the nearest wall. This technique was first used against Tsubasa and his Earth Eagle 145WD.

### Stage — Coordinated Triple Surround Push

From Case 1952: J_total = 2.786×10⁻² N·s, Δv_opp = 0.697 m/s (net radial toward nearest wall).

```
Opponent initial position: at arena centre; arena radius R_arena = 400 mm (MFB standard)
Net displacement per push phase: Δx = Δv_opp × t_push = 0.697 × 0.8 = 0.558 m  (too large — clamp to 60% arena)

Realistic push: 3 × hits over 0.8s with natural deceleration friction
  Effective cumulative Δv = J_total / m_opp × η_push = 0.697 × 0.80 = 0.557 m/s
  (η_push = 0.80: friction and reaction offset during guided push)

Repeat cycle: brothers execute 2 push cycles before opponent reaches wall:
  Cycle 1: Δv_1 = 0.557 m/s; Cycle 2 (residual, tighter formation): Δv_2 = 0.557 × 0.70 = 0.390 m/s
  Total push velocity before wall: Δv_total = 0.557 + 0.390 = 0.947 m/s

Wall impact (arena wall, e_wall = 0.50):
  v_wall = Δv_total = 0.947 m/s
  If opponent at wall edge: 0.947 m/s > ring-out escape threshold (0.60 m/s for 40g bey)
  → ring-out achieved by combined push
```

---

**[M] BeySpirit amplification:**
The three Kumade brothers' bear spirits rise together — three massive grizzlies erupting in earth-shaking unison, their Rock Wheels crashing inward from all sides and the ground itself trembling under the Orso Step. The opponent's bey is engulfed in a wall of brown-gold spirit fire and crushed straight out of the arena in a single coordinated bear-rush.

[M] factor = **5.5 ×** (Kumade brothers — supporting comic-relief trio, bear-spirit team bond)
[M] Δv_total = 0.947 × 5.5 = **5.21 m/s** (coordinated triple bear-push ring-out)

> **Note:** Physical values describe 3-bey surround push: J_per_hit=9.288×10⁻³ N·s, J_total=2.786×10⁻² N·s; two push cycles Δv_total=0.947 m/s; exceeds 40g ring-out escape threshold 0.60 m/s. [M] values represent the three brothers' grizzly bear-spirits erupting in unison. Combos do not receive [M] amplification. This is a joint move requiring all 3 brothers' beys on the field simultaneously.

### TypeScript

```typescript
function tripleOrsoStepSpecial(bey: Beyblade, target: Beyblade): void {
  // 3-bey surround: J_total=2.786×10⁻²N·s(3×), 2 push cycles Δv=0.947m/s; [M] 5.5×
  const J_total = 0.02786;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_total * 5.5; // [M] BeySpirit 5.5× (Kumade brothers bear-spirit)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any MFB-era beyblade using a wide flat-contact Fusion Wheel (defense/stamina type, r_CoM ≥ 27 mm) and a wandering Performance Tip (Ball or equivalent, μ ≤ 0.10) that can be blader-guided post-launch via tilt, used in a 3-bey coordinated surround formation at 120° spacing. Standard game instance: Rock Orso D125B ×3 (Kumade brothers, Metal Fusion). Joint move — requires 3 beys of the same type on the field simultaneously.

---

## Case 1954 — COMBO: Orso Triangle — Rock Orso D125B

**Sequence:** → ↑ ← (moveRight · moveUp · moveLeft)
**Cost:** 15 | **Type:** attack | **Blader:** Kumasuke Kumade (lead brother)

### Physics Justification

The three directional moves simulate the three legs of the triangular surround approach: moveRight (→) sends the lead Orso clockwise; moveUp (↑) drives the approach inward toward the centre; moveLeft (←) completes the triangular arc. At the crossover of all three vectors, the Rock Wheel's flat wide face delivers the concentrated three-leg-contact push impulse:

```
v_orbital_lead = μ_B × ω₀ × r_tip = 0.05 × 580 × 0.001 = 0.029 m/s (Ball tip orbital)
v_guided_push  = 0.25 m/s  (blader-guided push, same as Case 1952)
v_arc_bonus    = v_orbital_lead × 2 × sin(60°) = 0.029 × 2 × 0.866 = 0.0503 m/s
(triangular arc momentum at 60° per leg)

v_contact_combo = v_guided_push + v_arc_bonus = 0.25 + 0.0503 = 0.300 m/s

J_combo = m_eff_each × (1 + e) × v_contact_combo = 2.140×10⁻² × 1.55 × 0.300
        = 2.140×10⁻² × 0.465 = 9.951×10⁻³ N·s
```

Ball tip wide orbital converts triangle arc into a spin retention loop (η_B = 0.10):

```
Δω = η_B × J_combo × r_tip / I_single
   = 0.10 × 9.951×10⁻³ × 0.001 / 3.388×10⁻⁵
   = 0.10 × 0.2937
   = +0.029 rad/s  → round to +1 rad/s minimum (floor)
```

(η_B = 0.10: Ball tip orbital momentum loop; negligible spin gain, purely positional. Flat Rock Wheel gives consistent moderate damageMultiplier.) Triangle arc push gives damageMultiplier **1.20×**. lockMs = 0 (attack type, continuous orbital sweep).

**Parameters:**
- spinGain: +1 rad/s (Ball tip orbital minimum)
- damageMultiplier: 1.20 (triangular arc flat-face push)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function orsoTriangleCombo(bey: Beyblade, target: Beyblade): void {
  // Ball orbital arc: Δω ≈ +1 rad/s minimum (η=0.10, v_combo=0.300m/s, J=9.951×10⁻³N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 1);
  // Triangle arc flat-face push: 1.20× normal impulse
  bey.damageMultiplier = 1.20;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.20, (dy / dist) * 0.20);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.20 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +1 rad/s (minimum) | ✓ |



---

## Case 1955 — GIMMICK: Blade Sharks Formation — Triangle Attack Geometry (Bakuten Shoot / G-Revolution)

**Beyblade:** Blade Sharks plastic-generation attack beys (representative: Dranzer S-type equivalent)
**Bladers:** Blade Sharks gang members (3) | **Series:** Beyblade (Bakuten Shoot / G-Revolution)

### Assembly (representative single Blade Sharks bey — sharp attack type)

| Part | Component | Mass (g) | r_CoM (mm) |
|------|-----------|----------|------------|
| Bit Chip | Standard | 1.0 | 0.0 |
| Attack Ring | Sharp 4-wing (narrow, aggressive contact) | 9.0 | 35.0 |
| Weight Disk | Wide (standard) | 14.0 | 26.0 |
| Spin Gear | Standard Right | 5.0 | 10.0 |
| Blade Base | Flat Base (aggressive wandering) | 6.0 | 2.0 |
| **Total** | | **35.0** | |

(Plastic generation 5-part system. Representative of Blade Sharks attack-type beys used in group scenes. Flat Base gives high orbital speed for coordinated strike. 35.0 g estimated — standard plastic-gen light attack type.)

**I_single** = 1.0×10⁻³ × 0.0² + 9.0×10⁻³ × 0.035² + 14.0×10⁻³ × 0.026² + 5.0×10⁻³ × 0.010² + 6.0×10⁻³ × 0.002²
            = 0 + 1.103×10⁻⁵ + 9.464×10⁻⁶ + 5.000×10⁻⁷ + 2.400×10⁻⁸
            = **2.097×10⁻⁵ kg·m²**

ω₀ = 500 rad/s (plastic-gen standard launch)
L₀ = I × ω₀ = 2.097×10⁻⁵ × 500 = **1.049×10⁻² kg·m²/s**

---

### Triangle Attack — Coordinated Strike Formation

Three beys positioned at triangle vertices (equilateral, side = 120 mm) surrounding the target at formation radius r_formation = 70 mm from the opponent's centre:

```
Formation geometry: equilateral triangle, r_formation = 70 mm
  θ₁ = 90°,  θ₂ = 210°,  θ₃ = 330°  (vertex positions)

Each Blade Sharks bey charges inward along its radial vector simultaneously.
Flat Base high-speed wandering provides natural orbital approach:
  v_flat = μ_flat × ω₀ × r_tip = 0.70 × 500 × 0.002 = 0.700 m/s
  (μ_flat = 0.70 — aggressive plastic Flat Base friction; high translational velocity)

Coordinated charge approach velocity per bey:
  v_attack = v_flat = 0.700 m/s (Flat Base drives direct aggressive dash to target)
```

---

### Contact Physics — Sharp Attack Ring Impact

Each of the 3 Blade Sharks beys delivers a concentrated sharp-wing attack ring blow:

```
m_eff_each = (m_BS × m_opp) / (m_BS + m_opp) = (0.035 × 0.040) / (0.035 + 0.040)
           = 1.400×10⁻³ / 0.075 = 1.867×10⁻² kg

e_sharp = 0.70 (sharp plastic attack ring — high restitution, less energy absorption)

J_per_hit = m_eff_each × (1 + e_sharp) × v_attack = 1.867×10⁻² × 1.70 × 0.700
          = 1.867×10⁻² × 1.190 = 2.222×10⁻² N·s

J_triangle = 3 × J_per_hit = 3 × 2.222×10⁻² = 6.666×10⁻² N·s
(simultaneous three-point impact; net resultant pushes opponent toward nearest wall)

Δv_opp = J_triangle / m_opp = 6.666×10⁻² / 0.040 = 1.667 m/s
```

### Key Parameters Summary

| Quantity | Value |
|---------|-------|
| m (single) | 35.0 g |
| I_single | 2.097×10⁻⁵ kg·m² |
| ω₀ | 500 rad/s |
| L₀ | 1.049×10⁻² kg·m²/s |
| N_beys | 3 |
| v_attack | 0.700 m/s |
| e_sharp | 0.70 |
| J_per_hit | 2.222×10⁻² N·s |
| J_triangle (×3) | 6.666×10⁻² N·s |
| Δv_opp | 1.667 m/s |

---

## Case 1956 — SPECIAL: Triangle Attack — Blade Sharks ×3

**Bladers:** Blade Sharks gang members (3) | **Beyblade:** Plastic attack-type beys ×3 | **Type:** attack (joint)

### Description

Triangle Attack is a Joint Special Move used by the Blade Sharks gang and their plastic-generation attack-type beyblades. Three beys are coordinated into an equilateral triangle formation surrounding the target, then all charge inward simultaneously along their radial vectors. The simultaneous three-point impact overwhelms the opponent's ability to react — each hit comes from a different direction, with the combined impulse driving the opponent's bey toward the wall or into a ring-out. Unlike the Orso Step's sustained push, the Triangle Attack is a single concentrated burst — all three beys crash in and strike at the same instant.

### Stage — Simultaneous Three-Point Triangle Strike

From Case 1955: J_triangle = 6.666×10⁻² N·s, Δv_opp = 1.667 m/s.

```
Net impulse direction: net resultant depends on formation asymmetry vs opponent position.
For opponent displaced d = 30 mm from exact centre of the triangle:
  Net J_resultant = √(J_triangle² × asymmetry_factor) ≈ J_triangle × 0.90
  (0.90: slight off-centre reduces perfect cancellation; 90% of peak J translates as net push)
  J_net = 0.90 × 6.666×10⁻² = 5.999×10⁻² N·s

  Δv_net = J_net / m_opp = 5.999×10⁻² / 0.040 = 1.500 m/s

Spin drain per Blade Sharks bey from sharp contact:
  Δω_each = J_per_hit × r_AR / I_single = 2.222×10⁻² × 0.035 / 2.097×10⁻⁵ = 37.1 rad/s
  ω_remain_each = 500 − 37.1 = 462.9 rad/s  (92.6% retained)
```

---

**[M] BeySpirit amplification:**
The Blade Sharks' predatory gang-spirit ignites — three beyblades transform into charging sharks, all converging at once from three directions in a triangular flash of teeth and blades. The opponent's bey is engulfed in a spinning triangle of force and smashed out of the stadium before it can react.

[M] factor = **4.5 ×** (Blade Sharks — minor gang antagonists, plastic-gen; lowered for non-protagonist trio)
[M] Δv_net = 1.500 × 4.5 = **6.75 m/s** (triangle strike ring-out)

> **Note:** Physical values describe 3-bey triangle formation: J_per_hit=2.222×10⁻²N·s (e=0.70 sharp AR), J_triangle=6.666×10⁻²N·s; net Δv=1.500 m/s (90% transfer at 30mm offset). Each Blade Sharks bey loses 37.1 rad/s per strike. [M] values represent the gang's shark-spirit predator charge. Combos do not receive [M] amplification. Joint move — requires all 3 beys on field simultaneously.

### TypeScript

```typescript
function triangleAttackSpecial(bey: Beyblade, target: Beyblade): void {
  // 3-bey triangle strike: J_triangle=6.666×10⁻²N·s(×3), J_net=5.999×10⁻²N·s, Δv=1.500m/s; [M] 4.5×
  const J_net = 0.05999;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  const amplified = J_net * 4.5; // [M] BeySpirit 4.5× (Blade Sharks gang predator triangle)
  applyForce(target.id, (dx / dist) * amplified, (dy / dist) * amplified);
}
```

**Compatible beys:** Any plastic-generation beyblade using a sharp or aggressive wide-contact Attack Ring (r_AR ≥ 32 mm, e ≥ 0.60) and a high-speed wandering Blade Base (Flat Base or equivalent, μ ≥ 0.50, v_flat ≥ 0.60 m/s) capable of coordinated blader-guided simultaneous approach in a triangle formation. Standard game instance: Blade Sharks plastic attack-type beys ×3 (Blade Sharks gang, Bakuten Shoot). Joint move — requires 3 beys of the same type on the field simultaneously.

---

## Case 1957 — COMBO: Shark Triangle — Blade Sharks plastic attack bey

**Sequence:** ↑ ↓ A (moveUp · moveDown · attack)
**Cost:** 15 | **Type:** attack | **Blader:** Blade Sharks lead member

### Physics Justification

The moveUp (↑) drives the lead Blade Sharks bey straight at the opponent, building approach momentum. The moveDown (↓) reverses briefly — the lead bey pulls back and angled wide, simulating the shark's classic feint-and-bite. The attack (A) fires the sharp attack ring strike at the pull-back snap point:

```
v_approach  = v_flat = 0.700 m/s  (Flat Base from Case 1955)
v_feint_pullback = v_flat × 0.50 = 0.350 m/s  (partial reversal)
v_snap_bite = v_approach + v_feint_pullback = 0.700 + 0.350 = 1.050 m/s
(snap-back creates a whip-like closing velocity as bey reverses into attack arc)

J_snap = m_eff_each × (1 + e_sharp) × v_snap_bite = 1.867×10⁻² × 1.70 × 1.050
       = 1.867×10⁻² × 1.785 = 3.333×10⁻² N·s
```

Flat Base orbital rotation converts snap recoil into spin recovery (η_flat = 0.05 — minimal for attack type):

```
Δω = η_flat × J_snap × r_AR / I_single
   = 0.05 × 3.333×10⁻² × 0.035 / 2.097×10⁻⁵
   = 0.05 × 55.58
   = +2.8 rad/s  ≈ +3 rad/s
```

(η_flat = 0.05: Flat Base dissipates most momentum as translational movement, minimal spin recovery.) Shark feint-snap gives damageMultiplier **1.30×**. lockMs = 0 (attack type, snap bite with no dwell).

**Parameters:**
- spinGain: +3 rad/s (Flat Base snap-back minimal recovery)
- damageMultiplier: 1.30 (sharp AR feint-snap bite)
- lockMs: 0 (attack type)

### TypeScript

```typescript
function sharkTriangleCombo(bey: Beyblade, target: Beyblade): void {
  // Flat Base snap: Δω ≈ +3 rad/s (η=0.05, v_snap=1.050m/s, J=3.333×10⁻²N·s)
  bey.spin = Math.min(bey.maxSpin, bey.spin + 3);
  // Sharp AR feint-snap bite: 1.30× normal impulse
  bey.damageMultiplier = 1.30;
  const dx = target.x - bey.x;
  const dy = target.y - bey.y;
  const dist = Math.hypot(dx, dy) || 1;
  applyForce(target.id, (dx / dist) * 0.30, (dy / dist) * 0.30);
}
```

### Ceiling Check

| Constraint | Limit | This combo | Status |
|-----------|-------|-----------|--------|
| damageMultiplier | ≤ 1.5 | 1.30 | ✓ |
| lockMs | ≤ 300 | 0 | ✓ |
| Invulnerability | none | none | ✓ |
| AoE | none | none | ✓ |
| Full spin recovery | none | +3 rad/s (minimal) | ✓ |

*Cases continue from Case 1958 as further franchise moves are provided.*

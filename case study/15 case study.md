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

*Cases continue from Case 1800 as further franchise moves are provided.*



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

*Cases continue from Case 1800 as further franchise moves are provided.*

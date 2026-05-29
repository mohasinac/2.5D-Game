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

*Cases continue from Case 1886 as further franchise moves are provided.*



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

*Cases continue from Case 1886 as further franchise moves are provided.*

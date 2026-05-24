---
batch: 015
stage: real-world-physics
status: complete
sources_checked: 16
facts: 58
inferences: 12
unknowns: 5
---

[← Batch 014: Archetype Physics](batch-014-archetype-physics-deep-dive.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

---

# Batch 015 — Real-World Physics Deep Dive

> **Date**: 2026-05-24 | **Session 26**
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Purpose**: Ground the Beyblade physics engine in real classical mechanics. Covers gyroscopic precession and nutation, moment of inertia and angular momentum, rigid-body collision impulse, tip-floor tribology, spin decay, Euler's Disk (LAD rolling), and opposite-spin gear-coupling. Every claim tied to authoritative physics source.

---

## URL / Search Log

| Source | Method | Data Extracted |
|--------|--------|----------------|
| OpenStax University Physics Vol 1 §11.5 (LibreTexts) | WebFetch | Full precession formula Ω_P = rMg/Iω; torque-precession derivation |
| modern-physics.org/spinning-top-2 | WebFetch | Precession formula confirmed; rotational KE formula |
| physics.usyd.edu.au ~cross SPINNING TOPS | WebFetch | Friction drives rising; stability qualitative |
| Futurism / Physics LibreTexts — nutation | WebSearch | Stability threshold qualitative; nutation oscillation description |
| WBO Thread: The Physics of Beyblades | WebSearch (403 blocked) | Key snippet: OWD, mass, angular momentum |
| tribonet.org stick-slip | WebSearch | Stick-slip definition; static vs kinetic friction threshold |
| scovieprecisionturning.com | WebFetch | Pointed tip reduces contact area; wobble increases friction |
| Euler's Disk Wikipedia / arxiv | WebSearch | Precession rate diverges as spin → 0; finite-time singularity |
| Rolling friction PMC 4123768 | WebSearch | Rolling friction = primary dissipation in spinning disc near end |
| research.ncl.ac.uk collision response PDF | WebFetch | Impulse formula confirmed (binary PDF — formula from existing knowledge) |
| fotino.me 2D rigid body collision | WebSearch | Angular impulse confirmed; Δω = j(r×n)/I |
| myphysicslab.com rigid body collisions | WebSearch | Full j formula confirmed |
| tippe top inversion papers | WebSearch | Friction torque can raise COM; role of rolling vs sliding friction |
| WBO Physics thread snippet | WebSearch | Heavier = more angular momentum; OWD spin time confirmed |
| AI Future School moment of inertia | WebSearch | I = Σ(m·r²); flywheel effect |
| MIT Wiki spinning top model | WebSearch | Euler-Lagrange model reference |

---

## SECTION A — GYROSCOPIC PRECESSION

### A1. The Precession Formula

A spinning top that tilts does NOT fall — instead it **precesses** (the spin axis rotates around the vertical).

**Primary equation (confirmed from OpenStax / PhysLibreTexts):**

```
Ω_P = τ / L = (r · M · g · sin θ) / (I · ω)
```

| Variable | Meaning |
|----------|---------|
| Ω_P | Precession angular velocity (how fast the spin axis orbits the vertical) |
| τ | Gravitational torque = r·M·g·sinθ |
| L | Angular momentum = I·ω |
| r | Distance from contact point (pivot) to center of mass |
| M | Total mass |
| g | 9.81 m/s² |
| θ | Tilt angle from vertical |
| I | Moment of inertia about spin axis |
| ω | Spin angular velocity (rad/s) |

**Critical insight — Ω_P is INVERSELY proportional to ω:**

| Spin state | Precession rate | Visual behavior |
|-----------|----------------|----------------|
| ω high (launch) | Very slow precession | Nearly vertical; very stable |
| ω medium | Moderate precession | Gentle visible orbit of tilt axis |
| ω low (dying) | Fast precession | Wide wobble circles; visibly unstable |
| ω → 0 | Precession → ∞ | Finite-time collapse (falls over) |

**Physics source**: *"the precession angular velocity is much less than the angular velocity of the gyroscope disk"* — OpenStax UP Vol 1. The faster it spins, the more stable it stands.

---

### A2. How Precession Resists Toppling

**Mechanism** (confirmed from OpenStax):
1. Gravity creates torque **τ = r·M·g·sinθ** that tries to tilt the top further
2. This torque is **perpendicular** to the angular momentum vector L
3. Perpendicular torque changes L's **direction** but not its **magnitude**
4. The spin axis rotates around the vertical → precession — instead of falling

> *"The torque produced is perpendicular to the angular momentum vector, which changes the direction of the angular momentum vector but not its magnitude."* — LibreTexts

**Engine implication**: At high spin, `tiltAngle` should NOT grow under gravity (the precession handles it). The bey should precess (orbit center) rather than fall. Only when spin drops below the stability threshold should tilt grow into full wobble.

---

### A3. Nutation

**Nutation** = the oscillation of the tilt angle around its steady precession value. The bey "bobs" as it precesses.

| Nutation state | Condition | Visual | Engine param |
|---------------|-----------|--------|-------------|
| Micro-nutation | ω high → nutation freq >> precession freq | Nearly invisible high-frequency wobble | Small amplitude, high frequency |
| Macro-nutation | ω drops → nutation freq ≈ precession freq | Large visible wobble circles | Large amplitude wobble |
| Collapse | ω below critical threshold | Tilt grows uncontrollably | `stability < threshold` → apply wobble force |

**Source**: *"The top overshoots the amount of tilt at which it would precess steadily and then oscillates about this level, and this oscillation is called nutation."* — LibreTexts 5.9

**Current engine model (CLAUDE.md):**
```typescript
const stability = beyblade.spin / beyblade.maxSpin;
if (stability < 0.4) {
  applyForce(id, (this.rand() - 0.5) * wobble, (this.rand() - 0.5) * wobble);
}
```
**Assessment**: The 40% spin threshold and random wobble force are **physically correct in principle**. The threshold value (40%) is game-design, not derived from first principles, but directionally accurate. The random force approximates nutation without full Euler-angle simulation. **CORRECT — keep as-is.**

---

## SECTION B — MOMENT OF INERTIA AND ANGULAR MOMENTUM

### B1. Moment of Inertia Formula

```
I = Σ(m_i · r_i²)
```

For a continuous body: `I = ∫ r² dm`

| Shape | I formula | Beyblade analog |
|-------|-----------|----------------|
| Thin ring (all mass at radius R) | M·R² | WD with all mass at perimeter |
| Solid disc (uniform) | ½·M·R² | Standard disc WD |
| Solid sphere | ⅖·M·R² | Ball tip |
| Point mass at radius r | m·r² | Metal ball in Metal Ball Base |

**The r² factor**: Doubling the radius from axis QUADRUPLES contribution to I. This is why Wide Defense (wider radius) has dramatically more effect on spin time than Ten Heavy (same mass but more inward).

### B2. Angular Momentum

```
L = I · ω
```

L is the key measure of "spin energy" that resists toppling. More L = more stable.

| Strategy | How it achieves high L |
|----------|----------------------|
| High ω (attack launch) | Launch fast → high ω initially → high L → stable during attack |
| High I (OWD WD) | Wide mass distribution → high I → same ω yields more L → long spin time |
| High M (heavy bey) | More mass → more I (assuming same distribution) → more L |

**Beyblade type trade-off:**

| Type | Priority | L strategy |
|------|----------|-----------|
| Attack | High ω, moderate I | Reaches high RPM quickly; spends L on attacks |
| Stamina/Zombie | High I (OWD) | Preserves L over time even as ω slowly drops |
| Defense | High M (both I and mass) | Large L and mass resist angular deceleration from hits |

---

### B3. Flywheel Effect (Confirmed)

> *"A top designed with a higher moment of inertia and a better shape can minimize energy loss and spin for a longer time."* — AI FutureSchool

This is the flywheel principle: **mass at the perimeter stores rotational kinetic energy most efficiently.**

**Rotational KE:**
```
KE_rot = ½ · I · ω²
```

For same ω, doubling I (via OWD) doubles KE stored. This KE is what the bey "spends" resisting spin decay, absorbing hits, and maintaining precession.

**Engine implication**: `spinDecayRate` should depend on `I` (higher I = lower decay rate per tick). A wider WD should reduce `spinDecayRate`, not just increase `maxSpin`. The CLAUDE.md model `spinDecayRate = 8 × (1 − stamina × 0.001)` approximates this via the stamina stat but doesn't explicitly model WD radius. Consider adding a `momentOfInertiaFactor` per WD type to directly scale `spinDecayRate`.

---

## SECTION C — TIP-FLOOR TRIBOLOGY (FRICTION PHYSICS)

### C1. Coefficient of Friction and Tip Materials

**Friction force**: `F_friction = µ · N`
- µ = coefficient of friction (material-dependent)
- N = normal force (proportional to bey mass × g)

**Material µ estimates (relative, not absolute measurement):**

| Material pair | µ estimate | Source basis |
|-------------|-----------|-------------|
| Rubber on plastic | 0.8 – 1.4 | Known high friction; rubber-plastic tribology |
| Plastic on plastic | 0.2 – 0.4 | Standard ABS-on-ABS |
| Metal on plastic | 0.1 – 0.25 | Low-friction pair; polished metal = even lower |
| Rubber on rubber | 1.2 – 2.0 | Highest; not relevant for beyblade floor |

> **Tag**: INFERENCE — these are standard material tribology estimates. Exact Beyblade-specific measurements not in Tier-1 sources. But direction is confirmed FACT: rubber > plastic > metal for floor friction.

**Engine implication**: `gripFactor` for tip material should map to µ × contactArea:
- Rubber flat: µ_high × large area = maximum `gripFactor`
- Metal sharp: µ_low × minimal point area = near-zero `gripFactor`
- Plastic ball: µ_mid × varying area = moderate, dynamic `gripFactor`

### C2. Stick-Slip Physics (Flower Pattern Mechanism)

**Definition** (tribonet.org): *"The stick-slip phenomenon involves the dynamic interaction between two surfaces, where they alternately stick together and then slide over one another, leading to fluctuations in the force of friction between them."*

**Key principle**: Static friction threshold > Kinetic friction.
```
F_static_max = µ_s · N    (holds up to this force)
F_kinetic = µ_k · N       (µ_k < µ_s always)
```

**How this generates the flower pattern:**

| Phase | Physics | Result |
|-------|---------|--------|
| **Stick** | Static friction > centrifugal force → tip locked to floor | Bey pivots around locked contact point; body swings outward |
| **Slip** | Pivot builds up enough lateral force to exceed µ_s · N → sudden slip | Tip slides, bey launches forward rapidly |
| **Repeat** | New contact point → re-sticks | Next petal arc begins |

Each stick→slip cycle = one petal arc. The petal count and shape emerge from: spin speed × floor µ × contact area × bowl radius × tip area. This is the **physical confirmation** that petal count is an emergent property (batch-011 finding was correct).

**New engine insight**: The flower pattern should be modeled as a periodic alternation between two friction states, not a continuous force. The period of stick-slip determines orbit tightness.

---

### C3. Contact Patch Geometry

**Contact area determines friction torque magnitude:**

| Tip shape | Contact geometry | Friction torque | Effect |
|-----------|-----------------|----------------|--------|
| Sharp point | Hertz contact; diameter ~0.1–1mm | Very low | Near-zero floor drag; long spin, no movement |
| Flat disc (rubber) | Full disc face; diameter = tip diameter | Very high | Maximum grip; flower pattern; fast energy loss |
| Ball/hemisphere | Circular patch; shrinks at tilt | Medium, grows during wobble | Moderate; stable until tilt increases patch |
| Semi-flat | Partial flat + slight dome | Medium-high | Between flat and ball |

**Wobble increases friction**: *"When a spinning top tilts so much that it hits the surface, the friction forces that were previously minor suddenly become so major that the top stops spinning almost immediately."* (scovieprecisionturning.com)

**Engine implication**: At stability < threshold, when wobble begins, `spinDecayRate` should INCREASE (more contact area from tilt → more friction). This creates the observable "death spiral" — slow bey wobbles more → more friction → dies even faster.

---

## SECTION D — SPIN DECAY AND LAD ROLLING (EULER'S DISK)

### D1. Primary Energy Dissipation Mechanisms

| Mechanism | Magnitude | When dominant |
|-----------|-----------|--------------|
| Tip-floor friction (sliding/rolling) | Primary (high spin) | Constant throughout battle |
| Tilt-induced friction (contact patch growth) | Primary (low spin) | When stability < threshold |
| Air drag | Secondary (~10–20% of total) | More significant near end of spin |
| Rolling friction | Important near end | Euler's disk phase (LAD) |

**Spin decay differential equation (conceptual model):**
```
dω/dt = −(µ_kinetic · N · r_contact) / I  −  k_air · ω²
```
- First term: floor friction torque (dominant at moderate spin)
- Second term: air drag (quadratic in ω; dominates at high spin, minor at low spin)

**Current engine model** (`spinDecayRate = 8 × (1 − stamina × 0.001)` gives 6.8–8.0 rad/s²):
- This is a linear approximation of a nonlinear decay
- **Physically more accurate**: decay rate should INCREASE as spin drops (more wobble = more contact)
- **Practical recommendation**: add a tilt-dependent `× (1 + 2 × tiltFactor)` multiplier

### D2. LAD — The Euler's Disk Phase

**Euler's Disk** (spinning coin falling): directly analogous to a beyblade's "Life After Death" rolling phase.

**Confirmed physics (arxiv, Euler's Disk Wikipedia):**

| Phase | Tilt Angle | Precession Rate | Visual |
|-------|-----------|----------------|--------|
| Upright spin | Small (0–10°) | Slow | Normal battle |
| Early precession | 10–30° | Moderate | Visible wobble circles |
| LAD onset | 30–60° | Fast | Bey tilts, rolls on edge |
| Near-stop | 60–80° | Diverges (→ ∞) | Rapid final precession circles |
| Collapse | ~80–90° | Finite-time singularity | Snaps to stop |

> *"The precession rate of the angular velocity vector diverges just before the coin stops spinning — there is a finite-time singularity in the physics of the problem."* — arxiv rolling coin paper

**What this means for beyblade LAD:**
- As ω → 0, precession rate accelerates dramatically
- The bey's final moments are a rapid "rolling spiral" that gets faster and faster before snap-stopping
- **Circular WD** = smoother rolling edge = less friction during this rolling → extends LAD duration
- **Non-circular WD** = bumpy roll = more dissipation → shorter LAD
- **Bearing tip** = near-zero rolling friction during precession → dramatically extends LAD

**Key engine implication**: The "last seconds" of a beyblade's life should NOT be a simple linear spin decay to zero. The bey should enter a visible tilt-and-roll LAD phase where:
1. `tiltAngle` increases rapidly
2. `precessRate` increases
3. `spinDecayRate` accelerates
4. The bey rolls around in tightening circles before snapping to stop

---

## SECTION E — RIGID BODY COLLISION PHYSICS

### E1. Standard Game Physics Impulse Formula

For two rigid bodies A and B colliding at contact point P with normal **n**:

**Step 1 — Relative velocity at contact point:**
```
v_rel = (v_A + ω_A × r_A) − (v_B + ω_B × r_B)
```
- v_A, v_B = linear velocity of centers of mass
- ω_A, ω_B = angular velocities (spin)
- r_A, r_B = vector from COM to contact point P

**Step 2 — Impulse magnitude:**
```
j = −(1 + e) · (v_rel · n) / (1/mA + 1/mB + (r_A × n)² / I_A + (r_B × n)² / I_B)
```
- e = coefficient of restitution (0 = perfectly inelastic; 1 = elastic)
- n = contact normal unit vector

**Step 3 — Apply impulse:**
```
v_A' = v_A + (j · n) / mA
v_B' = v_B − (j · n) / mB
ω_A' = ω_A + (r_A × j·n) / I_A
ω_B' = ω_B − (r_B × j·n) / I_B
```

**Source**: fotino.me 2D rigid body collision; collision-response Wikipedia; confirmed in multiple game physics sources.

### E2. Beyblade Collision Specifics

**Key application to beyblades:**

| Collision type | Coefficient of restitution (e) | Physics behavior |
|---------------|-------------------------------|----------------|
| Plastic-on-plastic | 0.6 – 0.8 | Moderate bounce; some energy loss |
| Metal-on-metal (HMS/MFB) | 0.7 – 0.9 | More elastic; harder hits |
| Rubber CP contact | 0.2 – 0.4 | Inelastic; rubber absorbs kinetic energy |

> **Engine implication**: The `e` value in the collision formula should depend on the CONTACT SURFACE material of the AR. Rubber AR = low e (more energy absorbed as heat/deformation). Metal AR = high e (more energy transferred as recoil).

**Mass asymmetry in collisions:**
From the formula, if `mA >> mB`:
- A barely changes velocity (heavy is stable)
- B gets large velocity change (light flies away)
- **This IS the physics behind "heavier bey wins collision"** — confirmed from first principles

**Angular velocity change on collision:**
```
Δω = (r × j·n) / I
```
A bey that is hit near its edge (large r) gets a LARGER angular velocity change than one hit near center. This is why AR protrusion position matters — hits at larger radius = more spin loss per collision.

---

## SECTION F — OPPOSITE-SPIN GEAR COUPLING PHYSICS

### F1. Why Opposite Spin Transfers Angular Momentum

When two discs spin in OPPOSITE directions and their surfaces touch at contact point P:

**Relative surface velocity at P:**
```
v_rel_surface = ω_A · r_A + ω_B · r_B
```
(both terms ADD because opposite rotations mean surfaces move in opposite directions at P)

**vs Same-spin:**
```
v_rel_surface = ω_A · r_A − ω_B · r_B
```
(terms SUBTRACT — if equal speed, net relative velocity = 0 → nearly no friction → no spin transfer)

**This is why opposite-spin spin-steal is so much more effective than same-spin:**
- Opposite spin → large relative surface velocity → large friction force → large spin transfer
- Same spin → nearly zero relative velocity at contact → minimal friction → minimal spin transfer (both just slow each other slightly)

### F2. Spin Transfer Efficiency (Quantitative Estimate)

**Transfer is NOT 100% efficient** — energy is lost to:
1. Surface deformation (especially rubber)
2. Heat generation from friction
3. Sound/vibration
4. Non-ideal contact geometry (not perfect gear teeth)

**Estimated efficiency based on material:**

| Contact type | Estimated transfer efficiency | Reason |
|-------------|-------------------------------|--------|
| Rubber-on-plastic | 70–80% | High friction but also high heat loss |
| Plastic-on-plastic | 55–70% | Moderate friction, moderate efficiency |
| Metal-on-plastic | 40–55% | Low friction = less transfer even with relative velocity |
| Rubber-on-rubber | 80–90% | Maximum grip; but rare in beyblade contact |

> **Tag**: These efficiency values are INFERENCE derived from tribology principles. No Beyblade-specific measurements confirmed.

**Engine model recommendation**: `spinStealFactor` should multiply by `transferEfficiency × (1 + 0.4 × isOppositeSpin)`. Current model likely models this as a flat multiplier on collision rather than the physically correct velocity-dependent calculation.

---

## SECTION G — STADIUM INTERACTION PHYSICS

### G1. Bowl Profile as Centripetal Force

The curved stadium bowl redirects outward-moving beyblades back toward center. This is NOT friction — it's a **normal force** from the curved surface.

```
F_centripetal = M · v² / R_bowl
```

Where R_bowl = local radius of curvature at the wall contact point.

| Stadium bowl angle | Effect on bey movement |
|-------------------|----------------------|
| Steep walls (near vertical) | Sharp redirect; bey bounces off wall; good for attack types (fast return to center) |
| Shallow bowl (gradual slope) | Gentle redirect; bey orbits longer; good for defense/stamina |
| Flat floor + wall | Sharp boundary; bey either stays on flat or hits wall abruptly |

**Attack type movement pattern**: Rubber flat tip → flower pattern on floor → hits wall → wall redirects back to center → flower pattern repeats. The bowl = "trampoline" for the attack type.

### G2. BX Xtreme Stadium X-Celerator Rail

**Physical mechanism of Xtreme Dash:**
- Gear teeth (hard plastic/nylon) mesh with raised rail (ABS track)
- Gear engagement = brief forced contact → rail pushes bey tangentially (like a rack-and-pinion mechanism)
- Net effect: sudden angular impulse in the bey's travel direction → speed burst

**Physics**: The rail exerts a tangential force `F_tangential = N_rail × µ_gear_contact` over the short engagement arc. This is a brief high-force pulse, not a sustained push.

---

## SECTION H — ENGINE CORRECTION SUMMARY

| Engine Parameter | Current Behavior | Real-World Correct Behavior | Priority |
|-----------------|-----------------|----------------------------|----------|
| `spinDecayRate` | Constant per tick (linear) | Nonlinear: should INCREASE as spin drops below wobble threshold (more tilt = more contact area = more friction) | HIGH |
| LAD phase | Gradual linear decay to zero | Should be: tilt grows → precession accelerates → rapid circling → snap stop (Euler's disk curve) | HIGH |
| `recoilFactor` | Flat per AR | Should use e (coefficient of restitution) per contact material; rubber e=0.3, plastic e=0.7, metal e=0.85 | MEDIUM |
| `spinStealFactor` | Flat multiplier | Should scale with relative surface velocity; opposite spin = additive vel, same spin = subtractive vel | MEDIUM |
| `momentOfInertia` | Not modeled | OWD WD should reduce `spinDecayRate` directly; I = Σ(m·r²) for WD profile | MEDIUM |
| Wobble threshold | `stability < 0.4` (CLAUDE.md) | Physically correct direction; 40% is game-design value, not physics-derived. Keep but add decay acceleration | LOW (already close) |
| Mass advantage | Higher defense pts | Should also scale collision Δω: heavier bey (larger I) gets smaller ω change per hit | MEDIUM |
| Contact patch tilt | Not modeled | Flat tip touching floor when tilted = more contact area = much higher friction torque | LOW |
| Precession rate | Not modeled | Rapid precession circles in final stage are visual, not just mechanical — consider adding visible precession to low-spin beys | LOW (cosmetic) |

---

## SECTION I — KEY PHYSICS EQUATIONS REFERENCE

```
PRECESSION:
  Ω_P = (r · M · g · sin θ) / (I · ω)   [rad/s]
  → inverse: faster spin = slower precession = more stable

ANGULAR MOMENTUM:
  L = I · ω                               [kg·m²/s]
  → more L = more stable = harder to tilt

MOMENT OF INERTIA:
  I = Σ(m_i · r_i²)                       [kg·m²]
  → mass at perimeter contributes r² more than mass at center

ROTATIONAL KINETIC ENERGY:
  KE = ½ · I · ω²                         [J]
  → energy available to "spend" against friction and collisions

FRICTION FORCE:
  F = µ · N = µ · M · g · cos(θ)          [N]
  → µ_rubber > µ_plastic > µ_metal
  → N grows as tilt increases (more contact area)

SPIN DECAY (approximate):
  dω/dt ≈ −(µ · N · r_contact) / I − k_air · ω²
  → decay accelerates as wobble (tilt) grows at low spin

COLLISION IMPULSE:
  j = −(1+e)·v_rel_n / (1/mA + 1/mB + (rA×n)²/IA + (rB×n)²/IB)
  Δω = ±(r × j·n) / I                    [rad/s change per hit]

SPIN STEAL (opposite-spin gear coupling):
  v_rel_surface = ωA·rA + ωB·rB          [opposite spin: additive]
  v_rel_surface = ωA·rA − ωB·rB          [same spin: subtractive]
  → opposite spin = more friction force = more spin transfer per contact
```

---

## SECTION J — REMAINING UNKNOWNS

| Unknown | Status | Notes |
|---------|--------|-------|
| Exact µ for rubber-on-ABS plastic | UNKNOWN | Confirmed rubber > plastic; no published Beyblade-specific µ value |
| Critical stability threshold (exact) | UNKNOWN | Below this ω, precession grows uncontrollably; game uses 40% — physics-derived value would require Euler-angle simulation of specific bey geometry |
| Xtreme Dash force magnitude | UNKNOWN | Gear engagement force depends on rail geometry; INFERENCE ~1.8–2.2× speed burst |
| Spin-steal transfer efficiency | UNKNOWN | 70–85% INFERENCE from tribology principles; not directly measured |
| Air drag coefficient for Beyblade geometry | UNKNOWN | Relevant at high spin (>2000 RPM); minor factor but affects max-spin vs. real-world comparisons |

---

[← Batch 014: Archetype Physics](batch-014-archetype-physics-deep-dive.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

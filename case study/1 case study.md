# Physics Chain: From Free Body → Gyro → Beyblade Tick

**Part 2 →** [2 case study.md](2%20case%20study.md) (Cases 74–123)

---

## Context

This plan traces the physics of rigid-body impact, gyroscopic response, contact-point geometry, tilt, and per-tick integration — culminating in the exact simulation model for a Beyblade. Each case builds on the previous one.

**NOTE:** Values in Cases 1–6 of this file are illustrative model values. For real analyses, use the Authoritative Physics Constants below.

---

## Authoritative Physics Constants (Cross-Verified CS1–CS10)

All case studies share these confirmed values. When writing new cases or adding parts, use these values exclusively. Do NOT substitute values from research batch files, linka files, or other pre-case-study sources.

### Tip Friction (μ_k on ABS stadium floor)

| Tip Material | μ_k | Source | Tag |
|-------------|-----|--------|-----|
| Hard ABS (flat, sharp, semi-flat, hole-flat, defense, ball) | **0.17** | CS10 Case 551 | [CONFIRMED] |
| Rubber (RF, RB, rubber flat) | **0.50** | CS10 Case 545 | [CONFIRMED] |
| Metal (MS, metal sharp, metal change) | **0.12** | CS3 Case 119 | [CONFIRMED] |
| Plastic (gen-1 old plastic) | **0.10** | CS1 | [CONFIRMED] |
| B:D ball bearing | **0.05** | CS10 Case 551 | [CONFIRMED] |
| EWD / CEW plastic sleeve bearing | **0.12** | CS1 line 2298 | [CONFIRMED] |
| ABS on ABS (material-to-material, not tip) | **0.15** | CS10 style rules | [CONFIRMED] |

### Other Confirmed Constants

| Parameter | Value | Source | Tag |
|-----------|-------|--------|-----|
| EG spring constant | k = 1500 N/m | CS10 Case 555 | [CONFIRMED] |
| EG spring energy | E = 48 mJ | CS10 Case 556 | [CONFIRMED] |
| F:D mode-switch threshold | ω = 94.3 rad/s | CS10 Case 557 | [CONFIRMED] |
| Magnacore chip force at 3 mm | F = 0.40 N | CS10 Case 554 | [ESTIMATED — pull-test] |
| Rubber restitution (COR) | e = 0.25 | CS10 | [CONFIRMED] |
| ABS restitution (COR) | e ≈ 0.65–0.70 | CS10 | [CONFIRMED] |
| Metal restitution (COR) | e ≈ 0.80 | CS10 | [CONFIRMED] |

### Value Tagging Convention

Every numeric value in new cases must carry one of these tags:

- `[CONFIRMED]` — directly measured or confirmed by cross-verified case study physics
- `[FACT]` — sourced from wiki spec, confirmed part weight, or official product data
- `[INFERRED]` — derived from formula using confirmed inputs; show the derivation
- `[ESTIMATED]` — image-based measurement or approximation; no primary source
- `[ILLUSTRATIVE]` — model value, not measured; use confirmed data for real analyses
- `[CUSTOM BUILD]` — aftermarket or non-standard combo, not a factory part

### Common Errors to Avoid

- CS1 used μ = 0.8 (sharp) and 0.5 (flat) — these were illustrative model values, NOT measured friction. The real value is 0.17 for all hard ABS tips.
- CS1 table values 0.85, 0.70, 0.30 for contact point materials are restitution coefficients (e), NOT kinetic friction (μ). Do not conflate.
- B:D bearing μ = 0.005 (CS1) is theoretical ideal; real B:D = 0.05 (CS10 confirmed).
- Rubber μ = 0.85 or 0.9 (CS1/CS9) were illustrative; real rubber μ = 0.50 (CS10 confirmed).
- Do NOT hardcode petal counts for orbital tips — petal count is emergent from RPM × bowl depth × grip.
- AR contact height ≠ AR centroid height. Contact faces project down from the centroid. Gen 1 AR contact: 12–24 mm; centroid: 28–36 mm.
- frictionMult in engine = μ_material / μ_ABS = μ_material / 0.17

---

> **Note:** Values in Cases 1-6 are illustrative model values, not measured physics. See the Authoritative Physics Constants header for confirmed values.

## Case 1 — Hit to a Freely Suspended Body (at rest, in free space)

A body floating in space with no gravity, no constraints. Mass m, moment of inertia I.

```
              F (impulse, applied AT center of mass)
              │
              ▼
         ┌─────────┐
         │    ●    │   ── no rotation, pure translation
         └─────────┘
              │
              ▼
         velocity Δv = F·Δt / m     (Newton 2nd)
         angular Δω = 0             (no lever arm)
```

```
              F (applied OFF-CENTER, at radius r)
              │
              ▼  ← r →
         ┌─────────┐
         │         ●   ← point of application
         └─────────┘
         ↓           ↻
    linear Δv      angular Δω
    = F·Δt / m     = r × F·Δt / I   (torque = r × F)
```

**Rules:**
- Force through CoM → pure translation, no spin.
- Force off-CoM → translation + rotation. Torque τ = r × F.
- Impulse J = F·Δt. Split: J_linear → mv, J_angular → Iω.

---

## Case 2 — Hit to a Body Already in Motion (falling / rising / diving / jumping)

The body has existing velocity **v₀** before the hit.

```
                FALLING                      RISING
                  ▼ v₀                         ▲ v₀
             ┌─────────┐                  ┌─────────┐
     F ──►   │    ●    │      F ──►       │    ●    │
             └─────────┘                  └─────────┘
                  ▼                            ▲
          v_new = v₀ + ΔvF             v_new = v₀ + ΔvF
          (adds rightward)             (adds rightward, fight upward)
```

```
   Velocity vector diagram (falling + lateral hit):

   v₀ (down)         F impulse (right)        v_new
      │                    →                 ╲
      │               +                  =    ╲   (diagonal down-right)
      ▼                                        ▼
```

**Rules:**
- Velocities add as vectors. Pre-existing momentum is NOT zeroed.
- Kinetic energy: KE_new = ½m|v_new|²
- If body is DIVING (high downward v₀) a lateral hit barely deflects it — momentum magnitude dominates.
- If body is JUMPING (upward v₀, decelerating under gravity) a downward hit accelerates the deceleration.

---

## Case 3 — The Body Becomes a Gyro (spinning)

A gyro has angular momentum **L = I·ω** along its spin axis. This single property changes everything about how torques act on it.

```
         Gyro at rest (no spin)            Gyro spinning fast
                │ spin axis                      │ L = I·ω  (up)
                │                               ↑│
         ┌──────┼──────┐                  ┌──────┼──────┐
         │      ●      │                  │      ●      │ ←── ω (CCW viewed from top)
         └─────────────┘                  └─────────────┘
                │                                │
         Apply torque τ:                  Apply SAME torque τ:

         ──► tips over                    ──► PRECESSES (rotates around vertical)
             (falls in direction of τ)        perpendicular to τ
```

**Gyroscopic precession equation:**
```
   τ = dL/dt = Ω_precession × L

   Ω_p = τ / (I · ω)        (precession rate, rad/s)

   Direction: τ ⊥ L  →  Ω_p ⊥ both
```

```
   TOP VIEW of precessing gyro:

        ▲ (toward screen = spin axis, pointing up)
        │
   ─────●─────   spin axis
        │
        │  torque τ applied to the RIGHT of the axis
        │
        ●  ← CoM traces a CIRCLE (precession)
       / \
      /   \
   viewed from top:  CoM orbits clockwise if L is up and τ pushes right
```

**Key insight:** High spin = slow precession (stable). Low spin = fast precession = wobble.

---

## Case 4 — Gyro Has Contact Points, Gets Hit On One

Contact points (CPs) are raised protrusions at radius r_cp from the spin axis. When struck:

```
   Cross-section of gyro (attack ring):

           spin axis
               │
        ┌──────┼──────┐
        │  ╔═══╪═══╗  │   ← attack ring at radius r_cp from axis
        │  ║   │   ║  │
        │  ╚═══╪═══╝  │
        └──────┼──────┘
               │

   CP hit geometry (top view):

         r_cp
       ◄──────►
   axis ●──────[CP]◄── F_impact (tangential, from opponent)
                 │
                 torque τ = r_cp × F_impact
                 direction: perpendicular to both r and F
```

```
   What happens per CP shape:

   FLAT CP (attack ring face):         ANGLED CP (upper type):
   F                                   F
   ──► [■■■■]                         ──► [/////]
        restitution pushes             deflects F upward component
        opponent laterally             + inward force on self

   BLADE CP (thin protruding edge):    RUBBER CP (absorbs):
   F                                   F
   ──► [|]                            ──► [≈≈≈≈]
        high torque (small contact)    dampens impulse, less rebound
        max rotation transfer          sticky grip → spins opponent
```

**Per-hit calculation:**
```
   J = impulse magnitude = μ · m_rel · v_rel_normal  (restitution coefficient μ)

   Δv_self   = -J / m_self                    (linear, along normal)
   Δω_self   = (r_cp × J_vec) / I_self        (angular, torque)

   On gyro:  Δω → τ → PRECESSION, not tumble
             spin magnitude changes if J has component along spin axis
```

---

## Case 5 — Gyro + Contact Points + TILT

The spin axis is now tilted at angle θ from vertical.

```
   Vertical reference            Tilted gyro (θ from vertical)

        │ vertical                     /  ← spin axis (tilted θ)
        │                            /
        ▲ L_vertical               /  L  (angular momentum)
        │                        /
        │                      ●   ← CoM
                               │
                    gravity acts here (straight down)
```

```
   Force decomposition on tilted gyro:

   Gravity g (downward):
   ├── Along spin axis:   g·cos(θ)   → no torque, axial load
   └── Perpendicular:     g·sin(θ)   → TORQUE → PRECESSION (wobble circle)

   The perpendicular gravity torque causes the spin axis to precess:
   Ω_wobble = m·g·r_cog·sin(θ) / (I·ω)

   At θ=0 (upright): sin(0)=0 → no wobble
   At θ=30°:         sin(30°)=0.5 → moderate wobble
   At θ=90°:         sin(90°)=1.0 → maximum wobble rate
```

```
   What a contact-point hit does to a TILTED gyro:

   Incoming F from opponent (horizontal):

        /  ← tilted spin axis
       / 
      ●──────────────F  (impact at CP, radius r_cp from axis)
     /
    /

   F has components:
   ├── Perpendicular to spin axis: → torque → PRECESSION (axis swings)
   └── Along spin axis:           → compresses/extends spin axis → nutation kick

   Result: axis swings to a NEW tilt angle and direction
           (the tilt CHANGES with each hit)
```

```
   Tilt-modified CP hit (3-axis view):

         z (vertical)
         │     / spin axis at angle θ
         │    /
         │   /
         │  ● ────── r_cp ──── [CP] ◄── F (impact from x-direction)
         │ /
         │/_____________________ x (arena floor)

   Torque τ = r_cp_vec × F_vec
   Component of τ along L → changes |ω| (spin speed)
   Component of τ perpendicular to L → precession (axis tilts differently)
```

---

## Case 6 — Per-Tick Integration (what happens every frame)

At 60 Hz, each tick is Δt = 1/60 s ≈ 16.7 ms.

```
   ┌─────────────────────────────────────────────────────────────┐
   │                     TICK START                              │
   │                  (state from t-1)                           │
   └────────────────────────┬────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │ 1. FORCES      │  gravity, arena-tilt lateral force,
                    │    ACCUMULATE  │  spin-zone orbit/spin boost,
                    │                │  gravity-well attraction,
                    │                │  gyroscopic drag
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │ 2. COLLISION   │  broad-phase (AABB),
                    │    DETECTION   │  narrow-phase (circle-circle),
                    │                │  CP contact geometry check
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │ 3. IMPULSE     │  compute J per collision pair,
                    │    RESOLUTION  │  apply Δv_linear + Δω (angular),
                    │                │  CP shape modifies normal/friction,
                    │                │  tilt angle updates from torque
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │ 4. INTEGRATE   │  position += velocity * Δt
                    │    POSITION    │  velocity += accel * Δt
                    │                │  (semi-implicit Euler)
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │ 5. SPIN DECAY  │  ω -= spinDecayRate * Δt
                    │                │  spinDecayRate = 8*(1-stamina*0.001)
                    │                │  tip-type modifies rate (rubber slower)
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │ 6. STABILITY   │  stability = spin / maxSpin
                    │    CHECK       │  if stability < 0.4:
                    │                │    applyWobbleForce(PRNG noise)
                    │                │    (nutation simulation)
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │ 7. ARENA       │  wall reflection (normal restitution),
                    │    BOUNDS      │  bowl curvature redirect,
                    │                │  ring-out check (beyond arenaRadius)
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │ 8. STATE SYNC  │  Colyseus schema write → client
                    │                │  (position, spin, tiltAngle, etc.)
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │   TICK END     │
                    │  (t becomes    │
                    │   t+1)         │
                    └────────────────┘
```

---

## Full Scenario — Beyblade vs Beyblade

Now combine all cases into the actual game context.

```
   ┌─────────────────────────────────────────────────────────────┐
   │              BEYBLADE PHYSICS SYSTEM                        │
   │                                                             │
   │   Beyblade = Gyro + Contact Points + Tilt + Spin Decay      │
   └─────────────────────────────────────────────────────────────┘
```

### A. Launch Phase (initial conditions)

```
   Player sets:
   ├── launchPower  (0–150%) → initial ω = maxSpin × (power/100)
   ├── launchTilt   (−45°→+45°) → initial beyTiltAngle
   └── launchPosition (0–1) → spawn radius offset from center

   High power + zero tilt = maximum gyroscopic stability
   High tilt at launch = precession wobble starts immediately
```

### B. Mid-Match: Two Beyblades Approaching

```
   Top-down arena view:

         ┌───────────────────────────────┐
         │                               │
         │     A ──►          ◄── B      │
         │    (CCW)           (CCW)      │
         │   spin↑            spin↑     │
         │                               │
         └───────────────────────────────┘

   Both are gyros spinning CCW viewed from above.
   Their angular momenta L_A and L_B both point UP (right-hand rule).
```

### C. First Contact — CP Geometry Hit

```
   Moment of contact (zoomed in):

   A's attack ring        gap closes to 0
   ──────►[■■■CP_A]|[CP_B■■■]◄──────  B

   Normal n̂: points from B center → A center
   Relative velocity v_rel = v_A - v_B along n̂
   
   If v_rel · n̂ < 0: approaching → compute impulse J
   J = -(1+μ)·v_rel·n̂ / (1/m_A + 1/m_B + r_A²/I_A + r_B²/I_B)
            └── restitution μ from CP attack type
```

```
   CP type effect table:
   ┌──────────┬───────┬──────────────┬──────────────────────────────┐
   │ CP Type  │  μ    │ friction     │ notable effect               │
   ├──────────┼───────┼──────────────┼──────────────────────────────┤
   │ smash    │ 0.85  │ low          │ high linear rebound          │
   │ upper    │ 0.70  │ low          │ +upward force component      │
   │ rubber   │ 0.30  │ HIGH         │ spin-steal via friction      │  ← NOTE: 0.30 is restitution (e), NOT μ. Rubber μ_k = 0.50 [CS10 CONFIRMED], e = 0.25 (low bounce/energy absorber)
   │ absorb   │ 0.20  │ medium       │ low rebound, stabilises self │
   │ burst    │ 0.95  │ low          │ spike burst damage           │
   │ blade    │ 0.75  │ medium       │ high torque (thin r_cp)      │
   └──────────┴───────┴──────────────┴──────────────────────────────┘
```

### D. What Happens to Gyro A After the Hit

```
   Before hit:                After hit:

   spin axis                  spin axis shifted (precessed)
      │ up                        /  (tilted by Δθ from impulse torque)
      │                          /
   ───●───  (high ω)          ──●──   (ω reduced by energy transfer)
      │                        /
      │                       /

   Δv_linear = J/m  (pushed back from collision normal)
   Δω        = (r_cp × J_vec) / I  (angular impulse)
   Δtilt     = torque component perpendicular to L, causes precession
```

### E. Tilt Progression Through the Match

```
   Spin% │ Tilt behavior
   ──────┼──────────────────────────────────────────────────────
   100%  │ Upright, nearly zero wobble. L dominates all torques.
    80%  │ Minor precession from gravity if tilted at launch.
    60%  │ Wobble noticeable. Each hit shifts tilt more.
    40%  │ THRESHOLD — nutation noise force applied each tick.
    20%  │ Wild wobble. Large radius circle traced by spin axis.
     5%  │ Toppling. Effective tilt → 90°, ring-out or burst likely.
     0%  │ Stopped. Falls. Ring-out or burst declared.

   Tilt angle over time:
   θ ┤                              ╭────╮
     │                         ╭───╯    ╰──╮
     │              ╭─────────╯             ╰──╮  (wobble)
     │  ────────────╯                           ╰───...
     └──────────────────────────────────────────► time
        launch     first hit   40% spin     topple
```

### F. Arena Tilt Interaction

```
   Arena tilted at angle α (from ArenaConfig.tiltAngle):

   Force per tick = sin(α) × 0.04 × mass  (in tiltDirection vector)

   Effect on gyro:
   ├── Adds persistent lateral drift → beyblade drifts downhill
   ├── If autoTilt: tiltDirection rotates → drift direction spirals
   └── Interacts with own tilt: if spinning into the slope, spin-zone
       effect amplified; if fighting the slope, faster spin decay

   Wall-ride (α=90°): gravity-equivalent lateral force, beyblades
   orbit the arena wall instead of the center.
```

### G. Per-Tick State Variables (what the server actually tracks)

```
   Beyblade schema (relevant physics fields):

   ┌─────────────────┬──────────────────────────────────────────┐
   │ Field           │ Role in tick                             │
   ├─────────────────┼──────────────────────────────────────────┤
   │ x, y            │ position (pixels)                        │
   │ vx, vy          │ linear velocity (px/s)                   │
   │ spin            │ angular speed (rpm-equivalent)           │
   │ maxSpin         │ stamina-derived ceiling                  │
   │ beyTiltAngle    │ tilt of spin axis (degrees from vertical)│
   │ spinDecayRate   │ ω loss per second                        │
   │ damageMultiplier│ scales outgoing impulse                  │
   │ damageReduction │ scales incoming impulse                  │
   │ launchTilt      │ initial tilt at spawn                    │
   │ launchPower     │ initial spin fraction                    │
   └─────────────────┴──────────────────────────────────────────┘
```

### H. Tick-Level Pseudocode for One Beyblade

```typescript
function tickBeyblade(bey: Beyblade, dt: number, arena: ArenaConfig) {
  // Step 1: arena tilt lateral force
  const tiltForce = Math.sin(arena.tiltAngle) * 0.04 * bey.mass;
  bey.vx += tiltForce * Math.cos(arena.tiltDirection) * dt;
  bey.vy += tiltForce * Math.sin(arena.tiltDirection) * dt;

  // Step 2: spin zone (orbit or spin boost)
  applySpinZones(bey, arena.spinZones, dt);

  // Step 3: gravity well attraction
  applyGravityWells(bey, arena.gravityWells, dt);

  // Step 4: position integrate
  bey.x += bey.vx * dt;
  bey.y += bey.vy * dt;

  // Step 5: spin decay (tip-type modifies rate)
  bey.spin = Math.max(0, bey.spin - bey.spinDecayRate * dt);

  // Step 6: gyroscopic stability / nutation
  const stability = bey.spin / bey.maxSpin;
  if (stability < 0.4) {
    const wobble = (0.4 - stability) * 25;        // grows as spin falls
    bey.vx += (prng() - 0.5) * wobble * dt;      // deterministic noise
    bey.vy += (prng() - 0.5) * wobble * dt;
    bey.beyTiltAngle = Math.min(90, bey.beyTiltAngle + wobble * dt);
  }

  // Step 7: wall / ring-out check
  const dist = Math.hypot(bey.x - arena.cx, bey.y - arena.cy);
  if (dist > arena.arenaPixelRadius) {
    declareRingOut(bey);
  } else if (dist > arena.arenaPixelRadius - WALL_ZONE) {
    reflectOffWall(bey, arena);                   // normal restitution
  }
}

function resolveCollision(a: Beyblade, b: Beyblade, cpA: CP, cpB: CP) {
  const n = normalize(b.pos - a.pos);              // collision normal
  const vRel = dot(a.vel - b.vel, n);
  if (vRel >= 0) return;                           // separating, skip

  const mu = (cpA.restitution + cpB.restitution) / 2;
  const J = -(1 + mu) * vRel
          / (1/a.mass + 1/b.mass + sq(a.r_cp)/a.I + sq(b.r_cp)/b.I);

  a.vel = a.vel - (J / a.mass) * n * a.damageReduction;
  b.vel = b.vel + (J / b.mass) * n * b.damageReduction;

  // angular (gyroscopic) — simplified: impulse torque adjusts tilt
  const torqueA = a.r_cp * J;                     // magnitude
  const torqueB = b.r_cp * J;
  a.beyTiltAngle += (torqueA / (a.I * a.spin)) * RAD2DEG;  // precession
  b.beyTiltAngle += (torqueB / (b.I * b.spin)) * RAD2DEG;

  // spin energy exchange (rubber CP = high friction → spin steal)
  const spinTransfer = J * cpA.friction * 0.01;
  a.spin -= spinTransfer;
  b.spin += spinTransfer * 0.5;                   // partial recovery

  // damage accounting
  const dmg = J * a.damageMultiplier * b.damageReduction;
  recordDamage(a.id, b.id, dmg);
}
```

---

## Case 7 — The Tip Hit + Gyroscopic Counter-Strike (2-Tick Cascade)

This is the most important Beyblade-specific sequence. A slightly tilted beyblade, hit at the **tip** (its lowest point), produces a **counter-strike from its top** in the very next tick.

### Geometry Setup

```
   Side view — B is slightly tilted, A attacks from the right at tip level:

            B_top (upper attack ring)
               ╲                           ← B's spin axis (tilted left)
                ╲  L (angular momentum, pointing up-left)
                 ●  ← B's CoM
                  ╲
                   ╲
                    [tip] ◄──── F (A hits rightward at floor level)

   A is to the right, at floor level. Its CP contacts B's tip.
```

### Tick 1 — The Hit

```
   Torque calculation:

   r_tip = vector from B's CoM → B's tip
         = DOWN + slightly LEFT (because B is tilted left)
         ≈ (−small, −h_com)  in (x, y)

   F = rightward = (+F, 0)

   τ = r_tip × F
     = (−small, −h_com, 0) × (+F, 0, 0)
     = (0, 0, −small·0 − (−h_com)·F)
     = (0, 0, +h_com·F)         ← points OUT OF SCREEN (toward viewer, i.e. SOUTH/toward A)

   Gyro rule: dL/dt = τ
   L currently points UP-LEFT.
   τ points TOWARD A (south).
   ∴  L rotates toward south → B's TOP swings TOWARD A.
```

```
   After Tick 1 (exaggerated for clarity):

           B_top ──────────────────►  (swinging RIGHT, toward A)
              ╲      ← new axis
               ╲
                ●
                 ╲
                  [tip] (still at floor, barely moved)

   A is still RIGHT HERE. One tick = 16.7 ms. A has barely moved.
```

### Tick 2 — The Counter-Strike

```
   B's upper attack ring is now sweeping rightward at high tangential velocity:

   v_top = ω × r_top           (tip speed of the upper ring)

   For a fast-spinning B (ω = maxSpin, r_top = ~40px):
   v_top can be 3–5× higher than B's linear velocity!

   ┌───────────────────────────────────────────────────────────────┐
   │  TICK 1:  A hits B at the TIP (low)                          │
   │            → impulse pushes A left a little                   │
   │            → B's axis tilts via precession                    │
   │            → B's TOP accelerates toward A                     │
   │                                                               │
   │  TICK 2:  B's upper CP contacts A's body (MID or HIGH)       │
   │            → SECOND collision, much higher lever arm          │
   │            → A gets struck with v_top (rotational velocity)   │
   │            → Upper-type CP: normal has an UPWARD component    │
   │            → A gets LIFTED + pushed outward                   │
   │            → A's own tilt worsens                             │
   └───────────────────────────────────────────────────────────────┘
```

### Why the Counter Is Stronger Than the Original Hit

```
   Contact point velocity comparison:

   A attacking B's tip:
   ├── A's linear velocity = v_A (maybe 200 px/s)
   └── A's CP tangential  = ω_A × r_cp_A  (attack ring radius)

   B's upper ring counter-striking A:
   ├── B's top tangential = ω_B × r_top
   │     r_top ≈ r_com_to_top  (FULL HEIGHT of bey, ~60px)
   │     vs r_cp_A ≈ r_attack_ring (~30px, just the ring radius)
   └── Result: B's top velocity can be 2× A's attacking CP velocity
               even if both spin at same ω
```

```
   Energy diagram:

   Tick 1 impulse (A→B at tip):          ████░░░░░░  (moderate J)
   Tick 2 counter (B top→A):             ████████░░  (higher J, bigger r_top)

   A receives a LARGER impulse in Tick 2 than it delivered in Tick 1.
   This is the gyroscopic counter-strike amplification.
```

### The Full 2-Tick Cascade

```
   Time →    Tick 1                    Tick 2                    Tick 3+

   B axis:   [slight tilt left]   →   [top swings right]    →   [precesses, may stabilise]
   A pos:    [just hit tip]        →   [B top hits A body]   →   [A pushed outward + lifted]
   B spin:   [loses energy]        →   [recovers slightly]   →   [normal decay resumes]
                                        (upper CP friction
                                         can steal A spin)
   A tilt:   [unchanged]           →   [tilted by upper hit] →   [wobble cascade if >40%]
```

### Implication for Beyblade Types

```
   ┌──────────────┬──────────────────────────────────────────────────┐
   │ Beyblade type│ Tip-hit counter-strike behavior                  │
   ├──────────────┼──────────────────────────────────────────────────┤
   │ Attack type  │ High ω, large r_top → devastating counter        │
   │ (upper ring) │ Upper CPs are ABOVE the equator → max lift force │
   ├──────────────┼──────────────────────────────────────────────────┤
   │ Defense type │ Wide, heavy → slow precession (I is large)       │
   │              │ Tick 2 counter arrives late or is dampened       │
   ├──────────────┼──────────────────────────────────────────────────┤
   │ Stamina type │ Thin, rubber tip → tip hit torque is tiny        │
   │              │ r_tip ≈ 0 (tip is ON spin axis) → minimal τ     │
   │              │ Counter almost nonexistent                        │
   └──────────────┴──────────────────────────────────────────────────┘
```

### Simulation Rule: When to Fire Tick 2 Counter

```typescript
// After resolveCollision() in BattleRoom tick:
if (hitTarget === 'tip' && b.beyTiltAngle > 2) {
  // schedule upper-ring counter in next tick
  b._pendingUpperCounter = {
    targetId: a.id,
    velocity: b.spin * b.upperRingRadius,   // tangential speed of top
    normalY: -0.3,                           // upward component (upper type)
    delay: 1,                                // ticks until contact
  };
}

// Next tick — apply the counter:
if (b._pendingUpperCounter && --b._pendingUpperCounter.delay === 0) {
  const c = b._pendingUpperCounter;
  const target = beyblades.get(c.targetId);
  if (target && withinRange(b, target, b.upperRingRadius + target.radius)) {
    applyUpperStrike(b, target, c.velocity, c.normalY);
  }
  b._pendingUpperCounter = null;
}
```

---

## Summary Chain

```
   FREE BODY HIT
        │  linear impulse Δv = J/m
        │  angular impulse Δω = r×J/I
        ▼
   BODY IN MOTION + HIT
        │  vector addition: v_new = v_old + Δv
        │  momentum preserved, direction changes
        ▼
   GYRO + HIT  (L = I·ω)
        │  torque → PRECESSION, not tumble
        │  Ω_p = τ/(I·ω)  — high spin = stable
        ▼
   GYRO + CONTACT POINTS + HIT
        │  r_cp determines torque lever arm
        │  CP shape sets μ (restitution) + friction
        │  friction → spin-steal (rubber) or spin-boost (blade)
        ▼
   GYRO + CP + TILT + HIT
        │  tilt θ → gravity torque → persistent wobble circle
        │  hit changes tilt angle via precession
        │  low spin → tilt grows faster
        ▼
   PER-TICK (60 Hz)
        │  forces → collision → impulse → integrate → decay → wobble → bounds → sync
        ▼
   BEYBLADE = all of the above, with:
        │  spinDecayRate (stamina-derived)
        │  damageMultiplier / damageReduction (attack/defense type)
        │  beyTiltAngle (starts from launchTilt, grows with hits + decay)
        │  PRNG wobble below 40% spin (seeded from matchId, deterministic)
        └─ ring-out or burst ends the match
```

---

## Case 8 — Destabilization: The Unified Concept (Smash, Upper, Recoil, Ground)

**Destabilization** is the one goal every attack type pursues via different torque vectors. A beyblade whose tilt angle increases wobbles faster, decays faster, and is easier to ring-out or burst. Every hit either increases or decreases tilt.

### What destabilization actually means

```
   Tilt angle θ is the master variable:

   θ small (upright)                θ large (leaning)
   │ L                               /  L
   │                                /
   ●  stable orbit                 ●  wide wobble circle
   │                                ╲
   tip traces tiny circle            tip traces BIG circle
   ├── tiny friction torque          ├── large friction torque
   ├── slow precession               ├── fast precession
   └── spin decay: normal            └── spin decay: ACCELERATED
                                         (ground friction steals energy)
```

```
   Self-reinforcing destabilization loop:

   tilt increases
        │
        ▼
   tip traces larger circle on ground
        │
        ▼
   ground friction torque (perpendicular to L) gets larger
        │
        ▼
   precession rate increases  →  tilt increases MORE
        │
        ▼
   wobble amplitude grows
        │
        ▼
   spin energy lost faster (tip drag)
        │
        ▼
   gyroscopic stiffness drops  (Ω_p = τ/Iω — ω shrinking)
        │
        ▼
   tilt increases even faster
        └──────────────────► (loop back, faster each cycle)
```

### Smash Attack vs Upper Attack — Two Destabilization Vectors

```
   SMASH ATTACK (horizontal force at equator):

   Torque:  r = horizontal from CoM, F = horizontal
            τ = r × F is VERTICAL → parallel to L
            → changes spin speed |L| but NOT tilt angle
            → MINIMAL TILT DESTABILIZATION

   What smash actually does:
   ├── Large lateral impulse → ring-out threat
   └── High restitution → large recoil on both beys
```

```
   UPPER ATTACK (force with upward component, below CoM):

   Torque:  r = from CoM to CP, points DOWN-AND-OUT
            F = rightward + UPWARD component (angled face)
            τ = r × F has component PERPENDICULAR to L
            → PRECESSION → TILT CHANGE ✓
            → destabilizes opponent

   F_total splits:
   ├── F_horizontal  →  lateral push (ring-out)
   └── F_vertical    →  lifts opponent, torque ⊥ L → tilt increase
```

### Recoil — the Attacker Destabilizes Itself

```
   Newton 3rd: A hits B with J → A receives J_recoil (equal, opposite)
   J_recoil applied at A's own CP (off-center from A's axis)
   → Torque on A → A's OWN TILT increases

   ┌──────────────────┬───────────────────────────────────────────┐
   │ Matchup          │ Recoil result on attacker                 │
   ├──────────────────┼───────────────────────────────────────────┤
   │ Attack vs Attack │ Equal J both ways. Both tilt. Higher spin  │
   │                  │ gyro survives.                            │
   ├──────────────────┼───────────────────────────────────────────┤
   │ Attack vs Defense│ Defense barely moves (high I, high mass). │
   │                  │ Attacker absorbs FULL recoil.             │
   │                  │ Attacker can self-ring-out or self-burst.  │
   ├──────────────────┼───────────────────────────────────────────┤
   │ Attack vs Stamina│ Rubber tip dampens J. Friction steals spin │
   │                  │ FROM attacker. Attacker decays first.     │
   └──────────────────┴───────────────────────────────────────────┘
```

### Ground Friction — The Silent Destabilizer

```
   Tilted bey: tip traces a circle of radius r_orbit = h_com × sin(θ)

   Friction force is tangential (opposing tip slide), always off-center.
   τ_ground = r_orbit × F_friction → component ⊥ L → more precession → more tilt

   θ = 0° → r_orbit = 0 → zero friction torque (upright is neutral)
   θ = 30° → moderate friction torque, feeds destabilization loop
   θ = 60° → large orbit, large friction torque, fast spiral to burst
```

### Complete Destabilization Pathway Map

```
   Entry point          → Mechanism                   → Outcome
   ─────────────────────────────────────────────────────────────
   Upper attack         → tilt via ⊥ torque           → wobble loop
   Smash attack         → lateral displacement         → ring-out
   Smash on defense     → recoil self-tilt on attacker → attacker ring-out
   Ground friction      → tilt amplification           → spin decay×
   Rubber spin-steal    → attacker spin drops first    → attacker topples
   Tip hit (Case 7)     → gyro counter tick+1          → attacker upper-struck
   Low spin (<40%)      → PRNG wobble noise            → burst / erratic
```

---

## Case 9 — Body On The Floor: How The Floor Constraint Changes Everything

A free gyro and a floor-constrained gyro behave completely differently when hit.

```
   FREE GYRO (floating):              FLOOR-CONSTRAINED GYRO (beyblade):

   Hit → CoM translates               Hit → tip stays on floor
         spin axis precesses freely          spin axis pivots around tip
         bey drifts across space             bey orbits around tip contact
```

```
   Floor constraint mechanics:

   The TIP is the pivot point. The floor does two things:
   ├── Normal force N (upward) keeps tip on ground
   └── Friction force f (tangential) resists tip sliding

   For a tilted bey with the tip as pivot:

              L (tilted, precessing)
             /
            /
           ●  ← CoM, orbiting in a cone around the vertical
          /
         / ← spin axis
        [tip]─── fixed contact point on floor
         │
         N (floor normal force, upward)
         f (friction, tangential to orbit)
```

```
   What "hit" means for a floor-constrained bey:

   Free bey: hit pushes CoM → CoM moves → tip follows
   Floor bey: tip CANNOT move freely → hit must either:
     (a) tilt the spin axis around the tip (rotate the whole bey, tip as pivot)
     (b) overcome friction and slide the tip along the floor
     (c) press the tip INTO the floor (downward force component → stronger N → MORE friction)

   If hit is lateral and friction is high (tip grips floor):
   → The bey pivots around the tip, not translates
   → Torque arm = full HEIGHT of the bey from tip to contact point
   → Much larger effective torque than a free-floating hit
```

```
   Effective torque for floor-constrained vs free:

   Free bey:   τ = r_cp × F     (r_cp = distance from CoM to CP)
   Floor bey:  τ = r_tip_to_CP × F  (r = distance from TIP to CP)

   Since r_tip_to_CP = r_com_to_CP + h_com (full height stack):
   τ_floor >> τ_free  (for the same force)

   This is why beyblades can BURST each other — the floor amplifies torque.
```

```
   Tip sliding vs pivoting (friction threshold):

   Tip slides if: F_lateral > μ_tip × m × g
   Tip pivots if: F_lateral ≤ μ_tip × m × g

   Sharp tip (flat/sharp type): LOW μ = 0.17 [CS10] → pivots due to POINT CONTACT geometry (tiny contact area), not high friction
   Bearing tip: VERY LOW μ = 0.05 [CS10] → slides → bey translates, torque dissipated
   Rubber tip:  HIGH μ = 0.50 [CS10] → pivots AND absorbs impulse (damping)

   This is why tip type changes the collision character completely.
```

---

## Case 10 — Hit Height: Upper, Equator, Lower, Axis

The HEIGHT at which a force is applied to a tilted floor-constrained gyro determines the DIRECTION of the resulting precession.

### Coordinate System (3D, bey tilted θ in xz plane)

```
   Spin axis direction:  L̂ = (sinθ, 0, cosθ)   (tilted in x-z plane)
   Vertical:             ẑ = (0, 0, 1)
   Hit force direction:  F = (F, 0, 0)           (horizontal, from left)

   Contact point at height h above the TIP along the spin axis:
   r = h × L̂ = h × (sinθ, 0, cosθ)
```

```
   Torque:  τ = r × F
            = h(sinθ, 0, cosθ) × (F, 0, 0)
            = h × |i      j       k    |
                   |sinθ  0      cosθ  |
                   |F     0      0     |
            = h × ( 0×0 - cosθ×0,   cosθ×F - sinθ×0,   sinθ×0 - 0×F )
            = h × ( 0,   F·cosθ,   0 )
            = ( 0,  h·F·cosθ,  0 )       ← always in the +Y direction

   For hit from the OTHER side (F negative):
            τ = ( 0,  h·F·cosθ,  0 ) with F < 0 → -Y direction

   KEY: The sign of h (above or below CoM) determines
        WHICH WAY the bey precesses!
```

### What each contact height does

```
   Contact height reference (bey standing on floor):

        [top / bit-beast / layer top]  ← h = +H_top above tip
              ↑
         [attack ring equator]         ← h = +H_ar  above tip (above CoM usually)
              ↑
         ── [CoM] ──                   ← h = +H_com above tip
              ↑
         [lower shell / frame bottom]  ← h = +H_low above tip (below CoM)
              ↑
        [tip]                          ← h = 0
```

```
   UPPER HIT (h > h_com, above CoM):

   τ = +Y (toward viewer)
   L precesses toward +Y → spin axis top swings AWAY from attacker
   → Opponent's top goes OUTWARD (away)
   → Opponent gets PUSHED OUTWARD (ring-out vector)
   → But attacker is NOT counter-struck by the top

   ┌─────────────────────────────────────────────────────────────┐
   │  "Upper attack" in Beyblade = hit ABOVE opponent's CoM      │
   │  → pushes top of opponent OUT and AWAY                      │
   │  → increases tilt angle (top goes further out)              │
   │  → attacker is SAFE from counter-strike                     │
   └─────────────────────────────────────────────────────────────┘
```

```
   LOWER HIT / TIP HIT (h < h_com, below CoM):

   τ = -Y (away from viewer)
   L precesses toward -Y → spin axis top swings TOWARD attacker
   → Opponent's top comes INWARD (toward attacker)
   → Attacker is in the path of the counter-strike (Case 7!)
   → This is the dangerous hit — it invites the gyroscopic return

   ┌─────────────────────────────────────────────────────────────┐
   │  "Lower / tip attack" in Beyblade = hit BELOW opponent CoM  │
   │  → opponent's top swings TOWARD attacker next tick          │
   │  → only safe if attacker has MOVED AWAY in that tick        │
   └─────────────────────────────────────────────────────────────┘
```

```
   AT CoM (h = h_com exactly):

   τ = r_com × F.  r_com = (0, 0, 0) → τ = 0
   Pure linear impulse.  No torque.  No tilt change.
   Bey just slides (if tip not gripping) or is pushed bodily.

   Realistically: hitting exactly at CoM is hard. A few px off → small τ.
```

```
   AT THE AXIS (r_cp ≈ 0, force through spin axis):

   Even if h ≠ h_com, if the force passes through the spin axis:
   r (measured perpendicular to axis) = 0 → τ = 0
   → Pure spin-axis force: either compresses tip to floor (if down)
      or lifts the bey (if up)
   → No precession, no tilt change
   → Only way to hit the axis: dead-center hub hit (very small CP region)
```

### Down Attack (force with downward component)

```
   F = (F_horiz, 0, -F_vert)  (horizontal + downward)

   Extra downward component effect on floor-constrained bey:
   ├── Presses tip HARDER into floor → increases normal force N
   ├── Increased N → increased friction force → tip less likely to slide
   ├── Bey now PIVOTS harder around tip (more torque amplification)
   └── If tip friction very high: bey rocks around tip, CoM swings upward
       on the FAR side → momentary "hop" on opposite side

   Down attack against a tilted bey (tilt pointing toward attacker):
   ├── Downward force pushes the near (high) side DOWN
   ├── Reaction: far (low) side of bey RISES
   └── Tilt angle increases or reverses → can FLIP the tilt direction
```

```
   Down attack summary:

   vs upright bey:   mostly presses tip to floor, minimal tilt change
   vs tilted bey:    amplifies tilt on near side, flip risk on far side
   vs wobbling bey:  can "catch" the wobble at the right phase and amplify it
                     or stabilize it (depending on timing — this is a QTE mechanic)
```

---

## Case 11 — Tall Bey vs Short Bey: Height Mismatch Contact

When a tall beyblade tilts, its attack ring sweeps a cone in space. A short bey beside it may be ENTIRELY BELOW the AR, or the AR may contact it at different heights.

```
   Side view, tall bey A (tilted) beside short bey B:

        A's top                               
           │ A's spin axis (tilted right)      
           │                                   
        ───┼─── AR of A  ←──────────────────  hits B here
           │           (AR height when tilted)  
        ───●─── A's CoM                         
           │                                    
        ───┼─── A's lower shell                 
           │                                    
        [A tip]      [B tip]
                      │
                   ───●─── B's CoM  ← AR hits above B's CoM
                      │               → Upper-type effect on B!
                   ───┼─── B's AR
                      │
```

```
   What tilting A's AR does to the contact height on B:

   A tilts toward B at angle θ_A:
   The contact side of A's AR drops by:
     Δh_ar = r_ar_A × sin(θ_A)   (AR radius × sin of tilt)

   If A's AR normally clears B's top, but A tilts:
     Δh_ar might bring AR DOWN to B's body level
     → Contact now possible
     → Contact height on B = A_AR_height - Δh_ar - B_base_height

   This contact height on B determines the attack type (upper/lower/equator).
```

```
   Typical tall-bey tilt scenarios:

   Scenario 1: A's tilted AR hits B ABOVE B's CoM (upper attack on B):
   ├── B's top precesses AWAY (pushed outward)
   ├── B gets tilted outward
   └── A receives recoil at A's AR height (above A's CoM if A is big)
       → A also precesses (top goes toward B as counter!)

   Scenario 2: A's tilted AR hits B BELOW B's CoM (lower attack on B):
   ├── B's top precesses TOWARD A (Case 7 counter on A!)
   ├── A's AR is already sweeping past B (fast spin)
   └── B's top arrives where A's body WAS → may or may not contact

   Scenario 3: A's AR sweeps over B entirely (height mismatch, no contact):
   ├── No collision
   └── A continues precessing, AR descends further on next wobble cycle
       → contact possible next precession cycle
```

```
   The tilted-AR sweep ellipse (top view of A's AR path):

   If A's spin axis tilts to the right by θ_A degrees, the AR (radius r_ar)
   traces an ELLIPSE on the horizontal plane:

       ┌──────────────────────────────────────────┐
       │          b = r_ar (semi-minor)           │
       │    ●──────────────────────────────────●  │
       │    ← a = r_ar / cos(θ_A) (semi-major) → │
       └──────────────────────────────────────────┘
       (the AR stretches because it's tilted, not circular from above)

   The NEAREST point of this ellipse to B drops lower as θ_A increases.
   This is when the AR finally reaches B's height and contact begins.
```

---

## Case 12 — The Full Contact System: Computing Contact Points, Torques, and Bounces

This is the unified calculation that must happen every tick a collision is detected.

### Step 1: Determine Contact Point in 3D

```
   Given:
   bey A: position (x_A, y_A), tilt angle θ_A, tilt direction φ_A, spin ω_A
   bey B: position (x_B, y_B), tilt angle θ_B, tilt direction φ_B, spin ω_B

   Spin axis vectors (3D, tip at floor = origin for each bey):
   L̂_A = (sinθ_A · cos φ_A,  sinθ_A · sin φ_A,  cosθ_A)
   L̂_B = (sinθ_B · cos φ_B,  sinθ_B · sin φ_B,  cosθ_B)

   AR position of A (the attacking ring center point in 3D):
   AR_A = (x_A, y_A, 0) + h_ar_A × L̂_A
        = (x_A + h_ar_A·sinθ_A·cosφ_A,
           y_A + h_ar_A·sinθ_A·sinφ_A,
           h_ar_A · cosθ_A)

   Contact occurs when distance(AR_A, B_body_surface) ≤ r_ar_A + r_B
   Contact HEIGHT on B = AR_A.z - B.floor_z (= AR_A.z since B at floor)

   Height of B's CoM: h_com_B (from Firestore bey config)
   r_cp_from_CoM_on_B = contact_height_on_B - h_com_B
   (positive = above CoM, negative = below CoM)
```

### Step 2: Compute Collision Normal and Relative Velocity

```
   2D floor-plane normal (standard circle collision):
   n̂ = normalize(pos_B - pos_A)   (points from A toward B)

   Relative velocity at contact:
   v_rel = v_A - v_B  (linear velocities)

   Tangential velocity of A's AR surface (from spin):
   v_tangential_A = ω_A × r_ar_A  (perpendicular to n̂)

   Effective relative velocity including spin:
   v_eff = (v_A - v_B) + v_tangential_A - v_tangential_B
```

### Step 3: Impulse Magnitude (with tilt-modified mass terms)

```
   Standard impulse formula extended for tilt:

   J = -(1 + μ) × (v_eff · n̂)
       ──────────────────────────────────────────────────────
       1/m_A + 1/m_B + (r_cp_A² / I_A) + (r_cp_B² / I_B)

   where r_cp_A = |AR_A - CoM_A| projected perpendicular to L̂_A
         r_cp_B = |contact_point - CoM_B| projected perp to L̂_B

   μ = mixed restitution from CP types of both beys at this height
```

### Step 4: Apply Impulse — Split Into Linear + Angular (Tilt)

```
   On bey A:
   Δv_A = -(J / m_A) × n̂                    (linear, pushes back)
   τ_A  = r_vec_A × (J × n̂)                 (torque at contact point)
         where r_vec_A = AR_A - CoM_A (in 3D)

   Component of τ_A along L̂_A  → changes spin speed ω_A
   Component of τ_A perp to L̂_A → PRECESSION of spin axis
     Δφ_A (precession angle) = |τ_perp_A| / (I_A × ω_A) × Δt

   New tilt direction: φ_A rotates by Δφ_A
   New tilt angle: θ_A changes based on which way precession goes
     (above CoM hit → θ_A increases or decreases depending on geometry)
     (below CoM hit → θ_A changes in opposite direction)

   On bey B: mirror calculation with r_cp_B and φ_B
```

### Step 5: Ground Friction Update (each tick after collision)

```
   For each bey post-collision:
   r_orbit = h_com × sin(θ)            (tip orbit radius)
   F_friction = μ_tip × m × g           (ground friction magnitude)
   τ_ground = r_orbit × F_friction      (torque on spin axis)
   Δθ_per_tick = τ_ground / (I × ω) × Δt  (tilt increase per tick)

   Add Δθ_per_tick to bey's tilt angle each tick.
   This is the slow-burn destabilizer that compounds with collision torques.
```

### Step 6: Recoil Self-Torque

```
   After applying impulse J to B at contact point:
   A receives -J at A's AR contact point (Newton 3rd)
   Torque on A from recoil: τ_recoil_A = r_ar_A × (-J × n̂)
   This adds to A's precession the same way as any other torque.

   If A is an attack-type hitting a defense-type:
   ├── B barely moves (large m_B, large I_B)
   ├── J is large (high μ smash type)
   ├── A's recoil τ is large
   └── A's θ increases → A destabilizes from its own attack
```

### Complete Per-Collision Function

```typescript
interface ContactResult {
  contactHeightOnB: number;   // z of contact above floor
  r_cp_from_com_A: number;   // signed distance from A's CoM to contact along axis
  r_cp_from_com_B: number;   // signed distance from B's CoM to contact along axis
}

function fullCollisionResolve(A: BeyState, B: BeyState, cp: ContactResult) {
  const n = normalize2D(B.pos - A.pos);

  // effective relative velocity including rotational surface speed
  const v_rel = (A.vel - B.vel) + A.spin * A.r_ar * n_perp
                                  - B.spin * B.r_ar * n_perp;
  const v_rel_n = dot(v_rel, n);
  if (v_rel_n >= 0) return;  // separating

  const mu = mixedRestitution(A.cpType, B.cpType, cp.contactHeightOnB, B.h_com);
  const J = -(1 + mu) * v_rel_n
          / (1/A.mass + 1/B.mass
             + cp.r_cp_from_com_A**2 / A.I
             + cp.r_cp_from_com_B**2 / B.I);

  // linear impulse
  A.vel -= (J / A.mass) * n;
  B.vel += (J / B.mass) * n;

  // spin exchange (friction component, tangential)
  const J_tangential = J * frictionCoeff(A.cpType, B.cpType);
  A.spin -= J_tangential * A.r_ar / A.I * 0.1;
  B.spin += J_tangential * B.r_ar / B.I * 0.05;  // partial transfer

  // TILT CHANGE via precession
  // A hit at cp.r_cp_from_com_A: if negative (below CoM), top swings toward B
  // if positive (above CoM), top swings away from B
  const prec_A = (J * Math.abs(cp.r_cp_from_com_A)) / (A.I * A.spin);
  const prec_B = (J * Math.abs(cp.r_cp_from_com_B)) / (B.I * B.spin);
  const dir_A = Math.sign(cp.r_cp_from_com_A);  // +1 above, -1 below
  const dir_B = Math.sign(cp.r_cp_from_com_B);

  // Above CoM hit on B: B's top goes AWAY (toward B's side)
  // Below CoM hit on B: B's top comes TOWARD A (counter direction)
  A.tiltAngle += prec_A * Δt;
  B.tiltAngle += prec_B * Δt;
  // tilt direction updates: φ rotates perpendicular to the torque direction
  A.tiltDirection += precessionDirectionOffset(A, n, dir_A);
  B.tiltDirection += precessionDirectionOffset(B, n, dir_B);

  // Burst check (if tilt > burst threshold AND spin < burst floor AND recoil force)
  if (B.tiltAngle > BURST_TILT_THRESHOLD && B.spin < B.spin * 0.3) {
    triggerBurst(B);
  }
}
```

---

## Case 13 — Bounce Behavior: What Determines the Rebound

```
   After impulse J is applied, both beys separate. The quality of the bounce
   depends on three things:

   1. Restitution coefficient μ (from CP types):
      μ = 1.0 → perfect elastic bounce (all kinetic energy preserved)
      μ = 0.0 → perfectly inelastic (no rebound, beys stick momentarily)

   2. Spin state:
      High spin → gyroscopic stiffness resists tilt → "clean" bounce, minimal wobble
      Low spin  → no gyroscopic resistance → hit causes tumble, not bounce

   3. Floor grip (tip type):
      High grip tip → bey pivots around tip (amplified torque, bigger angular response)
      Low grip tip  → bey slides, torque is partially dissipated

   Bounce trajectory diagram (top view):

   Before:   A ──►  ◄── B         After:   A ◄──  ──► B
             approach             rebound  (both reverse along n̂)

   But also:
             A ──►  ◄── B         After:   A ←↗   ↘→ B
             (offset hit)                  (angled rebound, spin adds tangential)

   The tangential (sideways) component of the bounce comes from SPIN:
   A is spinning → its surface at the contact point moves sideways
   This adds a sideways impulse if there's friction → A bounces off-axis
```

```
   Rebound angle as function of spin and offset:

   Impact offset d (how far from center to center):
   d = 0 (head-on):  pure reversal, no sideways component
   d = r_A + r_B (glancing):  maximum sideways, minimum reversal

   Spin contribution to bounce angle:
   tan(β) = (ω × r × friction) / v_approach

   High ω, high friction tip → large β → bey "spins away" sideways
   Low ω or low friction → β ≈ 0 → near-straight rebound
```

---

## Case 14 — Off-Axis Tip: Jumping, Airborne State, and Landing Impact (Storm Capricorn M145Q)

> **Stock combo (Storm Capricorne M145Q):** CW: Capricorne · MW: Storm · Track: Move 145 · Bottom: Quake

Storm Capricorn is **M145Q** — the Q is the **Quake tip**, specifically engineered to produce the jumping behaviour. It is NOT an S (Sharp) tip. The Q tip has a **rounded / multi-lobed dome** contact surface rather than a single point, and that geometry is what creates the cam mechanism below.

### Q Tip — The Real Geometry: Slanted Contact Surface (Frustum-to-Cylinder)

The Q tip is **NOT a simple ellipse on a flat plane**. It is a tip whose contact edge runs **diagonally from the frustum (tapered cone section at the bottom) up to the cylinder (the straight body section above)**. This slant is the entire mechanism.

```
   Q tip side profile:

        ╔══════════╗  ← cylinder body (wide, straight section)
        ║          ║
        ╠══════════╣  ← frustum top (where cylinder meets taper)
         ╲        ╱
          ╲      ╱   ← frustum (tapered/conical section)
    END────╲────╱────START
    (cylinder)  (frustum point)
           ↑
    the contact edge is THIS slanted line — it goes from
    the frustum tip (LOW, narrow) to the cylinder rim (HIGH, wide)

   Compare to normal flat tip:
   ┌────────────────────┐  cylinder
   ╠════════════════════╣  ← contact is a HORIZONTAL RING, same height everywhere
    ╲                  ╱
     ╲                ╱   frustum
      ╲──────────────╱    ← all contact points at SAME height = no cam
```

```
   Top view of contact patch (what actually touches the floor):

   Normal flat tip:        Q tip:

         ────────                  /
        (flat ring)               /  ← a diagonal LINE, not a ring
         ────────              /       or flat disc
                            /
                         ||  ← at one spin angle: only the frustum
                               POINT contacts (narrow, low)
```

### How the Slant Creates the Height Oscillation

The floor is flat and horizontal. The slanted contact edge means **different rotation angles present different effective tip heights to the floor**:

```
   Side view at two critical spin positions:

   POSITION A (frustum point contacts floor):
   ┌──────────┐  ← bey body at HEIGHT H_high
   │    ●     │  ← CoM at H_high
   │          │
    ╲        ╱  frustum
     ╲______╱
      ╲    ╱
       ╲  ╱
        \/  ← frustum POINT contacts floor = narrow line contact "||"
   ════════════ floor

   POSITION B (cylinder edge contacts floor, half-turn later):
   ┌──────────┐  ← bey body at HEIGHT H_low  (LOWER than position A!)
   │    ●     │  ← CoM dropped by Δh
   │          │
   ╔══════════╗ ← cylinder EDGE contacts floor (wide, flat contact)
   ════════════ floor

   HEIGHT DIFFERENCE:  Δh = H_high - H_low
   This is NOT small — it is the full vertical distance between
   the frustum tip and the cylinder rim contact heights.
```

```
   The oscillation cycle (one full revolution):

   Spin angle →   0°        90°        180°       270°       360°
                  ||      (mix)    [cylinder]   (mix)        ||
   Contact:    frustum   transition  cylinder  transition  frustum
   Bey height:  HIGH      falling      LOW       rising      HIGH
   
   Bey body moves:   ↑ HIGH  →  ↓ LOW  →  ↑ HIGH  (once per revolution)
   Frequency:        ω  (once per spin — NOT 2ω like a symmetric ellipse)
```

```
   The jump trigger — what happens on the LOW→HIGH transition:

   When the bey rotates from POSITION B (cylinder, low) back to
   POSITION A (frustum point, high):

   The floor PUSHES the bey body UP by Δh in the span of half a revolution.
   This is a forced vertical displacement — equivalent to an upward impulse:

   F_up ≈ m × Δh × ω²   (centripetal-equivalent restoring force)

   If F_up > m × g:
   → The upward push exceeds gravity
   → The bey's body overshoots the equilibrium height
   → The frustum tip LEAVES the floor
   → BEY IS AIRBORNE
```

### On a Tilted Arena — Why Tilt Triggers It

```
   On a perfectly flat surface with a perfectly upright bey:
   The frustum-to-cylinder transition still happens, but it is symmetric —
   the bey body rises on one side and falls on the other simultaneously,
   so net vertical force on the whole bey body ≈ 0.

   On a TILTED surface (or bey with tilt angle θ > 0):
   The symmetry is broken. One side of the bey is already lower.
   The slanted tip now has an UNEQUAL contact cycle:

   ├── Downhill half: cylinder edge contacts sooner, stays longer
   └── Uphill half: frustum point contact is favored

   The downhill side has MORE low-height contact → net downward press
   The uphill side has MORE high-height contact → net upward push
   → Net asymmetric vertical force → the bey LIFTS on the uphill side
   → Bey axis jumps OVER its rotation axis (the user's observation)
```

```
   The "jumps over its axis of rotation" mechanism:

   Tick 1: bey on frustum point "||" at height H_high
            │  spin axis vertical-ish
            ●  CoM
            │
           [|]  ← frustum contact, stable

   Tick 2: rotation brings cylinder edge to contact → bey body drops to H_low
            ●  CoM now LOWER
           [═══] ← cylinder edge contact, flat/wide

   Tick 3: rotation back to frustum point → floor pushes bey UP to H_high
            ↑ upward impulse from floor
            │  spin axis swings — the TOP of the bey PRECESSES
            ●  CoM overshoots H_high
            [|]  ← tip momentarily leaves floor on upswing

   The spin axis physically jumps over the vertical: the bey bounds upward
   along its own rotation axis direction, then lands, then repeats.
```

### M145 (Move 145) Track — Controls the Tilt of the Slant

The M145 mode-change gimmick moves the Q tip's **mounting peg** to a different hole on the track, changing how the slanted contact edge is presented to the floor:

```
   M145 mode change effect on slant angle:

   Mode 1 (peg closer to center):
   The slanted edge presents at a SHALLOWER angle to the floor.
   Δh (height difference frustum-to-cylinder) is SMALLER.
   → Gentler jump, lower frequency

   Mode 2 (peg further from center):
   The slanted edge presents at a STEEPER angle to the floor.
   Δh is LARGER (more of the frustum-to-cylinder range is exercised).
   → Aggressive jump, higher frequency, MORE poor stamina

   Both modes: still off-center, still slanted, still quakes.
   The MODE changes the AMPLITUDE and FREQUENCY of the quake.
```

```
   Why low Spin Tracks (e.g. 85) work best with Q:

   Low track = shorter bey height = smaller h_com
   Smaller h_com = less rotational inertia in the vertical plane
   = easier for the floor-push to lift the bey
   = more responsive jumping with same Δh

   High track (e.g. 145) = more mass at height = harder to lift
   = jump amplitude is reduced = quake less effective
   (M145 was included in the set to compensate for this — mode 2
    gives the max Δh to offset the 145-height penalty)
```

Storm Capricorn's jumping is NOT erratic behaviour — it is a **cam mechanism built into the slanted frustum-to-cylinder contact edge of the Q tip**, triggered by any tilt of the bey or arena, causing the bey body to oscillate vertically at spin frequency and bound over its own rotation axis.

### The Self-Driven Jump — No External Force Required

```
   This is unique among all tip types:

   Normal tips (WF, F, S, RF, B):
   ├── Jump requires: hit from opponent, arena tilt, wall rebound, or low spin
   └── Without external disturbance → bey stays grounded

   Q tip:
   ├── Jump requires: only SPIN SPEED above the threshold
   │     condition: ω² × tipDeltaH × 0.5 > G
   │     → ω > sqrt(2G / tipDeltaH)
   └── No hit, no tilt, no wall needed. The cam IS the jump mechanism.

   The spin drives the cam. The cam drives the jump.
   External forces only change WHEN and WHERE the jump happens, not WHETHER.
```

```
   Jump threshold vs spin speed:

   High spin (just launched):
   ├── ω is maximum → cam force > G → jumps regularly and predictably
   ├── Gyroscopic stiffness is high → tip lands cleanly, axis stays stable
   └── Jump is repeatable: same Δh each revolution, consistent bounce height

   Mid spin (~60% maxSpin):
   ├── ω decreasing → cam force closer to G → jumps less frequently
   └── External tilt now starts adding to the jump threshold more than cam alone

   Low spin (<40% maxSpin):
   ├── ω² too low for cam alone to exceed G
   └── Jumping stops. Bey settles and wobbles (standard PRNG wobble from Case 6)

   → Q tip ONLY JUMPS when spinning fast.
   → As spin decays, it transitions from jumping to standard wobble.
   → This means Q-tip beys are most dangerous EARLY in the match.
```

### Why the Offset Creates a Vertical Oscillation

```
   Perfect on-axis tip:          Off-axis tip (offset d):

        │ spin axis                    │ spin axis
        │                              │
        ●  CoM                         ●  CoM
        │                              │
        │                             ╱  ← tip is offset d from axis
       [·] ←── stationary             [·] ← traces circle radius d on floor
       contact point                   as bey spins

   On-axis: contact point is fixed → no periodic forcing
   Off-axis: contact point ORBITS → cam mechanism → periodic vertical forcing
```

```
   The cam mechanism (side view, one revolution):

   0°: tip is BEHIND the axis        90°: tip is to the SIDE
       CoM is directly above tip          CoM is offset sideways from tip
       N = mg (normal)                    N = mg + centripetal reaction
       bey presses straight down          floor must also resist lateral lean
       │                                  │  ← lean force
       ●                                  ●
       │                              ╱
      [·]                            [·]

   180°: tip is IN FRONT              270°: tip is to the OTHER side
         CoM is directly above tip         Same as 90°, opposite direction
         N = mg again
         │
         ●
         │
        [·]

   Normal force N oscillates: N(t) = mg + m·ω²·d·sin(ωt + φ)
                                              ↑ centrifugal term
```

### The Resonance That Creates Actual Jumping

```
   N oscillates at the spin frequency ω.
   The bey also has a natural wobble/precession frequency Ω_p.

   When ω ≈ Ω_p (spin frequency matches precession frequency):
   → PARAMETRIC RESONANCE
   → Each revolution adds a little more vertical energy
   → Amplitude grows until N dips below zero

   N < 0 means the floor would need to PULL the tip down → impossible
   → Tip leaves the floor → BEY IS AIRBORNE

   N over time (growing resonance):

   N ↑
     │    ╭╮    ╭╮    ╭──╮     ╭────╮        ╭──────╮
   mg├────╯╰────╯╰────╯  ╰─────╯    ╰────────╯      ╰──...
     │                                                      ← N hits 0 → JUMP
     0──────────────────────────────────────────────► time
           growing amplitude        resonance peak   airborne
```

### Tip Type Determines Whether Jumping Is Possible

```
   ┌────────────────┬──────────┬──────────────────────────────────────────────────┐
   │ Tip type       │ μ_tip    │ Jumping?  Mechanism                              │
   ├────────────────┼──────────┼──────────────────────────────────────────────────┤
   │ Quake (Q)      │ MEDIUM   │ YES — designed-in ellipse + off-center mount     │
   │                │          │ oscillates at 2ω, most deliberate jump mechanic  │
   ├────────────────┼──────────┼──────────────────────────────────────────────────┤
   │ Sharp (S)      │ HIGH     │ SOMETIMES — single point, can go off-axis if     │
   │                │          │ worn; weaker effect than Q, single-ω frequency   │
   ├────────────────┼──────────┼──────────────────────────────────────────────────┤
   │ Semi-Sharp(S:D)│ MEDIUM   │ RARELY — semi-flat damps the oscillation         │
   ├────────────────┼──────────┼──────────────────────────────────────────────────┤
   │ Wide Flat (WF) │ MEDIUM   │ NO — circular, no ellipse → zero Δh oscillation  │
   │ Flat (F)       │ MEDIUM   │ NO — same reason                                 │
   ├────────────────┼──────────┼──────────────────────────────────────────────────┤
   │ Rubber Flat(RF)│ HIGH     │ NO — high friction damps oscillation, rubber     │
   │                │          │ absorbs the energy before N can go negative      │
   ├────────────────┼──────────┼──────────────────────────────────────────────────┤
   │ Bearing (B)    │ NEAR 0   │ NO — slides freely, centrifugal force not        │
   │                │          │ transmitted to bey body, no cam coupling         │
   └────────────────┴──────────┴──────────────────────────────────────────────────┘
```

### Airborne State Physics (while the bey is in the air)

```
   Once N = 0 and vz > 0 (tip leaving floor):

   ┌──────────────────────────────────────────────────────────────────┐
   │  AIRBORNE TICK MODEL                                             │
   │                                                                  │
   │  Forces while airborne:                                          │
   │  ├── Gravity: az = -g (decelerating upward, then accelerating down) │
   │  ├── NO floor friction: spin decay rate drops to ~20% of normal  │
   │  ├── NO tip constraint: bey precesses FREELY (faster precession) │
   │  └── AR spin: still spinning → AR still has tangential velocity  │
   │                                                                  │
   │  What changes:                                                   │
   │  ├── Tilt can change more freely (no floor constraint damping)   │
   │  ├── Spin decay slows (no tip ground drag)                       │
   │  └── Precession rate increases (constraint removed, free gyro)   │
   └──────────────────────────────────────────────────────────────────┘

   Airborne trajectory (side view):

   ↑ z
   │      ╭─────╮  ← apex
   │     ╱       ╲
   │    ╱         ╲   ← falls under gravity
   │───╱─────────────╲──────────────────── floor
        ↑             ↑
     takes off       LANDING
```

### Landing Impact — Case 2 Applied

```
   When the bey returns to the floor (z = 0, vz < 0):

   The landing is a COLLISION between:
   ├── the bey (mass m, downward velocity vz)
   └── the floor (infinite mass, stationary)

   Vertical impulse at landing:
   J_vertical = -(1 + μ_tip) × m × |vz|
   
   This is a downward-force hit at the TIP (h = 0, below CoM).
   From Case 10: hit below CoM → top of bey swings TOWARD whatever is nearby.

   Additionally, if the bey is tilted when it lands:
   ├── One side of the AR hits the floor before the other
   ├── This asymmetric contact creates a TORQUE on landing
   └── The torque direction depends on which side hits first (tilt direction)
```

```
   Landing hit geometry (bey tilted θ, landing at vz):

        / ← tilted bey falling
       / 
      ●    vz ↓
       \
        [tip + AR edge contact on floor]
              │
              J_vert (upward, from floor)
              + asymmetric AR torque (from tilt)

   AR edge contact height ≈ -r_ar × sin(θ) below floor level
   → AR edge HITS the floor
   → Additional horizontal impulse (AR scrapes floor)
   → Creates lateral velocity component → bey "hops" sideways on landing
```

### Storm Capricorn's Whirlwind Attack — Full Chain

```
   Phase 1: Ground → resonance buildup
            Off-axis S tip wobbles, N oscillates growing
            Tilt angle gradually increases (each resonance cycle)

   Phase 2: Launch → airborne
            N → 0, tip leaves floor
            vz ≈ sqrt(2 × ω² × d × h_com)   (resonance peak velocity)
            Bey rises, AR still spinning at full ω

   Phase 3: Apex → diving
            AR at max height, tilt direction brought toward opponent by precession
            (Capricorn's AR is angled → spinning AR generates a "vortex" lift
             in the anime, modelled as a slow-down of descent rate)

   Phase 4: Landing contact → attack
            Bey descends with vz ↓ and AR spinning
            AR contacts opponent's AR from ABOVE
            Normal force has DOWNWARD component → pushes opponent INTO floor
            → Opponent's tip friction spikes → opponent spin decay rate spikes
            → Opponent is pressed toward floor, destabilized vertically

   Phase 5: Bey bounces off opponent's AR
            Recoil sends Capricorn back upward (partially elastic)
            Or slides along opponent's AR surface (friction → spin steal)
```

### Per-Tick Implementation for Jumping

```typescript
interface BeyState {
  // ... existing fields ...
  z: number;              // height above floor (0 = grounded)
  vz: number;             // vertical velocity
  onFloor: boolean;       // floor contact active
  // Q tip slant model:
  tipDeltaH: number;      // Δh = height diff frustum-point to cylinder-edge contact
                          // Q mode1 ≈ 0.8mm, Q mode2 ≈ 1.6mm, WF/F = 0, S ≈ 0.2mm
  tipFriction: number;    // μ_tip (sharp=0.17 [CS10], flat=0.17 [CS10], Q=0.17, rubber=0.50 [CS10], bearing=0.05 [CS10])
}

function tickVertical(bey: BeyState, dt: number) {
  if (bey.onFloor) {
    const omega = bey.spin / bey.I;  // rad/s

    // Slanted-edge cam: bey body height oscillates at ω (once per revolution).
    // Phase 0 = frustum point (HIGH), phase π = cylinder edge (LOW).
    const phase = (totalTime * omega) % (2 * Math.PI);
    const currentHeight = bey.tipDeltaH * 0.5 * (1 + Math.cos(phase));
    // currentHeight oscillates between 0 (low, cylinder) and tipDeltaH (high, frustum)

    // Rate of height change = upward velocity imposed on bey body by the cam:
    const dzDt = -bey.tipDeltaH * 0.5 * omega * Math.sin(phase);
    // dzDt > 0 means bey body is being pushed UP (frustum rising into contact)

    // Effective normal force: gravity reduced by upward cam velocity * mass / dt
    const camForce = bey.mass * (-bey.tipDeltaH * 0.5 * omega * omega * Math.cos(phase));
    const N = bey.mass * G + camForce;  // camForce is negative when pushing up

    if (N < 0) {
      // Cam pushes up faster than gravity pulls down → bey leaves floor
      bey.vz = Math.abs(N) / bey.mass * dt;
      bey.onFloor = false;
    } else {
      // Grounded: tilt-amplified ground friction (slanted tip also adds orbit radius)
      const r_orbit = bey.h_com * Math.sin(bey.tiltAngle * DEG2RAD)
                    + bey.tipDeltaH * Math.sin(phase) * 0.5;  // slant adds extra arm
      const frictionTorque = r_orbit * bey.tipFriction * bey.mass * G;
      bey.spin -= (frictionTorque / bey.I) * dt;
    }
  } else {
    // AIRBORNE: gravity only, ~80% less spin decay (no tip drag)
    bey.vz -= G * dt;
    bey.z  += bey.vz * dt;
    bey.spinDecayRate *= 0.2;

    if (bey.z <= 0) {
      // LANDING — asymmetric tilt torque from slanted tip hitting floor
      bey.z = 0;
      const J_land = -(1 + bey.tipFriction) * bey.mass * bey.vz;
      const landTorque = J_land * (bey.h_com * Math.sin(bey.tiltAngle * DEG2RAD)
                                  + bey.tipDeltaH);
      bey.tiltAngle += (landTorque / (bey.I * bey.spin)) * RAD2DEG;
      bey.vz = 0;
      bey.onFloor = true;
      bey.spinDecayRate /= 0.2;
    }
  }
}
```

---

## Case 15 — Multi-Layer Tip Profile System

The current game tip system is **label-only**: `tipShape` is a string ID ("flat", "sharp", "semi_flat", etc.) with no geometric data. All physics come from hand-tuned scalar multipliers (`gripFactor`, `surfaceFriction`, etc.). This means contact height, layer transitions, and chamfer angles — the actual source of real tip behavior — are completely absent.

### The Gap

```
   Current model:                    What physics actually needs:

   tipShape = "semi_flat"            tipLayers = [
   gripFactor = 0.6                    { innerR: 0,    outerR: 2mm,  z: 0,    type: 'flat'    },
   surfaceFriction = 0.5               { innerR: 2mm,  outerR: 8mm,  z: 0→4mm, type: 'frustum', angle: 135° },
                                     ]
   → black box multipliers           → actual contact geometry that drives cam forces,
     no geometry, no cam, no           tilt-dependent contact switching, and Δh oscillation
     layer switching
```

### Semi-Flat (SF) — The Reference Geometry

SF is a **sharp tip with its point cut flat**. This gives it exactly two layers:

```
   SF cross-section (side view, tip pointing DOWN):

        ║  ← upper cylinder body (track above)
        ║
       ╱║╲  ← cone/frustum section (the "sharp" part, blunted)
      ╱  ║  ╲   angle ≈ 135° from vertical (blunt, not pencil-sharp)
     ╱   ║   ╲
    ╔════╩════╗  ← transition: where cone meets flat end
    ║  FLAT   ║  ← Layer 1: small flat cylinder (the "flattened end")
    ╚═════════╝
    ════════════  floor

   Layer 1 (inner flat):
   ├── radius r₁ = small (e.g. 1–2 mm)
   ├── z_contact = 0 (lowest point, contacts floor first)
   └── contact type: FLAT DISC — distributed load, low friction per mm²

   Layer 2 (outer cone/frustum):
   ├── inner radius = r₁, outer radius = r₂ (e.g. 6–8 mm)
   ├── z at inner edge = 0 (joins Layer 1 flush)
   ├── z at outer edge = +Δh (rises to meet upper cylinder)
   ├── chamfer angle α ≈ 135° from vertical (gentle slope)
   └── contact type: EDGE — contacts floor only when bey tilts enough
```

```
   Which layer contacts the floor depends on TILT ANGLE θ:

   θ = 0° (upright):
        Layer 1 flat disc contacts floor
        Small contact area → low friction → STAMINA behaviour
        Bey moves slowly, conserves spin

   θ = small (slight tilt, e.g. 10°):
        Layer 1 still primary, Layer 2 outer edge begins to graze
        Transition zone: mixed friction

   θ > θ_transition (tilted enough that cone edge contacts):
        Layer 2 outer edge contacts floor
        Larger radius contact → high friction → DEFENSE/ATTACK behaviour
        More grip → destabilization (the SF niche use case)

   θ_transition = arctan(Δh / (r₂ - r₁))   ← geometry of the chamfer
```

```
   SF contact switching (the "destabilizer" mechanic explained):

   High spin, upright (stamina mode):
   ────────────────────────────────
   bey → Layer 1 contact → low friction → slow aggressive drift
   opponent hit by SF bey → recoil shifts SF bey tilt slightly
   SF bey tilt now crosses θ_transition →

   Mid-spin, tilted (attack/defense mode):
   ────────────────────────────────────
   bey → Layer 2 cone edge → HIGH friction → grips floor
   gripping floor = tip becomes a PIVOT POINT (Case 9)
   → torque arm amplified by full height of bey
   → opponent receives high-lever precession torque → DESTABILIZED

   This is the destabilizer combo: low track + SF = θ_transition is hit easily
   (low track → bey height lower → less gyroscopic stiffness → tilts more easily)
```

### General Multi-Layer Profile Data Model

Every tip can be described by a **LayerProfile array** — a cross-section from center out:

```typescript
interface TipLayer {
  innerRadius: number;    // mm from spin axis, start of this layer
  outerRadius: number;    // mm from spin axis, end of this layer
  innerZ: number;         // mm above floor at inner edge (0 = floor level)
  outerZ: number;         // mm above floor at outer edge
  // innerZ === outerZ → flat ring (cylinder)
  // innerZ !== outerZ → frustum/cone (chamfered)
  chamferAngle: number;   // degrees from vertical (90°=flat, 0°=vertical wall)
  material: 'plastic' | 'rubber' | 'metal';
  friction: number;       // μ for this layer
  restitution: number;    // μ_bounce for this layer
}

interface TipProfile {
  layers: TipLayer[];     // ordered inner→outer
  totalHeight: number;    // mm from floor to top of tip body
  mountOffset: number;    // mm from spin axis (M145 mode, Q tip, etc.)
}
```

```
   Example profiles for real tips:

   FLAT (F):
   layers = [{ r: 0→8mm, z: 0→0, chamfer: 90°, friction: 0.5 }]
   → single flat ring, uniform height, no cam, no Δh

   SHARP (S):
   layers = [{ r: 0→0.5mm, z: 0→0, chamfer: 90°, friction: 0.8 }]
             { r: 0.5→6mm, z: 0→8mm, chamfer: 20°, friction: 0.3 }]
   → tiny flat point + steep cone above it

   SEMI-FLAT (SF):
   layers = [{ r: 0→2mm,  z: 0→0,  chamfer: 90°, friction: 0.6 }   ← flat end
             { r: 2→8mm,  z: 0→4mm, chamfer: 135°, friction: 0.4 }] ← blunt cone
   → flat inner disc + gentle outer cone

   Q (QUAKE):
   layers = [{ r: 0→6mm, z: 0→0, chamfer: 90°, friction: 0.5 }]    ← WF-like flat
   mountOffset = 1.5mm  (mode1) or 2.5mm (mode2)
   slantAngle = 15°  ← the frustum-to-cylinder slant (Case 14)
   → flat disc but SLANTED (not horizontal) due to mount offset + slant

   RUBBER FLAT (RF):
   layers = [{ r: 0→10mm, z: 0→0, chamfer: 90°, friction: 0.50, material: 'rubber' }]  // [CS10 confirmed — rubber μ]
   → wide flat rubber disc, high friction kills oscillation

   BEARING (B):
   layers = [{ r: 0→3mm, z: 0→0, chamfer: 90°, friction: 0.05, material: 'metal' }]  // [CS10 confirmed — B:D steel ball bearing μ]
   → tiny metal ball bearing, near-zero friction, decoupled spin
```

### Contact Layer Resolver — Per Tick

```typescript
function resolveActiveLayer(profile: TipProfile, tiltAngle: number): TipLayer {
  // The floor plane cuts through the tip at the current tilt.
  // The layer whose outer edge first contacts the floor wins.
  // Contact condition: outerZ × sin(tiltAngle) ≤ outerRadius × sin(tiltAngle)
  // Simplified: active layer = innermost layer whose edge is flush with floor
  // given the current tilt geometry.

  const sinTilt = Math.sin(tiltAngle * DEG2RAD);

  for (const layer of profile.layers) {
    // Effective tilt drop at this layer's outer edge:
    const tiltDrop = layer.outerRadius * sinTilt;
    // If the tilt drop brings the outer edge to floor level:
    if (tiltDrop >= layer.outerZ) {
      return layer;  // this layer contacts the floor at this tilt
    }
  }
  return profile.layers[profile.layers.length - 1]; // outermost if all else fails
}

function tickTipPhysics(bey: BeyState, dt: number) {
  const activeLayer = resolveActiveLayer(bey.tipProfile, bey.tiltAngle);

  // Δh cam for slanted/Q tips: only if mountOffset > 0 or slantAngle > 0
  const deltaH = bey.tipProfile.mountOffset * Math.sin(bey.tipProfile.slantAngle * DEG2RAD);

  // Use activeLayer.friction and deltaH for the vertical cam model (Case 14)
  // Use activeLayer.restitution for collision response (Case 12)
  // Use activeLayer.innerRadius as r_cp for torque calculations (Case 10)
}
```

### BSF (Blade Semi-Flat) — Extending the Profile With Directional Vanes

BSF is SF with **8 left-facing blades around the outer circumference of the base**. This adds a third axis to the tip model: not just radius and height, but also **rotational features** that respond to spin direction.

```
   BSF base geometry (top view of the outer rim):

         ┌─────┐  ← blade (left-facing, angled)
        ╱      │
       ╱       │
   ───╱        │───  outer rim of tip base
       ╲       │
        ╲      │
         └─────┘
   × 8 around circumference, all facing LEFT (CCW)
```

```
   What the blades do physically:

   SPIN DIRECTION vs BLADE ORIENTATION:

   Left-spin (CCW viewed from above = same direction as blades face):
   ├── Air flows INTO the blade concave face
   ├── Blade acts as a wing → downforce F_down = ½ρv²A·C_L
   ├── F_down presses tip harder into floor → higher N → higher friction
   ├── Higher friction → harder to slide/ring-out
   └── Also: more tip grip → acts as stabilizing pivot (Case 9)

   Right-spin (CW viewed from above = blades face away from flow):
   ├── Air flows over blade convex face
   ├── Much less lift → negligible downforce
   └── Effectively behaves like standard SF

   This is why left-spin BSF is harder to ring-out than right-spin BSF.
```

```
   In ZeroG arena (tiltAngle = 90°, arena wall becomes the "floor"):

   Normal arena:  blades face down, press into flat floor → negligible
                  (gravity dominates, blade force << mg)

   ZeroG arena:   gravity is now LATERAL (parallel to arena surface)
                  The "normal force" on the wall is NOT from gravity
                  → it depends entirely on how hard the bey pushes against the wall
                  → blade downforce NOW matters because it replaces gravity's role
                  F_blade = ½ρv²A·C_L ≈ small but constant
                  In ZeroG: this F_blade is what keeps tip-to-wall contact → no ring-out

   Extended wobble in ZeroG:
   ├── Wobbling bey normally: each wobble cycle → tip lifts → might ring-out
   └── BSF in ZeroG: blade downforce keeps tip pressed to wall even through wobble
       → bey can wobble far out and still recover (blade keeps grip)
```

```
   BSF layer profile (extending TipLayer with blade data):

   interface TipVanes {
     count: number;         // 8 for BSF
     facing: 'left' | 'right';  // which spin direction creates downforce
     chord: number;         // blade width (mm)
     angle: number;         // blade attack angle (degrees from tangent)
     downforceCoeff: number; // C_L equivalent (tune per tip)
   }

   BSF profile:
   layers = [
     { r: 0→2mm,   z: 0→0,  chamfer: 90°, friction: 0.6 },   ← flat inner (SF)
     { r: 2→10mm,  z: 0→4mm, chamfer: 135°, friction: 0.4 },  ← blunt cone (SF)
     { r: 10→12mm, z: 0→0,  chamfer: 90°, friction: 0.3,       ← outer rim
       vanes: { count: 8, facing: 'left', chord: 2mm, angle: 30°, downforceCoeff: 0.08 }}
   ]
```

```
   Per-tick blade downforce calculation:

   function calcBladeDownforce(bey: BeyState, vanes: TipVanes): number {
     const omega = bey.spin / bey.I;          // rad/s
     const v_tip = omega * bey.tipProfile.layers.at(-1).outerRadius;  // m/s
     const A = vanes.count * vanes.chord * BLADE_HEIGHT;   // swept area
     const F_down = 0.5 * AIR_DENSITY * v_tip * v_tip * A * vanes.downforceCoeff;

     // Direction check: only active if spin matches blade facing
     const spinDir = bey.spin > 0 ? 'left' : 'right';  // CCW = left
     if (spinDir !== vanes.facing) return F_down * 0.1; // convex face = ~10% effect

     return F_down;  // full downforce in matching direction
   }

   // Add to normal force in tickVertical:
   const N = bey.mass * G + calcBladeDownforce(bey, activeVanes) + camForce;
   // Higher N → higher friction → higher torque amplification → harder ring-out
```

### AS (Around Sharp) — Free-Spinning Outer Element

AS is a Sharp tip surrounded by a **free-spinning bowl ring**. This introduces the most important new layer primitive: a contact surface whose **friction does NOT couple back to the main bey's spin axis**.

```
   AS cross-section (side view, tip pointing DOWN):

        ║  ← upper cylinder body
        ║
        ▼  sharp tip (fixed to bey, spins with bey)
       [·]  ← primary contact (same as S tip: tiny flat point)
        │
   ╔════╧════╗  ← bowl inner rim  (free-spinning, NOT coupled to bey spin)
    ╲        ╱  ← bowl curves UPWARD (concave — like a shallow dish)
     ╲      ╱
      ══════    ← bowl outer rim (high, far from floor in upright position)

   The bowl ring can rotate around the sharp tip axis INDEPENDENTLY.
   It has its own bearing/low-friction coupling to the tip shaft.
```

```
   Two contact states depending on tilt angle θ:

   θ small (upright):                θ large (tilted):

        ▼ sharp tip contacts              ╲ sharp tip in air
       [·]                                [·]  ← not touching floor
        │                                  │
   ╔════╧════╗  bowl in air          ╔═════╧═════╗
    ╲        ╱                        ╲           ╱
     ══════                            ╲          ╱
                                        ════ ← bowl inner rim contacts floor

   Upright → sharp tip → S-tip stamina behaviour
   Tilted  → bowl rim  → stabilizing contact, free-spinning → no spin loss
```

### Why Free-Spinning Is the Critical Property

```
   Fixed outer ring (hypothetical):
   ├── Floor contacts ring at radius r_bowl
   ├── Friction torque = μ × N × r_bowl (large lever arm!)
   ├── This torque OPPOSES bey spin → spin loss → destabilization
   └── A wide fixed outer ring would actually HURT stamina

   Free-spinning bowl (AS):
   ├── Floor contacts ring at radius r_bowl
   ├── Ring CAN rotate freely → it spins up to match floor contact speed
   ├── Once bowl matches local floor speed: relative velocity → 0 → friction → 0
   ├── Friction torque transmitted to MAIN BEY: ≈ 0 (only bearing friction)
   └── Wide outer contact with near-zero spin loss → STAMINA preserved
```

```
   Balance recovery mechanism (the bowl's real job):

   When bey tilts by θ and bowl rim contacts floor:

   1. Bowl rim contacts at radius r_contact = r_bowl_inner × cos(θ)  (geometry)
   2. Floor pushes bowl rim UPWARD with normal force N_bowl
   3. N_bowl acts at r_contact from spin axis → creates RIGHTING TORQUE on bey
   4. Righting torque = N_bowl × r_contact × sin(θ)  (restores tilt toward 0)
   5. Because bowl is free-spinning, this righting torque is NOT resisted by spin
      → it purely corrects tilt, does not fight the spin axis

   This is the "regains balance" effect — the bowl provides a passive righting
   spring that activates whenever the bey tilts enough for the bowl to contact.
```

```
   Bowl geometry — concave shape matters:

   Top view of bowl contact ring (as bey tilts more):

   θ = 10°:   bowl inner rim barely contacts
               r_contact ≈ r_bowl_inner (small)
               small righting torque (gentle correction)

   θ = 30°:   more bowl surface contacts
               r_contact grows (more of the bowl floor contacts)
               larger righting torque (stronger correction)

   θ = 60°:   bowl outer rim approaches contact
               r_contact ≈ r_bowl_outer (maximum lever arm)
               maximum righting torque (aggressive correction)

   The concave bowl shape means righting force INCREASES with tilt —
   the more it tilts, the harder the bowl pushes back. This is a
   STABLE EQUILIBRIUM at any tilt < bowl_contact_angle_max.
```

```
   AS in the layer profile system:

   interface TipLayer (extended):
     freeSpin: boolean;    // if true: friction does NOT couple to bey spin axis
     profile: 'flat' | 'concave' | 'convex';  // contact surface shape
     concaveRadius: number;  // for bowl: radius of curvature of the dish

   AS profile:
   layers = [
     // Layer 1: sharp center (fixed to bey)
     { innerR: 0,    outerR: 0.5mm, innerZ: 0, outerZ: 0,
       chamfer: 90°, friction: 0.8, freeSpin: false, profile: 'flat' },
     { innerR: 0.5,  outerR: 5mm,  innerZ: 0, outerZ: 6mm,
       chamfer: 15°, friction: 0.3, freeSpin: false, profile: 'flat' },  // spike cone

     // Layer 2: free-spinning bowl (decoupled)
     { innerR: 5mm,  outerR: 10mm, innerZ: 0, outerZ: 3mm,
       chamfer: 90°, friction: 0.4, freeSpin: true, profile: 'concave',
       concaveRadius: 8mm }   // bowl dish radius
   ]
```

```typescript
   // Per-tick: how freeSpin changes the torque calculation
   function applyLayerFriction(bey: BeyState, layer: TipLayer, N: number) {
     if (layer.freeSpin) {
       // Bowl can rotate independently — bring it to floor-contact speed
       // Friction on bowl does NOT reach the bey spin axis
       // Only the bearing coupling friction does (very small)
       const bearingFriction = 0.02;  // bearing coupling loss
       bey.spin -= (bearingFriction * N * layer.outerRadius / bey.I) * dt;

       // BUT: righting torque from bowl contact DOES apply to tilt angle
       const rightingTorque = N * layer.innerRadius * Math.sin(bey.tiltAngle * DEG2RAD);
       bey.tiltAngle -= (rightingTorque / (bey.I * bey.spin)) * RAD2DEG * dt;
     } else {
       // Fixed layer: full friction couples to bey spin axis
       const frictionTorque = layer.friction * N * layer.innerRadius;
       bey.spin -= (frictionTorque / bey.I) * dt;
     }
   }
```

### EWD (Eternal Wide Defense) — Free-Spinning Center, Wear Model, Spin Steal

EWD inverts AS: the **outer disc is fixed** (WD shape, wide stability), but the **center tip is free-spinning** via a single bearing. This creates three new physics primitives: bearing friction (non-zero even when free-spinning), a wear model (friction changes over match time), and spin-steal optimization from the decoupled center.

```
   EWD cross-section (tip pointing DOWN):

        ║  ← upper cylinder body
        ║
   ╔════╩════════════════╗  ← WD outer disc (FIXED to bey, wide, flat)
   ║                     ║    spins with bey at full ω
   ║    ┌─────────────┐  ║
   ║    │  BEARING    │  ║  ← single ball bearing (friction source)
   ║    └──────┬──────┘  ║
   ║           │         ║
   ╚═══════════╪═════════╝
               ▼
             [·]  ← free-spinning sharp tip (decoupled from bey spin)
                    can rotate at its OWN angular velocity ω_tip ≠ ω_bey
   ════════════════════════  floor
```

```
   Contrast with AS:

   AS:   center = FIXED sharp tip  (spins with bey)
         outer  = FREE-SPIN bowl   (decoupled)
   → Bowl contact doesn't steal spin. Center does.

   EWD:  center = FREE-SPIN sharp  (decoupled via bearing)
         outer  = FIXED WD disc    (spins with bey, wide stabilizer)
   → Center tip contact doesn't steal spin from bey. Wide disc stabilizes.
   → CENTER is the spin-steal interface. OUTER is the stability interface.
```

### Bearing Friction — Why EWD ≠ Ideal Free-Spin

```
   Ideal bearing (B tip): friction ≈ 0.005 (CS1 theoretical ideal; real B:D ≈ 0.05 [CS10 CONFIRMED])
   EWD single bearing:    friction ≈ 0.04–0.12 (non-negligible, wear-dependent)

   The bearing couples the tip shaft to the bey body.
   Even free-spinning, SOME torque transfers through the bearing races:

   τ_loss = μ_bearing × N × r_bearing

   where r_bearing = bearing ball-race radius (small, ~1mm)
   and N = normal force on tip = m×g + any cam/vane forces

   This τ_loss drains spin. WD has no bearing → zero τ_loss.
   That's why WD usually beats EWD on raw stamina.
```

### Wear Model — Friction Changes Over Match Time

```
   EWD bearing wear is the defining feature of this tip.
   Friction is NOT constant — it changes with use:

   wearLevel: 0.0 (new bearing)   →   1.0 (worn/clogged bearing)
   bearingFriction(wear) = baseFriction + wear × wearRange

   baseFriction  ≈ 0.04  (new, smooth bearing)
   wearRange     ≈ 0.08  (increases up to 0.12 when fully worn)
```

```
   THE GRINDING PARADOX — non-linear wear curve:

   Phase 1 (light use, wear 0.0 → 0.3):
   ├── Metal surfaces smoothing each other out
   ├── Friction DECREASES slightly as rough spots wear away
   └── μ dips below baseFriction briefly → better stamina than expected

   Phase 2 (moderate use, wear 0.3 → 0.6):
   ├── Smooth running period
   └── μ ≈ baseFriction (nominal performance)

   Phase 3 (heavy use, wear 0.6 → 1.0):
   ├── Metal debris accumulates in bearing races
   ├── Debris clogs bearing → friction spikes
   └── μ rises to 0.12+ → stamina worse than WD

   Friction vs wear curve:
   μ ↑
     │           ╭──────────
   0.12├         ╭╯
   0.08├─────────╯  ← nominal
   0.06├──╮
   0.04├   ╰────    ← brief smooth-down dip
     0 └────────────────────► wearLevel
          0    0.3  0.6  1.0
```

```typescript
   function bearingFriction(wear: number, baseFriction = 0.04): number {
     if (wear < 0.3) {
       // smooth-down phase: friction drops then recovers
       return baseFriction - 0.02 * Math.sin(wear / 0.3 * Math.PI);
     } else if (wear < 0.6) {
       return baseFriction;  // nominal
     } else {
       // debris clog: friction rises steeply
       return baseFriction + 0.08 * ((wear - 0.6) / 0.4) ** 2;
     }
   }

   // Accumulate wear per tick (faster when bey is tilted = tip slides more)
   function tickWear(bey: BeyState, dt: number) {
     const slipRate = bey.tiltAngle / 90;  // more tilt = more tip sliding
     bey.tipWear = Math.min(1.0, bey.tipWear + WEAR_RATE * slipRate * dt);
   }
```

### Spin Steal Optimization From Free-Spinning Center

```
   Standard tip (fixed center):
   When bey A (CCW) contacts bey B (CW) at center:
   ├── A's center tip spins CCW
   ├── B's center tip spins CW
   ├── Relative velocity = ω_A + ω_B (additive, same axis)
   ├── Friction force opposes relative velocity
   └── BOTH beys lose spin (friction fights both)

   EWD center (free-spinning):
   When EWD bey A contacts bey B (opposite spin) at center:
   ├── A's bearing tip can rotate EITHER direction
   ├── Tip rotates to match B's contact surface velocity
   ├── Relative velocity between tip surface and B → approaches 0
   ├── Friction between tip and B → near 0
   └── Spin steal from B is MAXIMIZED (B loses spin, A barely does)

   This is the Spin Steal mechanism — the free-spinning center acts
   as a "spin-neutral interface" that optimizes the differential.
```

```
   Spin steal per tick (center contact with opposite-spin opponent):

   Fixed tip:
   Δω_steal_per_tick = friction × N × r_contact / I_opponent  (small)
   Δω_loss_self     = friction × N × r_contact / I_self       (equal loss)

   EWD tip:
   Δω_steal_per_tick = same (opponent still loses spin to friction)
   Δω_loss_self      = bearingFriction × N × r_bearing / I_self  (10× smaller!)
   
   Net: EWD steals ≈ same spin from opponent but loses ≈ 10× less itself.
   This compounds over many contacts → EWD outlasts in spin steal endgame.
```

### EWD Layer Profile

```typescript
   EWD profile:
   layers = [
     // Center: free-spinning sharp (bearing-coupled, wear-dependent friction)
     { innerR: 0,     outerR: 0.5mm, innerZ: 0, outerZ: 0,
       chamfer: 90°,
       freeSpin: true,
       frictionFn: (wear) => bearingFriction(wear),  // dynamic, not static
       profile: 'flat' },
     { innerR: 0.5mm, outerR: 4mm,  innerZ: 0, outerZ: 5mm,
       chamfer: 15°,  freeSpin: true, friction: 0.2, profile: 'flat' }, // spike cone

     // Outer: WD-style fixed disc (stabilizer, spins with bey)
     { innerR: 12mm, outerR: 18mm, innerZ: 0, outerZ: 0,
       chamfer: 90°, freeSpin: false, friction: 0.5, profile: 'flat' }
     // Note: gap between r=4mm and r=12mm is the bearing housing (no contact zone)
   ]

   // Additional EWD state:
   tipWear: number;        // 0.0–1.0, accumulates per match
   tipSpinVelocity: number; // ω of the free-spinning center tip (tracked separately)
```

### What This Adds to the Codebase

```
   shared/types/beybladeSystem.ts:
   └── TipLayer: add frictionFn?: (wear: number) => number  (dynamic friction)
       TipProfile: add tipWear: number, tipSpinVelocity: number
       Add wearRate: number to TipPart

   server/physics/PartPhysics.ts:
   └── tickWear() — accumulates wear per tick based on tilt/slip
       bearingFriction(wear) — non-linear wear curve (the grinding paradox)
       resolveSpinSteal() — use tipSpinVelocity to reduce self-loss when freeSpin

   client/src/game/renderer/PixiRenderer.ts:
   └── Optional: show wear indicator on tip HUD (sparks at high wear?)
```

---

## Case 17 — Cross-Component Coupled Mechanics: Diablo + X Drive

> **Stock combo (Diablo Nemesis X:D):** 4D Clear Wheel: Nemesis · 4D Metal Wheel: Diablo · Bottom: X Drive

Diablo in Ultimate Balance Mode is a **three-part automatic state machine**: Metal Frame rotation → pin actuation → tip selection. No player input. No manual trigger. The system advances on its own as spin decays.

### The Full Coupling Chain

```
   ┌─────────────────────────────────────────────────────────────────┐
   │   SPIN SPEED (ω) drops over time                                │
   │         │                                                       │
   │         ▼                                                       │
   │   CENTRIFUGAL FORCE on Metal Frame weakens                      │
   │         │                                                       │
   │         ▼                                                       │
   │   Metal Frame rotates to next DETENT POSITION (120° increments) │
   │         │                                                       │
   │         ▼                                                       │
   │   Different PINS on X Drive depressed / released                │
   │         │                                                       │
   │         ▼                                                       │
   │   Active TIP LAYER on X Drive changes                           │
   │         │                                                       │
   │         ▼                                                       │
   │   Bey contact physics changes (friction, cam, restitution)      │
   └─────────────────────────────────────────────────────────────────┘
```

### Metal Frame Detents — Centrifugal Locking

```
   Diablo Metal Frame in Ultimate Balance Mode: full 360° free-spin
   But has 3 mechanical DETENT positions (120° apart):

   Top view of detent positions:
         Detent 0° (high spin)
              ▲
              │
   ◄──────────●──────────►
   Detent 240°   Detent 120° (mid spin)
   (low spin)

   At high spin: centrifugal force on the Metal Frame holds it at Detent 0°
   As ω drops: centrifugal force < detent spring force → frame snaps to Detent 120°
   As ω drops further: snaps to Detent 240°

   Centrifugal locking force: F_c = m_frame × ω² × r_frame_cog
   Detent spring force: F_d (constant, set by geometry)

   Frame stays in current detent while F_c > F_d
   Frame snaps to next detent when F_c < F_d

   Snap thresholds:
   ω > ω_high:  Detent 0°   → XF (Extreme Flat) active
   ω_mid < ω < ω_high:  Detent 120° → S²D (Stealth Semi-Defense) active
   ω < ω_mid:  Detent 240° → S (Spike) active
```

```
   ASCII: Tip state over match time

   Active tip │XF XF XF XF│S²D S²D S²D│S S S S│
              │────────────│───────────│───────│
   ω          │ high spin  │ mid spin  │low sp │
              └────────────────────────────────► time
                   Snap 1               Snap 2
                (F_c < F_d_high)  (F_c < F_d_mid)
```

### X Drive — Three Tips in One

```
   X Drive cross-section (side view):

          ╔═══╗  pin for XF (high position)
          ║   ║
      ╔═══╩═══╩═══╗  pin for S²D (mid position)
      ║           ║
   ╔══╩═══════════╩══╗  pin for S (low position)
   ║                 ║
   ╚═══════╦═════════╝
           ║   ← tip shaft
   ┌───────┴───────┐
   │ [XF]  [S²D]  [S]│  ← three tip surfaces on a rotating selector
   └───────────────┘
           ↓
        floor

   Which tip contacts the floor depends on which pin is depressed:
   - Pin 1 depressed → XF platform raised → XF contacts floor
   - Pin 2 depressed → S²D platform raised → S²D contacts floor
   - Pin 3 depressed → S platform raised → S contacts floor
```

### The Three Tip Profiles Within X Drive

```
   XF (Extreme Flat) — high spin phase:
   ├── Wide flat disc, maximum contact area
   ├── High friction, aggressive movement
   ├── Attack-type behavior: rapid lateral movement, ring-out threat
   └── Profile: flat ring, large outerR, no cam, no freeSpin

   S²D (Stealth Semi-Defense) — mid spin phase:
   ├── Semi-Defense: outer WD-style ring + inner sharp center
   ├── "Stealth" = the outer ring is recessed slightly (lower profile)
   │   so it doesn't present as wide a target to opponent CPs
   ├── Balance behavior: moderate friction, moderate stability
   └── Profile: inner sharp + outer recessed flat (like WD but shorter)

   S (Spike) — low spin phase:
   ├── Single sharp point at center
   ├── Minimal friction, maximum spin conservation
   ├── Stamina behavior: slow drift, spin-out resistance
   └── Profile: tiny flat + steep cone (same as S tip, Case 15)
```

```
   Tip transition physics — what happens on each SNAP:

   SNAP 1 (XF → S²D):
   ├── Floor contact radius drops: r_XF (large) → r_S²D (smaller)
   ├── Friction drops instantly: μ_XF (0.9) → μ_S²D (0.5)
   ├── Bey was moving aggressively (XF drift) → suddenly less friction
   ├── Momentum carries it: bey continues sliding but decelerates faster
   └── The snap itself: the pin clicks → brief vibration impulse on tip
       → small tilt perturbation (can cause wobble if bey is already tilted)

   SNAP 2 (S²D → S):
   ├── Contact reduces to sharp point: r_S²D → r_S (~0.5mm)
   ├── Friction drops further: μ_S²D (0.17) → μ_S (0.17, same material but tiny area)
   │   Note: sharp tip has LOW μ = 0.17 [CS10]; pivots due to point contact geometry, not high friction
   ├── Bey transitions to stamina mode: slow wobble circle, minimal drift
   └── If bey is wobbling when snap happens: spike tip pivot amplifies wobble
       (Case 9 — floor constraint from spike = maximum torque arm)
```

### Impact-Triggered Premature Snap — Why UBM Fails in Practice

```
   In Attack Mode: Metal Frame FIXED → no premature snaps possible
   In UBM: Metal Frame FREE-SPINNING → impact can rotate it past a detent

   When opponent hits Diablo in UBM:
   ├── Impulse J applied to Metal Frame (free-spinning, it absorbs it)
   ├── Metal Frame accelerates angularly: Δω_frame = J×r_cp / I_frame
   ├── If Δω_frame is large enough, frame rotates past the current detent
   │   into the next 120° position → PREMATURE TIP SNAP
   └── Result: bey was at high spin (XF phase) → impact forces to S²D or S phase
               → suddenly running on wrong tip for current spin speed
               → S tip at high spin = wildly unstable wobble (Case 9 + high ω)
               → STAMINA GAINS NULLIFIED (the actual reason UBM underperforms)

   Impact threshold for premature snap:
   J × r_cp / I_frame > ω_detent_threshold
   (how hard opponent must hit to accidentally advance the tip)
```

```typescript
   function applyHitToDiabloUBM(
     bey: BeyState, frame: MetalFrameState, xdrive: XDriveState, J: number
   ) {
     // Metal Frame absorbs hit (full free-spin, no slide limit)
     const dOmega_frame = (J * frame.r_cp) / frame.I;
     frame.omega += dOmega_frame;
     frame.angle += frame.omega * dt;

     // Check if we've passed a detent
     const newDetent = Math.floor(frame.angle / 120) % 3;  // 0, 1, or 2
     if (newDetent !== frame.currentDetent) {
       frame.currentDetent = newDetent;
       // Snap: brief vibration impulse on bey body
       bey.tiltAngle += SNAP_TILT_IMPULSE;  // small perturbation
       // Update X Drive active tip
       xdrive.activeTip = ['XF', 'S2D', 'S'][frame.currentDetent];
       // Recalculate active tip layer for collision physics
       bey.activeTipLayer = resolveTipLayer(xdrive);
     }
   }

   function tickDiabloUBM(
     bey: BeyState, frame: MetalFrameState, xdrive: XDriveState, dt: number
   ) {
     // Centrifugal force determines if frame stays in current detent
     const omega_bey = bey.spin / bey.I;
     const F_centrifugal = frame.mass * omega_bey * omega_bey * frame.cogRadius;
     const F_detent = DETENT_SPRING_FORCE;

     if (F_centrifugal < F_detent) {
       // Snap to next detent (centrifugal no longer holds current position)
       frame.currentDetent = (frame.currentDetent + 1) % 3;
       frame.angle = frame.currentDetent * 120;
       bey.tiltAngle += SNAP_TILT_IMPULSE;
       xdrive.activeTip = ['XF', 'S2D', 'S'][frame.currentDetent];
       bey.activeTipLayer = resolveTipLayer(xdrive);
     }

     // Frame damping (bearing friction slows free-spin frame toward bey ω)
     frame.omega -= frame.bearingFriction * (frame.omega - omega_bey) * dt;
     frame.angle += frame.omega * dt;
   }
```

### State Machine Summary

```
   Diablo UBM + X Drive state machine:

   States: { detent: 0|1|2, activeTip: XF|S²D|S }
   Transitions:

   [Detent 0, XF] ──────────────────────────────────────────────────────┐
        │  spin drops: F_c < F_d_high                                    │
        │  OR impact rotates past 120°                                   │
        ▼                                                                │
   [Detent 1, S²D] ─────────────────────────────────────────────────────│
        │  spin drops: F_c < F_d_mid                                     │
        │  OR impact rotates past 240°                                   │
        ▼                                                                │
   [Detent 2, S] ───────────────────────────────────────────────────────│
        │  spin drops to ~0: match ends                                  │
        │  OR: (never goes back — one-way ratchet)                      │
        ▼                                                                │
   [Stopped]  ◄────────────────────────────────────────────────────────-┘

   Note: Transitions are ONE-WAY (centrifugal force only decreases as spin drops).
   An impact CAN advance the state but cannot reverse it.
   → Once on S²D, you cannot return to XF even if spin somehow recovered.
```

### What This Adds to the Codebase

```
   shared/types/beybladeSystem.ts:
   └── Add MetalFrameState: { angle, omega, currentDetent, bearingFriction }
       Add XDriveState: { activeTip: 'XF'|'S2D'|'S', detentThresholds: [ω1, ω2] }
       Add crossComponentLink?: 'diablo_xdrive' to BeybladeSystem
       (marks that this bey has coupled frame→tip mechanics)

   server/physics/MechanicRegistry.ts:
   └── Register 'centrifugal_detent' mechanic:
       onTick → tickDiabloUBM()
       onHit  → applyHitToDiabloUBM()

   server/rooms/schema/GameState.ts:
   └── Add frameDetent: number (0|1|2) to Beyblade schema
       Add xdriveActiveTip: string to Beyblade schema
       Both synced to client for renderer

   client/src/game/renderer/PixiRenderer.ts:
   └── Render correct tip sprite based on xdriveActiveTip
       Animate the snap transition (brief flash/click effect)
```

---

## Case 18 — Mass Distribution Physics + Dual Bearing Architecture (Phantom Orion B:D)

> **Stock combo (Phantom Orion B:D):** 4D CW: Orion · 4D MW: Phantom · 4D Bottom: Bearing Drive

Phantom Orion is the stamina reference design. Every decision is an explicit physics optimization: Phantom maximises I by concentrating mass at maximum radius; B:D minimises friction through a dual-bearing shaft/casing split. Together they push stamina beyond what any single principle alone achieves.

### Phantom — Moment of Inertia Maximization

The game currently stores a single `I` per beyblade. Phantom shows why that is wrong — `I` is not a material property, it is a **geometry and mass-distribution property** that must be computed from parts.

```
   Moment of Inertia:  I = Σ mᵢ × rᵢ²

   For a ring of mass m at radius r:  I_ring = m × r²

   Phantom's design principle — compare two 42g wheels:

   UNIFORM DISK (same total mass):        PHANTOM (mass at outer rim):
   I = ½ × 42g × r_outer²                I ≈ 40.31g × r_frame² + 2.48g × r_core²

   r_outer ≈ 23mm                         r_frame ≈ 22mm,  r_core ≈ 5mm
   I_disk  = ½ × 0.042 × 0.023²          I_phantom = 0.04031 × 0.022² + 0.00248 × 0.005²
           = 1.11 × 10⁻⁵ kg·m²                     = 1.95 × 10⁻⁵ + 6.2 × 10⁻⁸ kg·m²
                                                     ≈ 1.95 × 10⁻⁵ kg·m²  (1.76× larger!)

   Phantom generates 76% more gyroscopic stability than a solid disk of the same mass.
```

```
   Why higher I = better stamina:

   1. Gyroscopic stiffness: harder to tilt (τ_ext = I × ω × Ω_precession)
      Higher I → opponent must apply more torque to change tilt angle
      → bey resists destabilization for longer

   2. Slower spin decay rate: spin energy E = ½Iω²
      For the same friction torque τ_tip:  dω/dt = -τ_tip / I
      Higher I → spin decays SLOWER for the same tip friction
      → bey runs longer

   3. Slower precession: Ω_p = τ_gravity / (I × ω)
      Higher I → wobble is slower and more controlled at low spin
      → bey can recover balance at spin levels where a lower-I bey would topple
```

```
   Phantom Mass Distribution (the deliberate engineering):

   PC Core (2.48g) — pure plastic, no metal:
   ├── Absolute minimum mass at center
   ├── Contributes I_core = 0.00248 × 0.005² ≈ 6×10⁻⁸ kg·m²  (negligible)
   └── Purpose: exists only to hold the Metal Frame in position, nothing more

   Metal Frame (40.31g) — dense metal ring:
   ├── 94% of total wheel mass
   ├── Sits at maximum possible radius (outer edge of wheel)
   ├── Contributes I_frame = 0.04031 × 0.022² ≈ 1.95×10⁻⁵ kg·m²  (dominant)
   └── Smooth outer surface: no protrusions = no recoil points = no spin loss on contact

   Compare Burn (predecessor):
   ├── Heavier center, less optimized outer ring
   ├── I_burn < I_phantom despite comparable mass
   └── Phantom "does a better job" = better mass-radius product
```

```
   I calculation the game should use (from parts, not a hardcoded scalar):

   function computeMomentOfInertia(bey: BeybladeSystem): number {
     let I = 0;
     for (const part of bey.parts) {
       // Each part contributes: mass × effectiveRadius²
       // effectiveRadius = distance of mass centroid from spin axis
       I += part.mass * part.massRadius * part.massRadius;
     }
     return I;
   }

   Part interface additions needed:
   ├── mass: number           (grams, from part data)
   └── massRadius: number     (mm from spin axis to mass centroid)
       For Metal Frame: massRadius ≈ outerRadius - (outerRadius - innerRadius)/2
       For Core: massRadius ≈ innerRadius / 2
       For Energy Ring: massRadius ≈ midpoint of energy ring band
```

### Phantom's Two Modes — I vs Recoil Tradeoff

```
   STAMINA MODE (smooth outer face):
   CP geometry: smooth rounded outer ring
   ├── Contact normal: tangential (grazing angle) → low μ
   ├── No protrusions → no torque lever arm on impact → near-zero tilt change
   ├── Opponent's CP hits smooth surface → deflects off, minimal energy transfer
   └── I remains high: mass distribution unchanged between modes

   ATTACK MODE (jagged/hexagonal inner face outward):
   CP geometry: sharp protrusions, linear indents
   ├── Contact normal: perpendicular to protrusion face → high μ
   ├── Jagged edges = torque lever arm on impact → tilt change on contact
   ├── Higher recoil: energy transfers efficiently both ways
   └── I unchanged — same mass distribution, different contact face
```

---

### B:D — Dual Bearing Architecture

B:D is architecturally different from EWD's single bearing. EWD has one bearing coupling a free-spinning tip to the bey body. B:D has **two separate bearings** creating three independently-rotating elements.

```
   B:D internal architecture (side view, tip pointing DOWN):

        ║  bey body (spins at ω_bey)
        ║
   ╔════╩═══════════════════╗  ← plastic housing (spins at ω_bey)
   ║    ╔═══════════════╗   ║
   ║    ║ BEARING 1     ║   ║  ← couples housing to metal casing
   ║    ╠═══════════════╣   ║     allows casing to spin at ω_casing ≠ ω_bey
   ║    ║ metal casing  ║   ║
   ║    ║ (base shell)  ║   ║
   ║    ╠═══════════════╣   ║
   ║    ║ BEARING 2     ║   ║  ← couples casing to metal shaft
   ║    ╠═══════════════╣   ║     allows shaft to spin at ω_shaft ≠ ω_casing
   ║    ║  metal shaft  ║   ║
   ╚════╬═══════════════╬═══╝
        ║               ║
        ▼               ▼
      shaft tip       casing base
    (small point)   (wide WD-ring)
    contacts floor  contacts floor
    at upright      when tilted
   ═══════════════════════════════  floor
```

```
   Three independently rotating elements:
   ├── Bey body + housing:  ω₀ (initial launch spin, decays normally)
   ├── Metal casing (base): ω₁ (decoupled via Bearing 1)
   └── Metal shaft (tip):   ω₂ (decoupled via Bearing 2)

   Each element's spin is independent. Each can be at zero while others spin.
```

### B:D Two Contact States

```
   STATE A — Upright, high spin (shaft tip contacts floor):

        ║ bey body   ω₀ = high
        ║
   ╔════╩═════════╗
   ║  [BEARING 1] ║  ω₁ ≈ 0  (casing not dragged by shaft friction)
   ║  metal casing║
   ║  [BEARING 2] ║  ω₂ ≈ 0 relative to casing
   ║  metal shaft ║
   ╚══════════════╝
             ▼
           shaft tip  ← contacts floor
           tiny point  ← minimal friction
   ════════════════   floor

   Floor friction on shaft:
   τ_shaft = μ_floor × N × r_shaft   (tiny r_shaft → tiny τ)
   τ transmitted to bey body via Bearing 2 then Bearing 1:
   τ_body = τ_shaft × μ_b2 × μ_b1   (two bearing dampings → ≈ 0)

   Net spin decay: MINIMAL. Pure stamina.
```

```
   STATE B — Tilted/low spin (casing base contacts floor):

        ║ bey body   ω₀ = still spinning!
        ║
   ╔════╩═════════╗
   ║  [BEARING 1] ║  ω₁ braking via floor contact
   ║  casing ─────╫──→ floor friction → casing slows, may STOP
   ║  [BEARING 2] ║  ω₂ continues (shaft decoupled from stopped casing)
   ║  shaft still ║  bey body still spinning above
   ╚══════════════╝
   [===casing base===] ← contacts floor at wide WD-ring radius
   ════════════════════  floor

   Floor friction on casing:  τ_casing = μ_floor × N × r_casing (LARGE)
   τ transmitted to bey body via Bearing 1 only:
   τ_body = τ_casing × μ_b1   (one bearing → small but non-negligible)

   Casing may slow to ω₁ = 0 (stops completely against the floor)
   Once casing stopped: Bearing 1 now coupling a stopped casing to spinning bey
   → bey body drags against bearing 1 → friction increases
   BUT: the bey body is still spinning, still precessing, still fighting tilt

   Net result: bey can continue spinning even when base has stopped.
   This is WHY B:D achieves 7-minute spin times.
```

```
   State transition diagram:

   ω₀ ↑                              ω₀ drops here (state B begins)
      │ ██████████████████████████   ↓
      │ STATE A                  ╲   ██████████████████
      │ (shaft contact)           ╲  STATE B (base contact)
      │ near-zero friction         ╲ low friction (one bearing)
      │ ω₀ decays very slowly       ╲ ω₀ decays slowly, ω₁ → 0
      └──────────────────────────────────────────────► time
                                  θ_tilt crosses threshold
```

```typescript
   interface BDState {
     omega_body:  number;   // bey body spin
     omega_casing: number;  // metal casing spin (independent)
     omega_shaft:  number;  // shaft spin (independent)
     contactState: 'shaft' | 'casing';
     bearing1Friction: number;  // body ↔ casing
     bearing2Friction: number;  // casing ↔ shaft
   }

   function tickBD(bey: BeyState, bd: BDState, dt: number) {
     const tiltThreshold = 15;  // degrees: beyond this, casing contacts floor

     if (bey.tiltAngle < tiltThreshold) {
       bd.contactState = 'shaft';
       // Shaft friction through two bearings to body
       const tau_floor = FLOOR_MU * bey.mass * G * SHAFT_RADIUS;
       const tau_body  = tau_floor * bd.bearing2Friction * bd.bearing1Friction;
       bey.spin -= (tau_body / bey.I) * dt;   // near zero

     } else {
       bd.contactState = 'casing';
       // Casing friction through one bearing to body
       const tau_floor  = FLOOR_MU * bey.mass * G * CASING_RADIUS;
       const tau_casing = tau_floor;
       bd.omega_casing -= (tau_casing / bd.I_casing) * dt;
       bd.omega_casing  = Math.max(0, bd.omega_casing);  // casing stops

       // Drag from stopped/slowed casing on body via Bearing 1
       const slip = bey.spin - bd.omega_casing;
       const tau_body = slip * bd.bearing1Friction * bd.I_casing * 0.01;
       bey.spin -= (tau_body / bey.I) * dt;
     }
   }
```

### How Phantom + B:D Compound

```
   Phantom (high I) + B:D (near-zero friction) — why they multiply:

   Spin decay equation:  dω/dt = -τ_friction / I

   τ_friction ∝ tip friction (B:D minimises this)
   I ∝ mass distribution (Phantom maximises this)

   dω/dt_PhantomBD = -(τ_very_low) / I_very_high
                   = doubly minimized spin decay rate

   Compared to a standard bey:
   dω/dt_standard = -(τ_normal) / I_normal

   The ratio: τ_normal/τ_BD ≈ 10–20×  (bearing vs plastic tip)
              I_phantom/I_normal ≈ 1.7×  (outer ring vs uniform disk)
   Combined:  ≈ 17–34× slower spin decay → 7-minute spins vs ~25-second typical
```

```
   Why B:D alone is ring-out vulnerable (the WD-shape weakness):

   B:D outer casing = WD-shaped wide ring.
   When opponent hits Phantom Orion laterally:
   ├── Wide casing ring = large r_cp from spin axis
   ├── Large r_cp = large torque on impact (Case 10)
   ├── High I resists tilt (Phantom helps) BUT
   └── Linear velocity impulse (Δv = J/m) is NOT resisted by I
       → bey slides across arena easily
       → wide flat base = no grip (Case 9) to resist the slide
       → ring-out via lateral displacement, not via tilt/burst
```

### What This Adds to the Codebase

```
   shared/types/beybladeSystem.ts:
   └── Add mass: number and massRadius: number to all part interfaces
       Add computeI(parts[]) function
       Add BDState interface
       Replace hardcoded I in BeybladeStats with computed value

   scripts/seed-tip-shapes.js + seed-2d-parts.js:
   └── Add mass and massRadius to each part definition

   server/physics/PartPhysics.ts:
   └── Add tickBD() for dual-bearing tip mechanics
       Add computeMomentOfInertia() called at match start

   server/rooms/BattleRoom.ts:
   └── On bey creation: I = computeMomentOfInertia(bey.parts)
       In tick: use per-part mass data for collision/torque calcs
```

---

## Case 19 — Active I Modulation (Jade), Track Disc Geometry (S130), Spherical Contact (RB)

> **Stock combo (Jade Jupiter S130RB):** 4D Clear Wheel: Jupiter · 4D Metal Wheel: Jade · Track: S130 · Bottom: Rubber Ball

### Jade — Gravity Ball Gimmick: Spin-Dependent I + Angular Momentum Spin-Up

Jade's gravity balls are a **variable moment of inertia system**. The balls shift radial position based on spin speed, and when they move inward at low spin, angular momentum conservation causes the bey to **spin up**.

```
   Ball position vs spin speed:

   High ω: centrifugal force dominates
   ├── F_centrifugal = m_ball × ω² × r_ball > F_restoring
   └── Balls at r_outer → I = I_bey + 4 × m_ball × r_outer²  (high I)

   Low ω: restoring force dominates (gravity + channel geometry)
   ├── F_restoring > F_centrifugal
   └── Balls at r_inner → I = I_bey + 4 × m_ball × r_inner²  (lower I)

   Transition threshold:
   ω_threshold² = F_restoring / (m_ball × r_mid)
   At this ω, balls begin migrating inward.
```

```
   Angular momentum conservation — the spin-up effect:

   L = I × ω = constant  (when no external torque)

   As balls move inward:  I decreases
   → ω must INCREASE to keep L constant
   → BEY SPINS UP when balls return inward

   This is the "spin-retaining force" described: it's not a spring,
   it's CONSERVATION OF ANGULAR MOMENTUM (figure-skater arm-tuck effect).

   Spin-up magnitude:
   ω_new = ω_old × (I_old / I_new)
         = ω_old × (I_bey + 4·m_ball·r_outer²) / (I_bey + 4·m_ball·r_inner²)

   Example: m_ball = 2g each, r_outer = 20mm, r_inner = 10mm
   I_bey ≈ 1.5×10⁻⁵, I_outer_balls = 4×0.002×0.02² = 3.2×10⁻⁶
   I_inner_balls = 4×0.002×0.01² = 8×10⁻⁷
   ω_new/ω_old = (1.5+0.32)/(1.5+0.08) × 10⁻⁵ = 1.82/1.58 ≈ 1.15
   → ~15% spin boost when balls fully return inward
```

```
   Attack Mode vs Defense Mode:

   ATTACK MODE (balls mobile):
   ├── High spin: balls outward → I_high → gyroscopic stiffness → stability
   ├── Impact causes ω drop → balls migrate inward → spin-up → recovery
   └── Spin-up gives extra rotations right when opponent expects the bey to die

   DEFENSE MODE (balls fixed at inner position):
   ├── I is always I_low (balls locked inward)
   ├── No spin-up possible (balls can't migrate)
   ├── Bey moves faster (lower I → responds more to arena forces → wider movement)
   └── This is why Defense Mode produces faster arena movement — lower gyroscopic
       stiffness means arena forces deflect the bey more easily
```

```typescript
   interface GravityBallState {
     ballRadius: number;   // current radial position of balls
     r_inner: number;      // innermost position
     r_outer: number;      // outermost position
     m_ball: number;       // mass per ball
     n_balls: number;      // count (Jade: 4)
     mode: 'attack' | 'defense';  // defense = balls fixed at r_inner
   }

   function tickGravityBalls(bey: BeyState, gb: GravityBallState, dt: number) {
     if (gb.mode === 'defense') return;  // locked, no movement

     const omega = bey.spin / bey.I;
     const F_centrifugal = gb.m_ball * omega * omega * gb.ballRadius;
     const F_restoring   = gb.m_ball * G * 0.3;  // geometry-dependent constant

     // Migrate ball position
     const dr = (F_centrifugal - F_restoring) * dt * BALL_MIGRATION_SPEED;
     const newR = Math.max(gb.r_inner, Math.min(gb.r_outer, gb.ballRadius + dr));

     if (Math.abs(newR - gb.ballRadius) > 1e-6) {
       // I changes: conserve angular momentum L = I × ω
       const I_old = bey.I;
       const delta_I = gb.n_balls * gb.m_ball * (newR * newR - gb.ballRadius * gb.ballRadius);
       const I_new = bey.I + delta_I;

       // Conserve L: ω_new = ω_old × I_old / I_new
       const L = bey.spin;  // spin is already I×ω-equivalent in our schema
       bey.spin = L * (I_old / I_new);
       bey.I    = I_new;
       gb.ballRadius = newR;
     }
   }
```

---

### S130 (Shield 130) — Mid-Height Contact Disc

S130 adds a **horizontal disc at height 130** (a specific contact zone mid-way up the bey). This is not a tip primitive — it is a **track geometry primitive**: a lateral attack surface at a defined height.

```
   S130 geometry (side view):

        │  bey body
        │
   ─────┼───────────────┐  ← 8-arm disc (imperfect circle, height 130)
        │               │    r_disc ≈ 18mm from spin axis
        │               │    arms have GAPS between them (~45° each arm, ~45° gap)
        │               │
   ─────┼───────────────┘
        │
       tip
   ═══════ floor

   Contact zone: any opponent CP at height h ≈ 130 and radius ≤ r_disc
   will contact the S130 disc arms.
```

```
   Physics of the disc arms vs gaps:

   Full disc: would intercept every opposing CP → consistent defense
   8-arm disc: has 8 gaps → opposing CP may slip through a gap → NO contact
   Gap probability ≈ 50% (half the circumference is arms, half is gaps)
   → S130 provides PROBABILISTIC protection at height 130

   At high spin: disc spins fast → from opponent's perspective, gaps close
                  (disc appears solid due to rotation speed)
                  effective contact probability → ~100% at high spin

   At low spin: gaps are significant → contact probability ≈ 50%
```

```
   S130 + opponent height matching (extends Case 11):

   Short opponent bey (low track, e.g. 85):
   ├── Opponent CP at height ~30–50mm
   └── S130 disc at height 130 → NO interaction (disc above opponent)

   Medium opponent bey (track ~100–130):
   ├── Opponent AR at approximately disc height
   └── Disc can contact → LATERAL DEFLECTION at height 130
       Height 130 on Jade bey = ABOVE Jade's CoM (usually ~80–100mm)
       → Upper-type hit geometry on opponent (Case 10): opponent top goes away

   Tall opponent bey (track 170+):
   ├── Opponent's track/tip below 130, AR above 130
   └── S130 disc contacts opponent's TRACK/FRAME (lower part of tall bey)
       → Below-CoM hit on tall opponent → gyroscopic counter possible (Case 7)
```

```
   What needs to be added to track data:
   
   interface TrackPart (extended):
     discHeight?: number;      // mm: height of horizontal disc if present (S130: 130)
     discRadius?: number;      // mm: outer radius of disc
     discArmCount?: number;    // number of arms (S130: 8)
     discArmFraction?: number; // fraction of circumference covered by arms (S130: 0.5)
     discMass?: number;        // g: mass of the disc (adds to total I at discRadius)
```

---

### RB (Rubber Ball) — Spherical Contact Geometry

RB's sphere shape creates a **tilt-dependent contact point shift** — as the bey tilts, the contact point moves outward along the sphere surface. This is geometrically different from all previous tips where the contact radius is fixed by which layer is active.

```
   Sphere geometry vs tilt:

   θ = 0° (upright):            θ = 30° (tilted):
        ●  CoM                       ●  CoM
        │                           /
        │                          /
       [○]  ← sphere               [○]  ← sphere
        ↓                           ↓ ← contact point has SHIFTED
       [·]  contact at center    [·]    contact at r = r_sphere × sin(30°)
   ═══════ floor               ═══════ floor

   Contact point radius = r_sphere × sin(θ)
   (grows from 0 at upright to r_sphere at 90° tilt)
```

```
   What this means physically:

   θ = 0°:   contact at center → r_cp = 0 → zero torque → pure translation on hit
             (same as hitting exactly at the spin axis, Case 10)

   θ = 15°:  r_cp = r_sphere × sin(15°) ≈ 0.26 × r_sphere
              small torque lever arm → gentle precession

   θ = 45°:  r_cp = r_sphere × sin(45°) ≈ 0.71 × r_sphere
              significant torque lever arm → moderate precession

   θ = 90°:  r_cp = r_sphere (maximum) → maximum torque
              (but bey is nearly horizontal at this point — already fallen)

   Key: the torque arm grows CONTINUOUSLY with tilt (no discrete layer switch).
   This is why rubber ball movement is described as "ball-based" — the bey
   naturally orbits in an increasing-radius arc as it tilts more.
```

```
   RB vs RF comparison (same rubber, different geometry):

   RF (Rubber Flat): fixed wide disc → r_cp = r_disc (constant, large)
   ├── High friction, high torque → aggressive straight movement
   └── Same behavior regardless of tilt

   RB (Rubber Ball): sphere → r_cp = r_sphere × sin(θ) (tilt-dependent)
   ├── Upright: behaves like a bearing (zero torque on hit)
   ├── Tilted: increasing friction and torque with tilt
   └── Self-correcting: more tilt → more grip → returns to center
       (high torque at high tilt fights the tilt, acts like a restoring force)
       → This is the defense behavior: resists being pushed out (ring-out)
```

```
   Wear model — geometry changes from sphere to pseudo-flat:

   New ball:   r_sphere large, surface curved
               ├── contact at r = r_sphere × sin(θ)
               └── low contact area (sphere barely touches flat floor)

   Worn ball:  rubber grinds flat on the bottom
               contact area INCREASES (flat patch forms)
               ├── behaves like RF (Rubber Flat) when worn flat
               └── wear level 0→1: r_sphere → ∞ (flat limit)

   wornContactRadius(wear, θ):
     sphereContribution = r_sphere(wear) × sin(θ)
     flatContribution   = wear × r_disc  (grows as sphere flattens)
     return max(sphereContribution, flatContribution)

   where r_sphere(wear) = r_sphere_new / (1 + wear × WEAR_FACTOR)
```

```typescript
   function resolveRBContact(bey: BeyState, rb: RBState): number {
     const sin_theta = Math.sin(bey.tiltAngle * DEG2RAD);

     // Sphere contribution
     const r_sphere_current = rb.initialRadius / (1 + rb.wear * WEAR_FACTOR);
     const r_sphere_contact  = r_sphere_current * sin_theta;

     // Flat patch contribution (from wear)
     const r_flat_contact = rb.wear * rb.maxWornRadius;

     // Active contact radius is whichever is larger
     return Math.max(r_sphere_contact, r_flat_contact);
   }

   // In collision resolution (Case 12): use resolveRBContact as r_cp_B
   // In tickWear: rb.wear += WEAR_RATE * slip_rate * dt (same as EWD model)
```

```
   RB tip profile entry (extending Case 15 layer system):

   layers = [{
     innerR: 0,
     outerR: 'dynamic',          // r = r_sphere × sin(tiltAngle) — not fixed
     innerZ: 0, outerZ: 0,       // sphere base always at floor level
     chamfer: 'spherical',       // new profile type (not flat/frustum/concave)
     sphereRadius: 8mm,          // RB is very wide: ~16mm diameter ball
     freeSpin: false,
     friction: 0.85,             // rubber: high
     restitution: 0.25,          // rubber: absorbs
     material: 'rubber',
     wearModel: {
       rate: 0.002,              // faster wear (wide rubber contact)
       geometryShift: 'sphere_to_flat'
     }
   }]
```

---

## Case 20 — Wing Alignment Geometry: Impact Frequency vs Magnitude (Blitz)

> **Stock combo (Blitz Unicorno 100RSF):** 4D Clear Wheel: Unicorno II · 4D Metal Wheel: Blitz · Track: 100 · Bottom: Rubber Semi-Flat

Blitz establishes a principle that applies to every multi-wing Metal Wheel: **the number of contact points per revolution determines whether each hit is concentrated (few, large) or dispersed (many, small)**. The same total attack energy per second produces very different physics depending on how it is distributed.

### Wing Geometry From the Image

```
   Metal Frame (top, thin ring):        Core (bottom, wide disc):

        ┌─────────────────┐                  ────────────────────
       ╱  TAB_L  TAB_S    ╲                ╱  WING_L (swept)    ╲
      │  ╔═╗  ╔╗  ╔═╗  ╔╗  │            ╱   (large, curved blade) ╲
      │  ║ ║  ║║  ║ ║  ║║  │           │  WING_S (small)            │
       ╲ ╚═╝  ╚╝  ╚═╝  ╚╝ ╱            │  (smaller between wings)    │
        └─────────────────┘              ╲                           ╱
                                          ────────────────────────
   Frame: 6 tabs                         Core: 3 large + 3 small wings
   alternating tall/short                3-fold + 3-fold = 6-fold
```

### Two Modes — Frame Rotated Relative to Core

```
   ASSAULT ATTACK MODE (Frame tabs aligned with Core large wings):

   Core wing:    ──[WING_L]──              gap       ──[WING_L]──
   Frame tab:    ──[TAB_L]──              gap       ──[TAB_L]──
                    MERGED = 3 large combined contacts at 0°, 120°, 240°

   Top view (3-fold symmetry):
             0°
             ▲
      240° ──●── 120°
   Each combined wing: Frame tab sits ON TOP of Core wing
   Contact zone: sum of Frame tab area + Core wing area = LARGE

   ─────────────────────────────────────────────────────────────
   BARRAGE ATTACK MODE (Frame tabs rotated to sit between Core wings):

   Core wing:    ──[WING_L]──  [WING_S]  ──[WING_L]──  [WING_S]
   Frame tab:       [TAB_L]  ──[TAB_S]──   [TAB_L]  ──[TAB_S]──
                Frame tabs fall in the GAPS between Core wings
                = 6 separate contacts (3 long Core + 3 short Frame) at 0°,60°,120°...

   Top view (6-fold symmetry, alternating size):
           0° (Core large)
           ▲
   300°  ──●──  60° (Frame short)
   240°  ──●──  120° (Core large)
           ▼
          180° (Frame short)
   Each contact smaller than Assault combined wing
```

### Impact Frequency vs Magnitude — The Core Tradeoff

```
   At spin speed ω (rad/s):

   ASSAULT MODE (3 wings):
   Contact frequency = 3 × ω / (2π)  contacts per second
   Contact area per event = A_large   (Frame + Core combined)
   Impulse per contact = J_assault    (high, concentrated)
   Recoil per contact = J_assault     (same — Newton 3rd)

   BARRAGE MODE (6 wings):
   Contact frequency = 6 × ω / (2π)  contacts per second (2× more)
   Contact area per event = A_small   (Frame OR Core separately)
   Impulse per contact = J_barrage ≈ J_assault / 2  (half, dispersed)
   Recoil per contact = J_barrage     (half per hit, BUT twice as often)

   Total power delivered (J/s) = frequency × J:
   P_assault = 3×ω/(2π) × J_assault
   P_barrage = 6×ω/(2π) × J_barrage  ≈ 6×ω/(2π) × J_assault/2
             = 3×ω/(2π) × J_assault  = P_assault  (same total power!)

   So: same total energy per second, but assault delivers it in
   bigger, less frequent packages.
```

```
   Why Assault wins despite equal total power:

   1. GYROSCOPIC RESPONSE IS NONLINEAR:
      A single large impulse J_large tilts the opponent MORE than
      two smaller impulses J_large/2 applied separately.
      
      Tilt from one hit: Δθ = (r_cp × J) / (I × ω)   (linear in J)
      Tilt from two hits: Δθ_total = 2 × (r_cp × J/2) / (I × ω) = same
      
      BUT: between the two small hits, the bey has partially recovered (precessed back).
      Between one large hit, there is no intermediate recovery.
      → Large single hit → larger PEAK tilt → more likely to cross burst/topple threshold
      → Two small hits → bey recovers partially between them → never crosses threshold

   2. RECOIL ACCUMULATION:
      In Barrage Mode: Blitz itself receives recoil 6×/revolution
      Each recoil nudges Blitz's own tilt
      More frequent self-recoil → Blitz destabilizes faster than in Assault Mode
      In Assault Mode: 3×/revolution → less frequent self-recoil → more stable

   3. CONTACT CONSISTENCY:
      Assault: 3 large wings present a wider face → opponent CP will hit Blitz
               somewhere on the wing even if not perfectly aligned
      Barrage: 6 narrow wings → more likely for opponent CP to slip between wings
               → missed contacts → inconsistent attack
```

```
   The recoil physics (why Assault has "less recoil"):

   Per-hit recoil on Blitz:
   J_recoil = J_delivered × (m_opponent / (m_Blitz + m_opponent))  (Newton 3rd)

   Assault: one large J per 120° → Δθ_Blitz per hit = (r_cp × J_large) / (I_Blitz × ω)
   Barrage: one small J per 60°  → Δθ_Blitz per hit = (r_cp × J_small) / (I_Blitz × ω)
                                    J_small ≈ J_large / 2  → Δθ is half
   
   But frequency doubles, so TOTAL tilt accumulation per revolution is SAME.
   
   The difference is that Assault's larger per-hit torque in the SELF-direction
   has longer to damp before the next hit (120° vs 60°) → more recovery between hits.
   Barrage's faster frequency doesn't allow sufficient recovery → tilt builds cumulatively.
   
   Net: Assault is more stable because each recoil has longer to damp.
   This is precession damping time vs impact interval.
```

### Contact Point Data Model — Wing Symmetry

```typescript
   interface ContactPointGroup {
     n_wings: number;              // symmetry count (Assault: 3, Barrage: 6)
     r_cp: number;                 // radius from spin axis to wing face
     h_cp: number;                 // height of wing (for tall-vs-short bey, Case 11)
     wingFaceAngle: number;        // degrees: face angle of wing (smash vs upper)
     wingArcDegrees: number;       // how many degrees each wing spans
     effectiveArea: number;        // mm²: contact area per wing (Assault > Barrage)
     restitution: number;          // μ per wing
     mode: 'assault' | 'barrage';
   }

   function computeImpulseModifier(cg: ContactPointGroup): number {
     // More wings = each hit is proportionally weaker (same total mass distributed)
     // Fewer wings = each hit concentrates more effective mass
     const BASE_WINGS = 3;
     return BASE_WINGS / cg.n_wings;  // Assault: 1.0, Barrage: 0.5
   }

   // In resolveCollision (Case 12):
   const J_base = standardImpulseFormula(A, B, n, v_eff);
   const J_actual = J_base * computeImpulseModifier(A.contactGroup);
   // Assault: J_actual = J_base × 1.0 (full hit)
   // Barrage: J_actual = J_base × 0.5 (dispersed)
```

### What This Adds to the Codebase

```
   shared/types/beybladeSystem.ts:
   └── Add ContactPointGroup interface to AttackRingPart / MetalWheelPart
       Add wingMode: 'assault' | 'barrage' to MetalWheelState
       Add n_wings: number (determined by mode at match start or gimmick)

   server/physics/MechanicRegistry.ts:
   └── Register 'wing_alignment' gimmick handler:
       Reads wingMode → sets n_wings and impulseModifier on the bey's CP group

   server/rooms/BattleRoom.ts:
   └── In resolveCollision: multiply J by computeImpulseModifier(attacker.contactGroup)
       — Assault gets full impulse, Barrage gets half (but opponents are hit more often)
```

---

## Case 21 — Three-Component Composite Wheel: Viscoelastic Damping + Staged Contact (Fusion)

> **Stock combo (Fusion Hades AD145SWD):** 4D Clear Wheel: Hades · 4D Metal Wheel: Fusion · Track: AD145 · Bottom: Sharp Wide Defense

Fusion is the first wheel with three separate components, one of which is rubber interdigitated with the metal bumps. The rubber layer introduces a qualitatively different energy mechanism: **viscoelastic absorption** — energy does not bounce back, it is stored and slowly released as heat. This creates a staged contact where the first contact is soft and the second (if the hit is large enough) is hard.

### Component Stack and Geometry

```
   Side view of the three-layer wheel (Defense Mode, rubber on top):

        ═════════════════════════════════  ← Metal Frame bumps (below rubber)
        ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈  ← Rubber Frame bumps (on top, outermost)
        ─────────────────────────────────  ← Core (stays fixed)

   Balance Mode (metal on top):

        ═════════════════════════════════  ← Metal Frame bumps (outermost)
        ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈  ← Rubber Frame (behind metal, inner)
        ─────────────────────────────────  ← Core
```

```
   Circumferential view — interdigitated bumps (top view slice):

   Metal bumps:   [M]   [M]   [M]   [M]   [M]   [M]   [M]   [M]
   Rubber bumps:     [R]   [R]   [R]   [R]   [R]   [R]   [R]   [R]
   Combined:      [M][R][M][R][M][R][M][R][M][R][M][R][M][R][M][R]

   Rubber bumps sit in the GAPS between Metal Frame bumps.
   Each bump type covers approximately half the circumference.
   At any given rotational angle, the outermost material alternates M/R/M/R.
```

### Elastic vs Viscoelastic — Why Rubber Defends Differently

All previous rubber tips (RF, RB, RS) were modelled with a low restitution coefficient μ. That is an approximation. The real mechanism is **viscoelastic energy dissipation**, which behaves differently:

```
   ELASTIC bounce (steel tip, high μ):
   
   Incoming KE → compression → stored as elastic strain energy → ALL returned as KE
   
   Energy: 100% → 100%
   Time:   instant compression, instant release
   Result: full rebound, full recoil to attacker

   VISCOELASTIC absorption (rubber bump):
   
   Incoming KE → compression → stored as rubber strain + converted to HEAT
   
   Energy: 100% → 30% returned as KE + 70% lost as heat/deformation
   Time:   fast compression, SLOW release (rubber creep)
   Result: attacker feels a "soft wall" — barely any rebound
           The 70% energy loss is NOT available as recoil to either bey.
           This is true energy destruction, not energy transfer.
```

```
   Effect on our collision model:

   Standard impulse formula assumes all energy is conserved (elastic):
   J = -(1 + μ) × v_rel / (1/m_A + 1/m_B + ...)

   For rubber viscoelastic, we need a two-part model:
   J_elastic   = J × μ_return    (the elastic fraction that bounces back)
   J_absorbed  = J × (1 - μ_return)  (energy destroyed in rubber)

   Where μ_return is the fraction of energy returned:
   ├── Steel:        μ_return ≈ 0.85
   ├── Hard plastic: μ_return ≈ 0.70
   ├── RF/RB rubber: μ_return ≈ 0.30
   └── Fusion rubber bumps: μ_return ≈ 0.20 (thicker rubber, more absorption)

   Recoil on attacker A: uses J_elastic only (not J_absorbed)
   → Attacker feels much less pushback even though opponent absorbed the full impulse
   → This is the true defense mechanism: attacker doesn't ricochet away, stays near
   → But opponent also receives less destabilization (J_absorbed → heat, not tilt torque)
```

### Staged Progressive Contact — Two Contact Phases

```
   Opponent CP approaches Fusion wheel at velocity v_rel:

   PHASE 1 — Rubber bump contact:
   ┌───────────────────────────────────────────────────┐
   │  CP hits the rubber bump first (outermost layer)  │
   │  Rubber deforms by δ (compression distance)       │
   │  Force = k_rubber × δ  (rubber spring stiffness)  │
   │  k_rubber << k_metal   (rubber is much softer)    │
   │  Impulse J_1 = viscoelastic absorption            │
   │  Energy absorbed by rubber: Q = J_1 × (1-μ_r)    │
   └───────────────────────────────────────────────────┘
   │  If v_rel is small:
   │  Rubber absorbs all energy before reaching max δ
   │  → Phase 2 never happens → pure rubber defense
   │
   │  If v_rel is large (strong hit):
   │  Rubber compresses to max δ_max (bottoms out against Metal Frame)
   ▼
   PHASE 2 — Metal bump contact (rubber fully compressed):
   ┌───────────────────────────────────────────────────┐
   │  CP now contacts BOTH rubber AND metal            │
   │  System stiffness jumps: k_total = k_rubber + k_metal │
   │  Impulse J_2 = stiffer collision (more like metal)│
   │  Net impulse to opponent Core: J_1 (rubber) + J_2 (metal+rubber) │
   └───────────────────────────────────────────────────┘
```

```
   Force vs displacement curve (progressive contact):

   Force ↑
         │                          ╭──── Metal regime (steep)
         │                     ╭───╯
         │                ╭───╯
         │           ╭───╯        ← transition (rubber bottoms out)
         │      ╭───╯
         │ ╭───╯  ← Rubber regime (gentle slope, k_rubber)
         └─────────────────────────────────► δ (compression)
                  δ_rubber_max ↑
                  (rubber fully compressed, metal contact begins)

   Threshold impulse J_threshold = k_rubber × δ_rubber_max
   Below threshold: pure rubber defense (low restitution, high absorption)
   Above threshold: rubber+metal contact (hybrid response)
```

```typescript
   function fusionCollision(A: BeyState, B_fusion: BeyState, mode: 'defense'|'balance') {
     const n = normalize2D(B_fusion.pos - A.pos);
     const v_rel_n = dot(A.vel - B_fusion.vel, n);
     if (v_rel_n >= 0) return;

     // Estimate incoming impulse if rubber-only:
     const J_rubber_max = B_fusion.rubberFrame.k * B_fusion.rubberFrame.deltaMax;
     const J_incoming = Math.abs(v_rel_n) * (A.mass * B_fusion.mass) / (A.mass + B_fusion.mass);

     if (J_incoming <= J_rubber_max) {
       // PHASE 1 ONLY: rubber absorbs everything
       const mu_rubber = 0.20;  // viscoelastic return fraction
       const J = J_incoming;
       A.vel    -= (J * mu_rubber / A.mass) * n;        // attacker: reduced rebound
       B_fusion.vel += (J * mu_rubber / B_fusion.mass) * n;  // defender: minimal push
       // Energy J*(1-mu_rubber) destroyed as heat → no tilt torque, no recoil
     } else {
       // PHASE 2: rubber bottoms out, metal engages
       const J_rubber = J_rubber_max;
       const J_metal  = J_incoming - J_rubber_max;  // remainder hits metal
       const mu_r = 0.20, mu_m = mode === 'defense' ? 0.55 : 0.70;  // rubber under metal
       const J_total_returned = J_rubber * mu_r + J_metal * mu_m;
       A.vel    -= (J_total_returned / A.mass) * n;
       B_fusion.vel += (J_total_returned / B_fusion.mass) * n;
       // Apply tilt torque from the metal component only:
       const tiltTorque = J_metal * B_fusion.metalFrame.r_cp;
       B_fusion.tiltAngle += (tiltTorque / (B_fusion.I * B_fusion.spin)) * RAD2DEG;
     }
   }
```

### Mode-Dependent Mass Radius (I Changes With Mode)

```
   Defense Mode (Rubber Frame on top = outermost):
   ├── Metal Frame: behind rubber, radius ≈ r_metal (slightly inner)
   ├── Rubber Frame: outermost, radius ≈ r_rubber ≈ r_metal + δ_bump
   └── I_defense = m_metal × r_metal² + m_rubber × r_rubber² + m_core × r_core²
               = 27.3 × r_metal² + 4.6 × (r_metal + Δr)² + 12.2 × r_core²

   Balance Mode (Metal Frame on top = outermost):
   ├── Metal Frame: outermost, radius ≈ r_metal_outer (slightly larger in balance mode)
   ├── Rubber Frame: behind metal, inner
   └── I_balance = m_metal × r_metal_outer² + m_rubber × r_rubber_inner² + m_core × r_core²
               = 27.3 × r_metal_outer² + 4.6 × r_rubber_inner² + 12.2 × r_core²

   Since m_metal >> m_rubber (27.3g vs 4.6g):
   Moving metal outward (Balance Mode) → I_balance > I_defense
   → Balance Mode has MORE gyroscopic stability
   → Defense Mode sacrifices some I for better impact absorption
```

```
   The mode tradeoff:

   DEFENSE MODE:
   ├── Lower I → slightly less gyroscopic stiffness
   ├── Rubber outermost → viscoelastic absorption → true energy destruction
   ├── Less recoil to both beys → attacker doesn't bounce away, stays close
   └── But: opponent receives less tilt torque too → harder to KO opponent

   BALANCE MODE:
   ├── Higher I → more gyroscopic stability → harder to tilt
   ├── Metal outermost → elastic contact → full restitution
   ├── Round smooth metal face → tangential deflection → minimal recoil
   └── Better stamina (higher I → slower spin decay) + stability
```

### Three-Frame Data Model

```typescript
   interface CompositeWheel {
     metalFrame: {
       mass: number;        // g: 27.3 for Fusion
       massRadius: number;  // mm: depends on mode (outer in balance, inner in defense)
       bumpCount: number;   // bumps on circumference
       restitution: number; // μ_metal
     };
     rubberFrame: {
       mass: number;        // g: 4.6 for Fusion
       massRadius: number;  // mm: depends on mode
       bumpCount: number;   // same as metalFrame, interdigitated
       deltaMax: number;    // mm: max rubber compression before bottoming out
       k: number;           // N/mm: rubber spring stiffness
       mu_return: number;   // fraction of energy returned (0.20 for Fusion)
     };
     core: {
       mass: number;        // g: 12.2 for Fusion
       massRadius: number;  // fixed, same in both modes
     };
     mode: 'defense' | 'balance';
   }

   // I is computed differently per mode (Case 18 pattern):
   function computeI_CompositeWheel(w: CompositeWheel): number {
     const r_m = w.mode === 'defense' ? w.metalFrame.innerRadius : w.metalFrame.outerRadius;
     const r_r = w.mode === 'defense' ? w.rubberFrame.outerRadius : w.rubberFrame.innerRadius;
     return w.metalFrame.mass * r_m * r_m
          + w.rubberFrame.mass * r_r * r_r
          + w.core.mass * w.core.massRadius * w.core.massRadius;
   }
```

### Tip Profile Primitive Summary

All tip behaviours reduce to combinations of these primitives:

```
   ┌────────────────────┬───────────────────────────────────────────────────────┐
   │ Primitive          │ Physics effect                                        │
   ├────────────────────┼───────────────────────────────────────────────────────┤
   │ Flat ring          │ Distributed friction, no cam, stable contact          │
   │ (innerZ = outerZ)  │                                                       │
   ├────────────────────┼───────────────────────────────────────────────────────┤
   │ Frustum/cone       │ Chamfer angle determines θ_transition — when this     │
   │ (innerZ ≠ outerZ)  │ layer switches from air to floor contact              │
   ├────────────────────┼───────────────────────────────────────────────────────┤
   │ Slanted mount      │ tipMountOffset → cam mechanism → jumping (Q tip)      │
   │ (mountOffset > 0)  │ oscillation at ω (once per revolution)                │
   ├────────────────────┼───────────────────────────────────────────────────────┤
   │ Directional vanes  │ Spin-direction-dependent downforce (BSF)              │
   │ (vanes: TipVanes)  │ Matters in ZeroG where gravity ≠ main normal force   │
   ├────────────────────┼───────────────────────────────────────────────────────┤
   │ Free-spinning      │ Friction decoupled from bey spin. Righting torque     │
   │ (freeSpin: true)   │ still applies to tilt. Stamina + balance recovery(AS) │
   ├────────────────────┼───────────────────────────────────────────────────────┤
   │ Concave profile    │ Righting torque INCREASES with tilt — passive stable  │
   │ (profile: concave) │ equilibrium. Strength grows as bowl contacts more.    │
   └────────────────────┴───────────────────────────────────────────────────────┘
```

### What Needs to Change in the Codebase

```
   Files to modify:

   shared/types/beybladeSystem.ts
   └── Add TipLayer[] and TipProfile interfaces alongside TipPart
       Add tipProfile: TipProfile to TipPart (optional, falls back to scalar stats)

   client/src/pages/admin/TipShapeDefsPage.tsx
   └── Add layer editor: list of TipLayer rows (innerR, outerR, innerZ, outerZ, chamfer, material)
       Visual cross-section preview (SVG rendered from layers array)

   scripts/seed-tip-shapes.js
   └── Add geometry to each of the 16 presets (flat, sharp, SF, Q, RF, etc.)

   server/physics/PartPhysics.ts  (resolveTipStats)
   └── Add resolveActiveLayer(profile, tiltAngle) → active friction/restitution
       Add deltaH cam calculation from slant + mountOffset

   server/rooms/BattleRoom.ts  (tick collision)
   └── Use resolved activeLayer values instead of static tipFriction scalar
```

---

## Case 16 — Metal Wheel Compliance: Partial Rotational Free-Spin (Kreis)

> **Stock combo (Kreis Cygnus 145WD):** 4D Clear Wheel: Cygnus · 4D Metal Wheel: Kreis · Track: 145 · Bottom: Wide Defense

All Metal Wheels / attack rings modelled so far are **rigidly coupled** to the bey's Core — they spin at exactly the same ω as the Core, and every contact point impulse goes directly into the Core. Kreis breaks this: in Defense Mode its Metal Frame can **slide ±60° relative to the Core** before hitting a hard stop.

### The Two Modes

```
   ATTACK MODE (Metal Frame flipped — wall face outward):

   ┌─────────────────────────────────────┐
   │  Metal Frame     ║ Core             │
   │  [ridges/walls]══╬══[basic square]  │  RIGID COUPLING
   │  fixed, no slide ║                  │  Metal Frame locked to Core
   └─────────────────────────────────────┘
   → Standard rigid contact. High attack multiplier (ridged face).
   → Every hit impulse goes directly to Core. No buffer.

   DEFENSE MODE (Metal Frame right-way up — swan/curved face outward):

   ┌─────────────────────────────────────┐
   │  Metal Frame     ║ Core             │
   │  [curved bumps]──╫──[basic square]  │  PARTIAL FREE-SPIN
   │  can slide ±60°  ║                  │  with hard stops at ±60°
   └─────────────────────────────────────┘
   → Impact absorbed by Metal Frame rotation. Lower initial recoil.
   → But at ±60° stop: energy releases as jolt → recoil spike.
```

### The ±60° Sliding Buffer — Rotational Spring Model

```
   Think of it as a rotational spring-damper with hard end-stops:

   φ_frame = rotation of Metal Frame relative to Core (degrees)
   Limits:  -60° ≤ φ_frame ≤ +60°

   State machine:
   ├── |φ_frame| < 60°:  Metal Frame slides freely (low friction coupling)
   │                     Impact energy goes into ROTATING the Metal Frame
   │                     Core barely feels the hit → low recoil on Core
   │
   └── |φ_frame| = 60°:  Metal Frame hits the hard stop
                          All kinetic energy in Metal Frame suddenly transfers to Core
                          → RECOIL SPIKE (the source of Kreis' recoil)
```

```
   Impact sequence in Defense Mode (A hits Kreis at a CP):

   Tick 1: Impulse J applied to Metal Frame CP
           ├── Metal Frame starts rotating (φ_frame increases)
           ├── Core receives ONLY bearing friction torque: τ_core = μ_slip × J (small)
           └── Bey destabilization: minimal (Core barely moved)

   Tick 2–N: Metal Frame still sliding, absorbing rotational KE
              Core continues at original ω, position, tilt
              Metal Frame ω_frame increases (spinning up relative to Core)

   Tick K: φ_frame reaches ±60° — HARD STOP
           ├── Metal Frame's full angular momentum slams into Core
           ├── ΔL_transfer = I_frame × (ω_frame - ω_core)   (sudden transfer)
           ├── Core receives large sudden torque → tilt impulse → RECOIL
           └── This is worse than if the hit went directly to Core at Tick 1
               because ω_frame has been spinning up for K ticks — more energy stored

   → Defense Mode: DELAYS and AMPLIFIES recoil, it doesn't eliminate it
   → Good vs weak hits (buffer absorbs them before stop is reached)
   → Bad vs strong hits (buffer stores energy then releases bigger jolt)
```

```
   ASCII: φ_frame over time after a medium hit

   φ ↑
   60├─────────────────────────┤ ← HARD STOP here
     │                    ╭───╯
     │               ╭────╯
     │          ╭────╯
     │     ╭────╯
     0└────╯──────────────────────► time (ticks)
        hit  sliding phase     stop reached → recoil jolt
```

### Attack Mode vs Defense Mode — Contact Point Geometry Changes

```
   When the Metal Frame is FLIPPED, the face presented outward changes:

   ATTACK MODE face:                   DEFENSE MODE face:
   [ridge/wall profile]                [curved bump / swan profile]

   CP geometry:                        CP geometry:
   ├── High restitution μ (ridges      ├── Lower restitution μ (curved,
   │   = blade-type CP)                │   rounded = absorb-type CP)
   ├── Sharp contact angle             ├── Blunt contact angle → deflects
   └── Full rigid coupling             └── ±60° rotational buffer

   From Case 10 (hit height): the face angle of the CP determines
   whether the contact normal has an upward component (upper attack)
   or is purely horizontal (smash attack).

   Attack Mode ridged face → blade CP → smash/upper depending on face angle
   Defense Mode curved face → absorb CP → reduced μ, rounded normal
```

### Partial Free-Spin vs Full Free-Spin — Why the Stop Matters

```
   Full free-spin Metal Wheel (hypothetical):
   φ_frame unlimited → Metal Frame always absorbs hits, Core never feels them
   → Perfect defense (zero recoil to Core)
   → But: opponent barely bounces back either → no ring-out threat

   Kreis ±60° partial:
   → Weak hits: absorbed → low recoil ✓ (good defense)
   → Strong hits: stop reached → amplified recoil ✗ (recoil spike)
   → This is the "moderate defense" characterization — threshold-dependent

   The 60° limit is the design tradeoff:
   ├── Wide limit (e.g. ±90°): better defense vs strong hits, slower recoil
   └── Narrow limit (e.g. ±30°): faster recoil spike, higher attack mode power
```

### Per-Tick Simulation of the Sliding Gimmick

```typescript
interface MetalWheelState {
  frameRotation: number;    // φ_frame: current slide position (degrees, -60 to +60)
  frameOmega: number;       // dφ/dt: rate of slide (deg/s, relative to Core)
  mode: 'attack' | 'defense';
  slideLimit: number;       // 60° for Kreis
  slideFriction: number;    // coupling friction between frame and core (0–1)
}

function tickMetalWheel(bey: BeyState, wheel: MetalWheelState, dt: number) {
  if (wheel.mode === 'attack') return;  // rigid, nothing to do

  // Damping: slide friction slowly returns frame toward 0
  const damping = wheel.slideFriction * wheel.frameOmega;
  wheel.frameOmega -= damping * dt;
  wheel.frameRotation += wheel.frameOmega * dt;

  // Hard stop check
  if (Math.abs(wheel.frameRotation) >= wheel.slideLimit) {
    wheel.frameRotation = Math.sign(wheel.frameRotation) * wheel.slideLimit;

    // Angular momentum transfer to Core on stop impact
    const L_frame = bey.I_frame * wheel.frameOmega;
    const tiltImpulse = L_frame / (bey.I_core * bey.spin);
    bey.tiltAngle += tiltImpulse * RAD2DEG;  // recoil spike
    bey.vx += (L_frame / bey.mass) * Math.cos(bey.tiltDirection * DEG2RAD) * 0.1;
    bey.vy += (L_frame / bey.mass) * Math.sin(bey.tiltDirection * DEG2RAD) * 0.1;

    wheel.frameOmega = 0;  // frame stops at the wall
  }
}

function applyHitToMetalWheel(
  bey: BeyState, wheel: MetalWheelState, J: number, r_cp: number
) {
  if (wheel.mode === 'attack') {
    // Rigid: full impulse goes to Core immediately
    applyImpulseToCore(bey, J, r_cp);
    return;
  }

  // Defense mode: impulse goes to Metal Frame first
  const tau = r_cp * J;
  wheel.frameOmega += tau / bey.I_frame;  // frame starts sliding

  // Only bearing friction leaks to Core
  const leakTorque = tau * wheel.slideFriction;
  bey.tiltAngle += (leakTorque / (bey.I_core * bey.spin)) * RAD2DEG;
}
```

### What This Adds to the Codebase

```
   shared/types/beybladeSystem.ts:
   └── Add MetalWheelState to BeyState (frameRotation, frameOmega, mode, slideLimit)
       Add slidingGimmick?: { slideLimit: number, slideFriction: number }
       to AttackRingPart / MetalWheelPart

   server/physics/MechanicRegistry.ts:
   └── Register 'sliding_frame' mechanic handler:
       onHit → applyHitToMetalWheel()
       onTick → tickMetalWheel() (damping + stop check)

   server/rooms/BattleRoom.ts:
   └── In resolveCollision: check if bey has sliding_frame mechanic
       → route impulse through applyHitToMetalWheel instead of directly to bey

   server/rooms/schema/GameState.ts:
   └── Add frameRotation: number to Beyblade schema (@type("float32"))
       Needed for renderer to show Metal Frame rotated relative to Core

   client/src/game/renderer/PixiRenderer.ts:
   └── When rendering Kreis: offset the Metal Frame sprite by frameRotation
       (shows the slide visually — frame appears to lag behind Core on hits)
```

---

## Case 22 — Fixed Inner-Outer Stack: SWD (Sharp Wide Defense) and the No-Bearing Contrast

> **Stock combo (Fusion Hades AD145SWD):** 4D Clear Wheel: Hades · 4D Metal Wheel: Fusion · Track: AD145 · Bottom: Sharp Wide Defense

SWD is the reference design for a **fixed two-layer tip** — an inner Sharp center plus a wide outer WD ring, mechanically coupled to the bey body with no free-spinning element. Comparing SWD against EWD (free-spin inner) and AS (free-spin outer) isolates the single variable of **bearing decoupling** and shows exactly what a bearing does and does not buy.

### Physical Geometry — Sharp Through the WD Hole

```
   SWD cross-section (side view, tip pointing DOWN):

        ║  bey body
        ║
   ╔════╩═════════════════════╗  ← WD outer disc (wide, flat ring, FIXED to bey)
   ║         [hole]           ║    spins with bey at full ω
   ║           │              ║
   ║          [·]             ║  ← Sharp tip, protrudes downward THROUGH the hole
   ║          FIXED           ║    coupled to bey (no bearing)
   ╚══════════╪══════════════╝
              ▼
           Sharp tip (lowest point, contacts floor when upright)
   ═══════════════════════════════  floor

   WD ring sits ABOVE the sharp tip's floor contact level by Δh_proto:
   Δh_proto = how far the Sharp protrudes below the WD disc face

   If Δh_proto is small: WD contacts floor almost simultaneously with Sharp
   If Δh_proto is zero:  WD ring IS the floor contact (SWD becomes pure WD)
```

```
   Compare to EWD (identical outer geometry, different inner coupling):

   EWD:   center = Sharp (FREE-SPIN via bearing) → spin-neutral floor contact
   SWD:   center = Sharp (FIXED, full coupling)  → spin transfers at center contact

   EWD:   outer WD ring = FIXED (spins with bey)
   SWD:   outer WD ring = FIXED (spins with bey)     ← same

   The only difference: the bearing in EWD decouples the Sharp from the bey's spin axis.
   Remove that bearing → EWD becomes SWD.
```

### Two Contact States — Tilt-Dependent Layer Switch

```
   θ = 0° (upright):
        [·]  ← Sharp contacts floor at r = 0 (center point)
        │
   ╔════╧════════════════╗
   ║  WD ring (not quite touching floor; Δh_proto above it)
   ╚═════════════════════╝
   ═══════════════════════  floor

   Sharp is primary contact. Tiny contact area, low friction → Stamina behavior.
   WD ring provides visual profile but NO floor contact yet.

   θ = θ_WD (tilt reaches critical angle):
        [·]  ← Sharp still inside hole, but now TILTED
        │
   ╔════╧═════╗  ← WD ring OUTER EDGE contacts floor on downhill side
   ║          ║
   ╚══════════╝
   ═══════════════════════  floor

   θ_WD = arctan(Δh_proto / r_WD_inner)   (geometry of the step)

   WD ring now primary contact at large radius → wide distributed friction → Defense behavior.
```

```
   Which tip governs at each tilt:

   θ range            │ Active contact  │ Behavior
   ───────────────────┼─────────────────┼───────────────────────────────────
   0° → θ_WD          │ Sharp (center)  │ Stamina — tiny friction, high spin
   θ_WD → ~45°        │ WD ring + Sharp │ Transition — mixed friction
   > 45°              │ WD ring primary │ Defense/Stamina — wide contact, moderate friction
   ───────────────────┴─────────────────┴───────────────────────────────────

   Because Δh_proto is small by design (SWD looks almost like WD externally),
   θ_WD is a small angle — maybe 5–10°.
   → SWD spends most of a real match with the WD ring active, not the Sharp.
   → This is why SWD performs nearly identically to WD in most tests.
```

### Why SWD < EWD in Stamina: The Spin Steal Gap

```
   Scenario: SWD bey (spinning CCW) contacts opponent (spinning CW) at center tip.

   SWD (fixed coupling):
   ├── Sharp tip spins at ω_bey (CCW)
   ├── Opponent contact surface spins at ω_opp (CW)
   ├── Relative velocity = ω_bey + ω_opp (opposing, additive)
   ├── Friction force at contact: opposes relative velocity for BOTH beys
   ├── SWD bey loses spin: Δω_SWD = -friction × N × r_tip / I_bey
   └── Opponent loses spin: Δω_opp = -friction × N × r_tip / I_opp
   → SYMMETRIC loss — both lose spin equally (per moment of inertia)

   EWD (free-spin bearing):
   ├── Bearing tip rotates freely → matches opponent contact speed
   ├── Relative velocity between tip surface and opponent → ≈ 0
   ├── Friction at contact between EWD tip and opponent → ≈ 0
   ├── EWD bey spin loss: only bearing drag (very small)
   └── Opponent spin loss: friction from bearing tip surface (same magnitude)
   → ASYMMETRIC — EWD loses almost nothing, opponent loses normal amount

   Net effect per spin-steal contact:
   SWD: both decay at equal rate → neither dominates
   EWD: opponent decays, EWD barely does → EWD wins the endgame spin battle
```

```
   Why SWD still beats plain WD in many cases:

   WD outer ring = wide contact at r_WD → large friction torque in tip-mode
   SWD sharp center = contact at r ≈ 0 → near-zero friction torque when upright

   In the Sharp-primary phase (small tilt):
   SWD friction torque: τ = μ_sharp × N × r_tip ≈ μ × N × 0 ≈ 0
   WD friction torque:  τ = μ_WD × N × r_WD (full wide ring)

   SWD decays SLOWER than WD during the upright high-spin phase.
   Once both tilt enough to use the WD ring: they equalize.

   The net Stamina advantage of SWD over WD:
   ├── Early match: SWD ahead (sharp contact, low friction)
   ├── Mid match: roughly equal (both in WD ring contact mode)
   └── Late match: roughly equal (wobble overwhelms tip differences)
```

```
   Why SWD fails on TH170 (tall height 170 track):

   Taller track = higher h_com = easier to tilt
   (less gyroscopic stiffness per unit mass at constant ω)

   At higher h_com: θ_WD is crossed earlier in the match
   → SWD spends less time in Sharp-primary mode → WD ring active sooner
   → No Stamina advantage over plain WD → WD wins by being lighter (lower rotational drag)

   Low height track (e.g. 85, 100):
   → Bey stays more upright → Sharp-primary mode persists longer
   → SWD's advantage is preserved longer
```

### SWD vs DS (Defense Sharp) — Width Comparison

```
   DS (Defense Sharp):

        [·]  Sharp (center, fixed)
        │
   ╔════╧════╗  ← Narrower outer ring (smaller r_WD than SWD)
   ╚═════════╝
   
   SWD:

        [·]  Sharp (center, fixed, same as DS)
        │
   ╔════╧═══════════════════════╗  ← WIDER outer ring (matches full WD radius)
   ╚════════════════════════════╝

   r_WD_SWD > r_WD_DS

   Effect:
   DS WD ring contact: smaller radius → less friction torque → more Stamina
                       but less floor grip → worse Defense when tilted
   SWD WD ring contact: wider → more friction when tilted → better Defense plateau
                         but more friction torque → slightly more drag in WD mode

   SWD is the Defense-biased version; DS is more Stamina-biased.
   SWD is closer to WD performance; DS drifts more toward S performance.
```

### SWD Layer Profile

```typescript
   SWD profile:
   layers = [
     // Inner Sharp (fixed, DIRECTLY coupled to bey spin — no freeSpin)
     { innerR: 0,    outerR: 0.5mm, innerZ: Δh_proto, outerZ: Δh_proto,
       chamfer: 90°, friction: 0.8, freeSpin: false, profile: 'flat' },
     { innerR: 0.5mm, outerR: 4mm, innerZ: Δh_proto, outerZ: Δh_proto + 5mm,
       chamfer: 15°, friction: 0.3, freeSpin: false, profile: 'flat' }, // spike cone

     // Outer WD ring (fixed, wide — same coupling as inner)
     { innerR: r_WD_inner, outerR: r_WD_outer, innerZ: 0, outerZ: 0,
       chamfer: 90°, friction: 0.5, freeSpin: false, profile: 'flat' }
   ]

   // Δh_proto: how far Sharp tip protrudes below WD disc face (small, ~0.3–0.8mm)
   // θ_WD = arctan(Δh_proto / r_WD_inner)  ← determines transition tilt
   // For SWD: Δh_proto small → θ_WD ≈ 5°
   // For DS:  Δh_proto larger → θ_WD ≈ 10° (taller Sharp relative to smaller ring)
```

### The Four Permutations of Inner/Outer × Fixed/Free

```
   Organizing all tips by their inner/outer and coupling type:

   ┌────────────────────┬─────────────────────────┬────────────────────────────┐
   │                    │ Inner = FIXED            │ Inner = FREE-SPIN          │
   ├────────────────────┼─────────────────────────┼────────────────────────────┤
   │ Outer = FIXED      │ SWD (Sharp + WD fixed)  │ EWD (WD fixed, S free)     │
   │                    │ → symmetric spin loss    │ → spin-steal optimized     │
   │                    │ → WD look-alike          │ → best pure stamina        │
   ├────────────────────┼─────────────────────────┼────────────────────────────┤
   │ Outer = FREE-SPIN  │ AS (Sharp fixed,         │ (hypothetical — no real    │
   │                    │    bowl free-spin)        │  tip has both free-spin)   │
   │                    │ → righting torque,        │                            │
   │                    │   no spin drain from bowl │                            │
   └────────────────────┴─────────────────────────┴────────────────────────────┘

   The matrix reveals the design space:
   SWD → EWD: add a bearing to the center → unlock spin-steal optimization
   SWD → AS:  make the outer bowl free-spinning → unlock righting torque without drain
   Both upgrades address different failure modes of the base SWD geometry.
```

### Per-Tick Spin Steal Calculation (Fixed vs Free)

```typescript
   function applyTipContactSpinSteal(
     self: BeyState, opponent: BeyState, layer: TipLayer, N: number, dt: number
   ) {
     const r = resolveContactRadius(layer, self.tiltAngle);
     const v_rel_tip = (self.spin + opponent.spin) * r;  // opposing spins add

     if (layer.freeSpin) {
       // Free-spin center: tip velocity matches opponent → relative v → 0
       // Self spin loss: only bearing drag (bearing1Friction * slip)
       const bearingSlip = self.spin - self.tipSpinVelocity;
       self.spin -= (layer.frictionFn
         ? layer.frictionFn(self.tipWear)
         : layer.friction) * bearingSlip * 0.01 * dt;

       // Opponent still loses spin to friction from tip surface
       opponent.spin -= layer.friction * N * r / opponent.I * dt;
     } else {
       // Fixed coupling: full friction both ways (SWD behavior)
       const frictionForce = layer.friction * N;
       self.spin     -= frictionForce * r / self.I * dt;      // self loses spin
       opponent.spin -= frictionForce * r / opponent.I * dt;  // opponent also loses
     }
   }
```

---

## Case 23 — Track Height as a Physics Variable: Prototype Nemesis 4D Bottom (Height 170 / 195)

> **Stock combo (Beat Lynx TH170WD):** 4D Clear Wheel: Lynx · 4D Metal Wheel: Beat · Track: TH170 · Bottom: Wide Defense

All previous tip cases changed the **contact surface geometry** — which layer touches the floor, how stiff or sticky it is. Prototype Nemesis introduces a different primitive: **the height of the entire tip body changes**, which is functionally equivalent to changing the spin track length. Every physics quantity that contains h_com or h_track is affected simultaneously.

### The Gimmick — Twist-Lock Height Change

```
   4D Bottom internal mechanism (side view, tip pointing DOWN):

   MODE 195 (tall):                       MODE 170 (short):

   ║ bey body                             ║ bey body
   ║                                      ║
   ║ ← inner column, tall                 ╔══════╗  ← base section rotated
   ║                                      ║      ║    clicks down 25 units
   ╔══════════════════╗                   ╔══════╩═══════════╗
   ║  base section    ║                   ║  base section    ║
   ║  (lower)         ║                   ║  (flush)         ║
   ║                  ║                   ║                  ║
   ╚══════════════════╝                   ╚══════════════════╝
   ─ WD-style disc ─                     ─ WD-style disc ─
   ════════════════════ floor             ════════════════════ floor

   Twist the base section:
   ├── CCW twist → base clicks into TALL position → height = 195
   └── CW twist  → base clicks into SHORT position → height = 170

   Height delta: 195 - 170 = 25 units ≈ 2.5 mm
   (in MFB system, height number ≈ height in tenths of mm above standard reference)
```

```
   Visual comparison — same WD contact disc, different stem length:

   Height 195:              Height 170:

      ║║  (tall stem)            ║  (short stem)
      ║║                         ║
      ║║                         ║
   ╔══╩╩══╗                   ╔══╩══╗
   ╚══════╝ ← WD disc         ╚═════╝ ← WD disc
   ══════════ floor            ══════ floor

   WD disc geometry is IDENTICAL in both modes.
   Only the height of the bey body above the floor changes.
```

### What h_com Controls in the Physics System

h_com (height of center of mass above floor) appears in every tilt-dependent calculation:

```
   ┌─────────────────────────────────────────────────────────────────┐
   │   PHYSICS QUANTITIES THAT DEPEND ON h_com                      │
   ├─────────────────────────────────────────────────────────────────┤
   │ 1. Tip orbit radius:   r_orbit = h_com × sin(θ)               │
   │    → ground friction torque = μ_tip × N × r_orbit              │
   │    → tilt amplification per tick ∝ r_orbit                     │
   │                                                                 │
   │ 2. Gyroscopic stiffness (Case 3):                               │
   │    Ω_p = τ / (I × ω)   — torque from gravity tilt:             │
   │    τ_gravity = m × g × h_com × sin(θ)                          │
   │    → taller bey: same tilt → more gravity torque → faster prec. │
   │                                                                 │
   │ 3. Floor-constraint torque arm (Case 9):                        │
   │    τ_floor = r_tip_to_CP × F                                    │
   │    r_tip_to_CP = h_cp_on_bey + h_track                         │
   │    → taller bey: larger r_tip_to_CP → larger torque per hit    │
   │                                                                 │
   │ 4. Contact height on opponent (Cases 10, 11):                   │
   │    AR height above floor = h_track + h_ar_above_core            │
   │    → taller bey: AR hits opponent HIGHER → upper-type geometry  │
   │                                                                 │
   │ 5. Airborne clearance (Case 14 — Q tip):                       │
   │    Jump height ∝ h_com (more height = more arc at same vz)     │
   └─────────────────────────────────────────────────────────────────┘
```

### Height 195 vs Height 170 — Side-by-Side Physics Comparison

```
   h_com_195 > h_com_170  by Δh = 2.5 mm

   Quantity                │ Height 195 (tall)          │ Height 170 (short)
   ────────────────────────┼────────────────────────────┼────────────────────────────
   r_orbit at θ=30°        │ h_195 × sin30° = 0.50h_195 │ h_170 × sin30° = 0.50h_170
   (ground friction orbit) │ LARGER → faster tilt growth │ smaller → tilt grows slower
   ────────────────────────┼────────────────────────────┼────────────────────────────
   τ_gravity at θ=30°      │ m×g×h_195×sin30° (larger)  │ m×g×h_170×sin30° (smaller)
   (wobble precession)     │ faster wobble circle        │ slower wobble circle
   ────────────────────────┼────────────────────────────┼────────────────────────────
   Burst torque arm        │ r_tip_to_AR_195 (taller)   │ r_tip_to_AR_170 (shorter)
   on self (recoil)        │ larger → more burst risk   │ smaller → harder to burst
   ────────────────────────┼────────────────────────────┼────────────────────────────
   AR contact height       │ Higher → hits opponents    │ Lower → hits opponents
   on opponent             │ above their CoM more often │ at/below CoM more often
   (Cases 10, 11)          │ → upper-type effect on opp │ → equator/lower effect
   ────────────────────────┼────────────────────────────┼────────────────────────────
   Spin decay rate         │ faster (larger r_orbit →   │ slower (smaller r_orbit →
   (ground drag)           │ more tip friction torque)  │ less tip friction torque)
   ────────────────────────┴────────────────────────────┴────────────────────────────
```

### Contact Height Geometry — Tall vs Short Opponent (extends Case 11)

```
   Prototype Nemesis (AR at height h_AR above floor) vs opponent:

   HEIGHT 195 mode:

   P.Nemesis body:      Opponent (standard height ~130):
        │
   ─────┼──────────────────────────────  AR at h_AR_195
        │                                 > opponent h_com
        │              ──────────────────  opponent CoM (~80mm)
        │
        │              ──────────────────  opponent AR
        │
   ─────┼──────────────────────────────  P.Nemesis tip (floor)

   AR hits ABOVE opponent CoM → upper-type geometry (Case 10):
   → Opponent top swings AWAY → opponent tilts outward → ring-out threat
   → P.Nemesis self-recoil at h_AR (above own CoM) → own top also swings

   HEIGHT 170 mode:

   P.Nemesis body:      Opponent (standard height):
        │
        │              ──────────────────  opponent CoM (~80mm)
   ─────┼──────────────────────────────  AR at h_AR_170
        │               < opponent h_com
        │              ──────────────────  opponent AR (lower)
        │
   ─────┼──────────────────────────────  P.Nemesis tip (floor)

   AR hits BELOW opponent CoM → lower hit (Case 10):
   → Opponent top swings TOWARD P.Nemesis (counter-strike risk, Case 7)
   → P.Nemesis must move away in the same tick to avoid the counter
```

```
   The height-mode matchup table:

   P.Nemesis mode │ vs Short opponent (TH85)  │ vs Tall opponent (TH170+)
   ───────────────┼───────────────────────────┼─────────────────────────────
   Height 195     │ AR well above short opp   │ AR at/above tall opp CoM
   (tall)         │ → might sweep over → miss │ → upper-type → destabilizes
   ───────────────┼───────────────────────────┼─────────────────────────────
   Height 170     │ AR at short opp CoM level │ AR below tall opp CoM
   (short)        │ → equator hit → push-out  │ → lower hit → counter risk
   ───────────────┴───────────────────────────┴─────────────────────────────

   Strategy:
   ├── vs tall defense/stamina beys: use Height 195 → upper-type geometry
   └── vs low attack beys: use Height 170 → safer (lower torque arm on self)
```

### Tilt Accumulation Rate — The Hidden Stamina Cost

```
   At same tilt angle θ and same spin ω, the taller mode decays faster:

   dω/dt contribution from ground friction (Case 8):
   
   τ_friction = μ_tip × N × r_orbit = μ_tip × m × g × h_com × sin(θ)

   Δ(dω/dt) = (μ_tip × m × g × sin(θ) / I) × (h_195 - h_170)
            = (μ_tip × m × g × sin(θ) / I) × 2.5mm

   At θ = 30°, sin(30°) = 0.5:
   Δ(dω/dt) = (0.5 × m × g × 0.5 / I) × 0.0025   [m in kg, g in m/s²]

   For a typical 45g bey with I ≈ 1.5×10⁻⁵ kg·m²:
   Δ(dω/dt) ≈ 0.5 × 0.045 × 9.8 × 0.5 / 1.5×10⁻⁵ × 0.0025
             ≈ 18 rad/s² extra spin decay when in 195 mode vs 170 mode

   At 60 Hz: ≈ 0.3 rad/s extra spin loss per tick from just the height difference.
   Over 100 ticks: ≈ 30 rad/s accumulated spin loss from using 195 vs 170.
   → Height 195 reaches the 40% wobble threshold noticeably sooner.
```

```
   Tilt accumulation comparison (both start at same spin, same tilt):

   spin% │ Height 170             Height 195
   ──────┼─────────────────────────────────────────────
   100%  │ minimal tilt growth    │ same (θ tiny → sin(θ) tiny → gap tiny)
    80%  │ slow decay             │ slightly faster
    60%  │ gap widens             │ measurably faster tilt growth
    40%  │ WOBBLE THRESHOLD ──────│──────── reached 10–15 ticks sooner
    20%  │ standard wobble        │ more aggressive wobble (larger r_orbit)
     0%  │ ring-out               │ ring-out
```

### The Nemesis Fusion Wheel — Three-Sided Defense Geometry

```
   Three-sided symmetry (120° per wing) — same contact frequency as Assault Blitz (Case 20):
   3 contacts per revolution at 3×ω/(2π) contacts/second

   Thick, sturdy construction:
   ├── Large wheel thickness → high structural stiffness → high restitution μ
   ├── Impact is nearly elastic → energy mostly bounced back to attacker
   ├── Less energy absorbed by the Nemesis wheel itself → preserves spin
   └── Defense-type silhouette → smooth outer surfaces → glancing normals → low torque

   Mass distribution:
   ├── Thick = more mass overall → high I (hard to tilt)
   ├── Three-sided → mass not uniformly distributed (slight 3-fold asymmetry in I)
   └── But symmetry is sufficient for practical purposes → treat as symmetric ring
```

```
   Restitution model for thick sturdy wheel:

   μ_nemesis ≈ 0.75–0.80  (structural stiffness → high elastic return)
   vs μ_fusion_defense ≈ 0.20 (rubber absorption → most energy destroyed)

   Against a rubber-type attacker:
   ├── Attacker delivers J; Nemesis returns J × 0.80 back to attacker
   ├── Attacker receives large recoil (high μ on both sides)
   └── Nemesis absorbs only 20% of energy → spin preserved

   Against a smash attacker:
   ├── High J on both sides → Nemesis recoil is high (no rubber buffer)
   ├── But Nemesis high I means Δθ = τ/(I×ω) stays small
   └── Nemesis stable; attacker absorbs its own recoil
```

### Height-Change State in the Physics System

```typescript
   interface TipHeightState {
     currentHeight: 170 | 195;     // active height mode
     hCom: number;                  // computed h_com in mm for current mode
     hTrack: number;                // effective track height (set from currentHeight)
     // hCom = baseHCom + (currentHeight === 195 ? 0 : -(195 - 170))
     // Note: 195 is the tall position, 170 is the short position
   }

   // How height affects per-tick physics:
   function resolveHCom(bey: BeyState, heightState: TipHeightState): number {
     // h_com shifts with the track height
     return bey.baseHCom + (heightState.currentHeight - 170) * 0.1; // mm to physics units
     // 195 → +2.5mm above base h_com
     // 170 → base h_com
   }

   function tickGroundFriction(bey: BeyState, heightState: TipHeightState, dt: number) {
     const h_com = resolveHCom(bey, heightState);
     const r_orbit = h_com * Math.sin(bey.tiltAngle * DEG2RAD);  // ← h_com now variable
     const frictionTorque = bey.tipFriction * bey.mass * G * r_orbit;
     bey.spin -= (frictionTorque / bey.I) * dt;
     bey.tiltAngle += (frictionTorque / (bey.I * bey.spin)) * RAD2DEG * dt;
   }

   // Contact height on opponent uses hTrack:
   function resolveContactHeightOnOpponent(
     self: BeyState, selfHeight: TipHeightState, opponent: BeyState
   ): number {
     const selfARHeight = selfHeight.hTrack + self.arHeightAboveCore;
     return selfARHeight - 0;  // opponent floor is reference
     // Then compare to opponent.hCom to determine upper/lower/equator (Case 10)
   }
```

### What This Adds to the Codebase

```
   shared/types/beybladeSystem.ts:
   └── Add TipHeightState: { currentHeight: 170|195, hCom: number, hTrack: number }
       Add heightGimmick?: { heights: number[], currentHeight: number } to TipPart
       (generic enough to handle other two-height or multi-height tips in future)

   server/physics/MechanicRegistry.ts:
   └── Register 'height_change' gimmick mechanic:
       onTick → tickGroundFriction() uses resolveHCom() from heightState
       onHit  → resolveContactHeightOnOpponent() for collision type determination

   server/rooms/schema/GameState.ts:
   └── Add trackHeight: number to Beyblade schema (synced to client)
       Client renderer uses it to scale the bey sprite height at match-start

   client/src/game/renderer/PixiRenderer.ts:
   └── Scale bey sprite vertical dimension by (trackHeight / 145)
       (145 = reference standard height in MFB system)
```

---

## Case 24 — Energy Ring as Contact-Point Override: Gravity Destroyer (Counter / Defense Mode)

> **Stock combo (Gravity Perseus AD145WD):** Clear Wheel: Perseus · Metal Wheel: Gravity · Track: AD145 · Bottom: Wide Defense

All previous cases treated the Energy Ring as a **mass contribution only** — it sits above the Fusion Wheel and adds rotational inertia at its radius. Gravity Destroyer breaks this: the Energy Ring physically **covers or exposes** the Fusion Wheel's attack protrusions, making it the effective contact surface in Defense Mode. This is a new relationship: `EnergyRing mode → FusionWheelCP override`.

### What "Covering the Eyes" Means Geometrically

```
   Top-down view of Gravity Fusion Wheel:

   Gravity wheel (bare, no Energy Ring):

        ┌─────────────────────────────────┐
       ╱  JAGGED               JAGGED    ╲
      │  ┌──┐    ←POCKET→    ┌──┐         │
      │  │  │  [curved gap]  │  │  "eyes" │
      │  └──┘                └──┘         │
      │         ┌──┐                      │
      │         │  │  JAGGED              │
      │         └──┘                      │
       ╲                                 ╱
        └─────────────────────────────────┘

   Three jagged metal protrusions at 0°, 120°, 240°.
   Three curved pockets between them for Energy Ring to seat in.
   The "eyes" are the openings/gaps exposing the jagged faces outward.
```

```
   DEFENSE MODE (Destroyer long helmet protrusions over the "eyes"):

        ┌─────────────────────────────────┐
       ╱  [HELMET]              [HELMET]  ╲
      │  ╔══════╗            ╔══════╗      │
      │  ║      ║  ←POCKET   ║      ║      │  ← Energy Ring plastic covers
      │  ╚══════╝            ╚══════╝      │    jagged Gravity protrusions
      │         ╔══════╗                   │
      │         ║      ║  [HELMET]         │
      │         ╚══════╝                   │
       ╲                                  ╱
        └─────────────────────────────────┘

   Effective contact surface = Energy Ring plastic (smooth, blunt)
   Gravity's metal jagged faces = hidden behind plastic → NOT the collision interface

   COUNTER MODE (Destroyer short protrusions, eyes EXPOSED):

        ┌─────────────────────────────────┐
       ╱  [short] JAGGED      [short]     ╲
      │  [·]   ┌──┐         [·]  ┌──┐     │
      │        │  │ EXPOSED       │  │     │  ← jagged metal faces OPEN
      │        └──┘               └──┘     │    Energy Ring out of the way
      │  [·]         ┌──┐                  │
      │              │  │  EXPOSED          │
      │              └──┘                   │
       ╲                                   ╱
        └──────────────────────────────────┘

   Effective contact surface = Gravity Fusion Wheel jagged metal (sharp, high restitution)
```

### The Two Contact Interfaces — Material Physics Comparison

```
   DEFENSE MODE contact (plastic over metal):

   Opponent CP → Energy Ring plastic surface:
   ├── Material: plastic (semi-rigid, slight flex)
   ├── Restitution μ ≈ 0.45–0.55  (less elastic than bare metal)
   ├── Energy partial absorption: plastic deforms slightly → 5–15% absorbed
   ├── Contact normal: rounded/blunt helmet surface → TANGENTIAL DEFLECTION
   │   (oblique angle means much of J goes sideways, not inward)
   └── Net: low recoil to both beys, low torque transfer, minimal tilt change

   vs Fusion rubber (Case 21): plastic is NOT viscoelastic — it is just lower μ
   than metal. It doesn't destroy energy as heat the way rubber does.
   Think of it as: metal μ 0.75 → plastic μ 0.50 (a quantitative change, not
   a qualitative mechanism change like rubber's viscous dissipation)

   COUNTER MODE contact (bare metal jagged):

   Opponent CP → Gravity jagged metal face:
   ├── Material: metal (highly elastic)
   ├── Restitution μ ≈ 0.80–0.85  (high elastic return, like Case 20 Blitz)
   ├── Near-zero absorption: almost all KE returned as recoil
   ├── Contact normal: jagged face angle → perpendicular component high
   │   → large torque transfer → tilt change on opponent
   └── Net: high recoil to both beys, high J delivered, strong smash attack
```

```
   Recoil comparison (same incoming velocity v_rel):

   Defense Mode:   J_defense   = J_max × 0.50   (plastic surface, lower μ)
   Counter Mode:   J_counter   = J_max × 0.82   (jagged metal, high μ)

   Recoil on Gravity Destroyer itself:
   Defense Mode:   recoil = J_defense × n̂  → small → self-stable
   Counter Mode:   recoil = J_counter × n̂  → large → self-recoil risk

   Recoil on opponent:
   Defense Mode:   push = J_defense  → weak push, hard to ring-out opponent
   Counter Mode:   push = J_counter  → strong push, ring-out threat

   The mode choice is a self-stability vs opponent-damage tradeoff:
   Defense Mode: safer, harder to ring-out or burst yourself, but less offensive power
   Counter Mode: dangerous to both, but delivers real ring-out threat to opponent
```

### Dual Spin — Symmetric CP Geometry (No Directional Bias)

```
   Standard Fusion Wheel (directional):

   CW spin: attack protrusions lead edge (glancing → efficient attack)
   CCW spin: attack protrusions trail edge (wall-face → inefficient, high self-recoil)
   → directional pegs prevent wrong-direction launch

   Gravity (dual spin, no directional pegs):

   Three curved pockets are ROTATIONALLY SYMMETRIC around the 3-fold axis.
   Both jagged protrusions and helmet covers are symmetric:
   ├── At 0° protrusion face angle: same hit geometry CW or CCW
   ├── No "leading" or "trailing" face distinction
   └── Curved pocket shape is symmetric under 180° rotation

   Physics implication:
   ├── Same μ, same friction, same contact normal for CW or CCW
   ├── Same J formula applies regardless of spin direction
   └── No "spin direction recoil multiplier" needed in the collision resolver
```

```
   Why some wheels can't be dual spin:

   Directional wheel example (L-Drago style):
   ├── One face: gradual ramp → glancing contact → efficient transfer
   └── Other face: steep wall → hard stop → high self-recoil

   In CW: steep wall faces forward → wrong direction → very high self-recoil
   In CCW: ramp faces forward → correct direction → efficient

   The directional pegs on the launcher prevent wrong-direction insertion.

   Gravity avoids this by making both attack faces equivalent:
   ├── Jagged faces are symmetric → same contact profile from either direction
   ├── Curved pockets seat Destroyer symmetrically → no rotational preference
   └── Result: legal and functional in both spin directions
```

### Mode as Pre-Match Selection (vs Mid-Battle Gimmicks)

```
   Mode selection timing comparison:

   ┌──────────────────┬─────────────────────────────────────────────────────┐
   │ Beyblade         │ When mode changes                                   │
   ├──────────────────┼─────────────────────────────────────────────────────┤
   │ Gravity Destroyer│ PRE-MATCH only (physical rotation of Energy Ring)   │
   │                  │ Mode is fixed for entire match                      │
   ├──────────────────┼─────────────────────────────────────────────────────┤
   │ Kreis (Case 16)  │ MID-BATTLE (±60° slide triggered by impacts)        │
   │                  │ Continuously absorbs/releases energy                │
   ├──────────────────┼─────────────────────────────────────────────────────┤
   │ Diablo UBM(Case17│ AUTOMATIC during match (centrifugal detents drop)   │
   │                  │ Irreversible once triggered                         │
   ├──────────────────┼─────────────────────────────────────────────────────┤
   │ Jade (Case 19)   │ PRE-MATCH (ball position locked in defense mode)    │
   │                  │ In attack mode: automatic mid-battle ball migration │
   ├──────────────────┼─────────────────────────────────────────────────────┤
   │ P.Nemesis(Case23)│ PRE-MATCH (twist to 170 or 195 height)             │
   └──────────────────┴─────────────────────────────────────────────────────┘

   Pre-match modes → only need to be stored in initial bey config.
   No mid-battle state machine needed for Gravity Destroyer.
   The mode is just: which CP profile is active at match start.
```

### Energy Ring CP Override — Data Model

```typescript
   // New field on EnergyRingPart (or equivalent):
   interface EnergyRingMode {
     id: string;                    // 'defense' | 'counter'
     label: string;
     cpOverride?: CPOverride;       // if set: overrides the FusionWheel's CP profile
   }

   interface CPOverride {
     // When Energy Ring is in this mode, use THESE CP values instead of the wheel's
     restitution: number;           // μ (plastic surface in defense: ~0.50)
     friction: number;              // tangential friction (blunt surface: ~0.30)
     contactAngle: number;          // degrees from tangent (blunt: ~20°, jagged: ~60°)
     material: 'plastic' | 'metal' | 'rubber';
     overridesRadius?: number;      // effective r_cp (if shape changes the lever arm)
   }

   // In BeybladeSystem: read activeMode to pick the active CP profile
   function resolveEffectiveCP(
     fusionWheel: FusionWheelPart,
     energyRing: EnergyRingPart,
     activeMode: string
   ): EffectiveCP {
     const modeConfig = energyRing.modes?.find(m => m.id === activeMode);
     if (modeConfig?.cpOverride) {
       // Energy Ring covers/exposes Fusion Wheel CPs → use override
       return {
         restitution: modeConfig.cpOverride.restitution,
         friction:    modeConfig.cpOverride.friction,
         r_cp:        modeConfig.cpOverride.overridesRadius ?? fusionWheel.r_cp,
         material:    modeConfig.cpOverride.material,
       };
     }
     // No override (or mode has exposed wheel) → use FusionWheel's own CP
     return {
       restitution: fusionWheel.restitution,
       friction:    fusionWheel.friction,
       r_cp:        fusionWheel.r_cp,
       material:    'metal',
     };
   }
```

```
   Gravity Destroyer mode configs:

   Defense Mode:
   cpOverride = {
     restitution:   0.50,    // plastic helmet surface (lower than bare metal)
     friction:      0.30,    // smooth plastic (moderate)
     contactAngle:  15°,     // blunt helmet curve → glancing normals
     material:      'plastic'
   }

   Counter Mode:
   cpOverride = null         // no override — FusionWheel's own jagged metal CP applies
   → fusionWheel.restitution ≈ 0.82
   → fusionWheel.friction    ≈ 0.25
   → fusionWheel.contactAngle ≈ 55°   (jagged face → steep normal → high torque)
   → material = 'metal'
```

### What This Adds to the Codebase

```
   shared/types/beybladeSystem.ts:
   └── Add modes?: EnergyRingMode[] to EnergyRingPart
       Add activeModeId?: string to BeybladeSystem (set pre-match, persists through)
       Add CPOverride interface
       Add resolveEffectiveCP() utility function

   server/rooms/BattleRoom.ts:
   └── In resolveCollision(): call resolveEffectiveCP(wheel, ring, bey.activeModeId)
       to get the active μ and friction before computing J
       (replaces direct access to fusionWheel.restitution)

   server/rooms/schema/GameState.ts:
   └── No new sync fields needed (mode is fixed at match start, not mid-battle)
       activeModeId is set on bey creation from player's config and never changes

   client/src/pages/admin/2d/BeybladeSystemPage.tsx (or equivalent editor):
   └── When EnergyRing has modes[]: show mode picker dropdown at system level
       Selected mode stored in BeybladeSystem.activeModeId
```

---

## Case 25 — Energy Ring Coverage Spectrum: Destroyer Attack / Defense / Stamina

> **Stock combo (Gravity Perseus AD145WD):** Clear Wheel: Perseus · Metal Wheel: Gravity · Track: AD145 · Bottom: Wide Defense

The three Destroyer variants form a **continuous coverage spectrum** over the Gravity Fusion Wheel's jagged protrusions. Coverage percentage is the master variable: it determines the effective contact material (plastic or metal), the effective restitution coefficient μ, and the I contribution from the Energy Ring. This generalises the binary mode-switch of Case 24 into a design variable with three discrete points.

### The Coverage Spectrum — Top View

```
   Gravity wheel (bare):   6 positions — 3 jagged eyes at 0°/120°/240°
                           3 pocket gaps at 60°/180°/300°

   Destroyer Attack         Destroyer Defense        Destroyer Stamina
   (6 SMALL protrusions)   (3 large + 3 small)      (6 LARGE protrusions)

      [·] [·]                  [▓▓] [·]                 [▓▓] [▓▓]
   [·]   [·]               [·]   [▓▓]               [▓▓]    [▓▓]
      [·] [·]                  [▓▓] [·]                 [▓▓] [▓▓]

   Coverage ≈ 10–15%        Coverage ≈ 40–60%        Coverage ≈ 80–90%
   (mode-independent)       (mode-DEPENDENT)          (mode-independent)

   Small nubs don't          Large protrusions         All 6 positions filled
   cover the eyes in         cover 3 eyes in           with large protrusions
   either mode              Defense Mode;              → eyes blocked both modes
                            expose them in Counter
```

```
   Mode-dependence matrix:

   ┌───────────────────┬──────────────────────────┬──────────────────────┐
   │ Variant           │ Defense Mode rotation     │ Counter Mode rotation │
   ├───────────────────┼──────────────────────────┼──────────────────────┤
   │ Destroyer Attack  │ low coverage (small nubs) │ low coverage (same)  │
   │                   │ Gravity exposed           │ Gravity exposed      │
   │                   │ → mode choice irrelevant  │                      │
   ├───────────────────┼──────────────────────────┼──────────────────────┤
   │ Destroyer Defense │ HIGH coverage (helmets)   │ low coverage (exposed│
   │                   │ plastic CP override       │ jagged metal CP)     │
   │                   │ → mode MATTERS            │                      │
   ├───────────────────┼──────────────────────────┼──────────────────────┤
   │ Destroyer Stamina │ high coverage (all large) │ high coverage (same) │
   │                   │ plastic CP override both  │ → mode irrelevant    │
   └───────────────────┴──────────────────────────┴──────────────────────┘
```

### Effective Physics Per Variant

```
   DESTROYER ATTACK (coverage ≈ 15%):

   Contact interface: Gravity jagged metal (always exposed)
   μ ≈ 0.80–0.85  (high elastic return, metal-to-metal)
   friction ≈ 0.25 (metal sliding contact)
   contactAngle ≈ 55° (steep jagged face → large τ_transfer)

   Consequence:
   ├── High J delivered to opponent → ring-out threat
   ├── High J recoil on self → own tilt increases per hit
   ├── Self-recoil can cause Gravity to ring itself out vs heavy opponents
   └── Small protrusion mass → lowest I of the three variants
       → least gyroscopic stiffness → most agile but most vulnerable

   DESTROYER DEFENSE (coverage mode-dependent):
   → See Case 24. Defense Mode: μ 0.50 plastic. Counter Mode: μ 0.82 metal.

   DESTROYER STAMINA (coverage ≈ 85%):

   Contact interface: Energy Ring plastic (both modes)
   μ ≈ 0.45–0.50  (plastic, low elastic return)
   friction ≈ 0.30 (smooth plastic surface)
   contactAngle ≈ 15° (rounded helmet curve → glancing normals)

   Consequence:
   ├── Low J to opponent → reduced ring-out power
   ├── Low J recoil on self → own tilt barely changes → stable
   ├── Large protrusion mass → highest I of the three variants
   │   → highest gyroscopic stiffness → hardest to tilt/burst
   └── Best choice against 4D / Synchrome (heavy) opponents
```

### Energy Ring Mass and I — The Weight Compensation Mechanism

```
   4D system: Fusion Wheel + 4D Frame + 4D Bottom → much higher total mass than MFB
   Synchrome:  two stacked beyblade systems → roughly 2× mass of standard
   Standard Gravity: lighter, disadvantaged in raw I against these opponents

   Energy Ring I contribution:  ΔI = m_ring × r_ring²

   Estimates (r_ring ≈ 20mm = 0.020m):

   Destroyer Attack  (small protrusions, ~5g):
   ΔI_attack  = 0.005 × 0.020² = 2.0×10⁻⁶ kg·m²

   Destroyer Defense (~8g):
   ΔI_defense = 0.008 × 0.020² = 3.2×10⁻⁶ kg·m²

   Destroyer Stamina (~11g, large protrusions × 6):
   ΔI_stamina = 0.011 × 0.020² = 4.4×10⁻⁶ kg·m²

   Total bey I ≈ 1.5×10⁻⁵ kg·m²  (all sources combined)
   Stamina vs Attack ring contribution difference: 2.4×10⁻⁶ / 1.5×10⁻⁵ ≈ +16% I

   16% more I means:
   ├── 16% more gyroscopic stiffness (harder to tilt per hit)
   ├── 16% slower spin decay rate (same friction torque, more inertia to resist it)
   └── 16% slower precession rate (wobble circle slower at same tilt)

   Against a 4D opponent (Fusion Wheel alone ≈ 35g, 4D Frame ≈ 10g):
   4D bey I ≈ 2.5×10⁻⁵ kg·m²  (≈ 1.67× a standard bey)
   Destroyer Stamina brings Gravity closer to this range, not equal, but competitive.
```

```
   Impact energy partition (Case 12 impulse formula, mass-matched vs mismatched):

   Standard J = -(1+μ) × v_rel / (1/m_A + 1/m_B + ...)

   Heavy opponent (m_B >> m_A):
   → 1/m_B ≈ 0 → J ≈ -(1+μ) × v_rel / (1/m_A + r²/I_A)
   → The entire impulse lands on m_A (lighter bey)!
   → Lighter Gravity with Destroyer Attack: very high self-recoil → ring-out threat to SELF

   With Destroyer Stamina (lower μ AND higher m_ring → slightly higher m_A):
   → Lower μ: J is smaller (less elastic return)
   → Higher m_A: slightly better mass ratio
   → Both effects reduce self-recoil magnitude
   → Net: Gravity can survive the impact rather than bouncing itself out
```

### Coverage Fraction as a Data Field

```typescript
   // Generalise the Energy Ring model:
   interface EnergyRingVariant {
     id: string;
     label: string;
     mass: number;                  // g: affects I
     massRadius: number;            // mm: r_ring for I computation
     coverageFraction: number;      // 0.0–1.0: fraction of FusionWheel eyes covered
     // When coverageFraction > 0.5: cpOverride applies (plastic dominates contact)
     // When coverageFraction < 0.3: no meaningful override (metal exposed)
     // 0.3–0.5: partial coverage → blended effective μ
     cpOverride?: CPOverride;       // active when coverageFraction sufficient
   }

   const DESTROYER_ATTACK: EnergyRingVariant = {
     id: 'destroyer_attack', label: 'Destroyer Attack',
     mass: 5, massRadius: 20,
     coverageFraction: 0.15,        // eyes exposed → no override
     cpOverride: undefined,
   };

   const DESTROYER_DEFENSE_MODE_DEFENSE: EnergyRingVariant = {
     id: 'destroyer_defense_defense', label: 'Destroyer (Defense Mode)',
     mass: 8, massRadius: 20,
     coverageFraction: 0.55,
     cpOverride: { restitution: 0.50, friction: 0.30, contactAngle: 15, material: 'plastic' },
   };

   const DESTROYER_STAMINA: EnergyRingVariant = {
     id: 'destroyer_stamina', label: 'Destroyer Stamina',
     mass: 11, massRadius: 20,
     coverageFraction: 0.85,        // both modes covered
     cpOverride: { restitution: 0.47, friction: 0.28, contactAngle: 12, material: 'plastic' },
   };

   // Effective μ based on coverage fraction:
   function blendedRestitution(
     variant: EnergyRingVariant, wheelRestitution: number
   ): number {
     if (variant.coverageFraction >= 0.5 && variant.cpOverride) {
       return variant.cpOverride.restitution;
     } else if (variant.coverageFraction < 0.3) {
       return wheelRestitution;  // metal exposed → use wheel's μ
     }
     // Partial: linear blend
     const t = (variant.coverageFraction - 0.3) / 0.2;
     return lerp(wheelRestitution, variant.cpOverride!.restitution, t);
   }
```

### The Three-Way Tradeoff

```
   ┌──────────────────┬────────────────┬────────────────┬──────────────────┐
   │ Attribute        │ Destroyer      │ Destroyer      │ Destroyer Stamina│
   │                  │ Attack         │ Defense        │                  │
   ├──────────────────┼────────────────┼────────────────┼──────────────────┤
   │ Coverage         │ 15% (both)     │ 55% / 15%      │ 85% (both)       │
   │                  │ always exposed │ mode-dependent │ always covered   │
   ├──────────────────┼────────────────┼────────────────┼──────────────────┤
   │ Effective μ      │ 0.82 (metal)   │ 0.50 / 0.82    │ 0.47 (plastic)   │
   ├──────────────────┼────────────────┼────────────────┼──────────────────┤
   │ Recoil on self   │ HIGH           │ LOW / HIGH     │ LOW              │
   ├──────────────────┼────────────────┼────────────────┼──────────────────┤
   │ Attack power     │ HIGH           │ MED / HIGH     │ LOW              │
   ├──────────────────┼────────────────┼────────────────┼──────────────────┤
   │ I contribution   │ lowest (+2.0e⁻⁶│ mid (+3.2e⁻⁶)  │ highest (+4.4e⁻⁶)│
   ├──────────────────┼────────────────┼────────────────┼──────────────────┤
   │ Best against     │ Standard beys  │ Flexible       │ 4D / Synchrome   │
   │                  │ (ring-out)     │ multi-match    │ (mass matchup)   │
   └──────────────────┴────────────────┴────────────────┴──────────────────┘
```

---

## Case 26 — Spin Track as Active Contact Surface: Rubber 145 (R145) Wing Scraping and Sandwich Geometry

> **Stock combo (Rock Giraffe R145WB):** Clear Wheel: Giraffe · Metal Wheel: Rock · Track: R145 · Bottom: Wide Ball

In every prior case, the Spin Track is a **passive height spacer** — a hollow cylinder that sets how high the bey's body sits above the floor, contributing inertia but no contact geometry. R145 breaks this: its three rubber wings extend outward at track height and interact with both the stadium floor (when tilted) and attacking opponents (from below). This introduces two new collision geometries: **floor scraping** and **the sandwich**.

### Track Wing Geometry

```
   R145 cross-section (side view, tip pointing DOWN):

        ║  Energy Ring / Fusion Wheel  (height H_FW above floor)
        ║
   ════╗║╔════ ← R145 wings (rubber, 3 wings at 120°, height h_145 above floor)
       ║║║
       ║║║  ← track hub (narrow, small placement)
       ║║║
        ║  tip
   ═══════════ floor

   Wing geometry:
   ├── Wing height above floor: h_145  (= tip height + track section height ≈ 14.5mm)
   ├── Wing radius from spin axis: r_wing  (wide, extends significantly outward)
   ├── Wing material: hard rubber  (higher μ than plastic, partial viscoelastic absorption)
   └── Gap between FW and R145: Δh_gap = H_FW - h_145

   Top view:
           ┌─────┐
          ╱ WING  ╲        three wings at 0°, 120°, 240°
         ╱         ╲
        │     ●     │  ← spin axis
         ╲         ╱
          ╲ WING  ╱
           └─────┘
```

### Floor Scraping — Tilt-Dependent Wing Contact

```
   When the bey tilts by angle θ, the lowest wing tip drops:

   Wing tip height on downhill side = h_145 - r_wing × sin(θ)

   Scraping begins when:   h_145 - r_wing × sin(θ) ≤ 0
   → θ_scrape = arcsin(h_145 / r_wing)

   For R145: h_145 ≈ 14.5mm, r_wing ≈ 15–18mm (wide wings relative to hub)
   θ_scrape = arcsin(14.5 / 16) ≈ arcsin(0.91) ≈ 65°

   At large tilt (which happens at low spin, Case 6 Step 6), θ > 65°
   → wing rubber drags on floor → massive friction torque
```

```
   Scraping friction vs normal tip orbit friction (comparative):

   Normal tip orbit (Case 8):
   τ_orbit = μ_tip × N × r_orbit
           = μ_tip × m×g × h_com × sin(θ)
           r_orbit = 14.5mm × sin(30°) ≈ 7.3mm  (at θ = 30°)

   R145 wing floor scraping (θ > θ_scrape):
   τ_scrape = μ_rubber × N_wing × r_wing
            N_wing ≈ m×g × (r_wing × sin(θ) - h_145) / h_com  (wing pressing into floor)
   └── r_wing ≈ 16mm (vs r_orbit ≈ 7.3mm at same θ)
   └── μ_rubber ≈ 0.75 (vs μ_tip ≈ 0.5 for flat/WD type)
   └── Contact area: large (rubber wing flat against floor, not a point)

   τ_scrape >> τ_orbit  by a factor of 3–5×
   → Spin decay rate spikes when wings contact floor
   → This is why R145 "loses Stamina" — scraping torque is catastrophic
```

```
   Scraping threshold diagram:

   spin%  θ_max reached │ R145 floor contact
   ──────────────────────┼──────────────────────────────────────────
   100%   small wobble   │ θ < 65° → no scraping → normal decay
    80%   moderate       │ θ occasionally > 65° → sporadic scraping
    60%   significant    │ θ regularly > 65° → continuous scraping
    40%   WOBBLE ZONE    │ θ can hit 80°+ → permanent scraping
    20%   wild wobble    │ wing on floor most of the time → rapid death
```

### The Sandwich Failure Mode — Dual Simultaneous Contact

```
   R145 wing height: h_145    (below)
   Fusion Wheel height: H_FW  (above)
   Gap between them: Δh_gap = H_FW - h_145

   An attacker's Fusion Wheel at height h_att, where h_145 < h_att < H_FW:
   → Attacker is in the GAP — between R145 and the FW

   Top contact: attacker AR presses against defender's Fusion Wheel (from below)
   Bottom contact: attacker AR presses against defender's R145 wings (from above)

   ┌──────────────────────────────────────────────────────────────┐
   │  Defender Fusion Wheel (bottom face)  H_FW  ← contact top  │
   │  ─────────────────────────────────────────────────────────  │
   │           ATTACKER'S FUSION WHEEL in the GAP                │
   │  ─────────────────────────────────────────────────────────  │
   │  Defender R145 wings (top face)      h_145  ← contact bot  │
   └──────────────────────────────────────────────────────────────┘

   Two simultaneous friction contacts:
   ├── Top contact (FW face): friction opposes attacker's spin direction
   └── Bottom contact (R145 rubber): friction opposes attacker's spin direction

   BOTH contacts brake the attacker's spin simultaneously.
   This is why sandwich = "recoil and spin reduction":
   ├── Attacker spin loss: τ_top + τ_bottom = (μ_FW + μ_rubber) × N × r_att
   └── Defender also takes a hit (reaction force), but rubber R145 absorbs some
```

```
   Standard single-contact spin steal (Case 22):
   Δω_att = -μ × N × r / I_att         (one contact)

   Sandwich dual-contact spin steal:
   Δω_att = -(μ_FW + μ_rubber) × N × r / I_att   (two contacts simultaneously)
           ≈ -(0.75 + 0.75) × N × r / I_att
           = -1.5 × (single contact rate)

   Attacker loses spin at 1.5× the normal rate for every tick in the sandwich.
   If the attacker is a stamina type relying on spin: this can end the match quickly.
```

### Deflection Geometry — Rubber Wing vs Lower Attacker

```
   Attacker approaches from below R145 wing height (h_att < h_145):
   Attacker's AR contacts the UNDERSIDE of the R145 wing.

   Wing underside contact normal geometry:

   The wing underside curves upward toward the hub (like a swept blade):
   ├── Contact normal has UPWARD component (wing deflects attacker DOWN)
   └── Horizontal component pushes attacker sideways

   Force on attacker from wing contact:
   F_att = (F_horiz, 0, -F_vert)   (horizontal push + downward push)

   Downward force on attacker:
   ├── If attacker CoM is at h_com_att < h_145: force is below attacker's CoM
   │   → lower hit on attacker → attacker's TOP swings toward defender (Case 7!)
   │   → attacker may counter-strike defender next tick
   └── But rubber wing absorbs most of the impulse → counter-strike weakened

   Force on defender (reaction to attacker):
   ├── Wing receives upward + inward force
   ├── Upward force on wing → torque at h_145 below defender's FW level
   └── Torque direction depends on which wing is hit (rotational position)
       → precession adjustment on defender (usually small due to rubber absorption)
```

### Comparison — R145 vs Other High-Defense Tracks (GB145, BD145, 230)

```
   ┌────────────┬──────────────────────────────────────────────────────────┐
   │ Track      │ Defense mechanism                                        │
   ├────────────┼──────────────────────────────────────────────────────────┤
   │ R145       │ Rubber wings absorb attack → BUT wide wings scrape floor │
   │            │ Sandwich failure mode → self spin loss at high tilt      │
   │            │ NET: defense potential undercut by stamina penalty        │
   ├────────────┼──────────────────────────────────────────────────────────┤
   │ GB145      │ Gyro Ball — free-spinning ball bearing at track level    │
   │            │ Ball contacts opponent → near-zero spin coupling         │
   │            │ No scraping risk (ball is below the track diameter)      │
   ├────────────┼──────────────────────────────────────────────────────────┤
   │ BD145      │ Ball Defense — similar to GB145, wider ball contact      │
   │            │ Harder to sink AR between track and FW (tighter gap)    │
   ├────────────┼──────────────────────────────────────────────────────────┤
   │ 230        │ Very tall track (23mm height) — most attackers can't     │
   │            │ reach the Fusion Wheel → misses entirely or hits track   │
   │            │ Gap issue: attacker hits 230 track body (no wings)       │
   └────────────┴──────────────────────────────────────────────────────────┘

   R145 is outclassed because:
   1. Sandwich failure mode is a unique self-damage risk not present in GB/BD
   2. Scraping penalty exceeds the defense benefit in any real match scenario
   3. Wide wing radius means θ_scrape is reached at moderate tilt (65°) that
      occurs naturally in late-match wobble — unavoidable performance cliff
```

### Track Wing Contact Zone — Data Model

```typescript
   // Extend TrackPart to include active wing geometry:
   interface TrackWing {
     count: number;              // number of wings (R145: 3)
     radius: number;             // mm: wing tip radius from spin axis
     heightAboveFloor: number;   // mm: wing position above floor (= track height)
     material: 'plastic' | 'rubber' | 'metal';
     wingFriction: number;       // μ for wing contact (R145 hard rubber: ~0.70)
     wingRestitution: number;    // μ bounce (R145: ~0.35, hard rubber partial absorption)
     arcDegrees: number;         // how many degrees each wing spans (R145: ~80°)
   }

   interface TrackPart (extended):
     height: number;             // standard track height (R145: 145 → 14.5mm)
     wings?: TrackWing;          // if present: track has active collision geometry

   // Per-tick scraping check:
   function checkWingScraping(bey: BeyState, track: TrackPart, dt: number) {
     if (!track.wings) return;
     const w = track.wings;
     const sinTilt = Math.sin(bey.tiltAngle * DEG2RAD);
     const wingClearance = w.heightAboveFloor - w.radius * sinTilt;

     if (wingClearance <= 0) {
       // Wing is scraping the floor
       const N_wing = bey.mass * G * (-wingClearance / bey.h_com);  // pressing force
       const tau_scrape = w.wingFriction * N_wing * w.radius;
       bey.spin -= (tau_scrape / bey.I) * dt;  // catastrophic spin loss
       bey.tiltAngle += (tau_scrape / (bey.I * bey.spin)) * RAD2DEG * dt;
     }
   }

   // Sandwich detection (per collision):
   function detectSandwich(
     defender: BeyState, defTrack: TrackPart, attackerARHeight: number
   ): boolean {
     if (!defTrack.wings) return false;
     const gapLow  = defTrack.wings.heightAboveFloor;
     const gapHigh = defender.fusionWheelHeight;   // FW bottom face height
     return attackerARHeight > gapLow && attackerARHeight < gapHigh;
   }

   function resolveSandwich(
     attacker: BeyState, defender: BeyState, defTrack: TrackPart, N: number, dt: number
   ) {
     const w = defTrack.wings!;
     // Two simultaneous friction contacts on attacker:
     const tau_top    = defender.fusionWheelFriction * N * attacker.r_ar / attacker.I;
     const tau_bottom = w.wingFriction               * N * attacker.r_ar / attacker.I;
     attacker.spin -= (tau_top + tau_bottom) * dt;   // 1.5× normal spin steal rate
     // Defender absorbs reaction via rubber wing (partial, restitution-weighted):
     defender.spin -= tau_bottom * w.wingRestitution * 0.3 * dt;
   }
```

---

## Case 27 — Plastic Spherical Tips: Ball vs Wide Ball and the Radius–Movement Tradeoff

Case 19 (RB — Rubber Ball) introduced the spherical contact geometry where r_contact = r_sphere × sin(θ). WB extends that model to a **plastic sphere at larger radius** — no rubber wear model, no viscoelastic absorption — and shows that sphere radius is the decisive variable governing how much lateral movement the bey generates during wobble.

### The Sphere Radius Spectrum

```
   Ball family (all spherical, plastic unless noted), ordered by r_sphere:

   B (Ball):           r_sphere_B  ≈ 4mm    (small, precise point)
   WB (Wide Ball):     r_sphere_WB ≈ 8mm    (wide, stable)
   RB (Rubber Ball):   r_sphere_RB ≈ 8–10mm (wide + rubber material, Case 19)

   Contact radius at tilt θ:
   r_contact = r_sphere × sin(θ)

   At θ = 30°:
   B:   r_contact ≈ 4 × 0.50 = 2.0 mm
   WB:  r_contact ≈ 8 × 0.50 = 4.0 mm  (2× B)
   RB:  r_contact ≈ 9 × 0.50 = 4.5 mm  (similar to WB, rubber adds friction)
```

### Movement vs Stability — How Sphere Radius Drives Both

```
   Ground friction torque (per tick):
   τ = μ_tip × N × r_contact = μ_tip × m×g × r_sphere × sin(θ)

   WB at θ = 30°:    τ_WB = μ × m×g × 8mm × 0.5 = μ × m×g × 4mm
   B  at θ = 30°:    τ_B  = μ × m×g × 4mm × 0.5 = μ × m×g × 2mm

   τ_WB = 2 × τ_B  at the same tilt angle

   This torque does TWO things:
   ├── DRIVES PRECESSION: Δφ = τ_perp / (I × ω) → wider precession circle
   │   → WB wobbles in a wider arc across the stadium (the "more movement")
   └── DRIVES TILT GROWTH: Δθ += τ / (I × ω) per tick
       → WB's tilt grows 2× as fast as B for same spin, same θ
       → WB reaches the 40% wobble threshold sooner
```

```
   The paradox — WB has "better defense" but "more movement":

   BETTER DEFENSE (vs ring-out from hits):
   A hit applies linear impulse J → bey slides.
   Friction resists slide: F_resist = μ × N × r_contact
   At any tilt θ: WB has larger r_contact → stronger floor grip → resists sliding more
   → Attacker needs a larger J to move WB the same distance as B
   → WB is harder to push out of the arena for the same attack power

   MORE MOVEMENT (natural wandering between hits):
   Between hits, ground friction torque drives precession → bey wanders.
   Larger r_contact (WB) → more wandering torque → bey covers more arena area
   → WB naturally drifts more between hits
   → Against an Attack type: WB drifts INTO the attacker's path more often
   → More likely to get hit → increases KO risk from the FREQUENCY of contact

   Resolution: WB survives each individual hit BETTER but gets hit MORE OFTEN.
```

```
   Stability diagram (tilt vs time, WB vs B at same conditions):

   θ ↑
     │           B (small sphere)         WB (wide sphere)
     │  ────────────────────               ═══════════════════
     │  slow tilt growth                   fast tilt growth
     │                                     but "teeters" — sphere
     │           ← 40% threshold ──────────────────────────────
     │                  B hits threshold   WB hits threshold
     │                  later              earlier
     │                  B wobbles smaller  WB wobbles WIDER
     └─────────────────────────────────────────────────► time
```

### "Teeter Heavily Without Toppling" — Continuous Contact Mechanism

```
   Sharp tip (S) at high tilt:
   ├── Single spike contact — when wobble becomes extreme, the spike can
   │   momentarily leave the floor as the bey rocks (tip hops)
   ├── Hop → no floor normal force → gyroscopic correction stops
   └── Next landing on spike: impulse → burst candidate or ring-out

   Wide Ball at high tilt (θ = 70°):
   ├── r_contact = 8mm × sin(70°) = 7.5mm → large contact area on sphere surface
   ├── Sphere always maintains ground contact (no hopping — sphere is tangent to floor)
   ├── Even at extreme tilt, there's always a point on the sphere touching floor
   └── Normal force remains continuous → gyroscopic correction never fully stops
       → Bey teeters dramatically but doesn't topple

   This is the distinguishing property: CONTINUOUS CONTACT at all tilt angles.
   Ball(B) also has this, just at a smaller orbit radius.
   Sharp tip LOSES continuous contact at high tilt → WB/B are more stable than S at low spin.
```

### WB vs RB — Same Geometry, Different Material

```
   ┌──────────────┬────────────────────────────────────────────┐
   │ Property     │ WB (plastic)             │ RB (rubber)     │
   ├──────────────┼──────────────────────────┼─────────────────┤
   │ r_sphere     │ ≈ 8mm                    │ ≈ 9mm           │
   ├──────────────┼──────────────────────────┼─────────────────┤
   │ μ_tip        │ 0.50 (plastic)           │ 0.85 (rubber)   │
   ├──────────────┼──────────────────────────┼─────────────────┤
   │ Restitution  │ 0.65 (elastic plastic)   │ 0.25 (absorbs)  │
   ├──────────────┼──────────────────────────┼─────────────────┤
   │ Wear model   │ none (plastic durable)   │ yes (sphere→flat│
   │              │                          │ from Case 19)   │
   ├──────────────┼──────────────────────────┼─────────────────┤
   │ Friction     │ μ × m×g × 8 × sin(θ)    │ μ × m×g × 9 ×  │
   │ torque       │ = moderate movement      │ sin(θ) = high   │
   │              │                          │ movement + grip │
   ├──────────────┼──────────────────────────┼─────────────────┤
   │ Stamina      │ better (lower μ)         │ worse (high μ)  │
   │              │ decays slower at any θ   │ decays faster   │
   ├──────────────┼──────────────────────────┼─────────────────┤
   │ Defense      │ good (floor grip)        │ better (higher  │
   │              │                          │ μ = harder grip)│
   └──────────────┴──────────────────────────┴─────────────────┘

   WB occupies the middle of the Stamina/Defense space:
   better stamina than RB (lower friction), better defense than B (wider sphere).
```

### WB Layer Profile (extending Case 15 system)

```typescript
   WB profile:
   layers = [{
     innerR: 0,
     outerR: 'dynamic',          // r = r_sphere × sin(tiltAngle) — same as RB
     innerZ: 0, outerZ: 0,
     chamfer: 'spherical',
     sphereRadius: 8mm,          // WIDER than B (~4mm), comparable to RB (~9mm)
     freeSpin: false,
     friction: 0.50,             // plastic: lower than rubber
     restitution: 0.65,          // plastic: more elastic than rubber
     material: 'plastic',
     wearModel: null,            // no wear — plastic durable, no geometry shift
   }]

   // Ball (B) profile — same structure, just smaller sphere:
   B_profile_layers = [{
     sphereRadius: 4mm,          // smaller → less movement, less defense
     friction: 0.50,             // same material
     restitution: 0.65,
     material: 'plastic',
     wearModel: null,
   }]

   // resolveRBContact from Case 19 reuses for WB/B (no wearModel path):
   function resolveContact(bey: BeyState, sphereRadius: number): number {
     return sphereRadius * Math.sin(bey.tiltAngle * DEG2RAD);
   }
```

---

## Case 28 — Circular Maximum-Weight Wheel + Static Imbalance: Twisted Fusion Wheel

Twisted introduces two physics concepts at opposite ends of the design intention: **maximum I via near-circular mass distribution** (the deliberate design), and **static mass imbalance creating periodic forced vibration** (the deliberate sabotage — the "Spiral Staircase of Death").

### Geometry — Near-Cylindrical Ring With Corrugated Outer Face

```
   Twisted top view:                    Side view (cross-section):

        ─────────────────────               ║ Energy Ring (above)
       ╱  ▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐  ╲             ╔══════════════════╗
      │   ▐ corrugated rim ▐   │            ║  thick metal ring ║  ← main wheel body
      │   ▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐   │            ║                   ║
      │                        │            ║  OVERHANG below   ║  ← extends PAST track
       ╲  ── internal void ── ╱            ╚══════════════════╝
        ─────────────────────               ║ Spin Track (below)

   ≈50–60 fine ridges (knurling) around outer cylindrical face.
   Wheel is nearly circular — no large protruding wings or teeth.
   Inner region has the "Spiral Staircase" void (an asymmetric missing chunk).
```

### Circular Design → I Maximization

```
   For a solid ring of mass m, inner radius r_in, outer radius r_out:
   I_ring = m/2 × (r_in² + r_out²)

   Twisted is nearly solid from hub to outer rim with minimal inner voids:
   r_in/r_out ≈ 0.3  (narrow hub relative to outer radius)
   I_twisted ≈ m/2 × (0.09 + 1.0) × r_out² ≈ 0.545 × m × r_out²

   Compared to a 3-blade attack wheel (mass concentrated at 3 blades, rest is air):
   I_blades ≈ m × r_blade² × 0.4  (rough estimate, 60% air)
   I_twisted/I_blades ≈ 0.545 / 0.40 = 1.36×  (36% more I for same mass)

   This is what "maximum weight" means in practice: the circular design
   wastes no mass on aerodynamics — ALL mass is at r_out or close to it.
   Higher I → harder to tilt → better defense (Case 3 gyroscopic stiffness).
```

### Corrugated Outer Face — Knurled Friction Surface

```
   ~55 fine ridges around the circumference → contact frequency:

   f_ridge = n_ridges × ω / (2π) ≈ 55 × 200 / 6.28 ≈ 1750 contacts/second

   At 1750 Hz, individual ridge impacts are indistinguishable → effective behavior
   is a HIGH-FRICTION CONTINUOUS SURFACE, not discrete smash attacks.

   Physics model: corrugated face = elevated μ_tangential (spin-steal surface)
   vs smooth metal face = lower μ_tangential (deflects cleanly)

   Contact normal is RADIAL (circular wheel):
   → Force component along normal: pushes opponent outward linearly (ring-out force)
   → Tangential friction: opposes relative spin at contact → spin steal

   Corrugated vs smooth comparison at same radial impulse J:
   ├── Smooth:      J_tangential = μ_smooth × J_normal ≈ 0.25 × J → low spin steal
   └── Corrugated:  J_tangential = μ_knurl  × J_normal ≈ 0.55 × J → moderate spin steal

   Net: Twisted is unusually good at spin steal for a "defense" wheel
   because the knurling doubles the tangential friction without adding attack protrusions.
```

### Overhang Below the Track Level

```
   "Almost cylindrical in thickness, part of which overhangs the Spin Track":

   The wheel body extends BELOW the top of the track by Δh_overhang.
   This creates a secondary contact zone at height < h_FW.

   Side contact zones:

   h ┤                      h_FW ← primary contact (opponent AR hits here)
     │  ┌────────────────────┐
     │  │  Twisted body      │
     │  │  ↓ overhang        │
     │  └────────────────────┘ ← h_FW - Δh_overhang (secondary contact zone)
     │        ← gap →
     │  ┌──┐ ← Spin Track top
     │  └──┘

   Lower attacker whose AR is below h_FW but above (h_FW - Δh_overhang):
   → Hits the overhang section, not the main AR
   → Contact height on Twisted: below Twisted's CoM (lower hit → Case 10)
   → Twisted's top swings TOWARD the attacker next tick (counter potential)
   → But smooth circular overhang → glancing deflection → limited counter force

   This is why Twisted feels "impenetrable from below" — the overhang fills
   the gap that attack types try to exploit.
```

### The Spiral Staircase of Death — Static Mass Imbalance

```
   Perfect wheel:  CoM exactly on spin axis → no centrifugal wobble
   Twisted wheel:  internal void → CoM offset by distance d from spin axis

   The void creates a static imbalance:
   F_imbalance = m_twisted × d_offset × ω²   (centrifugal, rotates with wheel)

   This rotating force drives the bey's tilt at frequency ω.

   At high spin:
   ├── F_imbalance = m × d × ω² is large (ω² grows fast)
   ├── Gyroscopic stiffness I × ω is also large
   ├── Response amplitude = F_imbalance / (I × ω × Ω_p)
   │                      = (m × d × ω²) / (I × ω × Ω_p)
   │                      = (m × d × ω) / (I × Ω_p)
   └── Grows with ω → imbalance effect is WORST at HIGH spin!
       But: Ω_p = τ / (I × ω) → Ω_p decreases with ω
       So response amplitude ∝ ω × ω = ω² → resonance builds fast at launch

   RESONANCE condition: spin frequency ω = precession frequency Ω_p
   ω_resonance = sqrt(m × g × r_cog / I)   (from precession equation)

   For Twisted (high I, high mass): ω_resonance is LOWER than average
   → Resonance occurs early in the match (high spin) → passes through quickly
   → "Not a notable hindrance" — the bey spends minimal time at resonance
```

```
   Imbalance resonance diagram (spin vs tilt amplitude):

   tilt ↑
   amp  │                ╭──╮  ← resonance peak (ω ≈ Ω_p)
        │           ╭────╯  ╰────╮
        │      ╭────╯             ╰────╮
        │ ─────╯                       ╰──────────────── ← normal wobble
        └─────────────────────────────────────────────► ω (high → low as spin decays)
               ↑                       ↑
           match start           resonance zone crossed
           (high ω)              (mild vibration spike, passes quickly)
```

```typescript
   // Static imbalance model in per-tick physics:
   interface MassImbalance {
     offsetDistance: number;    // mm: CoM offset from spin axis
     offsetPhase: number;       // radians: current angular position of the heavy side
   }

   function tickImbalanceForce(bey: BeyState, imbalance: MassImbalance, dt: number) {
     const omega = bey.spin / bey.I;
     // Centrifugal force on offset mass (bey.mass is total, use correction factor)
     const F_imbalance = bey.mass * imbalance.offsetDistance * 0.001 * omega * omega;

     // Direction: perpendicular to spin axis, rotating with the wheel
     imbalance.offsetPhase += omega * dt;
     const fx = F_imbalance * Math.cos(imbalance.offsetPhase);
     const fy = F_imbalance * Math.sin(imbalance.offsetPhase);

     // Apply as a small periodic perturbation
     bey.vx += fx / bey.mass * dt * 0.01;  // damped by 0.01 — small effect
     bey.vy += fy / bey.mass * dt * 0.01;
   }

   // Twisted config:
   const TWISTED_IMBALANCE: MassImbalance = {
     offsetDistance: 1.5,   // mm (the Spiral Staircase void offset — estimated)
     offsetPhase: 0,
   };
```

### Why Twisted Fails Against 4D Wheels (Stamina Comparison)

```
   Twisted I ≈ 0.545 × m × r_out²    (solid ring, some inner void)
   Phantom I ≈ m_frame × r_frame²     (Case 18: 94% mass at max radius)

   For similar total mass:
   Phantom outer-ring mass fraction: 40.31 / 42.79 = 94% at maximum radius
   Twisted solid-ring mass fraction: ~70% at outer half (rest is hub + spokes)

   I_Phantom / I_Twisted ≈ 1.76× (from Case 18 calculation)

   Higher I → slower spin decay (same friction torque: dω/dt = -τ/I)
   → Phantom outlasts Twisted purely because of better mass distribution
   → Twisted compensates with heavier total mass, but mass alone ≠ I
```

---

## Case 29 — Jade Fusion Wheel: Dual-Element Ball Channel (Steel + Rubber)

> **Stock combo (Jade Jupiter S130RB):** 4D Clear Wheel: Jupiter · 4D Metal Wheel: Jade · Track: S130 · Bottom: Rubber Ball

Case 19 described the Jade gravity ball system using simple balls migrating radially. The images of the actual Jade Fusion Wheel reveal that each channel contains TWO elements, not one: a **steel ball** and a **red rubber cushion**. This changes the migration dynamics at both endpoints and the spin-up response timing.

### Dual-Element Channel Geometry

```
   Top view of Jade wheel with 4 channels (at 90° intervals):

   ╔═══════════════════════════════════════════╗
   ║        [slot]         [slot]              ║
   ║        ┌───┐          ┌───┐              ║
   ║        │R●│           │R●│              ║  ← R = rubber cushion (red)
   ║        └───┘          └───┘              ║    ● = steel ball (silver)
   ║  [slot]         ●         [slot]          ║
   ║  ┌───┐       (center)      ┌───┐          ║
   ║  │●R│                     │●R│          ║
   ║  └───┘                     └───┘          ║
   ╚═══════════════════════════════════════════╝

   Each oval channel holds:
   ├── 1 × steel ball (~2.5mm diameter, ~0.065g) — heavy, provides centrifugal mass
   └── 1 × red rubber piece — soft end-stop, cushions impact at channel limits

   At high spin (outward): steel ball → outer end of channel → rubber buffers outer stop
   At low spin (inward):   steel ball → inner end of channel → rubber buffers inner stop
```

```
   Cross-section of one channel (radial direction, outward = right):

   center ──────────────────────────────────────────► outer rim
              ┌────────────────────────────────────┐
   inner stop │ [rubber] [steel ball]              │ outer wall
              │                                    │
              │           [steel ball] [rubber]    │ ← high spin: ball at outer end
              └────────────────────────────────────┘
              ↑ r_inner                  ↑ r_outer

   High spin:  ball at r_outer, rubber cushion between ball and outer wall
   Low spin:   ball at r_inner, rubber cushion between ball and inner wall
```

### How the Rubber Cushion Changes the Physics

```
   CASE 19 model (hard stop, ideal):
   Ball migrates → reaches r_inner → INSTANTANEOUS stop
   Angular momentum L = I × ω conserved → ω spikes instantly
   I_old × ω_old = I_new × ω_new → ω_new = ω_old × (I_old / I_new)
   Spin-up is a STEP FUNCTION at the moment the ball hits the end.

   ACTUAL model (rubber cushion, soft stop):
   Ball approaches r_inner → contacts rubber cushion
   Rubber compresses over Δt_compress (elastic deformation time, ~5–10ms)
   During compression: ball decelerates gradually, not instantly
   Ball bounces back slightly (rubber is elastic) → oscillates at cushion for 2–3 cycles
   Then settles at r_inner.

   Effect on spin-up:
   ├── The spin-up energy comes from the angular momentum transfer as ball moves inward
   ├── With soft stop: transfer is spread over Δt_compress → smoother spin-up
   ├── A brief oscillation at the cushion → I oscillates slightly → tiny periodic ω spike
   └── Net: same TOTAL spin-up energy, but delivered as a smooth ramp not a spike

   In practice: spin-up is still ~15% as calculated in Case 19, just not instantaneous.
```

```
   The rubber bounce at the outer end (high spin):

   When the ball first migrates outward (at match start, high ω):
   ├── Ball accelerates toward r_outer under centrifugal force
   ├── Hits outer rubber cushion at high velocity
   ├── Rubber absorbs some impact (μ_return ≈ 0.60 for rubber vs hard stop)
   ├── Ball bounces back inward slightly, then centrifugal force pushes it back out
   └── Ball settles at r_outer after 2–3 oscillations (damped by rubber)

   Each oscillation briefly changes the instantaneous I:
   ΔI_bounce = m_ball × (r_outer² - r_settle²) × (bounce_fraction)²
   → Tiny but causes brief micro-flutter in ω at match start
   → Visible as slight initial instability before ball settles
```

### S130 (Shield 130) — Visual Confirmation

```
   The S130 images confirm the geometry described in Case 19:

   8 rectangular "shield" tabs at 45° intervals around a transparent disc body.
   Each tab is flat and rectangular — not curved, not angled.
   The disc body between tabs is transparent (not solid) — the gaps are real.

   Gap fraction: ~50% of circumference is tabs, ~50% is gaps.
   This matches: "8-arm disc, arms have GAPS between them (~45° each arm, ~45° gap)"
   from Case 19.

   At high spin: disc spins → tabs blur → effective contact probability → 100%
   At low spin: 50% chance a contact is a tab vs a gap → probabilistic defense

   The rectangular tab profile: flat face, perpendicular to floor plane.
   → Contact normal is radial (same as Twisted) → pushes attacker outward.
   → The tab face is thin → small contact area → the "scrapes" are brief.
   → No rubber, no corrugation: standard plastic, μ ≈ 0.40, restitution ≈ 0.65.

   No new physics beyond Case 19 — S130 is fully characterised by:
   discHeight: 130,  discRadius: 18mm,  discArmCount: 8,  discArmFraction: 0.5
```

---

## Case 30 — Rubber Energy Ring as Spin-Steal Interface: L-Drago II and Opposite-Spin Amplification

> **Stock combo (Lightning L Drago 100HF):** Clear Wheel: L Drago · Metal Wheel: Lightning · Track: 100 · Bottom: Hole Flat
> **Stock combo (Meteo L Drago LW105LF):** Clear Wheel: L Drago II · Metal Wheel: Meteo · Track: LW105 · Bottom: Left Flat

All previous rubber cases (Fusion Case 21, RF/RB tips) placed rubber at the **tip** or **outer wheel body**. L-Drago II places rubber directly on the **Energy Ring contact surface** at attack-ring height. The physical mechanism is the same — viscoelastic friction — but the contact geometry is at the AR level, not the floor. The key new physics: the **spin-direction of the two beys multiplies the relative contact velocity**, making opposite-spin matchups qualitatively more effective than same-spin by a factor that grows with spin speed.

### L-Drago II — Rubber Pad Geometry

```
   Energy Ring top view (three dragon heads):

        [DRAGON HEAD]               ← white plastic protrusion (structural)
       ╱             ╲
      │  [RUB] [RUB]  │            ← red rubber pads (contact surface)
      │                │
       ╲  [DRAGON]    ╱
        [RUB] [RUB]
             [DRAGON HEAD]

   Three dragon heads at 120° spacing (plastic, structural, not primary contact).
   Rubber pads sit BETWEEN and AROUND the dragon heads, proud of the plastic.
   → Rubber is the outermost surface → contacts opponent's Fusion Wheel first.

   The assembled bey (visible in image):
   Silver Meteo Fusion Wheel body + L-Drago II rubber pads exposed at outer rim.
   Each rotation, the rubber pad faces are the primary collision interface.
```

### Spin-Direction and Relative Contact Velocity — The Core Mechanism

```
   At the contact point between two beys, the surfaces move at:

   v_surface_A = ω_A × r_A   (tangential speed of A's AR surface)
   v_surface_B = ω_B × r_B   (tangential speed of B's AR surface)

   SAME-SPIN matchup (both CCW, standard):
   At contact: both surfaces move in OPPOSITE local directions
   Wait — if both spinning CCW from above, at the contact point between them:
   A's surface moves rightward (+x) if it's on the left side of contact.
   B's surface also moves rightward (+x) because B is also CCW and on the right.
   → v_rel = v_A - v_B = ω_A×r_A - ω_B×r_B  ← can be near zero if ω_A ≈ ω_B

   OPPOSITE-SPIN matchup (L-Drago CCW, opponent CW):
   At contact: L-Drago's surface moves rightward (+x).
   Opponent's surface moves leftward (-x) (reversed spin).
   → v_rel = v_A + v_B = ω_A×r_A + ω_B×r_B  ← ALWAYS additive, ALWAYS large
```

```
   Friction-based spin steal magnitude:

   F_friction = μ × N    (Coulomb friction, rubber μ ≈ 0.80)
   τ_steal_on_opponent = F_friction × r_B

   Same-spin steal (low v_rel):
   At equilibrium (ω_A = ω_B): v_rel = 0 → F_friction = 0 → steal stops
   Steal decays to zero as spins equalise — diminishing returns

   Opposite-spin steal (high v_rel = ω_A×r_A + ω_B×r_B):
   v_rel NEVER reaches zero (spins are in opposite directions)
   Even if ω_B drops to zero, ω_A still contributes: v_rel = ω_A × r_A > 0
   → Steal continues until opponent's spin reaches ZERO
   → As long as L-Drago spins: it actively steals from the opponent
```

```
   v_rel comparison at various spin states:

   State                  │ Same-spin v_rel          │ Opposite-spin v_rel
   ───────────────────────┼──────────────────────────┼───────────────────────────
   Both at 100% spin      │ |ω_A - ω_B| ≈ 0          │ ω_A + ω_B = 2×ω_max
   (equal spin)           │ → near zero steal        │ → MAXIMUM steal rate
   ───────────────────────┼──────────────────────────┼───────────────────────────
   A at 80%, B at 60%     │ |0.8-0.6|ω = 0.2ω        │ (0.8+0.6)ω = 1.4ω
                          │ moderate steal           │ large steal (7× more)
   ───────────────────────┼──────────────────────────┼───────────────────────────
   A at 100%, B at 20%    │ |1.0-0.2|ω = 0.8ω        │ (1.0+0.2)ω = 1.2ω
   (opponent nearly done) │ good steal               │ similar (small gain here)
   ───────────────────────┼──────────────────────────┼───────────────────────────
   Conclusion:            │ steal only useful when   │ steal is most powerful when
                          │ speeds differ             │ BOTH spinning FAST (early match)
```

```
   Opposite-spin is strongest EARLY in the match — this is counter-intuitive:
   Both at max spin → v_rel is at maximum → rubber grabs hardest → most spin stolen per contact
   As match progresses and opponent's ω drops: v_rel decreases → steal rate drops
   But: the opponent is ALREADY weakened by prior steals → each stolen unit matters more

   Asymptotic outcome:
   If steal continues long enough → ω_opponent → 0 while ω_LDrago stays high
   → L-Drago wins by spin-out (opponent topples first)
   This is the stamina use case: L-Drago wins by sustained spin theft, not ring-out.
```

### The Absorption-Attack Tradeoff

```
   Rubber on the Energy Ring has two simultaneous effects on EVERY collision:

   Effect 1 (GOOD for stamina): Spin steal via high friction
   Effect 2 (BAD for attack): Lower restitution reduces J

   The same μ_rubber that creates high friction also means low μ_bounce:
   μ_bounce_rubber ≈ 0.25–0.35   (viscoelastic: energy becomes heat)
   μ_bounce_metal  ≈ 0.75–0.85   (elastic: energy returns as KE)

   J_delivered_to_opponent = -(1 + μ_bounce) × v_rel × (reduced mass)
   ├── With rubber (μ_bounce=0.30): J = 1.30 × v_rel × m_eff  (small)
   └── With metal  (μ_bounce=0.80): J = 1.80 × v_rel × m_eff  (large, 38% more)

   → Rubber L-Drago II delivers 38% less ring-out impulse per hit vs bare metal
   → This is why the rubber "dampens hits" and "reduces attack capability"
   → L-Drago II trades ring-out power for sustained spin theft
```

### Mode Change: Assault vs Rapid-Hit

```
   Mode change = rotating L-Drago II 180° on the Meteo Fusion Wheel.
   Different rotation exposes different rubber pad faces outward.

   ASSAULT MODE:
   Dragon heads are in position A → specific rubber geometry at contact zone
   The "primary" rubber face contacts opponent

   RAPID-HIT MODE:
   Dragon heads rotated 180° → alternate rubber face at contact zone
   More contact events per revolution (shorter rubber pad → more gaps → faster cycling)

   Why negligible difference:
   ├── Both modes use the SAME rubber (same μ, same viscoelasticity)
   ├── The pad geometry changes are minor (same total rubber coverage ~)
   ├── In spin-steal: it's the accumulated contact time that matters, not mode
   └── In ring-out: rubber μ_bounce is always low regardless of mode
       → Mode choice changes contact FREQUENCY slightly, not contact QUALITY
```

### Rubber AR vs Rubber Tip — Contact Level Comparison

```
   ┌──────────────────┬──────────────────────────────────────────────┐
   │ Rubber location  │ Spin steal mechanism                         │
   ├──────────────────┼──────────────────────────────────────────────┤
   │ RF/RB tip        │ Tip contacts FLOOR. Steals spin via floor    │
   │ (Cases 15, 27)   │ friction as tip drags on spinning surface.   │
   │                  │ Works for SAME-spin (spin circle on floor).  │
   ├──────────────────┼──────────────────────────────────────────────┤
   │ L-Drago II AR    │ AR contacts OPPONENT'S WHEEL. Steals via     │
   │ (this case)      │ wheel-to-wheel friction. Optimized for       │
   │                  │ OPPOSITE-spin where v_rel is additive.       │
   ├──────────────────┼──────────────────────────────────────────────┤
   │ EWD tip (Case 15)│ Free-spin center contacts opponent at tip.   │
   │                  │ Steal from bearing-coupled tip vs opponent.  │
   │                  │ Same-spin optimized (bearing decouples self). │
   └──────────────────┴──────────────────────────────────────────────┘

   L-Drago II is the ONLY case where spin steal occurs at AR level
   (not tip, not static surface) AND is spin-direction dependent.
```

### Per-Collision Spin Steal Resolution (Opposite-Spin Case)

```typescript
   function resolveSpinStealAR(
     A: BeyState,       // L-Drago (left/CCW spin, negative ω convention)
     B: BeyState,       // opponent (right/CW spin, positive ω)
     N: number,         // normal force at contact
     rubber: { friction: number, restitution: number },
     dt: number
   ) {
     const r_A = A.r_ar;
     const r_B = B.r_ar;

     // v_rel at contact (opposite spin: velocities ADD at contact point)
     const v_surface_A = A.spin * r_A;   // magnitude (L-Drago spin contribution)
     const v_surface_B = B.spin * r_B;   // magnitude (opponent spin contribution)
     const v_rel = v_surface_A + v_surface_B;  // additive for opposite spin
     // For same spin: v_rel = Math.abs(v_surface_A - v_surface_B)

     // Friction force (Coulomb, rubber)
     const F_steal = rubber.friction * N;

     // Spin loss on opponent B (decelerates)
     const tau_B = F_steal * r_B;
     B.spin -= (tau_B / B.I) * dt;

     // Spin gain on A (partially — rubber absorbs some energy)
     const tau_A = F_steal * r_A * rubber.restitution;  // μ_return fraction to L-Drago
     A.spin += (tau_A / A.I) * dt;  // L-Drago absorbs some stolen spin

     // Linear impulse (collision) — rubber restitution
     const n = normalize2D(B.pos - A.pos);
     const v_rel_n = dot(A.vel - B.vel, n);
     if (v_rel_n < 0) {
       const J = -(1 + rubber.restitution) * v_rel_n
               / (1/A.mass + 1/B.mass + r_A*r_A/A.I + r_B*r_B/B.I);
       A.vel -= (J / A.mass) * n;
       B.vel += (J / B.mass) * n;
       // J is SMALL due to low restitution → ring-out threat is reduced
     }
   }
```

---

## Case 31 — L-Drago Energy Ring Variants: Rubber as the Entire Mechanism (Rush + Assault Falsification)

> **Stock combo (Lightning L Drago 100HF):** Clear Wheel: L Drago · Metal Wheel: Lightning · Track: 100 · Bottom: Hole Flat

L-Drago Rush (red/gold, plastic) and L-Drago Assault (blue, plastic) are both mode-change Energy Rings for the Meteo Fusion Wheel that lack rubber entirely. They establish a **control condition** that proves rubber is the whole mechanism, not the mode geometry.

### The Three-Variant Comparison

```
   ┌─────────────────┬──────────────┬──────────────────────────────────────────────┐
   │ Variant         │ Material     │ Mode change effect                           │
   ├─────────────────┼──────────────┼──────────────────────────────────────────────┤
   │ L-Drago II      │ Rubber + PL  │ Meaningful: different rubber faces exposed   │
   │ (Case 30)       │              │ Assault ↔ Rapid-Hit changes which rubber     │
   │                 │              │ pad geometry contacts the opponent            │
   ├─────────────────┼──────────────┼──────────────────────────────────────────────┤
   │ L-Drago Rush    │ Plastic only │ Negligible: both modes = same plastic face   │
   │ (red/gold)      │              │ Dragon head geometry rotates but both        │
   │                 │              │ orientations = same μ, same restitution      │
   ├─────────────────┼──────────────┼──────────────────────────────────────────────┤
   │ L-Drago Assault │ Plastic only │ Negligible: identical physics to Rush        │
   │ (blue)          │              │ Different colour, functionally identical     │
   └─────────────────┴──────────────┴──────────────────────────────────────────────┘
```

### Why Rubber Drives the Mode Difference

```
   In L-Drago II, rotating the ring 180° changes which rubber pad faces outward:
   ├── Assault Mode:     rubber pad A contacts opponent → geometry A
   └── Rapid-Hit Mode:   rubber pad B contacts opponent → geometry B
   Even if A and B are geometrically similar, both are RUBBER → meaningful.

   In Rush / Assault (plastic only):
   ├── Mode A: plastic dragon head face contacts → μ_plastic, μ_bounce_plastic
   └── Mode B: plastic dragon head face (rotated) contacts → SAME μ_plastic, same values
   The geometric difference between the two plastic faces is negligible:
   ├── Both are smooth plastic → same contact normal angle (~tangential)
   ├── Same restitution ~0.65 regardless of orientation
   └── Zero spin steal (v_rel at contact irrelevant without high μ rubber)
```

### Opposite-Spin Without Rubber — What L-Drago Rush Achieves

```
   L-Drago Rush in opposite-spin matchup (left vs right spin):

   v_rel at contact = ω_A × r_A + ω_B × r_B   (additive, same as Case 30)
   F_steal = μ_plastic × N = 0.40 × N          (plastic, not 0.80 rubber)

   Compared to L-Drago II in same matchup:
   F_steal_II   = μ_rubber × N = 0.80 × N
   F_steal_Rush = μ_plastic × N = 0.40 × N   ← half the spin steal rate

   At the same v_rel: Rush steals spin at 50% of L-Drago II's rate.
   Additionally: plastic is elastic (μ_bounce ≈ 0.65) vs rubber (μ_bounce ≈ 0.30)
   → Rush delivers more ring-out impulse per hit (higher restitution)
   → But minimal sustained spin theft (low friction)

   Rush occupies the middle: more attack than II, less stamina/steal than II.
   Rush is an attack type that happens to be left-spin — it benefits from
   the opposite-spin v_rel amplification for spin CONTACT but not spin STEAL.
```

### What This Confirms About the Physics Model

```
   The L-Drago variant family forms a natural experiment:

   Same wheel (Meteo): identical I, r_ar, h_com, collision geometry
   Same mode change: identical rotation mechanism, identical dragon-head positions
   Only variable: rubber vs plastic on the contact surface

   Observation:
   └── L-Drago II (rubber): meaningful mode differences, strong spin steal
   └── Rush / Assault (plastic): negligible mode differences, no spin steal

   Conclusion proven by falsification:
   ├── Mode geometry alone contributes nothing observable
   ├── Rubber contact material is the entire source of spin steal
   └── The μ_friction × v_rel × N formula from Case 30 is the correct model:
       with μ_rubber = 0.80: strong steal
       with μ_plastic = 0.40: minimal steal, modes are equivalent

   In code: Rush and Assault use the same collision resolver as any standard
   plastic Energy Ring. Only L-Drago II routes through resolveSpinStealAR()
   with the rubber material parameters.

   // Data distinction:
   // L-Drago II:      energyRing.contactMaterial = 'rubber', spinStealEnabled = true
   // L-Drago Rush:    energyRing.contactMaterial = 'plastic', spinStealEnabled = false
   // L-Drago Assault: energyRing.contactMaterial = 'plastic', spinStealEnabled = false
```

---

## Case 32 — Fusion Wheel + Energy Ring as a Composite Contact System: Meteo

> **Stock combo (Meteo L Drago LW105LF):** Clear Wheel: L Drago II · Metal Wheel: Meteo · Track: LW105 · Bottom: Left Flat

Every previous Fusion Wheel was self-contained — the wheel body alone defined the contact geometry, and the Energy Ring sat on top as a mass contribution. Meteo breaks this: it is a **small wheel whose contact zone is incomplete without the Energy Ring**. The jaw/claw protrusions of Meteo and the dragon-head protrusions of L-Drago II interleave to form the full contact profile. Mode change selects which Meteo protrusion type is covered by which Energy Ring element.

### Jaw / Claw Alternation — Six-Fold Contact Geometry

```
   Meteo top view (bare, without Energy Ring):

   6 protrusions at 60° intervals, alternating:

        [CLAW]            [CLAW]           [CLAW]
       ╱ rugged ╲        ╱ rugged ╲       ╱ rugged ╲
      │           │      │           │    │           │
       ╲          ╱  ────  ╲         ╱ ──  ╲          ╱
        [JAW]             [JAW]            [JAW]
        smooth            smooth           smooth

   Jaw: smooth metal face → low friction, glancing deflection, high restitution
   Claw: rugged/textured metal face → higher friction (like Twisted's corrugation)

   6-fold → contact frequency = 6 × ω / (2π) contacts/second
   (same as Blitz Barrage mode, Case 20 — many smaller hits)
```

### Mode Change — What Gets Covered and What Gets Exposed

```
   L-Drago II sits on Meteo and occupies 3 of the 6 positions (the 120° dragon-head gaps).
   Mode = which 3 positions L-Drago II's dragon heads sit over.

   ASSAULT MODE (dragon heads cover CLAWS):

   Position:  [JAW]     [DRAGON]   [JAW]     [DRAGON]   [JAW]     [DRAGON]
   Material:  Meteo     L-Drago    Meteo     L-Drago    Meteo     L-Drago
              smooth    rubber*    smooth    rubber*    smooth    rubber*
                                                    * = rubber only for L-Drago II

   Exposed contact profile: smooth Meteo jaws (between dragon heads)
   Primary contact = smooth jaw faces → glancing deflection, low friction
   Rubber at dragon head positions = covered/shielded by dragon heads, inward

   RAPID-HIT MODE (dragon heads cover JAWS):

   Position:  [CLAW]    [DRAGON]   [CLAW]    [DRAGON]   [CLAW]    [DRAGON]
   Material:  Meteo     L-Drago    Meteo     L-Drago    Meteo     L-Drago
              rugged    rubber*    rugged    rubber*    rugged    rubber*

   Exposed contact profile: rugged Meteo claws (between dragon heads)
   Primary contact = rugged claw faces → higher friction, more torque
   Rubber at dragon head positions = exposed outward (faces opponent directly)
```

```
   Contact material per position, per mode:

   ┌──────────────┬──────────────────────────────┬───────────────────────────────┐
   │              │ Assault (claws covered)       │ Rapid-Hit (jaws covered)      │
   ├──────────────┼──────────────────────────────┼───────────────────────────────┤
   │ L-Drago II   │ Jaw positions: smooth metal  │ Jaw positions: rubber         │
   │ (rubber)     │ Claw positions: rubber        │ Claw positions: rugged metal  │
   │              │ Mixed: metal+rubber at 60°   │ Mixed: rubber+metal at 60°    │
   │              │ MEANINGFUL DIFFERENCE        │                               │
   ├──────────────┼──────────────────────────────┼───────────────────────────────┤
   │ L-Drago Rush │ Jaw positions: smooth metal  │ Jaw positions: plastic        │
   │ / Assault    │ Claw positions: plastic       │ Claw positions: rugged metal  │
   │ (plastic)    │ Near-negligible difference   │                               │
   │              │ (plastic ≈ smooth metal, μ   │ (rugged metal has higher μ,   │
   │              │ almost same in practice)     │ but no rubber to amplify)     │
   └──────────────┴──────────────────────────────┴───────────────────────────────┘
```

### Why Rush/Assault Modes Are Still Slightly Different (but negligible)

```
   Without rubber, the modes differ only in whether smooth jaws or rugged claws are exposed:

   Smooth jaw: μ_metal_smooth ≈ 0.25, μ_bounce ≈ 0.80
   Rugged claw: μ_metal_rugged ≈ 0.40, μ_bounce ≈ 0.78

   The μ difference: 0.40 vs 0.25 = 1.6× more friction in claw mode.
   But: contact area is small (6 tiny protrusions) → absolute N is small
   → |ΔF_friction| = 0.15 × N_tiny ≈ negligible spin steal

   This confirms "differences between modes are negligible/barely noticeable":
   The jaw/claw friction difference without rubber is too small to measure in practice.
   → Modes are equivalent for Rush and Assault.
```

### Meteo as a Composite System — Energy Ring Completes the Contact Zone

```
   "It is a small Fusion Wheel, as most of the contact points include parts of the Clear Wheel"

   In standard beys: Fusion Wheel provides 100% of the contact geometry.
   Energy Ring sits above → mass contribution only.

   In Meteo + L-Drago II: the wheel is INTENTIONALLY SMALL.
   The 3 dragon head positions = Energy Ring protrusions, NOT Fusion Wheel protrusions.
   At those 3 positions, the Energy Ring's outer face IS the contact surface.

   This means:
   ├── The Energy Ring material (rubber vs plastic) is a direct input to the
   │   collision resolver, not a secondary effect
   ├── The FusionWheel.r_cp must be computed as a COMPOSITE of:
   │   - Meteo jaw/claw r_cp (the 3 jaw positions)
   │   - L-Drago II dragon head r_cp (the 3 dragon positions)
   └── The total contact zone alternates between FW material and ER material
       60° apart around the circumference
```

```typescript
   // Composite contact resolution for Meteo + L-Drago II:
   interface CompositeContactZone {
     positions: Array<{
       angleDeg: number;         // 0°, 60°, 120°, 180°, 240°, 300°
       sourceComponent: 'fusion_wheel' | 'energy_ring';
       material: 'smooth_metal' | 'rugged_metal' | 'rubber' | 'plastic';
       r_cp: number;             // radius from spin axis to this contact face
       friction: number;
       restitution: number;
     }>;
   }

   // Meteo + L-Drago II in Assault Mode:
   const METEO_LDRAGOII_ASSAULT: CompositeContactZone = {
     positions: [
       { angleDeg: 0,   sourceComponent: 'fusion_wheel', material: 'smooth_metal',
         r_cp: 18, friction: 0.25, restitution: 0.80 },  // jaw
       { angleDeg: 60,  sourceComponent: 'energy_ring',  material: 'rubber',
         r_cp: 19, friction: 0.80, restitution: 0.30 },  // dragon head (rubber)
       { angleDeg: 120, sourceComponent: 'fusion_wheel', material: 'smooth_metal',
         r_cp: 18, friction: 0.25, restitution: 0.80 },  // jaw
       { angleDeg: 180, sourceComponent: 'energy_ring',  material: 'rubber',
         r_cp: 19, friction: 0.80, restitution: 0.30 },  // dragon head (rubber)
       { angleDeg: 240, sourceComponent: 'fusion_wheel', material: 'smooth_metal',
         r_cp: 18, friction: 0.25, restitution: 0.80 },  // jaw
       { angleDeg: 300, sourceComponent: 'energy_ring',  material: 'rubber',
         r_cp: 19, friction: 0.80, restitution: 0.30 },  // dragon head (rubber)
     ]
   };

   // At collision: resolve which position (angleDeg) is closest to the impact normal
   // → use that position's material parameters for the collision resolver
   function resolveMeteoContact(zone: CompositeContactZone, impactAngle: number) {
     const closest = zone.positions.reduce((best, pos) => {
       const d = Math.abs(normalizeAngle(pos.angleDeg - impactAngle));
       return d < Math.abs(normalizeAngle(best.angleDeg - impactAngle)) ? pos : best;
     });
     return closest;
   }
```

### Spin Direction Constraint — Why Only L-Drago Variants Fit

```
   "Meteo can only be used with L-Drago II and its variants"

   Physical reason: The pockets in Meteo are shaped to accept L-Drago's
   three-dragon-head geometry specifically. Other Energy Rings with different
   protrusion counts (e.g., 2-head, 4-head designs) cannot seat in the pockets.

   Physics implication:
   ├── The composite contact zone (Case above) is FIXED — no other ER can
   │   change the Meteo contact positions or provide rubber at those positions
   └── Meteo is the only wheel that REQUIRES the Energy Ring to complete its
       contact geometry — all other wheels are self-contained

   Data model: fusionWheel.requiresEnergyRingId = ['l_drago_ii', 'l_drago_rush', 'l_drago_assault']
   At match start: validate the combination is legal before computing composite zone.
```

---

## Case 33 — Wide Flat Tips: XF Contact Mechanics, Flower Pattern, Tornado Stalling, and Spin-Equalizing

Extreme Flat (XF) introduces three concepts that require explicit physics models: the **four-tab discrete contact pattern** (giving XF its speed vs a continuous flat), **movement patterns** (flower vs tornado stall as distinct orbital regimes driven by tip width), and **spin-equalizing** (a stamina mechanic that is distinct from same-spin stamina and is optimized by wide low-friction tips in opposite-spin matchups).

### XF Geometry — Four Tabs at Maximum Radius

```
   XF top view (tip pointing DOWN):

   ══════════════════════════════════════   ← flat disc body (plastic)
                                            does NOT contact floor directly

   At 0°, 90°, 180°, 270° — four raised plastic tabs:

          [TAB]                  [TAB]
         ╱     ╲                ╱     ╲
   ──────         ──────────────         ──────
         ╲     ╱                ╲     ╱
          [TAB]                  [TAB]

   Tabs are at radius r_XF ≈ r_RF (wide, same diameter as Rubber Flat).
   Tabs are raised ~0.3mm above the flat disc face.
   → Tabs are the PRIMARY contact surface with the floor.
   → The flat disc body behind them does NOT normally touch the floor.

   This is a FOUR-POINT discrete contact pattern at r_XF.
```

```
   Contact frequency vs spin:

   At high spin ω:
   f_contact = 4 × ω / (2π)
   At ω = 300 rad/s: f = 4 × 300 / 6.28 ≈ 191 contacts/second
   → Fast enough that tabs "smear" together → effectively continuous disc contact
   → Behaves like a wide flat disc: r_contact ≈ r_XF, friction uniform

   At low spin ω (late match wobble):
   At ω = 30 rad/s: f = 4 × 30 / 6.28 ≈ 19 contacts/second → tabs are discrete
   → Each tab individually contacts floor → brief, punctuated contact
   → Momentary gaps between tab contacts → effective friction is reduced
   → This is why XF has "speed" — not lower μ per contact, but lower average friction
      due to duty cycle < 100% at low spin

   duty_cycle = (tab_arc_degrees / 360) × n_tabs
              = (15° / 360) × 4 = 0.167  (16.7% contact time at low spin)
   effective_μ_low_spin = μ_plastic × duty_cycle = 0.50 × 0.167 = 0.083
   vs at high spin (blur): effective_μ_high_spin ≈ μ_plastic = 0.50
```

### Wide Flat = Fast Precession = High-Speed Movement Pattern

```
   Ground friction torque (same formula as Cases 8, 26, 27):
   τ = μ_eff × m × g × r_contact

   For XF (wide, r_contact ≈ 15mm):
   τ_XF = 0.50 × m × g × 15mm

   For MF (narrow, r_contact ≈ 3mm):
   τ_MF = 0.55 × m × g × 3mm   (metal μ slightly higher per unit area)

   τ_XF / τ_MF ≈ (0.50 × 15) / (0.55 × 3) = 7.5 / 1.65 ≈ 4.5×

   XF generates 4.5× more torque driving precession than MF.
   → XF bey precesses (orbits) 4.5× faster → covers arena quickly
   → This high speed is the attack type characteristic
   → But also: spin decays 4.5× faster from the same friction (same formula)
```

### Flower Pattern vs Tornado Stalling — Two Orbital Regimes

```
   FLOWER PATTERN (clover/petal orbit):

   The bey moves in a curved path that touches the arena wall periodically:

   ┌────────────────────────────┐
   │        ARENA WALL          │
   │   ╭──╮   ╭──╮   ╭──╮     │
   │  ╱    ╲ ╱    ╲ ╱    ╲    │
   │ │      ×      ×      │    │  ← bey crosses center (×) between each wall touch
   │  ╲    ╱ ╲    ╱ ╲    ╱    │
   │   ╰──╯   ╰──╯   ╰──╯     │
   │                            │
   └────────────────────────────┘

   Each "petal" = one wall touch + center cross + next wall touch.
   The bey spends most time near the wall where opponents are.

   Requires: HIGH tip friction (grip) to redirect the bey from straight into curved
   RF achieves flower pattern well (rubber μ = 0.85 → high centripetal grip)
   XF is too low μ → bey tends to go straight → misses the curved redirect → loses pattern

   TORNADO STALLING (orbital spin near wall):

   The bey orbits the inside of the arena wall in a tight circle:

   ┌────────────────────────────┐
   │      ARENA WALL            │
   │  ○○○○○○○○○○○○○○○○○○○○○   │  ← bey orbits wall (○)
   │  ○                   ○    │    stays near wall, never crosses center
   │  ○                   ○    │
   │  ○                   ○    │
   │  ○○○○○○○○○○○○○○○○○○○○○   │
   └────────────────────────────┘

   Requires: SMALL tip radius (precise steering) + moderate friction (grip the wall arc)
   MF (small metal point) and CF (Circle Flat, medium width) achieve this well.
   XF TOO WIDE: at the wall, wide tip can't maintain tight turning radius
   → tip drag is too broad → bey spirals inward rather than orbiting stably

   Physics of tornado stalling vs flower pattern (tip width as selector):
   Narrow tip → bey can turn sharply → orbital radius can be small → wall orbit possible
   Wide tip → turning radius is large → bey naturally prefers wide orbits → flower pattern
   But XF too low μ even for flower → ends up in wide uncontrolled straight-line drift
```

```
   Tip width vs movement pattern (classification):

   r_tip < 3mm (sharp, S):  point orbit, high tilt → NOT used for either pattern
   r_tip = 3–6mm (MF, CF):  narrow enough for tornado stall, controllable
   r_tip = 6–10mm (F, XF):  moderate width → flower pattern (if μ high enough)
   r_tip = 10–15mm (RF, XF) wide → flower (RF) or erratic (XF — too low μ)
   r_tip > 15mm (GF, WF):   very wide → maximum movement, no controlled pattern

   Physics test (can the bey achieve a circular orbit?):
   Required centripetal force: F_c = m × v² / r_orbit
   Available friction force: F_f = μ × m × g
   Condition: F_f ≥ F_c → μ × g ≥ v² / r_orbit → r_orbit ≥ v² / (μ × g)

   For XF (μ_plastic ≈ 0.50, v ≈ 0.8 m/s):
   r_orbit_min = 0.64 / (0.50 × 9.8) = 0.13m = 130mm  ← wider than most stadiums!
   → XF cannot orbit in a tight flower pattern at normal attack speeds
   → This confirms "often switching to Tornado Stalling under inexperienced hands"
     (they try to orbit but can't → bey goes chaotically straight)
```

### Spin-Equalizing — A Distinct Stamina Mechanism

```
   SAME-SPIN STAMINA (standard stamina contest):
   ├── Both beys spin same direction
   ├── Neither bey wants to contact the other (contact = energy loss for both)
   ├── Winner = bey that holds spin longest before toppling
   └── Better same-spin stamina → narrow tip (less friction), tall track (less tilt friction)

   SPIN-EQUALIZING (opposite-spin stamina):
   ├── Left-spin bey (XF) vs right-spin opponent
   ├── When tips contact: v_rel = ω_A × r_A + ω_B × r_B (additive, Case 30)
   ├── Friction transfers spin from faster bey to slower — specifically:
   │   - At equal spin: each takes from the other equally → neither gains
   │   - If opponent is weakening: XF steals spin, opponent weakens faster
   └── At the END of a spin-equalizing match:
       The two beys will have EQUAL spin (friction drove them to equilibrium)
       But XF had MORE momentum to start → stabilizes at a higher final spin → wins

   Wait — actually spin-equalization means they approach the same spin speed:
   If XF starts at ω_0 and opponent at -ω_0 (opposite):
   Total angular momentum = I_XF × ω_0 - I_opp × ω_0 = (I_XF - I_opp) × ω_0
   At equilibrium: both spinning in the same direction (L wins or R wins)
   If I_XF = I_opp: both reach zero → tie
   If I_XF > I_opp: XF's angular momentum dominates → opponent reverses direction,
                     XF wins spin-out

   Wide tip (XF) at LOW spin = stable contact → can maintain spin-equalization
   Narrow tip (MF, metal) at LOW spin = bey tilts heavily → tips over before equalization
   → XF stays upright during equalization phase → completes the steal
   → MF topples before completion → doesn't achieve equalization
```

```
   Why MF topples in opposite-spin / spin-equalizing:

   At low spin, stability requires: spin × I > τ_tilt × Δt_match_remaining
   MF: taller bey → larger h_com → larger gravity tilt torque (τ_gravity = m×g×h_com×sin(θ))
   At low spin: gyroscopic resistance falls → MF's tilt grows → MF topples
   XF: shorter track + wider tip → smaller h_com → smaller gravity tilt torque
   → XF maintains upright longer at low spin → survives the equalization phase

   This matches: "MF is a taller Bottom, and its metal tip is smaller than XF's plastic tip,
   making it better in conventional same-spin Stamina. On the other hand, XF's shorter height
   and wider tip allows for more precession, making it a better choice for spin-equalizing."
```

### XF vs RF — Same Diameter, Different Material

```
   Both at r_contact ≈ 15mm. The only difference: rubber (RF) vs plastic (XF).

   ┌──────────┬───────────────────────────────────────────────────────────┐
   │ Property │ RF (rubber)                   │ XF (plastic)              │
   ├──────────┼───────────────────────────────┼───────────────────────────┤
   │ μ_tip    │ 0.85–0.90 (rubber)            │ 0.45–0.55 (plastic)       │
   ├──────────┼───────────────────────────────┼───────────────────────────┤
   │ Friction │ r_orbit_min = v²/(μ×g) = 0.08m│ r_orbit_min = 0.13m      │
   │ centripet│ → can orbit in 80mm radius    │ → needs 130mm radius      │
   │ condition│ → flower pattern achievable   │ → flower fails in arena   │
   ├──────────┼───────────────────────────────┼───────────────────────────┤
   │ Stamina  │ faster spin decay (high μ)    │ slower decay (lower μ)    │
   ├──────────┼───────────────────────────────┼───────────────────────────┤
   │ Attack   │ high grip → good spin steal   │ less grip → more speed    │
   │          │ from wall contact             │ but unstable pattern      │
   ├──────────┼───────────────────────────────┼───────────────────────────┤
   │ Best use │ attack + spin steal combos    │ spin-equalizing + speed   │
   └──────────┴───────────────────────────────┴───────────────────────────┘
```

### XF Layer Profile and State Variables

```typescript
   XF profile:
   layers = [{
     innerR: 0,
     outerR: 15mm,           // same diameter as RF
     innerZ: 0, outerZ: 0,  // flat disc (doesn't contact floor)
     chamfer: 90°,
     friction: 0,            // disc face doesn't contact floor
     restitution: 0,
     material: 'plastic',
     freeSpin: false,
   }]
   // Four discrete tabs ON TOP of the flat disc:
   tabs: {
     count: 4,
     radius: 15mm,           // at outer edge of disc
     tabFriction: 0.50,      // plastic
     tabRestitution: 0.65,
     tabArcDegrees: 15,      // how many degrees each tab spans
   }

   // Effective contact radius (always r_XF — tabs are at rim):
   effectiveContactRadius = 15mm  (constant regardless of tilt, unlike spherical tips)

   // Effective friction (speed-dependent):
   function effectiveFriction(omega: number, tabs: TabConfig): number {
     const duty = (tabs.tabArcDegrees / 360) * tabs.count;
     const blurThreshold = 200;  // rad/s above which tabs blur to continuous
     const t = Math.min(omega / blurThreshold, 1.0);
     return lerp(tabs.tabFriction * duty, tabs.tabFriction, t);
     // Low spin: reduced friction (duty cycle)
     // High spin: full friction (blur, effectively continuous)
   }
```

---

## Case 34 — Metal Flat (MF): The Metal Friction Paradox and Tornado Stalling

Metal Flat introduces the **metal friction paradox**: a metal tip that has *more traction* than a plastic flat tip but *faster movement* because metal's lower kinetic friction coefficient at the sliding interface dominates over its higher static friction. This is the first case where the material property (metal vs plastic) changes the dynamic contact regime rather than just scaling a constant μ.

### The Paradox — Less Friction = More Traction

```
   PLASTIC FLAT (F):
   Surface roughness at micro-scale: many small asperities
   At any contact point: asperities interlock → high static friction
   BUT: once sliding starts, asperities shear readily → high kinetic friction too
   μ_static  ≈ 0.60  (plastic)
   μ_kinetic ≈ 0.50  (plastic — close to static)
   μ_ratio = μ_kinetic / μ_static ≈ 0.83   (small gap between static and kinetic)

   METAL FLAT (MF):
   Surface roughness at micro-scale: very smooth, hard surface
   At any contact point: few asperities, but when they lock they REALLY lock
   μ_static  ≈ 0.70  (metal-on-stadium-surface — hard surface grips plastic better)
   μ_kinetic ≈ 0.25  (metal — dramatically lower once sliding begins)
   μ_ratio = μ_kinetic / μ_static ≈ 0.36   (LARGE gap between static and kinetic)

   "More traction" = higher μ_static → harder to START sliding
   "Less friction" = lower μ_kinetic → MUCH easier to slide once moving
   "More speed" = once the tip breaks static friction, it slides with very low resistance
```

```
   In practice — what this means per tick:

   Tick 1 (bey just launched, velocity = 0):
   Floor applies NO sliding friction (bey is stationary relative to floor contact)
   → Static friction constraint → bey stays put until spin-driven precession exceeds μ_static × N
   MF: higher μ_static → precession must build up more before bey starts moving
   F:  lower μ_static → precession breaks static grip sooner → earlier drift onset

   Tick N (bey already moving at v > 0):
   Floor applies KINETIC friction = μ_kinetic × N
   MF: μ_kinetic = 0.25 → very low resistance to existing motion → bey slides freely
   F:  μ_kinetic = 0.50 → moderate resistance → slower movement
   
   Net: MF starts moving later but then slides faster and more freely than F.
   This is the paradox resolved: "traction" (static) ≠ "friction during movement" (kinetic).
```

### Static vs Kinetic in the Physics Model

```
   Current model (scalar μ_tip): assumes μ is constant → cannot capture this behaviour.
   Correct model: two μ values with a transition based on slip velocity.

   Stribeck curve (simplified):
   μ
   ↑
   │  μ_static ████
   │             ╲
   │              ╲______ μ_kinetic (flat, much lower)
   └────────────────────────────► slip velocity (v_slip = v_contact - v_floor)
              v_slip = 0    v_slip > v_threshold

   Implementation:
   v_slip_threshold = 0.05 m/s  (below this: static regime; above: kinetic)

   function tipFriction(tipState: TipFrictionState, v_slip: number): number {
     if (v_slip < tipState.staticThreshold) {
       // Static regime: friction can be up to μ_static, but equals whatever resists motion
       return tipState.muStatic;
     } else {
       // Kinetic regime: constant kinetic friction
       return tipState.muKinetic;
     }
   }

   TipFrictionState for MF:   { muStatic: 0.70, muKinetic: 0.25, staticThreshold: 0.05 }
   TipFrictionState for F:    { muStatic: 0.60, muKinetic: 0.50, staticThreshold: 0.05 }
   TipFrictionState for RF:   { muStatic: 0.90, muKinetic: 0.85, staticThreshold: 0.02 }  ← rubber: gap is tiny
   TipFrictionState for S:    { muStatic: 0.80, muKinetic: 0.60, staticThreshold: 0.10 }  ← sharp tip, higher threshold
```

### Why MF Beats F in Same-Spin Stamina

```
   Same-spin stamina contest: both beys spinning same direction, minimal contact.
   The stamina-determining factor is how much spin each bey loses to tip friction per tick.

   Spin loss per tick:  Δω = μ_kinetic × m × g × r_contact / I × dt

   For MF (μ_kinetic = 0.25, r_contact small due to metal tip geometry ≈ 3mm):
   Δω_MF = 0.25 × m × g × 3mm / I × dt   (very small)

   For F (μ_kinetic = 0.50, r_contact ≈ 8mm flat disc):
   Δω_F  = 0.50 × m × g × 8mm / I × dt   (larger, even though F has lower μ_static)

   MF wins on both counts: lower μ_kinetic AND smaller r_contact (small metal point).
   The combination gives MF dramatically lower spin decay rate.

   BUT: MF is taller (standard height, not low track) → h_com is larger →
   more gravity tilt torque when bey wobbles → faster tilt growth at low spin.
   MF's stamina advantage is at HIGH spin; at LOW spin it tilts faster than F.
```

### MF and the Sliding Shoot Pattern

```
   "Metal Flat can keep the sliding shoot pattern"

   Sliding shoot = launching the bey at an angle such that it slides across
   the stadium floor in a straight line, building up speed before hitting opponent.

   Standard flat (F): μ_kinetic = 0.50 → friction decelerates the sliding bey quickly
   → Sliding shoot loses momentum rapidly → bey decelerates to normal orbit before contact

   Metal Flat (MF): μ_kinetic = 0.25 → much less deceleration during the slide
   → Bey maintains its lateral sliding velocity for longer → full-speed contact with opponent
   → Ring-out potential before the opponent's bey can react

   Physics of the sliding shoot:
   v(t) = v_0 × exp(-μ_kinetic × g / v_characteristic × t)   (velocity decay)

   At μ_kinetic = 0.50: half-life of the sliding velocity ≈ shorter
   At μ_kinetic = 0.25: half-life ≈ 2× longer → MF retains speed 2× as long

   Sliding shoot final impact velocity:
   v_impact_MF ≈ v_0 × 0.70    (30% lost to friction on the way)
   v_impact_F  ≈ v_0 × 0.45    (55% lost — much more deceleration)
   → MF hits at 1.56× the speed of F for the same launch velocity
```

### Tornado Stalling With MF

```
   Tornado stalling = tight orbital pattern near the stadium wall (Case 33).
   Requires: tip that can maintain a small orbit radius.

   r_orbit_min = v² / (μ_kinetic × g)

   MF at v = 0.4 m/s (low-speed orbit):
   r_orbit_min = 0.16 / (0.25 × 9.8) = 0.065m = 65mm   ← tight orbit possible!

   F at v = 0.4 m/s:
   r_orbit_min = 0.16 / (0.50 × 9.8) = 0.033m = 33mm   ← even tighter possible, but F
                                                           is SLOWER, so v is often higher
   XF at v = 0.8 m/s (fast due to high initial momentum):
   r_orbit_min = 0.64 / (0.25 × 9.8) = 0.130m = 130mm  ← too wide (Case 33)

   MF achieves tornado stall because:
   ├── Low μ_kinetic → fast sliding → bey builds up good orbital speed
   ├── Small contact radius (metal point ≈ 3mm) → precise steering
   └── At v = 0.4–0.6 m/s orbital speed: r_orbit_min ≈ 65–98mm → fits inside most arenas

   Why MF works where XF fails at tornado stall:
   XF is wide (r_contact = 15mm) → generates MORE friction torque → accelerates to HIGHER v
   But: higher v → larger r_orbit_min → can't maintain tight orbit
   MF is narrow (r_contact = 3mm) → generates less torque → maintains moderate v
   → moderate v → small r_orbit_min → tornado stall achievable
```

```
   Tornado stall diagram (MF in a 100mm radius arena):

   ┌────────────────────────────┐
   │        ARENA WALL          │
   │  ○○○○○○○○○○○○○○○○○○○○○   │  ← MF bey orbiting near wall
   │  ○                   ○    │    orbit radius ≈ 70mm (arena radius - wall zone)
   │  ○     OPPONENT      ○    │    opponent in center: can't reach the orbiting bey
   │  ○       HERE        ○    │    easily — must chase
   │  ○○○○○○○○○○○○○○○○○○○○○   │
   └────────────────────────────┘

   MF bey strategy: orbit at high speed → opponent chases → MF controls the tempo
   When opponent comes close: MF's orbital velocity converts to attack velocity on contact
   → High-speed impact from the orbital tangent direction → ring-out threat
```

### MF Layer Profile

```typescript
   MF profile:
   layers = [{
     innerR: 0,
     outerR: 3mm,          // small metal point (like S tip but flat)
     innerZ: 0, outerZ: 0,
     chamfer: 90°,
     material: 'metal',
     muStatic: 0.70,       // high static: hard to start moving
     muKinetic: 0.25,      // low kinetic: fast sliding once moving
     restitution: 0.75,    // metal: elastic bounce
     freeSpin: false,
   }]

   // Height: MF is mounted on the standard 145 track (not a low track)
   // h_com ≈ standard height → more tilt sensitivity vs short-track combos
   // Best paired with: light wheel (lower I → lower centripetal force → tighter orbit)
   //                   or heavy wheel if stamina is the goal (higher I → slower ω decay)
```

---

## Case 35 — Claw 145 (C145): Centrifugal Wing Extension and Impact-Buffered Defense

> **Stock combo (Flame Sagittario C145S):** Clear Wheel: Sagittario · Metal Wheel: Flame · Track: C145 · Bottom: Sharp
> **Stock combo (Archer Gryph C145S):** Chrome Wheel(s): Gryph · Crystal Wheel: Archer · Track: C145 · Bottom: Sharp

Claw 145 introduces a third free-moving track element after C145 (Case 29 gravity balls) and Kreis (Case 16 partial free-spin frame): **centrifugal wing extension**. The wings are not spring-loaded or rubber-cushioned — they extend purely because spin provides centrifugal force, and they fold back when spin drops or they absorb an impact. This is a one-way centrifugal latch with an impact-release mechanism.

### Wing Geometry — Three Free-Pivoting Arms

```
   C145 top view (tip pointing DOWN, wings shown extended):

        ╔═══╗     ╔═══╗
       ╱     ╲   ╱     ╲
   ╔══╝       ╚═╝       ╚══╗   ← 3 wings at 120° intervals
   ║   [wing]       [wing]  ║
   ╚══╗       ╔═╗       ╔══╝
       ╲     ╱   ╲     ╱
        ╚═══╝     ╚═══╝
              ↑
          [wing]
         center hub

   Each wing:
   ├── Pivots around a pin at the INNER end (attached to track hub)
   ├── Outer end is FREE (no spring, no rubber — only centrifugal force holds it out)
   └── At high spin: centrifugal force > gravity component → wing extends OUTWARD
       At low spin:  centrifugal force < gravity component → wing droops INWARD
```

```
   Side view (one wing, extended vs folded):

   EXTENDED (high spin):                FOLDED (low spin / impact):

   hub──[pivot]──────[wing tip]         hub──[pivot]
        │                               │     ╲
        │ centrifugal F_c → outward          [wing tip] (droops down/inward)
        │ gravity F_g → inward
        │ F_c > F_g → stays out
   ════════════════ floor          ════════════════ floor

   Wing tip height above floor when extended: h_wing = h_145 ≈ 14.5mm
   Wing radius from spin axis when extended:  r_wing ≈ 18–20mm (wide span)
   Wing tip height when folded: h_wing ≈ 8–10mm (draped, closer to floor)
   Wing radius from spin axis when folded:    r_wing_folded ≈ 8mm (pulled inward)
```

### Centrifugal Extension Threshold

```
   Wing extends when: F_centrifugal > F_gravity_component

   F_centrifugal = m_wing × ω² × r_cog_wing
   F_gravity_component = m_wing × g × sin(tilt_of_wing)   (component pulling wing inward)
   (when bey is upright: tilt_of_wing ≈ 90° → F_gravity_component = m_wing × g)

   Extension threshold:
   ω² × r_cog_wing > g
   ω_extend = sqrt(g / r_cog_wing)

   For r_cog_wing ≈ 12mm = 0.012m:
   ω_extend = sqrt(9.8 / 0.012) ≈ 28.6 rad/s

   At launch: ω ≈ 300+ rad/s → ω >> ω_extend → wings snap out immediately on launch
   At end of match: ω falls toward 28.6 rad/s before wings begin to fold

   Percentage of maxSpin at which wings fold:
   ω_fold / ω_max ≈ 28.6 / 300 ≈ 9.5%   → wings stay out for 90%+ of the match
   → Wing folding only occurs at near-zero spin (not a mid-match event)
```

```
   Wing extension state machine:

   ω > ω_extend:  wings EXTENDED → r_wing_active = r_wing_outer (18–20mm)
   ω ≤ ω_extend:  wings FOLDING → r_wing_active transitions to r_wing_folded (8mm)
                  transition time: ~3–5 ticks (gravity pulls wing inward)

   During the fold:
   r_wing(t) = r_wing_outer × (ω / ω_extend)  for ω ≤ ω_extend
             → linear interpolation from extended to folded radius
```

### Impact-Release: Why Wings Have Low Spin Loss on Low Hits

```
   "Free moving nature make them very effective for defensive purposes,
    as they are able to withstand low hits to the Spin Track without significant spin loss"

   This is the IMPACT-RELEASE mechanism — the key property of free-pivoting wings vs fixed wings (R145):

   FIXED wing (R145):
   Opponent hits wing → impulse J transmitted directly to track hub → to Core → spin loss
   τ_spinloss = J × r_wing / I_bey    (full lever arm)
   → Spin decelerates by ΔωRUBBER = τ / I

   FREE-PIVOTING wing (C145):
   Opponent hits wing → impulse J causes wing to ROTATE around its pivot
   Wing absorbs the impulse by rotating inward (folding):
   J_absorbed_by_wing_rotation = J × (I_wing / (I_wing + I_bey)) ← mass ratio partition

   Since I_wing << I_bey (wing is small, bey is large):
   J to bey = J × I_bey / (I_wing + I_bey) ≈ J × I_bey / I_bey = J × (very high fraction)

   Wait — the wing can FOLD instead of transmitting force:
   If the impact causes the wing to fold INWARD before the impulse reaches the hub:
   ├── Wing rotates around pivot under the impulse (not the bey Core)
   ├── Wing kinetic energy = J²/(2×I_wing) → absorbed in wing rotation, not bey spin
   └── Only the pivot friction force transmits to the Core: τ_pivot = f_pivot × J
       f_pivot << 1 → tiny fraction of J reaches the Core → minimal spin loss
```

```
   Spin loss comparison (low hit on track, same J):

   Fixed wing (R145):
   Δω_bey = J × r_wing / I_bey                    → FULL spin loss from full impulse

   Free-pivoting wing (C145):
   Wing folds under J → absorbs most of J
   Δω_bey = (J × f_pivot) × r_hub / I_bey         → SMALL spin loss (f_pivot ≈ 0.05–0.15)
   → ~7–20× less spin loss than R145 for the same low hit

   This is why C145 "withstands low hits without significant spin loss":
   The wing is the sacrificial element — it moves, the Core doesn't.
```

```
   Wing fold angle per hit:

   After absorbing impulse J, the wing rotates by:
   Δφ_wing = J × r_wing / I_wing   (angular impulse to wing)

   If Δφ_wing > φ_max_fold (wing can only fold so far before hitting a stop):
   Remaining impulse DOES reach the Core:
   J_overflow = max(0, J - I_wing × φ_max_fold / r_wing)
   Δω_bey = J_overflow × r_hub / I_bey

   Strong hits → wing hits its fold stop → overflow → some spin loss
   Weak hits   → wing absorbs entirely → zero spin loss
   
   Threshold hit strength for overflow:
   J_threshold = I_wing × φ_max_fold / r_wing   (wing fully absorbs below this)
```

### Weight Distribution — Heavier Track, Higher I Contribution

```
   C145 vs standard 145:
   Three extra plastic wings add mass at r_wing ≈ 15mm from spin axis.
   Estimated wing mass: 3 wings × 0.8g each = 2.4g at r = 15mm

   ΔI_C145 = 0.0024 × 0.015² = 5.4×10⁻⁷ kg·m²

   Standard 145 track: mostly hub mass at r ≈ 5mm → I_track ≈ small
   C145 adds ~5.4×10⁻⁷ to I → not large, but non-negligible:
   fraction of total I: 5.4×10⁻⁷ / 1.5×10⁻⁵ ≈ 3.6% more gyroscopic stability

   The heavier track also contributes to:
   ├── Higher total bey mass → harder to ring-out (more momentum)
   └── More centrifugal force on the wings themselves → quicker extension at launch
```

```
   State variables for C145:

   interface C145State {
     wings: [{
       angle: number;         // current fold angle from extended position (radians)
       omega: number;         // current angular velocity of this wing (rad/s)
       extended: boolean;     // is this wing currently in the extended state?
     }, {}, {}];              // one per wing (3 wings)
     r_wing_active: number;   // effective tip radius (varies with fold state)
   }

   function tickC145Wings(bey: BeyState, c145: C145State, dt: number) {
     const omega_bey = bey.spin / bey.I;
     const ω_extend = Math.sqrt(G / R_COG_WING);

     for (const wing of c145.wings) {
       if (omega_bey > ω_extend) {
         // Centrifugal force pushes wing out
         const alpha = omega_bey * omega_bey * R_COG_WING - G;  // net outward acceleration
         wing.omega += alpha * dt;
         wing.angle = Math.max(0, wing.angle - wing.omega * dt);  // 0 = fully extended
         wing.extended = wing.angle < 0.05;
       } else {
         // Gravity folds wing inward
         wing.omega -= G * dt;
         wing.angle = Math.min(MAX_FOLD_ANGLE, wing.angle + Math.abs(wing.omega) * dt);
         wing.extended = false;
       }
     }

     // r_wing_active = weighted average of individual wing radii
     const avgFold = c145.wings.reduce((s, w) => s + w.angle, 0) / 3;
     c145.r_wing_active = lerp(R_WING_OUTER, R_WING_FOLDED, avgFold / MAX_FOLD_ANGLE);
   }

   function applyHitToC145Wing(
     bey: BeyState, c145: C145State, wingIndex: number, J: number, dt: number
   ) {
     const wing = c145.wings[wingIndex];
     // Wing absorbs impulse by rotating inward
     const alpha_wing = J * c145.r_wing_active / I_WING;
     wing.omega += alpha_wing;
     wing.angle += wing.omega * dt;
     wing.angle = Math.min(MAX_FOLD_ANGLE, wing.angle);

     // Overflow to Core if wing hits fold stop
     if (wing.angle >= MAX_FOLD_ANGLE) {
       const J_overflow = (alpha_wing * dt - MAX_FOLD_ANGLE) * I_WING / c145.r_wing_active;
       bey.spin -= J_overflow * R_HUB / bey.I;
     }
     // else: zero Core spin loss
   }
```

---

## Case 36 — Spike (S): Minimum Friction, Maximum Instability — The Reference Destabilization Tip

Spike (S) is the anti-stamina tip: a single sharp point with the smallest possible contact radius and the highest static-to-kinetic friction ratio of any fixed tip. It has almost no movement because ground friction is near zero, but it is the easiest tip to destabilize because any hit produces a massive torque (the pivot arm spans the full bey height from tip to contact point, Case 9).

### Geometry — Single Contact Point at the Spin Axis

```
   S tip cross-section (side view, tip pointing DOWN):

        ║  ← upper cylinder body
        ║
       ╱║╲  ← steep cone / frustum section
      ╱  ║  ╲   cone angle ≈ 20° from vertical (STEEP, nearly cylindrical)
     ╱   ║   ╲
    ╱    ║    ╲
   ╱     ║     ╲
         ║
        [·]  ← single POINT at spin axis center (r ≈ 0)
   ═══════════  floor

   Contact radius: r_contact ≈ 0.3–0.5mm  (nearly zero — true point contact)
   The steep cone above the point ensures ONLY the point touches the floor
   even at moderate tilt angles (θ up to ~30° before the cone edge grazes).
```

```
   Comparison of contact radii:

   Tip     │ r_contact (upright)  │ Notes
   ────────┼─────────────────────┼──────────────────────────────────────────
   WF/RF   │ 12–15mm             │ wide disc contacts floor uniformly
   F       │ 8mm                 │ flat disc, moderate area
   XF      │ 15mm (tabs)         │ at rim, discrete
   SF      │ 1–2mm (inner flat)  │ blunted point, some area
   S       │ 0.3–0.5mm           │ TRUE POINT — minimum possible
   MF      │ 3mm                 │ small metal flat
   B       │ r_sphere × sin(θ)   │ spherical, tilt-dependent
```

### Near-Zero Friction Torque — Why S Has Minimal Movement

```
   Ground friction torque:
   τ = μ_kinetic × m × g × r_contact

   For S (r_contact ≈ 0.4mm = 0.0004m, μ_metal = 0.25 kinetic):
   τ_S = 0.25 × 0.045 × 9.8 × 0.0004 = 4.4×10⁻⁵ N·m

   For F (r_contact ≈ 8mm = 0.008m, μ_plastic = 0.50 kinetic):
   τ_F = 0.50 × 0.045 × 9.8 × 0.008 = 1.76×10⁻³ N·m

   τ_S / τ_F ≈ 0.025  → S generates 40× less friction torque than F

   This tiny torque means:
   ├── Precession rate: Ω_p = τ / (I × ω) → near zero → bey barely wanders
   ├── Spin decay: dω/dt = -τ / I → very slow → excellent spin retention
   └── Movement: essentially none until the bey tilts significantly

   "Very little friction between tip and stadium surface" →
   "Has little movement" — confirmed by the physics.
```

### Why S Is Easily Knocked Off Balance — Maximum Torque Arm

```
   From Case 9 (floor constraint): when a floor-constrained bey is hit,
   the tip is the pivot point. Torque arm = distance from tip to contact point.

   For S tip (contact point is at spin axis, r = 0):
   The tip is at the LOWEST POINT of the bey, on the spin axis.
   When an opponent's AR hits the S bey at height h_hit:
   τ = r_tip_to_contact × F = h_hit × F   ← h_hit is the FULL HEIGHT from floor

   This is the maximum possible torque arm — the hit force is applied at full bey height.

   Compare to WF (wide flat, contact at r = 15mm from axis):
   The tip slides more easily → torque arm is h_hit - (tip slides distance)
   AND the wide contact means the tip resists the sliding → shorter effective arm

   S tip: tip cannot slide (stuck at spin axis) → FULL TORQUE ARM every hit.
   → Any hit, no matter how small, creates maximum possible tilt torque.
   → Tilt change per hit: Δθ = (h_hit × F) / (I × ω) — grows with h_hit
   → Even a glancing hit causes measurable tilt (the "easily knocked off balance")
```

```
   Tilt per hit comparison (same force F, same hit height h_hit = 10mm):

   WF tip: τ_eff ≈ F × (h_hit - r_slide)  → tilt Δθ_WF (small, tip slides)
   S tip:  τ_eff = F × h_hit              → tilt Δθ_S  = F×10mm / (I×ω)

   Δθ_S / Δθ_WF ≈ 3–5×  (S takes 3–5× more tilt per hit than WF)

   Additionally: once tilted, S tip has near-zero ground friction torque to correct it.
   WF generates large friction torque → partially self-corrects after a tilt.
   S generates near-zero friction → tilt persists until gyroscopic precession naturally damps.

   Self-correction rate:
   WF: τ_friction / (I × ω) ≈ 1.76×10⁻³ / (1.5×10⁻⁵ × 300) = 0.39 rad/s²  (corrects quickly)
   S:  τ_friction / (I × ω) ≈ 4.4×10⁻⁵ / (1.5×10⁻⁵ × 300)  = 0.010 rad/s² (corrects 39× slower)

   → S accumulates tilt hits without meaningful self-correction → eventually topples.
```

### The Cone — Tilt-Dependent Contact Radius Increase

```
   S's contact radius is NOT always zero. As tilt increases, the steep cone contacts:

   θ_cone_contact = arctan(r_cone_outer / h_cone_height)
                  ≈ arctan(6mm / 20mm) = 16.7°   (for a typical S geometry)

   Below θ ≈ 17°: only the point contacts → near-zero r_contact
   Above θ ≈ 17°: cone edge contacts floor → r_contact grows with tilt

   At θ = 30°: r_contact ≈ (30° - 17°) / (90° - 17°) × r_cone_outer
              ≈ (13/73) × 6mm ≈ 1.1mm   (still tiny, but not zero)
   At θ = 45°: r_contact ≈ (28/73) × 6mm ≈ 2.3mm

   The cone edge IS the Case 15 SF model applied to S:
   S profile = SF profile but with NO flat inner disc (the point IS the inner disc at r=0)
   The cone above the point → same layer 2 physics as SF (Case 15)

   Practical consequence:
   At low spin → tilt increases → cone contacts → friction torque increases slightly
   → More movement starts (bey wanders slowly) → slightly self-stabilizing at high tilt
   → But: high tilt = near-toppling anyway → this "stabilization" comes too late
```

### S Layer Profile

```typescript
   S profile:
   layers = [
     // Layer 1: the point (near-zero radius, essentially a singularity)
     { innerR: 0,    outerR: 0.5mm, innerZ: 0, outerZ: 0,
       chamfer: 90°,
       muStatic: 0.80,   // metal on plastic stadium: high static
       muKinetic: 0.25,  // metal: very low kinetic
       restitution: 0.80, material: 'metal', freeSpin: false,
       profile: 'flat' },

     // Layer 2: steep cone above the point
     { innerR: 0.5mm, outerR: 6mm, innerZ: 0, outerZ: 20mm,
       chamfer: 20°,   // steep (almost vertical wall)
       muStatic: 0.70, muKinetic: 0.25, restitution: 0.75, material: 'metal',
       freeSpin: false, profile: 'flat' }
     // Layer 2 contacts floor only when θ > θ_cone_contact ≈ 17°
   ]

   // Effective r_contact at any tilt θ:
   function resolveS_contact(theta: number): number {
     const theta_cone = 17 * DEG2RAD;
     if (theta < theta_cone) return 0.0004;  // just the point (0.4mm)
     // Linear interpolation from point to cone outer radius
     const t = (theta - theta_cone) / (Math.PI/2 - theta_cone);
     return lerp(0.0004, 0.006, t);
   }
```

### S Use Cases — Where Near-Zero Movement Is Desirable

```
   Despite its fragility, S has specific competitive scenarios:

   1. STAMINA VS STAMINA (same-spin, no hitting):
   If neither bey attacks the other, S conserves spin best of any tip.
   τ_decay = near-zero → S wins purely on spin duration.
   Used when the strategy is: do not get hit, wait for opponent to die.

   2. TALL TRACK COMBINATIONS (High Track + S):
   Very tall track → h_com large → S's pivot arm effect is MAXIMIZED
   → Any hit is even MORE destabilizing
   This is used OFFENSIVELY: launch a tall-S bey so that even small contacts
   from the opponent's weaker hits cause the opponent to wobble (if opponent is on S).
   → The S bey itself is vulnerable, but if the opponent is ALSO on S, the hit
     dynamics are symmetric and spin duration wins.

   3. TRYOUT / PRACTICE:
   S's near-immobility makes it easy to study the effects of other parts.
   The bey stays roughly in place, simplifying single-variable tests.

   4. VERY HEAVY WHEEL COMBOS (high I → tilt from hits reduced):
   If I is very large (Phantom + S): Δθ per hit = F×h / (I×ω) → small if I is large
   Phantom's I reduces the per-hit tilt that S would otherwise amplify.
   → "Tanky" S combo: survives despite S's fragility because I compensates.
```

```
   S vs MF in a pure stamina contest (same spin, no hitting):

   spin%  │ S                     │ MF
   ────── ┼───────────────────────┼────────────────────────────────────────
   100%   │ near-zero spin decay  │ ~2.5× more decay (r_contact = 3mm vs 0.4mm)
    80%   │ slight drift starting │ more drift, tornado stall building
    60%   │ cone contact begins   │ actively orbiting (tornado stall or wander)
    40%   │ tilt growing fast     │ moderate tilt (MF drifts → more ground torque)
    20%   │ wide wobble           │ still somewhat controlled
     0%   │ stops                 │ stops after S (MF decayed faster)

   Winner (no hitting): S by spin duration.
   Winner (with hitting): MF by tilt resistance + speed to escape hits.
```

---

## Case 37 — Wing 105 (W105): Aerodynamic Fin Track and Why Airflow Effects Are Negligible at Beyblade Scale

> **Stock combo (Galaxy Pegasis W105R²F):** Clear Wheel: Pegasis II · Metal Wheel: Galaxy · Track: W105 · Bottom: R²F

Wing 105 attempts to use **aerodynamic lift** (upward airflow deflection from angled fins) to supplement stamina. The images confirm its geometry: a square hub body with two swept horizontal fins (resembling delta wings) replacing the standard 105's handle-bar nubs. This case demonstrates why aerodynamic effects are negligible in Beyblade physics and reduces W105 to a **mass-distribution-only track** whose only real advantage over standard 105 is slightly higher I from the fins.

### Fin Geometry — Two Swept Delta Fins at Track Level

```
   W105 top view (from above, fins horizontal):

        ┌───────────────────────────────┐
       ╱   ← FIN (swept, angled face)  ╲
      │     wide outer end              │
       ╲   narrow root at hub          ╱
        │     ┌─────────────────┐     │
        │     │   CENTER HUB   │     │
        │     │   (square body)│     │
        │     └─────────────────┘     │
       ╱   narrow root                 ╲
      │     wide outer end              │
       ╲   → FIN (swept, opposite)    ╱
        └───────────────────────────────┘

   Two fins at 180° (bilateral symmetry, NOT 3-fold like C145 or R145).
   Each fin: narrow root at hub, wide swept tip extending outward.
   Fin faces are angled upward (like a wing generating upwash).
   Standard 105 handle-bars: short cylindrical nubs at 90° — totally different shape.
```

```
   W105 side view (fins horizontal, pointing outward from hub):

        ║  Energy Ring / Fusion Wheel above
        ║
   ─────╫────────────────────────┐  ← FIN (angled face, wide)
        ║  track hub             │    fin angle ≈ 15–20° from horizontal
   ─────╫────────────────────────┘    (intended to deflect airflow upward)
        ║
        tip
   ═══════════ floor
```

### Why Airflow Effects Are Negligible

```
   The proposed mechanism: fins spin → deflect airflow upward → "downforce" reaction
   pushes bey body DOWN → presses tip more firmly into floor → more stability / stamina.

   The actual force at Beyblade scale:

   Aerodynamic lift force:  F_lift = ½ × ρ_air × v_tip² × A_fin × C_L

   Where:
   ρ_air = 1.2 kg/m³
   v_tip = ω × r_fin ≈ 300 rad/s × 0.020m = 6 m/s  (fin tip velocity at full spin)
   A_fin = 0.015m × 0.010m = 1.5×10⁻⁴ m²  (rough fin area, small)
   C_L   ≈ 0.5  (generous lift coefficient for this fin shape)

   F_lift = ½ × 1.2 × 36 × 1.5×10⁻⁴ × 0.5 = 1.62×10⁻³ N

   Weight of the bey:
   F_weight = m × g = 0.045 × 9.8 = 0.441 N

   Ratio: F_lift / F_weight = 1.62×10⁻³ / 0.441 ≈ 0.37%

   The aerodynamic lift is 0.37% of the bey's weight.
   This changes the normal force by 0.37% → friction changes by 0.37%.
   → Change in spin decay rate: 0.37% of the total → unmeasurable in practice.

   At lower spin (ω = 100 rad/s, mid-match):
   v_tip = 100 × 0.020 = 2 m/s → F_lift ∝ v² → 9× smaller → 0.04% of weight
   → Completely negligible at any realistic spin speed.

   This is why "the effect is barely noticeable" — not barely, it is physically
   too small to measure without laboratory instruments. W105 ≈ standard 105 aerodynamically.
```

```
   Comparison to C145 R145 aerodynamic claims:

   DF145 ("Down Force 145"): same calculation applies.
   DF145 fins generate: F_lift ≈ 2×10⁻³ N (larger fin area than W105)
   Still: 0.45% of bey weight → negligible.
   → DF145's performance difference vs 145 also comes from MASS distribution, not aerodynamics.

   The "airflow" feature is a marketing narrative for all fin-equipped tracks.
   The REAL physics is purely mass distribution (I contribution).
```

### What W105 Actually Does — Mass at Fin Radius

```
   The two fins ARE real objects with real mass, placed at real radius.
   That mass contributes real I, regardless of their intended aerodynamic purpose.

   Fin mass estimate: 2 fins × 0.6g each = 1.2g at r_fin ≈ 16mm

   ΔI_W105 = 0.0012 × 0.016² = 3.1×10⁻⁷ kg·m²

   Standard 105 nubs (cylinder stubs): 2 nubs × 0.3g each at r ≈ 10mm
   ΔI_105   = 0.0006 × 0.010² = 6.0×10⁻⁸ kg·m²

   ΔI_W105 - ΔI_105 = 3.1×10⁻⁷ - 6.0×10⁻⁸ = 2.5×10⁻⁷ kg·m²

   Total bey I ≈ 1.5×10⁻⁵ kg·m²
   W105 I advantage over 105: 2.5×10⁻⁷ / 1.5×10⁻⁵ ≈ 1.7% more I

   1.7% more I:
   ├── 1.7% slower spin decay (same friction torque)
   ├── 1.7% more gyroscopic stiffness (harder to tilt per hit)
   └── "Performs just like an average 105" — because 1.7% is below perceptible threshold

   W105 IS slightly better than 105 (1.7% I advantage) — this is the "slightly better Defense"
   noted in the wiki. But it is smaller than the performance difference between major tracks
   (145 vs 85 ≈ 40% difference in h_com-related effects).
```

### Bilateral vs Three-Fold Symmetry — Physics Consequence

```
   R145: 3 wings at 120° → 3-fold symmetry → I is isotropic (same in all radial directions)
   C145: 3 wings at 120° → same → isotropic I
   W105: 2 fins at 180° → BILATERAL symmetry → I is ANISOTROPIC

   For a body with bilateral symmetry:
   I_principal_major = I about the fin axis (including fin mass)
   I_principal_minor = I about the perpendicular axis (fins barely contribute)

   I_major - I_minor = 2 × m_fin × r_fin² × sin²(90°) - 2 × m_fin × r_fin² × cos²(90°)
                     = 2 × m_fin × r_fin² (since fins are perpendicular to the minor axis)
                     = 2 × 0.0006 × 0.016² = 3.1×10⁻⁷ kg·m²

   This anisotropy means: bey's gyroscopic response is SLIGHTLY direction-dependent.
   Hits along the fin axis vs perpendicular to it produce slightly different tilt responses.
   Difference: 3.1×10⁻⁷ / 1.5×10⁻⁵ ≈ 2% → again below perceptible threshold.
   → Practically treated as isotropic (use average I).
```

### W105 in the Layer/Track System

```typescript
   // W105 extends TrackPart with fin geometry (passive — not free-moving like C145):
   interface W105State {
     // Fins are FIXED (not free-pivoting like C145)
     // No centrifugal extension — fins always extended
     finCount: 2;
     finRadius: number;       // mm: r_fin = 16mm
     finMass: number;         // g: 1.2g total for both fins
     aeroLiftCoeff: number;   // C_L = 0.5 (used but negligible)
   }

   // I contribution from fins (called at match start):
   function computeW105_I(w105: W105State): number {
     return w105.finMass * 0.001 * (w105.finRadius * 0.001) ** 2;  // kg·m²
   }

   // Aerodynamic lift (computed per tick but result is negligible — included for completeness):
   function computeW105_AeroLift(w105: W105State, bey: BeyState): number {
     const omega = bey.spin / bey.I;
     const v_tip = omega * w105.finRadius * 0.001;
     return 0.5 * AIR_DENSITY * v_tip * v_tip * FIN_AREA * w105.aeroLiftCoeff;
     // Returns ~0.001–0.003 N — negligible, but tracked for completeness
   }

   // In tickVertical: N += computeW105_AeroLift(...) → changes N by ~0.37%
   // Practical effect on spin decay: Δ(dω/dt) ≈ 0.37% × (dω/dt_base) → zero in practice
```

### W105 Position in the Track Taxonomy

```
   Track family summary (height 105, various geometries):

   ┌──────────┬──────────┬──────────┬──────────────────────────────────────────────┐
   │ Track    │ ΔI vs 105│ Active   │ Mechanism                                    │
   │          │          │ geometry?│                                              │
   ├──────────┼──────────┼──────────┼──────────────────────────────────────────────┤
   │ 105      │ baseline │ No       │ Plain hub, handle-bar stubs                  │
   ├──────────┼──────────┼──────────┼──────────────────────────────────────────────┤
   │ W105     │ +1.7%    │ No*      │ Fixed fins — mass only, not aerodynamic      │
   │          │          │ (*aero   │ *Aero is computed but negligible             │
   │          │          │  negligible)│                                           │
   ├──────────┼──────────┼──────────┼──────────────────────────────────────────────┤
   │ C145     │ +3.6%    │ YES      │ Free-pivoting wings, impact-release, centrifugal│
   ├──────────┼──────────┼──────────┼──────────────────────────────────────────────┤
   │ R145     │ +wide I  │ YES      │ Fixed rubber wings, scraping, sandwich       │
   ├──────────┼──────────┼──────────┼──────────────────────────────────────────────┤
   │ S130     │ disc I   │ YES      │ Disc arms at 130mm height, probabilistic CP  │
   └──────────┴──────────┴──────────┴──────────────────────────────────────────────┘

   W105 is the null hypothesis for "active track geometry":
   it has fins but they do nothing physics-relevant.
   C145 has wings that DO change physics (impact absorption, centrifugal dynamics).
   This contrast validates Case 35's centrifugal wing model — the fin mass alone is
   insufficient; the free-pivoting mechanism is what gives C145 its defensive property.
```

---

## Case 38 — R²F (Right Rubber Flat): Directional Star Contact Geometry and Wear-In Profile Shift

> **Stock combo (Galaxy Pegasis W105R²F):** Clear Wheel: Pegasis II · Metal Wheel: Galaxy · Track: W105 · Bottom: R²F

R²F is visually identical to RF but its six rubber curves face **rightward** rather than leftward, giving the tip a star shape. This directional bias creates a **contact regime asymmetry**: when the bey spins CCW (left, standard), the rightward-facing curve edges present their convex face to the floor and act as edge contacts rather than face contacts. This raises effective friction per unit area and produces more aggressive movement — at the cost of stamina and controllability. Wearing the tip down shifts the star geometry toward a flat disc, changing the contact regime entirely.

### Star Geometry vs Flat Disc — Two Contact Regimes

```
   RF (Left Rubber Flat):          R²F (Right Rubber Flat):

   Six leftward curves:            Six rightward curves:
   ╭──╮╭──╮╭──╮╭──╮╭──╮╭──╮      ╮──╯╮──╯╮──╯╮──╯╮──╯╮──╯
   (concave faces outward)         (convex edges outward)

   When spinning CCW (standard):

   RF curve concave face → floor:  R²F curve convex edge → floor:
   ├── Large contact area          ├── Small edge contact area
   ├── Face friction: μ_face ≈ 0.85├── Edge friction: μ_edge ≈ 0.90
   ├── Distributed load            ├── Concentrated load (stress)
   └── Stable contact              └── Unstable: edge digs in → aggressive kick

   When spinning CW (opposite):
   RF → convex edge to floor (same regime as R²F in CCW)
   R²F → concave face to floor (same regime as RF in CCW)
   → The spin direction simply swaps which curve face contacts the floor.
```

```
   Why edge contact = more aggressive movement:

   F_friction = μ × N   (Coulomb, same formula)
   But edge contact concentrates N into a tiny area:
   contact_stress = N / A_contact
   A_edge << A_face → stress_edge >> stress_face

   High contact stress → rubber deforms locally → local μ spikes above 0.85
   μ_eff_edge ≈ 0.90–0.95  (rubber edge on stadium: micro-deformation grip)

   Additionally: the curved edge acts as a CAM under spin:
   ├── As the tip rotates, each curve edge sweeps through the floor contact
   ├── The cam profile creates a small periodic lateral kick (one kick per curve edge)
   ├── 6 curves × spin frequency = 6ω/(2π) lateral micro-kicks per second
   └── These kicks add to the precession torque → more movement than RF at same spin
```

### Movement Rate Comparison — R²F vs RF

```
   Precession torque (driving movement):

   RF:   τ = μ_face × N × r_RF = 0.85 × N × 15mm = 12.75 × N   (mm × N)
   R²F:  τ = μ_edge × N × r_R²F + τ_cam_kicks
            = 0.92 × N × 15mm + τ_cam_kicks
            ≈ (13.8 + 2.0) × N = 15.8 × N   (mm × N)

   τ_R²F / τ_RF ≈ 15.8 / 12.75 ≈ 1.24  (24% more torque → faster movement)

   This matches: "faster and much more aggressive movement than RF"
   The cam kicks contribute ~15% of the additional torque;
   the higher μ_edge contributes ~9%.
```

```
   Spin decay rate comparison:

   Spin loss: dω/dt = τ_friction / I

   RF at same spin:  dω/dt = τ_RF / I
   R²F at same spin: dω/dt = τ_R²F / I  (24% faster decay)

   R²F loses spin 24% faster than RF → lower stamina.
   "Low Stamina" confirmed: more aggressive movement = faster spin death.
```

### Wear-In: Star → Flat Profile Shift

```
   NEW R²F (unworn):                WORN R²F (after practice):

   Convex edge contact:             Worn flat:
   ╮──╯ ← sharp rubber edge         ─────── ← flat rubber disc
   (star shape preserved)            (like RF worn smooth)

   As the convex edges wear down:
   ├── Contact area increases (edge → face)
   ├── μ_eff drops from 0.92 → 0.85 (face contact, same as RF)
   ├── Cam kicks diminish (smooth profile, no sharp edge to create periodic kick)
   └── Movement becomes more controlled (less erratic, more predictable orbit)

   Wear level vs contact regime:

   wear 0.0 (new):   edge contact → μ = 0.92, cam kicks active → erratic/aggressive
   wear 0.3:          mix of edge + partial face → μ = 0.88, reduced kicks → controllable
   wear 0.6:          mostly face contact → μ = 0.86, minimal kicks → near-RF behaviour
   wear 1.0 (fully worn): pure flat face → μ = 0.85, no cam kicks → identical to worn RF

   "Wear it down with a few practice battles" → moves from wear 0.0 to ~0.3–0.4
   → The 0.3 wear state is the OPTIMAL operating point: aggressive but not erratic.
```

```typescript
   interface R2FState {
     wear: number;              // 0.0–1.0 (new → fully worn flat)
     edgeFraction: number;      // computed from wear: 1.0 (new) → 0.0 (flat)
   }

   function computeR2F_edgeFraction(wear: number): number {
     // Non-linear: edges wear fastest under initial high-stress contact
     return Math.max(0, 1 - wear * 1.4);   // flat by ~wear=0.7
   }

   function computeR2F_mu(r2f: R2FState): number {
     const edgeMu = 0.92;
     const faceMu = 0.85;
     return lerp(faceMu, edgeMu, r2f.edgeFraction);
   }

   function computeR2F_camTorque(r2f: R2FState, bey: BeyState, N: number): number {
     const omega = bey.spin / bey.I;
     const camAmplitude = r2f.edgeFraction * 0.15;  // 0 when fully worn
     // 6 kicks per revolution:
     const kickFreq = 6 * omega / (2 * Math.PI);
     return camAmplitude * N * R2F_RADIUS * Math.abs(Math.sin(kickFreq * totalTime));
   }

   function tickR2F_wear(r2f: R2FState, bey: BeyState, dt: number) {
     const slipContribution = bey.tiltAngle / 90;
     const edgeWearRate = RUBBER_WEAR_BASE * (1 + r2f.edgeFraction * 0.5);
     r2f.wear = Math.min(1.0, r2f.wear + edgeWearRate * slipContribution * dt);
     r2f.edgeFraction = computeR2F_edgeFraction(r2f.wear);
   }
```

### R²F Layer Profile

```typescript
   R²F profile (new, unworn):
   layers = [{
     innerR: 0,
     outerR: 15mm,            // same diameter as RF
     innerZ: 0, outerZ: 0,
     chamfer: 90°,
     material: 'rubber',
     muStatic: 0.95,          // edge: very high static grip
     muKinetic: 0.92,         // edge: high kinetic (small gap — rubber)
     restitution: 0.28,       // rubber absorption (same as RF)
     freeSpin: false,
     profile: 'star_edge',    // new profile type: directional curved edges
     wearModel: {
       rate: 0.003,           // faster than RB (concentrated stress)
       geometryShift: 'star_to_flat',
       wearState: R2FState,
     }
   }]

   // As wear increases: profile transitions from 'star_edge' → 'flat' (like RF profile)
   // At wear = 0.7: effectively identical to RF
```

---

## Case 39 — L-Drago Destructor: Rubber Core in a 4D Metal Wheel — Spin Absorption at the Core Level

> **Stock combo (L Drago Destroy F:S):** 4D Metal Wheel: L Drago Destroy · Bottom: Final Survive

All previous rubber cases placed rubber at: the tip (RF/RB), the Energy Ring (L-Drago II), the Fusion Wheel frame (Fusion Case 21), or the Spin Track wings (R145). L-Drago Destructor places rubber at the **Core** — the innermost component beneath the Metal Frame. This is a fundamentally different geometry: the rubber is NOT the contact surface. It is an **internal damping layer** that absorbs impulses AFTER they have passed through the metal contact surface and Metal Frame, before reaching the bey's spin axis.

### 4D Metal Wheel Architecture

```
   L-Drago Destructor cross-section (side view):

        ║  Energy Ring (L-Drago II variants) — outermost
        ║
   ╔════╩═══════════════════════════════════╗
   ║  METAL FRAME (three dragon heads)      ║  ← primary contact surface (metal)
   ║  Mass: large, mass-dominant            ║    High restitution, metal-to-metal
   ╔════════════════════════════════════════╣
   ║  RUBBER CORE  (below Metal Frame)      ║  ← internal rubber layer
   ║  Soft, deformable                      ║    absorbs impulse passed down from Frame
   ╚════════════════════════════════════════╝
        ║  Spin Track (below Core)
        tip
```

```
   Four-layer impulse path when opponent hits the Metal Frame:

   1. Opponent CP → Metal Frame surface
      Metal Frame is RIGID → impulse J passes through near-instantaneously
      (no rubber at Frame level → no absorption here)

   2. Metal Frame → Rubber Core interface
      Metal Frame is attached to Rubber Core (press-fit or snap)
      The Rubber Core must deform to allow the Metal Frame to move:
      ├── If J is small: Core deforms elastically → stores J as strain energy
      └── If J is large: Core deforms viscoelastically → converts J to heat (absorption)

   3. Rubber Core → Spin Track
      Reduced impulse J_reduced reaches the Spin Track:
      J_reduced = J × μ_return_core   (where μ_return_core ≈ 0.30–0.40 for rubber)

   4. Spin Track → tip → floor
      Remaining impulse affects spin axis (tilt, linear velocity)
      → Less tilt change per hit than a non-rubber-Core 4D wheel
```

### Why Core Rubber ≠ AR Rubber (Case 21 Fusion)

```
   Fusion rubber frame (Case 21):
   Rubber is at the CONTACT SURFACE → absorbs energy ON FIRST CONTACT
   Energy destroyed BEFORE reaching the Core → no recoil to attacker at all
   → Attacker bounces less, defender takes less tilt torque
   → Both are protected by the rubber (mutual absorption)

   L-Drago Destructor rubber Core:
   Metal Frame is the contact surface → energy enters the system at FULL AMPLITUDE
   Rubber absorbs AFTER the metal contact → attacker still feels the metal rebound
   → Attacker: RECEIVES normal metal-level rebound (μ_metal ≈ 0.80)
   → Defender (Destructor): ATTENUATED spin-axis coupling (rubber Core reduces J to axis)

   This is ASYMMETRIC absorption:
   ├── Attacker experiences metal contact → normal recoil
   └── Defender's spin axis is protected → less tilt per hit → more resilience
```

```
   Comparison matrix — where rubber sits in the system:

   ┌──────────────────┬───────────────┬────────────────────────────────────────┐
   │ Part             │ Rubber at     │ Physics mechanism                      │
   ├──────────────────┼───────────────┼────────────────────────────────────────┤
   │ RF/RB tip        │ tip floor     │ absorbs on floor contact, attacker     │
   │                  │ contact       │ bounces less, both lose spin to floor  │
   ├──────────────────┼───────────────┼────────────────────────────────────────┤
   │ L-Drago II       │ Energy Ring   │ rubber IS the contact surface vs opp   │
   │                  │ surface       │ → attacker sees low μ_bounce (rubber)  │
   ├──────────────────┼───────────────┼────────────────────────────────────────┤
   │ Fusion Case 21   │ Fusion Wheel  │ rubber contacts opponent first         │
   │                  │ frame surface │ → energy destroyed before frame        │
   ├──────────────────┼───────────────┼────────────────────────────────────────┤
   │ L-Drago Destruct.│ Core (BELOW   │ metal contacts first, rubber attenuates│
   │                  │ metal frame)  │ the impulse BEFORE it reaches spin axis│
   └──────────────────┴───────────────┴────────────────────────────────────────┘
```

### Absorb Stat 6 — What It Quantifies

```
   "Absorb" stat 6 maps to the rubber Core's energy attenuation ratio.
   Higher Absorb = more energy destroyed in the Core = less spin-axis coupling.

   Absorb 6 → J_transmitted_to_axis = J_contact × (1 - 0.06 × absorb_stat)
            = J × (1 - 0.36) = J × 0.64

   36% of the impulse that penetrates the Metal Frame is absorbed by the rubber Core.
   64% reaches the spin axis and affects tilt/spin.

   Compared to a non-rubber 4D Core (Absorb 0):
   J_transmitted = J × 1.0  (100% reaches axis)

   The rubber Core gives a 36% reduction in per-hit tilt change and spin-axis impulse.
```

```typescript
   interface RubberCoreState {
     absorbStat: number;              // 0–10 scale (Destructor: 6)
     transmissionFraction: number;    // 1.0 - absorb_stat × 0.06
     compressionEnergy: number;       // current stored elastic strain (J)
     // strain energy releases back slowly if hit is small → micro-bounce
   }

   function applyHitThroughRubberCore(
     metalFrameJ: number,             // impulse that penetrated the Metal Frame
     core: RubberCoreState,
     bey: BeyState,
     dt: number
   ): number {
     // Attacker ALREADY received metal rebound (μ_metal ≈ 0.80) — that's unaffected.
     // Now determine how much of metalFrameJ reaches the spin axis:
     const J_to_axis = metalFrameJ * core.transmissionFraction;
     const J_absorbed = metalFrameJ * (1 - core.transmissionFraction);

     // Absorbed portion: partially stored as elastic strain, partially heat
     const elasticFraction = 0.30;  // rubber returns 30% as micro-bounce
     core.compressionEnergy += J_absorbed * elasticFraction;

     // Apply reduced impulse to spin axis:
     bey.spin -= (J_to_axis * bey.r_cp) / bey.I;   // spin loss
     bey.tiltAngle += (J_to_axis * bey.r_cp) / (bey.I * bey.spin) * RAD2DEG;

     return J_to_axis;  // for logging / downstream calcs
   }
```

### Metal Frame Mass Distribution

```
   Metal Frame: three-dragon-head design (same as standard L-Drago Fusion Wheel variants)
   Mass is concentrated in the dragon head protrusions at r_frame ≈ 20mm
   ΔI_frame = m_frame × r_frame²

   The large Metal Frame mass means:
   ├── High I contribution → excellent gyroscopic stability
   ├── Three-fold symmetry → isotropic (no preferred hit direction)
   └── Dragon-head geometry → same contact angles as L-Drago Fusion Wheel (Case 32)
       (upper type when contact is above opponent's CoM)
```

---

## Case 40 — L-Drago Guardian: Armor-Flat Metal Frame + Full Rubber Core — Defense Mode Architecture

> **Stock combo (L Drago Guardian S130MB):** 4D MW: L Drago Guardian · Track: Shield 130 · Bottom: Metal Ball

L-Drago Guardian is the Defense-type counterpart to Destructor. Its Metal Frame weighs 39.7g (the heaviest single Metal Frame in MFB), its Core is 5.8g and composed almost entirely of rubber. Together these create a different two-layer absorption model from Destructor: the Metal Frame is an **armor shell** (smooth, rounded, low restitution face), and the rubber Core is a **full cushion** (not just a damping layer — the Core is mostly rubber, not rubber-over-plastic).

### Metal Frame — Armor Flat Design

```
   L-Drago Guardian Metal Frame geometry:

   ATTACK MODE (flat armor face outward):
   ╔═══════════════════════════════════╗
   ║  flat, broad metal face           ║  ← wide contact area, tangential normals
   ║  smooth outer edge                ║    restitution μ ≈ 0.60 (flat = less elastic)
   ╚═══════════════════════════════════╝

   ABSORB MODE (rotated 180° — alternate face outward):
   ╔═══════════════════════════════════╗
   ║  slightly sharper face            ║  ← narrower contact, steeper normal
   ║  sharper metal protrusion         ║    restitution μ ≈ 0.72 (sharper = more elastic)
   ╚═══════════════════════════════════╝

   "Flat design" = the face that contacts opponents is broad and nearly tangential.
   Tangential face → contact normal angle is shallow → most of J goes sideways (ring-out force)
   rather than inward (torque on defender).

   This is the Defense-type contact geometry: redirect attacker laterally, don't take torque.
```

```
   Normal component analysis — flat vs angled face:

   Flat face (Attack Mode, contact angle α = 10° from tangent):
   J_normal  = J × sin(10°) = J × 0.17    (inward, torques defender)
   J_tangent = J × cos(10°) = J × 0.98    (lateral, pushes attacker sideways)

   Angled face (Absorb Mode, contact angle α = 30° from tangent):
   J_normal  = J × sin(30°) = J × 0.50
   J_tangent = J × cos(30°) = J × 0.87

   Flat mode: only 17% of the impulse torques the defender. 98% pushes attacker away.
   → Defender is nearly immune to tilt from hits in Attack Mode.
   → Attacker receives heavy sideways redirection → high ring-out risk on ATTACKER.
```

### Full Rubber Core — 6 Protrusions as Energy Sinks

```
   L-Drago Guardian Core geometry (5.8g, highly rubber):

   Top view of Core:
        [RUBBER]  [RUBBER]
       ╱         ╱
   [RUBBER]   ●   [RUBBER]     ← 6 rubber protrusions around central hub
       ╲         ╲
        [RUBBER]  [RUBBER]

   "Highly made of rubber" = the structural plastic is minimal (thin spoke frame)
   Mass fraction estimate:
   ├── Rubber: ~4.5g (77% of Core mass)
   └── Plastic spoke frame: ~1.3g (23%)

   Rubber protrusions contact the underside of the Metal Frame.
   When Metal Frame receives impact J:
   ├── Metal Frame tries to move relative to Core
   ├── ALL 6 rubber protrusions compress simultaneously
   ├── Energy stored: E_rubber = ½ × k_rubber × δ² × 6  (spring potential, 6 springs)
   └── Energy dissipated: E_heat = E_rubber × (1 - μ_return_rubber)
                                  = E_rubber × 0.70  (rubber: 70% absorbed as heat)
```

```
   Why 6 rubber protrusions > 1 rubber layer:

   Single rubber layer (Destructor Core):
   k_eff = k_rubber_single   (one spring)
   δ_max = maximum compression before bottoming out on plastic

   Six rubber protrusions (Guardian Core):
   k_eff = 6 × k_rubber_single   (springs in parallel)
   → Stiffer effective spring → same impulse J produces LESS deflection δ per protrusion
   → Each protrusion absorbs J/6 rather than J
   → None of the six protrusions bottoms out until J = 6 × J_threshold_single

   Guardian absorbs 6× more impulse before the hard-stop overflow occurs (Case 35 analogy).
   This is why Guardian has better spin absorption than Destructor even at the same rubber fraction.
```

```
   Guardian Core energy absorption per hit:

   Single-protrusion Destructor Core (Case 39):
   J_threshold_1 = k_rubber × δ_max = small
   At J > J_threshold_1: overflow → spin axis coupling begins
   Transmission fraction = 0.64 (Absorb stat 6)

   Six-protrusion Guardian Core:
   J_threshold_6 = 6 × k_rubber × δ_max = 6× larger threshold
   Most hits in a real match: J < J_threshold_6 → ZERO overflow → zero spin axis coupling
   For very strong hits (J > J_threshold_6): overflow fraction smaller (distributed among 6)
   Transmission fraction ≈ 0.40–0.50  (better isolation than Destructor)
```

```typescript
   interface GuardianCoreState {
     protrusions: 6;
     rubberMassFraction: number;   // 0.77 (77% rubber by mass)
     kPerProtrusion: number;       // spring constant per rubber nub (N/mm)
     deltaMax: number;             // max compression per nub before overflow (mm)
     coreMode: 'attack' | 'absorb'; // Metal Frame rotation mode
   }

   function computeGuardianCoreJ_threshold(core: GuardianCoreState): number {
     return core.protrusions * core.kPerProtrusion * core.deltaMax;
   }

   function applyHitToGuardianCore(
     J_from_frame: number, core: GuardianCoreState, bey: BeyState
   ): number {
     const J_thresh = computeGuardianCoreJ_threshold(core);

     if (J_from_frame <= J_thresh) {
       // All protrusions absorb: zero overflow to spin axis
       return 0;
     }
     // Overflow: distributed evenly, each protrusion at max compression
     const J_overflow = J_from_frame - J_thresh;
     const transmitFraction = 0.40;  // Guardian's improved isolation
     const J_to_axis = J_overflow * transmitFraction;

     bey.spin -= (J_to_axis * bey.r_cp) / bey.I;
     bey.tiltAngle += (J_to_axis * bey.r_cp) / (bey.I * bey.spin) * RAD2DEG;
     return J_to_axis;
   }

   // Metal Frame mode-switch changes contact angle:
   function resolveGuardianContactAngle(core: GuardianCoreState): number {
     return core.coreMode === 'attack' ? 10 : 30;  // degrees from tangent
   }
```

### 39.7g Metal Frame — Maximum Mass, Maximum I

```
   Mass comparison:
   Standard Metal Frame (Phantom Orion): ~40.31g (Case 18 — max I via outer ring)
   L-Drago Guardian Metal Frame: 39.7g  (comparable, but different geometry)

   Guardian Frame geometry: flat armor shell rather than thin outer ring.
   Mass is distributed across the full face width, not concentrated at r_outer.

   I_Guardian_frame ≈ m_frame × r_mid²    (r_mid = mass centroid of flat disc)
                    ≈ 0.0397 × (0.018)²   (r_mid ≈ 18mm for flat plate)
                    ≈ 1.29×10⁻⁵ kg·m²

   I_Phantom_frame ≈ m_frame × r_outer²  (Case 18: mass at max radius)
                   ≈ 0.04031 × (0.022)²
                   ≈ 1.95×10⁻⁵ kg·m²

   Phantom I is 51% higher per unit mass because mass is at MAXIMUM radius.
   Guardian's flat plate design sacrifices I efficiency for contact-face area.
   → Guardian: good absolute I (heavy frame), but not I-maximized.
   → Trade: armor-flat face defense vs gyroscopic stiffness.
```

---

## Case 41 — Metal Ball (MB): Metal Sphere on Metal Base — Double Metal Friction Paradox

Metal Ball is a spherical tip like RB (Case 19) and WB (Case 27), but with a metal contact surface instead of plastic or rubber. It combines the **spherical tilt-dependent contact radius** from Case 19 with the **metal friction paradox** from Case 34 (MF): extremely low kinetic friction, very high static friction, resulting in low stamina decay and high ring-out vulnerability simultaneously.

### Geometry — Sphere + Metal Scalloped Base

```
   MB cross-section (side view, tip pointing DOWN):

        ║  bey body
        ║
   ╔════╩═══════════════════════════════╗
   ║  metal scalloped base ring         ║  ← wide, flat ring with scalloped edge
   ║  (contacts floor when tilted)      ║    outer edge contacts at high tilt
   ╔══════════════════════════════════╗ ║
   ║         metal sphere             ║ ║  ← primary contact when upright
   ╚══════════════════════════════════╝ ║    r_sphere_metal ≈ 6–7mm
   ╚════════════════════════════════════╝
          ▼ sphere bottom
   ═══════════════════════════════════════  floor

   The metal sphere is LARGER than B tip (4mm) but SMALLER than WB (8mm).
   The scalloped base ring at a higher position only contacts at significant tilt.
```

```
   Contact radius vs tilt (same formula as RB/WB):

   r_contact = r_sphere_metal × sin(θ)

   r_sphere_metal ≈ 6.5mm  (between B at 4mm and WB at 8mm)
   At θ = 30°:  r_contact = 6.5 × 0.50 = 3.25mm
   At θ = 45°:  r_contact = 6.5 × 0.71 = 4.6mm

   Compare:
   B  (4mm plastic sphere):  r at 30° = 2.0mm
   MB (6.5mm metal sphere):  r at 30° = 3.25mm  (1.6× larger than B)
   WB (8mm plastic sphere):  r at 30° = 4.0mm   (1.2× larger than MB)
```

### The Double Metal Friction Paradox

```
   RB (Rubber Ball): μ_static ≈ 0.90, μ_kinetic ≈ 0.85  → small gap (rubber)
   WB (Wide Ball):   μ_static ≈ 0.60, μ_kinetic ≈ 0.50  → moderate gap (plastic)
   MB (Metal Ball):  μ_static ≈ 0.65, μ_kinetic ≈ 0.10–0.15  → LARGE gap (metal)
                     (metal sphere on plastic stadium surface)

   The large μ_static / μ_kinetic gap for metal on plastic:
   ├── μ_static = 0.65: moderate grip when stationary (hard to break static)
   ├── μ_kinetic = 0.12: extremely low once sliding → nearly frictionless in motion
   └── Gap ratio = 0.12/0.65 = 0.18 → even larger gap than MF (0.25/0.70 = 0.36)

   MB has a WIDER static-kinetic gap than MF.
   This means MB is even harder to control once sliding than MF.

   "Low friction = long endurance" = μ_kinetic = 0.12 → spin decays very slowly
   "Lack of traction makes it easy to knockout" = μ_static = 0.65 → not much floor grip
                                                    → hit from opponent → slides freely
```

```
   Spin decay comparison (same conditions: θ = 30°, same bey):

   μ_kinetic contributions to spin decay rate:
   τ_decay = μ_kinetic × m × g × r_contact

   RB  (r=4.5mm, μ=0.85):  τ = 0.85 × N × 4.5mm = 3.83N·mm  → fast decay
   WB  (r=4.0mm, μ=0.50):  τ = 0.50 × N × 4.0mm = 2.00N·mm  → moderate decay
   B   (r=2.0mm, μ=0.50):  τ = 0.50 × N × 2.0mm = 1.00N·mm  → good decay
   MF  (r=3.0mm, μ=0.25):  τ = 0.25 × N × 3.0mm = 0.75N·mm  → very good decay
   MB  (r=3.25mm,μ=0.12):  τ = 0.12 × N × 3.25mm= 0.39N·mm  → BEST spin decay

   MB has the LOWEST spin decay rate of any tip modelled so far.
   This is the "long endurance" property — the metal kinetic friction is so low
   that even the larger sphere radius barely costs spin.
```

```
   Why MB is still easy to ring-out (the traction problem):

   Ring-out resistance requires: floor friction ≥ lateral impulse from hit
   F_resist = μ_kinetic × m × g = 0.12 × 0.045 × 9.8 = 0.053 N

   For MF (μ_kinetic = 0.25): F_resist = 0.110 N  (2.1× more grip than MB)
   For WB (μ_kinetic = 0.50): F_resist = 0.221 N  (4.2× more grip than MB)

   Required lateral impulse to ring-out MB: J_ring-out ≈ F_resist × Δt_slide
   MB: J_ring-out is very small → any moderate hit slides MB across the arena
   WB: J_ring-out is 4× larger → much harder to push out

   "Easy to knockout and destabilize" — confirmed: low μ_kinetic means:
   ├── Floor barely resists lateral sliding → slides easily on each hit
   └── At high tilt: sphere r_contact grows → more torque per hit → tilt accelerates

   The traction/stability cost is the flip side of the endurance benefit.
```

### Metal Wear Model — No Geometry Shift

```
   RB: rubber sphere wears flat (Case 19 — μ changes, profile changes)
   MB: metal sphere has NEGLIGIBLE wear at Beyblade timescales

   Metal sphere on plastic stadium:
   ├── Metal is much harder than plastic (Mohs 5+ vs Mohs 2 for typical plastics)
   ├── Metal sphere stays spherical throughout the match
   └── No geometry shift wear model needed: profile is CONSTANT

   Only wear effect: slight increase in static friction as metal glazes smooth:
   wearMu_static(wear) = 0.65 - 0.05 × wear  (slight reduction, barely perceptible)
   → Negligible over match timescales → no wear model implemented.
```

```typescript
   MB profile:
   layers = [{
     innerR: 0,
     outerR: 'dynamic',          // r = r_sphere × sin(tiltAngle) — spherical formula
     innerZ: 0, outerZ: 0,
     chamfer: 'spherical',
     sphereRadius: 6.5mm,        // larger than B (4mm), smaller than WB (8mm)
     freeSpin: false,
     muStatic: 0.65,
     muKinetic: 0.12,            // metal on plastic: extremely low kinetic
     restitution: 0.80,          // metal: highly elastic (same as MF tip)
     material: 'metal',
     wearModel: null,            // no wear for metal sphere

     // Scalloped base ring (secondary contact at high tilt):
     // contacts floor at θ > θ_base_contact = arcsin(h_base / r_base_outer)
     // Uses same muKinetic = 0.12 (also metal)
   }]

   // Metal Ball summary in the tip taxonomy:
   // Best stamina: lowest τ_decay of any tip
   // Worst defense: lowest F_resist of any non-bearing tip
   // Mid movement: r_sphere is intermediate → moderate precession torque
```

### MB Tip Taxonomy Position

```
   Stamina rank (best to worst at sustained spin retention):
   1. MB   (μ_kinetic = 0.12, r_contact moderate) ← BEST
   2. MF   (μ_kinetic = 0.25, r_contact small)
   3. S    (μ_kinetic = 0.25, r_contact ~0)
   4. B    (μ_kinetic = 0.50, r_contact small)
   5. WB   (μ_kinetic = 0.50, r_contact larger)
   ...
   n. RF   (μ_kinetic = 0.85, r_contact large) ← WORST

   Ring-out resistance (best to worst):
   1. RF   (μ_kinetic = 0.85, wide: highest F_resist) ← HARDEST to KO
   ...
   n. MB   (μ_kinetic = 0.12: lowest F_resist)       ← EASIEST to KO

   MB occupies both extremes simultaneously:
   Maximum spin endurance + maximum ring-out vulnerability.
   This is the physics expression of "low friction = good AND bad at the same time."
```

---

## Case 42 — Metal Face / Face Bolt: CoM Elevation as a Physics Variable

The Face Bolt (MFB generation) and Bit Chip (plastic generation) occupy the **top of the bey** — the uppermost component, above the Energy Ring. Because they sit at the maximum possible height above the tip, any mass placed here has the largest possible influence on the **center of mass height (h_com)** and through h_com, on every tilt-related physics quantity. The Metal Face variants (MF, MF2, MSF, MSF2) are the only MFB parts that deliberately add mass at the TOP of the bey rather than at large radius.

### Geometry — Top Position, Hexagonal Thread

```
   Face Bolt position in a fully assembled bey (side view):

        [FACE BOLT]  ← topmost component, height H_total above floor
             │           screws down through the center
        [ENERGY RING]  ← sits below Face Bolt
             │
        [FUSION WHEEL] ← main mass, mid-height
             │
        [SPIN TRACK]   ← height spacer
             │
           [TIP]       ← floor contact, h = 0

   Face Bolt mass sits at:
   h_face = h_total - h_face_thickness / 2
           ≈ H_total × 0.95   (near the very top)

   For a standard MFB bey (H_total ≈ 40mm above floor):
   h_face ≈ 38mm  — highest position of any single component.
```

```
   Regular Face Bolt (plastic): mass ≈ 0.7g at h_face ≈ 38mm
   Metal Face (MF):             mass ≈ 2.5g at h_face ≈ 38mm  (+1.8g at top)
   Metal Face Custom (MF2):     mass ≈ 2.5g at h_face ≈ 38mm  (same mass, two-piece)

   I contribution (horizontal rotation, I = m × r² where r is horizontal offset):
   Face Bolt is centered on spin axis → r ≈ 0 → ΔI ≈ 0.
   Metal Face DOES NOT significantly increase I.
   (The hexagonal cap is ~6mm across — at r = 3mm: ΔI = 0.0025 × 0.003² ≈ 2×10⁻⁸ → tiny)
```

### h_com Elevation — The Real Physics Mechanism

```
   Adding mass at height h_face raises the system's center of mass:

   h_com_new = (m_bey × h_com_old + m_face × h_face) / (m_bey + m_face)

   For a 45g bey with h_com_old = 18mm and Metal Face at h = 38mm:
   h_com_new = (45 × 18 + 2.5 × 38) / (45 + 2.5)
             = (810 + 95) / 47.5
             = 905 / 47.5
             = 19.05mm

   Δh_com = 19.05 - 18 = +1.05mm  (h_com raised by ~1mm)

   This is a VERTICAL CENTER OF MASS SHIFT, not an I change.
   h_com appears in every tilt formula:

   1. Gravity tilt torque: τ_grav = m × g × h_com × sin(θ)
      τ_grav_new / τ_grav_old = 19.05 / 18.0 = 1.058  (+5.8% more wobble torque)

   2. Ground friction orbit: r_orbit = h_com × sin(θ)
      r_orbit increases by 5.8% → spin decays 5.8% faster per tick at any given tilt

   3. Torque arm for hits (Case 9): r_tip_to_CP = h_CP_on_bey  (floor pivot)
      h_com shifts → CoM is slightly higher → opponent hits slightly below CoM more often
      → LOWER HIT geometry on Metal Face bey → opponent top swings toward attacker (Case 10)

   4. Airborne jump height (Case 14 — Q tip):
      vz²/(2g) grows with h_com → slightly higher jumps with Metal Face
```

```
   Stability impact — tilt growth rate per tick changes:

   dθ/dt = τ_grav / (I × ω) = (m × g × h_com × sin(θ)) / (I × ω)

   With regular Face (h_com = 18mm):
   dθ/dt_base = (0.045 × 9.8 × 0.018 × sin(θ)) / (I × ω)

   With Metal Face (h_com = 19.05mm, m = 47.5g):
   dθ/dt_MF = (0.0475 × 9.8 × 0.01905 × sin(θ)) / (I × ω)

   Ratio: (0.0475 × 0.01905) / (0.045 × 0.018) = 9.05×10⁻⁴ / 8.1×10⁻⁴ = 1.117

   Metal Face causes tilt to grow 11.7% faster per tick!
   → Metal Face bey reaches the 40% wobble threshold 11.7% sooner in theory.
   → BUT: the added mass also increases total mass → floor impacts require more J to ring out.
```

### The Real Performance Benefit — Compact/Defense Combos

```
   Metal Face's documented benefit: "significant boost to Compact and Defense combinations"

   Compact combination: small attack ring + very low spin track + light tip
   → Very low h_com (short bey)
   → h_com might be only 10–12mm → very low tilt stability (gyroscopic axis barely above floor)

   Metal Face on Compact combo:
   h_com_new = (m_compact × h_com_compact + m_MF × h_face) / (m_compact + m_MF)
             = (25 × 11 + 2.5 × 30) / (25 + 2.5)
             = (275 + 75) / 27.5 = 12.7mm  (raised from 11mm to 12.7mm)

   The effect is LARGER on a compact combo because h_face / h_com_compact ratio is larger.
   A 1.7mm h_com increase on an 11mm compact bey = +15.5% h_com elevation
   vs the same +1.05mm on a standard 45g/18mm bey = +5.8%

   Additionally: Compact combos often have lower total mass → Metal Face's 2.5g
   is a larger FRACTION of total mass (2.5/27.5 = 9% vs 2.5/47.5 = 5.3%).
   → Greater contribution to both h_com shift AND total momentum.
```

```
   Defense combination benefit:

   Defense type: wide, heavy wheel → high I → hard to tilt.
   But: if the bey is very WIDE (large r), h_com might be LOW relative to bey width.
   A wide, low-profile bey has h_com / r_outer ratio approaching 0.
   → Nearly horizontal gyroscope → gravity tilt torque is huge relative to I.

   Metal Face raises h_com → better I/h_com ratio → more gyroscopic efficiency.
   The defense bey becomes more upright relative to its width → more stable precession.
```

### Bit Chip (Plastic Gen) — Mass at Top, Structural Role

```
   Bit Chip: the plastic generation equivalent of the Face Bolt.
   Sits at the top of the bey, held by the Attack Ring.
   Mass ≈ 0.3–0.5g (plastic) or up to 1.5g (Metal Bit Chip)

   "Boost to performance" from Metal Bit Chip = same h_com elevation mechanism:
   Same formula, smaller numbers (lighter bey overall = greater relative effect).

   "Breaking the Bit Chip ends the battle" — game rule from early Beyblade:
   Physical interpretation: the Attack Ring is what holds the Bit Chip in place.
   If the Bit Chip is knocked out, the Attack Ring is compromised (loose fit).
   → Bey's rotational symmetry is broken → large static imbalance (Case 28 Twisted)
   → Vibration amplitude grows until bey cannot sustain stable spin → immediate loss.
   The rule formalizes what would physically happen: the bey is ruined.

   In the game engine: breaking the Face Bolt = "burst" condition (structural failure)
   → same burst trigger as Case 6 burst threshold, but instant rather than threshold-based.
```

### CoM Elevation State Model

```typescript
   // Face Bolt contribution to h_com (called at match start alongside I computation):
   function computeH_com(parts: BeybladeSystem, tipHeight: number): number {
     let massTimesHeight = 0;
     let totalMass = 0;

     for (const part of parts) {
       const h = part.heightAboveFloor ?? estimatePartHeight(part, tipHeight);
       massTimesHeight += part.mass * h;
       totalMass += part.mass;
     }
     return massTimesHeight / totalMass;  // weighted average → h_com
   }

   // Face Bolt part config (for Metal Face):
   const METAL_FACE: FacePart = {
     id: 'metal_face',
     label: 'Metal Face',
     mass: 2.5,              // g
     heightAboveFloor: 38,   // mm (near top of bey)
     r_horizontal: 3,        // mm (small hex cap, minimal I contribution)
   };

   const REGULAR_FACE: FacePart = {
     id: 'regular_face',
     label: 'Regular Face Bolt',
     mass: 0.7,
     heightAboveFloor: 38,
     r_horizontal: 3,
   };

   // h_com used in every tilt-related formula replaces hardcoded h_com constant.
   // All Case 6, 8, 9, 10 formulas read bey.hCom (computed at match start).
```

### What This Adds to the Codebase

```
   shared/types/beybladeSystem.ts:
   └── Add FacePart interface: { mass, heightAboveFloor, r_horizontal }
       Add facePart?: FacePart to BeybladeSystem (optional — backward compat)
       computeH_com() should join computeI() as a match-start calculation

   server/rooms/BattleRoom.ts:
   └── On bey creation: bey.hCom = computeH_com(bey.system, bey.tipHeight)
       Replace all hardcoded h_com constants with bey.hCom

   server/rooms/schema/GameState.ts:
   └── No new sync fields (h_com is server-internal, not synced to client)

   scripts/seed-2d-parts.js:
   └── Add face bolt part type to beyblade_parts collection
       Entries: 'regular_face' (0.7g), 'metal_face' (2.5g), 'metal_face_2' (2.5g)
```

---

## Case 43 — Bit Chip and Face Bolt: Structural Integrity as a Match-End Trigger

Cases 1–42 described physics mechanics that degrade performance gradually — tilt growth, spin decay, ring-out probability. The Bit Chip burst rule introduces a **discrete structural failure trigger** that ends the match instantly rather than through accumulated degradation. This case establishes the mapping between the real-world "chip knocked off = instant loss" rule and the game's burst mechanics.

### The Structural Failure Model

```
   A Beyblade's rotational symmetry requires every major component to remain seated.
   The Face Bolt / Bit Chip holds the top of the assembly together.
   The Attack Ring / Energy Ring sits below it, and its retention depends on the Face Bolt.

   Failure cascade if Face Bolt is ejected:

   Face Bolt knocked off
        │
        ▼
   Attack Ring / Energy Ring seat loosens (no top retainer)
        │
        ▼
   Components begin to wobble independently:
   ├── Energy Ring shifts off-center → CoM moves off spin axis
   ├── Static imbalance d >> 0 (Case 28 Twisted "Spiral Staircase" type)
   ├── Centrifugal force on off-axis mass: F = m × d × ω² → grows fast
   └── Resonance: F grows faster than gyroscopic correction can handle
        │
        ▼
   Bey explodes apart (burst) in < 1 revolution
```

```
   Why "extremely hard to achieve" in real life:

   Face Bolt ejection requires:
   F_eject > F_thread_retention × safety_factor
   Thread retention force ≈ torque_preload / pitch × η_thread ≈ large
   (Beyblade threads are designed to tighten under CCW spin — left-handed thread
    resists the CCW rotation of the bey itself)

   Under normal gameplay: the bey's own spin tightens the thread → self-securing
   Only a direct hit that reverses the thread's tightening direction could eject it.
   Equivalent to: a CW torque impulse on the Face Bolt exceeding the thread preload.
   Probability per hit: very low → "extremely hard to achieve / rare"
```

```
   In-game burst model mapping:

   Face Bolt ejection ↔ Burst condition crossing threshold
   (burstThreshold = max tilt + low spin + high incoming torque in one tick)

   The "burst_type" field distinguishes:
   ├── 'progressive': standard burst (accumulated tilt → topple → ring-out)
   └── 'instant':     structural failure (Face Bolt / Bit Chip ejected)
       instant burst requires: J_torque_on_face > F_thread_retention
       = very rare, requires direct top-hit at high spin

   For the game engine: "instant burst" is equivalent to burst_by_hit where the
   hit specifically targets the top of the bey (h_hit ≈ h_total) at high J.
   This is already covered by Case 10 (hit height geometry) + the existing burst
   threshold check — no new mechanism needed.
   The game's burst system is the correct model; this case validates it.
```

---

## Case 44 — Fang 4D Metal Wheel: Alternating Protrusion Width and Hollow-Face Mode Reversal

> **Stock combo (Fang Leone 130W²D):** 4D Clear Wheel: Leone II · 4D Metal Wheel: Fang · Track: 130 · Bottom: Wave Wide Defense

Fang has six protrusions around its circumference but they are not equal — they alternate **wide** and **narrow**, at 60° intervals. The hollow/solid face of the Metal Frame reverses between Defense and Counter Mode, which simultaneously changes the effective contact radius of EVERY protrusion and the angle of the contact normal.

### Six Alternating Protrusions — Two Distinct Impulse Magnitudes Per Revolution

```
   Top view — Fang Metal Frame (bare):

   W = wide protrusion (~12mm face width, r_cp ≈ 21mm)
   N = narrow protrusion (~6mm face width, r_cp ≈ 20mm)

          W
        ╱   ╲
      N       N
      │   ●   │   ← spin axis
      N       N
        ╲   ╱
          W

   Six protrusions at 60° intervals: W N W N W N
   Wide at 0°, 120°, 240° (3-fold like Blitz Assault, Case 20)
   Narrow at 60°, 180°, 300° (interleaved)
```

```
   Impact magnitude comparison (same v_rel, same μ):

   J = -(1+μ) × v_rel / (1/m_A + 1/m_B + r_cp²/I_A + r_cp²/I_B)

   Wide protrusion (r_cp = 21mm, larger face area):
   J_wide ∝ 1 / (... + 0.021²/I)   → slightly larger denominator → slightly smaller J
   BUT: wide face = more contact area → higher effective N per contact
   Net: J_wide ≈ 1.15 × J_narrow  (wider face concentrates more mass per unit spin angle)

   Narrow protrusion (r_cp = 20mm):
   Smaller face → less effective mass in contact → J_narrow < J_wide

   Per revolution: alternating W-N-W-N-W-N hits
   → Three strong hits (wide) + three lighter hits (narrow) at 60° intervals
   → Different tilt torques for wide vs narrow: Δθ_wide > Δθ narrow (more impulse per event)
   → Total effect: non-uniform tilt accumulation per revolution (unlike uniform 6-wing blades)
```

### Defense Mode vs Counter Mode — Hollow Face Reversal

```
   DEFENSE MODE (hollow face DOWN, solid face UP = outward):

   The Metal Frame is oriented so the smooth convex face is the outer contact surface.
   No exposed claw tips → blunt rounded profile at contact.

   Contact geometry:
   ├── Wide protrusion: smooth convex bulge → contact normal ≈ tangential (10–15° from tangent)
   │   → J_normal (inward torque) = J × sin(12°) ≈ 0.21J   (low, like Guardian flat mode)
   │   → J_tangential (lateral push) = J × cos(12°) ≈ 0.98J (high redirect)
   └── Narrow protrusion: also smooth → same glancing normal angle

   Self-recoil in Defense Mode:
   Fang receives -J from opponent at r_cp → torque on Fang's spin axis
   Smooth face → J is smaller (lower μ, blunt normal) → self-recoil is contained
   → Fang stays stable; opponent is redirected laterally (ring-out threat on attacker)

   COUNTER MODE (hollow face UP, solid face DOWN = inward toward hub):

   The Metal Frame flips → the claw tips of the wide protrusions are now outermost.
   Claw geometry: sharp curved hook at the tip of each wide protrusion.

   Contact geometry:
   ├── Wide protrusion (claw): concave hooking face → contact normal ≈ 45–55° from tangent
   │   → J_normal = J × sin(50°) ≈ 0.77J  (high torque on opponent)
   │   → large tilt torque on both beys
   └── Narrow protrusion: also flipped, but still less protrusive than wide
       → narrow delivers moderate J (similar to Barrage blades, Case 20)

   Counter Mode recoil:
   High J + steep normal → Fang itself receives large self-recoil torque per hit
   → Fang's tilt increases faster (similar to Kreis Counter Mode, Case 16 stop overflow)
   → "High recoil smash attack" — powerful but self-destabilizing
```

```
   Effective restitution per mode:

   Defense Mode (smooth face): μ_eff ≈ 0.55 (blunt profile, some energy absorbed by face curvature)
   Counter Mode (claw face):   μ_eff ≈ 0.82 (sharp hook, near-elastic metal contact)

   J_Defense  ≈ 1.55 × v_rel × m_eff  (lower, but opponent redirected sideways)
   J_Counter  ≈ 1.82 × v_rel × m_eff  (17% more, attacker takes heavy hit)
```

### Mode Asymmetry Table

```
   ┌──────────────────┬──────────────────────────┬──────────────────────────────┐
   │ Property         │ Defense Mode              │ Counter Mode                 │
   ├──────────────────┼──────────────────────────┼──────────────────────────────┤
   │ Outer face       │ Smooth convex (solid)     │ Claw hook tips (wide prongs) │
   ├──────────────────┼──────────────────────────┼──────────────────────────────┤
   │ Normal angle     │ 10–15° from tangent       │ 45–55° from tangent          │
   ├──────────────────┼──────────────────────────┼──────────────────────────────┤
   │ μ effective      │ 0.55                      │ 0.82                         │
   ├──────────────────┼──────────────────────────┼──────────────────────────────┤
   │ Opponent J_n     │ 0.21 × J (low torque)     │ 0.77 × J (high torque)       │
   ├──────────────────┼──────────────────────────┼──────────────────────────────┤
   │ Self-recoil      │ Low (stable)              │ HIGH (smash recoil)          │
   ├──────────────────┼──────────────────────────┼──────────────────────────────┤
   │ Best vs          │ Attack types              │ Stamina/Defense types        │
   └──────────────────┴──────────────────────────┴──────────────────────────────┘
```

```typescript
   interface FangContactGroup {
     mode: 'defense' | 'counter';
     wideProtrusions: 3;    // at 0°, 120°, 240°
     narrowProtrusions: 3;  // at 60°, 180°, 300°
   }

   function resolveFangCP(group: FangContactGroup, impactAngle: number): {
     r_cp: number; normalAngle: number; restitution: number
   } {
     // Determine if impact is at a wide or narrow protrusion
     const normalizedAngle = ((impactAngle % 120) + 120) % 120; // within 120° sector
     const isWide = normalizedAngle < 30 || normalizedAngle > 90; // wide at 0° and 120°

     if (group.mode === 'defense') {
       return { r_cp: isWide ? 21 : 20, normalAngle: 12, restitution: 0.55 };
     } else {
       return { r_cp: isWide ? 21 : 20, normalAngle: isWide ? 50 : 30, restitution: 0.82 };
     }
   }
```

---

## Case 45 — Aero Core & Aero Wing (HMS): Small-Diameter Gravitational Torque and Helicopter Vortex Drag

> **Stock combo (Aero Knight MS):** AR: Knight Crusher · WD/CWD: Circle Wide · RC: Aero Core · SP: Aero Ring

HMS beyblades have a diameter of ~3.5 cm vs MFB's ~5.5 cm. This size reduction, combined with typically lighter overall mass, fundamentally changes the gyroscopic stability equation. Aero Core is the HMS equivalent of a tall track (like 230 from Case 23), and Aero Wing is a helicopter-blade gimmick whose drag penalty and floor scraping risk make it non-competitive.

### HMS Small-Diameter Physics — Why Gravitational Torque Dominates

```
   Gyroscopic stability condition:
   I × ω > τ_gravity × Δt_effective

   τ_gravity = m × g × h_com × sin(θ)   (gravity tilt torque)
   I = Σ m_i × r_i²                     (moment of inertia)

   For a ring of mass m at radius r:
   I_ring = m × r²

   HMS bey (r_outer ≈ 17.5mm, total mass ≈ 28g):
   I_HMS ≈ m × r_HMS² ≈ 0.028 × 0.0175² ≈ 8.6×10⁻⁶ kg·m²

   MFB bey (r_outer ≈ 27.5mm, total mass ≈ 45g):
   I_MFB ≈ m × r_MFB² ≈ 0.045 × 0.0275² ≈ 3.4×10⁻⁵ kg·m²

   I_MFB / I_HMS ≈ 4.0×  (MFB has 4× more rotational inertia)

   Gravity torque (both at θ = 30°, h_com = 15mm):
   τ_HMS = 0.028 × 9.8 × 0.015 × 0.5 = 2.06×10⁻³ N·m
   τ_MFB = 0.045 × 9.8 × 0.015 × 0.5 = 3.31×10⁻³ N·m  (only 1.6× more)

   Precession rate (wobble speed): Ω_p = τ / (I × ω)
   Ω_p_HMS / Ω_p_MFB = (τ_HMS / I_HMS) / (τ_MFB / I_MFB)
                      = (2.06×10⁻³ / 8.6×10⁻⁶) / (3.31×10⁻³ / 3.4×10⁻⁵)
                      = 239.5 / 97.4 ≈ 2.46

   HMS precesses 2.46× faster than MFB at same spin % → wobble onset appears sooner.
   An HMS bey at 60% spin behaves like an MFB bey at ~35% spin in terms of wobble character.
```

```
   Aero Core = tall RC (equivalent of 230 track in MFB):

   Height comparison:
   MFB 230 track: h_track = 23mm → h_com ≈ 25mm (adding wheel height)
   Aero Core:     h_rc ≈ 22mm  → h_com ≈ 22mm (but HMS total bey shorter, so ratio is worse)

   The critical ratio is h_com / r_outer:
   MFB 230 combo: 25mm / 27.5mm ≈ 0.91   (marginally tall)
   Aero Core HMS: 22mm / 17.5mm ≈ 1.26   (significantly tall — h_com exceeds the wheel radius!)

   When h_com > r_outer:
   τ_gravity at θ = sin(θ) × m×g×h_com grows faster than I resists it.
   The bey is geometrically "top-heavy" relative to its rotational footprint.
   → Even at high spin, any tilt tends to grow rather than damp.
   → This is why Aero Core "has very high gravitational torque" — the h/r ratio is extreme.
```

### Aero Wing — Helicopter Blade Drag and Floor Scraping

```
   Aero Wing geometry: a disc with radially extending blades at 45° pitch angles,
   resembling a helicopter rotor. Sits at the WD/AR interface.

   Drag force (Case 37 aerodynamics, now larger):
   Aero Wing has much larger fin area than W105:
   A_wing ≈ 0.020m × 0.015m × 4 blades = 1.2×10⁻³ m²  (8× larger than W105)

   F_drag = ½ × ρ_air × v_tip² × A_wing × C_D
   At ω = 300 rad/s, r_tip = 0.020m: v_tip = 6 m/s
   F_drag = 0.5 × 1.2 × 36 × 1.2×10⁻³ × 1.2 ≈ 0.031 N

   Weight of HMS bey = 0.028 × 9.8 = 0.274 N
   F_drag / F_weight = 0.031 / 0.274 ≈ 11.3%

   Unlike W105 (0.37%, Case 37), Aero Wing's drag is 11% of body weight — measurable!
   This acts as a continuous torque opposing spin:
   τ_drag = F_drag × r_effective = 0.031 × 0.015 ≈ 4.7×10⁻⁴ N·m
   Spin decay from drag: dω/dt = τ_drag / I_HMS = 4.7×10⁻⁴ / 8.6×10⁻⁶ ≈ 54.7 rad/s²

   Compare to tip friction spin decay (flat tip, HMS):
   τ_tip = μ × m×g × r_tip = 0.50 × 0.028 × 9.8 × 0.008 ≈ 1.1×10⁻³ N·m
   dω/dt_tip = 1.1×10⁻³ / 8.6×10⁻⁶ ≈ 128 rad/s²

   Aero Wing adds 43% more spin decay than the tip alone → stamina collapses rapidly.
```

```
   Floor scraping when tilted (Aero Wing blades at radius r_blade ≈ 20mm):

   θ_scrape = arcsin(h_blade / r_blade) where h_blade ≈ 12mm (blade position above floor)
   θ_scrape = arcsin(12/20) = arcsin(0.60) ≈ 37°

   HMS beys reach θ = 37° much earlier than MFB (smaller I, faster tilt growth).
   At 60% spin: HMS tilt angle ~30–40° → blade scraping begins.
   Scraping torque (rubber/plastic blade edge on floor): τ_scrape >> τ_tip
   → Catastrophic spin decay onset at mid-match spin levels.

   Conclusion: Aero Wing is unviable because:
   1. Air drag costs ~43% additional spin decay throughout the match
   2. Floor scraping begins at ~37° tilt (reached quickly due to HMS low I)
   3. Combined spin decay ≈ 2.5× faster than a standard HMS AR
```

```typescript
   interface AeroWingState {
     bladeCount: 4;
     bladeArea: number;          // m² per blade (Aero Wing ≈ 3×10⁻⁴)
     bladePitchAngle: number;    // degrees (45° → max lift/drag)
     bladeRadius: number;        // mm from spin axis (≈ 20mm)
     bladeHeight: number;        // mm above floor when upright (≈ 12mm)
     dragCoeff: number;          // C_D ≈ 1.2 for flat plate
   }

   function tickAeroWingDrag(bey: BeyState, wing: AeroWingState, dt: number) {
     const omega = bey.spin / bey.I;
     const v_tip = omega * wing.bladeRadius * 0.001;
     const F_drag = 0.5 * AIR_DENSITY * v_tip * v_tip
                  * wing.bladeArea * wing.bladeCount * wing.dragCoeff;
     const tau_drag = F_drag * wing.bladeRadius * 0.001;
     bey.spin -= (tau_drag / bey.I) * dt;

     // Floor scraping check
     const sinTilt = Math.sin(bey.tiltAngle * DEG2RAD);
     const bladeClearance = wing.bladeHeight - wing.bladeRadius * sinTilt;
     if (bladeClearance <= 0) {
       const N_blade = bey.mass * G * (-bladeClearance / bey.hCom);
       const tau_scrape = 0.50 * N_blade * wing.bladeRadius * 0.001;
       bey.spin -= (tau_scrape / bey.I) * dt;
     }
   }
```

---

## Case 46 — CWD Chain Attacker: Free-Spinning Weight Disk and the Self-Damage Paradox

> **Stock combo (Dragoon MF):** AR: Upper Dragon · WD/CWD: CWD Chain Attacker · RC: Metal Weight Grip Core

CWD Chain Attacker is a 17g weight disk with 9 large plastic spikes that spins freely on a bearing, sitting at the WD position. The free-spin is meant to allow the spikes to strike opponents continuously, but instead creates a paradox: the CPs can never deliver a full smash impulse because they are never locked to the spin axis, and the bearing coupling means the bey body loses energy to drag the free-spinning mass — more than the opponent loses from being struck.

### Why Free-Spin CPs Cannot Deliver Full Smash

```
   Fixed WD contact point (standard):
   WD is rigidly coupled → CP tangential velocity = ω_bey × r_cp
   Opponent contact: relative velocity between CP surface and opponent body
   v_rel = ω_bey × r_cp ± v_opponent (depending on approach angle)
   Full impulse J transmitted to opponent (from Case 12 formula)

   Free-spinning CWD contact point:
   CWD bearing decouples its rotation from the bey body.
   At any moment: ω_CWD ≠ ω_bey.

   When the bey spins at ω_bey but CWD has been slowed by prior contacts:
   ω_CWD = ω_bey × (1 - slip_fraction)  (bearing allows differential)

   CP tangential velocity = ω_CWD × r_cp  (LESS than bey spin provides)
   v_rel_effective < v_rel_fixed
   → J_CWD < J_fixed  (smaller impulse per hit)

   In the worst case (CWD has nearly stopped from accumulated contacts):
   ω_CWD → 0 → CP tangential velocity → 0 → v_rel ≈ v_opponent only
   → Impulse J ≈ J_from_opponent_velocity_alone (minimal)
   → The spike barely hits — like a stationary block, not a spinning blade.
```

```
   Why CWD decelerates faster than opponent:

   Each contact: opponent is struck by J (small, from above)
                 CWD receives -J reaction → loses angular momentum
                 Bearing transmits -J × f_bearing to bey body (small coupling)

   Per-contact CWD angular deceleration:
   Δω_CWD = J × r_cp / I_CWD   (large: I_CWD is small, so Δω is large)
   Δω_bey_from_coupling = Δω_CWD × f_bearing × (I_CWD / I_bey)  (small)

   CWD loses spin fast (low I); bey body barely changes.
   But the bey body must DRAG the CWD back up via bearing friction each revolution:
   τ_ramp_up = f_bearing × (ω_bey - ω_CWD) × I_CWD / dt
   → This continuous drag on the bey body is LARGER than the impulse received by opponent.

   Net balance:
   Spin lost by bey per contact cycle > spin lost by opponent per contact
   → CWD damages the user more than the opponent.
   This is the "does more damage to the Beyblade it is being used on" property.
```

```
   Self-damage rate vs opponent damage rate:

   τ_self_damage = f_bearing × Δω_slip × I_CWD / dt   (bearing drag coupling)
   τ_opp_damage  = J_small × r_opponent / I_opponent   (tiny impulse per hit)

   τ_self / τ_opp ≈ (f_bearing × I_CWD × ω_slip) / (J × r_opp)

   For typical values (f_bearing = 0.08, I_CWD = 1.5×10⁻⁶, ω_slip = 50 rad/s):
   τ_self ≈ 0.08 × 1.5×10⁻⁶ × 50 / 0.017 ≈ 3.5×10⁻⁴ N·m
   τ_opp  ≈ 0.01 N × 0.020m / 1×10⁻⁵ ≈ negligible per tick

   τ_self >> τ_opp → CWD is a self-harm mechanic, not an attack mechanic.
```

```typescript
   interface CWDFreeSpinState {
     omega_CWD: number;         // current angular velocity of the CWD (rad/s)
     bearingFriction: number;   // coupling coefficient (CWD Chain Attacker: 0.08)
     n_spikes: 9;
     r_spike: number;           // mm radius of spike tips from spin axis
     I_CWD: number;             // moment of inertia of the free-spinning CWD
   }

   function tickCWD(bey: BeyState, cwd: CWDFreeSpinState, dt: number) {
     const omega_bey = bey.spin / bey.I;
     const slip = omega_bey - cwd.omega_CWD;

     // Bearing coupling drag — accelerates CWD toward bey, drains bey
     const tau_coupling = cwd.bearingFriction * slip * cwd.I_CWD;
     cwd.omega_CWD += (tau_coupling / cwd.I_CWD) * dt;
     bey.spin -= (tau_coupling / bey.I) * dt;  // self-drain
   }

   function applyHitFromCWD(cwd: CWDFreeSpinState, opponent: BeyState, dt: number) {
     const v_rel = cwd.omega_CWD * cwd.r_spike * 0.001;
     if (v_rel < 0.1) return;  // CWD nearly stopped → negligible impulse
     const J = 0.3 * v_rel * (opponent.mass * CWD_MASS / (opponent.mass + CWD_MASS));
     opponent.vx -= J * 0.01;  // minimal push
     // CWD loses angular momentum from the contact
     cwd.omega_CWD -= (J * cwd.r_spike * 0.001) / cwd.I_CWD;
   }
```

---

## Case 47 — Rubber Weight Core (HMS): Combined WD+RC Position, Force Smash Geometry, and Same-Spin Dependency

> **Stock combo (Round Shell MS):** AR: Turtle Crusher · RC: Rubber Weight Core

Rubber Weight Core occupies BOTH the WD and RC positions simultaneously — it is a weighted cylinder with a rubber outer shell and a plastic semi-flat tip. This creates three distinct physics concepts: a cylindrical rubber contact surface (different from all prior flat/spherical rubber cases), Force Smash via a diagonally-angled lower rim, and spin-direction-dependent friction (the rubber deflects hits cooperatively in same-spin but destructively in opposite-spin).

### Combined WD+RC Position — Mass Distribution Change

```
   Standard HMS layout:
   AR (top) → WD (mid) → RC (bottom, includes tip)

   Rubber Weight Core layout:
   AR (top) → [Rubber Weight Core = WD + RC combined] → tip (built-in, plastic semi-flat)

   WD normally sits at h_WD ≈ 15mm above floor (mid-height)
   RC tip sits at h_tip = 0mm (floor contact)

   Rubber Weight Core: its mass spans from floor to ~18mm — it IS both.
   Effective mass centroid ≈ h_com_RC ≈ 9mm above floor (lower than typical WD position)

   Lower h_com_contribution than a separate WD:
   → Combining WD+RC lowers the CoM slightly vs having a separate WD at 15mm + RC at 0–8mm
   → Lower h_com → smaller gravity tilt torque → marginally more stable
   BUT: the rubber outer shell adds mass at the periphery (r_rubber ≈ 15mm)
   → ΔI_rubber = m_rubber × r_rubber²  → non-negligible I at WD radius → good stamina
```

### Cylindrical Rubber Contact — Neither Spherical nor Disc

```
   Cross-section of Rubber Weight Core (side view):

        ║  AR above
   ╔════╩════════════════════════════╗
   ║        RUBBER SHELL             ║  ← rubber cylinder, r_outer ≈ 15mm
   ║   ╔═══════════════════════╗     ║    height ≈ 12mm
   ║   ║   PLASTIC CORE        ║     ║    contacts opponents LATERALLY
   ║   ╚═══════════════════════╝     ║
   ╚════════════╦════════════════════╝
                ║  plastic semi-flat tip
   ═══════════════════════════════════  floor

   Rubber shell geometry: vertical cylinder wall → contact normal is ALWAYS radial (horizontal)
   → No upward component → NO upper attack geometry (contact angle = 0° from radial)
   → This is why it "does not protect against Upper Attack as well as a free-spinning CWD"

   When opponent AR contacts the rubber cylinder:
   F_normal is horizontal (radial) → pushes opponent outward (ring-out force)
   F_tangential = μ_rubber × F_normal = 0.85 × F_normal → high friction against tangential slide
```

### Force Smash — Diagonal Lower Rim Geometry

```
   "The lower rim of the rubber shell is on a diagonal angle that gradually forces
    the opposing Beyblade downward into the stadium floor."

   Diagonal lower rim cross-section:

        ╔═══════════════════╗  ← rubber shell body (vertical walls)
        ║                   ║
         ╲                 ╱  ← DIAGONAL lower rim (angled INWARD and DOWN)
          ╲               ╱    angle from horizontal ≈ 30–40°
           ═══════════════     ← lowest rim edge contacts opponent from above

   When this diagonal rim contacts an opponent's AR from above (as Rubber Weight Core spins):
   ├── The angled face presents a downward normal component: F_down = F × sin(35°) ≈ 0.57F
   ├── The downward force on opponent's AR pushes opponent's tip into the floor
   └── Increased floor contact on opponent: N_opp_floor += F_down → tip friction spikes

   Force Smash mechanism:
   Opponent pressed into floor → μ_tip × N_floor increases → opponent spin decays faster
   Meanwhile: the diagonal rim also deflects the contact outward → ring-out assistance
   → Combined: "Force Smash" = downward press + lateral push (two-direction attack)

   F_down = J × sin(35°) ≈ 0.57 × J_contact
   F_lateral = J × cos(35°) ≈ 0.82 × J_contact
```

### Same-Spin vs Opposite-Spin Dependency

```
   At the rubber cylinder contact, the relative surface velocity is key:

   SAME-SPIN (both CCW — correct for Rubber Weight Core):

   Both surfaces at the contact point move in the SAME lateral direction:
   v_surface_RWC = ω_RWC × r_rubber  (rightward at contact)
   v_surface_opp = ω_opp × r_opp_ar  (also rightward — same spin direction)
   v_rel = v_surface_RWC - v_surface_opp  (small, near zero if ω_RWC ≈ ω_opp)

   Low v_rel → low friction force → rubber deforms gently → impact is ABSORBED smoothly
   The rubber compresses and recoils slowly → acts as a proper shock absorber (Case 21)
   Result: "soft sound", "little ground lost" — the rubber works as intended

   OPPOSITE-SPIN (opponent CW — wrong direction):

   v_surface_opp = -ω_opp × r_opp_ar  (leftward — reversed direction)
   v_rel = v_surface_RWC + v_surface_opp  (ADDITIVE — same as Case 30 spin steal mechanism)

   High v_rel → high friction force → rubber grips opponent's AR and DRAGS it
   But this drag acts on the rubber cylinder surface → rubber twists and deforms against itself
   High deformation rate in rubber → viscoelastic energy dissipation → BOTH beys lose spin
   Result: rubber can't absorb the hit cleanly; it fights the contact → poor defense,
           and opposite-spin relative velocity drives rapid spin loss on both beys

   This is why "opposite spin → performs very poorly and can be outspun by Attack types":
   The very property that makes rubber work (low v_rel absorption) is inverted.
```

```typescript
   interface RubberWeightCoreState {
     r_rubber: number;         // mm outer radius of rubber cylinder (≈ 15mm)
     h_rubber: number;         // mm height of rubber cylinder (≈ 12mm)
     rimDiagonalAngle: number; // degrees from horizontal (≈ 35° — the Force Smash angle)
     tipType: 'semi_flat';     // built-in plastic semi-flat
     muStatic: 0.90;           // rubber: high static
     muKinetic: 0.85;          // rubber: high kinetic (small gap — viscous material)
     restitution: 0.25;        // rubber: absorbs ~75% as heat (same-spin case)
   }

   function resolveRWC_contact(
     rwc: RubberWeightCoreState, bey: BeyState, opponent: BeyState, J: number
   ): { J_lateral: number; J_down: number } {
     // Force Smash: diagonal lower rim
     const J_lateral = J * Math.cos(rwc.rimDiagonalAngle * DEG2RAD);
     const J_down    = J * Math.sin(rwc.rimDiagonalAngle * DEG2RAD);

     // J_down presses opponent into floor (increases opponent's N_floor)
     opponent.floorNBoost = (opponent.floorNBoost ?? 0) + J_down;  // used next tick for friction

     return { J_lateral, J_down };
   }

   function computeRWC_spinLoss(
     bey: BeyState, opponent: BeyState, rwc: RubberWeightCoreState, N: number, dt: number
   ) {
     const omega_bey = bey.spin / bey.I;
     const omega_opp = opponent.spin / opponent.I;
     const sameSpin = Math.sign(bey.spin) === Math.sign(opponent.spin);

     const v_rel = sameSpin
       ? Math.abs(omega_bey * rwc.r_rubber - omega_opp * (opponent.r_ar ?? rwc.r_rubber))
       : (omega_bey * rwc.r_rubber + omega_opp * (opponent.r_ar ?? rwc.r_rubber));

     const F_friction = rwc.muKinetic * N;
     // High v_rel (opposite-spin) → high friction → more spin loss for both
     bey.spin -= (F_friction * rwc.r_rubber * 0.001 / bey.I) * dt;
     opponent.spin -= (F_friction * (opponent.r_ar ?? rwc.r_rubber) * 0.001 / opponent.I) * dt;
   }
```

---

## Case 48 — Advance Defenser (HMS): Metal Roller Contact Points and Rolling Friction

> **Stock combo (Advance Guardian):** AR: Advance Defenser · WD/CWD: Circle Heavy · RC: Grip Sharp Core

Advance Defenser introduces a physics primitive absent from all prior cases: **metal rollers** embedded in the AR as contact points. A roller is a cylindrical bearing that can rotate around its own axle when struck. This means the CP surface at impact can roll rather than slide — replacing sliding kinetic friction (μ_kinetic) with rolling resistance (C_rr), which is dramatically lower.

### Metal Roller Geometry

```
   Advance Defenser top view:

        [ROLLER]     ← metal cylinder, axle parallel to spin axis
       ╱         ╲      can rotate freely around its own axle
      │  plastic  │
      │  AR body  │   [ROLLER]  ← second roller at 180°
       ╲         ╱
        [WING]       ← shallow sloped plastic wing (upper attack geometry)
               →

   Two metal rollers at 0° and 180° (bilateral symmetry)
   Each roller: diameter ≈ 8mm, height ≈ 6mm, axle fixed to AR body, roller free to spin
   Two plastic wings at 90° and 270° (shallow slope, upper attack / smash)
```

### Rolling vs Sliding Friction — The Roller Mechanism

```
   When an opponent's AR hits the metal roller face:

   SLIDING contact (standard CP):
   Opponent surface slides against roller surface
   F_friction = μ_kinetic × N = 0.25 × N  (metal kinetic, Case 34 MF)

   ROLLING contact (roller spins under impact):
   Opponent surface causes roller to rotate → instead of sliding, the roller ROLLS
   Rolling resistance: F_roll = C_rr × N  (rolling resistance coefficient)

   C_rr for metal ball/roller on plastic: ≈ 0.002–0.005
   vs μ_kinetic for metal sliding on plastic: ≈ 0.25

   F_roll / F_sliding ≈ 0.003 / 0.25 ≈ 1.2% — rolling friction is ~83× smaller

   This means:
   ├── Spin steal through rollers: ~83× less than through a fixed metal CP
   ├── Spin energy dissipated per contact: tiny
   └── The roller DEFLECTS the impact rather than gripping it

   Restitution: the roller's low friction means the normal component of J dominates.
   μ_bounce of roller contact ≈ 0.80 (metal, elastic normal bounce preserved)
   Net: rollers bounce attacks back without stealing spin from either bey.
```

```
   Roller CP physics:

   Standard smash AR contact:    Roller CP contact:
   J → F_normal (push back)      J → F_normal (push back — same)
     + F_tangential (spin steal)   + F_roll = C_rr × N (tiny spin steal)

   Opponent is BOUNCED back (ring-out threat from attacker)
   but Advance Defenser loses ALMOST NO SPIN from the impact.

   This is the intended defense mechanism: roll away the hit rather than absorb it.
   But in practice: the rollers are too few (2) and too small to intercept most attacks.
   Many opponent ARs will hit the plastic wing sections between rollers → normal sliding.
```

```
   Wing slope upper attack (shallow angle):

   Wing contact angle from horizontal: α ≈ 15°  (shallow, like a gentle ramp)
   Normal component of J from wing contact:
   J_up = J × sin(15°) = J × 0.26   (weak upward push on opponent)
   J_lateral = J × cos(15°) = J × 0.97

   Compare to Circle Upper (Case 50, coming):
   Circle Upper slope angle ≈ 35°
   J_up_circle = J × sin(35°) = J × 0.57   (2.2× more upward force)

   Advance Defenser's shallow slope → weak upper attack confirmed.
   "Too light and gradual to be effective" — the 15° vs 35° angle explains it quantitatively.
```

```typescript
   interface RollerCP {
     axleRadius: number;      // mm: radius of the roller's own axle (small, ~1mm)
     rollerRadius: number;    // mm: radius of the rolling surface (~4mm)
     C_rr: number;            // rolling resistance coefficient (~0.003)
     omega_roller: number;    // current angular velocity of the roller (rad/s)
     I_roller: number;        // moment of inertia of roller around its own axle
   }

   function applyRollerContact(roller: RollerCP, bey: BeyState, J: number, dt: number) {
     // Rolling: roller spins up rather than sliding
     const tau_roller = J * roller.rollerRadius * 0.001;
     roller.omega_roller += tau_roller / roller.I_roller;

     // Spin transmitted to bey body = only rolling resistance (tiny)
     const F_roll = roller.C_rr * J;
     bey.spin -= (F_roll * roller.rollerRadius * 0.001 / bey.I) * dt;
     // vs normal sliding: would be J × μ_kinetic / I_bey → 83× larger
   }
```

---

## Case 49 — Upper Fox (AR) + CWD Circle Attacker (WD) + Bunshin Core (RC): ABS Caul Ramp Blocking, Eccentric-Mass Wobble, and Spring-Actuated Two-Body Splitting

> **Stock combo (Phantom Fox MS):** AR: Upper Fox · WD/CWD: CWD Circle Attacker · RC: Bunshin Core

Three parts from Phantom Fox MS, each introducing a distinct new concept: Upper Fox's ABS Caul physically covers part of its upper-attack ramp, reducing effective slope length; CWD Circle Attacker's mass is off-center (two heavy sides), producing a static imbalance that contributes to intentional wobbling; Bunshin Core separates into two independent physics bodies under impact, each obeying its own spin and floor-contact rules.

### Upper Fox — ABS Caul Ramp Blocking

```
   Upper attack geometry (from Case 10):
   A sloped face below the opponent's CoM → opponent's top swings toward attacker next tick.
   The slope must be long enough to deliver a meaningful upward impulse component.

   Full ramp (e.g. Circle Upper, Samurai Upper):
   ├── Ramp starts at AR base (floor-level hit zone) → runs to AR top
   ├── Full ramp length L_ramp ≈ 8–10mm vertical rise
   └── J_up = J × sin(α) where α = arctan(L_ramp / r_ramp) ≈ 30–35°

   Upper Fox with ABS Caul:
   ├── Metal Frame has the full ramp geometry (same shape as Upper Dragon / Devil Crusher)
   ├── BUT: the ABS Caul (plastic overlay) covers the LOWER portion of the ramp
   │   Caul blocks the first ~3mm of vertical rise → ramp effectively starts mid-height
   └── Effective ramp length: L_ramp_effective ≈ 5–6mm (only the exposed upper portion)
       α_effective = arctan(5 / r_ramp) ≈ 18–20°

   J_up_UpperFox = J × sin(19°) ≈ J × 0.33
   J_up_CircleUpper = J × sin(33°) ≈ J × 0.54  (1.6× more lift)

   The ABS Caul acts as a geometry mask that reduces the effective slope angle.
   This is why Upper Fox's upper attack is "hindered" — not by material or mass,
   but by the physical coverage of the ramp entry zone by the plastic caul.
```

```
   Spin-direction asymmetry:

   Right-spin (CCW): ramp face leads → opponent contacts the slope → upper attack
   Left-spin (CW):   sharp point faces lead → contacts opponent laterally → smash attack

   AR asymmetry in left-spin:
   The "couple of sharp enough points" are the metal frame tips (same frame as Upper Dragon).
   These are the ENDS of the ramp slopes — when running backwards, they present as blades.
   Material: metal frame tips = metal (same as the ramp) → smash-type contact.
   But: the tips are SMALL (narrow) → r_cp_smash ≈ r_ramp_tip (smaller than dedicated smash ARs)
   → Smash attack is weak (small effective contact area) vs a full metal-perimeter AR like Jiraiya Blade.
```

### CWD Circle Attacker — Eccentric Mass and Wobble Amplification

```
   CWD Circle Attacker geometry: circular disc with two elevated slopes at 180° spacing.
   "Weight focused on adjacent sides" = the slopes add mass at two specific angular positions.

   This is a static imbalance similar to Case 28 (Twisted), but weaker:
   m_excess per slope ≈ 1.5g at r_slope ≈ 14mm
   d_offset = (m_excess × r_slope) / (m_total_CWD / 2) ≈ small offset from center

   Centrifugal imbalance force: F_imb = m_CWD × d_offset × ω²
   At high spin: F_imb drives the bey in a slightly eccentric orbit → beginnings of wobble
   At mid spin (wobble phase): F_imb REINFORCES the existing wobble if phase-aligned:

   Wobble reinforcement condition:
   The centrifugal imbalance rotates at ω (once per bey revolution).
   The wobble orbit rotates at Ω_p (precession frequency).
   When ω ≈ 2Ω_p: parametric resonance (Case 14 Quake tip mechanism, extended to disk mass)
   → Wobble amplitude grows by F_imb × Δt_per_cycle each revolution

   Additionally: in wobble mode, Circle Attacker's slopes tilt with the bey.
   When bey tilts, slope faces downward on one side → can contact opponent AR at floor level.
   This converts the slopes from "inaccessible" (upright) to "active" (tilted):
   Force Smash geometry in wobble: diagonal slope pressing opponent downward (same as Case 47 rim)
```

```typescript
   interface CircleAttackerState {
     massImbalance: { offset: number; phase: number }; // same as Case 28 MassImbalance
     slopeCount: 2;
     slopeAngle: number;    // degrees from horizontal (Contact angle when tilted)
     slopeRadius: number;   // mm from spin axis to slope face
   }

   // Wobble-mode Force Smash (same formula as Case 47 RWC Force Smash):
   function resolveCircleAttackerSmash(
     ca: CircleAttackerState, bey: BeyState, opponent: BeyState, J: number
   ) {
     if (bey.tiltAngle < 30) return;  // slopes not exposed until sufficient tilt
     const J_down = J * Math.sin(ca.slopeAngle * DEG2RAD);
     opponent.floorNBoost = (opponent.floorNBoost ?? 0) + J_down;
   }
```

### Bunshin Core — Spring-Actuated Two-Body Splitting

```
   Bunshin Core is mechanically two components held together by a spring:

   UPPER PART:  AR is attached here (plastic, no WD slot)
                Has a spring-loaded semi-flat tip facing DOWNWARD (away from arena)
                Separates when hit with sufficient force

   LOWER PART:  WD sits here (holds Circle Balance or similar)
                Has interchangeable floor-contact tip (default: semi-flat)
                Continues spinning on the floor after separation

   Spring compression:
   Pre-separation: spring holds upper + lower parts together as one unit
   Spring force: F_spring ≈ k_spring × δ_preload  (designed to separate at specific hit threshold)

   Separation trigger:
   When bey is hit with J_vertical (upward component at tip level):
   J_up > F_spring × dt_impact → spring releases → parts separate
   (upward impulse at tip exceeds spring preload, tip shoots up, upper part rides it)
```

```
   Post-separation physics — two independent bodies:

   UPPER PART (with AR, no WD):
   Mass: ~m_AR + m_upper_case ≈ 15–18g (lighter)
   Moment of inertia: I_upper ≈ small (AR at ~r_AR, but no WD mass)
   Spin retained: ω_upper ≈ ω_bey at separation (momentum conserved)
   Tip: semi-flat pointing AWAY from arena → no floor contact!
   → Upper part is AIRBORNE immediately after separation (like Case 14 but permanent)
   → No floor friction → slow spin decay (air drag only)
   → Precesses freely (no floor constraint, Case 9 pivot removed)
   → Eventually lands somewhere → if it exits arena: loss for that "half"

   LOWER PART (with WD + tip, no AR):
   Mass: ~m_WD + m_lower_case + m_tip ≈ 12–15g (lighter still)
   I_lower ≈ m_WD × r_WD² ≈ good (WD at radius)
   Spin retained: ω_lower ≈ ω_bey at separation
   Tip: semi-flat → floor contact → normal spin mechanics resume
   → Lower part continues spinning on floor as a small stable disc
   → Small mass → easy to ring-out; small I → easier to destabilize
   → BUT: perfectly circular base (from WD) → good ring-out resistance via orbital dynamics
```

```
   Two-lives tournament rule → physics model mapping:

   "Win by sleep-out: at least 1 part must outspin opponent"
   → Both bodies have their own spin field:
      spin_upper (free, air-decay only) and spin_lower (floor-decay)
   → Win condition: max(spin_upper, spin_lower) > 0 when opponent reaches 0

   "Win by ring-out: 1 part must remain in stadium when opponent exits"
   → Collision detection runs independently for each body:
      if (lower_in_arena OR upper_in_arena) AND (opponent_out_of_arena) → win

   "Lose: both parts knocked out"
   → Both bodies must exit or reach spin=0 simultaneously for defeat

   Independence: after separation, upper and lower part do NOT interact physically.
   Each is its own physics entity with its own velocity, tilt, and spin.
```

```
   Separation threshold:

   F_spring = 5N (estimated — spring designed to pop open on a real hit)
   dt_impact ≈ 0.016s (one tick)
   J_threshold = F_spring × dt_impact = 0.08 N·s

   Any hit with J_vertical > 0.08 N·s triggers separation.
   This is a moderate hit — most attack-type collisions exceed this.
   → Bunshin Core separates early in battle against any competent attacker.

   Post-separation penalty:
   Each half weighs ~half → (Δv = J/m) is doubled for each half (same J, half the mass)
   → Each part is pushed further per hit after separation → ring-out risk doubles.
```

```typescript
   interface BunshinCoreState {
     separated: boolean;
     F_spring: number;         // N: spring preload force (≈ 5N)

     upper: {
       active: boolean;        // still in arena
       x: number; y: number; z: number;
       vx: number; vy: number; vz: number;
       spin: number;
       I: number;
       mass: number;
       tiltAngle: number;
     };
     lower: {
       active: boolean;        // still in arena
       x: number; y: number;
       vx: number; vy: number;
       spin: number;
       I: number;
       mass: number;
       tiltAngle: number;
       tipType: 'semi_flat';
     };
   }

   function checkBunshinSeparation(bey: BeyState, bs: BunshinCoreState, J_vert: number, dt: number) {
     if (bs.separated) return;
     const J_threshold = bs.F_spring * dt;
     if (J_vert > J_threshold) {
       bs.separated = true;
       // Upper part launches upward with spring energy
       bs.upper.vz = bs.F_spring * dt / bs.upper.mass;  // upward velocity
       bs.upper.spin = bey.spin;
       bs.lower.spin = bey.spin;
       bs.upper.active = true;
       bs.lower.active = true;
     }
   }

   function isBunshinAlive(bs: BunshinCoreState): boolean {
     if (!bs.separated) return true;
     return (bs.upper.active && bs.upper.spin > 0.01)
         || (bs.lower.active && bs.lower.spin > 0.01);
   }
```

---

## Case 50 — Circle Upper (HMS AR): Near-Circular Metal Frame, Full-Perimeter Upper Attack, and Mould-Dependent I

> **Stock combo (Death Gargoyle MS):** AR: Circle Upper · WD/CWD: Circle Heavy · RC: Metal Change Core

Circle Upper's Metal Frame is nearly a perfect circle — the outermost boundary of the AR is an unbroken ring with two large deep slopes cut into it. This near-circular shape creates a **tangential deflection dominance** property (similar to Twisted, Case 28, but for attack rather than defense), while the mould difference demonstrates that reinforcing the slope changes I, balance, and upper attack effectiveness simultaneously.

### Near-Circular Metal Frame — Tangential Deflection Dominance

```
   Standard attack AR (e.g., three-blade design):
   ├── Large protruding blades → high r_cp from spin axis → high torque per hit
   ├── Many "grab points" where opponent AR can engage → effective smash
   └── Blade faces are perpendicular to radius → steep contact normal

   Circle Upper Metal Frame (near-circular outer ring):
   ├── Outer boundary ≈ smooth circle → contact normal is RADIAL (90° from tangent)
   │   Wait — radial normal means: F_normal = J (full impulse goes INWARD to defender)
   │   But contact with a circular surface at any point:
   │   Normal direction = toward center of circle = along spin radius
   │   → F on defender = J × (inward) → pushes defender toward center (NOT ring-out!)
   │
   │   ACTUALLY: for contact between two beys:
   │   The normal is from B center → A center (Case 12).
   │   If A's AR is circular and contact occurs at the rim:
   │   The rim normal ≈ the bey-to-bey normal → they coincide → standard formula applies.
   │
   │   The key insight is NOT the normal direction but the LACK OF GRAB POINTS:
   │   Smooth circular rim → no protrusion for opponent to latch onto
   │   → Any impact is TANGENTIAL or GLANCING → attacker deflects off
   │   → "Many hits will not be incredibly effective" — attacker bounces off the smooth ring

   The circle protects by DENIAL OF ENGAGEMENT: attackers cannot anchor at a sharp feature.
   Each hit is equivalent to a glancing blow on a round surface.
   Only the two slopes provide actual grab points → those are the Upper Attack zones.
```

```
   Full-perimeter mass vs gap distribution:

   Three-blade AR: mass concentrated at 3 blade positions + 3 air gaps between them
   Circle Upper: mass along the FULL circumference (nearly uninterrupted)

   For Circle Upper (outer ring of mass m_ring at r_ring ≈ 18mm, plus inner caul):
   I_ring = m_ring × r_ring²
   All metal at max radius → highest possible I for given mass (like Phantom, Case 18)

   "No metal near the center, only along the outside rim":
   ├── I is maximized (all mass at r_ring)
   └── BUT: if the ring is not perfectly uniform (slopes remove metal at 2 points),
       there are two angular positions with LESS metal → static imbalance (Case 28)
       The slope cutouts are symmetric (180° apart) → bilateral asymmetry
       → I_principal varies by direction: I_through_slopes < I_perpendicular
       → Causes the "poor balance" and wobbling on tall RCs
```

### Mould Difference — Slope Reinforcement Changes I and Contact Profile

```
   FIRST MOULD:
   Slope face: thinner metal along the upper attack ramp
   ├── Metal mass: less along slope → lower I at slope angle
   ├── Better balance (less mass imbalance between slope vs non-slope sections)
   └── Better stamina (lower I per unit mass is NOT always worse — lighter = longer spin)

   Wait: "previous mould is lighter and has better Survival capability"
   → First mould has LESS MASS along the slope → total AR mass lower → I_total lower
   → Lower I → faster wobble onset... but lighter total AR allows stamina tip to spin longer
   This is the mass-stamina tradeoff from Case 18: lower mass = faster ω decay rate from friction,
   but also lower friction torque from lighter tip-floor normal force.
   Net: lighter first-mould Circle Upper has better spin retention (less mass = less N_floor = less friction)

   SECOND MOULD:
   Slope face: reinforced, significantly thicker and heavier
   ├── More metal mass along slope → higher I at slope angle
   ├── MORE static imbalance (heavier slopes vs non-slope sections → larger d_offset, Case 28)
   ├── Greater tendency to wobble → can be used intentionally for wobble combos
   └── Better upper attack: thicker slope → more effective contact face → higher J_up per hit

   Mass and I comparison:
   I_second_mould = I_first_mould + ΔI_reinforcement
   ΔI_reinforcement = m_extra × r_slope²  (extra metal at slope radius ≈ 18mm)

   This ΔI is NOT uniformly distributed → it exists only at the slope angles (0° and 180°)
   → Increases I_principal_slopes while leaving I_principal_perpendicular the same
   → Static imbalance d_offset_second > d_offset_first
   → "Alters the balance so it is even more prone to wobbling" — exactly from larger d_offset
```

```
   Wobbling strategy — Circle Upper second mould:

   Normal use: AR on standard tip → imbalance drives precession → bey wobbles
   Stamina tip (Bearing Core): tip grip ≈ 0 → imbalance drives lateral wandering, not wobble
   When wandering: bey moves around arena → contacts opponent → upper attack from motion
   If bey tilts from contact: wobble amplifies, Circle Attacker's slopes engage (Case 49)

   The wobble combo (Circle Upper + Bearing Core) uses:
   ├── d_offset imbalance → creates orbital motion (like Case 28 Twisted but more severe)
   ├── Bearing Core keeps spin high (near-zero friction tip) → orbit maintained longer
   └── While orbiting, Circle Upper's slopes sweep at height h_AR → upper attack on approach
       Any opponent hit puts them above or below Circle Upper's CoM → upper geometry applies
```

```typescript
   interface CircleUpperConfig {
     mould: 'first' | 'second';
     mass: number;           // g: first≈20g, second≈22g (extra reinforcement)
     massRadius: number;     // mm: outer ring radius (≈ 18mm for both)
     slopeAngle: number;     // degrees from horizontal (≈ 33° for both, but effective differs due to thickness)
     slopeThickness: number; // mm: first≈2mm, second≈4mm (thicker = more effective face)
     ABSCaulCoverage: number;// mm: how much caul covers the ramp entry (this is fixed, both moulds same)
     // effective ramp angle (after caul coverage):
     get effectiveSlopeAngle(): number {
       // Caul reduces visible ramp by ~3mm vertical → reduces effective angle
       return Math.atan2(
         this.slopeThickness * Math.sin(this.slopeAngle * DEG2RAD) - 0.003,
         this.slopeThickness * Math.cos(this.slopeAngle * DEG2RAD)
       ) * RAD2DEG;
     }
     d_offset: number;       // mm: static imbalance offset (first≈0.5mm, second≈1.2mm)
   }
```

---

## Case 51 — Spring Core (HMS RC): Spring-Actuated Launch Bounce, Gyroscopic Axis Discontinuity, and Tip Wander

> **Stock combo (Einstein MS):** AR: Metal Spring · WD/CWD: Circle Heavy · RC: Spring Core

Spring Core is a very tall RC with an internal spring that actuates once at launch, producing a single upward bounce as the bey touches the stadium floor. After the bounce, the spring has no further effect. The tall two-piece construction then introduces a **gyroscopic axis discontinuity**: the gap between the two halves of the RC causes the tip to wander off the spin axis during the match, creating a persistent low-amplitude static imbalance that grows as the joint loosens.

### Spring-Actuated Launch Bounce

```
   Spring Core cross-section (side view):

        ║  AR above
        ║
   ╔════╩═════╗  ← UPPER BODY (plastic, AR mounts here)
   ║           ║
   ║  ╔═════╗  ║  ← SPRING (compressed, held by plastic latch)
   ║  ║ ▼▼▼ ║  ║    releases when latch disengages on first floor contact
   ║  ╚═════╝  ║
   ╚═══════════╝
   ╔═══════════╗  ← LOWER BODY (plastic, has the floor tip)
   ║           ║
   ║           ║
   ╚═════╦═════╝
         ║ semi-flat plastic tip
   ════════════════ floor

   The two bodies are held together by the compressed spring.
   On launch, the tip contacts the stadium floor → latch releases → spring fires.
   Spring impulse: J_spring = k_spring × δ_compression × dt_release
   → Drives upper body UPWARD relative to lower body
   → This lifts the bey's center of mass briefly before gravity returns it
   → Visual: bey "bounces" vertically after launch
```

```
   Spring bounce physics (one-time event at match start):

   Spring energy E_spring = ½ × k_spring × δ² (stored at launch)
   At release: E_spring → KE of separation
   m_upper × v_upper² / 2 + m_lower × v_lower² / 2 = E_spring

   Conservation of momentum (spring internal):
   m_upper × v_upper = -m_lower × v_lower (action-reaction, no net external)

   For m_upper ≈ m_lower ≈ 1.5g each (Spring Core total ≈ 3g):
   v_upper = v_lower = sqrt(E_spring / m_total)

   This bounce is MUCH weaker than Bunshin Core (Case 49) because:
   ├── Spring Core mass: only 3g (vs Bunshin Core ~30g for the full bey)
   ├── Spring energy: small (plastic spring, compressed in a 2cm gap)
   └── The two halves are still CONNECTED (spring is attached, not a launch)
       → They separate and re-contact, oscillating a few times then settle
       → NOT a permanent separation like Bunshin Core
```

### Gyroscopic Axis Discontinuity — Tip Wander

```
   The "separation between the two halves of the RC causes the tip to stray from the axis":

   Ideal RC: tip is a rigid extension of the spin axis.
   spin axis → hub → tip contact point → all collinear.

   Spring Core: the gap between upper and lower body allows relative misalignment:

   Upper body spin axis: │ (perfectly vertical initially)
   Gap joint:             ╲  (slight wobble in the joint)
   Lower body + tip:       ╲  (tip now offset from upper axis by angle φ_wander)

   │←─ r_wander = h_gap × sin(φ_wander)  (tip offset from spin axis)

   This offset r_wander creates the same static imbalance mechanism as Case 28 Twisted:
   F_imbalance = m_lower × ω² × r_wander  (centrifugal, rotates with spin)

   As the match progresses: the joint plastic wears slightly → φ_wander increases
   → r_wander increases → F_imbalance grows → wobble amplitude grows

   The joint is plastic-on-plastic with no bearing → wear rate is high.
   After just a few battles: Spring Core's wander can reach r_wander ≈ 2–3mm
   (worse than Twisted's ~1.5mm imbalance from the spiral staircase void)
```

```
   Height contribution to instability:

   Spring Core total height: "very tall" → h_total ≈ 28–30mm  (taller than most HMS RCs)
   h_com ≈ 18mm (from the mass centroid including AR)

   HMS bey h_com / r_outer ratio with Spring Core:
   h_com ≈ 18mm, r_outer ≈ 17.5mm → h/r ratio ≈ 1.03 (already marginal from Case 45)

   Adding the wander offset:
   r_orbit_wander = r_wander + h_com × sin(θ)   (tip traces both wander AND tilt circles)
   τ_combined = μ × m × g × r_orbit_wander     (total ground friction torque)

   r_orbit_wander > r_orbit_no_wander → faster spin decay → faster wobble onset

   Spring Core fails competitively because:
   1. Spring bounce is a one-time gimmick with no match-long benefit (no repeated jumps)
   2. Joint gap → tip wander → static imbalance growing each battle
   3. Height → extreme h/r ratio for HMS scale → fastest possible tilt growth
   4. "Moves itself into a position where it is easily hit by Attack-types" =
      tall height means AR is at h_AR ≈ 28mm — far ABOVE most opponent ARs
      → Lower hit geometry on Spring Core (Case 10) → Spring Core's top swings toward attacker
      → Counter-strike from Spring Core's own AR is frequent and involuntary — a self-debuff
```

```typescript
   interface SpringCoreState {
     springFired: boolean;          // false until first floor contact
     k_spring: number;              // N/mm spring constant (plastic: ~0.5 N/mm)
     delta_compression: number;     // mm precompression (≈ 5mm)
     wanderAngle: number;           // φ_wander: current joint misalignment (radians)
     wanderWearRate: number;        // rad/battle: wander increases with each match
   }

   function tickSpringCore(bey: BeyState, sc: SpringCoreState, dt: number, onFloor: boolean) {
     if (onFloor && !sc.springFired) {
       // One-time spring release at first floor contact
       sc.springFired = true;
       const E_spring = 0.5 * sc.k_spring * 1000 * sc.delta_compression * 0.001
                      * sc.delta_compression * 0.001;  // J
       const v_bounce = Math.sqrt(2 * E_spring / bey.mass);
       bey.vz = v_bounce;  // upward launch
     }

     // Tip wander: static imbalance from joint gap
     const r_wander = JOINT_GAP_HEIGHT * Math.sin(sc.wanderAngle);
     const omega = bey.spin / bey.I;
     const F_imbalance = bey.mass * omega * omega * r_wander;
     const phase = omega * totalTime;
     bey.vx += (F_imbalance / bey.mass) * Math.cos(phase) * dt * 0.01;
     bey.vy += (F_imbalance / bey.mass) * Math.sin(phase) * dt * 0.01;
   }
```

---

## Case 52 — Metal Spike (MS): Hertzian Contact Stress, Stadium Denting, and the WBO Ban

Metal Spike is a metal tip with a single hardened spike. It is banned from WBO play not because of any rules violation, but because the metal spike exceeds the yield strength of the plastic stadium floor — the **stadium** wears, not the tip. This case introduces Hertzian contact mechanics, the only case where the floor material matters as a physics variable.

### Hertzian Contact Stress — Point Load on a Plastic Surface

```
   Standard plastic/rubber tip on stadium:
   Contact is between two similar-modulus materials (ABS on ABS / ABS on rubber).
   Contact stress ≈ uniformly distributed → no permanent deformation.

   Metal spike on ABS stadium:
   E_metal ≈ 200 GPa (steel)
   E_ABS   ≈ 2 GPa   (thermoplastic)
   E*  = ((1-ν_m²)/E_m + (1-ν_s²)/E_s)⁻¹
       ≈ ((1 - 0.28²)/200e9 + (1 - 0.38²)/2e9)⁻¹
       ≈ (4.6e-12 + 4.3e-10)⁻¹ ≈ 2.32 GPa  (dominated by ABS)

   Hertzian maximum contact pressure (point contact):
   P_max = (6 × F × E*² / (π³ × R²))^(1/3)

   Where:
   F = normal force on tip = m × g = 0.045 × 9.8 ≈ 0.441 N
   R = tip radius ≈ 0.3mm = 3×10⁻⁴ m (very sharp metal spike)

   P_max = (6 × 0.441 × (2.32e9)² / (π³ × (3e-4)²))^(1/3)
         = (6 × 0.441 × 5.38e18 / (31.006 × 9e-8))^(1/3)
         = (1.424e19 / 2.79e-6)^(1/3)
         = (5.1e24)^(1/3) ≈ 1.72 × 10⁸ Pa = 172 MPa

   ABS yield strength ≈ 40–60 MPa.
   172 MPa >> 60 MPa → PERMANENT PLASTIC DEFORMATION of the stadium floor.
```

```
   What permanent deformation means in a match:

   Normal tip: floor is elastic → tip always rests on smooth flat surface → constant μ
   Metal Spike after first contact: a small pit ≈ R_contact deep forms at contact point.
   Pit geometry:
   R_contact = (3FR / 4E*)^(1/3) = (3 × 0.441 × 3e-4 / (4 × 2.32e9))^(1/3) ≈ 0.07mm

   After N contacts in the same spot (tip orbits → returns to same pit):
   ├── Pit depth grows: δ ≈ (N × F / (E* × R))^(1/2) × R
   └── Tip catches on pit edge → friction spike → tip sticks → bey lurches

   Across the arena floor: many small pits form along the orbital path.
   → Floor is no longer smooth → friction is non-uniform → deterministic PRNG cannot
     predict the bey path anymore → match outcome depends on which pits exist.
   → Progressive stadium destruction over multiple matches.
```

```
   Why this is "reversed wear" vs all other tips:

   All prior tips (S, MF, MB, RB, RF, WD, EWD, etc.):
   The TIP wears (rubber spheres flatten, plastic tips dent, metal glazes).
   The stadium floor is relatively unaffected (soft tip hits soft floor).

   Metal Spike:
   The TIP does not wear (hard metal, elastic in its own regime).
   The STADIUM wears (ABS floor yields under Hertzian stress).

   This asymmetry means:
   ├── WBO stadiums become unusable after a Metal Spike user plays a few matches
   ├── The damage is cumulative and irreversible (plastic deformation, not elastic)
   └── The ban is therefore an equipment protection rule, not a safety or fairness rule.
```

```typescript
   // Metal Spike physics — no tip wear model (tip does not wear):
   MS_profile:
   layers = [{
     innerR: 0,
     outerR: 0.3mm,           // extremely sharp spike (R = 0.3mm)
     innerZ: 0, outerZ: 0,
     chamfer: 90°,
     material: 'metal',
     muStatic: 0.80,          // metal on undamaged ABS: high static
     muKinetic: 0.20,         // metal on ABS: very low kinetic
     restitution: 0.85,       // metal: highly elastic
     wearModel: null,         // tip is harder than floor: no tip wear
     stadiumDamage: {
       enabled: true,
       P_max: 172e6,          // Pa (exceeds ABS yield 60 MPa)
       pitRadius: 0.07mm,
       pitDepth: (N, F, R, E_star) => Math.sqrt(N * F / (E_star * R)) * R,
     }
   }]

   // In game engine: MS is flagged as banned (canUseInTournament = false)
   // Stadium denting is tracked per-arena for offline/training mode only.
```

---

## Case 53 — Hades Fusion Wheel + BD145: Geometric Complementarity, Gap-Filling, and Normal-Mode Floor Scraping

> **Stock combo (Fusion Hades AD145SWD):** 4D CW: Hades · 4D MW: Fusion · Track: Armor Defense 145 · Bottom: Sharp Wide Defense

Hades has three wide wings with deep gaps between them. BD145 has three protrusions that match the width of those gaps. When assembled, BD145's protrusions fill Hades's gaps, creating a near-solid composite disc. The mode change (which way BD145 is oriented) determines whether the protrusions fill the gaps (Boost Mode = defensive) or stick down toward the floor (Normal Mode = scraping disaster).

### Geometric Complementarity — Gap Filling Creates Near-Solid Disc

```
   Hades wheel (top view, three wings):

        [WING]      [WING]      [WING]
       ╱      ╲   ╱      ╲   ╱      ╲
      │  GAP   │ │  GAP   │ │  GAP   │
       ╲      ╱   ╲      ╱   ╲      ╱
   Gap arc: ~40° each (3 gaps × 40° = 120° total air; 240° is wing)

   BD145 Boost Mode protrusions (top view, three prongs):

        [PRONG]             [PRONG]             [PRONG]
       ╱       ╲           ╱       ╲           ╱       ╲
   each prong spans ≈ 38° at the BD145 outer radius

   Assembled (Boost Mode): prongs seat INTO gaps:

        [WING+PRONG]    [WING+PRONG]    [WING+PRONG]
       ╱             ╲ ╱             ╲ ╱             ╲
      ← near-continuous outer ring with minimal gaps remaining →
```

```
   I comparison: gap-filled vs gapped Hades alone:

   Hades alone: 3 wings (240° of metal) + 3 air gaps (120° of void)
   I_Hades = m_wings × r_wing² × (240/360) + 0 = 0.667 × m_wings × r_wing²

   Hades + BD145 Boost: gaps filled by BD145 prongs (additional mass at r_prong ≈ r_wing)
   I_composite = m_wings × r_wing² × 0.667 + m_prongs × r_prong² × 0.333
               ≈ (m_wings × 0.667 + m_prongs × 0.333) × r_ring²

   If m_prongs ≈ 0.4 × m_wings (prongs fill ~40° of 120° gap each):
   I_composite ≈ (0.667 + 0.133) × m_wings × r_ring² = 0.80 × m_wings × r_ring²

   I_composite / I_Hades ≈ 0.80 / 0.667 ≈ 1.20  (+20% more I)

   20% more I → 20% more gyroscopic stiffness → harder to tilt.
   This is why Boost Mode gives "excellent Defense" — it's not just aesthetics,
   it physically increases I by filling the missing mass arcs.
```

### Normal Mode — BD145 Protrusions Pointing Down → Catastrophic Floor Scraping

```
   BD145 Normal Mode: BD145 rotated so protrusions face DOWNWARD (toward floor).

   Prong height above floor when bey is upright: h_prong ≈ BD145_height - prong_extension
   Standard BD145 height = 14.5mm; prong extension below BD145 base ≈ 3mm
   → h_prong ≈ 14.5 - 3 = 11.5mm above floor

   Scraping condition (same formula as R145, Case 26):
   h_prong - r_prong × sin(θ) ≤ 0
   θ_scrape = arcsin(h_prong / r_prong) = arcsin(11.5 / 20) = arcsin(0.575) ≈ 35°

   Wait — prongs are NOT at r=20mm. They are INNER prongs that fill the Hades gaps.
   r_prong ≈ 12mm (filling inner gap area, not outer rim)
   θ_scrape = arcsin(11.5 / 12) = arcsin(0.958) ≈ 73°

   73° is a very high tilt — only reached in late-match wobble.
   So actually Normal Mode scraping is limited to extreme wobble phase.

   BUT: the protrusions also create a contact surface at track height:
   At ANY tilt > 0°, the downward-facing prong's TIP can catch on the stadium rim
   if the bey moves to the edge. This is an irregular contact, not smooth scraping.
   → "Normal Mode suffers heavily from scraping" when bey is actively bouncing/tumbling
     (same as R145 in Case 26 when tilt exceeds threshold).
```

```typescript
   interface HadesBD145State {
     mode: 'boost' | 'normal';
     I_composite: number;    // computed from gap-fill fraction
     prongHeight: number;    // mm above floor when upright (Normal Mode: 11.5mm)
     prong_r: number;        // mm from spin axis (≈ 12mm)
   }

   function computeHadesBD145_I(state: HadesBD145State, m_hades: number, m_bd145: number): number {
     if (state.mode === 'boost') {
       // Prongs fill gaps → near-solid disc I
       return (m_hades * 0.667 + m_bd145 * 0.333) * (20e-3) ** 2;
     }
     // Normal Mode: prongs pointing down → don't contribute to horizontal I
     return m_hades * 0.667 * (20e-3) ** 2;
   }
```

---

## Case 54 — Defense Spike (DS): Convex Outer Ring Always-Glancing Geometry and Compound S+D Tip

> **Stock combo (Hell Kerbecs BD145DS):** Clear Wheel: Kerbecs · Metal Wheel: Hell · Track: BD145 · Bottom: Defense Sharp

Defense Spike is a circular tip with an outer rubber-like ring surrounding a central sharp spike. The outer ring is **convex** — it curves upward and outward from the flat base, so the contact normal at ANY impact point on the ring has a component that deflects the attacker TANGENTIALLY rather than pushing radially inward. This is the "convex ring geometry" deflection mechanism.

### Convex Ring — Always-Glancing Contact Normal

```
   DS outer ring profile (side cross-section):

        ║  bey body
        ║
   ╔════╩═══════════════╗
   ║      ╭─────────╮   ║  ← convex ring (curves outward/upward like a torus segment)
   ║      │ [SPIKE] │   ║    inner spike visible through/below the ring
   ╚══════╩═════════╩═══╝
          ↓ spike
   ═════════════════════  floor

   Ring cross-section: circular arc, peak at outer edge, tapers inward
   Contact normal at any point on the ring: tangent to the arc → points AWAY from center
                                             always has outward + upward component
                                             NEVER purely radial (inward)

   Opponent AR hits ring face:
   F_normal is NOT directed toward DS's spin axis
   F_normal is directed along the tangent to the convex surface = GLANCING deflection
   → Attacker is redirected sideways, not reflected straight back
   → Self-recoil on DS = only the small inward component: F × sin(α_ring_slope)
```

```
   Convex ring contact angle α (angle of ring surface from tangent):

   If ring radius of curvature = R_ring and contact height h_contact above base:
   α = arcsin(h_contact / R_ring)

   At h_contact = 0 (base of ring): α = 0 → purely tangential → zero self-recoil
   At h_contact = R_ring (top of ring): α = 90° → radial → maximum self-recoil

   For DS (R_ring ≈ 8mm, typical contact h ≈ 2–4mm):
   α ≈ arcsin(3/8) ≈ 22°
   Self-recoil fraction: sin(22°) ≈ 0.37  (only 37% of J reaches spin axis)
   Deflection fraction:  cos(22°) ≈ 0.93  (93% deflects attacker laterally)

   Compare to Kreis Defense Mode (Case 16): α ≈ 10° → sin(10°) = 0.17 (17% inward)
   DS is LESS defensive than Kreis Defense Mode on paper (37% vs 17% inward).
   But DS has no rubber → higher restitution → attacker bounces harder → more ring-out threat.
```

### Compound S+D Tip — Regime Switch at θ_transition

```
   DS tip cross-section (side view, tip pointing DOWN):

   Center: Sharp spike → contacts floor when upright (θ < θ_transition)
   Outer:  Convex ring base → contacts floor when tilted (θ > θ_transition)

   This is the same compound geometry as SWD (Case 22) and SF (Case 15),
   but with a CONVEX ring instead of a flat WD ring or blunt SF cone.

   θ_transition_DS = arctan(h_spike_protrusion / r_ring_inner)

   If spike protrudes h_spike ≈ 1mm below ring base, r_ring_inner ≈ 3mm:
   θ_transition_DS = arctan(1/3) ≈ 18°

   Below 18°: spike primary → near-zero friction → Stamina regime
   Above 18°: ring base contacts floor → moderate friction → Defense regime
              but the convex ring still presents glancing normals to opponents

   The regime switch is the same binary threshold from Case 60 CS.
   DS = CS with plastic ring instead of rubber ring + convex profile instead of flat.
```

---

## Case 55 — L-Drago I + Lightning: Plastic Mode Selector and No-Rubber Falsification

L-Drago I is the original left-spin wheel with a three-dragon-head design, two plastic modes (Upper Mode: three slope faces outward; Rapid-Hit Mode: three blade faces outward). Lightning is a plain plastic Energy Ring used as a neutral-material control condition. Together they confirm that a plastic mode selector without rubber produces negligible actual mode differences — extending the falsification from Case 31 to the wheel level.

### Upper Mode vs Rapid-Hit Mode — Slope vs Blade

```
   L-Drago I top view — Upper Mode (slopes outward):

        [SLOPE]     [SLOPE]     [SLOPE]
       ╱ ramp  ╲   ╱ ramp  ╲   ╱ ramp  ╲
      │ face↑   │ │ face↑   │ │ face↑   │
   Three ramp faces with upward component (similar to Case 20 Assault — 3 wings)
   Contact angle from tangent ≈ 25° → J_up = J × sin(25°) ≈ 0.42J
   Frequency: 3 × ω / (2π) contacts/second

   L-Drago I top view — Rapid-Hit Mode (blades outward):

        [blade] [blade] [blade] [blade] [blade] [blade]
   Six blade edges around circumference (same as Case 20 Barrage — 6 wings)
   Contact angle from tangent ≈ 15° → J_up = J × sin(15°) ≈ 0.26J
   Frequency: 6 × ω / (2π) contacts/second
```

```
   Energy equivalence (from Case 20):

   P_Upper    = 3 × f_contact × J_upper = 3ω/(2π) × J_large
   P_RapidHit = 6 × f_contact × J_blade  = 6ω/(2π) × J_small ≈ 6ω/(2π) × J_large/2
              = P_Upper  (same total power)

   Both modes deliver the same total attack energy per second.
   The mode only changes concentration (Upper: 3 large) vs frequency (Rapid-Hit: 6 small).

   Without rubber:
   J_upper = J_blade × plastic_ratio  (both are plastic-to-plastic contact)
   μ_plastic_slope ≈ 0.40, μ_plastic_blade ≈ 0.42  (nearly identical)
   → The mode difference is effectively zero (same falsification as Case 31 for Energy Rings)

   Conclusion: L-Drago I + Lightning mode change has negligible physics impact.
   The rubber on L-Drago II was the ENTIRE source of the mode difference (Case 31 confirmed at wheel level).
```

---

## Case 56 — HFS (Hard Metal System): Between-Battle Mode Change — The Fourth Timing Category

HFS beyblades (like Metal Driger) require physical disassembly between battles to change modes — you must pull the RC apart to rotate the tip carrier. This is distinct from all three prior mode-change categories in the game (Case 17 Diablo = automatic; Case 19 Jade = pre-match; Case 24 Gravity = pre-match) because it requires **disassembly**, which takes non-trivial time and cannot be done mid-match.

### The Four Timing Categories

```
   ┌─────────────────────┬────────────────────────────────────────────────────────┐
   │ Category            │ When / How                                             │
   ├─────────────────────┼────────────────────────────────────────────────────────┤
   │ 1. Automatic        │ Spin speed drops → mechanical trigger activates        │
   │    (Diablo UBM)     │ No player action; centrifugal detents fire             │
   ├─────────────────────┼────────────────────────────────────────────────────────┤
   │ 2. Per-hit          │ Impact exceeds threshold → frame slides or snaps       │
   │    (Kreis Defense)  │ No player action; physics-triggered each hit           │
   ├─────────────────────┼────────────────────────────────────────────────────────┤
   │ 3. Pre-match        │ Player physically rotates part before the battle       │
   │    (Gravity, Jade,  │ Bey is assembled; no disassembly needed                │
   │     P.Nemesis, Duo) │ Mode is fixed for the entire battle                    │
   ├─────────────────────┼────────────────────────────────────────────────────────┤
   │ 4. Between-battle   │ Requires disassembly between rounds                   │
   │    (HFS — this case)│ Cannot change during a match or in the launch window  │
   │                     │ Takes ~30–60s of manual work; only during round break  │
   └─────────────────────┴────────────────────────────────────────────────────────┘
```

```
   Why disassembly matters as a physics-model distinction:

   Pre-match (Category 3): mode is constant for the match → single physics state
   Between-battle (Category 4): mode CAN change between games in a series, but:
   ├── Player must decide BEFORE the round starts
   ├── Cannot react to in-match information (cannot change after seeing opponent)
   └── In the game engine: treated identically to Category 3 (fixed for each game)
       but the UI should allow re-selection between games in a BO3/BO5 series

   In-match consequence: zero. The HFS tip mode is a constant for each game,
   exactly like Category 3. The distinction is in the metagame (adaptation between games),
   not the within-game physics simulation.

   Data model: HFS mode → stored as activeModeId in BeybladeSystem,
   updatable between rounds (via resetForNextGame() hook), not mid-tick.
```

---

## Case 57 — H145 (Horn 145): Hyper-Extended Contact Point Radius Beyond Wheel Perimeter

> **Stock combo (Dark Bull H145SD):** Clear Wheel: Bull · Metal Wheel: Dark · Track: H145 · Bottom: Semi Defense

H145 has two horn protrusions that extend outward beyond the radius of the Fusion Wheel sitting above it. This means r_horn > r_wheel — the contact radius for hits at horn height EXCEEDS the attack ring radius. The torque arm for hits at horn height is therefore LARGER than any Fusion Wheel CP can provide.

### Hyper-Extension — r_horn > r_wheel

```
   Side view of H145 under a Fusion Wheel:

        ║  Fusion Wheel body (r_wheel ≈ 23mm)
   ═════╩═════════════════════════════  ← AR outer edge at r_wheel
        │
   ─────┼───────────────────────────── ← H145 horn tips at r_horn ≈ 25–27mm
        │  ← EXTENDS BEYOND WHEEL PERIMETER by 2–4mm
        ║
       tip
   ═══════ floor

   At horn height h_horn (≈ 14.5mm above floor, same as standard 145 height):
   An attacker whose AR is at h_horn can hit the horn BEFORE reaching the wheel.

   r_horn = 26mm (horn tip radius from spin axis, estimated)
   r_wheel = 23mm (Fusion Wheel AR radius)

   r_horn - r_wheel = 3mm  → horn is 3mm wider than the wheel above it.
```

```
   Torque arm comparison (Case 9 floor-constraint):

   Standard Fusion Wheel hit at r_cp = 23mm:
   τ = r_cp × J = 23 × J   (mm·N)

   H145 horn hit at r_horn = 26mm, floor as pivot:
   τ = (h_horn / tan(θ_approach)) × J

   But more importantly: the effective r_cp for tilt torque (Case 12) is:
   r_cp_horn = r_horn = 26mm > r_cp_wheel = 23mm

   Δτ per hit at horn vs at wheel = (26 - 23) / 23 = 13% more torque per hit
   → H145 bey gets 13% more tilt per hit at horn height
   → More destabilizing than a standard 145 combo when opponents can reach the horns

   Horn geometry: plastic protrusion → C145-like buffer (Case 35)
   The horn can flex/pivot slightly under impact → acts as a partial impact absorber
   Second mould reinforced horn → stiffer → less flex → more direct impulse transmission
   Same as C145 first vs second mould: stiffer mould = more transmission, less buffering
```

```typescript
   interface H145State {
     hornCount: 2;
     r_horn: number;           // mm from spin axis (≈ 26mm — beyond wheel r_wheel ≈ 23mm)
     h_horn: number;           // mm above floor (same as standard 145 height ≈ 14.5mm)
     hornFlex: number;         // 0.0–1.0: 1.0 = rigid (second mould), 0.5 = first mould flex
   }

   // r_cp for collision when attacker hits at h_horn:
   function resolveH145_rcp(state: H145State, attackerARHeight: number): number {
     if (Math.abs(attackerARHeight - state.h_horn) < 2) {  // ±2mm tolerance
       return state.r_horn;  // hyper-extended contact radius
     }
     return 0;  // no horn contact at this height
   }
```

---

## Case 58 — GB145 (Gyro Ball 145): Ball Migration at Track Height and Height-Denial Contact Surface

> **Stock combo (Earth Virgo GB145BS):** Clear Wheel: Virgo · Metal Wheel: Earth · Track: GB145 · Bottom: Ball Sharp
> **Stock combo (Infinity Libra GB145S):** Clear Wheel: Libra · Metal Wheel: Infinity · Track: GB145 · Bottom: Sharp

GB145 places two steel balls in channels at the TRACK level (not the wheel level like Jade Case 19). The angular momentum conservation spin-up is identical (Case 19 equations apply), but the balls are heavier steel and mounted at track height — creating a **height-denial** contact surface that stops opponents from reaching the Fusion Wheel from below.

### Ball Migration at Track Height — Same Physics, Different Mass and Location

```
   GB145 vs Jade comparison:

   Jade (Case 19):   balls in Fusion Wheel at h_wheel ≈ 30–40mm above floor
                     m_ball ≈ 0.065g each (small plastic/rubber coated balls)
                     r_outer ≈ 20mm, r_inner ≈ 10mm

   GB145:            balls in track body at h_track = 14.5mm above floor
                     m_ball ≈ 2.5g each  (steel balls, much heavier)
                     r_outer ≈ 14mm, r_inner ≈ 6mm  (constrained by track width)

   The angular momentum conservation formula (Case 19) applies identically:
   ω_new / ω_old = I_old / I_new = (I_bey + 2 × m_ball × r_outer²) / (I_bey + 2 × m_ball × r_inner²)

   For GB145:
   I_old_balls = 2 × 0.0025 × 0.014² = 9.8×10⁻⁷ kg·m²
   I_new_balls = 2 × 0.0025 × 0.006² = 1.8×10⁻⁷ kg·m²
   ΔI = 8.0×10⁻⁷ kg·m²   (larger than Jade's ΔI ≈ 2.4×10⁻⁶ because r_outer is smaller)

   But GB145 has 2 steel balls vs Jade's 4 lighter balls.
   m_steel_total = 2 × 2.5g = 5g (at track height)
   ΔI_GB = 5g × (14mm² - 6mm²) = 5×10⁻³ × (1.96×10⁻⁴ - 3.6×10⁻⁵) = 8.0×10⁻⁷ kg·m²

   Spin-up ratio:
   ω_new / ω_old = (I_bey + 9.8×10⁻⁷) / (I_bey + 1.8×10⁻⁷)
   For I_bey = 1.5×10⁻⁵:
   = (15.0 + 0.98) / (15.0 + 0.18) × 10⁻⁶ = 15.98 / 15.18 ≈ 1.053

   GB145 produces a 5.3% spin-up when balls migrate inward. Less than Jade's 15% because:
   ├── Heavier balls → larger ΔI contribution (good)
   └── But smaller r_outer (track width limits radius) → less ΔI per unit mass
   Net: smaller radial range → smaller spin-up despite heavier balls.
```

### Height-Denial Contact Surface

```
   The steel balls sit in channels at h_track = 14.5mm.
   When extended outward (r_outer ≈ 14mm), the ball surface is at:
   h_ball_center = 14.5mm, r_ball = 14mm

   A short opponent bey (AR at h_AR ≈ 12–15mm) contacts the GB145 ball directly.
   The ball is spherical (Case 27 WB geometry) → contact normal ≈ radial → deflection.
   The ball is STEEL → same Hertzian analysis as Case 52 MS but softer substrate:
   E_steel ≈ 200 GPa, R_ball ≈ 5mm (vs R_spike ≈ 0.3mm MS)
   P_max_ball << P_max_MS → no denting (large R reduces peak stress dramatically)
   μ_kinetic_steel_ball ≈ 0.15 (rolling partially → Case 48 roller mechanics)

   Height denial: attackers at h_AR < 14mm cannot reach the Fusion Wheel above.
   Attackers at h_AR > 17mm (above ball + case) contact the Fusion Wheel directly.
   Only attackers in the window 12–17mm are denied — they hit the ball, not the wheel.

   The free-spinning AS (Case 15) comparison applies to GB145:
   ├── Balls can spin in their channels (low friction, rotating under contact)
   ├── Free-spin-like behavior → low spin steal from ball contact
   └── But: balls are not on a bearing, they slide against channel → some friction
       "Very good Defense and Stamina" = ball contact absorbs hits without spin loss.
```

---

## Case 59 — D125 (Defense 125): Aerodynamic Ring as I-Modifier, Negligible Drag Claim

> **Stock combo (Wolf D125B):** Wheel: Wolf · Track: D125 · Bottom: Ball
> **Stock combo (Pisces D125BS):** Wheel: Pisces · Track: D125 · Bottom: Ball Sharp
> **Stock combo (Rock Orso D125B):** Clear Wheel: Orso · Metal Wheel: Rock · Track: D125 · Bottom: Ball
> **Stock combo (Counter Leone D125B):** Clear Wheel: Leone · Metal Wheel: Counter · Track: D125 · Bottom: Ball
> **Stock combo (Ray Unicorno D125CS):** Clear Wheel: Unicorno · Metal Wheel: Ray · Track: D125 · Bottom: Coat Sharp

D125 has a wide circular disc with an upward-angled outer lip ("Defense" ring) that was marketed as providing aerodynamic downforce. The same calculation as Case 37 (W105) applies: the aerodynamic force is negligible at Beyblade scale. D125's actual advantage is the mass of the disc ring increasing I at mid-height.

### Aerodynamic Claim — Same Calculation, Same Conclusion as Case 37

```
   D125 outer lip (angled fin, similar to W105 but as a ring around the full circumference):

   F_lift = ½ × ρ_air × v_tip² × A_disc_lip × C_L
   A_disc_lip = 2π × r_lip × h_lip = 2π × 0.018 × 0.006 ≈ 6.8×10⁻⁴ m²
   v_tip = ω × r_lip = 300 × 0.018 = 5.4 m/s
   F_lift = 0.5 × 1.2 × 29.2 × 6.8×10⁻⁴ × 0.5 ≈ 0.006 N

   F_weight = 0.045 × 9.8 = 0.441 N
   F_lift / F_weight ≈ 1.4% → negligible (same conclusion as W105 at 0.37%)

   D125 disc lip is larger than W105 fins → 1.4% vs 0.37%, but still negligible.
   The "Defense" in the name is marketing, not physics.
```

```
   What D125 actually does — I contribution:

   D125 ring mass estimate: ~2.5g at r_ring ≈ 18mm
   ΔI_D125 = 0.0025 × 0.018² = 8.1×10⁻⁷ kg·m²

   Standard 125 hub mass at r ≈ 5mm: ~0.8g
   ΔI_125   = 0.0008 × 0.005² = 2.0×10⁻⁸ kg·m²

   ΔI advantage of D125 over 125: ≈ 7.9×10⁻⁷ kg·m² = +5.3% of typical bey I

   5.3% more I → 5.3% more gyroscopic stability.
   This IS a real defense advantage — the I improvement is the true mechanism.
   Same conclusion as W105 (Case 37): fin/ring = I contribution, not aerodynamics.
```

---

## Case 60 — Coating Spike (CS): Binary Tilt-Threshold Tip Regime Switch

> **Stock combo (Ray Unicorno D125CS):** Clear Wheel: Unicorno · Metal Wheel: Ray · Track: D125 · Bottom: Coat Sharp

Coating Spike (CS) has a rubber flat outer ring surrounding a sharp center spike. The spike protrudes below the rubber ring base by Δh_spike, creating a **binary regime switch** at a specific tilt angle θ_switch. Unlike SF (Case 15) which has a gradual frustum-to-flat transition, CS switches from pure spike contact to pure rubber-ring contact in a step function when the tilt angle crosses the threshold.

### Threshold Geometry — Step Function vs SF's Gradual Transition

```
   CS cross-section (side view):

        ║  bey body
   ╔════╩═══════════════════════════╗
   ║         RUBBER FLAT RING       ║  ← outer rubber ring, flat bottom face
   ║  ╔══════════════════════════╗  ║    contacts floor at θ > θ_switch
   ║  ║     (air gap below)     ║  ║    Δh_spike above ring base
   ║  ╚══════════════════════════╝  ║
   ╚══════════════╦═════════════════╝
                  ║  center spike
                  [·]  ← protrudes Δh_spike below ring base
   ════════════════════════════════  floor

   At upright (θ = 0):
   Spike contacts floor. Ring is Δh_spike above floor. Ring does NOT contact.
   → SPIKE REGIME: r_contact ≈ 0.4mm, μ = metal (0.20 kinetic), high static

   At θ > θ_switch:
   The ring's downhill edge drops by r_ring_inner × sin(θ) below the ring base.
   When r_ring_inner × sin(θ) = Δh_spike:
   θ_switch = arcsin(Δh_spike / r_ring_inner)

   For Δh_spike ≈ 1.5mm and r_ring_inner ≈ 4mm:
   θ_switch = arcsin(1.5 / 4) ≈ 22°

   Above θ = 22°: rubber ring contacts floor.
   → RUBBER REGIME: r_contact ≈ r_ring ≈ 10mm, μ = rubber (0.85 kinetic)
   → Large friction torque → aggressive movement (like RF but triggered by tilt)
```

```
   Step function vs SF (Case 15) gradual:

   SF:  gradual frustum → contact radius GROWS continuously with θ
        r_contact(θ) = lerp(r_flat_inner, r_cone_outer, (θ - θ_trans) / (π/2 - θ_trans))
        for θ > θ_transition  → smooth ramp

   CS:  binary switch → contact jumps from r_spike ≈ 0 to r_ring ≈ 10mm at θ_switch
        No intermediate — it's spike-only or rubber-only, never a mix
        (because the rubber ring is flat and wide → entire ring contacts simultaneously once tilt reaches threshold)

   Practical consequence:
   CS at θ just below θ_switch: slow, stationary (like S tip)
   CS at θ just above θ_switch: suddenly moves aggressively (like RF tip)
   The transition can be triggered by a single hit → opponent hit → θ jumps across θ_switch
   → CS immediately transitions from stationary to aggressive movement
   → "When banked, becomes erratic" — the bank is a θ increase past θ_switch
```

```
   CS wear model — spike wears → θ_switch decreases:

   Spike wears → Δh_spike decreases → θ_switch = arcsin(Δh_spike / r_ring_inner) decreases
   A worn CS transitions earlier → rubber activates at lower tilt angles → more movement earlier
   "Spike is prone to wearing quickly" → CS progressively becomes RF-like with use

   wornThreshold(wear, Δh0, r_inner):
     Δh_worn = Δh0 × (1 - wear × 0.8)  // spike wears down
     return arcsin(Δh_worn / r_inner)   // θ_switch decreases with wear

   At wear = 0.0: θ_switch ≈ 22° (new, spike prominent)
   At wear = 0.5: θ_switch ≈ 11° (half-worn spike, transitions at smaller tilt)
   At wear = 1.0: θ_switch ≈ 0° (spike fully worn flat → pure RF behavior from start)
```

---

## Case 61 — Flash Fusion Wheel: Oval I Anisotropy and 2-Node vs 4-Node Weight Distribution

> **Stock combo (Flash Sagittario 230WD):** 4D Clear Wheel: Sagittario II · 4D Metal Wheel: Flash · Track: 230 · Bottom: Wide Defense

Flash has two oval protruding heads. The oval shape, unlike circular protrusions, creates **anisotropic moment of inertia** — I is higher along the oval's major axis and lower perpendicular. Mode change rotates the Metal Frame 90°, switching from a 2-node weight distribution (both ovals on the same diameter = bilateral symmetry) to a 4-node distribution (ovals offset 90°, equivalent to quadrilateral symmetry).

### Oval I Anisotropy — Major vs Minor Axis

```
   Flash Metal Frame top view:

   ATTACK MODE (ovals aligned):       STAMINA MODE (ovals at 90°):

       [OVAL]   [OVAL]                   [OVAL]
        ←────────────→                      ╱
        (bilateral symmetry,               ● ← spin axis
         2 nodes on x-axis)             ╱  │  ╲
                                      [OVAL] [OVAL]
                                      (quadrilateral-ish, 4-node distribution)

   Wait — Flash has 2 ovals. In Stamina Mode:
   The ovals are still 2 (the Metal Frame has 2 oval heads).
   "Stamina Mode" = Frame rotated 90° → oval heads move from aligned to perpendicular.

   In Attack Mode: both ovals at 0° and 180° (aligned on x-axis)
   In Stamina Mode: both ovals at 90° and 270° (on y-axis)
   → Still bilateral symmetry, but on DIFFERENT axis!
   → I_attack_mode: oval mass contributes to I_xx
   → I_stamina_mode: oval mass contributes to I_yy
   → I_xx ≈ I_yy since ovals are similar → modes have similar I!

   But the KEY difference is the CONTACT PROFILE per mode:
```

```
   Contact profile per mode:

   ATTACK MODE (ovals face outward radially):
   Opponent sees the FLAT face of the oval → wide contact area → lower μ per unit area
   Contact normal ≈ tangential (oval face parallel to tangent line)
   → Glancing deflection (Case 32 Meteo jaw geometry)
   → Low recoil, low tilt torque on attacker AND defender

   STAMINA MODE (ovals face tangentially — edge of oval outward):
   Opponent sees the NARROW edge of the oval → small contact area → higher stress
   Contact normal ≈ radial (oval edge perpendicular to tangent line)
   → More direct hit, higher effective μ per contact event
   → More tilt torque on both → more movement from ground friction

   This is the ACTUAL mode difference: face vs edge presentation to opponents.
   I is nearly identical; contact geometry is what changes.
```

```typescript
   interface FlashModeState {
     mode: 'attack' | 'stamina';
     // attack = oval face outward (glancing) = low recoil
     // stamina = oval edge outward (radial) = more movement
   }

   function resolveFlashContactAngle(mode: FlashModeState['mode']): number {
     return mode === 'attack' ? 8  // degrees from tangent — near-glancing
                              : 35; // degrees from tangent — more radial
   }

   // mode === 'attack': lower recoil (good for defense combos — less self-destabilization)
   // mode === 'stamina': more movement (normal force has larger radial component → more orbit)
```

---

## Case 62 — 230 Track: Extreme h/r Ratio, Structural Ribs, Height Denial, and Tall-Attack Weakness

> **Stock combo (Flame Byxis 230WD):** Clear Wheel: Byxis · Metal Wheel: Flame · Track: 230 · Bottom: Wide Defense
> **Stock combo (Duo Uranus 230WD):** 4D Clear Wheel: Uranus · 4D Metal Wheel: Duo · Track: 230 · Bottom: Wide Defense
> **Stock combo (Flash Sagittario 230WD):** 4D Clear Wheel: Sagittario II · 4D Metal Wheel: Flash · Track: 230 · Bottom: Wide Defense

230 is the tallest Spin Track in MFB at 23mm, with six structural ribs that prevent flex under impact. Its round smooth profile generates only glancing contact normals. At h/r ≈ 0.836, it approaches the instability threshold for HMS-scale beys (Case 45). Its primary function is height denial — most attackers cannot reach the Fusion Wheel above — but tall opposite-spin Attack types exploit the lower-hit geometry (Case 10) to produce an unavoidable counter-strike setup.

### h/r Ratio — Near-Instability at MFB Scale

```
   230 dimensions:
   h_track = 23mm  (tallest in MFB lineup)
   r_track ≈ 12mm  (outer track radius)
   r_wheel ≈ 27.5mm (Fusion Wheel above)

   h_com estimate (with Heavy metal wheel + 230 + WD tip):
   h_com ≈ 23 × 0.5 (track centroid) + 5 (WD tip below) ≈ 16–18mm above floor

   h/r ratio using WHEEL radius (the gyroscopic radius):
   h_com / r_wheel ≈ 17 / 27.5 ≈ 0.618  (MFB scale: stable)

   Compare to HMS (Case 45): h_com / r_outer ≈ 1.26 (unstable from the start)
   230 MFB: h_com / r_outer ≈ 0.618 (below 1.0 → gyroscopic resistance exceeds gravity torque)

   BUT: gravity tilt torque scales with h_com:
   τ_gravity = m × g × h_com × sin(θ)

   For 230 vs 85 track:
   h_com_230 ≈ 17mm, h_com_85 ≈ 10mm
   τ_gravity_230 / τ_gravity_85 = 17/10 = 1.70×  (70% more gravity torque at same θ)

   → 230 combo wobbles 70% faster than an equivalent 85-track combo at same spin.
   → 230 is NOT a stamina choice despite the anti-attack height denial.
```

### Structural Ribs — Six Indents as Reinforcements

```
   230 side profile:

        ║
        ║
   ║║║║║║║║║║║║║║║║║║║║║║  ← six vertical ribs (the "indents" seen in images)
        ║                    These are RAISED RIBS running vertically from track base to top
        ║                    Ribs add structural stiffness (moment of area in lateral bending)
       tip
   ════════════════════════

   Without ribs (plain cylinder):
   Lateral impact F → track bends at base → stored elastic energy → tip wobbles laterally
   → Effective r_cp = r_track + bend_deflection  (amplified by track flex)

   With six ribs (230):
   Lateral impact F → ribs resist bending (second moment of area × 6)
   → Track flex ≈ 0 → r_cp = r_track (no amplification from bend)
   → More direct impulse transmission to bey body (less energy lost in flex)

   The ribs are NOT contact points — they are structural elements.
   Their physical function is to prevent the track from acting as a flexible spring,
   which would otherwise dissipate and delay the impulse (like Kreis's sliding buffer).
   Ribs = anti-buffer: full impulse goes straight to Core every hit.
```

### Round Smooth Profile — Height Denial and Glancing Normals

```
   230 contact normal at any point on the round smooth track surface:

   The track cylinder is round → contact normal is ALWAYS radial.
   Attacker AR hits track body at height h_hit < h_track = 23mm:
   Contact normal points from 230 spin axis toward attacker (radial).
   → J goes from attacker directly OUTWARD → attacker bounced back.
   → 230 bey receives negligible inward component → minimal tilt.

   "Significantly less recoil" → smooth cylinder = near-tangential normals
   (same mechanism as Twisted, Case 28, and Guardian flat armor, Case 40)

   Height denial:
   For attacker whose Fusion Wheel AR is at h_AR_attacker < 23mm:
   Attacker AR hits the 230 TRACK, not the Fusion Wheel above.
   The Fusion Wheel sits at h ≈ 25–28mm → ABOVE the 230 track top.
   Attacker cannot reach the Fusion Wheel → restricted to track-body contact.
   Track contact = round, smooth, no torque arm → zero meaningful attack.

   Condition for height denial:
   h_AR_attacker < h_230_top = 23mm
   Most standard 145 combos: h_AR ≈ 15–18mm < 23mm → denied
   Tall combos (H145 with horns): h_AR ≈ 17–19mm < 23mm → still denied
   Only TH170 or taller: h_AR ≈ 20–22mm → still below 23mm → still denied

   "Outclassed by TH170" → TH170 (Tornado Height 170 = 17mm, different numbering)
   Wait: "230 outclassed by TH170" — TH170 is another tall track at similar height.
   TH170 may have a non-smooth profile that provides better defense vs tall attackers.
   The specific comparison is outside scope; the height-denial principle is established.
```

### Tall Opposite-Spin Attack Weakness

```
   A tall opposite-spin Attack type bey (e.g., Quetz+L-Drago II+230 vs 230 defender):

   Attacker's wheel at h_AR = 20mm; 230 track top at h = 23mm.
   Attacker AR is BELOW 230 track top → hits the smooth round track body.
   But the attacker uses left-spin vs the 230's right-spin:

   At the track contact point (h_hit ≈ 18mm, below 230 bey's h_com ≈ 17mm):
   Wait — h_hit is ABOVE 230 bey's h_com ≈ 17mm? Let's recalculate:
   h_com_230_bey ≈ 17mm above floor. h_hit ≈ 18mm (where attacker AR contacts track).
   18mm > 17mm → contact is ABOVE 230 bey's CoM.

   From Case 10 (upper hit): hit above CoM → 230's top swings AWAY → 230 tilts outward.
   This is actually GOOD for the 230 bey (it gets pushed outward but not into a counter).

   For LOWER hit (attacker AR at h_hit < h_com ≈ 17mm):
   Only possible if attacker uses a short track AND long reach:
   h_hit = 12mm < 17mm → lower hit → 230 bey's top swings TOWARD attacker next tick.
   → Counter-strike from 230's Fusion Wheel (which is at h = 25mm+).
   → Attacker is hit from ABOVE by the 230's high-positioned wheel.
   → Tall combo's AR is at such a low position relative to the 230 bey's wheel that
     the counter-strike from above is a DOWN-ATTACK (force component downward on attacker)
   → From Case 14: down-attack presses attacker into floor → spin decay spike on attacker.

   This "susceptible to tall opposite spin Attack Type" = the lower-hit geometry at the
   track body creates a counter-strike FROM the 230's elevated Fusion Wheel above.
```

```typescript
   interface Track230State {
     height: 23;              // mm — tallest MFB track
     ribCount: 6;
     profile: 'round_smooth'; // no protrusions, no wings, no active geometry
     h_com_contribution: number; // h_track × 0.5 added to bey's h_com
   }

   // Height denial check:
   function is230HeightDenied(track: Track230State, attackerARHeight: number): boolean {
     return attackerARHeight < track.height;  // attacker can only reach track body
   }

   // Round smooth → glancing normals → low self-recoil torque on 230 bey:
   const TRACK230_CONTACT_ANGLE = 5; // degrees from tangent — near-zero normal recoil
```

---

## Case 63 — Wide Defense (WD): Wide Disc Compound Tip, Balance Recovery Paradox, and Fast Movement When Unbalanced

Wide Defense has a wide flat disc surrounding a central sharp-tip protrusion — identical compound geometry to SWD (Case 22). The "wider" disc means larger r_contact → larger friction torque when the disc contacts the floor. This paradoxically makes balance recovery HARDER (overshoot oscillation) while enabling the "fast movement" property that makes high-recoil wheel combos viable.

### Compound Geometry — Same as SWD, Larger Radius

```
   WD cross-section (side view):

        ║  bey body
        ║
   ╔════╩══════════════════════════════════╗
   ║  [curved holes]                       ║  ← D-style curved holes (retained from D tip)
   ║           [center hole for sharp tip] ║    but smaller than in D
   ╚═══════════╦══════════════════════════╝
               ║  sharp tip inner section
               [·]  ← sharp tip protrudes Δh below WD disc face
   ════════════════════════════════════════  floor

   WD outer radius: r_WD ≈ 13mm  (wider than SWD ≈ 11mm, DS ≈ 9mm)
   D outer radius:  r_D  ≈ 10mm  (D was the predecessor)
   Sharp tip inner: r_S  ≈ 0.5mm (same as SWD inner)

   Contact regime switch:
   θ < θ_WD = arctan(Δh / r_WD_inner): spike only → Stamina behavior
   θ > θ_WD:                            WD disc → Defense/Movement behavior

   θ_WD for WD (r_WD_inner ≈ 3mm, Δh ≈ 0.5mm):
   θ_WD = arctan(0.5/3) ≈ 9°  ← transitions very early (even at small tilt)
```

### Balance Recovery Paradox — Wide Disc = Overshoot Oscillation

```
   When a bey is tilted and the wide disc contacts the floor:

   Correction torque: τ_correct = μ × N × r_WD × sin(θ)  (drives tilt back toward 0)
   This torque is LARGE for WD (r_WD = 13mm is very wide).

   The correction torque drives precession at rate:
   Ω_correct = τ_correct / (I × ω) = (μ × N × r_WD × sin(θ)) / (I × ω)

   If Ω_correct is large → the correction overshoots → tilt reverses sign:
   Tilt goes from +θ → 0 → -θ → 0 → +θ → (oscillation)

   Damping: if τ_correct >> τ_damping → oscillation grows (underdamped system)
   D (narrower disc): τ_correct is smaller → correction is gentler → approaches zero smoothly
   WD (wider disc): τ_correct is larger → correction overshoots → oscillates longer

   "WD is worse at regaining balance than D" = the overdamped vs underdamped distinction:
   D:  r_D = 10mm → correction force just right → critically/overdamped → smooth return
   WD: r_WD = 13mm → correction force too large → underdamped → oscillates before settling

   After a hit: WD oscillates around the upright position for 5–10 ticks (8–16ms)
   before settling. During this oscillation, the bey is momentarily at higher tilt (overshoot)
   → vulnerable to follow-up hit at the overshoot peak.
```

### Fast Movement When Unbalanced — The High-Recoil Wheel Synergy

```
   WD friction torque when disc is active (θ > θ_WD ≈ 9°):
   τ_WD = μ_plastic × N × r_WD = 0.50 × m×g × 0.013 = 5.88×10⁻³ N·m

   For comparison, D tip at equivalent tilt:
   τ_D  = μ × N × r_D = 0.50 × m×g × 0.010 = 4.50×10⁻³ N·m

   τ_WD / τ_D = 13/10 = 1.30 → WD generates 30% more precession torque

   Since WD is tilted (>9°) most of the time due to the low θ_WD threshold:
   WD MOVES 30% faster than D in normal operation.
   The "fast movement" is the large-r friction torque driving quick precession orbits.

   High-recoil Fusion Wheel (e.g., Lightning L-Drago) + WD:
   Each hit from opponent → large self-recoil → WD tilts past θ_WD immediately
   → Disc contacts floor → τ_WD large → bey accelerates into its next orbit
   → The recoil-driven movement is AMPLIFIED by the wide disc (not opposed by it)
   → WD pair with high-recoil = bey bounces and moves FASTER after each hit
   This is the "fast movement with high-recoil Fusion Wheels" documented behavior.
```

---

## Case 64 — Triple Roller 145 (TR145): Life After Death via Rolling Resistance

> **Stock combo (Divine Chimera TR145FB):** Clear Wheel: Chimera · Metal Wheel: Divine · Track: TR145 · Bottom: Flat Ball
> **Stock combo (Divine/Hell Crown TR145D / 130FB):** 4D Clear Wheel: Crown · 4D Metal Wheel: Divine/Hell · Track: TR145 / 130 · Bottom: Defense / Flat Ball

TR145 has three roller balls embedded in its wing tips. When a bey has spun out (θ = 90°, lying on its side), the rollers contact the floor and provide rolling resistance instead of sliding friction — allowing the bey to **translate along the floor** before exiting the arena. This is the Life After Death (LAD) mechanic.

### LAD Physics — Rolling vs Sliding When Toppled

```
   Standard wing tip at θ = 90° (bey lying flat):

   Wing tip contacts floor at high normal force (full bey weight now lateral + momentum)
   Friction = μ_kinetic × N = SLIDING friction
   τ_friction opposes spin → spin stops quickly → bey stops → falls/exits

   TR145 roller at θ = 90° (bey lying flat):

   Roller ball contacts floor → can ROLL along the floor
   Rolling resistance: F_roll = C_rr × N
   C_rr_roller ≈ 0.003–0.005  (metal ball on plastic stadium)

   For a toppled bey traveling at v_topple:
   Deceleration from rolling: a_roll = C_rr × g ≈ 0.004 × 9.8 ≈ 0.039 m/s²
   Deceleration from sliding:  a_slide = μ_k × g ≈ 0.50 × 9.8 ≈ 4.9 m/s²

   Toppled bey travels before stopping:
   Sliding: d_slide = v²/(2×a_slide) = v²/9.8   (stops quickly)
   Rolling: d_roll  = v²/(2×a_roll)  = v²/0.079  (travels 124× farther)

   A toppled bey moving at v = 0.3 m/s:
   d_slide = 0.09/9.8 = 9.2mm  (stops 9mm from where it toppled)
   d_roll  = 0.09/0.079 = 1.14m (rolls 1.14m — can traverse the entire stadium!)

   This is the LAD effect: rollers extend the translational path by ~124×.
   The bey may STILL lose (it's toppled) but it takes longer to exit → opponent may topple first.
```

```
   Why SA165 outperforms TR145 for LAD:

   TR145: 3 rollers at wing tips (r_wing ≈ 14.5mm from spin axis)
          LAD distance depends on momentum remaining when tips contact floor
          Rollers only activate at high tilt (>65°) — relatively late in the wobble

   SA165 (Spike Armor 165): has a wide armor ring that contacts the floor at HIGH radius
          r_armor ≈ 18mm → WIDER contact base when toppled
          Wider base → bey is more stable when rolling → faster translation, less wobble
          Also: SA165 armor ring provides lateral stability (prevents tip skipping on floor)

   LAD quality metric:
   LAD_quality = d_roll × p_contact_maintained
   SA165: larger r_armor → less tip-skipping → p_contact ≈ 0.90
   TR145: smaller rollers → occasional skip on stadium surface → p_contact ≈ 0.65
   LAD_quality_SA165 / LAD_quality_TR145 ≈ 1.38×  → SA165 wins on LAD.
```

```typescript
   interface TR145RollerState {
     rollerCount: 3;
     rollerRadius: number;    // mm: radius of each ball (≈ 3mm)
     C_rr: number;            // rolling resistance (≈ 0.004)
     wingTipHeight: number;   // mm above floor when extended (≈ 14.5mm)
   }

   function tickTR145_LAD(bey: BeyState, tr: TR145RollerState, dt: number) {
     if (bey.tiltAngle < 80) return;  // LAD only relevant when nearly toppled
     // When tilt ≈ 90°, rollers contact floor
     const N_roller = bey.mass * G * (bey.tiltAngle / 90);  // weight transferred to rollers
     const F_roll = tr.C_rr * N_roller;
     // Rolling resistance decelerates translational motion (much less than sliding)
     const decel = F_roll / bey.mass;
     const v_mag = Math.hypot(bey.vx, bey.vy);
     if (v_mag > 0.001) {
       bey.vx -= (bey.vx / v_mag) * decel * dt;
       bey.vy -= (bey.vy / v_mag) * decel * dt;
     }
   }
```

---

## Case 65 — Wave Wide Defense (W²D): CS-Analog Flat+Spike Compound Tip, Spike Wear Transition, and LAD Improvement

> **Stock combo (Fang Leone 130W²D):** 4D Clear Wheel: Leone II · 4D Metal Wheel: Fang · Track: 130 · Bottom: Wave Wide Defense

W²D is a flat plastic disc with a center spike — the same binary regime switch as CS (Case 60) but with a plastic disc instead of a rubber ring. θ_switch = arctan(h_spike / r_disc_inner). As the spike wears, θ_switch decreases, making the disc activate at smaller tilts → the tip progressively becomes more aggressive. The flat disc also improves LAD by providing continuous floor contact when toppled.

### W²D vs WD — Spike Protrusion Replaces Sharp Inner Tip

```
   WD (Case 63):  inner sharp tip protrudes Δh below WD disc face
                  Δh ≈ 0.5mm (very small) → θ_WD ≈ 9° (transitions early)
                  Tip is SHARP (pointed) → near-zero r_contact when upright

   W²D:           center spike protrudes Δh_spike below flat disc face
                  Δh_spike ≈ 1.5mm (larger spike) → θ_switch ≈ 22° (same as CS)
                  "Wave" profile: flat outer disc (not curved holes like WD)

   The disc is FLAT (not a wide disc with holes like WD) → full flat contact when active.
   At θ > θ_switch ≈ 22°: disc contacts floor at r_disc ≈ 10–12mm.
   μ_disc = plastic kinetic = 0.50 → moderate friction (less than CS rubber = 0.85)
   → W²D is less aggressive than CS but more aggressive than WD when disc activates.
```

```
   Spike wear model for W²D (same as CS Case 60):

   Δh_spike_worn = Δh_spike × (1 - wear × 0.8)
   θ_switch(wear) = arctan(Δh_spike_worn / r_disc_inner)

   At wear = 0.0: θ_switch ≈ 22° (disc only in wobble phase)
   At wear = 0.3: θ_switch ≈ 13° (disc activates at moderate tilt)
   At wear = 0.6: θ_switch ≈ 5°  (disc almost always active)
   At wear = 1.0: θ_switch ≈ 0°  (pure flat disc = like WF but smaller)

   "The spike is prone to wearing quickly, making it more aggressive":
   As θ_switch drops, the flat disc becomes the primary contact sooner in the match.
   More disc contact → more precession torque → more movement → more aggressive behavior.
   A freshly worn W²D (wear ≈ 0.3) is the optimal operating point: spike for high spin,
   disc activates at moderate tilt → good balance of stamina (spike) + control (disc).
```

### W²D LAD Improvement Over WD

```
   WD when toppled (θ = 90°):
   The disc is tilted → only the rim edge contacts floor → small contact area → tips/skips

   W²D flat disc when toppled (θ = 90°):
   Flat disc face is now VERTICAL (parallel to the stadium surface since bey is sideways)
   Wait — when bey is at θ = 90°, the disc face is HORIZONTAL (normal to gravity)
   → Full disc face can contact the floor → large contact area → stable rolling surface

   This flat disc provides the same LAD improvement mechanism as SA165 (Case 64):
   Wide flat contact → bey rolls more stably when toppled → travels farther before exiting.

   W²D flat disc radius: r_disc ≈ 11mm  → contact area π × r² ≈ 380mm² when toppled
   WD disc with holes: contact area ≈ 250mm² (curved holes remove material)
   W²D flat disc area: 52% more contact area when toppled → more stable LAD rolling.

   "W²D has slightly more raw Stamina, and an improvement in LAD over WD":
   Stamina: spike at upright gives near-zero friction (same as WD inner spike)
   LAD: flat disc gives more stable rolling contact than WD's holed disc.
```

---

## Case 66 — Rubber Defense Flat (RDF): Three-Regime Tip with Center Protuberance, Rubber Body, and Plastic Encasing Rim

> **Stock combo (Death Quetzalcoatl 125RDF):** 4D Clear Wheel: Quetzalcoatl · 4D Metal Wheel: Death · Track: 125 · Bottom: Rubber Defense Flat

RDF has three distinct tilt-dependent contact regimes: (1) center protuberance like a spike → near-stationary at upright; (2) rubber flat main body → CS-style balanced behavior; (3) outer plastic encasing rim → banking/aggressive behavior at high tilt. The rubber sits flush inside the plastic at a defined height, so the regime boundaries are defined by tilt geometry exactly like CS (Case 60) but with three layers instead of two.

### Three-Regime Architecture

```
   RDF cross-section (side view, tip pointing DOWN):

        ║  bey body
   ╔════╩════════════════════════════════╗
   ║  PLASTIC ENCASING (outer rim)       ║  ← outermost, highest
   ║  ╔══════════════════════════════╗   ║    contacts floor at θ > θ_rim
   ║  ║ RUBBER FLAT (main body)      ║   ║    flush or slightly below plastic
   ║  ║  ╔════════════════════╗      ║   ║
   ║  ║  ║ CENTER PROTUBERANCE║      ║   ║    protrudes Δh_prot below rubber face
   ║  ║  ╚═══════╦════════════╝      ║   ║
   ║  ╚══════════╬══════════════════╝    ║
   ╚═════════════╬════════════════════   ╝
                 ║  center protuberance tip
                [·]  ← protrudes Δh_prot below rubber base
   ═══════════════════════════════════════  floor

   Three layers (from center outward):
   Layer 1: center protuberance (r ≈ 0.5–1mm) — spike-like, metal or hard plastic
   Layer 2: rubber flat body (r ≈ 4–10mm)  — high μ, viscoelastic
   Layer 3: plastic encasing rim (r ≈ 11–13mm) — low μ, aggressive
```

```
   Regime transitions:

   REGIME 1 — CENTER PROTUBERANCE (θ < θ_rubber):
   Same as CS Case 60 inner spike regime.
   r_contact ≈ 0.5mm, friction ≈ near-zero → stationary like S tip.
   θ_rubber = arcsin(Δh_prot / r_rubber_inner)
   If Δh_prot ≈ 1.5mm, r_rubber_inner ≈ 4mm: θ_rubber ≈ 22°

   REGIME 2 — RUBBER FLAT (θ_rubber < θ < θ_rim):
   Rubber body contacts floor at r_rubber ≈ 7–8mm average.
   μ_rubber ≈ 0.85, viscoelastic → CS-style balanced behavior.
   Moderate precession torque → some movement, not aggressive.
   θ_rim = arcsin(Δh_rim / r_plastic_inner)
   If plastic rim sits Δh_rim ≈ 0.5mm above rubber base, r_plastic_inner ≈ 11mm:
   θ_rim = arcsin(0.5/11) ≈ 2.6°
   Wait — if θ_rim < θ_rubber, the rim activates BEFORE the rubber!
   Reorder: if plastic rim is ABOVE rubber base (protrudes upward), contacts floor LATER.

   Correct orientation: plastic encasing is at the OUTSIDE and SAME HEIGHT or slightly
   ABOVE the rubber → plastic rim contacts floor AFTER rubber rim (at higher θ).
   θ_rim = arctan(Δh_above_rubber / (r_plastic - r_rubber_outer))
   If Δh ≈ 0.5mm height difference, radial gap ≈ 2mm: θ_rim ≈ arctan(0.5/2) ≈ 14°

   So regime order (revised):
   θ < 22°: center protuberance → stationary (Regime 1)
   22° < θ < 36° (rubber + possibly rim): rubber flat → CS-balanced (Regime 2)
   θ > 36°: plastic rim contacts → erratic aggressive (Regime 3)

   The exact thresholds depend on precise geometry; the three-regime principle holds.
```

### Wear and Weak Launch Behavior

```
   Wear model: rubber degrades same as RF/RB (Case 19/38)
   As rubber wears → Δh_prot decreases → Regime 1 activates at lower θ
   → More rubber contact earlier in the match → more CS-like behavior

   "When weak launched, similar to worn RS movement patterns":
   Weak launch = low spin → low gyroscopic stiffness → bey tilts easily
   At low spin, θ quickly exceeds θ_rubber (22°) → rubber flat always active
   → Behavior = worn RS (Rubber Sharp) = moderate movement + erratic wobble
   RS = sharp spike + rubber coating → at low spin similar to RDF rubber-dominant mode.

   "When shot standard, stationary like S tip":
   High spin → gyroscopic stiffness keeps θ < 22° for long → center protuberance only
   → Near-zero friction → stationary (like S tip behavior from Case 36).

   "When banked, outer plastic causes instability":
   Banking = θ pushed to >36° by wall contact → Regime 3 activates
   Plastic rim at r ≈ 13mm → large friction torque → aggressive erratic movement
   Same as CS "banked erratic behavior" but with rubber intermediate layer.
```

```typescript
   interface RDFState {
     regimes: [
       { r: 0.75, muKinetic: 0.25, thetaMax: 22 },   // center protuberance (near-spike)
       { r: 7.5,  muKinetic: 0.85, thetaMax: 36 },   // rubber flat
       { r: 12.0, muKinetic: 0.45, thetaMax: 90 },   // plastic encasing rim
     ];
     wear: number;  // affects rubber layer (regime 2) and center protuberance height
   }

   function resolveRDFRegime(rdf: RDFState, tiltAngle: number): {r: number; mu: number} {
     // θ_rubber shifts with wear:
     const thetaRubber = 22 * (1 - rdf.wear * 0.5);  // wears down to ~11° fully worn
     if (tiltAngle < thetaRubber) return rdf.regimes[0];
     if (tiltAngle < 36)          return rdf.regimes[1];
     return rdf.regimes[2];
   }
```

---

## Case 67 — Duo Fusion Wheel: Deliberate Static Imbalance as Attack Mechanism (Inverse of Twisted)

> **Stock combo (Duo Uranus 230WD):** 4D Clear Wheel: Uranus · 4D Metal Wheel: Duo · Track: 230 · Bottom: Wide Defense

Duo has a Metal Frame that can be rotated 90° relative to the Core, switching between Stamina Mode (4-fold symmetric → isotropic I, zero imbalance) and Attack Mode (large static imbalance → F_imb = m×d×ω² → eccentric orbital attack coverage). Unlike Twisted (Case 28) where static imbalance is an unintended defect, Duo deliberately CREATES imbalance in Attack Mode as its attack strategy. Mode change requires disassembly (Category 4 from Case 56).

### Stamina Mode — 4-Fold Symmetry, Isotropic I

```
   Duo Metal Frame top view — Stamina Mode:

       [WING]     [WING]
      ╱       ╲ ╱       ╲
   [WING]   ●   [WING]     ← 4 wings at 90° intervals (0°, 90°, 180°, 270°)
      ╲       ╱ ╲       ╱
       [WING]     [WING]

   Wait — Duo has two large half-disc wings. In Stamina Mode:
   Both wing halves are symmetric → the wheel forms a near-complete disc.
   Mass distribution: approximately uniform around the circumference.
   I_stamina = m_frame × r_frame² × symmetry_factor ≈ m_frame × r_frame² × 0.90
   (90% of a full disc, accounting for small asymmetric features)

   Static imbalance d_offset_stamina ≈ 0mm  (symmetric → CoM on spin axis)
   F_imbalance = 0 → no eccentric orbit → pure gyroscopic precession only.
```

```
   Stamina Mode physics — best stamina:

   I_stamina ≈ 0.90 × m_frame × r_frame²  (near-full disc)
   If m_frame ≈ 30g, r_frame ≈ 22mm:
   I_stamina ≈ 0.90 × 0.030 × 0.022² = 1.31×10⁻⁵ kg·m²

   Large symmetric I → slow spin decay:
   dω/dt = τ_friction / I → LOWER with larger I
   → Excellent stamina: bey resists tilt and spins longer.
```

### Attack Mode — 90° Rotation Creates Large Imbalance

```
   Duo Metal Frame top view — Attack Mode (rotated 90° from Stamina):

   Stamina Mode:    [HALF_A] ──●── [HALF_A]   (both halves at 0°/180° → symmetric)
   Attack Mode:     [HALF_A]         at 90°/270°
                               ●
                    [HALF_A]         at 90°/270° → same side! → ASYMMETRIC

   Wait — let me reconsider the Duo geometry:
   Duo Metal Frame: two large C-shaped half-disc sections (like two parentheses).
   Stamina Mode: ( ) aligned → form a near-complete disc
   Attack Mode: both ( sections rotated → form a figure-8 or offset pattern

   From the description "rotating the Metal Frame 90° clockwise or counterclockwise":
   In Attack Mode: the heavier Mass portion of each C-shape ends up on the SAME SIDE.
   One side has 2× the metal mass; the opposite side has nearly none.

   Mass distribution in Attack Mode:
   Heavy side: ~2 × m_half_frame ≈ 0.030 × 0.60 = 0.018 kg at r_heavy ≈ 20mm
   Light side: ~0.030 × 0.40 = 0.012 kg at r_light ≈ 8mm (inner spokes only)

   CoM offset from spin axis:
   d_offset = (m_heavy × r_heavy - m_light × r_light) / m_total_frame
            = (0.018 × 20 - 0.012 × 8) / 0.030
            = (360 - 96) / 30 = 264/30 ≈ 8.8mm!

   This is a massive imbalance — nearly 9mm CoM offset from spin axis.
   Compare to Twisted Case 28: d_offset ≈ 1.5mm (unintended void → small imbalance)
   Duo Attack Mode: d_offset ≈ 8.8mm (intentional, much larger)
```

```
   Eccentric orbital attack from the large imbalance:

   F_imbalance = m_frame × d_offset × ω²
   At ω = 300 rad/s: F_imbalance = 0.030 × 0.0088 × 90000 = 23.8 N

   F_weight = 0.045 × 9.8 = 0.441 N

   F_imbalance / F_weight = 23.8 / 0.441 ≈ 54 !!

   The centrifugal imbalance force is 54× the bey's weight at launch spin.
   This is not a small perturbation — it is a DOMINANT force.

   At high spin: bey follows a large eccentric orbit driven by F_imbalance.
   The orbit radius: r_orbit ≈ F_imbalance / (m × ω²) × correction = d_offset = 8.8mm
   (the centrifugal force simply displaces the bey CoM to orbit at radius d_offset)

   The orbit sweeps the bey across a wide area of the stadium each revolution:
   At ω = 300 rad/s, orbit radius d_offset ≈ 8.8mm:
   Surface speed ≈ d_offset × ω = 0.0088 × 300 ≈ 2.64 m/s  (very fast lateral movement)

   Any opponent in the orbital path gets struck at this speed:
   v_strike ≈ 2.64 m/s vs typical approach velocities ≈ 0.3–0.5 m/s
   → Strike is ~5–8× faster than normal beyblade contact → large J → ring-out threat.
```

```
   Comparison: Duo Attack Mode vs Twisted Case 28:

   ┌─────────────────┬─────────────────────────────────────────────────────────┐
   │ Property        │ Twisted (Case 28)        │ Duo Attack Mode             │
   ├─────────────────┼──────────────────────────┼────────────────────────────┤
   │ d_offset        │ ~1.5mm (void-caused)     │ ~8.8mm (intentional 90° rot)│
   ├─────────────────┼──────────────────────────┼────────────────────────────┤
   │ F_imbalance at  │ 0.030 × 0.0015 × ω²     │ 0.030 × 0.0088 × ω²       │
   │ max spin        │ ≈ 1.35 N (small)         │ ≈ 23.8 N (dominant)        │
   ├─────────────────┼──────────────────────────┼────────────────────────────┤
   │ Orbital speed   │ ~0.45 m/s (minor drift)  │ ~2.64 m/s (fast sweep)     │
   ├─────────────────┼──────────────────────────┼────────────────────────────┤
   │ Intended?       │ NO (design defect)       │ YES (designed attack mode) │
   ├─────────────────┼──────────────────────────┼────────────────────────────┤
   │ Resonance       │ passes quickly (Case 28) │ drives attack, not resonance│
   └─────────────────┴──────────────────────────┴────────────────────────────┘
```

```typescript
   interface DuoModeState {
     mode: 'stamina' | 'attack';
     d_offset: number;       // mm: CoM offset from spin axis
                             // stamina: ~0mm, attack: ~8.8mm
     I: number;              // computed from current mode's mass distribution
     massOffset_phase: number; // current rotational phase of the heavy side (radians)
   }

   function computeDuoModeConfig(mode: DuoModeState['mode']): { d_offset: number; I: number } {
     if (mode === 'stamina') {
       return { d_offset: 0, I: 0.030 * 0.022 * 0.022 * 0.90 };  // symmetric near-disc
     }
     // Attack Mode: large intentional imbalance
     return { d_offset: 8.8e-3, I: 0.030 * 0.014 * 0.014 * 0.80 };  // asymmetric, lower effective I
   }

   function tickDuoImbalanceForce(bey: BeyState, duo: DuoModeState, dt: number) {
     if (duo.mode === 'stamina' || duo.d_offset < 0.001) return;
     const omega = bey.spin / bey.I;
     duo.massOffset_phase += omega * dt;
     const F_imb = bey.mass * duo.d_offset * omega * omega;
     bey.vx += (F_imb / bey.mass) * Math.cos(duo.massOffset_phase) * dt;
     bey.vy += (F_imb / bey.mass) * Math.sin(duo.massOffset_phase) * dt;
     // Note: unlike Case 28 Twisted (damped by 0.01), Duo's imbalance is intentional
     // and dominant — applied at full amplitude, not attenuated.
   }
```

---

| File | What to add/change |
| `server/shared/rooms/InputHandler.ts` | no change needed |
| `client/src/game/renderer/PixiRenderer.ts` | use `beyTiltAngle` to warp sprite (already has tilt containers) |
| `client/src/game/hooks/useGameInput.ts` | no change needed |

---

## Verification

1. Launch a `tryout_room` match and observe spin decay wobble onset at ~40% spin.
2. Set `launchTilt = 30°` — verify beyblade traces wobble circles from frame 1.
3. Set arena `tiltAngle = 45°` — verify lateral drift toward `tiltDirection`.
4. Two beyblades with rubber CPs — verify spin-steal on collision (attacker loses spin, defender gains fraction).
5. Decrease spin to near-zero — verify ring-out or burst triggers correctly.

**→ Part 2 (parts catalogue / seed plan):** [performance-tip-hole-flat-sorted-toast.md](C:\Users\mohsi\.claude\plans\performance-tip-hole-flat-sorted-toast.md)

---

## Case 74 — Spring Core RC (HMS): Tall CoM Height as Precession-Rate Advantage in Same-Spin Stamina

> **Stock combo (Einstein MS):** AR: Metal Spring · WD/CWD: Circle Heavy · RC: Spring Core

Spring Core is a tall (~20 mm body) HMS Running Core weighing ~2 g. It has a semi-flat ABS tip, a visible coil spring inside the body that compresses on launch contact, and is otherwise mechanically simple. Its competitive niche — best same-spin stamina RC in HMS — comes entirely from its height, not the spring. This case traces why body height directly governs late-battle precession rate and thus determines who wins a spin-out race.

### Spring Gimmick: Launch-Only, Irrelevant After

```
   Spring Core cross-section (side view):

   ┌──────────────┐  ← top cap (attaches to WD/AR)
   │              │
   │   ┌──────┐   │
   │   │spring│   │  ← coil spring, k ≈ 800 N/m
   │   └──────┘   │
   │              │
   └──────┬───────┘  ← body (~20 mm tall, ABS)
          │ semi-flat tip (ABS, ~5 mm dia)
   ───────┴─────────  stadium floor

   On launch: rip-cord jerk compresses spring by x ≈ 3 mm.
   Spring releases: E_spring = ½ × 800 × 0.003² = 0.0036 J → trivial.
   0.0036 J into I ≈ 8×10⁻⁶ kg·m²: Δω = sqrt(2×0.0036/8e-6) ≈ 30 rad/s extra spin.
   At launch spin ω_0 ≈ 800 rad/s: Δω/ω_0 ≈ 3.75% → negligible.
   Spring contributes nothing competitively after the first frame.
```

### Tall Body Height and Precession Rate

The key variable is the distance from the tip contact point to the bey's centre of mass (CoM). A taller RC raises the CoM:

```
   Gyroscopic precession from a tilt torque τ_tilt:
   Ω_precess = τ_tilt / (I × ω)

   τ_tilt = m × g × h_CoM × sin(θ)   where h_CoM = height of CoM above floor

   Substituting:
   Ω_precess = (m × g × h_CoM × sin(θ)) / (I × ω)

   Short RC (GFC, h_CoM ≈ 10 mm):
   Ω_short = (m × g × 0.010 × sin θ) / (I × ω)

   Spring Core (h_CoM ≈ 20 mm):
   Ω_tall  = (m × g × 0.020 × sin θ) / (I × ω)

   Ω_tall / Ω_short = 0.020 / 0.010 = 2.0×
   Spring Core precesses TWICE as fast as a short RC at the same spin.
```

### Why Faster Precession = Longer Survival at Low Spin

At very low spin (ω → 0), precession rate diverges: Ω_precess → ∞, meaning the bey tips and falls. The bey "survives" as long as precession remains a controlled gyration rather than a topple. The critical threshold is when the precession orbit's centrifugal tendency balances the tipping:

```
   Survival condition (bey still gyrating, not fallen):
   I × ω > τ_tilt / Ω_max_stable

   Rearranging for minimum spin to survive:
   ω_survive = τ_tilt / (I × Ω_max_stable)

   Spring Core raises τ_tilt (taller h_CoM) but also raises the gyroscopic response —
   the bey precesses through its tilt faster, completing recovery circles sooner.
   A taller bey stays in controlled gyration LONGER before finally falling because
   each precession cycle covers more angular distance per unit of remaining spin.

   Net effect: Spring Core survives ~1.5–2.0× longer in the dying phase vs a short RC
   at equal spin levels — this is the "added precession" the WBO description references.
```

### Height-Based Destabilisation of Shorter Opponents

A taller bey's AR sits higher relative to the floor. In same-spin contact, the taller bey's AR can graze the UNDERSIDE of the opponent's WD — an upper-attack geometry (Case 76 context):

```
   Opponent WD underside height (short RC combo): h_WD_bottom ≈ 8 mm above floor
   Spring Core AR bottom height:                  h_AR_bottom ≈ 12–14 mm above floor

   h_AR > h_WD_bottom → Spring Core AR slides UNDER opponent WD on contact.
   Upward normal force from this contact: F_up ≈ J_contact × sin(θ_ramp_AR)
   This force tilts the opponent slightly with each contact → opponent enters
   precession earlier and at higher spin → loses the spin-out race.

   Against Bearing Core (same height class or similar):
   Heights are close → no consistent under-sweep → height advantage diminishes.
   Bearing Core's superior spin retention (near-zero tip friction) compensates.
   Spring Core wins the precession phase but Bearing Core loses less spin → near tie.
```

### Why Opposite Spin Fails

In opposite spin, the contact geometry reverses — instead of grazing under the opponent's WD, the ARs clash face-to-face. Spin steal transfers spin FROM the opponent TO Spring Core, but Spring Core's ABS semi-flat tip has normal friction, so it loses spin to the floor faster than Bearing Core's near-frictionless bearing:

```
   Same spin: Spring Core gains precession advantage from height → wins spin-out.
   Opposite spin:
   Spin steal rate: Δω_steal ∝ Δω_contact × μ_contact × dt
   Spring Core receives spin: +Δω_steal
   But floor decay rate (semi-flat ABS): dω/dt|floor ≈ −50 rad/s²
   Bearing Core floor decay: dω/dt|floor ≈ −8 rad/s² (bearing tip)

   Bearing Core loses spin 6× slower to the floor.
   In opposite spin, both are receiving spin steal from each other,
   but Bearing Core retains it 6× more efficiently between contacts.
   → Bearing Core wins opposite spin despite Spring Core's height advantage.
```

```typescript
   interface SpringCoreState {
     bodyHeightMm: number;       // 20 — tall
     tipMaterial: 'abs';
     tipShape: 'semi_flat';
     springCompressed: boolean;  // true only during launch frame
     springK: number;            // N/m ≈ 800
   }

   function precessRate(h_CoM: number, m: number, I: number, omega: number, theta: number): number {
     const tau_tilt = m * 9.8 * h_CoM * Math.sin(theta);
     return tau_tilt / (I * omega);   // rad/s precession rate
   }

   function survivalAdvantage(h_short: number, h_tall: number): number {
     // Ratio of gyration cycles completed before topple — proportional to h ratio
     return h_tall / h_short;   // Spring Core: 20/10 = 2.0× more precession cycles
   }

   // Same-spin match: Spring Core wins via precession + height destabilisation.
   // Opposite spin: Bearing Core wins via tip friction advantage (6× lower decay).
   // KO vulnerability: Spring Core is ~2g total → easily ring-outted by any attacker.
```

---

## Case 68 — Hole Flat (HF): Annular Contact Reduces Pivot Friction, Increases Stamina vs Full Flat

> **Stock combo (Capricorne 100HF):** Wheel: Capricorne · Track: 100 · Bottom: Hole Flat
> **Stock combo (Wind Aquario 100HF/S):** Clear Wheel: Aquario · Metal Wheel: Wind (Light) · Track: 100 · Bottom: Hole Flat / Sharp
> **Stock combo (Lightning L Drago 100HF):** Clear Wheel: L Drago · Metal Wheel: Lightning · Track: 100 · Bottom: Hole Flat
> **Stock combo (Cyber Pegasis 100HF):** Clear Wheel: Pegasis · Metal Wheel: Cyber · Track: 100 · Bottom: Hole Flat
> **Stock combo (Thermal Lacerta WA130HF):** Clear Wheel: Lacerta · Metal Wheel: Thermal · Track: WA130 · Bottom: Hole Flat
> **Stock combo (Gryph Girago WA130HF):** Chrome Wheel(s): Girago + Gryph · Track: WA130 · Bottom: Hole Flat

Hole Flat is identical to Flat except the centre of the tip is hollow. The contact patch is a ring, not a solid disc. This changes the friction geometry and gyroscopic stability in two ways.

### Contact Patch Geometry

```
   Flat tip (solid disc):               Hole Flat tip (annular ring):

        r=0 ──────► r_outer                 r_hole ──────► r_outer
      ┌──────────────────┐               ┌────┐            ┌────┐
      │  ████████████████│               │    │ ▓▓▓▓▓▓▓▓▓▓ │    │
      │  ████ contact ███│               │ (no│  contact   │no) │
      │  ████████████████│               │    │ ▓▓▓▓▓▓▓▓▓▓ │    │
      └──────────────────┘               └────┘            └────┘

   Full Flat:                            Hole Flat (HF):
   A_contact = π × r_outer²             A_contact = π × (r_outer² − r_hole²)
             ≈ π × 12²  = 452 mm²                 ≈ π × (12² − 4²)  = 402 mm²
   (100% of disc area)                  (89% of disc area — small reduction)
```

### Pivot Friction Effect

The hollow removes the centre of the contact patch, where the _relative sliding velocity is zero_. Under a solid flat tip the centre point contributes no kinetic friction but does apply a static normal force. Removing that dead-zone redistributes the normal pressure outward:

```
   Pressure distribution (uniform normal load W across patch):

   Solid flat:    p(r) = W / A_flat        (uniform, including r=0)
   Annular HF:    p(r) = W / A_annular     (same total W, but only over ring)
                                           → slightly higher p at every contact r

   Pivot-friction torque (what resists spin when the bey precesses / tips):
   τ_pivot = μ × W × (2/3) × (r_outer³ − r_hole³) / (r_outer² − r_hole²)

   vs full flat:
   τ_pivot_flat = μ × W × (2/3) × r_outer

   Ratio:  τ_HF / τ_flat = (r_outer³ − r_hole³) / (r_outer × (r_outer² − r_hole²))
   With r_outer=12mm, r_hole=4mm:
         = (1728 − 64) / (12 × (144 − 16))
         = 1664 / (12 × 128) = 1664 / 1536 ≈ 1.08

   Counter-intuitively, τ_HF is ~8% HIGHER per unit normal force
   because the removed centre was pulling the effective moment-arm inward.
   However the removed area also reduces grip force on lateral sliding:
   μ_eff_HF / μ_eff_flat ≈ A_annular / A_flat ≈ 0.89

   Net spin-decay effect: 0.89 × 1.08 ≈ 0.96  → ~4% slower spin decay vs full Flat.
   This is the "slight stamina improvement" noted in the real part description.
```

### Wear Mechanic

The hole widens as the plastic wears, eventually causing the inner radius to grow:

```
   r_hole(t) = r_hole_0 + wearRate × accumulated_floor_contact_time

   As r_hole → r_outer:  A_annular → 0  →  bey effectively loses floor grip entirely.
   Friction: μ_eff(t) = μ_0 × (r_outer² − r_hole(t)²) / (r_outer² − r_hole_0²)
```

```typescript
   function holeFlatFriction(tip: TipState, t_contact_s: number): number {
     const r_outer = tip.dimensions.outerRadius;   // mm
     const r_hole  = Math.min(
       tip.dimensions.innerRadius + 0.002 * t_contact_s,  // 0.002 mm/s wear
       r_outer * 0.95                                       // never fully disappears
     );
     const area_ratio = (r_outer ** 2 - r_hole ** 2) / (r_outer ** 2 - tip.dimensions.innerRadius ** 2);
     return tip.friction * area_ratio;
   }
```

---

## Case 69 — Wing Attack 130 (WA130): Free-Spinning Wing Scrape as Spin-Loss Mechanic

> **Stock combo (Thermal Lacerta WA130HF):** Clear Wheel: Lacerta · Metal Wheel: Thermal · Track: WA130 · Bottom: Hole Flat
> **Stock combo (Gryph Girago WA130HF):** Chrome Wheel(s): Girago + Gryph · Track: WA130 · Bottom: Hole Flat

WA130 is a 130 mm-height spin track with two aerofoil-shaped wing panels that rotate freely around the track axle. The wings themselves are not physics bodies — they don't transmit force to the main beyblade body. The hazard is geometric: at low tilt angles or when the bey dips, the wing tips scrape the stadium floor.

### Height and Contact Risk

```
   Side view of a 130-height bey with WA130 on flat floor:

   ┌──────────────────────┐   ← Layer (attack ring)  ~30 mm height
   │                      │
   │    Spin Track body   │   ← 130 mm total height means the bey's
   │    (axle, 130 mm)    │     centre-of-mass sits high
   │                      │
   │ ←wing→       ←wing→  │   ← Wing tips at ~12–14 mm above floor
   │                      │     (track body above floor ≈ 10 mm from tip)
   └──────────┴───────────┘
              │ Tip contact point (e.g. HF, ~0 mm)
   ─────────────────────────  ← Stadium floor

   At tilt angle θ, the low-side wing height above floor:
   h_wing(θ) = h_wing_flat − r_bey × sin(θ)

   Floor contact when h_wing(θ) ≤ 0:
   θ_scrape = arcsin(h_wing_flat / r_bey)  ← typically ~8–12° for WA130
```

### Free-Spinning Wings: No Torque Transfer

Because the wings rotate freely around the track axle, a wing-floor collision applies a frictional torque to the WING PANEL only, not to the beyblade body. The wing simply spins up (or slows in the opposite direction) without dragging the bey.

```
   Torque on wing panel from floor scrape:
   τ_wing = μ_floor × F_normal_wing × r_contact_wing

   Angular acceleration of wing panel:
   α_wing = τ_wing / I_wing    (wing spins freely)

   Torque transmitted to bey body:
   τ_body = τ_wing × (bearing_friction_coeff)   ← very small (≈ 0.01–0.05)

   Net: almost no spin loss to bey body from wing-floor contact.
   BUT: the normal force F_normal_wing is borne by the bey → braking VERTICAL force
   which damps the bey's axial tilt oscillation (the wobble is damped, not spun away).
```

### Spin Loss Mechanism (Scrape Normal Force)

The wing presses on the floor under gravity + centrifugal tilt. This normal force increases floor drag on the MAIN TIP because it adds to the normal force the tip sees:

```
   Total tip normal force with wing scrape:
   N_tip_total = m × g × cos(θ) + F_wing_reaction

   Extra tip friction torque:
   Δτ_tip = μ_tip × F_wing_reaction × r_tip

   Spin decay increase:
   Δ(dω/dt) = Δτ_tip / I_bey = μ_tip × F_wing_reaction × r_tip / I_bey

   spinLossFactor = 0.05 (seed value) models the mean extra decay per tick when scraping.
```

```typescript
   function applyWingScrapeLoss(bey: BeyState, track: SpinTrackState, dt: number): void {
     const h_wing = track.wingHeightMm - bey.radius * Math.sin(Math.abs(bey.tiltAngle));
     if (h_wing > 0) return;                    // wings clear the floor
     const F_wing = -h_wing * track.wingStiffness;   // spring reaction (compressive)
     const extraDecay = track.spinLossFactor * F_wing * dt;
     bey.spin = Math.max(0, bey.spin - extraDecay);
   }
```

---

## Case 70 — Under Frame (U): Downward-Angled Protrusions as Disc-to-Layer Burst Attack

The Under frame is a ring that mounts below the disc, with four diamond-shaped protrusions angled downward at ~30°. These protrusions point clockwise. Their function is to strike the bottom face of the opponent's Layer during disc-to-layer contact.

### Contact Geometry

```
   Cross-section at contact:

      Opponent Layer (bottom face)
   ════════════════════════════════
         ↑  impact surface
         │
     ┌───┘◄─ protrusion tip (angled ~30° downward, clockwise)
     │  Under Frame protrusion
     └─────────────────────────
   ════════════════════════════════  ← Disc top face

   In right-spin: protrusion sweeps FORWARD into opponent layer bottom.
   In left-spin:  protrusion sweeps AWAY — recoil is reduced instead.
```

### Burst Attack Calculation

Under's protrusions contact the opponent at the disc-to-layer gap. The downward angle converts lateral collision impulse into an UPWARD torque on the opponent's layer ratchet:

```
   Collision impulse J (lateral, at protrusion tip r_p from spin axis):
   Burst torque = J × r_p × sin(α_protrusion)    where α_protrusion ≈ 30°
               = J × r_p × 0.5

   vs a flat-profile disc-to-layer contact (α = 0°):
   Burst torque_flat = 0   (horizontal impulse has no upward component)

   Under provides 0.5 × J × r_p burst torque per collision vs effectively zero
   for a plain flat disc-to-layer.

   This is why the WBO rates Under at Attack 1, Defense 1:
   — Attack 1:  burst-attack potential from the angled protrusions (right-spin)
   — Defense 1: the heavy weight (2.38 g) increases KO resistance
```

### Left-Spin Recoil Reduction

In left-spin, the protrusion clockwise sweep means the protrusion tip glances AWAY from the opponent layer face — the impact angle changes from +30° (upward bite) to −30° (downward glance):

```
   Right-spin:  protrusion bites INTO opponent layer → Burst torque positive (destabilising)
   Left-spin:   protrusion glances OFF opponent layer → Burst torque negative (stabilising → recoil absorbed)

   Effective burst multiplier:
   burst_mult_right = 1.0 + sin(α) × k   (k = geometry constant ≈ 0.3)
   burst_mult_left  = 1.0 − sin(α) × k   (reduces opponent's burst attack on us)
```

```typescript
   function underBurstModifier(spinDir: 'right' | 'left', alpha_deg: number): number {
     const k = 0.3;
     const s = Math.sin(alpha_deg * Math.PI / 180);
     return spinDir === 'right' ? 1 + k * s : 1 - k * s;
   }
   // Used in BurstSystem.computeBurstChance():
   // chance *= underBurstModifier(bey.spinDirection, 30);
```

---

## Case 71 — Atomic: Wide Free-Rotating Ball + LAD Ring as Dual-Mode Stamina/Defense

Atomic has two independent free-spinning components: a large-diameter ball tip and an outer four-tabbed ring. Each contributes a different physics effect.

### Ball Tip: Free-Rotation Reduces Spin Decay

The ball rotates freely — floor contact spins the ball in place rather than draining the bey's axial spin. This is the same mechanism as Case 25 (bearing tips) but with less ideal rolling:

```
   Bearing tip (B:D):  bearingFriction ≈ 0.02 → spin_steal = 0.02 × F_floor × r_tip × dt
   Atomic ball:        bearingFriction ≈ 0.08 → spin_steal = 0.08 × F_floor × r_tip × dt

   Atomic is ~4× less efficient than B:D — its ball rolls under friction, not on a bearing.
   But vs a fixed ball tip (bearingFriction = 1.0): Atomic loses ~92% less spin.
```

### Ball Diameter and KO Resistance

The wide ball (outerRadius ≈ 16 mm vs Sharp's 4 mm) increases the restoring torque when the bey tilts:

```
   Restoring torque from wide ball on slope (bowl wall angle φ):
   τ_restore = m × g × r_ball × sin(φ)

   Wide ball (r=16mm): τ_restore = m × g × 0.016 × sin(φ)
   Sharp  (r=4mm):     τ_restore = m × g × 0.004 × sin(φ)

   Wide ball produces 4× stronger self-righting torque → resists bowl-wall KO.
```

### Outer Ring: Life-After-Death

The four-tabbed outer ring scrapes the floor as the bey loses spin and begins to tilt. Unlike WA130's wings (Case 69), this ring is part of the tip body and sits at a fixed radius. Its floor contact at low spin creates a _gyrating roll_ rather than sliding stop:

```
   At high spin: outer ring clears floor (bey upright) → no contact → full LAD from ball.
   At low spin:  outer ring touches floor → generates rolling moment → bey gyrates in circles
                 rather than falling immediately → extends LAD window.

   Comparison: Defense tip has a similar ring but at a higher clearance height.
   Loop (Case 73) has rollers at lower placement — scraping at low spin stops the bey instead.
   Atomic's ring is at mid-height → scrapes late, generates gyrating roll, not braking stop.
```

```typescript
   function atomicSpinDecay(bey: BeyState, tip: TipState, dt: number): void {
     // Ball free-spin reduces floor friction
     const eff_friction = tip.friction * tip.bearingFriction;   // 0.18 × 0.08 ≈ 0.014
     const torque_floor = eff_friction * bey.normalForce * tip.dimensions.outerRadius;
     bey.spin -= (torque_floor / bey.I) * dt;

     // Outer ring LAD at low spin (tilt > threshold)
     const tilt_thresh = 15 * Math.PI / 180;   // 15° tilt triggers ring contact
     if (Math.abs(bey.tiltAngle) > tilt_thresh && bey.spin < bey.maxSpin * 0.15) {
       // Ring contact: apply small outward rolling force instead of braking
       const F_lad = tip.suctionCap * 0.5;
       bey.vx += F_lad * Math.cos(bey.heading) * dt;
       bey.vy += F_lad * Math.sin(bey.heading) * dt;
     }
   }
```

---

## Case 72 — Ignition' (Disc-Integrated Driver): Impact-Activated Motor Restores Spin

Ignition' combines disc and driver into a single unit housing a small LR44-powered motor. An internal spring-circuit contact closes when the beyblade is struck hard enough — the impact compresses the spring, bridges the gap, and the motor runs for a short burst, spinning up the thin plastic tip beneath.

### Spring-Circuit Impact Threshold

```
   Spring compression from impact impulse J:
   x_spring = J / k_spring     (Hooke's law, instantaneous)

   Circuit closes when x_spring ≥ x_threshold:
   J_trigger = k_spring × x_threshold

   Estimated values from part description behaviour:
   k_spring ≈ 5000 N/m  (stiff enough to not trigger on minor bumps)
   x_threshold ≈ 1 mm = 0.001 m
   J_trigger = 5000 × 0.001 = 5 N·s  ← requires a hard hit to activate

   In-game: motor activates only when collision impulse > J_trigger.
```

### Motor Spin-Up

The motor runs its thin plastic tip at ~3000–5000 RPM (similar to Gen-1 engine tips). The tip spins against the floor, and because it is part of the disc-driver unit, the reaction torque is transmitted directly to the bey:

```
   Motor torque τ_motor acts on tip → reaction torque on bey body:
   dω_bey/dt = τ_motor / I_bey    while motor runs

   Motor run duration: ~0.5–2.0 s (until LR44 voltage drops under load)
   Spin restored: Δω ≈ τ_motor × t_run / I_bey

   Example: τ_motor = 0.002 N·m, t_run = 1.0 s, I_bey = 5×10⁻⁶ kg·m²
   Δω = 0.002 × 1.0 / 5e-6 = 400 rad/s  → significant spin restoration

   Equivalent to a Stamina-type special move firing on hard hit.
```

### Disc-Integration Trade-Off

Because the disc and driver are a single part, the bey cannot mix Ignition' with a separate disc for weight distribution. The combined unit's mass is fixed:

```
   Normal combo: disc (e.g. 7 Disc, ~27 g) + driver (e.g. Atomic, ~5 g) = ~32 g
   Ignition' combo: disc+driver combined (~20 g) + motor/battery = ~30 g total
   → Slightly lighter disc equivalent → lower I → faster spin decay when motor is off.

   Motor-off:  Ignition' behaves like a thin Sharp tip (low friction, moderate stamina).
   Motor-on:   impact-triggered spin burst compensates for the lower I disadvantage.
```

```typescript
   interface IgnitionState {
     motorActive: boolean;
     motorTimeRemaining: number;   // seconds
     batteryCharge: number;        // 0–1; depletes each motor activation
   }

   function onCollision(bey: BeyState, ign: IgnitionState, J: number): void {
     const J_trigger = 5.0;   // N·s threshold
     if (J >= J_trigger && !ign.motorActive && ign.batteryCharge > 0.1) {
       ign.motorActive = true;
       ign.motorTimeRemaining = 1.0 * ign.batteryCharge;
       ign.batteryCharge -= 0.3;   // each activation uses 30% of battery
     }
   }

   function tickIgnition(bey: BeyState, ign: IgnitionState, dt: number): void {
     if (!ign.motorActive) return;
     const tau_motor = 0.002;   // N·m
     bey.spin += (tau_motor / bey.I) * dt;
     ign.motorTimeRemaining -= dt;
     if (ign.motorTimeRemaining <= 0) ign.motorActive = false;
   }
```

---

## Case 73 — Loop (Lp): Spin-Velocity-Dependent Roller Behaviour (Stabiliser at High Spin, Brake at Low Spin)

Loop features a ball tip at standard height with four floor-contact tabs (identical geometry to Defense) and two free-spinning roller wheels that drape down on either side of the tip. The rollers produce opposite effects at high vs low spin.

### Roller Geometry

```
   Front view of Loop:

          ┌──────────────────┐  ← Layer
          │   Disc body      │
   ┌──────┴──────────────────┴──────┐
   │ roller │    ball tip    │roller│   ← rollers sit at floor level on the sides
   │  (O)   │       ●        │ (O)  │
   └────────┴────────────────┴──────┘
   ─────────────────────────────────────  ← Stadium floor

   Ball tip clearance from floor: ~2 mm (standard height)
   Roller contact height: ~0 mm (drapes to floor level)
   Tab contact height: identical to Defense tabs (~0 mm at tilt)
```

### High-Spin Phase: Rollers as Righting Mechanism

When the bey tilts at high spin, one roller contacts the floor before the ball tip does. The free-spinning roller rolls rather than dragging — applying an upward normal force to the tilted side:

```
   Righting torque from roller on tilted bey:
   τ_right = F_roller × d_roller    where d_roller = lateral distance from CoM to roller contact

   The roller contact is at radius r_roller from spin axis:
   At tilt angle θ, low-side roller hits floor when:
   r_roller × sin(θ) ≥ h_roller_clearance

   θ_contact ≈ arcsin(0/r_roller) ≈ 0°  → rollers contact almost immediately on any tilt.

   Rolling (not sliding): torque on BEY from roller = F_normal × bearing_friction_small
   Net τ_righting ≈ F_roller × r_roller_to_CoM × (1 − bearing_drag)  → positive righting torque
   Stabilising at high spin because bey has enough angular momentum to convert τ into precession.
```

### Low-Spin Phase: Rollers as Brakes

At low spin (< ~20% max spin) the bey has insufficient gyroscopic stiffness to precess cleanly. The roller's low-side contact point instead acts as a pivot — the bey tilts further, the roller digs in, and the contact becomes SLIDING rather than rolling:

```
   At low spin: ω < ω_threshold  →  gyroscopic rigidity L = I×ω → LOW
   Any lateral torque (from roller) causes tilt, not precession.

   Roller now sliding against floor:
   Drag force F_drag = μ_roller × F_normal_roller   (kinetic friction, not rolling)
   This drag is tangential to the spin → applies a braking torque on the bey body:

   τ_brake = F_drag × r_roller  (in the opposite direction to ω)
   dω/dt = −τ_brake / I_bey

   At low spin, rollers INCREASE spin decay → nullify LAD.
   This matches the real part description: "the low placement instead acts as brakes."
```

```
   Roller behaviour summary:

   ┌───────────────┬──────────────────────────────┬──────────────────────────────┐
   │ Spin phase    │ Roller behaviour              │ Effect on bey               │
   ├───────────────┼──────────────────────────────┼──────────────────────────────┤
   │ High spin     │ Rolling contact (free-spin)   │ Righting torque → stable    │
   │ (ω > 60%)     │ Low drag, precession intact   │ Resists KO from bowl walls  │
   ├───────────────┼──────────────────────────────┼──────────────────────────────┤
   │ Medium spin   │ Intermittent contact           │ Minor drag, small decay     │
   │ (20–60%)      │ Partially rolling              │ Modest stamina loss         │
   ├───────────────┼──────────────────────────────┼──────────────────────────────┤
   │ Low spin      │ Sliding contact (gyro weak)   │ Braking torque → kills LAD  │
   │ (< 20%)       │ Kinetic friction              │ Bey stops quickly           │
   └───────────────┴──────────────────────────────┴──────────────────────────────┘
```

```typescript
   function loopRollerTick(bey: BeyState, dt: number): void {
     const spinRatio = bey.spin / bey.maxSpin;
     const rollerRadius = 0.010;   // m — distance from CoM to roller contact
     const F_roller = bey.mass * 9.8 * Math.abs(Math.sin(bey.tiltAngle)) * 0.5;

     if (spinRatio > 0.20) {
       // High spin: rolling → righting torque
       const tau_right = F_roller * rollerRadius * 0.05;   // small bearing drag
       bey.tiltAngle *= (1 - tau_right * dt * 10);         // nudge tilt toward 0
     } else {
       // Low spin: sliding → braking
       const mu_roller = 0.4;
       const tau_brake = mu_roller * F_roller * rollerRadius;
       bey.spin = Math.max(0, bey.spin - (tau_brake / bey.I) * dt);
     }
   }
```

[← Phase 21: Unified Foundation](phase-21-unified-foundation.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 23: Battle Modes →](phase-23-battle-modes.md)

---

# Phase 22 — Semi-Autonomous Control: Authority Blend · Natural Motion · Gyroscope Physics

> **Stage 22** — Control authority design: every beyblade is simultaneously a physics object
> (gyroscope) and a player-controlled entity. Player input blends with the bey's emergent
> gyroscopic motion via a dynamic authority scalar α. This phase is built entirely on top of
> the Phase 21 BehaviorDef / GeometryDef / StatDef primitives.
>
> **Citation mandate:** every formula and constant in this document is cited from a batch
> or phase file. All UNKNOWN items are explicitly flagged.

---

## 0. Core Principle

> "A Beyblade is not an RC car. The player expresses intent; the bey expresses physics.
> Player input blends with the bey's natural gyroscopic motion via a dynamic authority
> scalar α. At α=0 the bey is fully autonomous; at α=1 the player has full control.
> α is never constant — it changes every tick based on spin RPM, linear momentum,
> hold duration, and arena conditions."

This design is grounded in real gyroscope physics (batch-015 §A–D):
- A spinning beyblade undergoes **gyroscopic precession** (Ω_P = r·M·g·sinθ / (I·ω)), meaning
  its spin axis orbits the vertical at a rate inversely proportional to spin speed.
- At high spin the bey is **gyroscopically rigid** (L = I·ω is large → resists deflection).
- As spin decays below ~40%, **nutation** (wobble) begins — seeded PRNG forces in the existing
  engine correctly model this (batch-015 §D confirms the 40% threshold).
- Below 15%, the Euler's Disk **death spiral** begins: precession rate diverges (Ω_P → ∞)
  and the bey collapses inward in tightening circles.

The authority blend ensures the bey always "feels" like a gyroscope: it resists sudden direction
changes (spinPenalty), preserves momentum (momentumPenalty), and only fully responds to player
input after sustained effort (holdBoost ramps over ~3 seconds).

---

## 1. Two-Layer AI Architecture

Two distinct AI systems coexist, never conflated:

| | Control AI | Player AI |
|---|---|---|
| **Purpose** | Beyblade's own gyroscopic intelligence | Simulated human player |
| **Lives in** | `NaturalMotion.ts`, decision system | `AIController.ts` (existing, untouched) |
| **Active for** | EVERY beyblade (human and AI-controlled) | AI opponent beyblades only |
| **Output** | `naturalForce { fx, fy }` per tick | `PlayerInput` uint16 bitmask per tick |
| **Blended with** | Player or Player-AI input via α | Control AI via the same authority blend |
| **Examples** | Petal orbit, momentum continuation, death spiral, rage burst | AIController.medium/hard/hell chase/strafe logic |

When a **human** plays:   `human_input × α + ControlAI × (1−α)`
When an **AI** plays:     `PlayerAI_input × α + ControlAI × (1−α)`

AI opponents fight their own bey's orbital physics just as a human player does.
This means a well-designed AI opponent at "hell" difficulty overcomes the bey's natural orbit
more effectively than "medium" — the blending is the same, the PlayerInput quality differs.

---

## 2. Authority Blend System (α)

### 2.1 Formula Components

Raw α is computed from five additive/subtractive terms:

| Term | Formula | Range | Rationale |
|---|---|---|---|
| base | 0.30 | constant | player always has some minimum influence |
| holdBoost | min(0.70, holdMs / 3000 × 0.70) | 0–0.70 | sustained WASD/cursor hold ramps authority |
| spaceBoost | 0.40 while chargeHeld | 0 or 0.40 | SPACE hold = deliberate control assertion |
| clashBoost | 0.30 while clashBoostTicks > 0 | 0 or 0.30 | 15-tick window post-collision → player assertion |
| spinPenalty | 0.25 × min(1, spin/maxSpin) | 0–0.25 | high spin = gyroscopic rigidity resists redirect |
| momentumPenalty | 0.25 × min(1, mass×speed/4200) | 0–0.25 | high momentum = inertia resists change |

```
α_raw   = clamp(0, 1,  base + holdBoost + spaceBoost + clashBoost − spinPenalty − momentumPenalty)
α_arena = α_raw × arenaAuthorityMultiplier          (see Phase 23 §3 for arena config)
α_smooth= lerp(prev_α_smooth, α_arena, 0.08)        (inertia in authority itself; ~0.5s transition)
```

Citation: spinPenalty basis = batch-015 §A "gyroscopic rigidity ∝ angular momentum L=I·ω";
momentumPenalty basis = batch-015 §A "Newton's 1st law — linear inertia"; constant 4200 is
`MASS_MAX(15) × speed_reference(280px/s)` (design parameter).

### 2.2 Hard Overrides

These override the smooth formula entirely:

| Condition | α value | Duration |
|---|---|---|
| `comboExecuting = true` | 0.00 | until combo end |
| `Date.now() < controlLockedUntilMs` | 0.00 | until expiry |
| `playerControlStunUntil > now` (heavy hit) | 0.00 | 350ms |
| `aiControlStunUntil > now` (heavy hit) | 0.00 | 80ms (AI recovers faster) |
| `aiSurrenderUntil > now` (player held >3000ms) | 0.90 | until released |

The 350ms/80ms stun durations are design parameters (no direct batch citation); they are
sized so a heavy hit feels impactful for players but AI recovers quickly enough to be competitive.
**DESIGN FLAG — not from batch research.**

### 2.3 Arena Authority Multiplier

Any `ArenaConfig` can define `playerAuthorityConfig` (Phase 23 §3). The multiplier is computed
per-bey per-tick by checking proximity to configured features. Default = 1.0 (no change).

Examples of designed feature multipliers (design parameters, not from research):
- `railTrack: 1.80` — anime rail-riding; player commands very precise on a rail
- `gravityWell: 0.30` — near-black-hole; player can barely steer
- `spinZone: 0.70` — chaotic zone; partial control loss

---

## 3. Natural Motion System

`computeNaturalForce(bey, cx, cy, attitude, opponents, isAIStunned, decisionBias, rageBurstActive)`
runs every tick for every beyblade regardless of who controls it.

### 3.1 Orbit Layer (gyroscopic precession approximation)

```
orbitStr = 0.0005 × bey.mass × spinFrac × tip.grip
angDir   = bey.spinDirection === "left" ? −1 : +1
fx       = (−dy / dist) × orbitStr × angDir     (tangential, ⊥ to radius vector)
fy       = ( dx / dist) × orbitStr × angDir
```

Citation: `orbitStr ∝ 1/ω` is a simplification of the precession formula Ω_P = r·M·g·sinθ/(I·ω)
(batch-015 §A). At full spin, orbit is wide and fast; at low spin, it naturally slows (lower
spinFrac) and collapses toward the centre. `tip.grip` encodes the floor-contact friction
(batch-006 §1B; batch-015 §C): rubber=high grip=strong orbit; bearing=near-zero grip=weak orbit.

### 3.2 Momentum Continuation (linear inertia)

```
contStr = 0.0001 × bey.mass × spinFrac × (speed / 300)
fx     += (bey.velocityX / speed) × contStr
fy     += (bey.velocityY / speed) × contStr
```

Citation: batch-015 §A Newton's 1st law — a moving bey tends to continue moving.
`speed / 300` scales by a reference speed (300px/s ≈ fast-moving bey) — design constant.

### 3.3 Attitude Bias (J/K keys)

```
Aggressive (J): toward nearest opponent × 0.0003 × mass
Defensive  (K): away from nearest opponent × 0.0002 × mass
```

Design parameter (not from research). Asymmetry (0.0003 vs 0.0002): attacking is a stronger
impulse than retreating, reflecting that aggressive play requires more force.

### 3.4 Death Spiral (FACT — batch-015 §D)

```
if (spinFrac < 0.15):
  spiralStr = 0.001 × bey.mass × (0.15 − spinFrac) × 10
  fx       += (−dx / dist) × spiralStr     (toward arena centre)
  fy       += (−dy / dist) × spiralStr
```

Citation: batch-015 §D "Euler's disk finite-time singularity: Ω_P → ∞ as ω → 0."
At near-zero spin, precession frequency diverges — the bey makes tighter and tighter circles
very rapidly before stopping. The formula amplifies centripetal pull as spinFrac drops from
0.15 → 0, producing the characteristic collapsing spiral.

### 3.5 Spin Stabilisation (FACT — batch-015 §D)

```
if (spinFrac < 0.40):
  stabilStr = 0.0002 × bey.mass × (1 − spinFrac)
  fx        += (−dx / dist) × stabilStr    (centring nudge)
  fy        += (−dy / dist) × stabilStr
```

Citation: batch-015 §D nutation onset at ~40% spin. Real beyblades at low spin
self-correct slightly by friction before nutation overwhelms them. This layer models that
centring tendency — separate from the death spiral (which is stronger and only below 15%).

### 3.6 Rage Burst (design)

```
if (rageBurstActive):
  fx *= 2.0
  fy *= 2.0
```

Active for 10 ticks after a heavy-hit stun expires. Models the "rage" mechanic common
in Beyblade anime: after being knocked hard, a bey surges with extra force.
`rageBurstTicks` is a server-side Map<beyId, number> — NOT on Colyseus schema (saves sync).

### 3.7 Rail Adhesion (design)

```
if (decisionBias.railTargetX !== undefined):
  adhesionStr = 0.0006 × bey.mass
  fx          += (rdx / rd) × adhesionStr    (toward rail point)
  fy          += (rdy / rd) × adhesionStr
```

When the bey is within a rail feature's radius, the room injects `railTargetX/Y` into
`decisionBias`. This creates anime-style rail riding where the bey naturally follows the
track without constant player input. `playerAuthorityConfig.featureOverrides.railTrack = 1.80`
provides high authority near rails, enabling precise player steering on top of the adhesion.

### 3.8 Decision Bias

```
fx += decisionBias.fx
fy += decisionBias.fy
```

The autonomous decision system (§6) injects a persistent bias force each tick. The bias
direction changes every 30–90 ticks (seeded PRNG timer) when a new decision fires.

---

## 4. Velocity Steering Model

### 4.1 The Problem

Standard physics engines add force in a direction, which changes BOTH the direction AND the
speed of the body. A gyroscope in real life changes direction (steering) while preserving
speed (momentum). If a rubber-flat tip bey is cornering, it should maintain the same
surface speed through the turn — only direction changes, and spin energy pays the friction cost.

### 4.2 Solution: Centripetal Perpendicular Force

```
speed  = |bey.velocity|
cvx    = bey.velocityX / speed        (current direction unit vector)
cvy    = bey.velocityY / speed
cross  = cvx × targetDir.y − cvy × targetDir.x    (sin of angle between current and desired)

tip          = getTipProfile(bey)
gripFactor   = max(0.05, 1 − tip.freeSpin)
powerFrac    = min(1, bey.power / 100)
turnRate     = α × powerFrac × gripFactor

steerStr     = bey.mass × speed × turnRate × 0.002
applyForce(  −cvy × cross × steerStr,   cvx × cross × steerStr  )
```

The perpendicular force `(−cvy, cvx) × cross × steerStr` rotates the velocity vector
toward `targetDir` without adding or removing speed. This is a discrete approximation of
the centripetal acceleration needed for circular arc motion.

Citation: batch-015 §A angular momentum conservation; batch-006 §1C tip friction determines
turn radius (rubber = gripFactor 0.9 = tight corners, bearing = gripFactor ≈0 = near-straight).

### 4.3 Spin Cost for Sharp Turns (FACT — batch-015 §C)

```
spinSteerCost = tip.grip > 0.50 ? 0.50 : tip.freeSpin > 0.50 ? 0.10 : 0.25
spinCost      = |cross| × turnRate × spinSteerCost
bey.spin      = max(0, bey.spin − spinCost)
```

Citation: batch-015 §C tribology — µ_kinetic < µ_static means any angular direction change
involves kinetic friction energy loss. Rubber tips (high µ) lose more spin on sharp turns
than bearing tips (near-zero µ). The |cross| factor scales cost by sharpness of the turn.

### 4.4 Tip Profile by Archetype (batch-006 §1B; batch-014 §A)

| Archetype | grip | freeSpin | Turn character |
|---|---|---|---|
| attack | 0.80 + atk/150×0.10 | 0.00 | Tight corners, high spin cost |
| defense | 0.20 | 0.25 + def/150×0.10 | Wide arcs, low spin cost |
| stamina | 0.06 | 0.50 + sta/150×0.30 | Near-straight drift, minimal cost |
| balanced | 0.40 | 0.15 | Moderate arcs, moderate cost |

For beys with actual `TipPart` in `beyblade_parts`: read `TipPart.gripFactor` and
`TipPart.freeSpin` directly — archetype fallback only used when part data absent.

### 4.5 Petal Count Rule (PHYSICS-FACT — batch-011 §D)

> Petal count is NOT a fixed tip attribute. It is emergent from: launch RPM, position,
> tip friction, floor µ, arena bowl slope, spin energy, inner-ridge diameter.
> The stick-slip mechanism (batch-015 §C: µ_static > µ_kinetic → grip → slip → petal arc)
> produces emergent patterns. **Never hardcode `petalCount` on any tip or archetype.**
> The `orbitMovement` mechanic with `orbitStr ∝ grip × spinFrac × mass` produces emergence.

---

## 5. Input Abstraction — 9-Key + 4 Sources

### 5.1 Bitmask Expansion (uint16)

Original bitmask (bits 0–9) is extended to bits 0–12:

| Bit | Key | Action | Notes |
|---|---|---|---|
| 0 | moveLeft | A / ← | |
| 1 | moveRight | D / → | |
| 2 | moveUp | W / ↑ | |
| 3 | moveDown | S / ↓ | |
| 4 | attack | mouse LClick-tap / Z fallback | Z is optional |
| 5 | defense | mouse RClick / X fallback | X is optional |
| 6 | dodge | mouse mid-click / X1 / C fallback | C is optional |
| 7 | jump (upper-pull) | I key | contextual: stabilise OR jump |
| 8 | chargeHeld | SPACE hold / mouse LClick-hold ≥200ms | |
| 9 | specialTap | SPACE release / mouse LClick-release | |
| 10 | attitudeAggressive | J | seek opponent |
| 11 | attitudeDefensive | K | avoid/retreat |
| 12 | attitudeStamina | L | dodge on collision |
| — | direction {x,y} | cursor position / stick analog | non-bitmask analog field |

The 9-key primary set is: W A S D I J K L SPACE.
Z/X/C are optional legacy fallbacks for bits 4/5/6; they are not part of the advertised layout.
Attack/Defense/Dodge are canonical on mouse buttons, gamepad face buttons, or touch HUD buttons.

### 5.2 Four Input Sources

All sources produce the same `PlayerInput` struct — the server never distinguishes between them.

**Keyboard 9-key:** Direct key→bit mapping as per table above. Appropriate for desktop
users who prefer no mouse control.

**Mouse + Keyboard combined:**
- On each animation frame: `direction = normalize(cursorWorldPos − bey.worldPos)` → `input.direction`
- `mousedown left` tap (<200ms) → bit 4 (attack) for one frame
- `mousedown left` hold (≥200ms) → bit 8 (chargeHeld) while held
- `mousedown right` → bit 5 (defense) while held
- `mousedown middle` or `X1 button` → bit 6 (dodge) momentarily
- I/J/K/L/SPACE still from keyboard; cursor supplements, not replaces, the 9-key set

**Gamepad:**
- Left stick: analog `direction {x,y}` (proportional magnitude → force scaling)
- A / Cross → bit 4 (attack); B / Circle → bit 6 (dodge); X / Square → bit 5 (defense)
- Y / Triangle → bit 7 (upper-pull)
- RT / R2 hold → bit 8 (chargeHeld); RT / R2 release after hold → bit 9 (specialTap)
- LB / L1 cycle press → cycles bit 10→11→12 on each press (J→K→L attitude cycle)

**Touch (`TouchControls.tsx` — new component):**
- Left 40% of screen: virtual d-pad (4 quadrant zones) → WASD bits
- Right edge: button strip `[ATK][DEF][DDG][J][K][L]`
- Center long-press → bit 8; quick-tap → bit 9
- Swipe-up anywhere → bit 7 (one frame)
- All events call `sendInput(bitmask)` directly; no React re-render per frame (pointer events)

### 5.3 Contextual I-Key Semantics

**Context A — Stabilise pulse** (active when `spin < 40%` OR `bey.isAirborne`):
```
centringForce = upForce × 0.33 toward arena centre
uprightForce  = upForce × 0.67 upward (negative Y)
upForce       = 0.003 × bey.mass
```
Does NOT check hasJumpingCore or mass. Available at any mass. Useful to rescue a dying
bey from a pit rim or correct a tilt spiral.

**Context B — Jump attempt** (active when `spin ≥ 40%`, NOT airborne, NOT inPit):
```
canJump = hasJumpingCore(bey, prng) AND bey.mass ≤ 15
if canJump:
  bey.isAirborne = true; bey.airborneTimer = 1.0
  applyForce(0, −0.003 × bey.mass)            (upward impulse)
else:
  applyForce(0, −0.003 × bey.mass × 0.5)      (partial uplift, never fully airborne)
```

Jump probability by archetype (design parameter — no batch citation):
attack=60%, balanced=30%, defense=10%, stamina=8%

Mass interpretation (design, based on typical bey weights batch-011 §A):
- mass ≤15 (light beys, typical attack ~8–10g) → full jump, clears pits
- mass 15 (near limit, heavy defense ~14–15g) → barely lifts
- mass >15 → partial uplift only (0.5×), never fully airborne

Seeded per bey per match via `createPRNG(hashString(matchId + beybladeId))`.

### 5.4 Type-Aware Defense (X key / bit-5)

| Bey type | X does | Physics rationale | Source |
|---|---|---|---|
| defense | Guard: `isDefending=true`, `defenseBuffTimer=0.1s`, incoming spin−50% | Defense archetype suited for absorbing hits | batch-014 §D (archetype trees) |
| attack | Auto-dodge: lateral arc force, power−10 | Guard costs attack type too much spin; better to evade | batch-014 §D |
| stamina | Evasive spin-out: small lateral in spinDirection, power−5 | Cheap evasion preserves precious spin | batch-014 §D |
| balanced | spin≥60% → guard; spin<60% → dodge | Context-dependent: high-spin balanced can absorb, low-spin must dodge | design |

### 5.5 Inertia-Arc Dodge (C key / bit-6)

Standard dodge is purely lateral. The arc variant curves around obstacles while preserving speed:

```
threat = find nearest obstacle/opponent in forward cone (within 120px, dot(velocity, toThreat) > 0.5)
if (threat AND speed > 50):
  cross   = vx × toThreatY − vy × toThreatX          (threat on left=negative, right=positive)
  perpDir = cross > 0 ? (−vy, vx) : (vy, −vx)       (perpendicular away from threat side)
  arcStr  = fm × 4 × speedBonus × min(1, speed/200)
  applyForce(perpDir × arcStr)
else:
  standard lateral dodge in spinDirection
```

Citation: momentum preservation via centripetal arcing (batch-015 §A). The arc force is
perpendicular to velocity → changes direction without adding speed.

---

## 6. Decision System

### 6.1 Timer and Evaluation

Each beyblade has an independent decision timer initialized to a random value in [30, 90] ticks,
seeded via `createPRNG(hashString(matchId + beybladeId))`. When the timer expires:
1. Call `evaluateDecision(bey, opponents, distToWall, recentlyHit, prng)`
2. Store result in `currentDecisions` Map and reset timer to next random [30, 90] interval
3. `decisionBias` Map updated with the bias force for the chosen decision

Using the same seeded PRNG as wobble forces (phase-00 / existing engine) ensures replay
determinism — same match always produces identical decision sequences for each bey.

### 6.2 Five Decisions

| Decision | Bias force injected | Use case |
|---|---|---|
| `continue_orbit` | `{fx:0, fy:0}` — pure natural orbit | default |
| `seek_opponent` | toward nearest opponent, magnitude 0.0003×mass | attack bey hunting |
| `avoid_wall` | centripetal toward centre, magnitude 0.0002×mass | wall-avoidance |
| `conserve_spin` | `{fx:0, fy:0}` + conservative orbit (lower orbitStr via spinFrac already lower) | stamina mode |
| `counter_attack` | burst force in facing direction × 0.0004×mass + α hard-set to 1.0 for 0.5s | post-hit response |

### 6.3 Probability Matrix

| Decision | attack | defense | stamina | balanced |
|---|---|---|---|---|
| `seek_opponent` | 75% (if opponents exist AND spin>50%) | 5% | 2% | 35% |
| `avoid_wall` | 10% | 80% | 30% | 55% |
| `conserve_spin` | 5% | 30% | 85% | 25% |
| `counter_attack` | 70% (if recentlyHit) | 15% (if recentlyHit) | 5% (if recentlyHit) | 40% (if recentlyHit) |
| `continue_orbit` | remainder | remainder | remainder | remainder |

State modifiers applied before evaluating:
- `spin < 0.40`: `conserve_spin` probability × 1.5 for all types
- `spin > 0.80`: `seek_opponent` probability × 1.3 for attack type
- `distToWall < 60px`: `avoid_wall` probability × 2.0 for all types
- `playerα > 0.70`: decision cancelled mid-interval; bey defers to player entirely

---

## 7. Gyroscope Motion Library

All 12 observable real-world gyroscopic motions and their game representations.
Every entry is cited from batch-015, batch-006, or batch-014.

| # | Motion | Physics basis | Game representation | Citation |
|---|---|---|---|---|
| 1 | **Precession / petal orbit** | Ω_P = r·M·g·sinθ/(I·ω); tangential force ⊥ radius; Ω_P ∝ 1/ω | `computeNaturalForce` §3.1 orbit layer | batch-015 §A |
| 2 | **Nutation / wobble** | Off-axis perturbation at low angular momentum L | PRNG wobble forces at spin<40% — existing engine confirmed correct | batch-015 §B; confirmed by batch-015 §D |
| 3 | **Gyroscopic rigidity** | Resistance to direction change ∝ L = I·ω | spinPenalty reduces α at high spin → bey resists redirection | batch-015 §A |
| 4 | **Drift (gyro slip)** | Tip slips when lateral demand > µ_s·N | Turn radius ∝ 1/gripFactor; rubber=tight, bearing=wide drift arcs | batch-015 §C; batch-006 §1C |
| 5 | **Spiral entry** | Launch angle + precession → inward spiral from edge | High-power launch → wide initial orbit tightening as speed bleeds | batch-015 §D; inferred from precession formula |
| 6 | **Death spiral** | Euler's Disk: Ω_P → ∞ as ω → 0 (finite-time singularity, arxiv rolling coin) | spin<15%: `computeNaturalForce` §3.4 spiral collapses inward | batch-015 §D |
| 7 | **Bank lean** | Centripetal reaction tilts spin axis inward on turns | 2.5D: `beyTiltAngle` increases proportional to `|cross| × turnRate` during steering | batch-015 §B (angular momentum) |
| 8 | **Jump drift** | No ground contact = no grip = pure momentum (Newton 1st) | `isAirborne`: `gripFactor → 0`; steering reduced; no orbit force | batch-015 §A Newton |
| 9 | **Wall ride** | High centrifugal force + spin pushes bey to bowl rim | speed > threshold: orbit radius grows; bey climbs bowl wall | batch-015 §G (bowl physics) |
| 10 | **Recovery crawl** | Dying bey precesses slowly; barely translates | spin<15%: orbit force near zero; bey nearly stationary before spiral | batch-015 §D |
| 11 | **Counter-rotation rebound** | Opposite-spin contact: v_rel = ωA·rA + ωB·rB (additive, gear coupling) → extra bounce | Existing collision system; rubber tip absorbs vs metal tip bounces | batch-015 §F |
| 12 | **Rage burst** | Real bladers give aggressive commands after being knocked back | 10-tick ×2.0 natural force multiplier after heavy-hit stun | design (anime) |

---

## 8. Collision Tiers 0–3

### 8.1 Tier Table

| Tier | Condition | Player ctrl | AI ctrl | Spin transfer | QTE | Rage burst |
|---|---|---|---|---|---|---|
| 0 — Glancing | relSpeed < 50px/s | Normal | Normal | None | No | No |
| 1 — Normal | 50–149px/s | Normal | Normal | Standard formula | No | No |
| 2 — Clash | 150–299px/s + eitherAttacking + avgSpin≥40% | clashBoost spike | Normal | ×1.5 | Yes (0.5s window) | No |
| 3 — Heavy | ≥300px/s | Stunned 350ms | Stunned 80ms | Full formula | Yes (if tier-2 also met) | Yes (10 ticks) |

Stun durations 350ms/80ms: **DESIGN PARAMETER — no batch citation.** Sized so heavy hits
feel impactful for human players while AI recovers quickly.

### 8.2 Recoil vs Absorption (batch-015 §E; batch-006 §2D)

```
recoilFactor = 1 − tip.grip        (hard tip → elastic bounce; metal tip ≈ recoilFactor 0.85)
absorbFactor = tip.grip × 0.30     (rubber tip → steal speed into spin)

Coefficient of restitution e (batch-015 §E):
  rubber contact: e = 0.2–0.4   (inelastic; absorbs energy)
  plastic contact: e = 0.6–0.8  (moderate bounce)
  metal contact:  e = 0.7–0.9   (near-elastic; hard hits)

Rubber-tip bey hitting any bey:
  beyA.spin  += relSpeed × absorbFactor × 0.5
  beyB.spin  -= relSpeed × absorbFactor
  beyA.speed *= (1 − absorbFactor × 0.1)
  beyB.speed *= (1 − absorbFactor × 0.2)
```

Opposite-spin gear coupling amplification (batch-015 §F):
- Opposite spin: `v_rel_surface = ωA·rA + ωB·rB` (additive → large friction → high steal)
- Same spin:     `v_rel_surface = ωA·rA − ωB·rB` (subtractive → near-zero → low steal)
- Rubber CP on AR: ×1.4 spin steal efficiency vs non-rubber (batch-014 §I — gear coupling)

### 8.3 Clash QTE

```
shouldTriggerClashQTE = relSpeed ≥ 150 AND avgSpin ≥ 40% AND eitherAttacking
```

Window: 0.5s. Numbered labels (1–9) appear on opponent beyblades sorted left→right by
screen position. Player selects with keys 1–9, touch buttons, or mouse click.
QTE outcome: winner +20% damage multiplier, loser −10% for this hit.

Server broadcasts `"clash-qte-started" { beyAId, beyBId }`. Client shows labels.
Server receives `"select-target" { targetIndex }` from each participant.

### 8.4 Type-Aware Collision Defense (L-attitude active)

When `playerAttitude === "stamina"` (L held) during a collision:

```
dodgeProb = typeBase + freeSpin × 0.30
  typeBase: stamina=40%, balanced=22%, defense=18%, attack=7%
```

If dodge fires: lateral impulse away from opponent + halve incoming damage for this collision.
Source: batch-006 §2D (freeSpin tip = evasion capability); tip freeSpin values from §4.4 above.

---

## 9. Loss of Control Catalog

| State | Duration | Player ctrl | AI ctrl | Natural force | Recovery |
|---|---|---|---|---|---|
| `comboExecuting` | combo 300–500ms | 0% | 0% | 0% | auto on end |
| `controlLockedUntilMs` | special 500ms / finisher 800ms | 0% | 0% | 0% | auto on expiry |
| `playerControlStun` | heavy hit 350ms | 0% | Normal | Full | auto |
| `aiControlStun` | heavy hit 80ms | Normal | 0% | 0% (pure tumble) | auto |
| `isAirborne` | until landing | reduced (grip=0) | reduced | no orbit | landing lag ~0.3s |
| spin<15% death spiral | until spin=0 | minimal | stabilise mode | death spiral force only | only if special fires in time |
| `inPit` | until eliminated | 0% | 0% | 0% | none (elimination) |
| zone drain (royale) | while outside safe zone | Normal | Normal | Normal | re-enter zone |

---

## 10. Prerequisite Bugs — Cross-Reference Phase 00

> **Audit update 2026-05-24.** Two of the four original bugs are FIXED; one is RESOLVED. Only P0.2 admin-side work remains.

| ID | Bug | Current Status | Action Required |
|---|---|---|---|
| P0.1 | `executeBehavior()` only dispatches `movement.orbit` | ✅ **FIXED** — `ArenaFeatureProcessor.ts` lines 80–100 dispatch all prefixes via `dispatchBehaviorRef()` | None |
| P0.2 | `ComboDoc` has no `effectId` field | 🔧 **PARTIAL** — runtime `ComboResult.effect` tag works; admin form `effectId` picker still absent | Add `effectId` picker to combo admin form |
| P0.3 | Special move schema mismatch | ✅ **RESOLVED** — `src/constants/specialMoves.ts` does not exist; rooms load from Firestore | None |
| P0.4 | `mechanic_defs`, `gimmick_defs`, etc. missing from COLLECTIONS | ✅ **FIXED** — all four in `firebase.ts` lines 65–68 | None |

**Only blocker remaining before Phase 22 implementation:** P0.2 admin-side `effectId` picker (low urgency — runtime works). Phase 22 implementation can begin immediately; the combo admin form fix is independent.

---

## 11. Phase 21 Foundation — New Mechanic Handlers

Per Phase 21 core principle: every behavior is a MechanicRegistry handler, not a standalone
utility. All new behaviors register via existing `MechanicHandlerContext`.

| Mechanic ID | File | Phase 21 pillar | Description | Status |
|---|---|---|---|---|
| `authorityBlend` | `server/physics/mechanics/authorityBlend.ts` | BehaviorDef | Dynamic α computation, lerp, hard overrides, stun checks, arena multiplier | ❌ Not created |
| `steeringForce` | `server/physics/mechanics/steeringForce.ts` | BehaviorDef | Centripetal perpendicular turn; spin cost; fallback at low speed | ❌ Not created |
| `beyDecision` | `server/physics/mechanics/beyDecision.ts` | BehaviorDef | 30–90 tick seeded PRNG timer; five decisions; probability evaluation | ❌ Not created |
| `naturalMotion` | `server/physics/mechanics/naturalMotion.ts` | BehaviorDef (gimmick recipe) | Composes orbitMovement + centerPull + bearingDrift + railLock + steeringForce + beyDecision | ❌ Not created |

All four use existing `MechanicHandlerContext` (bey, arena, all beyblades, physics engine,
seeded PRNG — Phase 11 §2.1). Removing the `naturalMotion` gimmick from a bey in admin
disables its autonomous orbit (Phase 21 "Make Anything" guarantee).

---

## 12. New Schema Fields

```typescript
// Beyblade schema (server/rooms/schema/GameState.ts)
@type("uint8")   controlAuthority: number  = 30;   // α × 100, synced at 60Hz
@type("boolean") clashQTEActive:   boolean = false;
@type("float32") clashQTETimer:    number  = 0;
// rageBurstTicks: NOT on schema — server-side Map<beyId, number> only (saves sync cost)

// ArenaState schema (Phase 23 royale additions)
@type("float32") safeZoneRadius:  number = 0;  // 0 = no zone
@type("float32") safeZoneX:       number = 0;
@type("float32") safeZoneY:       number = 0;
@type("float32") safeZoneTimer:   number = 0;  // seconds until next shrink
@type("uint8")   safeZonePhase:   number = 0;  // 0–4
```

---

## 13. Modified Files Summary

| File | Change |
|---|---|
| `server/shared/utils/bitmask.ts` | Add bits 10–12 (J/K/L attitude) to `PlayerInput` |
| `server/shared/rooms/InputHandler.ts` | `applyBlendedMovement`, `applySteeringForce`, `advanceSpinRotation`, contextual I-key (A/B), type-aware X, arc-dodge C |
| `server/rooms/schema/GameState.ts` | New schema fields per §12 |
| All 4 battle rooms | Hold-timer maps, stun maps, smoothedAlpha, decision system, QTE, rage burst, 2.5D rotation |
| `client/src/game/hooks/useGameInput.ts` | 9-key + mouse+KB + gamepad + touch |
| `client/src/pages/TryoutGamePage.tsx` | Client-side blend + natural motion (no opponents) |
| `client/src/components/game/ControlsLegend.tsx` | 9-key layout + all 4 input sources |
| `client/src/game/renderer/PixiRenderer.ts` | Drift particle trail (angle between velocity and rotation >20°) |
| `client/src/types/arenaConfigNew.ts` | Add `playerAuthorityConfig`, `maxDurationSeconds` |
| `client/src/components/game/ControlBlendBar.tsx` | **NEW** — live α bar (AI% vs Player%), reads `controlAuthority` uint8 |
| `client/src/components/game/TouchControls.tsx` | **NEW** — virtual d-pad + action ring for mobile |

---

## 14. UNKNOWNS (design flags — no batch citation)

1. **Named launch techniques** (Sliding Shoot, Corkscrew Shoot, Upper Launch) — physical effects
   on orbit pattern not found in any batch file. The `launchTilt / launchPosition / launchPower`
   system (Phase 00) is sufficient for now.
2. **Exact tipZ values** at airborne stages — Phase 02 mentions `airborne_launch` and
   `descent_strike` but does not specify tipZ coordinates.
3. **Scraping formula** — edge contact at low spin (spin<40%, tiltAngle>threshold). No
   documented formula. Could use Phase 11 `contactDeflect` mechanic as a base.
4. **Material wear formula** — Evolution tip wear documented in batch-009 as three stages
   (gets MORE aggressive with wear — FACT), but no in-game implementation formula specified.
5. **Heavy-hit stun durations** (350ms player / 80ms AI) — design parameters, not from research.


---

## Implementation Status (audit 2026-05-24)

| Component | Status |
|-----------|--------|
| NaturalMotion.ts (orbit/momentum/death-spiral/stabilisation/rage-burst) | Missing |
| computeAuthority() authority blend | Missing |
| applyBlendedMovement() | Missing |
| applySteeringForce() centripetal perpendicular | Missing |
| BeyDecision handler (seeded PRNG, 5 decisions) | Missing |
| Bitmask bits 10-12 (J/K/L attitude) | Missing |
| Four input sources (mouse+KB, gamepad, touch) | Missing |
| controlAuthority uint8 on Beyblade schema | Missing |
| clashQTEActive / clashQTETimer on schema | Missing |
| Collision tiers 0-3 + QTE window | Missing |
| ControlBlendBar.tsx + TouchControls.tsx | Missing |
| P0.1 BehaviorRef dispatch bug | Fixed |
| P0.3 Special move schema | Fixed |
| P0.4 COLLECTIONS entries | Fixed |

---

[← Phase 21: Unified Foundation](phase-21-unified-foundation.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 23: Battle Modes →](phase-23-battle-modes.md)

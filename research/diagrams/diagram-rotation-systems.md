[← Research Flow](diagram-research-flow.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Script Authoring Flow →](diagram-script-authoring-flow.md)

---

# Diagram: Rotation Systems

> **Stage 0C Diagram 12** — Rule 11: Launch → Main Rotation → Sub-Part → Collision → Mechanics.

```mermaid
flowchart TD
  subgraph "Launch"
    LAUNCH[Match start<br/>spin = maxSpin<br/>angularVelocity set]
  end

  subgraph "Main Spin System"
    SPIN[Beyblade.spin<br/>0 → maxSpin]
    DECAY[spinDecayRate per tick<br/>8×(1-stamina×0.001)]
    MAX_SPIN[maxSpin = ceil(2000×(1+stamina×0.0008))]
    DIR[spinDirection: left|right]
  end

  subgraph "Sub-Part Rotation (PartSystemManager.tick)"
    SUB[subPartSpins MapSchema<br/>per attachment index]
    FREE[freeSpin sub-parts<br/>decay independently]
    BEARING[bearingFriction → spinDecayMod]
    PSM[PartSystemManager.tick()<br/>per-room 2.5D state machine]
  end

  subgraph "Gyro Wobble"
    WOBBLE[stability = spin/maxSpin<br/>if < 0.4 → nutation wobble]
    PRNG_W[seeded PRNG<br/>createPRNG(hashString(matchId))]
    WOBBLE_AMP[wobbleAmplitude increases]
    TILT[beyTiltAngle 0°–360°<br/>0=upright · 90=on-side · 180=on-back · 270=on-head · 360=full-rotation]
  end

  subgraph "Collision Behavior"
    SAME[same-spin clash<br/>spinSteal × 0.5]
    COUNTER[counter-spin clash<br/>spinSteal × 1.5]
    STEAL[spinStealFactor<br/>0.1×(1+stamina×0.02667)]
  end

  subgraph "Counter-Rotation (Dranzer GT)"
    CR[counterRotActive<br/>counterRotStep<br/>counterRotStepTick]
    CR_DIR[spinDirection reversal sequence]
    CR_CLASH[clash multiplier flip during sequence]
  end

  subgraph "Movement → Camera"
    CAM[camera follows active beyblade]
    CAM_SPEC[spectator: click → follow]
    CAM_ZOOM[zoom: +/0/- keyboard]
  end

  LAUNCH --> SPIN
  SPIN --> DECAY
  DECAY --> MAX_SPIN
  SPIN --> SUB
  SPIN --> WOBBLE
  WOBBLE --> PRNG_W
  PRNG_W --> WOBBLE_AMP
  WOBBLE_AMP --> TILT
  DIR --> SAME
  DIR --> COUNTER
  SAME --> STEAL
  COUNTER --> STEAL
  CR --> CR_DIR
  CR_DIR --> CR_CLASH
  SUB --> FREE
  FREE --> BEARING
  PSM --> SUB

  TILT --> CAM
  CR_CLASH --> STEAL
  CAM --> CAM_SPEC
  CAM --> CAM_ZOOM
```

## Spin Stability Thresholds (Phase 22 — updated)

| Stability | Behavior | Engine state |
|-----------|---------|--------------|
| ≥ 100% | Smooth orbit, max grip | α normal; orbitStr maximum |
| 40%–100% | Normal spin, no wobble | Normal orbit + decision system active |
| < 40% | Nutation wobble + stabilisation centring | PRNG wobble forces ON; stabiliseSelf centring force ON (Phase 22 §3.5) |
| < 15% | Death spiral — orbit collapses inward rapidly | Death spiral force: toward centre × 0.001×mass×(0.15−frac)×10 (Phase 22 §3.4; batch-015 §D) |
| 0% | Spin-out elimination | Removed from physics |

## 2.5D Rotation Note (Phase 22)

In 2.5D mode, `beyblade.rotation` is driven by `advanceSpinRotation()`:
```typescript
beyblade.rotation      += angDir * spinFrac * 6 * dt;    // rad/s scaled by spin fraction
beyblade.angularVelocity = angDir * spinFrac * 15;
setAngularVelocity(beyblade.id, 0);                      // zero Matter.js body angle every tick
```
Only `x, y` come from Matter.js in 2.5D. `body.angle` is NOT used for visual rotation.

## Counter-Spin Clash Multiplier

| Spin Match | Steal Multiplier |
|-----------|-----------------|
| Same direction | 0.5× (reduced transfer) |
| Opposite direction | 1.5× (enhanced transfer) |

---

[← Research Flow](diagram-research-flow.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Script Authoring Flow →](diagram-script-authoring-flow.md)

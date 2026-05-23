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

  subgraph "Sub-Part Rotation"
    SUB[subPartSpins MapSchema<br/>per attachment index]
    FREE[freeSpin sub-parts<br/>decay independently]
    BEARING[bearingFriction → spinDecayMod]
  end

  subgraph "Gyro Wobble"
    WOBBLE[stability = spin/maxSpin<br/>if < 0.4 → nutation wobble]
    PRNG_W[seeded PRNG<br/>createPRNG(hashString(matchId))]
    WOBBLE_AMP[wobbleAmplitude increases]
    TILT[beyTiltAngle 0°–90°]
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

  TILT --> CAM
  CR_CLASH --> STEAL
  CAM --> CAM_SPEC
  CAM --> CAM_ZOOM
```

## Spin Stability Thresholds

| Stability | Behavior |
|-----------|---------|
| ≥ 100% | Smooth orbit, max grip |
| 40%–100% | Normal spin, no wobble |
| < 40% | Nutation wobble begins (seeded PRNG forces) |
| 0% | Spin-out elimination |

## Counter-Spin Clash Multiplier

| Spin Match | Steal Multiplier |
|-----------|-----------------|
| Same direction | 0.5× (reduced transfer) |
| Opposite direction | 1.5× (enhanced transfer) |

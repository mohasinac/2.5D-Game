# Diagram 12 — Rotation Systems

Rotation is a core gameplay system. It affects movement, collision, stability, stamina, contact points, momentum, force transfer, spin stealing, special moves, camera, arena interaction, and runtime mechanics.

```mermaid
flowchart TD
  Launch[Launch\nspinDirection = left/right\nspin = initial launch speed\nLaunch angle → velocity direction]

  Launch --> MainRotation[Main Body Rotation\nbey.spin (float32)\nbey.spinDirection (left/right)\nbey.maxSpin (derived from staminaPoints)]

  MainRotation --> SpinDecay[Spin Decay\nspinDecayRate = 8 × (1 - stamina × 0.001)\n6.8–8.0 per second\nwobble when spin < 40% of maxSpin]
  MainRotation --> SpinSteal[Spin Stealing\ncomputeSpinSteal()\nCLASH_MULTIPLIERS dispatch\nspinStealFactor + spinStealResist]
  MainRotation --> SpinEqualization[Spin Equalization\nbidirectional spin_transfer\nbearing_zombie gimmick]
  MainRotation --> CLASH[Clash Multipliers\nsame_spin: dmg=0.8 steal=0.5 recoil=0.6\ncounter_spin: dmg=1.4 steal=1.5 recoil=1.3\nneutral: dmg=1.0 steal=1.0 recoil=1.0]
  MainRotation --> CounterRot[Counter Rotation\ncounterRotActive / counterRotStep / counterRotStepTick\ntickCounterRotation()\nrotation_reverse mechanic]

  MainRotation --> SubRotation[Sub-Part Independent Rotation\nFree-spin ring / bearing / tip]
  SubRotation --> FreeSpin[Free Spin\nfree_spin mechanic\nspinDecayRate↓ + spinStealResist↑\nBearing Driver / Bearing Core parts]
  SubRotation --> BearingRotation[Bearing Rotation (LAD)\nbearing_drift mechanic\nsurfaceFriction↓ + lateral smooth\nLife-After-Death strategy]

  MainRotation --> ContactBehavior[Contact Point Behavior\ngetContactPointMultiplier()\nangle-gated, radial-matched, material-factored]
  ContactBehavior --> CollisionResult[Collision Result\ncomputeContactDamage() + computeSpinSteal()\nATTACK_TYPE_MULTIPLIER + MATERIAL_MULTIPLIERS]

  CollisionResult --> RuntimeMechanics[Mechanic Dispatch\nMechanicRegistry.dispatchCollision()]
  RuntimeMechanics --> Movement[Movement System\napplyKnockback() / applyForce()]
  Movement --> Camera[Camera Layer\ncamera shake on heavy collision]
  Movement --> ArenaInteraction[Arena Interaction\norbit_movement / center_pull / rail_lock]

  MainRotation --> SpinInjection[Spin Injection (Energy Reserve)\ntickSpinInjection()\ncoreReserveRemaining charges\nfires velocity_burst + spin boost]
  SpinInjection --> coreReserve[coreReserveRemaining field\nenergy_reserve mechanic]

  MainRotation --> RotationReversal[Rotation Reversal\nrotation_reverse mechanic\nspinDirection flip at threshold\nor combo trigger]

  MainRotation --> DualSpin[Dual Spin / Direction-Based\nspinDirection = left → left-spin advantage\nCLASH_MULTIPLIERS counter_spin vs same_spin]

  MainRotation --> SynchroCombination[Synchro Combination (MFB Zero-G)\ncombination_lock mechanic\ncombinationLocked + linkedBeyId + linkStrain]
```

## Rotation Behavior Table

| Rotation Type | Object | Trigger | Behavior | Runtime Effect | Confidence |
|--------------|--------|---------|---------|----------------|-----------|
| Main body rotation | Beyblade body | Launch | Primary spin (left or right) | `spin` field decrements at `spinDecayRate` | HIGH (confirmed GameState.ts) |
| Sub-part free spin | Bearing ring / bearing driver | Always | Independent rotation, no spin loss | `free_spin` mechanic: `spinDecayRate`↓ | HIGH (confirmed Burst LAD strategy) |
| Counter-rotation | Full bey (special move) | Combo/special trigger | Spin direction flips per step | `counterRotActive` + `counterRotStep` + `counterRotStepTick` | HIGH (confirmed PartPhysics.ts) |
| Spin injection burst | Core energy gear | Contact threshold | Stored energy fires as velocity + spin boost | `coreReserveRemaining` → `tickSpinInjection()` fire | HIGH (confirmed PartPhysics.ts) |
| Rotation reversal | Full bey | Spin threshold or manual | spinDirection permanently flipped | `rotation_reverse` mechanic → `spinDirection` flip | HIGH (confirmed tickCounterRotation) |
| Bearing drift | Tip/driver bearing | Always (passive) | Reduced surface friction, smooth lateral slide | `bearing_drift` mechanic → `surfaceFriction`↓ | HIGH (confirmed ClimbingPhysics suction) |
| Spin equalization | Two beys in contact | Prolonged contact | Bidirectional spin transfer (both lose) | `spin_equalization` mechanic: bidirectional `computeSpinSteal()` | HIGH (bearing_zombie WBO strategy) |
| Spin steal | Attacker vs defender | Contact | Attacker gains spin, defender loses | `spin_transfer` mechanic + `CLASH_MULTIPLIERS` | HIGH (confirmed computeSpinSteal) |
| Combination lock rotation | Two beys linked | `combinationLocked = true` | Both beys share momentum temporarily | `combination_lock` mechanic + `linkStrain` | HIGH (confirmed PartSystemManager) |
| Left-spin hop | Left-spin bey on contact | Contact with right-spin | Small upward hop from torque differential | jump mechanic (inline, PartSystemManager.onBeyCollision) | MEDIUM (Plastic/HMS meta) |
| Wobble oscillation | Body near spin-out | spin < 40% maxSpin | Seeded PRNG wobble applied | `wobbleAmplitude` + `beyTiltAngle` + `applyForce` | HIGH (confirmed PhysicsEngine + prng.ts) |

## Rotation Component Table

| Component | Rotation Type | Independent | Trigger | Notes |
|-----------|--------------|------------|---------|-------|
| Main body | Primary spin | No | Launch | All beys |
| Bearing tip/driver | Free spin (LAD) | Yes | Always | Burst Bearing Driver, HMS Bearing Base |
| Engine gear inner | Spin injection | Partial (spring) | Contact impact | Plastic Gen V2 Engine Gear parts |
| Counter-rotation gear | Direction reversal | Partial | Combo/special | tickCounterRotation sequence |
| Sub-ring (Zero-G) | Combo-lock sync | No | Proximity lock | MFB Zero-G Synchrome |
| Running core | Mode-switch inner | No | Spin threshold | Plastic Gen V2 Running Core |
| Arena self-rotation | Feature rotation | Yes (arena feature) | selfRotationConfig | SelfRotationConfig in arenaConfigNew.ts |
| Rotating obstacle | Obstacle spin | Yes (physics body) | selfRotation config | Obstacle.selfRotation — functional |
| Projectile spin | Spin axis | Yes | spawn trigger | future projectile mechanic |

## Existing Rotation Support Map

| System | Field / Function | Status |
|--------|----------------|--------|
| Main spin | `bey.spin` + `bey.spinDirection` | ✅ fully implemented |
| Spin decay | `spinDecayRate` formula | ✅ fully implemented |
| Spin steal | `computeSpinSteal()` + `CLASH_MULTIPLIERS` | ✅ fully implemented |
| Counter-rotation | `counterRotActive/Step/StepTick` + `tickCounterRotation()` | ✅ fully implemented |
| Spin injection | `coreReserveRemaining` + `tickSpinInjection()` | ✅ fully implemented |
| Wobble (seeded) | `wobbleAmplitude` + `prng.ts` seeded PRNG | ✅ fully implemented |
| Bearing drift | `computeClimbingForces()` suction type | ✅ partially implemented |
| Spin equalization | `computeSpinSteal()` bidirectional | ⚠️ needs `spin_equalization` mechanic wrapper |
| Left-spin hop | `PartSystemManager.onBeyCollision()` | ⚠️ inline, needs mechanic slot |
| Free spin (LAD) | derived from staminaPoints formula | ⚠️ needs `free_spin` mechanic handler |
| Combination lock | `tickCombinationLock()` | ✅ partially implemented, needs mechanic slot |
| Rotation reversal (mechanic) | `tickCounterRotation()` | ✅ exists, needs `rotation_reverse` mechanic slot |

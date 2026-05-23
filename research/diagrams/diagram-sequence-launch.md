# Diagram 6 — Full Tick Sequence

Full tick sequence from input through state update to client presentation.
All function names are real, discovered in Stage 0A code reading.

```mermaid
sequenceDiagram
  participant Client
  participant Room as BattleRoom.ts
  participant PSM as PartSystemManager.ts
  participant PE as PhysicsEngine.ts
  participant PP as PartPhysics.ts
  participant AFP as ArenaFeatureProcessor.ts
  participant MR as MechanicRegistry (NEW)
  participant GS as GameState / Colyseus Schema

  Client->>Room: onMessage("input", uint16 bitmask)
  Room->>Room: decodeBitmask(mask)\n→ {moveLeft, moveRight, ... specialTap}

  Note over Room: setSimulationInterval 60Hz tick begins

  Room->>PSM: tick(deltaTime)
  PSM->>PSM: tickBey() phase 1 — applyStatModifier()\nActive stat modifiers from SubPart configs
  PSM->>PP: tickSpinInjection(bey, cfg)\n[coreReserveRemaining → spin injection]
  PSM->>PP: tickCounterRotation(bey, cfg)\n[counterRotActive → spinDirection flip]
  PSM->>PSM: tickBey() phase 4 — bearingFriction\nFrom tip part bearing config
  PSM->>PSM: tickBey() phase 5 — jump-core handling
  PSM->>PSM: tickBey() phase 6 — DetachedBody handling
  PSM->>PSM: tickCombinationLock()\n[combinationLocked dual-bey state machine]

  Room->>PE: applyMovementInput(bey, decodedInput)\n[direct force from bitmask — NO Intent Layer yet]
  Room->>PE: applyActionInput(bey, decodedInput)\n[attack/defense/dodge/jump inline]

  PE->>PE: applyMovementForces(bey, dt)\n[Matter.js body forces]

  PE->>PE: detectContact(bey1, bey2)\n[checkBeybladeCollision()]
  PE->>PP: computeSpinSteal(rawSteal, attackerFactor,\ndefenderBearing, defenderResist, clashType)\n[CLASH_MULTIPLIERS dispatch]
  PE->>PP: computeContactDamage(baseDamage,\nattackerSpinDir, defenderSpinDir, approachAngle)\n[angle-blended]
  PE->>PE: getContactPointMultiplier()\n[radial-matched, material-factored]
  PE->>PE: applyKnockback(id, magnitude, angle)

  PE->>PE: checkLoopCollision()\ncheckWaterCollision()\ncheckPitCollision()\ncheckObstacleCollision()\nisOutOfBounds()

  Room->>AFP: processArenaFeatures(arenaState, beys, dt)\n12-step pipeline:
  AFP->>AFP: step 1–6: loop/water/pit/obstacle/wall/obstacle-physics
  AFP->>AFP: step 7–10: floor hazards / elevation / effect / env effects
  AFP->>AFP: step 11: Spin zones → orbit_movement forces
  AFP->>AFP: step 12: Gravity holes → center_pull forces + Bumps → spring_recoil

  AFP->>AFP: executeBehavior(behaviorId, params)\n[movement.orbit: handled ✅]\n[all other BehaviorRef: UNHANDLED ❌ → MR dispatch in Stage 11]

  Note over Room,MR: Stage 11 adds MechanicRegistry dispatch here:
  Room->>MR: dispatchTick(bey, physicsContext, dt)\n[no-op when mechanics[] empty — backward compat]
  Room->>MR: dispatchCollision(bey1, bey2, collisionResult)\n[no-op when mechanics[] empty]
  MR->>MR: select adapter by engineMode\n[2d / 2.5d / 3d]
  MR->>MR: handler.onTick() / handler.onCollision()

  PSM->>PSM: tickBey() phase 7 — computeClimbingForces(bey, arena, dt)\n[adhesion + wall-climb]
  PSM->>PSM: tickBey() phase 8 — updateBeyTilt(bey, impactForce, dt)\n[beyTiltAngle + wobbleAmplitude]

  Room->>Room: checkComboWindow(bey, decodedInput)\n[detectCombo() sliding-3 window check]
  Room->>Room: checkSpecialMove(bey, decodedInput)\n[specialTap + power threshold]

  Room->>Room: checkKOConditions()\n[spin-out / burst / ring-out / pit]
  Room->>Room: updateGameStatus()

  Room->>GS: Schema state updated (all @type fields)
  GS->>Client: Colyseus schema patch (60Hz diff sync)

  Client->>Client: onStateChange handler\ninterpret delta as presentation cues:
  Client->>Client: Camera: shake / zoom / cut\nbased on state change magnitude
  Client->>Client: Audio: SFX / sting\nbased on event type
  Client->>Client: Effects: particles / trails / flash\nbased on combo/special/KO flags
```

## Tick Loop Order (20-Step — BattleRoom.ts confirmed)

| Step | Operation | Function |
|------|-----------|---------|
| 1 | Process pending inputs | `decodeBitmask()` per player |
| 2 | PSM tick (8-phase) | `partSystemManager.tick()` |
| 3 | Apply movement forces | `applyMovementInput()` |
| 4 | Apply action forces | `applyActionInput()` |
| 5 | Physics step | Matter.js `Engine.update()` |
| 6 | Contact detection | `checkBeybladeCollision()` |
| 7 | Contact resolution | `computeSpinSteal()` + `computeContactDamage()` |
| 8 | Knockback application | `applyKnockback()` |
| 9 | Zone checks | `checkLoopCollision()` ... `isOutOfBounds()` |
| 10 | Arena features | `processArenaFeatures()` |
| 11 | BehaviorRef execution | `executeBehavior()` (partial) |
| 12 | MechanicRegistry tick (NEW) | `MechanicRegistry.dispatchTick()` |
| 13 | MechanicRegistry collision (NEW) | `MechanicRegistry.dispatchCollision()` |
| 14 | Climbing forces | within PSM phase 7 |
| 15 | Tilt update | within PSM phase 8 |
| 16 | Combo window check | `detectCombo()` |
| 17 | Special move check | `checkSpecialMove()` |
| 18 | KO condition check | `checkKOConditions()` |
| 19 | Game status update | `updateGameStatus()` |
| 20 | Schema sync | Colyseus auto-patch to clients |

# Diagram 1 — Engine Capabilities Map

Full map of existing engine capabilities. All nodes represent real, discovered entities from Stage 0A code reading.

```mermaid
graph TD
  subgraph Schema["GameState Schema (GameState.ts)"]
    GS[GameState]
    AS[ArenaState]
    BEY[Beyblade]

    GS --> BEY
    GS --> AS

    BEY --> BaseStats["Base Stats\nattackPoints / defensePoints / staminaPoints\nmass / radius / spinDirection"]
    BEY --> RuntimeMods["Runtime Modifiers\naggressiveness / gripFactor / recoilFactor\nspinStealFactor / surfaceFriction\ncontactDamageMultiplier / damageReduction\nburstResistance / wobbleAmplitude"]
    BEY --> ComboState["Combo + Special State\ncomboDamageMultiplier / comboDamageMultiplierTimer\ncomboSlots / comboPhase / comboChargeScale\nattackBuffTimer / defenseBuffTimer / dodgeBuffTimer"]
    BEY --> SpinState["Spin + Energy State\ncoreReserveRemaining\ncounterRotActive / counterRotStep / counterRotStepTick"]
    BEY --> TwoDState["2.5D State\nbeyTiltAngle / adhering\nadheringSurfaceAngle / wallClimbing\nairborne / effectiveGravity"]
    BEY --> LockState["Combination Lock\ncombinationLocked / linkedBeyId\ncombinationType / linkStrain"]
    BEY --> ElementState["Element Types\nelementTypes ArraySchema"]

    AS --> ArenaFields["Arena Fields\narenaId / switchStates\nfeatureStates / selfRotationAngles"]
    GS --> MatchState["Match State\nstatus / winner / phase\ntargetWins / currentGame / seriesWins\nspectatorCount"]
  end

  subgraph Physics["Physics Layer"]
    PE[PhysicsEngine.ts]
    PP[PartPhysics.ts]
    CP[ClimbingPhysics.ts]
    PSM[PartSystemManager.ts]

    PE --> checkBeyCol["checkBeybladeCollision()\nMatter.js overlap → CollisionResult"]
    PE --> calcDmg["calculateCollisionDamage()\ncontact-point + material multiplier pipeline"]
    PE --> zoneChecks["checkLoopCollision()\ncheckWaterCollision()\ncheckPitCollision()\ncheckObstacleCollision()\nisOutOfBounds()"]
    PE --> forces["applyForce() / applyKnockback()\napplyLateralForce()\ngetContactPointMultiplier()"]

    PP --> tickSpin["tickSpinInjection(bey, cfg)\nReads: coreReserveRemaining + spin\nWrites: spin↑ + coreReserveRemaining↓"]
    PP --> tickCounterRot["tickCounterRotation(bey, cfg)\nReads: counterRotActive/Step/Tick\nWrites: spinDirection flip + spin mod"]
    PP --> computeSteal["computeSpinSteal()\nModulated by CLASH_MULTIPLIERS"]
    PP --> computeDmg["computeContactDamage()\nAngle-blended, pure function"]
    PP --> applyStatMod["applyStatModifier(bey, mod)\nSupports: add / multiply / set\nOn: whitelisted stat fields"]
    PP --> isTrigger["isTriggerMet()\nspin_threshold / impact_threshold\ntilt_threshold / special_move / timer"]

    PP --> CLASH["CLASH_MULTIPLIERS\nsame_spin: dmg=0.8 steal=0.5 recoil=0.6\ncounter_spin: dmg=1.4 steal=1.5 recoil=1.3\nneutral: dmg=1.0 steal=1.0 recoil=1.0"]
    PP --> MATERIAL["MATERIAL_MULTIPLIERS\nabs / rubber / metal / pom / polycarbonate"]
    PP --> ATTACK_TYPE["ATTACK_TYPE_MULTIPLIER\nsmash=1.3 upper=1.15 burst=1.5\nabsorb=0.5 spin_steal=0.7"]

    CP --> climbing["computeClimbingForces(bey, arena, dt)\nAdhesion + wall-climb forces\nReads/writes: adhering + wallClimbing\neffectiveGravity + adheringSurfaceAngle"]
    CP --> tilt["updateBeyTilt(bey, impactForce, dt)\nWrites: beyTiltAngle + wobbleAmplitude"]

    PSM --> tickBey["tickBey() — 8-phase pipeline\n1. Active stat modifiers\n2. Spin injection\n3. Counter-rotation\n4. Bearing friction\n5. Jump-core\n6. DetachedBody\n7. Climbing forces\n8. Tilt update"]
    PSM --> combLock["tickCombinationLock()\nDual-bey lock/unlock state machine"]
    PSM --> beyCol["onBeyCollision()\nSubpart switch eval + detach triggers"]
    PSM --> regBey["registerBey()\nInit: coreReserveRemaining + defaultSpinDir\n+ climbing stats + effective comboIds"]
  end

  subgraph Arena["Arena Feature Layer"]
    AFP[ArenaFeatureProcessor.ts]

    AFP --> pipeline["processArenaFeatures() 12-step:\n1. Loop zones  2. Water zones\n3. Pit zones   4. Obstacles\n5. Wall col.   6. Obstacle physics\n7. Floor hazards  8. Elevation zones\n9. Effect zones  10. Env effects\n11. Spin zones  12. Gravity holes+bumps"]
    AFP --> execBehavior["executeBehavior(behaviorId, params)\nOnly movement.orbit handled ✅\nAll other BehaviorRef types UNHANDLED ❌"]
  end

  subgraph Combos["Combo + Special Layer"]
    CC[combos.ts — 8 combos]
    SM[specialMoves.ts — 5 moves]
    CTC[comboTaskCompiler.ts]

    CTC --> emittedRefs["Emitted BehaviorRef types:\nfactor.boost / transform.become_*\nspawn.* / movement.*\nposition.swap_with / arena.effect.*\nAll UNHANDLED at runtime ❌"]

    CC --> ComboEffect["ComboEffect:\ndamageMultiplier / forceImpulse\ndashDirection / durationMs\nlockMs / microSpinBoost / spinStealBonus"]
    SM --> SpecialDef["SpecialMoveDef:\nid / name / kind / iconEmoji\ncooldownSec / durationMs\neffects{linearImpulse, spinDelta,\ninvulnerabilityMs, spinStealRadiusPx,\naoeRadiusPx, knockbackImpulse}\nflashColor\nNo steps[] chain yet ❌"]
  end

  subgraph Determinism["Deterministic Systems"]
    PRNG["prng.ts createPRNG(seed) ✅"]
    HASH["hashString.ts matchId→seed ✅"]
    TICK["60Hz setSimulationInterval ✅"]
    SYNC["Colyseus schema auto-sync ✅"]
  end

  subgraph Absent["Confirmed Absent — Needs Implementation"]
    MREG["MechanicRegistry ❌"]
    MINST["MechanicInstance schema ❌"]
    GREG["GIMMICK_REGISTRY ❌"]
    GEXP["gimmickExpander.ts ❌"]
    RAIL["xtremeEngaged + rail fields ❌"]
    SCORE["scoringMode + playerPoints ❌"]
    INTENT["Intent Layer ❌"]
    AUTOCAM["Automatic Camera ❌"]
    SCRIPT["Visual Scripting ❌"]
    GIDS["gimmickIds + systemId on bey data ❌"]
    STEPS["steps[] on SpecialMoveDef ❌"]
  end
```

## MechanicRegistry Draft Slot Assignments

| Existing Function | Draft MechanicRegistry ID | File |
|-------------------|--------------------------|------|
| `tickSpinInjection()` | `energy_reserve` | PartPhysics.ts |
| `tickCounterRotation()` | `rotation_reverse` | PartPhysics.ts |
| `computeSpinSteal()` | `spin_transfer` | PartPhysics.ts |
| `computeContactDamage()` (angle) | `contact_deflect` | PartPhysics.ts |
| `applyStatModifier()` | `mode_switch` dispatcher | PartPhysics.ts |
| `computeClimbingForces()` suction | `bearing_drift` | ClimbingPhysics.ts |
| `processArenaFeatures()` spin zones | `orbit_movement` | ArenaFeatureProcessor.ts |
| `processArenaFeatures()` gravity wells | `center_pull` | ArenaFeatureProcessor.ts |
| `processArenaFeatures()` bumps | `spring_recoil` | ArenaFeatureProcessor.ts |
| `tickCombinationLock()` | `combination_lock` | PartSystemManager.ts |
| BattleRoom.ts spin.drain_target (partial) | `spin_transfer` | BattleRoom.ts |
| NEW: rail proximity detection | `rail_lock` | new mechanics/movement.ts |
| NEW: weight + inertia modifier | `weight_shift` | new mechanics/contact.ts |
| NEW: free spin (bearing) | `free_spin` | new mechanics/spin.ts |
| NEW: rubber contact friction | `rubber_grip` | new mechanics/contact.ts |
| NEW: threshold-based mode change | `spin_threshold_switch` | new mechanics/mode.ts |
| NEW: bidirectional spin equalization | `spin_equalization` | new mechanics/spin.ts |
| NEW: burst resistance dynamic | `burst_suppress` | new mechanics/mode.ts |
| NEW: glancing spin steal | `spin_steal_coupling` | new mechanics/contact.ts |
| NEW: radial velocity impulse | `velocity_burst` | new mechanics/energy.ts |
| NEW: attack multiplier + timer | `attack_amplifier` | new mechanics/energy.ts |
| NEW: stamina recovery per tick | `stamina_recovery` | new mechanics/spin.ts |
| NEW: surfaceFriction override | `surface_friction_modifier` | new mechanics/mode.ts |
| NEW: orbit tangent force | (wraps existing AFP orbit) | new mechanics/movement.ts |
| NEW: center-pull radial force | (wraps existing AFP gravity) | new mechanics/movement.ts |

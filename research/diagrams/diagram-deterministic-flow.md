# Diagram: Deterministic Simulation Flow

> **Stage 0C Diagram 14** — Rule 13: Input → Intent → FixedTick → Mechanic Dispatch → Deterministic Simulation → State → Presentation.

```mermaid
flowchart TD
  subgraph "Input Layer"
    I_KB[Keyboard bitmask uint16]
    I_AI[AIController.computeInput()]
    I_MSG[onMessage handler<br/>decodeBitmask()]
  end

  subgraph "Intent Layer"
    INT_MOV[Movement intent<br/>applyMovementInput()]
    INT_ACT[Action intent<br/>applyActionInput()]
    INT_CHG[Charge intent]
    INT_SPEC[Special tap intent]
    INT_COMBO[Combo key sequence]
  end

  subgraph "Fixed-Tick Gate (60Hz)"
    TICK[setSimulationInterval<br/>deltaTime = 1000/60 ms]
    CTRL_LOCK[controlLockedUntilMs check<br/>blocks movement if locked]
    SYNC[Colyseus auto-sync after tick]
  end

  subgraph "Mechanic Dispatch"
    MD_FORCE[computeForceMagnitude()<br/>→ Matter.Body.applyForce()]
    MD_SPECIAL[SpecialMoveSystem.tick()<br/>5-phase state machine]
    MD_COMBO[detectCombo() + detectTriggerCombos()<br/>→ ComboResult]
    MD_ARENA[ArenaFeatureProcessor<br/>processArenaFeatures()]
    MD_SPIN[spin decay + wobble PRNG]
    MD_COLLISION[Matter.Events 'collisionStart'<br/>→ handleCollision()]
    MD_MODIFIER[RoundModifierSystem<br/>activeModifierIds → MODIFIER_MAP]
    MD_AI[AIController.computeInput()<br/>per-bey if isAI]
    MD_BEHAVIOR[executeBehavior()<br/>→ MechanicRegistry dispatch<br/>31 namespaced handlers]
    MD_GIMMICK[GimmickExpander<br/>gimmickIds → MechanicInstance[]]
  end

  subgraph "Deterministic Core"
    DC_PRNG[createPRNG(hashString(matchId))<br/>seeded — same seed = same sequence]
    DC_MATTER[Matter.Engine.update()<br/>fixed step physics]
    DC_STAT[StatDelta application<br/>29-key numeric modifier system]
    DC_ELEMENT[ElementTypeLoader<br/>computeDynamicTypeMultiplier()]
  end

  subgraph "State Snapshot"
    SS_BEY[Beyblade position/spin/health/flags]
    SS_ARENA[ArenaState hazards/projectiles/walls]
    SS_GAME[GameState status/seriesWins/roundNum]
    SS_MECHANIC[MechanicInstance[] active mechanics]
    SS_SCHEMA[Colyseus @Schema auto-patch]
  end

  subgraph "Presentation"
    PR_PIXI[PixiJS 7-layer render<br/>arena→features→beyblades→detached→particles→HUD]
    PR_HUD[HUD: health/spin/power/combo]
    PR_PARTICLE[ParticleSystem collision sparks]
    PR_AUDIO[AudioManager positional SFX]
    PR_LOADING[LoadingProgress stepper]
  end

  I_KB --> I_MSG
  I_AI --> INT_MOV
  I_MSG --> INT_MOV
  I_MSG --> INT_ACT
  I_MSG --> INT_CHG
  I_MSG --> INT_SPEC
  I_MSG --> INT_COMBO

  INT_MOV --> CTRL_LOCK
  INT_ACT --> TICK
  INT_CHG --> TICK
  INT_SPEC --> TICK
  INT_COMBO --> TICK
  CTRL_LOCK --> TICK

  TICK --> MD_FORCE
  TICK --> MD_SPECIAL
  TICK --> MD_COMBO
  TICK --> MD_ARENA
  TICK --> MD_SPIN
  TICK --> MD_AI
  TICK --> MD_MODIFIER
  TICK --> MD_GIMMICK

  MD_FORCE --> DC_MATTER
  MD_SPECIAL --> DC_STAT
  MD_COMBO --> DC_STAT
  MD_COMBO --> MD_BEHAVIOR
  MD_ARENA --> MD_BEHAVIOR
  MD_ARENA --> DC_MATTER
  MD_SPIN --> DC_PRNG
  DC_PRNG --> DC_MATTER
  MD_COLLISION --> DC_STAT
  MD_COLLISION --> DC_ELEMENT
  DC_MATTER --> MD_COLLISION
  MD_GIMMICK --> SS_MECHANIC

  DC_STAT --> SS_BEY
  DC_ELEMENT --> SS_BEY
  DC_MATTER --> SS_BEY
  MD_MODIFIER --> SS_GAME
  MD_ARENA --> SS_ARENA
  MD_BEHAVIOR --> SS_BEY
  SS_BEY --> SS_SCHEMA
  SS_ARENA --> SS_SCHEMA
  SS_GAME --> SS_SCHEMA
  SS_MECHANIC --> SS_SCHEMA

  SS_SCHEMA --> SYNC
  SYNC --> PR_PIXI
  SYNC --> PR_HUD
  SYNC --> PR_PARTICLE
  SYNC --> PR_AUDIO
  SYNC --> PR_LOADING
```

## Determinism Guarantees

| Mechanism | How it's deterministic |
|-----------|----------------------|
| PRNG | `createPRNG(hashString(matchId))` — seeded, sequential |
| Matter.js | Fixed 1000/60 ms steps — no wall-clock drift |
| Collision order | Matter.js event order is deterministic for same inputs |
| AI inputs | `computeInput()` is pure function of game state |
| Element multipliers | `computeDynamicTypeMultiplier()` is pure function |
| MechanicRegistry | All 31 handlers are pure functions of beyblade + arena state |

## Non-Determinism Sources (known)

| Source | Reason |
|--------|--------|
| `Date.now()` calls in state machine | Wall-clock for cooldown timers — intentional |
| Network jitter | Client prediction not implemented; all authority on server |
| Firestore load order | `onCreate` async loads are best-effort ordered |

## Tick Execution Order (per 60Hz step)

1. `AIController.computeInput()` — update AI bitmask inputs
2. `applyMovementInput()` — apply force from input bitmask
3. `applyActionInput()` — apply buffs/jump/dodge
4. `SpecialMoveSystem.tick()` — advance special move state machine
5. `detectCombo()` + `detectTriggerCombos()` — check combo windows
6. `Matter.Engine.update()` — step physics
7. `handleCollision()` — process collision events
8. `ArenaFeatureProcessor.processArenaFeatures()` — hazard effects → MechanicRegistry
9. `RoundModifierSystem` — apply active modifiers
10. Spin decay + wobble PRNG
11. Sub-part spin decay (PartSystemManager.tick())
12. `CombinationLock.tick()` — link strain update
13. Colyseus auto-patch schema to clients

---
[← Data Flow](diagram-data-flow.md) &nbsp;�&nbsp; [↑ Index](../INDEX.md) &nbsp;�&nbsp; [Engine Capabilities →](diagram-engine-capabilities.md)

# Diagram: Script Execution

> **Stage 0C Diagram 17** — Rule 15: CoreSimulation → CoreMechanics → CompositionBlocks → ScriptDefinitions → Presentation → Renderer.

```mermaid
flowchart TD
  subgraph "Core Simulation (Matter.js)"
    CS_BODY[Body positions + velocities]
    CS_FORCES[Applied forces per tick]
    CS_COLLISION[collisionStart events]
    CS_STEP[Engine.update() 60Hz fixed]
  end

  subgraph "Core Mechanics (PhysicsEngine)"
    CM_SPIN[Spin decay<br/>spinDecayRate × deltaTime]
    CM_HEALTH[Health reduction<br/>damageMultiplier × damageTaken]
    CM_SPINDIR[Spin direction clash<br/>same ×0.5 / counter ×1.5]
    CM_MATERIAL[5-material table<br/>abs/rubber/metal/pom/pc]
    CM_WOBBLE[PRNG wobble<br/>if spin/maxSpin < 0.4]
    CM_SUBPART[Sub-part spin<br/>freeSpin / bearingFriction<br/>PartSystemManager.tick()]
    CM_COUNTER[Counter-rotation sequence<br/>Dranzer GT counterRotActive]
    CM_ELEMENT[ElementType multipliers<br/>computeDynamicTypeMultiplier()]
  end

  subgraph "Composition Blocks"
    CB_ARENA[ArenaFeatureProcessor<br/>hazard + zone effects]
    CB_MODIFIER[RoundModifierSystem<br/>activeModifierIds → MODIFIER_MAP]
    CB_COMBINATION[CombinationLock<br/>stack/helical/tandem/cluster]
    CB_BEHAVIOR[executeBehavior()<br/>→ MechanicRegistry dispatch<br/>✅ 31 handlers wired<br/>movement.* / factor.* / transform.*<br/>spawn.* / arena.*]
    CB_DETACHED[DetachedBodySchema<br/>sub-part projectile lifecycle<br/>projectile → obstacle → removed]
    CB_GIMMICK[GimmickExpander<br/>gimmickIds → MechanicInstance[]<br/>per-bey active mechanics]
  end

  subgraph "Script Definitions (loaded at onCreate)"
    SD_SPECIAL[SpecialMoveConfig<br/>phases + steps + QTE gate]
    SD_EFFECT[ComboEffectDef<br/>compiled BehaviorRef[] + triggers]
    SD_COMBO[ComboDoc<br/>sequence + cost + type + effectId]
    SD_ROUND[RoundModifierDef<br/>activeModifierIds applied]
    SD_GIMMICK[GimmickDefs via behavior_defs<br/>gimmickIds resolved at onCreate]
  end

  subgraph "Script Execution State Machines"
    SM_SPECIAL[SpecialMoveSystem.tick()<br/>idle→windup→executing→bleed→cooldown]
    SM_COMBO[detectCombo() + perComboCooldown<br/>3-key sliding window]
    SM_TRIGGER[detectTriggerCombos()<br/>6 trigger condition checks per tick]
    SM_CONTROL[controlLockedUntilMs<br/>source: "special" | "combo"]
  end

  subgraph "Presentation Layer"
    PL_SCHEMA[Colyseus @Schema auto-patch<br/>delta sent to all clients]
    PL_PIXI[PixiJS 7-layer render<br/>arena→features→beyblades→detached→particles→HUD]
    PL_HUD[HUD components<br/>ComboHUD / SpecialMoveHUD / CameraControls]
    PL_AUDIO[AudioManager<br/>positional SFX per event]
    PL_PARTICLE[ParticleSystem<br/>collision sparks / special effects]
  end

  subgraph "Renderer (PixiRenderer.ts)"
    RD_ARENA[arenaLayer<br/>background + hazards + self-rotation]
    RD_FEAT[featureLayer<br/>obstacles/pits/portals/turrets/water/loops]
    RD_BEY[beybladeLayer<br/>sprite + tilt + shadow + glow]
    RD_DETACHED[detachedBodyLayer<br/>projectiles / mini_bey / fragments]
    RD_PARTICLE_RENDER[particleLayer<br/>animated effects + meteor zones]
    RD_HUD_RENDER[hudLayer (screen space)<br/>health bars / spin rings / power meter]
  end

  CS_STEP --> CM_SPIN
  CS_STEP --> CM_HEALTH
  CS_COLLISION --> CM_SPINDIR
  CS_COLLISION --> CM_MATERIAL
  CS_COLLISION --> CM_ELEMENT
  CS_FORCES --> CM_WOBBLE
  CM_SUBPART --> CS_FORCES
  CM_COUNTER --> CM_SPINDIR

  CM_SPIN --> CB_ARENA
  CM_HEALTH --> CB_ARENA
  CM_SPINDIR --> CB_COMBINATION
  CM_MATERIAL --> CB_COMBINATION
  CM_WOBBLE --> CS_FORCES

  CB_ARENA --> CB_BEHAVIOR
  CB_MODIFIER --> CB_ARENA
  CB_COMBINATION --> CB_DETACHED
  CB_GIMMICK --> CB_BEHAVIOR

  SD_SPECIAL --> SM_SPECIAL
  SD_EFFECT --> SM_COMBO
  SD_EFFECT --> SM_TRIGGER
  SD_COMBO --> SM_COMBO
  SD_ROUND --> CB_MODIFIER
  SD_GIMMICK --> CB_GIMMICK

  SM_SPECIAL --> SM_CONTROL
  SM_COMBO --> SM_CONTROL
  SM_TRIGGER --> SM_COMBO
  SM_CONTROL --> CS_FORCES

  CB_BEHAVIOR --> PL_SCHEMA
  SM_SPECIAL --> PL_SCHEMA
  SM_COMBO --> PL_SCHEMA
  CM_SPIN --> PL_SCHEMA
  CM_HEALTH --> PL_SCHEMA
  CB_DETACHED --> PL_SCHEMA

  PL_SCHEMA --> PL_PIXI
  PL_SCHEMA --> PL_HUD
  PL_SCHEMA --> PL_AUDIO
  PL_SCHEMA --> PL_PARTICLE

  PL_PIXI --> RD_ARENA
  PL_PIXI --> RD_FEAT
  PL_PIXI --> RD_BEY
  PL_PIXI --> RD_DETACHED
  PL_PARTICLE --> RD_PARTICLE_RENDER
  PL_HUD --> RD_HUD_RENDER
```

## Execution Priority Order (per tick)

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
11. `PartSystemManager.tick()` — sub-part spin decay + 2.5D state
12. `CombinationLock.tick()` — link strain update
13. Colyseus auto-patch schema to clients

## Script Load Points

| Script Type | Loaded At | Cache Location |
|------------|-----------|---------------|
| `SpecialMoveConfig` | `onCreate` | `this.specialMoveCache` |
| `ComboEffectDef` | `onCreate` | `this.comboEffectCache` |
| `ComboDoc` | `onCreate` | `this.comboCache` |
| `ArenaConfig` | `onCreate` | `this.arenaCache` |
| `RoundModifierDef` | `onCreate` (via MODIFIER_MAP constant) | in-memory map |
| `ElementTypeMatrix` | `onCreate` | `ElementTypeLoader` singleton |
| `GimmickDefs` | `onCreate` (via gimmickExpander) | `MechanicInstance[]` per beyblade |

---
[← Script Authoring Flow](diagram-script-authoring-flow.md) &nbsp;�&nbsp; [↑ Index](../INDEX.md) &nbsp;�&nbsp; [Sequence Launch →](diagram-sequence-launch.md)

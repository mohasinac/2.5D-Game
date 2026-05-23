# Diagram: Script Authoring Flow

> **Stage 0C Diagram 16** — Rule 15: ScratchEditor/NodeEditor/RawEditor → EditorGraph → ScriptDefinition → Validation → Compilation → CompositionBlocks → RuntimePackage → Engine.

```mermaid
flowchart TD
  subgraph "Authoring Surfaces (Admin UI)"
    ED_SCRATCH[Step-list editor<br/>ordered ComboTask rows]
    ED_NODE[Node graph editor<br/>❌ not built — future]
    ED_RAW[Raw JSON editor<br/>ComboTask[] direct input]
  end

  subgraph "Editor Representation"
    EG_TASKS[ComboTask[]<br/>action + payload + timing + condition]
    EG_SLOTS[BeybladeComboSlot[]<br/>sequence + effectId + condition]
    EG_STEPS[SpecialMoveStep[]<br/>comboEffectId + timing + windup/bleed]
  end

  subgraph "Script Definition Types"
    SD_EFFECT[ComboEffectDef<br/>id, name, tasks[], triggers[]]
    SD_SPECIAL[SpecialMoveConfig<br/>steps[], locksDurationTicks, powerCost<br/>windupTicks, bleedTicks, cancelableByQTE]
    SD_COMBO[ComboDoc<br/>sequence[3], cost, type, effectId]
  end

  subgraph "Validation Layer"
    VL_STAT[Stat sum ≤ 360, per-stat max 150]
    VL_SEQ[Sequence exactly 3 keys]
    VL_REF[Foreign key: effectId exists in combo_effects]
    VL_COST[Cost ∈ {0, 15, 25, 35}]
    VL_EFFECT[ComboEffect ceiling:<br/>damageMultiplier ≤ 1.5<br/>lockMs ≤ 300<br/>no invulnerability / AoE / full spin recovery]
    VL_TASK[ComboTask action ∈ multiplier|transformation|spawning|movement|arena_effect]
  end

  subgraph "Compilation (save-time)"
    CC_COMPILER[ComboTaskCompiler.compileAction()<br/>ComboTask → BehaviorRef[]]
    CC_MULT[multiplier → factor.* BehaviorRef]
    CC_TRANS[transformation → transform.* BehaviorRef]
    CC_SPAWN[spawning → spawn.* BehaviorRef]
    CC_MOV[movement → movement.* BehaviorRef]
    CC_ARENA[arena_effect → arena.* BehaviorRef]
  end

  subgraph "Composition Blocks"
    CB_BEHREF[BehaviorRef[]<br/>behaviorId + params]
    CB_TRIGGER[ComboTrigger[6 types]<br/>on_hit_received, on_near_ring_out<br/>on_low_spin, on_partner_near_ring_out<br/>on_opponent_special_move, on_burst_attempt]
    CB_TIMING[ComboTiming<br/>sequential|parallel|delayed|looping|conditional]
    CB_COND[ComboCondition<br/>spinThreshold/healthThreshold/partnerId checks]
  end

  subgraph "Runtime Package (Firestore)"
    RP_EFFECT[combo_effects collection<br/>compiled BehaviorRef[] stored]
    RP_SPECIAL[special_moves collection<br/>SpecialMoveConfig stored]
    RP_COMBO[combos collection<br/>sequence + cost + effectId stored]
    RP_BEY[beyblade_stats<br/>specialMoveId + comboIds[] refs]
  end

  subgraph "Engine Runtime"
    ER_DETECT[detectCombo() / detectTriggerCombos()]
    ER_DISPATCH[executeBehavior()<br/>→ MechanicRegistry<br/>✅ 31 namespaced handlers<br/>movement.* / factor.* / transform.*<br/>spawn.* / arena.*]
    ER_SPECIAL[SpecialMoveSystem.tick()<br/>5-phase state machine]
    ER_STAT[StatDelta application<br/>29 numeric keys]
  end

  ED_SCRATCH --> EG_TASKS
  ED_RAW --> EG_TASKS
  ED_NODE --> EG_TASKS
  EG_TASKS --> SD_EFFECT
  EG_SLOTS --> SD_COMBO
  EG_STEPS --> SD_SPECIAL

  SD_EFFECT --> VL_EFFECT
  SD_EFFECT --> VL_TASK
  SD_COMBO --> VL_SEQ
  SD_COMBO --> VL_COST
  SD_COMBO --> VL_REF

  VL_EFFECT --> CC_COMPILER
  VL_TASK --> CC_COMPILER
  VL_SEQ --> RP_COMBO
  VL_COST --> RP_COMBO
  VL_REF --> RP_COMBO

  CC_COMPILER --> CC_MULT
  CC_COMPILER --> CC_TRANS
  CC_COMPILER --> CC_SPAWN
  CC_COMPILER --> CC_MOV
  CC_COMPILER --> CC_ARENA

  CC_MULT --> CB_BEHREF
  CC_TRANS --> CB_BEHREF
  CC_SPAWN --> CB_BEHREF
  CC_MOV --> CB_BEHREF
  CC_ARENA --> CB_BEHREF

  CB_BEHREF --> RP_EFFECT
  CB_TRIGGER --> RP_EFFECT
  CB_TIMING --> RP_EFFECT
  CB_COND --> RP_EFFECT
  SD_SPECIAL --> RP_SPECIAL

  RP_EFFECT --> ER_DETECT
  RP_SPECIAL --> ER_SPECIAL
  RP_COMBO --> ER_DETECT
  RP_BEY --> ER_DETECT

  ER_DETECT --> ER_DISPATCH
  ER_SPECIAL --> ER_DISPATCH
  ER_DISPATCH --> ER_STAT
```

## ComboTask Action → BehaviorRef Mapping

| ComboTask action | Compiled behaviorId prefix | Runtime wired? |
|-----------------|--------------------------|---------------|
| `multiplier` | `factor.*` (attackAmplifier, defenseStance, etc.) | ✅ MechanicRegistry |
| `transformation` | `transform.*` | ✅ MechanicRegistry |
| `spawning` | `spawn.*` | ✅ MechanicRegistry |
| `movement` | `movement.*` (orbit, dash, railLock, etc.) | ✅ MechanicRegistry |
| `arena_effect` | `arena.*` | ✅ MechanicRegistry |

## MechanicRegistry — 31 Registered Handlers

| Namespace | Handlers |
|-----------|---------|
| movement | orbitMovement, railLock, upperLaunch, zeroGFloat, weightShift |
| factor | attackAmplifier, barrageHit, spinTransfer, spinEqualization, smashImpact, springRecoil, magneticPull, centerPull |
| transform | modeSwitch, rotationReverse, subPartBurst |
| contact | contactDeflect, contactHeightGate, rubberGrip, surfaceFrictionModifier |
| spin | freeSpin, bearingDrift, spinStealCoupling, spinThresholdSwitch, spinDirectionBonus, staminaRecovery, revivalSpin, burstSuppress |
| defense | defenseStance, energyReserve |
| arena | (via arena_effect BehaviorRef) |

---
[← Rotation Systems](diagram-rotation-systems.md) &nbsp;�&nbsp; [↑ Index](../INDEX.md) &nbsp;�&nbsp; [Script Execution →](diagram-script-execution.md)

[← Input Abstraction](diagram-input-abstraction.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Mode Flow →](diagram-mode-flow.md)

---

# Diagram: Mechanic → Combo → Gimmick → Special Move → Part → Beyblade

> **Stage 0C Diagram 2** — Composition flow from mechanics up to beyblade.

```mermaid
flowchart TD
  MECH[Mechanic<br/>Engine-agnostic WHAT<br/>e.g. velocity_burst, spin_drain, wall_redirect<br/>31 handlers in MechanicRegistry]
  COMBO[ComboEffectDef<br/>tasks: ComboTask[]<br/>steps: BehaviorRef[]]
  GIMMICK[Gimmick<br/>mechanic recipe + mode configs<br/>e.g. engine_gear, free_spin, sub_layer<br/>→ MechanicInstance[] via gimmickExpander]
  SM_STEP[SpecialMoveStep<br/>comboEffectId + timing + override]
  SM_CFG[SpecialMoveConfig<br/>steps[] + powerCost + camera]
  PART[Part<br/>tip/ar/wd/sub/bb/casing/spin_track<br/>8 collections × CRUD pages]
  BEYBLADE[Beyblade<br/>stats + gimmickIds + specialMoveId + comboIds]

  MECH --> COMBO
  MECH --> GIMMICK
  COMBO --> SM_STEP
  SM_STEP --> SM_CFG
  GIMMICK --> PART
  PART --> BEYBLADE
  SM_CFG --> BEYBLADE
  COMBO --> BEYBLADE

  subgraph "Admin Authoring Layer"
    AD_MECH[BehaviorDefsPage ✅<br/>behavior_defs CRUD<br/>= mechanic behavior registry]
    AD_GIMMICK[Gimmick CRUD<br/>❌ NOT BUILT<br/>hardcoded in server/physics/mechanics/]
    AD_COMBO[ComboEffectsPage ✅<br/>combo_effects CRUD<br/>+ ComboTask editor]
    AD_SM[SpecialMovesPage ✅<br/>special_moves CRUD<br/>+ step authoring]
    AD_BEY[BeybladeEditPage ✅<br/>beyblade_stats CRUD]
    AD_PART[PartEditPage ✅<br/>8 part type pages<br/>+ BeybladeSystemEditPage]
  end

  AD_MECH --> MECH
  AD_GIMMICK -.->|NOT BUILT| GIMMICK
  AD_COMBO --> COMBO
  AD_SM --> SM_CFG
  AD_BEY --> BEYBLADE
  AD_PART --> PART

  subgraph "Firestore Collections"
    FS_BEHAVIOR[(behavior_defs ✅<br/>mechanic behavior registry)]
    FS_GIMMICK[(gimmick_defs<br/>❌ MISSING — hardcoded)]
    FS_COMBO[(combo_effects ✅)]
    FS_SM[(special_moves ✅)]
    FS_BEY[(beyblade_stats ✅)]
    FS_PART[(8 part collections ✅<br/>+ beyblade_systems ✅)]
    FS_COMBOS[(combos ✅<br/>3-key sequence registry)]
  end

  AD_MECH --> FS_BEHAVIOR
  AD_GIMMICK -.->|NOT BUILT| FS_GIMMICK
  AD_COMBO --> FS_COMBO
  AD_SM --> FS_SM
  AD_BEY --> FS_BEY
  AD_PART --> FS_PART
```

## Composition Rules

| Level | What it defines | Engine representation | Admin page |
|-------|----------------|----------------------|-----------|
| Mechanic | WHAT behavior happens (engine-agnostic) | MechanicRegistry handler (31 total) | BehaviorDefsPage ✅ |
| Combo | Task sequence + targeting + timing | ComboEffectDef (tasks→BehaviorRef compiled) | ComboEffectsPage ✅ |
| Gimmick | Named mechanic recipe (how a part behaves) | gimmickExpander → MechanicInstance[] | ❌ NOT BUILT |
| Special Move | Orchestrated sequence of Combos | SpecialMoveConfig (steps[] with comboEffectId) | SpecialMovesPage ✅ |
| Part | Physical component with gimmick binding | BeybladeSystem slot | 8 PartEditPages ✅ |
| Beyblade | Stats + gimmickIds + specialMoveId + comboIds | beyblade_stats doc | BeybladeEditPage ✅ |

## MechanicRegistry — 31 Registered Handlers

Mechanics are defined in `server/physics/mechanics/` and registered in `MechanicRegistry.ts`. Each handler is a pure function `(beyblade, arena, params) → effects`.

| Category | Handlers |
|----------|---------|
| Movement | orbitMovement, railLock, upperLaunch, zeroGFloat, weightShift |
| Factor/Boost | attackAmplifier, barrageHit, smashImpact, springRecoil |
| Spin | freeSpin, bearingDrift, spinTransfer, spinEqualization, spinStealCoupling, spinThresholdSwitch, spinDirectionBonus, staminaRecovery, revivalSpin, burstSuppress |
| Contact | contactDeflect, contactHeightGate, rubberGrip, surfaceFrictionModifier |
| Field | magneticPull, centerPull |
| Defense | defenseStance, energyReserve |
| Transform | modeSwitch, rotationReverse, subPartBurst |

---

[← Input Abstraction](diagram-input-abstraction.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Mode Flow →](diagram-mode-flow.md)

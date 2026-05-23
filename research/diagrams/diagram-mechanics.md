# Diagram: Mechanic → Combo → Gimmick → Special Move → Part → Beyblade

> **Stage 0C Diagram 2** — Composition flow from mechanics up to beyblade.

```mermaid
flowchart TD
  MECH[Mechanic<br/>Engine-agnostic WHAT<br/>e.g. velocity_burst, spin_drain, wall_redirect]
  COMBO[ComboEffectDef<br/>tasks: ComboTask[]<br/>steps: BehaviorRef[]]
  GIMMICK[Gimmick<br/>mechanic recipe + mode configs<br/>e.g. engine_gear, free_spin, sub_layer]
  SM_STEP[SpecialMoveStep<br/>comboEffectId + timing + override]
  SM_CFG[SpecialMoveConfig<br/>steps[] + powerCost + camera]
  PART[Part<br/>tip/ar/wd/sub/bb/casing/spin_track]
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
    AD_MECH[mechanic_defs CRUD<br/>❌ NOT BUILT]
    AD_GIMMICK[gimmick_defs CRUD<br/>❌ NOT BUILT]
    AD_COMBO[combo_effects CRUD<br/>✅ ComboEffectsPage]
    AD_SM[special_moves CRUD<br/>⚠️ metadata only, no step authoring]
    AD_BEY[beyblade_stats CRUD<br/>✅ BeybladeEditPage]
    AD_PART[2.5D parts CRUD<br/>✅ PartEditPage]
  end

  AD_MECH --> MECH
  AD_GIMMICK --> GIMMICK
  AD_COMBO --> COMBO
  AD_SM --> SM_CFG
  AD_BEY --> BEYBLADE
  AD_PART --> PART

  subgraph "Firestore Collections"
    FS_MECH[(mechanic_defs<br/>❌ MISSING)]
    FS_GIMMICK[(gimmick_defs<br/>❌ MISSING)]
    FS_COMBO[(combo_effects ✅)]
    FS_SM[(special_moves ✅)]
    FS_BEY[(beyblade_stats ✅)]
    FS_PART[(8 part collections ✅)]
  end

  AD_MECH --> FS_MECH
  AD_GIMMICK --> FS_GIMMICK
  AD_COMBO --> FS_COMBO
  AD_SM --> FS_SM
  AD_BEY --> FS_BEY
  AD_PART --> FS_PART
```

## Composition Rules

| Level | What it defines | Engine representation |
|-------|----------------|----------------------|
| Mechanic | WHAT behavior happens (engine-agnostic) | BehaviorRef.behaviorId |
| Combo | Task sequence + targeting + timing | ComboEffectDef (tasks→steps compiled) |
| Gimmick | Named mechanic recipe (how a part behaves) | gimmick_defs → applied to Part fields |
| Special Move | Orchestrated sequence of Combos | SpecialMoveConfig (steps[] with comboEffectId) |
| Part | Physical component with gimmick binding | BeybladeSystem slot |
| Beyblade | Stats + gimmickIds + specialMoveId + comboIds | beyblade_stats doc |

# Diagram: Data Flow — Database → Validation → Compiler → Runtime

> **Stage 0C Diagram 8** — Rule 7 data flow: database is for authoring; engine uses preloaded runtime store.

```mermaid
flowchart TD
  subgraph "Authoring (admin UI — 48 pages)"
    ADMIN[Admin CRUD Pages]
  end

  subgraph "Firestore (40 collections — source of truth)"
    FS_BEY[(beyblade_stats)]
    FS_ARENA[(arenas + arena_systems)]
    FS_SM[(special_moves)]
    FS_COMBO[(combo_effects)]
    FS_COMBOS[(combos)]
    FS_BEHAVIOR[(behavior_defs)]
    FS_RM[(round_modifiers)]
    FS_ELEM[(element_type_configs)]
    FS_PART[(8 part collections<br/>+ beyblade_systems)]
    FS_TOURNAMENT[(tournaments + brackets + participants)]
    FS_OTHER[(+ 25 more collections<br/>arena_feature_configs, bey_link_configs<br/>turret_attack_types, part_materials<br/>ai_battles, matches, player_stats<br/>*_assets, particle_presets, etc.)]
    FS_CAM[(camera_profiles<br/>❌ NOT YET USED)]
    FS_AUDIO[(audio_profiles<br/>❌ NOT YET USED)]
  end

  subgraph "Save-time Compilation"
    CTC[ComboTaskCompiler<br/>ComboTask[] → BehaviorRef[]]
    VAL[Validation<br/>sum ≤ 360, refs valid]
  end

  subgraph "Server Startup (once — in onCreate)"
    PRELOAD[Room.onCreate() preload<br/>loadBeyblade, loadArena,<br/>loadComboEffects, loadElementTypeMatrix<br/>loadSpecialMoves, loadCombos<br/>loadRoundModifiers]
    PRELOAD_GE[GimmickExpander<br/>gimmickIds → MechanicInstance[]]
    CACHE[Session Cache<br/>BeybladeStats, ArenaConfig,<br/>ComboEffectDocs, ElementTypeMatrix<br/>SpecialMoveConfigs, ComboCache<br/>RoundModifierMap]
  end

  subgraph "Game Loop (60Hz — NO ASYNC)"
    TICK[tick(deltaTime)<br/>synchronous]
    PE[PhysicsEngine<br/>Matter.js]
    SM_SYS[SpecialMoveSystem<br/>5-phase state machine]
    CS[ComboSystem<br/>detect + trigger]
    AFP[ArenaFeatureProcessor<br/>→ MechanicRegistry]
    MR[MechanicRegistry<br/>31 namespaced handlers]
    ETL[ElementTypeLoader compute]
    PSM[PartSystemManager.tick()<br/>2.5D part state]
  end

  ADMIN --> FS_BEY
  ADMIN --> FS_ARENA
  ADMIN --> FS_SM
  ADMIN --> FS_COMBO
  ADMIN --> FS_COMBOS
  ADMIN --> FS_BEHAVIOR
  ADMIN --> FS_RM
  ADMIN --> FS_ELEM
  ADMIN --> FS_PART
  ADMIN --> FS_TOURNAMENT
  ADMIN --> FS_OTHER

  FS_COMBO --> CTC
  CTC --> FS_COMBO

  FS_BEY --> VAL
  VAL --> PRELOAD

  FS_BEY --> PRELOAD
  FS_ARENA --> PRELOAD
  FS_SM --> PRELOAD
  FS_COMBO --> PRELOAD
  FS_COMBOS --> PRELOAD
  FS_BEHAVIOR --> PRELOAD
  FS_RM --> PRELOAD
  FS_ELEM --> PRELOAD

  PRELOAD --> PRELOAD_GE
  PRELOAD --> CACHE
  PRELOAD_GE --> CACHE
  CACHE --> TICK
  TICK --> PE
  TICK --> SM_SYS
  TICK --> CS
  TICK --> AFP
  AFP --> MR
  TICK --> ETL
  TICK --> PSM

  style FS_CAM fill:#ff9944,color:#fff
  style FS_AUDIO fill:#ff9944,color:#fff
```

> Orange nodes = collections planned but not yet integrated into admin UI or server load path.

## Critical Rule: No async in game loop

```
WRONG:  this.setSimulationInterval(async () => { await loadArena(id); })
CORRECT: this.setSimulationInterval((dt) => { this.tick(dt); })
         // all data preloaded in onCreate()
```

## Collections Load Matrix

| Collection | Preloaded in onCreate | Used at runtime | Admin CRUD |
|-----------|----------------------|-----------------|-----------|
| beyblade_stats | ✅ | ✅ (stats, gimmickIds) | ✅ |
| arenas + arena_systems | ✅ | ✅ (physics config) | ✅ |
| special_moves | ✅ | ✅ (SpecialMoveSystem) | ✅ |
| combo_effects | ✅ | ✅ (BehaviorRef dispatch) | ✅ |
| combos | ✅ | ✅ (detectCombo) | ✅ |
| behavior_defs | ✅ | ✅ (MechanicRegistry) | ✅ |
| round_modifiers | ✅ (MODIFIER_MAP) | ✅ | ✅ |
| element_type_configs | ✅ | ✅ (type multipliers) | ✅ |
| camera_profiles | ❌ Not loaded | ❌ Not used | ❌ No page |
| audio_profiles | ❌ Not loaded | ❌ Not used | ❌ No page |

---
[? Camera Flow](diagram-camera-flow.md) &nbsp;�&nbsp; [? Index](../INDEX.md) &nbsp;�&nbsp; [Deterministic Flow ?](diagram-deterministic-flow.md)

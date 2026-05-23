# Diagram: Data Flow — Database → Validation → Compiler → Runtime

> **Stage 0C Diagram 8** — Rule 7 data flow: database is for authoring; engine uses preloaded runtime store.

```mermaid
flowchart TD
  subgraph "Authoring (admin UI)"
    ADMIN[Admin CRUD Pages]
  end

  subgraph "Firestore (source of truth)"
    FS_MECH[(mechanic_defs)]
    FS_GIMMICK[(gimmick_defs)]
    FS_BEY[(beyblade_stats)]
    FS_ARENA[(arenas + arena_systems)]
    FS_SM[(special_moves)]
    FS_COMBO[(combo_effects)]
    FS_CAM[(camera_profiles)]
    FS_AUDIO[(audio_profiles)]
  end

  subgraph "Save-time Compilation"
    CTC[ComboTaskCompiler<br/>ComboTask[] → BehaviorRef[]]
    VAL[Validation<br/>sum ≤ 360, refs valid]
  end

  subgraph "Server Startup (once)"
    PRELOAD[Room.onCreate() preload<br/>loadBeyblade, loadArena,<br/>loadComboEffects, loadElementTypeMatrix]
    CACHE[Session Cache<br/>BeybladeStats, ArenaConfig,<br/>ComboEffectDocs, ElementTypeMatrix]
  end

  subgraph "Game Loop (60Hz — NO ASYNC)"
    TICK[tick(deltaTime)<br/>synchronous]
    PE[PhysicsEngine]
    SM_SYS[SpecialMoveSystem]
    CS[ComboSystem]
    AFP[ArenaFeatureProcessor]
    ETL[ElementTypeLoader compute]
  end

  ADMIN --> FS_MECH
  ADMIN --> FS_GIMMICK
  ADMIN --> FS_BEY
  ADMIN --> FS_ARENA
  ADMIN --> FS_SM
  ADMIN --> FS_COMBO
  ADMIN --> FS_CAM
  ADMIN --> FS_AUDIO

  FS_COMBO --> CTC
  CTC --> FS_COMBO

  FS_BEY --> VAL
  FS_MECH --> VAL
  VAL --> PRELOAD

  FS_BEY --> PRELOAD
  FS_ARENA --> PRELOAD
  FS_SM --> PRELOAD
  FS_COMBO --> PRELOAD
  FS_MECH --> PRELOAD
  FS_GIMMICK --> PRELOAD

  PRELOAD --> CACHE
  CACHE --> TICK
  TICK --> PE
  TICK --> SM_SYS
  TICK --> CS
  TICK --> AFP
  TICK --> ETL

  style FS_MECH fill:#ff4444,color:#fff
  style FS_GIMMICK fill:#ff4444,color:#fff
  style FS_CAM fill:#ff4444,color:#fff
  style FS_AUDIO fill:#ff4444,color:#fff
```

> Red nodes = collections not yet in COLLECTIONS constant or admin UI.

## Critical Rule: No async in game loop

```
WRONG:  this.setSimulationInterval(async () => { await loadArena(id); })
CORRECT: this.setSimulationInterval((dt) => { this.tick(dt); })
         // all data preloaded in onCreate()
```

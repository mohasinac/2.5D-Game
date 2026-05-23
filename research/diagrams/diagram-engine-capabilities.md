# Diagram: Engine Capabilities Map

> **Stage 0C Diagram 1** — Full engine capability map.

```mermaid
graph TD
  subgraph "SERVER ENGINE (Colyseus + Matter.js)"
    PE[PhysicsEngine<br/>Matter.js 60Hz]
    PP[PartPhysics<br/>2.5D extensions]
    CP[ClimbingPhysics<br/>wall/ceiling]
    AFP[ArenaFeatureProcessor<br/>shared hazards]
    MR[MechanicRegistry<br/>31 namespaced handlers]
    GE[GimmickExpander<br/>gimmickIds → MechanicInstance[]]
    SMS[SpecialMoveSystem<br/>5-phase state machine]
    CS[ComboSystem<br/>detect + trigger]
    CTC[ComboTaskCompiler<br/>Task→BehaviorRef]
    ETL[ElementTypeLoader<br/>Firestore matrix]
    AI[AIController<br/>medium/hard/hell]
    SM[SeriesManager<br/>BO1/3/5]
    IH[InputHandler<br/>bitmask→forces]
    RM[RoundModifiers<br/>MODIFIER_MAP]
    TBG[TournamentScheduler<br/>30s poll, 65s look-ahead]
    BG[BracketGenerator<br/>advanceWinnerToNextRound]
    PSM[PartSystemManager<br/>per-room 2.5D state machine]
  end

  subgraph "SCHEMA (Colyseus @Schema)"
    GS[GameState]
    BEY[Beyblade<br/>80+ fields]
    AS[ArenaState]
    LS[LoopState]
    OS[ObstacleState]
    PS[PitState]
    TS[TurretState]
    PROJ[ProjectileState]
    WS[WaterBodyState]
    POS[PortalState]
    DBS[DetachedBodySchema]
    MI[MechanicInstance<br/>type + params + state JSON]
  end

  subgraph "SHARED TYPES (compiled at save time)"
    SM_T[SpecialMoveConfig<br/>steps→ComboEffectId]
    CT[ComboTask<br/>5 action types]
    BR[BehaviorRef<br/>engine steps]
    SD[StatDelta<br/>29 keys]
    CED[ComboEffectDef<br/>tasks+steps]
    BS[BeybladeSystem<br/>2.5D parts]
  end

  subgraph "ROOMS (max 20 active)"
    TR[TryoutRoom<br/>solo — max 1]
    BR2[BattleRoom<br/>PVP 2–4 — max 12]
    AIR[AIBattleRoom<br/>1v1 AI — max 9]
    TBR[TournamentBattleRoom<br/>bracket — max 10]
    TEAM[TeamBattleRoom<br/>2v2 — max 12]
    P25BR[Parts25DBattleRoom<br/>2.5D PVP]
    P25AIR[Parts25DAIBattleRoom<br/>2.5D AI]
    P25TBR[Parts25DTournamentBattleRoom<br/>2.5D bracket]
    P25TR[Parts25DTryoutRoom<br/>2.5D solo]
  end

  subgraph "FIREBASE RUNTIME"
    FS[(Firestore<br/>40 collections)]
    FB_AUTH[Auth]
    FB_STORAGE[Storage]
  end

  PE --> BEY
  PP --> BEY
  CP --> BEY
  AFP --> GS
  AFP --> MR
  MR --> BEY
  GE --> MI
  MI --> BEY
  SMS --> BEY
  CS --> BEY
  ETL --> FS
  AI --> IH
  SM --> GS
  IH --> BEY
  RM --> GS
  TBG --> BG
  PSM --> PP

  CTC --> BR
  CT --> CTC
  SM_T --> CED
  CED --> BR
  BR --> SMS
  BR --> MR

  GS --> BEY
  GS --> AS
  GS --> LS
  GS --> OS
  GS --> PS
  GS --> TS
  GS --> PROJ
  GS --> WS
  GS --> POS
  GS --> DBS

  TR --> PE
  BR2 --> PE
  AIR --> PE
  AIR --> AI
  TBR --> PE
  TEAM --> PE
  P25BR --> PP
  P25BR --> PSM
  P25AIR --> PP
  P25AIR --> AI
  P25TBR --> PP
  P25TR --> PP

  BR2 --> FS
  TR --> FS
  AIR --> FS
  TBR --> FS
  TEAM --> FS
```

## Capability Summary Table

| System | Status | Notes |
|--------|--------|-------|
| 2D physics (Matter.js) | ✅ Complete | PhysicsEngine.ts |
| 2.5D part physics | ✅ Complete | PartPhysics.ts + PartSystemManager.ts |
| 3D physics | ❌ Not built | Needs Cannon.js / Rapier adapter |
| Arena hazards (12+ types) | ✅ Complete | ArenaFeatureProcessor.ts |
| BehaviorRef dispatcher | ✅ Complete | MechanicRegistry — 31 handlers (movement.*, factor.*, transform.*, spawn.*, arena.*) |
| Special move pipeline | ✅ Complete | 5-phase state machine |
| Combo system (sequence + trigger) | ✅ Complete | detectCombo() + detectTriggerCombos() |
| Element types | ✅ Complete | ElementTypeLoader + ElementTypeEditPage |
| Round modifiers | ✅ Complete | RoundModifiersPage + MODIFIER_MAP |
| AI (medium/hard/hell) | ✅ Complete | AIController.ts |
| Series manager (BO1/3/5) | ✅ Complete | SeriesManager.ts |
| Tournament system | ✅ Complete | TournamentScheduler + BracketGenerator |
| GimmickExpander | ✅ Complete | gimmickExpander.ts → MechanicInstance[] |
| Combination lock (BeyLink) | ⚠️ Types + config admin built; physics depth in PartPhysics | BeyLinkConfigsPage exists |
| Arena rotation + shrink | ✅ Complete | advanceArenaRotation.ts |
| Sub-part detachment lifecycle | ✅ Complete | DetachedBodySchema lifecycle |
| Team battle (2v2) | ✅ Complete | TeamBattleRoom.ts |
| Gimmick defs admin CRUD | ❌ Not built | No dedicated admin page; hardcoded in server/physics/mechanics/ |
| Camera profiles | ❌ Not built | No admin page |
| Audio profiles | ❌ Not built | No admin page |

---
[← Deterministic Flow](diagram-deterministic-flow.md) &nbsp;�&nbsp; [↑ Index](../INDEX.md) &nbsp;�&nbsp; [Extraction Pipeline →](diagram-extraction-pipeline.md)

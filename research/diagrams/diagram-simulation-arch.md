# Diagram: Simulation Architecture — Shared Layer + Adapters

> **Stage 0C Diagram 5** — Multi-engine simulation support (Rule 2).

```mermaid
flowchart TD
  subgraph "Research"
    R[Beyblade Physics Research<br/>WHAT behavior happens]
  end

  subgraph "Mechanics Layer (engine-agnostic)"
    M[Mechanic<br/>velocity_burst / spin_drain / center_pull<br/>wall_redirect / gyro_wobble / etc.]
  end

  subgraph "Behavior Definitions"
    COMBO[ComboEffectDef<br/>BehaviorRef[] steps]
    GIMMICK[GimmickDef<br/>mechanic recipe + mode configs]
    SM[SpecialMoveConfig<br/>steps + camera + timing]
  end

  subgraph "Shared Engine Layer"
    SHARED_PARAMS[Shared Params<br/>StatDelta keys, ComboTiming, ComboCondition]
    SHARED_TICK[Shared Tick Logic<br/>SeriesManager, InputHandler,<br/>ComboSystem, SpecialMoveSystem]
  end

  subgraph "2D Adapter ✅"
    A2D[Matter.js circle bodies<br/>SAT collision<br/>contact point angle resolution<br/>wall segment polygon<br/>arena feature forces]
  end

  subgraph "2.5D Adapter ✅"
    A25D[PartPhysics extensions<br/>tip eccentricity (tipOffsetX/Y)<br/>subPartSpins MapSchema<br/>ClimbingPhysics (wall/ceiling)<br/>beyTiltAngle + effectiveGravity<br/>arc-segment contact points]
  end

  subgraph "3D Adapter ❌"
    A3D[NOT BUILT<br/>Would need: Cannon.js / Rapier<br/>Mesh collision, material restitution<br/>6DOF rotation, z-axis gravity]
  end

  R --> M
  M --> COMBO
  M --> GIMMICK
  COMBO --> SM
  SM --> SHARED_TICK
  GIMMICK --> SHARED_TICK
  SHARED_PARAMS --> A2D
  SHARED_PARAMS --> A25D
  SHARED_PARAMS --> A3D
  SHARED_TICK --> A2D
  SHARED_TICK --> A25D
  SHARED_TICK --> A3D

  subgraph "Rooms use adapters"
    R2D[BattleRoom / TryoutRoom / AIBattleRoom / TournamentBattleRoom → PhysicsEngine (2D)]
    R25D[Parts25DBattleRoom → PartPhysics (2.5D)]
    R3D[❌ No 3D room yet]
  end

  A2D --> R2D
  A25D --> R25D
  A3D --> R3D
```

## Parity Rule

All adapters must preserve **behavior identity**:
- wall_bounce: momentum preserved, velocity component reversed
- spin_drain: same drain rate, different collision precision
- center_pull: same attractive force formula

Differences allowed: simulation accuracy, collision precision — NOT intended behavior.

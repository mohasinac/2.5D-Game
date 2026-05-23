# Diagram: Simulation Architecture — Shared Layer + Adapters

> **Stage 0C Diagram 5** — Multi-engine simulation support (Rule 2).

```mermaid
flowchart TD
  subgraph "Research"
    R[Beyblade Physics Research<br/>WHAT behavior happens]
  end

  subgraph "Mechanics Layer (engine-agnostic)"
    M[Mechanic<br/>velocity_burst / spin_drain / center_pull<br/>wall_redirect / gyro_wobble / etc.]
    MR[MechanicRegistry<br/>31 namespaced handlers<br/>movement.* / factor.* / transform.*<br/>spawn.* / arena.*]
  end

  subgraph "Behavior Definitions"
    COMBO[ComboEffectDef<br/>BehaviorRef[] steps]
    GIMMICK[GimmickDef<br/>mechanic recipe via gimmickExpander<br/>→ MechanicInstance[] at onCreate]
    SM[SpecialMoveConfig<br/>steps + camera + timing]
  end

  subgraph "Shared Engine Layer"
    SHARED_PARAMS[Shared Params<br/>StatDelta keys, ComboTiming, ComboCondition]
    SHARED_TICK[Shared Tick Logic<br/>SeriesManager, InputHandler,<br/>ComboSystem, SpecialMoveSystem<br/>GimmickExpander, TournamentScheduler]
  end

  subgraph "2D Adapter ✅"
    A2D[PhysicsEngine.ts<br/>Matter.js circle bodies<br/>SAT collision<br/>contact point angle resolution<br/>wall segment polygon<br/>arena feature forces]
  end

  subgraph "2.5D Adapter ✅"
    A25D[PartPhysics.ts + PartSystemManager.ts<br/>tip eccentricity (tipOffsetX/Y)<br/>subPartSpins MapSchema<br/>ClimbingPhysics (wall/ceiling)<br/>beyTiltAngle + effectiveGravity<br/>arc-segment contact points<br/>DetachedBodySchema lifecycle]
  end

  subgraph "3D Adapter ❌"
    A3D[NOT BUILT<br/>Would need: Cannon.js / Rapier<br/>Mesh collision, material restitution<br/>6DOF rotation, z-axis gravity]
  end

  R --> M
  M --> MR
  M --> COMBO
  M --> GIMMICK
  COMBO --> SM
  SM --> SHARED_TICK
  GIMMICK --> SHARED_TICK
  MR --> SHARED_TICK
  SHARED_PARAMS --> A2D
  SHARED_PARAMS --> A25D
  SHARED_PARAMS --> A3D
  SHARED_TICK --> A2D
  SHARED_TICK --> A25D
  SHARED_TICK --> A3D

  subgraph "2D Rooms"
    R2D_BATTLE[BattleRoom — max 12<br/>PVP 2–4 + spectators]
    R2D_TRYOUT[TryoutRoom — max 1<br/>solo practice]
    R2D_AI[AIBattleRoom — max 9<br/>1 human + AI + spectators]
    R2D_TOURNEY[TournamentBattleRoom — max 10<br/>2 players + spectators]
    R2D_TEAM[TeamBattleRoom — max 12<br/>2v2 team battle]
  end

  subgraph "2.5D Rooms"
    R25D_BATTLE[Parts25DBattleRoom<br/>2.5D PVP]
    R25D_AI[Parts25DAIBattleRoom<br/>2.5D AI]
    R25D_TOURNEY[Parts25DTournamentBattleRoom<br/>2.5D bracket]
    R25D_TRYOUT[Parts25DTryoutRoom<br/>2.5D solo]
  end

  subgraph "3D Rooms"
    R3D[❌ No 3D room yet]
  end

  A2D --> R2D_BATTLE
  A2D --> R2D_TRYOUT
  A2D --> R2D_AI
  A2D --> R2D_TOURNEY
  A2D --> R2D_TEAM
  A25D --> R25D_BATTLE
  A25D --> R25D_AI
  A25D --> R25D_TOURNEY
  A25D --> R25D_TRYOUT
  A3D --> R3D
```

## Parity Rule

All adapters must preserve **behavior identity**:
- wall_bounce: momentum preserved, velocity component reversed
- spin_drain: same drain rate, different collision precision
- center_pull: same attractive force formula

Differences allowed: simulation accuracy, collision precision — NOT intended behavior.

## Room Registry (server/index.ts)

| Room Key | Class | Adapter |
|----------|-------|---------|
| `tryout_room` | TryoutRoom | 2D |
| `battle_room` | BattleRoom | 2D |
| `ai_battle_room` | AIBattleRoom | 2D |
| `tournament_battle_room` | TournamentBattleRoom | 2D |
| `team_battle_room` | TeamBattleRoom | 2D |
| `parts25d_battle_room` | Parts25DBattleRoom | 2.5D |
| `parts25d_ai_battle_room` | Parts25DAIBattleRoom | 2.5D |
| `parts25d_tournament_battle_room` | Parts25DTournamentBattleRoom | 2.5D |
| `parts25d_tryout_room` | Parts25DTryoutRoom | 2.5D |

Max 20 rooms active at once — enforced by `roomCounter.ts` (`tryReserveRoom()` / `releaseRoom()`).

---
[← Sequence Launch](diagram-sequence-launch.md) &nbsp;�&nbsp; [↑ Index](../INDEX.md) &nbsp;�&nbsp; [Tilt Angle →](diagram-tilt-angle.md)

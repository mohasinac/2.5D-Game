[← Sequence Launch](diagram-sequence-launch.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Tilt Angle →](diagram-tilt-angle.md)

---

# Diagram: Simulation Architecture — Shared Layer + Adapters

> **Stage 0C Diagram 5** — Two-engine simulation (2D + 2.5D). The 2.5D engine is the game's depth/3D layer — it handles perspective warps, shape makers, z-layer physics, and tilt projection. No separate 3D physics library is used or planned.

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

  subgraph "Authority Blend Layer (Phase 22) — per tick, per bey"
    NAT_MOT["NaturalMotion.ts\ncomputeNaturalForce\norbit + momentum + decision bias\ndeath spiral + stabilisation + rage burst\nrail adhesion"]
    COMP_AUTH["computeAuthority\nspin/momentum penalties\nhold/SPACE/clash boosts\narena authority multiplier\nlerpSmooth 0.08"]
    APPLY_BM["applyBlendedMovement\nfinalForce = player x alpha + natural x 1-alpha"]
    STEER_F["applySteeringForce\ncentripetal perpendicular\nmomentum-preserving turn\nspin cost for sharp turns"]
  end

  subgraph "2D Adapter ✅"
    A2D[PhysicsEngine.ts<br/>Matter.js circle bodies<br/>SAT collision<br/>contact point angle resolution<br/>wall segment polygon<br/>arena feature forces]
  end

  subgraph "2.5D Adapter ✅ — game's 3D layer"
    A25D[PartPhysics.ts + PartSystemManager.ts<br/>Shape makers: Fourier profiles + arc-segment CPs<br/>Perspective warps: tilt stack (outer/scale/inner)<br/>Z-layer: beyTiltAngle + effectiveGravity<br/>ClimbingPhysics: wall/ceiling adhesion<br/>tip eccentricity (tipOffsetX/Y)<br/>subPartSpins MapSchema<br/>DetachedBodySchema lifecycle<br/>MaterialBand.wearSchedule → computeWearLevel → bey.materialWearLevel<br/>SystemContactPoint.weightFactor → getCpWeightShare → computeCpMomentOfInertia<br/>TipPart.evolutionStages → tickEvolutionDriver → bey.tipEvolutionStage<br/>advanceSpinRotation: bey.rotation = angDir × spinFrac × 6 × dt NOT Matter.js body.angle]
  end

  R --> M
  M --> MR
  M --> COMBO
  M --> GIMMICK
  COMBO --> SM
  SM --> SHARED_TICK
  GIMMICK --> SHARED_TICK
  MR --> SHARED_TICK
  SHARED_TICK --> NAT_MOT
  SHARED_TICK --> COMP_AUTH
  NAT_MOT --> APPLY_BM
  COMP_AUTH --> APPLY_BM
  APPLY_BM --> STEER_F
  STEER_F --> A2D
  STEER_F --> A25D
  SHARED_PARAMS --> A2D
  SHARED_PARAMS --> A25D

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

  A2D --> R2D_BATTLE
  A2D --> R2D_TRYOUT
  A2D --> R2D_AI
  A2D --> R2D_TOURNEY
  A2D --> R2D_TEAM
  A25D --> R25D_BATTLE
  A25D --> R25D_AI
  A25D --> R25D_TOURNEY
  A25D --> R25D_TRYOUT
```

## 2.5D as the Depth Layer

The 2.5D engine is not a "partial 3D" — it is the complete depth system for this game. It replaces true 3D with two complementary techniques:

| Technique | What it does | Where |
|-----------|-------------|-------|
| **Shape makers** | Fourier profiles + arc-segment contact points define the 3D silhouette of each part as a 2D cross-section. `renderRadius(θ)` warps the sprite outline at runtime. | `PartPhysics.ts`, `beybladeSystem.ts` |
| **Perspective warps** | Three nested PixiJS containers (`arenaTiltOuter → arenaTiltScale → arenaTiltInner`) project the arena plane as if tilted in 3D space (foreshortening via `scaleX = cos(tiltAngle)`). | `PixiRenderer.ts` |

Any mechanic requiring "3D" in another engine (pillar hit volumes, vertical tilt, surface adhesion, part silhouette collision) is expressed through these systems in 2.5D.

## Parity Rule

Both adapters must preserve **behavior identity**:
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

[← Sequence Launch](diagram-sequence-launch.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Tilt Angle →](diagram-tilt-angle.md)

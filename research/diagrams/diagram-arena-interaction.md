[↑ Index](../INDEX.md) &nbsp;·&nbsp; [Camera Flow →](diagram-camera-flow.md)

---

# Diagram: Arena Interaction

> **Stage 0C Diagram 4** — Arena Config → Hazards → Mechanics → Modifiers → Beyblade.

```mermaid
flowchart TD
  subgraph "ArenaConfig (Firestore)"
    AC_SHAPE[shape + dimensions]
    AC_OBS[obstacles[]]
    AC_LOOPS[loops/speed paths[]]
    AC_PITS[pits[]]
    AC_WATER[waterBodies[]<br/>water/blood/lava/acid/oil/ice]
    AC_PORTALS[portals[]]
    AC_TURRETS[turrets[]<br/>random/beam/periodic/aoe/boomerang]
    AC_SWITCHES[switches[]<br/>toggle/set-on/set-off/pulse/chain]
    AC_SPIN[spinZones[]<br/>linear/spin/both applyTo]
    AC_BUMPS[bumps[]]
    AC_GRAV[gravityWells[]<br/>controlledBySwitchId + selfRotation]
    AC_TRIG[triggerZones[]]
    AC_LINKS[arenaLinks[]]
    AC_BEYLINKS[beyLinks[]]
    AC_FLOOR[floorHazardZones[]]
  end

  subgraph "ArenaSystem (Firestore)"
    AS_ELEV[elevationMap<br/>flat/tilt/bowl/ramp]
    AS_WALL[wallProfile<br/>height + bowl angle]
    AS_SLOPE[slopePhysics<br/>gravityStrength]
  end

  subgraph "ArenaState (GameState sync)"
    GS_LOOPS[loops MapSchema]
    GS_OBS[obstacles MapSchema]
    GS_PITS[pits MapSchema]
    GS_WATER[waterBodies MapSchema]
    GS_PORTALS[portals MapSchema]
    GS_TURRETS[turrets MapSchema]
    GS_PROJ[projectiles MapSchema]
    GS_WALL[wallAngle + effectiveRadius]
    GS_ROT[autoRotate + rotationSpeed]
  end

  subgraph "Processing (per tick)"
    AFP[ArenaFeatureProcessor<br/>processArenaFeatures()]
    TP[TurretProcessor<br/>aim + fire + projectile tick]
    AA[advanceArenaRotation<br/>rotation state machine]
    MR[MechanicRegistry<br/>✅ 31 namespaced handlers]
  end

  subgraph "Beyblade Effects"
    BEY_SPEED[speedMultiplier<br/>waterSpeedMultiplier, loopSpeedBoost]
    BEY_SPIN[spin drain/boost<br/>waterSpinDrain, loopSpinBoost]
    BEY_POS[position teleport<br/>portals, wrecking_ball]
    BEY_DAMAGE[health damage<br/>pits, obstacles, turrets, lava/acid]
    BEY_FORCE[applied forces<br/>gravity wells, spin zones, bumps]
    BEY_INPIT[inPit flag, pitDamageRate]
    BEY_INWATER[inWater flag, liquid type effects]
  end

  AC_OBS --> GS_OBS
  AC_LOOPS --> GS_LOOPS
  AC_PITS --> GS_PITS
  AC_WATER --> GS_WATER
  AC_PORTALS --> GS_PORTALS
  AC_TURRETS --> GS_TURRETS

  GS_OBS --> AFP
  GS_LOOPS --> AFP
  GS_PITS --> AFP
  GS_WATER --> AFP
  GS_PORTALS --> AFP
  GS_TURRETS --> TP

  AS_ELEV --> AFP
  AS_WALL --> GS_WALL
  AS_SLOPE --> AFP
  GS_ROT --> AA

  AFP --> BEY_SPEED
  AFP --> BEY_SPIN
  AFP --> BEY_POS
  AFP --> BEY_DAMAGE
  AFP --> BEY_FORCE
  AFP --> BEY_INPIT
  AFP --> BEY_INWATER
  AFP --> MR

  MR --> BEY_FORCE
  MR --> BEY_SPIN
  MR --> BEY_SPEED

  AC_TRIG --> AFP
  AC_SWITCHES --> AFP
  AC_SPIN --> AFP
  AC_BUMPS --> AFP
  AC_GRAV --> AFP
  AC_FLOOR --> AFP
  AC_LINKS --> AFP
  AC_BEYLINKS --> AFP
```

## Arena Feature Status

| Feature | Runtime Processing | BehaviorRef Dispatch | Status |
|---------|-------------------|---------------------|--------|
| Speed paths (loops) | ✅ | N/A | Complete |
| Obstacles | ✅ | N/A | Complete |
| Pits | ✅ | N/A | Complete |
| Water bodies (6 liquid types) | ✅ | N/A | Complete |
| Portals | ✅ | N/A | Complete |
| Turrets (5 attack types) | ✅ | N/A | Complete |
| Gravity wells | ✅ | MechanicRegistry (centerPull, magneticPull) | Complete |
| Spin zones | ✅ | MechanicRegistry (orbitMovement) | Complete |
| Bumps | ✅ | N/A | Complete |
| Trigger zones → BehaviorRef | ✅ | MechanicRegistry 31 handlers | Complete |
| Switches (5 modes) | ✅ (SwitchConfig.targets[]) | N/A | Complete |
| Self-rotation (features) | ✅ (speedDegPerSec) | N/A | Complete |
| controlledBySwitchId | ✅ | N/A | Complete |
| Arena links (corridors) | types defined | partial physics | Partial |
| BeyLinks (multi-bey) | BeyLinkConfigsPage ✅ | physics depth via PartPhysics | Partial |
| Floor hazard zones | ✅ | N/A | Complete |

---

[↑ Index](../INDEX.md) &nbsp;·&nbsp; [Camera Flow →](diagram-camera-flow.md)

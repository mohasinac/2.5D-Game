# Diagram: Arena Interaction

> **Stage 0C Diagram 4** — Arena Config → Hazards → Mechanics → Modifiers → Beyblade.

```mermaid
flowchart TD
  subgraph "ArenaConfig (Firestore)"
    AC_SHAPE[shape + dimensions]
    AC_OBS[obstacles[]]
    AC_LOOPS[loops/speed paths[]]
    AC_PITS[pits[]]
    AC_WATER[waterBodies[]]
    AC_PORTALS[portals[]]
    AC_TURRETS[turrets[]]
    AC_SWITCHES[switches[]]
    AC_SPIN[spinZones[]]
    AC_BUMPS[bumps[]]
    AC_GRAV[gravityWells[]]
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
    BH[executeBehavior<br/>movement.orbit ONLY ⚠️]
  end

  subgraph "Beyblade Effects"
    BEY_SPEED[speedMultiplier<br/>waterSpeedMultiplier, loopSpeedBoost]
    BEY_SPIN[spin drain/boost<br/>waterSpinDrain, loopSpinBoost]
    BEY_POS[position teleport<br/>portals, wrecking_ball]
    BEY_DAMAGE[health damage<br/>pits, obstacles, turrets, lava]
    BEY_FORCE[applied forces<br/>gravity wells, spin zones, bumps]
    BEY_INPIT[inPit flag, pitDamageRate]
    BEY_INWATER[inWater flag]
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
  AFP --> BH

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
| Water bodies | ✅ | N/A | Complete |
| Portals | ✅ | N/A | Complete |
| Turrets | ✅ | N/A | Complete |
| Gravity wells | ✅ | movement.orbit | Partial |
| Spin zones | ✅ | movement.orbit | Partial |
| Bumps | ✅ | N/A | Complete |
| Trigger zones → BehaviorRef | ⚠️ | only movement.orbit | CRITICAL GAP |
| Switches | ✅ (SwitchConfig.targets[]) | N/A | Complete |
| Arena links (corridors) | types defined | partial physics | Partial |
| BeyLinks (multi-bey) | types defined | partial physics | Partial |
| Floor hazard zones | ✅ | N/A | Complete |
| Self-rotation | ✅ (speedDegPerSec) | N/A | Complete |

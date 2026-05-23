# Diagram 5 — Simulation Architecture (Three-Engine)

Three simulation engine architecture. Mechanics describe WHAT happens; adapters describe HOW it happens in each engine. Simulation and rendering are decoupled — a 2D simulation can have a 3D renderer.

```mermaid
graph TD
  Research --> Mechanics[Mechanics Layer\nATOMIC FIELD MODIFIERS\nDescribes WHAT happens, never HOW]
  Mechanics --> SharedLayer[Shared Engine Layer\nparams + conditions + timing\nsame across all engines]

  SharedLayer --> Adapter2D[2D Adapter\nMatter.js vector math\nflat plane collision]
  SharedLayer --> Adapter25D[2.5D Adapter\nz-layer + tilt + adhesion\nClimbingPhysics.ts extensions]
  SharedLayer --> Adapter3D[3D Adapter\nmesh collision + inertia tensor\nangular velocity]

  Mechanics --> Combos[Combos — Level 4\nBehaviorRef chains]
  Mechanics --> ArenaHazards[Arena Hazards\nArenaFeatureProcessor.ts]
  Mechanics --> ArenaFeatures[Arena Features\nSpinZone / GravityWell / Bump / Rail]
  Combos --> Gimmicks[Gimmicks — Level 5\nNamed mechanic recipes]
  Combos --> SpecialMoves[Special Moves — Level 6\nsteps mechanic chains]
  SpecialMoves --> Beyblades[Beyblades — Level 8\ngimmickIds assembled]
  Gimmicks --> Beyblades
  Beyblades --> Systems[Bey Systems — Level 9\nPlastic / HMS / MFB / Burst / BX]
  ArenaFeatures --> Arenas[Arenas — Level 10\nvalidated ArenaConfig JSONs]

  subgraph Adapter2D_Detail["2D Adapter Detail"]
    VectorReflection[wall bounce: vector reflection\nat wall normal]
    FlatCollision[contact: Matter.js overlap\nflat-plane bounding circles]
    OrbitalForce[orbit: tangent vector force\nfrom zone center]
    CenterForce2D[center pull: radial force vector\ntoward arena center]
    RailPath2D[rail lock: nearest polyline\nsegment clamp]
  end

  subgraph Adapter25D_Detail["2.5D Adapter Detail"]
    ZLayerTransition[z-layer: elevation zone transition\nClimbingPhysics.computeClimbingForces]
    TiltPhysics[tilt: beyTiltAngle update\nClimbingPhysics.updateBeyTilt]
    AdhesionForces[adhesion: wall-climb + suction\nadhering + adheringSurfaceAngle]
    OrbitalForce25D[orbit: tangent force\n+ height preserve]
    RailPath25D[rail lock: polyline clamp\n+ z-elevation follows rail height]
    SlopeBounce[wall bounce: reflection\n+ slope angle modifies vector]
  end

  subgraph Adapter3D_Detail["3D Adapter Detail"]
    MeshCollision[contact: full mesh collision\nmaterial restitution]
    InertiaTensor[mass: inertia tensor\nfor rotational physics]
    AngularVelocity[rotation: angular velocity\nfor gyroscopic stability]
    ConstrainedRail[rail lock: constrained\npath physics with gear mesh]
    PhysicalRidge[tornado ridge: physical\nridge mesh + centripetal]
  end

  Adapter2D --> Adapter2D_Detail
  Adapter25D --> Adapter25D_Detail
  Adapter3D --> Adapter3D_Detail
```

## Multi-Engine Parity Rules

| Rule | Constraint |
|------|-----------|
| Behavior Identity | All engines preserve core gimmick identity, movement identity, contact behavior |
| Difference Scope | Differences are only in simulation accuracy and collision precision — never in intended behavior |
| Simulation ≠ Rendering | Simulation engine and renderer are decoupled; a 2D simulation can have a 3D renderer |
| Mechanic Params | Shared params are the same across all engines; adapters interpret them differently |
| No Feature Gating | No mechanic or gimmick is "2D only" or "3D only" — all three must be supported |

## Required Tables Per Mechanic (from Rule 2)

Every mechanic defined in Stage 6 must have this table:

| Mechanic | 2D Implementation | 2.5D Implementation | 3D Implementation | Shared Behavior |
|---------|-------------------|--------------------|--------------------|----------------|
| `energy_reserve` | charge float → fire impulse | same + airborne check | same | coreReserveRemaining + threshold fire |
| `velocity_burst` | direct vector impulse | vector + z-component clamp | physics body force | magnitude + direction params |
| `orbit_movement` | tangent force from zone center | tangent + height preserve | angular velocity path | radius + speed params |
| `center_pull` | radial force vector | radial + slope contribution | force field | radius + pull strength |
| `spring_recoil` | spring force on contact | spring + elevation | constraint spring | restitution + threshold |
| `free_spin` | lower spinDecayRate | lower decay + tilt resistance | bearing friction model | decay rate modifier |
| `spin_transfer` | on contact overlap | on contact + elevation | collision impulse | CLASH_MULTIPLIERS |
| `rail_lock` | nearest polyline segment lock | lock + z-elevation on rail | constrained path physics | requiresGearCompatibleBit |
| `rubber_grip` | contact friction mult | same + surface normal | material friction | gripFactor modifier |
| `burst_suppress` | threshold boost | same | same | burstResistance delta |
| `weight_shift` | modify effective mass | same + center-of-mass | inertia tensor update | mass delta |

## Missing Support Tracking (per batch)

| Feature | 2D | 2.5D | 3D | Required Work |
|---------|-----|------|-----|---------------|
| Gear rail (BX) | ❌ | ❌ | ❌ | GearRailConfig + rail_lock mechanic all engines |
| Tornado ridge | ⚠️ partial (gravity well) | ⚠️ partial | ❌ | TornadoRidgeConfig + combined forces |
| Zero-G | ⚠️ partial (effectiveGravity) | ⚠️ partial | ❌ | ZeroGConfig + gravity vector override |
| Scoring zones | ❌ | ❌ | ❌ | ScoringZoneConfig + playerPoints schema |
| Visual scripting | ❌ | ❌ | ❌ | Stage 15 — editor + runtime blocks |

# Diagram 4 — Arena → Mechanic → Beyblade Interaction

Arena configuration features and how each maps to mechanics and Beyblade state fields.
Based on real feature types found in `client/src/types/arenaConfigNew.ts` and `ArenaFeatureProcessor.ts`.

```mermaid
graph LR
  subgraph ArenaConfig["ArenaConfig (arenaConfigNew.ts)"]
    SpinZones[SpinZoneConfig ✅\nApplyTo: linear/spin/both\ncw/ccw orbit imparted]
    Bumps[BumpConfig ✅\nSmall raised feature\nvertical pop + lateral recoil]
    GravityWells[GravityHoleConfig ✅\nPull toward center\ncontrolledBySwitchId]
    Obstacles[ObstacleConfig ✅\nPhysics body obstacle\ncontrolledBySwitchId + selfRotation]
    TriggerZones[TriggerZoneConfig ✅\nActivates on bey entry\nwired to switch graph]
    Switches[SwitchConfig ✅\ntoggle/set-on/set-off/pulse/chain\ncontrols controlledBySwitchId features]
    FloorHazards[FloorHazardZoneConfig ✅\nDamage zones on floor]
    EffectZones[EffectZoneConfig ✅\nGeneric effect trigger zones]
    SelfRotation[SelfRotationConfig ✅\nspeedDegPerSec + direction\nVisual + functional rotation]
    MultiFloor[ArenaLink ✅\nMulti-floor portal connections]
    BeyLink[BeyLink ✅\nBey-to-bey stacking]
    Timeline[ArenaTimelineEvent ✅\nPhase T timed events]
    Shrink[ArenaShrinkConfig ✅\nPhase V arena shrink]

    GearRail[GearRailConfig ❌ ABSENT\nBX Xtreme Line rail]
    ScoringZone[ScoringZoneConfig ❌ ABSENT\nBX Xtreme/Over/Pocket scoring]
    TornadoRidge[TornadoRidgeConfig ❌ ABSENT\nTornado ridge orbit force]
    ZeroG[ZeroGConfig ❌ ABSENT\nZero-gravity arena override]
  end

  subgraph Mechanics["Mechanic Dispatch"]
    OM[orbit_movement\nvelocityX/Y tangential]
    CP[center_pull\nvelocityX/Y radial to center]
    SR[spring_recoil\nrecoilFactor on contact]
    RL[rail_lock\nxtremeEngaged + vel locked]
    EG[effectiveGravity\nfield on Beyblade]
    SW[switch wiring\nswitchStates MapSchema]
    SFM[surface_friction_modifier\nsurfaceFriction override]
    CD[contact_deflect\ndamageTaken transient]
  end

  subgraph BeyState["Beyblade State Fields"]
    velXY[velocityX / velocityY]
    recoil[recoilFactor]
    xtremeEng[xtremeEngaged NEW]
    effGrav[effectiveGravity]
    switchSt[ArenaState.switchStates]
    dmgTaken[damageTaken transient]
    surf[surfaceFriction]
  end

  SpinZones --> OM --> velXY
  GravityWells --> CP --> velXY
  Bumps --> SR --> recoil
  GearRail -.->|needs implementation| RL --> xtremeEng
  ZeroG -.->|needs implementation| EG --> effGrav
  TriggerZones --> SW --> switchSt
  Obstacles --> CD --> dmgTaken
  FloorHazards --> SFM --> surf
  TornadoRidge -.->|needs implementation| CP
  ScoringZone -.->|needs implementation| scoringFields["scoringMode + playerPoints\n(NEW schema fields)"]
```

## Arena Feature → Mechanic → Multi-Engine Table

| Feature | Mechanic | 2D Implementation | 2.5D Implementation | 3D Implementation | Shared Logic |
|---------|---------|-------------------|--------------------|--------------------|-------------|
| Spin zone | `orbit_movement` | Tangent force vector from zone center | Same + height profile of zone | Physical spin field mesh | Zone entry check + force magnitude |
| Gravity well | `center_pull` | Radial force vector toward center | Radial + slope contribution from ridge height | Force field physics | Radius + pull strength params |
| Bump | `spring_recoil` | Spring force on contact, lateral recoil | Spring + z-elevation pop | Constraint spring + mesh bounce | Contact threshold + recoil params |
| Obstacle | `contact_deflect` | Angle-cone check, reduce damage | Same + vertical component check | Mesh collision angle check | Approach angle gate |
| Floor hazard | `surface_friction_modifier` | surfaceFriction override in zone | Same + traction on slope | Material override in mesh | Zone overlap check |
| Water zone | `surface_friction_modifier` | surfaceFriction set to water value | Same + buoyancy force | Water simulation | Zone type = water |
| Gear rail | `rail_lock` (NEW) | Nearest polyline segment lock + boost | Same + z-elevation follows rail height | Constrained path physics | requiresGearCompatibleBit check |
| Scoring zone | scoring handlers (NEW) | Zone overlap → point award | Same | Same | Zone kind: xtreme/over/pocket/ring-out |
| Tornado ridge | `center_pull` + `orbit_movement` | Radial pull + tangent orbit | Radial + height profile | Physical ridge mesh | Combined center + tangent forces |
| Zero-g | `effectiveGravity` override | Reduce/remove downward drift | Same + suction/adhesion still active | Gravity vector override | hasZeroG flag → effectiveGravity |

## Switch Wiring Flow

```mermaid
flowchart TD
  TriggerZone[TriggerZoneConfig\nonEnter: activates switch]
  Switch[SwitchConfig\ntoggle/set-on/set-off/pulse/chain]
  ControlledFeature[Any feature with controlledBySwitchId]
  ArenaState[ArenaState.switchStates MapSchema]

  TriggerZone --> Switch
  Switch --> ArenaState
  ArenaState --> ControlledFeature

  Switch --> toggle[mode: toggle\nswitchState = !switchState]
  Switch --> setOn[mode: set-on\nswitchState = true]
  Switch --> setOff[mode: set-off\nswitchState = false]
  Switch --> pulse[mode: pulse\ntrue for durationMs then false]
  Switch --> chain[mode: chain\nactivates next switch ID]
```

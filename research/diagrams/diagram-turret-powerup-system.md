# Diagram: Turret Attack Power-Up System

> Session 12 additions — Illusion, Contra bey-as-weapon, and Contra movement power-ups.

---

## Diagram 1 — Overall Turret Attack Dispatch Flow

```mermaid
flowchart TD
  TICK["Room tick<br/>1000/60 ms"]
  TP["TurretProcessor.ts<br/>processTurrets<br/>processProjectiles"]
  CFG["TurretConfig<br/>ArenaConfig.turrets<br/>attackType string"]

  TICK --> TP
  CFG --> TP

  TP --> CAT{attackType category}

  subgraph "Core Physics (Sessions 1-9)"
    C1["kinetic / push / pull<br/>vortex / slow / stun<br/>bomb / mine / cage"]
  end

  subgraph "Franchise Moves (Sessions 10-11)"
    C2["anime franchise<br/>e.g. rasengan, kamehameha<br/>giga_impact, death_beam<br/>~165 types"]
  end

  subgraph "Illusion / Deception (Session 12)"
    C3["mirror_world<br/>perfect_mirage<br/>broken_reality<br/>phantasmal_shift<br/>echo_image<br/>genjutsu_veil<br/>false_flag<br/>mind_fracture"]
  end

  subgraph "Contra Bey Power-Ups (Session 12)"
    C4["spread_bey<br/>railbey<br/>minigun_bey<br/>heat_seeker_bey<br/>bomb_bey<br/>shield_bey<br/>turbo_bey<br/>cannon_bey"]
  end

  subgraph "Contra Movement Power-Ups (Session 12)"
    C5["speed_surge<br/>gravity_flip<br/>magnet_bey<br/>bounce_storm<br/>freeze_step<br/>ghost_walk<br/>boomerang_path<br/>teleport_dash"]
  end

  CAT --> C1
  CAT --> C2
  CAT --> C3
  CAT --> C4
  CAT --> C5

  C1 --> BRIDGE["TurretProcessorBridge<br/>applyForce / applyKnockback<br/>getPosition / setVelocity"]
  C2 --> BRIDGE
  C3 --> GHOST["Ghost Position System<br/>bey.x/y = false coords<br/>Colyseus syncs to ALL clients"]
  C4 --> BUFF["Bey-as-Weapon Buffer<br/>_xxx dynamic props on bey<br/>collision handler checks flags"]
  C5 --> BRIDGE

  BRIDGE --> MATTER["Matter.js body<br/>server physics"]
  GHOST --> SCHEMA["Colyseus schema<br/>auto-sync 60Hz to all clients"]
  BUFF --> MATTER
```

---

## Diagram 2 — Ghost / Illusion Position Pattern

```mermaid
sequenceDiagram
  participant TP as TurretProcessor
  participant BEY as Beyblade (schema)
  participant MATTER as Matter.js body
  participant CLIENT as All Clients

  Note over TP: triggerMirrorWorld / genjutsu_veil fires

  TP->>BEY: save bey.x/y to _realX/Y
  TP->>BEY: bey.x = falseX, bey.y = falseY
  BEY-->>CLIENT: Colyseus sync pushes false coords

  Note over CLIENT: Client renders bey at WRONG position
  Note over MATTER: Physics body still at REAL position

  loop Per tick (until expiry)
    TP->>BEY: drift bey.x/y slightly (realism)
    BEY-->>CLIENT: Colyseus sync pushes drifted false coords
    TP->>MATTER: physics runs at real coords unaffected
  end

  Note over TP: UntilMs reached — restore

  TP->>BEY: bey.x = _realX
  TP->>BEY: bey.y = _realY
  BEY-->>CLIENT: Colyseus sync snaps back to real position
```

---

## Diagram 3 — Eight Illusion Move Taxonomy

```mermaid
flowchart LR
  subgraph "Target = All Beys"
    MW["mirror_world<br/>All beys get ghost dupe<br/>at mirrored position for 3.5s"]
    GV["genjutsu_veil<br/>All bey schema positions<br/>drift randomly each tick for 4s"]
    BR["broken_reality<br/>All beys teleport<br/>to random arena positions"]
    FF["false_flag<br/>Two random beys swap<br/>display identity for 5s"]
  end

  subgraph "Target = Single Bey"
    PM["perfect_mirage<br/>Target invisible —<br/>physics continues unseen 2.5s"]
    PS["phantasmal_shift<br/>Target: 50% dmg reduction<br/>+ ghost visual for 3s"]
    EI["echo_image<br/>Two ghost decoys at offsets<br/>1-hit absorb each"]
    MF["mind_fracture<br/>Inverted position display<br/>+ inverted inputs for 3s"]
  end

  subgraph "Core mechanism"
    GHOST["Ghost Position<br/>bey.x/y = false coords<br/>Colyseus to all clients deceived"]
    DYNPROP["Dynamic props<br/>_displayName / _falseFlagged<br/>_inputInverted"]
  end

  MW --> GHOST
  GV --> GHOST
  PM --> GHOST
  PS --> GHOST
  EI --> GHOST
  MF --> GHOST
  MF --> DYNPROP
  FF --> DYNPROP
```

---

## Diagram 4 — Contra Bey-as-Weapon Power-Up Flow

```mermaid
flowchart TD
  TURRET[Turret fires at bey]

  subgraph "One-shot effects (fire & forget)"
    SB["spread_bey<br/>On next collision: 5 impact vectors<br/>25 dmg each in arc ±30°"]
    CB["cannon_bey<br/>Catapults bey at max force<br/>toward furthest opponent<br/>3000 force / 120 dmg"]
  end

  subgraph "Buff applied to bey — checked at collision"
    RB["railbey<br/>4x speed straight line<br/>pierces all beys for 1.5s / 40 dmg"]
    MB["minigun_bey<br/>12 rapid pulses at 60ms intervals<br/>8 dmg each"]
    HS["heat_seeker_bey<br/>Auto-locks + rams nearest opp<br/>600px/s / 70 dmg"]
    BB["bomb_bey<br/>Ticking bomb — explodes on collision<br/>or 4s fuse / 200 dmg AoE 160px"]
    SHB["shield_bey<br/>Full-body shield: blocks next hit<br/>+ AoE retaliation 80 dmg / 120px"]
    TB["turbo_bey<br/>Spin + speed surge to max for 5s<br/>+30% spin"]
  end

  TURRET --> SB
  TURRET --> CB
  TURRET --> RB
  TURRET --> MB
  TURRET --> HS
  TURRET --> BB
  TURRET --> SHB
  TURRET --> TB

  RB --> FLAG["_railbeyActive<br/>_railbeyDirX/Y<br/>setVelocity per tick"]
  MB --> FLAG2["_minigunActive<br/>minigunBeyPulsesLeft<br/>minigunBeyNextPulseMs"]
  BB --> FLAG3["_bombActive<br/>bombBeyDetonateMs<br/>processBombBeyTick checks expiry"]
  SHB --> FLAG4["_shieldActive<br/>collision handler: blocks + burst"]
  TB --> FLAG5["_turboActive<br/>setVelocity + spin boost on apply<br/>turboBeyUntilMs"]
```

---

## Diagram 5 — Contra Movement Power-Up State Machine

```mermaid
stateDiagram-v2
  [*] --> Idle

  Idle --> SpeedSurge : speed_surge fired
  SpeedSurge --> Idle : UntilMs expired, restore speed

  Idle --> GravityFlip : gravity_flip fired
  GravityFlip --> Idle : UntilMs expired, remove outward force

  Idle --> MagnetBey : magnet_bey fired
  MagnetBey --> Idle : UntilMs expired, stop chasing force

  Idle --> BounceStorm : bounce_storm fired
  BounceStorm --> Idle : UntilMs expired, remove recoil multiplier

  Idle --> FreezeStep : freeze_step fired
  FreezeStep --> Idle : UntilMs expired, restore velocity

  Idle --> GhostWalk : ghost_walk fired
  GhostWalk --> Idle : UntilMs expired, re-enable collisions

  Idle --> BoomerangPath : boomerang_path fired
  BoomerangPath --> Idle : UntilMs expired, stop orbital force

  Idle --> TeleportDash : teleport_dash fired
  TeleportDash --> Idle : blinksLeft=0 or UntilMs expired
```

---

## Diagram 6 — Contra Movement Power-Up Mechanics Table

```mermaid
flowchart LR
  subgraph "Force-per-tick (bridge.applyForce every tick)"
    GF["gravity_flip<br/>Repels FROM center<br/>forceX = dx/dist x 0.018<br/>forceY = dy/dist x 0.018"]
    MAG["magnet_bey<br/>Chases nearest opponent<br/>directed force 0.015 per tick"]
    BRM["boomerang_path<br/>Orbital force around center<br/>tangential perpendicular force<br/>orbitAngle += 180 deg/s"]
  end

  subgraph "setVelocity one-shot + restore"
    SS["speed_surge<br/>vx x 3.0 / vy x 3.0<br/>duration 2s"]
    FS["freeze_step<br/>vx = 0 / vy = 0<br/>save real velocity<br/>duration 1.5s"]
  end

  subgraph "Schema / collision flags"
    GW["ghost_walk<br/>_ghostWalkActive = true<br/>collision handler skips<br/>duration 2s"]
    BS["bounce_storm<br/>_bounceStormActive = true<br/>wall collision: recoil x 3.0<br/>duration 3s"]
  end

  subgraph "Position teleport"
    TD["teleport_dash<br/>bey.x/y = random arena pos<br/>3 blinks at 0.4s intervals<br/>schema sync deceives clients"]
  end
```

---

## Diagram 7 — 4-File Implementation Pattern

```mermaid
flowchart LR
  subgraph "Add a new turret attack type"
    F1["shared/types/arenaConfigNew.ts<br/>(1) Add to TurretAttackType union<br/>(2) Add config fields to TurretConfig"]
    F2["server/shared/rooms/TurretProcessor.ts<br/>(3) Add runtime fields to TurretRuntimeState<br/>(4) Add handler export function(s)<br/>(5) Wire into switch-case dispatch"]
    F3["client/src/game/renderer/FeatureRenderer.ts<br/>(6) Add entry to TURRET_COLORS map<br/>(7) Add visual branch in syncProjectiles()"]
    F4["client/src/components/admin/arena-tabs/TurretsTab.tsx<br/>(8) Add TypeSpecificParams UI block"]
  end

  F1 -->|types flow down| F2
  F2 -->|server writes state| F3
  F1 -->|config shape for UI| F4
```

---

## Diagram 8 — Full Attack Type Count (Sessions 1–12)

```mermaid
pie title "Turret Attack Types by Session Group"
  "Core Physics (S1-4)" : 18
  "Franchise: DBZ/Naruto (S5-6)" : 24
  "Franchise: Pokemon/Other (S7-8)" : 28
  "Franchise: Misc + Combat (S9-10)" : 28
  "Franchise: Phase-Z Targets (S11)" : 67
  "Illusion / Deception (S12)" : 8
  "Contra Bey Power-Ups (S12)" : 8
  "Contra Movement Power-Ups (S12)" : 8
```

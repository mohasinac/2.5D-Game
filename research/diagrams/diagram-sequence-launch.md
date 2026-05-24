[← Script Execution](diagram-script-execution.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Simulation Architecture →](diagram-simulation-arch.md)

---

# Diagram: Sequence — Launch to State Update

> **Stage 0C Diagram 6** — Full sequence from pre-match launch QTE through collision to client.

---

## Pre-Match State Machine (all room types)

```mermaid
stateDiagram-v2
  direction LR

  [*] --> waiting : onCreate
  waiting --> warmup : all players joined (or autoConnect)
  warmup --> launching : warmupTimer <= 0, 3s countdown done
  launching --> in_progress : all players launched OR launchTimer <= 0
  in_progress --> finished : last beyblade standing or ring-out / spin-out
  finished --> warmup : resetForNextGame(), BO3/BO5 series continues
  finished --> series_finished : seriesWins >= targetWins

  warmup : warmup — 3-2-1 countdown, timer counts down
  launching : launching — 5s launch QTE, launchTimer counts down
  in_progress : in-progress — 180s match timer, physics at 60Hz
```

---

## Launch QTE Sequence (status = "launching")

```mermaid
sequenceDiagram
  participant Client
  participant useLaunchInput
  participant Room
  participant Beyblade Schema
  participant GameState

  Room->>GameState: status = "launching", launchTimer = 5
  GameState-->>Client: Colyseus patch (60 Hz)

  Note over Client,useLaunchInput: Client shows LaunchPhase overlay (tilt/pos/power gauges)

  loop every RAF frame while !launched
    Client->>useLaunchInput: A/D → tilt ±45°, W/S → position 0–1
    Note over useLaunchInput: Space held → chargingStarted=true<br/>+25% power per 200 ms (max 150%)
    useLaunchInput->>Room: send("launch-input", {tilt, position, power, charging, launched:false})
    Room->>Beyblade Schema: bey.launchTilt = tilt, launchPosition = pos, launchPower = power
  end

  useLaunchInput->>Room: send("launch-input", {…, launched:true})
  Room->>Beyblade Schema: bey.launchReady = true

  alt all players launched
    Room->>Room: startMatchFromLaunch()
  else launchTimer expires
    Room->>Beyblade Schema: !launchReady → launchFailed = true
    Room->>Room: startMatchFromLaunch()
  end

  Note over Room: startMatchFromLaunch() applies params:<br/>bey.spin = maxSpin × (power/100)<br/>spawnRadius × (0.6 + position×0.8)<br/>beyTiltAngle = abs(launchTilt)
  Room->>GameState: status = "in-progress", timer = 180
```

---

## AI Auto-Launch (AIBattleRoom / TournamentBattleRoom)

AI participants auto-launch ~1.5 s into the launching phase with randomised params:

```
tilt     = rand() × 20           (0–20°)
position = 0.3 + rand() × 0.3   (0.3–0.6 — moderate placement)
power    = 90 + rand() × 30     (90–120%)
```

---

## TryoutGamePage — Local (server-free) Launch Phase

TryoutGamePage has no Colyseus connection; the QTE runs entirely in the browser:

```mermaid
stateDiagram-v2
  direction LR
  [*] --> countdown : component mount
  countdown --> launching : 3s elapsed (local RAF)
  launching --> playing : Space released OR timer expired (grace 50%)
  playing --> countdown : Try Again (reset)
```

`phaseRef` guards the physics loop — physics only runs in `playing` phase.  
`launchRef` stores tilt/position/power/chargeState in a mutable ref for RAF-safe access.

---

## Launch Parameter Effects on Physics

| Launch Parameter | Value Range | Effect at Match Start |
|---|---|---|
| `launchPower` | 0–150% | `bey.spin = maxSpin × (power / 100)` — 150% gives 1.5× maxSpin |
| `launchPosition` | 0–1 | `spawnRadius × (0.6 + pos × 0.8)` — 0=center (defensive), 1=edge (aggressive) |
| `launchTilt` | −45°→+45° | `beyTiltAngle = Math.abs(launchTilt)` — tilt > 0 → nutation wobble from tick 1 |
| `launchFailed` | bool | Beyblade set `isActive = false` — instant ring-out before physics begins |

---

## In-Match Sequence (after startMatchFromLaunch)

```mermaid
sequenceDiagram
  participant Client
  participant Room
  participant InputHandler
  participant PhysicsEngine
  participant ComboSystem
  participant SpecialMoveSystem
  participant ArenaFeatureProcessor
  participant MechanicRegistry
  participant PartSystemManager
  participant GameState

  Client->>Room: sendInput(uint16 bitmask)
  Room->>InputHandler: normalizeInput(bitmask) → PlayerInput
  InputHandler->>PhysicsEngine: applyMovementInput(forces)
  InputHandler->>ComboSystem: appendKey(key, now)

  ComboSystem-->>Room: detectCombo() + detectTriggerCombos() → ComboResult | null
  Room->>SpecialMoveSystem: activateComboEffect(comboResult)
  SpecialMoveSystem->>GameState: set comboPhase, comboDamageMultiplier

  Room->>PhysicsEngine: update(deltaTime) [Matter.js step]
  PhysicsEngine-->>Room: getBodyState(id) × N

  Room->>Room: checkBeybladeCollisions()
  Room->>PhysicsEngine: calculateCollisionDamage(collision, b1, b2)
  PhysicsEngine-->>Room: {damage1, damage2, spinSteal1, spinSteal2}
  Room->>Room: applyElementTypeMultiplier()
  Room->>GameState: mutate health, spin, damageDealt

  Room->>ArenaFeatureProcessor: processArenaFeatures(bey, arenaConfig, dt, bridge)
  ArenaFeatureProcessor->>MechanicRegistry: executeBehavior(behaviorId, params)
  MechanicRegistry-->>ArenaFeatureProcessor: applied forces / stat deltas
  ArenaFeatureProcessor-->>Room: ArenaEffectEvents

  Room->>SpecialMoveSystem: tickSpecialMove(smState, nowMs, bey)
  SpecialMoveSystem-->>Room: phase changes, invulnerable, suppressSpinDecay

  Room->>PartSystemManager: tick(dt) [2.5D rooms only]
  PartSystemManager-->>GameState: sub-part spin, detached body state

  Room->>GameState: sync positions, velocities, statuses, MechanicInstances
  GameState-->>Client: Colyseus auto-sync (60Hz patch)

  Note over Client: PixiRenderer 7-layer update: arena→features→beyblades→detached→particles→HUD
  Note over Client: camera lerp, particles, SFX, screen effects
```

---

## Connection Sequence (client-side)

```mermaid
sequenceDiagram
  participant Browser
  participant LoadingProgress
  participant useColyseus
  participant Room
  participant PixiRenderer

  Browser->>LoadingProgress: step 1: connecting-ws
  Browser->>useColyseus: joinOrCreate(roomType, options)
  useColyseus->>Room: WebSocket open
  LoadingProgress->>LoadingProgress: step 2: joining-room
  Room-->>useColyseus: onJoin → state sync begins
  LoadingProgress->>LoadingProgress: step 3: loading-arena-assets
  LoadingProgress->>LoadingProgress: step 4: loading-beyblade-assets
  LoadingProgress->>LoadingProgress: step 5: loading-audio-assets
  Room-->>useColyseus: state.status → "warmup"
  LoadingProgress->>LoadingProgress: step 6: warmup-ready
  useColyseus->>PixiRenderer: render loop begins
  Note over Browser: Countdown component shows 3-2-1
  Room-->>useColyseus: state.status → "launching"
  Note over Browser: Countdown flashes "Let It Rip!" — LaunchPhase overlay appears
  Room-->>useColyseus: state.status → "in-progress"
  Note over Browser: LaunchPhase hidden — battle begins
```

---

[← Script Execution](diagram-script-execution.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Simulation Architecture →](diagram-simulation-arch.md)

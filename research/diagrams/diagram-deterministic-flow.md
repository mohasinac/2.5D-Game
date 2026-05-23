# Diagram 14 — Deterministic Simulation Flow

Simulation must produce same outputs for same inputs. Players see chaos; engine sees math. All deterministic primitives are confirmed in Stage 0A and must be preserved.

```mermaid
flowchart TD
  subgraph Determinism["Determinism Primitives (all confirmed — PRESERVE ALL)"]
    PRNG[prng.ts: createPRNG(seed)\nSeeded Xorshift PRNG\nDeterministic wobble + random events]
    HASH[hashString.ts: hashString(matchId)\nMatchId → stable seed\nSame match ID → same PRNG sequence]
    TICK[60Hz setSimulationInterval\nFixed update rate\nNo frame-rate dependence]
    SCHEMA[Colyseus @Schema auto-sync\nServer-authoritative state\nClient receives diffs at 60Hz]
  end

  subgraph InputChain["Input → Intent Chain"]
    INPUT[Client uint16 bitmask\n(device-agnostic Input Actions layer)]
    INTENT[Intent Layer NEW\nContext-sensitive parsing\nCombo window + special tap check]
    FIXED_TICK[Fixed Tick Boundary\n60Hz — all physics happens here\nNo async, no await, no DB reads]
  end

  subgraph SimCore["Deterministic Simulation Core"]
    MECH[Mechanic Dispatch\nMechanicRegistry.dispatchTick()\ndispatchCollision()\nEngine-mode adapters: 2d/2.5d/3d]
    PHYSICS[Physics Calculation\nMatter.js step\napplyForce / computeContactDamage\ncomputeSpinSteal / computeClimbingForces]
    ARENA_PROC[Arena Feature Processing\nArenaFeatureProcessor.processArenaFeatures()\n12-step pipeline deterministic]
    COMBO_CHECK[Combo + Special Check\ndetectCombo() sliding-3 window\ncheckSpecialMove() power threshold]
  end

  subgraph StateUpdate["State Update"]
    SCHEMA_UPDATE[Schema State Update\nAll @type fields written\nColyseus diff computed]
    REPLAY[Replay Snapshot optional\nSame inputs + same seed = same replay\nNot yet implemented but architecture supports it]
    NET_SYNC[Network Sync\nColyseus schema patch to all clients\n60Hz diff send]
  end

  subgraph Presentation["Presentation Layer (client-side only — non-deterministic allowed)"]
    CAM[Camera\nClient interprets state delta\nautomatic behaviors]
    AUDIO[Audio\nClient triggers SFX/sting\nbased on event type]
    EFFECTS[Visual Effects\nParticles / trails / flash\nbased on state change magnitude]
    RENDERER[PixiJS Renderer\n5-layer stack: arena/features/beys/particles/HUD]
  end

  PRNG --> PHYSICS
  HASH --> PRNG
  TICK --> FIXED_TICK

  INPUT --> INTENT
  INTENT --> FIXED_TICK

  FIXED_TICK --> MECH
  FIXED_TICK --> PHYSICS
  FIXED_TICK --> ARENA_PROC
  FIXED_TICK --> COMBO_CHECK

  MECH --> SCHEMA_UPDATE
  PHYSICS --> SCHEMA_UPDATE
  ARENA_PROC --> SCHEMA_UPDATE
  COMBO_CHECK --> SCHEMA_UPDATE

  SCHEMA_UPDATE --> REPLAY
  SCHEMA_UPDATE --> NET_SYNC
  SCHEMA_UPDATE --> SCHEMA

  NET_SYNC --> CAM
  NET_SYNC --> AUDIO
  NET_SYNC --> EFFECTS
  CAM --> RENDERER
  AUDIO --> RENDERER
  EFFECTS --> RENDERER
```

## Determinism Rules

| Rule | Constraint | Source |
|------|-----------|--------|
| Seeded PRNG only | Use `createPRNG(seed)` — never `Math.random()` | prng.ts |
| Seed from matchId | `hashString(matchId)` → stable seed | hashString.ts |
| Fixed 60Hz tick | `setSimulationInterval(tick, 1000/60)` — preserved | CLAUDE.md |
| No async in tick | Never `await` or Firebase calls inside tick | CLAUDE.md critical |
| Server-authoritative | Physics only on server; client receives diffs | Architecture decision |
| Input as bitmask | uint16 bitmask — deterministic encoding | useGameInput.ts |
| State as schema | Colyseus @Schema — deterministic diff protocol | GameState.ts |
| No runtime DB reads | Engine reads only from preloaded session data | Rule 7 |

## Non-Deterministic Zone (presentation only — allowed)

| System | Non-Determinism Type | Why Allowed |
|--------|---------------------|-------------|
| Camera shake | Varies by client frame rate | Presentation only, not gameplay |
| Particle systems | Visual randomness | Client-side VFX, no gameplay effect |
| Audio timing | OS audio latency | Presentation only |
| Render frame rate | Client hardware | PixiJS render loop — independent of physics |
| Spectator camera | Manual player choice | Not part of simulation |

## Replay Architecture (future — current architecture supports it)

```
matchId → hashString() → seed
seed → createPRNG()
seed + inputLog → deterministic replay

Server: store inputLog per tick (uint16 bitmask sequence)
Client: given inputLog + matchId → reconstruct exact simulation
Result: perfect replay without storing full state snapshots
```

Current status: PRNG infrastructure ✅, schema infrastructure ✅, inputLog storage ❌ (not yet implemented)

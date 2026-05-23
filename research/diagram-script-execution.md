# Diagram 17 — Script Execution Flow

Script execution order: Core Simulation → Core Mechanics → Composition Layer → Script Definitions → Presentation → Renderer. Scripts compose onto mechanics; they never override engine truth.

```mermaid
flowchart TD
  subgraph ServerSim["Server — Authoritative Simulation (never overridden by scripts)"]
    CORE_SIM[Core Simulation\n60Hz fixed tick\nMatter.js physics step\nDeterministic — seeded PRNG only]

    CORE_MECH[Core Mechanics — MechanicRegistry\ndispatchTick(bey, ctx, dt)\ndispatchCollision(bey1, bey2, result)\nEngineMode adapter selection: 2d / 2.5d / 3d]

    subgraph CoreHandlers["Core Mechanic Handlers (engine-owned, not overridable)"]
      H_ENERGY[energy_reserve\ntickSpinInjection wrapper]
      H_SPIN[spin_transfer / spin_equalization\ncomputeSpinSteal wrapper]
      H_CONTACT[contact_deflect / spring_recoil / rubber_grip\ncomputeContactDamage + getContactPointMultiplier]
      H_MOVE[orbit_movement / center_pull / rail_lock / velocity_burst\napplyForce / applyKnockback wrappers]
      H_MODE[mode_switch / spin_threshold_switch / burst_suppress\napplyStatModifier wrappers]
      H_ROT[rotation_reverse / free_spin / bearing_drift\ntickCounterRotation + ClimbingPhysics wrappers]
    end

    CORE_MECH --> CoreHandlers
  end

  subgraph CompositionLayer["Composition Layer (user-scriptable, sandboxed)"]
    COMP_BLOCKS[Composition Blocks\nMovement / Rotation / Contact / Force / Weight\nCamera / Audio / Effect / Arena / Hazard\nState / Modifier / Projectile / Mode / Special\nAI / WorldState blocks]

    SCRIPT_DEFS[Script Definitions\nUser-authored scripts from visual editors\nLoaded from script_definitions Firestore collection\nvia Static Runtime Store — never fetched in tick]

    subgraph ScriptConstraints["Script Sandbox Constraints"]
      WHITELIST[Whitelisted APIs only\nComposition block methods\nRead-only bey state queries]
      NO_PHYSICS[Cannot override physics\nCannot replace core mechanics\nCannot bypass PRNG]
      TIMELIMITED[Execution time-limited per tick\nPrevents infinite loops]
    end
  end

  subgraph PresentationLayer["Presentation Layer (client-side — derived from state delta)"]
    PRES[Presentation Cues\nInterpreted from Colyseus schema delta\nNot sent directly by server]

    CAM_OUT[Camera\nshake / zoom / cut / follow\nbased on health delta / winner flag / special flag]
    AUD_OUT[Audio\nSFX / music stings / spatial\nbased on event type in state]
    VFX_OUT[Visual Effects\nparticles / trails / flash / distortion\nbased on combo multiplier / spin delta]
    ASSET_OUT[Asset Layer\nsprite swaps / VFX overlays\nbased on mode change / gimmick active flags]
    WORLD_OUT[World State\npersistent transforms / mode visuals\nbased on gimmick state fields]
  end

  subgraph RendererLayer["Renderer (PixiJS — client)"]
    PIXI[PixiJS WebGL Renderer\n5-layer stack:\n1. Arena\n2. Features\n3. Beyblades\n4. Particles\n5. HUD]
  end

  CORE_SIM --> CORE_MECH
  CORE_MECH --> COMP_BLOCKS
  COMP_BLOCKS --> SCRIPT_DEFS
  SCRIPT_DEFS --> PRES

  CORE_MECH --> PRES

  PRES --> CAM_OUT
  PRES --> AUD_OUT
  PRES --> VFX_OUT
  PRES --> ASSET_OUT
  PRES --> WORLD_OUT

  CAM_OUT --> PIXI
  AUD_OUT --> PIXI
  VFX_OUT --> PIXI
  ASSET_OUT --> PIXI
  WORLD_OUT --> PIXI

  SCRIPT_DEFS -.->|sandboxed read-only| CORE_SIM
  COMP_BLOCKS -.->|via whitelisted mechanic handlers| CORE_MECH
```

## Script Execution Order (strict — never reversed)

```
1. Core Simulation     (Matter.js physics step — authoritative)
2. Core Mechanics      (MechanicRegistry.dispatchTick — engine-owned handlers)
3. Composition Layer   (Composition blocks — user-composable, sandboxed)
4. Script Definitions  (User scripts — execute composed block sequences)
5. Presentation Layer  (Client-side cue derivation from state delta)
6. Renderer            (PixiJS render — visual output only)
```

Violating this order is forbidden. Scripts cannot inject into steps 1 or 2.

## Script Types by Use Case

| Script Type | Purpose | Blocks Used | Example |
|-------------|---------|------------|---------|
| `movement.script` | Custom movement patterns | movement_block, force_block | Spiral orbit attack pattern |
| `specialmove.script` | Custom special move execution | special_move_block, effect_block, camera_block | Multi-stage transformation sequence |
| `combo.script` | Extended combo sequences | modifier_block, movement_block | 5-hit combo with position swap |
| `mechanic.script` | Custom mechanic behavior | contact_block, state_block, rotation_block | Dual-spin contact coupling |
| `arena.script` | Custom arena event responses | arena_block, hazard_block, effect_block | Triggered hazard chain |
| `ai.script` | Custom AI behavior injection | ai_block, movement_block | Boss AI pattern |
| `gamemode.script` | Custom game mode logic | state_block, arena_block | Custom BX scoring variant |
| `camera.script` | Custom camera behavior | camera_block | Cinematic intro sequence |
| `audio.script` | Custom audio trigger logic | audio_block | Arena-specific music system |

## Key Decoupling Invariant

```
SIMULATION (server)     │  PRESENTATION (client)
────────────────────    │  ───────────────────────────
Core mechanics run      │  Client NEVER tells server
Script blocks compose   │  what physics to do.
State updates written   │
                        │
Colyseus schema patch   →  Client receives state delta
                           Client derives presentation cues
                           PixiJS renders the result
```

This decoupling preserves: replay consistency, server authority, determinism, AI compatibility.

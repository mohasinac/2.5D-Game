# Diagram: Presentation Flow — 9 Layers

> **Stage 0C Diagram 7** — Rule 6: Presentation is a cross-cutting layer.

```mermaid
flowchart TD
  Mechanics --> Combos
  Combos --> Gimmicks
  Gimmicks --> SpecialMoves
  SpecialMoves --> ArenaInteraction

  Mechanics --> Presentation
  Combos --> Presentation
  Gimmicks --> Presentation
  SpecialMoves --> Presentation
  ArenaInteraction --> Presentation

  Presentation --> L1[Layer 1: Gameplay Logic<br/>stat mods, burst, KO, win]
  Presentation --> L2[Layer 2: Movement Logic<br/>velocityX/Y, forces, orbit, drift, lock]
  Presentation --> L3[Layer 3: Camera Logic<br/>shake, zoom, cinematic cut, follow]
  Presentation --> L4[Layer 4: Audio Logic<br/>SFX, music stings, spatial audio]
  Presentation --> L5[Layer 5: Visual Effects<br/>particles, trails, flash, distortion]
  Presentation --> L6[Layer 6: Asset Layer<br/>sprite swaps, part overlays, VFX assets]
  Presentation --> L7[Layer 7: Arena Reactions<br/>hazard response, zone triggers, world-state]
  Presentation --> L8[Layer 8: World State<br/>persistent transform, mode change, env shift]
  Presentation --> L9[Layer 9: Runtime Transitions<br/>multi-stage transform sequencing, timing]

  L3 --> CameraShake
  L3 --> CameraZoom
  L3 --> CinematicCut
  L4 --> SFX
  L4 --> MusicSting
  L4 --> SpatialAudio
  L5 --> Particles
  L5 --> Trails
  L5 --> ScreenFlash
  L8 --> PersistentTransform
  L8 --> ModeChange
  L8 --> EnvironmentShift
```

## Current Admin Coverage of Presentation Layers

| Layer | Admin Page | Status |
|-------|-----------|--------|
| 1 Gameplay Logic | RoundModifiersPage, SpecialMovesPage | partial |
| 2 Movement Logic | SpecialMovesPage (effects), BehaviorDefsPage | partial |
| 3 Camera Logic | ❌ camera_profiles not built | MISSING |
| 4 Audio Logic | ❌ audio_profiles not built | MISSING |
| 5 Visual Effects | AnimationPresetsPage | partial (not linked) |
| 6 Asset Layer | All asset library pages | ✅ |
| 7 Arena Reactions | ArenaFeatureConfigsPage, BehaviorDefsPage | partial |
| 8 World State | BehaviorDefsPage (switch_logic) | partial |
| 9 Runtime Transitions | BehaviorDefsPage | partial (untyped JSON) |

## Simulation vs Presentation Boundary

```
Server side:   tick() → GameState mutation → Colyseus sync
Client side:   Colyseus state change → presentation cues
               (camera, SFX, particles, screen effects)
```

The server sends state changes. The client interprets them as presentation cues.
This decoupling MUST be preserved.

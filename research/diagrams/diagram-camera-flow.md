# Diagram: Camera Flow

> **Stage 0C Diagram 13** — Rule 12: GameplayEvent → CameraIntent → AutoDecision → CameraBehavior → PlayerOverride → FinalCamera.

```mermaid
flowchart TD
  subgraph "Gameplay Events"
    EV_LAUNCH[Match launch<br/>warmup → in-progress]
    EV_CLASH[Beyblade collision]
    EV_SPECIAL[Special move executing]
    EV_SPINOUT[Spin-out / elimination]
    EV_RINGOUT[Ring-out exit]
    EV_WOBBLE[beyTiltAngle > threshold]
    EV_SERIES[Game/series end]
  end

  subgraph "Camera Intent"
    CI_FOLLOW[Follow active beyblade]
    CI_ZOOM_IN[Zoom in (impact/special)]
    CI_ZOOM_OUT[Zoom out (multi-bey view)]
    CI_SHAKE[Screen shake (collision)]
    CI_LOCK[Lock on spinning-out bey]
  end

  subgraph "Auto Decision"
    AD_OWNER[Owner player → follow own bey]
    AD_SPEC[Spectator → follow selected bey]
    AD_NONE[No selection → nearest ring edge]
  end

  subgraph "Camera Behavior (client-side)"
    CB_LERP[Smooth lerp to target position]
    CB_ZOOM[Zoom level: +/0/- keyboard<br/>CameraControls component]
    CB_SHAKE[Shake amplitude from collision force]
    CB_TILT[Tilt angle tracks beyTiltAngle]
  end

  subgraph "Player Override"
    PO_CLICK[Spectator clicks player in list<br/>→ spectator:follow msg]
    PO_ZOOM[+/0/- zoom override]
    PO_RESET[0 key → reset zoom to default]
  end

  subgraph "Final Camera Output"
    FC_POS[x, y world position]
    FC_ZOOM[zoom scale factor]
    FC_ROT[rotation (arena self-rotate sync)]
    FC_SHAKE[shake offset vector]
  end

  EV_LAUNCH --> CI_FOLLOW
  EV_CLASH --> CI_SHAKE
  EV_CLASH --> CI_ZOOM_IN
  EV_SPECIAL --> CI_ZOOM_IN
  EV_SPINOUT --> CI_LOCK
  EV_RINGOUT --> CI_ZOOM_OUT
  EV_WOBBLE --> CI_LOCK
  EV_SERIES --> CI_ZOOM_OUT

  CI_FOLLOW --> AD_OWNER
  CI_FOLLOW --> AD_SPEC
  CI_ZOOM_OUT --> AD_NONE

  AD_OWNER --> CB_LERP
  AD_SPEC --> CB_LERP
  AD_NONE --> CB_LERP
  CI_SHAKE --> CB_SHAKE
  CI_ZOOM_IN --> CB_ZOOM
  CI_LOCK --> CB_TILT

  PO_CLICK --> AD_SPEC
  PO_ZOOM --> CB_ZOOM
  PO_RESET --> CB_ZOOM

  CB_LERP --> FC_POS
  CB_ZOOM --> FC_ZOOM
  CB_TILT --> FC_ROT
  CB_SHAKE --> FC_SHAKE
```

## Camera State Sources

| State Field | Source | Notes |
|------------|--------|-------|
| `beyTiltAngle` | `Beyblade` schema (server sync) | Drives tilt — visual wobble |
| `spectatorFollowTargets` | Room map (sessionId → beybladeId) | Informational — camera is client-side |
| Zoom level | Client-local only | Not synced to server |
| Arena `autoRotate` / `rotationSpeed` | `ArenaState` schema | Camera rotates with arena |

## Spectator Follow Protocol

1. Spectator clicks player name in right-panel list.
2. Client sends `spectator:follow { targetBeybladeId }`.
3. Room stores entry in `spectatorFollowTargets` map.
4. Client camera lerps to target beyblade position each frame.
5. On target beyblade elimination: camera falls back to `AD_NONE`.

## Zoom Shortcuts (CameraControls)

| Key | Action |
|-----|--------|
| `+` | Zoom in |
| `0` | Reset to default zoom |
| `-` | Zoom out |

---
[? Arena Interaction](diagram-arena-interaction.md) &nbsp;�&nbsp; [? Index](../INDEX.md) &nbsp;�&nbsp; [Data Flow ?](diagram-data-flow.md)

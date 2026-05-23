# Diagram 13 — Camera Decision Flow

Camera must remain mostly automatic. Internal camera logic is complex; player interaction is minimal. Current CameraControls.tsx is manual-only — automatic behaviors are the target state.

```mermaid
flowchart TD
  subgraph GameEvents["Gameplay Events (server state delta)"]
    EV_CLASH[ClashEvent\nhigh-force collision\nbeyTiltAngle spike + health delta]
    EV_SPECIAL[SpecialMoveEvent\nspecial-move-camera message\nor comboDamageMultiplier spike]
    EV_KO[KOEvent\nstate.winner set\nor burst flag]
    EV_RINGOUT[RingOutEvent\nbey leaves arena bounds\nisOutOfBounds true]
    EV_COMBO[ComboEvent\ncomboDamageMultiplier > 1\nor combo fire flag]
    EV_MODECHANGE[ModeChangeEvent\naggressiveness / gripFactor delta]
    EV_RAIL[RailEvent\nxtremeEngaged = true]
    EV_SERIES[SeriesEndEvent\nstate.status = series-finished]
  end

  subgraph CameraIntent["Camera Intent Layer"]
    CI_FRAME[What should we frame?\nNearest action / most important event\npriority queue by event severity]
  end

  subgraph AutoDecision["Automatic Camera Decision (engine-driven)"]
    AD_FOLLOW[Target Follow\nTrack active beyblades\ncenter + margin auto-adjust]
    AD_IMPACT[Impact Framing\nZoom to collision point\nshake proportional to force]
    AD_SPECIAL[Special Move Framing\nCinematic zoom to caster\nTrack special move arc]
    AD_KO[KO Framing\nZoom to burst / ring-out\nSlow follow on exit arc]
    AD_MULTI[Multi-Target Framing\nFit all active beys in frame\ndynamic zoom out]
    AD_ARENA[Arena Overview\nPull back on game start / end\nreveal arena layout]
    AD_RAIL[Rail Tracking\nFollow bey along rail\ntrack exit scoring zone]
  end

  subgraph CameraBehaviors["Camera Behavior Set"]
    CB_SHAKE[Camera Shake\namplitude + frequency + decay\non collision / burst / KO]
    CB_ZOOM[Dynamic Zoom\nsmooth zoom in/out\non special / impact / multi-target]
    CB_CUT[Cinematic Cut\nhard cut to new framing\non KO / special peak / series end]
    CB_ORBIT[Orbit / Pan\nslow orbit around arena center\non intro / end sequence]
    CB_SLOWMO[Slow Motion\nvisual only — client-side only\non burst peak / KO peak]
  end

  subgraph PlayerOverride["Player Controls (minimal — CameraControls.tsx existing)"]
    PO_ZOOM_IN[Zoom In (+)\nexisting]
    PO_ZOOM_OUT[Zoom Out (−)\nexisting]
    PO_RESET[Reset (0)\nexisting]
    PO_FUTURE_ROT[Rotate\nfuture — mouse drag or right stick]
  end

  subgraph FinalCamera["Final Camera Output"]
    FC[PixiJS viewport transform\nscale + translate + rotation\napplied to stage container]
  end

  GameEvents --> CameraIntent
  EV_CLASH --> CI_FRAME
  EV_SPECIAL --> CI_FRAME
  EV_KO --> CI_FRAME
  EV_RINGOUT --> CI_FRAME
  EV_COMBO --> CI_FRAME
  EV_MODECHANGE --> CI_FRAME
  EV_RAIL --> CI_FRAME
  EV_SERIES --> CI_FRAME

  CameraIntent --> AutoDecision
  CI_FRAME --> AD_FOLLOW
  CI_FRAME --> AD_IMPACT
  CI_FRAME --> AD_SPECIAL
  CI_FRAME --> AD_KO
  CI_FRAME --> AD_MULTI
  CI_FRAME --> AD_ARENA
  CI_FRAME --> AD_RAIL

  AutoDecision --> CameraBehaviors
  AD_FOLLOW --> CB_ZOOM
  AD_IMPACT --> CB_SHAKE
  AD_IMPACT --> CB_ZOOM
  AD_SPECIAL --> CB_CUT
  AD_SPECIAL --> CB_SLOWMO
  AD_KO --> CB_CUT
  AD_KO --> CB_SHAKE
  AD_MULTI --> CB_ZOOM
  AD_ARENA --> CB_ORBIT
  AD_RAIL --> CB_ORBIT

  CameraBehaviors --> PlayerOverride
  PlayerOverride --> FinalCamera
  CB_SHAKE --> FinalCamera
  CB_ZOOM --> FinalCamera
  CB_CUT --> FinalCamera
  CB_ORBIT --> FinalCamera
  CB_SLOWMO --> FinalCamera

  PO_ZOOM_IN --> FinalCamera
  PO_ZOOM_OUT --> FinalCamera
  PO_RESET --> FinalCamera
```

## Camera Behavior Table

| Trigger | Camera Behavior | Automatic? | Player Override? | Evidence / Priority |
|---------|----------------|-----------|-----------------|---------------------|
| Bey collision (normal) | Slight shake proportional to force | ✅ auto | ✅ zoom controls | Always active |
| Heavy collision (high force) | Strong shake + brief zoom in | ✅ auto | ✅ | Force threshold check |
| Combo fire | Brief zoom in + flash | ✅ auto | ✅ | comboDamageMultiplier spike |
| Special move activate | Cinematic zoom + track caster | ✅ auto | ❌ (blocked during cinematic) | special-move-camera event |
| KO (burst) | Cut to burst point + shake | ✅ auto | ❌ (blocked during KO) | state.winner set |
| Ring-out | Pan to arena edge + slow follow | ✅ auto | ❌ | isOutOfBounds |
| Rail riding (BX) | Track along rail path | ✅ auto | ✅ | xtremeEngaged = true |
| Mode change | Brief flash + zoom | ✅ auto | ✅ | aggressiveness delta |
| Game start | Wide arena overview | ✅ auto | ❌ | status → warmup |
| Series end | Victory pan + fade | ✅ auto | ❌ | status = series-finished |
| Multi-bey spread | Dynamic zoom out to fit all | ✅ auto | ✅ | multiple bey positions |
| Spectator follow | Lock to selected bey | N/A (spectator intent) | ✅ click different bey | spectator:follow message |
| Zoom in | Zoom in viewport | ❌ manual | ✅ (+) key | CameraControls.tsx |
| Zoom out | Zoom out viewport | ❌ manual | ✅ (−) key | CameraControls.tsx |
| Reset | Reset to default zoom | ❌ manual | ✅ (0) key | CameraControls.tsx |

## Current vs. Target Camera State

| Feature | Current State | Target State |
|---------|-------------|-------------|
| Zoom in/out | ✅ manual only | ✅ preserved + auto zoom added |
| Reset | ✅ manual only | ✅ preserved |
| Collision shake | ❌ absent | NEW: shake from health/force delta |
| Special cinematic | ⚠️ server sends event, client ignores | NEW: full cinematic framing |
| KO framing | ❌ absent | NEW: cut to burst/ring-out |
| Rail tracking | ❌ absent (BX feature) | NEW: with rail_lock mechanic |
| Multi-bey fit | ❌ absent | NEW: dynamic zoom-to-fit |
| Spectator follow | ✅ manual click in list | ✅ preserved, enhance with auto-track option |
| Slow motion | ❌ absent | NEW: client-side only, presentation layer |

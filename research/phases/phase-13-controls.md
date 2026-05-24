[← Phase 12: Seed Plan](phase-12-seed-plan.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 14: Game Modes →](phase-14-game-modes.md)

---

# Phase 13 — Controls / Camera / Audio

> Stage 13 | Source: useGameInput.ts + CameraControls.tsx + HUD components

## 1. Input System Audit

### Bitmask Encoding Table (current)

| Bit | Key | Action | Bitmask Value |
|-----|-----|--------|---------------|
| 0 | A / ArrowLeft / Gamepad Left Stick Left | moveLeft | 0x0001 |
| 1 | D / ArrowRight / Gamepad Left Stick Right | moveRight | 0x0002 |
| 2 | W / ArrowUp / Gamepad Left Stick Up | moveUp | 0x0004 |
| 3 | S / ArrowDown / Gamepad Left Stick Down | moveDown | 0x0008 |
| 4 | J / Gamepad A/Cross | attack | 0x0010 |
| 5 | K / Gamepad X/Square | defense | 0x0020 |
| 6 | L / Gamepad B/Circle | dodge | 0x0040 |
| 7 | I / Gamepad Y/Triangle | jump | 0x0080 |
| 8 | Space (hold) / Gamepad LB/L1 | chargeHeld | 0x0100 |
| 9 | Space (tap < 150ms) / Gamepad RB/R1 | specialTap | 0x0200 |

Note: `comboKeys` (an array of action name strings) is appended to the input object but is NOT part of the bitmask — it is carried alongside as a plain JS field so the server's `detectCombo()` can track sliding-window key sequences.

### Intent Layer Analysis

The intent layer is **partially separated** from room code via the shared `InputHandler` module (`server/shared/rooms/InputHandler.ts`). `applyMovementInput()` and `applyActionInput()` are standalone functions that receive a `PlayerInput` struct and write into the `Beyblade` schema. However, the following is **embedded in each room**:

- Special move dispatch (`handleSpecialMove(beyblade)`) is defined per-room (identical copy in TryoutRoom, BattleRoom, AIBattleRoom, TournamentBattleRoom).
- Combo detection (`detectCombo()` call + broadcast) is inlined into each room's `handleInput`.
- Control-lock check (`controlLockedUntilMs`) is read inside `InputHandler` but the lock-source string (`"special"` / `"combo"`) is written by room-level code.

Status: **partially separated** — movement/action application is shared; special move execution and combo detection logic are duplicated across rooms.

### Unified Action Table (Rule 12)

| Intent | Keyboard | Mouse | Gamepad | Touch | Notes |
|--------|----------|-------|---------|-------|-------|
| Move left | A / ArrowLeft | — | Left stick left | — | Merged with gamepad via OR |
| Move right | D / ArrowRight | — | Left stick right | — | Dead zone 0.15 |
| Move up | W / ArrowUp | — | Left stick up | — | |
| Move down | S / ArrowDown | — | Left stick down | — | |
| Attack | J | — | A / Cross (btn 0) | — | Single-press attack buff |
| Defense | K | — | X / Square (btn 2) | — | Hold → stance |
| Dodge | L | — | B / Circle (btn 1) | — | |
| Jump | I | — | Y / Triangle (btn 3) | — | Airborne physics |
| Charge (hold) | Space (hold) | — | LB / L1 (btn 4) | — | Power regen while held |
| Special (tap) | Space (tap < 150ms) | — | RB / R1 (btn 5) | — | One-shot per press |
| Zoom in | + or = | — | — | — | Camera only; no server bitmask bit |
| Zoom out | - or _ | — | — | — | Camera only |
| Zoom reset | 0 | — | — | — | Camera only |
| Spectator follow | — | Click player name | — | — | Sends `spectator:follow` message |

### Input System Gaps

| Gap | Description | Required Work |
|-----|-------------|---------------|
| Touch / mobile | No touch input at all. No virtual joystick, no tap-to-action. | Add virtual d-pad + action buttons; encode into same uint16 bitmask |
| Mouse input | No mouse aiming, no mouse-button attack. | Decide if mouse aim (facing direction) should be added as a separate axis channel |
| Gamepad button mapping inconsistency | `gamepadSpecialTapRef` correctly prevents re-fire, but the `SPACE_TAP_THRESHOLD_MS` tap detection has no equivalent tap-threshold guard for gamepad RB tap vs hold. | Mirror the `SPACE_TAP_THRESHOLD_MS` logic for gamepad button 5 hold duration |
| Special move activation is duplicate | `handleSpecialMove()` is copy-pasted across four rooms (TryoutRoom, BattleRoom, AIBattleRoom, TournamentBattleRoom). | Extract into `shared/rooms/SpecialMoveHandler.ts` |
| No input replay / record | The uint16 heartbeat design supports deterministic replay but no record/playback infrastructure exists. | Add replay recorder if needed for replay feature |
| comboKeys not in bitmask | `comboKeys` is sent as a JS array alongside the encoded number; if the server receives only the raw bitmask number and calls `decodeBitmask()`, comboKeys are lost. | Confirm `normalizeInput()` handles this; document the two-field contract clearly |

---

## 2. Camera System Audit

### Current Automatic Behaviors

| Behavior | Implemented? | Notes |
|----------|-------------|-------|
| Follow own beyblade (smooth lerp) | Yes — described in diagram; PixiRenderer lerps camera toward owned bey each frame | Implemented client-side in `PixiRenderer.ts` |
| Follow spectator-selected beyblade | Yes — `spectator:follow` message wires target; client camera lerps to target position | Server stores in `spectatorFollowTargets` map (informational) |
| Zoom in on collision / special move | **NO** — `SpecialMoveCameraData` in `useColyseus.ts:50-57` has a `zoomFactor` field but it is not triggered by collision events. `BattleGamePage.tsx:140-145` collision handler only spawns particles + plays sound. [FACT: code-confirmed] | Manual zoom buttons only. Auto-zoom on collision is an unwired gap. |
| Screen shake on collision | **PARTIAL** — shake IS implemented for `aerial_smash` combo (`PixiRenderer.ts:1488-1503`, intensity=4) and meteor strikes (`PixiRenderer.ts:1159-1186`, magnitude from `damageDealt`). Standard bey-to-bey collision has NO shake. [FACT: code-confirmed] | |
| Lock camera on spinning-out bey | Partial — diagram specifies `CI_LOCK → CB_TILT`; `beyTiltAngle` field exists in schema | Visual tilt camera tracking not confirmed from CameraControls code |
| Zoom out on ring-out / series end | Partial — diagram specifies `EV_RINGOUT / EV_SERIES → CI_ZOOM_OUT` | Not confirmed in CameraControls; would be in PixiRenderer |
| Arena auto-rotate sync | Yes — `ArenaState.autoRotate` + `rotationSpeed` propagated to client; renderer reads these | `advanceArenaRotation()` runs server-authoritative |
| Fallback when followed bey eliminated | **PARTIAL — falls back to another active bey, NOT arena center.** `BattleGamePage.tsx:113-119` auto-selects first non-AI active bey; `PixiRenderer.ts:264-284` calls `setFollowTarget()`. No "arena center" camera mode exists. [FACT: code-confirmed] | |

### Current Manual Controls

| Control | Key | Implemented? |
|---------|-----|-------------|
| Zoom in | `+` or `=` | Yes — `CameraControls.tsx` wires `onZoomIn` |
| Zoom reset | `0` | Yes — `CameraControls.tsx` wires `onZoomReset` |
| Zoom out | `-` or `_` | Yes — `CameraControls.tsx` wires `onZoomOut` |
| Pinch-to-zoom | Touch gesture | Mentioned in comment ("Pinch handled by the renderer separately") — not in CameraControls |
| Click to follow (spectator) | Mouse click on player list | Sends `spectator:follow`; camera is client-side |
| Spectator follow fallback on elimination | **YES** — auto-selects first non-AI active bey (`BattleGamePage.tsx:113-119`). Falls back to any bey if none active. Does NOT snap to arena center. [FACT: code-confirmed] | |

### Camera Decision Flow (from diagram)

The diagram defines a clean `GameplayEvent → CameraIntent → AutoDecision → CameraBehavior → PlayerOverride → FinalCamera` pipeline. Comparing against the code:

- **Matches**: `PO_ZOOM` (manual `+/0/-` keys), `PO_CLICK` (spectator follow message), `CB_ZOOM` (CameraControls), `CB_LERP` (described in `usePixiRenderer` / PixiRenderer).
- **Not confirmed in audited files**: `CB_SHAKE` (shake amplitude from collision), `CB_TILT` (tilt tracking `beyTiltAngle`), event-triggered `CI_ZOOM_IN` on clash/special, `CI_LOCK` on spin-out, `CI_ZOOM_OUT` on ring-out/series end, `AD_NONE` fallback. These are expected to live in `PixiRenderer.ts` but were not in scope for this audit.
- **Missing entirely**: The `FC_ROT` (rotation) output from `CB_TILT` is not wired through `CameraControls`; tilt would need to come from `beyTiltAngle` schema field polled each render frame.

### Camera Gaps

| Gap | Required Work | Priority |
|-----|---------------|----------|
| Event-triggered automatic zoom-in (collision, special move) | Wire `CB_ZOOM` in PixiRenderer on `collision` / `special-move` broadcasts. `SpecialMoveCameraData.zoomFactor` field already exists in `useColyseus.ts:50-57` — just needs to be consumed. [FACT: gap confirmed by code audit] | Medium |
| Screen shake on standard collision | Shake already exists for `aerial_smash` (`PixiRenderer.ts:1488`) and meteor (`PixiRenderer.ts:1159`). Extend same pattern to standard `collision` broadcast, reading `damageDealt` from payload for magnitude. [FACT: gap confirmed by code audit] | Medium |
| Camera tilt tracking `beyTiltAngle` | Camera rotation channel must track `beyblade.beyTiltAngle`; field exists in schema | Low |
| Automatic zoom-out on ring-out / series end | PixiRenderer should zoom out when `ring-out` or `series-end` broadcast received | Medium |
| Spectator follow fallback to arena center | Currently falls back to another active bey (`BattleGamePage.tsx:113-119`). True "arena center" mode does not exist. If desired, add `setFollowTarget(null)` path that centers camera on arena origin. [FACT: gap confirmed] | Low |
| Pinch-to-zoom (mobile) | Renderer handles it in comment but no implementation confirmed | Low |
| Camera profile per arena | No per-arena camera config exists (no `camera_profiles` Firestore collection) | Low |

---

## 3. HUD Inventory

| HUD Component | File | What it shows | Data Source | Status |
|---------------|------|---------------|-------------|--------|
| SpecialMoveHUD | `client/src/components/game/SpecialMoveHUD.tsx` | Special move icon + name, power bar (0–100%), cooldown ring (SVG), "Ready to Use" pulse, screen flash on activation | `myBeyblade.power`, `myBeyblade.specialCooldown`, `specialMoveData` (Firestore), `lastSpecialMoveFired` broadcast | Implemented |
| ComboHUD | `client/src/components/game/ComboHUD.tsx` | Attached-combo strip (max 3) with sequence keys, cooldown bar, power-insufficient warning; fired-combo history (last 4 entries); combo charge bar (0–100%); COMBO! popup float | `attachedComboIds`, `cooldowns` (comboCooldowns schema map), `power`, `comboChargeScale`, `comboMap` (from `gameDataStore`) | Implemented |
| CameraControls | `client/src/components/game/CameraControls.tsx` | Zoom in (+), reset (0), zoom out (−) buttons top-right; mirrors keyboard shortcuts | Callback props from page; no server data | Implemented |
| LoadingProgress | `client/src/components/LoadingProgress.tsx` | 6-step connection/asset stepper bar (connecting-ws → joining-room → loading-arena-assets → loading-beyblade-assets → loading-audio-assets → warmup-ready) | `useColyseus` hook; `state.status` | Implemented |
| ComboHUD charge bar | Embedded in ComboHUD | Charge progress 0–1 for a charged combo key being held | `comboChargeScale` schema field | Implemented |
| Series HUD | Likely in BattleGamePage / TournamentBattleGamePage | Series score (e.g. 1–0), current game number, BO indicator | `state.seriesWins`, `state.currentGame`, `state.targetWins` | Implemented (in page-level components, not a standalone component) |
| Countdown | `client/src/components/game/Countdown.tsx` | 3–2–1–GO countdown at warmup start | Local timer after `match-warmup` broadcast; SoundManager `countdown-tick` / `countdown-go` | Implemented |
| AudioManager controls | Not a visible HUD — settings page or overlay | Volume slider, mute toggle | `SoundManager` singleton (localStorage persisted) | Implemented (SoundManager class), but no in-game volume overlay confirmed |

---

## 4. Audio System Audit

`SoundManager` (`client/src/game/audio/SoundManager.ts`) is implemented as a singleton. It uses Web Audio API with synthesized oscillator fallbacks. Real asset URLs can be registered per-event via `registerAssetUrl(event, url)` — the `sound_assets` Firestore collection exists for this purpose but wiring is noted as a "Phase 13 follow-up" in the file comment.

| Event | SFX (synthesized fallback) | Wired? |
|-------|---------------------------|--------|
| `collision` | Square wave 220 Hz, 90ms | **Wired in all 3 pages** — `BattleGamePage.tsx:145`, `AIBattleGamePage.tsx`, `TournamentBattleGamePage.tsx` (gap fixed session 12). [FACT: code-confirmed] |
| `spin-out` | Sawtooth sweep 600→80 Hz, 350ms | Wired in `BattleGamePage.tsx` (found in grep) |
| `special-move` | Triangle sweep 880→1760 Hz, 420ms | Wired in `BattleGamePage.tsx` |
| `combo` | Triangle 660 Hz, 220ms | Wired in `BattleGamePage.tsx` |
| `portal` | Sine sweep 1320→660 Hz, 180ms | Not confirmed |
| `pit-enter` | Sawtooth sweep 120→30 Hz, 300ms | Not confirmed |
| `switch-triggered` | Square 1100 Hz, 90ms | Not confirmed |
| `zone-enter` | Sine 440 Hz, 140ms | Not confirmed |
| `gravity-pulse` | Sine sweep 60→30 Hz, 500ms | Not confirmed |
| `countdown-tick` | Square 800 Hz, 80ms | Wired in `Countdown.tsx` |
| `countdown-go` | Square 1200 Hz, 240ms | Wired in `Countdown.tsx` |
| `victory` | Triangle sweep 880→1760 Hz, 600ms | Wired in `BattleGamePage.tsx` |
| `defeat` | Sawtooth sweep 220→80 Hz, 700ms | Wired in `BattleGamePage.tsx` |
| `ui-click` | Square 1000 Hz, 40ms | Not confirmed |

**Volume / mute**: master volume (0–1) and muted flag persisted to `localStorage`. Web Audio context created lazily on first user interaction to satisfy browser autoplay policy.

**Background music**: No music system exists. `SoundManager` is SFX-only. There is no BGM player, no music track loading, and no per-arena music selection.

---

## 5. Controls Schema (for admin authoring)

What fields would go in `camera_profiles` and `audio_profiles` collections:

```typescript
interface CameraProfile {
  id: string;
  displayName: string;

  /** Default zoom level (1.0 = 100%). */
  defaultZoom: number;
  /** Min zoom level reachable via - key. */
  minZoom: number;
  /** Max zoom level reachable via + key. */
  maxZoom: number;
  /** Zoom step per + / - press. */
  zoomStep: number;

  /** Lerp factor for position following (0–1; higher = snappier). */
  followLerpFactor: number;

  /** Screen shake amplitude multiplier (1.0 = standard). */
  shakeAmplitudeMultiplier: number;
  /** Screen shake decay rate (0–1 per frame). */
  shakeDecayRate: number;

  /** Auto-zoom-in on collision (true/false). */
  autoZoomOnCollision: boolean;
  /** Duration of auto-zoom-in effect (ms). */
  autoZoomInDurationMs: number;
  /** Auto-zoom-out trigger: "ring-out" | "series-end" | "both" | "none". */
  autoZoomOutTrigger: "ring-out" | "series-end" | "both" | "none";

  /** Whether to tilt camera angle to match beyTiltAngle (gyroscopic wobble visual). */
  tiltTrackingEnabled: boolean;

  /** Arena auto-rotation sync (should always be true). */
  arenaRotationSync: boolean;
}

interface AudioProfile {
  id: string;
  displayName: string;

  /** Master volume override (0–1). Null = use player localStorage preference. */
  defaultVolume: number | null;

  /** Per-event overrides — maps SoundEventKey to a custom asset URL. */
  soundAssets: Partial<Record<
    | "collision" | "spin-out" | "special-move" | "combo"
    | "portal" | "pit-enter" | "switch-triggered" | "zone-enter"
    | "gravity-pulse" | "countdown-tick" | "countdown-go"
    | "victory" | "defeat" | "ui-click",
    string
  >>;

  /** Background music URL (null = no music). */
  bgmUrl: string | null;
  /** Background music loop (true = seamless loop). */
  bgmLoop: boolean;
  /** Background music volume relative to master (0–1). */
  bgmVolume: number;

  /** Collision sound cooldown — minimum ms between collision sounds (prevents rapid-fire spam). */
  collisionSoundCooldownMs: number;
}
```

---

## 6. Implementation Priority

| System | Priority | Effort | Notes |
|--------|----------|--------|-------|
| Extract special move handler to shared module | High | Low | Eliminate 4-way copy-paste in rooms |
| Wire remaining SoundManager events (portal, pit-enter, switch, zone, gravity-pulse, ui-click) | High | Low | All synthesized fallbacks exist; just needs `SoundManager.play()` calls in game page listeners |
| Event-triggered automatic camera zoom-in on collision | Medium | Medium | Needs PixiRenderer integration; diagram already specifies behavior |
| Screen shake on collision with force amplitude | Medium | Medium | PixiRenderer shake pass; reads collision damage magnitude from broadcast |
| Touch / mobile virtual controls | Medium | High | Virtual d-pad + action buttons; encodes into existing uint16 bitmask |
| Background music system | Medium | Medium | BGM player on top of SoundManager; per-arena music asset |
| Camera tilt tracking beyTiltAngle | Low | Low | Single rotation channel read from schema each render frame |
| In-game volume overlay (mute / volume slider accessible during match) | Low | Low | Small HUD panel; SoundManager already handles persistence |
| camera_profiles Firestore collection + admin UI | Low | Medium | Enables per-arena camera tuning without code changes |
| audio_profiles Firestore collection + admin UI | Low | Medium | Enables per-arena custom SFX / music without code changes |
| Gamepad special-tap hold guard | Low | Low | Mirror SPACE_TAP_THRESHOLD_MS logic for gamepad RB |
| Input replay / record infrastructure | Low | High | Deterministic uint16 heartbeat design supports this; no current use case |

---

## 7. Session 25 Corrections Applied (2026-05-24)

### 2.5D A/D Strafe Swap Bug — FIXED

**File**: `server/shared/rooms/InputHandler.ts` → `applyMovementInput()`

The `moveLeft` (A key) and `moveRight` (D key) force vectors in 2.5D mode (`is25D = true`) were exactly swapped. Coordinate convention (y increases downward, rotation r=0 faces East/+X):

| Key | Correct vector | Old (wrong) vector |
|-----|---------------|-------------------|
| A (moveLeft) | `(sin(r), -cos(r)) × 1.5` — CCW-90° from facing = left strafe | `(-sin(r), cos(r))` — was RIGHT strafe |
| D (moveRight) | `(-sin(r), cos(r)) × 1.5` — CW-90° from facing = right strafe | `(sin(r), -cos(r))` — was LEFT strafe |

W (forward) and S (backward) were correct and not changed.

### ControlsLegend isTryout Mode

`client/src/components/game/ControlsLegend.tsx` now accepts `isTryout?: boolean`. In tryout/solo mode:
- IJKL (Jump/Attack/Defense/Dodge) rows hidden
- Space (tap) Special Move row hidden
- Italic note shown: "Combat keys (IJKL) available in battle mode"
- `TryoutGamePage.tsx` passes `<ControlsLegend isTryout />`.

This prevents user confusion when IJKL keys appear in the overlay but do nothing in solo practice mode.

### TryoutGamePage Arena Always Visible

Previously the render call was gated on `phase === "playing"` — the arena floor was not drawn during the 3-2-1 countdown or launch QTE. Fixed by moving the render call outside the phase gate: arena and beyblade are rendered from the moment `arenaConfig.current` is loaded, regardless of phase. Physics computation is still gated on `phase === "playing"`.


---

## Implementation Status (audit 2026-05-24)

| Component | Status |
|-----------|--------|
| uint16 bitmask bits 0-9 | Done |
| Keyboard WASD + bits 4-9 in useGameInput.ts | Done |
| Camera controls + spectator follow | Done |
| Attitude bits 10-12 (J/K/L) | Missing - Phase 24 |
| Gamepad input reader | Missing - Phase 24 |
| Touch controls (virtual d-pad) | Missing - Phase 24 |
| Input dedup N3 optimization | Missing - Phase 26 |

---

[← Phase 12: Seed Plan](phase-12-seed-plan.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 14: Game Modes →](phase-14-game-modes.md)

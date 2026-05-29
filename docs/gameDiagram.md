# Game UI Diagrams

All diagrams reflect the actual component code. Coordinates and sizes are
taken directly from `GameShell.tsx`, `LaunchPhase.tsx`, `QTEOverlay.tsx`,
`CollisionQTEOverlay.tsx`, `Countdown.tsx`, `KOOverlay.tsx`,
`VictoryOverlay.tsx`, and `GameRoomPage.tsx`.

---

## Table of Contents

1. [Shell — Landscape (GBA)](#1-shell--landscape-gba)
2. [Shell — Portrait (GBC)](#2-shell--portrait-gbc)
3. [In-Game View (default, in-progress)](#3-in-game-view-default-in-progress)
4. [Loading Screen](#4-loading-screen)
5. [Countdown (warmup → launching)](#5-countdown-warmup--launching)
6. [Launch QTE — String Launcher](#6-launch-qte--string-launcher)
7. [Launch QTE — Ripcord Launcher](#7-launch-qte--ripcord-launcher)
8. [Launch Cinematic ("LET IT RIP")](#8-launch-cinematic-let-it-rip)
9. [Collision QTE (clash mash)](#9-collision-qte-clash-mash)
10. [Counter/Special QTE (sequence block)](#10-counterspecial-qte-sequence-block)
11. [KO Overlay](#11-ko-overlay)
12. [Burst Overlay](#12-burst-overlay)
13. [Victory Overlay](#13-victory-overlay)
14. [BitBeast Cinematic](#14-bitbeast-cinematic)
15. [Button Mapping Reference](#15-button-mapping-reference)

---

## 1. Shell — Landscape (GBA)

Rendered when `window.matchMedia('(orientation: portrait)').matches === false`.
Console body is `min(96vw, calc(96vh * 1.72))` × `min(96vh, calc(96vw / 1.72))`.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  [.game-shell — position:fixed inset:0 — radial dark gradient background]    ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │  ┌──L──┐                                                   ┌──R──┐  │   ║
║  │  │█████│ ← shoulder tab (80×26px, grey, chargeHeld)        │█████│  │   ║
║  │  └─────┘                                         (specialTap) └─────┘  │   ║
║  │                                                                          │   ║
║  │  ┌─────────────────┐  ┌──────────────────────────┐  ┌──────────────┐  │   ║
║  │  │                 │  │  · BEYBLADE GAME ·        │  │ ● POWER      │  │   ║
║  │  │      ▲          │  │ ┌────────────────────┐   │  │  (green LED) │  │   ║
║  │  │   ◀  +  ▶       │  │ │                    │   │  │              │  │   ║
║  │  │      ▼          │  │ │  [game-viewport]   │   │  │      X       │  │   ║
║  │  │                 │  │ │  .game-viewport-   │   │  │   Y     A    │  │   ║
║  │  │   (90px D-pad)  │  │ │  slot fills bezel  │   │  │      B       │  │   ║
║  │  │                 │  │ │                    │   │  │              │  │   ║
║  │  │                 │  │ └────────────────────┘   │  │  ≡≡≡≡≡≡     │  │   ║
║  │  │  ┌────┐ ┌─────┐ │  │    GAME BOY  ADVANCE     │  │  ≡≡≡≡≡      │  │   ║
║  │  │  │SEL │ │ STA │ │  └──────────────────────────┘  │  ≡≡≡≡≡≡     │  │   ║
║  │  │  └────┘ └─────┘ │   ↑ screen w/bezel padding      │  (speaker)  │  │   ║
║  │  └─────────────────┘                                  └─────────────┘  │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

LEFT SECTION (20% width):
  D-pad 90px: ▲/▼/◀/▶ = moveUp / moveDown / moveLeft / moveRight
  SELECT oval (44px) = specialTap  ⚠ currently mapped to `jump` — BUG
  START  oval (44px) = exit        ⚠ currently mapped to `attack` — BUG

CENTER:
  Title label: "BEYBLADE GAME" (above bezel)
  ScreenBezel → .game-viewport-slot (position:relative, fills bezel)
  Label: "GAME BOY ADVANCE" (below bezel)

RIGHT SECTION (26% width):
  POWER LED (green, top-right)
  ActionCluster 114px container, 42px buttons:
    X (top,  50%/12%)  = dodge
    A (right, 85%/50%) = attack
    B (bottom,50%/88%) = defense
    Y (left,  15%/50%) = jump
  Speaker: 5 lines (width 36px, rotate -10deg)

SHOULDER TABS (sit above top edge, outside main row):
  L (left, 80×26px,  chargeHeld)
  R (right, 80×26px, specialTap)
```

---

## 2. Shell — Portrait (GBC)

Rendered when `window.matchMedia('(orientation: portrait)').matches === true`.
Full screen height, column layout.

```
╔═══════════════════════╗
║  [.game-shell bg]      ║
║                        ║
║  ┌────────────────┐    ║  ← screen section
║  │  [dark bezel   │    ║    width:100%, aspect-ratio:1/1, max-height:58vh
║  │   #0a0b14]     │    ║
║  │                │    ║
║  │  ┌──────────┐  │    ║  ← screen inner (inset 10px top/bottom, 14px L/R)
║  │  │          │  │    ║    border-radius:8px, boxShadow indigo glow
║  │  │  [game-  │  │    ║
║  │  │  viewport│  │    ║    .game-viewport-slot sits here
║  │  │  -slot]  │  │    ║
║  │  │          │  │    ║
║  │  └──────────┘  │    ║
║  │                │    ║
║  │  GAME BOY COLOR│    ║  ← label bar (height:28px, bottom of bezel)
║  └────────────────┘    ║
║                        ║
║       Nintendo         ║  ← emboss text (rgba black 25%, controller body)
║                        ║
║  ┌─────────┐ ┌──────┐  ║  ← main controls row (flex, space-between)
║  │   ▲     │ │  X   │  ║
║  │ ◀ + ▶   │ │Y   A │  ║    D-pad 120px (left 45%)
║  │   ▼     │ │  B   │  ║    ActionCluster 130px (right 45%)
║  └─────────┘ └──────┘  ║
║                        ║
║  ┌────┐┌────┐  ●●●●●●  ║  ← bottom row
║  │SEL ││STA │  ●●●●●●  ║    SELECT+START wide ovals (52px each)
║  └────┘└────┘  ●●●●●●  ║    Speaker 6×5 dot grid (right)
║                ●●●●●●  ║
║                ●●●●●●  ║
╚═══════════════════════╝

IMPORTANT — MISSING in portrait:
  ⚠ No L shoulder button (chargeHeld has no touch target in portrait)
  ⚠ No R shoulder button (specialTap only reachable via SELECT — also wrong)

Button assignments (same bugs as landscape):
  SELECT (52px wide oval) = jump    ← BUG, should be specialTap
  START  (52px wide oval) = attack  ← BUG, should be exit
  X = dodge  A = attack  B = defense  Y = jump
```

---

## 3. In-Game View (default, in-progress)

Everything inside `.game-viewport-slot` (`position:relative`).
`.game-overlay-layer` is `position:absolute inset:0 z-index:10`.

```
┌──────────────────────────────────────────────────────────────┐
│  .game-viewport-slot                                          │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  [PixiJS canvas — position:absolute inset:0]           │  │
│  │                                                         │  │
│  │         ╔═══════════════════════════╗                  │  │
│  │         ║  [arena layer]            ║                  │  │
│  │         ║     [features layer]      ║  ← spin zones,  │  │
│  │         ║       [beyblades]         ║    obstacles etc │  │
│  │         ║      ⚙  ⊕  ⚙            ║                  │  │
│  │         ║       [particles]         ║  ← hit sparks   │  │
│  │         ║         [HUD layer]       ║  ← PixiJS HUD   │  │
│  │         ╚═══════════════════════════╝                  │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─ .game-overlay-layer (absolute inset:0, z-index:10) ───┐  │
│  │                                                          │  │
│  │  [all React overlays render here — see sections 5-13]   │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  SPIN 84%  [████████████░░░░]   [+] [0] [-]   [✕ EXIT]     │
│  └── shown only during status="in-progress", myBeyblade set  │
└──────────────────────────────────────────────────────────────┘

HUD bar (position:absolute bottom:0 left:0 right:0):
  Left:  "SPIN 84%"  +  colored progress bar (type color → amber → red)
  Right: Camera zoom buttons CameraControls  +  Exit button (red)
```

---

## 4. Loading Screen

Shown when `showLoading === true` (status="waiting" and step !== "warmup-ready").
`LoadingProgress` fills the overlay layer.

```
┌──────────────────────────────────────────────────────────────┐
│  .game-overlay-layer                                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [LoadingProgress]                                   │    │
│  │                                                       │    │
│  │  Step 1/6: connecting-ws  ●────────────────────      │    │
│  │  Step 2/6: joining-room   ○                          │    │
│  │  Step 3/6: arena assets   ○                          │    │
│  │  Step 4/6: bey assets     ○                          │    │
│  │  Step 5/6: audio assets   ○                          │    │
│  │  Step 6/6: warmup-ready   ○                          │    │
│  │                                                       │    │
│  │  [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░]  33%      │    │
│  │                                                       │    │
│  │  (on error: bar turns red, "Retry" button appears)   │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Countdown (warmup → launching)

`Countdown` is `position:absolute inset:0`, shown during status="warmup" and
the transition flash to "launching". Transparent background normally; flashes
`rgba(255,200,60,0.18)` on each second tick.

```
┌──────────────────────────────────────────────────────────────┐
│  .game-overlay-layer                                          │
│                                                               │
│  [arena still fully visible behind — no scrim]               │
│                                                               │
│                          ┌───┐                               │
│                          │ 3 │  ← text-[8rem] white mono    │
│                          └───┘    scales to text-[10rem]     │
│                                   + text-[#ffcc44] on flash  │
│                                                               │
│  When status → "launching":                                   │
│                                                               │
│                     ┌─────────────┐                          │
│                     │ Let It Rip! │  ← same element, yellow  │
│                     └─────────────┘    scale 1.12            │
│                                                               │
└──────────────────────────────────────────────────────────────┘

No separate Countdown panel — just one centered text element.
Flash background (rgba yellow) covers the whole viewport briefly.
```

---

## 6. Launch QTE — String Launcher

`LaunchPhase` is `position:absolute inset:0`. Content panel is
`max-w-[460px]`, centered. Shown during status="launching" for both
local and server rooms.

```
┌──────────────────────────────────────────────────────────────┐
│  [dark scrim: rgba(0,0,0,0.72) or 0.55 if worldBg set]       │
│  [optional world background image/color blurred behind]       │
│                                                               │
│  ╔═══════════════════════════════════════════════╗           │
│  ║  LAUNCH PANEL  (bg rgba(15,23,42,0.92))        ║           │
│  ║  border: #334155 → #ff6b35 when charging       ║           │
│  ║  rounded-[20px], px-8 py-7, max-w-[460px]      ║           │
│  ║                                                ║           │
│  ║  5s  [████████████████████░░░░░]               ║  timer   │
│  ║  (blue → yellow ≤3s → red ≤2s)                 ║           │
│  ║                                                ║           │
│  ║  ────────────────────────────────────          ║  string  │
│  ║              [⚙]                               ║  rail    │
│  ║  (⚙ starts near right, slides left as power    ║  (h:64px)│
│  ║   charges; green border + glow at perfect zone)║           │
│  ║                                                ║           │
│  ║  Power                           72%           ║           │
│  ║  ┌──────────────────────────────────────────┐  ║           │
│  ║  │ ███████████████░PERFECT░░│░░░░░░░░░ MAX  │  ║  h:14px  │
│  ║  └──────────────────────────────────────────┘  ║           │
│  ║    0          ^63%       ^67%            100%   ║           │
│  ║           PERFECT zone (95–100 of 150 max)      ║           │
│  ║                                                ║           │
│  ║  Tilt A/D      +12°  │  Pos W/S       Ctr     ║           │
│  ║  ┌────────────────┐  │  ┌────────────────┐    ║  h:10px  │
│  ║  │ ░░░░░[●]░░░░░  │  │  │ ░░░░[●]░░░░░  │    ║  each    │
│  ║  └────────────────┘  │  └────────────────┘    ║           │
│  ║   centre = 0°  red if >±30°   Fwd/Ctr/Back    ║           │
│  ║                                                ║           │
│  ║  HOLD SPACE to charge · Release to launch      ║           │
│  ║  Set tilt with A / D and position with W / S   ║           │
│  ╚═══════════════════════════════════════════════╝           │
│                                                               │
│  (multiplayer only — teammate strip below panel):            │
│  ╔════════════════════════════════════════════════╗          │
│  ║  Other players launching                        ║          │
│  ║  ● Player1 (you)  [████████████░░░░]  72%      ║          │
│  ║  ● Player2        READY ✓                      ║          │
│  ╚════════════════════════════════════════════════╝          │
└──────────────────────────────────────────────────────────────┘

State transitions:
  charging=false  → sliders active, instruction shows
  charging=true   → sliders dim (opacity:0.4), "CHARGING... RELEASE SPACE"
  power ≥ 95%     → green border flash, "✦ PERFECT — RELEASE SPACE!"
  power > 130%    → bar turns red (overcharge)
  launched        → "LET IT RIP!" banner (see section 8), showPerfect if ≥95%
```

---

## 7. Launch QTE — Ripcord Launcher

Same container as string launcher; different inner UI.

```
┌──────────────────────────────────────────────────────────────┐
│  [dark scrim]                                                 │
│                                                               │
│  ╔═══════════════════════════════════════════════╗           │
│  ║  RIPCORD LAUNCH PANEL                          ║           │
│  ║                                                ║           │
│  ║            5s                                  ║  timer   │
│  ║  [█████████████████████░░░░░░░░░░░░░░░░░░░]   ║  bar     │
│  ║                                                ║           │
│  ║  Ripcord Power                                 ║           │
│  ║  ┌──────────────────────────────────────────┐  ║  h:36px  │
│  ║  │ █████████████████████ ▌     │SWEET│       │  ║  rounded │
│  ║  └──────────────────────────────────────────┘  ║           │
│  ║    LOW              72% ^needle  ^86% sweet MAX ║           │
│  ║    (fill oscillates: red→orange→yellow→green)   ║           │
│  ║                                                ║           │
│  ║  Tilt (A/D)            +0°                     ║           │
│  ║  ┌──────────────────────────────────────────┐  ║           │
│  ║  │ ░░░░░░░[●]░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ║  h:12px  │
│  ║  └──────────────────────────────────────────┘  ║           │
│  ║                                                ║           │
│  ║  Position (W/S)       Center                   ║           │
│  ║  ┌──────────────────────────────────────────┐  ║           │
│  ║  │ ░░░░░░░░░░░░░[●]░░░░░░░░░░░░░░░░░░░░░░  │  ║  h:12px  │
│  ║  └──────────────────────────────────────────┘  ║           │
│  ║                                                ║           │
│  ║  Set your launch  A/D tilt · W/S pos            ║           │
│  ║  PRESS SPACE AT PEAK!  (yellow)                 ║           │
│  ║  → "PRESS SPACE NOW!" (green, pulsing at peak)  ║           │
│  ║                                                ║           │
│  ║  On press result (large centered text):         ║           │
│  ║    ≥130% → PERFECT!  (green)                   ║           │
│  ║     ≥90% → GOOD!     (yellow)                  ║           │
│  ║      <90% → MISS!    (red)                     ║           │
│  ╚═══════════════════════════════════════════════╝           │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Launch Cinematic ("LET IT RIP")

`LaunchCinematic` is `position:absolute inset:0`, shown during status="launching".
It sits *alongside* the LaunchPhase panel (same z-80 layer).

```
┌──────────────────────────────────────────────────────────────┐
│  [arena visible; no scrim in LaunchCinematic itself]         │
│                                                               │
│                  ┌─────────────┐                             │
│                  │  LET IT RIP!│  ← text-3xl sm:text-4xl    │
│                  └─────────────┘    white or gold (>120% pwr)│
│                                     with text-shadow glow     │
│                                                               │
│  Radial glow circle behind text:                             │
│    200–300px circle, amber/orange gradient, pulsing          │
│                                                               │
│  Bottom 20% of overlay:                                      │
│    "Power: 72%"  (muted or gold, fades in with powerNorm)    │
│                                                               │
│  Animations:                                                 │
│    launch-scale-in: scale 0.3→1.15→0.95→1 over 0.6s        │
│    launch-ripple: subtle horizontal shake, loops after 0.6s  │
│    launch-glow-pulse: glow intensity oscillates              │
└──────────────────────────────────────────────────────────────┘

Triggered: active = (gameState.status === 'launching')
Power source: local → simSnap.launchPower; server → myBeyblade.launchPower

"LET IT RIP" banner (inside LaunchPhase, separate from LaunchCinematic):
  Slides down from top on `launched=true`:
┌──────────────────────────────────────────────────────────────┐
│  ██████████████████████████████████████████████████████████  │
│  ██  LET    IT    RIP!   (speed-line gradient bg, red/orange)██
│  ██████████████████████████████████████████████████████████  │
│  text: clamp(1rem, 3vw, 1.8rem)  italic, white, bold         │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. Collision QTE (clash mash)

`CollisionQTEOverlay` rendered inside a centering `div` inside
`.game-overlay-layer`. No scrim — arena stays visible.

```
┌──────────────────────────────────────────────────────────────┐
│  .game-overlay-layer  [display:flex center center z:200]      │
│                                                               │
│       ┌───────────────────────────────────────────┐          │
│       │  border-2 border-[--bc]  rounded-xl        │          │
│       │  shadow-[0_0_24px_var(--bc)44]             │          │
│       │  bg-black/[.82]  min-w-[360px]             │          │
│       │                                            │          │
│       │  ⚡ COLLISION! MASH BUTTONS! ⚡            │  text-18 │
│       │                                            │  bold    │
│       │  ┌────────────────────────────────────┐   │          │
│       │  │ ██████████████████░░░░░░░░░░  72%  │   │  h:22px  │
│       │  └────────────────────────────────────┘   │  bar     │
│       │                                            │          │
│       │  ── GETTING HARDER ──  (≥100, orange pulse)│          │
│       │                                            │          │
│       │  QTE: 1.45x  ×  SP: 80%  =  1.16x damage │          │
│       │        ^yellow    ^lightblue   ^white bold │          │
│       │                                            │          │
│       │  ┌────────────────────────────────────┐   │          │
│       │  │ 🔥 PRESS [SPACE] TO FIRE SPECIAL! 🔥│   │  shown   │
│       │  └────────────────────────────────────┘   │  only    │
│       │  (orange gradient bg, gold border, blink)  │  when    │
│       └───────────────────────────────────────────┘  canFire │
│                                                               │
└──────────────────────────────────────────────────────────────┘

Power bar color scale:
  0–50%   → #44ff88 (green)
  50–80%  → #ffcc00 (yellow)
  80–100% → #ffaa00 (orange)
  100–150 → #ff6600 (orange-red)
  150+    → #ffd700 (gold, overcharge)

Controls:
  Any key  → onMash()  (increments power server-side)
  Space    → onFireSpecial() if canFireSpecial (once per QTE window)
```

---

## 10. Counter/Special QTE (sequence block)

`QTEOverlay` rendered inside a centering `div` inside `.game-overlay-layer`.
Only shown for server rooms (`!local`). Triggered when opponent fires a special.

```
┌──────────────────────────────────────────────────────────────┐
│  .game-overlay-layer  [display:flex center center z:200]      │
│                                                               │
│     ┌─────────────────────────────────────────────┐          │
│     │  border-2  rounded-[16px]  min-w-[280px]    │          │
│     │  bg rgba(15,23,42,0.97)                      │          │
│     │  border: yellow (active) / green (success)   │          │
│     │            / red (failed)                    │          │
│     │                                              │          │
│     │  ⚡ Counter Chance!         (text-[#eab308]) │          │
│     │  Press the sequence to block their special   │          │
│     │                                              │          │
│     │  ┌────┐  ┌────┐  ┌────┐  ┌────┐             │          │
│     │  │ ✓  │  │ ✓  │  │ →  │  │ J  │  ← keys    │          │
│     │  │ ←  │  │ →  │  │ →  │  │    │             │          │
│     │  └────┘  └────┘  └────┘  └────┘             │          │
│     │  green   green   yellow  grey                │          │
│     │  (done)  (done)  (now)   (next)              │          │
│     │  w:44px h:44px, rounded-[10px], text-20px    │          │
│     │                                              │          │
│     │  [████████████████████░░░░░░░░░░░░░░░░░░]   │  h:6px  │
│     │   green─────────→yellow──────→red           │  timer  │
│     │                                              │          │
│     │  3 ticks remaining                           │          │
│     │                                              │          │
│     │  ┌──────────────────────────────────────┐   │          │
│     │  │       BLOCKED!  (on success)          │   │  result  │
│     │  │  bg rgba(green,0.15)  text green      │   │  overlay │
│     │  └──────────────────────────────────────┘   │          │
│     └─────────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────────────┘

Key mapping:
  ArrowLeft → "left" (←)   ArrowRight → "right" (→)
  ArrowUp   → "up"   (↑)   ArrowDown  → "down"  (↓)
  J / j     → "attack"     K / k      → "defense"
  L / l     → "dodge"

Wrong key: panel shakes translateX(-6px), progress resets to 0
Success:   "BLOCKED!" overlay, auto-dismiss after 700ms
Timeout:   "TOO SLOW" overlay, parent dismisses
```

---

## 11. KO Overlay

`KOOverlay` is `position:absolute inset:0 z-[80]`. Shown briefly on
`koVisible.visible`. Ring-out vs KO vs outspin change the flash colour.

```
┌──────────────────────────────────────────────────────────────┐
│  [full viewport — arena faintly visible behind]              │
│                                                               │
│  Flash layer (absolute inset:0):                            │
│    KO       → rgba(239, 68, 68, 0.5)   red flash            │
│    ring_out → rgba(245,158, 11, 0.5)   amber flash           │
│    outspin  → rgba( 59,130,246, 0.5)   blue flash            │
│    (animates ko-flash: opacity 0.8→0, 0.4s)                 │
│                                                               │
│  Center element (text-[64px] font-black):                   │
│                                                              │
│                    ┌───────┐                                 │
│                    │  K.O! │  ← red text + glow shadow      │
│                    └───────┘                                 │
│              or  RING OUT!  (amber)                         │
│              or  OUTSPIN!   (blue)                          │
│                                                               │
│  (animates scaleUp 0.4s, then fades out after 1s)           │
└──────────────────────────────────────────────────────────────┘
```

---

## 12. Burst Overlay

`BurstOverlay` is `position:absolute inset:0 z-[80]`. Explosive radial effect.

```
┌──────────────────────────────────────────────────────────────┐
│  [no scrim — particles on top of arena]                      │
│                                                               │
│  ████████████████████████████████████████████████████████   │
│  █  burst-flash: white/gold radial gradient from center   █  │
│  █  (burst-flash animation: opacity 0.9→0 over 0.3s)     █  │
│  ████████████████████████████████████████████████████████   │
│                                                               │
│  Center particles: N radial lines burst from center         │
│  Each line: thin div, rotated, fades + scales outward       │
│                                                               │
│  Center text:                                                │
│                    ┌─────────┐                               │
│                    │  BURST! │  ← text-[72px] font-black    │
│                    └─────────┘    gold + red gradient text   │
│                     (scaleUp + fade animation)               │
└──────────────────────────────────────────────────────────────┘
```

---

## 13. Victory Overlay

`VictoryOverlay` is `position:absolute inset:0 z-[80]`. Auto-dismisses
after 5000ms or on click. Confetti (40 pieces) rains from top.

```
┌──────────────────────────────────────────────────────────────┐
│  ●   ●    ● ●   ●  ●   ●  ●    ●   ●  ●    ●   ●           │
│   ● ●  ●    ● ●  ●   ●   ● ●  ●  ●    ●  ●   ●   ●         │
│  (40 confetti squares raining, random hsl colors, 2–5s fall) │
│                                                               │
│  [bg: animated dark gradient, victory-backdrop 0→1 opacity]  │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   WINNER!                            │    │
│  │  (victory-header animation: letter-spacing 1em→0.2em)│    │
│  │  font-black, uppercase, text-[52px]                  │    │
│  │                                                       │    │
│  │  ┌────────────────────────────────────────────────┐  │    │
│  │  │   PlayerName                                    │  │    │
│  │  │   (type-colored bg: attack=red, def=blue, etc) │  │    │
│  │  │   text-[28px] font-black                       │  │    │
│  │  └────────────────────────────────────────────────┘  │    │
│  │                                                       │    │
│  │  [Click anywhere or wait 5s to continue]             │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 14. BitBeast Cinematic

`BitBeastCinematic` renders two `position:absolute inset:0` layers at
z-195 and z-196 (above everything else). Shown when special move fires.

```
┌──────────────────────────────────────────────────────────────┐
│  Layer z-195 (backdrop):                                      │
│  radial-gradient(ellipse, rgba(60,30,100,0.9) → black,0.82)  │
│  pulsing bb-bg-pulse animation                               │
│                                                               │
│  Layer z-196 (content):                                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │               [Glow ring]                             │   │
│  │          min(55vw,55vh) circle, blurred               │   │
│  │          color depends on move type                   │   │
│  │                                                        │   │
│  │           ┌──────────────┐                            │   │
│  │           │  [BitBeast   │  ← imageUrl from Firestore │   │
│  │           │   sprite     │    min(45vw,45vh) square   │   │
│  │           │   image]     │    drop-shadow + spin       │   │
│  │           └──────────────┘                            │   │
│  │                                                        │   │
│  │              STAMPEDE RUSH                            │   │
│  │         (moveName, text-[28px], gold, tracking)       │   │
│  │                                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Fades out after duration (opacity → 0 over 350ms)           │
└──────────────────────────────────────────────────────────────┘
```

---

## 15. Button Mapping Reference

### Keyboard

| Key | Action | Bitmask bit |
|-----|--------|-------------|
| A | moveLeft | 0 |
| D | moveRight | 1 |
| W | moveUp | 2 |
| S | moveDown | 3 |
| J | attack | 4 |
| K | defense | 5 |
| L | dodge | 6 |
| I | jump | 7 |
| Space (hold ≥150ms) | chargeHeld | 8 |
| Space (tap <150ms) | specialTap | 9 |

### Touch (GameShell)

| Button | Action | Correct? |
|--------|--------|----------|
| D-pad ▲ | moveUp | ✓ |
| D-pad ▼ | moveDown | ✓ |
| D-pad ◀ | moveLeft | ✓ |
| D-pad ▶ | moveRight | ✓ |
| X | dodge | ✓ |
| A | attack | ✓ |
| B | defense | ✓ |
| Y | jump | ✓ |
| L shoulder | chargeHeld | ✓ |
| R shoulder | specialTap | ✓ |
| SELECT | **jump** | ✗ BUG → should be `specialTap` |
| START | **attack** | ✗ BUG → should be `handleExit` (no bitmask) |

### Known Issues

- **Portrait L/R missing** — no shoulder buttons in `PortraitShell`.
  `chargeHeld` has no touch target in portrait mode.
- **SELECT action wrong** — `GameShell.tsx` line 198/311: `action="jump"`.
  Should be `action="specialTap"`.
- **START action wrong** — `GameShell.tsx` line 199/312: `action="attack"`.
  Should call `handleExit` (exit/pause) — it is not a bitmask input.
- **Collision QTE only wired for server rooms** — `GameRoomPage.tsx` line 345:
  `{collisionQTEActive && !local && ...}`. Local tryout/pvai matches cannot
  trigger collision QTE events from `LocalGameSimulation` yet.
- **QTE overlay only wired for server rooms** — `GameRoomPage.tsx` line 334:
  `{qtePrompt && !local && ...}`. Same reason.

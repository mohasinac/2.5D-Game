# Game UI Diagrams

All diagrams reflect the actual component code. Coordinates and sizes are
taken directly from `GameShell.tsx`, `LaunchPhase.tsx`, `QTENotificationSystem.tsx`,
`Countdown.tsx`, `KOOverlay.tsx`, `VictoryOverlay.tsx`, and `GameRoomPage.tsx`.

> **QTEOverlay.tsx** and **CollisionQTEOverlay.tsx** are superseded by
> `QTENotificationSystem.tsx` (4 purpose-built variants — see section 16).

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
9. [Collision QTE — MashQTE (clash mash)](#9-collision-qte--mashqte-clash-mash)
10. [Counter QTE — SequenceQTE (sequence block)](#10-counter-qte--sequenceqte-sequence-block)
11. [KO Overlay](#11-ko-overlay)
12. [Burst Overlay](#12-burst-overlay)
13. [Victory Overlay](#13-victory-overlay)
14. [BitBeast Cinematic](#14-bitbeast-cinematic)
15. [Button Mapping Reference](#15-button-mapping-reference)
16. [QTE Notification System Design](#16-qte-notification-system-design)

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

## 9. Collision QTE — MashQTE (clash mash)

`MashQTE` from `QTENotificationSystem.tsx`. Slim right-edge strip — arena
stays fully visible. `data-testid="qte-mash"`. Works in local and server rooms.

```
┌──────────────────────────────────────────────────────────────┐
│  .game-overlay-layer                                          │
│                                                               │
│  Arena plays on behind ─────────────────────────────────►    │
│                                                               │
│                                        ┌────────────────┐    │
│                                        │ ⚡ CLASH—MASH! │← 9px│
│                                        │ ─────────────  │    │
│                                        │ [██████░░] bar  │← h:8│
│                                        │ 72%  1.2x dmg  │    │
│                                        │ ┌────────────┐ │    │
│                                        │ │🔥 SPACE→SP │ │ ←  │
│                                        │ └────────────┘ │  shown│
│                                        └────────────────┘  when│
│                                        152px wide          canFire│
│  position: right 5%, top 50%  translateY(-50%)             │
│  zIndex: 200                                                  │
└──────────────────────────────────────────────────────────────┘

Power bar color scale:
  0–50%   → #44ff88 (green)
  50–80%  → #ffcc00 (yellow)
  80–100% → #ffaa00 (orange)
  100–150 → #ff6600 (orange-red)
  150+    → #ffd700 (gold, overcharge)

Controls:
  Any key  → onMash()  (increments power server-side)
  Space    → onFireSpecial() if canFireSpecial (once per window)
```

---

## 10. Counter QTE — SequenceQTE (sequence block)

`SequenceQTE` from `QTENotificationSystem.tsx`. Compact bottom-centre card —
game canvas stays fully visible. `data-testid="qte-sequence"`. Two variants:
`counter` (yellow, triggered by opponent special) and `hijack` (purple, BeyLink).
Works in local and server rooms.

```
┌──────────────────────────────────────────────────────────────┐
│  .game-overlay-layer                                          │
│                                                               │
│  Arena plays on behind ─────────────────────────────────►    │
│                                                               │
│                    ┌──────────────────────────┐              │
│                    │  ⚡ Counter!  (yellow)    │ ← 9px bold  │
│                    │                           │              │
│                    │  [←][→][↑][J]  ← 28px pills│            │
│                    │  grey  grey  yellow grey  │              │
│                    │     (done)(done)(now)(next)│             │
│                    │                           │              │
│                    │  [████████████░░░░] h:4   │ ← timer bar │
│                    └──────────────────────────┘              │
│                    220px wide                                 │
│  position: bottom 12%, left 50%  translateX(-50%)            │
│  zIndex: 200 (counter) / 201 (hijack, stacks above)          │
│                                                               │
│  Hijack variant (purple #a855f7 accent):                     │
│                    ┌──────────────────────────┐              │
│                    │  🔗 Hijack!  (purple)     │              │
│                    │  [J][J][J]  ← mash attack │              │
│                    └──────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘

Key mapping:
  ArrowLeft → "left" (←)   ArrowRight → "right" (→)
  ArrowUp   → "up"   (↑)   ArrowDown  → "down"  (↓)
  J / j     → "attack"     K / k      → "defense"
  L / l     → "dodge"

Wrong key: card shakes translateX(-5px), progress resets to 0
Success:   "BLOCKED!" overlay flash, onSuccess() fires, auto-dismiss after 450ms
Timeout:   onDismiss() called immediately
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

---

## 16. QTE Notification System Design

`QTENotificationSystem.tsx` exports 4 purpose-built notification variants.
Each is sized and positioned to keep the **arena fully visible** while the
player responds. All use `position:absolute` inside `.game-overlay-layer`.

### Design Table

| Variant | Component | Trigger | Shape | Size | Position | Colour |
|---------|-----------|---------|-------|------|----------|--------|
| Counter sequence | `SequenceQTE variant="counter"` | `qte-prompt` (opponent fires special) | Compact card | 220×~110px | Bottom-centre (bottom:12%, left:50%) | Yellow `#eab308` |
| Hijack sequence | `SequenceQTE variant="hijack"` | `bey-link-hijack-qte` (attacker QTE) | Compact card | 220×~110px | Bottom-centre (zIndex:201) | Purple `#a855f7` |
| Collision mash | `MashQTE` | `collision-qte-start` | Slim strip | 152×~120px | Right edge (right:5%, top:50%) | Dynamic power bar green→gold |
| BeyLink escape | `SingleKeyQTE variant="escape"` | `bey-link-qte` (victim escape prompt) | Toast pill | 190×~46px | Top-centre (top:8%, left:50%) | Cyan `#06b6d4` |
| Hijack block | `SingleKeyQTE variant="block"` | `bey-link-hijack-block-qte` (defender) | Toast pill | 190×~46px | Top-centre (zIndex:201) | Blue `#3b82f6` |
| Control loss | `DebuffNotice` | `bey-link-control-loss` (passive) | Status badge | 160×~52px | Top-left (top:8%, left:5%) | Red/amber/ice by mode |

### ASCII Mockups

**MashQTE** — right edge, slim:
```
┌──────────────────┐
│ ⚡ CLASH—MASH!   │  ← 9px uppercase, dynamic color
│ [██████░░░░░░░░] │  ← h:8px power bar
│ 72%    1.2x dmg  │  ← value + multiplier
│ [🔥 SPACE→SPEC] │  ← only when canFireSpecial
└──────────────────┘
  152px wide
  right:5%, top:50%, translateY(-50%)
```

**SequenceQTE counter** — bottom-centre:
```
┌──────────────────────────┐
│ ⚡ Counter!  (yellow)    │
│  [←][→][↑][J]           │  ← 28×28px pills
│  [████████████░░░] timer │  ← h:4px
└──────────────────────────┘
  220px wide
  bottom:12%, left:50%, translateX(-50%)
```

**SequenceQTE hijack** — same position, purple:
```
┌──────────────────────────┐
│ 🔗 Hijack!  (purple)     │
│  [J][J][J]               │  ← 3× attack mash
│  [████████████░░░] timer │
└──────────────────────────┘
  zIndex:201 (above counter if both active)
```

**SingleKeyQTE escape** — top-centre toast:
```
┌──────────────────────────────────────┐
│  [K]  Escape!          ████████████ │  ← timer fill behind (opacity:0.08)
└──────────────────────────────────────┘
  Pill shape, 190px, border-radius:24px
  top:8%, left:50%, translateX(-50%), cyan border
```

**SingleKeyQTE block** — same position, blue:
```
┌──────────────────────────────────────┐
│  [L]  Block Hijack!    ████████████ │
└──────────────────────────────────────┘
  zIndex:201, blue border
```

**DebuffNotice** — top-left badge:
```
┌──────────────────┐
│ ↩  REVERSED      │  ← icon + label, red
│ [██████░░░░░░░░] │  ← h:3px duration bar
└──────────────────┘
  160px wide
  top:8%, left:5%
  Modes: reverse=red, scramble=orange, freeze=ice-blue
```

### Component Props Summary

```typescript
// SequenceQTE
{ prompt: QTEPromptData; variant?: "counter"|"hijack"; onKeyPress; onDismiss; onSuccess? }

// MashQTE
{ active; power; maxPower?; canFireSpecial; qteMultiplier; currentSP; onFireSpecial; onMash? }

// SingleKeyQTE
{ data: SingleKeyQTEData; onPress; onDismiss }
// SingleKeyQTEData: { key, label, expiresAt, variant: "escape"|"block" }

// DebuffNotice
{ data: DebuffNoticeData; onExpire }
// DebuffNoticeData: { mode: "reverse"|"scramble"|"freeze"; durationTicks; startedAt; tickMs? }
```

### data-testid Reference

| Component | data-testid | Notes |
|-----------|-------------|-------|
| `SequenceQTE` | `qte-sequence` | Also `qte-key-{i}` for each pill |
| `MashQTE` | `qte-mash` | Also `qte-mash-special` for special prompt |
| `SingleKeyQTE` | `qte-single-key` | |
| `DebuffNotice` | `qte-debuff` | |

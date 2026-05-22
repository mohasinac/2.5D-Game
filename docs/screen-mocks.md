# Beyblade Game — Screen Mocks

ASCII wireframes for every player- and admin-facing screen, with state variations and config annotations. Render in monospace.

> **Recent overhaul (this doc now reflects post-changes state)**
>
> - AI Battle setup is built on a new **EntityPicker** — searchable name list + tabbed `Preview / Stats / Special / Combos` (bey) or `Preview / Stats / Features` (arena).
> - Difficulty is **Medium / Hard / Hell** (no Easy). Hell adds frame-perfect dodges, ring-out plays, and a periodic 3-key combo cadence.
> - Tournament rooms are capped at **3 minutes (whole series)**; tie at cap → **draw**. **5-min gap** between matches; **both-Ready early-start** skips the gap. Players can **Quit** for an opponent walkover.
> - Leaderboard defaults to a new **Tournament Points** tab (2 / 1 / 0 per match).
> - Spectators can **click a player name to follow** and use the same `+ / 0 / −` zoom controls as players.
> - In-match HUD shows the **attached combos** (up to 3) with cost icons (⚡ free, 🔋15/25/35) and cooldown rings. The special and combos panels are hidden when the beyblade has none.
> - A **LoadingProgress** stepper overlays the battle canvas until the room is in-progress (6 steps).
> - 2.5D **Contact Points** support arc-segment geometry (`arcStart / arcEnd / radiusInner / radiusOuter / lineThickness / setId`) alongside legacy fields.
> - New arena features: **Spin Zones**, **Bumps**. Every feature can be wired to a switch (`controlledBySwitchId`) and self-rotate.
> - Asset uploads accept **GIF** (animation preserved). Every asset library page exposes a **switch** tag.

---

---

## Conventions

```
┌──┐ container / section            (X) selected radio          [ ] empty slot
│  │                                ( ) unselected              [✓] filled / done
└──┘                                [▼] dropdown                ●   indicator dot
═══  emphasized / active border     [✕] close / remove          ░░░ disabled
···  scrollable / continues         [...] truncated text         ▮▮▯ progress bar
{var} dynamic value                 «label» state badge          ↻ ↺ spin dir
```

**Color cues (rendered theme):** dark bg (#0b0d12) · blue=beyblade · purple=arena/AI · orange=stadium · yellow=tournament · red=PVP · green=connected/active.

## Table of contents

- **I. Player-facing screens** — 13 screens (Home → Tournaments) + shared HUD
- **II. Admin — gameplay management** — dashboards, tournaments, beyblades, arenas, stadiums
- **III. Admin — assets & 2.5D part system** — assets library + part editor + beyblade-systems + arena-systems
- **IV. 2.5D shape-extraction flow** — Silhouette → Bezier → Fourier → Spline pipeline, per-stage detail
- **V. Per-screen user-action flow chart** — every screen's entry-points, actions, exits + cross-screen nav maps
- **VI. Series / spectator / overlay matrix** — which game-state overlays appear on which screen
- **VII. Route map** — flat list of all client routes

---

# I. PLAYER-FACING SCREENS

---

## 1. HomePage — `/`

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                                  🌀                                        │
│                            Beyblade Game                                   │
│                  Server-authoritative spinning-top combat                  │
│                                                                            │
│        ┌─────────────────────────┐  ┌─────────────────────────┐            │
│        │         ⚔️                │  │         🛠️                │            │
│        │      Play Game          │  │      Admin Panel        │            │
│        │  Tryout · PVP · AI ·    │  │  Manage beyblades,      │            │
│        │  Tournament             │  │  arenas, tournaments    │            │
│        └─────────────────────────┘  └─────────────────────────┘            │
│                                                                            │
│                       ╭──────────────────╮                                 │
│                       │  🏆 Leaderboard  │                                 │
│                       ╰──────────────────╯                                 │
│                                                                            │
│                       ● connected   localhost:2567                         │
└────────────────────────────────────────────────────────────────────────────┘
```
**State variations:** server status dot — green (connected) / red (disconnected) / amber (connecting).

---

## 2. LoginPage — `/login`

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                                  🌀                                        │
│                              Sign In                                       │
│                    Access the Beyblade arena                               │
│                                                                            │
│              ┌──────────────────────────────────────────┐                  │
│              │  Email                                   │                  │
│              │  ┌────────────────────────────────────┐  │                  │
│              │  │ you@example.com                    │  │                  │
│              │  └────────────────────────────────────┘  │                  │
│              │                                          │                  │
│              │  Password                                │                  │
│              │  ┌────────────────────────────────────┐  │                  │
│              │  │ ••••••••                           │  │                  │
│              │  └────────────────────────────────────┘  │                  │
│              │                                          │                  │
│              │  ┌────────────────────────────────────┐  │                  │
│              │  │            Sign In                 │  │                  │
│              │  └────────────────────────────────────┘  │                  │
│              └──────────────────────────────────────────┘                  │
│                                                                            │
│                            ← Back to home                                  │
└────────────────────────────────────────────────────────────────────────────┘
```

**States**
- Empty (default): submit disabled.
- Loading: button reads `Signing in...` and is disabled.
- Error: red toast above card — `Invalid credentials` / `Network error`.

---

## 3. GameSelectPage — `/game`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Back                                                                     │
│                                                                            │
│  Select Game Mode                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ⚠  Server message: "Tournaments paused for maintenance"             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐         │
│  │       🌀          │ │       ⚔️           │ │       🤖          │         │
│  │     Tryout        │ │   PVP Battle      │ │    AI Battle      │         │
│  │  Solo practice    │ │  2–4 players      │ │ Single player vs  │         │
│  │  with any arena   │ │  + 8 spectators   │ │ tunable CPU       │         │
│  │   ▸ 1 player      │ │   ▸ 2–4 players   │ │   ▸ 1 player      │         │
│  └───────────────────┘ └───────────────────┘ └───────────────────┘         │
│                                                                            │
│  ┌───────────────────┐  ░░░░░░░░░░░░░░░░░░░░░                              │
│  │       🏆          │  ░ Tournament      ░  (disabled — feature flag)     │
│  │   Tournament      │  ░ ▸ scheduled      ░                               │
│  │ Bracket play      │  ░░░░░░░░░░░░░░░░░░░░░                              │
│  └───────────────────┘                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

**Configs / state**
- `settings.enableTryout` / `enablePvp` / `enableAiBattle` / `enableTournament` toggle cards on/off.
- `maintenanceMode=true`: shows red banner, all cards disabled.
- `serverMessage`: rendered as alert above grid when non-empty.

---

## 4. LeaderboardPage — `/leaderboard`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Back                                                                     │
│                                                                            │
│  🏆 Leaderboard                                                            │
│  Top 50 players — all time                                                 │
│                                                                            │
│  ╭────────────╮ ╭──────╮ ╭───────────╮ ╭──────────╮ ╭──────────╮           │
│  │ Tournament │ │ Wins │ │ Win Rate  │ │  Damage  │ │ Matches  │ ← tabs    │
│  ╰════════════╯ ╰──────╯ ╰───────────╯ ╰──────────╯ ╰──────────╯           │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ▓ 🥇   ╭──╮  SpinKing             42 matches · 38W-4L      76 pts  ▓ │  │
│  │ ▓ 🥈   ╭──╮  WolfBorg             40 · 35-5                70 pts  ▓ │  │
│  │ ▓ 🥉   ╭──╮  DragoonStorm         51 · 32-19               65 pts  ▓ │  │
│  │ ───────────────────────────────────────────────────────────────────── │  │
│  │   4    ╭──╮  Driger                25 · 18-7               37 pts    │  │
│  │   5    ╭──╮  Dranzer               30 · 17-13              35 pts    │  │
│  │   ⋮                                                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

**Tournament Points scoring** — win = +2, draw = +1, loss = 0. Awarded on the series-end / room-cap path of `TournamentBattleRoom`; `updatePlayerStats` increments atomically (`tournamentPoints`, `wins`, `matchesPlayed`, `totalDamageDealt`, `totalCollisions`).

**States** — Default tab is **Tournament**. Other tabs (Wins / Win Rate / Damage / Matches) resort the list and reformat the rightmost column. Loading: centered spinner. Empty: `No match data yet`.

---

## 5. TryoutGamePage — `/game/tryout`

In-game canvas with overlays. Player view only (no spectators in tryout).

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ● LOCAL                            00:42                          Exit →   │
│                                                                            │
│                                                                  ┌────┐    │
│                                                                  │ +  │    │
│                                                                  │ 0  │    │
│                                                                  │ −  │    │
│                                                                  └────┘    │
│                                                                            │
│                              ╭─────────────╮                               │
│                              │   ◉ ARENA ◉ │                               │
│                              │   ↻ player  │   (PIXI 5-layer stack)        │
│                              ╰─────────────╯                               │
│                                                                            │
│  ┌────────────┐                                                            │
│  │ CONTROLS   │                                                            │
│  │ WASD move  │                                                            │
│  │ I  jump    │                                                            │
│  │ J  attack  │                                                            │
│  │ K  defend  │                                                            │
│  │ L  dodge   │                                                            │
│  │ ␣  special │                                                            │
│  │ +/−/0 zoom │                                                            │
│  │ [hide]     │                                                            │
│  └────────────┘                                                            │
│                       ┌───────────────────────────────────┐                │
│                       │ SpinKing      [Attack]            │                │
│                       │ Spin   ▮▮▮▮▮▮▮▮▯▯  78%            │                │
│                       │ Stability:  ● stable              │                │
│                       └───────────────────────────────────┘                │
└────────────────────────────────────────────────────────────────────────────┘
```

### Spin-out overlay (terminal state)

```
            ┌────────────────────────────────────────────────┐
            │                                                │
            │                     🌀                         │
            │                  Spin Out!                     │
            │             Survived 42 seconds                │
            │                                                │
            │     ┌─────────────┐    ← Menu                  │
            │     │  Try Again  │                            │
            │     └─────────────┘                            │
            │                                                │
            └────────────────────────────────────────────────┘
```

**Configs (set on entry):** beyblade pick + arena pick (passed via route state). **Stability label:** `● stable` (>40%) / `◐ wobbling` (10–40%) / `◯ critical` (<10%).

---

## 6. BattleLobbyPage — `/game/battle`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Back        PVP Battle Lobby                       ● connected           │
│                                                                            │
│  Room   ┌──────────────────────────────────────────────────────────────┐   │
│  Code   │  battle_abc123def                                            │   │
│         └──────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Players                                                       2 / 4  │  │
│  │ ───────────────────────────────────────────────────────────────────  │  │
│  │ ① ╭─╮ SpinKing (you)  «HOST»                                    ✓   │  │
│  │ ② ╭─╮ WolfBorg                                                  ✓   │  │
│  │ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄  │  │
│  │ ③      Waiting for player...                                        │  │
│  │ ④      Waiting for player...                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌───────────────── Host Controls (host only) ──────────────────────────┐  │
│  │ Match Format                                                         │  │
│  │  ╭═════╮  ╭─────╮  ╭─────╮                                           │  │
│  │  │ BO1 │  │ BO3 │  │ BO5 │     First to 1 win takes the series.      │  │
│  │  ╰═════╯  ╰─────╯  ╰─────╯                                           │  │
│  │                                                                      │  │
│  │ Spectate link                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐  ┌──────────┐  │  │
│  │  │ http://localhost:3001/game/battle?spectate=true… │  │   Copy   │  │  │
│  │  └──────────────────────────────────────────────────┘  └──────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│         ┌──────────────────────────────────────────────────────────────┐   │
│         │             ▶  Start Battle!  (BO1)                          │   │
│         └──────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

**State variants**
- **Non-host:** host-controls panel hidden, Start button replaced with `Waiting for host...`.
- **<2 players:** Start button disabled, label `Waiting for 1 more player`.
- **Countdown (full-screen overlay):**
  ```
                       ┌──────────────────┐
                       │                  │
                       │        3         │   ← 120pt
                       │  Match starting… │
                       │                  │
                       └──────────────────┘
  ```
- **Copy clicked:** Copy button text flips to `Copied!` for 2s.

---

## 7. BattleGamePage — `/game/battle` (in-match)

### 7a. Player view (in-progress, BO3)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ● CONNECTED       Game 2/3   3/4 alive   👁 2          ⚠ Exit       2-0   │
│ ┌──────────────┐                          ┌─────────────────────────────┐  │
│ │ minimap*     │            00:38         │ WolfBorg     [Defense]      │  │
│ │ ╭──────────╮ │                          │ HP  ▮▮▮▮▮▮▯▯▯▯  62%         │  │
│ │ │● ●  ⛶    │ │            ┌────┐        │ ── eliminated ──            │  │
│ │ │    ●     │ │            │ +  │        │ DragoonStorm  [Attack]      │  │
│ │ │   ●      │ │            │ 0  │        │ HP  ▮▮▮▮▯▯▯▯▯▯  44%         │  │
│ │ ╰──────────╯ │            │ −  │        │ Driger        [Stamina]     │  │
│ └──────────────┘            └────┘        │ HP  ▮▮▮▮▮▮▮▮▯▯  78%         │  │
│  *only ≥ 80cm                             └─────────────────────────────┘  │
│                                                                            │
│                     ╭────────────────╮                                     │
│                     │   ◉ ARENA ◉    │  ← PIXI worldRoot:                 │
│                     │    ↻ ↺ ↻       │     arena → features → beys →      │
│                     ╰────────────────╯     detached → particles            │
│                                                                            │
│  ┌────────────┐                                                            │
│  │ CONTROLS   │     ┌─── Special Move ────┐  ┌─── Combo ──────┐            │
│  │ WASD …     │     │ Stampede Rush       │  │  x3 hit chain  │            │
│  │ «LOCKED»   │     │ ▮▮▮▮▮▯▯▯▯▯ charging │  │  +12% damage   │            │
│  └────────────┘     └─────────────────────┘  └────────────────┘            │
│                                                                            │
│                       ┌───────────────────────────────────┐                │
│                       │ SpinKing      [Attack]            │                │
│                       │ HP   ▮▮▮▮▮▮▮▮▯▯  82%              │                │
│                       │ Spin ▮▮▮▮▮▮▮▯▯▯  71%              │                │
│                       │ Stability: ● stable               │                │
│                       └───────────────────────────────────┘                │
└────────────────────────────────────────────────────────────────────────────┘
```

### 7b. Spectator view

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ● SPECTATING  «SPECTATOR»  Game 2/3  3/4 alive  👁 2      Exit →     2-1  │
│                            00:38             ┌────────────────────────┐    │
│                                              │ SpinKing      [Atk]    │    │
│                                              │ HP ▮▮▮▮▮▮▮▮▯▯  82%     │    │
│                                              │ WolfBorg      [Def]    │    │
│                                              │ HP ▮▮▮▮▮▮▯▯▯▯  62%     │    │
│                                              │ DragoonStorm  [Atk]    │    │
│                                              │ HP ▮▮▮▮▯▯▯▯▯▯  44%     │    │
│                                              │ Driger        [Sta]    │    │
│                                              │ HP ▮▮▮▮▮▮▮▮▯▯  78%     │    │
│                                              └────────────────────────┘    │
│                                                                            │
│                     ╭────────────────╮                                     │
│                     │   ◉ ARENA ◉    │                                     │
│                     ╰────────────────╯                                     │
│                                                                            │
│   (no personal stats card — spectators see all players above)              │
└────────────────────────────────────────────────────────────────────────────┘
```

### 7c. Warmup overlay (pre-match — full-screen Countdown component)

```
            ┌────────────────────────────────────────────────┐
            │                                                │
            │                                                │
            │                      3                         │   tick sound each second
            │                                                │
            │                                                │
            └────────────────────────────────────────────────┘

            ┌────────────────────────────────────────────────┐
            │                                                │
            │                                                │
            │                  ★ FIGHT! ★                    │   flash + go sound
            │                                                │
            │                                                │
            └────────────────────────────────────────────────┘
```

See "Countdown" in §14 for the full component spec. The legacy "Get ready!" card is still rendered behind the countdown to keep tests passing.

### 7d. Game-end overlay (between games of a series)

```
            ┌────────────────────────────────────────────────┐
            │              Game 2 Complete                   │
            │              🏆 SpinKing wins                  │
            │                                                │
            │      SpinKing 2 — 1 WolfBorg                   │
            │      Driger    0 — 0 DragoonStorm              │
            │                                                │
            │           Next game starting…                  │
            └────────────────────────────────────────────────┘
```

### 7e. Series-end (BO3+, player view)

```
            ┌────────────────────────────────────────────────┐
            │                     🏆                         │
            │                  VICTORY!                      │
            │              Series 2 — 0                      │
            │                                                │
            │    ┌──────────────┐   ┌──────────────┐         │
            │    │  Play Again  │   │     Menu     │         │
            │    └──────────────┘   └──────────────┘         │
            └────────────────────────────────────────────────┘
```
Loss variant: 💀 / `DEFEATED`. Spectator: trophy + winner name + `Series finished`.

### 7f. Connecting / error

```
            ┌────────────────────────────────────────────────┐
            │              ◌  Joining battle…                │
            └────────────────────────────────────────────────┘
            ┌────────────────────────────────────────────────┐
            │           ⚠  Connection lost                   │
            │       ┌──────────┐     ┌──────────┐            │
            │       │  Retry   │     │   Menu   │            │
            │       └──────────┘     └──────────┘            │
            └────────────────────────────────────────────────┘
```

**Configs:** `bestOf` (1/3/5) shown in `Game X/Y` and scoreboard; `spectate` query param toggles 7b vs 7a. Series HUD hidden when `bestOf=1`.

---

## 7c. LoadingProgress (in-match overlay)

Shown over the battle canvas whenever `gameState.status` is not yet `warmup` / `in-progress` / `finished` / `series-finished`. Bar advances through:
`connecting-ws` → `joining-room` → `loading-arena-assets` → `loading-beyblade-assets` → `loading-audio-assets` → `warmup-ready`.

```
                      🌀
              LOADING ARENA ASSETS
                Step 3 / 6 · 42%

           ┌────────────────────────────────┐
           │ ████████████░░░░░░░░░░░░░░░░░░ │
           └────────────────────────────────┘

              ●  ●  ●  ○  ○  ○
```

Error state turns the bar red and surfaces the error message under the dots (e.g. `Connection timed out after 15s`).

---

## 8. AIBattleSetupPage — `/game/ai-battle`

Redesigned around the **EntityPicker** (searchable name dropdown + tabbed preview pane).
Three EntityPicker instances stack vertically: Your Beyblade → AI Beyblade → Arena.
Each picker exposes tabs: **Preview · Stats · Special · Combos** (beyblade) or
**Preview · Stats · Features** (arena). Difficulty is **Medium / Hard / Hell** (no Easy).

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Back                                                                     │
│  🤖 AI Battle                                                              │
│  Pick a beyblade, an arena, and a difficulty — fight a CPU opponent.       │
│                                                                            │
│  ┌─── 🌀 Your Beyblade ─────────────────────────────────────────────────┐  │
│  │ ┌─ search ──────────────┐ ┌─ Preview · Stats · Special · Combos ──┐ │  │
│  │ │ 🔎 Storm…             │ │ « Storm Pegasus »   ↻ right-spin       │ │  │
│  │ │ ────────────────────  │ │ ┌──────────────────────────────────┐   │ │  │
│  │ │ ▸ Storm Pegasus  ATK  │ │ │      [ spinning preview ]        │   │ │  │
│  │ │   Rock Leone     DEF  │ │ │           (animated)             │   │ │  │
│  │ │   Lightning L-Dr ATK  │ │ └──────────────────────────────────┘   │ │  │
│  │ │   Earth Eagle    BAL  │ │ Atk ▮▮▮▮▮▮▮▮▯▯  Def ▮▮▮▮▯▯▯▯▯▯        │ │  │
│  │ │   Flame Sagit.   STA  │ │ Sta ▮▮▮▮▮▮▯▯▯▯  mass 47g · r 24mm     │ │  │
│  │ │   Galaxy Pegasus ATK  │ │                                       │ │  │
│  │ │   ··· (Gen tags)      │ │ Special: Stampede Rush (cost 100)     │ │  │
│  │ │   Bakuten · MFB ·     │ │ Combos:  ⚡quick-dash-r · 🔋25 power-  │ │  │
│  │ │   Burst · X           │ │           thrust · ⚡guard-tap         │ │  │
│  │ └───────────────────────┘ └────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌─── 🤖 AI's Beyblade ─────────────────────────────────────────────────┐  │
│  │ (same EntityPicker; your own pick is greyed in the list)              │ │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌─── 🏟  Arena ────────────────────────────────────────────────────────┐  │
│  │ ┌─ search ──────────────┐ ┌─ Preview · Stats · Features ──────────┐ │  │
│  │ │ 🔎 Big Bang…           │ │ « Big Bang Stadium »                  │ │  │
│  │ │ ▸ Big Bang Stadium    │ │ ┌──────────────────────────────────┐   │ │  │
│  │ │   Attack Stadium      │ │ │   [ full arena render — top-     │   │ │  │
│  │ │   Stamina Stadium     │ │ │     down with obstacles, spin    │   │ │  │
│  │ │   BBA Beystadium      │ │ │     zones, gravity well, etc ]   │   │ │  │
│  │ │   MFB Pegasis         │ │ └──────────────────────────────────┘   │ │  │
│  │ │   X DB Stadium        │ │ shape circle · 90cm · theme metrocity │ │  │
│  │ │   Burst Cho-Z         │ │ Features: 1 gravity well · 4 obstacles│ │  │
│  │ └───────────────────────┘ └────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌─── 🎯 Difficulty ──────────────────────────────────────────────────┐    │
│  │  ╭═══════╮  ╭───────╮  ╭───────╮    Hell: frame-perfect dodges,   │    │
│  │  │Medium │  │ Hard  │  │ Hell  │    ring-out plays, predictive    │    │
│  │  ╰═══════╯  ╰───────╯  ╰───────╯    specials + combo cadence.     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌─── 🏆 Series Format ───────────────────────────────────────────────┐    │
│  │  ╭═════╮  ╭─────╮  ╭─────╮     First to 1 win — BO1.              │    │
│  │  │ BO1 │  │ BO3 │  │ BO5 │                                        │    │
│  │  ╰═════╯  ╰─────╯  ╰─────╯                                        │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│         ┌──────────────────────────────────────────────────────────────┐   │
│         │                  ▶  Start AI Battle                          │   │
│         └──────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

**States** — Loading: full-screen spinner during data fetch. Start disabled until all 4 selections filled. Difficulty default = Medium. Combos / Special tabs show empty-state hint when the selected beyblade has no `comboIds` / `specialMoveId`.

---

## 9. AIBattleGamePage — `/game/ai-battle` (in-match)

### 9a. Player view (in-progress)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ● VS AI                Game 1/1   👁 0                       Exit →        │
│                            00:24                                           │
│                                                                  ┌────┐    │
│                                                                  │+0−│    │
│                                                                  └────┘    │
│                     ╭────────────────╮                                     │
│                     │   ◉ ARENA ◉    │                                     │
│                     ╰────────────────╯                                     │
│                                                                            │
│  ┌────────────┐  ┌─── Special ───┐  ┌─── Combos (attached, up to 3) ──┐    │
│  │ CONTROLS … │  │ Gyro Anchor   │  │ Quick Dash R  → → J     ⚡       │    │
│  └────────────┘  │ ▮▮▮▮▮▯▯▯ 65% │  │ Power Thrust  J J J   🔋25     ░ │    │
│                  │ (cost 100)    │  │ Riposte       K K J   🔋15  cd  │    │
│                  └───────────────┘  └─────────────────────────────────┘    │
│                  Special/Combos panels are HIDDEN if the bey has none.     │
│                                                                            │
│  ┌────────────────────┐   ┌────────┐   ┌────────────────────┐              │
│  │ YOU   SpinKing[Atk]│   │   VS   │   │ CPU  Wolfborg [Def]│              │
│  │ HP   ▮▮▮▮▮▮▮▯▯▯ 72%│   │        │   │ HP   ▮▮▮▮▮▮▯▯▯▯ 58%│              │
│  │ Spin ▮▮▮▮▮▮▯▯▯▯ 64%│   └────────┘   │ Spin ▮▮▮▮▮▮▮▯▯▯ 68%│              │
│  │ ● stable           │                │ ● stable           │              │
│  └────────────────────┘                └────────────────────┘              │
└────────────────────────────────────────────────────────────────────────────┘
```

### 9b. End-of-series overlay

```
            ┌────────────────────────────────────────────────┐
            │                     🏆                         │
            │                  Victory!                      │
            │              Series 2 — 1                      │
            │      ┌──────────────┐  ┌──────────────┐        │
            │      │  Play Again  │  │     Menu     │        │
            │      └──────────────┘  └──────────────┘        │
            └────────────────────────────────────────────────┘
```

### 9c. Spectator view

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ● SPECTATING  «SPECTATOR»  Game 1/3  👁 4                  Exit →     1-0  │
│                            00:24                                           │
│                     ╭────────────────╮                                     │
│                     │   ◉ ARENA ◉    │                                     │
│                     ╰────────────────╯                                     │
│  ┌────────────────────┐   ┌────────┐   ┌────────────────────┐              │
│  │ SpinKing  [Attack] │   │   VS   │   │ CPU       [Defense]│              │
│  │ HP …               │   │        │   │ HP …               │              │
│  └────────────────────┘   └────────┘   └────────────────────┘              │
└────────────────────────────────────────────────────────────────────────────┘
```

**Configs:** `difficulty` (medium/hard/hell) shapes CPU input frequency; `bestOf` drives series HUD; `spectate=true` query param swaps view. Hell adds frame-perfect dodges, ring-out-aware approach, and a periodic 3-key combo cadence.

**Spectator perspective (any battle mode)** — when `?spectate=true`:

```
       (battle canvas)             ┌── Watching — click to follow ──┐
                                   │ ✓ SpinKing                     │
                                   │   WolfBorg                     │
                                   │   DragoonStorm                 │
                                   │   CPU-Hell  (AI)               │
                                   └────────────────────────────────┘
                                            +   ⓪   −     (zoom)
```

Clicking a player locks the renderer's camera to that beyblade. The server is also told via the `spectator:follow` message (informational; camera is client-side). Zoom buttons (`+ / 0 / −`) and keyboard shortcuts work for spectators.

---

## 10. TournamentListPage — `/game/tournament`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Back                                                                     │
│  🏆 Tournaments                                                            │
│  Compete in scheduled brackets — auto-fill, AI-exhibition, or pure PVP.    │
│                                                                            │
│  ╭═════════╮  ╭───────╮                                                    │
│  │ Active  │  │  All  │                                                    │
│  ╰═════════╯  ╰───────╯                                                    │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ⚔️  Spring Showdown            «registration»  «PVP»  «BO3»          │  │
│  │     Single-elimination, 8 players, Saturday 7pm.                     │  │
│  │     Max 8 · Starts 2026-05-25 19:00 · Opens in 2d 4h 13m             │  │
│  │                                                  ┌─────────────────┐ │  │
│  │                                                  │   View Lobby →  │ │  │
│  │                                                  └─────────────────┘ │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ 🤖  AI Gauntlet                 «in-progress» «AI-Exh» «BO1»         │  │
│  │     Five rounds vs scaling CPUs.                                     │  │
│  │     Max 4 · Started 14:00            ┌─────────────────┐             │  │
│  │                                      │   View Lobby →  │             │  │
│  │                                      └─────────────────┘             │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ 🏆  Winter Cup                 «completed»  «mixed»  «BO5»  🥇 Drago │  │
│  │     Max 16 · Finished 2026-03-12                                     │  │
│  │                                              ┌─────────────────┐     │  │
│  │                                              │     ░ View ░    │     │  │
│  │                                              └─────────────────┘     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

**States** — Loading: spinner. Empty (active tab): `🏆 No active tournaments — check back soon`.

---

## 11. TournamentLobbyPage — `/game/tournament/:id`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Tournaments                                                              │
│  Spring Showdown        «registration»                                     │
│  Single-elimination · Saturday 7pm                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Type: PVP   ·   Format: BO3   ·   Max: 8   ·   Registered: 6 / 8     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐ ┌───────────────────────────┐  │
│  │  ⏳ Registration closes in              │ │ Participants (6/8)        │  │
│  │       2d 04h 13m 22s                   │ │ ───────────────────────── │  │
│  └────────────────────────────────────────┘ │ ① SpinKing (you)          │  │
│  ┌────────────────────────────────────────┐ │ ② WolfBorg                │  │
│  │ ▶  Your match is live —  Watch        │ │ ③ DragoonStorm            │  │
│  └────────────────────────────────────────┘ │ ④ CPU-Medium «AI»         │  │
│                                             │ ⑤ Driger                  │  │
│  Bracket                                    │ ⑥ Dranzer                 │  │
│  ┌─ Round 1 ──┐ ┌─ Semis ─┐ ┌─ Final ──┐    │ ⑦ ─                       │  │
│  │ SpinKing ↘ │ │ ? — ?   │ │ ? vs ?   │    │ ⑧ ─                       │  │
│  │ WolfBorg ↗ │─│  Watch  │─│          │    │                           │  │
│  │ ─────────  │ │         │ │          │    │ ┌───────────────────────┐ │  │
│  │ Dragoon ↘  │ │ ? — ?   │ │          │    │ │ 🏆 TOURNAMENT WINNER  │ │  │
│  │ Driger ↗   │─│         │─│          │    │ │       —               │ │  │
│  │ ─────────  │ │         │ │          │    │ │ (shown when complete) │ │  │
│  │ Dranzer ↘  │ │ ? — ?   │ │          │    │ └───────────────────────┘ │  │
│  │ CPU-E   ↗  │ │         │ │          │    └───────────────────────────┘  │
│  └────────────┘ └─────────┘ └──────────┘                                   │
└────────────────────────────────────────────────────────────────────────────┘
```

**Next-match panel (when user has a pending match)**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Next match — vs WolfBorg                          [✓ Ready]  [Quit ⚠]    │
│ Opponent is ready — tap Ready to start now.                              │
│ Match cap: 3 min. Score 2 pts for win, 1 for draw, 0 for loss.           │
└──────────────────────────────────────────────────────────────────────────┘
```

If BOTH players Ready, the scheduler opens the room immediately (bypasses the 5-min between-match gap). Quitting marks the user `quit` and triggers a walkover for the opponent.

**States** — Registration / in-progress / completed alter status pill, countdown bar, and winner banner. Non-participants see footer: `Registration is managed by admin. Check back to spectate once matches begin.`

---

## 12. TournamentBattleGamePage — `/game/tournament/battle/:tid/:mid`

Same chrome as BattleGamePage with tournament metadata in the top bar.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ● CONNECTED  Spring Showdown · Semifinals     👁 4    Lobby →     1-1      │
│                            00:52                                           │
│                                                                  ┌────┐    │
│                                                                  │+0−│    │
│                                                                  └────┘    │
│                                          ┌──────────────────────────┐      │
│                     ╭────────────────╮   │ WolfBorg     [Defense]   │      │
│                     │   ◉ ARENA ◉    │   │ HP ▮▮▮▮▮▮▯▯▯▯  56%       │      │
│                     ╰────────────────╯   └──────────────────────────┘      │
│  ┌────────────┐                                                            │
│  │ CONTROLS … │                                                            │
│  └────────────┘   ┌── Special ──┐  ┌── Combos (attached, up to 3) ─────┐   │
│                   │ Gyro Anchor │  │ Quick Dash R  → → J     ⚡         │   │
│                   │ ▮▮▮▯▯▯▯▯    │  │ Power Thrust  J J J   🔋25     ░  │   │
│                   │ (cost 100)  │  │ Riposte       K K J   🔋15  cd   │   │
│                   └─────────────┘  └────────────────────────────────────┘   │
│                       ┌───────────────────────────────────┐                │
│                       │ SpinKing  [Attack]                │                │
│                       │ HP   ▮▮▮▮▮▮▮▮▯▯  78%              │                │
│                       │ Spin ▮▮▮▮▮▮▯▯▯▯  60%              │                │
│                       └───────────────────────────────────┘                │
│  ⏱ Room cap: 3 min (whole series). Tie at cap → draw (1 pt each).          │
└────────────────────────────────────────────────────────────────────────────┘
```

**End overlay (winner)**

```
            ┌────────────────────────────────────────────────┐
            │           Tournament Match Over                │
            │              🏆 SpinKing wins                  │
            │              Series 2 — 1                      │
            │              ┌─────────────────┐               │
            │              │  Back to Lobby  │               │
            │              └─────────────────┘               │
            └────────────────────────────────────────────────┘
```

**End overlay (draw at room cap)**

```
            ┌────────────────────────────────────────────────┐
            │             Match Over — Draw                  │
            │              ⏱ Time limit reached              │
            │              Series 1 — 1                      │
            │            Both players +1 tournament pt       │
            │              ┌─────────────────┐               │
            │              │  Back to Lobby  │               │
            │              └─────────────────┘               │
            └────────────────────────────────────────────────┘
```

**Error state** — `⚠ Match not found / room not open yet` + `← Back to Lobby` button.

---

## 13. RendererDemoPage — `/renderer-demo`

```
┌────────────────────────────────────────────────────────────────────────────┐
│           PixiJS 2.5D Renderer Demo                                        │
│           Theme toggle, spin decay tuning, FX triggers.                    │
│  ┌──────────────────────────────────┐  ┌───────────────────────────────┐   │
│  │                                  │  │ Arena Theme                   │   │
│  │                                  │  │ ╭══════╮ ╭──────╮             │   │
│  │           ◉  CANVAS  ◉           │  │ │Metro │ │Forest│             │   │
│  │       (PIXI live preview)        │  │ ╰══════╯ ╰──────╯             │   │
│  │                                  │  │ ╭──────╮ ╭──────╮             │   │
│  │                                  │  │ │Mount.│ │Desert│             │   │
│  │                                  │  │ ╰──────╯ ╰──────╯             │   │
│  │                                  │  │ ╭──────╮ ╭──────╮ ╭──────╮    │   │
│  │                                  │  │ │ Sea  │ │Futur │ │Prehis│    │   │
│  │                                  │  │ ╰──────╯ ╰──────╯ ╰──────╯    │   │
│  │                                  │  │                               │   │
│  │                                  │  │ Spin Decay Speed              │   │
│  │                                  │  │ None ◌────●─────── Fast       │   │
│  │                                  │  │                               │   │
│  │                                  │  │ Effects                       │   │
│  │                                  │  │ [Collision Burst]             │   │
│  │                                  │  │ [Spin-Out Effect]             │   │
│  │                                  │  │ [Reset Spins]                 │   │
│  │                                  │  │                               │   │
│  │                                  │  │ 2.5D Legend                   │   │
│  │                                  │  │  ● Y-scale (height)           │   │
│  │                                  │  │  ● Skew tilt                  │   │
│  │                                  │  │  ● Motion blur                │   │
│  └──────────────────────────────────┘  └───────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 14. Shared in-game HUD components

### CameraControls (top-right, all battle pages — directly under the Exit link)

```
            ┌────┐
            │ +  │  zoom in        (key: +)
            │ 0  │  reset          (key: 0)
            │ −  │  zoom out       (key: −)
            └────┘
```

Smart follow with two clamps: `minZoom` fits the whole arena, `maxZoom` shows a ~5-bey window centered on the local bey. Camera lerps toward the bey each frame; arena rotation is applied to a sub-layer so the world spins under the camera without rotating the camera itself.

### ControlsLegend (bottom-left, all battle pages, dismissable + persisted)

```
  ┌──────────────────────────────┐
  │ CONTROLS  [LOCKED]      [×]  │
  │  WASD / ←↑↓→    Move         │
  │  I              Jump         │
  │  J              Attack       │
  │  K              Defense      │
  │  L              Dodge        │
  │  ␣  Space       Special      │
  │                 (tap / hold) │
  │  + / − / 0      Zoom         │
  └──────────────────────────────┘
```

The `[LOCKED]` badge appears only while `controlLockedUntilMs > now()` — set by the server when a special move or combo fires (Part 7c / loss-of-control). Dismissed legend collapses to a `Controls ▸` chip; preference persists to localStorage.

### Countdown (full-screen, replaces legacy warmup overlay)

```
            ┌────────────────────────────────────────────────┐
            │                                                │
            │                                                │
            │                      3                         │     plays "countdown-tick" each second
            │                                                │
            │                                                │
            └────────────────────────────────────────────────┘

            ┌────────────────────────────────────────────────┐
            │                                                │
            │                                                │
            │                  ★ FIGHT! ★                    │     orange flash + zoom punch
            │                                                │     plays "countdown-go" sound
            │                                                │
            └────────────────────────────────────────────────┘
```

Renders while `gameState.status === "warmup"` and `timer > 0`; flashes for ~600ms when `timer` crosses 0. Sounds via `SoundManager` (synthesized fallback works without any asset upload).

### Minimap (top-left, only when arena short axis > 80 cm)

```
  ┌──────────────────┐
  │ ╭──────────────╮ │   • arena outline (theme-coloured)
  │ │ ●          ● │ │   • bey dots — yellow = you, red = AI, blue = other
  │ │      ●       │ │   • dashed yellow rect = current camera viewport
  │ │   ┌───┐      │ │
  │ │   ╎ ⛶ ╎      │ │   updated at ~4 Hz from `renderer.getViewportCm()`
  │ │   └───┘      │ │
  │ ╰──────────────╯ │
  └──────────────────┘
```

Auto-hidden for the standard 45cm arena since the in-match camera already shows everything; it appears when admins build "map"-sized arenas (≥ 80cm short axis).

### PIXI layer Z-order (bottom → top, with camera transform)

```
  ┌────────────────────────── stage (screen-space) ─────────────────────────┐
  │ ┌──────────────────────── hudLayer (screen-space) ─────────────────────┐│
  │ └───────────────────────────────────────────────────────────────────────┘│
  │ ┌─ worldRoot (camera transform: translate by −cam·z, scale by zoom) ───┐│
  │ │ ┌────────────────────── particleLayer ──────────────────────────────┐││
  │ │ │ ┌──────────────────── detachedBodyLayer (projectiles/mini-beys) ─┐│││
  │ │ │ │ ┌────────────────── beybladeLayer (in world frame) ───────────┐││││
  │ │ │ │ │ ┌─ arenaRotationRoot (rotates by state.arena.rotation) ─┐    │││││
  │ │ │ │ │ │   featureLayer  (obstacles / pits / water / portals /  │   │││││
  │ │ │ │ │ │                  turrets / loops, frustum-culled)      │   │││││
  │ │ │ │ │ │   arenaLayer    (bowl floor + walls + theme background) │  │││││
  │ │ │ │ │ └────────────────────────────────────────────────────────┘   │││││
  │ │ │ │ └─────────────────────────────────────────────────────────────┘││││
  │ │ │ └─────────────────────────────────────────────────────────────────┘│││
  │ │ └───────────────────────────────────────────────────────────────────┘ ││
  │ └─────────────────────────────────────────────────────────────────────────┘
  └───────────────────────────────────────────────────────────────────────────┘
```

The `worldRoot` carries the smart-follow camera. `arenaRotationRoot` carries the arena spin so a rotating bowl drags features along with it while beyblades remain in the world frame. Children of `worldRoot` position in **world px** (`cm × PX_PER_CM_BASE`) so changing the zoom or rem-size doesn't require re-laying-out individual sprites.

---

# II. ADMIN — GAMEPLAY MANAGEMENT

All admin pages share a top nav (Dashboard · Beyblades · Arenas · Stadiums · Tournaments · Users · Stats · Settings · Assets · 2.5D Parts · Beyblade Systems · Arena Systems). Omitted from individual mocks for compactness.

The admin sidebar's "Signed in as" card now ends with `[Sign out] [🌙/☀️]` — the second button is the `ThemeToggle` that flips light/dark (also surfaced in the player-facing `RootLayout` next to the AuthChip). Theme preference persists to `localStorage` (`beyblade.theme`) and applies via `<html data-theme="…">` CSS variables.

---

## 15. AdminDashboardPage — `/admin`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                                           │
│  Overview of activity, tournaments, and content.                           │
│                                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ 1,284        │ │ 42           │ │ 18           │ │ 6            │       │
│  │ Matches      │ │ Active users │ │ Beyblades    │ │ Tournaments  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                            │
│  ┌── 🏆 Tournament status ────────────────────────────────────────────┐    │
│  │ Spring Showdown — registration closes in 2d 4h.   [ Manage → ]    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  Quick actions                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ │
│  │ + Beyblade│ │ + Arena  │ │ + Stadium│ │ + Tournm.│ │  Assets  │ │ 2.5D │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────┘ │
│                                                                            │
│  Recent matches                                                            │
│  ┌─────────────┬───────────────┬────────────────────┬────────────────────┐ │
│  │ Match ID    │ Mode          │ Winner             │ Date               │ │
│  ├─────────────┼───────────────┼────────────────────┼────────────────────┤ │
│  │ m_8a3…d1    │ PVP · BO3     │ SpinKing           │ 2026-05-22 14:02   │ │
│  │ m_77c…aa    │ AI · BO1      │ Driger             │ 2026-05-22 13:48   │ │
│  │ m_22b…0f    │ Tournament    │ WolfBorg           │ 2026-05-22 13:30   │ │
│  └─────────────┴───────────────┴────────────────────┴────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

**States** — stat cards show spinners while loading; matches list empty: `No matches played yet`.

---

## 16. UsersPage — `/admin/users`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Users (42)                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  🔍  Search by email / display name / UID                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ╭─╮ Mohasin Chinnapattan (you)  mking0502@gmail.com  «admin»   ─    │  │
│  │ ╭─╮ SpinKing                    spin@king.io          «player» [Promote]│
│  │ ╭─╮ WolfBorg                    wolf@borg.io          «admin»  [Demote] │
│  │ ╭─╮ DragoonStorm                dragoon@storm.io      «player» [Promote]│
│  │   ⋮                                                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

**Rules** — current user row shows `─` instead of action (can't self-demote).

---

## 17. StatsPage — `/admin/stats`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Statistics                                                                │
│  ┌─────────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │ Top Players                     │  │ Recent Matches                   │ │
│  │ ╭══════╮ ╭───────╮ ╭───────╮    │  │ ───────────────────────────────  │ │
│  │ │ Wins │ │ Win % │ │Damage │    │  │ m_8a3…d1  PVP·4p·BO3  SpinKing  │ │
│  │ ╰══════╯ ╰───────╯ ╰───────╯    │  │ m_77c…aa  AI·BO1      Driger    │ │
│  │ 🥇 SpinKing       38W-4L (90%)  │  │ m_22b…0f  Tournament  WolfBorg  │ │
│  │ 🥈 WolfBorg       35W-5L        │  │ m_19e…77  PVP·2p·BO5  Dranzer   │ │
│  │ 🥉 DragoonStorm   32W-19L       │  │ ⋮                               │ │
│  │  4 Driger         18W-7L        │  │                                  │ │
│  │ ⋮                               │  │                                  │ │
│  └─────────────────────────────────┘  └──────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 18. SettingsPage — `/admin/settings`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Game Settings                                           [  Save  ]        │
│  ┌── Game Config ─────────────────────────────────────────────────────┐    │
│  │ defaultArenaId            ┌────────────────────┐                   │    │
│  │                           │ classic_bowl       │                   │    │
│  │ maxPlayersPerRoom         [▼  4              ]                     │    │
│  │ matchTimeoutSeconds       ┌──────┐                                 │    │
│  │                           │ 180  │                                 │    │
│  └──────────────────────────────────────────────────────────────────┘      │
│  ┌── Game Modes ──────────────────────────────────────────────────────┐    │
│  │ [✓] Tryout      [✓] PVP      [✓] AI Battle    [✓] Tournament       │    │
│  │ [ ] Maintenance mode                                               │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│  ┌── Arena Features ──────────────────────────────────────────────────┐    │
│  │ [✓] Special Moves  [✓] Turrets    [✓] Portals                      │    │
│  │ [✓] Water Bodies   [✓] Pits       [✓] Loops                        │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│  ┌── Global Blacklists ───────────────────────────────────────────────┐    │
│  │ globalBeybladeBlacklist  ┌──────────────────────────────────────┐  │    │
│  │                          │ comma,separated,ids                  │  │    │
│  │                          └──────────────────────────────────────┘  │    │
│  │ globalArenaBlacklist     ┌──────────────────────────────────────┐  │    │
│  │                          │                                      │  │    │
│  │                          └──────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│  ┌── Tournament Settings ─────────────────────────────────────────────┐    │
│  │ minimumTournamentGapMinutes  ┌──────┐                              │    │
│  │                              │  30  │                              │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│  ┌── Server Message ──────────────────────────────────────────────────┐    │
│  │ ┌──────────────────────────────────────────────────────────────┐   │    │
│  │ │ Shown to all players on /game.                               │   │    │
│  │ └──────────────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 19. TournamentsListPage — `/admin/tournaments`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Tournaments                                  [ + Create Tournament ]      │
│  ┌──────────────┬───────┬────────────┬──────┬────────────┬───────────────┐ │
│  │ Name         │ Type  │ Status     │ Max  │ Scheduled  │ Actions       │ │
│  ├──────────────┼───────┼────────────┼──────┼────────────┼───────────────┤ │
│  │ Spring Show… │ PVP   │ «reg»      │  8   │ 05-25 19:00│ Manage  Cancel│ │
│  │ AI Gauntlet  │ AI-Ex │ «running»  │  4   │ 05-22 14:00│ Manage        │ │
│  │ Spring Beta  │ Mixed │ «draft»    │ 16   │ 06-01 18:00│ Manage  Open  │ │
│  │ Winter Cup   │ PVP   │ «done»     │ 16   │ 03-12 18:00│ Manage        │ │
│  └──────────────┴───────┴────────────┴──────┴────────────┴───────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 20. TournamentCreatePage — `/admin/tournaments/create`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Tournaments                                                              │
│  Create Tournament                                                         │
│  ┌── Basic Info ───────────────────────────────────────────────────────┐   │
│  │ Name        ┌─────────────────────────────────────────────────────┐ │   │
│  │             │ Spring Showdown                                     │ │   │
│  │ Description ┌─────────────────────────────────────────────────────┐ │   │
│  │             │ Single-elim, Saturday 7pm                          │ │   │
│  │             └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌── Schedule ─────────────────────────────────────────────────────────┐   │
│  │ scheduledStartTime        [2026-05-25 19:00]                        │   │
│  │ registrationDeadline      [2026-05-24 23:59]                        │   │
│  │ roundIntervalMinutes      ┌────┐                                    │   │
│  │                           │ 15 │                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌── Format ───────────────────────────────────────────────────────────┐   │
│  │ Type             [▼ PVP / Player-Gauntlet / Mixed / AI-Exhibition ] │   │
│  │ Max Participants [▼ 2 / 4 / 8 ]                                     │   │
│  │ Best Of          [▼ 1 / 3 / 5 ]                                     │   │
│  │ AI Difficulty    [▼ Medium / Hard / Hell ]   (only if AI/Mixed)     │   │
│  │ [✓] Auto-fill empty slots with AI                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌── Restrictions ─────────────────────────────────────────────────────┐   │
│  │ allowedBeybladeIds   ┌──────────────────────────────────────────┐   │   │
│  │                      │  (empty = all)                            │   │   │
│  │ disabledBeybladeIds  │  blacklist comma list                     │   │   │
│  │ allowedArenaIds      │                                           │   │   │
│  │                      └──────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              [ Cancel ] [   Create Tournament   ]          │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 21. TournamentDetailPage — `/admin/tournaments/:id`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Tournaments        Spring Showdown   «registration»     [ View Lobby ]   │
│  ┌── Actions ─────────────────────────────────────────────────────────┐    │
│  │ [Open Registration] [Generate Bracket & Start] [Mark Completed]    │    │
│  │ [Cancel]                                                           │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│  ┌── Bracket ───────────────────────────────────────────┐ ┌── Participants ┐│
│  │ Round 1        Semifinals       Final                │ │ (6/8)         ││
│  │ ┌─────────────┐ ┌──────────┐ ┌──────────┐            │ │ ① SpinKing   ││
│  │ │ SpinKing  ↘ │ │ ?    ?   │ │   ?  ?   │            │ │   «registered»││
│  │ │ WolfBorg  ↗ │ │ Watch    │ │          │            │ │   [ ✕ ]      ││
│  │ │ room: r_…   │ │          │ │          │            │ │ ② WolfBorg   ││
│  │ ├─────────────┤ │          │ │          │            │ │ ③ Dragoon    ││
│  │ │ Dragoon  ↘  │ │ ?    ?   │ │          │            │ │ ④ CPU-Hard   ││
│  │ │ Driger   ↗  │ │          │ │          │            │ │   «AI»       ││
│  │ │ room: r_…   │ │          │ │          │            │ │ ⑤ ─          ││
│  │ ├─────────────┤ │          │ │          │            │ │                │
│  │ │ Dranzer  ↘  │ │ ?    ?   │ │          │            │ │ Add AI         │
│  │ │ CPU-Med  ↗  │ │          │ │          │            │ │ Name [____]    │
│  │ │ room: r_…   │ │          │ │          │            │ │ Diff [▼ med]   │
│  │ └─────────────┘ └──────────┘ └──────────┘            │ │ [ + Add AI ]   │
│  └────────────────────────────────────────────────────  ┘ └────────────────┘│
└────────────────────────────────────────────────────────────────────────────┘
```

**States** — `No bracket generated yet` placeholder when `status==registration`. Winner crown 👑 appears on winning slot. Match cards show colyseusRoomId once scheduler opens the room.

---

## 22. BeybladesListPage — `/admin/beyblades`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Beyblades                                  [ + Create Beyblade ]          │
│  ╭═════╮ ╭───────╮ ╭───────╮ ╭───────╮ ╭───────╮                           │
│  │ All │ │Attack │ │Defense│ │Stamina│ │Balanc.│                           │
│  ╰═════╯ ╰───────╯ ╰───────╯ ╰───────╯ ╰───────╯                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │     ╭─────╮     │  │     ╭─────╮     │  │     ╭─────╮     │             │
│  │     │  D  │     │  │     │  W  │     │  │     │  Dr │     │             │
│  │     ╰─────╯     │  │     ╰─────╯     │  │     ╰─────╯     │             │
│  │ Dragoon         │  │ WolfBorg        │  │ Driger          │             │
│  │ «Attack» ↻      │  │ «Defense» ↺     │  │ «Stamina» ↻     │             │
│  │ 50g · 3.5cm     │  │ 60g · 3.2cm     │  │ 45g · 3.4cm     │             │
│  │ Atk ▮▮▮▮▮▯▯ 130 │  │ Atk ▮▮▯▯▯▯▯  60 │  │ Atk ▮▮▮▯▯▯▯ 90  │             │
│  │ Def ▮▮▯▯▯▯▯  70 │  │ Def ▮▮▮▮▮▮▮ 150 │  │ Def ▮▮▯▯▯▯▯ 70  │             │
│  │ Sta ▮▮▮▯▯▯▯  90 │  │ Sta ▮▮▮▯▯▯▯ 90  │  │ Sta ▮▮▮▮▮▮▯ 140 │             │
│  │  [ Edit ]  [✕] │  │  [ Edit ]  [✕] │  │  [ Edit ]  [✕]  │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│  ⋮                                                                         │
└────────────────────────────────────────────────────────────────────────────┘
```

**Delete modal**

```
            ┌──────────────────────────────────────┐
            │ Delete "Dragoon"?                    │
            │ This cannot be undone.               │
            │       [ Cancel ]   [ Delete ]        │
            └──────────────────────────────────────┘
```

---

## 23. BeybladeCreatePage — `/admin/beyblades/create` (4-step wizard)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Beyblades                                                                │
│   ●─────────○─────────○─────────○                                          │
│   Basic     Type      Image     Contact Points                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Step 0 — Basic Info

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Display name   ┌──────────────────────────────────────────────────────┐   │
│                 │ Dragoon                                              │   │
│                 └──────────────────────────────────────────────────────┘   │
│  Spin direction   ╭══════════╮ ╭──────────╮                                │
│                   │ ↻ Right  │ │ ↺ Left   │                                │
│                   ╰══════════╯ ╰──────────╯                                │
│  Mass (g)         [ 50 ]    range 30–80                                    │
│  Radius (cm)      [ 3.5 ]   range 2–7                                      │
│                                                                            │
│                          [ ← Back ]      [ Continue → ]                    │
└────────────────────────────────────────────────────────────────────────────┘
```

### Step 1 — Type Distribution (max 150 each, total = 360)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Attack    ╭──────────●─────────╮  130                                     │
│  Defense   ╭──●──────────────────╮   70                                    │
│  Stamina   ╭─────●────────────────╮   90  Total: 290 / 360                 │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ damageMultiplier  1.91x       maxSpin   2,160                      │    │
│  │ damageReduction   0.79x       spinDecay 7.28/s                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                          [ ← Back ]      [ Continue → ]   (disabled <360)  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Step 2 — Image upload

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │           ⤓  Drag image here or click to choose                      │  │
│  │              (png/jpg, ≤2MB, square preferred)                       │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────┐  After upload:                                 │
│  │       ╭───────╮        │  [ Reposition ]  [ Crop ]                      │
│  │       │ image │        │                                                │
│  │       ╰───────╯        │                                                │
│  └────────────────────────┘                                                │
│  [ ← Back ]   [ Continue → ]                                               │
└────────────────────────────────────────────────────────────────────────────┘
```

### Step 3 — Contact Points (full-width editor)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Contact Points                                                            │
│  ┌────────────────────────────────┐  ┌─── Point list ────────────────────┐ │
│  │      ╭───────────────╮         │  │ #1  θ=0°    spinSteal=12         │ │
│  │      │   ◉ preview ◉ │         │  │     [ edit ]                     │ │
│  │      │     (click)   │         │  │ #2  θ=90°   spinSteal=8          │ │
│  │      ╰───────────────╯         │  │ #3  θ=180°  spinSteal=12         │ │
│  │                                │  │ #4  θ=270°  spinSteal=8          │ │
│  │  [ + Add Point ]               │  │ [ + Add ]                        │ │
│  └────────────────────────────────┘  └──────────────────────────────────┘ │
│                          [ ← Back ]      [   Create Beyblade   ]           │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 24. BeybladeEditPage — `/admin/beyblades/:id/edit`

Same fields as create but as one consolidated form with a sticky preview.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Edit Dragoon                                              [   Save   ]    │
│  ┌── Basic Info ──────────────┐  ┌── Sticky Preview ────────┐              │
│  │ Name [ Dragoon          ]  │  │      ╭─────────╮         │              │
│  │ Spin [ ↻ Right ][ ↺ Left ] │  │      │  image  │         │              │
│  │ Mass [ 50 ] Radius [ 3.5 ] │  │      ╰─────────╯         │              │
│  └────────────────────────────┘  │ Dragoon                  │              │
│  ┌── Sprite Image ────────────┐  │ «Attack» ↻               │              │
│  │     ╭─────╮ [Replace]      │  │ damageMultiplier 1.91x   │              │
│  │     │ img │ [Reposition]   │  │ damageReduction  0.79x   │              │
│  │     ╰─────╯ [Crop]         │  │ maxSpin          2,160   │              │
│  └────────────────────────────┘  │ spinDecay        7.28/s  │              │
│  ┌── Type Distribution ───────┐  │ stability        good    │              │
│  │ Attack  ●─────────  130    │  └──────────────────────────┘              │
│  │ Defense ●──            70  │                                            │
│  │ Stamina ●────          90  │                                            │
│  │ Total 290 / 360 (save off) │                                            │
│  └────────────────────────────┘                                            │
│  ┌── Contact Points (full width) ───────────────────────────────────────┐  │
│  │  (same as create step 3)                                             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 25. ArenasListPage — `/admin/arenas`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Arenas                                       [ + Create Arena ]           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │      ◯           │  │      ▭           │  │      ◯           │          │
│  │   (forest)       │  │   (metro)        │  │   (desert)       │          │
│  │ Classic Bowl     │  │ Skyline Square   │  │ Sandstone Pit    │          │
│  │ circle · 1080x1080│ │ rect · 1280x720  │  │ circle · 900x900 │          │
│  │  [ Edit ] [ ✕ ]  │  │  [ Edit ] [ ✕ ]  │  │  [ Edit ] [ ✕ ]  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 26. ArenaCreatePage — `/admin/arenas/create`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Arenas                                                                   │
│  Create Arena                                                              │
│  Name        ┌─────────────────────────────────────────────────────────┐   │
│              │ Classic Bowl                                            │   │
│  Shape       ╭═════════╮ ╭══════════╮                                      │
│              │ ◯ Circle│ │▭ Rectangle│                                     │
│              ╰═════════╯ ╰──────────╯                                      │
│  Theme       ╭══════╮ ╭──────╮ ╭──────╮ ╭──────────╮ ╭──────╮              │
│              │Metro │ │Forest│ │Mount.│ │Grasslands│ │Desert│              │
│              ╰══════╯ ╰──────╯ ╰──────╯ ╰──────────╯ ╰──────╯              │
│              ╭──────╮ ╭───────╮ ╭───────────╮ ╭───────╮ ╭───────╮          │
│              │ Sea  │ │Futur. │ │Prehistoric│ │Safari │ │Riverb.│          │
│              ╰──────╯ ╰───────╯ ╰───────────╯ ╰───────╯ ╰───────╯          │
│  Width  [ 1080 ]   Height [ 1080 ]      px, range 400–2000                 │
│         "1cm = 24px at 1080p"                                              │
│                              [ Cancel ]   [   Create   ]                   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 27. ArenaEditPage — `/admin/arenas/:id/edit`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Arenas    Edit Classic Bowl                              [   Save   ]    │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ArenaConfigurator                                                   │  │
│  │  ┌─────────────────────────────────┬──────────────────────────────┐  │  │
│  │  │       LIVE 2D / 2.5D PREVIEW    │  Tabs: Obstacles · Pits ·    │  │  │
│  │  │   (drag handles for placement)  │  Water · Turrets · Portals · │  │  │
│  │  │                                 │  Speed paths · Loops         │  │  │
│  │  │   ╭──────────────╮              │  ───────────────────────────│  │  │
│  │  │   │   ◉ ARENA ◉  │              │  Selected: Obstacle #1       │  │  │
│  │  │   ╰──────────────╯              │  x [ 540 ]  y [ 540 ]        │  │  │
│  │  │                                 │  r [ 32 ]   asset [▼ block ] │  │  │
│  │  │   ● obstacle  ◯ pit  ~ water    │  [ Delete ] [ Duplicate ]    │  │  │
│  │  └─────────────────────────────────┴──────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 28. ArenaTestPage — `/admin/arenas/test`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Arena Test                                                                │
│  Drop 2 beyblades into an arena and watch them orbit.                      │
│                                                                            │
│  Arena   [▼ Classic Bowl                                ]                  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │                          ◉ canvas (500px) ◉                          │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌──── Red ────────────────────┐ ┌──── Blue ───────────────────┐           │
│  │ Orbit: outer counter-clock  │ │ Orbit: inner clockwise      │           │
│  │ Spin: 2,000 / decay 7.5/s   │ │ Spin: 2,000 / decay 7.5/s   │           │
│  └─────────────────────────────┘ └─────────────────────────────┘           │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 29. StadiumsListPage — `/admin/stadiums`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Stadiums                                     [ + Create Stadium ]         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   ▒▒▒▒▒▒▒▒▒▒     │  │   ▒▒▒▒▒▒▒▒▒▒     │  │   ▒▒▒▒▒▒▒▒▒▒     │          │
│  │   ▒  image  ▒    │  │   ▒  image  ▒    │  │   ▒  image  ▒    │          │
│  │   ▒▒▒▒▒▒▒▒▒▒     │  │   ▒▒▒▒▒▒▒▒▒▒     │  │   ▒▒▒▒▒▒▒▒▒▒     │          │
│  │ Tokyo Dome       │  │ Mountain Pit     │  │ Cyber Arena      │          │
│  │ Indoor 4-player… │  │ Outdoor 2-player…│  │ Futuristic, neon…│          │
│  │  [ Edit ] [ ✕ ]  │  │  [ Edit ] [ ✕ ]  │  │  [ Edit ] [ ✕ ]  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 30. StadiumCreatePage / StadiumEditPage

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Stadiums                                                                 │
│  Create Stadium                                                            │
│  Name         ┌──────────────────────────────────────────────────────┐     │
│               │ Tokyo Dome                                           │     │
│  Description  ┌──────────────────────────────────────────────────────┐     │
│               │ Indoor 4-player venue with city skyline backdrop.   │     │
│               └──────────────────────────────────────────────────────┘     │
│  Max Players  [▼ 2 / 3 / 4 ]                                               │
│  Image        ┌──────────────────────────────────────────────────────┐     │
│               │  ⤓  drag image here or click to choose               │     │
│               │  (≤2MB, landscape preferred)                         │     │
│               └──────────────────────────────────────────────────────┘     │
│               After upload:  [ Reposition ]  [ Crop ]                      │
│                              [ Cancel ]   [   Create   ]                   │
└────────────────────────────────────────────────────────────────────────────┘
```
Edit page identical with `[ Save ]` button + image replace/remove.

---

# III. ADMIN — ASSETS & 2.5D PART SYSTEM

---

## 31. AssetsLibraryPage — `/admin/assets`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Assets Library                                                            │
│  Manage textures, sprites, and sounds.                                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │  🌆 Arena Theme │ │  🪨 Obstacles   │ │  🔫 Turrets     │               │
│  │  Backgrounds    │ │  Sprites & icons│ │  Bases + bullets│               │
│  │  «metro·forest» │ │  «block·spike»  │ │  «cannon·laser»│               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │  💧 Water Bodies│ │  🌀 Portals     │ │  🔊 Sounds      │               │
│  │  Surface tiles  │ │  Sprites/anims  │ │  SFX + music    │               │
│  │  «sea·river»    │ │  «warp·return»  │ │  «hit·spin·win» │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                            │
│  ┌── Guidelines ▾ ────────────────────────────────────────────────────┐    │
│  │ • Images: PNG/JPG, ≤2MB                                            │    │
│  │ • Sounds: MP3/OGG, ≤500KB                                          │    │
│  │ • Uploaded to Firebase Storage; URLs cached in Firestore.          │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 32. Asset CRUD template (shared by ArenaTheme · Obstacle · Turret · WaterBody · Portal · Sound pages)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  🪨 Obstacle Assets                                                        │
│  Upload images for obstacles. Tag by type so admins can pick by category.  │
│                                                                            │
│  ┌── Upload new ──────────────────────────────────────────────────────┐    │
│  │ Name    ┌──────────────────────┐  Tag [▼ block / spike / pillar ]  │    │
│  │         │ Rusty Pillar         │                                   │    │
│  │ File    ┌──────────────────────┐                                   │    │
│  │         │  ⤓ choose…           │  [ Reposition ]  [ Crop ]         │    │
│  │                                              [   Upload   ]        │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  Filter ╭═════╮ ╭───────╮ ╭───────╮ ╭────────╮                             │
│         │ All │ │ block │ │ spike │ │ pillar │                             │
│         ╰═════╯ ╰───────╯ ╰───────╯ ╰────────╯                             │
│                                                                            │
│  ┌────────────┬─────────────────────────────┬─────────┬─────────┬────────┐ │
│  │ Preview    │ Name                         │ Tag     │ Created │ Action │ │
│  ├────────────┼─────────────────────────────┼─────────┼─────────┼────────┤ │
│  │  ▒▒        │ Concrete Block               │ block   │ 03-12   │ [✕]   │ │
│  │  ▒▒        │ Iron Spike                   │ spike   │ 04-02   │ [✕]   │ │
│  │  ▒▒        │ Rusty Pillar                 │ pillar  │ 05-22   │ [✕]   │ │
│  └────────────┴─────────────────────────────┴─────────┴─────────┴────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

**Accepted formats** — PNG, JPG, GIF (animated, preserved end-to-end), WebP. GIF uploads bypass the WhatsApp-style editor so animation is not flattened. The raw preview is a native `<img>` so animated GIFs play during admin browsing too.

**Per-type variations**

| Page | Page Title | Tag dropdown values | Notes |
|------|-----------|---------------------|-------|
| ArenaThemeAssetsPage | 🌆 Arena Theme Assets | metrocity / forest / mountains / desert / sea / futuristic / prehistoric / grasslands / safari / riverbank / **switch** | Square textures |
| ObstacleAssetsPage | 🪨 Obstacle Assets | rock / pillar / barrier / wall / crystal / box / tire / **switch** / **bump** / **spin-zone** / **gravity-well** | Shared library for the new feature family; tag drives the renderer |
| TurretAssetsPage | 🔫 Turret Assets | turret-bullet / turret-laser / turret-boomerang / projectile-bullet / projectile-laser / projectile-boomerang / **switch** | Both base + projectile sprites |
| WaterBodyAssetsPage | 💧 Water Body Assets | water / lava / sand / ice / acid / mud / oil / **switch** | Animated tiling |
| PortalAssetsPage | 🌀 Portal Assets | portal-ring / portal-entrance / portal-exit / teleport-effect / **switch** | Optional anim frames |
| SoundAssetsPage | 🔊 Sound Assets | hit / spin / win / bg-music / ui | MP3/OGG; preview play button replaces image cell |

The **switch** tag is the universal "wired-to-a-switch" sprite for that feature family — used when a feature is `controlledBySwitchId`.

---

## 33. PartSearchPage — `/admin/2d/parts`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Part Search                                                               │
│  Browse the 2.5D part library by category.                                 │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  🔍  Search by name…                                                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ╭═════╮ ╭────╮ ╭────╮ ╭─────╮ ╭──────╮ ╭────────╮ ╭─────────╮ ╭──────────╮│
│  │ All │ │ AR │ │ WD │ │ Tip │ │ Core │ │ Casing │ │Sub-Part │ │BitBeast  ││
│  ╰═════╯ ╰────╯ ╰────╯ ╰─────╯ ╰──────╯ ╰────────╯ ╰─────────╯ ╰──────────╯│
│                                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │     ⛓        │ │     ⚖        │ │     ▼        │ │     ◎        │       │
│  │ Attack Ring  │ │ Weight Disk  │ │     Tip      │ │    Core      │       │
│  │  rotating    │ │  mass disc   │ │ contact base │ │  inner mass  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │     ◉        │ │     ▣        │ │     ✦        │ │     ↺        │       │
│  │   Casing     │ │  Sub-Parts   │ │  Bit Beast   │ │ Spin Track   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 34. PartListPage — `/admin/2d/parts/:type`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Part Search › Attack Rings                              [ + New Part ]    │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  🔍  Filter by display name                                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  18 attack rings                                                           │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ▣  Dragoon Storm AR             4-blade attack ring with sharp tips. │  │
│  │    id: ar_storm                                          [Edit] [✕] │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ▣  Wolf Crash AR                Heavy, defensive — 6 contact pts.   │  │
│  │    id: ar_wolf                                           [Edit] [✕] │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ▣  Driger Flash AR              Spin-steal serration pattern.       │  │
│  │    id: ar_flash                                          [Edit] [✕] │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

Empty state: `No parts yet — [ + New Part ]`. Delete shows confirm modal as in 22.

---

## 35. PartCreatePage — `/admin/2d/parts/:type/new`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Part Search › Attack Rings › New                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Display Name  ┌────────────────────────────────────────────────────┐ │  │
│  │               │ New Attack Ring                                    │ │  │
│  │ Color         ┌──────┐  hex: 1a1a1a                                │ │  │
│  │               │ ▣    │                                             │ │  │
│  │               └──────┘                                             │ │  │
│  │                                                                    │ │  │
│  │            [ Cancel ]     [  Create Attack Ring  ]                 │ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 36. PartEditPage — `/admin/2d/parts/:type/:id`

The `PartEditor` is a sticky-tab + main-pane layout. Saving is explicit (top-right `Save`); the page warns on navigate-away if dirty.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ← Part Search › Attack Rings › Edit                        [   Save   ]   │
│                                                                            │
│  ┌── Tabs (sticky, horizontal scroll on narrow screens) ────────────────┐  │
│  │ ╭═════════╮ ╭───────╮ ╭───────╮ ╭───────╮ ╭──────────╮ ╭─────────╮   │  │
│  │ │Overview │ │Preview│ │ Shape │ │Images │ │Dimensions│ │Material │   │  │
│  │ ╰═════════╯ ╰───────╯ ╰───────╯ ╰───────╯ ╰──────────╯ ╰─────────╯   │  │
│  │ ╭──────────────╮ ╭──────────────╮ ╭─────────╮ ╭───────────────╮      │  │
│  │ │Contact Points│ │Configurations│ │ Pockets │ │  Type Fields  │      │  │
│  │ ╰──────────────╯ ╰──────────────╯ ╰─────────╯ ╰───────────────╯      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Overview tab

```
┌── Overview ─────────────────────────────────────────────────────────────┐
│  Display Name [ Dragoon Storm AR                                     ]  │
│  Color        [ ▣ ]  hex 0a3b8c                                         │
│  Sub-component  ◯ standalone part   ◉ requires a parent part            │
│                                                                         │
│  Compatibility tags ── used by the Slot/PartPicker when assembling      │
│   ┌── compatibilityTags ───────────────────────┐  [ + add ]             │
│   │ «attack»  «storm-series»                   │                        │
│   └────────────────────────────────────────────┘                        │
│   ┌── requiredCompatibility (must share a tag)─┐  [ + add ]             │
│   │ «core-storm»                               │                        │
│   └────────────────────────────────────────────┘                        │
│   ┌── excludedCompatibility (mutually banned)──┐  [ + add ]             │
│   │ (none)                                     │                        │
│   └────────────────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Preview tab — single-part 2.5D viewer

```
┌── Preview ──────────────────────────────────────────────────────────────┐
│  ╭═══════╮ ╭────────╮ ╭───────╮ ╭───────╮ ╭───────────╮                 │
│  │Top-Dn │ │ Side   │ │  Iso  │ │ Layer │ │ Compare → │  ◯ show grid    │
│  ╰═══════╯ ╰────────╯ ╰───────╯ ╰───────╯ ╰───────────╯  ◉ show axes    │
│                                                                         │
│  ┌── Top-Down ──────────┐ ┌── Side ─────────┐ ┌── Isometric ────────┐   │
│  │                      │ │  ▁▂▃▄▅▆▇        │ │       ╱▲╲           │   │
│  │     ◉───◎───◉        │ │  ████████       │ │      ╱██╲           │   │
│  │     │       │        │ │  ████████       │ │     ╱████╲          │   │
│  │     ◎       ◎        │ │  ████████       │ │    ╱██████╲         │   │
│  │     │       │        │ │  ▔▔▔▔▔▔▔▔       │ │   ╱────────╲        │   │
│  │     ◉───◎───◉        │ │  axis: height   │ │  + drag to orbit    │   │
│  │  ↺ spin direction    │ │  X = radius     │ │  + scroll to zoom   │   │
│  └──────────────────────┘ └─────────────────┘ └─────────────────────┘   │
│                                                                         │
│  ┌── Layer breakdown ────────────────────────────────────────────────┐  │
│  │  ▣ band #1  r 0–12mm   material plastic  density 1.2  bounce 0.4 │  │
│  │  ▣ band #2  r 12–25mm  material metal    density 6.5  bounce 0.1 │  │
│  │  ◉ contact points: 4 @ θ 0/90/180/270   spin-steal 12 each       │  │
│  │  ▫ pocket #1 «blade-mod» (empty)                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Stats:  height 8 mm · radius 25 mm · mass 12 g · attack 130 · steal 12 │
└─────────────────────────────────────────────────────────────────────────┘
```

### Shape tab — workflow tier + tab strip

The Shape tab auto-detects which views are uploaded and picks a **workflow tier badge** at the top:

| Tier badge | When | Behaviour |
|------------|------|-----------|
| `Full Geometry`      🟢 | Top + Side + Bottom | All 3 silhouettes available — full 3-view reconstruction. |
| `Revolution Profile` 🔵 | Top + Side          | Top footprint extruded along side-profile spline (lathe). |
| `Uniform Extrusion`  🟡 | Top only            | Top silhouette extruded straight up to `height`. |
| `Profile Only`       🟠 | Side only           | Side-profile spline revolved about Y axis (circular plan). |
| `Preset`             ▫ | No images           | Parametric preset only — no extraction available. |

```
┌── Shape ────────────────────────────────────────────────────────────────┐
│  Shape workflow:  ⬤ Revolution Profile  Top footprint + side spline     │
│                                                                         │
│  ┌── Image scale ────────────────────────────────────────────────────┐  │
│  │  Top diam:    [ 38 ] mm    Bottom diam: [ 38 ] mm                 │  │
│  │  Side height: [ 60 ] mm    Side radius: [ 40 ] mm                 │  │
│  │  ▸ Trace settings (collapsed)                                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌── Trace settings (expanded) ──────────────────────────────────────┐  │
│  │  RDP tolerance (px)  ◌──●──────  2.0     Alpha threshold  ◌──●──  │  │
│  │  Higher = smoother                       32 / 255                 │  │
│  │  Trace resolution    [▼ 256 px — default ]                        │  │
│  │  Side trace knots    [ 10 ]   knots produced when tracing side    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ╭═════════╮ ╭───────╮ ╭─────────╮ ╭──────────────╮ ╭────────╮         │
│  │ Preset  │ │Bezier │ │ Fourier │ │ Side Profile │ │ Bottom │  ← tabs │
│  ╰═════════╯ ╰───────╯ ╰─────────╯ ╰──────────────╯ ╰────────╯         │
│      (Bezier/Fourier shown only when topView image OR bezierPath set;   │
│       Side shown only when sideView image OR sideProfileSpline set;     │
│       Bottom shown only when bottomView image OR bottomBezierPath set.) │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Shape › Preset sub-tab

```
┌── Preset shape ─────────────────────────────────────────────────────────┐
│  ╭─⬤ circle ─╮  ╭ ◎ ring ╮  ╭ 🔺 star3 ╮  ╭═ ✦ star4 ═╮                 │
│  ╭ ⭐ star6 ╮  ╭ △ tri  ╮  ╭ ■ square ╮  ╭ ⬡ hexagon ╮  ← selected      │
│                                                                         │
│  ┌── Shape parameters ───────────────────────────────────────────────┐  │
│  │  Outer diameter   ◌─────●─────  38 mm                             │  │
│  │  Rotation offset  ●─────────── 0°                                 │  │
│  │  Point depth (inner / outer ratio)  ◌──●─────  40%   (star only)  │  │
│  │  Changes baked into Bezier path → switch to Bezier tab to refine. │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Or trace shape from the uploaded top-view image:                       │
│      [  Trace Silhouette from Top Image →  ]    ◌ tracing…              │
│      Extracts a Bezier polygon from the no-background PNG.              │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Shape › Bezier sub-tab — interactive polygon editor

```
┌── Bezier polygon (drag, delete, refine) ───────────────────────────────┐
│  ┌── 260×260 canvas ─────────────────┐  Controls                       │
│  │ ⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅│  ─────────────────────────────    │
│  │ ⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅◉━━━━◉⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅│  64 segments                  │
│  │ ⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅◉━━━╱       ╲━━━◉⋅⋅⋅⋅⋅⋅⋅│  Tolerance ◌──●──── 1.0 mm    │
│  │ ⋅⋅⋅⋅⋅⋅⋅◉━━╱   reference  ╲━━◉⋅⋅⋅⋅⋅│  Higher → fewer polygon pts   │
│  │ ⋅⋅⋅⋅⋅⋅◉━(  image at 25% α  )◉⋅⋅⋅⋅⋅│                              │
│  │ ⋅⋅⋅⋅⋅⋅◉━━╲   ◉ selected   ╱━━◉⋅⋅⋅⋅⋅│  [ ↻ Sync Fourier ]           │
│  │ ⋅⋅⋅⋅⋅⋅⋅◉━━━╲ ●◌●handles ╱━━━◉⋅⋅⋅⋅⋅⋅│   (re-derives FourierProfile  │
│  │ ⋅⋅⋅⋅⋅⋅⋅⋅⋅◉━━━◉━━━━◉━━━━◉⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅│    from polygonCache)         │
│  │ ⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅│                              │
│  └─────────────────────────────────────┘                              │
│  Drag endpoints to reshape · Delete key removes selected segment ·     │
│  Double-click an edge to insert (coming soon)                          │
└────────────────────────────────────────────────────────────────────────┘
```

#### Shape › Fourier sub-tab — DFT radial profile

```
┌── Fourier radial profile ──────────────────────────────────────────────┐
│  [ Generate Fourier Profile from Image ]   ray-cast 360° → DFT          │
│      ◌ generating…                                                      │
│                                                                         │
│  ┌── Controls (left) ─────────────────────┐  ┌── Polar preview ──────┐  │
│  │ Harmonic Order                     8   │  │      .─────.          │  │
│  │ ◌────●────────────────              │  │     ╱ ◢◤◢◤  ╲         │  │
│  │ Higher = more detail                   │  │    │◢◤  ◢◤◢◤│        │  │
│  │                                        │  │    │  ◢◤◢◤  │        │  │
│  │ Base radius (a₀)               25.0 mm │  │    │◢◤  ◢◤  │        │  │
│  │ ◌──────────●────────                │  │     ╲ ◢◤◢◤  ╱         │  │
│  │                                        │  │      `─────'          │  │
│  │ ┌── Per-harmonic amp bars ──────────┐  │  │       160×160         │  │
│  │ │ n=1  amp=2.4mm   a=2.4 b=0.0      │  │  └───────────────────────┘  │
│  │ │   cos ◌──●──   sin ●──────         │  │  Polar preview              │
│  │ │ n=2  amp=1.7mm   a=0.0 b=1.7      │  │                              │
│  │ │   cos ●───── sin ◌──●──           │  │                              │
│  │ │ n=3  amp=0.9mm   a=−0.9 b=0.0     │  │                              │
│  │ │   cos ◌●────  sin ●──────          │  │                              │
│  │ │  ⋮  (scroll for n=4…32)            │  │                              │
│  │ └────────────────────────────────────┘  │                              │
│  └────────────────────────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Shape › Side Profile sub-tab — Catmull-Rom spline (radius-vs-height)

```
┌── Side profile spline (lathe) ─────────────────────────────────────────┐
│  ┌── 200×260 canvas ────────────┐   [ Trace Side Profile ]              │
│  │ 60 ┤●◉━━━━━━━━━━━━━━━━━━━━━━ │   [ + Add Knot ]                      │
│  │    │   ╲   reference faded   │                                       │
│  │ 50 ┤    ◉━━╲                  │   ┌── Knot list ────────────────┐   │
│  │    │       ╲                  │   │  h 0   r 20  [ ✕ ]           │   │
│  │ 40 ┤        ◉━━━╲             │   │  h 12  r 22  [ ✕ ]           │   │
│  │    │            ╲             │   │  h 24  r 25  [ ✕ ]           │   │
│  │ 30 ┤             ◉━━━━╲       │   │  h 36  r 20  [ ✕ ]           │   │
│  │    │                  ╲       │   │  h 48  r 14  [ ✕ ]           │   │
│  │ 20 ┤                   ●━━━━  │   │  h 60  r  8  [ ✕ ]           │   │
│  │    │ ← mirror (left)          │   └──────────────────────────────┘   │
│  │ 10 ┤        ↑                 │                                       │
│  │    │  drag knot here          │                                       │
│  │  0 ┴──────────────────────    │                                       │
│  │    0   10   20   30   40 mm   │                                       │
│  └───────────────────────────────┘                                       │
│  Drag knots · X = radius (mm) · Y = height (mm)                          │
│                                                                          │
│  ☑ Mimic top on bottom  — bottom face = same polygon as top              │
│  ☐ (unchecked)          — bottom = circle at lowest spline knot radius   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Shape › Bottom sub-tab

Identical Bezier canvas to the top, applied to the bottom contact surface. If no `bottomBezierPath` exists:

```
┌── Bottom Bezier path ──────────────────────────────────────────────────┐
│  No bottom Bezier path. Upload a bottom-view PNG to trace the           │
│  contact surface.                                                       │
│                                                                         │
│  [ Trace Bottom Contact Surface ]      ◌ tracing…                       │
└────────────────────────────────────────────────────────────────────────┘
```

### Images tab — 3-view upload

```
┌── Images ──────────────────────────────────────────────────────────────┐
│  Three no-background PNGs feed the Shape tab's extraction workflows.    │
│  Each upload shows preview, file size, dimensions, and a [✕] clear btn. │
│                                                                         │
│  ┌── Top view  (required for Bezier/Fourier) ────────────────────────┐  │
│  │  [ ⤓ choose top.png ]   ╭──────────╮   1024×1024 · 86 KB  [ ✕ ]   │  │
│  │                          │  preview  │                              │  │
│  │                          ╰──────────╯                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌── Side view (required for Spline lathe workflow) ─────────────────┐  │
│  │  [ ⤓ choose side.png ]  ╭──────────╮  640×1024 · 42 KB   [ ✕ ]    │  │
│  │                          │  preview  │                              │  │
│  │                          ╰──────────╯                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌── Bottom view (optional — contact surface) ───────────────────────┐  │
│  │  [ ⤓ choose bottom.png ]  ╭──────────╮  (none uploaded)            │  │
│  │                            ╰──────────╯                            │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Upload requirements: PNG, transparent background, ≤ 2 MB, square or    │
│  rectangular. Alpha threshold 32/255 used for foreground detection.     │
└────────────────────────────────────────────────────────────────────────┘
```

### Dimensions tab

```
┌── Dimensions (per part type) ──────────────────────────────────────────┐
│  Height (mm)        [ 8.0 ]                                             │
│  Outer Radius (mm)  [ 25  ]    AR · WD · Casing                         │
│  Inner Radius (mm)  [ 12  ]    Core · WD ring                           │
│  Tip Radius  (mm)   [ 4.5 ]    Tip                                      │
│  Shaft Length (mm)  [ 5.0 ]    Tip · SpinTrack                          │
│                                                                         │
│  Live dimension preview ──────────────────────────────────                │
│    ┌──── ⌀ 50 mm ────┐                                                  │
│    │  ┌──────────┐   │ ↑                                                │
│    │  │   ████   │   │ │ 8 mm height                                    │
│    │  └──────────┘   │ ↓                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

### Material tab

```
┌── Material ────────────────────────────────────────────────────────────┐
│  Material           [▼ Plastic / Metal / Rubber / Composite ]           │
│                                                                         │
│  ┌── Material bands (radial layers) ─────────────────────────────────┐  │
│  │ #1  r=0–12mm    ▣ 0a3b8c   density 1.2 g/cm³   bounce 0.4  [ ✕ ] │  │
│  │ #2  r=12–25mm   ▣ ffaa00   density 6.5 g/cm³   bounce 0.1  [ ✕ ] │  │
│  │ [ + add band ]                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Mass and inertia are computed from band volumes — visible on the       │
│  Preview tab's Stats line and on BeybladeSystem's ComputedStatsPanel.   │
└────────────────────────────────────────────────────────────────────────┘
```

### Contact Points tab

Each contact point may now be defined as **legacy** (`angle / width / radius / thickness` — symmetric warp around the center) or **arc-segment** (`arcStart / arcEnd / radiusInner / radiusOuter / lineThickness` — protrusion only along the arc line). The two shapes can coexist on the same part; overlapping new-shape CPs blend via **max thickness** so a thick bumper plus a thin spike resolves to the bumper's height. Multiple **sets** (grouped by `setId`) can overlap with different stroke colors in the editor.

```
┌── Contact Points ──────────────────────────────────────────────────────┐
│  Mode    ◉ Arc-segment   ◯ Legacy zone   ◯ Auto (use legacy if absent) │
│  Sets   ╭═ default ═╮ ╭ outer-spikes ╮ ╭ + new set ╮                   │
│         Overlaps inside a set blend by MAX; sets render independently. │
│                                                                         │
│  ┌── Part preview (click on the arc to add) ───┐ ┌── Point list ─────┐ │
│  │              ╱── arc segment ──╲             │ │ #1 set=default    │ │
│  │           ╱╱       (r1..r2)     ╲╲          │ │   arc 350°→ 10°   │ │
│  │        (◤)─────────────────────(◢)          │ │   r1 22  r2 25mm  │ │
│  │           ╲╲                    ╱╱          │ │   line ▮▮ 3.0mm  │ │
│  │              ╲────────────────╱             │ │   [edit]          │ │
│  │   ↺ spin           r1     r2                │ │ #2 set=outer…     │ │
│  │              ◉ point CP (arcStart=arcEnd)   │ │   arc 80° → 100°  │ │
│  └─────────────────────────────────────────────┘ │   line 1.2mm      │ │
│  Click an arc edge to drag arcStart/arcEnd;      │ [ + Add point ]   │ │
│  drag a radial handle to move r_inner/r_outer.   └───────────────────┘ │
│                                                                         │
│  ┌── Selected point inspector (#1 — arc-segment) ─────────────────────┐│
│  │  Set id           [ default            ▼ ]                          ││
│  │  Arc start °      [ 350  ]    Arc end ° [  10  ] ←wraps past 360°   ││
│  │  Radius inner mm  [ 22.0 ]    Radius outer mm [ 25.0 ]              ││
│  │  Line thickness mm  ◌──●──── 3.0   peak at midpoint, linear falloff ││
│  │  Part layer       [▼ ar / wd / casing / core / tip / bit_beast / …] ││
│  │  Material         [▼ abs / rubber / metal / pom / pc / nylon ]      ││
│  │  Attack type      [▼ smash / upper / absorb / burst / spin_steal ]  ││
│  │  Damage multiplier   ◌────●──── 1.4   (range 0.8–2.5)               ││
│  │  Spin behaviour      rightPin [▼ smash ]   leftPin [▼ spin_steal ]  ││
│  │  Height range        min [ 2 mm ]   max [ 6 mm ]   (absolute floor) ││
│  │                                                                     ││
│  │  ☑ Extends at high spin                                             ││
│  │     extendThreshold ◌─────●─ 0.80   (fraction of maxSpin)           ││
│  │     extendedRadius     [ 28 ]   extendedWidth  [ 18° ]              ││
│  │     extendedThickness  [ 2.4 ]                                      ││
│  │                                                                     ││
│  │  Roller (optional)   ☐ none   ◯ rubber   ◉ metal                    ││
│  │     roller.radius    [ 1.4 mm ]      roller.freeSpin ☑              ││
│  │     (freeSpin overrides material for rubber-style multipliers)      ││
│  └─────────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────┘
```

#### Legacy inspector (shown when no arc fields are set)

```
┌── Selected point inspector (legacy zone) ──────────────────────────────┐
│  Angle °     [   0  ]    Width °      [ 20  ]                           │
│  Radius mm   [  24  ]    Thickness mm [ 1.6 ]                           │
│  Part layer / material / attackType / spinBehavior / damage / extends / │
│  roller — identical to the arc-segment inspector below.                 │
│                                                                         │
│  ▸ [ Convert to arc-segment ] — fills arcStart/arcEnd/radiusInner/      │
│    radiusOuter/lineThickness from these legacy fields via               │
│    resolveCpBounds() (non-destructive — legacy fields remain).          │
└────────────────────────────────────────────────────────────────────────┘
```

**Geometry note** — `resolveCpBounds(cp)` in `client/src/types/beybladeSystem.ts` normalises both shapes; `renderRadius()` applies new-shape CPs as max-blended line protrusion within each `setId`, and legacy CPs as additive zone-warp. Setting any of `arcStart / arcEnd / lineThickness` flips the renderer into new-shape mode for that point — the legacy fields stay on the document untouched.

### Configurations tab — alternate stat / asset variants

```
┌── Configurations ──────────────────────────────────────────────────────┐
│  Each variant overrides specific fields of the base part — used for     │
│  re-paints, weight-stacked variants, anime-vs-classic asset bundles.    │
│                                                                         │
│  ╭═ default (active) ═╮  ╭ heavy ╮  ╭ rubber-tip ╮  ╭ + new ╮           │
│                                                                         │
│  Variant "heavy" overrides:                                             │
│    mass        12 → 18 g                                                │
│    density(#1) 1.2 → 1.8                                                │
│    color       ▣ 0a3b8c → ▣ 1a1a1a                                      │
│    images.top  (override)                                               │
│  [ ✕ delete variant ]                                                   │
└────────────────────────────────────────────────────────────────────────┘
```

### Pockets tab — sub-part attachment sockets

```
┌── Pockets ─────────────────────────────────────────────────────────────┐
│  Sockets where sub-parts attach. Each pocket has a slot name and a list │
│  of `accepts` tags — only sub-parts whose compatibilityTags overlap may │
│  be plugged in.                                                         │
│                                                                         │
│  ┌─ pocket #1  slot=blade   accepts «blade-mod»                  [✕] ┐  │
│  │  position (θ,r) [ 0°, 23 mm ]    max sub-parts [ 1 ]             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│  ┌─ pocket #2  slot=bottom  accepts «tip-mod»                    [✕] ┐  │
│  │  position (θ,r) [ 0°,  0 mm ]    max sub-parts [ 1 ]             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│  [ + Add Pocket ]                                                       │
└────────────────────────────────────────────────────────────────────────┘
```

### Type Fields tab — per-type specifics

```
┌── Type Fields ─────────────────────────────────────────────────────────┐
│  AR        bladeCount [ 4 ]  attackBoost [ 30 ]  spinStealBoost [ 12 ]  │
│  WD        weight     [ 18 ] gripFactor  [ 0.8 ]                        │
│  Tip       tipShape   [▼ flat / sharp / sphere / needle ]               │
│            contactArea [ 3.2 mm² ]                                      │
│  Core      density    [ 6.0 g/cm³ ]   innerRadius [ 6 mm ]              │
│  Casing    shellThickness [ 1.4 mm ]  rigidity [ 0.9 ]                  │
│  BitBeast  faceArtId [▼ chooser… ]    rarity [▼ common / rare / sr ]    │
│  SpinTrack heightLevel [ 2 ]  notes [ free-text ]                       │
│  SubPart   parentPart [▼ ar / wd / bit_beast / tip / core / casing ]    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 37. CompatibilityTagsPage — `/admin/2d/tags`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Compatibility Tags                                                        │
│  Legend  ● compatibilityTags  ● requiredCompatibility  ● excludedCompat.   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Search…                                              [ Refresh ]  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ «storm-series»     used by 14 parts        [BB] [AR] [Core]   [▾]   │  │
│  │                    ● ●                                              │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ «metal-system»     used by 28 parts        [WD] [Tip] [Core]  [▾]   │  │
│  │                    ●                                                │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ «attack»           used by 56 parts        [AR] [Tip]         [▾]   │  │
│  │                    ●                                                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Expanded row (rename + usage table)

```
  ┌──────────────────────────────────────────────────────────────────────┐
  │ «storm-series»  used by 14         [BB] [AR] [Core]   [Rename] [▴]  │
  │ ┌── Rename ──────────────────────────────────────────────────────┐  │
  │ │  New name [ storm-series-v2 ]   [ Cancel ] [ Save ]            │  │
  │ └────────────────────────────────────────────────────────────────┘  │
  │ ┌── Used by ────────────────────────────────────────────────────┐   │
  │ │ Dragoon Storm AR        Attack Ring     ● compatibilityTags   │   │
  │ │ Storm Core              Core            ● compatibilityTags   │   │
  │ │ Storm Bit Beast         Bit Beast       ● requiredComp.       │   │
  │ │ ⋮                                                              │   │
  │ └────────────────────────────────────────────────────────────────┘   │
  └──────────────────────────────────────────────────────────────────────┘
```

---

## 38. BeybladeSystemListPage — `/admin/2d/beyblade-systems`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Beyblade Systems (2.5D)                       [ + New System ]            │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ↻ Dragoon Storm System    Right spin   «linked to Dragoon stats»     │  │
│  │                                                       [Edit] [✕]    │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ↺ Wolf Borg System        Left spin                                  │  │
│  │                                                       [Edit] [✕]    │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ↻ Driger Flash System     Right spin   «linked to Driger stats»      │  │
│  │                                                       [Edit] [✕]    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 39. BeybladeSystemCreatePage — `/admin/2d/beyblade-systems/new`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Beyblade Systems › New                                                    │
│  Display Name    ┌─────────────────────────────────────────────────────┐   │
│                  │ Dragoon Storm System                                │   │
│  Spin Direction   ╭══════════╮  ╭──────────╮                               │
│                   │ ↻ Right  │  │ ↺ Left   │                               │
│                   ╰══════════╯  ╰──────────╯                               │
│                                                                            │
│  Spin direction affects which beyblades cause same-spin / opposite-spin    │
│  collisions and spin-steal interactions.                                   │
│                                                                            │
│              [ Cancel ]   [   Create & Assemble Parts →   ]                │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 40. BeybladeSystemEditPage — `/admin/2d/beyblade-systems/:id`

Two-column layout: slot tab editor (left, ~45%) + always-on multi-view preview (right, ~55%). The preview pane has its own internal tabs (`All Panels / Exploded / Side / Top / Iso / Live / Stats`) and updates live as parts are picked.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ← Beyblade Systems › Edit · "Dragoon Storm System"        [   Save   ]    │
│  ┌── Slot tabs ─────────────────────────────────────────────────────────┐  │
│  │ ╭═══════╮ ╭────────╮ ╭───╮ ╭────╮ ╭─────╮ ╭─────╮ ╭──────╮ ╭────────╮│  │
│  │ │Overv. │ │BitBeast│ │ AR│ │ WD │ │ Tip │ │Core │ │Casing│ │SpinTrk │ │  │
│  │ ╰═══════╯ ╰────────╯ ╰───╯ ╰────╯ ╰─────╯ ╰─────╯ ╰──────╯ ╰────────╯│  │
│  │ ╭─────────╮                                                          │  │
│  │ │Sub-Parts│                                                          │  │
│  │ ╰─────────╯                                                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌── LEFT: Slot tab (Attack Ring shown) ───┐ ┌── RIGHT: Live Preview ───┐ │
│  │ Pick the Attack Ring for this system.   │ │ ╭ All Panels ╮ ╭Explod.╮ │ │
│  │ ┌── PartPicker ─────────────────────┐   │ │ ╭ Side ╮ ╭ Top ╮ ╭ Iso ╮│ │
│  │ │ 🔍 dragoon                        │   │ │ ╭ Live (In-Game) ╮ ╭Stat╮│ │
│  │ │ ┌──────────────────────────────┐  │   │ │                         │ │
│  │ │ │ ◉ Dragoon Storm AR  ar_storm │  │   │ │  ── shown sub-pane ──   │ │
│  │ │ │   «storm-series» «attack»    │  │   │ │                         │ │
│  │ │ ├──────────────────────────────┤  │   │ │  see Preview tab matrix │ │
│  │ │ │ ○ Dragoon Quake AR  ar_quake │  │   │ │  below                  │ │
│  │ │ │ ○ Dragoon Spiral AR ar_spiral│  │   │ │                         │ │
│  │ │ └──────────────────────────────┘  │   │ │                         │ │
│  │ └───────────────────────────────────┘   │ │                         │ │
│  │  Selected:  ar_storm  ✓                 │ │                         │ │
│  │  [ Clear slot ]   [ Edit this part → ]  │ │                         │ │
│  │                                         │ │                         │ │
│  │ ⚠ Compat: requires a part tagged        │ │                         │ │
│  │    «core-storm» — currently picked Core │ │                         │ │
│  │    does NOT satisfy this constraint.    │ │                         │ │
│  └─────────────────────────────────────────┘ └─────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

### Overview tab

```
┌── Overview ─────────────────────────────────────────────────────────────┐
│  Display Name    [ Dragoon Storm System                              ]  │
│  Spin Direction   ╭═════════╮  ╭─────────╮                              │
│                   │ ↻ Right │  │ ↺ Left  │                              │
│                   ╰═════════╯  ╰─────────╯                              │
│                                                                         │
│  Linked beyblade stats (optional)   [▼ Dragoon ] [ unlink ]             │
│  When linked, the system inherits the chosen beyblade's stat            │
│  distribution; otherwise stats are computed from part data only.        │
│                                                                         │
│  Validity status:  ✓ Buildable — AR · WD · Tip · Core · Casing filled.  │
│                                                                         │
│  Compatibility audit                                                    │
│   ✓ AR «storm-series» matches Core «storm-series»                       │
│   ⚠ Tip is missing required tag «metal-system» (from Casing)            │
└─────────────────────────────────────────────────────────────────────────┘
```

### Slot tabs (BitBeast / AR / WD / Tip / Core / Casing / SpinTrack)

Each slot tab uses the same `PartPicker` layout as the AR example above. Some slots are optional:

| Slot      | Required | Notes |
|-----------|:--------:|-------|
| BitBeast  |    ✗     | Optional cosmetic + minor stat layer |
| AR        |    ✓     | Required for buildable system |
| WD        |    ✓     | Required |
| Tip       |    ✓     | Required |
| Core      |    ✓     | Required |
| Casing    |    ✓     | Required |
| SpinTrack |    ✗     | Optional vertical extension layer |

Unfilled required slots show `⚠ Empty` on the tab and disable the system's "buildable" state.

### Sub-Parts tab

```
┌── Sub-Parts (pocket attachments) ──────────────────────────────────────┐
│  Pockets exposed by the currently-picked main parts:                    │
│                                                                         │
│  AR  pocket «blade-mod»                                                 │
│      [▼ pick sub-part…  – or –  Storm Blade Spike (sp_blade_spike) ▾ ]  │
│      Selected: sp_blade_spike     [ ✕ remove ]                          │
│                                                                         │
│  Tip pocket «tip-mod»                                                   │
│      [▼ pick sub-part…  – or –  Rubber Grip Sleeve (sp_grip_rubber) ▾ ] │
│      Selected: sp_grip_rubber     [ ✕ remove ]                          │
│                                                                         │
│  [ + Add attachment ]                                                   │
│                                                                         │
│  Note: a pocket only lists sub-parts whose compatibilityTags include    │
│  at least one of the pocket's `accepts` tags.                           │
└────────────────────────────────────────────────────────────────────────┘
```

### Preview pane — 7 sub-tabs (right column, always visible)

#### All Panels (default — 4-up grid)

```
┌── All Panels ──────────────────────────────────────────────────────────┐
│ ┌── ExplodedView (anchor) ─┐ ┌── Side Profile ─┐ ┌── Top-Down ───────┐ │
│ │   ╭───────────╮          │ │     ┌────┐      │ │       ◉───◎───◉   │ │
│ │   │  ✦ BitBst │          │ │     │████│      │ │       │       │   │ │
│ │   ╰───────────╯          │ │     │████│      │ │       ◎       ◎   │ │
│ │   ╭═════════════════╮    │ │     │████│      │ │       │       │   │ │
│ │   │   ▣ AR (blades) │ ★  │ │     │████│      │ │       ◉───◎───◉   │ │
│ │   ╰═════════════════╯    │ │     │████│      │ │     + drag-to-pan │ │
│ │   ╭──────────────╮       │ │     ▔▔▔▔▔▔      │ │     ↺ spin arrow  │ │
│ │   │   ⚖ WD       │       │ │   side spline   │ └───────────────────┘ │
│ │   ╰──────────────╯       │ └─────────────────┘                       │
│ │   ╭─────────────╮        │ ┌── Isometric ────┐ ┌── Computed Stats ─┐ │
│ │   │  ↺ SpinTrk  │        │ │      ╱▲╲        │ │ weight  48 g      │ │
│ │   ╰─────────────╯        │ │     ╱██╲        │ │ attack  130       │ │
│ │   ╭═══════════════╮      │ │    ╱████╲       │ │ defense  70       │ │
│ │   │   ◉ Casing    │      │ │   ╱──────╲      │ │ stamina  90       │ │
│ │   ╰═══════════════╯      │ │ + orbit/zoom    │ │ radius  25 mm     │ │
│ │   ╭──────────╮           │ └─────────────────┘ │ inertia 0.0042    │ │
│ │   │  ◎ Core  │           │                     │ height   46 mm    │ │
│ │   ╰──────────╯           │                     └───────────────────┘ │
│ │   ╭──────╮               │                                           │
│ │   │ ▼Tip │   ★ = sub-pt  │                                           │
│ │   ╰──────╯               │                                           │
│ └──────────────────────────┘                                           │
└────────────────────────────────────────────────────────────────────────┘
```

#### Exploded · Side · Top-Down · Isometric

Each tab is a full-pane version of the matching panel in the All-Panels grid:

| Sub-tab     | Content |
|-------------|---------|
| `Exploded`  | Full-width vertical stack ✦ BitBeast → ▣ AR → ⚖ WD → ↺ SpinTrack → ◉ Casing → ◎ Core → ▼ Tip. Sub-parts float beside parent layer with dotted leader line. Each label = `displayName · id · ▣ color`. |
| `Side`      | 320×380 side profile composed from each slot's `sideProfileSpline` (or `sideView` image fallback). Shows real stacking height in mm. |
| `Top-Down`  | Plan silhouette from AR `bezierPath` (or `fourierProfile` fallback). ☑ `Show movement path` overlays faint orbital trace. |
| `Isometric` | 3/4 render — drag to orbit, scroll to zoom, double-click to reset. Surfaces clipping between AR blades and Casing. |

#### Live (In-Game)

```
┌── Live (In-Game) — 480×480 ────────────────────────────────────────────┐
│  Drives the real PixiJS in-game renderer via PreviewAdapter, in an      │
│  empty test arena, with this system spinning at full angularVelocity.   │
│  Re-renders ~30fps (rotation = tick * 0.3). Camera fixed centred.       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │                            ╱──────╲                               │  │
│  │                           │  ████  │   ← live PixiJS              │  │
│  │                            ╲──────╱                               │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  Pixel-identical to gameplay — surfaces clipping / scale bugs early.    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Stats

```
┌── Stats ───────────────────────────────────────────────────────────────┐
│  ComputedStatsPanel — derived live from picked parts, no save needed.   │
│   ───────────────────────────────────────────                           │
│    weight        48 g       (sum of part masses)                        │
│    attack       130         (AR + sub-part boosts)                      │
│    defense       70         (Casing rigidity + WD weight)               │
│    stamina       90         (1 − (mass × Tip friction))                 │
│    radius        25 mm      (max outer radius across slots)             │
│    height        46 mm      (sum of slot heights)                       │
│    inertia    0.0042        (Σ m·r² over material bands)                │
│   ───────────────────────────────────────────                           │
│  Total points  338 / 360    (target Distribution)                       │
│  ✓ Under cap by 22 — can absorb a heavier WD                            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 41. ArenaSystemListPage — `/admin/arena-systems`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Arena Systems (2.5D)                          [ + Create Arena System ]   │
│  ┌────────────────────────┐ ┌────────────────────────┐ ┌─────────────────┐ │
│  │ Mountain Bowl          │ │ Cyber Pit              │ │ Sandstone Bowl  │ │
│  │ «tilted» «hard»        │ │ «flat»   «easy»        │ │ «tilted» «med»  │ │
│  │ Steep slopes, narrow…  │ │ Symmetric, no obstac…  │ │ Wide arena …    │ │
│  │ ┌──────────────────┐   │ │ ┌──────────────────┐   │ │ ┌──────────────┐│ │
│  │ │ Shape    circle  │   │ │ │ Shape   rect     │   │ │ │ Shape circle ││ │
│  │ │ Theme    mount.  │   │ │ │ Theme   futur.   │   │ │ │ Theme desert ││ │
│  │ │ Wall ht  120     │   │ │ │ Wall ht  60      │   │ │ │ Wall ht 80   ││ │
│  │ │ Gravity  100%    │   │ │ │ Gravity  100%    │   │ │ │ Gravity 95%  ││ │
│  │ └──────────────────┘   │ │ └──────────────────┘   │ │ └──────────────┘│ │
│  └────────────────────────┘ └────────────────────────┘ └─────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 42. ArenaSystemCreatePage / ArenaSystemEditPage — `/admin/arena-systems/new` · `/.../:id`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Arena Systems                                                            │
│  Create Arena System                                                       │
│  ┌── Tabs ─────────────────────────────────────────────────────────────┐   │
│  │ ╭══════════╮ ╭──────────────╮ ╭──────────────╮ ╭─────────────╮      │   │
│  │ │ Overview │ │Elevation Map │ │Wall Profile  │ │Slope Physics│      │   │
│  │ ╰══════════╯ ╰──────────────╯ ╰──────────────╯ ╰─────────────╯      │   │
│  │ ╭──────────╮ ╭─────────╮                                            │   │
│  │ │Features  │ │ Preview │                                            │   │
│  │ ╰──────────╯ ╰─────────╯                                            │   │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌── Overview ─────────────────────────────┐ ┌── Live preview ──────────┐  │
│  │ Display Name [ Mountain Bowl          ] │ │  ┌─────┐ ┌─────┐         │  │
│  │ Description  ┌────────────────────────┐ │ │  │ Top │ │Side │         │  │
│  │              │ Tilted mountain arena. │ │ │  └─────┘ └─────┘         │  │
│  │              └────────────────────────┘ │ │  ┌─────┐ ┌────────┐      │  │
│  │ Shape       [▼ circle / rectangle ]     │ │  │ Iso │ │Orbital │      │  │
│  │ Width   [ 1080 ]   Height [ 1080 ]      │ │  └─────┘ └────────┘      │  │
│  │ Theme       [▼ mountains              ] │ │  ┌── Stats ──────────┐   │  │
│  │ Difficulty  [▼ easy / medium / hard ]   │ │  │ area  3.66 m²     │   │  │
│  │                                         │ │  │ wall  120 mm      │   │  │
│  └─────────────────────────────────────────┘ │  │ grav  100%        │   │  │
│                                              │  └──────────────────┘    │  │
│                                              └──────────────────────────┘  │
│                                  [ Cancel ]      [   Save   ]              │
└────────────────────────────────────────────────────────────────────────────┘
```

**Per-tab content**

```
─── Elevation Map ─────────────────────────────────────────────────────
  Type        [▼ flat / tilted ]
  Tilt angle      ◌────────●──────  12°        (range 0–25°)
  Tilt direction  ◌─────●─────────  120°       (compass heading)

─── Wall Profile ──────────────────────────────────────────────────────
  Base height (mm)   ◌──●──────────  120

─── Slope Physics ─────────────────────────────────────────────────────
  Gravity strength   ◌────●────────  1.00      (0–2.0)

─── Features ──────────────────────────────────────────────────────────
  (Placeholder — obstacle / portal / pit toggles, populated in future.)
```

---

# IV. 2.5D SHAPE EXTRACTION FLOW

End-to-end pipeline for converting uploaded PNGs into a server-renderable
`PartShape`. Every step is **client-side** (browser canvas, no Firebase
round-trips) and writes into the part document only when the user clicks
**Save** on the PartEditPage.

## High-level pipeline

```
   ┌──────────────────────────────────────────────────────────────────┐
   │                  USER UPLOADS 1–3 PNG IMAGES                      │
   │           topView · sideView · bottomView (any subset)            │
   └──────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  WORKFLOW TIER AUTO-DETECTION  (workflowTier() in PartShapeEditor)│
   │ ─────────────────────────────────────────────────────────────────│
   │   top + side + bottom  → Full Geometry        🟢                  │
   │   top + side           → Revolution Profile   🔵                  │
   │   top only             → Uniform Extrusion    🟡                  │
   │   side only            → Profile Only         🟠                  │
   │   none                 → Preset (no extraction)   ▫               │
   └──────────────────────────────────────────────────────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            ▼                     ▼                     ▼
   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
   │ Top-view path   │  │ Side-view path  │  │ Bottom-view path    │
   │ (plan shape)    │  │ (lathe profile) │  │ (contact polygon)   │
   └─────────────────┘  └─────────────────┘  └─────────────────────┘
            │                    │                      │
            ▼                    ▼                      ▼
   ┌────────────────────┐ ┌─────────────────┐  ┌──────────────────┐
   │ Silhouette Tracer  │ │ Side-Image Trace│  │ Silhouette Tracer│
   │  · alpha mask      │ │ · row-scan max  │  │  (same pipeline) │
   │  · marching squares│ │   x at α≥32     │  │                  │
   │  · RDP simplify    │ │ · → SplineKnot[]│  │                  │
   │  · → BezierPath    │ │                 │  │                  │
   └────────────────────┘ └─────────────────┘  └──────────────────┘
            │                    │                      │
            ▼                    ▼                      ▼
   ┌────────────────────┐ ┌─────────────────┐  ┌──────────────────┐
   │  Bezier Editor     │ │  Spline Editor  │  │  Bezier Editor   │
   │  (manual refine,   │ │  (drag knots,   │  │  (manual refine) │
   │   tolerance, sync) │ │   add / remove) │  │                  │
   └────────────────────┘ └─────────────────┘  └──────────────────┘
            │                    │                      │
            ▼                    ▼                      ▼
   ┌────────────────────┐ ┌─────────────────┐  ┌──────────────────┐
   │ shape.bezierPath   │ │ shape.sideProfi-│  │ shape.bottomBezi-│
   │ + polygonCache     │ │ leSpline + curve│  │ erPath           │
   │                    │ │ Cache           │  │                  │
   └────────────────────┘ └─────────────────┘  └──────────────────┘
            │
            ▼ ── optional ───────────────┐
   ┌────────────────────┐                │
   │  Fourier Editor    │ ◄── "Sync Fourier" from Bezier
   │  · ray-cast 360°   │ ◄── or "Generate from Image"
   │  · DFT N harmonics │
   │  · → FourierProfile│
   └────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  SAVE → Firestore  beyblade_parts/{id}                            │
   │   shape: {                                                        │
   │     type:                "preset" | "custom",                     │
   │     preset?:             "circle" | "star4" | …,                  │
   │     bezierPath:          { segments, polygonCache, tolerance },   │
   │     fourierProfile?:     { a0, harmonics[], radialCache },        │
   │     sideProfileSpline?:  { knots[], curveCache },                 │
   │     bottomBezierPath?:   BezierPath,                              │
   │     bottomMimic:         boolean   // default true                │
   │   }                                                               │
   └──────────────────────────────────────────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  CONSUMED BY                                                      │
   │   • client/PixiRenderer       (in-game render)                    │
   │   • client/BeybladeSystemPreview (admin live preview)             │
   │   • server/PartPhysics        (Matter.js collision geometry)      │
   └──────────────────────────────────────────────────────────────────┘
```

## Per-stage detail

### Stage 1 — Silhouette Tracer (`SilhouetteTracer.tsx`)

```
   PNG (data URL / Firebase Storage URL)
       │
       ▼
   imageToMask(maxDim 256, α threshold 32)
       │   ┌────────────────────────────────────┐
       │   │ Decode → 256×256 RGBA pixel buffer │
       │   │ alpha[i] ≥ 32 → mask[i] = 1        │
       │   └────────────────────────────────────┘
       ▼
   marchingSquares()      ──► raw contour (Moore neighbourhood trace)
       │
       ▼
   rdp(tolerance 2.0)     ──► simplified polygon
       │
       ▼
   polygonToBezierPath()  ──► BezierPath {segments: L[…], polygonCache, tolerance}
                              all segments emitted as straight "L" — the
                              BezierEditor can later upgrade to "C" curves.

   Tuning knobs (exposed in PartEditPage → Shape › "Trace settings" panel):
     RDP tolerance   0.5–12 px       (default 2.0, higher = fewer points)
     Alpha threshold 1–200           (default 32, lower = more inclusive)
     Trace resolution 64/128/256/512 (default 256 — accuracy/speed trade)
     Side knots      3–30            (default 10, used by Side trace only)
```

### Stage 2 — Bezier Editor (`BezierEditor.tsx`)

```
   ┌── 260×260 canvas ───────────────────────────────────────┐
   │  Reference PNG drawn at 25% alpha (if imageUrl prop)    │
   │  Grid every 10 mm                                       │
   │  Closed path filled at blue@13%, stroked at blue        │
   │  Endpoints  = muted dots (5 px)                         │
   │  Selected   = blue dot + yellow control-point handles   │
   │  Drag → modify segment (live updates polygonCache)      │
   │  Delete   → remove selected segment                     │
   │  Tolerance slider 0.1–5 → rebuilds polygonCache         │
   │  [ ↻ Sync Fourier ]  → calls onSyncFourier(polygonCache)│
   └─────────────────────────────────────────────────────────┘

   buildPolygonCache(): walks segments, flattens any "C" curves into
   N points using evalBezierAt() at steps = max(4, ceil(50/tolerance)).
```

### Stage 3 — Fourier Editor (`FourierEditor.tsx`)

```
   Two entry points:
     (a) [ Generate Fourier Profile from Image ]
          raycastProfile(samples=360) ─► 360 radii (one per degree)
          computeFourierProfile(numHarmonics, mmPerPx)
              a₀  = mean(radii) × mmPerPx
              for n = 1…numHarmonics:
                  aₙ = (2/N) Σ r·cos(2π·n·k/N)  × mmPerPx
                  bₙ = (2/N) Σ r·sin(2π·n·k/N)  × mmPerPx
              radialCache = synthesizeRadialCache(profile)     ← 360 samples

     (b) [ Sync Fourier ] button on Bezier tab
          Uses existing polygonCache instead of ray-casting an image,
          then runs the same DFT on the polygon's per-vertex radii.

   UI:
     Harmonic Order slider  1–32  (default 8)
     Base Radius (a₀)       0–50 mm
     Per-harmonic bars      n=1…N  with cos (a) + sin (b) sliders
     Polar preview          160×160 canvas, redraws on every change

   Re-computing harmonics: if raw raycast radii are cached, re-run DFT;
   otherwise truncate/extend existing harmonics[] and re-synthesize cache.
```

### Stage 4 — Spline Profile Editor (`SplineProfileEditor.tsx`)

```
   Trace pipeline (when sideView image is uploaded):
     traceSideProfile(numKnots)
        ▸ for each of N evenly-spaced rows, scan x = 0..w-1,
          record max(|x − w/2|) where α ≥ 32
        ▸ normalise → {height ∈ 0..1, radius ∈ 0..1}
        ▸ scale to mm using maxHeight / maxRadius (from PartShapeEditor scale row)

   Manual editing (always):
     Catmull-Rom 4-knot tension spline through every pair of knots
     Drag a knot in the 200×260 canvas (X = radius, Y = height)
        → updateKnot, then re-sample curveCache (50 pts)
     [ + Add Knot ]   appends at canvas centre
     [ ✕ ]            removes the knot
     Mirror (left half) drawn at 25% alpha — visual reminder it's a lathe

   ☑ Mimic top on bottom (PartShapeEditor master toggle)
        bottom face = same polygon as top  (default for AR / WD)
   ☐  bottom face = circle at lowest spline-knot radius  (default for Casing / Core)
```

### Stage 5 — Server consumption (`src/physics/PartPhysics.ts`)

```
   On room onCreate(), the server loads PartShape into Matter.js bodies:
       preset    → fast-path circle/polygon body
       custom    → Matter.Bodies.fromVertices(polygonCache)
       lathe     → revolve sideProfileSpline.curveCache (sampled at θ)
                   into a stacked compound body
       full      → use bottomBezierPath as the contact polygon
                   (overrides the implicit footprint)

   Cached per-part — never reloaded inside tick(deltaTime).
```

---

# V. PER-SCREEN USER ACTION FLOW CHART

A flow chart of every screen in the app, with the entry-points
(navigation in), the user actions available on the page, and the
possible exits (navigation out + side-effects). Arrows are read as
`<action> → <result>`.

## A. Player flow

```
┌──── HomePage  /  ─────────────────────────────────────────────────────┐
│  In:   site root                                                       │
│  Do:   • Sign in (Google)        → AuthContext sets user → /game       │
│        • Continue as guest       → /game                               │
│        • Click "Leaderboard"     → /leaderboard                        │
│        • Click "Renderer Demo"   → /renderer-demo                      │
└────────────────────────────────────────────────────────────────────────┘

┌──── LoginPage  /login  ───────────────────────────────────────────────┐
│  In:   redirected when unauthenticated user hits gated route           │
│  Do:   • Google sign-in           → /game (or original destination)    │
│        • Switch to Sign-up        → email+password form                │
│        • Forgot password          → reset email                        │
└────────────────────────────────────────────────────────────────────────┘

┌──── GameSelectPage  /game  ───────────────────────────────────────────┐
│  In:   Home, post-login                                                │
│  Do:   • Tryout         → /game/tryout                                 │
│        • Battle (PVP)   → /game/battle                                 │
│        • AI Battle      → /game/ai-battle                              │
│        • Tournament     → /game/tournament                             │
│        • Leaderboard    → /leaderboard                                 │
└────────────────────────────────────────────────────────────────────────┘

┌──── LeaderboardPage  /leaderboard  ───────────────────────────────────┐
│  In:   Home / GameSelect                                               │
│  Do:   • Filter by all-time / month / week (re-queries player_stats)   │
│        • Click row    → opens user profile modal (read-only)           │
│        • Back to game → /game                                          │
└────────────────────────────────────────────────────────────────────────┘

┌──── TryoutGamePage  /game/tryout  ────────────────────────────────────┐
│  In:   GameSelect                                                      │
│  Do:   • Pick beyblade & arena from setup card                         │
│        • Start          → connects to tryout_room (BO1 forced)         │
│        • In match: move / attack / dodge / special (bitmask input)     │
│        • Camera + Controls overlays (always)                           │
│        • Spin-out      → end overlay → [Retry] / [Exit]                │
│  Out:  Exit → /game                                                    │
└────────────────────────────────────────────────────────────────────────┘

┌──── BattleLobbyPage  /game/battle  ───────────────────────────────────┐
│  In:   GameSelect, deep-link with ?match=<id>, ?spectate=true          │
│  Do:   • Pick beyblade                                                 │
│        • Choose BO1 / BO3 / BO5                                        │
│        • Set max players (2–4)                                         │
│        • Create room    → battle_room, navigate to /game/battle?m=…    │
│        • Join existing  → enters lobby chat                            │
│        • Copy spectate link  → shareable URL                           │
│  Out:  Match start    → BattleGamePage                                 │
└────────────────────────────────────────────────────────────────────────┘

┌──── BattleGamePage  /game/battle?match=<id>  ─────────────────────────┐
│  In:   BattleLobbyPage, spectate link                                  │
│  Do (player):   move / attack / dodge / special, ready-up between games │
│  Do (spectator):camera + chat, no input                                 │
│  Overlays:                                                              │
│    • Warmup countdown                                                   │
│    • Game-end (between games of a series)                               │
│    • Series-end (back to lobby / new match)                             │
│    • Connecting / error toast                                           │
│  Out:  Exit → /game · Series end → /game/battle (re-lobby)              │
└────────────────────────────────────────────────────────────────────────┘

┌──── AIBattleSetupPage  /game/ai-battle  ──────────────────────────────┐
│  In:   GameSelect                                                      │
│  Do:   • Pick player beyblade + arena                                  │
│        • Pick AI opponent + difficulty                                 │
│        • Choose BO1 / BO3 / BO5                                        │
│        • Start          → ai_battle_room, /game/ai-battle?match=…      │
└────────────────────────────────────────────────────────────────────────┘

┌──── AIBattleGamePage  /game/ai-battle?match=<id>  ────────────────────┐
│  In:   AIBattleSetupPage                                               │
│  Do:   • Identical input set to BattleGamePage                         │
│        • Series HUD (BO≥3), game-end & series-end overlays             │
│  Out:  Exit → /game · Series end → back to setup                       │
└────────────────────────────────────────────────────────────────────────┘

┌──── TournamentListPage  /game/tournament  ────────────────────────────┐
│  In:   GameSelect                                                      │
│  Do:   • Filter Upcoming / Active / Past                               │
│        • Click tournament      → /game/tournament/:id                  │
│        • Register (if open)    → adds tournament_participants doc      │
└────────────────────────────────────────────────────────────────────────┘

┌──── TournamentLobbyPage  /game/tournament/:id  ───────────────────────┐
│  In:   TournamentListPage                                              │
│  Do:   • View bracket (Firestore onSnapshot — no Colyseus yet)         │
│        • Pick beyblade for this tournament                             │
│        • Wait for scheduled match — when scheduler opens room,         │
│          auto-redirects to /game/tournament/battle/:tid/:mid           │
│        • Withdraw                                                      │
└────────────────────────────────────────────────────────────────────────┘

┌──── TournamentBattleGamePage  /game/tournament/battle/:tid/:mid  ─────┐
│  In:   TournamentLobbyPage (auto-redirect on scheduler-open)           │
│  Do:   • Same input set as BattleGamePage                              │
│        • Series HUD, warmup, game-end, series-end overlays             │
│  Out:  Series end → /game/tournament/:tid (back to lobby for next)     │
└────────────────────────────────────────────────────────────────────────┘

┌──── RendererDemoPage  /renderer-demo  ────────────────────────────────┐
│  In:   Home (developer link)                                           │
│  Do:   • Toggle PixiJS layers (arena / features / beys / particles)    │
│        • Stress-test particle count                                    │
└────────────────────────────────────────────────────────────────────────┘
```

## B. Admin — gameplay management

```
┌──── AdminDashboardPage  /admin  ──────────────────────────────────────┐
│  Do:  • Click any stat card (Users / Tournaments / Beyblades / …)      │
│         → routes to the matching admin list page                        │
└────────────────────────────────────────────────────────────────────────┘

┌──── UsersPage  /admin/users  ─────────────────────────────────────────┐
│  Do:  • Search, paginate                                               │
│       • Toggle role  user ⇄ admin   (updates users/{id})                │
│       • Open profile → match history                                    │
└────────────────────────────────────────────────────────────────────────┘

┌──── StatsPage  /admin/stats  ─────────────────────────────────────────┐
│  Do:  • Filter time range, room type, player                           │
│       • Export CSV                                                      │
└────────────────────────────────────────────────────────────────────────┘

┌──── SettingsPage  /admin/settings  ───────────────────────────────────┐
│  Do:  • Toggle feature flags (e.g. tournaments_enabled)                │
│       • Tune global physics constants                                   │
│       • Save   → settings/game doc                                      │
└────────────────────────────────────────────────────────────────────────┘

┌──── TournamentsListPage  /admin/tournaments  ─────────────────────────┐
│  Do:  • Create        → /admin/tournaments/create                      │
│       • Cancel        → marks status=canceled                          │
│       • Open detail   → /admin/tournaments/:id                         │
└────────────────────────────────────────────────────────────────────────┘

┌──── TournamentCreatePage  /admin/tournaments/create  ─────────────────┐
│  Do:  • Form: name / type / start time / size / BO / restrictions      │
│       • Create        → writes tournaments doc → /admin/tournaments    │
└────────────────────────────────────────────────────────────────────────┘

┌──── TournamentDetailPage  /admin/tournaments/:id  ────────────────────┐
│  Do:  • View bracket / participant list                                │
│       • Manually advance winner of a slot                              │
│       • Force-fill empty slot with AI                                  │
│       • Cancel tournament                                              │
└────────────────────────────────────────────────────────────────────────┘

┌──── BeybladesListPage  /admin/beyblades  ─────────────────────────────┐
│  Do:  • Create / Edit / Delete (with confirm modal)                    │
└────────────────────────────────────────────────────────────────────────┘

┌──── BeybladeCreatePage  /admin/beyblades/create  (4-step wizard) ─────┐
│  Step 0 Basic   → name, color, type                                    │
│  Step 1 Stats   → attack / defense / stamina (sum = 360, ≤150 each)    │
│  Step 2 Images  → upload top / side / bottom PNGs                      │
│  Step 3 Contact → place contact points on plan view                    │
│  → [Save]      → writes beyblade_stats/{id}                            │
└────────────────────────────────────────────────────────────────────────┘

┌──── BeybladeEditPage  /admin/beyblades/:id/edit  ─────────────────────┐
│  Do:  • Single-page form (all 4 wizard steps as tabs)                  │
│       • Delete (confirm)                                                │
└────────────────────────────────────────────────────────────────────────┘

┌──── ArenasListPage / ArenaCreatePage / ArenaEditPage ─────────────────┐
│  Do:  • CRUD arena configs (shape, theme, walls, obstacles, gravity)   │
└────────────────────────────────────────────────────────────────────────┘

┌──── ArenaTestPage  /admin/arenas/test  ───────────────────────────────┐
│  Do:  • Spawn N test beyblades into chosen arena                       │
│       • Tune parameters live, see physics behaviour                    │
└────────────────────────────────────────────────────────────────────────┘

┌──── StadiumsListPage / StadiumCreatePage / StadiumEditPage ───────────┐
│  Do:  • Manage stadium metadata + cover images                         │
└────────────────────────────────────────────────────────────────────────┘
```

## C. Admin — assets & 2.5D part system

```
┌──── AssetsLibraryPage  /admin/assets  ────────────────────────────────┐
│  Do:  • Open one of 6 asset CRUD pages (themes / obstacles / turrets / │
│         water-bodies / portals / sounds)                               │
└────────────────────────────────────────────────────────────────────────┘

┌──── Asset CRUD pages (shared template) ───────────────────────────────┐
│  Do:  • Upload (name + tag + file) → Firebase Storage + Firestore      │
│       • Filter by tag                                                   │
│       • Delete row                                                      │
└────────────────────────────────────────────────────────────────────────┘

┌──── PartSearchPage  /admin/2d/parts  ─────────────────────────────────┐
│  Do:  • Search across all parts                                        │
│       • Click category tile  → /admin/2d/parts/:type                   │
└────────────────────────────────────────────────────────────────────────┘

┌──── PartListPage  /admin/2d/parts/:type  ─────────────────────────────┐
│  Do:  • Filter by display name                                         │
│       • [+ New Part]  → /admin/2d/parts/:type/new                      │
│       • Edit row      → /admin/2d/parts/:type/:id                      │
│       • Delete (confirm)                                                │
└────────────────────────────────────────────────────────────────────────┘

┌──── PartCreatePage  /admin/2d/parts/:type/new  ───────────────────────┐
│  Do:  • Display name + color                                           │
│       • Create       → writes minimal doc → PartEditPage               │
└────────────────────────────────────────────────────────────────────────┘

┌──── PartEditPage  /admin/2d/parts/:type/:id  ─────────────────────────┐
│  Tabs: Overview · Preview · Shape · Images · Dimensions · Material ·   │
│        Contact Points · Configurations · Pockets · Type Fields         │
│  Do:                                                                    │
│   Overview      edit name, color, sub-component flag, tags             │
│   Preview       inspect top / side / iso / layers / stats              │
│   Shape         pick workflow tier; for each available tab:            │
│                   ─ Preset:  pick parametric shape, tune params        │
│                              or trace silhouette from top image        │
│                   ─ Bezier:  drag handles, delete segments, sync       │
│                              Fourier from polygonCache                 │
│                   ─ Fourier: generate from image OR Sync from Bezier;  │
│                              tune harmonic order, a₀, per-harmonic ab  │
│                   ─ Side:    drag knots, add knots, trace side image,  │
│                              toggle "mimic top on bottom"              │
│                   ─ Bottom:  Bezier editor for bottomBezierPath        │
│                              or trace from bottom image                │
│   Images        upload / clear top / side / bottom PNGs                │
│   Dimensions    edit height / outer / inner / tip / shaft (per type)   │
│   Material      pick material, edit radial bands (color, density,…)    │
│   Contact Pts.  click preview to add, drag to position, edit θ/steal   │
│   Configurations  add / rename / delete variants                       │
│   Pockets       add / remove sockets, set accepts tags                 │
│   Type Fields   per-type specifics (bladeCount, density, …)            │
│  Save          → updates beyblade_parts/{id} (single Firestore write)  │
└────────────────────────────────────────────────────────────────────────┘

┌──── CompatibilityTagsPage  /admin/2d/tags  ───────────────────────────┐
│  Do:  • Search tags                                                    │
│       • Expand row → see usage table + Rename form                     │
│       • Rename     → batch-updates every part referencing the tag      │
└────────────────────────────────────────────────────────────────────────┘

┌──── BeybladeSystemListPage  /admin/2d/beyblade-systems  ──────────────┐
│  Do:  • [+ New System]  → /admin/2d/beyblade-systems/new               │
│       • Edit / Delete                                                   │
└────────────────────────────────────────────────────────────────────────┘

┌──── BeybladeSystemCreatePage  /admin/2d/beyblade-systems/new  ────────┐
│  Do:  • Display name + spin direction                                  │
│       • [ Create & Assemble Parts → ]  → writes doc → EditPage         │
└────────────────────────────────────────────────────────────────────────┘

┌──── BeybladeSystemEditPage  /admin/2d/beyblade-systems/:id  ──────────┐
│  Left column (slot tabs):                                              │
│   Overview     edit name / spin / linked-beyblade / view compat audit  │
│   BitBeast     pick / clear part (optional)                            │
│   AR           pick part (required) — picker filters by compat tags    │
│   WD           pick part (required)                                    │
│   Tip          pick part (required)                                    │
│   Core         pick part (required)                                    │
│   Casing       pick part (required)                                    │
│   SpinTrack    pick / clear part (optional)                            │
│   Sub-Parts    fill / clear pockets exposed by picked main parts       │
│  Right column (always-on preview, 7 sub-tabs):                         │
│   All Panels   ExplodedView + Side + Top + Iso + Stats grid            │
│   Exploded     full-pane vertical stack with sub-part attachments      │
│   Side         lathe-composed side profile (320×380)                   │
│   Top-Down     plan silhouette (optional movement-path overlay)        │
│   Isometric    drag-to-orbit 3/4 view                                  │
│   Live         drives real PixiJS in-game renderer at 30 fps           │
│   Stats        ComputedStatsPanel — derived live                       │
│  Save        → updates beyblade_systems/{id}                           │
│  Side-effect: spawning this system in-game uses these picked parts     │
└────────────────────────────────────────────────────────────────────────┘

┌──── ArenaSystemListPage  /admin/arena-systems  ───────────────────────┐
│  Do:  • Create / Edit / Delete arena systems                           │
└────────────────────────────────────────────────────────────────────────┘

┌──── ArenaSystemCreatePage / ArenaSystemEditPage ──────────────────────┐
│  Tabs: Overview · Elevation Map · Wall Profile · Slope Physics ·       │
│        Features · Preview                                              │
│  Do:                                                                    │
│   Overview      name / desc / shape / dimensions / theme / difficulty  │
│   Elevation     pick flat / tilted, tune tilt angle + heading          │
│   Wall Profile  pick base wall height                                   │
│   Slope Physics tune gravity strength                                   │
│   Features      obstacle / portal / pit toggles (future)               │
│   Preview       Top + Side + Iso + Orbital views, computed stats       │
│  Save         → writes arena system doc                                │
└────────────────────────────────────────────────────────────────────────┘
```

## D. Cross-screen navigation map (player flow)

```
                 ┌─── /leaderboard ──┐
                 │                   │
                 ▼                   ▲
   /  ──► /login ──► /game ──┬──► /game/tryout
                              ├──► /game/battle ──► /game/battle?match
                              ├──► /game/ai-battle ──► …?match
                              └──► /game/tournament
                                       │
                                       ▼
                                  /game/tournament/:id
                                       │  (scheduler opens room)
                                       ▼
                                  /game/tournament/battle/:tid/:mid
                                       │  (series-end)
                                       ▼
                                  back to /game/tournament/:id
```

## E. Cross-screen navigation map (admin 2.5D flow)

```
   /admin
     │
     ├── /admin/2d/parts  ──► /admin/2d/parts/:type
     │                              │
     │                              ├── /admin/2d/parts/:type/new
     │                              └── /admin/2d/parts/:type/:id   (10 tabs)
     │                                     │
     │                                     └── Shape tab pipelines
     │                                         (Preset / Bezier /
     │                                          Fourier / Side / Bottom)
     │
     ├── /admin/2d/tags                  (rename → batch updates everywhere)
     │
     ├── /admin/2d/beyblade-systems  ──► /admin/2d/beyblade-systems/new
     │                              └──► /admin/2d/beyblade-systems/:id
     │                                     │
     │                                     └── Slot tabs ➜ PartPicker
     │                                          (each slot deep-links back
     │                                           to PartEditPage via
     │                                           "Edit this part →")
     │
     ├── /admin/arena-systems       ──► …/new · …/:id
     │
     └── /admin/assets              ──► 6 asset CRUD pages (shared template)
```

---

# VI. SERIES / SPECTATOR / OVERLAY MATRIX

A condensed cross-screen reference of state variants surfaced by gameplay screens:

| Screen | Player | Spectator | Warmup | Game-end | Series-end | Connecting | Error |
|--------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| TryoutGamePage      | ✓ | — | — | spin-out | — | — | — |
| BattleGamePage      | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AIBattleGamePage    | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| TournamentBattleGamePage | ✓ | ✓ | ✓ | ✓ | ✓ (back-to-lobby) | ✓ | ✓ |

**Series HUD** appears only when `bestOf >= 3` — shows `Game X/Y` and a per-player wins counter in the top bar.

**Spectator badge** (`«SPECTATOR»`) appears when `?spectate=true` query param is set; for non-tournament rooms requires the host's spectate link from the lobby.

---

# VII. ROUTE MAP

```
Player:
  /                                       HomePage
  /login                                  LoginPage
  /leaderboard                            LeaderboardPage
  /game                                   GameSelectPage
  /game/tryout                            TryoutGamePage
  /game/battle                            BattleLobbyPage   ?spectate=true → spectator view
  /game/battle?match=<id>                 BattleGamePage    (after start)
  /game/ai-battle                         AIBattleSetupPage
  /game/ai-battle?match=<id>              AIBattleGamePage
  /game/tournament                        TournamentListPage
  /game/tournament/:id                    TournamentLobbyPage
  /game/tournament/battle/:tid/:mid       TournamentBattleGamePage
  /renderer-demo                          RendererDemoPage

Admin:
  /admin                                  AdminDashboardPage
  /admin/users                            UsersPage
  /admin/stats                            StatsPage
  /admin/settings                         SettingsPage
  /admin/tournaments                      TournamentsListPage
  /admin/tournaments/create               TournamentCreatePage
  /admin/tournaments/:id                  TournamentDetailPage
  /admin/beyblades                        BeybladesListPage
  /admin/beyblades/create                 BeybladeCreatePage
  /admin/beyblades/:id/edit               BeybladeEditPage
  /admin/arenas                           ArenasListPage
  /admin/arenas/create                    ArenaCreatePage
  /admin/arenas/:id/edit                  ArenaEditPage
  /admin/arenas/test                      ArenaTestPage
  /admin/stadiums                         StadiumsListPage
  /admin/stadiums/create                  StadiumCreatePage
  /admin/stadiums/:id/edit                StadiumEditPage
  /admin/assets                           AssetsLibraryPage
  /admin/assets/arena-themes              ArenaThemeAssetsPage
  /admin/assets/obstacles                 ObstacleAssetsPage
  /admin/assets/turrets                   TurretAssetsPage
  /admin/assets/water-bodies              WaterBodyAssetsPage
  /admin/assets/portals                   PortalAssetsPage
  /admin/assets/sounds                    SoundAssetsPage
  /admin/2d/parts                         PartSearchPage
  /admin/2d/parts/:type                   PartListPage
  /admin/2d/parts/:type/new               PartCreatePage
  /admin/2d/parts/:type/:id               PartEditPage
  /admin/2d/tags                          CompatibilityTagsPage
  /admin/2d/beyblade-systems              BeybladeSystemListPage
  /admin/2d/beyblade-systems/new          BeybladeSystemCreatePage
  /admin/2d/beyblade-systems/:id          BeybladeSystemEditPage
  /admin/arena-systems                    ArenaSystemListPage
  /admin/arena-systems/new                ArenaSystemCreatePage
  /admin/arena-systems/:id                ArenaSystemEditPage
```

---

*End of mocks. Total: 13 player screens + 17 admin gameplay screens + 18 admin asset/2.5D screens + shared HUD + 2.5D shape-extraction pipeline + per-screen user-action flow chart + state matrices + route map.*

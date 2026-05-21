# Beyblade Game — Screen Mocks

ASCII wireframes for every player- and admin-facing screen, with state variations and config annotations. Render in monospace.

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
│  ╭──────╮ ╭───────────╮ ╭──────────╮ ╭──────────╮                          │
│  │ Wins │ │ Win Rate  │ │  Damage  │ │ Matches  │   ← tabs (Wins active)   │
│  ╰══════╯ ╰───────────╯ ╰──────────╯ ╰──────────╯                          │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ ▓ 🥇   ╭──╮  SpinKing             42 matches · 38W-4L         38 W ▓ │  │
│  │ ▓      ╰──╯                                              90.5%      │  │
│  │ ▓ 🥈   ╭──╮  WolfBorg             40 · 35-5                 35 W ▓ │  │
│  │ ▓ 🥉   ╭──╮  DragoonStorm         51 · 32-19                32 W ▓ │  │
│  │ ─────────────────────────────────────────────────────────────────── │  │
│  │   4    ╭──╮  Driger                25 · 18-7                 18 W   │  │
│  │   5    ╭──╮  Dranzer               30 · 17-13                17 W   │  │
│  │   ⋮                                                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

**States** — Loading: centered spinner. Empty: `No match data yet`. Tab switch resorts list and reformats the rightmost column (Wins → W, Win Rate → %, Damage → DMG, Matches → count).

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

## 8. AIBattleSetupPage — `/game/ai-battle`

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Back                                                                     │
│  🤖 AI Battle                                                              │
│  Pick a beyblade, an arena, and a difficulty — fight a CPU opponent.       │
│                                                                            │
│  ┌─── 🌀 Your Beyblade ──────────────────────────────────────────────────┐ │
│  │  ╭══════╮  ╭──────╮  ╭──────╮  ╭──────╮                                │ │
│  │  │ Drago│  │ Wolf │  │Driger│  │Dranzer│   ← selected = blue border    │ │
│  │  ╰══════╯  ╰──────╯  ╰──────╯  ╰──────╯                                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─── 🤖 AI's Beyblade ─────────────────────────────────────────────────┐  │
│  │  ╭──────╮  ╭══════╮  ╭──────╮  ░░░░░░░░    (your pick is greyed out)│  │
│  │  │ Drago│  │ Wolf │  │Driger│  ░ Dranzer░                            │  │
│  │  ╰──────╯  ╰══════╯  ╰──────╯  ░░░░░░░░                              │  │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌─── 🏟  Arena ───────────────────────────────────────────────────────┐   │
│  │  ╭══════╮  ╭───────╮  ╭───────╮  ╭───────╮                          │   │
│  │  │Metro │  │Forest │  │Desert │  │  Sea  │                          │   │
│  │  ╰══════╯  ╰───────╯  ╰───────╯  ╰───────╯                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌─── 🎯 Difficulty ──────────────────────────────────────────────────┐    │
│  │  ╭───────╮  ╭═══════╮  ╭───────╮    Medium: balanced reflexes,    │    │
│  │  │ Easy  │  │Medium │  │ Hard  │    moderate aggression.          │    │
│  │  ╰───────╯  ╰═══════╯  ╰───────╯                                  │    │
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

**States** — Loading: full-screen spinner during data fetch. Start disabled until all 4 selections filled.

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
│  ┌────────────┐  ┌─── Special ───┐  ┌─── Combo ───┐                        │
│  │ CONTROLS … │  │ Gyro Anchor   │  │ x2          │                        │
│  └────────────┘  └───────────────┘  └─────────────┘                        │
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

**Configs:** `difficulty` (easy/medium/hard) shapes CPU input frequency; `bestOf` drives series HUD; `spectate=true` query param swaps view.

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
│  └────────────────────────────────────────┘ │ ④ CPU-Easy   «AI»         │  │
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
│  └────────────┘   ┌── Special ─┐ ┌── Combo ─┐                              │
│                   │ ▮▮▯▯▯▯▯▯   │ │  x2      │                              │
│                   └────────────┘ └──────────┘                              │
│                       ┌───────────────────────────────────┐                │
│                       │ SpinKing  [Attack]                │                │
│                       │ HP   ▮▮▮▮▮▮▮▮▯▯  78%              │                │
│                       │ Spin ▮▮▮▮▮▮▯▯▯▯  60%              │                │
│                       └───────────────────────────────────┘                │
└────────────────────────────────────────────────────────────────────────────┘
```

**End overlay**

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
│  │ AI Difficulty    [▼ Easy / Medium / Hard ]   (only if AI/Mixed)     │   │
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
│  │ │ Dragoon  ↘  │ │ ?    ?   │ │          │            │ │ ④ CPU-Easy   ││
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

**Per-type variations**

| Page | Page Title | Tag dropdown values | Notes |
|------|-----------|---------------------|-------|
| ArenaThemeAssetsPage | 🌆 Arena Theme Assets | metrocity / forest / mountains / desert / sea / futuristic / prehistoric / grasslands / safari / riverbank | Square textures |
| ObstacleAssetsPage | 🪨 Obstacle Assets | block / spike / pillar / rock | (table above) |
| TurretAssetsPage | 🔫 Turret Assets | cannon / laser / projectile-bullet / projectile-laser | Both base + projectile sprites |
| WaterBodyAssetsPage | 💧 Water Body Assets | sea / river / lake / lava | Animated tiling |
| PortalAssetsPage | 🌀 Portal Assets | entrance / exit / paired | Optional anim frames |
| SoundAssetsPage | 🔊 Sound Assets | hit / spin / win / bg-music / ui | MP3/OGG; preview play button replaces image cell |

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

The `PartEditor` is a left-tab + main-pane layout.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Part Search › Attack Rings › Edit                          [   Save   ]   │
│                                                                            │
│  ┌── Tabs (sticky) ──────────────────────────────────────────────────────┐ │
│  │ ╭═════════╮ ╭───────╮ ╭───────╮ ╭───────╮ ╭──────────╮ ╭─────────╮    │ │
│  │ │Overview │ │Preview│ │ Shape │ │Images │ │Dimensions│ │Material │    │ │
│  │ ╰═════════╯ ╰───────╯ ╰───────╯ ╰───────╯ ╰──────────╯ ╰─────────╯    │ │
│  │ ╭──────────────╮ ╭──────────────╮ ╭─────────╮ ╭───────────────╮       │ │
│  │ │Contact Points│ │Configurations│ │ Pockets │ │  Type Fields  │       │ │
│  │ ╰──────────────╯ ╰──────────────╯ ╰─────────╯ ╰───────────────╯       │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌── Overview tab ──────────────────────────────────────────────────────┐  │
│  │ Display Name [ Dragoon Storm AR ]                                    │  │
│  │ Color        [ ▣ ]  hex 0a3b8c                                       │  │
│  │                                                                      │  │
│  │ Compatibility tags                                                   │  │
│  │   ┌── compatibilityTags ────┐ [ + add ]                              │  │
│  │   │ «attack» «storm-series» │                                        │  │
│  │   └─────────────────────────┘                                        │  │
│  │   ┌── requiredCompatibility ┐ [ + add ]                              │  │
│  │   │ «core-storm»            │                                        │  │
│  │   └─────────────────────────┘                                        │  │
│  │   ┌── excludedCompatibility ┐ [ + add ]                              │  │
│  │   │ (none)                  │                                        │  │
│  │   └─────────────────────────┘                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Per-tab content (each replaces the main pane)

```
─── Preview ───────────────────────────────────────────────────────────
  ┌────────────┐ ┌────────────┐ ┌────────────┐
  │  Top-down  │ │   Side     │ │ Isometric  │
  └────────────┘ └────────────┘ └────────────┘
  Stats:  height 8mm · radius 25mm · mass 12g · attack 130 · spin-steal 12

─── Shape ─────────────────────────────────────────────────────────────
  Preset      [▼ Circle / 4-blade / 6-blade / Custom ]
  ┌─── Silhouette Tracer ──────┐  ┌─── Bezier Editor ─────┐
  │  upload outline image      │  │  drag handles         │
  └────────────────────────────┘  └───────────────────────┘
  ┌─── Fourier Editor ─────────┐  ┌─── Side / Bottom ─────┐
  │  harmonic sliders          │  │  spline profile       │
  └────────────────────────────┘  └───────────────────────┘

─── Images ────────────────────────────────────────────────────────────
  Top    [⤓ choose…]   ╭────╮         Side  [⤓ choose…]  ╭────╮
                       ╰────╯                            ╰────╯
  Bottom [⤓ choose…]   ╭────╮
                       ╰────╯

─── Dimensions ────────────────────────────────────────────────────────
  Height (mm)        [ 8.0 ]
  Outer Radius (mm)  [ 25  ]    (shown per part type — Tip uses tipRadius, etc.)
  Inner Radius (mm)  [ 12  ]

─── Material ──────────────────────────────────────────────────────────
  Material [▼ Plastic / Metal / Rubber / Composite ]
  ┌── Material Bands ───────────────────────────────────────────────┐
  │ #1  r=0–12mm  color ▣ 0a3b8c   density 1.2g/cm³   bounce 0.4    │
  │ #2  r=12–25mm color ▣ ffaa00   density 6.5        bounce 0.1    │
  │ [ + add band ]                                                  │
  └─────────────────────────────────────────────────────────────────┘

─── Contact Points ────────────────────────────────────────────────────
  ┌────────────────────────────┐  ┌─── Point list ──────────────────┐
  │     ◉ part preview ◉       │  │ #1  θ=0°    spinSteal=12        │
  │     (click to add)         │  │ #2  θ=90°   spinSteal=8         │
  └────────────────────────────┘  │ [ + Add ]                       │
                                  └─────────────────────────────────┘

─── Configurations ────────────────────────────────────────────────────
  Variant list (each = alternate stat set / asset bundle)
  ┌─ default ─┐ ┌─ heavy ─┐ ┌─ + new ─┐

─── Pockets ───────────────────────────────────────────────────────────
  (Sub-part attachment sockets)
  ┌─ pocket #1  slot=blade   accepts tags «blade-mod» ──── [✕]
  ┌─ pocket #2  slot=bottom  accepts tags «tip-mod»   ──── [✕]
  [ + Add Pocket ]

─── Type Fields ───────────────────────────────────────────────────────
  Part-type-specific:
    AR:     bladeCount  attackBoost  spinStealBoost
    WD:     weight  gripFactor
    Tip:    tipShape (flat/sharp/sphere/needle)  contactArea
    Core:   density  innerRadius
    Casing: shellThickness  rigidity
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

Two-column layout: tab editor (left) + always-on preview (right).

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Beyblade Systems › Edit                                  [   Save   ]     │
│  ┌── Tabs ──────────────────────────────────────────────────────────────┐  │
│  │ ╭═══════╮ ╭────────╮ ╭───╮ ╭────╮ ╭─────╮ ╭─────╮ ╭──────╮ ╭────────╮│  │
│  │ │Overv. │ │BitBeast│ │ AR│ │ WD │ │ Tip │ │Core │ │Casing│ │SpinTrk │ │  │
│  │ ╰═══════╯ ╰────────╯ ╰───╯ ╰────╯ ╰─────╯ ╰─────╯ ╰──────╯ ╰────────╯│  │
│  │ ╭─────────╮ ╭────────╮                                                │  │
│  │ │Sub-Parts│ │Preview │                                                │  │
│  │ ╰─────────╯ ╰────────╯                                                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌── Slot tab (e.g., Attack Ring) ────────┐ ┌── Live preview ────────────┐ │
│  │ Pick part                              │ │  ┌─────┐ ┌─────┐ ┌─────┐  │ │
│  │ ┌─── PartPicker ─────────────────────┐ │ │  │ Top │ │Side │ │ Iso │  │ │
│  │ │ 🔍 dragoon                         │ │ │  └─────┘ └─────┘ └─────┘  │ │
│  │ │ ● Dragoon Storm AR     ar_storm    │ │ │  ┌── Computed stats ────┐ │ │
│  │ │ ○ Dragoon Quake AR     ar_quake    │ │ │  │ weight   48 g        │ │ │
│  │ │ ○ Dragoon Spiral AR    ar_spiral   │ │ │  │ attack   130          │ │ │
│  │ └────────────────────────────────────┘ │ │  │ defense   70          │ │ │
│  │  Selected: ar_storm                    │ │  │ stamina   90          │ │ │
│  │  [ Clear slot ]                        │ │  │ radius   25 mm        │ │ │
│  │                                        │ │  └──────────────────────┘ │ │
│  └────────────────────────────────────────┘ └────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

**Sub-Parts tab**

```
  ┌── Sub-Parts ──────────────────────────────────────────────────────┐
  │  AR pocket «blade-mod»     [▼ pick sub-part… ]    [✕ remove]      │
  │  Tip pocket «tip-mod»      [▼ pick sub-part… ]    [✕ remove]      │
  │  [ + Add attachment ]                                             │
  └───────────────────────────────────────────────────────────────────┘
```

**Preview tab** — same as live preview but full-width with an `ExplodedView` toggle.

```
  ┌────────────────────────────────────────────────────────────────────┐
  │  ◉ Exploded View    (parts spread vertically — bit beast → tip)    │
  │  ┌── Bit Beast ──┐ ┌── AR ─────┐ ┌── WD ─────┐ ┌── Core ─┐         │
  │  │      ✦        │ │     ▣     │ │     ⚖    │ │   ◎    │         │
  │  └───────────────┘ └───────────┘ └───────────┘ └────────┘         │
  └────────────────────────────────────────────────────────────────────┘
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

# IV. SERIES / SPECTATOR / OVERLAY MATRIX

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

# V. ROUTE MAP

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

*End of mocks. Total: 13 player screens + 17 admin gameplay screens + 18 admin asset/2.5D screens + shared HUD + state matrices + route map.*

# E2E Test Screenshots

All screenshots are captured by Playwright tests and saved to `test-results/screenshots/`.
Run `npm run test:e2e` (for the comprehensive suite) or `npx playwright test tests/e2e/two-player-scenarios.spec.ts --project=chromium-dev` to regenerate them.

---

## game-modes-comprehensive.spec.ts

### Z — Zoom: warp-free viewport

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| Z01 — canvas present on load | `Z01` | Canvas renders with non-zero dimensions | ![Z01](../test-results/screenshots/Z01-zoom-canvas-loaded.png) |
| Z02 — resize: no warp | `Z02` | Canvas CSS dims change; arena stays circular | ![1440x900](../test-results/screenshots/Z02-canvas-1440x900.png) ![600x900](../test-results/screenshots/Z02-canvas-600x900.png) ![1920x600](../test-results/screenshots/Z02-canvas-1920x600.png) ![restored](../test-results/screenshots/Z02-canvas-restored.png) |
| Z03 — zoom-in | `Z03` | Objects appear larger after 3× zoom-in | ![before](../test-results/screenshots/Z03-before-zoom-in.png) ![after](../test-results/screenshots/Z03-after-zoom-in.png) |
| Z04 — zoom-out | `Z04` | More of arena visible after zoom-out | ![before](../test-results/screenshots/Z04-before-zoom-out.png) ![after](../test-results/screenshots/Z04-after-zoom-out.png) |
| Z05 — zoom-reset | `Z05` | Returns to fit-arena zoom level | ![zoomed](../test-results/screenshots/Z05-zoomed-in.png) ![reset](../test-results/screenshots/Z05-after-reset.png) |
| Z06 — multi-viewport zoom | `Z06` | Same visual scale at 390/768/1440/1920 px wide | ![390](../test-results/screenshots/Z06-zoom-in-390x844.png) ![768](../test-results/screenshots/Z06-zoom-in-768x1024.png) ![1440](../test-results/screenshots/Z06-zoom-in-1440x900.png) ![1920](../test-results/screenshots/Z06-zoom-in-1920x1080.png) |

---

### P — PvAI battles

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| P01 — Medium: 20s battle | `P01` | Canvas stable; no JS errors over 20s | ![loading](../test-results/screenshots/P01-pvai-medium-loading.png) ![canvas](../test-results/screenshots/P01-pvai-medium-canvas.png) ![3s](../test-results/screenshots/P01-pvai-medium-t3s.png) ![6s](../test-results/screenshots/P01-pvai-medium-t6s.png) ![9s](../test-results/screenshots/P01-pvai-medium-t9s.png) ![12s](../test-results/screenshots/P01-pvai-medium-t12s.png) ![20s](../test-results/screenshots/P01-pvai-medium-t20s.png) |
| P02 — Medium: HUD visible | `P02` | Spin bar, timer, scores rendered | ![hud](../test-results/screenshots/P02-hud-check.png) |
| P03 — Hard: strafe + dodge 20s | `P03` | Hard AI predictive behavior; player alive | ![loading](../test-results/screenshots/P03-pvai-hard-loading.png) ![canvas](../test-results/screenshots/P03-pvai-hard-canvas.png) ![r1](../test-results/screenshots/P03-pvai-hard-round1.png) ![r2](../test-results/screenshots/P03-pvai-hard-round2.png) ![r3](../test-results/screenshots/P03-pvai-hard-round3.png) ![20s](../test-results/screenshots/P03-pvai-hard-t20s.png) |
| P04 — Hell: survive 20s | `P04` | 10-tick AI; combo + special fired; player survives | ![loading](../test-results/screenshots/P04-pvai-hell-loading.png) ![canvas](../test-results/screenshots/P04-pvai-hell-canvas.png) ![4s](../test-results/screenshots/P04-pvai-hell-t4s.png) ![7s](../test-results/screenshots/P04-pvai-hell-t7s.png) ![20s](../test-results/screenshots/P04-pvai-hell-t20s.png) |
| P05 — Spectator mode | `P05` | Spectator joins AI room; canvas + zoom controls visible | ![loading](../test-results/screenshots/P05-spectator-loading.png) ![mount](../test-results/screenshots/P05-spectator-game-mount.png) ![canvas](../test-results/screenshots/P05-spectator-canvas.png) ![zoomed](../test-results/screenshots/P05-spectator-zoomed-in.png) ![15s](../test-results/screenshots/P05-spectator-t15s.png) |

---

### V — PvP: lobby, game, spectator

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| V01 — Lobby loads | `V01` | Room code, player list, BO selector visible | ![lobby](../test-results/screenshots/V01-pvp-lobby.png) |
| V02 — BO3 selection | `V02` | BO3 button highlights when clicked | ![bo3](../test-results/screenshots/V02-bo3-selected.png) |
| V03 — Navigate to game | `V03` | Canvas or loading-progress appears | ![game](../test-results/screenshots/V03-pvp-game.png) |
| V04 — Spectator join lobby | `V04` | Spectator badge shown | ![spec](../test-results/screenshots/V04-spectator-lobby.png) |
| V05 — Two-browser spectator | `V05` | Player in context 1; spectator in context 2 sees canvas | ![player](../test-results/screenshots/V05-player-view.png) ![spectator](../test-results/screenshots/V05-spectator-view.png) ![spec-mount](../test-results/screenshots/V05-spectator-game-mount.png) |

---

### T — Tournament: list, lobby, AI bot fill, spectate

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| T01 — List loads | `T01` | Tournament list page renders with entries | ![list](../test-results/screenshots/T01-tournament-list.png) |
| T02 — Lobby countdown | `T02` | Waiting/countdown banner after join | ![lobby](../test-results/screenshots/T02-tournament-lobby.png) |
| T03 — Bot fill at 60s | `T03` | AI bot names appear after join window expires | ![bots](../test-results/screenshots/T03-bot-fill.png) |
| T04 — Spectator join | `T04` | Spectator joins match room | ![spec](../test-results/screenshots/T04-tournament-spectator.png) |
| T05 — Battle canvas stable | `T05` | Canvas runs through AI vs AI match | ![battle](../test-results/screenshots/T05-tournament-battle.png) |

---

### R — Battle Royale: AI bot fill, game, spectate

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| R01 — Royale card visible | `R01` | Battle Royale card shown on BattleModeCardsPage | ![card](../test-results/screenshots/R01-royale-card.png) |
| R02 — Lobby join | `R02` | Player count + waiting banner after joining | ![lobby](../test-results/screenshots/R02-royale-lobby.png) |
| R03 — Bot names shown | `R03` | AI character names in player list after fill | ![bots](../test-results/screenshots/R03-royale-bots.png) |
| R04 — Canvas + spectator | `R04` | Canvas runs; spectator sees all players | ![game](../test-results/screenshots/R04-royale-game.png) |
| R05 — Two-browser spectator | `R05` | Second context joins as spectator, sees canvas | ![spec](../test-results/screenshots/R05-royale-spectator.png) |

---

### S — Spectator: follow-player camera UI

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| S01 — Player list + follow | `S01` | Click player in list locks camera on that bey | ![follow](../test-results/screenshots/S01-spectator-follow.png) |
| S02 — Spectator zoom | `S02` | Zoom controls work independently of game zoom | ![zoom](../test-results/screenshots/S02-spectator-zoom.png) |
| S03 — Spectator count | `S03` | HUD count increments when second client joins | ![count](../test-results/screenshots/S03-spectator-count.png) |

---

## two-player-scenarios.spec.ts

### M — Multiplayer PvP: two real players

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| M01 — Join same room | `M01` | P1 + P2 both reach game room; P1 canvas visible | ![p1-mount](../test-results/screenshots/M01-p1-room-mount.png) ![p2-mount](../test-results/screenshots/M01-p2-room-mount.png) ![p1-10s](../test-results/screenshots/M01-p1-10s-in.png) ![p2-10s](../test-results/screenshots/M01-p2-10s-in.png) |
| M02 — Full 1v1 battle | `M02` | Both launch; both canvas at 30s | ![p1-lobby](../test-results/screenshots/M02-p1-lobby.png) ![p2-lobby](../test-results/screenshots/M02-p2-lobby.png) ![p1-launch](../test-results/screenshots/M02-p1-launched.png) ![p2-launch](../test-results/screenshots/M02-p2-launched.png) ![p1-30s](../test-results/screenshots/M02-p1-30s.png) ![p2-30s](../test-results/screenshots/M02-p2-30s.png) |

---

### X — Tournament: 2 players + AI bot fill

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| X01 — Server tournament join | `X01` | Both players join lobby; bots fill remaining bracket | ![p1-list](../test-results/screenshots/X01-p1-tourn-list.png) ![p1-joined](../test-results/screenshots/X01-p1-joined.png) ![p2-joined](../test-results/screenshots/X01-p2-joined.png) ![final](../test-results/screenshots/X01-p1-final.png) |
| X02 — Local tournament-ai, two contexts | `X02` | Each context runs its own 3-round bracket; bracket HUD visible | ![p1-mount](../test-results/screenshots/X02-p1-game-mount.png) ![p2-mount](../test-results/screenshots/X02-p2-game-mount.png) ![p1-launch](../test-results/screenshots/X02-p1-launched.png) ![p2-launch](../test-results/screenshots/X02-p2-launched.png) ![p1-20s](../test-results/screenshots/X02-p1-20s.png) ![p2-20s](../test-results/screenshots/X02-p2-20s.png) |

---

### Y — Battle Royale: 2 players + AI bot fill

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| Y01 — Local royale-ai, two contexts | `Y01` | Each context runs 1v11 bots; both canvas visible | ![p1-mount](../test-results/screenshots/Y01-p1-game-mount.png) ![p2-mount](../test-results/screenshots/Y01-p2-game-mount.png) ![p1-launch](../test-results/screenshots/Y01-p1-launched.png) ![p2-launch](../test-results/screenshots/Y01-p2-launched.png) ![p1-20s](../test-results/screenshots/Y01-p1-20s.png) ![p2-20s](../test-results/screenshots/Y01-p2-20s.png) |
| Y02 — Online royale: two players + bot fill | `Y02` | Both join same royale room; bots fill after 70s | ![p1-lobby](../test-results/screenshots/Y02-p1-lobby.png) ![p2-lobby](../test-results/screenshots/Y02-p2-lobby.png) ![after-fill](../test-results/screenshots/Y02-p1-after-bot-fill.png) ![final](../test-results/screenshots/Y02-p1-final.png) |

---

### L — Local tournament-ai: round progression + difficulty ramp

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| L01 — Round 1 HUD | `L01` | Canvas loads; Round/Final badge visible | ![mount](../test-results/screenshots/L01-game-mount.png) ![launched](../test-results/screenshots/L01-launched.png) ![10s](../test-results/screenshots/L01-10s.png) |
| L02 — Difficulty label | `L02` | AI opponent shows medium/hard/hell badge | ![label](../test-results/screenshots/L02-difficulty-label.png) |
| L03 — Survive Round 1 (30s) | `L03` | Canvas still running after 30s of dodge play | ![30s](../test-results/screenshots/L03-30s.png) |

---

### K — Local royale-ai: 1 player vs 11 bots

| Test | ID | What it checks | Screenshots |
|------|----|----------------|-------------|
| K01 — Canvas loads | `K01` | 12-bey arena renders; canvas visible | ![mount](../test-results/screenshots/K01-mount.png) ![launched](../test-results/screenshots/K01-launched.png) ![8s](../test-results/screenshots/K01-8s.png) |
| K02 — Bot-vs-bot eliminations | `K02` | Canvas still running 30s in; bots eliminated each other | ![5s](../test-results/screenshots/K02-5s.png) ![30s](../test-results/screenshots/K02-30s.png) |
| K03 — 12-player spawn ring | `K03` | Pre-launch shows all 12 bey starting positions | ![pre-launch](../test-results/screenshots/K03-pre-launch.png) ![post-launch](../test-results/screenshots/K03-post-launch.png) |
| K04 — Variable bot difficulties | `K04` | Difficulty icons and AI character names visible in HUD | ![icons](../test-results/screenshots/K04-difficulty-icons.png) |

---

## Running the tests

```bash
# Comprehensive suite (29 tests — all game modes, ~17 min)
npm run test:e2e

# Two-player scenarios (13 tests — M/X/Y/L/K sections, ~10 min)
npx playwright test tests/e2e/two-player-scenarios.spec.ts --project=chromium-dev

# Both together
npx playwright test --project=chromium-dev
```

Screenshots are saved to `test-results/screenshots/` on every run, regardless of pass/fail.
The Playwright HTML report is at `playwright-report/index.html` — open it for video + trace on failures.

## Credentials used

| Account | Email | Role |
|---------|-------|------|
| Player 1 (admin) | `testadmin@letitrip.in` | admin |
| Player 2 | `player2@letitrip.in` | user |

To seed Player 2: `npm run seed:second-player`

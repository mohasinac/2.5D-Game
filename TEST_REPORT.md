# Beyblade Game — Screenshot Test Report

**Date:** 2026-05-29 | **Branch:** main | **Screenshots:** `test-results/screenshots/`

---

## A — Login & Navigation (3 viewports)

### Desktop 1280×800

| Login | Landing Page | Game Mode Select |
|-------|-------------|-----------------|
| ![](test-results/screenshots/01-login-1280x800.png) | ![](test-results/screenshots/02-landing-page-1280x800.png) | ![](test-results/screenshots/03-game-mode-select-1280x800.png) |

| Battle Mode Cards | Story Mode Cards | PvP Battle Lobby |
|------------------|-----------------|-----------------|
| ![](test-results/screenshots/04-battle-mode-cards-1280x800.png) | ![](test-results/screenshots/05-story-mode-cards-1280x800.png) | ![](test-results/screenshots/08-pvp-battle-lobby-1280x800.png) |

| Tournament List | Legacy Redirect (AI Battle) | Legacy Redirect (Tryout) |
|----------------|----------------------------|--------------------------|
| ![](test-results/screenshots/09-tournament-list-1280x800.png) | ![](test-results/screenshots/06-legacy-redirect-ai-battle-1280x800.png) | ![](test-results/screenshots/07-legacy-redirect-tryout-1280x800.png) |

---

### Mobile Portrait 390×844

| Login | Landing Page | Battle Mode Cards |
|-------|-------------|------------------|
| ![](test-results/screenshots/10-login-390x844.png) | ![](test-results/screenshots/11-landing-page-390x844.png) | ![](test-results/screenshots/13-battle-mode-cards-390x844.png) |

| Story Mode Cards | PvP Battle Lobby | Tournament List |
|-----------------|-----------------|----------------|
| ![](test-results/screenshots/14-story-mode-cards-390x844.png) | ![](test-results/screenshots/17-pvp-battle-lobby-390x844.png) | ![](test-results/screenshots/18-tournament-list-390x844.png) |

---

### Mobile Landscape 844×390

| Login | Landing Page | Battle Mode Cards |
|-------|-------------|------------------|
| ![](test-results/screenshots/19-login-844x390.png) | ![](test-results/screenshots/20-landing-page-844x390.png) | ![](test-results/screenshots/22-battle-mode-cards-844x390.png) |

| Story Mode Cards | PvP Battle Lobby | Tournament List |
|-----------------|-----------------|----------------|
| ![](test-results/screenshots/23-story-mode-cards-844x390.png) | ![](test-results/screenshots/26-pvp-battle-lobby-844x390.png) | ![](test-results/screenshots/27-tournament-list-844x390.png) |

---

## B — Battle Cards Carousel (Portrait)

| Card 1 (initial) | Card 2 | Card 3 |
|-----------------|--------|--------|
| ![](test-results/screenshots/28-cards-B-initial-390x844.png) | ![](test-results/screenshots/29-cards-B-card2-390x844.png) | ![](test-results/screenshots/30-cards-B-card3-390x844.png) |

| Card 4 | Card 5 | Back to Card 1 |
|--------|--------|----------------|
| ![](test-results/screenshots/31-cards-B-card4-390x844.png) | ![](test-results/screenshots/32-cards-B-card5-390x844.png) | ![](test-results/screenshots/33-cards-B-back-card1-390x844.png) |

---

## C — Tryout: GameRoomPage Load (Portrait)

| Battle Cards | After Card Select | Room Page |
|-------------|------------------|-----------|
| ![](test-results/screenshots/34-tryout-C-battle-cards-390x844.png) | ![](test-results/screenshots/35-tryout-C-after-select-390x844.png) | ![](test-results/screenshots/36-tryout-C-room-page-390x844.png) |

| Canvas | Loading Progress |
|--------|-----------------|
| ![](test-results/screenshots/37-tryout-C-canvas-390x844.png) | ![](test-results/screenshots/38-tryout-C-loading-progress-390x844.png) |

---

## D — Tryout: Full 30s Run (Portrait)

| Navigated | Canvas | Loading Steps |
|-----------|--------|---------------|
| ![](test-results/screenshots/39-room-D-navigated-390x844.png) | ![](test-results/screenshots/40-room-D-canvas-390x844.png) | ![](test-results/screenshots/41-room-D-loading-steps-390x844.png) |

| Countdown | Launched | Playing 0s |
|-----------|---------|------------|
| ![](test-results/screenshots/42-room-D-countdown-390x844.png) | ![](test-results/screenshots/43-room-D-launched-390x844.png) | ![](test-results/screenshots/44-room-D-playing-0s-390x844.png) |

| Playing 10s | Playing 20s | 30s End |
|------------|------------|--------|
| ![](test-results/screenshots/45-room-D-playing-10s-390x844.png) | ![](test-results/screenshots/46-room-D-playing-20s-390x844.png) | ![](test-results/screenshots/46-room-D-30s-end-390x844.png) |

| Result Screen |
|--------------|
| ![](test-results/screenshots/47-room-D-result-390x844.png) |

---

## E — Admin Pages

| Dashboard | Dashboard (Errors Section) | Settings |
|-----------|---------------------------|----------|
| ![](test-results/screenshots/48-admin-E-dashboard-1280x800.png) | ![](test-results/screenshots/49-admin-E-dashboard-errors-section-1280x800.png) | ![](test-results/screenshots/50-admin-E-settings-1280x800.png) |

| Settings — 2.5D Toggle |
|------------------------|
| ![](test-results/screenshots/51-admin-E-settings-25d-toggle-1280x800.png) |

---

## F — GBA Shell Landscape

| Loading | Canvas | Countdown |
|---------|--------|-----------|
| ![](test-results/screenshots/52-shell-F-landscape-loading-844x390.png) | ![](test-results/screenshots/53-shell-F-landscape-canvas-844x390.png) | ![](test-results/screenshots/54-shell-F-landscape-countdown-844x390.png) |

| Launched | Playing 0s | Playing 10s | Gameplay End |
|----------|-----------|------------|-------------|
| ![](test-results/screenshots/55-shell-F-landscape-launched-844x390.png) | ![](test-results/screenshots/56-shell-F-playing-0s-844x390.png) | ![](test-results/screenshots/57-shell-F-playing-10s-844x390.png) | ![](test-results/screenshots/58-shell-F-landscape-gameplay-844x390.png) |

---

## G — 2-Player Friends Room (PvP)

> **Requires Colyseus server running** (`npm run dev:server`). When server is offline, section G captures the connecting/error state instead.

### G-1: Player 1 — Create Room

| P1 Lobby (Choose) | P1 Connecting | P1 In Lobby with Code |
|------------------|--------------|----------------------|
| ![](test-results/screenshots/59-friends-G-p1-lobby-choose-390x844.png) | ![](test-results/screenshots/60-friends-G-p1-connecting-390x844.png) | ![](test-results/screenshots/61-friends-G-p1-in-lobby-with-code-390x844.png) |

### G-2: Player 2 — Join via Code

| P2 Lobby (Choose) | P2 Join Code Input | P2 Code Entered |
|------------------|-------------------|----------------|
| ![](test-results/screenshots/62-friends-G-p2-lobby-choose-390x844.png) | ![](test-results/screenshots/63-friends-G-p2-join-code-input-390x844.png) | ![](test-results/screenshots/64-friends-G-p2-code-entered-390x844.png) |

| P2 Joining |
|-----------|
| ![](test-results/screenshots/65-friends-G-p2-joining-390x844.png) |

### G-3: Both in Lobby

| P1 Lobby (2 Players) | P2 Lobby (Joined) |
|---------------------|------------------|
| ![](test-results/screenshots/66-friends-G-p1-lobby-2players-390x844.png) | ![](test-results/screenshots/67-friends-G-p2-lobby-joined-390x844.png) |

### G-4 to G-5: Game Loading → Canvas

| P1 Game Loading | P2 Game Loading | P1 Canvas | P2 Canvas |
|----------------|----------------|-----------|-----------|
| ![](test-results/screenshots/68-friends-G-p1-game-loading-390x844.png) | ![](test-results/screenshots/69-friends-G-p2-game-loading-390x844.png) | ![](test-results/screenshots/70-friends-G-p1-canvas-390x844.png) | ![](test-results/screenshots/71-friends-G-p2-canvas-390x844.png) |

### G-6: Launch Phase

| P1 Countdown | P2 Countdown | P1 Charging | P2 Charging |
|-------------|-------------|------------|------------|
| ![](test-results/screenshots/72-friends-G-p1-countdown-390x844.png) | ![](test-results/screenshots/73-friends-G-p2-countdown-390x844.png) | ![](test-results/screenshots/74-friends-G-p1-launch-charging-390x844.png) | ![](test-results/screenshots/75-friends-G-p2-launch-charging-390x844.png) |

| P1 Launched | P2 Launched |
|------------|------------|
| ![](test-results/screenshots/76-friends-G-p1-launched-390x844.png) | ![](test-results/screenshots/77-friends-G-p2-launched-390x844.png) |

### G-7: Gameplay (20s)

| P1 @ 7s | P2 @ 7s | P1 @ 14s | P2 @ 14s |
|---------|---------|---------|---------|
| ![](test-results/screenshots/78-friends-G-p1-playing-7s-390x844.png) | ![](test-results/screenshots/79-friends-G-p2-playing-7s-390x844.png) | ![](test-results/screenshots/80-friends-G-p1-playing-14s-390x844.png) | ![](test-results/screenshots/81-friends-G-p2-playing-14s-390x844.png) |

### G-8: Post-Match Results

| P1 Result | P2 Result |
|----------|----------|
| ![](test-results/screenshots/82-friends-G-p1-result-390x844.png) | ![](test-results/screenshots/83-friends-G-p2-result-390x844.png) |

---

## K — Battle Royale AI (Local)

| Mount | Launched | @ 8s | @ 30s |
|-------|---------|------|-------|
| ![](test-results/screenshots/K01-mount.png) | ![](test-results/screenshots/K01-launched.png) | ![](test-results/screenshots/K01-8s.png) | ![](test-results/screenshots/K02-30s.png) |

| 5s | Pre-launch | Post-launch | Difficulty Icons |
|----|-----------|------------|----------------|
| ![](test-results/screenshots/K02-5s.png) | ![](test-results/screenshots/K03-pre-launch.png) | ![](test-results/screenshots/K03-post-launch.png) | ![](test-results/screenshots/K04-difficulty-icons.png) |

---

## M — PvP 2-Player Live Match

| P1 Room Mount | P2 Room Mount | P1 @ 10s | P2 @ 10s |
|--------------|--------------|---------|---------|
| ![](test-results/screenshots/M01-p1-room-mount.png) | ![](test-results/screenshots/M01-p2-room-mount.png) | ![](test-results/screenshots/M01-p1-10s-in.png) | ![](test-results/screenshots/M01-p2-10s-in.png) |

| P1 Lobby | P2 Lobby | P1 Launched | P2 Launched | P1 @ 30s | P2 @ 30s |
|---------|---------|------------|------------|---------|---------|
| ![](test-results/screenshots/M02-p1-lobby.png) | ![](test-results/screenshots/M02-p2-lobby.png) | ![](test-results/screenshots/M02-p1-launched.png) | ![](test-results/screenshots/M02-p2-launched.png) | ![](test-results/screenshots/M02-p1-30s.png) | ![](test-results/screenshots/M02-p2-30s.png) |

---

## X — Tournament 2-Player

| P1 Tournament List | P1 Waiting | P1 Match Canvas Timeout | P1 Final |
|-------------------|-----------|------------------------|---------|
| ![](test-results/screenshots/X01-p1-tourn-list.png) | ![](test-results/screenshots/X01-p1-waiting.png) | ![](test-results/screenshots/X01-p1-match-canvas-timeout.png) | ![](test-results/screenshots/X01-p1-final.png) |

| P1 Game Mount | P2 Game Mount | P1 Launched | P2 Launched |
|--------------|--------------|------------|------------|
| ![](test-results/screenshots/X02-p1-game-mount.png) | ![](test-results/screenshots/X02-p2-game-mount.png) | ![](test-results/screenshots/X02-p1-launched.png) | ![](test-results/screenshots/X02-p2-launched.png) |

| P1 @ 20s | P2 @ 20s |
|---------|---------|
| ![](test-results/screenshots/X02-p1-20s.png) | ![](test-results/screenshots/X02-p2-20s.png) |

---

## Y — Battle Royale 2-Player

| P1 Lobby | P2 Lobby | P1 Game Mount | P2 Game Mount |
|---------|---------|--------------|--------------|
| ![](test-results/screenshots/Y02-p1-lobby.png) | ![](test-results/screenshots/Y02-p2-lobby.png) | ![](test-results/screenshots/Y01-p1-game-mount.png) | ![](test-results/screenshots/Y01-p2-game-mount.png) |

| P1 Launched | P2 Launched | P1 @ 20s | P2 @ 20s |
|------------|------------|---------|---------|
| ![](test-results/screenshots/Y01-p1-launched.png) | ![](test-results/screenshots/Y01-p2-launched.png) | ![](test-results/screenshots/Y01-p1-20s.png) | ![](test-results/screenshots/Y01-p2-20s.png) |

| P1 After Bot Fill | P2 After Bot Fill |
|------------------|------------------|
| ![](test-results/screenshots/Y02-p1-after-bot-fill.png) | ![](test-results/screenshots/Y02-p2-after-bot-fill.png) |

---

---

## J — Random Match 2P (Auto-Matchmaking)

> **Requires Colyseus server running** (`npm run dev:server`). Both players click "Find Match" with the same size/BO settings and are auto-matched via `joinOrCreate`.

### J-1: Both Players Search

| P1 Phase 1 | P1 Prefs | P1 Searching | P2 Phase 1 | P2 Prefs | P2 Searching |
|-----------|---------|------------|-----------|---------|------------|
| ![](test-results/screenshots/random-J-p1-phase1.png) | ![](test-results/screenshots/random-J-p1-prefs.png) | ![](test-results/screenshots/random-J-p1-searching.png) | ![](test-results/screenshots/random-J-p2-phase1.png) | ![](test-results/screenshots/random-J-p2-prefs.png) | ![](test-results/screenshots/random-J-p2-searching.png) |

### J-2: Both In Lobby → Game Starts

| P1 In Lobby | P2 In Lobby | P1 Canvas | P2 Canvas |
|------------|------------|---------|---------|
| ![](test-results/screenshots/random-J-p1-in-lobby.png) | ![](test-results/screenshots/random-J-p2-in-lobby.png) | ![](test-results/screenshots/random-J-p1-canvas.png) | ![](test-results/screenshots/random-J-p2-canvas.png) |

### J-3: Launch Phase + Gameplay

| P1 Charging | P2 Charging | P1 Launched | P2 Launched |
|------------|------------|------------|------------|
| ![](test-results/screenshots/random-J-p1-launch-charging.png) | ![](test-results/screenshots/random-J-p2-launch-charging.png) | ![](test-results/screenshots/random-J-p1-launched.png) | ![](test-results/screenshots/random-J-p2-launched.png) |

| P1 @ 7s | P2 @ 7s | P1 @ 14s | P2 @ 14s | P1 @ 20s | P2 @ 20s |
|--------|--------|---------|---------|---------|---------|
| ![](test-results/screenshots/random-J-p1-playing-7s.png) | ![](test-results/screenshots/random-J-p2-playing-7s.png) | ![](test-results/screenshots/random-J-p1-playing-14s.png) | ![](test-results/screenshots/random-J-p2-playing-14s.png) | ![](test-results/screenshots/random-J-p1-playing-20s.png) | ![](test-results/screenshots/random-J-p2-playing-20s.png) |

| P1 Result | P2 Result |
|----------|----------|
| ![](test-results/screenshots/random-J-p1-result.png) | ![](test-results/screenshots/random-J-p2-result.png) |

---

## How to Update This Report

### For single-player sections (A–F, H, I) — no server needed:

```bash
node scripts/screenshot-game.js
```

### For 2-player online sections (G — Friends Room, J — Random Match):

```bash
# 1. Start Colyseus game server first
npm run dev:server

# 2. In a second terminal, run the screenshot script
node scripts/screenshot-game.js
```

Optional: set a second account for P2 to avoid Firebase same-user conflicts:
```bash
TEST2_EMAIL=player2@example.com TEST2_PASSWORD=Pass123! node scripts/screenshot-game.js
```

### For Playwright E2E tests (sections A–I):

```bash
npx playwright test tests/e2e/game-modes-1p-2p.spec.ts --project=chromium-dev
```

Playwright screenshots land in `test-results/screenshots/` with names matching the `ss(page, "tag")` calls in each spec.

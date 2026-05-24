[← Phase 13: Controls](phase-13-controls.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 16: Gap Analysis →](phase-16-gap-analysis.md)

---

# Phase 14 — Game Modes

> Stage 14 | Source: room files + GameState schema

## 1. Match Config Table (Rule 13)

| Match Type | Players | Teams | AI Support | Series Format | Room Cap | Scaling Notes |
|------------|---------|-------|------------|---------------|----------|---------------|
| `tryout` (TryoutRoom) | 1 human | None | No | Always BO1 (no series) | None — idle disconnect at 60s no-input | Solo; no collision physics (no opponents); max 1 client |
| `single-battle-pvp` (BattleRoom) | 2–4 humans | None (FFA) | No (human seats only) | BO1 / BO3 / BO5 via `options.bestOf` | 60s idle disconnect | Supports round modifiers, QTE, BeyLink stacks, arena timeline, shrink; maxClients=12 (4 players + 8 spectators) |
| `single-battle-pvp-ranked` (BattleRoom) | 2–4 humans | None (FFA) | No | BO1 / BO3 / BO5 | 60s idle disconnect | Same as PVP but `state.mode = "single-battle-pvp-ranked"` — no actual ranking pipeline confirmed beyond the mode flag |
| `ai-battle` (AIBattleRoom) | 1 human + 1 AI | None | Yes — medium / hard / hell | BO1 / BO3 / BO5 | 60s idle disconnect | AI-vs-AI admin test mode also supported (`aiVsAi=true`); maxClients=9 (1 human + 8 spectators) |
| `tournament` (TournamentBattleRoom) | 2 (human or AI) | None | Yes — aiParticipants[] in options | BO1 / BO3 / BO5 | Hard 3-min wall-clock cap across whole series; 60s idle disconnect | Writes to Firestore `tournament_brackets`; maxClients=10 (2 players + 8 spectators) |

---

## 2. Per-Room Audit

### TryoutRoom

| Aspect | Details |
|--------|---------|
| Status | Fully implemented |
| onCreate data loaded | Arena config (cached in `arenaCache`), ArenaSystem (optional `arenaSystemId`), global settings check (maintenanceMode, enableTryout) |
| Tick hooks | `advanceArenaRotation`, `processArenaFeatures`, nutation wobble, spin decay, stamina decay, buff timers, ring-out check, 2.5D part hook (`onTickedBey`) |
| Series logic | None — no `targetWins`, no `seriesWins`, status goes directly `waiting → in-progress`. No win condition broadcast; room ends only on spin-out or idle disconnect |
| Spectator support | No — `maxClients = 1`; no spectator join path |
| Notes | Extends with `Parts25DTryoutRoom` via `onTickedBey()` hook. Arena system slope applied each tick if loaded. No combo tracking — `handleAction()` only handles `"charge"` and `"dash"` legacy messages. Special moves are physics-based (same 4-type switch as other rooms) but series/win logic is absent. |

### BattleRoom

| Aspect | Details |
|--------|---------|
| Status | Fully implemented — most feature-complete room |
| onCreate data loaded | Arena (cached), ArenaSystem (optional), global settings, combo effects (`loadComboEffects()`), element type matrix (`loadElementTypeMatrix()`), round modifiers resolved from `options.modifierIds` |
| Tick hooks | `advanceArenaRotation`, beyblade-vs-beyblade collision (O(n²) pair check), `processArenaFeatures`, nutation wobble, spin/stamina decay, buff timers, ring-out check, arena timeline events (Phase T), arena shrink (Phase V), BeyLink stack processing, QTE state management, AI-vs-AI support via `aiControllers` map, 2.5D part hook |
| Series logic | Full BO1/BO3/BO5 via `SeriesManager`: `determineGameWinner`, `recordGameWin`, `isSeriesOver`, `buildSeriesScore`, `resetStateForNextGame`. On series end: `state.status = "series-finished"`; room disconnects after 5s. On game end: `"game-end"` broadcast + `resetForNextGame()` after 3s delay |
| Spectator support | Yes — `spectate: true` in options; `spectatorSessions` set; `spectator:follow` message; `state.spectatorCount` tracked |
| Notes | Supports round modifiers (invert controls, physics overrides, chaos randomize stats). QTE system for special move defense. BeyLink stacks with hijack QTEs. Arena timeline events. Arena shrink. Element type damage matrix. Possession-request (K10 spatial swap). `ranked` flag sets mode string but no ranking pipeline beyond that. |

### AIBattleRoom

| Aspect | Details |
|--------|---------|
| Status | Fully implemented |
| onCreate data loaded | Arena (cached), ArenaSystem (optional), global settings (maintenanceMode, enableAiBattle) |
| Tick hooks | `advanceArenaRotation`, AI input generation via `AIController.computeInput()` (all three difficulties), beyblade-vs-beyblade collision, `processArenaFeatures`, nutation wobble, spin/stamina decay, buff timers, combo detection for human, ring-out check, `wallBowlForce`, 2.5D part hook |
| Series logic | Full BO1/BO3/BO5 via `SeriesManager`. Win condition on last-bey-standing or timer expiry. `resetBeybladeForNextGame` resets bey state between games |
| Spectator support | Yes — `spectatorSessions`, `spectator:follow`, `state.spectatorCount`. AI-vs-AI mode (`aiVsAi=true`) is spectator-only (admin test). 30s no-spectator dispose timeout for AI-vs-AI |
| Notes | AI difficulty: medium / hard / hell (legacy "easy" collapses to "medium"). `invertInputControls()` is imported but not wired in AIBattleRoom (only in BattleRoom). Combo detection wired for human only; AI uses `AIController.computeInput()` which can emit combo key sequences on hell difficulty. |

### TournamentBattleRoom

| Aspect | Details |
|--------|---------|
| Status | Fully implemented |
| onCreate data loaded | Arena (cached), ArenaSystem (optional), global settings (maintenanceMode), `TournamentBattleRoom.pendingMatchCallbacks` static map checked for scheduler callback |
| Tick hooks | `advanceArenaRotation`, AI input generation (for AI participants), beyblade-vs-beyblade collision, `processArenaFeatures`, nutation wobble, spin/stamina decay, buff timers, combo detection for human players, ring-out check, 3-min room cap check (`endSeriesOnCap`), 2.5D part hook |
| Series logic | Full BO1/BO3/BO5 + hard 3-min wall-clock cap. `endSeriesOnCap()` determines winner by `seriesWins` lead; on tie sets `isSeriesDraw = true` and `state.winner = ""`. Writes to Firestore on series end (`saveMatch`, `updatePlayerStats`). Calls `onMatchEnd` callback (populates `colyseusRoomId` and advances bracket) |
| Spectator support | Yes — full spectator support; `spectatorFollowTargets`; if all human players leave, room disposes |
| Notes | AI participants pre-created in `onCreate` via `aiParticipants[]` option. Tournament metadata fields (`tournamentId`, `tournamentName`, `roundNumber`, `tournamentMatchId`) propagated to `GameState`. Leaderboard scoring: winner +2 `tournamentPoints` + 1 win; loser +0; draw (cap tie) both +1 point. |

---

## 3. Win Condition Types

| Win Condition | Trigger | Schema Field | Implemented? |
|---------------|---------|--------------|-------------|
| Spin-out | `beyblade.spin <= 0 && beyblade.isActive` → `spin-out` broadcast | `isActive = false`, `eliminationType = "spin_out"` | Yes — all rooms |
| Ring-out | Beyblade center exits 90% of wall radius | `isRingOut = true`, `isActive = false`, `eliminationType = "ring_out"` | Yes — all rooms with collision opponents |
| Timer expiry | `state.timer <= 0` (180s countdown) | `state.timer`, checked in `determineGameWinner` | Yes — BattleRoom, AIBattleRoom, TournamentBattleRoom |
| Last bey standing | All opponents `!isActive` | Checked via `determineGameWinner()` in SeriesManager | Yes — all multi-player rooms |
| Series win (BO3/BO5) | `seriesWins[userId] >= targetWins` | `state.seriesWins`, `state.targetWins`, `state.currentGame` | Yes — all rooms except TryoutRoom |
| Tournament room cap | Wall-clock >= 180s since first warmup→in-progress | `matchStartedAtMs` vs `roomCapMs` | Yes — TournamentBattleRoom only |
| Burst elimination | `isBurst = true` when eliminated by burst roll | `isBurst`, `eliminationType = "burst"`, `burstKillsDealt` | Partially — schema fields exist; burst roll logic is in BattleRoom collision handling |
| Player disconnect | Player leaves during in-progress | Opponent auto-wins; `beyblade.isActive = false; isRingOut = true` | Yes — BattleRoom and TournamentBattleRoom |

---

## 4. Round Modifier Support

| Modifier | Effect | Implemented? | Collection |
|----------|--------|-------------|------------|
| Invert controls | `invertControlsActive = true` → `invertInputControls(input)` applied on each received message | Yes — BattleRoom only | `round_modifiers` (MODIFIER_MAP in `shared/types/roundModifier.ts`) |
| Physics overrides (gravity, surface friction, wall restitution, air resistance) | Applied directly to `state.arena` fields during `resolveModifiers()` | Yes — BattleRoom only | Same |
| Global stat factors (speed, damageMultiplier, damageReduction, spinDecayRate, mass) | Applied via `applyModifierFactors()` per-beyblade on join | Yes — BattleRoom only | Same |
| Rule overrides (burstResistanceOverride, spinDecayRateOverride) | Applied via `applyModifierFactors()` | Yes — BattleRoom only | Same |
| Chaos: randomize stats | Random 0.5–2.0 multiplier on damageMultiplier + spinDecayRate per bey | Yes — BattleRoom only | Same |
| Round modifiers NOT in AIBattleRoom | `modifierIds` option not wired in AIBattleRoom or TournamentBattleRoom | Gap — see Section 5 | — |
| Max active modifiers | Capped at `maxMods` (value in `resolveModifiers()` call) | Yes | — |

---

## 5. Game Mode Gaps

| Missing Mode | Description | Required Work | Priority |
|-------------|-------------|---------------|----------|
| Team Battle (2v2 / 3v3) | BattleRoom is always FFA. No team assignment, no shared-win logic, no friendly-fire toggle | Add `teamId` to Beyblade schema; modify `determineGameWinner` to check last-team-standing; add `teams` option to JoinOptions | High |
| Ranked matchmaking | `state.mode = "single-battle-pvp-ranked"` is set but no ELO calculation, no matchmaking queue, no ranking update in `updatePlayerStats` | Implement ELO / ranking delta on ranked match end; add matchmaking queue system | Medium |
| Round modifiers in AI and Tournament rooms | `resolveModifiers()` and `applyModifierFactors()` only exist in BattleRoom; AIBattleRoom and TournamentBattleRoom do not support `modifierIds` | Extract modifier resolution into shared module; apply in all room types | Medium |
| Spectators-only / broadcast room | No passive-view-only room that shows an ongoing match without the client joining as a Colyseus room member | Add a broadcast/stream relay mode or expand spectator join to be a first-class room type | Low |
| Custom scoring modes beyond elimination | Only last-bey-standing and timer-expiry win conditions exist. No point-accumulation (damage dealt), no survival-time scoring, no multi-KO scoring | Add `scoringMode` option; extend `SeriesManager` with damage-point and survival-time talliers | Low |
| Tryout series / challenge mode | TryoutRoom is always BO1 with no win condition — it only ends on spin-out or idle disconnect | Add optional `challengeMode` to TryoutRoom with target score or obstacle course timing | Low |
| Multi-arena tournament (different arena per round) | TournamentBattleRoom takes a single `arenaId`; bracket system does not cycle arenas per round | Allow per-bracket-slot arena selection in `tournament_brackets` doc; pass through scheduler | Low |
| Quick-match (auto-matchmake PVP) | No matchmaking lobby; players must share a room ID manually or use the lobby page | Build matchmaking queue backed by Colyseus matchmaker or Firestore queue document | Medium |
| Observer stats dashboard | No live spectator stats overlay (damage dealt, collision count, spin remaining per bey) beyond basic bey state | Client-side stats panel reading schema fields already available | Low |

---

## 6. Scoring Modes

| Mode | Description | Schema Fields | Status |
|------|-------------|---------------|--------|
| Elimination | Last active beyblade wins (spin-out / ring-out / timer expiry) | `isActive`, `isRingOut`, `isBurst`, `eliminationType`, `state.timer` | Implemented — all rooms |
| Series wins (BO) | First to `targetWins` game-wins takes the series | `seriesWins`, `targetWins`, `currentGame`, `seriesLeader` | Implemented — all rooms except TryoutRoom |
| Tournament points | Winner +2, draw +1, loss +0, accumulated in `player_stats.tournamentPoints` | `tournamentPoints` (Firestore), `seriesWins` (room) | Implemented — TournamentBattleRoom only |
| Damage-based (not implemented) | Rank players by `damageDealt` at match end | `damageDealt` field exists on Beyblade schema; `totalDamageDealt` in `player_stats` | Schema ready; no scoring mode implemented |
| Survival time (not implemented) | Rank by time alive | No schema field for time-of-elimination | Not implemented |
| Collision count (not implemented) | Rank by `collisions` field | `collisions` field on Beyblade schema | Schema ready; no scoring mode implemented |

---

## 7. Match Config Schema

What configurable options exist per room (compiled from all four room types):

```typescript
interface MatchConfig {
  // Series format
  bestOf: 1 | 3 | 5;

  // Arena
  arenaId: string;
  arenaSystemId?: string;       // Optional 2.5D arena system overlay

  // AI
  aiDifficulty?: "medium" | "hard" | "hell";

  // PVP options
  ranked?: boolean;             // Sets mode to "single-battle-pvp-ranked"
  modifierIds?: string[];       // Round modifiers (BattleRoom only; max capped by resolveModifiers)

  // Tournament-specific
  tournamentId?: string;
  matchId?: string;
  tournamentName?: string;
  roundNumber?: number;
  aiParticipants?: Array<{
    userId: string;
    username: string;
    beybladeId: string;
    difficulty: "medium" | "hard" | "hell";
  }>;

  // AI-vs-AI test mode (AIBattleRoom admin only)
  aiVsAi?: boolean;
  aiP1BeybladeId?: string;
  aiP2BeybladeId?: string;
  aiP1Difficulty?: "medium" | "hard" | "hell";
  aiP2Difficulty?: "medium" | "hard" | "hell";

  // Future (not yet implemented)
  scoringMode?: "elimination" | "points" | "survival";
  teamAssignments?: Record<string, string>;  // userId → teamId
  roundModifiersEnabled?: boolean;           // toggle modifier support per room type
  arenaIdPerRound?: string[];                // per-game arena rotation in a series
}
```

---

## 8. New Room Types Needed

Based on research findings, the following new room types would complete game mode coverage:

| Room Type | Purpose | Priority |
|-----------|---------|----------|
| `team_battle_room` | 2v2 or 3v3 team PVP with shared-win conditions and optional friendly-fire toggle. Extends BattleRoom with `teamId` per player and `determineTeamWinner()` in SeriesManager | High |
| `ranked_match_room` | Dedicated ranked PVP room that gates access via matchmaking queue, applies ELO delta on series end, and writes rank updates to `player_stats`. Extends BattleRoom; keeps the ranked mode string meaningful | Medium |
| `quick_match_room` | Auto-matchmake 1v1 PVP. Players join a lobby queue; Colyseus matchmaker pairs two players into a `quick_match_room` automatically. No lobby page required | Medium |
| `challenge_room` | Solo challenge mode (obstacle course, time trial, or damage target) extending TryoutRoom with a configurable win condition and a results-to-Firestore pipeline | Low |
| `spectator_relay_room` | A lightweight Colyseus room that rebroadcasts a running match's state to unlimited read-only clients without those clients appearing in the source room's spectator count or maxClients limit | Low |
| `points_battle_room` | PVP room where the win condition is accumulated damage dealt (or collision count) rather than last-bey-standing elimination. Uses schema fields `damageDealt` and `collisions` already present | Low |


---

## Implementation Status (audit 2026-05-24)

> **Complete** — 10 room types (TryoutRoom, BattleRoom, AIBattleRoom, TournamentBattleRoom + 2.5D variants + TeamBattle variants). BO1/BO3/BO5 via SeriesManager. Spectator support. Tournament system (scheduler, brackets, walkovers, both-ready early-start). Phase 25 Battle Royale (20-player) not yet implemented.

---

[← Phase 13: Controls](phase-13-controls.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 16: Gap Analysis →](phase-16-gap-analysis.md)

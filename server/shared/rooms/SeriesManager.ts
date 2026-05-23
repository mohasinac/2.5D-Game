// Shared series / win-condition logic. Extracted from the duplicate
// checkWinCondition + resetForNextGame + persistMatch blocks in
// BattleRoom / AIBattleRoom / TournamentBattleRoom (TryoutRoom is BO1 only).
//
// This module is intentionally pure: it takes a state-like object and a
// physics-like callback object, and never touches the Room directly.
// BaseRoom (Phase 2) is responsible for wiring it.

import type { Beyblade, GameState } from "../../rooms/schema/GameState";
import { isSeriesOver as bareIsSeriesOver } from "../utils/seriesFormat";

export interface SeriesPhysicsBridge {
  setPosition(id: string, x: number, y: number): void;
  setLinearVelocity(id: string, vx: number, vy: number): void;
  setAngularVelocity(id: string, omega: number): void;
}

export interface WinDetermination {
  winner: Beyblade | null;
  winnerId: string;
  reason: "last-standing" | "simultaneous-spinout" | "timer";
}

// Decide the winner of the current game.
//   - 1 active bey       → last-standing
//   - 0 active beys      → simultaneous-spinout (no winner)
//   - timer expired >=2  → highest remaining spin
export function determineGameWinner(state: GameState): WinDetermination | null {
  if (state.status !== "in-progress") return null;

  const activeBeyblades: Beyblade[] = [];
  state.beyblades.forEach(b => { if (b.isActive) activeBeyblades.push(b); });
  const timeExpired = state.timer <= 0;

  if (activeBeyblades.length > 1 && !timeExpired) return null;

  let winner: Beyblade | null = null;
  let reason: WinDetermination["reason"];

  if (activeBeyblades.length === 1) {
    winner = activeBeyblades[0];
    reason = "last-standing";
  } else if (activeBeyblades.length === 0) {
    reason = "simultaneous-spinout";
  } else {
    winner = activeBeyblades.reduce((best, b) => (b.spin > best.spin ? b : best), activeBeyblades[0]);
    reason = "timer";
  }

  return { winner, winnerId: winner?.userId ?? "", reason };
}

// Increment series wins for the given winnerId, update seriesLeader, return new total.
export function recordGameWin(state: GameState, winnerId: string): number {
  if (!winnerId) return 0;
  const currentWins = state.seriesWins.get(winnerId) ?? 0;
  const newWins = currentWins + 1;
  state.seriesWins.set(winnerId, newWins);

  let maxWins = 0;
  let leader = "";
  state.seriesWins.forEach((wins, uid) => {
    if (wins > maxWins) { maxWins = wins; leader = uid; }
  });
  state.seriesLeader = leader;

  return newWins;
}

export function buildSeriesScore(state: GameState): Record<string, number> {
  const out: Record<string, number> = {};
  state.seriesWins.forEach((wins, uid) => { out[uid] = wins; });
  return out;
}

export function isSeriesOver(state: GameState): boolean {
  // Any player reaching targetWins ends the series.
  return bareIsSeriesOver(state.seriesWins.values(), state.targetWins);
}

// Reset a single beyblade for the next game in the series. No Firestore reads.
// Caller passes the spawn position cached from initial join.
export function resetBeybladeForNextGame(
  beyblade: Beyblade,
  spawn: { x: number; y: number } | undefined,
  physics: SeriesPhysicsBridge,
): void {
  beyblade.isActive = true;
  beyblade.isRingOut = false;
  beyblade.isBurst = false;
  beyblade.eliminationType = "";
  beyblade.health = beyblade.maxStamina;
  beyblade.maxHealth = beyblade.maxStamina;
  beyblade.spin = beyblade.maxSpin;
  beyblade.stamina = beyblade.maxStamina;
  beyblade.power = 0;
  beyblade.attackCooldown = 0;
  beyblade.specialCooldown = 0;
  beyblade.attackBuffTimer = 0;
  beyblade.dodgeBuffTimer = 0;
  beyblade.defenseBuffTimer = 0;
  beyblade.isAirborne = false;
  beyblade.airborneTimer = 0;
  beyblade.landingLag = 0;
  beyblade.inPit = false;
  beyblade.currentPitId = "";
  beyblade.pitDamageRate = 0;
  beyblade.inWater = false;
  beyblade.waterSpeedMultiplier = 1.0;
  beyblade.waterSpinDrain = 0;
  beyblade.inLoop = false;
  beyblade.loopIndex = -1;
  beyblade.loopSpeedBoost = 1.0;
  beyblade.loopSpinBoost = 0;
  beyblade.isDefending = false;
  beyblade.isInvulnerable = false;
  beyblade.invulnerabilityTimer = 0;
  beyblade.stunTimer = 0;
  beyblade.comboExecuting = false;
  beyblade.comboTimer = 0;
  beyblade.collidingWithObstacle = false;
  beyblade.lastObstacleId = "";

  if (spawn) {
    beyblade.x = spawn.x;
    beyblade.y = spawn.y;
    physics.setPosition(beyblade.id, spawn.x, spawn.y);
    physics.setLinearVelocity(beyblade.id, 0, 0);
    physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "right" ? 50 : -50);
  }
}

// Reset every beyblade in the state for the next game, plus the per-game state fields.
export function resetStateForNextGame(
  state: GameState,
  spawnPositions: Map<string, { x: number; y: number }>,
  physics: SeriesPhysicsBridge,
  warmupSeconds = 180,
): void {
  state.currentGame++;
  state.status = "warmup";
  state.timer = warmupSeconds;
  state.winner = "";

  state.beyblades.forEach(beyblade => {
    resetBeybladeForNextGame(beyblade, spawnPositions.get(beyblade.id), physics);
  });
}

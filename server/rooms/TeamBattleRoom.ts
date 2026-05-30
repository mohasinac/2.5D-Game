// [SERVER-ROOM] TeamBattleRoom — 2v2 team battles with switchable beys.
// Each team has up to 2 beys; a player can "possess" (transfer control to) a
// different team bey using the spatial possession mechanic (specialTap + direction).
//
// Extends BattleRoom — re-uses all physics, combo, and timeline logic.

import { BattleRoom } from "./BattleRoom";
import { Client } from "colyseus";
import type { PlayerInput } from "../shared/utils/bitmask";
import type { Beyblade } from "./schema/GameState";
import { buildSeriesScore, isSeriesOver } from "../shared/rooms/SeriesManager";

interface TeamJoinOptions {
  beybladeId: string;
  teamBeybladeIds?: string[];   // additional bey ids for this player's team (max 3 extra)
  arenaId: string;
  arenaSystemId?: string;
  userId: string;
  username: string;
  team: "red" | "blue";
  spectate?: boolean;
  bestOf?: 1 | 3 | 5;
  modifierIds?: string[];
}

// Maps sessionId → team
const teamMap = new Map<string, "red" | "blue">();
// Maps sessionId → currently controlled beyId (could be any team bey)
const controlledBey = new Map<string, string>();
// Maps beyId → ownerSessionId (who spawned this bey)
const beyOwner = new Map<string, string>();

// #27: Burst recall state — maps fragmentId → recall data
interface RecallEntry {
  beyId: string;
  teamId: "red" | "blue";
  fragmentId: string;
  createdAt: number;
  expiresAt: number;
  /** teammateId → timestamp when they started standing over fragment.
   *  Keys prefixed with "destroy_" track opponent destruction timers. */
  recallStartMs: Map<string, number>;
}

// Active burst-recall fragments across all team battle rooms
const recallEntries = new Map<string, RecallEntry>(); // fragmentId → RecallEntry

export class TeamBattleRoom extends BattleRoom {
  // Override maxClients for team format (2×2 players + spectators)
  maxClients = 12;

  async onJoin(client: Client, options: TeamJoinOptions) {
    if (options.spectate) {
      await super.onJoin(client, options as unknown as Parameters<BattleRoom["onJoin"]>[1]);
      return;
    }

    // Let BattleRoom handle the primary bey spawn
    await super.onJoin(client, options as unknown as Parameters<BattleRoom["onJoin"]>[1]);

    teamMap.set(client.sessionId, options.team ?? "blue");
    controlledBey.set(client.sessionId, client.sessionId); // control own bey by default
    beyOwner.set(client.sessionId, client.sessionId);

    this.broadcast("team-joined", {
      sessionId: client.sessionId,
      username: options.username,
      team: options.team ?? "blue",
    });
  }

  onLeave(client: Client, consented: boolean) {
    teamMap.delete(client.sessionId);
    controlledBey.delete(client.sessionId);
    beyOwner.delete(client.sessionId);
    return super.onLeave(client, consented);
  }

  // #23: Support proximity bonus (Fire Emblem GBA) ────────────────────────────
  private static readonly SUPPORT_RADIUS = 120; // px

  protected override tick(dt: number): void {
    super.tick(dt);
    this.tickSupportProximity(dt);
    this.tickBurstRecall();
  }

  private tickSupportProximity(dt: number): void {
    // Reset support damage reduction for all beys each tick
    this.state.beyblades.forEach(bey => { bey._supportDmgReduction = 0; });

    // For each active bey, check if any same-team bey is within SUPPORT_RADIUS
    this.state.beyblades.forEach((bey, sid) => {
      if (!bey.isActive) return;
      const myTeam = teamMap.get(beyOwner.get(sid) ?? sid) ?? null;
      if (!myTeam) return;

      this.state.beyblades.forEach((teammate, tid) => {
        if (tid === sid || !teammate.isActive) return;
        const tmTeam = teamMap.get(beyOwner.get(tid) ?? tid) ?? null;
        if (tmTeam !== myTeam) return;

        const dist = Math.hypot(bey.x - teammate.x, bey.y - teammate.y);
        if (dist < TeamBattleRoom.SUPPORT_RADIUS) {
          const bonus = 1 - dist / TeamBattleRoom.SUPPORT_RADIUS;
          // Spin regen from nearby teammate
          bey.spin = Math.min(bey.maxSpin, bey.spin + 0.5 * bonus * dt);
          // Accumulate damage reduction (capped at 8%)
          bey._supportDmgReduction = Math.min(0.08, bey._supportDmgReduction + 0.08 * bonus);
          // Broadcast support-active (throttled: only first pair per tick is fine)
          this.broadcast("support-active", { beyId: bey.id, teammateId: teammate.id, bonus });
        }
      });
    });
  }

  // #27: Burst recall ─────────────────────────────────────────────────────────

  /**
   * Intercept a burst before it eliminates the victim.  If the victim still has
   * a recall charge available, freeze the fragment and start a 15-second recall
   * window for teammates.  Returns `true` (consumed) to suppress default elimination.
   */
  protected override onBurstOccurred(victim: Beyblade, _attacker: Beyblade): boolean {
    // Each bey may only be recalled once per match
    if (victim.recallUsed) return false;

    const ownerSid = beyOwner.get(victim.id) ?? victim.id;
    const team = teamMap.get(ownerSid);
    if (!team) return false;

    // Only intercept if there is at least one active teammate to do the recall
    let hasTeammate = false;
    this.state.beyblades.forEach((bey, sid) => {
      if (hasTeammate || sid === victim.id || !bey.isActive) return;
      if (teamMap.get(beyOwner.get(sid) ?? sid) === team) hasTeammate = true;
    });
    if (!hasTeammate) return false;

    // Mark as pending — client renders it as a dim fragment
    victim.isBurstPending = true;
    // Freeze the fragment so it stays at its burst position
    this.physics.setLinearVelocity(victim.id, 0, 0);
    // Minimal spin so it reads as alive in Colyseus state
    victim.spin = victim.maxSpin * 0.03;

    const fragmentId = `${victim.id}-recall`;
    const now = Date.now();
    recallEntries.set(fragmentId, {
      beyId: victim.id,
      teamId: team,
      fragmentId,
      createdAt: now,
      expiresAt: now + 15_000,
      recallStartMs: new Map(),
    });

    this.broadcast("burst-recall-start", { fragmentId, beyId: victim.id, teamId: team });
    return true; // consumed — skip default burst elimination
  }

  /** Per-tick recall logic: teammate proximity check, expiry, and opponent destruction. */
  private tickBurstRecall(): void {
    if (recallEntries.size === 0) return;
    const now = Date.now();

    const RECALL_RADIUS = 60;        // px — teammate must stand within this distance
    const RECALL_DURATION_MS = 2000; // ms — continuous proximity required for recall
    const DESTROY_RADIUS = 60;       // px — opponent must overlap fragment to destroy it
    const DESTROY_DURATION_MS = 1000; // ms — continuous overlap required to destroy fragment

    recallEntries.forEach((entry, fragmentId) => {
      const victim = this.state.beyblades.get(entry.beyId);
      if (!victim || !victim.isBurstPending) {
        recallEntries.delete(fragmentId);
        return;
      }

      // ── 1. Fragment expiry ───────────────────────────────────────────────────
      if (now >= entry.expiresAt) {
        victim.isBurstPending = false;
        victim.isActive = false;
        victim.isBurst = true;
        victim.eliminationType = "burst";
        victim.spin = 0;
        this.broadcast("burst", {
          beyId: victim.id,
          x: victim.x,
          y: victim.y,
        });
        recallEntries.delete(fragmentId);
        return;
      }

      // ── 2. Teammate recall proximity ────────────────────────────────────────
      let recalled = false;
      this.state.beyblades.forEach((bey, sid) => {
        if (recalled) return;
        if (sid === entry.beyId || !bey.isActive) return;
        const ownerSid = beyOwner.get(sid) ?? sid;
        if (teamMap.get(ownerSid) !== entry.teamId) return;

        const dist = Math.hypot(bey.x - victim.x, bey.y - victim.y);
        if (dist < RECALL_RADIUS) {
          if (!entry.recallStartMs.has(sid)) entry.recallStartMs.set(sid, now);
          const elapsed = now - (entry.recallStartMs.get(sid) ?? now);
          if (elapsed >= RECALL_DURATION_MS) {
            // ── Recall complete ──────────────────────────────────────────────
            victim.isBurstPending = false;
            victim.recallUsed = true;
            victim.spin = victim.maxSpin * 0.30;
            victim.power = 20;
            victim.controlAuthority = Math.max(50, victim.controlAuthority);
            recallEntries.delete(fragmentId);
            this.broadcast("burst-recall-complete", { beyId: victim.id, revivedBy: bey.id });
            recalled = true;
          }
        } else {
          // Out of range — reset this teammate's timer
          entry.recallStartMs.delete(sid);
        }
      });
      if (recalled) return;

      // ── 3. Opponent fragment destruction (spin over it for 1s) ─────────────
      if (!recallEntries.has(fragmentId)) return;
      this.state.beyblades.forEach((bey, sid) => {
        if (recalled) return;
        if (sid === entry.beyId || !bey.isActive) return;
        const ownerSid = beyOwner.get(sid) ?? sid;
        // Opponent only
        if (teamMap.get(ownerSid) === entry.teamId) return;

        const dist = Math.hypot(bey.x - victim.x, bey.y - victim.y);
        const destroyKey = `destroy_${sid}`;
        if (dist < DESTROY_RADIUS) {
          if (!entry.recallStartMs.has(destroyKey)) entry.recallStartMs.set(destroyKey, now);
          const elapsed = now - (entry.recallStartMs.get(destroyKey) ?? now);
          if (elapsed >= DESTROY_DURATION_MS) {
            // Fragment destroyed by opponent
            victim.isBurstPending = false;
            victim.isActive = false;
            victim.isBurst = true;
            victim.eliminationType = "burst";
            victim.spin = 0;
            this.broadcast("burst", { beyId: victim.id, x: victim.x, y: victim.y });
            this.broadcast("burst-recall-destroyed", { fragmentId });
            recallEntries.delete(fragmentId);
            recalled = true;
          }
        } else {
          entry.recallStartMs.delete(destroyKey);
        }
      });
    });
  }

  /**
   * Spatial possession: transfer control to the nearest team bey in a 60° cone
   * centered on the given direction. Only beys owned by this player's team are
   * eligible. Control is seamless — effective next tick.
   */
  protected handleSpatialPossession(
    sessionId: string,
    direction: "left" | "right" | "up" | "down"
  ): void {
    const team = teamMap.get(sessionId);
    if (!team) return;

    const controlBeyId = controlledBey.get(sessionId) ?? sessionId;
    const mover = this.state.beyblades.get(controlBeyId);
    if (!mover) return;

    // Direction vector
    const dirVec = {
      left:  { x: -1, y: 0 },
      right: { x:  1, y: 0 },
      up:    { x:  0, y: -1 },
      down:  { x:  0, y:  1 },
    }[direction];

    const CONE_HALF_ANGLE = Math.PI / 3; // 60°
    let bestSid: string | null = null;
    let bestDist = Infinity;

    this.state.beyblades.forEach((bey, sid) => {
      if (sid === controlBeyId) return;
      if (!bey.isActive) return;
      // Must be a bey belonging to the same team
      if (teamMap.get(beyOwner.get(sid) ?? "") !== team) return;
      // Must not already be controlled by another player
      const alreadyControlled = Array.from(controlledBey.values()).some(
        cid => cid === sid && cid !== controlBeyId
      );
      if (alreadyControlled) return;

      const dx = bey.x - mover.x;
      const dy = bey.y - mover.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return;

      // Check 60° cone
      const nx = dx / dist, ny = dy / dist;
      const dot = nx * dirVec.x + ny * dirVec.y;
      if (dot < Math.cos(CONE_HALF_ANGLE)) return;

      if (dist < bestDist) { bestDist = dist; bestSid = sid; }
    });

    if (bestSid) {
      controlledBey.set(sessionId, bestSid);
      this.broadcast("possession-transferred", {
        sessionId,
        fromBeyId: controlBeyId,
        toBeyId: bestSid,
      });
    }
  }

  /**
   * Override handleInput to redirect to controlled bey and detect possession combos.
   * specialTap + direction key → spatial possession instead of special move.
   */
  protected handleInput(client: Client, input: PlayerInput): void {
    const sessionId = client.sessionId;

    // Check for spatial possession gesture: specialTap + movement direction
    if (input.specialTap) {
      const dir =
        input.moveLeft  ? "left"  :
        input.moveRight ? "right" :
        input.moveUp    ? "up"    :
        input.moveDown  ? "down"  : null;
      if (dir) {
        this.handleSpatialPossession(sessionId, dir as "left" | "right" | "up" | "down");
        // Consume the input — do not fire special move
        return;
      }
    }

    // Remap input to the currently controlled bey
    const targetBeyId = controlledBey.get(sessionId) ?? sessionId;
    if (targetBeyId !== sessionId) {
      // Temporarily redirect: create a fake client with targetBeyId as sessionId
      // We do this by calling the parent handleInput with a proxied client object
      const proxyClient = { ...client, sessionId: targetBeyId };
      super.handleInput(proxyClient as Client, input);
      return;
    }

    super.handleInput(client, input);
  }

  // ─── Team win condition ───────────────────────────────────────────────────

  protected override checkWinCondition(): void {
    if (this.state.status !== "in-progress") return;

    // Count active beyblades per team
    const activeCounts: Record<"red" | "blue", number> = { red: 0, blue: 0 };
    const spinSums: Record<"red" | "blue", number> = { red: 0, blue: 0 };
    this.state.beyblades.forEach((bey, sid) => {
      const ownerSid = beyOwner.get(sid) ?? sid;
      const team = teamMap.get(ownerSid);
      if (!team) return;
      if (bey.isActive) {
        activeCounts[team]++;
        spinSums[team] += bey.spin;
      }
    });

    const allActive = activeCounts.red + activeCounts.blue;
    const timeExpired = this.state.timer <= 0;

    // Need at least one team fully eliminated (or timer expired) to decide
    if (activeCounts.red > 0 && activeCounts.blue > 0 && !timeExpired) return;

    let winnerTeam: "red" | "blue" | null = null;
    let reason: string;

    if (activeCounts.red === 0 && activeCounts.blue === 0) {
      reason = "simultaneous-spinout";
    } else if (activeCounts.red === 0) {
      winnerTeam = "blue";
      reason = "last-standing";
    } else if (activeCounts.blue === 0) {
      winnerTeam = "red";
      reason = "last-standing";
    } else {
      // Timer expired — team with more survivors wins; tie → higher total spin
      if (activeCounts.red > activeCounts.blue) {
        winnerTeam = "red";
      } else if (activeCounts.blue > activeCounts.red) {
        winnerTeam = "blue";
      } else {
        winnerTeam = spinSums.red >= spinSums.blue ? "red" : "blue";
      }
      reason = "timer";
    }

    // Record win using team color as the key
    if (winnerTeam) {
      const current = this.state.seriesWins.get(winnerTeam) ?? 0;
      this.state.seriesWins.set(winnerTeam, current + 1);
      this.state.seriesLeader = winnerTeam;
    }

    const seriesScore = buildSeriesScore(this.state);
    const seriesOver = winnerTeam
      ? (this.state.seriesWins.get(winnerTeam) ?? 0) >= this.state.targetWins
      : false;

    if (seriesOver) {
      this.state.status = "series-finished";
      this.state.winner = winnerTeam ?? "";
      this.broadcast("series-end", { winnerTeam, seriesScore, reason });
      setTimeout(() => this.disconnect(), 5000);
    } else {
      this.state.status = "finished";
      this.state.winner = winnerTeam ?? "";
      this.broadcast("game-end", { winnerTeam, gameNumber: this.state.currentGame, seriesScore, reason });
      setTimeout(() => this.resetForNextGame(), 3000);
    }
  }
}

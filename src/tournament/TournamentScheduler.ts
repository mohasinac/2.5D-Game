import type { Server } from "colyseus";
import {
  getUpcomingPendingMatches,
  getStaleRoomOpeningMatches,
  loadTournamentSettings,
  loadGlobalSettings,
  updateMatchStatus,
  updateBracketWinner,
  updateTournamentStatus,
  updateParticipantStatus,
  getParticipantsForTournament,
  getRoundMatchesForTournament,
  type TournamentMatchDoc,
  type TournamentDoc,
} from "../utils/tournamentFirebase";
import { advanceWinnerToNextRound } from "./BracketGenerator";
import { autoPickBeyblade } from "./AutoPickBeyblade";
import { getActiveRoomCount } from "../utils/roomCounter";
import { TournamentBattleRoom } from "../rooms/TournamentBattleRoom";

// TournamentScheduler — singleton that polls Firestore every 30 seconds and
// opens Colyseus rooms for bracket matches approaching their scheduled time.
// Must be started once in src/index.ts after gameServer.define() calls.

const POLL_INTERVAL_MS = 30_000;
const LOOK_AHEAD_MS = 65_000; // open rooms 65 s before scheduled time

export class TournamentScheduler {
  private gameServer: Server | null = null;
  private timer: NodeJS.Timeout | null = null;

  start(gameServer: Server): void {
    this.gameServer = gameServer;
    // On startup, reset any stale "room-opening" docs from a previous process crash
    this.resetStaleRoomOpeningDocs().catch(console.error);
    this.timer = setInterval(() => { this.poll().catch(console.error); }, POLL_INTERVAL_MS);
    console.log("[TournamentScheduler] Started — polling every 30s");
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // ─── Startup stale-room reset ──────────────────────────────────────────────

  private async resetStaleRoomOpeningDocs(): Promise<void> {
    try {
      const stale = await getStaleRoomOpeningMatches();
      for (const match of stale) {
        console.warn(`[TournamentScheduler] Resetting stale room-opening match ${match.id}`);
        await updateMatchStatus(match.id, { status: "pending" });
      }
    } catch (err) {
      console.error("[TournamentScheduler] Error resetting stale docs:", err);
    }
  }

  // ─── Poll ──────────────────────────────────────────────────────────────────

  private async poll(): Promise<void> {
    if (!this.gameServer) return;

    // Check stale room-opening matches (process crash guard)
    const staleMatches = await getStaleRoomOpeningMatches();
    for (const match of staleMatches) {
      console.warn(`[TournamentScheduler] Stale match ${match.id} — marking completed (walkover)`);
      await updateMatchStatus(match.id, { status: "completed", winnerId: null });
    }

    if (getActiveRoomCount() >= 20) {
      console.warn("[TournamentScheduler] Room cap reached — skipping match-open this poll cycle");
      return;
    }

    const upcomingMatches = await getUpcomingPendingMatches(LOOK_AHEAD_MS);
    for (const match of upcomingMatches) {
      await this.openRoomForMatch(match).catch((err) => {
        console.error(`[TournamentScheduler] Failed to open room for match ${match.id}:`, err);
      });
    }
  }

  // ─── Open room for a bracket match ────────────────────────────────────────

  private async openRoomForMatch(match: TournamentMatchDoc): Promise<void> {
    if (!this.gameServer) return;

    // Re-check capacity per match (in case multiple matches open in same poll)
    if (getActiveRoomCount() >= 20) return;

    // Load tournament config for restrictions + format
    const tournament = match.tournamentId
      ? await loadTournamentSettings(match.tournamentId)
      : null;

    const globalSettings = await loadGlobalSettings();
    const globalBlacklist = globalSettings?.globalBeybladeBlacklist ?? [];
    const tournamentAllowedIds = tournament?.allowedBeybladeIds ?? [];
    const tournamentDisabledIds = tournament?.disabledBeybladeIds ?? [];
    const aiDifficulty = (tournament?.aiDifficulty as any) ?? "medium";
    const bestOf = (tournament?.bestOf as 1 | 3 | 5) ?? 1;

    // Load participant docs to get userId, beybladeId, isAI
    const participants = match.tournamentId
      ? await getParticipantsForTournament(match.tournamentId)
      : [];

    const p1Doc = participants.find(p => p.id === match.participant1Id);
    const p2Doc = participants.find(p => p.id === match.participant2Id);

    if (!p1Doc || !p2Doc) {
      console.warn(`[TournamentScheduler] Missing participants for match ${match.id}`);
      return;
    }

    // Resolve beybladeIds (auto-pick if missing or blacklisted)
    const alreadyPicked: string[] = [];

    const p1BeybladeId = await this.resolveBeybladeId(
      p1Doc.beybladeId,
      tournamentAllowedIds,
      tournamentDisabledIds,
      globalBlacklist,
      alreadyPicked,
      `${match.id}_${p1Doc.id}`
    );
    alreadyPicked.push(p1BeybladeId);

    const p2BeybladeId = await this.resolveBeybladeId(
      p2Doc.beybladeId,
      tournamentAllowedIds,
      tournamentDisabledIds,
      globalBlacklist,
      alreadyPicked,
      `${match.id}_${p2Doc.id}`
    );

    // Determine arena
    const arenaId = match.arenaId || "default";

    // Build room options
    const roomOptions: any = {
      tournamentId: match.tournamentId,
      tournamentName: tournament?.name ?? "",
      matchId: match.id,
      roundNumber: match.round,
      arenaId,
      bestOf,
    };

    // Build AI participants list for TournamentBattleRoom.onCreate
    const aiParticipants: Array<{ userId: string; username: string; beybladeId: string; difficulty: any }> = [];
    if (p1Doc.isAI) {
      aiParticipants.push({ userId: p1Doc.userId, username: p1Doc.username, beybladeId: p1BeybladeId, difficulty: aiDifficulty });
    }
    if (p2Doc.isAI) {
      aiParticipants.push({ userId: p2Doc.userId, username: p2Doc.username, beybladeId: p2BeybladeId, difficulty: aiDifficulty });
    }

    if (aiParticipants.length > 0) {
      roomOptions.aiParticipants = aiParticipants;
    }

    // Mark as room-opening before creating (prevents double-create on next poll)
    await updateMatchStatus(match.id, {
      status: "room-opening",
      participant1BeybladeId: p1BeybladeId,
      participant2BeybladeId: p2BeybladeId,
    });

    // Create the Colyseus room
    let room: TournamentBattleRoom;
    try {
      room = await this.gameServer.createRoom("tournament_battle_room", roomOptions) as TournamentBattleRoom;
    } catch (err) {
      // Roll back status on creation failure
      await updateMatchStatus(match.id, { status: "pending" });
      throw err;
    }

    // Wire up the onMatchEnd callback so TournamentBattleRoom can call back here
    room.onMatchEnd = (winnerId: string, matchFirestoreId: string) => {
      this.advanceRound(match.tournamentId, match.id, match.round, match.matchNumber, winnerId, matchFirestoreId)
        .catch(console.error);
    };

    // Write colyseusRoomId back to Firestore — clients listening to this doc will auto-navigate
    await updateMatchStatus(match.id, {
      status: "in-progress",
      colyseusRoomId: room.roomId,
    });

    console.log(`✅ [TournamentScheduler] Opened room ${room.roomId} for match ${match.id}`);
  }

  // ─── Advance winner to next round ─────────────────────────────────────────

  async advanceRound(
    tournamentId: string,
    completedMatchId: string,
    completedRound: number,
    completedMatchNumber: number,
    winnerId: string,
    matchFirestoreId: string
  ): Promise<void> {
    try {
      // Resolve winnerId (beyblade.userId = Firebase auth UID) → participant doc ID.
      // advanceWinnerToNextRound writes into participant1Id/participant2Id fields,
      // and openRoomForMatch later looks up participants by p.id (doc ID), so we
      // must use the doc ID here or all subsequent round lookups will fail silently.
      const participants = await getParticipantsForTournament(tournamentId);
      const winnerParticipant = participants.find(p => p.userId === winnerId || p.id === winnerId);
      const winnerParticipantId = winnerParticipant?.id ?? winnerId;

      // Persist winner on bracket doc
      await updateBracketWinner(completedMatchId, winnerParticipantId, matchFirestoreId);

      // Advance winner's participant doc to next round bracket slot
      const nextMatchId = await advanceWinnerToNextRound(
        tournamentId,
        completedMatchId,
        completedRound,
        completedMatchNumber,
        winnerParticipantId
      );

      if (!nextMatchId) {
        // No next match — this was the final; determine if tournament is complete
        await this.checkTournamentCompletion(tournamentId, winnerId);
      }

      // Update participant status
      if (winnerParticipant) {
        await updateParticipantStatus(winnerParticipant.id, "registered"); // stays registered until final
      }

      // Mark losers as eliminated — compare using participant doc IDs
      const completedRoundMatches = await getRoundMatchesForTournament(tournamentId, completedRound);
      const completedMatch = completedRoundMatches.find(m => m.id === completedMatchId);
      if (completedMatch) {
        const loserId = completedMatch.participant1Id === winnerParticipantId
          ? completedMatch.participant2Id
          : completedMatch.participant1Id;
        if (loserId && loserId !== "__bye__") {
          const loser = participants.find(p => p.id === loserId);
          if (loser) await updateParticipantStatus(loser.id, "eliminated");
        }
      }

      console.log(`✅ [TournamentScheduler] Advanced winner ${winnerId} in tournament ${tournamentId}`);
    } catch (err) {
      console.error("[TournamentScheduler] Error advancing round:", err);
    }
  }

  // ─── Check if all rounds complete ─────────────────────────────────────────

  private async checkTournamentCompletion(tournamentId: string, finalWinnerId: string): Promise<void> {
    try {
      const participants = await getParticipantsForTournament(tournamentId);
      const winner = participants.find(p => p.userId === finalWinnerId || p.id === finalWinnerId);
      if (winner) {
        await updateParticipantStatus(winner.id, "winner");
        await updateTournamentStatus(tournamentId, "completed", {
          winnerId: winner.userId,
          winnerUsername: winner.username,
        });
        console.log(`🏆 [TournamentScheduler] Tournament ${tournamentId} completed. Winner: ${winner.username}`);
      }
    } catch (err) {
      console.error("[TournamentScheduler] Error completing tournament:", err);
    }
  }

  // ─── Resolve beybladeId (auto-pick if needed) ─────────────────────────────

  private async resolveBeybladeId(
    registeredId: string,
    allowedIds: string[],
    disabledIds: string[],
    globalBlacklist: string[],
    alreadyPicked: string[],
    seed: string
  ): Promise<string> {
    const combined = new Set([...disabledIds, ...globalBlacklist]);
    // If registered ID is valid and not disabled, use it
    if (registeredId && !combined.has(registeredId)) {
      return registeredId;
    }
    // Otherwise auto-pick
    return autoPickBeyblade({
      tournamentAllowedIds: allowedIds,
      tournamentDisabledIds: disabledIds,
      globalBlacklist,
      alreadyPickedInMatch: alreadyPicked,
      seed,
    });
  }
}

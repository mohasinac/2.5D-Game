import { matchMaker } from "@colyseus/core";
import {
  getUpcomingPendingMatches,
  getReadyPendingMatches,
  getStaleRoomOpeningMatches,
  loadTournamentSettings,
  loadGlobalSettings,
  updateMatchStatus,
  updateBracketWinner,
  updateTournamentStatus,
  updateParticipantStatus,
  getParticipantsForTournament,
  getRoundMatchesForTournament,
  getRegistrationTournaments,
  padWithAIParticipants,
  cancelTournament,
  getPendingMatchesForTournament,
  type TournamentMatchDoc,
  type TournamentDoc,
  type TournamentParticipantDoc,
} from "../utils/tournamentFirebase";
import { writeBracketToFirestore, advanceWinnerToNextRound } from "./BracketGenerator";
import { autoPickBeyblade } from "./AutoPickBeyblade";
import { getActiveRoomCount } from "../utils/roomCounter";
import { TournamentBattleRoom } from "../rooms/TournamentBattleRoom";

// TournamentScheduler — singleton that polls Firestore every 30 seconds and
// opens Colyseus rooms for bracket matches approaching their scheduled time.
// Must be started once in src/index.ts after gameServer.define() calls.

const POLL_INTERVAL_MS = 30_000;
const LOOK_AHEAD_MS = 65_000; // open rooms 65 s before scheduled time
/** Minimum gap between consecutive bracket matches for a single tournament. */
const BETWEEN_MATCH_GAP_MS = 5 * 60_000;
/** Grace window after scheduledTime before a not-ready human walks over. */
const NO_SHOW_GRACE_MS = 60_000;
/** Default minimum participants when tournament omits the field. */
const DEFAULT_MIN_PARTICIPANTS = 2;

export class TournamentScheduler {
  private timer: NodeJS.Timeout | null = null;

  start(): void {
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

    // Walkover sweep: if a participant has quit, advance their opponent immediately.
    await this.processQuitWalkovers().catch(console.error);

    // Tournament-level sweeps — finalise registration when the deadline has passed
    // OR every registered participant has flipped their tournament-level ready flag.
    await this.processRegistrationFinalisation().catch(console.error);

    // Merge two pools — scheduled + ready-now. Ready matches are opened regardless
    // of scheduledTime (the 5-min between-match gap can be skipped when BOTH players
    // explicitly Ready). De-dupe by match id.
    const [upcoming, ready] = await Promise.all([
      getUpcomingPendingMatches(LOOK_AHEAD_MS),
      getReadyPendingMatches(),
    ]);
    const seen = new Set<string>();
    const queue: TournamentMatchDoc[] = [];
    for (const m of [...ready, ...upcoming]) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      queue.push(m);
    }

    for (const match of queue) {
      await this.openRoomForMatch(match).catch((err) => {
        console.error(`[TournamentScheduler] Failed to open room for match ${match.id}:`, err);
      });
    }
  }

  // ─── Registration finalisation sweep ───────────────────────────────────────
  // Triggers bracket generation when either:
  //   (a) registrationDeadline has passed, or
  //   (b) every registered (non-AI) participant has set ready=true.
  // Cancels the tournament if participant count is below minParticipants at deadline.

  private async processRegistrationFinalisation(): Promise<void> {
    try {
      const tournaments = await getRegistrationTournaments();
      if (tournaments.length === 0) return;
      const now = Date.now();
      for (const t of tournaments) {
        const min = t.minParticipants ?? DEFAULT_MIN_PARTICIPANTS;
        const deadlineMs = t.registrationDeadline?.toMillis?.() ?? Infinity;
        const participants = await getParticipantsForTournament(t.id);
        const registered = participants.filter((p) => p.status === "registered");

        const deadlinePassed = now >= deadlineMs;
        // AI is always considered ready; only non-AI participants need to flip the flag.
        const allReady =
          registered.length >= min &&
          registered.every((p) => p.isAI || p.ready === true);

        if (!deadlinePassed && !allReady) continue;

        if (deadlinePassed && registered.length < min) {
          console.log(
            `[TournamentScheduler] Cancelling ${t.id} — only ${registered.length}/${min} registered at deadline`
          );
          await cancelTournament(
            t.id,
            `Insufficient participants at deadline (${registered.length}/${min}).`
          );
          continue;
        }

        // startNow=true whenever all players are ready — even if the deadline has
        // already passed — so nobody waits for a future scheduledStartTime unnecessarily.
        await this.finaliseRegistration(t, participants, /* startNow */ allReady);
      }
    } catch (err) {
      console.error("[TournamentScheduler] Registration finalisation failed:", err);
    }
  }

  /**
   * Generate the bracket and flip the tournament to "in-progress". If startNow is
   * true (all-ready early-start path), round-1 matches are scheduled at `now` so the
   * existing 65s look-ahead picks them up on the very next poll cycle. Otherwise the
   * bracket honours the tournament's scheduledStartTime.
   */
  private async finaliseRegistration(
    tournament: TournamentDoc,
    participants: TournamentParticipantDoc[],
    startNow: boolean
  ): Promise<void> {
    let pool = participants.filter((p) => p.status === "registered");
    if (tournament.autoFillWithAI && pool.length < tournament.maxParticipants) {
      pool = (await padWithAIParticipants(tournament, pool)).filter((p) => p.status === "registered");
    }

    // If startNow was requested, override the tournament's scheduledStartTime
    // in-memory so BracketGenerator produces round-1 matches at now.
    const effectiveTournament: TournamentDoc = startNow
      ? {
          ...tournament,
          scheduledStartTime: {
            toDate: () => new Date(Date.now()),
            toMillis: () => Date.now(),
          } as any,
        }
      : tournament;

    // Pick a random arena from the allowed list so different bracket matches
    // don't all land on the same arena (index-0 selection was dead code before).
    const arenaPool = tournament.allowedArenaIds;
    const defaultArenaId = arenaPool?.length
      ? arenaPool[Math.floor(Math.random() * arenaPool.length)]
      : "default";

    await writeBracketToFirestore(effectiveTournament, pool, defaultArenaId);
    await updateTournamentStatus(tournament.id, "in-progress");
    console.log(
      `[TournamentScheduler] Finalised ${tournament.id} (startNow=${startNow}, participants=${pool.length})`
    );
  }

  // ─── Walkover sweep — opponent advances when a participant has quit ────────

  private async processQuitWalkovers(): Promise<void> {
    try {
      const pending = await getUpcomingPendingMatches(24 * 60 * 60 * 1000); // 24h horizon
      const tournamentIds = Array.from(new Set(pending.map(m => m.tournamentId)));
      for (const tid of tournamentIds) {
        const participants = await getParticipantsForTournament(tid);
        const quitIds = new Set(participants.filter(p => p.status === "quit").map(p => p.id));
        if (quitIds.size === 0) continue;
        for (const match of pending.filter(m => m.tournamentId === tid)) {
          const p1Quit = quitIds.has(match.participant1Id);
          const p2Quit = quitIds.has(match.participant2Id);
          if (!p1Quit && !p2Quit) continue;
          // Both quit → just complete the match with no winner.
          // One quit → opponent walks over.
          const winnerParticipantId = p1Quit && p2Quit ? "" : (p1Quit ? match.participant2Id : match.participant1Id);
          console.log(`[TournamentScheduler] Walkover on match ${match.id}: winner participant=${winnerParticipantId}`);
          await updateMatchStatus(match.id, { status: "completed", winnerId: winnerParticipantId || null });
          if (winnerParticipantId) {
            await this.advanceRound(match.tournamentId, match.id, match.round, match.matchNumber, winnerParticipantId, "");
          } else {
            // Both participants quit — no winner to advance; still check if humans remain
            await this.checkHumanPlayersRemaining(match.tournamentId).catch(console.error);
          }
        }
      }
    } catch (err) {
      console.error("[TournamentScheduler] Walkover sweep failed:", err);
    }
  }

  // ─── Open room for a bracket match ────────────────────────────────────────

  private async openRoomForMatch(match: TournamentMatchDoc): Promise<void> {
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

    // No-show walkover — past scheduledTime by NO_SHOW_GRACE_MS without a human
    // participant having flipped ready in either the per-match readyState or their
    // tournament-level participant.ready flag. AI participants are always present.
    const scheduledMs = match.scheduledTime?.toMillis?.() ?? 0;
    const pastGrace = Date.now() > scheduledMs + NO_SHOW_GRACE_MS;
    const readyState = match.readyState ?? {};
    const isPresent = (p: TournamentParticipantDoc): boolean =>
      p.isAI === true || readyState[p.id] === true || p.ready === true;
    const p1Present = isPresent(p1Doc);
    const p2Present = isPresent(p2Doc);
    if (pastGrace && (!p1Present || !p2Present)) {
      const winnerParticipantId =
        !p1Present && !p2Present ? "" : (p1Present ? p1Doc.id : p2Doc.id);
      console.log(
        `[TournamentScheduler] No-show walkover on match ${match.id}: ` +
        `p1Present=${p1Present}, p2Present=${p2Present}, winner=${winnerParticipantId || "<none>"}`
      );
      await updateMatchStatus(match.id, {
        status: "completed",
        winnerId: winnerParticipantId || null,
      });
      if (winnerParticipantId) {
        await this.advanceRound(
          match.tournamentId,
          match.id,
          match.round,
          match.matchNumber,
          winnerParticipantId,
          ""
        );
      }
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

    // Register the onMatchEnd callback before creating the room so it's available in onCreate
    TournamentBattleRoom.pendingMatchCallbacks.set(match.id, (winnerId: string, matchFirestoreId: string) => {
      this.advanceRound(match.tournamentId, match.id, match.round, match.matchNumber, winnerId, matchFirestoreId)
        .catch(console.error);
    });

    // Create the Colyseus room via matchMaker (returns RoomListingData, not the room instance)
    let roomListing: Awaited<ReturnType<typeof matchMaker.createRoom>>;
    try {
      roomListing = await matchMaker.createRoom("tournament_battle_room", roomOptions);
    } catch (err) {
      // Roll back status and clean up pending callback on creation failure
      TournamentBattleRoom.pendingMatchCallbacks.delete(match.id);
      await updateMatchStatus(match.id, { status: "pending" });
      throw err;
    }

    // Write colyseusRoomId back to Firestore — clients listening to this doc will auto-navigate
    await updateMatchStatus(match.id, {
      status: "in-progress",
      colyseusRoomId: roomListing.roomId,
    });

    console.log(`✅ [TournamentScheduler] Opened room ${roomListing.roomId} for match ${match.id}`);
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

      // End the tournament early if no original human players remain
      await this.checkHumanPlayersRemaining(tournamentId);

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

  // ─── End tournament early when no human players remain ────────────────────

  private async checkHumanPlayersRemaining(tournamentId: string): Promise<void> {
    try {
      // Guard: only act on tournaments still running
      const tournament = await loadTournamentSettings(tournamentId);
      if (!tournament || tournament.status !== "in-progress") return;

      const participants = await getParticipantsForTournament(tournamentId);

      // AI-only tournaments (e.g. ai-exhibition) are exempt — no human to lose
      const anyHuman = participants.some(p => !p.isAI);
      if (!anyHuman) return;

      // Still have at least one human with active bracket slot
      const activeHumans = participants.filter(p => !p.isAI && p.status === "registered");
      if (activeHumans.length > 0) return;

      console.log(
        `[TournamentScheduler] No human players remain in tournament ${tournamentId} — ending early`
      );

      // Cancel all pending / room-opening matches so the scheduler won't open new rooms
      const pendingMatches = await getPendingMatchesForTournament(tournamentId);
      for (const m of pendingMatches) {
        await updateMatchStatus(m.id, { status: "completed", winnerId: null });
      }

      // Mark remaining registered AI participants as eliminated
      const remainingAI = participants.filter(p => p.isAI && p.status === "registered");
      for (const p of remainingAI) {
        await updateParticipantStatus(p.id, "eliminated");
      }

      // Complete the tournament with no human champion
      await updateTournamentStatus(tournamentId, "completed", {
        winnerId: null,
        winnerUsername: null,
      });

      console.log(
        `🏁 [TournamentScheduler] Tournament ${tournamentId} closed — all human players eliminated`
      );
    } catch (err) {
      console.error("[TournamentScheduler] Error in checkHumanPlayersRemaining:", err);
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

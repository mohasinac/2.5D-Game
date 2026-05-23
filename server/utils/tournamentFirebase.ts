import * as admin from "firebase-admin";
import { FIREBASE_COLLECTIONS } from "../constants/firebase";
import { db } from "./firebase";

export interface TournamentDoc {
  id: string;
  name: string;
  description?: string;
  type: "pvp" | "player-gauntlet" | "mixed" | "ai-exhibition";
  status: "draft" | "registration" | "in-progress" | "completed" | "cancelled";
  maxParticipants: 2 | 4 | 8;
  scheduledStartTime: admin.firestore.Timestamp;
  registrationDeadline: admin.firestore.Timestamp;
  roundIntervalMinutes: number;
  bestOf: 1 | 3 | 5;
  aiDifficulty: "medium" | "hard" | "hell";
  autoFillWithAI: boolean;
  allowedBeybladeIds: string[];
  disabledBeybladeIds: string[];
  allowedArenaIds: string[];
  /** Below this at registrationDeadline → tournament auto-cancels. Defaults to 2. */
  minParticipants?: number;
  createdBy: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  winnerId: string | null;
  winnerUsername: string | null;
  /** Cancellation reason, set by scheduler when auto-cancelling. */
  cancelReason?: string;
}

export interface TournamentParticipantDoc {
  id: string;
  tournamentId: string;
  userId: string;
  username: string;
  beybladeId: string;
  isAI: boolean;
  seed: number;
  registeredAt: admin.firestore.Timestamp;
  status: "registered" | "eliminated" | "winner" | "quit";
  /** Tournament-level ready (distinct from per-match readyState). Drives auto-start. */
  ready?: boolean;
}

export interface TournamentMatchDoc {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  scheduledTime: admin.firestore.Timestamp;
  status: "pending" | "room-opening" | "in-progress" | "completed" | "bye";
  participant1Id: string;
  participant2Id: string;
  participant1BeybladeId: string;
  participant2BeybladeId: string;
  winnerId: string | null;
  colyseusRoomId: string;
  arenaId: string;
  matchFirestoreId: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  /** Both-ready early-start flags, keyed by userId. Optional — defaults to {}. */
  readyState?: Record<string, boolean>;
  /** Set when the room-cap path produced a draw. */
  isDraw?: boolean;
}

export interface GlobalSettingsDoc {
  enableAI: boolean;
  enableTournament: boolean;
  maintenanceMode: boolean;
  serverMessage: string;
  enableTryout: boolean;
  enablePvp: boolean;
  enableAiBattle: boolean;
  globalBeybladeBlacklist: string[];
  globalArenaBlacklist: string[];
  featureSpecialMoves: boolean;
  featureTurrets: boolean;
  featurePortals: boolean;
  featureWaterBodies: boolean;
  featurePits: boolean;
  featureLoops: boolean;
  minimumTournamentGapMinutes: number;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms)
    ),
  ]);
}

export async function loadGlobalSettings(): Promise<GlobalSettingsDoc | null> {
  if (!db) return null;
  try {
    const snap = await withTimeout(
      db.collection(FIREBASE_COLLECTIONS.SETTINGS).doc("game").get(),
      5000
    );
    if (!snap.exists) return null;
    return snap.data() as GlobalSettingsDoc;
  } catch (err) {
    console.error("Error loading global settings:", err);
    return null;
  }
}

export async function loadTournamentMatch(matchId: string): Promise<TournamentMatchDoc | null> {
  if (!db) return null;
  try {
    const snap = await withTimeout(
      db.collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS).doc(matchId).get(),
      5000
    );
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() } as TournamentMatchDoc;
  } catch (err) {
    console.error("Error loading tournament match:", err);
    return null;
  }
}

export async function loadTournamentSettings(tournamentId: string): Promise<TournamentDoc | null> {
  if (!db) return null;
  try {
    const snap = await withTimeout(
      db.collection(FIREBASE_COLLECTIONS.TOURNAMENTS).doc(tournamentId).get(),
      5000
    );
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() } as TournamentDoc;
  } catch (err) {
    console.error("Error loading tournament:", err);
    return null;
  }
}

export async function updateMatchStatus(
  matchId: string,
  update: Partial<TournamentMatchDoc>
): Promise<void> {
  if (!db) return;
  try {
    await db.collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS).doc(matchId).set(
      { ...update, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.error("Error updating match status:", err);
  }
}

export async function updateBracketWinner(
  matchId: string,
  winnerId: string,
  matchFirestoreId: string
): Promise<void> {
  if (!db) return;
  try {
    await db.collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS).doc(matchId).set(
      {
        winnerId,
        matchFirestoreId,
        status: "completed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Error updating bracket winner:", err);
  }
}

export async function getUpcomingPendingMatches(windowMs: number): Promise<TournamentMatchDoc[]> {
  if (!db) return [];
  try {
    const cutoff = admin.firestore.Timestamp.fromMillis(Date.now() + windowMs);
    const snap = await withTimeout(
      db
        .collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS)
        .where("status", "==", "pending")
        .where("scheduledTime", "<=", cutoff)
        .get(),
      8000
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentMatchDoc));
  } catch (err) {
    console.error("Error fetching upcoming matches:", err);
    return [];
  }
}

/**
 * Pending matches where BOTH participants have set their readyState=true.
 * Used to early-start a match before its scheduledTime. Cheaply read by
 * scanning all pending matches (tournament brackets are small).
 */
export async function getReadyPendingMatches(): Promise<TournamentMatchDoc[]> {
  if (!db) return [];
  try {
    const snap = await withTimeout(
      db
        .collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS)
        .where("status", "==", "pending")
        .get(),
      8000
    );
    const matches: TournamentMatchDoc[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentMatchDoc));
    return matches.filter((m) => {
      const rs = m.readyState ?? {};
      // Both participants must have readyState=true. AI participants can have a synthetic
      // entry (writer's responsibility), but pure-AI matches are handled by scheduledTime.
      return rs[m.participant1Id] === true && rs[m.participant2Id] === true;
    });
  } catch (err) {
    console.error("Error fetching ready-to-start matches:", err);
    return [];
  }
}

/** Set or clear a participant's ready flag for a specific bracket match. */
export async function setMatchReadyState(matchId: string, participantId: string, ready: boolean): Promise<boolean> {
  if (!db) return false;
  try {
    const ref = db.collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS).doc(matchId);
    await ref.set({
      readyState: { [participantId]: ready },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error("Error setting match ready state:", err);
    return false;
  }
}

/** Mark a participant as "quit". Caller (or scheduler) advances opponent via walkover. */
export async function quitTournamentParticipant(participantId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const ref = db.collection(FIREBASE_COLLECTIONS.TOURNAMENT_PARTICIPANTS).doc(participantId);
    await ref.set({
      status: "quit",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error("Error quitting participant:", err);
    return false;
  }
}

export async function getStaleRoomOpeningMatches(): Promise<TournamentMatchDoc[]> {
  if (!db) return [];
  try {
    const staleCutoff = admin.firestore.Timestamp.fromMillis(Date.now() - 5 * 60 * 1000);
    const snap = await withTimeout(
      db
        .collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS)
        .where("status", "==", "room-opening")
        .where("scheduledTime", "<=", staleCutoff)
        .get(),
      8000
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentMatchDoc));
  } catch (err) {
    console.error("Error fetching stale room-opening matches:", err);
    return [];
  }
}

export async function getAvailableBeybladeIds(
  allowedIds: string[],
  disabledIds: string[]
): Promise<string[]> {
  if (!db) return [];
  try {
    let ids: string[];
    if (allowedIds.length > 0) {
      ids = allowedIds;
    } else {
      const snap = await withTimeout(
        db.collection(FIREBASE_COLLECTIONS.BEYBLADE_STATS).select().get(),
        8000
      );
      ids = snap.docs.map((d) => d.id);
    }
    const disabled = new Set(disabledIds);
    return ids.filter((id) => !disabled.has(id));
  } catch (err) {
    console.error("Error fetching available beyblades:", err);
    return [];
  }
}

export async function getParticipantsForTournament(
  tournamentId: string
): Promise<TournamentParticipantDoc[]> {
  if (!db) return [];
  try {
    const snap = await withTimeout(
      db
        .collection(FIREBASE_COLLECTIONS.TOURNAMENT_PARTICIPANTS)
        .where("tournamentId", "==", tournamentId)
        .orderBy("seed", "asc")
        .get(),
      8000
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentParticipantDoc));
  } catch (err) {
    console.error("Error fetching participants:", err);
    return [];
  }
}

export async function getRoundMatchesForTournament(
  tournamentId: string,
  round: number
): Promise<TournamentMatchDoc[]> {
  if (!db) return [];
  try {
    const snap = await withTimeout(
      db
        .collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS)
        .where("tournamentId", "==", tournamentId)
        .where("round", "==", round)
        .orderBy("matchNumber", "asc")
        .get(),
      8000
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentMatchDoc));
  } catch (err) {
    console.error("Error fetching round matches:", err);
    return [];
  }
}

export async function updateTournamentStatus(
  tournamentId: string,
  status: TournamentDoc["status"],
  extra?: Partial<TournamentDoc>
): Promise<void> {
  if (!db) return;
  try {
    await db.collection(FIREBASE_COLLECTIONS.TOURNAMENTS).doc(tournamentId).set(
      { status, ...extra, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.error("Error updating tournament status:", err);
  }
}

export async function updateParticipantStatus(
  participantId: string,
  status: TournamentParticipantDoc["status"]
): Promise<void> {
  if (!db) return;
  try {
    await db
      .collection(FIREBASE_COLLECTIONS.TOURNAMENT_PARTICIPANTS)
      .doc(participantId)
      .set({ status }, { merge: true });
  } catch (err) {
    console.error("Error updating participant status:", err);
  }
}

/** Fetch all tournaments currently accepting participants. */
export async function getRegistrationTournaments(): Promise<TournamentDoc[]> {
  if (!db) return [];
  try {
    const snap = await withTimeout(
      db
        .collection(FIREBASE_COLLECTIONS.TOURNAMENTS)
        .where("status", "==", "registration")
        .get(),
      8000
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentDoc));
  } catch (err) {
    console.error("Error fetching registration tournaments:", err);
    return [];
  }
}

/** Pad an under-capacity tournament with AI participants up to maxParticipants. */
export async function padWithAIParticipants(
  tournament: TournamentDoc,
  existing: TournamentParticipantDoc[]
): Promise<TournamentParticipantDoc[]> {
  if (!db) return existing;
  const need = Math.max(0, tournament.maxParticipants - existing.length);
  if (need === 0) return existing;
  const usedSeeds = new Set(existing.map((p) => p.seed));
  const created: TournamentParticipantDoc[] = [];
  const now = admin.firestore.FieldValue.serverTimestamp() as unknown as admin.firestore.Timestamp;
  for (let i = 0; i < need; i++) {
    let seed = 1;
    while (usedSeeds.has(seed)) seed++;
    usedSeeds.add(seed);
    const docRef = db.collection(FIREBASE_COLLECTIONS.TOURNAMENT_PARTICIPANTS).doc();
    const data: Omit<TournamentParticipantDoc, "id"> = {
      tournamentId: tournament.id,
      userId: `__ai__${tournament.id}_${seed}`,
      username: `Bot ${seed}`,
      beybladeId: "", // resolved at room-open time by autoPickBeyblade
      isAI: true,
      seed,
      registeredAt: now,
      status: "registered",
      ready: true, // AI is always ready
    };
    try {
      await docRef.set(data);
      created.push({ id: docRef.id, ...data });
    } catch (err) {
      console.error("Error creating AI participant:", err);
    }
  }
  return [...existing, ...created];
}

/** Cancel a tournament with a reason. */
export async function cancelTournament(tournamentId: string, reason: string): Promise<void> {
  await updateTournamentStatus(tournamentId, "cancelled", { cancelReason: reason });
}

/** Set a participant's tournament-level ready flag (used for auto-start). */
export async function setParticipantReady(participantId: string, ready: boolean): Promise<void> {
  if (!db) return;
  try {
    await db
      .collection(FIREBASE_COLLECTIONS.TOURNAMENT_PARTICIPANTS)
      .doc(participantId)
      .set({ ready }, { merge: true });
  } catch (err) {
    console.error("Error setting participant ready:", err);
  }
}

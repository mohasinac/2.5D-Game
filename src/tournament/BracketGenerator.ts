import * as admin from "firebase-admin";
import { db } from "../utils/firebase";
import { FIREBASE_COLLECTIONS } from "../constants/firebase";
import type { TournamentDoc, TournamentParticipantDoc, TournamentMatchDoc } from "../utils/tournamentFirebase";

export interface BracketMatchup {
  round: number;
  matchNumber: number;
  participant1Seed: number;
  participant2Seed: number | "bye";
  scheduledTime: Date;
}

/**
 * Generate standard single-elimination seeded matchups.
 * Seeds 1..N are ordered: 1v8, 4v5, 2v7, 3v6 (8-man bracket canonical pairing).
 */
export function generateBracketMatchups(
  participantCount: number,
  maxParticipants: 2 | 4 | 8,
  scheduledStartTime: Date,
  roundIntervalMinutes: number
): BracketMatchup[] {
  const seeds = Array.from({ length: maxParticipants }, (_, i) => i + 1);

  // Generate round 1 pairs using canonical elimination seeding
  const r1Pairs = buildR1Pairs(seeds);

  const allMatchups: BracketMatchup[] = [];
  let matchNumber = 1;

  // Round 1
  const staggerMinutes = maxParticipants >= 8 ? 5 : 0;
  for (let i = 0; i < r1Pairs.length; i++) {
    const [s1, s2] = r1Pairs[i];
    const isBye = s1 > participantCount || s2 > participantCount;
    const scheduledTime = new Date(
      scheduledStartTime.getTime() + i * staggerMinutes * 60 * 1000
    );
    allMatchups.push({
      round: 1,
      matchNumber,
      participant1Seed: s1,
      participant2Seed: isBye ? "bye" : s2,
      scheduledTime,
    });
    matchNumber++;
  }

  // Subsequent rounds
  const totalRounds = Math.log2(maxParticipants);
  let roundMatchCount = r1Pairs.length / 2;
  for (let r = 2; r <= totalRounds; r++) {
    const roundStart = new Date(
      scheduledStartTime.getTime() + (r - 1) * roundIntervalMinutes * 60 * 1000
    );
    for (let m = 1; m <= roundMatchCount; m++) {
      allMatchups.push({
        round: r,
        matchNumber,
        participant1Seed: 0, // TBD — filled by advanceRound
        participant2Seed: 0,
        scheduledTime: roundStart,
      });
      matchNumber++;
    }
    roundMatchCount = Math.ceil(roundMatchCount / 2);
  }

  return allMatchups;
}

/** Standard single-elimination bracket pairing for N seeds (must be power-of-2). */
function buildR1Pairs(seeds: number[]): [number, number][] {
  const n = seeds.length;
  if (n === 2) return [[1, 2]];
  if (n === 4) return [[1, 4], [2, 3]];
  // 8-bracket: 1v8, 4v5, 2v7, 3v6
  return [[1, 8], [4, 5], [2, 7], [3, 6]];
}

/**
 * Write all bracket documents to Firestore in a single batch.
 * Called when admin finalizes the tournament (transitions to "registration").
 */
export async function writeBracketToFirestore(
  tournament: TournamentDoc,
  participants: TournamentParticipantDoc[],
  defaultArenaId: string
): Promise<void> {
  if (!db) return;

  const startTime = tournament.scheduledStartTime.toDate();
  const matchups = generateBracketMatchups(
    participants.length,
    tournament.maxParticipants,
    startTime,
    tournament.roundIntervalMinutes
  );

  // Build seed → participantId map
  const seedToParticipant = new Map<number, TournamentParticipantDoc>();
  for (const p of participants) {
    seedToParticipant.set(p.seed, p);
  }

  const arenaId =
    tournament.allowedArenaIds.length > 0
      ? tournament.allowedArenaIds[Math.floor(Math.random() * tournament.allowedArenaIds.length)]
      : defaultArenaId;

  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();

  for (const matchup of matchups) {
    const docId = `${tournament.id}_r${matchup.round}_m${matchup.matchNumber}`;
    const ref = db.collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS).doc(docId);

    const isBye = matchup.participant2Seed === "bye";
    const p1 = seedToParticipant.get(matchup.participant1Seed);

    let status: TournamentMatchDoc["status"] = "pending";
    let winnerId: string | null = null;

    if (isBye && p1) {
      // Seed that gets a bye auto-advances
      status = "bye";
      winnerId = p1.id;
    }

    // Only round 1 has participant slots filled at creation time.
    // Later rounds are filled by advanceRound().
    const p2 =
      typeof matchup.participant2Seed === "number"
        ? seedToParticipant.get(matchup.participant2Seed)
        : undefined;

    const doc: Omit<TournamentMatchDoc, "id"> = {
      tournamentId: tournament.id,
      round: matchup.round,
      matchNumber: matchup.matchNumber,
      scheduledTime: admin.firestore.Timestamp.fromDate(matchup.scheduledTime),
      status,
      participant1Id: matchup.round === 1 && p1 ? p1.id : "",
      participant2Id: matchup.round === 1 && p2 ? p2.id : isBye ? "__bye__" : "",
      participant1BeybladeId: "",
      participant2BeybladeId: "",
      winnerId,
      colyseusRoomId: "",
      arenaId,
      matchFirestoreId: "",
      createdAt: now as unknown as admin.firestore.Timestamp,
      updatedAt: now as unknown as admin.firestore.Timestamp,
    };

    batch.set(ref, doc);
  }

  await batch.commit();
  console.log(`✅ Bracket written for tournament ${tournament.id}: ${matchups.length} matches`);
}

/**
 * Given the completed match and the winner's participant ID,
 * find the next-round bracket slot and fill in the winner.
 * Returns the next match doc ID if found.
 */
export async function advanceWinnerToNextRound(
  tournamentId: string,
  completedMatchId: string,
  completedRound: number,
  completedMatchNumber: number,
  winnerId: string
): Promise<string | null> {
  if (!db) return null;

  try {
    // In a standard bracket, match M in round R feeds into match ceil(M/2) in round R+1.
    const nextMatchNumber = Math.ceil(completedMatchNumber / 2);
    const nextDocId = `${tournamentId}_r${completedRound + 1}_m${nextMatchNumber}`;
    const nextRef = db.collection(FIREBASE_COLLECTIONS.TOURNAMENT_BRACKETS).doc(nextDocId);
    const nextSnap = await nextRef.get();

    if (!nextSnap.exists) {
      // This was the final — no next round
      return null;
    }

    // Odd-numbered matches fill participant1; even-numbered fill participant2
    const field = completedMatchNumber % 2 === 1 ? "participant1Id" : "participant2Id";
    await nextRef.set(
      {
        [field]: winnerId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`✅ Winner ${winnerId} advanced to ${nextDocId} as ${field}`);
    return nextDocId;
  } catch (err) {
    console.error("Error advancing winner to next round:", err);
    return null;
  }
}

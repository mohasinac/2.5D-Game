// scripts/seed-pva-gauntlet.js
//
// Seeds a linear PvAI gauntlet tournament:
//   Round 1: Human vs AI Medium
//   Round 2: Human vs AI Hard
//   Round 3: Human vs AI Hell
//   Round 4: Human vs AI Hell (stronger beyblade)
//
// The gauntlet starts immediately (scheduledStartTime = now + 1 min).
// The human participant slot uses "__placeholder_human__" as userId — update with
// the real user's UID after they register, or pass GAUNTLET_PLAYER_UID env var.
//
// On a loss the client shows "You reached Round N" using wins counted from brackets.
//
// Usage: node scripts/seed-pva-gauntlet.js
// Idempotent — uses fixed IDs.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
const playerUid   = process.env.GAUNTLET_PLAYER_UID || "__placeholder_human__";

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars.");
  process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();

const TID = "pva-gauntlet-1";
const PLAYER_P_ID = "pva-gauntlet-player";

const now = Date.now();
const START_OFFSET_MS = 1 * 60_000; // 1 min from now

const tournamentDoc = {
  name: "⚔️ PvAI Gauntlet — How Far Can You Go?",
  description: "Fight through escalating AI opponents: Medium → Hard → Hell → Hell+. If you fall, we'll tell you which round you reached.",
  type: "player-gauntlet",
  status: "registration",
  maxParticipants: 5, // 1 human + 4 AI slots
  scheduledStartTime: admin.firestore.Timestamp.fromMillis(now + START_OFFSET_MS),
  registrationDeadline: admin.firestore.Timestamp.fromMillis(now + 30_000), // 30s to register
  roundIntervalMinutes: 2,
  bestOf: 1,
  aiDifficulty: "medium",
  autoFillWithAI: true,
  allowedBeybladeIds: [],
  disabledBeybladeIds: [],
  allowedArenaIds: [],
  createdBy: "seed",
  winnerId: null,
  winnerUsername: null,
  // Gauntlet-specific metadata
  isGauntlet: true,
  gauntletRounds: 4,
  gauntletDifficulties: ["medium", "hard", "hell", "hell"],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

// Participants: 1 human + 4 AI opponents (one per round)
const PARTICIPANTS = [
  {
    id: PLAYER_P_ID,
    userId: playerUid,
    username: playerUid === "__placeholder_human__" ? "You" : "Player",
    beybladeId: "storm-pegasus",
    isAI: false,
    seed: 1,
    ready: false,
  },
  {
    id: "pva-gauntlet-ai-r1",
    userId: "ai-gauntlet-medium",
    username: "🤖 CPU-Easy (Medium)",
    beybladeId: "rock-leone",
    isAI: true,
    seed: 2,
    aiDifficulty: "medium",
  },
  {
    id: "pva-gauntlet-ai-r2",
    userId: "ai-gauntlet-hard",
    username: "🤖 CPU-Hunter (Hard)",
    beybladeId: "earth-eagle",
    isAI: true,
    seed: 3,
    aiDifficulty: "hard",
  },
  {
    id: "pva-gauntlet-ai-r3",
    userId: "ai-gauntlet-hell",
    username: "🤖 CPU-Demon (Hell)",
    beybladeId: "lightning-l-drago",
    isAI: true,
    seed: 4,
    aiDifficulty: "hell",
  },
  {
    id: "pva-gauntlet-ai-r4",
    userId: "ai-gauntlet-hell2",
    username: "🤖 CPU-Nightmare (Hell+)",
    beybladeId: "galaxy-pegasis",
    isAI: true,
    seed: 5,
    aiDifficulty: "hell",
  },
];

// Linear bracket — player vs one AI per round
// Future rounds have empty participant IDs until the player wins through
const BRACKETS = [
  {
    id: `${TID}_r1`,
    round: 1,
    matchNumber: 1,
    participant1Id: PLAYER_P_ID,
    participant2Id: "pva-gauntlet-ai-r1",
    participant1BeybladeId: "storm-pegasus",
    participant2BeybladeId: "rock-leone",
    scheduledTime: admin.firestore.Timestamp.fromMillis(now + START_OFFSET_MS),
    arenaId: "bey-stadium-classic",
    aiDifficulty: "medium",
    gauntletRound: 1,
  },
  {
    id: `${TID}_r2`,
    round: 2,
    matchNumber: 1,
    participant1Id: PLAYER_P_ID,
    participant2Id: "pva-gauntlet-ai-r2",
    participant1BeybladeId: "storm-pegasus",
    participant2BeybladeId: "earth-eagle",
    scheduledTime: admin.firestore.Timestamp.fromMillis(now + START_OFFSET_MS + 3 * 60_000),
    arenaId: "bey-stadium-classic",
    aiDifficulty: "hard",
    gauntletRound: 2,
  },
  {
    id: `${TID}_r3`,
    round: 3,
    matchNumber: 1,
    participant1Id: PLAYER_P_ID,
    participant2Id: "pva-gauntlet-ai-r3",
    participant1BeybladeId: "storm-pegasus",
    participant2BeybladeId: "lightning-l-drago",
    scheduledTime: admin.firestore.Timestamp.fromMillis(now + START_OFFSET_MS + 6 * 60_000),
    arenaId: "bey-stadium-classic",
    aiDifficulty: "hell",
    gauntletRound: 3,
  },
  {
    id: `${TID}_r4`,
    round: 4,
    matchNumber: 1,
    participant1Id: PLAYER_P_ID,
    participant2Id: "pva-gauntlet-ai-r4",
    participant1BeybladeId: "storm-pegasus",
    participant2BeybladeId: "galaxy-pegasis",
    scheduledTime: admin.firestore.Timestamp.fromMillis(now + START_OFFSET_MS + 9 * 60_000),
    arenaId: "bey-stadium-classic",
    aiDifficulty: "hell",
    gauntletRound: 4,
  },
];

async function seedGauntlet() {
  console.log("\n══════════════════════════════════════");
  console.log("  PvAI Gauntlet Tournament Seed");
  console.log("══════════════════════════════════════\n");

  await db.collection("tournaments").doc(TID).set(tournamentDoc, { merge: false });
  console.log(`  ✔ tournament: ${tournamentDoc.name}`);

  for (const p of PARTICIPANTS) {
    await db.collection("tournament_participants").doc(p.id).set({
      ...p,
      tournamentId: TID,
      status: "registered",
      wins: 0,
      losses: 0,
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log(`  ✔ participant: ${p.username.padEnd(28)} ${p.isAI ? `(AI ${p.aiDifficulty || ""})` : "(HUMAN)"}`);
  }

  for (const b of BRACKETS) {
    await db.collection("tournament_brackets").doc(b.id).set({
      ...b,
      tournamentId: TID,
      status: "pending",
      winnerId: null,
      colyseusRoomId: "",
      matchFirestoreId: "",
      readyState: {},
      isDraw: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: false });
    console.log(`  ✔ bracket: Round ${b.round} — ${b.aiDifficulty} AI (in ${Math.round((b.scheduledTime.toMillis() - now) / 60000)} min)`);
  }

  console.log(`\n✅ PvAI Gauntlet seeded: ${TID}`);
  console.log(`   Tournament ID: ${TID}`);
  console.log(`   Player participant ID: ${PLAYER_P_ID}`);
  console.log(`   Player UID slot: ${playerUid}`);
  if (playerUid === "__placeholder_human__") {
    console.log(`\n   ⚠️  To register a real player, run:`);
    console.log(`      GAUNTLET_PLAYER_UID=<firebase-uid> node scripts/seed-pva-gauntlet.js`);
  }
  console.log();
}

seedGauntlet().catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); });

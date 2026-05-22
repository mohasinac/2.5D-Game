// scripts/seed-tournament-ai-solo.js
// Seeds a 4-bracket "Solo vs AI" tournament: 1 human placeholder + 3 AI participants.
// On registration the human's participant doc can be updated with their userId.
// Idempotent — uses fixed IDs.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars.");
  process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();

async function deleteDocs(collection, ids) {
  const batch = db.batch();
  for (const id of ids) batch.delete(db.collection(collection).doc(id));
  await batch.commit();
  console.log(`  🗑️  Deleted ${ids.length} docs from ${collection}`);
}

const TID = "solo-vs-ai-bracket-1";
const tournamentDoc = {
  name: "Solo Gauntlet — vs AI",
  description: "1 human, 3 AI opponents. 4-player single elimination. Hard difficulty.",
  type: "player-gauntlet",
  status: "registration",
  maxParticipants: 4,
  scheduledStartTime: admin.firestore.Timestamp.fromMillis(Date.now() + 5 * 60_000), // 5min from now
  registrationDeadline: admin.firestore.Timestamp.fromMillis(Date.now() + 4 * 60_000),
  roundIntervalMinutes: 5,
  bestOf: 1,
  aiDifficulty: "hard",
  autoFillWithAI: true,
  allowedBeybladeIds: [],
  disabledBeybladeIds: [],
  allowedArenaIds: [],
  createdBy: "seed",
  winnerId: null,
  winnerUsername: null,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

const PARTICIPANTS = [
  { id: "solo-vs-ai-p1", userId: "__placeholder_human__", username: "You",          beybladeId: "storm-pegasus",   isAI: false, seed: 1 },
  { id: "solo-vs-ai-p2", userId: "ai-rock-leone",         username: "CPU-Leone",    beybladeId: "rock-leone",      isAI: true,  seed: 4 },
  { id: "solo-vs-ai-p3", userId: "ai-lightning-l-drago",  username: "CPU-L-Drago",  beybladeId: "lightning-l-drago", isAI: true,  seed: 2 },
  { id: "solo-vs-ai-p4", userId: "ai-earth-eagle",        username: "CPU-Eagle",    beybladeId: "earth-eagle",     isAI: true,  seed: 3 },
];

// 4-bracket canonical: r1: 1v4, 2v3 → r2 winners
const now = Date.now();
const BRACKETS = [
  {
    id: `${TID}_r1_m1`,
    round: 1, matchNumber: 1,
    participant1Id: "solo-vs-ai-p1", participant2Id: "solo-vs-ai-p2",
    participant1BeybladeId: "storm-pegasus", participant2BeybladeId: "rock-leone",
    scheduledTime: admin.firestore.Timestamp.fromMillis(now + 5 * 60_000),
    arenaId: "bey-stadium-classic",
  },
  {
    id: `${TID}_r1_m2`,
    round: 1, matchNumber: 2,
    participant1Id: "solo-vs-ai-p3", participant2Id: "solo-vs-ai-p4",
    participant1BeybladeId: "lightning-l-drago", participant2BeybladeId: "earth-eagle",
    scheduledTime: admin.firestore.Timestamp.fromMillis(now + 10 * 60_000),
    arenaId: "bey-stadium-classic",
  },
  {
    id: `${TID}_r2_m1`,
    round: 2, matchNumber: 1,
    participant1Id: "", participant2Id: "",
    participant1BeybladeId: "", participant2BeybladeId: "",
    scheduledTime: admin.firestore.Timestamp.fromMillis(now + 15 * 60_000),
    arenaId: "bey-stadium-classic",
  },
];

async function seedSolo() {
  console.log("\n══════════════════════════════════════");
  console.log("  Solo-vs-AI Tournament Seed");
  console.log("══════════════════════════════════════\n");
  await db.collection("tournaments").doc(TID).set(tournamentDoc, { merge: false });
  console.log(`  ✔ tournament: ${tournamentDoc.name}`);

  for (const p of PARTICIPANTS) {
    await db.collection("tournament_participants").doc(p.id).set({
      ...p, tournamentId: TID, status: "registered",
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log(`  ✔ participant: ${p.username.padEnd(12)} seed=${p.seed} bey=${p.beybladeId} ${p.isAI ? "(AI)" : ""}`);
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: false });
    console.log(`  ✔ bracket: r${b.round} m${b.matchNumber}`);
  }

  console.log(`\n✅ Solo-vs-AI tournament seeded: ${TID}\n`);
}

seedSolo().catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); });

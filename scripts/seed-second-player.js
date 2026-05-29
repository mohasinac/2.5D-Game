// scripts/seed-second-player.js
// Creates player2@letitrip.in with role "user" in Firebase Auth + Firestore.
// Run: node scripts/seed-second-player.js
// Idempotent — safe to re-run.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars. Check your .env file.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

const auth = admin.auth();
const db = admin.firestore();

const PLAYER2_EMAIL = "player2@letitrip.in";
const PLAYER2_PASSWORD = "TempPass123!";
const PLAYER2_USERNAME = "Player2";

async function seedSecondPlayer() {
  let uid;

  try {
    const user = await auth.createUser({
      email: PLAYER2_EMAIL,
      password: PLAYER2_PASSWORD,
      displayName: PLAYER2_USERNAME,
    });
    uid = user.uid;
    console.log(`✅ Created user: ${PLAYER2_EMAIL} (uid: ${uid})`);
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      const existing = await auth.getUserByEmail(PLAYER2_EMAIL);
      uid = existing.uid;
      console.log(`ℹ️  User already exists: ${PLAYER2_EMAIL} (uid: ${uid})`);
    } else {
      throw err;
    }
  }

  await db.collection("users").doc(uid).set(
    {
      uid,
      email: PLAYER2_EMAIL,
      username: PLAYER2_USERNAME,
      role: "user",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  await db.collection("player_stats").doc(uid).set(
    {
      uid,
      username: PLAYER2_USERNAME,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalDamageDealt: 0,
      totalCollisions: 0,
      tournamentPoints: 0,
    },
    { merge: true },
  );

  console.log(`✅ Firestore users/${uid} → role: "user"`);
  console.log(`✅ Firestore player_stats/${uid} initialized`);
  console.log(`\n🎮 Player 2 ready: ${PLAYER2_EMAIL} / ${PLAYER2_PASSWORD}`);
}

seedSecondPlayer()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));

// scripts/seed-settings.js
// Creates/updates settings/game in Firestore with all defaults enabled.
// Run: node scripts/seed-settings.js
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

admin.initializeApp({
  credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
});

const db = admin.firestore();

async function seedSettings() {
  const settings = {
    // Game mode toggles
    enableTryout: true,
    enablePvp: true,
    enableAiBattle: true,
    enableAI: true,
    enableTournament: true,
    maintenanceMode: false,
    maintenanceMessage: "",
    serverMessage: "",
    // Arena feature toggles
    featureSpecialMoves: true,
    featureTurrets: true,
    featurePortals: true,
    featureWaterBodies: true,
    featurePits: true,
    featureLoops: true,
    // Room config
    maxPlayersPerRoom: 4,
    matchTimeoutSeconds: 180,
    maxActiveRooms: 20,
    maxSpectatorsBattle: 8,
    maxSpectatorsTournament: 8,
    maxSpectatorsAI: 8,
    // Blacklists (arrays)
    globalBeybladeBlacklist: [],
    globalArenaBlacklist: [],
    // Tournament
    minimumTournamentGapMinutes: 30,
    defaultArenaId: "",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection("settings").doc("game").set(settings, { merge: true });
  console.log("✅ settings/game seeded with all defaults:");
  Object.entries(settings).forEach(([k, v]) => {
    if (k !== "updatedAt") console.log(`   ${k}: ${JSON.stringify(v)}`);
  });
  console.log("\n🎮 All game modes and features are now enabled.");
}

seedSettings()
  .catch((err) => { console.error("❌ Failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

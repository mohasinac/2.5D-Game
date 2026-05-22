// scripts/seed-settings.js
// Creates/updates settings/game in Firestore to enable all game modes.
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
    enableAI: true,
    enableTournament: true,
    maintenanceMode: false,
    serverMessage: "",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection("settings").doc("game").set(settings, { merge: true });
  console.log("✅ settings/game updated:");
  console.log("   enableAI: true");
  console.log("   enableTournament: true");
  console.log("   maintenanceMode: false");
  console.log("\n🎮 All game modes are now enabled.");
}

seedSettings()
  .catch((err) => { console.error("❌ Failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

// scripts/seed-ai-battles.js
// Seeds three preset AI-battle configurations into Firestore `ai_battles`:
//   medium / hard / hell. The AI Battle setup page can reference these by id
//   for one-tap "play recommended" launchers. Idempotent.

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

const PRESETS = [
  {
    id: "ai-medium-warmup",
    name: "Warm-up — Medium AI",
    playerBeybladeId: "storm-pegasus",
    aiBeybladeId: "rock-leone",
    arenaId: "attack-stadium",
    difficulty: "medium",
    bestOf: 1,
    description: "Single match against a Medium-difficulty Rock Leone. Good for testing controls.",
  },
  {
    id: "ai-hard-challenge",
    name: "Challenge — Hard AI",
    playerBeybladeId: "storm-pegasus",
    aiBeybladeId: "lightning-l-drago",
    arenaId: "attack-stadium",
    difficulty: "hard",
    bestOf: 3,
    description: "BO3 against a Hard-difficulty Lightning L-Drago. Predictive dodges; learn to feint.",
  },
  {
    id: "ai-hell-gauntlet",
    name: "Hell Gauntlet",
    playerBeybladeId: "valtryek-v2",
    aiBeybladeId: "hells-hammer",
    arenaId: "big-bang-stadium",
    difficulty: "hell",
    bestOf: 5,
    description: "BO5 against a Hell-difficulty Hells Hammer in a gravity-well arena. Frame-perfect.",
  },
];

async function seedAIBattles() {
  console.log("\n══════════════════════════════════════");
  console.log("  AI Battle Preset Seed");
  console.log("══════════════════════════════════════\n");
  const now = new Date().toISOString();
  for (const p of PRESETS) {
    try {
      await db.collection("ai_battles").doc(p.id).set({ ...p, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: false });
      console.log(`  ✔ ${p.name.padEnd(24)} difficulty=${p.difficulty} BO${p.bestOf}`);
    } catch (err) {
      console.error(`  ✘ ${p.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${PRESETS.length} AI-battle presets into ai_battles\n`);
}

seedAIBattles().catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); });

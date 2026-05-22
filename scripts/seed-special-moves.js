#!/usr/bin/env node
// Seed special_moves collection with 4 moves

require('dotenv').config();
const admin = require('firebase-admin');

const { FIREBASE_ADMIN_PROJECT_ID: projectId, FIREBASE_ADMIN_CLIENT_EMAIL: clientEmail, FIREBASE_ADMIN_PRIVATE_KEY } = process.env;
const privateKey = FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) { console.error('❌ Missing Firebase Admin env vars.'); process.exit(1); }
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });

const db = admin.firestore();

async function clearCollection(name) {
  const snap = await db.collection(name).get();
  if (snap.empty) return;
  let batch = db.batch(); let count = 0;
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
  console.log(`  🗑️  Cleared ${snap.size} docs from ${name}`);
}

const specialMoves = [
  {
    id: "stampede_rush",
    name: "Stampede Rush",
    description: "A powerful forward rush attack that damages and pushes opponents.",
    archetype: "attack",
    powerCost: 50,
    cooldownSeconds: 3,
    durationMs: 500,
    physics: {
      forceMultiplier: 0.005,
      spinMultiplier: 1.8,
      staminaRecovery: 0,
      invulnerabilityMs: 0,
      speedBurstMs: 500,
    },
    visual: {
      particleColor: "#ff6600",
      screenFlashColor: "#ff4444",
      iconEmoji: "⚡",
      animationType: "rush",
    },
  },
  {
    id: "gyro_anchor",
    name: "Gyro Anchor",
    description: "Lock in place with maximum spin for 1.5 seconds of invulnerability.",
    archetype: "defense",
    powerCost: 50,
    cooldownSeconds: 3,
    durationMs: 1500,
    physics: {
      forceMultiplier: 0,
      spinMultiplier: 1,
      staminaRecovery: 0,
      invulnerabilityMs: 1500,
      speedBurstMs: 0,
    },
    visual: {
      particleColor: "#4488ff",
      screenFlashColor: "#4488ff",
      iconEmoji: "🛡️",
      animationType: "anchor",
    },
  },
  {
    id: "spin_recovery",
    name: "Spin Recovery",
    description: "Orbit around and recover 40% of max spin and stamina.",
    archetype: "stamina",
    powerCost: 50,
    cooldownSeconds: 3,
    durationMs: 1000,
    physics: {
      forceMultiplier: 0.002,
      spinMultiplier: 1.4,
      staminaRecovery: 0.2,
      invulnerabilityMs: 0,
      speedBurstMs: 0,
    },
    visual: {
      particleColor: "#44ff88",
      screenFlashColor: "#44ff88",
      iconEmoji: "♻️",
      animationType: "orbit",
    },
  },
  {
    id: "tactical_burst",
    name: "Tactical Burst",
    description: "Directional burst with spin boost and stamina recovery.",
    archetype: "balanced",
    powerCost: 50,
    cooldownSeconds: 3,
    durationMs: 300,
    physics: {
      forceMultiplier: 0.003,
      spinMultiplier: 1.5,
      staminaRecovery: 0.15,
      invulnerabilityMs: 0,
      speedBurstMs: 300,
    },
    visual: {
      particleColor: "#ffff00",
      screenFlashColor: "#ffcc44",
      iconEmoji: "💫",
      animationType: "burst",
    },
  },
];

async function seed() {
  try {
    console.log("Seeding special_moves collection...");
    await clearCollection("special_moves");

    for (const move of specialMoves) {
      await db.collection("special_moves").doc(move.id).set(move);
      console.log(`  ✅ Created move: ${move.name}`);
    }

    console.log("\n✅ Special moves seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding special moves:", error);
    process.exit(1);
  }
}

seed();

#!/usr/bin/env node
// Seed special_moves collection with 4 moves

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../firebase-key.json');
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

const specialMoves = [
  {
    id: "stampede-rush",
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
    id: "gyro-anchor",
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
    id: "spin-recovery",
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
    id: "tactical-burst",
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

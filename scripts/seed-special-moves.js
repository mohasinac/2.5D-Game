#!/usr/bin/env node
// Seed special_moves collection.
//
// NOTE: Roster is intentionally sparse — special moves are being redesigned
// from first principles using Case Study 11 (case study/11 case study.md).
// The single entry below is kept as a structural reference. Add new moves
// here as they are derived from the case study.

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

// ─── REFERENCE EXAMPLE (keep structure, replace values when designing new moves) ───
const specialMoves = [
  {
    id: "stampede_rush",
    name: "Stampede Rush",
    description: "Reference example — linear-burst archetype. Forward impulse + brief invulnerability. Derived from flat-face AR smash + EG spring energy (CS11 Case 587).",
    archetype: "attack",
    powerCost: 100,
    cooldownSeconds: 3,
    durationMs: 500,
    windupTicks: 6,   // 100ms at 60 Hz
    bleedTicks: 6,
    cameraConfig: { zoomFactor: 1.5, durationTicks: 60, slowMotionFactor: 0.7 },
    introAnimation: "special_intro",
    outroAnimation: "special_outro",
    cancelableByQTE: true,
    physics: {
      linearImpulse: 5000,
      spinDelta: 60,
      invulnerabilityMs: 200,
      damageMultiplier: 1.3,
      knockbackImpulse: 3000,
    },
    visual: {
      particleColor: "#ff6600",
      screenFlashColor: "#ff5522",
      iconEmoji: "⚡",
      animationType: "rush",
    },
    steps: [
      { action: "velocity_burst", params: { forceX: 0.12, forceY: 0 } },
      { action: "attack_amplifier", params: { multiplier: 1.3 }, durationMs: 500 },
    ],
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

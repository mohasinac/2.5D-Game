#!/usr/bin/env node
// scripts/seed-special-move-presets.js
// Seeds special_move_presets collection.
//
// NOTE: Roster is intentionally sparse — special moves are being redesigned
// from first principles using Case Study 11 (case study/11 case study.md).
// The single entry below is kept as a structural reference. Add new presets
// here as they are derived from the case study.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars."); process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
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

// ─── REFERENCE EXAMPLE (keep structure, replace values when designing new presets) ───
const PRESETS = [
  {
    id: "preset-stampede-rush",
    name: "Stampede Rush",
    description: "Reference example — linear-burst archetype. Forward impulse + brief invulnerability. Physics basis: flat-face AR smash + EG spring energy (CS11 Case 587). 1 engine-unit linearImpulse = 3.60×10⁻⁵ N·s (CS11 Case 597).",
    archetype: "attack",
    icon: "⚡",
    recommendedBeyType: "attack",
    recommendedAttackMin: 100,
    config: {
      name: "Stampede Rush",
      steps: [
        { type: "apply_force", direction: "facing", magnitude: 0.005, durationTicks: 10 },
        { type: "spin_boost", amount: 60, durationTicks: 5 },
      ],
      cancelable: true,
      locksDurationTicks: 42,  // 700ms total at 60 Hz
      powerCost: 100,
    },
    visual: { particleColor: "#ff6600", screenFlashColor: "#ff5522", iconEmoji: "⚡", animationType: "rush" },
    physics: {
      linearImpulse: 5000,
      spinDelta: 60,
      invulnerabilityMs: 200,
      damageMultiplier: 1.3,
      knockbackImpulse: 3000,
    },
  },
];

async function seed() {
  console.log("\n══════════════════════════════════════════════");
  console.log("  Special Move Presets Seed");
  console.log("══════════════════════════════════════════════\n");
  await clearCollection("special_move_presets");
  const now = new Date().toISOString();
  for (const p of PRESETS) {
    try {
      await db.collection("special_move_presets").doc(p.id).set({ ...p, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      console.log(`  ✔ [${p.archetype.padEnd(8)}] ${p.name}`);
    } catch (err) {
      console.error(`  ✘ ${p.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${PRESETS.length} special move preset(s) into special_move_presets\n`);
}

seed()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

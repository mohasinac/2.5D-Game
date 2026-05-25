#!/usr/bin/env node
// scripts/seed-bey-presets.js
// Seeds bey_presets — 4 archetype configs (Attack, Defense, Stamina, Balanced)
// plus 4 generation-specific variants, as "quick-start" beyblade stat templates.
// Idempotent.

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

// Type distribution: 360 total points, max 150 per stat.
// damageMultiplier = 1.0 + attack * 0.007
// damageReduction  = 1 - defense * 0.003
// spinDecayRate    = 8 * (1 - stamina * 0.001)
// maxSpin          = 2000 * (1 + stamina * 0.0008)

const PRESETS = [
  // ── Core 4 Archetypes ────────────────────────────────────────────────────────
  {
    id: "preset-bey-attack",
    name: "Attack Archetype",
    description: "Pure attack build: max attack, minimal defense/stamina. Deals 2.05× damage. Glass cannon — low spin retention.",
    type: "attack",
    generation: "generic",
    stats: {
      attack: 150, defense: 60, stamina: 60,
      speed: 130, weight: 85, radius: 2.0,
      spinDirection: "right",
      typeDistribution: { attack: 150, defense: 60, stamina: 60 },
    },
    recommendedCombos: ["quick-dash-l", "quick-dash-r", "power-thrust"],
    recommendedSpecialMove: "stampede_rush",
    notes: "Recommended parts: rubber flat tip, upper smash AR, heavy attack WD.",
  },
  {
    id: "preset-bey-defense",
    name: "Defense Archetype",
    description: "Pure defense build: max defense, reduces incoming damage by 45%. Very high mass and radius for stability.",
    type: "defense",
    generation: "generic",
    stats: {
      attack: 60, defense: 150, stamina: 60,
      speed: 70, weight: 140, radius: 2.4,
      spinDirection: "right",
      typeDistribution: { attack: 60, defense: 150, stamina: 60 },
    },
    recommendedCombos: ["guard-tap", "feint", "riposte"],
    recommendedSpecialMove: "gyro_anchor",
    notes: "Recommended parts: bearing or free-spin tip, wide defense WD, burst-stopper core.",
  },
  {
    id: "preset-bey-stamina",
    name: "Stamina Archetype",
    description: "Pure stamina build: max stamina, maxSpin = 2400, spinDecayRate = 6.8/s. Outlasts opponents in endurance matches.",
    type: "stamina",
    generation: "generic",
    stats: {
      attack: 60, defense: 60, stamina: 150,
      speed: 95, weight: 90, radius: 2.1,
      spinDirection: "right",
      typeDistribution: { attack: 60, defense: 60, stamina: 150 },
    },
    recommendedCombos: ["guard-tap", "spin-leech-jab"],
    recommendedSpecialMove: "spin_recovery",
    notes: "Recommended parts: sharp or bearing tip, compact WD, final-clutch EG core.",
  },
  {
    id: "preset-bey-balanced",
    name: "Balanced Archetype",
    description: "Equal distribution: 90 attack / 90 defense / 90 stamina. Versatile all-rounder.",
    type: "balanced",
    generation: "generic",
    stats: {
      attack: 90, defense: 90, stamina: 90,
      speed: 100, weight: 100, radius: 2.2,
      spinDirection: "right",
      typeDistribution: { attack: 90, defense: 90, stamina: 90 },
    },
    recommendedCombos: ["feint", "pivot-strike"],
    recommendedSpecialMove: "tactical_burst",
    notes: "Recommended parts: flat or semi-sharp tip, standard WD.",
  },
  // ── Generation Variants ───────────────────────────────────────────────────────
  {
    id: "preset-bey-plastic-gen",
    name: "Plastic Gen (G1)",
    description: "Bakuten Shoot era stats: light weight (65g), high radius (2.6cm), no burst risk. Relies on tip type for attack/defense.",
    type: "balanced",
    generation: "plastic",
    stats: {
      attack: 80, defense: 80, stamina: 100,
      speed: 105, weight: 65, radius: 2.6,
      spinDirection: "right",
      burstResistance: 100,
      typeDistribution: { attack: 80, defense: 80, stamina: 100 },
    },
    recommendedSpecialMove: "spin_recovery",
    notes: "No burst mechanic. EG spring optional. Wide open AR for high-contact area.",
  },
  {
    id: "preset-bey-metal-gen",
    name: "Metal Fight (G2)",
    description: "MFB era: heavy metal fusions (95–115g), spin tracks add height, moderate burst resistance.",
    type: "attack",
    generation: "metal_fight",
    stats: {
      attack: 110, defense: 90, stamina: 80,
      speed: 115, weight: 105, radius: 2.3,
      spinDirection: "right",
      burstResistance: 70,
      typeDistribution: { attack: 110, defense: 90, stamina: 80 },
    },
    recommendedSpecialMove: "stampede_rush",
    notes: "Spin track adds height offset. Heavy metal fusion damage bonus.",
  },
  {
    id: "preset-bey-burst-gen",
    name: "Burst Gen (G3)",
    description: "Burst era: click-burst mechanism (3-click default), lighter frames (45–65g), fast aggressive play.",
    type: "attack",
    generation: "burst",
    stats: {
      attack: 120, defense: 70, stamina: 85,
      speed: 125, weight: 55, radius: 2.0,
      spinDirection: "right",
      burstResistance: 35,
      typeDistribution: { attack: 120, defense: 70, stamina: 85 },
    },
    recommendedSpecialMove: "tactical_burst",
    notes: "Low burst resistance is a trade-off for extreme attack power.",
  },
  {
    id: "preset-bey-x-gen",
    name: "X Gen (G4)",
    description: "Beyblade X era: extreme speed (145 speed), X-dash ratchet gimmick, compact form factor.",
    type: "attack",
    generation: "x_gen",
    stats: {
      attack: 130, defense: 65, stamina: 75,
      speed: 145, weight: 45, radius: 1.9,
      spinDirection: "right",
      burstResistance: 25,
      jumpForce: 3.0, jumpHeight: 0.4,
      typeDistribution: { attack: 130, defense: 65, stamina: 75 },
    },
    recommendedSpecialMove: "stampede_rush",
    notes: "X-Line ratchet: high jump force for arena wall deflection. Fragile but blindingly fast.",
  },
];

async function seed() {
  console.log("\n════════════════════════════════════════");
  console.log("  Beyblade Presets Seed");
  console.log("════════════════════════════════════════\n");
  await clearCollection("bey_presets");
  const now = new Date().toISOString();
  for (const p of PRESETS) {
    try {
      await db.collection("bey_presets").doc(p.id).set({ ...p, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      const a = p.stats.attack, d = p.stats.defense, s = p.stats.stamina;
      console.log(`  ✔ [${p.type.padEnd(8)}/${p.generation.padEnd(12)}] ${p.name.padEnd(22)} A${a} D${d} S${s}`);
    } catch (err) {
      console.error(`  ✘ ${p.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${PRESETS.length} bey presets into bey_presets\n`);
}

seed()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

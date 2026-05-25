#!/usr/bin/env node
// scripts/seed-combo-presets.js
// Seeds combo_presets — mirrors the 8 combos from src/constants/combos.ts
// as pick-and-apply preset cards for the beyblade system editor. Idempotent.

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

// Mirrors src/constants/combos.ts COMBO_REGISTRY exactly.
const PRESETS = [
  {
    id: "preset-quick-dash-l",
    name: "Quick Dash Left",
    description: "Short leftward dash with a contact pop. Free — no power cost.",
    comboId: "quick-dash-l",
    sequence: ["moveLeft", "moveLeft", "attack"],
    cost: 0,
    type: "universal",
    windowMs: 400,
    cooldownMs: 800,
    tags: ["mobility", "free"],
    recommendedBeyTypes: ["attack", "balanced"],
  },
  {
    id: "preset-quick-dash-r",
    name: "Quick Dash Right",
    description: "Short rightward dash with a contact pop. Free — no power cost.",
    comboId: "quick-dash-r",
    sequence: ["moveRight", "moveRight", "attack"],
    cost: 0,
    type: "universal",
    windowMs: 400,
    cooldownMs: 800,
    tags: ["mobility", "free"],
    recommendedBeyTypes: ["attack", "balanced"],
  },
  {
    id: "preset-guard-tap",
    name: "Guard Tap",
    description: "Quick triple-tap guard. Free; no offensive bonus but opens defensive windows.",
    comboId: "guard-tap",
    sequence: ["defense", "defense", "defense"],
    cost: 0,
    type: "universal",
    windowMs: 500,
    cooldownMs: 1000,
    tags: ["defensive", "free"],
    recommendedBeyTypes: ["defense", "balanced"],
  },
  {
    id: "preset-feint",
    name: "Feint",
    description: "Side-step then brace. Free; opens counter-windows for follow-up combos.",
    comboId: "feint",
    sequence: ["moveLeft", "moveRight", "defense"],
    cost: 0,
    type: "universal",
    windowMs: 450,
    cooldownMs: 1200,
    tags: ["counter", "free"],
    recommendedBeyTypes: ["balanced", "defense"],
  },
  {
    id: "preset-riposte",
    name: "Riposte",
    description: "Defensive parry into a 1.3x counter-attack. Costs 15 power.",
    comboId: "riposte",
    sequence: ["defense", "defense", "attack"],
    cost: 15,
    type: "defense",
    windowMs: 500,
    cooldownMs: 2500,
    tags: ["counter", "damage"],
    recommendedBeyTypes: ["defense"],
  },
  {
    id: "preset-pivot-strike",
    name: "Pivot Strike",
    description: "Quick pivot into a 1.25x strike. Costs 15 power. Good balanced opener.",
    comboId: "pivot-strike",
    sequence: ["moveLeft", "moveRight", "attack"],
    cost: 15,
    type: "balanced",
    windowMs: 450,
    cooldownMs: 2500,
    tags: ["damage", "mobility"],
    recommendedBeyTypes: ["balanced", "attack"],
  },
  {
    id: "preset-power-thrust",
    name: "Power Thrust",
    description: "Three-tap commit attack — 1.5x damage for 0.8s. Costs 25 power.",
    comboId: "power-thrust",
    sequence: ["attack", "attack", "attack"],
    cost: 25,
    type: "universal",
    windowMs: 450,
    cooldownMs: 3500,
    tags: ["damage", "high-cost"],
    recommendedBeyTypes: ["attack"],
  },
  {
    id: "preset-spin-leech-jab",
    name: "Spin-Leech Jab",
    description: "Stamina-only. Light hit + 8% spin steal. Costs 35 power. Destroys opponent stamina.",
    comboId: "spin-leech-jab",
    sequence: ["moveLeft", "attack", "moveRight"],
    cost: 35,
    type: "stamina",
    windowMs: 450,
    cooldownMs: 4500,
    tags: ["spin-steal", "stamina-only"],
    recommendedBeyTypes: ["stamina"],
  },
];

async function seed() {
  console.log("\n════════════════════════════════════════");
  console.log("  Combo Presets Seed");
  console.log("════════════════════════════════════════\n");
  await clearCollection("combo_presets");
  const now = new Date().toISOString();
  for (const p of PRESETS) {
    try {
      await db.collection("combo_presets").doc(p.id).set({ ...p, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      const icon = p.cost === 0 ? "⚡ free" : `🔋 ${p.cost}`;
      console.log(`  ✔ [${p.type.padEnd(9)}] ${p.name.padEnd(20)} ${icon}`);
    } catch (err) {
      console.error(`  ✘ ${p.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${PRESETS.length} combo presets into combo_presets\n`);
}

seed()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

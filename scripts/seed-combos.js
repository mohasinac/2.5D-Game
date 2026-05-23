// scripts/seed-combos.js
// Writes the 8 combos from src/constants/combos.ts to a Firestore `combos` collection.
// Server-side combo logic is hard-coded against the registry; this collection
// exists for admin UI / introspection only. Idempotent.

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

const COMBO_EFFECT_IDS = {
  "quick-dash-l":   "quick-dash-l",
  "quick-dash-r":   "quick-dash-r",
  "guard-tap":      "guard-tap",
  "feint":          "feint",
  "riposte":        "riposte",
  "pivot-strike":   "pivot-strike",
  "power-thrust":   "power-thrust",
  "spin-leech-jab": "spin-leech",
};

// Keep in sync with src/constants/combos.ts COMBO_REGISTRY.
const COMBOS = [
  { id: "quick-dash-l",  name: "Quick Dash Left",  sequence: ["moveLeft","moveLeft","attack"],   cost: 0,  type: "universal", windowMs: 400, cooldownMs: 800,  description: "Short leftward dash with a contact pop. Free." },
  { id: "quick-dash-r",  name: "Quick Dash Right", sequence: ["moveRight","moveRight","attack"], cost: 0,  type: "universal", windowMs: 400, cooldownMs: 800,  description: "Short rightward dash with a contact pop. Free." },
  { id: "guard-tap",     name: "Guard Tap",        sequence: ["defense","defense","defense"],    cost: 0,  type: "universal", windowMs: 500, cooldownMs: 1000, description: "Quick triple-tap guard. Free; no offensive bonus." },
  { id: "feint",         name: "Feint",            sequence: ["moveLeft","moveRight","defense"], cost: 0,  type: "universal", windowMs: 450, cooldownMs: 1200, description: "Side-step then brace. Free; opens counter-windows." },
  { id: "riposte",       name: "Riposte",          sequence: ["defense","defense","attack"],     cost: 15, type: "defense",   windowMs: 500, cooldownMs: 2500, description: "Defensive parry into a 1.3x counter. Costs 15." },
  { id: "pivot-strike",  name: "Pivot Strike",     sequence: ["moveLeft","moveRight","attack"],  cost: 15, type: "balanced",  windowMs: 450, cooldownMs: 2500, description: "Quick pivot into a 1.25x strike. Costs 15." },
  { id: "power-thrust",  name: "Power Thrust",     sequence: ["attack","attack","attack"],       cost: 25, type: "universal", windowMs: 450, cooldownMs: 3500, description: "Three-tap commit attack — 1.5x for 0.8s. Costs 25." },
  { id: "spin-leech-jab",name: "Spin-Leech Jab",   sequence: ["moveLeft","attack","moveRight"],  cost: 35, type: "stamina",   windowMs: 450, cooldownMs: 4500, description: "Stamina-only. Light hit + 8% spin steal. Costs 35." },
].map(c => ({ ...c, effectId: COMBO_EFFECT_IDS[c.id] ?? null }));

async function seedCombos() {
  console.log("\n══════════════════════════════════════");
  console.log("  Combo Registry Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("combos");
  const now = new Date().toISOString();
  for (const c of COMBOS) {
    try {
      await db.collection("combos").doc(c.id).set({ ...c, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      const icon = c.cost === 0 ? "⚡" : `🔋${c.cost}`;
      console.log(`  ✔ ${c.name.padEnd(20)} ${icon}  ${c.sequence.join(" → ")}`);
    } catch (err) {
      console.error(`  ✘ ${c.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${COMBOS.length} combos into combos\n`);
}

seedCombos()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

// scripts/seed-element-types.js
// Seeds the 12 default element types into Firestore `element_type_configs`.
// Data mirrors client/src/types/elementTypes.ts constants. Idempotent.

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
  for (const d of snap.docs) {
    batch.delete(d.ref);
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
  console.log(`  🗑️  Cleared ${snap.size} docs from ${name}`);
}

const TYPE_MATRIX = {
  fire:      { fire:1.0, water:0.5, earth:1.5, lightning:1.0, wind:1.0, ice:2.0,  shadow:1.0, light:1.0, metal:1.0, nature:1.5, thunder:0.5, void:1.0 },
  water:     { fire:2.0, water:1.0, earth:0.5, lightning:0.5, wind:0.5, ice:0.5,  shadow:1.0, light:1.0, metal:1.5, nature:1.5, thunder:1.0, void:1.0 },
  earth:     { fire:1.0, water:1.5, earth:1.0, lightning:2.0, wind:1.0, ice:1.0,  shadow:1.0, light:1.0, metal:2.0, nature:0.5, thunder:0.5, void:1.0 },
  lightning: { fire:1.0, water:2.0, earth:0.5, lightning:1.0, wind:2.0, ice:1.0,  shadow:1.0, light:0.5, metal:1.5, nature:0.5, thunder:1.0, void:1.0 },
  wind:      { fire:1.0, water:1.5, earth:1.0, lightning:0.5, wind:1.0, ice:1.5,  shadow:1.0, light:0.5, metal:0.5, nature:2.0, thunder:0.5, void:1.0 },
  ice:       { fire:0.5, water:1.5, earth:1.5, lightning:1.0, wind:0.5, ice:1.0,  shadow:1.0, light:1.0, metal:0.5, nature:0.5, thunder:1.0, void:1.5 },
  shadow:    { fire:1.0, water:1.0, earth:1.0, lightning:1.0, wind:1.0, ice:1.0,  shadow:1.0, light:0.5, metal:1.0, nature:1.0, thunder:1.0, void:2.0 },
  light:     { fire:1.0, water:1.0, earth:1.0, lightning:1.5, wind:1.0, ice:1.0,  shadow:2.0, light:1.0, metal:0.5, nature:1.0, thunder:1.0, void:0.5 },
  metal:     { fire:1.0, water:0.5, earth:0.5, lightning:0.5, wind:2.0, ice:1.5,  shadow:1.0, light:1.5, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
  nature:    { fire:0.5, water:1.0, earth:2.0, lightning:2.0, wind:1.0, ice:1.0,  shadow:1.0, light:1.0, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
  thunder:   { fire:1.5, water:2.0, earth:0.5, lightning:1.0, wind:1.0, ice:2.0,  shadow:1.0, light:0.5, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
  void:      { fire:1.0, water:1.0, earth:1.0, lightning:1.0, wind:1.0, ice:1.0,  shadow:0.5, light:2.0, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
};

const ELEMENT_ICONS = {
  fire: "🔥", water: "💧", earth: "🌍", lightning: "⚡", wind: "💨", ice: "❄️",
  shadow: "🌑", light: "✨", metal: "⚙️", nature: "🌿", thunder: "⛈️", void: "🌀",
};

const ELEMENT_COLORS = {
  fire: "#ef4444", water: "#3b82f6", earth: "#a16207", lightning: "#eab308",
  wind: "#6ee7b7", ice: "#93c5fd", shadow: "#7c3aed", light: "#fef08a",
  metal: "#94a3b8", nature: "#22c55e", thunder: "#8b5cf6", void: "#1e1b4b",
};

const ZONE_IMMUNITIES = {
  fire:      ["ice"],
  water:     ["fire"],
  earth:     ["electric", "emp"],
  lightning: ["electric", "emp"],
  wind:      ["time_slow", "sticky", "mud"],
  ice:       ["ice"],
  light:     ["void"],
  nature:    ["drain"],
  thunder:   ["electric", "emp"],
  void:      ["lava","ice","mud","healing","emp","magnet","antigravity",
               "electric","time_slow","repulsion","size_shrink","size_grow",
               "trampoline","combo_boost","drain"],
};

const ZONE_BONUSES = {
  fire:      [{ hazardType: "fire",      stat: "spinDecayRate",    value: 0.5, mode: "mult" }],
  water:     [{ hazardType: "water",     stat: "surfaceFriction",  value: 0.0, mode: "flat" },
              { hazardType: "water",     stat: "speed",            value: 1.3, mode: "mult" }],
  lightning: [{ hazardType: "water",     stat: "damageMultiplier", value: 1.5, mode: "mult" }],
  nature:    [{ hazardType: "healing",   stat: "spinDecayRate",    value: 0.5, mode: "mult" }],
  thunder:   [{ hazardType: "electric",  stat: "powerGainRate",    value: 2.0, mode: "mult" }],
  earth:     [{ hazardType: "elevation", stat: "spinBoost",        value: 2.0, mode: "mult" }],
};

const TYPE_NAMES = {
  fire: "Fire", water: "Water", earth: "Earth", lightning: "Lightning",
  wind: "Wind", ice: "Ice", shadow: "Shadow", light: "Light",
  metal: "Metal", nature: "Nature", thunder: "Thunder", void: "Void",
};

const COLLECTION = "element_type_configs";

async function seed() {
  console.log("🌱 Seeding element_type_configs...");
  await clearCollection(COLLECTION);

  const batch = db.batch();
  for (const slug of Object.keys(TYPE_MATRIX)) {
    const ref = db.collection(COLLECTION).doc(slug);
    batch.set(ref, {
      id: slug,
      name: TYPE_NAMES[slug],
      icon: ELEMENT_ICONS[slug],
      color: ELEMENT_COLORS[slug],
      isDefault: true,
      zoneImmunities: ZONE_IMMUNITIES[slug] ?? [],
      zoneBonuses: ZONE_BONUSES[slug] ?? [],
      attackAdvantages: TYPE_MATRIX[slug],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  await batch.commit();
  console.log(`  ✅ Wrote ${Object.keys(TYPE_MATRIX).length} element type docs.`);
}

seed().catch(e => { console.error("❌ Seed failed:", e); process.exit(1); });

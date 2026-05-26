#!/usr/bin/env node
// Seed element_stat_defs collection
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

const DATA = [
  { id: "spinDecayRate", label: "Spin Decay Rate", description: "Rate of spin loss per second", category: "beyblade" },
  { id: "damageMultiplier", label: "Damage Multiplier", description: "Outgoing damage scaling", category: "combat" },
  { id: "speed", label: "Speed", description: "Movement speed modifier", category: "beyblade" },
  { id: "surfaceFriction", label: "Surface Friction", description: "Arena surface friction", category: "arena" },
  { id: "powerGainRate", label: "Power Gain Rate", description: "Rate of power meter fill", category: "beyblade" },
  { id: "spinBoost", label: "Spin Boost", description: "Flat spin increase on trigger", category: "beyblade" },
  { id: "damageReduction", label: "Damage Reduction", description: "Incoming damage reduction", category: "combat" },
  { id: "recoilFactor", label: "Recoil Factor", description: "Knockback on hit", category: "combat" },
  { id: "spinStealFactor", label: "Spin Steal Factor", description: "Spin stolen per contact", category: "combat" },
  { id: "maxSpin", label: "Max Spin", description: "Maximum spin ceiling", category: "beyblade" },
];

async function seed() {
  const col = db.collection("element_stat_defs");
  const batch = db.batch();
  for (const item of DATA) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${DATA.length} element stat defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

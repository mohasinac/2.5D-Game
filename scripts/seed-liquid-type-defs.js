#!/usr/bin/env node
// Seed liquid_type_defs collection
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
  { id: "water", label: "Water \u{1F4A7}", description: "Standard water body", color: "#3b82f6", opacity: 0.5, effects: { speedLoss: 0.3, frictionMultiplier: 1.5 } },
  { id: "lava", label: "Lava \u{1F30B}", description: "Molten rock — high damage", color: "#ef4444", opacity: 0.7, effects: { damagePerSecond: 15, speedLoss: 0.5, frictionMultiplier: 2.0 } },
  { id: "ice", label: "Ice \u{1F9CA}", description: "Frozen surface — low friction", color: "#67e8f9", opacity: 0.4, effects: { frictionMultiplier: 0.2, speedLoss: 0, freezeDuration: 2, freezeThreshold: 3 } },
  { id: "healing", label: "Healing ✨", description: "Restorative pool", color: "#4ade80", opacity: 0.4, effects: { healPerSecond: 5, speedLoss: 0.1 } },
  { id: "speedBoost", label: "Speed Boost ⚡", description: "Accelerating current", color: "#facc15", opacity: 0.3, effects: { speedBoost: 1.5, spinBoostPerSecond: 2 } },
  { id: "quicksand", label: "Quicksand \u{1F3DC}️", description: "Sinking trap", color: "#d4a574", opacity: 0.6, effects: { speedLoss: 0.7, frictionMultiplier: 3.0, spinDrainPerSecond: 5 } },
  { id: "oil", label: "Oil \u{1F6E2}️", description: "Slippery surface", color: "#1e293b", opacity: 0.5, effects: { frictionMultiplier: 0.1, speedLoss: 0, showParticles: true, particleColor: "#475569" } },
  { id: "poison", label: "Poison ☠️", description: "Toxic pool — damage + spin drain", color: "#a855f7", opacity: 0.5, effects: { damagePerSecond: 8, spinDrainPerSecond: 10, showParticles: true, particleColor: "#c084fc" } },
];

async function seed() {
  const col = db.collection("liquid_type_defs");
  const batch = db.batch();
  for (const item of DATA) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${DATA.length} liquid type defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

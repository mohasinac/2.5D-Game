#!/usr/bin/env node
// Seed hazard_type_defs collection
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
  { id: "lava", label: "Lava", description: "Molten surface damage" },
  { id: "ice", label: "Ice", description: "Low-friction frozen surface" },
  { id: "mud", label: "Mud", description: "High-friction slowdown" },
  { id: "electric", label: "Electric", description: "Shock damage on contact" },
  { id: "emp", label: "EMP", description: "Disables electronics/specials" },
  { id: "fire", label: "Fire", description: "Burning damage over time" },
  { id: "water", label: "Water", description: "Slows and drags" },
  { id: "void", label: "Void", description: "Instant elimination zone" },
  { id: "time_slow", label: "Time Slow", description: "Reduces movement speed" },
  { id: "repulsion", label: "Repulsion", description: "Pushes away from center" },
  { id: "size_shrink", label: "Size Shrink", description: "Reduces beyblade size" },
  { id: "size_grow", label: "Size Grow", description: "Increases beyblade size" },
  { id: "trampoline", label: "Trampoline", description: "Bounces beyblade upward" },
  { id: "combo_boost", label: "Combo Boost", description: "Increases combo damage" },
  { id: "drain", label: "Drain", description: "Steals spin over time" },
  { id: "healing", label: "Healing", description: "Restores spin/health" },
  { id: "magnet", label: "Magnet", description: "Pulls toward center" },
  { id: "antigravity", label: "Antigravity", description: "Reverses gravitational pull" },
  { id: "sticky", label: "Sticky", description: "Extreme friction trap" },
  { id: "elevation", label: "Elevation", description: "Height change zone" },
];

async function seed() {
  const col = db.collection("hazard_type_defs");
  const batch = db.batch();
  for (const item of DATA) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${DATA.length} hazard type defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

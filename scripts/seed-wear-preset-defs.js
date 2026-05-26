#!/usr/bin/env node
// Seed wear_preset_defs collection
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

const WEAR_PRESETS = [
  { id: "no_wear",     label: "No wear",          description: "No degradation",                    steps: [] },
  { id: "gradual_50",  label: "100→50 / 3 min",  description: "Gradual half-life wear",            steps: [{ atSecond: 0, wearLevel: 100 }, { atSecond: 180, wearLevel: 50 }] },
  { id: "full_decay",  label: "100→0 / 3 min",   description: "Complete degradation over match",   steps: [{ atSecond: 0, wearLevel: 100 }, { atSecond: 180, wearLevel: 0 }] },
  { id: "stepped",     label: "Stepped",          description: "Discrete wear stages",              steps: [{ atSecond: 0, wearLevel: 100 }, { atSecond: 60, wearLevel: 80 }, { atSecond: 120, wearLevel: 60 }, { atSecond: 180, wearLevel: 40 }] },
];

async function seed() {
  const col = db.collection("wear_preset_defs");
  const batch = db.batch();
  for (const item of WEAR_PRESETS) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${WEAR_PRESETS.length} wear preset defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

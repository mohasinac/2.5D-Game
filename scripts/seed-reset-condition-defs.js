#!/usr/bin/env node
// Seed reset_condition_defs collection
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

const RESET_CONDITIONS = [
  { id: "impact",        label: "Impact",        description: "Resets on collision impact" },
  { id: "timer",         label: "Timer",         description: "Resets after time elapsed" },
  { id: "spin_recovery", label: "Spin Recovery", description: "Resets when spin recovers" },
];

async function seed() {
  const col = db.collection("reset_condition_defs");
  const batch = db.batch();
  for (const item of RESET_CONDITIONS) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${RESET_CONDITIONS.length} reset condition defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

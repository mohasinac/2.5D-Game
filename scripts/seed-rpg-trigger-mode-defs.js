#!/usr/bin/env node
// Seed rpg_trigger_mode_defs collection
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
  { id: "enter", label: "Enter", description: "Triggered when player enters the tile" },
  { id: "interact", label: "Interact", description: "Triggered when player presses interact" },
  { id: "step", label: "Step", description: "Triggered each step on the tile" },
];

async function seed() {
  const col = db.collection("rpg_trigger_mode_defs");
  const batch = db.batch();
  for (const item of DATA) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${DATA.length} rpg trigger mode defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

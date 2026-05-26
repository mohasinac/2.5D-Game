#!/usr/bin/env node
// Seed rpg_facing_defs collection
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
  { id: "up", label: "Up", description: "Facing upward / north" },
  { id: "down", label: "Down", description: "Facing downward / south" },
  { id: "left", label: "Left", description: "Facing left / west" },
  { id: "right", label: "Right", description: "Facing right / east" },
];

async function seed() {
  const col = db.collection("rpg_facing_defs");
  const batch = db.batch();
  for (const item of DATA) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${DATA.length} rpg facing defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

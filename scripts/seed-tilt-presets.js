#!/usr/bin/env node
// Seed tilt_preset_defs collection
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

const TILT_PRESETS = [
  { id: "flat",       label: "Flat",       description: "Normal arena",        angle: 0 },
  { id: "tilted",     label: "Tilted",     description: "Slight slope",        angle: 30 },
  { id: "steep",      label: "Steep",      description: "Strong pull",         angle: 60 },
  { id: "wall_ride",  label: "Wall-Ride",  description: "Vertical arena",      angle: 90 },
  { id: "inverted",   label: "Inverted",   description: "Upside-down arena",   angle: 180 },
];

async function seed() {
  const col = db.collection("tilt_preset_defs");
  const batch = db.batch();
  for (const item of TILT_PRESETS) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${TILT_PRESETS.length} tilt preset defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

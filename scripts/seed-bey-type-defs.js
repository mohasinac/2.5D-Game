#!/usr/bin/env node
// Seed bey_type_defs collection
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

const BEY_TYPES = [
  { id: "attack",    label: "Attack",    description: "Aggressive offensive type", color: "#ef4444" },
  { id: "defense",   label: "Defense",   description: "Defensive tank type",       color: "#3b82f6" },
  { id: "stamina",   label: "Stamina",   description: "Endurance spin type",       color: "#22c55e" },
  { id: "balanced",  label: "Balanced",  description: "All-rounder type",          color: "#eab308" },
  { id: "universal", label: "Universal", description: "Fits all types",            color: "#8b5cf6" },
];

async function seed() {
  const col = db.collection("bey_type_defs");
  const batch = db.batch();
  for (const item of BEY_TYPES) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${BEY_TYPES.length} bey type defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

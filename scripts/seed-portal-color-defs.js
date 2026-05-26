#!/usr/bin/env node
// Seed portal_color_defs collection
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

const PORTAL_COLORS = [
  { id: "purple", label: "Purple", description: "Default portal color", color: "#a855f7", sortOrder: 0 },
  { id: "cyan",   label: "Cyan",   description: "Cool-toned portal",   color: "#06b6d4", sortOrder: 1 },
  { id: "green",  label: "Green",  description: "Nature portal",       color: "#10b981", sortOrder: 2 },
  { id: "orange", label: "Orange", description: "Warm-toned portal",   color: "#f97316", sortOrder: 3 },
];

async function seed() {
  const col = db.collection("portal_color_defs");
  const batch = db.batch();
  for (const item of PORTAL_COLORS) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${PORTAL_COLORS.length} portal color defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

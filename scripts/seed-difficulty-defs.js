#!/usr/bin/env node
// Seed difficulty_defs collection
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

const DIFFICULTIES = [
  { id: "easy",    label: "Easy",    description: "Beginner-friendly",    color: "#22c55e", sortOrder: 0 },
  { id: "medium",  label: "Medium",  description: "Standard challenge",   color: "#3b82f6", sortOrder: 1 },
  { id: "hard",    label: "Hard",    description: "Tough opposition",     color: "#f97316", sortOrder: 2 },
  { id: "extreme", label: "Extreme", description: "Maximum difficulty",   color: "#ef4444", sortOrder: 3 },
];

async function seed() {
  const col = db.collection("difficulty_defs");
  const batch = db.batch();
  for (const item of DIFFICULTIES) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${DIFFICULTIES.length} difficulty defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

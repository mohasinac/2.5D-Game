#!/usr/bin/env node
// Seed part_shape_defs collection
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

const PART_SHAPES = [
  { id: "circle",   label: "Circle",   description: "Round profile",           icon: "⬤" },
  { id: "ring",     label: "Ring",     description: "Hollow circle",           icon: "◎" },
  { id: "star3",    label: "Star 3",   description: "Three-pointed star",      icon: "🔺" },
  { id: "star4",    label: "Star 4",   description: "Four-pointed star",       icon: "✦" },
  { id: "star6",    label: "Star 6",   description: "Six-pointed star",        icon: "⭐" },
  { id: "triangle", label: "Triangle", description: "Three-sided polygon",     icon: "△" },
  { id: "square",   label: "Square",   description: "Four-sided polygon",      icon: "■" },
  { id: "hexagon",  label: "Hexagon",  description: "Six-sided polygon",       icon: "⬡" },
];

async function seed() {
  const col = db.collection("part_shape_defs");
  const batch = db.batch();
  for (const item of PART_SHAPES) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${PART_SHAPES.length} part shape defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

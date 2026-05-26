#!/usr/bin/env node
// Seed arena_template_defs collection
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
  { id: "classic", label: "Classic", description: "Standard circular arena", config: JSON.stringify({ shape: "circle", width: 1080, height: 1080, wallAngle: 30, theme: "metrocity" }) },
  { id: "square_arena", label: "Square Arena", description: "Square battlefield", config: JSON.stringify({ shape: "square", width: 1080, height: 1080, wallAngle: 20, theme: "forest" }) },
  { id: "hexagon_fortress", label: "Hexagon Fortress", description: "Six-sided fortress arena", config: JSON.stringify({ shape: "hexagon", width: 1080, height: 1080, wallAngle: 40, theme: "volcano" }) },
  { id: "pentagon_chaos", label: "Pentagon Chaos", description: "Five-sided chaos arena", config: JSON.stringify({ shape: "pentagon", width: 1080, height: 1080, wallAngle: 25, theme: "ice" }) },
  { id: "star_fortress", label: "Star Fortress", description: "Star-shaped battle arena", config: JSON.stringify({ shape: "star3", width: 1080, height: 1080, wallAngle: 35, theme: "space" }) },
];

async function seed() {
  const col = db.collection("arena_template_defs");
  const batch = db.batch();
  for (const item of DATA) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${DATA.length} arena template defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

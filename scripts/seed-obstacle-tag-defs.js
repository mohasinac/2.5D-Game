#!/usr/bin/env node
// Seed obstacle_tag_defs collection
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

const OBSTACLE_TAGS = [
  { id: "rock",         label: "Rock",         description: "Natural stone obstacle" },
  { id: "pillar",       label: "Pillar",       description: "Vertical column" },
  { id: "barrier",      label: "Barrier",      description: "Blocking wall segment" },
  { id: "wall",         label: "Wall",         description: "Full wall structure" },
  { id: "crystal",      label: "Crystal",      description: "Crystalline formation" },
  { id: "box",          label: "Box",          description: "Moveable container" },
  { id: "tire",         label: "Tire",         description: "Rubber tire obstacle" },
  { id: "switch",       label: "Switch",       description: "Interactive switch trigger" },
  { id: "bump",         label: "Bump",         description: "Small raised feature" },
  { id: "spin-zone",    label: "Spin Zone",    description: "Rotational force area" },
  { id: "gravity-well", label: "Gravity Well", description: "Gravitational pull zone" },
];

async function seed() {
  const col = db.collection("obstacle_tag_defs");
  const batch = db.batch();
  for (const item of OBSTACLE_TAGS) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${OBSTACLE_TAGS.length} obstacle tag defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

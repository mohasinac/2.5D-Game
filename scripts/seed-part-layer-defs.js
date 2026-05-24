#!/usr/bin/env node
// Seed part_layer_defs collection
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

const PART_LAYERS = [
  { id: "upper",    label: "Upper",    description: "Top-facing contact surface — hits above equator" },
  { id: "middle",   label: "Middle",   description: "Equatorial contact band — primary attack surface" },
  { id: "lower",    label: "Lower",    description: "Bottom-facing contact — hits below equator" },
  { id: "tip",      label: "Tip",      description: "Ground contact layer — friction and movement" },
  { id: "inner",    label: "Inner",    description: "Interior surface — contact within the blade profile" },
  { id: "outer",    label: "Outer",    description: "Outermost radius — farthest from center" },
  { id: "top",      label: "Top",      description: "Top-facing flat surface" },
  { id: "blade",    label: "Blade",    description: "Primary blade wing — main attack vector" },
  { id: "sub",      label: "Sub-Blade",description: "Secondary blade surface — supplementary contact" },
  { id: "recoil",   label: "Recoil",   description: "High-recoil surface — deflects incoming forces" },
  { id: "absorb",   label: "Absorb",   description: "Shock-absorbing layer — dampens incoming hits" },
  { id: "guard",    label: "Guard",    description: "Defensive contact layer — shields core" },
];

async function seed() {
  const col = db.collection("part_layer_defs");
  const batch = db.batch();
  for (const l of PART_LAYERS) {
    const { id, ...data } = l;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${PART_LAYERS.length} part layer defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

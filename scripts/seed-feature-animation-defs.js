#!/usr/bin/env node
// Seed feature_animation_defs collection
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

const FEATURE_ANIMATIONS = [
  { id: "pulse",          label: "Pulse (alpha wave)",  description: "Smooth alpha oscillation" },
  { id: "scale_pulse",    label: "Scale Pulse",         description: "Rhythmic scale breathing" },
  { id: "color_cycle",    label: "Color Cycle",         description: "Hue rotation loop" },
  { id: "flicker",        label: "Flicker",             description: "Rapid on/off flash" },
  { id: "alert",          label: "Alert Flash",         description: "Warning pulse pattern" },
  { id: "shimmer",        label: "Shimmer",             description: "Subtle brightness wave" },
  { id: "lightning",      label: "Lightning Sparks",    description: "Random electric bursts" },
  { id: "charged",        label: "Charging Glow",       description: "Building intensity glow" },
  { id: "ghost",          label: "Ghost Phase",         description: "Fade in/out phasing" },
  { id: "shockwave_ring", label: "Shockwave Ring",      description: "Expanding ring pulse" },
];

async function seed() {
  const col = db.collection("feature_animation_defs");
  const batch = db.batch();
  for (const item of FEATURE_ANIMATIONS) {
    const { id, ...data } = item;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${FEATURE_ANIMATIONS.length} feature animation defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

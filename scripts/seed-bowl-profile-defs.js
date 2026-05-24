#!/usr/bin/env node
// Seed bowl_profile_defs collection
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

const BOWL_PROFILES = [
  { id: "flat",      label: "Flat",         wallAngle: 0,  description: "Completely flat arena — no bowl effect" },
  { id: "shallow",   label: "Shallow Bowl",  wallAngle: 15, description: "Gentle incline — slight center gravity" },
  { id: "standard",  label: "Standard Bowl", wallAngle: 30, description: "Classic bowl profile" },
  { id: "steep",     label: "Steep Bowl",    wallAngle: 50, description: "Steep walls — strong center pull" },
  { id: "deep",      label: "Deep Bowl",     wallAngle: 65, description: "Very steep — beyblades orbit center" },
  { id: "extreme",   label: "Extreme Bowl",  wallAngle: 75, description: "Maximum wall angle — nearly vertical walls" },
  { id: "inverted",  label: "Inverted",      wallAngle: 0,  description: "Inverted dome — blades pushed outward" },
  { id: "half_pipe", label: "Half-Pipe",     wallAngle: 45, description: "One-sided wall angle — asymmetric arena" },
];

async function seed() {
  const col = db.collection("bowl_profile_defs");
  const batch = db.batch();
  for (const p of BOWL_PROFILES) {
    const { id, ...data } = p;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${BOWL_PROFILES.length} bowl profile defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

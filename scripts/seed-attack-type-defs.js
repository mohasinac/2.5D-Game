#!/usr/bin/env node
// Seed attack_type_defs collection
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

const ATTACK_TYPES = [
  { id: "smash",   label: "Smash",   multiplier: 1.4, color: "#ef4444", description: "Horizontal slam — high KO force" },
  { id: "upper",   label: "Upper",   multiplier: 1.2, color: "#f97316", description: "Vertical lift — destabilizes opponent" },
  { id: "stab",    label: "Stab",    multiplier: 1.0, color: "#eab308", description: "Forward piercing strike" },
  { id: "claw",    label: "Claw",    multiplier: 1.1, color: "#8b5cf6", description: "Multi-contact raking hit" },
  { id: "burst",   label: "Burst",   multiplier: 1.6, color: "#ec4899", description: "Burst-inducing contact type" },
  { id: "spin",    label: "Spin",    multiplier: 0.8, color: "#06b6d4", description: "Gyroscopic hit — drains enemy spin" },
  { id: "guard",   label: "Guard",   multiplier: 0.5, color: "#64748b", description: "Defensive deflection — low damage" },
  { id: "absorb",  label: "Absorb",  multiplier: 0.3, color: "#10b981", description: "Absorbs impact — converts to self spin" },
];

async function seed() {
  const col = db.collection("attack_type_defs");
  const batch = db.batch();
  for (const a of ATTACK_TYPES) {
    const { id, ...data } = a;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${ATTACK_TYPES.length} attack type defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

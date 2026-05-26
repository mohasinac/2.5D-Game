#!/usr/bin/env node
// Seed ai_difficulty_profiles collection — AI difficulty tier presets.
// Each doc defines tick interval, reaction delay, error rate, and prediction depth.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin env vars."); process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();

async function clearCollection(name) {
  const snap = await db.collection(name).get();
  if (snap.empty) return;
  let batch = db.batch(); let count = 0;
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
}

const PROFILES = [
  { id: "easy",   name: "Easy",   tickIntervalMs: 600, reactionDelayMs: 400, errorRate: 0.30, predictionTicks: 0,  usesPatternLearning: false, description: "Slow reactions, frequent errors, no prediction. For new players." },
  { id: "medium", name: "Medium", tickIntervalMs: 300, reactionDelayMs: 200, errorRate: 0.10, predictionTicks: 3,  usesPatternLearning: false, description: "Standard AI. Moderate reactions and basic prediction." },
  { id: "hard",   name: "Hard",   tickIntervalMs: 150, reactionDelayMs: 80,  errorRate: 0.03, predictionTicks: 6,  usesPatternLearning: false, description: "Fast reactions, minimal errors, 6-tick prediction." },
  { id: "hell",   name: "Hell",   tickIntervalMs: 80,  reactionDelayMs: 30,  errorRate: 0.00, predictionTicks: 10, usesPatternLearning: true,  description: "Frame-perfect reactions, zero errors, pattern learning, 10-tick prediction." },
];

async function seed() {
  console.log("Seeding ai_difficulty_profiles...");
  await clearCollection("ai_difficulty_profiles");
  let batch = db.batch(); let count = 0;
  for (const p of PROFILES) {
    const ref = db.collection("ai_difficulty_profiles").doc(p.id);
    batch.set(ref, { ...p, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
  console.log(`  Seeded ${PROFILES.length} ai_difficulty_profiles.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

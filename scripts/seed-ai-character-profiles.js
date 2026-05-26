#!/usr/bin/env node
// Seed ai_character_profiles collection — blader character AI profiles.
// Each doc defines a character's strategic tendencies (aggression, counter bias, etc.).

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
  { id: "tyson",    name: "Tyson Granger",    series: "bakuten", aggression: 0.95, counterBias: 0.30, risk: 0.85, rushBias: 1.00, specialTiming: "early", supportBias: 0.20, description: "All-out aggressive attacker. Rushes in early and relies on raw power." },
  { id: "kai",      name: "Kai Hiwatari",     series: "bakuten", aggression: 0.60, counterBias: 0.95, risk: 0.20, rushBias: 0.30, specialTiming: "late",  supportBias: 0.10, description: "Patient counter-attacker. Waits for openings and punishes mistakes." },
  { id: "tala",     name: "Tala Valkov",      series: "bakuten", aggression: 0.80, counterBias: 0.70, risk: 0.40, rushBias: 0.60, specialTiming: "mid",   supportBias: 0.15, description: "Calculated aggressor. Balances attack with strategic positioning." },
  { id: "brooklyn", name: "Brooklyn",         series: "bakuten", aggression: 0.70, counterBias: 0.85, risk: 0.60, rushBias: 0.50, specialTiming: "late",  supportBias: 0.05, description: "Prodigy with natural talent. Reads opponents and adapts mid-battle." },
  { id: "daichi",   name: "Daichi Sumeragi",  series: "bakuten", aggression: 1.00, counterBias: 0.10, risk: 1.00, rushBias: 1.00, specialTiming: "early", supportBias: 0.30, description: "Reckless berserker. Maximum aggression with zero caution." },
  { id: "max",      name: "Max Tate",         series: "bakuten", aggression: 0.40, counterBias: 0.60, risk: 0.20, rushBias: 0.20, specialTiming: "mid",   supportBias: 0.90, description: "Defensive support specialist. Prioritizes endurance and team play." },
  { id: "ray",      name: "Ray Kon",          series: "bakuten", aggression: 0.65, counterBias: 0.65, risk: 0.50, rushBias: 0.55, specialTiming: "mid",   supportBias: 0.60, description: "Well-rounded martial artist. Adapts to any matchup." },
  { id: "gingka",   name: "Gingka Hagane",    series: "mfb",     aggression: 0.85, counterBias: 0.40, risk: 0.70, rushBias: 0.80, specialTiming: "mid",   supportBias: 0.40, description: "Passionate attacker with strong determination. High-spirit fighter." },
  { id: "kyoya",    name: "Kyoya Tategami",   series: "mfb",     aggression: 0.90, counterBias: 0.50, risk: 0.80, rushBias: 0.70, specialTiming: "early", supportBias: 0.05, description: "Lone wolf attacker. Relentless pressure with wild instinct." },
  { id: "ryuga",    name: "Ryuga",            series: "mfb",     aggression: 0.75, counterBias: 0.80, risk: 0.50, rushBias: 0.40, specialTiming: "late",  supportBias: 0.00, description: "Dominating spin-stealer. Absorbs opponent energy to overwhelm." },
  { id: "valt",     name: "Valt Aoi",         series: "burst",   aggression: 0.80, counterBias: 0.35, risk: 0.65, rushBias: 0.85, specialTiming: "early", supportBias: 0.50, description: "Energetic rush-down attacker. Relies on speed and burst finishes." },
  { id: "shu",      name: "Shu Kurenai",      series: "burst",   aggression: 0.55, counterBias: 0.90, risk: 0.25, rushBias: 0.35, specialTiming: "late",  supportBias: 0.15, description: "Precise counter-attacker. Minimal wasted movement." },
];

async function seed() {
  console.log("Seeding ai_character_profiles...");
  await clearCollection("ai_character_profiles");
  let batch = db.batch(); let count = 0;
  for (const p of PROFILES) {
    const ref = db.collection("ai_character_profiles").doc(p.id);
    batch.set(ref, { ...p, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
  console.log(`  Seeded ${PROFILES.length} ai_character_profiles.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

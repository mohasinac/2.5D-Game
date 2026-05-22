// scripts/seed-combo-effects.js — seeds combo_effects Firestore collection
// Safe to re-run (uses setDoc with merge:false to replace docs).
const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

const COMBO_EFFECTS = [
  { id: "dash-l",       name: "Dash Left",        type: "dashForce",    magnitude: 0.8, durationTicks: 8,  cost: 0,  powerThreshold: 0,  cooldownMs: 800 },
  { id: "dash-r",       name: "Dash Right",       type: "dashForce",    magnitude: 0.8, durationTicks: 8,  cost: 0,  powerThreshold: 0,  cooldownMs: 800 },
  { id: "guard-hold",   name: "Guard Hold",       type: "defenseLock",  magnitude: 0.7, durationTicks: 20, cost: 0,  powerThreshold: 0,  cooldownMs: 1200 },
  { id: "feint-step",   name: "Feint Step",       type: "dashForce",    magnitude: 0.4, durationTicks: 5,  cost: 0,  powerThreshold: 0,  cooldownMs: 600 },
  { id: "riposte-burst",name: "Riposte Burst",    type: "dashForce",    magnitude: 1.2, durationTicks: 10, cost: 15, powerThreshold: 15, cooldownMs: 2000 },
  { id: "pivot-strike", name: "Pivot Strike",     type: "dashForce",    magnitude: 1.0, durationTicks: 10, cost: 15, powerThreshold: 15, cooldownMs: 1800 },
  { id: "power-thrust", name: "Power Thrust",     type: "spinBoost",    magnitude: 0.8, durationTicks: 30, cost: 25, powerThreshold: 25, cooldownMs: 3000 },
  { id: "spin-leech",   name: "Spin Leech",       type: "spinSteal",    magnitude: 0.6, durationTicks: 20, cost: 35, powerThreshold: 35, cooldownMs: 4000 },
];

async function seed() {
  console.log("Seeding combo_effects...");
  for (const effect of COMBO_EFFECTS) {
    await db.collection("combo_effects").doc(effect.id).set(effect);
    console.log(`  ✓ ${effect.id}`);
  }
  console.log(`Done — ${COMBO_EFFECTS.length} combo effects seeded.`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });

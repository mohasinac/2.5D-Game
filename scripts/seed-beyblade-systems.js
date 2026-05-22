#!/usr/bin/env node
// Seed beyblade_systems collection with 4 assembled 2.5D beyblades

require('dotenv').config();
const admin = require('firebase-admin');

const { FIREBASE_ADMIN_PROJECT_ID: projectId, FIREBASE_ADMIN_CLIENT_EMAIL: clientEmail, FIREBASE_ADMIN_PRIVATE_KEY } = process.env;
const privateKey = FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) { console.error('❌ Missing Firebase Admin env vars.'); process.exit(1); }
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });

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
  console.log(`  🗑️  Cleared ${snap.size} docs from ${name}`);
}

const beybladeySystems = [
  {
    id: "storm-aggressor",
    name: "Storm Aggressor",
    displayName: "Storm Aggressor (2.5D)",
    description: "Aggressive attack-focused assembled system",
    archetype: "attack",
    parts: {
      attackRing: "tornado-wing",
      weightDisk: "ten-heavy",
      tip: "sharp",
      core: "spin-injection",
      casing: "round",
      bitBeast: "pegasus",
      spinTrack: "st-145",
    },
    combinedWith: "fortress-leone",
    locked: false,
    lockCondition: { type: "spin_above", threshold: 70 },
    unlockCondition: { type: "spin_below", threshold: 30 },
    lockedStatMerge: { massMode: "sum", spinMode: "average", damageMode: "max" },
  },
  {
    id: "fortress-leone",
    name: "Fortress Leone",
    displayName: "Fortress Leone (2.5D)",
    description: "Defensive fortress with strong protection",
    archetype: "defense",
    parts: {
      attackRing: "spike-defense",
      weightDisk: "ten-heavy",
      tip: "rubber-flat",
      core: "standard",
      casing: "wide",
      bitBeast: "leone",
      spinTrack: "st-90",
    },
  },
  {
    id: "endurance-eagle",
    name: "Endurance Eagle",
    displayName: "Endurance Eagle (2.5D)",
    description: "Balanced stamina and endurance system",
    archetype: "stamina",
    parts: {
      attackRing: "round-stamina",
      weightDisk: "eight-balance",
      tip: "semi-flat",
      core: "standard",
      casing: "round",
      bitBeast: "pegasus",
      spinTrack: "st-90",
    },
  },
  {
    id: "upper-attacker",
    name: "Upper Attacker",
    displayName: "Upper Attacker (2.5D)",
    description: "Balanced attack and versatility",
    archetype: "balanced",
    parts: {
      attackRing: "scissor-attacker",
      weightDisk: "eight-balance",
      tip: "flat",
      core: "spin-injection",
      casing: "round",
      bitBeast: "pegasus",
      spinTrack: "st-145",
    },
  },
];

async function seed() {
  try {
    console.log("Seeding beyblade_systems collection...");
    await clearCollection("beyblade_systems");

    for (const system of beybladeySystems) {
      await db.collection("beyblade_systems").doc(system.id).set(system);
      console.log(`  ✅ Created system: ${system.name}`);
    }

    console.log("\n✅ Beyblade systems seeded successfully (4 assembled systems)!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding beyblade systems:", error);
    process.exit(1);
  }
}

seed();

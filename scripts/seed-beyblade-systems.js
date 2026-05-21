#!/usr/bin/env node
// Seed beyblade_systems collection with 4 assembled 2.5D beyblades

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../firebase-key.json');
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

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

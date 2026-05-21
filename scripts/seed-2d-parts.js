#!/usr/bin/env node
// Seed 2.5D part collections (7 collections, 19 parts total)

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../firebase-key.json');
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

const parts = {
  attack_ring_parts: [
    { id: "tornado-wing", name: "Tornado Wing", description: "Sharp aggressive design", rarity: "rare", affinity: "attack" },
    { id: "scissor-attacker", name: "Scissor Attacker", description: "Cutting blade design", rarity: "common", affinity: "attack" },
    { id: "spike-defense", name: "Spike Defense", description: "Defensive spikes", rarity: "uncommon", affinity: "defense" },
    { id: "round-stamina", name: "Round Stamina", description: "Rounded for endurance", rarity: "uncommon", affinity: "stamina" },
  ],
  weight_disk_parts: [
    { id: "ten-heavy", name: "Ten Heavy", description: "10-gram weight disk", rarity: "rare", weight: 10 },
    { id: "eight-balance", name: "Eight Balance", description: "8-gram balanced disk", rarity: "common", weight: 8 },
    { id: "six-attack", name: "Six Attack", description: "6-gram light disk", rarity: "uncommon", weight: 6 },
  ],
  tip_parts: [
    { id: "flat", name: "Flat Tip", description: "Flat contact surface", rarity: "common", friction: 0.8 },
    { id: "sharp", name: "Sharp Tip", description: "Sharp pointed tip", rarity: "rare", friction: 0.3 },
    { id: "semi-flat", name: "Semi-Flat Tip", description: "Mixed stability", rarity: "uncommon", friction: 0.6 },
    { id: "rubber-flat", name: "Rubber Flat", description: "Rubber coating", rarity: "uncommon", friction: 0.95 },
  ],
  core_parts: [
    { id: "standard", name: "Standard Core", description: "Normal core", rarity: "common" },
    { id: "spin-injection", name: "Spin Injection Core", description: "Enhanced spin transfer", rarity: "rare" },
  ],
  casing_parts: [
    { id: "round", name: "Round Casing", description: "Circular design", rarity: "common" },
    { id: "wide", name: "Wide Casing", description: "Extended surface", rarity: "uncommon" },
  ],
  bit_beast_parts: [
    { id: "pegasus", name: "Pegasus", description: "Swift and nimble beast", rarity: "rare", specialMove: "stampede-rush" },
    { id: "leone", name: "Leone", description: "Protective fierce beast", rarity: "rare", specialMove: "gyro-anchor" },
  ],
  spin_track_parts: [
    { id: "st-90", name: "ST-90", description: "90mm track", rarity: "common", height: 90 },
    { id: "st-145", name: "ST-145", description: "145mm track", rarity: "uncommon", height: 145 },
  ],
};

async function seed() {
  try {
    console.log("Seeding 2.5D part collections...");

    for (const [collection, items] of Object.entries(parts)) {
      console.log(`\n  📦 ${collection}:`);
      for (const item of items) {
        await db.collection(collection).doc(item.id).set(item);
        console.log(`    ✅ ${item.name}`);
      }
    }

    console.log("\n✅ All 2.5D parts seeded successfully (19 parts across 7 collections)!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding parts:", error);
    process.exit(1);
  }
}

seed();

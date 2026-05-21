#!/usr/bin/env node
// Seed arena_systems collection with 4 2.5D arenas

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../firebase-key.json');
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

const arenaSystems = [
  {
    id: "volcano-bowl",
    displayName: "Volcano Bowl",
    description: "A bowl-shaped arena with elevated edges pulling beyblades outward",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "volcano",
    difficulty: "medium",
    elevationMap: {
      type: "bowl",
      tiltAngle: 0,
      tiltDirection: 0,
    },
    wallProfile: {
      baseHeight: 100,
    },
    slopePhysics: {
      gravityStrength: 0.7,
    },
    wall: {
      type: "circular",
      height: 100,
    },
  },
  {
    id: "mountain-peak",
    displayName: "Mountain Peak",
    description: "A pyramid-shaped arena with peak in the center, pulling beyblades toward center",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "mountains",
    difficulty: "hard",
    elevationMap: {
      type: "pyramid",
      tiltAngle: 0,
      tiltDirection: 0,
    },
    wallProfile: {
      baseHeight: 80,
    },
    slopePhysics: {
      gravityStrength: 0.8,
    },
    wall: {
      type: "circular",
      height: 80,
    },
  },
  {
    id: "tidal-ramp",
    displayName: "Tidal Ramp",
    description: "A laterally tilted arena causing gravitational drift in one direction",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "sea",
    difficulty: "hard",
    elevationMap: {
      type: "ramp",
      tiltAngle: 15,
      tiltDirection: 90,
    },
    wallProfile: {
      baseHeight: 100,
    },
    slopePhysics: {
      gravityStrength: 0.6,
    },
    wall: {
      type: "circular",
      height: 100,
    },
  },
  {
    id: "glacier-flats",
    displayName: "Glacier Flats",
    description: "A flat arena with ice patches reducing friction and rough patches increasing it",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "forest",
    difficulty: "medium",
    elevationMap: {
      type: "flat",
      tiltAngle: 0,
      tiltDirection: 0,
    },
    wallProfile: {
      baseHeight: 100,
    },
    slopePhysics: {
      gravityStrength: 0,
      frictionMap: [
        { x: 540, y: 400, radius: 150, frictionMultiplier: 0.1 },
        { x: 540, y: 680, radius: 150, frictionMultiplier: 0.1 },
        { x: 300, y: 540, radius: 100, frictionMultiplier: 2.5 },
        { x: 780, y: 540, radius: 100, frictionMultiplier: 2.5 },
      ],
    },
    wall: {
      type: "circular",
      height: 100,
    },
  },
];

async function seed() {
  try {
    console.log("Seeding arena_systems collection...");

    for (const arena of arenaSystems) {
      await db.collection("arena_systems").doc(arena.id).set(arena);
      console.log(`  ✅ Created arena: ${arena.displayName}`);
    }

    console.log("\n✅ Arena systems seeded successfully (4 2.5D arenas)!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding arena systems:", error);
    process.exit(1);
  }
}

seed();

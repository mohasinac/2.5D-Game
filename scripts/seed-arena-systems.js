#!/usr/bin/env node
// Seed arena_systems collection with 4 2.5D arenas

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
    await clearCollection("arena_systems");

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

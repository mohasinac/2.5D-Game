#!/usr/bin/env node
// Seed core_gimmick_defs collection
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

const CORE_GIMMICKS = [
  { id: "none",             label: "None",                  description: "No gimmick — standard fixed core",          hasPhysicsImpl: false },
  { id: "mode_change",      label: "Mode Change",           description: "Core can be flipped to change part behavior",hasPhysicsImpl: true  },
  { id: "spring_launch",    label: "Spring Launch",         description: "Spring-loaded core that stores launch energy",hasPhysicsImpl: true  },
  { id: "dual_spin",        label: "Dual Spin",             description: "Allows counter-rotation mid-battle",         hasPhysicsImpl: true  },
  { id: "lock",             label: "Lock",                  description: "Locks the core at a set spin height",        hasPhysicsImpl: false },
  { id: "absorb",           label: "Absorb",                description: "Absorbs impact energy to boost spin",        hasPhysicsImpl: true  },
  { id: "gravity",          label: "Gravity Core",          description: "Heavy lower center of mass for stability",   hasPhysicsImpl: false },
  { id: "gyro",             label: "Gyro Core",             description: "Gyroscopic stabilizer — resists nutation",  hasPhysicsImpl: true  },
  { id: "magnet",           label: "Magnet Core",           description: "Magnetic field interaction gimmick",         hasPhysicsImpl: true  },
  { id: "ratchet",          label: "Ratchet",               description: "Ratchet mechanism — directional spin lock",  hasPhysicsImpl: true  },
  { id: "burst_stopper",    label: "Burst Stopper",         description: "Prevents burst by absorbing burst force",    hasPhysicsImpl: true  },
  { id: "regeneration",     label: "Regeneration",          description: "Slowly recovers spin via stored energy",     hasPhysicsImpl: true  },
];

async function seed() {
  const col = db.collection("core_gimmick_defs");
  const batch = db.batch();
  for (const g of CORE_GIMMICKS) {
    const { id, ...data } = g;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${CORE_GIMMICKS.length} core gimmick defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

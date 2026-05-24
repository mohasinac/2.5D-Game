#!/usr/bin/env node
// Seed tip_shape_defs collection
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

const TIP_SHAPES = [
  { id: "flat",          label: "Flat",          description: "Wide, low-friction contact — aggressive sliding movement" },
  { id: "sharp",         label: "Sharp",          description: "Tiny contact point — high spin retention, poor traction" },
  { id: "rubber_flat",   label: "Rubber Flat",    description: "High-grip flat tip — strong lateral burst force" },
  { id: "rubber_sharp",  label: "Rubber Sharp",   description: "Rubber-tipped sharp — grip + some stamina" },
  { id: "spike",         label: "Spike",          description: "Extremely narrow point — maximum spin retention" },
  { id: "ball",          label: "Ball",           description: "Rounded — smooth movement with moderate stamina" },
  { id: "wide_flat",     label: "Wide Flat",      description: "Very wide flat — high attack surface contact" },
  { id: "semi_flat",     label: "Semi-Flat",      description: "Between flat and sharp — balanced movement" },
  { id: "hole_flat",     label: "Hole Flat",      description: "Flat with center hole — Beyblade X rail-riding style" },
  { id: "gear_flat",     label: "Gear Flat",      description: "Gear-toothed flat — angular burst trajectory" },
  { id: "absorb",        label: "Absorb",         description: "Shock-absorbing tip — reduces recoil on hit" },
  { id: "metal_ball",    label: "Metal Ball",     description: "Hard metal sphere — durable, consistent rotation" },
  { id: "bearing",       label: "Bearing",        description: "Free-spinning bearing tip — extremely low friction" },
  { id: "rubber_ball",   label: "Rubber Ball",    description: "Rubber sphere — grip with round movement pattern" },
  { id: "fusion",        label: "Fusion",         description: "Hybrid flat/ball — switches between attack and defense" },
  { id: "extreme_flat",  label: "Extreme Flat",   description: "Largest flat tip — maximum aggression" },
];

async function seed() {
  const col = db.collection("tip_shape_defs");
  const batch = db.batch();
  for (const shape of TIP_SHAPES) {
    const { id, ...data } = shape;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${TIP_SHAPES.length} tip shape defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

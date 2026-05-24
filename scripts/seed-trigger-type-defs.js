#!/usr/bin/env node
// Seed trigger_type_defs collection
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

const TRIGGER_TYPES = [
  { id: "always",        label: "Always",          description: "Modifier is always active" },
  { id: "on_hit",        label: "On Hit",           description: "Triggers when this part makes contact" },
  { id: "on_hit_taken",  label: "On Hit Taken",     description: "Triggers when this beyblade is hit" },
  { id: "low_spin",      label: "Low Spin",         description: "Active when spin rate drops below threshold" },
  { id: "high_spin",     label: "High Spin",        description: "Active when spin rate is above threshold" },
  { id: "near_wall",     label: "Near Wall",        description: "Triggers when close to the arena boundary" },
  { id: "center_zone",   label: "Center Zone",      description: "Active when inside the center of the arena" },
  { id: "burst_risk",    label: "Burst Risk",       description: "Active when burst meter is above threshold" },
  { id: "special_active",label: "Special Active",   description: "Active while special move is being used" },
  { id: "combo_active",  label: "Combo Active",     description: "Active during a combo window" },
  { id: "on_wall_ride",  label: "On Wall Ride",     description: "Active while climbing or riding the wall" },
  { id: "tilt_high",     label: "High Tilt",        description: "Active when beyblade tilt angle is above threshold" },
];

async function seed() {
  const col = db.collection("trigger_type_defs");
  const batch = db.batch();
  for (const t of TRIGGER_TYPES) {
    const { id, ...data } = t;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${TRIGGER_TYPES.length} trigger type defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

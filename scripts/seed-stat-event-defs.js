#!/usr/bin/env node
// Seed stat_event_defs collection
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

const STAT_EVENTS = [
  { id: "collision",       label: "Collision",       description: "Part-to-part physical contact" },
  { id: "wall_hit",        label: "Wall Hit",         description: "Contact with arena boundary" },
  { id: "spin_loss",       label: "Spin Loss",        description: "Spin rate decreases beyond threshold" },
  { id: "burst",           label: "Burst",            description: "Burst event — part separation" },
  { id: "ring_out",        label: "Ring Out",         description: "Beyblade exits the arena" },
  { id: "special_used",    label: "Special Used",     description: "Special move activated" },
  { id: "combo_used",      label: "Combo Used",       description: "A combo sequence completed" },
  { id: "hit_taken",       label: "Hit Taken",        description: "This beyblade received a hit" },
  { id: "hit_delivered",   label: "Hit Delivered",    description: "This beyblade delivered a hit" },
  { id: "obstacle_hit",    label: "Obstacle Hit",     description: "Contact with an arena obstacle" },
  { id: "spin_zone",       label: "Spin Zone",        description: "Inside a spin zone feature" },
  { id: "gravity_well",    label: "Gravity Well",     description: "Captured by a gravity well" },
  { id: "low_spin_enter",  label: "Low Spin Enter",   description: "Crossed below low-spin threshold" },
  { id: "match_start",     label: "Match Start",      description: "Match begins (status → in-progress)" },
  { id: "game_win",        label: "Game Win",         description: "Won a single game in the series" },
];

async function seed() {
  const col = db.collection("stat_event_defs");
  const batch = db.batch();
  for (const e of STAT_EVENTS) {
    const { id, ...data } = e;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${STAT_EVENTS.length} stat event defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

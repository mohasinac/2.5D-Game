#!/usr/bin/env node
// Seed arena_theme_defs collection
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

const ARENA_THEMES = [
  { id: "default",   label: "Default",     color: "#3b82f6", description: "Standard blue stadium" },
  { id: "volcano",   label: "Volcano",     color: "#ef4444", description: "Fiery volcanic arena" },
  { id: "ice",       label: "Ice",         color: "#93c5fd", description: "Frozen tundra stadium" },
  { id: "forest",    label: "Forest",      color: "#22c55e", description: "Overgrown woodland arena" },
  { id: "desert",    label: "Desert",      color: "#f59e0b", description: "Sandy desert colosseum" },
  { id: "storm",     label: "Storm",       color: "#6366f1", description: "Lightning storm arena" },
  { id: "ocean",     label: "Ocean",       color: "#0ea5e9", description: "Submerged aquatic stadium" },
  { id: "space",     label: "Space",       color: "#1e1b4b", description: "Zero-gravity cosmic arena" },
  { id: "neon",      label: "Neon",        color: "#f0abfc", description: "Cyberpunk neon grid" },
  { id: "ruins",     label: "Ruins",       color: "#78716c", description: "Ancient stone ruins" },
  { id: "forbidden", label: "Forbidden",   color: "#7f1d1d", description: "Dark forbidden colosseum" },
  { id: "tournament",label: "Tournament",  color: "#d97706", description: "Official tournament gold stage" },
];

async function seed() {
  const col = db.collection("arena_theme_defs");
  const batch = db.batch();
  for (const t of ARENA_THEMES) {
    const { id, ...data } = t;
    batch.set(col.doc(id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${ARENA_THEMES.length} arena theme defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

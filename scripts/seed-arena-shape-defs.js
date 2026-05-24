#!/usr/bin/env node
// Seed arena_shape_defs collection
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

const ARENA_SHAPES = [
  { id: "circle",    label: "Circle",    vertexCount: null, description: "Standard circular stadium" },
  { id: "ellipse",   label: "Ellipse",   vertexCount: null, description: "Oval stadium — asymmetric play area" },
  { id: "square",    label: "Square",    vertexCount: 4,    description: "Four corners — sharp deflection angles" },
  { id: "pentagon",  label: "Pentagon",  vertexCount: 5,    description: "Five-sided stadium" },
  { id: "hexagon",   label: "Hexagon",   vertexCount: 6,    description: "Six-sided — moderate corner sharpness" },
  { id: "octagon",   label: "Octagon",   vertexCount: 8,    description: "Eight-sided — near-circular with flat edges" },
  { id: "triangle",  label: "Triangle",  vertexCount: 3,    description: "Sharp three-corner arena — chaotic deflections" },
  { id: "stadium",   label: "Stadium",   vertexCount: null, description: "Rounded rectangle — official stadium shape" },
  { id: "cross",     label: "Cross",     vertexCount: 12,   description: "Cross-shaped arena — multiple corridors" },
  { id: "star",      label: "Star",      vertexCount: 10,   description: "Five-pointed star — angular pockets" },
];

async function seed() {
  const col = db.collection("arena_shape_defs");
  const batch = db.batch();
  for (const s of ARENA_SHAPES) {
    const { id, ...data } = s;
    const payload = { ...data, updatedAt: new Date().toISOString() };
    if (payload.vertexCount === null) delete payload.vertexCount;
    batch.set(col.doc(id), payload, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${ARENA_SHAPES.length} arena shape defs.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

#!/usr/bin/env node
// Seed geometry_defs collection — 16 standard reusable shape primitives.
// Shapes are referenced by geometryId on arenas, parts, and zone configs.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars."); process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();

async function clearCollection(name) {
  const snap = await db.collection(name).get();
  if (snap.empty) return;
  let batch = db.batch(); let count = 0;
  for (const d of snap.docs) {
    batch.delete(d.ref);
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
}

const GEOMETRY_DEFS = [
  // ── Circles ──
  { id: "circle_xs", name: "Circle XS", type: "circle", boundingRadius: 0.5,  description: "Extra-small contact area — rubber flat / needle tips", shape: { radius: 0.5 } },
  { id: "circle_sm", name: "Circle SM", type: "circle", boundingRadius: 1.0,  description: "Small circular contact — sharp / flat tips", shape: { radius: 1.0 } },
  { id: "circle_md", name: "Circle MD", type: "circle", boundingRadius: 2.0,  description: "Medium circular contact — wide-flat / ball tips", shape: { radius: 2.0 } },
  { id: "circle_lg", name: "Circle LG", type: "circle", boundingRadius: 3.5,  description: "Large contact circle — disk / bearing tips", shape: { radius: 3.5 } },
  { id: "circle_xl", name: "Circle XL", type: "circle", boundingRadius: 5.0,  description: "Full beyblade body reference circle", shape: { radius: 5.0 } },

  // ── Rings ──
  { id: "ring_thin", name: "Ring Thin", type: "ring", boundingRadius: 3.0, description: "Thin annular ring — upper attack rings with small contact band", shape: { innerRadius: 2.5, outerRadius: 3.0 } },
  { id: "ring_wide", name: "Ring Wide", type: "ring", boundingRadius: 4.0, description: "Wide annular ring — defense layers and rubber frames", shape: { innerRadius: 2.0, outerRadius: 4.0 } },

  // ── Arc Segments ──
  { id: "arc_smash",  name: "Arc Smash",  type: "arc_segment", boundingRadius: 3.5, description: "90° smash blade — forward-facing attack protrusion", shape: { arcStart: -45, arcEnd: 45, radiusInner: 2.5, radiusOuter: 3.5 } },
  { id: "arc_upper",  name: "Arc Upper",  type: "arc_segment", boundingRadius: 3.0, description: "120° upper arc — upper attack scoop geometry", shape: { arcStart: -60, arcEnd: 60, radiusInner: 1.5, radiusOuter: 3.0 } },
  { id: "arc_wide",   name: "Arc Wide",   type: "arc_segment", boundingRadius: 4.0, description: "180° half-ring — wide defensive arc segment", shape: { arcStart: 0, arcEnd: 180, radiusInner: 2.0, radiusOuter: 4.0 } },

  // ── Polygons ──
  { id: "hex_ar",     name: "Hex AR",    type: "polygon", boundingRadius: 4.0, description: "Hexagonal attack ring template (6-sided)", shape: { sides: 6, radius: 4.0, vertices: [] } },
  { id: "square_sm",  name: "Square SM", type: "polygon", boundingRadius: 1.5, description: "Small square — compact sub-part contact face", shape: { sides: 4, radius: 1.5, vertices: [] } },
  { id: "square_md",  name: "Square MD", type: "polygon", boundingRadius: 3.0, description: "Medium square — weight disk mounting face", shape: { sides: 4, radius: 3.0, vertices: [] } },

  // ── Composite / Rail ──
  { id: "rect_rail",  name: "Rect Rail", type: "polygon", boundingRadius: 5.0, description: "Rectangular rail cross-section — Xtreme dash tip contact", shape: { sides: 4, aspectRatio: 4.0, radius: 5.0, vertices: [] } },

  // ── Fourier Profiles ──
  { id: "fourier_round",  name: "Fourier Round",  type: "fourier", boundingRadius: 4.0, description: "Smooth rotationally symmetric Fourier profile (pure DC term)", shape: { harmonics: [{ n: 0, amp: 4.0, phase: 0 }] } },
  { id: "fourier_4pt",    name: "Fourier 4-Point", type: "fourier", boundingRadius: 4.0, description: "4-contact Fourier profile — quad-spike attack ring", shape: { harmonics: [{ n: 0, amp: 3.5, phase: 0 }, { n: 4, amp: 0.5, phase: 0 }] } },
];

async function seed() {
  console.log("\n══════════════════════════════════════");
  console.log("  Geometry Defs Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("geometry_defs");
  const now = new Date().toISOString();
  for (const def of GEOMETRY_DEFS) {
    await db.collection("geometry_defs").doc(def.id).set({ ...def, createdAt: now });
    console.log(`  ✔ ${def.id.padEnd(22)} [${def.type}]  r=${def.boundingRadius}cm`);
  }
  console.log(`\n✅ Seeded ${GEOMETRY_DEFS.length} geometry defs\n`);
}

seed()
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

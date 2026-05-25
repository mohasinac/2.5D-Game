#!/usr/bin/env node
// scripts/seed-mechanic-presets.js
// Seeds mechanic_presets — common mechanic configs grouped by category for quick
// admin pick-and-apply. Each preset wraps one MechanicInstance config. Idempotent.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

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
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
  console.log(`  🗑️  Cleared ${snap.size} docs from ${name}`);
}

const PRESETS = [
  // ── Friction ──────────────────────────────────────────────────────────────────
  {
    id: "preset-mech-flat-tip-friction",
    name: "Flat Tip — Low Friction",
    category: "friction",
    description: "Standard flat plastic tip: low friction for high-speed movement.",
    mechanic: { id: "apply_friction", params: { frictionCoeff: 0.04, surfaceType: "plastic" } },
  },
  {
    id: "preset-mech-rubber-tip-friction",
    name: "Rubber Tip — High Friction",
    category: "friction",
    description: "Rubber tip: 4× friction for stamina-draining grip on attack contact.",
    mechanic: { id: "apply_friction", params: { frictionCoeff: 0.18, surfaceType: "rubber" } },
  },
  {
    id: "preset-mech-bearing-tip-friction",
    name: "Bearing Tip — Near-Zero Friction",
    category: "friction",
    description: "Ball-bearing tip: ultra-low friction for maximum stamina retention.",
    mechanic: { id: "apply_friction", params: { frictionCoeff: 0.008, surfaceType: "bearing" } },
  },
  // ── Collision ─────────────────────────────────────────────────────────────────
  {
    id: "preset-mech-smash-collision",
    name: "Smash Attack — Upper Contact",
    category: "collision",
    description: "Upper-angle smash hit: 1.5× damage multiplier, applies upward spin force.",
    mechanic: { id: "smash_collision", params: { damageMultiplier: 1.5, spinTransfer: 0.1, angleOffset: 45 } },
  },
  {
    id: "preset-mech-absorb-collision",
    name: "Absorb — Defense Recoil",
    category: "collision",
    description: "Defense-type absorb: recoils attacker backward, reduces own damage by 30%.",
    mechanic: { id: "absorb_collision", params: { recoilForce: 0.006, damageReduction: 0.3 } },
  },
  {
    id: "preset-mech-burst-risk",
    name: "Burst Risk — 3 Click",
    category: "collision",
    description: "3-click burst resistance. Standard for Burst-generation beyblades.",
    mechanic: { id: "burst_risk", params: { clickCount: 3, burstThreshold: 0.25 } },
  },
  // ── Deflection ────────────────────────────────────────────────────────────────
  {
    id: "preset-mech-outer-deflect",
    name: "Outer Deflection — Wide AR",
    category: "deflection",
    description: "Wide attack ring deflects opponent outward on contact. Good for ring-out play.",
    mechanic: { id: "deflect_outer", params: { deflectAngle: 30, forceMagnitude: 0.004 } },
  },
  {
    id: "preset-mech-inner-deflect",
    name: "Inner Deflection — Defense Bowl",
    category: "deflection",
    description: "Curved casing deflects attacker inward, protecting the tip.",
    mechanic: { id: "deflect_inner", params: { deflectAngle: -20, forceMagnitude: 0.003 } },
  },
  // ── Gimmick Triggers ─────────────────────────────────────────────────────────
  {
    id: "preset-mech-mode-change",
    name: "Mode Change — Attack↔Defense",
    category: "gimmick",
    description: "Centrifugal mode change at 60% spin: switches between attack and defense mode.",
    mechanic: { id: "mode_change", params: { triggerSpinRatio: 0.6, modeA: "attack", modeB: "defense" } },
  },
  {
    id: "preset-mech-spring-launch",
    name: "Spring Launch — EG Assist",
    category: "gimmick",
    description: "Engine Gear spring-wound mechanism: initial spin boost at launch (+20% spin).",
    mechanic: { id: "spring_launch", params: { spinBonus: 0.2, windupMs: 5000, releaseMode: "first" } },
  },
  {
    id: "preset-mech-free-spin",
    name: "Free Spin — Tip Layer",
    category: "friction",
    description: "Tip free-spins independently from the main body; reduces recoil transfer.",
    mechanic: { id: "free_spin_tip", params: { transferRatio: 0.15 } },
  },
];

async function seed() {
  console.log("\n════════════════════════════════════════");
  console.log("  Mechanic Presets Seed");
  console.log("════════════════════════════════════════\n");
  await clearCollection("mechanic_presets");
  const now = new Date().toISOString();
  for (const p of PRESETS) {
    try {
      await db.collection("mechanic_presets").doc(p.id).set({ ...p, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      console.log(`  ✔ [${p.category.padEnd(11)}] ${p.name}`);
    } catch (err) {
      console.error(`  ✘ ${p.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${PRESETS.length} mechanic presets into mechanic_presets\n`);
}

seed()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

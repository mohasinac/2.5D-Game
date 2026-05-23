#!/usr/bin/env node
// Seed gimmick_defs collection — 27 gimmick entries (22 original + 5 new).
// Each gimmick_def contains behaviorRefs compiled into MechanicInstance.steps[]
// via server/utils/gimmickExpander.ts at match start.

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
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
}

// 27 gimmick_defs — gimmick IDs referenced by beyblade_stats.gimmickIds[]
const GIMMICK_DEFS = [
  // ─── 22 Original gimmicks ──────────────────────────────────────────────────
  {
    id: "energy_core",
    name: "Energy Core",
    description: "Stores and releases kinetic energy for power spikes.",
    beybladeTypes: ["attack", "balanced"],
    behaviorRefs: [
      { behaviorId: "energy_reserve", params: { rechargeRate: 2, spinBoost: 200 } },
    ],
  },
  {
    id: "speed_boost_tip",
    name: "Speed Boost Tip",
    description: "Low-contact-area tip for maximum speed.",
    beybladeTypes: ["attack"],
    behaviorRefs: [
      { behaviorId: "velocity_burst", params: { forceX: 0.06, forceY: 0 } },
    ],
  },
  {
    id: "heavy_metal_disc",
    name: "Heavy Metal Disc",
    description: "Extra mass in the disc for superior defensive stability.",
    beybladeTypes: ["defense"],
    behaviorRefs: [
      { behaviorId: "weight_shift", params: { shiftMagnitude: 0.025 } },
      { behaviorId: "burst_suppress", params: { suppressMs: 2500 } },
    ],
  },
  {
    id: "recoil_guard",
    name: "Recoil Guard",
    description: "Rubber layer absorbs incoming recoil on contact.",
    beybladeTypes: ["defense", "balanced"],
    behaviorRefs: [
      { behaviorId: "rubber_grip", params: { frictionBoost: 0.025 } },
      { behaviorId: "contact_deflect", params: { deflectForceMult: 1.2 } },
    ],
  },
  {
    id: "free_spin_tip",
    name: "Free Spin Tip",
    description: "Bearing tip with near-zero friction for endurance.",
    beybladeTypes: ["stamina"],
    behaviorRefs: [
      { behaviorId: "free_spin", params: { decayReduction: 0.45 } },
      { behaviorId: "bearing_drift", params: { driftFactor: 0.85 } },
    ],
  },
  {
    id: "spin_absorber",
    name: "Spin Absorber",
    description: "Specialized contact points that steal spin on every hit.",
    beybladeTypes: ["stamina"],
    behaviorRefs: [
      { behaviorId: "spin_transfer", params: { stealFraction: 0.1 } },
      { behaviorId: "spin_steal_coupling", params: { stealBase: 0.06 } },
    ],
  },
  {
    id: "mode_change",
    name: "Mode Change",
    description: "Click-to-change tip allows switching between attack and defense modes.",
    beybladeTypes: ["balanced"],
    behaviorRefs: [
      { behaviorId: "mode_switch", params: { modes: ["attack", "defense"] } },
    ],
  },
  {
    id: "dual_tip",
    name: "Dual Tip",
    description: "Combines a flat tip with a point for versatile movement.",
    beybladeTypes: ["balanced"],
    behaviorRefs: [
      { behaviorId: "bearing_drift", params: { driftFactor: 0.6 } },
      { behaviorId: "surface_friction_modifier", params: { frictionMultiplier: 0.7 } },
    ],
  },
  {
    id: "smash_attack_ring",
    name: "Smash Attack Ring",
    description: "Wide flat blades for maximum smash impact.",
    beybladeTypes: ["attack"],
    behaviorRefs: [
      { behaviorId: "smash_impact", params: { impactMult: 1.5 } },
    ],
  },
  {
    id: "upper_attack_ring",
    name: "Upper Attack Ring",
    description: "Slanted blades launch opponents upward.",
    beybladeTypes: ["attack"],
    behaviorRefs: [
      { behaviorId: "upper_launch", params: { upwardForce: 0.07, forwardForce: 0.09 } },
    ],
  },
  {
    id: "barrage_ring",
    name: "Barrage Ring",
    description: "Multi-blade ring delivers rapid contact hits.",
    beybladeTypes: ["attack"],
    behaviorRefs: [
      { behaviorId: "barrage_hit", params: { hitCount: 4, intervalTicks: 4 } },
    ],
  },
  {
    id: "counter_spin",
    name: "Counter Spin",
    description: "Left-spin compatibility grants bonus damage against right-spin opponents.",
    beybladeTypes: ["attack", "stamina"],
    behaviorRefs: [
      { behaviorId: "spin_direction_bonus", params: { damageBonus: 1.3, matchRequired: false } },
    ],
  },
  {
    id: "gyro_defense_disc",
    name: "Gyro Defense Disc",
    description: "Heavy wide disc stabilizes center of gravity for maximum defense.",
    beybladeTypes: ["defense"],
    behaviorRefs: [
      { behaviorId: "center_pull", params: { strength: 0.0015 } },
      { behaviorId: "spring_recoil", params: { recoilMult: 1.8 } },
    ],
  },
  {
    id: "rubber_tip",
    name: "Rubber Tip",
    description: "High-grip rubber tip for controlled movement and catch attacks.",
    beybladeTypes: ["defense", "attack"],
    behaviorRefs: [
      { behaviorId: "rubber_grip", params: { frictionBoost: 0.04 } },
    ],
  },
  {
    id: "orbit_tip",
    name: "Orbit Tip",
    description: "Wide flat tip enables orbital stadium riding.",
    beybladeTypes: ["stamina", "balanced"],
    behaviorRefs: [
      { behaviorId: "orbit_movement", params: { intensity: 0.004, direction: "cw" } },
    ],
  },
  {
    id: "spin_equalizer",
    name: "Spin Equalizer",
    description: "On contact, equalizes spin between beys — useful in same-spin matchups.",
    beybladeTypes: ["stamina"],
    behaviorRefs: [
      { behaviorId: "spin_equalization", params: { equalizeRate: 0.06 } },
    ],
  },
  {
    id: "burst_ring",
    name: "Burst Ring",
    description: "Specialized sub-part launches a burst projectile on contact.",
    beybladeTypes: ["attack"],
    behaviorRefs: [
      { behaviorId: "sub_part_burst", params: { speed: 0.06 } },
    ],
  },
  {
    id: "recovery_disc",
    name: "Recovery Disc",
    description: "Passive spin recovery built into the disc layer.",
    beybladeTypes: ["stamina", "balanced"],
    behaviorRefs: [
      { behaviorId: "stamina_recovery", params: { recoveryRate: 25 } },
    ],
  },
  {
    id: "anti_gravity_tip",
    name: "Anti-Gravity Tip",
    description: "Tip geometry reduces effective gravity pull for arena float.",
    beybladeTypes: ["stamina"],
    behaviorRefs: [
      { behaviorId: "zero_g_float", params: { gravityScale: 0.25 } },
    ],
  },
  {
    id: "magnet_bit",
    name: "Magnet Bit",
    description: "Magnetic bit beast chip creates pull/repel effect against nearby beys.",
    beybladeTypes: ["balanced"],
    behaviorRefs: [
      { behaviorId: "magnetic_pull", params: { strength: 0.0035, attract: true } },
    ],
  },
  {
    id: "revival_core",
    name: "Revival Core",
    description: "Internal mechanism triggers a spin revival when near elimination.",
    beybladeTypes: ["stamina", "defense"],
    behaviorRefs: [
      { behaviorId: "revival_spin", params: { threshold: 0.12, burstAmount: 450 } },
    ],
  },
  {
    id: "height_gate_blade",
    name: "Height Gate Blade",
    description: "Blade only contacts at raised height — avoids low-spin tip attacks.",
    beybladeTypes: ["defense"],
    behaviorRefs: [
      { behaviorId: "contact_height_gate", params: { minHeightCm: 2.5 } },
    ],
  },

  // ─── 5 New gimmicks (Phase 20 engine) ──────────────────────────────────────
  {
    id: "magnacore_repel",
    name: "MagnaCore Repel",
    description: "Strong magnetic repulsion pushes away nearby beys.",
    beybladeTypes: ["defense", "balanced"],
    behaviorRefs: [
      { behaviorId: "magnetic_pull", params: { strength: 0.006, attract: false } },
    ],
  },
  {
    id: "magnacore_attract",
    name: "MagnaCore Attract",
    description: "Strong magnetic attraction pulls nearby beys in — predatory spin stealer.",
    beybladeTypes: ["attack", "stamina"],
    behaviorRefs: [
      { behaviorId: "magnetic_pull", params: { strength: 0.006, attract: true } },
      { behaviorId: "spin_steal_coupling", params: { stealBase: 0.04 } },
    ],
  },
  {
    id: "dual_spin_launch",
    name: "Dual Spin Launch",
    description: "Special launcher gimmick enabling both CW and CCW spin at launch.",
    beybladeTypes: ["attack", "balanced"],
    behaviorRefs: [
      { behaviorId: "rotation_reverse", params: {} },
      { behaviorId: "velocity_burst", params: { forceX: 0.05, forceY: 0 } },
    ],
  },
  {
    id: "mode_switch_tip",
    name: "Mode Switch Tip",
    description: "Tip physically changes shape based on spin speed threshold.",
    beybladeTypes: ["balanced"],
    behaviorRefs: [
      { behaviorId: "spin_threshold_switch", params: { threshold: 0.4 } },
      { behaviorId: "mode_switch", params: { modes: ["stamina", "attack"] } },
    ],
  },
  {
    id: "spring_launch",
    name: "Spring Launch",
    description: "Coiled spring in the tip gives a burst of speed on demand.",
    beybladeTypes: ["attack"],
    behaviorRefs: [
      { behaviorId: "spring_recoil", params: { recoilMult: 2.5 } },
      { behaviorId: "velocity_burst", params: { forceX: 0.10, forceY: 0 } },
    ],
  },
];

async function seed() {
  console.log("\n══════════════════════════════════════");
  console.log("  Gimmick Defs Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("gimmick_defs");
  const now = new Date().toISOString();
  for (const def of GIMMICK_DEFS) {
    await db.collection("gimmick_defs").doc(def.id).set({ ...def, createdAt: now });
    const refs = def.behaviorRefs.map(r => r.behaviorId).join(", ");
    console.log(`  ✔ ${def.id.padEnd(26)} → ${refs}`);
  }
  console.log(`\n✅ Seeded ${GIMMICK_DEFS.length} gimmick defs\n`);
}

seed()
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

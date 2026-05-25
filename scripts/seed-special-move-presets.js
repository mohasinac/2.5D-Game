#!/usr/bin/env node
// scripts/seed-special-move-presets.js
// Seeds special_move_presets — "quick preset" cards admins pick when configuring
// a beyblade's special move slot. Each preset is a ready-to-use SpecialMoveConfig
// with recommended thresholds and visual effect configs. Idempotent.

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
  {
    id: "preset-stampede-rush",
    name: "Stampede Rush",
    description: "Attack archetype: linear force burst in facing direction + spin boost. Best on high-attack beyblades (attack ≥ 100).",
    archetype: "attack",
    icon: "⚡",
    recommendedBeyType: "attack",
    recommendedAttackMin: 100,
    config: {
      name: "Stampede Rush",
      steps: [
        { type: "apply_force", direction: "facing", magnitude: 0.005, durationTicks: 10 },
        { type: "spin_boost", amount: 1.8, durationTicks: 5 },
      ],
      cancelable: true,
      locksDurationTicks: 20,
      powerCost: 100,
    },
    visual: { particleColor: "#ff6600", screenFlashColor: "#ff4444", iconEmoji: "⚡", animationType: "rush" },
    physics: { forceMultiplier: 0.005, spinMultiplier: 1.8, staminaRecovery: 0, invulnerabilityMs: 0, speedBurstMs: 500 },
  },
  {
    id: "preset-gyro-anchor",
    name: "Gyro Anchor",
    description: "Defense archetype: zero linear velocity, maximize spin, 1.5s invulnerability. Best on high-defense beyblades (defense ≥ 100).",
    archetype: "defense",
    icon: "🛡️",
    recommendedBeyType: "defense",
    recommendedDefenseMin: 100,
    config: {
      name: "Gyro Anchor",
      steps: [
        { type: "zero_velocity", durationTicks: 0 },
        { type: "spin_maximize", durationTicks: 0 },
        { type: "invulnerability", durationMs: 1500 },
      ],
      cancelable: false,
      locksDurationTicks: 90,
      powerCost: 100,
    },
    visual: { particleColor: "#4488ff", screenFlashColor: "#2266cc", iconEmoji: "🛡️", animationType: "anchor" },
    physics: { forceMultiplier: 0, spinMultiplier: 2.0, staminaRecovery: 0, invulnerabilityMs: 1500, speedBurstMs: 0 },
  },
  {
    id: "preset-spin-recovery",
    name: "Spin Recovery",
    description: "Stamina archetype: orbital force (circular path), gradual spin recovery over 2s. Best on high-stamina beyblades (stamina ≥ 100).",
    archetype: "stamina",
    icon: "🌀",
    recommendedBeyType: "stamina",
    recommendedStaminaMin: 100,
    config: {
      name: "Spin Recovery",
      steps: [
        { type: "orbital_force", durationTicks: 60 },
        { type: "spin_recovery_gradual", amount: 0.3, durationTicks: 120 },
      ],
      cancelable: true,
      locksDurationTicks: 60,
      powerCost: 100,
    },
    visual: { particleColor: "#44ff88", screenFlashColor: "#22aa55", iconEmoji: "🌀", animationType: "orbit" },
    physics: { forceMultiplier: 0.002, spinMultiplier: 1.0, staminaRecovery: 0.3, invulnerabilityMs: 0, speedBurstMs: 0 },
  },
  {
    id: "preset-tactical-burst",
    name: "Tactical Burst",
    description: "Balanced archetype: directional burst + 20% spin recovery. Works on any beyblade type.",
    archetype: "balanced",
    icon: "💥",
    recommendedBeyType: "balanced",
    config: {
      name: "Tactical Burst",
      steps: [
        { type: "apply_force", direction: "facing", magnitude: 0.003, durationTicks: 8 },
        { type: "spin_recovery_gradual", amount: 0.2, durationTicks: 30 },
      ],
      cancelable: true,
      locksDurationTicks: 30,
      powerCost: 100,
    },
    visual: { particleColor: "#cc88ff", screenFlashColor: "#8833cc", iconEmoji: "💥", animationType: "burst" },
    physics: { forceMultiplier: 0.003, spinMultiplier: 1.2, staminaRecovery: 0.2, invulnerabilityMs: 0, speedBurstMs: 300 },
  },
  {
    id: "preset-defensive-surge",
    name: "Defensive Surge",
    description: "High-mass defense: brief knockback immunity + recoil push on impact. Pairs with defense-type heavy weight disks.",
    archetype: "defense",
    icon: "🔵",
    recommendedBeyType: "defense",
    config: {
      name: "Defensive Surge",
      steps: [
        { type: "invulnerability", durationMs: 800 },
        { type: "recoil_on_hit", multiplier: 2.0, durationTicks: 60 },
      ],
      cancelable: false,
      locksDurationTicks: 70,
      powerCost: 100,
    },
    visual: { particleColor: "#0088ff", screenFlashColor: "#0044cc", iconEmoji: "🔵", animationType: "shield" },
    physics: { forceMultiplier: 0, spinMultiplier: 1.3, staminaRecovery: 0, invulnerabilityMs: 800, speedBurstMs: 0 },
  },
  {
    id: "preset-rapid-strike",
    name: "Rapid Strike",
    description: "Attack archetype — 3-hit rapid attack sequence. Each hit deals 1.4x damage. Works best with smash-type contact points.",
    archetype: "attack",
    icon: "🗡️",
    recommendedBeyType: "attack",
    config: {
      name: "Rapid Strike",
      steps: [
        { type: "attack_sequence", hits: 3, damageMultiplier: 1.4, intervalTicks: 8 },
      ],
      cancelable: true,
      locksDurationTicks: 40,
      powerCost: 100,
    },
    visual: { particleColor: "#ff2222", screenFlashColor: "#cc0000", iconEmoji: "🗡️", animationType: "slash" },
    physics: { forceMultiplier: 0.004, spinMultiplier: 1.5, staminaRecovery: 0, invulnerabilityMs: 0, speedBurstMs: 400 },
  },
];

async function seed() {
  console.log("\n══════════════════════════════════════════════");
  console.log("  Special Move Presets Seed");
  console.log("══════════════════════════════════════════════\n");
  await clearCollection("special_move_presets");
  const now = new Date().toISOString();
  for (const p of PRESETS) {
    try {
      await db.collection("special_move_presets").doc(p.id).set({ ...p, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      console.log(`  ✔ [${p.archetype.padEnd(8)}] ${p.name}`);
    } catch (err) {
      console.error(`  ✘ ${p.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${PRESETS.length} special move presets into special_move_presets\n`);
}

seed()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

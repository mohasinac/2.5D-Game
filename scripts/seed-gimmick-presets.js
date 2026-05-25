#!/usr/bin/env node
// scripts/seed-gimmick-presets.js
// Seeds gimmick_presets — each of the 27 gimmick_defs re-packaged as a
// "pick-and-apply" preset card with description and recommended part types.
// Idempotent.

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

// Each entry mirrors a gimmick_def from seed-gimmicks.js, wrapped as a preset card.
const PRESETS = [
  { id: "preset-gimmick-rubber-flat",     gimmickId: "rubber_flat_tip",      name: "Rubber Flat Tip",     recommendedParts: ["tip"],        category: "friction",    description: "High-grip rubber flat tip — aggressive movement, good for attack combos." },
  { id: "preset-gimmick-bearing-sharp",   gimmickId: "bearing_sharp",        name: "Bearing Sharp",       recommendedParts: ["tip"],        category: "stamina",     description: "Ultra-low friction sharp bearing tip — maximum spin retention." },
  { id: "preset-gimmick-free-spin-base",  gimmickId: "free_spin_base",       name: "Free-Spin Base",      recommendedParts: ["tip","core"],  category: "defense",     description: "Free-spinning base layer reduces recoil transfer from hits." },
  { id: "preset-gimmick-wide-defense-wd", gimmickId: "wide_defense_wd",      name: "Wide Defense WD",     recommendedParts: ["weight_disk"], category: "defense",     description: "Wide-rim weight distribution — maximizes outward centrifugal stability." },
  { id: "preset-gimmick-heavy-attack-wd", gimmickId: "heavy_attack_wd",      name: "Heavy Attack WD",     recommendedParts: ["weight_disk"], category: "attack",      description: "Forward-weighted disk — concentrates mass for smash attack power." },
  { id: "preset-gimmick-eg-spring",       gimmickId: "engine_gear_spring",   name: "Engine Gear Spring",  recommendedParts: ["core"],        category: "launch",      description: "Spring-wound launch mechanism — boosts initial spin by up to 20%." },
  { id: "preset-gimmick-first-clutch",    gimmickId: "first_clutch",         name: "First Clutch",        recommendedParts: ["core"],        category: "launch",      description: "Releases spring at launch start — maximum burst speed from the first second." },
  { id: "preset-gimmick-final-clutch",    gimmickId: "final_clutch",         name: "Final Clutch",        recommendedParts: ["core"],        category: "stamina",     description: "Reserves spring energy for late match — spin recovery at critical low-spin." },
  { id: "preset-gimmick-mode-change-ar",  gimmickId: "mode_change_ar",       name: "Mode Change AR",      recommendedParts: ["attack_ring"], category: "hybrid",      description: "Attack ring flips between attack and defense orientation mid-match at threshold spin." },
  { id: "preset-gimmick-dual-spin",       gimmickId: "dual_spin_launch",     name: "Dual Spin Launch",    recommendedParts: ["core","tip"],  category: "launch",      description: "Launches with contra-rotation; outer and inner bodies spin opposite directions." },
  { id: "preset-gimmick-magnacore-rep",   gimmickId: "magnacore_repel",      name: "Magnacore Repel",     recommendedParts: ["core"],        category: "defense",     description: "Magnetic core repels opponent beyblades on close approach." },
  { id: "preset-gimmick-magnacore-att",   gimmickId: "magnacore_attract",    name: "Magnacore Attract",   recommendedParts: ["core"],        category: "attack",      description: "Magnetic core attracts opponent beyblades — pulls them into the contact zone." },
  { id: "preset-gimmick-spring-tip",      gimmickId: "mode_switch_tip",      name: "Mode-Switch Tip",     recommendedParts: ["tip"],         category: "hybrid",      description: "Tip switches between two friction profiles based on current spin ratio." },
  { id: "preset-gimmick-spring-launch2",  gimmickId: "spring_launch",        name: "Spring Launch",       recommendedParts: ["core"],        category: "launch",      description: "Generic spring launch boost — not clutch-specific, always fires at launch." },
  { id: "preset-gimmick-upper-smash",     gimmickId: "upper_smash_ar",       name: "Upper Smash AR",      recommendedParts: ["attack_ring"], category: "attack",      description: "Attack ring upper blades apply upward force on impact — 1.4× upper damage." },
  { id: "preset-gimmick-counter-smash",   gimmickId: "counter_smash_ar",     name: "Counter Smash AR",    recommendedParts: ["attack_ring"], category: "defense",     description: "AR absorbs hit and returns 80% of force as counter recoil." },
  { id: "preset-gimmick-spin-steal",      gimmickId: "spin_steal_tip",       name: "Spin Steal Tip",      recommendedParts: ["tip"],        category: "stamina",     description: "Rubber tip channels contact friction into spin transfer — steals 6% spin per hit." },
  { id: "preset-gimmick-destabilize",     gimmickId: "destabilize_casing",   name: "Destabilize Casing",  recommendedParts: ["casing"],      category: "attack",      description: "Casing shape induces precession in opponents on hit — reduces their stability." },
  { id: "preset-gimmick-burst-stopper",   gimmickId: "burst_stopper",        name: "Burst Stopper",       recommendedParts: ["core","casing"],category:"defense",      description: "High burst resistance: 5-click lock mechanism resists accidental burst." },
  { id: "preset-gimmick-gyro-guard",      gimmickId: "gyro_guard",           name: "Gyro Guard",          recommendedParts: ["core","tip"],  category: "defense",     description: "Gyroscopic stability booster: reduces wobble amplitude at < 40% spin." },
  { id: "preset-gimmick-wall-ride",       gimmickId: "wall_ride_casing",     name: "Wall Ride Casing",    recommendedParts: ["casing"],      category: "arena",       description: "Angled casing enables wall adhesion in tilted-arena 2.5D physics." },
  { id: "preset-gimmick-compact-wd",      gimmickId: "compact_wd",           name: "Compact WD",          recommendedParts: ["weight_disk"], category: "stamina",     description: "Narrow disk reduces air resistance — best for endurance stamina builds." },
  { id: "preset-gimmick-bit-beast-amp",   gimmickId: "bit_beast_amplify",    name: "Bit Beast Amplify",   recommendedParts: ["bit_beast"],   category: "special",     description: "Bit beast amplifies special move damage by 25% when at full power." },
  { id: "preset-gimmick-recoil-absorb",   gimmickId: "recoil_absorb_wd",     name: "Recoil Absorb WD",    recommendedParts: ["weight_disk"], category: "defense",     description: "Dampened WD absorbs recoil from hits — reduces pushback by 40%." },
  { id: "preset-gimmick-heavy-attack2",   gimmickId: "heavy_contact_ar",     name: "Heavy Contact AR",    recommendedParts: ["attack_ring"], category: "attack",      description: "Thick AR blades deal 1.6× smash damage but reduce agility." },
  { id: "preset-gimmick-spin-track-h",    gimmickId: "spin_track_height",    name: "Spin Track Height",   recommendedParts: ["spin_track"],  category: "defense",     description: "Height adjustment — raises center of mass for stability against upper attacks." },
  { id: "preset-gimmick-combo-amplify",   gimmickId: "combo_amplify",        name: "Combo Amplify",       recommendedParts: ["attack_ring","core"], category: "combo", description: "Reduces combo power cost by 10% for all equipped combos." },
];

async function seed() {
  console.log("\n════════════════════════════════════════");
  console.log("  Gimmick Presets Seed");
  console.log("════════════════════════════════════════\n");
  await clearCollection("gimmick_presets");
  const now = new Date().toISOString();
  for (const p of PRESETS) {
    try {
      await db.collection("gimmick_presets").doc(p.id).set({ ...p, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      console.log(`  ✔ [${p.category.padEnd(9)}] ${p.name}`);
    } catch (err) {
      console.error(`  ✘ ${p.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${PRESETS.length} gimmick presets into gimmick_presets\n`);
}

seed()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

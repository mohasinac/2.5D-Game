// scripts/seed-turret-attack-types.js
// Seeds turret attack type catalog to Firestore `turret_attack_types` collection.
// Used by the arena editor TurretsTab to populate SearchableSelect. Idempotent.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars.");
  process.exit(1);
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

const TURRET_ATTACK_TYPES = [
  { id: "periodic",          label: "Periodic",          description: "Regular bullet bursts at fixed intervals.",           icon: "🔄" },
  { id: "beam",              label: "Beam",               description: "Continuous laser beam that damages on contact.",       icon: "⚡" },
  { id: "aoe",               label: "AOE Blast",          description: "Area-of-effect missile explosion.",                    icon: "💥" },
  { id: "boomerang",         label: "Boomerang",          description: "Returning projectile that curves back to origin.",     icon: "🪃" },
  { id: "random",            label: "Random",             description: "Unpredictable shot patterns.",                         icon: "🎲" },
  { id: "laser_sweep",       label: "Laser Sweep",        description: "Sweeping laser beam across the arena.",               icon: "🔦" },
  { id: "sniper",            label: "Sniper",             description: "High-damage precision shot at a single target.",       icon: "🎯" },
  { id: "shotgun",           label: "Shotgun",            description: "Wide spread of projectiles at close range.",           icon: "💢" },
  { id: "mine_layer",        label: "Mine Layer",         description: "Drops proximity mines on the arena floor.",           icon: "💣" },
  { id: "gravity_cannon",    label: "Gravity Cannon",     description: "Pulls targets toward impact zone.",                   icon: "🌀" },
  { id: "emp",               label: "EMP",                description: "Electromagnetic pulse that drains spin on hit.",      icon: "⚡" },
  { id: "tracking_missile",  label: "Tracking Missile",   description: "Homing missile that follows the nearest target.",     icon: "🚀" },
  { id: "burst_fire",        label: "Burst Fire",         description: "Rapid three-shot burst in quick succession.",         icon: "💫" },
  { id: "plasma_ring",       label: "Plasma Ring",        description: "Expanding ring of plasma that damages on contact.",   icon: "🔵" },
  { id: "tractor_beam",      label: "Tractor Beam",       description: "Pulls targets toward the turret continuously.",       icon: "🔮" },
  // ── Dragon Ball ────────────────────────────────────────────────────────────
  { id: "kamehameha",        label: "Kamehameha",         description: "[Goku] Energy wave beam — focused line, high damage.",            icon: "🌊" },
  { id: "spirit_bomb",       label: "Spirit Bomb",        description: "[Goku] Gathered energy — long charge then massive AoE.",          icon: "💙" },
  { id: "final_flash",       label: "Final Flash",        description: "[Vegeta] Maximum-power beam — obliterates single target.",        icon: "⚡" },
  { id: "death_beam",        label: "Death Beam",         description: "[Frieza] Precision death ray — instant piercing damage.",         icon: "☠️" },
  { id: "gohan_masenko",     label: "Masenko",            description: "[Gohan] Focused downward energy beam.",                           icon: "🔥" },
  { id: "gohan_power_up",    label: "Hidden Power",       description: "[Gohan] Unlocks hidden power — +50% damage for 8s.",             icon: "💪" },
  { id: "gohan_mystic_unleash", label: "Mystic Unleash",  description: "[Gohan] Ultimate AoE burst, scales with target HP loss.",        icon: "✨" },
  { id: "galick_gun",        label: "Galick Gun",         description: "[Vegeta] Wide-cone energy beam.",                                icon: "💜" },
  { id: "big_bang_attack",   label: "Big Bang Attack",    description: "[Vegeta] Point-blank sphere, high damage + knockback.",          icon: "🌟" },
  { id: "final_explosion",   label: "Final Explosion",    description: "[Vegeta] Sacrifice AoE nuke — turret dormant 10s.",              icon: "💀" },
  { id: "solar_kamehameha",  label: "Solar Kamehameha",   description: "[Cell] Double-width superbeam.",                                 icon: "☀️" },
  { id: "cell_jr_spawn",     label: "Cell Jr. Spawn",     description: "[Cell] Spawns 3 seeker Cell Jr. units that deal ticking damage.", icon: "🦠" },
  { id: "perfect_form_cell", label: "Perfect Form",       description: "[Cell] Range +50%, damage +30% for 8s.",                        icon: "💠" },
  { id: "chocolate_beam",    label: "Chocolate Beam",     description: "[Buu] Drains target spin to 0 for 2s.",                         icon: "🍫" },
  { id: "buu_absorption",    label: "Absorption",         description: "[Buu] Copies target's dominant stat as temporary buff.",         icon: "🫦" },
  { id: "kid_buu_scream",    label: "Primal Scream",      description: "[Kid Buu] Omnidirectional AoE shockwave.",                      icon: "😱" },
  { id: "death_ball",        label: "Death Ball",         description: "[Frieza] Massive sphere, huge AoE explosion after 1.5s.",       icon: "🔴" },
  { id: "nova_strike",       label: "Nova Strike",        description: "[Frieza] High-speed ramming dash.",                              icon: "🏎️" },
  { id: "golden_frieza",     label: "Golden Form",        description: "[Frieza] All damage ×2.5 for 8s.",                              icon: "👑" },
  // ── One Piece ──────────────────────────────────────────────────────────────
  { id: "gear_second",       label: "Gear Second",        description: "[Luffy] Speed burst — rapid hits every 0.3s for 5s.",            icon: "💨" },
  { id: "gear_fourth",       label: "Gear Fourth",        description: "[Luffy] Boundman slam — AoE knockback + spin drain.",            icon: "🦁" },
  { id: "conquerors_haki",   label: "Conqueror's Haki",   description: "[Shanks/Luffy] Fear wave — stuns + spin drains all in range.",  icon: "⚡" },
  { id: "three_sword_style", label: "Three Sword Style",  description: "[Zoro] Triple arc slashes — 3 damage instances.",               icon: "⚔️" },
  { id: "diable_jambe",      label: "Diable Jambe",       description: "[Sanji] Burning kick — ignites target, ticking fire damage.",   icon: "🔥" },
  // ── Demon Slayer ──────────────────────────────────────────────────────────
  { id: "water_breathing",   label: "Water Breathing",    description: "[Tanjiro] Ten Forms water arc — sweeps nearest beyblades.",     icon: "🌊" },
  { id: "hinokami_kagura",   label: "Hinokami Kagura",    description: "[Tanjiro] Sun Breathing — AoE fire wave, high damage.",         icon: "☀️" },
  { id: "thunder_breathing", label: "Thunder Breathing",  description: "[Zenitsu] Thunderclap Flash — instant dash strike.",             icon: "⚡" },
  { id: "beast_breathing",   label: "Beast Breathing",    description: "[Inosuke] Wild boar charge — dual pierce hits.",                 icon: "🐗" },
  { id: "flame_breathing",   label: "Flame Breathing",    description: "[Rengoku] Flame Tiger — line AoE fire burst.",                  icon: "🔥" },
  // ── Attack on Titan ───────────────────────────────────────────────────────
  { id: "thunder_spear",     label: "Thunder Spear",      description: "[Survey Corps] Explosive spear cluster — triple AoE detonation.", icon: "🗡️" },
  { id: "omni_directional",  label: "ODM Gear",           description: "[Survey Corps] 360° wire sweeps — hits all in radius.",          icon: "🪢" },
  { id: "hardening",         label: "Hardening",          description: "[Eren] Crystal armor — reflects 40% damage for 6s.",             icon: "🛡️" },
  { id: "founding_titan",    label: "Founding Titan",     description: "[Eren] Rumbling — AoE shockwave + periodic spin drain aura.",   icon: "👁️" },
];

const FIRE_PATTERNS = [
  { id: "nearest",      label: "Nearest",       description: "Always targets the closest beyblade.",              icon: "📍" },
  { id: "furthest",     label: "Furthest",       description: "Always targets the farthest beyblade.",            icon: "📌" },
  { id: "random",       label: "Random Target",  description: "Picks a random beyblade each shot.",               icon: "🎲" },
  { id: "round_robin",  label: "Round Robin",    description: "Cycles through all beyblades in order.",           icon: "🔁" },
  { id: "lowest_spin",  label: "Lowest Spin",    description: "Targets the beyblade with the lowest spin.",       icon: "⬇️" },
  { id: "highest_spin", label: "Highest Spin",   description: "Targets the beyblade with the highest spin.",     icon: "⬆️" },
  { id: "center",       label: "Center Shot",    description: "Always fires toward the arena center.",            icon: "🎯" },
  { id: "sweep_cw",     label: "Sweep Clockwise","description": "Sweeps clockwise continuously.",                 icon: "↻"  },
];

async function seedTurretAttackTypes() {
  console.log("\n══════════════════════════════════════");
  console.log("  Turret Attack Types Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("turret_attack_types");
  const now = new Date().toISOString();
  const allTypes = [
    ...TURRET_ATTACK_TYPES.map(t => ({ ...t, kind: "attack_type" })),
    ...FIRE_PATTERNS.map(t => ({ ...t, id: `pattern_${t.id}`, kind: "fire_pattern" })),
  ];
  for (const t of allTypes) {
    try {
      await db.collection("turret_attack_types").doc(t.id).set({ ...t, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      console.log(`  ✔ [${t.kind}] ${t.label.padEnd(22)} ${t.icon}`);
    } catch (err) {
      console.error(`  ✘ ${t.label}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${allTypes.length} turret attack types into turret_attack_types\n`);
}

seedTurretAttackTypes()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

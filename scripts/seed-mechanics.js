#!/usr/bin/env node
// Seed mechanic_defs collection — one doc per MechanicRegistry handler (31 total).
// Each doc describes what the mechanic does; the server reads descriptions for admin UI.

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

// 31 mechanic_defs — one per handler in server/physics/mechanics/
const MECHANIC_DEFS = [
  { id: "energy_reserve",          name: "Energy Reserve",          category: "stamina",  description: "Passive energy reservoir; tick recharges power, onActivate gives spin burst.", params: { rechargeRate: 2, spinBoost: 200 } },
  { id: "free_spin",               name: "Free Spin",               category: "stamina",  description: "Reduces spin decay rate by a decay reduction factor while active.", params: { decayReduction: 0.4 } },
  { id: "spin_transfer",           name: "Spin Transfer",           category: "stamina",  description: "On collision: steal a fraction of opponent spin.", params: { stealFraction: 0.08 } },
  { id: "spin_equalization",       name: "Spin Equalization",       category: "stamina",  description: "Equalizes spin between touching beys; useful for stamina matchups.", params: { equalizeRate: 0.05 } },
  { id: "stamina_recovery",        name: "Stamina Recovery",        category: "stamina",  description: "Gradual spin recovery over time; strength set by recoveryRate.", params: { recoveryRate: 30 } },
  { id: "revival_spin",            name: "Revival Spin",            category: "stamina",  description: "Gradually recovers spin each tick when bey falls below spin threshold (default 20%). Implemented in server/physics/mechanics/revivalSpin.ts.", params: { threshold: 0.2, recoveryRate: 10 } },
  { id: "defense_stance",          name: "Defense Stance",          category: "defense",  description: "Grants invulnerability for durationMs and zeroes linear velocity.", params: { durationMs: 1500 } },
  { id: "burst_suppress",          name: "Burst Suppression",       category: "defense",  description: "Temporarily prevents burst finishes; burstPressure drain slows.", params: { suppressMs: 2000 } },
  { id: "recoil_guard",            name: "Recoil Guard",            category: "defense",  description: "Reduces knockback distance when taking damage.", params: { knockbackReduction: 0.5 } },
  { id: "contact_deflect",         name: "Contact Deflect",         category: "defense",  description: "On collision at high speed: deflects opponent sideways.", params: { deflectForceMult: 1.4 } },
  { id: "spring_recoil",           name: "Spring Recoil",           category: "defense",  description: "Contact launches attacker back with high force on collision.", params: { recoilMult: 2.0 } },
  { id: "rubber_grip",             name: "Rubber Grip",             category: "defense",  description: "High surface friction; bey resists sliding, catches attacks.", params: { frictionBoost: 0.03 } },
  { id: "weight_shift",            name: "Weight Shift",            category: "defense",  description: "Dynamically moves center of mass toward impact point.", params: { shiftMagnitude: 0.02 } },
  { id: "attack_amplifier",        name: "Attack Amplifier",        category: "attack",   description: "Multiplies outgoing damage by multiplier for durationMs.", params: { multiplier: 1.3, durationMs: 1000 } },
  { id: "velocity_burst",          name: "Velocity Burst",          category: "attack",   description: "Instant directional force impulse in facing direction.", params: { forceX: 0.12, forceY: 0 } },
  { id: "smash_impact",            name: "Smash Impact",            category: "attack",   description: "High-power horizontal smash on contact.", params: { impactMult: 1.6 } },
  { id: "upper_launch",            name: "Upper Launch",            category: "attack",   description: "Launches opponent upward and forward on contact.", params: { upwardForce: 0.08, forwardForce: 0.1 } },
  { id: "barrage_hit",             name: "Barrage Hit",             category: "attack",   description: "Rapid multi-hit burst on contact (several hits in quick succession).", params: { hitCount: 5, intervalTicks: 3 } },
  { id: "sub_part_burst",          name: "Sub-Part Burst",          category: "attack",   description: "Spawns a secondary projectile on hit.", params: { speed: 0.05 } },
  { id: "spin_steal_coupling",     name: "Spin Steal Coupling",     category: "attack",   description: "Coupled spin-steal on contact; scales with speed differential.", params: { stealBase: 0.05 } },
  { id: "orbit_movement",          name: "Orbit Movement",          category: "movement", description: "Applies circular orbital force (cwcw/ccw) over durationMs.", params: { intensity: 0.003, direction: "cw" } },
  { id: "bearing_drift",           name: "Bearing Drift",           category: "movement", description: "Low-friction bearing allows bey to drift freely with less directional resistance.", params: { driftFactor: 0.8 } },
  { id: "center_pull",             name: "Center Pull",             category: "movement", description: "Gentle force pulling bey toward arena center (counter ring-out).", params: { strength: 0.001 } },
  { id: "surface_friction_modifier", name: "Surface Friction Modifier", category: "movement", description: "Alters effective surface friction; can increase or reduce ground grip.", params: { frictionMultiplier: 0.5 } },
  { id: "rail_lock",               name: "Rail Lock",               category: "movement", description: "Sets gearCompatibleBit=true, enabling rail snap on Xtreme/gear-rail arenas.", params: {} },
  { id: "rotation_reverse",        name: "Rotation Reverse",        category: "special",  description: "Reverses spin direction on activation (left↔right).", params: {} },
  { id: "spin_threshold_switch",   name: "Spin Threshold Switch",   category: "special",  description: "Triggers a mode change or effect when spin falls below threshold.", params: { threshold: 0.3 } },
  { id: "mode_switch",             name: "Mode Switch",             category: "special",  description: "Switches bey between attack/defense/stamina modes via click system.", params: { modes: ["attack", "defense"] } },
  { id: "contact_height_gate",     name: "Contact Height Gate",     category: "special",  description: "Only activates contact effects above a minimum relative height.", params: { minHeightCm: 2 } },
  { id: "spin_direction_bonus",    name: "Spin Direction Bonus",    category: "special",  description: "Grants bonus damage or spin when matching/opposing spin direction of opponent.", params: { damageBonus: 1.2, matchRequired: false } },
  { id: "zero_g_float",            name: "Zero-G Float",            category: "special",  description: "Reduces effective gravity on bey; enables floating path in zero-G arenas.", params: { gravityScale: 0.2 } },
  { id: "magnetic_pull",           name: "Magnetic Pull",           category: "special",  description: "Attracts or repels nearby beys via simulated magnetic force.", params: { strength: 0.004, attract: true } },
];

async function seed() {
  console.log("\n══════════════════════════════════════");
  console.log("  Mechanic Defs Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("mechanic_defs");
  const now = new Date().toISOString();
  for (const def of MECHANIC_DEFS) {
    await db.collection("mechanic_defs").doc(def.id).set({ ...def, createdAt: now });
    console.log(`  ✔ ${def.id.padEnd(30)} [${def.category}]`);
  }
  console.log(`\n✅ Seeded ${MECHANIC_DEFS.length} mechanic defs\n`);
}

seed()
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

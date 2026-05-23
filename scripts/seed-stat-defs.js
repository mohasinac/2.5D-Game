#!/usr/bin/env node
// Seed stat_defs collection — typed numeric attributes for beys, arenas, parts, and matches.
// StatDef is a documentation + validation layer over existing runtime fields.
// The server reads stat_defs to build the admin UI and validate StatModifier chains.

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

// ── Beyblade stats ──────────────────────────────────────────────────────────
const BEY_STATS = [
  { id: "bey.attack",          name: "Attack",           type: "int",   min: 0, max: 150, default: 60,  step: 1,  unit: "pts", formula: "damageMultiplier = 1.0 + attack * 0.007",   affectsPhysics: true,  description: "Outgoing damage multiplier base. 150 = 2.05× damage." },
  { id: "bey.defense",         name: "Defense",          type: "int",   min: 0, max: 150, default: 60,  step: 1,  unit: "pts", formula: "damageReduction = 1 - defense * 0.003",      affectsPhysics: true,  description: "Incoming damage reduction. 150 = 0.55× (55% reduction)." },
  { id: "bey.stamina",         name: "Stamina",          type: "int",   min: 0, max: 150, default: 60,  step: 1,  unit: "pts", formula: "spinDecayRate = 8 * (1 - stamina * 0.001)",  affectsPhysics: true,  description: "Spin decay rate reduction and max spin bonus." },
  { id: "bey.weight",          name: "Weight",           type: "float", min: 20, max: 70, default: 33,  step: 0.1, unit: "g",  affectsPhysics: true,  description: "Physical mass of the beyblade in grams." },
  { id: "bey.radius",          name: "Radius",           type: "float", min: 1.5, max: 3.5, default: 2.4, step: 0.1, unit: "cm", affectsPhysics: true, description: "Physical radius in cm. Converted to px at 24px/cm." },
  { id: "bey.maxSpin",         name: "Max Spin",         type: "float", min: 1000, max: 3000, default: 2000, step: 10, unit: "rpm", formula: "2000 * (1 + stamina * 0.0008)", affectsPhysics: true, description: "Maximum spin rate. Derived from stamina." },
  { id: "bey.spinDecayRate",   name: "Spin Decay Rate",  type: "float", min: 4, max: 10, default: 8, step: 0.1, unit: "rpm/s", formula: "8 * (1 - stamina * 0.001)", affectsPhysics: true, description: "Spin lost per second in open field. Lower = better stamina." },
  { id: "bey.burstThreshold",  name: "Burst Threshold",  type: "float", min: 0, max: 1, default: 0.3, step: 0.01, affectsPhysics: true, description: "Spin fraction below which burst finish can trigger." },
  { id: "bey.burstResistance", name: "Burst Resistance", type: "int",   min: 0, max: 10, default: 3, step: 1, unit: "clicks", affectsPhysics: true, description: "Number of burst-threshold hits before burst finishes." },
  { id: "bey.tiltResistance",  name: "Tilt Resistance",  type: "float", min: 0, max: 1, default: 0.5, step: 0.05, affectsPhysics: true, description: "Resistance to arena-tilt lateral force (0 = full effect, 1 = immune)." },
  { id: "bey.recoilFactor",    name: "Recoil Factor",    type: "float", min: 0, max: 2, default: 1.0, step: 0.05, affectsPhysics: true, description: "Multiplier on outgoing collision recoil." },
  { id: "bey.frictionCoeff",   name: "Friction Coefficient", type: "float", min: 0, max: 1, default: 0.3, step: 0.01, affectsPhysics: true, description: "Surface friction with arena floor and obstacles." },
];

// ── Arena stats ─────────────────────────────────────────────────────────────
const ARENA_STATS = [
  { id: "arena.stamina_drain_mult",   name: "Stamina Drain Multiplier",   type: "float", min: 0, max: 3, default: 1.0, step: 0.05, affectsPhysics: true, description: "Global multiplier on all spin decay in this arena." },
  { id: "arena.collision_force_mult", name: "Collision Force Multiplier", type: "float", min: 0, max: 3, default: 1.0, step: 0.05, affectsPhysics: true, description: "Scales all collision impulse magnitudes." },
  { id: "arena.wall_bounce_factor",   name: "Wall Bounce Factor",         type: "float", min: 0, max: 1, default: 0.7, step: 0.05, affectsPhysics: true, description: "Restitution coefficient for wall collisions (0=absorb, 1=elastic)." },
  { id: "arena.floor_friction",       name: "Floor Friction",             type: "float", min: 0, max: 1, default: 0.3, step: 0.01, affectsPhysics: true, description: "Base surface friction of the arena floor." },
  { id: "arena.gravity_strength",     name: "Gravity Strength",           type: "float", min: 0, max: 2, default: 1.0, step: 0.05, affectsPhysics: true, description: "Scales gravity holes and tilt force magnitude." },
  { id: "arena.burst_threshold_scale", name: "Burst Threshold Scale",     type: "float", min: 0, max: 3, default: 1.0, step: 0.05, affectsPhysics: true, description: "Scales per-bey burst threshold (harsh arenas burst more easily)." },
  { id: "arena.water_drag",           name: "Water Drag",                 type: "float", min: 0, max: 1, default: 0.05, step: 0.005, affectsPhysics: true, description: "Linear drag applied to beyblades inside water bodies." },
  { id: "arena.water_spin_drain",     name: "Water Spin Drain",           type: "float", min: 0, max: 5, default: 1.5, step: 0.1,  affectsPhysics: true, description: "Extra spin drain per tick inside water bodies." },
];

// ── Part stats ───────────────────────────────────────────────────────────────
const PART_STATS = [
  { id: "part.weight",            name: "Part Weight",            type: "float", min: 0, max: 30,  default: 5.0, step: 0.1, unit: "g",   affectsPhysics: true, description: "Mass contribution of this part to total beyblade weight." },
  { id: "part.moment_of_inertia", name: "Moment of Inertia",      type: "float", min: 0, max: 500, default: 80, step: 1,   unit: "g·cm²", affectsPhysics: true, description: "Rotational inertia — affects spin decay and launch spin." },
  { id: "part.contact_sharpness", name: "Contact Sharpness",      type: "float", min: 0, max: 1,  default: 0.5, step: 0.05,            affectsPhysics: true, description: "How sharply this part focuses contact force (0=flat, 1=spike)." },
  { id: "part.friction",          name: "Part Friction",          type: "float", min: 0, max: 1,  default: 0.3, step: 0.01,            affectsPhysics: true, description: "Tip/base surface friction coefficient." },
  { id: "part.rebound",           name: "Rebound",                type: "float", min: 0, max: 1,  default: 0.5, step: 0.05,            affectsPhysics: true, description: "Elasticity of this part's contact face (0=dead, 1=full bounce)." },
  { id: "part.attack_bonus",      name: "Attack Bonus",           type: "int",   min: -30, max: 30, default: 0, step: 1,  unit: "pts",  affectsPhysics: true, description: "Additive attack stat contribution from this part." },
  { id: "part.defense_bonus",     name: "Defense Bonus",          type: "int",   min: -30, max: 30, default: 0, step: 1,  unit: "pts",  affectsPhysics: true, description: "Additive defense stat contribution from this part." },
  { id: "part.stamina_bonus",     name: "Stamina Bonus",          type: "int",   min: -30, max: 30, default: 0, step: 1,  unit: "pts",  affectsPhysics: true, description: "Additive stamina stat contribution from this part." },
];

// ── Match stats ──────────────────────────────────────────────────────────────
const MATCH_STATS = [
  { id: "match.duration_cap",      name: "Duration Cap",          type: "int",   min: 30,  max: 600, default: 180, step: 10, unit: "s",  affectsPhysics: false, description: "Maximum match duration in seconds before ring-out decision." },
  { id: "match.spin_floor",        name: "Spin Floor",            type: "float", min: 0,   max: 0.2, default: 0.05, step: 0.01,          affectsPhysics: true,  description: "Minimum spin fraction at which bey is considered stopped (ring-out ready)." },
  { id: "match.ring_out_speed",    name: "Ring-Out Speed",        type: "float", min: 0,   max: 10,  default: 2.0, step: 0.1,            affectsPhysics: false, description: "Minimum speed (px/tick) required to count a wall crossing as ring-out." },
  { id: "match.combo_window_scale", name: "Combo Window Scale",   type: "float", min: 0.5, max: 2.0, default: 1.0, step: 0.1,            affectsPhysics: false, description: "Scales the windowMs of all combos in this match." },
];

// ── Modifier stats ───────────────────────────────────────────────────────────
const MODIFIER_STATS = [
  { id: "mod.damage_mult",       name: "Damage Multiplier",      type: "float", min: 0.5, max: 3.0, default: 1.0, step: 0.05, affectsPhysics: true, description: "Transient damage multiplier from mechanics or gimmicks." },
  { id: "mod.spin_drain_rate",   name: "Spin Drain Rate",        type: "float", min: 0,   max: 20,  default: 8.0, step: 0.1,  affectsPhysics: true, description: "Overridden spin drain rate while a mechanic is active." },
  { id: "mod.invulnerability",   name: "Invulnerability (ms)",   type: "int",   min: 0,   max: 3000, default: 0,  step: 50,   unit: "ms", affectsPhysics: true, description: "Duration of invulnerability granted by a mechanic." },
  { id: "mod.speed_scale",       name: "Speed Scale",            type: "float", min: 0,   max: 3.0, default: 1.0, step: 0.05, affectsPhysics: true, description: "Transient linear speed scale applied by a movement mechanic." },
  { id: "mod.combo_cost_scale",  name: "Combo Cost Scale",       type: "float", min: 0,   max: 2.0, default: 1.0, step: 0.05, affectsPhysics: false, description: "Scales combo power cost while active." },
];

const ALL_STAT_DEFS = [
  ...BEY_STATS.map(s => ({ ...s, category: "beyblade" })),
  ...ARENA_STATS.map(s => ({ ...s, category: "arena" })),
  ...PART_STATS.map(s => ({ ...s, category: "part" })),
  ...MATCH_STATS.map(s => ({ ...s, category: "match" })),
  ...MODIFIER_STATS.map(s => ({ ...s, category: "modifier" })),
];

async function seed() {
  console.log("\n══════════════════════════════════════");
  console.log("  Stat Defs Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("stat_defs");
  const now = new Date().toISOString();
  for (const def of ALL_STAT_DEFS) {
    await db.collection("stat_defs").doc(def.id).set({ ...def, createdAt: now });
    console.log(`  ✔ ${def.id.padEnd(30)} [${def.category}/${def.type}]`);
  }
  console.log(`\n✅ Seeded ${ALL_STAT_DEFS.length} stat defs\n`);
}

seed()
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

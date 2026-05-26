#!/usr/bin/env node
// Seed ai_bey_personalities collection — per-bey personality profiles.
// Each doc defines a beyblade's behavioral tendencies (obedience, instinct, bond behaviors).

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin env vars."); process.exit(1);
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

const PERSONALITIES = [
  { id: "dragoon",  name: "Dragoon",  series: "bakuten", generation: "plastic", aggression: 95, obedience: 75, rushBias: 100, specialBias: 80,  centerControl: 20, instinct: "wild",      bondBehaviors: [{ minBond: 0.8, behavior: "storm_surge",     effect: "rush_speed_x1.3" }], description: "Wild storm dragon. Disobedient at low bond but devastating at high bond." },
  { id: "dranzer",  name: "Dranzer",  series: "bakuten", generation: "plastic", aggression: 70, obedience: 85, rushBias: 50,  specialBias: 100, centerControl: 40, instinct: "free",      bondBehaviors: [{ minBond: 0.7, behavior: "aerial_spiral",   effect: "air_movement" }],    description: "Noble phoenix. Reliable but unlocks aerial techniques at high bond." },
  { id: "driger",   name: "Driger",   series: "bakuten", generation: "plastic", aggression: 60, obedience: 90, rushBias: 60,  specialBias: 70,  centerControl: 65, instinct: "balanced",  bondBehaviors: [{ minBond: 0.6, behavior: "precision_strike", effect: "accuracy_plus" }],   description: "Disciplined tiger. Precise and balanced; rewards bond with accuracy." },
  { id: "wolborg",  name: "Wolborg",  series: "bakuten", generation: "plastic", aggression: 20, obedience: 95, rushBias: 10,  specialBias: 60,  centerControl: 90, instinct: "defensive", bondBehaviors: [{ minBond: 0.5, behavior: "ice_stall",       effect: "center_camp" }],     description: "Stalwart ice wolf. Holds center position with near-perfect obedience." },
  { id: "seaborg",  name: "Seaborg",  series: "bakuten", generation: "plastic", aggression: 30, obedience: 85, rushBias: 20,  specialBias: 50,  centerControl: 70, instinct: "defensive", bondBehaviors: [{ minBond: 0.6, behavior: "wall_barrier",    effect: "rebound_plus" }],    description: "Armored turtle. Defensive walls with rebound at high bond." },
  { id: "draciel",  name: "Draciel",  series: "bakuten", generation: "plastic", aggression: 25, obedience: 90, rushBias: 15,  specialBias: 60,  centerControl: 85, instinct: "defensive", bondBehaviors: [{ minBond: 0.7, behavior: "shell_guard",     effect: "defense_plus" }],    description: "Heavy shell defense. Immovable center with enhanced guard at high bond." },
  { id: "strata",   name: "Strata Dragoon", series: "bakuten", generation: "plastic", aggression: 50, obedience: 80, rushBias: 40,  specialBias: 65,  centerControl: 55, instinct: "balanced",  bondBehaviors: [{ minBond: 0.6, behavior: "earth_anchor",    effect: "stability_plus" }],  description: "Earth dragon. Balanced grounding force with stability bonus." },
  { id: "pegasus",  name: "Storm Pegasus", series: "mfb",   generation: "mfb",     aggression: 85, obedience: 80, rushBias: 90,  specialBias: 85,  centerControl: 30, instinct: "wild",      bondBehaviors: [{ minBond: 0.7, behavior: "star_blast",      effect: "smash_plus" }],      description: "Charging winged horse. High-speed smash attacker." },
  { id: "leone",    name: "Rock Leone",    series: "mfb",   generation: "mfb",     aggression: 55, obedience: 85, rushBias: 35,  specialBias: 55,  centerControl: 75, instinct: "balanced",  bondBehaviors: [{ minBond: 0.6, behavior: "wind_shield",     effect: "counter_plus" }],    description: "Stalwart lion. Wind-based defense with counter at high bond." },
  { id: "ldrago",   name: "Lightning L-Drago", series: "mfb", generation: "mfb",  aggression: 80, obedience: 60, rushBias: 70,  specialBias: 90,  centerControl: 35, instinct: "wild",      bondBehaviors: [{ minBond: 0.8, behavior: "dark_spin",       effect: "spin_steal_plus" }], description: "Dark dragon. Left-spin spin-stealer with rebellious personality." },
  { id: "valtryek", name: "Valtryek",       series: "burst", generation: "burst",   aggression: 80, obedience: 75, rushBias: 85,  specialBias: 80,  centerControl: 25, instinct: "wild",      bondBehaviors: [{ minBond: 0.7, behavior: "rush_launch",     effect: "burst_plus" }],      description: "Swift striker. Rush attacker aiming for burst finishes." },
  { id: "spryzen",  name: "Spryzen",        series: "burst", generation: "burst",   aggression: 65, obedience: 70, rushBias: 55,  specialBias: 85,  centerControl: 45, instinct: "balanced",  bondBehaviors: [{ minBond: 0.6, behavior: "dual_spin",       effect: "mode_switch" }],     description: "Dual-spin warrior. Adapts fighting style based on spin direction." },
  { id: "dranswrd", name: "Dran Sword",     series: "bx",    generation: "bx",      aggression: 75, obedience: 80, rushBias: 80,  specialBias: 70,  centerControl: 35, instinct: "balanced",  bondBehaviors: [{ minBond: 0.7, behavior: "xtreme_dash",     effect: "x_dash_plus" }],     description: "X-generation blade. Balanced attacker with Xtreme Line synergy." },
];

async function seed() {
  console.log("Seeding ai_bey_personalities...");
  await clearCollection("ai_bey_personalities");
  let batch = db.batch(); let count = 0;
  for (const p of PERSONALITIES) {
    const ref = db.collection("ai_bey_personalities").doc(p.id);
    batch.set(ref, { ...p, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
  console.log(`  Seeded ${PERSONALITIES.length} ai_bey_personalities.`);
}

seed().catch(e => { console.error(e); process.exit(1); });

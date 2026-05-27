// scripts/seed-combo-effects.js — seeds built-in ComboEffectDef presets
// to the combo_effects Firestore collection. Idempotent (merge: true).

const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

// Each entry stores both tasks[] (admin editor) and steps[] (engine).
const COMBO_EFFECTS = [
  {
    id: "quick-dash-r",
    name: "Quick Dash Right",
    cost: 0, cooldownMs: 1500, windupTicks: 0, bleedTicks: 0,
    tasks: [{ action: { type: "movement", pattern: { type: "dash", direction: "right" } }, target: "self", timing: { type: "instant" } }],
    steps: [{ behaviorId: "movement.dash", params: { direction: "right", magnitude: 2.5, dur: 12 }, delayTicks: 0, parallel: false }],
  },
  {
    id: "quick-dash-l",
    name: "Quick Dash Left",
    cost: 0, cooldownMs: 1500, windupTicks: 0, bleedTicks: 0,
    tasks: [{ action: { type: "movement", pattern: { type: "dash", direction: "left" } }, target: "self", timing: { type: "instant" } }],
    steps: [{ behaviorId: "movement.dash", params: { direction: "left", magnitude: 2.5, dur: 12 }, delayTicks: 0, parallel: false }],
  },
  {
    id: "guard-tap",
    name: "Guard Tap",
    cost: 0, cooldownMs: 2000, windupTicks: 0, bleedTicks: 0,
    tasks: [{ action: { type: "multiplier", statDeltas: [{ stat: "damageReduction", multiplier: 1.3 }] }, target: "self", timing: { type: "timed", durationTicks: 20 } }],
    steps: [{ behaviorId: "factor.boost", params: { stat: "damageReduction", mult: 1.3, dur: 20 }, delayTicks: 0, parallel: false }],
  },
  {
    id: "feint",
    name: "Feint",
    cost: 0, cooldownMs: 2000, windupTicks: 0, bleedTicks: 0,
    tasks: [
      { action: { type: "movement", pattern: { type: "zigzag", amplitude: 8, frequency: 2 } }, target: "self", timing: { type: "timed", durationTicks: 24 } },
      { action: { type: "multiplier", statDeltas: [{ stat: "recoilFactor", multiplier: 1.5 }] }, target: "self", timing: { type: "timed", durationTicks: 24 } },
    ],
    steps: [
      { behaviorId: "movement.zigzag", params: { amplitude: 8, frequency: 2, dur: 24 }, delayTicks: 0, parallel: false },
      { behaviorId: "factor.boost",    params: { stat: "recoilFactor", mult: 1.5, dur: 24 }, delayTicks: 0, parallel: true },
    ],
  },
  {
    id: "riposte",
    name: "Riposte",
    cost: 15, cooldownMs: 2500, windupTicks: 5, bleedTicks: 8,
    tasks: [
      { action: { type: "multiplier", statDeltas: [{ stat: "damageReduction", multiplier: 1.5 }] }, target: "self", timing: { type: "timed", durationTicks: 12 } },
      { action: { type: "multiplier", statDeltas: [{ stat: "damageMultiplier", multiplier: 1.3 }] }, target: "self", timing: { type: "timed", durationTicks: 36 } },
    ],
    steps: [
      { behaviorId: "factor.boost", params: { stat: "damageReduction", mult: 1.5, dur: 12 }, delayTicks: 0, parallel: false },
      { behaviorId: "factor.boost", params: { stat: "damageMultiplier", mult: 1.3, dur: 36 }, delayTicks: 5, parallel: false },
    ],
  },
  {
    id: "pivot-strike",
    name: "Pivot Strike",
    cost: 15, cooldownMs: 2500, windupTicks: 4, bleedTicks: 6,
    tasks: [
      { action: { type: "movement", pattern: { type: "dash", direction: "left" } }, target: "self", timing: { type: "instant" } },
      { action: { type: "movement", pattern: { type: "dash_to", target: "opponent" } }, target: "self", timing: { type: "instant" }, condition: { maxRange: 80 } },
      { action: { type: "multiplier", statDeltas: [{ stat: "damageMultiplier", multiplier: 1.25 }] }, target: "self", timing: { type: "timed", durationTicks: 24 } },
    ],
    steps: [
      { behaviorId: "movement.dash", params: { direction: "left", magnitude: 1.5, dur: 6 }, delayTicks: 0, parallel: false },
      { behaviorId: "movement.dash", params: { direction: "toward_opponent", magnitude: 2.5, dur: 10 }, delayTicks: 4, parallel: false },
      { behaviorId: "factor.boost",  params: { stat: "damageMultiplier", mult: 1.25, dur: 24 }, delayTicks: 4, parallel: true },
    ],
  },
  {
    id: "power-thrust",
    name: "Power Thrust",
    cost: 25, cooldownMs: 4000, windupTicks: 5, bleedTicks: 10,
    tasks: [
      { action: { type: "multiplier", statDeltas: [{ stat: "damageMultiplier", multiplier: 1.8 }] }, target: "self", timing: { type: "timed", durationTicks: 30 } },
      { action: { type: "movement", pattern: { type: "dash_to", target: "opponent" } }, target: "self", timing: { type: "instant" }, condition: { maxRange: 80 } },
    ],
    steps: [
      { behaviorId: "factor.boost",  params: { stat: "damageMultiplier", mult: 1.8, dur: 30 }, delayTicks: 0, parallel: false },
      { behaviorId: "movement.dash", params: { direction: "toward_opponent", magnitude: 3.0, dur: 15 }, delayTicks: 5, parallel: false },
    ],
  },
  {
    id: "spin-leech",
    name: "Spin Leech",
    cost: 35, cooldownMs: 5000, windupTicks: 0, bleedTicks: 0,
    // Case 615: only activates during counter-spin clashes (attacker & defender spinning opposite)
    activationCondition: { clashTypeRequired: "counter_spin" },
    tasks: [
      { action: { type: "multiplier", statDeltas: [{ stat: "spinStealResist", multiplier: 0.3 }] }, target: "opponent", timing: { type: "timed", durationTicks: 60 }, condition: { clashTypeRequired: "counter_spin" } },
      { action: { type: "multiplier", statDeltas: [{ stat: "spinDecayRate", multiplier: 0.0 }] }, target: "self", timing: { type: "timed", durationTicks: 60 } },
    ],
    steps: [
      { behaviorId: "factor.boost", params: { stat: "spinStealResist", mult: 0.3, dur: 60, clashTypeRequired: "counter_spin" }, delayTicks: 0, parallel: false },
      { behaviorId: "factor.boost", params: { stat: "spinDecayRate",   mult: 0.0, dur: 60 }, delayTicks: 0, parallel: true },
    ],
  },
  {
    id: "chaos-field",
    name: "Chaos Field",
    cost: 25, cooldownMs: 6000, windupTicks: 5, bleedTicks: 15,
    tasks: [
      { action: { type: "multiplier", statDeltas: [{ stat: "damageMultiplier", multiplier: 3.0 }, { stat: "speed", multiplier: 2.0 }] }, target: "self", timing: { type: "timed", durationTicks: 30 } },
      { action: { type: "movement", pattern: { type: "dash_to", target: "opponent" } }, target: "self", timing: { type: "instant" }, condition: { maxRange: 120 } },
    ],
    steps: [
      { behaviorId: "factor.boost",  params: { stat: "damageMultiplier", mult: 3.0, dur: 30 }, delayTicks: 0, parallel: false },
      { behaviorId: "factor.boost",  params: { stat: "speed",            mult: 2.0, dur: 30 }, delayTicks: 0, parallel: true },
      { behaviorId: "movement.dash", params: { direction: "toward_opponent", magnitude: 4.0, dur: 20 }, delayTicks: 5, parallel: false },
    ],
  },
  {
    id: "power-burst",
    name: "Power Burst",
    cost: 35, cooldownMs: 7000, windupTicks: 8, bleedTicks: 20,
    tasks: [
      { action: { type: "spawning", spawnType: "clone_self", count: 1, spawnPosition: { type: "offset", dx: 12, dy: 0 } }, target: "none", timing: { type: "instant" } },
      { action: { type: "multiplier", statDeltas: [{ stat: "damageReduction", multiplier: 0.5 }] }, target: "all_opponents", timing: { type: "timed", durationTicks: 45 } },
    ],
    steps: [
      { behaviorId: "spawn.clone_self", params: { count: 1, cloneIsPhysical: true, cloneStatFraction: 0.5 }, delayTicks: 0, parallel: false },
      { behaviorId: "factor.boost",     params: { stat: "damageReduction", mult: 0.5, dur: 45 }, delayTicks: 8, parallel: false },
    ],
  },
  {
    id: "chaos-gambit",
    name: "Chaos Gambit",
    cost: 25, cooldownMs: 8000, windupTicks: 0, bleedTicks: 0,
    tasks: [
      { action: { type: "transformation", transformTo: "gravity_well", durationTicks: 60 }, target: "self", timing: { type: "timed", durationTicks: 60 }, condition: { minPower: 25 } },
      { action: { type: "multiplier", statDeltas: [{ stat: "spinDecayRate", multiplier: 0.5 }, { stat: "recoilFactor", multiplier: 1.8 }] }, target: "self", timing: { type: "timed", durationTicks: 60 } },
      { action: { type: "movement", pattern: { type: "dash_to", target: "opponent" } }, target: "self", timing: { type: "instant" }, condition: { maxRange: 60 } },
    ],
    steps: [
      { behaviorId: "transform.become_gravity_well", params: { strength: 0.8, radius: 30 }, delayTicks: 0, parallel: false },
      { behaviorId: "factor.boost", params: { stat: "spinDecayRate", mult: 0.5, dur: 60 }, delayTicks: 0, parallel: true },
      { behaviorId: "factor.boost", params: { stat: "recoilFactor",  mult: 1.8, dur: 60 }, delayTicks: 0, parallel: true },
      { behaviorId: "movement.dash", params: { direction: "toward_opponent", magnitude: 2.5, dur: 12 }, delayTicks: 60, parallel: false },
    ],
  },
  {
    id: "meteor-strike",
    name: "Meteor Strike",
    cost: 35, cooldownMs: 10000, windupTicks: 10, bleedTicks: 20,
    tasks: [
      { action: { type: "movement", pattern: { type: "meteor_strike", heightCm: 300, hangTimeTicks: 20, landTarget: "opponent", impactRadiusCm: 40, impactDamageMult: 3.0, impactRecoilMult: 4.0 } }, target: "self", timing: { type: "timed", durationTicks: 60 } },
    ],
    steps: [
      { behaviorId: "movement.meteor_strike", params: { heightCm: 300, hangTimeTicks: 20, landTarget: "opponent", impactRadiusCm: 40, impactDamageMult: 3.0, impactRecoilMult: 4.0 }, delayTicks: 0, parallel: false },
    ],
  },
  // Phase AA — Arena-Wide Special Moves
  {
    id: "glacial-siege",
    name: "Glacial Siege",
    cost: 35, cooldownMs: 14000, windupTicks: 15, bleedTicks: 25,
    tasks: [
      // Step 1: Override floor with ice hazard for 5 seconds (300 ticks @ 60Hz)
      { action: { type: "arena_effect", effect: { type: "floor_override", hazardType: "ice", intensity: 0.8, durationTicks: 300 } }, timing: { type: "instant" } },
      // Step 2 (parallel): Freeze all opponents for 1.5s
      { action: { type: "arena_effect", effect: { type: "freeze_all", durationTicks: 90, spareTeammates: true } }, timing: { type: "instant" } },
      // Step 3 (parallel): Boost own spin decay resistance during the freeze
      { action: { type: "multiplier", statDeltas: [{ stat: "spinDecayRate", multiplier: 0.0 }] }, target: "self", timing: { type: "timed", durationTicks: 90 } },
    ],
    steps: [
      { behaviorId: "arena.effect.floor_override", params: { hazardType: "ice", intensity: 0.8, durationTicks: 300 }, delayTicks: 0, parallel: false },
      { behaviorId: "arena.effect.freeze_all",     params: { durationTicks: 90, spareTeammates: true },               delayTicks: 0, parallel: true },
      { behaviorId: "factor.boost",                params: { stat: "spinDecayRate", mult: 0.0, dur: 90 },             delayTicks: 0, parallel: true },
    ],
  },
  {
    id: "shadow-shroud",
    name: "Shadow Shroud",
    cost: 25, cooldownMs: 12000, windupTicks: 8, bleedTicks: 15,
    tasks: [
      { action: { type: "arena_effect", effect: { type: "darkness", durationTicks: 180, flashExitMs: 400 } }, timing: { type: "instant" } },
      { action: { type: "multiplier", statDeltas: [{ stat: "speed", multiplier: 1.5 }, { stat: "spinStealFactor", multiplier: 1.8 }] }, target: "self", timing: { type: "timed", durationTicks: 180 } },
    ],
    steps: [
      { behaviorId: "arena.effect.darkness",  params: { durationTicks: 180, flashExitMs: 400 }, delayTicks: 0, parallel: false },
      { behaviorId: "factor.boost", params: { stat: "speed",           mult: 1.5, dur: 180 }, delayTicks: 0, parallel: true },
      { behaviorId: "factor.boost", params: { stat: "spinStealFactor", mult: 1.8, dur: 180 }, delayTicks: 0, parallel: true },
    ],
  },
];

async function seed() {
  console.log("Seeding combo_effects...");
  const col = db.collection("combo_effects");
  for (const effect of COMBO_EFFECTS) {
    await col.doc(effect.id).set(effect, { merge: true });
    console.log(`  ✓ ${effect.id}`);
  }
  console.log(`Done — ${COMBO_EFFECTS.length} combo effects seeded.`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });

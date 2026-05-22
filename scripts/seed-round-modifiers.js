// seed-round-modifiers.js — seeds 17 built-in round modifiers to round_modifiers collection.
// Idempotent: uses doc id as key, safe to re-run.

const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  };
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

const MODIFIERS = [
  // ── PHYSICS ──────────────────────────────────────────────────────────────
  {
    id: "double_gravity",
    name: "Double Gravity",
    description: "All beys experience 2× gravitational force — harder to stay airborne.",
    category: "physics",
    icon: "🌍",
    physicsOverrides: { gravityMult: 2.0 },
  },
  {
    id: "low_gravity",
    name: "Low Gravity",
    description: "Gravity reduced to 20% — beys float and sail on every hit.",
    category: "physics",
    icon: "🌙",
    physicsOverrides: { gravityMult: 0.2 },
  },
  {
    id: "ice_floor",
    name: "Ice Floor",
    description: "Surface friction near zero — beys slide uncontrollably.",
    category: "physics",
    icon: "❄️",
    physicsOverrides: { surfaceFriction: 0.05 },
  },
  {
    id: "sticky_floor",
    name: "Sticky Floor",
    description: "5× friction — beys are sluggish but planted.",
    category: "physics",
    icon: "🍯",
    physicsOverrides: { surfaceFriction: 5.0 },
  },
  {
    id: "super_bounce",
    name: "Super Bounce",
    description: "Walls have 3× elasticity — every hit sends beys flying.",
    category: "physics",
    icon: "🏀",
    physicsOverrides: { wallRestitution: 3.0 },
  },
  {
    id: "vacuum",
    name: "Vacuum",
    description: "Zero air resistance — beys maintain speed indefinitely.",
    category: "physics",
    icon: "🌀",
    physicsOverrides: { airResistance: 0.0 },
  },

  // ── COMBAT ───────────────────────────────────────────────────────────────
  {
    id: "hyper_speed",
    name: "Hyper Speed",
    description: "All beys move at 2× speed.",
    category: "combat",
    icon: "⚡",
    globalFactors: [{ stat: "speed", multiplier: 2.0 }],
  },
  {
    id: "glass_cannon",
    name: "Glass Cannon",
    description: "Everyone deals 2× damage and takes 2× damage.",
    category: "combat",
    icon: "💥",
    globalFactors: [
      { stat: "damageMultiplier", multiplier: 2.0 },
      { stat: "damageReduction", multiplier: 2.0 },
    ],
  },
  {
    id: "stamina_mode",
    name: "Stamina Mode",
    description: "Spin decay at 20% — beys last much longer.",
    category: "combat",
    icon: "🌀",
    ruleOverrides: { spinDecayRateOverride: 0.2 },
  },
  {
    id: "fragile_defense",
    name: "Fragile Defense",
    description: "All beys take 1.8× incoming damage.",
    category: "combat",
    icon: "🛡️",
    globalFactors: [{ stat: "damageReduction", multiplier: 1.8 }],
  },
  {
    id: "burst_mania",
    name: "Burst Mania",
    description: "Burst resistance zeroed — any hard hit can burst a bey instantly.",
    category: "combat",
    icon: "💢",
    ruleOverrides: { burstResistanceOverride: 0 },
  },

  // ── RULES ────────────────────────────────────────────────────────────────
  {
    id: "free_combos",
    name: "Free Combos",
    description: "All combos cost 0 power — fire freely.",
    category: "rules",
    icon: "🎯",
    ruleOverrides: { comboCostMultiplier: 0.0 },
  },
  {
    id: "mega_special",
    name: "Mega Special",
    description: "Special moves cost only 25 power instead of 100.",
    category: "rules",
    icon: "⭐",
    ruleOverrides: { specialMoveCostOverride: 25 },
  },
  {
    id: "arena_shrink_fast",
    name: "Arena Shrink",
    description: "Arena boundary shrinks from 30s to 90s — forced center action.",
    category: "rules",
    icon: "📐",
    ruleOverrides: {
      arenaShrink: { enabled: true, startMs: 30000, endMs: 90000, minRadiusFraction: 0.3 },
    },
  },

  // ── CHAOS ────────────────────────────────────────────────────────────────
  {
    id: "randomize_all",
    name: "Randomize All",
    description: "Every bey gets random ×0.5–2.0 stats — anything can happen.",
    category: "chaos",
    icon: "🎲",
    chaosParams: { randomizeStats: true },
  },
  {
    id: "invert_controls",
    name: "Invert Controls",
    description: "Left is right. Up is down. Good luck.",
    category: "chaos",
    icon: "🔄",
    chaosParams: { invertControls: true },
  },
  {
    id: "gravity_flip",
    name: "Gravity Flip",
    description: "At T=60s gravity direction reverses — chaos ensues.",
    category: "chaos",
    icon: "⬆️",
    chaosParams: { gravityReverses: true },
  },
];

async function seed() {
  const col = db.collection("round_modifiers");
  let upserted = 0;

  for (const mod of MODIFIERS) {
    await col.doc(mod.id).set(mod, { merge: true });
    upserted++;
    process.stdout.write(`  ✓ ${mod.id}\n`);
  }

  console.log(`\nSeeded ${upserted} round modifiers.`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

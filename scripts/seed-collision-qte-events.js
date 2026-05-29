// Seed script: writes collision QTE event configurations to Firestore.
// Run: node scripts/seed-collision-qte-events.js
// Idempotent — safe to re-run (overwrites with set()).

const admin = require("firebase-admin");

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

// Collision QTE window config keyed by (beyType_vs_beyType).
// windowMs    — how long the mash window stays open
// specialThreshold — power% required before "fire special" prompt appears
// maxPower    — ceiling for the power bar
// baseMultiplier — damage multiplier at 0% power (scales up to baseMultiplier + 1.0 at maxPower)
const COLLISION_QTE_EVENTS = [
  {
    id: "attack_vs_attack",
    label: "Attack vs Attack",
    windowMs: 2500,
    specialThreshold: 80,
    maxPower: 150,
    baseMultiplier: 1.0,
    description: "Full clash window. Both sides can fire specials at 80%+ power.",
  },
  {
    id: "attack_vs_defense",
    label: "Attack vs Defense",
    windowMs: 2000,
    specialThreshold: 100,
    maxPower: 150,
    baseMultiplier: 0.8,
    description: "Attacker has shorter window; defender needs more power to fire special.",
  },
  {
    id: "attack_vs_stamina",
    label: "Attack vs Stamina",
    windowMs: 3000,
    specialThreshold: 70,
    maxPower: 150,
    baseMultiplier: 1.2,
    description: "Extended window. Stamina bey drains faster; special fires at lower threshold.",
  },
  {
    id: "attack_vs_balanced",
    label: "Attack vs Balanced",
    windowMs: 2500,
    specialThreshold: 80,
    maxPower: 150,
    baseMultiplier: 1.0,
    description: "Standard clash window.",
  },
  {
    id: "defense_vs_defense",
    label: "Defense vs Defense",
    windowMs: 1500,
    specialThreshold: 120,
    maxPower: 150,
    baseMultiplier: 0.6,
    description: "Short clash window. High special threshold — difficult to fire specials.",
  },
  {
    id: "defense_vs_stamina",
    label: "Defense vs Stamina",
    windowMs: 2000,
    specialThreshold: 90,
    maxPower: 150,
    baseMultiplier: 0.9,
    description: "Defense absorbs impact; stamina bey loses more spin.",
  },
  {
    id: "defense_vs_balanced",
    label: "Defense vs Balanced",
    windowMs: 2000,
    specialThreshold: 90,
    maxPower: 150,
    baseMultiplier: 0.85,
    description: "Defensive clash. Moderate special threshold.",
  },
  {
    id: "stamina_vs_stamina",
    label: "Stamina vs Stamina",
    windowMs: 3500,
    specialThreshold: 60,
    maxPower: 150,
    baseMultiplier: 1.3,
    description: "Long clash window. Lower special threshold rewards masher.",
  },
  {
    id: "stamina_vs_balanced",
    label: "Stamina vs Balanced",
    windowMs: 3000,
    specialThreshold: 70,
    maxPower: 150,
    baseMultiplier: 1.1,
    description: "Extended mash window with moderate damage.",
  },
  {
    id: "balanced_vs_balanced",
    label: "Balanced vs Balanced",
    windowMs: 2500,
    specialThreshold: 80,
    maxPower: 150,
    baseMultiplier: 1.0,
    description: "Standard symmetric clash.",
  },
  {
    id: "default",
    label: "Default Collision",
    windowMs: 2500,
    specialThreshold: 80,
    maxPower: 150,
    baseMultiplier: 1.0,
    description: "Fallback config used when type pairing is not explicitly defined.",
  },
];

async function seed() {
  const coll = db.collection("collision_qte_events");
  let count = 0;
  for (const event of COLLISION_QTE_EVENTS) {
    await coll.doc(event.id).set(event);
    count++;
    console.log(`  ✓ collision_qte_event: ${event.id}`);
  }
  console.log(`\n✅  Seeded ${count} collision QTE event configs.`);
}

seed().catch(err => { console.error(err); process.exit(1); });

// Seed script: writes special clash event configurations to Firestore.
// Run: node scripts/seed-special-clash-events.js
// Idempotent — safe to re-run (overwrites with set()).
//
// Special clash events fire when two beyblade special moves collide simultaneously.
// They define timing bonuses, counter sequences, and outcome modifiers.

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

// Special clash events — what happens when specific move types collide.
// moveTypeA + moveTypeB are from the special_moves collection moveType field.
// counterSequence — QTE sequence the defending player can input to counter.
// damageScaleWin / damageScaleLose — multipliers for the clash outcome.
const SPECIAL_CLASH_EVENTS = [
  {
    id: "rush_vs_rush",
    label: "Stampede Rush vs Stampede Rush",
    moveTypeA: "attack_rush",
    moveTypeB: "attack_rush",
    counterSequence: ["attack", "attack", "attack"],
    counterWindowMs: 1500,
    damageScaleWin: 1.8,
    damageScaleLose: 0.4,
    damageScaleDraw: 0.8,
    spinDeltaWin: 0.15,
    spinDeltaLose: -0.3,
    description: "Two rush attacks collide head-on. Winning the QTE counter deals 1.8× damage.",
    vfx: "spark_burst",
  },
  {
    id: "rush_vs_anchor",
    label: "Stampede Rush vs Gyro Anchor",
    moveTypeA: "attack_rush",
    moveTypeB: "defense_anchor",
    counterSequence: ["defense", "defense", "left"],
    counterWindowMs: 2000,
    damageScaleWin: 0.3,
    damageScaleLose: 0.8,
    damageScaleDraw: 0.5,
    spinDeltaWin: 0.2,
    spinDeltaLose: -0.1,
    description: "Rush hits a gyro anchor. Attacker is mostly absorbed; defender gains spin. Counter sequence lets attacker partially break through.",
    vfx: "shockwave",
  },
  {
    id: "rush_vs_orbital",
    label: "Stampede Rush vs Spin Recovery",
    moveTypeA: "attack_rush",
    moveTypeB: "stamina_orbital",
    counterSequence: ["dodge", "left", "attack"],
    counterWindowMs: 1800,
    damageScaleWin: 2.0,
    damageScaleLose: 0.5,
    damageScaleDraw: 1.0,
    spinDeltaWin: -0.2,
    spinDeltaLose: -0.25,
    description: "Rush intercepts orbital spin recovery. High variance — winner deals 2× damage.",
    vfx: "spiral_burst",
  },
  {
    id: "rush_vs_tactical",
    label: "Stampede Rush vs Tactical Burst",
    moveTypeA: "attack_rush",
    moveTypeB: "balanced_tactical",
    counterSequence: ["left", "attack", "defense"],
    counterWindowMs: 1800,
    damageScaleWin: 1.5,
    damageScaleLose: 0.6,
    damageScaleDraw: 0.9,
    spinDeltaWin: -0.1,
    spinDeltaLose: -0.2,
    description: "Rush vs tactical burst. Tactical burst can redirect the rush partially.",
    vfx: "spark_burst",
  },
  {
    id: "anchor_vs_anchor",
    label: "Gyro Anchor vs Gyro Anchor",
    counterSequence: ["defense", "defense", "defense"],
    counterWindowMs: 1000,
    moveTypeA: "defense_anchor",
    moveTypeB: "defense_anchor",
    damageScaleWin: 0.1,
    damageScaleLose: 0.1,
    damageScaleDraw: 0.0,
    spinDeltaWin: 0.1,
    spinDeltaLose: 0.1,
    description: "Two anchored beyblades repel each other. Essentially a draw. Small spin exchange only.",
    vfx: "ripple",
  },
  {
    id: "anchor_vs_orbital",
    label: "Gyro Anchor vs Spin Recovery",
    moveTypeA: "defense_anchor",
    moveTypeB: "stamina_orbital",
    counterSequence: ["dodge", "dodge", "attack"],
    counterWindowMs: 2200,
    damageScaleWin: 1.2,
    damageScaleLose: 0.2,
    damageScaleDraw: 0.6,
    spinDeltaWin: 0.25,
    spinDeltaLose: -0.15,
    description: "Orbital recovery meets anchored stance. Anchor wins spin contest if player counters quickly.",
    vfx: "shockwave",
  },
  {
    id: "anchor_vs_tactical",
    label: "Gyro Anchor vs Tactical Burst",
    moveTypeA: "defense_anchor",
    moveTypeB: "balanced_tactical",
    counterSequence: ["defense", "attack", "defense"],
    counterWindowMs: 1800,
    damageScaleWin: 0.4,
    damageScaleLose: 1.4,
    damageScaleDraw: 0.7,
    spinDeltaWin: 0.15,
    spinDeltaLose: -0.1,
    description: "Tactical burst targets the anchor gap. Defender needs to time the counter precisely.",
    vfx: "spark_burst",
  },
  {
    id: "orbital_vs_orbital",
    label: "Spin Recovery vs Spin Recovery",
    moveTypeA: "stamina_orbital",
    moveTypeB: "stamina_orbital",
    counterSequence: ["left", "right", "attack"],
    counterWindowMs: 3000,
    damageScaleWin: 0.5,
    damageScaleLose: 0.5,
    damageScaleDraw: 0.3,
    spinDeltaWin: 0.3,
    spinDeltaLose: -0.1,
    description: "Two orbital recoveries trade spin. Long counter window; spin transfer is the main prize.",
    vfx: "spiral_burst",
  },
  {
    id: "orbital_vs_tactical",
    label: "Spin Recovery vs Tactical Burst",
    moveTypeA: "stamina_orbital",
    moveTypeB: "balanced_tactical",
    counterSequence: ["attack", "dodge", "attack"],
    counterWindowMs: 2000,
    damageScaleWin: 1.3,
    damageScaleLose: 0.7,
    damageScaleDraw: 0.9,
    spinDeltaWin: -0.1,
    spinDeltaLose: -0.2,
    description: "Tactical burst disrupts spin recovery orbit. Moderate counter window.",
    vfx: "spiral_burst",
  },
  {
    id: "tactical_vs_tactical",
    label: "Tactical Burst vs Tactical Burst",
    moveTypeA: "balanced_tactical",
    moveTypeB: "balanced_tactical",
    counterSequence: ["left", "attack", "right"],
    counterWindowMs: 2000,
    damageScaleWin: 1.4,
    damageScaleLose: 0.5,
    damageScaleDraw: 0.9,
    spinDeltaWin: -0.05,
    spinDeltaLose: -0.2,
    description: "Mirror clash. Counter sequence is directional; rewards fast reaction.",
    vfx: "spark_burst",
  },
  {
    id: "default",
    label: "Default Special Clash",
    counterSequence: ["attack", "attack"],
    counterWindowMs: 2000,
    damageScaleWin: 1.5,
    damageScaleLose: 0.5,
    damageScaleDraw: 0.8,
    spinDeltaWin: -0.1,
    spinDeltaLose: -0.2,
    description: "Fallback config for unrecognised move type combinations.",
    vfx: "spark_burst",
  },
];

async function seed() {
  const coll = db.collection("special_clash_events");
  let count = 0;
  for (const event of SPECIAL_CLASH_EVENTS) {
    await coll.doc(event.id).set(event);
    count++;
    console.log(`  ✓ special_clash_event: ${event.id}`);
  }
  console.log(`\n✅  Seeded ${count} special clash event configs.`);
}

seed().catch(err => { console.error(err); process.exit(1); });

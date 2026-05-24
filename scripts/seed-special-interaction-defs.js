// Seed script: writes 10 group×group special interaction definitions to Firestore.
// Run: node scripts/seed-special-interaction-defs.js
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

// Groups: strike | aerial | guard | field
const INTERACTION_DEFS = [
  {
    id: "strike:strike",
    attackerDamageScale: 1.0,
    defenderDamageScale: 1.0,
    attackerSpinDelta: -0.05,
    defenderSpinDelta: -0.05,
    attackerKnockback: "partial",
    defenderKnockback: "partial",
    timingBonus: {
      conditionDescription: "Contact at midpoint of BOTH active windows",
      peakFor: "both",
      bonusScale: 1.2,
    },
    description: "Both deal full damage; knockback determined by relative speed + spin. Perfect timing gives both +1.2x.",
  },
  {
    id: "strike:aerial",
    attackerDamageScale: 0.7,
    defenderDamageScale: 1.0,
    attackerSpinDelta: -0.08,
    defenderSpinDelta: -0.15,
    attackerKnockback: "full",
    defenderKnockback: "partial",
    description: "Rush intercepting airborne bey hits at 0.7x (less traction). Aerial bey has upper trajectory advantage.",
  },
  {
    id: "strike:guard",
    attackerDamageScale: 0.0,
    defenderDamageScale: 0.0,
    attackerSpinDelta: -0.1,
    defenderSpinDelta: 0.25,
    attackerKnockback: "reversed",
    defenderKnockback: "none",
    timingBonus: {
      conditionDescription: "Contact within 200ms of anchor active-start",
      peakFor: "defender",
      bonusScale: 1.5,
    },
    description: "Attacker deals 0 (invuln). Defender gains 0.25 maxSpin spin steal. Fresh anchor = peak absorption bonus.",
  },
  {
    id: "strike:field",
    attackerDamageScale: 0.8,
    defenderDamageScale: 0.5,
    attackerSpinDelta: 0.0,
    defenderSpinDelta: -0.1,
    attackerKnockback: "none",
    defenderKnockback: "full",
    description: "Strike passes through orbital/shockwave at 0.8x. Field move is disrupted. Shockwave detonates at contact point.",
  },
  {
    id: "aerial:aerial",
    attackerDamageScale: 1.0,
    defenderDamageScale: 1.0,
    attackerSpinDelta: -0.1,
    defenderSpinDelta: -0.1,
    attackerKnockback: "full",
    defenderKnockback: "full",
    description: "AERIAL CLASH path — both deal their phase damageMultiplier. Higher mult wins momentum direction.",
  },
  {
    id: "aerial:guard",
    attackerDamageScale: 0.0,
    defenderDamageScale: 0.0,
    attackerSpinDelta: 0.0,
    defenderSpinDelta: 0.0,
    attackerKnockback: "partial",
    defenderKnockback: "none",
    description: "Knockup sweep absorbed (0 damage). Anchor cannot spin-steal — sweep too brief for sustained contact.",
  },
  {
    id: "aerial:field",
    attackerDamageScale: 0.9,
    defenderDamageScale: 0.4,
    attackerSpinDelta: 0.0,
    defenderSpinDelta: -0.05,
    attackerKnockback: "none",
    defenderKnockback: "partial",
    description: "Aerial bey mostly unaffected by orbital/shockwave. Field move disrupted at 0.4x.",
  },
  {
    id: "guard:guard",
    attackerDamageScale: 0.0,
    defenderDamageScale: 0.0,
    attackerSpinDelta: 0.1,
    defenderSpinDelta: 0.1,
    attackerKnockback: "none",
    defenderKnockback: "none",
    description: "Both stationary anchors. No contact. Each restores spin independently.",
  },
  {
    id: "guard:field",
    attackerDamageScale: 0.0,
    defenderDamageScale: 0.0,
    attackerSpinDelta: 0.05,
    defenderSpinDelta: -0.05,
    attackerKnockback: "none",
    defenderKnockback: "partial",
    description: "Anchor holds position, takes 0 from shockwave/orbital. Generates counter-pulse reducing field AoE by 30%.",
  },
  {
    id: "field:field",
    attackerDamageScale: 0.4,
    defenderDamageScale: 0.4,
    attackerSpinDelta: -0.03,
    defenderSpinDelta: -0.03,
    attackerKnockback: "partial",
    defenderKnockback: "partial",
    description: "Orbital vs shockwave: glancing blow, 0.4x each, paths deflect. Two orbitals: perpendicular crossing at 0.4x.",
  },
];

async function main() {
  const col = db.collection("special_interaction_defs");
  let written = 0;
  for (const def of INTERACTION_DEFS) {
    const { id, ...data } = def;
    await col.doc(id).set(data, { merge: false });
    console.log(`  ✅ ${id}`);
    written++;
  }
  console.log(`\n✅ Seeded ${written} special_interaction_defs docs.`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });

// scripts/seed-beyblades.js
// Seeds 6 preset beyblades into Firestore beyblade_stats collection.
// Run: node scripts/seed-beyblades.js
// Idempotent — uses the preset ID as the document ID, safe to re-run.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars. Check your .env file.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();

// ─── Stat formula (mirrors types/beybladeStats.ts:calculateStats) ─────────────

function calcStats(dist) {
  const { attack, defense, stamina } = dist;
  return {
    damageMultiplier:      parseFloat((1.0 + attack  * 0.01).toFixed(3)),
    damageTaken:           parseFloat(Math.max(0.01, 1.0 - defense * 0.00333).toFixed(4)),
    knockbackDistance:     parseFloat(Math.max(0, 10 * (1 - defense * 0.00167)).toFixed(3)),
    invulnerabilityChance: parseFloat(Math.min(100, 10 * (1 + defense * 0.00667)).toFixed(2)),
    maxStamina:            Math.ceil(1000 * (1 + stamina * 0.01333)),
    spinStealFactor:       parseFloat((10 * (1 + stamina * 0.02667) / 100).toFixed(4)),
    spinDecayRate:         parseFloat(Math.max(0.5, 10 * (1 - stamina * 0.00167)).toFixed(3)),
    speedBonus:            parseFloat((10 * (1 + attack  * 0.01)).toFixed(2)),
    rotationSpeed:         parseFloat((10 * (1 + attack  * 0.01)).toFixed(2)),
  };
}

// 3 evenly-spaced contact points at 0°, 120°, 240°
function contactPoints(m1, m2, m3 = m2, width = 55) {
  return [
    { angle: 0,   damageMultiplier: m1, width },
    { angle: 120, damageMultiplier: m2, width },
    { angle: 240, damageMultiplier: m3, width },
  ];
}

function spinStealPoints(m1, m2 = m1, width = 45) {
  return [
    { angle: 60,  spinStealMultiplier: m1, width },
    { angle: 180, spinStealMultiplier: m2, width },
  ];
}

// ─── Preset definitions ───────────────────────────────────────────────────────

const now = new Date().toISOString();

const BEYBLADES = [
  // ── 1. Storm Pegasus — Attack archetype, right spin ──────────────────────
  {
    id: "storm-pegasus",
    displayName: "Storm Pegasus",
    fileName: "storm-pegasus.svg",
    type: "attack",
    spinDirection: "right",
    mass: 45,
    radius: 4.0,
    typeDistribution: { attack: 150, defense: 60, stamina: 150, total: 360 },
    pointsOfContact: contactPoints(1.8, 1.4, 1.2),
    spinStealPoints: spinStealPoints(1.1),
    description: "The ultimate offensive beyblade. Max attack power with reliable stamina.",
  },

  // ── 2. Rock Leone — Defense archetype, right spin ─────────────────────────
  {
    id: "rock-leone",
    displayName: "Rock Leone",
    fileName: "rock-leone.svg",
    type: "defense",
    spinDirection: "right",
    mass: 60,
    radius: 4.5,
    typeDistribution: { attack: 60, defense: 150, stamina: 150, total: 360 },
    pointsOfContact: contactPoints(1.1, 1.0),
    spinStealPoints: spinStealPoints(0.9, 0.85),
    description: "An immovable fortress. Absorbs damage and outlasts attackers.",
  },

  // ── 3. Earth Eagle — Stamina archetype, right spin ────────────────────────
  {
    id: "earth-eagle",
    displayName: "Earth Eagle",
    fileName: "earth-eagle.svg",
    type: "stamina",
    spinDirection: "right",
    mass: 40,
    radius: 4.0,
    typeDistribution: { attack: 75, defense: 135, stamina: 150, total: 360 },
    pointsOfContact: contactPoints(1.05, 1.0),
    spinStealPoints: [
      { angle: 45,  spinStealMultiplier: 1.8, width: 50 },
      { angle: 165, spinStealMultiplier: 1.6, width: 50 },
      { angle: 285, spinStealMultiplier: 1.5, width: 50 },
    ],
    description: "Master of endurance. Drains opponent spin while maintaining its own.",
  },

  // ── 4. Flame Sagittario — Balanced archetype, right spin ─────────────────
  {
    id: "flame-sagittario",
    displayName: "Flame Sagittario",
    fileName: "flame-sagittario.svg",
    type: "balanced",
    spinDirection: "right",
    mass: 50,
    radius: 4.0,
    typeDistribution: { attack: 120, defense: 120, stamina: 120, total: 360 },
    pointsOfContact: [
      { angle: 0,   damageMultiplier: 1.3, width: 50 },
      { angle: 90,  damageMultiplier: 1.2, width: 50 },
      { angle: 180, damageMultiplier: 1.3, width: 50 },
      { angle: 270, damageMultiplier: 1.2, width: 50 },
    ],
    spinStealPoints: spinStealPoints(1.2, 1.1),
    description: "The all-rounder. Solid in every category — a great starter choice.",
  },

  // ── 5. Lightning L-Drago — Attack, LEFT spin (counter to right-spin beys) ─
  {
    id: "lightning-l-drago",
    displayName: "Lightning L-Drago",
    fileName: "lightning-l-drago.svg",
    type: "attack",
    spinDirection: "left",
    mass: 42,
    radius: 3.8,
    typeDistribution: { attack: 145, defense: 65, stamina: 150, total: 360 },
    pointsOfContact: [
      { angle: 0,   damageMultiplier: 2.0, width: 40 },
      { angle: 120, damageMultiplier: 1.7, width: 40 },
      { angle: 240, damageMultiplier: 1.5, width: 40 },
    ],
    spinStealPoints: [
      { angle: 60,  spinStealMultiplier: 1.9, width: 45 },
      { angle: 180, spinStealMultiplier: 1.7, width: 45 },
      { angle: 300, spinStealMultiplier: 1.5, width: 45 },
    ],
    description: "Left-spin predator. Steals spin aggressively from right-spin opponents.",
  },

  // ── 6. Basalt Horogium — Defense, LEFT spin ────────────────────────────────
  {
    id: "basalt-horogium",
    displayName: "Basalt Horogium",
    fileName: "basalt-horogium.svg",
    type: "defense",
    spinDirection: "left",
    mass: 68,
    radius: 5.0,
    typeDistribution: { attack: 90, defense: 150, stamina: 120, total: 360 },
    pointsOfContact: contactPoints(1.15, 1.05),
    spinStealPoints: spinStealPoints(1.0, 0.95),
    description: "Heavy counter-spin fortress. Its mass alone deflects most attackers.",
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seedBeyblades() {
  console.log("\n══════════════════════════════════════");
  console.log("  Beyblade Preset Seed");
  console.log("══════════════════════════════════════\n");

  for (const bey of BEYBLADES) {
    const derived = calcStats(bey.typeDistribution);
    const docData = {
      ...bey,
      // Derived stats stored for admin UI display
      stamina:              derived.maxStamina,
      spinStealFactor:      derived.spinStealFactor,
      spinDecayRate:        derived.spinDecayRate,
      speed:                derived.speedBonus,
      rotationSpeed:        derived.rotationSpeed,
      invulnerabilityChance: derived.invulnerabilityChance,
      damageReduction:      parseFloat((1 / derived.damageTaken).toFixed(3)),
      createdAt:            now,
      updatedAt:            now,
      createdBy:            "seed",
    };

    try {
      await db.collection("beyblade_stats").doc(bey.id).set(docData, { merge: false });
      const maxDmg = (derived.damageMultiplier * 100).toFixed(0);
      console.log(`  ✔ ${bey.displayName.padEnd(22)} (${bey.type}, ${bey.spinDirection} spin)  HP=${derived.maxStamina}  DMG=${maxDmg}  Decay=${derived.spinDecayRate}/s`);
    } catch (err) {
      console.error(`  ✘ ${bey.displayName}: ${err.message}`);
    }
  }

  console.log(`\n✅ Seeded ${BEYBLADES.length} beyblades into beyblade_stats\n`);
}

seedBeyblades()
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

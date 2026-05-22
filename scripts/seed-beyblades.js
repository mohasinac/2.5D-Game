// scripts/seed-beyblades.js
// Seeds 16 preset beyblades into Firestore beyblade_stats collection.
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

// Default special + combo assignments per type.
// `specialMoveId` and `comboIds` are BOTH optional on a beyblade. Set per-bey below
// to override. These defaults make sure every seeded bey has a workable kit.
const DEFAULT_SPECIAL_BY_TYPE = {
  attack:   "stampede_rush",
  defense:  "gyro_anchor",
  stamina:  "spin_recovery",
  balanced: "tactical_burst",
};
// Burst resistance defaults by type (0–100; higher = harder to burst).
// Attack: low (offensive, fragile under heavy hits)
// Defense: high (sturdy, resists burst)
// Stamina: medium (manageable under sustained pressure)
// Balanced: medium
const DEFAULT_BURST_RESISTANCE_BY_TYPE = {
  attack:   35,
  defense:  75,
  stamina:  55,
  balanced: 50,
};
const DEFAULT_COMBOS_BY_TYPE = {
  attack:   ["quick-dash-r", "power-thrust", "pivot-strike"],
  defense:  ["guard-tap", "riposte", "feint"],
  stamina:  ["feint", "spin-leech-jab", "quick-dash-l"],
  balanced: ["quick-dash-l", "pivot-strike", "guard-tap"],
};

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
    linkedBeySystemId: "storm-aggressor",
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
    linkedBeySystemId: "fortress-leone",
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
    linkedBeySystemId: "endurance-eagle",
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
    linkedBeySystemId: "upper-attacker",
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

  // ── 7. Galaxy Pegasus — Attack archetype, right spin ──────────────────────────
  {
    id: "galaxy-pegasus",
    displayName: "Galaxy Pegasus",
    fileName: "galaxy-pegasus.svg",
    type: "attack",
    spinDirection: "right",
    mass: 43,
    radius: 3.9,
    typeDistribution: { attack: 150, defense: 45, stamina: 165, total: 360 },
    pointsOfContact: contactPoints(1.9, 1.5, 1.3),
    spinStealPoints: spinStealPoints(1.2, 1.0),
    description: "Maximum speed attack. Sacrifices defense for unmatched offensive power and endurance.",
  },

  // ── 8. Meteo L-Drago — Stamina archetype, left spin ────────────────────────────
  {
    id: "meteo-l-drago",
    displayName: "Meteo L-Drago",
    fileName: "meteo-l-drago.svg",
    type: "stamina",
    spinDirection: "left",
    mass: 38,
    radius: 3.8,
    typeDistribution: { attack: 80, defense: 100, stamina: 180, total: 360 },
    pointsOfContact: contactPoints(1.2, 1.0, 0.95),
    spinStealPoints: [
      { angle: 60,  spinStealMultiplier: 1.5, width: 40 },
      { angle: 180, spinStealMultiplier: 1.8, width: 40 },
      { angle: 300, spinStealMultiplier: 1.4, width: 40 },
    ],
    description: "Left-spin endurance beast. Superior stamina enables prolonged spin-stealing attacks.",
  },

  // ── 9. Thermal Pisces — Stamina archetype, right spin ────────────────────────────
  {
    id: "thermal-pisces",
    displayName: "Thermal Pisces",
    fileName: "thermal-pisces.svg",
    type: "stamina",
    spinDirection: "right",
    mass: 41,
    radius: 4.2,
    typeDistribution: { attack: 55, defense: 125, stamina: 180, total: 360 },
    pointsOfContact: contactPoints(1.1, 1.05),
    spinStealPoints: spinStealPoints(1.7, 1.5),
    description: "Aquatic endurance. High stamina with defensive properties for long battles.",
  },

  // ── 10. Fang Leone — Defense archetype, right spin ───────────────────────────────
  {
    id: "fang-leone",
    displayName: "Fang Leone",
    fileName: "fang-leone.svg",
    type: "defense",
    spinDirection: "right",
    mass: 62,
    radius: 4.8,
    typeDistribution: { attack: 75, defense: 145, stamina: 140, total: 360 },
    pointsOfContact: contactPoints(1.15, 1.1),
    spinStealPoints: spinStealPoints(1.05, 1.0),
    description: "Heavy fanged guardian. Extreme defensive capabilities with solid stamina pool.",
  },

  // ── 11. Jade Jupiter — Stamina archetype, left spin ───────────────────────────────
  {
    id: "jade-jupiter",
    displayName: "Jade Jupiter",
    fileName: "jade-jupiter.svg",
    type: "stamina",
    spinDirection: "left",
    mass: 44,
    radius: 4.3,
    typeDistribution: { attack: 65, defense: 130, stamina: 165, total: 360 },
    pointsOfContact: contactPoints(1.1, 1.05, 1.0),
    spinStealPoints: spinStealPoints(1.6, 1.4),
    description: "Planetary endurance. Left-spin strategy with balanced defense and superior stamina.",
  },

  // ── 12. Screw Capricorn — Attack archetype, right spin ─────────────────────────────
  {
    id: "screw-capricorn",
    displayName: "Screw Capricorn",
    fileName: "screw-capricorn.svg",
    type: "attack",
    spinDirection: "right",
    mass: 46,
    radius: 4.0,
    typeDistribution: { attack: 145, defense: 80, stamina: 135, total: 360 },
    pointsOfContact: contactPoints(1.85, 1.4, 1.3),
    spinStealPoints: spinStealPoints(1.1, 0.95),
    description: "Spiral attacker. Strong offensive capability with good endurance.",
  },

  // ── 13. Death Quetzalcoatl — Stamina archetype, left spin ─────────────────────────
  {
    id: "death-quetzalcoatl",
    displayName: "Death Quetzalcoatl",
    fileName: "death-quetzalcoatl.svg",
    type: "stamina",
    spinDirection: "left",
    mass: 39,
    radius: 4.1,
    typeDistribution: { attack: 70, defense: 115, stamina: 175, total: 360 },
    pointsOfContact: contactPoints(1.1, 1.0, 0.95),
    spinStealPoints: spinStealPoints(1.8, 1.5),
    description: "Legendary left-spin endurance. Supreme stamina for ultimate persistence.",
  },

  // ── 14. Diablo Nemesis — Balanced archetype, right spin ────────────────────────────
  {
    id: "diablo-nemesis",
    displayName: "Diablo Nemesis",
    fileName: "diablo-nemesis.svg",
    type: "balanced",
    spinDirection: "right",
    mass: 55,
    radius: 4.5,
    typeDistribution: { attack: 130, defense: 130, stamina: 100, total: 360 },
    pointsOfContact: [
      { angle: 0,   damageMultiplier: 1.4, width: 55 },
      { angle: 90,  damageMultiplier: 1.3, width: 55 },
      { angle: 180, damageMultiplier: 1.4, width: 55 },
      { angle: 270, damageMultiplier: 1.3, width: 55 },
    ],
    spinStealPoints: spinStealPoints(1.2, 1.15),
    description: "Balanced powerhouse. Strong attack and defense with manageable stamina.",
  },

  // ── 15. Wing Pegasis — Attack archetype, right spin ───────────────────────────────
  {
    id: "wing-pegasis",
    displayName: "Wing Pegasis",
    fileName: "wing-pegasis.svg",
    type: "attack",
    spinDirection: "right",
    mass: 41,
    radius: 3.7,
    typeDistribution: { attack: 140, defense: 55, stamina: 165, total: 360 },
    pointsOfContact: contactPoints(1.85, 1.35, 1.2),
    spinStealPoints: spinStealPoints(1.15, 0.95),
    description: "Swift wing attack. Fastest attacker with good endurance.",
  },

  // ── 16. Big Bang Pegasis — Balanced archetype, right spin ─────────────────────────
  {
    id: "big-bang-pegasis",
    displayName: "Big Bang Pegasis",
    fileName: "big-bang-pegasis.svg",
    type: "balanced",
    spinDirection: "right",
    mass: 48,
    radius: 4.2,
    typeDistribution: { attack: 135, defense: 115, stamina: 110, total: 360 },
    pointsOfContact: [
      { angle: 0,   damageMultiplier: 1.35, width: 50 },
      { angle: 120, damageMultiplier: 1.25, width: 50 },
      { angle: 240, damageMultiplier: 1.2,  width: 50 },
    ],
    spinStealPoints: spinStealPoints(1.15, 1.05),
    description: "Explosive balanced force. Great attack with solid defense.",
  },

  // ─── BURST GEN ─────────────────────────────────────────────────────────────
  {
    id: "valtryek-v2",
    displayName: "Valtryek V2",
    fileName: "valtryek-v2.svg",
    type: "attack",
    spinDirection: "right",
    mass: 44,
    radius: 3.9,
    typeDistribution: { attack: 150, defense: 90, stamina: 120, total: 360 },
    pointsOfContact: contactPoints(1.85, 1.4, 1.25),
    spinStealPoints: spinStealPoints(1.1),
    description: "Burst-gen attack with a chrome wing — fast, brutal, predictable.",
    comboIds: ["quick-dash-r", "quick-dash-l", "power-thrust"],
  },
  {
    id: "spryzen-s2",
    displayName: "Spryzen S2",
    fileName: "spryzen-s2.svg",
    type: "balanced",
    spinDirection: "right",
    mass: 47,
    radius: 4.0,
    typeDistribution: { attack: 120, defense: 130, stamina: 110, total: 360 },
    pointsOfContact: contactPoints(1.45, 1.35, 1.3),
    spinStealPoints: spinStealPoints(1.1, 1.0),
    description: "Burst-gen balanced. Switch-strike layer; safe in mirror matches.",
    comboIds: ["pivot-strike", "guard-tap", "feint"],
  },
  // ─── X-GEN ────────────────────────────────────────────────────────────────
  {
    id: "dranzer-spiral",
    displayName: "Dranzer Spiral",
    fileName: "dranzer-spiral.svg",
    type: "attack",
    spinDirection: "right",
    mass: 49,
    radius: 4.1,
    typeDistribution: { attack: 145, defense: 95, stamina: 120, total: 360 },
    pointsOfContact: contactPoints(1.9, 1.45, 1.25),
    spinStealPoints: spinStealPoints(1.15),
    description: "X-gen revival of Dranzer — counter-rotating outer ring trades grip for raw smash.",
    comboIds: ["quick-dash-r", "power-thrust", "pivot-strike"],
  },
  {
    id: "hells-hammer",
    displayName: "Hells Hammer",
    fileName: "hells-hammer.svg",
    type: "defense",
    spinDirection: "left",
    mass: 53,
    radius: 4.3,
    typeDistribution: { attack: 100, defense: 150, stamina: 110, total: 360 },
    pointsOfContact: contactPoints(1.4, 1.5, 1.45),
    spinStealPoints: spinStealPoints(1.25, 1.1),
    description: "X-gen left-spin tank. Eats stamina hits and counters smash attempts.",
    comboIds: ["guard-tap", "riposte", "feint"],
  },
];

// ─── Element type assignments (Phase AB) ─────────────────────────────────────
// Max 2 per beyblade. Used for type-effectiveness damage multipliers.
const ELEMENT_TYPES_BY_ID = {
  "storm-pegasus":       ["wind", "lightning"],
  "rock-leone":          ["earth"],
  "earth-eagle":         ["earth", "wind"],
  "flame-sagittario":    ["fire"],
  "lightning-l-drago":   ["lightning", "shadow"],
  "basalt-horogium":     ["earth", "metal"],
  "galaxy-pegasus":      ["wind"],
  "meteo-l-drago":       ["shadow", "thunder"],
  "thermal-pisces":      ["water"],
  "fang-leone":          ["earth"],
  "jade-jupiter":        ["nature", "water"],
  "screw-capricorn":     ["wind", "earth"],
  "death-quetzalcoatl":  ["shadow"],
  "diablo-nemesis":      ["void"],
  "wing-pegasis":        ["wind", "lightning"],
  "big-bang-pegasis":    ["fire", "wind"],
  "valtryek-v2":         ["lightning"],
  "spryzen-s2":          ["metal", "shadow"],
  "dranzer-spiral":      ["fire", "thunder"],
  "hells-hammer":        ["metal", "void"],
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seedBeyblades() {
  console.log("\n══════════════════════════════════════");
  console.log("  Beyblade Preset Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("beyblade_stats");

  for (const bey of BEYBLADES) {
    const derived = calcStats(bey.typeDistribution);
    // Optional kit — special + combos. Per-bey overrides win; otherwise fall back to type defaults.
    const specialMoveId = bey.specialMoveId ?? DEFAULT_SPECIAL_BY_TYPE[bey.type] ?? "tactical_burst";
    const comboIds      = (bey.comboIds ?? DEFAULT_COMBOS_BY_TYPE[bey.type] ?? []).slice(0, 3);

    // comboSlots — structured version of comboIds for the new slot system.
    // Keep comboIds alongside for backward compat — don't remove it.
    const comboSlots = comboIds.map((comboEffectId, slotIndex) => ({ comboEffectId, slotIndex }));

    const docData = {
      ...bey,
      elementTypes: ELEMENT_TYPES_BY_ID[bey.id] ?? [],
      // Derived stats stored for admin UI display
      stamina:              derived.maxStamina,
      spinStealFactor:      derived.spinStealFactor,
      spinDecayRate:        derived.spinDecayRate,
      speed:                derived.speedBonus,
      rotationSpeed:        derived.rotationSpeed,
      invulnerabilityChance: derived.invulnerabilityChance,
      damageReduction:      parseFloat((1 / derived.damageTaken).toFixed(3)),
      // Jump physics — beys don't jump by default; combos may grant jump behaviour
      jumpForce:            0,
      jumpHeight:           0,
      // Burst resistance (R1) — per-type default; per-bey override wins
      burstResistance:      bey.burstResistance ?? DEFAULT_BURST_RESISTANCE_BY_TYPE[bey.type] ?? 50,
      // Optional kit
      specialMoveId,
      comboIds,
      comboSlots,
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

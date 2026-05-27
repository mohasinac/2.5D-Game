// scripts/seed-beyblades.js
// Seeds ALL beyblades from the stock combo tables in INDEX.md into Firestore beyblade_stats collection.
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
function contactPoints3(m1, m2, m3 = m2, width = 55) {
  return [
    { angle: 0,   damageMultiplier: m1, width },
    { angle: 120, damageMultiplier: m2, width },
    { angle: 240, damageMultiplier: m3, width },
  ];
}

// 4 evenly-spaced contact points at 0°, 90°, 180°, 270° (balanced types)
function contactPoints4(m1, m2, m3 = m1, m4 = m2, width = 50) {
  return [
    { angle: 0,   damageMultiplier: m1, width },
    { angle: 90,  damageMultiplier: m2, width },
    { angle: 180, damageMultiplier: m3, width },
    { angle: 270, damageMultiplier: m4, width },
  ];
}

function spinStealPoints(m1, m2 = m1, width = 45) {
  return [
    { angle: 60,  spinStealMultiplier: m1, width },
    { angle: 180, spinStealMultiplier: m2, width },
  ];
}

// Burst resistance defaults by type
const DEFAULT_BURST_RESISTANCE_BY_TYPE = {
  attack:   35,
  defense:  75,
  stamina:  55,
  balanced: 50,
};

// Default physics flags
const DEFAULT_PHYSICS_FLAGS = {
  collisionWithBeys:       true,
  collisionWithArena:      true,
  collisionWithObstacles:  true,
  collisionWithProjectiles: true,
  invulnerable:            false,
  noDamageOutput:          false,
  noKnockback:             false,
  noGravityWell:           false,
  noSpinZone:              false,
  noTriggerZone:           false,
};

// ─── Helper: build a beyblade entry ─────────────────────────────────────────

function bey(id, displayName, opts) {
  const type = opts.type || "balanced";
  const cp = type === "balanced"
    ? contactPoints4(opts.dm1 || 1.3, opts.dm2 || 1.2)
    : contactPoints3(opts.dm1 || 1.5, opts.dm2 || 1.2, opts.dm3 || opts.dm2 || 1.2);
  const ss = spinStealPoints(opts.ss1 || 1.1, opts.ss2 || opts.ss1 || 1.0);

  return {
    id,
    displayName,
    fileName: `${id}.svg`,
    color: opts.color || "#888888",
    type,
    spinDirection: opts.spin || "right",
    mass: opts.mass || 35,
    radius: opts.radius || 3.5,
    typeDistribution: {
      attack: opts.atk || 120,
      defense: opts.def || 120,
      stamina: opts.sta || 120,
      total: 360,
    },
    pointsOfContact: cp,
    spinStealPoints: ss,
    description: opts.desc || `${displayName} beyblade.`,
    elementTypes: opts.elements || [],
    gimmickIds: opts.gimmicks || [],
  };
}

// ─── ALL BEYBLADES ───────────────────────────────────────────────────────────

const now = new Date().toISOString();

const BEYBLADES = [

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 1 — PLASTICS: 4 LAYER SYSTEM (4LS) — 23 beyblades
  // ═══════════════════════════════════════════════════════════════════════════

  bey("ultimate-dragoon", "Ultimate Dragoon", {
    type: "attack", color: "#4488FF", mass: 30, radius: 3.2,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.1, ss2: 0.9,
    desc: "The original Dragon beyblade — raw offensive power with a flat base.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("saizo", "Saizo", {
    type: "defense", color: "#336699", mass: 32, radius: 3.3,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Ninja-themed defensive beyblade with a sharp base for stability.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("frostic-dranzer", "Frostic Dranzer", {
    type: "balanced", color: "#CC3333", mass: 31, radius: 3.2,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Early Dranzer variant — balanced wing design with semi-flat base.",
    elements: ["fire", "ice"],
    gimmicks: [],
  }),

  bey("gekiryu-oh", "Gekiryu-oh", {
    type: "balanced", color: "#5588CC", mass: 31, radius: 3.3,
    atk: 115, def: 120, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Dragon King variant with balanced wing cross and semi-flat base.",
    elements: ["wind", "water"],
    gimmicks: [],
  }),

  bey("megaro-arm", "Megaro Arm", {
    type: "attack", color: "#FF6644", mass: 32, radius: 3.2,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Heavy attack beyblade with cross dragon ring and flat base.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("spark-knight", "Spark Knight", {
    type: "defense", color: "#FFCC00", mass: 30, radius: 3.1,
    atk: 65, def: 145, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Knight-themed defense beyblade with sharp tip stability.",
    elements: ["lightning"],
    gimmicks: [],
  }),

  bey("polta", "Polta", {
    type: "defense", color: "#AA55CC", mass: 29, radius: 3.1,
    atk: 60, def: 140, sta: 160,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.0, ss2: 0.9,
    desc: "Wide-tracked defensive beyblade with sharp base for endurance.",
    elements: ["nature"],
    gimmicks: [],
  }),

  bey("bistool", "Bistool", {
    type: "balanced", color: "#669966", mass: 32, radius: 3.2,
    atk: 115, def: 125, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Insect-themed balanced beyblade with semi-flat stability.",
    elements: ["nature"],
    gimmicks: [],
  }),

  bey("makendo", "Makendo", {
    type: "attack", color: "#FF4444", mass: 30, radius: 3.2,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Samurai sword-themed attacker with aggressive flat base movement.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("bakushin-oh", "Bakushin-oh", {
    type: "attack", color: "#CC0000", mass: 33, radius: 3.3,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "God of Explosive Advance — heavy down-force attack ring with flat base.",
    elements: ["fire", "earth"],
    gimmicks: [],
  }),

  bey("pumpking", "Pumpking", {
    type: "balanced", color: "#FF8800", mass: 31, radius: 3.3,
    atk: 125, def: 115, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Halloween-themed beyblade with upper force ring and semi-flat base.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("dragoon-grip-attacker", "Dragoon Grip Attacker", {
    type: "attack", color: "#3366FF", mass: 32, radius: 3.3,
    atk: 145, def: 60, sta: 155,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Dragoon variant with rubber grip base for aggressive stadium movement.",
    elements: ["wind"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("metal-dragoon-bearing-stinger", "Metal Dragoon Bearing Stinger", {
    type: "stamina", color: "#6688CC", mass: 34, radius: 3.4,
    atk: 70, def: 110, sta: 180,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.3,
    desc: "First bearing-equipped beyblade — superior spin time and endurance.",
    elements: ["wind", "metal"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("bound-attacker", "Bound Attacker", {
    type: "attack", color: "#FF5533", mass: 30, radius: 3.1,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Spring-loaded attack ring that bounces on impact for extra smash.",
    elements: ["lightning"],
    gimmicks: ["recoil_guard"],
  }),

  bey("bound-defenser", "Bound Defenser", {
    type: "defense", color: "#5588AA", mass: 33, radius: 3.3,
    atk: 65, def: 145, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Defensive variant with spring-loaded ring that absorbs recoil.",
    elements: ["earth"],
    gimmicks: ["recoil_guard"],
  }),

  bey("roller-attacker", "Roller Attacker", {
    type: "attack", color: "#FF7744", mass: 30, radius: 3.1,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Rolling contact points deliver continuous smash attacks.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("roller-defenser", "Roller Defenser", {
    type: "defense", color: "#77AACC", mass: 33, radius: 3.3,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Rolling defense ring deflects attacks with rotating contacts.",
    elements: ["earth", "metal"],
    gimmicks: [],
  }),

  bey("dranzer-auto-change-balancer", "Dranzer Auto Change Balancer", {
    type: "balanced", color: "#DD2222", mass: 31, radius: 3.2,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Dranzer with auto-change base — switches between attack and defense modes.",
    elements: ["fire"],
    gimmicks: ["mode_change"],
  }),

  bey("wing-attacker", "Wing Attacker", {
    type: "attack", color: "#44CCFF", mass: 30, radius: 3.1,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Wing-shaped attack ring for upper attacks with semi-flat movement.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("wing-defenser", "Wing Defenser", {
    type: "defense", color: "#5577AA", mass: 33, radius: 3.3,
    atk: 60, def: 145, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Wing-shaped defense ring for recoil absorption.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("draciel-metal-ball-defenser", "Draciel Metal Ball Defenser", {
    type: "defense", color: "#8844AA", mass: 35, radius: 3.4,
    atk: 55, def: 150, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Draciel with heavy metal ball base — ultimate 4LS defensive wall.",
    elements: ["water", "earth"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("sparkling-attacker", "Sparkling Attacker", {
    type: "attack", color: "#FFDD44", mass: 33, radius: 3.3,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Spark-generating attack ring with flat base aggression.",
    elements: ["lightning", "fire"],
    gimmicks: [],
  }),

  bey("jumping-base-set", "Jumping Base Set", {
    type: "balanced", color: "#44AA88", mass: 30, radius: 3.2,
    atk: 120, def: 110, sta: 130,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Tiger Defenser with jumping base — hops to dodge and reposition.",
    elements: ["earth"],
    gimmicks: ["spring_launch"],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 1 — PLASTICS: SPIN GEAR SYSTEM (A–F SERIES) — 35 beyblades
  // ═══════════════════════════════════════════════════════════════════════════

  bey("dragoon-s", "Dragoon S", {
    type: "attack", color: "#2266FF", mass: 33, radius: 3.3, spin: "left",
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Storm Dragon — left-spin attacker with Storm Grip Base for aggressive movement.",
    elements: ["wind", "lightning"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("driger-s", "Driger S", {
    type: "balanced", color: "#228822", mass: 34, radius: 3.3,
    atk: 120, def: 125, sta: 115,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Slash Tiger — balanced with Metal Change Base that shifts between modes.",
    elements: ["earth", "nature"],
    gimmicks: ["mode_change"],
  }),

  bey("death-driger", "Death Driger", {
    type: "defense", color: "#333333", mass: 32, radius: 3.2,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Dark tiger variant — sharp base for defensive stability.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("knight-dranzer", "Knight Dranzer", {
    type: "balanced", color: "#CC2244", mass: 31, radius: 3.2,
    atk: 115, def: 125, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Knight-themed Dranzer with balanced semi-flat movement.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("metal-draciel", "Metal Draciel", {
    type: "defense", color: "#7744AA", mass: 36, radius: 3.4,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Heavy metal Draciel — Turtle Survivor ring with Metal Sting base.",
    elements: ["water", "metal"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("kids-dragoon", "Kids Dragoon", {
    type: "attack", color: "#55AAFF", mass: 28, radius: 3.0,
    atk: 130, def: 80, sta: 150,
    dm1: 1.5, dm2: 1.2, dm3: 1.1, ss1: 1.0, ss2: 0.9,
    desc: "Smaller Dragoon for younger bladers — flat base attack movement.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("kids-draciel", "Kids Draciel", {
    type: "defense", color: "#9966CC", mass: 30, radius: 3.1,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Smaller Draciel for younger bladers — sharp base stability.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("dranzer-s", "Dranzer S", {
    type: "stamina", color: "#EE2222", mass: 32, radius: 3.2,
    atk: 75, def: 115, sta: 170,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.4, ss2: 1.2,
    desc: "Spiral Dranzer — free-spinning shaft base for extended spin time.",
    elements: ["fire"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("galeon", "Galeon", {
    type: "balanced", color: "#DD8822", mass: 33, radius: 3.3,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "War Lion — balanced beyblade with semi-flat versatility.",
    elements: ["earth", "fire"],
    gimmicks: [],
  }),

  bey("galzzly", "Galzzly", {
    type: "attack", color: "#885522", mass: 32, radius: 3.2,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "War Bear — aggressive flat base attacker with wide track.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("galman", "Galman", {
    type: "defense", color: "#CC8844", mass: 32, radius: 3.2,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "War Monkey — sharp base defensive stability.",
    elements: ["nature"],
    gimmicks: [],
  }),

  bey("wolborg", "Wolborg", {
    type: "stamina", color: "#AADDEE", mass: 34, radius: 3.3,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Ice Wolf — bearing base provides legendary spin time and endurance.",
    elements: ["ice"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("seaborg", "Seaborg", {
    type: "defense", color: "#3388BB", mass: 34, radius: 3.4,
    atk: 60, def: 145, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Whale Attacker — defense grip base provides solid defensive stability.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("draciel-s", "Draciel S", {
    type: "defense", color: "#7755BB", mass: 35, radius: 3.4,
    atk: 55, def: 150, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Shield Draciel — metal ball base for heavy defensive anchoring.",
    elements: ["water", "earth"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("trygle", "Trygle", {
    type: "balanced", color: "#44BB44", mass: 31, radius: 3.2,
    atk: 120, def: 115, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Eagle with triple wing — jumping base for evasive repositioning.",
    elements: ["wind"],
    gimmicks: ["spring_launch"],
  }),

  bey("trypio", "Trypio", {
    type: "defense", color: "#448866", mass: 32, radius: 3.2,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Flying defense ring with sharp base stability.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("driger-f", "Driger F", {
    type: "attack", color: "#11AA33", mass: 33, radius: 3.3,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Fang Tiger — Full Auto Clutch base releases for aggressive late-battle attack.",
    elements: ["earth", "nature"],
    gimmicks: ["mode_change"],
  }),

  bey("dragoon-f", "Dragoon F", {
    type: "attack", color: "#2255EE", mass: 33, radius: 3.3, spin: "left",
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Fantom Dragon — left-spin with Fantom Grip Base for aggressive rushdown.",
    elements: ["wind"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("dranzer-f", "Dranzer F", {
    type: "balanced", color: "#EE3333", mass: 34, radius: 3.3,
    atk: 125, def: 120, sta: 115,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Flame Dranzer — Flame Change Base switches between attack and survival modes.",
    elements: ["fire"],
    gimmicks: ["mode_change"],
  }),

  bey("griffolyon", "Griffolyon", {
    type: "balanced", color: "#8855CC", mass: 33, radius: 3.3,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Griffin-themed balanced beyblade with cross attack ring.",
    elements: ["shadow", "wind"],
    gimmicks: [],
  }),

  bey("master-dragoon", "Master Dragoon", {
    type: "attack", color: "#4477FF", mass: 33, radius: 3.3,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Training Dragoon with flat base — accessible attack style.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("master-dranzer", "Master Dranzer", {
    type: "defense", color: "#DD4444", mass: 34, radius: 3.3,
    atk: 60, def: 145, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Training Dranzer with Metal Sting Base — defensive stability.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("master-draciel", "Master Draciel", {
    type: "defense", color: "#8866BB", mass: 33, radius: 3.2,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Training Draciel with sharp base — accessible defense style.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("salamalyon", "Salamalyon", {
    type: "attack", color: "#FF5500", mass: 32, radius: 3.2,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Fire salamander — aggressive attack with wide track.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("draciel-f", "Draciel F", {
    type: "stamina", color: "#6644AA", mass: 35, radius: 3.4,
    atk: 55, def: 125, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Fortress Draciel — grease ball base for smooth, extended spinning.",
    elements: ["water", "earth"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("wyborg", "Wyborg", {
    type: "balanced", color: "#448844", mass: 31, radius: 3.2,
    atk: 115, def: 120, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Snake beyblade with Auto Change Base — switches modes mid-battle.",
    elements: ["nature"],
    gimmicks: ["mode_change"],
  }),

  bey("master-driger", "Master Driger", {
    type: "balanced", color: "#33AA55", mass: 32, radius: 3.2,
    atk: 115, def: 125, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Training Driger with semi-flat base — balanced accessibility.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("wolborg-2", "Wolborg 2", {
    type: "stamina", color: "#BBDDEE", mass: 34, radius: 3.3,
    atk: 65, def: 115, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Ice Wolf V2 — upgraded bearing with Defense Grip Base 2 for supreme endurance.",
    elements: ["ice"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("seaborg-2", "Seaborg 2", {
    type: "attack", color: "#2288BB", mass: 32, radius: 3.2,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Whale Crusher — upgraded with flat base for attack movement.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("gaia-dragoon", "Gaia Dragoon", {
    type: "balanced", color: "#3355DD", mass: 36, radius: 3.5,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Great Dragon — heavy balanced beyblade with G Special Base.",
    elements: ["earth", "wind"],
    gimmicks: [],
  }),

  bey("bakuten-henkei-gaia-dragoon", "Bakuten Henkei Gaia Dragoon", {
    type: "attack", color: "#FF4422", mass: 34, radius: 3.3,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Transforming Gaia Dragoon — Fire Cracker attack with Salamalyon base.",
    elements: ["fire", "wind"],
    gimmicks: [],
  }),

  bey("dranzer-s-spiral", "Dranzer S (Spiral)", {
    type: "stamina", color: "#EE2255", mass: 32, radius: 3.2,
    atk: 70, def: 115, sta: 175,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.3,
    desc: "Double Wing Dranzer with free-spinning Spiral Change Base.",
    elements: ["fire"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("gaia-dragoon-sg", "Bakuten Henkei Gaia Dragoon (SG)", {
    type: "attack", color: "#FF5533", mass: 34, radius: 3.3,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "SG-era transforming Gaia Dragoon variant.",
    elements: ["fire", "wind"],
    gimmicks: [],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 1 — PLASTICS: V SERIES (MAGNACORE) — 26 beyblades
  // ═══════════════════════════════════════════════════════════════════════════

  bey("dragoon-v", "Dragoon V", {
    type: "attack", color: "#1155FF", mass: 34, radius: 3.4, spin: "left",
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Victory Dragon — Magnacore left-spin with Magne Flat Base for extreme aggression.",
    elements: ["wind", "lightning"],
    gimmicks: ["magnacore_attract", "speed_boost_tip"],
  }),

  bey("metal-dranzer", "Metal Dranzer", {
    type: "attack", color: "#CC1111", mass: 34, radius: 3.3,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Metal Dranzer — scissor attack with flat base movement.",
    elements: ["fire", "metal"],
    gimmicks: [],
  }),

  bey("flash-leopard", "Flash Leopard", {
    type: "balanced", color: "#DDAA22", mass: 34, radius: 3.3,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Panther-themed balanced beyblade with Magnacore semi-flat stability.",
    elements: ["lightning"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("driger-v", "Driger V", {
    type: "attack", color: "#11BB44", mass: 34, radius: 3.3,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Vulcan Tiger — Metal Flat Base for aggressive attack patterns.",
    elements: ["earth", "lightning"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("flash-leopard-2", "Flash Leopard 2", {
    type: "defense", color: "#CCAA33", mass: 34, radius: 3.3,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Upgraded Flash Leopard — Metal Sharp Base for defensive stability.",
    elements: ["lightning"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("dranzer-v", "Dranzer V", {
    type: "balanced", color: "#EE2244", mass: 33, radius: 3.3,
    atk: 125, def: 115, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Volcano Dranzer — Volcano Change Base switches between modes.",
    elements: ["fire"],
    gimmicks: ["mode_change"],
  }),

  bey("cyber-dragoon", "Cyber Dragoon", {
    type: "balanced", color: "#4488DD", mass: 33, radius: 3.3,
    atk: 120, def: 115, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Cybernetic Dragon with Jumping Base 2 — repositioning specialist.",
    elements: ["wind", "lightning"],
    gimmicks: ["spring_launch"],
  }),

  bey("draciel-v", "Draciel V", {
    type: "defense", color: "#6633AA", mass: 35, radius: 3.4,
    atk: 55, def: 150, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Viper Draciel — Metal Ball Base for heavy defensive anchoring.",
    elements: ["water"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("wolborg-03", "Wolborg 03", {
    type: "attack", color: "#AACCEE", mass: 34, radius: 3.3,
    atk: 135, def: 80, sta: 145,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.1, ss2: 0.9,
    desc: "Uriel — Cross Horn with Grip Base for aggressive approach.",
    elements: ["ice"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("gabriel", "Gabriel", {
    type: "balanced", color: "#EEDDAA", mass: 33, radius: 3.3,
    atk: 115, def: 115, sta: 130,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.2, ss2: 1.0,
    desc: "Angel-themed beyblade with Wing Base — gliding movement pattern.",
    elements: ["light"],
    gimmicks: [],
  }),

  bey("guardian-driger", "Guardian Driger", {
    type: "attack", color: "#22AA44", mass: 33, radius: 3.3,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Great Tiger — powerful flat base attacker with heavy weight disk.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("spike-lizard", "Spike Lizard", {
    type: "defense", color: "#88AA44", mass: 34, radius: 3.3,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Lizard with roller base — deflects attacks while maintaining position.",
    elements: ["nature"],
    gimmicks: [],
  }),

  bey("crab-diver", "Crab Diver", {
    type: "balanced", color: "#CC5544", mass: 32, radius: 3.2,
    atk: 115, def: 125, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Scissors Arm crab — semi-flat balanced Magnacore beyblade.",
    elements: ["water"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("orca-diver", "Orca Diver", {
    type: "attack", color: "#3366BB", mass: 32, radius: 3.2,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Delta Wave orca — flat base attack with Magnacore movement.",
    elements: ["water"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("manta-diver", "Manta Diver", {
    type: "defense", color: "#5588CC", mass: 32, radius: 3.2,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Square Edge manta — sharp base defensive stability.",
    elements: ["water"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("killer-eagle", "Killer Eagle", {
    type: "balanced", color: "#6688AA", mass: 32, radius: 3.2,
    atk: 115, def: 125, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Penta Wing eagle — semi-flat balanced with Magnacore system.",
    elements: ["wind"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("death-gargoyle", "Death Gargoyle", {
    type: "attack", color: "#444444", mass: 33, radius: 3.3,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Genocide Circle — devastating flat base attacker.",
    elements: ["shadow", "void"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("rushing-boar", "Rushing Boar", {
    type: "defense", color: "#AA6633", mass: 34, radius: 3.3,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Hammer Tusk boar — sharp base defensive endurance.",
    elements: ["earth"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("galeon-2", "Galeon 2", {
    type: "balanced", color: "#CC8833", mass: 33, radius: 3.3,
    atk: 115, def: 125, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Howling Leo — upgraded lion with semi-flat Magnacore base.",
    elements: ["earth", "fire"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("trygle-2", "Trygle 2", {
    type: "defense", color: "#44BB55", mass: 32, radius: 3.2,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Triple Beak eagle — sharp base defensive upgrade.",
    elements: ["wind"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("trygator", "Trygator", {
    type: "attack", color: "#448844", mass: 32, radius: 3.2,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Jungle Shock gator — flat base with Magnacore aggression.",
    elements: ["nature", "water"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("cyber-dragoon-battle-spec", "Cyber Dragoon Battle Spec.", {
    type: "balanced", color: "#3377CC", mass: 32, radius: 3.2,
    atk: 120, def: 115, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Battle-upgraded Cyber Dragoon with Wing Base movement.",
    elements: ["wind", "lightning"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("ultimate-dragoon-v", "Ultimate Dragoon V", {
    type: "attack", color: "#5599FF", mass: 33, radius: 3.3,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "V-series Ultimate Dragoon — Magne Weight Disk with flat base.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("appollon", "Appollon", {
    type: "attack", color: "#FFAA22", mass: 32, radius: 3.2,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Sun god — Corona Saber with flat base attack.",
    elements: ["fire", "light"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("venus", "Venus", {
    type: "defense", color: "#FFAACC", mass: 32, radius: 3.2,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Mirage Goddess — sharp base defensive beauty.",
    elements: ["light", "water"],
    gimmicks: ["magnacore_attract"],
  }),

  bey("poseidon", "Poseidon", {
    type: "balanced", color: "#2266AA", mass: 33, radius: 3.3,
    atk: 115, def: 125, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Trident Vector — ocean god with semi-flat Magnacore balance.",
    elements: ["water"],
    gimmicks: ["magnacore_attract"],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 1 — PLASTICS: V2 SERIES — 14 beyblades
  // ═══════════════════════════════════════════════════════════════════════════

  bey("dragoon-v2", "Dragoon V2", {
    type: "attack", color: "#0044DD", mass: 36, radius: 3.5, spin: "left",
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Ultimate left-spin attacker — Customize Grip Base with Reverse Attack SP.",
    elements: ["wind", "lightning"],
    gimmicks: ["speed_boost_tip", "recoil_guard"],
  }),

  bey("driger-v2", "Driger V2", {
    type: "attack", color: "#118833", mass: 35, radius: 3.4,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Upper Claw tiger — Metal Change Base with Upper Attack SP.",
    elements: ["earth", "nature"],
    gimmicks: ["mode_change"],
  }),

  bey("voltaic-ape", "Voltaic Ape", {
    type: "defense", color: "#FFBB22", mass: 35, radius: 3.4,
    atk: 70, def: 145, sta: 145,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Mountain Hammer — Metal Sharp Base with Defense Ring SP.",
    elements: ["lightning", "earth"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("gaia-dragoon-v", "Gaia Dragoon V", {
    type: "attack", color: "#3366EE", mass: 35, radius: 3.5,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "V-series Gaia Dragoon — Dragon Breaker with Metal Flat Base.",
    elements: ["earth", "wind"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("dranzer-v2", "Dranzer V2", {
    type: "balanced", color: "#DD1133", mass: 35, radius: 3.4,
    atk: 130, def: 115, sta: 115,
    dm1: 1.4, dm2: 1.3,
    ss1: 1.1, ss2: 1.0,
    desc: "Cross Dranzer — Clutch Change Base with Cross Survivor SP.",
    elements: ["fire"],
    gimmicks: ["mode_change"],
  }),

  bey("burning-kerberous", "Burning Kerberous", {
    type: "stamina", color: "#FF6633", mass: 35, radius: 3.5,
    atk: 65, def: 115, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Triple Attacker — Customize Bearing Base for supreme spin time.",
    elements: ["fire"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("draciel-v2", "Draciel V2", {
    type: "defense", color: "#5533AA", mass: 37, radius: 3.5,
    atk: 55, def: 150, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Strike Turtle — Switch Metal Ball Base for adaptive defense.",
    elements: ["water", "earth"],
    gimmicks: ["heavy_metal_disc", "mode_change"],
  }),

  bey("uriel-2", "Uriel 2", {
    type: "attack", color: "#AACCDD", mass: 34, radius: 3.4,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Neo Cross Horn — Grip Change Base with Over Attack SP.",
    elements: ["ice"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("dark-dragoon", "Dark Dragoon", {
    type: "defense", color: "#222266", mass: 34, radius: 3.4,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Shadow Dragoon — Dark Wing with Customize Sharp Base.",
    elements: ["shadow", "wind"],
    gimmicks: [],
  }),

  bey("dark-driger", "Dark Driger", {
    type: "defense", color: "#224422", mass: 34, radius: 3.3,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Shadow Driger — Dark Wing with sharp base stability.",
    elements: ["shadow", "earth"],
    gimmicks: [],
  }),

  bey("dark-draciel", "Dark Draciel", {
    type: "defense", color: "#332255", mass: 35, radius: 3.4,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Shadow Draciel — Dark Wing with sharp defensive base.",
    elements: ["shadow", "water"],
    gimmicks: [],
  }),

  bey("dark-dranzer", "Dark Dranzer", {
    type: "defense", color: "#442222", mass: 34, radius: 3.4,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Shadow Dranzer — Dark Wing with sharp defensive base.",
    elements: ["shadow", "fire"],
    gimmicks: [],
  }),

  bey("dark-gaia-dragoon", "Dark Gaia Dragoon", {
    type: "defense", color: "#222244", mass: 34, radius: 3.4,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Shadow Gaia Dragoon — Dark Wing with sharp defensive base.",
    elements: ["shadow", "void"],
    gimmicks: [],
  }),

  bey("orthrus", "Orthrus", {
    type: "attack", color: "#AA3355", mass: 35, radius: 3.4,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Double Attacker — Twin Guard SP with Bolt Base for aggressive strikes.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 1 — PLASTICS: G SERIES (ENGINE GEAR) — 10 beyblades
  // ═══════════════════════════════════════════════════════════════════════════

  bey("dragoon-g", "Dragoon G", {
    type: "attack", color: "#0033CC", mass: 36, radius: 3.5, spin: "left",
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Galaxy Dragon — Left Engine Gear with First Clutch Base for explosive late-battle attack.",
    elements: ["wind", "lightning"],
    gimmicks: ["energy_core", "speed_boost_tip"],
  }),

  bey("driger-g", "Driger G", {
    type: "attack", color: "#119933", mass: 35, radius: 3.4,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Gatling Tiger — Engine Gear with First Clutch Base for timed attack bursts.",
    elements: ["earth", "nature"],
    gimmicks: ["energy_core"],
  }),

  bey("metal-driger", "Metal Driger", {
    type: "attack", color: "#228844", mass: 36, radius: 3.4,
    atk: 135, def: 80, sta: 145,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Metal Tiger — heavy cross spiker with Engine Gear powered First Clutch.",
    elements: ["earth", "metal"],
    gimmicks: ["energy_core"],
  }),

  bey("rock-bison", "Rock Bison", {
    type: "defense", color: "#886633", mass: 38, radius: 3.6,
    atk: 70, def: 150, sta: 140,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Double Horn — Circle Defenser Engine Gear with Normal Base.",
    elements: ["earth"],
    gimmicks: ["energy_core", "recoil_guard"],
  }),

  bey("dranzer-g", "Dranzer G", {
    type: "stamina", color: "#DD2233", mass: 35, radius: 3.4,
    atk: 70, def: 115, sta: 175,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.3,
    desc: "Gigus Dranzer — Wing Survivor with Final Clutch Base for endurance bursts.",
    elements: ["fire"],
    gimmicks: ["energy_core"],
  }),

  bey("wolborg-4", "Wolborg 4", {
    type: "stamina", color: "#BBCCEE", mass: 35, radius: 3.4,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Star Wolf — Circle Survivor Engine Gear with Normal Base for supreme spin.",
    elements: ["ice"],
    gimmicks: ["energy_core", "free_spin_tip"],
  }),

  bey("draciel-g", "Draciel G", {
    type: "defense", color: "#5522AA", mass: 38, radius: 3.6,
    atk: 55, def: 150, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Gravity Draciel — Metal Ball Engine Gear with Final Clutch Base.",
    elements: ["water", "earth"],
    gimmicks: ["energy_core", "heavy_metal_disc"],
  }),

  bey("gaia-dragoon-g", "Gaia Dragoon G", {
    type: "attack", color: "#3355DD", mass: 37, radius: 3.5,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Great Gaia Dragoon — Metal Flat Engine Gear with Final Clutch Base.",
    elements: ["earth", "wind"],
    gimmicks: ["energy_core", "speed_boost_tip"],
  }),

  bey("flame-pegasus", "Flame Pegasus", {
    type: "balanced", color: "#FF4466", mass: 34, radius: 3.3,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Gyro Engine Gear Pegasus — CEW Metal Sharp with Engine Stopper Base.",
    elements: ["fire", "wind"],
    gimmicks: ["energy_core"],
  }),

  bey("desert-sphinxer", "Desert Sphinxer", {
    type: "balanced", color: "#CCAA44", mass: 35, radius: 3.4,
    atk: 120, def: 125, sta: 115,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Ark Pyramid — Mystery Cutter Engine Gear with Final Clutch Base.",
    elements: ["earth", "shadow"],
    gimmicks: ["energy_core"],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 1 — PLASTICS: GT SERIES (ENGINE GEAR TURBO) — 4 beyblades
  // ═══════════════════════════════════════════════════════════════════════════

  bey("dragoon-gt", "Dragoon GT", {
    type: "attack", color: "#0022BB", mass: 37, radius: 3.5, spin: "left",
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "G-Turbo Dragon — Left EG Turbo with First Clutch Base and Metal Grip CEW.",
    elements: ["wind", "lightning"],
    gimmicks: ["energy_core", "speed_boost_tip"],
  }),

  bey("dranzer-gt", "Dranzer GT", {
    type: "balanced", color: "#DD1122", mass: 36, radius: 3.4,
    atk: 125, def: 120, sta: 115,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "G-Turbo Dranzer — Right EG Reverse with Final Clutch Base and Metal Semi-Flat CEW.",
    elements: ["fire"],
    gimmicks: ["energy_core", "mode_change"],
  }),

  bey("gigars", "Gigars", {
    type: "balanced", color: "#FF6644", mass: 36, radius: 3.4,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Gigantic Claw — Castor Gear FAC with Metal Change CEW.",
    elements: ["earth"],
    gimmicks: ["energy_core", "mode_change"],
  }),

  bey("zeus", "Zeus", {
    type: "stamina", color: "#FFDDAA", mass: 37, radius: 3.5,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Holy Despell — Castor Gear Free Shaft with Light Sharp CEW for supreme endurance.",
    elements: ["light"],
    gimmicks: ["energy_core", "free_spin_tip"],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 1 — HMS (HEAVY METAL SYSTEM) — 27 beyblades
  // ═══════════════════════════════════════════════════════════════════════════

  bey("gaia-dragoon-ms", "Gaia Dragoon MS", {
    type: "attack", color: "#3355CC", mass: 42, radius: 3.2,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Metal Saucer — heavy metal flat core for aggressive HMS attack.",
    elements: ["earth", "wind"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("driger-ms", "Driger MS", {
    type: "balanced", color: "#229944", mass: 40, radius: 3.1,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Metal Upper — semi-flat core for versatile HMS balanced play.",
    elements: ["earth", "nature"],
    gimmicks: [],
  }),

  bey("draciel-ms", "Draciel MS", {
    type: "defense", color: "#6633AA", mass: 44, radius: 3.2,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Metal Shield — sharp core defense for heavy HMS wall play.",
    elements: ["water", "earth"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("dragoon-ms", "Dragoon MS", {
    type: "attack", color: "#1144DD", mass: 41, radius: 3.1,
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Metal Attacker — Grip Flat Core for the most aggressive HMS attack.",
    elements: ["wind", "lightning"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("dranzer-ms", "Dranzer MS", {
    type: "balanced", color: "#DD2244", mass: 40, radius: 3.1,
    atk: 125, def: 115, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Spiral Upper — Manual Change Core switches modes mid-battle.",
    elements: ["fire"],
    gimmicks: ["mode_change"],
  }),

  bey("einstein-ms", "Einstein MS", {
    type: "balanced", color: "#AABB88", mass: 42, radius: 3.2,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Metal Spring — Spring Core for bounce-based evasion.",
    elements: ["lightning"],
    gimmicks: ["spring_launch"],
  }),

  bey("dragoon-ms-uv", "Dragoon MS UV", {
    type: "attack", color: "#2255EE", mass: 42, radius: 3.1,
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Ultimate Dragoon MS — upgraded Grip Flat Core UV for peak HMS attack.",
    elements: ["wind", "lightning"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("death-gargoyle-ms", "Death Gargoyle MS", {
    type: "balanced", color: "#333344", mass: 42, radius: 3.2,
    atk: 125, def: 115, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Circle Upper — Metal Change Core for mode-switching heavy metal play.",
    elements: ["shadow", "void"],
    gimmicks: ["mode_change"],
  }),

  bey("wolborg-ms", "Wolborg MS", {
    type: "stamina", color: "#AADDEE", mass: 41, radius: 3.1,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Wolf Crusher — Bearing Core for supreme HMS endurance.",
    elements: ["ice"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("thunder-dragon", "Thunder Dragon", {
    type: "attack", color: "#FFCC22", mass: 43, radius: 3.2,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Spark Dragon — Metal Weight Flat Core for heavy attack with free survivor CWD.",
    elements: ["lightning"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("sea-dragon", "Sea Dragon", {
    type: "defense", color: "#2266AA", mass: 45, radius: 3.3,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Metal Ball Attacker — Metal Ball Core with Defense Ring CWD.",
    elements: ["water"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("wyvern-dj", "Wyvern DJ", {
    type: "defense", color: "#7788AA", mass: 40, radius: 3.1,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "DJ Spiker — Metal Sharp Core for defensive HMS play.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("advance-averazer", "Advance Averazer", {
    type: "balanced", color: "#888888", mass: 40, radius: 3.1,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Advance Balancer — Metal Semi-Flat Core for all-round HMS balance.",
    elements: ["metal"],
    gimmicks: [],
  }),

  bey("advance-guardian", "Advance Guardian", {
    type: "defense", color: "#666688", mass: 42, radius: 3.2,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Advance Defenser — Grip Sharp Core for HMS defensive anchoring.",
    elements: ["metal", "earth"],
    gimmicks: [],
  }),

  bey("advance-striker", "Advance Striker", {
    type: "attack", color: "#AA4444", mass: 42, radius: 3.2,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Advance Attacker — Metal Flat Core for aggressive HMS strikes.",
    elements: ["fire"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("advance-eterner", "Advance Eterner", {
    type: "stamina", color: "#668888", mass: 40, radius: 3.1,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Advance Survivor — Metal Sharp Core for maximum HMS endurance.",
    elements: ["metal"],
    gimmicks: [],
  }),

  bey("phantom-fox-ms", "Phantom Fox MS", {
    type: "attack", color: "#FF9933", mass: 40, radius: 3.1,
    atk: 140, def: 65, sta: 155,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Upper Fox — Bunshin Core creates illusion-based attack patterns.",
    elements: ["shadow", "nature"],
    gimmicks: [],
  }),

  bey("slash-riger-ms", "Slash Riger MS", {
    type: "attack", color: "#33BB55", mass: 41, radius: 3.1,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Slash Upper — Free Wing Core with CWD Free Crusher for aerial attack.",
    elements: ["nature"],
    gimmicks: [],
  }),

  bey("dark-leopard-ms", "Dark Leopard MS", {
    type: "balanced", color: "#222233", mass: 40, radius: 3.0,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Smash Leopard — Tornado Change Core switches between modes.",
    elements: ["shadow"],
    gimmicks: ["mode_change"],
  }),

  bey("magical-ape-ms", "Magical Ape MS", {
    type: "attack", color: "#CCAA33", mass: 42, radius: 3.2,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Metal Ape — Flat Core for heavy metal aggressive attack.",
    elements: ["earth"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("round-shell-ms", "Round Shell MS", {
    type: "defense", color: "#448866", mass: 44, radius: 3.2,
    atk: 55, def: 150, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Turtle Crusher — Rubber Weight Core for exceptional impact absorption.",
    elements: ["water", "earth"],
    gimmicks: ["recoil_guard"],
  }),

  bey("dragoon-mf", "Dragoon MF", {
    type: "attack", color: "#1155EE", mass: 43, radius: 3.2,
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Upper Dragon — Metal Weight Grip Core with CWD Chain Attacker.",
    elements: ["wind"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("dranzer-mf", "Dranzer MF", {
    type: "stamina", color: "#DD2255", mass: 41, radius: 3.1,
    atk: 65, def: 120, sta: 175,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Smash Phoenix — Free Shaft Core with CWD Wing Attacker for endurance.",
    elements: ["fire"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("samurai-changer-ms", "Samurai Changer MS", {
    type: "balanced", color: "#AA3344", mass: 42, radius: 3.2,
    atk: 125, def: 120, sta: 115,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Samurai Upper — Battle Change Core switches between attack and defense.",
    elements: ["fire", "metal"],
    gimmicks: ["mode_change"],
  }),

  bey("aero-knight-ms", "Aero Knight MS", {
    type: "stamina", color: "#5577BB", mass: 40, radius: 3.1,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Knight Crusher — Aero Core with Aero Ring SP for wind-assisted endurance.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("jiraiya-ms", "Jiraiya MS", {
    type: "stamina", color: "#44AA66", mass: 41, radius: 3.1,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Jiraiya Blade — Bearing Core 2 with CWD Free Cross for maximum spin time.",
    elements: ["nature"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("bloody-devil-ms", "Bloody Devil MS", {
    type: "attack", color: "#880022", mass: 43, radius: 3.2,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Devil Crusher — Shooter Change Core for variable attack patterns.",
    elements: ["shadow", "void"],
    gimmicks: ["mode_change"],
  }),

  bey("shining-god-ms", "Shining God MS", {
    type: "attack", color: "#FFDD44", mass: 44, radius: 3.3,
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "God Smasher — Shooter Change Core with God Ring CWD for ultimate HMS power.",
    elements: ["light"],
    gimmicks: ["mode_change"],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 2 — METAL SYSTEM (MFS, 4-LAYER) — 15 beyblades
  // ═══════════════════════════════════════════════════════════════════════════

  bey("pegasis-105f", "Pegasis 105F", {
    type: "attack", color: "#00AAFF", mass: 28, radius: 3.6,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Original Pegasus — flat bottom for aggressive MFS attack movement.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("bull-125sf", "Bull 125SF", {
    type: "balanced", color: "#FF5500", mass: 30, radius: 3.7,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Bull — semi-flat bottom for versatile MFS balanced play.",
    elements: ["fire", "earth"],
    gimmicks: [],
  }),

  bey("sagittario-145s", "Sagittario 145S", {
    type: "defense", color: "#FFAA00", mass: 29, radius: 3.7,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Sagittario — sharp bottom with high track for defensive MFS stability.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("leone-145d", "Leone 145D", {
    type: "defense", color: "#44CC44", mass: 30, radius: 3.8,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Leone — defense bottom for ultimate MFS defensive stability.",
    elements: ["earth", "wind"],
    gimmicks: [],
  }),

  bey("wolf-d125b", "Wolf D125B", {
    type: "defense", color: "#666688", mass: 28, radius: 3.6,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Wolf — ball bottom with wide defensive track.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("aries-125d", "Aries 125D", {
    type: "defense", color: "#DDBB44", mass: 28, radius: 3.6,
    atk: 60, def: 145, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Aries — defense bottom for solid MFS defensive stance.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("quetzalcoatl-90wf", "Quetzalcoatl 90WF", {
    type: "attack", color: "#44DDAA", mass: 27, radius: 3.5,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Quetzalcoatl — wide flat bottom for aggressive low-track MFS attack.",
    elements: ["wind", "nature"],
    gimmicks: [],
  }),

  bey("libra-df145bs", "Libra DF145BS", {
    type: "stamina", color: "#88CC44", mass: 30, radius: 3.7,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Libra — ball sharp bottom for exceptional MFS stamina and balance.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("aquario-105f", "Aquario 105F", {
    type: "attack", color: "#44AAFF", mass: 27, radius: 3.5,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Aquario — flat bottom for fast MFS attack movement.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("virgo-df145bs", "Virgo DF145BS", {
    type: "stamina", color: "#CCAAFF", mass: 29, radius: 3.7,
    atk: 55, def: 125, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Virgo — ball sharp stamina with down force track.",
    elements: ["light"],
    gimmicks: [],
  }),

  bey("pisces-d125bs", "Pisces D125BS", {
    type: "stamina", color: "#6688FF", mass: 28, radius: 3.6,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Pisces — ball sharp with defense track for endurance.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("l-drago-105f", "L Drago 105F", {
    type: "attack", color: "#DD2222", mass: 29, radius: 3.6, spin: "left",
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.2, ss2: 1.0,
    desc: "Original L-Drago — left-spin flat bottom for aggressive counter-rotation.",
    elements: ["shadow", "fire"],
    gimmicks: [],
  }),

  bey("escolpio-wd145b", "Escolpio WD145B", {
    type: "defense", color: "#AA3366", mass: 29, radius: 3.6,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Escolpio — ball bottom with wide defense track.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("gemios-df145fs", "Gemios DF145FS", {
    type: "balanced", color: "#FFAA44", mass: 28, radius: 3.6,
    atk: 120, def: 115, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Gemios — flat sharp for mixed attack/stamina play.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("capricorne-100hf", "Capricorne 100HF", {
    type: "attack", color: "#5566AA", mass: 28, radius: 3.5,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Capricorne — hole flat for controlled aggressive MFS attack.",
    elements: ["earth"],
    gimmicks: [],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 2 — HYBRID WHEEL SYSTEM (HWS, 5-LAYER) — 51 beyblades
  // ═══════════════════════════════════════════════════════════════════════════

  bey("storm-pegasis-105rf", "Storm Pegasis 105RF", {
    type: "attack", color: "#00CFFF", mass: 42, radius: 4.0,
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Storm Pegasus — Rubber Flat for ultimate HWS attack speed and aggression.",
    elements: ["wind", "lightning"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("dark-wolf-df145fs", "Dark Wolf DF145FS", {
    type: "balanced", color: "#555566", mass: 40, radius: 3.9,
    atk: 120, def: 115, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Dark Wolf — flat sharp for mixed offense and stamina play.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("rock-leone-145wb", "Rock Leone 145WB", {
    type: "defense", color: "#FFD700", mass: 45, radius: 4.2,
    atk: 60, def: 150, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Rock Leone — Wide Ball bottom for defensive stability and control.",
    elements: ["earth"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("mad-cancer-ch120fs", "Mad Cancer CH120FS", {
    type: "balanced", color: "#CC4466", mass: 39, radius: 3.9,
    atk: 115, def: 120, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Mad Cancer — flat sharp with crown height track for balanced play.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("flame-sagittario-c145s", "Flame Sagittario C145S", {
    type: "stamina", color: "#FF6D00", mass: 41, radius: 4.0,
    atk: 75, def: 115, sta: 170,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.4, ss2: 1.2,
    desc: "Flame Sagittario — sharp bottom with claw track for stamina endurance.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("wind-aquario-100hf", "Wind Aquario 100HF/S", {
    type: "attack", color: "#44CCFF", mass: 38, radius: 3.9,
    atk: 135, def: 75, sta: 150,
    dm1: 1.6, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Wind Aquario — hole flat for controlled attack or sharp for defense mode.",
    elements: ["wind", "water"],
    gimmicks: [],
  }),

  bey("dark-bull-h145sd", "Dark Bull H145SD", {
    type: "defense", color: "#884422", mass: 42, radius: 4.0,
    atk: 65, def: 145, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Dark Bull — Semi Defense with horn track for solid defensive stance.",
    elements: ["earth", "shadow"],
    gimmicks: [],
  }),

  bey("lightning-l-drago-100hf", "Lightning L Drago 100HF", {
    type: "attack", color: "#FF1744", mass: 42, radius: 3.9, spin: "left",
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.3, ss2: 1.1,
    desc: "Lightning L-Drago — left-spin rubber mode change for aggressive spin stealing.",
    elements: ["lightning", "shadow"],
    gimmicks: ["spin_absorber", "mode_change"],
  }),

  bey("clay-aries-ed145b", "Clay Aries ED145B", {
    type: "defense", color: "#CCAA88", mass: 38, radius: 3.9,
    atk: 60, def: 145, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Clay Aries — ball bottom with eternal defense track for stability.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("earth-aquila-145wd", "Earth Aquila 145WD", {
    type: "stamina", color: "#00E676", mass: 44, radius: 4.1,
    atk: 75, def: 135, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.3,
    desc: "Earth Eagle — Wide Defense for superior stamina and balance.",
    elements: ["earth", "wind"],
    gimmicks: [],
  }),

  bey("flame-libra-t125es", "Flame Libra T125ES", {
    type: "stamina", color: "#88CC00", mass: 41, radius: 4.0,
    atk: 55, def: 125, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Flame Libra — Eternal Sharp for legendary HWS stamina performance.",
    elements: ["fire", "earth"],
    gimmicks: [],
  }),

  bey("storm-capricorne-m145q", "Storm Capricorne M145Q", {
    type: "balanced", color: "#5566BB", mass: 42, radius: 4.0,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Storm Capricorne — Quake bottom for vibration-based balanced play.",
    elements: ["earth", "wind"],
    gimmicks: [],
  }),

  bey("rock-orso-d125b", "Rock Orso D125B", {
    type: "defense", color: "#886644", mass: 42, radius: 4.0,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Rock Bear — ball bottom with defense track for solid stability.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("counter-leone-d125b", "Counter Leone D125B", {
    type: "defense", color: "#DDBB22", mass: 43, radius: 4.0,
    atk: 70, def: 145, sta: 145,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Counter Leone — counter-attack focused defense with ball bottom.",
    elements: ["earth"],
    gimmicks: ["recoil_guard"],
  }),

  bey("dark-cancer-ch120sf", "Dark Cancer CH120SF", {
    type: "balanced", color: "#663355", mass: 39, radius: 3.9,
    atk: 115, def: 120, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Dark Cancer — semi-flat with crown track for defensive balance.",
    elements: ["shadow", "water"],
    gimmicks: [],
  }),

  bey("killer-gemios-df145fs", "Killer Gemios DF145FS", {
    type: "balanced", color: "#774433", mass: 40, radius: 3.9,
    atk: 120, def: 115, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Killer Gemios — flat sharp with down force for mixed versatility.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("thermal-pisces-t125es", "Thermal Pisces T125ES", {
    type: "stamina", color: "#2979FF", mass: 41, radius: 4.0,
    atk: 55, def: 125, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Thermal Pisces — Eternal Sharp for exceptional aquatic endurance.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("cyber-pegasis-100hf", "Cyber Pegasis 100HF", {
    type: "attack", color: "#5599DD", mass: 40, radius: 3.9,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Cyber Pegasis — Hole Flat for precise aggressive movement.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("burn-phoenix-135ms", "Burn Phoenix 135MS", {
    type: "defense", color: "#FF6622", mass: 42, radius: 4.0,
    atk: 70, def: 140, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Burn Phoenix — Metal Sharp for defensive flame bird stability.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("earth-virgo-gb145bs", "Earth Virgo GB145BS", {
    type: "stamina", color: "#DDAAFF", mass: 43, radius: 4.1,
    atk: 60, def: 125, sta: 175,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Earth Virgo — Ball Sharp with gravity ball track for endurance.",
    elements: ["earth", "light"],
    gimmicks: [],
  }),

  bey("rock-escolpio-t125jb", "Rock Escolpio T125JB", {
    type: "balanced", color: "#884455", mass: 42, radius: 4.0,
    atk: 115, def: 120, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Rock Escolpio — Jog Ball for mixed defense and mobility.",
    elements: ["earth", "shadow"],
    gimmicks: [],
  }),

  bey("poison-serpent-sw145sd", "Poison Serpent SW145SD", {
    type: "defense", color: "#55AA44", mass: 42, radius: 4.0,
    atk: 65, def: 145, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Poison Serpent — Semi Defense with switch track for defensive poison play.",
    elements: ["nature"],
    gimmicks: [],
  }),

  bey("galaxy-pegasis-w105r2f", "Galaxy Pegasis W105R²F", {
    type: "attack", color: "#AA00FF", mass: 43, radius: 4.0,
    atk: 150, def: 55, sta: 155,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Galaxy Pegasus — R²F for maximum HWS attack speed and smash power.",
    elements: ["wind"],
    gimmicks: ["speed_boost_tip", "energy_core"],
  }),

  bey("ray-unicorno-d125cs", "Ray Unicorno D125CS", {
    type: "stamina", color: "#4488DD", mass: 41, radius: 4.0,
    atk: 70, def: 120, sta: 170,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.3,
    desc: "Ray Unicorno — Coat Sharp for steady stamina performance.",
    elements: ["lightning"],
    gimmicks: [],
  }),

  bey("thermal-lacerta-wa130hf", "Thermal Lacerta WA130HF", {
    type: "attack", color: "#FF5544", mass: 40, radius: 3.9,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Thermal Lacerta — Hole Flat with wing attack track for controlled aggression.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("mercury-anubius-85xf", "Mercury Anubius 85XF", {
    type: "attack", color: "#CCAA22", mass: 40, radius: 3.8,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Mercury Anubis — Extreme Flat for wild, ultra-aggressive low-track attack.",
    elements: ["earth", "metal"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("infinity-libra-gb145s", "Infinity Libra GB145S", {
    type: "defense", color: "#77BB33", mass: 42, radius: 4.0,
    atk: 60, def: 145, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Infinity Libra — sharp bottom with gravity ball for defensive balance.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("rock-giraffe-r145wb", "Rock Giraffe R145WB", {
    type: "defense", color: "#BBAA44", mass: 42, radius: 4.0,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Rock Giraffe — Wide Ball with rubber track for stable defense.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("gravity-perseus-ad145wd", "Gravity Perseus AD145WD", {
    type: "defense", color: "#7744BB", mass: 45, radius: 4.1, spin: "left",
    atk: 80, def: 150, sta: 130,
    dm1: 1.2, dm2: 1.1, dm3: 1.0, ss1: 1.0, ss2: 0.9,
    desc: "Gravity Perseus — left-spin mode-change defense with Wide Defense.",
    elements: ["shadow", "metal"],
    gimmicks: ["mode_change"],
  }),

  bey("bakushin-susanow-90wf", "Bakushin Susanow 90WF", {
    type: "attack", color: "#CC3344", mass: 40, radius: 3.8,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Bakushin Susanow — Wide Flat for fast aggressive low-track attack.",
    elements: ["fire", "wind"],
    gimmicks: [],
  }),

  bey("sol-blaze-v145as", "Sol Blaze V145AS", {
    type: "balanced", color: "#FF8800", mass: 43, radius: 4.0,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Sol Blaze — Around Sharp with variable track for balanced solar power.",
    elements: ["fire", "light"],
    gimmicks: [],
  }),

  bey("vulcan-horuseus-145d", "Vulcan Horuseus 145D", {
    type: "defense", color: "#CCAA44", mass: 42, radius: 4.0,
    atk: 70, def: 145, sta: 145,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Vulcan Horus — Defense bottom for solid Egyptian-themed stability.",
    elements: ["earth", "light"],
    gimmicks: [],
  }),

  bey("grand-ketos-t125rs", "Grand Ketos T125RS", {
    type: "defense", color: "#3366AA", mass: 43, radius: 4.1,
    atk: 65, def: 145, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Grand Ketos — Rubber Sharp for defensive whale power with grip.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("poison-giraffe-s130mb", "Poison Giraffe S130MB", {
    type: "defense", color: "#77AA33", mass: 42, radius: 4.0,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Poison Giraffe — Metal Ball for heavy defensive anchoring.",
    elements: ["nature"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("meteo-l-drago-lw105lf", "Meteo L Drago LW105LF", {
    type: "attack", color: "#DD3344", mass: 42, radius: 3.9, spin: "left",
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.4, ss2: 1.2,
    desc: "Meteo L-Drago — Left Flat with rubber pads for left-spin attack and spin stealing.",
    elements: ["shadow", "fire"],
    gimmicks: ["spin_absorber"],
  }),

  bey("ray-gill-100rsf", "Ray Gill 100RSF", {
    type: "balanced", color: "#5577AA", mass: 40, radius: 3.9,
    atk: 120, def: 115, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Ray Gill — Rubber Semi Flat for mixed grip attack and stamina.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("tornado-herculeo-105f", "Tornado Herculeo 105F", {
    type: "attack", color: "#FF4422", mass: 41, radius: 3.9,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Tornado Herculeo — Flat bottom for strong attack movement.",
    elements: ["wind", "earth"],
    gimmicks: [],
  }),

  bey("flame-byxis-230wd", "Flame Byxis 230WD", {
    type: "stamina", color: "#FF9944", mass: 44, radius: 4.1,
    atk: 55, def: 130, sta: 175,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Flame Byxis — Wide Defense with tall 230 track for extreme stamina.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("divine-chimera-tr145fb", "Divine Chimera TR145FB", {
    type: "balanced", color: "#AA4488", mass: 42, radius: 4.0,
    atk: 120, def: 115, sta: 125,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Divine Chimera — Flat Ball for mobile balanced chimera play.",
    elements: ["light", "shadow"],
    gimmicks: [],
  }),

  bey("nightmare-rex-sw145sd", "Nightmare Rex SW145SD", {
    type: "defense", color: "#553322", mass: 44, radius: 4.1,
    atk: 70, def: 145, sta: 145,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Nightmare Rex — Semi Defense for heavyweight defensive dinosaur power.",
    elements: ["shadow", "earth"],
    gimmicks: [],
  }),

  bey("killer-beafowl-uw145ewd", "Killer Beafowl UW145EWD", {
    type: "stamina", color: "#66BBAA", mass: 42, radius: 4.0,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Killer Beafowl — EWD for supreme stamina with upper wing track.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("hell-kerbecs-bd145ds", "Hell Kerbecs BD145DS", {
    type: "stamina", color: "#FF5500", mass: 46, radius: 4.2,
    atk: 70, def: 120, sta: 170,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.3,
    desc: "Hell Kerbecs — Defense Sharp with boost disc track for stamina endurance.",
    elements: ["fire", "shadow"],
    gimmicks: [],
  }),

  bey("screw-capricorne-90mf", "Screw Capricorne 90MF", {
    type: "attack", color: "#FF4081", mass: 42, radius: 3.9,
    atk: 145, def: 75, sta: 140,
    dm1: 1.8, dm2: 1.4, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Screw Capricorne — Metal Flat for heavy low-track attack.",
    elements: ["wind", "earth"],
    gimmicks: [],
  }),

  bey("basalt-horogium-145wd", "Basalt Horogium 145WD", {
    type: "defense", color: "#B2EBF2", mass: 55, radius: 4.3, spin: "left",
    atk: 90, def: 150, sta: 120,
    dm1: 1.2, dm2: 1.1, dm3: 1.0, ss1: 1.0, ss2: 0.9,
    desc: "Basalt Horogium — heaviest HWS beyblade with Wide Defense and supreme mass.",
    elements: ["earth", "metal"],
    gimmicks: ["heavy_metal_disc"],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 2 — 4D SYSTEM — 19 beyblades (+ 2 variants counted separately)
  // ═══════════════════════════════════════════════════════════════════════════

  bey("big-bang-pegasis-fd", "Big Bang Pegasis F:D", {
    type: "balanced", color: "#F50057", mass: 48, radius: 4.2,
    atk: 135, def: 115, sta: 110,
    dm1: 1.4, dm2: 1.3,
    ss1: 1.1, ss2: 1.0,
    desc: "Big Bang Pegasus — Final Drive auto-changes from sharp to rubber flat.",
    elements: ["fire", "wind"],
    gimmicks: ["energy_core", "mode_change"],
  }),

  bey("fang-leone-130w2d", "Fang Leone 130W²D", {
    type: "defense", color: "#FFAB40", mass: 50, radius: 4.3,
    atk: 75, def: 145, sta: 140,
    dm1: 1.2, dm2: 1.1, dm3: 1.0, ss1: 1.0, ss2: 0.9,
    desc: "Fang Leone — Wave Wide Defense for heavy 4D defensive lion power.",
    elements: ["earth"],
    gimmicks: ["heavy_metal_disc", "recoil_guard"],
  }),

  bey("beat-lynx-th170wd", "Beat Lynx TH170WD", {
    type: "stamina", color: "#AA88CC", mass: 44, radius: 4.1,
    atk: 60, def: 125, sta: 175,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Beat Lynx — Wide Defense with tall track for extreme 4D stamina.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("l-drago-destroy-fs", "L Drago Destroy F:S", {
    type: "attack", color: "#CC1122", mass: 45, radius: 4.0, spin: "left",
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.4, ss2: 1.2,
    desc: "L-Drago Destroy — Final Survive auto-changes for aggressive left-spin attack.",
    elements: ["shadow", "fire"],
    gimmicks: ["spin_absorber", "mode_change"],
  }),

  bey("scythe-kronos-t125eds", "Scythe Kronos T125EDS", {
    type: "stamina", color: "#888899", mass: 44, radius: 4.1,
    atk: 60, def: 125, sta: 175,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Scythe Kronos — EDS for sustained stamina with scythe attack ring.",
    elements: ["metal"],
    gimmicks: [],
  }),

  bey("variares-dd", "VariAres D:D", {
    type: "balanced", color: "#DD3344", mass: 47, radius: 4.1,
    atk: 130, def: 115, sta: 115,
    dm1: 1.4, dm2: 1.3,
    ss1: 1.1, ss2: 1.0,
    desc: "VariAres — Delta Drive mode-changes between attack and stamina.",
    elements: ["fire", "metal"],
    gimmicks: ["mode_change", "dual_tip"],
  }),

  bey("jade-jupiter-s130rb", "Jade Jupiter S130RB", {
    type: "defense", color: "#76FF03", mass: 48, radius: 4.2,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Jade Jupiter — Rubber Ball for 4D planetary defense and stability.",
    elements: ["nature", "water"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("forbidden-eonis-130d", "Forbidden Eonis 130D", {
    type: "defense", color: "#7766AA", mass: 43, radius: 4.0,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Forbidden Eonis — Defense bottom for solid 4D defensive play.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("divine-crown-tr145d", "Divine Crown TR145D", {
    type: "defense", color: "#DDAA55", mass: 43, radius: 4.0,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Divine Crown — Defense bottom with triple rotate track for stability.",
    elements: ["light"],
    gimmicks: [],
  }),

  bey("screw-lyra-ed145mf", "Screw Lyra ED145MF", {
    type: "attack", color: "#AABB55", mass: 42, radius: 4.0,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Screw Lyra — Metal Flat for aggressive 4D attack play.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("blitz-unicorno-100rsf", "Blitz Unicorno 100RSF", {
    type: "balanced", color: "#4488EE", mass: 44, radius: 4.0,
    atk: 125, def: 115, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Blitz Unicorno — Rubber Semi Flat for balanced 4D grip and speed.",
    elements: ["lightning"],
    gimmicks: [],
  }),

  bey("phantom-orion-bd", "Phantom Orion B:D", {
    type: "stamina", color: "#BBAA88", mass: 46, radius: 4.2,
    atk: 55, def: 125, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.7, ss2: 1.5,
    desc: "Phantom Orion — Bearing Drive for the ultimate 4D stamina king.",
    elements: ["light"],
    gimmicks: ["free_spin_tip"],
  }),

  bey("death-quetzalcoatl-125rdf", "Death Quetzalcoatl 125RDF", {
    type: "stamina", color: "#E040FB", mass: 45, radius: 4.1,
    atk: 70, def: 115, sta: 175,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Death Quetzalcoatl — Rubber Defense Flat for stamina with defensive grip.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("duo-uranus-230wd", "Duo Uranus 230WD", {
    type: "stamina", color: "#AACCEE", mass: 48, radius: 4.2,
    atk: 55, def: 130, sta: 175,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Duo Uranus — Wide Defense with tall 230 track for supreme 4D endurance.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("l-drago-guardian-s130mb", "L Drago Guardian S130MB", {
    type: "defense", color: "#BB2233", mass: 47, radius: 4.1, spin: "left",
    atk: 70, def: 150, sta: 140,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.0, ss2: 0.9,
    desc: "L-Drago Guardian — Metal Ball for left-spin defensive guardian mode.",
    elements: ["shadow"],
    gimmicks: ["heavy_metal_disc", "spin_absorber"],
  }),

  bey("wing-pegasis-90wf", "Wing Pegasis 90WF", {
    type: "attack", color: "#40C4FF", mass: 42, radius: 3.9,
    atk: 145, def: 55, sta: 160,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Wing Pegasis — Wide Flat for fast 4D low-track attack movement.",
    elements: ["wind", "lightning"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("diablo-nemesis-xd", "Diablo Nemesis X:D", {
    type: "balanced", color: "#FF5722", mass: 55, radius: 4.5,
    atk: 130, def: 130, sta: 100,
    dm1: 1.4, dm2: 1.3,
    ss1: 1.2, ss2: 1.1,
    desc: "Diablo Nemesis — X Drive auto-changes between 4 modes for ultimate versatility.",
    elements: ["void"],
    gimmicks: ["mode_change", "dual_tip"],
  }),

  bey("fusion-hades-ad145swd", "Fusion Hades AD145SWD", {
    type: "stamina", color: "#553366", mass: 46, radius: 4.2,
    atk: 65, def: 125, sta: 170,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.3,
    desc: "Fusion Hades — Sharp Wide Defense for stamina with armor defense track.",
    elements: ["shadow", "void"],
    gimmicks: [],
  }),

  bey("bakushin-beelzeb-t125xf", "Bakushin Beelzeb T125XF", {
    type: "attack", color: "#992233", mass: 43, radius: 4.0,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Bakushin Beelzeb — Extreme Flat for wild ultra-aggressive 4D attack.",
    elements: ["fire", "shadow"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("kreis-cygnus-145wd", "Kreis Cygnus 145WD", {
    type: "stamina", color: "#AABBDD", mass: 44, radius: 4.1,
    atk: 60, def: 125, sta: 175,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Kreis Cygnus — Wide Defense with rotating metal frame for 4D stamina.",
    elements: ["ice", "wind"],
    gimmicks: [],
  }),

  bey("omega-dragonis-85xf", "Omega Dragonis 85XF", {
    type: "attack", color: "#FF6633", mass: 41, radius: 3.9,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Omega Dragonis — Extreme Flat for reckless low-track 4D attack.",
    elements: ["fire"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("flash-sagittario-230wd", "Flash Sagittario 230WD", {
    type: "stamina", color: "#FFBB44", mass: 47, radius: 4.2,
    atk: 60, def: 130, sta: 170,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Flash Sagittario — Wide Defense with tall 230 track for supreme 4D endurance.",
    elements: ["fire"],
    gimmicks: [],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 2 — ZERO-G / SYNCHROME — 17 beyblades (+ 1 synchrome dual)
  // ═══════════════════════════════════════════════════════════════════════════

  bey("samurai-ifraid-w145cf", "Samurai Ifraid W145CF", {
    type: "attack", color: "#FF4444", mass: 44, radius: 4.0,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Samurai Ifraid — Circle Flat for aggressive Zero-G attack with fire crystal.",
    elements: ["fire"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("shinobi-saramanda-sw145sd", "Shinobi Saramanda SW145SD", {
    type: "defense", color: "#553322", mass: 46, radius: 4.1,
    atk: 65, def: 145, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Shinobi Saramanda — Semi Defense for stealthy Zero-G defense.",
    elements: ["earth", "shadow"],
    gimmicks: [],
  }),

  bey("pirates-orojya-145d", "Pirates Orojya 145D", {
    type: "defense", color: "#334488", mass: 45, radius: 4.1,
    atk: 60, def: 145, sta: 155,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Pirates Orojya — Defense bottom for solid serpent defense.",
    elements: ["water"],
    gimmicks: [],
  }),

  bey("thief-phoenic-e230gcf", "Thief Phoenic E230GCF", {
    type: "stamina", color: "#FF7744", mass: 45, radius: 4.1,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Thief Phoenic — Gear Circle Flat with elevated track for supreme Zero-G stamina.",
    elements: ["fire"],
    gimmicks: [],
  }),

  bey("guardian-revizer-160sb", "Guardian Revizer 160SB", {
    type: "defense", color: "#2255AA", mass: 47, radius: 4.2,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Guardian Revizer — Sharp Ball for heavy Zero-G defensive anchoring.",
    elements: ["water"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("archer-gryph-c145s", "Archer Gryph C145S", {
    type: "defense", color: "#BBAA33", mass: 44, radius: 4.0,
    atk: 65, def: 140, sta: 155,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Archer Gryph — sharp with claw track for defensive griffin stance.",
    elements: ["wind"],
    gimmicks: [],
  }),

  bey("pirates-killerken-a230jsb", "Pirates Killerken A230JSB", {
    type: "stamina", color: "#443366", mass: 46, radius: 4.1,
    atk: 55, def: 130, sta: 175,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Pirates Killerken — Jog Sharp Ball with attack 230 for Zero-G endurance.",
    elements: ["shadow"],
    gimmicks: [],
  }),

  bey("dark-knight-dragooon-lw160bsf", "Dark Knight Dragooon LW160BSF", {
    type: "attack", color: "#222266", mass: 48, radius: 4.2, spin: "left",
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.3, ss2: 1.1,
    desc: "Dark Knight Dragooon — left-spin Blade Semi-Flat for aggressive Zero-G attack.",
    elements: ["shadow", "wind"],
    gimmicks: ["speed_boost_tip", "spin_absorber"],
  }),

  bey("archer-gargole-sa165wsf", "Archer Gargole SA165WSF", {
    type: "balanced", color: "#778899", mass: 44, radius: 4.0,
    atk: 120, def: 120, sta: 120,
    dm1: 1.3, dm2: 1.2,
    ss1: 1.1, ss2: 1.0,
    desc: "Archer Gargole — Wide Semi Flat for balanced Zero-G play.",
    elements: ["wind", "shadow"],
    gimmicks: [],
  }),

  bey("bandid-goreim-df145bs", "Bandid Goreim DF145BS", {
    type: "stamina", color: "#886644", mass: 45, radius: 4.1,
    atk: 60, def: 120, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Bandid Goreim — Ball Sharp with down force for Zero-G stamina.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("berserker-begirados-sr200bwd", "Berserker Begirados SR200BWD", {
    type: "defense", color: "#554433", mass: 50, radius: 4.3,
    atk: 60, def: 150, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Berserker Begirados — Big Wide Defense with tall track for Zero-G fortress.",
    elements: ["earth", "shadow"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("bandid-genbull-f230tb", "Bandid Genbull F230TB", {
    type: "stamina", color: "#775533", mass: 46, radius: 4.1,
    atk: 55, def: 125, sta: 180,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Bandid Genbull — Twin Ball with free spin track for Zero-G endurance.",
    elements: ["earth"],
    gimmicks: [],
  }),

  bey("gryph-girago-wa130hf", "Gryph Girago WA130HF", {
    type: "attack", color: "#DDAA44", mass: 48, radius: 4.1,
    atk: 145, def: 65, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Gryph + Girago synchrome — Hole Flat for dual chrome wheel attack.",
    elements: ["wind", "earth"],
    gimmicks: [],
  }),

  bey("saramanda-balro-df145swd", "Saramanda Balro DF145SWD", {
    type: "stamina", color: "#664433", mass: 49, radius: 4.2,
    atk: 60, def: 130, sta: 170,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.3,
    desc: "Saramanda + Balro synchrome — Sharp Wide Defense for heavy stamina.",
    elements: ["earth", "shadow"],
    gimmicks: [],
  }),

  bey("killerken-balro-a230wb", "Killerken Balro A230WB", {
    type: "defense", color: "#443355", mass: 49, radius: 4.2,
    atk: 65, def: 145, sta: 150,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 0.9, ss2: 0.85,
    desc: "Killerken + Balro synchrome — Wide Ball for dual chrome defensive stability.",
    elements: ["shadow"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("orojya-wyvang-145eds", "Orojya Wyvang 145EDS", {
    type: "stamina", color: "#445577", mass: 48, radius: 4.1,
    atk: 60, def: 125, sta: 175,
    dm1: 1.0, dm2: 1.0, dm3: 1.0, ss1: 1.6, ss2: 1.4,
    desc: "Orojya + Wyvang synchrome — EDS for dual chrome stamina endurance.",
    elements: ["water", "wind"],
    gimmicks: [],
  }),

  bey("samurai-pegasis-w105r2f", "Samurai Pegasis W105R²F", {
    type: "attack", color: "#2288FF", mass: 45, radius: 4.0,
    atk: 150, def: 55, sta: 155,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 0.9,
    desc: "Samurai Pegasus — R²F for ultimate Zero-G attack speed and power.",
    elements: ["wind", "fire"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("gladiator-bahamdia-sp230gf", "Gladiator Bahamdia SP230GF", {
    type: "attack", color: "#882244", mass: 50, radius: 4.3,
    atk: 140, def: 70, sta: 150,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Gladiator Bahamdia — Giga Flat for heavy Zero-G attack with spiral track.",
    elements: ["fire", "shadow"],
    gimmicks: ["speed_boost_tip"],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 3 — BURST SYSTEM (Standard → God → Cho-Z → Gatinko → Sparking → DB → BU)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Xcalibur Lineage ──────────────────────────────────────────────────────

  bey("xeno-xcalibur-dl", "Xeno Xcalibur DL.Magnum.Impact", {
    type: "attack", color: "#CC8800", mass: 34, radius: 4.0,
    atk: 140, def: 60, sta: 160,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Xeno Xcalibur Dual Layer — C₁ asymmetric sword, high burst risk, rubber Impact tip for aggressive attack orbit.",
    elements: ["fire"],
    gimmicks: ["burst_attack"],
  }),

  bey("sieg-xcalibur-god", "Sieg Xcalibur God.1.Iron", {
    type: "attack", color: "#AABBFF", mass: 44, radius: 4.0,
    atk: 145, def: 70, sta: 145,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Sieg Xcalibur God Layer — metal-insert C₁ diamond geometry, 15.9 g layer, Iron metal tip for low spin decay.",
    elements: ["lightning"],
    gimmicks: ["metal_insert"],
  }),

  bey("buster-xcalibur-cz", "Buster Xcalibur CZ.1'.Dagger.Sword", {
    type: "attack", color: "#FF6600", mass: 42, radius: 4.1,
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Buster Xcalibur Cho-Z — centrifugal bistable sword extension, 1' Dash disc reduces CoM instability; Sword tip for hard-surface precision.",
    elements: ["fire"],
    gimmicks: ["mode_change"],
  }),

  bey("xiphoid-bu-xcalibur", "Xiphoid BU Xcalibur.Xanthus.Sword'-1", {
    type: "balanced", color: "#CCAA00", mass: 79, radius: 4.2,
    atk: 130, def: 100, sta: 130,
    dm1: 1.8, dm2: 1.5, dm3: 1.4, ss1: 1.1, ss2: 1.0,
    desc: "Xiphoid BU Xcalibur — 78.8 g Burst Ultimate assembly; BU Lock + Armor 1 provide layered burst resistance; Xanthus disc 32.5 g dominates angular momentum.",
    elements: ["lightning", "fire"],
    gimmicks: ["burst_resistance_high", "mode_change"],
  }),

  // ── Valkyrie Lineage ──────────────────────────────────────────────────────

  bey("winning-valkyrie", "Winning Valkyrie WV.12.V", {
    type: "attack", color: "#0099FF", mass: 34, radius: 4.0,
    atk: 140, def: 50, sta: 170,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.1, ss2: 0.9,
    desc: "Winning Valkyrie Standard Burst — inaugural Burst Energy Layer, C₃ smash at φ=22°, two-tab burst threshold 10.8 mN·m; Velocity tip for stamina.",
    elements: ["wind"],
    gimmicks: ["burst_attack"],
  }),

  bey("victory-valkyrie-god", "Victory Valkyrie God.Boost.Variable", {
    type: "attack", color: "#0066FF", mass: 38, radius: 4.0,
    atk: 145, def: 55, sta: 160,
    dm1: 1.8, dm2: 1.4, dm3: 1.2, ss1: 1.1, ss2: 1.0,
    desc: "Victory Valkyrie God Layer — dual-mode wing geometry with vertical upper-attack force component; Variable tip transitions rubber→plastic as spin decays.",
    elements: ["wind", "fire"],
    gimmicks: ["dual_mode_attack"],
  }),

  bey("god-valkyrie-god", "God Valkyrie SGV.6.Vortex.UltimateReboot", {
    type: "attack", color: "#FF3300", mass: 44, radius: 4.1,
    atk: 148, def: 57, sta: 155,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 1.0,
    desc: "Strike God Valkyrie God Layer — Chip Lock adds 3.96 mN·m burst resistance; Ultimate Reboot centrifugal spring deploys rubber at low spin for attack recovery.",
    elements: ["fire", "wind"],
    gimmicks: ["spring_bound"],
  }),

  bey("cz-winning-valkyrie", "Cho-Z Winning Valkyrie ChZWV.12Core.Volcanic", {
    type: "attack", color: "#FF8800", mass: 38, radius: 4.1,
    atk: 148, def: 55, sta: 157,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.1, ss2: 1.0,
    desc: "Cho-Z Winning Valkyrie — zinc alloy weight ring raises layer inertia; 12-Core disc with C₁₂ ratchet (1146 Hz) minimises burst window; Volcanic rubber tip.",
    elements: ["fire"],
    gimmicks: ["metal_insert"],
  }),

  bey("gt-slash-valkyrie", "Slash Valkyrie Slash.Blitz.Power", {
    type: "attack", color: "#FF2200", mass: 45, radius: 4.1,
    atk: 150, def: 60, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Gatinko Slash Valkyrie — C₃ slashing blade geometry; aluminium Retsu ring at perimeter; Blitz disc for maximum era disc mass; Power rubber tip.",
    elements: ["fire"],
    gimmicks: ["burst_attack"],
  }),

  bey("sk-brave-valkyrie", "Brave Valkyrie Brave.Evolution'.2A", {
    type: "attack", color: "#FF4400", mass: 48, radius: 4.2,
    atk: 150, def: 65, sta: 145,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Sparking Brave Valkyrie — Superking chip mechanism; Evolution' Dash disc with stiffer spring; 2A Xtreme-Line rubber tip for aggressive orbit.",
    elements: ["fire", "wind"],
    gimmicks: ["burst_resistance_high"],
  }),

  bey("db-savior-valkyrie", "Savior Valkyrie Shot-7", {
    type: "attack", color: "#FF6600", mass: 43, radius: 4.2,
    atk: 140, def: 70, sta: 150,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.1, ss2: 1.0,
    desc: "Dynamite Battle Savior Valkyrie — Shot disc-driver unit with pre-compressed spring (k=1800 N/m, jump h=26.4 mm); vertical strike bypasses opponent defensive geometry.",
    elements: ["fire", "lightning"],
    gimmicks: ["spring_launch"],
  }),

  bey("bu-ultimate-valkyrie", "Ultimate Valkyrie BU", {
    type: "attack", color: "#FF0000", mass: 75, radius: 4.3,
    atk: 150, def: 80, sta: 130,
    dm1: 2.0, dm2: 1.6, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Burst Ultimate Valkyrie — BU Lock system with multiple burst-resistance layers; heaviest Valkyrie assembly; rubber blades for high-friction contact.",
    elements: ["fire", "lightning"],
    gimmicks: ["burst_resistance_high", "mode_change"],
  }),

  // ── Achilles Lineage ──────────────────────────────────────────────────────

  bey("z-achilles-cz", "Z Achilles 11.Xtend+", {
    type: "balanced", color: "#8800FF", mass: 40, radius: 4.1,
    atk: 120, def: 90, sta: 150,
    dm1: 1.7, dm2: 1.5, dm3: 1.4, ss1: 1.1, ss2: 1.0,
    desc: "Z Achilles Cho-Z — Xtend+ driver switches between attack and stamina modes; Forge Disc 11 provides eleven-tooth ratchet engagement.",
    elements: ["lightning"],
    gimmicks: ["mode_change"],
  }),

  bey("cz-achilles", "Cho-Z Achilles CZ.00.Xtend+", {
    type: "balanced", color: "#AA00FF", mass: 42, radius: 4.1,
    atk: 115, def: 95, sta: 150,
    dm1: 1.6, dm2: 1.4, dm3: 1.3, ss1: 1.2, ss2: 1.0,
    desc: "Cho-Z Achilles — zinc alloy outer ring on layer; 00 disc for near-zero eccentricity; Xtend+ two-mode tip balances stamina and attack.",
    elements: ["lightning", "wind"],
    gimmicks: ["mode_change", "metal_insert"],
  }),

  bey("sk-infinite-achilles", "Infinite Achilles Infinite.10.Atomic", {
    type: "defense", color: "#BB44FF", mass: 50, radius: 4.2,
    atk: 90, def: 130, sta: 140,
    dm1: 1.4, dm2: 1.3, dm3: 1.2, ss1: 1.2, ss2: 1.1,
    desc: "Sparking Infinite Achilles — Infinite Chip Lock adds multi-point burst resistance; Atomic wide free-rotating ball tip for maximum LAD and stamina.",
    elements: ["lightning", "shadow"],
    gimmicks: ["burst_resistance_high"],
  }),

  bey("bu-zest-achilles", "Zest Achilles BU.Prominence.Rise'-0", {
    type: "defense", color: "#CC88FF", mass: 70, radius: 4.2,
    atk: 80, def: 145, sta: 135,
    dm1: 1.3, dm2: 1.2, dm3: 1.1, ss1: 1.2, ss2: 1.1,
    desc: "BU Zest Achilles — Burst Ultimate Lock provides highest burst resistance in Achilles lineage; Prominence armor amplifies angular momentum; Rise'-0 driver.",
    elements: ["lightning", "shadow"],
    gimmicks: ["burst_resistance_high", "mode_change"],
  }),

  // ── Kerbeus Lineage ───────────────────────────────────────────────────────

  bey("guardian-kerbeus-gt", "Guardian Kerbeus GT.Gravity.Revolve", {
    type: "defense", color: "#008800", mass: 45, radius: 4.1,
    atk: 70, def: 145, sta: 145,
    dm1: 1.2, dm2: 1.1, dm3: 1.0, ss1: 1.2, ss2: 1.1,
    desc: "Gatinko Guardian Kerbeus — four-headed guard geometry; Gravity disc for maximum low-height mass distribution; Revolve free-bearing tip for minimal spin decay.",
    elements: ["earth"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("db-chain-kerbeus", "DB Chain Kerbeus DB.Nexus.Rise'-0", {
    type: "defense", color: "#00AA00", mass: 55, radius: 4.2,
    atk: 65, def: 150, sta: 145,
    dm1: 1.2, dm2: 1.0, dm3: 1.0, ss1: 1.3, ss2: 1.2,
    desc: "Dynamite Battle Chain Kerbeus — D Gear spring-loaded recoil deflector in Nexus disc; high-mass defense assembly with chain-armor guard blades.",
    elements: ["earth", "shadow"],
    gimmicks: ["burst_resistance_high", "heavy_metal_disc"],
  }),

  // ── Deathscyther Lineage ──────────────────────────────────────────────────

  bey("dark-deathscyther-dl", "Dark Deathscyther DL.Gravity.Blow", {
    type: "attack", color: "#330066", mass: 36, radius: 4.0,
    atk: 135, def: 55, sta: 170,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.0, ss2: 0.9,
    desc: "Dark Deathscyther Dual Layer — scythe blade C₂ geometry; Gravity disc for massed low-profile impact; Blow rubber tip for high orbital friction.",
    elements: ["shadow"],
    gimmicks: ["burst_attack"],
  }),

  bey("sk-hollow-deathscyther", "Hollow Deathscyther SK.Nexus+.Destroy'", {
    type: "attack", color: "#440088", mass: 48, radius: 4.2,
    spin: "left",
    atk: 140, def: 60, sta: 160,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.1, ss2: 1.0,
    desc: "Sparking Hollow Deathscyther — LEFT spin; hollow resin outer layer with rubber contact points; Nexus+ disc; Destroy' dash rubber-flat tip.",
    elements: ["shadow", "wind"],
    gimmicks: ["dual_spin_launch"],
  }),

  // ── Diabolos Lineage ──────────────────────────────────────────────────────

  bey("gt-erase-diabolos", "Erase Diabolos GT.0.Yard'", {
    type: "balanced", color: "#CC0044", mass: 45, radius: 4.1,
    atk: 110, def: 110, sta: 140,
    dm1: 1.6, dm2: 1.4, dm3: 1.3, ss1: 1.1, ss2: 1.0,
    desc: "Gatinko Erase Diabolos — mode-change eraser blade geometry; 0 disc for minimum eccentricity; Yard' dash tip for controlled stamina.",
    elements: ["shadow", "fire"],
    gimmicks: ["mode_change"],
  }),

  // ── Salamander / Forneus Lineage ──────────────────────────────────────────

  bey("hell-salamander-sk", "Hell Salamander SK.00.Bearing'", {
    type: "attack", color: "#FF4400", mass: 50, radius: 4.2,
    atk: 130, def: 65, sta: 165,
    dm1: 1.8, dm2: 1.4, dm3: 1.3, ss1: 1.1, ss2: 1.0,
    desc: "Sparking Hell Salamander — fire-element smash blades with rubber contact inserts; 00 disc; Bearing' dash bearing tip for low friction stamina.",
    elements: ["fire", "shadow"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("emperor-forneus-cz", "Emperor Forneus CZ.Zenith.Orbit", {
    type: "stamina", color: "#0044AA", mass: 40, radius: 4.1,
    atk: 60, def: 120, sta: 180,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.3,
    desc: "Cho-Z Emperor Forneus — water-element wide defense layer; Zenith disc for maximum Cho-Z era inertia; Orbit free-spinning bearing tip for ultra-low spin decay.",
    elements: ["water"],
    gimmicks: [],
  }),

  // ── Bahamut / Lucifer Lineage ─────────────────────────────────────────────

  bey("db-roar-bahamut", "Roar Bahamut DB.Nexus.Rise'-0", {
    type: "defense", color: "#220066", mass: 55, radius: 4.2,
    atk: 70, def: 148, sta: 142,
    dm1: 1.2, dm2: 1.1, dm3: 1.0, ss1: 1.3, ss2: 1.2,
    desc: "DB Roar Bahamut — Dynamite Battle high-mass defense layer with D Gear recoil; Nexus disc spring-deflects impacts; Rise'-0 low-friction driver.",
    elements: ["shadow", "earth"],
    gimmicks: ["burst_resistance_high"],
  }),

  bey("sk-the-end-lucifer", "The End Lucifer SK.Mobius.Destroy", {
    type: "stamina", color: "#880088", mass: 50, radius: 4.2,
    spin: "left",
    atk: 60, def: 150, sta: 150,
    dm1: 1.1, dm2: 1.0, dm3: 1.0, ss1: 1.5, ss2: 1.4,
    desc: "Sparking The End Lucifer — LEFT spin; Möbius free-bearing disc for near-zero LAD height; extreme stamina assembly with shadow-element absorption blades.",
    elements: ["shadow"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("db-barricade-lucifer", "Barricade Lucifer DB.Over.Drift'", {
    type: "defense", color: "#AA00AA", mass: 60, radius: 4.3,
    atk: 65, def: 150, sta: 145,
    dm1: 1.2, dm2: 1.1, dm3: 1.0, ss1: 1.3, ss2: 1.2,
    desc: "DB Barricade Lucifer — barricade armor plates amplify burst resistance; Over disc for widest contact footprint; Drift' dash bearing tip.",
    elements: ["shadow", "earth"],
    gimmicks: ["burst_resistance_high"],
  }),

  // ── Dragon / Imperial Lineage ─────────────────────────────────────────────

  bey("gt-imperial-dragon", "Imperial Dragon GT.0.Xtend+", {
    type: "attack", color: "#FF0022", mass: 45, radius: 4.1,
    atk: 145, def: 65, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Gatinko Imperial Dragon — C₄ imperial claw geometry with dual-layer rubber inserts; 0 disc; Xtend+ mode-switch driver for attack/stamina flexibility.",
    elements: ["fire"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("sk-tempest-dragon", "Tempest Dragon SK.Nexus+.Xtreme'", {
    type: "attack", color: "#FF2244", mass: 50, radius: 4.2,
    atk: 148, def: 62, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Sparking Tempest Dragon — tempest vortex blade geometry; Nexus+ D Gear disc deflects recoil; Xtreme' dash rubber ring for maximum orbital aggression.",
    elements: ["fire", "wind"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("bu-gatling-dragon", "Gatling Dragon BU.Xanthus.Charge'", {
    type: "attack", color: "#FF4466", mass: 72, radius: 4.2,
    atk: 150, def: 75, sta: 135,
    dm1: 2.0, dm2: 1.6, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "BU Gatling Dragon — repeating gatling-strike contact sequence; Xanthus 32.5 g disc stores maximum angular momentum; BU Lock provides burst suppression.",
    elements: ["fire", "lightning"],
    gimmicks: ["burst_resistance_high"],
  }),

  // ── Ragnaruk Lineage ──────────────────────────────────────────────────────

  bey("cz-crash-ragnaruk", "Crash Ragnaruk CZ.0.Orbit", {
    type: "defense", color: "#004488", mass: 42, radius: 4.1,
    atk: 75, def: 140, sta: 145,
    dm1: 1.3, dm2: 1.1, dm3: 1.0, ss1: 1.2, ss2: 1.1,
    desc: "Cho-Z Crash Ragnaruk — crash-impact defense blade geometry; 0 disc for symmetric mass; Orbit free-bearing tip for low spin decay.",
    elements: ["water", "earth"],
    gimmicks: [],
  }),

  bey("sk-glide-ragnaruk", "Glide Ragnaruk SK.Nexus.Bearing", {
    type: "defense", color: "#006699", mass: 50, radius: 4.2,
    atk: 65, def: 145, sta: 150,
    dm1: 1.2, dm2: 1.1, dm3: 1.0, ss1: 1.3, ss2: 1.2,
    desc: "Sparking Glide Ragnaruk — wide glide guard geometry; Nexus disc D Gear spring deflects; Bearing tip for minimum friction stamina.",
    elements: ["water"],
    gimmicks: ["heavy_metal_disc"],
  }),

  bey("db-cyclone-ragnaruk", "Cyclone Ragnaruk DB.Over.Drift'", {
    type: "defense", color: "#0088BB", mass: 55, radius: 4.2,
    atk: 65, def: 145, sta: 150,
    dm1: 1.2, dm2: 1.1, dm3: 1.0, ss1: 1.3, ss2: 1.2,
    desc: "DB Cyclone Ragnaruk — cyclone-spiral defense blades; Over disc; Drift' bearing tip; highest-mass Ragnaruk assembly with D Gear recoil suppression.",
    elements: ["water", "wind"],
    gimmicks: ["heavy_metal_disc"],
  }),

  // ── Longinus Lineage ──────────────────────────────────────────────────────

  bey("sk-rage-longinus", "Rage Longinus SK.Mobius.Destroy'", {
    type: "attack", color: "#AA0000", mass: 50, radius: 4.2,
    spin: "left",
    atk: 148, def: 62, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "Sparking Rage Longinus — LEFT spin; three-pronged lance blades for maximum left-spin smash; Möbius disc; Destroy' dash rubber flat for aggressive orbit.",
    elements: ["shadow", "fire"],
    gimmicks: ["dual_spin_launch"],
  }),

  // ── Belial Lineage ────────────────────────────────────────────────────────

  bey("db-dynamite-belial", "Dynamite Belial DB.Nexus.Over'", {
    type: "balanced", color: "#FF6600", mass: 60, radius: 4.3,
    atk: 130, def: 100, sta: 130,
    dm1: 1.8, dm2: 1.5, dm3: 1.4, ss1: 1.1, ss2: 1.0,
    desc: "DB Dynamite Belial — dynamite-charge rubber blades deliver maximum impact burst; Nexus D Gear disc; heavy balanced assembly with burst attack capability.",
    elements: ["fire", "lightning"],
    gimmicks: ["burst_resistance_high", "spring_bound"],
  }),

  bey("dangerous-belial", "Dangerous Belial DB.Over.Rise'", {
    type: "attack", color: "#FF8800", mass: 65, radius: 4.3,
    atk: 150, def: 70, sta: 140,
    dm1: 2.0, dm2: 1.6, dm3: 1.4, ss1: 1.0, ss2: 0.9,
    desc: "Dangerous Belial — evolved Dynamite Belial with enhanced rubber blade contact area; Over disc for widest contact; Rise' dash tip for controlled power orbit.",
    elements: ["fire"],
    gimmicks: ["burst_resistance_high"],
  }),

  bey("bu-divine-belial", "Divine Belial BU.Prominence.Destroy'-2", {
    type: "balanced", color: "#FFAA00", mass: 75, radius: 4.3,
    atk: 120, def: 115, sta: 125,
    dm1: 1.8, dm2: 1.6, dm3: 1.5, ss1: 1.1, ss2: 1.1,
    desc: "BU Divine Belial — Burst Ultimate pinnacle; Prominence armor + BU Lock provides maximum burst suppression; heaviest Belial assembly; tri-element mastery.",
    elements: ["fire", "lightning", "shadow"],
    gimmicks: ["burst_resistance_high", "mode_change"],
  }),

  // ── Wyvern Lineage ────────────────────────────────────────────────────────

  bey("god-tornado-wyvern", "God Tornado Wyvern God.7.Destroy", {
    type: "attack", color: "#00CCFF", mass: 38, radius: 4.0,
    atk: 130, def: 60, sta: 170,
    dm1: 1.7, dm2: 1.3, dm3: 1.2, ss1: 1.1, ss2: 1.0,
    desc: "God Tornado Wyvern — C₄ wind-channel blade geometry creates tornado draft on contact; Forge Disc 7 for high contact frequency; Destroy rubber tip.",
    elements: ["wind", "water"],
    gimmicks: ["speed_boost_tip"],
  }),

  bey("sk-jet-wyvern", "Jet Wyvern SK.Over.Xtreme'", {
    type: "attack", color: "#00AABB", mass: 48, radius: 4.2,
    atk: 135, def: 65, sta: 160,
    dm1: 1.8, dm2: 1.4, dm3: 1.2, ss1: 1.1, ss2: 1.0,
    desc: "Sparking Jet Wyvern — jet-stream aerodynamic blades; Over disc for wide mass spread; Xtreme' rubber ring dash for aggressive flower-pattern orbit.",
    elements: ["wind", "water"],
    gimmicks: ["speed_boost_tip"],
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GEN 4 — BX / UX / CX SYSTEM (Xtreme Line Blade/Ratchet/Bit)
  // ═══════════════════════════════════════════════════════════════════════════

  bey("shark-edge-3-60f", "Shark Edge 3-60F", {
    type: "attack", color: "#0033CC", mass: 36, radius: 3.8,
    atk: 145, def: 65, sta: 150,
    dm1: 1.9, dm2: 1.5, dm3: 1.3, ss1: 1.0, ss2: 0.9,
    desc: "BX Shark Edge — C₃ dual-face smash blade; Ratchet 3-60 (3 tabs) near BX standard burst threshold; Flat Bit for aggressive floor contact orbit.",
    elements: ["water"],
    gimmicks: ["burst_attack"],
  }),

  bey("cobalt-drake-4-60f", "Cobalt Drake 4-60F", {
    type: "defense", color: "#003399", mass: 38, radius: 3.8,
    atk: 85, def: 135, sta: 140,
    dm1: 1.4, dm2: 1.2, dm3: 1.1, ss1: 1.2, ss2: 1.1,
    desc: "BX Cobalt Drake — C₄ blocky-rectangle contact face distributes impact; Ratchet 4-60 (4 tabs, +20% burst resistance vs 3-tab); Flat Bit.",
    elements: ["water", "shadow"],
    gimmicks: [],
  }),

  bey("dran-buster-1-60a", "Dran Buster 1-60A", {
    type: "attack", color: "#FF6633", mass: 35, radius: 3.8,
    atk: 150, def: 50, sta: 160,
    dm1: 2.0, dm2: 1.6, dm3: 1.4, ss1: 1.0, ss2: 0.9,
    desc: "UX Dran Buster — C₂ oval glass-cannon one-shot strike; minimum 1-tab Ratchet 1-60 (lowest BX burst threshold, catastrophe risk); Atomic Bit free-rotating ball.",
    elements: ["fire"],
    gimmicks: ["burst_attack"],
  }),

  bey("dran-brave-s6-60v", "Dran Brave S6-60V", {
    type: "balanced", color: "#FF3300", mass: 37, radius: 3.8,
    atk: 120, def: 90, sta: 150,
    dm1: 1.7, dm2: 1.5, dm3: 1.4, ss1: 1.1, ss2: 1.0,
    desc: "CX Dran Brave — S6 Shield Ratchet (six-tab highest burst resistance in CX era); Variable Bit mode-switch; balanced attack-stamina profile.",
    elements: ["fire", "wind"],
    gimmicks: ["mode_change"],
  }),
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seedBeyblades() {
  console.log("\n══════════════════════════════════════");
  console.log("  Beyblade Preset Seed (ALL Generations)");
  console.log("══════════════════════════════════════\n");
  await clearCollection("beyblade_stats");

  for (const b of BEYBLADES) {
    const derived = calcStats(b.typeDistribution);
    const physicsFlags  = { ...DEFAULT_PHYSICS_FLAGS };

    // comboSlots — empty since comboIds is empty
    const comboSlots = [];

    const docData = {
      ...b,
      // Derived stats stored for admin UI display
      stamina:              derived.maxStamina,
      spinStealFactor:      derived.spinStealFactor,
      spinDecayRate:        derived.spinDecayRate,
      speed:                derived.speedBonus,
      rotationSpeed:        derived.rotationSpeed,
      invulnerabilityChance: derived.invulnerabilityChance,
      damageReduction:      parseFloat((1 / derived.damageTaken).toFixed(3)),
      // Jump physics — beys don't jump by default
      jumpForce:            0,
      jumpHeight:           0,
      // Burst resistance — per-type default
      burstResistance:      DEFAULT_BURST_RESISTANCE_BY_TYPE[b.type] ?? 50,
      // Empty kit — user specified no specials or combos
      specialMoveId:        "",
      comboIds:             [],
      comboSlots,
      physicsFlags,
      createdAt:            now,
      updatedAt:            now,
      createdBy:            "seed",
    };

    try {
      await db.collection("beyblade_stats").doc(b.id).set(docData, { merge: false });
      const maxDmg = (derived.damageMultiplier * 100).toFixed(0);
      console.log(`  ✔ ${b.displayName.padEnd(40)} (${b.type.padEnd(8)}, ${b.spinDirection.padEnd(5)} spin)  HP=${derived.maxStamina}  DMG=${maxDmg}  Decay=${derived.spinDecayRate}/s`);
    } catch (err) {
      console.error(`  ✘ ${b.displayName}: ${err.message}`);
    }
  }

  console.log(`\n✅ Seeded ${BEYBLADES.length} beyblades into beyblade_stats\n`);
}

seedBeyblades()
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

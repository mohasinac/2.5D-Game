#!/usr/bin/env node
// Seed beyblade_systems collection with ALL stock combo beyblades in 2.5D modular format
// Source: case study/INDEX.md stock combo tables (235 entries)

require('dotenv').config();
const admin = require('firebase-admin');

const { FIREBASE_ADMIN_PROJECT_ID: projectId, FIREBASE_ADMIN_CLIENT_EMAIL: clientEmail, FIREBASE_ADMIN_PRIVATE_KEY } = process.env;
const privateKey = FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) { console.error('❌ Missing Firebase Admin env vars.'); process.exit(1); }
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });

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

// ─────────────────────────────────────────────────────────────────────────────
// Archetype heuristic based on tip/bottom/base name
// ─────────────────────────────────────────────────────────────────────────────
function inferArchetype(parts) {
  const tip = (
    parts.bottom || parts.bladeBase || parts.runningCore || ''
  ).toLowerCase();

  if (/flat|grip|rubber-flat|metal-flat|extreme-flat|wide-flat|giga-flat|hole-flat|circle-flat|gear-circle-flat|r2f/.test(tip)) return 'attack';
  if (/defense|ball|metal-ball|wide-ball|shield|rubber-ball|sharp-ball|jog-ball|twin-ball|jog-sharp-ball|big-wide-defense|semi-defense/.test(tip)) return 'defense';
  if (/sharp|bearing|eternal|survive|bearing-drive|final-survive|x-drive|rubber-sharp|coat-sharp|around-sharp/.test(tip)) return 'stamina';
  if (/semi-flat|change|quake|delta-drive|final-drive|ewd|eds|wide-defense|blade-semi-flat/.test(tip)) return 'balanced';
  return 'balanced';
}

// ─────────────────────────────────────────────────────────────────────────────
// ALL STOCK COMBO BEYBLADES
// ─────────────────────────────────────────────────────────────────────────────

const beybladeySystems = [

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 1 — Plastics: 4 Layer System (4LS)
  // Slots: AR, WD, BB (no Spin Gear)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- 4LS (23 beyblades) ---
  {
    id: "ultimate-dragoon",
    name: "Ultimate Dragoon",
    generation: "plastic",
    parts: { attackRing: "cross-dragon", weightDisk: "wide", bladeBase: "flat-base" },
  },
  {
    id: "saizo",
    name: "Saizo",
    generation: "plastic",
    parts: { attackRing: "try-cutter", weightDisk: "heavy", bladeBase: "sharp-base" },
  },
  {
    id: "frostic-dranzer",
    name: "Frostic Dranzer",
    generation: "plastic",
    parts: { attackRing: "wing-cross", weightDisk: "balance", bladeBase: "semi-flat-base" },
  },
  {
    id: "gekiryu-oh",
    name: "Gekiryu-oh",
    generation: "plastic",
    parts: { attackRing: "wing-cross", weightDisk: "wide", bladeBase: "semi-flat-base" },
  },
  {
    id: "megaro-arm",
    name: "Megaro Arm",
    generation: "plastic",
    parts: { attackRing: "cross-dragon", weightDisk: "heavy", bladeBase: "flat-base" },
  },
  {
    id: "spark-knight",
    name: "Spark Knight",
    generation: "plastic",
    parts: { attackRing: "try-cutter", weightDisk: "balance", bladeBase: "sharp-base" },
  },
  {
    id: "polta",
    name: "Polta",
    generation: "plastic",
    parts: { attackRing: "try-cutter", weightDisk: "wide", bladeBase: "sharp-base" },
  },
  {
    id: "bistool",
    name: "Bistool",
    generation: "plastic",
    parts: { attackRing: "wing-cross", weightDisk: "heavy", bladeBase: "semi-flat-base" },
  },
  {
    id: "makendo",
    name: "Makendo",
    generation: "plastic",
    parts: { attackRing: "cross-dragon", weightDisk: "balance", bladeBase: "flat-base" },
  },
  {
    id: "bakushin-oh",
    name: "Bakushin-oh",
    generation: "plastic",
    parts: { attackRing: "down-force-ring", weightDisk: "heavy", bladeBase: "flat-base" },
  },
  {
    id: "pumpking",
    name: "Pumpking",
    generation: "plastic",
    parts: { attackRing: "upper-force-ring", weightDisk: "wide", bladeBase: "semi-flat-base" },
  },
  {
    id: "dragoon-grip-attacker",
    name: "Dragoon Grip Attacker",
    generation: "plastic",
    parts: { attackRing: "dragon-head", weightDisk: "wide", bladeBase: "grip-base" },
  },
  {
    id: "metal-dragoon-bearing-stinger",
    name: "Metal Dragoon Bearing Stinger",
    generation: "plastic",
    parts: { attackRing: "scissor-cutter", weightDisk: "heavy", bladeBase: "bearing-base" },
  },
  {
    id: "bound-attacker",
    name: "Bound Attacker",
    generation: "plastic",
    parts: { attackRing: "bound-attack-ring", weightDisk: "balance", bladeBase: "flat-base" },
  },
  {
    id: "bound-defenser",
    name: "Bound Defenser",
    generation: "plastic",
    parts: { attackRing: "bound-defense-ring", weightDisk: "heavy", bladeBase: "sharp-base" },
  },
  {
    id: "roller-attacker",
    name: "Roller Attacker",
    generation: "plastic",
    parts: { attackRing: "roller-attack-ring", weightDisk: "balance", bladeBase: "flat-base" },
  },
  {
    id: "roller-defenser",
    name: "Roller Defenser",
    generation: "plastic",
    parts: { attackRing: "roller-defense-ring", weightDisk: "heavy", bladeBase: "semi-flat-base" },
  },
  {
    id: "dranzer-auto-change-balancer",
    name: "Dranzer Auto Change Balancer",
    generation: "plastic",
    parts: { attackRing: "wing-cutter", weightDisk: "balance", bladeBase: "auto-change-base" },
  },
  {
    id: "wing-attacker",
    name: "Wing Attacker",
    generation: "plastic",
    parts: { attackRing: "wing-attack-ring", weightDisk: "balance", bladeBase: "semi-flat-base" },
  },
  {
    id: "wing-defenser",
    name: "Wing Defenser",
    generation: "plastic",
    parts: { attackRing: "wing-defense-ring", weightDisk: "heavy", bladeBase: "semi-flat-base" },
  },
  {
    id: "draciel-metal-ball-defenser",
    name: "Draciel Metal Ball Defenser",
    generation: "plastic",
    parts: { attackRing: "max-shield", weightDisk: "heavy", bladeBase: "metal-ball-base" },
  },
  {
    id: "sparkling-attacker",
    name: "Sparkling Attacker",
    generation: "plastic",
    parts: { attackRing: "spark-attack-ring", weightDisk: "heavy", bladeBase: "flat-base" },
  },
  {
    id: "jumping-base-set",
    name: "Jumping Base (set)",
    generation: "plastic",
    parts: { attackRing: "tiger-defenser", weightDisk: "eight-wide", bladeBase: "jumping-base" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 1 — Plastics: Spin Gear System (A–F Series)
  // Slots: AR, WD, SG, BB
  // ═══════════════════════════════════════════════════════════════════════════

  // --- SG A–F (32 beyblades) ---
  {
    id: "dragoon-s",
    name: "Dragoon S (Storm)",
    generation: "plastic",
    parts: { attackRing: "reverse-dragon", weightDisk: "eight-wide", spinGear: "left-sg", bladeBase: "storm-grip-base" },
  },
  {
    id: "driger-s",
    name: "Driger S (Slash)",
    generation: "plastic",
    parts: { attackRing: "tiger-defenser", weightDisk: "eight-heavy", spinGear: "right-sg", bladeBase: "metal-change-base" },
  },
  {
    id: "death-driger",
    name: "Death Driger",
    generation: "plastic",
    parts: { attackRing: "star-shape", weightDisk: "eight-balance", spinGear: "right-sg", bladeBase: "sg-sharp-base" },
  },
  {
    id: "knight-dranzer",
    name: "Knight Dranzer",
    generation: "plastic",
    parts: { attackRing: "knight-claws-ring", weightDisk: "eight-balance", spinGear: "right-sg", bladeBase: "sg-semi-flat-base" },
  },
  {
    id: "metal-draciel",
    name: "Metal Draciel",
    generation: "plastic",
    parts: { attackRing: "turtle-survivor", weightDisk: "eight-heavy", spinGear: "right-sg", bladeBase: "metal-sting-base" },
  },
  {
    id: "kids-dragoon",
    name: "Kids Dragoon",
    generation: "plastic",
    parts: { attackRing: "upper-dragoon", weightDisk: "eight-wide", spinGear: "right-sg", bladeBase: "sg-flat-base" },
  },
  {
    id: "kids-draciel",
    name: "Kids Draciel",
    generation: "plastic",
    parts: { attackRing: "smash-turtle", weightDisk: "eight-heavy", spinGear: "right-sg", bladeBase: "sg-sharp-base" },
  },
  {
    id: "dranzer-s",
    name: "Dranzer S (Spiral)",
    generation: "plastic",
    parts: { attackRing: "double-wing", weightDisk: "eight-balance", spinGear: "right-sg-free-shaft", bladeBase: "spiral-change-base" },
  },
  {
    id: "galeon",
    name: "Galeon",
    generation: "plastic",
    parts: { attackRing: "war-lion", weightDisk: "eight-heavy", spinGear: "right-sg", bladeBase: "sg-semi-flat-base" },
  },
  {
    id: "galzzly",
    name: "Galzzly",
    generation: "plastic",
    parts: { attackRing: "war-bear", weightDisk: "eight-wide", spinGear: "right-sg", bladeBase: "sg-flat-base" },
  },
  {
    id: "galman",
    name: "Galman",
    generation: "plastic",
    parts: { attackRing: "war-monkey", weightDisk: "eight-heavy", spinGear: "right-sg", bladeBase: "sg-sharp-base" },
  },
  {
    id: "wolborg",
    name: "Wolborg",
    generation: "plastic",
    parts: { attackRing: "reverse-wolf", weightDisk: "eight-balance", spinGear: "right-sg-bearing", bladeBase: "sg-bearing-base" },
  },
  {
    id: "seaborg",
    name: "Seaborg",
    generation: "plastic",
    parts: { attackRing: "whale-attacker", weightDisk: "eight-wide", spinGear: "right-sg", bladeBase: "defense-grip-base" },
  },
  {
    id: "draciel-s",
    name: "Draciel S (Shield)",
    generation: "plastic",
    parts: { attackRing: "cross-spike", weightDisk: "eight-balance", spinGear: "right-sg", bladeBase: "sg-metal-ball-base" },
  },
  {
    id: "trygle",
    name: "Trygle",
    generation: "plastic",
    parts: { attackRing: "triple-wing", weightDisk: "eight-wide", spinGear: "right-sg-spring", bladeBase: "jumping-base-trygle" },
  },
  {
    id: "trypio",
    name: "Trypio",
    generation: "plastic",
    parts: { attackRing: "flying-defense", weightDisk: "eight-heavy", spinGear: "right-sg", bladeBase: "sg-sharp-base" },
  },
  {
    id: "driger-f",
    name: "Driger F (Fang)",
    generation: "plastic",
    parts: { attackRing: "cross-fang", weightDisk: "eight-balance", spinGear: "right-sg-fac", bladeBase: "full-auto-clutch-base" },
  },
  {
    id: "dragoon-f",
    name: "Dragoon F (Fantom)",
    generation: "plastic",
    parts: { attackRing: "dual-dragon", weightDisk: "eight-wide", spinGear: "left-sg", bladeBase: "fantom-grip-base" },
  },
  {
    id: "dranzer-f",
    name: "Dranzer F (Flame)",
    generation: "plastic",
    parts: { attackRing: "flame-wing", weightDisk: "eight-heavy", spinGear: "right-sg-tc", bladeBase: "flame-change-base" },
  },
  {
    id: "griffolyon",
    name: "Griffolyon",
    generation: "plastic",
    parts: { attackRing: "cross-griffon", weightDisk: "eight-balance", bladeBase: "griffolyon-base" },
  },
  {
    id: "master-dragoon",
    name: "Master Dragoon",
    generation: "plastic",
    parts: { attackRing: "upper-dragoon", weightDisk: "eight-heavy", spinGear: "right-sg", bladeBase: "sg-flat-base" },
  },
  {
    id: "master-dranzer",
    name: "Master Dranzer",
    generation: "plastic",
    parts: { attackRing: "turtle-survivor", weightDisk: "eight-balance", spinGear: "right-sg", bladeBase: "metal-sting-base" },
  },
  {
    id: "master-draciel",
    name: "Master Draciel",
    generation: "plastic",
    parts: { attackRing: "smash-turtle", weightDisk: "eight-wide", spinGear: "right-sg", bladeBase: "sg-sharp-base" },
  },
  {
    id: "salamalyon",
    name: "Salamalyon",
    generation: "plastic",
    parts: { attackRing: "fire-cracker", weightDisk: "eight-wide", bladeBase: "salamalyon-base" },
  },
  {
    id: "draciel-f",
    name: "Draciel F (Fortress)",
    generation: "plastic",
    parts: { attackRing: "eight-spike", weightDisk: "eight-balance", spinGear: "right-sg-grease-ball", bladeBase: "fortress-base" },
  },
  {
    id: "wyborg",
    name: "Wyborg",
    generation: "plastic",
    parts: { attackRing: "double-snake", weightDisk: "eight-balance", spinGear: "right-sg-ac", bladeBase: "sg-auto-change-base" },
  },
  {
    id: "master-driger",
    name: "Master Driger",
    generation: "plastic",
    parts: { attackRing: "knight-claws-ring", weightDisk: "eight-wide", spinGear: "right-sg", bladeBase: "sg-semi-flat-base" },
  },
  {
    id: "wolborg-2",
    name: "Wolborg 2",
    generation: "plastic",
    parts: { attackRing: "upper-wolf", weightDisk: "eight-balance", spinGear: "right-sg-bearing-v2", bladeBase: "defense-grip-base-2" },
  },
  {
    id: "seaborg-2",
    name: "Seaborg 2",
    generation: "plastic",
    parts: { attackRing: "whale-crusher", weightDisk: "eight-wide", spinGear: "right-sg", bladeBase: "sg-flat-base" },
  },
  {
    id: "gaia-dragoon",
    name: "Gaia Dragoon",
    generation: "plastic",
    parts: { attackRing: "great-dragon", weightDisk: "heavy-attack", spinGear: "right-sg-g-ball", bladeBase: "g-special-base" },
  },
  {
    id: "bakuten-henkei-gaia-dragoon",
    name: "Bakuten Henkei Gaia Dragoon",
    generation: "plastic",
    parts: { attackRing: "fire-cracker", weightDisk: "revolver-attack", bladeBase: "salamalyon-base" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 1 — Plastics: V Series (Magnacore)
  // Slots: AR, WD, SG, BB
  // ═══════════════════════════════════════════════════════════════════════════

  // --- V Series (27 beyblades) ---
  {
    id: "dragoon-v",
    name: "Dragoon V (Victory)",
    generation: "plastic",
    parts: { attackRing: "eight-attacker", weightDisk: "ten-wide", spinGear: "neo-left-sg-mw", bladeBase: "magne-flat-base" },
  },
  {
    id: "metal-dranzer",
    name: "Metal Dranzer",
    generation: "plastic",
    parts: { attackRing: "scissor-attacker", weightDisk: "ten-balance", spinGear: "neo-right-sg-south", bladeBase: "sg-flat-base" },
  },
  {
    id: "flash-leopard",
    name: "Flash Leopard",
    generation: "plastic",
    parts: { attackRing: "panther-claw", weightDisk: "ten-heavy", spinGear: "neo-right-sg-mw-north", bladeBase: "sg-semi-flat-base" },
  },
  {
    id: "driger-v",
    name: "Driger V (Vulcan)",
    generation: "plastic",
    parts: { attackRing: "sonic-tiger", weightDisk: "ten-balance", spinGear: "neo-right-sg-south", bladeBase: "sg-metal-flat-base" },
  },
  {
    id: "flash-leopard-2",
    name: "Flash Leopard 2",
    generation: "plastic",
    parts: { attackRing: "panther-head", weightDisk: "ten-heavy", spinGear: "neo-right-sg-north", bladeBase: "sg-metal-sharp-base" },
  },
  {
    id: "dranzer-v",
    name: "Dranzer V (Volcano)",
    generation: "plastic",
    parts: { attackRing: "cross-attacker", weightDisk: "ten-balance", spinGear: "neo-right-sg-south", bladeBase: "volcano-change-base" },
  },
  {
    id: "cyber-dragoon",
    name: "Cyber Dragoon",
    generation: "plastic",
    parts: { attackRing: "cybernetic-dragon", weightDisk: "ten-wide", spinGear: "right-sg-mg-spring", bladeBase: "jumping-base-2" },
  },
  {
    id: "draciel-v",
    name: "Draciel V (Viper)",
    generation: "plastic",
    parts: { attackRing: "ten-spike", weightDisk: "ten-balance", spinGear: "neo-right-sg-north", bladeBase: "viper-metal-ball-base" },
  },
  {
    id: "wolborg-03",
    name: "Wolborg 03 (Uriel)",
    generation: "plastic",
    parts: { attackRing: "cross-horn", weightDisk: "revolver-attack", spinGear: "neo-right-sg-south", bladeBase: "sg-grip-base" },
  },
  {
    id: "gabriel",
    name: "Gabriel",
    generation: "plastic",
    parts: { attackRing: "twin-horn", weightDisk: "revolver-attack", spinGear: "neo-right-sg-mw", bladeBase: "sg-wing-base" },
  },
  {
    id: "guardian-driger",
    name: "Guardian Driger",
    generation: "plastic",
    parts: { attackRing: "great-tiger", weightDisk: "eight-heavy", spinGear: "neo-right-sg-south", bladeBase: "sg-flat-base" },
  },
  {
    id: "spike-lizard",
    name: "Spike Lizard",
    generation: "plastic",
    parts: { attackRing: "lizard-blocker", weightDisk: "ten-heavy", spinGear: "neo-right-sg-north", bladeBase: "sg-roller-base" },
  },
  {
    id: "crab-diver",
    name: "Crab Diver",
    generation: "plastic",
    parts: { attackRing: "scissors-arm", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-semi-flat-base" },
  },
  {
    id: "orca-diver",
    name: "Orca Diver",
    generation: "plastic",
    parts: { attackRing: "delta-wave", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-flat-base" },
  },
  {
    id: "manta-diver",
    name: "Manta Diver",
    generation: "plastic",
    parts: { attackRing: "square-edge", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-sharp-base" },
  },
  {
    id: "killer-eagle",
    name: "Killer Eagle",
    generation: "plastic",
    parts: { attackRing: "penta-wing", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-semi-flat-base" },
  },
  {
    id: "death-gargoyle",
    name: "Death Gargoyle",
    generation: "plastic",
    parts: { attackRing: "genocide-circle", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-flat-base" },
  },
  {
    id: "rushing-boar",
    name: "Rushing Boar",
    generation: "plastic",
    parts: { attackRing: "hammer-tusk", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-sharp-base" },
  },
  {
    id: "galeon-2",
    name: "Galeon 2",
    generation: "plastic",
    parts: { attackRing: "howling-leo", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-semi-flat-base" },
  },
  {
    id: "trygle-2",
    name: "Trygle 2",
    generation: "plastic",
    parts: { attackRing: "triple-beak", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-sharp-base" },
  },
  {
    id: "trygator",
    name: "Trygator",
    generation: "plastic",
    parts: { attackRing: "jungle-shock", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-flat-base" },
  },
  {
    id: "cyber-dragoon-battle-spec",
    name: "Cyber Dragoon Battle Spec.",
    generation: "plastic",
    parts: { attackRing: "cybernetic-dragon", weightDisk: "eight-wide", spinGear: "neo-right-sg-mw", bladeBase: "sg-wing-base" },
  },
  {
    id: "ultimate-dragoon-v",
    name: "Ultimate Dragoon V",
    generation: "plastic",
    parts: { attackRing: "cross-dragon", weightDisk: "magne-wd", bladeBase: "flat-base" },
  },
  {
    id: "appollon",
    name: "Appollon",
    generation: "plastic",
    parts: { attackRing: "corona-saber", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-flat-base" },
  },
  {
    id: "venus",
    name: "Venus",
    generation: "plastic",
    parts: { attackRing: "mirage-goddess", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-sharp-base" },
  },
  {
    id: "poseidon",
    name: "Poseidon",
    generation: "plastic",
    parts: { attackRing: "trident-vector", weightDisk: "random", spinGear: "neo-right-sg-mw", bladeBase: "sg-semi-flat-base" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 1 — Plastics: V2 Series
  // Slots: AR, WD, SG, SP, BB
  // ═══════════════════════════════════════════════════════════════════════════

  // --- V2 Series (14 beyblades) ---
  {
    id: "dragoon-v2",
    name: "Dragoon V2",
    generation: "plastic",
    parts: { attackRing: "spike-dragon", weightDisk: "magne-wd", spinGear: "neo-left-sg", supportPart: "reverse-attack", bladeBase: "customize-grip-base" },
  },
  {
    id: "driger-v2",
    name: "Driger V2",
    generation: "plastic",
    parts: { attackRing: "upper-claw", weightDisk: "ten-balance", spinGear: "neo-right-sg-mw", supportPart: "upper-attack", bladeBase: "customize-metal-change-base" },
  },
  {
    id: "voltaic-ape",
    name: "Voltaic Ape",
    generation: "plastic",
    parts: { attackRing: "mountain-hammer", weightDisk: "magne-wd", spinGear: "neo-right-sg-north", supportPart: "defense-ring", bladeBase: "customize-metal-sharp-base" },
  },
  {
    id: "gaia-dragoon-v",
    name: "Gaia Dragoon V",
    generation: "plastic",
    parts: { attackRing: "dragon-breaker", weightDisk: "ten-wide", spinGear: "neo-right-sg-south", bladeBase: "sg-metal-flat-base-gdv" },
  },
  {
    id: "dranzer-v2",
    name: "Dranzer V2",
    generation: "plastic",
    parts: { attackRing: "cross-dranzer", weightDisk: "ten-balance", spinGear: "neo-right-sg-mw", supportPart: "cross-survivor", bladeBase: "customize-clutch-change" },
  },
  {
    id: "burning-kerberous",
    name: "Burning Kerberous",
    generation: "plastic",
    parts: { attackRing: "triple-attacker", weightDisk: "ten-wide", spinGear: "neo-right-sg-db", supportPart: "cross-attack", bladeBase: "customize-bearing-base" },
  },
  {
    id: "draciel-v2",
    name: "Draciel V2",
    generation: "plastic",
    parts: { attackRing: "strike-turtle", weightDisk: "ten-heavy", spinGear: "neo-right-sg-north", supportPart: "fin-tector", bladeBase: "switch-metal-ball-base" },
  },
  {
    id: "uriel-2",
    name: "Uriel 2",
    generation: "plastic",
    parts: { attackRing: "neo-cross-horn", weightDisk: "star-attack", spinGear: "neo-right-sg-mw", supportPart: "over-attack", bladeBase: "sg-grip-change-base" },
  },
  {
    id: "dark-dragoon",
    name: "Dark Dragoon",
    generation: "plastic",
    parts: { attackRing: "dark-wing", weightDisk: "ten-wide", spinGear: "neo-right-sg-mw", supportPart: "survivor-ring", bladeBase: "customize-sharp-base" },
  },
  {
    id: "dark-driger",
    name: "Dark Driger",
    generation: "plastic",
    parts: { attackRing: "dark-wing", weightDisk: "ten-balance", spinGear: "neo-right-sg-mw", supportPart: "survivor-ring", bladeBase: "customize-sharp-base" },
  },
  {
    id: "dark-draciel",
    name: "Dark Draciel",
    generation: "plastic",
    parts: { attackRing: "dark-wing", weightDisk: "ten-heavy", spinGear: "neo-right-sg-mw", supportPart: "survivor-ring", bladeBase: "customize-sharp-base" },
  },
  {
    id: "dark-dranzer",
    name: "Dark Dranzer",
    generation: "plastic",
    parts: { attackRing: "dark-wing", weightDisk: "ten-wide", spinGear: "neo-right-sg-mw", supportPart: "survivor-ring", bladeBase: "customize-sharp-base" },
  },
  {
    id: "dark-gaia-dragoon",
    name: "Dark Gaia Dragoon",
    generation: "plastic",
    parts: { attackRing: "dark-wing", weightDisk: "ten-wide", spinGear: "neo-right-sg-mw", supportPart: "survivor-ring", bladeBase: "customize-sharp-base" },
  },
  {
    id: "orthrus",
    name: "Orthrus",
    generation: "plastic",
    parts: { attackRing: "double-attacker", weightDisk: "revolver-attack", spinGear: "neo-right-sg-mw", supportPart: "twin-guard", bladeBase: "sg-bolt-base" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 1 — Plastics: G Series (Engine Gear)
  // Slots: AR, WD, SG/EG, BB
  // ═══════════════════════════════════════════════════════════════════════════

  // --- G Series (10 beyblades) ---
  {
    id: "dragoon-g",
    name: "Dragoon G (Galaxy)",
    generation: "plastic",
    parts: { attackRing: "eight-spiker", weightDisk: "ten-wide", engineGear: "left-eg-msf", bladeBase: "first-clutch-base-dg" },
  },
  {
    id: "driger-g",
    name: "Driger G (Gatling)",
    generation: "plastic",
    parts: { attackRing: "triple-tiger", weightDisk: "ten-balance", engineGear: "right-eg-msf", bladeBase: "first-clutch-base-driger-g" },
  },
  {
    id: "metal-driger",
    name: "Metal Driger",
    generation: "plastic",
    parts: { attackRing: "cross-spiker", weightDisk: "ten-heavy", engineGear: "right-eg-msf", bladeBase: "first-clutch-base-metal-driger" },
  },
  {
    id: "rock-bison",
    name: "Rock Bison",
    generation: "plastic",
    parts: { attackRing: "double-horn", weightDisk: "ten-heavy", engineGear: "right-eg-circle-defenser", bladeBase: "normal-base-rock-bison" },
  },
  {
    id: "dranzer-g",
    name: "Dranzer G (Gigus)",
    generation: "plastic",
    parts: { attackRing: "wing-survivor", weightDisk: "ten-balance", engineGear: "right-eg-msf", bladeBase: "final-clutch-base-dranzer-g" },
  },
  {
    id: "wolborg-4",
    name: "Wolborg 4",
    generation: "plastic",
    parts: { attackRing: "star-wolf", weightDisk: "ten-wide", engineGear: "right-eg-circle-survivor", bladeBase: "normal-base-wolborg-4" },
  },
  {
    id: "draciel-g",
    name: "Draciel G (Gravity)",
    generation: "plastic",
    parts: { attackRing: "shield-hammer", weightDisk: "ten-wide", engineGear: "right-eg-metal-ball", bladeBase: "final-clutch-base-draciel-g" },
  },
  {
    id: "gaia-dragoon-g",
    name: "Gaia Dragoon G (Great)",
    generation: "plastic",
    parts: { attackRing: "dragon-saucer", weightDisk: "ten-heavy", engineGear: "right-eg-metal-flat", bladeBase: "final-clutch-base-gdg" },
  },
  {
    id: "flame-pegasus",
    name: "Flame Pegasus",
    generation: "plastic",
    parts: { attackRing: "wing-upper", engineGear: "gyro-eg", bladeBase: "engine-stopper-base", cew: "metal-sharp" },
  },
  {
    id: "desert-sphinxer",
    name: "Desert Sphinxer",
    generation: "plastic",
    parts: { attackRing: "ark-pyramid", weightDisk: "ten-wide", engineGear: "right-eg-mystery-cutter", bladeBase: "final-clutch-base-desert-sphinxer" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 1 — Plastics: GT Series (Engine Gear Turbo)
  // Slots: AR, WD, SG/EG, BB, CEW
  // ═══════════════════════════════════════════════════════════════════════════

  // --- GT Series (4 beyblades) ---
  {
    id: "dragoon-gt",
    name: "Dragoon GT",
    generation: "plastic",
    parts: { attackRing: "g-upper", weightDisk: "ten-wide", engineGear: "left-eg-turbo", bladeBase: "first-clutch-base-dgt", cew: "metal-grip" },
  },
  {
    id: "dranzer-gt",
    name: "Dranzer GT",
    generation: "plastic",
    parts: { attackRing: "triangle-wing", weightDisk: "ten-balance", engineGear: "right-eg-reverse", bladeBase: "final-clutch-base-dranzer-gt", cew: "metal-semi-flat" },
  },
  {
    id: "gigars",
    name: "Gigars",
    generation: "plastic",
    parts: { attackRing: "gigantic-claw", weightDisk: "ten-balance", engineGear: "right-cg-fac", bladeBase: "final-clutch-base-gigars", cew: "metal-change" },
  },
  {
    id: "zeus",
    name: "Zeus",
    generation: "plastic",
    parts: { attackRing: "holy-despell", weightDisk: "ten-wide", engineGear: "right-cg-free-shaft", bladeBase: "first-clutch-base-zeus", cew: "light-sharp" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 1 — HMS (Heavy Metal System)
  // Slots: AR, WD/CWD, RC, SP (optional)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- HMS (29 beyblades) ---
  {
    id: "gaia-dragoon-ms",
    name: "Gaia Dragoon MS",
    generation: "hms",
    parts: { attackRing: "metal-saucer", cwd: "circle-heavy", runningCore: "flat-core" },
  },
  {
    id: "driger-ms",
    name: "Driger MS",
    generation: "hms",
    parts: { attackRing: "metal-upper", cwd: "circle-balance", runningCore: "semi-flat-core" },
  },
  {
    id: "draciel-ms",
    name: "Draciel MS",
    generation: "hms",
    parts: { attackRing: "metal-shield", cwd: "circle-wide", runningCore: "sharp-core" },
  },
  {
    id: "dragoon-ms",
    name: "Dragoon MS",
    generation: "hms",
    parts: { attackRing: "metal-attacker", cwd: "circle-wide", runningCore: "grip-flat-core" },
  },
  {
    id: "dranzer-ms",
    name: "Dranzer MS",
    generation: "hms",
    parts: { attackRing: "spiral-upper", cwd: "circle-balance", runningCore: "manual-change-core" },
  },
  {
    id: "einstein-ms",
    name: "Einstein MS",
    generation: "hms",
    parts: { attackRing: "metal-spring", cwd: "circle-heavy", runningCore: "spring-core" },
  },
  {
    id: "dragoon-ms-uv",
    name: "Dragoon MS UV",
    generation: "hms",
    parts: { attackRing: "ultimate-attacker", cwd: "circle-wide", runningCore: "grip-flat-core-uv" },
  },
  {
    id: "death-gargoyle-ms",
    name: "Death Gargoyle MS",
    generation: "hms",
    parts: { attackRing: "circle-upper", cwd: "circle-heavy", runningCore: "metal-change-core" },
  },
  {
    id: "wolborg-ms",
    name: "Wolborg MS",
    generation: "hms",
    parts: { attackRing: "wolf-crusher", cwd: "circle-wide", runningCore: "bearing-core" },
  },
  {
    id: "thunder-dragon",
    name: "Thunder Dragon",
    generation: "hms",
    parts: { attackRing: "spark-dragon", cwd: "cwd-free-survivor", runningCore: "metal-weight-flat-core" },
  },
  {
    id: "sea-dragon",
    name: "Sea Dragon",
    generation: "hms",
    parts: { attackRing: "metal-ball-attacker", cwd: "cwd-defense-ring", runningCore: "metal-ball-core" },
  },
  {
    id: "wyvern-dj",
    name: "Wyvern DJ",
    generation: "hms",
    parts: { attackRing: "dj-spiker", cwd: "circle-balance", runningCore: "metal-sharp-core" },
  },
  {
    id: "advance-averazer",
    name: "Advance Averazer",
    generation: "hms",
    parts: { attackRing: "advance-balancer", cwd: "circle-balance", runningCore: "metal-semi-flat-core" },
  },
  {
    id: "advance-guardian",
    name: "Advance Guardian",
    generation: "hms",
    parts: { attackRing: "advance-defenser", cwd: "circle-heavy", runningCore: "grip-sharp-core" },
  },
  {
    id: "advance-striker",
    name: "Advance Striker",
    generation: "hms",
    parts: { attackRing: "advance-attacker", cwd: "circle-heavy", runningCore: "metal-flat-core" },
  },
  {
    id: "advance-eterner",
    name: "Advance Eterner",
    generation: "hms",
    parts: { attackRing: "advance-survivor", cwd: "circle-wide", runningCore: "metal-sharp-core" },
  },
  {
    id: "phantom-fox-ms",
    name: "Phantom Fox MS",
    generation: "hms",
    parts: { attackRing: "upper-fox", cwd: "cwd-circle-attacker", runningCore: "bunshin-core" },
  },
  {
    id: "slash-riger-ms",
    name: "Slash Riger MS",
    generation: "hms",
    parts: { attackRing: "slash-upper", cwd: "cwd-free-crusher", runningCore: "free-wing-core" },
  },
  {
    id: "dark-leopard-ms",
    name: "Dark Leopard MS",
    generation: "hms",
    parts: { attackRing: "smash-leopard", cwd: "cwd-needle-attacker", runningCore: "tornado-change-core" },
  },
  {
    id: "magical-ape-ms",
    name: "Magical Ape MS",
    generation: "hms",
    parts: { attackRing: "metal-ape", cwd: "circle-heavy", runningCore: "flat-core" },
  },
  {
    id: "round-shell-ms",
    name: "Round Shell MS",
    generation: "hms",
    parts: { attackRing: "turtle-crusher", runningCore: "rubber-weight-core" },
  },
  {
    id: "dragoon-mf",
    name: "Dragoon MF",
    generation: "hms",
    parts: { attackRing: "upper-dragon", cwd: "cwd-chain-attacker", runningCore: "metal-weight-grip-core" },
  },
  {
    id: "dranzer-mf",
    name: "Dranzer MF",
    generation: "hms",
    parts: { attackRing: "smash-phoenix", cwd: "cwd-wing-attacker", runningCore: "free-shaft-core" },
  },
  {
    id: "samurai-changer-ms",
    name: "Samurai Changer MS",
    generation: "hms",
    parts: { attackRing: "samurai-upper", cwd: "circle-heavy", runningCore: "battle-change-core" },
  },
  {
    id: "aero-knight-ms",
    name: "Aero Knight MS",
    generation: "hms",
    parts: { attackRing: "knight-crusher", cwd: "circle-wide", runningCore: "aero-core", supportPart: "aero-ring" },
  },
  {
    id: "jiraiya-ms",
    name: "Jiraiya MS",
    generation: "hms",
    parts: { attackRing: "jiraiya-blade", cwd: "cwd-free-cross", runningCore: "bearing-core-2" },
  },
  {
    id: "bloody-devil-ms",
    name: "Bloody Devil MS",
    generation: "hms",
    parts: { attackRing: "devil-crusher", cwd: "cwd-devil-saucer", runningCore: "shooter-change-core-alpha" },
  },
  {
    id: "shining-god-ms",
    name: "Shining God MS",
    generation: "hms",
    parts: { attackRing: "god-smasher", cwd: "cwd-god-ring", runningCore: "shooter-change-core-gamma" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 2 — Metal System (MFS, 4-Layer MFB)
  // Slots: Wheel, Track, Bottom (no Face Bolt or Clear Wheel)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- MFS (15 beyblades) ---
  {
    id: "pegasis-105f",
    name: "Pegasis 105F",
    generation: "mfs",
    parts: { wheel: "pegasis", track: "105", bottom: "flat" },
  },
  {
    id: "bull-125sf",
    name: "Bull 125SF",
    generation: "mfs",
    parts: { wheel: "bull", track: "125", bottom: "semi-flat" },
  },
  {
    id: "sagittario-145s",
    name: "Sagittario 145S",
    generation: "mfs",
    parts: { wheel: "sagittario", track: "145", bottom: "sharp" },
  },
  {
    id: "leone-145d",
    name: "Leone 145D",
    generation: "mfs",
    parts: { wheel: "leone", track: "145", bottom: "defense" },
  },
  {
    id: "wolf-d125b",
    name: "Wolf D125B",
    generation: "mfs",
    parts: { wheel: "wolf", track: "d125", bottom: "ball" },
  },
  {
    id: "aries-125d",
    name: "Aries 125D",
    generation: "mfs",
    parts: { wheel: "aries", track: "125", bottom: "defense" },
  },
  {
    id: "quetzalcoatl-90wf",
    name: "Quetzalcoatl 90WF",
    generation: "mfs",
    parts: { wheel: "quetzalcoatl", track: "90", bottom: "wide-flat" },
  },
  {
    id: "libra-df145bs",
    name: "Libra DF145BS",
    generation: "mfs",
    parts: { wheel: "libra", track: "df145", bottom: "ball-sharp" },
  },
  {
    id: "aquario-105f",
    name: "Aquario 105F",
    generation: "mfs",
    parts: { wheel: "aquario", track: "105", bottom: "flat" },
  },
  {
    id: "virgo-df145bs",
    name: "Virgo DF145BS",
    generation: "mfs",
    parts: { wheel: "virgo", track: "df145", bottom: "ball-sharp" },
  },
  {
    id: "pisces-d125bs",
    name: "Pisces D125BS",
    generation: "mfs",
    parts: { wheel: "pisces", track: "d125", bottom: "ball-sharp" },
  },
  {
    id: "l-drago-105f",
    name: "L Drago 105F",
    generation: "mfs",
    parts: { wheel: "l-drago", track: "105", bottom: "flat" },
  },
  {
    id: "escolpio-wd145b",
    name: "Escolpio WD145B",
    generation: "mfs",
    parts: { wheel: "escolpio", track: "wd145", bottom: "ball" },
  },
  {
    id: "gemios-df145fs",
    name: "Gemios DF145FS",
    generation: "mfs",
    parts: { wheel: "gemios", track: "df145", bottom: "flat-sharp" },
  },
  {
    id: "capricorne-100hf",
    name: "Capricorne 100HF",
    generation: "mfs",
    parts: { wheel: "capricorne", track: "100", bottom: "hole-flat" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 2 — Hybrid Wheel System (HWS, 5-Layer MFB)
  // Slots: Clear Wheel [C], Metal Wheel, Track, Bottom
  // Face Bolt omitted (cosmetic)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- HWS (45 beyblades) ---
  {
    id: "storm-pegasis-105rf",
    name: "Storm Pegasis 105RF",
    generation: "hws",
    parts: { clearWheel: "pegasis", metalWheel: "storm", track: "105", bottom: "rubber-flat" },
  },
  {
    id: "dark-wolf-df145fs",
    name: "Dark Wolf DF145FS",
    generation: "hws",
    parts: { clearWheel: "wolf", metalWheel: "dark", track: "df145", bottom: "flat-sharp" },
  },
  {
    id: "rock-leone-145wb",
    name: "Rock Leone 145WB",
    generation: "hws",
    parts: { clearWheel: "leone", metalWheel: "rock", track: "145", bottom: "wide-ball" },
  },
  {
    id: "mad-cancer-ch120fs",
    name: "Mad Cancer CH120FS",
    generation: "hws",
    parts: { clearWheel: "cancer", metalWheel: "mad", track: "ch120", bottom: "flat-sharp" },
  },
  {
    id: "flame-sagittario-c145s",
    name: "Flame Sagittario C145S",
    generation: "hws",
    parts: { clearWheel: "sagittario", metalWheel: "flame", track: "c145", bottom: "sharp" },
  },
  {
    id: "wind-aquario-100hf-s",
    name: "Wind Aquario 100HF/S",
    generation: "hws",
    parts: { clearWheel: "aquario", metalWheel: "wind", track: "100", bottom: "hole-flat" },
  },
  {
    id: "dark-bull-h145sd",
    name: "Dark Bull H145SD",
    generation: "hws",
    parts: { clearWheel: "bull", metalWheel: "dark", track: "h145", bottom: "semi-defense" },
  },
  {
    id: "lightning-l-drago-100hf",
    name: "Lightning L Drago 100HF",
    generation: "hws",
    parts: { clearWheel: "l-drago", metalWheel: "lightning", track: "100", bottom: "hole-flat" },
  },
  {
    id: "clay-aries-ed145b",
    name: "Clay Aries ED145B",
    generation: "hws",
    parts: { clearWheel: "aries", metalWheel: "clay", track: "ed145", bottom: "ball" },
  },
  {
    id: "earth-aquila-145wd",
    name: "Earth Aquila 145WD",
    generation: "hws",
    parts: { clearWheel: "aquila", metalWheel: "earth", track: "145", bottom: "wide-defense" },
  },
  {
    id: "flame-libra-t125es",
    name: "Flame Libra T125ES",
    generation: "hws",
    parts: { clearWheel: "libra", metalWheel: "flame", track: "t125", bottom: "eternal-sharp" },
  },
  {
    id: "storm-capricorne-m145q",
    name: "Storm Capricorne M145Q",
    generation: "hws",
    parts: { clearWheel: "capricorne", metalWheel: "storm", track: "m145", bottom: "quake" },
  },
  {
    id: "rock-orso-d125b",
    name: "Rock Orso D125B",
    generation: "hws",
    parts: { clearWheel: "orso", metalWheel: "rock", track: "d125", bottom: "ball" },
  },
  {
    id: "counter-leone-d125b",
    name: "Counter Leone D125B",
    generation: "hws",
    parts: { clearWheel: "leone", metalWheel: "counter", track: "d125", bottom: "ball" },
  },
  {
    id: "dark-cancer-ch120sf",
    name: "Dark Cancer CH120SF",
    generation: "hws",
    parts: { clearWheel: "cancer", metalWheel: "dark", track: "ch120", bottom: "semi-flat" },
  },
  {
    id: "killer-gemios-df145fs",
    name: "Killer Gemios DF145FS",
    generation: "hws",
    parts: { clearWheel: "gemios", metalWheel: "killer", track: "df145", bottom: "flat-sharp" },
  },
  {
    id: "thermal-pisces-t125es",
    name: "Thermal Pisces T125ES",
    generation: "hws",
    parts: { clearWheel: "pisces", metalWheel: "thermal", track: "t125", bottom: "eternal-sharp" },
  },
  {
    id: "cyber-pegasis-100hf",
    name: "Cyber Pegasis 100HF",
    generation: "hws",
    parts: { clearWheel: "pegasis", metalWheel: "cyber", track: "100", bottom: "hole-flat" },
  },
  {
    id: "burn-phoenix-135ms",
    name: "Burn Phoenix 135MS",
    generation: "hws",
    parts: { clearWheel: "phoenix", metalWheel: "burn", track: "135", bottom: "metal-sharp" },
  },
  {
    id: "earth-virgo-gb145bs",
    name: "Earth Virgo GB145BS",
    generation: "hws",
    parts: { clearWheel: "virgo", metalWheel: "earth", track: "gb145", bottom: "ball-sharp" },
  },
  {
    id: "rock-escolpio-t125jb",
    name: "Rock Escolpio T125JB",
    generation: "hws",
    parts: { clearWheel: "escolpio", metalWheel: "rock", track: "t125", bottom: "jog-ball" },
  },
  {
    id: "poison-serpent-sw145sd",
    name: "Poison Serpent SW145SD",
    generation: "hws",
    parts: { clearWheel: "serpent", metalWheel: "poison", track: "sw145", bottom: "semi-defense" },
  },
  {
    id: "galaxy-pegasis-w105r2f",
    name: "Galaxy Pegasis W105R²F",
    generation: "hws",
    parts: { clearWheel: "pegasis-ii", metalWheel: "galaxy", track: "w105", bottom: "r2f" },
  },
  {
    id: "ray-unicorno-d125cs",
    name: "Ray Unicorno D125CS",
    generation: "hws",
    parts: { clearWheel: "unicorno", metalWheel: "ray", track: "d125", bottom: "coat-sharp" },
  },
  {
    id: "thermal-lacerta-wa130hf",
    name: "Thermal Lacerta WA130HF",
    generation: "hws",
    parts: { clearWheel: "lacerta", metalWheel: "thermal", track: "wa130", bottom: "hole-flat" },
  },
  {
    id: "mercury-anubius-85xf",
    name: "Mercury Anubius 85XF",
    generation: "hws",
    parts: { clearWheel: "anubis", metalWheel: "mercury", track: "85", bottom: "extreme-flat" },
  },
  {
    id: "infinity-libra-gb145s",
    name: "Infinity Libra GB145S",
    generation: "hws",
    parts: { clearWheel: "libra", metalWheel: "infinity", track: "gb145", bottom: "sharp" },
  },
  {
    id: "rock-giraffe-r145wb",
    name: "Rock Giraffe R145WB",
    generation: "hws",
    parts: { clearWheel: "giraffe", metalWheel: "rock", track: "r145", bottom: "wide-ball" },
  },
  {
    id: "gravity-perseus-ad145wd",
    name: "Gravity Perseus AD145WD",
    generation: "hws",
    parts: { clearWheel: "perseus", metalWheel: "gravity", track: "ad145", bottom: "wide-defense" },
  },
  {
    id: "bakushin-susanow-90wf",
    name: "Bakushin Susanow 90WF",
    generation: "hws",
    parts: { clearWheel: "susanow", metalWheel: "bakushin", track: "90", bottom: "wide-flat" },
  },
  {
    id: "sol-blaze-v145as",
    name: "Sol Blaze V145AS",
    generation: "hws",
    parts: { clearWheel: "blaze", metalWheel: "sol", track: "v145", bottom: "around-sharp" },
  },
  {
    id: "vulcan-horuseus-145d",
    name: "Vulcan Horuseus 145D",
    generation: "hws",
    parts: { clearWheel: "horuseus", metalWheel: "vulcan", track: "145", bottom: "defense" },
  },
  {
    id: "grand-ketos-t125-wd145-rs",
    name: "Grand Ketos T125/WD145 RS",
    generation: "hws",
    parts: { clearWheel: "ketos", metalWheel: "grand", track: "t125", bottom: "rubber-sharp" },
  },
  {
    id: "poison-giraffe-s130mb",
    name: "Poison Giraffe S130MB",
    generation: "hws",
    parts: { clearWheel: "giraffe", metalWheel: "poison", track: "s130", bottom: "metal-ball" },
  },
  {
    id: "meteo-l-drago-lw105lf",
    name: "Meteo L Drago LW105LF",
    generation: "hws",
    parts: { clearWheel: "l-drago-ii", metalWheel: "meteo", track: "lw105", bottom: "left-flat" },
  },
  {
    id: "ray-gill-100rsf",
    name: "Ray Gill 100RSF",
    generation: "hws",
    parts: { clearWheel: "gill", metalWheel: "ray", track: "100", bottom: "rubber-semi-flat" },
  },
  {
    id: "tornado-herculeo-105f",
    name: "Tornado Herculeo 105F",
    generation: "hws",
    parts: { clearWheel: "heracleo", metalWheel: "tornado", track: "105", bottom: "flat" },
  },
  {
    id: "flame-byxis-230wd",
    name: "Flame Byxis 230WD",
    generation: "hws",
    parts: { clearWheel: "byxis", metalWheel: "flame", track: "230", bottom: "wide-defense" },
  },
  {
    id: "divine-chimera-tr145fb",
    name: "Divine Chimera TR145FB",
    generation: "hws",
    parts: { clearWheel: "chimera", metalWheel: "divine", track: "tr145", bottom: "flat-ball" },
  },
  {
    id: "nightmare-rex-sw145sd",
    name: "Nightmare Rex SW145SD",
    generation: "hws",
    parts: { clearWheel: "rex", metalWheel: "nightmare", track: "sw145", bottom: "semi-defense" },
  },
  {
    id: "killer-beafowl-uw145ewd",
    name: "Killer Beafowl UW145EWD",
    generation: "hws",
    parts: { clearWheel: "beafowl", metalWheel: "killer", track: "uw145", bottom: "ewd" },
  },
  {
    id: "hell-kerbecs-bd145ds",
    name: "Hell Kerbecs BD145DS",
    generation: "hws",
    parts: { clearWheel: "kerbecs", metalWheel: "hell", track: "bd145", bottom: "defense-sharp" },
  },
  {
    id: "screw-capricorne-90mf",
    name: "Screw Capricorne 90MF",
    generation: "hws",
    parts: { clearWheel: "capricorne", metalWheel: "screw", track: "90", bottom: "metal-flat" },
  },
  {
    id: "basalt-horogium-145wd",
    name: "Basalt Horogium 145WD",
    generation: "hws",
    parts: { clearWheel: "horogium", metalWheel: "basalt", track: "145", bottom: "wide-defense" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 2 — 4D System
  // Slots: 4D Clear Wheel [C], 4D Metal Wheel, Track, Bottom
  // Face Bolt omitted (cosmetic)
  // Some 4D beyblades have no Track (integrated into Metal Wheel)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- 4D (23 beyblades) ---
  {
    id: "big-bang-pegasis-fd",
    name: "Big Bang Pegasis F:D",
    generation: "4d",
    parts: { clearWheel: "pegasis-iii", metalWheel: "big-bang", bottom: "final-drive" },
  },
  {
    id: "fang-leone-130w2d",
    name: "Fang Leone 130W²D",
    generation: "4d",
    parts: { clearWheel: "leone-ii", metalWheel: "fang", track: "130", bottom: "wave-wide-defense" },
  },
  {
    id: "beat-lynx-th170wd",
    name: "Beat Lynx TH170WD",
    generation: "4d",
    parts: { clearWheel: "lynx", metalWheel: "beat", track: "th170", bottom: "wide-defense" },
  },
  {
    id: "l-drago-destroy-fs",
    name: "L Drago Destroy F:S",
    generation: "4d",
    parts: { metalWheel: "l-drago-destroy", bottom: "final-survive" },
  },
  {
    id: "scythe-kronos-t125eds",
    name: "Scythe Kronos T125EDS",
    generation: "4d",
    parts: { clearWheel: "kronos", metalWheel: "scythe", track: "t125", bottom: "eds" },
  },
  {
    id: "variares-dd",
    name: "VariAres D:D",
    generation: "4d",
    parts: { metalWheel: "variares", bottom: "delta-drive" },
  },
  {
    id: "jade-jupiter-s130rb",
    name: "Jade Jupiter S130RB",
    generation: "4d",
    parts: { clearWheel: "jupiter", metalWheel: "jade", track: "s130", bottom: "rubber-ball" },
  },
  {
    id: "forbidden-eonis-130d",
    name: "Forbidden Eonis 130D / ED145FB",
    generation: "4d",
    parts: { clearWheel: "eonis", metalWheel: "forbidden", track: "130", bottom: "defense" },
  },
  {
    id: "divine-hell-crown-tr145d",
    name: "Divine/Hell Crown TR145D / 130FB",
    generation: "4d",
    parts: { clearWheel: "crown", metalWheel: "divine", track: "tr145", bottom: "defense" },
  },
  {
    id: "screw-lyra-ed145mf",
    name: "Screw Lyra ED145MF",
    generation: "4d",
    parts: { clearWheel: "lyra", metalWheel: "screw", track: "ed145", bottom: "metal-flat" },
  },
  {
    id: "blitz-unicorno-100rsf",
    name: "Blitz Unicorno 100RSF",
    generation: "4d",
    parts: { clearWheel: "unicorno-ii", metalWheel: "blitz", track: "100", bottom: "rubber-semi-flat" },
  },
  {
    id: "phantom-orion-bd",
    name: "Phantom Orion B:D",
    generation: "4d",
    parts: { clearWheel: "orion", metalWheel: "phantom", bottom: "bearing-drive" },
  },
  {
    id: "death-quetzalcoatl-125rdf",
    name: "Death Quetzalcoatl 125RDF",
    generation: "4d",
    parts: { clearWheel: "quetzalcoatl", metalWheel: "death", track: "125", bottom: "rubber-defense-flat" },
  },
  {
    id: "duo-uranus-230wd",
    name: "Duo Uranus 230WD",
    generation: "4d",
    parts: { clearWheel: "uranus", metalWheel: "duo", track: "230", bottom: "wide-defense" },
  },
  {
    id: "l-drago-guardian-s130mb",
    name: "L Drago Guardian S130MB",
    generation: "4d",
    parts: { metalWheel: "l-drago-guardian", track: "s130", bottom: "metal-ball" },
  },
  {
    id: "wing-pegasis-90wf",
    name: "Wing Pegasis 90WF",
    generation: "4d",
    parts: { clearWheel: "pegasis-iii", metalWheel: "wing", track: "90", bottom: "wide-flat" },
  },
  {
    id: "diablo-nemesis-xd",
    name: "Diablo Nemesis X:D",
    generation: "4d",
    parts: { clearWheel: "nemesis", metalWheel: "diablo", bottom: "x-drive" },
  },
  {
    id: "fusion-hades-ad145swd",
    name: "Fusion Hades AD145SWD",
    generation: "4d",
    parts: { clearWheel: "hades", metalWheel: "fusion", track: "ad145", bottom: "sharp-wide-defense" },
  },
  {
    id: "bakushin-hell-beelzeb-t125xf",
    name: "Bakushin/Hell Beelzeb T125XF / 125XF",
    generation: "4d",
    parts: { clearWheel: "beelzeb", metalWheel: "bakushin", track: "t125", bottom: "extreme-flat" },
  },
  {
    id: "kreis-cygnus-145wd",
    name: "Kreis Cygnus 145WD",
    generation: "4d",
    parts: { clearWheel: "cygnus", metalWheel: "kreis", track: "145", bottom: "wide-defense" },
  },
  {
    id: "omega-dragonis-85xf",
    name: "Omega Dragonis 85XF",
    generation: "4d",
    parts: { clearWheel: "dragonis", metalWheel: "omega", track: "85", bottom: "extreme-flat" },
  },
  {
    id: "flash-sagittario-230wd",
    name: "Flash Sagittario 230WD",
    generation: "4d",
    parts: { clearWheel: "sagittario-ii", metalWheel: "flash", track: "230", bottom: "wide-defense" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gen 2 — Zero-G / Synchrome
  // Slots: Chrome Wheel(s), Crystal Wheel [C], Track, Bottom
  // Stone Face / Metal Stone Face omitted (cosmetic)
  // Synchrome beyblades have chromeWheel + chromeWheel2 (dual Chrome Wheels)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Zero-G (18 beyblades) ---
  {
    id: "samurai-ifraid-w145cf",
    name: "Samurai Ifraid W145CF",
    generation: "zero-g",
    parts: { chromeWheel: "ifraid", crystalWheel: "samurai", track: "w145", bottom: "circle-flat" },
  },
  {
    id: "shinobi-saramanda-sw145sd",
    name: "Shinobi Saramanda SW145SD",
    generation: "zero-g",
    parts: { chromeWheel: "saramanda", crystalWheel: "shinobi", track: "sw145", bottom: "semi-defense" },
  },
  {
    id: "pirates-orojya-145d",
    name: "Pirates Orojya 145D",
    generation: "zero-g",
    parts: { chromeWheel: "orojya", crystalWheel: "pirates", track: "145", bottom: "defense" },
  },
  {
    id: "thief-phoenic-e230gcf",
    name: "Thief Phoenic E230GCF",
    generation: "zero-g",
    parts: { chromeWheel: "phoenic", crystalWheel: "thief", track: "e230", bottom: "gear-circle-flat" },
  },
  {
    id: "guardian-revizer-160sb",
    name: "Guardian Revizer 160SB",
    generation: "zero-g",
    parts: { chromeWheel: "revizer", crystalWheel: "guardian", track: "160", bottom: "sharp-ball" },
  },
  {
    id: "archer-gryph-c145s",
    name: "Archer Gryph C145S",
    generation: "zero-g",
    parts: { chromeWheel: "gryph", crystalWheel: "archer", track: "c145", bottom: "sharp" },
  },
  {
    id: "pirates-killerken-a230jsb",
    name: "Pirates Killerken A230JSB",
    generation: "zero-g",
    parts: { chromeWheel: "killerken", crystalWheel: "pirates", track: "a230", bottom: "jog-sharp-ball" },
  },
  {
    id: "dark-knight-dragooon-lw160bsf",
    name: "Dark Knight Dragooon LW160BSF",
    generation: "zero-g",
    parts: { chromeWheel: "dragooon", crystalWheel: "dark-knight", track: "lw160", bottom: "blade-semi-flat" },
  },
  {
    id: "archer-gargole-sa165wsf",
    name: "Archer Gargole SA165WSF",
    generation: "zero-g",
    parts: { chromeWheel: "gargole", crystalWheel: "archer", track: "sa165", bottom: "wide-semi-flat" },
  },
  {
    id: "bandid-goreim-df145bs",
    name: "Bandid Goreim DF145BS",
    generation: "zero-g",
    parts: { chromeWheel: "goreim", crystalWheel: "bandid", track: "df145", bottom: "ball-sharp" },
  },
  {
    id: "berserker-begirados-sr200bwd",
    name: "Berserker Begirados SR200BWD",
    generation: "zero-g",
    parts: { chromeWheel: "begirados", crystalWheel: "berserker", track: "sr200", bottom: "big-wide-defense" },
  },
  {
    id: "bandid-genbull-f230tb",
    name: "Bandid Genbull F230TB",
    generation: "zero-g",
    parts: { chromeWheel: "genbull", crystalWheel: "bandid", track: "f230", bottom: "twin-ball" },
  },
  // --- Zero-G Synchrome (dual Chrome Wheels, no Crystal Wheel) ---
  {
    id: "gryph-girago-wa130hf",
    name: "Gryph Girago WA130HF",
    generation: "zero-g",
    parts: { chromeWheel: "girago", chromeWheel2: "gryph", track: "wa130", bottom: "hole-flat" },
  },
  {
    id: "saramanda-balro-df145swd",
    name: "Saramanda Balro DF145SWD",
    generation: "zero-g",
    parts: { chromeWheel: "balro", chromeWheel2: "saramanda", track: "df145", bottom: "sharp-wide-defense" },
  },
  {
    id: "killerken-balro-a230wb",
    name: "Killerken Balro A230WB",
    generation: "zero-g",
    parts: { chromeWheel: "balro", chromeWheel2: "killerken", track: "a230", bottom: "wide-ball" },
  },
  {
    id: "orojya-wyvang-145eds",
    name: "Orojya Wyvang 145EDS",
    generation: "zero-g",
    parts: { chromeWheel: "wyvang", chromeWheel2: "orojya", track: "145", bottom: "eds" },
  },
  {
    id: "samurai-pegasis-w105r2f",
    name: "Samurai Pegasis W105R²F",
    generation: "zero-g",
    parts: { chromeWheel: "pegasis", crystalWheel: "samurai", track: "w105", bottom: "r2f" },
  },
  {
    id: "gladiator-bahamdia-sp230gf",
    name: "Gladiator Bahamdia SP230GF",
    generation: "zero-g",
    parts: { chromeWheel: "bahamdia", crystalWheel: "gladiator", track: "sp230", bottom: "giga-flat" },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // GEN 3 — BURST SYSTEM (Layer / Disc / Frame / Driver)
  // ──────────────────────────────────────────────────────────────────────────

  // Xcalibur Lineage
  { id: "xeno-xcalibur-dl",     name: "Xeno Xcalibur DL.Magnum.Impact",       generation: "burst", parts: { layer: "xeno-xcalibur",    disc: "magnum",     driver: "impact" } },
  { id: "sieg-xcalibur-god",    name: "Sieg Xcalibur God.1.Iron",              generation: "burst", parts: { layer: "sieg-xcalibur",    disc: "1",          driver: "iron" } },
  { id: "buster-xcalibur-cz",   name: "Buster Xcalibur CZ.1'.Dagger.Sword",   generation: "burst", parts: { layer: "buster-xcalibur",  disc: "1-prime",    frame: "dagger",  driver: "sword" } },
  { id: "xiphoid-bu-xcalibur",  name: "Xiphoid BU Xcalibur.Xanthus.Sword'-1", generation: "burst", parts: { layer: "xiphoid-xcalibur", disc: "xanthus",    armor: "armor-1", driver: "sword-prime" } },

  // Valkyrie Lineage
  { id: "winning-valkyrie",       name: "Winning Valkyrie WV.12.V",              generation: "burst", parts: { layer: "winning-valkyrie",       disc: "12",          driver: "velocity" } },
  { id: "victory-valkyrie-god",   name: "Victory Valkyrie God.Boost.Variable",   generation: "burst", parts: { layer: "victory-valkyrie",       disc: "boost",        driver: "variable" } },
  { id: "god-valkyrie-god",       name: "God Valkyrie SGV.6.Vortex.UltimateReboot", generation: "burst", parts: { layer: "strike-god-valkyrie",   disc: "6",           frame: "vortex",     driver: "ultimate-reboot" } },
  { id: "cz-winning-valkyrie",    name: "Cho-Z Winning Valkyrie ChZWV.12Core.Volcanic", generation: "burst", parts: { layer: "cz-winning-valkyrie",  disc: "12-core",     driver: "volcanic" } },
  { id: "gt-slash-valkyrie",      name: "Slash Valkyrie Slash.Blitz.Power",       generation: "burst", parts: { layer: "slash-valkyrie",         disc: "blitz",        driver: "power" } },
  { id: "sk-brave-valkyrie",      name: "Brave Valkyrie Brave.Evolution'.2A",     generation: "burst", parts: { layer: "brave-valkyrie",         disc: "evolution-prime", driver: "2a" } },
  { id: "db-savior-valkyrie",     name: "Savior Valkyrie Shot-7",                generation: "burst", parts: { layer: "savior-valkyrie",        disc: "shot-7",       driver: "shot" } },
  { id: "bu-ultimate-valkyrie",   name: "Ultimate Valkyrie BU",                  generation: "burst", parts: { layer: "ultimate-valkyrie",      disc: "xanthus",      armor: "armor-0", driver: "ultimate" } },

  // Achilles Lineage
  { id: "z-achilles-cz",         name: "Z Achilles 11.Xtend+",                 generation: "burst", parts: { layer: "z-achilles",             disc: "11",          driver: "xtend-plus" } },
  { id: "cz-achilles",           name: "Cho-Z Achilles CZ.00.Xtend+",          generation: "burst", parts: { layer: "cz-achilles",            disc: "00",          driver: "xtend-plus" } },
  { id: "sk-infinite-achilles",  name: "Infinite Achilles Infinite.10.Atomic", generation: "burst", parts: { layer: "infinite-achilles",      disc: "10",          driver: "atomic" } },
  { id: "bu-zest-achilles",      name: "Zest Achilles BU.Prominence.Rise'-0",  generation: "burst", parts: { layer: "zest-achilles",          disc: "prominence",  armor: "armor-rise", driver: "rise-prime" } },

  // Kerbeus Lineage
  { id: "guardian-kerbeus-gt",   name: "Guardian Kerbeus GT.Gravity.Revolve",  generation: "burst", parts: { layer: "guardian-kerbeus",       disc: "gravity",     driver: "revolve" } },
  { id: "db-chain-kerbeus",      name: "DB Chain Kerbeus DB.Nexus.Rise'-0",    generation: "burst", parts: { layer: "chain-kerbeus",          disc: "nexus",       driver: "rise-prime" } },

  // Deathscyther Lineage
  { id: "dark-deathscyther-dl",       name: "Dark Deathscyther DL.Gravity.Blow",     generation: "burst", parts: { layer: "dark-deathscyther",      disc: "gravity",     driver: "blow" } },
  { id: "sk-hollow-deathscyther",     name: "Hollow Deathscyther SK.Nexus+.Destroy'",generation: "burst", parts: { layer: "hollow-deathscyther",    disc: "nexus-plus",  driver: "destroy-prime" } },

  // Diabolos Lineage
  { id: "gt-erase-diabolos",     name: "Erase Diabolos GT.0.Yard'",            generation: "burst", parts: { layer: "erase-diabolos",         disc: "0",           driver: "yard-prime" } },

  // Salamander / Forneus Lineage
  { id: "hell-salamander-sk",    name: "Hell Salamander SK.00.Bearing'",       generation: "burst", parts: { layer: "hell-salamander",        disc: "00",          driver: "bearing-prime" } },
  { id: "emperor-forneus-cz",    name: "Emperor Forneus CZ.Zenith.Orbit",      generation: "burst", parts: { layer: "emperor-forneus",        disc: "zenith",      driver: "orbit" } },

  // Bahamut / Lucifer Lineage
  { id: "db-roar-bahamut",       name: "Roar Bahamut DB.Nexus.Rise'-0",        generation: "burst", parts: { layer: "roar-bahamut",           disc: "nexus",       driver: "rise-prime" } },
  { id: "sk-the-end-lucifer",    name: "The End Lucifer SK.Mobius.Destroy",    generation: "burst", parts: { layer: "the-end-lucifer",        disc: "mobius",      driver: "destroy" } },
  { id: "db-barricade-lucifer",  name: "Barricade Lucifer DB.Over.Drift'",     generation: "burst", parts: { layer: "barricade-lucifer",      disc: "over",        driver: "drift-prime" } },

  // Dragon / Imperial Lineage
  { id: "gt-imperial-dragon",    name: "Imperial Dragon GT.0.Xtend+",          generation: "burst", parts: { layer: "imperial-dragon",        disc: "0",           driver: "xtend-plus" } },
  { id: "sk-tempest-dragon",     name: "Tempest Dragon SK.Nexus+.Xtreme'",     generation: "burst", parts: { layer: "tempest-dragon",         disc: "nexus-plus",  driver: "xtreme-prime" } },
  { id: "bu-gatling-dragon",     name: "Gatling Dragon BU.Xanthus.Charge'",    generation: "burst", parts: { layer: "gatling-dragon",         disc: "xanthus",     armor: "armor-charge", driver: "charge-prime" } },

  // Ragnaruk Lineage
  { id: "cz-crash-ragnaruk",     name: "Crash Ragnaruk CZ.0.Orbit",            generation: "burst", parts: { layer: "crash-ragnaruk",         disc: "0",           driver: "orbit" } },
  { id: "sk-glide-ragnaruk",     name: "Glide Ragnaruk SK.Nexus.Bearing",      generation: "burst", parts: { layer: "glide-ragnaruk",         disc: "nexus",       driver: "bearing" } },
  { id: "db-cyclone-ragnaruk",   name: "Cyclone Ragnaruk DB.Over.Drift'",      generation: "burst", parts: { layer: "cyclone-ragnaruk",       disc: "over",        driver: "drift-prime" } },

  // Longinus Lineage
  { id: "sk-rage-longinus",      name: "Rage Longinus SK.Mobius.Destroy'",     generation: "burst", parts: { layer: "rage-longinus",          disc: "mobius",      driver: "destroy-prime" } },

  // Belial Lineage
  { id: "db-dynamite-belial",    name: "Dynamite Belial DB.Nexus.Over'",       generation: "burst", parts: { layer: "dynamite-belial",        disc: "nexus",       driver: "over-prime" } },
  { id: "dangerous-belial",      name: "Dangerous Belial DB.Over.Rise'",       generation: "burst", parts: { layer: "dangerous-belial",       disc: "over",        driver: "rise-prime" } },
  { id: "bu-divine-belial",      name: "Divine Belial BU.Prominence.Destroy'-2", generation: "burst", parts: { layer: "divine-belial",        disc: "prominence",  armor: "armor-2", driver: "destroy-prime-2" } },

  // Wyvern Lineage
  { id: "god-tornado-wyvern",    name: "God Tornado Wyvern God.7.Destroy",     generation: "burst", parts: { layer: "god-wyvern",             disc: "7",           driver: "destroy" } },
  { id: "sk-jet-wyvern",         name: "Jet Wyvern SK.Over.Xtreme'",           generation: "burst", parts: { layer: "jet-wyvern",             disc: "over",        driver: "xtreme-prime" } },

  // ──────────────────────────────────────────────────────────────────────────
  // GEN 4 — BX / UX / CX SYSTEM (Blade / Ratchet / Bit)
  // ──────────────────────────────────────────────────────────────────────────

  { id: "shark-edge-3-60f",   name: "Shark Edge 3-60F",   generation: "bx", parts: { blade: "shark-edge",   ratchet: "3-60",  bit: "flat" } },
  { id: "cobalt-drake-4-60f", name: "Cobalt Drake 4-60F", generation: "bx", parts: { blade: "cobalt-drake", ratchet: "4-60",  bit: "flat" } },
  { id: "dran-buster-1-60a",  name: "Dran Buster 1-60A",  generation: "bx", parts: { blade: "dran-buster",  ratchet: "1-60",  bit: "atomic" } },
  { id: "dran-brave-s6-60v",  name: "Dran Brave S6-60V",  generation: "bx", parts: { blade: "dran-brave",   ratchet: "s6-60", bit: "variable" } },
];

// ─────────────────────────────────────────────────────────────────────────────
// Post-process: auto-fill displayName, description, archetype
// ─────────────────────────────────────────────────────────────────────────────

for (const sys of beybladeySystems) {
  if (!sys.displayName) sys.displayName = `${sys.name} (2.5D)`;
  if (!sys.archetype) sys.archetype = inferArchetype(sys.parts);
  if (!sys.description) {
    const gen = {
      plastic: 'Gen 1 Plastic',
      hms: 'HMS',
      mfs: 'MFS',
      hws: 'HWS',
      '4d': '4D',
      'zero-g': 'Zero-G',
      burst: 'Gen 3 Burst',
      bx: 'Gen 4 BX',
    }[sys.generation] || sys.generation;
    sys.description = `${gen} ${sys.archetype} beyblade — ${sys.name}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    console.log(`Seeding beyblade_systems collection (${beybladeySystems.length} assembled systems)...`);
    await clearCollection("beyblade_systems");

    // Batch writes (500 per batch)
    let batch = db.batch();
    let count = 0;
    for (const system of beybladeySystems) {
      batch.set(db.collection("beyblade_systems").doc(system.id), system);
      if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
    }
    if (count) await batch.commit();

    console.log(`\n✅ Beyblade systems seeded successfully (${beybladeySystems.length} assembled systems)!`);

    // Print summary by generation
    const byGen = {};
    for (const sys of beybladeySystems) {
      byGen[sys.generation] = (byGen[sys.generation] || 0) + 1;
    }
    console.log("\n  Generation breakdown:");
    for (const [gen, n] of Object.entries(byGen)) {
      console.log(`    ${gen}: ${n}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding beyblade systems:", error);
    process.exit(1);
  }
}

seed();

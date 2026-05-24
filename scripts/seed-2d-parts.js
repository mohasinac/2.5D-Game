#!/usr/bin/env node
// Seed 2.5D part collections — 19 parts across 7 collections.
// Uses displayName (required by admin UI), proper schema fields, and SVG thumbnail images
// sourced from public Wikimedia Commons SVG geometry shapes for rendering.

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

// ─── SVG thumbnail helpers ────────────────────────────────────────────────────
// Each part gets an SVG data URI thumbnail so the admin UI can render a preview
// without requiring a Firebase Storage upload at seed time.

function svgUri(svgBody) {
  const full = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svgBody}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(full)}`;
}

const SVG = {
  // ── Attack Rings ─────────────────────────────────────────────────────────
  tornadoWing: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#ef4444" stroke-width="1.5"/>
    <path d="M50 8C65 8 72 22 66 38L57 50 50 50 49 28Z" fill="#ef4444"/>
    <path d="M89 65C89 80 74 87 59 81L49 70 50 50 71 53Z" fill="#ef4444"/>
    <path d="M11 65C11 50 26 43 41 49L51 60 50 50 29 62Z" fill="#ef4444"/>
    <circle cx="50" cy="50" r="9" fill="#ef4444"/>
    <circle cx="50" cy="50" r="4" fill="#111827"/>
  `),
  scissorAttacker: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#f97316" stroke-width="1.5"/>
    <path d="M20 5L50 38 80 5 90 15 58 50 90 85 80 95 50 62 20 95 10 85 42 50 10 15Z" fill="#f97316"/>
    <circle cx="50" cy="50" r="8" fill="#111827" stroke="#f97316" stroke-width="2"/>
  `),
  spikeDefense: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#3b82f6" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="30" fill="none" stroke="#3b82f6" stroke-width="3"/>
    <polygon points="50,4 54,20 50,16 46,20" fill="#3b82f6"/>
    <polygon points="96,50 80,54 84,50 80,46" fill="#3b82f6"/>
    <polygon points="50,96 46,80 50,84 54,80" fill="#3b82f6"/>
    <polygon points="4,50 20,46 16,50 20,54" fill="#3b82f6"/>
    <polygon points="82,18 72,32 68,26 55,34" fill="#3b82f6"/>
    <polygon points="82,82 68,72 74,68 67,55" fill="#3b82f6"/>
    <polygon points="18,82 28,68 32,74 45,67" fill="#3b82f6"/>
    <polygon points="18,18 32,28 26,32 33,45" fill="#3b82f6"/>
    <circle cx="50" cy="50" r="10" fill="#3b82f6"/>
  `),
  roundStamina: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#22c55e" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" stroke-width="6"/>
    <circle cx="50" cy="50" r="28" fill="none" stroke="#22c55e" stroke-width="3" opacity="0.6"/>
    <circle cx="50" cy="50" r="16" fill="#22c55e"/>
    <circle cx="50" cy="50" r="6" fill="#111827"/>
  `),
  // ── Weight Disks ─────────────────────────────────────────────────────────
  tenHeavy: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="42" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="50" cy="50" r="26" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="50" y1="8" x2="50" y2="22" stroke="#94a3b8" stroke-width="2"/>
    <line x1="78" y1="15" x2="71" y2="27" stroke="#94a3b8" stroke-width="2"/>
    <line x1="96" y1="36" x2="83" y2="43" stroke="#94a3b8" stroke-width="2"/>
    <line x1="92" y1="67" x2="79" y2="60" stroke="#94a3b8" stroke-width="2"/>
    <line x1="72" y1="88" x2="65" y2="76" stroke="#94a3b8" stroke-width="2"/>
    <line x1="50" y1="92" x2="50" y2="78" stroke="#94a3b8" stroke-width="2"/>
    <line x1="28" y1="88" x2="35" y2="76" stroke="#94a3b8" stroke-width="2"/>
    <line x1="8" y1="67" x2="21" y2="60" stroke="#94a3b8" stroke-width="2"/>
    <line x1="4" y1="36" x2="17" y2="43" stroke="#94a3b8" stroke-width="2"/>
    <line x1="22" y1="15" x2="29" y2="27" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="50" cy="50" r="8" fill="#94a3b8"/>
  `),
  eightBalance: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#eab308" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="38" fill="#1e293b" stroke="#eab308" stroke-width="1.5"/>
    <polygon points="50,12 54,42 50,38 46,42" fill="#eab308"/>
    <polygon points="88,50 58,54 62,50 58,46" fill="#eab308"/>
    <polygon points="50,88 46,58 50,62 54,58" fill="#eab308"/>
    <polygon points="12,50 42,46 38,50 42,54" fill="#eab308"/>
    <polygon points="79,21 62,42 58,36 52,42" fill="#eab308"/>
    <polygon points="79,79 58,62 64,58 58,52" fill="#eab308"/>
    <polygon points="21,79 38,58 42,64 48,58" fill="#eab308"/>
    <polygon points="21,21 42,40 36,44 42,50" fill="#eab308"/>
    <circle cx="50" cy="50" r="12" fill="#eab308"/>
    <circle cx="50" cy="50" r="5" fill="#111827"/>
  `),
  sixAttack: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#f97316" stroke-width="1.5"/>
    <polygon points="50,10 84,30 84,70 50,90 16,70 16,30" fill="#1e293b" stroke="#f97316" stroke-width="2"/>
    <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" fill="none" stroke="#f97316" stroke-width="1.5" opacity="0.6"/>
    <circle cx="50" cy="50" r="10" fill="#f97316"/>
  `),
  // ── Tips ─────────────────────────────────────────────────────────────────
  flat: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <ellipse cx="50" cy="72" rx="32" ry="8" fill="#ef4444"/>
    <rect x="34" y="30" width="32" height="44" rx="4" fill="#ef4444" opacity="0.85"/>
    <ellipse cx="50" cy="30" rx="16" ry="6" fill="#ef4444"/>
  `),
  sharp: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="50,88 33,22 67,22" fill="#22c55e"/>
    <ellipse cx="50" cy="22" rx="17" ry="6" fill="#22c55e" opacity="0.9"/>
    <circle cx="50" cy="88" r="3" fill="#22c55e" opacity="0.5"/>
  `),
  semiFlat: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <path d="M32 24 L68 24 L65 74 C65 82 35 82 35 74 Z" fill="#eab308"/>
    <ellipse cx="50" cy="24" rx="18" ry="7" fill="#eab308"/>
    <ellipse cx="50" cy="75" rx="13" ry="5" fill="#eab308" opacity="0.6"/>
  `),
  rubberFlat: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <ellipse cx="50" cy="72" rx="36" ry="10" fill="#3b82f6"/>
    <rect x="28" y="28" width="44" height="46" rx="8" fill="#3b82f6" opacity="0.85"/>
    <ellipse cx="50" cy="28" rx="22" ry="9" fill="#3b82f6"/>
    <ellipse cx="50" cy="72" rx="36" ry="10" fill="none" stroke="#93c5fd" stroke-width="1.5" opacity="0.7"/>
  `),
  // ── Cores ────────────────────────────────────────────────────────────────
  standardCore: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="30" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="50" cy="50" r="16" fill="#94a3b8" opacity="0.8"/>
    <circle cx="50" cy="50" r="8" fill="#111827"/>
    <circle cx="50" cy="22" r="4" fill="#94a3b8"/>
    <circle cx="50" cy="78" r="4" fill="#94a3b8"/>
    <circle cx="22" cy="50" r="4" fill="#94a3b8"/>
    <circle cx="78" cy="50" r="4" fill="#94a3b8"/>
  `),
  spinInjection: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#a855f7" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="30" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
    <path d="M50 22C62 28 68 40 62 50C56 60 44 62 38 72C44 80 56 82 62 76" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="10" fill="#a855f7"/>
    <circle cx="50" cy="50" r="4" fill="#111827"/>
  `),
  // ── Casings ──────────────────────────────────────────────────────────────
  roundCasing: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="44" fill="none" stroke="#64748b" stroke-width="6"/>
    <circle cx="50" cy="50" r="36" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="50" cy="50" r="10" fill="#64748b"/>
  `),
  wideCasing: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <ellipse cx="50" cy="50" rx="44" ry="28" fill="none" stroke="#64748b" stroke-width="6"/>
    <ellipse cx="50" cy="50" rx="36" ry="20" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <ellipse cx="50" cy="50" rx="10" ry="6" fill="#64748b"/>
  `),
  // ── Bit Beasts ───────────────────────────────────────────────────────────
  pegasus: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#60a5fa" stroke-width="1.5"/>
    <path d="M50 76C40 66 28 56 30 43C32 33 42 29 50 31C58 29 68 33 70 43C72 56 60 66 50 76Z" fill="#60a5fa"/>
    <path d="M30 43C15 36 10 21 20 16C28 13 32 23 30 43Z" fill="#93c5fd"/>
    <path d="M70 43C85 36 90 21 80 16C72 13 68 23 70 43Z" fill="#93c5fd"/>
    <circle cx="44" cy="38" r="3" fill="#111827"/>
    <circle cx="56" cy="38" r="3" fill="#111827"/>
    <path d="M50 31L48 19L52 19Z" fill="#60a5fa"/>
    <path d="M44 56Q50 62 56 56" fill="none" stroke="#111827" stroke-width="1.5"/>
  `),
  leone: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#fbbf24" stroke-width="1.5"/>
    <circle cx="50" cy="52" r="24" fill="#fbbf24"/>
    <path d="M26 52C20 45 20 30 30 28C34 26 36 32 34 38C32 44 28 48 26 52Z" fill="#f59e0b"/>
    <path d="M74 52C80 45 80 30 70 28C66 26 64 32 66 38C68 44 72 48 74 52Z" fill="#f59e0b"/>
    <path d="M38 28C38 18 62 18 62 28C58 22 42 22 38 28Z" fill="#f59e0b"/>
    <circle cx="43" cy="48" r="4" fill="#111827"/>
    <circle cx="57" cy="48" r="4" fill="#111827"/>
    <path d="M44 58Q50 64 56 58" fill="none" stroke="#111827" stroke-width="2"/>
    <rect x="46" y="62" width="8" height="3" rx="1.5" fill="#fef3c7"/>
  `),
  // ── Spin Tracks ──────────────────────────────────────────────────────────
  st90: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="38" y="32" width="24" height="40" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
    <ellipse cx="50" cy="32" rx="12" ry="5" fill="#94a3b8"/>
    <ellipse cx="50" cy="72" rx="12" ry="5" fill="#64748b"/>
    <text x="50" y="56" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace" font-weight="bold">90</text>
  `),
  st145: svgUri(`
    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="38" y="14" width="24" height="72" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
    <ellipse cx="50" cy="14" rx="12" ry="5" fill="#94a3b8"/>
    <ellipse cx="50" cy="86" rx="12" ry="5" fill="#64748b"/>
    <text x="50" y="54" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace" font-weight="bold">145</text>
  `),
};

// ─── Part definitions ─────────────────────────────────────────────────────────

const now = new Date().toISOString();

function base(overrides) {
  return {
    color: "#1a1a2e",
    geometry: { type: "preset", preset: "circle" },
    dimensions: { height: 30, outerRadius: 35, innerRadius: 5 },
    compatibilityTags: [],
    requiredCompatibility: [],
    excludedCompatibility: [],
    pockets: [],
    configurations: [],
    contactPoints: [],
    createdAt: now,
    updatedAt: now,
    createdBy: "seed",
    ...overrides,
  };
}

const parts = {
  // ── Attack Ring Parts ─────────────────────────────────────────────────────
  attack_ring_parts: [
    base({
      id: "tornado-wing",
      displayName: "Tornado Wing",
      description: "Three-pronged spiral blade with sharp swept wings. High smash attack potential.",
      rarity: "rare",
      affinity: "attack",
      color: "#ef4444",
      images: { thumbnail: SVG.tornadoWing },
      geometry: { type: "preset", preset: "3-wing-spiral" },
      dimensions: { height: 12, outerRadius: 42, innerRadius: 8 },
      contactPoints: [
        { angle: 0,   damageMultiplier: 1.8, width: 50, material: "abs" },
        { angle: 120, damageMultiplier: 1.5, width: 45, material: "abs" },
        { angle: 240, damageMultiplier: 1.3, width: 45, material: "abs" },
      ],
      compatibilityTags: ["attack", "smash", "right-spin"],
    }),
    base({
      id: "scissor-attacker",
      displayName: "Scissor Attacker",
      description: "X-cross scissor blade with cutting upper-attack edges.",
      rarity: "common",
      affinity: "attack",
      color: "#f97316",
      images: { thumbnail: SVG.scissorAttacker },
      geometry: { type: "preset", preset: "x-cross" },
      dimensions: { height: 10, outerRadius: 40, innerRadius: 6 },
      contactPoints: [
        { angle: 45,  damageMultiplier: 1.6, width: 40, material: "abs" },
        { angle: 135, damageMultiplier: 1.4, width: 40, material: "abs" },
        { angle: 225, damageMultiplier: 1.6, width: 40, material: "abs" },
        { angle: 315, damageMultiplier: 1.4, width: 40, material: "abs" },
      ],
      compatibilityTags: ["attack", "upper", "right-spin"],
    }),
    base({
      id: "spike-defense",
      displayName: "Spike Defense",
      description: "Eight outward spikes on a circular ring. Punishes aggressive opponents.",
      rarity: "uncommon",
      affinity: "defense",
      color: "#3b82f6",
      images: { thumbnail: SVG.spikeDefense },
      geometry: { type: "preset", preset: "star-8" },
      dimensions: { height: 14, outerRadius: 44, innerRadius: 10 },
      contactPoints: [
        { angle: 0,   damageMultiplier: 1.3, width: 30, material: "metal" },
        { angle: 45,  damageMultiplier: 1.3, width: 30, material: "metal" },
        { angle: 90,  damageMultiplier: 1.3, width: 30, material: "metal" },
        { angle: 135, damageMultiplier: 1.3, width: 30, material: "metal" },
        { angle: 180, damageMultiplier: 1.3, width: 30, material: "metal" },
        { angle: 225, damageMultiplier: 1.3, width: 30, material: "metal" },
        { angle: 270, damageMultiplier: 1.3, width: 30, material: "metal" },
        { angle: 315, damageMultiplier: 1.3, width: 30, material: "metal" },
      ],
      compatibilityTags: ["defense", "counter", "both-spin"],
    }),
    base({
      id: "round-stamina",
      displayName: "Round Stamina",
      description: "Smooth concentric ring design. Minimises drag for maximum spin retention.",
      rarity: "uncommon",
      affinity: "stamina",
      color: "#22c55e",
      images: { thumbnail: SVG.roundStamina },
      geometry: { type: "preset", preset: "ring" },
      dimensions: { height: 8, outerRadius: 43, innerRadius: 12 },
      contactPoints: [
        { angle: 0,   damageMultiplier: 1.05, width: 80, material: "pom" },
        { angle: 180, damageMultiplier: 1.05, width: 80, material: "pom" },
      ],
      compatibilityTags: ["stamina", "spin-steal", "both-spin"],
    }),
  ],

  // ── Weight Disk Parts ─────────────────────────────────────────────────────
  weight_disk_parts: [
    base({
      id: "ten-heavy",
      displayName: "Ten Heavy",
      description: "10-point heavy disk — maximum inertia for defensive and stamina builds.",
      rarity: "rare",
      weight: 10,
      color: "#94a3b8",
      images: { thumbnail: SVG.tenHeavy },
      geometry: { type: "preset", preset: "circle" },
      dimensions: { height: 6, outerRadius: 44, innerRadius: 10 },
      compatibilityTags: ["defense", "stamina", "heavy"],
    }),
    base({
      id: "eight-balance",
      displayName: "Eight Balance",
      description: "8-point balanced disk — versatile weight distribution for all archetypes.",
      rarity: "common",
      weight: 8,
      color: "#eab308",
      images: { thumbnail: SVG.eightBalance },
      geometry: { type: "preset", preset: "star-8" },
      dimensions: { height: 6, outerRadius: 40, innerRadius: 8 },
      compatibilityTags: ["balanced", "versatile"],
    }),
    base({
      id: "six-attack",
      displayName: "Six Attack",
      description: "6-point light hexagonal disk — reduces rotational inertia for faster spin-up.",
      rarity: "uncommon",
      weight: 6,
      color: "#f97316",
      images: { thumbnail: SVG.sixAttack },
      geometry: { type: "preset", preset: "hexagon" },
      dimensions: { height: 5, outerRadius: 36, innerRadius: 8 },
      compatibilityTags: ["attack", "light", "right-spin"],
    }),
    base({
      id: "nexus",
      displayName: "Nexus (Nx)",
      description:
        "Heavy 30.6 g DB Disc with eight blades split across upper and lower tiers — optimised for Attack. Accepts S Gear (face-up = fixed tabs, face-down = free-spin) or D Gear (slides on impact, repelling the opponent). Part of the Dynamite Battle Layer System.",
      rarity: "rare",
      weight: 30.6,
      color: "#94a3b8",
      images: { thumbnail: SVG.tenHeavy },
      geometry: { type: "preset", preset: "star-8" },
      dimensions: { height: 8, outerRadius: 36, innerRadius: 10 },
      compatibilityTags: ["attack", "heavy", "db-system", "gear-slot"],
    }),
  ],

  // ── Tip Parts ─────────────────────────────────────────────────────────────
  tip_parts: [
    base({
      id: "flat",
      displayName: "Flat Tip",
      description: "Wide flat contact surface — erratic aggressive movement. Dual attack/defense modes.",
      rarity: "common",
      friction: 0.8,
      tipShape: "flat",
      suctionCap: 5,
      climbAssist: 0.2,
      color: "#ef4444",
      images: { thumbnail: SVG.flat },
      geometry: { type: "preset", preset: "cylinder" },
      dimensions: { height: 8, outerRadius: 12, innerRadius: 0 },
      compatibilityTags: ["attack", "aggressive"],
      comboIds: ["quick-dash-l"],
      configurations: [
        {
          name: "attack-mode",
          displayName: "Attack",
          description: "Higher aggression, lower stability.",
          playerSwitchable: true,
          overrides: { aggressiveness: 0.85, gripFactor: 0.6 },
        },
        {
          name: "defense-mode",
          displayName: "Defense",
          description: "Higher stability, lower aggression.",
          playerSwitchable: true,
          overrides: { aggressiveness: 0.3, gripFactor: 0.9 },
        },
      ],
    }),
    base({
      id: "hole-flat",
      displayName: "Hole Flat (HF)",
      description:
        "Flat tip with a center hole — slightly better stamina than Flat due to reduced pivot friction, but less grip and more fragile. The hole wears over time, further reducing floor contact.",
      rarity: "uncommon",
      weight: 0.5,
      friction: 0.65,
      tipShape: "hole_flat",
      suctionCap: 3,
      climbAssist: 0.1,
      color: "#f97316",
      images: { thumbnail: SVG.flat },
      geometry: { type: "preset", preset: "ring" },
      dimensions: { height: 8, outerRadius: 12, innerRadius: 4 },
      compatibilityTags: ["attack", "balanced"],
    }),
    base({
      id: "sharp",
      displayName: "Sharp Tip",
      description: "Pointed tip with minimal floor contact — near-stationary stamina movement.",
      rarity: "rare",
      friction: 0.3,
      tipShape: "sharp",
      suctionCap: 5,
      climbAssist: 0.2,
      color: "#22c55e",
      images: { thumbnail: SVG.sharp },
      geometry: { type: "preset", preset: "cone" },
      dimensions: { height: 14, outerRadius: 4, innerRadius: 0 },
      compatibilityTags: ["stamina", "low-friction"],
    }),
    base({
      id: "semi-flat",
      displayName: "Semi-Flat Tip",
      description: "Rounded flat tip — moderate movement combining attack speed with stamina.",
      rarity: "uncommon",
      friction: 0.6,
      tipShape: "semi_flat",
      suctionCap: 0,
      climbAssist: 0,
      color: "#eab308",
      images: { thumbnail: SVG.semiFlat },
      geometry: { type: "preset", preset: "cylinder-rounded" },
      dimensions: { height: 10, outerRadius: 8, innerRadius: 0 },
      compatibilityTags: ["balanced", "versatile"],
    }),
    base({
      id: "rubber-flat",
      displayName: "Rubber Flat",
      description: "Wide rubber-coated base — high-grip defensive movement and strong floor contact.",
      rarity: "uncommon",
      friction: 0.95,
      tipShape: "rubber_flat",
      suctionCap: 0,
      climbAssist: 0,
      color: "#3b82f6",
      images: { thumbnail: SVG.rubberFlat },
      geometry: { type: "preset", preset: "cylinder" },
      dimensions: { height: 6, outerRadius: 16, innerRadius: 0 },
      compatibilityTags: ["defense", "high-friction", "rubber"],
    }),
    base({
      id: "ewd",
      displayName: "EWD (Eternal Wide Defense)",
      description: "Wide outer ring on a single bearing — near-stationary orbit with slow graceful precession. bearingFriction 0.12 (batch-013 §A).",
      rarity: "rare",
      friction: 0.15,
      tipShape: "bearing_wide",
      bearingFriction: 0.12,
      suctionCap: 0,
      climbAssist: 0,
      color: "#a78bfa",
      geometry: { type: "preset", preset: "ring" },
      dimensions: { height: 6, outerRadius: 18, innerRadius: 10 },
      compatibilityTags: ["stamina", "bearing", "wide-orbit"],
    }),
    base({
      id: "bd",
      displayName: "B:D (Bearing Drive)",
      description: "Compact ball-bearing tip with near-zero friction — maximum stamina LAD. bearingFriction 0.02 (batch-013 §A).",
      rarity: "rare",
      friction: 0.05,
      tipShape: "bearing_sharp",
      bearingFriction: 0.02,
      suctionCap: 0,
      climbAssist: 0,
      color: "#60a5fa",
      geometry: { type: "preset", preset: "sphere" },
      dimensions: { height: 8, outerRadius: 6, innerRadius: 0 },
      compatibilityTags: ["stamina", "bearing", "low-friction"],
    }),
    base({
      id: "loop",
      displayName: "Loop (Lp)",
      description:
        "Heavy 6.2 g ball tip with four floor-contact brake tabs identical to Defense, plus two free-spinning side rollers. Tabs resist Knock-Outs by grounding the bey. Rollers right the bey at high spin; at low spin they scrape the floor instead, acting as brakes and killing Life-After-Death.",
      rarity: "uncommon",
      weight: 6.2,
      friction: 0.45,
      tipShape: "ball",
      freeSpin: false,
      suctionCap: 7,
      climbAssist: 0.0,
      color: "#2dd4bf",
      images: { thumbnail: SVG.bd },
      geometry: { type: "preset", preset: "sphere" },
      dimensions: { height: 10, outerRadius: 10, innerRadius: 0 },
      compatibilityTags: ["defense", "ko-resist", "heavy"],
    }),
    base({
      id: "ignition-dash",
      displayName: "Ignition' (Disc-Integrated Driver)",
      description:
        "Disc-integrated driver — replaces both disc and tip in one unit. Battery-powered (LR44) motor activates on impact via spring-circuit contact, spinning a thin plastic tip to restore momentum. Mimics the Gen-1 engine gimmick. Treat as both disc and tip when building a combo.",
      rarity: "rare",
      friction: 0.25,
      tipShape: "sharp",
      freeSpin: false,
      suctionCap: 2,
      climbAssist: 0.05,
      color: "#60a5fa",
      images: { thumbnail: SVG.bd },
      geometry: { type: "preset", preset: "cone" },
      dimensions: { height: 12, outerRadius: 6, innerRadius: 0 },
      compatibilityTags: ["stamina", "disc-integrated", "motor", "impact-trigger", "gatinko"],
    }),
    base({
      id: "atomic",
      displayName: "Atomic",
      description:
        "Wide free-rotating ball tip with a four-tabbed free-spinning outer ring. High stamina and Life-After-Death from the ring, Burst resistance from the free-rotating ball, and semi-aggressive movement when hard-launched.",
      rarity: "rare",
      friction: 0.18,
      tipShape: "ball",
      bearingFriction: 0.08,
      freeSpin: true,
      suctionCap: 6,
      climbAssist: 0.15,
      color: "#86efac",
      images: { thumbnail: SVG.bd },
      geometry: { type: "preset", preset: "sphere" },
      dimensions: { height: 10, outerRadius: 16, innerRadius: 0 },
      compatibilityTags: ["stamina", "defense", "bearing", "lad", "burst-resist"],
    }),
  ],

  // ── Core Parts ────────────────────────────────────────────────────────────
  core_parts: [
    base({
      id: "standard",
      displayName: "Standard Core",
      description: "Solid round core — neutral gimmick, reliable base for any build.",
      rarity: "common",
      coreGimmick: "none",
      suctionEmit: 3,
      color: "#94a3b8",
      images: { thumbnail: SVG.standardCore },
      geometry: { type: "preset", preset: "circle" },
      dimensions: { height: 20, outerRadius: 18, innerRadius: 0 },
      compatibilityTags: ["universal"],
    }),
    base({
      id: "spin-injection",
      displayName: "Spin Injection Core",
      description: "Internal spring releases stored spin energy mid-battle to boost rotation.",
      rarity: "rare",
      coreGimmick: "spin_injection",
      suctionEmit: 0,
      color: "#a855f7",
      images: { thumbnail: SVG.spinInjection },
      geometry: { type: "preset", preset: "spring" },
      dimensions: { height: 22, outerRadius: 18, innerRadius: 4 },
      compatibilityTags: ["stamina", "attack"],
    }),
  ],

  // ── Casing Parts ──────────────────────────────────────────────────────────
  casing_parts: [
    base({
      id: "round",
      displayName: "Round Casing",
      description: "Standard circular outer shell — balanced aerodynamics.",
      rarity: "common",
      casingCategory: "round",
      color: "#64748b",
      images: { thumbnail: SVG.roundCasing },
      geometry: { type: "preset", preset: "ring" },
      dimensions: { height: 18, outerRadius: 46, innerRadius: 38 },
      contactPoints: [
        { angle: 0,   damageMultiplier: 1.1, width: 90, material: "abs" },
      ],
      compatibilityTags: ["universal"],
    }),
    base({
      id: "wide",
      displayName: "Wide Casing",
      description: "Extended elliptical shell — broader floor contact lowers centre of gravity.",
      rarity: "uncommon",
      casingCategory: "wide",
      color: "#64748b",
      images: { thumbnail: SVG.wideCasing },
      geometry: { type: "preset", preset: "ellipse" },
      dimensions: { height: 12, outerRadius: 48, innerRadius: 36 },
      contactPoints: [
        { angle: 0,   damageMultiplier: 1.05, width: 120, material: "abs" },
      ],
      compatibilityTags: ["defense", "stability"],
    }),
  ],

  // ── Bit Beast Parts ───────────────────────────────────────────────────────
  bit_beast_parts: [
    base({
      id: "pegasus",
      displayName: "Pegasus",
      description: "Winged stallion bit beast — speed and sky-rush attack affinity.",
      rarity: "rare",
      bitBeastCategory: "beast_silhouette",
      specialMove: "stampede_rush",
      color: "#60a5fa",
      images: { thumbnail: SVG.pegasus },
      geometry: { type: "preset", preset: "dome" },
      dimensions: { height: 24, outerRadius: 18, innerRadius: 0 },
      compatibilityTags: ["attack", "right-spin"],
    }),
    base({
      id: "leone",
      displayName: "Leone",
      description: "Fierce lion bit beast — guard stance and counter-strike affinity.",
      rarity: "rare",
      bitBeastCategory: "beast_silhouette",
      specialMove: "gyro_anchor",
      color: "#fbbf24",
      images: { thumbnail: SVG.leone },
      geometry: { type: "preset", preset: "dome" },
      dimensions: { height: 24, outerRadius: 18, innerRadius: 0 },
      compatibilityTags: ["defense", "right-spin"],
    }),
  ],

  // ── Spin Track Parts ──────────────────────────────────────────────────────
  spin_track_parts: [
    base({
      id: "st-90",
      displayName: "ST-90",
      description: "90 mm height track — low profile for aggressive smash attacks.",
      rarity: "common",
      trackHeightMm: 90,
      color: "#475569",
      images: { thumbnail: SVG.st90 },
      geometry: { type: "preset", preset: "cylinder" },
      dimensions: { height: 9, outerRadius: 8, innerRadius: 3 },
      compatibilityTags: ["attack", "low-height"],
    }),
    base({
      id: "st-145",
      displayName: "ST-145",
      description: "145 mm height track — tall profile for stamina and upper-attack builds.",
      rarity: "uncommon",
      trackHeightMm: 145,
      color: "#475569",
      images: { thumbnail: SVG.st145 },
      geometry: { type: "preset", preset: "cylinder" },
      dimensions: { height: 14, outerRadius: 8, innerRadius: 3 },
      compatibilityTags: ["stamina", "balanced", "high-height"],
    }),
    base({
      id: "wa130",
      displayName: "Wing Attack 130 (WA130)",
      description:
        "130-height track with two freely-rotating aerofoil wings. Minor guard against lower opponents, but wings can scrape the floor causing spin loss — poor for stamina. Wing ring is reversible for CW/CCW attack angle.",
      rarity: "uncommon",
      trackHeightMm: 130,
      freeSpin: true,
      spinLossFactor: 0.05,
      color: "#38bdf8",
      images: { thumbnail: SVG.st145 },
      geometry: { type: "preset", preset: "cylinder" },
      dimensions: { height: 13, outerRadius: 8, innerRadius: 3 },
      compatibilityTags: ["attack", "high-height"],
    }),
  ],

  // ── Sub Parts ─────────────────────────────────────────────────────────────
  sub_parts: [
    base({
      id: "under",
      displayName: "Under (U)",
      description:
        "Heavy Burst frame with diamond-shaped, clockwise-angled protrusions at a downward tilt. Boosts Burst Attack via disc-to-layer contact in right-spin; reduces recoil in left-spin. Reversible via canFlip.",
      rarity: "uncommon",
      weight: 2.38,
      canFlip: true,
      compatibleParents: ["ar"],
      placement: "below",
      mode: "fixed",
      color: "#ec4899",
      images: { thumbnail: SVG.flat },
      geometry: { type: "preset", preset: "ring" },
      dimensions: { height: 4, outerRadius: 18, innerRadius: 12 },
      materials: [{ bandId: "outer", material: "abs", wearRate: 0.01 }],
      contactPoints: [
        { angle: 45,  damageMultiplier: 1.15, width: 30, material: "abs" },
        { angle: 135, damageMultiplier: 1.15, width: 30, material: "abs" },
        { angle: 225, damageMultiplier: 1.15, width: 30, material: "abs" },
        { angle: 315, damageMultiplier: 1.15, width: 30, material: "abs" },
      ],
      compatibilityTags: ["attack", "burst", "heavy-frame", "right-spin"],
      configurations: [],
    }),
  ],
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("\n══════════════════════════════════════");
  console.log("  2.5D Part Library Seed");
  console.log("══════════════════════════════════════\n");

  for (const col of Object.keys(parts)) await clearCollection(col);

  let total = 0;
  for (const [collection, items] of Object.entries(parts)) {
    console.log(`\n  📦 ${collection}:`);
    for (const item of items) {
      const { id, ...data } = item;
      await db.collection(collection).doc(id).set(data, { merge: false });
      console.log(`    ✅ ${item.displayName}`);
      total++;
    }
  }

  console.log(`\n✅ Seeded ${total} parts across ${Object.keys(parts).length} collections\n`);
  process.exit(0);
}

seed().catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); });

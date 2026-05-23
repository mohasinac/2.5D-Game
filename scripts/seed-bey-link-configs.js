// scripts/seed-bey-link-configs.js
// Seeds BeyLink and ArenaLink type catalog to Firestore `bey_link_configs`.
// Used by the arena editor LinksTab to populate SearchableSelect. Idempotent.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars.");
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

const LINK_TYPES = [
  { id: "corridor",    label: "Corridor",    description: "A straight passageway between two arena sections.",   color: "#3b82f6", category: "link_type" },
  { id: "portal",      label: "Portal",      description: "Instant teleport between two arena positions.",       color: "#a855f7", category: "link_type" },
  { id: "ramp",        label: "Ramp",        description: "Sloped surface connecting different elevation zones.",color: "#f97316", category: "link_type" },
  { id: "pit",         label: "Pit",         description: "A drop-down pit connecting to a lower arena zone.",   color: "#64748b", category: "link_type" },
  { id: "trampoline",  label: "Trampoline",  description: "Launch pad that propels beyblades across gaps.",     color: "#eab308", category: "link_type" },
];

const REVERSE_CONDITIONS = [
  { id: "always",        label: "Always",            description: "Link always allows reverse travel.",          category: "reverse_condition" },
  { id: "never",         label: "Never",             description: "Link is one-way only.",                       category: "reverse_condition" },
  { id: "spin_above_50", label: "Spin Above 50%",    description: "Reverse allowed only when spin > 50%.",       category: "reverse_condition" },
];

const BEY_LINK_TYPES = [
  { id: "tip_stack",   label: "Tip Stack",   description: "Beyblades stack tip-to-tip in vertical contact.",    color: "#ef4444", category: "bey_link_type" },
  { id: "top_mount",   label: "Top Mount",   description: "One beyblade rides on top of another.",              color: "#3b82f6", category: "bey_link_type" },
  { id: "side_spin",   label: "Side Spin",   description: "Beyblades orbit each other in a spinning pair.",     color: "#10b981", category: "bey_link_type" },
];

const ALIGNMENTS = [
  { id: "friendly",  label: "Friendly",  description: "Link effects apply to teammates.",                   color: "#10b981", category: "alignment" },
  { id: "hostile",   label: "Hostile",   description: "Link effects apply to opponents.",                   color: "#ef4444", category: "alignment" },
  { id: "neutral",   label: "Neutral",   description: "Link effects apply to any beyblade in range.",      color: "#94a3b8", category: "alignment" },
];

const TRIGGER_CONDITIONS = [
  { id: "any",           label: "Any",             description: "Triggers for any beyblade.",                    category: "trigger_condition" },
  { id: "same_team",     label: "Same Team",        description: "Triggers only for teammates.",                  category: "trigger_condition" },
  { id: "opponent_only", label: "Opponent Only",    description: "Triggers only for opponents.",                  category: "trigger_condition" },
];

const EFFECT_TYPES = [
  { id: "spin_drain",          label: "Spin Drain",          description: "Drains spin from the linked beyblade.",           category: "effect_type" },
  { id: "spin_share",          label: "Spin Share",          description: "Equalises spin between linked beyblades.",         category: "effect_type" },
  { id: "spin_heal",           label: "Spin Heal",           description: "Transfers spin to the linked beyblade.",           category: "effect_type" },
  { id: "damage_boost",        label: "Damage Boost",        description: "Increases damage dealt by linked beyblade.",       category: "effect_type" },
  { id: "shield_boost",        label: "Shield Boost",        description: "Reduces damage taken by linked beyblade.",         category: "effect_type" },
  { id: "destabilize",         label: "Destabilize",         description: "Applies wobble / nutation to linked beyblade.",    category: "effect_type" },
  { id: "continuous_collision", label: "Continuous Collision","description": "Maintains constant collision force between pair.", category: "effect_type" },
  { id: "drill_attack",        label: "Drill Attack",        description: "Sustained drilling force from top beyblade.",      category: "effect_type" },
  { id: "control_loss",        label: "Control Loss",        description: "Removes player control from linked beyblade.",     category: "effect_type" },
  { id: "force_lock",          label: "Force Lock",          description: "Locks both beyblades in position for duration.",   category: "effect_type" },
];

const CONTROL_MODES = [
  { id: "reverse",  label: "Reverse",  description: "Input directions are reversed.",                         category: "control_mode" },
  { id: "scramble", label: "Scramble", description: "Input directions are randomly shuffled.",                category: "control_mode" },
  { id: "freeze",   label: "Freeze",   description: "All player input is ignored (frozen in place).",         category: "control_mode" },
];

const MOVEMENT_CONTROLS = [
  { id: "auto",       label: "Auto",       description: "Physics system controls movement automatically.",   category: "movement_control" },
  { id: "initiator",  label: "Initiator",  description: "The beyblade that started the link controls both.", category: "movement_control" },
  { id: "player",     label: "Player",     description: "The human player retains movement control.",         category: "movement_control" },
];

const GROUP_PATTERNS = [
  { id: "chain",  label: "Chain",  description: "Beyblades link in a single chain.",          category: "group_pattern" },
  { id: "star",   label: "Star",   description: "Beyblades orbit a central point.",            category: "group_pattern" },
  { id: "wedge",  label: "Wedge",  description: "Beyblades form a triangular formation.",      category: "group_pattern" },
  { id: "rigid",  label: "Rigid",  description: "Beyblades maintain fixed positions as a unit.", category: "group_pattern" },
];

async function seedBeyLinkConfigs() {
  console.log("\n══════════════════════════════════════");
  console.log("  BeyLink Configs Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("bey_link_configs");
  const now = new Date().toISOString();
  const allConfigs = [
    ...LINK_TYPES, ...REVERSE_CONDITIONS, ...BEY_LINK_TYPES,
    ...ALIGNMENTS, ...TRIGGER_CONDITIONS, ...EFFECT_TYPES,
    ...CONTROL_MODES, ...MOVEMENT_CONTROLS, ...GROUP_PATTERNS,
  ];
  for (const c of allConfigs) {
    try {
      await db.collection("bey_link_configs").doc(c.id).set({ ...c, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      console.log(`  ✔ [${c.category.padEnd(20)}] ${c.label}`);
    } catch (err) {
      console.error(`  ✘ ${c.label}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${allConfigs.length} bey link configs into bey_link_configs\n`);
}

seedBeyLinkConfigs()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

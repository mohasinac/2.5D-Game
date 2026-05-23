// scripts/seed-arena-feature-configs.js
// Seeds arena feature type catalog (hazards, effect zones, particles, env presets)
// to Firestore `arena_feature_configs`. Used by arena editor FeaturesTab. Idempotent.

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

const HAZARD_TYPES = [
  { id: "lava",        label: "Lava",         description: "Deals continuous burn damage to beyblades inside.",    icon: "🌋", color: "#ef4444", category: "hazard" },
  { id: "ice",         label: "Ice",           description: "Slows beyblade movement and reduces surface friction.", icon: "❄️", color: "#60a5fa", category: "hazard" },
  { id: "mud",         label: "Mud",           description: "Greatly reduces speed and increases spin decay.",       icon: "💧", color: "#92400e", category: "hazard" },
  { id: "electric",    label: "Electric",      description: "Deals shock damage and briefly disrupts controls.",     icon: "⚡", color: "#facc15", category: "hazard" },
  { id: "time_slow",   label: "Time Slow",     description: "Slows all physics within the zone temporarily.",        icon: "⏳", color: "#8b5cf6", category: "hazard" },
  { id: "repulsion",   label: "Repulsion",     description: "Pushes beyblades away from zone center.",              icon: "🔴", color: "#f97316", category: "hazard" },
  { id: "size_shrink", label: "Size Shrink",   description: "Temporarily shrinks beyblades entering the zone.",     icon: "🔽", color: "#06b6d4", category: "hazard" },
  { id: "size_grow",   label: "Size Grow",     description: "Temporarily enlarges beyblades entering the zone.",    icon: "🔼", color: "#10b981", category: "hazard" },
  { id: "trampoline",  label: "Trampoline",    description: "Bounces beyblades upward on contact.",                 icon: "🟡", color: "#eab308", category: "hazard" },
  { id: "combo_boost", label: "Combo Boost",   description: "Reduces combo power cost for beyblades inside.",       icon: "🎮", color: "#a855f7", category: "hazard" },
  { id: "drain",       label: "Drain",         description: "Drains power from beyblades over time.",               icon: "🔋", color: "#64748b", category: "hazard" },
  { id: "void",        label: "Void",          description: "Instant ring-out zone — beyblades are eliminated.",    icon: "⚫", color: "#1e293b", category: "hazard" },
  { id: "poison",      label: "Poison",        description: "Applies a damage-over-time poison debuff.",            icon: "☠️", color: "#4ade80", category: "hazard" },
];

const EFFECT_ZONE_TYPES = [
  { id: "power_charge",   label: "Power Charge",    description: "Rapidly charges beyblade power while inside.",      icon: "⚡", color: "#facc15", category: "effect_zone" },
  { id: "spin_recovery",  label: "Spin Recovery",   description: "Restores spin rate for beyblades in the zone.",     icon: "♻️", color: "#10b981", category: "effect_zone" },
  { id: "combo_boost",    label: "Combo Boost",     description: "Reduces combo costs and extends combo windows.",    icon: "🎮", color: "#a855f7", category: "effect_zone" },
  { id: "stat_aura",      label: "Stat Aura",       description: "Applies configurable stat multipliers in zone.",    icon: "✨", color: "#f59e0b", category: "effect_zone" },
  { id: "safe_zone",      label: "Safe Zone",       description: "Prevents damage for beyblades inside the zone.",    icon: "🛡️", color: "#3b82f6", category: "effect_zone" },
  { id: "turbo_zone",     label: "Turbo Zone",      description: "Greatly increases speed and attack while inside.",  icon: "🚀", color: "#ef4444", category: "effect_zone" },
  { id: "respawn_point",  label: "Respawn Point",   description: "Marks a spawn location for ring-out recovery.",    icon: "📍", color: "#22c55e", category: "effect_zone" },
];

const PARTICLE_TYPES = [
  { id: "snow",         label: "Snow",          description: "Falling snowflakes — cold atmospheric effect.",       icon: "❄️", category: "particle" },
  { id: "rain",         label: "Rain",          description: "Falling rain — storm or underwater atmosphere.",     icon: "🌧️", category: "particle" },
  { id: "embers",       label: "Embers",        description: "Rising fire embers — volcanic or lava theme.",       icon: "🔥", category: "particle" },
  { id: "leaves",       label: "Leaves",        description: "Drifting leaves — forest or nature theme.",          icon: "🍃", category: "particle" },
  { id: "bubbles",      label: "Bubbles",       description: "Rising bubbles — underwater or ocean theme.",        icon: "🫧", category: "particle" },
  { id: "sparks",       label: "Sparks",        description: "Electric sparks — cyber or factory theme.",          icon: "✨", category: "particle" },
  { id: "pollen",       label: "Pollen",        description: "Floating pollen — meadow or nature theme.",          icon: "🌸", category: "particle" },
  { id: "ash",          label: "Ash",           description: "Falling ash — post-volcanic or haunted theme.",      icon: "🌫️", category: "particle" },
  { id: "stars",        label: "Stars",         description: "Twinkling stars — space or cosmic theme.",           icon: "⭐", category: "particle" },
  { id: "glitch_pixels", label: "Glitch Pixels", description: "Digital corruption pixels — cyber or quantum theme.", icon: "💾", category: "particle" },
];

const ENV_PRESETS = [
  { id: "storm",      label: "Storm",       description: "Wind and lightning effects — slows beyblades, adds sparks.",  icon: "⛈️", category: "env_preset" },
  { id: "blizzard",   label: "Blizzard",    description: "Ice storm — increases spin decay, adds snow particles.",      icon: "❄️", category: "env_preset" },
  { id: "volcanic",   label: "Volcanic",    description: "Lava eruptions — heat damage over time, ember particles.",    icon: "🌋", category: "env_preset" },
  { id: "underwater", label: "Underwater",  description: "Water resistance — reduces movement speed, bubble particles.", icon: "🌊", category: "env_preset" },
  { id: "cyber",      label: "Cyber",       description: "Grid distortions — random control interrupts, glitch pixels.", icon: "💻", category: "env_preset" },
  { id: "earthquake", label: "Earthquake",  description: "Ground shaking — periodic force waves, debris particles.",    icon: "🌍", category: "env_preset" },
];

async function seedArenaFeatureConfigs() {
  console.log("\n══════════════════════════════════════");
  console.log("  Arena Feature Configs Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("arena_feature_configs");
  const now = new Date().toISOString();
  const allConfigs = [...HAZARD_TYPES, ...EFFECT_ZONE_TYPES, ...PARTICLE_TYPES, ...ENV_PRESETS];
  for (const c of allConfigs) {
    try {
      await db.collection("arena_feature_configs").doc(c.id).set({ ...c, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      console.log(`  ✔ [${c.category.padEnd(12)}] ${c.label.padEnd(18)} ${c.icon ?? ""}`);
    } catch (err) {
      console.error(`  ✘ ${c.label}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${allConfigs.length} arena feature configs into arena_feature_configs\n`);
}

seedArenaFeatureConfigs()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

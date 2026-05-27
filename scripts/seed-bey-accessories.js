// scripts/seed-bey-accessories.js
// Seeds 12 bey accessory definitions (Pokémon held-item equivalents).
// Safe to re-run (full overwrite).
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

if (!admin.apps.length) {
  const serviceAccount = require("../firebase-service-account.json");
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = getFirestore();

const ACCESSORIES = [
  {
    id: "spin_sash",
    name: "Spin Sash",
    description: "If the bey would be eliminated by spin-out, it survives once with 10% spin instead.",
    iconEmoji: "🟡",
    effectType: "on_proc",
    statModifiers: {},
    procChance: 1.0,
    procEffect: "Survive one lethal spin-out at 10% spin",
  },
  {
    id: "rubber_grip",
    name: "Rubber Grip",
    description: "Rubber-coated base gives +25 burst resistance.",
    iconEmoji: "🔴",
    effectType: "passive_stat",
    statModifiers: { burstResistance: 25 },
  },
  {
    id: "steel_core",
    name: "Steel Core",
    description: "Heavier mass core reduces damage taken by 5%.",
    iconEmoji: "⚙️",
    effectType: "passive_stat",
    statModifiers: { damageReduction: 0.05 },
  },
  {
    id: "bearing_clutch",
    name: "Bearing Clutch",
    description: "Precision bearing reduces spin decay by 0.5/s.",
    iconEmoji: "🔵",
    effectType: "passive_stat",
    statModifiers: { spinDecayRate: -0.5 },
  },
  {
    id: "energy_ring",
    name: "Energy Ring",
    description: "Increases maximum spin capacity by +200.",
    iconEmoji: "🟢",
    effectType: "passive_stat",
    statModifiers: { maxSpin: 200 },
  },
  {
    id: "attack_booster",
    name: "Attack Booster",
    description: "Angled contact points give +15% damage multiplier.",
    iconEmoji: "🔶",
    effectType: "passive_stat",
    statModifiers: { damageMultiplier: 0.15 },
  },
  {
    id: "shield_pad",
    name: "Shield Pad",
    description: "Absorber pad gives 30% chance to negate a burst on contact.",
    iconEmoji: "🛡️",
    effectType: "on_contact",
    statModifiers: { burstResistance: 15 },
    procChance: 0.30,
    procEffect: "Negate burst on contact",
  },
  {
    id: "magnet_core",
    name: "Magnet Core",
    description: "Magnetic core increases control authority by +20.",
    iconEmoji: "🧲",
    effectType: "passive_stat",
    statModifiers: { controlAuthority: 20 },
  },
  {
    id: "turbo_launcher",
    name: "Turbo Launcher",
    description: "Optimised launch mechanism: +15 launch power and stamina at match start.",
    iconEmoji: "🚀",
    effectType: "passive_stat",
    statModifiers: { launchPower: 15, stamina: 10 },
  },
  {
    id: "grip_tip",
    name: "Grip Tip",
    description: "High-friction tip: 50ms longer attack buff timer on each attack.",
    iconEmoji: "🟠",
    effectType: "passive_stat",
    statModifiers: { attackBuffTimer: 0.05 },
  },
  {
    id: "burst_stopper",
    name: "Burst Stopper",
    description: "Locking mechanism gives +20 burst resistance and 1s invulnerability on burst attempt.",
    iconEmoji: "🔒",
    effectType: "on_burst",
    statModifiers: { burstResistance: 20 },
    procChance: 1.0,
    procEffect: "1s invulnerability after burst attempt",
  },
  {
    id: "speed_disk",
    name: "Speed Disk",
    description: "Lightweight disk reduces mass by 0.5 and gives +0.05 movement force.",
    iconEmoji: "💨",
    effectType: "passive_stat",
    statModifiers: { mass: -0.5 },
  },
];

async function seed() {
  const col = db.collection("bey_accessories");
  let count = 0;
  for (const acc of ACCESSORIES) {
    const { id, ...data } = acc;
    await col.doc(id).set(data);
    count++;
    console.log(`  ✅ ${id}: ${acc.name}`);
  }
  console.log(`\nSeeded ${count} bey accessories.`);
}

seed().catch(console.error);

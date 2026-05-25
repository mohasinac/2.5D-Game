#!/usr/bin/env node
// scripts/seed-system-presets.js
// Seeds system_presets — one complete 2.5D beyblade system template per
// generation (Plastic, MFB, Burst, X) with slot assignments. Idempotent.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars."); process.exit(1);
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

// Part IDs reference the docs seeded by seed-2d-parts.js and seed-gears.js.
// These are approximations — admins can swap individual slots in the editor.
const PRESETS = [
  {
    id: "preset-system-plastic-attack",
    name: "Plastic Gen — Attack Template",
    generation: "plastic",
    description: "Classic Bakuten Shoot attack configuration. Wide AR, no spin track, EG spring core. Recommended for high-contact Fourier profiles.",
    template: {
      displayName: "Plastic Attack Template",
      spinDirection: "right",
      bitBeastId: "driger-s-bit-beast",
      attackRingId: "driger-s-ar",
      weightDiskId: "ten-wide",
      tipId: "flat-tip",
      coreId: "eg-core",
      casingId: null,
      spinTrackId: null,
      gearAttachments: [
        { gearPartId: "evolution-gear-l", mountPoint: "core", active: true },
      ],
      subPartAttachments: [],
    },
    recommendedBeyType: "attack",
    notes: "EG L gear provides First Clutch spring. Flat tip for aggressive movement.",
  },
  {
    id: "preset-system-plastic-defense",
    name: "Plastic Gen — Defense Template",
    generation: "plastic",
    description: "Heavy-ring plastic defense. Wide-O WD for outward mass. Free-spinning tip reduces recoil.",
    template: {
      displayName: "Plastic Defense Template",
      spinDirection: "right",
      bitBeastId: "trypio-bit-beast",
      attackRingId: "trypio-ar",
      weightDiskId: "wide-oval",
      tipId: "bearing-tip",
      coreId: "standard-core",
      casingId: null,
      spinTrackId: null,
      gearAttachments: [],
      subPartAttachments: [],
    },
    recommendedBeyType: "defense",
    notes: "Wide-O WD + bearing tip = maximum stability endurance.",
  },
  {
    id: "preset-system-mfb-attack",
    name: "Metal Fight — Attack Template",
    generation: "metal_fight",
    description: "Classic MFB Lightning L-Drago style: heavy metal fusion, S130 spin track, R2F rubber tip for extreme aggression.",
    template: {
      displayName: "MFB Attack Template",
      spinDirection: "left",
      bitBeastId: null,
      attackRingId: "lightning-ar",
      weightDiskId: "metal-wheel",
      tipId: "rf-tip",
      coreId: "mfb-core",
      casingId: null,
      spinTrackId: "s130-track",
      gearAttachments: [],
      subPartAttachments: [],
    },
    recommendedBeyType: "attack",
    notes: "Left-spin for same-direction spin stealing. RF tip maximizes contact area.",
  },
  {
    id: "preset-system-mfb-stamina",
    name: "Metal Fight — Stamina Template",
    generation: "metal_fight",
    description: "Hades/Phantom configuration: 230 height track + CS bearing tip for endurance over 3 minutes.",
    template: {
      displayName: "MFB Stamina Template",
      spinDirection: "right",
      bitBeastId: null,
      attackRingId: "phantom-ar",
      weightDiskId: "phantom-wheel",
      tipId: "cs-bearing-tip",
      coreId: "mfb-core",
      casingId: null,
      spinTrackId: "230-track",
      gearAttachments: [],
      subPartAttachments: [],
    },
    recommendedBeyType: "stamina",
    notes: "230 height keeps the bey above most opponent contact zones.",
  },
  {
    id: "preset-system-burst-attack",
    name: "Burst Gen — Attack Template",
    generation: "burst",
    description: "Burst-gen aggressive play: Winning Valkyrie-style DB attack with rubber flat tip. High burst risk = high damage output.",
    template: {
      displayName: "Burst Attack Template",
      spinDirection: "right",
      bitBeastId: null,
      attackRingId: "burst-attack-ar",
      weightDiskId: "burst-wd",
      tipId: "rf-tip",
      coreId: "burst-3click-core",
      casingId: "burst-casing",
      spinTrackId: null,
      gearAttachments: [],
      subPartAttachments: [],
    },
    recommendedBeyType: "attack",
    notes: "3-click burst core: low burst resistance is intentional for maximum attack power.",
  },
  {
    id: "preset-system-burst-defense",
    name: "Burst Gen — Defense Template",
    generation: "burst",
    description: "Burst-gen 5-click lock defense: Kerbeus-style wide casing + orbit tip for low-friction stability.",
    template: {
      displayName: "Burst Defense Template",
      spinDirection: "right",
      bitBeastId: null,
      attackRingId: "burst-defense-ar",
      weightDiskId: "burst-heavy-wd",
      tipId: "orbit-tip",
      coreId: "burst-5click-core",
      casingId: "wide-burst-casing",
      spinTrackId: null,
      gearAttachments: [],
      subPartAttachments: [],
    },
    recommendedBeyType: "defense",
    notes: "5-click core: very high burst resistance. Orbit tip keeps bey near center.",
  },
  {
    id: "preset-system-x-attack",
    name: "X Gen — Attack Template",
    generation: "x_gen",
    description: "Beyblade X top-speed attack: ratchet-line gimmick, extreme speed stats, compact form for high X-Line boost.",
    template: {
      displayName: "X Attack Template",
      spinDirection: "right",
      bitBeastId: null,
      attackRingId: "x-blade-ar",
      weightDiskId: "x-wd",
      tipId: "xt-plus-tip",
      coreId: "x-ratchet-core",
      casingId: "x-casing",
      spinTrackId: null,
      gearAttachments: [],
      subPartAttachments: [],
    },
    recommendedBeyType: "attack",
    notes: "X-dash ratchet provides jump force for wall deflection. XT+ tip for floor-grip at speed.",
  },
];

async function seed() {
  console.log("\n════════════════════════════════════════");
  console.log("  System Presets Seed");
  console.log("════════════════════════════════════════\n");
  await clearCollection("system_presets");
  const now = new Date().toISOString();
  for (const p of PRESETS) {
    try {
      await db.collection("system_presets").doc(p.id).set({ ...p, createdAt: now, updatedAt: now, createdBy: "seed" }, { merge: true });
      console.log(`  ✔ [${p.generation.padEnd(12)}/${p.recommendedBeyType.padEnd(7)}] ${p.name}`);
    } catch (err) {
      console.error(`  ✘ ${p.name}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${PRESETS.length} system presets into system_presets\n`);
}

seed()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

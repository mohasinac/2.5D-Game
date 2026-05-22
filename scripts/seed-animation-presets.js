// seed-animation-presets.js — seeds built-in named animation presets
// to the animation_presets Firestore collection. Idempotent.

const admin = require("firebase-admin");

if (!admin.apps.length) {
  require("dotenv").config();
  const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  };
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

const ANIMATION_PRESETS = [
  {
    id: "glow_pulse",
    name: "Glow Pulse",
    description: "Bey glows rhythmically — for charge-up state",
    durationMs: 600,
    loop: true,
    cssClass: "anim-glow-pulse",
    pixiFilter: "bloom",
    keyframes: [
      { t: 0.0, alpha: 1.0, scale: 1.0, glowRadius: 0 },
      { t: 0.5, alpha: 1.0, scale: 1.05, glowRadius: 12 },
      { t: 1.0, alpha: 1.0, scale: 1.0, glowRadius: 0 },
    ],
  },
  {
    id: "spin_up",
    name: "Spin Up",
    description: "Bey spins faster visually — for windup",
    durationMs: 400,
    loop: false,
    cssClass: "anim-spin-up",
    pixiFilter: "motion_blur",
    keyframes: [
      { t: 0.0, rotationMultiplier: 1.0, alpha: 1.0 },
      { t: 1.0, rotationMultiplier: 3.0, alpha: 0.8 },
    ],
  },
  {
    id: "shockwave_ring",
    name: "Shockwave Ring",
    description: "Expanding ring from bey center — for impact",
    durationMs: 350,
    loop: false,
    cssClass: "anim-shockwave",
    pixiFilter: "none",
    keyframes: [
      { t: 0.0, ringRadius: 0,  ringAlpha: 0.9, ringWidth: 8 },
      { t: 0.6, ringRadius: 40, ringAlpha: 0.5, ringWidth: 4 },
      { t: 1.0, ringRadius: 80, ringAlpha: 0.0, ringWidth: 1 },
    ],
  },
  {
    id: "gravity_distort",
    name: "Gravity Distort",
    description: "Visual distortion field around bey — for gravity well transform",
    durationMs: 800,
    loop: true,
    cssClass: "anim-gravity-distort",
    pixiFilter: "displacement",
    keyframes: [
      { t: 0.0, distortScale: 0.0 },
      { t: 0.5, distortScale: 0.4 },
      { t: 1.0, distortScale: 0.0 },
    ],
  },
  {
    id: "trail_flame",
    name: "Trail Flame",
    description: "Fire trail while moving — for meteor ascent phase",
    durationMs: -1,
    loop: true,
    cssClass: "anim-trail-flame",
    pixiFilter: "add_blend",
    keyframes: [
      { t: 0.0, trailLength: 20, trailColor: "#ff8800", trailAlpha: 0.8 },
      { t: 0.5, trailLength: 35, trailColor: "#ff4400", trailAlpha: 1.0 },
      { t: 1.0, trailLength: 20, trailColor: "#ff8800", trailAlpha: 0.8 },
    ],
  },
  {
    id: "clone_shimmer",
    name: "Clone Shimmer",
    description: "Translucent shimmer — applied to clone beys",
    durationMs: 800,
    loop: true,
    cssClass: "anim-clone-shimmer",
    pixiFilter: "none",
    keyframes: [
      { t: 0.0, alpha: 0.5, tintColor: "#ffffff" },
      { t: 0.5, alpha: 0.8, tintColor: "#aaccff" },
      { t: 1.0, alpha: 0.5, tintColor: "#ffffff" },
    ],
  },
  {
    id: "burst_shatter",
    name: "Burst Shatter",
    description: "Bey shatters and disappears — played on burst KO",
    durationMs: 500,
    loop: false,
    cssClass: "anim-burst-shatter",
    pixiFilter: "none",
    keyframes: [
      { t: 0.0, scale: 1.0,  alpha: 1.0, rotationAdd: 0 },
      { t: 0.4, scale: 1.4,  alpha: 0.8, rotationAdd: 45 },
      { t: 0.7, scale: 0.6,  alpha: 0.4, rotationAdd: 90 },
      { t: 1.0, scale: 0.0,  alpha: 0.0, rotationAdd: 180 },
    ],
  },
];

async function seed() {
  const col = db.collection("animation_presets");
  let upserted = 0;

  for (const preset of ANIMATION_PRESETS) {
    await col.doc(preset.id).set(preset, { merge: true });
    upserted++;
    process.stdout.write(`  ✓ ${preset.id}\n`);
  }

  console.log(`\nSeeded ${upserted} animation presets.`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

// seed-particle-presets.js — seeds built-in PixiJS particle presets
// to the particle_presets Firestore collection. Idempotent.

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

const PRESETS = [
  {
    id: "charge_burst",
    name: "Charge Burst",
    description: "Red/orange expanding ring — for combo windup",
    emitterConfig: {
      alpha: { start: 0.8, end: 0 },
      scale: { start: 0.5, end: 1.5, minimumScaleMultiplier: 0.5 },
      color: { start: "#ff6600", end: "#ff2200" },
      speed: { start: 80, end: 40 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 0,
      startRotation: { min: 0, max: 360 },
      noRotation: false,
      rotationSpeed: { min: 0, max: 0 },
      lifetime: { min: 0.3, max: 0.6 },
      blendMode: "add",
      frequency: 0.008,
      emitterLifetime: 0.2,
      maxParticles: 50,
      pos: { x: 0, y: 0 },
      addAtBack: false,
      spawnType: "circle",
      spawnCircle: { x: 0, y: 0, r: 10 },
    },
  },
  {
    id: "dust_settle",
    name: "Dust Settle",
    description: "Grey dust ring — for after-impact settle",
    emitterConfig: {
      alpha: { start: 0.6, end: 0 },
      scale: { start: 0.4, end: 1.2 },
      color: { start: "#888888", end: "#444444" },
      speed: { start: 40, end: 10 },
      acceleration: { x: 0, y: -20 },
      maxSpeed: 0,
      startRotation: { min: 0, max: 360 },
      lifetime: { min: 0.4, max: 0.8 },
      blendMode: "normal",
      frequency: 0.01,
      emitterLifetime: 0.15,
      maxParticles: 30,
      pos: { x: 0, y: 0 },
      addAtBack: false,
      spawnType: "circle",
      spawnCircle: { x: 0, y: 0, r: 5 },
    },
  },
  {
    id: "meteor_impact",
    name: "Meteor Impact",
    description: "Orange/yellow explosion + dust — for meteor strike landing",
    emitterConfig: {
      alpha: { start: 1.0, end: 0 },
      scale: { start: 0.8, end: 2.5 },
      color: { start: "#ffdd00", end: "#ff4400" },
      speed: { start: 180, end: 60 },
      acceleration: { x: 0, y: 60 },
      maxSpeed: 0,
      startRotation: { min: 0, max: 360 },
      lifetime: { min: 0.4, max: 0.9 },
      blendMode: "add",
      frequency: 0.004,
      emitterLifetime: 0.25,
      maxParticles: 80,
      pos: { x: 0, y: 0 },
      addAtBack: false,
      spawnType: "circle",
      spawnCircle: { x: 0, y: 0, r: 20 },
    },
  },
  {
    id: "gravity_pull",
    name: "Gravity Pull",
    description: "Blue spiral inward — for gravity well transformation",
    emitterConfig: {
      alpha: { start: 0.7, end: 0 },
      scale: { start: 0.3, end: 0.1 },
      color: { start: "#44aaff", end: "#0055ff" },
      speed: { start: 60, end: 120 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 0,
      startRotation: { min: 0, max: 360 },
      rotationSpeed: { min: 200, max: 300 },
      lifetime: { min: 0.5, max: 1.0 },
      blendMode: "add",
      frequency: 0.006,
      emitterLifetime: -1,
      maxParticles: 60,
      pos: { x: 0, y: 0 },
      addAtBack: false,
      spawnType: "circle",
      spawnCircle: { x: 0, y: 0, r: 40 },
    },
  },
  {
    id: "spin_leech",
    name: "Spin Leech",
    description: "Green dots flowing toward self — for spin steal",
    emitterConfig: {
      alpha: { start: 1.0, end: 0.2 },
      scale: { start: 0.2, end: 0.4 },
      color: { start: "#22ff88", end: "#008844" },
      speed: { start: 100, end: 20 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 0,
      startRotation: { min: 0, max: 360 },
      lifetime: { min: 0.3, max: 0.5 },
      blendMode: "normal",
      frequency: 0.01,
      emitterLifetime: 0.3,
      maxParticles: 20,
      pos: { x: 0, y: 0 },
      addAtBack: false,
      spawnType: "circle",
      spawnCircle: { x: 0, y: 0, r: 30 },
    },
  },
  {
    id: "clone_spawn",
    name: "Clone Spawn",
    description: "White sparkle burst — for clone spawning",
    emitterConfig: {
      alpha: { start: 1.0, end: 0 },
      scale: { start: 0.4, end: 1.0 },
      color: { start: "#ffffff", end: "#aaccff" },
      speed: { start: 120, end: 40 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: 0,
      startRotation: { min: 0, max: 360 },
      lifetime: { min: 0.3, max: 0.6 },
      blendMode: "add",
      frequency: 0.006,
      emitterLifetime: 0.2,
      maxParticles: 40,
      pos: { x: 0, y: 0 },
      addAtBack: false,
      spawnType: "circle",
      spawnCircle: { x: 0, y: 0, r: 5 },
    },
  },
  {
    id: "burst_explosion",
    name: "Burst Explosion",
    description: "Multi-color explosion — for beyblade burst KO",
    emitterConfig: {
      alpha: { start: 1.0, end: 0 },
      scale: { start: 0.6, end: 2.0 },
      color: { start: "#ffffff", end: "#ff6600" },
      speed: { start: 200, end: 50 },
      acceleration: { x: 0, y: 40 },
      maxSpeed: 0,
      startRotation: { min: 0, max: 360 },
      lifetime: { min: 0.5, max: 1.2 },
      blendMode: "add",
      frequency: 0.002,
      emitterLifetime: 0.3,
      maxParticles: 100,
      pos: { x: 0, y: 0 },
      addAtBack: false,
      spawnType: "circle",
      spawnCircle: { x: 0, y: 0, r: 15 },
    },
  },
];

async function seed() {
  const col = db.collection("particle_presets");
  let upserted = 0;

  for (const preset of PRESETS) {
    await col.doc(preset.id).set(preset, { merge: true });
    upserted++;
    process.stdout.write(`  ✓ ${preset.id}\n`);
  }

  console.log(`\nSeeded ${upserted} particle presets.`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

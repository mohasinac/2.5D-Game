#!/usr/bin/env node
// Seed arena_systems collection with 2.5D arena configurations
// Covers real tournament stadiums + anime arenas with proper bowl profiles and physics
// Run: node scripts/seed-arena-systems.js

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

const now = new Date().toISOString();

const arenaSystems = [

  // ═══════════════════════════════════════════════════════════════════════════
  // REAL TOURNAMENT STADIUMS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Plastic Gen: Tornado Attack Stadium ────────────────────────────────────
  {
    id: "tornado-attack-stadium-2d",
    displayName: "Tornado Attack Stadium (2.5D)",
    description: "Gen 1 Plastic tournament standard. Tall 10mm tornado ridge, 3 exit pockets, shallow 20° bowl.",
    shape: "circle",
    width: 720,   // ~300mm real → scaled
    height: 720,
    theme: "default",
    difficulty: "easy",
    generation: "plastic",
    elevationMap: {
      type: "bowl",
      bowlDepthMm: 20,
      slopeAngleDeg: 20,
      tiltAngle: 0,
      tiltDirection: 0,
    },
    tornadoRidge: {
      radiusMm: 110,
      heightMm: 10,
      halfWidthMm: 10,
    },
    wallProfile: { baseHeight: 80, wallAngleDeg: 90 },
    slopePhysics: { gravityStrength: 0.4 },
    wall: { type: "circular", height: 80, material: "abs", restitution: 0.65 },
    exits: { count: 3, distribution: "symmetric", chordMm: 120 },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ── Plastic Gen: Super Attack Stadium ──────────────────────────────────────
  {
    id: "super-attack-stadium-2d",
    displayName: "Super Attack Stadium (2.5D)",
    description: "Gen 1 deeper bowl variant. Steeper slopes push beys harder toward centre.",
    shape: "circle",
    width: 770,
    height: 770,
    theme: "default",
    difficulty: "medium",
    generation: "plastic",
    elevationMap: {
      type: "bowl",
      bowlDepthMm: 28,
      slopeAngleDeg: 25,
      tiltAngle: 0,
      tiltDirection: 0,
    },
    tornadoRidge: {
      radiusMm: 115,
      heightMm: 8,
      halfWidthMm: 10,
    },
    wallProfile: { baseHeight: 90, wallAngleDeg: 90 },
    slopePhysics: { gravityStrength: 0.55 },
    wall: { type: "circular", height: 90, material: "abs", restitution: 0.65 },
    exits: { count: 3, distribution: "symmetric", chordMm: 130 },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ── MFB: BeyStadium Attack Type (tournament standard) ─────────────────────
  {
    id: "beystadium-attack-type-2d",
    displayName: "BeyStadium Attack Type (2.5D)",
    description: "MFB tournament standard. 340mm outer, 30mm depth, 30° slope, 3mm tornado ridge at R=125mm. Case 545 confirmed geometry.",
    shape: "circle",
    width: 816,   // 340mm real → 816px at 24px/cm scale
    height: 816,
    theme: "default",
    difficulty: "medium",
    generation: "mfb",
    elevationMap: {
      type: "bowl",
      bowlDepthMm: 30,
      slopeAngleDeg: 30,
      flatZoneRadiusMm: 40,
      tiltAngle: 0,
      tiltDirection: 0,
    },
    tornadoRidge: {
      radiusMm: 125,
      heightMm: 3,
      halfWidthMm: 10,
    },
    secondIncline: {
      startRadiusMm: 145,
      endRadiusMm: 155,
      angleDeg: 50,
    },
    wallProfile: { baseHeight: 100, wallAngleDeg: 90, wallHeightMm: 30 },
    slopePhysics: {
      gravityStrength: 0.6,
      zone2GravLateral: 4.905,
      zone4GravLateral: 7.508,
    },
    wall: { type: "circular", height: 100, material: "abs", restitution: 0.70 },
    exits: {
      count: 3,
      distribution: "symmetric",
      pocketChordMm: 150,
      wallChordMm: 155,
      ejectionProbability: 0.492,
    },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ── MFB: Ultimate Beyta Stadium (4D motorised) ────────────────────────────
  {
    id: "ultimate-beyta-stadium-2d",
    displayName: "Ultimate Beyta Stadium (2.5D)",
    description: "4D motorised arena, 737×432mm. Magnetic Spin Spot at centre (F_trap=0.80N, ω_disc=500RPM). Case 553 confirmed.",
    shape: "circle",
    width: 1769,  // 737mm → 1769px
    height: 1037, // 432mm → 1037px
    theme: "ancient_temple",
    difficulty: "extreme",
    generation: "4d",
    elevationMap: {
      type: "bowl",
      bowlDepthMm: 30,
      slopeAngleDeg: 30,
      flatZoneRadiusMm: 40,
      tiltAngle: 0,
      tiltDirection: 0,
    },
    tornadoRidge: {
      radiusMm: 155,
      heightMm: 3,
      halfWidthMm: 10,
    },
    wallProfile: { baseHeight: 100, wallAngleDeg: 90 },
    slopePhysics: { gravityStrength: 0.6 },
    wall: { type: "circular", height: 100, material: "abs", restitution: 0.70 },
    exits: { count: 3, distribution: "symmetric", pocketChordMm: 150, wallChordMm: 155 },
    motorDisc: {
      radiusMm: 35,
      rpmSpeed: 500,
      magnetForceN: 0.80,
      trapFriction: 0.55,
      maxTrapSpeedMs: 1.01,
      revivalTorqueNm: 0.0009,
    },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ── BX: BX-10 Xtreme Stadium ──────────────────────────────────────────────
  {
    id: "bx10-xtreme-stadium-2d",
    displayName: "BX-10 Xtreme Stadium (2.5D)",
    description: "BX tournament standard. Square 430×440mm, circular battle zone 365mm. Single-side exit, Xtreme Line gear ring. Case 548–550 confirmed.",
    shape: "rectangle",
    width: 1032,  // 430mm → 1032px
    height: 1056, // 440mm → 1056px
    theme: "metrocity",
    difficulty: "hard",
    generation: "bx",
    battleZone: {
      shape: "circle",
      radiusMm: 182.5,
    },
    elevationMap: {
      type: "bowl",
      bowlDepthMm: 25,
      slopeAngleDeg: 25,
      tiltAngle: 0,
      tiltDirection: 0,
    },
    gearRing: {
      radiusMm: 105,
      toothPitchMm: 2,
      toothHeightMm: 1,
      gearFriction: 0.90,
      xDashAcceleration: 26.3,
    },
    wallProfile: { baseHeight: 80, wallAngleDeg: 90 },
    slopePhysics: { gravityStrength: 0.5 },
    wall: { type: "square", height: 80, material: "abs", restitution: 0.75 },
    exits: {
      count: 3,
      distribution: "front-only",
      overZoneChordMm: 120,
      overZoneCount: 2,
      xtremeZoneChordMm: 190,
      xtremeZoneCount: 1,
      frontExitArcDeg: 139.5,
    },
    scoring: {
      overZonePoints: 2,
      xtremeZonePoints: 3,
    },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ── BX: Wide Xtreme Stadium ───────────────────────────────────────────────
  {
    id: "wide-xtreme-stadium-2d",
    displayName: "Wide Xtreme Stadium (2.5D)",
    description: "Larger BX variant. ~400mm battle zone, wider orbits, same gear mechanics. Case 552 estimated.",
    shape: "rectangle",
    width: 1128,
    height: 1152,
    theme: "metrocity",
    difficulty: "hard",
    generation: "bx",
    battleZone: {
      shape: "circle",
      radiusMm: 210,
    },
    elevationMap: {
      type: "bowl",
      bowlDepthMm: 28,
      slopeAngleDeg: 25,
      tiltAngle: 0,
      tiltDirection: 0,
    },
    gearRing: {
      radiusMm: 115,
      toothPitchMm: 2,
      toothHeightMm: 1,
      gearFriction: 0.90,
      xDashAcceleration: 26.3,
    },
    wallProfile: { baseHeight: 85, wallAngleDeg: 90 },
    slopePhysics: { gravityStrength: 0.5 },
    wall: { type: "square", height: 85, material: "abs", restitution: 0.75 },
    exits: {
      count: 3,
      distribution: "front-only",
      overZoneChordMm: 130,
      overZoneCount: 2,
      xtremeZoneChordMm: 200,
      xtremeZoneCount: 1,
    },
    scoring: { overZonePoints: 2, xtremeZonePoints: 3 },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ── BX: Infinity Stadium (oval) ───────────────────────────────────────────
  {
    id: "infinity-stadium-2d",
    displayName: "Infinity Stadium (2.5D)",
    description: "Oval BX variant. Semi-axes ~230×150mm. Variable X-Dash force (53% stronger at short-axis). Case 552 confirmed.",
    shape: "rectangle",
    width: 1104,
    height: 720,
    theme: "metrocity",
    difficulty: "extreme",
    generation: "bx",
    battleZone: {
      shape: "ellipse",
      semiMajorMm: 230,
      semiMinorMm: 150,
      aspectRatio: 1.53,
    },
    elevationMap: {
      type: "bowl",
      bowlDepthMm: 25,
      slopeAngleDeg: 25,
      tiltAngle: 0,
      tiltDirection: 0,
    },
    gearRing: {
      radiusMm: 105,
      toothPitchMm: 2,
      toothHeightMm: 1,
      gearFriction: 0.90,
      xDashVariation: 0.534,
    },
    wallProfile: { baseHeight: 80, wallAngleDeg: 90 },
    slopePhysics: { gravityStrength: 0.5 },
    wall: { type: "oval", height: 80, material: "abs", restitution: 0.75 },
    exits: {
      count: 3,
      distribution: "front-only",
      overZoneChordMm: 120,
      overZoneCount: 2,
      xtremeZoneChordMm: 190,
      xtremeZoneCount: 1,
    },
    scoring: { overZonePoints: 2, xtremeZonePoints: 3 },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME-ORIGINAL ARENAS (kept from previous version, expanded)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "volcano-bowl",
    displayName: "Volcano Bowl",
    description: "A bowl-shaped arena with elevated edges pulling beyblades outward.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "volcano",
    difficulty: "medium",
    generation: "game-original",
    elevationMap: { type: "bowl", tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 100 },
    slopePhysics: { gravityStrength: 0.7 },
    wall: { type: "circular", height: 100 },
    createdAt: now, updatedAt: now,
  },
  {
    id: "mountain-peak",
    displayName: "Mountain Peak",
    description: "A pyramid-shaped arena with peak in the center.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "mountains",
    difficulty: "hard",
    generation: "game-original",
    elevationMap: { type: "pyramid", tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 80 },
    slopePhysics: { gravityStrength: 0.8 },
    wall: { type: "circular", height: 80 },
    createdAt: now, updatedAt: now,
  },
  {
    id: "tidal-ramp",
    displayName: "Tidal Ramp",
    description: "A laterally tilted arena causing gravitational drift in one direction.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "sea",
    difficulty: "hard",
    generation: "game-original",
    elevationMap: { type: "ramp", tiltAngle: 15, tiltDirection: 90 },
    wallProfile: { baseHeight: 100 },
    slopePhysics: { gravityStrength: 0.6 },
    wall: { type: "circular", height: 100 },
    createdAt: now, updatedAt: now,
  },
  {
    id: "glacier-flats",
    displayName: "Glacier Flats",
    description: "A flat arena with ice patches reducing friction and rough patches increasing it.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "frozen_tundra",
    difficulty: "medium",
    generation: "game-original",
    elevationMap: { type: "flat", tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 100 },
    slopePhysics: {
      gravityStrength: 0,
      frictionMap: [
        { x: 540, y: 400, radius: 150, frictionMultiplier: 0.1 },
        { x: 540, y: 680, radius: 150, frictionMultiplier: 0.1 },
        { x: 300, y: 540, radius: 100, frictionMultiplier: 2.5 },
        { x: 780, y: 540, radius: 100, frictionMultiplier: 2.5 },
      ],
    },
    wall: { type: "circular", height: 100 },
    createdAt: now, updatedAt: now,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIME-INSPIRED ARENAS (2.5D)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Dark Nebula Fortress (MFB anime) ──────────────────────────────────────
  {
    id: "dark-nebula-fortress-2d",
    displayName: "Dark Nebula Fortress (2.5D)",
    description: "Dark Nebula HQ underground arena. Spiked walls, electric floor hazards, oppressive atmosphere.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "haunted_factory",
    difficulty: "extreme",
    generation: "anime",
    elevationMap: { type: "bowl", bowlDepthMm: 35, slopeAngleDeg: 35, tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 120, wallAngleDeg: 85, spiked: true },
    slopePhysics: { gravityStrength: 0.75 },
    wall: { type: "circular", height: 120, material: "metal", restitution: 0.80, spiked: true, spikeDamage: 1.5 },
    exits: { count: 0, distribution: "none" },
    floorMaterial: "metal",
    floorFriction: 0.12,
    hazardZones: [
      { type: "electric", radiusMm: 40, positionAngleDeg: 0, intensity: 1.2 },
      { type: "electric", radiusMm: 40, positionAngleDeg: 120, intensity: 1.2 },
      { type: "electric", radiusMm: 40, positionAngleDeg: 240, intensity: 1.2 },
    ],
    createdAt: now, updatedAt: now,
  },

  // ── Big Bang Bladers World Championship ───────────────────────────────────
  {
    id: "big-bang-bladers-2d",
    displayName: "Big Bang Bladers Stadium (2.5D)",
    description: "World Championship finals arena. Pristine circle, gold/chrome walls, maximum fairness.",
    shape: "circle",
    width: 960,
    height: 960,
    theme: "metrocity",
    difficulty: "medium",
    generation: "anime",
    elevationMap: { type: "bowl", bowlDepthMm: 30, slopeAngleDeg: 30, tiltAngle: 0, tiltDirection: 0 },
    tornadoRidge: { radiusMm: 125, heightMm: 3, halfWidthMm: 10 },
    wallProfile: { baseHeight: 100, wallAngleDeg: 90 },
    slopePhysics: { gravityStrength: 0.6 },
    wall: { type: "circular", height: 100, material: "chrome", restitution: 0.75 },
    exits: { count: 3, distribution: "symmetric", pocketChordMm: 150, wallChordMm: 155 },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ── Hades City Arena (MFB anime) ──────────────────────────────────────────
  {
    id: "hades-city-arena-2d",
    displayName: "Hades City Arena (2.5D)",
    description: "Underground arena from Hades City. Lava-ringed, extreme heat, no exits — spin-out or burst only.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "lava_core",
    difficulty: "extreme",
    generation: "anime",
    elevationMap: { type: "bowl", bowlDepthMm: 40, slopeAngleDeg: 40, tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 130, wallAngleDeg: 80 },
    slopePhysics: { gravityStrength: 0.85 },
    wall: { type: "circular", height: 130, material: "stone", restitution: 0.60, heated: true },
    exits: { count: 0, distribution: "none" },
    floorMaterial: "stone",
    floorFriction: 0.18,
    lavaRing: { innerRadiusMm: 145, outerRadiusMm: 170, damagePerSec: 8 },
    createdAt: now, updatedAt: now,
  },

  // ── Tower of Babel (Burst anime) ──────────────────────────────────────────
  {
    id: "tower-of-babel-2d",
    displayName: "Tower of Babel (2.5D)",
    description: "Towering spiral arena from Burst anime. Auto-rotating tilted surface, vertigo-inducing height.",
    shape: "circle",
    width: 900,
    height: 900,
    theme: "ancient_temple",
    difficulty: "hard",
    generation: "anime",
    elevationMap: { type: "bowl", bowlDepthMm: 25, slopeAngleDeg: 28, tiltAngle: 15, tiltDirection: 0 },
    wallProfile: { baseHeight: 90, wallAngleDeg: 88 },
    slopePhysics: { gravityStrength: 0.65 },
    wall: { type: "circular", height: 90, material: "stone", restitution: 0.65 },
    exits: { count: 3, distribution: "symmetric", chordMm: 130 },
    autoRotate: { enabled: true, speedDegPerSec: 8, direction: "cw" },
    tilt: { angleDeg: 15, directionDeg: 0, autoTilt: true, tiltSpeedDegPerSec: 5 },
    floorMaterial: "stone",
    floorFriction: 0.16,
    createdAt: now, updatedAt: now,
  },

  // ── WBBA Official Stadium (Burst era) ─────────────────────────────────────
  {
    id: "wbba-official-stadium-2d",
    displayName: "WBBA Official Stadium (2.5D)",
    description: "Burst-era WBBA tournament standard. Clean circle, no hazards, fair competition.",
    shape: "circle",
    width: 864,
    height: 864,
    theme: "default",
    difficulty: "easy",
    generation: "burst",
    elevationMap: { type: "bowl", bowlDepthMm: 25, slopeAngleDeg: 25, tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 85, wallAngleDeg: 90 },
    slopePhysics: { gravityStrength: 0.5 },
    wall: { type: "circular", height: 85, material: "abs", restitution: 0.70 },
    exits: { count: 2, distribution: "symmetric", chordMm: 140 },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ── Beylin Temple (MFB anime) ─────────────────────────────────────────────
  {
    id: "beylin-temple-2d",
    displayName: "Beylin Temple (2.5D)",
    description: "Mountain temple training grounds. Elevated centre platform, wind gusts, ancient stone walls.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "ancient_temple",
    difficulty: "hard",
    generation: "anime",
    elevationMap: { type: "pyramid", peakHeightMm: 20, slopeAngleDeg: 15, tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 95, wallAngleDeg: 85 },
    slopePhysics: { gravityStrength: 0.7 },
    wall: { type: "circular", height: 95, material: "stone", restitution: 0.60 },
    exits: { count: 3, distribution: "symmetric", chordMm: 120 },
    windEffect: { enabled: true, strengthMs: 0.3, directionDeg: 270, gustIntervalMs: 5000 },
    floorMaterial: "stone",
    floorFriction: 0.18,
    createdAt: now, updatedAt: now,
  },

  // ── Nemesis Crisis Arena (4D anime finale) ────────────────────────────────
  {
    id: "nemesis-crisis-2d",
    displayName: "Nemesis Crisis Arena (2.5D)",
    description: "Apocalyptic finale arena. Void gravity wells, shrinking boundary, dark energy floor.",
    shape: "circle",
    width: 1200,
    height: 1200,
    theme: "quantum_realm",
    difficulty: "extreme",
    generation: "anime",
    elevationMap: { type: "bowl", bowlDepthMm: 35, slopeAngleDeg: 32, tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 110, wallAngleDeg: 85 },
    slopePhysics: { gravityStrength: 0.8 },
    wall: { type: "circular", height: 110, material: "void", restitution: 0.50 },
    exits: { count: 0, distribution: "none" },
    shrink: { enabled: true, startMs: 60000, endMs: 180000, minRadiusFraction: 0.4 },
    gravityWells: [
      { x: 0, y: 0, forceN: 0.005, radiusMm: 60 },
    ],
    floorMaterial: "void",
    floorFriction: 0.10,
    createdAt: now, updatedAt: now,
  },

  // ── Lost Scroll Arena (G-Revolution anime) ────────────────────────────────
  {
    id: "lost-scroll-arena-2d",
    displayName: "Lost Scroll Arena (2.5D)",
    description: "Desert ruins arena from G-Revolution. Sand traps slow movement, stone pillars create corridors.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "desert",
    difficulty: "hard",
    generation: "anime",
    elevationMap: { type: "bowl", bowlDepthMm: 22, slopeAngleDeg: 22, tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 90, wallAngleDeg: 88 },
    slopePhysics: { gravityStrength: 0.5 },
    wall: { type: "circular", height: 90, material: "sandstone", restitution: 0.55 },
    exits: { count: 3, distribution: "symmetric", chordMm: 130 },
    sandTraps: [
      { x: -80, y: 0, radiusMm: 50, frictionMultiplier: 3.0 },
      { x: 80, y: 0, radiusMm: 50, frictionMultiplier: 3.0 },
    ],
    pillars: [
      { x: 0, y: -60, radiusMm: 20 },
      { x: 0, y: 60, radiusMm: 20 },
    ],
    floorMaterial: "sand",
    floorFriction: 0.20,
    createdAt: now, updatedAt: now,
  },

  // ── Bey Colosseum Rome (G-Revolution anime) ───────────────────────────────
  {
    id: "bey-colosseum-rome-2d",
    displayName: "Bey Colosseum Rome (2.5D)",
    description: "Roman Colosseum from G-Revolution. Stone walls, multiple pillars, gladiatorial combat.",
    shape: "circle",
    width: 1200,
    height: 1200,
    theme: "prehistoric",
    difficulty: "hard",
    generation: "anime",
    elevationMap: { type: "flat", tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 120, wallAngleDeg: 90, spiked: true },
    slopePhysics: { gravityStrength: 0 },
    wall: { type: "circular", height: 120, material: "stone", restitution: 0.60, spiked: true },
    exits: { count: 2, distribution: "symmetric", chordMm: 100 },
    pillars: [
      { x: -70, y: -70, radiusMm: 25 },
      { x: 70, y: -70, radiusMm: 25 },
      { x: -70, y: 70, radiusMm: 25 },
      { x: 70, y: 70, radiusMm: 25 },
    ],
    floorMaterial: "stone",
    floorFriction: 0.18,
    createdAt: now, updatedAt: now,
  },

  // ── Spiral Mountain (original Beyblade anime) ─────────────────────────────
  {
    id: "spiral-mountain-2d",
    displayName: "Spiral Mountain (2.5D)",
    description: "Mountain arena from the original Beyblade anime. Auto-rotating with wind resistance.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "mountains",
    difficulty: "medium",
    generation: "anime",
    elevationMap: { type: "bowl", bowlDepthMm: 25, slopeAngleDeg: 25, tiltAngle: 5, tiltDirection: 0 },
    wallProfile: { baseHeight: 90, wallAngleDeg: 88 },
    slopePhysics: { gravityStrength: 0.55 },
    wall: { type: "circular", height: 90, material: "stone", restitution: 0.60 },
    exits: { count: 3, distribution: "symmetric", chordMm: 120 },
    autoRotate: { enabled: true, speedDegPerSec: 3, direction: "cw" },
    windEffect: { enabled: true, strengthMs: 0.2, directionDeg: 180, gustIntervalMs: 8000 },
    floorMaterial: "stone",
    floorFriction: 0.16,
    createdAt: now, updatedAt: now,
  },

  // ── Zero-G Stadium ────────────────────────────────────────────────────────
  {
    id: "zero-g-stadium-2d",
    displayName: "Zero-G Stadium (2.5D)",
    description: "Zero-G era official stadium. Tilting mechanism built into the base, synchrome-compatible.",
    shape: "circle",
    width: 864,
    height: 864,
    theme: "metrocity",
    difficulty: "hard",
    generation: "zero-g",
    elevationMap: { type: "bowl", bowlDepthMm: 25, slopeAngleDeg: 25, tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 85, wallAngleDeg: 90 },
    slopePhysics: { gravityStrength: 0.5 },
    wall: { type: "circular", height: 85, material: "abs", restitution: 0.70 },
    exits: { count: 3, distribution: "symmetric", chordMm: 140 },
    tilt: { angleDeg: 0, directionDeg: 0, autoTilt: true, tiltSpeedDegPerSec: 10, maxTiltDeg: 25 },
    floorMaterial: "abs",
    floorFriction: 0.15,
    createdAt: now, updatedAt: now,
  },

  // ── Bey Forest (MFB anime training) ───────────────────────────────────────
  {
    id: "bey-forest-2d",
    displayName: "Bey Forest (2.5D)",
    description: "Forest training ground from MFB. Natural bowl, tree-stump obstacles, healing spring.",
    shape: "circle",
    width: 1080,
    height: 1080,
    theme: "forest",
    difficulty: "medium",
    generation: "anime",
    elevationMap: { type: "bowl", bowlDepthMm: 20, slopeAngleDeg: 20, tiltAngle: 0, tiltDirection: 0 },
    wallProfile: { baseHeight: 80, wallAngleDeg: 85 },
    slopePhysics: { gravityStrength: 0.4 },
    wall: { type: "circular", height: 80, material: "wood", restitution: 0.55 },
    exits: { count: 3, distribution: "symmetric", chordMm: 140 },
    healingSpring: { x: 0, y: 0, radiusMm: 30, healPerSec: 3 },
    floorMaterial: "wood",
    floorFriction: 0.20,
    createdAt: now, updatedAt: now,
  },
];

async function seed() {
  try {
    console.log("\n══════════════════════════════════════");
    console.log("  Arena Systems (2.5D) Seed");
    console.log("══════════════════════════════════════\n");
    await clearCollection("arena_systems");

    for (const arena of arenaSystems) {
      await db.collection("arena_systems").doc(arena.id).set(arena);
      console.log(`  ✅ ${arena.displayName.padEnd(42)} [${arena.difficulty}] ${arena.generation}`);
    }

    console.log(`\n✅ Seeded ${arenaSystems.length} arena systems into arena_systems\n`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding arena systems:", error);
    process.exit(1);
  }
}

seed();

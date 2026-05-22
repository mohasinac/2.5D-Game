// scripts/seed-arenas.js
// Seeds 4 preset arenas into Firestore arenas collection.
// Run: node scripts/seed-arenas.js
// Idempotent — uses preset ID as document ID, safe to re-run.

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

// ─── Shared wall configs ──────────────────────────────────────────────────────

function circleWall(style = "metal", damage = 15, recoil = 8) {
  return {
    enabled: true,
    wallStyle: style,
    baseDamage: damage,
    recoilDistance: recoil,
    hasSpikes: false,
    spikeDamageMultiplier: 1.5,
    thickness: 3,
    edges: [],            // circles have no polygon edges
  };
}

function hexWall(style = "metal", damage = 18, recoil = 10) {
  // 6 edges for a hexagon
  const edges = Array.from({ length: 6 }, (_, i) => ({
    edge: i,
    walls: [{ position: 0, width: 100, thickness: 3 }],
  }));
  return {
    enabled: true,
    wallStyle: style,
    baseDamage: damage,
    recoilDistance: recoil,
    hasSpikes: false,
    spikeDamageMultiplier: 1.5,
    thickness: 3,
    edges,
  };
}

// ─── Preset definitions ───────────────────────────────────────────────────────

const now = new Date().toISOString();

const ARENAS = [
  // ── 1. Bey Stadium Classic ─────────────────────────────────────────────────
  // The training ground — clean circle, no hazards. Perfect for new players.
  {
    id: "bey-stadium-classic",
    name: "Bey Stadium Classic",
    description: "The original Beyblade stadium. Clean arena, no traps — pure skill decides the winner.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "metrocity",
    autoRotate: false,
    wall: circleWall("metal", 15, 8),
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.008,
    difficulty: "easy",
  },

  // ── 2. Forest Grove ────────────────────────────────────────────────────────
  // Nature-themed arena with a healing spring, scattered rocks, and a speed ring.
  {
    id: "forest-grove",
    name: "Forest Grove",
    description: "Ancient forest arena. A healing spring offers respite, but rocky obstacles lurk everywhere.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "forest",
    autoRotate: false,
    wall: circleWall("wood", 12, 6),
    obstacles: [
      { id: 1, x: -12, y: -12, radius: 2.5, health: 3, damage: 12, recoilDistance: 5, autoPlaced: false },
      { id: 2, x:  12, y: -12, radius: 2.5, health: 3, damage: 12, recoilDistance: 5, autoPlaced: false },
      { id: 3, x: -12, y:  12, radius: 2.5, health: 3, damage: 12, recoilDistance: 5, autoPlaced: false },
      { id: 4, x:  12, y:  12, radius: 2.5, health: 3, damage: 12, recoilDistance: 5, autoPlaced: false },
    ],
    waterBodies: [
      {
        id: "water1",
        type: "zone",
        liquidType: "healing",
        shape: "circle",
        position: { x: 0, y: 0 },
        radius: 6,
        opacity: 0.55,
        depth: 4,
        wavyEffect: true,
        effects: {
          healPerSecond: 3,
          spinBoostPerSecond: 20,
          frictionMultiplier: 1.0,
          showParticles: true,
          particleColor: "#6ee7b7",
        },
      },
    ],
    speedPaths: [
      {
        id: 1,
        radius: 16,
        shape: "circle",
        speedBoost: 1.6,
        spinBoost: 15,
        frictionMultiplier: 0.8,
        renderStyle: "outline",
        color: "#22c55e",
        autoPlaceChargePoints: true,
        chargePointCount: 2,
      },
    ],
    // V7: Shrink config + elevation/hazard zones
    shrink: { enabled: true, startMs: 60000, endMs: 180000, minRadiusFraction: 0.55, damageRatePerTick: 3, shrinkRateCmPerSec: 0.5, minRadiusCm: 80 },
    elevationZones: [
      { id: "elev1", x_cm: 0, y_cm: 0, radius_cm: 6, heightCm: 10, spinBoostOnPlatform: 15, edgeDropForce: 5 },
    ],
    floorHazardZones: [
      { id: "hz1", x_cm: -100, y_cm: 0, radius_cm: 30, hazardType: "lava", damagePerTick: 3, intensity: 1.0 },
    ],
    pits: [],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.012,
    surfaceFriction: 0.01,
    difficulty: "medium",
    beySpawn: {
      enabled: true,
      spawnIntervalSec: 30,
      maxSpawnedBeys: 2,
      despawnCondition: "knockout",
      beyPool: [
        { beyId: "storm-pegasus", statsMultiplier: 0.7, aiDifficulty: "medium", controlMode: "ai" },
      ],
    },
  },

  // ── 3. Volcanic Crater ─────────────────────────────────────────────────────
  // Desert hazard arena: lava moat, periodic-fire turrets, and two ring-out pits.
  {
    id: "volcanic-crater",
    name: "Volcanic Crater",
    description: "An active volcanic crater. Lava surrounds the edges and turrets punish careless beyblades.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "desert",
    autoRotate: false,
    wall: circleWall("stone", 20, 12),
    obstacles: [],
    waterBodies: [
      {
        id: "water1",
        type: "moat",
        liquidType: "lava",
        thickness: 5,
        distanceFromArena: 18,
        followsArenaShape: true,
        opacity: 0.8,
        depth: 8,
        wavyEffect: true,
        effects: {
          damagePerSecond: 5,
          speedLoss: 0.6,
          frictionMultiplier: 2.0,
          pushForce: 3,
          showParticles: true,
          particleColor: "#ff6b35",
        },
      },
    ],
    pits: [
      {
        id: 1,
        type: "crater",
        x: -10,
        y: -10,
        radius: 4,
        depth: 8,
        damagePerSecond: 25,
        pullForce: 4,
        escapeThreshold: 0.5,
      },
      {
        id: 2,
        type: "crater",
        x: 10,
        y: 10,
        radius: 4,
        depth: 8,
        damagePerSecond: 25,
        pullForce: 4,
        escapeThreshold: 0.5,
      },
    ],
    turrets: [
      {
        id: 1,
        x: -18, y: 0,
        radius: 3,
        health: 200,
        indestructible: false,
        attackType: "periodic",
        attackDamage: 18,
        attackRange: 25,
        attackCooldown: 3.5,
        bulletCount: 3,
        bulletSpread: 20,
        color: "#ef4444",
      },
      {
        id: 2,
        x: 18, y: 0,
        radius: 3,
        health: 200,
        indestructible: false,
        attackType: "periodic",
        attackDamage: 18,
        attackRange: 25,
        attackCooldown: 3.5,
        bulletCount: 3,
        bulletSpread: 20,
        color: "#ef4444",
      },
      {
        id: 3,
        x: 0, y: -18,
        radius: 3,
        health: 150,
        indestructible: false,
        attackType: "random",
        attackDamage: 12,
        attackRange: 22,
        attackCooldown: 2.5,
        color: "#f97316",
      },
    ],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.015,
    surfaceFriction: 0.012,
    difficulty: "hard",
    arenaTimeline: [
      { triggerMs: 20_000, type: "announcement", announcement: { text: "LAVA SURGE INCOMING!", style: "warning" } },
      { triggerMs: 30_000, type: "gravity_change", params: { multiplier: 1.5 } },
      { triggerMs: 45_000, type: "announcement", announcement: { text: "ERUPTION SUBSIDES", style: "info" } },
      { triggerMs: 45_000, type: "gravity_change", params: { multiplier: 1.0 } },
      { triggerMs: 90_000, type: "announcement", announcement: { text: "SUPER ERUPTION!", style: "danger" } },
      { triggerMs: 90_000, type: "gravity_change", params: { multiplier: 2.0 } },
      { triggerMs: 110_000, type: "gravity_change", params: { multiplier: 1.0 } },
      { triggerMs: 150_000, type: "announcement", announcement: { text: "FINAL ERUPTION — SURVIVE!", style: "danger" }, repeat: { intervalMs: 15_000, count: 2 } },
    ],
  },

  // ── 4. Cyber Grid ──────────────────────────────────────────────────────────
  // Futuristic hexagonal arena with portals, energy lanes, and an oil slick.
  // Slowly auto-rotates, rewarding spatial awareness.
  {
    id: "cyber-grid",
    name: "Cyber Grid",
    description: "A futuristic hexagonal grid arena. Portals link distant points; oil makes control treacherous.",
    width: 1080,
    height: 1080,
    shape: "hexagon",
    theme: "futuristic",
    autoRotate: true,
    rotationSpeed: 4,
    rotationDirection: "clockwise",
    wall: hexWall("metal", 18, 10),
    obstacles: [],
    waterBodies: [
      {
        id: "water1",
        type: "zone",
        liquidType: "oil",
        shape: "circle",
        position: { x: 0, y: 0 },
        radius: 7,
        opacity: 0.5,
        depth: 3,
        wavyEffect: false,
        effects: {
          speedBoost: 1.2,
          frictionMultiplier: 0.3,
          showParticles: true,
          particleColor: "#6b7280",
        },
      },
    ],
    speedPaths: [
      {
        id: 1,
        radius: 14,
        shape: "oval",
        speedBoost: 1.8,
        spinBoost: 20,
        frictionMultiplier: 0.7,
        width: 28,
        height: 18,
        rotation: 45,
        renderStyle: "outline",
        color: "#6366f1",
        autoPlaceChargePoints: true,
        chargePointCount: 2,
      },
      {
        id: 2,
        radius: 8,
        shape: "hexagon",
        speedBoost: 1.5,
        spinBoost: 10,
        frictionMultiplier: 0.85,
        renderStyle: "filled",
        color: "#8b5cf6",
      },
    ],
    portals: [
      {
        id: "portal-1",
        portalNumber: 1,
        inPoint:  { x: -16, y: 0 },
        outPoint: { x:  16, y: 0 },
        radius: 4,
        cooldown: 2.5,
        color: "#a855f7",
        bidirectional: true,
      },
      {
        id: "portal-2",
        portalNumber: 2,
        inPoint:  { x: 0, y: -16 },
        outPoint: { x: 0, y:  16 },
        radius: 4,
        cooldown: 2.5,
        color: "#ec4899",
        bidirectional: true,
      },
    ],
    pits: [],
    turrets: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.007,
    difficulty: "extreme",
    beySpawn: {
      enabled: true,
      spawnIntervalSec: 30,
      maxSpawnedBeys: 2,
      despawnCondition: "knockout",
      beyPool: [
        { beyId: "hells-hammer", statsMultiplier: 0.7, aiDifficulty: "medium", controlMode: "ai" },
      ],
    },
  },

  // ── 5. Crystal Cavern ──────────────────────────────────────────────────────
  {
    id: "crystal-cavern",
    name: "Crystal Cavern",
    description: "Icy crystalline cavern. Ice friction reduces control, but crystals provide obstacles.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "mountains",
    autoRotate: false,
    wall: circleWall("ice", 14, 7),
    obstacles: [
      { id: 1, x: -10, y: 0, radius: 3, health: 5, damage: 18, recoilDistance: 6, autoPlaced: false },
      { id: 2, x: 5, y: -9, radius: 3, health: 5, damage: 18, recoilDistance: 6, autoPlaced: false },
      { id: 3, x: 5, y: 9, radius: 3, health: 5, damage: 18, recoilDistance: 6, autoPlaced: false },
      { id: 4, x: 10, y: -5, radius: 2.5, health: 4, damage: 16, recoilDistance: 5, autoPlaced: false },
      { id: 5, x: 10, y: 5, radius: 2.5, health: 4, damage: 16, recoilDistance: 5, autoPlaced: false },
      { id: 6, x: -8, y: -8, radius: 2.5, health: 4, damage: 16, recoilDistance: 5, autoPlaced: false },
    ],
    waterBodies: [],
    speedPaths: [],
    pits: [],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.008,
    surfaceFriction: 0.003,
    difficulty: "medium",
  },

  // ── 6. Ancient Colosseum ────────────────────────────────────────────────────
  {
    id: "ancient-colosseum",
    name: "Ancient Colosseum",
    description: "Ancient ruins arena. Twin spike walls and stone pillars create complex navigation.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "prehistoric",
    autoRotate: false,
    wall: circleWall("stone", 18, 10),
    obstacles: [
      { id: 1, x: -10, y: -10, radius: 4, health: 8, damage: 25, recoilDistance: 12, autoPlaced: false },
      { id: 2, x: 10, y: -10, radius: 4, health: 8, damage: 25, recoilDistance: 12, autoPlaced: false },
      { id: 3, x: -10, y: 10, radius: 4, health: 8, damage: 25, recoilDistance: 12, autoPlaced: false },
      { id: 4, x: 10, y: 10, radius: 4, health: 8, damage: 25, recoilDistance: 12, autoPlaced: false },
    ],
    waterBodies: [],
    speedPaths: [],
    pits: [],
    turrets: [
      { id: 1, x: 0, y: -15, angle: 270, fireRate: 1.2, projectileSpeed: 8, damage: 20, bounces: 1 },
    ],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.01,
    difficulty: "hard",
  },

  // ── 7. Stormwatch Plateau ────────────────────────────────────────────────────
  {
    id: "stormwatch-plateau",
    name: "Stormwatch Plateau",
    description: "Windy high-altitude plateau. Intense air resistance and spiral speed rings.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "grasslands",
    autoRotate: true,
    rotationSpeed: 1,
    wall: circleWall("stone", 16, 9),
    obstacles: [],
    waterBodies: [],
    speedPaths: [
      {
        id: 1,
        radius: 18,
        shape: "circle",
        speedBoost: 1.8,
        spinBoost: 25,
        frictionMultiplier: 0.7,
        renderStyle: "spiral",
        color: "#60a5fa",
        autoPlaceChargePoints: true,
        chargePointCount: 3,
      },
    ],
    pits: [
      { id: 1, x: -12, y: 8, radius: 2.5, depth: 6 },
      { id: 2, x: 12, y: -8, radius: 2.5, depth: 6 },
    ],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.025,
    surfaceFriction: 0.006,
    difficulty: "hard",
  },

  // ── 8. Deep Sea Rift ────────────────────────────────────────────────────────
  {
    id: "deep-sea-rift",
    name: "Deep Sea Rift",
    description: "Hexagonal underwater arena. Acid zones and beam turrets for ultimate challenge.",
    width: 1080,
    height: 1080,
    shape: "hexagon",
    theme: "sea",
    autoRotate: false,
    wall: hexWall("coral", 20, 12),
    obstacles: [],
    waterBodies: [
      {
        id: "water1",
        type: "zone",
        liquidType: "acid",
        shape: "circle",
        position: { x: -15, y: 0 },
        radius: 7,
        opacity: 0.7,
        depth: 4,
        effects: {
          damagePerSecond: 4,
          speedMultiplier: 0.5,
          frictionMultiplier: 0.15,
          showParticles: true,
          particleColor: "#a16207",
        },
      },
      {
        id: "water2",
        type: "zone",
        liquidType: "acid",
        shape: "circle",
        position: { x: 15, y: 0 },
        radius: 7,
        opacity: 0.7,
        depth: 4,
        effects: {
          damagePerSecond: 4,
          speedMultiplier: 0.5,
          frictionMultiplier: 0.15,
          showParticles: true,
          particleColor: "#a16207",
        },
      },
    ],
    speedPaths: [],
    pits: [],
    turrets: [
      { id: 1, x: -18, y: 0, angle: 0, fireRate: 1.5, projectileSpeed: 10, damage: 22, bounces: 0 },
      { id: 2, x: 18, y: 0, angle: 180, fireRate: 1.5, projectileSpeed: 10, damage: 22, bounces: 0 },
      { id: 3, x: 0, y: -16, angle: 270, fireRate: 1.5, projectileSpeed: 10, damage: 22, bounces: 0 },
    ],
    portals: [],
    gravity: 0,
    airResistance: 0.015,
    surfaceFriction: 0.009,
    difficulty: "extreme",
  },

  // ── 9. Lava Core (Phase Z — new theme) ─────────────────────────────────────
  // Extreme volcanic arena. Electric hazard zones ring the center; wrecking ball
  // obstacle sweeps across the middle; embers fill the air.
  {
    id: "lava-core",
    name: "Lava Core",
    description: "The molten heart of a volcano. Electric discharge zones surround a central lava pit, and a wrecking ball swings through the arena.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "lava_core",
    autoRotate: true,
    rotationSpeed: 3,
    rotationDirection: "clockwise",
    wall: circleWall("stone", 25, 14),
    backgroundColor: "#2a0500",
    floorColor: "#4a0a00",
    backgroundParticles: { type: "embers", density: 35, direction: 355, affectedByArenaRotation: true },
    environmentalEffect: { preset: "volcanic", intensity: 1.0 },
    obstacles: [
      {
        id: 1, x: 0, y: 0, radius: 5, health: 999, damage: 30, recoilDistance: 12,
        indestructible: true,
        shape: { kind: "wrecking_ball", radiusCm: 5, cableLength: 18, swingAmplitudeDeg: 75, swingPeriodMs: 3500 },
        physics: { type: "wall", heightCm: 5 },
        featureAnimation: { preset: "charged", periodMs: 1200, color: "#ff6600" },
      },
    ],
    floorHazardZones: [
      { id: "hz1", x_cm: -12, y_cm: -12, radius_cm: 6, hazardType: "electric", disableTicks: 90, intensity: 1.2, featureAnimation: { preset: "lightning", periodMs: 800 } },
      { id: "hz2", x_cm:  12, y_cm: -12, radius_cm: 6, hazardType: "electric", disableTicks: 90, intensity: 1.2, featureAnimation: { preset: "lightning", periodMs: 800 } },
      { id: "hz3", x_cm: -12, y_cm:  12, radius_cm: 6, hazardType: "electric", disableTicks: 90, intensity: 1.2, featureAnimation: { preset: "lightning", periodMs: 800 } },
      { id: "hz4", x_cm:  12, y_cm:  12, radius_cm: 6, hazardType: "electric", disableTicks: 90, intensity: 1.2, featureAnimation: { preset: "lightning", periodMs: 800 } },
      { id: "hz5", x_cm: 0, y_cm: 0, radius_cm: 5, hazardType: "lava", damagePerTick: 8, spinDecayMult: 2.0, featureAnimation: { preset: "pulse", color: "#ff4400" } },
    ],
    waterBodies: [
      {
        id: "water1", type: "moat", liquidType: "lava",
        thickness: 4, distanceFromArena: 20, followsArenaShape: true,
        opacity: 0.85, depth: 10, wavyEffect: true,
        effects: { damagePerSecond: 8, speedLoss: 0.5, frictionMultiplier: 2.5, pushForce: 4, showParticles: true, particleColor: "#ff4400" },
      },
    ],
    speedPaths: [],
    pits: [],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.015,
    surfaceFriction: 0.014,
    difficulty: "extreme",
  },

  // ── 10. Storm Citadel (Phase Z — new theme) ─────────────────────────────────
  // A crumbling fortress battered by storms. Rain and wind push beys off-course;
  // tracking missiles from two turrets punish slow play.
  {
    id: "storm-citadel",
    name: "Storm Citadel",
    description: "A fortress in the eye of a permanent storm. Wind pushes beys toward the edges; tracking missiles keep pressure on.",
    width: 1080,
    height: 1080,
    shape: "octagon",
    theme: "storm_citadel",
    autoRotate: false,
    wall: hexWall("brick", 20, 10),
    backgroundColor: "#1a1a2a",
    floorColor: "#2a2a3a",
    backgroundParticles: { type: "rain", density: 40, direction: 5, affectedByArenaRotation: false },
    environmentalEffect: { preset: "storm", intensity: 0.8, intervalMs: 4000 },
    obstacles: [
      { id: 1, x: -14, y: -14, radius: 3, health: 999, damage: 20, recoilDistance: 8, indestructible: true, shape: { kind: "circle", radiusCm: 3 } },
      { id: 2, x:  14, y: -14, radius: 3, health: 999, damage: 20, recoilDistance: 8, indestructible: true, shape: { kind: "circle", radiusCm: 3 } },
      { id: 3, x: -14, y:  14, radius: 3, health: 999, damage: 20, recoilDistance: 8, indestructible: true, shape: { kind: "circle", radiusCm: 3 } },
      { id: 4, x:  14, y:  14, radius: 3, health: 999, damage: 20, recoilDistance: 8, indestructible: true, shape: { kind: "circle", radiusCm: 3 } },
    ],
    turrets: [
      {
        id: 1, x: 0, y: -20, radius: 3, health: 999, indestructible: true,
        attackType: "tracking_missile", attackDamage: 22, attackRange: 35, attackCooldown: 5,
        missileTrackingDeg: 120, firePattern: "lowest_spin",
        color: "#7c3aed",
        featureAnimation: { preset: "alert", periodMs: 500 },
      },
      {
        id: 2, x: 0, y: 20, radius: 3, health: 999, indestructible: true,
        attackType: "tracking_missile", attackDamage: 22, attackRange: 35, attackCooldown: 5,
        missileTrackingDeg: 120, firePattern: "lowest_spin",
        color: "#7c3aed",
        featureAnimation: { preset: "alert", periodMs: 500 },
      },
    ],
    speedPaths: [
      { id: 1, radius: 10, shape: "circle", speedBoost: 1.5, spinBoost: 12, frictionMultiplier: 0.8, renderStyle: "dashed", color: "#6366f1", showDirectionArrows: true, arrowSpeedCmPerSec: 8, arrowColor: "#a5b4fc" },
    ],
    effectZones: [
      { id: "ez1", x_cm: 0, y_cm: 0, radius_cm: 6, effectType: "safe_zone", featureAnimation: { preset: "shimmer", color: "#60a5fa" } },
    ],
    waterBodies: [],
    pits: [],
    portals: [],
    gravity: 0,
    airResistance: 0.012,
    surfaceFriction: 0.01,
    difficulty: "hard",
    arenaTimeline: [
      { triggerMs: 15_000, type: "announcement", announcement: { text: "STORM INTENSIFIES", style: "warning" } },
      { triggerMs: 15_000, type: "arena_tilt", params: { angleDeg: 8, directionDeg: 0 } },
      { triggerMs: 40_000, type: "announcement", announcement: { text: "EYE OF THE STORM", style: "info" } },
      { triggerMs: 40_000, type: "arena_tilt", params: { angleDeg: 0, directionDeg: 0 } },
      { triggerMs: 60_000, type: "activate_feature", featureId: "ez1" },
      { triggerMs: 80_000, type: "announcement", announcement: { text: "STORM SURGE!", style: "danger" } },
      { triggerMs: 80_000, type: "arena_tilt", params: { angleDeg: 15, directionDeg: 90 } },
      { triggerMs: 80_000, type: "gravity_change", params: { multiplier: 1.3 } },
      { triggerMs: 120_000, type: "arena_tilt", params: { angleDeg: 0, directionDeg: 0 } },
      { triggerMs: 120_000, type: "gravity_change", params: { multiplier: 1.0 } },
      { triggerMs: 120_000, type: "deactivate_feature", featureId: "ez1" },
      { triggerMs: 150_000, type: "announcement", announcement: { text: "FINAL STORM — NO SHELTER!", style: "danger" } },
      { triggerMs: 150_000, type: "arena_tilt", params: { angleDeg: 20, directionDeg: 180 }, repeat: { intervalMs: 20_000, count: 2 } },
    ],
  },

  // ── 11. Quantum Realm (Phase Z — new theme) ──────────────────────────────────
  // A dimension where physics behaves strangely. A spin zone dominates the center;
  // four portals create chaotic teleportation; an EMP turret disrupts combos.
  {
    id: "quantum-realm",
    name: "Quantum Realm",
    description: "A sub-dimensional arena where gravity bends. Central spin zone and portals create unpredictable bey paths.",
    width: 1080,
    height: 1080,
    shape: "star5",
    theme: "quantum_realm",
    autoRotate: true,
    rotationSpeed: 5,
    rotationDirection: "counterclockwise",
    wall: hexWall("metal", 16, 9),
    backgroundColor: "#000010",
    floorColor: "#0a0020",
    backgroundParticles: { type: "stars", density: 20, affectedByArenaRotation: false },
    spinZones: [
      { id: "sz1", x_cm: 0, y_cm: 0, radius_cm: 10, direction: "cw", intensityRadPerSec: 4.0, applyTo: "both", behaviorId: "movement.orbit", featureAnimation: { preset: "shockwave_ring", periodMs: 2000, color: "#8b5cf6" } },
    ],
    portals: [
      { id: "portal1", portalNumber: 1, position: { x: -18, y: 0 }, radius: 3.5, cooldown: 3, color: "#a855f7", autoPlace: false },
      { id: "portal2", portalNumber: 2, position: { x:  18, y: 0 }, radius: 3.5, cooldown: 3, color: "#ec4899", autoPlace: false },
      { id: "portal3", portalNumber: 3, position: { x: 0, y: -18 }, radius: 3.5, cooldown: 3, color: "#06b6d4", autoPlace: false },
      { id: "portal4", portalNumber: 4, position: { x: 0, y:  18 }, radius: 3.5, cooldown: 3, color: "#10b981", autoPlace: false },
    ],
    turrets: [
      {
        id: 1, x: -16, y: -16, radius: 2.5, health: 999, indestructible: true,
        attackType: "emp", attackDamage: 5, attackRange: 28, attackCooldown: 7,
        empDisableTicks: 120, firePattern: "nearest",
        color: "#6366f1",
        featureAnimation: { preset: "charged", periodMs: 1500 },
      },
    ],
    gravityHoles: [
      { id: "gh1", x_cm: 0, y_cm: 0, forceN: 0.003, effectiveRadiusCm: 8, activeMs: 2000, intervalMs: 4000, warningMs: 600, visibility: "warning-only", featureAnimation: { preset: "ghost", periodMs: 2000 } },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    speedPaths: [],
    gravity: 0,
    airResistance: 0.005,
    surfaceFriction: 0.004,
    difficulty: "extreme",
  },

  // ── 12. Test Arena (Spawn) — E2E testing ──────────────────────────────────
  // Minimal circular arena designed for spawn-interval E2E tests.
  // spawnIntervalSec is intentionally very short (5 s) for fast test feedback.
  {
    id: "test-arena-spawn",
    name: "Test Arena (Spawn)",
    description: "Minimal E2E test arena with fast bey spawning. Not intended for regular play.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "metrocity",
    autoRotate: false,
    wall: circleWall("metal", 15, 8),
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.008,
    difficulty: "easy",
    beySpawn: {
      enabled: true,
      spawnIntervalSec: 5,
      maxSpawnedBeys: 3,
      despawnCondition: "knockout",
      beyPool: [
        { beyId: "storm-pegasus", statsMultiplier: 0.5, aiDifficulty: "medium", controlMode: "ai" },
      ],
    },
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seedArenas() {
  console.log("\n══════════════════════════════════════");
  console.log("  Arena Preset Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("arenas");

  for (const arena of ARENAS) {
    const docData = {
      ...arena,
      createdAt: now,
      updatedAt: now,
      createdBy: "seed",
    };

    const obstCount  = (arena.obstacles   ?? []).length;
    const pitCount   = (arena.pits        ?? []).length;
    const turretCount= (arena.turrets     ?? []).length;
    const loopCount  = (arena.speedPaths  ?? []).length;
    const portalCount= (arena.portals     ?? []).length;
    const waterCount = (arena.waterBodies ?? []).length;

    try {
      await db.collection("arenas").doc(arena.id).set(docData, { merge: false });
      const features = [
        obstCount   ? `🪨${obstCount} obs`    : null,
        pitCount    ? `🕳${pitCount} pits`    : null,
        turretCount ? `🔫${turretCount} turr` : null,
        loopCount   ? `⚡${loopCount} loops`  : null,
        portalCount ? `🌀${portalCount} portals` : null,
        waterCount  ? `💧${waterCount} liquid`  : null,
      ].filter(Boolean).join("  ");

      console.log(`  ✔ ${arena.name.padEnd(24)} [${arena.shape.padEnd(8)} / ${arena.theme.padEnd(11)}]  ${features || "(no features)"}`);
    } catch (err) {
      console.error(`  ✘ ${arena.name}: ${err.message}`);
    }
  }

  console.log(`\n✅ Seeded ${ARENAS.length} arenas into arenas collection\n`);
}

seedArenas()
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

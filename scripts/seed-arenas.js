// scripts/seed-arenas.js
// Seeds arena presets into Firestore arenas collection.
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

function rectWall(style = "metal", damage = 20, recoil = 12, thickness = 4) {
  return {
    enabled: true,
    wallStyle: style,
    baseDamage: damage,
    recoilDistance: recoil,
    hasSpikes: false,
    spikeDamageMultiplier: 1.5,
    thickness,
    edges: Array.from({ length: 4 }, (_, i) => ({
      edge: i,
      walls: [{ position: 0, width: 100, thickness }],
    })),
  };
}

function spikedCircleWall(style = "metal", damage = 22, recoil = 14) {
  return {
    enabled: true,
    wallStyle: style,
    baseDamage: damage,
    recoilDistance: recoil,
    hasSpikes: true,
    spikeDamageMultiplier: 2.0,
    thickness: 3,
    edges: [],
  };
}

// ─── Preset definitions ───────────────────────────────────────────────────────

const now = new Date().toISOString();

const ARENAS = [
  // ════════════════════════════════════════════════════════════════════════════
  //  EXISTING ARENAS (1–21) — DO NOT REMOVE
  // ════════════════════════════════════════════════════════════════════════════

  // ── 1. Bey Stadium Classic ─────────────────────────────────────────────────
  // The training ground — clean circle, no hazards. Perfect for new players.
  {
    id: "bey-stadium-classic",
    name: "Bey Stadium Classic",
    description: "The original Beyblade stadium. Clean arena, no traps — pure skill decides the winner.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "default",
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
    links: [
      {
        id: "fg-link-pit-a",
        pairedLinkId: "fg-link-trampoline-b",
        fromArenaId: "forest-grove",
        toArenaId: "forest-grove",
        linkType: "pit",
        boundaryLine: { x1: -15, y1: 10, x2: -10, y2: 10 },
        exitPosition: { x: 15, y: -10 },
        momentumPreserved: false,
        levelDelta: -40,
        hazardDamage: 30,
        reverseCondition: "never",
        cooldownTicks: 120,
        exitVelocityMult: 0.2,
      },
      {
        id: "fg-link-trampoline-b",
        pairedLinkId: "fg-link-pit-a",
        fromArenaId: "forest-grove",
        toArenaId: "forest-grove",
        linkType: "trampoline",
        boundaryLine: { x1: 10, y1: -12, x2: 20, y2: -12 },
        exitPosition: { x: -12, y: 8 },
        momentumPreserved: true,
        levelDelta: 40,
        hazardDamage: 0,
        reverseCondition: "always",
        cooldownTicks: 60,
        exitVelocityMult: 2.5,
      },
    ],
    beyLinks: [
      {
        // tip_stack: attacker's spinning TIP (bottom) grinds on defender's BIT CHIP (top).
        // Kai's Dranzer S style — vertical drill/peck attack from above.
        // Victim can press a single key to break free (QTE escape).
        id: "fg-bey-stack-hostile",
        linkType: "tip_stack",
        alignment: "hostile",
        entryRadiusCm: 3,
        triggerCondition: "opponent_only",
        qteEscapable: true,
        qteWindowTicks: 60,
        linkEffects: [
          // Drill peck every 15 ticks — tip grinds bit chip, forces victim radially
          { type: "drill_attack", intensityPerTick: 3, intervalTicks: 15, impactMult: 2.0 },
          // Continuous spin drain between pecks
          { type: "spin_drain", intensityPerTick: 1.5 },
          // Periodic destabilize bursts
          { type: "destabilize", intensityPerTick: 6, intervalTicks: 20 },
        ],
        cooldownTicks: 120,
        maxSimultaneous: 2,
        maxDurationTicks: 300,    // 5 sec max — attacker can't grind forever
        breakThreshold: 25,       // a moderate hit from a 3rd bey knocks the driller off
        breakOnRingOut: true,
      },
      {
        // top_mount: attacker rides atop partner. Dynasty team style — cooperative combo.
        // Two friendly beys spinning together in contact to combine power.
        id: "fg-bey-stack-top-mount",
        linkType: "top_mount",
        alignment: "friendly",
        entryRadiusCm: 2.5,
        triggerCondition: "same_team",
        linkEffects: [
          { type: "spin_share", intensityPerTick: 0.05 },
          { type: "damage_boost", intensityPerTick: 0.25 },
          { type: "shield_boost", intensityPerTick: 0.15 },
        ],
        cooldownTicks: 120,
        maxSimultaneous: 2,
        maxDurationTicks: 360,    // 6 sec — must re-establish contact
        breakThreshold: 20,       // enemy hit of 20+ shatters the formation
        breakOnRingOut: true,
      },
      {
        // side_spin: beys spin side-by-side. Circus-style power combo.
        id: "fg-bey-stack-friendly",
        linkType: "side_spin",
        alignment: "friendly",
        entryRadiusCm: 5,
        triggerCondition: "same_team",
        linkEffects: [
          { type: "spin_share", intensityPerTick: 0.02 },
          { type: "spin_heal", intensityPerTick: 2 },
          { type: "damage_boost", intensityPerTick: 0.3 },
        ],
        cooldownTicks: 180,
        maxSimultaneous: 3,
        maxDurationTicks: 480,    // 8 sec
        breakThreshold: 15,       // fragile — any solid hit from outside breaks it
        breakOnRingOut: true,
      },
      {
        // Hostile dogfight — continuous rapid collisions forcing both beys apart
        id: "fg-bey-stack-dogfight",
        linkType: "side_spin",
        alignment: "hostile",
        entryRadiusCm: 4,
        triggerCondition: "opponent_only",
        qteEscapable: true,
        qteWindowTicks: 45,
        linkEffects: [
          { type: "continuous_collision", intensityPerTick: 5, intervalTicks: 8, impactMult: 0.6 },
          { type: "spin_drain", intensityPerTick: 0.8 },
        ],
        cooldownTicks: 90,
        maxSimultaneous: 2,
        maxDurationTicks: 240,    // 4 sec dogfight window
        breakThreshold: 30,       // hard to interrupt — needs a heavy external hit
        breakOnRingOut: false,    // dogfight can continue near the edge
      },
      {
        // Force lock — attacker pulls victim into orbit, draining stamina
        id: "fg-bey-stack-orbit-lock",
        linkType: "side_spin",
        alignment: "hostile",
        entryRadiusCm: 6,
        triggerCondition: "opponent_only",
        qteEscapable: true,
        qteWindowTicks: 90,
        linkEffects: [
          { type: "force_lock", intensityPerTick: 3 },
          { type: "spin_drain", intensityPerTick: 1 },
          { type: "control_loss", intensityPerTick: 1, intervalTicks: 120, controlMode: "scramble", controlDurationTicks: 45 },
        ],
        cooldownTicks: 150,
        maxSimultaneous: 2,
        maxDurationTicks: 420,    // 7 sec orbit window
        breakThreshold: 35,       // very strong pull — needs a big hit to sever
        breakOnRingOut: true,     // orbit lock breaks at ring edge so it's not a death trap
      },
    ],
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

  // ── 12. Xtreme Cross Stadium — BX scoring zones + gear rails ─────────────
  {
    id: "xtreme-cross-stadium",
    name: "Xtreme Cross Stadium",
    description: "BX-gen Xtreme Stadium. Gear rails launch beys at ring-out speed; scoring zones award points on knockout.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "metrocity",
    autoRotate: false,
    wall: circleWall("metal", 20, 12),
    scoringMode: "points",
    pointsTarget: 3,
    scoringZones: [
      { id: "sz-xtreme-ne", kind: "xtreme", x_cm: 14, y_cm: -14, radius_cm: 5, points: 1, color: "#ef4444" },
      { id: "sz-xtreme-sw", kind: "xtreme", x_cm: -14, y_cm: 14, radius_cm: 5, points: 1, color: "#3b82f6" },
      { id: "sz-over-n",   kind: "over",   x_cm: 0, y_cm: -18, radius_cm: 4, points: 2, color: "#f59e0b" },
    ],
    gearRails: [
      {
        id: "rail-e",
        polylineCm: [{ x: 10, y: 0 }, { x: 16, y: 6 }, { x: 20, y: 14 }],
        speedBoostPermille: 800,
        requiresGearCompatibleBit: false,
        boostDurationMs: 400,
        exitZoneIds: ["sz-xtreme-ne"],
        color: "#f59e0b",
      },
      {
        id: "rail-w",
        polylineCm: [{ x: -10, y: 0 }, { x: -16, y: -6 }, { x: -20, y: -14 }],
        speedBoostPermille: 800,
        requiresGearCompatibleBit: false,
        boostDurationMs: 400,
        exitZoneIds: ["sz-xtreme-sw"],
        color: "#3b82f6",
      },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.008,
    surfaceFriction: 0.006,
    difficulty: "medium",
  },

  // ── 13. Tornado Twist — MFB tornado ridge ──────────────────────────────────
  {
    id: "tornado-twist",
    name: "Tornado Twist",
    description: "Classic MFB Tornado stadium — the ridge channels beys into high-speed orbital collisions.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "metrocity",
    autoRotate: false,
    wall: circleWall("metal", 18, 10),
    tornadoRidge: {
      radiusCm: 14,
      widthCm: 4,
      orbitIntensity: 0.006,
      direction: "cw",
      spinBoostPercent: 15,
    },
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.008,
    difficulty: "medium",
  },

  // ── 14. Zero-G Lab — floating arena, shifting gravity ──────────────────────
  {
    id: "zero-g-lab",
    name: "Zero-G Lab",
    description: "Experimental zero-gravity arena. Gravity cycles direction every few seconds — adapt or fall.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "quantum_realm",
    autoRotate: true,
    rotationSpeed: 3,
    rotationDirection: "clockwise",
    wall: circleWall("metal", 14, 8),
    zeroG: {
      tiltPeriodMs: 4000,
      maxTiltDeg: 25,
      minGravityScale: 0.1,
      rotatingAxis: true,
    },
    staminaDrainMultiplier: 0.7,
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.003,
    surfaceFriction: 0.003,
    difficulty: "hard",
  },

  // ── 15. Battle Box — rectangle arena, close-quarters ──────────────────────
  {
    id: "battle-box",
    name: "Battle Box",
    description: "Rectangular arena with no escape — walls bounce hard, every hit counts.",
    width: 1200,
    height: 900,
    shape: "rectangle",
    theme: "metrocity",
    autoRotate: false,
    wall: {
      enabled: true,
      wallStyle: "metal",
      baseDamage: 20,
      recoilDistance: 12,
      hasSpikes: false,
      spikeDamageMultiplier: 1.5,
      thickness: 4,
      edges: Array.from({ length: 4 }, (_, i) => ({
        edge: i,
        walls: [{ position: 0, width: 100, thickness: 4 }],
      })),
    },
    obstacles: [
      { id: 1, x: -15, y: 0, radius: 3, health: 5, damage: 10, recoilDistance: 6, autoPlaced: false },
      { id: 2, x:  15, y: 0, radius: 3, health: 5, damage: 10, recoilDistance: 6, autoPlaced: false },
    ],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.015,
    surfaceFriction: 0.012,
    difficulty: "hard",
  },

  // ── 16. Speed Circuit — gear-rail race track ────────────────────────────────
  {
    id: "speed-circuit",
    name: "Speed Circuit",
    description: "High-speed rail circuit with GearBit gimmick slots. Ride the rails to score Xtreme points.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "metrocity",
    autoRotate: false,
    wall: circleWall("metal", 16, 9),
    scoringMode: "points",
    pointsTarget: 5,
    scoringZones: [
      { id: "sz-finish", kind: "xtreme", x_cm: 0, y_cm: -20, radius_cm: 6, points: 1, color: "#f59e0b" },
    ],
    gearRails: [
      {
        id: "rail-cw-1",
        polylineCm: [{ x: 0, y: 18 }, { x: 13, y: 13 }, { x: 18, y: 0 }, { x: 13, y: -13 }, { x: 0, y: -18 }],
        speedBoostPermille: 1000,
        requiresGearCompatibleBit: true,
        boostDurationMs: 600,
        exitZoneIds: ["sz-finish"],
        color: "#f59e0b",
      },
      {
        id: "rail-ccw-1",
        polylineCm: [{ x: 0, y: -18 }, { x: -13, y: -13 }, { x: -18, y: 0 }, { x: -13, y: 13 }, { x: 0, y: 18 }],
        speedBoostPermille: 900,
        requiresGearCompatibleBit: false,
        boostDurationMs: 500,
        exitZoneIds: [],
        color: "#3b82f6",
      },
    ],
    staminaDrainMultiplier: 1.2,
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.006,
    surfaceFriction: 0.005,
    difficulty: "extreme",
  },

  // ── 17. Hot Wheels Turbo — Ground Floor ──────────────────────────────────────
  {
    id: "hw-ground-floor",
    name: "Hot Wheels Turbo — Ground Level",
    description: "Neon-lit speed circuit at ground level. The outer ring loop rockets beys into the supercharger elevator up to the mid-floor crossing.",
    width: 1200,
    height: 1200,
    shape: "circle",
    theme: "futuristic",
    autoRotate: false,
    floorGroupId: "hw-turbo-stadium",
    floorIndex: 0,
    wall: circleWall("metal", 18, 10),
    speedPaths: [
      {
        id: 1,
        shape: "ring",
        radius: 20,
        width: 5,
        speedBoost: 2.0,
        spinBoost: 30,
        frictionMultiplier: 0.6,
        renderStyle: "filled",
        color: "#f59e0b",
        showDirectionArrows: true,
        arrowSpeedCmPerSec: 12,
        arrowColor: "#fcd34d",
        bumpProfile: [
          { angleDeg: 0,   heightCm: 3, widthCm: 6 },
          { angleDeg: 90,  heightCm: 3, widthCm: 6 },
          { angleDeg: 180, heightCm: 3, widthCm: 6 },
          { angleDeg: 270, heightCm: 3, widthCm: 6 },
        ],
      },
      {
        id: 2,
        shape: "figure_8",
        radius: 10,
        speedBoost: 1.8,
        spinBoost: 20,
        frictionMultiplier: 0.7,
        renderStyle: "outline",
        color: "#ef4444",
        showDirectionArrows: true,
        arrowColor: "#fca5a5",
      },
    ],
    bumps: [
      { id: "hw-g-bump-n", x_cm:  0,  y_cm: -20, radius_cm: 3, popHeight_cm: 8, recoil: 0.6 },
      { id: "hw-g-bump-e", x_cm:  20, y_cm:   0, radius_cm: 3, popHeight_cm: 8, recoil: 0.6 },
      { id: "hw-g-bump-s", x_cm:  0,  y_cm:  20, radius_cm: 3, popHeight_cm: 8, recoil: 0.6 },
      { id: "hw-g-bump-w", x_cm: -20, y_cm:   0, radius_cm: 3, popHeight_cm: 8, recoil: 0.6 },
    ],
    spinZones: [
      { id: "hw-g-sz1", x_cm:   0, y_cm:   0, radius_cm: 6, direction: "cw",  intensityRadPerSec: 3.0, applyTo: "both"   },
      { id: "hw-g-sz2", x_cm: -14, y_cm: -14, radius_cm: 4, direction: "ccw", intensityRadPerSec: 2.0, applyTo: "linear" },
      { id: "hw-g-sz3", x_cm:  14, y_cm:  14, radius_cm: 4, direction: "cw",  intensityRadPerSec: 2.0, applyTo: "linear" },
    ],
    links: [
      {
        id: "hw-g-elev-up",
        pairedLinkId: "hw-m-elev-land-from-ground",
        fromArenaId: "hw-ground-floor",
        toArenaId: "hw-mid-floor",
        linkType: "trampoline",
        boundaryLine: { x1: -4, y1: -24, x2: 4, y2: -24 },
        exitPosition: { x: 0, y: -18 },
        momentumPreserved: true,
        levelDelta: 80,
        hazardDamage: 0,
        reverseCondition: "never",
        cooldownTicks: 90,
        exitVelocityMult: 2.0,
      },
      {
        id: "hw-g-elev-land-from-mid",
        pairedLinkId: "hw-m-elev-down",
        fromArenaId: "hw-mid-floor",
        toArenaId: "hw-ground-floor",
        linkType: "pit",
        boundaryLine: { x1: -4, y1: 24, x2: 4, y2: 24 },
        exitPosition: { x: 0, y: 18 },
        momentumPreserved: false,
        levelDelta: -80,
        hazardDamage: 0,
        reverseCondition: "never",
        cooldownTicks: 90,
        exitVelocityMult: 0.5,
      },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.008,
    surfaceFriction: 0.005,
    difficulty: "hard",
  },

  // ── 18. Hot Wheels Turbo — Mid Floor ──────────────────────────────────────────
  {
    id: "hw-mid-floor",
    name: "Hot Wheels Turbo — Mid Level",
    description: "The banked figure-8 crossing floor. Opposing spin zones at the crossover create chaotic orbital collisions. Elevators link all three floors.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "futuristic",
    autoRotate: false,
    floorGroupId: "hw-turbo-stadium",
    floorIndex: 1,
    wall: circleWall("metal", 16, 9),
    speedPaths: [
      {
        id: 1,
        shape: "figure_8",
        radius: 16,
        speedBoost: 2.2,
        spinBoost: 35,
        frictionMultiplier: 0.55,
        renderStyle: "filled",
        color: "#3b82f6",
        showDirectionArrows: true,
        arrowSpeedCmPerSec: 14,
        arrowColor: "#93c5fd",
        bumpProfile: [
          { angleDeg: 0,   heightCm: 4, widthCm: 5 },
          { angleDeg: 180, heightCm: 4, widthCm: 5 },
        ],
      },
      {
        id: 2,
        shape: "zigzag",
        radius: 8,
        speedBoost: 1.7,
        spinBoost: 15,
        frictionMultiplier: 0.75,
        renderStyle: "outline",
        color: "#6366f1",
      },
    ],
    bumps: [
      { id: "hw-m-bump-c",  x_cm:  0,  y_cm:  0, radius_cm: 3,   popHeight_cm: 10, recoil: 0.8 },
      { id: "hw-m-bump-e",  x_cm:  16, y_cm:  0, radius_cm: 2.5, popHeight_cm:  6, recoil: 0.5 },
      { id: "hw-m-bump-w",  x_cm: -16, y_cm:  0, radius_cm: 2.5, popHeight_cm:  6, recoil: 0.5 },
    ],
    spinZones: [
      { id: "hw-m-sz1", x_cm:   0, y_cm:  8, radius_cm: 7, direction: "cw",  intensityRadPerSec: 3.5, applyTo: "both"   },
      { id: "hw-m-sz2", x_cm:   0, y_cm: -8, radius_cm: 7, direction: "ccw", intensityRadPerSec: 3.5, applyTo: "both"   },
      { id: "hw-m-sz3", x_cm: -12, y_cm: 12, radius_cm: 4, direction: "cw",  intensityRadPerSec: 2.0, applyTo: "linear" },
    ],
    links: [
      {
        id: "hw-m-elev-down",
        pairedLinkId: "hw-g-elev-land-from-mid",
        fromArenaId: "hw-mid-floor",
        toArenaId: "hw-ground-floor",
        linkType: "pit",
        boundaryLine: { x1: -4, y1: -20, x2: 4, y2: -20 },
        exitPosition: { x: 0, y: 18 },
        momentumPreserved: false,
        levelDelta: -80,
        hazardDamage: 0,
        reverseCondition: "never",
        cooldownTicks: 90,
        exitVelocityMult: 0.5,
      },
      {
        id: "hw-m-elev-land-from-ground",
        pairedLinkId: "hw-g-elev-up",
        fromArenaId: "hw-ground-floor",
        toArenaId: "hw-mid-floor",
        linkType: "trampoline",
        boundaryLine: { x1: -4, y1: -18, x2: 4, y2: -18 },
        exitPosition: { x: 0, y: -16 },
        momentumPreserved: true,
        levelDelta: 80,
        hazardDamage: 0,
        reverseCondition: "never",
        cooldownTicks: 90,
        exitVelocityMult: 1.5,
      },
      {
        id: "hw-m-elev-up",
        pairedLinkId: "hw-t-elev-land-from-mid",
        fromArenaId: "hw-mid-floor",
        toArenaId: "hw-top-floor",
        linkType: "trampoline",
        boundaryLine: { x1: -4, y1: 20, x2: 4, y2: 20 },
        exitPosition: { x: 0, y: 14 },
        momentumPreserved: true,
        levelDelta: 80,
        hazardDamage: 0,
        reverseCondition: "never",
        cooldownTicks: 90,
        exitVelocityMult: 2.0,
      },
      {
        id: "hw-m-elev-land-from-top",
        pairedLinkId: "hw-t-elev-down",
        fromArenaId: "hw-top-floor",
        toArenaId: "hw-mid-floor",
        linkType: "pit",
        boundaryLine: { x1: -4, y1: 18, x2: 4, y2: 18 },
        exitPosition: { x: 0, y: 16 },
        momentumPreserved: false,
        levelDelta: -80,
        hazardDamage: 0,
        reverseCondition: "never",
        cooldownTicks: 90,
        exitVelocityMult: 0.5,
      },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.006,
    difficulty: "hard",
  },

  // ── 19. Hot Wheels Turbo — Top Floor ──────────────────────────────────────────
  {
    id: "hw-top-floor",
    name: "Hot Wheels Turbo — Top Level",
    description: "The rooftop spiral finish — fastest floor. A central vortex spin zone flings beys outward. Only one elevator drops back to the mid-floor.",
    width: 900,
    height: 900,
    shape: "circle",
    theme: "futuristic",
    autoRotate: true,
    rotationSpeed: 6,
    rotationDirection: "clockwise",
    floorGroupId: "hw-turbo-stadium",
    floorIndex: 2,
    wall: circleWall("metal", 22, 12),
    speedPaths: [
      {
        id: 1,
        shape: "spiral",
        radius: 16,
        speedBoost: 2.5,
        spinBoost: 45,
        frictionMultiplier: 0.5,
        renderStyle: "filled",
        color: "#10b981",
        showDirectionArrows: true,
        arrowSpeedCmPerSec: 18,
        arrowColor: "#6ee7b7",
        bumpProfile: [
          { angleDeg:  45, heightCm: 5, widthCm: 4 },
          { angleDeg: 135, heightCm: 5, widthCm: 4 },
          { angleDeg: 225, heightCm: 5, widthCm: 4 },
          { angleDeg: 315, heightCm: 5, widthCm: 4 },
        ],
      },
    ],
    bumps: [
      { id: "hw-t-bump-ne", x_cm:  12, y_cm: -12, radius_cm: 2.5, popHeight_cm: 12, recoil: 1.0 },
      { id: "hw-t-bump-nw", x_cm: -12, y_cm: -12, radius_cm: 2.5, popHeight_cm: 12, recoil: 1.0 },
      { id: "hw-t-bump-se", x_cm:  12, y_cm:  12, radius_cm: 2.5, popHeight_cm: 12, recoil: 1.0 },
      { id: "hw-t-bump-sw", x_cm: -12, y_cm:  12, radius_cm: 2.5, popHeight_cm: 12, recoil: 1.0 },
    ],
    spinZones: [
      { id: "hw-t-sz1", x_cm:  0,  y_cm:  0, radius_cm: 8, direction: "cw",  intensityRadPerSec: 5.0, applyTo: "both"   },
      { id: "hw-t-sz2", x_cm: -10, y_cm:  0, radius_cm: 4, direction: "ccw", intensityRadPerSec: 3.0, applyTo: "linear" },
      { id: "hw-t-sz3", x_cm:  10, y_cm:  0, radius_cm: 4, direction: "cw",  intensityRadPerSec: 3.0, applyTo: "linear" },
      { id: "hw-t-sz4", x_cm:  0,  y_cm: -10, radius_cm: 4, direction: "cw",  intensityRadPerSec: 2.5, applyTo: "spin"   },
    ],
    links: [
      {
        id: "hw-t-elev-down",
        pairedLinkId: "hw-m-elev-land-from-top",
        fromArenaId: "hw-top-floor",
        toArenaId: "hw-mid-floor",
        linkType: "pit",
        boundaryLine: { x1: -4, y1: 16, x2: 4, y2: 16 },
        exitPosition: { x: 0, y: 16 },
        momentumPreserved: false,
        levelDelta: -80,
        hazardDamage: 0,
        reverseCondition: "never",
        cooldownTicks: 90,
        exitVelocityMult: 0.5,
      },
      {
        id: "hw-t-elev-land-from-mid",
        pairedLinkId: "hw-m-elev-up",
        fromArenaId: "hw-mid-floor",
        toArenaId: "hw-top-floor",
        linkType: "trampoline",
        boundaryLine: { x1: -4, y1: 14, x2: 4, y2: 14 },
        exitPosition: { x: 0, y: 12 },
        momentumPreserved: true,
        levelDelta: 80,
        hazardDamage: 0,
        reverseCondition: "never",
        cooldownTicks: 90,
        exitVelocityMult: 1.5,
      },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.012,
    surfaceFriction: 0.004,
    difficulty: "extreme",
  },

  // ── 20. Spiral Labyrinth — concentric arc walls, gravity-sink center ────────
  {
    id: "spiral-labyrinth",
    name: "Spiral Labyrinth",
    description: "Three concentric arc walls form a tightening spiral. Navigate the staggered gaps to reach the center — or get swallowed by a pit pocket.",
    width: 1200,
    height: 1200,
    shape: "circle",
    theme: "volcano",
    autoRotate: false,
    bowlProfile: "steep",
    staminaDrainMultiplier: 1.3,
    wall: circleWall("metal", 20, 10),

    obstacles: [
      {
        id: "sl-arc-outer-a",
        shape: { kind: "arc", cx_cm: 0, cy_cm: 0, radius_cm: 20, arcStart_deg: 0,   arcEnd_deg: 240, thickness_cm: 2.5 },
        health: 9999, damage: 22, recoilDistance: 10, autoPlaced: false, indestructible: true,
      },
      {
        id: "sl-arc-outer-b",
        shape: { kind: "arc", cx_cm: 0, cy_cm: 0, radius_cm: 20, arcStart_deg: 300, arcEnd_deg: 360, thickness_cm: 2.5 },
        health: 9999, damage: 22, recoilDistance: 10, autoPlaced: false, indestructible: true,
      },
      {
        id: "sl-arc-mid-a",
        shape: { kind: "arc", cx_cm: 0, cy_cm: 0, radius_cm: 13, arcStart_deg: 90,  arcEnd_deg: 330, thickness_cm: 2.5 },
        health: 9999, damage: 18, recoilDistance: 8, autoPlaced: false, indestructible: true,
      },
      {
        id: "sl-arc-inner-a",
        shape: { kind: "arc", cx_cm: 0, cy_cm: 0, radius_cm: 7,  arcStart_deg: 180, arcEnd_deg: 420, thickness_cm: 2.5 },
        health: 9999, damage: 14, recoilDistance: 6, autoPlaced: false, indestructible: true,
      },
    ],

    pits: [
      { id: "sl-pit-outer", x_cm:  17, y_cm: -10, radius_cm: 3.5, instantKO: false, damagePerSec: 60, warningRingColor: "#ef4444" },
      { id: "sl-pit-mid",   x_cm: -10, y_cm:  11, radius_cm: 3.0, instantKO: false, damagePerSec: 60, warningRingColor: "#ef4444" },
      { id: "sl-pit-inner", x_cm:   5, y_cm:  -3, radius_cm: 2.5, instantKO: false, damagePerSec: 80, warningRingColor: "#dc2626" },
    ],

    gravityHoles: [
      {
        id: "sl-gravity-center",
        x_cm: 0, y_cm: 0,
        forceN: 0.006,
        effectiveRadiusCm: 22,
        activeMs: -1,
        intervalMs: 1,
        warningMs: 0,
        visibility: "always",
        featureAnimation: { preset: "vortex", periodMs: 3000, color: "#7c3aed" },
      },
    ],

    speedPaths: [
      {
        id: 1,
        shape: "spiral",
        radiusStart: 21,
        radiusEnd: 4,
        turns: 2.5,
        speedBoost: 1.5,
        spinBoost: 20,
        frictionMultiplier: 0.7,
        renderStyle: "outline",
        color: "#a78bfa",
        showDirectionArrows: true,
        arrowColor: "#c4b5fd",
      },
    ],

    spinZones: [
      {
        id: "sl-sz-core",
        x_cm: 0, y_cm: 0,
        radius_cm: 4,
        direction: "cw",
        intensityRadPerSec: 5.0,
        applyTo: "spin",
        featureAnimation: { preset: "shockwave_ring", periodMs: 1500, color: "#7c3aed" },
      },
    ],

    waterBodies: [],
    turrets: [],
    portals: [],
    links: [],
    gravity: 0,
    airResistance: 0.006,
    surfaceFriction: 0.007,
    difficulty: "extreme",
  },

  // ── 21. Test Arena (Spawn) — E2E testing ──────────────────────────────────
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

  // ════════════════════════════════════════════════════════════════════════════
  //  NEW ARENAS (22–39) — Anime / Real-World Beyblade Stadiums
  // ════════════════════════════════════════════════════════════════════════════

  // ── 22. BeyStadium Attack Type — THE MFB tournament standard ───────────────
  // Real product: 340mm diameter, 30mm depth, 3 pockets, tornado ridge at R=125mm.
  {
    id: "beystadium-attack-type",
    name: "BeyStadium Attack Type",
    description: "The definitive MFB tournament stadium. 340mm diameter bowl with tornado ridge and 3 pockets. The standard by which all battles are judged.",
    width: 816,   // 340mm * 24px/cm / 10
    height: 816,
    shape: "circle",
    theme: "default",
    autoRotate: false,
    wall: circleWall("metal", 16, 9),
    backgroundColor: "#e5e7eb",
    floorColor: "#d1d5db",
    bowlProfile: "moderate",
    bowlWallAngle: 30,
    tornadoRidge: {
      radiusCm: 12.5,  // 125mm = 12.5cm
      widthCm: 3,
      orbitIntensity: 0.005,
      direction: "cw",
      spinBoostPercent: 12,
    },
    pits: [
      { id: 1, type: "pocket", x: 0,    y: -14, radius: 2.5, depth: 5, damagePerSecond: 0, pullForce: 2, escapeThreshold: 0.6 },
      { id: 2, type: "pocket", x: -12,  y:  7,  radius: 2.5, depth: 5, damagePerSecond: 0, pullForce: 2, escapeThreshold: 0.6 },
      { id: 3, type: "pocket", x:  12,  y:  7,  radius: 2.5, depth: 5, damagePerSecond: 0, pullForce: 2, escapeThreshold: 0.6 },
    ],
    obstacles: [],
    waterBodies: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.008,
    difficulty: "medium",
  },

  // ── 23. BX-10 Xtreme Stadium — single-side exit BX stadium ─────────────────
  // Real product: square outer shell, 365mm circular battle zone, gear rails, 3 exits on front face.
  {
    id: "bx10-xtreme-stadium",
    name: "BX-10 Xtreme Stadium",
    description: "The BX-10 Xtreme Stadium. Square outer with circular battle zone. All three exits line the front face — X-Dash launches send beys flying out.",
    width: 876,   // ~365mm * 24px/cm / 10
    height: 876,
    shape: "circle",
    theme: "metrocity",
    autoRotate: false,
    wall: circleWall("metal", 22, 14),
    backgroundColor: "#1e293b",
    floorColor: "#334155",
    scoringMode: "points",
    pointsTarget: 3,
    scoringZones: [
      { id: "sz-exit-l",  kind: "xtreme", x_cm: -12, y_cm: -18, radius_cm: 4, points: 1, color: "#ef4444" },
      { id: "sz-exit-c",  kind: "over",   x_cm:   0, y_cm: -18, radius_cm: 4, points: 2, color: "#f59e0b" },
      { id: "sz-exit-r",  kind: "xtreme", x_cm:  12, y_cm: -18, radius_cm: 4, points: 1, color: "#3b82f6" },
    ],
    gearRails: [
      {
        id: "bx10-rail-l",
        polylineCm: [{ x: -8, y: 10 }, { x: -14, y: 0 }, { x: -12, y: -16 }],
        speedBoostPermille: 900,
        requiresGearCompatibleBit: false,
        boostDurationMs: 400,
        exitZoneIds: ["sz-exit-l"],
        color: "#ef4444",
      },
      {
        id: "bx10-rail-c",
        polylineCm: [{ x: 0, y: 14 }, { x: 0, y: 0 }, { x: 0, y: -16 }],
        speedBoostPermille: 1000,
        requiresGearCompatibleBit: false,
        boostDurationMs: 350,
        exitZoneIds: ["sz-exit-c"],
        color: "#f59e0b",
      },
      {
        id: "bx10-rail-r",
        polylineCm: [{ x: 8, y: 10 }, { x: 14, y: 0 }, { x: 12, y: -16 }],
        speedBoostPermille: 900,
        requiresGearCompatibleBit: false,
        boostDurationMs: 400,
        exitZoneIds: ["sz-exit-r"],
        color: "#3b82f6",
      },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.008,
    surfaceFriction: 0.006,
    difficulty: "hard",
  },

  // ── 24. Wide Xtreme Stadium — larger BX variant ────────────────────────────
  {
    id: "wide-xtreme-stadium",
    name: "Wide Xtreme Stadium",
    description: "The wide-body BX stadium variant. Larger battle zone gives stamina types room to breathe, but gear rails still deliver devastating ring-outs.",
    width: 960,   // ~400mm
    height: 960,
    shape: "circle",
    theme: "metrocity",
    autoRotate: false,
    wall: circleWall("metal", 20, 12),
    backgroundColor: "#1e293b",
    floorColor: "#475569",
    scoringMode: "points",
    pointsTarget: 3,
    scoringZones: [
      { id: "sz-wide-n",  kind: "xtreme", x_cm: 0,   y_cm: -20, radius_cm: 5, points: 1, color: "#ef4444" },
      { id: "sz-wide-s",  kind: "xtreme", x_cm: 0,   y_cm:  20, radius_cm: 5, points: 1, color: "#3b82f6" },
      { id: "sz-wide-over", kind: "over", x_cm: -20, y_cm:   0, radius_cm: 4, points: 2, color: "#f59e0b" },
    ],
    gearRails: [
      {
        id: "wide-rail-n",
        polylineCm: [{ x: 0, y: 16 }, { x: 8, y: 6 }, { x: 6, y: -18 }],
        speedBoostPermille: 850,
        requiresGearCompatibleBit: false,
        boostDurationMs: 450,
        exitZoneIds: ["sz-wide-n"],
        color: "#ef4444",
      },
      {
        id: "wide-rail-s",
        polylineCm: [{ x: 0, y: -16 }, { x: -8, y: -6 }, { x: -6, y: 18 }],
        speedBoostPermille: 850,
        requiresGearCompatibleBit: false,
        boostDurationMs: 450,
        exitZoneIds: ["sz-wide-s"],
        color: "#3b82f6",
      },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.008,
    surfaceFriction: 0.006,
    difficulty: "hard",
  },

  // ── 25. Infinity Stadium — oval BX variant ─────────────────────────────────
  // Asymmetric X-Dash force in the elongated direction.
  {
    id: "infinity-stadium",
    name: "Infinity Stadium",
    description: "Oval BX stadium variant. The elongated shape creates asymmetric X-Dash trajectories — master the oval or get launched into oblivion.",
    width: 1104,  // ~460mm
    height: 720,  // ~300mm
    shape: "rectangle",
    theme: "metrocity",
    autoRotate: false,
    wall: rectWall("metal", 22, 14),
    backgroundColor: "#0f172a",
    floorColor: "#1e293b",
    scoringMode: "points",
    pointsTarget: 3,
    scoringZones: [
      { id: "sz-inf-e", kind: "xtreme", x_cm:  22, y_cm: 0, radius_cm: 5, points: 1, color: "#ef4444" },
      { id: "sz-inf-w", kind: "xtreme", x_cm: -22, y_cm: 0, radius_cm: 5, points: 1, color: "#3b82f6" },
      { id: "sz-inf-over", kind: "over", x_cm: 0, y_cm: -14, radius_cm: 4, points: 2, color: "#f59e0b" },
    ],
    gearRails: [
      {
        id: "inf-rail-e",
        polylineCm: [{ x: -10, y: 0 }, { x: 0, y: -5 }, { x: 10, y: 0 }, { x: 20, y: 0 }],
        speedBoostPermille: 1100,
        requiresGearCompatibleBit: false,
        boostDurationMs: 500,
        exitZoneIds: ["sz-inf-e"],
        color: "#ef4444",
      },
      {
        id: "inf-rail-w",
        polylineCm: [{ x: 10, y: 0 }, { x: 0, y: 5 }, { x: -10, y: 0 }, { x: -20, y: 0 }],
        speedBoostPermille: 1100,
        requiresGearCompatibleBit: false,
        boostDurationMs: 500,
        exitZoneIds: ["sz-inf-w"],
        color: "#3b82f6",
      },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.007,
    surfaceFriction: 0.005,
    difficulty: "extreme",
  },

  // ── 26. Ultimate Beyta Stadium — 4D motorized ──────────────────────────────
  // Real product: 737x432mm, magnetic spin spot at center, motor disc.
  {
    id: "ultimate-beyta-stadium",
    name: "Ultimate Beyta Stadium",
    description: "The legendary 4D motorized stadium. A magnetic spin spot at the center replenishes spin, while the motor disc rotates the entire bowl. Massive battlefield for epic clashes.",
    width: 1440,  // 737mm * ~2 (scaled for game playability)
    height: 1080, // 432mm * ~2.5
    shape: "rectangle",
    theme: "ancient_temple",
    autoRotate: true,
    rotationSpeed: 2,
    rotationDirection: "clockwise",
    wall: rectWall("stone", 20, 10, 4),
    backgroundColor: "#1c1917",
    floorColor: "#292524",
    gravityHoles: [
      {
        id: "ub-magnet-center",
        x_cm: 0, y_cm: 0,
        forceN: 0.004,
        effectiveRadiusCm: 10,
        activeMs: -1,
        intervalMs: 1,
        warningMs: 0,
        visibility: "always",
        featureAnimation: { preset: "pulse", periodMs: 2000, color: "#a855f7" },
      },
    ],
    spinZones: [
      {
        id: "ub-motor-disc",
        x_cm: 0, y_cm: 0,
        radius_cm: 8,
        direction: "cw",
        intensityRadPerSec: 2.5,
        applyTo: "spin",
        featureAnimation: { preset: "shimmer", periodMs: 3000, color: "#d4af37" },
      },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.009,
    difficulty: "extreme",
  },

  // ── 27. Tornado Attack Stadium — Plastic gen ───────────────────────────────
  // ~300mm diameter, taller tornado ridge (10mm), 3 pockets. Classic 1st gen.
  {
    id: "tornado-attack-stadium",
    name: "Tornado Attack Stadium",
    description: "The classic 1st-generation Plastic stadium. Smaller bowl with a prominent tornado ridge — the birthplace of competitive Beyblade.",
    width: 720,   // ~300mm
    height: 720,
    shape: "circle",
    theme: "default",
    autoRotate: false,
    wall: circleWall("metal", 14, 7),
    backgroundColor: "#f3f4f6",
    floorColor: "#e5e7eb",
    tornadoRidge: {
      radiusCm: 10,   // 100mm
      widthCm: 3,
      orbitIntensity: 0.007,   // taller ridge = stronger orbit
      direction: "cw",
      spinBoostPercent: 10,
    },
    pits: [
      { id: 1, type: "pocket", x: 0,    y: -12, radius: 2, depth: 4, damagePerSecond: 0, pullForce: 1.5, escapeThreshold: 0.5 },
      { id: 2, type: "pocket", x: -10,  y:  6,  radius: 2, depth: 4, damagePerSecond: 0, pullForce: 1.5, escapeThreshold: 0.5 },
      { id: 3, type: "pocket", x:  10,  y:  6,  radius: 2, depth: 4, damagePerSecond: 0, pullForce: 1.5, escapeThreshold: 0.5 },
    ],
    obstacles: [],
    waterBodies: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.009,
    difficulty: "easy",
  },

  // ── 28. Super Attack Stadium — Plastic gen, deeper bowl ────────────────────
  {
    id: "super-attack-stadium",
    name: "Super Attack Stadium",
    description: "The deeper, wider Plastic-gen stadium. Higher walls and a steeper bowl give defense types an advantage, but ring-outs hit harder.",
    width: 768,   // ~320mm
    height: 768,
    shape: "circle",
    theme: "default",
    autoRotate: false,
    wall: circleWall("metal", 18, 10),
    backgroundColor: "#dbeafe",
    floorColor: "#bfdbfe",
    bowlProfile: "moderate",
    bowlWallAngle: 35,
    tornadoRidge: {
      radiusCm: 11,
      widthCm: 3,
      orbitIntensity: 0.006,
      direction: "cw",
      spinBoostPercent: 12,
    },
    pits: [
      { id: 1, type: "pocket", x: 0,    y: -13, radius: 2.5, depth: 5, damagePerSecond: 0, pullForce: 2, escapeThreshold: 0.55 },
      { id: 2, type: "pocket", x: -11,  y:  6,  radius: 2.5, depth: 5, damagePerSecond: 0, pullForce: 2, escapeThreshold: 0.55 },
      { id: 3, type: "pocket", x:  11,  y:  6,  radius: 2.5, depth: 5, damagePerSecond: 0, pullForce: 2, escapeThreshold: 0.55 },
    ],
    obstacles: [],
    waterBodies: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.009,
    difficulty: "medium",
  },

  // ── 29. Dark Nebula Fortress — MFB anime villain HQ ────────────────────────
  // Dark Nebula HQ arena. Lightning hazards, spike walls, oppressive atmosphere.
  {
    id: "dark-nebula-fortress",
    name: "Dark Nebula Fortress",
    description: "The Dark Nebula organization's secret arena. Lightning crackles across the floor, spike walls punish ring-outs, and darkness swallows the weak.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "haunted_factory",
    autoRotate: false,
    wall: spikedCircleWall("metal", 28, 16),
    backgroundColor: "#1a0a2e",
    floorColor: "#2d1b4e",
    backgroundParticles: { type: "embers", density: 15, direction: 0, affectedByArenaRotation: false },
    environmentalEffect: { preset: "storm", intensity: 0.6, intervalMs: 5000 },
    floorHazardZones: [
      { id: "dn-hz1", x_cm: -10, y_cm: -10, radius_cm: 5, hazardType: "electric", disableTicks: 120, intensity: 1.5, featureAnimation: { preset: "lightning", periodMs: 600 } },
      { id: "dn-hz2", x_cm:  10, y_cm: -10, radius_cm: 5, hazardType: "electric", disableTicks: 120, intensity: 1.5, featureAnimation: { preset: "lightning", periodMs: 600 } },
      { id: "dn-hz3", x_cm: -10, y_cm:  10, radius_cm: 5, hazardType: "electric", disableTicks: 120, intensity: 1.5, featureAnimation: { preset: "lightning", periodMs: 600 } },
      { id: "dn-hz4", x_cm:  10, y_cm:  10, radius_cm: 5, hazardType: "electric", disableTicks: 120, intensity: 1.5, featureAnimation: { preset: "lightning", periodMs: 600 } },
    ],
    obstacles: [
      { id: 1, x: -16, y: 0, radius: 2, health: 999, damage: 20, recoilDistance: 10, indestructible: true, autoPlaced: false },
      { id: 2, x:  16, y: 0, radius: 2, health: 999, damage: 20, recoilDistance: 10, indestructible: true, autoPlaced: false },
      { id: 3, x: 0, y: -16, radius: 2, health: 999, damage: 20, recoilDistance: 10, indestructible: true, autoPlaced: false },
      { id: 4, x: 0, y:  16, radius: 2, health: 999, damage: 20, recoilDistance: 10, indestructible: true, autoPlaced: false },
    ],
    waterBodies: [],
    pits: [],
    turrets: [
      {
        id: 1, x: -18, y: -18, radius: 2.5, health: 999, indestructible: true,
        attackType: "periodic", attackDamage: 15, attackRange: 30, attackCooldown: 4,
        bulletCount: 2, bulletSpread: 15,
        color: "#7c3aed",
      },
      {
        id: 2, x: 18, y: 18, radius: 2.5, health: 999, indestructible: true,
        attackType: "periodic", attackDamage: 15, attackRange: 30, attackCooldown: 4,
        bulletCount: 2, bulletSpread: 15,
        color: "#7c3aed",
      },
    ],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.012,
    surfaceFriction: 0.01,
    difficulty: "extreme",
    arenaTimeline: [
      { triggerMs: 30_000, type: "announcement", announcement: { text: "DARK NEBULA POWER SURGE!", style: "danger" } },
      { triggerMs: 30_000, type: "gravity_change", params: { multiplier: 1.4 } },
      { triggerMs: 60_000, type: "announcement", announcement: { text: "LIGHTNING INTENSIFIES!", style: "warning" } },
      { triggerMs: 90_000, type: "announcement", announcement: { text: "DARKNESS CONSUMES ALL!", style: "danger" } },
      { triggerMs: 90_000, type: "gravity_change", params: { multiplier: 1.8 } },
    ],
  },

  // ── 30. Bey Forest — Forest of Endurance (MFB anime training) ─────────────
  {
    id: "bey-forest",
    name: "Bey Forest",
    description: "The Forest of Endurance from MFB training arcs. A healing spring sustains the worthy, while scattered boulders and dense undergrowth test navigation.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "forest",
    autoRotate: false,
    wall: circleWall("wood", 10, 5),
    backgroundColor: "#14532d",
    floorColor: "#166534",
    obstacles: [
      { id: 1, x: -14, y: -8, radius: 3, health: 4, damage: 10, recoilDistance: 5, autoPlaced: false },
      { id: 2, x:  14, y: -8, radius: 3, health: 4, damage: 10, recoilDistance: 5, autoPlaced: false },
      { id: 3, x:  -8, y: 14, radius: 2.5, health: 3, damage: 8, recoilDistance: 4, autoPlaced: false },
      { id: 4, x:   8, y: 14, radius: 2.5, health: 3, damage: 8, recoilDistance: 4, autoPlaced: false },
      { id: 5, x:   0, y: -16, radius: 3.5, health: 5, damage: 12, recoilDistance: 6, autoPlaced: false },
      { id: 6, x: -16, y:  4, radius: 2, health: 3, damage: 8, recoilDistance: 4, autoPlaced: false },
    ],
    waterBodies: [
      {
        id: "water1",
        type: "zone",
        liquidType: "healing",
        shape: "circle",
        position: { x: 0, y: 0 },
        radius: 5,
        opacity: 0.5,
        depth: 3,
        wavyEffect: true,
        effects: {
          healPerSecond: 4,
          spinBoostPerSecond: 25,
          frictionMultiplier: 1.0,
          showParticles: true,
          particleColor: "#6ee7b7",
        },
      },
    ],
    speedPaths: [
      {
        id: 1,
        radius: 14,
        shape: "circle",
        speedBoost: 1.4,
        spinBoost: 10,
        frictionMultiplier: 0.85,
        renderStyle: "outline",
        color: "#22c55e",
      },
    ],
    pits: [],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.015,
    surfaceFriction: 0.012,
    difficulty: "medium",
  },

  // ── 31. Big Bang Bladers Stadium — World Championship finals ───────────────
  {
    id: "big-bang-bladers-stadium",
    name: "Big Bang Bladers Stadium",
    description: "The World Championship finals arena. Grand proportions, pristine floor, chrome walls. No hazards — only the strongest blader prevails.",
    width: 1200,
    height: 1200,
    shape: "circle",
    theme: "metrocity",
    autoRotate: false,
    wall: circleWall("metal", 18, 10),
    backgroundColor: "#fffbeb",
    floorColor: "#fef3c7",
    tornadoRidge: {
      radiusCm: 16,
      widthCm: 4,
      orbitIntensity: 0.005,
      direction: "cw",
      spinBoostPercent: 14,
    },
    pits: [
      { id: 1, type: "pocket", x: 0,    y: -18, radius: 3, depth: 5, damagePerSecond: 0, pullForce: 2, escapeThreshold: 0.6 },
      { id: 2, type: "pocket", x: -15,  y:  9,  radius: 3, depth: 5, damagePerSecond: 0, pullForce: 2, escapeThreshold: 0.6 },
      { id: 3, type: "pocket", x:  15,  y:  9,  radius: 3, depth: 5, damagePerSecond: 0, pullForce: 2, escapeThreshold: 0.6 },
    ],
    obstacles: [],
    waterBodies: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.008,
    difficulty: "medium",
  },

  // ── 32. Hades City Arena — MFB underground lava arena ──────────────────────
  {
    id: "hades-city-arena",
    name: "Hades City Arena",
    description: "The underground arena of Hades City. Lava moat rings the battle zone, fire turrets rain destruction, and the dark floor absorbs hope.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "lava_core",
    autoRotate: false,
    wall: circleWall("stone", 24, 14),
    backgroundColor: "#1c0a00",
    floorColor: "#3b1100",
    backgroundParticles: { type: "embers", density: 30, direction: 350, affectedByArenaRotation: false },
    environmentalEffect: { preset: "volcanic", intensity: 0.8 },
    waterBodies: [
      {
        id: "water1",
        type: "moat",
        liquidType: "lava",
        thickness: 6,
        distanceFromArena: 18,
        followsArenaShape: true,
        opacity: 0.85,
        depth: 10,
        wavyEffect: true,
        effects: {
          damagePerSecond: 7,
          speedLoss: 0.5,
          frictionMultiplier: 2.5,
          pushForce: 4,
          showParticles: true,
          particleColor: "#ff4400",
        },
      },
    ],
    turrets: [
      {
        id: 1, x: -16, y: -16, radius: 3, health: 999, indestructible: true,
        attackType: "periodic", attackDamage: 20, attackRange: 28, attackCooldown: 4,
        bulletCount: 3, bulletSpread: 25,
        color: "#ef4444",
        featureAnimation: { preset: "pulse", periodMs: 1500, color: "#ff4400" },
      },
      {
        id: 2, x: 16, y: -16, radius: 3, health: 999, indestructible: true,
        attackType: "periodic", attackDamage: 20, attackRange: 28, attackCooldown: 4,
        bulletCount: 3, bulletSpread: 25,
        color: "#ef4444",
        featureAnimation: { preset: "pulse", periodMs: 1500, color: "#ff4400" },
      },
      {
        id: 3, x: 0, y: 16, radius: 3, health: 999, indestructible: true,
        attackType: "tracking_missile", attackDamage: 25, attackRange: 30, attackCooldown: 6,
        missileTrackingDeg: 90, firePattern: "lowest_spin",
        color: "#dc2626",
      },
    ],
    floorHazardZones: [
      { id: "hc-hz1", x_cm: 0, y_cm: 0, radius_cm: 5, hazardType: "lava", damagePerTick: 5, spinDecayMult: 1.5, featureAnimation: { preset: "pulse", color: "#ff4400" } },
    ],
    obstacles: [],
    pits: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.014,
    surfaceFriction: 0.012,
    difficulty: "extreme",
    arenaTimeline: [
      { triggerMs: 20_000, type: "announcement", announcement: { text: "HADES AWAKENS!", style: "danger" } },
      { triggerMs: 20_000, type: "gravity_change", params: { multiplier: 1.3 } },
      { triggerMs: 60_000, type: "announcement", announcement: { text: "INFERNO RISING!", style: "danger" } },
      { triggerMs: 60_000, type: "gravity_change", params: { multiplier: 1.6 } },
      { triggerMs: 120_000, type: "announcement", announcement: { text: "HADES FURY — NO ESCAPE!", style: "danger" } },
      { triggerMs: 120_000, type: "gravity_change", params: { multiplier: 2.0 } },
    ],
  },

  // ── 33. Tower of Babel Arena — Burst anime, tilted + auto-rotating ─────────
  {
    id: "tower-of-babel-arena",
    name: "Tower of Babel Arena",
    description: "The Tower of Babel from the Burst anime. A tilted, auto-rotating arena that shifts gravity mid-match. Only the adaptable survive.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "ancient_temple",
    autoRotate: true,
    rotationSpeed: 3,
    rotationDirection: "counterclockwise",
    wall: circleWall("stone", 20, 11),
    backgroundColor: "#44403c",
    floorColor: "#57534e",
    tiltAngle: 15,
    tiltDirection: 0,
    autoTilt: true,
    tiltSpeed: 8,
    elevationZones: [
      { id: "tob-elev-center", x_cm: 0, y_cm: 0, radius_cm: 8, heightCm: 15, spinBoostOnPlatform: 20, edgeDropForce: 6 },
    ],
    obstacles: [
      { id: 1, x: -12, y: -12, radius: 3, health: 6, damage: 18, recoilDistance: 8, autoPlaced: false },
      { id: 2, x:  12, y: -12, radius: 3, health: 6, damage: 18, recoilDistance: 8, autoPlaced: false },
      { id: 3, x: -12, y:  12, radius: 3, health: 6, damage: 18, recoilDistance: 8, autoPlaced: false },
      { id: 4, x:  12, y:  12, radius: 3, health: 6, damage: 18, recoilDistance: 8, autoPlaced: false },
    ],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.012,
    surfaceFriction: 0.009,
    difficulty: "hard",
    arenaTimeline: [
      { triggerMs: 20_000, type: "announcement", announcement: { text: "THE TOWER SHIFTS!", style: "warning" } },
      { triggerMs: 20_000, type: "arena_tilt", params: { angleDeg: 25, directionDeg: 90 } },
      { triggerMs: 50_000, type: "announcement", announcement: { text: "BABEL TILTS FURTHER!", style: "warning" } },
      { triggerMs: 50_000, type: "arena_tilt", params: { angleDeg: 35, directionDeg: 180 } },
      { triggerMs: 90_000, type: "announcement", announcement: { text: "TOWER PEAK — MAXIMUM TILT!", style: "danger" } },
      { triggerMs: 90_000, type: "arena_tilt", params: { angleDeg: 45, directionDeg: 270 } },
      { triggerMs: 120_000, type: "arena_tilt", params: { angleDeg: 15, directionDeg: 0 } },
    ],
  },

  // ── 34. WBBA Official Stadium — Burst-era tournament standard ──────────────
  {
    id: "wbba-official-stadium",
    name: "WBBA Official Stadium",
    description: "The WBBA Official Tournament Stadium. Clean, fair, no hazards. The standard for all Burst-era competitive play. Blue and white livery.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "default",
    autoRotate: false,
    wall: circleWall("metal", 16, 9),
    backgroundColor: "#eff6ff",
    floorColor: "#dbeafe",
    pits: [
      { id: 1, type: "pocket", x: 0,    y: -16, radius: 2.5, depth: 4, damagePerSecond: 0, pullForce: 1.5, escapeThreshold: 0.5 },
      { id: 2, type: "pocket", x: -14,  y:  8,  radius: 2.5, depth: 4, damagePerSecond: 0, pullForce: 1.5, escapeThreshold: 0.5 },
      { id: 3, type: "pocket", x:  14,  y:  8,  radius: 2.5, depth: 4, damagePerSecond: 0, pullForce: 1.5, escapeThreshold: 0.5 },
    ],
    obstacles: [],
    waterBodies: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.008,
    difficulty: "easy",
  },

  // ── 35. Lost Scroll Arena — G-Revolution anime ─────────────────────────────
  // Desert theme, sand traps (quicksand water bodies), obstacle pillars.
  {
    id: "lost-scroll-arena",
    name: "Lost Scroll Arena",
    description: "The Lost Scroll arena from G-Revolution. Desert sands conceal quicksand traps, and ancient stone pillars block escape routes.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "desert",
    autoRotate: false,
    wall: circleWall("stone", 18, 10),
    backgroundColor: "#78350f",
    floorColor: "#92400e",
    obstacles: [
      { id: 1, x: -10, y: -10, radius: 3, health: 7, damage: 18, recoilDistance: 8, autoPlaced: false },
      { id: 2, x:  10, y: -10, radius: 3, health: 7, damage: 18, recoilDistance: 8, autoPlaced: false },
      { id: 3, x:   0, y:  12, radius: 3.5, health: 8, damage: 20, recoilDistance: 9, autoPlaced: false },
      { id: 4, x: -16, y:   0, radius: 2.5, health: 5, damage: 14, recoilDistance: 6, autoPlaced: false },
      { id: 5, x:  16, y:   0, radius: 2.5, health: 5, damage: 14, recoilDistance: 6, autoPlaced: false },
    ],
    waterBodies: [
      {
        id: "water1",
        type: "zone",
        liquidType: "quicksand",
        shape: "circle",
        position: { x: -8, y: 6 },
        radius: 5,
        opacity: 0.6,
        depth: 6,
        wavyEffect: false,
        effects: {
          speedLoss: 0.7,
          frictionMultiplier: 3.0,
          showParticles: true,
          particleColor: "#d4a574",
          damagePerSecond: 2,
        },
      },
      {
        id: "water2",
        type: "zone",
        liquidType: "quicksand",
        shape: "circle",
        position: { x: 8, y: -6 },
        radius: 4,
        opacity: 0.6,
        depth: 6,
        wavyEffect: false,
        effects: {
          speedLoss: 0.7,
          frictionMultiplier: 3.0,
          showParticles: true,
          particleColor: "#d4a574",
          damagePerSecond: 2,
        },
      },
    ],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.018,
    surfaceFriction: 0.014,
    difficulty: "hard",
  },

  // ── 36. Beylin Temple Arena — MFB mountain temple training ─────────────────
  {
    id: "beylin-temple-arena",
    name: "Beylin Temple Arena",
    description: "The Beylin Temple training grounds. Mountain wind buffets all combatants while the elevated center platform rewards those who claim the high ground.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "ancient_temple",
    autoRotate: false,
    wall: circleWall("stone", 16, 9),
    backgroundColor: "#1e3a5f",
    floorColor: "#2c5282",
    elevationZones: [
      { id: "bt-elev-center", x_cm: 0, y_cm: 0, radius_cm: 7, heightCm: 12, spinBoostOnPlatform: 18, edgeDropForce: 5 },
    ],
    spinZones: [
      {
        id: "bt-wind",
        x_cm: 0, y_cm: 0,
        radius_cm: 20,
        direction: "ccw",
        intensityRadPerSec: 1.5,
        applyTo: "linear",
      },
    ],
    obstacles: [
      { id: 1, x: -14, y: -6, radius: 2.5, health: 6, damage: 14, recoilDistance: 6, autoPlaced: false },
      { id: 2, x:  14, y: -6, radius: 2.5, health: 6, damage: 14, recoilDistance: 6, autoPlaced: false },
      { id: 3, x: -14, y:  6, radius: 2.5, health: 6, damage: 14, recoilDistance: 6, autoPlaced: false },
      { id: 4, x:  14, y:  6, radius: 2.5, health: 6, damage: 14, recoilDistance: 6, autoPlaced: false },
    ],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.02,
    surfaceFriction: 0.01,
    difficulty: "hard",
  },

  // ── 37. Nemesis Crisis Arena — 4D anime finale ─────────────────────────────
  // Apocalyptic theme, gravity wells, void effects, shrinking arena.
  {
    id: "nemesis-crisis-arena",
    name: "Nemesis Crisis Arena",
    description: "The apocalyptic finale arena from the Nemesis Crisis. Gravity wells pull beys into the void, the arena shrinks relentlessly, and shadow effects drain spin.",
    width: 1200,
    height: 1200,
    shape: "circle",
    theme: "quantum_realm",
    autoRotate: true,
    rotationSpeed: 2,
    rotationDirection: "counterclockwise",
    wall: circleWall("metal", 22, 12),
    backgroundColor: "#0a0010",
    floorColor: "#1a0030",
    backgroundParticles: { type: "stars", density: 25, affectedByArenaRotation: false },
    environmentalEffect: { preset: "void", intensity: 1.0 },
    shrink: { enabled: true, startMs: 30000, endMs: 150000, minRadiusFraction: 0.4, damageRatePerTick: 5, shrinkRateCmPerSec: 0.8, minRadiusCm: 60 },
    gravityHoles: [
      {
        id: "nc-grav-1", x_cm: -12, y_cm: -12,
        forceN: 0.005, effectiveRadiusCm: 10,
        activeMs: 3000, intervalMs: 6000, warningMs: 800,
        visibility: "warning-only",
        featureAnimation: { preset: "vortex", periodMs: 2000, color: "#6b21a8" },
      },
      {
        id: "nc-grav-2", x_cm: 12, y_cm: 12,
        forceN: 0.005, effectiveRadiusCm: 10,
        activeMs: 3000, intervalMs: 6000, warningMs: 800,
        visibility: "warning-only",
        featureAnimation: { preset: "vortex", periodMs: 2000, color: "#6b21a8" },
      },
      {
        id: "nc-grav-center", x_cm: 0, y_cm: 0,
        forceN: 0.003, effectiveRadiusCm: 15,
        activeMs: 5000, intervalMs: 10000, warningMs: 1000,
        visibility: "always",
        featureAnimation: { preset: "ghost", periodMs: 3000, color: "#7c3aed" },
      },
    ],
    floorHazardZones: [
      { id: "nc-hz1", x_cm: 0, y_cm: 0, radius_cm: 6, hazardType: "void", damagePerTick: 4, spinDecayMult: 2.0, featureAnimation: { preset: "ghost", color: "#4c1d95" } },
    ],
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.008,
    surfaceFriction: 0.006,
    difficulty: "extreme",
    arenaTimeline: [
      { triggerMs: 15_000, type: "announcement", announcement: { text: "NEMESIS STIRS...", style: "warning" } },
      { triggerMs: 30_000, type: "announcement", announcement: { text: "THE VOID EXPANDS!", style: "danger" } },
      { triggerMs: 60_000, type: "announcement", announcement: { text: "NEMESIS CRISIS — ARENA COLLAPSING!", style: "danger" } },
      { triggerMs: 60_000, type: "gravity_change", params: { multiplier: 1.5 } },
      { triggerMs: 100_000, type: "announcement", announcement: { text: "FINAL DARKNESS!", style: "danger" } },
      { triggerMs: 100_000, type: "gravity_change", params: { multiplier: 2.0 } },
    ],
  },

  // ── 38. Bey Colosseum Rome — G-Revolution Roman arena ──────────────────────
  // Stone/prehistoric theme, spiked walls, turret archers.
  {
    id: "bey-colosseum-rome",
    name: "Bey Colosseum Rome",
    description: "The Roman Colosseum from G-Revolution. Gladiatorial combat among stone pillars, spiked walls, and archer turrets. Fight for glory!",
    width: 1200,
    height: 1200,
    shape: "circle",
    theme: "prehistoric",
    autoRotate: false,
    wall: spikedCircleWall("stone", 24, 14),
    backgroundColor: "#44403c",
    floorColor: "#57534e",
    obstacles: [
      { id: 1, x: -10, y: -10, radius: 3.5, health: 8, damage: 22, recoilDistance: 10, autoPlaced: false },
      { id: 2, x:  10, y: -10, radius: 3.5, health: 8, damage: 22, recoilDistance: 10, autoPlaced: false },
      { id: 3, x: -10, y:  10, radius: 3.5, health: 8, damage: 22, recoilDistance: 10, autoPlaced: false },
      { id: 4, x:  10, y:  10, radius: 3.5, health: 8, damage: 22, recoilDistance: 10, autoPlaced: false },
      { id: 5, x:   0, y:   0, radius: 4, health: 10, damage: 25, recoilDistance: 12, autoPlaced: false },
    ],
    turrets: [
      {
        id: 1, x: -20, y: 0, radius: 2.5, health: 300, indestructible: false,
        attackType: "periodic", attackDamage: 16, attackRange: 25, attackCooldown: 3,
        bulletCount: 2, bulletSpread: 10,
        color: "#a16207",
      },
      {
        id: 2, x: 20, y: 0, radius: 2.5, health: 300, indestructible: false,
        attackType: "periodic", attackDamage: 16, attackRange: 25, attackCooldown: 3,
        bulletCount: 2, bulletSpread: 10,
        color: "#a16207",
      },
      {
        id: 3, x: 0, y: -20, radius: 2.5, health: 300, indestructible: false,
        attackType: "periodic", attackDamage: 16, attackRange: 25, attackCooldown: 3,
        bulletCount: 2, bulletSpread: 10,
        color: "#a16207",
      },
      {
        id: 4, x: 0, y: 20, radius: 2.5, health: 300, indestructible: false,
        attackType: "periodic", attackDamage: 16, attackRange: 25, attackCooldown: 3,
        bulletCount: 2, bulletSpread: 10,
        color: "#a16207",
      },
    ],
    waterBodies: [],
    pits: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.012,
    surfaceFriction: 0.011,
    difficulty: "hard",
  },

  // ── 39. Spiral Mountain Arena — original anime, auto-rotating + wind ───────
  {
    id: "spiral-mountain-arena",
    name: "Spiral Mountain Arena",
    description: "Spiral Mountain from the original Beyblade anime. Mountain winds create constant orbital push, and the auto-rotating floor keeps bladers on their toes.",
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "mountains",
    autoRotate: true,
    rotationSpeed: 2,
    rotationDirection: "clockwise",
    wall: circleWall("stone", 14, 8),
    backgroundColor: "#365314",
    floorColor: "#3f6212",
    spinZones: [
      {
        id: "sm-wind-outer",
        x_cm: 0, y_cm: 0,
        radius_cm: 18,
        direction: "cw",
        intensityRadPerSec: 1.8,
        applyTo: "linear",
      },
      {
        id: "sm-wind-inner",
        x_cm: 0, y_cm: 0,
        radius_cm: 6,
        direction: "ccw",
        intensityRadPerSec: 1.0,
        applyTo: "spin",
      },
    ],
    obstacles: [
      { id: 1, x: -12, y: 0, radius: 2.5, health: 4, damage: 12, recoilDistance: 5, autoPlaced: false },
      { id: 2, x:  12, y: 0, radius: 2.5, health: 4, damage: 12, recoilDistance: 5, autoPlaced: false },
    ],
    speedPaths: [
      {
        id: 1,
        radius: 14,
        shape: "circle",
        speedBoost: 1.5,
        spinBoost: 15,
        frictionMultiplier: 0.8,
        renderStyle: "spiral",
        color: "#84cc16",
      },
    ],
    waterBodies: [],
    pits: [],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.02,
    surfaceFriction: 0.008,
    difficulty: "medium",
  },

  // ── Classic Stadium (default arena) ──────────────────────────────────────────
  // Based on the reference image: KO out-zones at corners, pink recoil wall ring,
  // sky-blue tornado ridge, yellow flat-defense zone, red launch quadrant lines.
  {
    id: "classic_stadium",
    name: "Classic Stadium",
    description: "The definitive Beyblade stadium. Pink recoil walls, a sky-blue tornado ridge, and a flat defense zone at the centre. Launch from opposite quadrants.",
    isDefault: true,
    width: 1080,
    height: 1080,
    shape: "circle",
    theme: "default",
    autoRotate: false,

    // Zone radii (in pixels at 1080×1080)
    arenaPixelRadius: 486,   // outer KO boundary — outside = ring-out
    pinkWallRadius:   432,   // inner edge of the pink recoil wall (no-go zone)
    ridgeRadius:      360,   // sky-blue tornado ridge centre-line
    flatZoneRadius:   216,   // yellow inner ring — flat defense area inside here

    wallBounceFactor: 1.2,   // recoil multiplier when hitting the pink wall

    // Spin zones — tornado ridge boosts spin CW
    spinZones: [
      {
        id: "tornado_ridge",
        cx: 540, cy: 540,
        radius: 360,
        ringWidth: 36,
        spinDirection: "cw",
        spinStrength: 0.35,
        applyTo: "spin",
        color: 0x00BFFF,
      },
    ],

    // KO: bey crossing arenaPixelRadius is eliminated
    koZone: "outside_circle",

    // Launch placement
    launchMode: "quadrant",       // 2 players → opposite quadrants; 4 → all four
    royaleLaunchRadius: 412,      // spawn ring for 12-player royale (just inside pink wall)

    wall: circleWall("metal", 18, 10),
    obstacles: [],
    waterBodies: [],
    pits: [],
    turrets: [],
    speedPaths: [],
    portals: [],
    gravity: 0,
    airResistance: 0.01,
    surfaceFriction: 0.007,
    difficulty: "medium",
  },
];

// ─── Floor Group layouts (saved multi-floor configs) ──────────────────────────
//
// Two saved layout groups for the Hot Wheels Turbo stadium.
//   hw-turbo-stadium  — full 3-floor experience (ground → mid → top)
//   hw-sprint-duo     — express 2-floor layout (ground + top, no mid stop)

const FLOOR_GROUPS = [
  {
    id: "hw-turbo-stadium",
    name: "Hot Wheels Turbo Stadium — Full Layout",
    description: "The complete three-floor Hot Wheels experience. Ground ring loop, mid figure-8 crossing, and rooftop spiral finale. All elevators active.",
    floorArenaIds: ["hw-ground-floor", "hw-mid-floor", "hw-top-floor"],
    floorPositions: [
      { floorIndex: 0, xOffsetCm:  0, yOffsetCm:   0, zOffsetCm:   0 },
      { floorIndex: 1, xOffsetCm:  0, yOffsetCm: -20, zOffsetCm:  80 },
      { floorIndex: 2, xOffsetCm:  0, yOffsetCm: -40, zOffsetCm: 160 },
    ],
    minFloorHeightCm: 80,
  },
  {
    id: "hw-sprint-duo",
    name: "Hot Wheels Sprint Duo — Express Layout",
    description: "Express two-floor sprint: ground loop straight to rooftop spiral. Skip the mid-floor for faster-paced knockout rounds.",
    floorArenaIds: ["hw-ground-floor", "hw-top-floor"],
    floorPositions: [
      { floorIndex: 0, xOffsetCm: 0, yOffsetCm:   0, zOffsetCm:   0 },
      { floorIndex: 1, xOffsetCm: 0, yOffsetCm: -30, zOffsetCm: 120 },
    ],
    minFloorHeightCm: 120,
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seedArenas() {
  console.log("\n══════════════════════════════════════");
  console.log("  Arena Preset Seed");
  console.log("══════════════════════════════════════\n");
  await clearCollection("arenas");
  await clearCollection("arena_floor_groups");

  for (const arena of ARENAS) {
    const docData = {
      rendererMode: "2.5d",   // default all seeded arenas to 2.5D perspective
      ...arena,               // arena-level override wins if explicitly set
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

      console.log(`  ✔ ${arena.name.padEnd(34)} [${arena.shape.padEnd(9)} / ${arena.theme.padEnd(15)}]  ${features || "(no features)"}`);
    } catch (err) {
      console.error(`  ✘ ${arena.name}: ${err.message}`);
    }
  }

  console.log(`\n✅ Seeded ${ARENAS.length} arenas into arenas collection\n`);

  // ── Floor Groups ──────────────────────────────────────────────────────────
  console.log("  Seeding floor groups…");
  for (const fg of FLOOR_GROUPS) {
    try {
      await db.collection("arena_floor_groups").doc(fg.id).set(
        { ...fg, createdAt: now, updatedAt: now, createdBy: "seed" },
        { merge: false },
      );
      const floors = fg.floorArenaIds.join(" → ");
      console.log(`  ✔ [${fg.id.padEnd(18)}]  ${fg.name}  (${floors})`);
    } catch (err) {
      console.error(`  ✘ ${fg.id}: ${err.message}`);
    }
  }
  console.log(`\n✅ Seeded ${FLOOR_GROUPS.length} floor groups into arena_floor_groups\n`);
}

seedArenas()
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

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
    pits: [],
    turrets: [],
    portals: [],
    gravity: 0,
    airResistance: 0.012,
    surfaceFriction: 0.01,
    difficulty: "medium",
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
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seedArenas() {
  console.log("\n══════════════════════════════════════");
  console.log("  Arena Preset Seed");
  console.log("══════════════════════════════════════\n");

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

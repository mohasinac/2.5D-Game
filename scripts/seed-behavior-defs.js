// seed-behavior-defs.js — seeds the built-in BehaviorDef keyword library
// to the behavior_defs Firestore collection.
// Idempotent: uses doc id as key, safe to re-run.

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

const BEHAVIOR_DEFS = [
  // ── STATS ─────────────────────────────────────────────────────────────────────
  { id: "factor.boost",          category: "stats",    description: "Multiply a named stat for N ticks",         params: ["stat","mult","dur"] },
  { id: "factor.bleed",          category: "stats",    description: "Exponential-decay stat modifier over time", params: ["stat","startMult","halfLifeTicks"] },
  { id: "factor.set_value",      category: "stats",    description: "Set a string-valued stat (e.g. spinDirection)", params: ["stat","value","dur"] },

  // ── MOVEMENT ──────────────────────────────────────────────────────────────────
  { id: "movement.dash",         category: "movement", description: "Instant directional velocity impulse",      params: ["direction","magnitude","dur"] },
  { id: "movement.orbit",        category: "movement", description: "Circular orbit around a point",            params: ["radius","direction","dur"] },
  { id: "movement.zigzag",       category: "movement", description: "Rapid back-and-forth zigzag movement",     params: ["amplitude","frequency","dur"] },
  { id: "movement.freeze",       category: "movement", description: "Lock bey position in place",               params: ["dur"] },
  { id: "movement.dance",        category: "movement", description: "Erratic figure-8 movement",                params: ["intensity","dur"] },
  { id: "movement.bounce",       category: "movement", description: "Wall-bounce movement burst",               params: ["count"] },
  { id: "movement.jump",         category: "movement", description: "Upward jump arc",                          params: ["heightCm","jumpForceMult","dur"] },
  { id: "movement.high_jump",    category: "movement", description: "High-arc jump (bey exits screen)",         params: ["heightCm","hangTimeTicks","landTarget"] },
  { id: "movement.meteor_strike",category: "movement", description: "High jump + crash landing with shockwave", params: ["heightCm","hangTimeTicks","landTarget","impactRadiusCm","impactDamageMult","impactRecoilMult"] },
  { id: "movement.dash_to",      category: "movement", description: "Physics-driven dash toward target",        params: ["target","magnitude"] },
  { id: "movement.orbit_opponent",category:"movement", description: "Orbit nearest opponent",                   params: ["radius","dur"] },
  { id: "position.teleport_offset",category:"movement",description: "Instant position offset (no physics)",     params: ["dx","dy","dz"] },
  { id: "position.swap_with",    name: "Swap Position", category: "movement", description: "Instantly swap positions with target bey", params: { swapWith: "nearest_opponent", preserveVelocity: false, preventRingOut: true } },

  // ── TRANSFORMATION ────────────────────────────────────────────────────────────
  { id: "transform.become_gravity_well",  category: "2.5D",      description: "Bey acts as a gravity well",      params: ["strength","radius","dur"] },
  { id: "transform.become_spin_zone",     category: "2.5D",      description: "Bey emits a spin zone",           params: ["spinRate","radius","dur"] },
  { id: "transform.become_obstacle",      category: "arena",     description: "Bey becomes a collidable obstacle",params: ["dur"] },
  { id: "transform.normal",              category: "arena",     description: "Revert transformation",            params: [] },

  // ── SPAWNING ──────────────────────────────────────────────────────────────────
  { id: "spawn.portal",          category: "spawning", description: "Spawn a portal at position",               params: ["x","y","radius","dur"] },
  { id: "spawn.obstacle",        category: "spawning", description: "Spawn a temporary obstacle",               params: ["shape","x","y","dur"] },
  { id: "spawn.gravity_well",    category: "spawning", description: "Spawn a gravity well feature",             params: ["x","y","strength","radius","dur"] },
  { id: "spawn.spin_zone",       category: "spawning", description: "Spawn a spin zone feature",                params: ["x","y","spinRate","radius","dur"] },
  { id: "spawn.clone_self",      category: "spawning", description: "Spawn a clone of self",                    params: ["count","cloneIsPhysical","cloneStatFraction"] },
  { id: "spawn.trail",           category: "spawning", description: "Spawn a hazard trail behind bey",          params: ["trailDamage","trailWidth","trailLifetimeTicks"] },
  { id: "spawn.bey_ai",          category: "spawning", description: "Spawn an AI-controlled bey",               params: ["beyId","aiDifficulty","statsMultiplier"] },

  // ── ARENA ─────────────────────────────────────────────────────────────────────
  { id: "arena.effect.floor_override",   category: "arena",  description: "Override entire floor hazard type",  params: ["hazardType","intensity","dur"] },
  { id: "element.override_type",  category: "arena",  description: "ELEMENTAL_BOOST — temporarily override bey element type for N ticks", params: ["elementType","dur"] },
  { id: "arena.effect.gravity_change",   category: "arena",  description: "Change arena gravity multiplier",    params: ["multiplier","dur"] },
  { id: "arena.effect.arena_tilt",       category: "arena",  description: "Tilt arena floor",                   params: ["angleDeg","directionDeg","dur"] },
  { id: "arena.effect.freeze_all",       category: "arena",  description: "Freeze all beys except caster",      params: ["dur","spareTeammates"] },
  { id: "arena.effect.fog_of_war",       category: "arena",  description: "Reduce visibility for all players",  params: ["dur","affectsCaster"] },
  { id: "arena.effect.darkness",         category: "arena",  description: "Black overlay — only caster visible",params: ["dur","flashExitMs"] },
  { id: "arena.effect.reverse_controls", category: "arena",  description: "Invert all players controls",        params: ["dur","affectsCaster"] },
  { id: "arena.effect.no_combos",        category: "arena",  description: "Disable combo detection for all",    params: ["dur","affectsCaster"] },

  // ── CONTROL ───────────────────────────────────────────────────────────────────
  { id: "control.invulnerability",  category: "control",  description: "Grant damage immunity for N ticks",    params: ["dur"] },
  { id: "control.lock_input",       category: "control",  description: "Disable player input for N ticks",     params: ["dur"] },
  { id: "control.windup",           category: "control",  description: "Pre-combo windup delay",               params: ["ticks"] },
  { id: "control.bleed",            category: "control",  description: "Post-combo vulnerability window",      params: ["ticks","factors"] },

  // ── QTE ───────────────────────────────────────────────────────────────────────
  { id: "qte.set_immune",           category: "control",  description: "Make special move immune to QTE cancellation", params: ["dur"] },

  // ── PHYSICS ───────────────────────────────────────────────────────────────────
  { id: "force.impulse",            category: "physics",  description: "Apply a directional force impulse",    params: ["direction","magnitude","dur"] },
  { id: "force.spin_injection",     category: "physics",  description: "Directly add spin to a bey",          params: ["amount"] },

  // ── TILT (2.5D) ───────────────────────────────────────────────────────────────
  { id: "tilt.force_tilt",          category: "2.5D",    description: "Force bey axis tilt to angle",         params: ["angleDeg","dur"] },
  { id: "tilt.reduce_tilt",         category: "2.5D",    description: "Forcibly stabilize bey axis",         params: ["rate","dur"] },
  { id: "tilt.lock_tilt",           category: "2.5D",    description: "Freeze current tilt angle",           params: ["dur"] },

  // ── SUCTION / CLIMB (2.5D) ────────────────────────────────────────────────────
  { id: "physics.stick_surface",    category: "2.5D",    description: "Apply suction adhesion to surfaces",  params: ["force","dur"] },
  { id: "physics.wall_climb",       category: "2.5D",    description: "Enable wall-climbing movement",       params: ["factor","dur"] },

  // ── COMBINATION LOCK (2.5D) ───────────────────────────────────────────────────
  { id: "combination.lock",         category: "2.5D",    description: "Lock combination — impact cannot break it", params: ["dur"] },
  { id: "combination.unlock",       category: "2.5D",    description: "Unlock combination — allow break",    params: [] },

  // ── TEAM ──────────────────────────────────────────────────────────────────────
  { id: "team.control_transfer",    category: "team",    description: "Hand control of this bey to an ally", params: ["targetPlayerId"] },
  { id: "team.formation",           category: "team",    description: "Force beys into a geometric formation",params: ["pattern","spacingCm","dur"] },

  // ── VISUAL ────────────────────────────────────────────────────────────────────
  { id: "visual.particle_burst",    category: "visual",  description: "Emit a particle burst from bey position", params: ["presetId","x","y"] },
  { id: "visual.camera_shake",      category: "visual",  description: "Shake the camera",                     params: ["intensity","dur"] },
  { id: "visual.screen_flash",      category: "visual",  description: "Full-screen color flash",              params: ["color","alpha","dur"] },
  { id: "visual.slow_mo",           category: "visual",  description: "Client-side time scale slowdown",      params: ["factor","dur"] },
  { id: "visual.sprite_swap",       category: "visual",  description: "Temporarily swap bey sprite",         params: ["spriteUrl","dur"] },
  { id: "visual.landing_zone",      category: "visual",  description: "Show a target ring on the arena floor",params: ["x","y","radiusCm","dur"] },

  // ── ELEMENT TYPE ──────────────────────────────────────────────────────────────
  { id: "element.override_type",    category: "element", description: "Temporarily change bey element type", params: ["elementType","dur"] },
];

async function seed() {
  const col = db.collection("behavior_defs");
  let upserted = 0;

  for (const def of BEHAVIOR_DEFS) {
    await col.doc(def.id).set(def, { merge: true });
    upserted++;
    process.stdout.write(`  ✓ ${def.id}\n`);
  }

  console.log(`\nSeeded ${upserted} behavior defs.`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

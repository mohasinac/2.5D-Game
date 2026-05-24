#!/usr/bin/env node
// scripts/seed-all.js — Master seed orchestrator
//
// Usage:
//   node scripts/seed-all.js                           seed everything
//   node scripts/seed-all.js --only beyblades,combos   seed only those
//   node scripts/seed-all.js --skip tournament          seed all except
//   node scripts/seed-all.js --clear                   clear all collections (no reseed)
//   node scripts/seed-all.js --clear --only beyblades   clear only that seeder's collections
//   node scripts/seed-all.js --reseed                  clear all + seed all
//   node scripts/seed-all.js --reseed --only combos    clear + reseed just combos
//   node scripts/seed-all.js --list                    print all seeder names and exit

"use strict";
const path    = require("path");
const { spawnSync } = require("child_process");

// ── 1. Load .env from project root ────────────────────────────────────────────
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌  Missing Firebase Admin credentials in .env");
  console.error("    Required: FIREBASE_ADMIN_PROJECT_ID  FIREBASE_ADMIN_CLIENT_EMAIL  FIREBASE_ADMIN_PRIVATE_KEY");
  process.exit(1);
}

// ── 2. Init Admin SDK (used for --clear) ──────────────────────────────────────
const admin = require("firebase-admin");
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();

// ── 3. Seeder registry ────────────────────────────────────────────────────────
// name       — slug used with --only / --skip
// script     — filename relative to scripts/
// collections — all Firestore collections this seeder writes to (used by --clear)
const SEEDERS = [
  {
    name: "admin",
    script: "seed-admin.js",
    collections: ["users"],
    description: "Admin user + Firebase Auth custom claim",
  },
  {
    name: "settings",
    script: "seed-settings.js",
    collections: ["settings"],
    description: "settings/game — enables AI, tournaments, clears maintenance flag",
  },
  {
    name: "beyblades",
    script: "seed-beyblades.js",
    collections: ["beyblade_stats"],
    description: "20 preset beyblade configs",
  },
  {
    name: "arenas",
    script: "seed-arenas.js",
    collections: ["arenas"],
    description: "12 arena configs",
  },
  {
    name: "special-moves",
    script: "seed-special-moves.js",
    collections: ["special_moves"],
    description: "4 special moves (Stampede Rush, Gyro Anchor, Spin Recovery, Tactical Burst)",
  },
  {
    name: "combos",
    script: "seed-combos.js",
    collections: ["combos"],
    description: "8 combos (4 free + 4 cost-tiered)",
  },
  {
    name: "ai-battles",
    script: "seed-ai-battles.js",
    collections: ["ai_battles"],
    description: "3 AI battle quick-launch presets (medium / hard / hell)",
  },
  {
    name: "round-modifiers",
    script: "seed-round-modifiers.js",
    collections: ["round_modifiers"],
    description: "17 round modifiers (physics, combat, rules, chaos)",
  },
  {
    name: "behavior-defs",
    script: "seed-behavior-defs.js",
    collections: ["behavior_defs"],
    description: "50+ BehaviorDef keyword library entries",
  },
  {
    name: "combo-effects",
    script: "seed-combo-effects.js",
    collections: ["combo_effects"],
    description: "13 ComboEffectDef presets (including riposte + pivot-strike)",
  },
  {
    name: "mechanics",
    script: "seed-mechanics.js",
    collections: ["mechanic_defs"],
    description: "31 mechanic_defs — one per MechanicRegistry handler",
  },
  {
    name: "gimmicks",
    script: "seed-gimmicks.js",
    collections: ["gimmick_defs"],
    description: "27 gimmick_defs (22 original + 5 new: magnacore_repel, magnacore_attract, dual_spin_launch, mode_switch_tip, spring_launch)",
  },
  {
    name: "particle-presets",
    script: "seed-particle-presets.js",
    collections: ["particle_presets"],
    description: "7 PixiJS particle emitter presets",
  },
  {
    name: "anim-presets",
    script: "seed-animation-presets.js",
    collections: ["animation_presets"],
    description: "7 animation presets with keyframes",
  },
  {
    name: "2d-parts",
    script: "seed-2d-parts.js",
    collections: [
      "bit_beast_parts", "attack_ring_parts", "weight_disk_parts",
      "sub_parts", "tip_parts", "core_parts", "casing_parts", "spin_track_parts",
    ],
    description: "23 2.5D parts across 8 collections",
  },
  {
    name: "gears",
    script: "seed-gears.js",
    collections: ["gear_parts"],
    description: "5 gear parts (Evolution Gear L/F/S + Infinite Sword/Shield)",
  },
  {
    name: "bey-systems",
    script: "seed-beyblade-systems.js",
    collections: ["beyblade_systems"],
    description: "4 assembled 2.5D beyblade configs",
  },
  {
    name: "arena-systems",
    script: "seed-arena-systems.js",
    collections: ["arena_systems"],
    description: "4 2.5D arena system configs",
  },
  {
    name: "tournament",
    script: "seed-tournament-ai-solo.js",
    collections: ["tournaments", "tournament_participants", "tournament_brackets"],
    description: "4-bracket solo-vs-AI tournament seed",
  },
  {
    name: "element-types",
    script: "seed-element-types.js",
    collections: ["element_type_configs"],
    description: "12 default element types with type matrix",
  },
  {
    name: "turret-attack-types",
    script: "seed-turret-attack-types.js",
    collections: ["turret_attack_types"],
    description: "15 turret attack types + 8 fire patterns",
  },
  {
    name: "arena-feature-configs",
    script: "seed-arena-feature-configs.js",
    collections: ["arena_feature_configs"],
    description: "13 hazard types + 7 effect zones + 10 particle types + 6 env presets",
  },
  {
    name: "bey-link-configs",
    script: "seed-bey-link-configs.js",
    collections: ["bey_link_configs"],
    description: "BeyLink + ArenaLink type catalog (9 categories, 43 entries)",
  },
  {
    name: "geometry",
    script: "seed-geometry.js",
    collections: ["geometry_defs"],
    description: "16 standard geometry primitives (circles, rings, arcs, polygons, Fourier)",
  },
  {
    name: "stat-defs",
    script: "seed-stat-defs.js",
    collections: ["stat_defs"],
    description: "~35 typed stat definitions across beyblade / arena / part / match / modifier categories",
  },
  {
    name: "tip-shapes",
    script: "seed-tip-shapes.js",
    collections: ["tip_shape_defs"],
    description: "16 tip shape presets (flat, sharp, rubber, bearing, etc.)",
  },
  {
    name: "core-gimmicks",
    script: "seed-core-gimmicks.js",
    collections: ["core_gimmick_defs"],
    description: "12 core gimmick types (mode change, dual spin, spring launch, etc.)",
  },
  {
    name: "attack-type-defs",
    script: "seed-attack-type-defs.js",
    collections: ["attack_type_defs"],
    description: "8 attack types for contact points (smash, upper, burst, absorb, etc.)",
  },
  {
    name: "arena-theme-defs",
    script: "seed-arena-theme-defs.js",
    collections: ["arena_theme_defs"],
    description: "12 arena visual themes (volcano, ice, space, neon, etc.)",
  },
  {
    name: "arena-shape-defs",
    script: "seed-arena-shape-defs.js",
    collections: ["arena_shape_defs"],
    description: "10 arena boundary shapes (circle, hexagon, star, stadium, etc.)",
  },
  {
    name: "bowl-profile-defs",
    script: "seed-bowl-profile-defs.js",
    collections: ["bowl_profile_defs"],
    description: "8 bowl wall-angle profiles (flat through extreme 75°)",
  },
  {
    name: "trigger-type-defs",
    script: "seed-trigger-type-defs.js",
    collections: ["trigger_type_defs"],
    description: "12 stat modifier trigger conditions (always, on_hit, low_spin, etc.)",
  },
  {
    name: "stat-event-defs",
    script: "seed-stat-event-defs.js",
    collections: ["stat_event_defs"],
    description: "15 stat tracking events (collision, burst, ring_out, etc.)",
  },
  {
    name: "part-layer-defs",
    script: "seed-part-layer-defs.js",
    collections: ["part_layer_defs"],
    description: "12 part layer types for contact point assignments (upper, blade, guard, etc.)",
  },
];

// ── 4. Parse CLI flags ────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);

const doClear  = hasFlag("--clear") || hasFlag("--reseed");
const doSeed   = !hasFlag("--clear") || hasFlag("--reseed");
const doList   = hasFlag("--list");

const onlyArg  = args.find(a => a.startsWith("--only="))?.slice(7)
  ?? (args.indexOf("--only") >= 0 ? args[args.indexOf("--only") + 1] : null);
const skipArg  = args.find(a => a.startsWith("--skip="))?.slice(7)
  ?? (args.indexOf("--skip") >= 0 ? args[args.indexOf("--skip") + 1] : null);

const onlySet  = onlyArg ? new Set(onlyArg.split(",").map(s => s.trim())) : null;
const skipSet  = skipArg ? new Set(skipArg.split(",").map(s => s.trim())) : null;

function filterSeeders(list) {
  let result = list;
  if (onlySet) result = result.filter(s => onlySet.has(s.name));
  if (skipSet) result = result.filter(s => !skipSet.has(s.name));
  return result;
}

// ── 5. --list ─────────────────────────────────────────────────────────────────
if (doList) {
  console.log("\nAvailable seeders:\n");
  const W = Math.max(...SEEDERS.map(s => s.name.length));
  for (const s of SEEDERS) {
    console.log(`  ${s.name.padEnd(W + 2)} ${s.description}`);
  }
  console.log();
  process.exit(0);
}

// ── 6. Helpers ────────────────────────────────────────────────────────────────
async function clearCollection(name) {
  const snap = await db.collection(name).get();
  if (snap.empty) return 0;
  let batch = db.batch();
  let count = 0;
  let total = snap.size;
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
  return total;
}

function runScript(scriptFile) {
  const fullPath = path.join(__dirname, scriptFile);
  const result = spawnSync(process.execPath, [fullPath], {
    stdio: "inherit",
    env: process.env,   // .env already loaded into process.env
  });
  if (result.status !== 0) {
    throw new Error(`Script ${scriptFile} exited with code ${result.status}`);
  }
}

// ── 7. Main ───────────────────────────────────────────────────────────────────
async function main() {
  const selected = filterSeeders(SEEDERS);

  if (selected.length === 0) {
    console.error("❌  No seeders matched the given --only / --skip filters.");
    console.error(`    Run  node scripts/seed-all.js --list  to see available names.`);
    process.exit(1);
  }

  const totalCollections = selected.flatMap(s => s.collections);

  // ── CLEAR ─────────────────────────────────────────────────────────────────
  if (doClear) {
    console.log("\n🗑️   Clearing collections…\n");
    let cleared = 0;
    for (const seeder of selected) {
      for (const col of seeder.collections) {
        process.stdout.write(`  Clearing ${col}… `);
        const n = await clearCollection(col);
        console.log(n > 0 ? `deleted ${n} docs` : "already empty");
        cleared += n;
      }
    }
    console.log(`\n✅  Cleared ${cleared} total docs from ${totalCollections.length} collection(s).\n`);
    if (!doSeed) { await admin.app().delete(); return; }
  }

  // ── SEED ──────────────────────────────────────────────────────────────────
  if (doSeed) {
    const W = Math.max(...selected.map(s => s.name.length));
    const passed = []; const failed = [];
    const startAll = Date.now();

    console.log(`\n🌱  Seeding ${selected.length} of ${SEEDERS.length} seeders…\n`);

    for (const seeder of selected) {
      process.stdout.write(`  [${seeder.name.padEnd(W)}]  `);
      const start = Date.now();
      try {
        runScript(seeder.script);
        const ms = Date.now() - start;
        console.log(`✓  ${ms}ms`);
        passed.push(seeder.name);
      } catch (err) {
        const ms = Date.now() - start;
        console.log(`✘  ${ms}ms  (${err.message})`);
        failed.push(seeder.name);
      }
    }

    const elapsed = ((Date.now() - startAll) / 1000).toFixed(1);
    console.log("\n────────────────────────────────────────────");
    console.log(`  ✅ ${passed.length} passed  ❌ ${failed.length} failed  ⏱  ${elapsed}s`);
    if (failed.length) {
      console.log(`  Failed: ${failed.join(", ")}`);
      console.log("────────────────────────────────────────────\n");
      await admin.app().delete();
      process.exit(1);
    }
    console.log("────────────────────────────────────────────\n");
  }

  await admin.app().delete();
}

main().catch(err => { console.error("❌ Orchestrator error:", err); process.exit(1); });

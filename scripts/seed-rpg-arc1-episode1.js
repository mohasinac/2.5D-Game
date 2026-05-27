// scripts/seed-rpg-arc1-episode1.js
// Arc 1 — Episode 1: "Let It Rip!"
// Full story seed: Tyson's room → defeating Kai at the Blade Sharks hideout
//
// Run:  node scripts/seed-rpg-arc1-episode1.js
//       node scripts/seed-rpg-arc1-episode1.js --dry-run
// Idempotent — uses set() with { merge: true }.

"use strict";
require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌  Missing Firebase Admin env vars."); process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();
const DRY = process.argv.includes("--dry-run");

// ── helpers ───────────────────────────────────────────────────────────────────
const now = new Date().toISOString();
async function put(col, id, data) {
  if (DRY) { console.log(`  [dry] ${col}/${id}`); return; }
  await db.collection(col).doc(id).set({ ...data, updatedAt: now }, { merge: true });
  console.log(`  ✔  ${col}/${id}`);
}

/** Generate a flat placeholder tile layer (all one tile type). */
function flat(w, h, tile = 0) { return Array(w * h).fill(tile); }

/** Build all five standard tile layers for a map. */
function layers(w, h) {
  return [
    { name: "ground",     width: w, height: h, data: flat(w, h, 0), visible: true  },
    { name: "collision",  width: w, height: h, data: flat(w, h, 0), visible: false },
    { name: "decoration", width: w, height: h, data: flat(w, h, 0), visible: true  },
    { name: "above",      width: w, height: h, data: flat(w, h, 0), visible: true  },
    { name: "events",     width: w, height: h, data: flat(w, h, 0), visible: false },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ARC DEFINITION
// ─────────────────────────────────────────────────────────────────────────────
async function seedArc() {
  console.log("\n📖  Arc");
  await put("rpg_arcs", "arc1_ep1", {
    id: "arc1_ep1",
    displayName: "Season 1 — Episode 1: Let It Rip!",
    order: 1,
    routeIds: ["tyson_route"],
    startingRegionId: "beigoma_city",
    completionFlagId: "arc1_ep1_complete",
    description:
      "Tyson Granger discovers the world of Beyblade, earns rivals and allies on the streets of Beigoma, " +
      "and fights his way to a showdown with the cold-hearted Kai Hiwatari deep inside the Blade Sharks' hideout.",
    levelCap: 20,
    teamBattles: false,
    protagonists: [{ npcId: "tyson", beybladeId: "dragoon", playerControlled: true }],
    previousArcId: null,
  });

  await put("rpg_routes", "tyson_route", {
    id: "tyson_route",
    displayName: "Tyson's Story",
    protagonistNpcId: "tyson",
    description: "Play as Tyson Granger — the kid who never backs down from a challenge.",
    startingMapId: "tyson_room",
    startingTile: { x: 7, y: 2 },
    startingFacing: "down",
    startingBeybladeId: "dragoon",
    cardImageAssetId: "img_tyson_card",
    availableInArcs: ["arc1_ep1"],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. REGION
// ─────────────────────────────────────────────────────────────────────────────
async function seedRegion() {
  console.log("\n🌍  Region");
  await put("rpg_regions", "beigoma_city", {
    id: "beigoma_city",
    displayName: "Beigoma City",
    country: "Japan",
    description: "Tyson's hometown — full of alleys, parks, a dojo, and secrets lurking in every corner.",
    mapIds: [
      "tyson_room", "tyson_dojo", "tyson_backyard",
      "dojo_garden_path", "beigoma_street",
      "beigoma_park", "apartment_1f", "rooftop",
      "river_side", "blade_sharks_hideout",
    ],
    hubMapId: "beigoma_street",
    connections: [],
    unlockGate: null,
    worldMapTile: { x: 5, y: 3 },
    bgmTrackId: "bgm_beigoma_town",
    arcIds: ["arc1_ep1"],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAPS
// ─────────────────────────────────────────────────────────────────────────────
async function seedMaps() {
  console.log("\n🗺️   Maps");

  // ── Tyson's Room ────────────────────────────────────────────────────────────
  await put("rpg_maps", "tyson_room", {
    id: "tyson_room", regionId: "beigoma_city",
    displayName: "Tyson's Room", type: "indoor",
    width: 15, height: 10,
    tilesetId: "tileset_indoor_house",
    layers: layers(15, 10),
    exits: [{
      id: "exit_to_dojo",
      triggerRect: { x: 7, y: 9, width: 1, height: 1 },
      targetMapId: "tyson_dojo", targetEntryId: "from_room",
      direction: "south", transitionType: "door",
    }],
    entryPoints: [
      { id: "default",   tile: { x: 7, y: 2 }, facingDirection: "down" },
      { id: "from_dojo", tile: { x: 7, y: 8 }, facingDirection: "up"  },
    ],
    eventTriggers: [
      {
        id: "trig_wakeup",
        triggerRect: { x: 5, y: 1, width: 5, height: 3 },
        storyEventId: "ev_room_wakeup",
        triggerCondition: { none: { wakeup_done: true } },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_sword_room",
        triggerRect: { x: 1, y: 1, width: 3, height: 4 },
        storyEventId: "ev_dragoon_sword_room",
        triggerCondition: { all: { wakeup_done: true }, none: { sword_room_viewed: true } },
        triggerOnce: true, triggerMode: "interact",
      },
      {
        // After Kai river battle — fade back home
        id: "trig_new_bey_home",
        triggerRect: { x: 3, y: 1, width: 9, height: 8 },
        storyEventId: "ev_new_beyblade_home",
        triggerCondition: { all: { kai_battled_river: true }, none: { new_bey_scene_done: true } },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [],
    bgmTrackId: "bgm_tyson_room", lightingPreset: "indoor",
  });

  // ── Tyson's Dojo ────────────────────────────────────────────────────────────
  await put("rpg_maps", "tyson_dojo", {
    id: "tyson_dojo", regionId: "beigoma_city",
    displayName: "Hiro Family Dojo", type: "indoor",
    width: 25, height: 20,
    tilesetId: "tileset_dojo",
    layers: layers(25, 20),
    exits: [
      { id: "exit_to_room",    triggerRect: { x: 12, y: 0,  width: 1, height: 1 }, targetMapId: "tyson_room",     targetEntryId: "from_dojo",    direction: "north", transitionType: "door" },
      { id: "exit_to_garden",  triggerRect: { x: 12, y: 19, width: 1, height: 1 }, targetMapId: "dojo_garden_path", targetEntryId: "from_dojo",  direction: "south", transitionType: "walk" },
      { id: "exit_to_backyard",triggerRect: { x: 0,  y: 9,  width: 1, height: 3 }, targetMapId: "tyson_backyard", targetEntryId: "from_dojo",    direction: "west",  transitionType: "door" },
    ],
    entryPoints: [
      { id: "default",       tile: { x: 12, y: 16 }, facingDirection: "down"  },
      { id: "from_room",     tile: { x: 12, y: 1  }, facingDirection: "down"  },
      { id: "from_garden",   tile: { x: 12, y: 18 }, facingDirection: "up"    },
      { id: "from_backyard", tile: { x: 1,  y: 10 }, facingDirection: "right" },
    ],
    eventTriggers: [
      {
        id: "trig_sword_dojo",
        triggerRect: { x: 21, y: 2, width: 3, height: 4 },
        storyEventId: "ev_dragoon_sword_dojo",
        triggerCondition: { all: { rooftop_visited: true }, none: { sword_dojo_viewed: true } },
        triggerOnce: true, triggerMode: "interact",
      },
      {
        id: "trig_family_sword_beastawaken",
        triggerRect: { x: 21, y: 2, width: 3, height: 4 },
        storyEventId: "ev_family_sword_interaction",
        triggerCondition: { all: { dragoon_s_assembled: true }, none: { dragoon_bit_beast_awakened: true } },
        triggerOnce: true, triggerMode: "interact",
      },
    ],
    npcPlacements: [
      { npcId: "grandpa", spawnTile: { x: 12, y: 8 } },
    ],
    bgmTrackId: "bgm_dojo", lightingPreset: "indoor",
  });

  // ── Dojo Garden Path ────────────────────────────────────────────────────────
  await put("rpg_maps", "dojo_garden_path", {
    id: "dojo_garden_path", regionId: "beigoma_city",
    displayName: "Dojo Garden", type: "outdoor",
    width: 15, height: 8,
    tilesetId: "tileset_outdoor_city",
    layers: layers(15, 8),
    exits: [
      { id: "exit_to_dojo",   triggerRect: { x: 7, y: 0, width: 1, height: 1 }, targetMapId: "tyson_dojo",    targetEntryId: "from_garden",  direction: "north", transitionType: "walk" },
      { id: "exit_to_street", triggerRect: { x: 7, y: 7, width: 1, height: 1 }, targetMapId: "beigoma_street", targetEntryId: "from_dojo",   direction: "south", transitionType: "walk" },
    ],
    entryPoints: [
      { id: "from_dojo",   tile: { x: 7, y: 1 }, facingDirection: "down" },
      { id: "from_street", tile: { x: 7, y: 6 }, facingDirection: "up"  },
    ],
    eventTriggers: [],
    // Grandpa patrols this corridor — catchRadius 1 fires ev_grandpa_caught
    npcPlacements: [
      { npcId: "grandpa", spawnTile: { x: 7, y: 3 } },
    ],
    bgmTrackId: "bgm_dojo", lightingPreset: "day",
    metaFlags: { grandpaPatrolsHere: true },
  });

  // ── Tyson's Backyard ────────────────────────────────────────────────────────
  await put("rpg_maps", "tyson_backyard", {
    id: "tyson_backyard", regionId: "beigoma_city",
    displayName: "Tyson's Backyard", type: "outdoor",
    width: 20, height: 15,
    tilesetId: "tileset_outdoor_city",
    layers: layers(20, 15),
    exits: [{
      id: "exit_to_dojo",
      triggerRect: { x: 19, y: 6, width: 1, height: 3 },
      targetMapId: "tyson_dojo", targetEntryId: "from_backyard",
      direction: "east", transitionType: "door",
    }],
    entryPoints: [
      { id: "default",   tile: { x: 10, y: 7 }, facingDirection: "down" },
      { id: "from_dojo", tile: { x: 18, y: 7 }, facingDirection: "left" },
    ],
    eventTriggers: [
      {
        id: "trig_practice",
        triggerRect: { x: 6, y: 4, width: 8, height: 7 },
        storyEventId: "ev_backyard_practice",
        triggerCondition: { all: { has_dragoon: true }, none: { dragoon_s_assembled: true } },
        triggerOnce: false, triggerMode: "interact",
      },
      {
        id: "trig_practice_dragoons",
        triggerRect: { x: 6, y: 4, width: 8, height: 7 },
        storyEventId: "ev_backyard_practice_dragoons",
        triggerCondition: { all: { dragoon_s_assembled: true } },
        triggerOnce: false, triggerMode: "interact",
      },
    ],
    npcPlacements: [],
    bgmTrackId: "bgm_beigoma_town", lightingPreset: "day",
  });

  // ── Beigoma Street ──────────────────────────────────────────────────────────
  await put("rpg_maps", "beigoma_street", {
    id: "beigoma_street", regionId: "beigoma_city",
    displayName: "Beigoma City Streets", type: "outdoor",
    width: 40, height: 20,
    tilesetId: "tileset_outdoor_city",
    layers: layers(40, 20),
    exits: [
      { id: "exit_to_garden",   triggerRect: { x: 7, y: 0,  width: 3, height: 1 }, targetMapId: "dojo_garden_path", targetEntryId: "from_street",  direction: "north", transitionType: "walk" },
      { id: "exit_to_park",     triggerRect: { x: 39, y: 8, width: 1, height: 4 }, targetMapId: "beigoma_park",     targetEntryId: "from_street",  direction: "east",  transitionType: "walk" },
      { id: "exit_to_building", triggerRect: { x: 20, y: 0, width: 3, height: 1 }, targetMapId: "apartment_1f",     targetEntryId: "default",      direction: "north", transitionType: "door" },
      { id: "exit_to_river",    triggerRect: { x: 39, y: 0, width: 1, height: 4 }, targetMapId: "river_side",       targetEntryId: "from_street",  direction: "east",  transitionType: "walk" },
      { id: "exit_to_hideout",  triggerRect: { x: 0,  y: 8, width: 1, height: 4 }, targetMapId: "blade_sharks_hideout", targetEntryId: "default",  direction: "west",  transitionType: "walk" },
    ],
    entryPoints: [
      { id: "default",    tile: { x: 9,  y: 2  }, facingDirection: "down" },
      { id: "from_dojo",  tile: { x: 9,  y: 2  }, facingDirection: "down" },
      { id: "from_park",  tile: { x: 37, y: 9  }, facingDirection: "left" },
      { id: "from_river", tile: { x: 37, y: 2  }, facingDirection: "left" },
    ],
    eventTriggers: [
      {
        id: "trig_river_gate",
        triggerRect: { x: 39, y: 0, width: 1, height: 4 },
        storyEventId: "ev_river_gate_blocked",
        triggerCondition: { none: { carlos_defeated: true } },
        triggerOnce: false, triggerMode: "enter",
      },
      {
        id: "trig_hideout_gate",
        triggerRect: { x: 0, y: 8, width: 1, height: 4 },
        storyEventId: "ev_hideout_gate_blocked",
        triggerCondition: { none: { kenny_kidnapped_known: true } },
        triggerOnce: false, triggerMode: "enter",
      },
    ],
    npcPlacements: [],
    bgmTrackId: "bgm_beigoma_town", lightingPreset: "day",
  });

  // ── Beigoma Park ────────────────────────────────────────────────────────────
  await put("rpg_maps", "beigoma_park", {
    id: "beigoma_park", regionId: "beigoma_city",
    displayName: "Beigoma City Park", type: "outdoor",
    width: 45, height: 30,
    tilesetId: "tileset_outdoor_park",
    layers: layers(45, 30),
    exits: [{
      id: "exit_to_street",
      triggerRect: { x: 0, y: 12, width: 1, height: 6 },
      targetMapId: "beigoma_street", targetEntryId: "from_park",
      direction: "west", transitionType: "walk",
    }],
    entryPoints: [
      { id: "default",     tile: { x: 2,  y: 15 }, facingDirection: "right" },
      { id: "from_street", tile: { x: 2,  y: 15 }, facingDirection: "right" },
    ],
    eventTriggers: [
      {
        id: "trig_billy_first",
        triggerRect: { x: 14, y: 8, width: 16, height: 12 },
        storyEventId: "ev_billy_first_encounter",
        triggerCondition: { none: { billy_encountered: true } },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_part_attack_ring",
        triggerRect: { x: 30, y: 20, width: 8, height: 6 },
        storyEventId: "ev_part_found_attack_ring",
        triggerCondition: { all: { q_find_parts_active: true }, none: { part_attack_ring_found: true, has_dragoon: true } },
        triggerOnce: true, triggerMode: "interact",
      },
    ],
    npcPlacements: [
      { npcId: "billy",  spawnTile: { x: 22, y: 14 } },
      { npcId: "kenny",  spawnTile: { x: 10, y: 20 } },
      { npcId: "andrew", spawnTile: { x: 8,  y: 18 } },
    ],
    bgmTrackId: "bgm_beigoma_town", lightingPreset: "day",
  });

  // ── Apartment Ground Floor ──────────────────────────────────────────────────
  await put("rpg_maps", "apartment_1f", {
    id: "apartment_1f", regionId: "beigoma_city",
    displayName: "City Apartment — Ground Floor", type: "indoor",
    width: 20, height: 15,
    tilesetId: "tileset_indoor_apartment",
    layers: layers(20, 15),
    exits: [
      { id: "exit_to_street",   triggerRect: { x: 9,  y: 14, width: 2, height: 1 }, targetMapId: "beigoma_street", targetEntryId: "from_park",   direction: "south", transitionType: "door" },
      { id: "exit_to_rooftop",  triggerRect: { x: 18, y: 6,  width: 2, height: 3 }, targetMapId: "rooftop",        targetEntryId: "from_stairs",  direction: "east",  transitionType: "door" },
    ],
    entryPoints: [
      { id: "default",     tile: { x: 10, y: 13 }, facingDirection: "up"   },
      { id: "from_stairs", tile: { x: 17, y: 7  }, facingDirection: "left" },
    ],
    eventTriggers: [
      {
        id: "trig_staircase_gate",
        triggerRect: { x: 18, y: 6, width: 2, height: 3 },
        storyEventId: "ev_rooftop_locked",
        triggerCondition: { none: { billy_defeated: true } },
        triggerOnce: false, triggerMode: "enter",
      },
    ],
    npcPlacements: [],
    bgmTrackId: "bgm_indoor_ambient", lightingPreset: "indoor",
  });

  // ── Rooftop ─────────────────────────────────────────────────────────────────
  await put("rpg_maps", "rooftop", {
    id: "rooftop", regionId: "beigoma_city",
    displayName: "City Rooftop", type: "outdoor",
    width: 30, height: 15,
    tilesetId: "tileset_rooftop",
    layers: layers(30, 15),
    exits: [{
      id: "exit_to_building",
      triggerRect: { x: 0, y: 6, width: 1, height: 3 },
      targetMapId: "apartment_1f", targetEntryId: "from_stairs",
      direction: "west", transitionType: "door",
    }],
    entryPoints: [
      { id: "default",     tile: { x: 2, y: 7 }, facingDirection: "right" },
      { id: "from_stairs", tile: { x: 2, y: 7 }, facingDirection: "right" },
    ],
    eventTriggers: [
      {
        id: "trig_carlos_scene",
        triggerRect: { x: 4, y: 3, width: 22, height: 9 },
        storyEventId: "ev_rooftop_carlos_scene",
        triggerCondition: { all: { billy_defeated: true }, none: { rooftop_visited: true } },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_kenny_quest",
        triggerRect: { x: 4, y: 3, width: 22, height: 9 },
        storyEventId: "ev_kenny_gives_quest",
        triggerCondition: { all: { carlos_scene_done: true }, none: { q_level5_started: true } },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [
      { npcId: "kenny",  spawnTile: { x: 14, y: 7 } },
      { npcId: "andrew", spawnTile: { x: 17, y: 8 } },
      { npcId: "carlos", spawnTile: { x: 22, y: 6 } },
    ],
    bgmTrackId: "bgm_rooftop", lightingPreset: "evening",
  });

  // ── River Side ──────────────────────────────────────────────────────────────
  await put("rpg_maps", "river_side", {
    id: "river_side", regionId: "beigoma_city",
    displayName: "Beigoma River Side", type: "outdoor",
    width: 40, height: 20,
    tilesetId: "tileset_outdoor_river",
    layers: layers(40, 20),
    exits: [{
      id: "exit_to_street",
      triggerRect: { x: 0, y: 8, width: 1, height: 4 },
      targetMapId: "beigoma_street", targetEntryId: "from_river",
      direction: "west", transitionType: "walk",
    }],
    entryPoints: [
      { id: "default",     tile: { x: 2, y: 10 }, facingDirection: "right" },
      { id: "from_street", tile: { x: 2, y: 10 }, facingDirection: "right" },
    ],
    eventTriggers: [
      {
        id: "trig_river_arrival",
        triggerRect: { x: 4, y: 4, width: 32, height: 12 },
        storyEventId: "ev_river_arrival_scene",
        triggerCondition: { all: { q_level5_complete: true }, none: { river_scene_done: true } },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_kai_entrance",
        triggerRect: { x: 4, y: 4, width: 32, height: 12 },
        storyEventId: "ev_kai_entrance",
        triggerCondition: { all: { carlos_defeated: true }, none: { kai_seen: true } },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [
      { npcId: "carlos",             spawnTile: { x: 20, y: 8  } },
      { npcId: "kenny",              spawnTile: { x: 28, y: 10 } },
      { npcId: "andrew",             spawnTile: { x: 26, y: 10 } },
      { npcId: "kai",                spawnTile: { x: 35, y: 7  } },
      { npcId: "random_blader_rick", spawnTile: { x: 10, y: 11 } },
      { npcId: "random_blader_sam",  spawnTile: { x: 13, y: 13 } },
    ],
    bgmTrackId: "bgm_river", lightingPreset: "day",
  });

  // ── Blade Sharks Hideout ────────────────────────────────────────────────────
  await put("rpg_maps", "blade_sharks_hideout", {
    id: "blade_sharks_hideout", regionId: "beigoma_city",
    displayName: "Blade Sharks Hideout", type: "indoor",
    width: 30, height: 20,
    tilesetId: "tileset_indoor_warehouse",
    layers: layers(30, 20),
    exits: [{
      id: "exit_to_street",
      triggerRect: { x: 0, y: 8, width: 1, height: 4 },
      targetMapId: "beigoma_street", targetEntryId: "from_river",
      direction: "west", transitionType: "door",
    }],
    entryPoints: [
      { id: "default", tile: { x: 2, y: 10 }, facingDirection: "right" },
    ],
    eventTriggers: [
      {
        id: "trig_hideout_entry",
        triggerRect: { x: 4, y: 2, width: 22, height: 16 },
        storyEventId: "ev_blade_sharks_entry",
        triggerCondition: {
          all: { dragoon_bit_beast_awakened: true },
          none: { hideout_entered: true },
        },
        gate: { minPlayerLevel: 10 },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_kai_final",
        triggerRect: { x: 20, y: 4, width: 8, height: 12 },
        storyEventId: "ev_kai_blade_sharks_battle",
        triggerCondition: { all: { hideout_entered: true }, none: { kai_hideout_defeated: true } },
        triggerOnce: false, triggerMode: "enter",
      },
    ],
    npcPlacements: [
      { npcId: "kai",    spawnTile: { x: 24, y: 10 } },
      { npcId: "kenny",  spawnTile: { x: 21, y: 10 } },
      { npcId: "carlos", spawnTile: { x: 14, y: 13 } },
    ],
    bgmTrackId: "bgm_tense", lightingPreset: "indoor",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NPCs
// ─────────────────────────────────────────────────────────────────────────────
async function seedNPCs() {
  console.log("\n👤  NPCs");

  // Grandpa Tate
  await put("rpg_npcs", "grandpa", {
    id: "grandpa", displayName: "Grandpa", type: "story",
    spriteSheetId: "sprite_grandpa", portraitId: "portrait_grandpa",
    defaultFacing: "down", defaultDialogueId: "dlg_grandpa_default",
    catchRadius: 1, catchEventId: "ev_grandpa_caught",
    schedule: [
      { timeSlot: "morning",   mapId: "dojo_garden_path", tile: { x: 7, y: 3 }, facing: "down",
        patrolPath: [{ x: 7, y: 2 }, { x: 7, y: 5 }, { x: 7, y: 2 }] },
      { timeSlot: "afternoon", mapId: "tyson_dojo",        tile: { x: 12, y: 8 }, facing: "down",
        patrolPath: [{ x: 12, y: 5 }, { x: 12, y: 14 }, { x: 12, y: 5 }] },
    ],
    arcIds: ["arc1_ep1"],
  });

  // Billy
  await put("rpg_npcs", "billy", {
    id: "billy", displayName: "Billy", type: "rival",
    spriteSheetId: "sprite_billy", portraitId: "portrait_billy",
    defaultFacing: "left", defaultDialogueId: "dlg_billy_default",
    schedule: [
      { timeSlot: "morning",   mapId: "beigoma_park", tile: { x: 22, y: 14 }, facing: "left" },
      { timeSlot: "afternoon", mapId: "beigoma_park", tile: { x: 22, y: 14 }, facing: "left" },
    ],
    battleConfig: {
      beybladeId: "big_foot", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId: "dlg_billy_battle_intro",
      victoryDialogueId: "dlg_billy_defeated",
      defeatDialogueId: "dlg_billy_wins",
      rematchDialogueId: "dlg_billy_rematch",
      lockedDialogueId: "dlg_billy_default",
      canRematch: true, rematchCooldownBattles: 2,
      xpReward: { playerXP: 80, beybladeXP: 40, beybladeXPTarget: "dragoon" },
      lossXpReward: { playerXP: 20 },
      rewardFlags: { billy_defeated: true },
      awardsBadgeId: "badge_first_victory",
    },
    arcIds: ["arc1_ep1"],
  });

  // Kenny
  await put("rpg_npcs", "kenny", {
    id: "kenny", displayName: "Kenny", type: "ally",
    spriteSheetId: "sprite_kenny", portraitId: "portrait_kenny",
    defaultFacing: "right", defaultDialogueId: "dlg_kenny_default",
    schedule: [
      { timeSlot: "morning",   mapId: "beigoma_park", tile: { x: 10, y: 20 }, facing: "right" },
      { timeSlot: "afternoon", mapId: "rooftop",      tile: { x: 14, y: 7  }, facing: "left"  },
    ],
    questIds: ["q_reach_level_5", "q_find_4_parts"],
    arcIds: ["arc1_ep1"],
  });

  // Andrew
  await put("rpg_npcs", "andrew", {
    id: "andrew", displayName: "Andrew", type: "ally",
    spriteSheetId: "sprite_andrew", portraitId: "portrait_andrew",
    defaultFacing: "right", defaultDialogueId: "dlg_andrew_default",
    schedule: [
      { timeSlot: "morning",   mapId: "beigoma_park", tile: { x: 8,  y: 18 }, facing: "right" },
      { timeSlot: "afternoon", mapId: "rooftop",      tile: { x: 17, y: 8  }, facing: "left"  },
    ],
    battleConfig: {
      beybladeId: "cross_viper", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId: "dlg_andrew_battle_intro",
      victoryDialogueId: "dlg_andrew_defeated",
      defeatDialogueId: "dlg_andrew_wins",
      rematchDialogueId: "dlg_andrew_rematch",
      canRematch: true, rematchCooldownBattles: 1,
      xpReward: { playerXP: 60, beybladeXP: 30 },
      lossXpReward: { playerXP: 15 },
    },
    arcIds: ["arc1_ep1"],
  });

  // Carlos
  await put("rpg_npcs", "carlos", {
    id: "carlos", displayName: "Carlos", type: "rival",
    spriteSheetId: "sprite_carlos", portraitId: "portrait_carlos",
    defaultFacing: "left", defaultDialogueId: "dlg_carlos_default",
    schedule: [
      { timeSlot: "morning",   mapId: "rooftop",    tile: { x: 22, y: 6  }, facing: "left" },
      { timeSlot: "afternoon", mapId: "river_side", tile: { x: 20, y: 8  }, facing: "left" },
    ],
    battleConfig: {
      beybladeId: "trygle", arenaId: "classic_circle", difficulty: "medium",
      introDialogueId: "dlg_carlos_battle_intro",
      victoryDialogueId: "dlg_carlos_defeated",
      defeatDialogueId: "dlg_carlos_player_loses",
      rematchDialogueId: "dlg_carlos_rematch",
      lockedDialogueId: "dlg_carlos_not_ready",
      canRematch: false, rematchCooldownBattles: 0,
      gate: { minPlayerLevel: 5 },
      xpReward: { playerXP: 150, beybladeXP: 80 },
      lossXpReward: { playerXP: 40 },
      rewardFlags: { carlos_defeated: true },
      awardsBadgeId: "badge_carlos_beaten",
    },
    arcIds: ["arc1_ep1"],
  });

  // Kai
  await put("rpg_npcs", "kai", {
    id: "kai", displayName: "Kai", type: "boss",
    spriteSheetId: "sprite_kai", portraitId: "portrait_kai",
    defaultFacing: "left", defaultDialogueId: "dlg_kai_dismissive",
    schedule: [
      { timeSlot: "morning",   mapId: "river_side",           tile: { x: 35, y: 7  }, facing: "left" },
      { timeSlot: "afternoon", mapId: "blade_sharks_hideout", tile: { x: 24, y: 10 }, facing: "left" },
    ],
    battleConfig: {
      beybladeId: "dranzer_s", arenaId: "dark_bowl", difficulty: "hard",
      introDialogueId: "dlg_kai_battle_intro_hideout",
      victoryDialogueId: "dlg_kai_hideout_defeated",
      defeatDialogueId: "dlg_kai_hideout_player_loses",
      lockedDialogueId: "dlg_kai_not_ready",
      rematchDialogueId: "dlg_kai_rematch",
      canRematch: true, rematchCooldownBattles: 0,
      gate: { minPlayerLevel: 10, flags: { all: { dragoon_bit_beast_awakened: true } } },
      xpReward: { playerXP: 300, beybladeXP: 150 },
      lossXpReward: { playerXP: 80 },
      rewardFlags:   { kai_hideout_defeated: true, arc1_ep1_complete: true },
      alwaysSetFlags: { kai_battled_hideout: true },
      awardsBadgeId: "badge_kai_beaten",
    },
    arcIds: ["arc1_ep1"],
  });

  // Kai (river encounter — first meeting, no battle config, just confrontation)
  // The river Kai uses a separate dialogue/event. Battle is gated by story flag.

  // Rick — random blader
  await put("rpg_npcs", "random_blader_rick", {
    id: "random_blader_rick", displayName: "Rick", type: "blader",
    spriteSheetId: "sprite_random_boy_1", portraitId: "portrait_random_1",
    defaultFacing: "right", defaultDialogueId: "dlg_rick_default",
    schedule: [
      { timeSlot: "morning",   mapId: "river_side", tile: { x: 10, y: 11 }, facing: "right" },
      { timeSlot: "afternoon", mapId: "river_side", tile: { x: 10, y: 11 }, facing: "right" },
    ],
    battleConfig: {
      beybladeId: "dragoon", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId: "dlg_rick_battle",
      victoryDialogueId: "dlg_rick_defeated",
      defeatDialogueId: "dlg_rick_wins",
      canRematch: true, rematchCooldownBattles: 1,
      xpReward: { playerXP: 50, beybladeXP: 25 },
      lossXpReward: { playerXP: 10 },
    },
    arcIds: ["arc1_ep1"],
  });

  // Sam — random blader
  await put("rpg_npcs", "random_blader_sam", {
    id: "random_blader_sam", displayName: "Sam", type: "blader",
    spriteSheetId: "sprite_random_boy_2", portraitId: "portrait_random_2",
    defaultFacing: "left", defaultDialogueId: "dlg_sam_default",
    schedule: [
      { timeSlot: "morning",   mapId: "river_side", tile: { x: 13, y: 13 }, facing: "left" },
      { timeSlot: "afternoon", mapId: "river_side", tile: { x: 13, y: 13 }, facing: "left" },
    ],
    battleConfig: {
      beybladeId: "draciel", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId: "dlg_sam_battle",
      victoryDialogueId: "dlg_sam_defeated",
      defeatDialogueId: "dlg_sam_wins",
      canRematch: true, rematchCooldownBattles: 1,
      xpReward: { playerXP: 50, beybladeXP: 25 },
      lossXpReward: { playerXP: 10 },
    },
    arcIds: ["arc1_ep1"],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DIALOGUE TREES
// All dialogue is original character-true writing — not reproduced from any source.
// ─────────────────────────────────────────────────────────────────────────────
async function seedDialogues() {
  console.log("\n💬  Dialogues");

  function dlg(id, startNodeId, nodes) {
    return { id, startNodeId, nodes: Object.fromEntries(nodes.map(n => [n.id, n])) };
  }
  function speech(id, speakerId, text, nextNodeId, opts = {}) {
    return { id, type: "speech", speakerId, text, nextNodeId, ...opts };
  }
  function choice(id, speakerId, text, choices, opts = {}) {
    return { id, type: "choice", speakerId, text, choices, ...opts };
  }
  function end(id) {
    return { id, type: "end", speakerId: "narrator", text: "" };
  }
  function setFlag(id, flags, nextNodeId) {
    return { id, type: "speech", speakerId: "narrator", text: "", setsFlags: flags, nextNodeId };
  }

  const trees = [

    // ── Grandpa wakeup (room) ──────────────────────────────────────────────
    dlg("dlg_grandpa_wakeup", "n1", [
      speech("n1",  "grandpa", "Tyson! The sun's been up for two hours! Get moving, boy!", "n2", { portraitState: "stern" }),
      speech("n2",  "tyson",   "Ugh... five more minutes, Gramps...", "n3", { portraitState: "sleepy" }),
      speech("n3",  "grandpa", "Five more minutes?! I'll give you five seconds! One... two...", "n4", { portraitState: "stern", shake: true }),
      speech("n4",  "tyson",   "Okay, okay! I'm up! I'm up!", "n5"),
      speech("n5",  "grandpa", "That's more like it. Come, there's something I want to show you before training.", "n6", { portraitState: "calm" }),
      speech("n6",  "narrator","[Grandpa gestures toward the far wall of the room.]", "n7"),
      speech("n7",  "grandpa", "See that sword hanging there? That is the Hiro family Dragon Dagger. It has passed down through our bloodline for generations.", "n8"),
      speech("n8",  "tyson",   "Whoa... I never really looked at it before. It's got this weird glow to it.", "n9"),
      speech("n9",  "grandpa", "Hmph. Not weird — ancient. Now enough gawking. To the dojo! Your training starts now!", "n10", { portraitState: "stern" }),
      setFlag("n10", { wakeup_done: true }, "n11"),
      end("n11"),
    ]),

    // ── Grandpa default idle ────────────────────────────────────────────────
    dlg("dlg_grandpa_default", "n1", [
      speech("n1", "grandpa", "Stay focused, Tyson. A blader without discipline is just a kid spinning a toy.", "n2"),
      end("n2"),
    ]),

    // ── Grandpa caught sneaking ─────────────────────────────────────────────
    dlg("dlg_grandpa_caught", "n1", [
      speech("n1", "grandpa", "And just where do you think you're sneaking off to?!", "n2", { portraitState: "angry", shake: true }),
      speech("n2", "tyson",   "I wasn't sneaking! I was just... going for a walk.", "n3"),
      speech("n3", "grandpa", "A walk. Through the garden. Without telling anyone. Uh-huh.", "n4", { portraitState: "skeptical" }),
      speech("n4", "tyson",   "Okay fine, I wanted to go to the park! The guys are probably down there right now!", "n5"),
      speech("n5", "grandpa", "The park will still be there after your training, young man. Back inside!", "n6", { portraitState: "stern" }),
      speech("n6", "tyson",   "But Gramps...", "n7"),
      speech("n7", "grandpa", "No buts! A warrior earns his freedom. Now MARCH.", "n8", { portraitState: "angry", sfxId: "sfx_grandpa_stomp" }),
      end("n8"),
    ]),

    // ── Dragon Sword — room (first view) ───────────────────────────────────
    dlg("dlg_dragoon_sword_room", "n1", [
      speech("n1", "narrator", "[You step closer to the sword on the wall. The blade seems to shimmer faintly...]", "n2"),
      speech("n2", "tyson",    "There's something about this sword... it's like it's watching me.", "n3"),
      speech("n3", "grandpa",  "Your instincts are good, Tyson. The Dragon Dagger is more than steel.", "n4", { portraitState: "calm" }),
      speech("n4", "grandpa",  "One day, when you are ready, its spirit will find its way into your Beyblade. But that day is earned — not given.", "n5"),
      speech("n5", "tyson",    "Its spirit? You mean like... a bit beast?", "n6"),
      speech("n6", "grandpa",  "You have been paying more attention than I thought. Now come. Training first.", "n7", { portraitState: "approving" }),
      setFlag("n7", { sword_room_viewed: true }, "n8"),
      end("n8"),
    ]),

    // ── Dragon Sword — dojo (after rooftop, deeper connection) ─────────────
    dlg("dlg_dragoon_sword_dojo", "n1", [
      speech("n1", "narrator", "[The Dragon Dagger hangs on the dojo wall. After everything you saw at the rooftop, you see it differently now.]", "n2"),
      speech("n2", "tyson",    "Carlos took everyone's Beyblades... Kenny, Andrew... I have to get stronger.", "n3"),
      speech("n3", "narrator", "[You reach out — not quite touching it. A warmth pulses from the blade.]", "n4"),
      speech("n4", "tyson",    "Dragoon... do you feel it too? This sword is connected to you somehow.", "n5"),
      speech("n5", "grandpa",  "Trust what you feel, Tyson.", "n6", { portraitState: "calm" }),
      speech("n6", "grandpa",  "The Dragon's power has always been in our family. When you are truly ready — it will answer.", "n7"),
      speech("n7", "tyson",    "Then I'll get ready. I'll train until I'm strong enough to face anyone.", "n8", { portraitState: "determined" }),
      setFlag("n8", { sword_dojo_viewed: true }, "n9"),
      end("n9"),
    ]),

    // ── Billy — first encounter cutscene trigger ─────────────────────────────
    dlg("dlg_billy_first_scene", "n1", [
      speech("n1", "billy",  "Hey! New kid!", "n2", { portraitState: "aggressive" }),
      speech("n2", "tyson",  "Who, me?", "n3"),
      speech("n3", "billy",  "Yeah, you. You got a Beyblade?", "n4"),
      speech("n4", "tyson",  "Sure do. You want to see what it can do?", "n5", { portraitState: "confident" }),
      speech("n5", "billy",  "Ha! Big words from a little kid. My Big Foot has never lost. Not once. You really wanna embarrass yourself?", "n6", { portraitState: "smug" }),
      speech("n6", "kenny",  "Tyson, don't! That's Billy — he's taken Beyblades from half the kids in this park!", "n7", { portraitState: "scared" }),
      speech("n7", "tyson",  "Taken them? That's low.", "n8", { portraitState: "angry" }),
      speech("n8", "billy",  "Finders keepers. Winner takes all. That's the rules around here.", "n9"),
      speech("n9", "tyson",  "Not my rules. And not today. Let it rip!", "n10", { portraitState: "battle-ready", sfxId: "sfx_let_it_rip" }),
      setFlag("n10", { billy_encountered: true }, "n11"),
      end("n11"),
    ]),

    // ── Billy — battle intro ────────────────────────────────────────────────
    dlg("dlg_billy_battle_intro", "n1", [
      speech("n1", "billy", "Alright rookie, prepare to hand over that Beyblade when Big Foot's done with you!", "n2", { portraitState: "aggressive" }),
      speech("n2", "tyson", "I'm not handing over anything. Dragoon — let it rip!", "n3", { sfxId: "sfx_let_it_rip" }),
      end("n3"),
    ]),

    // ── Billy — player wins ─────────────────────────────────────────────────
    dlg("dlg_billy_defeated", "n1", [
      speech("n1", "billy",  "What?! Impossible! Big Foot never loses!", "n2", { portraitState: "shocked" }),
      speech("n2", "tyson",  "Just did! Guess there's a first time for everything.", "n3", { portraitState: "triumphant" }),
      speech("n3", "kenny",  "Incredible, Tyson! Dragoon's attack power is off the charts — according to Dizzi!", "n4", { portraitState: "excited" }),
      speech("n4", "billy",  "...Don't think this is over. I'll be back.", "n5", { portraitState: "bitter" }),
      end("n5"),
    ]),

    // ── Billy — player loses ────────────────────────────────────────────────
    dlg("dlg_billy_wins", "n1", [
      speech("n1", "billy", "Ha! What did I tell you? Big Foot never fails. Come back when you're actually good.", "n2", { portraitState: "smug" }),
      speech("n2", "tyson", "That was just a warm-up. I'll be back — count on it.", "n3", { portraitState: "determined" }),
      end("n3"),
    ]),

    // ── Billy — rematch ─────────────────────────────────────────────────────
    dlg("dlg_billy_rematch", "n1", [
      speech("n1", "billy", "You again? Still haven't learned your lesson?", "n2", { portraitState: "smug" }),
      speech("n2", "tyson", "I learned plenty. Ready to go again?", "n3"),
      end("n3"),
    ]),

    // ── Billy — default idle ────────────────────────────────────────────────
    dlg("dlg_billy_default", "n1", [
      speech("n1", "billy", "I'm the best blader in this park. Fight me if you dare.", "n2"),
      end("n2"),
    ]),

    // ── Rooftop — Carlos scene ──────────────────────────────────────────────
    dlg("dlg_carlos_rooftop_scene", "n1", [
      speech("n1", "narrator","[You reach the rooftop. A group of kids look miserable. A tough older boy holds a bag full of Beyblades.]", "n2"),
      speech("n2", "carlos",  "Aww, how touching. More little bladers climbing up here to cry.", "n3", { portraitState: "mocking" }),
      speech("n3", "kenny",   "Tyson... that's Carlos. He's a Blade Shark. He took all our Beyblades...", "n4", { portraitState: "frightened" }),
      speech("n4", "andrew",  "Mine too. Said he'd give them back if we could beat him. Nobody could.", "n5", { portraitState: "defeated" }),
      speech("n5", "tyson",   "You stole their Beyblades?! That's seriously uncool.", "n6", { portraitState: "angry" }),
      speech("n6", "carlos",  "Stole? I WON them. There's a difference, rookie.", "n7", { portraitState: "cold" }),
      speech("n7", "tyson",   "Then fight me. Right now. Give them back if I win.", "n8", { portraitState: "determined" }),
      speech("n8", "carlos",  "Ha! You? You just beat Billy. Billy. I've seen better launches from little kids on training wheels.", "n9", { portraitState: "amused" }),
      speech("n9", "carlos",  "Come find me when you're actually worth my time. Until then — stay off my turf.", "n10"),
      speech("n10","narrator","[Carlos pockets the bag of Beyblades and walks toward the stairwell. He doesn't even look back.]", "n11"),
      speech("n11","tyson",   "Hey — I'm not done talking to you!", "n12", { portraitState: "furious" }),
      speech("n12","carlos",  "I am.", "end1", { portraitState: "cold" }),
      end("end1"),
    ]),

    // ── Kenny gives the Level 5 quest ───────────────────────────────────────
    dlg("dlg_kenny_rooftop_quest", "n1", [
      speech("n1", "kenny",  "Tyson, I've been running the numbers with Dizzi. Carlos's Beyblade stats are on a completely different level from Billy's.", "n2"),
      speech("n2", "kenny",  "If you battle him now, you'll just lose everything. You need to get stronger first.", "n3", { portraitState: "analytical" }),
      speech("n3", "andrew", "We believe in you, man. You've got the talent — you just need the experience.", "n4", { portraitState: "encouraging" }),
      speech("n4", "tyson",  "So how strong do I need to get?", "n5"),
      speech("n5", "kenny",  "According to Dizzi... Level 5 should give Dragoon the power to match Trygle. Train in the backyard, battle in the park — get your experience up.", "n6"),
      speech("n6", "tyson",  "Level 5. Got it. I'll get there — and then Carlos is going DOWN.", "n7", { portraitState: "determined", sfxId: "sfx_determined" }),
      setFlag("n7", { q_level5_started: true }, "n8"),
      end("n8"),
    ]),

    // ── Kenny default ────────────────────────────────────────────────────────
    dlg("dlg_kenny_default", "n1", [
      speech("n1", "kenny", "Dizzi's analysis says you need more battle experience before taking on Carlos. Keep training!", "n2"),
      end("n2"),
    ]),

    // ── Andrew battle intro ──────────────────────────────────────────────────
    dlg("dlg_andrew_battle_intro", "n1", [
      speech("n1", "andrew", "Alright Tyson, don't hold back! This is good practice for both of us.", "n2"),
      end("n2"),
    ]),

    // ── Andrew defeated ──────────────────────────────────────────────────────
    dlg("dlg_andrew_defeated", "n1", [
      speech("n1", "andrew", "Whoa! That was intense. You're getting really good, Tyson.", "n2"),
      end("n2"),
    ]),

    // ── Andrew wins ─────────────────────────────────────────────────────────
    dlg("dlg_andrew_wins", "n1", [
      speech("n1", "andrew", "Haha, got you that time! Keep practicing though, you're close.", "n2"),
      end("n2"),
    ]),

    // ── Andrew rematch ───────────────────────────────────────────────────────
    dlg("dlg_andrew_rematch", "n1", [
      speech("n1", "andrew", "Ready to go again? I've been working on my launch technique.", "n2"),
      end("n2"),
    ]),

    // ── Andrew default ───────────────────────────────────────────────────────
    dlg("dlg_andrew_default", "n1", [
      speech("n1", "andrew", "You've really come a long way, Tyson. Carlos doesn't stand a chance.", "n2"),
      end("n2"),
    ]),

    // ── Carlos — default / not ready ────────────────────────────────────────
    dlg("dlg_carlos_not_ready", "n1", [
      speech("n1", "carlos", "You're still weak. Come back when you've actually trained.", "n2", { portraitState: "cold" }),
      end("n2"),
    ]),

    dlg("dlg_carlos_default", "n1", [
      speech("n1", "carlos", "What are you staring at? Battle me if you've got the nerve.", "n2"),
      end("n2"),
    ]),

    // ── Carlos — river battle intro ─────────────────────────────────────────
    dlg("dlg_carlos_battle_intro", "n1", [
      speech("n1", "carlos", "So you actually came back. And you brought that toy of yours.", "n2", { portraitState: "amused" }),
      speech("n2", "tyson",  "Give back everyone's Beyblades, Carlos. This is your last chance to do it the easy way.", "n3", { portraitState: "determined" }),
      speech("n3", "carlos", "Last chance? I like that. Sure, if you can beat Trygle — they're yours. But when you LOSE — Dragoon is mine.", "n4", { portraitState: "cold" }),
      speech("n4", "tyson",  "You won't get anywhere near Dragoon. Let it rip!", "n5", { sfxId: "sfx_let_it_rip" }),
      end("n5"),
    ]),

    // ── Carlos defeated ─────────────────────────────────────────────────────
    dlg("dlg_carlos_defeated", "n1", [
      speech("n1", "carlos", "No... Trygle... how?!", "n2", { portraitState: "shocked" }),
      speech("n2", "tyson",  "A deal's a deal, Carlos. Hand them over.", "n3", { portraitState: "calm" }),
      speech("n3", "carlos", "...", "n4", { portraitState: "humiliated" }),
      speech("n4", "narrator","[Carlos tosses the bag of Beyblades onto the ground. The other kids rush forward, grabbing their own.]", "n5"),
      speech("n5", "carlos", "Don't celebrate yet, kid. You haven't met everyone in the Blade Sharks.", "n6", { portraitState: "bitter" }),
      end("n6"),
    ]),

    // ── Carlos — player loses ────────────────────────────────────────────────
    dlg("dlg_carlos_player_loses", "n1", [
      speech("n1", "carlos", "And that's why you train before you come at me. Better luck next time — if there is one.", "n2", { portraitState: "cold" }),
      speech("n2", "tyson",  "This isn't over, Carlos.", "n3", { portraitState: "determined" }),
      end("n3"),
    ]),

    // ── Carlos rematch (disabled, but left for completeness) ─────────────────
    dlg("dlg_carlos_rematch", "n1", [
      speech("n1", "carlos", "I already lost to you. I won't make the same mistake twice.", "n2"),
      end("n2"),
    ]),

    // ── River arrival scene ──────────────────────────────────────────────────
    dlg("dlg_river_arrival_scene", "n1", [
      speech("n1", "narrator","[The river sparkles in the afternoon sun. You see the group you've been chasing all this time — and Carlos, right in the middle of it.]", "n2"),
      speech("n2", "andrew",  "Tyson! You came!", "n3", { portraitState: "relieved" }),
      speech("n3", "kenny",   "And at Level 5! Dizzi's scan confirms it — you're ready!", "n4", { portraitState: "excited" }),
      speech("n4", "carlos",  "...You really showed up.", "n5", { portraitState: "surprised" }),
      speech("n5", "tyson",   "Said I would. Let's finish this, Carlos.", "n6", { portraitState: "calm" }),
      end("n6"),
    ]),

    // ── Kai entrance at river ────────────────────────────────────────────────
    dlg("dlg_kai_entrance_scene", "n1", [
      speech("n1", "narrator","[A shadow falls across Carlos. Someone has been watching from the distance all along.]", "n2"),
      speech("n2", "carlos",  "K-Kai...", "n3", { portraitState: "frightened" }),
      speech("n3", "narrator","[Without a word, Kai crosses to Carlos. A sharp sound cracks across the air.]", "n4", { sfxId: "sfx_slap", shake: true }),
      speech("n4", "carlos",  "Kai, I—", "n5"),
      speech("n5", "kai",     "You lost.", "n6", { portraitState: "cold" }),
      speech("n6", "carlos",  "I know, but—", "n7"),
      speech("n7", "kai",     "To a beginner.", "n8", { portraitState: "contemptuous" }),
      speech("n8", "tyson",   "HEY! What gives you the right to do that?!", "n9", { portraitState: "furious" }),
      speech("n9", "kai",     "...", "n10"),
      speech("n10","kai",     "Stay out of things that don't concern you.", "n11", { portraitState: "cold" }),
      speech("n11","tyson",   "It concerns me plenty! You're standing right in front of me. I'm Tyson Granger — and I'm challenging you to a battle!", "n12", { portraitState: "battle-ready" }),
      speech("n12","kenny",   "Tyson, wait — that's KAI. The Blade Sharks' top blader! You can't just—", "n13", { portraitState: "panicked" }),
      speech("n13","kai",     "Hmph.", "n14", { portraitState: "amused" }),
      speech("n14","kai",     "You have spirit. I'll give you that. But spirit without skill is just noise.", "n15"),
      speech("n15","tyson",   "Then let me show you it's more than that. Right here, right now.", "n16", { portraitState: "determined" }),
      speech("n16","kai",     "...Fine. This won't take long.", "end1", { portraitState: "cold" }),
      setFlag("end1", { kai_seen: true, kai_challenged: true }, "end2"),
      end("end2"),
    ]),

    // ── Kai river — battle is handled by NPC interaction
    // ── (River Kai uses the same battleConfig as hideout but different dialogue)
    dlg("dlg_kai_river_battle_intro", "n1", [
      speech("n1", "kai",   "Show me what you have, Granger.", "n2", { portraitState: "focused" }),
      speech("n2", "tyson", "Dragoon — let it rip!", "end1", { sfxId: "sfx_let_it_rip" }),
      end("end1"),
    ]),

    // ── Kai dismissive (idle) ────────────────────────────────────────────────
    dlg("dlg_kai_dismissive", "n1", [
      speech("n1", "kai", "Don't waste my time.", "n2", { portraitState: "cold" }),
      end("n2"),
    ]),

    // ── Kai not ready ────────────────────────────────────────────────────────
    dlg("dlg_kai_not_ready", "n1", [
      speech("n1", "kai", "You're not ready. Come back when you have something worth watching.", "n2", { portraitState: "cold" }),
      end("n2"),
    ]),

    // ── Kai hideout — battle intro ───────────────────────────────────────────
    dlg("dlg_kai_battle_intro_hideout", "n1", [
      speech("n1", "tyson", "Let Kenny go, Kai! This is between us!", "n2", { portraitState: "furious" }),
      speech("n2", "kai",   "He'll be free when you beat me. Which you won't.", "n3", { portraitState: "cold" }),
      speech("n3", "tyson", "I've got something new this time. Dragoon S — and we're not holding back!", "n4", { portraitState: "battle-ready" }),
      speech("n4", "kai",   "Dranzer... let's see how bright this little Dragoon burns.", "n5", { portraitState: "focused" }),
      end("n5"),
    ]),

    // ── Kai hideout — player wins ────────────────────────────────────────────
    dlg("dlg_kai_hideout_defeated", "n1", [
      speech("n1", "narrator","[Dranzer S tumbles out of the stadium. For a moment, there is total silence.]", "n2"),
      speech("n2", "kenny",   "TYSON! You did it!", "n3", { portraitState: "ecstatic" }),
      speech("n3", "carlos",  "...He actually won.", "n4", { portraitState: "disbelief" }),
      speech("n4", "kai",     "...", "n5"),
      speech("n5", "kai",     "You've awakened it. The spirit inside your Beyblade.", "n6", { portraitState: "serious" }),
      speech("n6", "tyson",   "What are you talking about? Awakened what?", "n7"),
      speech("n7", "kai",     "A Bit Beast. An ancient spirit sealed inside your blade. That is what Dragoon is.", "n8", { portraitState: "calm" }),
      speech("n8", "tyson",   "Dragoon is... alive?", "n9"),
      speech("n9", "kai",     "They all are. Dranzer. Dragoon. Every Bit Beast chooses its blader. Yours chose well.", "n10", { portraitState: "grudging" }),
      speech("n10","kai",     "Don't let that go to your head, Granger. We are not finished.", "n11"),
      speech("n11","narrator","[Kai picks up Dranzer S and walks toward the exit without another word.]", "n12"),
      speech("n12","tyson",   "Hey — next time, it's a REAL battle! No hostages, no tricks! Just us!", "n13", { portraitState: "excited" }),
      speech("n13","kai",     "...", "end1"),
      end("end1"),
    ]),

    // ── Kai hideout — player loses ───────────────────────────────────────────
    dlg("dlg_kai_hideout_player_loses", "n1", [
      speech("n1", "kai",   "Not enough.", "n2", { portraitState: "cold" }),
      speech("n2", "tyson", "I'm not done yet—", "n3"),
      speech("n3", "kai",   "Yes. You are. For today.", "n4"),
      speech("n4", "kai",   "Go home. Train. Come back when your Bit Beast's flame burns properly.", "n5", { portraitState: "cold" }),
      speech("n5", "tyson", "Bit Beast? What— wait, come back!", "n6"),
      speech("n6", "kai",   "The boy and the girl go free. I have no use for them.", "n7"),
      speech("n7", "narrator","[Kai gestures. The Blade Sharks release Kenny.]", "n8"),
      speech("n8", "kenny", "Tyson... what's a Bit Beast?", "n9", { portraitState: "confused" }),
      speech("n9", "tyson", "I don't know yet. But I'm going to find out — and then I'm beating him for real.", "end1", { portraitState: "determined" }),
      end("end1"),
    ]),

    // ── Kai rematch ──────────────────────────────────────────────────────────
    dlg("dlg_kai_rematch", "n1", [
      speech("n1", "kai",   "You again. You are persistent.", "n2"),
      speech("n2", "tyson", "Rematch. Same stakes.", "n3"),
      speech("n3", "kai",   "...Acceptable.", "end1"),
      end("end1"),
    ]),

    // ── New Beyblade — friends arrive home ──────────────────────────────────
    dlg("dlg_new_beyblade_home", "n1", [
      speech("n1", "grandpa","Tyson! Your friends are here — and they look like they've been up all night!", "n2"),
      speech("n2", "kenny",  "Tyson! Good, you're awake. I've been running analysis all night on what happened with Dragoon.", "n3", { portraitState: "excited-tired" }),
      speech("n3", "andrew", "You battled Kai?! And you're still in one piece? Respect.", "n4", { portraitState: "impressed" }),
      speech("n4", "tyson",  "Dragoon took a hit. A bad one. What's the damage, Chief?", "n5"),
      speech("n5", "kenny",  "It's more than just damage. Dragoon absorbed something from the battle. Energy. Dizzi thinks... it's ready to evolve.", "n6"),
      speech("n6", "tyson",  "Evolve?!", "n7"),
      speech("n7", "kenny",  "Into Dragoon S. I know the upgrade. But I need four specific parts. They're scattered around the city — lost in all the chaos from the Blade Shark raids.", "n8"),
      speech("n8", "tyson",  "Then we find them. Simple. Where do we start?", "n9", { portraitState: "determined" }),
      speech("n9", "kenny",  "The Attack Ring fragment is somewhere in the park arena. Weight Disk Core should be in your dojo's equipment room. The Spin Tip Assembly... I think it washed up by the river. And the Blade Base Casing—", "n10"),
      speech("n10","andrew", "That one's on Blade Shark territory. Be careful, Tyson.", "n11", { portraitState: "worried" }),
      speech("n11","tyson",  "Got it. Four parts, four locations. No Beyblade until we find them all.", "n12", { portraitState: "determined" }),
      speech("n12","kenny",  "Right. And without Dragoon, no battles. You'll have to rely on your feet and your head.", "end1"),
      end("end1"),
    ]),

    // ── 4 parts found — individual ──────────────────────────────────────────
    dlg("dlg_part_attack_ring_found", "n1", [
      speech("n1", "narrator","[Tucked behind the park arena — partially buried under the old tournament board. There it is.]", "n2"),
      speech("n2", "tyson",   "The Attack Ring fragment! One down, three to go.", "end1"),
      end("end1"),
    ]),
    dlg("dlg_part_weight_disk_found", "n1", [
      speech("n1", "narrator","[In the back of the dojo equipment room, wrapped in a training cloth. Grandpa must have stashed it years ago without realising what it was.]", "n2"),
      speech("n2", "tyson",   "The Weight Disk Core. I can't believe it was here the whole time!", "end1"),
      end("end1"),
    ]),
    dlg("dlg_part_spin_tip_found", "n1", [
      speech("n1", "narrator","[You spot something glinting in the riverbank grass. Still intact. The river current must have carried it here from the battle.]", "n2"),
      speech("n2", "tyson",   "The Spin Tip Assembly! Nice — I was worried this one was gone for good.", "end1"),
      end("end1"),
    ]),
    dlg("dlg_part_blade_base_found", "n1", [
      speech("n1", "narrator","[Near the entrance to Blade Shark territory. Someone left it here on purpose — maybe to taunt you, or maybe as a clue.]", "n2"),
      speech("n2", "tyson",   "The Blade Base Casing. Okay. All four. Now — let's build something.", "end1"),
      end("end1"),
    ]),

    // ── Dragoon S assembled ──────────────────────────────────────────────────
    dlg("dlg_dragoon_s_assembled", "n1", [
      speech("n1", "kenny",   "All four parts are ready. Dizzi, run final calibration.", "n2"),
      speech("n2", "narrator","[Kenny's fingers fly across the keyboard. A soft hum fills the room.]", "n3"),
      speech("n3", "kenny",   "...Complete. Tyson — may I present Dragoon S.", "n4"),
      speech("n4", "narrator","[A new Beyblade sits in the launcher. Sleek, sharp, and somehow alive-looking.]", "n5"),
      speech("n5", "tyson",   "Dragoon... you look incredible. And you feel different too.", "n6"),
      speech("n6", "andrew",  "Can I just say — that is the coolest thing I've ever seen.", "n7"),
      speech("n7", "tyson",   "Let's get to the backyard. I need to see what this thing can really do.", "end1", { portraitState: "excited", sfxId: "sfx_upgrade_complete" }),
      end("end1"),
    ]),

    // ── Family sword — Dragoon bit beast awakens ─────────────────────────────
    dlg("dlg_family_sword_dragoon_awaken", "n1", [
      speech("n1", "narrator","[You stand before the Dragon Dagger with Dragoon S in hand. Something pulls at you — a feeling you can't explain.]", "n2"),
      speech("n2", "tyson",   "Dragoon S... something in this sword is the same as something in you. I can feel it.", "n3"),
      speech("n3", "narrator","[You reach out and touch the blade. The room explodes in white light—]", "n4", { sfxId: "sfx_bit_beast_flash" }),
      speech("n4", "narrator","[—and you see it. A massive dragon made of lightning, circling the dojo. Ancient. Powerful. Looking right at you.]", "n5"),
      speech("n5", "tyson",   "D-Dragoon?!", "n6"),
      speech("n6", "narrator","[The dragon roars — and everything goes quiet. When your vision clears, Dragoon S glows from the inside.]", "n7"),
      speech("n7", "grandpa", "...", "n8", { portraitState: "moved" }),
      speech("n8", "grandpa", "It has chosen you, Tyson. The Dragon Spirit. The Bit Beast.", "n9"),
      speech("n9", "tyson",   "That was really Dragoon? He's... in my Beyblade?", "n10"),
      speech("n10","grandpa", "He always was. He was simply waiting for you to be worthy of seeing him.", "n11"),
      speech("n11","tyson",   "Storm Attack... now I know where it really comes from.", "n12", { portraitState: "awed" }),
      speech("n12","grandpa", "Go. Use that power well. And come home safe.", "end1", { portraitState: "proud" }),
      end("end1"),
    ]),

    // ── Blade Sharks Hideout — entry ─────────────────────────────────────────
    dlg("dlg_blade_sharks_entry_scene", "n1", [
      speech("n1", "narrator","[The hideout is dim and cold. And in the middle of it — Kenny, tied to a post. Carlos sits in the corner, holding the shattered remains of Trygle.]", "n2"),
      speech("n2", "tyson",   "Kenny! Are you okay?!", "n3", { portraitState: "alarmed" }),
      speech("n3", "kenny",   "Tyson... I'm fine. Just scared. Dizzi got damaged, I don't know if she's—", "n4", { portraitState: "shaken" }),
      speech("n4", "tyson",   "She'll be fine. I'm getting you out of here. Who did this?", "n5", { portraitState: "determined" }),
      speech("n5", "carlos",  "Who do you think.", "n6", { portraitState: "hollow" }),
      speech("n6", "tyson",   "Carlos... your Beyblade—", "n7"),
      speech("n7", "carlos",  "Kai destroyed it. Said it was punishment for losing to you. Said weak bladers don't deserve Beyblades.", "n8", { portraitState: "bitter-sad" }),
      speech("n8", "tyson",   "That's... that's brutal.", "n9"),
      speech("n9", "carlos",  "He's in the back. Waiting for you. He said you'd come.", "n10"),
      speech("n10","tyson",   "He was right.", "n11", { portraitState: "cold-determined" }),
      speech("n11","carlos",  "Tyson. Be careful. Dranzer S is different from when you last saw it. He's been training.", "n12"),
      speech("n12","tyson",   "So have I. And I've got Dragoon with me now. The real Dragoon.", "end1", { portraitState: "confident" }),
      end("end1"),
    ]),

    // ── Gatekeeper dialogues ─────────────────────────────────────────────────
    dlg("dlg_river_gate_blocked", "n1", [
      speech("n1", "narrator","[Something's happening down by the river — you can hear voices. But you're not ready to face what's there yet. Defeat Carlos first.]", "n2"),
      end("n2"),
    ]),
    dlg("dlg_hideout_gate_blocked", "n1", [
      speech("n1", "narrator","[The building on the other side of the street looks abandoned. Something feels wrong — but you don't know enough yet to go in there.]", "n2"),
      end("n2"),
    ]),
    dlg("dlg_rooftop_locked", "n1", [
      speech("n1", "narrator","[The staircase door is blocked. Some older kids are guarding it — they say only bladers who have proven themselves can go up.]", "n2"),
      speech("n2", "narrator","[Beat Billy in the park first.]", "end1"),
      end("end1"),
    ]),

    // ── Random bladers ──────────────────────────────────────────────────────
    dlg("dlg_rick_default", "n1", [
      speech("n1", "random_blader_rick", "Hey, you want to battle? I just got my Beyblade back and I'm itching to use it!", "n2"),
      end("n2"),
    ]),
    dlg("dlg_rick_battle", "n1", [
      speech("n1", "random_blader_rick", "Thanks for standing up to those Blade Sharks. Now — let's battle for real!", "n2"),
      end("n2"),
    ]),
    dlg("dlg_rick_defeated", "n1", [
      speech("n1", "random_blader_rick", "Ha, you're really something! I'll get better, promise!", "n2"),
      end("n2"),
    ]),
    dlg("dlg_rick_wins", "n1", [
      speech("n1", "random_blader_rick", "Yes! Nice try though — you're getting stronger, I can tell!", "n2"),
      end("n2"),
    ]),
    dlg("dlg_sam_default", "n1", [
      speech("n1", "random_blader_sam", "You're Tyson, right? I saw you battle Carlos. That was amazing!", "n2"),
      end("n2"),
    ]),
    dlg("dlg_sam_battle", "n1", [
      speech("n1", "random_blader_sam", "I'm not as strong as Carlos — but I've been training! Don't go easy on me!", "n2"),
      end("n2"),
    ]),
    dlg("dlg_sam_defeated", "n1", [
      speech("n1", "random_blader_sam", "You're incredible! I've got a long way to go...", "n2"),
      end("n2"),
    ]),
    dlg("dlg_sam_wins", "n1", [
      speech("n1", "random_blader_sam", "I won! I actually won! You're still way stronger than me though, for real.", "n2"),
      end("n2"),
    ]),
  ];

  for (const tree of trees) {
    await put("rpg_dialogues", tree.id, tree);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. STORY EVENTS
// ─────────────────────────────────────────────────────────────────────────────
async function seedStoryEvents() {
  console.log("\n📜  Story Events");

  const events = [
    // ── Room wakeup ──────────────────────────────────────────────────────────
    {
      id: "ev_room_wakeup",
      displayName: "Tyson Wakes Up",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { none: { wakeup_done: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-bgm", bgmId: "bgm_tyson_room" },
        { type: "dialogue", dialogueId: "dlg_grandpa_wakeup" },
        { type: "unlock-player" },
      ],
      completionFlags: { wakeup_done: true },
    },

    // ── Dragon Sword — room ──────────────────────────────────────────────────
    {
      id: "ev_dragoon_sword_room",
      displayName: "Dragon Sword (Room)",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { wakeup_done: true }, none: { sword_room_viewed: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "camera-pan", targetTile: { x: 2, y: 2 } },
        { type: "screen-flash", flashColor: "#ffffff", duration: 200 },
        { type: "dialogue", dialogueId: "dlg_dragoon_sword_room" },
        { type: "camera-pan", targetTile: { x: 7, y: 5 } },
        { type: "unlock-player" },
      ],
      completionFlags: { sword_room_viewed: true },
    },

    // ── Grandpa catches Tyson ────────────────────────────────────────────────
    {
      id: "ev_grandpa_caught",
      displayName: "Grandpa Catches Tyson",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: {},
      triggerOnce: false, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-sfx", sfxId: "sfx_grandpa_catch" },
        { type: "dialogue", dialogueId: "dlg_grandpa_caught" },
        // Reset player back to top of garden path
        { type: "move-player", targetTile: { x: 7, y: 1 } },
        { type: "unlock-player" },
      ],
      completionFlags: {},
    },

    // ── Dragon Sword — dojo ──────────────────────────────────────────────────
    {
      id: "ev_dragoon_sword_dojo",
      displayName: "Dragon Sword (Dojo — After Rooftop)",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { rooftop_visited: true }, none: { sword_dojo_viewed: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "camera-pan", targetTile: { x: 22, y: 3 } },
        { type: "play-sfx", sfxId: "sfx_sword_shimmer" },
        { type: "dialogue", dialogueId: "dlg_dragoon_sword_dojo" },
        { type: "camera-pan", targetTile: { x: 12, y: 10 } },
        { type: "unlock-player" },
      ],
      completionFlags: { sword_dojo_viewed: true },
    },

    // ── Backyard practice (Dragoon) ──────────────────────────────────────────
    {
      id: "ev_backyard_practice",
      displayName: "Backyard Practice (Dragoon)",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { has_dragoon: true }, none: { dragoon_s_assembled: true } },
      triggerOnce: false, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "show-title-card", titleText: "Practice Mode", subtitleText: "Tyson's Backyard" },
        {
          type: "start-battle",
          battleParams: {
            mode: "ai", playerBeybladeId: "dragoon", opponentBeybladeId: "dark_helmet",
            arenaId: "classic_circle", difficulty: "medium", npcId: "training_dummy",
            bestOf: 1, rpgContext: { isBossEncounter: false },
          },
        },
        { type: "unlock-player" },
      ],
      completionFlags: {},
    },

    // ── Backyard practice (Dragoon S) ────────────────────────────────────────
    {
      id: "ev_backyard_practice_dragoons",
      displayName: "Backyard Practice (Dragoon S)",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { dragoon_s_assembled: true } },
      triggerOnce: false, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "show-title-card", titleText: "Training", subtitleText: "Testing Dragoon S" },
        {
          type: "start-battle",
          battleParams: {
            mode: "ai", playerBeybladeId: "dragoon_s", opponentBeybladeId: "dark_helmet",
            arenaId: "classic_circle", difficulty: "hard", npcId: "training_dummy",
            bestOf: 1, rpgContext: { isBossEncounter: false },
          },
        },
        { type: "unlock-player" },
      ],
      completionFlags: {},
    },

    // ── Billy first encounter ────────────────────────────────────────────────
    {
      id: "ev_billy_first_encounter",
      displayName: "Billy — First Encounter",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { none: { billy_encountered: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "spawn-npc", npcId: "billy" },
        { type: "dialogue", dialogueId: "dlg_billy_first_scene" },
        { type: "unlock-player" },
      ],
      completionFlags: { billy_encountered: true },
    },

    // ── Rooftop — Carlos scene ───────────────────────────────────────────────
    {
      id: "ev_rooftop_carlos_scene",
      displayName: "Rooftop — Carlos Has Everyone's Beys",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { billy_defeated: true }, none: { rooftop_visited: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-bgm", bgmId: "bgm_rooftop" },
        { type: "show-title-card", titleText: "City Rooftop", subtitleText: "Evening" },
        { type: "spawn-npc", npcId: "carlos" },
        { type: "spawn-npc", npcId: "kenny"  },
        { type: "spawn-npc", npcId: "andrew" },
        { type: "wait", duration: 800 },
        { type: "dialogue", dialogueId: "dlg_carlos_rooftop_scene" },
        { type: "despawn-npc", npcId: "carlos" },
        { type: "unlock-player" },
      ],
      completionFlags: { rooftop_visited: true, carlos_scene_done: true },
    },

    // ── Kenny gives Level 5 quest ────────────────────────────────────────────
    {
      id: "ev_kenny_gives_quest",
      displayName: "Kenny — Reach Level 5 Quest",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { carlos_scene_done: true }, none: { q_level5_started: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "dialogue", dialogueId: "dlg_kenny_rooftop_quest" },
        { type: "unlock-player" },
      ],
      completionFlags: { q_level5_started: true },
    },

    // ── River side arrival ───────────────────────────────────────────────────
    {
      id: "ev_river_arrival_scene",
      displayName: "River Side Arrival",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { q_level5_complete: true }, none: { river_scene_done: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-bgm", bgmId: "bgm_river_arrive" },
        { type: "show-title-card", titleText: "Beigoma River Side" },
        { type: "dialogue", dialogueId: "dlg_river_arrival_scene" },
        { type: "unlock-player" },
      ],
      completionFlags: { river_scene_done: true },
    },

    // ── Kai entrance ─────────────────────────────────────────────────────────
    {
      id: "ev_kai_entrance",
      displayName: "Kai Arrives at the River",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { carlos_defeated: true }, none: { kai_seen: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-bgm", bgmId: "bgm_kai_theme" },
        { type: "wait", duration: 600 },
        { type: "spawn-npc", npcId: "kai" },
        { type: "move-npc", npcId: "kai", targetTile: { x: 22, y: 8 } },
        { type: "camera-pan", targetTile: { x: 22, y: 8 } },
        { type: "dialogue", dialogueId: "dlg_kai_entrance_scene" },
        { type: "save-checkpoint" },
        { type: "unlock-player" },
      ],
      completionFlags: { kai_seen: true, kai_challenged: true },
    },

    // ── River gate blocked ───────────────────────────────────────────────────
    {
      id: "ev_river_gate_blocked",
      displayName: "River Gate — Not Ready",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { none: { carlos_defeated: true } },
      triggerOnce: false, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "dialogue", dialogueId: "dlg_river_gate_blocked" },
        { type: "unlock-player" },
      ],
      completionFlags: {},
    },

    // ── Rooftop locked ───────────────────────────────────────────────────────
    {
      id: "ev_rooftop_locked",
      displayName: "Rooftop Staircase — Locked",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { none: { billy_defeated: true } },
      triggerOnce: false, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "dialogue", dialogueId: "dlg_rooftop_locked" },
        { type: "unlock-player" },
      ],
      completionFlags: {},
    },

    // ── Kai battle aftermath (river) — fires on re-enter room ────────────────
    {
      id: "ev_new_beyblade_home",
      displayName: "New Beyblade — Home (After Kai River Battle)",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { kai_battled_river: true }, none: { new_bey_scene_done: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "screen-fade", duration: 600 },
        { type: "play-bgm", bgmId: "bgm_tyson_room" },
        { type: "wait", duration: 400 },
        { type: "dialogue", dialogueId: "dlg_new_beyblade_home" },
        { type: "set-flags", flags: { has_dragoon: false, q_find_parts_active: true } },
        // Unequip Dragoon until rebuilt
        { type: "unlock-player" },
      ],
      completionFlags: { new_bey_scene_done: true, q_find_parts_active: true },
    },

    // ── Part finds (4 events) ────────────────────────────────────────────────
    {
      id: "ev_part_found_attack_ring",
      displayName: "Found: Attack Ring Fragment",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { q_find_parts_active: true }, none: { part_attack_ring_found: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-sfx", sfxId: "sfx_item_pickup" },
        { type: "screen-flash", flashColor: "#ffdd44", duration: 150 },
        { type: "dialogue", dialogueId: "dlg_part_attack_ring_found" },
        { type: "award-item", itemId: "dragoon_s_attack_ring", quantity: 1 },
        { type: "set-flags", flags: { part_attack_ring_found: true } },
        { type: "unlock-player" },
      ],
      completionFlags: { part_attack_ring_found: true },
    },
    {
      id: "ev_part_found_weight_disk",
      displayName: "Found: Weight Disk Core",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { q_find_parts_active: true }, none: { part_weight_disk_found: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-sfx", sfxId: "sfx_item_pickup" },
        { type: "screen-flash", flashColor: "#ffdd44", duration: 150 },
        { type: "dialogue", dialogueId: "dlg_part_weight_disk_found" },
        { type: "award-item", itemId: "dragoon_s_weight_disk", quantity: 1 },
        { type: "set-flags", flags: { part_weight_disk_found: true } },
        { type: "unlock-player" },
      ],
      completionFlags: { part_weight_disk_found: true },
    },
    {
      id: "ev_part_found_spin_tip",
      displayName: "Found: Spin Tip Assembly",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { q_find_parts_active: true }, none: { part_spin_tip_found: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-sfx", sfxId: "sfx_item_pickup" },
        { type: "screen-flash", flashColor: "#ffdd44", duration: 150 },
        { type: "dialogue", dialogueId: "dlg_part_spin_tip_found" },
        { type: "award-item", itemId: "dragoon_s_spin_tip", quantity: 1 },
        { type: "set-flags", flags: { part_spin_tip_found: true } },
        { type: "unlock-player" },
      ],
      completionFlags: { part_spin_tip_found: true },
    },
    {
      id: "ev_part_found_blade_base",
      displayName: "Found: Blade Base Casing",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { q_find_parts_active: true }, none: { part_blade_base_found: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-sfx", sfxId: "sfx_item_pickup" },
        { type: "screen-flash", flashColor: "#ffdd44", duration: 150 },
        { type: "dialogue", dialogueId: "dlg_part_blade_base_found" },
        { type: "award-item", itemId: "dragoon_s_blade_base", quantity: 1 },
        { type: "set-flags", flags: { part_blade_base_found: true } },
        { type: "unlock-player" },
      ],
      completionFlags: { part_blade_base_found: true },
    },

    // ── Dragoon S assembled ──────────────────────────────────────────────────
    {
      id: "ev_dragoon_s_assembled",
      displayName: "Dragoon S Assembled!",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: {
        all: {
          part_attack_ring_found: true, part_weight_disk_found: true,
          part_spin_tip_found: true,    part_blade_base_found: true,
        },
        none: { dragoon_s_assembled: true },
      },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "screen-flash", flashColor: "#ffffff", duration: 300 },
        { type: "play-sfx", sfxId: "sfx_upgrade_complete" },
        { type: "dialogue", dialogueId: "dlg_dragoon_s_assembled" },
        { type: "award-beyblade", beybladeId: "dragoon_s" },
        { type: "set-flags", flags: { dragoon_s_assembled: true, has_dragoon: true } },
        { type: "set-arc-level-cap", levelCap: 20 },
        { type: "unlock-player" },
      ],
      completionFlags: { dragoon_s_assembled: true },
    },

    // ── Family sword — Dragoon bit beast ────────────────────────────────────
    {
      id: "ev_family_sword_interaction",
      displayName: "Family Sword — Dragon Spirit Awakens",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { dragoon_s_assembled: true }, none: { dragoon_bit_beast_awakened: true } },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "camera-pan", targetTile: { x: 22, y: 3 } },
        { type: "play-bgm", bgmId: "bgm_bit_beast_awaken" },
        { type: "screen-flash", flashColor: "#00aaff", duration: 800 },
        { type: "camera-shake" },
        { type: "dialogue", dialogueId: "dlg_family_sword_dragoon_awaken" },
        { type: "set-flags", flags: { dragoon_bit_beast_awakened: true, kenny_kidnapped_known: true } },
        { type: "camera-pan", targetTile: { x: 12, y: 10 } },
        { type: "play-bgm", bgmId: "bgm_dojo" },
        { type: "unlock-player" },
      ],
      completionFlags: { dragoon_bit_beast_awakened: true, kenny_kidnapped_known: true },
    },

    // ── Hideout blocked ──────────────────────────────────────────────────────
    {
      id: "ev_hideout_gate_blocked",
      displayName: "Hideout — Not Ready",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { none: { kenny_kidnapped_known: true } },
      triggerOnce: false, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "dialogue", dialogueId: "dlg_hideout_gate_blocked" },
        { type: "unlock-player" },
      ],
      completionFlags: {},
    },

    // ── Blade Sharks entry ───────────────────────────────────────────────────
    {
      id: "ev_blade_sharks_entry",
      displayName: "Blade Sharks Hideout — Entry",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { dragoon_bit_beast_awakened: true }, none: { hideout_entered: true } },
      gate: { minPlayerLevel: 10 },
      triggerOnce: true, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-bgm", bgmId: "bgm_tense" },
        { type: "show-title-card", titleText: "Blade Sharks Hideout", subtitleText: "East of Beigoma Street" },
        { type: "wait", duration: 1000 },
        { type: "dialogue", dialogueId: "dlg_blade_sharks_entry_scene" },
        { type: "unlock-player" },
      ],
      completionFlags: { hideout_entered: true },
    },

    // ── Kai — final battle setup ─────────────────────────────────────────────
    {
      id: "ev_kai_blade_sharks_battle",
      displayName: "Kai — Final Battle (Blade Sharks)",
      arcId: "arc1_ep1", category: "shared",
      triggerCondition: { all: { hideout_entered: true }, none: { kai_hideout_defeated: true } },
      triggerOnce: false, blocksPlayerInput: true,
      steps: [
        { type: "lock-player" },
        { type: "play-bgm", bgmId: "bgm_boss_encounter" },
        { type: "dialogue", dialogueId: "dlg_kai_battle_intro_hideout" },
        {
          type: "start-battle",
          battleParams: {
            mode: "ai", playerBeybladeId: "dragoon_s", opponentBeybladeId: "dranzer_s",
            arenaId: "dark_bowl", difficulty: "hard", npcId: "kai",
            bestOf: 1,
            rpgContext: { storyEventId: "ev_kai_blade_sharks_battle", isBossEncounter: true },
          },
        },
        { type: "unlock-player" },
      ],
      completionFlags: {},
    },
  ];

  for (const ev of events) {
    await put("rpg_story_events", ev.id, ev);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. QUESTS
// ─────────────────────────────────────────────────────────────────────────────
async function seedQuests() {
  console.log("\n📋  Quests");

  const quests = [

    // ── Reach Level 5 ─────────────────────────────────────────────────────────
    {
      id: "q_reach_level_5",
      title: "Get Strong Enough to Face Carlos",
      description: "Kenny says you need to reach Level 5 before challenging Carlos. Battle in the park and practice in the backyard!",
      arcId: "arc1_ep1", category: "main",
      prerequisites: [],
      requiredFlags: { all: { q_level5_started: true } },
      objectives: [
        { id: "obj_reach_lv5", type: "reach-level", targetId: "player", quantity: 5,
          description: "Reach Player Level 5", optional: false },
      ],
      rewards: {
        reputation: 10,
        setFlags: { q_level5_complete: true },
        xp: { playerXP: 100 },
        unlockMapIds: ["river_side"],
      },
      failCondition: null,
    },

    // ── Find the 4 Dragoon S Parts ────────────────────────────────────────────
    {
      id: "q_find_4_parts",
      title: "Rebuild Dragoon",
      description: "Kenny needs four specific parts scattered across the city to rebuild Dragoon into Dragoon S. You have no Beyblade until then — explore carefully.",
      arcId: "arc1_ep1", category: "main",
      prerequisites: ["q_reach_level_5"],
      requiredFlags: { all: { q_find_parts_active: true } },
      objectives: [
        { id: "obj_attack_ring", type: "collect-item", targetId: "dragoon_s_attack_ring", quantity: 1,
          description: "Find the Attack Ring Fragment (Beigoma Park)", optional: false },
        { id: "obj_weight_disk", type: "collect-item", targetId: "dragoon_s_weight_disk", quantity: 1,
          description: "Find the Weight Disk Core (Hiro Dojo)", optional: false },
        { id: "obj_spin_tip",   type: "collect-item", targetId: "dragoon_s_spin_tip",    quantity: 1,
          description: "Find the Spin Tip Assembly (River Side)", optional: false },
        { id: "obj_blade_base", type: "collect-item", targetId: "dragoon_s_blade_base",  quantity: 1,
          description: "Find the Blade Base Casing (Near Blade Shark territory)", optional: false },
      ],
      rewards: {
        beybladeId: "dragoon_s",
        setFlags: { dragoon_s_assembled: true },
        xp: { playerXP: 200 },
      },
      failCondition: null,
    },

    // ── Defeat Kai at Blade Sharks ────────────────────────────────────────────
    {
      id: "q_defeat_blade_sharks_kai",
      title: "Rescue Kenny — Defeat Kai",
      description: "Kenny is being held in the Blade Sharks hideout. Storm in and beat Kai in a battle to free him. You'll need Dragoon S at full power and the Dragon Spirit on your side.",
      arcId: "arc1_ep1", category: "main",
      prerequisites: ["q_find_4_parts"],
      requiredFlags: { all: { dragoon_bit_beast_awakened: true } },
      objectives: [
        { id: "obj_defeat_kai", type: "defeat-npc", targetId: "kai", quantity: 1,
          description: "Defeat Kai at the Blade Sharks hideout", optional: false },
      ],
      rewards: {
        reputation: 50,
        setFlags: { arc1_ep1_complete: true },
        xp: { playerXP: 500, beybladeXP: 200, beybladeXPTarget: "dragoon_s" },
        badgeId: "badge_kai_beaten",
        friendship: { carlos: 30, kenny: 25, andrew: 25 },
      },
      failCondition: null,
    },
  ];

  for (const q of quests) {
    await put("rpg_quests", q.id, q);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. ITEMS
// ─────────────────────────────────────────────────────────────────────────────
async function seedItems() {
  console.log("\n🎒  Items");

  const items = [
    {
      id: "dragoon_s_attack_ring",
      displayName: "Attack Ring Fragment",
      description: "A jagged attack ring component from the original Dragoon. Still sharp — still dangerous.",
      category: "beyblade-part", iconAssetId: "icon_attack_ring",
      stackable: false, usable: false, questRelated: true,
    },
    {
      id: "dragoon_s_weight_disk",
      displayName: "Weight Disk Core",
      description: "The heavy central disk that controls Dragoon's balance. Found in the dojo equipment room.",
      category: "beyblade-part", iconAssetId: "icon_weight_disk",
      stackable: false, usable: false, questRelated: true,
    },
    {
      id: "dragoon_s_spin_tip",
      displayName: "Spin Tip Assembly",
      description: "The tip and shaft assembly that defines Dragoon's movement. Recovered from the river.",
      category: "beyblade-part", iconAssetId: "icon_spin_tip",
      stackable: false, usable: false, questRelated: true,
    },
    {
      id: "dragoon_s_blade_base",
      displayName: "Blade Base Casing",
      description: "The reinforced base casing. Slightly scorched from the battle with Kai — which somehow makes it stronger.",
      category: "beyblade-part", iconAssetId: "icon_blade_base",
      stackable: false, usable: false, questRelated: true,
    },
    {
      id: "standard_ripcord",
      displayName: "Standard Ripcord",
      description: "A basic ripcord for launching your Beyblade. It wears out after several battles.",
      category: "launcher", iconAssetId: "icon_ripcord",
      stackable: true, maxStack: 5, usable: false, questRelated: false,
      buyPrice: 30, sellPrice: 10,
      maxDurability: 100, wearRate: 25, launchBoost: 0, isLauncher: false,
    },
    {
      id: "standard_launcher",
      displayName: "Standard Launcher",
      description: "A reliable grip launcher. Durable enough for everyday battles.",
      category: "launcher", iconAssetId: "icon_launcher",
      stackable: false, usable: false, questRelated: false,
      buyPrice: 120, sellPrice: 40,
      maxDurability: 100, wearRate: 15, launchBoost: 0.05, isLauncher: true,
    },
    {
      id: "grip_tape_upgrade",
      displayName: "Grip Tape Upgrade",
      description: "A rubberised grip add-on that improves launch power by 8%.",
      category: "accessory", iconAssetId: "icon_grip_tape",
      stackable: false, usable: false, questRelated: false,
      buyPrice: 80, sellPrice: 25,
      launchBoost: 0.08, isLauncherUpgrade: true,
    },
  ];

  for (const item of items) {
    await put("rpg_items", item.id, item);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. BADGES
// ─────────────────────────────────────────────────────────────────────────────
async function seedBadges() {
  console.log("\n🏅  Badges");

  const badges = [
    {
      id: "badge_first_victory",
      displayName: "First Victory",
      description: "Won your very first Beyblade battle against Billy in Beigoma Park.",
      iconAssetId: "icon_badge_first_win",
      category: "street", arcId: "arc1_ep1",
      earnCondition: { type: "defeat-npc", targetId: "billy" }, order: 1,
    },
    {
      id: "badge_carlos_beaten",
      displayName: "Blade Shark Breaker",
      description: "Defeated Carlos and won back the stolen Beyblades. Justice delivered.",
      iconAssetId: "icon_badge_carlos",
      category: "street", arcId: "arc1_ep1",
      earnCondition: { type: "defeat-npc", targetId: "carlos" }, order: 2,
    },
    {
      id: "badge_kai_beaten",
      displayName: "Kai's Grudging Respect",
      description: "Defeated Kai Hiwatari at the Blade Sharks hideout and freed Kenny. Bit Beasts are real.",
      iconAssetId: "icon_badge_kai",
      category: "arc", arcId: "arc1_ep1",
      earnCondition: { type: "defeat-npc", targetId: "kai" }, order: 3,
    },
  ];

  for (const badge of badges) {
    await put("rpg_badges", badge.id, badge);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. MAP EVENT TRIGGERS FOR PART FINDS (dojo + street)
//     These augment the maps seeded above with additional triggers.
// ─────────────────────────────────────────────────────────────────────────────
async function seedPartTriggers() {
  console.log("\n🔧  Part-find triggers (dojo / river / street)");

  // Weight Disk — dojo equipment room
  const dojoDoc = await db.collection("rpg_maps").doc("tyson_dojo").get();
  if (dojoDoc.exists) {
    const existing = dojoDoc.data();
    const triggers = [...(existing.eventTriggers || []),
      {
        id: "trig_part_weight_disk",
        triggerRect: { x: 0, y: 9, width: 2, height: 4 },
        storyEventId: "ev_part_found_weight_disk",
        triggerCondition: { all: { q_find_parts_active: true }, none: { part_weight_disk_found: true, has_dragoon: true } },
        triggerOnce: true, triggerMode: "interact",
      },
    ];
    if (!DRY) {
      await db.collection("rpg_maps").doc("tyson_dojo").update({ eventTriggers: triggers });
      console.log("  ✔  dojo weight-disk trigger added");
    }
  }

  // Spin Tip — river side
  const riverDoc = await db.collection("rpg_maps").doc("river_side").get();
  if (riverDoc.exists) {
    const existing = riverDoc.data();
    const triggers = [...(existing.eventTriggers || []),
      {
        id: "trig_part_spin_tip",
        triggerRect: { x: 6, y: 15, width: 8, height: 4 },
        storyEventId: "ev_part_found_spin_tip",
        triggerCondition: { all: { q_find_parts_active: true }, none: { part_spin_tip_found: true } },
        triggerOnce: true, triggerMode: "interact",
      },
    ];
    if (!DRY) {
      await db.collection("rpg_maps").doc("river_side").update({ eventTriggers: triggers });
      console.log("  ✔  river spin-tip trigger added");
    }
  }

  // Blade Base — street (near hideout entrance)
  const streetDoc = await db.collection("rpg_maps").doc("beigoma_street").get();
  if (streetDoc.exists) {
    const existing = streetDoc.data();
    const triggers = [...(existing.eventTriggers || []),
      {
        id: "trig_part_blade_base",
        triggerRect: { x: 2, y: 8, width: 3, height: 4 },
        storyEventId: "ev_part_found_blade_base",
        triggerCondition: { all: { q_find_parts_active: true }, none: { part_blade_base_found: true } },
        triggerOnce: true, triggerMode: "interact",
      },
    ];
    if (!DRY) {
      await db.collection("rpg_maps").doc("beigoma_street").update({ eventTriggers: triggers });
      console.log("  ✔  street blade-base trigger added");
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY ? "\n🔎  DRY RUN — nothing written\n" : "\n🚀  Seeding Arc 1, Episode 1…\n");
  await seedArc();
  await seedRegion();
  await seedMaps();
  await seedNPCs();
  await seedDialogues();
  await seedStoryEvents();
  await seedQuests();
  await seedItems();
  await seedBadges();
  await seedPartTriggers();
  console.log("\n✅  Arc 1 Episode 1 seed complete.\n");
}

main().catch((e) => { console.error(e); process.exit(1); });

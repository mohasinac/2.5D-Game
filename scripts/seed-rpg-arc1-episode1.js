// scripts/seed-rpg-arc1-episode1.js
// ═══════════════════════════════════════════════════════════════════════════════
// Arc 1 — Episode 1: "Let It Rip!"
// Full story seed — Tyson's room → Kai showdown → Meet Max → Seaside Dome
//
//  Phases:
//   1  (start  → Lv5)  : Wakeup · Grandpa escape · Park (Billy) · Rooftop (Carlos) · Backyard practice
//   2  (Lv5  → Lv10)  : River Carlos battle · Kai entrance · Lose checkpoint ·
//                        Dragoon-S parts quest · Assembly
//   3  (Lv10 → Lv12)  : Blade Sharks hideout · Family sword + bit-beast · Final Kai battle
//   4  (Lv12 → Lv15)  : River puppy mini-game · Meet Max · Shop unlock · Max battle (defence tutorial)
//   5  (Lv15 → end )  : Dickinson meets Tyson · Tournament registration at Seaside Dome
//
//  Run:  node scripts/seed-rpg-arc1-episode1.js
//        node scripts/seed-rpg-arc1-episode1.js --dry-run
//
//  Idempotent — uses set() with { merge: true }.
// ═══════════════════════════════════════════════════════════════════════════════
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
const db  = admin.firestore();
const DRY = process.argv.includes("--dry-run");

// ── helpers ───────────────────────────────────────────────────────────────────
const now = new Date().toISOString();

async function put(col, id, data) {
  if (DRY) { console.log(`  [dry] ${col}/${id}`); return; }
  await db.collection(col).doc(id).set({ ...data, updatedAt: now }, { merge: true });
  console.log(`  ✔  ${col}/${id}`);
}

/** Flat placeholder tile-layer (all one tile type). */
function flat(w, h, tile = 0) { return Array(w * h).fill(tile); }

/** Five standard tile layers for any map. */
function layers(w, h) {
  return [
    { name: "ground",     width: w, height: h, data: flat(w, h, 0), visible: true  },
    { name: "collision",  width: w, height: h, data: flat(w, h, 0), visible: false },
    { name: "decoration", width: w, height: h, data: flat(w, h, 0), visible: true  },
    { name: "above",      width: w, height: h, data: flat(w, h, 0), visible: true  },
    { name: "events",     width: w, height: h, data: flat(w, h, 0), visible: false },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — ARC & ROUTE
// ═══════════════════════════════════════════════════════════════════════════════
async function seedArc() {
  console.log("\n📖  Arc & Route");

  await put("rpg_arcs", "arc1_ep1", {
    id:               "arc1_ep1",
    displayName:      "Season 1 — Episode 1: Let It Rip!",
    order:            1,
    routeIds:         ["tyson_route"],
    startingRegionId: "beigoma_city",
    completionFlagId: "arc1_ep1_complete",
    description:
      "Tyson Granger's journey begins in the back streets of Beigoma City. " +
      "He'll battle bullies, befriend rivals, assemble a legendary Beyblade, " +
      "and earn his first tournament invitation — all before the ink is dry on Episode 2.",
    levelCap:     20,
    teamBattles:  false,
    protagonists: [{ npcId: "tyson", beybladeId: "dragoon", playerControlled: true }],
    previousArcId: null,
    nextArcId:     "arc1_ep2",
  });

  await put("rpg_routes", "tyson_route", {
    id:                  "tyson_route",
    displayName:         "Tyson's Story",
    protagonistNpcId:    "tyson",
    description:         "Follow Tyson Granger — the kid who never, ever backs down.",
    startingMapId:       "tyson_room",
    startingTile:        { x: 7, y: 2 },
    startingFacing:      "down",
    startingBeybladeId:  "dragoon",
    cardImageAssetId:    "img_tyson_card",
    availableInArcs:     ["arc1_ep1"],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — REGION
// ═══════════════════════════════════════════════════════════════════════════════
async function seedRegion() {
  console.log("\n🌍  Region");

  await put("rpg_regions", "beigoma_city", {
    id:          "beigoma_city",
    displayName: "Beigoma City",
    country:     "Japan",
    description:
      "Tyson's hometown — a lively Japanese city packed with dojos, back alleys, " +
      "a riverside park, and secrets that only the boldest Bladers discover.",
    mapIds: [
      "tyson_room", "granger_dojo", "dojo_garden_path",
      "tyson_backyard", "beigoma_street",
      "beigoma_park", "park_deepend",
      "apartment_1f", "rooftop",
      "river_side", "blade_sharks_hideout",
      "max_shop", "seaside_dome",
    ],
    hubMapId:        "beigoma_street",
    connections:     [],
    unlockGate:      null,
    worldMapTile:    { x: 5, y: 3 },
    bgmTrackId:      "bgm_beigoma_town",
    arcIds:          ["arc1_ep1"],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — MAPS  (13 maps)
// ═══════════════════════════════════════════════════════════════════════════════
async function seedMaps() {
  console.log("\n🗺️   Maps");

  // ── 1. Tyson's Room ──────────────────────────────────────────────────────────
  await put("rpg_maps", "tyson_room", {
    id: "tyson_room", regionId: "beigoma_city",
    displayName: "Tyson's Room", type: "indoor",
    width: 15, height: 10,
    tilesetId: "tileset_indoor_house",
    layers: layers(15, 10),
    exits: [{
      id: "exit_to_dojo",
      triggerRect:    { x: 7, y: 9, width: 1, height: 1 },
      targetMapId:    "granger_dojo",
      targetEntryId:  "from_room",
      direction: "south", transitionType: "door",
    }],
    entryPoints: [
      { id: "default",   tile: { x: 7, y: 2 }, facingDirection: "down" },
      { id: "from_dojo", tile: { x: 7, y: 8 }, facingDirection: "up"  },
    ],
    eventTriggers: [
      {
        id: "trig_wakeup",
        triggerRect:      { x: 4, y: 1, width: 7, height: 3 },
        storyEventId:     "ev_room_wakeup",
        triggerCondition: { none: ["wakeup_done"] },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_sword_inspect_room",
        triggerRect:      { x: 1, y: 1, width: 3, height: 4 },
        storyEventId:     "ev_dragoon_sword_room",
        triggerCondition: { all: ["wakeup_done"], none: ["sword_room_viewed"] },
        triggerOnce: true, triggerMode: "interact",
      },
      {
        // After losing to Kai at river → fade back home
        id: "trig_new_bey_home",
        triggerRect:      { x: 3, y: 1, width: 9, height: 8 },
        storyEventId:     "ev_new_beyblade_home",
        triggerCondition: { all: ["kai_battled_river"], none: ["new_bey_scene_done"] },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [],
    bgmTrackId: "bgm_tyson_room", lightingPreset: "indoor",
  });

  // ── 2. Granger Dojo ─────────────────────────────────────────────────────────
  await put("rpg_maps", "granger_dojo", {
    id: "granger_dojo", regionId: "beigoma_city",
    displayName: "Granger Family Dojo", type: "indoor",
    width: 25, height: 20,
    tilesetId: "tileset_dojo",
    layers: layers(25, 20),
    exits: [
      {
        id: "exit_to_room",
        triggerRect: { x: 12, y: 0, width: 1, height: 1 },
        targetMapId: "tyson_room", targetEntryId: "from_dojo",
        direction: "north", transitionType: "door",
      },
      {
        id: "exit_to_garden",
        triggerRect: { x: 12, y: 19, width: 1, height: 1 },
        targetMapId: "dojo_garden_path", targetEntryId: "from_dojo",
        direction: "south", transitionType: "walk",
        // Grandpa patrols this exit — no hard gate, but he'll catch you
      },
      {
        id: "exit_to_backyard",
        triggerRect: { x: 0, y: 9, width: 1, height: 3 },
        targetMapId: "tyson_backyard", targetEntryId: "from_dojo",
        direction: "west", transitionType: "door",
      },
    ],
    entryPoints: [
      { id: "default",       tile: { x: 12, y: 16 }, facingDirection: "down"  },
      { id: "from_room",     tile: { x: 12, y: 1  }, facingDirection: "down"  },
      { id: "from_garden",   tile: { x: 12, y: 18 }, facingDirection: "up"    },
      { id: "from_backyard", tile: { x: 1,  y: 10 }, facingDirection: "right" },
    ],
    eventTriggers: [
      {
        id: "trig_sword_dojo_fascination",
        triggerRect:      { x: 21, y: 2, width: 3, height: 4 },
        storyEventId:     "ev_dragoon_sword_dojo",
        triggerCondition: { all: ["rooftop_visited"], none: ["sword_dojo_viewed"] },
        triggerOnce: true, triggerMode: "interact",
      },
      {
        id: "trig_family_sword_awakening",
        triggerRect:      { x: 21, y: 2, width: 3, height: 4 },
        storyEventId:     "ev_family_sword_interaction",
        triggerCondition: { all: ["dragoon_s_assembled"], none: ["dragoon_bit_beast_awakened"] },
        triggerOnce: true, triggerMode: "interact",
      },
    ],
    npcPlacements: [
      { npcId: "grandpa", spawnTile: { x: 12, y: 8 } },
    ],
    bgmTrackId: "bgm_dojo", lightingPreset: "indoor",
  });

  // ── 3. Dojo Garden Path (Grandpa's Patrol Zone) ──────────────────────────────
  await put("rpg_maps", "dojo_garden_path", {
    id: "dojo_garden_path", regionId: "beigoma_city",
    displayName: "Dojo Garden", type: "outdoor",
    width: 15, height: 10,
    tilesetId: "tileset_outdoor_city",
    layers: layers(15, 10),
    exits: [
      {
        id: "exit_to_dojo",
        triggerRect: { x: 7, y: 0, width: 1, height: 1 },
        targetMapId: "granger_dojo", targetEntryId: "from_garden",
        direction: "north", transitionType: "walk",
      },
      {
        id: "exit_to_street",
        triggerRect: { x: 7, y: 9, width: 1, height: 1 },
        targetMapId: "beigoma_street", targetEntryId: "from_dojo",
        direction: "south", transitionType: "walk",
      },
    ],
    entryPoints: [
      { id: "from_dojo",   tile: { x: 7, y: 1 }, facingDirection: "down" },
      { id: "from_street", tile: { x: 7, y: 8 }, facingDirection: "up"  },
    ],
    eventTriggers: [
      {
        id: "trig_escaped_grandpa",
        triggerRect:      { x: 5, y: 8, width: 5, height: 2 },
        storyEventId:     "ev_grandpa_escaped",
        triggerCondition: { all: ["wakeup_done"], none: ["dojo_escaped"] },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    // Grandpa patrols here — catchRadius 2 fires ev_grandpa_caught
    npcPlacements: [
      { npcId: "grandpa", spawnTile: { x: 7, y: 4 } },
    ],
    bgmTrackId: "bgm_dojo", lightingPreset: "day",
    notes: "Grandpa patrols left-right across the path. Player must dodge him to reach the street.",
  });

  // ── 4. Tyson's Backyard ──────────────────────────────────────────────────────
  await put("rpg_maps", "tyson_backyard", {
    id: "tyson_backyard", regionId: "beigoma_city",
    displayName: "Tyson's Backyard", type: "outdoor",
    width: 20, height: 15,
    tilesetId: "tileset_outdoor_city",
    layers: layers(20, 15),
    exits: [{
      id: "exit_to_dojo",
      triggerRect:   { x: 19, y: 6, width: 1, height: 3 },
      targetMapId:   "granger_dojo", targetEntryId: "from_backyard",
      direction: "east", transitionType: "door",
    }],
    entryPoints: [
      { id: "default",   tile: { x: 10, y: 7 }, facingDirection: "down" },
      { id: "from_dojo", tile: { x: 18, y: 7 }, facingDirection: "left" },
    ],
    eventTriggers: [
      {
        // Practice zone — AI battle against beginner dummy while level < 5
        id: "trig_ai_practice_basic",
        triggerRect:      { x: 6, y: 4, width: 8, height: 7 },
        storyEventId:     "ev_backyard_practice",
        triggerCondition: { all: ["has_dragoon"], none: ["dragoon_s_assembled"] },
        triggerOnce: false, triggerMode: "interact",
      },
      {
        // Practice zone with Dragoon S — different flavour text
        id: "trig_ai_practice_dragoons",
        triggerRect:      { x: 6, y: 4, width: 8, height: 7 },
        storyEventId:     "ev_backyard_practice_dragoons",
        triggerCondition: { all: ["dragoon_s_assembled"] },
        triggerOnce: false, triggerMode: "interact",
      },
      {
        // Mini-game — hit the tin cans stacked in corner
        id: "trig_can_hit_minigame",
        triggerRect:      { x: 1, y: 1, width: 4, height: 4 },
        storyEventId:     "ev_can_hit_practice",
        triggerCondition: { all: ["dojo_escaped"] },
        triggerOnce: false, triggerMode: "interact",
      },
    ],
    npcPlacements: [],
    bgmTrackId: "bgm_beigoma_town", lightingPreset: "day",
  });

  // ── 5. Beigoma Street (Hub) ──────────────────────────────────────────────────
  await put("rpg_maps", "beigoma_street", {
    id: "beigoma_street", regionId: "beigoma_city",
    displayName: "Beigoma City Streets", type: "outdoor",
    width: 40, height: 20,
    tilesetId: "tileset_outdoor_city",
    layers: layers(40, 20),
    exits: [
      {
        id: "exit_to_garden",
        triggerRect: { x: 7, y: 0, width: 3, height: 1 },
        targetMapId: "dojo_garden_path", targetEntryId: "from_street",
        direction: "north", transitionType: "walk",
      },
      {
        id: "exit_to_park",
        triggerRect: { x: 39, y: 8, width: 1, height: 4 },
        targetMapId: "beigoma_park", targetEntryId: "from_street",
        direction: "east", transitionType: "walk",
      },
      {
        id: "exit_to_apartment",
        triggerRect: { x: 20, y: 0, width: 3, height: 1 },
        targetMapId: "apartment_1f", targetEntryId: "default",
        direction: "north", transitionType: "door",
        // Rooftop path — gated until Billy is defeated
        gateCondition:  { all: ["billy_defeated"] },
        gateDialogueId: "dlg_street_rooftop_locked",
      },
      {
        id: "exit_to_river",
        triggerRect: { x: 39, y: 0, width: 1, height: 4 },
        targetMapId: "river_side", targetEntryId: "from_street",
        direction: "east", transitionType: "walk",
        // River is locked until level 5
        gateCondition:  { all: ["level_5_reached"] },
        gateDialogueId: "dlg_river_not_ready",
      },
      {
        id: "exit_to_hideout",
        triggerRect: { x: 0, y: 8, width: 1, height: 4 },
        targetMapId: "blade_sharks_hideout", targetEntryId: "default",
        direction: "west", transitionType: "walk",
        // Hideout only unlocks when Kenny is kidnapped
        gateCondition:  { all: ["kenny_kidnapped_known"] },
        gateDialogueId: "dlg_hideout_locked",
      },
    ],
    entryPoints: [
      { id: "default",    tile: { x: 9,  y: 2  }, facingDirection: "down" },
      { id: "from_dojo",  tile: { x: 9,  y: 2  }, facingDirection: "down" },
      { id: "from_park",  tile: { x: 37, y: 9  }, facingDirection: "left" },
      { id: "from_river", tile: { x: 37, y: 2  }, facingDirection: "left" },
    ],
    eventTriggers: [],
    npcPlacements: [],
    bgmTrackId: "bgm_beigoma_town", lightingPreset: "day",
  });

  // ── 6. Beigoma Park (front) ──────────────────────────────────────────────────
  await put("rpg_maps", "beigoma_park", {
    id: "beigoma_park", regionId: "beigoma_city",
    displayName: "Beigoma Park", type: "outdoor",
    width: 25, height: 20,
    tilesetId: "tileset_outdoor_park",
    layers: layers(25, 20),
    exits: [
      {
        id: "exit_to_street",
        triggerRect: { x: 0, y: 8, width: 1, height: 4 },
        targetMapId: "beigoma_street", targetEntryId: "from_park",
        direction: "west", transitionType: "walk",
      },
      {
        id: "exit_to_park_deep",
        triggerRect: { x: 24, y: 8, width: 1, height: 4 },
        targetMapId: "park_deepend", targetEntryId: "from_park",
        direction: "east", transitionType: "walk",
        gateCondition:  { all: ["billy_defeated"] },
        gateDialogueId: "dlg_park_deeper_locked",
      },
    ],
    entryPoints: [
      { id: "from_street", tile: { x: 2,  y: 10 }, facingDirection: "right" },
      { id: "from_deep",   tile: { x: 22, y: 10 }, facingDirection: "left"  },
    ],
    eventTriggers: [
      {
        id: "trig_billy_challenge",
        triggerRect:      { x: 10, y: 6, width: 6, height: 6 },
        storyEventId:     "ev_billy_challenge",
        triggerCondition: { all: ["dojo_escaped"], none: ["billy_defeated"] },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [
      { npcId: "billy",   spawnTile: { x: 12, y: 9 } },
      { npcId: "andrew",  spawnTile: { x: 18, y: 5 } },
    ],
    bgmTrackId: "bgm_beigoma_town", lightingPreset: "day",
  });

  // ── 7. Park Deep End ────────────────────────────────────────────────────────
  await put("rpg_maps", "park_deepend", {
    id: "park_deepend", regionId: "beigoma_city",
    displayName: "Beigoma Park — Back Courts", type: "outdoor",
    width: 20, height: 15,
    tilesetId: "tileset_outdoor_park",
    layers: layers(20, 15),
    exits: [{
      id: "exit_to_park",
      triggerRect: { x: 0, y: 6, width: 1, height: 3 },
      targetMapId: "beigoma_park", targetEntryId: "from_deep",
      direction: "west", transitionType: "walk",
    }],
    entryPoints: [
      { id: "from_park", tile: { x: 2, y: 7 }, facingDirection: "right" },
    ],
    eventTriggers: [],
    npcPlacements: [
      { npcId: "kenny",          spawnTile: { x: 10, y: 4 } },
      { npcId: "random_blader_1", spawnTile: { x: 5,  y: 11 } },
      { npcId: "random_blader_2", spawnTile: { x: 16, y: 8  } },
    ],
    bgmTrackId: "bgm_beigoma_town", lightingPreset: "day",
    notes: "Quiet back courts — Kenny hangs here. Random bladers appear after Dragoon-S is assembled.",
  });

  // ── 8. Apartment Lobby 1F ────────────────────────────────────────────────────
  await put("rpg_maps", "apartment_1f", {
    id: "apartment_1f", regionId: "beigoma_city",
    displayName: "Apartment Building 1F", type: "indoor",
    width: 12, height: 8,
    tilesetId: "tileset_indoor_building",
    layers: layers(12, 8),
    exits: [
      {
        id: "exit_to_street",
        triggerRect: { x: 5, y: 7, width: 2, height: 1 },
        targetMapId: "beigoma_street", targetEntryId: "from_park",
        direction: "south", transitionType: "door",
      },
      {
        id: "exit_to_rooftop",
        triggerRect: { x: 5, y: 0, width: 2, height: 1 },
        targetMapId: "rooftop", targetEntryId: "default",
        direction: "north", transitionType: "walk",
      },
    ],
    entryPoints: [
      { id: "default",     tile: { x: 6, y: 6 }, facingDirection: "up"   },
      { id: "from_street", tile: { x: 6, y: 6 }, facingDirection: "up"   },
      { id: "from_roof",   tile: { x: 6, y: 1 }, facingDirection: "down" },
    ],
    eventTriggers: [],
    npcPlacements: [],
    bgmTrackId: "bgm_beigoma_town", lightingPreset: "indoor",
  });

  // ── 9. Rooftop ───────────────────────────────────────────────────────────────
  await put("rpg_maps", "rooftop", {
    id: "rooftop", regionId: "beigoma_city",
    displayName: "Apartment Rooftop", type: "outdoor",
    width: 18, height: 12,
    tilesetId: "tileset_rooftop",
    layers: layers(18, 12),
    exits: [{
      id: "exit_to_building",
      triggerRect: { x: 8, y: 11, width: 2, height: 1 },
      targetMapId: "apartment_1f", targetEntryId: "from_roof",
      direction: "south", transitionType: "walk",
    }],
    entryPoints: [
      { id: "default", tile: { x: 9, y: 10 }, facingDirection: "up" },
    ],
    eventTriggers: [
      {
        id: "trig_rooftop_carlos_scene",
        triggerRect:      { x: 4, y: 2, width: 10, height: 6 },
        storyEventId:     "ev_rooftop_aftermath",
        triggerCondition: { none: ["rooftop_visited"] },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [
      { npcId: "carlos", spawnTile: { x: 9, y: 4 } },
      { npcId: "kenny",  spawnTile: { x: 5, y: 5 } },
      { npcId: "andrew", spawnTile: { x: 13, y: 5 } },
    ],
    bgmTrackId: "bgm_beigoma_town", lightingPreset: "dusk",
    notes: "Dusk lighting — the tournament wreckage scene happens here.",
  });

  // ── 10. River Side ───────────────────────────────────────────────────────────
  await put("rpg_maps", "river_side", {
    id: "river_side", regionId: "beigoma_city",
    displayName: "Beigoma Riverside", type: "outdoor",
    width: 30, height: 15,
    tilesetId: "tileset_outdoor_river",
    layers: layers(30, 15),
    exits: [{
      id: "exit_to_street",
      triggerRect: { x: 0, y: 6, width: 1, height: 3 },
      targetMapId: "beigoma_street", targetEntryId: "from_river",
      direction: "west", transitionType: "walk",
    }],
    entryPoints: [
      { id: "default",     tile: { x: 3,  y: 7  }, facingDirection: "right" },
      { id: "from_street", tile: { x: 3,  y: 7  }, facingDirection: "right" },
    ],
    eventTriggers: [
      {
        id: "trig_carlos_challenge",
        triggerRect:      { x: 12, y: 4, width: 8, height: 6 },
        storyEventId:     "ev_river_carlos_challenge",
        triggerCondition: { all: ["level_5_reached"], none: ["carlos_defeated"] },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_kai_entrance",
        triggerRect:      { x: 12, y: 4, width: 8, height: 6 },
        storyEventId:     "ev_kai_river_entrance",
        triggerCondition: { all: ["carlos_defeated"], none: ["kai_battled_river"] },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_puppy_rescue",
        triggerRect:      { x: 20, y: 1, width: 8, height: 5 },
        storyEventId:     "ev_puppy_rescue_minigame",
        triggerCondition: { all: ["level_12_reached"], none: ["puppy_saved"] },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_meet_max",
        triggerRect:      { x: 20, y: 1, width: 8, height: 5 },
        storyEventId:     "ev_meet_max",
        triggerCondition: { all: ["puppy_saved"], none: ["max_met"] },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [
      { npcId: "carlos", spawnTile: { x: 16, y: 7 } },
      { npcId: "kenny",  spawnTile: { x: 8,  y: 7 } },
      { npcId: "andrew", spawnTile: { x: 10, y: 8 } },
    ],
    bgmTrackId: "bgm_river", lightingPreset: "day",
  });

  // ── 11. Blade Sharks Hideout ─────────────────────────────────────────────────
  await put("rpg_maps", "blade_sharks_hideout", {
    id: "blade_sharks_hideout", regionId: "beigoma_city",
    displayName: "Blade Sharks Hideout", type: "indoor",
    width: 25, height: 18,
    tilesetId: "tileset_indoor_warehouse",
    layers: layers(25, 18),
    exits: [{
      id: "exit_to_street",
      triggerRect: { x: 24, y: 8, width: 1, height: 2 },
      targetMapId: "beigoma_street", targetEntryId: "default",
      direction: "east", transitionType: "walk",
    }],
    entryPoints: [
      { id: "default", tile: { x: 22, y: 9 }, facingDirection: "left" },
    ],
    eventTriggers: [
      {
        id: "trig_hideout_entry_scene",
        triggerRect:      { x: 10, y: 3, width: 10, height: 10 },
        storyEventId:     "ev_hideout_entry",
        triggerCondition: { all: ["kenny_kidnapped_known"], none: ["hideout_entered"] },
        triggerOnce: true, triggerMode: "enter",
      },
      {
        id: "trig_kai_final_battle",
        triggerRect:      { x: 2, y: 3, width: 8, height: 10 },
        storyEventId:     "ev_final_kai_battle",
        triggerCondition: { all: ["hideout_entered", "dragoon_bit_beast_awakened"], none: ["kai_defeated_hideout"] },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [
      { npcId: "kai",   spawnTile: { x: 5,  y: 9  } },
      { npcId: "rick",  spawnTile: { x: 13, y: 6  } },
      { npcId: "sam",   spawnTile: { x: 13, y: 12 } },
      { npcId: "kenny", spawnTile: { x: 8,  y: 14 } },
      { npcId: "carlos", spawnTile: { x: 16, y: 9 } },
    ],
    bgmTrackId: "bgm_blade_sharks", lightingPreset: "dark",
  });

  // ── 12. Max's Dad's Shop ─────────────────────────────────────────────────────
  await put("rpg_maps", "max_shop", {
    id: "max_shop", regionId: "beigoma_city",
    displayName: "Tate's Bey Supply Shop", type: "indoor",
    width: 14, height: 10,
    tilesetId: "tileset_indoor_shop",
    layers: layers(14, 10),
    exits: [{
      id: "exit_to_river",
      triggerRect: { x: 6, y: 9, width: 2, height: 1 },
      targetMapId: "river_side", targetEntryId: "default",
      direction: "south", transitionType: "door",
      gateCondition:  { all: ["shop_unlocked"] },
    }],
    entryPoints: [
      { id: "default",     tile: { x: 7, y: 8 }, facingDirection: "up" },
      { id: "from_river",  tile: { x: 7, y: 8 }, facingDirection: "up" },
    ],
    eventTriggers: [
      {
        id: "trig_first_shop_visit",
        triggerRect:      { x: 2, y: 2, width: 10, height: 6 },
        storyEventId:     "ev_shop_first_visit",
        triggerCondition: { all: ["shop_unlocked"], none: ["shop_visited"] },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [
      { npcId: "mr_tate", spawnTile: { x: 7, y: 2 } },
      { npcId: "max",     spawnTile: { x: 4, y: 5 } },
    ],
    shopInventoryId: "shop_tate_supplies",
    bgmTrackId: "bgm_shop", lightingPreset: "indoor",
  });

  // ── 13. Seaside Dome ─────────────────────────────────────────────────────────
  await put("rpg_maps", "seaside_dome", {
    id: "seaside_dome", regionId: "beigoma_city",
    displayName: "Seaside Dome — Registration Lobby", type: "indoor",
    width: 20, height: 14,
    tilesetId: "tileset_indoor_arena",
    layers: layers(20, 14),
    exits: [],
    entryPoints: [
      { id: "default", tile: { x: 10, y: 12 }, facingDirection: "up" },
    ],
    eventTriggers: [
      {
        id: "trig_dickinson_meeting",
        triggerRect:      { x: 6, y: 3, width: 8, height: 6 },
        storyEventId:     "ev_dickinson_meeting",
        triggerCondition: { all: ["level_15_reached"], none: ["tournament_registered"] },
        triggerOnce: true, triggerMode: "enter",
      },
    ],
    npcPlacements: [
      { npcId: "dickinson", spawnTile: { x: 10, y: 6 } },
    ],
    bgmTrackId: "bgm_tournament_lobby", lightingPreset: "indoor",
    unlockGate: { all: ["max_met"] },
    notes: "Unlocks on world map after meeting Max. Registration triggers arc2 transition.",
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — NPCs  (15 characters)
// ═══════════════════════════════════════════════════════════════════════════════
async function seedNPCs() {
  console.log("\n🧍  NPCs");

  // ── Grandpa Granger ──────────────────────────────────────────────────────────
  await put("rpg_npcs", "grandpa", {
    id: "grandpa", displayName: "Grandpa Granger", type: "elder",
    spriteSheetId: "sprite_grandpa", portraitId: "portrait_grandpa",
    defaultFacing: "down", defaultDialogueId: "dlg_grandpa_idle",
    catchRadius: 2, catchEventId: "ev_grandpa_caught",
    schedule: [
      { timeSlot: "morning", mapId: "granger_dojo",   tile: { x: 12, y: 8 }, facing: "down",  idleAnimation: "sword_practice" },
      { timeSlot: "midday",  mapId: "dojo_garden_path", tile: { x: 7, y: 4 }, facing: "right", patrol: [{ x:3,y:4 },{ x:11,y:4 }] },
      { timeSlot: "evening", mapId: "granger_dojo",   tile: { x: 12, y: 8 }, facing: "down",  idleAnimation: "meditation" },
    ],
    arcIds: ["arc1_ep1"],
  });

  // ── Billy ─────────────────────────────────────────────────────────────────────
  await put("rpg_npcs", "billy", {
    id: "billy", displayName: "Billy", type: "rival",
    spriteSheetId: "sprite_billy", portraitId: "portrait_billy",
    defaultFacing: "down", defaultDialogueId: "dlg_billy_idle",
    battleConfig: {
      beybladeId: "bound-attacker", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId:   "dlg_billy_battle_intro",
      victoryDialogueId: "dlg_billy_defeated",
      defeatDialogueId:  "dlg_billy_wins",
      canRematch: true, rematchCooldownBattles: 2,
      xpReward:    { playerXP: 60,  beybladeXP: 30 },
      lossXpReward:{ playerXP: 15 },
      awardsBadgeId: "badge_first_victory",
    },
    questIds: [], arcIds: ["arc1_ep1"],
  });

  // ── Kenny ("The Chief") ───────────────────────────────────────────────────────
  await put("rpg_npcs", "kenny", {
    id: "kenny", displayName: "Kenny", type: "ally",
    spriteSheetId: "sprite_kenny", portraitId: "portrait_kenny",
    defaultFacing: "down", defaultDialogueId: "dlg_kenny_idle",
    battleConfig: {
      beybladeId: "jumping-base-set", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId:   "dlg_kenny_battle_intro",
      victoryDialogueId: "dlg_kenny_defeated",
      defeatDialogueId:  "dlg_kenny_wins",
      lockedDialogueId:  "dlg_kenny_no_bey",
      canRematch: true, rematchCooldownBattles: 1,
      xpReward:    { playerXP: 40,  beybladeXP: 20 },
      lossXpReward:{ playerXP: 10 },
    },
    questIds: ["q_reach_level_5", "q_find_4_parts"], arcIds: ["arc1_ep1"],
  });

  // ── Andrew ────────────────────────────────────────────────────────────────────
  await put("rpg_npcs", "andrew", {
    id: "andrew", displayName: "Andrew", type: "trainer",
    spriteSheetId: "sprite_andrew", portraitId: "portrait_andrew",
    defaultFacing: "down", defaultDialogueId: "dlg_andrew_idle",
    battleConfig: {
      beybladeId: "sparkling-attacker", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId:   "dlg_andrew_battle_intro",
      victoryDialogueId: "dlg_andrew_defeated",
      defeatDialogueId:  "dlg_andrew_wins",
      canRematch: true, rematchCooldownBattles: 1,
      xpReward:    { playerXP: 50,  beybladeXP: 25 },
      lossXpReward:{ playerXP: 12 },
    },
    arcIds: ["arc1_ep1"],
  });

  // ── Carlos ────────────────────────────────────────────────────────────────────
  await put("rpg_npcs", "carlos", {
    id: "carlos", displayName: "Carlos", type: "rival",
    spriteSheetId: "sprite_carlos", portraitId: "portrait_carlos",
    defaultFacing: "down", defaultDialogueId: "dlg_carlos_idle",
    battleConfig: {
      beybladeId: "kids-draciel", arenaId: "classic_circle", difficulty: "medium",
      introDialogueId:   "dlg_carlos_battle_intro",
      victoryDialogueId: "dlg_carlos_defeated",
      defeatDialogueId:  "dlg_carlos_wins",
      lockedDialogueId:  "dlg_carlos_gate",
      canRematch: false,
      xpReward:    { playerXP: 120, beybladeXP: 60 },
      lossXpReward:{ playerXP: 30 },
      awardsBadgeId: "badge_carlos_beaten",
      gateLevel: 5,
    },
    arcIds: ["arc1_ep1"],
  });

  // ── Kai ───────────────────────────────────────────────────────────────────────
  await put("rpg_npcs", "kai", {
    id: "kai", displayName: "Kai Hiwatari", type: "boss",
    spriteSheetId: "sprite_kai", portraitId: "portrait_kai",
    defaultFacing: "down", defaultDialogueId: "dlg_kai_idle",
    battleConfig: {
      beybladeId: "dranzer_s", arenaId: "classic_circle", difficulty: "hard",
      introDialogueId:   "dlg_kai_final_intro",
      victoryDialogueId: "dlg_kai_hideout_defeated",
      defeatDialogueId:  "dlg_kai_wins_hideout",
      canRematch: true, rematchCooldownBattles: 0,
      xpReward:    { playerXP: 300, beybladeXP: 150 },
      lossXpReward:{ playerXP: 60 },
      awardsBadgeId: "badge_kai_beaten",
      gateFlag: "dragoon_bit_beast_awakened",
    },
    arcIds: ["arc1_ep1"],
  });

  // ── Rick ──────────────────────────────────────────────────────────────────────
  await put("rpg_npcs", "rick", {
    id: "rick", displayName: "Rick", type: "trainer",
    spriteSheetId: "sprite_blade_shark", portraitId: "portrait_rick",
    defaultFacing: "left", defaultDialogueId: "dlg_rick_idle",
    battleConfig: {
      beybladeId: "trygle", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId:   "dlg_rick_battle_intro",
      victoryDialogueId: "dlg_rick_defeated",
      defeatDialogueId:  "dlg_rick_wins",
      canRematch: false,
      xpReward:    { playerXP: 80, beybladeXP: 40 },
      lossXpReward:{ playerXP: 20 },
    },
    arcIds: ["arc1_ep1"],
  });

  // ── Sam ───────────────────────────────────────────────────────────────────────
  await put("rpg_npcs", "sam", {
    id: "sam", displayName: "Sam", type: "trainer",
    spriteSheetId: "sprite_blade_shark", portraitId: "portrait_sam",
    defaultFacing: "right", defaultDialogueId: "dlg_sam_idle",
    battleConfig: {
      beybladeId: "sparkling-attacker", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId:   "dlg_sam_battle_intro",
      victoryDialogueId: "dlg_sam_defeated",
      defeatDialogueId:  "dlg_sam_wins",
      canRematch: false,
      xpReward:    { playerXP: 80, beybladeXP: 40 },
      lossXpReward:{ playerXP: 20 },
    },
    arcIds: ["arc1_ep1"],
  });

  // ── Random Blader 1 (appears after Dragoon-S) ────────────────────────────────
  await put("rpg_npcs", "random_blader_1", {
    id: "random_blader_1", displayName: "Takeo", type: "blader",
    spriteSheetId: "sprite_generic_blader_a", portraitId: "portrait_generic_a",
    defaultFacing: "down", defaultDialogueId: "dlg_random_blader_1_idle",
    battleConfig: {
      beybladeId: "bound-attacker", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId:   "dlg_random_blader_1_battle_intro",
      victoryDialogueId: "dlg_random_blader_1_defeated",
      defeatDialogueId:  "dlg_random_blader_1_wins",
      canRematch: true, rematchCooldownBattles: 1,
      xpReward:    { playerXP: 35, beybladeXP: 18 },
      lossXpReward:{ playerXP: 8 },
      gateFlag: "dragoon_s_assembled",
    },
    arcIds: ["arc1_ep1"],
  });

  // ── Random Blader 2 ──────────────────────────────────────────────────────────
  await put("rpg_npcs", "random_blader_2", {
    id: "random_blader_2", displayName: "Miku", type: "blader",
    spriteSheetId: "sprite_generic_blader_b", portraitId: "portrait_generic_b",
    defaultFacing: "down", defaultDialogueId: "dlg_random_blader_2_idle",
    battleConfig: {
      beybladeId: "jumping-base-set", arenaId: "classic_circle", difficulty: "easy",
      introDialogueId:   "dlg_random_blader_2_battle_intro",
      victoryDialogueId: "dlg_random_blader_2_defeated",
      defeatDialogueId:  "dlg_random_blader_2_wins",
      canRematch: true, rematchCooldownBattles: 1,
      xpReward:    { playerXP: 35, beybladeXP: 18 },
      lossXpReward:{ playerXP: 8 },
      gateFlag: "dragoon_s_assembled",
    },
    arcIds: ["arc1_ep1"],
  });

  // ── Max Tate ──────────────────────────────────────────────────────────────────
  await put("rpg_npcs", "max", {
    id: "max", displayName: "Max Tate", type: "rival",
    spriteSheetId: "sprite_max", portraitId: "portrait_max",
    defaultFacing: "down", defaultDialogueId: "dlg_max_idle",
    battleConfig: {
      beybladeId: "kids-draciel", arenaId: "classic_circle", difficulty: "medium",
      introDialogueId:   "dlg_max_battle_intro",
      victoryDialogueId: "dlg_max_defeated",
      defeatDialogueId:  "dlg_max_wins",
      canRematch: true, rematchCooldownBattles: 2,
      xpReward:    { playerXP: 150, beybladeXP: 75 },
      lossXpReward:{ playerXP: 35 },
      awardsBadgeId: "badge_max_beaten",
      gateFlag: "max_met",
    },
    questIds: [], arcIds: ["arc1_ep1"],
  });

  // ── Mr. Tate (Max's dad, shopkeeper) ─────────────────────────────────────────
  await put("rpg_npcs", "mr_tate", {
    id: "mr_tate", displayName: "Mr. Tate", type: "shopkeeper",
    spriteSheetId: "sprite_mr_tate", portraitId: "portrait_mr_tate",
    defaultFacing: "down", defaultDialogueId: "dlg_mr_tate_idle",
    shopInventoryId: "shop_tate_supplies",
    schedule: [
      { timeSlot: "morning", mapId: "max_shop", tile: { x: 7, y: 2 }, facing: "down" },
      { timeSlot: "evening", mapId: "max_shop", tile: { x: 7, y: 2 }, facing: "down" },
    ],
    arcIds: ["arc1_ep1"],
  });

  // ── Dickinson ─────────────────────────────────────────────────────────────────
  await put("rpg_npcs", "dickinson", {
    id: "dickinson", displayName: "Mr. Dickinson", type: "quest_giver",
    spriteSheetId: "sprite_dickinson", portraitId: "portrait_dickinson",
    defaultFacing: "down", defaultDialogueId: "dlg_dickinson_idle",
    schedule: [
      { timeSlot: "midday", mapId: "seaside_dome", tile: { x: 10, y: 6 }, facing: "down" },
    ],
    arcIds: ["arc1_ep1"],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — DIALOGUES
// All dialogue is original writing — character voices, story beats, original prose.
// ═══════════════════════════════════════════════════════════════════════════════
async function seedDialogues() {
  console.log("\n💬  Dialogues");
  const D = [];

  // ─── Phase 1: Wakeup & Escape ────────────────────────────────────────────────

  D.push({ id: "dlg_grandpa_wakeup", nodes: [
    { id: "n1", speaker: "grandpa", text: "Tyson! The sun has been up for three hours. Your Beyblade has been spinning longer than you have today!", next: "n2" },
    { id: "n2", speaker: "tyson",   text: "Five more minutes, Grandpa... I was just dreaming about the perfect launch.", next: "n3" },
    { id: "n3", speaker: "grandpa", text: "Dreams don't build muscle. Come. The morning practice waits for no one — and neither does your grandfather.", next: null },
  ]});

  D.push({ id: "dlg_grandpa_idle", nodes: [
    { id: "n1", speaker: "grandpa", text: "A blade that spins true comes from a hand that trains hard. Now — are you training, or are you talking?", next: null },
  ]});

  D.push({ id: "dlg_grandpa_patrol", nodes: [
    { id: "n1", speaker: "grandpa", text: "HA! Thought you could sneak past your grandfather? Begin your forms. One hundred repetitions.", next: "n2" },
    { id: "n2", speaker: "tyson",   text: "Aw come ON, Grandpa! The guys are waiting for me outside!", next: "n3" },
    { id: "n3", speaker: "grandpa", text: "The guys will wait. Your form will not fix itself. One hundred — starting NOW.", next: null },
  ]});

  D.push({ id: "dlg_grandpa_caught", nodes: [
    { id: "n1", speaker: "grandpa", text: "You are fast, Tyson — but not fast enough. Back inside.", next: "n2" },
    { id: "n2", speaker: "tyson",   text: "*groans* I was so close!", next: null },
  ]});

  D.push({ id: "dlg_grandpa_escaped_taunt", nodes: [
    { id: "n1", speaker: "grandpa", text: "*calling from the dojo window* Well played, boy! But I WILL get those extra practice sessions back from you — one way or another!", next: "n2" },
    { id: "n2", speaker: "tyson",   text: "...I'll take that as a win! LET'S GO!", next: null },
  ]});

  // ─── Phase 1: Sword Views ────────────────────────────────────────────────────

  D.push({ id: "dlg_sword_room_view", nodes: [
    { id: "n1", speaker: "narrator", text: "[A decorative family sword rests in the corner of Tyson's room. There's something about it... like it hums with old energy.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Grandpa's always said this sword was special. I never really believed him... but looking at it now, I kind of do.", next: null },
  ]});

  D.push({ id: "dlg_sword_dojo_view", nodes: [
    { id: "n1", speaker: "narrator", text: "[The family sword gleams from its mount on the dojo wall. After everything you saw on that rooftop, it feels different somehow — older, weightier.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Carlos took everyone's Beyblades like it was nothing. How does someone get that strong?", next: "n3" },
    { id: "n3", speaker: "tyson",    text: "...Grandpa always says this sword has a story. Maybe it's time I actually listened.", next: null },
  ]});

  // ─── Phase 1: Billy ──────────────────────────────────────────────────────────

  D.push({ id: "dlg_billy_challenge", nodes: [
    { id: "n1", speaker: "billy",  text: "Hey, new kid! You wanna play in this park, you gotta prove you belong here. My Bound Attacker has never, ever lost.", next: "n2" },
    { id: "n2", speaker: "tyson", text: "Never? That's a big promise for a Beyblade with a name like that.", next: "n3" },
    { id: "n3", speaker: "billy",  text: "I'm serious! One battle. You lose, you leave. You win... well, you WON'T, so I haven't thought that far.", next: "n4" },
    { id: "n4", speaker: "tyson", text: "Oh, I'll WIN alright. And then you're going to feel really silly. Let it RIP!", next: null },
  ]});

  D.push({ id: "dlg_billy_battle_intro", nodes: [
    { id: "n1", speaker: "billy",  text: "Three... two... one... LET IT RIP! Go, Bound Attacker!", next: null },
  ]});

  D.push({ id: "dlg_billy_defeated", nodes: [
    { id: "n1", speaker: "billy",  text: "W— what?! Impossible! My Bound Attacker never loses! It NEVER—", next: "n2" },
    { id: "n2", speaker: "tyson", text: "It just did. Good battle though — you've got real technique.", next: "n3" },
    { id: "n3", speaker: "billy",  text: "...*takes a breath*... Yeah. You're something, new kid. The rooftop's yours — people up there are in trouble, by the way.", next: null },
  ]});

  D.push({ id: "dlg_billy_wins", nodes: [
    { id: "n1", speaker: "billy",  text: "HA! I TOLD you! Nobody beats Bound Attacker in this park. You can stay — just don't challenge me again.", next: "n2" },
    { id: "n2", speaker: "tyson", text: "Are you KIDDING me? Best two out of three! I'm not done!", next: null },
  ]});

  D.push({ id: "dlg_billy_idle", nodes: [
    { id: "n1", speaker: "billy",  text: "This park is MY turf. You remember that.", next: null },
  ]});

  // ─── Phase 1: Andrew ─────────────────────────────────────────────────────────

  D.push({ id: "dlg_andrew_idle", nodes: [
    { id: "n1", speaker: "andrew", text: "Hey. You any good with that thing?", next: "n2" },
    { id: "n2", speaker: "tyson",  text: "Better than anyone in this park, easy.", next: "n3" },
    { id: "n3", speaker: "andrew", text: "Bold. I like it. Come find me when you want a real match.", next: null },
  ]});

  D.push({ id: "dlg_andrew_battle_intro", nodes: [
    { id: "n1", speaker: "andrew", text: "Let's keep it clean. Three... two... one — Let it RIP!", next: null },
  ]});

  D.push({ id: "dlg_andrew_defeated", nodes: [
    { id: "n1", speaker: "andrew", text: "Hah. You weren't kidding. My Sparkling Attacker's got nothing on your speed.", next: "n2" },
    { id: "n2", speaker: "tyson",  text: "Don't feel bad — I've been training since I could walk. Literally.", next: null },
  ]});

  D.push({ id: "dlg_andrew_wins", nodes: [
    { id: "n1", speaker: "andrew", text: "Speed means nothing without control. Train up, then come back.", next: null },
  ]});

  // ─── Phase 1: Park / Rooftop gate dialogues ──────────────────────────────────

  D.push({ id: "dlg_street_rooftop_locked", nodes: [
    { id: "n1", speaker: "narrator", text: "[A group of Blade Sharks are blocking the stairwell entrance. They watch you with crossed arms.]", next: "n2" },
    { id: "n2", speaker: "blade_shark_grunt", text: "Park's one thing, runt. Rooftop's Blade Shark territory. Prove you're worth the climb.", next: null },
  ]});

  D.push({ id: "dlg_park_deeper_locked", nodes: [
    { id: "n1", speaker: "narrator", text: "[The path winds deeper into the park. Billy and his crew used to hang back here — but now that Billy's been beaten, the way is open.]", next: null },
  ]});

  D.push({ id: "dlg_river_not_ready", nodes: [
    { id: "n1", speaker: "narrator", text: "[The riverside is quiet — too quiet. Word is the Blade Sharks hold that stretch of river too.]", next: "n2" },
    { id: "n2", speaker: "kenny",    text: "Tyson, my data says you need to be stronger before facing Carlos. Chief recommends hitting Level 5 first.", next: null },
  ]});

  // ─── Phase 1: Kenny dialogues ─────────────────────────────────────────────────

  D.push({ id: "dlg_kenny_idle", nodes: [
    { id: "n1", speaker: "kenny", text: "According to my calculations, your win rate is... improving. Slowly. Chief gives it a B-minus.", next: null },
  ]});

  D.push({ id: "dlg_kenny_battle_intro", nodes: [
    { id: "n1", speaker: "kenny", text: "Chief says my Jumping Base Set has a 71.3% spin advantage on this surface. Ready when you are!", next: null },
  ]});

  D.push({ id: "dlg_kenny_defeated", nodes: [
    { id: "n1", speaker: "kenny", text: "...Chief is recalculating. Chief did not expect this outcome.", next: "n2" },
    { id: "n2", speaker: "tyson", text: "Tell Chief I said hi.", next: null },
  ]});

  D.push({ id: "dlg_kenny_wins", nodes: [
    { id: "n1", speaker: "kenny", text: "Chief says your power curve needs work. But your trajectory analysis is solid. Keep at it!", next: null },
  ]});

  D.push({ id: "dlg_kenny_no_bey", nodes: [
    { id: "n1", speaker: "kenny", text: "You don't have a Beyblade, Tyson! Chief says we can't calculate a battle we can't even begin.", next: null },
  ]});

  // ─── Phase 1: Rooftop aftermath ───────────────────────────────────────────────

  D.push({ id: "dlg_rooftop_arrival", nodes: [
    { id: "n1", speaker: "narrator", text: "[The rooftop is a mess. Shattered Beyblade parts are scattered everywhere. A dozen kids sit on the edges, heads down. Their Beyblades are gone.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "What happened here?", next: "n3" },
    { id: "n3", speaker: "kenny",    text: "Carlos happened. He showed up, issued an open challenge. Everyone accepted. Everyone lost.", next: "n4" },
    { id: "n4", speaker: "andrew",   text: "He took our Beyblades as trophies. Every single one.", next: "n5" },
    { id: "n5", speaker: "tyson",    text: "He TOOK them?! You can't just take someone's Beyblade!", next: "n6" },
    { id: "n6", speaker: "carlos",   text: "I just did. And I'll take yours too if you want to make something of it, little man.", next: null },
  ]});

  D.push({ id: "dlg_carlos_rooftop_challenge", nodes: [
    { id: "n1", speaker: "tyson",  text: "You've got a lot of nerve showing up here. Give those Beyblades back!", next: "n2" },
    { id: "n2", speaker: "carlos", text: "Come and get them. Show me you're worth my time — and maybe I'll consider it.", next: "n3" },
    { id: "n3", speaker: "tyson",  text: "You want a battle? Fine. But when I win, every bey you stole comes back. EVERY. SINGLE. ONE.", next: "n4" },
    { id: "n4", speaker: "carlos", text: "...*laughs slowly*... Oh, I like your spirit. But you're not ready for me today. Go get stronger. Come find me at the river.", next: "n5" },
    { id: "n5", speaker: "narrator", text: "[Carlos leaves. A heavy silence settles over the rooftop.]", next: null },
  ]});

  D.push({ id: "dlg_kenny_quest_intro", nodes: [
    { id: "n1", speaker: "kenny",  text: "Tyson — Chief has been running the numbers. Carlos's Kid Draciel is a Level 5 tier opponent. Minimum.", next: "n2" },
    { id: "n2", speaker: "andrew", text: "Translation: you need to get a LOT stronger before you face him.", next: "n3" },
    { id: "n3", speaker: "tyson",  text: "Then that's exactly what I'll do. How long?", next: "n4" },
    { id: "n4", speaker: "kenny",  text: "Battle in your backyard. Battle in the park. Train every chance you get. Chief will track your progress.", next: "n5" },
    { id: "n5", speaker: "tyson",  text: "Alright! Carlos won't know what hit him. Starting NOW!", next: null },
  ]});

  // ─── Phase 2: River (Carlos battle + Kai entrance) ───────────────────────────

  D.push({ id: "dlg_river_arrival", nodes: [
    { id: "n1", speaker: "kenny",   text: "Chief's sensors are picking up Beyblade signatures all along the riverbank. Carlos is definitely here.", next: "n2" },
    { id: "n2", speaker: "carlos",  text: "I was wondering if you'd actually come. You've grown, I'll give you that.", next: "n3" },
    { id: "n3", speaker: "tyson",   text: "Enough small talk. Hand over those Beyblades — or I'll take them the same way you did. In a battle.", next: "n4" },
    { id: "n4", speaker: "carlos",  text: "Kid Draciel! Let's show this hot-shot Beyblade what real power looks like.", next: null },
  ]});

  D.push({ id: "dlg_carlos_battle_intro", nodes: [
    { id: "n1", speaker: "carlos", text: "Don't hold back. My Kid Draciel has been waiting for a real challenge.", next: null },
  ]});

  D.push({ id: "dlg_carlos_defeated", nodes: [
    { id: "n1", speaker: "carlos",   text: "No... Kid Draciel... how?! HOW is that even—", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "You're good, Carlos. Really good. But you've been bullying instead of bettering yourself. There's a difference.", next: "n3" },
    { id: "n3", speaker: "carlos",   text: "*stares at his stopped Beyblade*... Hmph. You've earned them back. All the Beyblades I took — they'll be returned by tonight.", next: "n4" },
    { id: "n4", speaker: "narrator", text: "[The mood shifts — everyone watching breaks into quiet cheers. Then, footsteps. Slow. Deliberate.]", next: null },
  ]});

  D.push({ id: "dlg_carlos_wins", nodes: [
    { id: "n1", speaker: "carlos", text: "Not strong enough. Not yet.", next: "n2" },
    { id: "n2", speaker: "kenny",  text: "Your data is improving every battle, Tyson. Chief says you're close. Don't give up.", next: null },
  ]});

  D.push({ id: "dlg_carlos_idle", nodes: [
    { id: "n1", speaker: "carlos", text: "You looking for a battle? You'd better be ready.", next: null },
  ]});

  D.push({ id: "dlg_carlos_gate", nodes: [
    { id: "n1", speaker: "carlos", text: "Come back when your Beyblade is worth my time. You're not there yet.", next: null },
  ]});

  D.push({ id: "dlg_kai_river_entrance", nodes: [
    { id: "n1", speaker: "narrator", text: "[A shadow falls across the riverbank. Kai Hiwatari steps out — arms folded, expression unreadable.]", next: "n2" },
    { id: "n2", speaker: "kai",     text: "Carlos.", next: "n3" },
    { id: "n3", speaker: "carlos",  text: "Kai... I—", next: "n4" },
    { id: "n4", speaker: "kai",     text: "Weakness. I have no use for it.", next: "n5" },
    { id: "n5", speaker: "narrator", text: "[Without a word of warning, Kai slaps Carlos's Beyblade right out of his hands. It skitters across the concrete.]", next: "n6" },
    { id: "n6", speaker: "kenny",   text: "T-Tyson—", next: "n7" },
    { id: "n7", speaker: "tyson",   text: "Hey! You can't just DO that! That's someone's Beyblade!", next: "n8" },
    { id: "n8", speaker: "kai",     text: "*turns to look at Tyson for the first time* ... You. You beat him?", next: "n9" },
    { id: "n9", speaker: "tyson",   text: "Yeah, I did. Got a problem with that?", next: "n10" },
    { id: "n10", speaker: "kai",    text: "Then show me. Now.", next: "n11" },
    { id: "n11", speaker: "tyson",  text: "You're ON!", next: null },
  ]});

  D.push({ id: "dlg_kai_river_battle_result", nodes: [
    { id: "n1", speaker: "narrator", text: "[Dragoon launches — and meets Dranzer S head-on. For a moment, both blades hold their ground. Then Dragoon falters. The spin slows. Stops.]", next: "n2" },
    { id: "n2", speaker: "kai",     text: "...", next: "n3" },
    { id: "n3", speaker: "tyson",   text: "*breathing hard* W— wait. I'm not done—", next: "n4" },
    { id: "n4", speaker: "kai",     text: "You ARE done. But you have potential. Don't waste it.", next: "n5" },
    { id: "n5", speaker: "narrator", text: "[Kai walks away. Everything goes dark. When you come to, you're back home.]", next: null },
  ]});

  // ─── Phase 2: New Beyblade + Parts Quest ─────────────────────────────────────

  D.push({ id: "dlg_new_bey_home", nodes: [
    { id: "n1", speaker: "grandpa", text: "There he is. Finally awake. Your friends came by — worried sick.", next: "n2" },
    { id: "n2", speaker: "tyson",   text: "...I lost. I actually lost.", next: "n3" },
    { id: "n3", speaker: "grandpa", text: "Yes. And?", next: "n4" },
    { id: "n4", speaker: "tyson",   text: "...And what?", next: "n5" },
    { id: "n5", speaker: "grandpa", text: "That's all you have? 'I lost'? No anger? No fire? I'm disappointed.", next: "n6" },
    { id: "n6", speaker: "tyson",   text: "I'm FURIOUS. I just don't know what to do about it yet.", next: "n7" },
    { id: "n7", speaker: "grandpa", text: "*smiles* NOW you're talking. Your friends have an idea. Go hear them out.", next: null },
  ]});

  D.push({ id: "dlg_kenny_parts_quest", nodes: [
    { id: "n1", speaker: "kenny",  text: "Okay Tyson — so Chief has been doing some research. Your Dragoon needs an upgrade.", next: "n2" },
    { id: "n2", speaker: "andrew", text: "Not just an upgrade — a full rebuild. Dragoon S. Storm Attack configuration.", next: "n3" },
    { id: "n3", speaker: "tyson",  text: "Dragoon S? Sounds intense.", next: "n4" },
    { id: "n4", speaker: "kenny",  text: "It IS. And Chief has traced the four component parts to places all over Beigoma. Attack ring, weight disk, spin gear, blade base — scattered.", next: "n5" },
    { id: "n5", speaker: "tyson",  text: "So... we go find them. Quest time. Let's do this.", next: "n6" },
    { id: "n6", speaker: "andrew", text: "One thing — you don't HAVE a Beyblade right now. So no battles on the road.", next: "n7" },
    { id: "n7", speaker: "tyson",  text: "I know, I know. I'll find the parts first. Then Kai won't know what hit him.", next: null },
  ]});

  D.push({ id: "dlg_part_found_attack_ring", nodes: [
    { id: "n1", speaker: "narrator", text: "[Wedged under a park bench, half-buried in dirt — a Beyblade attack ring. A four-wing spiral cut. This is the piece Kenny described.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Found it! One down — three to go. Come on, Dragoon S. Come back together.", next: null },
  ]});

  D.push({ id: "dlg_part_found_weight_disk", nodes: [
    { id: "n1", speaker: "narrator", text: "[Tucked into a crack in the riverside wall — the heavy, perfectly balanced weight disk. Kenny's data was right on the mark.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Two down. I can feel it — Dragoon S is almost here.", next: null },
  ]});

  D.push({ id: "dlg_part_found_spin_gear", nodes: [
    { id: "n1", speaker: "narrator", text: "[Hanging from a nail on the dojo wall, almost like it was waiting — the spin gear. One of Grandpa's old students must have left it here years ago.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Grandpa... did you leave this here on purpose?", next: "n3" },
    { id: "n3", speaker: "narrator", text: "[No answer. But somewhere deep in the dojo, you hear quiet, knowing laughter.]", next: null },
  ]});

  D.push({ id: "dlg_part_found_blade_base", nodes: [
    { id: "n1", speaker: "narrator", text: "[On a high shelf in the back of a storage room — the blade base, glinting silver in the afternoon light. The last piece.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "THAT'S IT! ALL FOUR PARTS! Kenny — wherever you are — CHIEF CALLED IT!", next: null },
  ]});

  D.push({ id: "dlg_dragoon_s_assembled", nodes: [
    { id: "n1", speaker: "kenny",    text: "*typing furiously* Attack ring — check. Weight disk — check. Spin gear — check. Blade base — check. All readings nominal!", next: "n2" },
    { id: "n2", speaker: "andrew",   text: "Tyson... that looks incredible.", next: "n3" },
    { id: "n3", speaker: "tyson",    text: "Dragoon S. Hey, buddy. It's me. Ready to do this?", next: "n4" },
    { id: "n4", speaker: "narrator", text: "[The Beyblade sits quietly in your palm. Then — a faint pulse. Like a heartbeat.]", next: "n5" },
    { id: "n5", speaker: "tyson",    text: "...I felt that. Did everyone else feel that?", next: "n6" },
    { id: "n6", speaker: "kenny",    text: "Chief felt it. Chief is... not sure how to classify it. Yet.", next: null },
  ]});

  // ─── Phase 3: Family Sword & Bit-Beast Awakening ─────────────────────────────

  D.push({ id: "dlg_family_sword_interaction", nodes: [
    { id: "n1", speaker: "narrator", text: "[You touch the family sword. And the world goes still.]", next: "n2" },
    { id: "n2", speaker: "grandpa", text: "Ah. So the time has come.", next: "n3" },
    { id: "n3", speaker: "tyson",   text: "Grandpa — what is this? What's happening?", next: "n4" },
    { id: "n4", speaker: "grandpa", text: "That sword has been in our family for generations. The dragon spirit inside it has been waiting for the right Blader.", next: "n5" },
    { id: "n5", speaker: "tyson",   text: "A... dragon spirit?", next: "n6" },
    { id: "n6", speaker: "grandpa", text: "Dragoon, Tyson. A Bit-Beast. Ancient. Powerful. Loyal — if you prove yourself worthy.", next: "n7" },
    { id: "n7", speaker: "narrator", text: "[The sword glows. Dragoon S trembles in your hands. A roar — distant but vast — shakes the dojo walls.]", next: "n8" },
    { id: "n8", speaker: "tyson",   text: "YEAH! I can feel it — Dragoon's inside! STORM ATTACK — READY!", next: null },
  ]});

  // ─── Phase 3: Hideout ─────────────────────────────────────────────────────────

  D.push({ id: "dlg_kenny_kidnapped_news", nodes: [
    { id: "n1", speaker: "andrew",  text: "Tyson. It's Kenny. The Blade Sharks took him.", next: "n2" },
    { id: "n2", speaker: "tyson",   text: "What?!", next: "n3" },
    { id: "n3", speaker: "andrew",  text: "Carlos saw it happen. He tried to stop them — they shoved him aside. Said it was 'on Kai's orders.'", next: "n4" },
    { id: "n4", speaker: "tyson",   text: "Kai. Of COURSE it's Kai. Where's their hideout?", next: "n5" },
    { id: "n5", speaker: "andrew",  text: "West side of town. Big warehouse. Carlos says he knows another way in.", next: "n6" },
    { id: "n6", speaker: "carlos",  text: "*quietly* ...I'll show you. Those Blade Sharks — they're not what I thought they were.", next: null },
  ]});

  D.push({ id: "dlg_hideout_entry", nodes: [
    { id: "n1", speaker: "narrator", text: "[The warehouse is dark and cold. Rows of metal shelving line the walls. At the centre — Kenny, sitting on the floor, laptop clutched to his chest.]", next: "n2" },
    { id: "n2", speaker: "kenny",    text: "Tyson! I knew you'd come! Chief — Chief said you would!", next: "n3" },
    { id: "n3", speaker: "rick",     text: "Cute reunion. But nobody leaves until Kai says so.", next: "n4" },
    { id: "n4", speaker: "tyson",    text: "Then I'll make Kai say so. Where is he?", next: "n5" },
    { id: "n5", speaker: "narrator", text: "[A door swings open at the far end of the warehouse. Kai steps out, Dranzer S already in hand.]", next: "n6" },
    { id: "n6", speaker: "kai",      text: "You actually came. Good.", next: "n7" },
    { id: "n7", speaker: "tyson",    text: "You bet I came. Let Kenny go — and then we finish this. For real this time.", next: "n8" },
    { id: "n8", speaker: "kai",      text: "Finish it? This is only the beginning.", next: null },
  ]});

  D.push({ id: "dlg_kai_final_intro", nodes: [
    { id: "n1", speaker: "kai",   text: "Dranzer S — Flame Spiral. Let's see your so-called Bit-Beast.", next: "n2" },
    { id: "n2", speaker: "tyson", text: "Oh, we'll SHOW you our Bit-Beast. Dragoon S — Storm Attack! LET IT RIP!", next: null },
  ]});

  D.push({ id: "dlg_kai_hideout_defeated", nodes: [
    { id: "n1", speaker: "narrator", text: "[Two Beyblades tear across the concrete in a blur of wind and fire. Then — silence. Dranzer S slows. Stops.]", next: "n2" },
    { id: "n2", speaker: "kai",     text: "...", next: "n3" },
    { id: "n3", speaker: "tyson",   text: "It's over, Kai. Let. Kenny. Go.", next: "n4" },
    { id: "n4", speaker: "kai",     text: "*a long silence* ...Bit-Beasts. You've awakened yours. Interesting.", next: "n5" },
    { id: "n5", speaker: "kai",     text: "These battles — they're not just about spinning tops, are they. Fine. Take your friend. But this? Between us? This isn't over.", next: "n6" },
    { id: "n6", speaker: "tyson",   text: "I know. And I can't wait.", next: null },
  ]});

  D.push({ id: "dlg_kai_wins_hideout", nodes: [
    { id: "n1", speaker: "kai",    text: "You're strong. But Dranzer's Flame Spiral is stronger. Come back when you've mastered your Storm Attack.", next: "n2" },
    { id: "n2", speaker: "tyson",  text: "Round two isn't over yet, Kai — not by a long shot!", next: "n3" },
    { id: "n3", speaker: "narrator", text: "[Game saved. You can level up and try again — Kai will be waiting.]", next: null },
  ]});

  D.push({ id: "dlg_kai_idle", nodes: [
    { id: "n1", speaker: "kai", text: "...", next: null },
  ]});

  // ─── Phase 3: Carlos in Hideout ──────────────────────────────────────────────

  D.push({ id: "dlg_carlos_hideout", nodes: [
    { id: "n1", speaker: "carlos",   text: "My Beyblade... they destroyed it. I thought we were a team.", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Carlos—", next: "n3" },
    { id: "n3", speaker: "carlos",   text: "You knew this was wrong before I did. Maybe... maybe that's what real strength looks like.", next: null },
  ]});

  // ─── Phase 3: Bit-Beast knowledge ────────────────────────────────────────────

  D.push({ id: "dlg_bit_beast_knowledge", nodes: [
    { id: "n1", speaker: "kenny",  text: "Incredible. Chief's analysis confirms it — those energy readings during battle were Bit-Beast resonance. Ancient spirits, inside the Beyblades!", next: "n2" },
    { id: "n2", speaker: "andrew", text: "And Kai knew. All along.", next: "n3" },
    { id: "n3", speaker: "tyson",  text: "That's why he's so obsessed with getting stronger. He wants to collect them.", next: "n4" },
    { id: "n4", speaker: "kenny",  text: "Chief recommends... caution. If there are more Bladers out there with Bit-Beasts... this could get a LOT more serious.", next: "n5" },
    { id: "n5", speaker: "tyson",  text: "Then we get serious too. Whatever comes next — we face it together.", next: null },
  ]});

  // ─── Phase 4: Puppy Rescue & Meet Max ────────────────────────────────────────

  D.push({ id: "dlg_puppy_rescue_setup", nodes: [
    { id: "n1", speaker: "narrator", text: "[A faint whimpering carries over the sound of the river. Something small is clinging to a rock in the current — a puppy, trapped behind a small waterfall.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Hey — there's a dog in there! I've gotta do something!", next: "n3" },
    { id: "n3", speaker: "narrator", text: "[The waterfall is too strong to wade through. But there's a series of loose wooden logs above the flow — if something hit them at the right angle...]", next: "n4" },
    { id: "n4", speaker: "tyson",    text: "Dragoon S — I've got a plan. Follow my lead!", next: null },
  ]});

  D.push({ id: "dlg_puppy_rescued", nodes: [
    { id: "n1", speaker: "narrator", text: "[CRACK! The log swings across the waterfall, blocking the flow just long enough — the puppy scrambles onto dry land, shaking itself off.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "YES! Got him! Hey, little guy — you okay?", next: "n3" },
    { id: "n3", speaker: "narrator", text: "[A pair of sneakers land beside you with a thud. Someone else jumped down from the embankment above.]", next: "n4" },
    { id: "n4", speaker: "max",      text: "That was AMAZING! Did you just use your Beyblade to deflect the waterfall?! That's the coolest thing I've EVER seen!", next: "n5" },
    { id: "n5", speaker: "tyson",    text: "Uh — yeah, I did. Hi. Who are you?", next: "n6" },
    { id: "n6", speaker: "max",      text: "Max Tate! Blader, world traveller, defence-type specialist — and I think I just found my new best rival!", next: "n7" },
    { id: "n7", speaker: "tyson",    text: "*laughs* That's... the most excited anyone's ever been to meet me. I like it.", next: null },
  ]});

  D.push({ id: "dlg_max_shop_intro", nodes: [
    { id: "n1", speaker: "max",   text: "My dad runs a Bey supply shop, right near the river. Best ripcords in the city — and trust me, with how hard you battle, you're gonna NEED good ones.", next: "n2" },
    { id: "n2", speaker: "tyson", text: "Ripcords wear out?", next: "n3" },
    { id: "n3", speaker: "max",   text: "Everything wears out if you battle enough. Launchers, ripcords, even the blade base. Dad says a good Blader maintains their gear as carefully as they train.", next: "n4" },
    { id: "n4", speaker: "tyson", text: "I... had no idea. Your dad sounds like someone I need to meet.", next: "n5" },
    { id: "n5", speaker: "max",   text: "Oh, you'll love him! Come on — shop's right this way!", next: null },
  ]});

  D.push({ id: "dlg_mr_tate_welcome", nodes: [
    { id: "n1", speaker: "mr_tate", text: "Well! Max — you brought a friend. Welcome, son. I'm Mr. Tate. You look like someone who pushes their gear hard.", next: "n2" },
    { id: "n2", speaker: "tyson",   text: "That's... one way to put it.", next: "n3" },
    { id: "n3", speaker: "mr_tate", text: "Nothing wrong with that — as long as you maintain it. We carry ripcords, launchers, repair kits, all graded by launch power and durability. Take your time and look around.", next: "n4" },
    { id: "n4", speaker: "tyson",   text: "This is incredible. Kenny is going to LOSE his mind.", next: null },
  ]});

  D.push({ id: "dlg_mr_tate_idle", nodes: [
    { id: "n1", speaker: "mr_tate", text: "A worn ripcord costs you launch power. Keep your gear in shape and your Beyblade will reward you.", next: null },
  ]});

  D.push({ id: "dlg_max_idle", nodes: [
    { id: "n1", speaker: "max", text: "Defence isn't about avoiding hits — it's about absorbing them and coming back stronger. Sound familiar?", next: null },
  ]});

  // ─── Phase 4: Max Battle (defence type tutorial) ─────────────────────────────

  D.push({ id: "dlg_max_battle_intro", nodes: [
    { id: "n1", speaker: "max",   text: "I've been wanting to battle you since that waterfall! Let me show you what a real defence-type can do!", next: "n2" },
    { id: "n2", speaker: "tyson", text: "Bring it! Dragoon S doesn't know the word 'defence' — that's why we WIN!", next: null },
  ]});

  D.push({ id: "dlg_max_defeated", nodes: [
    { id: "n1", speaker: "max",   text: "Wow. Just... wow. Your storm attack PUNCHES through everything.", next: "n2" },
    { id: "n2", speaker: "tyson", text: "You weren't kidding about defence types. Your bey barely MOVED.", next: "n3" },
    { id: "n3", speaker: "max",   text: "That's the whole point! Defence outlasts attack — usually. But your Bit-Beast gives you an edge most Bladers don't have.", next: "n4" },
    { id: "n4", speaker: "tyson", text: "Bit-Beasts... you know about those?", next: "n5" },
    { id: "n5", speaker: "max",   text: "I know a little. My mom's been studying them for years — she's a Beyblade researcher. Maybe we can learn together?", next: "n6" },
    { id: "n6", speaker: "tyson", text: "Yeah. I'd like that. Hey Max — you wanna stick around Beigoma for a while?", next: "n7" },
    { id: "n7", speaker: "max",   text: "I thought you'd never ask! Partners?", next: "n8" },
    { id: "n8", speaker: "tyson", text: "Partners!", next: null },
  ]});

  D.push({ id: "dlg_max_wins", nodes: [
    { id: "n1", speaker: "max",   text: "Attack without stability always burns itself out eventually. That's the science of defence!", next: "n2" },
    { id: "n2", speaker: "tyson", text: "Okay okay, you made your point. Rematch — whenever you're ready!", next: null },
  ]});

  // ─── Phase 5: Dickinson & Tournament Registration ────────────────────────────

  D.push({ id: "dlg_dickinson_entrance", nodes: [
    { id: "n1", speaker: "narrator",    text: "[The Seaside Dome registration lobby is bigger than any room you've been in. Marble floors, tall banners, the smell of fresh beyblade plastic. An elderly man in a three-piece suit approaches.]", next: "n2" },
    { id: "n2", speaker: "dickinson",   text: "Tyson Granger. I've been hearing your name from every corner of Beigoma City. You're the boy who defeated the Blade Sharks?", next: "n3" },
    { id: "n3", speaker: "tyson",       text: "...You know about that?", next: "n4" },
    { id: "n4", speaker: "dickinson",   text: "I know about most things that matter in the Beyblade world, young man. I'm Mr. Dickinson. I run the World Beyblade Organisation — and I have a proposition for you.", next: "n5" },
    { id: "n5", speaker: "tyson",       text: "A proposition? From the WBO? Kenny is going to FLIP out.", next: "n6" },
    { id: "n6", speaker: "dickinson",   text: "Ha! I've met Mr. Kenny. He seems like a very thorough young man. Now — I'm hosting an invitational tournament here at this dome. Six of the most talented young Bladers in Japan. I'd like you to be one of them.", next: "n7" },
    { id: "n7", speaker: "tyson",       text: "...An official tournament? With the best Bladers in the country?", next: "n8" },
    { id: "n8", speaker: "dickinson",   text: "Are you interested?", next: "n9" },
    { id: "n9", speaker: "tyson",       text: "Are you KIDDING? YES! Where do I sign?!", next: null },
  ]});

  D.push({ id: "dlg_tournament_registered", nodes: [
    { id: "n1", speaker: "dickinson",   text: "Excellent. The tournament begins in two weeks. Train hard, Tyson. The Bladers you'll face there are in a different league from anyone you've met in Beigoma.", next: "n2" },
    { id: "n2", speaker: "tyson",       text: "Different league? Good. I've been getting bored of the same league.", next: "n3" },
    { id: "n3", speaker: "dickinson",   text: "*chuckles* Yes. I thought you might say something like that. Good luck, young man. The world is watching.", next: "n4" },
    { id: "n4", speaker: "narrator",    text: "[Tyson steps out of the Seaside Dome into the afternoon sun. The city feels smaller somehow — and yet bigger with possibility than it ever has before.]", next: "n5" },
    { id: "n5", speaker: "tyson",       text: "...Alright. Whatever comes next — bring it.", next: null },
  ]});

  D.push({ id: "dlg_dickinson_idle", nodes: [
    { id: "n1", speaker: "dickinson", text: "The Seaside Dome Invitational awaits. Train well, Tyson.", next: null },
  ]});

  // ─── Gate / misc dialogues ────────────────────────────────────────────────────

  D.push({ id: "dlg_hideout_locked", nodes: [
    { id: "n1", speaker: "narrator", text: "[A row of heavy crates blocks the alley. Nobody inside — nobody visible outside. Whatever is back here is hidden for a reason.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "...I don't even know where to look. I need more info first.", next: null },
  ]});

  D.push({ id: "dlg_rick_idle", nodes: [
    { id: "n1", speaker: "rick", text: "You don't belong here. Unless you want to battle.", next: null },
  ]});

  D.push({ id: "dlg_rick_battle_intro", nodes: [
    { id: "n1", speaker: "rick", text: "Kai said to keep intruders occupied. My Trygle will handle you fast.", next: null },
  ]});

  D.push({ id: "dlg_rick_defeated", nodes: [
    { id: "n1", speaker: "rick", text: "How— go. Just go. Kai's at the far end.", next: null },
  ]});

  D.push({ id: "dlg_rick_wins", nodes: [
    { id: "n1", speaker: "rick", text: "Nobody passes me. Back to the door — come back stronger.", next: null },
  ]});

  D.push({ id: "dlg_sam_idle", nodes: [
    { id: "n1", speaker: "sam", text: "Think before you go any further. Kai doesn't lose.", next: null },
  ]});

  D.push({ id: "dlg_sam_battle_intro", nodes: [
    { id: "n1", speaker: "sam", text: "You want Kenny? Go through ME first.", next: null },
  ]});

  D.push({ id: "dlg_sam_defeated", nodes: [
    { id: "n1", speaker: "sam", text: "...Not bad. Not bad at all.", next: null },
  ]});

  D.push({ id: "dlg_sam_wins", nodes: [
    { id: "n1", speaker: "sam", text: "Better luck next time.", next: null },
  ]});

  D.push({ id: "dlg_random_blader_1_idle", nodes: [
    { id: "n1", speaker: "random_blader_1", text: "Hey! You're Tyson, right? You got my Beyblade back from those Blade Sharks! Thanks, man — wanna battle?", next: null },
  ]});

  D.push({ id: "dlg_random_blader_1_battle_intro", nodes: [
    { id: "n1", speaker: "random_blader_1", text: "This one's for fun! Let it RIP!", next: null },
  ]});

  D.push({ id: "dlg_random_blader_1_defeated", nodes: [
    { id: "n1", speaker: "random_blader_1", text: "Man, you really ARE as good as they say. Rematch next time!", next: null },
  ]});

  D.push({ id: "dlg_random_blader_1_wins", nodes: [
    { id: "n1", speaker: "random_blader_1", text: "Nice try! I've been practising since I got my bey back — rematch any time!", next: null },
  ]});

  D.push({ id: "dlg_random_blader_2_idle", nodes: [
    { id: "n1", speaker: "random_blader_2", text: "You look like a good Blader. Wanna see what my Jumping Base can do?", next: null },
  ]});

  D.push({ id: "dlg_random_blader_2_battle_intro", nodes: [
    { id: "n1", speaker: "random_blader_2", text: "Don't hold back — I can take it!", next: null },
  ]});

  D.push({ id: "dlg_random_blader_2_defeated", nodes: [
    { id: "n1", speaker: "random_blader_2", text: "Whoa. That Storm Attack is no joke!", next: null },
  ]});

  D.push({ id: "dlg_random_blader_2_wins", nodes: [
    { id: "n1", speaker: "random_blader_2", text: "Haha! One more round? I wanna see if I can do it again.", next: null },
  ]});

  // ─── Backyard practice ────────────────────────────────────────────────────────

  D.push({ id: "dlg_backyard_practice", nodes: [
    { id: "n1", speaker: "narrator", text: "[The old wooden beystadium in the corner of the backyard creaks as you set it up. Time to train.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Alright Dragoon — let's figure out what we can do. No audience, no pressure. Just you and me.", next: null },
  ]});

  D.push({ id: "dlg_backyard_practice_dragoons", nodes: [
    { id: "n1", speaker: "narrator", text: "[Dragoon S hums in your palm. The Storm Attack isn't just a move — it feels like Dragoon is alive.]", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Let's sharpen this. When I face Kai again, I want Storm Attack to be PERFECT.", next: null },
  ]});

  // ─── Can-hit practice mini-game ──────────────────────────────────────────────

  D.push({ id: "dlg_can_hit_intro", nodes: [
    { id: "n1", speaker: "narrator", text: "[A stack of old tin cans is set up against the garden wall. A hand-painted sign reads: 'TYSON'S LAUNCHING LAB — 3 hits wins!']", next: "n2" },
    { id: "n2", speaker: "tyson",    text: "Time to sharpen my aim. Launch from the marker, hit all three cans — simple!", next: null },
  ]});

  // Seed all dialogues
  for (const d of D) {
    await put("rpg_dialogues", d.id, {
      ...d,
      language: "en",
      arcIds: ["arc1_ep1"],
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — STORY EVENTS  (~40 events across all 5 phases)
// ═══════════════════════════════════════════════════════════════════════════════
async function seedStoryEvents() {
  console.log("\n⚡  Story Events");

  // ── Phase 1 events ───────────────────────────────────────────────────────────

  await put("rpg_story_events", "ev_room_wakeup", {
    id: "ev_room_wakeup", displayName: "Wakeup — Grandpa Arrives",
    mapId: "tyson_room", category: "cutscene",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_grandpa_wakeup",
    actions: [{ type: "setFlag", flag: "wakeup_done", value: true }],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_dragoon_sword_room", {
    id: "ev_dragoon_sword_room", displayName: "Sword Glimpse — Tyson's Room",
    mapId: "tyson_room", category: "explore",
    triggerMode: "interact", triggerOnce: true,
    dialogueId: "dlg_sword_room_view",
    actions: [{ type: "setFlag", flag: "sword_room_viewed", value: true }],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_grandpa_caught", {
    id: "ev_grandpa_caught", displayName: "Grandpa Catches Tyson",
    mapId: "dojo_garden_path", category: "chase",
    triggerMode: "catch", triggerOnce: false,
    dialogueId: "dlg_grandpa_caught",
    actions: [
      { type: "teleportPlayer", mapId: "granger_dojo", entryId: "from_garden" },
    ],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_grandpa_escaped", {
    id: "ev_grandpa_escaped", displayName: "Escaped the Dojo!",
    mapId: "dojo_garden_path", category: "milestone",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_grandpa_escaped_taunt",
    actions: [
      { type: "setFlag",  flag: "dojo_escaped",  value: true },
      { type: "addXP",    amount: 15, source: "escape" },
    ],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_billy_challenge", {
    id: "ev_billy_challenge", displayName: "Billy's Challenge",
    mapId: "beigoma_park", category: "battle_intro",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_billy_challenge",
    actions: [{ type: "startBattle", npcId: "billy", onWin: "ev_billy_won", onLose: null }],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_billy_won", {
    id: "ev_billy_won", displayName: "Billy Defeated",
    mapId: "beigoma_park", category: "milestone",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: null,
    actions: [
      { type: "setFlag",    flag: "billy_defeated", value: true },
      { type: "addBadge",   badgeId: "badge_first_victory" },
    ],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_rooftop_aftermath", {
    id: "ev_rooftop_aftermath", displayName: "Rooftop — The Aftermath",
    mapId: "rooftop", category: "cutscene",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_rooftop_arrival",
    actions: [{ type: "setFlag", flag: "rooftop_visited", value: true }],
    nextEventId: "ev_carlos_rooftop_challenge",
  });

  await put("rpg_story_events", "ev_carlos_rooftop_challenge", {
    id: "ev_carlos_rooftop_challenge", displayName: "Carlos Taunts Tyson",
    mapId: "rooftop", category: "cutscene",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_carlos_rooftop_challenge",
    actions: [],
    nextEventId: "ev_kenny_quest_intro",
  });

  await put("rpg_story_events", "ev_kenny_quest_intro", {
    id: "ev_kenny_quest_intro", displayName: "Kenny & Andrew — Level Up Quest",
    mapId: "rooftop", category: "quest_start",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_kenny_quest_intro",
    actions: [
      { type: "startQuest", questId: "q_reach_level_5" },
    ],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_dragoon_sword_dojo", {
    id: "ev_dragoon_sword_dojo", displayName: "Sword Fascination — Dojo",
    mapId: "granger_dojo", category: "explore",
    triggerMode: "interact", triggerOnce: true,
    dialogueId: "dlg_sword_dojo_view",
    actions: [{ type: "setFlag", flag: "sword_dojo_viewed", value: true }],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_backyard_practice", {
    id: "ev_backyard_practice", displayName: "Backyard Practice (AI Battle)",
    mapId: "tyson_backyard", category: "battle",
    triggerMode: "interact", triggerOnce: false,
    dialogueId: "dlg_backyard_practice",
    actions: [{ type: "startAIBattle", difficulty: "easy", arenaId: "classic_circle" }],
    nextEventId: null,
  });

  // Can-hit mini-game stub
  await put("rpg_story_events", "ev_can_hit_practice", {
    id: "ev_can_hit_practice", displayName: "Can-Hit Launching Practice",
    mapId: "tyson_backyard", category: "mini_game",
    triggerMode: "interact", triggerOnce: false,
    dialogueId: "dlg_can_hit_intro",
    miniGame: {
      id:          "can_hit_practice",
      type:        "bey_trajectory_aim",
      description: "Launch Dragoon from the marker and hit 3 stacked tin cans.",
      targets:     3,
      xpReward:    20,
    },
    actions: [],
    nextEventId: null,
  });

  // ── Phase 2 events ───────────────────────────────────────────────────────────

  await put("rpg_story_events", "ev_river_carlos_challenge", {
    id: "ev_river_carlos_challenge", displayName: "River — Carlos Challenge",
    mapId: "river_side", category: "battle_intro",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_river_arrival",
    actions: [{ type: "startBattle", npcId: "carlos", onWin: "ev_carlos_won", onLose: null }],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_carlos_won", {
    id: "ev_carlos_won", displayName: "Carlos Defeated at River",
    mapId: "river_side", category: "milestone",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_carlos_defeated",
    actions: [
      { type: "setFlag",  flag: "carlos_defeated", value: true },
      { type: "addBadge", badgeId: "badge_carlos_beaten" },
    ],
    nextEventId: "ev_kai_river_entrance",
  });

  await put("rpg_story_events", "ev_kai_river_entrance", {
    id: "ev_kai_river_entrance", displayName: "Kai Arrives at the River",
    mapId: "river_side", category: "cutscene",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_kai_river_entrance",
    actions: [{ type: "startBattle", npcId: "kai", onWin: null, onLose: "ev_kai_wins_river" }],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_kai_wins_river", {
    id: "ev_kai_wins_river", displayName: "Kai Defeats Tyson — Checkpoint",
    mapId: "river_side", category: "checkpoint",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_kai_river_battle_result",
    actions: [
      { type: "setFlag",      flag: "kai_battled_river", value: true },
      { type: "saveCheckpoint", checkpointId: "cp_after_kai_river" },
      { type: "teleportPlayer", mapId: "tyson_room", entryId: "default" },
    ],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_new_beyblade_home", {
    id: "ev_new_beyblade_home", displayName: "Home After Kai — New Bey Quest",
    mapId: "tyson_room", category: "quest_start",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_new_bey_home",
    actions: [{ type: "nextScene", sceneId: "ev_kenny_parts_quest_home" }],
    nextEventId: "ev_kenny_parts_quest_home",
  });

  await put("rpg_story_events", "ev_kenny_parts_quest_home", {
    id: "ev_kenny_parts_quest_home", displayName: "Kenny Explains Dragoon-S Parts",
    mapId: "tyson_room", category: "quest_start",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_kenny_parts_quest",
    actions: [
      { type: "setFlag",    flag: "new_bey_scene_done",  value: true },
      { type: "setFlag",    flag: "has_beyblade",        value: false },
      { type: "startQuest", questId: "q_find_4_parts" },
    ],
    nextEventId: null,
  });

  // Part-found events
  const PARTS = [
    { id: "ev_part_attack_ring_found",  flag: "part_attack_ring_found",  dlg: "dlg_part_found_attack_ring",  itemId: "dragoon_s_attack_ring",  mapId: "beigoma_park" },
    { id: "ev_part_weight_disk_found",  flag: "part_weight_disk_found",  dlg: "dlg_part_found_weight_disk",  itemId: "dragoon_s_weight_disk",  mapId: "river_side"   },
    { id: "ev_part_spin_gear_found",    flag: "part_spin_gear_found",    dlg: "dlg_part_found_spin_gear",    itemId: "dragoon_s_spin_gear",    mapId: "granger_dojo" },
    { id: "ev_part_blade_base_found",   flag: "part_blade_base_found",   dlg: "dlg_part_found_blade_base",   itemId: "dragoon_s_blade_base",   mapId: "apartment_1f" },
  ];
  for (const p of PARTS) {
    await put("rpg_story_events", p.id, {
      id: p.id, displayName: `Found: ${p.itemId}`,
      mapId: p.mapId, category: "item_pickup",
      triggerMode: "interact", triggerOnce: true,
      dialogueId: p.dlg,
      actions: [
        { type: "setFlag",  flag: p.flag,  value: true },
        { type: "addItem",  itemId: p.itemId, qty: 1 },
        { type: "progressQuest", questId: "q_find_4_parts", objectiveId: "obj_find_parts" },
      ],
      nextEventId: null,
      triggerCondition: { all: ["new_bey_scene_done"], none: [p.flag] },
    });
  }

  await put("rpg_story_events", "ev_dragoon_s_assembled", {
    id: "ev_dragoon_s_assembled", displayName: "Dragoon S — Assembled!",
    mapId: "tyson_room", category: "milestone",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_dragoon_s_assembled",
    actions: [
      { type: "setFlag",    flag: "dragoon_s_assembled", value: true },
      { type: "setFlag",    flag: "has_beyblade",        value: true },
      { type: "completeQuest", questId: "q_find_4_parts" },
      { type: "addBadge",   badgeId: "badge_dragoon_s_built" },
    ],
    nextEventId: null,
    triggerCondition: { all: ["part_attack_ring_found","part_weight_disk_found","part_spin_gear_found","part_blade_base_found"] },
  });

  await put("rpg_story_events", "ev_backyard_practice_dragoons", {
    id: "ev_backyard_practice_dragoons", displayName: "Backyard Practice with Dragoon S",
    mapId: "tyson_backyard", category: "battle",
    triggerMode: "interact", triggerOnce: false,
    dialogueId: "dlg_backyard_practice_dragoons",
    actions: [{ type: "startAIBattle", difficulty: "medium", arenaId: "classic_circle" }],
    nextEventId: null,
  });

  // ── Phase 3 events ───────────────────────────────────────────────────────────

  await put("rpg_story_events", "ev_family_sword_interaction", {
    id: "ev_family_sword_interaction", displayName: "Family Sword — Bit-Beast Awakens",
    mapId: "granger_dojo", category: "cutscene",
    triggerMode: "interact", triggerOnce: true,
    dialogueId: "dlg_family_sword_interaction",
    actions: [
      { type: "setFlag",      flag: "dragoon_bit_beast_awakened", value: true },
      { type: "grantSpecialMove", beybladeId: "dragoon_s", specialMoveId: "storm_attack" },
      { type: "addBadge",     badgeId: "badge_bit_beast_awakened" },
    ],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_kenny_kidnapped_news", {
    id: "ev_kenny_kidnapped_news", displayName: "Kenny Kidnapped — Hideout Unlocked",
    mapId: "beigoma_street", category: "cutscene",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_kenny_kidnapped_news",
    actions: [
      { type: "setFlag",    flag: "kenny_kidnapped_known", value: true },
      { type: "startQuest", questId: "q_rescue_kenny" },
    ],
    triggerCondition: { all: ["level_10_reached", "dragoon_s_assembled"], none: ["kenny_kidnapped_known"] },
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_hideout_entry", {
    id: "ev_hideout_entry", displayName: "Inside the Blade Sharks Hideout",
    mapId: "blade_sharks_hideout", category: "cutscene",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_hideout_entry",
    actions: [{ type: "setFlag", flag: "hideout_entered", value: true }],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_final_kai_battle", {
    id: "ev_final_kai_battle", displayName: "Final Battle — Kai vs Tyson (Dragoon S)",
    mapId: "blade_sharks_hideout", category: "boss_battle",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: null,
    actions: [
      { type: "saveCheckpoint", checkpointId: "cp_before_final_kai" },
      { type: "startBattle", npcId: "kai", onWin: "ev_kai_final_defeated", onLose: "ev_kai_wins_hideout" },
    ],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_kai_final_defeated", {
    id: "ev_kai_final_defeated", displayName: "Kai Defeated — Bit-Beast Revelation",
    mapId: "blade_sharks_hideout", category: "cutscene",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_kai_hideout_defeated",
    actions: [
      { type: "setFlag",       flag: "kai_defeated_hideout", value: true },
      { type: "addBadge",      badgeId: "badge_kai_beaten" },
      { type: "completeQuest", questId: "q_rescue_kenny" },
    ],
    nextEventId: "ev_bit_beast_revelation",
  });

  await put("rpg_story_events", "ev_kai_wins_hideout", {
    id: "ev_kai_wins_hideout", displayName: "Kai Wins — Try Again",
    mapId: "blade_sharks_hideout", category: "checkpoint_restore",
    triggerMode: "auto", triggerOnce: false,
    dialogueId: "dlg_kai_wins_hideout",
    actions: [
      { type: "saveCheckpoint",  checkpointId: "cp_before_final_kai" },
    ],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_bit_beast_revelation", {
    id: "ev_bit_beast_revelation", displayName: "Bit-Beasts — The Bigger Picture",
    mapId: "blade_sharks_hideout", category: "cutscene",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_bit_beast_knowledge",
    actions: [
      { type: "setFlag",      flag: "bit_beast_knowledge_gained", value: true },
      { type: "saveCheckpoint", checkpointId: "cp_arc1_complete" },
      // arc1_ep2 unlocked here — engine handles arc transition
    ],
    nextEventId: null,
  });

  // ── Phase 4 events ───────────────────────────────────────────────────────────

  // Puppy rescue mini-game
  await put("rpg_story_events", "ev_puppy_rescue_minigame", {
    id: "ev_puppy_rescue_minigame", displayName: "Puppy Rescue — Waterfall Mini-Game",
    mapId: "river_side", category: "mini_game",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_puppy_rescue_setup",
    miniGame: {
      id:          "puppy_rescue",
      type:        "bey_trajectory_block",
      description: "Launch Dragoon S to hit the wooden logs above the waterfall and redirect the flow. Save the puppy!",
      stages:      3,     // hit each log in sequence
      timeLimit:   30,    // seconds
      xpReward:    50,
      onSuccess:   "ev_puppy_rescued",
    },
    actions: [],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_puppy_rescued", {
    id: "ev_puppy_rescued", displayName: "Puppy Saved!",
    mapId: "river_side", category: "milestone",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_puppy_rescued",
    actions: [
      { type: "setFlag", flag: "puppy_saved", value: true },
      { type: "addXP",   amount: 50 },
    ],
    nextEventId: "ev_meet_max",
  });

  await put("rpg_story_events", "ev_meet_max", {
    id: "ev_meet_max", displayName: "Meeting Max Tate",
    mapId: "river_side", category: "cutscene",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_max_shop_intro",
    actions: [
      { type: "setFlag",    flag: "max_met",      value: true },
      { type: "setFlag",    flag: "shop_unlocked", value: true },
      { type: "unlockMap",  mapId: "max_shop" },
      { type: "startQuest", questId: "q_challenge_max" },
    ],
    nextEventId: null,
  });

  await put("rpg_story_events", "ev_shop_first_visit", {
    id: "ev_shop_first_visit", displayName: "First Visit to Mr. Tate's Shop",
    mapId: "max_shop", category: "cutscene",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_mr_tate_welcome",
    actions: [{ type: "setFlag", flag: "shop_visited", value: true }],
    nextEventId: null,
  });

  // ── Phase 5 events ───────────────────────────────────────────────────────────

  await put("rpg_story_events", "ev_dickinson_meeting", {
    id: "ev_dickinson_meeting", displayName: "Mr. Dickinson — Tournament Invitation",
    mapId: "seaside_dome", category: "cutscene",
    triggerMode: "enter", triggerOnce: true,
    dialogueId: "dlg_dickinson_entrance",
    actions: [],
    nextEventId: "ev_tournament_registration",
  });

  await put("rpg_story_events", "ev_tournament_registration", {
    id: "ev_tournament_registration", displayName: "Tournament Registration Complete",
    mapId: "seaside_dome", category: "milestone",
    triggerMode: "auto", triggerOnce: true,
    dialogueId: "dlg_tournament_registered",
    actions: [
      { type: "setFlag",       flag: "tournament_registered",  value: true },
      { type: "setFlag",       flag: "arc1_ep1_complete",      value: true },
      { type: "addBadge",      badgeId: "badge_tournament_invite" },
      { type: "completeQuest", questId: "q_reach_level_15" },
      { type: "saveCheckpoint", checkpointId: "cp_arc1_ep1_done" },
      // Engine unlocks arc2 from here
    ],
    nextEventId: null,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — QUESTS  (5 quests)
// ═══════════════════════════════════════════════════════════════════════════════
async function seedQuests() {
  console.log("\n📋  Quests");

  await put("rpg_quests", "q_reach_level_5", {
    id: "q_reach_level_5",
    displayName: "Getting Stronger",
    description: "Carlos is way out of your league right now. Train hard — battles in the park and your backyard will sharpen your skills. Reach Level 5 to challenge him at the river.",
    category: "training",
    objectives: [
      { id: "obj_level_5", description: "Reach Blader Level 5", type: "reach_level", quantity: 5, progress: 0 },
    ],
    rewardXP: 80,
    rewardItems: [],
    completionFlag: "level_5_reached",
    prerequisiteFlags: ["rooftop_visited"],
    arcIds: ["arc1_ep1"],
  });

  await put("rpg_quests", "q_find_4_parts", {
    id: "q_find_4_parts",
    displayName: "Rebuild Dragoon S",
    description: "You don't have a Beyblade and you lost to Kai. But Kenny and Andrew have figured out a plan — the four components of Dragoon S are hidden across Beigoma. Find them all and rebuild.",
    category: "main_story",
    objectives: [
      { id: "obj_find_parts", description: "Find all 4 Dragoon S components", type: "collect_item", quantity: 4, progress: 0 },
    ],
    rewardXP: 200,
    rewardItems: ["standard_ripcord"],
    completionFlag: "dragoon_s_assembled",
    prerequisiteFlags: ["kai_battled_river"],
    arcIds: ["arc1_ep1"],
  });

  await put("rpg_quests", "q_rescue_kenny", {
    id: "q_rescue_kenny",
    displayName: "Rescue Kenny!",
    description: "The Blade Sharks have kidnapped Kenny. Awaken Dragoon's bit-beast using the family sword, then storm the Blade Sharks' hideout and face Kai in the final battle.",
    category: "main_story",
    objectives: [
      { id: "obj_awaken_bit_beast",   description: "Awaken Dragoon's bit-beast",         type: "story_flag", quantity: 1, progress: 0, flagId: "dragoon_bit_beast_awakened" },
      { id: "obj_defeat_kai_hideout", description: "Defeat Kai at the Blade Sharks HQ",  type: "battle_win", quantity: 1, progress: 0, npcId: "kai" },
    ],
    rewardXP: 400,
    rewardItems: ["grip_tape_upgrade"],
    completionFlag: "kai_defeated_hideout",
    prerequisiteFlags: ["level_10_reached", "dragoon_s_assembled"],
    arcIds: ["arc1_ep1"],
  });

  await put("rpg_quests", "q_challenge_max", {
    id: "q_challenge_max",
    displayName: "The Defence Expert",
    description: "Max Tate is a defence-type specialist and your new friend. Challenge him to a battle — and visit his dad's shop to keep your gear in top shape.",
    category: "side_story",
    objectives: [
      { id: "obj_visit_shop",  description: "Visit Mr. Tate's shop",      type: "story_flag", quantity: 1, progress: 0, flagId: "shop_visited" },
      { id: "obj_defeat_max",  description: "Defeat Max in battle",        type: "battle_win", quantity: 1, progress: 0, npcId: "max" },
    ],
    rewardXP: 180,
    rewardItems: ["wrist_strap_upgrade"],
    completionFlag: "max_defeated",
    prerequisiteFlags: ["max_met"],
    arcIds: ["arc1_ep1"],
  });

  await put("rpg_quests", "q_reach_level_15", {
    id: "q_reach_level_15",
    displayName: "Ready for the World",
    description: "After everything that's happened in Beigoma — the battles, the friends, the Bit-Beast awakening — it's time to prove you belong on a bigger stage. Reach Level 15 and head to the Seaside Dome.",
    category: "main_story",
    objectives: [
      { id: "obj_level_15",  description: "Reach Blader Level 15",       type: "reach_level", quantity: 15, progress: 0 },
      { id: "obj_dome_visit", description: "Visit the Seaside Dome",     type: "story_flag",  quantity: 1,  progress: 0, flagId: "tournament_registered" },
    ],
    rewardXP: 500,
    rewardItems: ["turbo_release_upgrade"],
    completionFlag: "arc1_ep1_complete",
    prerequisiteFlags: ["max_met"],
    arcIds: ["arc1_ep1"],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — ITEMS  (consumables, gear, Dragoon-S parts, shop stock)
// ═══════════════════════════════════════════════════════════════════════════════
async function seedItems() {
  console.log("\n🎒  Items");

  const items = [
    // ── Dragoon-S Quest Parts ─────────────────────────────────────────────────
    {
      id: "dragoon_s_attack_ring", displayName: "Dragoon S — Attack Ring",
      description: "A four-wing spiral attack ring — the first component of Dragoon S. Seek it in the park.",
      category: "quest_item", equipSlot: null,
      stackable: false, usable: false, isConsumable: false, questRelated: true,
      buyPrice: 0, sellPrice: 0, questId: "q_find_4_parts",
    },
    {
      id: "dragoon_s_weight_disk", displayName: "Dragoon S — Weight Disk",
      description: "A perfectly balanced weight disk that enhances stability and spin time. Found near the river.",
      category: "quest_item", equipSlot: null,
      stackable: false, usable: false, isConsumable: false, questRelated: true,
      buyPrice: 0, sellPrice: 0, questId: "q_find_4_parts",
    },
    {
      id: "dragoon_s_spin_gear", displayName: "Dragoon S — Spin Gear",
      description: "The high-torque spin gear that powers Dragoon's Storm Attack. Hidden in the dojo.",
      category: "quest_item", equipSlot: null,
      stackable: false, usable: false, isConsumable: false, questRelated: true,
      buyPrice: 0, sellPrice: 0, questId: "q_find_4_parts",
    },
    {
      id: "dragoon_s_blade_base", displayName: "Dragoon S — Blade Base",
      description: "The final piece — a wide, flat blade base designed for aggressive stadium movement.",
      category: "quest_item", equipSlot: null,
      stackable: false, usable: false, isConsumable: false, questRelated: true,
      buyPrice: 0, sellPrice: 0, questId: "q_find_4_parts",
    },

    // ── Ripcords (with durability — wear per battle) ──────────────────────────
    {
      id: "standard_ripcord", displayName: "Standard Ripcord",
      description: "A solid basic ripcord. Reliable for casual battles but will wear down after heavy use.",
      category: "gear", equipSlot: "ripcord",
      stackable: false, usable: false, isConsumable: false, questRelated: false,
      buyPrice: 30, sellPrice: 8,
      durability: { max: 100, wearPerBattle: 8, breakEffect: "launch_power_penalty_15pct" },
    },
    {
      id: "pro_ripcord", displayName: "Pro Ripcord",
      description: "Reinforced cord with a textured grip — less wear, more consistent launch power.",
      category: "gear", equipSlot: "ripcord",
      stackable: false, usable: false, isConsumable: false, questRelated: false,
      buyPrice: 75, sellPrice: 20,
      durability: { max: 100, wearPerBattle: 4, breakEffect: "launch_power_penalty_10pct" },
      shopOnly: true,
    },

    // ── Launchers (with durability) ───────────────────────────────────────────
    {
      id: "standard_launcher", displayName: "Standard String Launcher",
      description: "The basic Beyblade string launcher. Gets the job done — but heavy battle schedules will wear it out.",
      category: "gear", equipSlot: "launcher",
      stackable: false, usable: false, isConsumable: false, questRelated: false,
      buyPrice: 50, sellPrice: 15,
      durability: { max: 100, wearPerBattle: 5, breakEffect: "launch_power_penalty_20pct" },
      launchBoost: 0,
    },
    {
      id: "power_launcher", displayName: "Power String Launcher",
      description: "A heavier-duty launcher with better grip and spring mechanism. Lasts longer under battle conditions.",
      category: "gear", equipSlot: "launcher",
      stackable: false, usable: false, isConsumable: false, questRelated: false,
      buyPrice: 120, sellPrice: 35,
      durability: { max: 100, wearPerBattle: 3, breakEffect: "launch_power_penalty_10pct" },
      launchBoost: 0.06, shopOnly: true,
    },

    // ── Upgrades ──────────────────────────────────────────────────────────────
    {
      id: "grip_tape_upgrade", displayName: "Grip Tape Wrap",
      description: "Wrap your launcher handle for better control. +8% launch power and reduces ripcord slip.",
      category: "upgrade", equipSlot: "upgrade",
      stackable: false, usable: false, isConsumable: false, questRelated: false,
      buyPrice: 80, sellPrice: 25,
      launchBoost: 0.08, isLauncherUpgrade: true,
    },
    {
      id: "turbo_release_upgrade", displayName: "Turbo Release Mechanism",
      description: "A precision spring-release clip that fires at exactly the right moment. +12% launch power.",
      category: "upgrade", equipSlot: "upgrade",
      stackable: false, usable: false, isConsumable: false, questRelated: false,
      buyPrice: 160, sellPrice: 50, shopOnly: true,
      launchBoost: 0.12, isLauncherUpgrade: true,
    },
    {
      id: "wrist_strap_upgrade", displayName: "Blader Wrist Strap",
      description: "A stabilising wrist strap that reduces launch deviation. +5% launch power and tighter accuracy.",
      category: "accessory", equipSlot: "accessory",
      stackable: false, usable: false, isConsumable: false, questRelated: false,
      buyPrice: 60, sellPrice: 18,
      launchBoost: 0.05,
    },

    // ── Consumables ───────────────────────────────────────────────────────────
    {
      id: "repair_kit", displayName: "Gear Repair Kit",
      description: "A screwdriver, lubricant, and spare clips. Restores 50 durability to your launcher or ripcord.",
      category: "consumable", equipSlot: "consumable",
      stackable: true, maxStack: 5, usable: true, isConsumable: true, questRelated: false,
      buyPrice: 40, sellPrice: 12,
      useEffect: { type: "repair", value: 50 },
    },
    {
      id: "energy_drink", displayName: "Blader Energy Drink",
      description: "A focus boost in a can. Temporarily increases your effective level by +2 for one battle.",
      category: "consumable", equipSlot: "consumable",
      stackable: true, maxStack: 10, usable: true, isConsumable: true, questRelated: false,
      buyPrice: 25, sellPrice: 8,
      useEffect: { type: "xp_boost", value: 2 },
    },
    {
      id: "bey_tune_kit", displayName: "Bey Tune-Up Kit",
      description: "A fine-tuning set for your Beyblade. Restores 30 Beyblade XP to your active bey.",
      category: "consumable", equipSlot: "consumable",
      stackable: true, maxStack: 5, usable: true, isConsumable: true, questRelated: false,
      buyPrice: 55, sellPrice: 15,
      useEffect: { type: "bey_xp_restore", value: 30 },
    },
  ];

  for (const item of items) {
    await put("rpg_items", item.id, { ...item, arcIds: ["arc1_ep1"] });
  }

  // ── Shop inventory definition ─────────────────────────────────────────────
  await put("rpg_items", "shop_tate_supplies", {
    id: "shop_tate_supplies",
    displayName: "Tate's Bey Supply Shop — Stock",
    type: "shop_inventory",
    description: "Mr. Tate's selection. Gear wears out after battles — come back regularly to restock.",
    stock: [
      { itemId: "standard_ripcord",    unlimited: true,  stock: null, price: 30  },
      { itemId: "pro_ripcord",         unlimited: true,  stock: null, price: 75  },
      { itemId: "standard_launcher",   unlimited: true,  stock: null, price: 50  },
      { itemId: "power_launcher",      unlimited: true,  stock: null, price: 120 },
      { itemId: "grip_tape_upgrade",   unlimited: true,  stock: null, price: 80  },
      { itemId: "turbo_release_upgrade", unlimited: false, stock: 2, price: 160 },
      { itemId: "repair_kit",          unlimited: true,  stock: null, price: 40  },
      { itemId: "energy_drink",        unlimited: true,  stock: null, price: 25  },
      { itemId: "bey_tune_kit",        unlimited: true,  stock: null, price: 55  },
    ],
    arcIds: ["arc1_ep1"],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — BADGES  (6 badges)
// ═══════════════════════════════════════════════════════════════════════════════
async function seedBadges() {
  console.log("\n🏅  Badges");

  const badges = [
    {
      id: "badge_first_victory",
      displayName: "First Victory!",
      description: "Defeated Billy in your very first street battle. Every legend starts somewhere.",
      iconAssetId: "badge_icon_star",
      category: "battle",
      rarity: "common",
      arcIds: ["arc1_ep1"],
    },
    {
      id: "badge_carlos_beaten",
      displayName: "Park Protector",
      description: "Defeated Carlos and made him return every Beyblade he stole. Beigoma owes you one.",
      iconAssetId: "badge_icon_shield",
      category: "battle",
      rarity: "uncommon",
      arcIds: ["arc1_ep1"],
    },
    {
      id: "badge_dragoon_s_built",
      displayName: "Rebuild Complete",
      description: "Found all four Dragoon S components and reassembled your Beyblade from scratch. You earned this.",
      iconAssetId: "badge_icon_wrench",
      category: "story",
      rarity: "uncommon",
      arcIds: ["arc1_ep1"],
    },
    {
      id: "badge_bit_beast_awakened",
      displayName: "Spirit Awakened",
      description: "Awakened Dragoon's bit-beast through the family sword. You and Dragoon are one.",
      iconAssetId: "badge_icon_dragon",
      category: "story",
      rarity: "rare",
      arcIds: ["arc1_ep1"],
    },
    {
      id: "badge_kai_beaten",
      displayName: "Showdown at the Hideout",
      description: "Defeated Kai Hiwatari in the Blade Sharks' warehouse. The city is safe — for now.",
      iconAssetId: "badge_icon_flame",
      category: "battle",
      rarity: "rare",
      arcIds: ["arc1_ep1"],
    },
    {
      id: "badge_max_beaten",
      displayName: "Defence Buster",
      description: "Broke through Max Tate's famous defence-type strategy. He's your friend AND your rival.",
      iconAssetId: "badge_icon_shield_break",
      category: "battle",
      rarity: "uncommon",
      arcIds: ["arc1_ep1"],
    },
    {
      id: "badge_tournament_invite",
      displayName: "Dickinson's Invitation",
      description: "Earned an invitation to the Seaside Dome Invitational from Mr. Dickinson himself. The world is watching.",
      iconAssetId: "badge_icon_trophy",
      category: "story",
      rarity: "rare",
      arcIds: ["arc1_ep1"],
    },
  ];

  for (const b of badges) await put("rpg_badges", b.id, b);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 10 — PART TRIGGERS  (Dragoon-S parts scattered across Beigoma)
// ═══════════════════════════════════════════════════════════════════════════════
async function seedPartTriggers() {
  console.log("\n🔩  Part Triggers");

  const partTriggers = [
    {
      mapId: "beigoma_park",
      triggerId: "trig_part_attack_ring",
      triggerRect: { x: 5, y: 14, width: 2, height: 2 },
      storyEventId: "ev_part_attack_ring_found",
      triggerCondition: { all: ["new_bey_scene_done"], none: ["part_attack_ring_found"] },
    },
    {
      mapId: "river_side",
      triggerId: "trig_part_weight_disk",
      triggerRect: { x: 25, y: 10, width: 2, height: 2 },
      storyEventId: "ev_part_weight_disk_found",
      triggerCondition: { all: ["new_bey_scene_done"], none: ["part_weight_disk_found"] },
    },
    {
      mapId: "granger_dojo",
      triggerId: "trig_part_spin_gear",
      triggerRect: { x: 5, y: 5, width: 2, height: 2 },
      storyEventId: "ev_part_spin_gear_found",
      triggerCondition: { all: ["new_bey_scene_done"], none: ["part_spin_gear_found"] },
    },
    {
      mapId: "apartment_1f",
      triggerId: "trig_part_blade_base",
      triggerRect: { x: 2, y: 2, width: 2, height: 2 },
      storyEventId: "ev_part_blade_base_found",
      triggerCondition: { all: ["new_bey_scene_done"], none: ["part_blade_base_found"] },
    },
  ];

  // Patch the triggers into their respective map docs
  for (const pt of partTriggers) {
    if (DRY) { console.log(`  [dry] patch trigger ${pt.triggerId} → rpg_maps/${pt.mapId}`); continue; }
    const mapRef  = db.collection("rpg_maps").doc(pt.mapId);
    const mapSnap = await mapRef.get();
    if (!mapSnap.exists) { console.warn(`  ⚠  Map ${pt.mapId} not found — skipping part trigger`); continue; }
    const existing  = mapSnap.data().eventTriggers ?? [];
    const alreadyIn = existing.some(t => t.id === pt.triggerId);
    if (alreadyIn) { console.log(`  ↩  Trigger ${pt.triggerId} already in ${pt.mapId}`); continue; }
    await mapRef.update({
      eventTriggers: admin.firestore.FieldValue.arrayUnion({
        id: pt.triggerId,
        triggerRect: pt.triggerRect,
        storyEventId: pt.storyEventId,
        triggerCondition: pt.triggerCondition,
        triggerOnce: true, triggerMode: "interact",
      }),
    });
    console.log(`  ✔  Patched trigger ${pt.triggerId} into ${pt.mapId}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`\n${"═".repeat(60)}`);
  console.log("  Arc 1 Episode 1 — Let It Rip!  (seed)");
  console.log(`  Mode: ${DRY ? "DRY RUN" : "LIVE"}`);
  console.log(`${"═".repeat(60)}`);

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

  console.log(`\n${"═".repeat(60)}`);
  console.log("  ✅  Arc 1 Episode 1 seed complete.");
  console.log(`${"═".repeat(60)}\n`);
}

main().catch(err => { console.error("❌", err); process.exit(1); });

/**
 * scripts/seed-rpg-core.js
 *
 * Seeds the minimum 8 RPG Firestore collections required for a complete
 * playable loop:
 *   rpg_arcs, rpg_routes, rpg_regions, rpg_maps, rpg_npcs,
 *   rpg_dialogues, rpg_quests, rpg_story_events
 *
 * Idempotent — safe to re-run (uses setDoc with merge: true).
 * Run: node scripts/seed-rpg-core.js
 */

require("dotenv").config();
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue }     = require("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:  (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

// ── 1. Arc ──────────────────────────────────────────────────────────────────
const ARC = {
  id:          "arc_001",
  name:        "The Spinning Beginning",
  description: "A young blader's first steps into the world of Beyblade.",
  order:       1,
  routeIds:    ["route_001"],
  isUnlocked:  true,
  levelCap:    10,
  createdAt:   FieldValue.serverTimestamp(),
};

// ── 2. Route ─────────────────────────────────────────────────────────────────
const ROUTE = {
  id:          "route_001",
  arcId:       "arc_001",
  name:        "Rookie Blader",
  description: "Follow the path of a new challenger.",
  protagonistName: "Nova",
  regionIds:   ["region_001"],
  order:       1,
  isDefault:   true,
  createdAt:   FieldValue.serverTimestamp(),
};

// ── 3. Region ─────────────────────────────────────────────────────────────────
const REGION = {
  id:          "region_001",
  routeId:     "route_001",
  name:        "Starter Town",
  description: "The peaceful starting town where young bladers gather.",
  mapIds:      ["map_001"],
  isUnlocked:  true,
  order:       1,
  tileSize:    16,
  createdAt:   FieldValue.serverTimestamp(),
};

// ── 4. Map ────────────────────────────────────────────────────────────────────
const MAP = {
  id:          "map_001",
  regionId:    "region_001",
  name:        "Starter Town Plaza",
  mapType:     "town",
  width:       20,
  height:      15,
  tileSize:    16,
  // Simple walkable layout: 0=walkable, 1=wall
  tileData:    Array(15).fill(null).map((_, row) =>
    Array(20).fill(null).map((_, col) => (row === 0 || row === 14 || col === 0 || col === 19) ? 1 : 0)
  ),
  spawnTile:   { x: 10, y: 7 },
  spawnFacing: "down",
  npcs: [
    { npcId: "npc_rival_001", tile: { x: 10, y: 5 }, facing: "down" },
  ],
  exits: [],
  bgColor:     "#4a7c59",
  createdAt:   FieldValue.serverTimestamp(),
};

// ── 5. NPC ────────────────────────────────────────────────────────────────────
const NPC = {
  id:           "npc_rival_001",
  name:         "Ryo",
  npcType:      "rival",
  portraitUrl:  null,
  mapId:        "map_001",
  tile:         { x: 10, y: 5 },
  facing:       "down",
  dialogueId:   "dlg_ryo_intro",
  questId:      "quest_001",
  battleConfig: {
    beybladeId:    "storm_pegasus_105rf",
    arenaId:       "default_black_arena",
    aiDifficulty:  "medium",
    bestOf:        1,
  },
  isBossEncounter: false,
  interactTrigger: "interact",
  createdAt:    FieldValue.serverTimestamp(),
};

// ── 6. Dialogue ───────────────────────────────────────────────────────────────
const DIALOGUE = {
  id: "dlg_ryo_intro",
  npcId: "npc_rival_001",
  nodes: [
    {
      id:       "node_01",
      type:     "text",
      speakerId: "Ryo",
      text:     "Hey! I heard you're a new blader around here. I'm Ryo — wanna battle?",
      next:     "node_02",
    },
    {
      id:       "node_02",
      type:     "choice",
      speakerId: "Nova",
      text:     "(What do you say?)",
      choices:  [
        { id: "yes", label: "Sure, let's go!", next: "node_03" },
        { id: "no",  label: "Maybe later...", next: "node_04" },
      ],
    },
    {
      id:       "node_03",
      type:     "text",
      speakerId: "Ryo",
      text:     "Awesome! Show me what you've got! Let It Rip!",
      triggerBattle: true,
      next:     null,
    },
    {
      id:       "node_04",
      type:     "text",
      speakerId: "Ryo",
      text:     "No worries — I'll be here whenever you're ready.",
      next:     null,
    },
  ],
  createdAt: FieldValue.serverTimestamp(),
};

// ── 7. Quest ──────────────────────────────────────────────────────────────────
const QUEST = {
  id:          "quest_001",
  title:       "First Battle",
  description: "Defeat the rival blader Ryo in your first official battle.",
  questCategory: "main",
  arcId:       "arc_001",
  routeId:     "route_001",
  objectives:  [
    {
      id:      "obj_01",
      type:    "defeat_npc",
      npcId:   "npc_rival_001",
      label:   "Defeat Ryo in battle",
      count:   1,
    },
  ],
  rewards: {
    xp:    50,
    money: 100,
    items: [],
  },
  unlocks:     [],
  isMainQuest: true,
  order:       1,
  createdAt:   FieldValue.serverTimestamp(),
};

// ── 8. Story Event ────────────────────────────────────────────────────────────
const STORY_EVENT = {
  id:           "story_event_001",
  title:        "Ryo Intro",
  arcId:        "arc_001",
  routeId:      "route_001",
  triggerMode:  "interact",
  triggerNpcId: "npc_rival_001",
  mapId:        "map_001",
  actions: [
    { type: "start_dialogue", dialogueId: "dlg_ryo_intro" },
    { type: "activate_quest", questId: "quest_001" },
  ],
  completedBy:  "quest_001",
  order:        1,
  createdAt:    FieldValue.serverTimestamp(),
};

// ─────────────────────────────────────────────────────────────────────────────

async function seed(collectionName, doc) {
  const ref = db.collection(collectionName).doc(doc.id);
  await ref.set(doc, { merge: true });
  console.log(`  ✓ ${collectionName}/${doc.id}`);
}

async function main() {
  console.log("Seeding RPG core collections...\n");

  await seed("rpg_arcs",          ARC);
  await seed("rpg_routes",        ROUTE);
  await seed("rpg_regions",       REGION);
  await seed("rpg_maps",          MAP);
  await seed("rpg_npcs",          NPC);
  await seed("rpg_dialogues",     DIALOGUE);
  await seed("rpg_quests",        QUEST);
  await seed("rpg_story_events",  STORY_EVENT);

  console.log("\n✅ RPG core seed complete — 1 full playable loop: arc → route → region → map → NPC → dialogue → quest → story event.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});

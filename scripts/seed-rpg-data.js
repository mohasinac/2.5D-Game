// scripts/seed-rpg-data.js
// Seeds all RPG collections into Firestore in dependency order.
// Run: node scripts/seed-rpg-data.js [--dry-run]
// npm run seed:rpg-data -- [--dry-run]
// Idempotent — uses set() with { merge: true }, safe to re-run.

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

const DRY_RUN = process.argv.includes("--dry-run");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const now = new Date().toISOString();

async function seedDoc(collectionPath, docId, data) {
  if (DRY_RUN) {
    console.log(`    [dry-run] ${collectionPath}/${docId}`);
    return;
  }
  await db.collection(collectionPath).doc(docId).set(
    { ...data, updatedAt: now },
    { merge: true }
  );
}

async function seedCollection(collectionName, docs) {
  console.log(`\n  📦 ${collectionName} (${docs.length} docs)`);
  for (const doc of docs) {
    await seedDoc(collectionName, doc.id, doc);
    if (!DRY_RUN) {
      console.log(`    ✔ ${doc.id}${doc.displayName ? ` — ${doc.displayName}` : doc.label ? ` — ${doc.label}` : ""}`);
    }
  }
}

// ─── 1. rpg_config ────────────────────────────────────────────────────────────

const RPG_CONFIG = [
  {
    _docId: "leveling",
    maxPlayerLevel: 50,
    maxBeybladeLevel: 20,
    xpCurve: [
      100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000,
      4900, 5900, 7000, 8200, 9600, 11200, 13000, 15000, 17500, 20500,
      24000, 28000, 32500, 37500, 43000, 49000, 55500, 62500, 70000, 78000,
      86500, 95500, 105000, 115000, 126000, 138000, 151000, 165000, 180000, 196000,
      213000, 231000, 250000, 270000, 291000, 313000, 336000, 360000, 385000,
    ],
  },
  {
    _docId: "world",
    startArcId: "season1",
    startRouteChoices: ["tyson", "kai"],
  },
];

// ─── 2. Open definition collections ──────────────────────────────────────────

function defsFrom(entries) {
  return entries.map(([id, label, description]) => ({ id, label, description }));
}

const RPG_MAP_TYPE_DEFS = defsFrom([
  ["city",        "City",        "Urban area with shops, NPCs, and battle spots."],
  ["route",       "Route",       "Connecting path between locations."],
  ["school",      "School",      "Educational facility; often a tutorial area."],
  ["park",        "Park",        "Public park — popular street-battle venue."],
  ["blade-shop",  "Blade Shop",  "Store selling beyblade parts and accessories."],
  ["gym",         "Gym",         "Training facility for improving beyblade skills."],
  ["stadium",     "Stadium",     "Official tournament stadium."],
  ["forest",      "Forest",      "Wooded area with hidden paths and wild encounters."],
  ["mountain",    "Mountain",    "Highland area — difficult terrain, strong bladers."],
  ["laboratory",  "Laboratory",  "Research lab — often tied to story events."],
  ["secret",      "Secret",      "Hidden location unlocked by special conditions."],
  ["dojo",        "Dojo",        "Traditional training hall for advanced bladers."],
]);

const RPG_NPC_TYPE_DEFS = defsFrom([
  ["blader",           "Blader",           "A beyblade battler you can challenge."],
  ["rival",            "Rival",            "A recurring rival character."],
  ["trainer",          "Trainer",          "Someone who teaches skills or techniques."],
  ["shopkeeper",       "Shopkeeper",       "Runs a shop — buy/sell items and parts."],
  ["story",            "Story",            "Key story NPC — drives the narrative."],
  ["boss",             "Boss",             "Powerful opponent marking a milestone."],
  ["tournament-judge", "Tournament Judge", "Officiates tournament battles."],
  ["quest-giver",      "Quest Giver",      "Offers quests and tasks to the player."],
  ["background",       "Background",       "Ambient NPC with no gameplay function."],
]);

const RPG_BADGE_CATEGORY_DEFS = defsFrom([
  ["street",             "Street",             "Earned from street battles."],
  ["regional-qualifier", "Regional Qualifier", "Earned from regional qualifier events."],
  ["tournament",         "Tournament",         "Earned from official tournaments."],
  ["arc",                "Arc",                "Story arc milestone badge."],
  ["hidden",             "Hidden",             "Secret badge — earned from hidden conditions."],
]);

const RPG_ITEM_CATEGORY_DEFS = defsFrom([
  ["consumable",     "Consumable",     "Single-use item consumed on use."],
  ["key-item",       "Key Item",       "Important item that cannot be sold or discarded."],
  ["beyblade-part",  "Beyblade Part",  "A physical beyblade component."],
  ["launcher",       "Launcher",       "Launch device for beyblades."],
  ["bit-chip",       "Bit-Chip",       "Sacred chip containing a bit-beast spirit."],
  ["trophy",         "Trophy",         "Award for tournament victories."],
  ["accessory",      "Accessory",      "Equippable accessory for stat bonuses."],
]);

const RPG_QUEST_CATEGORY_DEFS = defsFrom([
  ["main",       "Main",       "Main story quest — advances the primary narrative."],
  ["side",       "Side",       "Optional side quest for rewards and lore."],
  ["rival",      "Rival",      "Rival-related quest chain."],
  ["tournament", "Tournament", "Tournament entry and progression quest."],
  ["hidden",     "Hidden",     "Secret quest — discovered through exploration."],
]);

const RPG_EVENT_CATEGORY_DEFS = defsFrom([
  ["shared",      "Shared",      "Event experienced by all routes."],
  ["perspective", "Perspective", "Event shown differently depending on route."],
  ["rival",       "Rival",       "Event triggered by rival interactions."],
  ["hidden",      "Hidden",      "Secret event — triggered by hidden conditions."],
]);

const RPG_TRAVEL_MODE_DEFS = defsFrom([
  ["walk",      "Walk",      "Travel on foot between connected locations."],
  ["transport", "Transport", "Travel via bus, train, or car."],
  ["fly",       "Fly",       "Air travel between distant regions."],
  ["boat",      "Boat",      "Sea travel between coastal regions."],
]);

// ─── 3. rpg_arcs ─────────────────────────────────────────────────────────────

const RPG_ARCS = [
  {
    id: "season1",
    displayName: "Season 1 - Let It Rip",
    order: 1,
    routeIds: ["tyson", "kai"],
    startingRegionId: "japan",
    completionFlagId: "season1_complete",
    description: "The original Beyblade saga. Compete in regional tournaments across the world to become the world champion.",
  },
];

// ─── 4. rpg_routes ───────────────────────────────────────────────────────────

const RPG_ROUTES = [
  {
    id: "tyson",
    displayName: "Tyson Route",
    protagonistNpcId: "tyson",
    description: "Follow Tyson Granger's journey from backyard blader to world champion.",
    startingMapId: "bakuten-city-east",
    startingTile: { x: 5, y: 8 },
    startingFacing: "down",
    startingBeybladeId: "dragoon_s",
    cardImageAssetId: "tyson_route_card",
    availableInArcs: ["season1"],
  },
  {
    id: "kai",
    displayName: "Kai Route",
    protagonistNpcId: "kai",
    description: "Experience the story through Kai Hiwatari's perspective — the lone wolf seeking the ultimate power.",
    startingMapId: "voltaire-fortress-entrance",
    startingTile: { x: 10, y: 3 },
    startingFacing: "down",
    startingBeybladeId: "dranzer_s",
    cardImageAssetId: "kai_route_card",
    availableInArcs: ["season1"],
  },
];

// ─── 5. rpg_regions ──────────────────────────────────────────────────────────

const RPG_REGIONS = [
  {
    id: "japan",
    displayName: "Japan",
    country: "Japan",
    description: "Home of the Bladebreakers. Bakuten City, BBA HQ, and surrounding areas.",
    mapIds: ["bakuten-city-east", "bakuten-city-west", "bba-hq", "park-district", "bakuten-school", "blade-shop-east", "mountain-pass", "seaside-dome"],
    hubMapId: "bakuten-city-east",
    connections: [
      { targetRegionId: "china", gate: { flags: { all: { season1_japan_complete: true } } }, travelMode: "transport" },
      { targetRegionId: "usa",   gate: { flags: { all: { season1_japan_complete: true } } }, travelMode: "transport" },
    ],
    worldMapTile: { x: 7, y: 3 },
    bgmTrackId: "bgm_japan",
    arcIds: ["season1"],
  },
  {
    id: "china",
    displayName: "China",
    country: "China",
    description: "Land of the White Tigers. Ancient dojos and fierce mountain bladers.",
    mapIds: ["white-tiger-village", "white-tiger-dojo", "mountain-temple", "china-stadium"],
    hubMapId: "white-tiger-village",
    connections: [
      { targetRegionId: "japan", travelMode: "transport" },
      { targetRegionId: "russia", gate: { flags: { all: { season1_china_complete: true } } }, travelMode: "transport" },
    ],
    worldMapTile: { x: 6, y: 3 },
    bgmTrackId: "bgm_china",
    arcIds: ["season1"],
  },
  {
    id: "usa",
    displayName: "USA",
    country: "USA",
    description: "Home of the All Starz. BBA America headquarters and urban battle arenas.",
    mapIds: ["bba-america", "central-park-arena", "usa-stadium"],
    hubMapId: "bba-america",
    connections: [
      { targetRegionId: "japan", travelMode: "transport" },
      { targetRegionId: "russia", gate: { flags: { all: { season1_usa_complete: true } } }, travelMode: "transport" },
    ],
    worldMapTile: { x: 2, y: 3 },
    bgmTrackId: "bgm_usa",
    arcIds: ["season1"],
  },
  {
    id: "russia",
    displayName: "Russia",
    country: "Russia",
    description: "Voltaire's domain. The Demolition Boys' fortress and the final tournament.",
    mapIds: ["voltaire-fortress-entrance", "voltaire-fortress-arena", "moscow-stadium", "biovolt-lab"],
    hubMapId: "voltaire-fortress-entrance",
    connections: [
      { targetRegionId: "japan", travelMode: "transport" },
    ],
    worldMapTile: { x: 5, y: 1 },
    bgmTrackId: "bgm_russia",
    arcIds: ["season1"],
  },
];

// ─── 6. rpg_items ────────────────────────────────────────────────────────────

const RPG_ITEMS = [
  {
    id: "potion_spin",
    displayName: "Spin Potion",
    description: "Restores a small amount of beyblade spin energy.",
    category: "consumable",
    iconAssetId: "item_potion_spin",
    stackable: true,
    maxStack: 99,
    usable: true,
    useEffect: { type: "heal-stamina", value: 20 },
    sellPrice: 50,
    buyPrice: 100,
    questRelated: false,
  },
  {
    id: "bba_pass",
    displayName: "BBA Tournament Pass",
    description: "Official pass granting entry to BBA sanctioned tournaments.",
    category: "key-item",
    iconAssetId: "item_bba_pass",
    stackable: false,
    usable: false,
    sellPrice: 0,
    buyPrice: 0,
    questRelated: true,
  },
  {
    id: "dragoon_chip",
    displayName: "Dragoon Bit-Chip",
    description: "A sacred bit-chip containing the spirit of Dragoon.",
    category: "bit-chip",
    iconAssetId: "item_dragoon_chip",
    stackable: false,
    usable: false,
    sellPrice: 0,
    buyPrice: 0,
    questRelated: true,
  },
];

// ─── 7. rpg_badges ───────────────────────────────────────────────────────────

const RPG_BADGES = [
  {
    id: "badge_carlos_defeated",
    displayName: "Carlos Badge",
    description: "Defeated Carlos in a street battle.",
    iconAssetId: "badge_carlos",
    category: "street",
    regionId: "japan",
    arcId: "season1",
    earnCondition: { type: "defeat-npc", targetId: "carlos" },
    order: 1,
  },
  {
    id: "badge_billy_defeated",
    displayName: "Billy Badge",
    description: "Defeated Billy in a street battle.",
    iconAssetId: "badge_billy",
    category: "street",
    regionId: "japan",
    arcId: "season1",
    earnCondition: { type: "defeat-npc", targetId: "billy" },
    order: 2,
  },
  {
    id: "badge_seaside_dome",
    displayName: "Seaside Dome Champion",
    description: "Won the Seaside Dome Tournament.",
    iconAssetId: "badge_seaside_dome",
    category: "tournament",
    regionId: "japan",
    arcId: "season1",
    earnCondition: { type: "win-tournament", targetId: "seaside_dome_open" },
    order: 3,
  },
  {
    id: "badge_kai_returned",
    displayName: "Kai's Return",
    description: "Kai rejoined the Bladebreakers.",
    iconAssetId: "badge_kai_return",
    category: "arc",
    arcId: "season1",
    earnCondition: { type: "story-event", targetId: "kai_returns_to_team" },
    order: 10,
  },
];

// ─── 8. rpg_dialogues ────────────────────────────────────────────────────────

const RPG_DIALOGUES = [
  {
    id: "kenny_intro",
    startNodeId: "n1",
    nodes: {
      n1: { id: "n1", type: "speech", speakerId: "kenny", text: "Hey! You're the new blader everyone's been talking about!", nextNodeId: "n2" },
      n2: { id: "n2", type: "speech", speakerId: "kenny", text: "I'm Kenny — I analyze beyblade data with my laptop Dizzi.", nextNodeId: "n3" },
      n3: {
        id: "n3", type: "choice", speakerId: "kenny", text: "Want me to show you around Bakuten City?",
        choices: [
          { id: "c1", label: "Sure, let's go!", nextNodeId: "n4" },
          { id: "c2", label: "Maybe later.", nextNodeId: "n5" },
        ],
      },
      n4: { id: "n4", type: "trigger", speakerId: "kenny", text: "Great! Follow me to the BBA HQ — that's where all the action is!", triggerEventId: "kenny_tour_start", nextNodeId: "end" },
      n5: { id: "n5", type: "end", speakerId: "kenny", text: "No problem! Come find me when you're ready." },
    },
  },
  {
    id: "carlos_challenge",
    startNodeId: "n1",
    nodes: {
      n1: { id: "n1", type: "speech", speakerId: "carlos", text: "Hey you! Think you can blade? Let's see what you've got!", nextNodeId: "n2" },
      n2: {
        id: "n2", type: "choice", speakerId: "carlos", text: "Ready to battle?",
        choices: [
          { id: "c1", label: "Bring it on!", nextNodeId: "n3" },
          { id: "c2", label: "Not now.", nextNodeId: "n4" },
        ],
      },
      n3: { id: "n3", type: "trigger", speakerId: "carlos", text: "Hah! Let it rip!", triggerEventId: "carlos_battle_start" },
      n4: { id: "n4", type: "end", speakerId: "carlos", text: "Chicken! Come back when you grow a spine." },
    },
  },
];

// ─── 9. rpg_npcs ─────────────────────────────────────────────────────────────

const RPG_NPCS = [
  {
    id: "kenny",
    displayName: "Kenny",
    type: "quest-giver",
    spriteSheetId: "kenny_sprite",
    portraitId: "kenny_portrait",
    defaultFacing: "down",
    schedule: [
      { timeSlot: "morning",   mapId: "bakuten-city-east", tile: { x: 8, y: 6 }, facing: "down" },
      { timeSlot: "afternoon", mapId: "bba-hq",            tile: { x: 5, y: 4 }, facing: "right" },
    ],
    defaultDialogueId: "kenny_intro",
    questIds: ["quest_kenny_tour"],
  },
  {
    id: "carlos",
    displayName: "Carlos",
    type: "blader",
    spriteSheetId: "carlos_sprite",
    portraitId: "carlos_portrait",
    defaultFacing: "left",
    schedule: [
      { timeSlot: "morning", mapId: "park-district", tile: { x: 6, y: 10 }, facing: "left" },
    ],
    defaultDialogueId: "carlos_challenge",
    battleConfig: {
      beybladeId: "carlos_bey",
      arenaId: "park_arena",
      difficulty: "easy",
      introDialogueId: "carlos_challenge",
      victoryDialogueId: "carlos_victory",
      defeatDialogueId: "carlos_defeat",
      canRematch: true,
      xpReward: { playerXP: 50, beybladeXP: 30 },
      awardsBadgeId: "badge_carlos_defeated",
    },
  },
];

// ─── 10. rpg_quests ──────────────────────────────────────────────────────────

const RPG_QUESTS = [
  {
    id: "quest_kenny_tour",
    title: "Welcome to Bakuten",
    description: "Kenny wants to show you around. Visit the BBA HQ.",
    arcId: "season1",
    category: "main",
    prerequisites: [],
    objectives: [
      { id: "obj1", type: "reach-map", targetId: "bba-hq", description: "Visit BBA HQ", optional: false },
    ],
    rewards: {
      reputation: 10,
      setFlags: { kenny_tour_complete: true },
      xp: { playerXP: 25 },
    },
  },
  {
    id: "quest_defeat_carlos",
    title: "Street Challenge: Carlos",
    description: "Carlos challenged you to a beyblade battle in the park.",
    arcId: "season1",
    category: "side",
    prerequisites: [],
    objectives: [
      { id: "obj1", type: "defeat-npc", targetId: "carlos", description: "Defeat Carlos in battle", optional: false },
    ],
    rewards: {
      reputation: 15,
      items: [{ itemId: "potion_spin", quantity: 3 }],
      xp: { playerXP: 50, beybladeXP: 30 },
    },
  },
];

// ─── 11. rpg_maps ────────────────────────────────────────────────────────────

// 20x15 grids. 0 = walkable, 1 = blocked.
function createGrid(width, height, blocked) {
  const grid = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(0);
    }
    grid.push(row);
  }
  // Set border walls
  for (let x = 0; x < width; x++) {
    grid[0][x] = 1;
    grid[height - 1][x] = 1;
  }
  for (let y = 0; y < height; y++) {
    grid[y][0] = 1;
    grid[y][width - 1] = 1;
  }
  // Set additional blocked tiles
  for (const [bx, by] of blocked) {
    if (by >= 0 && by < height && bx >= 0 && bx < width) {
      grid[by][bx] = 1;
    }
  }
  return grid;
}

const RPG_MAPS = [
  {
    id: "bakuten-city-east",
    displayName: "Bakuten City - East Side",
    type: "city",
    regionId: "japan",
    width: 20,
    height: 15,
    collisionGrid: createGrid(20, 15, [
      // Buildings (blocks of impassable tiles)
      [3, 3], [4, 3], [5, 3], [3, 4], [4, 4], [5, 4],      // building top-left
      [12, 3], [13, 3], [14, 3], [12, 4], [13, 4], [14, 4], // building top-right
      [8, 7], [9, 7], [10, 7], [11, 7],                      // central wall
      [3, 10], [4, 10], [5, 10], [3, 11], [4, 11], [5, 11], // building bottom-left
    ]),
    exits: [
      { targetMapId: "bakuten-city-west", edge: "west", tile: { x: 0, y: 7 }, targetTile: { x: 18, y: 7 } },
      { targetMapId: "park-district",     edge: "south", tile: { x: 10, y: 14 }, targetTile: { x: 10, y: 1 } },
    ],
    npcPlacements: [
      { npcId: "kenny", tile: { x: 8, y: 6 }, facing: "down" },
    ],
    bgmTrackId: "bgm_bakuten_city",
    encounterRate: 0,
  },
  {
    id: "park-district",
    displayName: "Park District",
    type: "park",
    regionId: "japan",
    width: 20,
    height: 15,
    collisionGrid: createGrid(20, 15, [
      // Trees and benches
      [4, 4], [5, 4], [14, 4], [15, 4],       // tree clusters top
      [3, 8], [4, 8],                           // bench area
      [15, 8], [16, 8],                         // bench area right
      [8, 11], [9, 11], [10, 11], [11, 11],    // fountain
      [8, 12], [9, 12], [10, 12], [11, 12],    // fountain base
    ]),
    exits: [
      { targetMapId: "bakuten-city-east", edge: "north", tile: { x: 10, y: 0 }, targetTile: { x: 10, y: 13 } },
    ],
    npcPlacements: [
      { npcId: "carlos", tile: { x: 6, y: 10 }, facing: "left" },
    ],
    bgmTrackId: "bgm_park",
    encounterRate: 0,
  },
];

// ─── 12. rpg_story_events ────────────────────────────────────────────────────

const RPG_STORY_EVENTS = [
  {
    id: "intro_arrival",
    displayName: "Arrival in Bakuten",
    arcId: "season1",
    category: "shared",
    triggerCondition: { none: { intro_seen: true } },
    triggerOnce: true,
    blocksPlayerInput: true,
    steps: [
      { type: "lock-player" },
      { type: "dialogue", dialogueId: "kenny_intro" },
      { type: "set-flag", flags: { intro_seen: true } },
      { type: "unlock-player" },
    ],
    completionFlags: { intro_seen: true },
  },
];

// ─── Main seed function ──────────────────────────────────────────────────────

async function seedRPGData() {
  console.log("\n══════════════════════════════════════");
  console.log("  RPG Data Seed" + (DRY_RUN ? " [DRY RUN]" : ""));
  console.log("══════════════════════════════════════");

  // 1. rpg_config (special — doc IDs come from _docId field)
  console.log(`\n  📦 rpg_config (${RPG_CONFIG.length} docs)`);
  for (const cfg of RPG_CONFIG) {
    const { _docId, ...data } = cfg;
    await seedDoc("rpg_config", _docId, data);
    if (!DRY_RUN) console.log(`    ✔ ${_docId}`);
    else console.log(`    [dry-run] rpg_config/${_docId}`);
  }

  // 2. Open definition collections
  await seedCollection("rpg_map_type_defs",      RPG_MAP_TYPE_DEFS);
  await seedCollection("rpg_npc_type_defs",      RPG_NPC_TYPE_DEFS);
  await seedCollection("rpg_badge_category_defs", RPG_BADGE_CATEGORY_DEFS);
  await seedCollection("rpg_item_category_defs",  RPG_ITEM_CATEGORY_DEFS);
  await seedCollection("rpg_quest_category_defs", RPG_QUEST_CATEGORY_DEFS);
  await seedCollection("rpg_event_category_defs", RPG_EVENT_CATEGORY_DEFS);
  await seedCollection("rpg_travel_mode_defs",    RPG_TRAVEL_MODE_DEFS);

  // 3. rpg_arcs
  await seedCollection("rpg_arcs", RPG_ARCS);

  // 4. rpg_routes
  await seedCollection("rpg_routes", RPG_ROUTES);

  // 5. rpg_regions
  await seedCollection("rpg_regions", RPG_REGIONS);

  // 6. rpg_items
  await seedCollection("rpg_items", RPG_ITEMS);

  // 7. rpg_badges
  await seedCollection("rpg_badges", RPG_BADGES);

  // 8. rpg_dialogues
  await seedCollection("rpg_dialogues", RPG_DIALOGUES);

  // 9. rpg_npcs
  await seedCollection("rpg_npcs", RPG_NPCS);

  // 10. rpg_quests
  await seedCollection("rpg_quests", RPG_QUESTS);

  // 11. rpg_maps
  await seedCollection("rpg_maps", RPG_MAPS);

  // 12. rpg_story_events
  await seedCollection("rpg_story_events", RPG_STORY_EVENTS);

  // Summary
  const total = RPG_CONFIG.length
    + RPG_MAP_TYPE_DEFS.length + RPG_NPC_TYPE_DEFS.length
    + RPG_BADGE_CATEGORY_DEFS.length + RPG_ITEM_CATEGORY_DEFS.length
    + RPG_QUEST_CATEGORY_DEFS.length + RPG_EVENT_CATEGORY_DEFS.length
    + RPG_TRAVEL_MODE_DEFS.length
    + RPG_ARCS.length + RPG_ROUTES.length + RPG_REGIONS.length
    + RPG_ITEMS.length + RPG_BADGES.length + RPG_DIALOGUES.length
    + RPG_NPCS.length + RPG_QUESTS.length + RPG_MAPS.length
    + RPG_STORY_EVENTS.length;

  console.log(`\n✅ Seeded ${total} docs across 14 RPG collections${DRY_RUN ? " [DRY RUN — nothing written]" : ""}\n`);
}

// ─── Export + direct run ─────────────────────────────────────────────────────

module.exports = { seedRPGData };

seedRPGData()
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => process.exit(0));

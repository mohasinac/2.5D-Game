// ─────────────────────────────────────────────────────────────────────────────
// RPG Framework — Canonical Type Definitions
// All game data types live here. Every system imports from this file.
// String-typed IDs (ArcId, RouteId, MapType, etc.) are backed by Firestore
// definition collections — new values = new documents, zero code changes.
// ─────────────────────────────────────────────────────────────────────────────

// ── Spatial ───────────────────────────────────────────────────────────────────
export interface TileCoord  { x: number; y: number; }
export interface WorldCoord { x: number; y: number; }
export interface TileRect   { x: number; y: number; width: number; height: number; }
export type FacingDirection = "up" | "down" | "left" | "right";
export type TimeSlot = "morning" | "afternoon" | "evening" | "night" | "tournament";

// ── Open Definition String Types ─────────────────────────────────────────────
// Valid values come from Firestore definition collections — no closed enums.
export type MapType       = string; // rpg_map_type_defs
export type NPCType       = string; // rpg_npc_type_defs
export type BadgeCategory = string; // rpg_badge_category_defs
export type ItemCategory  = string; // rpg_item_category_defs
export type ArcId         = string; // rpg_arcs
export type RouteId       = string; // rpg_routes

// ── Protagonist Definition ────────────────────────────────────────────────────
// Used for multi-protagonist tournament battles (Kenny, Max, Tyson etc.)
export interface ProtagonistDef {
  npcId: string;
  beybladeId: string;
  displayName: string;
  /** If true the player controls this battle. If false it auto-resolves as a win. */
  playerControlled: boolean;
}

// ── Arc (Generation) Definition — rpg_arcs ───────────────────────────────────
export interface ArcDef {
  id: ArcId;
  displayName: string;
  order: number;
  routeIds: RouteId[];
  startingRegionId: string;
  previousArcId?: string;
  completionFlagId: string;
  description: string;
  /**
   * Hard level cap while this arc is active. XP still accumulates but the
   * displayed level and gate checks are clamped to this value, keeping AI
   * difficulty balanced. Set null / omit to use MAX_PLAYER_LEVEL.
   */
  levelCap?: number;
  /**
   * If true, this arc uses team-match scoring (Arc 2+).
   * Team points are tracked separately in the store.
   */
  teamBattles?: boolean;
  /** Ordered list of protagonist definitions for tournament-mode arcs. */
  protagonists?: ProtagonistDef[];
}

// ── Route Definition — rpg_routes ────────────────────────────────────────────
export interface RouteDef {
  id: RouteId;
  displayName: string;
  protagonistNpcId: string;
  description: string;
  startingMapId: string;
  startingTile: TileCoord;
  startingFacing: FacingDirection;
  startingBeybladeId: string;
  cardImageAssetId: string;
  availableInArcs: ArcId[];
}

// ── Map ───────────────────────────────────────────────────────────────────────
export type MapLayer = "ground" | "decoration" | "collision" | "above" | "events";

export interface TileLayer {
  name: MapLayer;
  width: number;
  height: number;
  data: number[];
  visible: boolean;
}

export interface MapExit {
  id: string;
  triggerRect: TileRect;
  targetMapId: string;
  targetEntryId: string;
  direction: "north" | "south" | "east" | "west" | "warp";
  transitionType: "walk" | "warp" | "door" | "cave";
}

export interface MapEntryPoint {
  id: string;
  tile: TileCoord;
  facingDirection: FacingDirection;
}

export interface MapEventTrigger {
  id: string;
  triggerRect: TileRect;
  storyEventId: string;
  triggerCondition?: FlagCondition;
  gate?: GateCondition;
  triggerOnce: boolean;
  triggerMode: "enter" | "interact" | "step";
}

export interface MapNPCPlacement {
  npcId: string;
  spawnTile: TileCoord;
  scheduleOverride?: string;
}

export interface RPGMap {
  id: string;
  regionId: string;
  displayName: string;
  type: MapType;
  width: number;
  height: number;
  tilesetId: string;
  layers: TileLayer[];
  exits: MapExit[];
  entryPoints: MapEntryPoint[];
  eventTriggers: MapEventTrigger[];
  npcPlacements: MapNPCPlacement[];
  bgmTrackId: string;
  ambientSfxId?: string;
  lightingPreset: "day" | "evening" | "night" | "indoor" | "cave";
  metaFlags?: Record<string, boolean>;
  /** URL to an uploaded background image (rendered behind tile layer). */
  bgImageUrl?: string;
  /** URL to the uploaded tileset sprite sheet image. */
  tilesetImageUrl?: string;
  /** If cloned from a template map, the source map id. */
  templateId?: string;
}

// ── NPC ───────────────────────────────────────────────────────────────────────
export interface NPCScheduleEntry {
  timeSlot: TimeSlot;
  mapId: string;
  tile: TileCoord;
  facing: FacingDirection;
  patrolPath?: TileCoord[];
  idleAnimation?: string;
}

export interface NPCBattleConfig {
  beybladeId: string;
  arenaId: string;
  difficulty: "easy" | "medium" | "hard" | "hell";
  introDialogueId: string;
  victoryDialogueId: string;
  defeatDialogueId: string;
  lockedDialogueId?: string;
  rematchDialogueId?: string;
  canRematch: boolean;
  /**
   * Count-based rematch cooldown. After the player beats this NPC, they must
   * fight this many OTHER battles before a rematch is available.
   * 0 / undefined = rematch immediately; 1-3 = short cooldown (Billy/random);
   * higher values for rivals like Carlos or Kai.
   */
  rematchCooldownBattles?: number;
  /**
   * XP awarded on loss (partial reward for effort). Defaults to 0.
   * Lets casual players still progress when grinding tough NPCs.
   */
  lossXpReward?: XPReward;
  /**
   * Flags set regardless of win/loss outcome. Use for story beats that must
   * advance no matter the result (e.g. Kai battle — story continues either way).
   */
  alwaysSetFlags?: Record<string, boolean>;
  gate?: GateCondition;
  rewardQuestId?: string;
  rewardFlags?: Record<string, boolean>;
  awardsBadgeId?: string;
  xpReward?: XPReward;
  /** Team points awarded on win (Arc 2 team matches). */
  teamPointsReward?: number;
}

export interface NPC {
  id: string;
  displayName: string;
  type: NPCType;
  spriteSheetId: string;
  portraitId: string;
  /** URL to uploaded sprite sheet image (overrides spriteSheetId asset lookup). */
  spriteUrl?: string;
  /** URL to uploaded portrait / face-card image (used in dialogue box). */
  portraitUrl?: string;
  defaultFacing: FacingDirection;
  schedule: NPCScheduleEntry[];
  defaultDialogueId: string;
  battleConfig?: NPCBattleConfig;
  shopInventoryId?: string;
  questIds?: string[];
  routeExclusiveFor?: RouteId;
  arcIds?: ArcId[];
  /**
   * Chase / catch mechanic. If set, this NPC chases the player during patrol.
   * When the player enters within `catchRadius` tiles (Chebyshev), the
   * `catchEventId` StoryEvent is fired (e.g. Grandpa catches Tyson in the dojo).
   */
  catchRadius?: number;
  catchEventId?: string;
  /** If cloned from a template NPC, the source NPC id. */
  templateId?: string;
}

// ── Dialogue ──────────────────────────────────────────────────────────────────
export interface FlagCondition {
  all?: Record<string, boolean>;
  any?: Record<string, boolean>;
  none?: Record<string, boolean>;
}

export interface DialogueChoice {
  id: string;
  label: string;
  nextNodeId: string;
  requiredFlag?: FlagCondition;
  setsFlags?: Record<string, boolean>;
  friendshipDelta?: number;
  reputationDelta?: number;
}

export interface DialogueNode {
  id: string;
  type: "speech" | "choice" | "branch" | "end" | "trigger";
  speakerId: string;
  text: string;
  portraitState?: string;
  choices?: DialogueChoice[];
  nextNodeId?: string;
  triggerEventId?: string;
  branchCondition?: FlagCondition;
  branchTrueNodeId?: string;
  branchFalseNodeId?: string;
  setsFlags?: Record<string, boolean>;
  sfxId?: string;
  shake?: boolean;
}

export interface DialogueTree {
  id: string;
  nodes: Record<string, DialogueNode>;
  startNodeId: string;
}

// ── Quest ─────────────────────────────────────────────────────────────────────
export type QuestStatus = "locked" | "available" | "active" | "completed" | "failed";

export interface QuestObjective {
  id: string;
  type: string; // defeat-npc, talk-to-npc, reach-map, collect-item, win-tournament, etc.
  targetId: string;
  quantity?: number;
  description: string;
  optional: boolean;
}

export interface XPReward {
  playerXP?: number;
  beybladeXP?: number;
  beybladeXPTarget?: string;
}

export interface QuestReward {
  reputation?: number;
  friendship?: Record<string, number>;
  items?: Array<{ itemId: string; quantity: number }>;
  beybladeId?: string;
  unlockMapIds?: string[];
  unlockQuestIds?: string[];
  setFlags?: Record<string, boolean>;
  unlockScenes?: string[];
  xp?: XPReward;
  badgeId?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  arcId: ArcId;
  routeExclusiveFor?: RouteId;
  category: string; // main, side, rival, tournament, hidden
  prerequisites: string[];
  requiredFlags?: FlagCondition;
  objectives: QuestObjective[];
  rewards: QuestReward;
  failCondition?: FlagCondition;
}

// ── Mini-Games ────────────────────────────────────────────────────────────────
/**
 * Three mini-game varieties:
 * • qte               — Quick Time Event: press at the right moment (timing bar / button sequence)
 * • bey_trajectory_aim   — Aim + charge + launch; hit N targets in X seconds
 * • bey_trajectory_block — Sequential aim+launch to hit objects in order (e.g. waterfall logs)
 */
export type MiniGameType = "qte" | "bey_trajectory_aim" | "bey_trajectory_block";

export interface MiniGameConfig {
  /** Short flavour description shown in the pre-game title card. */
  description?: string;
  /** Number of independent targets (bey_trajectory_aim). Default 3. */
  targets?: number;
  /** Number of sequential stages (bey_trajectory_block). Default 3. */
  stages?: number;
  /** Countdown timer in seconds. 0 = no timer. */
  timeLimit?: number;
  /** XP awarded on success. */
  xpReward?: number;
  /** For qte: button labels in sequence e.g. ["SPACE","SPACE","SPACE"]. */
  sequence?: string[];
  /** For qte: width of the "perfect" green zone as fraction of bar [0-1]. Default 0.25. */
  perfectZoneWidth?: number;
  /** Minimum fraction of targets/stages required to count as success [0-1]. Default 1. */
  successThreshold?: number;
  /** Story-event ID to fire on success (null = just award XP). */
  onSuccess?: string;
  /** Story-event ID to fire on failure (null = allow retry). */
  onFailure?: string;
}

export interface ActiveMiniGame {
  /** Unique run ID (can be reused across retries). */
  id: string;
  type: MiniGameType;
  /** Story event that triggered this mini-game. */
  storyEventId: string;
  config: MiniGameConfig;
}

export interface MiniGameResult {
  success: boolean;
  /** 0–100 score. */
  score: number;
  hitsLanded: number;
  xpEarned: number;
  timeTakenMs: number;
}

// ── Story Events ──────────────────────────────────────────────────────────────
export type StoryEventStepType =
  | "dialogue" | "move-npc" | "move-player" | "camera-pan" | "camera-shake"
  | "set-flag" | "set-flags" | "wait" | "play-sfx" | "play-bgm"
  | "screen-flash" | "screen-fade" | "spawn-npc" | "despawn-npc"
  | "lock-player" | "unlock-player" | "start-battle"
  | "award-item" | "award-beyblade" | "award-badge"
  | "change-map" | "show-title-card"
  // Mini-games
  | "start-mini-game"    // launch a mini-game overlay; step resolves on completion
  // Tournament / team-match steps
  | "award-team-points"    // add teamPoints to store (Arc 2 team scoring)
  | "set-arc-level-cap"    // set/clear the active arc level cap
  | "tournament-advance"   // signal UI to advance the bracket display
  | "save-checkpoint";     // trigger a hard SaveSystem save (checkpoint)

export interface StoryEventStep {
  type: StoryEventStepType;
  dialogueId?: string;
  npcId?: string;
  targetTile?: TileCoord;
  duration?: number;
  flags?: Record<string, boolean>;
  sfxId?: string;
  bgmId?: string;
  flashColor?: string;
  battleParams?: BattleParams;
  itemId?: string;
  quantity?: number;
  beybladeId?: string;
  badgeId?: string;
  mapId?: string;
  entryPointId?: string;
  titleText?: string;
  subtitleText?: string;
  waitForInput?: boolean;
  /** "award-team-points" — number of points to add to the team score. */
  teamPoints?: number;
  /** "start-mini-game" — inline mini-game definition to launch. */
  miniGame?: ActiveMiniGame;
  /** "set-arc-level-cap" — cap to apply; null/0 clears the cap. */
  levelCap?: number | null;
}

export interface StoryEvent {
  id: string;
  displayName: string;
  arcId: ArcId;
  routeExclusiveFor?: RouteId;
  category: string; // shared, perspective, rival, hidden
  triggerCondition: FlagCondition;
  gate?: GateCondition;
  triggerOnce: boolean;
  blocksPlayerInput: boolean;
  steps: StoryEventStep[];
  completionFlags: Record<string, boolean>;
}

// ── Cutscene ──────────────────────────────────────────────────────────────────
export interface CutsceneActorPlacement {
  npcId: string;
  tile: TileCoord;
  facing: FacingDirection;
}

export interface CutsceneStep extends StoryEventStep {
  actorId?: string;
  walkPath?: TileCoord[];
  speed?: "slow" | "normal" | "fast" | "run";
  cameraTargetTile?: TileCoord;
  cameraZoom?: number;
  parallel?: boolean;
}

export interface Cutscene {
  id: string;
  displayName: string;
  setupActors: CutsceneActorPlacement[];
  steps: CutsceneStep[];
  teardown: "return-control" | "map-change" | "battle-start";
}

// ── Gate Condition ────────────────────────────────────────────────────────────
export interface GateCondition {
  flags?: FlagCondition;
  minPlayerLevel?: number;
  minBeybladeLevel?: { beybladeId: string; level: number };
  requiredBadges?: string[];
  anyBadgeFrom?: string[];
  defeatedNPCs?: string[];
}

export interface GateCheckResult {
  passed: boolean;
  reason?: string;
}

// ── Battle Bridge ──────────────────────────────────────────────────────────────
export interface BattleParams {
  mode: "ai" | "tournament";
  playerBeybladeId: string;
  opponentBeybladeId: string;
  arenaId: string;
  difficulty: "medium" | "hard" | "hell";
  npcId: string;
  tournamentId?: string;
  matchId?: string;
  bestOf?: 1 | 3 | 5;
  rpgContext: {
    questId?: string;
    storyEventId?: string;
    isBossEncounter: boolean;
    /** Protagonist playing this battle. If omitted = Tyson (main player route). */
    protagonistNpcId?: string;
    /** If set the server auto-resolves this outcome (scripted Kenny/Max battles). */
    forcedOutcome?: "win" | "loss";
  };
  /**
   * Player level at time of battle — sent to StoryBattleRoom so the server
   * can normalise AI spin/stats against the player's current power tier.
   */
  playerLevel?: number;
  /**
   * Active arc level cap — AI stats are also capped at the same ceiling,
   * keeping difficulty proportional throughout the arc.
   */
  arcLevelCap?: number;
  /**
   * Launch power multiplier from equipped launcher upgrade (e.g. 1.1 = +10%).
   * Applied by StoryBattleRoom when setting initial spin.
   */
  launchBoost?: number;
}

export interface BattleResult {
  npcId: string;
  outcome: "win" | "loss" | "draw";
  seriesScore: Record<string, number>;
  rpgContext: BattleParams["rpgContext"];
}

// ── Leveling ──────────────────────────────────────────────────────────────────
export interface LevelingConfig {
  xpCurve: number[];
  maxPlayerLevel: number;
  maxBeybladeLevel: number;
}

export interface PlayerLevelState {
  level: number;
  xp: number;
  beybladeXP: Record<string, number>;
  beybladeLevels: Record<string, number>;
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export interface BadgeDef {
  id: string;
  displayName: string;
  description: string;
  iconAssetId: string;
  category: BadgeCategory;
  regionId?: string;
  arcId?: ArcId;
  earnCondition: {
    type: string;
    targetId: string;
  };
  routeExclusiveFor?: RouteId;
  order?: number;
}

// ── Save State ────────────────────────────────────────────────────────────────
export type RivalStatus = "neutral" | "rival" | "friend" | "defeated" | "respected";

export interface SaveSlotMeta {
  slotIndex: 0 | 1 | 2;
  createdAt: number;
  updatedAt: number;
  playerName: string;
  routeId: RouteId;
  arcId: ArcId;
  currentMapId: string;
  currentRegionId: string;
  playtimeMs: number;
  screenshotDataUrl?: string;
}

export interface RPGSaveState {
  meta: SaveSlotMeta;
  player: {
    tile: TileCoord;
    facing: FacingDirection;
    reputation: number;
    friendship: Record<string, number>;
    rivalStatus: Record<string, RivalStatus>;
    unlockedMaps: string[];
    unlockedScenesViewed: string[];
  };
  flags: Record<string, boolean>;
  questStates: Record<string, {
    status: QuestStatus;
    objectiveProgress: Record<string, number>;
    completedAt?: number;
  }>;
  inventory: {
    items: Array<{ itemId: string; quantity: number }>;
    beyblades: string[];
    equippedBeybladeId: string | null;
    money: number;
  };
  battleRecords: Array<{
    npcId: string;
    result: "win" | "loss" | "draw";
    timestamp: number;
  }>;
  defeatedNPCs: Record<string, boolean>;
  leveling: PlayerLevelState;
  earnedBadges: string[];
  currentMapId: string;
  currentRegionId: string;
}

// ── Region ────────────────────────────────────────────────────────────────────
export interface RegionConnection {
  targetRegionId: string;
  gate?: GateCondition;
  travelMode: string;
}

export interface RegionDef {
  id: string;
  displayName: string;
  country: string;
  description: string;
  mapIds: string[];
  hubMapId: string;
  connections: RegionConnection[];
  unlockGate?: GateCondition;
  worldMapTile: TileCoord;
  bgmTrackId: string;
  arcIds: ArcId[];
}

// ── Equipment slot identifiers ────────────────────────────────────────────────
/**
 * Named slots in the player's equipment panel.
 * - "launcher"   — the grip launcher (one at a time; must be purchased).
 * - "ripcord"    — the pull cord (consumable; stacks up to 5).
 * - "upgrade"    — performance add-ons stacked on the launcher (up to 3).
 * - "accessory"  — stat-modifying wearable (grip tape, wrist strap, etc.).
 * - "consumable" — single-use items (energy drink, repair kit, tune-up).
 * - "beyblade-part" — quest/assembly parts (Attack Ring, Weight Disk, etc.).
 * - "collectible" — badges, trophies; never tradeable.
 */
export type EquipSlot =
  | "launcher" | "ripcord" | "upgrade" | "accessory"
  | "consumable" | "beyblade-part" | "collectible" | "key-item";

/**
 * Spin direction a launcher supports.
 * "right"  — standard right-spin; available from the start of the game.
 * "left"   — left-spin (L-Drago launcher); MUST be purchased; never granted free.
 * "either" — dual-spin compatible (e.g. String Launcher Pro).
 */
export type LauncherSide = "right" | "left" | "either";

// ── Inventory Item ────────────────────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  displayName: string;
  description: string;
  /** Broad category used for bag-tab filtering. Matches EquipSlot values. */
  category: ItemCategory;
  /** Which equipment slot this item occupies when equipped (undefined = unequippable). */
  equipSlot?: EquipSlot;
  iconAssetId: string;
  /** Optional URL to an uploaded icon image (overrides iconAssetId lookup). */
  iconUrl?: string;
  stackable: boolean;
  maxStack?: number;
  /** Single-use: removed from inventory on use. */
  isConsumable?: boolean;
  usable: boolean;
  useEffect?: {
    /** xp-boost | heal | repair | spin-boost | flag | warp */
    type: string;
    value?: number;
    /** For flag-type effects */
    flagKey?: string;
    flagValue?: boolean;
    eventId?: string;
    mapId?: string;
  };
  sellPrice?: number;
  buyPrice?: number;
  /**
   * Whether this item can only be obtained from a specific shop or event.
   * If true the item never appears in random drops or quest rewards.
   */
  shopOnly?: boolean;
  questRelated: boolean;
  /** NPC ids or enemy ids that can drop this item. */
  droppedBy?: string[];
  /**
   * Wear / durability system (launchers and ripcords).
   * maxDurability: starting durability (e.g. 100).
   * wearRate:      durability lost per battle.
   * Items without maxDurability are indestructible (quest items, trophies, etc.).
   */
  maxDurability?: number;
  wearRate?: number;
  /**
   * Additive launch-power multiplier while equipped.
   * e.g. 0.10 = +10% spin. Stacks across installed upgrades.
   */
  launchBoost?: number;
  /** If true this item occupies the "launcher" equipment slot when equipped. */
  isLauncher?: boolean;
  /**
   * Spin direction this launcher supports.
   * Left-spin launchers MUST be purchased; they are never granted free.
   * Defaults to "right" for all launchers unless explicitly set.
   */
  launchSide?: LauncherSide;
  /** If true this item is a launcher upgrade (boosts without replacing the launcher). */
  isLauncherUpgrade?: boolean;
  /**
   * Template / reuse metadata.
   * templateId: if this item was cloned from a template, its source id.
   * isTemplate:  marks the canonical version of a reusable item archetype.
   */
  templateId?: string;
  isTemplate?: boolean;
  /** Arc or episode restriction — item only available in these arc ids. */
  arcIds?: ArcId[];
}

// ── Quest Runtime State ───────────────────────────────────────────────────────
export interface QuestRuntimeState {
  status: QuestStatus;
  objectiveProgress: Record<string, number>;
  completedAt?: number;
}

// ── World Config (rpg_config/world) ───────────────────────────────────────────
export interface WorldConfig {
  startArcId: ArcId;
  startRouteChoices: RouteId[];
  titleScreenAssets?: Record<string, string>;
}

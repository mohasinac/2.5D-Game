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
  gate?: GateCondition;
  rewardQuestId?: string;
  rewardFlags?: Record<string, boolean>;
  awardsBadgeId?: string;
  xpReward?: XPReward;
}

export interface NPC {
  id: string;
  displayName: string;
  type: NPCType;
  spriteSheetId: string;
  portraitId: string;
  defaultFacing: FacingDirection;
  schedule: NPCScheduleEntry[];
  defaultDialogueId: string;
  battleConfig?: NPCBattleConfig;
  shopInventoryId?: string;
  questIds?: string[];
  routeExclusiveFor?: RouteId;
  arcIds?: ArcId[];
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

// ── Story Events ──────────────────────────────────────────────────────────────
export type StoryEventStepType =
  | "dialogue" | "move-npc" | "move-player" | "camera-pan" | "camera-shake"
  | "set-flag" | "set-flags" | "wait" | "play-sfx" | "play-bgm"
  | "screen-flash" | "screen-fade" | "spawn-npc" | "despawn-npc"
  | "lock-player" | "unlock-player" | "start-battle"
  | "award-item" | "award-beyblade" | "award-badge"
  | "change-map" | "show-title-card";

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
  };
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

// ── Inventory Item ────────────────────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  displayName: string;
  description: string;
  category: ItemCategory;
  iconAssetId: string;
  stackable: boolean;
  maxStack?: number;
  usable: boolean;
  useEffect?: {
    type: string;
    value?: number;
    eventId?: string;
    mapId?: string;
  };
  sellPrice?: number;
  buyPrice?: number;
  questRelated: boolean;
  droppedBy?: string[];
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

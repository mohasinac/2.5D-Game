// ── Primitive IDs ────────────────────────────────────────────────
export type ItemId      = string;
export type NPCId       = string;
export type MapId       = string;
export type TilesetId   = string;
export type DialogueId  = string;
export type CutsceneId  = string;
export type QuestId     = string;
export type FlagKey     = string;
export type SpriteKey   = string;

// ── Sprites & Animations ─────────────────────────────────────────
export interface AnimationDef {
  name:   string;
  fps:    number;
  loop:   boolean;
  frames: number[];
}

export interface HitboxDef {
  offsetX: number;
  offsetY: number;
  width:   number;
  height:  number;
}

export interface SVGSpriteData {
  id:          string;
  name:        string;
  svgBase64:   string;
  frameWidth:  number;
  frameHeight: number;
  cols:        number;
  rows:        number;
  padding:     number;
  animations:  AnimationDef[];
  hitbox:      HitboxDef;
  portraits:   Record<string, number>;
}

// ── Tilesets ─────────────────────────────────────────────────────
export type CollisionType = 'none' | 'solid' | 'slope_up' | 'slope_down' | 'water' | 'bush';
export type ZLayer        = 'ground' | 'decor' | 'overhead';

export interface TileData {
  id:         string;
  name:       string;
  tilesetId:  TilesetId;
  frameIndex: number;
  collision:  CollisionType;
  zLayer:     ZLayer;
  animFrames: number[];
  animFps:    number;
  tags:       string[];
}

export interface SVGTilesetData {
  id:         TilesetId;
  name:       string;
  svgBase64:  string;
  tileWidth:  number;
  tileHeight: number;
  tileIds:    string[];
}

// ── Maps ─────────────────────────────────────────────────────────
export type ToolMode  = 'pencil' | 'fill' | 'eraser' | 'select' | 'entity' | 'event';
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface TileCell { tileId: string | null; }

export interface MapLayer {
  id:      string;
  name:    string;
  visible: boolean;
  cells:   TileCell[][];
}

export interface NPCEntityPlacement {
  id:          string;
  npcId:       NPCId;
  tileX:       number;
  tileY:       number;
  facing:      Direction;
  patrolPath:  { x: number; y: number }[];
}

export interface EventZonePlacement {
  id:          string;
  tileX:       number;
  tileY:       number;
  widthTiles:  number;
  heightTiles: number;
  triggerId:   string;
}

export interface MapData {
  id:        MapId;
  name:      string;
  cols:      number;
  rows:      number;
  tileSize:  number;
  bgColor:   string;
  tilesetId: TilesetId;
  bgmId:     string | null;
  layers:    MapLayer[];
  entities:  NPCEntityPlacement[];
  events:    EventZonePlacement[];
}

// ── NPCs ─────────────────────────────────────────────────────────
export type NPCAIState = 'idle' | 'patrol' | 'follow' | 'chase' | 'talk' | 'return';

export interface VisionConeConfig {
  range:         number;
  angle:         number;
  reductionBush: number;
}

export interface NPCData {
  id:         NPCId;
  name:       string;
  spriteId:   string;
  portraitId: string;
  aiDefault:  NPCAIState;
  visionCone: VisionConeConfig;
  dialogueId: DialogueId | null;
  shopId:     string | null;
}

// ── Dialogue Trees ───────────────────────────────────────────────
export type DialogueNodeType = 'START' | 'TEXT' | 'CHOICE' | 'CONDITION' | 'EVENT' | 'END';

export interface DialogueChoice {
  label:   string;
  nextId:  string;
  flagReq: FlagKey | null;
}

export interface DialogueNode {
  id:         string;
  type:       DialogueNodeType;
  speaker:    string;
  emotion:    string;
  text:       string;
  nextId:     string | null;
  choices:    DialogueChoice[];
  flagKey:    FlagKey | null;
  trueBranch:  string | null;
  falseBranch: string | null;
  eventType:  'set_flag' | 'give_item' | 'take_item' | 'trigger_cutscene' | null;
  eventArg:   string | null;
}

export interface DialogueNodePos {
  id: string;
  x:  number;
  y:  number;
}

export interface DialogueTree {
  id:        DialogueId;
  name:      string;
  npcId:     NPCId | null;
  nodes:     DialogueNode[];
  positions: DialogueNodePos[];
  startId:   string;
}

// ── Cutscenes ────────────────────────────────────────────────────
export type CutsceneStepType =
  | 'camera_pan' | 'dialogue' | 'npc_move' | 'sfx'
  | 'fade' | 'wait' | 'flag_set';

export interface CutsceneStep {
  id:         string;
  type:       CutsceneStepType;
  duration:   number;
  targetX:    number;
  targetY:    number;
  dialogueId: DialogueId | null;
  npcId:      NPCId | null;
  destTileX:  number;
  destTileY:  number;
  soundId:    string | null;
  fadeDir:    'in' | 'out';
  flagKey:    FlagKey | null;
  flagValue:  boolean;
}

export interface CutsceneScript {
  id:    CutsceneId;
  name:  string;
  steps: CutsceneStep[];
}

// ── Items & Inventory ─────────────────────────────────────────────
export type ItemCategory = 'bey_part' | 'currency' | 'consumable' | 'key_item';
export type EquipSlot    = 'bey' | 'ring' | 'disk' | 'driver';

export interface ItemData {
  id:         ItemId;
  name:       string;
  desc:       string;
  category:   ItemCategory;
  equipSlot:  EquipSlot | null;
  spriteId:   string;
  frameIndex: number;
  price:      number;
}

export interface ItemInstance {
  itemId: ItemId;
  qty:    number;
}

// ── Quests ───────────────────────────────────────────────────────
export type QuestStatus = 'inactive' | 'active' | 'complete';

export interface QuestObjective {
  id:      string;
  desc:    string;
  flagKey: FlagKey;
}

export interface QuestData {
  id:          QuestId;
  name:        string;
  desc:        string;
  giverNpcId:  NPCId;
  objectives:  QuestObjective[];
  rewards:     { itemId: ItemId; qty: number }[];
}

// ── Audio ─────────────────────────────────────────────────────────
export type AudioCategory = 'bgm' | 'sfx' | 'ambient' | 'ui';

export interface AudioAssetData {
  id:            string;
  name:          string;
  category:      AudioCategory;
  fileBase64:    string;
  volume:        number;
  loop:          boolean;
  spatial:       boolean;
  eventBindings: string[];
}

// ── Mini-games ────────────────────────────────────────────────────
export type PipeTileType = 'empty' | 'straight' | 'elbow' | 'tee' | 'cross' | 'source' | 'sink';

export interface PipeTile {
  type:     PipeTileType;
  rotation: 0 | 90 | 180 | 270;
  locked:   boolean;
}

export interface PipePuzzleLevel {
  id:           string;
  name:         string;
  cols:         number;
  rows:         number;
  timeLimitSec: number;
  grid:         PipeTile[][];
  rewardItemId: string | null;
  rewardGold:   number;
  winFlagKey:   string | null;
}

export type PlatformTileType = 'solid' | 'spring' | 'spike' | 'crumble' | 'moving';

export interface PlatformTile {
  col:        number;
  row:        number;
  type:       PlatformTileType;
  moveAxis?:  'x' | 'y';
  moveRange?: number;
  moveSpeed?: number;
}

export interface PlatformCollectible {
  col:        number;
  row:        number;
  itemId:     string;
  frameIndex: number;
}

export interface PlatformLevel {
  id:           string;
  name:         string;
  cols:         number;
  rows:         number;
  tileSize:     number;
  timeLimitSec: number;
  spawnCol:     number;
  spawnRow:     number;
  exitCol:      number;
  exitRow:      number;
  tiles:        PlatformTile[];
  collectibles: PlatformCollectible[];
  bgColor:      string;
  gravity:      number;
  rewardItemId: string | null;
  rewardGold:   number;
  winFlagKey:   string | null;
}

// ── Triggers ──────────────────────────────────────────────────────
export type TriggerType =
  | 'dialogue' | 'cutscene' | 'battle' | 'warp'
  | 'shop' | 'chest' | 'pipe_puzzle' | 'platform_level';

export interface TriggerData {
  id:          string;
  type:        TriggerType;
  targetId:    string;
  warpTileX:   number;
  warpTileY:   number;
  once:        boolean;
  flagReq:     FlagKey | null;
}

// ── Shops ─────────────────────────────────────────────────────────
export interface ShopItem {
  itemId:    ItemId;
  stock:     number;
  sellPrice: number;
}

export interface ShopData {
  id:       string;
  name:     string;
  npcId:    NPCId;
  items:    ShopItem[];
}

// ── Saves ─────────────────────────────────────────────────────────
export interface SaveSlot {
  slot:         0 | 1 | 2;
  timestamp:    number;
  playerName:   string;
  mapId:        MapId;
  playerTileX:  number;
  playerTileY:  number;
  gold:         number;
  items:        ItemInstance[];
  equipment:    Partial<Record<EquipSlot, ItemId>>;
  flags:        Record<FlagKey, boolean>;
  quests:       Record<QuestId, QuestStatus>;
  playtimeMs:   number;
}

export interface SaveSlotMeta {
  slot:       0 | 1 | 2;
  timestamp:  number;
  playerName: string;
  mapId:      MapId;
}

// ── Mini-game result ──────────────────────────────────────────────
export interface MiniGameResult {
  levelId:     string;
  win:         boolean;
  rewardItemId: string | null;
  rewardGold:  number;
  winFlagKey:  string | null;
}

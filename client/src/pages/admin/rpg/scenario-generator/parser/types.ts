import type {
  RPGMap, NPC, DialogueTree, Quest, StoryEvent, Cutscene, BadgeDef, InventoryItem,
  TileCoord, FacingDirection, XPReward, GateCondition, FlagCondition,
} from "@/rpg/data/schemas";

// ── JSON Script Input Types ──────────────────────────────────────────────────

export interface ScenarioMeta {
  id: string;
  title: string;
  arcId: string;
  regionId: string;
}

export interface ScenarioLocationExit {
  to: string;
  direction: "north" | "south" | "east" | "west" | "warp";
  transition?: "walk" | "warp" | "door" | "cave";
}

export interface ScenarioLocationEntry {
  id: string;
  tile: [number, number];
  facing?: FacingDirection;
}

export interface ScenarioLocation {
  id: string;
  name: string;
  type?: string;
  size?: string;
  lighting?: "day" | "evening" | "night" | "indoor" | "cave";
  bgm?: string;
  layout?: string[];
  exits?: ScenarioLocationExit[];
  entryPoints?: ScenarioLocationEntry[];
}

export interface ScenarioCharacterBattleConfig {
  beybladeId: string;
  arenaId: string;
  difficulty?: "easy" | "medium" | "hard" | "hell";
  canRematch?: boolean;
  bestOf?: 1 | 3 | 5;
  xpReward?: XPReward;
  awardsBadgeId?: string;
  gate?: GateCondition;
}

export interface ScenarioCharacter {
  id: string;
  name: string;
  type?: string;
  color?: string;
  shape?: PlaceholderShape;
  facing?: FacingDirection;
  location?: string;
  tile?: [number, number];
  greeting?: string;
  battleConfig?: ScenarioCharacterBattleConfig;
  schedule?: Array<{
    timeSlot: string;
    location: string;
    tile: [number, number];
    facing?: FacingDirection;
  }>;
}

export type DialogueShorthandEntry =
  | Record<string, string>
  | { choice: { prompt: string; options: Array<{ label: string; setFlag?: string; goto?: string }> } }
  | { label: string; [speaker: string]: string };

export interface ScenarioSceneActor {
  npcId: string;
  tile: [number, number];
  facing?: FacingDirection;
}

export interface ScenarioScene {
  id: string;
  name: string;
  type?: "cutscene" | "story-event";
  location?: string;
  triggerMode?: "enter" | "interact" | "step";
  triggerTile?: [number, number];
  triggerOnce?: boolean;
  actors?: ScenarioSceneActor[];
  dialogue?: DialogueShorthandEntry[];
  completionFlags?: Record<string, boolean>;
  gate?: GateCondition;
}

export interface ScenarioQuest {
  id: string;
  title: string;
  description: string;
  category?: string;
  prerequisites?: string[];
  requiredFlags?: FlagCondition;
  objectives: Array<{
    type: string;
    target: string;
    quantity?: number;
    description: string;
    optional?: boolean;
  }>;
  rewards?: {
    reputation?: number;
    friendship?: Record<string, number>;
    items?: Array<{ itemId: string; quantity: number }>;
    beybladeId?: string;
    unlockMapIds?: string[];
    setFlags?: Record<string, boolean>;
    xp?: XPReward;
    badgeId?: string;
  };
}

export interface ScenarioBadge {
  id: string;
  name: string;
  category?: string;
  color?: string;
  shape?: PlaceholderShape;
  description?: string;
  earnCondition: { type: string; targetId: string };
  regionId?: string;
}

export interface ScenarioItem {
  id: string;
  name: string;
  category?: string;
  color?: string;
  shape?: PlaceholderShape;
  description?: string;
  stackable?: boolean;
  maxStack?: number;
  usable?: boolean;
  sellPrice?: number;
  buyPrice?: number;
  questRelated?: boolean;
}

export interface ScenarioInput {
  scenario: ScenarioMeta;
  locations?: ScenarioLocation[];
  characters?: ScenarioCharacter[];
  scenes?: ScenarioScene[];
  quests?: ScenarioQuest[];
  badges?: ScenarioBadge[];
  items?: ScenarioItem[];
}

// ── Parser Output ────────────────────────────────────────────────────────────

export interface ScenarioOutput {
  maps: RPGMap[];
  npcs: NPC[];
  dialogues: DialogueTree[];
  quests: Quest[];
  storyEvents: StoryEvent[];
  cutscenes: Cutscene[];
  badges: BadgeDef[];
  items: InventoryItem[];
  warnings: string[];
}

// ── Placeholder Shapes ───────────────────────────────────────────────────────

export type PlaceholderShape = "circle" | "diamond" | "triangle" | "square" | "star" | "hexagon";

// ── ASCII Tile Legend ─────────────────────────────────────────────────────────

export const TILE_LEGEND: Record<string, { name: string; collision: boolean; layer: "ground" | "decoration" }> = {
  ".": { name: "grass",    collision: false, layer: "ground" },
  "W": { name: "wall",     collision: true,  layer: "ground" },
  "T": { name: "tree",     collision: true,  layer: "decoration" },
  "B": { name: "building", collision: true,  layer: "decoration" },
  "P": { name: "path",     collision: false, layer: "ground" },
  "A": { name: "arena",    collision: false, layer: "ground" },
  "D": { name: "door",     collision: false, layer: "ground" },
  "S": { name: "shop",     collision: true,  layer: "decoration" },
  "R": { name: "rock",     collision: true,  layer: "decoration" },
  "~": { name: "water",    collision: true,  layer: "ground" },
  " ": { name: "grass",    collision: false, layer: "ground" },
};

export const TILE_IDS: Record<string, number> = {
  grass: 1,
  wall: 2,
  tree: 3,
  building: 4,
  path: 5,
  arena: 6,
  door: 7,
  shop: 8,
  rock: 9,
  water: 10,
};

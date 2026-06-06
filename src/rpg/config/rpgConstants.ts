// ── Tile & World ─────────────────────────────────────────────────
export const TILE_SIZE          = 48;    // px per tile (world space, also used in Phaser)
export const WORLD_SCALE        = 1;     // 1 world unit = 1 px

// ── Player ───────────────────────────────────────────────────────
export const PLAYER_WALK_SPEED  = 120;   // px/s
export const PLAYER_RUN_SPEED   = 200;   // px/s (hold shift)
export const PLAYER_INTERACT_RADIUS = 48; // px — distance to trigger E interaction

// ── NPC ──────────────────────────────────────────────────────────
export const NPC_WALK_SPEED     = 60;    // px/s (patrol)
export const NPC_CHASE_SPEED    = 140;   // px/s (chase)
export const NPC_FOLLOW_SPEED   = 80;    // px/s (follow-friendly)
export const NPC_IDLE_TIME_MIN  = 1500;  // ms before random idle rotation
export const NPC_IDLE_TIME_MAX  = 4000;

// ── Vision / Stealth ─────────────────────────────────────────────
export const VISION_DEFAULT_RANGE   = 200;   // px
export const VISION_DEFAULT_ANGLE   = 70;    // degrees (full cone width)
export const VISION_BUSH_REDUCTION  = 0.35;  // effective range *= this when player in bush
export const VISION_ALERT_DURATION  = 3000;  // ms NPC stays alert after losing sight

// ── Physics categories (arcade bitfield) ─────────────────────────
export const CAT_PLAYER  = 0x0001;
export const CAT_NPC     = 0x0002;
export const CAT_WALL    = 0x0004;
export const CAT_EVENT   = 0x0008;
export const CAT_ITEM    = 0x0010;

// ── Inventory ────────────────────────────────────────────────────
export const MAX_INVENTORY_SLOTS = 24;

// ── Save ──────────────────────────────────────────────────────────
export const SAVE_VERSION   = 1;
export const MAX_SAVE_SLOTS = 3;

// ── localStorage keys ────────────────────────────────────────────
export const LS_ASSETS    = 'rpg_assets_v1';
export const LS_SAVE_PFX  = 'rpg_save_';    // + slot number
export const LS_SETTINGS  = 'rpg_settings';

// ── Mini-game ────────────────────────────────────────────────────
export const PIPE_DEFAULT_COLS        = 5;
export const PIPE_DEFAULT_ROWS        = 5;
export const PIPE_DEFAULT_TIME_SEC    = 30;
export const PLATFORM_DEFAULT_COLS    = 12;
export const PLATFORM_DEFAULT_ROWS    = 8;
export const PLATFORM_DEFAULT_GRAVITY = 800;  // px/s²
export const PLATFORM_TILE_SIZE       = 40;   // px per platform tile
export const PLATFORM_JUMP_VELOCITY   = -520; // px/s (negative = upward in Phaser)
export const PLATFORM_SPRING_VELOCITY = -900; // px/s (spring boost)

// ── Dialogue ─────────────────────────────────────────────────────
export const DIALOGUE_TYPEWRITER_SPEED = 30;  // ms per character
export const DIALOGUE_BOX_LINES        = 3;   // visible text lines

// ── Emotion keys (standard set for portraits) ─────────────────────
export const EMOTIONS = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'thinking'] as const;
export type Emotion = typeof EMOTIONS[number];

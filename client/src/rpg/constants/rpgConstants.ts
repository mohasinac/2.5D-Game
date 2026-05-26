export const TILE_SIZE = 16;
export const WALK_SPEED_PX_PER_MS = 0.09; // tiles per ms at 1 tile = 16px
export const WALK_DURATION_MS = 150;       // ms to walk one tile
export const CAMERA_LERP = 0.12;
export const CAMERA_ZOOM_DEFAULT = 3;      // pixel scale (3x = 48px rendered tile)
export const CAMERA_ZOOM_MIN = 2;
export const CAMERA_ZOOM_MAX = 5;
export const NPC_PATROL_PAUSE_MS = 800;    // ms NPC pauses at patrol waypoints
export const DIALOGUE_TEXT_SPEED_MS = 30;  // ms per character in typewriter effect
export const TRANSITION_FLASH_MS = 300;    // battle flash duration
export const TRANSITION_FADE_MS = 200;     // map fade duration
export const LEVEL_UP_DISPLAY_MS = 2500;
export const BADGE_EARNED_DISPLAY_MS = 3000;
export const SAVE_AUTO_INTERVAL_MS = 5 * 60 * 1000; // 5-min autosave
export const MAX_SAVE_SLOTS = 3;
export const MAX_PLAYER_LEVEL = 50;
export const MAX_BEYBLADE_LEVEL = 20;
export const RPG_SAVE_COLLECTION = "rpg_saves";
export const RPG_CONFIG_COLLECTION = "rpg_config";

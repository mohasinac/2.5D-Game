export const TILE_SIZE = 16;
export const WALK_SPEED_PX_PER_MS = 0.09; // tiles per ms at 1 tile = 16px
export const WALK_DURATION_MS = 150;       // ms to walk one tile
export const CAMERA_LERP = 0.12;
export const CAMERA_ZOOM_DEFAULT = 3;      // pixel scale (3x = 48px rendered tile)
export const CAMERA_ZOOM_MIN = 2;
export const CAMERA_ZOOM_MAX = 5;
export const NPC_PATROL_PAUSE_MS = 800;    // ms NPC pauses at patrol waypoints
export const MAX_SAVE_SLOTS = 3;
export const MAX_PLAYER_LEVEL = 50;
export const MAX_BEYBLADE_LEVEL = 20;
export const RPG_SAVE_COLLECTION = "rpg_saves";
export const RPG_CONFIG_COLLECTION = "rpg_config";

// ── Server tick rate ─────────────────────────────────────────────────────────
export const SERVER_TICK_RATE = 60;
export const TICK_MS = 1000 / SERVER_TICK_RATE; // ~16.67ms

// ── Tick-based animation durations ───────────────────────────────────────────
// All values in server ticks (1 tick = ~16.67ms at 60Hz).
// Convert to seconds for Framer Motion: ticks * TICK_MS / 1000

export const TICKS_DIALOGUE_CHAR = 2;           // ticks per character in typewriter (was 30ms → ~2 ticks)
export const TICKS_DIALOGUE_SLIDE = 12;          // dialogue box slide-in/out (was 200ms → 12 ticks)
export const TICKS_TRANSITION_FLASH = 18;        // battle flash (was 300ms → 18 ticks)
export const TICKS_TRANSITION_FADE = 12;         // map fade (was 200ms → 12 ticks)
export const TICKS_MENU_FADE = 9;               // menu overlay fade (was 150ms → 9 ticks)
export const TICKS_CUTSCENE_BAR = 24;           // letter-box bar animate (was 400ms → 24 ticks)
export const TICKS_CUTSCENE_TITLE = 36;         // cutscene title card (was 600ms → 36 ticks)
export const TICKS_CUTSCENE_TITLE_DELAY = 18;   // cutscene title delay (was 300ms → 18 ticks)
export const TICKS_ROUTE_PREVIEW = 18;          // route preview slide (was 300ms → 18 ticks)
export const TICKS_ROUTE_PREVIEW_DELAY = 12;    // route preview button delay (was 200ms → 12 ticks)
export const TICKS_BATTLE_RETURN_DELAY = 90;    // delay before navigating back from battle (was 1500ms → 90 ticks)
export const TICKS_NOTIFICATION_DISMISS = 240;   // auto-dismiss notifications (was 4000ms → 240 ticks)
export const TICKS_LEVEL_UP_DISPLAY = 150;       // level-up popup (was 2500ms → 150 ticks)
export const TICKS_BADGE_EARNED_DISPLAY = 180;   // badge-earned popup (was 3000ms → 180 ticks)

export function ticksToSeconds(ticks: number): number {
  return (ticks * TICK_MS) / 1000;
}

export function ticksToMs(ticks: number): number {
  return ticks * TICK_MS;
}

// Legacy aliases (ms) — computed from ticks for backward compatibility
export const DIALOGUE_TEXT_SPEED_MS = ticksToMs(TICKS_DIALOGUE_CHAR);
export const TRANSITION_FLASH_MS = ticksToMs(TICKS_TRANSITION_FLASH);
export const TRANSITION_FADE_MS = ticksToMs(TICKS_TRANSITION_FADE);
export const LEVEL_UP_DISPLAY_MS = ticksToMs(TICKS_LEVEL_UP_DISPLAY);
export const BADGE_EARNED_DISPLAY_MS = ticksToMs(TICKS_BADGE_EARNED_DISPLAY);
export const SAVE_AUTO_INTERVAL_MS = 5 * 60 * 1000; // 5-min autosave (not tick-based)

// Single source of truth for Firestore collection names.
// Shared across server and client (cross-boundary import — server tsconfig omits rootDir).
// Replaces the older src/constants/firebase.ts (which now re-exports from here).

export const CLASSIC_2D_COLLECTIONS = {
  BEYBLADE_STATS: "beyblade_stats",
  ARENAS: "arenas",
} as const;

export const PARTS_25D_COLLECTIONS = {
  BEYBLADE_SYSTEMS: "beyblade_systems",
  ARENA_SYSTEMS: "arena_systems",
  BIT_BEAST_PARTS: "bit_beast_parts",
  ATTACK_RING_PARTS: "attack_ring_parts",
  WEIGHT_DISK_PARTS: "weight_disk_parts",
  SUB_PARTS: "sub_parts",
  TIP_PARTS: "tip_parts",
  CORE_PARTS: "core_parts",
  CASING_PARTS: "casing_parts",
  SPIN_TRACK_PARTS: "spin_track_parts",
} as const;

export const ASSET_COLLECTIONS = {
  ARENA_THEME_ASSETS: "arena_theme_assets",
  OBSTACLE_ASSETS: "obstacle_assets",
  TURRET_ASSETS: "turret_assets",
  WATER_BODY_ASSETS: "water_body_assets",
  PORTAL_ASSETS: "portal_assets",
  SOUND_ASSETS: "sound_assets",
  STADIUMS: "stadiums",
} as const;

export const SHARED_COLLECTIONS = {
  MATCHES: "matches",
  PLAYER_STATS: "player_stats",
  USERS: "users",
  TOURNAMENTS: "tournaments",
  TOURNAMENT_PARTICIPANTS: "tournament_participants",
  TOURNAMENT_BRACKETS: "tournament_brackets",
  SPECIAL_MOVES: "special_moves",
  SETTINGS: "settings",
  ELEMENT_TYPE_CONFIGS: "element_type_configs",
  COMBOS: "combos",
  TURRET_ATTACK_TYPES: "turret_attack_types",
  ARENA_FEATURE_CONFIGS: "arena_feature_configs",
  BEY_LINK_CONFIGS: "bey_link_configs",
  MECHANIC_DEFS: "mechanic_defs",
  GIMMICK_DEFS: "gimmick_defs",
  COMBO_EFFECTS: "combo_effects",
  CAMERA_PROFILES: "camera_profiles",
  AUDIO_PROFILES: "audio_profiles",
  SCRIPT_DEFINITIONS: "script_definitions",
  COMPOSITION_BLOCKS: "composition_blocks",
  AI_BATTLES: "ai_battles",
} as const;

// Flat aggregate — everything in one record (back-compat shape for existing FIREBASE_COLLECTIONS/COLLECTIONS consumers)
export const COLLECTIONS = {
  ...CLASSIC_2D_COLLECTIONS,
  ...PARTS_25D_COLLECTIONS,
  ...ASSET_COLLECTIONS,
  ...SHARED_COLLECTIONS,
} as const;

export const FIREBASE_BUCKETS = {
  BEYBLADES: "beyblades",
  ARENAS: "arenas",
  AVATARS: "avatars",
  GENERAL: "general",
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
export type FirebaseBucket = typeof FIREBASE_BUCKETS[keyof typeof FIREBASE_BUCKETS];

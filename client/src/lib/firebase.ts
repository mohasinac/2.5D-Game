// [GAME-CLIENT] Firebase Web SDK client initialization.
// Used by admin pages for direct Firestore CRUD and Storage uploads.
// Note: server uses Firebase Admin SDK (src/utils/firebase.ts) — these are separate.

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export const COLLECTIONS = {
  BEYBLADE_STATS: "beyblade_stats",
  ARENAS: "arenas",
  MATCHES: "matches",
  PLAYER_STATS: "player_stats",
  ARENA_THEME_ASSETS: "arena_theme_assets",
  OBSTACLE_ASSETS: "obstacle_assets",
  TURRET_ASSETS: "turret_assets",
  WATER_BODY_ASSETS: "water_body_assets",
  PORTAL_ASSETS: "portal_assets",
  SOUND_ASSETS: "sound_assets",
  // 2.5D part library
  BIT_BEAST_PARTS: "bit_beast_parts",
  ATTACK_RING_PARTS: "attack_ring_parts",
  WEIGHT_DISK_PARTS: "weight_disk_parts",
  SUB_PARTS: "sub_parts",
  TIP_PARTS: "tip_parts",
  CORE_PARTS: "core_parts",
  CASING_PARTS: "casing_parts",
  SPIN_TRACK_PARTS: "spin_track_parts",
  GEAR_PARTS: "gear_parts",
  BEYBLADE_SYSTEMS: "beyblade_systems",
  ARENA_SYSTEMS: "arena_systems",
  SPECIAL_MOVES: "special_moves",
  // Tournament collections
  TOURNAMENTS: "tournaments",
  TOURNAMENT_PARTICIPANTS: "tournament_participants",
  TOURNAMENT_BRACKETS: "tournament_brackets",
  SETTINGS: "settings",
  PARTICLE_PRESETS: "particle_presets",
  COMBO_EFFECTS: "combo_effects",
  ELEMENT_TYPE_CONFIGS: "element_type_configs",
  COMBOS: "combos",
  TURRET_ATTACK_TYPES: "turret_attack_types",
  ARENA_FEATURE_CONFIGS: "arena_feature_configs",
  BEY_LINK_CONFIGS: "bey_link_configs",
  ANIMATION_PRESETS: "animation_presets",
  BEHAVIOR_DEFS: "behavior_defs",
  ROUND_MODIFIERS: "round_modifiers",
  AI_BATTLES: "ai_battles",
  PART_MATERIALS: "part_materials",
  MECHANIC_DEFS: "mechanic_defs",
  GIMMICK_DEFS: "gimmick_defs",
  GEOMETRY_DEFS: "geometry_defs",
  STAT_DEFS: "stat_defs",
  ARENA_FLOOR_GROUPS: "arena_floor_groups",
  USERS: "users",
  // Firebase-backed option presets (admin-editable)
  TIP_SHAPE_DEFS: "tip_shape_defs",
  CORE_GIMMICK_DEFS: "core_gimmick_defs",
  ATTACK_TYPE_DEFS: "attack_type_defs",
  ARENA_THEME_DEFS: "arena_theme_defs",
  ARENA_SHAPE_DEFS: "arena_shape_defs",
  BOWL_PROFILE_DEFS: "bowl_profile_defs",
  TRIGGER_TYPE_DEFS: "trigger_type_defs",
  STAT_EVENT_DEFS: "stat_event_defs",
  PART_LAYER_DEFS: "part_layer_defs",
  // Phase 29: Collision QTE + Special Interaction Defs
  SPECIAL_INTERACTION_DEFS: "special_interaction_defs",
  TILT_PRESET_DEFS: "tilt_preset_defs",
  DIFFICULTY_DEFS: "difficulty_defs",
  FEATURE_ANIMATION_DEFS: "feature_animation_defs",
  PORTAL_COLOR_DEFS: "portal_color_defs",
  PART_SHAPE_DEFS: "part_shape_defs",
  WEAR_PRESET_DEFS: "wear_preset_defs",
  OBSTACLE_TAG_DEFS: "obstacle_tag_defs",
  BEY_TYPE_DEFS: "bey_type_defs",
  RESET_CONDITION_DEFS: "reset_condition_defs",
  LIQUID_TYPE_DEFS: "liquid_type_defs",
  HAZARD_TYPE_DEFS: "hazard_type_defs",
  ELEMENT_STAT_DEFS: "element_stat_defs",
  ARENA_TEMPLATE_DEFS: "arena_template_defs",
  COLLISION_QTE_EVENTS: "collision_qte_events",
  SPECIAL_CLASH_EVENTS: "special_clash_events",
  // Phase 28: BitBeast assets
  BITBEAST_ASSETS: "bitbeast_assets",
  // Phase 23: Universal Preset Library
  ARENA_PRESETS: "arena_presets",
  BEY_PRESETS: "bey_presets",
  COMBO_PRESETS: "combo_presets",
  MECHANIC_PRESETS: "mechanic_presets",
  GIMMICK_PRESETS: "gimmick_presets",
  SPECIAL_MOVE_PRESETS: "special_move_presets",
  PART_PRESETS: "part_presets",
  SYSTEM_PRESETS: "system_presets",
  THEME_PRESETS: "theme_presets",
  OBSTACLE_PRESETS: "obstacle_presets",
  FEATURE_GROUP_PRESETS: "feature_group_presets",
  // RPG Story Mode collections
  RPG_MAPS: "rpg_maps",
  RPG_NPCS: "rpg_npcs",
  RPG_QUESTS: "rpg_quests",
  RPG_DIALOGUES: "rpg_dialogues",
  RPG_STORY_EVENTS: "rpg_story_events",
  RPG_CUTSCENES: "rpg_cutscenes",
  RPG_ITEMS: "rpg_items",
  RPG_REGIONS: "rpg_regions",
  RPG_BADGES: "rpg_badges",
  RPG_ARCS: "rpg_arcs",
  RPG_ROUTES: "rpg_routes",
  RPG_CONFIG: "rpg_config",
  RPG_SAVES: "rpg_saves",
  // RPG open definition collections
  RPG_MAP_TYPE_DEFS: "rpg_map_type_defs",
  RPG_NPC_TYPE_DEFS: "rpg_npc_type_defs",
  RPG_BADGE_CATEGORY_DEFS: "rpg_badge_category_defs",
  RPG_ITEM_CATEGORY_DEFS: "rpg_item_category_defs",
  RPG_QUEST_CATEGORY_DEFS: "rpg_quest_category_defs",
  RPG_EVENT_CATEGORY_DEFS: "rpg_event_category_defs",
  RPG_TRAVEL_MODE_DEFS: "rpg_travel_mode_defs",
  RPG_TRIGGER_MODE_DEFS: "rpg_trigger_mode_defs",
  RPG_FACING_DEFS: "rpg_facing_defs",
  // AI preset collections (client-side AI system)
  AI_CHARACTER_PROFILES: "ai_character_profiles",
  AI_BEY_PERSONALITIES: "ai_bey_personalities",
  AI_DIFFICULTY_PROFILES: "ai_difficulty_profiles",
  // Story mode collections
  SEASONS: "seasons",
  EPISODES: "episodes",
  PLAYER_PROGRESS: "player_progress",
  // Replay system
  MATCH_REPLAYS: "match_replays",
} as const;

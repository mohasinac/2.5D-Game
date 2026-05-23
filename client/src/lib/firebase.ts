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
} as const;

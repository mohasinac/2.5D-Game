/**
 * configCache — client-side two-tier config preload system (Phase 2n).
 *
 * Tier 1: TypeScript physics registries — imported synchronously, zero Firestore.
 * Tier 2: Admin-created Firestore content — fetched once on login, stored in Zustand
 *          + localStorage (with version-based invalidation).
 *
 * Game pages call configCache.getArena(id) instead of db.collection("arenas").doc(id).get().
 * The configCache.status field tells pages whether the cache is ready.
 */

import { create } from "zustand";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Tier 1: TypeScript registries (synchronous, zero Firestore) ─────────────

export {
  MaterialRegistry,
  resolveMaterial,
  resolveCOR,
  type MaterialProfile,
} from "@server/physics/registries/MaterialRegistry";

export {
  AttackTypeRegistry,
  resolveAttackType,
  type AttackTypeProfile,
} from "@server/physics/registries/AttackTypeRegistry";

export {
  GenerationRegistry,
  type GenerationProfile,
  type BeybladeGenKey,
} from "@server/physics/registries/GenerationRegistry";

export {
  TipShapeRegistry,
  type TipShapeProfile,
} from "@server/physics/registries/TipShapeRegistry";

export {
  LiquidTypeRegistry,
  type LiquidTypeProfile,
} from "@server/physics/registries/LiquidTypeRegistry";

export {
  ElementTypeRegistry,
  type ElementTypeProfile,
  type ElementInteraction,
} from "@server/physics/registries/ElementTypeRegistry";

export {
  BowlProfileRegistry,
  type BowlProfile,
} from "@server/physics/registries/BowlProfileRegistry";

export {
  ArenaShapeRegistry,
  type ArenaShapeProfile,
} from "@server/physics/registries/ArenaShapeRegistry";

export {
  PartLayerRegistry,
  type PartLayerProfile,
} from "@server/physics/registries/PartLayerRegistry";

export {
  GimmickRegistry,
  type GimmickDef,
  type MechanicRef,
} from "@server/physics/registries/GimmickRegistry";

// ─── Tier 2: Firestore admin-created content ─────────────────────────────────

/** Collections to preload from Firestore. */
const FIRESTORE_COLLECTIONS = [
  "arenas",
  "beyblade_stats",
  "special_moves",
  "combos",
  "attack_ring_parts",
  "weight_disk_parts",
  "tip_parts",
  "core_parts",
  "casing_parts",
  "spin_track_parts",
  "sub_parts",
  "bit_beast_parts",
  "gear_parts",
  "beyblade_systems",
  "arena_systems",
  "part_materials",
  "element_type_configs",
  "turret_attack_types",
  "arena_feature_configs",
  "bey_link_configs",
  "mechanic_defs",
  "gimmick_defs",
  "geometry_defs",
  "stat_defs",
  "tip_shape_defs",
  "core_gimmick_defs",
  "attack_type_defs",
  "arena_theme_defs",
  "arena_shape_defs",
  "bowl_profile_defs",
  "particle_presets",
  "animation_presets",
  "combo_effects",
  "behavior_defs",
  "round_modifiers",
  "ai_battles",
  "ai_character_profiles",
  "ai_bey_personalities",
  "ai_difficulty_profiles",
  "arena_presets",
  "bey_presets",
  "special_move_presets",
  "combo_presets",
  "gimmick_presets",
  "mechanic_presets",
  "system_presets",
  "stack_templates",
] as const;

/** beyblade_stacks needs a where("isPublic", "==", true) filter — handled separately. */
const FILTERED_COLLECTIONS: Record<string, { field: string; value: unknown }> = {
  beyblade_stacks: { field: "isPublic", value: true },
};

// ─── Zustand store ────────────────────────────────────────────────────────────

export type ConfigStatus = "idle" | "loading" | "ready" | "error";

interface ConfigStore {
  firestoreData: Record<string, Record<string, unknown>>;
  configVersion: string;
  loadedAt: number;
  configStatus: ConfigStatus;
  configError: string | undefined;
  _setData: (data: Record<string, Record<string, unknown>>, version: string) => void;
  _setStatus: (status: ConfigStatus, error?: string) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  firestoreData: {},
  configVersion: "",
  loadedAt: 0,
  configStatus: "idle",
  configError: undefined,
  _setData: (data, version) =>
    set({ firestoreData: data, configVersion: version, loadedAt: Date.now(), configStatus: "ready", configError: undefined }),
  _setStatus: (configStatus, configError) =>
    set({ configStatus, configError }),
}));

// ─── localStorage persistence ─────────────────────────────────────────────────

const LS_KEY = "beyblade-config-cache";

interface StoredCache {
  version: string;
  loadedAt: number;
  data: Record<string, Record<string, unknown>>;
}

function tryRestoreFromStorage(expectedVersion: string): Record<string, Record<string, unknown>> | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const stored: StoredCache = JSON.parse(raw);
    if (stored.version !== expectedVersion) return null;
    return stored.data;
  } catch {
    return null;
  }
}

function tryPersistToStorage(data: Record<string, Record<string, unknown>>, version: string): void {
  try {
    const payload: StoredCache = { version, loadedAt: Date.now(), data };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch {
    // Quota exceeded or unavailable — in-memory only
  }
}

// ─── Preload function ─────────────────────────────────────────────────────────

let _preloadPromise: Promise<void> | null = null;

/** Call once after user signs in. Idempotent — safe to call multiple times. */
export async function preloadConfig(): Promise<void> {
  const store = useConfigStore.getState();
  if (store.configStatus === "loading" || store.configStatus === "ready") return;
  if (_preloadPromise) return _preloadPromise;

  _preloadPromise = _doPreload().finally(() => { _preloadPromise = null; });
  return _preloadPromise;
}

async function _doPreload(): Promise<void> {
  const { _setData, _setStatus } = useConfigStore.getState();
  _setStatus("loading");

  try {
    // Step 1: read the config version (single lightweight Firestore read)
    let configVersion = "v1";
    try {
      const settingsSnap = await getDoc(doc(db, "settings", "game"));
      if (settingsSnap.exists()) {
        const v = settingsSnap.data()?.configVersion;
        if (v) configVersion = String(v);
      }
    } catch {
      // settings doc missing — use default version
    }

    // Step 2: try localStorage restore
    const cached = tryRestoreFromStorage(configVersion);
    if (cached) {
      _setData(cached, configVersion);
      return;
    }

    // Step 3: parallel Firestore fetches for all collections
    const allData: Record<string, Record<string, unknown>> = {};

    const results = await Promise.allSettled([
      // Regular collections (fetch all docs)
      ...FIRESTORE_COLLECTIONS.map(async (col) => {
        try {
          const snap = await getDocs(collection(db, col));
          const docs: Record<string, unknown> = {};
          snap.forEach((d) => { docs[d.id] = d.data(); });
          allData[col] = docs;
        } catch {
          allData[col] = {};
        }
      }),
      // Filtered collections (e.g. beyblade_stacks with isPublic filter)
      ...Object.entries(FILTERED_COLLECTIONS).map(async ([col, filter]) => {
        try {
          const q = query(collection(db, col), where(filter.field, "==", filter.value));
          const snap = await getDocs(q);
          const docs: Record<string, unknown> = {};
          snap.forEach((d) => { docs[d.id] = d.data(); });
          allData[col] = docs;
        } catch {
          allData[col] = {};
        }
      }),
    ]);

    // Log any individual fetch failures (non-fatal)
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.warn(`[configCache] fetch ${i} failed:`, result.reason);
      }
    });

    // Step 4: persist to localStorage for future loads
    tryPersistToStorage(allData, configVersion);

    // Step 5: update store
    _setData(allData, configVersion);
  } catch (err) {
    console.error("[configCache] preload failed:", err);
    _setStatus("error", err instanceof Error ? err.message : String(err));
  }
}

/** Invalidate and re-fetch all Firestore config (e.g. after admin version bump). */
export async function refreshConfig(): Promise<void> {
  try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  useConfigStore.getState()._setStatus("idle");
  _preloadPromise = null;
  return preloadConfig();
}

// ─── Typed getter object ──────────────────────────────────────────────────────

function firestoreGet<T = unknown>(col: string, id: string): T | undefined {
  return useConfigStore.getState().firestoreData[col]?.[id] as T | undefined;
}

function firestoreAll<T = unknown>(col: string): T[] {
  return Object.values(useConfigStore.getState().firestoreData[col] ?? {}) as T[];
}

export const configCache = {
  // ── Status ──
  get status() { return useConfigStore.getState().configStatus; },

  // ── Firestore: core game entities ──
  getArena:       (id: string) => firestoreGet("arenas", id),
  getBeyblade:    (id: string) => firestoreGet("beyblade_stats", id),
  getSpecialMove: (id: string) => firestoreGet("special_moves", id),
  getCombo:       (id: string) => firestoreGet("combos", id),
  getAllArenas:    () => firestoreAll("arenas"),
  getAllBeyblades: () => firestoreAll("beyblade_stats"),
  getAllSpecialMoves: () => firestoreAll("special_moves"),
  getAllCombos:    () => firestoreAll("combos"),

  // ── Firestore: part collections ──
  getPart: (partCollection: string, id: string) => firestoreGet(partCollection, id),
  getAllParts: (partCollection: string) => firestoreAll(partCollection),
  getAttackRingPart: (id: string) => firestoreGet("attack_ring_parts", id),
  getWeightDiskPart: (id: string) => firestoreGet("weight_disk_parts", id),
  getTipPart:        (id: string) => firestoreGet("tip_parts", id),
  getCorePart:       (id: string) => firestoreGet("core_parts", id),
  getCasingPart:     (id: string) => firestoreGet("casing_parts", id),
  getSpinTrackPart:  (id: string) => firestoreGet("spin_track_parts", id),
  getSubPart:        (id: string) => firestoreGet("sub_parts", id),
  getBitBeastPart:   (id: string) => firestoreGet("bit_beast_parts", id),
  getGearPart:       (id: string) => firestoreGet("gear_parts", id),
  getAllAttackRingParts: () => firestoreAll("attack_ring_parts"),
  getAllWeightDiskParts: () => firestoreAll("weight_disk_parts"),
  getAllTipParts:        () => firestoreAll("tip_parts"),
  getAllCoreParts:       () => firestoreAll("core_parts"),
  getAllCasingParts:     () => firestoreAll("casing_parts"),
  getAllSpinTrackParts:  () => firestoreAll("spin_track_parts"),
  getAllSubParts:        () => firestoreAll("sub_parts"),
  getAllBitBeastParts:   () => firestoreAll("bit_beast_parts"),
  getAllGearParts:       () => firestoreAll("gear_parts"),

  // ── Firestore: systems ──
  getBeybladeSystem: (id: string) => firestoreGet("beyblade_systems", id),
  getArenaSystem:    (id: string) => firestoreGet("arena_systems", id),
  getAllBeybladeSystems: () => firestoreAll("beyblade_systems"),

  // ── Firestore: public stacks (pre-filtered) ──
  getPublicStack: (id: string) => firestoreGet("beyblade_stacks", id),
  getAllPublicStacks: () => firestoreAll("beyblade_stacks"),
  getStackTemplate:  (id: string) => firestoreGet("stack_templates", id),
  getAllStackTemplates: () => firestoreAll("stack_templates"),

  // ── Firestore: def collections (admin-editable dropdowns) ──
  getMechanicDef:    (id: string) => firestoreGet("mechanic_defs", id),
  getGimmickDef:     (id: string) => firestoreGet("gimmick_defs", id),
  getArenaThemeDef:  (id: string) => firestoreGet("arena_theme_defs", id),
  getTipShapeDef:    (id: string) => firestoreGet("tip_shape_defs", id),
  getAttackTypeDef:  (id: string) => firestoreGet("attack_type_defs", id),
  getElementTypeConfig: (id: string) => firestoreGet("element_type_configs", id),
  getPartMaterial:   (id: string) => firestoreGet("part_materials", id),
  getAllMechanicDefs:    () => firestoreAll("mechanic_defs"),
  getAllGimmickDefs:     () => firestoreAll("gimmick_defs"),
  getAllArenaThemeDefs:  () => firestoreAll("arena_theme_defs"),
  getAllTipShapeDefs:    () => firestoreAll("tip_shape_defs"),
  getAllAttackTypeDefs:  () => firestoreAll("attack_type_defs"),
  getAllElementTypeConfigs: () => firestoreAll("element_type_configs"),
  getAllPartMaterials:   () => firestoreAll("part_materials"),
  getAllArenaShapeDefs:  () => firestoreAll("arena_shape_defs"),
  getAllBowlProfileDefs: () => firestoreAll("bowl_profile_defs"),

  // ── Firestore: presets ──
  getAllArenaPresets:       () => firestoreAll("arena_presets"),
  getAllBeyPresets:         () => firestoreAll("bey_presets"),
  getAllSpecialMovePresets: () => firestoreAll("special_move_presets"),
  getAllComboPresets:       () => firestoreAll("combo_presets"),
  getAllGimmickPresets:     () => firestoreAll("gimmick_presets"),
  getAllMechanicPresets:    () => firestoreAll("mechanic_presets"),
  getAllSystemPresets:      () => firestoreAll("system_presets"),

  // ── Firestore: AI profiles ──
  getAICharacterProfile: (id: string) => firestoreGet("ai_character_profiles", id),
  getAIBeyPersonality:   (id: string) => firestoreGet("ai_bey_personalities", id),
  getAIDifficultyProfile:(id: string) => firestoreGet("ai_difficulty_profiles", id),
  getAllAICharacterProfiles: () => firestoreAll("ai_character_profiles"),
  getAllAIBeyPersonalities:  () => firestoreAll("ai_bey_personalities"),
  getAllAIDifficultyProfiles:() => firestoreAll("ai_difficulty_profiles"),
};

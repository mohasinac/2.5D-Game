// Central Zustand store for all catalog data fetched from Firebase.
// Shared across admin and game pages — fetch once, use everywhere.
// Game pages pre-load by calling fetchAll() before mounting the game canvas.

import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";

// ─── Document shapes ─────────────────────────────────────────────────────────

export interface ComboDoc {
  id: string;
  name: string;
  sequence: string[];
  cost: number;
  type: string;
  description: string;
  cooldownMs: number;
  effectId?: string;
}

export interface SpecialMoveDoc {
  id: string;
  name: string;
  kind: string;
  iconEmoji: string;
  cooldownSec: number;
  durationMs: number;
  description?: string;
  type?: string;
  isDefault?: boolean;
  effects?: Record<string, number>;
  flashColor?: string;
  visual?: { screenFlashColor?: string };
}

export interface TurretAttackTypeDoc {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

export interface ArenaFeatureConfigDoc {
  id: string;
  label: string;
  category: "hazard" | "effect_zone" | "particle" | "env_preset";
  description: string;
  icon?: string;
  color?: string;
}

export interface PartMaterialDoc {
  id: string;
  label: string;
  description?: string;
  gripFactor?: number;
  aggressiveness?: number;
  recoilFactor?: number;
  surfaceFriction?: number;
  density?: number;
  durabilityDecay?: number;
}

export interface BeyLinkConfigDoc {
  id: string;
  label: string;
  category:
    | "link_type"
    | "reverse_condition"
    | "bey_link_type"
    | "alignment"
    | "trigger_condition"
    | "effect_type"
    | "control_mode"
    | "movement_control"
    | "group_pattern";
  description: string;
  color?: string;
}

export interface AssetDoc {
  id: string;
  name: string;
  url: string;
  tag?: string;
  tags?: string[];
}

// ─── Store shape ──────────────────────────────────────────────────────────────

interface GameDataState {
  combos: ComboDoc[];
  combosLoaded: boolean;
  specialMoves: SpecialMoveDoc[];
  specialMovesLoaded: boolean;
  turretAttackTypes: TurretAttackTypeDoc[];
  turretAttackTypesLoaded: boolean;
  arenaFeatureConfigs: ArenaFeatureConfigDoc[];
  arenaFeatureConfigsLoaded: boolean;
  beyLinkConfigs: BeyLinkConfigDoc[];
  beyLinkConfigsLoaded: boolean;
  partMaterials: PartMaterialDoc[];
  partMaterialsLoaded: boolean;
  // Asset library: keyed by collectionName (optionally suffixed with ":tag")
  assets: Record<string, AssetDoc[]>;
  assetsLoaded: Record<string, boolean>;
  // Per-slice loading/error
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;

  fetchCombos: () => Promise<void>;
  fetchSpecialMoves: () => Promise<void>;
  fetchTurretAttackTypes: () => Promise<void>;
  fetchArenaFeatureConfigs: () => Promise<void>;
  fetchBeyLinkConfigs: () => Promise<void>;
  fetchPartMaterials: () => Promise<void>;
  fetchAssets: (collectionName: string, tag?: string) => Promise<void>;
  /** Pre-load all catalog data — call this at game page mount. */
  fetchAll: () => Promise<void>;
  invalidate: (slice: "combos" | "specialMoves" | "turretAttackTypes" | "arenaFeatureConfigs" | "beyLinkConfigs" | "partMaterials") => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameDataStore = create<GameDataState>()((set, get) => ({
  combos: [],
  combosLoaded: false,
  specialMoves: [],
  specialMovesLoaded: false,
  turretAttackTypes: [],
  turretAttackTypesLoaded: false,
  arenaFeatureConfigs: [],
  arenaFeatureConfigsLoaded: false,
  beyLinkConfigs: [],
  beyLinkConfigsLoaded: false,
  partMaterials: [],
  partMaterialsLoaded: false,
  assets: {},
  assetsLoaded: {},
  loading: {},
  errors: {},

  fetchCombos: async () => {
    if (get().combosLoaded) return;
    set(s => ({ loading: { ...s.loading, combos: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.COMBOS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ComboDoc));
      docs.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
      set(s => ({ combos: docs, combosLoaded: true, loading: { ...s.loading, combos: false }, errors: { ...s.errors, combos: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, combos: false }, errors: { ...s.errors, combos: "Failed to load combos" } }));
    }
  },

  fetchSpecialMoves: async () => {
    if (get().specialMovesLoaded) return;
    set(s => ({ loading: { ...s.loading, specialMoves: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.SPECIAL_MOVES));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as SpecialMoveDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      set(s => ({ specialMoves: docs, specialMovesLoaded: true, loading: { ...s.loading, specialMoves: false }, errors: { ...s.errors, specialMoves: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, specialMoves: false }, errors: { ...s.errors, specialMoves: "Failed to load special moves" } }));
    }
  },

  fetchTurretAttackTypes: async () => {
    if (get().turretAttackTypesLoaded) return;
    set(s => ({ loading: { ...s.loading, turretAttackTypes: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.TURRET_ATTACK_TYPES));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as TurretAttackTypeDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ turretAttackTypes: docs, turretAttackTypesLoaded: true, loading: { ...s.loading, turretAttackTypes: false }, errors: { ...s.errors, turretAttackTypes: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, turretAttackTypes: false }, errors: { ...s.errors, turretAttackTypes: "Failed to load turret attack types" } }));
    }
  },

  fetchArenaFeatureConfigs: async () => {
    if (get().arenaFeatureConfigsLoaded) return;
    set(s => ({ loading: { ...s.loading, arenaFeatureConfigs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ARENA_FEATURE_CONFIGS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ArenaFeatureConfigDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ arenaFeatureConfigs: docs, arenaFeatureConfigsLoaded: true, loading: { ...s.loading, arenaFeatureConfigs: false }, errors: { ...s.errors, arenaFeatureConfigs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, arenaFeatureConfigs: false }, errors: { ...s.errors, arenaFeatureConfigs: "Failed to load arena feature configs" } }));
    }
  },

  fetchBeyLinkConfigs: async () => {
    if (get().beyLinkConfigsLoaded) return;
    set(s => ({ loading: { ...s.loading, beyLinkConfigs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.BEY_LINK_CONFIGS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as BeyLinkConfigDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ beyLinkConfigs: docs, beyLinkConfigsLoaded: true, loading: { ...s.loading, beyLinkConfigs: false }, errors: { ...s.errors, beyLinkConfigs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, beyLinkConfigs: false }, errors: { ...s.errors, beyLinkConfigs: "Failed to load bey link configs" } }));
    }
  },

  fetchPartMaterials: async () => {
    if (get().partMaterialsLoaded) return;
    set(s => ({ loading: { ...s.loading, partMaterials: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.PART_MATERIALS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as PartMaterialDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ partMaterials: docs, partMaterialsLoaded: true, loading: { ...s.loading, partMaterials: false }, errors: { ...s.errors, partMaterials: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, partMaterials: false }, errors: { ...s.errors, partMaterials: "Failed to load tip materials" } }));
    }
  },

  fetchAssets: async (collectionName: string, tag?: string) => {
    const key = tag ? `${collectionName}:${tag}` : collectionName;
    if (get().assetsLoaded[key]) return;
    set(s => ({ loading: { ...s.loading, [key]: true } }));
    try {
      const snap = await getDocs(collection(db, collectionName));
      let docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as AssetDoc));
      if (tag) {
        docs = docs.filter(d => d.tag === tag || (Array.isArray(d.tags) && d.tags.includes(tag)));
      }
      docs.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      set(s => ({
        assets: { ...s.assets, [key]: docs },
        assetsLoaded: { ...s.assetsLoaded, [key]: true },
        loading: { ...s.loading, [key]: false },
        errors: { ...s.errors, [key]: null },
      }));
    } catch {
      set(s => ({ loading: { ...s.loading, [key]: false }, errors: { ...s.errors, [key]: `Failed to load assets from ${collectionName}` } }));
    }
  },

  fetchAll: async () => {
    const { fetchCombos, fetchSpecialMoves, fetchTurretAttackTypes, fetchArenaFeatureConfigs, fetchBeyLinkConfigs, fetchPartMaterials } = get();
    await Promise.all([fetchCombos(), fetchSpecialMoves(), fetchTurretAttackTypes(), fetchArenaFeatureConfigs(), fetchBeyLinkConfigs(), fetchPartMaterials()]);
  },

  invalidate: (slice) => {
    if (slice === "combos") set({ combosLoaded: false, combos: [] });
    if (slice === "specialMoves") set({ specialMovesLoaded: false, specialMoves: [] });
    if (slice === "turretAttackTypes") set({ turretAttackTypesLoaded: false, turretAttackTypes: [] });
    if (slice === "arenaFeatureConfigs") set({ arenaFeatureConfigsLoaded: false, arenaFeatureConfigs: [] });
    if (slice === "beyLinkConfigs") set({ beyLinkConfigsLoaded: false, beyLinkConfigs: [] });
    if (slice === "partMaterials") set({ partMaterialsLoaded: false, partMaterials: [] });
  },
}));

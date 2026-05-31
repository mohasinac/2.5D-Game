// Central Zustand store for all catalog data fetched from Firebase.
// Shared across admin and game pages — fetch once, use everywhere.
// Game pages pre-load by calling fetchAll() before mounting the game canvas.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";

const CATALOG_TTL_MS = 60 * 60 * 1000; // 60 min

function isFresh(fetchedAt: Record<string, number>, key: string): boolean {
  const t = fetchedAt[key];
  return typeof t === "number" && Date.now() - t < CATALOG_TTL_MS;
}

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
  color?: string;
  gripFactor?: number;
  aggressiveness?: number;
  recoilFactor?: number;
  surfaceFriction?: number;
  density?: number;
  durabilityDecay?: number;
}

// ─── Option preset doc types ──────────────────────────────────────────────────

export interface TipShapeDoc { id: string; label: string; description?: string; }
export interface CoreGimmickDoc { id: string; label: string; description?: string; hasPhysicsImpl?: boolean; }
export interface AttackTypeDoc { id: string; label: string; description?: string; multiplier?: number; color?: string; }
export interface ArenaThemeDoc { id: string; label: string; color?: string; description?: string; }
export interface ArenaShapeDoc { id: string; label: string; vertexCount?: number; description?: string; }
export interface BowlProfileDoc { id: string; label: string; wallAngle: number; description?: string; }
export interface TriggerTypeDoc { id: string; label: string; description?: string; }
export interface StatEventDoc { id: string; label: string; description?: string; }
export interface PartLayerDoc { id: string; label: string; description?: string; }
export interface StatDefDoc { id: string; name: string; category: string; type: string; description: string; min?: number; max?: number; default?: number; step?: number; unit?: string; affectsPhysics?: boolean; }

// ─── Game entity doc types ────────────────────────────────────────────────────

export interface ArenaDoc {
  id: string;
  name: string;
  shape?: string;
  theme?: string;
  width?: number;
  height?: number;
  wallAngle?: number;
  arenaPixelRadius?: number;
  description?: string;
  [key: string]: unknown;
}

export interface BeybladeStatDoc {
  id: string;
  name: string;
  type?: string;
  color?: string;
  spinDirection?: string;
  radius?: number;
  maxSpin?: number;
  specialMoveId?: string;
  comboIds?: string[];
  [key: string]: unknown;
}

export interface GimmickDefDoc {
  id: string;
  name: string;
  description?: string;
  behaviorRefs?: string[];
  mechanicInstances?: unknown[];
  [key: string]: unknown;
}

export interface MechanicDefDoc {
  id: string;
  name: string;
  handler?: string;
  description?: string;
  [key: string]: unknown;
}

export interface RoundModifierDoc {
  id: string;
  name: string;
  description?: string;
  category?: string;
  effects?: Record<string, unknown>;
  [key: string]: unknown;
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

type InvalidateSlice =
  | "combos" | "specialMoves" | "turretAttackTypes" | "arenaFeatureConfigs"
  | "beyLinkConfigs" | "partMaterials"
  | "tipShapes" | "coreGimmicks" | "attackTypeDefs" | "arenaThemeDefs"
  | "arenaShapeDefs" | "bowlProfileDefs" | "triggerTypeDefs" | "statEventDefs"
  | "partLayerDefs" | "statDefs"
  | "arenas" | "beyblades" | "gimmickDefs" | "mechanicDefs" | "roundModifiers";

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
  // Option preset slices
  tipShapes: TipShapeDoc[];
  tipShapesLoaded: boolean;
  coreGimmicks: CoreGimmickDoc[];
  coreGimmicksLoaded: boolean;
  attackTypeDefs: AttackTypeDoc[];
  attackTypeDefsLoaded: boolean;
  arenaThemeDefs: ArenaThemeDoc[];
  arenaThemeDefsLoaded: boolean;
  arenaShapeDefs: ArenaShapeDoc[];
  arenaShapeDefsLoaded: boolean;
  bowlProfileDefs: BowlProfileDoc[];
  bowlProfileDefsLoaded: boolean;
  triggerTypeDefs: TriggerTypeDoc[];
  triggerTypeDefsLoaded: boolean;
  statEventDefs: StatEventDoc[];
  statEventDefsLoaded: boolean;
  partLayerDefs: PartLayerDoc[];
  partLayerDefsLoaded: boolean;
  statDefs: StatDefDoc[];
  statDefsLoaded: boolean;
  // Asset library: keyed by collectionName (optionally suffixed with ":tag")
  assets: Record<string, AssetDoc[]>;
  assetsLoaded: Record<string, boolean>;
  // Per-slice loading/error
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  // TTL timestamps — set on successful fetch, cleared by invalidate()
  _fetchedAt: Record<string, number>;

  fetchCombos: () => Promise<void>;
  fetchSpecialMoves: () => Promise<void>;
  fetchTurretAttackTypes: () => Promise<void>;
  fetchArenaFeatureConfigs: () => Promise<void>;
  fetchBeyLinkConfigs: () => Promise<void>;
  fetchPartMaterials: () => Promise<void>;
  fetchTipShapes: () => Promise<void>;
  fetchCoreGimmicks: () => Promise<void>;
  fetchAttackTypeDefs: () => Promise<void>;
  fetchArenaThemeDefs: () => Promise<void>;
  fetchArenaShapeDefs: () => Promise<void>;
  fetchBowlProfileDefs: () => Promise<void>;
  fetchTriggerTypeDefs: () => Promise<void>;
  fetchStatEventDefs: () => Promise<void>;
  fetchPartLayerDefs: () => Promise<void>;
  fetchStatDefs: () => Promise<void>;
  fetchAssets: (collectionName: string, tag?: string) => Promise<void>;
  /** Pre-load all catalog data — call this at game page mount. */
  // Game entity slices
  arenas: ArenaDoc[];
  arenasLoaded: boolean;
  beyblades: BeybladeStatDoc[];
  beyblaDes: boolean;  // backward-compat typo guard — use beyblaDes internally
  beybladeStats: BeybladeStatDoc[];
  beybladeStatsLoaded: boolean;
  gimmickDefs: GimmickDefDoc[];
  gimmickDefsLoaded: boolean;
  mechanicDefs: MechanicDefDoc[];
  mechanicDefsLoaded: boolean;
  roundModifiers: RoundModifierDoc[];
  roundModifiersLoaded: boolean;

  fetchArenas: () => Promise<void>;
  fetchBeybladeStats: () => Promise<void>;
  fetchGimmickDefs: () => Promise<void>;
  fetchMechanicDefs: () => Promise<void>;
  fetchRoundModifiers: () => Promise<void>;
  fetchAll: () => Promise<void>;
  invalidate: (slice: InvalidateSlice) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameDataStore = create<GameDataState>()(persist((set, get) => ({
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
  tipShapes: [],
  tipShapesLoaded: false,
  coreGimmicks: [],
  coreGimmicksLoaded: false,
  attackTypeDefs: [],
  attackTypeDefsLoaded: false,
  arenaThemeDefs: [],
  arenaThemeDefsLoaded: false,
  arenaShapeDefs: [],
  arenaShapeDefsLoaded: false,
  bowlProfileDefs: [],
  bowlProfileDefsLoaded: false,
  triggerTypeDefs: [],
  triggerTypeDefsLoaded: false,
  statEventDefs: [],
  statEventDefsLoaded: false,
  partLayerDefs: [],
  partLayerDefsLoaded: false,
  statDefs: [],
  statDefsLoaded: false,
  assets: {},
  assetsLoaded: {},
  loading: {},
  errors: {},
  _fetchedAt: {},
  // Game entity initial values
  arenas: [],
  arenasLoaded: false,
  beyblades: [],
  beyblaDes: false,
  beybladeStats: [],
  beybladeStatsLoaded: false,
  gimmickDefs: [],
  gimmickDefsLoaded: false,
  mechanicDefs: [],
  mechanicDefsLoaded: false,
  roundModifiers: [],
  roundModifiersLoaded: false,

  fetchCombos: async () => {
    if (isFresh(get()._fetchedAt, 'combos')) return;
    set(s => ({ loading: { ...s.loading, combos: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.COMBOS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ComboDoc));
      docs.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
      set(s => ({ combos: docs, combosLoaded: true, _fetchedAt: { ...s._fetchedAt, combos: Date.now() }, loading: { ...s.loading, combos: false }, errors: { ...s.errors, combos: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, combos: false }, errors: { ...s.errors, combos: "Failed to load combos" } }));
    }
  },

  fetchSpecialMoves: async () => {
    if (isFresh(get()._fetchedAt, 'specialMoves')) return;
    set(s => ({ loading: { ...s.loading, specialMoves: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.SPECIAL_MOVES));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as SpecialMoveDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      set(s => ({ specialMoves: docs, specialMovesLoaded: true, _fetchedAt: { ...s._fetchedAt, specialMoves: Date.now() }, loading: { ...s.loading, specialMoves: false }, errors: { ...s.errors, specialMoves: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, specialMoves: false }, errors: { ...s.errors, specialMoves: "Failed to load special moves" } }));
    }
  },

  fetchTurretAttackTypes: async () => {
    if (isFresh(get()._fetchedAt, 'turretAttackTypes')) return;
    set(s => ({ loading: { ...s.loading, turretAttackTypes: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.TURRET_ATTACK_TYPES));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as TurretAttackTypeDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ turretAttackTypes: docs, turretAttackTypesLoaded: true, _fetchedAt: { ...s._fetchedAt, turretAttackTypes: Date.now() }, loading: { ...s.loading, turretAttackTypes: false }, errors: { ...s.errors, turretAttackTypes: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, turretAttackTypes: false }, errors: { ...s.errors, turretAttackTypes: "Failed to load turret attack types" } }));
    }
  },

  fetchArenaFeatureConfigs: async () => {
    if (isFresh(get()._fetchedAt, 'arenaFeatureConfigs')) return;
    set(s => ({ loading: { ...s.loading, arenaFeatureConfigs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ARENA_FEATURE_CONFIGS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ArenaFeatureConfigDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ arenaFeatureConfigs: docs, arenaFeatureConfigsLoaded: true, _fetchedAt: { ...s._fetchedAt, arenaFeatureConfigs: Date.now() }, loading: { ...s.loading, arenaFeatureConfigs: false }, errors: { ...s.errors, arenaFeatureConfigs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, arenaFeatureConfigs: false }, errors: { ...s.errors, arenaFeatureConfigs: "Failed to load arena feature configs" } }));
    }
  },

  fetchBeyLinkConfigs: async () => {
    if (isFresh(get()._fetchedAt, 'beyLinkConfigs')) return;
    set(s => ({ loading: { ...s.loading, beyLinkConfigs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.BEY_LINK_CONFIGS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as BeyLinkConfigDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ beyLinkConfigs: docs, beyLinkConfigsLoaded: true, _fetchedAt: { ...s._fetchedAt, beyLinkConfigs: Date.now() }, loading: { ...s.loading, beyLinkConfigs: false }, errors: { ...s.errors, beyLinkConfigs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, beyLinkConfigs: false }, errors: { ...s.errors, beyLinkConfigs: "Failed to load bey link configs" } }));
    }
  },

  fetchPartMaterials: async () => {
    if (isFresh(get()._fetchedAt, 'partMaterials')) return;
    set(s => ({ loading: { ...s.loading, partMaterials: true } }));
    try {
      const snap = await getDocs(collection(db, "part_materials"));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as PartMaterialDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ partMaterials: docs, partMaterialsLoaded: true, _fetchedAt: { ...s._fetchedAt, partMaterials: Date.now() }, loading: { ...s.loading, partMaterials: false }, errors: { ...s.errors, partMaterials: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, partMaterials: false }, errors: { ...s.errors, partMaterials: "Failed to load tip materials" } }));
    }
  },

  fetchTipShapes: async () => {
    if (isFresh(get()._fetchedAt, 'tipShapes')) return;
    set(s => ({ loading: { ...s.loading, tipShapes: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.TIP_SHAPE_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as TipShapeDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ tipShapes: docs, tipShapesLoaded: true, _fetchedAt: { ...s._fetchedAt, tipShapes: Date.now() }, loading: { ...s.loading, tipShapes: false }, errors: { ...s.errors, tipShapes: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, tipShapes: false }, errors: { ...s.errors, tipShapes: "Failed to load tip shapes" } }));
    }
  },

  fetchCoreGimmicks: async () => {
    if (isFresh(get()._fetchedAt, 'coreGimmicks')) return;
    set(s => ({ loading: { ...s.loading, coreGimmicks: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CORE_GIMMICK_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as CoreGimmickDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ coreGimmicks: docs, coreGimmicksLoaded: true, _fetchedAt: { ...s._fetchedAt, coreGimmicks: Date.now() }, loading: { ...s.loading, coreGimmicks: false }, errors: { ...s.errors, coreGimmicks: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, coreGimmicks: false }, errors: { ...s.errors, coreGimmicks: "Failed to load core gimmicks" } }));
    }
  },

  fetchAttackTypeDefs: async () => {
    if (isFresh(get()._fetchedAt, 'attackTypeDefs')) return;
    set(s => ({ loading: { ...s.loading, attackTypeDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ATTACK_TYPE_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as AttackTypeDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ attackTypeDefs: docs, attackTypeDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, attackTypeDefs: Date.now() }, loading: { ...s.loading, attackTypeDefs: false }, errors: { ...s.errors, attackTypeDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, attackTypeDefs: false }, errors: { ...s.errors, attackTypeDefs: "Failed to load attack type defs" } }));
    }
  },

  fetchArenaThemeDefs: async () => {
    if (isFresh(get()._fetchedAt, 'arenaThemeDefs')) return;
    set(s => ({ loading: { ...s.loading, arenaThemeDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ARENA_THEME_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ArenaThemeDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ arenaThemeDefs: docs, arenaThemeDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, arenaThemeDefs: Date.now() }, loading: { ...s.loading, arenaThemeDefs: false }, errors: { ...s.errors, arenaThemeDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, arenaThemeDefs: false }, errors: { ...s.errors, arenaThemeDefs: "Failed to load arena theme defs" } }));
    }
  },

  fetchArenaShapeDefs: async () => {
    if (isFresh(get()._fetchedAt, 'arenaShapeDefs')) return;
    set(s => ({ loading: { ...s.loading, arenaShapeDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ARENA_SHAPE_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ArenaShapeDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ arenaShapeDefs: docs, arenaShapeDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, arenaShapeDefs: Date.now() }, loading: { ...s.loading, arenaShapeDefs: false }, errors: { ...s.errors, arenaShapeDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, arenaShapeDefs: false }, errors: { ...s.errors, arenaShapeDefs: "Failed to load arena shape defs" } }));
    }
  },

  fetchBowlProfileDefs: async () => {
    if (isFresh(get()._fetchedAt, 'bowlProfileDefs')) return;
    set(s => ({ loading: { ...s.loading, bowlProfileDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.BOWL_PROFILE_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as BowlProfileDoc));
      docs.sort((a, b) => (a.wallAngle ?? 0) - (b.wallAngle ?? 0));
      set(s => ({ bowlProfileDefs: docs, bowlProfileDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, bowlProfileDefs: Date.now() }, loading: { ...s.loading, bowlProfileDefs: false }, errors: { ...s.errors, bowlProfileDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, bowlProfileDefs: false }, errors: { ...s.errors, bowlProfileDefs: "Failed to load bowl profile defs" } }));
    }
  },

  fetchTriggerTypeDefs: async () => {
    if (isFresh(get()._fetchedAt, 'triggerTypeDefs')) return;
    set(s => ({ loading: { ...s.loading, triggerTypeDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.TRIGGER_TYPE_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as TriggerTypeDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ triggerTypeDefs: docs, triggerTypeDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, triggerTypeDefs: Date.now() }, loading: { ...s.loading, triggerTypeDefs: false }, errors: { ...s.errors, triggerTypeDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, triggerTypeDefs: false }, errors: { ...s.errors, triggerTypeDefs: "Failed to load trigger type defs" } }));
    }
  },

  fetchStatEventDefs: async () => {
    if (isFresh(get()._fetchedAt, 'statEventDefs')) return;
    set(s => ({ loading: { ...s.loading, statEventDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.STAT_EVENT_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as StatEventDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ statEventDefs: docs, statEventDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, statEventDefs: Date.now() }, loading: { ...s.loading, statEventDefs: false }, errors: { ...s.errors, statEventDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, statEventDefs: false }, errors: { ...s.errors, statEventDefs: "Failed to load stat event defs" } }));
    }
  },

  fetchPartLayerDefs: async () => {
    if (isFresh(get()._fetchedAt, 'partLayerDefs')) return;
    set(s => ({ loading: { ...s.loading, partLayerDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.PART_LAYER_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as PartLayerDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      set(s => ({ partLayerDefs: docs, partLayerDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, partLayerDefs: Date.now() }, loading: { ...s.loading, partLayerDefs: false }, errors: { ...s.errors, partLayerDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, partLayerDefs: false }, errors: { ...s.errors, partLayerDefs: "Failed to load part layer defs" } }));
    }
  },

  fetchStatDefs: async () => {
    if (isFresh(get()._fetchedAt, 'statDefs')) return;
    set(s => ({ loading: { ...s.loading, statDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.STAT_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as StatDefDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      set(s => ({ statDefs: docs, statDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, statDefs: Date.now() }, loading: { ...s.loading, statDefs: false }, errors: { ...s.errors, statDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, statDefs: false }, errors: { ...s.errors, statDefs: "Failed to load stat defs" } }));
    }
  },

  fetchAssets: async (collectionName: string, tag?: string) => {
    const key = tag ? `${collectionName}:${tag}` : collectionName;
    if (isFresh(get()._fetchedAt, key)) return;
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
        _fetchedAt: { ...s._fetchedAt, [key]: Date.now() },
        loading: { ...s.loading, [key]: false },
        errors: { ...s.errors, [key]: null },
      }));
    } catch {
      set(s => ({ loading: { ...s.loading, [key]: false }, errors: { ...s.errors, [key]: `Failed to load assets from ${collectionName}` } }));
    }
  },

  fetchArenas: async () => {
    if (isFresh(get()._fetchedAt, 'arenas')) return;
    set(s => ({ loading: { ...s.loading, arenas: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ARENAS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ArenaDoc));
      docs.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      set(s => ({ arenas: docs, arenasLoaded: true, _fetchedAt: { ...s._fetchedAt, arenas: Date.now() }, loading: { ...s.loading, arenas: false }, errors: { ...s.errors, arenas: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, arenas: false }, errors: { ...s.errors, arenas: "Failed to load arenas" } }));
    }
  },

  fetchBeybladeStats: async () => {
    if (isFresh(get()._fetchedAt, 'beyblades')) return;
    set(s => ({ loading: { ...s.loading, beyblades: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as BeybladeStatDoc));
      docs.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      set(s => ({ beyblades: docs, beybladeStats: docs, beyblaDes: true, beybladeStatsLoaded: true, _fetchedAt: { ...s._fetchedAt, beyblades: Date.now() }, loading: { ...s.loading, beyblades: false }, errors: { ...s.errors, beyblades: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, beyblades: false }, errors: { ...s.errors, beyblades: "Failed to load beyblade stats" } }));
    }
  },

  fetchGimmickDefs: async () => {
    if (isFresh(get()._fetchedAt, 'gimmickDefs')) return;
    set(s => ({ loading: { ...s.loading, gimmickDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.GIMMICK_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as GimmickDefDoc));
      docs.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      set(s => ({ gimmickDefs: docs, gimmickDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, gimmickDefs: Date.now() }, loading: { ...s.loading, gimmickDefs: false }, errors: { ...s.errors, gimmickDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, gimmickDefs: false }, errors: { ...s.errors, gimmickDefs: "Failed to load gimmick defs" } }));
    }
  },

  fetchMechanicDefs: async () => {
    if (isFresh(get()._fetchedAt, 'mechanicDefs')) return;
    set(s => ({ loading: { ...s.loading, mechanicDefs: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.MECHANIC_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as MechanicDefDoc));
      docs.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      set(s => ({ mechanicDefs: docs, mechanicDefsLoaded: true, _fetchedAt: { ...s._fetchedAt, mechanicDefs: Date.now() }, loading: { ...s.loading, mechanicDefs: false }, errors: { ...s.errors, mechanicDefs: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, mechanicDefs: false }, errors: { ...s.errors, mechanicDefs: "Failed to load mechanic defs" } }));
    }
  },

  fetchRoundModifiers: async () => {
    if (isFresh(get()._fetchedAt, 'roundModifiers')) return;
    set(s => ({ loading: { ...s.loading, roundModifiers: true } }));
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ROUND_MODIFIERS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as RoundModifierDoc));
      docs.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      set(s => ({ roundModifiers: docs, roundModifiersLoaded: true, _fetchedAt: { ...s._fetchedAt, roundModifiers: Date.now() }, loading: { ...s.loading, roundModifiers: false }, errors: { ...s.errors, roundModifiers: null } }));
    } catch {
      set(s => ({ loading: { ...s.loading, roundModifiers: false }, errors: { ...s.errors, roundModifiers: "Failed to load round modifiers" } }));
    }
  },

  fetchAll: async () => {
    const g = get();
    // Core game data — all fetched in parallel; each respects its own TTL guard
    await Promise.all([
      g.fetchCombos(),
      g.fetchSpecialMoves(),
      g.fetchArenas(),
      g.fetchBeybladeStats(),
      g.fetchGimmickDefs(),
      g.fetchMechanicDefs(),
      g.fetchRoundModifiers(),
      // Config/def slices also pre-loaded so admin + game pages hit cache on first render
      g.fetchTurretAttackTypes(),
      g.fetchArenaFeatureConfigs(),
      g.fetchBeyLinkConfigs(),
      g.fetchPartMaterials(),
      g.fetchTipShapes(),
      g.fetchCoreGimmicks(),
      g.fetchAttackTypeDefs(),
      g.fetchArenaThemeDefs(),
      g.fetchArenaShapeDefs(),
      g.fetchBowlProfileDefs(),
      g.fetchTriggerTypeDefs(),
      g.fetchStatEventDefs(),
      g.fetchPartLayerDefs(),
      g.fetchStatDefs(),
    ]);
  },

  invalidate: (slice) => {
    const clearTs = (s: GameDataState) => {
      const { [slice]: _, ...rest } = s._fetchedAt;
      return rest;
    };
    if (slice === "combos") set(s => ({ combosLoaded: false, combos: [], _fetchedAt: clearTs(s) }));
    else if (slice === "specialMoves") set(s => ({ specialMovesLoaded: false, specialMoves: [], _fetchedAt: clearTs(s) }));
    else if (slice === "turretAttackTypes") set(s => ({ turretAttackTypesLoaded: false, turretAttackTypes: [], _fetchedAt: clearTs(s) }));
    else if (slice === "arenaFeatureConfigs") set(s => ({ arenaFeatureConfigsLoaded: false, arenaFeatureConfigs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "beyLinkConfigs") set(s => ({ beyLinkConfigsLoaded: false, beyLinkConfigs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "partMaterials") set(s => ({ partMaterialsLoaded: false, partMaterials: [], _fetchedAt: clearTs(s) }));
    else if (slice === "tipShapes") set(s => ({ tipShapesLoaded: false, tipShapes: [], _fetchedAt: clearTs(s) }));
    else if (slice === "coreGimmicks") set(s => ({ coreGimmicksLoaded: false, coreGimmicks: [], _fetchedAt: clearTs(s) }));
    else if (slice === "attackTypeDefs") set(s => ({ attackTypeDefsLoaded: false, attackTypeDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "arenaThemeDefs") set(s => ({ arenaThemeDefsLoaded: false, arenaThemeDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "arenaShapeDefs") set(s => ({ arenaShapeDefsLoaded: false, arenaShapeDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "bowlProfileDefs") set(s => ({ bowlProfileDefsLoaded: false, bowlProfileDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "triggerTypeDefs") set(s => ({ triggerTypeDefsLoaded: false, triggerTypeDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "statEventDefs") set(s => ({ statEventDefsLoaded: false, statEventDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "partLayerDefs") set(s => ({ partLayerDefsLoaded: false, partLayerDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "statDefs") set(s => ({ statDefsLoaded: false, statDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "arenas") set(s => ({ arenasLoaded: false, arenas: [], _fetchedAt: clearTs(s) }));
    else if (slice === "beyblades") set(s => ({ beybladeStatsLoaded: false, beyblades: [], beybladeStats: [], _fetchedAt: clearTs(s) }));
    else if (slice === "gimmickDefs") set(s => ({ gimmickDefsLoaded: false, gimmickDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "mechanicDefs") set(s => ({ mechanicDefsLoaded: false, mechanicDefs: [], _fetchedAt: clearTs(s) }));
    else if (slice === "roundModifiers") set(s => ({ roundModifiersLoaded: false, roundModifiers: [], _fetchedAt: clearTs(s) }));
  },
}), { name: "bey-catalog-v1" }));

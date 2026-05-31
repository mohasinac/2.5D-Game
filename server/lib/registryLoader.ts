/**
 * registryLoader.ts — process-level registry cache for all game content.
 *
 * Two-tier data model:
 *   Tier 1 (TypeScript code registries): imported synchronously at module load,
 *           pre-populated in _cache immediately — zero Firestore reads ever.
 *   Tier 2 (Firestore admin-created content): fetched once at server startup
 *           via preloadFirestoreContent(), cached in _cache.
 *
 * Rooms call synchronous getRegistry(collection) during onCreate() and ticks —
 * zero Firestore reads per tick after preload.
 *
 * CRITICAL: preloadFirestoreContent() must be called in src/index.ts
 *           BEFORE gameServer.listen().
 */

import * as admin from "firebase-admin";
import { getFirestoreDb } from "../utils/firebase";
import type { StackSlot, ResolvedStackSummary } from "../../shared/types/beybladeSystem";

// TypeScript code registries (Tier 1) — imported synchronously
import {
  MaterialRegistry,
  AttackTypeRegistry,
  GenerationRegistry,
  TipShapeRegistry,
  LiquidTypeRegistry,
  ElementTypeRegistry,
  ELEMENT_INTERACTION_TABLE,
  BowlProfileRegistry,
  ArenaShapeRegistry,
  PartLayerRegistry,
  GimmickRegistry,
} from "../physics/registries/index";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Registry<T> = Record<string, T>;

// ── Process-level cache ───────────────────────────────────────────────────────

const _cache: Record<string, Registry<unknown>> = {};
let _configVersion = "";
let _preloadComplete = false;
let _preloadPromise: Promise<void> | null = null;

// ── Tier 1: Pre-populate TypeScript registries synchronously ─────────────────
// These are available immediately — no await, no Firestore.

_cache["materials"]              = MaterialRegistry       as Registry<unknown>;
_cache["attackTypes"]            = AttackTypeRegistry     as Registry<unknown>;
_cache["generations"]            = GenerationRegistry     as Registry<unknown>;
_cache["tipShapes"]              = TipShapeRegistry       as Registry<unknown>;
_cache["liquidTypes"]            = LiquidTypeRegistry     as Registry<unknown>;
_cache["elementTypes"]           = ElementTypeRegistry    as Registry<unknown>;
_cache["elementInteractionTable"]= ELEMENT_INTERACTION_TABLE as Registry<unknown>;
_cache["bowlProfiles"]           = BowlProfileRegistry    as Registry<unknown>;
_cache["arenaShapes"]            = ArenaShapeRegistry     as Registry<unknown>;
_cache["partLayers"]             = PartLayerRegistry      as Registry<unknown>;
_cache["gimmicks"]               = GimmickRegistry        as Registry<unknown>;

// ── Helpers ───────────────────────────────────────────────────────────────────

async function loadConfigVersion(): Promise<string> {
  const db = getFirestoreDb();
  if (!db) return "";
  try {
    const doc = await db.collection("settings").doc("game").get();
    if (!doc.exists) return "";
    return String((doc.data() as Record<string, unknown>)?.configVersion ?? "");
  } catch {
    return "";
  }
}

async function loadFirestoreCollection(
  collection: string,
  transform?: (id: string, data: Record<string, unknown>) => unknown
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    console.warn(`[Registry] No Firestore connection — skipping collection "${collection}"`);
    _cache[collection] = {};
    return;
  }
  try {
    const snap = await db.collection(collection).get();
    const registry: Registry<unknown> = {};
    for (const doc of snap.docs) {
      const data = doc.data() as Record<string, unknown>;
      registry[doc.id] = transform ? transform(doc.id, data) : { ...data, id: doc.id };
    }
    _cache[collection] = registry;
  } catch (err) {
    console.warn(`[Registry] Failed to load collection "${collection}":`, err);
    _cache[collection] = {};
  }
}

// ── Tier 2: Firestore admin-created content ───────────────────────────────────

const FIRESTORE_COLLECTIONS = [
  // Game content (admin-created)
  "arenas",
  "beyblade_stats",
  "beyblade_stacks",
  "special_moves",
  "combos",
  // Part library (admin-created)
  "attack_ring_parts",
  "weight_disk_parts",
  "tip_parts",
  "core_parts",
  "casing_parts",
  "spin_track_parts",
  "sub_parts",
  "bit_beast_parts",
  "gear_parts",
  // Beyblade systems (admin-assembled presets)
  "beyblade_systems",
  // Stack builder
  "stack_templates",
  // Definition collections (admin-editable dropdowns)
  "gimmick_defs",
  "mechanic_defs",
  "gimmick_synergies",
  "element_type_configs",
  "turret_attack_types",
  "arena_feature_configs",
  "tip_shape_defs",
  "attack_type_defs",
  "arena_theme_defs",
  "arena_shape_defs",
  "bowl_profile_defs",
  "part_layer_defs",
  "liquid_type_defs",
  "ai_difficulty_profiles",
] as const;

/**
 * Preload all Firestore admin-created content into _cache.
 * Called ONCE in src/index.ts before gameServer.listen().
 * TypeScript registries (Tier 1) are already available — this only fetches Firestore.
 */
export async function preloadFirestoreContent(): Promise<void> {
  if (_preloadComplete) return;
  if (_preloadPromise) return _preloadPromise;

  _preloadPromise = (async () => {
    const start = Date.now();
    _configVersion = await loadConfigVersion();

    await Promise.all(FIRESTORE_COLLECTIONS.map(c => loadFirestoreCollection(c)));

    _preloadComplete = true;
    const elapsed = Date.now() - start;
    console.log(
      `[Registry] All ${Object.keys(_cache).length} registries preloaded in ${elapsed}ms ` +
      `(version: ${_configVersion || "unknown"})`
    );
  })();

  return _preloadPromise;
}

/**
 * Refresh a single Firestore collection (e.g. after admin edit).
 */
export async function refreshRegistry(collection: string): Promise<void> {
  await loadFirestoreCollection(collection);
}

/**
 * Refresh all Firestore collections when configVersion changes.
 * TypeScript registries (Tier 1) are NEVER re-fetched — they come from the bundle.
 */
export async function refreshAllFirestore(): Promise<void> {
  const newVersion = await loadConfigVersion();
  if (newVersion && newVersion === _configVersion) return;
  _configVersion = newVersion;

  await Promise.all(FIRESTORE_COLLECTIONS.map(c => loadFirestoreCollection(c)));
  console.log(`[Registry] Firestore registries refreshed (version: ${_configVersion})`);
}

/**
 * Synchronous registry lookup.
 * TypeScript registries are always available.
 * Firestore registries throw if called before preloadFirestoreContent() completes.
 */
export function getRegistry<T>(collection: string): Registry<T> {
  const r = _cache[collection];
  if (!r) {
    throw new Error(
      `[Registry] "${collection}" not loaded. ` +
      `Call preloadFirestoreContent() before gameServer.listen().`
    );
  }
  return r as Registry<T>;
}

/**
 * Typed convenience helpers for Tier 1 TypeScript registries (always synchronous).
 */
export const TypeScriptRegistries = {
  materials:    () => getRegistry("materials"),
  attackTypes:  () => getRegistry("attackTypes"),
  generations:  () => getRegistry("generations"),
  tipShapes:    () => getRegistry("tipShapes"),
  liquidTypes:  () => getRegistry("liquidTypes"),
  elementTypes: () => getRegistry("elementTypes"),
  bowlProfiles: () => getRegistry("bowlProfiles"),
  arenaShapes:  () => getRegistry("arenaShapes"),
  partLayers:   () => getRegistry("partLayers"),
  gimmicks:     () => getRegistry("gimmicks"),
} as const;

/**
 * Start a background config version watcher.
 * Polls settings/game.configVersion every 5 minutes.
 * On version bump, refreshes all Firestore registries (Tier 2 only).
 */
export function startConfigVersionWatcher(): void {
  setInterval(async () => {
    try {
      await refreshAllFirestore();
    } catch (err) {
      console.warn("[Registry] Version watcher refresh failed:", err);
    }
  }, 5 * 60 * 1000);
}

/** True after preloadFirestoreContent() resolves. */
export function isRegistryReady(): boolean {
  return _preloadComplete;
}

// ── Stack resolver ────────────────────────────────────────────────────────────

const G = 9.81; // m/s²

/** Part collection names that represent floor-contact tip parts. */
const TIP_COLLECTIONS = new Set(["tip_parts", "tip"]);

interface PartDoc {
  mass_g?: number;
  I_kgm2?: number;
  r_outer_cm?: number;
  r_inner_cm?: number;
  z_top_cm?: number;
  partType?: string;
  mu_k?: number;
  contactRadius_cm?: number;
}

/**
 * Resolve a BeybladeStack document into computed physics summary.
 * Loads the stack doc directly (targeted single-doc read — acceptable per-room).
 * Uses synchronous getRegistry() for part lookups after preload.
 *
 * Does NOT hardcode slot index assumptions — tip is found by partCollection lookup.
 */
export async function resolveStack(stackId: string): Promise<ResolvedStackSummary | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  // Load the stack doc (targeted read — per plan: player stacks are acceptable per-room reads)
  const stackDoc = await db.collection("beyblade_stacks").doc(stackId).get();
  if (!stackDoc.exists) return null;

  const stackData = stackDoc.data() as { slots?: StackSlot[] };
  const slots: StackSlot[] = (stackData.slots ?? []).sort(
    (a, b) => a.slotIndex - b.slotIndex
  );

  if (slots.length === 0) {
    return {
      stackId,
      totalMass_g: 0,
      I_total_kgm2: 0,
      CoM_z_cm: 0,
      spinDecayRate: 0,
      OWD: 0,
      hasTip: false,
      warnings: ["Stack has no slots."],
    };
  }

  let totalMass_g = 0;
  let I_total_kgm2 = 0;
  let CoM_numerator = 0; // sum of mass_g × z_base_cm for CoM
  let prevZTop = 0;
  let tipPart: PartDoc | null = null;
  const warnings: string[] = [];

  for (const slot of slots) {
    // Resolve z_base for this slot
    const z_base_cm = slot.z_override_cm ?? prevZTop;

    // Find the part in the appropriate registry
    let part: PartDoc | null = null;
    try {
      const reg = getRegistry<PartDoc>(slot.partCollection);
      part = reg[slot.partId] ?? null;
    } catch {
      // Registry not loaded or unknown collection — skip part
      warnings.push(`Part "${slot.partId}" not found in "${slot.partCollection}".`);
    }

    if (!part) continue;

    const mass = part.mass_g ?? 0;
    const z_top_cm = z_base_cm + (part.z_top_cm ?? 0);

    totalMass_g += mass;

    // I contribution: use stored I_kgm2 if available, else approximate from mass + outer radius
    const I_part =
      part.I_kgm2 ??
      (mass / 1000) * Math.pow((part.r_outer_cm ?? 2.0) / 100, 2) * 0.5;
    I_total_kgm2 += I_part;

    // CoM: weight by mass × midpoint z
    const z_mid = (z_base_cm + z_top_cm) / 2;
    CoM_numerator += mass * z_mid;

    // Track sequential z
    if (slot.z_override_cm === undefined) {
      prevZTop = z_top_cm;
    }

    // Find tip: bottommost part from a tip collection (or partType === "tip")
    if (tipPart === null) {
      if (TIP_COLLECTIONS.has(slot.partCollection) || part.partType === "tip") {
        tipPart = part;
      }
    }
  }

  const CoM_z_cm = totalMass_g > 0 ? CoM_numerator / totalMass_g : 0;
  const hasTip = tipPart !== null;

  // Spin decay: dω/dt = -(μ_k × m × g × r_tip) / I_total
  let spinDecayRate = 0;
  if (hasTip && I_total_kgm2 > 0 && totalMass_g > 0) {
    const mu_k = tipPart!.mu_k ?? 0.17;
    const r_tip_m = (tipPart!.contactRadius_cm ?? 0.2) / 100;
    spinDecayRate =
      (mu_k * (totalMass_g / 1000) * G * r_tip_m) / I_total_kgm2;
  }

  // OWD: outer weight distribution factor (higher = more mass at outer rim)
  // Approximated as I_total / (totalMass_g/1000 × r_outer²) where r_outer is
  // the largest r_outer_cm across all slots, normalized to 0–1
  let maxR_outer_m = 0.001;
  for (const slot of slots) {
    try {
      const reg = getRegistry<PartDoc>(slot.partCollection);
      const p = reg[slot.partId];
      if (p?.r_outer_cm) {
        maxR_outer_m = Math.max(maxR_outer_m, p.r_outer_cm / 100);
      }
    } catch { /* skip */ }
  }
  const OWD = totalMass_g > 0
    ? Math.min(1, I_total_kgm2 / ((totalMass_g / 1000) * maxR_outer_m * maxR_outer_m))
    : 0;

  // Warnings
  if (!hasTip) warnings.push("No tip part — stack has no floor contact.");
  if (CoM_z_cm > 2.0) warnings.push("Heavy top — CoM above 2 cm may reduce stability.");

  return {
    stackId,
    totalMass_g,
    I_total_kgm2,
    CoM_z_cm,
    spinDecayRate,
    OWD: Math.max(0, Math.min(1, OWD)),
    hasTip,
    warnings,
  };
}

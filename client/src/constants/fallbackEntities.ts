// Fallback entities — always present in every selection UI, even when Firestore
// returns results. Marked with isFallback=true so pickers can render an "F" badge.

export interface FallbackBey {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  color: string;
  isFallback: true;
}

export interface FallbackArena {
  id: string;
  name: string;
  subtitle: string;
  isFallback: true;
}

export const FALLBACK_BEYS: FallbackBey[] = [
  {
    id: "storm_pegasus_105rf",
    name: "Storm Pegasus",
    subtitle: "105RF · Attack · Right",
    type: "attack",
    color: "#1a6fe8",
    isFallback: true,
  },
  {
    id: "dark_wolf_df145fs",
    name: "Dark Wolf",
    subtitle: "DF145FS · Balanced · Right",
    type: "balanced",
    color: "#7a0a2b",
    isFallback: true,
  },
  {
    id: "rock_leone_lb145sb",
    name: "Rock Leone",
    subtitle: "LB145SB · Defense · Right",
    type: "defense",
    color: "#d4a017",
    isFallback: true,
  },
  {
    id: "earth_eagle_145wd",
    name: "Earth Eagle",
    subtitle: "145WD · Stamina · Right",
    type: "stamina",
    color: "#2e7d32",
    isFallback: true,
  },
];

export const FALLBACK_ARENAS: FallbackArena[] = [
  {
    id: "default_black_arena",
    name: "Default Black Arena",
    subtitle: "60 cm bowl · 4-zone · Dark theme",
    isFallback: true,
  },
];

/** Returns true if the given id belongs to a known fallback bey. */
export function isFallbackBeyId(id: string): boolean {
  return FALLBACK_BEYS.some((b) => b.id === id);
}

/** Returns true if the given id belongs to a known fallback arena. */
export function isFallbackArenaId(id: string): boolean {
  return FALLBACK_ARENAS.some((a) => a.id === id);
}

/** Set of all fallback ids — pass directly to EntityPicker's fallbackIds prop. */
export const FALLBACK_BEY_IDS = new Set(FALLBACK_BEYS.map((b) => b.id));
export const FALLBACK_ARENA_IDS = new Set(FALLBACK_ARENAS.map((a) => a.id));

/**
 * Merge a Firestore-loaded list with the fallback beys, always placing fallbacks
 * at the top and deduplicating by id so they don't appear twice if Firestore
 * also has a doc for the same id.
 */
export function mergeFallbackBeys<T extends { id: string }>(
  firestoreItems: T[],
  toOption: (bey: FallbackBey) => T,
): T[] {
  const seen = new Set(firestoreItems.map((i) => i.id));
  const fallbacks = FALLBACK_BEYS.filter((b) => !seen.has(b.id)).map(toOption);
  return [...fallbacks, ...firestoreItems];
}

/**
 * Merge a Firestore-loaded list with the fallback arenas, same dedup logic.
 */
export function mergeFallbackArenas<T extends { id: string }>(
  firestoreItems: T[],
  toOption: (arena: FallbackArena) => T,
): T[] {
  const seen = new Set(firestoreItems.map((i) => i.id));
  const fallbacks = FALLBACK_ARENAS.filter((a) => !seen.has(a.id)).map(toOption);
  return [...fallbacks, ...firestoreItems];
}

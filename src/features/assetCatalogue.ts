import type { AssetEntry } from './AssetRegistry';

/* ══════════════════════════════════════════════════════════════════════════
   THE PROP CATALOGUE — now empty, and deliberately still here.

   This replaces `assetCatalogue.generated.ts`, which listed 32 CC0 Kenney
   models under `assets/models/`. Both the generator and the files are gone:
   the project ships no binary art any more.

   WHY THE MODULE SURVIVES THE CONTENT. `AssetRegistry` is a loader, not a
   library — it resolves an id to a GLB, caches it, normalises its scale and
   hands back a clone. That machinery is functional and worth keeping; it
   simply has nothing shipped to resolve. Deleting the seam instead would mean
   `ObstacleManager`'s model path, `resolveModelId` and the whole `theme`
   field had to go with it, and re-adding art later would be a rewrite rather
   than a list.

   So: every obstacle resolves to `null` and draws its authored primitive.
   That is already the documented fallback — "a fresh clone with no `assets/`
   still renders an arena" — and it is now the only path rather than the
   spare one.

   To ship props again, add rows here (or regenerate this file) and put the
   GLBs where `url` points. Nothing else needs to change.
   ══════════════════════════════════════════════════════════════════════════ */

/** Prop families an obstacle's `theme` can resolve to. */
export type AssetTheme = 'boat' | 'tree' | 'rock' | 'building' | 'tower';

export interface ThemedAssetEntry extends AssetEntry { theme: AssetTheme }

/**
 * Shipped props. Empty.
 *
 * Typed rather than `[]` so a future row is checked against `AssetEntry`
 * instead of widening to `never[]` and accepting anything.
 */
export const GENERATED_CATALOGUE: readonly ThemedAssetEntry[] = [];

export function assetsForTheme(theme: AssetTheme): readonly ThemedAssetEntry[] {
  return GENERATED_CATALOGUE.filter(a => a.theme === theme);
}

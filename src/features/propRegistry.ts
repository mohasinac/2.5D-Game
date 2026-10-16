import { AssetRegistry } from './AssetRegistry';
import { assetsForTheme, type AssetTheme } from './assetCatalogue';

/* ══════════════════════════════════════════════════════════════════════════
   THE SHARED PROP REGISTRY

   One `AssetRegistry` for the whole app, because the cache is the point: the
   Sea Side Bowl places eight boats and four towers, and a registry per manager
   would fetch and upload each file once per obstacle instead of once.

   A module singleton rather than something hung off `SceneContext`, because
   the cache should survive a screen switch. Models are immutable shipped
   files; re-downloading them when the player walks from the editor into a
   battle would be pure waste.
   ══════════════════════════════════════════════════════════════════════════ */

let _registry: AssetRegistry | null = null;

export function propRegistry(): AssetRegistry {
  _registry ??= new AssetRegistry();
  return _registry;
}

/** Drop every cached model. Teardown only. */
export function disposePropRegistry(): void {
  _registry?.dispose();
  _registry = null;
}

/**
 * Which model an obstacle should draw, if any.
 *
 * `modelId` wins when set — an explicit choice from the properties panel.
 * Otherwise `theme` picks one from that family, which is what makes the
 * EXISTING demo arena light up without re-authoring it: all eight boats have
 * carried `theme: 'boat'` since the day they were written, and nothing has
 * ever read the field.
 *
 * The pick is deterministic from the obstacle's own id, not random, so an
 * arena looks identical every time it loads — and two boats side by side
 * still differ, because their ids do.
 */
export function resolveModelId(
  modelId: string | null | undefined,
  theme: string | null | undefined,
  obstacleId: string,
): string | null {
  if (modelId) return modelId;
  if (!theme || theme === 'none' || theme === 'default') return null;

  const pool = assetsForTheme(theme as AssetTheme);
  if (pool.length === 0) return null;

  /* A tiny string hash, so the chosen boat is stable across reloads and does
     not depend on Map iteration order or on how many obstacles exist. */
  let h = 0;
  for (let i = 0; i < obstacleId.length; i++) h = (h * 31 + obstacleId.charCodeAt(i)) | 0;
  return pool[Math.abs(h) % pool.length].id;
}

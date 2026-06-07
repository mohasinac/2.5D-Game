import { FeatureManager } from './FeatureManager';
import type { SceneContext } from './IArenaFeature';
import type { ISurfaceProvider } from './ISurfaceProvider';

/**
 * ParentType restricts which surfaces a feature can be placed on.
 * 'arena' — placed on an arena bowl surface (polar coords: posR, posAngle).
 * 'base'  — placed directly on the octagon base surface (world XZ: basePosX, basePosZ).
 */
export type SurfaceParentType = 'arena' | 'base';

/**
 * Minimum fields that a parented data type must expose so that
 * ParentedFeatureManager can resolve positions.
 */
export interface ParentedData {
  readonly parentId:   string;
  readonly parentType: SurfaceParentType;
  readonly posR:       number;   // polar radius on arena (cm); ignored for 'base'
  readonly posAngle:   number;   // polar angle on arena (degrees); ignored for 'base'
  readonly basePosX:   number;   // world X for base-parented features
  readonly basePosZ:   number;   // world Z for base-parented features
}

/**
 * Abstract extension of FeatureManager for features that sit on a surface
 * (arena bowl or octagon base).
 *
 * The ArenaData dependency has been removed.  Instead, a generic
 * `getSurface(surfaceId)` callback is injected so this class works in
 * any sandbox — ArenaSandbox passes ArenaSurfaceProvider instances;
 * other sandboxes pass FlatSurfaceProvider or MeshSurfaceProvider.
 *
 * Protected helpers:
 *   resolveSurfaceY(data)  — world Y of the surface beneath the feature
 *   resolveWorldXZ(data)   — world { x, z } centre of the feature
 *   resolveTreeParent(data) — scene-tree parent node ID
 */
export abstract class ParentedFeatureManager<
  TData extends { id: string; name: string } & ParentedData,
  TSave extends { id: string },
> extends FeatureManager<TData, TSave> {

  constructor(
    ctx: SceneContext,
    idPrefix: string,
    labelBase: string,
    /** Lookup callback: returns the ISurfaceProvider for the given parentId. */
    protected readonly getSurface: (surfaceId: string) => ISurfaceProvider | undefined,
  ) {
    super(ctx, idPrefix, labelBase);
  }

  // ── Coordinate helpers ───────────────────────────────────────────────────

  /**
   * Returns the world Y of the surface beneath a parented feature.
   * For 'base':  returns getFallbackY() (sandbox floor).
   * For 'arena': delegates to the ISurfaceProvider for that arena.
   */
  protected resolveSurfaceY(data: TData): number {
    if (data.parentType === 'base') return this.ctx.getFallbackY();
    const surf = this.getSurface(data.parentId);
    if (!surf) return this.ctx.getFallbackY();
    const { x, z } = surf.polarToWorld(data.posR, data.posAngle);
    return surf.getSurfaceAt(x, z).y;
  }

  /**
   * Returns the world XZ centre for a parented feature.
   * For 'base':  returns basePosX / basePosZ directly.
   * For 'arena': delegates to the ISurfaceProvider.polarToWorld.
   */
  protected resolveWorldXZ(data: TData): { x: number; z: number } {
    if (data.parentType === 'base') return { x: data.basePosX, z: data.basePosZ };
    const surf = this.getSurface(data.parentId);
    if (!surf) return { x: 0, z: 0 };
    return surf.polarToWorld(data.posR, data.posAngle);
  }

  /**
   * Resolves the scene-tree parent node ID.
   * Arena-parented features go under their arena node;
   * base-parented features go under the octagon-base node.
   */
  protected resolveTreeParent(data: TData): string {
    return data.parentType === 'base' ? 'octagon-base' : data.parentId;
  }
}

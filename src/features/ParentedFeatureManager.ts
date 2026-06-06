import type { ArenaData } from '../types/arenaTypes';
import { DEG2RAD } from '../config/arenaConstants';
import { polarToLocalXZ, arenaSurfaceYAtArenaLocal } from '../geometry/surfaceUtils';
import { FeatureManager } from './FeatureManager';
import type { SceneContext } from './IArenaFeature';

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
 * Adds two protected helpers:
 *   resolveSurfaceY(data)    — world Y of the surface the feature sits on
 *   resolveWorldXZ(data)     — world { x, z } centre of the feature
 *
 * These are used by TrapManager, PortalManager, and any future surface-
 * mounted feature to position geometry correctly without duplicating the
 * coordinate maths in every subclass (DRY / SRP).
 *
 * The arenas map is injected as a getter callback so that the manager always
 * sees the live map without needing a reference to ArenaSandbox (DIP).
 */
export abstract class ParentedFeatureManager<
  TData extends { id: string; name: string } & ParentedData,
  TSave extends { id: string },
> extends FeatureManager<TData, TSave> {

  constructor(
    ctx: SceneContext,
    idPrefix: string,
    labelBase: string,
    /** Read-only getter for the live arenas map — injected, never imported. */
    protected readonly getArenas: () => ReadonlyMap<string, ArenaData>,
  ) {
    super(ctx, idPrefix, labelBase);
  }

  // ── Coordinate helpers ───────────────────────────────────────────────────

  /**
   * Returns the world Y of the surface beneath a parented feature.
   * For 'arena': samples the bowl parabola at the feature's polar position.
   * For 'base':  returns the octagon base top-face height.
   */
  protected resolveSurfaceY(data: TData): number {
    if (data.parentType === 'base') {
      return this.ctx.getBaseHeight();
    }
    const arena = this.getArenas().get(data.parentId);
    if (!arena) return this.ctx.getBaseHeight();
    const { lx, lz } = polarToLocalXZ(data.posR, data.posAngle);
    return arenaSurfaceYAtArenaLocal(arena, lx, lz);
  }

  /**
   * Returns the world XZ centre for a parented feature.
   * For 'arena': converts polar → arena-local → world (via arena.rotY).
   * For 'base':  returns basePosX / basePosZ directly.
   */
  protected resolveWorldXZ(data: TData): { x: number; z: number } {
    if (data.parentType === 'base') {
      return { x: data.basePosX, z: data.basePosZ };
    }
    const arena = this.getArenas().get(data.parentId);
    const { lx, lz } = polarToLocalXZ(data.posR, data.posAngle);
    if (!arena) return { x: lx, z: lz };
    const c = Math.cos(arena.rotY * DEG2RAD);
    const s = Math.sin(arena.rotY * DEG2RAD);
    return {
      x: arena.posX + lx * c - lz * s,
      z: arena.posZ + lx * s + lz * c,
    };
  }

  /**
   * Resolves the tree parent node ID used for the scene tree.
   * Arena-parented features go under their arena node;
   * base-parented features go under the octagon-base node.
   */
  protected resolveTreeParent(data: TData): string {
    return data.parentType === 'base' ? 'octagon-base' : data.parentId;
  }
}

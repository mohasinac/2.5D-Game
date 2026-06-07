import * as THREE from 'three';
import type { TrapData, TrapDurationTier } from '../../types/arenaTypes';
import { defaultProjectileConfig } from '../../types/arenaTypes';
import type { TrapSave, WallSave } from '../../utils/arenaPersistence';
import {
  buildTrapObjects,
  applyTrap,
  defaultTrap,
} from '../../geometry/trapBuilders';
import { trapToSave } from '../../utils/arenaPersistence';
import { ParentedFeatureManager } from '../ParentedFeatureManager';
import type { SceneContext, ITickableManager, IPositionedManager } from '../IArenaFeature';
import type { ISurfaceProvider } from '../ISurfaceProvider';
import { createTrapTickBehavior } from './sub/TrapTickBehavior';

/**
 * Manages trigger trap pads — flat interactive surfaces placed on arena bowls
 * or the octagon base.
 *
 * Traps have three geometry components:
 *   mesh        — the flat plate
 *   edges       — plate wireframe
 *   variantMesh — optional variant geometry (spikes, trampoline, hammer, etc.)
 *
 * variantMesh must be disposed separately (analogous to arena.spiralMeshes).
 *
 * Wall cascade
 * ────────────
 * Traps can parent walls (parentType='trap').  When a trap is removed, its
 * child walls must be removed first.  Callers pass a wall-disposal callback
 * (removeTrapWalls) so TrapManager stays decoupled from WallManager.
 *
 * Reuse
 * ─────
 * Inherits parent-surface resolution from ParentedFeatureManager.
 * Has no direct dependency on WallManager — wall cleanup is injected.
 */
export class TrapManager extends ParentedFeatureManager<TrapData, TrapSave>
  implements ITickableManager, IPositionedManager {

  constructor(
    ctx:        SceneContext,
    getSurface: (surfaceId: string) => ISurfaceProvider | undefined,
    /** Called when a trap activates (earthquake pulse start or RPM revolution); used for env-trigger events. */
    private readonly onActivate?: (trap: TrapData) => void,
  ) {
    super(ctx, 'trap', 'Trap', getSurface);
  }

  // ── Public factory ───────────────────────────────────────────────────────

  /**
   * Add a new trap on a given parent (arena or base).
   * @param treeOpts  Scene-tree node options (add-child buttons injected by caller).
   */
  add(
    parentId:   string,
    parentType: 'arena' | 'base',
    treeOpts?:  Record<string, unknown>,
  ): TrapData {
    const id   = this.nextId();
    const data = defaultTrap(this.nextLabel(), id, parentId, parentType);
    const treeParent = parentType === 'base' ? 'octagon-base' : parentId;
    return this._insert(data, '⚡', treeParent, treeOpts);
  }

  // ── Apply (rebuild geometry in-place after property edits) ──────────────

  apply(data: TrapData): void {
    applyTrap(data, this.resolveSurfaceY(data));
    this.setVisible(data.id, data.visible ?? true);
  }

  // ── Build + show (used during restore / undo-redo) ──────────────────────

  buildAndShow(
    data:      TrapData,
    treeOpts?: Record<string, unknown>,
  ): void {
    this.buildGeometry(data);
    this.setVisible(data.id, data.visible ?? true);
    const treeParent = data.parentType === 'base' ? 'octagon-base' : data.parentId;
    this.ctx.sceneTree.add(data.id, data.name, '⚡', treeParent, treeOpts as never);
  }

  // ── Override remove to support wall cascade ──────────────────────────────

  /**
   * Remove a trap and optionally cascade to child walls first.
   * @param removeTrapWalls  Callback to dispose walls parented to this trap.
   *                         Injected by ArenaSandbox — TrapManager stays decoupled from WallManager.
   */
  removeWithWalls(
    id:              string,
    removeTrapWalls: (trapId: string) => void,
  ): boolean {
    removeTrapWalls(id);
    return this.remove(id);
  }

  // ── ITickableManager ─────────────────────────────────────────────────────

  tick(dt: number): void {
    for (const trap of this.items.values()) {
      trap._tickBehavior?.tick(trap, dt);
    }
  }

  // ── IPositionedManager ───────────────────────────────────────────────────

  getWorldPosition(id: string): THREE.Vector3 | null {
    const data = this.items.get(id);
    if (!data?.mesh) return null;
    return data.mesh.getWorldPosition(new THREE.Vector3());
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(data: TrapData): void {
    const [mesh, edges, variantMesh] = buildTrapObjects(data, this.resolveSurfaceY(data));
    data.mesh        = mesh;
    data.edges       = edges;
    data.variantMesh = variantMesh;
    data._tickBehavior = createTrapTickBehavior(data.effect, this.onActivate) ?? undefined;

    const objs: THREE.Object3D[] = [mesh, edges];
    if (variantMesh) objs.push(variantMesh);
    this.ctx.renderMgr.add(data.id, objs);
  }

  protected disposeOne(data: TrapData): void {
    data._tickBehavior?.dispose();
    data._tickBehavior = undefined;
    data.variantMesh = null;
    // renderMgr.dispose() in base remove()/clear() handles scene removal + GPU disposal.
  }

  // ── Serialisation ────────────────────────────────────────────────────────

  toSave(data: TrapData): TrapSave {
    // wallToSave is handled by the caller (ArenaSandbox) — walls: [] populated there
    return trapToSave(data);
  }

  fromSave(save: TrapSave): TrapData {
    const data = defaultTrap(save.name, save.id, save.parentId, save.parentType);
    Object.assign(data, {
      shape:             save.shape,
      variant:           save.variant,
      effect:            save.effect,
      dimX:              save.dimX,
      dimZ:              save.dimZ,
      rotY:              save.rotY,
      posR:              save.posR,
      posAngle:          save.posAngle,
      basePosX:          save.basePosX,
      basePosZ:          save.basePosZ,
      forceX:            save.forceX,
      forceY:            save.forceY,
      forceZ:            save.forceZ,
      damageFactor:      save.damageFactor,
      healFactor:        save.healFactor,
      freezeDuration:    save.freezeDuration,
      buffSurface:       save.buffSurface,
      pitShape:          save.pitShape,
      pitRadiusX:        save.pitRadiusX,
      pitRadiusZ:        save.pitRadiusZ,
      pitDepth:          save.pitDepth,
      pitSides:          save.pitSides,
      pitStarInner:      save.pitStarInner,
      isPeriodic:        save.isPeriodic,
      safeInterval:      save.safeInterval,
      unsafeInterval:    save.unsafeInterval,
      activationLimit:      save.activationLimit,
      speedPathId:          save.speedPathId,
      durationTiers:        save.durationTiers.map((d): TrapDurationTier => ({ ...d })),
      gravityRange:         save.gravityRange         ?? 30,
      gravityStrength:      save.gravityStrength      ?? 50,
      gravityMode:          save.gravityMode          ?? 'continuous',
      gravityPulseInterval: save.gravityPulseInterval ?? 2,
      gravityPulseWidth:    save.gravityPulseWidth    ?? 0.5,
      linkedSpeedLineId:    save.linkedSpeedLineId    ?? null,
      eqRingCount:          save.eqRingCount          ?? 3,
      eqSegmentsPerRing:    save.eqSegmentsPerRing    ?? 6,
      eqMaxElevationCm:     save.eqMaxElevationCm     ?? 5,
      eqElevationMode:      (save.eqElevationMode     ?? 'random') as TrapData['eqElevationMode'],
      eqRingRanges:         save.eqRingRanges         ?? [0.3, 0.7, 1.0],
      eqPermanent:          save.eqPermanent          ?? false,
      eqFadeCycles:         save.eqFadeCycles         ?? 3,
      eqPulseMode:          (save.eqPulseMode         ?? 'triggered') as TrapData['eqPulseMode'],
      eqPulseIntervalMs:    save.eqPulseIntervalMs    ?? 2000,
      eqPulseWidthMs:       save.eqPulseWidthMs       ?? 1000,
      rpmSpeed:             save.rpmSpeed             ?? 180,
      rpmEffect:            (save.rpmEffect           ?? 'tangential') as TrapData['rpmEffect'],
      rpmRange:             save.rpmRange             ?? 0,
      rpmMatchSpin:         save.rpmMatchSpin         ?? false,
      rpmForceScale:        save.rpmForceScale        ?? 1.0,
      rpmPulseMode:         (save.rpmPulseMode        ?? 'continuous') as TrapData['rpmPulseMode'],
      rpmPulseIntervalMs:   save.rpmPulseIntervalMs   ?? 0,
      rpmPulseWidthMs:      save.rpmPulseWidthMs      ?? 0,
      projLaunchMode:       (save.projLaunchMode      ?? 'single') as TrapData['projLaunchMode'],
      projCount:            save.projCount            ?? 1,
      projSpreadAngleDeg:   save.projSpreadAngleDeg   ?? 30,
      projBurstCount:       save.projBurstCount       ?? 3,
      projBurstDelayMs:     save.projBurstDelayMs     ?? 100,
      projLaunchDelayMs:    save.projLaunchDelayMs    ?? 0,
      projLaunchAngleDeg:   save.projLaunchAngleDeg   ?? 0,
      projRandomizeAngle:   save.projRandomizeAngle   ?? false,
      projPattern:          (save.projPattern         ?? 'ring') as TrapData['projPattern'],
      projPatternCount:     save.projPatternCount     ?? 6,
      projConfig:           save.projConfig ? { ...defaultProjectileConfig(), ...save.projConfig } : defaultProjectileConfig(),
      projPulseMode:        (save.projPulseMode       ?? 'triggered') as TrapData['projPulseMode'],
      projPulseIntervalMs:  save.projPulseIntervalMs  ?? 3000,
      projPlateSpin:        save.projPlateSpin        ?? 0,
      baseMaterial:         save.baseMaterial,
      color:             save.color,
      surface:           save.surface,
      customTileData:    save.customTileData,
      tileScale:         save.tileScale,
      emissiveColor:     save.emissiveColor,
      emissiveIntensity: save.emissiveIntensity,
      presentStlb64:     save.presentStlb64,
      presentColor:      save.presentColor,
      visible:           save.visible ?? true,
    });
    return data;
  }

  /** Expose the saved walls array from a TrapSave for the caller to restore. */
  static extractWalls(save: TrapSave): WallSave[] {
    return save.walls ?? [];
  }
}

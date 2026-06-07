import * as THREE from 'three';
import type { TrapData, TrapDurationTier } from '../../types/arenaTypes';
import { defaultProjectileConfig } from '../../types/arenaTypes';
import type { TrapSave, WallSave } from '../../utils/arenaPersistence';
import {
  buildTrapObjects,
  applyTrap,
  defaultTrap,
  updateEarthquakeMeshHeights,
} from '../../geometry/trapBuilders';
import { trapToSave } from '../../utils/arenaPersistence';
import { ParentedFeatureManager } from '../ParentedFeatureManager';
import type { SceneContext, ITickableManager } from '../IArenaFeature';
import type { ISurfaceProvider } from '../ISurfaceProvider';

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
export class TrapManager extends ParentedFeatureManager<TrapData, TrapSave> implements ITickableManager {

  constructor(
    ctx:        SceneContext,
    getSurface: (surfaceId: string) => ISurfaceProvider | undefined,
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
    const objs: THREE.Object3D[] = [data.mesh!, data.edges!];
    if (data.variantMesh) objs.push(data.variantMesh);
    this.ctx.trackObjects(data.id, objs);
  }

  // ── Build + show (used during restore / undo-redo) ──────────────────────

  buildAndShow(
    data:      TrapData,
    treeOpts?: Record<string, unknown>,
  ): void {
    this.buildGeometry(data);
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
      if (trap.effect === 'earthquake') this._tickEarthquake(trap, dt);
      if (trap.effect === 'rpm')        this._tickRPM(trap, dt);
      if (trap.effect === 'projectile' && trap.projPlateSpin !== 0) this._tickPlateSpin(trap, dt);
    }
  }

  private _tickPlateSpin(trap: TrapData, dt: number): void {
    const omega = trap.projPlateSpin * (Math.PI / 180);
    trap.mesh.rotation.y += omega * dt;
    trap.edges.rotation.y = trap.mesh.rotation.y;
  }

  private _tickEarthquake(trap: TrapData, dt: number): void {
    if (!trap._eqPhase) {
      if (trap.eqPulseMode === 'continuous') {
        this._eqStartPulse(trap);
      } else if (trap.eqPulseMode === 'periodic') {
        trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
        if (trap._eqTimer >= trap.eqPulseIntervalMs) {
          trap._eqTimer = 0;
          this._eqStartPulse(trap);
        }
      }
      return;
    }

    const phase = trap._eqPhase;
    const widthMs = Math.max(100, trap.eqPulseWidthMs);

    if (phase === 'rising') {
      trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
      const t = Math.min(1, trap._eqTimer / (widthMs * 0.3));
      this._eqLerpHeights(trap, t);
      if (t >= 1) { trap._eqPhase = 'active'; trap._eqTimer = 0; }
    } else if (phase === 'active') {
      if (trap.eqPermanent) return;
      trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
      if (trap._eqTimer >= widthMs * 0.4) { trap._eqPhase = 'fading'; trap._eqTimer = 0; }
    } else if (phase === 'fading') {
      trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
      const t = Math.min(1, trap._eqTimer / (widthMs * 0.3));
      this._eqLerpHeights(trap, 1 - t);
      if (t >= 1) {
        trap._eqPhase = undefined;
        trap._eqTimer = 0;
        trap._eqCycleCount = (trap._eqCycleCount ?? 0) + 1;
        if (trap.eqPulseMode === 'continuous' && (trap.eqFadeCycles === 0 || (trap._eqCycleCount ?? 0) < trap.eqFadeCycles)) {
          this._eqStartPulse(trap);
        }
      }
    }
    updateEarthquakeMeshHeights(trap);
  }

  private _eqStartPulse(trap: TrapData): void {
    const rings = Math.max(1, trap.eqRingCount);
    const segs  = Math.max(3, trap.eqSegmentsPerRing);
    const total = rings * segs;
    if (!trap._eqTargetHeights || trap._eqTargetHeights.length !== total) {
      trap._eqTargetHeights  = new Array(total).fill(0);
      trap._eqCurrentHeights = new Array(total).fill(0);
    }
    const maxH = trap.eqMaxElevationCm;
    for (let r = 0; r < rings; r++) {
      const ringMult = trap.eqRingRanges[r] ?? 1;
      for (let s = 0; s < segs; s++) {
        const idx = r * segs + s;
        let h = 0;
        switch (trap.eqElevationMode) {
          case 'wave':        h = maxH * ringMult * Math.sin((s / segs) * Math.PI * 2); break;
          case 'ripple':      h = maxH * ringMult * Math.sin((r / rings) * Math.PI * 4); break;
          case 'checkerboard': h = maxH * ringMult * ((r + s) % 2 === 0 ? 1 : -1); break;
          case 'random':
          default:            h = maxH * ringMult * (Math.random() * 2 - 1); break;
        }
        trap._eqTargetHeights[idx] = h;
      }
    }
    trap._eqPhase = 'rising';
    trap._eqTimer = 0;
  }

  private _eqLerpHeights(trap: TrapData, t: number): void {
    if (!trap._eqCurrentHeights || !trap._eqTargetHeights) return;
    for (let i = 0; i < trap._eqCurrentHeights.length; i++) {
      trap._eqCurrentHeights[i] = (trap._eqTargetHeights[i] ?? 0) * t;
    }
  }

  private _tickRPM(trap: TrapData, dt: number): void {
    if (!trap.variantMesh) return;
    const omega = (trap.rpmSpeed ?? 0) * (Math.PI / 180);
    trap._rpmCurrentAngle = ((trap._rpmCurrentAngle ?? 0) + omega * dt) % (Math.PI * 2);
    trap.variantMesh.rotation.y = trap._rpmCurrentAngle;
    // Emissive scales with |speed|
    const mat = trap.variantMesh.material as THREE.MeshStandardMaterial;
    if (mat && 'emissiveIntensity' in mat) {
      mat.emissiveIntensity = Math.min(1, Math.abs(trap.rpmSpeed ?? 0) / 360);
    }
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(data: TrapData): void {
    const [mesh, edges, variantMesh] = buildTrapObjects(data, this.resolveSurfaceY(data));
    data.mesh        = mesh;
    data.edges       = edges;
    data.variantMesh = variantMesh;

    const objs: THREE.Object3D[] = [mesh, edges];
    if (variantMesh) objs.push(variantMesh);
    this.ctx.scene.add(...objs);
    this.ctx.trackObjects(data.id, objs);
  }

  protected disposeOne(data: TrapData): void {
    this.ctx.scene.remove(data.mesh);
    data.mesh.geometry.dispose();
    (data.mesh.material as THREE.Material).dispose();
    this.ctx.scene.remove(data.edges);
    data.edges.geometry.dispose();
    (data.edges.material as THREE.Material).dispose();
    if (data.variantMesh) {
      this.ctx.scene.remove(data.variantMesh);
      data.variantMesh.geometry.dispose();
      (data.variantMesh.material as THREE.Material).dispose();
      data.variantMesh = null;
    }
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

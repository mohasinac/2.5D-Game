import * as THREE from 'three';
import type { RotationData, RotationNodeType, RotationMode } from '../../types/arenaTypes';
import type { RotationSave } from '../../utils/arenaPersistence';
import { rotationToSave } from '../../utils/arenaPersistence';
import { DEG2RAD, ROT, TWO_PI } from '../../config/arenaConstants';
import { FeatureManager } from '../FeatureManager';
import type { SceneContext, ITickableManager } from '../IArenaFeature';

/**
 * Manages pivot-group rotation animations.
 *
 * Each RotationData holds:
 *   - memberIds / memberTypes   — which nodes spin together
 *   - pivotGroup                — THREE.Group at (pivotX, pivotY, pivotZ)
 *   - mode / speed / osc*       — animation parameters
 *   - snapRules                 — bridge visibility gated on angle range
 *
 * Member attachment
 * ─────────────────
 * Member objects are `scene.attach()`-ed into pivotGroup so their world transform
 * is preserved at attach time.  On removal they are `scene.attach()`-ed back out.
 * `getMemberObjects(nodeId)` is an injected callback — RotationManager does not
 * import TrapManager, ObstacleManager, etc. (DIP).
 *
 * Floor Y correction
 * ──────────────────
 * Trap and zone members orbit the bowl surface; their world Y must be corrected
 * each tick to follow the curved surface.  `onAfterRotate` is an optional callback
 * that ArenaSandbox injects: `(rot) => this._applyFloorCorrection(rot)`.  This
 * keeps RotationManager generic — it knows nothing about arena geometry.
 *
 * Scene clear ordering
 * ────────────────────
 * `detachAll()` must be called BEFORE any other manager's clear() so that member
 * objects are returned to scene root before their own managers dispose them.
 *
 * nodeRotationId index
 * ────────────────────
 * RotationManager owns the `nodeId → rotationId` index.  Callers can query
 * `getRotationForNode(nodeId)` to find which rotation a node belongs to.
 *
 * Reuse
 * ─────
 * RotationManager has no arena-specific logic beyond what is injected.
 */
export class RotationManager
  extends FeatureManager<RotationData, RotationSave>
  implements ITickableManager
{
  /** nodeId → rotationId reverse index. */
  private readonly nodeRotationId = new Map<string, string>();

  constructor(
    ctx: SceneContext,
    /**
     * Returns all Three.js scene objects belonging to a node.
     * Injected by ArenaSandbox — resolves traps, obstacles, zones, walls.
     */
    private readonly getMemberObjects: (nodeId: string) => THREE.Object3D[],
    /**
     * Called after each tick rotation so the caller can apply floor-Y correction
     * for trap/zone members that orbit curved bowl surfaces.
     * Optional: pass undefined if floor correction is not needed.
     */
    private readonly onAfterRotate?: (rot: RotationData) => void,
    /**
     * Called after each tick rotation with per-bridge snap rules to toggle
     * bridge visibility based on current angle.
     */
    private readonly getBridge?: (bridgeId: string) => { group: THREE.Group } | undefined,
  ) {
    super(ctx, 'rot', 'Rotation');
  }

  // ── Public factory ───────────────────────────────────────────────────────

  /**
   * Create a rotation for a set of members (already in scene).
   * Any member already in a rotation is skipped.
   */
  add(
    memberIds:   string[],
    memberTypes: RotationNodeType[],
    pivotX: number,
    pivotY: number,
    pivotZ: number,
    treeParentId: string,
    treeOpts?:    Record<string, unknown>,
  ): RotationData | null {
    // Each node may belong to at most one rotation
    if (memberIds.some(id => this.nodeRotationId.has(id))) return null;

    const id   = this.nextId();
    const name = memberIds.length === 1
      ? `Rotate ${this.seq}`
      : `Group ↻ ${this.seq}`;

    const rot: RotationData = {
      id,
      name,
      memberIds:    [...memberIds],
      memberTypes:  [...memberTypes],
      pivotX,
      pivotY,
      pivotZ,
      mode:         'continuous',
      speed:        ROT.DEFAULT_SPEED,
      direction:    1,
      oscAmplitude: ROT.DEFAULT_OSC_AMP,
      oscFrequency: ROT.DEFAULT_OSC_FREQ,
      oscPhase:     0,
      enabled:      true,
      currentAngle: 0,
      snapRules:    [],
      pivotGroup:   null,
    };

    const pg = new THREE.Group();
    pg.position.set(pivotX, pivotY, pivotZ);
    this.ctx.scene.add(pg);
    rot.pivotGroup = pg;

    // Attach member objects into the pivot group (preserving world transform)
    for (const mid of memberIds) {
      for (const obj of this.getMemberObjects(mid)) pg.attach(obj);
    }

    this.items.set(id, rot);
    memberIds.forEach(mid => this.nodeRotationId.set(mid, id));
    this.ctx.sceneTree.add(id, name, '↻', treeParentId, treeOpts as never);

    return rot;
  }

  // ── Remove ───────────────────────────────────────────────────────────────

  /**
   * Remove a rotation: detach all member objects back to scene root,
   * remove the pivot group, clean up the nodeRotationId index.
   */
  override remove(id: string): boolean {
    const rot = this.items.get(id);
    if (!rot) return false;

    this._detachMembersToScene(rot);

    if (rot.pivotGroup) {
      this.ctx.scene.remove(rot.pivotGroup);
      rot.pivotGroup = null;
    }

    rot.memberIds.forEach(mid => this.nodeRotationId.delete(mid));
    this.items.delete(id);
    this.ctx.sceneTree.remove(id);
    return true;
  }

  /**
   * Remove a single member from its rotation.
   * If it is the last member, the entire rotation is removed.
   */
  removeMember(nodeId: string): void {
    const rotId = this.nodeRotationId.get(nodeId);
    if (!rotId) return;
    const rot = this.items.get(rotId);
    if (!rot) return;

    if (rot.memberIds.length <= 1) {
      this.remove(rotId);
      return;
    }

    // Detach just this node's objects back to scene root
    if (rot.pivotGroup) {
      for (const obj of this.getMemberObjects(nodeId)) {
        this.ctx.scene.attach(obj);
      }
    }

    this.nodeRotationId.delete(nodeId);
    const idx = rot.memberIds.indexOf(nodeId);
    if (idx >= 0) {
      rot.memberIds.splice(idx, 1);
      rot.memberTypes.splice(idx, 1);
    }
  }

  // ── Detach all (called before clear — MUST run before other managers' clear) ─

  /**
   * Detach all member objects from their pivot groups back to scene root.
   * This must be called before any other manager disposes its geometry so
   * that objects are in scene root and can be cleanly disposed.
   */
  detachAll(): void {
    for (const rot of this.items.values()) {
      this._detachMembersToScene(rot);
      if (rot.pivotGroup) {
        this.ctx.scene.remove(rot.pivotGroup);
        rot.pivotGroup = null;
      }
    }
  }

  override clear(): void {
    this.detachAll();
    this.items.clear();
    this.nodeRotationId.clear();
    this.seq = 0;
  }

  // ── Post-apply correction ─────────────────────────────────────────────────

  /**
   * Called after applyTrap/applyObstacle/applyZone/applyWall for any node in a rotation.
   * The apply functions reset mesh.position to natural scene-root coords; this corrects
   * them to group-local by subtracting pivotGroup.position.
   */
  afterApply(nodeId: string): void {
    const rotId = this.nodeRotationId.get(nodeId);
    if (!rotId) return;
    const rot = this.items.get(rotId);
    if (!rot || !rot.pivotGroup) return;

    const pg = rot.pivotGroup;
    for (const obj of this.getMemberObjects(nodeId)) {
      if (obj.parent === pg) {
        obj.position.x -= pg.position.x;
        obj.position.y -= pg.position.y;
        obj.position.z -= pg.position.z;
      } else if (obj.parent === this.ctx.scene) {
        const nat = obj.position.clone();
        pg.add(obj);
        obj.position.set(
          nat.x - pg.position.x,
          nat.y - pg.position.y,
          nat.z - pg.position.z,
        );
      }
    }
  }

  /** Update the pivot position and re-attach all members. */
  updatePivot(rot: RotationData): void {
    const pg = rot.pivotGroup;
    if (!pg) return;
    pg.position.set(rot.pivotX, rot.pivotY, rot.pivotZ);
    for (const mid of rot.memberIds) {
      for (const obj of this.getMemberObjects(mid)) pg.attach(obj);
    }
  }

  // ── Query ────────────────────────────────────────────────────────────────

  /** Returns the rotation ID that contains this node, or undefined. */
  getRotationIdForNode(nodeId: string): string | undefined {
    return this.nodeRotationId.get(nodeId);
  }

  /** Returns the rotation that contains this node, or undefined. */
  getRotationForNode(nodeId: string): RotationData | undefined {
    const rotId = this.nodeRotationId.get(nodeId);
    return rotId ? this.items.get(rotId) : undefined;
  }

  hasNode(nodeId: string): boolean {
    return this.nodeRotationId.has(nodeId);
  }

  // ── ITickableManager ─────────────────────────────────────────────────────

  tick(dt: number): void {
    const t = performance.now() / 1000;
    for (const rot of this.items.values()) {
      if (!rot.enabled || !rot.pivotGroup) continue;

      if (rot.mode === 'continuous') {
        rot.currentAngle += rot.speed * rot.direction * dt;
      } else {
        rot.currentAngle =
          rot.oscAmplitude *
          Math.sin(TWO_PI * rot.oscFrequency * t + rot.oscPhase);
      }

      rot.pivotGroup.rotation.y = DEG2RAD * rot.currentAngle;

      // Optional floor correction (trap/zone members on curved arena surface)
      this.onAfterRotate?.(rot);

      // Bridge snap rules: show/hide bridge based on angle window
      if (this.getBridge) {
        for (const rule of rot.snapRules) {
          const bridge = this.getBridge(rule.bridgeId);
          if (bridge) {
            const a = ((rot.currentAngle % 360) + 360) % 360;
            bridge.group.visible = a >= rule.minDeg && a <= rule.maxDeg;
          }
        }
      }
    }
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(_data: RotationData): void {
    // Pivot group is created in add() — nothing to do here.
  }

  protected disposeOne(data: RotationData): void {
    this._detachMembersToScene(data);
    if (data.pivotGroup) {
      this.ctx.scene.remove(data.pivotGroup);
      data.pivotGroup = null;
    }
    data.memberIds.forEach(mid => this.nodeRotationId.delete(mid));
  }

  // ── Serialisation ─────────────────────────────────────────────────────────

  toSave(data: RotationData): RotationSave {
    return rotationToSave(data);
  }

  fromSave(save: RotationSave): RotationData {
    return {
      id:           save.id,
      name:         save.name,
      memberIds:    [...save.memberIds],
      memberTypes:  [...save.memberTypes],
      pivotX:       save.pivotX,
      pivotY:       save.pivotY,
      pivotZ:       save.pivotZ,
      mode:         save.mode as RotationMode,
      speed:        save.speed,
      direction:    save.direction,
      oscAmplitude: save.oscAmplitude,
      oscFrequency: save.oscFrequency,
      oscPhase:     save.oscPhase,
      enabled:      save.enabled,
      currentAngle: 0,  // runtime-only
      snapRules:    save.snapRules.map(r => ({ ...r })),
      pivotGroup:   null,  // runtime-only
    };
  }

  // ── Build + show (used during restore / undo-redo) ───────────────────────

  /**
   * Restore a rotation from hydrated data: create the pivot group,
   * attach member objects, and add the tree node.
   */
  buildAndShow(
    data:         RotationData,
    treeParentId: string,
    treeOpts?:    Record<string, unknown>,
  ): void {
    const pg = new THREE.Group();
    pg.position.set(data.pivotX, data.pivotY, data.pivotZ);
    this.ctx.scene.add(pg);
    data.pivotGroup = pg;

    for (const mid of data.memberIds) {
      for (const obj of this.getMemberObjects(mid)) pg.attach(obj);
      this.nodeRotationId.set(mid, data.id);
    }

    this.ctx.sceneTree.add(data.id, data.name, '↻', treeParentId, treeOpts as never);
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private _detachMembersToScene(rot: RotationData): void {
    if (!rot.pivotGroup) return;
    for (const mid of rot.memberIds) {
      for (const obj of this.getMemberObjects(mid)) {
        this.ctx.scene.attach(obj);
      }
    }
  }
}

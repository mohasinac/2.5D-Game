import * as THREE from 'three';
import type {
  BridgeData,
  BridgeSegmentData,
  BridgeSegmentType,
  SurfaceType,
  ArenaData,
  WallData,
} from '../../types/arenaTypes';
import type { BridgeSave, BridgeSegmentSave } from '../../utils/arenaPersistence';
import {
  buildSegmentDeckGeometry,
  buildSegmentEdgeGeometry,
  computeSegmentEndPose,
  resolveStartPose,
  defaultBridgeSection,
  defaultSegment,
  DEFAULT_START_POSE,
  type SegmentPose,
} from '../../geometry/bridgeSegmentBuilders';
import { buildSurfaceMaterial } from '../../geometry/materialBuilders';
import { bridgeToSave } from '../../utils/arenaPersistence';
import { FeatureManager } from '../FeatureManager';
import type { SceneContext } from '../IArenaFeature';

/**
 * Manages bridges and their ordered chains of segments.
 *
 * Architecture
 * ────────────
 * BridgeManager extends FeatureManager<BridgeData, BridgeSave> and internally
 * owns a second Map<string, BridgeSegmentData> (segments) + segSeq counter.
 * Segment CRUD is exposed as delegation methods (addSegment, removeSegment,
 * applySegment, applyBridgeFromSegment).
 *
 * Bridge group rule
 * ─────────────────
 * Segment meshes are children of bridge.group, NOT scene root.
 * Always use bridge.group.add/remove — never scene.add/scene.remove — for segments.
 * bridge.group itself is added to the scene exactly once on bridge creation.
 *
 * Wall cascade
 * ────────────
 * Bridge walls (wallIds[]) are owned by WallManager but tracked here.
 * disposeWithWalls() accepts an injected removeWall callback to keep BridgeManager
 * decoupled from WallManager.
 *
 * Serialisation
 * ─────────────
 * toSave() delegates to bridgeToSave() which needs both the segments map and the
 * wall map (to inline saved walls into the BridgeSave). Callers pass those maps.
 * fromSave() creates the bridge shell + restores segment data objects; geometry is
 * built afterwards by calling applyBridgeFromSegment(segmentIds[0]).
 *
 * Reuse
 * ─────
 * BridgeManager has no dependency on ArenaSandbox beyond what SceneContext provides
 * and what is injected via the constructor.
 */
export class BridgeManager extends FeatureManager<BridgeData, BridgeSave> {

  /** Internal segment store — parallel to FeatureManager.items for bridges. */
  private readonly segments = new Map<string, BridgeSegmentData>();
  private segSeq = 0;

  constructor(
    ctx: SceneContext,
    /** Live arenas map — needed by resolveStartPose for arena-anchored bridges. */
    private readonly getArenas: () => ReadonlyMap<string, ArenaData>,
    /** Live walls map — needed by resolveStartPose for wall-anchored bridges. */
    private readonly getWalls:  () => ReadonlyMap<string, WallData>,
  ) {
    super(ctx, 'bridge', 'Bridge');
  }

  // ── Public factory ───────────────────────────────────────────────────────

  /**
   * Create a new bridge with an empty THREE.Group and a default straight segment.
   * @param treeOpts  Scene-tree node options (add-child buttons injected by caller).
   */
  add(treeOpts?: Record<string, unknown>): BridgeData {
    const id    = this.nextId();
    const name  = this.nextLabel();
    const group = new THREE.Group();
    this.ctx.scene.add(group);

    const bridge: BridgeData = {
      id,
      name,
      startRef:         null,
      segmentIds:       [],
      section:          defaultBridgeSection(),
      color:            0xaaaacc,
      surface:          'metal' as SurfaceType,
      wallIds:          [],
      presentStlb64:    null,
      presentColor:     0xaaaaaa,
      group,
      linkedSpeedLineId: null,
    };

    this.items.set(id, bridge);
    this.ctx.sceneTree.add(id, name, '🌉', 'octagon-base', treeOpts as never);

    // Default first segment
    this.addSegment(id, 'straight');

    return bridge;
  }

  // ── Segment CRUD ─────────────────────────────────────────────────────────

  addSegment(
    bridgeId: string,
    type:     BridgeSegmentType,
    treeOpts?: Record<string, unknown>,
  ): BridgeSegmentData | null {
    const bridge = this.items.get(bridgeId);
    if (!bridge) return null;

    const sid  = `seg-${++this.segSeq}`;
    const name = `Seg ${this.segSeq}`;
    const seg  = defaultSegment(sid, name, bridgeId, bridge.segmentIds.length, type);

    this.segments.set(sid, seg);
    bridge.segmentIds.push(sid);
    this.applySegment(seg);

    this.ctx.sceneTree.add(sid, name, segmentIcon(type), bridgeId, treeOpts as never);
    return seg;
  }

  removeSegment(id: string): void {
    const seg = this.segments.get(id);
    if (!seg) return;
    const bridge = this.items.get(seg.bridgeId);
    if (!bridge) return;

    const idx = bridge.segmentIds.indexOf(id);
    if (idx < 0) return;

    this._disposeSegment(seg, bridge);
    this.ctx.sceneTree.remove(id);

    bridge.segmentIds.splice(idx, 1);
    this.segments.delete(id);

    // Update orderIndex for subsequent segments and rebuild from first affected
    for (let i = idx; i < bridge.segmentIds.length; i++) {
      const s = this.segments.get(bridge.segmentIds[i]);
      if (s) { s.orderIndex = i; this.applySegment(s); }
    }
  }

  /**
   * Rebuild geometry for a single segment (update in-place or create).
   * Segments are children of bridge.group — never added directly to scene.
   */
  applySegment(seg: BridgeSegmentData): void {
    const bridge = this.items.get(seg.bridgeId);
    if (!bridge) return;

    const startPose = this._segmentStartPose(seg, bridge);
    const sec       = bridge.section;
    const color:   number      = seg.color   ?? sec.color;
    const surface: SurfaceType = seg.surface ?? sec.surface;

    const geo  = buildSegmentDeckGeometry(seg, startPose, sec);
    const eGeo = buildSegmentEdgeGeometry(seg, startPose, sec);

    // Compute center for animation pivot
    geo.computeBoundingBox();
    const center = new THREE.Vector3();
    geo.boundingBox!.getCenter(center);
    seg._animCenter.copy(center);
    const negCenter = center.clone().negate();

    if (!seg._animPivot) {
      seg._animPivot = new THREE.Group();
      if (seg.mesh)  { bridge.group.remove(seg.mesh);  seg._animPivot.add(seg.mesh); }
      if (seg.edges) { bridge.group.remove(seg.edges); seg._animPivot.add(seg.edges); }
      bridge.group.add(seg._animPivot);
    }
    seg._animPivot.position.copy(center);
    if (!seg.animEnabled) seg._animPivot.rotation.set(0, 0, 0);

    const segMat = buildSurfaceMaterial({
      color,
      surface,
      customTileData: sec.customTileData,
      tileScale:      sec.tileScale,
      transparent:    sec.opacity < 1,
      opacity:        sec.opacity,
    });
    (segMat as THREE.MeshStandardMaterial).emissive.setHex(sec.emissiveColor);
    (segMat as THREE.MeshStandardMaterial).emissiveIntensity = sec.emissiveIntensity;
    (segMat as THREE.MeshStandardMaterial).depthWrite = sec.opacity >= 1;

    if (seg.mesh) {
      seg.mesh.geometry.dispose();
      (seg.mesh.material as THREE.Material).dispose();
      seg.mesh.geometry = geo;
      seg.mesh.material = segMat;
      seg.mesh.position.copy(negCenter);
    } else {
      seg.mesh = new THREE.Mesh(geo, segMat);
      seg.mesh.position.copy(negCenter);
      seg._animPivot.add(seg.mesh);
    }

    const edgeCol = new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.5);
    if (seg.edges) {
      seg.edges.geometry.dispose();
      seg.edges.geometry = eGeo;
      (seg.edges.material as THREE.LineBasicMaterial).color.copy(edgeCol);
      seg.edges.position.copy(negCenter);
    } else {
      seg.edges = new THREE.LineSegments(
        eGeo,
        new THREE.LineBasicMaterial({ color: edgeCol }),
      );
      seg.edges.position.copy(negCenter);
      seg._animPivot.add(seg.edges);
    }

    this.ctx.trackObjects(seg.id, [seg.mesh, seg.edges]);
  }

  /** Reapply segId and every subsequent segment in the same bridge. */
  applyBridgeFromSegment(segId: string): void {
    const seg = this.segments.get(segId);
    if (!seg) return;
    const bridge = this.items.get(seg.bridgeId);
    if (!bridge) return;

    const startIdx = bridge.segmentIds.indexOf(segId);
    if (startIdx < 0) return;

    for (let i = startIdx; i < bridge.segmentIds.length; i++) {
      const s = this.segments.get(bridge.segmentIds[i]);
      if (s) this.applySegment(s);
    }
  }

  /** Rebuild ALL segments from the first one (e.g. after bridge.section change). */
  applyAllSegments(bridgeId: string): void {
    const bridge = this.items.get(bridgeId);
    if (!bridge || bridge.segmentIds.length === 0) return;
    this.applyBridgeFromSegment(bridge.segmentIds[0]);
  }

  // ── Segment accessors ────────────────────────────────────────────────────

  getSegment(id: string): BridgeSegmentData | undefined {
    return this.segments.get(id);
  }

  getAllSegments(): ReadonlyMap<string, BridgeSegmentData> {
    return this.segments;
  }

  getSegmentsForBridge(bridgeId: string): BridgeSegmentData[] {
    const bridge = this.items.get(bridgeId);
    if (!bridge) return [];
    return bridge.segmentIds
      .map(id => this.segments.get(id))
      .filter((s): s is BridgeSegmentData => s !== undefined);
  }

  getSegSeq(): number { return this.segSeq; }
  restoreSegSeq(n: number): void { this.segSeq = Math.max(this.segSeq, n); }

  // ── Remove bridge with wall cascade ─────────────────────────────────────

  /**
   * Remove a bridge and cascade-dispose its child walls.
   * @param removeWall  Injected callback — WallManager.remove(id).
   *                    BridgeManager stays decoupled from WallManager.
   */
  removeWithWalls(id: string, removeWall: (wallId: string) => void): boolean {
    const bridge = this.items.get(id);
    if (!bridge) return false;
    for (const wid of bridge.wallIds) removeWall(wid);
    return this.remove(id);
  }

  // ── Build + show (used during restore / undo-redo) ───────────────────────

  buildAndShow(data: BridgeData, treeOpts?: Record<string, unknown>): void {
    // group was already added to scene in fromSave; just register tree node
    this.ctx.sceneTree.add(data.id, data.name, '🌉', 'octagon-base', treeOpts as never);
    if (data.segmentIds.length > 0) {
      this.applyBridgeFromSegment(data.segmentIds[0]);
    }
  }

  /** Register a restored segment's tree node and rebuild geometry. */
  buildAndShowSegment(
    seg:      BridgeSegmentData,
    treeOpts?: Record<string, unknown>,
  ): void {
    this.ctx.sceneTree.add(seg.id, seg.name, segmentIcon(seg.type), seg.bridgeId, treeOpts as never);
    this.applySegment(seg);
  }

  // ── Restore segment data (no geometry) ──────────────────────────────────

  /**
   * Hydrate a segment from its save object without building geometry.
   * Geometry is built afterwards by buildAndShowSegment() / applyBridgeFromSegment().
   */
  restoreSegment(save: BridgeSegmentSave, bridgeId: string): BridgeSegmentData {
    const seg = defaultSegment(save.id, save.name, bridgeId, save.orderIndex, save.type);
    Object.assign(seg, {
      length:           save.length,
      rampAngle:        save.rampAngle,
      curveRadius:      save.curveRadius,
      curveAngle:       save.curveAngle,
      curveDirection:   save.curveDirection,
      bankAngle:        save.bankAngle,
      cp1X:             save.cp1X,
      cp1Y:             save.cp1Y,
      cp1Z:             save.cp1Z,
      cp2X:             save.cp2X,
      cp2Y:             save.cp2Y,
      cp2Z:             save.cp2Z,
      endX:             save.endX,
      endY:             save.endY,
      endZ:             save.endZ,
      loopRadius:       save.loopRadius,
      loopOrientation:  save.loopOrientation,
      tiltAngle:        save.tiltAngle,
      corkscrewLength:  save.corkscrewLength,
      corkscrewTurns:   save.corkscrewTurns,
      color:            save.color,
      surface:          save.surface,
      animEnabled:    save.animEnabled    ?? false,
      animOffsetX:    save.animOffsetX    ?? 0,
      animOffsetY:    save.animOffsetY    ?? 0,
      animOffsetZ:    save.animOffsetZ    ?? 0,
      animRotX:       save.animRotX      ?? 0,
      animRotY:       save.animRotY      ?? 0,
      animRotZ:       save.animRotZ      ?? 0,
      animStartMs:    save.animStartMs    ?? 0,
      animIntervalMs: save.animIntervalMs ?? 2000,
      animHoldMs:     save.animHoldMs    ?? 1000,
    });
    const n = parseInt(save.id.split('-')[1] ?? '0', 10);
    if (n > this.segSeq) this.segSeq = n;
    this.segments.set(save.id, seg);
    return seg;
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(_data: BridgeData): void {
    // bridge.group is already in scene (added in add() / fromSave()).
    // Segments are built via addSegment() / applyBridgeFromSegment().
  }

  protected disposeOne(data: BridgeData): void {
    for (const sid of data.segmentIds) {
      const seg = this.segments.get(sid);
      if (seg) {
        this._disposeSegment(seg, data);
        this.ctx.sceneTree.remove(sid);
        this.segments.delete(sid);
      }
    }
    this.ctx.scene.remove(data.group);
  }

  // ── Serialisation ─────────────────────────────────────────────────────────

  /**
   * Serialise a bridge.  Needs the live wall map to inline bridge-wall saves.
   * @param wallMap  Live WallData map from WallManager (for bridge-parented walls).
   */
  toSaveWithWalls(data: BridgeData, wallMap: Map<string, import('../../types/arenaTypes').WallData>): BridgeSave {
    return bridgeToSave(data, this.segments, wallMap);
  }

  toSave(data: BridgeData): BridgeSave {
    return bridgeToSave(data, this.segments, new Map());
  }

  fromSave(save: BridgeSave): BridgeData {
    const group = new THREE.Group();
    this.ctx.scene.add(group);

    const bridge: BridgeData = {
      id:               save.id,
      name:             save.name,
      startRef:         save.startRef as BridgeData['startRef'],
      segmentIds:       [],
      section:          { ...defaultBridgeSection(), ...save.section },
      color:            save.color,
      surface:          save.surface,
      wallIds:          [],
      presentStlb64:    save.presentStlb64,
      presentColor:     save.presentColor,
      group,
      linkedSpeedLineId: save.linkedSpeedLineId ?? null,
    };

    // Restore segment data objects (no geometry yet)
    for (const ss of save.segments) {
      const seg = this.restoreSegment(ss, save.id);
      bridge.segmentIds.push(seg.id);
    }

    return bridge;
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  /** Compute the start pose for a given segment by chaining from bridge.startRef. */
  private _segmentStartPose(seg: BridgeSegmentData, bridge: BridgeData): SegmentPose {
    let pose: SegmentPose = bridge.startRef
      ? resolveStartPose(
          bridge.startRef,
          this.getArenas() as Map<string, ArenaData>,
          this.getWalls() as Map<string, WallData>,
          this.ctx.getBaseHeight(),
        )
      : {
          pos: DEFAULT_START_POSE.pos.clone(),
          dir: DEFAULT_START_POSE.dir.clone(),
          up:  DEFAULT_START_POSE.up.clone(),
        };

    for (const sid of bridge.segmentIds) {
      if (sid === seg.id) break;
      const prev = this.segments.get(sid);
      if (prev) pose = computeSegmentEndPose(prev, pose, bridge.section);
    }
    return pose;
  }

  private _disposeSegment(seg: BridgeSegmentData, bridge: BridgeData): void {
    if (seg.mesh) {
      seg.mesh.geometry.dispose();
      (seg.mesh.material as THREE.Material).dispose();
      seg.mesh = null;
    }
    if (seg.edges) {
      seg.edges.geometry.dispose();
      (seg.edges.material as THREE.Material).dispose();
      seg.edges = null;
    }
    if (seg._animPivot) {
      bridge.group.remove(seg._animPivot);
      seg._animPivot = null;
    }
    this.ctx.untrackObjects(seg.id);
  }
}

// ── Module-private helpers ────────────────────────────────────────────────

function segmentIcon(type: BridgeSegmentType): string {
  switch (type) {
    case 'straight':    return '━';
    case 'curve':       return '↩';
    case 'ramp':        return '↗';
    case 'loop':        return '⭕';
    case 'return_loop': return '↩⭕';
    case 'exit_loop':   return '↑⭕';
    case 'hairpin':     return '↺';
    case 'corkscrew':   return '🌀';
    case 'chicane':     return '⟨⟩';
    case 'bezier':      return '〜';
    default:            return '━';
  }
}

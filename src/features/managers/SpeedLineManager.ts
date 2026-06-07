import * as THREE from 'three';
import type { SpeedLineData, ArenaData, ZoneData } from '../../types/arenaTypes';
import type { SpeedLineSave } from '../../utils/arenaPersistence';
import {
  defaultSpeedLine,
  buildSpeedLineObjects,
} from '../../geometry/arenaObjectBuilders';
import { speedLineToSave } from '../../utils/arenaPersistence';
import type { SceneSurfaceProjector } from '../../geometry/sceneSurfaceProjector';
import { FeatureManager } from '../FeatureManager';
import type { SceneContext } from '../IArenaFeature';

/**
 * Manages speed line paths — guided physics-force ribbons painted on arena bowl surfaces.
 *
 * Speed lines are arena-parented; each has a `parentArenaId` and an optional
 * `parentZoneId` (if placed inside a zone).  They are stored flat (not nested) and
 * grouped in the scene tree under the arena or zone node.
 *
 * Two modes
 * ─────────
 * `presetType === 'custom'` — segment-by-segment editing (handles visible, segment editor shown).
 * Any other presetType   — auto-generated path from presetParams; segment editor hidden.
 *
 * Surface projector
 * ─────────────────
 * The `buildProjector` callback is injected by the caller (ArenaSandbox) because it needs
 * access to live wall, obstacle, and bridge-segment meshes for accurate raycast projection.
 * SpeedLineManager stays decoupled from WallManager, ObstacleManager, and BridgeManager.
 *
 * Overlap markers
 * ───────────────
 * Overlap detection (cross-path sphere markers) is handled by the caller via the
 * `checkOverlaps` injected callback — it requires knowledge of all speed lines on an
 * arena and zone surface functions, which are outside this manager's scope.
 *
 * Reuse
 * ─────
 * SpeedLineManager depends only on SceneContext plus three injected callbacks.
 * It can be used in any Three.js scene that hosts arena speed lines.
 */
export class SpeedLineManager extends FeatureManager<SpeedLineData, SpeedLineSave> {

  constructor(
    ctx: SceneContext,
    /** Live arena lookup — injected, never imported. */
    private readonly getArena: (id: string) => ArenaData | undefined,
    /** Live zones map — injected for surfFn resolution in applySpeedLine. */
    private readonly getZones: () => ReadonlyMap<string, ZoneData>,
    /**
     * Surface projector factory — injected by ArenaSandbox which has access to
     * live wall/obstacle/bridge meshes needed for accurate raycast projection.
     * Returns undefined if the arena is not found or has no registered meshes.
     */
    private readonly buildProjector: (arenaId: string) => SceneSurfaceProjector | undefined,
  ) {
    super(ctx, 'sl', 'Speed Line');
  }

  // ── Public factory ───────────────────────────────────────────────────────

  /**
   * Add a new speed line on an arena, optionally parented to a zone.
   * @param slSegSeqRef  Mutable counter wrapper: `{ value: this.slSegSeq }`.
   *                     The first segment's ID is assigned from this counter so
   *                     the caller can keep slSegSeq in sync.
   */
  add(
    arenaId:      string,
    parentZoneId: string | null = null,
    slSegSeqRef:  { value: number },
    treeOpts?:    Record<string, unknown>,
  ): SpeedLineData | null {
    const arena = this.getArena(arenaId);
    if (!arena) return null;

    const id   = this.nextId();
    const name = this.nextLabel();
    const sl   = defaultSpeedLine(name, arenaId, id, parentZoneId);

    // Assign the first segment's ID using the caller's slSegSeq
    sl.segments[0].id = `${id}-seg-${++slSegSeqRef.value}`;

    this.items.set(id, sl);

    const projector = this.buildProjector(arenaId);
    const { mesh, edges, markerMeshes, handleMeshes, totalLength } =
      buildSpeedLineObjects(sl, arena, this.getZones() as Map<string, ZoneData>, projector);
    sl.mesh          = mesh;
    sl.edges         = edges;
    sl.markerMeshes  = markerMeshes;
    sl.handleMeshes  = handleMeshes;
    sl.totalLength   = totalLength;

    this.ctx.scene.add(...markerMeshes, ...handleMeshes);
    this.ctx.renderMgr.add(id, [mesh, edges]);

    const treeParentId = parentZoneId ?? arenaId;
    this.ctx.sceneTree.add(id, name, '↝', treeParentId, treeOpts as never);

    return sl;
  }

  // ── Apply (rebuild all geometry in-place after property edits) ───────────

  apply(sl: SpeedLineData): void {
    const arena = this.getArena(sl.parentArenaId);
    if (!arena) return;

    // Dispose old markers/handles/overlaps (scene-managed directly)
    for (const m of sl.markerMeshes)   { this.ctx.scene.remove(m); m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
    for (const m of sl.handleMeshes)   { this.ctx.scene.remove(m as unknown as THREE.Mesh); (m as unknown as THREE.Mesh).geometry.dispose(); ((m as unknown as THREE.Mesh).material as THREE.Material).dispose(); }
    for (const m of sl.overlapMarkers) { this.ctx.scene.remove(m); m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
    sl.markerMeshes = []; sl.handleMeshes = []; sl.overlapMarkers = [];

    // Detach old mesh+edges from scene (without geo-dispose) then dispose manually
    this.ctx.renderMgr.detach(sl.id);
    if (sl.mesh)  { sl.mesh.geometry.dispose();  (sl.mesh.material  as THREE.Material).dispose(); }
    if (sl.edges) { sl.edges.geometry.dispose(); (sl.edges.material as THREE.Material).dispose(); }

    // Build new objects
    const projector = this.buildProjector(sl.parentArenaId);
    const { mesh, edges, markerMeshes, handleMeshes, totalLength } =
      buildSpeedLineObjects(sl, arena, this.getZones() as Map<string, ZoneData>, projector);
    sl.mesh = mesh; sl.edges = edges;
    sl.markerMeshes = markerMeshes; sl.handleMeshes = handleMeshes;
    sl.totalLength  = totalLength;

    this.ctx.scene.add(...markerMeshes, ...handleMeshes);
    this.ctx.renderMgr.add(sl.id, [mesh, edges]);
    this.setVisible(sl.id, sl.visible ?? true);
  }

  // ── Build + show (used during restore / undo-redo) ───────────────────────

  buildAndShow(data: SpeedLineData, treeOpts?: Record<string, unknown>): void {
    const arena = this.getArena(data.parentArenaId);
    if (!arena) return;

    const projector = this.buildProjector(data.parentArenaId);
    const { mesh, edges, markerMeshes, handleMeshes, totalLength } =
      buildSpeedLineObjects(data, arena, this.getZones() as Map<string, ZoneData>, projector);
    data.mesh         = mesh;
    data.edges        = edges;
    data.markerMeshes = markerMeshes;
    data.handleMeshes = handleMeshes;
    data.totalLength  = totalLength;

    this.ctx.scene.add(...markerMeshes, ...handleMeshes);
    this.ctx.renderMgr.add(data.id, [mesh, edges]);

    const treeParentId = data.parentZoneId ?? data.parentArenaId;
    this.ctx.sceneTree.add(data.id, data.name, '↝', treeParentId, treeOpts as never);
  }

  // ── Visibility helpers (used for custom-mode drag handle interaction) ────

  showHandles(sl: SpeedLineData): void {
    sl.handleMeshes.forEach(h => { h.visible = true; });
  }

  hideHandles(sl: SpeedLineData): void {
    sl.handleMeshes.forEach(h => { h.visible = false; });
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(data: SpeedLineData): void {
    // Building is done in add() and buildAndShow() — geometry needs the arena
    // object which is retrieved from the injected getArena().
    const arena = this.getArena(data.parentArenaId);
    if (!arena) return;
    const projector = this.buildProjector(data.parentArenaId);
    const { mesh, edges, markerMeshes, handleMeshes, totalLength } =
      buildSpeedLineObjects(data, arena, this.getZones() as Map<string, ZoneData>, projector);
    data.mesh         = mesh;
    data.edges        = edges;
    data.markerMeshes = markerMeshes;
    data.handleMeshes = handleMeshes;
    data.totalLength  = totalLength;
    this.ctx.scene.add(...markerMeshes, ...handleMeshes);
    this.ctx.renderMgr.add(data.id, [mesh, edges]);
  }

  protected disposeOne(data: SpeedLineData): void {
    // mesh + edges are disposed by renderMgr.dispose() called by FeatureManager.remove()
    for (const m of data.markerMeshes)   { this.ctx.scene.remove(m); m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
    for (const m of data.handleMeshes)   { this.ctx.scene.remove(m as unknown as THREE.Mesh); (m as unknown as THREE.Mesh).geometry.dispose(); ((m as unknown as THREE.Mesh).material as THREE.Material).dispose(); }
    for (const m of data.overlapMarkers) { this.ctx.scene.remove(m); m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
    data.markerMeshes   = [];
    data.handleMeshes   = [];
    data.overlapMarkers = [];
  }

  // ── Serialisation ─────────────────────────────────────────────────────────

  toSave(data: SpeedLineData): SpeedLineSave {
    return speedLineToSave(data);
  }

  fromSave(save: SpeedLineSave): SpeedLineData {
    return {
      ...save,
      linkedBridgeId: save.linkedBridgeId ?? null,
      linkedTrapId:   save.linkedTrapId   ?? null,
      enabled:        save.enabled        ?? true,
      targetBridgeId: save.targetBridgeId ?? null,
      targetTrapId:   save.targetTrapId   ?? null,
      jumpLinkId:     save.jumpLinkId     ?? null,
      visible:        save.visible        ?? true,
      pointNormals:  [],
      totalLength:   0,
      mesh:          null as unknown as THREE.Mesh,
      edges:         null as unknown as THREE.LineSegments,
      markerMeshes:  [],
      handleMeshes:  [],
      overlapMarkers: [],
    } as SpeedLineData;
  }
}

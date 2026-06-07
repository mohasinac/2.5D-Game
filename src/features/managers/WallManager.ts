import * as THREE from 'three';
import type { WallData, ArenaData, TrapData } from '../../types/arenaTypes';
import type { WallSave } from '../../utils/arenaPersistence';
import {
  buildWallGeometry,
  buildWallEdgeGeometry,
  defaultWallData,
  trapRimPoints,
  trapWorldCenter,
} from '../../geometry/wallBuilders';
import { buildSurfaceMaterial } from '../../geometry/materialBuilders';
import { shapePoints } from '../../geometry/surfaceUtils';
import { wallToSave } from '../../utils/arenaPersistence';
import { DEG2RAD, TRAP_PLATE_HEIGHT, TWO_PI } from '../../config/arenaConstants';
import { FeatureManager } from '../FeatureManager';
import type { SceneContext, ITickableManager } from '../IArenaFeature';

/**
 * Manages walls — rim-mounted barriers extruded from arena rims, trap surfaces,
 * bridge decks, or the octagon base.
 *
 * Four parent types:
 *   'arena'  — attaches to an arena rim; arc/tilt geometry; auto-join/auto-rotation supported
 *   'base'   — free-standing on the octagon base; positioned via basePosX/Z/baseRotY/baseLength
 *   'trap'   — attaches to a trap plate top surface; rim = trapRimPoints translated to world space
 *   'bridge' — deck-edge walls; rebuilt exclusively by BridgeManager.applyBridgeFromSegment
 *
 * Auto-join
 * ─────────
 * When autoJoin=true and two arena walls share an arc boundary (within 1°), the shared
 * end-cap face is suppressed, producing a seamless corner join.  A _rebuildingSiblings
 * Set<string> guard prevents infinite recursion when rebuilding adjacent walls.
 *
 * Auto-rotation
 * ─────────────
 * When rotateOnArena=true, a THREE.Group pivot (_rotatePivot) is created at the arena
 * centre.  Mesh + edges are reparented into it.  tick(dt) advances pivot.rotation.y
 * each frame according to arenaRotateMode (continuous / step / oscillate).
 *
 * Bridge walls
 * ────────────
 * Bridge-parented walls are never applied here.  Callers (BridgeManager) are responsible
 * for their geometry.  apply() returns early for bridge-type walls.
 *
 * Reuse
 * ─────
 * WallManager has no arena-specific dependencies beyond what is injected via SceneContext
 * and the three getter callbacks (getArena, getTrap, getTrapSurfY).
 */
export class WallManager
  extends FeatureManager<WallData, WallSave>
  implements ITickableManager
{
  constructor(
    ctx: SceneContext,
    /** Live arena lookup — injected, never imported from ArenaSandbox. */
    private readonly getArena:    (id: string) => ArenaData | undefined,
    /** Live full arenas map — needed by trapWorldCenter for arena-parented traps. */
    private readonly getArenas:   () => ReadonlyMap<string, ArenaData>,
    /** Live trap lookup — injected for trap-parented walls. */
    private readonly getTrap:     (id: string) => TrapData | undefined,
    /** Trap surface Y resolver — delegates to trapSurfY(trap, arenas, baseH). */
    private readonly getTrapSurfY:(trap: TrapData) => number,
  ) {
    super(ctx, 'wall', 'Wall');
  }

  // ── Public factories ─────────────────────────────────────────────────────

  addToArena(arenaId: string, treeOpts?: Record<string, unknown>): WallData {
    const id   = this.nextId();
    const data = defaultWallData(id, this.nextLabel(), arenaId, 'arena');
    return this._insert(data, '🧱', arenaId, treeOpts);
  }

  addToBase(treeOpts?: Record<string, unknown>): WallData {
    const id   = this.nextId();
    const data = defaultWallData(id, this.nextLabel(), 'octagon-base', 'base');
    return this._insert(data, '🧱', 'octagon-base', treeOpts);
  }

  addToTrap(trapId: string, treeOpts?: Record<string, unknown>): WallData {
    const id   = this.nextId();
    const data = defaultWallData(id, this.nextLabel(), trapId, 'trap');
    return this._insert(data, '🧱', trapId, treeOpts);
  }

  addToBridge(bridgeId: string, treeOpts?: Record<string, unknown>): WallData {
    const id   = this.nextId();
    const data = defaultWallData(id, this.nextLabel(), bridgeId, 'bridge');
    return this._insert(data, '🧱', bridgeId, treeOpts);
  }

  // ── Apply (rebuild geometry in-place after property edits) ───────────────

  /**
   * Rebuild mesh+edges for a wall and update the scene.
   * @param _rebuildingSiblings  Set of wall IDs currently being rebuilt for auto-join;
   *                             prevents infinite recursion when rebuilding adjacent walls.
   */
  apply(wall: WallData, _rebuildingSiblings?: Set<string>): void {
    let rimPts: THREE.Vector2[];
    let rimY: number;
    let cx = 0;
    let cz = 0;

    if (wall.parentType === 'arena') {
      const arena = this.getArena(wall.parentId);
      if (!arena) return;
      if (arena.isMoat && wall.moatRing === 'inner') {
        rimPts = shapePoints({
          ...arena,
          radiusX:      arena.innerRadiusX,
          radiusZ:      arena.innerRadiusZ,
          openingShape: arena.innerOpeningShape,
          sides:        arena.innerSides,
          starInner:    arena.innerStarInner,
        } as typeof arena);
        rimY = arena.posY + arena.innerRimOffset;
      } else {
        rimPts = shapePoints(arena);
        rimY   = arena.posY;
      }
      cx = arena.posX;
      cz = arena.posZ;
    } else if (wall.parentType === 'base') {
      rimPts = [];
      rimY   = this.ctx.getFallbackY();
      cx     = wall.basePosX;
      cz     = wall.basePosZ;
    } else if (wall.parentType === 'trap') {
      const trap = this.getTrap(wall.parentId);
      if (!trap) return;
      const surfY = this.getTrapSurfY(trap);
      rimY = surfY + TRAP_PLATE_HEIGHT;
      const c = trapWorldCenter(trap, this.getArenas() as Map<string, ArenaData>);
      // trapRimPoints returns trap-LOCAL XZ (centred 0,0); translate to world space so that
      // inwardDir and inner-offset calculations in the geometry builder use consistent coords.
      rimPts = trapRimPoints(trap).map(
        p => new THREE.Vector2(p.x + c.x, p.y + c.z),
      );
      cx = c.x;
      cz = c.z;
    } else {
      // bridge walls: rebuilt exclusively by BridgeManager — do nothing here
      return;
    }

    // Auto-join: detect adjacent arena walls sharing an arc boundary (within 1°)
    let joinStart = false;
    let joinEnd   = false;
    if (wall.autoJoin && wall.parentType === 'arena') {
      for (const w of this.items.values()) {
        if (w.id === wall.id || w.parentId !== wall.parentId || w.parentType !== 'arena') continue;
        const a0 = (wall.arcStart % 360 + 360) % 360;
        const a1 = (wall.arcEnd   % 360 + 360) % 360;
        const b0 = (w.arcStart    % 360 + 360) % 360;
        const b1 = (w.arcEnd      % 360 + 360) % 360;
        if (Math.abs(b1 - a0) < 1) joinStart = true;
        if (Math.abs(b0 - a1) < 1) joinEnd   = true;
      }
    }

    const geo  = buildWallGeometry(wall, rimPts, rimY, cx, cz, joinStart, joinEnd);
    const eGeo = buildWallEdgeGeometry(wall, rimPts, rimY, cx, cz, joinStart, joinEnd);

    const wallMat = buildSurfaceMaterial({
      color:          wall.color,
      surface:        wall.surface,
      customTileData: wall.customTileData,
      tileScale:      wall.tileScale,
      transparent:    wall.opacity < 1,
      opacity:        wall.opacity,
    });
    (wallMat as THREE.MeshStandardMaterial).emissive.setHex(wall.emissiveColor);
    (wallMat as THREE.MeshStandardMaterial).emissiveIntensity = wall.emissiveIntensity;
    (wallMat as THREE.MeshStandardMaterial).depthWrite = wall.opacity >= 1;

    // Detach from old pivot group if rotation was just disabled
    if (wall._rotatePivot && !wall.rotateOnArena) {
      this.ctx.scene.remove(wall._rotatePivot);
      wall._rotatePivot.clear();
      wall._rotatePivot = undefined;
    }

    // Update or create mesh
    if (wall.mesh) {
      wall.mesh.geometry.dispose();
      wall.mesh.geometry = geo;
      (wall.mesh.material as THREE.Material).dispose();
      wall.mesh.material = wallMat;
    } else {
      wall.mesh = new THREE.Mesh(geo, wallMat);
      this.ctx.scene.add(wall.mesh);
    }

    // Update or create edge lines
    const edgeCol = new THREE.Color(wall.color).lerp(new THREE.Color(0xffffff), 0.5);
    if (wall.edges) {
      wall.edges.geometry.dispose();
      wall.edges.geometry = eGeo;
      (wall.edges.material as THREE.LineBasicMaterial).color.copy(edgeCol);
    } else {
      wall.edges = new THREE.LineSegments(
        eGeo,
        new THREE.LineBasicMaterial({ color: edgeCol }),
      );
      this.ctx.scene.add(wall.edges);
    }

    // Pivot group for arena auto-rotation
    if (wall.rotateOnArena && wall.parentType === 'arena') {
      if (!wall._rotatePivot) {
        wall._rotatePivot = new THREE.Group();
        wall._rotatePivot.position.set(cx, 0, cz);
        this.ctx.scene.add(wall._rotatePivot);
        wall._arenaRotateTimer = wall.arenaRotateStepInterval;
      }
      // Re-parent mesh + edges into pivot; zero their X/Z so they sit at pivot origin
      this.ctx.scene.remove(wall.mesh);
      this.ctx.scene.remove(wall.edges);
      wall._rotatePivot.add(wall.mesh);
      wall._rotatePivot.add(wall.edges);
      wall.mesh.position.x  = 0;
      wall.mesh.position.z  = 0;
      wall.edges.position.x = 0;
      wall.edges.position.z = 0;
    }

    this.ctx.trackObjects(wall.id, [wall.mesh, wall.edges]);
    this.setVisible(wall.id, wall.visible ?? true);

    // Rebuild adjacent walls sharing this wall's arc boundary so their join-caps update
    if (!_rebuildingSiblings && wall.autoJoin && wall.parentType === 'arena') {
      const sibs = new Set<string>([wall.id]);
      for (const w of this.items.values()) {
        if (w.id === wall.id || w.parentId !== wall.parentId || w.parentType !== 'arena') continue;
        const a0 = (wall.arcStart % 360 + 360) % 360;
        const a1 = (wall.arcEnd   % 360 + 360) % 360;
        const b0 = (w.arcStart    % 360 + 360) % 360;
        const b1 = (w.arcEnd      % 360 + 360) % 360;
        if (Math.abs(b1 - a0) < 1 || Math.abs(b0 - a1) < 1) {
          this.apply(w, sibs);
        }
      }
    }
  }

  // ── Build + show (used during restore / undo-redo) ───────────────────────

  buildAndShow(
    data:      WallData,
    treeOpts?: Record<string, unknown>,
  ): void {
    this.apply(data);
    const treeParent = data.parentType === 'base' ? 'octagon-base' : data.parentId;
    this.ctx.sceneTree.add(data.id, data.name, '🧱', treeParent, treeOpts as never);
  }

  // ── Return all walls for a given parent (used by BridgeManager) ──────────

  getAllForParent(parentId: string): WallData[] {
    return [...this.items.values()].filter(w => w.parentId === parentId);
  }

  // ── ITickableManager ─────────────────────────────────────────────────────

  tick(dt: number): void {
    const t = performance.now() / 1000;
    for (const wall of this.items.values()) {
      if (!wall.rotateOnArena || !wall._rotatePivot) continue;
      switch (wall.arenaRotateMode) {
        case 'continuous':
          wall._rotatePivot.rotation.y += wall.arenaRotateSpeed * DEG2RAD * dt;
          break;
        case 'step':
          wall._arenaRotateTimer = (wall._arenaRotateTimer ?? wall.arenaRotateStepInterval) - dt;
          if (wall._arenaRotateTimer <= 0) {
            wall._rotatePivot.rotation.y += wall.arenaRotateStepDeg * DEG2RAD;
            wall._arenaRotateTimer = wall.arenaRotateStepInterval;
          }
          break;
        case 'oscillate':
          wall._rotatePivot.rotation.y =
            wall.arenaRotateOscAmp * DEG2RAD *
            Math.sin(TWO_PI * wall.arenaRotateOscFreq * t);
          break;
      }
    }
  }

  // ── Template Method implementation ────────────────────────────────────────

  protected buildGeometry(data: WallData): void {
    // Walls are built/updated via apply(), which handles all parent-type dispatch
    this.apply(data);
  }

  protected disposeOne(data: WallData): void {
    // Remove pivot group first (contains mesh+edges as children)
    if (data._rotatePivot) {
      this.ctx.scene.remove(data._rotatePivot);
      data._rotatePivot.clear();
      data._rotatePivot = undefined;
    }
    if (data.mesh) {
      this.ctx.scene.remove(data.mesh);
      data.mesh.geometry.dispose();
      (data.mesh.material as THREE.Material).dispose();
      data.mesh = null;
    }
    if (data.edges) {
      this.ctx.scene.remove(data.edges);
      data.edges.geometry.dispose();
      (data.edges.material as THREE.Material).dispose();
      data.edges = null;
    }
  }

  // ── Serialisation ─────────────────────────────────────────────────────────

  toSave(data: WallData): WallSave {
    return wallToSave(data);
  }

  fromSave(save: WallSave): WallData {
    const data = defaultWallData(save.id, save.name, save.parentId, save.parentType);
    Object.assign(data, {
      arcStart:              save.arcStart,
      arcEnd:                save.arcEnd,
      fullPerimeter:         save.fullPerimeter,
      hasGaps:               save.hasGaps,
      gapWidth:              save.gapWidth,
      panelWidth:            save.panelWidth,
      height:                save.height,
      tilt:                  save.tilt,
      thickness:             save.thickness,
      thicknessDirection:    save.thicknessDirection ?? 'outward',
      topProfile:            save.topProfile,
      topAmplitude:          save.topAmplitude,
      topFrequency:          save.topFrequency,
      isDouble:              save.isDouble,
      peakHeight:            save.peakHeight,
      peakTilt:              save.peakTilt,
      holes:                 save.holes,
      isDestructible:        save.isDestructible,
      hitPoints:             save.hitPoints,
      autoJoin:              save.autoJoin,
      moatRing:              save.moatRing,
      rotateOnArena:         save.rotateOnArena,
      arenaRotateMode:       save.arenaRotateMode,
      arenaRotateSpeed:      save.arenaRotateSpeed,
      arenaRotateStepDeg:    save.arenaRotateStepDeg,
      arenaRotateStepInterval: save.arenaRotateStepInterval,
      arenaRotateOscAmp:     save.arenaRotateOscAmp,
      arenaRotateOscFreq:    save.arenaRotateOscFreq,
      basePosX:              save.basePosX,
      basePosZ:              save.basePosZ,
      baseRotY:              save.baseRotY,
      baseLength:            save.baseLength,
      color:                 save.color,
      surface:               save.surface,
      customTileData:        save.customTileData,
      tileScale:             save.tileScale,
      material:              save.material,
      emissiveColor:         save.emissiveColor,
      emissiveIntensity:     save.emissiveIntensity,
      opacity:               save.opacity,
      presentStlb64:         save.presentStlb64,
      presentColor:          save.presentColor,
      visible:               save.visible ?? true,
    });
    return data;
  }
}

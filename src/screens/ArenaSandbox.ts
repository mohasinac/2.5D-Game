import * as THREE from 'three';
import { Sandbox, SandboxOptions } from './Sandbox';
import { gameConfirm } from '../utils/dialog';
import {
  APOTHEM, DEG2RAD,
  DEFAULT_BASE_HEIGHT, DEFAULT_BASE_SIDES, DEFAULT_BASE_COLOR, DEFAULT_BASE_TILE,
  ARENA_ELEVATED_THRESHOLD, SL,
  DEFAULT_STEP_COUNT, DEFAULT_STEP_START_DEPTH, DEFAULT_STEP_RISER,
  DEFAULT_RAMP_ANGLE, DEFAULT_RAMP_WIDTH, DEFAULT_STEP_ARC_DIVISIONS,
  DEFAULT_SPIRAL_TURNS, DEFAULT_SPIRAL_COUNT,
  DEFAULT_SPIRAL_LEDGE_W, DEFAULT_SPIRAL_LEDGE_H, DEFAULT_SPIRAL_RADIUS_FRAC,
  DEFAULT_ARENA_MATERIAL,
} from '../config/arenaConstants';
import {
  OpeningShape, WallProfile, SurfaceType, ChildHole, IslandHole,
  ArenaData, PitData, ZoneData, SpeedLineData, SpeedLineSegment, SpeedLineHandleType,
  WallData, BridgeData, BridgeSegmentData, BridgeSegmentType,
} from '../types/arenaTypes';
import { buildSurfaceMaterial } from '../geometry/materialBuilders';
import {
  shapePoints, childWorldPos, makeSurfFn, polarToLocalXZ,
} from '../geometry/surfaceUtils';
import { buildParabolicBowl, buildFreeArenaMesh } from '../geometry/bowlBuilders';
import { buildScoopGeometry, buildScoopEdgeLines, buildScoopSeam } from '../geometry/scoopBuilders';
import { buildTopFaceGeo, buildArenaFloorGeo, buildIslandCapGeo } from '../geometry/platformBuilders';
import {
  buildArenaObjects, applyArena, applyArenaColor, buildArenaRimSeam,
  buildPitObjects, applyPit,
  buildZoneObjects, applyZone,
  defaultArena, defaultPit, defaultZone,
  defaultSegment as defaultSlSegment, defaultSpeedLine, buildSpeedLineObjects, applySpeedLine,
} from '../geometry/arenaObjectBuilders';
import { samplePathForOverlap, buildOverlapSphere } from '../geometry/speedLineBuilders';
import { SceneTree } from '../utils/SceneTree';
import { PropertiesPanel } from '../utils/PropertiesPanel';
import {
  PitSave, ZoneSave, WallSave, BridgeSave, SpeedLineSave, ArenaConfig,
  pitToSave, zoneToSave, arenaToSave, wallToSave, bridgeToSave, speedLineToSave,
} from '../utils/arenaPersistence';
import { buildWallGeometry, buildWallEdgeGeometry, defaultWallData } from '../geometry/wallBuilders';
import {
  SegmentPose, DEFAULT_START_POSE,
  resolveStartPose, computeSegmentEndPose,
  buildSegmentDeckGeometry, buildSegmentEdgeGeometry,
  defaultBridgeSection, defaultSegment,
} from '../geometry/bridgeSegmentBuilders';

/* ══════════════════════════════════════════════════════════════════════════
   ArenaSandbox
   ══════════════════════════════════════════════════════════════════════════ */
export class ArenaSandbox extends Sandbox {
  private baseMesh:    THREE.Mesh | null = null;
  private baseEdges:   THREE.LineSegments | null = null;
  private topFaceMesh: THREE.Mesh | null = null;
  private solidMode = true;
  private modeBtn:  HTMLButtonElement;
  private readonly arenaStorageKey: string;

  private baseConfig = {
    height: DEFAULT_BASE_HEIGHT, sides: DEFAULT_BASE_SIDES, color: DEFAULT_BASE_COLOR,
    surface: 'plain' as SurfaceType, customTileData: null as string | null, tileScale: DEFAULT_BASE_TILE,
  };

  protected sceneTree: SceneTree;
  private sceneObjects = new Map<string, THREE.Object3D[]>();
  private arenas        = new Map<string, ArenaData>();
  private arenaSeq      = 0;
  private pits          = new Map<string, PitData>();
  private pitSeq        = 0;
  private zones         = new Map<string, ZoneData>();
  private zoneSeq       = 0;
  private walls         = new Map<string, WallData>();
  private wallSeq       = 0;
  private bridges       = new Map<string, BridgeData>();
  private bridgeSeq     = 0;
  private segments      = new Map<string, BridgeSegmentData>();
  private segmentSeq    = 0;
  private bridgesByArena = new Map<string, Set<string>>();
  private speedLines    = new Map<string, SpeedLineData>();
  private speedlineSeq  = 0;
  private slSegSeq      = 0;
  private selectedSlId: string | null = null;
  private slDrag: {
    slId: string;
    handleType: SpeedLineHandleType;
    handleIndex: number;
    dragPlane: THREE.Plane;
  } | null = null;
  private slRaycaster = new THREE.Raycaster();
  private _onPointerDown: (e: PointerEvent) => void;
  private _onPointerMove: (e: PointerEvent) => void;
  private _onPointerUp:   (e: PointerEvent) => void;
  private props:        PropertiesPanel;
  private selectedId:   string | null = null;

  /* ── Undo / Redo ── */
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private _undoTimerId = 0;
  private _preChangeState: string | null = null;
  private undoBtn!: HTMLButtonElement;
  private redoBtn!: HTMLButtonElement;

  constructor(container: HTMLElement, opts: SandboxOptions) {
    super(container, opts);
    this.arenaStorageKey = `bey_arena_${opts.title.toLowerCase().replace(/\s+/g,'_')}`;

    this.modeBtn = this.addTopBarButton('● Solid', 'Toggle solid / mesh view');
    this.modeBtn.addEventListener('click', ()=>this.toggleMode());

    const resetArenaBtn = this.addTopBarButton('Reset Arena', 'Reset arena configuration');
    resetArenaBtn.className += ' reset-arena-btn';
    resetArenaBtn.addEventListener('click', ()=>{ void this.resetArena(); });

    this.undoBtn = this.addTopBarButton('↩ Undo', 'Undo (Ctrl+Z)');
    this.undoBtn.addEventListener('click', ()=>this.undo());
    this.redoBtn = this.addTopBarButton('↪ Redo', 'Redo (Ctrl+Y)');
    this.redoBtn.addEventListener('click', ()=>this.redo());

    const leftPanel = this.addOverlayPanel('sandbox-left-panel');
    this.sceneTree  = new SceneTree(leftPanel);

    const collapseBtn = document.createElement('button');
    collapseBtn.className='tree-collapse-btn'; collapseBtn.textContent='◀'; collapseBtn.title='Collapse panel';
    this.sceneTree.header.appendChild(collapseBtn);
    collapseBtn.addEventListener('click', ()=>{
      const collapsed=leftPanel.classList.toggle('sandbox-left-panel--collapsed');
      collapseBtn.textContent=collapsed?'▶':'◀';
      collapseBtn.title=collapsed?'Expand panel':'Collapse panel';
    });

    this.sceneTree.add('octagon-base', 'Octagon Base', '⬡', null, {
      onAddChild: ()=>this.addArena(),
      addChildButtons: [
        {label:'A+',   title:'Add arena',  className:'',        onClick:()=>this.addArena()},
        {label:'B+',   title:'Add bridge', className:'zone-btn',onClick:()=>this.addBridge()},
        {label:'W+',   title:'Add base wall', className:'pit-btn',onClick:()=>this.addWall('octagon-base','base')},
      ],
    });

    const rightPanel = this.addOverlayPanel('sandbox-right-panel');
    this.props = new PropertiesPanel(rightPanel);
    this.props.onClose = ()=>{ this.selectedId=null; this.sceneTree.clearSel(); this.props.showEmpty(); };

    this.sceneTree.onSelect = (ids)=>{
      // Hide handles of previously selected speed line
      if(this.selectedSlId){ const prev=this.speedLines.get(this.selectedSlId); if(prev) this._hideSlHandles(prev); }
      this.selectedSlId = null;
      this.selectedId = ids.length===1 ? ids[0] : null;
      // Show handles of newly selected speed line
      if(this.selectedId && this.speedLines.has(this.selectedId)){
        this.selectedSlId = this.selectedId;
        this._showSlHandles(this.speedLines.get(this.selectedId)!);
      }
      this.renderProps();
    };

    this.sceneTree.onVisibilityToggle = (id, visible)=>{
      (this.sceneObjects.get(id)??[]).forEach(o=>{ o.visible=visible; });
    };

    this.sceneTree.onDelete = (ids)=>{
      this.captureUndo();
      for (const id of ids) {
        const arena=this.arenas.get(id);
        if(arena){
          const allPitIds=[...arena.pitIds]; const allZoneIds=[...arena.zoneIds];
          for(const pid of allPitIds) this.removePitFromScene(pid);
          for(const zid of allZoneIds) this.removeZoneFromScene(zid);
          const objs=this.sceneObjects.get(id);
          if(objs){ this.removeFromScene(...objs); this.sceneObjects.delete(id); }
          this.disposeArena(arena);
          this.arenas.delete(id); this.updateTopFace(); this.updateAllMoatIslandCaps();
          continue;
        }
        if(this.pits.has(id)){
          const pit=this.pits.get(id)!;
          const parentArena=this.arenas.get(pit.parentArenaId);
          this.removePitFromScene(id);
          if(parentArena){ this.updateArenaFloor(parentArena); this.updateArenaBowlHoles(parentArena,pit.parentArenaId); }
          continue;
        }
        if(this.zones.has(id)){
          const zone=this.zones.get(id)!;
          const parentArena=this.arenas.get(zone.parentArenaId);
          this.removeZoneFromScene(id);
          if(parentArena){ this.updateArenaFloor(parentArena); this.updateArenaBowlHoles(parentArena,zone.parentArenaId); }
          continue;
        }
        if(this.speedLines.has(id)){ this.captureUndo(); this._removeSpeedLine(id); continue; }
        if(this.walls.has(id)){ this.removeWall(id); continue; }
        if(this.segments.has(id)){ this.removeSegment(id); continue; }
        if(this.bridges.has(id)){ this.removeBridge(id); continue; }
        const objs=this.sceneObjects.get(id);
        if(objs){ this.removeFromScene(...objs); this.sceneObjects.delete(id); }
      }
      if(ids.some(id=>id===this.selectedId)){ this.selectedId=null; this.props.showEmpty(); }
      this.saveArena();
      this._flushUndoPending();
    };

    /* Keyboard shortcuts: Ctrl+Z = undo, Ctrl+Y / Ctrl+Shift+Z = redo */
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (e.shiftKey) { this.redo(); } else { this.undo(); }
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        this.redo();
      }
    });

    this.updateUndoRedoUI();

    // Bind speed line pointer handlers (wired to canvas in mountRenderer override)
    this._onPointerDown = (e: PointerEvent) => this._slPointerDown(e);
    this._onPointerMove = (e: PointerEvent) => this._slPointerMove(e);
    this._onPointerUp   = (e: PointerEvent) => this._slPointerUp(e);
  }

  /* ── Undo / Redo ──────────────────────────────────────────────────────── */

  private serializeConfig(): string {
    const config: ArenaConfig = {
      baseConfig: { ...this.baseConfig },
      arenaSeq: this.arenaSeq, pitSeq: this.pitSeq, zoneSeq: this.zoneSeq,
      arenas: [...this.arenas.entries()].map(([id,a]) => {
        const s = arenaToSave(id,a,this.pits,this.zones);
        s.walls = [...this.walls.values()]
          .filter(w => w.parentType==='arena' && w.parentId===id)
          .map(wallToSave);
        s.speedLines = [...this.speedLines.values()]
          .filter(sl => sl.parentArenaId===id && sl.parentZoneId===null)
          .map(speedLineToSave);
        return s;
      }),
      baseWalls: [...this.walls.values()].filter(w=>w.parentType==='base').map(wallToSave),
      bridges: [...this.bridges.values()].map(b=>bridgeToSave(b,this.segments,this.walls)),
      wallSeq: this.wallSeq, bridgeSeq: this.bridgeSeq, segmentSeq: this.segmentSeq,
      speedLineSeq: this.speedlineSeq,
      speedLines: [...this.speedLines.values()]
        .filter(sl => sl.parentZoneId !== null)
        .map(speedLineToSave),
    };
    return JSON.stringify(config);
  }

  /** Capture state BEFORE a change. Debounced — only the first call in a gesture pushes to undo. */
  private captureUndo(): void {
    if (!this._preChangeState) {
      this._preChangeState = this.serializeConfig();
    }
    clearTimeout(this._undoTimerId);
    this._undoTimerId = window.setTimeout(() => this._flushUndoPending(), 400);
  }

  private _flushUndoPending(): void {
    clearTimeout(this._undoTimerId);
    if (!this._preChangeState) return;
    const before = this._preChangeState;
    this._preChangeState = null;
    const current = this.serializeConfig();
    if (current === before) return;
    this.undoStack.push(before);
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
    this.updateUndoRedoUI();
  }

  private undo(): void {
    this._flushUndoPending();
    if (!this.undoStack.length) return;
    this.redoStack.push(this.serializeConfig());
    const cfg = JSON.parse(this.undoStack.pop()!) as ArenaConfig;
    this._applyConfigToScene(cfg);
    this.saveArena();
    this.updateUndoRedoUI();
  }

  private redo(): void {
    this._flushUndoPending();
    if (!this.redoStack.length) return;
    this.undoStack.push(this.serializeConfig());
    const cfg = JSON.parse(this.redoStack.pop()!) as ArenaConfig;
    this._applyConfigToScene(cfg);
    this.saveArena();
    this.updateUndoRedoUI();
  }

  private updateUndoRedoUI(): void {
    this.undoBtn.disabled = this.undoStack.length === 0;
    this.redoBtn.disabled = this.redoStack.length === 0;
    this.undoBtn.style.opacity = this.undoStack.length === 0 ? '0.4' : '';
    this.redoBtn.style.opacity = this.redoStack.length === 0 ? '0.4' : '';
  }

  /** Clear all arenas/pits/zones/walls/bridges/speedlines from scene without touching base. */
  private _clearArenas(): void {
    for(const sl of this.speedLines.values()) this._disposeSpeedLine(sl);
    this.speedLines.clear();
    this.speedlineSeq = 0; this.slSegSeq = 0;
    for(const [id,] of this.arenas.entries()) this.sceneTree.remove(id);
    for(const pit of this.pits.values()){
      this.disposePit(pit);
      this.removeFromScene(pit.mesh, pit.edges);
      if(pit.seamMesh) this.removeFromScene(pit.seamMesh);
    }
    for(const zone of this.zones.values()){
      this.disposeZone(zone);
      this.removeFromScene(zone.mesh, zone.edges);
      if(zone.seamMesh) this.removeFromScene(zone.seamMesh);
    }
    for(const arena of this.arenas.values()){
      this.disposeArena(arena); this.removeFromScene(arena.mesh, arena.edges);
    }
    for(const wall of this.walls.values()) this._disposeWall(wall);
    for(const bridge of this.bridges.values()) this._disposeBridge(bridge);
    this.pits.clear(); this.zones.clear(); this.arenas.clear();
    this.walls.clear(); this.bridges.clear(); this.segments.clear();
    this.bridgesByArena.clear();
    this.sceneObjects.clear();
    this.arenaSeq = 0; this.pitSeq = 0; this.zoneSeq = 0;
    this.wallSeq = 0; this.bridgeSeq = 0; this.segmentSeq = 0;
  }

  /** Rebuild the scene from an ArenaConfig (used by undo/redo). */
  private _applyConfigToScene(cfg: ArenaConfig): void {
    this._clearArenas();
    this.baseConfig = { ...this.baseConfig, ...cfg.baseConfig };
    this.rebuildBase();
    this.arenaSeq = cfg.arenaSeq; this.pitSeq = cfg.pitSeq; this.zoneSeq = cfg.zoneSeq;
    this.wallSeq = cfg.wallSeq ?? 0; this.bridgeSeq = cfg.bridgeSeq ?? 0; this.segmentSeq = cfg.segmentSeq ?? 0;
    this.speedlineSeq = cfg.speedLineSeq ?? 0;
    this._loadArenasFromConfig(cfg);
    this.selectedId = null; this.sceneTree.clearSel(); this.props.showEmpty();
  }

  /* ── Dispose helpers ── */
  private disposeArena(arena: ArenaData): void {
    for(const m of arena.spiralMeshes ?? []){
      this.removeFromScene(m);
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
    arena.spiralMeshes = [];
    arena.mesh.geometry.dispose();
    (arena.mesh.material as THREE.Material).dispose();
    arena.edges.geometry.dispose();
    (arena.edges.material as THREE.Material).dispose();
    if(arena.floorMesh){ arena.floorMesh.geometry.dispose();(arena.floorMesh.material as THREE.Material).dispose();this.removeFromScene(arena.floorMesh); }
    if(arena.islandMesh){ arena.islandMesh.geometry.dispose();(arena.islandMesh.material as THREE.Material).dispose();this.removeFromScene(arena.islandMesh); }
    if(arena.rimSeamMesh){ arena.rimSeamMesh.geometry.dispose();(arena.rimSeamMesh.material as THREE.Material).dispose();this.removeFromScene(arena.rimSeamMesh); }
  }
  private disposePit(pit: PitData): void {
    pit.mesh.geometry.dispose();(pit.mesh.material as THREE.Material).dispose();
    pit.edges.geometry.dispose();(pit.edges.material as THREE.Material).dispose();
    if(pit.seamMesh){ pit.seamMesh.geometry.dispose();(pit.seamMesh.material as THREE.Material).dispose(); }
  }
  private disposeZone(zone: ZoneData): void {
    zone.mesh.geometry.dispose();(zone.mesh.material as THREE.Material).dispose();
    zone.edges.geometry.dispose();(zone.edges.material as THREE.Material).dispose();
    if(zone.seamMesh){ zone.seamMesh.geometry.dispose();(zone.seamMesh.material as THREE.Material).dispose(); }
  }

  /* ── Speed line helpers ───────────────────────────────────────────────── */

  private _disposeSpeedLine(sl: SpeedLineData): void {
    if(sl.mesh){ this.removeFromScene(sl.mesh); sl.mesh.geometry.dispose();(sl.mesh.material as THREE.Material).dispose(); }
    if(sl.edges){ this.removeFromScene(sl.edges); sl.edges.geometry.dispose();(sl.edges.material as THREE.Material).dispose(); }
    for(const m of sl.markerMeshes){ this.removeFromScene(m); m.geometry.dispose();(m.material as THREE.Material).dispose(); }
    for(const m of sl.handleMeshes){ this.removeFromScene(m); m.geometry.dispose();(m.material as THREE.Material).dispose(); }
    for(const m of sl.overlapMarkers){ this.removeFromScene(m); m.geometry.dispose();(m.material as THREE.Material).dispose(); }
    sl.markerMeshes=[]; sl.handleMeshes=[]; sl.overlapMarkers=[];
    this.sceneObjects.delete(sl.id);
    this.sceneTree.remove(sl.id);
  }

  private _addSpeedLine(arenaId: string, parentZoneId: string | null = null): void {
    this.captureUndo();
    const id   = `sl-${++this.speedlineSeq}`;
    const name = `Speed Line ${this.speedlineSeq}`;
    const arena = this.arenas.get(arenaId); if(!arena) return;
    const sl = defaultSpeedLine(name, arenaId, id, parentZoneId);
    sl.segments[0].id = `${id}-seg-${++this.slSegSeq}`;
    this.speedLines.set(id, sl);
    arena.speedLineIds.push(id);

    const { mesh, edges, markerMeshes, handleMeshes, totalLength } = buildSpeedLineObjects(sl, arena, this.zones);
    sl.mesh=mesh; sl.edges=edges; sl.markerMeshes=markerMeshes; sl.handleMeshes=handleMeshes; sl.totalLength=totalLength;
    this.addToScene(mesh, edges, ...markerMeshes, ...handleMeshes);
    this.sceneObjects.set(id, [mesh, edges]);

    const treeParentId = parentZoneId ?? arenaId;
    this.sceneTree.add(id, name, '↝', treeParentId);
    this._checkSpeedLineOverlaps(arenaId);
    this.saveArena();
  }

  private _removeSpeedLine(id: string): void {
    const sl = this.speedLines.get(id); if(!sl) return;
    this._disposeSpeedLine(sl);
    const arena = this.arenas.get(sl.parentArenaId);
    if(arena) arena.speedLineIds = arena.speedLineIds.filter(x=>x!==id);
    if(sl.parentZoneId){ const z=this.zones.get(sl.parentZoneId); if(z) z.speedLineIds=z.speedLineIds.filter(x=>x!==id); }
    this.speedLines.delete(id);
    if(this.selectedSlId===id){ this.selectedSlId=null; }
    this._checkSpeedLineOverlaps(sl.parentArenaId);
    this.saveArena();
  }

  private _updateSpeedLine(sl: SpeedLineData): void {
    const arena = this.arenas.get(sl.parentArenaId); if(!arena) return;
    applySpeedLine(sl, arena, this.zones, this.getScene(), (...o)=>this.addToScene(...o), (...o)=>this.removeFromScene(...o));
    this.sceneObjects.set(sl.id, [sl.mesh, sl.edges]);
  }

  private _addSegmentsToLine(slId: string, segs: SpeedLineSegment[]): void {
    const sl = this.speedLines.get(slId); if(!sl) return;
    for(const seg of segs){ seg.id = `${slId}-seg-${++this.slSegSeq}`; }
    sl.segments.push(...segs);
    this._updateSpeedLine(sl);
    this.saveArena();
  }

  private _removeSegmentFromLine(slId: string, k: number): void {
    const sl = this.speedLines.get(slId); if(!sl) return;
    if(sl.segments.length<=1) return;
    sl.segments.splice(k, 1);
    this._updateSpeedLine(sl);
    this.saveArena();
  }

  private _showSlHandles(sl: SpeedLineData): void { sl.handleMeshes.forEach(h=>{ h.visible=true; }); }
  private _hideSlHandles(sl: SpeedLineData): void { sl.handleMeshes.forEach(h=>{ h.visible=false; }); }

  private _checkSpeedLineOverlaps(arenaId: string): void {
    const arena = this.arenas.get(arenaId); if(!arena) return;
    const arenaLines = [...this.speedLines.values()].filter(sl=>sl.parentArenaId===arenaId);

    // Clear old overlap markers
    for(const sl of arenaLines){
      for(const m of sl.overlapMarkers){ this.removeFromScene(m); m.geometry.dispose();(m.material as THREE.Material).dispose(); }
      sl.overlapMarkers=[];
    }
    if(arenaLines.length < 2) return;

    for(let i=0; i<arenaLines.length; i++){
      for(let j=i+1; j<arenaLines.length; j++){
        const slA=arenaLines[i]; const slB=arenaLines[j];
        const surfFnA = makeSurfFn({ parentZoneId: slA.parentZoneId }, arena, this.zones);
        const surfFnB = makeSurfFn({ parentZoneId: slB.parentZoneId }, arena, this.zones);
        const ptsA = samplePathForOverlap(slA, surfFnA);
        const ptsB = samplePathForOverlap(slB, surfFnB);
        outer: for(const ptA of ptsA){
          for(const ptB of ptsB){
            if(ptA.distanceTo(ptB) < SL.OVERLAP_THRESHOLD){
              const mid = ptA.clone().add(ptB).multiplyScalar(0.5);
              const sphere = buildOverlapSphere(mid);
              slA.overlapMarkers.push(sphere);
              this.addToScene(sphere);
              break outer;
            }
          }
        }
      }
    }
  }

  private _restoreSpeedLineSave(sls: SpeedLineSave[], arenaId: string): void {
    const arena = this.arenas.get(arenaId); if(!arena) return;
    for(const sls_ of sls){
      const sl: SpeedLineData = {
        ...sls_,
        totalLength: 0,
        mesh: null as unknown as THREE.Mesh,
        edges: null as unknown as THREE.LineSegments,
        markerMeshes: [], handleMeshes: [], overlapMarkers: [],
      };
      this.speedLines.set(sl.id, sl);
      arena.speedLineIds.push(sl.id);
      if(sl.parentZoneId){ const z=this.zones.get(sl.parentZoneId); if(z && !z.speedLineIds.includes(sl.id)) z.speedLineIds.push(sl.id); }

      const { mesh, edges, markerMeshes, handleMeshes, totalLength } = buildSpeedLineObjects(sl, arena, this.zones);
      sl.mesh=mesh; sl.edges=edges; sl.markerMeshes=markerMeshes; sl.handleMeshes=handleMeshes; sl.totalLength=totalLength;
      this.addToScene(mesh, edges, ...markerMeshes, ...handleMeshes);
      this.sceneObjects.set(sl.id, [mesh, edges]);

      const treeParentId = sl.parentZoneId ?? arenaId;
      this.sceneTree.add(sl.id, sl.name, '↝', treeParentId);
    }
  }

  /* ── Speed line drag interaction ─────────────────────────────────────── */

  private _slPointerDown(e: PointerEvent): void {
    const sl = this.selectedSlId ? this.speedLines.get(this.selectedSlId) : null;
    if(!sl) return;
    const canvas = this.getRendererCanvas(); if(!canvas) return;
    const cam = this.getCamera(); if(!cam) return;
    const rect = canvas.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    const ny = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    this.slRaycaster.setFromCamera(new THREE.Vector2(nx, ny), cam);
    const hits = this.slRaycaster.intersectObjects(sl.handleMeshes, false);
    if(!hits.length) return;
    const hit = hits[0].object as THREE.Mesh;
    const { handleType, handleIndex } = hit.userData as { handleType: SpeedLineHandleType; handleIndex: number };
    const arena = this.arenas.get(sl.parentArenaId); if(!arena) return;
    const planeY = -(this.baseConfig.height + arena.posY);
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), planeY);
    this.slDrag = { slId: sl.id, handleType, handleIndex, dragPlane };
    const ctrl = this.getControls(); if(ctrl) ctrl.enabled = false;
    canvas.setPointerCapture(e.pointerId);
  }

  private _slPointerMove(e: PointerEvent): void {
    const canvas = this.getRendererCanvas(); if(!canvas) return;
    const cam = this.getCamera(); if(!cam) return;
    const rect = canvas.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    const ny = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    this.slRaycaster.setFromCamera(new THREE.Vector2(nx, ny), cam);

    if(!this.slDrag) {
      // Hover highlight
      const sl = this.selectedSlId ? this.speedLines.get(this.selectedSlId) : null;
      if(sl) {
        const hits = this.slRaycaster.intersectObjects(sl.handleMeshes, false);
        for(const h of sl.handleMeshes) (h.material as THREE.MeshBasicMaterial).color.setHex(SL.HANDLE_COLOR);
        if(hits.length) ((hits[0].object as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setHex(SL.HANDLE_HOVER_COLOR);
      }
      return;
    }

    const { slId, handleType, handleIndex, dragPlane } = this.slDrag;
    const sl = this.speedLines.get(slId); if(!sl) return;
    const arena = this.arenas.get(sl.parentArenaId); if(!arena) return;

    const worldPt = new THREE.Vector3();
    if(!this.slRaycaster.ray.intersectPlane(dragPlane, worldPt)) return;
    const { alx, alz } = worldToArenaLocal(worldPt.x, worldPt.z, arena);

    if(handleType === 'start') {
      sl.startR     = Math.hypot(alx, alz);
      sl.startAngle = Math.atan2(alz, alx) * (180 / Math.PI);
    } else {
      const k = handleIndex - 1; // joint_k means seg[k-1] end / seg[k] start
      if(k >= 0 && k < sl.segments.length) {
        // Simple: update rotY of segment k to aim toward drag point
        sl.segments[k].rotY = (Math.atan2(alx, alz) * (180 / Math.PI)) % 180;
      }
    }
    this._updateSpeedLine(sl);
    if(this.selectedId === slId) this.renderProps();
  }

  private _slPointerUp(e: PointerEvent): void {
    if(!this.slDrag) return;
    const canvas = this.getRendererCanvas(); if(canvas) canvas.releasePointerCapture(e.pointerId);
    const ctrl = this.getControls(); if(ctrl) ctrl.enabled = true;
    this.slDrag = null;
    this.captureUndo();
    this.saveArena();
    this._flushUndoPending();
  }

  private _disposeWall(wall: WallData): void {
    if(wall.mesh){ wall.mesh.geometry.dispose();(wall.mesh.material as THREE.Material).dispose(); this.removeFromScene(wall.mesh); wall.mesh=null; }
    if(wall.edges){ wall.edges.geometry.dispose();(wall.edges.material as THREE.Material).dispose(); this.removeFromScene(wall.edges); wall.edges=null; }
    this.sceneObjects.delete(wall.id);
    this.sceneTree.remove(wall.id);
  }

  private _disposeBridge(bridge: BridgeData): void {
    for(const sid of bridge.segmentIds){
      const seg=this.segments.get(sid);
      if(seg){
        if(seg.mesh){ seg.mesh.geometry.dispose();(seg.mesh.material as THREE.Material).dispose(); this.removeFromScene(seg.mesh); seg.mesh=null; }
        if(seg.edges){ seg.edges.geometry.dispose();(seg.edges.material as THREE.Material).dispose(); this.removeFromScene(seg.edges); seg.edges=null; }
        this.sceneObjects.delete(sid);
        this.sceneTree.remove(sid);
        this.segments.delete(sid);
      }
    }
    for(const wid of bridge.wallIds){
      const w=this.walls.get(wid);
      if(w){ this._disposeWall(w); this.walls.delete(wid); }
    }
    if(bridge.group) this.removeFromScene(bridge.group);
    this.sceneObjects.delete(bridge.id);
    this.sceneTree.remove(bridge.id);
  }

  /* ── Wall helpers ─────────────────────────────────────────────────────── */

  private _getArenaRimPts(arenaId: string): THREE.Vector2[] {
    const arena = this.arenas.get(arenaId);
    if(!arena) return [];
    return shapePoints(arena);
  }

  private _arenaRimY(arenaId: string): number {
    const arena = this.arenas.get(arenaId);
    if(!arena) return this.baseConfig.height;
    return this.baseConfig.height + arena.posY;
  }

  /** Rebuild mesh+edges for a wall and add/replace in scene. */
  private applyWall(wall: WallData): void {
    let rimPts: THREE.Vector2[];
    let rimY: number;
    let cx = 0; let cz = 0;

    if(wall.parentType==='arena'){
      const arena=this.arenas.get(wall.parentId);
      if(!arena) return;
      rimPts = shapePoints(arena);
      rimY   = this.baseConfig.height + arena.posY;
      cx     = arena.posX; cz = arena.posZ;
    } else if(wall.parentType==='base'){
      rimPts = [];  // base walls use basePosX/Z/rotY directly — buildWallGeometry handles it
      rimY   = this.baseConfig.height;
    } else {
      // bridge walls — not wired through applyWall (handled by applyBridgeFromSegment)
      return;
    }

    const scene = this.getScene();
    if(!scene) return;

    const geo  = buildWallGeometry(wall, rimPts, rimY, cx, cz);
    const eGeo = buildWallEdgeGeometry(wall, rimPts, rimY, cx, cz);

    if(wall.mesh){
      wall.mesh.geometry.dispose();
      wall.mesh.geometry = geo;
    } else {
      const mat = buildSurfaceMaterial({ color:wall.color, surface:wall.surface, customTileData:null, tileScale:20 });
      wall.mesh = new THREE.Mesh(geo, mat);
      scene.add(wall.mesh);
    }
    if(wall.edges){
      wall.edges.geometry.dispose();
      wall.edges.geometry = eGeo;
    } else {
      const edgeCol = new THREE.Color(wall.color).lerp(new THREE.Color(0xffffff), 0.5);
      wall.edges = new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
      scene.add(wall.edges);
    }
    this.sceneObjects.set(wall.id, [wall.mesh, wall.edges]);
  }

  private addWall(parentId: string, parentType: WallData['parentType']): void {
    this.captureUndo();
    const id   = `wall-${++this.wallSeq}`;
    const name = `Wall ${this.wallSeq}`;
    const wall = defaultWallData(id, name, parentId, parentType);
    this.walls.set(id, wall);
    this.applyWall(wall);

    const parentTreeId = parentType==='base' ? 'octagon-base' : parentId;
    this.sceneTree.add(id, name, '🧱', parentTreeId);
    this.saveArena();
  }

  private removeWall(id: string): void {
    const wall = this.walls.get(id); if(!wall) return;
    this._disposeWall(wall);
    this.walls.delete(id);
    if(wall.parentType==='arena'){
      const arena=this.arenas.get(wall.parentId);
      if(arena) arena.wallIds=arena.wallIds.filter(x=>x!==id);
    }
    if(wall.parentType==='bridge'){
      const bridge=[...this.bridges.values()].find(b=>b.wallIds.includes(id));
      if(bridge) bridge.wallIds=bridge.wallIds.filter(x=>x!==id);
    }
    this.saveArena();
  }

  /** Rebuild all walls attached to an arena, then rebuild dependent bridges. */
  private rebuildDependentsOf(arenaId: string): void {
    for(const wall of this.walls.values()){
      if(wall.parentType==='arena' && wall.parentId===arenaId) this.applyWall(wall);
    }
    const depBridges=this.bridgesByArena.get(arenaId);
    if(depBridges){
      for(const bid of depBridges){
        const bridge=this.bridges.get(bid);
        if(bridge && bridge.segmentIds.length>0) this.applyBridgeFromSegment(bridge.segmentIds[0]);
      }
    }
  }

  /* ── Bridge helpers ───────────────────────────────────────────────────── */

  private _segmentStartPose(seg: BridgeSegmentData): SegmentPose {
    const bridge = this.bridges.get(seg.bridgeId);
    if(!bridge) return { ...DEFAULT_START_POSE, pos: DEFAULT_START_POSE.pos.clone(), dir: DEFAULT_START_POSE.dir.clone(), up: DEFAULT_START_POSE.up.clone() };
    let pose: SegmentPose = bridge.startRef
      ? resolveStartPose(bridge.startRef, this.arenas, this.walls, this.baseConfig.height)
      : { pos: DEFAULT_START_POSE.pos.clone(), dir: DEFAULT_START_POSE.dir.clone(), up: DEFAULT_START_POSE.up.clone() };
    for(const sid of bridge.segmentIds){
      if(sid===seg.id) break;
      const prev=this.segments.get(sid);
      if(prev) pose=computeSegmentEndPose(prev, pose);
    }
    return pose;
  }

  private applySegment(seg: BridgeSegmentData): void {
    const bridge=this.bridges.get(seg.bridgeId); if(!bridge) return;
    const scene=this.getScene(); if(!scene) return;
    const startPose=this._segmentStartPose(seg);

    const color  = seg.color   ?? bridge.color;
    const surface: SurfaceType = (seg.surface ?? bridge.surface) as SurfaceType;

    const geo  = buildSegmentDeckGeometry(seg, startPose, bridge.section);
    const eGeo = buildSegmentEdgeGeometry(seg, startPose, bridge.section);

    if(seg.mesh){
      seg.mesh.geometry.dispose();
      (seg.mesh.material as THREE.Material).dispose();
      seg.mesh.geometry = geo;
      (seg.mesh.material as THREE.Material) = buildSurfaceMaterial({ color, surface, customTileData:null, tileScale:20 });
    } else {
      seg.mesh = new THREE.Mesh(geo, buildSurfaceMaterial({ color, surface, customTileData:null, tileScale:20 }));
      bridge.group.add(seg.mesh);
      scene.add(bridge.group);
    }
    if(seg.edges){
      seg.edges.geometry.dispose();
      seg.edges.geometry = eGeo;
    } else {
      const edgeCol = new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.5);
      seg.edges = new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
      bridge.group.add(seg.edges);
    }
    this.sceneObjects.set(seg.id, [seg.mesh, seg.edges]);
  }

  /** Reapply segId and every subsequent segment in the same bridge. */
  private applyBridgeFromSegment(segId: string): void {
    const seg=this.segments.get(segId); if(!seg) return;
    const bridge=this.bridges.get(seg.bridgeId); if(!bridge) return;
    const startIdx=bridge.segmentIds.indexOf(segId);
    if(startIdx<0) return;
    for(let i=startIdx; i<bridge.segmentIds.length; i++){
      const s=this.segments.get(bridge.segmentIds[i]);
      if(s) this.applySegment(s);
    }
  }

  private addBridge(): void {
    this.captureUndo();
    const bid  = `bridge-${++this.bridgeSeq}`;
    const name = `Bridge ${this.bridgeSeq}`;
    const group = new THREE.Group();
    const bridge: BridgeData = {
      id: bid, name,
      startRef: null,
      segmentIds: [],
      section: defaultBridgeSection(),
      color: 0xaaaacc,
      surface: 'metal' as SurfaceType,
      wallIds: [],
      group,
    };
    this.bridges.set(bid, bridge);
    const scene=this.getScene(); if(scene) scene.add(group);
    this.sceneTree.add(bid, name, '🌉', 'octagon-base', {
      addChildButtons:[
        {label:'Seg+',title:'Add segment',className:'zone-btn',onClick:()=>this.addSegment(bid,'straight')},
        {label:'W+',  title:'Add wall',  className:'pit-btn', onClick:()=>this.addWall(bid,'bridge')},
      ],
    });
    // Add a default straight segment
    this.addSegment(bid, 'straight');
    this.saveArena();
  }

  private removeBridge(id: string): void {
    const bridge=this.bridges.get(id); if(!bridge) return;
    this._disposeBridge(bridge);
    this.bridges.delete(id);
    // Remove from dependency index
    if(bridge.startRef?.type==='arena'){
      const set=this.bridgesByArena.get(bridge.startRef.id);
      if(set){ set.delete(id); if(!set.size) this.bridgesByArena.delete(bridge.startRef.id); }
    }
    this.saveArena();
  }

  private addSegment(bridgeId: string, type: BridgeSegmentType): void {
    const bridge=this.bridges.get(bridgeId); if(!bridge) return;
    this.captureUndo();
    const sid  = `seg-${++this.segmentSeq}`;
    const name = `Seg ${this.segmentSeq}`;
    const seg  = defaultSegment(sid, name, bridgeId, bridge.segmentIds.length, type);
    this.segments.set(sid, seg);
    bridge.segmentIds.push(sid);
    this.applySegment(seg);

    const icon = segmentIcon(type);
    this.sceneTree.add(sid, name, icon, bridgeId);
    this.saveArena();
  }

  private removeSegment(id: string): void {
    const seg=this.segments.get(id); if(!seg) return;
    const bridge=this.bridges.get(seg.bridgeId); if(!bridge) return;
    const idx=bridge.segmentIds.indexOf(id);
    if(idx<0) return;
    this.captureUndo();
    if(seg.mesh){ seg.mesh.geometry.dispose();(seg.mesh.material as THREE.Material).dispose();this.removeFromScene(seg.mesh);seg.mesh=null; }
    if(seg.edges){ seg.edges.geometry.dispose();(seg.edges.material as THREE.Material).dispose();this.removeFromScene(seg.edges);seg.edges=null; }
    this.sceneObjects.delete(id);
    this.sceneTree.remove(id);
    bridge.segmentIds.splice(idx,1);
    this.segments.delete(id);
    // Update orderIndex for subsequent segments and rebuild
    for(let i=idx; i<bridge.segmentIds.length; i++){
      const s=this.segments.get(bridge.segmentIds[i]);
      if(s){ s.orderIndex=i; this.applySegment(s); }
    }
    this.saveArena();
  }

  protected override buildCustom(scene: THREE.Scene): void {
    const H = this.baseConfig.height;
    const sides = this.baseConfig.sides;
    const R = APOTHEM / Math.cos(Math.PI / sides);
    const align = Math.PI / sides;

    const baseMat = buildSurfaceMaterial({ color:this.baseConfig.color, surface:this.baseConfig.surface, customTileData:this.baseConfig.customTileData, tileScale:this.baseConfig.tileScale });
    this.baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(R,R,H,sides,1,true), baseMat);
    this.baseMesh.rotation.y=align; this.baseMesh.position.y=-H/2;
    scene.add(this.baseMesh);

    const fullGeo=new THREE.CylinderGeometry(R,R,H,sides,1,false);
    this.baseEdges=new THREE.LineSegments(new THREE.EdgesGeometry(fullGeo), new THREE.LineBasicMaterial({color:0xb8a888}));
    this.baseEdges.rotation.y=align; this.baseEdges.position.y=-H/2;
    scene.add(this.baseEdges); fullGeo.dispose();

    const topFaceMat=buildSurfaceMaterial({ color:this.baseConfig.color, surface:this.baseConfig.surface, customTileData:this.baseConfig.customTileData, tileScale:this.baseConfig.tileScale });
    this.topFaceMesh=new THREE.Mesh(buildTopFaceGeo(sides,R,align,0,[]),topFaceMat);
    scene.add(this.topFaceMesh);

    this.sceneObjects.set('octagon-base',[this.baseMesh,this.baseEdges,this.topFaceMesh]);
    this.loadArena();
  }

  private rebuildBase(): void {
    if(!this.baseMesh||!this.baseEdges||!this.topFaceMesh) return;
    const H=this.baseConfig.height;
    const sides=this.baseConfig.sides;
    const R=APOTHEM/Math.cos(Math.PI/sides);
    const align=Math.PI/sides;
    this.baseMesh.geometry.dispose();
    this.baseMesh.geometry=new THREE.CylinderGeometry(R,R,H,sides,1,true);
    this.baseMesh.rotation.y=align; this.baseMesh.position.y=-H/2;
    const newBaseMat=buildSurfaceMaterial({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});
    (this.baseMesh.material as THREE.Material).dispose(); this.baseMesh.material=newBaseMat;
    const fullGeo=new THREE.CylinderGeometry(R,R,H,sides,1,false);
    this.baseEdges.geometry.dispose(); this.baseEdges.geometry=new THREE.EdgesGeometry(fullGeo);
    this.baseEdges.rotation.y=align; this.baseEdges.position.y=-H/2; fullGeo.dispose();
    const newTopMat=buildSurfaceMaterial({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});
    (this.topFaceMesh.material as THREE.Material).dispose(); this.topFaceMesh.material=newTopMat;
    for(const arena of this.arenas.values()){ if(arena.depth>H) arena.depth=H; applyArena(arena,this.getArenaHoles(arena),this.getScene()??undefined); this.updateArenaChildren(arena); this.updateArenaRimSeam(arena); }
  }

  private updateTopFace(): void {
    if(!this.topFaceMesh) return;
    const sides=this.baseConfig.sides;
    const R=APOTHEM/Math.cos(Math.PI/sides);
    const align=Math.PI/sides;
    const newGeo=buildTopFaceGeo(sides,R,align,0,[...this.arenas.values()]);
    this.topFaceMesh.geometry.dispose();
    this.topFaceMesh.geometry=newGeo;
  }

  private getArenaHoles(arena: ArenaData): ChildHole[] {
    if (arena.isMoat || arena.wallProfile === 'straight' || arena.wallProfile === 'spiral') return [];
    const holes: ChildHole[] = [];
    for (const pid of arena.pitIds) {
      const p = this.pits.get(pid); if (!p) continue;
      const { lx: cx, lz: cz } = polarToLocalXZ(p.posR, p.posAngle);
      holes.push({ cx, cz, rx:p.radiusX, rz:p.radiusZ, rotY:p.rotY*DEG2RAD, pts:shapePoints(p) });
    }
    for (const zid of arena.zoneIds) {
      const z = this.zones.get(zid); if (!z) continue;
      const { lx: cx, lz: cz } = polarToLocalXZ(z.posR, z.posAngle);
      holes.push({ cx, cz, rx:z.radiusX, rz:z.radiusZ, rotY:z.rotY*DEG2RAD, pts:shapePoints(z) });
    }
    return holes;
  }

  private updateArenaBowlHoles(arena: ArenaData, _arenaId: string): void {
    if (arena.isMoat) return;
    const elevated = arena.posY > ARENA_ELEVATED_THRESHOLD;
    if (!elevated && arena.wallProfile !== 'parabolic') return;
    const holes = this.getArenaHoles(arena);
    const pts = shapePoints(arena);
    arena.mesh.geometry.dispose();
    if (elevated) {
      arena.mesh.geometry = buildFreeArenaMesh(pts, arena.depth, arena.wallProfile, 0, holes);
    } else {
      arena.mesh.geometry = buildParabolicBowl(pts, arena.depth, 0, holes);
    }
  }

  private updateArenaFloor(arena: ArenaData): void {
    if(arena.posY>ARENA_ELEVATED_THRESHOLD||arena.wallProfile!=='straight'||arena.isMoat){
      if(arena.floorMesh){this.removeFromScene(arena.floorMesh);arena.floorMesh.geometry.dispose();(arena.floorMesh.material as THREE.Material).dispose();arena.floorMesh=null;}
      return;
    }
    const pitsForArena=arena.pitIds.map(id=>this.pits.get(id)!).filter(Boolean);
    const zonesForArena=arena.zoneIds.map(id=>this.zones.get(id)!).filter(Boolean);
    const newGeo=buildArenaFloorGeo(arena,pitsForArena,zonesForArena);
    if(arena.floorMesh){ arena.floorMesh.geometry.dispose(); arena.floorMesh.geometry=newGeo; }
    else {
      const mat=buildSurfaceMaterial({color:arena.color,surface:arena.surface,customTileData:arena.customTileData,tileScale:arena.tileScale});
      arena.floorMesh=new THREE.Mesh(newGeo,mat);
      arena.floorMesh.position.set(arena.posX,arena.posY,arena.posZ);
      arena.floorMesh.rotation.y=arena.rotY;
      this.addToScene(arena.floorMesh);
      const objs=this.sceneObjects.get(this._arenaIdFor(arena));
      if(objs) objs.push(arena.floorMesh);
    }
  }

  private getArenasOnIsland(moatArena: ArenaData): IslandHole[] {
    const holes: IslandHole[] = [];
    const cosR = Math.cos(-moatArena.rotY);
    const sinR = Math.sin(-moatArena.rotY);
    for (const arena of this.arenas.values()) {
      if (arena === moatArena) continue;
      if (Math.abs(arena.posY - moatArena.innerRimOffset) > 1.0) continue;
      const dx = arena.posX - moatArena.posX;
      const dz = arena.posZ - moatArena.posZ;
      const lx = dx * cosR - dz * sinR;
      const lz = dx * sinR + dz * cosR;
      if ((lx / moatArena.innerRadiusX) ** 2 + (lz / moatArena.innerRadiusZ) ** 2 <= 1.0) {
        holes.push({ cx: lx, cz: lz, rx: arena.radiusX, rz: arena.radiusZ });
      }
    }
    return holes;
  }

  private updateIslandCap(arena: ArenaData, id: string): void {
    if(!arena.isMoat){
      if(arena.islandMesh){this.removeFromScene(arena.islandMesh);arena.islandMesh.geometry.dispose();(arena.islandMesh.material as THREE.Material).dispose();arena.islandMesh=null;}
      return;
    }
    const newGeo=buildIslandCapGeo(arena, this.getArenasOnIsland(arena));
    if(arena.islandMesh){
      arena.islandMesh.geometry.dispose(); arena.islandMesh.geometry=newGeo;
      arena.islandMesh.position.set(arena.posX,arena.posY,arena.posZ);
      arena.islandMesh.rotation.y=arena.rotY;
    } else {
      const mat=buildSurfaceMaterial({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});
      arena.islandMesh=new THREE.Mesh(newGeo,mat);
      arena.islandMesh.position.set(arena.posX,arena.posY,arena.posZ);
      arena.islandMesh.rotation.y=arena.rotY;
      this.addToScene(arena.islandMesh);
      const objs=this.sceneObjects.get(id);
      if(objs) objs.push(arena.islandMesh);
    }
  }

  private updateAllMoatIslandCaps(): void {
    for (const [id, arena] of this.arenas.entries()) {
      if (arena.isMoat) this.updateIslandCap(arena, id);
    }
  }

  private updateArenaRimSeam(arena: ArenaData): void {
    const pts = shapePoints(arena);
    const flatSurf = (_: number, __: number) => 0;
    const newGeo = buildScoopSeam(pts, 0, 0, 0, flatSurf);
    if (arena.rimSeamMesh) {
      arena.rimSeamMesh.geometry.dispose();
      arena.rimSeamMesh.geometry = newGeo;
      arena.rimSeamMesh.position.set(arena.posX, arena.posY, arena.posZ);
      arena.rimSeamMesh.rotation.y = arena.rotY;
    } else {
      const mat = buildSurfaceMaterial({ color:this.baseConfig.color, surface:this.baseConfig.surface, customTileData:this.baseConfig.customTileData, tileScale:this.baseConfig.tileScale });
      arena.rimSeamMesh = new THREE.Mesh(newGeo, mat);
      arena.rimSeamMesh.position.set(arena.posX, arena.posY, arena.posZ);
      arena.rimSeamMesh.rotation.y = arena.rotY;
      this.addToScene(arena.rimSeamMesh);
    }
  }

  private _arenaIdFor(arena: ArenaData): string {
    for(const[id,a] of this.arenas.entries()) if(a===arena) return id;
    return '';
  }

  /** Re-conform all pits, zones, and speed lines to the current arena surface after any arena geometry change. */
  private updateArenaChildren(arena: ArenaData): void {
    for (const pid of arena.pitIds) {
      const pit = this.pits.get(pid); if (!pit) continue;
      applyPit(pit, arena, this.pits, this.zones);
    }
    for (const zid of arena.zoneIds) {
      const zone = this.zones.get(zid); if (!zone) continue;
      applyZone(zone, arena, this.getScene(), this.pits, this.zones);
      this._updateZoneChildren(zone, arena);
    }
    for (const slId of arena.speedLineIds) {
      const sl = this.speedLines.get(slId); if (!sl) continue;
      this._updateSpeedLine(sl);
    }
  }
  private _updateZoneChildren(parentZone: ZoneData, arena: ArenaData): void {
    for (const pid of parentZone.pitIds) {
      const pit = this.pits.get(pid); if (!pit) continue;
      applyPit(pit, arena, this.pits, this.zones);
    }
    for (const zid of parentZone.zoneIds) {
      const zone = this.zones.get(zid); if (!zone) continue;
      applyZone(zone, arena, this.getScene(), this.pits, this.zones);
      this._updateZoneChildren(zone, arena);
    }
    for (const slId of parentZone.speedLineIds ?? []) {
      const sl = this.speedLines.get(slId); if (!sl) continue;
      this._updateSpeedLine(sl);
    }
  }

  /* ── Properties panel ── */
  private renderProps(): void {
    const id=this.selectedId;
    if(!id){ this.props.showEmpty(); return; }

    if(id==='octagon-base'){
      this.props.showBase(
        this.baseConfig,
        ()=>{ this.captureUndo(); this.rebuildBase(); this.updateTopFace(); this.saveArena(); },
        (hex)=>{
          this.captureUndo();
          this.baseConfig.color=hex;
          const newMat=buildSurfaceMaterial({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});
          (this.baseMesh!.material as THREE.Material).dispose(); this.baseMesh!.material=newMat;
          (this.topFaceMesh!.material as THREE.Material).dispose();
          this.topFaceMesh!.material=buildSurfaceMaterial({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});
          this.saveArena();
        },
        ()=>{ this.captureUndo(); this.rebuildBase(); this.updateTopFace(); this.saveArena(); },
      );
      return;
    }

    const arena=this.arenas.get(id);
    if(arena){
      this.props.showArena(
        arena,
        this.baseConfig.height,
        ()=>{ this.captureUndo(); applyArena(arena,this.getArenaHoles(arena),this.getScene()??undefined); this.updateArenaChildren(arena); this.updateArenaFloor(arena); this.updateIslandCap(arena,id); this.updateArenaRimSeam(arena); this.updateAllMoatIslandCaps(); this.updateTopFace(); this.rebuildDependentsOf(id); this.saveArena(); },
        ()=>{ this.captureUndo(); applyArena(arena,this.getArenaHoles(arena),this.getScene()??undefined); this.updateArenaChildren(arena); this.updateArenaFloor(arena); this.updateIslandCap(arena,id); this.updateArenaRimSeam(arena); this.updateAllMoatIslandCaps(); this.updateTopFace(); this.rebuildDependentsOf(id); this.renderProps(); this.saveArena(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        ()=>{ this.captureUndo(); applyArenaColor(arena); this.saveArena(); },
        ()=>{ this.captureUndo(); applyArenaColor(arena); this.saveArena(); },
      );
      return;
    }

    const pit=this.pits.get(id);
    if(pit){
      const parentArena=this.arenas.get(pit.parentArenaId)!;
      this.props.showPit(
        pit, parentArena,
        ()=>{ this.captureUndo(); applyPit(pit,parentArena,this.pits,this.zones); this.updateArenaBowlHoles(parentArena,pit.parentArenaId); this.updateArenaFloor(parentArena); this.checkSiblingConflicts(this.directParentId(pit),this.directParentType(pit)); this.saveArena(); },
        ()=>{ this.captureUndo(); applyPit(pit,parentArena,this.pits,this.zones); this.updateArenaBowlHoles(parentArena,pit.parentArenaId); this.updateArenaFloor(parentArena); this.checkSiblingConflicts(this.directParentId(pit),this.directParentType(pit)); this.renderProps(); this.saveArena(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        ()=>{ this.captureUndo(); const ec=new THREE.Color(pit.color).lerp(new THREE.Color(0xffffff),0.5);(pit.edges.material as THREE.LineBasicMaterial).color.copy(ec); applyPit(pit,parentArena,this.pits,this.zones); this.saveArena(); },
        ()=>{ this.captureUndo(); applyPit(pit,parentArena,this.pits,this.zones); this.saveArena(); },
      );
      return;
    }

    const zone=this.zones.get(id);
    if(zone){
      const parentArena=this.arenas.get(zone.parentArenaId)!;
      this.props.showZone(
        zone, parentArena,
        ()=>{ this.captureUndo(); applyZone(zone,parentArena,this.getScene(),this.pits,this.zones); this.updateArenaBowlHoles(parentArena,zone.parentArenaId); this.updateArenaFloor(parentArena); this.checkSiblingConflicts(this.directParentId(zone),this.directParentType(zone)); this.saveArena(); },
        ()=>{ this.captureUndo(); applyZone(zone,parentArena,this.getScene(),this.pits,this.zones); this.updateArenaBowlHoles(parentArena,zone.parentArenaId); this.updateArenaFloor(parentArena); this.checkSiblingConflicts(this.directParentId(zone),this.directParentType(zone)); this.renderProps(); this.saveArena(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
      );
      return;
    }

    const sl=this.speedLines.get(id);
    if(sl){
      const slArena=this.arenas.get(sl.parentArenaId)!;
      this.props.showSpeedLine(
        sl, slArena,
        ()=>{ this.captureUndo(); this._updateSpeedLine(sl); this._checkSpeedLineOverlaps(sl.parentArenaId); this.saveArena(); },
        (_k)=>{ this.captureUndo(); this._updateSpeedLine(sl); this.saveArena(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        ()=>{ this.captureUndo(); this._updateSpeedLine(sl); this.saveArena(); },
        (segs)=>{ this.captureUndo(); this._addSegmentsToLine(id, segs); this.renderProps(); },
        (k)=>{ this.captureUndo(); this._removeSegmentFromLine(id, k); this.renderProps(); },
      );
      return;
    }

    const wall=this.walls.get(id);
    if(wall){
      this.props.showWall(
        wall,
        ()=>{ this.captureUndo(); this.applyWall(wall); this.saveArena(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
      );
      return;
    }

    const bridge=this.bridges.get(id);
    if(bridge){
      const arenaNames = new Map([...this.arenas.entries()].map(([aid,a])=>[aid,a.name]));
      const wallNames  = new Map([...this.walls.entries()].map(([wid,w])=>[wid,w.name]));
      this.props.showBridge(
        bridge, arenaNames, wallNames,
        ()=>{ this.captureUndo(); if(bridge.segmentIds.length>0) this.applyBridgeFromSegment(bridge.segmentIds[0]); this.saveArena(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        (type)=>{ this.addSegment(id, type as BridgeSegmentType); },
      );
      return;
    }

    const seg=this.segments.get(id);
    if(seg){
      this.props.showBridgeSegment(
        seg,
        ()=>{ this.captureUndo(); this.applyBridgeFromSegment(seg.id); this.saveArena(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
      );
      return;
    }

    this.props.showEmpty();
  }

  private toggleMode(): void {
    this.solidMode=!this.solidMode;
    this.modeBtn.textContent=this.solidMode?'● Solid':'○ Mesh';
    if(this.baseMesh)    this.baseMesh.visible   =this.solidMode;
    if(this.topFaceMesh) this.topFaceMesh.visible=this.solidMode;
    for(const arena of this.arenas.values()){
      arena.mesh.visible=this.solidMode;
      if(arena.floorMesh) arena.floorMesh.visible=this.solidMode;
      if(arena.islandMesh) arena.islandMesh.visible=this.solidMode;
      if(arena.rimSeamMesh) arena.rimSeamMesh.visible=this.solidMode;
      for(const m of arena.spiralMeshes??[]) m.visible=this.solidMode;
    }
    for(const pit of this.pits.values()){
      pit.mesh.visible=this.solidMode;
      if(pit.seamMesh) pit.seamMesh.visible=this.solidMode;
    }
    for(const zone of this.zones.values()){
      zone.mesh.visible=this.solidMode;
      if(zone.seamMesh) zone.seamMesh.visible=this.solidMode;
    }
  }

  /* ── Add arena ── */
  private addArena(): void {
    this.captureUndo();
    const id=`arena-${++this.arenaSeq}`;
    const data=defaultArena(`Arena ${this.arenaSeq}`);
    const[mesh,edges]=buildArenaObjects(data,[],this.getScene()??undefined);
    data.mesh=mesh; data.edges=edges;
    const rim=buildArenaRimSeam(data,this.baseConfig.color,this.baseConfig.surface,this.baseConfig.customTileData,this.baseConfig.tileScale);
    data.rimSeamMesh=rim;
    this.addToScene(mesh,edges,rim,...(data.spiralMeshes??[]));
    this.sceneObjects.set(id,[mesh,edges,rim]);
    this.arenas.set(id,data);
    this.sceneTree.add(id,data.name,'⏺','octagon-base',{
      addChildButtons:[
        {label:'P+',  title:'Add pit',        className:'pit-btn',  onClick:()=>this.addPit(id)},
        {label:'Z+',  title:'Add zone',       className:'zone-btn', onClick:()=>this.addZone(id)},
        {label:'W+',  title:'Add wall',       className:'pit-btn',  onClick:()=>this.addWall(id,'arena')},
        {label:'SL+', title:'Add speed line', className:'sl-btn',   onClick:()=>this._addSpeedLine(id)},
      ],
    });
    this.updateTopFace(); this.updateAllMoatIslandCaps(); this.saveArena();
  }

  /* ── Conflict detection ── */
  private conflicts = new Set<string>();
  private readonly CONFLICT_COLOR = 0xff2200;

  private directParentId(item: PitData | ZoneData): string {
    if ((item as ZoneData).parentZoneId) return (item as ZoneData).parentZoneId!;
    return item.parentArenaId;
  }
  private directParentType(item: PitData | ZoneData): 'arena' | 'zone' {
    if ((item as ZoneData).parentZoneId) return 'zone';
    return 'arena';
  }

  private getSiblings(parentId: string, parentType: 'arena' | 'zone'): { id: string; item: PitData | ZoneData; kind: 'pit' | 'zone' }[] {
    const result: { id: string; item: PitData | ZoneData; kind: 'pit' | 'zone' }[] = [];
    if (parentType === 'arena') {
      const arena = this.arenas.get(parentId); if (!arena) return result;
      for (const pid of arena.pitIds)  { const p = this.pits.get(pid);  if (p) result.push({ id: pid,  item: p, kind: 'pit' }); }
      for (const zid of arena.zoneIds) { const z = this.zones.get(zid); if (z) result.push({ id: zid,  item: z, kind: 'zone' }); }
    } else {
      const parent = this.zones.get(parentId); if (!parent) return result;
      for (const pid of parent.pitIds)  { const p = this.pits.get(pid);  if (p) result.push({ id: pid,  item: p, kind: 'pit' }); }
      for (const zid of parent.zoneIds) { const z = this.zones.get(zid); if (z) result.push({ id: zid,  item: z, kind: 'zone' }); }
    }
    return result;
  }

  private minRadius(item: PitData | ZoneData): number { return Math.min(item.radiusX, item.radiusZ); }
  private itemCenter(item: PitData | ZoneData): { cx: number; cz: number } {
    const { lx: cx, lz: cz } = polarToLocalXZ(item.posR, item.posAngle);
    return { cx, cz };
  }

  private checkSiblingConflicts(parentId: string, parentType: 'arena' | 'zone'): void {
    const siblings = this.getSiblings(parentId, parentType);
    const prevConflicts = new Set<string>(
      [...this.conflicts].filter(id => siblings.some(s => s.id === id)),
    );
    const newConflicts = new Set<string>();

    for (let i = 0; i < siblings.length; i++) {
      for (let j = i + 1; j < siblings.length; j++) {
        const a = siblings[i]; const b = siblings[j];
        const ca = this.itemCenter(a.item); const cb = this.itemCenter(b.item);
        const dist = Math.hypot(ca.cx - cb.cx, ca.cz - cb.cz);
        const ra = this.minRadius(a.item); const rb = this.minRadius(b.item);
        const sumR = ra + rb; const diffR = Math.abs(ra - rb);
        const overlapping = dist < sumR; const contained = dist <= diffR;
        if (!overlapping) continue;
        if (a.kind !== b.kind) {
          if (!contained) { newConflicts.add(a.id); newConflicts.add(b.id); }
        } else {
          if (!contained) { this.mergeSameType(a, b, parentId, parentType); return; }
        }
      }
    }

    for (const id of prevConflicts) {
      if (!newConflicts.has(id)) {
        const pit = this.pits.get(id);
        if (pit) { const ec=new THREE.Color(pit.color).lerp(new THREE.Color(0xffffff),0.5); (pit.edges.material as THREE.LineBasicMaterial).color.set(ec); }
        const zone = this.zones.get(id);
        if (zone) { const ec=new THREE.Color(zone.color).lerp(new THREE.Color(0xffffff),0.5); (zone.edges.material as THREE.LineBasicMaterial).color.set(ec); }
        this.conflicts.delete(id);
      }
    }
    for (const id of newConflicts) {
      if (!this.conflicts.has(id)) {
        const pit = this.pits.get(id);
        if (pit) (pit.edges.material as THREE.LineBasicMaterial).color.set(this.CONFLICT_COLOR);
        const zone = this.zones.get(id);
        if (zone) (zone.edges.material as THREE.LineBasicMaterial).color.set(this.CONFLICT_COLOR);
        this.conflicts.add(id);
      }
    }
  }

  private convexHull(pts: THREE.Vector2[]): THREE.Vector2[] {
    const sorted = [...pts].sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);
    const cross = (O: THREE.Vector2, A: THREE.Vector2, B: THREE.Vector2) =>
      (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
    const lower: THREE.Vector2[] = [];
    for (const p of sorted) { while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop(); lower.push(p); }
    const upper: THREE.Vector2[] = [];
    for (let i = sorted.length - 1; i >= 0; i--) { const p = sorted[i]; while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop(); upper.push(p); }
    lower.pop(); upper.pop();
    return [...lower, ...upper];
  }

  private mergeSameType(
    a: { id: string; item: PitData | ZoneData; kind: 'pit' | 'zone' },
    b: { id: string; item: PitData | ZoneData; kind: 'pit' | 'zone' },
    parentId: string, parentType: 'arena' | 'zone',
  ): void {
    const arena = this.arenas.get(
      a.kind === 'pit' ? (a.item as PitData).parentArenaId : (a.item as ZoneData).parentArenaId,
    );
    if (!arena) return;

    const toArenaLocal = (item: PitData | ZoneData): THREE.Vector2[] => {
      const { lx: cx, lz: cz } = polarToLocalXZ(item.posR, item.posAngle);
      const cosR = Math.cos(item.rotY * DEG2RAD); const sinR = Math.sin(item.rotY * DEG2RAD);
      return shapePoints(item).map(p => new THREE.Vector2(
        p.x * cosR - p.y * sinR + cx,
        p.x * sinR + p.y * cosR + cz,
      ));
    };

    const allPts = [...toArenaLocal(a.item), ...toArenaLocal(b.item)];
    const hull = this.convexHull(allPts);
    if (hull.length < 3) return;

    const centX = hull.reduce((s, p) => s + p.x, 0) / hull.length;
    const centZ = hull.reduce((s, p) => s + p.y, 0) / hull.length;
    const mergedR = Math.hypot(centX, centZ);
    const mergedAngle = Math.atan2(centZ, centX) / DEG2RAD;
    const mergedDepth = Math.max(a.item.depth, b.item.depth);
    const localHull = hull.map(p => new THREE.Vector2(p.x - centX, p.y - centZ));

    if (a.kind === 'pit') {
      const pa = a.item as PitData;
      const newId = `pit-${++this.pitSeq}`;
      const mergedPit = defaultPit(`Pit ${this.pitSeq}`, pa.parentArenaId, newId);
      mergedPit.posR = mergedR; mergedPit.posAngle = mergedAngle; mergedPit.depth = mergedDepth;
      mergedPit.radiusX = Math.max(...localHull.map(p => Math.abs(p.x))) || 10;
      mergedPit.radiusZ = Math.max(...localHull.map(p => Math.abs(p.y))) || 10;
      const surfFn = makeSurfFn({ parentZoneId: null }, arena, this.zones);
      const geo = buildScoopGeometry(localHull, mergedDepth, 'straight', 0, 0, 0, surfFn);
      const edgeGeo = buildScoopEdgeLines(localHull, mergedDepth, 'straight', 0, 0, 0, surfFn);
      const mat = buildSurfaceMaterial({ color:pa.color, surface:pa.surface, customTileData:pa.customTileData, tileScale:pa.tileScale });
      const edgeCol = new THREE.Color(pa.color).lerp(new THREE.Color(0xffffff), 0.5);
      const mesh = new THREE.Mesh(geo, mat);
      const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
      const { wx, wz, wRotY } = childWorldPos(arena, mergedPit);
      mesh.position.set(wx, 0, wz); mesh.rotation.y = wRotY;
      edges.position.set(wx, 0, wz); edges.rotation.y = wRotY;
      const pitSeam = new THREE.Mesh(
        new THREE.BufferGeometry(),
        buildSurfaceMaterial({ color:pa.color, surface:pa.surface, customTileData:pa.customTileData, tileScale:pa.tileScale }),
      );
      pitSeam.position.set(wx, 0, wz); pitSeam.rotation.y = wRotY;
      mergedPit.mesh = mesh; mergedPit.edges = edges; mergedPit.seamMesh = pitSeam;

      this.removePitFromScene(a.id); this.removePitFromScene(b.id);
      this.pits.set(newId, mergedPit);
      applyPit(mergedPit, arena, this.pits, this.zones);
      this.addToScene(mesh, edges, pitSeam);
      this.sceneObjects.set(newId, [mesh, edges, pitSeam]);
      this.addChildToParent(newId, 'pit', parentId, parentType);
      this.sceneTree.add(newId, mergedPit.name, '▼', parentId);
    } else {
      const za = a.item as ZoneData;
      const newId = `zone-${++this.zoneSeq}`;
      const mergedZone = defaultZone(`Zone ${this.zoneSeq}`, za.parentArenaId, newId, za.parentZoneId);
      mergedZone.posR = mergedR; mergedZone.posAngle = mergedAngle; mergedZone.depth = mergedDepth;
      mergedZone.radiusX = Math.max(...localHull.map(p => Math.abs(p.x))) || 15;
      mergedZone.radiusZ = Math.max(...localHull.map(p => Math.abs(p.y))) || 15;
      mergedZone.fill = za.fill; mergedZone.fillColor = za.fillColor;
      const [mesh, edges, seamMesh] = buildZoneObjects(mergedZone, arena, this.pits, this.zones);
      mergedZone.mesh = mesh; mergedZone.edges = edges; mergedZone.seamMesh = seamMesh;

      this.removeZoneFromScene(a.id); this.removeZoneFromScene(b.id);
      this.zones.set(newId, mergedZone);
      this.addToScene(mesh, edges, seamMesh);
      this.sceneObjects.set(newId, [mesh, edges, seamMesh]);
      this.addChildToParent(newId, 'zone', parentId, parentType);
      this.sceneTree.add(newId, mergedZone.name, '◈', parentId, {
        addChildButtons: [
          {label:'P+',title:'Add nested pit',className:'pit-btn',  onClick:()=>this.addPitToParent(newId,'zone')},
          {label:'Z+',title:'Add nested zone',className:'zone-btn',onClick:()=>this.addZoneToParent(newId,'zone')},
        ],
      });
    }
    this.saveArena();
  }

  private addChildToParent(childId: string, childKind: 'pit' | 'zone', parentId: string, parentType: 'arena' | 'zone'): void {
    const list = childKind === 'pit' ? 'pitIds' : 'zoneIds';
    if (parentType === 'arena') { const p = this.arenas.get(parentId); if (p) p[list].push(childId); }
    else { const p = this.zones.get(parentId); if (p) p[list].push(childId); }
  }

  private removePitFromScene(id: string): void {
    const pit = this.pits.get(id); if (!pit) return;
    this.disposePit(pit);
    this.removeFromScene(pit.mesh, pit.edges);
    if(pit.seamMesh) this.removeFromScene(pit.seamMesh);
    this.sceneObjects.delete(id);
    this.sceneTree.remove(id);
    this.pits.delete(id);
    const pa = this.arenas.get(pit.parentArenaId);
    if (pa) { pa.pitIds = pa.pitIds.filter(x => x !== id); }
  }

  private removeZoneFromScene(id: string): void {
    const zone = this.zones.get(id); if (!zone) return;
    this.disposeZone(zone);
    this.removeFromScene(zone.mesh, zone.edges);
    if(zone.seamMesh) this.removeFromScene(zone.seamMesh);
    this.sceneObjects.delete(id);
    this.sceneTree.remove(id);
    this.zones.delete(id);
    const pa = this.arenas.get(zone.parentArenaId);
    if (pa) { pa.zoneIds = pa.zoneIds.filter(x => x !== id); }
    if (zone.parentZoneId) { const pz = this.zones.get(zone.parentZoneId); if (pz) pz.zoneIds = pz.zoneIds.filter(x => x !== id); }
  }

  private addPit(arenaId: string): void { this.addPitToParent(arenaId, 'arena'); }
  private addZone(arenaId: string): void { this.addZoneToParent(arenaId, 'arena'); }

  private addPitToParent(parentId: string, parentType: 'arena' | 'zone'): void {
    let arenaId: string;
    if (parentType === 'arena') arenaId = parentId;
    else { const p = this.zones.get(parentId); if (!p) return; arenaId = p.parentArenaId; }
    const arena = this.arenas.get(arenaId); if (!arena) return;

    this.captureUndo();
    const id = `pit-${++this.pitSeq}`;
    const pit = defaultPit(`Pit ${this.pitSeq}`, arenaId, id);
    pit.depth = Math.min(pit.depth, arena.depth);
    pit.radiusX = Math.min(pit.radiusX, arena.radiusX * 0.4);
    pit.radiusZ = Math.min(pit.radiusZ, arena.radiusZ * 0.4);

    const [mesh, edges, seamMesh] = buildPitObjects(pit, arena, this.pits, this.zones);
    pit.mesh = mesh; pit.edges = edges; pit.seamMesh = seamMesh;
    this.addToScene(mesh, edges, seamMesh);
    this.sceneObjects.set(id, [mesh, edges, seamMesh]);
    this.pits.set(id, pit);
    this.addChildToParent(id, 'pit', parentId, parentType);

    this.sceneTree.add(id, pit.name, '▼', parentId);
    this.updateArenaBowlHoles(arena, arenaId);
    this.updateArenaFloor(arena);
    this.checkSiblingConflicts(parentId, parentType);
    this.saveArena();
  }

  private addZoneToParent(parentId: string, parentType: 'arena' | 'zone'): void {
    let arenaId: string;
    if (parentType === 'arena') arenaId = parentId;
    else { const p = this.zones.get(parentId); if (!p) return; arenaId = p.parentArenaId; }
    const arena = this.arenas.get(arenaId); if (!arena) return;

    this.captureUndo();
    const id = `zone-${++this.zoneSeq}`;
    const parentZoneId = parentType === 'zone' ? parentId : null;
    const zone = defaultZone(`Zone ${this.zoneSeq}`, arenaId, id, parentZoneId);
    zone.depth = Math.min(zone.depth, Math.min(15, arena.depth));
    zone.radiusX = Math.min(zone.radiusX, arena.radiusX * 0.3);
    zone.radiusZ = Math.min(zone.radiusZ, arena.radiusZ * 0.3);

    const [mesh, edges, seamMesh] = buildZoneObjects(zone, arena, this.pits, this.zones);
    zone.mesh = mesh; zone.edges = edges; zone.seamMesh = seamMesh;
    this.addToScene(mesh, edges, seamMesh);
    this.sceneObjects.set(id, [mesh, edges, seamMesh]);
    this.zones.set(id, zone);
    this.addChildToParent(id, 'zone', parentId, parentType);

    this.sceneTree.add(id, zone.name, '◈', parentId, {
      addChildButtons: [
        {label:'P+',title:'Add nested pit',className:'pit-btn',  onClick:()=>this.addPitToParent(id,'zone')},
        {label:'Z+',title:'Add nested zone',className:'zone-btn',onClick:()=>this.addZoneToParent(id,'zone')},
      ],
    });
    this.updateArenaBowlHoles(arena, arenaId);
    this.updateArenaFloor(arena);
    this.checkSiblingConflicts(parentId, parentType);
    this.saveArena();
  }

  /* ── Persistence ── */
  private saveArena(): void {
    localStorage.setItem(this.arenaStorageKey, this.serializeConfig());
  }

  private restorePitSave(ps: PitSave, arenaId: string, parentId: string, data: ArenaData): void {
    const pit:PitData={
      id:ps.id,name:ps.name,parentArenaId:arenaId,
      openingShape:ps.openingShape,
      radiusX:ps.radiusX,radiusZ:ps.radiusZ,depth:ps.depth,sides:ps.sides,starInner:ps.starInner,
      color:ps.color,surface:ps.surface,customTileData:ps.customTileData,tileScale:ps.tileScale,
      posR:ps.posR,posAngle:ps.posAngle,rotY:ps.rotY,
      mesh:null as unknown as THREE.Mesh,edges:null as unknown as THREE.LineSegments,
      seamMesh:null as unknown as THREE.Mesh,
    };
    this.pits.set(ps.id,pit);
    data.pitIds.push(ps.id);
    const[pm,pe,psm]=buildPitObjects(pit,data,this.pits,this.zones);
    pit.mesh=pm; pit.edges=pe; pit.seamMesh=psm;
    this.addToScene(pm,pe,psm);
    this.sceneObjects.set(ps.id,[pm,pe,psm]);
    this.sceneTree.add(ps.id,pit.name,'▼',parentId);
  }

  private restoreZoneSave(zs: ZoneSave, arenaId: string, parentId: string, data: ArenaData): void {
    const zone:ZoneData={
      id:zs.id,name:zs.name,parentArenaId:arenaId,
      parentZoneId:zs.parentZoneId,
      openingShape:zs.openingShape,
      radiusX:zs.radiusX,radiusZ:zs.radiusZ,depth:zs.depth,sides:zs.sides,starInner:zs.starInner,
      color:zs.color,surface:zs.surface,customTileData:zs.customTileData,tileScale:zs.tileScale,
      fill:zs.fill,fillColor:zs.fillColor,fillOpacity:zs.fillOpacity,
      posR:zs.posR,posAngle:zs.posAngle,rotY:zs.rotY,
      isMoat:zs.isMoat,innerRadiusX:zs.innerRadiusX,innerRadiusZ:zs.innerRadiusZ,
      innerOpeningShape:zs.innerOpeningShape,innerSides:zs.innerSides,innerStarInner:zs.innerStarInner,
      innerWallProfile:zs.innerWallProfile,innerRimOffset:zs.innerRimOffset,
      pitIds:[],zoneIds:[],speedLineIds:[],
      mesh:null as unknown as THREE.Mesh,edges:null as unknown as THREE.LineSegments,
      seamMesh:null as unknown as THREE.Mesh,
    };
    this.zones.set(zs.id,zone);
    data.zoneIds.push(zs.id);
    const[zm,ze,zsm]=buildZoneObjects(zone,data,this.pits,this.zones);
    zone.mesh=zm;zone.edges=ze;zone.seamMesh=zsm;
    this.addToScene(zm,ze,zsm);
    this.sceneObjects.set(zs.id,[zm,ze,zsm]);
    this.sceneTree.add(zs.id,zone.name,'◈',parentId,{
      addChildButtons:[
        {label:'P+',title:'Add nested pit',className:'pit-btn',  onClick:()=>this.addPitToParent(zs.id,'zone')},
        {label:'Z+',title:'Add nested zone',className:'zone-btn',onClick:()=>this.addZoneToParent(zs.id,'zone')},
      ],
    });
    for(const cps of zs.pits)  this.restorePitSave(cps,arenaId,zs.id,data);
    for(const czs of zs.zones) this.restoreZoneSave(czs,arenaId,zs.id,data);
  }

  /** Core load — restore arenas from a config object (shared by loadArena and undo/redo). */
  private _loadArenasFromConfig(cfg: ArenaConfig): void {
    for(const as of cfg.arenas){
      const data:ArenaData={
        name:as.name,openingShape:as.openingShape,wallProfile:as.wallProfile,
        radiusX:as.radiusX,radiusZ:as.radiusZ,depth:as.depth,sides:as.sides,starInner:as.starInner,
        color:as.color,surface:as.surface,customTileData:as.customTileData,tileScale:as.tileScale,
        baseMaterial: as.baseMaterial ?? DEFAULT_ARENA_MATERIAL,
        posX:as.posX,posZ:as.posZ,posY:as.posY,rotY:as.rotY,
        isMoat:as.isMoat,innerRadiusX:as.innerRadiusX,innerRadiusZ:as.innerRadiusZ,
        innerOpeningShape:as.innerOpeningShape,innerSides:as.innerSides,innerStarInner:as.innerStarInner,
        innerWallProfile:as.innerWallProfile,innerRimOffset:as.innerRimOffset,
        stepApplyToAll:   as.stepApplyToAll   ?? true,
        stepEdgeProfiles: as.stepEdgeProfiles ?? [],
        stepArcDivisions: as.stepArcDivisions ?? DEFAULT_STEP_ARC_DIVISIONS,
        stepCount:        as.stepCount        ?? DEFAULT_STEP_COUNT,
        stepStartDepth:   as.stepStartDepth   ?? DEFAULT_STEP_START_DEPTH,
        stepRiserProfile: as.stepRiserProfile ?? DEFAULT_STEP_RISER,
        rampMode:         as.rampMode         ?? 'full',
        rampAngle:        as.rampAngle        ?? DEFAULT_RAMP_ANGLE,
        rampWidth:        as.rampWidth        ?? DEFAULT_RAMP_WIDTH,
        spiralTurns:      as.spiralTurns      ?? DEFAULT_SPIRAL_TURNS,
        spiralClockwise:  as.spiralClockwise  ?? true,
        spiralCount:      as.spiralCount      ?? DEFAULT_SPIRAL_COUNT,
        spiralLedgeWidth: as.spiralLedgeWidth ?? DEFAULT_SPIRAL_LEDGE_W,
        spiralLedgeHeight:as.spiralLedgeHeight?? DEFAULT_SPIRAL_LEDGE_H,
        spiralRadiusFrac: as.spiralRadiusFrac ?? DEFAULT_SPIRAL_RADIUS_FRAC,
        spiralMeshes:     [],
        pitIds:[],zoneIds:[],wallIds:[],speedLineIds:[],
        mesh:null as unknown as THREE.Mesh,edges:null as unknown as THREE.LineSegments,
        floorMesh:null,islandMesh:null,rimSeamMesh:null,
      };
      this.arenas.set(as.id,data);

      // Arena node must exist in the tree before children are added as its descendants
      this.sceneTree.add(as.id,data.name,'⏺','octagon-base',{
        addChildButtons:[
          {label:'P+',  title:'Add pit',        className:'pit-btn',  onClick:()=>this.addPit(as.id)},
          {label:'Z+',  title:'Add zone',       className:'zone-btn', onClick:()=>this.addZone(as.id)},
          {label:'W+',  title:'Add wall',       className:'pit-btn',  onClick:()=>this.addWall(as.id,'arena')},
          {label:'SL+', title:'Add speed line', className:'sl-btn',   onClick:()=>this._addSpeedLine(as.id)},
        ],
      });

      for(const ps of as.pits)  this.restorePitSave(ps, as.id, as.id, data);
      for(const zs of as.zones) this.restoreZoneSave(zs, as.id, as.id, data);

      const holes=this.getArenaHoles(data);
      const[mesh,edges]=buildArenaObjects(data,holes,this.getScene()??undefined);
      data.mesh=mesh; data.edges=edges;
      const rim=buildArenaRimSeam(data,this.baseConfig.color,this.baseConfig.surface,this.baseConfig.customTileData,this.baseConfig.tileScale);
      data.rimSeamMesh=rim;
      this.addToScene(mesh,edges,rim,...(data.spiralMeshes??[]));
      const objs:THREE.Object3D[]=[mesh,edges,rim,...(data.spiralMeshes??[])];

      if(data.isMoat){
        const islandGeo=buildIslandCapGeo(data);
        const islandMat=buildSurfaceMaterial({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});
        data.islandMesh=new THREE.Mesh(islandGeo,islandMat);
        data.islandMesh.position.set(data.posX,data.posY,data.posZ);
        data.islandMesh.rotation.y=data.rotY;
        this.addToScene(data.islandMesh); objs.push(data.islandMesh);
      }

      if(data.wallProfile==='straight'&&!data.isMoat&&data.posY<=ARENA_ELEVATED_THRESHOLD){
        const pitsFA=data.pitIds.map(pid=>this.pits.get(pid)!).filter(Boolean);
        const zonesFA=data.zoneIds.map(zid=>this.zones.get(zid)!).filter(Boolean);
        const floorGeo=buildArenaFloorGeo(data,pitsFA,zonesFA);
        const floorMat=buildSurfaceMaterial({color:data.color,surface:data.surface,customTileData:data.customTileData,tileScale:data.tileScale});
        data.floorMesh=new THREE.Mesh(floorGeo,floorMat);
        data.floorMesh.position.set(data.posX,data.posY,data.posZ);
        data.floorMesh.rotation.y=data.rotY;
        this.addToScene(data.floorMesh); objs.push(data.floorMesh);
      }

      this.sceneObjects.set(as.id,objs);

      // Restore walls attached to this arena
      for(const ws of (as.walls??[])) this._restoreWallSave(ws);
    }
    this.updateTopFace();

    // Restore base walls
    for(const ws of (cfg.baseWalls??[])) this._restoreWallSave(ws);

    // Restore bridges
    for(const bs of (cfg.bridges??[])) this._restoreBridgeSave(bs);

    // Restore arena-level speed lines (stored inside each ArenaSave)
    for(const as of cfg.arenas){
      if(as.speedLines) this._restoreSpeedLineSave(as.speedLines, as.id);
    }

    // Restore zone-parented speed lines (stored at top level)
    if(cfg.speedLines){
      for(const sls of cfg.speedLines){
        const arena = this.arenas.get(sls.parentArenaId); if(!arena) continue;
        this._restoreSpeedLineSave([sls], sls.parentArenaId);
      }
    }

    // Check overlaps for each arena
    for(const arenaId of this.arenas.keys()) this._checkSpeedLineOverlaps(arenaId);
  }

  private _restoreWallSave(ws: WallSave): void {
    const wall: WallData = {
      id:ws.id, name:ws.name, parentId:ws.parentId, parentType:ws.parentType,
      fullPerimeter:ws.fullPerimeter, arcStart:ws.arcStart, arcEnd:ws.arcEnd,
      basePosX:ws.basePosX, basePosZ:ws.basePosZ, baseRotY:ws.baseRotY, baseLength:ws.baseLength,
      height:ws.height, tilt:ws.tilt,
      hasGaps:ws.hasGaps, gapWidth:ws.gapWidth, panelWidth:ws.panelWidth,
      topProfile:ws.topProfile, topAmplitude:ws.topAmplitude, topFrequency:ws.topFrequency,
      isDouble:ws.isDouble, peakHeight:ws.peakHeight, peakTilt:ws.peakTilt,
      holes:ws.holes.map(h=>({...h})),
      color:ws.color, surface:ws.surface, material:ws.material,
      mesh:null, edges:null,
    };
    this.walls.set(ws.id, wall);
    this.applyWall(wall);
    const parentTreeId = ws.parentType==='base' ? 'octagon-base' : ws.parentId;
    this.sceneTree.add(ws.id, wall.name, '🧱', parentTreeId);
    if(ws.parentType==='arena'){
      const arena=this.arenas.get(ws.parentId);
      if(arena && !arena.wallIds.includes(ws.id)) arena.wallIds.push(ws.id);
    }
  }

  private _restoreBridgeSave(bs: BridgeSave): void {
    const group = new THREE.Group();
    const bridge: BridgeData = {
      id:bs.id, name:bs.name,
      startRef: bs.startRef ?? null,
      segmentIds:[],
      section:{ ...bs.section },
      color:bs.color, surface:bs.surface as SurfaceType,
      wallIds:[],
      group,
    };
    this.bridges.set(bs.id, bridge);
    const scene=this.getScene(); if(scene) scene.add(group);
    this.sceneTree.add(bs.id, bridge.name, '🌉', 'octagon-base', {
      addChildButtons:[
        {label:'Seg+',title:'Add segment',className:'zone-btn',onClick:()=>this.addSegment(bs.id,'straight')},
        {label:'W+',  title:'Add wall',  className:'pit-btn', onClick:()=>this.addWall(bs.id,'bridge')},
      ],
    });
    if(bridge.startRef?.type==='arena'){
      if(!this.bridgesByArena.has(bridge.startRef.id)) this.bridgesByArena.set(bridge.startRef.id, new Set());
      this.bridgesByArena.get(bridge.startRef.id)!.add(bs.id);
    }
    for(const ss of bs.segments){
      const seg: BridgeSegmentData = {
        id:ss.id, name:ss.name, bridgeId:bs.id, orderIndex:ss.orderIndex, type:ss.type,
        length:ss.length, rampAngle:ss.rampAngle,
        curveRadius:ss.curveRadius, curveAngle:ss.curveAngle, curveDirection:ss.curveDirection, bankAngle:ss.bankAngle,
        cp1X:ss.cp1X, cp1Y:ss.cp1Y, cp1Z:ss.cp1Z,
        cp2X:ss.cp2X, cp2Y:ss.cp2Y, cp2Z:ss.cp2Z,
        endX:ss.endX, endY:ss.endY, endZ:ss.endZ,
        loopRadius:ss.loopRadius,
        corkscrewLength:ss.corkscrewLength, corkscrewTurns:ss.corkscrewTurns,
        color:ss.color, surface:ss.surface,
        mesh:null, edges:null,
      };
      this.segments.set(ss.id, seg);
      bridge.segmentIds.push(ss.id);
      const icon=segmentIcon(seg.type);
      this.sceneTree.add(ss.id, seg.name, icon, bs.id);
    }
    if(bridge.segmentIds.length>0) this.applyBridgeFromSegment(bridge.segmentIds[0]);
    for(const ws of bs.walls) this._restoreWallSave(ws);
  }

  private loadArena(): void {
    try {
      const raw=localStorage.getItem(this.arenaStorageKey); if(!raw) return;
      const cfg=JSON.parse(raw) as ArenaConfig;
      this.baseConfig={...this.baseConfig,...cfg.baseConfig};
      this.rebuildBase();
      this.arenaSeq=cfg.arenaSeq; this.pitSeq=cfg.pitSeq; this.zoneSeq=cfg.zoneSeq;
      this.wallSeq=cfg.wallSeq??0; this.bridgeSeq=cfg.bridgeSeq??0; this.segmentSeq=cfg.segmentSeq??0;
      this.speedlineSeq=cfg.speedLineSeq??0;
      this._loadArenasFromConfig(cfg);
    } catch { localStorage.removeItem(this.arenaStorageKey); }
  }

  /* ── Renderer visibility override — wire speed line pointer events ──── */
  override setVisible(v: boolean): void {
    super.setVisible(v);
    const canvas = this.getRendererCanvas();
    if(v && canvas){
      canvas.addEventListener('pointerdown', this._onPointerDown);
      canvas.addEventListener('pointermove', this._onPointerMove);
      canvas.addEventListener('pointerup',   this._onPointerUp);
    } else if(!v && canvas){
      canvas.removeEventListener('pointerdown', this._onPointerDown);
      canvas.removeEventListener('pointermove', this._onPointerMove);
      canvas.removeEventListener('pointerup',   this._onPointerUp);
    }
  }

  /* ── Reset ── */
  private async resetArena(): Promise<void> {
    const ok=await gameConfirm('Reset arena?\nAll arenas, pits, zones, walls and bridges will be cleared.','Reset','Cancel');
    if(!ok) return;
    this.captureUndo();
    for(const sl of this.speedLines.values()) this._disposeSpeedLine(sl);
    this.speedLines.clear(); this.speedlineSeq=0; this.slSegSeq=0;
    for(const[id,arena] of this.arenas.entries()){
      for(const pid of arena.pitIds){const p=this.pits.get(pid);if(p){this.disposePit(p);this.removeFromScene(p.mesh,p.edges);if(p.seamMesh)this.removeFromScene(p.seamMesh);}this.pits.delete(pid);this.sceneObjects.delete(pid);}
      for(const zid of arena.zoneIds){const z=this.zones.get(zid);if(z){this.disposeZone(z);this.removeFromScene(z.mesh,z.edges);if(z.seamMesh)this.removeFromScene(z.seamMesh);}this.zones.delete(zid);this.sceneObjects.delete(zid);}
      this.disposeArena(arena); this.removeFromScene(arena.mesh,arena.edges);
      this.sceneObjects.delete(id); this.sceneTree.remove(id);
    }
    for(const wall of this.walls.values()) this._disposeWall(wall);
    for(const bridge of this.bridges.values()) this._disposeBridge(bridge);
    this.arenas.clear(); this.arenaSeq=0;
    this.pits.clear();   this.pitSeq=0;
    this.zones.clear();  this.zoneSeq=0;
    this.walls.clear();    this.wallSeq=0;
    this.bridges.clear();  this.bridgeSeq=0;
    this.segments.clear(); this.segmentSeq=0;
    this.bridgesByArena.clear();
    this.baseConfig={height:DEFAULT_BASE_HEIGHT,sides:DEFAULT_BASE_SIDES,color:DEFAULT_BASE_COLOR,surface:'plain',customTileData:null,tileScale:DEFAULT_BASE_TILE};
    this.rebuildBase(); this.updateTopFace();
    this.selectedId=null; this.sceneTree.clearSel(); this.props.showEmpty();
    localStorage.removeItem(this.arenaStorageKey);
    this._flushUndoPending();
  }
}

function worldToArenaLocal(wx: number, wz: number, arena: ArenaData): { alx: number; alz: number } {
  const dx = wx - arena.posX; const dz = wz - arena.posZ;
  const c = Math.cos(-arena.rotY * DEG2RAD); const s = Math.sin(-arena.rotY * DEG2RAD);
  return { alx: dx * c - dz * s, alz: dx * s + dz * c };
}

function segmentIcon(type: BridgeSegmentType): string {
  switch(type){
    case 'straight':   return '━';
    case 'curve':      return '↩';
    case 'ramp':       return '↗';
    case 'loop':       return '⭕';
    case 'hairpin':    return '↺';
    case 'corkscrew':  return '🌀';
    case 'chicane':    return '⟨⟩';
    case 'bezier':     return '〜';
    default:           return '━';
  }
}

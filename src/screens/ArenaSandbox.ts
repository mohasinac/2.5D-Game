import * as THREE from 'three';
import { Sandbox, SandboxOptions } from './Sandbox';
import { gameConfirm } from '../utils/dialog';
import {
  APOTHEM, DEG2RAD, TWO_PI,
  DEFAULT_BASE_HEIGHT, DEFAULT_BASE_SIDES, DEFAULT_BASE_COLOR, DEFAULT_BASE_TILE,
  ARENA_ELEVATED_THRESHOLD, SL, ROT, TRAP_PLATE_HEIGHT,
  DEFAULT_STEP_COUNT, DEFAULT_STEP_START_DEPTH, DEFAULT_STEP_RISER,
  DEFAULT_RAMP_ANGLE, DEFAULT_RAMP_WIDTH, DEFAULT_STEP_ARC_DIVISIONS,
  DEFAULT_SPIRAL_TURNS, DEFAULT_SPIRAL_COUNT,
  DEFAULT_SPIRAL_LEDGE_W, DEFAULT_SPIRAL_LEDGE_H, DEFAULT_SPIRAL_RADIUS_FRAC,
  DEFAULT_ARENA_MATERIAL, MIN_ZONE_DEPTH, PIT_FIXED_DEPTH, ARENA_SAVE_VERSION,
  ENV,
} from '../config/arenaConstants';
import { buildParticleSystem } from '../geometry/particleBuilders';
import { buildWeatherSystem } from '../geometry/weatherBuilders';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import {
  OpeningShape, WallProfile, SurfaceType, ChildHole, IslandHole,
  ArenaData, PitData, ZoneData, SpeedLineData, SpeedLineSegment, SpeedLineHandleType,
  WallData, BridgeData, BridgeSegmentData, BridgeSegmentType,
  ObstacleData, TrapData, PortalData,
  RotationData, RotationNodeType,
  BaseFootingData,
  PresentConfig, ParticleConfig,
  defaultPresentConfig, defaultParticleConfig,
} from '../types/arenaTypes';
import { buildSurfaceMaterial } from '../geometry/materialBuilders';
import {
  shapePoints, childWorldPos, makeSurfFn, polarToLocalXZ, arenaSurfaceYAtArenaLocal,
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
import { samplePathForOverlap, buildOverlapSphere, generatePresetSegments } from '../geometry/speedLineBuilders';
import { SceneSurfaceProjector } from '../geometry/sceneSurfaceProjector';
import { SceneTree } from '../utils/SceneTree';
import { PropertiesPanel } from '../utils/PropertiesPanel';
import {
  PitSave, ZoneSave, WallSave, BridgeSave, SpeedLineSave, ArenaConfig, RotationSave,
  ObstacleSave, TrapSave, PortalSave, BaseFootingSave,
  pitToSave, zoneToSave, arenaToSave, wallToSave, bridgeToSave, speedLineToSave,
  obstacleToSave, trapToSave, portalToSave, rotationToSave, footingToSave,
} from '../utils/arenaPersistence';
import { DEMO_ARENA_CONFIG } from '../config/demoArenaConfig';
import { buildObstacleObjects, applyObstacle, defaultObstacle } from '../geometry/obstacleBuilders';
import { buildFootingObjects, applyFooting, defaultFooting } from '../geometry/footingBuilders';
import { buildTrapObjects, applyTrap, defaultTrap, trapSurfY, clampTrapDim, buildEarthquakeMesh, updateEarthquakeMeshHeights, buildRPMMesh } from '../geometry/trapBuilders';
import { defaultProjectileConfig } from '../types/arenaTypes';
import { ProjectileManager } from '../features/managers/ProjectileManager';
import { buildPortalObjects, applyPortal, defaultPortal, portalSurfY } from '../geometry/portalBuilders';
import {
  buildJumpLinkObjects, applyJumpLink, defaultJumpLink, jumpLinkFromSave, resolveEndpointWorld,
} from '../geometry/jumpLinkBuilders';
import { JumpLinkData, JumpLinkParentType } from '../types/arenaTypes';
import { jumpLinkToSave, JumpLinkSave } from '../utils/arenaPersistence';
import { buildWallGeometry, buildWallEdgeGeometry, defaultWallData, trapRimPoints, trapWorldCenter } from '../geometry/wallBuilders';
import {
  SegmentPose, DEFAULT_START_POSE,
  resolveStartPose, computeSegmentEndPose,
  buildSegmentDeckGeometry, buildSegmentEdgeGeometry,
  defaultBridgeSection, defaultSegment,
} from '../geometry/bridgeSegmentBuilders';
import {
  listArenaPresets, saveArenaPreset, newPresetId,
  generateArenaThumb, remapArenaConfigIds, extractArenaConfig,
} from '../utils/presetStore';
import { SpawnManager } from '../features/managers/SpawnManager';
import { ArenaEnvironmentManager } from '../features/managers/ArenaEnvironmentManager';
import type { SceneContext } from '../features/IArenaFeature';

/* ══════════════════════════════════════════════════════════════════════════
   ArenaSandbox
   ══════════════════════════════════════════════════════════════════════════ */
export interface ArenaSandboxOptions extends SandboxOptions {
  onLibrary?: () => void;
  presetEditorMode?: boolean;
}

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
  private obstacles     = new Map<string, ObstacleData>();
  private obstacleSeq   = 0;
  private traps         = new Map<string, TrapData>();
  private trapSeq       = 0;
  private portals       = new Map<string, PortalData>();
  private portalSeq     = 0;
  private rotations     = new Map<string, RotationData>();
  private rotationSeq   = 0;
  private nodeRotationId = new Map<string, string>(); // nodeId → rotationId
  private footings      = new Map<string, BaseFootingData>();
  private footingSeq    = 0;
  private jumpLinks     = new Map<string, JumpLinkData>();
  private jumpLinkSeq   = 0;
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
  private _presentMeshes = new Map<string, THREE.Mesh>();
  private _arenaViewMode: 'hitbox' | 'both' | 'present' = 'both';
  private _viewBtns: HTMLButtonElement[] = [];
  /** Per-feature PresentConfig for the Presentation sub-node system. */
  private _presentConfigs = new Map<string, PresentConfig>();
  /** Per-feature ParticleConfig for the Particle Effect sub-node system. */
  private _particleConfigs = new Map<string, ParticleConfig>();
  /** Tracks which sub-node IDs (present-X, particle-X, weather-X) are in the tree. */
  private _subNodesAdded = new Set<string>();
  private _projectileMgr: ProjectileManager | null = null;
  private _spawnMgr:    SpawnManager | null = null;
  private _spawnMgrBtn: HTMLButtonElement | null = null;
  private _envMgr!: ArenaEnvironmentManager;
  private _scoreHudEl: HTMLDivElement | null = null;

  /* ── Undo / Redo ── */
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private _undoTimerId = 0;
  private _preChangeState: string | null = null;
  private undoBtn!: HTMLButtonElement;
  private redoBtn!: HTMLButtonElement;

  private _arenaOpts: ArenaSandboxOptions;

  constructor(container: HTMLElement, opts: ArenaSandboxOptions) {
    super(container, opts);
    this._arenaOpts = opts;
    this.arenaStorageKey = `bey_arena_${opts.title.toLowerCase().replace(/\s+/g,'_')}`;

    this.modeBtn = this.addTopBarButton('● Solid', 'Toggle solid / mesh view');
    this.modeBtn.addEventListener('click', ()=>this.toggleMode());

    const resetArenaBtn = this.addTopBarButton('Reset Arena', 'Reset arena configuration');
    resetArenaBtn.className += ' reset-arena-btn';
    resetArenaBtn.addEventListener('click', ()=>{ void this.resetArena(); });

    if (!opts.presetEditorMode) {
      const demoBtn = this.addTopBarButton('★ Demo', 'Load sample demo arena');
      demoBtn.className += ' load-demo-btn';
      demoBtn.addEventListener('click', async () => {
        const ok = await gameConfirm('Load demo arena? Current work will be replaced.');
        if (!ok) return;
        this._applyConfigToScene(DEMO_ARENA_CONFIG);
        this._flushSave();
      });
    }

    const savePresetBtn = this.addTopBarButton('💾 Preset', 'Save checked nodes as a named preset');
    savePresetBtn.addEventListener('click', () => this._showSavePresetModal());

    const libraryBtn = this.addTopBarButton('📚 Library', 'Browse arena presets');
    libraryBtn.addEventListener('click', () => this._arenaOpts.onLibrary?.());

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
        {label:'A+',   title:'Add arena',       className:'',        onClick:()=>this.addArena()},
        {label:'B+',   title:'Add bridge',      className:'zone-btn',onClick:()=>this.addBridge()},
        {label:'Obs+', title:'Add obstacle',    className:'sl-btn',  onClick:()=>this.addObstacle()},
        {label:'Trap+',title:'Add base trap',   className:'pit-btn', onClick:()=>this.addTrap('octagon-base','base')},
        {label:'⬡+',   title:'Add base portal', className:'zone-btn',onClick:()=>this.addPortal('octagon-base','base')},
        {label:'⬢+',   title:'Add footing',     className:'pit-btn', onClick:()=>this.addFooting()},
        {label:'⤻+',   title:'Add jump link',   className:'sl-btn',  onClick:()=>this._addJumpLink('octagon-base','base')},
      ],
    });

    const rightPanel = this.addOverlayPanel('sandbox-right-panel');
    this.props = new PropertiesPanel(rightPanel);
    this.props.onClose = ()=>{ this.selectedId=null; this.sceneTree.clearSel(); this.props.showEmpty(); };

    // View mode bottom bar
    const viewBar = this.addOverlayPanel('arena-view-bar');
    const viewModes: Array<['hitbox'|'both'|'present', string]> = [
      ['hitbox', '⬡ Hitbox'], ['both', '◈ Both'], ['present', '✦ Visual'],
    ];
    for (const [mode, label] of viewModes) {
      const btn = document.createElement('button');
      btn.className = 'game-btn arena-view-btn' + (mode === 'both' ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => { this._setViewMode(mode); });
      viewBar.appendChild(btn);
      this._viewBtns.push(btn);
    }

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
        // Sub-node deletion: clean up config and track set; don't touch feature data
        if (id.startsWith('present-')) {
          const fid = id.slice(8);
          this._presentConfigs.delete(fid);
          this._disposePresentMesh(fid);
          this._subNodesAdded.delete(id);
          this._applyViewMode();
          continue;
        }
        if (id.startsWith('particle-')) {
          this._particleConfigs.delete(id.slice(9));
          this._subNodesAdded.delete(id);
          continue;
        }
        if (id.startsWith('weather-')) {
          const fid = id.slice(8);
          const arena = this.arenas.get(fid);
          if (arena?.weatherSystem) {
            this.removeFromScene(arena.weatherSystem.points);
            arena.weatherSystem.dispose();
            arena.weatherSystem = null;
          }
          this._subNodesAdded.delete(id);
          continue;
        }
        if (id.startsWith('env-')) {
          this._subNodesAdded.delete(id);
          continue;
        }
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
          if(this.nodeRotationId.has(id)) this._removeMemberFromRotation(id);
          this.removeZoneFromScene(id);
          if(parentArena){ this.updateArenaFloor(parentArena); this.updateArenaBowlHoles(parentArena,zone.parentArenaId); }
          continue;
        }
        if(this.speedLines.has(id)){ this.captureUndo(); this._removeSpeedLine(id); continue; }
        if(this.walls.has(id)){
          if(this.nodeRotationId.has(id)) this._removeMemberFromRotation(id);
          this.removeWall(id); continue;
        }
        if(this.segments.has(id)){ this.removeSegment(id); continue; }
        if(this.bridges.has(id)){ this.removeBridge(id); continue; }
        if(this.obstacles.has(id)){
          if(this.nodeRotationId.has(id)) this._removeMemberFromRotation(id);
          this.removeObstacle(id); continue;
        }
        if(this.traps.has(id)){
          if(this.nodeRotationId.has(id)) this._removeMemberFromRotation(id);
          this.removeTrap(id); continue;
        }
        if(this.portals.has(id)){ this.removePortal(id); continue; }
        if(this.jumpLinks.has(id)){ this._removeJumpLink(id); continue; }
        if(this.rotations.has(id)){ this.removeRotation(id); continue; }
        if(this.footings.has(id)){ this.removeFooting(id); continue; }
        const objs=this.sceneObjects.get(id);
        if(objs){ this.removeFromScene(...objs); this.sceneObjects.delete(id); }
      }
      if(ids.some(id=>id===this.selectedId)){ this.selectedId=null; this.props.showEmpty(); }
      this.saveArena();
      this._flushUndoPending();
    };

    this.sceneTree.onGroup = (autoGroupId: string, childIds: string[]) => {
      // SceneTree already created the auto group node — remove it, we'll create our own rotation node
      this.sceneTree.remove(autoGroupId);
      const validIds: string[] = [];
      const validTypes: RotationNodeType[] = [];
      for (const cid of childIds) {
        const t = this._nodeTypeOf(cid);
        if (t && !this.nodeRotationId.has(cid)) { validIds.push(cid); validTypes.push(t); }
      }
      if (validIds.length < 1) return;
      let sumX=0, sumY=0, sumZ=0;
      for (let i=0; i<validIds.length; i++) {
        const p = this._defaultPivotForMember(validIds[i], validTypes[i]);
        sumX+=p.pivotX; sumY+=p.pivotY; sumZ+=p.pivotZ;
      }
      const n = validIds.length;
      this.addRotation(validIds, validTypes, sumX/n, sumY/n, sumZ/n);
    };

    this.sceneTree.onReparent = (nodeId: string, newParentId: string | null) => {
      this._onReparent(nodeId, newParentId);
    };

    this.sceneTree.onDuplicate = (id: string) => { this._duplicateNode(id); };

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
      bridges: [...this.bridges.values()].map(b=>bridgeToSave(b,this.segments,this.walls)),
      wallSeq: this.wallSeq, bridgeSeq: this.bridgeSeq, segmentSeq: this.segmentSeq,
      speedLineSeq: this.speedlineSeq,
      speedLines: [...this.speedLines.values()]
        .filter(sl => sl.parentZoneId !== null)
        .map(speedLineToSave),
      baseWalls: [...this.walls.values()]
        .filter(w => w.parentType==='base')
        .map(wallToSave),
      obstacles: [...this.obstacles.values()].map(obstacleToSave),
      obstacleSeq: this.obstacleSeq,
      traps: [...this.traps.values()].map(t => {
        const ts = trapToSave(t);
        ts.walls = [...this.walls.values()]
          .filter(w => w.parentType==='trap' && w.parentId===t.id)
          .map(wallToSave);
        return ts;
      }),
      trapSeq: this.trapSeq,
      portals: [...this.portals.values()].map(portalToSave),
      portalSeq: this.portalSeq,
      rotations: [...this.rotations.values()].map(rotationToSave),
      rotationSeq: this.rotationSeq,
      footings: [...this.footings.values()].map(footingToSave),
      footingSeq: this.footingSeq,
      jumpLinks: [...this.jumpLinks.values()].map(jumpLinkToSave),
      jumpLinkSeq: this.jumpLinkSeq,
    };
    return JSON.stringify({ v: ARENA_SAVE_VERSION, c: config });
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
    const cfg = (JSON.parse(this.undoStack.pop()!) as { v: number; c: ArenaConfig }).c;
    this._applyConfigToScene(cfg);
    this.saveArena();
    this.updateUndoRedoUI();
  }

  private redo(): void {
    this._flushUndoPending();
    if (!this.redoStack.length) return;
    this.undoStack.push(this.serializeConfig());
    const cfg = (JSON.parse(this.redoStack.pop()!) as { v: number; c: ArenaConfig }).c;
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
    this._envMgr?.clear();
    // Remove rotations first to return objects to scene root before clearing
    for(const rot of this.rotations.values()){
      const scene=this.getScene();
      if(rot.pivotGroup && scene){
        for(const mid of rot.memberIds) for(const obj of this._getMemberObjects(mid)) scene.attach(obj);
        scene.remove(rot.pivotGroup);
      }
    }
    this.rotations.clear(); this.nodeRotationId.clear(); this.rotationSeq=0;
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
    for(const obs of this.obstacles.values()) this._disposeObstacle(obs);
    this.obstacles.clear(); this.obstacleSeq = 0;
    for(const trap of this.traps.values()) this._disposeTrap(trap);
    this.traps.clear(); this.trapSeq = 0;
    for(const portal of this.portals.values()) this._disposePortal(portal);
    this.portals.clear(); this.portalSeq = 0;
    for(const footing of this.footings.values()) this._disposeFooting(footing);
    this.footings.clear(); this.footingSeq = 0;
    for(const jl of this.jumpLinks.values()) this._disposeJumpLink(jl);
    this.jumpLinks.clear(); this.jumpLinkSeq = 0;
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
    this.wallSeq = cfg.wallSeq; this.bridgeSeq = cfg.bridgeSeq; this.segmentSeq = cfg.segmentSeq;
    this.speedlineSeq = cfg.speedLineSeq;
    this.obstacleSeq = cfg.obstacleSeq;
    this.trapSeq = cfg.trapSeq;
    this.portalSeq = cfg.portalSeq;
    this.rotationSeq = cfg.rotationSeq;
    this.footingSeq = cfg.footingSeq;
    this.jumpLinkSeq = cfg.jumpLinkSeq ?? 0;
    this._loadArenasFromConfig(cfg);
    this.selectedId = null; this.sceneTree.clearSel(); this.props.showEmpty();
  }

  /* ── Arena light helpers ──────────────────────────────────────────────── */
  private _createArenaLight(arena: ArenaData): void {
    if (arena.light) { this.removeFromScene(arena.light); arena.light.dispose(); }
    if (arena.lightIntensity <= 0) { arena.light = null; return; }
    const light = new THREE.PointLight(arena.lightColor, arena.lightIntensity, arena.lightRange);
    light.position.set(arena.posX, this.baseConfig.height + arena.posY + arena.lightPosY, arena.posZ);
    this.addToScene(light);
    arena.light = light;
  }
  private _updateArenaLight(arena: ArenaData): void {
    if (!arena.light) { this._createArenaLight(arena); return; }
    if (arena.lightIntensity <= 0) {
      this.removeFromScene(arena.light); arena.light.dispose(); arena.light = null; return;
    }
    arena.light.color.setHex(arena.lightColor);
    arena.light.intensity = arena.lightIntensity;
    arena.light.distance = arena.lightRange;
    arena.light.position.set(arena.posX, this.baseConfig.height + arena.posY + arena.lightPosY, arena.posZ);
  }

  /* ── Particle system helpers ──────────────────────────────────────────── */
  private _createArenaParticles(arenaId: string, arena: ArenaData): void {
    if (arena.particleSystem) { this.removeFromScene(arena.particleSystem.points); arena.particleSystem.dispose(); arena.particleSystem = null; }
    if (arena.particlePreset === 'none') return;
    const cfg = this._particleConfigs.get(arenaId) ?? { ...defaultParticleConfig(), preset: arena.particlePreset };
    const ps = buildParticleSystem(cfg, arena.posX, arena.posZ, Math.max(arena.radiusX, arena.radiusZ), this.baseConfig.height + arena.posY, arena.depth);
    this.addToScene(ps.points);
    arena.particleSystem = ps;
  }
  private _createZoneParticles(zone: ZoneData): void {
    if (zone.particleSystem) { this.removeFromScene(zone.particleSystem.points); zone.particleSystem.dispose(); zone.particleSystem = null; }
    if (zone.particlePreset === 'none') return;
    const arena = this.arenas.get(zone.parentArenaId);
    const baseY = arena ? this.baseConfig.height + arena.posY : this.baseConfig.height;
    const { lx: cx, lz: cz } = polarToLocalXZ(zone.posR, zone.posAngle);
    const wx = arena ? arena.posX + cx : cx;
    const wz = arena ? arena.posZ + cz : cz;
    const cfg = this._particleConfigs.get(zone.id) ?? { ...defaultParticleConfig(), preset: zone.particlePreset };
    const ps = buildParticleSystem(cfg, wx, wz, Math.max(zone.radiusX, zone.radiusZ), baseY, zone.depth);
    this.addToScene(ps.points);
    zone.particleSystem = ps;
  }
  private _createPitParticles(pitId: string, pit: PitData): void {
    if (pit.particleSystem) { this.removeFromScene(pit.particleSystem.points); pit.particleSystem.dispose(); pit.particleSystem = null; }
    const cfg = this._particleConfigs.get(pitId) ?? pit.particleConfig;
    if (cfg.preset === 'none') return;
    const arena = this.arenas.get(pit.parentArenaId);
    if (!arena) return;
    const { lx: cx, lz: cz } = polarToLocalXZ(pit.posR, pit.posAngle);
    const wx = arena.posX + cx; const wz = arena.posZ + cz;
    const t = pit.posR / Math.max(arena.radiusX, arena.radiusZ);
    const rimY = this.baseConfig.height + arena.posY - arena.depth * (1 - t * t);
    const ps = buildParticleSystem(cfg, wx, wz, Math.max(pit.radiusX, pit.radiusZ), rimY, pit.depth);
    this.addToScene(ps.points);
    pit.particleSystem = ps;
  }

  /* ── Weather system helpers ──────────────────────────────────────────── */
  private _createArenaWeather(arena: ArenaData): void {
    if (arena.weatherSystem) {
      this.removeFromScene(arena.weatherSystem.points);
      arena.weatherSystem.dispose();
      arena.weatherSystem = null;
    }
    if (arena.weatherPreset === 'none') return;
    const ws = buildWeatherSystem(
      arena.weatherPreset,
      arena.windEnabled, arena.windDirectionDeg, arena.windStrengthCms,
      arena.windGustInterval, arena.windGustMult,
      Math.max(arena.radiusX, arena.radiusZ),
      this.baseConfig.height + arena.posY,
    );
    this.addToScene(ws.points);
    arena.weatherSystem = ws;
  }

  /* ── Sub-node helpers ────────────────────────────────────────────────── */

  private _addSubNodePresent(featureId: string): void {
    const subId = `present-${featureId}`;
    if (this._subNodesAdded.has(subId)) return;
    this._subNodesAdded.add(subId);
    this.sceneTree.add(subId, 'Presentation', '✦', featureId);
  }

  private _addSubNodeParticle(featureId: string): void {
    const subId = `particle-${featureId}`;
    if (this._subNodesAdded.has(subId)) return;
    this._subNodesAdded.add(subId);
    this.sceneTree.add(subId, 'Particle Effect', '✧', featureId);
  }

  private _addSubNodeWeather(arenaId: string): void {
    const subId = `weather-${arenaId}`;
    if (this._subNodesAdded.has(subId)) return;
    this._subNodesAdded.add(subId);
    this.sceneTree.add(subId, 'Weather', '🌤', arenaId);
  }

  /** Get existing presentStlb64 + presentColor from any feature that has them. */
  private _getFeaturePresent(featureId: string): { stlb64: string | null; color: number } {
    const arena = this.arenas.get(featureId);
    if (arena) return { stlb64: arena.presentStlb64, color: arena.presentColor };
    const wall = this.walls.get(featureId);
    if (wall) return { stlb64: wall.presentStlb64, color: wall.presentColor };
    const bridge = this.bridges.get(featureId);
    if (bridge) return { stlb64: bridge.presentStlb64, color: bridge.presentColor };
    const obs = this.obstacles.get(featureId);
    if (obs) return { stlb64: obs.presentStlb64, color: obs.presentColor };
    const trap = this.traps.get(featureId);
    if (trap) return { stlb64: trap.presentStlb64, color: trap.presentColor };
    const portal = this.portals.get(featureId);
    if (portal) return { stlb64: portal.presentStlb64, color: portal.presentColor };
    const footing = this.footings.get(featureId);
    if (footing) return { stlb64: footing.presentStlb64, color: footing.presentColor };
    return { stlb64: null, color: 0xaaaaaa };
  }

  /** Load STL from PresentConfig and apply all transforms. */
  private _loadPresentStlWithConfig(featureId: string, cfg: PresentConfig): void {
    if (!cfg.stlb64) return;
    this._disposePresentMesh(featureId);
    const bin = Uint8Array.from(atob(cfg.stlb64), c => c.charCodeAt(0));
    const loader = new STLLoader();
    const geo = loader.parse(bin.buffer);
    const mat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: 0.6, metalness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    const hitbox = this._getHitboxMesh(featureId);
    const bx = hitbox?.position.x ?? 0;
    const by = hitbox?.position.y ?? 0;
    const bz = hitbox?.position.z ?? 0;
    mesh.position.set(bx + cfg.offX, by + cfg.offY, bz + cfg.offZ);
    mesh.rotation.set(
      THREE.MathUtils.degToRad(cfg.rotX),
      THREE.MathUtils.degToRad(cfg.rotY),
      THREE.MathUtils.degToRad(cfg.rotZ),
    );
    mesh.scale.set(cfg.scaleX, cfg.scaleY, cfg.scaleZ);
    this.addToScene(mesh);
    this._presentMeshes.set(featureId, mesh);
    this._applyViewMode();
  }

  /** Apply PresentConfig to an existing or new present mesh. */
  private _applyPresentConfig(featureId: string, cfg: PresentConfig): void {
    if (!cfg.stlb64) { this._disposePresentMesh(featureId); this._applyViewMode(); return; }
    const pm = this._presentMeshes.get(featureId);
    if (!pm) {
      this._loadPresentStlWithConfig(featureId, cfg);
    } else {
      const hitbox = this._getHitboxMesh(featureId);
      const bx = hitbox?.position.x ?? 0;
      const by = hitbox?.position.y ?? 0;
      const bz = hitbox?.position.z ?? 0;
      pm.position.set(bx + cfg.offX, by + cfg.offY, bz + cfg.offZ);
      pm.rotation.set(
        THREE.MathUtils.degToRad(cfg.rotX),
        THREE.MathUtils.degToRad(cfg.rotY),
        THREE.MathUtils.degToRad(cfg.rotZ),
      );
      pm.scale.set(cfg.scaleX, cfg.scaleY, cfg.scaleZ);
      (pm.material as THREE.MeshStandardMaterial).color.setHex(cfg.color);
    }
  }

  private _showPresentNode(featureId: string): void {
    if (!this._presentConfigs.has(featureId)) {
      const { stlb64, color } = this._getFeaturePresent(featureId);
      const cfg = defaultPresentConfig();
      cfg.stlb64 = stlb64;
      cfg.color  = color;
      this._presentConfigs.set(featureId, cfg);
      if (stlb64) this._loadPresentStlWithConfig(featureId, cfg);
    }
    const cfg = this._presentConfigs.get(featureId)!;
    this.props.showPresentation(
      cfg,
      () => { this._applyPresentConfig(featureId, cfg); this.saveArena(); },
      (loadCb) => {
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = '.stl';
        inp.onchange = () => {
          const file = inp.files?.[0]; if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const b64 = btoa(String.fromCharCode(...new Uint8Array(reader.result as ArrayBuffer)));
            loadCb(b64);
          };
          reader.readAsArrayBuffer(file);
        };
        inp.click();
      },
      () => { cfg.stlb64 = null; this._disposePresentMesh(featureId); this._applyViewMode(); this.saveArena(); },
    );
  }

  private _showParticleNode(featureId: string): void {
    if (!this._particleConfigs.has(featureId)) {
      const cfg = defaultParticleConfig();
      // Bootstrap from existing particlePreset if available
      const arena = this.arenas.get(featureId);
      if (arena) cfg.preset = arena.particlePreset;
      const zone = this.zones.get(featureId);
      if (zone) cfg.preset = zone.particlePreset;
      const pit = this.pits.get(featureId);
      if (pit) cfg.preset = pit.particleConfig.preset;
      this._particleConfigs.set(featureId, cfg);
    }
    const cfg = this._particleConfigs.get(featureId)!;
    const isSpeedLine = this.speedLines.has(featureId);
    this.props.showParticle(
      cfg,
      () => {
        // Sync back to ArenaData.particlePreset / ZoneData.particlePreset for save compat
        const arena = this.arenas.get(featureId);
        if (arena) { arena.particlePreset = cfg.preset; this._createArenaParticles(featureId, arena); }
        const zone = this.zones.get(featureId);
        if (zone) { zone.particlePreset = cfg.preset; this._createZoneParticles(zone); }
        const pit = this.pits.get(featureId);
        if (pit) { pit.particleConfig = { ...cfg }; this._createPitParticles(featureId, pit); }
        this.saveArena();
      },
      isSpeedLine,
    );
  }

  private _showWeatherNode(arenaId: string): void {
    const arena = this.arenas.get(arenaId);
    if (!arena) { this.props.showEmpty(); return; }
    this.props.showWeather(arena, () => {
      this.captureUndo();
      this._createArenaWeather(arena);
      this.saveArena();
    });
  }

  /* ── View mode ────────────────────────────────────────────────────────── */
  private _setViewMode(mode: 'hitbox' | 'both' | 'present'): void {
    this._arenaViewMode = mode;
    this._viewBtns.forEach((btn, i) => {
      const modes: Array<'hitbox'|'both'|'present'> = ['hitbox','both','present'];
      btn.classList.toggle('active', modes[i] === mode);
    });
    this._applyViewMode();
  }
  private _applyViewMode(): void {
    const showHitbox  = this._arenaViewMode !== 'present';
    const showPresent = this._arenaViewMode !== 'hitbox';
    // Hitbox objects
    const hitboxSets: THREE.Object3D[][] = [];
    for (const objs of this.sceneObjects.values()) hitboxSets.push(objs);
    for (const objs of hitboxSets) for (const o of objs) o.visible = showHitbox;
    // Present meshes
    for (const [nodeId, pm] of this._presentMeshes) {
      pm.visible = showPresent;
      // If present is shown and hitbox hidden, keep hitbox hidden even if no present mesh
      if (!showHitbox && showPresent) {
        // The hitbox for this node was already hidden above; present mesh is visible
      }
      void nodeId;
    }
  }
  private _loadPresentStl(nodeId: string, b64: string, color: number): void {
    this._disposePresentMesh(nodeId);
    const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const loader = new STLLoader();
    const geo = loader.parse(bin.buffer);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    // Position to match hitbox
    const hitbox = this._getHitboxMesh(nodeId);
    if (hitbox) { mesh.position.copy(hitbox.position); mesh.rotation.copy(hitbox.rotation); }
    this.addToScene(mesh);
    this._presentMeshes.set(nodeId, mesh);
    this._applyViewMode();
  }
  private _disposePresentMesh(nodeId: string): void {
    const pm = this._presentMeshes.get(nodeId);
    if (!pm) return;
    this.removeFromScene(pm);
    pm.geometry.dispose();
    (pm.material as THREE.Material).dispose();
    this._presentMeshes.delete(nodeId);
  }
  private _getHitboxMesh(nodeId: string): THREE.Mesh | null {
    const arena = this.arenas.get(nodeId); if (arena) return arena.mesh;
    const obs = this.obstacles.get(nodeId); if (obs) return obs.mesh;
    const trap = this.traps.get(nodeId); if (trap) return trap.mesh;
    const portal = this.portals.get(nodeId); if (portal) return portal.mesh;
    const wall = this.walls.get(nodeId); if (wall?.mesh) return wall.mesh;
    const footing = this.footings.get(nodeId); if (footing?.mesh) return footing.mesh;
    return null;
  }
  _fileInputStl(nodeId: string, color: number, onLoaded: (b64: string) => void): void {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.stl';
    inp.onchange = () => {
      const file = inp.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const ab = reader.result as ArrayBuffer;
        const b64 = btoa(String.fromCharCode(...new Uint8Array(ab)));
        this._loadPresentStl(nodeId, b64, color);
        onLoaded(b64);
      };
      reader.readAsArrayBuffer(file);
    };
    inp.click();
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
    if(arena.light){ this.removeFromScene(arena.light); arena.light.dispose(); arena.light = null; }
    if(arena.particleSystem){ this.removeFromScene(arena.particleSystem.points); arena.particleSystem.dispose(); arena.particleSystem = null; }
    if(arena.weatherSystem){ this.removeFromScene(arena.weatherSystem.points); arena.weatherSystem.dispose(); arena.weatherSystem = null; }
    if(arena.fogSystem){ this.removeFromScene(arena.fogSystem.points); arena.fogSystem.dispose(); arena.fogSystem = null; }
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
    if(zone.particleSystem){ this.removeFromScene(zone.particleSystem.points); zone.particleSystem.dispose(); zone.particleSystem = null; }
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
    // Clear back-refs on bridges/traps that reference this SL
    if (sl.linkedBridgeId) {
      const bridge = this.bridges.get(sl.linkedBridgeId);
      if (bridge) bridge.linkedSpeedLineId = null;
    }
    if (sl.linkedTrapId) {
      const trap = this.traps.get(sl.linkedTrapId);
      if (trap) trap.linkedSpeedLineId = null;
    }
    this._disposeSpeedLine(sl);
    const arena = this.arenas.get(sl.parentArenaId);
    if(arena) arena.speedLineIds = arena.speedLineIds.filter(x=>x!==id);
    if(sl.parentZoneId){ const z=this.zones.get(sl.parentZoneId); if(z) z.speedLineIds=z.speedLineIds.filter(x=>x!==id); }
    this.speedLines.delete(id);
    if(this.selectedSlId===id){ this.selectedSlId=null; }
    this._checkSpeedLineOverlaps(sl.parentArenaId);
    this.saveArena();
  }

  /** Auto-create an arena-level speed line and link it to a bridge. */
  private _autoLinkSpeedLine(bridgeId: string, segType: BridgeSegmentType, arenaId: string): void {
    const bridge = this.bridges.get(bridgeId); if (!bridge) return;
    if (bridge.linkedSpeedLineId) return; // already linked
    const arena  = this.arenas.get(arenaId); if (!arena) return;

    const id   = `sl-${++this.speedlineSeq}`;
    const name = `SL for ${bridge.name}`;
    const sl = defaultSpeedLine(name, arenaId, id, null);
    sl.segments[0].id = `${id}-seg-${++this.slSegSeq}`;
    sl.linkedBridgeId  = bridgeId;
    sl.targetType      = 'linked_bridge';
    sl.targetBridgeId  = bridgeId;

    // Choose preset based on segment type
    if (segType === 'loop' || segType === 'return_loop' || segType === 'exit_loop') {
      sl.presetType = 'circle';
    } else if (segType === 'corkscrew') {
      sl.presetType = 'helix';
    } else if (segType === 'hairpin') {
      sl.presetType = 'spiral_in';
    }

    this.speedLines.set(id, sl);
    arena.speedLineIds.push(id);
    bridge.linkedSpeedLineId = id;

    const { mesh, edges, markerMeshes, handleMeshes, totalLength } = buildSpeedLineObjects(sl, arena, this.zones);
    sl.mesh=mesh; sl.edges=edges; sl.markerMeshes=markerMeshes; sl.handleMeshes=handleMeshes; sl.totalLength=totalLength;
    this.addToScene(mesh, edges, ...markerMeshes, ...handleMeshes);
    this.sceneObjects.set(id, [mesh, edges]);
    this.sceneTree.add(id, name, '↝', arenaId);
  }

  /** Auto-create an arena-level speed line and link it to a trap. */
  private _autoLinkTrapSpeedLine(trapId: string, arenaId: string): void {
    const trap  = this.traps.get(trapId);   if (!trap)  return;
    if (trap.linkedSpeedLineId) return;
    const arena = this.arenas.get(arenaId); if (!arena) return;

    const id   = `sl-${++this.speedlineSeq}`;
    const name = `SL for ${trap.name}`;
    const sl = defaultSpeedLine(name, arenaId, id, null);
    sl.segments[0].id = `${id}-seg-${++this.slSegSeq}`;
    sl.linkedTrapId  = trapId;
    sl.targetType    = 'linked_trap';
    sl.targetTrapId  = trapId;

    // Choose preset based on trap effect
    switch (trap.effect) {
      case 'gravity_pull': sl.presetType = 'spiral_in';  break;
      case 'damage':       sl.presetType = 'star';        break;
      case 'launch':       sl.presetType = 'spiral_out'; break;
      case 'buff_zone':
      case 'heal':         sl.presetType = 'circle';     break;
      case 'rpm':          sl.presetType = 'circle';     break;
      case 'earthquake':   sl.presetType = 'polygon';    break;
      case 'projectile':   sl.presetType = 'polygon';    break;
      default: return; // no SL for freeze/reverse_controls/hidden_pit
    }

    this.speedLines.set(id, sl);
    arena.speedLineIds.push(id);
    trap.linkedSpeedLineId = id;

    const { mesh, edges, markerMeshes, handleMeshes, totalLength } = buildSpeedLineObjects(sl, arena, this.zones);
    sl.mesh=mesh; sl.edges=edges; sl.markerMeshes=markerMeshes; sl.handleMeshes=handleMeshes; sl.totalLength=totalLength;
    this.addToScene(mesh, edges, ...markerMeshes, ...handleMeshes);
    this.sceneObjects.set(id, [mesh, edges]);
    this.sceneTree.add(id, name, '↝', arenaId);
  }

  private _updateSpeedLine(sl: SpeedLineData): void {
    const arena = this.arenas.get(sl.parentArenaId); if(!arena) return;

    // Pre-resolve jump preset source + destination into arena-local coords
    if (sl.presetType === 'jump') {
      const p = sl.presetParams;
      // Source: arena-local XZ from startR/startAngle, Y from arena surface
      const srcAL = polarToLocalXZ(sl.startR, sl.startAngle);
      const srcWY = arenaSurfaceYAtArenaLocal(arena, srcAL.lx, srcAL.lz);
      p.startPosX = srcAL.lx; p.startPosZ = srcAL.lz; p.startPosY = srcWY;

      // Destination: resolve via endpoint helper then convert to arena-local
      const ep = {
        mode: (p.jumpDstMode ?? 'parent_surface') as import('../types/arenaTypes').JumpEndpointMode,
        parentType: (p.jumpDstParentType ?? 'arena') as import('../types/arenaTypes').JumpLinkParentType,
        parentId: p.jumpDstParentId ?? sl.parentArenaId,
        localX: p.jumpDstLocalX ?? 0, localZ: p.jumpDstLocalZ ?? 0,
        worldX: p.jumpDstWorldX ?? 0, worldY: p.jumpDstWorldY ?? 0, worldZ: p.jumpDstWorldZ ?? 0,
        speedLineId: p.jumpDstSpeedLineId ?? null, atStart: p.jumpDstAtStart ?? false,
      };
      const dstW = resolveEndpointWorld(ep, this.arenas, this.obstacles, this.traps,
        id => this.speedLines.get(id), this.baseConfig.height);
      const dx = dstW.x - arena.posX; const dz = dstW.z - arena.posZ;
      const cosR = Math.cos(-arena.rotY * DEG2RAD); const sinR = Math.sin(-arena.rotY * DEG2RAD);
      p.endPosX = dx * cosR - dz * sinR;
      p.endPosZ = dx * sinR + dz * cosR;
      p.endPosY = dstW.y;
    }

    const projector = this._buildSurfaceProjector(sl.parentArenaId);
    applySpeedLine(sl, arena, this.zones, this.getScene(), (...o)=>this.addToScene(...o), (...o)=>this.removeFromScene(...o), projector);
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
        const ptsA = samplePathForOverlap(slA, arena, surfFnA);
        const ptsB = samplePathForOverlap(slB, arena, surfFnB);
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
        presetType:               sls_.presetType,
        presetParams:             sls_.presetParams,
        speedRamp:                sls_.speedRamp,
        surfaceOffset:            sls_.surfaceOffset,
        surfaceOrientObject:      sls_.surfaceOrientObject,
        airNormalMode:            sls_.airNormalMode,
        airNormalTiltDeg:         sls_.airNormalTiltDeg,
        pointNormals:             [],
        baseCondition:            sls_.baseCondition,
        conditionPhase:           sls_.conditionPhase as SpeedLineData['conditionPhase'],
        ejectBehavior:            sls_.ejectBehavior,
        targetSelectionMode:      sls_.targetSelectionMode,
        conditionCheckIntervalMs: sls_.conditionCheckIntervalMs,
        statModifiers:            sls_.statModifiers,
        linkedBridgeId:           sls_.linkedBridgeId ?? null,
        linkedTrapId:             sls_.linkedTrapId   ?? null,
        enabled:                  sls_.enabled        ?? true,
        targetBridgeId:           sls_.targetBridgeId ?? null,
        targetTrapId:             sls_.targetTrapId   ?? null,
        jumpLinkId:               sls_.jumpLinkId     ?? null,
        totalLength: 0,
        mesh: null as unknown as THREE.Mesh,
        edges: null as unknown as THREE.LineSegments,
        markerMeshes: [], handleMeshes: [], overlapMarkers: [],
      };
      this.speedLines.set(sl.id, sl);
      arena.speedLineIds.push(sl.id);
      if(sl.parentZoneId){ const z=this.zones.get(sl.parentZoneId); if(z && !z.speedLineIds.includes(sl.id)) z.speedLineIds.push(sl.id); }

      const projector = this._buildSurfaceProjector(arenaId);
      const { mesh, edges, markerMeshes, handleMeshes, totalLength } = buildSpeedLineObjects(sl, arena, this.zones, projector);
      sl.mesh=mesh; sl.edges=edges; sl.markerMeshes=markerMeshes; sl.handleMeshes=handleMeshes; sl.totalLength=totalLength;
      this.addToScene(mesh, edges, ...markerMeshes, ...handleMeshes);
      this.sceneObjects.set(sl.id, [mesh, edges]);

      const treeParentId = sl.parentZoneId ?? arenaId;
      this.sceneTree.add(sl.id, sl.name, '↝', treeParentId);
    }
  }

  private _buildSurfaceProjector(arenaId: string): SceneSurfaceProjector | undefined {
    const arena = this.arenas.get(arenaId);
    if (!arena) return undefined;
    const fallbackSurf = (lx: number, lz: number) => arenaSurfaceYAtArenaLocal(arena, lx, lz);
    const projector = new SceneSurfaceProjector([], fallbackSurf);
    for (const wallId of arena.wallIds) {
      const wall = this.walls.get(wallId);
      if (wall?.mesh) projector.addMesh(wall.mesh);
    }
    for (const [, obs] of this.obstacles) {
      if (obs.mesh) projector.addMesh(obs.mesh);
    }
    for (const bridgeId of this.bridgesByArena.get(arenaId) ?? new Set<string>()) {
      const bridge = this.bridges.get(bridgeId);
      if (!bridge) continue;
      for (const segId of bridge.segmentIds) {
        const seg = this.segments.get(segId);
        if (seg?.mesh) projector.addMesh(seg.mesh);
      }
    }
    return projector;
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
    // Detach from pivot group first if rotating
    if(wall._rotatePivot){
      const scene = this.getScene();
      if(scene){
        scene.remove(wall._rotatePivot);
        wall._rotatePivot.clear();
      }
      wall._rotatePivot = undefined;
    }
    if(wall.mesh){ wall.mesh.geometry.dispose();(wall.mesh.material as THREE.Material).dispose(); this.removeFromScene(wall.mesh); wall.mesh=null; }
    if(wall.edges){ wall.edges.geometry.dispose();(wall.edges.material as THREE.Material).dispose(); this.removeFromScene(wall.edges); wall.edges=null; }
    this.sceneObjects.delete(wall.id);
    this.sceneTree.remove(wall.id);
  }

  private _disposeBridge(bridge: BridgeData): void {
    for(const sid of bridge.segmentIds){
      const seg=this.segments.get(sid);
      if(seg){
        if(seg.mesh){ seg.mesh.geometry.dispose();(seg.mesh.material as THREE.Material).dispose(); seg.mesh=null; }
        if(seg.edges){ seg.edges.geometry.dispose();(seg.edges.material as THREE.Material).dispose(); seg.edges=null; }
        if(seg._animPivot){ bridge.group.remove(seg._animPivot); seg._animPivot=null; }
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
    if(!arena) return 0;
    return arena.posY;
  }

  /** Rebuild mesh+edges for a wall and add/replace in scene. */
  private applyWall(wall: WallData, _rebuildingSiblings?: Set<string>): void {
    let rimPts: THREE.Vector2[];
    let rimY: number;
    let cx = 0; let cz = 0;

    if(wall.parentType==='arena'){
      const arena=this.arenas.get(wall.parentId);
      if(!arena) return;
      if(arena.isMoat && wall.moatRing==='inner'){
        rimPts = shapePoints({
          ...arena,
          radiusX: arena.innerRadiusX, radiusZ: arena.innerRadiusZ,
          openingShape: arena.innerOpeningShape, sides: arena.innerSides, starInner: arena.innerStarInner,
        } as typeof arena);
        rimY = arena.posY + arena.innerRimOffset;
      } else {
        rimPts = shapePoints(arena);
        rimY   = arena.posY;
      }
      cx = arena.posX; cz = arena.posZ;
    } else if(wall.parentType==='base'){
      rimPts = [];
      rimY   = this.baseConfig.height;
      cx     = wall.basePosX; cz = wall.basePosZ;
    } else if(wall.parentType==='trap'){
      const trap = this.traps.get(wall.parentId);
      if(!trap) return;
      const surfY = this._getTrapSurfY(trap);
      rimY = surfY + TRAP_PLATE_HEIGHT;
      const c = trapWorldCenter(trap, this.arenas);
      // trapRimPoints returns trap-local XZ (centered 0,0); translate to world space
      // so that inwardDir and inner-offset calculations use consistent coordinates.
      rimPts = trapRimPoints(trap).map(p => new THREE.Vector2(p.x + c.x, p.y + c.z));
      cx = c.x; cz = c.z;
    } else {
      // bridge walls — handled by applyBridgeFromSegment, not here
      return;
    }

    // Compute auto-join: detect adjacent walls on the same parent that share an arc boundary
    let joinStart = false;
    let joinEnd   = false;
    if(wall.autoJoin && wall.parentType==='arena'){
      const siblings = [...this.walls.values()].filter(
        w => w.id !== wall.id && w.parentId === wall.parentId && w.parentType === 'arena',
      );
      joinStart = siblings.some(w => Math.abs((w.arcEnd   % 360 + 360) % 360 - (wall.arcStart % 360 + 360) % 360) < 1);
      joinEnd   = siblings.some(w => Math.abs((w.arcStart % 360 + 360) % 360 - (wall.arcEnd   % 360 + 360) % 360) < 1);
    }

    const scene = this.getScene();
    if(!scene) return;

    const geo  = buildWallGeometry(wall, rimPts, rimY, cx, cz, joinStart, joinEnd);
    const eGeo = buildWallEdgeGeometry(wall, rimPts, rimY, cx, cz, joinStart, joinEnd);

    const wallMat = buildSurfaceMaterial({
      color: wall.color, surface: wall.surface,
      customTileData: wall.customTileData, tileScale: wall.tileScale,
      transparent: wall.opacity < 1, opacity: wall.opacity,
    });
    (wallMat as THREE.MeshStandardMaterial).emissive.setHex(wall.emissiveColor);
    (wallMat as THREE.MeshStandardMaterial).emissiveIntensity = wall.emissiveIntensity;
    (wallMat as THREE.MeshStandardMaterial).depthWrite = wall.opacity >= 1;

    // Detach from old pivot before recreating geometry
    if(wall._rotatePivot && !wall.rotateOnArena){
      scene.remove(wall._rotatePivot);
      wall._rotatePivot.clear();
      wall._rotatePivot = undefined;
    }

    if(wall.mesh){
      wall.mesh.geometry.dispose();
      wall.mesh.geometry = geo;
      (wall.mesh.material as THREE.Material).dispose();
      wall.mesh.material = wallMat;
    } else {
      wall.mesh = new THREE.Mesh(geo, wallMat);
      scene.add(wall.mesh);
    }
    const edgeCol = new THREE.Color(wall.color).lerp(new THREE.Color(0xffffff), 0.5);
    if(wall.edges){
      wall.edges.geometry.dispose();
      wall.edges.geometry = eGeo;
      (wall.edges.material as THREE.LineBasicMaterial).color.copy(edgeCol);
    } else {
      wall.edges = new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
      scene.add(wall.edges);
    }

    // Pivot group for arena auto-rotation
    if(wall.rotateOnArena && wall.parentType==='arena'){
      if(!wall._rotatePivot){
        wall._rotatePivot = new THREE.Group();
        wall._rotatePivot.position.set(cx, 0, cz);
        scene.add(wall._rotatePivot);
        wall._arenaRotateTimer = wall.arenaRotateStepInterval;
      }
      // Re-parent mesh and edges into pivot; offset positions by -cx/-cz
      scene.remove(wall.mesh);
      scene.remove(wall.edges);
      wall._rotatePivot.add(wall.mesh);
      wall._rotatePivot.add(wall.edges);
      wall.mesh.position.x  = 0;
      wall.mesh.position.z  = 0;
      wall.edges.position.x = 0;
      wall.edges.position.z = 0;
    }

    this.sceneObjects.set(wall.id, [wall.mesh, wall.edges]);

    // Rebuild adjacent walls that share this wall's arc boundary so their join-caps update
    if(!_rebuildingSiblings && wall.autoJoin && wall.parentType==='arena'){
      const sibs = new Set<string>([wall.id]);
      for(const w of this.walls.values()){
        if(w.id === wall.id || w.parentId !== wall.parentId || w.parentType !== 'arena') continue;
        const a0 = (wall.arcStart % 360 + 360) % 360;
        const a1 = (wall.arcEnd   % 360 + 360) % 360;
        const b0 = (w.arcStart    % 360 + 360) % 360;
        const b1 = (w.arcEnd      % 360 + 360) % 360;
        if(Math.abs(b1 - a0) < 1 || Math.abs(b0 - a1) < 1){
          this.applyWall(w, sibs);
        }
      }
    }
  }

  private addWall(parentId: string, parentType: WallData['parentType']): void {
    this.captureUndo();
    const id   = `wall-${++this.wallSeq}`;
    const name = `Wall ${this.wallSeq}`;
    const wall = defaultWallData(id, name, parentId, parentType);
    this.walls.set(id, wall);
    this.applyWall(wall);

    const parentTreeId = parentType==='base' ? 'octagon-base' : parentId;
    this.sceneTree.add(id, name, '🧱', parentTreeId, {
      addChildButtons: [
        { label:'↻+', title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(id,'wall'); this.addRotation([id],['wall'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'✦+', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(id) },
      ],
    });
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

  /* ── Obstacle methods ────────────────────────────────────────────────── */

  private addObstacle(): void {
    this.captureUndo();
    const id = `obstacle-${++this.obstacleSeq}`;
    const data = defaultObstacle(`Obstacle ${this.obstacleSeq}`, id, this.baseConfig.height);
    const [mesh, edges] = buildObstacleObjects(data);
    data.mesh = mesh; data.edges = edges;
    this.addToScene(mesh, edges);
    this.sceneObjects.set(id, [mesh, edges]);
    this.obstacles.set(id, data);
    this.sceneTree.add(id, data.name, '⬛', 'octagon-base', {
      addChildButtons: [
        { label:'↻+', title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(id,'obstacle'); this.addRotation([id],['obstacle'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'⤻+', title:'Add jump link',   className:'sl-btn',  onClick:()=>this._addJumpLink(id,'obstacle') },
        { label:'✦+', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(id) },
      ],
    });
    this.saveArena();
  }

  private removeObstacle(id: string): void {
    const obs = this.obstacles.get(id); if(!obs) return;
    this._disposeObstacle(obs);
    this.obstacles.delete(id);
    this.saveArena();
  }

  private _disposeObstacle(obs: ObstacleData): void {
    this.removeFromScene(obs.mesh, obs.edges);
    obs.mesh.geometry.dispose();
    (obs.mesh.material as THREE.Material).dispose();
    obs.edges.geometry.dispose();
    (obs.edges.material as THREE.Material).dispose();
    this.sceneObjects.delete(obs.id);
  }

  private _restoreObstacleSave(os: ObstacleSave): void {
    const data = defaultObstacle(os.name, os.id, this.baseConfig.height);
    Object.assign(data, {
      shape: os.shape, theme: os.theme,
      dimX: os.dimX, dimY: os.dimY, dimZ: os.dimZ,
      posX: os.posX, posY: os.posY, posZ: os.posZ,
      rotX: os.rotX, rotY: os.rotY, rotZ: os.rotZ,
      isFloating: os.isFloating, isDestructible: os.isDestructible, hitPoints: os.hitPoints,
      contactForceX: os.contactForceX, contactForceY: os.contactForceY, contactForceZ: os.contactForceZ,
      color: os.color, surface: os.surface, tileScale: os.tileScale,
      material: os.material, speedPathId: os.speedPathId,
      customTileData:    os.customTileData,
      emissiveColor:     os.emissiveColor,
      emissiveIntensity: os.emissiveIntensity,
      opacity:           os.opacity,
      presentStlb64:     os.presentStlb64,
      presentColor:      os.presentColor,
    });
    const [mesh, edges] = buildObstacleObjects(data);
    data.mesh = mesh; data.edges = edges;
    this.addToScene(mesh, edges);
    this.sceneObjects.set(os.id, [mesh, edges]);
    this.obstacles.set(os.id, data);
    if (data.presentStlb64) this._loadPresentStl(os.id, data.presentStlb64, data.presentColor);
    this.sceneTree.add(os.id, data.name, '⬛', 'octagon-base', {
      addChildButtons: [
        { label:'↻+', title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(os.id,'obstacle'); this.addRotation([os.id],['obstacle'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'✦+', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(os.id) },
      ],
    });
  }

  /* ── Footing methods ─────────────────────────────────────────────────── */

  private addFooting(): void {
    this.captureUndo();
    const id = `footing-${++this.footingSeq}`;
    const data = defaultFooting(`Footing ${this.footingSeq}`, id, this.baseConfig.height);
    const [mesh, edges] = buildFootingObjects(data, this.baseConfig.height);
    data.mesh = mesh; data.edges = edges;
    this.addToScene(mesh, edges);
    this.sceneObjects.set(id, [mesh, edges]);
    this.footings.set(id, data);
    this.sceneTree.add(id, data.name, '⬢', 'octagon-base', {
      addChildButtons: [
        { label:'✦+', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(id) },
      ],
    });
    this._applyViewMode();
    this.saveArena();
  }

  private removeFooting(id: string): void {
    const f = this.footings.get(id); if (!f) return;
    this._disposeFooting(f);
    this._disposePresentMesh(id);
    this.footings.delete(id);
    this.saveArena();
  }

  private _disposeFooting(f: BaseFootingData): void {
    if (f.mesh) { this.removeFromScene(f.mesh); f.mesh.geometry.dispose(); (f.mesh.material as THREE.Material).dispose(); }
    if (f.edges) { this.removeFromScene(f.edges); f.edges.geometry.dispose(); (f.edges.material as THREE.Material).dispose(); }
    this.sceneObjects.delete(f.id);
  }

  private _restoreFootingSave(fs: BaseFootingSave): void {
    const data = defaultFooting(fs.name, fs.id, this.baseConfig.height);
    Object.assign(data, {
      shape: fs.shape,
      dimX: fs.dimX, dimY: fs.dimY, dimZ: fs.dimZ,
      basePosX: fs.basePosX, basePosZ: fs.basePosZ, baseRotY: fs.baseRotY, posY: fs.posY,
      color: fs.color, surface: fs.surface,
      customTileData:    fs.customTileData,
      tileScale:         fs.tileScale,
      emissiveColor:     fs.emissiveColor,
      emissiveIntensity: fs.emissiveIntensity,
      opacity:           fs.opacity,
      presentStlb64:     fs.presentStlb64,
      presentColor:      fs.presentColor,
    });
    const [mesh, edges] = buildFootingObjects(data, this.baseConfig.height);
    data.mesh = mesh; data.edges = edges;
    this.addToScene(mesh, edges);
    this.sceneObjects.set(fs.id, [mesh, edges]);
    this.footings.set(fs.id, data);
    if (data.presentStlb64) this._loadPresentStl(fs.id, data.presentStlb64, data.presentColor);
    this.sceneTree.add(fs.id, data.name, '⬢', 'octagon-base', {
      addChildButtons: [
        { label:'✦+', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(fs.id) },
      ],
    });
  }

  /* ── Trap methods ────────────────────────────────────────────────────── */

  private addTrap(parentId: string, parentType: 'arena' | 'base'): void {
    this.captureUndo();
    const id = `trap-${++this.trapSeq}`;
    const data = defaultTrap(`Trap ${this.trapSeq}`, id, parentId, parentType);
    const surfY = this._getTrapSurfY(data);
    const [mesh, edges, variantMesh] = buildTrapObjects(data, surfY);
    data.mesh = mesh; data.edges = edges; data.variantMesh = variantMesh;
    const objs: THREE.Object3D[] = [mesh, edges];
    if(variantMesh) objs.push(variantMesh);
    this.addToScene(...objs);
    this.sceneObjects.set(id, objs);
    this.traps.set(id, data);
    const parentTreeId = parentType === 'base' ? 'octagon-base' : parentId;
    this.sceneTree.add(id, data.name, '⚡', parentTreeId, {
      addChildButtons: [
        { label:'🧱+', title:'Add wall',          onClick:()=>this.addWall(id, 'trap') },
        { label:'↻+',  title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(id,'trap'); this.addRotation([id],['trap'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'⤻+',  title:'Add jump link',   className:'sl-btn',  onClick:()=>this._addJumpLink(id,'trap') },
        { label:'✦+',  title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(id) },
        { label:'✧+',  title:'Add particle effect',className:'zone-btn',onClick:()=>this._addSubNodeParticle(id) },
      ],
    });
    if (parentType === 'arena') this._autoLinkTrapSpeedLine(id, parentId);
    this.saveArena();
  }

  private removeTrap(id: string): void {
    const trap = this.traps.get(id); if(!trap) return;
    // Clear back-ref on the linked SL
    if (trap.linkedSpeedLineId) {
      const sl = this.speedLines.get(trap.linkedSpeedLineId);
      if (sl) sl.linkedTrapId = null;
    }
    this._disposeTrap(trap);
    this.traps.delete(id);
    this.saveArena();
  }

  private _disposeTrap(trap: TrapData): void {
    // Clean up any walls parented to this trap
    for(const wall of [...this.walls.values()]){
      if(wall.parentType==='trap' && wall.parentId===trap.id){
        this._disposeWall(wall);
        this.walls.delete(wall.id);
      }
    }
    this.removeFromScene(trap.mesh, trap.edges);
    trap.mesh.geometry.dispose();
    (trap.mesh.material as THREE.Material).dispose();
    trap.edges.geometry.dispose();
    (trap.edges.material as THREE.Material).dispose();
    if(trap.variantMesh){
      this.removeFromScene(trap.variantMesh);
      trap.variantMesh.geometry.dispose();
      (trap.variantMesh.material as THREE.Material).dispose();
    }
    this.sceneObjects.delete(trap.id);
  }

  private _getTrapSurfY(trap: TrapData): number {
    return trapSurfY(trap, this.arenas, this.baseConfig.height);
  }

  private _restoreTrapSave(ts: TrapSave): void {
    const data = defaultTrap(ts.name, ts.id, ts.parentId, ts.parentType);
    Object.assign(data, {
      shape: ts.shape, variant: ts.variant, effect: ts.effect,
      dimX: ts.dimX, dimZ: ts.dimZ, rotY: ts.rotY,
      posR: ts.posR, posAngle: ts.posAngle, basePosX: ts.basePosX, basePosZ: ts.basePosZ,
      forceX: ts.forceX, forceY: ts.forceY, forceZ: ts.forceZ,
      damageFactor: ts.damageFactor, healFactor: ts.healFactor, freezeDuration: ts.freezeDuration,
      buffSurface: ts.buffSurface,
      pitShape: ts.pitShape, pitRadiusX: ts.pitRadiusX, pitRadiusZ: ts.pitRadiusZ,
      pitDepth: ts.pitDepth, pitSides: ts.pitSides, pitStarInner: ts.pitStarInner,
      isPeriodic: ts.isPeriodic, safeInterval: ts.safeInterval, unsafeInterval: ts.unsafeInterval,
      activationLimit: ts.activationLimit, speedPathId: ts.speedPathId,
      durationTiers: ts.durationTiers.map(d=>({...d})),
      color: ts.color, surface: ts.surface, tileScale: ts.tileScale,
      baseMaterial:      ts.baseMaterial,
      customTileData:    ts.customTileData,
      emissiveColor:     ts.emissiveColor,
      emissiveIntensity: ts.emissiveIntensity,
      presentStlb64:     ts.presentStlb64,
      presentColor:      ts.presentColor,
      linkedSpeedLineId: ts.linkedSpeedLineId ?? null,
      eqRingCount:       ts.eqRingCount       ?? 3,
      eqSegmentsPerRing: ts.eqSegmentsPerRing ?? 6,
      eqMaxElevationCm:  ts.eqMaxElevationCm  ?? 5,
      eqElevationMode:   (ts.eqElevationMode  ?? 'random') as TrapData['eqElevationMode'],
      eqRingRanges:      ts.eqRingRanges      ?? [0.3, 0.7, 1.0],
      eqPermanent:       ts.eqPermanent       ?? false,
      eqFadeCycles:      ts.eqFadeCycles      ?? 3,
      eqPulseMode:       (ts.eqPulseMode      ?? 'triggered') as TrapData['eqPulseMode'],
      eqPulseIntervalMs: ts.eqPulseIntervalMs ?? 2000,
      eqPulseWidthMs:    ts.eqPulseWidthMs    ?? 1000,
      rpmSpeed:          ts.rpmSpeed          ?? 180,
      rpmEffect:         (ts.rpmEffect        ?? 'tangential') as TrapData['rpmEffect'],
      rpmRange:          ts.rpmRange          ?? 0,
      rpmMatchSpin:      ts.rpmMatchSpin      ?? false,
      rpmForceScale:     ts.rpmForceScale     ?? 1.0,
      rpmPulseMode:      (ts.rpmPulseMode     ?? 'continuous') as TrapData['rpmPulseMode'],
      rpmPulseIntervalMs:ts.rpmPulseIntervalMs?? 0,
      rpmPulseWidthMs:   ts.rpmPulseWidthMs   ?? 0,
      projLaunchMode:    (ts.projLaunchMode   ?? 'single') as TrapData['projLaunchMode'],
      projCount:         ts.projCount         ?? 1,
      projSpreadAngleDeg:ts.projSpreadAngleDeg?? 30,
      projBurstCount:    ts.projBurstCount    ?? 3,
      projBurstDelayMs:  ts.projBurstDelayMs  ?? 100,
      projLaunchDelayMs: ts.projLaunchDelayMs ?? 0,
      projLaunchAngleDeg:ts.projLaunchAngleDeg?? 0,
      projRandomizeAngle:ts.projRandomizeAngle?? false,
      projPattern:       (ts.projPattern      ?? 'ring') as TrapData['projPattern'],
      projPatternCount:  ts.projPatternCount  ?? 6,
      projConfig:        ts.projConfig ? { ...defaultProjectileConfig(), ...ts.projConfig } : defaultProjectileConfig(),
      projPulseMode:     (ts.projPulseMode    ?? 'triggered') as TrapData['projPulseMode'],
      projPulseIntervalMs:ts.projPulseIntervalMs?? 3000,
      projPlateSpin:     ts.projPlateSpin     ?? 0,
    });
    const surfY = this._getTrapSurfY(data);
    const [mesh, edges, variantMesh] = buildTrapObjects(data, surfY);
    data.mesh = mesh; data.edges = edges; data.variantMesh = variantMesh;
    const objs: THREE.Object3D[] = [mesh, edges];
    if(variantMesh) objs.push(variantMesh);
    this.addToScene(...objs);
    this.sceneObjects.set(ts.id, objs);
    this.traps.set(ts.id, data);
    if (data.presentStlb64) this._loadPresentStl(ts.id, data.presentStlb64, data.presentColor);
    const parentTreeId = ts.parentType === 'base' ? 'octagon-base' : ts.parentId;
    this.sceneTree.add(ts.id, data.name, '⚡', parentTreeId, {
      addChildButtons: [
        { label:'🧱+', title:'Add wall',           onClick:()=>this.addWall(ts.id, 'trap') },
        { label:'↻+',  title:'Add rotation',    className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(ts.id,'trap'); this.addRotation([ts.id],['trap'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'⤻+',  title:'Add jump link',   className:'sl-btn',   onClick:()=>this._addJumpLink(ts.id,'trap') },
        { label:'✦+',  title:'Add presentation', className:'pit-btn',  onClick:()=>this._addSubNodePresent(ts.id) },
        { label:'✧+',  title:'Add particle effect',className:'zone-btn',onClick:()=>this._addSubNodeParticle(ts.id) },
      ],
    });
    // Restore trap-parented walls
    for(const ws of ts.walls) this._restoreWallSave(ws);
  }

  /* ── Portal methods ──────────────────────────────────────────────────── */

  private addPortal(parentId: string, parentType: 'arena' | 'base'): void {
    this.captureUndo();
    const id = `portal-${++this.portalSeq}`;
    const data = defaultPortal(`Portal ${this.portalSeq}`, id, parentId, parentType);
    const surfY = this._getPortalSurfY(data);
    const [mesh, edges, ringMesh] = buildPortalObjects(data, surfY);
    data.mesh = mesh; data.edges = edges; data.ringMesh = ringMesh;
    const objs: THREE.Object3D[] = [mesh, edges];
    if(ringMesh) objs.push(ringMesh);
    this.addToScene(...objs);
    this.sceneObjects.set(id, objs);
    this.portals.set(id, data);
    const parentTreeId = parentType === 'base' ? 'octagon-base' : parentId;
    this.sceneTree.add(id, data.name, '◉', parentTreeId, {
      addChildButtons: [
        { label:'✦+', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(id) },
      ],
    });
    this.saveArena();
  }

  private removePortal(id: string): void {
    const portal = this.portals.get(id); if(!portal) return;
    this._disposePortal(portal);
    this.portals.delete(id);
    this.saveArena();
  }

  private _disposePortal(portal: PortalData): void {
    this.removeFromScene(portal.mesh, portal.edges);
    portal.mesh.geometry.dispose();
    (portal.mesh.material as THREE.Material).dispose();
    portal.edges.geometry.dispose();
    (portal.edges.material as THREE.Material).dispose();
    if(portal.ringMesh){
      this.removeFromScene(portal.ringMesh);
      portal.ringMesh.geometry.dispose();
      (portal.ringMesh.material as THREE.Material).dispose();
    }
    this.sceneObjects.delete(portal.id);
  }

  private _getPortalSurfY(portal: PortalData): number {
    return portalSurfY(portal, this.arenas, this.baseConfig.height);
  }

  private _restorePortalSave(ps: PortalSave): void {
    const data = defaultPortal(ps.name, ps.id, ps.parentId, ps.parentType);
    Object.assign(data, {
      shape: ps.shape, dimX: ps.dimX, dimZ: ps.dimZ, rotY: ps.rotY,
      posR: ps.posR, posAngle: ps.posAngle, basePosX: ps.basePosX, basePosZ: ps.basePosZ,
      destType: ps.destType, destPortalId: ps.destPortalId, destArenaId: ps.destArenaId,
      destPosX: ps.destPosX, destPosY: ps.destPosY, destPosZ: ps.destPosZ,
      exitVelScale: ps.exitVelScale, exitRotY: ps.exitRotY, isBidirectional: ps.isBidirectional,
      color: ps.color, glowColor: ps.glowColor,
      surface:       ps.surface,
      customTileData:ps.customTileData,
      tileScale:     ps.tileScale,
      presentStlb64: ps.presentStlb64,
      presentColor:  ps.presentColor,
    });
    const surfY = this._getPortalSurfY(data);
    const [mesh, edges, ringMesh] = buildPortalObjects(data, surfY);
    data.mesh = mesh; data.edges = edges; data.ringMesh = ringMesh;
    const objs: THREE.Object3D[] = [mesh, edges];
    if(ringMesh) objs.push(ringMesh);
    this.addToScene(...objs);
    this.sceneObjects.set(ps.id, objs);
    this.portals.set(ps.id, data);
    if (data.presentStlb64) this._loadPresentStl(ps.id, data.presentStlb64, data.presentColor);
    const parentTreeId = ps.parentType === 'base' ? 'octagon-base' : ps.parentId;
    this.sceneTree.add(ps.id, data.name, '◉', parentTreeId, {
      addChildButtons: [
        { label:'✦+', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(ps.id) },
      ],
    });
  }

  /* ── Jump Link methods ───────────────────────────────────────────────── */

  private _addJumpLink(srcParentId: string, srcParentType: JumpLinkParentType): void {
    this.captureUndo();
    const id = `jl-${++this.jumpLinkSeq}`;
    const data = defaultJumpLink(`Jump Link ${this.jumpLinkSeq}`, id, srcParentId, srcParentType);
    this._buildJumpLinkGeometry(data);
    this.jumpLinks.set(id, data);
    const treeParent = srcParentType === 'base' ? 'octagon-base' : srcParentId;
    this.sceneTree.add(id, data.name, '⤻', treeParent);
    this.saveArena();
  }

  private _buildJumpLinkGeometry(data: JumpLinkData): void {
    const result = buildJumpLinkObjects(
      data, this.arenas, this.obstacles, this.traps,
      jlid => this.speedLines.get(jlid), this.baseConfig.height,
    );
    data.sourceMesh  = result.sourceMesh;
    data.destMesh    = result.destMesh;
    data.arcLine     = result.arcLine;
    data.arrowMeshes = result.arrowMeshes;
    const objs: THREE.Object3D[] = [result.sourceMesh, result.destMesh, result.arcLine, ...result.arrowMeshes];
    this.addToScene(...objs);
    this.sceneObjects.set(data.id, objs);
  }

  private _applyJL(jl: JumpLinkData): void {
    const prev = this.sceneObjects.get(jl.id) ?? [];
    for (const obj of prev) this.removeFromScene(obj);
    applyJumpLink(jl, this.arenas, this.obstacles, this.traps,
      jlid => this.speedLines.get(jlid), this.baseConfig.height);
    const objs: THREE.Object3D[] = [jl.sourceMesh, jl.destMesh, jl.arcLine, ...jl.arrowMeshes];
    this.addToScene(...objs);
    this.sceneObjects.set(jl.id, objs);
  }

  private _disposeJumpLink(jl: JumpLinkData): void {
    const objs = this.sceneObjects.get(jl.id) ?? [];
    for (const obj of objs) this.removeFromScene(obj);
    jl.sourceMesh.geometry.dispose();
    (jl.sourceMesh.material as THREE.Material).dispose();
    jl.destMesh.geometry.dispose();
    (jl.destMesh.material as THREE.Material).dispose();
    jl.arcLine.geometry.dispose();
    (jl.arcLine.material as THREE.Material).dispose();
    for (const m of jl.arrowMeshes) {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
    jl.arrowMeshes = [];
    this.sceneObjects.delete(jl.id);
  }

  private _removeJumpLink(id: string): void {
    const jl = this.jumpLinks.get(id); if (!jl) return;
    this._disposeJumpLink(jl);
    this.jumpLinks.delete(id);
    this.sceneTree.remove(id);
    this.saveArena();
  }

  private _restoreJumpLinkSave(js: JumpLinkSave): void {
    const data = jumpLinkFromSave(js);
    this._buildJumpLinkGeometry(data);
    this.jumpLinks.set(js.id, data);
    const treeParent = data.src.parentType === 'base' ? 'octagon-base' : data.src.parentId;
    this.sceneTree.add(js.id, data.name, '⤻', treeParent);
  }

  /** Returns Map<id, name> of all speed lines — used to populate speed path dropdowns. */
  private _getSpeedLineNames(): Map<string, string> {
    return new Map([...this.speedLines.entries()].map(([slId, sl])=>[slId, sl.name]));
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
      ? resolveStartPose(bridge.startRef, this.arenas, this.walls, 0)
      : { pos: DEFAULT_START_POSE.pos.clone(), dir: DEFAULT_START_POSE.dir.clone(), up: DEFAULT_START_POSE.up.clone() };
    for(const sid of bridge.segmentIds){
      if(sid===seg.id) break;
      const prev=this.segments.get(sid);
      if(prev) pose=computeSegmentEndPose(prev, pose, bridge.section);
    }
    return pose;
  }

  private applySegment(seg: BridgeSegmentData): void {
    const bridge=this.bridges.get(seg.bridgeId); if(!bridge) return;
    const scene=this.getScene(); if(!scene) return;
    const startPose=this._segmentStartPose(seg);

    const sec = bridge.section;
    const color: number = seg.color ?? sec.color;
    const surface: SurfaceType = seg.surface ?? sec.surface;

    const geo  = buildSegmentDeckGeometry(seg, startPose, sec);
    const eGeo = buildSegmentEdgeGeometry(seg, startPose, sec);

    // Compute bounding-box center — pivot for tick-based animation
    geo.computeBoundingBox();
    const center = new THREE.Vector3();
    geo.boundingBox!.getCenter(center);
    seg._animCenter.copy(center);
    const negCenter = center.clone().negate();

    // Ensure animation pivot group exists
    if (!seg._animPivot) {
      seg._animPivot = new THREE.Group();
      // Reparent any existing mesh/edges from bridge.group into the pivot
      if (seg.mesh)  { bridge.group.remove(seg.mesh);  seg._animPivot.add(seg.mesh); }
      if (seg.edges) { bridge.group.remove(seg.edges); seg._animPivot.add(seg.edges); }
      bridge.group.add(seg._animPivot);
      scene.add(bridge.group);
    }
    seg._animPivot.position.copy(center);
    if (!seg.animEnabled) seg._animPivot.rotation.set(0, 0, 0);

    const segMat = buildSurfaceMaterial({
      color, surface, customTileData: sec.customTileData, tileScale: sec.tileScale,
      transparent: sec.opacity < 1, opacity: sec.opacity,
    });
    (segMat as THREE.MeshStandardMaterial).emissive.setHex(sec.emissiveColor);
    (segMat as THREE.MeshStandardMaterial).emissiveIntensity = sec.emissiveIntensity;
    (segMat as THREE.MeshStandardMaterial).depthWrite = sec.opacity >= 1;

    if(seg.mesh){
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
    if(seg.edges){
      seg.edges.geometry.dispose();
      seg.edges.geometry = eGeo;
      (seg.edges.material as THREE.LineBasicMaterial).color.copy(edgeCol);
      seg.edges.position.copy(negCenter);
    } else {
      seg.edges = new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({ color: edgeCol }));
      seg.edges.position.copy(negCenter);
      seg._animPivot.add(seg.edges);
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
      presentStlb64: null, presentColor: 0xaaaaaa,
      linkedSpeedLineId: null,
      group,
    };
    this.bridges.set(bid, bridge);
    const scene=this.getScene(); if(scene) scene.add(group);
    this.sceneTree.add(bid, name, '🌉', 'octagon-base', {
      addChildButtons:[
        {label:'Seg+',title:'Add segment',      className:'zone-btn',onClick:()=>this.addSegment(bid,'straight')},
        {label:'W+',  title:'Add wall',         className:'pit-btn', onClick:()=>this.addWall(bid,'bridge')},
        {label:'✦+',  title:'Add presentation', className:'sl-btn',  onClick:()=>this._addSubNodePresent(bid)},
      ],
    });
    // Add a default straight segment
    this.addSegment(bid, 'straight');
    this.saveArena();
  }

  private removeBridge(id: string): void {
    const bridge=this.bridges.get(id); if(!bridge) return;
    // Clear back-ref on the linked SL
    if (bridge.linkedSpeedLineId) {
      const sl = this.speedLines.get(bridge.linkedSpeedLineId);
      if (sl) sl.linkedBridgeId = null;
    }
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
    if (['loop','return_loop','exit_loop','corkscrew','hairpin'].includes(type)) {
      const b = this.bridges.get(bridgeId);
      if (b) {
        const arenaRef = b.startRef?.type === 'arena' ? b.startRef.id : null;
        if (arenaRef) this._autoLinkSpeedLine(bridgeId, type, arenaRef);
      }
    }
    this.saveArena();
  }

  private removeSegment(id: string): void {
    const seg=this.segments.get(id); if(!seg) return;
    const bridge=this.bridges.get(seg.bridgeId); if(!bridge) return;
    const idx=bridge.segmentIds.indexOf(id);
    if(idx<0) return;
    this.captureUndo();
    if(seg.mesh){ seg.mesh.geometry.dispose();(seg.mesh.material as THREE.Material).dispose(); seg.mesh=null; }
    if(seg.edges){ seg.edges.geometry.dispose();(seg.edges.material as THREE.Material).dispose(); seg.edges=null; }
    if(seg._animPivot){ bridge.group.remove(seg._animPivot); seg._animPivot=null; }
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

  /* ── Rotation animation tick ─────────────────────────────────────────── */

  protected override onTick(dtMs: number): void {
    const dt = dtMs / 1000;

    // Bridge segment animation ticks (tick-based offset/return)
    const DEG2RAD_ANIM = Math.PI / 180;
    for (const seg of this.segments.values()) {
      if (!seg.animEnabled || !seg._animPivot) continue;
      seg._animTimer += dtMs;
      const effectiveTime = seg._animTimer - seg.animStartMs;
      if (effectiveTime < 0) continue;
      const interval = Math.max(1, seg.animIntervalMs);
      const hold = Math.min(seg.animHoldMs, interval);
      const phase = effectiveTime % interval;
      if (phase < hold) {
        seg._animPivot.position.set(
          seg._animCenter.x + seg.animOffsetX,
          seg._animCenter.y + seg.animOffsetY,
          seg._animCenter.z + seg.animOffsetZ,
        );
        seg._animPivot.rotation.set(
          seg.animRotX * DEG2RAD_ANIM,
          seg.animRotY * DEG2RAD_ANIM,
          seg.animRotZ * DEG2RAD_ANIM,
        );
      } else {
        seg._animPivot.position.copy(seg._animCenter);
        seg._animPivot.rotation.set(0, 0, 0);
      }
    }

    // Earthquake + RPM + projectile plate spin ticks
    for (const trap of this.traps.values()) {
      if (trap.effect === 'earthquake') this._tickEarthquakeTrap(trap, dt);
      if (trap.effect === 'rpm')        this._tickRPMTrap(trap, dt);
      if (trap.effect === 'projectile' && trap.projPlateSpin !== 0) {
        const omega = trap.projPlateSpin * (Math.PI / 180);
        trap.mesh.rotation.y  += omega * dt;
        trap.edges.rotation.y  = trap.mesh.rotation.y;
      }
    }

    // Projectile bullets
    if (!this._projectileMgr) {
      const scene = this.getScene();
      if (scene) {
        this._projectileMgr = new ProjectileManager(scene, () => this.speedLines);
      }
    }
    this._projectileMgr?.tick(dt);
    for (const arena of this.arenas.values()) {
      if (arena.particleSystem) arena.particleSystem.tick(dt);
      if (arena.weatherSystem)  arena.weatherSystem.tick(dt);
    }
    for (const zone of this.zones.values()) {
      if (zone.particleSystem) zone.particleSystem.tick(dt);
    }
    for (const pit of this.pits.values()) {
      if (pit.particleSystem) pit.particleSystem.tick(dt);
    }
    for (const rot of this.rotations.values()) {
      if (!rot.enabled || !rot.pivotGroup) continue;
      if (rot.mode === 'continuous') {
        rot.currentAngle += rot.speed * rot.direction * dt;
      } else {
        const t = performance.now() / 1000;
        rot.currentAngle = rot.oscAmplitude *
          Math.sin(TWO_PI * rot.oscFrequency * t + rot.oscPhase);
      }
      rot.pivotGroup.rotation.y = DEG2RAD * rot.currentAngle;
      this._applyFloorCorrection(rot);
      // Bridge snap rules
      for (const rule of rot.snapRules) {
        const bridge = this.bridges.get(rule.bridgeId);
        if (bridge) {
          const a = ((rot.currentAngle % 360) + 360) % 360;
          bridge.group.visible = a >= rule.minDeg && a <= rule.maxDeg;
        }
      }
    }

    // Wall auto-rotation on arena rim
    const t = performance.now() / 1000;
    for (const wall of this.walls.values()) {
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

    this._spawnMgr?.tick(dtMs);
  }

  // ── Trap tick helpers (earthquake / RPM) ───────────────────────────────

  private _tickEarthquakeTrap(trap: TrapData, dt: number): void {
    if (!trap._eqPhase) {
      if (trap.eqPulseMode === 'continuous') {
        this._eqStartPulse(trap);
      } else if (trap.eqPulseMode === 'periodic') {
        trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
        if (trap._eqTimer >= trap.eqPulseIntervalMs) {
          trap._eqTimer = 0; this._eqStartPulse(trap);
        }
      }
      return;
    }
    const wMs = Math.max(100, trap.eqPulseWidthMs);
    if (trap._eqPhase === 'rising') {
      trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
      const t = Math.min(1, trap._eqTimer / (wMs * 0.3));
      this._eqLerp(trap, t);
      if (t >= 1) { trap._eqPhase = 'active'; trap._eqTimer = 0; }
    } else if (trap._eqPhase === 'active') {
      if (trap.eqPermanent) return;
      trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
      if (trap._eqTimer >= wMs * 0.4) { trap._eqPhase = 'fading'; trap._eqTimer = 0; }
    } else if (trap._eqPhase === 'fading') {
      trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
      const t = Math.min(1, trap._eqTimer / (wMs * 0.3));
      this._eqLerp(trap, 1 - t);
      if (t >= 1) {
        trap._eqPhase = undefined; trap._eqTimer = 0;
        trap._eqCycleCount = (trap._eqCycleCount ?? 0) + 1;
        if (trap.eqPulseMode === 'continuous' && (trap.eqFadeCycles === 0 || (trap._eqCycleCount ?? 0) < trap.eqFadeCycles)) {
          this._eqStartPulse(trap);
        }
      }
    }
    updateEarthquakeMeshHeights(trap);
  }

  private _eqStartPulse(trap: TrapData): void {
    const rings = Math.max(1, trap.eqRingCount), segs = Math.max(3, trap.eqSegmentsPerRing);
    const total = rings * segs;
    if (!trap._eqTargetHeights || trap._eqTargetHeights.length !== total) {
      trap._eqTargetHeights  = new Array(total).fill(0);
      trap._eqCurrentHeights = new Array(total).fill(0);
    }
    for (let r = 0; r < rings; r++) {
      const rm = trap.eqRingRanges[r] ?? 1;
      for (let s = 0; s < segs; s++) {
        const idx = r * segs + s;
        let h = 0;
        switch (trap.eqElevationMode) {
          case 'wave':        h = trap.eqMaxElevationCm * rm * Math.sin((s / segs) * Math.PI * 2); break;
          case 'ripple':      h = trap.eqMaxElevationCm * rm * Math.sin((r / rings) * Math.PI * 4); break;
          case 'checkerboard': h = trap.eqMaxElevationCm * rm * ((r + s) % 2 === 0 ? 1 : -1); break;
          default:            h = trap.eqMaxElevationCm * rm * (Math.random() * 2 - 1); break;
        }
        trap._eqTargetHeights[idx] = h;
      }
    }
    trap._eqPhase = 'rising'; trap._eqTimer = 0;
  }

  private _eqLerp(trap: TrapData, t: number): void {
    if (!trap._eqCurrentHeights || !trap._eqTargetHeights) return;
    for (let i = 0; i < trap._eqCurrentHeights.length; i++) {
      trap._eqCurrentHeights[i] = (trap._eqTargetHeights[i] ?? 0) * t;
    }
  }

  private _tickRPMTrap(trap: TrapData, dt: number): void {
    if (!trap.variantMesh) return;
    const omega = (trap.rpmSpeed ?? 0) * (Math.PI / 180);
    trap._rpmCurrentAngle = ((trap._rpmCurrentAngle ?? 0) + omega * dt) % (Math.PI * 2);
    trap.variantMesh.rotation.y = trap._rpmCurrentAngle;
    const mat = trap.variantMesh.material as THREE.MeshStandardMaterial;
    if (mat && 'emissiveIntensity' in mat) {
      mat.emissiveIntensity = Math.min(1, Math.abs(trap.rpmSpeed ?? 0) / 360);
    }
  }

  /** For trap/zone members: after pivotGroup rotates, fix Y to follow arena bowl surface. */
  private _applyFloorCorrection(rot: RotationData): void {
    const pg = rot.pivotGroup; if (!pg) return;
    const wp = new THREE.Vector3();
    for (const mid of rot.memberIds) {
      const trap = this.traps.get(mid);
      if (trap) {
        let arenaForTrap: ArenaData | undefined;
        if (trap.parentType === 'arena') arenaForTrap = this.arenas.get(trap.parentId);
        if (!arenaForTrap) continue;
        trap.mesh.getWorldPosition(wp);
        const { alx, alz } = worldToArenaLocal(wp.x, wp.z, arenaForTrap);
        const surfY = arenaSurfaceYAtArenaLocal(arenaForTrap, alx, alz);
        const localY = surfY + TRAP_PLATE_HEIGHT / 2 - pg.position.y;
        trap.mesh.position.y = localY;
        trap.edges.position.y = localY;
        if (trap.variantMesh) trap.variantMesh.position.y = localY;
        continue;
      }
      const zone = this.zones.get(mid);
      if (zone) {
        const arenaForZone = this.arenas.get(zone.parentArenaId); if (!arenaForZone) continue;
        zone.mesh.getWorldPosition(wp);
        const { alx, alz } = worldToArenaLocal(wp.x, wp.z, arenaForZone);
        const surfY = arenaSurfaceYAtArenaLocal(arenaForZone, alx, alz);
        const localY = surfY - pg.position.y;
        zone.mesh.position.y = localY;
        zone.edges.position.y = localY;
        if (zone.seamMesh) zone.seamMesh.position.y = localY;
      }
    }
  }

  /** Returns all Three.js scene objects belonging to a node. */
  private _getMemberObjects(nodeId: string): THREE.Object3D[] {
    const objs: THREE.Object3D[] = [];
    const trap = this.traps.get(nodeId);
    if (trap) { objs.push(trap.mesh, trap.edges); if (trap.variantMesh) objs.push(trap.variantMesh); return objs; }
    const obs = this.obstacles.get(nodeId);
    if (obs) { return [obs.mesh, obs.edges]; }
    const zone = this.zones.get(nodeId);
    if (zone) { objs.push(zone.mesh, zone.edges); if (zone.seamMesh) objs.push(zone.seamMesh); return objs; }
    const wall = this.walls.get(nodeId);
    if (wall) { if (wall.mesh) objs.push(wall.mesh); if (wall.edges) objs.push(wall.edges); return objs; }
    return objs;
  }

  private _nodeTypeOf(id: string): RotationNodeType | undefined {
    if (this.traps.has(id))     return 'trap';
    if (this.obstacles.has(id)) return 'obstacle';
    if (this.zones.has(id))     return 'zone';
    if (this.walls.has(id))     return 'wall';
    return undefined;
  }

  private _defaultPivotForMember(nodeId: string, nodeType: RotationNodeType): { pivotX: number; pivotY: number; pivotZ: number } {
    if (nodeType === 'trap') {
      const trap = this.traps.get(nodeId);
      if (trap) {
        const surfY = this._getTrapSurfY(trap);
        if (trap.parentType === 'arena') {
          const arena = this.arenas.get(trap.parentId);
          if (arena) {
            const { lx, lz } = polarToLocalXZ(trap.posR, trap.posAngle);
            const c = Math.cos(arena.rotY * DEG2RAD); const s = Math.sin(arena.rotY * DEG2RAD);
            return { pivotX: arena.posX + lx * c - lz * s, pivotY: surfY, pivotZ: arena.posZ + lx * s + lz * c };
          }
        }
        return { pivotX: trap.basePosX, pivotY: surfY, pivotZ: trap.basePosZ };
      }
    }
    if (nodeType === 'obstacle') {
      const obs = this.obstacles.get(nodeId);
      if (obs) return { pivotX: obs.posX, pivotY: obs.posY, pivotZ: obs.posZ };
    }
    if (nodeType === 'zone') {
      const zone = this.zones.get(nodeId);
      if (zone) {
        const arena = this.arenas.get(zone.parentArenaId);
        if (arena) {
          const { lx, lz } = polarToLocalXZ(zone.posR, zone.posAngle);
          const c = Math.cos(arena.rotY * DEG2RAD); const s = Math.sin(arena.rotY * DEG2RAD);
          const wx = arena.posX + lx * c - lz * s;
          const wz = arena.posZ + lx * s + lz * c;
          return { pivotX: wx, pivotY: arenaSurfaceYAtArenaLocal(arena, lx, lz), pivotZ: wz };
        }
      }
    }
    if (nodeType === 'wall') {
      const wall = this.walls.get(nodeId);
      if (wall) {
        if (wall.parentType === 'arena') {
          const arena = this.arenas.get(wall.parentId);
          if (arena) return { pivotX: arena.posX, pivotY: this.baseConfig.height + arena.posY, pivotZ: arena.posZ };
        }
        return { pivotX: wall.basePosX, pivotY: this.baseConfig.height, pivotZ: wall.basePosZ };
      }
    }
    return { pivotX: 0, pivotY: this.baseConfig.height, pivotZ: 0 };
  }

  private _commonTreeParent(nodeIds: string[]): string | null {
    if (nodeIds.length === 0) return null;
    const getParent = (id: string): string | null => {
      const trap = this.traps.get(id);
      if (trap) return trap.parentType === 'base' ? 'octagon-base' : trap.parentId;
      const obs = this.obstacles.get(id); if (obs) return 'octagon-base';
      const zone = this.zones.get(id);
      if (zone) return zone.parentZoneId ?? zone.parentArenaId;
      const wall = this.walls.get(id);
      if (wall) return wall.parentType === 'base' ? 'octagon-base' : wall.parentId;
      return null;
    };
    const first = getParent(nodeIds[0]);
    if (nodeIds.every(id => getParent(id) === first)) return first;
    return null;
  }

  private addRotation(memberIds: string[], memberTypes: RotationNodeType[], pivotX: number, pivotY: number, pivotZ: number): void {
    if (memberIds.some(id => this.nodeRotationId.has(id))) return;
    this.captureUndo();
    const id   = `rot-${++this.rotationSeq}`;
    const name = memberIds.length === 1 ? `Rotate ${this.rotationSeq}` : `Group ↻ ${this.rotationSeq}`;
    const rot: RotationData = {
      id, name, memberIds, memberTypes,
      pivotX, pivotY, pivotZ,
      mode: 'continuous', speed: ROT.DEFAULT_SPEED, direction: 1,
      oscAmplitude: ROT.DEFAULT_OSC_AMP, oscFrequency: ROT.DEFAULT_OSC_FREQ, oscPhase: 0,
      enabled: true, currentAngle: 0, snapRules: [], pivotGroup: null,
    };
    const scene = this.getScene();
    if (scene) {
      const pg = new THREE.Group();
      pg.position.set(pivotX, pivotY, pivotZ);
      scene.add(pg);
      rot.pivotGroup = pg;
      for (const mid of memberIds) {
        for (const obj of this._getMemberObjects(mid)) pg.attach(obj);
      }
    }
    this.rotations.set(id, rot);
    memberIds.forEach(mid => this.nodeRotationId.set(mid, id));
    const treeParent = this._commonTreeParent(memberIds) ?? 'octagon-base';
    this.sceneTree.add(id, name, '↻', treeParent);
    this.saveArena();
  }

  private removeRotation(id: string): void {
    const rot = this.rotations.get(id); if (!rot) return;
    const scene = this.getScene();
    if (rot.pivotGroup && scene) {
      for (const mid of rot.memberIds) {
        for (const obj of this._getMemberObjects(mid)) scene.attach(obj);
      }
      scene.remove(rot.pivotGroup);
    }
    rot.memberIds.forEach(mid => this.nodeRotationId.delete(mid));
    this.rotations.delete(id);
    this.sceneTree.remove(id);
    this.saveArena();
  }

  private _removeMemberFromRotation(nodeId: string): void {
    const rotId = this.nodeRotationId.get(nodeId); if (!rotId) return;
    const rot = this.rotations.get(rotId); if (!rot) return;
    if (rot.memberIds.length <= 1) {
      this.removeRotation(rotId);
      return;
    }
    const scene = this.getScene();
    if (rot.pivotGroup && scene) {
      for (const obj of this._getMemberObjects(nodeId)) scene.attach(obj);
    }
    this.nodeRotationId.delete(nodeId);
    rot.memberIds = rot.memberIds.filter(id => id !== nodeId);
    rot.memberTypes = rot.memberTypes.filter((_, i) => rot.memberIds[i] !== nodeId);
  }

  /**
   * Called after applyTrap/applyObstacle/applyZone/applyWall for any node in a rotation.
   * The apply functions set mesh.position in scene-root coords; we need to correct to group-local.
   */
  private _afterApply(nodeId: string): void {
    const rotId = this.nodeRotationId.get(nodeId); if (!rotId) return;
    const rot = this.rotations.get(rotId); if (!rot || !rot.pivotGroup) return;
    const pg = rot.pivotGroup;
    const scene = this.getScene();
    for (const obj of this._getMemberObjects(nodeId)) {
      if (obj.parent === pg) {
        obj.position.x -= pg.position.x;
        obj.position.y -= pg.position.y;
        obj.position.z -= pg.position.z;
      } else if (obj.parent === scene && scene) {
        const nat = obj.position.clone();
        pg.add(obj);
        obj.position.set(nat.x - pg.position.x, nat.y - pg.position.y, nat.z - pg.position.z);
      }
    }
  }

  private _updateRotationPivot(rot: RotationData): void {
    const pg = rot.pivotGroup; if (!pg) return;
    pg.position.set(rot.pivotX, rot.pivotY, rot.pivotZ);
    for (const mid of rot.memberIds) {
      for (const obj of this._getMemberObjects(mid)) pg.attach(obj);
    }
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

    const topFaceMat=buildSurfaceMaterial({ color:this.baseConfig.color, surface:this.baseConfig.surface, customTileData:this.baseConfig.customTileData, tileScale:this.baseConfig.tileScale, polygonOffset:true });
    this.topFaceMesh=new THREE.Mesh(buildTopFaceGeo(sides,R,align,0,[]),topFaceMat);
    scene.add(this.topFaceMesh);

    this.sceneObjects.set('octagon-base',[this.baseMesh,this.baseEdges,this.topFaceMesh]);
    this.loadArena();

    this._envMgr = new ArenaEnvironmentManager(
      () => this.arenas,
      (arenaId, props) => this._onEnvChange(arenaId, props),
      (_arenaId, ev) => console.log('[sound]', _arenaId, ev),
    );

    const scoreHud = this.addOverlayPanel('arena-score-hud') as HTMLDivElement;
    scoreHud.style.cssText = 'position:absolute;right:calc(8*var(--mm));bottom:calc(6*var(--cm));background:rgba(0,0,0,0.75);color:#00e5ff;font-family:Orbitron,sans-serif;font-size:calc(1.4*var(--cm));padding:calc(4*var(--mm)) calc(8*var(--mm));border:1px solid rgba(0,229,255,0.4);white-space:pre;display:none;pointer-events:none;';
    this._scoreHudEl = scoreHud;

    const smCtx: SceneContext = {
      scene:          scene,
      sceneTree:      this.sceneTree,
      getBaseHeight:  () => this.baseConfig.height,
      trackObjects:   () => {},
      untrackObjects: () => {},
    };
    const smHud = this.addOverlayPanel('spawn-manager-hud');
    this._spawnMgr = new SpawnManager(
      smCtx,
      () => this.getCamera(),
      () => this.getControls(),
      () => this.arenas,
      () => this.traps,
      () => this.speedLines,
      () => this.zones,
      () => this.walls,
      smHud,
    );
    this._spawnMgrBtn = this.addTopBarButton('⚽ Spawn', 'Spawn/despawn physics test top');
    this._spawnMgrBtn.addEventListener('click', () => {
      if (this._spawnMgr?.isSpawned) this._spawnMgr.despawn();
      else this._spawnMgr?.spawn();
      this._spawnMgrBtn!.classList.toggle('active', this._spawnMgr?.isSpawned ?? false);
    });
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
    const newTopMat=buildSurfaceMaterial({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale,polygonOffset:true});
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
    // Always use buildFreeArenaMesh so non-elevated bowls keep their outer skirt
    const wp = elevated ? (arena.wallProfile === 'parabolic' || arena.wallProfile === 'spiral' ? 'parabolic' : 'straight') : 'parabolic';
    arena.mesh.geometry = buildFreeArenaMesh(pts, arena.depth, wp, 0, holes);
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

    // Sub-node routing
    if (id.startsWith('present-'))  { this._showPresentNode(id.slice(8));  return; }
    if (id.startsWith('particle-')) { this._showParticleNode(id.slice(9)); return; }
    if (id.startsWith('weather-'))  { this._showWeatherNode(id.slice(8));  return; }

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
          this.topFaceMesh!.material=buildSurfaceMaterial({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale,polygonOffset:true});
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
        ()=>{ this.captureUndo(); this._createArenaLight(arena); this.saveArena(); },
        ()=>{ this.captureUndo(); this._createArenaParticles(id,arena); this.saveArena(); },
        (cb)=>this._fileInputStl(id,arena.presentColor,cb),
        ()=>{ arena.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
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
        ()=>{
          // Preset change: regenerate segments from preset params and rebuild geometry
          this.captureUndo();
          const result = generatePresetSegments(
            sl.presetType, sl.presetParams, sl.speedRamp,
            sl.id, () => `${sl.id}-seg-${++this.slSegSeq}`,
          );
          sl.segments   = result.segments;
          sl.startDir   = result.startDir;
          sl.startR     = result.startR;
          sl.startAngle = result.startAngle;
          if (sl.presetParams.closeLoop) sl.exitBehavior = 'loop';
          this._updateSpeedLine(sl);
          this.saveArena();
        },
        undefined,
        undefined,
        () => [...this.bridges.values()],
        () => [...this.traps.values()],
      );
      return;
    }

    const wall=this.walls.get(id);
    if(wall){
      const parentArena = wall.parentType==='arena' ? this.arenas.get(wall.parentId) : undefined;
      const showW=()=>this.props.showWall(
        wall,
        ()=>{ this.captureUndo(); this.applyWall(wall); this.saveArena(); },
        ()=>{ this.captureUndo(); this.applyWall(wall); this.saveArena(); showW(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        (cb)=>this._fileInputStl(id,wall.presentColor,cb),
        ()=>{ wall.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
        parentArena,
      );
      showW();
      return;
    }

    const bridge=this.bridges.get(id);
    if(bridge){
      const arenaNames = new Map([...this.arenas.entries()].map(([aid,a])=>[aid,a.name]));
      const wallNames  = new Map([...this.walls.entries()].map(([wid,w])=>[wid,w.name]));
      const showB = () => this.props.showBridge(
        bridge, arenaNames, wallNames,
        ()=>{ this.captureUndo(); if(bridge.segmentIds.length>0) this.applyBridgeFromSegment(bridge.segmentIds[0]); this.saveArena(); showB(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        (type)=>{ this.addSegment(id, type as BridgeSegmentType); },
        (cb)=>this._fileInputStl(id,bridge.presentColor,cb),
        ()=>{ bridge.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
        () => [...this.speedLines.values()].map(s => ({ id: s.id, name: s.name })),
      );
      showB();
      return;
    }

    const seg=this.segments.get(id);
    if(seg){
      const showS = () => this.props.showBridgeSegment(
        seg,
        ()=>{ this.captureUndo(); this.applyBridgeFromSegment(seg.id); this.saveArena(); showS(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        ()=>{ showS(); },
      );
      showS();
      return;
    }

    const obstacle=this.obstacles.get(id);
    if(obstacle){
      const showO=()=>this.props.showObstacle(
        obstacle,
        ()=>{ this.captureUndo(); applyObstacle(obstacle); this.saveArena(); },
        ()=>{ this.captureUndo(); applyObstacle(obstacle); this.saveArena(); showO(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        this._getSpeedLineNames(),
        (cb)=>this._fileInputStl(id,obstacle.presentColor,cb),
        ()=>{ obstacle.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
      );
      showO();
      return;
    }

    const trap=this.traps.get(id);
    if(trap){
      const showT=()=>this.props.showTrap(
        trap,
        ()=>{ this.captureUndo(); applyTrap(trap, this._getTrapSurfY(trap)); this.saveArena(); },
        ()=>{ this.captureUndo(); applyTrap(trap, this._getTrapSurfY(trap)); this.saveArena(); showT(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        this._getSpeedLineNames(),
        (cb)=>this._fileInputStl(id,trap.presentColor,cb),
        ()=>{ trap.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
        () => [...this.speedLines.values()].map(s => ({ id: s.id, name: s.name })),
      );
      showT();
      return;
    }

    const portal=this.portals.get(id);
    if(portal){
      const arenaNames = new Map([...this.arenas.entries()].map(([aid,a])=>[aid,a.name]));
      const portalNames = new Map([...this.portals.entries()].map(([pid,p])=>[pid,p.name]));
      const showPo=()=>this.props.showPortal(
        portal, arenaNames, portalNames,
        ()=>{ this.captureUndo(); applyPortal(portal, this._getPortalSurfY(portal)); this.saveArena(); },
        ()=>{ this.captureUndo(); applyPortal(portal, this._getPortalSurfY(portal)); this.saveArena(); showPo(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        (cb)=>this._fileInputStl(id,portal.presentColor,cb),
        ()=>{ portal.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
      );
      showPo();
      return;
    }

    const jl=this.jumpLinks.get(id);
    if(jl){
      const arenaNames    = new Map([...this.arenas.entries()].map(([aid,a])=>[aid,a.name]));
      const obstacleNames = new Map([...this.obstacles.entries()].map(([oid,o])=>[oid,o.name]));
      const trapNames     = new Map([...this.traps.entries()].map(([tid,t])=>[tid,t.name]));
      const slNames       = new Map([...this.speedLines.entries()].map(([slid,sl])=>[slid,sl.name]));
      const showJL=()=>this.props.showJumpLink(
        jl, arenaNames, obstacleNames, trapNames, slNames,
        ()=>{ this.captureUndo(); this._applyJL(jl); this.saveArena(); },
        ()=>{ this.captureUndo(); this._applyJL(jl); this.saveArena(); showJL(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); jl.name=name; this.saveArena(); },
      );
      showJL();
      return;
    }

    const footing=this.footings.get(id);
    if(footing){
      const showF=()=>this.props.showFooting(
        footing,
        this.baseConfig.height,
        ()=>{ this.captureUndo(); applyFooting(footing, this.baseConfig.height); this.saveArena(); },
        ()=>{ this.captureUndo(); applyFooting(footing, this.baseConfig.height); this.saveArena(); showF(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        (cb)=>this._fileInputStl(id,footing.presentColor,cb),
        ()=>{ footing.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
      );
      showF();
      return;
    }

    const rotation=this.rotations.get(id);
    if(rotation){
      const bridgeNames = new Map([...this.bridges.entries()].map(([bid,b])=>[bid,b.name]));
      this.props.showRotation(
        rotation,
        ()=>{ this.captureUndo(); this._updateRotationPivot(rotation); this.saveArena(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        bridgeNames,
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
    for(const obs of this.obstacles.values()){
      obs.mesh.visible=this.solidMode;
    }
    for(const trap of this.traps.values()){
      trap.mesh.visible=this.solidMode;
      if(trap.variantMesh) trap.variantMesh.visible=this.solidMode;
    }
    for(const portal of this.portals.values()){
      portal.mesh.visible=this.solidMode;
      if(portal.ringMesh) portal.ringMesh.visible=this.solidMode;
    }
    for(const footing of this.footings.values()){
      if(footing.mesh) footing.mesh.visible=this.solidMode;
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
    this._createArenaLight(data);
    this.sceneTree.add(id,data.name,'⏺','octagon-base',{
      addChildButtons:[
        {label:'P+',   title:'Add pit',            className:'pit-btn',  onClick:()=>this.addPit(id)},
        {label:'Z+',   title:'Add zone',           className:'zone-btn', onClick:()=>this.addZone(id)},
        {label:'W+',   title:'Add wall',           className:'pit-btn',  onClick:()=>this.addWall(id,'arena')},
        {label:'SL+',  title:'Add speed line',     className:'sl-btn',   onClick:()=>this._addSpeedLine(id)},
        {label:'Trap+',title:'Add arena trap',     className:'pit-btn',  onClick:()=>this.addTrap(id,'arena')},
        {label:'⬡+',   title:'Add arena portal',   className:'zone-btn', onClick:()=>this.addPortal(id,'arena')},
        {label:'⤻+',   title:'Add jump link',      className:'sl-btn',   onClick:()=>this._addJumpLink(id,'arena')},
        {label:'✦+',   title:'Add presentation',   className:'sl-btn',   onClick:()=>this._addSubNodePresent(id)},
        {label:'✧+',   title:'Add particle effect',className:'pit-btn',  onClick:()=>this._addSubNodeParticle(id)},
        {label:'🌤+',  title:'Add weather',        className:'zone-btn', onClick:()=>this._addSubNodeWeather(id)},
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
          {label:'↻+',title:'Add rotation',  className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(newId,'zone'); this.addRotation([newId],['zone'],p.pivotX,p.pivotY,p.pivotZ); }},
          {label:'✧+',title:'Add particle effect',className:'pit-btn',onClick:()=>this._addSubNodeParticle(newId)},
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
    pit.depth = PIT_FIXED_DEPTH; // always fixed
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
    zone.depth = Math.max(MIN_ZONE_DEPTH, Math.min(zone.depth, Math.min(15, arena.depth)));
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
        {label:'↻+',title:'Add rotation',  className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(id,'zone'); this.addRotation([id],['zone'],p.pivotX,p.pivotY,p.pivotZ); }},
        {label:'✧+',title:'Add particle effect',className:'pit-btn',onClick:()=>this._addSubNodeParticle(id)},
      ],
    });
    this.updateArenaBowlHoles(arena, arenaId);
    this.updateArenaFloor(arena);
    this.checkSiblingConflicts(parentId, parentType);
    this.saveArena();
  }

  /* ── Persistence ── */
  private _saveTimerId = 0;
  private saveArena(): void {
    clearTimeout(this._saveTimerId);
    this._saveTimerId = window.setTimeout(
      () => localStorage.setItem(this.arenaStorageKey, this.serializeConfig()),
      300,
    );
  }
  private _flushSave(): void {
    clearTimeout(this._saveTimerId);
    localStorage.setItem(this.arenaStorageKey, this.serializeConfig());
  }

  private restorePitSave(ps: PitSave, arenaId: string, parentId: string, data: ArenaData): void {
    const pit:PitData={
      id:ps.id,name:ps.name,parentArenaId:arenaId,
      openingShape:ps.openingShape,
      radiusX:ps.radiusX,radiusZ:ps.radiusZ,depth:ps.depth,sides:ps.sides,starInner:ps.starInner,
      color:ps.color,surface:ps.surface,customTileData:ps.customTileData,tileScale:ps.tileScale,
      rimGlowColor:     ps.rimGlowColor,
      rimGlowIntensity: ps.rimGlowIntensity,
      posR:ps.posR,posAngle:ps.posAngle,rotY:ps.rotY,
      particleConfig: ps.particleConfig ?? defaultParticleConfig(),
      mesh:null as unknown as THREE.Mesh,edges:null as unknown as THREE.LineSegments,
      seamMesh:null as unknown as THREE.Mesh,
      particleSystem: null,
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
      seamGlowColor:  zs.seamGlowColor  ?? 0x000000,
      seamGlowIntensity: zs.seamGlowIntensity ?? 0,
      particlePreset: zs.particlePreset ?? 'none',
      posR:zs.posR,posAngle:zs.posAngle,rotY:zs.rotY,
      isMoat:zs.isMoat,innerRadiusX:zs.innerRadiusX,innerRadiusZ:zs.innerRadiusZ,
      innerOpeningShape:zs.innerOpeningShape,innerSides:zs.innerSides,innerStarInner:zs.innerStarInner,
      innerWallProfile:zs.innerWallProfile,innerRimOffset:zs.innerRimOffset,
      innerStepCount:        zs.innerStepCount        ?? DEFAULT_STEP_COUNT,
      innerStepStartDepth:   zs.innerStepStartDepth   ?? DEFAULT_STEP_START_DEPTH,
      innerStepRiserProfile: zs.innerStepRiserProfile ?? DEFAULT_STEP_RISER,
      innerRampMode:         zs.innerRampMode         ?? 'full',
      innerRampAngle:        zs.innerRampAngle        ?? DEFAULT_RAMP_ANGLE,
      innerRampWidth:        zs.innerRampWidth        ?? DEFAULT_RAMP_WIDTH,
      innerSpiralTurns:      zs.innerSpiralTurns      ?? DEFAULT_SPIRAL_TURNS,
      innerSpiralClockwise:  zs.innerSpiralClockwise  ?? true,
      innerSpiralCount:      zs.innerSpiralCount      ?? DEFAULT_SPIRAL_COUNT,
      innerSpiralLedgeWidth: zs.innerSpiralLedgeWidth ?? DEFAULT_SPIRAL_LEDGE_W,
      innerSpiralLedgeHeight:zs.innerSpiralLedgeHeight?? DEFAULT_SPIRAL_LEDGE_H,
      innerSpiralRadiusFrac: zs.innerSpiralRadiusFrac ?? DEFAULT_SPIRAL_RADIUS_FRAC,
      pitIds:[],zoneIds:[],speedLineIds:[],
      mesh:null as unknown as THREE.Mesh,edges:null as unknown as THREE.LineSegments,
      seamMesh:null as unknown as THREE.Mesh,
      particleSystem: null,
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
        {label:'↻+',title:'Add rotation',  className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(zs.id,'zone'); this.addRotation([zs.id],['zone'],p.pivotX,p.pivotY,p.pivotZ); }},
        {label:'✧+',title:'Add particle effect',className:'pit-btn',onClick:()=>this._addSubNodeParticle(zs.id)},
      ],
    });
    for(const cps of zs.pits)  this.restorePitSave(cps,arenaId,zs.id,data);
    for(const czs of zs.zones) this.restoreZoneSave(czs,arenaId,zs.id,data);
    this._createZoneParticles(zone);
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
        innerStepCount:        as.innerStepCount        ?? DEFAULT_STEP_COUNT,
        innerStepStartDepth:   as.innerStepStartDepth   ?? DEFAULT_STEP_START_DEPTH,
        innerStepRiserProfile: as.innerStepRiserProfile ?? DEFAULT_STEP_RISER,
        innerRampMode:         as.innerRampMode         ?? 'full',
        innerRampAngle:        as.innerRampAngle        ?? DEFAULT_RAMP_ANGLE,
        innerRampWidth:        as.innerRampWidth        ?? DEFAULT_RAMP_WIDTH,
        spiralTurns:      as.spiralTurns      ?? DEFAULT_SPIRAL_TURNS,
        spiralClockwise:  as.spiralClockwise  ?? true,
        spiralCount:      as.spiralCount      ?? DEFAULT_SPIRAL_COUNT,
        spiralLedgeWidth: as.spiralLedgeWidth ?? DEFAULT_SPIRAL_LEDGE_W,
        spiralLedgeHeight:as.spiralLedgeHeight?? DEFAULT_SPIRAL_LEDGE_H,
        spiralRadiusFrac: as.spiralRadiusFrac ?? DEFAULT_SPIRAL_RADIUS_FRAC,
        spiralMeshes:     [],
        innerSpiralTurns:      as.innerSpiralTurns      ?? DEFAULT_SPIRAL_TURNS,
        innerSpiralClockwise:  as.innerSpiralClockwise  ?? true,
        innerSpiralCount:      as.innerSpiralCount      ?? DEFAULT_SPIRAL_COUNT,
        innerSpiralLedgeWidth: as.innerSpiralLedgeWidth ?? DEFAULT_SPIRAL_LEDGE_W,
        innerSpiralLedgeHeight:as.innerSpiralLedgeHeight?? DEFAULT_SPIRAL_LEDGE_H,
        innerSpiralRadiusFrac: as.innerSpiralRadiusFrac ?? DEFAULT_SPIRAL_RADIUS_FRAC,
        stepsColor:         as.stepsColor         ?? null,
        stepsSurface:       as.stepsSurface        ?? null,
        stepsCustomTileData:as.stepsCustomTileData ?? null,
        spiralColor:         as.spiralColor         ?? null,
        spiralSurface:       as.spiralSurface        ?? null,
        spiralCustomTileData:as.spiralCustomTileData ?? null,
        lightColor:     as.lightColor     ?? 0xffffff,
        lightIntensity: as.lightIntensity ?? 0,
        lightPosY:      as.lightPosY      ?? 40,
        lightRange:     as.lightRange     ?? 200,
        particlePreset: as.particlePreset ?? 'none',
        weatherPreset:    as.weatherPreset    ?? 'none',
        windEnabled:      as.windEnabled      ?? false,
        windDirectionDeg: as.windDirectionDeg ?? 0,
        windStrengthCms:  as.windStrengthCms  ?? 0,
        windGustInterval: as.windGustInterval ?? 4,
        windGustMult:     as.windGustMult     ?? 2,
        gravityScale:          as.gravityScale          ?? ENV.DEFAULT_GRAVITY_SCALE,
        gravityDirectionX:     as.gravityDirectionX     ?? 0,
        gravityDirectionZ:     as.gravityDirectionZ     ?? 0,
        tiltX:                 as.tiltX                 ?? 0,
        tiltZ:                 as.tiltZ                 ?? 0,
        weightTiltEnabled:     as.weightTiltEnabled     ?? false,
        weightTiltSensitivity: as.weightTiltSensitivity ?? ENV.DEFAULT_WEIGHT_SENSITIVITY,
        weightTiltDampening:   as.weightTiltDampening   ?? ENV.DEFAULT_WEIGHT_DAMPENING,
        fogDensity:            as.fogDensity            ?? 0,
        scoreMultiplier:       as.scoreMultiplier       ?? 1.0,
        pointsPerSecond:       as.pointsPerSecond       ?? 0,
        weatherSurfaceMap:     as.weatherSurfaceMap     ?? {},
        envSchedule: (as.envSchedule ?? []).map(e => ({ ...e, _timer: undefined, _revertTimer: undefined, _prevValues: undefined })),
        tiltGroup: undefined, fogSystem: null, _score: 0,
        presentStlb64:  as.presentStlb64  ?? null,
        presentColor:   as.presentColor   ?? 0xaaaaaa,
        light: null, particleSystem: null, weatherSystem: null,
        pitIds:[],zoneIds:[],wallIds:[],speedLineIds:[],
        mesh:null as unknown as THREE.Mesh,edges:null as unknown as THREE.LineSegments,
        floorMesh:null,islandMesh:null,rimSeamMesh:null,
      };
      this.arenas.set(as.id,data);

      // Arena node must exist in the tree before children are added as its descendants
      this.sceneTree.add(as.id,data.name,'⏺','octagon-base',{
        addChildButtons:[
          {label:'P+',   title:'Add pit',            className:'pit-btn',  onClick:()=>this.addPit(as.id)},
          {label:'Z+',   title:'Add zone',           className:'zone-btn', onClick:()=>this.addZone(as.id)},
          {label:'W+',   title:'Add wall',           className:'pit-btn',  onClick:()=>this.addWall(as.id,'arena')},
          {label:'SL+',  title:'Add speed line',     className:'sl-btn',   onClick:()=>this._addSpeedLine(as.id)},
          {label:'Trap+',title:'Add arena trap',     className:'pit-btn',  onClick:()=>this.addTrap(as.id,'arena')},
          {label:'⬡+',   title:'Add arena portal',   className:'zone-btn', onClick:()=>this.addPortal(as.id,'arena')},
          {label:'⤻+',   title:'Add jump link',      className:'sl-btn',   onClick:()=>this._addJumpLink(as.id,'arena')},
          {label:'✦+',   title:'Add presentation',   className:'sl-btn',   onClick:()=>this._addSubNodePresent(as.id)},
          {label:'✧+',   title:'Add particle effect',className:'pit-btn',  onClick:()=>this._addSubNodeParticle(as.id)},
          {label:'🌤+',  title:'Add weather',        className:'zone-btn', onClick:()=>this._addSubNodeWeather(as.id)},
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

      // Create PointLight and particle system
      this._createArenaLight(data);
      this._createArenaParticles(as.id, data);
      // Restore present STL if saved
      if(data.presentStlb64) this._loadPresentStl(as.id, data.presentStlb64, data.presentColor);

      // Restore walls attached to this arena
      for(const ws of as.walls) this._restoreWallSave(ws);
    }
    this.updateTopFace();

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

    // Restore base walls (free-standing on octagon base)
    for(const ws of cfg.baseWalls) this._restoreWallSave(ws);

    // Restore obstacles
    for(const os of cfg.obstacles) this._restoreObstacleSave(os);

    // Restore traps (trap-parented walls are restored inside _restoreTrapSave)
    for(const ts of cfg.traps) this._restoreTrapSave(ts);

    // Restore portals
    for(const ps of cfg.portals) this._restorePortalSave(ps);

    // Restore footings
    for(const fs of cfg.footings) this._restoreFootingSave(fs);

    // Restore jump links
    for(const js of (cfg.jumpLinks ?? [])) this._restoreJumpLinkSave(js);

    // Restore rotations after all nodes are loaded
    for(const rs of cfg.rotations) this._restoreRotationSave(rs);
  }

  private _restoreWallSave(ws: WallSave): void {
    const wall: WallData = {
      id:ws.id, name:ws.name, parentId:ws.parentId, parentType:ws.parentType,
      fullPerimeter:ws.fullPerimeter, arcStart:ws.arcStart, arcEnd:ws.arcEnd,
      basePosX:ws.basePosX, basePosZ:ws.basePosZ, baseRotY:ws.baseRotY, baseLength:ws.baseLength,
      height:ws.height, tilt:ws.tilt, thickness:ws.thickness, thicknessDirection:ws.thicknessDirection??'outward',
      hasGaps:ws.hasGaps, gapWidth:ws.gapWidth, panelWidth:ws.panelWidth,
      topProfile:ws.topProfile, topAmplitude:ws.topAmplitude, topFrequency:ws.topFrequency,
      isDouble:ws.isDouble, peakHeight:ws.peakHeight, peakTilt:ws.peakTilt,
      holes:ws.holes.map(h=>({...h})),
      isDestructible:ws.isDestructible, hitPoints:ws.hitPoints,
      autoJoin:ws.autoJoin, moatRing:ws.moatRing,
      rotateOnArena:ws.rotateOnArena, arenaRotateMode:ws.arenaRotateMode,
      arenaRotateSpeed:ws.arenaRotateSpeed, arenaRotateStepDeg:ws.arenaRotateStepDeg,
      arenaRotateStepInterval:ws.arenaRotateStepInterval,
      arenaRotateOscAmp:ws.arenaRotateOscAmp, arenaRotateOscFreq:ws.arenaRotateOscFreq,
      color:ws.color, surface:ws.surface, material:ws.material,
      customTileData:ws.customTileData, tileScale:ws.tileScale,
      emissiveColor:ws.emissiveColor, emissiveIntensity:ws.emissiveIntensity, opacity:ws.opacity,
      presentStlb64:ws.presentStlb64, presentColor:ws.presentColor,
      mesh:null, edges:null,
    };
    this.walls.set(ws.id, wall);
    this.applyWall(wall);
    if (wall.presentStlb64) this._loadPresentStl(ws.id, wall.presentStlb64, wall.presentColor);
    const parentTreeId = ws.parentType==='base' ? 'octagon-base' : ws.parentId;
    this.sceneTree.add(ws.id, wall.name, '🧱', parentTreeId, {
      addChildButtons: [
        { label:'↻+', title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(ws.id,'wall'); this.addRotation([ws.id],['wall'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'✦+', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(ws.id) },
      ],
    });
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
      presentStlb64: bs.presentStlb64 ?? null, presentColor: bs.presentColor ?? 0xaaaaaa,
      linkedSpeedLineId: bs.linkedSpeedLineId ?? null,
      group,
    };
    this.bridges.set(bs.id, bridge);
    const scene=this.getScene(); if(scene) scene.add(group);
    this.sceneTree.add(bs.id, bridge.name, '🌉', 'octagon-base', {
      addChildButtons:[
        {label:'Seg+',title:'Add segment',      className:'zone-btn',onClick:()=>this.addSegment(bs.id,'straight')},
        {label:'W+',  title:'Add wall',         className:'pit-btn', onClick:()=>this.addWall(bs.id,'bridge')},
        {label:'✦+',  title:'Add presentation', className:'sl-btn',  onClick:()=>this._addSubNodePresent(bs.id)},
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
        loopOrientation: ss.loopOrientation ?? 'vertical',
        tiltAngle: ss.tiltAngle ?? 0,
        corkscrewLength:ss.corkscrewLength, corkscrewTurns:ss.corkscrewTurns,
        color:ss.color, surface:ss.surface,
        animEnabled:    ss.animEnabled    ?? false,
        animOffsetX:    ss.animOffsetX    ?? 0,
        animOffsetY:    ss.animOffsetY    ?? 0,
        animOffsetZ:    ss.animOffsetZ    ?? 0,
        animRotX:       ss.animRotX      ?? 0,
        animRotY:       ss.animRotY      ?? 0,
        animRotZ:       ss.animRotZ      ?? 0,
        animStartMs:    ss.animStartMs    ?? 0,
        animIntervalMs: ss.animIntervalMs ?? 2000,
        animHoldMs:     ss.animHoldMs    ?? 1000,
        _animTimer: 0,
        _animCenter: new THREE.Vector3(),
        _animPivot: null,
        mesh:null, edges:null,
      };
      this.segments.set(ss.id, seg);
      bridge.segmentIds.push(ss.id);
      const icon=segmentIcon(seg.type);
      this.sceneTree.add(ss.id, seg.name, icon, bs.id);
    }
    if(bridge.segmentIds.length>0) this.applyBridgeFromSegment(bridge.segmentIds[0]);
    for(const ws of bs.walls) this._restoreWallSave(ws);
    if(bridge.presentStlb64) this._loadPresentStl(bs.id, bridge.presentStlb64, bridge.presentColor);
  }

  private _restoreRotationSave(rs: RotationSave): void {
    if (rs.memberIds.some(id => this.nodeRotationId.has(id))) return;
    const scene = this.getScene();
    const rot: RotationData = {
      id: rs.id, name: rs.name,
      memberIds: [...rs.memberIds], memberTypes: [...rs.memberTypes],
      pivotX: rs.pivotX, pivotY: rs.pivotY, pivotZ: rs.pivotZ,
      mode: rs.mode, speed: rs.speed, direction: rs.direction,
      oscAmplitude: rs.oscAmplitude, oscFrequency: rs.oscFrequency, oscPhase: rs.oscPhase,
      enabled: rs.enabled, currentAngle: 0, snapRules: rs.snapRules.map(s=>({...s})),
      pivotGroup: null,
    };
    if (scene) {
      const pg = new THREE.Group();
      pg.position.set(rot.pivotX, rot.pivotY, rot.pivotZ);
      scene.add(pg);
      rot.pivotGroup = pg;
      for (const mid of rot.memberIds) {
        for (const obj of this._getMemberObjects(mid)) pg.attach(obj);
      }
    }
    this.rotations.set(rs.id, rot);
    rs.memberIds.forEach(mid => this.nodeRotationId.set(mid, rs.id));
    const treeParent = this._commonTreeParent(rs.memberIds) ?? 'octagon-base';
    this.sceneTree.add(rs.id, rs.name, '↻', treeParent);
  }

  private loadArena(): void {
    try {
      const raw=localStorage.getItem(this.arenaStorageKey); if(!raw) return;
      const saved=JSON.parse(raw) as { v: number; c: ArenaConfig };
      if(saved.v !== ARENA_SAVE_VERSION){ localStorage.removeItem(this.arenaStorageKey); return; }
      const cfg=saved.c;
      this.baseConfig={...this.baseConfig,...cfg.baseConfig};
      this.rebuildBase();
      this.arenaSeq=cfg.arenaSeq; this.pitSeq=cfg.pitSeq; this.zoneSeq=cfg.zoneSeq;
      this.wallSeq=cfg.wallSeq; this.bridgeSeq=cfg.bridgeSeq; this.segmentSeq=cfg.segmentSeq;
      this.speedlineSeq=cfg.speedLineSeq;
      this.obstacleSeq=cfg.obstacleSeq; this.trapSeq=cfg.trapSeq; this.portalSeq=cfg.portalSeq;
      this.rotationSeq=cfg.rotationSeq; this.footingSeq=cfg.footingSeq;
      this.jumpLinkSeq=cfg.jumpLinkSeq ?? 0;
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
      this._checkPendingLoad();
    } else if(!v && canvas){
      canvas.removeEventListener('pointerdown', this._onPointerDown);
      canvas.removeEventListener('pointermove', this._onPointerMove);
      canvas.removeEventListener('pointerup',   this._onPointerUp);
      this._spawnMgr?.despawn();
      this._spawnMgrBtn?.classList.remove('active');
    }
  }

  private _checkPendingLoad(): void {
    const raw = localStorage.getItem('bey_pending_arena_load');
    if (!raw) return;
    localStorage.removeItem('bey_pending_arena_load');
    try {
      const { config, mode } = JSON.parse(raw) as { config: ArenaConfig; mode: 'replace' | 'merge' };
      if (mode === 'replace') {
        this._applyConfigToScene(config);
      } else {
        this._mergeConfigIntoScene(config);
      }
      this._flushSave();
    } catch { /* malformed pending load — discard */ }
  }

  private _mergeConfigIntoScene(cfg: ArenaConfig): void {
    const batchTag = Date.now().toString(36);
    const remapped = remapArenaConfigIds(cfg, batchTag);
    this.arenaSeq     = Math.max(this.arenaSeq,     remapped.arenaSeq);
    this.pitSeq       = Math.max(this.pitSeq,       remapped.pitSeq);
    this.zoneSeq      = Math.max(this.zoneSeq,      remapped.zoneSeq);
    this.wallSeq      = Math.max(this.wallSeq,       remapped.wallSeq);
    this.bridgeSeq    = Math.max(this.bridgeSeq,     remapped.bridgeSeq);
    this.segmentSeq   = Math.max(this.segmentSeq,    remapped.segmentSeq);
    this.speedlineSeq = Math.max(this.speedlineSeq,  remapped.speedLineSeq);
    this.obstacleSeq  = Math.max(this.obstacleSeq,   remapped.obstacleSeq ?? 0);
    this.trapSeq      = Math.max(this.trapSeq,       remapped.trapSeq ?? 0);
    this.portalSeq    = Math.max(this.portalSeq,     remapped.portalSeq ?? 0);
    this.footingSeq   = Math.max(this.footingSeq,    remapped.footingSeq ?? 0);
    this.rotationSeq  = Math.max(this.rotationSeq,   remapped.rotationSeq ?? 0);
    this._loadArenasFromConfig(remapped);
  }

  private _showSavePresetModal(): void {
    const checkedIds = this.sceneTree.getCheckedIds();
    const isFull = checkedIds.length === 0;
    let config: ArenaConfig;
    if (isFull) {
      config = (JSON.parse(this.serializeConfig()) as { v: number; c: ArenaConfig }).c;
    } else {
      config = extractArenaConfig(checkedIds, {
        arenas: this.arenas, pits: this.pits, zones: this.zones,
        walls: this.walls, bridges: this.bridges, segments: this.segments,
        speedLines: this.speedLines, obstacles: this.obstacles,
        traps: this.traps, portals: this.portals,
        footings: this.footings, rotations: this.rotations,
      }, this.baseConfig);
    }

    const existingGroups = [...new Set(listArenaPresets().map(p => p.group).filter(Boolean))];

    const overlay = document.createElement('div');
    overlay.className = 'preset-modal';
    overlay.innerHTML = `
      <div class="preset-modal__box">
        <div class="preset-modal__title">💾 Save Arena Preset</div>
        <div class="preset-modal__subtitle">${isFull ? 'Saving full scene' : `Saving ${checkedIds.length} selected item(s)`}</div>
        <div class="preset-modal__field">
          <label>Name *</label>
          <input id="pm-name" type="text" placeholder="e.g. Ramp Track Bridge" autocomplete="off"/>
        </div>
        <div class="preset-modal__field">
          <label>Group</label>
          <input id="pm-group" type="text" placeholder="e.g. Bridge Setups" list="pm-groups-list" autocomplete="off"/>
          <datalist id="pm-groups-list">${existingGroups.map(g=>`<option value="${g}">`).join('')}</datalist>
        </div>
        <div class="preset-modal__field">
          <label>Description</label>
          <textarea id="pm-desc" placeholder="Optional description…"></textarea>
        </div>
        <div class="preset-modal__field">
          <label>Tags (comma-separated)</label>
          <input id="pm-tags" type="text" placeholder="bridge, race, ramp"/>
        </div>
        <div class="preset-modal__actions">
          <button class="game-btn" id="pm-cancel">Cancel</button>
          <button class="game-btn" id="pm-save">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const nameInput  = overlay.querySelector<HTMLInputElement>('#pm-name')!;
    const groupInput = overlay.querySelector<HTMLInputElement>('#pm-group')!;
    const descInput  = overlay.querySelector<HTMLTextAreaElement>('#pm-desc')!;
    const tagsInput  = overlay.querySelector<HTMLInputElement>('#pm-tags')!;
    nameInput.focus();

    const close = () => overlay.remove();
    overlay.querySelector('#pm-cancel')!.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    overlay.querySelector('#pm-save')!.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      const thumbnail = generateArenaThumb(config);
      const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
      saveArenaPreset({
        id: newPresetId(),
        name,
        group: groupInput.value.trim() || 'Uncategorized',
        description: descInput.value.trim(),
        tags,
        thumbnail,
        config,
        isFull,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      close();
      this._showToast('✓ Saved to Library');
      this.sceneTree.clearChecks();
    });
  }

  private _showToast(msg: string, durationMs = 2500): void {
    const t = document.createElement('div');
    t.className = 'preset-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), durationMs);
  }

  /* ── Reparent / reorder ──────────────────────────────────────────────── */

  private _onReparent(nodeId: string, newParentId: string | null): void {
    if (!newParentId) return;
    // Sub-nodes and jump links are not reparentable
    if (nodeId.startsWith('present-') || nodeId.startsWith('particle-') || nodeId.startsWith('weather-') || nodeId.startsWith('env-')) return;
    if (this.jumpLinks.has(nodeId)) return;

    // ── Bridge segment: reorder within same bridge OR move to another bridge ──
    const seg = this.segments.get(nodeId);
    if (seg) {
      if (newParentId === seg.bridgeId) {
        // Same-bridge reorder
        const bridge = this.bridges.get(seg.bridgeId); if (!bridge) return;
        const newOrder = this.sceneTree.getChildIds(seg.bridgeId).filter(id => this.segments.has(id));
        bridge.segmentIds = newOrder;
        newOrder.forEach((sid, i) => { const s = this.segments.get(sid); if (s) s.orderIndex = i; });
        if (newOrder.length > 0) this.applyBridgeFromSegment(newOrder[0]);
      } else {
        // Cross-bridge reparent
        const oldBridge = this.bridges.get(seg.bridgeId);
        const newBridge = this.bridges.get(newParentId);
        if (!oldBridge || !newBridge) return;
        // Remove from old bridge
        oldBridge.segmentIds = oldBridge.segmentIds.filter(id => id !== nodeId);
        oldBridge.segmentIds.forEach((sid, i) => { const s = this.segments.get(sid); if (s) s.orderIndex = i; });
        // Add to new bridge
        const newOrder = this.sceneTree.getChildIds(newParentId).filter(id => this.segments.has(id));
        newBridge.segmentIds = newOrder;
        newOrder.forEach((sid, i) => { const s = this.segments.get(sid); if (s) { s.orderIndex = i; s.bridgeId = newParentId; } });
        // Rebuild both
        if (oldBridge.segmentIds.length > 0) this.applyBridgeFromSegment(oldBridge.segmentIds[0]);
        if (newBridge.segmentIds.length > 0) this.applyBridgeFromSegment(newBridge.segmentIds[0]);
      }
      this.saveArena(); return;
    }

    // ── Wall: reparent between arenas or arena↔base ──────────────────────
    const wall = this.walls.get(nodeId);
    if (wall) {
      const oldParentId = wall.parentId; const oldParentType = wall.parentType;
      if (oldParentType === 'bridge') return; // bridge walls not reparentable
      const isNewArena = this.arenas.has(newParentId);
      const isNewBase  = newParentId === 'octagon-base';
      if (!isNewArena && !isNewBase) return;
      // Remove from old parent's wallIds
      if (oldParentType === 'arena') {
        const oldArena = this.arenas.get(oldParentId);
        if (oldArena) oldArena.wallIds = oldArena.wallIds.filter(id => id !== nodeId);
      }
      // Assign new parent
      wall.parentId   = isNewBase ? 'octagon-base' : newParentId;
      wall.parentType = isNewBase ? 'base' : 'arena';
      if (isNewArena) {
        const newArena = this.arenas.get(newParentId);
        if (newArena && !newArena.wallIds.includes(nodeId)) newArena.wallIds.push(nodeId);
      }
      this.applyWall(wall);
      if (oldParentType === 'arena') this.rebuildDependentsOf(oldParentId);
      if (isNewArena) this.rebuildDependentsOf(newParentId);
      this.saveArena(); return;
    }

    // ── Pit: reparent between arenas ─────────────────────────────────────
    const pit = this.pits.get(nodeId);
    if (pit) {
      const oldArena = this.arenas.get(pit.parentArenaId);
      const newArena = this.arenas.get(newParentId);
      if (!newArena) return;
      if (oldArena) {
        oldArena.pitIds = oldArena.pitIds.filter(id => id !== nodeId);
        this.updateArenaBowlHoles(oldArena, pit.parentArenaId);
        this.updateArenaFloor(oldArena);
      }
      pit.parentArenaId = newParentId;
      newArena.pitIds.push(nodeId);
      applyPit(pit, newArena, this.pits, this.zones);
      this.updateArenaBowlHoles(newArena, newParentId);
      this.updateArenaFloor(newArena);
      this.saveArena(); return;
    }

    // ── Zone: reparent between arenas ────────────────────────────────────
    const zone = this.zones.get(nodeId);
    if (zone) {
      const oldArena = this.arenas.get(zone.parentArenaId);
      const newArena = this.arenas.get(newParentId);
      if (!newArena) return;
      if (oldArena) {
        oldArena.zoneIds = oldArena.zoneIds.filter(id => id !== nodeId);
        this.updateArenaBowlHoles(oldArena, zone.parentArenaId);
        this.updateArenaFloor(oldArena);
      }
      zone.parentArenaId = newParentId;
      zone.parentZoneId  = null;
      newArena.zoneIds.push(nodeId);
      applyZone(zone, newArena, this.getScene(), this.pits, this.zones);
      this.updateArenaBowlHoles(newArena, newParentId);
      this.updateArenaFloor(newArena);
      this.saveArena(); return;
    }

    // ── Trap: reparent arena↔base ─────────────────────────────────────────
    const trap = this.traps.get(nodeId);
    if (trap) {
      const isNewArena = this.arenas.has(newParentId);
      const isNewBase  = newParentId === 'octagon-base';
      if (!isNewArena && !isNewBase) return;
      trap.parentId   = isNewBase ? 'octagon-base' : newParentId;
      trap.parentType = isNewBase ? 'base' : 'arena';
      applyTrap(trap, this._getTrapSurfY(trap));
      if (this.nodeRotationId.has(nodeId)) this._afterApply(nodeId);
      this.saveArena(); return;
    }

    // ── Portal: reparent arena↔base ───────────────────────────────────────
    const portal = this.portals.get(nodeId);
    if (portal) {
      const isNewArena = this.arenas.has(newParentId);
      const isNewBase  = newParentId === 'octagon-base';
      if (!isNewArena && !isNewBase) return;
      portal.parentId   = isNewBase ? 'octagon-base' : newParentId;
      portal.parentType = isNewBase ? 'base' : 'arena';
      applyPortal(portal, this._getPortalSurfY(portal));
      this.saveArena(); return;
    }

    // ── Speed line: reparent between arenas / zones ───────────────────────
    const sl = this.speedLines.get(nodeId);
    if (sl) {
      const oldArena = this.arenas.get(sl.parentArenaId);
      if (oldArena) oldArena.speedLineIds = oldArena.speedLineIds.filter(id => id !== nodeId);
      if (sl.parentZoneId) {
        const oz = this.zones.get(sl.parentZoneId);
        if (oz) oz.speedLineIds = oz.speedLineIds.filter(id => id !== nodeId);
      }
      const newArena = this.arenas.get(newParentId);
      const newZone  = this.zones.get(newParentId);
      if (newArena) {
        sl.parentArenaId = newParentId; sl.parentZoneId = null;
        newArena.speedLineIds.push(nodeId);
      } else if (newZone) {
        sl.parentArenaId = newZone.parentArenaId; sl.parentZoneId = newParentId;
        newZone.speedLineIds.push(nodeId);
      } else { return; }
      this._updateSpeedLine(sl);
      this.saveArena(); return;
    }

    // All other node types (arena, obstacle, footing, bridge, rotation) → no-op
  }

  /* ── Duplicate ───────────────────────────────────────────────────────── */

  private _duplicateNode(id: string): void {
    // Sub-nodes, bridges, speed lines, rotations, jump links are not duplicatable
    if (id.startsWith('present-') || id.startsWith('particle-') || id.startsWith('weather-') || id.startsWith('env-')) return;
    if (this.bridges.has(id) || this.speedLines.has(id) || this.rotations.has(id)) return;
    if (this.jumpLinks.has(id)) return;
    if (this.segments.has(id)) return;

    this.captureUndo();

    // ── Arena ──────────────────────────────────────────────────────────────
    const arena = this.arenas.get(id);
    if (arena) {
      const newId = `arena-${++this.arenaSeq}`;
      const clone = { ...arena, id: newId, name: `Arena ${this.arenaSeq}`,
        posX: arena.posX + 10,
        pitIds: [] as string[], zoneIds: [] as string[], wallIds: [] as string[], speedLineIds: [] as string[],
        spiralMeshes: [], particleSystem: null, weatherSystem: null, light: null,
        mesh: null as unknown as THREE.Mesh, edges: null as unknown as THREE.LineSegments,
        rimSeamMesh: null as unknown as THREE.Mesh,
      };
      const [mesh, edges] = buildArenaObjects(clone, [], this.getScene() ?? undefined);
      clone.mesh = mesh; clone.edges = edges;
      const rim = buildArenaRimSeam(clone, this.baseConfig.color, this.baseConfig.surface,
        this.baseConfig.customTileData, this.baseConfig.tileScale);
      clone.rimSeamMesh = rim;
      this.addToScene(mesh, edges, rim, ...(clone.spiralMeshes ?? []));
      this.sceneObjects.set(newId, [mesh, edges, rim]);
      this.arenas.set(newId, clone);
      this._createArenaLight(clone);
      this.sceneTree.add(newId, clone.name, '⏺', 'octagon-base', {
        addChildButtons: [
          { label:'P+',   title:'Add pit',            className:'pit-btn',  onClick:()=>this.addPit(newId) },
          { label:'Z+',   title:'Add zone',           className:'zone-btn', onClick:()=>this.addZone(newId) },
          { label:'W+',   title:'Add wall',           className:'pit-btn',  onClick:()=>this.addWall(newId,'arena') },
          { label:'SL+',  title:'Add speed line',     className:'sl-btn',   onClick:()=>this._addSpeedLine(newId) },
          { label:'Trap+',title:'Add arena trap',     className:'pit-btn',  onClick:()=>this.addTrap(newId,'arena') },
          { label:'⬡+',   title:'Add arena portal',   className:'zone-btn', onClick:()=>this.addPortal(newId,'arena') },
          { label:'⤻+',   title:'Add jump link',      className:'sl-btn',   onClick:()=>this._addJumpLink(newId,'arena') },
          { label:'✦+',   title:'Add presentation',   className:'sl-btn',   onClick:()=>this._addSubNodePresent(newId) },
          { label:'✧+',   title:'Add particle effect',className:'pit-btn',  onClick:()=>this._addSubNodeParticle(newId) },
          { label:'🌤+',  title:'Add weather',        className:'zone-btn', onClick:()=>this._addSubNodeWeather(newId) },
        ],
      });
      this.updateTopFace(); this.updateAllMoatIslandCaps(); this.saveArena();
      return;
    }

    // ── Obstacle ───────────────────────────────────────────────────────────
    const obs = this.obstacles.get(id);
    if (obs) {
      const newId = `obstacle-${++this.obstacleSeq}`;
      const clone = { ...obs, id: newId, name: `Obstacle ${this.obstacleSeq}`,
        posX: obs.posX + 10,
        mesh: null as unknown as THREE.Mesh, edges: null as unknown as THREE.LineSegments,
      };
      const [mesh, edges] = buildObstacleObjects(clone);
      clone.mesh = mesh; clone.edges = edges;
      this.addToScene(mesh, edges);
      this.sceneObjects.set(newId, [mesh, edges]);
      this.obstacles.set(newId, clone);
      this.sceneTree.add(newId, clone.name, '⬛', 'octagon-base', {
        addChildButtons: [
          { label:'↻+', title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(newId,'obstacle'); this.addRotation([newId],['obstacle'],p.pivotX,p.pivotY,p.pivotZ); } },
          { label:'✦+', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(newId) },
        ],
      });
      this.saveArena(); return;
    }

    // ── Footing ────────────────────────────────────────────────────────────
    const footing = this.footings.get(id);
    if (footing) {
      const newId = `footing-${++this.footingSeq}`;
      const clone = { ...footing, id: newId, name: `Footing ${this.footingSeq}`,
        basePosX: footing.basePosX + 10,
        mesh: null as unknown as THREE.Mesh | null, edges: null as unknown as THREE.LineSegments | null,
      };
      const [mesh, edges] = buildFootingObjects(clone, this.baseConfig.height);
      clone.mesh = mesh; clone.edges = edges;
      this.addToScene(mesh, edges);
      this.sceneObjects.set(newId, [mesh, edges]);
      this.footings.set(newId, clone);
      this.sceneTree.add(newId, clone.name, '⬢', 'octagon-base', {
        addChildButtons: [
          { label:'✦+', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(newId) },
        ],
      });
      this._applyViewMode(); this.saveArena(); return;
    }

    // ── Trap ───────────────────────────────────────────────────────────────
    const trap = this.traps.get(id);
    if (trap) {
      const newId = `trap-${++this.trapSeq}`;
      const clone = { ...trap, id: newId, name: `Trap ${this.trapSeq}`,
        posAngle: trap.posAngle + 10,
        durationTiers: trap.durationTiers.map(t => ({ ...t })),
        mesh: null as unknown as THREE.Mesh, edges: null as unknown as THREE.LineSegments,
        variantMesh: null as THREE.Mesh | null,
      };
      const surfY = this._getTrapSurfY(clone);
      const [mesh, edges, variantMesh] = buildTrapObjects(clone, surfY);
      clone.mesh = mesh; clone.edges = edges; clone.variantMesh = variantMesh;
      const objs: THREE.Object3D[] = [mesh, edges];
      if (variantMesh) objs.push(variantMesh);
      this.addToScene(...objs);
      this.sceneObjects.set(newId, objs);
      this.traps.set(newId, clone);
      const parentTreeId = clone.parentType === 'base' ? 'octagon-base' : clone.parentId;
      this.sceneTree.add(newId, clone.name, '⚡', parentTreeId, {
        addChildButtons: [
          { label:'🧱+', title:'Add wall',            onClick:()=>this.addWall(newId, 'trap') },
          { label:'↻+',  title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(newId,'trap'); this.addRotation([newId],['trap'],p.pivotX,p.pivotY,p.pivotZ); } },
          { label:'⤻+',  title:'Add jump link',   className:'sl-btn',  onClick:()=>this._addJumpLink(newId,'trap') },
          { label:'✦+',  title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(newId) },
          { label:'✧+',  title:'Add particle effect',className:'zone-btn',onClick:()=>this._addSubNodeParticle(newId) },
        ],
      });
      this.saveArena(); return;
    }

    // ── Portal ─────────────────────────────────────────────────────────────
    const portal = this.portals.get(id);
    if (portal) {
      const newId = `portal-${++this.portalSeq}`;
      const clone = { ...portal, id: newId, name: `Portal ${this.portalSeq}`,
        posAngle: portal.posAngle + 10,
        mesh: null as unknown as THREE.Mesh, edges: null as unknown as THREE.LineSegments,
        ringMesh: null as THREE.Mesh | null,
      };
      const surfY = this._getPortalSurfY(clone);
      const [mesh, edges, ringMesh] = buildPortalObjects(clone, surfY);
      clone.mesh = mesh; clone.edges = edges; clone.ringMesh = ringMesh;
      const objs: THREE.Object3D[] = [mesh, edges];
      if (ringMesh) objs.push(ringMesh);
      this.addToScene(...objs);
      this.sceneObjects.set(newId, objs);
      this.portals.set(newId, clone);
      const parentTreeId = clone.parentType === 'base' ? 'octagon-base' : clone.parentId;
      this.sceneTree.add(newId, clone.name, '◉', parentTreeId, {
        addChildButtons: [
          { label:'✦+', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(newId) },
        ],
      });
      this.saveArena(); return;
    }

    // ── Wall ───────────────────────────────────────────────────────────────
    const wall = this.walls.get(id);
    if (wall) {
      const newId = `wall-${++this.wallSeq}`;
      const clone = { ...wall, id: newId, name: `Wall ${this.wallSeq}`,
        holes: wall.holes.map(h => ({ ...h })),
        mesh: null as THREE.Mesh | null, edges: null as THREE.LineSegments | null,
        _rotatePivot: undefined, _arenaRotateTimer: undefined,
      };
      this.walls.set(newId, clone);
      this.applyWall(clone);
      const parentTreeId = clone.parentType === 'base' ? 'octagon-base' : clone.parentId;
      this.sceneTree.add(newId, clone.name, '🧱', parentTreeId, {
        addChildButtons: [
          { label:'↻+', title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(newId,'wall'); this.addRotation([newId],['wall'],p.pivotX,p.pivotY,p.pivotZ); } },
          { label:'✦+', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(newId) },
        ],
      });
      this.saveArena(); return;
    }

    // ── Pit ────────────────────────────────────────────────────────────────
    const pit = this.pits.get(id);
    if (pit) {
      const arena = this.arenas.get(pit.parentArenaId); if (!arena) return;
      const newId = `pit-${++this.pitSeq}`;
      const clone: PitData = { ...pit, id: newId, name: `Pit ${this.pitSeq}`,
        posAngle: pit.posAngle + 15,
        particleConfig: { ...pit.particleConfig }, particleSystem: null,
        mesh: null as unknown as THREE.Mesh, edges: null as unknown as THREE.LineSegments,
        seamMesh: null as unknown as THREE.Mesh,
      };
      const [mesh, edges, seamMesh] = buildPitObjects(clone, arena, this.pits, this.zones);
      clone.mesh = mesh; clone.edges = edges; clone.seamMesh = seamMesh;
      this.addToScene(mesh, edges, seamMesh);
      this.sceneObjects.set(newId, [mesh, edges, seamMesh]);
      this.pits.set(newId, clone);
      arena.pitIds.push(newId);
      this.sceneTree.add(newId, clone.name, '▼', pit.parentArenaId);
      this.updateArenaBowlHoles(arena, pit.parentArenaId);
      this.updateArenaFloor(arena);
      this.saveArena(); return;
    }

    // ── Zone ───────────────────────────────────────────────────────────────
    const zone = this.zones.get(id);
    if (zone) {
      const arena = this.arenas.get(zone.parentArenaId); if (!arena) return;
      const newId = `zone-${++this.zoneSeq}`;
      const clone: ZoneData = { ...zone, id: newId, name: `Zone ${this.zoneSeq}`,
        posAngle: zone.posAngle + 15,
        pitIds: [] as string[], zoneIds: [] as string[], speedLineIds: [] as string[],
        particleSystem: null,
        mesh: null as unknown as THREE.Mesh, edges: null as unknown as THREE.LineSegments,
        seamMesh: null as unknown as THREE.Mesh,
      };
      const [mesh, edges, seamMesh] = buildZoneObjects(clone, arena, this.pits, this.zones);
      clone.mesh = mesh; clone.edges = edges; clone.seamMesh = seamMesh;
      this.addToScene(mesh, edges, seamMesh);
      this.sceneObjects.set(newId, [mesh, edges, seamMesh]);
      this.zones.set(newId, clone);
      arena.zoneIds.push(newId);
      const parentId = zone.parentZoneId ?? zone.parentArenaId;
      this.sceneTree.add(newId, clone.name, '◈', parentId, {
        addChildButtons: [
          { label:'P+',title:'Add nested pit',className:'pit-btn',  onClick:()=>this.addPitToParent(newId,'zone') },
          { label:'Z+',title:'Add nested zone',className:'zone-btn',onClick:()=>this.addZoneToParent(newId,'zone') },
          { label:'↻+',title:'Add rotation',  className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(newId,'zone'); this.addRotation([newId],['zone'],p.pivotX,p.pivotY,p.pivotZ); } },
          { label:'✧+',title:'Add particle effect',className:'pit-btn',onClick:()=>this._addSubNodeParticle(newId) },
        ],
      });
      this.updateArenaBowlHoles(arena, zone.parentArenaId);
      this.updateArenaFloor(arena);
      this.saveArena(); return;
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

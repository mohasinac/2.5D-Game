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
  EnvProperty,
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
  defaultSegment as defaultSlSegment, applySpeedLine,
} from '../geometry/arenaObjectBuilders';
import { samplePathForOverlap, buildOverlapSphere, generatePresetSegments } from '../geometry/speedLineBuilders';
import { SceneTree } from '../utils/SceneTree';
import { PropertiesPanel } from '../utils/PropertiesPanel';
import {
  PitSave, ZoneSave, WallSave, BridgeSave, SpeedLineSave, ArenaConfig, RotationSave,
  ObstacleSave, TrapSave, PortalSave, BaseFootingSave,
  pitToSave, zoneToSave, arenaToSave,
  obstacleToSave, footingToSave,
} from '../utils/arenaPersistence';
import { DEMO_ARENA_CONFIG } from '../config/demoArenaConfig';
import { trapSurfY, updateEarthquakeMeshHeights } from '../geometry/trapBuilders';
import { TrapManager } from '../features/managers/TrapManager';
import { defaultProjectileConfig } from '../types/arenaTypes';
import { ProjectileManager } from '../features/managers/ProjectileManager';
import { ProjectionService } from '../features/ProjectionService';
import { PortalManager } from '../features/managers/PortalManager';
import { resolveEndpointWorld } from '../geometry/jumpLinkBuilders';
import { JumpLinkData, JumpLinkParentType } from '../types/arenaTypes';
import { JumpLinkSave } from '../utils/arenaPersistence';
import { JumpLinkManager } from '../features/managers/JumpLinkManager';
import { WallManager } from '../features/managers/WallManager';
import { BridgeManager } from '../features/managers/BridgeManager';
import { SpeedLineManager } from '../features/managers/SpeedLineManager';
import {
  listArenaPresets, saveArenaPreset, newPresetId,
  generateArenaThumb, remapArenaConfigIds, extractArenaConfig,
} from '../utils/presetStore';
import { SpawnManager } from '../features/managers/SpawnManager';
import { ObstacleManager } from '../features/managers/ObstacleManager';
import { FootingManager } from '../features/managers/FootingManager';
import { ArenaEnvironmentManager } from '../features/managers/ArenaEnvironmentManager';
import { TranslationManager } from '../features/managers/TranslationManager';
import { TargetManager } from '../features/managers/TargetManager';
import { TriggerZoneManager } from '../features/managers/TriggerZoneManager';
import { RotationManager } from '../features/managers/RotationManager';
import { PresentationManager } from '../features/managers/PresentationManager';
import { RenderManager } from '../features/managers/RenderManager';
import type { SceneContext } from '../features/IArenaFeature';
import { ArenaSurfaceProvider, FlatSurfaceProvider } from '../features/surfaceProviders';
import type { ISurfaceProvider } from '../features/ISurfaceProvider';
import type { TranslationData } from '../types/arenaTypes';
import type { TranslationSave } from '../utils/arenaPersistence';
import { inputManager } from '../features/managers/InputManager';
import { pendingLoadStore } from '../stores/pendingLoadStore';
import { createArenaStateStore, type ArenaStateStore } from '../stores/arenaStateStore';

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
  private _arenaStore!: ArenaStateStore;

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
  private _wallMgr!:     WallManager;
  private _bridgeMgr!:  BridgeManager;
  private _slMgr!:      SpeedLineManager;
  private bridgesByArena = new Map<string, Set<string>>();
  private slSegSeq      = 0;
  private _obstacleMgr!: ObstacleManager;
  private _footingMgr!:  FootingManager;
  private _trapMgr!:     TrapManager;
  private _portalMgr!:   PortalManager;
  private _rotMgr!: RotationManager;
  private _jlMgr!: JumpLinkManager;
  private translations  = new Map<string, TranslationData>();
  private translationSeq = 0;
  private _surfaceProviders = new Map<string, ISurfaceProvider>();
  private _translationMgr: TranslationManager | null = null;
  private _targetMgr: TargetManager | null = null;
  private _triggerZoneMgr: TriggerZoneManager | null = null;
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
  private _presentMgr!: PresentationManager;
  private _arenaViewMode: 'hitbox' | 'both' | 'present' = 'both';
  private _viewBtns: HTMLButtonElement[] = [];
  /** Per-feature PresentConfig for the Presentation sub-node system. */
  private _presentConfigs = new Map<string, PresentConfig>();
  /** Per-feature ParticleConfig for the Particle Effect sub-node system. */
  private _particleConfigs = new Map<string, ParticleConfig>();
  /** Tracks which sub-node IDs (present-X, particle-X, weather-X) are in the tree. */
  private _subNodesAdded = new Set<string>();
  /** Tracks wallprofile-<arenaId> node IDs so they can be cleared on reset. */
  private _wallProfileNodes = new Set<string>();
  private _projectileMgr: ProjectileManager | null = null;
  private _spawnMgr:    SpawnManager | null = null;
  private _spawnMgrBtn: HTMLButtonElement | null = null;
  private _envMgr!: ArenaEnvironmentManager;
  private _projectionService!: ProjectionService;
  private _renderMgr!: RenderManager;
  private _scoreHudEl: HTMLDivElement | null = null;
  private _keyUnsubs: Array<() => void> = [];

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
    this._arenaStore = createArenaStateStore(this.arenaStorageKey);

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
        {label:'Add arena',   title:'Add arena',       className:'',        onClick:()=>this.addArena()},
        {label:'Add bridge',   title:'Add bridge',      className:'zone-btn',onClick:()=>this.addBridge()},
        {label:'Add obstacle', title:'Add obstacle',    className:'sl-btn',  onClick:()=>this.addObstacle()},
        {label:'Add base trap',   title:'Add base trap',   className:'pit-btn', onClick:()=>this.addTrap('octagon-base','base')},
        {label:'Add base portal', title:'Add base portal', className:'zone-btn',onClick:()=>this.addPortal('octagon-base','base')},
        {label:'Add footing',   title:'Add footing',     className:'pit-btn', onClick:()=>this.addFooting()},
        {label:'Add jump link',   title:'Add jump link',   className:'sl-btn',  onClick:()=>this._addJumpLink('octagon-base','base')},
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
      if(this.selectedSlId){ const prev=this._slMgr.get(this.selectedSlId); if(prev) this._slMgr.hideHandles(prev); }
      this.selectedSlId = null;
      this.selectedId = ids.length===1 ? ids[0] : null;
      // Show handles of newly selected speed line
      if(this.selectedId && this._slMgr.has(this.selectedId)){
        this.selectedSlId = this.selectedId;
        this._slMgr.showHandles(this._slMgr.get(this.selectedId)!);
      }
      this.renderProps();
    };

    this.sceneTree.onVisibilityToggle = (id, visible)=>{
      // Manager-owned objects (via RenderManager) + bare scene objects (arenas/pits/zones/octagon)
      this._renderMgr?.setVisible(id, visible);
      (this.sceneObjects.get(id)??[]).forEach(o=>{ o.visible=visible; });
    };

    this.sceneTree.onDelete = (ids)=>{
      this.captureUndo();
      for (const id of ids) {
        // Wall-profile nodes are deleted with their arena; ignore direct deletion
        if (id.startsWith('wallprofile-')) continue;
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
          this.arenas.delete(id); this._surfaceProviders.delete(id);
          this.updateTopFace(); this.updateAllMoatIslandCaps();
          // Clean up all sub-node tracking entries for this arena
          this._subNodesAdded.delete(`present-${id}`);
          this._subNodesAdded.delete(`particle-${id}`);
          this._subNodesAdded.delete(`weather-${id}`);
          this._subNodesAdded.delete(`env-${id}`);
          this._wallProfileNodes.delete(`wallprofile-${id}`);
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
          if(this._rotMgr.hasNode(id)) this._removeMemberFromRotation(id);
          this.removeZoneFromScene(id);
          if(parentArena){ this.updateArenaFloor(parentArena); this.updateArenaBowlHoles(parentArena,zone.parentArenaId); }
          continue;
        }
        if(this._slMgr.has(id)){ this.captureUndo(); this._removeSpeedLine(id); continue; }
        if(this._wallMgr.has(id)){
          if(this._rotMgr.hasNode(id)) this._removeMemberFromRotation(id);
          this.removeWall(id); continue;
        }
        if(this._bridgeMgr.getSegment(id) !== undefined){ this.removeSegment(id); continue; }
        if(this._bridgeMgr.has(id)){ this.removeBridge(id); continue; }
        if(this._obstacleMgr.has(id)){
          if(this._rotMgr.hasNode(id)) this._removeMemberFromRotation(id);
          this.removeObstacle(id); continue;
        }
        if(this._trapMgr.has(id)){
          if(this._rotMgr.hasNode(id)) this._removeMemberFromRotation(id);
          this.removeTrap(id); continue;
        }
        if(this._portalMgr.has(id)){ this.removePortal(id); continue; }
        if(this._jlMgr.has(id)){ this._removeJumpLink(id); continue; }
        if(this._rotMgr.has(id)){ this.removeRotation(id); continue; }
        if(this._footingMgr.has(id)){ this.removeFooting(id); continue; }
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
        if (t && !this._rotMgr.hasNode(cid)) { validIds.push(cid); validTypes.push(t); }
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
        s.walls = this._wallMgr.serializeAll(w => w.parentType==='arena' && w.parentId===id);
        s.speedLines = this._slMgr.serializeAll(sl => sl.parentArenaId===id && sl.parentZoneId===null);
        return s;
      }),
      bridges: [...this._bridgeMgr.getAll().values()].map(b => this._bridgeMgr.toSaveWithWalls(b, this._wallMgr.getAll() as Map<string, WallData>)),
      wallSeq: this._wallMgr.getSeq(), bridgeSeq: this._bridgeMgr.getSeq(), segmentSeq: this._bridgeMgr.getSegSeq(),
      speedLineSeq: this._slMgr.getSeq(),
      speedLines: this._slMgr.serializeAll(sl => sl.parentZoneId !== null),
      baseWalls: this._wallMgr.serializeAll(w => w.parentType==='base'),
      obstacles: this._obstacleMgr.serializeAll(),
      obstacleSeq: this._obstacleMgr.getSeq(),
      traps: this._trapMgr.serializeAll().map(ts => {
        ts.walls = this._wallMgr.serializeAll(w => w.parentType==='trap' && w.parentId===ts.id);
        return ts;
      }),
      trapSeq: this._trapMgr.getSeq(),
      portals: this._portalMgr.serializeAll(),
      portalSeq: this._portalMgr.getSeq(),
      rotations: this._rotMgr.serializeAll(),
      rotationSeq: this._rotMgr.getSeq(),
      footings: this._footingMgr.serializeAll(),
      footingSeq: this._footingMgr.getSeq(),
      jumpLinks: this._jlMgr.serializeAll(),
      jumpLinkSeq: this._jlMgr.getSeq(),
      translations: this._translationMgr
        ? ([...this._translationMgr.getAll().values()].map(d => this._translationMgr!.toSave(d)) as TranslationSave[])
        : [],
      translationSeq: this.translationSeq,
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
    this._presentMgr?.disposeAll();
    this._presentConfigs.clear();
    this._subNodesAdded.clear();
    this._wallProfileNodes.clear();
    // Detach rotation members first so other managers can cleanly dispose their objects
    this._rotMgr.detachAll();
    this._slMgr.clear();
    this.slSegSeq = 0;
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
    this._wallMgr.clear();
    this._bridgeMgr.clear();
    this.pits.clear(); this.zones.clear(); this.arenas.clear();
    this.bridgesByArena.clear();
    this._obstacleMgr.clear();
    this._trapMgr.clear();
    this._portalMgr.clear();
    this._footingMgr.clear();
    this._rotMgr.clear();
    this._jlMgr.clear();
    this._translationMgr?.clear();
    this.translations.clear(); this.translationSeq = 0;
    this._surfaceProviders.clear();
    this._surfaceProviders.set('octagon-base',
      new FlatSurfaceProvider('octagon-base', this.baseConfig.height, 0, 0));
    this.sceneObjects.clear();
    this.arenaSeq = 0; this.pitSeq = 0; this.zoneSeq = 0;
  }

  /** Rebuild the scene from an ArenaConfig (used by undo/redo). */
  private _applyConfigToScene(cfg: ArenaConfig): void {
    this._clearArenas();
    this.baseConfig = { ...this.baseConfig, ...cfg.baseConfig };
    this.rebuildBase();
    this.arenaSeq = cfg.arenaSeq; this.pitSeq = cfg.pitSeq; this.zoneSeq = cfg.zoneSeq;
    this._bridgeMgr.restoreSeq(cfg.bridgeSeq);
    this._bridgeMgr.restoreSegSeq(cfg.segmentSeq);
    this._slMgr.restoreSeq(cfg.speedLineSeq);
    this._wallMgr.restoreSeq(cfg.wallSeq);
    this._obstacleMgr.restoreSeq(cfg.obstacleSeq);
    this._trapMgr.restoreSeq(cfg.trapSeq);
    this._portalMgr.restoreSeq(cfg.portalSeq);
    this._rotMgr.restoreSeq(cfg.rotationSeq ?? 0);
    this._footingMgr.restoreSeq(cfg.footingSeq);
    this._jlMgr.restoreSeq(cfg.jumpLinkSeq ?? 0);
    this.translationSeq = cfg.translationSeq ?? 0;
    this._translationMgr?.restoreSeq(this.translationSeq);
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
    const wall = this._wallMgr.get(featureId);
    if (wall) return { stlb64: wall.presentStlb64, color: wall.presentColor };
    const bridge = this._bridgeMgr.get(featureId);
    if (bridge) return { stlb64: bridge.presentStlb64, color: bridge.presentColor };
    const obs = this._obstacleMgr.get(featureId);
    if (obs) return { stlb64: obs.presentStlb64, color: obs.presentColor };
    const trap = this._trapMgr.get(featureId);
    if (trap) return { stlb64: trap.presentStlb64, color: trap.presentColor };
    const portal = this._portalMgr.get(featureId);
    if (portal) return { stlb64: portal.presentStlb64, color: portal.presentColor };
    const footing = this._footingMgr.get(featureId);
    if (footing) return { stlb64: footing.presentStlb64, color: footing.presentColor };
    return { stlb64: null, color: 0xaaaaaa };
  }

  /** Load STL from PresentConfig and apply all transforms. */
  private _loadPresentStlWithConfig(featureId: string, cfg: PresentConfig): void {
    if (!cfg.stlb64) return;
    const bin = Uint8Array.from(atob(cfg.stlb64), c => c.charCodeAt(0));
    const loader = new STLLoader();
    const geo = loader.parse(bin.buffer);
    const hitbox = this._getHitboxMesh(featureId);
    const worldPos = hitbox ? hitbox.position.clone() : new THREE.Vector3();
    this._presentMgr.load(featureId, cfg, worldPos, geo);
  }

  /** Apply PresentConfig to an existing or new present mesh. */
  private _applyPresentConfig(featureId: string, cfg: PresentConfig): void {
    if (!cfg.stlb64) { this._disposePresentMesh(featureId); return; }
    const entry = this._presentMgr.getEntry(featureId);
    if (!entry) {
      this._loadPresentStlWithConfig(featureId, cfg);
    } else {
      const hitbox = this._getHitboxMesh(featureId);
      const worldPos = hitbox ? hitbox.position.clone() : new THREE.Vector3();
      this._presentMgr.updateTransform(featureId, cfg, worldPos);
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
    const isSpeedLine = this._slMgr.has(featureId);
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

  private _addSubNodeEnv(arenaId: string): void {
    const subId = `env-${arenaId}`;
    if (this._subNodesAdded.has(subId)) return;
    this._subNodesAdded.add(subId);
    this.sceneTree.add(subId, 'Environment', '🌍', arenaId);
  }

  private _showWallProfileNode(arenaId: string): void {
    const arena = this.arenas.get(arenaId); if (!arena) return;
    const onGeom = () => {
      this.captureUndo();
      applyArena(arena, this.getArenaHoles(arena), this.getScene() ?? undefined);
      this._applyArenaTilt(arena);
      this.updateArenaChildren(arena);
      this.updateArenaFloor(arena);
      this.updateIslandCap(arena, arenaId);
      this.updateArenaRimSeam(arena);
      this.updateAllMoatIslandCaps();
      this.updateTopFace();
      this.rebuildDependentsOf(arenaId);
      this.saveArena();
    };
    const onFull = () => { onGeom(); this.renderProps(); };
    this.props.showWallProfile(arena, onGeom, onFull);
  }

  private _onEnvChange(arenaId: string, changedProps: EnvProperty[]): void {
    const arena = this.arenas.get(arenaId); if (!arena) return;
    const weatherProps = ['weatherPreset','windEnabled','windDirectionDeg','windStrengthCms','windGustInterval','windGustMult'];
    if (changedProps.some(p => weatherProps.includes(p))) {
      this._createArenaWeather(arena);
      const mapped = arena.weatherSurfaceMap[arena.weatherPreset];
      if (mapped) {
        arena.surface = mapped;
        applyArena(arena, this.getArenaHoles(arena), this.getScene() ?? undefined);
        this._applyArenaTilt(arena);
        this.updateArenaChildren(arena);
        this.rebuildDependentsOf(arenaId);
      }
    }
    if (changedProps.includes('fogDensity')) this._createArenaFog(arena);
    if (changedProps.includes('tiltX') || changedProps.includes('tiltZ')) this._applyArenaTilt(arena);
    this.saveArena();
    if (this.selectedId === `env-${arenaId}`) this.renderProps();
  }

  private _createArenaFog(arena: ArenaData): void {
    if (arena.fogSystem) {
      this.removeFromScene(arena.fogSystem.points);
      arena.fogSystem.dispose();
      arena.fogSystem = null;
    }
    if (arena.fogDensity <= 0) return;
    const cfg = { ...defaultParticleConfig(), preset: 'fog' as import('../types/sharedTypes').ParticlePreset, density: arena.fogDensity };
    const ps = buildParticleSystem(cfg, arena.posX, arena.posZ, Math.max(arena.radiusX, arena.radiusZ), this.baseConfig.height + arena.posY, arena.depth);
    this.addToScene(ps.points);
    arena.fogSystem = ps;
  }

  private _applyArenaTilt(arena: ArenaData): void {
    if (!arena.mesh) return;
    const rx = arena.tiltX * DEG2RAD;
    const rz = arena.tiltZ * DEG2RAD;
    arena.mesh.rotation.x = rx;
    arena.mesh.rotation.z = rz;
    if (arena.edges)      { arena.edges.rotation.x = rx; arena.edges.rotation.z = rz; }
    if (arena.floorMesh)  { arena.floorMesh.rotation.x = rx; arena.floorMesh.rotation.z = rz; }
    if (arena.islandMesh) { arena.islandMesh.rotation.x = rx; arena.islandMesh.rotation.z = rz; }
    if (arena.rimSeamMesh){ arena.rimSeamMesh.rotation.x = rx; arena.rimSeamMesh.rotation.z = rz; }
    for (const m of arena.spiralMeshes ?? []) { m.rotation.x = rx; m.rotation.z = rz; }
  }

  private _showEnvNode(arenaId: string): void {
    const arena = this.arenas.get(arenaId);
    if (!arena) { this.props.showEmpty(); return; }
    const show = () => this.props.showEnvironment(arena, {
      onPhysicsChange: () => {
        this.captureUndo();
        // setGravity → _onEnvChange → saveArena(); no need to call saveArena() again
        this._envMgr.setGravity(arenaId, arena.gravityScale, arena.gravityDirectionX, arena.gravityDirectionZ);
        show();
      },
      onTiltChange: () => {
        this.captureUndo();
        this._onEnvChange(arenaId, ['tiltX', 'tiltZ']);
        show();
      },
      onFogChange: () => {
        this.captureUndo();
        this._createArenaFog(arena);
        this.saveArena();
        show();
      },
      onScoreChange: () => {
        this.captureUndo();
        this.saveArena();
        show();
      },
      onWeatherSurfaceChange: () => {
        this.captureUndo();
        this.saveArena();
        show();
      },
      addEntry: (e) => {
        this.captureUndo();
        this._envMgr.addEntry(arenaId, e);
        this.saveArena();
        show();
      },
      removeEntry: (entryId) => {
        this.captureUndo();
        this._envMgr.removeEntry(arenaId, entryId);
        this.saveArena();
        show();
      },
      updateEntry: (e) => {
        this.captureUndo();
        this._envMgr.updateEntry(arenaId, e);
        this.saveArena();
        show();
      },
    });
    show();
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
    // Merge bare sceneObjects (arenas/pits/zones/octagon) with renderMgr-owned objects (managers)
    const merged = new Map<string, THREE.Object3D[]>(this.sceneObjects);
    for (const [id, objs] of this._renderMgr.getAllEntries()) merged.set(id, objs);
    this._presentMgr.applyViewMode(this._arenaViewMode, merged);
  }
  private _loadPresentStl(nodeId: string, b64: string, color: number): void {
    const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const loader = new STLLoader();
    const geo = loader.parse(bin.buffer);
    const cfg: PresentConfig = {
      ...defaultPresentConfig(),
      stlb64: b64,
      color,
    };
    const hitbox = this._getHitboxMesh(nodeId);
    const worldPos = hitbox ? hitbox.position.clone() : new THREE.Vector3();
    this._presentMgr.load(nodeId, cfg, worldPos, geo);
  }
  private _disposePresentMesh(nodeId: string): void {
    this._presentMgr.dispose(nodeId);
  }
  private _getHitboxMesh(nodeId: string): THREE.Mesh | null {
    const arena = this.arenas.get(nodeId); if (arena) return arena.mesh;
    const obs = this._obstacleMgr.get(nodeId); if (obs) return obs.mesh;
    const trap = this._trapMgr.get(nodeId); if (trap) return trap.mesh;
    const portal = this._portalMgr.get(nodeId); if (portal) return portal.mesh;
    const wall = this._wallMgr.get(nodeId); if (wall?.mesh) return wall.mesh;
    const footing = this._footingMgr.get(nodeId); if (footing?.mesh) return footing.mesh;
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

  private _addSpeedLine(arenaId: string, parentZoneId: string | null = null): void {
    this.captureUndo();
    const arena = this.arenas.get(arenaId); if(!arena) return;
    const slSegRef = { value: this.slSegSeq };
    const sl = this._slMgr.add(arenaId, parentZoneId, slSegRef);
    if (!sl) return;
    this.slSegSeq = slSegRef.value;
    arena.speedLineIds.push(sl.id);
    this._checkSpeedLineOverlaps(arenaId);
    this.saveArena();
  }

  private _removeSpeedLine(id: string): void {
    const sl = this._slMgr.get(id); if(!sl) return;
    // Clear back-refs on bridges/traps that reference this SL
    if (sl.linkedBridgeId) {
      const bridge = this._bridgeMgr.get(sl.linkedBridgeId);
      if (bridge) bridge.linkedSpeedLineId = null;
    }
    if (sl.linkedTrapId) {
      const trap = this._trapMgr.get(sl.linkedTrapId);
      if (trap) trap.linkedSpeedLineId = null;
    }
    const arenaId = sl.parentArenaId;
    const arena = this.arenas.get(arenaId);
    if(arena) arena.speedLineIds = arena.speedLineIds.filter(x=>x!==id);
    if(sl.parentZoneId){ const z=this.zones.get(sl.parentZoneId); if(z) z.speedLineIds=z.speedLineIds.filter(x=>x!==id); }
    if(this.selectedSlId===id){ this.selectedSlId=null; }
    this._slMgr.remove(id);
    this._checkSpeedLineOverlaps(arenaId);
    this.saveArena();
  }

  /** Auto-create an arena-level speed line and link it to a bridge. */
  private _autoLinkSpeedLine(bridgeId: string, segType: BridgeSegmentType, arenaId: string): void {
    const bridge = this._bridgeMgr.get(bridgeId); if (!bridge) return;
    if (bridge.linkedSpeedLineId) return; // already linked
    const arena  = this.arenas.get(arenaId); if (!arena) return;

    const slSegRef = { value: this.slSegSeq };
    const sl = this._slMgr.add(arenaId, null, slSegRef);
    if (!sl) return;
    this.slSegSeq = slSegRef.value;

    sl.linkedBridgeId = bridgeId;
    sl.targetType     = 'linked_bridge';
    sl.targetBridgeId = bridgeId;

    // Choose preset based on segment type
    if (segType === 'loop' || segType === 'return_loop' || segType === 'exit_loop') {
      sl.presetType = 'circle';
    } else if (segType === 'corkscrew') {
      sl.presetType = 'helix';
    } else if (segType === 'hairpin') {
      sl.presetType = 'spiral_in';
    }

    arena.speedLineIds.push(sl.id);
    bridge.linkedSpeedLineId = sl.id;
    this._slMgr.apply(sl);
  }

  /** Auto-create an arena-level speed line and link it to a trap. */
  private _autoLinkTrapSpeedLine(trapId: string, arenaId: string): void {
    const trap  = this._trapMgr.get(trapId);   if (!trap)  return;
    if (trap.linkedSpeedLineId) return;
    const arena = this.arenas.get(arenaId); if (!arena) return;

    const slSegRef = { value: this.slSegSeq };
    const sl = this._slMgr.add(arenaId, null, slSegRef);
    if (!sl) return;
    this.slSegSeq = slSegRef.value;

    sl.linkedTrapId = trapId;
    sl.targetType   = 'linked_trap';
    sl.targetTrapId = trapId;

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
      default: this._slMgr.remove(sl.id); return; // no SL for freeze/reverse_controls/hidden_pit
    }

    arena.speedLineIds.push(sl.id);
    trap.linkedSpeedLineId = sl.id;
    this._slMgr.apply(sl);
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
      const dstW = resolveEndpointWorld(ep, this.arenas, this._obstacleMgr.getAll() as Map<string, ObstacleData>, this._trapMgr.getAll() as Map<string, TrapData>,
        id => this._slMgr.get(id), this.baseConfig.height);
      const dx = dstW.x - arena.posX; const dz = dstW.z - arena.posZ;
      const cosR = Math.cos(-arena.rotY * DEG2RAD); const sinR = Math.sin(-arena.rotY * DEG2RAD);
      p.endPosX = dx * cosR - dz * sinR;
      p.endPosZ = dx * sinR + dz * cosR;
      p.endPosY = dstW.y;
    }

    this._slMgr.apply(sl);
  }

  private _addSegmentsToLine(slId: string, segs: SpeedLineSegment[]): void {
    const sl = this._slMgr.get(slId); if(!sl) return;
    for(const seg of segs){ seg.id = `${slId}-seg-${++this.slSegSeq}`; }
    sl.segments.push(...segs);
    this._updateSpeedLine(sl);
    this.saveArena();
  }

  private _removeSegmentFromLine(slId: string, k: number): void {
    const sl = this._slMgr.get(slId); if(!sl) return;
    if(sl.segments.length<=1) return;
    sl.segments.splice(k, 1);
    this._updateSpeedLine(sl);
    this.saveArena();
  }

  private _showSlHandles(sl: SpeedLineData): void { sl.handleMeshes.forEach(h=>{ h.visible=true; }); }
  private _hideSlHandles(sl: SpeedLineData): void { sl.handleMeshes.forEach(h=>{ h.visible=false; }); }

  private _checkSpeedLineOverlaps(arenaId: string): void {
    const arena = this.arenas.get(arenaId); if(!arena) return;
    const arenaLines = [...this._slMgr.getAll().values()].filter(sl=>sl.parentArenaId===arenaId);

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
    this._slMgr.restoreData(sls);
    for(const sls_ of sls){
      const sl = this._slMgr.get(sls_.id)!;
      arena.speedLineIds.push(sl.id);
      if(sl.parentZoneId){ const z=this.zones.get(sl.parentZoneId); if(z && !z.speedLineIds.includes(sl.id)) z.speedLineIds.push(sl.id); }
      this._slMgr.buildAndShow(sl);
    }
  }

  /* ── Speed line drag interaction ─────────────────────────────────────── */

  private _slPointerDown(e: PointerEvent): void {
    const sl = this.selectedSlId ? this._slMgr.get(this.selectedSlId) : null;
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
      const sl = this.selectedSlId ? this._slMgr.get(this.selectedSlId) : null;
      if(sl) {
        const hits = this.slRaycaster.intersectObjects(sl.handleMeshes, false);
        for(const h of sl.handleMeshes) (h.material as THREE.MeshBasicMaterial).color.setHex(SL.HANDLE_COLOR);
        if(hits.length) ((hits[0].object as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setHex(SL.HANDLE_HOVER_COLOR);
      }
      return;
    }

    const { slId, handleType, handleIndex, dragPlane } = this.slDrag;
    const sl = this._slMgr.get(slId); if(!sl) return;
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


  /* ── Wall helpers ─────────────────────────────────────────────────────── */

  /** Rebuild mesh+edges for a wall and add/replace in scene. Delegates to WallManager. */
  private applyWall(wall: WallData, _rebuildingSiblings?: Set<string>): void {
    this._wallMgr.apply(wall, _rebuildingSiblings);
  }

  private addWall(parentId: string, parentType: WallData['parentType']): void {
    this.captureUndo();
    let data!: WallData;
    const treeOpts = {
      addChildButtons: [
        { label:'Add rotation', title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(data.id,'wall'); this.addRotation([data.id],['wall'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'Add presentation', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(data.id) },
      ],
    };
    switch (parentType) {
      case 'arena':  data = this._wallMgr.addToArena(parentId, treeOpts); break;
      case 'base':   data = this._wallMgr.addToBase(treeOpts); break;
      case 'trap':   data = this._wallMgr.addToTrap(parentId, treeOpts); break;
      case 'bridge': data = this._wallMgr.addToBridge(parentId, treeOpts); break;
    }
    if (parentType === 'arena') {
      const arena = this.arenas.get(parentId);
      if (arena && !arena.wallIds.includes(data.id)) arena.wallIds.push(data.id);
    }
    if (parentType === 'bridge') {
      const bridge = this._bridgeMgr.get(parentId);
      if (bridge && !bridge.wallIds.includes(data.id)) bridge.wallIds.push(data.id);
    }
    this.saveArena();
  }

  private removeWall(id: string): void {
    const wall = this._wallMgr.get(id); if(!wall) return;
    if(wall.parentType==='arena'){
      const arena=this.arenas.get(wall.parentId);
      if(arena) arena.wallIds=arena.wallIds.filter(x=>x!==id);
    }
    if(wall.parentType==='bridge'){
      const bridge=[...this._bridgeMgr.getAll().values()].find(b=>b.wallIds.includes(id));
      if(bridge) bridge.wallIds=bridge.wallIds.filter(x=>x!==id);
    }
    this._wallMgr.remove(id);
    this.saveArena();
  }

  /* ── Obstacle methods ────────────────────────────────────────────────── */

  private addObstacle(): void {
    this.captureUndo();
    let data!: ObstacleData;
    data = this._obstacleMgr.add({
      addChildButtons: [
        { label:'Add rotation', title:'Add rotation',     className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(data.id,'obstacle'); this.addRotation([data.id],['obstacle'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'Add jump link', title:'Add jump link',    className:'sl-btn',  onClick:()=>this._addJumpLink(data.id,'obstacle') },
        { label:'Add presentation', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(data.id) },
      ],
    });
    this.saveArena();
  }

  private removeObstacle(id: string): void {
    this._obstacleMgr.remove(id);
    this.saveArena();
  }

  private _restoreObstacleSave(os: ObstacleSave): void {
    this._obstacleMgr.restoreData([os]);
    const data = this._obstacleMgr.get(os.id)!;
    this._obstacleMgr.buildAndShow(data, {
      addChildButtons: [
        { label:'Add rotation', title:'Add rotation',     className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(os.id,'obstacle'); this.addRotation([os.id],['obstacle'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'Add jump link', title:'Add jump link',    className:'sl-btn',  onClick:()=>this._addJumpLink(os.id,'obstacle') },
        { label:'Add presentation', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(os.id) },
      ],
    });
    if (data.presentStlb64) this._loadPresentStl(os.id, data.presentStlb64, data.presentColor);
  }

  /* ── Footing methods ─────────────────────────────────────────────────── */

  private addFooting(): void {
    this.captureUndo();
    let data!: BaseFootingData;
    data = this._footingMgr.add({
      addChildButtons: [
        { label:'Add presentation', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(data.id) },
      ],
    });
    this._applyViewMode();
    this.saveArena();
  }

  private removeFooting(id: string): void {
    this._footingMgr.remove(id);
    this._disposePresentMesh(id);
    this.saveArena();
  }

  private _restoreFootingSave(fs: BaseFootingSave): void {
    this._footingMgr.restoreData([fs]);
    const data = this._footingMgr.get(fs.id)!;
    this._footingMgr.buildAndShow(data, {
      addChildButtons: [
        { label:'Add presentation', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(fs.id) },
      ],
    });
    if (data.presentStlb64) this._loadPresentStl(fs.id, data.presentStlb64, data.presentColor);
  }

  /* ── Trap methods ────────────────────────────────────────────────────── */

  private addTrap(parentId: string, parentType: 'arena' | 'base'): void {
    this.captureUndo();
    let data!: TrapData;
    data = this._trapMgr.add(parentId, parentType, {
      addChildButtons: [
        { label:'Add wall', title:'Add wall',           onClick:()=>this.addWall(data.id, 'trap') },
        { label:'Add rotation',  title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(data.id,'trap'); this.addRotation([data.id],['trap'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'Add jump link',  title:'Add jump link',   className:'sl-btn',  onClick:()=>this._addJumpLink(data.id,'trap') },
        { label:'Add presentation',  title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(data.id) },
        { label:'Add particle effect',  title:'Add particle effect',className:'zone-btn',onClick:()=>this._addSubNodeParticle(data.id) },
      ],
    });
    if (parentType === 'arena') this._autoLinkTrapSpeedLine(data.id, parentId);
    this.saveArena();
  }

  private removeTrap(id: string): void {
    const trap = this._trapMgr.get(id); if (!trap) return;
    if (trap.linkedSpeedLineId) {
      const sl = this._slMgr.get(trap.linkedSpeedLineId);
      if (sl) sl.linkedTrapId = null;
    }
    this._trapMgr.removeWithWalls(id, (trapId) => {
      const trapWallIds = [...this._wallMgr.getAll().values()]
        .filter(w => w.parentType === 'trap' && w.parentId === trapId)
        .map(w => w.id);
      for (const wid of trapWallIds) this._wallMgr.remove(wid);
    });
    this.saveArena();
  }

  private _getTrapSurfY(trap: TrapData): number {
    return trapSurfY(trap, this.arenas, this.baseConfig.height);
  }

  private _restoreTrapSave(ts: TrapSave): void {
    this._trapMgr.restoreData([ts]);
    const data = this._trapMgr.get(ts.id)!;
    this._trapMgr.buildAndShow(data, {
      addChildButtons: [
        { label:'Add wall', title:'Add wall',           onClick:()=>this.addWall(ts.id, 'trap') },
        { label:'Add rotation',  title:'Add rotation',    className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(ts.id,'trap'); this.addRotation([ts.id],['trap'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'Add jump link',  title:'Add jump link',   className:'sl-btn',   onClick:()=>this._addJumpLink(ts.id,'trap') },
        { label:'Add presentation',  title:'Add presentation', className:'pit-btn',  onClick:()=>this._addSubNodePresent(ts.id) },
        { label:'Add particle effect',  title:'Add particle effect',className:'zone-btn',onClick:()=>this._addSubNodeParticle(ts.id) },
      ],
    });
    if (data.presentStlb64) this._loadPresentStl(ts.id, data.presentStlb64, data.presentColor);
    for (const ws of ts.walls) this._restoreWallSave(ws, ts.id);
  }

  /* ── Portal methods ──────────────────────────────────────────────────── */

  private addPortal(parentId: string, parentType: 'arena' | 'base'): void {
    this.captureUndo();
    let data!: PortalData;
    data = this._portalMgr.add(parentId, parentType, {
      addChildButtons: [
        { label:'Add presentation', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(data.id) },
      ],
    });
    this.saveArena();
  }

  private removePortal(id: string): void {
    this._portalMgr.remove(id);
    this.saveArena();
  }

  private _restorePortalSave(ps: PortalSave): void {
    this._portalMgr.restoreData([ps]);
    const data = this._portalMgr.get(ps.id)!;
    this._portalMgr.buildAndShow(data, {
      addChildButtons: [
        { label:'Add presentation', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(ps.id) },
      ],
    });
    if (data.presentStlb64) this._loadPresentStl(ps.id, data.presentStlb64, data.presentColor);
  }

  /* ── Jump Link methods ───────────────────────────────────────────────── */

  private _addJumpLink(srcParentId: string, srcParentType: JumpLinkParentType): void {
    this.captureUndo();
    this._jlMgr.add(srcParentId, srcParentType);
    this.saveArena();
  }


  private _removeJumpLink(id: string): void {
    if (!this._jlMgr.has(id)) return;
    // Clear stale jumpLinkId references on speed lines
    for (const sl of this._slMgr.getAll().values()) {
      if (sl.jumpLinkId === id) sl.jumpLinkId = null;
    }
    this._jlMgr.remove(id);
    this.saveArena();
  }

  private _restoreJumpLinkSave(saves: JumpLinkSave[]): void {
    this._jlMgr.restoreData(saves);
    for (const save of saves) {
      const data = this._jlMgr.get(save.id)!;
      const treeParent = data.src.parentType === 'base' ? 'octagon-base' : data.src.parentId;
      this._jlMgr.buildAndShow(data, treeParent);
    }
  }

  /** Returns Map<id, name> of all speed lines — used to populate speed path dropdowns. */
  private _getSpeedLineNames(): Map<string, string> {
    return new Map([...this._slMgr.getAll().entries()].map(([slId, sl])=>[slId, sl.name]));
  }

  /** Rebuild all walls attached to an arena, then rebuild dependent bridges. */
  private rebuildDependentsOf(arenaId: string): void {
    for(const wall of this._wallMgr.getAll().values()){
      if(wall.parentType==='arena' && wall.parentId===arenaId) this._wallMgr.apply(wall);
    }
    const depBridges=this.bridgesByArena.get(arenaId);
    if(depBridges){
      for(const bid of depBridges){
        const bridge=this._bridgeMgr.get(bid);
        if(bridge && bridge.segmentIds.length>0) this._bridgeMgr.applyBridgeFromSegment(bridge.segmentIds[0]);
      }
    }
  }

  /* ── Bridge helpers ───────────────────────────────────────────────────── */

  private addBridge(): void {
    this.captureUndo();
    let data!: BridgeData;
    const treeOpts = {
      addChildButtons: [
        { label:'Add segment', title:'Add segment',      className:'zone-btn', onClick:()=>this.addSegment(data.id,'straight') },
        { label:'Add wall',   title:'Add wall',         className:'pit-btn',  onClick:()=>this.addWall(data.id,'bridge') },
        { label:'Add presentation',   title:'Add presentation', className:'sl-btn',   onClick:()=>this._addSubNodePresent(data.id) },
      ],
    };
    data = this._bridgeMgr.add(treeOpts);
    this.saveArena();
  }

  private removeBridge(id: string): void {
    const bridge = this._bridgeMgr.get(id); if (!bridge) return;
    // Clear back-ref on the linked SL
    if (bridge.linkedSpeedLineId) {
      const sl = this._slMgr.get(bridge.linkedSpeedLineId);
      if (sl) sl.linkedBridgeId = null;
    }
    // Remove from dependency index before disposal
    if (bridge.startRef?.type === 'arena') {
      const set = this.bridgesByArena.get(bridge.startRef.id);
      if (set) { set.delete(id); if (!set.size) this.bridgesByArena.delete(bridge.startRef.id); }
    }
    this._bridgeMgr.removeWithWalls(id, (wid) => this._wallMgr.remove(wid));
    this.saveArena();
  }

  private addSegment(bridgeId: string, type: BridgeSegmentType): void {
    const bridge = this._bridgeMgr.get(bridgeId); if (!bridge) return;
    this.captureUndo();
    const seg = this._bridgeMgr.addSegment(bridgeId, type);
    if (!seg) return;
    if (['loop','return_loop','exit_loop','corkscrew','hairpin'].includes(type)) {
      const arenaRef = bridge.startRef?.type === 'arena' ? bridge.startRef.id : null;
      if (arenaRef) this._autoLinkSpeedLine(bridgeId, type, arenaRef);
    }
    this.saveArena();
  }

  private removeSegment(id: string): void {
    const seg = this._bridgeMgr.getSegment(id); if (!seg) return;
    this.captureUndo();
    this._bridgeMgr.removeSegment(id);
    this.saveArena();
  }

  /* ── Rotation animation tick ─────────────────────────────────────────── */

  protected override onTick(dtMs: number): void {
    const dt = dtMs / 1000;

    // Stage 1: Environment (defines physics constants for this frame)
    this._envMgr?.tick(dt);

    // Stage 2: Particle/Weather systems (independent of physics)
    for (const arena of this.arenas.values()) {
      if (arena.particleSystem) arena.particleSystem.tick(dt);
      if (arena.weatherSystem)  arena.weatherSystem.tick(dt);
      if (arena.fogSystem)      arena.fogSystem.tick(dt);
    }
    for (const zone of this.zones.values()) {
      if (zone.particleSystem) zone.particleSystem.tick(dt);
    }
    for (const pit of this.pits.values()) {
      if (pit.particleSystem) pit.particleSystem.tick(dt);
    }

    // Stage 3: Animation transforms (position all entities for this frame)
    this._trapMgr.tick(dt);
    this._wallMgr.tick(dt);
    this._rotMgr.tick(dt);
    this._translationMgr?.tick(dt);
    this._bridgeMgr.tick(dtMs);
    if (!this._projectileMgr) {
      const scene = this.getScene();
      if (scene) {
        this._projectileMgr = new ProjectileManager(scene, () => this._slMgr.getAll() as Map<string, SpeedLineData>);
      }
    }
    this._projectileMgr?.tick(dt);

    // Stage 4: Physics (reads stage 1 constants + stage 3 final positions)
    this._spawnMgr?.tick(dtMs);

    // Stage 5: Target tracking
    this._targetMgr?.tick(dt);

    // Stage 6: Trigger detection
    this._triggerZoneMgr?.tick(dt);

    // Stage 7: Presentation / UI
    this._presentMgr?.tick(dt);
    if (this._scoreHudEl) {
      let showHud = false; let lines = '';
      for (const arena of this.arenas.values()) {
        if (arena.pointsPerSecond > 0) {
          showHud = true;
          lines += `${arena.name}: ${arena._score.toFixed(0)} pts\n`;
        }
      }
      this._scoreHudEl.style.display = showHud ? '' : 'none';
      this._scoreHudEl.textContent = lines.trim();
    }
  }

  /** For trap/zone members: after pivotGroup rotates, fix Y to follow arena bowl surface. */
  private _applyFloorCorrection(rot: RotationData): void {
    const pg = rot.pivotGroup; if (!pg) return;
    const wp = new THREE.Vector3();
    for (const mid of rot.memberIds) {
      const trap = this._trapMgr.get(mid);
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
    const trap = this._trapMgr.get(nodeId);
    if (trap) { objs.push(trap.mesh, trap.edges); if (trap.variantMesh) objs.push(trap.variantMesh); return objs; }
    const obs = this._obstacleMgr.get(nodeId);
    if (obs) { return [obs.mesh, obs.edges]; }
    const zone = this.zones.get(nodeId);
    if (zone) { objs.push(zone.mesh, zone.edges); if (zone.seamMesh) objs.push(zone.seamMesh); return objs; }
    const wall = this._wallMgr.get(nodeId);
    if (wall) { if (wall.mesh) objs.push(wall.mesh); if (wall.edges) objs.push(wall.edges); return objs; }
    return objs;
  }

  private _nodeTypeOf(id: string): RotationNodeType | undefined {
    if (this._trapMgr.has(id))          return 'trap';
    if (this._obstacleMgr.has(id)) return 'obstacle';
    if (this.zones.has(id))     return 'zone';
    if (this._wallMgr.has(id))  return 'wall';
    return undefined;
  }

  private _defaultPivotForMember(nodeId: string, nodeType: RotationNodeType): { pivotX: number; pivotY: number; pivotZ: number } {
    if (nodeType === 'trap') {
      const trap = this._trapMgr.get(nodeId);
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
      const obs = this._obstacleMgr.get(nodeId);
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
      const wall = this._wallMgr.get(nodeId);
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
      const trap = this._trapMgr.get(id);
      if (trap) return trap.parentType === 'base' ? 'octagon-base' : trap.parentId;
      const obs = this._obstacleMgr.get(id); if (obs) return 'octagon-base';
      const zone = this.zones.get(id);
      if (zone) return zone.parentZoneId ?? zone.parentArenaId;
      const wall = this._wallMgr.get(id);
      if (wall) return wall.parentType === 'base' ? 'octagon-base' : wall.parentId;
      return null;
    };
    const first = getParent(nodeIds[0]);
    if (nodeIds.every(id => getParent(id) === first)) return first;
    return null;
  }

  private addRotation(memberIds: string[], memberTypes: RotationNodeType[], pivotX: number, pivotY: number, pivotZ: number): void {
    this.captureUndo();
    const treeParent = this._commonTreeParent(memberIds) ?? 'octagon-base';
    const rot = this._rotMgr.add(memberIds, memberTypes, pivotX, pivotY, pivotZ, treeParent);
    if (!rot) return;
    this.saveArena();
  }

  private removeRotation(id: string): void {
    this._rotMgr.remove(id);
    this.saveArena();
  }

  private _removeMemberFromRotation(nodeId: string): void {
    this._rotMgr.removeMember(nodeId);
  }

  /**
   * Called after applyTrap/applyObstacle/applyZone/applyWall for any node in a rotation.
   * The apply functions set mesh.position in scene-root coords; we need to correct to group-local.
   */
  private _afterApply(nodeId: string): void {
    this._rotMgr.afterApply(nodeId);
  }

  private _updateRotationPivot(rot: RotationData): void {
    this._rotMgr.updatePivot(rot);
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

    this._renderMgr = new RenderManager(scene);

    const mgrCtx: SceneContext = {
      scene:     scene,
      sceneTree: this.sceneTree,
      getFallbackY: () => this.baseConfig.height,
      renderMgr: this._renderMgr,
    };
    this._obstacleMgr = new ObstacleManager(mgrCtx);
    this._footingMgr  = new FootingManager(mgrCtx);
    this._trapMgr     = new TrapManager(
      mgrCtx,
      (surfaceId) => this._surfaceProviders.get(surfaceId),
      (trap) => this._envMgr.triggerEvent(trap.envTargetArenaId || trap.parentId, trap.envTriggerEvent),
    );
    this._portalMgr   = new PortalManager(mgrCtx, (surfaceId) => this._surfaceProviders.get(surfaceId));
    this._wallMgr     = new WallManager(
      mgrCtx,
      (id) => this.arenas.get(id),
      () => this.arenas,
      (id) => this._trapMgr.get(id),
      (trap) => this._getTrapSurfY(trap),
    );
    this._bridgeMgr = new BridgeManager(
      mgrCtx,
      () => this.arenas,
      () => this._wallMgr.getAll() as Map<string, WallData>,
    );

    this._projectionService = new ProjectionService(
      () => this.arenas, () => this._wallMgr.getAll() as Map<string, WallData>, () => this._obstacleMgr.getAll(),
      () => this.bridgesByArena, () => this._bridgeMgr.getAll(), () => this._bridgeMgr.getAllSegments(),
    );

    this._slMgr = new SpeedLineManager(
      mgrCtx,
      (id) => this.arenas.get(id),
      () => this.zones,
      (arenaId) => this._projectionService.buildProjector(arenaId),
    );

    this._rotMgr = new RotationManager(
      mgrCtx,
      (nodeId) => this._getMemberObjects(nodeId),
      (rot)    => this._applyFloorCorrection(rot),
      (id)     => this._bridgeMgr.get(id) as { group: THREE.Group } | undefined,
    );

    this._jlMgr = new JumpLinkManager(
      mgrCtx,
      () => this.arenas,
      () => this._obstacleMgr.getAll() as ReadonlyMap<string, ObstacleData>,
      () => this._trapMgr.getAll() as ReadonlyMap<string, TrapData>,
      (id) => this._slMgr.get(id),
    );

    this._presentMgr = new PresentationManager(mgrCtx);

    // Instantiate before loadArena() so any tick/triggerEvent calls during restore are safe
    this._envMgr = new ArenaEnvironmentManager(
      () => this.arenas,
      (arenaId, props) => this._onEnvChange(arenaId, props),
      (_arenaId, ev) => console.log('[sound]', _arenaId, ev),
    );

    this.loadArena();

    const scoreHud = this.addOverlayPanel('arena-score-hud') as HTMLDivElement;
    scoreHud.style.cssText = 'position:absolute;right:calc(8*var(--mm));bottom:calc(6*var(--cm));background:rgba(0,0,0,0.75);color:#00e5ff;font-family:Orbitron,sans-serif;font-size:calc(1.4*var(--cm));padding:calc(4*var(--mm)) calc(8*var(--mm));border:1px solid rgba(0,229,255,0.4);white-space:pre;display:none;pointer-events:none;';
    this._scoreHudEl = scoreHud;

    const smCtx: SceneContext = {
      scene:     scene,
      sceneTree: this.sceneTree,
      getFallbackY: () => this.baseConfig.height,
      renderMgr: this._renderMgr,
    };
    const smHud = this.addOverlayPanel('spawn-manager-hud');
    this._spawnMgr = new SpawnManager(
      smCtx,
      () => this.getCamera(),
      () => this.getControls(),
      () => this.arenas,
      () => this._trapMgr.getAll() as Map<string, TrapData>,
      () => this._slMgr.getAll() as Map<string, SpeedLineData>,
      () => this.zones,
      () => this._wallMgr.getAll() as Map<string, WallData>,
      smHud,
      () => inputManager,
    );
    this._spawnMgrBtn = this.addTopBarButton('⚽ Spawn', 'Spawn/despawn physics test top');
    this._spawnMgrBtn.addEventListener('click', () => {
      if (this._spawnMgr?.isSpawned) this._spawnMgr.despawn();
      else this._spawnMgr?.spawn();
      this._spawnMgrBtn!.classList.toggle('active', this._spawnMgr?.isSpawned ?? false);
    });

    // TranslationManager — path-animation for member objects
    this._translationMgr = new TranslationManager(
      smCtx,
      (nodeId) => this._getMemberObjects(nodeId),
    );

    // TargetManager — runtime target-tracking bindings (not serialized)
    this._targetMgr = new TargetManager(
      (nodeId) => {
        const objs = this._getMemberObjects(nodeId);
        if (objs.length === 0) return null;
        const p = new THREE.Vector3(); objs[0].getWorldPosition(p); return p;
      },
      (nodeId, pos) => {
        for (const obj of this._getMemberObjects(nodeId)) obj.position.copy(pos);
      },
    );

    // TriggerZoneManager — spatial cylinder-overlap events (not serialized)
    this._triggerZoneMgr = new TriggerZoneManager(
      (nodeId) => {
        const objs = this._getMemberObjects(nodeId);
        if (objs.length === 0) return null;
        const p = new THREE.Vector3(); objs[0].getWorldPosition(p); return p;
      },
    );

    // Register flat surface provider for the octagon base
    this._surfaceProviders.set('octagon-base',
      new FlatSurfaceProvider('octagon-base', this.baseConfig.height, 0, 0));
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
    for(const arena of this.arenas.values()){ if(arena.depth>H) arena.depth=H; applyArena(arena,this.getArenaHoles(arena),this.getScene()??undefined); this._applyArenaTilt(arena); this.updateArenaChildren(arena); this.updateArenaRimSeam(arena); }
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
      const sl = this._slMgr.get(slId); if (!sl) continue;
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
      const sl = this._slMgr.get(slId); if (!sl) continue;
      this._updateSpeedLine(sl);
    }
  }

  /* ── Properties panel ── */
  private renderProps(): void {
    const id=this.selectedId;
    if(!id){ this.props.showEmpty(); return; }

    // Sub-node routing
    if (id.startsWith('present-'))      { this._showPresentNode(id.slice(8));  return; }
    if (id.startsWith('particle-'))     { this._showParticleNode(id.slice(9)); return; }
    if (id.startsWith('weather-'))      { this._showWeatherNode(id.slice(8));  return; }
    if (id.startsWith('env-'))          { this._showEnvNode(id.slice(4));      return; }
    if (id.startsWith('wallprofile-'))  { this._showWallProfileNode(id.slice('wallprofile-'.length)); return; }

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
        ()=>{ this.captureUndo(); applyArena(arena,this.getArenaHoles(arena),this.getScene()??undefined); this._applyArenaTilt(arena); this.updateArenaChildren(arena); this.updateArenaFloor(arena); this.updateIslandCap(arena,id); this.updateArenaRimSeam(arena); this.updateAllMoatIslandCaps(); this.updateTopFace(); this.rebuildDependentsOf(id); this.saveArena(); },
        ()=>{ this.captureUndo(); applyArena(arena,this.getArenaHoles(arena),this.getScene()??undefined); this._applyArenaTilt(arena); this.updateArenaChildren(arena); this.updateArenaFloor(arena); this.updateIslandCap(arena,id); this.updateArenaRimSeam(arena); this.updateAllMoatIslandCaps(); this.updateTopFace(); this.rebuildDependentsOf(id); this.renderProps(); this.saveArena(); },
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

    const sl=this._slMgr.get(id);
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
        () => [...this._bridgeMgr.getAll().values()],
        () => [...this._trapMgr.getAll().values()],
        () => [...this._jlMgr.getAll().values()],
      );
      return;
    }

    const wall=this._wallMgr.get(id);
    if(wall){
      const parentArena = wall.parentType==='arena' ? this.arenas.get(wall.parentId) : undefined;
      const showW=()=>this.props.showWall(
        wall,
        ()=>{ this.captureUndo(); this._wallMgr.apply(wall); this.saveArena(); },
        ()=>{ this.captureUndo(); this._wallMgr.apply(wall); this.saveArena(); showW(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        (cb)=>this._fileInputStl(id,wall.presentColor,cb),
        ()=>{ wall.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
        parentArena,
      );
      showW();
      return;
    }

    const bridge=this._bridgeMgr.get(id);
    if(bridge){
      const arenaNames = new Map([...this.arenas.entries()].map(([aid,a])=>[aid,a.name]));
      const wallNames  = new Map([...this._wallMgr.getAll().entries()].map(([wid,w])=>[wid,w.name]));
      const showB = () => this.props.showBridge(
        bridge, arenaNames, wallNames,
        ()=>{ this.captureUndo(); if(bridge.segmentIds.length>0) this._bridgeMgr.applyBridgeFromSegment(bridge.segmentIds[0]); this.saveArena(); showB(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        (type)=>{ this.addSegment(id, type as BridgeSegmentType); },
        (cb)=>this._fileInputStl(id,bridge.presentColor,cb),
        ()=>{ bridge.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
        () => [...this._slMgr.getAll().values()].map(s => ({ id: s.id, name: s.name })),
      );
      showB();
      return;
    }

    const seg=this._bridgeMgr.getSegment(id);
    if(seg){
      const showS = () => this.props.showBridgeSegment(
        seg,
        ()=>{ this.captureUndo(); this._bridgeMgr.applyBridgeFromSegment(seg.id); this.saveArena(); showS(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        ()=>{ showS(); },
      );
      showS();
      return;
    }

    const obstacle=this._obstacleMgr.get(id);
    if(obstacle){
      const showO=()=>this.props.showObstacle(
        obstacle,
        ()=>{ this.captureUndo(); this._obstacleMgr.apply(obstacle); this.saveArena(); },
        ()=>{ this.captureUndo(); this._obstacleMgr.apply(obstacle); this.saveArena(); showO(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        this._getSpeedLineNames(),
        (cb)=>this._fileInputStl(id,obstacle.presentColor,cb),
        ()=>{ obstacle.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
      );
      showO();
      return;
    }

    const trap=this._trapMgr.get(id);
    if(trap){
      const showT=()=>this.props.showTrap(
        trap,
        ()=>{ this.captureUndo(); this._trapMgr.apply(trap); this.saveArena(); },
        ()=>{ this.captureUndo(); this._trapMgr.apply(trap); this.saveArena(); showT(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        this._getSpeedLineNames(),
        (cb)=>this._fileInputStl(id,trap.presentColor,cb),
        ()=>{ trap.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
        () => [...this._slMgr.getAll().values()].map(s => ({ id: s.id, name: s.name })),
      );
      showT();
      return;
    }

    const portal=this._portalMgr.get(id);
    if(portal){
      const arenaNames = new Map([...this.arenas.entries()].map(([aid,a])=>[aid,a.name]));
      const portalNames = new Map([...this._portalMgr.getAll().entries()].map(([pid,p])=>[pid,p.name]));
      const showPo=()=>this.props.showPortal(
        portal, arenaNames, portalNames,
        ()=>{ this.captureUndo(); this._portalMgr.apply(portal); this.saveArena(); },
        ()=>{ this.captureUndo(); this._portalMgr.apply(portal); this.saveArena(); showPo(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        (cb)=>this._fileInputStl(id,portal.presentColor,cb),
        ()=>{ portal.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
      );
      showPo();
      return;
    }

    const jl=this._jlMgr.get(id);
    if(jl){
      const arenaNames    = new Map([...this.arenas.entries()].map(([aid,a])=>[aid,a.name]));
      const obstacleNames = new Map([...this._obstacleMgr.getAll().entries()].map(([oid,o])=>[oid,o.name]));
      const trapNames     = new Map([...this._trapMgr.getAll().entries()].map(([tid,t])=>[tid,t.name]));
      const slNames       = new Map([...this._slMgr.getAll().entries()].map(([slid,sl])=>[slid,sl.name]));
      const showJL=()=>this.props.showJumpLink(
        jl, arenaNames, obstacleNames, trapNames, slNames,
        ()=>{ this.captureUndo(); this._jlMgr.apply(jl); this.saveArena(); },
        ()=>{ this.captureUndo(); this._jlMgr.apply(jl); this.saveArena(); showJL(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); jl.name=name; this.saveArena(); },
      );
      showJL();
      return;
    }

    const footing=this._footingMgr.get(id);
    if(footing){
      const showF=()=>this.props.showFooting(
        footing,
        this.baseConfig.height,
        ()=>{ this.captureUndo(); this._footingMgr.apply(footing); this.saveArena(); },
        ()=>{ this.captureUndo(); this._footingMgr.apply(footing); this.saveArena(); showF(); },
        (name)=>{ this.captureUndo(); this.sceneTree.setLabel(id,name); this.saveArena(); },
        (cb)=>this._fileInputStl(id,footing.presentColor,cb),
        ()=>{ footing.presentStlb64=null; this._disposePresentMesh(id); this._applyViewMode(); this.saveArena(); },
      );
      showF();
      return;
    }

    const rotation=this._rotMgr.get(id);
    if(rotation){
      const bridgeNames = new Map([...this._bridgeMgr.getAll().entries()].map(([bid,b])=>[bid,b.name]));
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
    for(const obs of this._obstacleMgr.getAll().values()){
      obs.mesh.visible=this.solidMode;
    }
    for(const trap of this._trapMgr.getAll().values()){
      trap.mesh.visible=this.solidMode;
      if(trap.variantMesh) trap.variantMesh.visible=this.solidMode;
    }
    for(const portal of this._portalMgr.getAll().values()){
      portal.mesh.visible=this.solidMode;
      if(portal.ringMesh) portal.ringMesh.visible=this.solidMode;
    }
    for(const footing of this._footingMgr.getAll().values()){
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
    this._surfaceProviders.set(id, new ArenaSurfaceProvider(id, data));
    this._createArenaLight(data);
    this.sceneTree.add(id,data.name,'⏺','octagon-base',{
      addChildButtons:[
        {label:'Add pit',   title:'Add pit',            className:'pit-btn',  onClick:()=>this.addPit(id)},
        {label:'Add zone',   title:'Add zone',           className:'zone-btn', onClick:()=>this.addZone(id)},
        {label:'Add wall',   title:'Add wall',           className:'pit-btn',  onClick:()=>this.addWall(id,'arena')},
        {label:'Add speed line',  title:'Add speed line',     className:'sl-btn',   onClick:()=>this._addSpeedLine(id)},
        {label:'Add arena trap',title:'Add arena trap',     className:'pit-btn',  onClick:()=>this.addTrap(id,'arena')},
        {label:'Add arena portal',   title:'Add arena portal',   className:'zone-btn', onClick:()=>this.addPortal(id,'arena')},
        {label:'Add jump link',   title:'Add jump link',      className:'sl-btn',   onClick:()=>this._addJumpLink(id,'arena')},
        {label:'Add presentation',   title:'Add presentation',   className:'sl-btn',   onClick:()=>this._addSubNodePresent(id)},
        {label:'Add particle effect',   title:'Add particle effect',className:'pit-btn',  onClick:()=>this._addSubNodeParticle(id)},
        {label:'Add weather',  title:'Add weather',        className:'zone-btn', onClick:()=>this._addSubNodeWeather(id)},
        {label:'Add environment',  title:'Add environment',    className:'pit-btn',  onClick:()=>this._addSubNodeEnv(id)},
      ],
    });
    this.sceneTree.add(`wallprofile-${id}`, 'Wall Profile', '◌', id);
    this._wallProfileNodes.add(`wallprofile-${id}`);
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
          {label:'Add nested pit',title:'Add nested pit',className:'pit-btn',  onClick:()=>this.addPitToParent(newId,'zone')},
          {label:'Add nested zone',title:'Add nested zone',className:'zone-btn',onClick:()=>this.addZoneToParent(newId,'zone')},
          {label:'Add rotation',title:'Add rotation',  className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(newId,'zone'); this.addRotation([newId],['zone'],p.pivotX,p.pivotY,p.pivotZ); }},
          {label:'Add particle effect',title:'Add particle effect',className:'pit-btn',onClick:()=>this._addSubNodeParticle(newId)},
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
        {label:'Add nested pit',title:'Add nested pit',className:'pit-btn',  onClick:()=>this.addPitToParent(id,'zone')},
        {label:'Add nested zone',title:'Add nested zone',className:'zone-btn',onClick:()=>this.addZoneToParent(id,'zone')},
        {label:'Add rotation',title:'Add rotation',  className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(id,'zone'); this.addRotation([id],['zone'],p.pivotX,p.pivotY,p.pivotZ); }},
        {label:'Add particle effect',title:'Add particle effect',className:'pit-btn',onClick:()=>this._addSubNodeParticle(id)},
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
    this._saveTimerId = window.setTimeout(() => this._flushSave(), 300);
  }
  private _flushSave(): void {
    clearTimeout(this._saveTimerId);
    const cfg = (JSON.parse(this.serializeConfig()) as { v: number; c: ArenaConfig }).c;
    this._arenaStore.getState().replace(cfg);
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
        {label:'Add nested pit',title:'Add nested pit',className:'pit-btn',  onClick:()=>this.addPitToParent(zs.id,'zone')},
        {label:'Add nested zone',title:'Add nested zone',className:'zone-btn',onClick:()=>this.addZoneToParent(zs.id,'zone')},
        {label:'Add rotation',title:'Add rotation',  className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(zs.id,'zone'); this.addRotation([zs.id],['zone'],p.pivotX,p.pivotY,p.pivotZ); }},
        {label:'Add particle effect',title:'Add particle effect',className:'pit-btn',onClick:()=>this._addSubNodeParticle(zs.id)},
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
      this._surfaceProviders.set(as.id, new ArenaSurfaceProvider(as.id, data));

      // Arena node must exist in the tree before children are added as its descendants
      this.sceneTree.add(as.id,data.name,'⏺','octagon-base',{
        addChildButtons:[
          {label:'Add pit',   title:'Add pit',            className:'pit-btn',  onClick:()=>this.addPit(as.id)},
          {label:'Add zone',   title:'Add zone',           className:'zone-btn', onClick:()=>this.addZone(as.id)},
          {label:'Add wall',   title:'Add wall',           className:'pit-btn',  onClick:()=>this.addWall(as.id,'arena')},
          {label:'Add speed line',  title:'Add speed line',     className:'sl-btn',   onClick:()=>this._addSpeedLine(as.id)},
          {label:'Add arena trap',title:'Add arena trap',     className:'pit-btn',  onClick:()=>this.addTrap(as.id,'arena')},
          {label:'Add arena portal',   title:'Add arena portal',   className:'zone-btn', onClick:()=>this.addPortal(as.id,'arena')},
          {label:'Add jump link',   title:'Add jump link',      className:'sl-btn',   onClick:()=>this._addJumpLink(as.id,'arena')},
          {label:'Add presentation',   title:'Add presentation',   className:'sl-btn',   onClick:()=>this._addSubNodePresent(as.id)},
          {label:'Add particle effect',   title:'Add particle effect',className:'pit-btn',  onClick:()=>this._addSubNodeParticle(as.id)},
          {label:'Add weather',  title:'Add weather',        className:'zone-btn', onClick:()=>this._addSubNodeWeather(as.id)},
          {label:'Add environment',  title:'Add environment',    className:'pit-btn',  onClick:()=>this._addSubNodeEnv(as.id)},
        ],
      });
      this.sceneTree.add(`wallprofile-${as.id}`, 'Wall Profile', '◌', as.id);
      this._wallProfileNodes.add(`wallprofile-${as.id}`);

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

      // Create PointLight, particle/weather/fog systems, and apply tilt
      this._createArenaLight(data);
      this._createArenaParticles(as.id, data);
      if (data.weatherPreset && data.weatherPreset !== 'none') this._createArenaWeather(data);
      if (data.fogDensity > 0) this._createArenaFog(data);
      if (data.tiltX !== 0 || data.tiltZ !== 0) this._applyArenaTilt(data);
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
    this._restoreJumpLinkSave(cfg.jumpLinks ?? []);

    // Restore rotations after all nodes are loaded
    for(const rs of cfg.rotations) this._restoreRotationSave(rs);
  }

  private _restoreWallSave(ws: WallSave, bridgeOwnerId?: string): void {
    this._wallMgr.restoreData([ws]);
    const data = this._wallMgr.get(ws.id)!;
    this._wallMgr.buildAndShow(data, {
      addChildButtons: [
        { label:'Add rotation', title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(ws.id,'wall'); this.addRotation([ws.id],['wall'],p.pivotX,p.pivotY,p.pivotZ); } },
        { label:'Add presentation', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(ws.id) },
      ],
    });
    if (data.presentStlb64) this._loadPresentStl(ws.id, data.presentStlb64, data.presentColor);
    if (ws.parentType === 'arena') {
      const arena = this.arenas.get(ws.parentId);
      if (arena && !arena.wallIds.includes(ws.id)) arena.wallIds.push(ws.id);
    }
    if (ws.parentType === 'bridge' && bridgeOwnerId) {
      const bridge = this._bridgeMgr.get(bridgeOwnerId);
      if (bridge && !bridge.wallIds.includes(ws.id)) bridge.wallIds.push(ws.id);
    }
  }

  private _restoreBridgeSave(bs: BridgeSave): void {
    // Hydrate bridge + segment data (no geometry yet); fromSave creates group + adds to scene
    this._bridgeMgr.restoreData([bs]);
    const data = this._bridgeMgr.get(bs.id)!;
    const treeOpts = {
      addChildButtons: [
        { label:'Add segment', title:'Add segment',      className:'zone-btn', onClick:()=>this.addSegment(bs.id,'straight') },
        { label:'Add wall',   title:'Add wall',         className:'pit-btn',  onClick:()=>this.addWall(bs.id,'bridge') },
        { label:'Add presentation',   title:'Add presentation', className:'sl-btn',   onClick:()=>this._addSubNodePresent(bs.id) },
      ],
    };
    // Add bridge tree node + build all segment geometry (does NOT add segment tree nodes)
    this._bridgeMgr.buildAndShow(data, treeOpts);
    // Manually add segment tree nodes (buildAndShow skips them)
    for (const seg of this._bridgeMgr.getSegmentsForBridge(bs.id)) {
      this.sceneTree.add(seg.id, seg.name, segmentIcon(seg.type), bs.id);
    }
    // Update bridgesByArena index
    if (data.startRef?.type === 'arena') {
      if (!this.bridgesByArena.has(data.startRef.id)) this.bridgesByArena.set(data.startRef.id, new Set());
      this.bridgesByArena.get(data.startRef.id)!.add(bs.id);
    }
    for (const ws of bs.walls) this._restoreWallSave(ws, bs.id);
    if (data.presentStlb64) this._loadPresentStl(bs.id, data.presentStlb64, data.presentColor);
  }

  private _restoreRotationSave(rs: RotationSave): void {
    this._rotMgr.restoreData([rs]);
    const rot = this._rotMgr.get(rs.id);
    if (!rot) return;
    const treeParent = this._commonTreeParent(rs.memberIds) ?? 'octagon-base';
    this._rotMgr.buildAndShow(rot, treeParent);
  }

  private loadArena(): void {
    const st = this._arenaStore.getState();
    const hasData = st.arenas.length > 0 || st.obstacles.length > 0 || st.traps.length > 0
      || st.bridges.length > 0 || st.portals.length > 0 || st.footings.length > 0
      || st.jumpLinks.length > 0 || st.rotations.length > 0 || st.baseWalls.length > 0
      || st.speedLines.length > 0 || st.translations.length > 0;
    if (!hasData) return;
    const cfg: ArenaConfig = {
      baseConfig:      st.baseConfig,
      arenas:          st.arenas,          arenaSeq:       st.arenaSeq,
      pitSeq:          st.pitSeq,          zoneSeq:        st.zoneSeq,
      bridges:         st.bridges,
      wallSeq:         st.wallSeq,         bridgeSeq:      st.bridgeSeq,
      segmentSeq:      st.segmentSeq,      speedLineSeq:   st.speedLineSeq,
      speedLines:      st.speedLines,
      baseWalls:       st.baseWalls,
      obstacles:       st.obstacles,       obstacleSeq:    st.obstacleSeq,
      traps:           st.traps,           trapSeq:        st.trapSeq,
      portals:         st.portals,         portalSeq:      st.portalSeq,
      rotations:       st.rotations,       rotationSeq:    st.rotationSeq,
      footings:        st.footings,        footingSeq:     st.footingSeq,
      jumpLinks:       st.jumpLinks,       jumpLinkSeq:    st.jumpLinkSeq,
      translations:    st.translations,    translationSeq: st.translationSeq,
    };
    this.baseConfig = { ...this.baseConfig, ...cfg.baseConfig };
    this.rebuildBase();
    this.arenaSeq = cfg.arenaSeq; this.pitSeq = cfg.pitSeq; this.zoneSeq = cfg.zoneSeq;
    this._bridgeMgr.restoreSeq(cfg.bridgeSeq);
    this._bridgeMgr.restoreSegSeq(cfg.segmentSeq);
    this._slMgr.restoreSeq(cfg.speedLineSeq);
    this._wallMgr.restoreSeq(cfg.wallSeq);
    this._obstacleMgr.restoreSeq(cfg.obstacleSeq); this._trapMgr.restoreSeq(cfg.trapSeq); this._portalMgr.restoreSeq(cfg.portalSeq);
    this._rotMgr.restoreSeq(cfg.rotationSeq ?? 0); this._footingMgr.restoreSeq(cfg.footingSeq);
    this._jlMgr.restoreSeq(cfg.jumpLinkSeq ?? 0);
    this.translationSeq = cfg.translationSeq ?? 0;
    this._translationMgr?.restoreSeq(this.translationSeq);
    this._loadArenasFromConfig(cfg);
  }

  /* ── Renderer visibility override — wire speed line pointer events ──── */
  override setVisible(v: boolean): void {
    super.setVisible(v);
    const canvas = this.getRendererCanvas();
    if (v && canvas) {
      canvas.addEventListener('pointerdown', this._onPointerDown);
      canvas.addEventListener('pointermove', this._onPointerMove);
      canvas.addEventListener('pointerup',   this._onPointerUp);
      this._keyUnsubs = [
        inputManager.onPress('KeyZ', (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); if (e.shiftKey) this.redo(); else this.undo(); } }),
        inputManager.onPress('KeyY', (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); this.redo(); } }),
      ];
      this._checkPendingLoad();
    } else if (!v && canvas) {
      canvas.removeEventListener('pointerdown', this._onPointerDown);
      canvas.removeEventListener('pointermove', this._onPointerMove);
      canvas.removeEventListener('pointerup',   this._onPointerUp);
      this._keyUnsubs.forEach(fn => fn());
      this._keyUnsubs = [];
      this._spawnMgr?.despawn();
      this._spawnMgrBtn?.classList.remove('active');
    }
  }

  private _checkPendingLoad(): void {
    const pending = pendingLoadStore.getState().takeArenaPending();
    if (!pending) return;
    try {
      if (pending.mode === 'replace') {
        this._applyConfigToScene(pending.config);
      } else {
        this._mergeConfigIntoScene(pending.config);
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
    this._wallMgr.restoreSeq(remapped.wallSeq);
    this._bridgeMgr.restoreSeq(remapped.bridgeSeq);
    this._bridgeMgr.restoreSegSeq(remapped.segmentSeq);
    this._slMgr.restoreSeq(remapped.speedLineSeq);
    this._obstacleMgr.restoreSeq(remapped.obstacleSeq ?? 0);
    this._trapMgr.restoreSeq(remapped.trapSeq ?? 0);
    this._portalMgr.restoreSeq(remapped.portalSeq ?? 0);
    this._footingMgr.restoreSeq(remapped.footingSeq ?? 0);
    this._rotMgr.restoreSeq(remapped.rotationSeq ?? 0);
    this._jlMgr.restoreSeq(remapped.jumpLinkSeq ?? 0);
    this.translationSeq = Math.max(this.translationSeq, remapped.translationSeq ?? 0);
    this._translationMgr?.restoreSeq(this.translationSeq);
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
        walls: this._wallMgr.getAll() as Map<string, WallData>, bridges: this._bridgeMgr.getAll() as Map<string, BridgeData>, segments: this._bridgeMgr.getAllSegments() as Map<string, BridgeSegmentData>,
        speedLines: this._slMgr.getAll() as Map<string, SpeedLineData>, obstacles: this._obstacleMgr.getAll() as Map<string, ObstacleData>,
        traps: this._trapMgr.getAll() as Map<string, TrapData>, portals: this._portalMgr.getAll() as Map<string, PortalData>,
        footings: this._footingMgr.getAll() as Map<string, BaseFootingData>, rotations: this._rotMgr.getAll() as Map<string, RotationData>,
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
    // Sub-nodes, wall-profile nodes, and jump links are not reparentable
    if (nodeId.startsWith('present-') || nodeId.startsWith('particle-') || nodeId.startsWith('weather-') || nodeId.startsWith('env-')) return;
    if (nodeId.startsWith('wallprofile-')) return;
    if (this._jlMgr.has(nodeId)) return;

    // ── Bridge segment: reorder within same bridge OR move to another bridge ──
    const seg = this._bridgeMgr.getSegment(nodeId);
    if (seg) {
      if (newParentId === seg.bridgeId) {
        // Same-bridge reorder
        const bridge = this._bridgeMgr.get(seg.bridgeId); if (!bridge) return;
        const newOrder = this.sceneTree.getChildIds(seg.bridgeId).filter(id => this._bridgeMgr.getSegment(id) !== undefined);
        bridge.segmentIds = newOrder;
        newOrder.forEach((sid, i) => { const s = this._bridgeMgr.getSegment(sid); if (s) s.orderIndex = i; });
        if (newOrder.length > 0) this._bridgeMgr.applyBridgeFromSegment(newOrder[0]);
      } else {
        // Cross-bridge reparent
        const oldBridge = this._bridgeMgr.get(seg.bridgeId);
        const newBridge = this._bridgeMgr.get(newParentId);
        if (!oldBridge || !newBridge) return;
        // Remove from old bridge
        oldBridge.segmentIds = oldBridge.segmentIds.filter(id => id !== nodeId);
        oldBridge.segmentIds.forEach((sid, i) => { const s = this._bridgeMgr.getSegment(sid); if (s) s.orderIndex = i; });
        // Add to new bridge
        const newOrder = this.sceneTree.getChildIds(newParentId).filter(id => this._bridgeMgr.getSegment(id) !== undefined);
        newBridge.segmentIds = newOrder;
        newOrder.forEach((sid, i) => { const s = this._bridgeMgr.getSegment(sid); if (s) { s.orderIndex = i; s.bridgeId = newParentId; } });
        // Rebuild both
        if (oldBridge.segmentIds.length > 0) this._bridgeMgr.applyBridgeFromSegment(oldBridge.segmentIds[0]);
        if (newBridge.segmentIds.length > 0) this._bridgeMgr.applyBridgeFromSegment(newBridge.segmentIds[0]);
      }
      this.saveArena(); return;
    }

    // ── Wall: reparent between arenas or arena↔base ──────────────────────
    const wall = this._wallMgr.get(nodeId);
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
      this._wallMgr.apply(wall);
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
    const trap = this._trapMgr.get(nodeId);
    if (trap) {
      const isNewArena = this.arenas.has(newParentId);
      const isNewBase  = newParentId === 'octagon-base';
      if (!isNewArena && !isNewBase) return;
      trap.parentId   = isNewBase ? 'octagon-base' : newParentId;
      trap.parentType = isNewBase ? 'base' : 'arena';
      this._trapMgr.apply(trap);
      if (this._rotMgr.hasNode(nodeId)) this._afterApply(nodeId);
      this.saveArena(); return;
    }

    // ── Portal: reparent arena↔base ───────────────────────────────────────
    const portal = this._portalMgr.get(nodeId);
    if (portal) {
      const isNewArena = this.arenas.has(newParentId);
      const isNewBase  = newParentId === 'octagon-base';
      if (!isNewArena && !isNewBase) return;
      portal.parentId   = isNewBase ? 'octagon-base' : newParentId;
      portal.parentType = isNewBase ? 'base' : 'arena';
      this._portalMgr.apply(portal);
      this.saveArena(); return;
    }

    // ── Speed line: reparent between arenas / zones ───────────────────────
    const sl = this._slMgr.get(nodeId);
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
    // Sub-nodes, wall-profile nodes, bridges, speed lines, rotations, jump links are not duplicatable
    if (id.startsWith('present-') || id.startsWith('particle-') || id.startsWith('weather-') || id.startsWith('env-')) return;
    if (id.startsWith('wallprofile-')) return;
    if (this._bridgeMgr.has(id) || this._slMgr.has(id) || this._rotMgr.has(id)) return;
    if (this._jlMgr.has(id)) return;
    if (this._bridgeMgr.getSegment(id) !== undefined) return;

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
          { label:'Add pit',   title:'Add pit',            className:'pit-btn',  onClick:()=>this.addPit(newId) },
          { label:'Add zone',   title:'Add zone',           className:'zone-btn', onClick:()=>this.addZone(newId) },
          { label:'Add wall',   title:'Add wall',           className:'pit-btn',  onClick:()=>this.addWall(newId,'arena') },
          { label:'Add speed line',  title:'Add speed line',     className:'sl-btn',   onClick:()=>this._addSpeedLine(newId) },
          { label:'Add arena trap',title:'Add arena trap',     className:'pit-btn',  onClick:()=>this.addTrap(newId,'arena') },
          { label:'Add arena portal',   title:'Add arena portal',   className:'zone-btn', onClick:()=>this.addPortal(newId,'arena') },
          { label:'Add jump link',   title:'Add jump link',      className:'sl-btn',   onClick:()=>this._addJumpLink(newId,'arena') },
          { label:'Add presentation',   title:'Add presentation',   className:'sl-btn',   onClick:()=>this._addSubNodePresent(newId) },
          { label:'Add particle effect',   title:'Add particle effect',className:'pit-btn',  onClick:()=>this._addSubNodeParticle(newId) },
          { label:'Add weather',  title:'Add weather',        className:'zone-btn', onClick:()=>this._addSubNodeWeather(newId) },
        ],
      });
      this.sceneTree.add(`wallprofile-${newId}`, 'Wall Profile', '◌', newId);
      this._wallProfileNodes.add(`wallprofile-${newId}`);
      this.updateTopFace(); this.updateAllMoatIslandCaps(); this.saveArena();
      return;
    }

    // ── Obstacle ───────────────────────────────────────────────────────────
    const obs = this._obstacleMgr.get(id);
    if (obs) {
      const nextSeq = this._obstacleMgr.getSeq() + 1;
      const newId = `obstacle-${nextSeq}`;
      const save: ObstacleSave = { ...obstacleToSave(obs), id: newId, name: `Obstacle ${nextSeq}`, posX: obs.posX + 10 };
      this._obstacleMgr.restoreData([save]);
      const newData = this._obstacleMgr.get(newId)!;
      this._obstacleMgr.buildAndShow(newData, {
        addChildButtons: [
          { label:'Add rotation', title:'Add rotation',     className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(newId,'obstacle'); this.addRotation([newId],['obstacle'],p.pivotX,p.pivotY,p.pivotZ); } },
          { label:'Add jump link', title:'Add jump link',    className:'sl-btn',  onClick:()=>this._addJumpLink(newId,'obstacle') },
          { label:'Add presentation', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(newId) },
        ],
      });
      this.saveArena(); return;
    }

    // ── Footing ────────────────────────────────────────────────────────────
    const footing = this._footingMgr.get(id);
    if (footing) {
      const nextSeq = this._footingMgr.getSeq() + 1;
      const newId = `footing-${nextSeq}`;
      const save: BaseFootingSave = { ...footingToSave(footing), id: newId, name: `Footing ${nextSeq}`, basePosX: footing.basePosX + 10 };
      this._footingMgr.restoreData([save]);
      const newData = this._footingMgr.get(newId)!;
      this._footingMgr.buildAndShow(newData, {
        addChildButtons: [
          { label:'Add presentation', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(newId) },
        ],
      });
      this._applyViewMode(); this.saveArena(); return;
    }

    // ── Trap ───────────────────────────────────────────────────────────────
    const trap = this._trapMgr.get(id);
    if (trap) {
      const nextSeq = this._trapMgr.getSeq() + 1;
      const newId = `trap-${nextSeq}`;
      const save: TrapSave = {
        ...this._trapMgr.toSave(trap), id: newId, name: `Trap ${nextSeq}`,
        posAngle: trap.posAngle + 10, walls: [],
      };
      this._trapMgr.restoreData([save]);
      const newData = this._trapMgr.get(newId)!;
      this._trapMgr.buildAndShow(newData, {
        addChildButtons: [
          { label:'Add wall', title:'Add wall',              onClick:()=>this.addWall(newId, 'trap') },
          { label:'Add rotation',  title:'Add rotation',      className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(newId,'trap'); this.addRotation([newId],['trap'],p.pivotX,p.pivotY,p.pivotZ); } },
          { label:'Add jump link',  title:'Add jump link',     className:'sl-btn',  onClick:()=>this._addJumpLink(newId,'trap') },
          { label:'Add presentation',  title:'Add presentation',  className:'pit-btn', onClick:()=>this._addSubNodePresent(newId) },
          { label:'Add particle effect',  title:'Add particle effect',className:'zone-btn',onClick:()=>this._addSubNodeParticle(newId) },
        ],
      });
      this.saveArena(); return;
    }

    // ── Portal ─────────────────────────────────────────────────────────────
    const portal = this._portalMgr.get(id);
    if (portal) {
      const nextSeq = this._portalMgr.getSeq() + 1;
      const newId = `portal-${nextSeq}`;
      const save: PortalSave = { ...this._portalMgr.toSave(portal), id: newId, name: `Portal ${nextSeq}`, posAngle: portal.posAngle + 10 };
      this._portalMgr.restoreData([save]);
      const newData = this._portalMgr.get(newId)!;
      this._portalMgr.buildAndShow(newData, {
        addChildButtons: [
          { label:'Add presentation', title:'Add presentation', className:'sl-btn', onClick:()=>this._addSubNodePresent(newId) },
        ],
      });
      this.saveArena(); return;
    }

    // ── Wall ───────────────────────────────────────────────────────────────
    const wall = this._wallMgr.get(id);
    if (wall) {
      const nextSeq = this._wallMgr.getSeq() + 1;
      const newId = `wall-${nextSeq}`;
      const save: WallSave = { ...this._wallMgr.toSave(wall), id: newId, name: `Wall ${nextSeq}` };
      this._wallMgr.restoreData([save]);
      const newData = this._wallMgr.get(newId)!;
      this._wallMgr.buildAndShow(newData, {
        addChildButtons: [
          { label:'Add rotation', title:'Add rotation',    className:'sl-btn',  onClick:()=>{ const p=this._defaultPivotForMember(newId,'wall'); this.addRotation([newId],['wall'],p.pivotX,p.pivotY,p.pivotZ); } },
          { label:'Add presentation', title:'Add presentation', className:'pit-btn', onClick:()=>this._addSubNodePresent(newId) },
        ],
      });
      if (newData.parentType === 'arena') {
        const arena = this.arenas.get(newData.parentId);
        if (arena && !arena.wallIds.includes(newId)) arena.wallIds.push(newId);
      }
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
          { label:'Add nested pit',title:'Add nested pit',className:'pit-btn',  onClick:()=>this.addPitToParent(newId,'zone') },
          { label:'Add nested zone',title:'Add nested zone',className:'zone-btn',onClick:()=>this.addZoneToParent(newId,'zone') },
          { label:'Add rotation',title:'Add rotation',  className:'sl-btn',   onClick:()=>{ const p=this._defaultPivotForMember(newId,'zone'); this.addRotation([newId],['zone'],p.pivotX,p.pivotY,p.pivotZ); } },
          { label:'Add particle effect',title:'Add particle effect',className:'pit-btn',onClick:()=>this._addSubNodeParticle(newId) },
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
    this._slMgr.clear(); this.slSegSeq=0;
    for(const[id,arena] of this.arenas.entries()){
      for(const pid of arena.pitIds){const p=this.pits.get(pid);if(p){this.disposePit(p);this.removeFromScene(p.mesh,p.edges);if(p.seamMesh)this.removeFromScene(p.seamMesh);}this.pits.delete(pid);this.sceneObjects.delete(pid);}
      for(const zid of arena.zoneIds){const z=this.zones.get(zid);if(z){this.disposeZone(z);this.removeFromScene(z.mesh,z.edges);if(z.seamMesh)this.removeFromScene(z.seamMesh);}this.zones.delete(zid);this.sceneObjects.delete(zid);}
      this.disposeArena(arena); this.removeFromScene(arena.mesh,arena.edges);
      this.sceneObjects.delete(id); this.sceneTree.remove(id);
    }
    this._wallMgr.clear();
    this._bridgeMgr.clear();
    this.arenas.clear(); this.arenaSeq=0;
    this.pits.clear();   this.pitSeq=0;
    this.zones.clear();  this.zoneSeq=0;
    this.bridgesByArena.clear();
    this.baseConfig={height:DEFAULT_BASE_HEIGHT,sides:DEFAULT_BASE_SIDES,color:DEFAULT_BASE_COLOR,surface:'plain',customTileData:null,tileScale:DEFAULT_BASE_TILE};
    this.rebuildBase(); this.updateTopFace();
    this.selectedId=null; this.sceneTree.clearSel(); this.props.showEmpty();
    this._arenaStore.getState().discard();
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

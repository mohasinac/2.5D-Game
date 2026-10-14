import * as THREE from 'three';
import { Sandbox } from './Sandbox';
import { inputManager } from '../features/managers/InputManager';
import { ControlManager } from '../features/managers/ControlManager';
import { VirtualControlsOverlay } from '../features/managers/VirtualControlsOverlay';
import { SpawnManager } from '../features/managers/SpawnManager';
import { SpecialMoveManager } from '../features/managers/SpecialMoveManager';
import { WallManager } from '../features/managers/WallManager';
import { SpeedLineManager } from '../features/managers/SpeedLineManager';
import { ProjectionService } from '../features/ProjectionService';
import { RenderManager } from '../features/managers/RenderManager';
import { SceneTree } from '../utils/SceneTree';
import { buildArenaObjects } from '../geometry/arenaObjectBuilders';
import { buildSurfaceMaterial } from '../geometry/materialBuilders';
import {
  DEFAULT_BASE_HEIGHT, DEFAULT_BASE_SIDES, DEFAULT_ARENA_MATERIAL,
  APOTHEM, DEFAULT_BASE_COLOR, DEFAULT_BASE_TILE,
  DEFAULT_STEP_COUNT, DEFAULT_STEP_START_DEPTH, DEFAULT_STEP_RISER,
  DEFAULT_RAMP_ANGLE, DEFAULT_RAMP_WIDTH, DEFAULT_STEP_ARC_DIVISIONS,
  DEFAULT_SPIRAL_TURNS, DEFAULT_SPIRAL_COUNT,
  DEFAULT_SPIRAL_LEDGE_W, DEFAULT_SPIRAL_LEDGE_H, DEFAULT_SPIRAL_RADIUS_FRAC,
  ENV,
} from '../config/arenaConstants';
import type { ArenaData, ZoneData, WallData, ObstacleData, BridgeData, BridgeSegmentData } from '../types/arenaTypes';
import type { ArenaConfig } from '../utils/arenaPersistence';
import type { SceneContext } from '../features/IArenaFeature';
import { buildTopFaceGeo } from '../geometry/platformBuilders';
import { TEST_ARENA_CONFIG } from '../config/testArenaConfig';
import { SpecialMovePanel } from '../utils/SpecialMovePanel';
import type { SpecialMoveSave } from '../types/specialMoveTypes';
import { Rng } from '../sim/Rng';

const SM_STORAGE_KEY = 'bey_special_moves';

export interface SpecialMoveSandboxOptions {
  onBack: () => void;
}

export class SpecialMoveSandbox extends Sandbox {
  // Managers
  private _renderMgr!:  RenderManager;
  /** Seeded RNG per sandbox. The clock lives on Sandbox — the loop advances it. */
  private readonly _rng = new Rng();
  private _sceneTree!:  SceneTree;
  private _wallMgr!:    WallManager;
  private _slMgr!:      SpeedLineManager;
  private _spawnMgr!:   SpawnManager;
  private _smMgr!:      SpecialMoveManager;
  private _ctrlMgr!:    ControlManager;
  private _virtualControls!: VirtualControlsOverlay;
  private _projSvc!:    ProjectionService;

  // Arena data
  private _arenas = new Map<string, ArenaData>();
  private _zones  = new Map<string, ZoneData>();

  // UI
  private _spawnBtn!:    HTMLButtonElement;
  private _smPanel!:     SpecialMovePanel;
  private _hudEl!:       HTMLElement;
  private _spawnHudEl!:  HTMLElement;

  // Octagon base meshes
  private _baseMesh!: THREE.Mesh;
  private _baseMeshEdges!: THREE.LineSegments;
  private _topFaceMesh!: THREE.Mesh;

  constructor(container: HTMLElement, opts: SpecialMoveSandboxOptions) {
    super(container, {
      title:      'Special Moves',
      accentHex:  0xff6b35,
      onBack:     opts.onBack,
      gridSize:   200,
      gridDivs:   20,
      tickEvery:  20,
      tickRange:  100,
      defaultCam: { x: 80, y: 60, z: 100 },
      camFar:     2000,
      minZoom:    10,
      maxZoom:    800,
      axisYOffset: DEFAULT_BASE_HEIGHT,
    });

    this._spawnBtn = this.addTopBarButton('⚽ Spawn', 'Spawn / despawn the test ball');
    this._spawnBtn.addEventListener('click', () => this._toggleSpawn());

    const resetBtn = this.addTopBarButton('↺ Reset', 'Reset physics ball and resonance');
    resetBtn.addEventListener('click', () => {
      if (this._spawnMgr?.isSpawned) {
        this._spawnMgr.despawn();
        this._spawnMgr.spawn();
      }
      this._smMgr?.resetTargetHp?.();
      this._smMgr?.resetCasterHp?.();
    });
  }

  // ── Sandbox overrides ─────────────────────────────────────────────────────

  protected override buildCustom(scene: THREE.Scene): void {
    const H     = DEFAULT_BASE_HEIGHT;
    const sides = DEFAULT_BASE_SIDES;
    const R     = APOTHEM / Math.cos(Math.PI / sides);
    const align = Math.PI / sides;

    const baseMat = buildSurfaceMaterial({ color: DEFAULT_BASE_COLOR, surface: 'plain', customTileData: null, tileScale: 20 });
    this._baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, sides, 1, true), baseMat);
    this._baseMesh.rotation.y = align; this._baseMesh.position.y = -H / 2;
    scene.add(this._baseMesh);

    const fullGeo = new THREE.CylinderGeometry(R, R, H, sides, 1, false);
    this._baseMeshEdges = new THREE.LineSegments(new THREE.EdgesGeometry(fullGeo), new THREE.LineBasicMaterial({ color: 0xb8a888 }));
    this._baseMeshEdges.rotation.y = align; this._baseMeshEdges.position.y = -H / 2;
    scene.add(this._baseMeshEdges); fullGeo.dispose();

    const topFaceMat = buildSurfaceMaterial({ color: DEFAULT_BASE_COLOR, surface: 'plain', customTileData: null, tileScale: 20, polygonOffset: true });
    this._topFaceMesh = new THREE.Mesh(buildTopFaceGeo(sides, R, align, 0, []), topFaceMat);
    scene.add(this._topFaceMesh);

    // Managers
    this._renderMgr = new RenderManager(scene);

    // Minimal hidden SceneTree for manager infrastructure
    const hiddenTreeEl = document.createElement('div');
    hiddenTreeEl.style.display = 'none';
    document.body.appendChild(hiddenTreeEl);
    this._sceneTree = new SceneTree(hiddenTreeEl);
    this._sceneTree.add('octagon-base', 'Base', '⬡', null);

    const mgrCtx: SceneContext = {
      scene,
      sceneTree:    this._sceneTree,
      getFallbackY: () => DEFAULT_BASE_HEIGHT,
      renderMgr:    this._renderMgr,
      clock:        this.simClock,
      rng:          this._rng,
    };

    this._wallMgr = new WallManager(
      mgrCtx,
      (id) => this._arenas.get(id),
      ()  => this._arenas,
      ()  => undefined,
      ()  => DEFAULT_BASE_HEIGHT,
    );

    this._projSvc = new ProjectionService(
      () => this._arenas,
      () => this._wallMgr.getAll() as Map<string, WallData>,
      () => new Map<string, ObstacleData>(),
      () => new Map<string, Set<string>>(),
      () => new Map<string, BridgeData>(),
      () => new Map<string, BridgeSegmentData>(),
    );

    this._slMgr = new SpeedLineManager(
      mgrCtx,
      (id)     => this._arenas.get(id),
      ()       => this._zones,
      (arenaId) => this._projSvc.buildProjector(arenaId),
    );

    // Control manager
    this._ctrlMgr = new ControlManager(inputManager);

    // Spawn HUD
    this._spawnHudEl = document.createElement('div');
    this._spawnHudEl.className = 'spawn-manager-hud';
    this._spawnHudEl.style.display = 'none';
    document.body.appendChild(this._spawnHudEl);

    // SpawnManager
    this._spawnMgr = new SpawnManager(
      mgrCtx,
      () => this.getCamera(),
      () => this.getControls(),
      () => this._arenas,
      () => new Map(),
      () => this._slMgr.getAll() as Map<string, import('../types/arenaTypes').SpeedLineData>,
      () => this._zones,
      () => this._wallMgr.getAll() as Map<string, WallData>,
      this._spawnHudEl,
      this._ctrlMgr,
    );

    // SpecialMoveManager — registers T-key BEFORE SpawnManager's trigger
    this._smMgr = new SpecialMoveManager(
      this.simClock,
      () => this._spawnMgr.isSpawned ? this._spawnMgr.getPosition() : null,
      (v) => { if (this._spawnMgr.isSpawned) this._spawnMgr.setVelocity(v); },
    );
    // Register T-key press: SM intercepts first, SpawnManager gets it via ControlManager
    const smTKeyUnsub = inputManager.onPress('KeyT', () => {
      // SM handles first; if not intercepted SpawnManager trigger fires via ctrlMgr
    });
    this._smMgr.registerTKey((cb) => {
      const unsub = inputManager.onPress('KeyT', cb);
      return unsub;
    });
    void smTKeyUnsub; // registered first so it runs before ctrlMgr's 'trigger' fire

    this._smMgr.bindSpawnManager(this._spawnMgr);

    // Load saved moves
    this._loadMoves();

    // Build overlay UI
    this._buildHUD();
    this._smPanel = new SpecialMovePanel(
      this.addOverlayPanel('sm-right-panel'),
      this._smMgr,
      () => this._saveMoves(),
    );
    this._smMgr.bindHudElements({
      resonanceBar: this._hudEl.querySelector<HTMLElement>('#sm-res-fill'),
      casterHpBar:  this._hudEl.querySelector<HTMLElement>('#sm-caster-fill'),
      targetHpBar:  this._hudEl.querySelector<HTMLElement>('#sm-target-fill'),
      activePhase:  this._hudEl.querySelector<HTMLElement>('#sm-phase-label'),
    });

    // Virtual controls
    this._virtualControls = new VirtualControlsOverlay(
      this.el,
      this._ctrlMgr,
      () => this.getControls(),
    );

    // Load the test arena
    this._loadConfig(TEST_ARENA_CONFIG);
  }

  protected override onTick(dtMs: number): void {
    const dt = dtMs / 1000;          // single conversion point; managers take seconds
    this._spawnMgr?.tick(dt);
    this._smMgr?.tick(dt);
  }

  override setVisible(v: boolean): void {
    super.setVisible(v);
    if (!v) {
      this._spawnMgr?.despawn();
      this._spawnBtn?.classList.remove('active');
      this._virtualControls?.hide();
    }
  }

  // ── Config loader ─────────────────────────────────────────────────────────

  private _loadConfig(cfg: ArenaConfig): void {
    for (const as_ of cfg.arenas) {
      const data: ArenaData = {
        name: as_.name, openingShape: as_.openingShape, wallProfile: as_.wallProfile,
        radiusX: as_.radiusX, radiusZ: as_.radiusZ, depth: as_.depth,
        sides: as_.sides, starInner: as_.starInner,
        color: as_.color, surface: as_.surface, customTileData: as_.customTileData, tileScale: as_.tileScale,
        baseMaterial: as_.baseMaterial ?? DEFAULT_ARENA_MATERIAL,
        posX: as_.posX, posZ: as_.posZ, posY: as_.posY, rotY: as_.rotY,
        isMoat: as_.isMoat, innerRadiusX: as_.innerRadiusX, innerRadiusZ: as_.innerRadiusZ,
        innerOpeningShape: as_.innerOpeningShape, innerSides: as_.innerSides, innerStarInner: as_.innerStarInner,
        innerWallProfile: as_.innerWallProfile, innerRimOffset: as_.innerRimOffset,
        stepApplyToAll: as_.stepApplyToAll ?? true,
        stepEdgeProfiles: as_.stepEdgeProfiles ?? [],
        stepArcDivisions: as_.stepArcDivisions ?? DEFAULT_STEP_ARC_DIVISIONS,
        stepCount: as_.stepCount ?? DEFAULT_STEP_COUNT,
        stepStartDepth: as_.stepStartDepth ?? DEFAULT_STEP_START_DEPTH,
        stepRiserProfile: as_.stepRiserProfile ?? DEFAULT_STEP_RISER,
        rampMode: as_.rampMode ?? 'none',
        rampAngle: as_.rampAngle ?? DEFAULT_RAMP_ANGLE,
        rampWidth: as_.rampWidth ?? DEFAULT_RAMP_WIDTH,
        innerStepCount: DEFAULT_STEP_COUNT, innerStepStartDepth: DEFAULT_STEP_START_DEPTH,
        innerStepRiserProfile: DEFAULT_STEP_RISER, innerRampMode: 'none',
        innerRampAngle: DEFAULT_RAMP_ANGLE, innerRampWidth: DEFAULT_RAMP_WIDTH,
        spiralTurns: as_.spiralTurns ?? DEFAULT_SPIRAL_TURNS,
        spiralClockwise: as_.spiralClockwise ?? true,
        spiralCount: as_.spiralCount ?? DEFAULT_SPIRAL_COUNT,
        spiralLedgeWidth: as_.spiralLedgeWidth ?? DEFAULT_SPIRAL_LEDGE_W,
        spiralLedgeHeight: as_.spiralLedgeHeight ?? DEFAULT_SPIRAL_LEDGE_H,
        spiralRadiusFrac: as_.spiralRadiusFrac ?? DEFAULT_SPIRAL_RADIUS_FRAC,
        spiralMeshes: [],
        innerSpiralTurns: DEFAULT_SPIRAL_TURNS, innerSpiralClockwise: true,
        innerSpiralCount: DEFAULT_SPIRAL_COUNT, innerSpiralLedgeWidth: DEFAULT_SPIRAL_LEDGE_W,
        innerSpiralLedgeHeight: DEFAULT_SPIRAL_LEDGE_H, innerSpiralRadiusFrac: DEFAULT_SPIRAL_RADIUS_FRAC,
        stepsColor: null, stepsSurface: null, stepsCustomTileData: null,
        spiralColor: null, spiralSurface: null, spiralCustomTileData: null,
        lightColor: as_.lightColor ?? 0xffffff,
        lightIntensity: as_.lightIntensity ?? 0,
        lightPosY: as_.lightPosY ?? 40,
        lightRange: as_.lightRange ?? 200,
        particlePreset: 'none',
        weatherPreset: 'none', windEnabled: false, windDirectionDeg: 0,
        windStrengthCms: 0, windGustInterval: 4, windGustMult: 2,
        gravityScale: ENV.DEFAULT_GRAVITY_SCALE, gravityDirectionX: 0, gravityDirectionZ: 0,
        tiltX: 0, tiltZ: 0,
        weightTiltEnabled: false, weightTiltSensitivity: ENV.DEFAULT_WEIGHT_SENSITIVITY,
        weightTiltDampening: ENV.DEFAULT_WEIGHT_DAMPENING,
        fogDensity: 0, scoreMultiplier: 1, pointsPerSecond: 0,
        weatherSurfaceMap: {}, envSchedule: [],
        tiltGroup: undefined, fogSystem: null, _score: 0,
        presentStlb64: null, presentColor: 0xaaaaaa,
        light: null, particleSystem: null, weatherSystem: null,
        pitIds: [], zoneIds: [], wallIds: [], speedLineIds: [],
        mesh: null as unknown as THREE.Mesh,
        edges: null as unknown as THREE.LineSegments,
        floorMesh: null, islandMesh: null, rimSeamMesh: null,
      };
      this._arenas.set(as_.id, data);
      this._sceneTree.add(as_.id, data.name, '⏺', 'octagon-base');

      const [mesh, edges] = buildArenaObjects(data, []);
      data.mesh  = mesh;
      data.edges = edges;
      this.addToScene(mesh, edges);

      // Walls
      if (as_.walls) {
        this._wallMgr.restoreData(as_.walls);
        for (const ws of as_.walls) {
          const w = this._wallMgr.get(ws.id);
          if (w) {
            data.wallIds.push(w.id);
            this._wallMgr.buildAndShow(w);
          }
        }
      }

      // Speed lines
      if (as_.speedLines) {
        this._slMgr.restoreSeq(cfg.speedLineSeq);
        this._slMgr.restoreData(as_.speedLines);
        for (const sls_ of as_.speedLines) {
          const sl = this._slMgr.get(sls_.id);
          if (sl) {
            data.speedLineIds.push(sl.id);
            this._slMgr.buildAndShow(sl);
          }
        }
      }

      // Light
      if (data.lightIntensity > 0) {
        const light = new THREE.PointLight(data.lightColor, data.lightIntensity, data.lightRange);
        light.position.set(data.posX, DEFAULT_BASE_HEIGHT + data.posY + data.lightPosY, data.posZ);
        this.addToScene(light);
        data.light = light;
      }
    }
  }

  // ── HUD ─────────────────────────────────────────────────────────────────────

  private _buildHUD(): void {
    this._hudEl = document.createElement('div');
    this._hudEl.className = 'sm-hud';
    this._hudEl.innerHTML = `
      <div class="sm-hud-row">
        <span class="sm-hud-label">CASTER HP</span>
        <div class="sm-hud-bar-track"><div class="sm-hud-bar sm-hud-bar--caster" id="sm-caster-fill"></div></div>
      </div>
      <div class="sm-hud-row">
        <span class="sm-hud-label">TARGET HP</span>
        <div class="sm-hud-bar-track"><div class="sm-hud-bar sm-hud-bar--target" id="sm-target-fill"></div></div>
      </div>
      <div class="sm-hud-row">
        <span class="sm-hud-label">RESONANCE</span>
        <div class="sm-hud-bar-track"><div class="sm-hud-bar sm-hud-bar--res" id="sm-res-fill"></div></div>
      </div>
      <div class="sm-hud-row">
        <span class="sm-hud-label">PHASE</span>
        <span class="sm-hud-val" id="sm-phase-label">—</span>
      </div>
    `;
    this.addOverlayPanel('sm-hud-wrap').appendChild(this._hudEl);
  }

  // ── Spawn toggle ──────────────────────────────────────────────────────────

  private _toggleSpawn(): void {
    if (!this._spawnMgr) return;
    if (this._spawnMgr.isSpawned) {
      this._spawnMgr.despawn();
      this._spawnBtn.classList.remove('active');
    } else {
      this._spawnMgr.spawn();
      this._spawnBtn.classList.add('active');
    }
  }

  // ── Special move persistence ──────────────────────────────────────────────

  private _loadMoves(): void {
    try {
      const raw = localStorage.getItem(SM_STORAGE_KEY);
      if (!raw) return;
      const saves = JSON.parse(raw) as SpecialMoveSave[];
      if (Array.isArray(saves)) this._smMgr?.loadSaves(saves);
    } catch { /* malformed data */ }
  }

  private _saveMoves(): void {
    try {
      localStorage.setItem(SM_STORAGE_KEY, JSON.stringify(this._smMgr?.serializeAll() ?? []));
    } catch { /* quota */ }
  }
}

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
import { ProjectileManager } from '../features/managers/ProjectileManager';
import { TargetManager } from '../features/managers/TargetManager';
import { defaultProjectileConfig } from '../types/arenaTypes';
import { specialMovesStore } from '../stores/specialMovesStore';
import { forwardToHeading } from '../geometry/surfaceUtils';
import { Rng } from '../sim/Rng';

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
  /**
   * Bullets for phases that declare a projectile.
   *
   * THE SANDBOX HAD NO PROJECTILE MANAGER AT ALL, which is why
   * "projectile commands are declared but not executed" — the editor let you
   * author radius, speed, lifetime and colour on a phase and there was
   * nothing in this screen that could fire one.
   */
  private _projMgr!:    ProjectileManager;
  /**
   * Steering for the target dummy.
   *
   * `TargetManager.bind()` is the second entry on CLAUDE.md's zero-caller
   * list — "five steering behaviours, zero bindings" — and this is its first
   * one. It fits here and not on the opponent AI: `ArenaSandbox` explains at
   * length why it deliberately does NOT bind the opponent (`lock_on` is a
   * teleport, and steering belongs in the AI's `sense()` closure so the
   * input boundary holds). A dummy that walks toward the caster has no such
   * problem — it is a training target, and `follow` is exactly what it wants.
   */
  private _targetMgr!:  TargetManager;
  /**
   * The target dummy, which had no body at all.
   *
   * CLAUDE.md: "the target dummy has no mesh, `_targetPos` is hardcoded
   * `(0, 0, 25)`, and `setTargetPosition()` is never called — so moves
   * damage an invisible fixed point." All three are fixed here: it has a
   * mesh, it moves, and its position is pushed into the manager each tick.
   */
  private _dummy!:      THREE.Mesh;
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
      (arenaId) => this._projSvc.buildProjector(arenaId),
      // This screen builds its own base and test arena; it has no obstacles
      // and no bridges.
      () => new Map(),
      () => new Map(),
      () => new Map(),
    );

    /* Projectiles for authored phases. The target list is the caster itself
       plus the dummy, so a bullet has something to resolve against rather
       than flying through everything — `ProjectileManager`'s own note says
       bullets passed through the bey, the walls and each other until it was
       given targets. */
    this._projMgr = new ProjectileManager(
      scene,
      () => this._slMgr.getAll(),
      this._rng,
      () => {
        const t = this._smMgr?.getTargetState();
        return t ? [{
          id: 'sm-target', team: 'blue', pos: t.pos,
          radius: 5, contactLow: 0, contactHigh: 10,
        }] : [];
      },
    );

    // SpecialMoveManager — registers T-key BEFORE SpawnManager's trigger
    this._smMgr = new SpecialMoveManager(
      this.simClock,
      () => this._spawnMgr.isSpawned ? this._spawnMgr.getPosition() : null,
      (v) => { if (this._spawnMgr.isSpawned) this._spawnMgr.setVelocity(v); },
      undefined,
      /* THE PROJECTILE JOIN. `SpecialMoveProjectileCmd` is a small authored
         struct (radius, speed, lifetime, colour); `ProjectileConfig` is the
         arena's much larger one. Mapping the four authored fields over the
         defaults is what lets the panel stay simple without the manager
         needing to know the full config exists. */
      (cmd, origin, dir) => {
        this._projMgr.launch({
          sourceId: 'special-move',
          center: origin,
          config: {
            ...defaultProjectileConfig(),
            dimX: cmd.radius, dimY: cmd.radius, dimZ: cmd.radius,
            color: cmd.color,
            speed: cmd.speed,
            lifetimeMs: cmd.lifetime * 1000,
          },
          mode: 'single',
          count: 1,
          spreadAngleDeg: 0,
          patternCount: 1,
          /* `dirAngle` is the project's heading convention, so it goes
             through `forwardToHeading` rather than a local atan2 — the
             convention has been got wrong twice in this codebase and both
             times the failure was silent. */
          dirAngle: forwardToHeading(dir.x, dir.z),
        });
      },
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

    /* ── THE TARGET DUMMY — a body for the thing moves were already hitting.
       Built after the arena managers so `applyRenderPolicy` sees it through
       `addToScene`, which is the project's rule: anything added raw keeps
       `toneMapped = true` and comes out desaturated by ACES. */
    this._dummy = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 3, 8, 24),
      new THREE.MeshStandardMaterial({
        color: 0xff6b35, roughness: 0.5, metalness: 0.1,
        emissive: 0x401a0d, emissiveIntensity: 0.6,
      }),
    );
    this._dummy.position.set(0, DEFAULT_BASE_HEIGHT + 4, 25);
    this.addToScene(this._dummy);

    this._targetMgr = new TargetManager(
      (nodeId) => {
        if (nodeId === 'dummy')  return this._dummy.position.clone();
        if (nodeId === 'caster') return this._spawnMgr.isSpawned ? this._spawnMgr.getPosition() : null;
        return null;
      },
      (nodeId, pos) => {
        /* Y is held: `follow` steers in 3D and the caster sits lower than
           the dummy's centre, so an unconstrained follow would sink the
           dummy into the base over a few seconds. */
        if (nodeId === 'dummy') this._dummy.position.set(pos.x, this._dummy.position.y, pos.z);
      },
    );
    /* Slow and weak on purpose: the dummy should drift into range so a move
       can be aimed, not chase the player down. */
    this._targetMgr.bind('dummy', 'caster', 'follow', { strength: 0.35, maxSpeedCms: 18 });

    // Load the test arena
    this._loadConfig(TEST_ARENA_CONFIG);
  }

  protected override onTick(dtMs: number): void {
    const dt = dtMs / 1000;          // single conversion point; managers take seconds
    this._spawnMgr?.tick(dt);

    /* Steer the dummy, THEN tell the move system where it is. Order matters:
       pushing last frame's position would make every hit test lag the thing
       it is testing against by a frame, which at 18 cm/s is small but is
       exactly the kind of off-by-one-frame error that is impossible to see
       and annoying to find. */
    this._targetMgr?.tick(dt);
    if (this._dummy) this._smMgr?.setTargetPosition(this._dummy.position);

    this._smMgr?.tick(dt);
    /* Bullets advance after the move that launched them, so a projectile
       fired this frame is stepped this frame rather than sitting at the
       muzzle for one tick. */
    this._projMgr?.tick(dt);
  }

  override setVisible(v: boolean): void {
    super.setVisible(v);
    if (!v) {
      this._spawnMgr?.despawn();
      this._spawnBtn?.classList.remove('active');
      this._virtualControls?.hide();
      /* Bullets are scene objects with a lifetime; leaving the screen with
         some in flight would strand their meshes until the next launch
         happened to expire them. */
      this._projMgr?.expireAll();
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

  /* THROUGH ZUSTAND NOW, not raw `localStorage`.
     These two methods were the last `localStorage.getItem`/`setItem` pair in
     `src/` outside `src/stores/` — the banned pattern, named as debt twice in
     CLAUDE.md. The key and the payload shape are unchanged, so this is a
     relocation rather than a migration and no version shim is involved. */

  private _loadMoves(): void {
    const saves = specialMovesStore.getState().load();
    if (saves.length > 0) this._smMgr?.loadSaves(saves);
  }

  private _saveMoves(): void {
    specialMovesStore.getState().save(this._smMgr?.serializeAll() ?? []);
  }
}

import * as THREE from 'three';
import { applyRenderPolicy } from '../../render/shadowPolicy';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { SceneContext } from '../IArenaFeature';
import type {
  ArenaData, TrapData, SpeedLineData, SpeedLineSegment, SpeedLineEntryCondition,
  ZoneData, WallData, ObstacleData, BridgeData, BridgeSegmentData,
} from '../../types/arenaTypes';
import {
  arenaSurfaceYAtArenaLocal, worldToArenaLocal,
  polarToLocalXZ, makeSurfFn,
} from '../../geometry/surfaceUtils';
import { computeSegmentPath } from '../../geometry/speedLineBuilders';
import type { SceneSurfaceProjector } from '../../geometry/sceneSurfaceProjector';
import {
  DEG2RAD, DEFAULT_BASE_HEIGHT, SURFACE_PHYSICS, SURFACE_MU_REFERENCE,
  BEY_TIP_PROFILES, effectiveTipFriction,
} from '../../config/arenaConstants';
import { makeBeySpec, makeBeyState } from '../../sim/state';
import type { BeySpec, BeyState } from '../../sim/state';
import * as Step from '../../sim/step/integrate';
import { resolveObstacleSide } from '../../sim/step/obstacles';
import { resolveChannel } from '../../sim/step/channel';
import { fieldAccel } from '../../sim/step/fieldForce';
import {
  TIP_MOVEMENT, advancePattern, patternDirection, toPatternState,
  type PatternState,
} from '../../sim/step/movementPattern';
import { blendSteering } from '../../sim/step/railBlend';
import { launchVelocity, stepFlight, type FlightConfig } from '../../sim/step/aerial';
import { LAUNCHERS, stepCharge, launchOmega, IDLE_LAUNCH, type LaunchState } from '../../sim/step/launch';
import type { BeyBody } from '../../sim/step/beyCollision';
import {
  stepSpin, spinDecayRate, rpmToOmega, omegaToRpm, sleepOutOmega,
} from '../../sim/step/spin';
import type { ChannelSegment } from '../../sim/step/channel';
import type { ObstacleCollider, ColliderBody } from '../../sim/step/obstacles';
import { BuffDebuffManager } from './BuffDebuffManager';
import type { BuffInput } from './BuffDebuffManager';
import { evalEntryCondition, evalActivationMode } from '../conditions/ConditionEvaluator';
import type { ConditionContext } from '../conditions/ConditionEvaluator';
import { ZONE_EFFECTS } from '../conditions/ZoneEffectRegistry';
import { applyEjectBehavior } from '../conditions/EjectBehaviorHandler';
import type { EjectContext } from '../conditions/EjectBehaviorHandler';
import type { IControlManager } from './ControlManager';
import { spawnSettingsStore } from '../../stores/spawnSettingsStore';

// ── Spinning-top geometry ────────────────────────────────────────────────────
// Physics: BALL_RADIUS for XZ (wall/SL/trap contact), tip point for floor
// Visual:  4-part Group — handle cap + disc plate + ribbed cone + metal tip
const BALL_RADIUS          = 5;      // cm — disc girth radius (XZ collision boundary)
const BALL_HEIGHT          = 13;     // cm — total height tip→cap
const CAP_RADIUS           = 2.0;    // cm — narrow top handle
const CAP_HEIGHT           = 2.5;    // cm
const DISC_HEIGHT          = 2.0;    // cm — wide flat plate
const CONE_HEIGHT          = 7.5;    // cm — ribbed cone body
const TIP_HEIGHT           = 1.5;    // cm — metal tip
// Group origin = disc CENTRE (y=0). Tip is at y = BALL_TIP_OFFSET below origin.
const BALL_TIP_OFFSET      = -(DISC_HEIGHT / 2 + CONE_HEIGHT + TIP_HEIGHT); // = -10 cm

// ── Physics constants ────────────────────────────────────────────────────────
/* GRAVITY and AIR_CONTROL now live in `sim/step/integrate` — they belong to the
   integrator, not to this manager, and leaving stale copies here is how two
   sources of truth start. The rest are seeded into `_spec` below so they become
   per-bey values rather than facts about the only bey that can exist. */
const MOVE_FORCE           = 800;    // cm/s² (grounded)
const JUMP_IMPULSE         = 300;    // cm/s upward
const FRICTION_GROUND      = 0.88;   // XZ multiplier per frame (frame-rate independent via pow)
const FRICTION_AIR         = 0.997;
const MAX_SPEED_H          = 400;    // cm/s
const RESTITUTION_DEFAULT  = 0.45;
const MAT_RESTITUTION: Record<string, number> = { rubber: 0.15, stone: 0.40, abs: 0.65, metal: 0.90 };
const CAM_LERP             = 0.07;
const AUTO_MOVE_RADIUS     = 40;     // cm
const AUTO_MOVE_SPEED      = 45;     // deg/s
const RESPAWN_Y            = -500;   // world Y threshold
const HEALTH_MAX           = 100;
const BASE_APOTHEM         = 100;    // cm — octagon inradius fallback

// ── Speed line constants ─────────────────────────────────────────────────────
const SL_BASE_FORCE        = 500;    // cm/s²
const SL_CACHE_TTL         = 500;    // ms
const SL_LAUNCH_SCALE      = 80;     // cm/s per unit launchForce

// ── Spawn defaults ───────────────────────────────────────────────────────────
const SPAWN_DEFAULT_X      = 0;
const SPAWN_DEFAULT_Y      = 100;
const SPAWN_DEFAULT_Z      = 0;
const DEFAULT_TILT_DEG     = 0;
const DEFAULT_RPM          = 1500;

// ── Collision constants ──────────────────────────────────────────────────────
const WALL_CONTACT_EPS      = 1.5;   // cm
const POST_COLLISION_WINDOW = 300;   // ms
const COLL_NORMAL_MARGIN    = 1.30;
const COLL_STICKY_MARGIN    = 1.20;

export class SpawnManager {
  // Three.js
  private topGroup: THREE.Group | null = null;

  // Physics state
  private pos      = new THREE.Vector3();
  private vel      = new THREE.Vector3();
  private grounded = false;
  private health   = HEALTH_MAX;
  private spawned  = false;

  // Options
  private followCam  = false;
  private selfRotate = false;
  private autoMove   = false;
  private autoAngle  = 0;

  // Editable spawn state
  private spawnPos = new THREE.Vector3(SPAWN_DEFAULT_X, SPAWN_DEFAULT_Y, SPAWN_DEFAULT_Z);
  private spawnVel = new THREE.Vector3(0, 0, 0);
  private tiltDeg  = DEFAULT_TILT_DEG;
  private rpm      = DEFAULT_RPM;

  // Collision tracking
  private _lastCollisionTime     = 0;
  private _lastCollisionIsSticky = false;
  private _currentGravityScale   = 1.0;
  /* Friction coefficient of the surface under the bey, refreshed every
     _resolveSurface() exactly like _currentGravityScale. Defaults to the ABS
     reference so the octagon-base fallback behaves as it always has. */
  /* Reused across frames: the resolver mutates `pos`/`vel` through these
     references, which are re-pointed at the live Vector3s each tick. A
     Vector3 structurally satisfies Vec3, so there is no copy and no
     per-frame allocation. */
  /* Count of obstacle-side contacts since spawn.
     Exposed because contact is otherwise UNOBSERVABLE from outside: a bey that
     bounces off a pillar comes to rest almost exactly where one that never
     moved would, so neither the resting position nor a sampled closest
     approach can tell "it hit and rebounded" from "it never got there". A test
     without this can only ever assert something that is also true when the
     feature is switched off. */
  private _obstacleContacts = 0;
  /** Side-wall retentions since spawn. Same rationale as `_obstacleContacts`:
   *  a bey held on a deck and one that was never near an edge end up in
   *  indistinguishable places. */
  private _channelContacts = 0;
  /** Set once the heavy-top model says the bey has gone over. */
  private _sleptOut = false;
  /** The bey's OWN movement pattern — its will, from the tip. */
  private _pattern: PatternState = { radius: 0, theta: 0, phase: 0 };
  /** Two-stage launch charge, for the pre-battle sequence. */
  private _launch: LaunchState = IDLE_LAUNCH;
  /** Set while a jump-link arc is flying the bey. */
  private _flight: FlightConfig | null = null;

  private _obstacleBody: ColliderBody = {
    pos: { x: 0, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 },
    radius: BALL_RADIUS, tipOffset: BALL_TIP_OFFSET, topOffset: BALL_HEIGHT + BALL_TIP_OFFSET,
  };

  private _currentSurfaceMu      = SURFACE_MU_REFERENCE;

  // Spin direction + wall-impact callback + tip polarity (used by test mode / SpecialMoveManager)
  private _spinDir: 'right' | 'left' = 'right';
  _onWallImpact?: () => void;
  private _tipPolarity: 'north' | 'south' | 'none' = 'none';
  private _rKeyUnsub?: () => void;

  // Buff / duration-tier tracking
  private _buffMgr!: BuffDebuffManager;   // built in ctor once ctx.clock is available
  private _trapTimers = new Map<string, number>();

  /* ── sim/ bridge ────────────────────────────────────────────────────────
     The physics maths now lives in `sim/step/*`, which is pure, THREE-free and
     unit-testable without a browser. This manager keeps ownership of the scene,
     the HUD and the collision resolution against arena features, and delegates
     the integration.

     `_sim.pos` / `_sim.vel` ARE the THREE.Vector3 instances above, not copies:
     a Vector3 structurally satisfies `Vec3`, so the pure functions mutate the
     same objects the renderer already reads. No per-frame allocation, and no
     second copy of the truth to keep in sync.

     The remaining scalars (grounded, gravityScale, surfaceMu) are still owned
     by this class, so they are pushed in before a step and read back after.
     They move into BeyState wholesale when SpawnManager becomes BeySystem. */
  private readonly _spec: BeySpec = makeBeySpec('spawn_ball', {
    radius: BALL_RADIUS, height: BALL_HEIGHT, tipOffset: BALL_TIP_OFFSET,
    moveForce: MOVE_FORCE, jumpImpulse: JUMP_IMPULSE,
    frictionGround: FRICTION_GROUND, frictionAir: FRICTION_AIR,
    maxSpeedH: MAX_SPEED_H, restitution: RESTITUTION_DEFAULT,
    maxHealth: HEALTH_MAX,
  });
  private readonly _sim: BeyState = makeBeyState(this._spec);

  /** Point the sim state at this manager's live vectors and scalars. */
  private _syncSimIn(): void {
    this._sim.pos = this.pos;
    this._sim.vel = this.vel;
    this._sim.grounded     = this.grounded;
    this._sim.gravityScale = this._currentGravityScale;
    this._sim.surfaceMu    = this._currentSurfaceMu;
  }

  /** Read back what the pure step decided. */
  private _syncSimOut(): void {
    this.grounded = this._sim.grounded;
  }

  // Speed line tracking
  private slPathCache   = new Map<string, { pts: THREE.Vector3[]; ts: number; epoch: number }>();
  private slOnRibbon    = new Map<string, boolean>();
  private slExitTangent = new THREE.Vector3();

  constructor(
    private readonly ctx:             SceneContext,
    private readonly getCamera:       () => THREE.PerspectiveCamera | null,
    private readonly getControls:     () => OrbitControls | null,
    private readonly getArenas:       () => ReadonlyMap<string, ArenaData>,
    private readonly getTraps:        () => ReadonlyMap<string, TrapData>,
    private readonly getSpeedLines:   () => ReadonlyMap<string, SpeedLineData>,
    private readonly getZones:        () => ReadonlyMap<string, ZoneData>,
    private readonly getWalls:        () => ReadonlyMap<string, WallData>,
    private readonly hudEl:   HTMLElement,
    private readonly ctrlMgr: IControlManager,
    /* Same projector the ribbon is built with. Without it the physics path
       fell back to the analytic bowl formula while the visible ribbon was
       raycast against real meshes, so over a bridge deck or an obstacle the
       bey followed a different line from the one drawn on screen. */
    private readonly getProjector: (arenaId: string) => SceneSurfaceProjector | undefined,
    private readonly getObstacles: () => ReadonlyMap<string, ObstacleData>,
    private readonly getBridgeSegments: () => ReadonlyMap<string, BridgeSegmentData>,
    private readonly getBridges: () => ReadonlyMap<string, BridgeData>,
  ) {
    this._buffMgr = new BuffDebuffManager(this.ctx.clock);
    this._buildHUD();
    this._loadSettings();
    this.ctrlMgr.onButtonPress('jump', () => {
      if (this.spawned) {
        this._syncSimIn();
        Step.applyJump(this._sim, this._spec);
        this._syncSimOut();
      }
    });
    this.ctrlMgr.onButtonPress('trigger', () => {
      if (this.spawned) this._applyTrigger(1 / 20);
    });
    const rKeyHandler = (e: KeyboardEvent) => {
      if (e.code === 'KeyR' && !e.repeat && this.spawned) {
        this._spinDir = this._spinDir === 'right' ? 'left' : 'right';
      }
    };
    document.addEventListener('keydown', rKeyHandler);
    this._rKeyUnsub = () => document.removeEventListener('keydown', rKeyHandler);
  }

  get isSpawned(): boolean { return this.spawned; }

  // ── Public API ──────────────────────────────────────────────────────────────

  spawn(): void {
    if (this.spawned) return;
    this.spawned  = true;
    this.health   = HEALTH_MAX;
    this._obstacleContacts = 0;
    this._channelContacts  = 0;
    this._sleptOut = false;
    this.pos.copy(this.spawnPos);
    this.vel.copy(this.spawnVel);
    this.grounded = false;
    this.slPathCache.clear();
    this.slOnRibbon.clear();

    this.topGroup = this._buildTopGroup();
    /* The bey is the one object whose shadow the player actually reads — it is
       how you tell it is airborne rather than sliding. Applied here because the
       top is added straight to the scene on spawn, bypassing RenderManager. */
    applyRenderPolicy(this.topGroup);
    this.ctx.scene.add(this.topGroup);
    this.topGroup.position.copy(this.pos);

    this.hudEl.style.display = 'flex';
  }

  despawn(): void {
    if (!this.spawned) return;
    this.spawned = false;

    if (this.topGroup) {
      this.ctx.scene.remove(this.topGroup);
      this.topGroup.traverse(obj => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach(mt => mt.dispose());
          else m.material.dispose();
        }
      });
      this.topGroup = null;
    }

    this.slPathCache.clear();
    this.slOnRibbon.clear();
    this._buffMgr.clearEntity('spawn_ball');
    this._trapTimers.clear();

    this.hudEl.style.display = 'none';
  }

  dispose(): void {
    this.despawn();
    this._rKeyUnsub?.();
  }

  // ── Tick ────────────────────────────────────────────────────────────────────

  /**
   * @param dt Seconds. Was `dtMs` with an internal `Math.min(dtMs/1000, 0.05)`
   *   clamp — a silent 50 ms ceiling that made the simulation *slow down* below
   *   20 fps instead of catching up, and desynced `_buffMgr` (which got the
   *   unclamped value) from the physics. The fixed-timestep loop in
   *   `Sandbox.loop` now guarantees a constant dt, so the clamp is both
   *   unnecessary and harmful, and the unit is seconds like every other
   *   feature manager.
   */
  tick(dt: number): void {
    if (!this.spawned || !this.topGroup) return;

    this._applyAutoMove(dt);
    this._applyPattern(dt);
    this._applyInput(dt);
    this._applyFlightOrGravity(dt);
    this._integrate(dt);
    /* Channels first, on the following reasoning: retention is a LATERAL
       correction whose failure mode is VERTICAL. If the surface is resolved
       first, a bey that has crossed the deck edge is found to have nothing
       underneath and starts falling, and only then gets pushed back between
       the rails -- by which point its tip is under the deck plane and
       `projectBelow`, which only looks downward, cannot catch it again.
       Putting the body back on the track before asking what is beneath it
       removes that window.

       HONEST CAVEAT: swapping the order did NOT measurably change behaviour in
       the cases tried, so this is reasoned rather than demonstrated. It is
       kept because the argument holds and the swap costs nothing, not because
       a test distinguishes the two orders. */
    this._resolveChannels();
    this._resolveSurface();
    this._resolveWalls();
    this._resolveObstacles();
    this._applySpeedLines(dt);
    this._applyTraps(dt);
    this._applyZones(dt);
    this._stepSpin(dt);
    this._buffMgr.tick(dt * 1000);
    this._checkRespawn();
    this._applySelfRotation(dt);
    this._updateCamera();
    this.topGroup.position.copy(this.pos);
    this._updateHUD();
  }

  // ── Spinning-top geometry ───────────────────────────────────────────────────

  private _buildTopGroup(): THREE.Group {
    const group = new THREE.Group();

    // Y layout (group centre = disc CENTRE at y=0):
    //  +3.5  top of cap
    //  +1.0  disc top
    //   0.0  disc CENTRE (group origin = pos.y in world)
    //  -1.0  disc bottom / cone wide end
    //  -8.5  cone apex / tip top
    // -10.0  tip point  (world Y = pos.y + BALL_TIP_OFFSET)

    // 1. Handle cap
    const capGeo  = new THREE.CylinderGeometry(CAP_RADIUS * 0.85, CAP_RADIUS, CAP_HEIGHT, 16);
    const capMat  = new THREE.MeshStandardMaterial({ color: 0x223388, roughness: 0.4, metalness: 0.3 });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = DISC_HEIGHT / 2 + CAP_HEIGHT / 2;
    group.add(capMesh);

    // 2. Wide disc plate
    const discGeo  = new THREE.CylinderGeometry(BALL_RADIUS, BALL_RADIUS, DISC_HEIGHT, 32);
    const discMat  = new THREE.MeshStandardMaterial({ color: 0xcc2200, roughness: 0.5, metalness: 0.2 });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    discMesh.position.y = 0;
    group.add(discMesh);

    // 3. Cone body — wide top (at disc bottom=-1), narrow apex at bottom (-8.5).
    //    CylinderGeometry(topR, bottomR): correct orientation for a spinning top.
    //    ConeGeometry would be backwards (apex at top = wrong).
    const coneGeo  = new THREE.CylinderGeometry(BALL_RADIUS, 0, CONE_HEIGHT, 32, 12);
    const coneMat  = new THREE.MeshStandardMaterial({ color: 0xdd8833, roughness: 0.75, metalness: 0.05 });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.y = -(DISC_HEIGHT / 2 + CONE_HEIGHT / 2);
    group.add(coneMesh);

    // 4. Metal tip — wide top (r=0.35, at -8.5), sharp point at bottom (-10.0).
    const tipGeo  = new THREE.CylinderGeometry(0.35, 0, TIP_HEIGHT, 12);
    const tipMat  = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.1, metalness: 0.9 });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.position.y = -(DISC_HEIGHT / 2 + CONE_HEIGHT + TIP_HEIGHT / 2);
    group.add(tipMesh);

    return group;
  }

  // ── Physics pipeline ────────────────────────────────────────────────────────

  private _applyAutoMove(dt: number): void {
    if (!this.autoMove) return;
    this.autoAngle += AUTO_MOVE_SPEED * DEG2RAD * dt;
    const tx = -Math.sin(this.autoAngle) * AUTO_MOVE_RADIUS * AUTO_MOVE_SPEED * DEG2RAD;
    const tz =  Math.cos(this.autoAngle) * AUTO_MOVE_RADIUS * AUTO_MOVE_SPEED * DEG2RAD;
    this.vel.x = THREE.MathUtils.lerp(this.vel.x, tx, 0.12);
    this.vel.z = THREE.MathUtils.lerp(this.vel.z, tz, 0.12);
    const targetX = Math.cos(this.autoAngle) * AUTO_MOVE_RADIUS;
    const targetZ = Math.sin(this.autoAngle) * AUTO_MOVE_RADIUS;
    this.vel.x += (targetX - this.pos.x) * 2 * dt;
    this.vel.z += (targetZ - this.pos.z) * 2 * dt;
  }

  private _applyInput(dt: number): void {
    if (this.autoMove) return;
    const axes = this.ctrlMgr.getMovementAxes();
    if (axes.x === 0 && axes.y === 0) return;
    const cam = this.getCamera();
    if (!cam) return;
    const fwd = cam.getWorldDirection(new THREE.Vector3()); fwd.y = 0; fwd.normalize();
    const right = new THREE.Vector3().crossVectors(fwd, THREE.Object3D.DEFAULT_UP).normalize();
    const dir = new THREE.Vector3();
    dir.addScaledVector(fwd,   axes.y);
    dir.addScaledVector(right, axes.x);
    /* Steering and the speed cap are pure maths over the spec — including the
       controlAuthority dial, which is a no-op at the default 1.0 but is the
       hook the player-vs-bey blend needs. */
    this._syncSimIn();
    Step.applySteering(this._sim, this._spec, dir, dt);
    Step.clampHorizontalSpeed(this._sim, this._spec);
    this._syncSimOut();
  }

  /** Airborne arcs bypass plain gravity while a flight config is active. */
  private _applyFlightOrGravity(dt: number): void {
    if (this._stepFlight(dt)) return;
    this._applyGravity(dt);
  }

  private _applyGravity(dt: number): void {
    this._syncSimIn();
    Step.applyGravity(this._sim, dt);
    this._syncSimOut();
  }

  private _integrate(dt: number): void {
    this._syncSimIn();
    Step.integrate(this._sim, this._spec, dt);
    this._syncSimOut();
  }

  private _resolveSurface(): void {
    this.grounded = false;
    let bestSurfY = -Infinity;
    let bestMat: string | undefined;
    let bestMu = SURFACE_MU_REFERENCE;
    let bestArenaId: string | undefined;

    for (const [arenaId, arena] of this.getArenas().entries()) {
      const { alx, alz } = worldToArenaLocal(this.pos.x, this.pos.z, arena);
      if ((alx / arena.radiusX) ** 2 + (alz / arena.radiusZ) ** 2 > 1.0) continue;
      const surfY = arenaSurfaceYAtArenaLocal(arena, alx, alz);
      if (surfY > bestSurfY) {
        bestSurfY = surfY;
        bestMat = arena.baseMaterial;
        bestMu = SURFACE_PHYSICS[arena.surface]?.friction ?? SURFACE_MU_REFERENCE;
        bestArenaId = arenaId;
        this._currentGravityScale = arena.gravityScale ?? 1.0;
      }
    }

    // Octagon base fallback — top face is at world Y=0 (baseMesh.position.y=-H/2 puts top at 0)
    if (bestSurfY === -Infinity &&
        Math.abs(this.pos.x) <= BASE_APOTHEM &&
        Math.abs(this.pos.z) <= BASE_APOTHEM) {
      bestSurfY = 0;
    }

    /* MESH SURFACES — bridge decks, obstacle tops, wall caps, the real bowl.
       Until now the bey stood only on the analytic arena formula plus a flat
       octagon fallback, so it drove straight through every bridge in the
       project: ten segment types including loops and corkscrews, all of them
       scenery.

       `projectBelow`, not `project`: the topmost surface in the column is the
       wrong answer for standing. A bey inside a bowl with a bridge crossing
       above it would otherwise be told the deck is its ground and teleport up
       onto it. Only a surface at or below the tip can hold it up.

       This is affordable at all because the projector is BVH-accelerated; the
       same query brute-force was ~0.5 ms per call. */
    const projector = this.getProjector(bestArenaId ?? '');
    if (projector) {
      const tipNow = this.pos.y + BALL_TIP_OFFSET;
      const hit = projector.projectBelow(this.pos.x, this.pos.z, tipNow);
      if (hit && hit.point.y > bestSurfY) {
        bestSurfY = hit.point.y;
        /* A deck is ABS unless its own feature says otherwise; resolving the
           exact per-feature material needs the owning manager and belongs with
           the per-tip friction work. */
        bestMat = bestMat ?? 'abs';
      }
    }

    if (bestSurfY === -Infinity) return;
    this._currentSurfaceMu = bestMu;

    const tipY = this.pos.y + BALL_TIP_OFFSET;
    if (tipY <= bestSurfY) {
      this.pos.y = bestSurfY - BALL_TIP_OFFSET;
      if (this.vel.y < 0) {
        const r = MAT_RESTITUTION[bestMat ?? 'abs'] ?? RESTITUTION_DEFAULT;
        this.vel.y = -this.vel.y * r;
        if (Math.abs(this.vel.y) < 5) { this.vel.y = 0; this.grounded = true; }
      }
      if (this.vel.y === 0) this.grounded = true;
    }
  }

  private _resolveWalls(): void {
    for (const wall of this.getWalls().values()) {
      if (wall.parentType !== 'arena') continue;
      const arena = this.getArenas().get(wall.parentId);
      if (!arena) continue;

      const rimY = arena.posY;  // arena wall mesh starts at arena.posY (world Y=0 default)
      if (this.pos.y - BALL_RADIUS > rimY + wall.height) continue;

      const { alx, alz } = worldToArenaLocal(this.pos.x, this.pos.z, arena);
      if (alx === 0 && alz === 0) continue;

      const rX = arena.radiusX; const rZ = arena.radiusZ;
      const nlx = alx / (rX * rX); const nlz = alz / (rZ * rZ);
      const nlLen = Math.sqrt(nlx * nlx + nlz * nlz) || 1;
      const outLX = nlx / nlLen; const outLZ = nlz / nlLen;

      const cosR = Math.cos(arena.rotY * DEG2RAD);
      const sinR = Math.sin(arena.rotY * DEG2RAD);
      const outWX = outLX * cosR - outLZ * sinR;
      const outWZ = outLX * sinR + outLZ * cosR;

      const angle = Math.atan2(alz, alx);
      const cosA = Math.cos(angle); const sinA = Math.sin(angle);
      const rimDist = 1 / Math.sqrt((cosA * cosA) / (rX * rX) + (sinA * sinA) / (rZ * rZ));
      const ballDist = Math.sqrt(alx * alx + alz * alz);
      // Outward walls: inner collision surface IS the rim (default).
      // Inward walls: inner collision surface is rim − thickness (wall protrudes inward).
      const innerSurf = wall.thicknessDirection === 'inward'
        ? rimDist - wall.thickness
        : rimDist;
      const gap = innerSurf - (ballDist + BALL_RADIUS);

      if (gap > WALL_CONTACT_EPS) continue;

      if (!wall.fullPerimeter) {
        const angleDeg = ((angle * 180 / Math.PI) % 360 + 360) % 360;
        const s = ((wall.arcStart % 360) + 360) % 360;
        const e = ((wall.arcEnd   % 360) + 360) % 360;
        const covered = s <= e ? angleDeg >= s && angleDeg <= e
                                : angleDeg >= s || angleDeg <= e;
        if (!covered) continue;
      }

      const radVel = this.vel.x * outWX + this.vel.z * outWZ;
      if (radVel <= 0) continue;

      const r = MAT_RESTITUTION[wall.material] ?? RESTITUTION_DEFAULT;
      this.vel.x -= (1 + r) * radVel * outWX;
      this.vel.z -= (1 + r) * radVel * outWZ;

      if (gap < 0) {
        // gap is negative; adding gap*outW moves ball inward (toward center) by |gap|
        this.pos.x += gap * outWX;
        this.pos.z += gap * outWZ;
      }

      this._lastCollisionTime     = this.ctx.clock.nowMs();
      this._lastCollisionIsSticky = false;
      if (gap < 0) this._onWallImpact?.();
    }
  }

  /**
   * Lateral collision with obstacle SIDES.
   *
   * Tops already worked: an obstacle's upper face is just another surface the
   * projector reports under the bey's feet. The sides never existed, so the
   * Tower arena's central pillar was something you drove through and —
   * if you happened to pass over it — landed on.
   *
   * The resolution itself lives in `sim/step/obstacles`, which is pure: plain
   * numbers, no THREE, no scene. This method's only job is the translation
   * from `ObstacleData` (meshes, colours, STL blobs) into the handful of
   * figures the maths needs. That split is what lets the geometry be tested
   * without a browser.
   *
   * Analytic primitives, not the mesh, and deliberately: `ObstacleData` already
   * states that a shipped `.glb` prop is drawn in place of the primitive and
   * "collision always uses the primitive either way". A boat still collides as
   * the box it was authored as — cheaper, and far more predictable than
   * sweeping against triangle soup.
   */
  private _resolveObstacles(): void {
    const obstacles = this.getObstacles();
    if (obstacles.size === 0) return;

    this._obstacleBody.pos = this.pos;
    this._obstacleBody.vel = this.vel;

    for (const obs of obstacles.values()) {
      const col = this._obstacleCollider(obs);
      if (col && resolveObstacleSide(this._obstacleBody, col)) {
        this._obstacleContacts++;
        this._lastCollisionTime     = this.ctx.clock.nowMs();
        this._lastCollisionIsSticky = false;
      }
    }
  }

  /**
   * Keep the bey between a bridge deck's side walls.
   *
   * Without this a deck holds the bey UP but not ON: drive into a curve and it
   * slides straight off the side, which makes every curved segment and the
   * whole authored `u_channel` cross-section decorative.
   *
   * Distinct from obstacle sides, which push a body OUT of a closed primitive.
   * A channel pushes it IN, toward a centreline that curves, climbs and banks.
   * That is only cheap because `BridgeManager` caches the sampled centreline
   * when it builds the geometry — recomputing it here would mean re-deriving
   * every preceding segment's end pose, every tick.
   */
  private _resolveChannels(): void {
    const segs = this.getBridgeSegments();
    if (segs.size === 0) return;

    this._obstacleBody.pos = this.pos;
    this._obstacleBody.vel = this.vel;

    for (const seg of segs.values()) {
      const ch = this._channelSegment(seg);
      if (ch && resolveChannel(this._obstacleBody, ch)) {
        this._channelContacts++;
        this._lastCollisionTime     = this.ctx.clock.nowMs();
        this._lastCollisionIsSticky = false;
      }
    }
  }

  /** `BridgeSegmentData` + its parent section -> a drivable corridor. */
  private _channelSegment(seg: BridgeSegmentData): ChannelSegment | null {
    if (!seg._pathPts || !seg._pathRights || seg._halfWidth === undefined) return null;
    const bridge = this.getBridges().get(seg.bridgeId);
    if (!bridge) return null;
    const sec = bridge.section;
    if (!sec.hasLeftWall && !sec.hasRightWall) return null;
    return {
      id: seg.id,
      points: seg._pathPts,
      rights: seg._pathRights,
      halfWidth: seg._halfWidth,
      wallHeight: sec.sideWallHeight,
      floorDrop: sec.crossSection === 'u_channel' ? sec.depth : 0,
      hasLeftWall: sec.hasLeftWall,
      hasRightWall: sec.hasRightWall,
      restitution: MAT_RESTITUTION[sec.material] ?? RESTITUTION_DEFAULT,
    };
  }

  /**
   * `ObstacleData` -> the primitive collision needs.
   *
   * Every obstacle shape is built origin-centred and then positioned, so
   * `posY` is the MIDDLE of the primitive, not its base — getting that
   * backwards would offset every obstacle by half its height.
   *
   * `rotX`/`rotZ` are not represented: a tilted primitive is no longer an
   * upright prism and the closed-form cross-section stops being valid. Rather
   * than collide against a silently wrong shape, a tilted obstacle keeps the
   * behaviour it has always had — tops only, no sides. Documented here because
   * it is a real limitation and not an oversight.
   */
  private _obstacleCollider(o: ObstacleData): ObstacleCollider | null {
    const restitution = MAT_RESTITUTION[o.material] ?? RESTITUTION_DEFAULT;
    const base = { id: o.id, cx: o.posX, cy: o.posY, cz: o.posZ, rotYDeg: o.rotY, restitution };

    switch (o.shape) {
      case 'cube': {
        const h = o.dimX / 2;
        return { ...base, halfHeight: h,
                 bottom: { kind: 'box', hx: h, hz: h }, top: { kind: 'box', hx: h, hz: h } };
      }
      case 'cuboid': {
        const hx = o.dimX / 2, hz = o.dimZ / 2;
        return { ...base, halfHeight: o.dimY / 2,
                 bottom: { kind: 'box', hx, hz }, top: { kind: 'box', hx, hz } };
      }
      case 'sphere': {
        const r = o.dimX / 2;
        return { ...base, halfHeight: r, spherical: true,
                 bottom: { kind: 'circle', r }, top: { kind: 'circle', r } };
      }
      case 'cylinder': {
        const r = o.dimX / 2;
        return { ...base, halfHeight: o.dimY / 2,
                 bottom: { kind: 'circle', r }, top: { kind: 'circle', r } };
      }
      case 'pyramid':
        // ConeGeometry(dimX/2, dimY, 4) rotated 45 degrees: a square that
        // tapers to a point, with dimX/2 as the base half-width.
        return { ...base, halfHeight: o.dimY / 2,
                 bottom: { kind: 'box', hx: o.dimX / 2, hz: o.dimX / 2 },
                 top:    { kind: 'box', hx: 0, hz: 0 } };
      case 'frustum':
        // dimX = bottom diameter, dimZ = TOP diameter (not depth).
        return { ...base, halfHeight: o.dimY / 2,
                 bottom: { kind: 'circle', r: o.dimX / 2 },
                 top:    { kind: 'circle', r: o.dimZ / 2 } };
      default:
        return null;
    }
  }

  // ── Speed lines ─────────────────────────────────────────────────────────────

  private _getSlWorldPath(sl: SpeedLineData): THREE.Vector3[] {
    const now = this.ctx.clock.nowMs();
    const epoch = sl._pathEpoch ?? 0;
    const cached = this.slPathCache.get(sl.id);
    /* Epoch first, then TTL. The TTL alone bounded staleness at 500 ms, so an
       edit in the properties panel left the bey following the OLD path for up
       to half a second after the ribbon had already moved. The epoch is bumped
       by the geometry rebuild itself, so an edit invalidates immediately. */
    if (cached && cached.epoch === epoch && now - cached.ts < SL_CACHE_TTL) return cached.pts;

    const arena = this.getArenas().get(sl.parentArenaId);
    if (!arena) { this.slPathCache.set(sl.id, { pts: [], ts: now, epoch }); return []; }

    const zones = this.getZones() as Map<string, ZoneData>;
    const surfFn = makeSurfFn({ parentZoneId: sl.parentZoneId }, arena, zones);
    const localPts = computeSegmentPath(sl, arena, surfFn, this.getProjector(sl.parentArenaId));

    const cosA = Math.cos(arena.rotY * DEG2RAD);
    const sinA = Math.sin(arena.rotY * DEG2RAD);
    const worldPts = localPts.map(p => new THREE.Vector3(
      arena.posX + p.x * cosA - p.z * sinA,
      p.y,
      arena.posZ + p.x * sinA + p.z * cosA,
    ));

    this.slPathCache.set(sl.id, { pts: worldPts, ts: now, epoch });
    return worldPts;
  }

  private _applySpeedLines(dt: number): void {
    for (const [slId, sl] of this.getSpeedLines()) {
      if (sl.enabled === false) { this.slOnRibbon.set(slId, false); continue; }
      const pts = this._getSlWorldPath(sl);
      if (pts.length < 2) continue;

      let minDist2 = Infinity, closestSegIdx = 0;
      let closestTx = 0, closestTz = 0;

      for (let i = 0; i < pts.length - 1; i++) {
        const ax = pts[i].x, az = pts[i].z;
        const bx = pts[i + 1].x, bz = pts[i + 1].z;
        const abx = bx - ax, abz = bz - az;
        const len2 = abx * abx + abz * abz;
        const t = len2 > 0.001
          ? Math.max(0, Math.min(1, ((this.pos.x - ax) * abx + (this.pos.z - az) * abz) / len2))
          : 0;
        const cx = ax + t * abx, cz = az + t * abz;
        const d2 = (this.pos.x - cx) ** 2 + (this.pos.z - cz) ** 2;
        if (d2 < minDist2) { minDist2 = d2; closestSegIdx = i; closestTx = abx; closestTz = abz; }
      }

      let contactRange = sl.width / 2 + BALL_RADIUS;
      const sinceCollision = this.ctx.clock.nowMs() - this._lastCollisionTime;
      if (sinceCollision < POST_COLLISION_WINDOW) {
        contactRange *= this._lastCollisionIsSticky ? COLL_STICKY_MARGIN : COLL_NORMAL_MARGIN;
      }
      const onRibbon = minDist2 < contactRange * contactRange;
      const wasOnRibbon = this.slOnRibbon.get(slId) ?? false;

      if (!onRibbon) {
        if (wasOnRibbon) this._handleSlExit(sl);
        this.slOnRibbon.set(slId, false);
        continue;
      }

      const condCtx: ConditionContext = {
        velocityMs:   Math.sqrt(this.vel.x ** 2 + this.vel.y ** 2 + this.vel.z ** 2),
        gamePhase:    'battle',
        timeOnPath:   0,
        activePeriod: this.ctx.clock.nowSec(),
      };
      const worldDistToStart = Math.sqrt((this.pos.x - pts[0].x) ** 2 + (this.pos.z - pts[0].z) ** 2);
      if (!evalActivationMode(sl.activationMode, sl, condCtx, worldDistToStart)) {
        this.slOnRibbon.set(slId, false); continue;
      }

      const segIdx = Math.min(
        Math.floor(closestSegIdx * sl.segments.length / (pts.length - 1)),
        sl.segments.length - 1,
      );
      const seg: SpeedLineSegment | undefined = sl.segments[segIdx];

      const secIdx = seg?.sectionIndex ?? -1;
      const sec = (secIdx >= 0 && sl.presetParams.sections)
        ? (sl.presetParams.sections[secIdx] ?? null)
        : null;

      const effectiveCond: SpeedLineEntryCondition =
        (sec?.entryCondition ?? sl.entryCondition) as SpeedLineEntryCondition;
      if (!evalEntryCondition(effectiveCond, condCtx)) { this.slOnRibbon.set(slId, false); continue; }

      const segMult  = (seg?.speedMult && seg.speedMult !== 0) ? seg.speedMult : 1;
      const secMult  = (sec?.speedMult !== null && sec?.speedMult !== undefined) ? sec.speedMult : 1;
      const effectiveMult = sl.speedMultiplier * segMult * secMult;

      let tLen = Math.sqrt(closestTx ** 2 + closestTz ** 2);
      if (tLen < 0.001) { this.slOnRibbon.set(slId, true); continue; }
      let tx = closestTx / tLen, tz = closestTz / tLen;

      if (sl.direction === 'reverse') {
        tx = -tx; tz = -tz;
      } else if (sl.direction === 'bidirectional') {
        if (this.vel.x * tx + this.vel.z * tz < 0) { tx = -tx; tz = -tz; }
      }

      const force = SL_BASE_FORCE * effectiveMult * dt;
      this.vel.x += tx * force;
      this.vel.z += tz * force;

      const hspd = Math.sqrt(this.vel.x ** 2 + this.vel.z ** 2);
      const speedCap = MAX_SPEED_H * Math.max(1, effectiveMult);
      if (hspd > speedCap) { this.vel.x = this.vel.x / hspd * speedCap; this.vel.z = this.vel.z / hspd * speedCap; }

      this.slExitTangent.set(tx, 0, tz);

      if (sl.statModifiers) {
        const buff: BuffInput = {
          sourceId: sl.id, sourceType: 'speed_line',
          mods: sl.statModifiers, durationMs: null,
        };
        this._buffMgr.apply('spawn_ball', buff);
      }

      this.slOnRibbon.set(slId, true);
    }
  }

  private _handleSlExit(sl: SpeedLineData): void {
    this._buffMgr.removeSource('spawn_ball', sl.id);
    const ctx: EjectContext = {
      velocity:     this.vel.clone(),
      position:     this.pos.clone(),
      pathForward:  this.slExitTangent.clone(),
      launchForce:  sl.launchForce * SL_LAUNCH_SCALE,
      jumpLinks:    new Map(),
      slJumpLinkId: sl.jumpLinkId,
    };
    const result = applyEjectBehavior(sl.exitBehavior, ctx);
    this.vel.copy(result.velocity);
    if (sl.exitBehavior === 'launch') {
      this.vel.y = Math.max(this.vel.y, result.velocity.length() * 0.4);
      this.grounded = false;
    }
  }

  // ── Traps ───────────────────────────────────────────────────────────────────

  private _applyTraps(dt: number): void {
    const insideThisFrame = new Set<string>();

    for (const trap of this.getTraps().values()) {
      let cx: number, cz: number, surfY: number;
      if (trap.parentType === 'base') {
        cx = trap.basePosX; cz = trap.basePosZ; surfY = DEFAULT_BASE_HEIGHT;
      } else {
        const arena = this.getArenas().get(trap.parentId);
        if (!arena) continue;
        const { lx, lz } = polarToLocalXZ(trap.posR, trap.posAngle);
        const cosA = Math.cos(arena.rotY * DEG2RAD); const sinA = Math.sin(arena.rotY * DEG2RAD);
        cx = arena.posX + lx * cosA - lz * sinA;
        cz = arena.posZ + lx * sinA + lz * cosA;
        surfY = arenaSurfaceYAtArenaLocal(arena, lx, lz);
      }

      if (Math.abs((this.pos.y + BALL_TIP_OFFSET) - surfY) > 4) continue;

      const dx = this.pos.x - cx; const dz = this.pos.z - cz;
      const hx = trap.dimX / 2 + BALL_RADIUS; const hz = trap.dimZ / 2 + BALL_RADIUS;
      let inside: boolean;
      switch (trap.shape) {
        case 'circle':
        case 'ellipse':
          inside = (dx / hx) ** 2 + (dz / hz) ** 2 <= 1.0; break;
        case 'rectangle':
          inside = Math.abs(dx) <= hx && Math.abs(dz) <= hz; break;
        default:
          inside = (dx / hx) ** 2 + (dz / hz) ** 2 <= 1.0;
      }
      if (!inside) continue;

      insideThisFrame.add(trap.id);
      this._applyTrapEffect(trap, dt);

      if (trap.effect === 'buff_zone' && trap.durationTiers?.length) {
        const key = `${trap.id}:spawn_ball`;
        const elapsed = (this._trapTimers.get(key) ?? 0) + dt;
        this._trapTimers.set(key, elapsed);
        const tier = [...trap.durationTiers].reverse().find(t => elapsed >= t.thresholdSeconds);
        if (tier) {
          const buff: BuffInput = {
            sourceId: `${trap.id}_tier`, sourceType: 'trap',
            mods: { spinRateMult: 1 - (tier.rpmLossFactor ?? 0) },
            durationMs: null,
          };
          this._buffMgr.apply('spawn_ball', buff);
        }
      }
    }

    for (const [key] of this._trapTimers) {
      const trapId = key.split(':')[0];
      if (!insideThisFrame.has(trapId)) {
        this._trapTimers.delete(key);
        this._buffMgr.removeSource('spawn_ball', `${trapId}_tier`);
      }
    }
  }

  private _applyTrapEffect(trap: TrapData, dt: number): void {
    switch (trap.effect) {
      case 'damage':
        this.health -= trap.damageFactor * 20 * dt; break;
      case 'heal':
        this.health = Math.min(HEALTH_MAX, this.health + trap.healFactor * 20 * dt); break;
      case 'launch':
        this.vel.x += trap.forceX * dt * 60;
        this.vel.y += trap.forceY * dt * 60;
        this.vel.z += trap.forceZ * dt * 60;
        this.grounded = false; break;
      case 'gravity_pull': {
        let tcx = 0, tcz = 0;
        if (trap.parentType === 'base') { tcx = trap.basePosX; tcz = trap.basePosZ; }
        else {
          const arena = this.getArenas().get(trap.parentId);
          if (arena) { const { lx, lz } = polarToLocalXZ(trap.posR, trap.posAngle); tcx = arena.posX + lx; tcz = arena.posZ + lz; }
        }
        /* THROUGH THE GENERALISED FIELD, not a bespoke radial pull.
           The old code could only ever suck inward, which is why every
           vortex (needs a tangential component) and every barrier (needs an
           outward one) in the corpus was inexpressible — ~200 cases on this
           one limitation. `gravityMode` now selects the kind, and a Rankine
           core stops the force diverging at the centre. */
        const accel = fieldAccel({
          id: trap.id,
          kind: trap.gravityKind ?? 'attract',
          centre: { x: tcx, y: 0, z: tcz },
          radius: trap.gravityRange ?? 60,
          coreRadius: Math.max(1, (trap.gravityRange ?? 60) * 0.2),
          strength: trap.gravityStrength ?? 200,
          swirl: 0.6,
        }, this.pos);
        this.vel.x += accel.x * dt;
        this.vel.z += accel.z * dt;
        break;
      }
      case 'freeze':
        this.vel.x *= Math.max(0, 1 - 5 * dt);
        this.vel.z *= Math.max(0, 1 - 5 * dt);
        break;
    }
    this.health = Math.max(0, Math.min(HEALTH_MAX, this.health));
  }

  // ── Zones ───────────────────────────────────────────────────────────────────

  private _applyZones(dt: number): void {
    for (const zone of this.getZones().values()) {
      const arena = this.getArenas().get(zone.parentArenaId);
      if (!arena) continue;
      const { lx, lz } = polarToLocalXZ(zone.posR, zone.posAngle);
      const cosA = Math.cos(arena.rotY * DEG2RAD); const sinA = Math.sin(arena.rotY * DEG2RAD);
      const wx = arena.posX + lx * cosA - lz * sinA;
      const wz = arena.posZ + lx * sinA + lz * cosA;
      const dx = this.pos.x - wx; const dz = this.pos.z - wz;
      if ((dx / zone.radiusX) ** 2 + (dz / zone.radiusZ) ** 2 > 1.0) continue;

      const eff = ZONE_EFFECTS[zone.fill ?? 'none'] ?? ZONE_EFFECTS.none;
      const xzMult = eff.frictionPerSec * eff.velDragMult;
      this.vel.x *= Math.pow(xzMult, dt * 60);
      this.vel.z *= Math.pow(xzMult, dt * 60);
      if (zone.fill === 'water') this.vel.y *= Math.pow(0.90, dt * 60);
      if (eff.healthDrainSec !== 0) {
        this.health = Math.max(0, this.health + eff.healthDrainSec * dt);
      }
      if (eff.statMods) {
        const buff: BuffInput = {
          sourceId: zone.id, sourceType: 'zone',
          mods: eff.statMods, durationMs: null,
        };
        this._buffMgr.apply('spawn_ball', buff);
      }
    }
  }

  // ── T-key trigger ───────────────────────────────────────────────────────────

  private _applyTrigger(dt: number): void {

    // Find nearest trap
    let nearestTrap: TrapData | null = null; let nearestTrapDist2 = Infinity;
    for (const trap of this.getTraps().values()) {
      let cx: number, cz: number;
      if (trap.parentType === 'base') { cx = trap.basePosX; cz = trap.basePosZ; }
      else {
        const arena = this.getArenas().get(trap.parentId); if (!arena) continue;
        const { lx, lz } = polarToLocalXZ(trap.posR, trap.posAngle);
        const cos = Math.cos(arena.rotY * DEG2RAD); const sin = Math.sin(arena.rotY * DEG2RAD);
        cx = arena.posX + lx * cos - lz * sin; cz = arena.posZ + lx * sin + lz * cos;
      }
      const d2 = (this.pos.x - cx) ** 2 + (this.pos.z - cz) ** 2;
      if (d2 < nearestTrapDist2) { nearestTrapDist2 = d2; nearestTrap = trap; }
    }

    // Find nearest speed line (skip disabled ribbons)
    let nearestSl: SpeedLineData | null = null; let nearestSlDist2 = Infinity;
    for (const sl of this.getSpeedLines().values()) {
      if (sl.enabled === false) continue;
      const pts = this._getSlWorldPath(sl); if (pts.length < 2) continue;
      for (const p of pts) {
        const d2 = (this.pos.x - p.x) ** 2 + (this.pos.z - p.z) ** 2;
        if (d2 < nearestSlDist2) { nearestSlDist2 = d2; nearestSl = sl; }
      }
    }

    const useTrap = nearestTrap && (!nearestSl || nearestTrapDist2 <= nearestSlDist2);

    if (useTrap && nearestTrap) {
      this._applyTrapEffect(nearestTrap, 1 / 20);
    } else if (nearestSl) {
      const pts = this._getSlWorldPath(nearestSl); if (pts.length < 2) return;
      let minD2 = Infinity, closestI = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const d2 = (this.pos.x - pts[i].x) ** 2 + (this.pos.z - pts[i].z) ** 2;
        if (d2 < minD2) { minD2 = d2; closestI = i; }
      }
      const abx = pts[closestI + 1].x - pts[closestI].x;
      const abz = pts[closestI + 1].z - pts[closestI].z;
      const len = Math.sqrt(abx * abx + abz * abz) || 1;
      const force = SL_BASE_FORCE * nearestSl.speedMultiplier;
      this.vel.x += (abx / len) * force;
      this.vel.z += (abz / len) * force;
    }

    void dt; // suppress unused warning — dt available for future use
  }

  // ── Misc tick steps ─────────────────────────────────────────────────────────

  private _checkRespawn(): void {
    if (this.pos.y < RESPAWN_Y) {
      this.pos.copy(this.spawnPos); this.vel.copy(this.spawnVel);
      this.health = HEALTH_MAX; this.grounded = false;
      this.slOnRibbon.clear();
    }
  }

  /**
   * Spin decay and the heavy top (ledger primitives #3 and #4).
   *
   * `rpm` has been a cosmetic number since the project began: set from a HUD
   * field, never decayed, consumed only to advance a render rotation. So
   * stamina was not a stat, every tip was interchangeable, and a bey could
   * never lose by running down — `health` is clamped and never compared to
   * zero anywhere, so nothing could end a match at all.
   *
   * Now the tip supplies μ and a contact radius, the surface underfoot scales
   * the friction, a bearing tip decouples most of it, and `α = μmgr/I` drains
   * the spin. Once ω falls under the sleeping-top threshold the tilt grows and
   * the bey slumps. The whole chain lives in `sim/step/spin.ts`; this is the
   * translation layer.
   *
   * AIRBORNE BEYS DO NOT DECAY: the torque comes from the tip pressing on a
   * surface, and in the air there is no contact and no normal force. Skipping
   * the step is not an optimisation, it is the model.
   */
  private _stepSpin(dt: number): void {
    if (!this.grounded) return;

    const tip = BEY_TIP_PROFILES[this._spec.tipType] ?? BEY_TIP_PROFILES.hard_flat;
    const mu  = effectiveTipFriction(tip, this._currentSurfaceMu);
    const decel = spinDecayRate(this._spec.mass, this._spec.inertiaSpin, mu, tip.contactRadius);

    const r = stepSpin(
      this._spec,
      { omega: rpmToOmega(this.rpm), tiltRad: this.tiltDeg * DEG2RAD },
      decel,
      dt,
    );

    this.rpm      = omegaToRpm(r.omega);
    this.tiltDeg  = r.tiltRad * (180 / Math.PI);
    this._sleptOut = r.sleptOut;
  }

  /**
   * The bey's own movement, blended with the blader's.
   *
   * A pattern is EMITTED from the tip and the arena perturbs it — that is
   * the real relationship, and the reason the 24 shape samplers belong to
   * the bey rather than to the dish. `controlAuthority` decides how much the
   * player overrides it: 1 is Tyson commanding Dragoon, 0 is the parts
   * deciding and the blader watching.
   */
  private _applyPattern(dt: number): void {
    if (!this.grounded) return;
    const profile = TIP_MOVEMENT[this._spec.tipType] ?? TIP_MOVEMENT.hard_flat;

    let arenaCx = 0, arenaCz = 0, ridge = 50, outer = 80;
    for (const [, a] of this.getArenas()) {
      arenaCx = a.posX; arenaCz = a.posZ;
      outer = Math.max(a.radiusX, a.radiusZ);
      ridge = outer * 0.735;          // CS10 Case 545's ridge fraction
      break;
    }

    this._pattern = advancePattern(
      { ...toPatternState(this.pos.x, this.pos.z, arenaCx, arenaCz), phase: this._pattern.phase },
      profile, dt,
    );
    const beyIntent = patternDirection(this._pattern, profile, {
      ridgeRadius: ridge, outerRadius: outer,
    });

    const want = blendSteering(
      beyIntent,
      { x: 0, y: 0, z: 0 },                 // player input arrives via _applyInput
      beyIntent,                            // no rail engaged: rail == own intent
      this._spec.controlAuthority,
      0,
    );

    const force = this._spec.moveForce * profile.aggression * dt;
    this.vel.x += want.x * force;
    this.vel.z += want.z * force;
  }

  /* ── The two-stage launch (CS14 / plan Sec.N3) ──────────────────────── */

  /** Hold the launch button. Call every tick while held. */
  chargeLaunch(dt: number, held: boolean): LaunchState {
    this._launch = stepCharge(this._launch, LAUNCHERS.ripcord, held, dt);
    return this._launch;
  }

  /** Release: spin and entry speed come from how the charge was played. */
  releaseLaunch(bladerSkill = 1): number {
    const omega = launchOmega(this._launch, LAUNCHERS.ripcord, bladerSkill);
    this.rpm = omegaToRpm(omega);
    this._launch = IDLE_LAUNCH;
    return omega;
  }

  /** Begin a ballistic arc — a jump link, a dive, an air-launch. */
  beginFlight(dirXZ: { x: number; y: number; z: number }, cfg: FlightConfig): void {
    const v = launchVelocity(dirXZ, cfg);
    this.vel.set(v.x, v.y, v.z);
    this.grounded = false;
    this._flight = cfg;
  }

  /** Advance an arc. Returns false once the bey is back under normal gravity. */
  private _stepFlight(dt: number): boolean {
    if (!this._flight) return false;
    stepFlight(this.pos, this.vel, this._flight, -980, dt);
    if (this.grounded) { this._flight = null; return false; }
    return true;
  }

  private _applySelfRotation(dt: number): void {
    if (!this.topGroup) return;
    if (this.selfRotate && this.rpm > 0) this.topGroup.rotation.y += (this.rpm / 60) * Math.PI * 2 * dt;
    this.topGroup.rotation.z = this.tiltDeg * DEG2RAD;
  }

  private _updateCamera(): void {
    if (!this.followCam) return;
    const controls = this.getControls();
    if (controls) controls.target.lerp(this.pos, CAM_LERP);
  }

  // ── HUD ─────────────────────────────────────────────────────────────────────

  private _buildHUD(): void {
    this.hudEl.innerHTML = `
<div class="tb-title">SPAWN MANAGER</div>
<div class="tb-row">
  <span class="tb-label">HP</span>
  <div class="tb-hp-track"><div class="tb-hp-fill" id="tb-hp-fill"></div></div>
  <span class="tb-val" id="tb-hp-val">100</span>
</div>
<div class="tb-row">
  <span class="tb-label">Vx</span><span class="tb-mono" id="tb-vx">0.0</span>
  <span class="tb-label">Vy</span><span class="tb-mono" id="tb-vy">0.0</span>
  <span class="tb-label">Vz</span><span class="tb-mono" id="tb-vz">0.0</span>
  <span class="tb-label">|V|</span><span class="tb-mono" id="tb-vt">0.0</span>
</div>
<div class="tb-row">
  <span class="tb-label">Status</span><span class="tb-val" id="tb-status">AIRBORNE</span>
</div>
<div class="tb-divider"></div>
<div class="tb-section-label">SPAWN POSITION (cm)</div>
<div class="tb-row">
  <span class="tb-label">X</span><input class="tb-input" type="number" id="tb-sx" step="5">
  <span class="tb-label">Y</span><input class="tb-input" type="number" id="tb-sy" step="5">
  <span class="tb-label">Z</span><input class="tb-input" type="number" id="tb-sz" step="5">
</div>
<div class="tb-section-label">INITIAL FORCE (cm/s)</div>
<div class="tb-row">
  <span class="tb-label">Fx</span><input class="tb-input" type="number" id="tb-fx" step="10">
  <span class="tb-label">Fy</span><input class="tb-input" type="number" id="tb-fy" step="10">
  <span class="tb-label">Fz</span><input class="tb-input" type="number" id="tb-fz" step="10">
</div>
<div class="tb-row">
  <span class="tb-label">Tilt °</span><input class="tb-input" type="number" id="tb-tilt" min="-90" max="90" step="5">
  <span class="tb-label">RPM</span><input class="tb-input" type="number" id="tb-rpm" min="0" max="15000" step="100">
</div>
<div class="tb-divider"></div>
<label class="tb-check"><input type="checkbox" id="tb-follow"> Follow Cam</label>
<label class="tb-check"><input type="checkbox" id="tb-selfrot"> Self-Rotate</label>
<label class="tb-check"><input type="checkbox" id="tb-automove"> Auto-Move</label>
<div class="tb-row tb-hint"><span>WASD=move  Space=jump  T=trigger nearest trap/SL</span></div>
`;
    this.hudEl.style.display = 'none';

    const q = (id: string) => this.hudEl.querySelector(`#${id}`) as HTMLElement;
    const inp = (id: string) => this.hudEl.querySelector(`#${id}`) as HTMLInputElement;

    const onNumChange = () => {
      this.spawnPos.set(+inp('tb-sx').value, +inp('tb-sy').value, +inp('tb-sz').value);
      this.spawnVel.set(+inp('tb-fx').value, +inp('tb-fy').value, +inp('tb-fz').value);
      this.tiltDeg = +inp('tb-tilt').value;
      this.rpm     = +inp('tb-rpm').value;
      this._saveSettings();
    };
    ['tb-sx','tb-sy','tb-sz','tb-fx','tb-fy','tb-fz','tb-tilt','tb-rpm'].forEach(id => {
      inp(id).addEventListener('change', onNumChange);
    });

    (q('tb-follow') as HTMLInputElement).addEventListener('change', e => {
      this.followCam = (e.target as HTMLInputElement).checked; this._saveSettings();
    });
    (q('tb-selfrot') as HTMLInputElement).addEventListener('change', e => {
      this.selfRotate = (e.target as HTMLInputElement).checked; this._saveSettings();
    });
    (q('tb-automove') as HTMLInputElement).addEventListener('change', e => {
      this.autoMove = (e.target as HTMLInputElement).checked; this._saveSettings();
    });
  }

  private _updateHUD(): void {
    const q = (id: string) => this.hudEl.querySelector(`#${id}`) as HTMLElement;
    const fill = q('tb-hp-fill') as HTMLElement;
    const pct = Math.max(0, Math.min(100, this.health));
    fill.style.width = `${pct}%`;
    fill.style.background = pct > 50 ? '#00e5ff' : pct > 25 ? '#ff9900' : '#ff3333';
    (q('tb-hp-val') as HTMLElement).textContent = pct.toFixed(0);
    (q('tb-vx') as HTMLElement).textContent = this.vel.x.toFixed(1);
    (q('tb-vy') as HTMLElement).textContent = this.vel.y.toFixed(1);
    (q('tb-vz') as HTMLElement).textContent = this.vel.z.toFixed(1);
    (q('tb-vt') as HTMLElement).textContent = Math.sqrt(this.vel.x**2+this.vel.y**2+this.vel.z**2).toFixed(1);
    (q('tb-status') as HTMLElement).textContent = this.grounded ? 'GROUNDED' : 'AIRBORNE';
  }

  private _loadSettings(): void {
    const s = spawnSettingsStore.getState().load();
    if (s) {
      if (typeof s.spawnX === 'number') this.spawnPos.x = s.spawnX;
      if (typeof s.spawnY === 'number') this.spawnPos.y = s.spawnY;
      if (typeof s.spawnZ === 'number') this.spawnPos.z = s.spawnZ;
      if (typeof s.velX   === 'number') this.spawnVel.x = s.velX;
      if (typeof s.velY   === 'number') this.spawnVel.y = s.velY;
      if (typeof s.velZ   === 'number') this.spawnVel.z = s.velZ;
      if (typeof s.tiltDeg === 'number') this.tiltDeg = s.tiltDeg;
      if (typeof s.rpm     === 'number') this.rpm = s.rpm;
      if (typeof s.followCam  === 'boolean') this.followCam  = s.followCam;
      if (typeof s.selfRotate === 'boolean') this.selfRotate = s.selfRotate;
      if (typeof s.autoMove   === 'boolean') this.autoMove   = s.autoMove;
    }
    this._populateInputs();
  }

  private _populateInputs(): void {
    const inp = (id: string) => this.hudEl.querySelector(`#${id}`) as HTMLInputElement | null;
    const set = (id: string, v: number | boolean | string) => {
      const el = inp(id); if (!el) return;
      if (typeof v === 'boolean') el.checked = v; else el.value = String(v);
    };
    set('tb-sx', this.spawnPos.x); set('tb-sy', this.spawnPos.y); set('tb-sz', this.spawnPos.z);
    set('tb-fx', this.spawnVel.x); set('tb-fy', this.spawnVel.y); set('tb-fz', this.spawnVel.z);
    set('tb-tilt', this.tiltDeg); set('tb-rpm', this.rpm);
    set('tb-follow', this.followCam); set('tb-selfrot', this.selfRotate); set('tb-automove', this.autoMove);
  }

  private _saveSettings(): void {
    spawnSettingsStore.getState().save({
      spawnX: this.spawnPos.x, spawnY: this.spawnPos.y, spawnZ: this.spawnPos.z,
      velX: this.spawnVel.x,   velY:   this.spawnVel.y, velZ:   this.spawnVel.z,
      tiltDeg: this.tiltDeg, rpm: this.rpm,
      followCam: this.followCam, selfRotate: this.selfRotate, autoMove: this.autoMove,
    });
  }

  // ── Public extension API (used by test mode + SpecialMoveManager) ─────────

  /**
   * The player's bey as a contact body, ALIASING the live vectors.
   *
   * `pos` and `vel` are the manager's own `Vector3`s, not copies: a
   * `Vector3` structurally satisfies `Vec3`, so the pure resolver writes
   * straight through and there is no copy-back step to forget. Returning
   * clones here would make bey-vs-bey contact silently do nothing.
   */
  asColliderBody(): BeyBody {
    return {
      id: this._spec.id,
      pos: this.pos,
      vel: this.vel,
      radius: this._spec.radius,
      mass: this._spec.mass,
      contactLow: this._spec.tipOffset,
      contactHigh: this._spec.tipOffset + this._spec.height,
      restitution: this._spec.restitution,
    };
  }

  getPosition(): THREE.Vector3 { return this.pos.clone(); }
  getVelocity(): THREE.Vector3 { return this.vel.clone(); }
  setVelocity(v: THREE.Vector3): void { this.vel.copy(v); this.grounded = false; }
  setGravityScale(s: number): void { this._currentGravityScale = s; }
  getTipPolarity(): 'north' | 'south' | 'none' { return this._tipPolarity; }
  setTipPolarity(p: 'north' | 'south' | 'none'): void { this._tipPolarity = p; }
  getSpinDir(): 'right' | 'left' { return this._spinDir; }

  // ── Demo / test hooks ───────────────────────────────────────────────────────
  // Needed because spawn() reads spawnPos/spawnVel, which were only settable
  // through the HUD input fields. Driving those by UI would make every demo
  // slow and flaky; the demo runner sets the state directly instead.

  // NOTE: `isSpawned` already exists as a getter further up — do not re-add it here.
  getHealth(): number { return this.health; }
  /** Take damage from an outside source — a bullet, a clash, a special. */
  applyImpactDamage(amount: number): void {
    this.health = Math.max(0, Math.min(HEALTH_MAX, this.health - amount));
  }
  /** Obstacle-side contacts since spawn. See `_obstacleContacts`. */
  getObstacleContacts(): number { return this._obstacleContacts; }
  /** Side-wall retentions since spawn. See `_channelContacts`. */
  getChannelContacts(): number { return this._channelContacts; }
  /** True once the bey has slumped past the sleep-out tilt or run out of spin. */
  isSleptOut(): boolean { return this._sleptOut; }
  /** The spin below which this bey can no longer stand up, rad/s. */
  getSleepOutOmega(): number {
    return sleepOutOmega(this._spec.mass, this._spec.inertiaSpin, this._spec.comY);
  }
  isGrounded(): boolean { return this.grounded; }
  getRpm(): number { return this.rpm; }

  /** Set the state that the NEXT spawn() will use. */
  setSpawnState(s: {
    pos?: THREE.Vector3; vel?: THREE.Vector3; rpm?: number; tiltDeg?: number;
  }): void {
    if (s.pos) this.spawnPos.copy(s.pos);
    if (s.vel) this.spawnVel.copy(s.vel);
    if (s.rpm !== undefined) this.rpm = s.rpm;
    if (s.tiltDeg !== undefined) this.tiltDeg = s.tiltDeg;
  }

  /** Teleport a live top (does not touch the stored spawn state). */
  setPosition(p: THREE.Vector3): void {
    this.pos.copy(p);
    this.topGroup?.position.copy(p);
    this.grounded = false;
  }

  setOptions(o: { followCam?: boolean; selfRotate?: boolean; autoMove?: boolean }): void {
    if (o.followCam !== undefined) this.followCam = o.followCam;
    if (o.selfRotate !== undefined) this.selfRotate = o.selfRotate;
    if (o.autoMove !== undefined) this.autoMove = o.autoMove;
  }
}

// Suppress unused variable — BALL_HEIGHT exported only for external reference
void BALL_HEIGHT;
void COLL_STICKY_MARGIN;

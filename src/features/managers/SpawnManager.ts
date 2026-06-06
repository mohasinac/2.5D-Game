import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { SceneContext } from '../IArenaFeature';
import type {
  ArenaData, TrapData, SpeedLineData, SpeedLineSegment, SpeedLineEntryCondition,
  ZoneData, WallData,
} from '../../types/arenaTypes';
import {
  arenaSurfaceYAtArenaLocal, worldToArenaLocal,
  polarToLocalXZ, makeSurfFn,
} from '../../geometry/surfaceUtils';
import { computeSegmentPath } from '../../geometry/speedLineBuilders';
import { DEG2RAD, DEFAULT_BASE_HEIGHT } from '../../config/arenaConstants';

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
const GRAVITY              = -980;   // cm/s²
const MOVE_FORCE           = 800;    // cm/s² (grounded)
const AIR_CONTROL          = 0.25;   // fraction when airborne
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

  // Speed line tracking
  private slPathCache   = new Map<string, { pts: THREE.Vector3[]; ts: number }>();
  private slOnRibbon    = new Map<string, boolean>();
  private slExitTangent = new THREE.Vector3();

  // Input
  private keys = new Set<string>();
  private _onKeyDown: ((e: KeyboardEvent) => void) | null = null;
  private _onKeyUp:   ((e: KeyboardEvent) => void) | null = null;

  private static readonly SETTINGS_KEY = 'bey_spawn_manager_settings';

  constructor(
    private readonly ctx:           SceneContext,
    private readonly getCamera:     () => THREE.PerspectiveCamera | null,
    private readonly getControls:   () => OrbitControls | null,
    private readonly getArenas:     () => ReadonlyMap<string, ArenaData>,
    private readonly getTraps:      () => ReadonlyMap<string, TrapData>,
    private readonly getSpeedLines: () => ReadonlyMap<string, SpeedLineData>,
    private readonly getZones:      () => ReadonlyMap<string, ZoneData>,
    private readonly getWalls:      () => ReadonlyMap<string, WallData>,
    private readonly hudEl:         HTMLElement,
  ) {
    this._buildHUD();
    this._loadSettings();
  }

  get isSpawned(): boolean { return this.spawned; }

  // ── Public API ──────────────────────────────────────────────────────────────

  spawn(): void {
    if (this.spawned) return;
    this.spawned  = true;
    this.health   = HEALTH_MAX;
    this.pos.copy(this.spawnPos);
    this.vel.copy(this.spawnVel);
    this.grounded = false;
    this.slPathCache.clear();
    this.slOnRibbon.clear();

    this.topGroup = this._buildTopGroup();
    this.ctx.scene.add(this.topGroup);
    this.topGroup.position.copy(this.pos);

    this._onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') return;
      this.keys.add(e.code);
    };
    this._onKeyUp = (e: KeyboardEvent) => { this.keys.delete(e.code); };
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);

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

    if (this._onKeyDown) { document.removeEventListener('keydown', this._onKeyDown); this._onKeyDown = null; }
    if (this._onKeyUp)   { document.removeEventListener('keyup',   this._onKeyUp);   this._onKeyUp   = null; }
    this.keys.clear();
    this.slPathCache.clear();
    this.slOnRibbon.clear();

    this.hudEl.style.display = 'none';
  }

  dispose(): void {
    this.despawn();
  }

  // ── Tick ────────────────────────────────────────────────────────────────────

  tick(dtMs: number): void {
    if (!this.spawned || !this.topGroup) return;
    const dt = Math.min(dtMs / 1000, 0.05);

    this._applyAutoMove(dt);
    this._applyInput(dt);
    this._applyGravity(dt);
    this._integrate(dt);
    this._resolveSurface();
    this._resolveWalls();
    this._applySpeedLines(dt);
    this._applyTraps(dt);
    this._applyZones(dt);
    this._applyTrigger(dt);
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
    const cam = this.getCamera();
    if (!cam) return;
    const fwd = cam.getWorldDirection(new THREE.Vector3()); fwd.y = 0; fwd.normalize();
    const right = new THREE.Vector3().crossVectors(fwd, THREE.Object3D.DEFAULT_UP).normalize();

    const dir = new THREE.Vector3();
    if (this.keys.has('KeyW')     || this.keys.has('ArrowUp'))    dir.addScaledVector(fwd,    1);
    if (this.keys.has('KeyS')     || this.keys.has('ArrowDown'))  dir.addScaledVector(fwd,   -1);
    if (this.keys.has('KeyA')     || this.keys.has('ArrowLeft'))  dir.addScaledVector(right, -1);
    if (this.keys.has('KeyD')     || this.keys.has('ArrowRight')) dir.addScaledVector(right,  1);

    if (dir.lengthSq() > 0) {
      dir.normalize();
      const accel = MOVE_FORCE * (this.grounded ? 1 : AIR_CONTROL) * dt;
      this.vel.x += dir.x * accel;
      this.vel.z += dir.z * accel;
    }

    if (this.keys.has('Space') && this.grounded) {
      this.vel.y = JUMP_IMPULSE;
      this.grounded = false;
    }

    const hspd = Math.sqrt(this.vel.x ** 2 + this.vel.z ** 2);
    if (hspd > MAX_SPEED_H) { const s = MAX_SPEED_H / hspd; this.vel.x *= s; this.vel.z *= s; }
  }

  private _applyGravity(dt: number): void {
    if (!this.grounded) this.vel.y += GRAVITY * this._currentGravityScale * dt;
  }

  private _integrate(dt: number): void {
    this.pos.addScaledVector(this.vel, dt);
    const f = Math.pow(this.grounded ? FRICTION_GROUND : FRICTION_AIR, dt * 60);
    this.vel.x *= f; this.vel.z *= f;
  }

  private _resolveSurface(): void {
    this.grounded = false;
    let bestSurfY = -Infinity;
    let bestMat: string | undefined;

    for (const arena of this.getArenas().values()) {
      const { alx, alz } = worldToArenaLocal(this.pos.x, this.pos.z, arena);
      if ((alx / arena.radiusX) ** 2 + (alz / arena.radiusZ) ** 2 > 1.0) continue;
      const surfY = arenaSurfaceYAtArenaLocal(arena, alx, alz);
      if (surfY > bestSurfY) {
        bestSurfY = surfY;
        bestMat = arena.baseMaterial;
        this._currentGravityScale = arena.gravityScale ?? 1.0;
      }
    }

    // Octagon base fallback — top face is at DEFAULT_BASE_HEIGHT (30 cm)
    if (bestSurfY === -Infinity &&
        Math.abs(this.pos.x) <= BASE_APOTHEM &&
        Math.abs(this.pos.z) <= BASE_APOTHEM) {
      bestSurfY = DEFAULT_BASE_HEIGHT;
    }

    if (bestSurfY === -Infinity) return;

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

      const rimY = DEFAULT_BASE_HEIGHT + arena.posY;
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

      this._lastCollisionTime     = performance.now();
      this._lastCollisionIsSticky = false;
    }
  }

  // ── Speed lines ─────────────────────────────────────────────────────────────

  private _getSlWorldPath(sl: SpeedLineData): THREE.Vector3[] {
    const now = performance.now();
    const cached = this.slPathCache.get(sl.id);
    if (cached && now - cached.ts < SL_CACHE_TTL) return cached.pts;

    const arena = this.getArenas().get(sl.parentArenaId);
    if (!arena) { this.slPathCache.set(sl.id, { pts: [], ts: now }); return []; }

    const zones = this.getZones() as Map<string, ZoneData>;
    const surfFn = makeSurfFn({ parentZoneId: sl.parentZoneId }, arena, zones);
    const localPts = computeSegmentPath(sl, arena, surfFn);

    const cosA = Math.cos(arena.rotY * DEG2RAD);
    const sinA = Math.sin(arena.rotY * DEG2RAD);
    const worldPts = localPts.map(p => new THREE.Vector3(
      arena.posX + p.x * cosA - p.z * sinA,
      p.y,
      arena.posZ + p.x * sinA + p.z * cosA,
    ));

    this.slPathCache.set(sl.id, { pts: worldPts, ts: now });
    return worldPts;
  }

  private _slIsActive(sl: SpeedLineData, startPt: THREE.Vector3): boolean {
    switch (sl.activationMode) {
      case 'always': return true;
      case 'proximity': {
        const dx = this.pos.x - startPt.x; const dz = this.pos.z - startPt.z;
        return dx * dx + dz * dz < sl.activationRadius * sl.activationRadius;
      }
      case 'periodic': {
        const phase = ((performance.now() / 1000) % sl.period) / sl.period;
        return phase < sl.activeDuty;
      }
      default: return true;
    }
  }

  private _slMeetsEntry(cond: SpeedLineEntryCondition): boolean {
    const vh = Math.sqrt(this.vel.x ** 2 + this.vel.z ** 2);
    switch (cond) {
      case 'always':      return true;
      case 'moving_only': return vh > 5;
      case 'fast_only':   return vh > 100;
      case 'slow_only':   return vh < 50;
      default:            return true;
    }
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
      const sinceCollision = performance.now() - this._lastCollisionTime;
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

      if (!this._slIsActive(sl, pts[0])) { this.slOnRibbon.set(slId, false); continue; }

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
      if (!this._slMeetsEntry(effectiveCond)) { this.slOnRibbon.set(slId, false); continue; }

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
      this.slOnRibbon.set(slId, true);
    }
  }

  private _handleSlExit(sl: SpeedLineData): void {
    if (sl.exitBehavior === 'launch') {
      const lspeed = sl.launchForce * SL_LAUNCH_SCALE;
      this.vel.x += this.slExitTangent.x * lspeed;
      this.vel.z += this.slExitTangent.z * lspeed;
      this.vel.y = Math.max(this.vel.y, lspeed * 0.4);
      this.grounded = false;
    }
  }

  // ── Traps ───────────────────────────────────────────────────────────────────

  private _applyTraps(dt: number): void {
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

      this._applyTrapEffect(trap, dt);
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
        const dx = this.pos.x - tcx; const dz = this.pos.z - tcz;
        const dist = Math.sqrt(dx * dx + dz * dz) || 1;
        const f = (trap.gravityStrength ?? 200) * dt;
        this.vel.x -= (dx / dist) * f; this.vel.z -= (dz / dist) * f;
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

      switch (zone.fill) {
        case 'ice':
          this.vel.x *= Math.pow(0.998, dt * 60);
          this.vel.z *= Math.pow(0.998, dt * 60);
          break;
        case 'lava':
          this.health = Math.max(0, this.health - 15 * dt); break;
        case 'water':
          this.vel.x *= Math.pow(0.85, dt * 60);
          this.vel.z *= Math.pow(0.85, dt * 60);
          this.vel.y *= Math.pow(0.90, dt * 60);
          break;
        case 'sand':
          this.vel.x *= Math.pow(0.92, dt * 60);
          this.vel.z *= Math.pow(0.92, dt * 60);
          break;
        case 'poison':
        case 'swamp':
          this.health = Math.max(0, this.health - 5 * dt);
          this.vel.x *= Math.pow(0.93, dt * 60);
          this.vel.z *= Math.pow(0.93, dt * 60);
          break;
        case 'void':
          this.health = Math.max(0, this.health - 30 * dt); break;
      }
    }
  }

  // ── T-key trigger ───────────────────────────────────────────────────────────

  private _applyTrigger(dt: number): void {
    if (!this.keys.has('KeyT')) return;

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
    const raw = localStorage.getItem(SpawnManager.SETTINGS_KEY);
    if (!raw) { this._populateInputs(); return; }
    try {
      const s = JSON.parse(raw);
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
    } catch { /* ignore bad json */ }
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
    localStorage.setItem(SpawnManager.SETTINGS_KEY, JSON.stringify({
      spawnX: this.spawnPos.x, spawnY: this.spawnPos.y, spawnZ: this.spawnPos.z,
      velX: this.spawnVel.x,   velY:   this.spawnVel.y, velZ:   this.spawnVel.z,
      tiltDeg: this.tiltDeg, rpm: this.rpm,
      followCam: this.followCam, selfRotate: this.selfRotate, autoMove: this.autoMove,
    }));
  }
}

// Suppress unused variable — BALL_HEIGHT exported only for external reference
void BALL_HEIGHT;
void COLL_STICKY_MARGIN;

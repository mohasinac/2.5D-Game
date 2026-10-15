import * as THREE from 'three';
import { applyRenderPolicy } from '../../render/shadowPolicy';
import type { SpeedLineData, BulletLaunchRequest, ProjectileBullet } from '../../types/arenaTypes';
import { buildProjectileMesh } from '../../geometry/trapBuilders';
import type { ITickableManager } from '../IArenaFeature';
import type { Rng } from '../../sim/Rng';
import { projectileHit } from '../../sim/step/projectile';
import type { Projectile, ProjectileTarget, ProjectileHit } from '../../sim/step/projectile';

const DEG2RAD = Math.PI / 180;

/**
 * Generic bullet manager — fully decoupled from TrapData.
 *
 * Any system (trap, beyblade, zone, arena) can fire bullets by calling
 * `launch(req: BulletLaunchRequest)`. The manager owns all runtime bullet
 * state; callers only provide a `BulletLaunchRequest` at fire time.
 *
 * Bullets carry a snapshot of `ProjectileConfig` at spawn time so the manager
 * never needs to look up the source object again.
 */
export class ProjectileManager implements ITickableManager {

  private readonly bullets = new Map<string, ProjectileBullet>();
  private bulletSeq = 0;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly getSpeedLines: () => ReadonlyMap<string, SpeedLineData>,
    /** Seeded PRNG — bullet jitter feeds back into physics, so it must be replayable. */
    private readonly rng: Rng,
    /**
     * Everything a bullet can hit. Injected rather than imported so the
     * manager stays decoupled from whoever owns the roster.
     *
     * Until this existed the ONLY distance test in this class was a
     * self-check for boomerang return — bullets passed through the bey, the
     * walls and each other, which is why all 53 projectile-based corpus
     * moves were unimplementable.
     */
    private readonly getTargets: () => readonly ProjectileTarget[] = () => [],
    /** Called when a bullet connects, so damage and juice can run upstream. */
    private readonly onHit: (hit: ProjectileHit) => void = () => {},
  ) {}

  // ── Public API ───────────────────────────────────────────────────────────

  launch(req: BulletLaunchRequest): void {
    for (const pos of this._computeLaunchPositions(req)) {
      this._spawnBullet(req, pos);
    }
  }

  expireAll(): void {
    for (const bullet of this.bullets.values()) this._removeBullet(bullet);
    this.bullets.clear();
  }

  // ── ITickableManager ─────────────────────────────────────────────────────

  tick(dt: number): void {
    const toRemove: string[] = [];
    for (const bullet of this.bullets.values()) {
      bullet.age += dt * 1000;
      const cfg = bullet.config;

      if (bullet.age >= cfg.lifetimeMs) {
        toRemove.push(bullet.id);
        continue;
      }

      if (cfg.orbitSource) {
        // Orbit: circle around the spawn center
        bullet.orbitAngle += cfg.orbitSpeed * DEG2RAD * dt;
        bullet.pos.set(
          bullet.orbitCenterX + cfg.orbitRadius * Math.cos(bullet.orbitAngle),
          bullet.orbitBaseY   + cfg.orbitElevation,
          bullet.orbitCenterZ + cfg.orbitRadius * Math.sin(bullet.orbitAngle),
        );
      } else {
        // Boomerang reversal
        if (cfg.returnToTrap && !bullet.returning && bullet.age >= cfg.returnAfterMs) {
          bullet.returning = true;
          bullet.vel.negate();
        }

        // Advance position
        bullet.pos.addScaledVector(bullet.vel, dt);

        // Boomerang: remove once back near start
        if (bullet.returning && bullet.pos.distanceTo(bullet.startPos) < 2) {
          toRemove.push(bullet.id);
          continue;
        }
      }

      /* COLLISION — the thing this manager never did. Height-banded for the
         same reason bey-vs-bey contact is: a low shot should pass UNDER a
         tall bey rather than clipping it because the two overlap in plan
         view. A bullet never hits its owner, and `onCollision` lifetime
         despawns on the first connection. */
      const targets = this.getTargets();
      if (targets.length > 0) {
        const p: Projectile = {
          id: bullet.id,
          ownerId: (bullet as { sourceId?: string }).sourceId ?? '',
          team: null,
          pos: bullet.pos,
          vel: bullet.vel,
          radius: Math.max(0.5, cfg.scaleFactor * 2),
          mass: Math.max(1, cfg.scaleFactor * 5),
          lifetime: { kind: 'onCollision' },
          ageMs: bullet.age,
          dead: false,
        };
        for (const t of targets) {
          const hit = projectileHit(p, t);
          if (hit) { this.onHit(hit); toRemove.push(bullet.id); break; }
        }
      }

      bullet.mesh.position.copy(bullet.pos);

      // In-flight spin
      bullet.mesh.rotation.x += cfg.spinX * DEG2RAD * dt;
      bullet.mesh.rotation.y += cfg.spinY * DEG2RAD * dt;
      bullet.mesh.rotation.z += cfg.spinZ * DEG2RAD * dt;
    }

    for (const id of toRemove) {
      const b = this.bullets.get(id);
      if (b) this._removeBullet(b);
      this.bullets.delete(id);
    }
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private _spawnBullet(req: BulletLaunchRequest, pos: THREE.Vector3): void {
    const cfg = req.config;
    const id  = `bullet-${++this.bulletSeq}`;

    // Resolve scale
    let scale = cfg.scaleFactor;
    if (cfg.scaleRandomize) {
      scale *= this.rng.range(cfg.scaleMin, cfg.scaleMax);
    }

    const mesh = buildProjectileMesh(cfg);
    mesh.scale.setScalar(scale);
    mesh.position.copy(pos);
    /* Bullets go through the same policy as everything else; their material
       decides the outcome rather than a special case here. */
    applyRenderPolicy(mesh);
    this.scene.add(mesh);

    const speed = Math.max(0.01, cfg.speed);
    const dirAngle = (req.dirAngle ?? 0) * DEG2RAD;
    const vel = new THREE.Vector3(
      -Math.sin(dirAngle),
      cfg.isAirborne ? cfg.arcHeight * 0.1 : 0,
      Math.cos(dirAngle),
    ).multiplyScalar(speed);

    // Orbit initial angle: align with the direction the bullet spawned at
    const orbitAngle = Math.atan2(pos.z - req.center.z, pos.x - req.center.x);

    const bullet: ProjectileBullet = {
      id,
      sourceId: req.sourceId,
      config: cfg,
      mesh,
      pos: pos.clone(),
      vel,
      startPos: pos.clone(),
      age: 0,
      returning: false,
      followSpeedLineIndex: 0,
      orbitAngle,
      orbitCenterX: req.center.x,
      orbitCenterZ: req.center.z,
      orbitBaseY:   req.center.y,
    };
    this.bullets.set(id, bullet);
  }

  private _computeLaunchPositions(req: BulletLaunchRequest): THREE.Vector3[] {
    const base  = req.center.clone();
    const count = Math.max(1, req.count);
    const spread = (req.spreadAngleDeg ?? 30) * DEG2RAD;
    const positions: THREE.Vector3[] = [];

    if (req.mode === 'spread') {
      for (let i = 0; i < count; i++) {
        const angle = count > 1 ? -spread / 2 + (spread / (count - 1)) * i : 0;
        positions.push(base.clone().add(
          new THREE.Vector3(-Math.sin(angle) * 5, 0, Math.cos(angle) * 5),
        ));
      }
    } else if (req.mode === 'pattern') {
      const n = Math.max(1, req.patternCount);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        positions.push(base.clone().add(
          new THREE.Vector3(Math.cos(a) * (req.config.orbitSource ? req.config.orbitRadius : 5), 0, Math.sin(a) * (req.config.orbitSource ? req.config.orbitRadius : 5)),
        ));
      }
    } else {
      // single, burst, continuous — one bullet per call at base position
      if (req.config.orbitSource) {
        // For orbit mode, space bullets evenly around the orbit circle
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          positions.push(base.clone().add(
            new THREE.Vector3(Math.cos(a) * req.config.orbitRadius, req.config.orbitElevation, Math.sin(a) * req.config.orbitRadius),
          ));
        }
      } else {
        positions.push(base.clone());
      }
    }
    return positions;
  }

  private _removeBullet(bullet: ProjectileBullet): void {
    this.scene.remove(bullet.mesh);
    bullet.mesh.geometry.dispose();
    (bullet.mesh.material as THREE.Material).dispose();
  }
}

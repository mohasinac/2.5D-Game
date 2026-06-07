import * as THREE from 'three';
import type { ITickableManager } from '../IArenaFeature';

export type TargetBehavior = 'follow' | 'orbit' | 'flee' | 'lock_on' | 'face';

export interface TargetBindingOpts {
  strength?:     number;   // 0–1, how aggressively to move toward target; default 0.5
  maxSpeedCms?:  number;   // cm/s maximum movement speed; default 50
  orbitRadius?:  number;   // cm, only for 'orbit' behavior; default 30
}

interface TargetBinding {
  id:           string;
  sourceId:     string;
  targetId:     string;
  behavior:     TargetBehavior;
  strength:     number;
  maxSpeedCms:  number;
  orbitRadius:  number;
  _orbitAngle:  number;  // runtime accumulator for orbit behavior
}

/**
 * Runtime target-tracking manager.
 *
 * Not a FeatureManager — has no scene-tree nodes, no serialization, and no
 * per-item Three.js geometry.  Bindings exist only at runtime and must be
 * re-established after a load if persistence is required.
 *
 * Behaviors
 * ─────────
 * 'follow'  — source moves toward target at maxSpeedCms.
 * 'orbit'   — source orbits target at orbitRadius.
 * 'flee'    — source moves away from target.
 * 'lock_on' — source snaps to target position instantly.
 * 'face'    — source rotates to face target (Y-axis only); no translation.
 *
 * Reuse
 * ─────
 * Fully sandbox-agnostic.  getPosition / setPosition are injected so any
 * host can back them with its own feature maps.
 */
export class TargetManager implements ITickableManager {
  private readonly bindings = new Map<string, TargetBinding>();
  private seq = 0;

  constructor(
    /** Resolve a nodeId to its current world position (null if unknown). */
    private readonly getPosition: (nodeId: string) => THREE.Vector3 | null,
    /** Apply a new world position to a nodeId. */
    private readonly setPosition: (nodeId: string, pos: THREE.Vector3) => void,
  ) {}

  // ── Public API ───────────────────────────────────────────────────────────

  /**
   * Create a binding between source and target.
   * @returns The binding id (use to unbind later).
   */
  bind(
    sourceId: string,
    targetId: string,
    behavior: TargetBehavior,
    opts?: TargetBindingOpts,
  ): string {
    const id = `tb-${++this.seq}`;
    this.bindings.set(id, {
      id,
      sourceId, targetId, behavior,
      strength:    opts?.strength    ?? 0.5,
      maxSpeedCms: opts?.maxSpeedCms ?? 50,
      orbitRadius: opts?.orbitRadius ?? 30,
      _orbitAngle: 0,
    });
    return id;
  }

  unbind(id: string): void            { this.bindings.delete(id); }
  unbindSource(sourceId: string): void {
    for (const [id, b] of this.bindings) {
      if (b.sourceId === sourceId) this.bindings.delete(id);
    }
  }
  clear(): void { this.bindings.clear(); }

  // ── ITickableManager ─────────────────────────────────────────────────────

  tick(dt: number): void {
    for (const b of this.bindings.values()) {
      const src = this.getPosition(b.sourceId);
      const tgt = this.getPosition(b.targetId);
      if (!src || !tgt) continue;
      this._applyBehavior(b, src, tgt, dt);
    }
  }

  // ── Private ──────────────────────────────────────────────────────────────

  private _applyBehavior(
    b:   TargetBinding,
    src: THREE.Vector3,
    tgt: THREE.Vector3,
    dt:  number,
  ): void {
    const next = src.clone();

    switch (b.behavior) {
      case 'follow': {
        const dir  = tgt.clone().sub(src);
        const dist = dir.length();
        if (dist > 0.01) {
          dir.normalize();
          const step = Math.min(b.maxSpeedCms * dt * b.strength, dist);
          next.addScaledVector(dir, step);
        }
        this.setPosition(b.sourceId, next);
        break;
      }
      case 'flee': {
        const dir  = src.clone().sub(tgt);
        const dist = dir.length();
        if (dist > 0.01) {
          dir.normalize();
          const step = b.maxSpeedCms * dt * b.strength;
          next.addScaledVector(dir, step);
        }
        this.setPosition(b.sourceId, next);
        break;
      }
      case 'orbit': {
        const speed  = (b.maxSpeedCms * dt) / Math.max(1, b.orbitRadius);  // rad/s
        b._orbitAngle += speed;
        next.set(
          tgt.x + b.orbitRadius * Math.cos(b._orbitAngle),
          src.y,
          tgt.z + b.orbitRadius * Math.sin(b._orbitAngle),
        );
        this.setPosition(b.sourceId, next);
        break;
      }
      case 'lock_on': {
        this.setPosition(b.sourceId, tgt.clone());
        break;
      }
      case 'face': {
        // Pure rotation — no position change.  Caller must handle rotation
        // via setPosition (position unchanged, face direction is implicit).
        break;
      }
    }
  }
}

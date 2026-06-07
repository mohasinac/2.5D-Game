/**
 * Per-entity tick behavior sub-objects for TrapManager.
 * Extracted from TrapManager to keep tick() a clean 4-line loop.
 *
 * Each TrapData gets at most one _tickBehavior, created in buildGeometry
 * and disposed in disposeOne. No behavior = null = no tick cost.
 */

import * as THREE from 'three';
import type { TrapData, TrapEffect } from '../../../types/arenaTypes';
import { updateEarthquakeMeshHeights } from '../../../geometry/trapBuilders';

const DEG2RAD = Math.PI / 180;

export interface TrapTickBehavior {
  tick(trap: TrapData, dt: number): void;   // dt in seconds
  dispose(): void;
}

// ── Earthquake ────────────────────────────────────────────────────────────

export class EarthquakeBehavior implements TrapTickBehavior {
  constructor(private readonly onActivate?: (trap: TrapData) => void) {}

  tick(trap: TrapData, dt: number): void {
    if (!trap._eqPhase) {
      if (trap.eqPulseMode === 'continuous') {
        this._startPulse(trap);
      } else if (trap.eqPulseMode === 'periodic') {
        trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
        if (trap._eqTimer >= trap.eqPulseIntervalMs) {
          trap._eqTimer = 0;
          this._startPulse(trap);
        }
      }
      return;
    }

    const phase   = trap._eqPhase;
    const widthMs = Math.max(100, trap.eqPulseWidthMs);

    if (phase === 'rising') {
      trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
      const t = Math.min(1, trap._eqTimer / (widthMs * 0.3));
      this._lerpHeights(trap, t);
      if (t >= 1) { trap._eqPhase = 'active'; trap._eqTimer = 0; }
    } else if (phase === 'active') {
      if (trap.eqPermanent) return;
      trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
      if (trap._eqTimer >= widthMs * 0.4) { trap._eqPhase = 'fading'; trap._eqTimer = 0; }
    } else if (phase === 'fading') {
      trap._eqTimer = (trap._eqTimer ?? 0) + dt * 1000;
      const t = Math.min(1, trap._eqTimer / (widthMs * 0.3));
      this._lerpHeights(trap, 1 - t);
      if (t >= 1) {
        trap._eqPhase    = undefined;
        trap._eqTimer    = 0;
        trap._eqCycleCount = (trap._eqCycleCount ?? 0) + 1;
        if (
          trap.eqPulseMode === 'continuous' &&
          (trap.eqFadeCycles === 0 || (trap._eqCycleCount ?? 0) < trap.eqFadeCycles)
        ) {
          this._startPulse(trap);
        }
      }
    }
    updateEarthquakeMeshHeights(trap);
  }

  dispose(): void { /* no owned resources */ }

  private _startPulse(trap: TrapData): void {
    const rings = Math.max(1, trap.eqRingCount);
    const segs  = Math.max(3, trap.eqSegmentsPerRing);
    const total = rings * segs;
    if (!trap._eqTargetHeights || trap._eqTargetHeights.length !== total) {
      trap._eqTargetHeights  = new Array(total).fill(0);
      trap._eqCurrentHeights = new Array(total).fill(0);
    }
    const maxH = trap.eqMaxElevationCm;
    for (let r = 0; r < rings; r++) {
      const ringMult = trap.eqRingRanges[r] ?? 1;
      for (let s = 0; s < segs; s++) {
        const idx = r * segs + s;
        let h = 0;
        switch (trap.eqElevationMode) {
          case 'wave':         h = maxH * ringMult * Math.sin((s / segs) * Math.PI * 2); break;
          case 'ripple':       h = maxH * ringMult * Math.sin((r / rings) * Math.PI * 4); break;
          case 'checkerboard': h = maxH * ringMult * ((r + s) % 2 === 0 ? 1 : -1); break;
          case 'random':
          default:             h = maxH * ringMult * (Math.random() * 2 - 1); break;
        }
        trap._eqTargetHeights[idx] = h;
      }
    }
    trap._eqPhase = 'rising';
    trap._eqTimer = 0;
    if (trap.envTriggerEvent) this.onActivate?.(trap);
  }

  private _lerpHeights(trap: TrapData, t: number): void {
    if (!trap._eqCurrentHeights || !trap._eqTargetHeights) return;
    for (let i = 0; i < trap._eqCurrentHeights.length; i++) {
      trap._eqCurrentHeights[i] = (trap._eqTargetHeights[i] ?? 0) * t;
    }
  }
}

// ── RPM disc rotation ─────────────────────────────────────────────────────

export class RPMBehavior implements TrapTickBehavior {
  constructor(private readonly onActivate?: (trap: TrapData) => void) {}

  tick(trap: TrapData, dt: number): void {
    if (!trap.variantMesh) return;
    const omega    = (trap.rpmSpeed ?? 0) * DEG2RAD;
    const prevAngle = trap._rpmCurrentAngle ?? 0;
    const wrapped   = prevAngle + omega * dt;
    trap._rpmCurrentAngle     = wrapped % (Math.PI * 2);
    trap.variantMesh.rotation.y = trap._rpmCurrentAngle;

    if (this.onActivate && trap.envTriggerEvent && omega !== 0) {
      if (Math.floor(wrapped / (Math.PI * 2)) !== Math.floor(prevAngle / (Math.PI * 2))) {
        this.onActivate(trap);
      }
    }
    const mat = trap.variantMesh.material as THREE.MeshStandardMaterial;
    if (mat && 'emissiveIntensity' in mat) {
      mat.emissiveIntensity = Math.min(1, Math.abs(trap.rpmSpeed ?? 0) / 360);
    }
  }

  dispose(): void { /* no owned resources */ }
}

// ── Projectile plate spin ─────────────────────────────────────────────────

export class ProjectilePlateBehavior implements TrapTickBehavior {
  tick(trap: TrapData, dt: number): void {
    const omega = trap.projPlateSpin * DEG2RAD;
    trap.mesh.rotation.y  += omega * dt;
    trap.edges.rotation.y  = trap.mesh.rotation.y;
  }

  dispose(): void { /* no owned resources */ }
}

// ── Factory ───────────────────────────────────────────────────────────────

export function createTrapTickBehavior(
  effect:     TrapEffect,
  onActivate?: (trap: TrapData) => void,
): TrapTickBehavior | null {
  switch (effect) {
    case 'earthquake': return new EarthquakeBehavior(onActivate);
    case 'rpm':        return new RPMBehavior(onActivate);
    case 'projectile': return new ProjectilePlateBehavior();
    default:           return null;
  }
}

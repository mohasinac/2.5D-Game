import * as THREE from 'three';
import type { TranslationData, TranslationWaypoint } from '../../types/arenaTypes';
import type { TranslationSave } from '../../utils/arenaPersistence';
import { TRANS } from '../../config/arenaConstants';
import { FeatureManager } from '../FeatureManager';
import type { SceneContext, ITickableManager } from '../IArenaFeature';

/**
 * Path-animation manager — moves member objects along a world-space waypoint
 * path over time.
 *
 * Design
 * ──────
 * Members are NOT reparented into a pivot group (unlike RotationManager).
 * Positions are applied directly via mesh.position.set() each tick, so the
 * mesh stays a scene child throughout its lifetime.  This means positions
 * survive applyX() rebuilds without needing an afterApply() correction step.
 *
 * Loop modes
 * ──────────
 * 'once'     — plays forward, then stops at the last waypoint.
 * 'loop'     — plays forward, snaps back to the first waypoint, repeats.
 * 'pingpong' — plays forward, then backward, then forward again.
 *
 * Easing functions
 * ────────────────
 * Applied to the raw normalised t before interpolation.
 * 'linear'    — no easing.
 * 'ease_in'   — slow start, fast finish (quadratic).
 * 'ease_out'  — fast start, slow finish (quadratic).
 * 'smooth'    — smoothstep (ease in + ease out).
 *
 * Reuse
 * ─────
 * TranslationManager has no arena-specific imports.  getMemberObjects
 * is injected so any host sandbox can wire it to its own feature maps.
 */
export class TranslationManager
  extends FeatureManager<TranslationData, TranslationSave>
  implements ITickableManager
{
  constructor(
    ctx: SceneContext,
    /** Resolves a nodeId to the THREE.Object3D[] that should be moved. */
    private readonly getMemberObjects: (nodeId: string) => THREE.Object3D[],
    /** Optional hook fired after positions are updated (e.g. floor correction). */
    private readonly onAfterMove?: (data: TranslationData) => void,
  ) {
    super(ctx, 'trans', 'Translation');
  }

  // ── Public factory ───────────────────────────────────────────────────────

  add(
    memberIds: string[],
    waypoints: TranslationWaypoint[],
    treeOpts?: Record<string, unknown>,
  ): TranslationData {
    const id   = this.nextId();
    const data = this._makeData(id, this.nextLabel(), memberIds, waypoints);
    return this._insert(data, '↔', 'octagon-base', treeOpts);
  }

  // ── Tick ─────────────────────────────────────────────────────────────────

  tick(dt: number): void {
    for (const data of this.items.values()) {
      if (!data.enabled || data.waypoints.length < 2) continue;
      this._advance(data, dt);
      this._applyPositions(data);
      this.onAfterMove?.(data);
    }
  }

  // ── Apply (no-op — TranslationManager has no per-item Three.js geometry) ─

  apply(_data: TranslationData): void { /* no mesh to rebuild */ }

  buildAndShow(data: TranslationData, treeOpts?: Record<string, unknown>): void {
    this.buildGeometry(data);
    this.ctx.sceneTree.add(data.id, data.name, '↔', 'octagon-base', treeOpts as never);
  }

  // ── Member helpers ───────────────────────────────────────────────────────

  removeMember(nodeId: string): void {
    for (const data of this.items.values()) {
      const idx = data.memberIds.indexOf(nodeId);
      if (idx !== -1) {
        data.memberIds.splice(idx, 1);
        break;
      }
    }
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(_data: TranslationData): void {
    // TranslationManager produces no Three.js geometry of its own —
    // it animates existing member objects.
  }

  protected disposeOne(_data: TranslationData): void {
    // Nothing to dispose — we never own the member objects.
  }

  // ── Serialisation ────────────────────────────────────────────────────────

  toSave(data: TranslationData): TranslationSave {
    return {
      id:         data.id,
      name:       data.name,
      memberIds:  [...data.memberIds],
      waypoints:  data.waypoints.map(w => ({ ...w })),
      durationMs: data.durationMs,
      loopMode:   data.loopMode,
      easing:     data.easing,
      enabled:    data.enabled,
      visible:    data.visible,
    };
  }

  fromSave(save: TranslationSave): TranslationData {
    return this._makeData(
      save.id, save.name,
      [...save.memberIds],
      save.waypoints.map(w => ({ ...w })),
      {
        durationMs: save.durationMs,
        loopMode:   save.loopMode,
        easing:     save.easing,
        enabled:    save.enabled,
        visible:    save.visible ?? true,
      },
    );
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private _makeData(
    id: string,
    name: string,
    memberIds: string[],
    waypoints: TranslationWaypoint[],
    overrides?: Partial<TranslationData>,
  ): TranslationData {
    return {
      id, name, memberIds,
      waypoints: waypoints.length >= 2 ? waypoints : [
        { x: 0, y: 0, z: 0 },
        { x: 20, y: 0, z: 0 },
      ],
      durationMs: TRANS.DEFAULT_DURATION_MS,
      loopMode:   TRANS.DEFAULT_LOOP,
      easing:     TRANS.DEFAULT_EASING,
      enabled:    true,
      visible:    true,
      _t:         0,
      _dir:       1,
      ...overrides,
    };
  }

  private _advance(data: TranslationData, dt: number): void {
    const span = data.durationMs / 1000;
    const delta = dt / span;

    if (data.loopMode === 'once') {
      data._t = Math.min(1, data._t + delta);

    } else if (data.loopMode === 'loop') {
      data._t += delta;
      if (data._t >= 1) data._t -= Math.floor(data._t);

    } else {
      // pingpong
      data._t += delta * data._dir;
      if (data._t >= 1) { data._t = 1; data._dir = -1; }
      else if (data._t <= 0) { data._t = 0; data._dir = 1; }
    }
  }

  private _ease(t: number, easing: TranslationData['easing']): number {
    switch (easing) {
      case 'ease_in':  return t * t;
      case 'ease_out': return t * (2 - t);
      case 'smooth':   return t * t * (3 - 2 * t);
      default:         return t;
    }
  }

  private _applyPositions(data: TranslationData): void {
    const pts = data.waypoints;
    const n   = pts.length - 1;    // number of segments
    if (n < 1) return;

    const et = this._ease(data._t, data.easing);
    const raw = et * n;
    const seg = Math.min(Math.floor(raw), n - 1);
    const u   = raw - seg;

    const a = pts[seg];
    const b = pts[seg + 1];
    const x = a.x + (b.x - a.x) * u;
    const y = a.y + (b.y - a.y) * u;
    const z = a.z + (b.z - a.z) * u;

    for (const memberId of data.memberIds) {
      for (const obj of this.getMemberObjects(memberId)) {
        obj.position.set(x, y, z);
      }
    }
  }
}

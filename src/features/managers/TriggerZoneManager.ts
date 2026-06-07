import * as THREE from 'three';
import type { ITickableManager } from '../IArenaFeature';

export interface TriggerZone {
  /** Unique identifier for this zone. */
  id:      string;
  worldX:  number;
  worldZ:  number;
  worldY:  number;
  /** Horizontal radius of the cylinder trigger area (cm). */
  radius:  number;
  /** Half-height of the cylinder (vertically centred on worldY). */
  heightTolerance: number;
  /** Called once when an object enters the zone. */
  onEnter?: (nodeId: string, zone: TriggerZone) => void;
  /** Called once when an object leaves the zone. */
  onExit?:  (nodeId: string, zone: TriggerZone) => void;
  /** Called every tick while an object is inside the zone. */
  onStay?:  (nodeId: string, zone: TriggerZone, dt: number) => void;
  /** Internal — set of nodeIds currently inside this zone. */
  _inside:  Set<string>;
}

/**
 * Generic spatial event system — fires onEnter / onExit / onStay callbacks
 * when tracked objects overlap with registered cylinder trigger zones.
 *
 * Not a FeatureManager — no scene-tree nodes, no serialization.  Zones are
 * registered at runtime via register() and discarded via unregister().
 *
 * Overlap test
 * ────────────
 * Cylinder test: horizontal XZ distance ≤ zone.radius AND
 *                |object.y − zone.worldY| ≤ zone.heightTolerance.
 *
 * Reuse
 * ─────
 * Fully sandbox-agnostic.  getPosition is injected so any host can back it
 * with its own feature maps.
 */
export class TriggerZoneManager implements ITickableManager {
  private readonly zones   = new Map<string, TriggerZone>();
  private readonly tracked = new Set<string>();

  constructor(
    /** Resolve a nodeId to its current world position (null if unknown). */
    private readonly getPosition: (nodeId: string) => THREE.Vector3 | null,
  ) {}

  // ── Registration ─────────────────────────────────────────────────────────

  register(zone: TriggerZone): void {
    if (!zone._inside) zone._inside = new Set();
    this.zones.set(zone.id, zone);
  }

  unregister(zoneId: string): void {
    const zone = this.zones.get(zoneId);
    if (zone) {
      // Fire onExit for all currently inside objects
      for (const nodeId of zone._inside) {
        zone.onExit?.(nodeId, zone);
      }
      zone._inside.clear();
      this.zones.delete(zoneId);
    }
  }

  trackObject(nodeId: string): void   { this.tracked.add(nodeId); }
  untrackObject(nodeId: string): void {
    this.tracked.delete(nodeId);
    // Clean up _inside sets so stale IDs don't linger
    for (const zone of this.zones.values()) {
      if (zone._inside.has(nodeId)) {
        zone._inside.delete(nodeId);
        zone.onExit?.(nodeId, zone);
      }
    }
  }

  clear(): void {
    for (const zone of this.zones.values()) zone._inside.clear();
    this.zones.clear();
    this.tracked.clear();
  }

  // ── ITickableManager ─────────────────────────────────────────────────────

  tick(dt: number): void {
    for (const zone of this.zones.values()) {
      for (const nodeId of this.tracked) {
        const pos = this.getPosition(nodeId);
        if (!pos) continue;

        const dx      = pos.x - zone.worldX;
        const dz      = pos.z - zone.worldZ;
        const hDistSq = dx * dx + dz * dz;
        const rSq     = zone.radius * zone.radius;
        const dyOk    = Math.abs(pos.y - zone.worldY) <= zone.heightTolerance;
        const inside  = hDistSq <= rSq && dyOk;

        const wasInside = zone._inside.has(nodeId);

        if (inside && !wasInside) {
          zone._inside.add(nodeId);
          zone.onEnter?.(nodeId, zone);
        } else if (!inside && wasInside) {
          zone._inside.delete(nodeId);
          zone.onExit?.(nodeId, zone);
        } else if (inside && wasInside) {
          zone.onStay?.(nodeId, zone, dt);
        }
      }
    }
  }
}

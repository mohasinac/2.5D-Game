import type * as THREE from 'three';
import type { SceneTree } from '../utils/SceneTree';
import type { BaseStatModifiers } from '../types/sharedTypes';
import type { RenderManager } from './managers/RenderManager';

/**
 * Minimum identity contract for any managed arena feature.
 * Kept deliberately small so that any data type can satisfy it.
 */
export interface IArenaFeature {
  readonly id: string;
  name: string;
}

/**
 * Features that own Three.js scene objects (mesh + edges).
 * Extends the base feature identity with nullable geometry references.
 */
export interface ISceneFeature extends IArenaFeature {
  mesh:  THREE.Mesh | null;
  edges: THREE.LineSegments | null;
}

/**
 * Marker interface for managers that update state per frame.
 * ArenaSandbox collects ITickableManager instances and calls tick(dt)
 * in its onTick() override.
 *
 * Kept separate from FeatureManager so that non-animating managers
 * don't pay the interface surface cost (ISP — Interface Segregation Principle).
 */
export interface ITickableManager {
  tick(dt: number): void;
}

/**
 * Implemented by FeatureManagers that hold world-positioned entities.
 * Returns null when id is not found in this manager.
 */
export interface IPositionedManager {
  getWorldPosition(id: string): THREE.Vector3 | null;
}

/**
 * Minimal buff/debuff receiver interface. Implemented by SpawnManager
 * and any future multi-bey physics agent.
 */
export interface IBuffReceiver {
  readonly entityId: string;
  applyBuff(sourceId: string, mods: Partial<BaseStatModifiers>, durationMs: number | null): void;
  removeBuff(sourceId: string): void;
  getEffectiveStats(): BaseStatModifiers;
}

/**
 * Minimal store slice injected into each FeatureManager via setStore().
 * Managers call these on every mutation; they never import from src/stores/ directly.
 */
export interface FeatureStoreSlice<TSave> {
  upsert: (save: TSave) => void;
  remove: (id: string) => void;
  clear:  () => void;
}

/**
 * Dependency-injection context passed to every FeatureManager at
 * construction time.  Managers never import from src/screens/ — they
 * receive all they need through this interface instead (DIP — Dependency
 * Inversion Principle).
 *
 * Keeping this interface thin means any host (ArenaSandbox, a future
 * BeybladeSandbox, a unit-test stub) can implement it with minimal boiler.
 */
export interface SceneContext {
  /** The live Three.js scene. */
  readonly scene: THREE.Scene;

  /** The scene-tree widget; managers add/remove nodes via this. */
  readonly sceneTree: SceneTree;

  /**
   * Returns the fallback floor Y (cm) for this sandbox.
   * For ArenaSandbox this is the octagon-base top face; for other sandboxes
   * it is whatever Y the sandbox considers its ground plane.
   * Called lazily so managers always see the live value.
   */
  readonly getFallbackY: () => number;

  /** Centralised Three.js object registry — replaces trackObjects/untrackObjects. */
  readonly renderMgr: RenderManager;
}

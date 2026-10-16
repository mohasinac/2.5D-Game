import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { GENERATED_CATALOGUE } from './assetCatalogue';
import { applyRenderPolicy } from '../render/shadowPolicy';

/**
 * Resolves prop model ids to loaded glTF scenes, with caching and instancing.
 *
 * WHY NOT `PresentConfig.stlb64`
 * ──────────────────────────────
 * The project already has a way to attach a mesh to a feature: a base64 STL
 * stored inline on the object. That is right for a user importing their own
 * part — it round-trips through the save file with no external dependency — and
 * completely wrong for shipped scenery, because every arena save would carry a
 * copy of every boat it placed, inflating localStorage and the preset library.
 * Shipped props are referenced by id and resolved here instead.
 *
 * COLLISION DELIBERATELY DOES NOT USE THESE MESHES
 * ────────────────────────────────────────────────
 * A prop is drawn from its glTF but still collides as its authored primitive
 * (`ObstacleData.shape` + dims). That is faster, far more predictable, and lets
 * the art change without changing how an arena plays — swapping a box for a
 * detailed boat must not silently alter the physics of an authored stadium.
 *
 * ONE GEOMETRY, MANY INSTANCES
 * ────────────────────────────
 * `instantiate()` hands out `THREE.Object3D` clones that share the cached
 * geometry and materials. The Sea Side Bowl places a ring of boats; loading the
 * file once and cloning is the difference between one upload to the GPU and a
 * dozen.
 */

export interface AssetEntry {
  /** Stable id used by `ObstacleData.modelId` / `BaseFootingData.modelId`. */
  id: string;
  /** Served path, relative to the site root (see `publicDir` in vite.config.ts). */
  url: string;
  /** Human label for the properties-panel picker. */
  label: string;
  /**
   * Longest dimension of the source model, in its own units. Used to normalise
   * a prop to the authored `dimX/dimY/dimZ` so art of any export scale drops in
   * without hand-tuning — the project is strictly 1 unit = 1 cm, and downloaded
   * CC0 models rarely are.
   */
  sourceLongestSide: number;
}

/**
 * The shipped prop catalogue — 32 CC0 models, all with a `LICENSES.md` row.
 *
 * GENERATED from what is on disk (`scripts/fetch-assets.mjs`), not hand-kept.
 * The original note here argued for a hand-written list so a dead id would be
 * a visible edit rather than a silent runtime miss — but generating it removes
 * the failure mode outright instead of making it easier to spot, because the
 * list cannot disagree with the folder it is derived from. A hand list has the
 * opposite risk: `load()` negative-caches an unknown id and the caller keeps
 * its grey box, so a stale entry looks exactly like "no model was picked".
 */
export const ASSET_CATALOGUE: readonly AssetEntry[] = GENERATED_CATALOGUE;

type LoadState =
  | { status: 'loading'; promise: Promise<THREE.Object3D | null> }
  | { status: 'ready';   root: THREE.Object3D }
  | { status: 'failed' };

export class AssetRegistry {
  private readonly _cache = new Map<string, LoadState>();
  /**
   * Meshopt is registered; KTX2 deliberately is NOT, yet.
   *
   * `assets/README.md` mandates `gltfpack` (quantise + simplify + Meshopt +
   * KTX2), and a bare `GLTFLoader` cannot parse ANY of that output — so this
   * registration is what makes the documented pipeline usable at all. The
   * decoder ships inside `three/addons`, so it costs no extra served files.
   *
   * `KTX2Loader` is the opposite trade: it needs the Basis transcoder WASM
   * served from `publicDir`, which is real weight, and nothing we ship uses
   * KTX2 textures today. Adding it now would mean carrying a transcoder for
   * assets that do not exist. Register it alongside the first KTX2 texture,
   * not before.
   */
  private readonly _loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  private readonly _entries: Map<string, AssetEntry>;

  constructor(catalogue: readonly AssetEntry[] = ASSET_CATALOGUE) {
    this._entries = new Map(catalogue.map((e) => [e.id, e]));
  }

  /** Catalogue entries, for building a picker. */
  list(): readonly AssetEntry[] { return [...this._entries.values()]; }

  has(id: string): boolean { return this._entries.has(id); }

  /**
   * Load a model once. Concurrent callers share the same in-flight promise, so
   * a ring of twelve boats triggers exactly one network fetch.
   *
   * Resolves to `null` rather than rejecting when a model is missing or broken:
   * a prop that fails to load must degrade to its procedural placeholder, not
   * take down the arena that references it.
   */
  async load(id: string): Promise<THREE.Object3D | null> {
    const cached = this._cache.get(id);
    if (cached?.status === 'ready')   return cached.root;
    if (cached?.status === 'failed')  return null;
    if (cached?.status === 'loading') return cached.promise;

    const entry = this._entries.get(id);
    if (!entry) { this._cache.set(id, { status: 'failed' }); return null; }

    const promise = this._loader.loadAsync(entry.url)
      .then((gltf) => {
        const root = gltf.scene;
        this._normalise(root, entry);
        this._cache.set(id, { status: 'ready', root });
        return root as THREE.Object3D;
      })
      .catch(() => {
        this._cache.set(id, { status: 'failed' });
        return null;
      });

    this._cache.set(id, { status: 'loading', promise });
    return promise;
  }

  /**
   * A clone of a loaded model, scaled so its longest side is `targetLongest` cm
   * and centred on its own origin. Returns null if the model is not loaded yet
   * or failed — callers keep their placeholder in that case.
   *
   * `clone(true)` shares geometry and materials with the cached original; only
   * the node graph is duplicated.
   */
  instantiate(id: string, targetLongest: number): THREE.Object3D | null {
    const cached = this._cache.get(id);
    if (cached?.status !== 'ready') return null;

    const inst = cached.root.clone(true);
    const entry = this._entries.get(id)!;
    const s = targetLongest / (entry.sourceLongestSide || 1);
    inst.scale.setScalar(s);

    /* Props are lit scenery: they cast and receive like any other surface. */
    applyRenderPolicy(inst);
    return inst;
  }

  /**
   * Centre a loaded model on its own origin so `instantiate` scaling is
   * predictable regardless of where the artist placed the pivot, and record the
   * measured extent when the catalogue did not state one.
   */
  private _normalise(root: THREE.Object3D, entry: AssetEntry): void {
    const box = new THREE.Box3().setFromObject(root);
    const centre = box.getCenter(new THREE.Vector3());
    root.position.sub(centre);

    if (!entry.sourceLongestSide) {
      const size = box.getSize(new THREE.Vector3());
      entry.sourceLongestSide = Math.max(size.x, size.y, size.z) || 1;
    }
  }

  /**
   * Free every cached model. Geometry and materials are shared with any live
   * instances, so this is for teardown only — not for unloading one arena.
   */
  dispose(): void {
    const seenGeo = new Set<THREE.BufferGeometry>();
    const seenMat = new Set<THREE.Material>();
    for (const state of this._cache.values()) {
      if (state.status !== 'ready') continue;
      state.root.traverse((o) => {
        const m = o as Partial<THREE.Mesh>;
        if (m.geometry && !seenGeo.has(m.geometry)) { seenGeo.add(m.geometry); m.geometry.dispose(); }
        const mat = m.material;
        if (!mat) return;
        for (const one of Array.isArray(mat) ? mat : [mat]) {
          if (one && !seenMat.has(one)) { seenMat.add(one); one.dispose(); }
        }
      });
    }
    this._cache.clear();
  }
}

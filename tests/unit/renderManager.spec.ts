import { test, expect } from '@playwright/test';
import * as THREE from 'three';
import { RenderManager } from '../../src/features/managers/RenderManager';

/**
 * RenderManager is now the project's SINGLE scene-object registry — arenas,
 * pits, zones and the octagon base register through it alongside every managed
 * feature, where they previously lived in a second `ArenaSandbox.sceneObjects`
 * map that had to be merged back by hand.
 *
 * These cover the three behaviours that consolidation depends on, each of which
 * is silent when wrong: additive `add`, non-disposing `detach`, and the
 * `detachObjects` path for sub-meshes that come and go while their feature lives
 * on (an arena's floor and island caps).
 */

const mesh = (): THREE.Mesh =>
  new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());

test.describe('RenderManager', () => {

  test('add() parents objects into the scene and registers them', () => {
    const scene = new THREE.Scene();
    const rm = new RenderManager(scene);
    const a = mesh();
    rm.add('arena-1', [a]);
    expect(scene.children).toContain(a);
    expect(rm.getObjects('arena-1')).toEqual([a]);
  });

  test('add() is additive — an arena gains its floor cap later', () => {
    // updateArenaFloor creates floorMesh only once the profile allows it, long
    // after the arena itself registered. The old design handled this by pushing
    // onto a bare array; add() has to behave the same way.
    const scene = new THREE.Scene();
    const rm = new RenderManager(scene);
    const body = mesh(), floor = mesh();
    rm.add('arena-1', [body]);
    rm.add('arena-1', [floor]);
    expect(rm.getObjects('arena-1')).toEqual([body, floor]);
  });

  test('detach() unregisters and unparents but does NOT dispose', () => {
    // Load-bearing: disposeArena/Pit/Zone already own geometry and material
    // disposal, including the refcounted surface-material cache. If detach
    // disposed as well, every clear would free the same resources twice.
    const scene = new THREE.Scene();
    const rm = new RenderManager(scene);
    const m = mesh();
    let disposed = false;
    m.geometry.addEventListener('dispose', () => { disposed = true; });

    rm.add('pit-1', [m]);
    rm.detach('pit-1');

    expect(scene.children).not.toContain(m);
    expect(rm.getObjects('pit-1')).toEqual([]);
    expect(disposed).toBe(false);
  });

  test('dispose() DOES free geometry and material', () => {
    const scene = new THREE.Scene();
    const rm = new RenderManager(scene);
    const m = mesh();
    let geoDisposed = false, matDisposed = false;
    m.geometry.addEventListener('dispose', () => { geoDisposed = true; });
    (m.material as THREE.Material).addEventListener('dispose', () => { matDisposed = true; });

    rm.add('wall-1', [m]);
    rm.dispose('wall-1');

    expect(scene.children).not.toContain(m);
    expect(geoDisposed).toBe(true);
    expect(matDisposed).toBe(true);
  });

  test('detachObjects() removes one sub-mesh and keeps the rest of the entry', () => {
    // An arena switching off its straight profile drops floorMesh while the
    // arena body lives on. Leaving it registered would hand a disposed mesh to
    // getPickable() for raycasting.
    const scene = new THREE.Scene();
    const rm = new RenderManager(scene);
    const body = mesh(), floor = mesh();
    rm.add('arena-1', [body, floor]);

    rm.detachObjects('arena-1', [floor]);

    expect(rm.getObjects('arena-1')).toEqual([body]);
    expect(scene.children).toContain(body);
    expect(scene.children).not.toContain(floor);
  });

  test('detachObjects() does not dispose what it removes', () => {
    const scene = new THREE.Scene();
    const rm = new RenderManager(scene);
    const floor = mesh();
    let disposed = false;
    floor.geometry.addEventListener('dispose', () => { disposed = true; });
    rm.add('arena-1', [floor]);
    rm.detachObjects('arena-1', [floor]);
    expect(disposed).toBe(false);
  });

  test('detachObjects() ignores unknown ids and unregistered objects', () => {
    // Called speculatively from the profile-change branches, so it must be safe
    // when the mesh was never registered.
    const scene = new THREE.Scene();
    const rm = new RenderManager(scene);
    const body = mesh(), stranger = mesh();
    rm.add('arena-1', [body]);

    expect(() => rm.detachObjects('nope', [body])).not.toThrow();
    expect(() => rm.detachObjects('arena-1', [stranger])).not.toThrow();
    expect(rm.getObjects('arena-1')).toEqual([body]);
  });

  test('detachObjects() keeps objects and parents aligned after a removal', () => {
    // The entry holds two parallel arrays; splicing one and not the other would
    // silently remove the wrong object on the next call.
    const scene = new THREE.Scene();
    const rm = new RenderManager(scene);
    const group = new THREE.Group();
    scene.add(group);
    const a = mesh(), b = mesh(), c = mesh();

    rm.add('x', [a]);
    rm.add('x', [b], group);   // b is parented to the group, not the scene
    rm.add('x', [c]);

    rm.detachObjects('x', [a]);
    expect(rm.getObjects('x')).toEqual([b, c]);

    // b must still be removed from the GROUP, not from the scene.
    rm.detachObjects('x', [b]);
    expect(group.children).not.toContain(b);
    expect(rm.getObjects('x')).toEqual([c]);
  });

  test('getAllEntries() exposes every feature — the single-registry guarantee', () => {
    const scene = new THREE.Scene();
    const rm = new RenderManager(scene);
    rm.add('octagon-base', [mesh()]);
    rm.add('arena-1', [mesh()]);
    rm.add('wall-1', [mesh()]);
    expect([...rm.getAllEntries().keys()].sort()).toEqual(['arena-1', 'octagon-base', 'wall-1']);
  });
});

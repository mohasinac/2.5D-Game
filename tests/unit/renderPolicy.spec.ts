import { test, expect } from '@playwright/test';
import * as THREE from 'three';
import { applyRenderPolicy } from '../../src/render/shadowPolicy';

/**
 * Render-policy tests.
 *
 * This runs in the browser-free `unit` project because the policy is pure logic
 * over Object3D/Material flags — it touches no renderer, no canvas and no DOM.
 * That matters: the policy is applied at six scene-add sites across the codebase
 * and a regression in it would show up only as "the scene looks slightly wrong",
 * which no existing test can catch.
 *
 * The assertions are written against the *reasons* in shadowPolicy.ts, not
 * against its current output, so they fail if the intent changes rather than
 * just if the implementation moves.
 */

const lit = (): THREE.MeshStandardMaterial => new THREE.MeshStandardMaterial();

test.describe('applyRenderPolicy', () => {

  test('an opaque lit surface casts and receives', () => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(), lit());
    applyRenderPolicy(m);
    expect(m.castShadow).toBe(true);
    expect(m.receiveShadow).toBe(true);
  });

  test('a lit surface stays tone-mapped — ACES is meant to reach it', () => {
    const mat = lit();
    const m = new THREE.Mesh(new THREE.BoxGeometry(), mat);
    applyRenderPolicy(m);
    expect(mat.toneMapped).toBe(true);
  });

  test('a transparent lit surface receives but does NOT cast', () => {
    // The zone water fills and glass walls. A see-through surface casting an
    // opaque shadow is the most visible shadow artefact available.
    const mat = lit(); mat.transparent = true;
    const m = new THREE.Mesh(new THREE.BoxGeometry(), mat);
    applyRenderPolicy(m);
    expect(m.castShadow).toBe(false);
    expect(m.receiveShadow).toBe(true);
  });

  test('opacity below 1 also suppresses casting, even without transparent:true', () => {
    const mat = lit(); mat.opacity = 0.5;
    const m = new THREE.Mesh(new THREE.BoxGeometry(), mat);
    applyRenderPolicy(m);
    expect(m.castShadow).toBe(false);
  });

  test('THE PALETTE GUARD: edge lines are excluded from the ACES curve', () => {
    // This is the whole reason the exclusion exists. Material.toneMapped
    // defaults to true in r165, so without this every LineSegments edge in the
    // project would render a duller cyan than CLAUDE.md fixes as the look.
    const mat = new THREE.LineBasicMaterial({ color: 0x00e5ff });
    const l = new THREE.LineSegments(new THREE.BufferGeometry(), mat);
    applyRenderPolicy(l);
    expect(mat.toneMapped).toBe(false);
    expect(l.castShadow).toBe(false);
    expect(l.receiveShadow).toBe(false);
  });

  test('axis/tick sprites are excluded', () => {
    const mat = new THREE.SpriteMaterial();
    const s = new THREE.Sprite(mat);
    applyRenderPolicy(s);
    expect(mat.toneMapped).toBe(false);
    expect(s.castShadow).toBe(false);
  });

  test('particle Points are excluded', () => {
    const mat = new THREE.PointsMaterial();
    const p = new THREE.Points(new THREE.BufferGeometry(), mat);
    applyRenderPolicy(p);
    expect(mat.toneMapped).toBe(false);
    expect(p.castShadow).toBe(false);
  });

  test('an unlit Mesh is a diagram element, not a surface', () => {
    // The accent origin marker and every speed-line gizmo handle: a Mesh, but
    // MeshBasicMaterial, so its colour is final and it must not cast.
    const mat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.1), mat);
    applyRenderPolicy(m);
    expect(mat.toneMapped).toBe(false);
    expect(m.castShadow).toBe(false);
    expect(m.receiveShadow).toBe(false);
  });

  test('a custom ShaderMaterial surface is authored, not lit', () => {
    // The zone fill wave (WAVE_VERT/WAVE_FRAG). A raw ShaderMaterial has no
    // shadow code compiled in, so receiveShadow would be a silent no-op, and
    // its fragment output is already the final colour.
    const mat = new THREE.ShaderMaterial({ vertexShader: 'void main(){}', fragmentShader: 'void main(){}' });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(), mat);
    applyRenderPolicy(m);
    expect(mat.toneMapped).toBe(false);
    expect(m.castShadow).toBe(false);
  });

  test('RECURSION: reaches meshes nested two Groups deep', () => {
    // Not academic. Bridge segment meshes live under `seg._animPivot` inside
    // `bridge.group`, and wall meshes under `wall._rotatePivot` — both are
    // registered with RenderManager as a Group. A non-recursive pass would
    // leave every bridge and every rotating wall without shadows.
    const inner = new THREE.Mesh(new THREE.BoxGeometry(), lit());
    const pivot = new THREE.Group(); pivot.add(inner);
    const group = new THREE.Group(); group.add(pivot);

    applyRenderPolicy(group);
    expect(inner.castShadow).toBe(true);
    expect(inner.receiveShadow).toBe(true);
  });

  test('REGRESSION: the policy must not disable a shadow-casting light', () => {
    // On a Light, castShadow means "this light projects shadows" — the opposite
    // of its meaning on a Mesh. A DirectionalLight has no material, so the
    // diagram-element branch used to clear it and switch off the scene's only
    // shadow caster. The scene still rendered, still had zero console errors
    // and still passed all 57 tests; it just had no shadows. Found only by
    // `__demo.getRenderStats()` reporting shadowLights: 0.
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    applyRenderPolicy(light);
    expect(light.castShadow).toBe(true);
  });

  test('a light nested under a Group survives the recursive pass', () => {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    const g = new THREE.Group();
    g.add(light);
    applyRenderPolicy(g);
    expect(light.castShadow).toBe(true);
  });

  test('a bare Group is not mistaken for a lit surface', () => {
    const g = new THREE.Group();
    applyRenderPolicy(g);
    expect(g.castShadow).toBe(false);
    expect(g.receiveShadow).toBe(false);
  });

  test('a multi-material mesh is only as opaque as its most transparent slot', () => {
    const opaque = lit();
    const clear  = lit(); clear.transparent = true;
    const m = new THREE.Mesh(new THREE.BoxGeometry(), [opaque, clear]);
    applyRenderPolicy(m);
    expect(m.castShadow).toBe(false);
    expect(m.receiveShadow).toBe(true);
  });

  test('a multi-material mesh with any unlit slot is a diagram element', () => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(), [lit(), new THREE.MeshBasicMaterial()]);
    applyRenderPolicy(m);
    expect(m.castShadow).toBe(false);
    expect(m.receiveShadow).toBe(false);
  });

  test('IDEMPOTENT: feature rebuilds re-register through the same funnels', () => {
    const mat = lit();
    const m = new THREE.Mesh(new THREE.BoxGeometry(), mat);
    applyRenderPolicy(m);
    const first = { c: m.castShadow, r: m.receiveShadow, t: mat.toneMapped };
    applyRenderPolicy(m);
    applyRenderPolicy(m);
    expect({ c: m.castShadow, r: m.receiveShadow, t: mat.toneMapped }).toEqual(first);
  });

  test('a mesh that becomes transparent later stops casting on re-apply', () => {
    // Materials are swapped in place in several paths (rebuildBase, surfaceRow),
    // so the policy must re-derive rather than latch its first answer.
    const mat = lit();
    const m = new THREE.Mesh(new THREE.BoxGeometry(), mat);
    applyRenderPolicy(m);
    expect(m.castShadow).toBe(true);

    mat.transparent = true;
    applyRenderPolicy(m);
    expect(m.castShadow).toBe(false);
  });
});

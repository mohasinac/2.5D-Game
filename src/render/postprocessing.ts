import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 18 — POSTPROCESSING

   Uses Three's OWN addons rather than `pmndrs/postprocessing`. The plan named
   the latter for its pass-merging, but it is a new dependency and this is
   being written with the test container down — adding an unpinned package
   that cannot be installed or run is how a build breaks silently. `three` is
   already a dependency and ships these passes; swapping libraries later is a
   change inside this one file.

   TONE MAPPING MOVES. This is the detail that silently ruins a bloom chain:
   with a composer, the renderer must stop applying tone mapping itself and
   let `OutputPass` do it at the end, or the image is tone-mapped twice —
   once before bloom and once after — which crushes exactly the highlights
   bloom exists to find. `mountComposer` takes that over and `unmountComposer`
   gives it back, so a screen without postprocessing is unaffected.

   The threshold is deliberately high. The palette is authored cyan and
   orange on a near-black background (#080810); a low threshold blooms the
   whole UI and the arena edges, which reads as fog rather than glow.
   ══════════════════════════════════════════════════════════════════════════ */

/** Luminance above which a pixel blooms. High, for the reason above. */
export const BLOOM_THRESHOLD = 0.85;
export const BLOOM_STRENGTH  = 0.42;
export const BLOOM_RADIUS    = 0.30;

export interface PostFx {
  composer: EffectComposer;
  bloom: UnrealBloomPass;
  /** Tone mapping the renderer had before we took it over. */
  priorToneMapping: THREE.ToneMapping;
  setSize(width: number, height: number): void;
  render(): void;
  dispose(): void;
}

/**
 * Build a composer for a scene/camera pair.
 *
 * Per-mount, like the PMREM environment and for the same reason: the render
 * targets inside belong to the renderer that made them, so keeping one across
 * a screen switch leaves the composer holding buffers from a destroyed
 * context.
 */
export function mountComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  width: number,
  height: number,
): PostFx {
  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);

  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD,
  );
  composer.addPass(bloom);

  /* OutputPass applies tone mapping and the sRGB conversion at the END of the
     chain. The renderer must therefore stop doing it, or everything is
     mapped twice. */
  const priorToneMapping = renderer.toneMapping;
  renderer.toneMapping = THREE.NoToneMapping;
  composer.addPass(new OutputPass());

  return {
    composer,
    bloom,
    priorToneMapping,
    setSize(w, h) { composer.setSize(w, h); bloom.setSize(w, h); },
    render() { composer.render(); },
    dispose() {
      renderer.toneMapping = priorToneMapping;
      composer.dispose();
    },
  };
}

/**
 * Hand tone mapping back and free the targets.
 *
 * Must run BEFORE `renderer.dispose()`, same ordering rule the environment
 * map already follows.
 */
export function unmountComposer(fx: PostFx | null): null {
  fx?.dispose();
  return null;
}

/* ── Draw-call budget ────────────────────────────────────────────────────── */

/**
 * The mobile budget the plan sets: under ~100 draw calls with six beys.
 *
 * `BatchedMesh` is the tool for getting there and is NOT implemented here —
 * it needs geometry that shares one material, and the bey renderer currently
 * builds a material per part. Measuring first is the right order anyway:
 * this reports the number so a regression is visible, rather than optimising
 * something that may already be inside budget.
 */
export const MOBILE_DRAW_CALL_BUDGET = 100;

export interface DrawCallReport {
  calls: number;
  triangles: number;
  overBudget: boolean;
}

export function drawCallReport(renderer: THREE.WebGLRenderer): DrawCallReport {
  const info = renderer.info.render;
  return {
    calls: info.calls,
    triangles: info.triangles,
    overBudget: info.calls > MOBILE_DRAW_CALL_BUDGET,
  };
}

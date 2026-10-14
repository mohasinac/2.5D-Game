import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/**
 * Image-based lighting for the sandboxes.
 *
 * WHY PBR WAS BROKEN WITHOUT THIS
 * ───────────────────────────────
 * The project has ~47 `MeshStandardMaterial`s and set `scene.environment`
 * nowhere, so every one of them was a physically-based material with nothing to
 * reflect. A `metal` arena material rendered near-black, because that is what a
 * metal with no environment *is*: a mirror in an empty room. This is the single
 * largest cause of the "flat untextured plastic" look, ahead of the missing UVs.
 *
 * WHY RoomEnvironment AND NOT AN HDRI FILE
 * ────────────────────────────────────────
 * `RoomEnvironment` is a procedural studio box that ships inside the installed
 * three package — a few lights and boxes built in memory. It therefore costs
 * zero bytes of download and makes **no network request**, which matters because
 * this app deliberately makes none at all (CLAUDE.md: "Zero fetch/XHR/WebSocket
 * anywhere") and `assets/` does not exist until the asset-pipeline phase.
 * Shipping a real Poly Haven `.hdr` is the planned upgrade — it is a texture
 * swap at the one call site below, not a redesign, because PMREM consumes both
 * a Scene and an equirectangular texture through the same generator.
 *
 * LIFECYCLE — THE PART THAT IS EASY TO GET WRONG
 * ──────────────────────────────────────────────
 * A PMREM cubemap is a GPU render target, so it belongs to the WebGL context
 * that produced it. `Sandbox` creates a renderer on every `setVisible(true)` and
 * disposes it on `setVisible(false)` (the single-WebGL-context rule), which means
 * the environment must be built per mount and disposed per unmount alongside it.
 * Generating it once in `initScene()` would leave the scene holding a texture
 * owned by a destroyed context after the first screen switch.
 *
 * `scene.background` is deliberately left alone: the clear colour (0x08080f) is
 * the project's backdrop, and showing a studio room behind a dark UI would fight
 * the aesthetic. Separating lighting from backdrop is the whole point of setting
 * only `environment`.
 */

/**
 * Reflections are intentionally dimmer than the lighting default. At 1.0 the
 * studio room washes the bowl surfaces out and the cyan accent reads grey; this
 * keeps the metal/ABS distinction legible while leaving the authored palette
 * dominant. Tuned against the dark background that CLAUDE.md fixes.
 */
const ENV_INTENSITY = 0.55;

/** Blur applied while prefiltering, in radians. Softens the room's hard box edges. */
const ENV_BLUR = 0.04;

/**
 * Build a prefiltered environment map and attach it to `scene`.
 * Returns the texture so the caller can dispose it with its renderer.
 */
export function mountEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room  = new RoomEnvironment();

  const envTex = pmrem.fromScene(room, ENV_BLUR).texture;

  scene.environment          = envTex;
  scene.environmentIntensity = ENV_INTENSITY;

  /* The source scene and the generator are both scratch: the prefiltered
     cubemap is self-contained once produced. Leaking either would retain the
     room's geometry and a full set of render targets per screen switch. */
  room.traverse((o) => {
    const mesh = o as Partial<THREE.Mesh>;
    mesh.geometry?.dispose();
    const mat = mesh.material;
    if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose());
  });
  pmrem.dispose();

  return envTex;
}

/** Detach and free the environment map. Call before disposing the renderer. */
export function unmountEnvironment(scene: THREE.Scene, envTex: THREE.Texture | null): void {
  if (scene.environment === envTex) scene.environment = null;
  envTex?.dispose();
}

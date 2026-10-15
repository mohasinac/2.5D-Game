/**
 * demoApi — dev-only `window.__demo` surface used by the Playwright feature demos.
 *
 * Mounted ONLY under `import.meta.env.DEV`, so it is tree-shaken out of production
 * builds. Nothing in `src/` may depend on it.
 *
 * It exists because the alternative — driving the real UI for every demo — cannot
 * place a bey at an exact position, cannot reproduce a scenario twice, and breaks
 * whenever a button moves. The runner needs to assert on physics outcomes
 * ("left the ramp at >= 180 cm/s"), not just that something moved.
 *
 * This file imports nothing from `src/screens/`. The host screen passes closures
 * over its own privates via `mountDemoApi(hooks)`.
 */

import * as THREE from 'three';
import type { ArenaConfig } from './arenaPersistence';

export interface DemoVec { x: number; y: number; z: number }

export interface DemoBeyState {
  pos: DemoVec;
  vel: DemoVec;
  speed: number;
  health: number;
  rpm: number;
  grounded: boolean;
  spawned: boolean;
  /** Obstacle-SIDE contacts since spawn. Zero is meaningful: a bey that
   *  rebounds off a pillar rests about where one that never moved would, so
   *  this is the only way to observe that contact actually occurred. */
  obstacleContacts: number;
  /** Bridge side-wall retentions since spawn. Same reasoning as
   *  `obstacleContacts`: being held on a deck is invisible in the final
   *  position, because staying on is what *not* falling off looks like. */
  channelContacts: number;
  /** True once the heavy-top model has put the bey over. The first real
   *  losing condition the project has ever had. */
  sleptOut: boolean;
  /** Spin below which this bey can no longer stand, rad/s — so a test can say
   *  "it is about to go" rather than waiting to see whether it does. */
  sleepOutOmega: number;
}

/**
 * How the scene is being drawn. See `DemoApi.getRenderStats`.
 *
 * `litCasters` / `litReceivers` vs `unlitExcluded` is the load-bearing split:
 * it is the live-scene counterpart of the unlit-vs-lit rule in
 * `render/shadowPolicy.ts`. `toneMappedUnlit` must be **0** — anything above
 * that is an authored colour silently being pushed through the ACES curve,
 * which is how the cyan/orange palette would get dulled without any test
 * noticing.
 */
/**
 * Per-bridge physical reality check. See `DemoApi.getBridgeDiag`.
 *
 * Every field here answers a different "the bridge is missing" story, because
 * they are indistinguishable from outside: `segments` separates "the save never
 * restored" from "it restored and built nothing"; `withMesh` separates "built
 * nothing" from "built a mesh nobody parented"; `inScene` separates "not
 * parented" from "parented but positioned somewhere else"; and `worldY`
 * separates all of those from "it is exactly where it should be and the probe
 * is wrong". A grid raycast can only ever say *nothing is here*.
 */
export interface DemoBridgeDiag {
  bridgeId: string;
  groupInScene: boolean;
  segments: number;
  withMesh: number;
  inScene: number;
  worldPositions: DemoVec[];
  /** Per-segment: vertices, and the world-space box the geometry actually occupies.
   *  A mesh at the origin with 0 vertices and a null box is built-but-empty; one
   *  with vertices and a box elsewhere is built-but-mispositioned. Same symptom. */
  segGeom: { id: string; vertices: number; box: { min: DemoVec; max: DemoVec } | null }[];
  /** What the U-channel resolver actually sees. `pathPts: 0` means the
   *  centreline cache was never written; walls false means the authored
   *  section did not survive save/restore. Both look identical from outside
   *  ("the bey fell off"), which is why they are reported separately. */
  channel: {
    halfWidth: number | null;
    pathPts: number;
    hasLeftWall: boolean;
    hasRightWall: boolean;
    sideWallHeight: number;
    crossSection: string;
  };
}

export interface DemoRenderStats {
  toneMapping: number;
  toneMappingExposure: number;
  outputColorSpace: string;
  shadowMapEnabled: boolean;
  shadowMapType: number;
  environmentSet: boolean;
  environmentIntensity: number;
  /** Meshes with a lit material that cast / receive. */
  litCasters: number;
  litReceivers: number;
  /** Lines, sprites, points and unlit meshes held out of the shadow pass. */
  unlitExcluded: number;
  /** MUST be 0 — unlit materials left tone-mapped. */
  toneMappedUnlit: number;
  /** Shadow-casting directional lights, and the first one's ortho frustum. */
  shadowLights: number;
  shadowCamera: { left: number; right: number; top: number; bottom: number; near: number; far: number } | null;
  shadowMapSize: { width: number; height: number } | null;
}

/** Everything the host screen must supply. Kept deliberately small. */
export interface DemoHooks {
  loadConfig(cfg: ArenaConfig): void;
  clearScene(): void;

  spawn(opts: { pos?: DemoVec; vel?: DemoVec; rpm?: number; tiltDeg?: number }): void;
  despawn(): void;
  getBeyState(): DemoBeyState | null;
  setBeyPosition(p: DemoVec): void;
  setBeyVelocity(v: DemoVec): void;

  getScene(): THREE.Scene;
  getCamera(): THREE.PerspectiveCamera | null;
  getRenderer(): THREE.WebGLRenderer | null;
  probeDown(x: number, z: number): string[];
  getBridgeDiag(): DemoBridgeDiag[];
  getMatchDiag(): DemoMatchDiag;
  setCameraTarget(pos: DemoVec, target: DemoVec): void;

  /** Live feature lookup for focusOn/markFeature and state assertions. */
  getFeatureWorldPos(featureId: string): DemoVec | null;
  getFeatureState(featureId: string): Record<string, unknown> | null;

  setFixedTimestep(ms: number | null): void;
  freeze(): void;
  resume(): void;
  step(frames: number): void;
}

export interface DemoApi {
  readonly ready: true;
  loadArenaConfig(cfg: ArenaConfig): Promise<void>;
  clear(): void;

  spawnBey(opts?: { pos?: DemoVec; vel?: DemoVec; rpm?: number; tiltDeg?: number }): void;
  despawnBey(): void;
  getBeyState(): DemoBeyState | null;
  setBeyPosition(p: DemoVec): void;
  setBeyVelocity(v: DemoVec): void;

  setFixedTimestep(ms: number | null): void;
  freeze(): void;
  resume(): void;
  step(frames?: number): void;
  settle(ms: number): Promise<void>;

  setCamera(pos: DemoVec, target: DemoVec): void;
  focusOn(featureId: string, distance?: number): boolean;
  markFeature(featureId: string, color?: number): boolean;
  clearMarkers(): void;

  getFeatureState(featureId: string): Record<string, unknown> | null;

  narrate(title: string, subtext?: string): void;
  clearNarration(): void;

  /** Hide the editor chrome so the arena fills the frame during a demo. */
  setChromeVisible(visible: boolean): void;

  /**
   * Renderer + scene render-state snapshot, for asserting on *how* the scene is
   * being drawn rather than on what is in it.
   *
   * Exists because the look-and-feel work (tone mapping, IBL, shadows, the
   * unlit-material exclusion) is otherwise only checkable by eye, and "the
   * colours went slightly dull" is exactly the kind of regression that survives
   * a green test suite. Pairs with `tests/unit/renderPolicy.spec.ts`: that
   * proves the policy decides correctly in isolation, this proves it was
   * actually applied to the live scene.
   */
  getRenderStats(): DemoRenderStats | null;

  /**
   * Everything a downward ray hits at world (x, z), nearest-first, each named.
   *
   * "Why is nothing under the bey here?" and "what is drawn in front of this?"
   * are the two questions that keep costing hours, and both are answered by
   * naming the surfaces along a ray rather than by reasoning about the scene
   * graph. Generic on purpose — the speed-line-specific `occluders` probe that
   * cracked the ribbon bug was this, scoped to one feature.
   */
  probeDown(x: number, z: number): string[];

  /**
   * One row per bridge: does its geometry exist, and is it in the scene?
   *
   * `probeDown` can only report what a ray hits, so a bridge that was never
   * built and a bridge built 200 cm from where its config says look identical
   * — both are silence. This reads the manager directly, which is the only way
   * to tell those two apart.
   */
  getBridgeDiag(): DemoBridgeDiag[];

  /**
   * One row per roster bey, plus the live match state.
   *
   * Exists for the same reason `getBridgeDiag` does. A battle that never ends
   * is indistinguishable from outside: an opponent that is still spinning, one
   * that is spinning but never `grounded` (so spin never decays, because the
   * torque needs a surface), and one already defeated but unreported all look
   * identical through the HUD. Each field separates one of those stories.
   */
  getMatchDiag(): DemoMatchDiag;

  /** Resolves once the bey's |velocity| drops below `speed`, or on timeout. */
  waitForRest(speed?: number, timeoutMs?: number): Promise<boolean>;
}

export interface DemoMatchDiag {
  /** True once a battle has been started from the UI. */
  running: boolean;
  roundsPlayed: number;
  over: boolean;
  matchWinner: string | null;
  /** Everyone the match can actually score, player included. */
  participants: string[];
  beys: {
    id: string;
    alive: boolean;
    rpm: number;
    /** Spin only decays against a surface — airborne beys never sleep out. */
    grounded: boolean;
    sleptOut: boolean;
    health: number;
    y: number;
  }[];
}

const MARKER_RING_SEGMENTS = 64;

/* Editor UI that would otherwise cover most of the viewport in a demo clip.
   The canvas itself is full-bleed behind these, so hiding them is purely
   cosmetic — no layout reflow, no renderer resize. */
const CHROME_SELECTORS = [
  '.sandbox-left-panel',
  '.sandbox-right-panel',
  '.sandbox-top-bar',
  '.sandbox-hint',
  '.arena-view-bar',
  '.arena-score-hud',
  '.spawn-manager-hud',
  '.drawer-backdrop',
  '.vctrl-overlay',
];

function setChromeHidden(hidden: boolean): void {
  const ID = 'demo-hide-chrome';
  const existing = document.getElementById(ID);
  if (!hidden) { existing?.remove(); return; }
  if (existing) return;
  const style = document.createElement('style');
  style.id = ID;
  style.textContent = `${CHROME_SELECTORS.join(',')} { display: none !important; }`;
  document.head.appendChild(style);
}

function v3(v: DemoVec): THREE.Vector3 { return new THREE.Vector3(v.x, v.y, v.z); }
function toDemoVec(v: THREE.Vector3): DemoVec { return { x: v.x, y: v.y, z: v.z }; }

/* ── On-canvas narration overlay ──────────────────────────────────────────── */
function ensureNarrationEl(): HTMLElement {
  let el = document.getElementById('demo-narration');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'demo-narration';
  el.style.cssText = [
    'position:fixed', 'left:50%', 'top:calc(2*var(--cm,8px))', 'transform:translateX(-50%)',
    'z-index:9999', 'pointer-events:none', 'text-align:center',
    'font-family:Orbitron,monospace', 'color:#dde8ff',
    'background:rgba(8,8,16,0.82)', 'border:1px solid rgba(255,107,53,0.55)',
    'padding:calc(6*var(--mm,1px)) calc(14*var(--mm,1px))',
    'box-shadow:0 0 1.2em rgba(255,107,53,0.35)', 'max-width:86vw', 'display:none',
  ].join(';');
  el.innerHTML =
    '<div id="demo-narration-title" style="font-size:1em;letter-spacing:0.12em;' +
    'text-transform:uppercase;color:#ff6b35"></div>' +
    '<div id="demo-narration-sub" style="font-family:Rajdhani,sans-serif;' +
    'font-size:0.8em;opacity:0.85;margin-top:0.25em"></div>';
  document.body.appendChild(el);
  return el;
}

export function mountDemoApi(hooks: DemoHooks): void {
  const markers: THREE.Object3D[] = [];

  const clearMarkers = (): void => {
    const scene = hooks.getScene();
    for (const m of markers) {
      scene.remove(m);
      const mesh = m as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    }
    markers.length = 0;
  };

  const api: DemoApi = {
    ready: true,

    async loadArenaConfig(cfg) {
      clearMarkers();
      hooks.loadConfig(cfg);
      // One frame so geometry is built before the runner screenshots or measures.
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
    },

    clear() {
      clearMarkers();
      hooks.despawn();
      hooks.clearScene();
    },

    spawnBey(opts = {}) { hooks.spawn(opts); },
    despawnBey() { hooks.despawn(); },
    getBeyState() { return hooks.getBeyState(); },
    setBeyPosition(p) { hooks.setBeyPosition(p); },
    setBeyVelocity(v) { hooks.setBeyVelocity(v); },

    setFixedTimestep(ms) { hooks.setFixedTimestep(ms); },
    freeze() { hooks.freeze(); },
    resume() { hooks.resume(); },
    step(frames = 1) { hooks.step(frames); },

    settle(ms) {
      return new Promise<void>((r) => window.setTimeout(r, ms));
    },

    setCamera(pos, target) { hooks.setCameraTarget(pos, target); },

    focusOn(featureId, distance = 70) {
      const p = hooks.getFeatureWorldPos(featureId);
      if (!p) return false;
      // Fixed 35° elevation / 45° azimuth — consistent framing across all demos
      // so differences between them are differences in the feature, not the shot.
      const d = distance;
      hooks.setCameraTarget(
        { x: p.x + d * 0.707, y: p.y + d * 0.574, z: p.z + d * 0.707 },
        p,
      );
      return true;
    },

    markFeature(featureId, color = 0xff6b35) {
      const p = hooks.getFeatureWorldPos(featureId);
      if (!p) return false;
      const geo = new THREE.RingGeometry(10, 11.6, MARKER_RING_SEGMENTS);
      const mat = new THREE.MeshBasicMaterial({
        color, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthTest: false,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(p.x, p.y + 0.4, p.z);
      ring.renderOrder = 999;
      hooks.getScene().add(ring);
      markers.push(ring);
      return true;
    },

    clearMarkers,

    getFeatureState(featureId) { return hooks.getFeatureState(featureId); },

    narrate(title, subtext = '') {
      const el = ensureNarrationEl();
      el.style.display = 'block';
      (el.querySelector('#demo-narration-title') as HTMLElement).textContent = title;
      (el.querySelector('#demo-narration-sub') as HTMLElement).textContent = subtext;
    },

    clearNarration() {
      const el = document.getElementById('demo-narration');
      if (el) el.style.display = 'none';
    },

    setChromeVisible(visible) { setChromeHidden(!visible); },

    probeDown(x, z) { return hooks.probeDown(x, z); },

    getBridgeDiag() { return hooks.getBridgeDiag(); },
    getMatchDiag() { return hooks.getMatchDiag(); },

    getRenderStats() {
      const renderer = hooks.getRenderer();
      if (!renderer) return null;
      const scene = hooks.getScene();

      let litCasters = 0, litReceivers = 0, unlitExcluded = 0, toneMappedUnlit = 0;
      let shadowLights = 0;
      let shadowCam: DemoRenderStats['shadowCamera'] = null;
      let shadowMapSize: DemoRenderStats['shadowMapSize'] = null;

      scene.traverse((obj) => {
        const dl = obj as THREE.DirectionalLight;
        if (dl.isDirectionalLight && dl.castShadow) {
          shadowLights++;
          if (!shadowCam) {
            const c = dl.shadow.camera;
            shadowCam = { left: c.left, right: c.right, top: c.top, bottom: c.bottom, near: c.near, far: c.far };
            shadowMapSize = { width: dl.shadow.mapSize.width, height: dl.shadow.mapSize.height };
          }
        }

        const matRaw = (obj as Partial<THREE.Mesh>).material;
        if (!matRaw) return;
        const mats = Array.isArray(matRaw) ? matRaw : [matRaw];

        /* Mirror shadowPolicy's own test rather than re-deriving it: an object
           counts as unlit if ANY slot is unlit, which is how the policy decides. */
        const unlit = mats.some((m) =>
          (m as THREE.MeshBasicMaterial).isMeshBasicMaterial === true ||
          (m as THREE.ShaderMaterial).isShaderMaterial === true ||
          (m as THREE.SpriteMaterial).isSpriteMaterial === true ||
          (m as THREE.LineBasicMaterial).isLineBasicMaterial === true ||
          (m as THREE.PointsMaterial).isPointsMaterial === true);

        if (unlit || (obj as Partial<THREE.Mesh>).isMesh !== true) {
          unlitExcluded++;
          if (mats.some((m) => m.toneMapped)) toneMappedUnlit++;
        } else {
          if (obj.castShadow)    litCasters++;
          if (obj.receiveShadow) litReceivers++;
        }
      });

      return {
        toneMapping:         renderer.toneMapping,
        toneMappingExposure: renderer.toneMappingExposure,
        outputColorSpace:    renderer.outputColorSpace,
        shadowMapEnabled:    renderer.shadowMap.enabled,
        shadowMapType:       renderer.shadowMap.type,
        environmentSet:      scene.environment !== null,
        environmentIntensity: scene.environmentIntensity,
        litCasters, litReceivers, unlitExcluded, toneMappedUnlit,
        shadowLights, shadowCamera: shadowCam, shadowMapSize,
      };
    },

    waitForRest(speed = 2, timeoutMs = 8000) {
      return new Promise<boolean>((resolve) => {
        const t0 = performance.now();
        const poll = (): void => {
          const s = hooks.getBeyState();
          if (!s || !s.spawned) return resolve(false);
          if (s.speed <= speed && s.grounded) return resolve(true);
          if (performance.now() - t0 > timeoutMs) return resolve(false);
          requestAnimationFrame(poll);
        };
        requestAnimationFrame(poll);
      });
    },
  };

  (window as unknown as { __demo: DemoApi }).__demo = api;
}

/* Re-exported so the host screen can build hook closures without duplicating
   the Vector3 <-> plain-object conversion. */
export const demoVec = { v3, toDemoVec };

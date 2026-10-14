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

  /** Resolves once the bey's |velocity| drops below `speed`, or on timeout. */
  waitForRest(speed?: number, timeoutMs?: number): Promise<boolean>;
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

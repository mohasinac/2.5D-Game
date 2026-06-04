import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SandboxSprites } from '../utils/SandboxSprites';

export interface SandboxOptions {
  title:      string;
  accentHex:  number;
  onBack:     () => void;
  /** Total grid side length in cm (= Three.js world units). */
  gridSize:   number;
  /** Number of cells per side (cell size = gridSize / gridDivs cm). */
  gridDivs:   number;
  /** Place a numeric tick label every N cm along X and Z. */
  tickEvery:  number;
  /** Label from -tickRange to +tickRange cm. */
  tickRange:  number;
  /** Default camera position in cm. */
  defaultCam: { x: number; y: number; z: number };
  /** Camera frustum far plane in cm. */
  camFar:     number;
  /** OrbitControls min/max distance in cm. */
  minZoom:    number;
  maxZoom:    number;
  /** Lift the axes helper and labels to this Y (cm) so they sit above the scene floor, not inside geometry. Default 0. */
  axisYOffset?: number;
}

interface SavedView {
  camX: number; camY: number; camZ: number;
  tgtX: number; tgtY: number; tgtZ: number;
}

const DEFAULT_TGT = { x: 0, y: 0, z: 0 } as const;

export class Sandbox {
  private el: HTMLElement;
  private canvasWrap: HTMLDivElement;
  private topBar!: HTMLElement;
  private overlayEl!: HTMLElement;
  private readonly storageKey: string;

  private scene:    THREE.Scene | null = null;
  private camera:   THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private controls: OrbitControls | null = null;

  private savedTarget = new THREE.Vector3();
  private rafId = 0;
  private ro: ResizeObserver;
  private textures: THREE.Texture[] = [];

  constructor(container: HTMLElement, private readonly opts: SandboxOptions) {
    this.storageKey = `bey_view_${opts.title.toLowerCase().replace(/\s+/g, '_')}`;

    this.el = document.createElement('div');
    this.el.className = 'screen sandbox-screen hidden';

    this.canvasWrap = document.createElement('div');
    this.canvasWrap.className = 'sandbox-canvas-wrap';
    this.el.appendChild(this.canvasWrap);

    const overlay = document.createElement('div');
    overlay.className = 'sandbox-overlay';
    overlay.innerHTML = `
      <div class="sandbox-top-bar">
        <button class="game-btn back-btn"  id="sb-back">← Back</button>
        <span  class="sandbox-title">${opts.title}</span>
        <button class="game-btn reset-btn" id="sb-reset" title="Reset camera view to default">↺ View</button>
      </div>
      <div class="sandbox-hint">Orbit · Left drag &nbsp;|&nbsp; Pan · Right drag &nbsp;|&nbsp; Zoom · Scroll</div>
    `;
    this.el.appendChild(overlay);
    container.appendChild(this.el);

    this.overlayEl = overlay;
    this.topBar = overlay.querySelector('.sandbox-top-bar')!;
    overlay.querySelector('#sb-back')!.addEventListener('click',  () => opts.onBack());
    overlay.querySelector('#sb-reset')!.addEventListener('click', () => this.resetView());

    this.ro = new ResizeObserver(() => this.resize());
  }

  /** Append a button to the top bar. Subclasses call this in their constructor. */
  protected addTopBarButton(label: string, title = ''): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className   = 'game-btn';
    btn.textContent = label;
    btn.title       = title;
    this.topBar.appendChild(btn);
    return btn;
  }

  /** Add / remove objects from the live scene. Safe to call before scene is ready (no-op). */
  protected addToScene(...objects: THREE.Object3D[]): void {
    objects.forEach(o => this.scene?.add(o));
  }
  protected removeFromScene(...objects: THREE.Object3D[]): void {
    objects.forEach(o => this.scene?.remove(o));
  }

  /** Create and append a panel div inside the overlay. Subclasses use this for side panels. */
  protected addOverlayPanel(className: string): HTMLDivElement {
    const panel = document.createElement('div');
    panel.className = className;
    this.overlayEl.appendChild(panel);
    return panel;
  }

  /* ── Scene + camera: created once ──────────────────────────── */
  private initScene(): void {
    if (this.scene) return;

    this.scene = new THREE.Scene();

    const { defaultCam: dc, camFar } = this.opts;
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, camFar);
    this.camera.position.set(dc.x, dc.y, dc.z);
    this.camera.lookAt(0, 0, 0);

    this.buildScene();
  }

  /* ── Renderer + controls: fresh on each show ────────────────── */
  private mountRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x08080f);
    this.canvasWrap.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera!, this.renderer.domElement);
    this.controls.enableDamping      = true;
    this.controls.dampingFactor      = 0.07;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance        = this.opts.minZoom;
    this.controls.maxDistance        = this.opts.maxZoom;
    this.controls.mouseButtons = {
      LEFT:   THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT:  THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    this.loadView();
    this.lastFrameTime = 0;
  }

  private unmountRenderer(): void {
    this.saveView();
    if (this.controls) {
      this.savedTarget.copy(this.controls.target);
      this.controls.dispose();
      this.controls = null;
    }
    if (this.renderer) {
      this.renderer.domElement.remove();
      this.renderer.dispose();
      this.renderer = null;
    }
  }

  /* ── localStorage ───────────────────────────────────────────── */
  private saveView(): void {
    if (!this.camera || !this.controls) return;
    const d: SavedView = {
      camX: this.camera.position.x, camY: this.camera.position.y, camZ: this.camera.position.z,
      tgtX: this.controls.target.x, tgtY: this.controls.target.y, tgtZ: this.controls.target.z,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(d));
  }

  private loadView(): void {
    if (!this.camera || !this.controls) return;
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const d = JSON.parse(raw) as SavedView;
      this.camera.position.set(d.camX, d.camY, d.camZ);
      this.controls.target.set(d.tgtX, d.tgtY, d.tgtZ);
      this.controls.update();
    } catch { /* corrupted */ }
  }

  resetView(): void {
    localStorage.removeItem(this.storageKey);
    const { defaultCam: dc } = this.opts;
    this.camera?.position.set(dc.x, dc.y, dc.z);
    if (this.controls) {
      this.controls.target.set(DEFAULT_TGT.x, DEFAULT_TGT.y, DEFAULT_TGT.z);
      this.controls.update();
    }
    this.savedTarget.set(DEFAULT_TGT.x, DEFAULT_TGT.y, DEFAULT_TGT.z);
  }

  /* ── Extension hook — subclasses add their geometry here ─────── */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected buildCustom(_scene: THREE.Scene): void { /* overridden by subclasses */ }

  /* ── Scene content ──────────────────────────────────────────── */
  private buildScene(): void {
    const s = this.scene!;
    const { gridSize, gridDivs, tickEvery, tickRange, accentHex: accent } = this.opts;

    /* Ground grid (XZ) */
    s.add(new THREE.GridHelper(gridSize, gridDivs, accent, 0x2a2a4a));

    /* Subtle vertical guide grid (XY plane) */
    const gridXY = new THREE.GridHelper(gridSize, gridDivs, 0x2a2a4a, 0x1a1a2e);
    gridXY.rotation.x = Math.PI / 2;
    gridXY.position.set(0, gridSize / 2, -gridSize / 2);
    s.add(gridXY);

    /* Axes: sized at 25% of half-grid, lifted to axisYOffset so they sit above the scene floor */
    const axisLen = (gridSize / 2) * 0.25;
    const axisOY  = this.opts.axisYOffset ?? 0;
    const axisGrp = new THREE.Group();
    axisGrp.position.set(0, axisOY, 0);
    axisGrp.add(new THREE.AxesHelper(axisLen));
    s.add(axisGrp);

    /* Axis end-labels */
    const labelDist = (gridSize / 2) * 0.32;
    SandboxSprites.addAxisLabel(s, 'X', new THREE.Vector3(labelDist,       axisOY + axisLen * 0.1, 0         ), '#ff4d4d', this.textures);
    SandboxSprites.addAxisLabel(s, 'Y', new THREE.Vector3(axisLen * 0.1,   axisOY + labelDist,     0         ), '#4dff88', this.textures);
    SandboxSprites.addAxisLabel(s, 'Z', new THREE.Vector3(0,               axisOY + axisLen * 0.1, labelDist ), '#4db8ff', this.textures);

    /* Axis label sprite scale: 7% of half-grid */
    const labelScale = (gridSize / 2) * 0.07;
    SandboxSprites.setLastSpriteScale(s, labelScale);
    SandboxSprites.setLastSpriteScale(s, labelScale);
    SandboxSprites.setLastSpriteScale(s, labelScale);

    /* Grid tick numbers */
    const tickOffset = Math.max(0.1, gridSize * 0.018);
    SandboxSprites.addGridTicks(s, tickEvery, tickRange, tickOffset, gridSize, this.textures);

    /* Origin sphere — 1 mm (0.1 unit) or 0.1% of gridSize, whichever larger */
    const originR = Math.max(0.1, gridSize * 0.001);
    s.add(new THREE.Mesh(
      new THREE.SphereGeometry(originR, 12, 12),
      new THREE.MeshBasicMaterial({ color: accent }),
    ));

    /* Lights */
    s.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(gridSize * 0.3, gridSize * 0.5, gridSize * 0.3);
    s.add(dir);

    const ptRange = gridSize * 0.2;
    const pt = new THREE.PointLight(accent, 2, ptRange);
    pt.position.set(0, gridSize * 0.05, 0);
    s.add(pt);

    this.buildCustom(s);
  }

  /* ── Resize ─────────────────────────────────────────────────── */
  private resize(): void {
    if (!this.renderer || !this.camera) return;
    const w = this.canvasWrap.clientWidth;
    const h = this.canvasWrap.clientHeight;
    if (w === 0 || h === 0) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /** Per-frame hook for subclasses (e.g. animation). Called before render. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onTick(_dtMs: number): void {}

  /* ── Render loop — self-heals canvas size every frame ───────── */
  private lastFrameTime = 0;
  private loop = (now: number): void => {
    this.rafId = requestAnimationFrame(this.loop);
    const dt = this.lastFrameTime ? now - this.lastFrameTime : 0;
    this.lastFrameTime = now;
    const w = this.canvasWrap.clientWidth;
    const h = this.canvasWrap.clientHeight;
    if (w === 0 || h === 0) return;
    const renderer = this.renderer!;
    const c = renderer.domElement;
    if (c.width !== w || c.height !== h) {
      renderer.setSize(w, h, false);
      this.camera!.aspect = w / h;
      this.camera!.updateProjectionMatrix();
    }
    this.onTick(dt);
    this.controls!.update();
    renderer.render(this.scene!, this.camera!);
  };

  /* ── Visibility ─────────────────────────────────────────────── */
  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
    if (v) {
      this.initScene();
      this.mountRenderer();
      this.ro.observe(this.canvasWrap);
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      cancelAnimationFrame(this.rafId);
      this.ro.disconnect();
      this.unmountRenderer();
    }
  }

  /* ── Full teardown ──────────────────────────────────────────── */
  dispose(): void {
    cancelAnimationFrame(this.rafId);
    this.ro.disconnect();
    this.unmountRenderer();

    this.scene?.traverse((obj) => {
      const o = obj as THREE.Mesh;
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const mat of mats) {
          for (const val of Object.values(mat as unknown as Record<string, unknown>)) {
            if (val instanceof THREE.Texture) val.dispose();
          }
          mat.dispose();
        }
      }
    });

    for (const tex of this.textures) tex.dispose();
    this.textures.length = 0;
    this.scene  = null;
    this.camera = null;
    this.el.remove();
  }
}

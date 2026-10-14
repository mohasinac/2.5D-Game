import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SandboxSprites } from '../utils/SandboxSprites';
import { CameraManager } from '../features/managers/CameraManager';
import { createCameraViewStore } from '../stores/cameraViewStore';
import { DrawerManager } from '../utils/DrawerManager';
import { layoutObserver } from '../utils/LayoutObserver';
import { SimClock } from '../sim/SimClock';
import { mountEnvironment, unmountEnvironment } from '../render/environment';
import { applyRenderPolicy } from '../render/shadowPolicy';

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

export class Sandbox {
  protected el: HTMLElement;
  private canvasWrap: HTMLDivElement;
  private topBar!: HTMLElement;
  private overlayEl!: HTMLElement;
  protected readonly storageKey: string;

  private scene:    THREE.Scene | null = null;
  private camera:   THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private controls: OrbitControls | null = null;

  /** Prefiltered IBL cubemap. Lives and dies with the renderer, not the scene. */
  private envTexture: THREE.Texture | null = null;

  /**
   * The one shadow-casting light. Kept as a field so the shadow frustum can be
   * fitted in `buildScene` from `gridSize` rather than hardcoded — a 15 cm bey
   * viewport and a 200 cm arena viewport need frusta an order of magnitude apart.
   */
  private shadowLight: THREE.DirectionalLight | null = null;

  /**
   * Deterministic sim clock, owned by the base class because the render loop is
   * what advances it. Subclasses pass this into their managers via SceneContext
   * — they must not create their own, or simulation time would fork.
   */
  protected readonly simClock = new SimClock();

  protected cameraManager: CameraManager | null = null;
  protected _drawerMgr!: DrawerManager;
  private _layoutUnsub: (() => void) | null = null;

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
        <button class="game-btn drawer-btn" id="sb-tree"  title="Scene Tree">☰</button>
        <button class="game-btn back-btn"   id="sb-back">← Back</button>
        <span  class="sandbox-title">${opts.title}</span>
        <button class="game-btn reset-btn"  id="sb-reset" title="Reset camera view to default">↺ View</button>
        <button class="game-btn" id="sb-props" title="Toggle properties panel">⚙</button>
      </div>
      <div class="sandbox-hint">Orbit · Left drag &nbsp;|&nbsp; Pan · Right drag &nbsp;|&nbsp; Zoom · Scroll</div>
    `;
    this.el.appendChild(overlay);
    container.appendChild(this.el);

    this.overlayEl = overlay;
    this.topBar = overlay.querySelector('.sandbox-top-bar')!;
    overlay.querySelector('#sb-back')!.addEventListener('click',  () => opts.onBack());
    overlay.querySelector('#sb-reset')!.addEventListener('click', () => this.resetView());

    this._drawerMgr = new DrawerManager(this.el);
    overlay.querySelector('#sb-tree')!.addEventListener('click',  () => this._drawerMgr.toggleLeft());
    overlay.querySelector('#sb-props')!.addEventListener('click', () => this._drawerMgr.toggleRight());

    this._layoutUnsub = layoutObserver.onChange(mode => {
      if (mode === 'desktop' || mode === 'tablet') this._drawerMgr.closeAll();
    });

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

  /** Returns the active scene, or null if not yet mounted. */
  protected getScene(): THREE.Scene | null { return this.scene; }

  /** Returns the active camera, or null if not yet mounted. */
  public getCamera(): THREE.PerspectiveCamera | null { return this.camera; }
  /** Returns the active OrbitControls, or null if not yet mounted. */
  public getControls(): OrbitControls | null { return this.controls; }
  /** Returns the renderer canvas element, or null if not yet mounted. */
  public getRendererCanvas(): HTMLCanvasElement | null { return this.renderer?.domElement ?? null; }

  /**
   * The live renderer, or null before the first mount.
   *
   * Exposed only so the dev-only demo API can report tone-mapping / shadow /
   * environment state (`__demo.getRenderStats()`). Do not render through this
   * or hold it across a `setVisible` cycle — the renderer is recreated on every
   * mount, so a retained reference points at a destroyed GL context.
   */
  public getRenderer(): THREE.WebGLRenderer | null { return this.renderer; }

  /** Add / remove objects from the live scene. Safe to call before scene is ready (no-op). */
  protected addToScene(...objects: THREE.Object3D[]): void {
    objects.forEach(o => {
      /* One of the project's two scene-add funnels — this one carries arenas,
         pits, zones and the octagon base, which RenderManager does not own yet.
         The policy has to be applied here or the bowl receives no shadow and
         every edge line gets tone-mapped. See render/shadowPolicy.ts. */
      applyRenderPolicy(o);
      this.scene?.add(o);
    });
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

    /* Tone mapping + colour space.
       `NoToneMapping` (the previous default) clips every highlight, which is the
       documented cause of the washed-out look. ACES is the filmic curve the rest
       of the industry uses and it rolls highlights off instead of cutting them.
       `outputColorSpace` already defaults to sRGB in r165 but is set explicitly
       because getting it wrong is invisible until the PBR textures land, and by
       then the symptom looks like a texture bug rather than a renderer setting.

       Diagram elements (grids, edge lines, axis sprites, the accent origin
       marker) opt OUT of this curve via `applyRenderPolicy` — without that, ACES
       desaturates the authored cyan/orange palette. */
    this.renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace   = THREE.SRGBColorSpace;

    /* PCFSoft over the default basic shadow map: the hard variant aliases badly
       on curved bowl surfaces, which is most of this project's geometry. */
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

    this.canvasWrap.appendChild(this.renderer.domElement);

    /* Per-mount, because a PMREM cubemap belongs to this renderer's GL context
       (see render/environment.ts). Must happen before the first frame or the
       standard materials render one frame unlit. */
    this.envTexture = mountEnvironment(this.renderer, this.scene!);

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

    this.cameraManager = new CameraManager(
      () => this.camera,
      () => this.controls,
      createCameraViewStore(this.storageKey),
      this.opts.defaultCam,
    );
    this.cameraManager.load();
    this.lastFrameTime = 0;
  }

  private unmountRenderer(): void {
    this.cameraManager?.save();
    this.cameraManager = null;
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    if (this.renderer) {
      /* Before the renderer, not after: the environment map is a render target
         owned by this context. */
      unmountEnvironment(this.scene!, this.envTexture);
      this.envTexture = null;

      this.renderer.domElement.remove();
      this.renderer.dispose();
      this.renderer = null;
    }
  }

  resetView(): void {
    this.cameraManager?.reset();
    if (!this.cameraManager) {
      // fallback when called before first mount
      const { defaultCam: dc } = this.opts;
      this.camera?.position.set(dc.x, dc.y, dc.z);
      if (this.controls) { this.controls.target.set(0, 0, 0); this.controls.update(); }
    }
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

    /* Lights.
       Ambient drops from 0.5 to 0.25 because the environment map now supplies
       indirect light, and doing both at full strength double-counts it —
       everything goes flat and shadows read as grey smudges. */
    s.add(new THREE.AmbientLight(0xffffff, 0.25));

    /* Key light, deliberately OFF the default camera axis.
       It used to sit at (+0.3, +0.5, +0.3)·gridSize — the same octant as both
       sandboxes' default cameras (arena (150,100,175), bey (12,8,14)). Light
       and eye pointing the same way means every cast shadow falls directly
       behind its own caster and is hidden by it, so the scene renders shadows
       that are essentially never visible. Proven with a two-scale control
       scene: identical parameters showed no shadow from a camera beside the
       light and a clear one from a camera opposite it.
       Now keyed from the left and slightly front, so shadows fall across the
       view instead of away from it, while the camera-facing +z faces stay lit. */
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(-gridSize * 0.40, gridSize * 0.62, gridSize * 0.32);
    dir.castShadow = true;
    this.shadowLight = dir;

    /* A directional light's shadow camera is orthographic and does NOT follow
       the scene — an unfitted frustum is the usual reason shadows appear only
       near the origin, or not at all. Half-extent covers the full grid with
       margin for walls standing above it and for off-centre arenas.

       Everything is derived from gridSize because the two sandboxes differ by
       more than 13x (15 cm vs 200 cm), and CLAUDE.md forbids hardcoding
       proportional scene values. */
    const half = gridSize * 0.75;
    const cam  = dir.shadow.camera;
    cam.left = -half; cam.right = half;
    cam.top  =  half; cam.bottom = -half;
    cam.near = gridSize * 0.05;
    cam.far  = gridSize * 3;
    cam.updateProjectionMatrix();

    /* 2048 on desktop, 1024 where the pointer is coarse. A 2048 map is ~16 MB
       of VRAM; mobile already struggles here (the vmin layout collapse is
       documented in _responsive.css) and shadow resolution is not what makes
       or breaks the look on a 390 px viewport. Matches the same desktop test
       the virtual-controls overlay uses. */
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    dir.shadow.mapSize.setScalar(isDesktop ? 2048 : 1024);

    /* normalBias in world units, so it must scale with the scene. Plain `bias`
       alone cannot fix acne across a 13x scale difference: at arena scale a
       value large enough to clear the bowl surface detaches shadows entirely at
       bey scale. Offsetting along the normal is scale-relative and does not. */
    dir.shadow.normalBias = gridSize * 0.002;
    dir.shadow.bias       = -0.0005;

    s.add(dir);

    const ptRange = gridSize * 0.2;
    const pt = new THREE.PointLight(accent, 2, ptRange);
    pt.position.set(0, gridSize * 0.05, 0);
    s.add(pt);

    this.buildCustom(s);

    /* Everything added above this line — grids, axes, ticks, origin marker, and
       whatever buildCustom built — goes through the policy once. Objects added
       later arrive via addToScene/RenderManager.add, which apply it themselves. */
    for (const child of [...s.children]) applyRenderPolicy(child);
  }

  /**
   * The shadow-casting directional light, for subclasses that need to retarget
   * it (e.g. an arena placed far off-origin would otherwise sit outside the
   * fitted frustum). Null until `initScene` has run.
   */
  protected getShadowLight(): THREE.DirectionalLight | null { return this.shadowLight; }

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

  /* ── Demo / test determinism hooks ───────────────────────────
     Physics normally steps on whatever dt rAF hands it, so the same scenario
     never replays identically. A fixed timestep makes demos reproducible and
     lets them assert on physics outcomes rather than just "something moved".
     Frozen means dt = 0: rendering and OrbitControls keep working, simulation
     does not advance. Only the demo runner touches these. */
  private _fixedDtMs: number | null = null;
  private _frozen = false;
  private _stepFrames = 0;

  setFixedTimestep(ms: number | null): void { this._fixedDtMs = ms; }
  freezeLoop(): void { this._frozen = true; this._stepFrames = 0; }
  resumeLoop(): void { this._frozen = false; this._stepFrames = 0; }
  stepLoop(frames = 1): void { this._stepFrames += Math.max(1, frames); }

  /* ── Fixed-timestep simulation ────────────────────────────────
     Simulation steps at a constant FIXED_DT_MS regardless of frame rate.
     rAF delivers a variable real dt; we accumulate it and drain it in fixed
     steps, so the same scenario advances through identical steps on a 60 Hz
     and a 144 Hz display.

     Why this replaced a plain dt pass-through: `setFixedTimestep` was only a dt
     *override* used by the demo runner, so production always ran variable-dt
     and nothing was reproducible. It also meant SpawnManager's internal
     `Math.min(dtMs, 50)` clamp silently slowed the simulation below 20 fps
     instead of catching up.

     MAX_STEPS_PER_FRAME stops the "spiral of death": if a frame takes very long
     (tab backgrounded, GC pause), we drop the backlog rather than running
     hundreds of steps and falling further behind. Dropped time is acknowledged,
     not silently absorbed. */
  private static readonly FIXED_DT_MS = 1000 / 60;
  private static readonly MAX_STEPS_PER_FRAME = 5;
  private lastFrameTime = 0;
  private _accumulatorMs = 0;

  private loop = (now: number): void => {
    this.rafId = requestAnimationFrame(this.loop);

    const realDt = this.lastFrameTime ? now - this.lastFrameTime : 0;
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

    // How much simulated time this frame is allowed to advance.
    // _fixedDtMs (demo runner) pins it; frozen yields 0 unless stepping.
    let advanceMs = this._fixedDtMs !== null ? this._fixedDtMs : realDt;
    if (this._frozen) {
      if (this._stepFrames > 0) { this._stepFrames--; advanceMs = Sandbox.FIXED_DT_MS; }
      else advanceMs = 0;
    }

    const step = Sandbox.FIXED_DT_MS;
    this._accumulatorMs += Number.isFinite(advanceMs) && advanceMs > 0 ? advanceMs : 0;

    let steps = 0;
    while (this._accumulatorMs >= step && steps < Sandbox.MAX_STEPS_PER_FRAME) {
      this.simClock.advance(step);
      this.onTick(step);
      this.cameraManager?.tick(step);
      this._accumulatorMs -= step;
      steps++;
    }
    if (steps === Sandbox.MAX_STEPS_PER_FRAME) this._accumulatorMs = 0;  // drop backlog

    // Controls and render run once per frame, never per sim step.
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
    this._layoutUnsub?.();
    this._layoutUnsub = null;
    this._drawerMgr.destroy();
    this.el.remove();
  }
}

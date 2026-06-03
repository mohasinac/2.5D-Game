import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface SandboxOptions {
  title: string;
  accentHex: number;
  onBack: () => void;
}

export class Sandbox {
  private el: HTMLElement;
  private canvasWrap: HTMLDivElement;

  /* Scene + camera persist across visits; renderer is torn down on hide */
  private scene:    THREE.Scene | null = null;
  private camera:   THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private controls: OrbitControls | null = null;

  /* Remembered between renderer teardown/rebuild so orbit state is kept */
  private savedTarget = new THREE.Vector3();

  private rafId = 0;
  private ro: ResizeObserver;
  private textures: THREE.Texture[] = [];

  constructor(container: HTMLElement, private readonly opts: SandboxOptions) {
    this.el = document.createElement('div');
    this.el.className = 'screen sandbox-screen hidden';

    this.canvasWrap = document.createElement('div');
    this.canvasWrap.className = 'sandbox-canvas-wrap';
    this.el.appendChild(this.canvasWrap);

    const overlay = document.createElement('div');
    overlay.className = 'sandbox-overlay';
    overlay.innerHTML = `
      <div class="sandbox-top-bar">
        <button class="game-btn back-btn" id="sb-back">← Back</button>
        <span class="sandbox-title">${opts.title}</span>
      </div>
      <div class="sandbox-hint">Orbit · Left drag &nbsp;|&nbsp; Pan · Right drag &nbsp;|&nbsp; Zoom · Scroll</div>
    `;
    this.el.appendChild(overlay);
    container.appendChild(this.el);

    overlay.querySelector('#sb-back')!.addEventListener('click', () => opts.onBack());

    this.ro = new ResizeObserver(() => this.resize());
  }

  /* ── Scene + camera: created once, never destroyed until dispose() ── */
  private initScene(): void {
    if (this.scene) return;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x08080f, 0.018);

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    this.camera.position.set(60, 40, 70);
    this.camera.lookAt(0, 0, 0);

    this.buildScene(this.opts.accentHex);
  }

  /* ── Renderer + controls: created on show, destroyed on hide ───────
   * Only ONE WebGL context is ever alive at a time across all sandboxes. */
  private mountRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x08080f);
    this.canvasWrap.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera!, this.renderer.domElement);
    this.controls.enableDamping    = true;
    this.controls.dampingFactor    = 0.07;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance      = 0.5;
    this.controls.maxDistance      = 500;
    this.controls.target.copy(this.savedTarget);   /* restore orbit target */
    this.controls.update();
    this.controls.mouseButtons = {
      LEFT:   THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT:  THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
  }

  private unmountRenderer(): void {
    /* Save orbit target so next visit restores the same view */
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

  /* ── Scene content ─────────────────────────────────────────────── */
  private buildScene(accent: number): void {
    const s = this.scene!;

    /* Ground grid: 100 cm × 100 cm, 1 cm per cell */
    s.add(new THREE.GridHelper(100, 100, accent, 0x1a1a2e));

    /* Subtle vertical XY guide */
    const gridXY = new THREE.GridHelper(100, 100, 0x1a1a2e, 0x111120);
    gridXY.rotation.x = Math.PI / 2;
    gridXY.position.set(0, 50, 0);
    s.add(gridXY);

    /* Axes: X=red Y=green Z=blue, 10 cm */
    s.add(new THREE.AxesHelper(10));

    /* Labels at 12 cm */
    this.addAxisLabel('X', new THREE.Vector3(12, 0.5, 0),  '#ff4d4d');
    this.addAxisLabel('Y', new THREE.Vector3(0.5, 12, 0),  '#4dff88');
    this.addAxisLabel('Z', new THREE.Vector3(0,   0.5, 12), '#4db8ff');

    /* Origin sphere — 1 mm radius */
    const geo = new THREE.SphereGeometry(0.1, 12, 12);
    const mat = new THREE.MeshBasicMaterial({ color: accent });
    s.add(new THREE.Mesh(geo, mat));

    /* Lights */
    s.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(30, 50, 30);
    s.add(dir);

    const pt = new THREE.PointLight(accent, 1.5, 20);
    pt.position.set(0, 5, 0);
    s.add(pt);
  }

  private addAxisLabel(text: string, pos: THREE.Vector3, color: string): void {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.font = 'bold 48px Orbitron, monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);

    const tex = new THREE.CanvasTexture(canvas);
    this.textures.push(tex);

    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(pos);
    sprite.scale.set(0.7, 0.7, 0.7);
    this.scene!.add(sprite);
  }

  private resize(): void {
    if (!this.renderer || !this.camera) return;
    const w = this.canvasWrap.clientWidth;
    const h = this.canvasWrap.clientHeight;
    if (w === 0 || h === 0) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private loop = (): void => {
    this.rafId = requestAnimationFrame(this.loop);
    this.controls!.update();
    this.renderer!.render(this.scene!, this.camera!);
  };

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
    if (v) {
      this.initScene();           /* no-op after first visit */
      this.mountRenderer();       /* fresh GL context */
      this.ro.observe(this.canvasWrap);
      this.resize();
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      cancelAnimationFrame(this.rafId);
      this.ro.disconnect();
      this.unmountRenderer();     /* GL context freed immediately */
    }
  }

  /* ── Full teardown — call when permanently removing this sandbox ── */
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

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface SandboxOptions {
  title: string;
  accentHex: number;
  onBack: () => void;
}

export class Sandbox {
  private el: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private rafId = 0;
  private ro: ResizeObserver;

  constructor(container: HTMLElement, opts: SandboxOptions) {
    /* ── Root element ─────────────────────────────────────────── */
    this.el = document.createElement('div');
    this.el.className = 'screen sandbox-screen hidden';

    /* ── Canvas wrapper ───────────────────────────────────────── */
    const canvasWrap = document.createElement('div');
    canvasWrap.className = 'sandbox-canvas-wrap';
    this.el.appendChild(canvasWrap);

    /* ── UI overlay ───────────────────────────────────────────── */
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

    /* ── Three.js renderer ────────────────────────────────────── */
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x08080f);
    canvasWrap.appendChild(this.renderer.domElement);

    /* ── Scene ────────────────────────────────────────────────── */
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x08080f, 0.018);

    /* ── Camera ───────────────────────────────────────────────── */
    /* near = 1 mm, far = 1000 cm. Default view: ~60 cm back, ~40 cm up */
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    this.camera.position.set(60, 40, 70);
    this.camera.lookAt(0, 0, 0);

    /* ── Orbit controls ───────────────────────────────────────── */
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 200;
    this.controls.mouseButtons = {
      LEFT:   THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT:  THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE:  THREE.TOUCH.ROTATE,
      TWO:  THREE.TOUCH.DOLLY_PAN,
    };

    /* ── Scene content ────────────────────────────────────────── */
    this.buildScene(opts.accentHex);

    /* ── Resize ───────────────────────────────────────────────── */
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvasWrap);
    this.resize();
  }

  private buildScene(accent: number): void {
    /* Scale convention: 1 world unit = 1 cm, 0.1 units = 1 mm minimum.
     * Ground grid: 100 cm × 100 cm, 1 cm per cell. */
    const gridXZ = new THREE.GridHelper(100, 100, accent, 0x1a1a2e);
    this.scene.add(gridXZ);

    /* Vertical guide grid XY-plane (subtle), 100 cm tall */
    const gridXY = new THREE.GridHelper(100, 100, 0x1a1a2e, 0x111120);
    gridXY.rotation.x = Math.PI / 2;
    gridXY.position.set(0, 50, 0);
    this.scene.add(gridXY);

    /* Axes helper: X=red, Y=green, Z=blue — 10 cm long */
    const axes = new THREE.AxesHelper(10);
    this.scene.add(axes);

    /* Axis label sprites at 12 cm out */
    this.addAxisLabel('X', new THREE.Vector3(12, 0.5, 0), '#ff4d4d');
    this.addAxisLabel('Y', new THREE.Vector3(0.5, 12, 0), '#4dff88');
    this.addAxisLabel('Z', new THREE.Vector3(0, 0.5, 12), '#4db8ff');

    /* Origin marker — 1 mm radius */
    const originGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const originMat = new THREE.MeshBasicMaterial({ color: accent });
    this.scene.add(new THREE.Mesh(originGeo, originMat));

    /* Ambient + directional light */
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(30, 50, 30);
    this.scene.add(dir);

    /* Accent point light at origin — 20 cm radius */
    const pt = new THREE.PointLight(accent, 1.5, 20);
    pt.position.set(0, 5, 0);
    this.scene.add(pt);
  }

  private addAxisLabel(text: string, pos: THREE.Vector3, color: string): void {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 64, 64);
    ctx.font = 'bold 48px Orbitron, monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(pos);
    sprite.scale.set(0.7, 0.7, 0.7);
    this.scene.add(sprite);
  }

  private resize(): void {
    const wrap = this.renderer.domElement.parentElement!;
    const w = wrap.clientWidth || 1;
    const h = wrap.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private loop = (): void => {
    this.rafId = requestAnimationFrame(this.loop);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
    if (v) {
      this.resize();
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      cancelAnimationFrame(this.rafId);
    }
  }

  dispose(): void {
    cancelAnimationFrame(this.rafId);
    this.ro.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
    this.el.remove();
  }
}

import './styles/global.css';
import { LandingScreen } from './screens/LandingScreen';
import { Sandbox } from './screens/Sandbox';

/* ── App ─────────────────────────────────────────────────────────────────── */
type ScreenId = 'landing' | 'beyblade' | 'arena';

class App {
  private current: ScreenId = 'landing';
  private landing: LandingScreen;
  private beyblade: Sandbox;
  private arena: Sandbox;

  constructor() {
    const root = document.getElementById('app')!;

    this.landing = new LandingScreen(root, {
      onBeyblade: () => this.go('beyblade'),
      onArena:    () => this.go('arena'),
    });

    this.beyblade = new Sandbox(root, {
      title:     'Beyblade Sandbox',
      accentHex: 0x00e5ff,
      onBack:    () => this.go('landing'),
    });

    this.arena = new Sandbox(root, {
      title:     'Arena Sandbox',
      accentHex: 0xff6b35,
      onBack:    () => this.go('landing'),
    });

    this.mountGlobalControls(root);
    this.go('landing');
  }

  private go(id: ScreenId): void {
    this.current = id;
    this.landing.setVisible(id === 'landing');
    this.beyblade.setVisible(id === 'beyblade');
    this.arena.setVisible(id === 'arena');
  }

  /* ── Scale controls + fullscreen ──────────────────────────────────── */
  private mountGlobalControls(root: HTMLElement): void {
    let scale = 1;
    const STEP = 0.1;
    const MIN  = 0.5;
    const MAX  = 2.0;

    const setScale = (v: number) => {
      scale = Math.min(MAX, Math.max(MIN, +v.toFixed(2)));
      document.documentElement.style.setProperty('--ui-scale', String(scale));
    };

    /* Scale controls */
    const ctrl = document.createElement('div');
    ctrl.className = 'global-controls';
    ctrl.innerHTML = `
      <button class="ctrl-btn" id="scale-down" title="Decrease UI size">−</button>
      <button class="ctrl-btn" id="scale-reset" title="Reset UI size">○</button>
      <button class="ctrl-btn" id="scale-up" title="Increase UI size">+</button>
    `;
    root.appendChild(ctrl);

    ctrl.querySelector('#scale-down')!.addEventListener('click', () => setScale(scale - STEP));
    ctrl.querySelector('#scale-up')!.addEventListener('click',   () => setScale(scale + STEP));
    ctrl.querySelector('#scale-reset')!.addEventListener('click', () => setScale(1));

    /* Fullscreen button */
    const fsBtn = document.createElement('button');
    fsBtn.className = 'fs-btn';
    fsBtn.title = 'Toggle fullscreen';
    fsBtn.textContent = '⛶';
    root.appendChild(fsBtn);

    const updateFsIcon = () => {
      fsBtn.textContent = document.fullscreenElement ? '⛶' : '⛶';
      fsBtn.title = document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen';
    };

    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    document.addEventListener('fullscreenchange', updateFsIcon);

    /* Keyboard: F = fullscreen, +/- = scale */
    window.addEventListener('keydown', (e) => {
      if (e.key === 'f' || e.key === 'F') fsBtn.click();
      if (e.key === '=') setScale(scale + STEP);
      if (e.key === '-') setScale(scale - STEP);
      if (e.key === '0') setScale(1);
    });
  }
}

new App();

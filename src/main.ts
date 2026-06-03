import './styles/global.css';
import { LandingScreen }  from './screens/LandingScreen';
import { Sandbox }        from './screens/Sandbox';
import { ArenaSandbox }   from './screens/ArenaSandbox';
import { gameConfirm }    from './utils/dialog';

/* ── App ──────────────────────────────────────────────────────────────────── */
type ScreenId = 'landing' | 'beyblade' | 'arena';

class App {
  private current: ScreenId = 'landing';
  private landing:  LandingScreen;
  private beyblade: Sandbox;
  private arena:    ArenaSandbox;

  constructor() {
    const root = document.getElementById('app')!;

    this.landing = new LandingScreen(root, {
      onBeyblade: () => this.go('beyblade'),
      onArena:    () => this.go('arena'),
    });

    /* 15 cm × 15 cm × 15 cm — close-up beyblade inspection space */
    this.beyblade = new Sandbox(root, {
      title:      'Beyblade Sandbox',
      accentHex:  0x00e5ff,
      onBack:     () => { void this.confirmLeave(); },
      gridSize:   15,          /* 15 cm per side */
      gridDivs:   15,          /* 1 cell = 1 cm */
      tickEvery:  5,           /* labels at ±5, ±10 cm */
      tickRange:  7,           /* ±7 cm (fits ±7.5 half-grid) */
      defaultCam: { x: 12, y: 8, z: 14 },
      camFar:     500,
      minZoom:    0.5,         /* 5 mm */
      maxZoom:    50,          /* 50 cm */
    });

    /* 200 cm × 200 cm × 200 cm (2 m cube) — full arena space */
    this.arena = new ArenaSandbox(root, {
      title:      'Arena Sandbox',
      accentHex:  0xff6b35,
      onBack:     () => { void this.confirmLeave(); },
      gridSize:   200,         /* 2 m = 200 cm per side */
      gridDivs:   20,          /* 1 cell = 10 cm */
      tickEvery:  20,          /* labels at ±20, ±40 … ±100 cm */
      tickRange:  100,         /* ±100 cm = full half-grid */
      defaultCam: { x: 150, y: 100, z: 175 },
      camFar:     2000,
      minZoom:    5,           /* 5 cm */
      maxZoom:    1500,        /* 15 m */
    });

    this.mountGlobalControls(root);

    /* popstate fires on browser back/forward.
     * If leaving a sandbox, ask first — if declined, push forward to undo. */
    window.addEventListener('popstate', (e) => {
      const id: ScreenId = (e.state as { screen?: ScreenId } | null)?.screen
        ?? this.pathToScreen();

      if (this.current !== 'landing' && id === 'landing') {
        void this.confirmPopLeave();
      } else {
        this.show(id);
      }
    });

    /* Stamp current URL with screen state, then show the right screen.
     * replaceState (not push) so back from landing doesn't loop. */
    const initial = this.pathToScreen();
    history.replaceState({ screen: initial }, '', location.pathname);
    this.show(initial);
  }

  /* ── Navigation ──────────────────────────────────────────────── */

  private go(id: ScreenId): void {
    const path = id === 'landing' ? '/' : `/${id}`;
    history.pushState({ screen: id }, '', path);
    this.show(id);
  }

  private show(id: ScreenId): void {
    this.current = id;
    this.landing.setVisible(id === 'landing');
    this.beyblade.setVisible(id === 'beyblade');
    this.arena.setVisible(id === 'arena');
  }

  private pathToScreen(): ScreenId {
    const p = location.pathname;
    if (p === '/beyblade') return 'beyblade';
    if (p === '/arena')    return 'arena';
    return 'landing';
  }

  /* ── Confirm-before-leave ────────────────────────────────────── */

  private async confirmLeave(): Promise<void> {
    if (await gameConfirm('Leave the sandbox?\nYour view will be saved.', 'Leave', 'Stay')) {
      this.go('landing');
    }
  }

  /** After a popstate (browser back), ask — if declined, go() forward to undo. */
  private async confirmPopLeave(): Promise<void> {
    const ok = await gameConfirm(
      'Leave the sandbox?\nYour view will be saved.',
      'Leave', 'Stay',
    );
    if (ok) {
      this.show('landing');
    } else {
      history.go(1);   /* undo the back navigation */
    }
  }

  /* ── Scale controls + fullscreen ─────────────────────────────── */
  private mountGlobalControls(root: HTMLElement): void {
    let scale = 1;
    const STEP = 0.1, MIN = 0.5, MAX = 2.0;

    const setScale = (v: number) => {
      scale = Math.min(MAX, Math.max(MIN, +v.toFixed(2)));
      document.documentElement.style.setProperty('--ui-scale', String(scale));
    };

    const ctrl = document.createElement('div');
    ctrl.className = 'global-controls';
    ctrl.innerHTML = `
      <button class="ctrl-btn" id="scale-down"  title="Decrease UI size">−</button>
      <button class="ctrl-btn" id="scale-reset" title="Reset UI size">○</button>
      <button class="ctrl-btn" id="scale-up"    title="Increase UI size">+</button>
    `;
    root.appendChild(ctrl);

    ctrl.querySelector('#scale-down')!.addEventListener('click',  () => setScale(scale - STEP));
    ctrl.querySelector('#scale-up')!.addEventListener('click',    () => setScale(scale + STEP));
    ctrl.querySelector('#scale-reset')!.addEventListener('click', () => setScale(1));

    const fsBtn = document.createElement('button');
    fsBtn.className   = 'fs-btn';
    fsBtn.title       = 'Toggle fullscreen';
    fsBtn.textContent = '⛶';
    root.appendChild(fsBtn);

    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    document.addEventListener('fullscreenchange', () => {
      fsBtn.title = document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen';
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'f' || e.key === 'F') fsBtn.click();
      if (e.key === '=') setScale(scale + STEP);
      if (e.key === '-') setScale(scale - STEP);
      if (e.key === '0') setScale(1);
    });
  }
}

new App();

import './styles/global.css';
import { LandingScreen }   from './screens/LandingScreen';
import { BeybladeSandbox } from './screens/BeybladeSandbox';
import { ArenaSandbox }    from './screens/ArenaSandbox';
import { RPGScreen }       from './screens/RPGScreen';
import { AdminHubScreen }  from './screens/admin/AdminHubScreen';
import { gameConfirm }     from './utils/dialog';

/* ── App ──────────────────────────────────────────────────────────────────── */
type ScreenId = 'landing' | 'beyblade' | 'arena' | 'rpg' | 'admin';

class App {
  private current: ScreenId = 'landing';
  private landing:  LandingScreen;
  private beyblade: BeybladeSandbox;
  private arena:    ArenaSandbox;
  private rpg:      RPGScreen;
  private admin:    AdminHubScreen;

  constructor() {
    const root = document.getElementById('app')!;

    this.landing = new LandingScreen(root, {
      onBeyblade: () => this.go('beyblade'),
      onArena:    () => this.go('arena'),
      onRpg:      () => this.go('rpg'),
      onAdmin:    () => this.go('admin'),
    });

    this.beyblade = new BeybladeSandbox(root, () => { void this.confirmLeave(); });

    this.arena = new ArenaSandbox(root, {
      title:      'Arena Sandbox',
      accentHex:  0xff6b35,
      onBack:     () => { void this.confirmLeave(); },
      gridSize:   200,
      gridDivs:   20,
      tickEvery:  20,
      tickRange:  100,
      defaultCam: { x: 150, y: 100, z: 175 },
      camFar:     2000,
      minZoom:    5,
      maxZoom:    1500,
      axisYOffset: 0,
    });

    this.rpg = new RPGScreen(root, {
      onBack:   () => { void this.confirmLeave(); },
      onBattle: (_npcId: string) => {
        // Future Three.js battle handoff — stub: stay in RPG
      },
    });

    this.admin = new AdminHubScreen(root, {
      onBack: () => this.go('landing'),
    });

    this.mountGlobalControls(root);

    window.addEventListener('popstate', (e) => {
      const id: ScreenId = (e.state as { screen?: ScreenId } | null)?.screen
        ?? this.pathToScreen();

      if (this.current !== 'landing' && id === 'landing') {
        void this.confirmPopLeave();
      } else {
        this.show(id);
      }
    });

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
    this.rpg.setVisible(id === 'rpg');
    this.admin.setVisible(id === 'admin');
  }

  private pathToScreen(): ScreenId {
    const p = location.pathname;
    if (p === '/beyblade') return 'beyblade';
    if (p === '/arena')    return 'arena';
    if (p === '/rpg')      return 'rpg';
    if (p === '/admin')    return 'admin';
    return 'landing';
  }

  /* ── Confirm-before-leave ────────────────────────────────────── */

  private async confirmLeave(): Promise<void> {
    if (await gameConfirm('Leave the sandbox?\nYour view will be saved.', 'Leave', 'Stay')) {
      this.go('landing');
    }
  }

  private async confirmPopLeave(): Promise<void> {
    const ok = await gameConfirm(
      'Leave the sandbox?\nYour view will be saved.',
      'Leave', 'Stay',
    );
    if (ok) {
      this.show('landing');
    } else {
      history.go(1);
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

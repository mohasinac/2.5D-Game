import './styles/global.css';
import { LandingScreen }       from './screens/LandingScreen';
import { BeybladeSandbox }     from './screens/BeybladeSandbox';
import { ArenaSandbox }        from './screens/ArenaSandbox';
import { RPGScreen }           from './screens/RPGScreen';
import { AdminHubScreen }      from './screens/admin/AdminHubScreen';
import { ArenaLibraryScreen }  from './screens/ArenaLibraryScreen';
import { BeyLibraryScreen }    from './screens/BeyLibraryScreen';
import { SpecialMoveSandbox }  from './screens/SpecialMoveSandbox';
import { gameConfirm }         from './utils/dialog';
import { inputManager }        from './features/managers/InputManager';

/* ── App ──────────────────────────────────────────────────────────────────── */
type ScreenId = 'landing' | 'beyblade' | 'arena' | 'battle' | 'rpg' | 'admin' | 'arena-library' | 'bey-library' | 'preset-editor' | 'part-editor' | 'special-moves';

class App {
  private current: ScreenId = 'landing';
  private landing:        LandingScreen;
  private beyblade:       BeybladeSandbox;
  private partEditor:     BeybladeSandbox;
  private arena:          ArenaSandbox;
  private presetEditor:   ArenaSandbox;
  private battle:         ArenaSandbox;
  private rpg:            RPGScreen;
  private admin:          AdminHubScreen;
  private arenaLibrary:   ArenaLibraryScreen;
  private beyLibrary:     BeyLibraryScreen;
  private specialMoves:   SpecialMoveSandbox;

  constructor() {
    const root = document.getElementById('app')!;

    this.landing = new LandingScreen(root, {
      onBeyblade:      () => this.go('beyblade'),
      onArena:         () => this.go('arena'),
      onRpg:           () => this.go('rpg'),
      onAdmin:         () => this.go('admin'),
      onArenaLibrary:  () => this.go('arena-library'),
      onBeyLibrary:    () => this.go('bey-library'),
      onSpecialMoves:  () => this.go('special-moves'),
      onBattle:        () => this.go('battle'),
    });

    this.beyblade = new BeybladeSandbox(root, {
      onBack:     () => { void this.confirmLeave(); },
      onLibrary:  () => this.go('bey-library'),
    });

    /* PART EDITOR — the bey counterpart of /preset-editor.
       A second BeybladeSandbox rather than a new screen class, for the same
       reason the arena has three instances of one class: everything an authored
       part needs (sector builders, the tree, the properties panel, undo) lives
       here already, and a sibling class would duplicate that stack and drift.
       `title` is what keeps its storage separate — see BeybladeSandboxOptions. */
    this.partEditor = new BeybladeSandbox(root, {
      title:      'Part Editor',
      onBack:     () => this.go('bey-library'),
      onLibrary:  () => this.go('bey-library'),
    });

    this.arena = new ArenaSandbox(root, {
      title:      'Arena Sandbox',
      accentHex:  0xff6b35,
      onBack:     () => { void this.confirmLeave(); },
      onLibrary:  () => this.go('arena-library'),
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

    this.presetEditor = new ArenaSandbox(root, {
      title:           'Preset Editor',
      accentHex:       0xff6b35,
      onBack:          () => this.go('arena-library'),
      onLibrary:       () => this.go('arena-library'),
      presetEditorMode: true,
      gridSize:        200,
      gridDivs:        20,
      tickEvery:       20,
      tickRange:       100,
      defaultCam:      { x: 150, y: 100, z: 175 },
      camFar:          2000,
      minZoom:         5,
      maxZoom:         1500,
      axisYOffset:     0,
    });

    /* BATTLE — the play-mode variant. Same arena stack, no editor chrome,
       and a START button, which is the piece that was missing: the roster,
       match system and gauges all worked and none of them were reachable. */
    this.battle = new ArenaSandbox(root, {
      title:       'Battle',
      accentHex:   0xff6b35,
      onBack:      () => this.go('landing'),
      battleMode:  true,
      playMode:    true,
      gridSize:    200,
      gridDivs:    20,
      tickEvery:   20,
      tickRange:   100,
      defaultCam:  { x: 150, y: 100, z: 175 },
      camFar:      2000,
      minZoom:     5,
      maxZoom:     1500,
      axisYOffset: 0,
    });

    this.rpg = new RPGScreen(root, {
      onBack:   () => { void this.confirmLeave(); },
      /* THE RPG -> BATTLE HAND-OFF, which was an empty stub. The whole chain
         already existed — an `EventSystem` trigger emits `battle:start`,
         `RPGScreen` forwards it here — and it stopped at a comment, so an NPC
         could never start a 3D fight. */
      onBattle: (npcId: string) => {
        /* THE NPC ID IS THE BEY NOW. There used to be an `NPC_BEY` table
           mapping each NPC to a Season-1 build id, and the roster it indexed
           went with the content strip. `setOpponentBuild` derives a spec from
           whatever string it is handed, so passing the NPC's own id keeps the
           property the table existed for — this NPC always brings this bey,
           and a different NPC brings a different one — without a lookup that
           can miss. An unseeded NPC no longer silently fights Galeon. */
        this.battle.setOpponentBuild(npcId);
        this.go('battle');
      },
    });

    this.admin = new AdminHubScreen(root, {
      onBack: () => this.go('landing'),
    });

    this.arenaLibrary = new ArenaLibraryScreen(root, {
      onBack:       () => this.go('landing'),
      onLoadArena:  () => this.go('arena'),
      onEditPreset: () => this.go('preset-editor'),
    });

    this.beyLibrary = new BeyLibraryScreen(root, {
      onBack:       () => this.go('landing'),
      onLoadBuild:  () => this.go('beyblade'),
      onEditPreset: () => this.go('part-editor'),
    });

    this.specialMoves = new SpecialMoveSandbox(root, {
      onBack: () => { void this.confirmLeave(); },
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
    this.partEditor.setVisible(id === 'part-editor');
    this.arena.setVisible(id === 'arena');
    this.presetEditor.setVisible(id === 'preset-editor');
    this.battle.setVisible(id === 'battle');
    this.rpg.setVisible(id === 'rpg');
    this.admin.setVisible(id === 'admin');
    this.arenaLibrary.setVisible(id === 'arena-library');
    this.beyLibrary.setVisible(id === 'bey-library');
    this.specialMoves.setVisible(id === 'special-moves');
  }

  private pathToScreen(): ScreenId {
    const p = location.pathname;
    if (p === '/beyblade')       return 'beyblade';
    if (p === '/arena')          return 'arena';
    if (p === '/battle')         return 'battle';
    if (p === '/preset-editor')  return 'preset-editor';
    if (p === '/part-editor')    return 'part-editor';
    if (p === '/rpg')            return 'rpg';
    if (p === '/admin')          return 'admin';
    if (p === '/arena-library')  return 'arena-library';
    if (p === '/bey-library')    return 'bey-library';
    if (p === '/special-moves')  return 'special-moves';
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

    for (const btn of ctrl.querySelectorAll<HTMLElement>('.ctrl-btn')) {
      btn.style.minHeight = '44px';
      btn.style.minWidth  = '44px';
    }

    ctrl.querySelector('#scale-down')!.addEventListener('click',  () => setScale(scale - STEP));
    ctrl.querySelector('#scale-up')!.addEventListener('click',    () => setScale(scale + STEP));
    ctrl.querySelector('#scale-reset')!.addEventListener('click', () => setScale(1));

    const fsBtn = document.createElement('button');
    fsBtn.className   = 'fs-btn';
    fsBtn.title       = 'Toggle fullscreen';
    fsBtn.textContent = '⛶';
    fsBtn.style.minHeight = '44px';
    fsBtn.style.minWidth  = '44px';
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

    inputManager.onPress('KeyF', () => fsBtn.click());
    inputManager.onPress('Equal', () => setScale(scale + STEP));
    inputManager.onPress('Minus', () => setScale(scale - STEP));
    inputManager.onPress('Digit0', () => setScale(1));
  }
}

new App();

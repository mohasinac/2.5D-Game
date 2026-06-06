import { SpriteAdminScreen }   from './SpriteAdminScreen.ts';
import { TileAdminScreen }     from './TileAdminScreen.ts';
import { MapAdminScreen }      from './MapAdminScreen.ts';
import { SoundAdminScreen }    from './SoundAdminScreen.ts';
import { DialogueAdminScreen } from './DialogueAdminScreen.ts';
import { CutsceneAdminScreen } from './CutsceneAdminScreen.ts';
import { MiniGameAdminScreen } from './MiniGameAdminScreen.ts';

export interface AdminHubOptions {
  onBack: () => void;
}

type AdminSubScreen = 'hub' | 'sprite' | 'tile' | 'map' | 'sound' | 'dialogue' | 'cutscene' | 'minigame';

export class AdminHubScreen {
  private el: HTMLElement;
  private hubEl: HTMLElement;
  private subScreens: {
    sprite:    SpriteAdminScreen;
    tile:      TileAdminScreen;
    map:       MapAdminScreen;
    sound:     SoundAdminScreen;
    dialogue:  DialogueAdminScreen;
    cutscene:  CutsceneAdminScreen;
    minigame:  MiniGameAdminScreen;
  };
  private current: AdminSubScreen = 'hub';

  constructor(container: HTMLElement, opts: AdminHubOptions) {
    this.el = document.createElement('div');
    this.el.className = 'screen admin-hub-screen hidden';
    container.appendChild(this.el);

    const goBack = () => this.showHub();

    this.subScreens = {
      sprite:   new SpriteAdminScreen(this.el,   { onBack: goBack }),
      tile:     new TileAdminScreen(this.el,     { onBack: goBack }),
      map:      new MapAdminScreen(this.el,      { onBack: goBack }),
      sound:    new SoundAdminScreen(this.el,    { onBack: goBack }),
      dialogue: new DialogueAdminScreen(this.el, { onBack: goBack }),
      cutscene: new CutsceneAdminScreen(this.el, { onBack: goBack }),
      minigame: new MiniGameAdminScreen(this.el, { onBack: goBack }),
    };

    this.hubEl = this.buildHub(opts);
    this.el.appendChild(this.hubEl);
  }

  private buildHub(opts: AdminHubOptions): HTMLElement {
    const hub = document.createElement('div');
    hub.className = 'admin-hub';
    hub.innerHTML = `
      <div class="admin-hub-header">
        <div class="admin-hub-title">
          <span class="title-main">ADMIN</span>
          <span class="title-sub">CONTENT STUDIO</span>
        </div>
      </div>
      <div class="admin-hub-grid">
        <button class="admin-hub-btn" data-tool="sprite">
          <span class="admin-hub-icon">🎨</span>
          <span class="admin-hub-label">Sprites</span>
          <span class="admin-hub-desc">SVG sheets · animations · hitboxes</span>
        </button>
        <button class="admin-hub-btn" data-tool="tile">
          <span class="admin-hub-icon">◼</span>
          <span class="admin-hub-label">Tiles</span>
          <span class="admin-hub-desc">Tilesets · collision · layers</span>
        </button>
        <button class="admin-hub-btn" data-tool="map">
          <span class="admin-hub-icon">🗺</span>
          <span class="admin-hub-label">Maps</span>
          <span class="admin-hub-desc">World editor · NPCs · event zones</span>
        </button>
        <button class="admin-hub-btn" data-tool="sound">
          <span class="admin-hub-icon">♪</span>
          <span class="admin-hub-label">Sounds</span>
          <span class="admin-hub-desc">BGM · SFX · spatial audio</span>
        </button>
        <button class="admin-hub-btn" data-tool="dialogue">
          <span class="admin-hub-icon">💬</span>
          <span class="admin-hub-label">Dialogues</span>
          <span class="admin-hub-desc">Node graph · choices · events</span>
        </button>
        <button class="admin-hub-btn" data-tool="cutscene">
          <span class="admin-hub-icon">▶</span>
          <span class="admin-hub-label">Cutscenes</span>
          <span class="admin-hub-desc">Timeline · camera · NPC moves</span>
        </button>
        <button class="admin-hub-btn" data-tool="minigame">
          <span class="admin-hub-icon">⚡</span>
          <span class="admin-hub-label">Mini-Games</span>
          <span class="admin-hub-desc">Pipe puzzles · platform levels</span>
        </button>
      </div>
      <button class="admin-back-btn" id="admin-back">← Back to Landing</button>
    `;

    hub.querySelector('#admin-back')!.addEventListener('click', () => {
      opts.onBack();
    });

    hub.querySelectorAll('[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = (btn as HTMLElement).dataset.tool as AdminSubScreen;
        this.showTool(tool);
      });
    });

    return hub;
  }

  private showHub(): void {
    this.current = 'hub';
    this.hubEl.classList.remove('hidden');
    Object.values(this.subScreens).forEach(s => s.setVisible(false));
  }

  private showTool(tool: AdminSubScreen): void {
    this.current = tool;
    this.hubEl.classList.add('hidden');
    Object.entries(this.subScreens).forEach(([key, screen]) => {
      screen.setVisible(key === tool);
    });
  }

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
    if (v) this.showHub();
    else Object.values(this.subScreens).forEach(s => s.setVisible(false));
  }
}

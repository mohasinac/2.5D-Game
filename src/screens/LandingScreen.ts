export interface LandingOptions {
  onBeyblade:     () => void;
  onArena:        () => void;
  onRpg:          () => void;
  onAdmin:        () => void;
  onArenaLibrary: () => void;
  onBeyLibrary:   () => void;
}

export class LandingScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement, opts: LandingOptions) {
    this.el = document.createElement('div');
    this.el.className = 'screen landing-screen';
    this.el.innerHTML = `
      <div class="landing-bg"></div>
      <div class="landing-content">
        <div class="landing-title">
          <span class="title-main">BEYBLADE</span>
          <span class="title-sub">GAME ENGINE</span>
        </div>
        <div class="landing-buttons">
          <button class="game-btn" id="btn-beyblade">
            <span class="btn-icon">◈</span>
            Beyblade Sandbox
          </button>
          <button class="game-btn" id="btn-arena">
            <span class="btn-icon">◎</span>
            Arena Sandbox
          </button>
          <button class="game-btn game-btn--rpg" id="btn-rpg">
            <span class="btn-icon">▶</span>
            Play RPG
          </button>
          <button class="game-btn game-btn--admin" id="btn-admin">
            <span class="btn-icon">⚙</span>
            Admin Studio
          </button>
          <button class="game-btn game-btn--lib" id="btn-arena-library">
            <span class="btn-icon">◎</span>
            Arena Library
          </button>
          <button class="game-btn game-btn--lib" id="btn-bey-library">
            <span class="btn-icon">⬡</span>
            Bey Library
          </button>
        </div>
      </div>
    `;
    container.appendChild(this.el);

    this.el.querySelector('#btn-beyblade')!.addEventListener('click',      opts.onBeyblade);
    this.el.querySelector('#btn-arena')!.addEventListener('click',         opts.onArena);
    this.el.querySelector('#btn-rpg')!.addEventListener('click',           opts.onRpg);
    this.el.querySelector('#btn-admin')!.addEventListener('click',         opts.onAdmin);
    this.el.querySelector('#btn-arena-library')!.addEventListener('click', opts.onArenaLibrary);
    this.el.querySelector('#btn-bey-library')!.addEventListener('click',   opts.onBeyLibrary);
  }

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
  }
}

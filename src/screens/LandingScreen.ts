export interface LandingOptions {
  onBeyblade: () => void;
  onArena: () => void;
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
          <button class="game-btn" id="btn-back" disabled>
            <span class="btn-icon">←</span>
            Back
          </button>
        </div>
      </div>
    `;
    container.appendChild(this.el);

    this.el.querySelector('#btn-beyblade')!.addEventListener('click', opts.onBeyblade);
    this.el.querySelector('#btn-arena')!.addEventListener('click', opts.onArena);
  }

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
  }
}

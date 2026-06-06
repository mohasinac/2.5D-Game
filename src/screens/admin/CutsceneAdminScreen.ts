export class CutsceneAdminScreen {
  private el: HTMLElement;
  constructor(container: HTMLElement, _opts: { onBack: () => void }) {
    this.el = document.createElement('div');
    this.el.className = 'screen admin-sub-screen hidden';
    this.el.innerHTML = '<div style="color:#dde8ff;padding:2rem">Cutscene Admin — Coming soon</div>';
    container.appendChild(this.el);
  }
  setVisible(v: boolean): void { this.el.classList.toggle('hidden', !v); }
}

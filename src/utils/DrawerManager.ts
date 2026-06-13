export class DrawerManager {
  private readonly _backdrop: HTMLDivElement;
  private _left:  HTMLElement | null = null;
  private _right: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this._backdrop = document.createElement('div');
    this._backdrop.className = 'drawer-backdrop';
    container.appendChild(this._backdrop);
    this._backdrop.addEventListener('click', () => this.closeAll());
  }

  bind(left: HTMLElement, right: HTMLElement): void {
    this._left  = left;
    this._right = right;
  }

  toggleLeft():  void { this._toggle(this._left,  'sandbox-left-panel--open'); }
  toggleRight(): void { this._toggle(this._right, 'sandbox-right-panel--open'); }

  closeAll(): void {
    this._left?.classList.remove('sandbox-left-panel--open');
    this._right?.classList.remove('sandbox-right-panel--open');
    this._backdrop.classList.remove('active');
  }

  private _toggle(panel: HTMLElement | null, cls: string): void {
    if (!panel) return;
    const open = panel.classList.toggle(cls);
    this._backdrop.classList.toggle('active', open);
    if (open) {
      const otherCls = cls === 'sandbox-left-panel--open'
        ? 'sandbox-right-panel--open'
        : 'sandbox-left-panel--open';
      (cls === 'sandbox-left-panel--open' ? this._right : this._left)
        ?.classList.remove(otherCls);
    }
  }

  destroy(): void { this._backdrop.remove(); }
}

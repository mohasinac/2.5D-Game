export type LayoutMode = 'desktop' | 'tablet' | 'mobile' | 'phone';

type Listener = (mode: LayoutMode) => void;

class LayoutObserver {
  private _mode: LayoutMode = 'desktop';
  private readonly _listeners = new Set<Listener>();

  constructor() {
    window.addEventListener('resize', () => this._check(), { passive: true });
    this._check();
  }

  getMode():  LayoutMode { return this._mode; }
  isMobile(): boolean    { return this._mode === 'mobile' || this._mode === 'phone'; }
  isTouch():  boolean    { return window.matchMedia('(pointer: coarse)').matches; }

  onChange(cb: Listener): () => void {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }

  private _check(): void {
    const w = window.innerWidth;
    const m: LayoutMode = w <= 480 ? 'phone' : w <= 768 ? 'mobile' : w <= 1024 ? 'tablet' : 'desktop';
    if (m !== this._mode) {
      this._mode = m;
      this._listeners.forEach(cb => cb(m));
    }
  }
}

export const layoutObserver = new LayoutObserver();

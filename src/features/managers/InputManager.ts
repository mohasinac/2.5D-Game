type Unsubscribe = () => void;

export class InputManager {
  private _keys            = new Set<string>();
  private _pressHandlers   = new Map<string, Set<(e: KeyboardEvent) => void>>();
  private _releaseHandlers = new Map<string, Set<(e: KeyboardEvent) => void>>();
  private _kd: (e: KeyboardEvent) => void;
  private _ku: (e: KeyboardEvent) => void;

  constructor() {
    this._kd = (e: KeyboardEvent) => {
      this._keys.add(e.code);
      this._pressHandlers.get(e.code)?.forEach(fn => fn(e));
    };
    this._ku = (e: KeyboardEvent) => {
      this._keys.delete(e.code);
      this._releaseHandlers.get(e.code)?.forEach(fn => fn(e));
    };
    document.addEventListener('keydown', this._kd);
    document.addEventListener('keyup',   this._ku);
  }

  isDown(code: string): boolean { return this._keys.has(code); }

  isTextFocused(): boolean {
    const el = document.activeElement;
    if (!el) return false;
    const t = el.tagName;
    return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT'
      || (el as HTMLElement).isContentEditable;
  }

  onPress(code: string, handler: (e: KeyboardEvent) => void): Unsubscribe {
    if (!this._pressHandlers.has(code)) this._pressHandlers.set(code, new Set());
    this._pressHandlers.get(code)!.add(handler);
    return () => this._pressHandlers.get(code)?.delete(handler);
  }

  onRelease(code: string, handler: (e: KeyboardEvent) => void): Unsubscribe {
    if (!this._releaseHandlers.has(code)) this._releaseHandlers.set(code, new Set());
    this._releaseHandlers.get(code)!.add(handler);
    return () => this._releaseHandlers.get(code)?.delete(handler);
  }

  dispose(): void {
    document.removeEventListener('keydown', this._kd);
    document.removeEventListener('keyup',   this._ku);
    this._keys.clear();
    this._pressHandlers.clear();
    this._releaseHandlers.clear();
  }
}

export const inputManager = new InputManager();

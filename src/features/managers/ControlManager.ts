import type { InputManager } from './InputManager';

export type ControlButton = 'jump' | 'trigger';
export interface IControlAxes { x: number; y: number; }

export interface IControlManager {
  getMovementAxes(): IControlAxes;
  isButtonDown(b: ControlButton): boolean;
  onButtonPress(b: ControlButton, cb: () => void): () => void;
  setVirtualAxes(x: number, y: number): void;
  setVirtualButton(b: ControlButton, down: boolean): void;
  destroy(): void;
}

export class ControlManager implements IControlManager {
  private _vx = 0;
  private _vy = 0;
  private readonly _vBtns   = new Map<ControlButton, boolean>();
  private readonly _handlers = new Map<ControlButton, Set<() => void>>();
  private readonly _unsubs:   Array<() => void> = [];

  constructor(private readonly im: InputManager) {
    this._unsubs.push(
      im.onPress('Space', () => this._fire('jump')),
      im.onPress('KeyT',  () => this._fire('trigger')),
    );
  }

  getMovementAxes(): IControlAxes {
    if (this.im.isTextFocused()) return { x: 0, y: 0 };
    const km = this._keyAxes();
    return (km.x !== 0 || km.y !== 0) ? km : { x: this._vx, y: this._vy };
  }

  private _keyAxes(): IControlAxes {
    const im = this.im;
    return {
      x: (im.isDown('KeyD') || im.isDown('ArrowRight') ? 1 : 0)
       - (im.isDown('KeyA') || im.isDown('ArrowLeft')  ? 1 : 0),
      y: (im.isDown('KeyW') || im.isDown('ArrowUp')    ? 1 : 0)
       - (im.isDown('KeyS') || im.isDown('ArrowDown')  ? 1 : 0),
    };
  }

  isButtonDown(b: ControlButton): boolean {
    if (b === 'jump')    return this.im.isDown('Space') || (this._vBtns.get('jump')    ?? false);
    if (b === 'trigger') return this.im.isDown('KeyT')  || (this._vBtns.get('trigger') ?? false);
    return false;
  }

  onButtonPress(b: ControlButton, cb: () => void): () => void {
    if (!this._handlers.has(b)) this._handlers.set(b, new Set());
    this._handlers.get(b)!.add(cb);
    return () => this._handlers.get(b)?.delete(cb);
  }

  setVirtualAxes(x: number, y: number): void { this._vx = x; this._vy = y; }

  setVirtualButton(b: ControlButton, down: boolean): void {
    this._vBtns.set(b, down);
    if (down) this._fire(b);
  }

  private _fire(b: ControlButton): void { this._handlers.get(b)?.forEach(fn => fn()); }

  destroy(): void {
    this._unsubs.forEach(fn => fn());
    this._unsubs.length = 0;
    this._handlers.clear();
  }
}

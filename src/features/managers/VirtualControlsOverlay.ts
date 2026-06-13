import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { IControlManager, ControlButton } from './ControlManager';
import { layoutObserver } from '../../utils/LayoutObserver';

const STICK_MAX_PX = 52;

export class VirtualControlsOverlay {
  private readonly _el:   HTMLDivElement;
  private readonly _base: HTMLElement;
  private readonly _knob: HTMLElement;
  private readonly _zone: HTMLElement;
  private _stickId: number | null = null;
  private _cx = 0;
  private _cy = 0;

  constructor(
    container: HTMLElement,
    private readonly ctrl: IControlManager,
    private readonly getControls: () => OrbitControls | null,
  ) {
    this._el   = this._build();
    this._zone = this._el.querySelector('#vs-zone') as HTMLElement;
    this._base = this._el.querySelector('#vs-base') as HTMLElement;
    this._knob = this._el.querySelector('#vs-knob') as HTMLElement;
    container.appendChild(this._el);
    this._bindStick();
    this._bindBtn('vb-jump', 'jump');
    this._bindBtn('vb-trig', 'trigger');
  }

  show(): void {
    if (!layoutObserver.isTouch()) return;
    this._el.classList.add('active');
  }

  hide(): void {
    this._el.classList.remove('active');
    this._reset();
    this.ctrl.setVirtualAxes(0, 0);
    const oc = this.getControls();
    if (oc) oc.enabled = true;
  }

  destroy(): void { this._el.remove(); }

  private _build(): HTMLDivElement {
    const el = document.createElement('div');
    el.className = 'vctrl-overlay';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="vctrl-stick-zone" id="vs-zone">
        <div class="vctrl-stick-base" id="vs-base">
          <div class="vctrl-stick-knob" id="vs-knob"></div>
        </div>
      </div>
      <div class="vctrl-btn-zone">
        <button class="vctrl-btn" id="vb-jump" aria-label="Jump">JUMP</button>
        <button class="vctrl-btn vctrl-btn--a" id="vb-trig" aria-label="Trigger">TRIG</button>
      </div>
      <div class="vctrl-hint">Drag canvas to orbit · Pinch to zoom</div>
    `;
    return el;
  }

  private _bindStick(): void {
    this._zone.addEventListener('pointerdown', (e: PointerEvent) => {
      if (this._stickId !== null) return;
      this._stickId = e.pointerId;
      this._zone.setPointerCapture(e.pointerId);
      const r  = this._base.getBoundingClientRect();
      this._cx = r.left + r.width  / 2;
      this._cy = r.top  + r.height / 2;
      this._base.classList.add('active');
      const oc = this.getControls();
      if (oc) oc.enabled = false;
      e.preventDefault();
    }, { passive: false });

    this._zone.addEventListener('pointermove', (e: PointerEvent) => {
      if (e.pointerId !== this._stickId) return;
      const dx   = e.clientX - this._cx;
      const dy   = e.clientY - this._cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const frac = Math.min(dist, STICK_MAX_PX) / STICK_MAX_PX;
      const nx   = dist > 0 ? dx / dist : 0;
      const ny   = dist > 0 ? dy / dist : 0;
      this._knob.style.transform =
        `translate(calc(-50% + ${nx * frac * STICK_MAX_PX}px), calc(-50% + ${ny * frac * STICK_MAX_PX}px))`;
      const ax = dist > 2 ? Math.max(-1, Math.min(1, dx  / STICK_MAX_PX)) : 0;
      const ay = dist > 2 ? Math.max(-1, Math.min(1, -dy / STICK_MAX_PX)) : 0;
      this.ctrl.setVirtualAxes(ax, ay);
      e.preventDefault();
    }, { passive: false });

    const up = (e: PointerEvent) => {
      if (e.pointerId !== this._stickId) return;
      this._stickId = null;
      this._reset();
      this.ctrl.setVirtualAxes(0, 0);
      const oc = this.getControls();
      if (oc) oc.enabled = true;
    };
    this._zone.addEventListener('pointerup',     up);
    this._zone.addEventListener('pointercancel', up);
  }

  private _bindBtn(id: string, btn: ControlButton): void {
    const el = this._el.querySelector(`#${id}`) as HTMLButtonElement;
    el.addEventListener('pointerdown', (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      el.classList.add('pressed');
      this.ctrl.setVirtualButton(btn, true);
      e.preventDefault();
    }, { passive: false });
    const up = () => { el.classList.remove('pressed'); this.ctrl.setVirtualButton(btn, false); };
    el.addEventListener('pointerup',     up);
    el.addEventListener('pointercancel', up);
  }

  private _reset(): void {
    this._base.classList.remove('active');
    this._knob.style.transform = 'translate(-50%,-50%)';
  }
}

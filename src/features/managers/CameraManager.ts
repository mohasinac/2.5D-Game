import * as THREE from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { CameraViewStore } from '../../stores/cameraViewStore';

export class CameraManager {
  private _followTarget: THREE.Vector3 | null = null;

  constructor(
    private readonly getCamera:   () => THREE.PerspectiveCamera | null,
    private readonly getControls: () => OrbitControls | null,
    private readonly store:       CameraViewStore,
    private readonly defaultCam:  { x: number; y: number; z: number },
  ) {}

  save(): void {
    const cam  = this.getCamera();
    const ctrl = this.getControls();
    if (!cam || !ctrl) return;
    this.store.getState().save(cam.position, ctrl.target);
  }

  load(): void {
    const cam  = this.getCamera();
    const ctrl = this.getControls();
    if (!cam || !ctrl) return;
    const view = this.store.getState().load();
    if (!view) return;
    cam.position.set(view.position.x, view.position.y, view.position.z);
    ctrl.target.set(view.target.x, view.target.y, view.target.z);
    ctrl.update();
  }

  reset(): void {
    const cam  = this.getCamera();
    const ctrl = this.getControls();
    this.store.getState().reset();
    if (!cam || !ctrl) return;
    cam.position.set(this.defaultCam.x, this.defaultCam.y, this.defaultCam.z);
    ctrl.target.set(0, 0, 0);
    ctrl.update();
  }

  setFollow(target: THREE.Vector3 | null): void {
    this._followTarget = target;
  }

  focusOn(pos: THREE.Vector3): void {
    const ctrl = this.getControls();
    if (!ctrl) return;
    ctrl.target.copy(pos);
    ctrl.update();
  }

  tick(_dt: number): void {
    if (!this._followTarget) return;
    const ctrl = this.getControls();
    if (!ctrl) return;
    ctrl.target.lerp(this._followTarget, 0.08);
  }
}

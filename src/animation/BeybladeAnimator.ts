import * as THREE from 'three';
import { SpinDir } from '../types/beybladeTypes';
import { BeybladeRenderer } from '../renderers/BeybladeRenderer';

const SPIN_RPM = 300;
const DEG_TO_RAD = Math.PI / 180;

export class BeybladeAnimator {
  private spinning = false;
  private angle = 0;
  private readonly _scratchDir = new THREE.Vector3();

  constructor(private renderer: BeybladeRenderer) {}

  // ── Controls ──────────────────────────────────────────────────────────────

  startSpin(): void  { this.spinning = true; }
  stopSpin(): void   { this.spinning = false; }
  get isSpinning(): boolean { return this.spinning; }

  setTiltAngle(deg: number, pivotOffset: number): void {
    this.renderer.setAxisPose(deg, pivotOffset);
  }

  // ── Per-frame tick (called from BeybladeSandbox.onTick) ───────────────────

  tick(dtMs: number, spinDir: SpinDir): void {
    if (!this.spinning || dtMs <= 0) return;
    const dAngle = (SPIN_RPM / 60) * 2 * Math.PI * (dtMs / 1000);
    this.angle  += spinDir === 'right' ? dAngle : -dAngle;
    this.renderer.spinGroup.rotation.y = this.angle;
    // Free-spin group stays at rotation.y = 0 — no update needed.
  }

  resetAngle(): void {
    this.angle = 0;
    this.renderer.spinGroup.rotation.y = 0;
  }

  // ── Camera-helper: orient the tilt display about the world Y axis ─────────
  // Rotates the axisRoot so the tilt leans toward the camera's XZ direction.
  // Optional helper — used by the UI when the user rotates the view.
  orientTiltToCamera(camera: THREE.Camera): void {
    const dir = this._scratchDir;
    camera.getWorldDirection(dir);
    dir.y = 0;
    if (dir.lengthSq() < 0.0001) return;
    dir.normalize();
    const angle = Math.atan2(dir.x, dir.z);
    // Rotate the axis assembly around world Y so the tilt leans toward the camera.
    // axisRoot.rotation.y is in axisRoot's local space (= world Y when no self-rotation).
    this.renderer.axisRoot.rotation.y = angle;
  }
}

// WorldTransform — single source of truth for world (cm) → screen (px) projection.
// Owns the camera state. Consumed by the renderer + admin previews.
// See plan: Parts 1, 1b, 2, 15.

import { getPxPerCm } from "@/constants/units";

export interface ViewportCm {
  x: number; y: number; w: number; h: number;     // world rectangle the screen frames
}

export interface CameraState {
  x_cm: number;
  y_cm: number;
  zoom: number;
  targetX_cm: number;
  targetY_cm: number;
  targetZoom: number;
}

export interface CameraLimits {
  minZoom: number;
  maxZoom: number;
  arenaBounds: { minX_cm: number; minY_cm: number; maxX_cm: number; maxY_cm: number } | null;
  allowFreePan: boolean;
}

export class WorldTransform {
  screenW = 0;
  screenH = 0;
  camera: CameraState = {
    x_cm: 0, y_cm: 0, zoom: 1,
    targetX_cm: 0, targetY_cm: 0, targetZoom: 1,
  };
  limits: CameraLimits = {
    minZoom: 0.25,
    maxZoom: 4,
    arenaBounds: null,
    allowFreePan: false,
  };

  // Smoothing factors per frame (frame-rate dependent for now; tune later).
  followLerp = 0.12;
  zoomLerp = 0.08;

  // ── Camera Shake ─────────────────────────────────────────────────────────────
  private shakeIntensity = 0;
  private shakeDuration = 0;
  private shakeStartTime = 0;

  setScreen(w: number, h: number) {
    this.screenW = w;
    this.screenH = h;
    // pxPerCm is fixed (24) — resizing the viewport changes visible world area, not object scale.
  }

  setArenaBounds(minX_cm: number, minY_cm: number, maxX_cm: number, maxY_cm: number, allowFreePan = false) {
    this.limits.arenaBounds = { minX_cm, minY_cm, maxX_cm, maxY_cm };
    this.limits.allowFreePan = allowFreePan;
  }

  // Minimum cm visible on the short axis when fully zoomed in.
  // Prevents zooming in so tight that the player loses all situational awareness.
  static readonly MIN_VIEWPORT_CM = 10;

  /**
   * Compute zoom limits from arena bounds + bey radius.
   * Because pxPerCm is now viewport-proportional, all three limits resolve to
   * screen-independent constants — zoom semantics are identical on every device.
   *
   * - minZoom = fit the whole arena on screen (most zoomed out).
   * - maxZoom = 5-bey close-up window, capped so the player always sees
   *             at least MIN_VIEWPORT_CM on the short axis.
   */
  computeZoomLimits(beyRadiusCm: number) {
    const b = this.limits.arenaBounds;
    if (!b) return;
    const arenaW = b.maxX_cm - b.minX_cm;
    const arenaH = b.maxY_cm - b.minY_cm;
    const screenShort = Math.min(this.screenW, this.screenH);
    const pxPerCm = getPxPerCm();
    if (pxPerCm <= 0 || screenShort <= 0 || arenaW <= 0 || arenaH <= 0 || beyRadiusCm <= 0) return;
    const fitZoom     = screenShort / (Math.max(arenaW, arenaH) * pxPerCm);
    const fiveBeyZoom = screenShort / (5 * 2 * beyRadiusCm * pxPerCm);
    // tileCapZoom: maximum zoom that still shows at least MIN_VIEWPORT_CM on the short axis.
    // Must be >= fiveBeyZoom so there is always room to zoom in beyond fit.
    const tileCapZoom = screenShort / (WorldTransform.MIN_VIEWPORT_CM * pxPerCm);
    this.limits.minZoom = this.limits.allowFreePan ? Math.min(fitZoom, 0.05) : fitZoom;
    this.limits.maxZoom = Math.min(Math.max(fiveBeyZoom, fitZoom * 1.5), tileCapZoom);
  }

  setZoom(z: number, immediate = false) {
    const clamped = Math.max(this.limits.minZoom, Math.min(this.limits.maxZoom, z));
    this.camera.targetZoom = clamped;
    if (immediate) this.camera.zoom = clamped;
  }

  /** Alias for camera zoom — used by special-move camera tween. */
  get scale(): number { return this.camera.zoom; }

  /** Set zoom immediately (for camera tween, clamped by limits). */
  setScale(z: number) { this.setZoom(z, true); }

  nudgeZoom(deltaMul: number) {
    this.setZoom(this.camera.targetZoom * deltaMul);
  }

  setFollowTarget(x_cm: number, y_cm: number) {
    this.camera.targetX_cm = x_cm;
    this.camera.targetY_cm = y_cm;
  }

  snapTo(x_cm: number, y_cm: number) {
    this.camera.x_cm = x_cm;
    this.camera.y_cm = y_cm;
    this.camera.targetX_cm = x_cm;
    this.camera.targetY_cm = y_cm;
  }

  /** Trigger a camera shake. intensity is in px; durationMs in ms. */
  triggerShake(intensity: number, durationMs: number): void {
    // Only upgrade — don't downgrade an active strong shake
    if (intensity >= this.shakeIntensity) {
      this.shakeIntensity = intensity;
      this.shakeDuration = durationMs;
      this.shakeStartTime = performance.now();
    }
  }

  /** Returns the current shake offset in screen pixels. Decays over shakeDuration. */
  getShakeOffset(): { x: number; y: number } {
    if (this.shakeIntensity <= 0 || this.shakeDuration <= 0) return { x: 0, y: 0 };
    const elapsed = performance.now() - this.shakeStartTime;
    if (elapsed >= this.shakeDuration) {
      this.shakeIntensity = 0;
      return { x: 0, y: 0 };
    }
    const decay = 1 - elapsed / this.shakeDuration;
    const t = elapsed;
    // High-frequency sinusoidal shake in both axes, decaying exponentially
    const angle = t * 0.08;
    const amp = this.shakeIntensity * decay;
    return {
      x: Math.sin(angle * 2.3 + 0.5) * amp,
      y: Math.cos(angle * 1.7 + 1.2) * amp,
    };
  }

  /** Advance smooth follow / zoom one frame. */
  tick() {
    const c = this.camera;
    c.zoom += (c.targetZoom - c.zoom) * this.zoomLerp;
    c.x_cm += (c.targetX_cm - c.x_cm) * this.followLerp;
    c.y_cm += (c.targetY_cm - c.y_cm) * this.followLerp;
    this.clampToArena();

    // Expire shake
    if (this.shakeIntensity > 0) {
      const elapsed = performance.now() - this.shakeStartTime;
      if (elapsed >= this.shakeDuration) this.shakeIntensity = 0;
    }
  }

  private clampToArena() {
    const b = this.limits.arenaBounds;
    if (!b || this.limits.allowFreePan) return;
    const v = this.viewportCm();
    const arenaW = b.maxX_cm - b.minX_cm;
    const arenaH = b.maxY_cm - b.minY_cm;
    // If the viewport is wider than the arena on an axis, lock the camera to
    // the arena center on that axis (otherwise both edge clamps fight).
    if (v.w >= arenaW) {
      this.camera.x_cm = (b.minX_cm + b.maxX_cm) / 2;
    } else {
      if (v.x < b.minX_cm) this.camera.x_cm += b.minX_cm - v.x;
      const v2 = this.viewportCm();
      if (v2.x + v2.w > b.maxX_cm) this.camera.x_cm += b.maxX_cm - (v2.x + v2.w);
    }
    if (v.h >= arenaH) {
      this.camera.y_cm = (b.minY_cm + b.maxY_cm) / 2;
    } else {
      if (v.y < b.minY_cm) this.camera.y_cm += b.minY_cm - v.y;
      const v2 = this.viewportCm();
      if (v2.y + v2.h > b.maxY_cm) this.camera.y_cm += b.maxY_cm - (v2.y + v2.h);
    }
  }

  /** World rect visible on screen at current camera. */
  viewportCm(): ViewportCm {
    const pxPerCm = getPxPerCm() * this.camera.zoom;
    const wCm = this.screenW / pxPerCm;
    const hCm = this.screenH / pxPerCm;
    return {
      x: this.camera.x_cm - wCm / 2,
      y: this.camera.y_cm - hCm / 2,
      w: wCm,
      h: hCm,
    };
  }

  /** Project a world point (cm) to screen pixels. */
  worldToScreen(x_cm: number, y_cm: number): { x: number; y: number } {
    const pxPerCm = getPxPerCm() * this.camera.zoom;
    return {
      x: (x_cm - this.camera.x_cm) * pxPerCm + this.screenW / 2,
      y: (y_cm - this.camera.y_cm) * pxPerCm + this.screenH / 2,
    };
  }

  /** Inverse: screen → world cm. */
  screenToWorld(px: number, py: number): { x_cm: number; y_cm: number } {
    const pxPerCm = getPxPerCm() * this.camera.zoom;
    return {
      x_cm: this.camera.x_cm + (px - this.screenW / 2) / pxPerCm,
      y_cm: this.camera.y_cm + (py - this.screenH / 2) / pxPerCm,
    };
  }

  /** Length scalar (cm → px) at current zoom. */
  scaleCmToPx(cm: number): number {
    return cm * getPxPerCm() * this.camera.zoom;
  }

  /** True if a world point is inside the screen viewport (with optional margin in cm). */
  isInViewport(x_cm: number, y_cm: number, marginCm = 0): boolean {
    const v = this.viewportCm();
    return (
      x_cm >= v.x - marginCm &&
      x_cm <= v.x + v.w + marginCm &&
      y_cm >= v.y - marginCm &&
      y_cm <= v.y + v.h + marginCm
    );
  }

  /** True if a world rectangle intersects the screen viewport. */
  rectIntersectsViewport(x_cm: number, y_cm: number, w_cm: number, h_cm: number, marginCm = 0): boolean {
    const v = this.viewportCm();
    return !(
      x_cm + w_cm < v.x - marginCm ||
      x_cm > v.x + v.w + marginCm ||
      y_cm + h_cm < v.y - marginCm ||
      y_cm > v.y + v.h + marginCm
    );
  }
}

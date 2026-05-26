// ---------------------------------------------------------------------------
// CameraSystem — smart zoom + screen‑shake for the Beyblade battle renderer
// ---------------------------------------------------------------------------

/** Persistent camera state updated every frame. */
export interface CameraState {
  zoom: number;           // current zoom 0.5–2.0
  targetZoom: number;     // animated target
  focusX: number;         // current focus world X
  focusY: number;         // current focus world Y
  shakeIntensity: number; // decaying magnitude
  shakeDuration: number;  // remaining ms
  shakeStartTime: number; // when shake started (Date.now timestamp)
}

// ── Shake trigger presets ────────────────────────────────────────────────────

export const SHAKE_BURST        = { intensity: 15, duration: 400 } as const;
export const SHAKE_RINGOUT      = { intensity: 10, duration: 250 } as const;
export const SHAKE_HEAVY_SMASH  = { intensity:  5, duration: 150 } as const;
export const SHAKE_SPECIAL      = { intensity:  8, duration: 300 } as const;

// ── Tunables ─────────────────────────────────────────────────────────────────

const ZOOM_MIN        = 0.6;
const ZOOM_MAX        = 1.8;
const ZOOM_BASE       = 1.2;
const ZOOM_LERP       = 0.08;
const FOCUS_LERP      = 0.1;

// ── CameraSystem ─────────────────────────────────────────────────────────────

export class CameraSystem {
  state: CameraState;

  constructor() {
    this.state = {
      zoom: 1,
      targetZoom: 1,
      focusX: 0,
      focusY: 0,
      shakeIntensity: 0,
      shakeDuration: 0,
      shakeStartTime: 0,
    };
  }

  // ── Focus & zoom tracking ───────────────────────────────────────────────

  /**
   * Recompute focus position and target zoom based on the positions of all
   * living beyblades and the arena radius.
   *
   * Focus  = midpoint of living beys.
   * Zoom   = `base / (1 + spread / arenaRadius)`, clamped to [0.6, 1.8].
   *          Spread is the max distance of any living bey from the midpoint.
   */
  updateFocus(
    beyPositions: Array<{ x: number; y: number; isAlive: boolean }>,
    arenaRadius: number,
  ): void {
    const alive = beyPositions.filter((b) => b.isAlive);

    if (alive.length === 0) {
      // Nothing to track — keep current focus, zoom out gently.
      this.state.targetZoom = 1;
      return;
    }

    // Midpoint
    let sumX = 0;
    let sumY = 0;
    for (const b of alive) {
      sumX += b.x;
      sumY += b.y;
    }
    const midX = sumX / alive.length;
    const midY = sumY / alive.length;

    // Spread — max distance from midpoint
    let spread = 0;
    for (const b of alive) {
      const dx = b.x - midX;
      const dy = b.y - midY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > spread) spread = dist;
    }

    // Target zoom
    const rawZoom = ZOOM_BASE / (1 + spread / arenaRadius);
    this.state.targetZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, rawZoom));

    // Target focus (will be lerped in update())
    this.state.focusX += (midX - this.state.focusX) * FOCUS_LERP;
    this.state.focusY += (midY - this.state.focusY) * FOCUS_LERP;
  }

  // ── Shake ───────────────────────────────────────────────────────────────

  /** Start a screen shake. Stronger shakes override weaker ones. */
  triggerShake(intensity: number, durationMs: number): void {
    // Only override if the new shake is stronger than the remaining one
    if (intensity > this.state.shakeIntensity * this.getShakeDecay()) {
      this.state.shakeIntensity = intensity;
      this.state.shakeDuration = durationMs;
      this.state.shakeStartTime = Date.now();
    }
  }

  /** Returns a 0‑to‑1 decay factor for the current shake (1 = just started). */
  private getShakeDecay(): number {
    if (this.state.shakeDuration <= 0) return 0;
    const elapsed = Date.now() - this.state.shakeStartTime;
    const remaining = Math.max(0, this.state.shakeDuration - elapsed);
    return remaining / this.state.shakeDuration;
  }

  /** Returns the current frame's random shake offset (px). */
  getShakeOffset(): { x: number; y: number } {
    const decay = this.getShakeDecay();
    if (decay <= 0) return { x: 0, y: 0 };

    const magnitude = this.state.shakeIntensity * decay;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle) * magnitude,
      y: Math.sin(angle) * magnitude,
    };
  }

  // ── Per‑frame update ───────────────────────────────────────────────────

  /** Advance shake timer and interpolate zoom toward the target. */
  update(_deltaMs: number): void {
    // Zoom interpolation
    this.state.zoom += (this.state.targetZoom - this.state.zoom) * ZOOM_LERP;

    // Expire shake
    const elapsed = Date.now() - this.state.shakeStartTime;
    if (elapsed >= this.state.shakeDuration) {
      this.state.shakeIntensity = 0;
      this.state.shakeDuration = 0;
    }
  }

  // ── Apply to PixiJS container ──────────────────────────────────────────

  /**
   * Set the container's scale and position so the camera focuses on
   * `(focusX, focusY)` at the current zoom level, with shake applied.
   *
   * The container is typed as `any` to avoid coupling to a specific
   * PixiJS version — any object with `scale`, `position`, and `pivot`
   * properties will work.
   */
  applyToContainer(container: any): void {
    const shake = this.getShakeOffset();

    container.scale.set(this.state.zoom, this.state.zoom);
    container.pivot.set(this.state.focusX, this.state.focusY);

    // Recentre: the pivot point should appear at the container's parent
    // midpoint. Callers can adjust the base position externally; here we
    // only apply the shake delta on top of the current position.
    container.position.x = container.position.x + shake.x;
    container.position.y = container.position.y + shake.y;
  }
}

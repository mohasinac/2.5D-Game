// ---------------------------------------------------------------------------
// CameraSystem — smart zoom + screen‑shake for the Beyblade battle renderer
//
// OVERHAUL NOTE: Shake is now owned by WorldTransform.triggerShake/getShakeOffset.
// This class retains focus/zoom tracking and the SHAKE_* preset constants.
// applyToContainer() is removed — PixiRenderer now applies WorldTransform shake directly.
// ---------------------------------------------------------------------------

/** Persistent camera state updated every frame. */
export interface CameraState {
  zoom: number;           // current zoom 0.5–2.0
  targetZoom: number;     // animated target
  focusX: number;         // current focus world X
  focusY: number;         // current focus world Y
  shakeIntensity: number; // decaying magnitude (kept for legacy callers)
  shakeDuration: number;  // remaining ms
  shakeStartTime: number; // when shake started (Date.now timestamp)
}

// ── Shake trigger presets ────────────────────────────────────────────────────
// Callers pass these into WorldTransform.triggerShake(intensity, duration).

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

  // ── Per‑frame update ───────────────────────────────────────────────────

  /** Advance zoom interpolation. Shake is now handled by WorldTransform. */
  update(_deltaMs: number): void {
    this.state.zoom += (this.state.targetZoom - this.state.zoom) * ZOOM_LERP;
  }
}

/**
 * Seeded pseudo-random number generator (mulberry32).
 *
 * Why this exists
 * ───────────────
 * Two sites used unseeded `Math.random()` inside the simulation:
 *   - `ProjectileManager` — bullet spread angle / scale jitter
 *   - `sub/TrapTickBehavior` — earthquake ring elevation
 * Both make a replay diverge from its recording. Visual-only randomness
 * (particleBuilders, weatherBuilders, materialBuilders — ~20 sites) is
 * deliberately left on `Math.random()`: it never feeds back into physics.
 *
 * mulberry32 is chosen for being tiny, fast, and having good enough
 * distribution for gameplay jitter. It is NOT cryptographic.
 *
 * Determinism contract: same seed + same call order → same sequence. Call
 * order matters, so adding an `rng.next()` call upstream shifts everything
 * downstream. That is expected and is why replays are re-recorded when
 * simulation code changes.
 */
export class Rng {
  private _state: number;

  constructor(seed = 0x9e3779b9) {
    // Force to uint32; a 0 seed is legal for mulberry32 but we avoid it by
    // defaulting to the golden-ratio constant.
    this._state = seed >>> 0;
  }

  /** Next float in [0, 1). Drop-in replacement for Math.random(). */
  next(): number {
    this._state = (this._state + 0x6d2b79f5) >>> 0;
    let t = this._state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Next float in [min, max). */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Next float in [-1, 1) — the common "signed jitter" case. */
  signed(): number {
    return this.next() * 2 - 1;
  }

  /** Reseed. Used when starting a scenario or replaying a recording. */
  reseed(seed: number): void {
    this._state = seed >>> 0;
  }
}

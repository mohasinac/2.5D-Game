/**
 * Deterministic simulation clock.
 *
 * Why this exists
 * ───────────────
 * Before this, 13 sites across SpawnManager, TrapManager, RotationManager,
 * BuffDebuffManager, SpecialMoveManager and WallPivotAnimator called
 * `performance.now()` *inside the simulation step*. Wall-clock reads inside a
 * step are a hard determinism break: the same input replayed twice produces
 * different results, because the second run reads different timestamps.
 *
 * The worst case was `WallPivotAnimator`, which made a wall's rotation a
 * function of real time — so the arena *geometry itself* was non-deterministic
 * and a replay could collide with a wall that had moved.
 *
 * Sim time starts at 0 and advances *only* by the dt the loop hands it. Replay
 * the same dt sequence and every timestamp is identical, which is what the
 * episode-replay player and (later) client-side prediction both require.
 *
 * This is NOT wall time. Do not use it for UI animation, profiling, or
 * anything that should keep running while the sim is frozen (`dt = 0`).
 */
export class SimClock {
  private _ms = 0;

  /** Advance sim time. Called once per fixed step by the render loop. */
  advance(dtMs: number): void {
    // Guard against NaN/negative dt poisoning sim time irrecoverably.
    if (!Number.isFinite(dtMs) || dtMs < 0) return;
    this._ms += dtMs;
  }

  /** Milliseconds of simulated time since the clock was created or reset. */
  nowMs(): number { return this._ms; }

  /** Seconds of simulated time. Convenience for the many `now() / 1000` sites. */
  nowSec(): number { return this._ms / 1000; }

  /** Reset to zero — used when loading a scenario or restarting a replay. */
  reset(): void { this._ms = 0; }
}

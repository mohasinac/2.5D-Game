import { FEEDBACK, tierForImpulse, hitStopScale, type FeedbackTier } from './BattleGauges';

/* ══════════════════════════════════════════════════════════════════════════
   GAME FEEL — the "flashing"

   `FEEDBACK`, `tierForImpulse` and `hitStopScale` were authored in full and
   had NO CALLER ANYWHERE, not even in tests for two of the three. Meanwhile
   `BeySystem` computed a real impulse for every contact and `ArenaSandbox`
   used those contacts only to award gauge — the magnitude was discarded. So
   the one number that says how hard a hit was never reached the one table
   that says what a hit should look like.

   This is the join. It owns the live state (how many freeze frames remain,
   how much shake is left to decay) because none of that belongs in a pure
   table, and the screen should not be hand-rolling timers either.

   THE DISCIPLINE, from the plan: hit-stop and screen shake are the strongest
   and most abusable tools, so they are reserved for real impact. `small` is
   deliberately flash-only — a bey riding a speed line must trigger neither,
   and that is an acceptance test, not a preference.
   ══════════════════════════════════════════════════════════════════════════ */

export interface ShakeOffset { x: number; y: number }

export class GameFeel {
  private stopFrames = 0;
  private shakeAmp = 0;
  /** Per-bey flash expiry, sim-ms. */
  private flashUntil = new Map<string, number>();

  /**
   * Register an impact. Returns the tier so the caller can drive sound and
   * particles from the same decision rather than re-deriving it.
   */
  impact(impulse: number, ids: readonly string[], nowMs: number): FeedbackTier {
    const tier = tierForImpulse(Math.abs(impulse));
    const spec = FEEDBACK[tier];

    /* Take the STRONGEST pending response rather than summing. Two clashes in
       one tick should not freeze the game for ten frames — stacking is how
       juice turns into lag. */
    this.stopFrames = Math.max(this.stopFrames, spec.hitStopFrames);
    this.shakeAmp   = Math.max(this.shakeAmp, spec.shake);
    for (const id of ids) {
      this.flashUntil.set(id, Math.max(this.flashUntil.get(id) ?? 0, nowMs + spec.flashMs));
    }
    return tier;
  }

  /**
   * Advance one frame. Returns the dt scale the caller should apply.
   *
   * 0 means frozen. The fixed-timestep accumulator already supports holding
   * `dt = 0` — it was built for the demo runner — which is what makes hit-stop
   * nearly free here instead of a special case in the loop.
   */
  tick(): number {
    const scale = hitStopScale(this.stopFrames);
    if (this.stopFrames > 0) {
      this.stopFrames--;
      /* Frozen frames do not decay the shake, or a long freeze would eat the
         shake it was supposed to emphasise. */
      return scale;
    }
    this.shakeAmp *= SHAKE_DECAY;
    if (this.shakeAmp < 0.01) this.shakeAmp = 0;
    return scale;
  }

  /** Camera offset for this frame, cm. Zero when nothing is shaking. */
  shake(seed: number): ShakeOffset {
    if (this.shakeAmp <= 0) return { x: 0, y: 0 };
    /* Deterministic from the sim clock rather than `Math.random()`, so a
       replay shakes identically — the same rule the rest of `sim/` follows. */
    return {
      x: Math.sin(seed * 12.9898) * this.shakeAmp,
      y: Math.cos(seed * 78.2330) * this.shakeAmp,
    };
  }

  /** Is this bey still flashing? */
  isFlashing(id: string, nowMs: number): boolean {
    return (this.flashUntil.get(id) ?? 0) > nowMs;
  }

  get frozen(): boolean { return this.stopFrames > 0; }

  reset(): void {
    this.stopFrames = 0;
    this.shakeAmp = 0;
    this.flashUntil.clear();
  }
}

/** Per-frame shake falloff. ~8 frames to silence from the large tier. */
const SHAKE_DECAY = 0.82;

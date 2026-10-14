/* ══════════════════════════════════════════════════════════════════════════
   PHASE 10 — THE SHARED EASING HELPER

   `TranslationManager` already does this correctly: `_ease(t, easing)` with
   linear / ease_in / ease_out / smooth, plus once / loop / pingpong loop
   modes. Nothing else in the project uses it.

   So `SegmentAnimator` is a HARD SQUARE WAVE — inside its hold window it snaps
   to the offset pose, outside it snaps home, with no interpolation at all. An
   animated bridge therefore TELEPORTS between two poses rather than moving.
   Wall `step` rotation has the same character, and the unanimated trap
   variants (chomper, hammer, saw) have no actuation curve to animate along.

   One small utility, applied in five places, turns every animation in the
   project from a snap into a motion. It lives in `utils/` rather than `sim/`
   because it is presentation timing, not physics — nothing here may be used
   to decide a collision outcome.
   ══════════════════════════════════════════════════════════════════════════ */

export type EasingKind = 'linear' | 'ease_in' | 'ease_out' | 'smooth';
export type LoopMode   = 'once' | 'loop' | 'pingpong';

/** Clamp to the unit interval. Every curve below assumes its input is in it. */
const unit = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

/**
 * Apply an easing curve to a normalised time.
 *
 * `smooth` is the classic smoothstep `3t² − 2t³`: zero derivative at both
 * ends, which is what stops a looping animation from visibly jerking as it
 * wraps. `ease_out` is `t(2 − t)`, matching what `TranslationManager` already
 * ships so moving this out of that class cannot change its behaviour.
 */
export function ease(t: number, kind: EasingKind): number {
  const u = unit(t);
  switch (kind) {
    case 'linear':   return u;
    case 'ease_in':  return u * u;
    case 'ease_out': return u * (2 - u);
    case 'smooth':   return u * u * (3 - 2 * u);
  }
}

/**
 * Normalised progress for an animation of `duration` seconds at `elapsed`.
 *
 * `pingpong` folds the second half of each cycle back, so a 0→1→0 sweep takes
 * one full period rather than two — the behaviour an oscillating bridge
 * segment or a hammer trap wants.
 */
export function progress(elapsed: number, duration: number, mode: LoopMode): number {
  if (duration <= 0) return 1;
  const raw = elapsed / duration;
  switch (mode) {
    case 'once':
      return unit(raw);
    case 'loop':
      return raw - Math.floor(raw);
    case 'pingpong': {
      const cycle = raw % 2;
      const folded = cycle < 0 ? cycle + 2 : cycle;
      return folded <= 1 ? folded : 2 - folded;
    }
  }
}

/** Eased progress: the one call every animated feature should make. */
export function animate(
  elapsed: number, duration: number, mode: LoopMode, kind: EasingKind,
): number {
  return ease(progress(elapsed, duration, mode), kind);
}

/* ── Hazard actuation and telegraphs ─────────────────────────────────────── */

/**
 * A hazard's actuation cycle: wind up, strike, recover, rest.
 *
 * Hazards currently have NO TELEGRAPH — nothing warns the player before a trap
 * fires, which is what makes a hazard feel random rather than fair. The
 * windup phase exists so a visual can be driven off it, and
 * `ConditionEvaluator.evalTrapPeriodic` already computes the timing this
 * reads, so nothing new has to track when a trap is due.
 */
export type HazardPhase = 'rest' | 'windup' | 'strike' | 'recover';

export interface HazardCycle {
  /** Seconds of visible warning before the strike. */
  windup: number;
  /** Seconds of the dangerous part. */
  strike: number;
  /** Seconds returning to rest. */
  recover: number;
  /** Seconds idle before the next windup. */
  rest: number;
}

export interface HazardFrame {
  phase: HazardPhase;
  /** 0..1 within the current phase, eased for `strike` and `recover`. */
  t: number;
  /** True only while the hazard can actually hurt something. */
  dangerous: boolean;
}

/**
 * Where a hazard is in its cycle at `elapsed` seconds.
 *
 * The strike is deliberately NOT eased: a hammer should arrive abruptly. The
 * recovery is eased out, because a hammer that snaps back looks like it
 * teleported — which is precisely the `SegmentAnimator` problem this module
 * exists to fix.
 */
export function hazardFrame(elapsed: number, cycle: HazardCycle): HazardFrame {
  const total = cycle.windup + cycle.strike + cycle.recover + cycle.rest;
  if (total <= 0) return { phase: 'rest', t: 0, dangerous: false };

  let t = elapsed % total;
  if (t < 0) t += total;

  if (t < cycle.windup) {
    return { phase: 'windup', t: ease(t / cycle.windup, 'ease_in'), dangerous: false };
  }
  t -= cycle.windup;

  if (t < cycle.strike) {
    return { phase: 'strike', t: cycle.strike > 0 ? t / cycle.strike : 1, dangerous: true };
  }
  t -= cycle.strike;

  if (t < cycle.recover) {
    return { phase: 'recover', t: ease(t / cycle.recover, 'ease_out'), dangerous: false };
  }
  t -= cycle.recover;

  return { phase: 'rest', t: cycle.rest > 0 ? t / cycle.rest : 1, dangerous: false };
}

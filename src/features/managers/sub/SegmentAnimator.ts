/**
 * Stateless singleton for bridge segment pivot animation.
 * BridgeManager.tick() delegates to this for each segment.
 * Extracted from the inline loop in ArenaSandbox.onTick().
 *
 * WAS A HARD SQUARE WAVE. Inside the hold window it snapped to the offset
 * pose and outside it snapped home, with no interpolation at all — so an
 * animated bridge TELEPORTED between two poses rather than moving. The
 * easing `TranslationManager` has always had is now shared from
 * `utils/easing`, so the pose is swept rather than switched.
 *
 * The cycle is read as: rise over the first third of the hold, sit at the
 * offset pose for the middle third, fall back over the last — then rest.
 * That keeps the authored `animHoldMs` meaning "how long it is displaced"
 * while giving the movement somewhere to happen.
 */

import type { BridgeSegmentData } from '../../../types/arenaTypes';
import { ease } from '../../../utils/easing';

const DEG2RAD = Math.PI / 180;

/** Fraction of the hold window spent moving, at each end. */
const TRANSIT_FRAC = 0.33;

export class SegmentAnimator {
  tick(seg: BridgeSegmentData, dtMs: number): void {
    if (!seg.animEnabled || !seg._animPivot) return;
    seg._animTimer += dtMs;
    const effectiveTime = seg._animTimer - seg.animStartMs;
    if (effectiveTime < 0) return;

    const interval = Math.max(1, seg.animIntervalMs);
    const hold     = Math.min(seg.animHoldMs, interval);
    const phase    = effectiveTime % interval;

    /* `k` is how far toward the offset pose we are, 0..1. The old code only
       ever produced 0 or 1, which is exactly what a teleport is. */
    let k: number;
    if (hold <= 0) {
      k = 0;
    } else if (phase < hold) {
      const transit = Math.max(1, hold * TRANSIT_FRAC);
      if (phase < transit)              k = ease(phase / transit, 'smooth');
      else if (phase > hold - transit)  k = ease((hold - phase) / transit, 'smooth');
      else                              k = 1;
    } else {
      k = 0;
    }

    seg._animPivot.position.set(
      seg._animCenter.x + seg.animOffsetX * k,
      seg._animCenter.y + seg.animOffsetY * k,
      seg._animCenter.z + seg.animOffsetZ * k,
    );
    seg._animPivot.rotation.set(
      seg.animRotX * DEG2RAD * k,
      seg.animRotY * DEG2RAD * k,
      seg.animRotZ * DEG2RAD * k,
    );
  }
}

export const segmentAnimator = new SegmentAnimator();

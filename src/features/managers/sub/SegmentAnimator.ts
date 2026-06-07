/**
 * Stateless singleton for bridge segment pivot animation.
 * BridgeManager.tick() delegates to this for each segment.
 * Extracted from the inline loop in ArenaSandbox.onTick().
 */

import type { BridgeSegmentData } from '../../../types/arenaTypes';

const DEG2RAD = Math.PI / 180;

export class SegmentAnimator {
  tick(seg: BridgeSegmentData, dtMs: number): void {
    if (!seg.animEnabled || !seg._animPivot) return;
    seg._animTimer += dtMs;
    const effectiveTime = seg._animTimer - seg.animStartMs;
    if (effectiveTime < 0) return;
    const interval = Math.max(1, seg.animIntervalMs);
    const hold     = Math.min(seg.animHoldMs, interval);
    const phase    = effectiveTime % interval;
    if (phase < hold) {
      seg._animPivot.position.set(
        seg._animCenter.x + seg.animOffsetX,
        seg._animCenter.y + seg.animOffsetY,
        seg._animCenter.z + seg.animOffsetZ,
      );
      seg._animPivot.rotation.set(
        seg.animRotX * DEG2RAD,
        seg.animRotY * DEG2RAD,
        seg.animRotZ * DEG2RAD,
      );
    } else {
      seg._animPivot.position.copy(seg._animCenter);
      seg._animPivot.rotation.set(0, 0, 0);
    }
  }
}

export const segmentAnimator = new SegmentAnimator();

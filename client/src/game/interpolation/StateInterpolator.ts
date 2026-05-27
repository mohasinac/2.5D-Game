import { lerp, lerpAngle, clamp01 } from "./lerpUtils";

interface BeySnapshot {
  time: number;
  x: number;
  y: number;
  angle: number;
  spin: number;
  wobbleAmplitude: number;
  beyTiltAngle: number;
  adhering: boolean;
  wallClimbing: boolean;
  // Non-interpolated — take latest value immediately
  spinDirection: string;
  specialMoveActive: boolean;
  comboPhase: string;
  combinationLocked: boolean;
}

const RING_SIZE = 4; // 4-tick ring buffer (≈66ms at 60Hz)
const EXTRAPOLATE_MAX = 1.5; // extrapolate at most 1.5 intervals ahead

export class StateInterpolator {
  /** Ring buffer: up to RING_SIZE snapshots per bey, oldest-first. */
  private snapshots = new Map<string, BeySnapshot[]>();
  private renderDelay = 1000 / 60; // stay 1 tick behind (16.7ms)

  push(beyId: string, snap: BeySnapshot): void {
    const ring = this.snapshots.get(beyId);
    if (!ring) {
      this.snapshots.set(beyId, [snap]);
    } else {
      ring.push(snap);
      // Evict oldest when ring is full
      if (ring.length > RING_SIZE) ring.shift();
    }
  }

  getInterpolated(beyId: string, now: number): BeySnapshot | null {
    const ring = this.snapshots.get(beyId);
    if (!ring || ring.length === 0) return null;
    if (ring.length === 1) return ring[0];

    const renderTime = now - this.renderDelay;

    // Walk ring from most-recent backward to find straddling pair
    for (let i = ring.length - 1; i >= 1; i--) {
      const curr = ring[i];
      const prev = ring[i - 1];
      if (renderTime >= prev.time) {
        const interval = curr.time - prev.time;
        if (interval <= 0) return curr;

        let t: number;
        if (renderTime <= curr.time) {
          // Normal interpolation between prev and curr
          t = clamp01((renderTime - prev.time) / interval);
        } else {
          // Extrapolation: renderTime has overshot curr — extrapolate forward
          const overshoot = (renderTime - curr.time) / interval;
          if (overshoot > EXTRAPOLATE_MAX) return curr; // too far ahead, snap
          t = 1 + overshoot;
        }

        // Extrapolation clamps x/y to avoid runaway divergence
        const extClamp = (v: number) => t > 1 ? lerp(prev[v as unknown as never] as number, (curr as any)[v], Math.min(t, EXTRAPOLATE_MAX)) : lerp((prev as any)[v], (curr as any)[v], t);
        void extClamp; // unused — using explicit lerp below

        const lerpT = Math.min(t, EXTRAPOLATE_MAX);
        return {
          ...curr, // non-positional: take latest
          x: lerp(prev.x, curr.x, lerpT),
          y: lerp(prev.y, curr.y, lerpT),
          angle: lerpAngle(prev.angle, curr.angle, Math.min(t, 1)), // don't extrapolate angle
          spin: lerp(prev.spin, curr.spin, Math.min(t, 1)),
          wobbleAmplitude: lerp(prev.wobbleAmplitude, curr.wobbleAmplitude, Math.min(t, 1)),
          beyTiltAngle: lerp(prev.beyTiltAngle, curr.beyTiltAngle, Math.min(t, 1)),
        };
      }
    }

    // renderTime is before the oldest snapshot — return oldest
    return ring[0];
  }

  remove(beyId: string): void {
    this.snapshots.delete(beyId);
  }

  clear(): void {
    this.snapshots.clear();
  }
}

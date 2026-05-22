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

export class StateInterpolator {
  private snapshots = new Map<string, [BeySnapshot, BeySnapshot]>();
  private renderDelay = 1000 / 60; // stay 1 tick behind (16.7ms)

  push(beyId: string, snap: BeySnapshot): void {
    const pair = this.snapshots.get(beyId);
    if (pair) {
      this.snapshots.set(beyId, [pair[1], snap]);
    } else {
      this.snapshots.set(beyId, [snap, snap]);
    }
  }

  getInterpolated(beyId: string, now: number): BeySnapshot | null {
    const pair = this.snapshots.get(beyId);
    if (!pair) return null;
    const [prev, curr] = pair;
    if (curr.time === prev.time) return curr;

    const renderTime = now - this.renderDelay;
    const t = clamp01((renderTime - prev.time) / (curr.time - prev.time));

    return {
      ...curr, // non-positional: take latest
      x: lerp(prev.x, curr.x, t),
      y: lerp(prev.y, curr.y, t),
      angle: lerpAngle(prev.angle, curr.angle, t),
      spin: lerp(prev.spin, curr.spin, t),
      wobbleAmplitude: lerp(prev.wobbleAmplitude, curr.wobbleAmplitude, t),
      beyTiltAngle: lerp(prev.beyTiltAngle, curr.beyTiltAngle, t),
    };
  }

  remove(beyId: string): void {
    this.snapshots.delete(beyId);
  }

  clear(): void {
    this.snapshots.clear();
  }
}

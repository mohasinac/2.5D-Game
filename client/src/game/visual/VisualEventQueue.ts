export const enum VisualPriority {
  CRITICAL = 0,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export interface VisualEvent {
  priority: VisualPriority;
  type:
    | "combo-visual"
    | "special-move-camera"
    | "meteor-strike-hang"
    | "sprite-swap"
    | "particle"
    | "sfx"
    | "burst";
  payload: unknown;
  expiryTick?: number;
}

// Max events processed per rAF frame per priority level
const PER_FRAME_LIMITS: Record<number, number> = {
  [VisualPriority.CRITICAL]: 1,
  [VisualPriority.HIGH]: 2,
  [VisualPriority.MEDIUM]: 1,
  [VisualPriority.LOW]: 1,
};

export class VisualEventQueue {
  private queue: VisualEvent[] = [];

  push(event: VisualEvent): void {
    this.queue.push(event);
    // Sort by priority ascending (lower number = higher priority)
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  /** Call once per rAF frame — returns events to process this frame. */
  drain(currentTick: number): VisualEvent[] {
    const counts: Record<number, number> = {
      [VisualPriority.CRITICAL]: 0,
      [VisualPriority.HIGH]: 0,
      [VisualPriority.MEDIUM]: 0,
      [VisualPriority.LOW]: 0,
    };
    const toProcess: VisualEvent[] = [];
    const remaining: VisualEvent[] = [];

    for (const ev of this.queue) {
      // Discard expired events
      if (ev.expiryTick !== undefined && ev.expiryTick < currentTick) continue;

      const limit = PER_FRAME_LIMITS[ev.priority] ?? 1;
      if (counts[ev.priority] < limit) {
        toProcess.push(ev);
        counts[ev.priority]++;
      } else {
        remaining.push(ev);
      }
    }

    this.queue = remaining;
    return toProcess;
  }

  get size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

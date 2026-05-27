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

// These event types are deduplicated by (beyId + type): only the highest-priority
// (lowest number) instance is kept when a duplicate arrives.
// "sfx" and "particle" are never deduped — multiple simultaneous sfx/particles are valid.
const DEDUP_TYPES = new Set<VisualEvent["type"]>([
  "burst",
  "combo-visual",
  "special-move-camera",
  "sprite-swap",
  "meteor-strike-hang",
]);

export class VisualEventQueue {
  private queue: VisualEvent[] = [];

  push(event: VisualEvent): void {
    // ── Deduplication by (beyId + type) ──────────────────────────────────────
    if (DEDUP_TYPES.has(event.type)) {
      const beyId = (event.payload as Record<string, unknown>)?.beyId as string | undefined;
      const key = `${event.type}:${beyId ?? ""}`;
      const existing = this.queue.findIndex(e =>
        e.type === event.type &&
        ((e.payload as Record<string, unknown>)?.beyId as string | undefined) === beyId
      );
      if (existing !== -1) {
        const existingEv = this.queue[existing];
        // Replace if new event has equal or higher priority (lower number); discard if lower
        if (event.priority <= existingEv.priority) {
          this.queue.splice(existing, 1);
        } else {
          return; // existing has higher priority — discard new
        }
      }
      void key; // suppress unused-variable lint
    }

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

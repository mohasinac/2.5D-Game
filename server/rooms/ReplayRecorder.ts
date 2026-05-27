// [SERVER] ReplayRecorder — records match state at ~20Hz for killcam and full replay.
// Wire into BattleRoom: call recordFrame() every 3 ticks, recordEvent() on eliminations.
// On series end: write getReplayData() to Firestore match_replays/{matchId}.
// On elimination: broadcast "death-replay" with getLastNSeconds(5).

export interface ReplayBeySnapshot {
  x: number;
  y: number;
  angle: number;
  spin: number;
  tiltAngle: number;
  isActive: boolean;
}

export type ReplayEventType = "burst" | "ringout" | "spinout" | "collision" | "special";

export interface ReplayEvent {
  type: ReplayEventType;
  payload: unknown;
}

export interface ReplayFrame {
  tick: number;
  timestampMs: number;
  positions: Record<string, ReplayBeySnapshot>;
  events: ReplayEvent[];
}

export interface ReplayData {
  frames: ReplayFrame[];
  tickRateHz: number;
  totalTicks: number;
  matchId: string;
}

export class ReplayRecorder {
  private frames: ReplayFrame[] = [];
  private pendingEvents: ReplayEvent[] = [];
  private currentTick = 0;
  private readonly maxFrames: number;

  /**
   * @param matchId  Room/match ID used as Firestore document key.
   * @param tickRateHz  Recording rate in frames per second (default 20 = every 3 game ticks at 60Hz).
   * @param maxDurationS  Maximum replay buffer in seconds (default 300 = 5 min).
   */
  constructor(
    private readonly matchId: string,
    private readonly tickRateHz: number = 20,
    maxDurationS: number = 300,
  ) {
    this.maxFrames = tickRateHz * maxDurationS;
  }

  /**
   * Record a snapshot of all beyblades.  Call this every 3 ticks (~20Hz at 60Hz server).
   * `beyblades` is a Colyseus MapSchema<Beyblade> or any iterable of [id, bey] pairs.
   */
  recordFrame(beyblades: Map<string, {
    x: number; y: number; angle: number; spin: number;
    tiltAngle?: number; isActive: boolean;
  }>): void {
    const positions: Record<string, ReplayBeySnapshot> = {};
    beyblades.forEach((bey, id) => {
      positions[id] = {
        x: bey.x,
        y: bey.y,
        angle: bey.angle ?? 0,
        spin: bey.spin,
        tiltAngle: bey.tiltAngle ?? 0,
        isActive: bey.isActive,
      };
    });

    const frame: ReplayFrame = {
      tick: this.currentTick++,
      timestampMs: Date.now(),
      positions,
      events: this.pendingEvents.splice(0), // drain pending events into this frame
    };

    this.frames.push(frame);

    // Ring eviction — keep only the most recent maxFrames
    if (this.frames.length > this.maxFrames) {
      this.frames.shift();
    }
  }

  /**
   * Record a discrete event (burst, ring-out, special, etc.) to be attached to
   * the next recorded frame.
   */
  recordEvent(type: ReplayEventType, payload: unknown): void {
    this.pendingEvents.push({ type, payload });
  }

  /**
   * Return the full replay buffer for Firestore persistence.
   */
  getReplayData(): ReplayData {
    return {
      frames: this.frames,
      tickRateHz: this.tickRateHz,
      totalTicks: this.currentTick,
      matchId: this.matchId,
    };
  }

  /**
   * Return the most recent `n` seconds of frames — used for killcam broadcasts.
   */
  getLastNSeconds(n: number): ReplayFrame[] {
    const cutoffMs = Date.now() - n * 1000;
    const idx = this.frames.findIndex(f => f.timestampMs >= cutoffMs);
    return idx >= 0 ? this.frames.slice(idx) : [...this.frames];
  }

  clear(): void {
    this.frames = [];
    this.pendingEvents = [];
    this.currentTick = 0;
  }
}

// [CLIENT] ReplayPlayer — plays back a recorded match replay or killcam segment.
//
// Usage (killcam — called from useColyseus on "death-replay" message):
//   const player = new ReplayPlayer(stateInterpolator);
//   player.load(frames);
//   player.play(5000, onFinished); // auto-plays 5s then calls onFinished
//   player.skip(); // user presses skip
//
// Usage (full replay — ?replay=<matchId> route):
//   const player = new ReplayPlayer(stateInterpolator);
//   await player.loadFromFirestore(matchId, db);
//   player.play(Infinity, onFinished);

import type { StateInterpolator } from "../interpolation/StateInterpolator";

export interface ReplayBeySnapshot {
  x: number;
  y: number;
  angle: number;
  spin: number;
  tiltAngle: number;
  isActive: boolean;
}

export interface ReplayEvent {
  type: string;
  payload: unknown;
}

export interface ReplayFrame {
  tick: number;
  timestampMs: number;
  positions: Record<string, ReplayBeySnapshot>;
  events: ReplayEvent[];
}

export class ReplayPlayer {
  private frames: ReplayFrame[] = [];
  private rafHandle: number | null = null;
  private playStartMs = 0;
  private replayStartMs = 0;
  private durationMs = 0;
  private onFinished: (() => void) | null = null;

  /** True while a replay is actively running. Renderer can use this to tint beys. */
  isReplayMode = false;

  constructor(private readonly interpolator: StateInterpolator) {}

  /**
   * Load frames from a server "death-replay" message or a Firestore replay doc.
   */
  load(frames: ReplayFrame[]): void {
    this.frames = frames.slice().sort((a, b) => a.timestampMs - b.timestampMs);
    this.isReplayMode = false;
  }

  /**
   * Fetch and load a replay from Firestore `match_replays/{matchId}`.
   * Pass a Firestore `db` instance (firebase/app firestore).
   */
  async loadFromFirestore(matchId: string, db: import("firebase/firestore").Firestore): Promise<void> {
    const { doc, getDoc } = await import("firebase/firestore");
    const snap = await getDoc(doc(db, "match_replays", matchId));
    if (!snap.exists()) throw new Error(`Replay ${matchId} not found in Firestore`);
    const data = snap.data();
    const frames: ReplayFrame[] = data.frames ?? [];
    this.load(frames);
  }

  /**
   * Start playback.
   * @param durationMs  Maximum play time in ms before `onFinished` is called.
   *                    Pass `Infinity` for full-replay mode (play until end of frames).
   * @param onFinished  Callback when replay ends or is skipped.
   */
  play(durationMs: number, onFinished: () => void): void {
    if (this.frames.length === 0) { onFinished(); return; }
    this.stop();

    this.isReplayMode = true;
    this.durationMs = durationMs;
    this.onFinished = onFinished;
    this.playStartMs = performance.now();
    this.replayStartMs = this.frames[0].timestampMs;

    this.scheduleFrame();
  }

  /** Skip the current replay immediately. */
  skip(): void {
    this.stop();
    this.onFinished?.();
    this.onFinished = null;
    this.isReplayMode = false;
  }

  /** Stop playback without calling onFinished (use for cleanup). */
  stop(): void {
    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
  }

  private scheduleFrame(): void {
    this.rafHandle = requestAnimationFrame(() => this.tick());
  }

  private tick(): void {
    const wallNow = performance.now();
    const elapsed = wallNow - this.playStartMs;

    // Check duration limit
    if (elapsed >= this.durationMs) {
      this.stop();
      this.isReplayMode = false;
      this.onFinished?.();
      this.onFinished = null;
      return;
    }

    // Map wall clock → replay timestamp
    const replayNow = this.replayStartMs + elapsed;

    // Find the pair of frames straddling replayNow and push snapshots
    let prevFrame: ReplayFrame | null = null;
    let nextFrame: ReplayFrame | null = null;
    for (const frame of this.frames) {
      if (frame.timestampMs <= replayNow) prevFrame = frame;
      else if (nextFrame === null) nextFrame = frame;
    }

    const activeFrame = prevFrame ?? nextFrame;
    if (activeFrame) {
      // If we have overshot all frames, loop back or stop
      if (prevFrame && !nextFrame) {
        // All frames played — end of replay
        this.stop();
        this.isReplayMode = false;
        this.onFinished?.();
        this.onFinished = null;
        return;
      }
      this.pushToInterpolator(activeFrame, replayNow);
    }

    // Schedule next rAF
    this.scheduleFrame();
  }

  /**
   * Convert a ReplayFrame to BeySnapshot entries and push into the StateInterpolator
   * so the renderer draws the replay beys via its normal code path.
   */
  private pushToInterpolator(frame: ReplayFrame, replayNow: number): void {
    for (const [beyId, pos] of Object.entries(frame.positions)) {
      if (!pos.isActive) continue;
      // Build a minimal BeySnapshot compatible with StateInterpolator
      (this.interpolator as any).push(beyId, {
        time: replayNow,
        x: pos.x,
        y: pos.y,
        angle: pos.angle,
        spin: pos.spin,
        wobbleAmplitude: 0,
        beyTiltAngle: pos.tiltAngle ?? 0,
        adhering: false,
        wallClimbing: false,
        spinDirection: "clockwise",
        specialMoveActive: false,
        comboPhase: "",
        combinationLocked: false,
      });
    }
  }
}

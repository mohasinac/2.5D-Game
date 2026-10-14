/* ══════════════════════════════════════════════════════════════════════════
   PHASE 10b (part 1) — PER-ENTITY INPUT

   Today `InputManager` is a MODULE-LEVEL SINGLETON that attaches
   `document.keydown`/`keyup` at import time, and `SpawnManager` adds its own
   raw `document.addEventListener` on top for the R key. Two consequences:
   two local players cannot both have a keyboard scheme, and no input is
   scoped to an entity.

   The fix is one shape — `InputFrame` — produced per entity per tick by any
   of three sources:

     • a local human (keyboard zone, or a touch zone on mobile)
     • an AI controller
     • later, additively, a network message

   All three emit the SAME shape, so adding network input means adding a
   fourth producer, not changing the consumer. That is the concrete mechanism
   behind "prediction-based movement so the lag is not shown": client-side
   prediction needs an input boundary and a deterministic `sim/` to
   re-simulate against, and both now exist for local-play reasons alone.
   ══════════════════════════════════════════════════════════════════════════ */

/** Everything one entity was asked to do during one tick. */
export interface InputFrame {
  /** Desired heading in XZ, components in -1..1. Not normalised. */
  moveX: number;
  moveZ: number;
  jump: boolean;
  trigger: boolean;
  /** Held this tick, for charge mechanics. */
  guard: boolean;
  /** Keys pressed THIS tick, for combo detection. */
  pressed: readonly string[];
}

export const EMPTY_FRAME: InputFrame = Object.freeze({
  moveX: 0, moveZ: 0, jump: false, trigger: false, guard: false, pressed: [],
});

/** Anything that can drive an entity. Human, AI, or one day the network. */
export interface InputSource {
  readonly id: string;
  /** Build this tick's frame. Must not read the wall clock. */
  sample(dt: number): InputFrame;
}

/**
 * Per-entity input, gathered once per tick.
 *
 * The consumer (`BeySystem`) only ever sees `Map<beyId, InputFrame>`, so it
 * cannot tell a human from an AI from a replay — which is exactly the
 * property the plan's acceptance test checks by swapping one for the other
 * in a replay without code changes.
 */
export class InputSystem {
  private sources = new Map<string, InputSource>();
  private frames  = new Map<string, InputFrame>();

  /** Bind a source to an entity. Replaces any existing binding. */
  bind(beyId: string, source: InputSource): void {
    this.sources.set(beyId, source);
  }

  unbind(beyId: string): void {
    this.sources.delete(beyId);
    this.frames.delete(beyId);
  }

  /** Sample every bound source. Call once per tick, before stepping. */
  gather(dt: number): ReadonlyMap<string, InputFrame> {
    this.frames.clear();
    for (const [beyId, src] of this.sources) {
      this.frames.set(beyId, src.sample(dt));
    }
    return this.frames;
  }

  frameFor(beyId: string): InputFrame {
    return this.frames.get(beyId) ?? EMPTY_FRAME;
  }

  clear(): void {
    this.sources.clear();
    this.frames.clear();
  }
}

/**
 * A source fed by explicit writes — for tests, replays, and network input.
 *
 * Having this exist is what makes the input boundary real rather than
 * aspirational: a replay driving `BeySystem` through this is indistinguishable
 * from a human driving it through a keyboard.
 */
export class ScriptedInputSource implements InputSource {
  private next: InputFrame = EMPTY_FRAME;
  constructor(readonly id: string) {}
  set(frame: Partial<InputFrame>): void {
    this.next = { ...EMPTY_FRAME, ...frame };
  }
  sample(): InputFrame { return this.next; }
}

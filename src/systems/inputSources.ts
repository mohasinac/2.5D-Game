import type { InputFrame, InputSource } from './InputSystem';
import { EMPTY_FRAME } from './InputSystem';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 17b — LOCAL MULTIPLAYER INPUT

   Two players on one machine, which the old design made impossible rather
   than merely absent: `InputManager` is a MODULE-LEVEL SINGLETON that
   attaches `document.keydown`/`keyup` at import time, so there is exactly
   one keyboard state for the whole app and no way to ask "what is player
   two holding".

   Each source below produces the same `InputFrame`. `BeySystem` cannot tell
   them apart, which is the property that lets a human, an AI and a replay be
   swapped for one another — and the same seam a network producer would use
   later without the consumer changing.

   SCHEMES ARE DISJOINT BY CONSTRUCTION. P1 is WASD + Space/F, P2 is the
   arrow cluster + Enter/Shift. They share no key, because the failure mode
   of overlapping schemes is not an error — it is both beys twitching, which
   reads as a physics bug.
   ══════════════════════════════════════════════════════════════════════════ */

export interface KeyScheme {
  up: string; down: string; left: string; right: string;
  jump: string; trigger: string; guard: string;
}

/**
 * Player one: the left half of the keyboard.
 *
 * TRIGGER IS `KeyT`, NOT `KeyF`. `KeyF` is bound globally to the fullscreen
 * toggle (`main.ts`), so the special-move key was toggling fullscreen instead
 * of firing — and the on-screen hint already said "T", which is what
 * `ControlManager` has always bound. The scheme was the odd one out.
 */
export const SCHEME_P1: KeyScheme = {
  up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD',
  jump: 'Space', trigger: 'KeyT', guard: 'KeyG',
};

/** Player two: the arrow cluster and its neighbours. */
export const SCHEME_P2: KeyScheme = {
  up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight',
  jump: 'Enter', trigger: 'ShiftRight', guard: 'ControlRight',
};

/** Every scheme must be disjoint, or both beys respond to one key. */
export function schemesConflict(a: KeyScheme, b: KeyScheme): string[] {
  const av = new Set(Object.values(a));
  return Object.values(b).filter(k => av.has(k));
}

/**
 * A keyboard half.
 *
 * Owns its OWN listeners rather than reading a shared singleton, so two of
 * these coexist without interfering. `pressed` is drained each sample so a
 * combo sees each key exactly once — leaving it to accumulate would let one
 * tap match a sequence on several consecutive frames.
 */
/**
 * The combo alphabet. Every input source emits THESE, whatever it is driven by.
 *
 * Combos could never match before, and the token namespace is half the reason:
 * the keyboard pushed raw `e.code` (`'KeyW'`), touch pushed `'JUMP'`, and the
 * AI pushed nothing at all. One combo definition cannot match three different
 * languages, so a sequence authored for the keyboard was unreachable on touch
 * and unreachable for every AI opponent — and the mismatch is silent, because
 * a combo that never matches looks exactly like a combo nobody input.
 *
 * Semantic rather than physical, so rebinding a key cannot break a combo.
 */
export type ComboToken = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'JUMP' | 'TRIGGER' | 'GUARD';

/** Scheme slot -> canonical token. */
const SLOT_TOKEN: Record<keyof KeyScheme, ComboToken> = {
  up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT',
  jump: 'JUMP', trigger: 'TRIGGER', guard: 'GUARD',
};

export class KeyboardInputSource implements InputSource {
  private held = new Set<string>();
  private pressedThisTick: string[] = [];
  private readonly onDown: (e: KeyboardEvent) => void;
  private readonly onUp: (e: KeyboardEvent) => void;

  constructor(
    readonly id: string,
    private readonly scheme: KeyScheme,
    target: EventTarget = document,
  ) {
    const codes = new Set(Object.values(scheme));
    /* Physical code -> semantic token, derived from the scheme so the two can
       never drift apart. */
    const tokenOf = new Map<string, ComboToken>();
    for (const [slot, code] of Object.entries(scheme)) {
      tokenOf.set(code, SLOT_TOKEN[slot as keyof KeyScheme]);
    }
    this.onDown = (e) => {
      if (!codes.has(e.code)) return;
      /* Arrow keys and Space scroll the page; a second player should not
         move the view every time they jump. */
      e.preventDefault();
      const tok = tokenOf.get(e.code);
      if (!this.held.has(e.code) && tok) this.pressedThisTick.push(tok);
      this.held.add(e.code);
    };
    this.onUp = (e) => { if (codes.has(e.code)) this.held.delete(e.code); };
    target.addEventListener('keydown', this.onDown as EventListener);
    target.addEventListener('keyup', this.onUp as EventListener);
    this.detach = () => {
      target.removeEventListener('keydown', this.onDown as EventListener);
      target.removeEventListener('keyup', this.onUp as EventListener);
    };
  }

  /** Remove the listeners. Must be called, or a screen switch leaks them. */
  detach: () => void;

  sample(): InputFrame {
    const s = this.scheme;
    const frame: InputFrame = {
      moveX: (this.held.has(s.right) ? 1 : 0) - (this.held.has(s.left) ? 1 : 0),
      moveZ: (this.held.has(s.down) ? 1 : 0) - (this.held.has(s.up) ? 1 : 0),
      jump: this.held.has(s.jump),
      trigger: this.held.has(s.trigger),
      guard: this.held.has(s.guard),
      pressed: this.pressedThisTick.slice(),
    };
    this.pressedThisTick.length = 0;
    return frame;
  }
}

/**
 * One touch zone — half a phone screen.
 *
 * `VirtualControlsOverlay` already exists (joystick plus JUMP/TRIG) and is
 * suppressed on desktop via `(hover:hover) and (pointer:fine)`. Two-player
 * mobile needs a second instance mirrored to the other half, and the 44 px
 * touch-target minimum has to hold at HALF WIDTH — on a 390 px portrait
 * screen each player gets 195 px, and `--cm` is already only ~3.9 px there,
 * which is why those targets need explicit pixel minimums rather than
 * `vmin`-derived sizing.
 */
export class TouchZoneInputSource implements InputSource {
  private axis = { x: 0, z: 0 };
  private buttons = { jump: false, trigger: false, guard: false };
  private pressedThisTick: string[] = [];

  constructor(readonly id: string) {}

  /** Last direction token emitted, so holding a direction spells one letter. */
  private lastDir: ComboToken | null = null;

  /** Driven by the overlay: normalised joystick, components in -1..1. */
  setAxis(x: number, z: number): void {
    this.axis.x = Math.max(-1, Math.min(1, x));
    this.axis.z = Math.max(-1, Math.min(1, z));

    /* A joystick has to be able to SPELL, or every combo is desktop-only.
       The dominant axis past a deadzone becomes one token, and it is latched:
       without that, holding left would push LEFT on all sixty frames of a
       second and fill the history with a single letter. */
    const DEAD = 0.5;
    const dir: ComboToken | null =
      Math.abs(this.axis.x) < DEAD && Math.abs(this.axis.z) < DEAD ? null
        : Math.abs(this.axis.x) >= Math.abs(this.axis.z)
          ? (this.axis.x > 0 ? 'RIGHT' : 'LEFT')
          : (this.axis.z > 0 ? 'DOWN' : 'UP');
    if (dir && dir !== this.lastDir) this.pressedThisTick.push(dir);
    this.lastDir = dir;
  }

  setButton(name: 'jump' | 'trigger' | 'guard', down: boolean): void {
    if (down && !this.buttons[name]) {
      this.pressedThisTick.push(name.toUpperCase() as ComboToken);
    }
    this.buttons[name] = down;
  }

  sample(): InputFrame {
    const frame: InputFrame = {
      moveX: this.axis.x, moveZ: this.axis.z,
      jump: this.buttons.jump,
      trigger: this.buttons.trigger,
      guard: this.buttons.guard,
      pressed: this.pressedThisTick.slice(),
    };
    this.pressedThisTick.length = 0;
    return frame;
  }
}

/**
 * A local AI, driven by `forceState`.
 *
 * CS13 Case 630 — the corpus' only `[DESIGN PRINCIPLE]` case — specifies
 * that for AI opponents a force state "is applied literally as an aggression
 * or positioning override". So the compulsion system doubles as the AI
 * design, and an AI is a THIRD producer of the same frame rather than a
 * parallel control path. That is what makes the plan's acceptance test
 * possible: swap the AI for a human in a replay without code changes.
 */
export class AiInputSource implements InputSource {
  constructor(
    readonly id: string,
    private readonly sense: () => {
      selfX: number; selfZ: number;
      targetX: number; targetZ: number;
      force: 'none' | 'must_attack' | 'must_keep_distance' | 'must_stay_still';
    },
  ) {}

  sample(): InputFrame {
    const s = this.sense();
    if (s.force === 'must_stay_still') return EMPTY_FRAME;

    const dx = s.targetX - s.selfX;
    const dz = s.targetZ - s.selfZ;
    const len = Math.hypot(dx, dz) || 1;

    /* `must_keep_distance` inverts the approach rather than disabling it:
       a compelled bey is still driving, just the wrong way, which is what
       makes the counter-play readable to the other player. */
    const sign = s.force === 'must_keep_distance' ? -1 : 1;
    const moveX = (dx / len) * sign;
    const moveZ = (dz / len) * sign;

    /* THE AI MUST SPEAK THE SAME ALPHABET. It previously spread `EMPTY_FRAME`,
       whose `pressed` is always `[]`, so no AI opponent could ever execute a
       combo — not because it chose not to, but because it was mute. Emitting
       the tokens its own movement implies makes an AI frame structurally
       indistinguishable from a human one, which is the property the whole
       input boundary exists for. */
    const pressed: ComboToken[] = [];
    if (Math.abs(moveX) >= Math.abs(moveZ)) pressed.push(moveX > 0 ? 'RIGHT' : 'LEFT');
    else                                    pressed.push(moveZ > 0 ? 'DOWN' : 'UP');
    if (s.force === 'must_attack') pressed.push('TRIGGER');

    return {
      ...EMPTY_FRAME,
      moveX,
      moveZ,
      trigger: s.force === 'must_attack',
      pressed,
    };
  }
}

// useGameInput — four input sources merged into one bitmask, sent every rAF.
// Sources: (1) Keyboard (remappable via keyMap), (2) Mouse (right-drag),
//          (3) Gamepad, (4) Touch (written by TouchControlsGBLayout).
// Arrow keys are always active as movement fallbacks regardless of keyMap.
// Space tap-vs-hold discrimination: < 150ms = specialTap, ≥ 150ms = chargeHeld.

import { useEffect, useRef } from "react";
import { keyMapRef, mouseInputRef, ARROW_FALLBACKS } from "./keyMap";

export interface FullGameInput {
  // Movement
  moveLeft?: boolean;
  moveRight?: boolean;
  moveUp?: boolean;
  moveDown?: boolean;
  // Actions
  jump?: boolean;
  attack?: boolean;
  defense?: boolean;
  dodge?: boolean;
  // Power
  chargeHeld?: boolean;
  specialTap?: boolean;
  // Phase 24 attitude bits (same key as actions — held with movement)
  attitudeAggressive?: boolean;
  attitudeDefensive?: boolean;
  attitudeStamina?: boolean;
  // Combo detection
  comboKeys?: string[];
}

// Shared mutable state written by touch controls, read by the input loop.
export const touchInputState: Partial<FullGameInput> = {};

type SendInputFn = (input: FullGameInput) => void;

const SPACE_TAP_MS    = 150;
const GAMEPAD_DEAD    = 0.15;
const MOUSE_DRAG_PX   = 12;
const HEARTBEAT_MS    = 50;

function encodeBitmask(i: FullGameInput): number {
  let f = 0;
  if (i.moveLeft)           f |= 1 << 0;
  if (i.moveRight)          f |= 1 << 1;
  if (i.moveUp)             f |= 1 << 2;
  if (i.moveDown)           f |= 1 << 3;
  if (i.attack)             f |= 1 << 4;
  if (i.defense)            f |= 1 << 5;
  if (i.dodge)              f |= 1 << 6;
  if (i.jump)               f |= 1 << 7;
  if (i.chargeHeld)         f |= 1 << 8;
  if (i.specialTap)         f |= 1 << 9;
  if (i.attitudeAggressive) f |= 1 << 10;
  if (i.attitudeDefensive)  f |= 1 << 11;
  if (i.attitudeStamina)    f |= 1 << 12;
  return f;
}

export function useGameInput(sendInput: SendInputFn, enabled = true) {
  const keysRef            = useRef<Set<string>>(new Set());
  const rafRef             = useRef<number>(0);
  const chargeDownTimeRef  = useRef<number>(0);   // >0 while charge/space held
  const specialTapRef      = useRef<boolean>(false);
  const gamepadIndexRef    = useRef<number | null>(null);
  const gpSpecialTapRef    = useRef<boolean>(false);
  const lastBitmaskRef     = useRef<number>(-1);
  const lastSentTimeRef    = useRef<number>(0);

  // Mouse right-drag
  const mouseRightRef      = useRef<{ x: number; y: number } | null>(null);
  const mouseDragRef       = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    // ── Gamepad ──────────────────────────────────────────────────────────────
    const onGpIn  = () => { if (gamepadIndexRef.current === null) gamepadIndexRef.current = 0; };
    const onGpOut = () => { gamepadIndexRef.current = null; };
    window.addEventListener("gamepadconnected",    onGpIn);
    window.addEventListener("gamepaddisconnected", onGpOut);

    // ── Keyboard ─────────────────────────────────────────────────────────────
    // Returns true when keyboard focus is on a real text/form element.
    // Game keys are suppressed in that case so the player can type in chat or settings.
    function isTypingFocused(): boolean {
      const el = document.activeElement;
      if (!el) return false;
      const tag = (el as HTMLElement).tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
        (el as HTMLElement).isContentEditable;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingFocused()) return;
      const km = keyMapRef.current;
      // Charge key (default: Space) handled separately
      if (e.code === km.charge) {
        if (chargeDownTimeRef.current === 0) chargeDownTimeRef.current = Date.now();
        e.preventDefault();
        return;
      }
      keysRef.current.add(e.code);
      // Prevent scroll / browser defaults for game keys
      const gameKeys = new Set([
        km.moveLeft, km.moveRight, km.moveUp, km.moveDown,
        km.jump, km.attack, km.defense, km.dodge,
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
      ]);
      if (gameKeys.has(e.code)) e.preventDefault();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (isTypingFocused()) return;
      const km = keyMapRef.current;
      if (e.code === km.charge) {
        const held = chargeDownTimeRef.current > 0
          ? Date.now() - chargeDownTimeRef.current : 999;
        if (held < SPACE_TAP_MS) specialTapRef.current = true;
        chargeDownTimeRef.current = 0;
        return;
      }
      keysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);

    // ── Mouse (right-drag → directional nudge) ────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        mouseRightRef.current = { x: e.clientX, y: e.clientY };
        mouseDragRef.current  = { x: 0, y: 0 };
        e.preventDefault();
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (mouseRightRef.current) {
        mouseDragRef.current = {
          x: e.clientX - mouseRightRef.current.x,
          y: e.clientY - mouseRightRef.current.y,
        };
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        mouseRightRef.current = null;
        mouseDragRef.current  = { x: 0, y: 0 };
      }
    };
    const onContextMenu = (e: Event) => e.preventDefault();

    window.addEventListener("mousedown",   onMouseDown);
    window.addEventListener("mousemove",   onMouseMove);
    window.addEventListener("mouseup",     onMouseUp);
    window.addEventListener("contextmenu", onContextMenu);

    // ── Main rAF loop ─────────────────────────────────────────────────────────
    const loop = () => {
      const keys      = keysRef.current;
      const km        = keyMapRef.current;
      const chargeHeld = chargeDownTimeRef.current > 0;

      // Source 1: Keyboard (remappable) + arrow fallbacks always active
      const kb = {
        moveLeft:  keys.has(km.moveLeft)  || keys.has(ARROW_FALLBACKS.moveLeft  ?? ""),
        moveRight: keys.has(km.moveRight) || keys.has(ARROW_FALLBACKS.moveRight ?? ""),
        moveUp:    keys.has(km.moveUp)    || keys.has(ARROW_FALLBACKS.moveUp    ?? ""),
        moveDown:  keys.has(km.moveDown)  || keys.has(ARROW_FALLBACKS.moveDown  ?? ""),
        jump:      keys.has(km.jump),
        attack:    keys.has(km.attack),
        defense:   keys.has(km.defense),
        dodge:     keys.has(km.dodge),
        chargeHeld,
        specialTap: specialTapRef.current,
        attitudeAggressive: keys.has(km.attack),
        attitudeDefensive:  keys.has(km.defense),
        attitudeStamina:    keys.has(km.dodge),
      };

      // Source 2: Mouse right-drag — only when user explicitly enables it (default OFF)
      const drag  = mouseInputRef.enabled ? mouseDragRef.current : { x: 0, y: 0 };
      const dragX = Math.abs(drag.x);
      const dragY = Math.abs(drag.y);
      const mouse = {
        moveLeft:  dragX > MOUSE_DRAG_PX && drag.x < 0,
        moveRight: dragX > MOUSE_DRAG_PX && drag.x > 0,
        moveUp:    dragY > MOUSE_DRAG_PX && drag.y < 0,
        moveDown:  dragY > MOUSE_DRAG_PX && drag.y > 0,
      };

      // Source 3: Gamepad
      const gp = {
        moveLeft: false, moveRight: false, moveUp: false, moveDown: false,
        jump: false, attack: false, defense: false, dodge: false,
        chargeHeld: false, specialTap: false,
      };
      if (gamepadIndexRef.current !== null) {
        const pads = navigator.getGamepads?.() ?? [];
        const pad  = pads[gamepadIndexRef.current];
        if (pad) {
          if (pad.axes[0] < -GAMEPAD_DEAD) gp.moveLeft  = true;
          if (pad.axes[0] >  GAMEPAD_DEAD) gp.moveRight = true;
          if (pad.axes[1] < -GAMEPAD_DEAD) gp.moveUp    = true;
          if (pad.axes[1] >  GAMEPAD_DEAD) gp.moveDown  = true;
          if (pad.buttons[0]?.pressed) gp.attack     = true; // A / Cross
          if (pad.buttons[1]?.pressed) gp.dodge      = true; // B / Circle
          if (pad.buttons[2]?.pressed) gp.defense    = true; // X / Square
          if (pad.buttons[3]?.pressed) gp.jump       = true; // Y / Triangle
          if (pad.buttons[4]?.pressed) gp.chargeHeld = true; // LB / L1
          // RB / R1 = special tap (edge trigger)
          if (pad.buttons[5]?.pressed) {
            if (!gpSpecialTapRef.current) { gp.specialTap = true; gpSpecialTapRef.current = true; }
          } else { gpSpecialTapRef.current = false; }
          // D-pad (buttons 12-15 on standard mapping)
          if (pad.buttons[12]?.pressed) gp.moveUp    = true;
          if (pad.buttons[13]?.pressed) gp.moveDown  = true;
          if (pad.buttons[14]?.pressed) gp.moveLeft  = true;
          if (pad.buttons[15]?.pressed) gp.moveRight = true;
        }
      }

      // Source 4: Touch (written by TouchControlsGBLayout)
      const tc = touchInputState;

      // Merge all four sources (OR)
      const input: FullGameInput = {
        moveLeft:  kb.moveLeft  || mouse.moveLeft  || gp.moveLeft  || !!tc.moveLeft,
        moveRight: kb.moveRight || mouse.moveRight || gp.moveRight || !!tc.moveRight,
        moveUp:    kb.moveUp    || mouse.moveUp    || gp.moveUp    || !!tc.moveUp,
        moveDown:  kb.moveDown  || mouse.moveDown  || gp.moveDown  || !!tc.moveDown,
        jump:      kb.jump      || gp.jump      || !!tc.jump,
        attack:    kb.attack    || gp.attack    || !!tc.attack,
        defense:   kb.defense   || gp.defense   || !!tc.defense,
        dodge:     kb.dodge     || gp.dodge     || !!tc.dodge,
        chargeHeld: kb.chargeHeld || gp.chargeHeld || !!tc.chargeHeld,
        specialTap: kb.specialTap || gp.specialTap || !!tc.specialTap,
        attitudeAggressive: kb.attitudeAggressive || !!tc.attitudeAggressive,
        attitudeDefensive:  kb.attitudeDefensive  || !!tc.attitudeDefensive,
        attitudeStamina:    kb.attitudeStamina     || !!tc.attitudeStamina,
      };

      // Build combo key list for server-side combo detection
      const comboKeys: string[] = [];
      if (input.jump)      comboKeys.push("jump");
      if (input.attack)    comboKeys.push("attack");
      if (input.defense)   comboKeys.push("defense");
      if (input.dodge)     comboKeys.push("dodge");
      if (input.moveLeft)  comboKeys.push("moveLeft");
      if (input.moveRight) comboKeys.push("moveRight");
      if (input.moveUp)    comboKeys.push("moveUp");
      if (input.moveDown)  comboKeys.push("moveDown");
      if (comboKeys.length > 0) input.comboKeys = comboKeys;

      // Clear one-shot flags after reading
      specialTapRef.current = false;

      // Dedup: only send if bitmask changed or heartbeat interval elapsed
      const bitmask = encodeBitmask(input);
      const now     = performance.now();
      if (bitmask !== lastBitmaskRef.current || now - lastSentTimeRef.current >= HEARTBEAT_MS) {
        sendInput(input);
        lastBitmaskRef.current = bitmask;
        lastSentTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown",       onKeyDown);
      window.removeEventListener("keyup",         onKeyUp);
      window.removeEventListener("mousedown",     onMouseDown);
      window.removeEventListener("mousemove",     onMouseMove);
      window.removeEventListener("mouseup",       onMouseUp);
      window.removeEventListener("contextmenu",   onContextMenu);
      window.removeEventListener("gamepadconnected",    onGpIn);
      window.removeEventListener("gamepaddisconnected", onGpOut);
    };
  }, [sendInput, enabled]);
}

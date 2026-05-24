// [GAME-CONTEXT] useGameInput — four input sources merged into one bitmask.
// Sources: (1) Keyboard, (2) Mouse (right-drag direction), (3) Gamepad, (4) Touch.
// Sends the current bitmask every animation frame (60Hz cadence) — acts as both
// input dispatch and heartbeat to recover from dropped packets within ~16ms.
// Key map: WASD / Arrows (move), I=jump, J=attack, K=defense, L=dodge,
//          Space (tap)=special, Space (hold)=charge.
// Phase 24 attitude bits: J=attitudeAggressive (bit 10), K=attitudeDefensive (11),
//                         L=attitudeStamina (12).

import { useEffect, useRef } from "react";

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
  // Phase 24 attitude bits
  attitudeAggressive?: boolean;
  attitudeDefensive?: boolean;
  attitudeStamina?: boolean;
  // Combo detection
  comboKeys?: string[];
}

// Shared touch-input state written by TouchControls and read by the input loop.
// Keyed by field name; component sets/clears these each render.
export const touchInputState: Partial<FullGameInput> = {};

type SendInputFn = (input: FullGameInput) => void;

const ACTION_CODES: Record<string, keyof FullGameInput> = {
  KeyJ: "attack",
  KeyK: "defense",
  KeyL: "dodge",
  KeyI: "jump",
};

const SPACE_TAP_THRESHOLD_MS = 150;
const GAMEPAD_DEAD_ZONE = 0.15;
// Right-mouse drag threshold in pixels before a direction is resolved
const MOUSE_DRAG_THRESHOLD = 12;

function encodeLocalBitmask(input: FullGameInput): number {
  let f = 0;
  if (input.moveLeft)           f |= 1 << 0;
  if (input.moveRight)          f |= 1 << 1;
  if (input.moveUp)             f |= 1 << 2;
  if (input.moveDown)           f |= 1 << 3;
  if (input.attack)             f |= 1 << 4;
  if (input.defense)            f |= 1 << 5;
  if (input.dodge)              f |= 1 << 6;
  if (input.jump)               f |= 1 << 7;
  if (input.chargeHeld)         f |= 1 << 8;
  if (input.specialTap)         f |= 1 << 9;
  if (input.attitudeAggressive) f |= 1 << 10;
  if (input.attitudeDefensive)  f |= 1 << 11;
  if (input.attitudeStamina)    f |= 1 << 12;
  return f;
}

// Heartbeat: resend even if bitmask unchanged to recover from dropped packets.
const HEARTBEAT_MS = 500;

export function useGameInput(sendInput: SendInputFn, enabled: boolean = true) {
  const keysRef               = useRef<Set<string>>(new Set());
  const animFrameRef          = useRef<number>(0);
  const lastInputRef          = useRef<FullGameInput>({});
  const spaceDownTimeRef      = useRef<number>(0);
  const specialTapRef         = useRef<boolean>(false);
  const gamepadIndexRef       = useRef<number | null>(null);
  const gamepadSpecialTapRef  = useRef<boolean>(false);
  const lastSentBitmaskRef    = useRef<number>(-1);
  const lastSentTimeRef       = useRef<number>(0);

  // Mouse right-drag state
  const mouseRightDownRef     = useRef<{ x: number; y: number } | null>(null);
  const mouseDragDeltaRef     = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    // ── Gamepad connect / disconnect ────────────────────────────────────────
    const onGamepadConnected = () => {
      if (gamepadIndexRef.current === null) {
        gamepadIndexRef.current = 0;
      }
    };
    const onGamepadDisconnected = () => { gamepadIndexRef.current = null; };
    window.addEventListener("gamepadconnected",    onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    // ── Keyboard ────────────────────────────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (spaceDownTimeRef.current === 0) spaceDownTimeRef.current = Date.now();
        e.preventDefault();
        return;
      }
      keysRef.current.add(e.code);
      if (
        e.code.startsWith("Arrow") ||
        ["KeyW","KeyA","KeyS","KeyD","KeyI","KeyJ","KeyK","KeyL"].includes(e.code)
      ) e.preventDefault();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const heldMs = spaceDownTimeRef.current > 0 ? Date.now() - spaceDownTimeRef.current : 999;
        if (heldMs < SPACE_TAP_THRESHOLD_MS) specialTapRef.current = true;
        spaceDownTimeRef.current = 0;
        return;
      }
      keysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);

    // ── Mouse (right-drag → directional movement hint) ──────────────────────
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        mouseRightDownRef.current  = { x: e.clientX, y: e.clientY };
        mouseDragDeltaRef.current  = { x: 0, y: 0 };
        e.preventDefault();
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (mouseRightDownRef.current) {
        mouseDragDeltaRef.current = {
          x: e.clientX - mouseRightDownRef.current.x,
          y: e.clientY - mouseRightDownRef.current.y,
        };
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        mouseRightDownRef.current = null;
        mouseDragDeltaRef.current = { x: 0, y: 0 };
      }
    };
    const onContextMenu = (e: Event) => e.preventDefault();

    window.addEventListener("mousedown",    onMouseDown);
    window.addEventListener("mousemove",    onMouseMove);
    window.addEventListener("mouseup",      onMouseUp);
    window.addEventListener("contextmenu",  onContextMenu);

    // ── Main loop ───────────────────────────────────────────────────────────
    const loop = () => {
      const keys      = keysRef.current;
      const spaceHeld = spaceDownTimeRef.current > 0;

      // ── Source 1: Keyboard ────────────────────────────────────────────────
      const kb = {
        moveLeft:  keys.has("KeyA") || keys.has("ArrowLeft"),
        moveRight: keys.has("KeyD") || keys.has("ArrowRight"),
        moveUp:    keys.has("KeyW") || keys.has("ArrowUp"),
        moveDown:  keys.has("KeyS") || keys.has("ArrowDown"),
        jump:      keys.has("KeyI"),
        attack:    keys.has("KeyJ"),
        defense:   keys.has("KeyK"),
        dodge:     keys.has("KeyL"),
        chargeHeld: spaceHeld,
        specialTap: specialTapRef.current,
        // Attitude bits: same keys as actions — held together with movement
        attitudeAggressive: keys.has("KeyJ"),
        attitudeDefensive:  keys.has("KeyK"),
        attitudeStamina:    keys.has("KeyL"),
      };

      // ── Source 2: Mouse right-drag ────────────────────────────────────────
      const drag  = mouseDragDeltaRef.current;
      const dragX = Math.abs(drag.x);
      const dragY = Math.abs(drag.y);
      const mouse = {
        moveLeft:  dragX > MOUSE_DRAG_THRESHOLD && drag.x < 0,
        moveRight: dragX > MOUSE_DRAG_THRESHOLD && drag.x > 0,
        moveUp:    dragY > MOUSE_DRAG_THRESHOLD && drag.y < 0,
        moveDown:  dragY > MOUSE_DRAG_THRESHOLD && drag.y > 0,
      };

      // ── Source 3: Gamepad ─────────────────────────────────────────────────
      const gp = {
        moveLeft: false, moveRight: false, moveUp: false, moveDown: false,
        jump: false, attack: false, defense: false, dodge: false,
        chargeHeld: false, specialTap: false,
      };
      if (gamepadIndexRef.current !== null) {
        const gamepads = navigator.getGamepads?.() ?? [];
        const pad = gamepads[gamepadIndexRef.current];
        if (pad) {
          if (pad.axes[0] < -GAMEPAD_DEAD_ZONE) gp.moveLeft  = true;
          if (pad.axes[0] >  GAMEPAD_DEAD_ZONE) gp.moveRight = true;
          if (pad.axes[1] < -GAMEPAD_DEAD_ZONE) gp.moveUp    = true;
          if (pad.axes[1] >  GAMEPAD_DEAD_ZONE) gp.moveDown  = true;
          if (pad.buttons[0]?.pressed) gp.attack     = true; // A/Cross
          if (pad.buttons[1]?.pressed) gp.dodge      = true; // B/Circle
          if (pad.buttons[2]?.pressed) gp.defense    = true; // X/Square
          if (pad.buttons[3]?.pressed) gp.jump       = true; // Y/Triangle
          if (pad.buttons[4]?.pressed) gp.chargeHeld = true; // LB/L1
          if (pad.buttons[5]?.pressed) {
            if (!gamepadSpecialTapRef.current) {
              gp.specialTap = true;
              gamepadSpecialTapRef.current = true;
            }
          } else {
            gamepadSpecialTapRef.current = false;
          }
        }
      }

      // ── Source 4: Touch (written by TouchControls via touchInputState) ────
      const touch = touchInputState;

      // ── Merge all four sources (OR) ───────────────────────────────────────
      const input: FullGameInput = {
        moveLeft:  kb.moveLeft  || mouse.moveLeft  || gp.moveLeft  || !!touch.moveLeft,
        moveRight: kb.moveRight || mouse.moveRight || gp.moveRight || !!touch.moveRight,
        moveUp:    kb.moveUp    || mouse.moveUp    || gp.moveUp    || !!touch.moveUp,
        moveDown:  kb.moveDown  || mouse.moveDown  || gp.moveDown  || !!touch.moveDown,
        jump:      kb.jump      || gp.jump      || !!touch.jump,
        attack:    kb.attack    || gp.attack    || !!touch.attack,
        defense:   kb.defense   || gp.defense   || !!touch.defense,
        dodge:     kb.dodge     || gp.dodge     || !!touch.dodge,
        chargeHeld: kb.chargeHeld || gp.chargeHeld || !!touch.chargeHeld,
        specialTap: kb.specialTap || gp.specialTap || !!touch.specialTap,
        attitudeAggressive: kb.attitudeAggressive || !!touch.attitudeAggressive,
        attitudeDefensive:  kb.attitudeDefensive  || !!touch.attitudeDefensive,
        attitudeStamina:    kb.attitudeStamina     || !!touch.attitudeStamina,
      };

      // Collect action keys for combo detection
      const comboKeys: string[] = [];
      for (const [code, action] of Object.entries(ACTION_CODES)) {
        if (keys.has(code)) comboKeys.push(action as string);
      }
      if (gp.jump)      comboKeys.push("jump");
      if (gp.attack)    comboKeys.push("attack");
      if (gp.defense)   comboKeys.push("defense");
      if (gp.dodge)     comboKeys.push("dodge");
      if (gp.moveLeft)  comboKeys.push("moveLeft");
      if (gp.moveRight) comboKeys.push("moveRight");
      if (gp.moveUp)    comboKeys.push("moveUp");
      if (gp.moveDown)  comboKeys.push("moveDown");
      input.comboKeys = comboKeys.length > 0 ? comboKeys : undefined;

      // Clear one-shot specialTap after reading
      specialTapRef.current = false;

      // Dedup: skip send if bitmask unchanged AND heartbeat window hasn't elapsed.
      const bitmask = encodeLocalBitmask(input);
      const now     = performance.now();
      if (bitmask !== lastSentBitmaskRef.current || now - lastSentTimeRef.current >= HEARTBEAT_MS) {
        sendInput(input);
        lastSentBitmaskRef.current = bitmask;
        lastSentTimeRef.current    = now;
      }
      lastInputRef.current = input;

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown",       onKeyDown);
      window.removeEventListener("keyup",         onKeyUp);
      window.removeEventListener("mousedown",     onMouseDown);
      window.removeEventListener("mousemove",     onMouseMove);
      window.removeEventListener("mouseup",       onMouseUp);
      window.removeEventListener("contextmenu",   onContextMenu);
      window.removeEventListener("gamepadconnected",    onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [sendInput, enabled]);
}

// [GAME-CONTEXT] useGameInput — keyboard + gamepad input handler.
// Sends the current bitmask every animation frame (60Hz cadence) — this acts
// as both the input dispatch and the heartbeat that lets the server recover
// from any dropped packet within ~16ms. The change-detection from the old
// design was removed because dropped key transitions would cause "stuck input"
// failure modes. See plan: Part 8.
// Key map: WASD / Arrows (move), I=jump, J=attack, K=defense, L=dodge,
//          Space (tap)=special, Space (hold)=charge. No mouse.

import { useEffect, useRef } from "react";

interface FullGameInput {
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
  // Combo detection
  comboKeys?: string[];
}

type SendInputFn = (input: FullGameInput) => void;

const ACTION_CODES: Record<string, keyof FullGameInput> = {
  KeyJ: "attack",
  KeyK: "defense",
  KeyL: "dodge",
  KeyI: "jump",
};

const SPACE_TAP_THRESHOLD_MS = 150;

const GAMEPAD_DEAD_ZONE = 0.15;

export function useGameInput(sendInput: SendInputFn, enabled: boolean = true) {
  const keysRef = useRef<Set<string>>(new Set());
  const animFrameRef = useRef<number>(0);
  const lastInputRef = useRef<FullGameInput>({});
  const spaceDownTimeRef = useRef<number>(0);
  const specialTapRef = useRef<boolean>(false);
  const gamepadIndexRef = useRef<number | null>(null);
  const gamepadSpecialTapRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    const onGamepadConnected = () => {
      if (gamepadIndexRef.current === null) {
        gamepadIndexRef.current = 0; // Use first connected gamepad
        console.log("Gamepad connected, using index 0");
      }
    };

    const onGamepadDisconnected = () => {
      if (gamepadIndexRef.current !== null) {
        gamepadIndexRef.current = null;
        console.log("Gamepad disconnected");
      }
    };

    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    const onKeyDown = (e: KeyboardEvent) => {
      // Spacebar: track hold start time
      if (e.code === "Space") {
        if (spaceDownTimeRef.current === 0) {
          spaceDownTimeRef.current = Date.now();
        }
        e.preventDefault();
        return;
      }

      keysRef.current.add(e.code);

      // Prevent browser default for game keys
      if (
        e.code.startsWith("Arrow") ||
        ["KeyW","KeyA","KeyS","KeyD","KeyI","KeyJ","KeyK","KeyL"].includes(e.code)
      ) {
        e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const heldMs = spaceDownTimeRef.current > 0 ? Date.now() - spaceDownTimeRef.current : 999;
        // Short tap (< threshold) → specialTap for one frame
        if (heldMs < SPACE_TAP_THRESHOLD_MS) {
          specialTapRef.current = true;
        }
        spaceDownTimeRef.current = 0;
        return;
      }

      keysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const loop = () => {
      const keys = keysRef.current;
      let spaceHeld = spaceDownTimeRef.current > 0;

      // Poll gamepad
      let gamepadInput = {
        moveLeft: false,
        moveRight: false,
        moveUp: false,
        moveDown: false,
        jump: false,
        attack: false,
        defense: false,
        dodge: false,
        chargeHeld: false,
        specialTap: false,
      };

      if (gamepadIndexRef.current !== null) {
        const gamepads = navigator.getGamepads?.() ?? [];
        const gamepad = gamepads[gamepadIndexRef.current];
        if (gamepad) {
          // Axes: [0] = left stick X, [1] = left stick Y
          if (Math.abs(gamepad.axes[0]) > GAMEPAD_DEAD_ZONE) {
            if (gamepad.axes[0] < -GAMEPAD_DEAD_ZONE) gamepadInput.moveLeft = true;
            if (gamepad.axes[0] > GAMEPAD_DEAD_ZONE) gamepadInput.moveRight = true;
          }
          if (Math.abs(gamepad.axes[1]) > GAMEPAD_DEAD_ZONE) {
            if (gamepad.axes[1] < -GAMEPAD_DEAD_ZONE) gamepadInput.moveUp = true;
            if (gamepad.axes[1] > GAMEPAD_DEAD_ZONE) gamepadInput.moveDown = true;
          }

          // Buttons: 0=A/Cross, 1=B/Circle, 2=X/Square, 3=Y/Triangle, 4=LB/L1, 5=RB/R1
          if (gamepad.buttons[0]?.pressed) gamepadInput.attack = true;   // A/Cross
          if (gamepad.buttons[1]?.pressed) gamepadInput.dodge = true;    // B/Circle
          if (gamepad.buttons[2]?.pressed) gamepadInput.defense = true;  // X/Square
          if (gamepad.buttons[3]?.pressed) gamepadInput.jump = true;     // Y/Triangle
          if (gamepad.buttons[4]?.pressed) gamepadInput.chargeHeld = true; // LB/L1
          if (gamepad.buttons[5]?.pressed) {
            if (!gamepadSpecialTapRef.current) {
              gamepadInput.specialTap = true;
              gamepadSpecialTapRef.current = true;
            }
          } else {
            gamepadSpecialTapRef.current = false;
          }
        }
      }

      // Merge gamepad and keyboard input (OR them together)
      const input: FullGameInput = {
        moveLeft:  keys.has("KeyA") || keys.has("ArrowLeft") || gamepadInput.moveLeft,
        moveRight: keys.has("KeyD") || keys.has("ArrowRight") || gamepadInput.moveRight,
        moveUp:    keys.has("KeyW") || keys.has("ArrowUp") || gamepadInput.moveUp,
        moveDown:  keys.has("KeyS") || keys.has("ArrowDown") || gamepadInput.moveDown,
        jump:      keys.has("KeyI") || gamepadInput.jump,
        attack:    keys.has("KeyJ") || gamepadInput.attack,
        defense:   keys.has("KeyK") || gamepadInput.defense,
        dodge:     keys.has("KeyL") || gamepadInput.dodge,
        chargeHeld: spaceHeld || gamepadInput.chargeHeld,
        specialTap: specialTapRef.current || gamepadInput.specialTap,
      };

      // Collect active action keys for combo detection
      const comboKeys: string[] = [];
      for (const [code, action] of Object.entries(ACTION_CODES)) {
        if (keys.has(code)) comboKeys.push(action as string);
      }
      // Also add gamepad actions to combo keys
      if (gamepadInput.jump) comboKeys.push("jump");
      if (gamepadInput.attack) comboKeys.push("attack");
      if (gamepadInput.defense) comboKeys.push("defense");
      if (gamepadInput.dodge) comboKeys.push("dodge");
      if (gamepadInput.moveLeft) comboKeys.push("moveLeft");
      if (gamepadInput.moveRight) comboKeys.push("moveRight");
      if (gamepadInput.moveUp) comboKeys.push("moveUp");
      if (gamepadInput.moveDown) comboKeys.push("moveDown");

      input.comboKeys = comboKeys.length > 0 ? comboKeys : undefined;

      // Clear one-shot specialTap after reading
      specialTapRef.current = false;

      // Send every frame. This doubles as a heartbeat — the server keeps the
      // last received bitmask as its current input, so dropped packets self-heal
      // within ~16ms. We removed the previous change-detection because dropped
      // transitions could cause "stuck input" failure modes.
      sendInput(input);
      lastInputRef.current = input;

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [sendInput, enabled]);
}

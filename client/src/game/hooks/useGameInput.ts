// [GAME-CONTEXT] useGameInput — keyboard input handler for the game.
// Tracks held keys and dispatches input to the Colyseus room each animation frame.
// Full key map: WASD/arrows (movement), I/J/K/L (actions), Space (power/special).

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

export function useGameInput(sendInput: SendInputFn, enabled: boolean = true) {
  const keysRef = useRef<Set<string>>(new Set());
  const animFrameRef = useRef<number>(0);
  const lastInputRef = useRef<FullGameInput>({});
  const spaceDownTimeRef = useRef<number>(0);
  const specialTapRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

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
      const spaceHeld = spaceDownTimeRef.current > 0;

      // Collect active action keys for combo detection
      const comboKeys: string[] = [];
      for (const [code, action] of Object.entries(ACTION_CODES)) {
        if (keys.has(code)) comboKeys.push(action as string);
      }

      const input: FullGameInput = {
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
        comboKeys: comboKeys.length > 0 ? comboKeys : undefined,
      };

      // Clear one-shot specialTap after reading
      specialTapRef.current = false;

      const last = lastInputRef.current;

      // Send if any input changed
      const changed =
        input.moveLeft  !== last.moveLeft  ||
        input.moveRight !== last.moveRight ||
        input.moveUp    !== last.moveUp    ||
        input.moveDown  !== last.moveDown  ||
        input.jump      !== last.jump      ||
        input.attack    !== last.attack    ||
        input.defense   !== last.defense   ||
        input.dodge     !== last.dodge     ||
        input.chargeHeld !== last.chargeHeld ||
        input.specialTap !== last.specialTap ||
        (input.comboKeys?.join(",") ?? "") !== (last.comboKeys?.join(",") ?? "");

      if (changed) {
        sendInput(input);
        lastInputRef.current = { ...input };
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [sendInput, enabled]);
}

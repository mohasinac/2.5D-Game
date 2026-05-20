// [GAME-CONTEXT] useGameInput — keyboard/touch input handler for the game.
// Tracks held keys and dispatches input to the Colyseus room each animation frame.

import { useEffect, useRef } from "react";

interface GameInput {
  moveLeft: boolean;
  moveRight: boolean;
  attack: boolean;
  specialMove: boolean;
}

type SendInputFn = (input: Partial<GameInput>) => void;

export function useGameInput(sendInput: SendInputFn, enabled: boolean = true) {
  const keysRef = useRef<Set<string>>(new Set());
  const animFrameRef = useRef<number>(0);
  const lastInputRef = useRef<GameInput>({ moveLeft: false, moveRight: false, attack: false, specialMove: false });

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      e.preventDefault();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const loop = () => {
      const keys = keysRef.current;
      const input: GameInput = {
        moveLeft: keys.has("KeyA") || keys.has("ArrowLeft"),
        moveRight: keys.has("KeyD") || keys.has("ArrowRight"),
        attack: keys.has("Space"),
        specialMove: keys.has("ShiftLeft") || keys.has("ShiftRight"),
      };

      const last = lastInputRef.current;
      // Only send if input changed — reduces unnecessary messages
      if (
        input.moveLeft !== last.moveLeft ||
        input.moveRight !== last.moveRight ||
        input.attack !== last.attack ||
        input.specialMove !== last.specialMove
      ) {
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

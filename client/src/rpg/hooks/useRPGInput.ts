import { useEffect, useRef } from "react";

export interface RPGInputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  confirm: boolean;
  cancel: boolean;
  menu: boolean;
}

const EMPTY_INPUT: RPGInputState = {
  up: false,
  down: false,
  left: false,
  right: false,
  confirm: false,
  cancel: false,
  menu: false,
};

function keyToAction(key: string): keyof RPGInputState | null {
  switch (key) {
    case "ArrowUp":    case "w": case "W": return "up";
    case "ArrowDown":  case "s": case "S": return "down";
    case "ArrowLeft":  case "a": case "A": return "left";
    case "ArrowRight": case "d": case "D": return "right";
    case "z": case "Z": case "Enter": case " ": return "confirm";
    case "x": case "X": case "Backspace": case "Escape": return "cancel";
    case "Escape": case "p": case "P": return "menu";
    default: return null;
  }
}

export function useRPGInput(): React.RefObject<RPGInputState> {
  const stateRef = useRef<RPGInputState>({ ...EMPTY_INPUT });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const action = keyToAction(e.key);
      if (action && !stateRef.current[action]) {
        stateRef.current = { ...stateRef.current, [action]: true };
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const action = keyToAction(e.key);
      if (action && stateRef.current[action]) {
        stateRef.current = { ...stateRef.current, [action]: false };
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return stateRef;
}

import { useEffect, useRef, useCallback } from "react";
import { rpgTouchState } from "../components/hud/RPGTouchControls";

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
  up: false, down: false, left: false, right: false,
  confirm: false, cancel: false, menu: false,
};

// Keyboard state (separate from touch so both can be merged)
const kbState: RPGInputState = { ...EMPTY_INPUT };

function keyToAction(key: string): keyof RPGInputState | null {
  switch (key) {
    case "ArrowUp":    case "w": case "W": return "up";
    case "ArrowDown":  case "s": case "S": return "down";
    case "ArrowLeft":  case "a": case "A": return "left";
    case "ArrowRight": case "d": case "D": return "right";
    case "z": case "Z": case "Enter": case " ": return "confirm";
    case "x": case "X": case "Backspace": return "cancel";
    case "Escape": case "p": case "P": return "menu";
    default: return null;
  }
}

export function useRPGInput(): React.RefObject<RPGInputState> {
  const stateRef = useRef<RPGInputState>({ ...EMPTY_INPUT });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const action = keyToAction(e.key);
      if (action) {
        kbState[action] = true;
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const action = keyToAction(e.key);
      if (action) {
        kbState[action] = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      Object.keys(kbState).forEach((k) => { kbState[k as keyof RPGInputState] = false; });
    };
  }, []);

  // Merge keyboard + touch every frame via requestAnimationFrame
  useEffect(() => {
    let raf: number;
    const merge = () => {
      stateRef.current = {
        up:      kbState.up      || rpgTouchState.up,
        down:    kbState.down    || rpgTouchState.down,
        left:    kbState.left    || rpgTouchState.left,
        right:   kbState.right   || rpgTouchState.right,
        confirm: kbState.confirm || rpgTouchState.confirm,
        cancel:  kbState.cancel  || rpgTouchState.cancel,
        menu:    kbState.menu    || rpgTouchState.menu,
      };
      raf = requestAnimationFrame(merge);
    };
    raf = requestAnimationFrame(merge);
    return () => cancelAnimationFrame(raf);
  }, []);

  return stateRef;
}

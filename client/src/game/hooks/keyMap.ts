// keyMap.ts — user-remappable keyboard bindings.
// Persisted in localStorage under "beyblade.keyMap.v2".
// keyMapRef.current is always up-to-date so the rAF loop in useGameInput
// reads the latest map without closure stale-capture issues.

export type GameAction =
  | "moveLeft" | "moveRight" | "moveUp" | "moveDown"
  | "jump" | "attack" | "defense" | "dodge"
  | "charge";   // hold = chargeHeld; tap = specialTap (both handled by same key)

export type KeyMap = Record<GameAction, string>;

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_KEY_MAP: KeyMap = {
  moveLeft:  "KeyA",
  moveRight: "KeyD",
  moveUp:    "KeyW",
  moveDown:  "KeyS",
  jump:      "KeyI",
  attack:    "KeyJ",
  defense:   "KeyK",
  dodge:     "KeyL",
  charge:    "Space",
};

// Arrow keys are ALWAYS active as movement fallbacks (non-remappable).
export const ARROW_FALLBACKS: Partial<Record<GameAction, string>> = {
  moveLeft:  "ArrowLeft",
  moveRight: "ArrowRight",
  moveUp:    "ArrowUp",
  moveDown:  "ArrowDown",
};

// ── Module-level live ref ─────────────────────────────────────────────────────
// Mutated by loadKeyMap / saveKeyMap so useGameInput's loop always reads fresh.
export const keyMapRef: { current: KeyMap } = { current: { ...DEFAULT_KEY_MAP } };

// ── Human-readable labels ─────────────────────────────────────────────────────

const CODE_LABELS: Record<string, string> = {
  Space:        "SPACE",
  ArrowLeft:    "←",
  ArrowRight:   "→",
  ArrowUp:      "↑",
  ArrowDown:    "↓",
  Backspace:    "⌫",
  Delete:       "DEL",
  Enter:        "↵",
  Escape:       "ESC",
  Tab:          "TAB",
  CapsLock:     "CAPS",
  ShiftLeft:    "L.SHIFT",
  ShiftRight:   "R.SHIFT",
  ControlLeft:  "L.CTRL",
  ControlRight: "R.CTRL",
  AltLeft:      "L.ALT",
  AltRight:     "R.ALT",
  MetaLeft:     "L.WIN",
  MetaRight:    "R.WIN",
};

export function keyCodeLabel(code: string): string {
  if (CODE_LABELS[code]) return CODE_LABELS[code];
  if (code.startsWith("Key"))    return code.slice(3);
  if (code.startsWith("Digit"))  return code.slice(5);
  if (code.startsWith("Numpad")) return `NP${code.slice(6)}`;
  if (/^F\d+$/.test(code))       return code;
  return code.replace(/([A-Z])/g, " $1").trim().toUpperCase();
}

export const ACTION_DISPLAY: Record<GameAction, { label: string; color: string }> = {
  moveLeft:  { label: "Move Left",        color: "#60a5fa" },
  moveRight: { label: "Move Right",       color: "#60a5fa" },
  moveUp:    { label: "Move Up",          color: "#60a5fa" },
  moveDown:  { label: "Move Down",        color: "#60a5fa" },
  jump:      { label: "Jump",             color: "#818cf8" },
  attack:    { label: "Attack",           color: "#f87171" },
  defense:   { label: "Defense",          color: "#60a5fa" },
  dodge:     { label: "Dodge",            color: "#34d399" },
  charge:    { label: "Charge / Special", color: "#fbbf24" },
};

// ── Mouse-drag input toggle ───────────────────────────────────────────────────
// Mouse right-drag as directional input is OFF by default.
// Keyboard, Gamepad, and Touch are always active regardless of this flag.

const MOUSE_STORAGE_KEY = "beyblade.mouseInput";

export const mouseInputRef: { enabled: boolean } = { enabled: false };

export function loadMouseInput(): boolean {
  try {
    const v = localStorage.getItem(MOUSE_STORAGE_KEY);
    mouseInputRef.enabled = v === "1";
  } catch { /* ignore */ }
  return mouseInputRef.enabled;
}

export function setMouseInput(enabled: boolean): void {
  mouseInputRef.enabled = enabled;
  try {
    localStorage.setItem(MOUSE_STORAGE_KEY, enabled ? "1" : "0");
    window.dispatchEvent(new CustomEvent("beyblade:keymap:changed"));
  } catch { /* ignore */ }
}

// ── Key map persistence ───────────────────────────────────────────────────────

const STORAGE_KEY = "beyblade.keyMap.v2";

export function loadKeyMap(): KeyMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<KeyMap>;
      const merged: KeyMap = { ...DEFAULT_KEY_MAP, ...parsed };
      keyMapRef.current = merged;
      return merged;
    }
  } catch { /* ignore */ }
  keyMapRef.current = { ...DEFAULT_KEY_MAP };
  return { ...DEFAULT_KEY_MAP };
}

export function saveKeyMap(map: KeyMap): void {
  keyMapRef.current = map;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("beyblade:keymap:changed", { detail: map }));
  } catch { /* ignore */ }
}

export function resetKeyMap(): void {
  saveKeyMap({ ...DEFAULT_KEY_MAP });
}

// ── Auto-load on import ───────────────────────────────────────────────────────
loadKeyMap();
loadMouseInput();

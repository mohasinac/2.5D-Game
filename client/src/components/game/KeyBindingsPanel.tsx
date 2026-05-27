// KeyBindingsPanel — floating modal for remapping keyboard controls.
// Click any action row → panel waits for a keypress → updates the binding.
// Changes are persisted to localStorage via keyMap.ts and take effect
// immediately in the input loop (keyMapRef.current is updated synchronously).

import { useState, useEffect, useCallback } from "react";
import {
  keyMapRef, mouseInputRef, loadKeyMap, saveKeyMap, resetKeyMap,
  setMouseInput, keyCodeLabel, ACTION_DISPLAY,
  type GameAction, type KeyMap,
} from "@/game/hooks/keyMap";

interface Props {
  onClose: () => void;
}

const REMAPPABLE_ACTIONS: GameAction[] = [
  "moveLeft", "moveRight", "moveUp", "moveDown",
  "jump", "attack", "defense", "dodge", "charge",
];

export function KeyBindingsPanel({ onClose }: Props) {
  const [map, setMap]             = useState<KeyMap>(() => ({ ...loadKeyMap() }));
  const [listening, setListening] = useState<GameAction | null>(null);
  const [flash, setFlash]         = useState<GameAction | null>(null);
  const [mouseOn, setMouseOn]     = useState<boolean>(() => mouseInputRef.enabled);

  // While waiting for a key press
  useEffect(() => {
    if (!listening) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Escape cancels rebind
      if (e.code === "Escape") { setListening(null); return; }
      e.preventDefault();
      e.stopPropagation();

      // Prevent rebinding to arrow keys (those are fixed fallbacks)
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.code)) return;

      const next = { ...map, [listening]: e.code };
      setMap(next);
      saveKeyMap(next);
      setFlash(listening);
      setListening(null);
      setTimeout(() => setFlash(null), 600);
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [listening, map]);

  const handleReset = useCallback(() => {
    resetKeyMap();
    setMap({ ...keyMapRef.current });
  }, []);

  const handleClose = useCallback(() => {
    saveKeyMap(map);
    onClose();
  }, [map, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-[340px] max-w-[95vw] bg-[#0d1526] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 bg-[#0a1020]">
          <div className="flex items-center gap-2">
            <span className="text-base">⌨</span>
            <span className="text-white font-bold text-sm tracking-wide">Key Bindings</span>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Hint */}
        {listening && (
          <div className="px-5 py-2 bg-amber-500/15 border-b border-amber-400/20 text-amber-300 text-xs text-center">
            Press any key to bind&nbsp;
            <strong>{ACTION_DISPLAY[listening].label}</strong>
            &nbsp;— or Escape to cancel
          </div>
        )}

        {/* Mouse drag toggle — OFF by default */}
        <div className="px-4 py-2.5 border-b border-white/6 flex items-center justify-between gap-3">
          <div>
            <div className="text-white/80 text-xs font-semibold">Mouse right-drag input</div>
            <div className="text-white/35 text-[10px] mt-0.5">
              Keyboard, touch and gamepad are always active.
              Mouse drag is off by default.
            </div>
          </div>
          <button
            onClick={() => {
              const next = !mouseOn;
              setMouseOn(next);
              setMouseInput(next);
            }}
            className={cn(
              "relative w-10 h-5 rounded-full border transition-colors shrink-0",
              mouseOn
                ? "bg-blue-600 border-blue-400/40"
                : "bg-white/10 border-white/15",
            )}
            aria-label={mouseOn ? "Disable mouse input" : "Enable mouse input"}
          >
            <span
              className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-150",
                mouseOn ? "left-[calc(100%-18px)]" : "left-0.5",
              )}
            />
          </button>
        </div>

        {/* Bindings list */}
        <div className="px-3 py-2 space-y-[3px] max-h-[55vh] overflow-y-auto">
          {REMAPPABLE_ACTIONS.map((action) => {
            const { label, color } = ACTION_DISPLAY[action];
            const isListening = listening === action;
            const isFlash     = flash === action;

            return (
              <button
                key={action}
                onClick={() => setListening(isListening ? null : action)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-100",
                  isListening
                    ? "bg-amber-500/20 border border-amber-400/40 ring-1 ring-amber-400/30"
                    : isFlash
                    ? "bg-green-500/20 border border-green-400/40"
                    : "bg-white/4 border border-white/6 hover:bg-white/8 hover:border-white/12",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-white/85 font-medium">{label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Arrow fallbacks shown for movement */}
                  {(action === "moveLeft" || action === "moveRight" ||
                    action === "moveUp"   || action === "moveDown") && (
                    <span className="text-white/25 text-xs">
                      {action === "moveLeft" ? "← " : action === "moveRight" ? "→ " : action === "moveUp" ? "↑ " : "↓ "}
                      always
                    </span>
                  )}
                  <kbd
                    className={cn(
                      "min-w-[2.2rem] px-2 py-0.5 rounded text-center font-mono text-xs font-bold border",
                      isListening
                        ? "bg-amber-400/20 border-amber-400/50 text-amber-300 animate-pulse"
                        : isFlash
                        ? "bg-green-400/20 border-green-400/50 text-green-300"
                        : "bg-white/8 border-white/15 text-white/80",
                    )}
                  >
                    {isListening ? "…" : keyCodeLabel(map[action])}
                  </kbd>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/8 bg-[#0a1020]">
          <button
            onClick={handleReset}
            className="text-xs text-white/45 hover:text-white/70 underline transition-colors"
          >
            Reset to defaults
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

// Small local cn helper (avoids circular dep if @/lib/cn is heavy)
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

import React, { useEffect, useRef, useState } from "react";
import type { QTEPromptData } from "@/game/hooks/useColyseus";

const KEY_DISPLAY: Record<string, string> = {
  left: "←",
  right: "→",
  up: "↑",
  down: "↓",
  attack: "J",
  defense: "K",
  dodge: "L",
};

const C_GREEN  = "#22c55e";
const C_YELLOW = "#eab308";
const C_RED    = "#ef4444";
const C_MUTED  = "#64748b";
const C_FAINT  = "#475569";
const C_BG1    = "#0f172a";
const C_BG3    = "#1e293b";
const C_BORDER = "#334155";

interface QTEOverlayProps {
  prompt: QTEPromptData | null;
  onKeyPress: (key: string) => void;
  /** Called by parent to dismiss after success/expiry */
  onDismiss: () => void;
}

export function QTEOverlay({ prompt, onKeyPress, onDismiss }: QTEOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [shake, setShake] = useState(false);
  const [result, setResult] = useState<"success" | "failed" | null>(null);
  const [timeLeft, setTimeLeft] = useState(1.0); // 0–1 fraction
  const promptRef = useRef(prompt);
  const resultRef = useRef(result);

  useEffect(() => { promptRef.current = prompt; }, [prompt]);
  useEffect(() => { resultRef.current = result; }, [result]);

  // Reset state when a new prompt arrives
  useEffect(() => {
    if (!prompt) return;
    setProgress(0);
    setShake(false);
    setResult(null);
    setTimeLeft(1.0);
  }, [prompt?.attackerBeyId, prompt?.expiresAt]);

  // Countdown timer
  useEffect(() => {
    if (!prompt || result) return;
    const total = prompt.expiresAt - Date.now();
    if (total <= 0) { onDismiss(); return; }

    const id = setInterval(() => {
      const remaining = prompt.expiresAt - Date.now();
      const frac = Math.max(0, remaining / total);
      setTimeLeft(frac);
      if (frac <= 0) {
        clearInterval(id);
        onDismiss();
      }
    }, 50);
    return () => clearInterval(id);
  }, [prompt, result]);

  // Keyboard listener
  useEffect(() => {
    if (!prompt || result) return;

    const KEYMAP: Record<string, string> = {
      ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
      j: "attack", k: "defense", l: "dodge",
      J: "attack", K: "defense", L: "dodge",
    };

    const handler = (e: KeyboardEvent) => {
      if (!promptRef.current || resultRef.current) return;
      const key = KEYMAP[e.key];
      if (!key) return;
      e.preventDefault();

      const expected = promptRef.current.sequence[progress];
      if (key === expected) {
        const next = progress + 1;
        if (next >= promptRef.current.sequence.length) {
          setProgress(next);
          setResult("success");
          onKeyPress(key);
          setTimeout(onDismiss, 700);
        } else {
          setProgress(next);
          onKeyPress(key);
        }
      } else {
        // Wrong key — reset progress and shake
        setProgress(0);
        setShake(true);
        setTimeout(() => setShake(false), 300);
        onKeyPress(key);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prompt, progress, result, onKeyPress]);

  if (!prompt) return null;

  const timerColor = timeLeft > 0.5 ? C_GREEN : timeLeft > 0.25 ? C_YELLOW : C_RED;

  return (
    <div
      data-testid="qte-prompt"
      className={`fixed top-1/2 left-1/2 bg-[rgba(15,23,42,0.97)] rounded-[16px] px-7 py-5 min-w-[280px] text-center z-[200] [transition:transform_0.05s] shadow-[0_4px_32px_rgba(0,0,0,0.6)] border-2 ${result === "success" ? "border-[#22c55e]" : result === "failed" ? "border-[#ef4444]" : "border-[#eab308]"}`}
      style={{ transform: `translate(-50%, -50%)${shake ? " translateX(-6px)" : ""}`, animation: shake ? "shake 0.3s ease" : undefined }}
    >
      {/* Header */}
      <div className="text-[11px] text-theme-yellow font-bold uppercase tracking-[0.12em] mb-[6px]">
        ⚡ Counter Chance!
      </div>
      <div className="text-[12px] text-theme-muted mb-[14px]">
        Press the sequence to block their special move
      </div>

      {/* Key sequence */}
      <div className="flex justify-center gap-[10px] mb-[18px]">
        {prompt.sequence.map((key, i) => (
          <div
            key={i}
            data-testid={`qte-key-${i}`}
            className={`w-11 h-11 flex items-center justify-center rounded-[10px] text-[20px] font-bold border-2 [transition:all_0.1s] ${
              result === "success" || i < progress
                ? "border-[#22c55e] bg-[rgba(34,197,94,0.2)] text-[#22c55e]"
                : i === progress
                  ? "border-[#eab308] bg-[rgba(234,179,8,0.15)] text-[#eab308]"
                  : "border-[#334155] bg-[rgba(30,41,59,0.5)] text-[#64748b]"
            }`}
          >
            {KEY_DISPLAY[key] ?? key.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Timer bar */}
      <div
        data-testid="qte-timer"
        className="h-[6px] rounded-[3px] bg-bg3 overflow-hidden mb-[10px]"
      >
        <div className="h-full rounded-[3px] [transition:width_0.05s_linear,background_0.3s] w-[--tw] bg-[color:var(--tc)]" style={{ "--tw": `${timeLeft * 100}%`, "--tc": timerColor } as React.CSSProperties} />
      </div>

      <div className="text-[11px] text-theme-faint">
        {Math.ceil(timeLeft * prompt.windowTicks)} ticks remaining
      </div>

      {/* Result overlay */}
      {result && (
        <div
          data-testid="qte-result"
          className={`absolute inset-0 flex items-center justify-center rounded-[14px] text-[22px] font-black ${result === "success" ? "bg-[rgba(34,197,94,0.15)] text-[#22c55e]" : "bg-[rgba(239,68,68,0.15)] text-[#ef4444]"}`}
        >
          {result === "success" ? "BLOCKED!" : "TOO SLOW"}
        </div>
      )}
    </div>
  );
}

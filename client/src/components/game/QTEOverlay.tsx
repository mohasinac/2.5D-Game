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

interface QTEOverlayProps {
  prompt: QTEPromptData | null;
  onKeyPress: (key: string) => void;
  onDismiss: () => void;
}

export function QTEOverlay({ prompt, onKeyPress, onDismiss }: QTEOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [shake, setShake] = useState(false);
  const [result, setResult] = useState<"success" | "failed" | null>(null);
  const [timeLeft, setTimeLeft] = useState(1.0);
  const promptRef = useRef(prompt);
  const resultRef = useRef(result);

  useEffect(() => { promptRef.current = prompt; }, [prompt]);
  useEffect(() => { resultRef.current = result; }, [result]);

  useEffect(() => {
    if (!prompt) return;
    setProgress(0);
    setShake(false);
    setResult(null);
    setTimeLeft(1.0);
  }, [prompt?.attackerBeyId, prompt?.expiresAt]);

  useEffect(() => {
    if (!prompt || result) return;
    const total = prompt.expiresAt - Date.now();
    if (total <= 0) { onDismiss(); return; }
    const id = setInterval(() => {
      const remaining = prompt.expiresAt - Date.now();
      const frac = Math.max(0, remaining / total);
      setTimeLeft(frac);
      if (frac <= 0) { clearInterval(id); onDismiss(); }
    }, 50);
    return () => clearInterval(id);
  }, [prompt, result]);

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
          setTimeout(onDismiss, 500);
        } else {
          setProgress(next);
          onKeyPress(key);
        }
      } else {
        setProgress(0);
        setShake(true);
        setTimeout(() => setShake(false), 280);
        onKeyPress(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prompt, progress, result, onKeyPress]);

  if (!prompt) return null;

  const timerColor = timeLeft > 0.5 ? "#22c55e" : timeLeft > 0.25 ? "#eab308" : "#ef4444";
  const borderColor = result === "success" ? "#22c55e" : result === "failed" ? "#ef4444" : "#eab308";

  return (
    <div
      data-testid="qte-prompt"
      style={{
        background: "rgba(10,12,22,0.88)",
        border: `1.5px solid ${borderColor}`,
        borderRadius: 12,
        padding: "8px 12px 10px",
        minWidth: 0,
        width: 210,
        textAlign: "center",
        boxShadow: `0 4px 20px rgba(0,0,0,0.55), 0 0 12px ${borderColor}33`,
        transform: shake ? "translateX(-5px)" : "none",
        transition: "transform 0.05s",
        pointerEvents: "none",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Label */}
      <div style={{ fontSize: 9, fontWeight: 800, color: "#eab308", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
        ⚡ Counter!
      </div>

      {/* Key sequence */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 6 }}>
        {prompt.sequence.map((key, i) => {
          const done = result === "success" || i < progress;
          const current = i === progress;
          return (
            <div
              key={i}
              data-testid={`qte-key-${i}`}
              style={{
                width: 30, height: 30,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 7, fontSize: 14, fontWeight: 800,
                border: `1.5px solid ${done ? "#22c55e" : current ? "#eab308" : "#334155"}`,
                background: done ? "rgba(34,197,94,0.18)" : current ? "rgba(234,179,8,0.15)" : "rgba(30,41,59,0.4)",
                color: done ? "#22c55e" : current ? "#eab308" : "#475569",
                transition: "all 0.08s",
              }}
            >
              {KEY_DISPLAY[key] ?? key.toUpperCase()}
            </div>
          );
        })}
      </div>

      {/* Timer bar */}
      <div data-testid="qte-timer" style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${timeLeft * 100}%`, background: timerColor, borderRadius: 2, transition: "width 0.05s linear, background 0.3s" }} />
      </div>

      {/* Result flash */}
      {result && (
        <div
          data-testid="qte-result"
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 11,
            background: result === "success" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)",
            color: result === "success" ? "#22c55e" : "#ef4444",
            fontSize: 15, fontWeight: 900, letterSpacing: "0.1em",
          }}
        >
          {result === "success" ? "BLOCKED!" : "MISS"}
        </div>
      )}
    </div>
  );
}

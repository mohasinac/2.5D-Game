import { useEffect, useRef, useState } from "react";
import type { QTEPromptData } from "@/game/hooks/useColyseus";
import { C, alpha } from "@/styles/theme";

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

  const timerColor = timeLeft > 0.5 ? C.green : timeLeft > 0.25 ? C.yellow : C.red;

  return (
    <div
      data-testid="qte-prompt"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) ${shake ? "translateX(-6px)" : ""}`,
        background: alpha(C.bg1, 0.97),
        border: `2px solid ${result === "success" ? C.green : result === "failed" ? C.red : C.yellow}`,
        borderRadius: 16,
        padding: "20px 28px",
        minWidth: 280,
        textAlign: "center",
        zIndex: 200,
        transition: "transform 0.05s",
        boxShadow: "0 4px 32px rgba(0,0,0,0.6)",
        animation: shake ? "shake 0.3s ease" : undefined,
      }}
    >
      {/* Header */}
      <div style={{ fontSize: 11, color: C.yellow, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>
        ⚡ Counter Chance!
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
        Press the sequence to block their special move
      </div>

      {/* Key sequence */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 18 }}>
        {prompt.sequence.map((key, i) => (
          <div
            key={i}
            data-testid={`qte-key-${i}`}
            style={{
              width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 10,
              fontSize: 20, fontWeight: 700,
              border: `2px solid ${
                result === "success" ? C.green :
                i < progress ? C.green :
                i === progress ? C.yellow :
                C.border
              }`,
              background: alpha(
                i < progress ? C.green : i === progress ? C.yellow : C.bg3,
                i < progress ? 0.2 : i === progress ? 0.15 : 0.5
              ),
              color: i < progress ? C.green : i === progress ? C.yellow : C.muted,
              transition: "all 0.1s",
            }}
          >
            {KEY_DISPLAY[key] ?? key.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Timer bar */}
      <div
        data-testid="qte-timer"
        style={{
          height: 6, borderRadius: 3,
          background: C.bg3,
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        <div style={{
          height: "100%",
          width: `${timeLeft * 100}%`,
          background: timerColor,
          transition: "width 0.05s linear, background 0.3s",
          borderRadius: 3,
        }} />
      </div>

      <div style={{ fontSize: 11, color: C.faint }}>
        {Math.ceil(timeLeft * prompt.windowTicks)} ticks remaining
      </div>

      {/* Result overlay */}
      {result && (
        <div
          data-testid="qte-result"
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 14,
            background: alpha(result === "success" ? C.green : C.red, 0.15),
            fontSize: 22, fontWeight: 900,
            color: result === "success" ? C.green : C.red,
          }}
        >
          {result === "success" ? "BLOCKED!" : "TOO SLOW"}
        </div>
      )}
    </div>
  );
}

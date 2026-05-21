// Countdown — pre-match 3-2-1-FIGHT overlay. Listens to game state.status="warmup"
// + state.timer and renders a big centered number until the timer hits 0.
// See plan: Part 14 gameplay polish.

import { useEffect, useRef, useState } from "react";
import { SoundManager } from "@/game/audio/SoundManager";

interface CountdownProps {
  status: string;            // game state status ("warmup" while counting)
  timer: number;             // seconds remaining in the warmup
  show?: boolean;            // explicit override
}

export function Countdown({ status, timer, show }: CountdownProps) {
  const lastSecondRef = useRef<number | null>(null);
  const [flash, setFlash] = useState(false);

  const active = show ?? (status === "warmup" && timer > 0);
  const seconds = Math.ceil(timer);

  // Play tick sounds + GO blast on each whole-second change.
  useEffect(() => {
    if (!active) { lastSecondRef.current = null; return; }
    if (lastSecondRef.current !== seconds) {
      lastSecondRef.current = seconds;
      if (seconds > 0) {
        SoundManager.play("countdown-tick");
      }
    }
  }, [active, seconds]);

  // FIGHT! flash for the brief moment timer reaches 0 in warmup.
  useEffect(() => {
    if (status === "warmup" && timer <= 0.5 && timer > 0) {
      SoundManager.play("countdown-go");
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [status, timer]);

  if (!active && !flash) return null;

  return (
    <div
      aria-live="polite"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 60,
        background: flash ? "rgba(255,200,60,0.18)" : "rgba(0,0,0,0)",
        transition: "background 200ms",
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontWeight: 900,
          fontSize: flash ? "10rem" : "8rem",
          color: flash ? "#ffcc44" : "#f1f5f9",
          textShadow: "0 0 24px rgba(0,0,0,0.7), 0 0 6px rgba(255,255,255,0.4)",
          transform: flash ? "scale(1.12)" : "scale(1)",
          transition: "transform 200ms ease-out, font-size 200ms",
          letterSpacing: "0.08em",
        }}
      >
        {flash ? "FIGHT!" : seconds}
      </div>
    </div>
  );
}

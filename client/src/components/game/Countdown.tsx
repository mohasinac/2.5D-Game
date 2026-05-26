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

  const active = show ?? (status === "warmup" && timer > 0 && timer <= 3);
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

  // "Let It Rip!" flash when warmup ends and launch phase begins.
  useEffect(() => {
    if (status === "launching") {
      SoundManager.play("countdown-go");
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1200);
      return () => clearTimeout(t);
    }
  }, [status]);

  if (!active && !flash) return null;

  return (
    <div
      aria-live="polite"
      className={`absolute inset-0 flex items-center justify-center pointer-events-none z-[60] [transition:background_200ms] ${flash ? "bg-[rgba(255,200,60,0.18)]" : "bg-transparent"}`}
    >
      <div
        className={`font-mono font-black tracking-[0.08em] [text-shadow:0_0_24px_rgba(0,0,0,0.7),0_0_6px_rgba(255,255,255,0.4)] [transition:transform_200ms_ease-out,font-size_200ms] ${flash ? "text-[10rem] text-[#ffcc44] scale-[1.12]" : "text-[8rem] text-[#f1f5f9] scale-100"}`}
      >
        {flash ? "Let It Rip!" : seconds}
      </div>
    </div>
  );
}

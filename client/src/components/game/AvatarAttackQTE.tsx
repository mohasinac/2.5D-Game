// AvatarAttackQTE — full-screen timing QTE shown when a special move activates.
// Player taps the big button when the needle is inside the gold perfect zone.
// 3 rounds, perfect window narrows each round (30% → 25% → 20% of bar width).
// Calls onComplete(hits) where hits = 0–3 perfect taps.

import React, { useCallback, useEffect, useRef, useState } from "react";

const NEEDLE_SPEED = 1.4;     // oscillations per second
const ROUND_WINDOW_PX = [0.30, 0.25, 0.20]; // perfect zone width as fraction of bar
const ROUND_MS = 2000;        // ms per round before it auto-misses

interface AvatarAttackQTEProps {
  moveName: string;
  moveEmoji: string;
  avatarImageUrl?: string;
  onComplete: (hits: number) => void;
}

type HitResult = "perfect" | "miss" | null;

export function AvatarAttackQTE({ moveName, moveEmoji, avatarImageUrl, onComplete }: AvatarAttackQTEProps) {
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState<HitResult[]>([null, null, null]);
  const [done, setDone] = useState(false);
  const [flashResult, setFlashResult] = useState<"perfect" | "miss" | null>(null);

  // Animated needle position (0–1)
  const needleRef = useRef(0);
  const [needlePos, setNeedlePos] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const roundStartRef = useRef<number>(performance.now());

  const advance = useCallback((result: "perfect" | "miss") => {
    setFlashResult(result);
    setHits(prev => {
      const next = [...prev];
      next[round] = result;
      return next;
    });
    setTimeout(() => setFlashResult(null), 300);

    if (round >= 2) {
      setDone(true);
    } else {
      setRound(r => r + 1);
      roundStartRef.current = performance.now();
    }
  }, [round]);

  // Auto-miss if player doesn't tap in time
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => advance("miss"), ROUND_MS);
    return () => clearTimeout(t);
  }, [round, done, advance]);

  // Animate needle
  useEffect(() => {
    const tick = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      // Oscillate 0→1→0 using abs(sin)
      const raw = Math.abs(Math.sin(elapsed * Math.PI * NEEDLE_SPEED));
      needleRef.current = raw;
      setNeedlePos(raw);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Notify parent when done
  useEffect(() => {
    if (!done) return;
    const count = hits.filter(h => h === "perfect").length;
    const t = setTimeout(() => onComplete(count), 800);
    return () => clearTimeout(t);
  }, [done, hits, onComplete]);

  const handleTap = useCallback(() => {
    if (done) return;
    const zoneWidth = ROUND_WINDOW_PX[round];
    const center = 0.5;
    const inZone = Math.abs(needleRef.current - center) <= zoneWidth / 2;
    advance(inZone ? "perfect" : "miss");
    navigator.vibrate?.(inZone ? [20, 10, 20] : 15);
  }, [done, round, advance]);

  const perfectCount = hits.filter(h => h === "perfect").length;
  const damageLabels = ["BLOCKED!", "100% DAMAGE!", "175% DAMAGE!", "250% DAMAGE!"];
  const damageColors = ["#888", "#fff", "#FFCC00", "#FFD700"];

  return (
    <div
      className="absolute inset-0 z-[150] flex flex-col items-center justify-center pointer-events-auto"
      style={{ background: "rgba(5,8,20,0.95)" }}
    >
      {/* Screen flash on result */}
      {flashResult && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: flashResult === "perfect" ? "rgba(255,215,0,0.18)" : "rgba(255,50,50,0.18)", transition: "background 150ms" }}
        />
      )}

      {/* Avatar / emoji */}
      <div className="relative z-[2] flex flex-col items-center gap-4 px-6 w-full max-w-[400px]">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-[#FFD700] shadow-[0_0_32px_rgba(255,215,0,0.4)]"
          style={{ background: "rgba(255,215,0,0.1)" }}
        >
          {avatarImageUrl ? (
            <img src={avatarImageUrl} alt={moveName} className="w-20 h-20 object-contain" />
          ) : (
            <span className="text-5xl">{moveEmoji}</span>
          )}
        </div>

        <div className="text-center">
          <div
            className="text-[clamp(1rem,3vw,1.6rem)] font-black tracking-wider text-[#FFD700] [animation:textPulse_0.8s_ease-in-out_infinite]"
            style={{ textShadow: "0 0 20px #FFD70088" }}
          >
            {moveName.toUpperCase()}!!!
          </div>
        </div>

        {/* Hit indicators */}
        <div className="flex gap-3">
          {hits.map((h, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold"
              style={{
                borderColor: h === "perfect" ? "#FFD700" : h === "miss" ? "#FF3333" : "rgba(255,255,255,0.2)",
                background: h === "perfect" ? "rgba(255,215,0,0.2)" : h === "miss" ? "rgba(255,51,51,0.2)" : "transparent",
                color: h === "perfect" ? "#FFD700" : h === "miss" ? "#FF3333" : "rgba(255,255,255,0.3)",
              }}
            >
              {h === "perfect" ? "✓" : h === "miss" ? "✗" : i + 1}
            </div>
          ))}
        </div>

        {!done ? (
          <>
            {/* Timing bar */}
            <div className="w-full relative">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2 text-center">
                TAP when needle hits the zone!
              </div>
              <div
                className="relative w-full h-6 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                {/* Perfect zone */}
                <div
                  className="absolute top-0 bottom-0 rounded-full"
                  style={{
                    left: `${(0.5 - ROUND_WINDOW_PX[round] / 2) * 100}%`,
                    width: `${ROUND_WINDOW_PX[round] * 100}%`,
                    background: "rgba(255,215,0,0.4)",
                    border: "1px solid #FFD70066",
                  }}
                />
                {/* Needle */}
                <div
                  className="absolute top-1 bottom-1 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  style={{ left: `calc(${needlePos * 100}% - 3px)` }}
                />
              </div>
            </div>

            {/* TAP button */}
            <button
              className="w-full h-16 rounded-2xl font-black text-[18px] uppercase tracking-[0.15em] text-white transition-transform active:scale-95"
              style={{
                background: "linear-gradient(135deg, #1a3a6e, #2563eb)",
                border: "2px solid #3b82f6",
                boxShadow: "0 0 20px rgba(59,130,246,0.4)",
              }}
              onPointerDown={handleTap}
            >
              TAP!
            </button>
          </>
        ) : (
          /* Result */
          <div className="flex flex-col items-center gap-2">
            <div
              className="text-[clamp(1.2rem,3.5vw,2rem)] font-black tracking-[0.2em] [animation:scaleUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]"
              style={{ color: damageColors[perfectCount], textShadow: `0 0 24px ${damageColors[perfectCount]}88` }}
            >
              {damageLabels[perfectCount]}
            </div>
            <div className="text-[11px] font-mono text-white/40">
              {perfectCount}/3 perfect hits
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes textPulse { 0%,100% { opacity:1; } 50% { opacity:0.7; } }
        @keyframes scaleUp   { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
      `}</style>
    </div>
  );
}

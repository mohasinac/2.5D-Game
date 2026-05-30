// ConfettiLayer — CSS confetti burst for the victory screen.
// 80 particles with random colors, sizes, and fall arcs.
// Pure DOM + CSS; no PixiJS dependency required for this overlay.

import React, { useMemo } from "react";

const COLORS = [
  "#FFD700", "#FF3333", "#00FF88", "#4D9FFF",
  "#FF8C00", "#AA55FF", "#FF69B4", "#00E5FF",
];

interface Particle {
  id: number;
  x: number;       // start left %
  size: number;    // px
  color: string;
  delay: number;   // s
  dur: number;     // s
  rotate: number;  // initial rotation deg
  drift: number;   // horizontal drift % during fall
  shape: "rect" | "circle" | "ribbon";
}

function genParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 6 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 1.2,
    dur: 2.5 + Math.random() * 1.5,
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 30,
    shape: (["rect", "circle", "ribbon"] as const)[Math.floor(Math.random() * 3)],
  }));
}

interface ConfettiLayerProps {
  active: boolean;
}

export function ConfettiLayer({ active }: ConfettiLayerProps) {
  const particles = useMemo(() => genParticles(80), []);

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[120]" aria-hidden>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-10px",
            width: p.shape === "ribbon" ? p.size / 2 : p.size,
            height: p.shape === "ribbon" ? p.size * 3 : p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "ribbon" ? "2px" : "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.dur}s ease-in ${p.delay}s forwards`,
            "--drift": `${p.drift}vw`,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: rotate(var(--r0)) translateX(0);   opacity:1; top:-10px; }
          80%  { opacity:0.8; }
          100% { transform: rotate(calc(var(--r0) + 360deg)) translateX(var(--drift)); opacity:0; top:110%; }
        }
      `}</style>
    </div>
  );
}

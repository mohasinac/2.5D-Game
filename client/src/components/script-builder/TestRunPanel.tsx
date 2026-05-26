// 300×300 PixiJS mini arena for live combo preview.
// Spins a mock beyblade and applies BehaviorRef steps when "Test" is clicked.

import { useEffect, useRef, useState } from "react";
import type { BehaviorRef } from "@/types/comboTask";

interface MockBey {
  x: number; y: number;
  vx: number; vy: number;
  spin: number; power: number;
  color: string;
}

interface Props {
  steps: BehaviorRef[];
}

const W = 300, H = 300, ARENA_R = 130;

export function TestRunPanel({ steps }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const beys = useRef<MockBey[]>([
    { x: W / 2 - 40, y: H / 2, vx: 1, vy: 0, spin: 100, power: 80, color: "#3b82f6" },
    { x: W / 2 + 40, y: H / 2, vx: -1, vy: 0, spin: 100, power: 80, color: "#ef4444" },
  ]);
  const [running, setRunning] = useState(false);
  const [fired, setFired] = useState(false);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, W, H);

    // Arena circle
    ctx.save();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, ARENA_R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Beyblades
    for (const b of beys.current) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x, b.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = b.color + "44";
      ctx.fill();
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      // Spin indicator
      ctx.fillStyle = b.color;
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(Math.round(b.spin).toString(), b.x, b.y);
      ctx.restore();
    }
  }

  function tick() {
    const cx = W / 2, cy = H / 2;
    for (const b of beys.current) {
      b.x += b.vx;
      b.y += b.vy;
      b.spin = Math.max(0, b.spin - 0.05);
      // Bounce off arena wall
      const dist = Math.hypot(b.x - cx, b.y - cy);
      if (dist + 18 > ARENA_R) {
        const nx = (b.x - cx) / dist, ny = (b.y - cy) / dist;
        const dot = b.vx * nx + b.vy * ny;
        b.vx -= 2 * dot * nx;
        b.vy -= 2 * dot * ny;
        b.x = cx + nx * (ARENA_R - 18);
        b.y = cy + ny * (ARENA_R - 18);
      }
      // Friction
      b.vx *= 0.995;
      b.vy *= 0.995;
    }
    draw();
    if (running) rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (running) rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  function applySteps() {
    const b = beys.current[0];
    for (const step of steps) {
      if (step.behaviorId === "movement.dash") {
        const angle = (step.params as Record<string, unknown>)?.angle as number ?? 0;
        const force = (step.params as Record<string, unknown>)?.force as number ?? 8;
        b.vx += Math.cos(angle) * force;
        b.vy += Math.sin(angle) * force;
      } else if (step.behaviorId === "movement.swap_position") {
        const other = beys.current[1];
        [b.x, other.x] = [other.x, b.x];
        [b.y, other.y] = [other.y, b.y];
        [b.vx, other.vx] = [other.vx, b.vx];
        [b.vy, other.vy] = [other.vy, b.vy];
      } else if (step.behaviorId === "factor.boost") {
        const mult = (step.params as Record<string, unknown>)?.multiplier as number ?? 1.3;
        const stat = (step.params as Record<string, unknown>)?.stat as string ?? "damageMultiplier";
        if (stat === "spin") b.spin = Math.min(100, b.spin * mult);
        if (stat === "speed") { b.vx *= mult; b.vy *= mult; }
      }
    }
    setFired(true);
    setTimeout(() => setFired(false), 800);
  }

  function reset() {
    beys.current = [
      { x: W / 2 - 40, y: H / 2, vx: 1, vy: 0, spin: 100, power: 80, color: "#3b82f6" },
      { x: W / 2 + 40, y: H / 2, vx: -1, vy: 0, spin: 100, power: 80, color: "#ef4444" },
    ];
    draw();
  }

  return (
    <div className="p-3 flex flex-col gap-[10px]">
      <div className="text-[11px] font-bold text-theme-muted uppercase tracking-[0.05em]">
        Mini Arena Preview
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="bg-[#0f172a] rounded-xl border border-border-c w-[300px] h-[300px]"
      />
      <div className="flex gap-[6px]">
        <button
          type="button"
          onClick={() => setRunning(r => !r)}
          className={`flex-1 py-[5px] px-3 rounded-lg text-[12px] cursor-pointer font-semibold border ${running ? "bg-red-10 border-[rgba(239,68,68,0.27)] text-theme-red" : "bg-green-10 border-[rgba(34,197,94,0.27)] text-theme-green"}`}
        >
          {running ? "■ Stop" : "▶ Play"}
        </button>
        <button
          type="button"
          onClick={applySteps}
          disabled={steps.length === 0}
          className={`flex-1 py-[5px] px-3 rounded-lg text-[12px] font-semibold border ${steps.length === 0 ? "opacity-40" : "opacity-100"} ${fired ? "bg-yellow-10 border-[rgba(234,179,8,0.27)] text-theme-yellow" : "bg-blue-13 border-[rgba(59,130,246,0.27)] text-theme-blue"}`}
          // cursor is conditional on steps presence
        >
          {fired ? "✓ Fired!" : "⚡ Fire Steps"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="py-[5px] px-[10px] bg-transparent border border-border-c rounded-lg text-theme-muted text-[12px] cursor-pointer"
        >
          ↺
        </button>
      </div>
      <p className="text-[10px] text-theme-faint m-0">Blue bey = caster, Red = target. Fire steps to preview movement effects.</p>
    </div>
  );
}

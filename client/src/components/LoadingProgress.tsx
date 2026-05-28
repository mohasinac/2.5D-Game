import { useEffect, useRef } from "react";

export type LoadingStep =
  | "connecting-ws"
  | "joining-room"
  | "loading-arena-assets"
  | "loading-beyblade-assets"
  | "loading-audio-assets"
  | "warmup-ready";

const STEP_ORDER: LoadingStep[] = [
  "connecting-ws",
  "joining-room",
  "loading-arena-assets",
  "loading-beyblade-assets",
  "loading-audio-assets",
  "warmup-ready",
];

const STEP_LABEL: Record<LoadingStep, string> = {
  "connecting-ws":             "Connecting to server",
  "joining-room":              "Joining room",
  "loading-arena-assets":      "Loading arena",
  "loading-beyblade-assets":   "Loading beyblade",
  "loading-audio-assets":      "Loading audio",
  "warmup-ready":              "Ready — Let It Rip!",
};

const STEP_COLOR: Record<LoadingStep, string> = {
  "connecting-ws":           "#3b82f6",
  "joining-room":            "#8b5cf6",
  "loading-arena-assets":    "#10b981",
  "loading-beyblade-assets": "#f59e0b",
  "loading-audio-assets":    "#ec4899",
  "warmup-ready":            "#22c55e",
};

export interface LoadingProgressProps {
  currentStep: LoadingStep;
  stepProgress?: number;
  error?: string;
}

// ── Spinning beyblade canvas animation ──────────────────────────────────────
function BeybladeSpinner({ color, spinning }: { color: string; spinning: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const angleRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 96;
    const cx = size / 2, cy = size / 2;
    const R = 40;

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, size, size);
      const a = angleRef.current;

      // Outer glow ring
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, R + 6, 0, Math.PI * 2);
      ctx.strokeStyle = color + "55";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Arena floor circle
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = "#0d1830";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Spinning beyblade body
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);

      // 4 blade petals
      const bladeColors = [color, "#ffffff40", color + "cc", "#ffffff30"];
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(10, -8, 20, -4, R * 0.65, 0);
        ctx.bezierCurveTo(20, 4, 10, 8, 0, 0);
        ctx.fillStyle = bladeColors[i];
        ctx.fill();
        ctx.restore();
      }

      // Center hub
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();


      if (spinning) {
        angleRef.current += 0.12;
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [color, spinning]);

  return (
    <canvas
      ref={canvasRef}
      width={96}
      height={96}
      className="block"
    />
  );
}

export function LoadingProgress({ currentStep, stepProgress = 0, error }: LoadingProgressProps) {
  const idx = Math.max(0, STEP_ORDER.indexOf(currentStep));
  const totalSteps = STEP_ORDER.length;
  const completed = idx + Math.min(1, Math.max(0, stepProgress));
  const pct = Math.min(100, Math.round((completed / totalSteps) * 100));
  const isDone = currentStep === "warmup-ready" && stepProgress >= 0.999;
  const activeColor = error ? "#ef4444" : STEP_COLOR[currentStep];
  const barColor = error ? "#ef4444" : isDone ? "#22c55e" : activeColor;

  return (
    <div data-testid="loading-progress" className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,#0a1428_0%,#050c18_100%)] text-theme-text p-8 overflow-hidden">
      {/* Background particle dots (pure CSS, no JS) */}
      {[...Array(12)].map((_, i) => (
        <div key={i}
          className="absolute w-[3px] h-[3px] rounded-full bg-[color:var(--ac)] [animation:pulse_var(--adur)_ease-in-out_infinite_alternate] [animation-delay:var(--adel)]"
          style={{
            "--ac": activeColor,
            "--adur": `${1.5 + (i % 3) * 0.5}s`,
            "--adel": `${(i * 0.2) % 1.4}s`,
            opacity: 0.15 + (i % 4) * 0.05,
            left: `${8 + (i * 7.5) % 90}%`,
            top: `${5 + (i * 11) % 88}%`,
          } as React.CSSProperties}
        />
      ))}

      <style>{`
        @keyframes pulse { from { transform: scale(1); opacity: 0.15; } to { transform: scale(2.5); opacity: 0.5; } }
        @keyframes glow  { from { text-shadow: 0 0 8px transparent; }  to { text-shadow: 0 0 18px currentColor; } }
      `}</style>

      {/* Spinning beyblade */}
      <div className={`mb-5 ${error ? "[filter:grayscale(0.8)]" : ""}`}>
        <BeybladeSpinner color={activeColor} spinning={!error && !isDone} />
      </div>

      {/* Status */}
      <div
        className={`text-[13px] font-bold tracking-[0.1em] uppercase mb-1 text-[color:var(--bc)] ${!error && !isDone ? "[animation:glow_1.4s_ease-in-out_infinite_alternate]" : ""}`}
        style={{ "--bc": barColor } as React.CSSProperties}
      >
        {error ? "Connection Error" : STEP_LABEL[currentStep]}
      </div>
      <div className="text-[11px] text-theme-faint mb-5 font-mono">
        Step {idx + 1} / {totalSteps} · {pct}%
      </div>

      {/* Progress bar */}
      <div className="w-[320px] h-[6px] bg-white/[.06] rounded-[3px] overflow-hidden border border-white/[.08] mb-[14px]">
        <div
          className="h-full rounded-[3px] [transition:width_300ms_ease-out] w-[--pct] bg-[--pbg] shadow-[--pshadow]"
          style={{ "--bc": barColor, "--pct": `${pct}%`, "--pbg": `linear-gradient(90deg, ${barColor}bb, ${barColor})`, "--pshadow": `0 0 8px ${barColor}88` } as React.CSSProperties}
        />
      </div>

      {/* Step dots */}
      <div className="flex gap-[10px]">
        {STEP_ORDER.map((step, i) => {
          const done   = i < idx;
          const active = i === idx;
          const c      = done ? "#22c55e" : active ? barColor : "rgba(255,255,255,0.12)";
          return (
            <div
              key={step}
              data-testid={`loading-step-${step}`}
              title={STEP_LABEL[step]}
              className="h-2 rounded-[4px] [transition:all_300ms_ease] w-[--dw] bg-[--dc] shadow-[--dshadow]"
              style={{ "--dc": c, "--dshadow": active ? `0 0 8px ${c}` : "none", "--dw": active ? "24px" : "8px" } as React.CSSProperties}
            />
          );
        })}
      </div>

      {error && (
        <div className="mt-5 px-4 py-[10px] bg-red-10 border border-[rgba(239,68,68,0.35)] rounded-lg text-theme-red text-[12px] max-w-[360px] text-center leading-[1.5]">
          {error}
        </div>
      )}
    </div>
  );
}

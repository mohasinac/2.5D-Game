import { useEffect, useRef } from "react";
import { C, alpha } from "@/styles/theme";

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
      style={{ display: "block" }}
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
    <div data-testid="loading-progress" style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at center, #0a1428 0%, #050c18 100%)",
      color: C.text, padding: 32, zIndex: 50,
      overflow: "hidden",
    }}>
      {/* Background particle dots (pure CSS, no JS) */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 3, height: 3,
          borderRadius: "50%",
          background: activeColor,
          opacity: 0.15 + (i % 4) * 0.05,
          left: `${8 + (i * 7.5) % 90}%`,
          top:  `${5 + (i * 11) % 88}%`,
          animation: `pulse ${1.5 + (i % 3) * 0.5}s ease-in-out infinite alternate`,
          animationDelay: `${(i * 0.2) % 1.4}s`,
        }} />
      ))}

      <style>{`
        @keyframes pulse { from { transform: scale(1); opacity: 0.15; } to { transform: scale(2.5); opacity: 0.5; } }
        @keyframes glow  { from { text-shadow: 0 0 8px transparent; }  to { text-shadow: 0 0 18px currentColor; } }
      `}</style>

      {/* Spinning beyblade */}
      <div style={{ marginBottom: 20, filter: error ? "grayscale(0.8)" : "none" }}>
        <BeybladeSpinner color={activeColor} spinning={!error && !isDone} />
      </div>

      {/* Status */}
      <div style={{
        fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
        color: barColor, marginBottom: 4,
        animation: !error && !isDone ? "glow 1.4s ease-in-out infinite alternate" : "none",
      }}>
        {error ? "Connection Error" : STEP_LABEL[currentStep]}
      </div>
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 20, fontFamily: "monospace" }}>
        Step {idx + 1} / {totalSteps} · {pct}%
      </div>

      {/* Progress bar */}
      <div style={{
        width: 320, height: 6,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 3, overflow: "hidden",
        border: `1px solid rgba(255,255,255,0.08)`,
        marginBottom: 14,
      }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, ${barColor}bb, ${barColor})`,
          borderRadius: 3,
          transition: "width 300ms ease-out",
          boxShadow: `0 0 8px ${barColor}88`,
        }} />
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", gap: 10 }}>
        {STEP_ORDER.map((step, i) => {
          const done   = i < idx;
          const active = i === idx;
          const c      = done ? "#22c55e" : active ? barColor : "rgba(255,255,255,0.12)";
          return (
            <div key={step} data-testid={`loading-step-${step}`} title={STEP_LABEL[step]} style={{
              width: active ? 24 : 8, height: 8, borderRadius: 4,
              background: c,
              transition: "all 300ms ease",
              boxShadow: active ? `0 0 8px ${c}` : "none",
            }} />
          );
        })}
      </div>

      {error && (
        <div style={{
          marginTop: 20, padding: "10px 16px",
          background: "rgba(239,68,68,0.12)",
          border: "1px solid rgba(239,68,68,0.35)",
          borderRadius: 8, color: "#ef4444", fontSize: 12,
          maxWidth: 360, textAlign: "center", lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

import { C } from "@/styles/theme";

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
  "loading-arena-assets":      "Loading arena assets",
  "loading-beyblade-assets":   "Loading beyblade assets",
  "loading-audio-assets":      "Loading audio",
  "warmup-ready":              "Ready",
};

export interface LoadingProgressProps {
  currentStep: LoadingStep;
  /** Optional per-step sub-progress 0..1. When omitted, only step boundaries advance. */
  stepProgress?: number;
  /** Inline error message — switches the bar to a red error state. */
  error?: string;
}

export function LoadingProgress({ currentStep, stepProgress = 0, error }: LoadingProgressProps) {
  const idx = Math.max(0, STEP_ORDER.indexOf(currentStep));
  const totalSteps = STEP_ORDER.length;
  // Each step is 1/totalSteps; current step contributes (stepProgress / totalSteps).
  const completed = idx + Math.min(1, Math.max(0, stepProgress));
  const pct = Math.min(100, Math.round((completed / totalSteps) * 100));
  const isDone = currentStep === "warmup-ready" && stepProgress >= 0.999;
  const barColor = error ? C.red : isDone ? C.green : C.blue;

  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: C.bg0, color: C.text, padding: 32, zIndex: 50,
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🌀</div>
      <div style={{ fontSize: 14, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
        {error ? "Connection error" : STEP_LABEL[currentStep]}
      </div>
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 16, fontFamily: "monospace" }}>
        Step {idx + 1} / {totalSteps} · {pct}%
      </div>

      {/* Bar */}
      <div style={{ width: 320, height: 8, background: C.bg2, borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}` }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: barColor,
          transition: "width 200ms ease-out",
        }} />
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {STEP_ORDER.map((step, i) => (
          <div key={step} title={STEP_LABEL[step]} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: i < idx ? C.green : i === idx ? barColor : C.bg3,
            transition: "background 200ms",
          }} />
        ))}
      </div>

      {error && (
        <div style={{
          marginTop: 16, padding: "8px 14px", background: C.red + "20",
          border: `1px solid ${C.red}66`, borderRadius: 8, color: C.red, fontSize: 12,
          maxWidth: 360, textAlign: "center",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

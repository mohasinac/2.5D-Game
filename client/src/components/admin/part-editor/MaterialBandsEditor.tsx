import { useState } from "react";
import { MaterialSelector } from "./MaterialSelector";
import type { Material, MaterialBand, WearStep } from "@/types/beybladeSystem";

interface Props {
  value: MaterialBand[];
  onChange: (bands: MaterialBand[]) => void;
}

// ── Wear schedule helpers ──────────────────────────────────────────────────────

const WEAR_PRESETS: Array<{ label: string; steps: WearStep[] }> = [
  { label: "No wear",        steps: [] },
  { label: "100→50 / 3 min", steps: [{ atSecond: 0, wearLevel: 100 }, { atSecond: 180, wearLevel: 50 }] },
  { label: "100→0 / 3 min",  steps: [{ atSecond: 0, wearLevel: 100 }, { atSecond: 180, wearLevel: 0 }] },
  { label: "Stepped",        steps: [{ atSecond: 0, wearLevel: 100 }, { atSecond: 60, wearLevel: 80 }, { atSecond: 120, wearLevel: 60 }, { atSecond: 180, wearLevel: 40 }] },
];

function wearLevelAt(steps: WearStep[], second: number): number {
  if (!steps.length) return 100;
  const sorted = [...steps].sort((a, b) => a.atSecond - b.atSecond);
  if (second <= sorted[0].atSecond) return sorted[0].wearLevel;
  for (let i = 1; i < sorted.length; i++) {
    if (second <= sorted[i].atSecond) {
      const t = (second - sorted[i - 1].atSecond) / (sorted[i].atSecond - sorted[i - 1].atSecond);
      return sorted[i - 1].wearLevel + t * (sorted[i].wearLevel - sorted[i - 1].wearLevel);
    }
  }
  return sorted[sorted.length - 1].wearLevel;
}

function WearScheduleEditor({
  steps,
  onChange,
}: {
  steps: WearStep[];
  onChange: (steps: WearStep[]) => void;
}) {
  const sorted = [...steps].sort((a, b) => a.atSecond - b.atSecond);

  const updateStep = (idx: number, patch: Partial<WearStep>) => {
    const next = sorted.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    onChange(next.sort((a, b) => a.atSecond - b.atSecond));
  };

  const addStep = () => {
    const lastT = sorted.length ? sorted[sorted.length - 1].atSecond + 60 : 0;
    const lastW = sorted.length ? sorted[sorted.length - 1].wearLevel : 100;
    onChange([...sorted, { atSecond: lastT, wearLevel: lastW }]);
  };

  const removeStep = (idx: number) => onChange(sorted.filter((_, i) => i !== idx));

  // Simple sparkline: 0–300s, 60px tall
  const W = 260, H = 54, maxT = Math.max(300, ...sorted.map((s) => s.atSecond));
  const pts = [
    { x: 0, y: H - (wearLevelAt(sorted, 0) / 100) * H },
    ...Array.from({ length: 60 }, (_, i) => {
      const t = (i / 59) * maxT;
      return { x: (t / maxT) * W, y: H - (wearLevelAt(sorted, t) / 100) * H };
    }),
  ];
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <div className="mt-2.5 pt-2.5 border-t border-border-c">
      {/* Preview sparkline */}
      <svg width={W} height={H + 8} className="block mb-2">
        {/* Grid lines at 25/50/75% */}
        {[25, 50, 75].map((y) => (
          <line key={y} x1={0} y1={H - (y / 100) * H} x2={W} y2={H - (y / 100) * H}
            stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3,3" />
        ))}
        <path d={pathD} fill="none" stroke="var(--blue)" strokeWidth={1.5} />
        {/* Step dot markers */}
        {sorted.map((s, i) => (
          <circle key={i} cx={(s.atSecond / maxT) * W} cy={H - (s.wearLevel / 100) * H}
            r={3} fill="var(--blue)" />
        ))}
        <text x={0} y={H + 7} fontSize={8} fill="var(--faint)">0s</text>
        <text x={W - 20} y={H + 7} fontSize={8} fill="var(--faint)">{maxT}s</text>
      </svg>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1 mb-2">
        {WEAR_PRESETS.map((p) => (
          <button key={p.label} onClick={() => onChange(p.steps)}
            className="py-[3px] px-2 text-[10px] rounded cursor-pointer bg-bg2 text-theme-muted border border-border-c">
            {p.label}
          </button>
        ))}
      </div>

      {/* Step rows */}
      <div className="flex flex-col gap-1.5">
        {sorted.map((step, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex justify-between text-[10px] text-theme-faint">
                <span>At (s)</span><span>{step.atSecond}s</span>
              </div>
              <input type="range" min={0} max={300} step={5} value={step.atSecond}
                onChange={(e) => updateStep(i, { atSecond: +e.target.value })}
                className="w-full accent-[var(--blue)]" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex justify-between text-[10px] text-theme-faint">
                <span>Wear</span>
                <span className={step.wearLevel < 40 ? "text-theme-red" : step.wearLevel < 70 ? "text-theme-orange" : "text-theme-green"}>{step.wearLevel}%</span>
              </div>
              <input type="range" min={0} max={100} step={5} value={step.wearLevel}
                onChange={(e) => updateStep(i, { wearLevel: +e.target.value })}
                className={`w-full ${step.wearLevel < 40 ? "accent-[var(--red)]" : "accent-[var(--blue)]"}`} />
            </div>
            <button onClick={() => removeStep(i)}
              className="bg-transparent border-none text-theme-red text-[13px] cursor-pointer pt-3.5">×</button>
          </div>
        ))}
      </div>

      <button onClick={addStep}
        className="mt-2 py-1 px-2.5 text-[10px] rounded cursor-pointer bg-bg3 text-theme-muted border border-border-c">
        + Add step
      </button>

      {sorted.length === 0 && (
        <div className="text-[11px] text-theme-faint mt-1">No schedule — wear stays at 100% all match.</div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function MaterialBandsEditor({ value, onChange }: Props) {
  const [expandedWear, setExpandedWear] = useState<number | null>(null);

  const total = value.reduce((sum, b) => sum + b.coverage, 0);
  const overBudget = total > 1.01;

  const updateBand = (idx: number, patch: Partial<MaterialBand>) => {
    onChange(value.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  };

  const removeBand = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
    if (expandedWear === idx) setExpandedWear(null);
    else if (expandedWear !== null && expandedWear > idx) setExpandedWear(expandedWear - 1);
  };

  const addBand = () => {
    const remaining = Math.max(0, parseFloat((1 - total).toFixed(2)));
    onChange([...value, { material: "abs" as Material, coverage: remaining || 0.1 }]);
  };

  const finalWearLevel = (band: MaterialBand) => {
    const s = band.wearSchedule;
    if (!s?.length) return 100;
    return [...s].sort((a, b) => a.atSecond - b.atSecond).at(-1)!.wearLevel;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-theme-muted">Material Bands</div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono ${overBudget ? "text-theme-red" : total > 0.98 ? "text-theme-green" : "text-theme-muted"}`}>
            {(total * 100).toFixed(0)}% / 100%
          </span>
          <button onClick={addBand}
            className="py-[3px] px-2.5 bg-bg3 border border-border-c rounded cursor-pointer text-[11px] text-theme-muted">
            + Band
          </button>
        </div>
      </div>

      {value.length === 0 && (
        <div className="text-xs text-theme-faint py-2">
          No material bands. Add one or leave empty for a single-material part.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {value.map((band, idx) => {
          const wearOpen = expandedWear === idx;
          const hasWear = !!(band.wearSchedule?.length);
          const endWear = finalWearLevel(band);

          return (
            <div key={idx} className="bg-bg3 border border-border-c rounded-lg py-2.5 px-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-theme-text font-medium">Band {idx + 1}</span>
                <div className="flex items-center gap-2">
                  {/* Wear badge */}
                  <button
                    onClick={() => setExpandedWear(wearOpen ? null : idx)}
                    title="Wear schedule"
                    className={`py-[2px] px-2 text-[10px] rounded cursor-pointer border ${wearOpen ? "bg-orange-10 text-theme-orange border-[rgba(249,115,22,0.35)]" : hasWear ? "bg-[rgba(249,115,22,0.08)] text-theme-orange border-[rgba(249,115,22,0.35)]" : "bg-bg2 text-theme-faint border-border-c"}`}>
                    {hasWear ? `Wear ${endWear}%` : "No wear"}
                  </button>
                  <button onClick={() => removeBand(idx)}
                    className="text-xs text-theme-red bg-transparent border-none cursor-pointer">×</button>
                </div>
              </div>

              <MaterialSelector value={band.material} onChange={(m) => updateBand(idx, { material: m })} label={undefined} />

              <div className="mt-2.5">
                <div className="flex justify-between text-[11px] text-theme-muted mb-[3px]">
                  <span>Coverage</span>
                  <span className="font-mono">{(band.coverage * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min={0.01} max={1} step={0.01} value={band.coverage}
                  onChange={(e) => updateBand(idx, { coverage: +e.target.value })}
                  className="w-full accent-[var(--blue)]" />
              </div>

              {wearOpen && (
                <WearScheduleEditor
                  steps={band.wearSchedule ?? []}
                  onChange={(steps) => updateBand(idx, { wearSchedule: steps.length ? steps : undefined })}
                />
              )}
            </div>
          );
        })}
      </div>

      {overBudget && (
        <div className="mt-1.5 text-[11px] text-theme-red">
          Total coverage exceeds 100% — adjust band values.
        </div>
      )}
    </div>
  );
}

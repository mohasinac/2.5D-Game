import { useState } from "react";
import { C, alpha } from "@/styles/theme";
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
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
      {/* Preview sparkline */}
      <svg width={W} height={H + 8} style={{ display: "block", marginBottom: 8 }}>
        {/* Grid lines at 25/50/75% */}
        {[25, 50, 75].map((y) => (
          <line key={y} x1={0} y1={H - (y / 100) * H} x2={W} y2={H - (y / 100) * H}
            stroke={C.border} strokeWidth={0.5} strokeDasharray="3,3" />
        ))}
        <path d={pathD} fill="none" stroke={C.blue} strokeWidth={1.5} />
        {/* Step dot markers */}
        {sorted.map((s, i) => (
          <circle key={i} cx={(s.atSecond / maxT) * W} cy={H - (s.wearLevel / 100) * H}
            r={3} fill={C.blue} />
        ))}
        <text x={0} y={H + 7} fontSize={8} fill={C.faint}>0s</text>
        <text x={W - 20} y={H + 7} fontSize={8} fill={C.faint}>{maxT}s</text>
      </svg>

      {/* Preset buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
        {WEAR_PRESETS.map((p) => (
          <button key={p.label} onClick={() => onChange(p.steps)}
            style={{ padding: "3px 8px", fontSize: 10, borderRadius: 5, cursor: "pointer",
              background: C.bg2, color: C.muted, border: `1px solid ${C.border}` }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Step rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sorted.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.faint }}>
                <span>At (s)</span><span>{step.atSecond}s</span>
              </div>
              <input type="range" min={0} max={300} step={5} value={step.atSecond}
                onChange={(e) => updateStep(i, { atSecond: +e.target.value })}
                style={{ width: "100%", accentColor: C.blue }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.faint }}>
                <span>Wear</span><span style={{ color: step.wearLevel < 40 ? C.red : step.wearLevel < 70 ? C.orange : C.green }}>{step.wearLevel}%</span>
              </div>
              <input type="range" min={0} max={100} step={5} value={step.wearLevel}
                onChange={(e) => updateStep(i, { wearLevel: +e.target.value })}
                style={{ width: "100%", accentColor: step.wearLevel < 40 ? C.red : C.blue }} />
            </div>
            <button onClick={() => removeStep(i)}
              style={{ background: "none", border: "none", color: C.red, fontSize: 13, cursor: "pointer", paddingTop: 14 }}>×</button>
          </div>
        ))}
      </div>

      <button onClick={addStep}
        style={{ marginTop: 8, padding: "4px 10px", fontSize: 10, borderRadius: 5, cursor: "pointer",
          background: C.bg3, color: C.muted, border: `1px solid ${C.border}` }}>
        + Add step
      </button>

      {sorted.length === 0 && (
        <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>No schedule — wear stays at 100% all match.</div>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: C.muted }}>Material Bands</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: overBudget ? C.red : total > 0.98 ? C.green : C.muted, fontFamily: "monospace" }}>
            {(total * 100).toFixed(0)}% / 100%
          </span>
          <button onClick={addBand}
            style={{ padding: "3px 10px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 11, color: C.muted, cursor: "pointer" }}>
            + Band
          </button>
        </div>
      </div>

      {value.length === 0 && (
        <div style={{ fontSize: 12, color: C.faint, padding: "8px 0" }}>
          No material bands. Add one or leave empty for a single-material part.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {value.map((band, idx) => {
          const wearOpen = expandedWear === idx;
          const hasWear = !!(band.wearSchedule?.length);
          const endWear = finalWearLevel(band);

          return (
            <div key={idx} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>Band {idx + 1}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Wear badge */}
                  <button
                    onClick={() => setExpandedWear(wearOpen ? null : idx)}
                    title="Wear schedule"
                    style={{ padding: "2px 8px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                      background: wearOpen ? alpha(C.orange, 0.15) : hasWear ? alpha(C.orange, 0.08) : C.bg2,
                      color: hasWear ? C.orange : C.faint,
                      border: `1px solid ${hasWear ? alpha(C.orange, 0.35) : C.border}` }}>
                    {hasWear ? `Wear ${endWear}%` : "No wear"}
                  </button>
                  <button onClick={() => removeBand(idx)}
                    style={{ fontSize: 12, color: C.red, background: "none", border: "none", cursor: "pointer" }}>×</button>
                </div>
              </div>

              <MaterialSelector value={band.material} onChange={(m) => updateBand(idx, { material: m })} label={undefined} />

              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 3 }}>
                  <span>Coverage</span>
                  <span style={{ fontFamily: "monospace" }}>{(band.coverage * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min={0.01} max={1} step={0.01} value={band.coverage}
                  onChange={(e) => updateBand(idx, { coverage: +e.target.value })}
                  style={{ width: "100%", accentColor: C.blue }} />
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
        <div style={{ marginTop: 6, fontSize: 11, color: C.red }}>
          Total coverage exceeds 100% — adjust band values.
        </div>
      )}
    </div>
  );
}

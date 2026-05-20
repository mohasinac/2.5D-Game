import { C } from "@/styles/theme";
import { MaterialSelector } from "./MaterialSelector";
import type { Material, MaterialBand } from "@/types/beybladeSystem";

interface Props {
  value: MaterialBand[];
  onChange: (bands: MaterialBand[]) => void;
}

export function MaterialBandsEditor({ value, onChange }: Props) {
  const total = value.reduce((sum, b) => sum + b.coverage, 0);
  const overBudget = total > 1.01;

  const updateBand = (idx: number, patch: Partial<MaterialBand>) => {
    onChange(value.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  };

  const removeBand = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const addBand = () => {
    const remaining = Math.max(0, parseFloat((1 - total).toFixed(2)));
    onChange([...value, { material: "abs" as Material, coverage: remaining || 0.1 }]);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: C.muted }}>Material Bands</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 11, color: overBudget ? C.red : total > 0.98 ? C.green : C.muted,
              fontFamily: "monospace",
            }}
          >
            {(total * 100).toFixed(0)}% / 100%
          </span>
          <button
            onClick={addBand}
            style={{
              padding: "3px 10px", background: C.bg3, border: `1px solid ${C.border}`,
              borderRadius: 5, fontSize: 11, color: C.muted, cursor: "pointer",
            }}
          >
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
        {value.map((band, idx) => (
          <div
            key={idx}
            style={{
              background: C.bg3, border: `1px solid ${C.border}`,
              borderRadius: 8, padding: "10px 12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>Band {idx + 1}</span>
              <button
                onClick={() => removeBand(idx)}
                style={{ fontSize: 12, color: C.red, background: "none", border: "none", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <MaterialSelector
              value={band.material}
              onChange={(m) => updateBand(idx, { material: m })}
              label={undefined}
            />

            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 3 }}>
                <span>Coverage</span>
                <span style={{ fontFamily: "monospace" }}>{(band.coverage * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.01}
                max={1}
                step={0.01}
                value={band.coverage}
                onChange={(e) => updateBand(idx, { coverage: +e.target.value })}
                style={{ width: "100%", accentColor: C.blue }}
              />
            </div>
          </div>
        ))}
      </div>

      {overBudget && (
        <div style={{ marginTop: 6, fontSize: 11, color: C.red }}>
          Total coverage exceeds 100% — adjust band values.
        </div>
      )}
    </div>
  );
}

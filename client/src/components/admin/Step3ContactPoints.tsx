import { useState } from "react";
import { C, alpha } from "@/styles/theme";
import type { BeybladeStats, PointOfContact } from "@/types/beybladeStats";

interface Step3ContactPointsProps {
  beyblade: BeybladeStats;
  onChange: (updated: Partial<BeybladeStats>) => void;
}

export default function Step3ContactPoints({ beyblade, onChange }: Step3ContactPointsProps) {
  const [selectedCP, setSelectedCP] = useState<number | null>(null);
  const [cpCount, setCpCount] = useState(4);

  const points = beyblade.pointsOfContact ?? [];

  const generateCP = (count: number) => {
    const step = 360 / count;
    onChange({
      pointsOfContact: Array.from({ length: count }, (_, i) => ({
        angle: Math.round(i * step),
        damageMultiplier: 1.0,
        width: Math.min(45, step * 0.8),
      })),
    });
    setSelectedCP(null);
  };

  const updateCP = (index: number, field: keyof PointOfContact, value: number) => {
    const next = points.map((p, i) => i === index ? { ...p, [field]: value } : p);
    onChange({ pointsOfContact: next });
  };

  const removeCP = (index: number) => {
    onChange({ pointsOfContact: points.filter((_, i) => i !== index) });
    if (selectedCP === index) setSelectedCP(null);
  };

  const resetCPDamage = () => onChange({ pointsOfContact: points.map(p => ({ ...p, damageMultiplier: 1.0 })) });

  const card = (selected: boolean): React.CSSProperties => ({
    background: selected ? alpha(C.blue, 0.13) : C.bg3,
    border: `1px solid ${selected ? C.blue : C.border}`,
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    marginBottom: 6,
  });

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
          Contact Points ({points.length})
        </span>
        <button
          onClick={resetCPDamage}
          disabled={points.length === 0}
          style={{ fontSize: 11, padding: "3px 8px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 5, color: C.muted, cursor: "pointer" }}
        >
          Reset 1.0x
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="number"
          min={1}
          max={20}
          value={cpCount}
          onChange={e => setCpCount(+e.target.value)}
          style={{ width: 60, padding: "4px 8px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13 }}
        />
        <button
          onClick={() => generateCP(cpCount)}
          style={{ padding: "4px 14px", background: C.blue, border: "none", borderRadius: 6, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          Generate evenly
        </button>
        <button
          onClick={() => {
            const angle = Math.round(Math.random() * 360);
            onChange({ pointsOfContact: [...points, { angle, damageMultiplier: 1.0, width: 45 }] });
          }}
          style={{ padding: "4px 14px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 12, cursor: "pointer" }}
        >
          + Add
        </button>
      </div>

      {points.length === 0 && (
        <p style={{ fontSize: 12, color: C.faint, textAlign: "center", padding: "12px 0" }}>
          No contact points. Click "Generate evenly" to add them.
        </p>
      )}

      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {points.map((p, i) => (
          <div key={i} style={card(selectedCP === i)} onClick={() => setSelectedCP(selectedCP === i ? null : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>
                #{i + 1} — {p.angle}° — {p.damageMultiplier.toFixed(2)}x
              </span>
              <button
                onClick={e => { e.stopPropagation(); removeCP(i); }}
                style={{ fontSize: 11, color: C.red, background: "none", border: "none", cursor: "pointer" }}
              >×</button>
            </div>
            {selectedCP === i && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {(["angle", "damageMultiplier", "width"] as const).map(field => {
                  const cfg: Record<string, { min: number; max: number; step: number; label: string }> = {
                    angle:             { min: 0,   max: 360, step: 1,    label: "Angle (°)" },
                    damageMultiplier:  { min: 1,   max: 2,   step: 0.01, label: "Damage Multiplier" },
                    width:             { min: 5,   max: 90,  step: 1,    label: "Width (°)" },
                  };
                  const c = cfg[field];
                  return (
                    <div key={field}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}>
                        <span style={{ color: C.muted }}>{c.label}</span>
                        <span style={{ color: C.text, fontFamily: "monospace" }}>
                          {typeof p[field] === "number"
                            ? (p[field] as number).toFixed(field === "damageMultiplier" ? 2 : 0)
                            : p[field]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={c.min} max={c.max} step={c.step}
                        value={p[field] as number}
                        onChange={e => updateCP(i, field, +e.target.value)}
                        style={{ width: "100%", accentColor: C.blue }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

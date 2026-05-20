import { useState } from "react";
import { C } from "@/styles/theme";
import type { BeybladeStats, PointOfContact, SpinStealPoint } from "@/types/beybladeStats";
import BeybladePreview from "./BeybladePreview";

interface Step3ContactPointsProps {
  beyblade: BeybladeStats;
  onChange: (updated: Partial<BeybladeStats>) => void;
}

export default function Step3ContactPoints({ beyblade, onChange }: Step3ContactPointsProps) {
  const [selectedCP, setSelectedCP] = useState<number | null>(null);
  const [selectedSS, setSelectedSS] = useState<number | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [cpCount, setCpCount] = useState(4);
  const [ssCount, setSsCount] = useState(4);

  const points = beyblade.pointsOfContact ?? [];
  const stealPoints = beyblade.spinStealPoints ?? [];

  // ── Contact points ──────────────────────────────────────────────────────────

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

  const addCPFromCanvas = (angle: number) => {
    onChange({ pointsOfContact: [...points, { angle: Math.round(angle), damageMultiplier: 1.0, width: 45 }] });
    setIsPlacing(false);
  };

  const resetCPDamage = () => onChange({ pointsOfContact: points.map(p => ({ ...p, damageMultiplier: 1.0 })) });

  // ── Spin steal points ───────────────────────────────────────────────────────

  const generateSS = (count: number) => {
    const step = 360 / count;
    const offset = step / 2;
    onChange({
      spinStealPoints: Array.from({ length: count }, (_, i) => ({
        angle: Math.round(i * step + offset),
        spinStealMultiplier: 1.0,
        width: Math.min(45, step * 0.8),
      })),
    });
    setSelectedSS(null);
  };

  const updateSS = (index: number, field: keyof SpinStealPoint, value: number) => {
    const next = stealPoints.map((p, i) => i === index ? { ...p, [field]: value } : p);
    onChange({ spinStealPoints: next });
  };

  const removeSS = (index: number) => {
    onChange({ spinStealPoints: stealPoints.filter((_, i) => i !== index) });
    if (selectedSS === index) setSelectedSS(null);
  };

  // ── Styles ─────────────────────────────────────────────────────────────────

  const card = (selected: boolean): React.CSSProperties => ({
    background: selected ? `${C.blue}22` : C.bg3,
    border: `1px solid ${selected ? C.blue : C.border}`,
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    marginBottom: 6,
  });

  const sliderRow = (label: string, value: number | string): React.CSSProperties => ({
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    marginBottom: 2,
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, alignItems: "start" }}>
      {/* Left: editors */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Contact Points */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
              Contact Points ({points.length})
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={resetCPDamage} disabled={points.length === 0} style={{ fontSize: 11, padding: "3px 8px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 5, color: C.muted, cursor: "pointer" }}>
                Reset 1.0x
              </button>
              <button
                onClick={() => setIsPlacing(v => !v)}
                style={{ fontSize: 11, padding: "3px 8px", background: isPlacing ? C.blue : C.bg3, border: `1px solid ${isPlacing ? C.blue : C.border}`, borderRadius: 5, color: isPlacing ? C.white : C.muted, cursor: "pointer" }}
              >
                {isPlacing ? "Click preview..." : "+ Add via canvas"}
              </button>
            </div>
          </div>

          {/* Generate row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input type="number" min={1} max={20} value={cpCount} onChange={e => setCpCount(+e.target.value)} style={{ width: 60, padding: "4px 8px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13 }} />
            <button onClick={() => generateCP(cpCount)} style={{ padding: "4px 14px", background: C.blue, border: "none", borderRadius: 6, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Generate evenly
            </button>
          </div>

          {points.length === 0 && (
            <p style={{ fontSize: 12, color: C.faint, textAlign: "center", padding: "12px 0" }}>
              No contact points. Click "Generate evenly" or "Add via canvas".
            </p>
          )}

          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {points.map((p, i) => (
              <div key={i} style={card(selectedCP === i)} onClick={() => setSelectedCP(selectedCP === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>
                    #{i + 1} — {p.angle}° — {p.damageMultiplier.toFixed(2)}x
                  </span>
                  <button onClick={e => { e.stopPropagation(); removeCP(i); }} style={{ fontSize: 11, color: C.red, background: "none", border: "none", cursor: "pointer" }}>×</button>
                </div>
                {selectedCP === i && (
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    {(["angle", "damageMultiplier", "width"] as const).map(field => {
                      const cfg: Record<string, { min: number; max: number; step: number; label: string }> = {
                        angle: { min: 0, max: 360, step: 1, label: "Angle (°)" },
                        damageMultiplier: { min: 1, max: 2, step: 0.01, label: "Damage Multiplier" },
                        width: { min: 5, max: 90, step: 1, label: "Width (°)" },
                      };
                      const c = cfg[field];
                      return (
                        <div key={field}>
                          <div style={sliderRow(c.label, p[field] as number)}>
                            <span style={{ color: C.muted }}>{c.label}</span>
                            <span style={{ color: C.text, fontFamily: "monospace" }}>{typeof p[field] === "number" ? (p[field] as number).toFixed(field === "damageMultiplier" ? 2 : 0) : p[field]}</span>
                          </div>
                          <input type="range" min={c.min} max={c.max} step={c.step} value={p[field] as number} onChange={e => updateCP(i, field, +e.target.value)} style={{ width: "100%", accentColor: C.blue }} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Spin Steal Points */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
              Spin Steal Points ({stealPoints.length})
            </span>
            <button onClick={() => onChange({ spinStealPoints: stealPoints.map(p => ({ ...p, spinStealMultiplier: 1.0 })) })} disabled={stealPoints.length === 0} style={{ fontSize: 11, padding: "3px 8px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 5, color: C.muted, cursor: "pointer" }}>
              Reset 1.0x
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input type="number" min={1} max={20} value={ssCount} onChange={e => setSsCount(+e.target.value)} style={{ width: 60, padding: "4px 8px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13 }} />
            <button onClick={() => generateSS(ssCount)} style={{ padding: "4px 14px", background: C.blue, border: "none", borderRadius: 6, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Generate evenly
            </button>
          </div>

          {stealPoints.length === 0 && (
            <p style={{ fontSize: 12, color: C.faint, textAlign: "center", padding: "12px 0" }}>
              No spin steal points yet.
            </p>
          )}

          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {stealPoints.map((p, i) => (
              <div key={i} style={card(selectedSS === i)} onClick={() => setSelectedSS(selectedSS === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>
                    #{i + 1} — {p.angle}° — {p.spinStealMultiplier.toFixed(2)}x
                  </span>
                  <button onClick={e => { e.stopPropagation(); removeSS(i); }} style={{ fontSize: 11, color: C.red, background: "none", border: "none", cursor: "pointer" }}>×</button>
                </div>
                {selectedSS === i && (
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    {(["angle", "spinStealMultiplier", "width"] as const).map(field => {
                      const cfg: Record<string, { min: number; max: number; step: number; label: string }> = {
                        angle: { min: 0, max: 360, step: 1, label: "Angle (°)" },
                        spinStealMultiplier: { min: 1, max: 2, step: 0.01, label: "Spin Steal Multiplier" },
                        width: { min: 5, max: 90, step: 1, label: "Width (°)" },
                      };
                      const c = cfg[field];
                      return (
                        <div key={field}>
                          <div style={sliderRow(c.label, p[field] as number)}>
                            <span style={{ color: C.muted }}>{c.label}</span>
                            <span style={{ color: C.text, fontFamily: "monospace" }}>{typeof p[field] === "number" ? (p[field] as number).toFixed(field === "spinStealMultiplier" ? 2 : 0) : p[field]}</span>
                          </div>
                          <input type="range" min={c.min} max={c.max} step={c.step} value={p[field] as number} onChange={e => updateSS(i, field, +e.target.value)} style={{ width: "100%", accentColor: C.blue }} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: live preview */}
      <div style={{ position: "sticky", top: 80 }}>
        <BeybladePreview
          beyblade={beyblade}
          onCanvasClick={isPlacing ? addCPFromCanvas : undefined}
          clickMode={isPlacing}
        />
        {isPlacing && (
          <p style={{ fontSize: 12, color: C.blue, textAlign: "center", marginTop: 8 }}>
            Click the preview to place a contact point
          </p>
        )}
      </div>
    </div>
  );
}

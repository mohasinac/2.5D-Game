import { useState } from "react";
import { C } from "@/styles/theme";
import type { ArenaConfig, SpeedPathConfig, SpeedPathBreak, ChargePointConfig } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return Math.floor(Date.now() % 1000000); }

const ALL_SHAPES: SpeedPathConfig["shape"][] = [
  "circle", "ring", "oval", "rectangle", "pentagon", "hexagon", "octagon",
  "star", "spiral", "figure_8", "zigzag", "custom_bezier",
];

const DEFAULT: Omit<SpeedPathConfig, "id"> = {
  radius: 10, shape: "circle", speedBoost: 1.5,
  spinBoost: 10, frictionMultiplier: 0.8,
};

const SPEED_FIELDS: { field: keyof SpeedPathConfig; label: string; min: number; max: number; step: number }[] = [
  { field: "radius", label: "Radius (em)", min: 2, max: 22, step: 0.5 },
  { field: "speedBoost", label: "Speed Boost ×", min: 1.1, max: 3.0, step: 0.1 },
  { field: "spinBoost", label: "Spin Boost (/s)", min: 0, max: 50, step: 5 },
  { field: "frictionMultiplier", label: "Friction Mult", min: 0.2, max: 1.5, step: 0.1 },
  { field: "minPathDuration", label: "Min Duration (s)", min: 1, max: 10, step: 0.5 },
  { field: "maxPathDuration", label: "Max Duration (s)", min: 1, max: 30, step: 0.5 },
];

const RENDER_STYLES: SpeedPathConfig["renderStyle"][] = [
  "outline", "filled", "dashed", "dotted", "animated", "broken",
];

function numInput(val: number | undefined, def: number, onChange: (n: number) => void, step = 1, width = 70) {
  return (
    <input type="number" value={val ?? def} step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 11 }}
    />
  );
}

function SectionHeader({ label, open, toggle }: { label: string; open: boolean; toggle: () => void }) {
  return (
    <div onClick={toggle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "5px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>{label}</span>
      <span style={{ color: C.faint, fontSize: 10 }}>{open ? "▲" : "▼"}</span>
    </div>
  );
}

export default function SpeedPathsTab({ config, onChange }: Props) {
  const paths = config.speedPaths ?? [];
  const [openSections, setOpenSections] = useState<Record<string, Record<string, boolean>>>({});

  const toggleSection = (id: string | number | undefined, sec: string) => {
    const key = String(id);
    setOpenSections(prev => ({ ...prev, [key]: { ...prev[key], [sec]: !prev[key]?.[sec] } }));
  };
  const isOpen = (id: string | number | undefined, sec: string) => openSections[String(id)]?.[sec] ?? false;

  const add = () => {
    if (paths.length >= 5) return;
    onChange({ speedPaths: [...paths, { ...DEFAULT, id: makeId() }] });
  };
  const remove = (id: number | undefined) =>
    onChange({ speedPaths: paths.filter(p => p.id !== id) });
  const update = (id: number | undefined, field: keyof SpeedPathConfig, value: any) =>
    onChange({ speedPaths: paths.map(p => p.id === id ? { ...p, [field]: value } : p) });

  // Breaks helpers
  const addBreak = (path: SpeedPathConfig) => {
    const b: SpeedPathBreak = { position: 0.5, length: 0.05 };
    update(path.id, "breaks", [...(path.breaks ?? []), b]);
  };
  const removeBreak = (path: SpeedPathConfig, i: number) =>
    update(path.id, "breaks", (path.breaks ?? []).filter((_, j) => j !== i));
  const patchBreak = (path: SpeedPathConfig, i: number, field: keyof SpeedPathBreak, v: number) => {
    const arr = [...(path.breaks ?? [])];
    arr[i] = { ...arr[i], [field]: v };
    update(path.id, "breaks", arr);
  };

  // Charge point helpers
  const addCP = (path: SpeedPathConfig) => {
    const cp: ChargePointConfig = { pathPosition: 0.5, target: "center", dashSpeed: 2.0, radius: 1, buttonId: 1 };
    update(path.id, "chargePoints", [...(path.chargePoints ?? []), cp]);
  };
  const removeCP = (path: SpeedPathConfig, i: number) =>
    update(path.id, "chargePoints", (path.chargePoints ?? []).filter((_, j) => j !== i));
  const patchCP = (path: SpeedPathConfig, i: number, patch: Partial<ChargePointConfig>) => {
    const arr = [...(path.chargePoints ?? [])];
    arr[i] = { ...arr[i], ...patch };
    update(path.id, "chargePoints", arr);
  };

  // Bezier point helpers
  const addBezierPt = (path: SpeedPathConfig) =>
    update(path.id, "bezierControlPoints", [...(path.bezierControlPoints ?? []), { x: 0, y: 0 }]);
  const removeBezierPt = (path: SpeedPathConfig, i: number) =>
    update(path.id, "bezierControlPoints", (path.bezierControlPoints ?? []).filter((_, j) => j !== i));
  const patchBezierPt = (path: SpeedPathConfig, i: number, axis: "x" | "y", v: number) => {
    const arr = [...(path.bezierControlPoints ?? [])];
    arr[i] = { ...arr[i], [axis]: v };
    update(path.id, "bezierControlPoints", arr);
  };

  // Profile helpers
  const addProfile = (path: SpeedPathConfig, field: "bumpProfile" | "ridgeProfile") =>
    update(path.id, field, [...((path as any)[field] ?? []), { positionFrac: 0.5, heightCm: 1 }]);
  const removeProfile = (path: SpeedPathConfig, field: "bumpProfile" | "ridgeProfile", i: number) =>
    update(path.id, field, ((path as any)[field] ?? []).filter((_: any, j: number) => j !== i));
  const patchProfile = (path: SpeedPathConfig, field: "bumpProfile" | "ridgeProfile", i: number, key: string, v: number) => {
    const arr = [...((path as any)[field] ?? [])];
    arr[i] = { ...arr[i], [key]: v };
    update(path.id, field, arr);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{paths.length} / 5 speed paths</span>
        <button onClick={add} disabled={paths.length >= 5}
          style={{ padding: "5px 14px", background: C.yellow, color: "#000", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: paths.length >= 5 ? 0.4 : 1 }}>
          + Add Path
        </button>
      </div>

      {paths.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <p>No speed paths yet. Speed paths boost beyblades that travel along them.</p>
        </div>
      )}

      {paths.map((path, idx) => (
        <div key={path.id ?? idx} style={{ background: C.bg3, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>⚡ Speed Path #{idx + 1}</span>
            <button onClick={() => remove(path.id)} style={{ color: C.red, background: "none", border: "none", fontSize: 12, cursor: "pointer" }}>Remove</button>
          </div>

          {/* Shape selector */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 6 }}>Path Shape</label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {ALL_SHAPES.map(s => (
                <button key={s} onClick={() => update(path.id, "shape", s)}
                  style={{ padding: "3px 8px", borderRadius: 5, fontSize: 11, cursor: "pointer",
                    background: path.shape === s ? C.yellow : C.bg2,
                    color: path.shape === s ? "#000" : C.muted,
                    border: `1px solid ${path.shape === s ? C.yellow : C.border}` }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Shape-specific params */}
          {path.shape === "spiral" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Turns</label>
                {numInput(path.spiralTurns, 2, v => update(path.id, "spiralTurns", v), 0.5)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Inner Radius (em)</label>
                {numInput(path.spiralInnerRadius, 3, v => update(path.id, "spiralInnerRadius", v), 0.5)}
              </div>
            </div>
          )}
          {path.shape === "figure_8" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Lobe Width (em)</label>
              {numInput(path.figure8LobeWidth, 5, v => update(path.id, "figure8LobeWidth", v), 0.5)}
            </div>
          )}
          {path.shape === "custom_bezier" && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <label style={{ fontSize: 11, color: C.faint }}>Bezier Control Points (em)</label>
                <button onClick={() => addBezierPt(path)} style={{ fontSize: 10, padding: "1px 6px", background: C.yellow, color: "#000", border: "none", borderRadius: 4, cursor: "pointer" }}>+ Point</button>
              </div>
              {(path.bezierControlPoints ?? []).map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                  <label style={{ fontSize: 10, color: C.faint, minWidth: 10 }}>X</label>
                  {numInput(pt.x, 0, v => patchBezierPt(path, i, "x", v), 0.5, 60)}
                  <label style={{ fontSize: 10, color: C.faint, minWidth: 10 }}>Y</label>
                  {numInput(pt.y, 0, v => patchBezierPt(path, i, "y", v), 0.5, 60)}
                  <button onClick={() => removeBezierPt(path, i)} style={{ color: C.red, background: "none", border: "none", fontSize: 11, cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Common sliders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {SPEED_FIELDS.map(({ field, label, min, max, step }) => (
              <div key={field}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                  <span>{label}</span>
                  <span style={{ color: C.text, fontFamily: "monospace" }}>{(path as any)[field] ?? min}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={(path as any)[field] ?? min}
                  onChange={e => update(path.id, field, +e.target.value)}
                  style={{ width: "100%", accentColor: C.yellow }}
                />
              </div>
            ))}
          </div>

          {/* Render style */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Render Style</label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {RENDER_STYLES.map(rs => (
                <button key={rs} onClick={() => update(path.id, "renderStyle", rs)}
                  style={{ padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer",
                    background: (path.renderStyle ?? "outline") === rs ? C.yellow : "transparent",
                    color: (path.renderStyle ?? "outline") === rs ? "#000" : C.muted,
                    border: `1px solid ${(path.renderStyle ?? "outline") === rs ? C.yellow : C.border}` }}>
                  {rs}
                </button>
              ))}
            </div>
          </div>

          {/* Breaks section */}
          <div style={{ background: C.bg2, borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <SectionHeader label={`Path Breaks (${path.breaks?.length ?? 0})`} open={isOpen(path.id, "breaks")} toggle={() => toggleSection(path.id, "breaks")} />
            {isOpen(path.id, "breaks") && (
              <>
                <button onClick={() => addBreak(path)} style={{ fontSize: 10, padding: "2px 8px", background: C.yellow, color: "#000", border: "none", borderRadius: 4, cursor: "pointer", marginBottom: 6 }}>+ Break</button>
                {(path.breaks ?? []).map((br, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                    <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Position (0–1)</label>
                    {numInput(br.position, 0.5, v => patchBreak(path, i, "position", Math.min(1, Math.max(0, v))), 0.01)}
                    <label style={{ fontSize: 11, color: C.faint, minWidth: 48 }}>Length (0–0.5)</label>
                    {numInput(br.length, 0.05, v => patchBreak(path, i, "length", Math.min(0.5, Math.max(0, v))), 0.01)}
                    <button onClick={() => removeBreak(path, i)} style={{ color: C.red, background: "none", border: "none", fontSize: 11, cursor: "pointer" }}>✕</button>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Charge Points section */}
          <div style={{ background: C.bg2, borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <SectionHeader label="Charge Points" open={isOpen(path.id, "cps")} toggle={() => toggleSection(path.id, "cps")} />
            {isOpen(path.id, "cps") && (
              <>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <label style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 11, color: C.muted, cursor: "pointer" }}>
                    <input type="checkbox" checked={path.autoPlaceChargePoints ?? false}
                      onChange={e => update(path.id, "autoPlaceChargePoints", e.target.checked)} />
                    Auto-Place
                  </label>
                  {path.autoPlaceChargePoints && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 11, color: C.faint }}>Count (1–3)</label>
                      {numInput(path.chargePointCount, 3, v => update(path.id, "chargePointCount", Math.min(3, Math.max(1, Math.round(v)))), 1, 50)}
                    </div>
                  )}
                </div>
                {!path.autoPlaceChargePoints && (
                  <>
                    <button onClick={() => addCP(path)} style={{ fontSize: 10, padding: "2px 8px", background: C.yellow, color: "#000", border: "none", borderRadius: 4, cursor: "pointer", marginBottom: 6 }}>+ Charge Point</button>
                    {(path.chargePoints ?? []).map((cp, i) => (
                      <div key={i} style={{ background: C.bg1, borderRadius: 6, padding: 8, marginBottom: 6 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 4 }}>
                          <div>
                            <label style={{ display: "block", fontSize: 10, color: C.faint, marginBottom: 2 }}>Position (0–100%)</label>
                            {numInput(cp.pathPosition, 50, v => patchCP(path, i, { pathPosition: Math.min(100, Math.max(0, v)) }), 1)}
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 10, color: C.faint, marginBottom: 2 }}>Dash Speed ×</label>
                            {numInput(cp.dashSpeed, 2, v => patchCP(path, i, { dashSpeed: v }), 0.1)}
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 10, color: C.faint, marginBottom: 2 }}>Button (1–3)</label>
                            {numInput(cp.buttonId, 1, v => patchCP(path, i, { buttonId: Math.min(3, Math.max(1, Math.round(v))) as 1|2|3 }), 1, 50)}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <label style={{ fontSize: 10, color: C.faint }}>Target</label>
                          {(["center", "opponent"] as const).map(t => (
                            <button key={t} onClick={() => patchCP(path, i, { target: t })}
                              style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, cursor: "pointer",
                                background: cp.target === t ? C.yellow : "transparent",
                                color: cp.target === t ? "#000" : C.muted,
                                border: `1px solid ${cp.target === t ? C.yellow : C.border}` }}>
                              {t}
                            </button>
                          ))}
                          <button onClick={() => removeCP(path, i)} style={{ marginLeft: "auto", color: C.red, background: "none", border: "none", fontSize: 10, cursor: "pointer" }}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* Direction Arrows section */}
          <div style={{ background: C.bg2, borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <SectionHeader label="Direction Arrows" open={isOpen(path.id, "arrows")} toggle={() => toggleSection(path.id, "arrows")} />
            {isOpen(path.id, "arrows") && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: C.muted, cursor: "pointer" }}>
                  <input type="checkbox" checked={path.showDirectionArrows ?? false}
                    onChange={e => update(path.id, "showDirectionArrows", e.target.checked)} />
                  Show Direction Arrows
                </label>
                {path.showDirectionArrows && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Speed (cm/s)</label>
                      {numInput(path.arrowSpeedCmPerSec, 20, v => update(path.id, "arrowSpeedCmPerSec", v), 1)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Spacing (cm)</label>
                      {numInput(path.arrowSpacingCm, 5, v => update(path.id, "arrowSpacingCm", v), 0.5)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 11, color: C.faint, minWidth: 40 }}>Color</label>
                      <input type="color" value={path.arrowColor ?? "#ffcc00"}
                        onChange={e => update(path.id, "arrowColor", e.target.value)}
                        style={{ width: 40, height: 26, cursor: "pointer", border: `1px solid ${C.border}`, borderRadius: 4 }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bump/Ridge profiles */}
          <div style={{ background: C.bg2, borderRadius: 8, padding: 10 }}>
            <SectionHeader label="Bump / Ridge Profiles (Advanced)" open={isOpen(path.id, "profiles")} toggle={() => toggleSection(path.id, "profiles")} />
            {isOpen(path.id, "profiles") && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {(["bumpProfile", "ridgeProfile"] as const).map(field => (
                  <div key={field}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <label style={{ fontSize: 11, color: C.faint }}>{field === "bumpProfile" ? "Bump Profile" : "Ridge Profile"}</label>
                      <button onClick={() => addProfile(path, field)} style={{ fontSize: 10, padding: "1px 6px", background: C.yellow, color: "#000", border: "none", borderRadius: 4, cursor: "pointer" }}>+ Entry</button>
                    </div>
                    {((path as any)[field] ?? []).map((entry: any, i: number) => (
                      <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                        <label style={{ fontSize: 10, color: C.faint, minWidth: 40 }}>Pos</label>
                        {numInput(entry.positionFrac, 0.5, v => patchProfile(path, field, i, "positionFrac", Math.min(1, Math.max(0, v))), 0.01, 55)}
                        <label style={{ fontSize: 10, color: C.faint, minWidth: 40 }}>H (cm)</label>
                        {numInput(entry.heightCm, 1, v => patchProfile(path, field, i, "heightCm", v), 0.1, 55)}
                        <button onClick={() => removeProfile(path, field, i)} style={{ color: C.red, background: "none", border: "none", fontSize: 11, cursor: "pointer" }}>✕</button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

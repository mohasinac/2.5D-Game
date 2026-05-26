import { useState } from "react";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
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
      className="bg-bg1 border border-border text-text rounded-md py-[3px] px-1.5 text-[11px]"
      style={{ width }}
    />
  );
}

function SectionHeader({ label, open, toggle }: { label: string; open: boolean; toggle: () => void }) {
  return (
    <div onClick={toggle} className="flex justify-between items-center cursor-pointer py-[5px] border-b border-border mb-1.5">
      <span className="text-[11px] font-semibold text-muted">{label}</span>
      <span className="text-faint text-[10px]">{open ? "▲" : "▼"}</span>
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
    <CollapsibleSection title="Speed Paths" badge={paths.length} storageKey="arena-speedpaths-list" defaultOpen={true}>
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-muted">{paths.length} / 5 speed paths</span>
        <button onClick={add} disabled={paths.length >= 5}
          className={`py-[5px] px-[14px] bg-yellow text-bg0 border-none rounded-md text-xs font-medium cursor-pointer ${paths.length >= 5 ? "opacity-40" : ""}`}>
          + Add Path
        </button>
      </div>

      {paths.length === 0 && (
        <div className="text-center py-10 text-faint">
          <div className="text-[32px] mb-2">⚡</div>
          <p>No speed paths yet. Speed paths boost beyblades that travel along them.</p>
        </div>
      )}

      {paths.map((path, idx) => (
        <div key={path.id ?? idx} className="bg-bg3 rounded-xl p-4 border border-border">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] font-medium text-text">⚡ Speed Path #{idx + 1}</span>
            <button onClick={() => remove(path.id)} className="text-red bg-transparent border-none text-xs cursor-pointer">Remove</button>
          </div>

          {/* Shape selector */}
          <div className="mb-3">
            <label className="block text-[11px] text-faint mb-1.5">Path Shape</label>
            <div className="flex gap-1 flex-wrap">
              {ALL_SHAPES.map(s => (
                <button key={s} onClick={() => update(path.id, "shape", s)}
                  className={`py-[3px] px-2 rounded text-[11px] cursor-pointer border ${path.shape === s ? "bg-[var(--yellow)] text-black border-[var(--yellow)]" : "bg-bg2 text-theme-muted border-border-c"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Shape-specific params */}
          {path.shape === "spiral" && (
            <div className="grid grid-cols-2 gap-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] text-faint min-w-[70px]">Turns</label>
                {numInput(path.spiralTurns, 2, v => update(path.id, "spiralTurns", v), 0.5)}
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] text-faint min-w-[70px]">Inner Radius (em)</label>
                {numInput(path.spiralInnerRadius, 3, v => update(path.id, "spiralInnerRadius", v), 0.5)}
              </div>
            </div>
          )}
          {path.shape === "figure_8" && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <label className="text-[11px] text-faint min-w-[90px]">Lobe Width (em)</label>
              {numInput(path.figure8LobeWidth, 5, v => update(path.id, "figure8LobeWidth", v), 0.5)}
            </div>
          )}
          {path.shape === "custom_bezier" && (
            <div className="mb-2.5">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] text-faint">Bezier Control Points (em)</label>
                <button onClick={() => addBezierPt(path)}
                  className="text-[10px] py-[1px] px-1.5 bg-yellow text-bg0 border-none rounded cursor-pointer">+ Point</button>
              </div>
              {(path.bezierControlPoints ?? []).map((pt, i) => (
                <div key={i} className="flex gap-1.5 items-center mb-1">
                  <label className="text-[10px] text-faint min-w-[10px]">X</label>
                  {numInput(pt.x, 0, v => patchBezierPt(path, i, "x", v), 0.5, 60)}
                  <label className="text-[10px] text-faint min-w-[10px]">Y</label>
                  {numInput(pt.y, 0, v => patchBezierPt(path, i, "y", v), 0.5, 60)}
                  <button onClick={() => removeBezierPt(path, i)} className="text-red bg-transparent border-none text-[11px] cursor-pointer">✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Common sliders */}
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            {SPEED_FIELDS.map(({ field, label, min, max, step }) => (
              <div key={field}>
                <div className="flex justify-between text-[11px] text-faint mb-0.5">
                  <span>{label}</span>
                  <span className="text-text font-mono">{(path as any)[field] ?? min}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={(path as any)[field] ?? min}
                  onChange={e => update(path.id, field, +e.target.value)}
                  className="w-full accent-[var(--yellow)]"
                />
              </div>
            ))}
          </div>

          {/* Render style */}
          <div className="mb-2.5">
            <label className="block text-[11px] text-faint mb-1">Render Style</label>
            <div className="flex gap-1 flex-wrap">
              {RENDER_STYLES.map(rs => (
                <button key={rs} onClick={() => update(path.id, "renderStyle", rs)}
                  className={`py-[2px] px-[7px] rounded text-[10px] cursor-pointer border ${(path.renderStyle ?? "outline") === rs ? "bg-[var(--yellow)] text-black border-[var(--yellow)]" : "bg-transparent text-theme-muted border-border-c"}`}>
                  {rs}
                </button>
              ))}
            </div>
          </div>

          {/* Breaks section */}
          <div className="bg-bg2 rounded-lg p-2.5 mb-2">
            <SectionHeader label={`Path Breaks (${path.breaks?.length ?? 0})`} open={isOpen(path.id, "breaks")} toggle={() => toggleSection(path.id, "breaks")} />
            {isOpen(path.id, "breaks") && (
              <>
                <button onClick={() => addBreak(path)}
                  className="text-[10px] py-[2px] px-2 bg-yellow text-bg0 border-none rounded cursor-pointer mb-1.5">+ Break</button>
                {(path.breaks ?? []).map((br, i) => (
                  <div key={i} className="flex gap-2.5 items-center mb-1">
                    <label className="text-[11px] text-faint min-w-[55px]">Position (0–1)</label>
                    {numInput(br.position, 0.5, v => patchBreak(path, i, "position", Math.min(1, Math.max(0, v))), 0.01)}
                    <label className="text-[11px] text-faint min-w-[48px]">Length (0–0.5)</label>
                    {numInput(br.length, 0.05, v => patchBreak(path, i, "length", Math.min(0.5, Math.max(0, v))), 0.01)}
                    <button onClick={() => removeBreak(path, i)} className="text-red bg-transparent border-none text-[11px] cursor-pointer">✕</button>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Charge Points section */}
          <div className="bg-bg2 rounded-lg p-2.5 mb-2">
            <SectionHeader label="Charge Points" open={isOpen(path.id, "cps")} toggle={() => toggleSection(path.id, "cps")} />
            {isOpen(path.id, "cps") && (
              <>
                <div className="flex gap-2 items-center mb-2">
                  <label className="flex gap-[5px] items-center text-[11px] text-muted cursor-pointer">
                    <input type="checkbox" checked={path.autoPlaceChargePoints ?? false}
                      onChange={e => update(path.id, "autoPlaceChargePoints", e.target.checked)} />
                    Auto-Place
                  </label>
                  {path.autoPlaceChargePoints && (
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-faint">Count (1–3)</label>
                      {numInput(path.chargePointCount, 3, v => update(path.id, "chargePointCount", Math.min(3, Math.max(1, Math.round(v)))), 1, 50)}
                    </div>
                  )}
                </div>
                {!path.autoPlaceChargePoints && (
                  <>
                    <button onClick={() => addCP(path)}
                      className="text-[10px] py-[2px] px-2 bg-yellow text-bg0 border-none rounded cursor-pointer mb-1.5">+ Charge Point</button>
                    {(path.chargePoints ?? []).map((cp, i) => (
                      <div key={i} className="bg-bg1 rounded-md p-2 mb-1.5">
                        <div className="grid grid-cols-3 gap-1.5 mb-1">
                          <div>
                            <label className="block text-[10px] text-faint mb-0.5">Position (0–100%)</label>
                            {numInput(cp.pathPosition, 50, v => patchCP(path, i, { pathPosition: Math.min(100, Math.max(0, v)) }), 1)}
                          </div>
                          <div>
                            <label className="block text-[10px] text-faint mb-0.5">Dash Speed ×</label>
                            {numInput(cp.dashSpeed, 2, v => patchCP(path, i, { dashSpeed: v }), 0.1)}
                          </div>
                          <div>
                            <label className="block text-[10px] text-faint mb-0.5">Button (1–3)</label>
                            {numInput(cp.buttonId, 1, v => patchCP(path, i, { buttonId: Math.min(3, Math.max(1, Math.round(v))) as 1|2|3 }), 1, 50)}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <label className="text-[10px] text-faint">Target</label>
                          {(["center", "opponent"] as const).map(t => (
                            <button key={t} onClick={() => patchCP(path, i, { target: t })}
                              className={`py-[1px] px-1.5 rounded text-[10px] cursor-pointer border ${cp.target === t ? "bg-[var(--yellow)] text-black border-[var(--yellow)]" : "bg-transparent text-theme-muted border-border-c"}`}>
                              {t}
                            </button>
                          ))}
                          <button onClick={() => removeCP(path, i)} className="ml-auto text-red bg-transparent border-none text-[10px] cursor-pointer">Remove</button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* Direction Arrows section */}
          <div className="bg-bg2 rounded-lg p-2.5 mb-2">
            <SectionHeader label="Direction Arrows" open={isOpen(path.id, "arrows")} toggle={() => toggleSection(path.id, "arrows")} />
            {isOpen(path.id, "arrows") && (
              <div className="flex flex-col gap-2">
                <label className="flex gap-1.5 items-center text-[11px] text-muted cursor-pointer">
                  <input type="checkbox" checked={path.showDirectionArrows ?? false}
                    onChange={e => update(path.id, "showDirectionArrows", e.target.checked)} />
                  Show Direction Arrows
                </label>
                {path.showDirectionArrows && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-faint min-w-[70px]">Speed (cm/s)</label>
                      {numInput(path.arrowSpeedCmPerSec, 20, v => update(path.id, "arrowSpeedCmPerSec", v), 1)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-faint min-w-[60px]">Spacing (cm)</label>
                      {numInput(path.arrowSpacingCm, 5, v => update(path.id, "arrowSpacingCm", v), 0.5)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-faint min-w-[40px]">Color</label>
                      <input type="color" value={path.arrowColor ?? "#ffcc00"}
                        onChange={e => update(path.id, "arrowColor", e.target.value)}
                        className="w-10 h-[26px] cursor-pointer border border-border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bump/Ridge profiles */}
          <div className="bg-bg2 rounded-lg p-2.5">
            <SectionHeader label="Bump / Ridge Profiles (Advanced)" open={isOpen(path.id, "profiles")} toggle={() => toggleSection(path.id, "profiles")} />
            {isOpen(path.id, "profiles") && (
              <div className="grid grid-cols-2 gap-3">
                {(["bumpProfile", "ridgeProfile"] as const).map(field => (
                  <div key={field}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] text-faint">{field === "bumpProfile" ? "Bump Profile" : "Ridge Profile"}</label>
                      <button onClick={() => addProfile(path, field)}
                        className="text-[10px] py-[1px] px-1.5 bg-yellow text-bg0 border-none rounded cursor-pointer">+ Entry</button>
                    </div>
                    {((path as any)[field] ?? []).map((entry: any, i: number) => (
                      <div key={i} className="flex gap-1.5 items-center mb-1">
                        <label className="text-[10px] text-faint min-w-[40px]">Pos</label>
                        {numInput(entry.positionFrac, 0.5, v => patchProfile(path, field, i, "positionFrac", Math.min(1, Math.max(0, v))), 0.01, 55)}
                        <label className="text-[10px] text-faint min-w-[40px]">H (cm)</label>
                        {numInput(entry.heightCm, 1, v => patchProfile(path, field, i, "heightCm", v), 0.1, 55)}
                        <button onClick={() => removeProfile(path, field, i)} className="text-red bg-transparent border-none text-[11px] cursor-pointer">✕</button>
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
    </CollapsibleSection>
  );
}

import { C } from "@/styles/theme";
import type { ArenaConfig, SpeedPathConfig } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return Math.floor(Date.now() % 1000000); }

const PATH_SHAPES: SpeedPathConfig["shape"][] = [
  "circle", "ring", "oval", "rectangle", "pentagon", "hexagon", "octagon",
];

const DEFAULT: Omit<SpeedPathConfig, "id"> = {
  radius: 10, shape: "circle", speedBoost: 1.5,
  spinBoost: 10, frictionMultiplier: 0.8,
};

const SPEED_FIELDS: { field: keyof SpeedPathConfig; label: string; min: number; max: number; step: number }[] = [
  { field: "radius", label: "Radius from center (em)", min: 2, max: 22, step: 0.5 },
  { field: "speedBoost", label: "Speed Boost multiplier", min: 1.1, max: 3.0, step: 0.1 },
  { field: "spinBoost", label: "Spin Boost (/s)", min: 0, max: 50, step: 5 },
  { field: "frictionMultiplier", label: "Friction (< 1 = less)", min: 0.2, max: 1.5, step: 0.1 },
];

export default function SpeedPathsTab({ config, onChange }: Props) {
  const paths = config.speedPaths ?? [];

  const add = () => {
    if (paths.length >= 5) return;
    onChange({ speedPaths: [...paths, { ...DEFAULT, id: makeId() }] });
  };

  const remove = (id: number | undefined) =>
    onChange({ speedPaths: paths.filter(p => p.id !== id) });

  const update = (id: number | undefined, field: keyof SpeedPathConfig, value: any) =>
    onChange({ speedPaths: paths.map(p => p.id === id ? { ...p, [field]: value } : p) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{paths.length} / 5 speed paths</span>
        <button onClick={add} disabled={paths.length >= 5} style={{ padding: "5px 14px", background: C.yellow, color: "#000", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: paths.length >= 5 ? 0.4 : 1 }}>
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
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PATH_SHAPES.map(s => (
                <button
                  key={s}
                  onClick={() => update(path.id, "shape", s)}
                  style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", textTransform: "capitalize",
                    background: path.shape === s ? C.yellow : C.bg2,
                    color: path.shape === s ? "#000" : C.muted,
                    border: `1px solid ${path.shape === s ? C.yellow : C.border}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            {(["outline", "filled"] as const).map(rs => (
              <button
                key={rs}
                onClick={() => update(path.id, "renderStyle", rs)}
                style={{
                  padding: "3px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer", textTransform: "capitalize",
                  background: (path.renderStyle ?? "outline") === rs ? C.yellow : "transparent",
                  color: (path.renderStyle ?? "outline") === rs ? "#000" : C.muted,
                  border: `1px solid ${(path.renderStyle ?? "outline") === rs ? C.yellow : C.border}`,
                }}
              >
                {rs}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

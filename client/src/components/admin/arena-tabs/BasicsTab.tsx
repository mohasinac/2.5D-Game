import { C, S } from "@/styles/theme";
import type { ArenaConfig, ArenaShape, ArenaTheme } from "@/types/arenaConfigNew";
import { ARENA_PRESETS, initializeWallConfig } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

const SHAPES: { value: ArenaShape; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "triangle", label: "Triangle" },
  { value: "pentagon", label: "Pentagon" },
  { value: "hexagon", label: "Hexagon" },
  { value: "heptagon", label: "Heptagon" },
  { value: "octagon", label: "Octagon" },
  { value: "star3", label: "Star 3" },
  { value: "star4", label: "Star 4" },
  { value: "star5", label: "Star 5" },
  { value: "star6", label: "Star 6" },
];

const THEMES: { value: ArenaTheme; label: string; color: string }[] = [
  { value: "metrocity", label: "Metro City", color: "#3b82f6" },
  { value: "forest", label: "Forest", color: "#10b981" },
  { value: "safari", label: "Safari", color: "#f97316" },
  { value: "mountains", label: "Mountains", color: "#06b6d4" },
  { value: "prehistoric", label: "Prehistoric", color: "#ef4444" },
  { value: "futuristic", label: "Futuristic", color: "#8b5cf6" },
  { value: "desert", label: "Desert", color: "#f59e0b" },
  { value: "sea", label: "Sea", color: "#0ea5e9" },
  { value: "grasslands", label: "Grasslands", color: "#84cc16" },
  { value: "riverbank", label: "Riverbank", color: "#64748b" },
];

export default function BasicsTab({ config, onChange }: Props) {
  const handleShapeChange = (shape: ArenaShape) => {
    onChange({ shape, wall: initializeWallConfig(shape) });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Name */}
      <div>
        <label style={S.label}>Arena Name</label>
        <input
          type="text"
          value={config.name ?? ""}
          onChange={e => onChange({ name: e.target.value })}
          style={S.input}
          placeholder="e.g. Classic Stadium"
        />
      </div>

      {/* Presets */}
      <div>
        <label style={S.label}>Load Preset</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(ARENA_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onChange(preset)}
              style={{ padding: "5px 12px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.muted, cursor: "pointer" }}
            >
              {preset.name ?? key}
            </button>
          ))}
        </div>
      </div>

      {/* Shape */}
      <div>
        <label style={S.label}>Shape</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
          {SHAPES.map(s => (
            <button
              key={s.value}
              onClick={() => handleShapeChange(s.value)}
              style={{
                padding: "8px 6px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                background: config.shape === s.value ? C.purple : C.bg3,
                color: config.shape === s.value ? C.white : C.muted,
                border: `1px solid ${config.shape === s.value ? C.purple : C.border}`,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <label style={S.label}>Theme</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
          {THEMES.map(t => (
            <button
              key={t.value}
              onClick={() => onChange({ theme: t.value })}
              style={{
                padding: "8px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                background: config.theme === t.value ? `${t.color}22` : C.bg3,
                color: config.theme === t.value ? t.color : C.muted,
                border: `1px solid ${config.theme === t.value ? t.color : C.border}`,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div style={{ background: C.bg3, borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Auto-Rotate</span>
          <button
            onClick={() => onChange({ autoRotate: !config.autoRotate })}
            style={{
              padding: "4px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12,
              background: config.autoRotate ? C.green : C.bg2,
              color: config.autoRotate ? C.white : C.muted,
            }}
          >
            {config.autoRotate ? "ON" : "OFF"}
          </button>
        </div>
        {config.autoRotate && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 4 }}>
                <span>Speed (°/s)</span>
                <span style={{ color: C.text, fontFamily: "monospace" }}>{config.rotationSpeed ?? 6}°/s</span>
              </div>
              <input
                type="range" min={1} max={60} step={1}
                value={config.rotationSpeed ?? 6}
                onChange={e => onChange({ rotationSpeed: +e.target.value })}
                style={{ width: "100%", accentColor: C.purple }}
              />
            </div>
            <div>
              <label style={S.label}>Direction</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["clockwise", "counterclockwise"] as const).map(dir => (
                  <button
                    key={dir}
                    onClick={() => onChange({ rotationDirection: dir })}
                    style={{
                      flex: 1, padding: "6px", borderRadius: 6, fontSize: 12, cursor: "pointer", textTransform: "capitalize",
                      background: config.rotationDirection === dir ? C.purple : "transparent",
                      color: config.rotationDirection === dir ? C.white : C.muted,
                      border: `1px solid ${config.rotationDirection === dir ? C.purple : C.border}`,
                    }}
                  >
                    {dir === "clockwise" ? "↻ Clockwise" : "↺ Counter"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

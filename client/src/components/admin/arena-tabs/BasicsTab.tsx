import { C, S } from "@/styles/theme";
import type { ArenaConfig, ArenaShape, ArenaTheme, BowlProfile } from "@/types/arenaConfigNew";
import { ARENA_PRESETS, initializeWallConfig, BOWL_PROFILE_ANGLES, BOWL_PROFILE_LABELS } from "@/types/arenaConfigNew";
import { PX_PER_CM_BASE } from "@/constants/units";

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

// ─── Cross-section SVG preview ────────────────────────────────────────────────
// Renders a 2D side-view of the arena bowl based on wallAngle.
// Width = 160px; origin is at the center top. Left and right walls mirror each other.
function BowlCrossSection({ wallAngle = 0, bowlDepth = 0.4 }: { wallAngle?: number; bowlDepth?: number }) {
  const W = 160;
  const H = 80;
  const halfW = W / 2;
  const angleRad = (wallAngle * Math.PI) / 180;
  // How far the wall foot moves inward as angle increases
  const inset = Math.sin(angleRad) * H * bowlDepth;
  const wallH = Math.cos(angleRad) * H * bowlDepth;

  // Wall polygons (left and right), floor line
  const leftWallTop  = `${0},${0}`;
  const leftWallBot  = `${inset},${wallH}`;
  const floorLeft    = `${inset},${wallH}`;
  const floorRight   = `${W - inset},${wallH}`;
  const rightWallBot = `${W - inset},${wallH}`;
  const rightWallTop = `${W},${0}`;

  // SVG outline: top rim → left wall → floor → right wall → top rim
  const outline = [leftWallTop, leftWallBot, floorLeft, floorRight, rightWallBot, rightWallTop].join(" ");

  return (
    <svg width={W} height={H + 8} viewBox={`0 0 ${W} ${H + 8}`} style={{ display: "block" }}>
      {/* Shadow fill */}
      <polygon points={`${outline} ${W},0 0,0`} fill="#0f172a" />
      {/* Bowl inner surface */}
      <polyline points={`${leftWallTop} ${leftWallBot} ${floorLeft} ${floorRight} ${rightWallBot} ${rightWallTop}`}
        fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinejoin="round" />
      {/* Floor line */}
      <line x1={inset} y1={wallH} x2={W - inset} y2={wallH} stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="4 3" />
      {/* Angle arc indicator */}
      {wallAngle > 0 && (
        <path
          d={`M ${0} ${0} A 24 24 0 0 1 ${Math.sin(angleRad) * 24} ${Math.cos(angleRad) * 24}`}
          fill="none" stroke="#f59e0b" strokeWidth={1.5}
        />
      )}
      {/* Angle label */}
      <text x={halfW} y={H + 6} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="monospace">
        {wallAngle}° wall angle
      </text>
    </svg>
  );
}

const BOWL_PROFILES: BowlProfile[] = ["flat", "shallow", "medium", "deep", "steep"];

// ─────────────────────────────────────────────────────────────────────────────

export default function BasicsTab({ config, onChange }: Props) {
  const handleShapeChange = (shape: ArenaShape) => {
    onChange({ shape, wall: initializeWallConfig(shape) });
  };

  const effectiveWallAngle =
    config.wallAngle !== undefined
      ? config.wallAngle
      : BOWL_PROFILE_ANGLES[config.bowlProfile ?? "medium"];

  const handleBowlProfileClick = (profile: BowlProfile) => {
    onChange({ bowlProfile: profile, wallAngle: undefined });
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

      {/* Size */}
      <div>
        <label style={S.label}>Size (cm) — Width × Height</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number" min={20} max={100} step={1}
            value={config.width ? Math.round(config.width / PX_PER_CM_BASE) : 50}
            onChange={e => onChange({ width: Math.round(parseFloat(e.target.value) || 50) * PX_PER_CM_BASE })}
            style={{ ...S.input, width: 80, textAlign: "right" as const }}
          />
          <span style={{ color: C.faint, fontSize: 12 }}>×</span>
          <input
            type="number" min={20} max={100} step={1}
            value={config.height ? Math.round(config.height / PX_PER_CM_BASE) : 50}
            onChange={e => onChange({ height: Math.round(parseFloat(e.target.value) || 50) * PX_PER_CM_BASE })}
            style={{ ...S.input, width: 80, textAlign: "right" as const }}
          />
          <span style={{ color: C.faint, fontSize: 12 }}>cm</span>
        </div>
        <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>
          {config.width && config.height
            ? `${config.width} × ${config.height} px stored — displayed as ${Math.round(config.width / PX_PER_CM_BASE)} × ${Math.round(config.height / PX_PER_CM_BASE)} cm`
            : "Default: 50 × 50 cm (1200 × 1200 px)"}
        </div>
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

      {/* Bowl / Cross-Section */}
      <div style={{ background: C.bg3, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
          Bowl Profile <span style={{ fontSize: 11, color: C.faint, fontWeight: 400 }}>— cross-section curvature</span>
        </div>

        {/* Profile presets */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {BOWL_PROFILES.map(profile => {
            const active = (config.bowlProfile ?? "medium") === profile && config.wallAngle === undefined;
            return (
              <button
                key={profile}
                onClick={() => handleBowlProfileClick(profile)}
                style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer",
                  textTransform: "capitalize",
                  background: active ? C.blue : "transparent",
                  color: active ? C.white : C.muted,
                  border: `1px solid ${active ? C.blue : C.border}`,
                }}
              >
                {profile}
              </button>
            );
          })}
        </div>

        {/* Custom angle slider */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 4 }}>
            <span>Wall Angle (custom)</span>
            <span style={{ color: C.text, fontFamily: "monospace" }}>{effectiveWallAngle}°</span>
          </div>
          <input
            type="range" min={0} max={75} step={1}
            value={effectiveWallAngle}
            onChange={e => onChange({ wallAngle: +e.target.value, bowlProfile: undefined })}
            style={{ width: "100%", accentColor: C.blue }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.faint, marginTop: 2 }}>
            <span>0° — flat / vertical</span>
            <span>75° — cup shape</span>
          </div>
        </div>

        {/* Bowl depth */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 4 }}>
            <span>Bowl Depth</span>
            <span style={{ color: C.text, fontFamily: "monospace" }}>{Math.round((config.bowlDepth ?? 0.4) * 100)}%</span>
          </div>
          <input
            type="range" min={0} max={100} step={5}
            value={Math.round((config.bowlDepth ?? 0.4) * 100)}
            onChange={e => onChange({ bowlDepth: +e.target.value / 100 })}
            style={{ width: "100%", accentColor: C.blue }}
          />
        </div>

        {/* Cross-section preview */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: C.faint }}>Cross-section preview</span>
          <div style={{ background: "#0f172a", borderRadius: 8, padding: "10px 16px", border: `1px solid ${C.border}` }}>
            <BowlCrossSection wallAngle={effectiveWallAngle} bowlDepth={config.bowlDepth ?? 0.4} />
          </div>
          <span style={{ fontSize: 10, color: C.faint, textAlign: "center" }}>
            {config.wallAngle !== undefined
              ? `Custom angle: ${config.wallAngle}°`
              : BOWL_PROFILE_LABELS[config.bowlProfile ?? "medium"]}
          </span>
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

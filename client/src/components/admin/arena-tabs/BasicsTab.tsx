const LBL = "block text-xs text-theme-muted mb-1.5";
const INP = "w-full bg-bg3 border border-border-c rounded-lg px-3 py-2 text-theme-text text-sm";
import { useRef, useState } from "react";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig, ArenaShape, ArenaTheme, BowlProfile } from "@/types/arenaConfigNew";
import { ARENA_PRESETS, initializeWallConfig, BOWL_PROFILE_ANGLES, BOWL_PROFILE_LABELS } from "@/types/arenaConfigNew";
import { PX_PER_CM_BASE } from "@/constants/units";
import { useArenaShapeDefs } from "@/hooks/useArenaShapeDefs";
import { useArenaThemeDefs } from "@/hooks/useArenaThemeDefs";
import { useBowlProfileDefs } from "@/hooks/useBowlProfileDefs";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

const FALLBACK_SHAPES: { value: ArenaShape; label: string }[] = [
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

const FALLBACK_THEMES: { value: ArenaTheme; label: string; color: string }[] = [
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
    <svg width={W} height={H + 8} viewBox={`0 0 ${W} ${H + 8}`} className="block">
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

const FALLBACK_BOWL_PROFILES: BowlProfile[] = ["flat", "shallow", "medium", "deep", "steep"];

// ─── Tilt preview (top-down ellipse) ─────────────────────────────────────────
// Shows the arena as it would appear from above when tilted.
// At 0°: perfect circle. At 90°: horizontal/vertical line. At 180°: circle again (inverted).
function TiltPreview({ tiltAngle = 0, tiltDirection = 0 }: { tiltAngle?: number; tiltDirection?: number }) {
  const W = 160;
  const H = 100;
  const cx = W / 2;
  const cy = H / 2;
  const baseR = 40;

  // Compression factor along the tilt direction axis
  const tiltRad = (tiltAngle * Math.PI) / 180;
  const dirRad  = (tiltDirection * Math.PI) / 180;
  const k = Math.cos(tiltRad); // can be negative for inverted (180°)

  // The two axes of the ellipse (major = perpendicular to tilt, minor = along tilt)
  const majorR = baseR;
  const minorR = Math.abs(k) * baseR;

  // The ellipse is rotated by tiltDirection
  const dirDeg = tiltDirection % 360;

  // Downhill arrow direction
  const ax = cx + Math.cos(dirRad) * (minorR + 6);
  const ay = cy + Math.sin(dirRad) * (minorR + 6);

  // Label
  const label = tiltAngle === 0 ? "flat" : tiltAngle === 180 ? "inverted" : tiltAngle === 90 || tiltAngle === 270 ? "wall-ride" : `${Math.round(tiltAngle)}°`;
  const isInverted = Math.abs(k) < 0.05 ? false : k < 0;

  return (
    <svg width={W} height={H + 14} viewBox={`0 0 ${W} ${H + 14}`} className="block">
      {/* Shadow */}
      <ellipse cx={cx} cy={cy} rx={majorR + 2} ry={minorR + 2}
        fill="#0a0a14" transform={`rotate(${dirDeg} ${cx} ${cy})`} />
      {/* Arena surface */}
      <ellipse cx={cx} cy={cy} rx={majorR} ry={minorR}
        fill={isInverted ? "#1e1040" : "#1a2a3a"}
        stroke={isInverted ? "#a78bfa" : "#3b82f6"}
        strokeWidth={2}
        transform={`rotate(${dirDeg} ${cx} ${cy})`} />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill="#60a5fa" />
      {/* Downhill arrow (only when tilted) */}
      {tiltAngle !== 0 && tiltAngle !== 360 && minorR > 2 && (
        <line x1={cx} y1={cy} x2={ax} y2={ay}
          stroke="#f59e0b" strokeWidth={2} markerEnd="url(#arrow)" />
      )}
      {/* Inverted indicator */}
      {isInverted && (
        <text x={cx} y={cy + 2} textAnchor="middle" fill="#a78bfa" fontSize={9} fontFamily="monospace" fontWeight="bold">⊗</text>
      )}
      {/* Edge-on indicator */}
      {minorR <= 2 && tiltAngle !== 0 && (
        <line x1={cx - majorR} y1={cy} x2={cx + majorR} y2={cy}
          stroke="#3b82f6" strokeWidth={3} transform={`rotate(${dirDeg} ${cx} ${cy})`} />
      )}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
        </marker>
      </defs>
      <text x={cx} y={H + 12} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="monospace">
        {label}
      </text>
    </svg>
  );
}

const TILT_PRESETS: { label: string; angle: number; description: string }[] = [
  { label: "Flat",       angle: 0,   description: "Normal arena" },
  { label: "Tilted",     angle: 30,  description: "Slight slope" },
  { label: "Steep",      angle: 60,  description: "Strong pull" },
  { label: "Wall-Ride",  angle: 90,  description: "Edge-on — max lateral gravity" },
  { label: "Inverted",   angle: 180, description: "Upside-down / Zero-G" },
];

// Difficulty button colors keyed by difficulty level
const DIFF_COLORS: Record<string, string> = {
  easy: "#22c55e",
  medium: "#3b82f6",
  hard: "#f97316",
  extreme: "#ef4444",
};

// ─────────────────────────────────────────────────────────────────────────────

export default function BasicsTab({ config, onChange }: Props) {
  const { items: shapeDefs } = useArenaShapeDefs();
  const { items: themeDefs } = useArenaThemeDefs();
  const { items: bowlProfileDefs } = useBowlProfileDefs();
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const [bgUploading, setBgUploading] = useState(false);

  const handleBgImageUpload = async (file: File) => {
    if (!file) return;
    setBgUploading(true);
    try {
      const path = `arena_world_backgrounds/${Date.now()}_${file.name}`;
      const sRef = storageRef(storage, path);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      onChange({ worldBackground: { ...(config.worldBackground ?? { type: "image" }), type: "image", imageUrl: url } });
    } catch (e) {
      console.error("World background upload failed", e);
    } finally {
      setBgUploading(false);
    }
  };

  const shapes = shapeDefs.length > 0
    ? shapeDefs.map(s => ({ value: s.id as ArenaShape, label: s.label }))
    : FALLBACK_SHAPES;

  const themes = themeDefs.length > 0
    ? themeDefs.map(t => ({ value: t.id as ArenaTheme, label: t.label, color: t.color ?? "#3b82f6" }))
    : FALLBACK_THEMES;

  const bowlProfiles = bowlProfileDefs.length > 0
    ? bowlProfileDefs.map(b => ({ id: b.id as BowlProfile, label: b.label, wallAngle: b.wallAngle }))
    : FALLBACK_BOWL_PROFILES.map(id => ({ id, label: BOWL_PROFILE_LABELS[id] ?? id, wallAngle: BOWL_PROFILE_ANGLES[id] ?? 0 }));

  const handleShapeChange = (shape: ArenaShape) => {
    onChange({ shape, wall: initializeWallConfig(shape) });
  };

  const effectiveWallAngle =
    config.wallAngle !== undefined
      ? config.wallAngle
      : (bowlProfiles.find(b => b.id === (config.bowlProfile ?? "medium"))?.wallAngle
          ?? BOWL_PROFILE_ANGLES[config.bowlProfile ?? "medium"]
          ?? 40);

  const handleBowlProfileClick = (profile: BowlProfile) => {
    onChange({ bowlProfile: profile, wallAngle: undefined });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Name + Description — always visible, no collapse */}
      <div className="flex flex-col gap-2.5 mb-1">
        <div>
          <label className={LBL}>Arena Name</label>
          <input
            type="text"
            value={config.name ?? ""}
            onChange={e => onChange({ name: e.target.value })}
            className={INP}
            placeholder="e.g. Classic Stadium"
          />
        </div>
        <div>
          <label className={LBL}>Description</label>
          <textarea
            value={config.description ?? ""}
            onChange={e => onChange({ description: e.target.value })}
            rows={2}
            className={`${INP} resize-y font-[inherit]`}
            placeholder="Optional arena description…"
          />
        </div>
        <div>
          <label className={LBL}>Difficulty</label>
          <div className="flex gap-1.5">
            {(["easy", "medium", "hard", "extreme"] as const).map(d => {
              const active = (config.difficulty ?? "medium") === d;
              const color = DIFF_COLORS[d];
              return (
                <button
                  key={d}
                  onClick={() => onChange({ difficulty: d })}
                  className="flex-1 py-1.5 px-1 rounded-md text-[11px] font-medium cursor-pointer capitalize"
                  style={{
                    background: active ? `${color}22` : "transparent",
                    color: active ? color : "var(--muted)",
                    border: `1px solid ${active ? color : "var(--border)"}`,
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Size */}
      <CollapsibleSection title="Size &amp; Presets" storageKey="arena-basics-size" defaultOpen={true}>
      <div>
        <label className={LBL}>Size (cm) — Width × Height</label>
        <div className="flex gap-2 items-center">
          <input
            type="number" min={20} max={100} step={1}
            value={config.width ? Math.round(config.width / PX_PER_CM_BASE) : 50}
            onChange={e => onChange({ width: Math.round(parseFloat(e.target.value) || 50) * PX_PER_CM_BASE })}
            className="bg-bg3 border border-border-c rounded-lg px-3 py-2 text-theme-text text-sm w-20 text-right"
          />
          <span className="text-theme-faint text-xs">×</span>
          <input
            type="number" min={20} max={100} step={1}
            value={config.height ? Math.round(config.height / PX_PER_CM_BASE) : 50}
            onChange={e => onChange({ height: Math.round(parseFloat(e.target.value) || 50) * PX_PER_CM_BASE })}
            className="bg-bg3 border border-border-c rounded-lg px-3 py-2 text-theme-text text-sm w-20 text-right"
          />
          <span className="text-theme-faint text-xs">cm</span>
        </div>
        <div className="text-[11px] text-theme-faint mt-1">
          {config.width && config.height
            ? `${config.width} × ${config.height} px stored — displayed as ${Math.round(config.width / PX_PER_CM_BASE)} × ${Math.round(config.height / PX_PER_CM_BASE)} cm`
            : "Default: 50 × 50 cm (1200 × 1200 px)"}
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className={LBL}>Load Preset</label>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(ARENA_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onChange(preset)}
              className="py-[5px] px-3 bg-bg3 border border-border rounded-md text-xs text-muted cursor-pointer"
            >
              {preset.name ?? key}
            </button>
          ))}
        </div>
      </div>
      </CollapsibleSection>

      {/* Shape */}
      <CollapsibleSection title="Shape" storageKey="arena-basics-shape" defaultOpen={true}>
      <div>
        <label className={LBL}>Shape</label>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}>
          {shapes.map(s => (
            <button
              key={s.value}
              onClick={() => handleShapeChange(s.value)}
              className="py-2 px-1.5 rounded-lg text-xs font-medium cursor-pointer"
              style={{
                background: config.shape === s.value ? "var(--purple)" : "var(--bg3)",
                color: config.shape === s.value ? "#ffffff" : "var(--muted)",
                border: `1px solid ${config.shape === s.value ? "var(--purple)" : "var(--border)"}`,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      </CollapsibleSection>

      {/* Theme */}
      <CollapsibleSection title="Theme" storageKey="arena-basics-theme" defaultOpen={true}>
      <div>
        <label className={LBL}>Theme</label>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
          {themes.map(t => (
            <button
              key={t.value}
              onClick={() => onChange({ theme: t.value })}
              className="py-2 px-2.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-2"
              style={{
                background: config.theme === t.value ? `${t.color}22` : "var(--bg3)",
                color: config.theme === t.value ? t.color : "var(--muted)",
                border: `1px solid ${config.theme === t.value ? t.color : "var(--border)"}`,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: t.color }}
              />
              {t.label}
            </button>
          ))}
        </div>
      </div>
      </CollapsibleSection>

      {/* Bowl / Cross-Section */}
      <CollapsibleSection title="Bowl Profile" storageKey="arena-basics-bowl" defaultOpen={false}>
      <div>

        {/* Profile presets */}
        <div className="flex gap-1.5 flex-wrap mb-3.5">
          {bowlProfiles.map(profile => {
            const active = (config.bowlProfile ?? "medium") === profile.id && config.wallAngle === undefined;
            return (
              <button
                key={profile.id}
                onClick={() => handleBowlProfileClick(profile.id)}
                className="py-[5px] px-3 rounded-md text-[11px] font-medium cursor-pointer capitalize"
                style={{
                  background: active ? "var(--blue)" : "transparent",
                  color: active ? "#ffffff" : "var(--muted)",
                  border: `1px solid ${active ? "var(--blue)" : "var(--border)"}`,
                }}
              >
                {profile.label}
              </button>
            );
          })}
        </div>

        {/* Custom angle slider */}
        <div className="mb-3.5">
          <div className="flex justify-between text-xs text-theme-muted mb-1">
            <span>Wall Angle (custom)</span>
            <span className="text-theme-text font-mono">{effectiveWallAngle}°</span>
          </div>
          <input
            type="range" min={0} max={75} step={1}
            value={effectiveWallAngle}
            onChange={e => onChange({ wallAngle: +e.target.value, bowlProfile: undefined })}
            className="w-full accent-theme-blue"
          />
          <div className="flex justify-between text-[10px] text-theme-faint mt-0.5">
            <span>0° — flat / vertical</span>
            <span>75° — cup shape</span>
          </div>
        </div>

        {/* Bowl depth */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-theme-muted mb-1">
            <span>Bowl Depth</span>
            <span className="text-theme-text font-mono">{Math.round((config.bowlDepth ?? 0.4) * 100)}%</span>
          </div>
          <input
            type="range" min={0} max={100} step={5}
            value={Math.round((config.bowlDepth ?? 0.4) * 100)}
            onChange={e => onChange({ bowlDepth: +e.target.value / 100 })}
            className="w-full accent-theme-blue"
          />
        </div>

        {/* Cross-section preview */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] text-theme-faint">Cross-section preview</span>
          <div className="border border-border-c rounded-lg px-4 py-2.5 bg-[#0f172a]">
            <BowlCrossSection wallAngle={effectiveWallAngle} bowlDepth={config.bowlDepth ?? 0.4} />
          </div>
          <span className="text-[10px] text-theme-faint text-center">
            {config.wallAngle !== undefined
              ? `Custom angle: ${config.wallAngle}°`
              : BOWL_PROFILE_LABELS[config.bowlProfile ?? "medium"]}
          </span>
        </div>
      </div>
      </CollapsibleSection>

      {/* Rotation */}
      <CollapsibleSection title="Auto-Rotate" storageKey="arena-basics-rotate" defaultOpen={false}>
      <div>
        <div className="flex justify-between items-center mb-3.5">
          <span className="text-[13px] font-semibold text-theme-text">Auto-Rotate</span>
          <button
            onClick={() => onChange({ autoRotate: !config.autoRotate })}
            className="py-1 px-3.5 rounded-md border-none cursor-pointer font-semibold text-xs"
            style={{
              background: config.autoRotate ? "var(--green)" : "var(--bg2)",
              color: config.autoRotate ? "#ffffff" : "var(--muted)",
            }}
          >
            {config.autoRotate ? "ON" : "OFF"}
          </button>
        </div>
        {config.autoRotate && (
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between text-xs text-theme-muted mb-1">
                <span>Speed (°/s)</span>
                <span className="text-theme-text font-mono">{config.rotationSpeed ?? 6}°/s</span>
              </div>
              <input
                type="range" min={1} max={60} step={1}
                value={config.rotationSpeed ?? 6}
                onChange={e => onChange({ rotationSpeed: +e.target.value })}
                className="w-full accent-theme-purple"
              />
            </div>
            <div>
              <label className={LBL}>Direction</label>
              <div className="flex gap-2">
                {(["clockwise", "counterclockwise"] as const).map(dir => (
                  <button
                    key={dir}
                    onClick={() => onChange({ rotationDirection: dir })}
                    className="flex-1 py-1.5 rounded-md text-xs cursor-pointer capitalize"
                    style={{
                      background: config.rotationDirection === dir ? "var(--purple)" : "transparent",
                      color: config.rotationDirection === dir ? "#ffffff" : "var(--muted)",
                      border: `1px solid ${config.rotationDirection === dir ? "var(--purple)" : "var(--border)"}`,
                    }}
                  >
                    {dir === "clockwise" ? "↻ Clockwise" : "↺ Counter"}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation pivot */}
            <div>
              <label className={LBL}>Pivot Offset (cm from center)</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="text-[10px] text-theme-faint mb-0.5">X</div>
                  <input
                    type="number" step={1} min={-200} max={200}
                    value={config.rotationPivotX ?? 0}
                    onChange={e => onChange({ rotationPivotX: +e.target.value })}
                    className={INP}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-theme-faint mb-0.5">Y</div>
                  <input
                    type="number" step={1} min={-200} max={200}
                    value={config.rotationPivotY ?? 0}
                    onChange={e => onChange({ rotationPivotY: +e.target.value })}
                    className={INP}
                  />
                </div>
              </div>
              <div className="text-[10px] text-theme-faint mt-[3px]">
                (0, 0) = arena center. Offset rotates around an eccentric point.
              </div>
            </div>
          </div>
        )}
      </div>
      </CollapsibleSection>

      {/* Tilt — hidden in 2D mode */}
      {(config.rendererMode ?? "2.5d") !== "2d" && <CollapsibleSection title="Arena Tilt" storageKey="arena-basics-tilt" defaultOpen={false}>
      <div>
        <div className="text-[11px] text-theme-faint mb-3.5">
          0° = flat · 90° = wall-ride · 180° = inverted / Zero-G · 270° = wall-ride back
        </div>

        {/* Tilt mode selector */}
        <div className="mb-3.5">
          <label className={LBL}>Tilt Mode</label>
          <div className="flex gap-1.5">
            {(["fixed", "oscillate", "weight"] as const).map(mode => {
              const active = (config.tiltMode ?? "fixed") === mode;
              const labels: Record<string, string> = { fixed: "Fixed", oscillate: "Oscillate", weight: "Weight" };
              return (
                <button
                  key={mode}
                  onClick={() => onChange({ tiltMode: mode })}
                  className="flex-1 py-1.5 px-1 rounded-md text-[11px] font-medium cursor-pointer"
                  style={{
                    background: active ? "var(--blue)" : "transparent",
                    color: active ? "#ffffff" : "var(--muted)",
                    border: `1px solid ${active ? "var(--blue)" : "var(--border)"}`,
                  }}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-theme-faint mt-1">
            {(config.tiltMode ?? "fixed") === "fixed" && "Static tilt at the configured angle."}
            {(config.tiltMode ?? "fixed") === "oscillate" && "Angle rocks between min–max on a cosine wave."}
            {(config.tiltMode ?? "fixed") === "weight" && "Arena tilts toward where beyblades are massed."}
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex gap-1.5 flex-wrap mb-3.5">
          {TILT_PRESETS.map(p => {
            const active = (config.tiltAngle ?? 0) === p.angle;
            return (
              <button
                key={p.label}
                title={p.description}
                onClick={() => onChange({ tiltAngle: p.angle })}
                className="py-[5px] px-3 rounded-md text-[11px] font-medium cursor-pointer"
                style={{
                  background: active ? "var(--blue)" : "transparent",
                  color: active ? "#ffffff" : "var(--muted)",
                  border: `1px solid ${active ? "var(--blue)" : "var(--border)"}`,
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Fixed / Weight mode — angle + direction */}
        {(config.tiltMode ?? "fixed") !== "oscillate" && (
          <>
            {/* Tilt angle slider */}
            <div className="mb-3.5">
              <div className="flex justify-between text-xs text-theme-muted mb-1">
                <span>{(config.tiltMode ?? "fixed") === "weight" ? "Max Tilt Angle" : "Tilt Angle"}</span>
                <span className="text-theme-text font-mono">{config.tiltAngle ?? 0}°</span>
              </div>
              <input
                type="range" min={0} max={360} step={1}
                value={config.tiltAngle ?? 0}
                onChange={e => onChange({ tiltAngle: +e.target.value })}
                className="w-full accent-theme-blue"
              />
              <div className="flex justify-between text-[10px] text-theme-faint mt-0.5">
                <span>0° flat</span><span>90° wall</span><span>180° inverted</span><span>270° wall</span><span>360° flat</span>
              </div>
            </div>

            {/* Tilt direction slider (hidden for weight mode — direction is auto) */}
            {(config.tiltMode ?? "fixed") !== "weight" && (
              <div className="mb-3.5">
                <div className="flex justify-between text-xs text-theme-muted mb-1">
                  <span>Tilt Direction <span className="text-[10px] text-theme-faint">(downhill azimuth)</span></span>
                  <span className="text-theme-text font-mono">{config.tiltDirection ?? 0}°</span>
                </div>
                <input
                  type="range" min={0} max={359} step={1}
                  value={config.tiltDirection ?? 0}
                  onChange={e => onChange({ tiltDirection: +e.target.value })}
                  className="w-full accent-theme-blue"
                />
                <div className="flex justify-between text-[10px] text-theme-faint mt-0.5">
                  <span>0° → right</span><span>90° ↓ down</span><span>180° ← left</span><span>270° ↑ up</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Oscillate mode — min / max / period */}
        {(config.tiltMode ?? "fixed") === "oscillate" && (
          <div className="mb-3.5 flex flex-col gap-2.5">
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-theme-muted mb-1">
                  <span>Min Angle</span>
                  <span className="text-theme-text font-mono">{config.tiltOscillateMin ?? 0}°</span>
                </div>
                <input
                  type="range" min={0} max={180} step={1}
                  value={config.tiltOscillateMin ?? 0}
                  onChange={e => onChange({ tiltOscillateMin: +e.target.value })}
                  className="w-full accent-theme-blue"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-theme-muted mb-1">
                  <span>Max Angle</span>
                  <span className="text-theme-text font-mono">{config.tiltOscillateMax ?? 45}°</span>
                </div>
                <input
                  type="range" min={0} max={360} step={1}
                  value={config.tiltOscillateMax ?? 45}
                  onChange={e => onChange({ tiltOscillateMax: +e.target.value })}
                  className="w-full accent-theme-blue"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-theme-muted mb-1">
                <span>Period</span>
                <span className="text-theme-text font-mono">{((config.tiltOscillatePeriodMs ?? 4000) / 1000).toFixed(1)}s</span>
              </div>
              <input
                type="range" min={500} max={20000} step={500}
                value={config.tiltOscillatePeriodMs ?? 4000}
                onChange={e => onChange({ tiltOscillatePeriodMs: +e.target.value })}
                className="w-full accent-theme-blue"
              />
              <div className="flex justify-between text-[10px] text-theme-faint mt-0.5">
                <span>0.5s fast</span><span>4s default</span><span>20s slow</span>
              </div>
            </div>
            <div className="mb-1">
              <div className="flex justify-between text-xs text-theme-muted mb-1">
                <span>Tilt Direction <span className="text-[10px] text-theme-faint">(downhill azimuth)</span></span>
                <span className="text-theme-text font-mono">{config.tiltDirection ?? 0}°</span>
              </div>
              <input
                type="range" min={0} max={359} step={1}
                value={config.tiltDirection ?? 0}
                onChange={e => onChange({ tiltDirection: +e.target.value })}
                className="w-full accent-theme-blue"
              />
              <div className="flex justify-between text-[10px] text-theme-faint mt-0.5">
                <span>0° → right</span><span>90° ↓ down</span><span>180° ← left</span><span>270° ↑ up</span>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="flex gap-5 items-center mb-3.5">
          <div className="border border-border-c rounded-lg py-2 px-3 bg-[#0f172a]">
            <TiltPreview tiltAngle={config.tiltAngle ?? 0} tiltDirection={config.tiltDirection ?? 0} />
          </div>
          <div className="text-[11px] text-theme-faint leading-relaxed">
            <div>Yellow arrow = downhill</div>
            <div>Purple ⊗ = inverted</div>
            <div>Line = edge-on (wall-ride)</div>
          </div>
        </div>

        {/* Tilt pivot */}
        <div className="mb-3.5">
          <label className={LBL}>Tilt Pivot Offset (cm from center)</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-[10px] text-theme-faint mb-0.5">X</div>
              <input
                type="number" step={1} min={-200} max={200}
                value={config.tiltPivotX ?? 0}
                onChange={e => onChange({ tiltPivotX: +e.target.value })}
                className={INP}
              />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-theme-faint mb-0.5">Y</div>
              <input
                type="number" step={1} min={-200} max={200}
                value={config.tiltPivotY ?? 0}
                onChange={e => onChange({ tiltPivotY: +e.target.value })}
                className={INP}
              />
            </div>
          </div>
          <div className="text-[10px] text-theme-faint mt-[3px]">
            (0, 0) = arena center. Offset tilts around an eccentric point.
          </div>
        </div>

        {/* Auto-Tilt (spinning tilt direction) */}
        <div className="border-t border-border-c pt-3">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-semibold text-theme-text">
              Auto-Tilt <span className="text-[10px] text-theme-faint font-normal">(direction rotates)</span>
            </span>
            <button
              onClick={() => onChange({ autoTilt: !config.autoTilt })}
              className="py-[3px] px-3 rounded-md border-none cursor-pointer font-semibold text-xs"
              style={{
                background: config.autoTilt ? "var(--green)" : "var(--bg2)",
                color: config.autoTilt ? "#ffffff" : "var(--muted)",
              }}
            >
              {config.autoTilt ? "ON" : "OFF"}
            </button>
          </div>
          {config.autoTilt && (
            <div>
              <div className="flex justify-between text-xs text-theme-muted mb-1">
                <span>Tilt-Direction Speed (°/s)</span>
                <span className="text-theme-text font-mono">{config.tiltSpeed ?? 10}°/s</span>
              </div>
              <input
                type="range" min={1} max={90} step={1}
                value={config.tiltSpeed ?? 10}
                onChange={e => onChange({ tiltSpeed: +e.target.value })}
                className="w-full accent-theme-green"
              />
              <div className="text-[10px] text-theme-faint mt-1">
                The downhill direction spins — creates a tilted spinning-bowl effect.
              </div>
            </div>
          )}
        </div>
      </div>
      </CollapsibleSection>}

      {/* Physics / Gameplay */}
      <CollapsibleSection title="Physics &amp; Gameplay" storageKey="arena-basics-physics" defaultOpen={false}>
      <div>
        <div className="flex flex-col gap-3.5">
          {/* Stamina drain */}
          <div>
            <div className="flex justify-between text-xs text-theme-muted mb-1">
              <span>Stamina Drain Multiplier</span>
              <span className="text-theme-text font-mono">{(config.staminaDrainMultiplier ?? 1).toFixed(2)}×</span>
            </div>
            <input
              type="range" min={25} max={400} step={5}
              value={Math.round((config.staminaDrainMultiplier ?? 1) * 100)}
              onChange={e => onChange({ staminaDrainMultiplier: +e.target.value / 100 })}
              className="w-full accent-theme-blue"
            />
            <div className="flex justify-between text-[10px] text-theme-faint mt-0.5">
              <span>0.25× slow drain</span><span>1.0× normal</span><span>4.0× fast drain</span>
            </div>
          </div>

          {/* QTE */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-theme-muted">QTE Enabled</span>
              <button
                onClick={() => onChange({ qteEnabled: !(config.qteEnabled ?? true) })}
                className="py-[3px] px-3 rounded-md border-none cursor-pointer font-semibold text-xs"
                style={{
                  background: (config.qteEnabled ?? true) ? "var(--green)" : "var(--bg2)",
                  color: (config.qteEnabled ?? true) ? "#ffffff" : "var(--muted)",
                }}
              >
                {(config.qteEnabled ?? true) ? "ON" : "OFF"}
              </button>
            </div>
            {(config.qteEnabled ?? true) && (
              <div>
                <label className={LBL}>QTE Window Scaling</label>
                <div className="flex gap-2">
                  {(["flat", "by_cost"] as const).map(mode => {
                    const active = (config.qteWindowScaling ?? "by_cost") === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => onChange({ qteWindowScaling: mode })}
                        className="flex-1 py-1.5 px-2 rounded-md text-[11px] cursor-pointer"
                        style={{
                          background: active ? "var(--blue)" : "transparent",
                          color: active ? "#ffffff" : "var(--muted)",
                          border: `1px solid ${active ? "var(--blue)" : "var(--border)"}`,
                        }}
                      >
                        {mode === "flat" ? "Flat (60t)" : "By Cost"}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] text-theme-faint mt-1">
                  Flat = always 60 ticks. By Cost = window scales with combo/special cost.
                </div>
              </div>
            )}
          </div>

          {/* Random Modifiers */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-theme-muted">Random Match Modifiers</span>
              <button
                onClick={() => onChange({ randomModifiers: !config.randomModifiers })}
                className="py-[3px] px-3 rounded-md border-none cursor-pointer font-semibold text-xs"
                style={{
                  background: config.randomModifiers ? "var(--green)" : "var(--bg2)",
                  color: config.randomModifiers ? "#ffffff" : "var(--muted)",
                }}
              >
                {config.randomModifiers ? "ON" : "OFF"}
              </button>
            </div>
            {config.randomModifiers && (
              <div>
                <label className={LBL}>Max Stacked Modifiers</label>
                <input
                  type="number" min={1} max={10} step={1}
                  value={config.maxModifiers ?? 2}
                  onChange={e => onChange({ maxModifiers: Math.max(1, Math.min(10, +e.target.value || 2)) })}
                  className="bg-bg3 border border-border-c rounded-lg px-3 py-2 text-theme-text text-sm w-20"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      </CollapsibleSection>

      {/* Player Authority */}
      <CollapsibleSection title="Player Authority" storageKey="arena-basics-authority" defaultOpen={false}>
      <div>
        <div className="text-[11px] text-theme-faint mb-3">
          Controls how much arena features override player input. 1.0 = default. &lt;1 = arena controls more.
        </div>
        <div className="flex flex-col gap-3">
          {/* Global multiplier */}
          <div>
            <div className="flex justify-between text-xs text-theme-muted mb-1">
              <span>Global Multiplier</span>
              <span className="font-mono text-theme-text">{((config.playerAuthorityConfig?.globalMultiplier ?? 1.0)).toFixed(2)}×</span>
            </div>
            <input type="range" min={50} max={200} step={5}
              value={Math.round((config.playerAuthorityConfig?.globalMultiplier ?? 1.0) * 100)}
              onChange={e => onChange({ playerAuthorityConfig: { ...(config.playerAuthorityConfig ?? {}), globalMultiplier: +e.target.value / 100 } })}
              className="w-full accent-theme-blue" />
            <div className="flex justify-between text-[10px] text-theme-faint mt-0.5">
              <span>0.5× arena dominant</span><span>1.0× balanced</span><span>2.0× player dominant</span>
            </div>
          </div>
          {/* Curvature multiplier */}
          <div>
            <div className="flex justify-between text-xs text-theme-muted mb-1">
              <span>Curvature Multiplier</span>
              <span className="font-mono text-theme-text">{((config.playerAuthorityConfig?.curvatureMultiplier ?? 1.0)).toFixed(2)}×</span>
            </div>
            <input type="range" min={0} max={100} step={5}
              value={Math.round((config.playerAuthorityConfig?.curvatureMultiplier ?? 1.0) * 100)}
              onChange={e => onChange({ playerAuthorityConfig: { ...(config.playerAuthorityConfig ?? {}), curvatureMultiplier: +e.target.value / 100 } })}
              className="w-full accent-theme-blue" />
          </div>
        </div>
      </div>
      </CollapsibleSection>

      {/* Max Duration */}
      <CollapsibleSection title="Max Match Duration" storageKey="arena-basics-duration" defaultOpen={false}>
      <div>
        <div className="text-[11px] text-theme-faint mb-2.5">
          Overrides room default. Tournament rooms always use 180s regardless.
        </div>
        <div className="flex gap-2 items-center">
          <input type="number" min={30} max={600} step={15}
            value={config.maxDurationSeconds ?? 180}
            onChange={e => onChange({ maxDurationSeconds: +e.target.value || undefined })}
            className="bg-bg3 border border-border-c rounded-lg px-3 py-2 text-theme-text text-sm w-20" />
          <span className="text-xs text-theme-muted">seconds ({Math.floor((config.maxDurationSeconds ?? 180) / 60)}m {(config.maxDurationSeconds ?? 180) % 60}s)</span>
          <button onClick={() => onChange({ maxDurationSeconds: undefined })}
            className="py-1 px-2 text-[11px] rounded-md border border-border-c bg-transparent text-theme-muted cursor-pointer">
            Reset
          </button>
        </div>
      </div>
      </CollapsibleSection>

      {/* Renderer Mode */}
      <CollapsibleSection title="Renderer Mode" storageKey="arena-basics-renderer" defaultOpen={false}>
      <div>
        <div className="text-[11px] text-theme-faint mb-3">
          2D = flat PixiJS · 2.5D = tilt-projected PixiJS (default) · 3D = Three.js stub
        </div>
        <div className="flex gap-2">
          {(["2d", "2.5d", "3d"] as const).map(m => {
            const active = (config.rendererMode ?? "2.5d") === m;
            const color = m === "3d" ? "var(--purple)" : m === "2.5d" ? "var(--blue)" : "var(--green)";
            const label = m === "2d" ? "2D — Flat" : m === "2.5d" ? "2.5D — Tilt" : "3D — Stub";
            return (
              <button
                key={m}
                onClick={() => onChange({ rendererMode: m })}
                className="flex-1 py-2 px-1 rounded-lg text-xs font-semibold cursor-pointer"
                style={{
                  background: active ? `color-mix(in srgb, ${color} 13%, transparent)` : "transparent",
                  color: active ? color : "var(--muted)",
                  border: `1px solid ${active ? color : "var(--border)"}`,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        {(config.rendererMode ?? "2.5d") === "2d" && (
          <div className="text-[10px] text-theme-faint mt-2">
            Tilt panel and auto-tilt settings have no physics effect in 2D mode.
          </div>
        )}
        {(config.rendererMode ?? "2.5d") === "3d" && (
          <div className="text-[10px] mt-2 text-[#f59e0b]">
            Three.js renderer is a stub — not yet implemented. Falls back to 2.5D in-game.
          </div>
        )}
      </div>
      </CollapsibleSection>

      {/* Visual Overrides */}
      <CollapsibleSection title="Visual Overrides" storageKey="arena-basics-visuals" defaultOpen={false}>
      <div>
        <div className="text-[11px] text-theme-faint mb-3.5">
          Override theme defaults. Leave blank to use theme colors.
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={LBL}>Background Color</label>
            <div className="flex gap-1.5 items-center">
              <input
                type="color"
                value={config.backgroundColor ?? "#1a1a2e"}
                onChange={e => onChange({ backgroundColor: e.target.value })}
                className="w-9 h-[30px] p-0.5 border border-border-c rounded-md cursor-pointer bg-bg2"
              />
              <input
                type="text"
                value={config.backgroundColor ?? ""}
                onChange={e => onChange({ backgroundColor: e.target.value || undefined })}
                placeholder="e.g. #1a1a2e"
                className="bg-bg3 border border-border-c rounded-lg px-3 py-2 text-theme-text text-[11px] font-mono flex-1"
              />
              {config.backgroundColor && (
                <button
                  onClick={() => onChange({ backgroundColor: undefined })}
                  className="py-1 px-2 text-[11px] rounded-md border border-border-c bg-transparent text-theme-muted cursor-pointer"
                  title="Clear override"
                >×</button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <label className={LBL}>Floor Color</label>
            <div className="flex gap-1.5 items-center">
              <input
                type="color"
                value={config.floorColor ?? "#374151"}
                onChange={e => onChange({ floorColor: e.target.value })}
                className="w-9 h-[30px] p-0.5 border border-border-c rounded-md cursor-pointer bg-bg2"
              />
              <input
                type="text"
                value={config.floorColor ?? ""}
                onChange={e => onChange({ floorColor: e.target.value || undefined })}
                placeholder="e.g. #374151"
                className="bg-bg3 border border-border-c rounded-lg px-3 py-2 text-theme-text text-[11px] font-mono flex-1"
              />
              {config.floorColor && (
                <button
                  onClick={() => onChange({ floorColor: undefined })}
                  className="py-1 px-2 text-[11px] rounded-md border border-border-c bg-transparent text-theme-muted cursor-pointer"
                  title="Clear override"
                >×</button>
              )}
            </div>
          </div>
        </div>
      </div>
      </CollapsibleSection>

      <CollapsibleSection title="World Background" storageKey="arena-basics-worldbg" defaultOpen={false}>
        <div className="flex flex-col gap-4">
          <div className="text-[11px] text-theme-faint">
            What appears behind the arena/stadium — sky, trees, city, clip art, etc. Independent of the arena floor theme.
          </div>

          {/* Type selector */}
          <div>
            <label className={LBL}>Background Type</label>
            <div className="flex gap-2">
              {(["none", "color", "image"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => onChange({ worldBackground: { ...(config.worldBackground ?? {}), type: t } as typeof config.worldBackground & NonNullable<unknown> })}
                  className="flex-1 py-1.5 text-[12px] rounded-lg border cursor-pointer capitalize transition-colors"
                  style={{
                    borderColor: (config.worldBackground?.type ?? "none") === t ? "#3b82f6" : "var(--border-c)",
                    background:  (config.worldBackground?.type ?? "none") === t ? "rgba(59,130,246,0.15)" : "var(--bg3)",
                    color:       (config.worldBackground?.type ?? "none") === t ? "#3b82f6" : "var(--text-muted)",
                  }}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          {(config.worldBackground?.type === "color") && (
            <div>
              <label className={LBL}>Background Color</label>
              <div className="flex gap-1.5 items-center">
                <input
                  type="color"
                  value={config.worldBackground?.color ?? "#0a0a1a"}
                  onChange={e => onChange({ worldBackground: { ...(config.worldBackground ?? { type: "color" }), color: e.target.value } })}
                  className="w-9 h-[30px] p-0.5 border border-border-c rounded-md cursor-pointer bg-bg2"
                />
                <input
                  type="text"
                  value={config.worldBackground?.color ?? ""}
                  onChange={e => onChange({ worldBackground: { ...(config.worldBackground ?? { type: "color" }), color: e.target.value || undefined } })}
                  placeholder="#0a0a1a"
                  className="bg-bg3 border border-border-c rounded-lg px-3 py-2 text-theme-text text-[11px] font-mono flex-1"
                />
              </div>
            </div>
          )}

          {/* Image upload */}
          {(config.worldBackground?.type === "image") && (
            <div className="flex flex-col gap-2">
              <label className={LBL}>Background Image</label>
              {config.worldBackground?.imageUrl && (
                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-border-c">
                  <img
                    src={config.worldBackground.imageUrl}
                    alt="World background preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onChange({ worldBackground: { ...(config.worldBackground ?? { type: "image" }), imageUrl: undefined } })}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-[12px] flex items-center justify-center cursor-pointer hover:bg-black/80"
                  >×</button>
                </div>
              )}
              <input
                ref={bgImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleBgImageUpload(f); e.target.value = ""; }}
              />
              <button
                onClick={() => bgImageInputRef.current?.click()}
                disabled={bgUploading}
                className="w-full py-2 text-[12px] rounded-lg border border-border-c bg-bg3 text-theme-muted cursor-pointer hover:text-theme-text hover:border-[#3b82f6] transition-colors disabled:opacity-50"
              >
                {bgUploading ? "Uploading…" : config.worldBackground?.imageUrl ? "Replace Image" : "Upload Image"}
              </button>
              <div className="text-[10px] text-theme-faint">PNG, JPG, WebP, GIF — landscape images work best (e.g. 1920×1080)</div>

              {/* Fit */}
              <div>
                <label className={LBL}>Image Fit</label>
                <select
                  value={config.worldBackground?.fit ?? "cover"}
                  onChange={e => onChange({ worldBackground: { ...(config.worldBackground ?? { type: "image" }), fit: e.target.value as "cover" | "contain" | "stretch" } })}
                  className={INP}
                >
                  <option value="cover">Cover (fill canvas, crop edges)</option>
                  <option value="contain">Contain (letterbox, no crop)</option>
                  <option value="stretch">Stretch (fill exactly, may distort)</option>
                </select>
              </div>

              {/* Blur */}
              <div>
                <label className={LBL}>Blur — {(config.worldBackground?.blurPx ?? 0).toFixed(0)} px</label>
                <input
                  type="range" min={0} max={20} step={1}
                  value={config.worldBackground?.blurPx ?? 0}
                  onChange={e => onChange({ worldBackground: { ...(config.worldBackground ?? { type: "image" }), blurPx: Number(e.target.value) } })}
                  className="w-full accent-[#3b82f6]"
                />
                <div className="flex justify-between text-[10px] text-theme-faint mt-0.5"><span>Sharp</span><span>Blurred</span></div>
              </div>
            </div>
          )}

          {/* Opacity — shown for color + image */}
          {(config.worldBackground?.type === "color" || config.worldBackground?.type === "image") && (
            <div>
              <label className={LBL}>Opacity — {Math.round((config.worldBackground?.opacity ?? 1) * 100)}%</label>
              <input
                type="range" min={0} max={1} step={0.01}
                value={config.worldBackground?.opacity ?? 1}
                onChange={e => onChange({ worldBackground: { ...(config.worldBackground ?? { type: "color" }), opacity: Number(e.target.value) } })}
                className="w-full accent-[#3b82f6]"
              />
              <div className="flex justify-between text-[10px] text-theme-faint mt-0.5"><span>0% (transparent)</span><span>100% (solid)</span></div>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}

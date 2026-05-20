import { C } from "@/styles/theme";
import type { ArenaConfig, WaterBodyConfig, LiquidType, ZoneWaterBodyConfig, MoatWaterBodyConfig } from "@/types/arenaConfigNew";
import { LIQUID_PRESETS } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return `water_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

const DEFAULT_ZONE: ZoneWaterBodyConfig = {
  id: "", type: "zone", liquidType: "water", shape: "circle",
  position: { x: 0, y: 0 }, radius: 5, opacity: 0.6,
};

const DEFAULT_MOAT: MoatWaterBodyConfig = {
  id: "", type: "moat", liquidType: "water",
  thickness: 3, distanceFromArena: 20, followsArenaShape: true, opacity: 0.6,
};

const NUM_FIELDS: (keyof ZoneWaterBodyConfig)[] = ["radius"];

export default function WaterBodiesTab({ config, onChange }: Props) {
  const bodies = config.waterBodies ?? [];

  const add = (type: "zone" | "moat") => {
    if (bodies.length >= 3) return;
    const base = type === "moat"
      ? { ...DEFAULT_MOAT, id: makeId() }
      : { ...DEFAULT_ZONE, id: makeId() };
    onChange({ waterBodies: [...bodies, base as WaterBodyConfig] });
  };

  const remove = (id: string) =>
    onChange({ waterBodies: bodies.filter(b => b.id !== id) });

  const update = (id: string, field: string, value: any) =>
    onChange({ waterBodies: bodies.map(b => b.id === id ? { ...b, [field]: value } : b) });

  const updatePos = (id: string, axis: "x" | "y", value: number) =>
    onChange({
      waterBodies: bodies.map(b =>
        b.id === id && b.type === "zone"
          ? { ...b, position: { ...(b as ZoneWaterBodyConfig).position, [axis]: value } }
          : b
      ),
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{bodies.length} / 3 water bodies</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => add("zone")} disabled={bodies.length >= 3} style={{ padding: "5px 12px", background: C.blue, color: C.white, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: bodies.length >= 3 ? 0.4 : 1 }}>
            + Zone
          </button>
          <button onClick={() => add("moat")} disabled={bodies.length >= 3} style={{ padding: "5px 12px", background: C.blue, color: C.white, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: bodies.length >= 3 ? 0.4 : 1 }}>
            + Moat
          </button>
        </div>
      </div>

      {bodies.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint }}>
          <p>No water bodies yet.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Add a zone (free-floating) or moat (surrounding wall).</p>
        </div>
      )}

      {bodies.map((wb, idx) => {
        const preset = LIQUID_PRESETS[wb.liquidType as LiquidType];
        return (
          <div key={wb.id} style={{ background: C.bg3, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                Water Body #{idx + 1} — <span style={{ color: C.muted, textTransform: "capitalize" }}>{wb.type}</span>
              </span>
              <button onClick={() => remove(wb.id)} style={{ color: C.red, background: "none", border: "none", fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>

            {/* Liquid type */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 6 }}>Liquid Type</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {(Object.keys(LIQUID_PRESETS) as LiquidType[]).map(lt => (
                  <button
                    key={lt}
                    onClick={() => update(wb.id, "liquidType", lt)}
                    title={LIQUID_PRESETS[lt].description}
                    style={{
                      padding: "4px 2px", borderRadius: 6, fontSize: 10, fontWeight: 500, cursor: "pointer",
                      background: wb.liquidType === lt ? `${LIQUID_PRESETS[lt].color}33` : C.bg2,
                      color: wb.liquidType === lt ? LIQUID_PRESETS[lt].color : C.faint,
                      border: `1px solid ${wb.liquidType === lt ? LIQUID_PRESETS[lt].color : C.border}`,
                    }}
                  >
                    {LIQUID_PRESETS[lt].name}
                  </button>
                ))}
              </div>
              {preset && <p style={{ fontSize: 11, color: C.faint, marginTop: 6 }}>{preset.description}</p>}
            </div>

            {/* Zone-specific fields */}
            {wb.type === "zone" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {(["x", "y"] as const).map(axis => (
                  <div key={axis}>
                    <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 3, textTransform: "uppercase" }}>Pos {axis} (em)</label>
                    <input type="number" step={0.5}
                      value={(wb as ZoneWaterBodyConfig).position?.[axis] ?? 0}
                      onChange={e => updatePos(wb.id, axis, +e.target.value)}
                      style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 3 }}>Radius (em)</label>
                  <input type="number" min={1} max={20} step={0.5}
                    value={(wb as ZoneWaterBodyConfig).radius ?? 5}
                    onChange={e => update(wb.id, "radius", +e.target.value)}
                    style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 12, boxSizing: "border-box" }}
                  />
                </div>
              </div>
            )}

            {/* Moat-specific fields */}
            {wb.type === "moat" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(["thickness", "distanceFromArena"] as const).map(field => (
                  <div key={field}>
                    <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 3, textTransform: "capitalize" }}>
                      {field === "distanceFromArena" ? "Inner Radius (em)" : "Thickness (em)"}
                    </label>
                    <input type="number" min={1} max={30} step={0.5}
                      value={(wb as any)[field] ?? 3}
                      onChange={e => update(wb.id, field, +e.target.value)}
                      style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Opacity slider */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 3 }}>
                <span>Opacity</span>
                <span style={{ color: C.text }}>{((wb.opacity ?? 0.6) * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min={0.1} max={1} step={0.05}
                value={wb.opacity ?? 0.6}
                onChange={e => update(wb.id, "opacity", +e.target.value)}
                style={{ width: "100%", accentColor: C.blue }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

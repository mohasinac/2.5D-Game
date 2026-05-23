import { C } from "@/styles/theme";
import type { ArenaConfig, PitConfig, PitType } from "@/types/arenaConfigNew";
import SelfRotationPanel from "./SelfRotationPanel";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return `pit_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`; }

const DEFAULT_CRATER: Omit<PitConfig, "id"> = {
  type: "crater", position: { x: 0, y: 0 }, radius: 2.5,
  depth: 5, spinDamagePerSecond: 20, escapeChance: 0.5,
};
const DEFAULT_EDGE: Omit<PitConfig, "id"> = {
  type: "edge", position: { x: 0, y: 0 }, radius: 2,
  depth: 5, spinDamagePerSecond: 15, escapeChance: 0.6, edgeOffset: 1, angle: 0,
};

const STAT_FIELDS: { field: keyof PitConfig; label: string; min: number; max: number; step: number }[] = [
  { field: "radius", label: "Radius (em)", min: 0.5, max: 8, step: 0.5 },
  { field: "depth", label: "Visual Depth", min: 1, max: 10, step: 1 },
  { field: "spinDamagePerSecond", label: "Spin Damage/s", min: 5, max: 60, step: 5 },
  { field: "escapeChance", label: "Escape Chance", min: 0.1, max: 0.9, step: 0.1 },
];

export default function PitsTab({ config, onChange }: Props) {
  const pits = config.pits ?? [];

  const add = (type: PitType) => {
    if (pits.length >= 3) return;
    const base = type === "edge" ? DEFAULT_EDGE : DEFAULT_CRATER;
    onChange({ pits: [...pits, { ...base, id: makeId() }] });
  };

  const remove = (id: string) =>
    onChange({ pits: pits.filter(p => p.id !== id) });

  const update = (id: string, field: keyof PitConfig, value: any) =>
    onChange({ pits: pits.map(p => p.id === id ? { ...p, [field]: value } : p) });

  const updatePos = (id: string, axis: "x" | "y", value: number) =>
    onChange({ pits: pits.map(p => p.id === id ? { ...p, position: { ...p.position, [axis]: value } } : p) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{pits.length} / 3 pits</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => add("crater")} disabled={pits.length >= 3} style={{ padding: "5px 12px", background: C.bg3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: pits.length >= 3 ? 0.4 : 1 }}>
            + Crater
          </button>
          <button onClick={() => add("edge")} disabled={pits.length >= 3} style={{ padding: "5px 12px", background: C.bg3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: pits.length >= 3 ? 0.4 : 1 }}>
            + Edge Pit
          </button>
        </div>
      </div>

      {pits.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🕳️</div>
          <p>No pits yet. Pits trap beyblades, dealing spin damage until they escape.</p>
        </div>
      )}

      {pits.map((pit, idx) => (
        <div key={pit.id} style={{ background: C.bg3, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>🕳️ Pit #{idx + 1} — <span style={{ color: C.muted, textTransform: "capitalize" }}>{pit.type}</span></span>
            <button onClick={() => remove(pit.id)} style={{ color: C.red, background: "none", border: "none", fontSize: 12, cursor: "pointer" }}>Remove</button>
          </div>

          {/* Position */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {(["x", "y"] as const).map(axis => (
              <div key={axis}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                  <span>Pos {axis.toUpperCase()} (em)</span>
                  <span style={{ color: C.text, fontFamily: "monospace" }}>{pit.position?.[axis] ?? 0}</span>
                </div>
                <input type="range" min={-20} max={20} step={0.5}
                  value={pit.position?.[axis] ?? 0}
                  onChange={e => updatePos(pit.id, axis, +e.target.value)}
                  style={{ width: "100%", accentColor: C.muted }}
                />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {STAT_FIELDS.map(({ field, label, min, max, step }) => (
              <div key={field}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                  <span>{label}</span>
                  <span style={{ color: C.text, fontFamily: "monospace" }}>
                    {field === "escapeChance"
                      ? `${((pit as any)[field] ?? 0.5) * 100}%`
                      : (pit as any)[field] ?? min}
                  </span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={(pit as any)[field] ?? min}
                  onChange={e => update(pit.id, field, +e.target.value)}
                  style={{ width: "100%", accentColor: C.muted }}
                />
              </div>
            ))}
          </div>

          {/* Edge pit angle */}
          {pit.type === "edge" && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                <span>Edge Angle (°)</span>
                <span style={{ color: C.text, fontFamily: "monospace" }}>{pit.angle ?? 0}°</span>
              </div>
              <input type="range" min={0} max={359} step={5}
                value={pit.angle ?? 0}
                onChange={e => update(pit.id, "angle", +e.target.value)}
                style={{ width: "100%", accentColor: C.muted }}
              />
            </div>
          )}
          <SelfRotationPanel
            rotation={pit.rotation}
            selfRotation={pit.selfRotation}
            onChangeRotation={v => update(pit.id, "rotation" as any, v)}
            onChangeSelfRotation={v => update(pit.id, "selfRotation" as any, v)}
          />
        </div>
      ))}
    </div>
  );
}

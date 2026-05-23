import { C } from "@/styles/theme";
import type { ArenaConfig, PortalConfig } from "@/types/arenaConfigNew";
import SelfRotationPanel from "./SelfRotationPanel";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

const PORTAL_COLORS = ["#a855f7", "#06b6d4", "#10b981", "#f97316"];
const PORTAL_LABELS = ["Purple", "Cyan", "Green", "Orange"];

function makeId() { return `portal_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`; }

const DEFAULTS: Omit<PortalConfig, "id">[] = [
  { position: { x: -10, y: 0 }, radius: 3, cooldown: 2, color: PORTAL_COLORS[0] },
  { position: { x: 10,  y: 0 }, radius: 3, cooldown: 2, color: PORTAL_COLORS[1] },
  { position: { x: 0, y: -10 }, radius: 3, cooldown: 2, color: PORTAL_COLORS[2] },
  { position: { x: 0,  y: 10 }, radius: 3, cooldown: 2, color: PORTAL_COLORS[3] },
];

export default function PortalsTab({ config, onChange }: Props) {
  const portals = config.portals ?? [];

  const add = () => {
    if (portals.length >= 4) return;
    const idx = portals.length;
    onChange({ portals: [...portals, { ...DEFAULTS[idx], id: makeId() }] });
  };

  const remove = (id: string) =>
    onChange({ portals: portals.filter(p => p.id !== id) });

  const update = (id: string, field: keyof PortalConfig, value: any) =>
    onChange({ portals: portals.map(p => p.id === id ? { ...p, [field]: value } : p) });

  const updatePos = (id: string, axis: "x" | "y", value: number) =>
    onChange({ portals: portals.map(p => p.id === id ? { ...p, position: { ...p.position, [axis]: value } } : p) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{portals.length} / 4 portals — all portals are interconnected</span>
        <button onClick={add} disabled={portals.length >= 4} style={{ padding: "5px 14px", background: C.purple, color: C.white, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: portals.length >= 4 ? 0.4 : 1 }}>
          + Add Portal
        </button>
      </div>

      {portals.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌀</div>
          <p>No portals yet. Portals teleport beyblades to linked portals.</p>
        </div>
      )}

      {portals.map((portal, idx) => {
        const color = PORTAL_COLORS[idx % 4];
        return (
          <div key={portal.id} style={{ background: C.bg3, borderRadius: 12, padding: 16, border: `2px solid ${color}44` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color }}>
                🌀 Portal #{idx + 1} ({PORTAL_LABELS[idx % 4]})
              </span>
              <button onClick={() => remove(portal.id)} style={{ color: C.red, background: "none", border: "none", fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {(["x", "y"] as const).map(axis => (
                <div key={axis}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                    <span>Pos {axis.toUpperCase()} (em)</span>
                    <span style={{ color: C.text, fontFamily: "monospace" }}>{portal.position?.[axis] ?? 0}</span>
                  </div>
                  <input type="range" min={-20} max={20} step={0.5}
                    value={portal.position?.[axis] ?? 0}
                    onChange={e => updatePos(portal.id, axis, +e.target.value)}
                    style={{ width: "100%", accentColor: color }}
                  />
                </div>
              ))}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                  <span>Radius (em)</span>
                  <span style={{ color: C.text, fontFamily: "monospace" }}>{portal.radius ?? 3}</span>
                </div>
                <input type="range" min={1} max={8} step={0.5}
                  value={portal.radius ?? 3}
                  onChange={e => update(portal.id, "radius", +e.target.value)}
                  style={{ width: "100%", accentColor: color }}
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                  <span>Cooldown (s)</span>
                  <span style={{ color: C.text, fontFamily: "monospace" }}>{portal.cooldown ?? 2}</span>
                </div>
                <input type="range" min={0} max={10} step={0.5}
                  value={portal.cooldown ?? 2}
                  onChange={e => update(portal.id, "cooldown", +e.target.value)}
                  style={{ width: "100%", accentColor: color }}
                />
              </div>
            </div>
            <SelfRotationPanel
              rotation={(portal as any).rotation}
              selfRotation={(portal as any).selfRotation}
              onChangeRotation={v => update(portal.id, "rotation" as any, v)}
              onChangeSelfRotation={v => update(portal.id, "selfRotation" as any, v)}
            />
          </div>
        );
      })}

      {portals.length >= 2 && (
        <div style={{ background: C.bg3, borderRadius: 8, padding: 10, fontSize: 11, color: C.faint }}>
          All {portals.length} portals are connected. Entering any portal can teleport to any other portal.
        </div>
      )}
    </div>
  );
}

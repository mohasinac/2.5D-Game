// Z10a: Boundary tab — Shrink Config panel (arena battle-royale ring).

import { C } from "@/styles/theme";
import type { ArenaConfig } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (patch: Partial<ArenaConfig>) => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <label style={{ fontSize: 12, color: C.muted, minWidth: 160 }}>{label}</label>
      {children}
    </div>
  );
}

export default function BoundaryTab({ config, onChange }: Props) {
  const shrink = config.shrink;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Shrink Config */}
      <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>Shrinking Ring</h3>
          <input
            type="checkbox"
            checked={!!shrink}
            onChange={e => onChange({ shrink: e.target.checked ? { startMs: 60000, endMs: 180000, minRadiusFraction: 0.4, damageRatePerTick: 2 } : undefined })}
          />
        </div>

        {shrink && (
          <>
            <Row label="Start (ms after match)">
              <input
                type="number"
                value={shrink.startMs}
                min={0}
                step={5000}
                onChange={e => onChange({ shrink: { ...shrink, startMs: Number(e.target.value) } })}
                style={{ width: 100, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
              />
              <span style={{ fontSize: 11, color: C.muted }}>{(shrink.startMs / 1000).toFixed(0)}s</span>
            </Row>

            <Row label="End (ms)">
              <input
                type="number"
                value={shrink.endMs}
                min={shrink.startMs + 5000}
                step={5000}
                onChange={e => onChange({ shrink: { ...shrink, endMs: Number(e.target.value) } })}
                style={{ width: 100, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
              />
              <span style={{ fontSize: 11, color: C.muted }}>{(shrink.endMs / 1000).toFixed(0)}s</span>
            </Row>

            <Row label="Min radius fraction">
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={shrink.minRadiusFraction}
                onChange={e => onChange({ shrink: { ...shrink, minRadiusFraction: Number(e.target.value) } })}
                style={{ width: 120 }}
              />
              <span style={{ fontSize: 11, color: C.muted }}>{(shrink.minRadiusFraction * 100).toFixed(0)}%</span>
            </Row>

            <Row label="Damage per tick">
              <input
                type="number"
                value={shrink.damageRatePerTick ?? 2}
                min={0}
                max={20}
                step={0.5}
                onChange={e => onChange({ shrink: { ...shrink, damageRatePerTick: Number(e.target.value) } })}
                style={{ width: 80, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
              />
            </Row>

            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, fontSize: 11, color: C.muted, marginTop: 8 }}>
              Ring starts shrinking at <strong style={{ color: C.text }}>{(shrink.startMs / 1000).toFixed(0)}s</strong>,
              reaches {(shrink.minRadiusFraction * 100).toFixed(0)}% size by <strong style={{ color: C.text }}>{(shrink.endMs / 1000).toFixed(0)}s</strong>.
              Beys outside take <strong style={{ color: C.text }}>{shrink.damageRatePerTick ?? 2} HP/tick</strong>.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Shared RotationBlock editor — used by ObstaclesTab, TurretsTab, SwitchesTab.
// RotationBlock controls how a placed feature's base orientation behaves (not self-spin).

import { C } from "@/styles/theme";
import type { RotationBlock } from "@/types/arenaConfigNew";

interface Props {
  value?: RotationBlock;
  onChange: (v: RotationBlock | undefined) => void;
  label?: string;
}

type Mode = RotationBlock["mode"];

const MODES: { value: Mode; label: string }[] = [
  { value: "static",         label: "Static" },
  { value: "auto",           label: "Auto Spin" },
  { value: "linked-to-arena",label: "Arena Linked" },
  { value: "intervaled",     label: "Intervaled" },
  { value: "partial-swept",  label: "Partial Sweep" },
];

function numInput(val: number | undefined, def: number, onChange: (n: number) => void, step = 1) {
  return (
    <input
      type="number"
      value={val ?? def}
      step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: 80, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
    />
  );
}

export default function RotationBlockEditor({ value, onChange, label = "Rotation" }: Props) {
  const enabled = !!value;

  function enable() {
    onChange({ mode: "static", initialAngleDeg: 0 });
  }
  function disable() {
    onChange(undefined);
  }
  function patch(delta: Partial<RotationBlock>) {
    if (!value) return;
    onChange({ ...value, ...delta } as RotationBlock);
  }

  const mode = value?.mode ?? "static";
  const showSpin = mode === "auto" || mode === "intervaled" || mode === "partial-swept";

  return (
    <div style={{ marginTop: 10, padding: 10, background: C.bg2, borderRadius: 8, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: enabled ? 10 : 0 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>{label}</label>
        <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: C.muted, cursor: "pointer" }}>
          <input type="checkbox" checked={enabled} onChange={e => e.target.checked ? enable() : disable()} />
          {enabled ? "Enabled" : "Disabled"}
        </label>
      </div>

      {enabled && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Mode buttons */}
          <div>
            <div style={{ fontSize: 11, color: C.faint, marginBottom: 4 }}>Mode</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {MODES.map(m => (
                <button
                  key={m.value}
                  onClick={() => patch({ mode: m.value })}
                  style={{
                    padding: "3px 9px", borderRadius: 5, fontSize: 11, cursor: "pointer",
                    background: mode === m.value ? C.blue : "transparent",
                    color: mode === m.value ? C.white : C.muted,
                    border: `1px solid ${mode === m.value ? C.blue : C.border}`,
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Initial angle — all modes */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Initial Angle (°)</label>
            {numInput(value.initialAngleDeg, 0, v => patch({ initialAngleDeg: v }), 5)}
          </div>

          {/* Spin speed + direction + space */}
          {showSpin && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                    <span>Speed (°/s)</span>
                    <span style={{ color: C.text, fontFamily: "monospace" }}>{value.speedDegPerSec ?? 45}</span>
                  </div>
                  <input type="range" min={1} max={720} step={5}
                    value={value.speedDegPerSec ?? 45}
                    onChange={e => patch({ speedDegPerSec: +e.target.value })}
                    style={{ width: "100%", accentColor: C.blue }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.faint, marginBottom: 4 }}>Direction</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {(["cw", "ccw", "alternating"] as const).map(d => (
                      <button key={d} onClick={() => patch({ direction: d })}
                        style={{ padding: "2px 7px", borderRadius: 5, fontSize: 11, cursor: "pointer",
                          background: (value.direction ?? "cw") === d ? C.blue : "transparent",
                          color: (value.direction ?? "cw") === d ? C.white : C.muted,
                          border: `1px solid ${(value.direction ?? "cw") === d ? C.blue : C.border}` }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>Space</label>
                {(["local", "world"] as const).map(s => (
                  <button key={s} onClick={() => patch({ space: s })}
                    style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, cursor: "pointer",
                      background: (value.space ?? "local") === s ? C.blue : "transparent",
                      color: (value.space ?? "local") === s ? C.white : C.muted,
                      border: `1px solid ${(value.space ?? "local") === s ? C.blue : C.border}` }}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Intervaled params */}
          {mode === "intervaled" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Active (ms)</label>
                {numInput(value.intervalOn?.activeMs, 1000, v => patch({ intervalOn: { ...(value.intervalOn ?? { activeMs: 1000, pauseMs: 1000 }), activeMs: v } }), 100)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Pause (ms)</label>
                {numInput(value.intervalOn?.pauseMs, 1000, v => patch({ intervalOn: { ...(value.intervalOn ?? { activeMs: 1000, pauseMs: 1000 }), pauseMs: v } }), 100)}
              </div>
            </div>
          )}

          {/* Partial-swept params */}
          {mode === "partial-swept" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>From (°)</label>
                {numInput(value.partialSweep?.fromDeg, 0, v => patch({ partialSweep: { ...(value.partialSweep ?? { fromDeg: 0, toDeg: 90, cycleMs: 2000 }), fromDeg: v } }), 5)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 40 }}>To (°)</label>
                {numInput(value.partialSweep?.toDeg, 90, v => patch({ partialSweep: { ...(value.partialSweep ?? { fromDeg: 0, toDeg: 90, cycleMs: 2000 }), toDeg: v } }), 5)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Cycle (ms)</label>
                {numInput(value.partialSweep?.cycleMs, 2000, v => patch({ partialSweep: { ...(value.partialSweep ?? { fromDeg: 0, toDeg: 90, cycleMs: 2000 }), cycleMs: v } }), 100)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

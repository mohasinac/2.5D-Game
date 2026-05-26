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
      className="w-20 bg-bg1 border border-border text-text rounded-md py-1 px-2 text-xs"
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
    <div className="mt-2.5 p-2.5 bg-bg2 rounded-lg border border-border">
      <div className={`flex items-center justify-between ${enabled ? "mb-2.5" : ""}`}>
        <label className="text-[11px] font-semibold text-muted">{label}</label>
        <label className="flex gap-1.5 items-center text-[11px] text-muted cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={e => e.target.checked ? enable() : disable()} />
          {enabled ? "Enabled" : "Disabled"}
        </label>
      </div>

      {enabled && (
        <div className="flex flex-col gap-2">
          {/* Mode buttons */}
          <div>
            <div className="text-[11px] text-faint mb-1">Mode</div>
            <div className="flex gap-1 flex-wrap">
              {MODES.map(m => (
                <button
                  key={m.value}
                  onClick={() => patch({ mode: m.value })}
                  className="py-[3px] px-[9px] rounded text-[11px] cursor-pointer border"
                  style={{
                    background: mode === m.value ? C.blue : "transparent",
                    color: mode === m.value ? C.white : C.muted,
                    borderColor: mode === m.value ? C.blue : C.border,
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Initial angle — all modes */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-faint min-w-[110px]">Initial Angle (°)</label>
            {numInput(value.initialAngleDeg, 0, v => patch({ initialAngleDeg: v }), 5)}
          </div>

          {/* Spin speed + direction + space */}
          {showSpin && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-[11px] text-faint mb-0.5">
                    <span>Speed (°/s)</span>
                    <span className="text-text font-mono">{value.speedDegPerSec ?? 45}</span>
                  </div>
                  <input type="range" min={1} max={720} step={5}
                    value={value.speedDegPerSec ?? 45}
                    onChange={e => patch({ speedDegPerSec: +e.target.value })}
                    className="w-full"
                    style={{ accentColor: C.blue }}
                  />
                </div>
                <div>
                  <div className="text-[11px] text-faint mb-1">Direction</div>
                  <div className="flex gap-1">
                    {(["cw", "ccw", "alternating"] as const).map(d => (
                      <button key={d} onClick={() => patch({ direction: d })}
                        className="py-[2px] px-[7px] rounded text-[11px] cursor-pointer border"
                        style={{
                          background: (value.direction ?? "cw") === d ? C.blue : "transparent",
                          color: (value.direction ?? "cw") === d ? C.white : C.muted,
                          borderColor: (value.direction ?? "cw") === d ? C.blue : C.border,
                        }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-faint min-w-[50px]">Space</label>
                {(["local", "world"] as const).map(s => (
                  <button key={s} onClick={() => patch({ space: s })}
                    className="py-[2px] px-2 rounded text-[11px] cursor-pointer border"
                    style={{
                      background: (value.space ?? "local") === s ? C.blue : "transparent",
                      color: (value.space ?? "local") === s ? C.white : C.muted,
                      borderColor: (value.space ?? "local") === s ? C.blue : C.border,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Intervaled params */}
          {mode === "intervaled" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-faint min-w-[70px]">Active (ms)</label>
                {numInput(value.intervalOn?.activeMs, 1000, v => patch({ intervalOn: { ...(value.intervalOn ?? { activeMs: 1000, pauseMs: 1000 }), activeMs: v } }), 100)}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-faint min-w-[70px]">Pause (ms)</label>
                {numInput(value.intervalOn?.pauseMs, 1000, v => patch({ intervalOn: { ...(value.intervalOn ?? { activeMs: 1000, pauseMs: 1000 }), pauseMs: v } }), 100)}
              </div>
            </div>
          )}

          {/* Partial-swept params */}
          {mode === "partial-swept" && (
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] text-faint min-w-[50px]">From (°)</label>
                {numInput(value.partialSweep?.fromDeg, 0, v => patch({ partialSweep: { ...(value.partialSweep ?? { fromDeg: 0, toDeg: 90, cycleMs: 2000 }), fromDeg: v } }), 5)}
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] text-faint min-w-[40px]">To (°)</label>
                {numInput(value.partialSweep?.toDeg, 90, v => patch({ partialSweep: { ...(value.partialSweep ?? { fromDeg: 0, toDeg: 90, cycleMs: 2000 }), toDeg: v } }), 5)}
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] text-faint min-w-[60px]">Cycle (ms)</label>
                {numInput(value.partialSweep?.cycleMs, 2000, v => patch({ partialSweep: { ...(value.partialSweep ?? { fromDeg: 0, toDeg: 90, cycleMs: 2000 }), cycleMs: v } }), 100)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

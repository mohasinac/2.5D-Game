// Reusable self-rotation config editor for positioned arena features.
// Used in ObstaclesTab, TurretsTab, FeaturesTab, PortalsTab, WaterBodiesTab.

import { C } from "@/styles/theme";
import type { SelfRotationConfig, SelfRotationType } from "@/types/arenaConfigNew";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

interface Props {
  rotation?: number;           // initial sprite orientation in degrees
  selfRotation?: SelfRotationConfig;
  onChangeRotation: (deg: number | undefined) => void;
  onChangeSelfRotation: (cfg: SelfRotationConfig | undefined) => void;
}

const ROTATION_TYPES: { value: SelfRotationType; label: string; desc: string }[] = [
  { value: "permanent", label: "Permanent", desc: "Spins for the whole match" },
  { value: "temporary", label: "Temporary", desc: "Spins for a set duration then stops" },
  { value: "once",      label: "Once",      desc: "Fires once at match start then stops" },
  { value: "pulsed",    label: "Pulsed",    desc: "Alternates on/off in cycles" },
  { value: "oscillate", label: "Oscillate", desc: "Sweeps N° clockwise then returns (pendulum/cyclic)" },
];

export default function SelfRotationPanel({ rotation, selfRotation, onChangeRotation, onChangeSelfRotation }: Props) {
  const enabled = !!selfRotation;
  const rotType: SelfRotationType = selfRotation?.type ?? "permanent";

  function patch(delta: Partial<SelfRotationConfig>) {
    if (!selfRotation) return;
    onChangeSelfRotation({ ...selfRotation, ...delta });
  }

  return (
    <div className="mt-2.5 pt-2.5 border-t border-border">
      <div className="text-[11px] text-faint font-semibold uppercase mb-2">
        Rotation
      </div>

      {/* Initial orientation */}
      <div className="flex items-center gap-2 mb-2">
        <label className="text-xs text-muted min-w-[100px]">Initial angle (°)</label>
        <input
          type="number"
          value={rotation ?? 0}
          min={0} max={359} step={1}
          onChange={e => onChangeRotation(+e.target.value || undefined)}
          className="w-[70px] bg-bg2 border border-border text-text rounded-md py-[3px] px-1.5 text-xs"
        />
        <span className="text-[11px] text-faint">0° = up / north</span>
      </div>

      {/* Self-rotation toggle */}
      <div className="flex items-center gap-2" style={{ marginBottom: enabled ? 8 : 0 }}>
        <label className="text-xs text-muted min-w-[100px]">Continuous spin</label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onChangeSelfRotation(e.target.checked ? { speedDegPerSec: 30, direction: "cw", type: "permanent" } : undefined)}
        />
        <span className="text-xs text-muted">{enabled ? "Enabled" : "Off"}</span>
      </div>

      {enabled && selfRotation && (
        <div className="flex flex-col gap-2.5 pl-2">

          {/* Speed / Direction / Space row */}
          <div className="grid grid-cols-3 gap-2">
            {/* Speed */}
            <div>
              <div className="flex justify-between text-[11px] text-faint mb-0.5">
                <span>Speed (°/s)</span>
                <span className="text-text font-mono">{selfRotation.speedDegPerSec}</span>
              </div>
              <input
                type="range" min={1} max={360} step={1}
                value={selfRotation.speedDegPerSec}
                onChange={e => patch({ speedDegPerSec: +e.target.value })}
                className="w-full"
                style={{ accentColor: C.blue }}
              />
            </div>

            {/* Direction */}
            <div>
              <div className="text-[11px] text-faint mb-1">Direction</div>
              <div className="flex gap-1.5">
                {(["cw", "ccw"] as const).map(dir => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => patch({ direction: dir })}
                    className="flex-1 py-1 rounded-md text-[11px] cursor-pointer border"
                    style={{
                      background: selfRotation.direction === dir ? C.blue : C.bg2,
                      color: selfRotation.direction === dir ? "#fff" : C.muted,
                      borderColor: selfRotation.direction === dir ? C.blue : C.border,
                    }}
                  >
                    {dir === "cw" ? "↻ CW" : "↺ CCW"}
                  </button>
                ))}
              </div>
            </div>

            {/* Space */}
            <div>
              <div className="text-[11px] text-faint mb-1">Space</div>
              <SearchableSelect
                value={selfRotation.space ?? "local"}
                options={[
                  { value: "local", label: "Local (rotates with arena)" },
                  { value: "world", label: "World (fixed in space)" },
                ]}
                onChange={v => patch({ space: v as "local" | "world" })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Lifecycle type */}
          <div>
            <div className="text-[11px] text-faint mb-1.5">Lifecycle</div>
            <div className="flex gap-1.5 flex-wrap">
              {ROTATION_TYPES.map(rt => (
                <button
                  key={rt.value}
                  type="button"
                  onClick={() => patch({ type: rt.value })}
                  title={rt.desc}
                  className="py-1 px-2.5 rounded-md text-[11px] cursor-pointer border"
                  style={{
                    background: rotType === rt.value ? C.blue : C.bg2,
                    color: rotType === rt.value ? "#fff" : C.muted,
                    borderColor: rotType === rt.value ? C.blue : C.border,
                  }}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional timing fields */}
          {rotType === "temporary" && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted min-w-[110px]">Duration (ms)</label>
              <input
                type="number" min={100} step={100}
                value={selfRotation.temporaryDurationMs ?? 3000}
                onChange={e => patch({ temporaryDurationMs: +e.target.value })}
                className="w-[90px] bg-bg2 border border-border text-text rounded-md py-[3px] px-1.5 text-xs"
              />
              <span className="text-[11px] text-faint">then stops</span>
            </div>
          )}

          {rotType === "once" && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted min-w-[110px]">Start delay (ms)</label>
              <input
                type="number" min={0} step={100}
                value={selfRotation.onceFiredAtStartMs ?? 0}
                onChange={e => patch({ onceFiredAtStartMs: +e.target.value })}
                className="w-[90px] bg-bg2 border border-border text-text rounded-md py-[3px] px-1.5 text-xs"
              />
              <span className="text-[11px] text-faint">delay from match start</span>
            </div>
          )}

          {rotType === "pulsed" && (
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted min-w-[70px]">On (ms)</label>
                <input
                  type="number" min={100} step={100}
                  value={selfRotation.pulsedActiveMs ?? 1000}
                  onChange={e => patch({ pulsedActiveMs: +e.target.value })}
                  className="w-20 bg-bg2 border border-border text-text rounded-md py-[3px] px-1.5 text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted min-w-[70px]">Off (ms)</label>
                <input
                  type="number" min={100} step={100}
                  value={selfRotation.pulsedPauseMs ?? 1000}
                  onChange={e => patch({ pulsedPauseMs: +e.target.value })}
                  className="w-20 bg-bg2 border border-border text-text rounded-md py-[3px] px-1.5 text-xs"
                />
              </div>
            </div>
          )}

          {rotType === "oscillate" && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted min-w-[70px]">From (°)</label>
                  <input
                    type="number" min={-360} max={360} step={1}
                    value={selfRotation.oscillateFromDeg ?? 0}
                    onChange={e => patch({ oscillateFromDeg: +e.target.value })}
                    className="w-[70px] bg-bg2 border border-border text-text rounded-md py-[3px] px-1.5 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted min-w-[70px]">To (°)</label>
                  <input
                    type="number" min={-360} max={360} step={1}
                    value={selfRotation.oscillateToDeg ?? 20}
                    onChange={e => patch({ oscillateToDeg: +e.target.value })}
                    className="w-[70px] bg-bg2 border border-border text-text rounded-md py-[3px] px-1.5 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted min-w-[80px]">Sweep (ms)</label>
                  <input
                    type="number" min={0} step={50}
                    value={selfRotation.oscillateSweepMs ?? 0}
                    onChange={e => patch({ oscillateSweepMs: +e.target.value || undefined })}
                    className="w-[70px] bg-bg2 border border-border text-text rounded-md py-[3px] px-1.5 text-xs"
                  />
                  <span className="text-[10px] text-faint">0 = auto</span>
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={selfRotation.oscillateReturn !== false}
                  onChange={e => patch({ oscillateReturn: e.target.checked })}
                  style={{ accentColor: C.blue }}
                />
                Return to origin (pendulum) — uncheck to snap back instantly
              </label>
              <span className="text-[10px] text-faint">
                e.g. 0° → 20°: rotates 20° clockwise then returns. Angle is relative to initial placement.
              </span>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

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
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>
        Rotation
      </div>

      {/* Initial orientation */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: C.muted, minWidth: 100 }}>Initial angle (°)</label>
        <input
          type="number"
          value={rotation ?? 0}
          min={0} max={359} step={1}
          onChange={e => onChangeRotation(+e.target.value || undefined)}
          style={{ width: 70, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
        />
        <span style={{ fontSize: 11, color: C.faint }}>0° = up / north</span>
      </div>

      {/* Self-rotation toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: enabled ? 8 : 0 }}>
        <label style={{ fontSize: 12, color: C.muted, minWidth: 100 }}>Continuous spin</label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onChangeSelfRotation(e.target.checked ? { speedDegPerSec: 30, direction: "cw", type: "permanent" } : undefined)}
        />
        <span style={{ fontSize: 12, color: C.muted }}>{enabled ? "Enabled" : "Off"}</span>
      </div>

      {enabled && selfRotation && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 8 }}>

          {/* Speed / Direction / Space row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {/* Speed */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                <span>Speed (°/s)</span>
                <span style={{ color: C.text, fontFamily: "monospace" }}>{selfRotation.speedDegPerSec}</span>
              </div>
              <input
                type="range" min={1} max={360} step={1}
                value={selfRotation.speedDegPerSec}
                onChange={e => patch({ speedDegPerSec: +e.target.value })}
                style={{ width: "100%", accentColor: C.blue }}
              />
            </div>

            {/* Direction */}
            <div>
              <div style={{ fontSize: 11, color: C.faint, marginBottom: 4 }}>Direction</div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["cw", "ccw"] as const).map(dir => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => patch({ direction: dir })}
                    style={{
                      flex: 1, padding: "4px 0", borderRadius: 6, fontSize: 11, cursor: "pointer",
                      background: selfRotation.direction === dir ? C.blue : C.bg2,
                      color: selfRotation.direction === dir ? "#fff" : C.muted,
                      border: `1px solid ${selfRotation.direction === dir ? C.blue : C.border}`,
                    }}
                  >
                    {dir === "cw" ? "↻ CW" : "↺ CCW"}
                  </button>
                ))}
              </div>
            </div>

            {/* Space */}
            <div>
              <div style={{ fontSize: 11, color: C.faint, marginBottom: 4 }}>Space</div>
              <SearchableSelect
                value={selfRotation.space ?? "local"}
                options={[
                  { value: "local", label: "Local (rotates with arena)" },
                  { value: "world", label: "World (fixed in space)" },
                ]}
                onChange={v => patch({ space: v as "local" | "world" })}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 6px", fontSize: 11 }}
              />
            </div>
          </div>

          {/* Lifecycle type */}
          <div>
            <div style={{ fontSize: 11, color: C.faint, marginBottom: 6 }}>Lifecycle</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ROTATION_TYPES.map(rt => (
                <button
                  key={rt.value}
                  type="button"
                  onClick={() => patch({ type: rt.value })}
                  title={rt.desc}
                  style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                    background: rotType === rt.value ? C.blue : C.bg2,
                    color: rotType === rt.value ? "#fff" : C.muted,
                    border: `1px solid ${rotType === rt.value ? C.blue : C.border}`,
                  }}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional timing fields */}
          {rotType === "temporary" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 12, color: C.muted, minWidth: 110 }}>Duration (ms)</label>
              <input
                type="number" min={100} step={100}
                value={selfRotation.temporaryDurationMs ?? 3000}
                onChange={e => patch({ temporaryDurationMs: +e.target.value })}
                style={{ width: 90, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
              />
              <span style={{ fontSize: 11, color: C.faint }}>then stops</span>
            </div>
          )}

          {rotType === "once" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 12, color: C.muted, minWidth: 110 }}>Start delay (ms)</label>
              <input
                type="number" min={0} step={100}
                value={selfRotation.onceFiredAtStartMs ?? 0}
                onChange={e => patch({ onceFiredAtStartMs: +e.target.value })}
                style={{ width: 90, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
              />
              <span style={{ fontSize: 11, color: C.faint }}>delay from match start</span>
            </div>
          )}

          {rotType === "pulsed" && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 12, color: C.muted, minWidth: 70 }}>On (ms)</label>
                <input
                  type="number" min={100} step={100}
                  value={selfRotation.pulsedActiveMs ?? 1000}
                  onChange={e => patch({ pulsedActiveMs: +e.target.value })}
                  style={{ width: 80, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 12, color: C.muted, minWidth: 70 }}>Off (ms)</label>
                <input
                  type="number" min={100} step={100}
                  value={selfRotation.pulsedPauseMs ?? 1000}
                  onChange={e => patch({ pulsedPauseMs: +e.target.value })}
                  style={{ width: 80, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
                />
              </div>
            </div>
          )}

          {rotType === "oscillate" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: 12, color: C.muted, minWidth: 70 }}>From (°)</label>
                  <input
                    type="number" min={-360} max={360} step={1}
                    value={selfRotation.oscillateFromDeg ?? 0}
                    onChange={e => patch({ oscillateFromDeg: +e.target.value })}
                    style={{ width: 70, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: 12, color: C.muted, minWidth: 70 }}>To (°)</label>
                  <input
                    type="number" min={-360} max={360} step={1}
                    value={selfRotation.oscillateToDeg ?? 20}
                    onChange={e => patch({ oscillateToDeg: +e.target.value })}
                    style={{ width: 70, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: 12, color: C.muted, minWidth: 80 }}>Sweep (ms)</label>
                  <input
                    type="number" min={0} step={50}
                    value={selfRotation.oscillateSweepMs ?? 0}
                    onChange={e => patch({ oscillateSweepMs: +e.target.value || undefined })}
                    style={{ width: 70, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
                  />
                  <span style={{ fontSize: 10, color: C.faint }}>0 = auto</span>
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={selfRotation.oscillateReturn !== false}
                  onChange={e => patch({ oscillateReturn: e.target.checked })}
                  style={{ accentColor: C.blue }}
                />
                Return to origin (pendulum) — uncheck to snap back instantly
              </label>
              <span style={{ fontSize: 10, color: C.faint }}>
                e.g. 0° → 20°: rotates 20° clockwise then returns. Angle is relative to initial placement.
              </span>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

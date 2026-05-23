// Reusable "Part-Driven Rotation" editor section.
// Used by PartEditor (Overview tab) and ContactPointEditor (per-CP panel).

import { C } from "@/styles/theme";
import type {
  PartSelfRotation,
  PartRotationType,
  PartRotationAxisType,
  PartRotationAxis,
} from "@/types/beybladeSystem";

// ─── Metadata ────────────────────────────────────────────────────────────────

const ROT_TYPES: { value: PartRotationType; label: string; desc: string }[] = [
  { value: "permanent",  label: "Permanent",  desc: "Spins for the whole match" },
  { value: "interval",   label: "Interval",   desc: "Alternates on/off cycles" },
  { value: "once",       label: "Once",       desc: "Fires once at match start then stops" },
  { value: "pulsed",     label: "Pulsed",     desc: "Short burst on collision or timer" },
  { value: "oscillate",  label: "Oscillate",  desc: "Sweeps between two angles and returns (partial rotation)" },
];

const AXIS_TYPES: { value: PartRotationAxisType; label: string; desc: string }[] = [
  { value: "spin_axis",  label: "Spin Axis",  desc: "Same axis as beyblade spin (Z-up)" },
  { value: "radial",     label: "Radial",     desc: "Points outward from center; part rolls around the circumference" },
  { value: "tangential", label: "Tangential", desc: "In-plane, perpendicular to radial; flipper/kick motion" },
  { value: "arc_pivot",  label: "Arc Pivot",  desc: "Pivot at a specific point on the contact-point arc; set pivot angle, pivot radius, and arm length" },
  { value: "custom",     label: "Custom",     desc: "Arbitrary euler angles in part-local space" },
];

// ─── Small helpers ────────────────────────────────────────────────────────────

function NumInput({ label, value, min, max, step = 1, unit, onChange }: {
  label: string; value: number; min?: number; max?: number; step?: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>{label}</label>
      <input
        type="number" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{ width: 80, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
      />
      {unit && <span style={{ fontSize: 11, color: C.faint }}>{unit}</span>}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  value: PartSelfRotation | null;
  onChange: (v: PartSelfRotation | null) => void;
  heading?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PartSelfRotationSection({ value, onChange, heading = "Part-Driven Rotation" }: Props) {
  const enabled = value !== null;
  const sr = value;
  const rotType: PartRotationType = sr?.type ?? "permanent";
  const axisType: PartRotationAxisType = sr?.axis?.type ?? "spin_axis";

  function patch(delta: Partial<PartSelfRotation>) {
    if (!sr) return;
    onChange({ ...sr, ...delta });
  }

  function patchAxis(delta: Partial<PartRotationAxis>) {
    if (!sr) return;
    onChange({ ...sr, axis: { ...(sr.axis ?? { type: "spin_axis" }), ...delta } });
  }

  return (
    <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>{heading}</div>

      {/* Enable toggle */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.text, cursor: "pointer", marginBottom: enabled ? 12 : 0 }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onChange(e.target.checked
            ? { type: "permanent", speedDegPerSec: 90, direction: "cw", axis: { type: "spin_axis" } }
            : null)}
          style={{ accentColor: C.blue, width: 16, height: 16 }}
        />
        <span>Has own motor / rotation</span>
        <span style={{ fontSize: 11, color: C.faint }}>(independent of bey spin axis)</span>
      </label>

      {enabled && sr && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 4 }}>

          {/* ── Speed + Direction ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                <span>Speed (°/s)</span>
                <span style={{ color: C.text, fontFamily: "monospace" }}>{sr.speedDegPerSec}</span>
              </div>
              <input
                type="range" min={1} max={1800} step={1}
                value={sr.speedDegPerSec}
                onChange={e => patch({ speedDegPerSec: +e.target.value })}
                style={{ width: "100%", accentColor: C.blue }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.faint, marginBottom: 4 }}>Direction</div>
              <div style={{ display: "flex", gap: 5 }}>
                {(["cw", "ccw", "alternating"] as const).map(dir => (
                  <button key={dir} type="button" onClick={() => patch({ direction: dir })}
                    style={{
                      flex: 1, padding: "4px 0", borderRadius: 6, fontSize: 10, cursor: "pointer",
                      background: sr.direction === dir ? C.blue : C.bg2,
                      color: sr.direction === dir ? "#fff" : C.muted,
                      border: `1px solid ${sr.direction === dir ? C.blue : C.border}`,
                    }}
                  >
                    {dir === "cw" ? "↻ CW" : dir === "ccw" ? "↺ CCW" : "⇄ Alt"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Lifecycle type ── */}
          <div>
            <div style={{ fontSize: 11, color: C.faint, marginBottom: 5 }}>Lifecycle</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {ROT_TYPES.map(rt => (
                <button key={rt.value} type="button" onClick={() => patch({ type: rt.value })} title={rt.desc}
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

          {/* ── Lifecycle-specific timing fields ── */}
          {rotType === "interval" && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <NumInput label="On" value={sr.intervalActiveMs ?? 1000} min={50} step={50} unit="ms" onChange={v => patch({ intervalActiveMs: v })} />
              <NumInput label="Pause" value={sr.intervalPauseMs ?? 1000} min={50} step={50} unit="ms" onChange={v => patch({ intervalPauseMs: v })} />
            </div>
          )}

          {rotType === "once" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <NumInput label="Duration" value={sr.onceDurationMs ?? 2000} min={100} step={100} unit="ms" onChange={v => patch({ onceDurationMs: v })} />
              <span style={{ fontSize: 11, color: C.faint }}>fires once then stops</span>
            </div>
          )}

          {rotType === "pulsed" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text, cursor: "pointer" }}>
                <input type="checkbox" checked={sr.pulseOnCollision ?? false}
                  onChange={e => patch({ pulseOnCollision: e.target.checked })}
                  style={{ accentColor: C.blue }} />
                Trigger pulse on collision
              </label>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <NumInput label="Pulse" value={sr.pulseDurationMs ?? 300} min={50} step={50} unit="ms" onChange={v => patch({ pulseDurationMs: v })} />
                <NumInput label="Cooldown" value={sr.pulseCooldownMs ?? 1000} min={100} step={100} unit="ms" onChange={v => patch({ pulseCooldownMs: v })} />
              </div>
            </div>
          )}

          {rotType === "oscillate" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <NumInput label="Sweep from" value={sr.sweepFromDeg ?? 0} min={-360} max={360} unit="°" onChange={v => patch({ sweepFromDeg: v })} />
                <NumInput label="Sweep to" value={sr.sweepToDeg ?? 45} min={-360} max={360} unit="°" onChange={v => patch({ sweepToDeg: v })} />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text, cursor: "pointer" }}>
                  <input type="checkbox" checked={sr.oscillateReturn !== false}
                    onChange={e => patch({ oscillateReturn: e.target.checked })}
                    style={{ accentColor: C.blue }} />
                  Return to origin (oscillate)
                </label>
                <NumInput label="Sweep duration" value={sr.sweepDurationMs ?? 0} min={0} step={50} unit="ms"
                  onChange={v => patch({ sweepDurationMs: v || undefined })} />
                <span style={{ fontSize: 10, color: C.faint }}>(0 = auto from speed)</span>
              </div>
            </div>
          )}

          {/* ── Rotation axis ── */}
          <div>
            <div style={{ fontSize: 11, color: C.faint, marginBottom: 5 }}>Rotation Axis</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
              {AXIS_TYPES.map(at => (
                <button key={at.value} type="button" onClick={() => patchAxis({ type: at.value })} title={at.desc}
                  style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                    background: axisType === at.value ? C.purple : C.bg2,
                    color: axisType === at.value ? "#fff" : C.muted,
                    border: `1px solid ${axisType === at.value ? C.purple : C.border}`,
                  }}
                >
                  {at.label}
                </button>
              ))}
            </div>

            {/* arc_pivot: pivot positioned on the curvature */}
            {axisType === "arc_pivot" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 4, paddingTop: 6, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 2 }}>
                  Pivot is placed at a point on the contact-point arc. The arm swings around that pivot.
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <NumInput label="Pivot angle" value={sr.axis?.pivotAngleDeg ?? 0} min={0} max={360} unit="°"
                    onChange={v => patchAxis({ pivotAngleDeg: v })} />
                  <NumInput label="Pivot radius" value={sr.axis?.pivotRadiusMm ?? 20} min={0} step={0.5} unit="mm"
                    onChange={v => patchAxis({ pivotRadiusMm: v })} />
                  <NumInput label="Arm length" value={sr.axis?.motionRadiusMm ?? 5} min={0.1} step={0.5} unit="mm"
                    onChange={v => patchAxis({ motionRadiusMm: v })} />
                </div>
                <span style={{ fontSize: 10, color: C.faint }}>
                  Pivot angle: where on the arc the hinge sits · Pivot radius: how far from part center · Arm length: how far the tip moves
                </span>
              </div>
            )}

            {/* custom: euler angles */}
            {axisType === "custom" && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingLeft: 4 }}>
                {(["customX", "customY", "customZ"] as const).map(field => (
                  <div key={field} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <label style={{ fontSize: 11, color: C.muted, minWidth: 16 }}>{field.slice(-1).toUpperCase()} °</label>
                    <input
                      type="number" min={-180} max={180} step={1}
                      value={sr.axis?.[field] ?? 0}
                      onChange={e => patchAxis({ [field]: +e.target.value })}
                      style={{ width: 70, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 12 }}
                    />
                  </div>
                ))}
                <span style={{ fontSize: 10, color: C.faint, alignSelf: "center" }}>local-space euler</span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

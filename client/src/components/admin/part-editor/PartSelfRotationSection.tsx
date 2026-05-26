// Reusable "Part-Driven Rotation" editor section.
// Used by PartEditor (Overview tab) and ContactPointEditor (per-CP panel).

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
    <div className="flex items-center gap-1.5">
      <label className="text-[12px] text-muted whitespace-nowrap">{label}</label>
      <input
        type="number" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-20 bg-bg2 border border-border text-text rounded-[6px] px-1.5 py-[3px] text-[12px]"
      />
      {unit && <span className="text-[11px] text-faint">{unit}</span>}
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
    <div className="pt-3.5 border-t border-border">
      <div className="text-[12px] text-muted mb-2 font-semibold">{heading}</div>

      {/* Enable toggle */}
      <label className={`flex items-center gap-2 text-[13px] text-text cursor-pointer ${enabled ? "mb-3" : ""}`}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onChange(e.target.checked
            ? { type: "permanent", speedDegPerSec: 90, direction: "cw", axis: { type: "spin_axis" } }
            : null)}
          className="accent-blue w-4 h-4"
        />
        <span>Has own motor / rotation</span>
        <span className="text-[11px] text-faint">(independent of bey spin axis)</span>
      </label>

      {enabled && sr && (
        <div className="flex flex-col gap-3 pl-1">

          {/* ── Speed + Direction ── */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <div className="flex justify-between text-[11px] text-faint mb-0.5">
                <span>Speed (°/s)</span>
                <span className="text-text font-mono">{sr.speedDegPerSec}</span>
              </div>
              <input
                type="range" min={1} max={1800} step={1}
                value={sr.speedDegPerSec}
                onChange={e => patch({ speedDegPerSec: +e.target.value })}
                className="w-full accent-blue"
              />
            </div>
            <div>
              <div className="text-[11px] text-faint mb-1">Direction</div>
              <div className="flex gap-[5px]">
                {(["cw", "ccw", "alternating"] as const).map(dir => (
                  <button key={dir} type="button" onClick={() => patch({ direction: dir })}
                    className={`flex-1 py-1 rounded-[6px] text-[10px] cursor-pointer border ${
                      sr.direction === dir
                        ? "bg-blue text-white border-blue"
                        : "bg-bg2 text-muted border-border"
                    }`}
                  >
                    {dir === "cw" ? "↻ CW" : dir === "ccw" ? "↺ CCW" : "⇄ Alt"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Lifecycle type ── */}
          <div>
            <div className="text-[11px] text-faint mb-[5px]">Lifecycle</div>
            <div className="flex gap-[5px] flex-wrap">
              {ROT_TYPES.map(rt => (
                <button key={rt.value} type="button" onClick={() => patch({ type: rt.value })} title={rt.desc}
                  className={`px-2.5 py-1 rounded-[6px] text-[11px] cursor-pointer border ${
                    rotType === rt.value
                      ? "bg-blue text-white border-blue"
                      : "bg-bg2 text-muted border-border"
                  }`}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Lifecycle-specific timing fields ── */}
          {rotType === "interval" && (
            <div className="flex gap-3 flex-wrap">
              <NumInput label="On" value={sr.intervalActiveMs ?? 1000} min={50} step={50} unit="ms" onChange={v => patch({ intervalActiveMs: v })} />
              <NumInput label="Pause" value={sr.intervalPauseMs ?? 1000} min={50} step={50} unit="ms" onChange={v => patch({ intervalPauseMs: v })} />
            </div>
          )}

          {rotType === "once" && (
            <div className="flex items-center gap-2">
              <NumInput label="Duration" value={sr.onceDurationMs ?? 2000} min={100} step={100} unit="ms" onChange={v => patch({ onceDurationMs: v })} />
              <span className="text-[11px] text-faint">fires once then stops</span>
            </div>
          )}

          {rotType === "pulsed" && (
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-[12px] text-text cursor-pointer">
                <input type="checkbox" checked={sr.pulseOnCollision ?? false}
                  onChange={e => patch({ pulseOnCollision: e.target.checked })}
                  className="accent-blue" />
                Trigger pulse on collision
              </label>
              <div className="flex gap-3 flex-wrap">
                <NumInput label="Pulse" value={sr.pulseDurationMs ?? 300} min={50} step={50} unit="ms" onChange={v => patch({ pulseDurationMs: v })} />
                <NumInput label="Cooldown" value={sr.pulseCooldownMs ?? 1000} min={100} step={100} unit="ms" onChange={v => patch({ pulseCooldownMs: v })} />
              </div>
            </div>
          )}

          {rotType === "oscillate" && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 flex-wrap">
                <NumInput label="Sweep from" value={sr.sweepFromDeg ?? 0} min={-360} max={360} unit="°" onChange={v => patch({ sweepFromDeg: v })} />
                <NumInput label="Sweep to" value={sr.sweepToDeg ?? 45} min={-360} max={360} unit="°" onChange={v => patch({ sweepToDeg: v })} />
              </div>
              <div className="flex gap-3 flex-wrap items-center">
                <label className="flex items-center gap-2 text-[12px] text-text cursor-pointer">
                  <input type="checkbox" checked={sr.oscillateReturn !== false}
                    onChange={e => patch({ oscillateReturn: e.target.checked })}
                    className="accent-blue" />
                  Return to origin (oscillate)
                </label>
                <NumInput label="Sweep duration" value={sr.sweepDurationMs ?? 0} min={0} step={50} unit="ms"
                  onChange={v => patch({ sweepDurationMs: v || undefined })} />
                <span className="text-[10px] text-faint">(0 = auto from speed)</span>
              </div>
            </div>
          )}

          {/* ── Rotation axis ── */}
          <div>
            <div className="text-[11px] text-faint mb-[5px]">Rotation Axis</div>
            <div className="flex gap-[5px] flex-wrap mb-1.5">
              {AXIS_TYPES.map(at => (
                <button key={at.value} type="button" onClick={() => patchAxis({ type: at.value })} title={at.desc}
                  className={`px-2.5 py-1 rounded-[6px] text-[11px] cursor-pointer border ${
                    axisType === at.value
                      ? "bg-purple text-white border-purple"
                      : "bg-bg2 text-muted border-border"
                  }`}
                >
                  {at.label}
                </button>
              ))}
            </div>

            {/* arc_pivot: pivot positioned on the curvature */}
            {axisType === "arc_pivot" && (
              <div className="flex flex-col gap-2 pl-1 pt-1.5 border-t border-border">
                <div className="text-[10px] text-faint mb-0.5">
                  Pivot is placed at a point on the contact-point arc. The arm swings around that pivot.
                </div>
                <div className="flex gap-3 flex-wrap">
                  <NumInput label="Pivot angle" value={sr.axis?.pivotAngleDeg ?? 0} min={0} max={360} unit="°"
                    onChange={v => patchAxis({ pivotAngleDeg: v })} />
                  <NumInput label="Pivot radius" value={sr.axis?.pivotRadiusMm ?? 20} min={0} step={0.5} unit="mm"
                    onChange={v => patchAxis({ pivotRadiusMm: v })} />
                  <NumInput label="Arm length" value={sr.axis?.motionRadiusMm ?? 5} min={0.1} step={0.5} unit="mm"
                    onChange={v => patchAxis({ motionRadiusMm: v })} />
                </div>
                <span className="text-[10px] text-faint">
                  Pivot angle: where on the arc the hinge sits · Pivot radius: how far from part center · Arm length: how far the tip moves
                </span>
              </div>
            )}

            {/* custom: euler angles */}
            {axisType === "custom" && (
              <div className="flex gap-2.5 flex-wrap pl-1">
                {(["customX", "customY", "customZ"] as const).map(field => (
                  <div key={field} className="flex items-center gap-1.5">
                    <label className="text-[11px] text-muted min-w-4">{field.slice(-1).toUpperCase()} °</label>
                    <input
                      type="number" min={-180} max={180} step={1}
                      value={sr.axis?.[field] ?? 0}
                      onChange={e => patchAxis({ [field]: +e.target.value })}
                      className="w-[70px] bg-bg2 border border-border text-text rounded-[6px] px-1.5 py-[3px] text-[12px]"
                    />
                  </div>
                ))}
                <span className="text-[10px] text-faint self-center">local-space euler</span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

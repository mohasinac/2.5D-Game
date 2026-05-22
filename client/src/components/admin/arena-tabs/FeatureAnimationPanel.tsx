// Z10b: Feature Animation panel — preset picker + period/color overrides.
// Used inside each feature type's settings drawer.

import { C } from "@/styles/theme";
import type { FeatureAnimationConfig, FeatureAnimationPreset } from "@/types/arenaConfigNew";

const PRESETS: FeatureAnimationPreset[] = [
  "pulse", "scale_pulse", "color_cycle", "flicker", "alert",
  "shimmer", "lightning", "charged", "ghost", "shockwave_ring",
];

const PRESET_LABELS: Record<FeatureAnimationPreset, string> = {
  pulse: "Pulse (alpha wave)",
  scale_pulse: "Scale Pulse",
  color_cycle: "Color Cycle",
  flicker: "Flicker",
  alert: "Alert Flash",
  shimmer: "Shimmer",
  lightning: "Lightning Sparks",
  charged: "Charging Glow",
  ghost: "Ghost Phase",
  shockwave_ring: "Shockwave Ring",
};

interface Props {
  value?: FeatureAnimationConfig;
  onChange: (v: FeatureAnimationConfig | undefined) => void;
  featureId?: string;
}

export default function FeatureAnimationPanel({ value, onChange, featureId }: Props) {
  const enabled = !!value;

  return (
    <div data-testid={featureId ? `feature-animation-${featureId}` : "feature-animation"} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 12, color: C.muted, minWidth: 100 }}>Animation</label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onChange(e.target.checked ? { preset: "pulse" } : undefined)}
        />
        <span style={{ fontSize: 12, color: C.muted }}>{enabled ? "Enabled" : "None"}</span>
      </div>

      {enabled && value && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: C.muted, minWidth: 100 }}>Preset</label>
            <select
              value={value.preset}
              onChange={e => onChange({ ...value, preset: e.target.value as FeatureAnimationPreset })}
              style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
            >
              {PRESETS.map(p => (
                <option key={p} value={p}>{PRESET_LABELS[p]}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: C.muted, minWidth: 100 }}>Period (ms)</label>
            <input
              type="number"
              value={value.periodMs ?? 1200}
              min={100}
              max={10000}
              step={100}
              onChange={e => onChange({ ...value, periodMs: Number(e.target.value) })}
              style={{ width: 80, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: C.muted, minWidth: 100 }}>Color</label>
            <input
              type="color"
              value={value.color ?? "#ffffff"}
              onChange={e => onChange({ ...value, color: e.target.value })}
              style={{ width: 40, height: 28, cursor: "pointer", border: `1px solid ${C.border}`, borderRadius: 4 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: C.muted, minWidth: 100 }}>Intensity</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={value.intensity ?? 1.0}
              onChange={e => onChange({ ...value, intensity: Number(e.target.value) })}
              style={{ width: 100 }}
            />
            <span style={{ fontSize: 11, color: C.muted }}>{(value.intensity ?? 1.0).toFixed(1)}</span>
          </div>
        </>
      )}
    </div>
  );
}

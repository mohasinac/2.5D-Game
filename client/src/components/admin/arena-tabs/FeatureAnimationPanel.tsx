// Z10b: Feature Animation panel — preset picker + period/color overrides.
// Used inside each feature type's settings drawer.

import { C } from "@/styles/theme";
import type { FeatureAnimationConfig, FeatureAnimationPreset } from "@/types/arenaConfigNew";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

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
    <div data-testid={featureId ? `feature-animation-${featureId}` : "feature-animation"} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted min-w-[100px]">Animation</label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onChange(e.target.checked ? { preset: "pulse" } : undefined)}
        />
        <span className="text-xs text-muted">{enabled ? "Enabled" : "None"}</span>
      </div>

      {enabled && value && (
        <>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted min-w-[100px]">Preset</label>
            <SearchableSelect
              value={value.preset}
              options={PRESETS.map(p => ({ value: p, label: PRESET_LABELS[p] }))}
              onChange={v => onChange({ ...value, preset: v as FeatureAnimationPreset })}
              style={{ flex: 1 }}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted min-w-[100px]">Period (ms)</label>
            <input
              type="number"
              value={value.periodMs ?? 1200}
              min={100}
              max={10000}
              step={100}
              onChange={e => onChange({ ...value, periodMs: Number(e.target.value) })}
              className="w-20 bg-bg1 border border-border text-text rounded-md py-1 px-2 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted min-w-[100px]">Color</label>
            <input
              type="color"
              value={value.color ?? "#ffffff"}
              onChange={e => onChange({ ...value, color: e.target.value })}
              className="w-10 h-7 cursor-pointer border border-border rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted min-w-[100px]">Intensity</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={value.intensity ?? 1.0}
              onChange={e => onChange({ ...value, intensity: Number(e.target.value) })}
              className="w-[100px]"
            />
            <span className="text-[11px] text-muted">{(value.intensity ?? 1.0).toFixed(1)}</span>
          </div>
        </>
      )}
    </div>
  );
}

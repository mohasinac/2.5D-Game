import type { PartDimensions } from "@/types/beybladeSystem";

interface Props {
  value: PartDimensions;
  onChange: (dims: PartDimensions) => void;
  showInnerRadius?: boolean;
}

function NumberField({
  label, value, unit = "mm", min = 0, max = 200, step = 0.5,
  onChange, hint,
}: {
  label: string; value: number; unit?: string; min?: number; max?: number; step?: number;
  onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] text-theme-muted mb-1">{label}</label>
      <div className="flex items-center gap-[6px]">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-20 px-[10px] py-[7px] bg-bg3 border border-border-c rounded-[7px] text-theme-text text-[13px] text-right"
        />
        <span className="text-[12px] text-theme-faint">{unit}</span>
      </div>
      {hint && <div className="text-[11px] text-theme-faint mt-[3px]">{hint}</div>}
    </div>
  );
}

export function PartDimensionFields({ value, onChange, showInnerRadius = true }: Props) {
  const update = (field: keyof PartDimensions, v: number) =>
    onChange({ ...value, [field]: v });

  const outerDiameter = (value.outerRadius * 2).toFixed(1);
  const innerDiameter = (value.innerRadius * 2).toFixed(1);

  return (
    <div>
      <div className="text-[12px] text-theme-muted mb-2">Dimensions</div>
      <div className="flex gap-4 flex-wrap">
        <NumberField
          label="Height"
          value={value.height}
          onChange={(v) => update("height", v)}
          hint="Absolute from floor"
        />
        <NumberField
          label="Outer Radius"
          value={value.outerRadius}
          onChange={(v) => update("outerRadius", v)}
          hint="Bounding radius"
        />
        {showInnerRadius && (
          <NumberField
            label="Inner Radius"
            value={value.innerRadius}
            onChange={(v) => update("innerRadius", v)}
            hint="Central bore"
          />
        )}
      </div>
      <div className="mt-2 text-[11px] text-theme-faint">
        Outer ⌀ {outerDiameter} mm
        {showInnerRadius && ` · Inner ⌀ ${innerDiameter} mm`}
        {` · H ${value.height} mm`}
        {` — Effective area: ${outerDiameter} × ${outerDiameter} × ${value.height} mm`}
      </div>
    </div>
  );
}

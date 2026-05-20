import { C } from "@/styles/theme";
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
      <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 4 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{
            width: 80, padding: "7px 10px", background: C.bg3,
            border: `1px solid ${C.border}`, borderRadius: 7,
            color: C.text, fontSize: 13, textAlign: "right",
          }}
        />
        <span style={{ fontSize: 12, color: C.faint }}>{unit}</span>
      </div>
      {hint && <div style={{ fontSize: 11, color: C.faint, marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

export function PartDimensionFields({ value, onChange, showInnerRadius = true }: Props) {
  const update = (field: keyof PartDimensions, v: number) =>
    onChange({ ...value, [field]: v });

  return (
    <div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Dimensions</div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
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
    </div>
  );
}

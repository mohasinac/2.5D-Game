import { C } from "@/styles/theme";
import type { Material } from "@/types/beybladeSystem";

const MATERIALS: Array<{ value: Material; label: string; color: string; desc: string }> = [
  { value: "abs",           label: "ABS",    color: C.blue,   desc: "Standard plastic — balanced damage/recoil" },
  { value: "rubber",        label: "Rubber", color: C.green,  desc: "High spin-steal, low damage, low recoil" },
  { value: "metal",         label: "Metal",  color: C.muted,  desc: "High damage & recoil, moderate spin-steal" },
  { value: "pom",           label: "POM",    color: C.yellow, desc: "Smooth acetal — slight damage bonus, low recoil" },
  { value: "polycarbonate", label: "PC",     color: C.purple, desc: "Light polycarbonate — moderate stats" },
];

interface Props {
  value: Material;
  onChange: (m: Material) => void;
  label?: string;
}

export function MaterialSelector({ value, onChange, label = "Material" }: Props) {
  return (
    <div>
      {label && (
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{label}</div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {MATERIALS.map((m) => {
          const active = value === m.value;
          return (
            <button
              key={m.value}
              title={m.desc}
              onClick={() => onChange(m.value)}
              style={{
                padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 120ms",
                background: active ? m.color + "28" : C.bg2,
                color: active ? m.color : C.muted,
                border: `1px solid ${active ? m.color + "88" : C.border}`,
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

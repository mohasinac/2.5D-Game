import React from "react";
import type { Material } from "@/types/beybladeSystem";

const MATERIALS: Array<{ value: Material; label: string; color: string; desc: string }> = [
  { value: "abs",           label: "ABS",    color: "var(--blue)",   desc: "Standard plastic — balanced damage/recoil" },
  { value: "rubber",        label: "Rubber", color: "var(--green)",  desc: "High spin-steal, low damage, low recoil" },
  { value: "metal",         label: "Metal",  color: "var(--muted)",  desc: "High damage & recoil, moderate spin-steal" },
  { value: "pom",           label: "POM",    color: "var(--yellow)", desc: "Smooth acetal — slight damage bonus, low recoil" },
  { value: "polycarbonate", label: "PC",     color: "var(--purple)", desc: "Light polycarbonate — moderate stats" },
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
        <div className="text-[12px] text-theme-muted mb-[6px]">{label}</div>
      )}
      <div className="flex flex-wrap gap-[6px]">
        {MATERIALS.map((m) => {
          const active = value === m.value;
          return (
            <button
              key={m.value}
              title={m.desc}
              onClick={() => onChange(m.value)}
              className="py-[6px] px-3 rounded-[7px] text-[12px] font-semibold cursor-pointer transition-all duration-[120ms] border"
              style={active ? { "--tc": m.color, background: `color-mix(in srgb, ${m.color} 16%, transparent)`, color: m.color, borderColor: `color-mix(in srgb, ${m.color} 53%, transparent)` } as React.CSSProperties : { background: "var(--bg2)", color: "var(--muted)", borderColor: "var(--border)" }}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

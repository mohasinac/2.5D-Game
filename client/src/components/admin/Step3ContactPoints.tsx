import { useState } from "react";
import { cn } from "@/lib/cn";
import type { BeybladeStats, PointOfContact } from "@/types/beybladeStats";

interface Step3ContactPointsProps {
  beyblade: BeybladeStats;
  onChange: (updated: Partial<BeybladeStats>) => void;
}

export default function Step3ContactPoints({ beyblade, onChange }: Step3ContactPointsProps) {
  const [selectedCP, setSelectedCP] = useState<number | null>(null);
  const [cpCount, setCpCount] = useState(4);

  const points = beyblade.pointsOfContact ?? [];

  const generateCP = (count: number) => {
    const step = 360 / count;
    onChange({
      pointsOfContact: Array.from({ length: count }, (_, i) => ({
        angle: Math.round(i * step),
        damageMultiplier: 1.0,
        width: Math.min(45, step * 0.8),
      })),
    });
    setSelectedCP(null);
  };

  const updateCP = (index: number, field: keyof PointOfContact, value: number) => {
    const next = points.map((p, i) => i === index ? { ...p, [field]: value } : p);
    onChange({ pointsOfContact: next });
  };

  const removeCP = (index: number) => {
    onChange({ pointsOfContact: points.filter((_, i) => i !== index) });
    if (selectedCP === index) setSelectedCP(null);
  };

  const resetCPDamage = () => onChange({ pointsOfContact: points.map(p => ({ ...p, damageMultiplier: 1.0 })) });

  return (
    <div className="bg-bg2 border border-border-c rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[14px] font-semibold text-theme-text">
          Contact Points ({points.length})
        </span>
        <button
          onClick={resetCPDamage}
          disabled={points.length === 0}
          className="text-[11px] px-2 py-[3px] bg-bg3 border border-border-c rounded-[5px] text-theme-muted cursor-pointer"
        >
          Reset 1.0x
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="number"
          min={1}
          max={20}
          value={cpCount}
          onChange={e => setCpCount(+e.target.value)}
          className="w-[60px] px-2 py-1 bg-bg3 border border-border-c rounded-md text-theme-text text-[13px]"
        />
        <button
          onClick={() => generateCP(cpCount)}
          className="px-3.5 py-1 bg-theme-blue border-none rounded-md text-white text-[12px] font-semibold cursor-pointer"
        >
          Generate evenly
        </button>
        <button
          onClick={() => {
            const angle = Math.round(Math.random() * 360);
            onChange({ pointsOfContact: [...points, { angle, damageMultiplier: 1.0, width: 45 }] });
          }}
          className="px-3.5 py-1 bg-bg3 border border-border-c rounded-md text-theme-muted text-[12px] cursor-pointer"
        >
          + Add
        </button>
      </div>

      {points.length === 0 && (
        <p className="text-[12px] text-theme-faint text-center py-3">
          No contact points. Click "Generate evenly" to add them.
        </p>
      )}

      <div className="max-h-[320px] overflow-y-auto">
        {points.map((p, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg px-3 py-2.5 cursor-pointer mb-1.5 border",
              selectedCP === i
                ? "bg-blue-13 border-theme-blue"
                : "bg-bg3 border-border-c",
            )}
            onClick={() => setSelectedCP(selectedCP === i ? null : i)}
          >
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-theme-text font-medium">
                #{i + 1} — {p.angle}° — {p.damageMultiplier.toFixed(2)}x
              </span>
              <button
                onClick={e => { e.stopPropagation(); removeCP(i); }}
                className="text-[11px] text-theme-red bg-transparent border-none cursor-pointer"
              >×</button>
            </div>
            {selectedCP === i && (
              <div className="mt-2.5 flex flex-col gap-2">
                {(["angle", "damageMultiplier", "width"] as const).map(field => {
                  const cfg: Record<string, { min: number; max: number; step: number; label: string }> = {
                    angle:             { min: 0,   max: 360, step: 1,    label: "Angle (°)" },
                    damageMultiplier:  { min: 1,   max: 2,   step: 0.01, label: "Damage Multiplier" },
                    width:             { min: 5,   max: 90,  step: 1,    label: "Width (°)" },
                  };
                  const c = cfg[field];
                  return (
                    <div key={field}>
                      <div className="flex justify-between text-[12px] mb-0.5">
                        <span className="text-theme-muted">{c.label}</span>
                        <span className="text-theme-text font-mono">
                          {typeof p[field] === "number"
                            ? (p[field] as number).toFixed(field === "damageMultiplier" ? 2 : 0)
                            : p[field]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={c.min} max={c.max} step={c.step}
                        value={p[field] as number}
                        onChange={e => updateCP(i, field, +e.target.value)}
                        className="w-full accent-theme-blue"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

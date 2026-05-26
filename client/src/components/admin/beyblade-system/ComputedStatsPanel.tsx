/**
 * ComputedStatsPanel — displays live output of computeBeybladeStats().
 */

import React from "react";
import { computeBeybladeStats } from "@/lib/beybladeSystemConverter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";

const TYPE_COLORS: Record<string, string> = {
  attack:   "#ef4444",
  defense:  "#3b82f6",
  stamina:  "#22c55e",
  balanced: "var(--muted)",
};

function StatRow({ label, value, unit = "", highlight = false }: { label: string; value: string | number; unit?: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-border/[0.13]">
      <span className="text-[11px] text-muted">{label}</span>
      <span className={`text-[12px] font-mono ${highlight ? "font-bold text-text" : "font-medium text-muted"}`}>
        {typeof value === "number" ? value.toFixed(2) : value}{unit}
      </span>
    </div>
  );
}

function DistBar({ label, value, max = 150, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="mb-1.5">
      <div className="flex justify-between mb-0.5">
        <span className="text-[10px] text-muted">{label}</span>
        <span className="text-[10px] text-muted font-mono">{value}/{max}</span>
      </div>
      <div className="h-[5px] bg-bg3 rounded-[3px] overflow-hidden">
        <div className="h-full rounded-[3px] [transition:width_0.3s] bg-[color:var(--bc)] w-[--pct]" style={{ "--bc": color, "--pct": `${pct}%` } as React.CSSProperties} />
      </div>
    </div>
  );
}

interface Props {
  resolved: ResolvedBeybladeSystem | null | undefined;
}

export function ComputedStatsPanel({ resolved }: Props) {
  if (!resolved) {
    return (
      <div className="p-4 text-faint text-[11px]">
        Select all required parts to see computed stats.
      </div>
    );
  }

  let stats: ReturnType<typeof computeBeybladeStats> | null = null;
  let error = "";
  try {
    stats = computeBeybladeStats(resolved);
  } catch (e) {
    error = String(e);
  }

  if (error || !stats) {
    return (
      <div className="p-4 text-red text-[11px]">
        Stats error: {error || "Unknown"}
      </div>
    );
  }

  const s = stats;
  const typeColor = TYPE_COLORS[s.type] ?? "var(--muted)";

  return (
    <div className="px-3.5 py-3 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span
          style={{ "--tc": typeColor, background: `${typeColor}22`, color: typeColor, border: `1px solid ${typeColor}45` } as React.CSSProperties}
          className="text-[11px] px-2 py-0.5 rounded-full font-semibold capitalize"
        >
          {s.type}
        </span>
        <span className="text-[11px] text-faint">
          {s.spinDirection === "right" ? "↻ right-spin" : "↺ left-spin"}
        </span>
      </div>

      {/* Type distribution bars */}
      <div>
        <div className="text-[10px] text-faint mb-1.5 uppercase tracking-[0.05em]">Type Distribution</div>
        <DistBar label="Attack"  value={s.typeDistribution.attack}  color="#ef4444" />
        <DistBar label="Defense" value={s.typeDistribution.defense} color="#3b82f6" />
        <DistBar label="Stamina" value={s.typeDistribution.stamina} color="#22c55e" />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-faint">Total</span>
          <span className="text-[10px] text-muted font-mono">{s.typeDistribution.total} pts</span>
        </div>
      </div>

      {/* Physics stats */}
      <div>
        <div className="text-[10px] text-faint mb-1.5 uppercase tracking-[0.05em]">Physics</div>
        <StatRow label="Damage Multiplier"   value={s.damageMultiplier}        unit="×" highlight />
        <StatRow label="Damage Taken"        value={s.damageTaken}             unit="×" />
        <StatRow label="Max Spin"            value={s.maxSpin.toFixed(0)}      unit=" RPM" />
        <StatRow label="Spin Decay Rate"     value={s.spinDecayRate}           unit="/s" />
        <StatRow label="Spin Steal Factor"   value={s.spinStealFactor}         unit="×" />
        <StatRow label="Effective Radius"    value={(s.radius * 10).toFixed(1)} unit=" mm" />
        <StatRow label="Mass"                value={s.mass.toFixed(1)}         unit=" g" />
        <StatRow label="Knockback"           value={s.knockbackDistance}       unit="×" />
        <StatRow label="Invulnerability"     value={(s.invulnerabilityChance * 100).toFixed(1)} unit="%" />
      </div>

      {/* Contact points summary */}
      <div>
        <div className="text-[10px] text-faint mb-1.5 uppercase tracking-[0.05em]">Contact Points</div>
        <StatRow label="Attack CPs"    value={s.pointsOfContact.length}  />
        <StatRow label="Spin-Steal CPs" value={(s.spinStealPoints?.length ?? 0)} />
      </div>
    </div>
  );
}

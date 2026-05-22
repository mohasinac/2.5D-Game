/**
 * ComputedStatsPanel — displays live output of computeBeybladeStats().
 */

import { C, alpha } from "@/styles/theme";
import { computeBeybladeStats } from "@/lib/beybladeSystemConverter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";

const TYPE_COLORS: Record<string, string> = {
  attack:   "#ef4444",
  defense:  "#3b82f6",
  stamina:  "#22c55e",
  balanced: C.muted,
};

function StatRow({ label, value, unit = "", highlight = false }: { label: string; value: string | number; unit?: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${alpha(C.border, 0.13)}` }}>
      <span style={{ fontSize: 11, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: highlight ? 700 : 500, color: highlight ? C.text : C.muted, fontFamily: "monospace" }}>
        {typeof value === "number" ? value.toFixed(2) : value}{unit}
      </span>
    </div>
  );
}

function DistBar({ label, value, max = 150, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: C.muted }}>{label}</span>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>{value}/{max}</span>
      </div>
      <div style={{ height: 5, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.3s" }} />
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
      <div style={{ padding: 16, color: C.faint, fontSize: 11 }}>
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
      <div style={{ padding: 16, color: C.red, fontSize: 11 }}>
        Stats error: {error || "Unknown"}
      </div>
    );
  }

  const s = stats;
  const typeColor = TYPE_COLORS[s.type] ?? C.muted;

  return (
    <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 600,
          background: alpha(typeColor, 0.13), color: typeColor, border: `1px solid ${alpha(typeColor, 0.27)}`,
          textTransform: "capitalize",
        }}>
          {s.type}
        </span>
        <span style={{ fontSize: 11, color: C.faint }}>
          {s.spinDirection === "right" ? "↻ right-spin" : "↺ left-spin"}
        </span>
      </div>

      {/* Type distribution bars */}
      <div>
        <div style={{ fontSize: 10, color: C.faint, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Type Distribution</div>
        <DistBar label="Attack"  value={s.typeDistribution.attack}  color="#ef4444" />
        <DistBar label="Defense" value={s.typeDistribution.defense} color="#3b82f6" />
        <DistBar label="Stamina" value={s.typeDistribution.stamina} color="#22c55e" />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: C.faint }}>Total</span>
          <span style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>{s.typeDistribution.total} pts</span>
        </div>
      </div>

      {/* Physics stats */}
      <div>
        <div style={{ fontSize: 10, color: C.faint, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Physics</div>
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
        <div style={{ fontSize: 10, color: C.faint, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact Points</div>
        <StatRow label="Attack CPs"    value={s.pointsOfContact.length}  />
        <StatRow label="Spin-Steal CPs" value={(s.spinStealPoints?.length ?? 0)} />
      </div>
    </div>
  );
}

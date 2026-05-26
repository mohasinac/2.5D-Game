import React, { useState } from "react";
import { C, alpha } from "@/styles/theme";
import { cn } from "@/lib/cn";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import type {
  ArenaLink,
  ArenaLinkAlignmentConfig,
  ArenaLinkTraversalConfig,
  ArenaLinkPitConfig,
  ArenaLinkTrampolineConfig,
} from "@/types/arenaConfigNew";

// ─── Static data ──────────────────────────────────────────────────────────────

interface Props {
  fromArenaId: string;
  toArenaId: string;
  existing?: ArenaLink;
  onSave: (link: ArenaLink) => void;
  onClose: () => void;
}

const LINK_TYPES = [
  { value: "corridor",   icon: "🚪", label: "Corridor",   desc: "Horizontal passageway. Both openings must face each other. Disconnects when misaligned." },
  { value: "portal",     icon: "🌀", label: "Portal",     desc: "Instant teleport. Always open regardless of rotation. Zero alignment required." },
  { value: "ramp",       icon: "📐", label: "Ramp",       desc: "Physical incline owned by source arena. Only source rotation matters. Severs on misalign." },
  { value: "pit",        icon: "⬇️",  label: "Pit",        desc: "Gravity fall to floor below. Stays open at any rotation. Bey lands anywhere on lower floor." },
  { value: "trampoline", icon: "⬆️",  label: "Trampoline", desc: "Launch upward. Auto-bounces beys that fall from pit above. Player can hold SPACE/↓ to cancel." },
] as const;

// Finite color lookup for coupling/alignment — maps C.xxx CSS var to Tailwind token
const COLOR_TEXT: Record<string, string> = {
  [C.faint]:  "text-theme-faint",
  [C.green]:  "text-theme-green",
  [C.yellow]: "text-theme-yellow",
  [C.blue]:   "text-theme-blue",
  [C.purple]: "text-theme-purple",
  [C.red]:    "text-theme-red",
  [C.orange]: "text-theme-orange",
  [C.text]:   "text-theme-text",
  [C.muted]:  "text-theme-muted",
};

const COUPLING_TYPES = [
  { value: "independent",  label: "Independent",  color: C.faint,  desc: "Each arena rotates freely at its own speed",                               symbol: "~ | ~" },
  { value: "synchronized", label: "Synchronized", color: C.green,  desc: "Both rotate together — source arena is authoritative",                     symbol: "↻ | ↻" },
  { value: "counter",      label: "Counter",      color: C.yellow, desc: "Opposite directions, same speed — shared boundary spins against itself",   symbol: "↻ | ↺" },
  { value: "driven",       label: "Driven",       color: C.blue,   desc: "Source drives destination via ratio — like gear teeth meshing",            symbol: "↻⚙↻" },
] as const;

const ALIGNMENT_MODES = [
  { value: "none",        label: "None (always open)", color: C.purple, desc: "Portals. Ignores all rotation — always traversable." },
  { value: "positional",  label: "Positional",         color: C.blue,   desc: "Both arena openings must face each other within errorMarginDeg." },
  { value: "owner-only",  label: "Owner-only (ramp)",  color: C.yellow, desc: "Only the owning arena angle is checked. Ramp physically extends from it." },
] as const;

const LANDING_MODES = [
  { value: "random",  label: "Random",  desc: "Land anywhere on the floor below — tolerant of misalignment" },
  { value: "fixed",   label: "Fixed",   desc: "Always exit at the configured exit position" },
  { value: "current", label: "Current", desc: "Same relative x/y position scaled to destination arena" },
] as const;

// ─── Visual diagrams ──────────────────────────────────────────────────────────

/**
 * Cross-section SVG showing how beys traverse each link type.
 * Upper rectangle = source floor, lower = destination floor.
 */
function LinkCrossSectionDiagram({ linkType }: { linkType: string }) {
  const W = 320, H = 112;
  const floorH = 22;
  const topY = 8, botY = H - floorH - 8;
  const midX = W / 2;

  const diagrams: Record<string, React.ReactElement> = {
    pit: (
      <svg width={W} height={H}>
        <rect x={20} y={topY} width={W - 40} height={floorH} rx={4} fill={alpha(C.blue, 0.12)} stroke={alpha(C.blue, 0.4)} strokeWidth={1.5} />
        <text x={midX} y={topY + 14} textAnchor="middle" fontSize={10} fill={C.muted}>Upper Arena (F1) — pit source</text>
        <rect x={midX - 18} y={topY + floorH - 3} width={36} height={6} rx={2} fill={C.red} opacity={0.7} />
        <text x={midX} y={topY + floorH + 12} textAnchor="middle" fontSize={8} fill={C.red}>pit opening</text>
        <circle cx={midX} cy={topY + floorH + 18} r={5} fill={alpha(C.red, 0.3)} stroke={C.red} strokeWidth={1.5} />
        <path d={`M${midX} ${topY + floorH + 24} L${midX} ${botY - 4}`} stroke={C.red} strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#pit-arr)" />
        <ellipse cx={midX} cy={botY + 4} rx={30} ry={5} fill={alpha(C.red, 0.12)} stroke={alpha(C.red, 0.4)} strokeWidth={1} strokeDasharray="3 2" />
        <text x={midX} y={botY + 4} textAnchor="middle" fontSize={8} fill={C.red} dy={3}>random landing zone</text>
        <rect x={20} y={botY} width={W - 40} height={floorH} rx={4} fill={alpha(C.bg3, 0.5)} stroke={C.border} strokeWidth={1} />
        <text x={midX} y={botY + 14} textAnchor="middle" fontSize={10} fill={C.faint}>Lower Arena (F0)</text>
        <defs><marker id="pit-arr" markerWidth={6} markerHeight={6} refX={3} refY={6} orient="auto"><path d="M0,0 L3,6 L6,0 Z" fill={C.red} /></marker></defs>
      </svg>
    ),
    trampoline: (
      <svg width={W} height={H}>
        <rect x={20} y={topY} width={W - 40} height={floorH} rx={4} fill={alpha(C.bg3, 0.5)} stroke={C.border} strokeWidth={1} />
        <text x={midX} y={topY + 14} textAnchor="middle" fontSize={10} fill={C.faint}>Upper Arena (F1)</text>
        <rect x={midX - 24} y={botY - 7} width={48} height={8} rx={3} fill={alpha(C.green, 0.25)} stroke={C.green} strokeWidth={1.5} />
        <text x={midX} y={botY - 12} textAnchor="middle" fontSize={8} fill={C.green}>trampoline</text>
        <path d={`M${midX} ${botY - 7} Q${midX - 18} ${(topY + floorH + botY) / 2} ${midX - 5} ${topY + floorH + 6}`}
          fill="none" stroke={alpha(C.green, 0.4)} strokeWidth={1} strokeDasharray="3 2" />
        <path d={`M${midX} ${botY - 7} Q${midX + 10} ${(topY + floorH + botY) / 2 - 8} ${midX + 12} ${topY + floorH + 4}`}
          fill="none" stroke={C.green} strokeWidth={2} markerEnd="url(#tramp-arr)" />
        <text x={midX + 36} y={(topY + floorH + botY) / 2} fontSize={9} fill={C.green}>auto-launch ↑</text>
        <rect x={W - 98} y={botY - 28} width={82} height={16} rx={4} fill={alpha(C.yellow, 0.12)} stroke={alpha(C.yellow, 0.35)} strokeWidth={1} />
        <text x={W - 57} y={botY - 17} textAnchor="middle" fontSize={8} fill={C.yellow}>hold SPACE/↓ to stay</text>
        <rect x={20} y={botY} width={W - 40} height={floorH} rx={4} fill={alpha(C.green, 0.08)} stroke={alpha(C.green, 0.35)} strokeWidth={1.5} />
        <text x={midX} y={botY + 14} textAnchor="middle" fontSize={10} fill={C.green}>Trampoline Floor (F0)</text>
        <defs><marker id="tramp-arr" markerWidth={6} markerHeight={6} refX={3} refY={6} orient="auto"><path d="M0,6 L3,0 L6,6 Z" fill={C.green} /></marker></defs>
      </svg>
    ),
    ramp: (
      <svg width={W} height={H}>
        <rect x={20} y={topY} width={W - 40} height={floorH} rx={4} fill={alpha(C.yellow, 0.08)} stroke={alpha(C.yellow, 0.4)} strokeWidth={1.5} />
        <text x={midX} y={topY + 14} textAnchor="middle" fontSize={10} fill={C.yellow}>Upper Arena (F1) — owner</text>
        <path d={`M${W - 60} ${topY + floorH} L${55} ${botY}`} stroke={C.yellow} strokeWidth={3} strokeLinecap="round" />
        <circle cx={midX - 14} cy={(topY + floorH + botY) / 2 + 4} r={5} fill={alpha(C.yellow, 0.3)} stroke={C.yellow} strokeWidth={1.5} />
        <path d={`M${midX - 8} ${(topY + floorH + botY) / 2} L${midX + 34} ${topY + floorH + 6}`} stroke={C.yellow} strokeWidth={1.5} markerEnd="url(#ramp-arr)" />
        <rect x={22} y={topY + floorH + 3} width={96} height={15} rx={3} fill={alpha(C.yellow, 0.12)} stroke={alpha(C.yellow, 0.3)} strokeWidth={1} />
        <text x={70} y={topY + floorH + 13} textAnchor="middle" fontSize={8} fill={C.yellow}>owner-only alignment</text>
        <line x1={W - 52} y1={botY - 10} x2={W - 22} y2={botY - 30} stroke={C.red} strokeWidth={1.5} />
        <line x1={W - 22} y1={botY - 10} x2={W - 52} y2={botY - 30} stroke={C.red} strokeWidth={1.5} />
        <text x={W - 38} y={botY - 34} textAnchor="middle" fontSize={8} fill={C.red}>severs when misaligned</text>
        <rect x={20} y={botY} width={W - 40} height={floorH} rx={4} fill={alpha(C.bg3, 0.5)} stroke={C.border} strokeWidth={1} />
        <text x={midX} y={botY + 14} textAnchor="middle" fontSize={10} fill={C.faint}>Lower Arena (F0)</text>
        <defs><marker id="ramp-arr" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.yellow} /></marker></defs>
      </svg>
    ),
    portal: (
      <svg width={W} height={H}>
        <rect x={20} y={topY} width={W - 40} height={floorH} rx={4} fill={alpha(C.purple, 0.08)} stroke={alpha(C.purple, 0.4)} strokeWidth={1.5} />
        <text x={midX} y={topY + 14} textAnchor="middle" fontSize={10} fill={C.purple}>Source Arena (F1)</text>
        <ellipse cx={midX} cy={topY + floorH + 12} rx={18} ry={8} fill={alpha(C.purple, 0.2)} stroke={C.purple} strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={midX} y={topY + floorH + 14} textAnchor="middle" fontSize={8} fill={C.purple} dy={1}>ENTRY</text>
        <line x1={midX} y1={topY + floorH + 20} x2={midX} y2={botY - 18} stroke={C.purple} strokeWidth={2} strokeDasharray="5 3" />
        <rect x={midX - 32} y={(topY + floorH + botY) / 2 - 9} width={64} height={15} rx={4} fill={alpha(C.purple, 0.15)} stroke={alpha(C.purple, 0.4)} strokeWidth={1} />
        <text x={midX} y={(topY + floorH + botY) / 2 + 2} textAnchor="middle" fontSize={9} fill={C.purple}>always open</text>
        <ellipse cx={midX} cy={botY - 10} rx={18} ry={8} fill={alpha(C.purple, 0.2)} stroke={C.purple} strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={midX} y={botY - 8} textAnchor="middle" fontSize={8} fill={C.purple} dy={2}>EXIT</text>
        <rect x={20} y={botY} width={W - 40} height={floorH} rx={4} fill={alpha(C.bg3, 0.5)} stroke={C.border} strokeWidth={1} />
        <text x={midX} y={botY + 14} textAnchor="middle" fontSize={10} fill={C.faint}>Destination Arena (F0)</text>
      </svg>
    ),
    corridor: (
      <svg width={W} height={H}>
        <rect x={16} y={12} width={100} height={H - 24} rx={6} fill={alpha(C.blue, 0.08)} stroke={alpha(C.blue, 0.4)} strokeWidth={1.5} />
        <text x={66} y={26} textAnchor="middle" fontSize={10} fill={C.blue}>Arena A</text>
        <rect x={W - 116} y={12} width={100} height={H - 24} rx={6} fill={alpha(C.blue, 0.08)} stroke={alpha(C.blue, 0.4)} strokeWidth={1.5} />
        <text x={W - 66} y={26} textAnchor="middle" fontSize={10} fill={C.blue}>Arena B</text>
        <rect x={118} y={H / 2 - 12} width={84} height={24} rx={4} fill={alpha(C.blue, 0.15)} stroke={C.blue} strokeWidth={1.5} />
        <text x={midX} y={H / 2 + 2} textAnchor="middle" fontSize={9} fill={C.blue}>corridor</text>
        <path d={`M${W - 116} ${H / 2} L${W - 116 + 84} ${H / 2}`} stroke={C.blue} strokeWidth={1.5} markerEnd="url(#corr-arr)" />
        <text x={midX} y={H / 2 - 18} textAnchor="middle" fontSize={8} fill={C.red}>openings must face each other ±errorMarginDeg°</text>
        <defs><marker id="corr-arr" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.blue} /></marker></defs>
      </svg>
    ),
  };

  return (
    <div className="bg-bg0 rounded-[10px] border border-border-c px-[10px] py-2 mb-[10px] overflow-hidden">
      {diagrams[linkType] ?? diagrams.corridor}
    </div>
  );
}

/**
 * Dual-compass alignment diagram.
 * Shows two rotating arena circles with their openings and how errorMarginDeg tolerance works.
 */
function AlignmentCompassDiagram({ mode, errorMarginDeg }: { mode: string; errorMarginDeg: number }) {
  if (mode === "none") {
    return (
      <div className="bg-theme-purple/[0.08] border border-theme-purple/30 rounded-[10px] px-4 py-3 mb-[10px] text-center">
        <div className="text-[22px]">🌀</div>
        <div className="text-xs text-theme-purple font-bold mt-1">Always Open</div>
        <div className="text-[11px] text-theme-muted mt-1 leading-[1.5]">
          Portal ignores rotation entirely. No alignment check required.<br />
          Beys can traverse at any time regardless of both arenas' angles.
        </div>
      </div>
    );
  }

  const W = 300, H = 90;
  const r = 30;
  const cx1 = 58, cx2 = W - 58, cy = H / 2;
  const marginRad = (errorMarginDeg * Math.PI) / 180;
  const openAngle = 0; // opening points right on left arena, left on right arena

  // Green zone arc endpoints
  const gs = cx1 + r * Math.cos(openAngle - marginRad);
  const gt = cy  + r * Math.sin(openAngle - marginRad);
  const ge = cx1 + r * Math.cos(openAngle + marginRad);
  const gu = cy  + r * Math.sin(openAngle + marginRad);

  return (
    <div className="bg-bg0 rounded-[10px] border border-border-c px-[10px] py-2 mb-[10px]">
      <svg width={W} height={H} className="block mx-auto">
        {/* Arena circles */}
        <circle cx={cx1} cy={cy} r={r} fill={alpha(C.blue, 0.06)} stroke={alpha(C.blue, 0.35)} strokeWidth={1.5} />
        <circle cx={cx2} cy={cy} r={r} fill={alpha(C.blue, 0.06)} stroke={alpha(C.blue, 0.35)} strokeWidth={1.5} />

        {/* Error margin arc (green zone) on left arena */}
        <path
          d={`M${cx1} ${cy} L${gs} ${gt} A${r} ${r} 0 ${marginRad * 2 > Math.PI ? 1 : 0} 1 ${ge} ${gu} Z`}
          fill={alpha(C.green, 0.18)} stroke={alpha(C.green, 0.5)} strokeWidth={1}
        />
        <text x={cx1 + r + 4} y={cy - r / 2} fontSize={8} fill={C.green}>±{errorMarginDeg}°</text>
        <text x={cx1 + r + 4} y={cy - r / 2 + 10} fontSize={8} fill={C.green}>tolerance</text>

        {/* Opening notches */}
        <circle cx={cx1 + r} cy={cy} r={4} fill={C.green} />
        <circle cx={cx2 - r} cy={cy} r={4} fill={C.blue} />

        {/* Connection line (aligned = solid green) */}
        <line x1={cx1 + r + 4} y1={cy} x2={cx2 - r - 4} y2={cy} stroke={C.green} strokeWidth={1.5} />

        {/* Owner-only overlay */}
        {mode === "owner-only" && (
          <>
            <line x1={cx2 - r - 4} y1={cy - r} x2={cx2 + r + 4} y2={cy + r} stroke={alpha(C.faint, 0.5)} strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={cx2} y={cy - r - 6} textAnchor="middle" fontSize={8} fill={C.faint}>ignored</text>
            <text x={cx1} y={cy - r - 6} textAnchor="middle" fontSize={8} fill={C.yellow}>owner</text>
          </>
        )}

        {/* Labels */}
        <text x={cx1} y={H - 4} textAnchor="middle" fontSize={9} fill={C.muted}>Arena A (rotates)</text>
        <text x={cx2} y={H - 4} textAnchor="middle" fontSize={9} fill={C.muted}>Arena B</text>
        <text x={(cx1 + cx2) / 2} y={14} textAnchor="middle" fontSize={9} fill={C.green}>✓ ALIGNED (within ±{errorMarginDeg}°)</text>
      </svg>
    </div>
  );
}

/**
 * Traversal timeline: visual ticks for transit, cooldown, and global gap.
 */
function TraversalTimeline({ traversalTicks, perBeyReuseCooldownTicks, globalGapTicks }: {
  traversalTicks: number; perBeyReuseCooldownTicks: number; globalGapTicks: number;
}) {
  const total = traversalTicks + Math.max(perBeyReuseCooldownTicks, globalGapTicks);
  if (total === 0) return null;
  const W = 290;
  const tW = (traversalTicks / total) * W;
  const gW = (globalGapTicks / total) * W;
  const rW = (perBeyReuseCooldownTicks / total) * W;

  return (
    <div className="mt-[10px]">
      <div className="text-[10px] text-theme-faint mb-1 font-semibold uppercase">
        Timing diagram (one traversal cycle)
      </div>
      <svg width={W} height={34} className="block">
        <rect x={0} y={2} width={tW} height={14} rx={3} fill={alpha(C.blue, 0.55)} />
        {tW > 24 && <text x={tW / 2} y={12} textAnchor="middle" fontSize={8} fill="#fff">transit</text>}
        <rect x={tW} y={2} width={gW} height={14} rx={3} fill={alpha(C.yellow, 0.5)} />
        {gW > 20 && <text x={tW + gW / 2} y={12} textAnchor="middle" fontSize={8} fill={C.yellow}>gap</text>}
        <rect x={tW} y={18} width={rW} height={10} rx={2} fill={alpha(C.purple, 0.5)} />
        {rW > 36 && <text x={tW + rW / 2} y={25} textAnchor="middle" fontSize={7} fill={C.purple}>per-bey reuse</text>}
      </svg>
      <div className="flex gap-3 text-[10px] text-theme-faint mt-[2px]">
        <span><span className="text-theme-blue">■</span> Transit: {(traversalTicks / 60).toFixed(2)}s</span>
        <span><span className="text-theme-yellow">■</span> Global gap: {(globalGapTicks / 60).toFixed(2)}s</span>
        <span><span className="text-theme-purple">■</span> Per-bey reuse: {(perBeyReuseCooldownTicks / 60).toFixed(2)}s</span>
      </div>
    </div>
  );
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

function defaultAlignment(linkType: string): ArenaLinkAlignmentConfig {
  switch (linkType) {
    case "portal":     return { mode: "none",       errorMarginDeg: 0,  correctionTicks: 0,  disconnectsWhenMisaligned: false, reconnectCooldownTicks: 0 };
    case "ramp":       return { mode: "owner-only", errorMarginDeg: 12, correctionTicks: 8,  disconnectsWhenMisaligned: true,  reconnectCooldownTicks: 60, ownerArenaId: "" };
    case "corridor":   return { mode: "positional", errorMarginDeg: 10, correctionTicks: 6,  disconnectsWhenMisaligned: true,  reconnectCooldownTicks: 30 };
    case "pit":        return { mode: "positional", errorMarginDeg: 20, correctionTicks: 0,  disconnectsWhenMisaligned: false, reconnectCooldownTicks: 0 };
    case "trampoline": return { mode: "positional", errorMarginDeg: 15, correctionTicks: 10, disconnectsWhenMisaligned: false, reconnectCooldownTicks: 0 };
    default:           return { mode: "positional", errorMarginDeg: 10, correctionTicks: 6,  disconnectsWhenMisaligned: false, reconnectCooldownTicks: 0 };
  }
}

function defaultTraversal(linkType: string): ArenaLinkTraversalConfig {
  switch (linkType) {
    case "portal":     return { traversalTicks: 10,  perBeyReuseCooldownTicks: 60,  globalGapTicks: 5 };
    case "ramp":       return { traversalTicks: 45,  perBeyReuseCooldownTicks: 90,  globalGapTicks: 20 };
    case "corridor":   return { traversalTicks: 30,  perBeyReuseCooldownTicks: 60,  globalGapTicks: 10 };
    case "pit":        return { traversalTicks: 40,  perBeyReuseCooldownTicks: 120, globalGapTicks: 15 };
    case "trampoline": return { traversalTicks: 35,  perBeyReuseCooldownTicks: 90,  globalGapTicks: 15 };
    default:           return { traversalTicks: 30,  perBeyReuseCooldownTicks: 60,  globalGapTicks: 10 };
  }
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function ArenaLinkEditorPanel({ fromArenaId, toArenaId, existing, onSave, onClose }: Props) {
  const isNew = !existing;
  const [linkType, setLinkType] = useState<string>(existing?.linkType ?? "pit");
  const [coupling, setCoupling] = useState<string>(existing?.rotationCoupling ?? "independent");
  const [drivenRatio, setDrivenRatio] = useState(existing?.rotationDrivenRatio ?? 1.0);
  const [momentum, setMomentum] = useState(existing?.momentumPreserved ?? true);
  const [levelDelta, setLevelDelta] = useState(existing?.levelDelta ?? 300);
  const [exitVelocityMult, setExitVelocityMult] = useState(existing?.exitVelocityMult ?? 1.0);
  const [hazardDamage, setHazardDamage] = useState(existing?.hazardDamage ?? 0);
  const [reverseCondition, setReverseCondition] = useState(existing?.reverseCondition ?? "always");
  const [alignment, setAlignment] = useState<ArenaLinkAlignmentConfig>(existing?.alignment ?? defaultAlignment(linkType));
  const [traversal, setTraversal] = useState<ArenaLinkTraversalConfig>(existing?.traversal ?? defaultTraversal(linkType));
  const [pitConfig, setPitConfig] = useState<ArenaLinkPitConfig>(existing?.pitConfig ?? { landingMode: "random" });
  const [trampolineConfig, setTrampolineConfig] = useState<ArenaLinkTrampolineConfig>(existing?.trampolineConfig ?? {
    autoLaunchFromPit: true, autoLaunchAnimTicks: 20, autoLaunchForceMult: 1.0,
    autoLaunchOptOut: true, autoLaunchOptOutWindowTicks: 20,
  });

  function handleLinkTypeChange(type: string) {
    setLinkType(type);
    setAlignment(defaultAlignment(type));
    setTraversal(defaultTraversal(type));
  }

  function handleSave() {
    const link: ArenaLink = {
      id: existing?.id ?? crypto.randomUUID(),
      fromArenaId, toArenaId,
      linkType: linkType as ArenaLink["linkType"],
      boundaryLine: existing?.boundaryLine ?? { x1: 0, y1: 0, x2: 50, y2: 0 },
      exitPosition: existing?.exitPosition ?? { x: 0, y: 0 },
      momentumPreserved: momentum,
      levelDelta,
      hazardDamage: hazardDamage > 0 ? hazardDamage : undefined,
      reverseCondition: reverseCondition as ArenaLink["reverseCondition"],
      exitVelocityMult,
      rotationCoupling: coupling as ArenaLink["rotationCoupling"],
      rotationDrivenRatio: coupling === "driven" ? drivenRatio : undefined,
      alignment,
      traversal,
      pitConfig:        linkType === "pit"        ? pitConfig        : undefined,
      trampolineConfig: linkType === "trampoline" ? trampolineConfig : undefined,
    };
    onSave(link);
  }

  const patchAlignment = (patch: Partial<ArenaLinkAlignmentConfig>) => setAlignment(a => ({ ...a, ...patch }));
  const patchTraversal = (patch: Partial<ArenaLinkTraversalConfig>) => setTraversal(t => ({ ...t, ...patch }));
  const patchTrampo   = (patch: Partial<ArenaLinkTrampolineConfig>) => setTrampolineConfig(t => ({ ...t, ...patch }));

  const selectedTypeMeta = LINK_TYPES.find(t => t.value === linkType);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[60]">
      <div className="bg-bg1 border border-border-c rounded-[20px] w-[660px] max-h-[92vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-theme-text m-0">
              {isNew ? "New Link" : "Edit Link"}
            </h2>
            <div className="text-xs text-theme-faint mt-1 font-mono">
              {fromArenaId} → {toArenaId}
            </div>
          </div>
          <button onClick={onClose} className="w-[30px] h-[30px] rounded-lg text-base cursor-pointer bg-bg3 text-theme-muted border-none">×</button>
        </div>

        {/* ── Link type selector ── */}
        <Section label="Link Type">
          <div className="grid gap-2 mb-[10px] [grid-template-columns:repeat(5,1fr)]">
            {LINK_TYPES.map(t => (
              <button key={t.value} onClick={() => handleLinkTypeChange(t.value)}
                className={cn(
                  "py-[10px] px-[6px] rounded-[10px] cursor-pointer text-center border",
                  linkType === t.value
                    ? "bg-theme-blue/15 border-theme-blue text-theme-blue"
                    : "bg-bg2 border-border-c text-theme-muted"
                )}>
                <div className="text-[20px]">{t.icon}</div>
                <div className="text-[11px] font-semibold mt-1">{t.label}</div>
              </button>
            ))}
          </div>
          <LinkCrossSectionDiagram linkType={linkType} />
          {selectedTypeMeta && (
            <div className="text-xs text-theme-muted px-[10px] py-2 bg-bg2 rounded-lg">
              {selectedTypeMeta.icon} {selectedTypeMeta.desc}
            </div>
          )}
        </Section>

        {/* ── Basic settings ── */}
        <Section label="Basic">
          <div className="grid gap-3 [grid-template-columns:1fr_1fr]">
            <Field label="Level delta (cm)" hint="Height difference between floors">
              <NumberInput value={levelDelta} onChange={setLevelDelta} min={0} max={2000} />
            </Field>
            <Field label="Exit velocity ×" hint="Speed multiplier on exit (trampoline = high)">
              <NumberInput value={exitVelocityMult} onChange={setExitVelocityMult} min={0.1} max={5} step={0.1} />
            </Field>
            <Field label="Hazard damage" hint="HP taken on traversal (0 = none)">
              <NumberInput value={hazardDamage} onChange={setHazardDamage} min={0} max={100} />
            </Field>
            <Field label="Direction">
              <SearchableSelect
                value={reverseCondition}
                options={[
                  { value: "always", label: "↕ Two-way (both directions)" },
                  { value: "never", label: "↓ One-way only (source → dest)" },
                  { value: "spin_above_50", label: "↕ Two-way if spin > 50%" },
                ]}
                onChange={v => setReverseCondition(v as "always" | "never" | "spin_above_50")}
                className="w-full bg-bg3 border border-border-c rounded-lg px-[10px] py-[6px] text-theme-text text-[13px] box-border"
              />
            </Field>
          </div>
          <Toggle label="Preserve momentum on exit" value={momentum} onChange={setMomentum} />
        </Section>

        {/* ── Rotation coupling ── */}
        <Section label="Rotation Coupling — how these two arenas rotate relative to each other">
          <div className="grid gap-2 mb-[10px] [grid-template-columns:repeat(2,1fr)]">
            {COUPLING_TYPES.map(ct => (
              <button key={ct.value} onClick={() => setCoupling(ct.value)}
                className={cn(
                  "px-[10px] py-2 rounded-lg cursor-pointer text-left border",
                  coupling === ct.value ? "border-current" : "bg-bg2 border-border-c"
                )}
                style={coupling === ct.value
                  ? { background: `color-mix(in srgb, ${ct.color} 15%, transparent)`, borderColor: ct.color }
                  : undefined
                }>
                <div className="flex items-center gap-[6px] mb-[2px]">
                  <span className={cn("text-sm font-mono", coupling === ct.value ? COLOR_TEXT[ct.color] : "text-theme-muted")}>{ct.symbol}</span>
                  <span className={cn("text-xs font-semibold", coupling === ct.value ? COLOR_TEXT[ct.color] : "text-theme-text")}>{ct.label}</span>
                </div>
                <div className="text-[11px] text-theme-muted">{ct.desc}</div>
              </button>
            ))}
          </div>
          {coupling === "driven" && (
            <Field label="Drive ratio" hint="destination speed = source speed × ratio (0.5 = half, 2.0 = double)">
              <NumberInput value={drivenRatio} onChange={setDrivenRatio} min={0.1} max={5} step={0.1} />
            </Field>
          )}
          <div className="text-[11px] text-theme-faint mt-2 px-2 py-[6px] bg-bg0 rounded-md">
            <strong className="text-theme-muted">Alignment impact:</strong> Synchronized/counter arenas have predictable alignment windows.
            Independent arenas may rarely align — use wider error margins for those.
          </div>
        </Section>

        {/* ── Alignment ── */}
        <Section label="Alignment & Rotation Gating">
          <div className="flex gap-2 mb-[10px]">
            {ALIGNMENT_MODES.map(m => (
              <button key={m.value}
                onClick={() => patchAlignment({ mode: m.value as ArenaLinkAlignmentConfig["mode"] })}
                className={cn(
                  "flex-1 py-[7px] px-[6px] rounded-lg cursor-pointer text-[11px] font-semibold text-center border",
                  alignment.mode === m.value ? COLOR_TEXT[m.color] : "text-theme-muted bg-bg2 border-border-c"
                )}
                style={alignment.mode === m.value
                  ? { background: `color-mix(in srgb, ${m.color} 15%, transparent)`, borderColor: m.color }
                  : undefined
                }>
                {m.label}
              </button>
            ))}
          </div>
          {(() => {
            const m = ALIGNMENT_MODES.find(x => x.value === alignment.mode);
            return m ? (
              <div className="text-[11px] text-theme-muted mb-[10px] px-[10px] py-[6px] bg-bg0 rounded-md">
                {m.desc}
              </div>
            ) : null;
          })()}

          <AlignmentCompassDiagram mode={alignment.mode} errorMarginDeg={alignment.errorMarginDeg} />

          {alignment.mode !== "none" && (
            <>
              <div className="grid gap-3 [grid-template-columns:1fr_1fr]">
                <Field label="Error margin (°)" hint="Degrees of rotation tolerance (green zone in diagram)">
                  <div>
                    <input type="range" min={1} max={45} value={alignment.errorMarginDeg}
                      onChange={e => patchAlignment({ errorMarginDeg: +e.target.value })}
                      className="w-full accent-theme-green" />
                    <div className="flex justify-between text-[11px] text-theme-faint">
                      <span>1° tight</span>
                      <span className="text-theme-green font-semibold">±{alignment.errorMarginDeg}°</span>
                      <span>45° loose</span>
                    </div>
                  </div>
                </Field>
                <Field label="Correction ticks" hint="Near-miss beys (within 2× margin) get a physics nudge toward alignment">
                  <NumberInput value={alignment.correctionTicks} onChange={v => patchAlignment({ correctionTicks: v })} min={0} max={60} />
                </Field>
                {alignment.mode === "owner-only" && (
                  <Field label="Owner arena ID" hint="Ramp physically belongs to this arena — only its angle is checked">
                    <input value={alignment.ownerArenaId ?? fromArenaId}
                      onChange={e => patchAlignment({ ownerArenaId: e.target.value })}
                      className="w-full bg-bg3 border border-border-c rounded-lg px-[10px] py-[6px] text-theme-text text-[13px] box-border" />
                  </Field>
                )}
              </div>
              <Toggle
                label="Disconnect when misaligned (link severs until arenas re-align)"
                value={alignment.disconnectsWhenMisaligned}
                onChange={v => patchAlignment({ disconnectsWhenMisaligned: v })}
              />
              {alignment.disconnectsWhenMisaligned && (
                <div className="mt-2">
                  <Field label="Reconnect cooldown (ticks)" hint="Min ticks after re-aligning before link becomes active again">
                    <NumberInput value={alignment.reconnectCooldownTicks}
                      onChange={v => patchAlignment({ reconnectCooldownTicks: v })} min={0} max={300} />
                  </Field>
                  <div className="text-[11px] text-theme-faint mt-1">
                    = {(alignment.reconnectCooldownTicks / 60).toFixed(2)}s cooldown after re-aligning @ 60 Hz
                  </div>
                </div>
              )}
            </>
          )}
        </Section>

        {/* ── Traversal timing ── */}
        <Section label="Traversal Timing">
          <div className="grid gap-3 [grid-template-columns:1fr_1fr_1fr]">
            <Field label="Transit ticks" hint="Ticks spent in transit animation">
              <NumberInput value={traversal.traversalTicks} onChange={v => patchTraversal({ traversalTicks: v })} min={1} max={120} />
            </Field>
            <Field label="Per-bey reuse (ticks)" hint="Same bey can't re-use link until this expires">
              <NumberInput value={traversal.perBeyReuseCooldownTicks} onChange={v => patchTraversal({ perBeyReuseCooldownTicks: v })} min={0} max={300} />
            </Field>
            <Field label="Global gap (ticks)" hint="Gap before next bey can enter after one exits">
              <NumberInput value={traversal.globalGapTicks} onChange={v => patchTraversal({ globalGapTicks: v })} min={0} max={120} />
            </Field>
          </div>
          <TraversalTimeline
            traversalTicks={traversal.traversalTicks}
            perBeyReuseCooldownTicks={traversal.perBeyReuseCooldownTicks}
            globalGapTicks={traversal.globalGapTicks}
          />
        </Section>

        {/* ── Pit config ── */}
        {linkType === "pit" && (
          <Section label="Pit Settings — gravity fall to floor below">
            <Field label="Landing mode" hint="Where the bey appears on the floor below">
              <div className="flex flex-col gap-[6px]">
                {LANDING_MODES.map(m => (
                  <label key={m.value} className="flex gap-[10px] items-start cursor-pointer">
                    <input type="radio" name="landingMode" value={m.value}
                      checked={pitConfig.landingMode === m.value}
                      onChange={() => setPitConfig({ landingMode: m.value })}
                      className="mt-[2px] accent-theme-red" />
                    <div>
                      <span className="text-[13px] text-theme-text font-semibold">{m.label}</span>
                      <div className="text-[11px] text-theme-muted">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Field>
            <div className="mt-2 text-[11px] text-theme-faint px-[10px] py-[6px] bg-bg0 rounded-md">
              Pits stay open regardless of rotation. The opening is wide so beys fall through at any angle.
              "Random" landing eliminates any need for tight alignment.
            </div>
          </Section>
        )}

        {/* ── Trampoline config ── */}
        {linkType === "trampoline" && (
          <Section label="Trampoline Settings — upward launch">
            <Toggle
              label="Auto-launch bey when it lands from pit above"
              value={trampolineConfig.autoLaunchFromPit}
              onChange={v => patchTrampo({ autoLaunchFromPit: v })}
            />
            {trampolineConfig.autoLaunchFromPit && (
              <>
                <div className="grid gap-3 mt-[10px] [grid-template-columns:1fr_1fr]">
                  <Field label="Launch animation ticks" hint="Visual bounce plays before bey re-enters pit opening">
                    <NumberInput value={trampolineConfig.autoLaunchAnimTicks} onChange={v => patchTrampo({ autoLaunchAnimTicks: v })} min={5} max={60} />
                  </Field>
                  <Field label="Launch force ×" hint="1.0 = match fall speed. Higher = further up.">
                    <NumberInput value={trampolineConfig.autoLaunchForceMult} onChange={v => patchTrampo({ autoLaunchForceMult: v })} min={0.5} max={3} step={0.1} />
                  </Field>
                </div>
                <div className="mt-3 px-[14px] py-3 bg-bg0 rounded-[10px] border border-border-c">
                  <Toggle
                    label="Allow player to cancel auto-launch (strategic floor-camping)"
                    value={trampolineConfig.autoLaunchOptOut}
                    onChange={v => patchTrampo({ autoLaunchOptOut: v })}
                  />
                  {trampolineConfig.autoLaunchOptOut && (
                    <>
                      <div className="text-xs text-theme-muted my-[10px] leading-[1.6] px-[10px] py-2 bg-bg2 rounded-lg">
                        During the bounce animation, the player can hold{" "}
                        <kbd className="bg-bg3 rounded px-[6px] py-[1px] text-[11px] text-theme-text border border-border-c">SPACE</kbd>
                        {" "}or{" "}
                        <kbd className="bg-bg3 rounded px-[6px] py-[1px] text-[11px] text-theme-text border border-border-c">↓</kbd>
                        {" "}to stay on this floor. This lets skilled players camp the lower floor strategically
                        instead of being forced back up.
                      </div>
                      <Field label="Opt-out window (ticks)" hint="Must be ≤ launch animation ticks">
                        <NumberInput
                          value={trampolineConfig.autoLaunchOptOutWindowTicks ?? trampolineConfig.autoLaunchAnimTicks}
                          onChange={v => patchTrampo({ autoLaunchOptOutWindowTicks: v })}
                          min={5} max={trampolineConfig.autoLaunchAnimTicks}
                        />
                      </Field>
                      <div className="text-[11px] text-theme-faint mt-1">
                        = {((trampolineConfig.autoLaunchOptOutWindowTicks ?? trampolineConfig.autoLaunchAnimTicks) / 60).toFixed(2)}s window to press the key
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </Section>
        )}

        {/* ── Footer ── */}
        <div className="flex gap-[10px] justify-end mt-5 pt-4 border-t border-border-c">
          <button onClick={onClose} className="px-4 py-2 bg-bg3 text-theme-text rounded-lg text-sm font-semibold border border-border-c">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-theme-blue text-white rounded-lg text-sm font-semibold">
            {isNew ? "Add Link" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] text-theme-faint font-semibold uppercase mb-[10px]">{label}</p>
      <div className="bg-bg2 rounded-[10px] border border-border-c p-[14px]">
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-theme-muted block mb-1">
        {label}
        {hint && <span className="text-theme-faint font-normal ml-1">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, min, max, step = 1 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number;
}) {
  return (
    <input type="number" value={value} min={min} max={max} step={step}
      onChange={e => onChange(+e.target.value)}
      className="w-full bg-bg3 border border-border-c rounded-lg px-[10px] py-[6px] text-theme-text text-[13px] box-border" />
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-[10px] cursor-pointer mt-2">
      <div onClick={() => onChange(!value)}
        className={cn(
          "w-9 h-5 rounded-[10px] relative flex-shrink-0 border transition-colors duration-200",
          value ? "bg-theme-blue border-theme-blue" : "bg-bg3 border-border-c"
        )}>
        <div className={cn(
          "absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-[left] duration-200",
          value ? "left-4" : "left-[2px]"
        )} />
      </div>
      <span className="text-[13px] text-theme-text">{label}</span>
    </label>
  );
}

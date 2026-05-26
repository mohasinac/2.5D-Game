// L4: Admin arena topology editor — list and edit ArenaLink + BeyLink connections.

import React, { useState } from "react";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import { cn } from "@/lib/cn";
import type { ArenaConfig, ArenaLink, BeyLink, BeyLinkType, BeyLinkAlignment, BeyLinkEffect, BeyLinkEffectType, BeyLinkMovementControl, BeyLinkGroupPattern, ArenaLinkAlignmentConfig } from "@/types/arenaConfigNew";
import { BeyLinkMovementGuide } from "@/components/admin/BeyLinkMovementGuide";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useBeyLinkConfigs } from "@/hooks/useBeyLinkConfigs";

interface Props {
  config: ArenaConfig;
  onChange: (patch: Partial<ArenaConfig>) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function newId(prefix = "link") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

const EMPTY_LINK: Omit<ArenaLink, "id"> = {
  fromArenaId: "",
  toArenaId: "",
  linkType: "corridor",
  boundaryLine: { x1: 0, y1: 0, x2: 100, y2: 0 },
  exitPosition: { x: 50, y: 50 },
  momentumPreserved: true,
  levelDelta: 0,
  reverseCondition: "always",
};

const TYPE_COLORS: Record<ArenaLink["linkType"], string> = {
  corridor: "#3b82f6",
  portal: "#a855f7",
  ramp: "#f97316",
  pit: "#ef4444",
  trampoline: "#22c55e",
};

const ALIGNMENT_COLORS: Record<BeyLinkAlignment, string> = {
  friendly: "#14b8a6",
  hostile: "#ef4444",
  neutral: "#6b7280",
};

const TYPE_CARD_CLASSES: Record<ArenaLink["linkType"], string> = {
  corridor: "border-blue-500/25",
  portal: "border-purple-500/25",
  ramp: "border-orange-500/25",
  pit: "border-red-500/25",
  trampoline: "border-green-500/25",
};
const TYPE_HEADER_CLASSES: Record<ArenaLink["linkType"], string> = {
  corridor: "bg-blue-500/[.07]",
  portal: "bg-purple-500/[.07]",
  ramp: "bg-orange-500/[.07]",
  pit: "bg-red-500/[.07]",
  trampoline: "bg-green-500/[.07]",
};
const TYPE_BADGE_CLASSES: Record<ArenaLink["linkType"], string> = {
  corridor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  portal: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ramp: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  pit: "bg-red-500/20 text-red-400 border-red-500/30",
  trampoline: "bg-green-500/20 text-green-400 border-green-500/30",
};
const ALIGN_CARD_CLASSES: Record<BeyLinkAlignment, string> = {
  friendly: "border-teal-400/25",
  hostile: "border-red-500/25",
  neutral: "border-gray-500/25",
};
const ALIGN_HEADER_CLASSES: Record<BeyLinkAlignment, string> = {
  friendly: "bg-teal-400/[.07]",
  hostile: "bg-red-500/[.07]",
  neutral: "bg-gray-500/[.07]",
};
const ALIGN_BADGE_CLASSES: Record<BeyLinkAlignment, string> = {
  friendly: "bg-teal-400/20 text-teal-400 border-teal-400/30",
  hostile: "bg-red-500/20 text-red-400 border-red-500/30",
  neutral: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

// ─── Shared form primitives ───────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-[11px] text-muted w-[140px] shrink-0">{label}</span>
      {children}
    </div>
  );
}

function NumInput({
  value,
  onChange,
  step = 1,
  wClass = "w-[70px]",
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  wClass?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      onChange={e => onChange(Number(e.target.value))}
      className={`bg-bg3 border border-border-c rounded-md text-theme-text text-[11px] py-[3px] px-1.5 ${wClass}`}
    />
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={e => onChange?.(e.target.value)}
      className={cn(
        "flex-1 border border-border-c rounded-md text-[11px] py-[3px] px-1.5",
        readOnly ? "bg-bg2 text-theme-muted" : "bg-bg3 text-theme-text",
      )}
    />
  );
}

// ─── Arena Link mini-diagram ──────────────────────────────────────────────────

function LinkDiagram({ link }: { link: ArenaLink }) {
  const { x1, y1, x2, y2 } = link.boundaryLine;
  const w = 160,
    h = 60;
  const minX = Math.min(x1, x2),
    maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2),
    maxY = Math.max(y1, y2);
  const rangeX = maxX - minX || 1,
    rangeY = maxY - minY || 1;
  const pad = 12;
  const sx = (v: number) => pad + ((v - minX) / rangeX) * (w - pad * 2);
  const sy = (v: number) => pad + ((v - minY) / rangeY) * (h - pad * 2);
  const lx1 = sx(x1),
    ly1 = sy(y1),
    lx2 = sx(x2),
    ly2 = sy(y2);
  const color = TYPE_COLORS[link.linkType] ?? "#3b82f6";
  return (
    <svg
      width={w}
      height={h}
      className="bg-bg0 rounded-lg block"
    >
      <line
        x1={lx1}
        y1={ly1}
        x2={lx2}
        y2={ly2}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="4 2"
      />
      <circle cx={lx1} cy={ly1} r={4} fill={color} />
      <circle cx={lx2} cy={ly2} r={4} fill={color} />
      <text x={w / 2} y={h - 4} textAnchor="middle" fontSize={9} fill="#6b7280">
        {link.fromArenaId || "src"} → {link.toArenaId || "dst"}
      </text>
    </svg>
  );
}

// ─── Arena Link card / editor ─────────────────────────────────────────────────

function ArenaLinkCard({
  link,
  allLinks,
  expanded,
  onToggle,
  onRemove,
  onUpdate,
  linkTypeOpts,
  reverseConditionOpts,
  configsLoading,
}: {
  link: ArenaLink;
  allLinks: ArenaLink[];
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<ArenaLink>) => void;
  linkTypeOpts: { value: string; label: string }[];
  reverseConditionOpts: { value: string; label: string }[];
  configsLoading: boolean;
}) {
  const typeColor = TYPE_COLORS[link.linkType] ?? "#3b82f6";
  const hasPair = !!link.pairedLinkId;

  function updateBoundary(field: keyof ArenaLink["boundaryLine"], val: number) {
    onUpdate({ boundaryLine: { ...link.boundaryLine, [field]: val } });
  }
  function updateExit(field: "x" | "y", val: number) {
    onUpdate({ exitPosition: { ...link.exitPosition, [field]: val } });
  }

  return (
    <div
      data-testid={`link-${link.id}`}
      className={cn("rounded-[10px] overflow-hidden border", TYPE_CARD_CLASSES[link.linkType] ?? "border-border-c")}
    >
      {/* Header */}
      <div
        className={cn("flex items-center gap-2.5 px-3 py-2 cursor-pointer", TYPE_HEADER_CLASSES[link.linkType] ?? "bg-bg2")}
        onClick={onToggle}
      >
        <span className={cn("text-[10px] font-bold rounded px-1.5 py-[1px] border", TYPE_BADGE_CLASSES[link.linkType] ?? "bg-bg3 text-theme-muted border-border-c")}>
          {link.linkType.toUpperCase()}
        </span>
        <span className="text-xs text-text flex-1">
          {link.fromArenaId || <span className="text-faint">from?</span>}
          <span className="text-muted mx-1.5">→</span>
          {link.toArenaId || <span className="text-faint">to?</span>}
        </span>
        {hasPair && (
          <span className="text-[10px] font-semibold bg-teal-400/[.13] text-teal-400 rounded px-1.5 py-[1px] border border-teal-400/30">
            ↔ Paired
          </span>
        )}
        <span className="text-[11px] text-muted">
          {link.momentumPreserved ? "momentum" : "rest"} · {link.reverseCondition ?? "always"}
        </span>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          data-testid={`remove-link-${link.id}`}
          className="bg-transparent border-none text-red cursor-pointer text-[13px] px-1 py-0"
        >
          ✕
        </button>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="p-3 bg-bg2 flex gap-4">
          {/* Left: fields */}
          <div className="flex-1">
            <FieldRow label="From Arena ID">
              <TextInput
                value={link.fromArenaId}
                onChange={v => onUpdate({ fromArenaId: v })}
                placeholder="arena doc id"
              />
            </FieldRow>
            <FieldRow label="To Arena ID">
              <TextInput
                value={link.toArenaId}
                onChange={v => onUpdate({ toArenaId: v })}
                placeholder="arena doc id"
              />
            </FieldRow>
            <FieldRow label="Link Type">
              <SearchableSelect
                value={link.linkType}
                options={linkTypeOpts}
                onChange={v => onUpdate({ linkType: v as ArenaLink["linkType"] })}
                disabled={configsLoading}
                emptyLabel={configsLoading ? "Loading…" : "No types found"}
              />
            </FieldRow>
            <FieldRow label="Reverse Condition">
              <SearchableSelect
                value={link.reverseCondition ?? "always"}
                options={reverseConditionOpts}
                onChange={v => onUpdate({ reverseCondition: v as NonNullable<ArenaLink["reverseCondition"]> })}
                disabled={configsLoading}
                emptyLabel={configsLoading ? "Loading…" : "No conditions found"}
              />
            </FieldRow>
            <FieldRow label="Momentum Preserved">
              <label className="flex items-center gap-1.5 text-[11px] text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={link.momentumPreserved}
                  onChange={e => onUpdate({ momentumPreserved: e.target.checked })}
                />
                Preserve velocity on crossing
              </label>
            </FieldRow>
            <FieldRow label="Level Delta (cm)">
              <NumInput value={link.levelDelta} onChange={v => onUpdate({ levelDelta: v })} />
            </FieldRow>
            <FieldRow label="Hazard Damage">
              <NumInput
                value={link.hazardDamage ?? 0}
                onChange={v => onUpdate({ hazardDamage: v })}
                step={0.1}
              />
            </FieldRow>
            <FieldRow label="Cooldown (ticks)">
              <NumInput
                value={link.cooldownTicks ?? 0}
                onChange={v => onUpdate({ cooldownTicks: v })}
              />
            </FieldRow>
            <FieldRow label="Exit Velocity Mult">
              <NumInput
                value={link.exitVelocityMult ?? 1}
                onChange={v => onUpdate({ exitVelocityMult: v })}
                step={0.1}
              />
            </FieldRow>
            {link.pairedLinkId && (
              <FieldRow label="Paired with">
                <TextInput value={link.pairedLinkId} readOnly />
              </FieldRow>
            )}

            <div className="mt-2.5 mb-1 text-[11px] font-semibold text-muted">
              Boundary Line (cm, arena coords)
            </div>
            <div className="flex gap-2 mb-1.5">
              <span className="text-[11px] text-faint w-4">x1</span>
              <NumInput
                value={link.boundaryLine.x1}
                onChange={v => updateBoundary("x1", v)}
              />
              <span className="text-[11px] text-faint w-4">y1</span>
              <NumInput
                value={link.boundaryLine.y1}
                onChange={v => updateBoundary("y1", v)}
              />
            </div>
            <div className="flex gap-2 mb-1.5">
              <span className="text-[11px] text-faint w-4">x2</span>
              <NumInput
                value={link.boundaryLine.x2}
                onChange={v => updateBoundary("x2", v)}
              />
              <span className="text-[11px] text-faint w-4">y2</span>
              <NumInput
                value={link.boundaryLine.y2}
                onChange={v => updateBoundary("y2", v)}
              />
            </div>

            <div className="mt-2 mb-1 text-[11px] font-semibold text-muted">
              Exit Position in Destination (cm)
            </div>
            <div className="flex gap-2">
              <span className="text-[11px] text-faint w-3">x</span>
              <NumInput value={link.exitPosition.x} onChange={v => updateExit("x", v)} />
              <span className="text-[11px] text-faint w-3">y</span>
              <NumInput value={link.exitPosition.y} onChange={v => updateExit("y", v)} />
            </div>

            {/* Rotation Coupling */}
            <div className="mt-2.5 pt-2 border-t border-border">
              <div className="text-[11px] font-semibold text-muted mb-1.5">Rotation Coupling</div>
              <div className="flex gap-1 flex-wrap mb-1.5">
                {(["independent", "synchronized", "counter", "driven"] as const).map(rc => (
                  <button key={rc} type="button" onClick={() => onUpdate({ rotationCoupling: rc })}
                    className={cn("py-[2px] px-[7px] rounded-[5px] text-[10px] cursor-pointer border transition-colors", (link.rotationCoupling ?? "independent") === rc ? "bg-theme-blue text-white border-theme-blue" : "bg-transparent text-theme-muted border-border-c hover:border-theme-blue")}>
                    {rc}
                  </button>
                ))}
              </div>
              {link.rotationCoupling === "driven" && (
                <FieldRow label="Driven Ratio (×)">
                  <NumInput value={(link as any).rotationDrivenRatio ?? 1} step={0.1}
                    onChange={v => onUpdate({ rotationDrivenRatio: v } as any)} />
                </FieldRow>
              )}
            </div>

            {/* Alignment config */}
            <div className="mt-2 pt-2 border-t border-border">
              <div className="text-[11px] font-semibold text-muted mb-1.5">Alignment</div>
              <div className="flex gap-1 flex-wrap mb-1.5">
                {(["none", "positional", "owner-only"] as const).map(m => (
                  <button key={m} type="button" onClick={() => onUpdate({ alignment: { ...(link.alignment ?? { mode: "none", errorMarginDeg: 10, correctionTicks: 10, disconnectsWhenMisaligned: false, reconnectCooldownTicks: 30 }), mode: m } })}
                    className={cn("py-[2px] px-[7px] rounded-[5px] text-[10px] cursor-pointer border transition-colors", (link.alignment?.mode ?? "none") === m ? "bg-theme-purple text-white border-theme-purple" : "bg-transparent text-theme-muted border-border-c hover:border-theme-purple")}>
                    {m}
                  </button>
                ))}
              </div>
              {link.alignment && link.alignment.mode !== "none" && (
                <>
                  <FieldRow label="Error Margin (°)">
                    <NumInput value={link.alignment.errorMarginDeg ?? 10} step={1}
                      onChange={v => onUpdate({ alignment: { ...link.alignment!, errorMarginDeg: v } })} />
                  </FieldRow>
                  <FieldRow label="Correction Ticks">
                    <NumInput value={link.alignment.correctionTicks ?? 10}
                      onChange={v => onUpdate({ alignment: { ...link.alignment!, correctionTicks: v } })} />
                  </FieldRow>
                  <FieldRow label="Disconnects When Misaligned">
                    <label className="flex items-center gap-1.5 text-[11px] text-text cursor-pointer">
                      <input type="checkbox" checked={link.alignment.disconnectsWhenMisaligned ?? false}
                        onChange={e => onUpdate({ alignment: { ...link.alignment!, disconnectsWhenMisaligned: e.target.checked } })} />
                      Gap shown when misaligned
                    </label>
                  </FieldRow>
                  <FieldRow label="Reconnect Cooldown (ticks)">
                    <NumInput value={link.alignment.reconnectCooldownTicks ?? 30}
                      onChange={v => onUpdate({ alignment: { ...link.alignment!, reconnectCooldownTicks: v } })} />
                  </FieldRow>
                </>
              )}
            </div>

            {/* Traversal config */}
            <div className="mt-2 pt-2 border-t border-border">
              <div className="text-[11px] font-semibold text-muted mb-1.5">Traversal Timing</div>
              <FieldRow label="Traversal Ticks">
                <NumInput value={link.traversal?.traversalTicks ?? 20}
                  onChange={v => onUpdate({ traversal: { ...(link.traversal ?? { traversalTicks: 20, perBeyReuseCooldownTicks: 30, globalGapTicks: 5 }), traversalTicks: v } })} />
              </FieldRow>
              <FieldRow label="Per-Bey Reuse Cooldown">
                <NumInput value={link.traversal?.perBeyReuseCooldownTicks ?? 30}
                  onChange={v => onUpdate({ traversal: { ...(link.traversal ?? { traversalTicks: 20, perBeyReuseCooldownTicks: 30, globalGapTicks: 5 }), perBeyReuseCooldownTicks: v } })} />
              </FieldRow>
              <FieldRow label="Global Gap Ticks">
                <NumInput value={link.traversal?.globalGapTicks ?? 5}
                  onChange={v => onUpdate({ traversal: { ...(link.traversal ?? { traversalTicks: 20, perBeyReuseCooldownTicks: 30, globalGapTicks: 5 }), globalGapTicks: v } })} />
              </FieldRow>
            </div>

            {/* Pit config */}
            {link.linkType === "pit" && (
              <div className="mt-2 pt-2 border-t border-border">
                <div className="text-[11px] font-semibold mb-1.5 text-theme-red">Pit Config</div>
                <FieldRow label="Landing Mode">
                  <div className="flex gap-1">
                    {(["fixed", "random", "current"] as const).map(m => (
                      <button key={m} type="button" onClick={() => onUpdate({ pitConfig: { landingMode: m } })}
                        className={cn("py-[2px] px-[7px] rounded-[5px] text-[10px] cursor-pointer border transition-colors", (link.pitConfig?.landingMode ?? "random") === m ? "bg-theme-red text-white border-theme-red" : "bg-transparent text-theme-muted border-border-c hover:border-theme-red")}>
                        {m}
                      </button>
                    ))}
                  </div>
                </FieldRow>
              </div>
            )}

            {/* Trampoline config */}
            {link.linkType === "trampoline" && (
              <div className="mt-2 pt-2 border-t border-border">
                <div className="text-[11px] font-semibold mb-1.5 text-theme-green">Trampoline Config</div>
                <FieldRow label="Auto-Launch from Pit">
                  <label className="flex items-center gap-1.5 text-[11px] text-text cursor-pointer">
                    <input type="checkbox" checked={link.trampolineConfig?.autoLaunchFromPit ?? false}
                      onChange={e => onUpdate({ trampolineConfig: { ...(link.trampolineConfig ?? { autoLaunchFromPit: false, autoLaunchAnimTicks: 20, autoLaunchForceMult: 1, autoLaunchOptOut: false }), autoLaunchFromPit: e.target.checked } })} />
                    Auto-launch bey back to pit above
                  </label>
                </FieldRow>
                <FieldRow label="Launch Anim (ticks)">
                  <NumInput value={link.trampolineConfig?.autoLaunchAnimTicks ?? 20}
                    onChange={v => onUpdate({ trampolineConfig: { ...(link.trampolineConfig ?? { autoLaunchFromPit: false, autoLaunchAnimTicks: 20, autoLaunchForceMult: 1, autoLaunchOptOut: false }), autoLaunchAnimTicks: v } })} />
                </FieldRow>
                <FieldRow label="Launch Force Mult">
                  <NumInput value={link.trampolineConfig?.autoLaunchForceMult ?? 1} step={0.1}
                    onChange={v => onUpdate({ trampolineConfig: { ...(link.trampolineConfig ?? { autoLaunchFromPit: false, autoLaunchAnimTicks: 20, autoLaunchForceMult: 1, autoLaunchOptOut: false }), autoLaunchForceMult: v } })} />
                </FieldRow>
                <FieldRow label="Opt-Out Allowed">
                  <label className="flex items-center gap-1.5 text-[11px] text-text cursor-pointer">
                    <input type="checkbox" checked={link.trampolineConfig?.autoLaunchOptOut ?? false}
                      onChange={e => onUpdate({ trampolineConfig: { ...(link.trampolineConfig ?? { autoLaunchFromPit: false, autoLaunchAnimTicks: 20, autoLaunchForceMult: 1, autoLaunchOptOut: false }), autoLaunchOptOut: e.target.checked } })} />
                    Player can hold SPACE to cancel launch
                  </label>
                </FieldRow>
              </div>
            )}
          </div>

          {/* Right: mini diagram */}
          <div className="flex flex-col gap-2 items-center">
            <div className="text-[10px] text-faint">Boundary Preview</div>
            <LinkDiagram link={link} />
            <div className="text-[10px] text-faint text-center">
              ({link.boundaryLine.x1},{link.boundaryLine.y1}) → ({link.boundaryLine.x2},
              {link.boundaryLine.y2})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bey Link card / editor ───────────────────────────────────────────────────

function BeyLinkCard({
  link,
  expanded,
  onToggle,
  onRemove,
  onUpdate,
  beyLinkTypeOpts,
  alignmentOpts,
  triggerConditionOpts,
  effectTypeOpts,
  controlModeOpts,
  movementControlOpts,
  groupPatternOpts,
  configsLoading,
}: {
  link: BeyLink;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<BeyLink>) => void;
  beyLinkTypeOpts: { value: string; label: string }[];
  alignmentOpts: { value: string; label: string }[];
  triggerConditionOpts: { value: string; label: string }[];
  effectTypeOpts: { value: string; label: string }[];
  controlModeOpts: { value: string; label: string }[];
  movementControlOpts: { value: string; label: string }[];
  groupPatternOpts: { value: string; label: string }[];
  configsLoading: boolean;
}) {
  const alignColor = ALIGNMENT_COLORS[link.alignment];

  return (
    <div
      data-testid={`bey-link-${link.id}`}
      className={cn("rounded-[10px] overflow-hidden border", ALIGN_CARD_CLASSES[link.alignment] ?? "border-border-c")}
    >
      {/* Header */}
      <div
        className={cn("flex items-center gap-2.5 px-3 py-2 cursor-pointer", ALIGN_HEADER_CLASSES[link.alignment] ?? "bg-bg2")}
        onClick={onToggle}
      >
        <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 rounded px-1.5 py-[1px] border border-indigo-500/30">
          {link.linkType.replace("_", " ").toUpperCase()}
        </span>
        <span className={cn("text-[10px] font-bold rounded px-1.5 py-[1px] border", ALIGN_BADGE_CLASSES[link.alignment] ?? "bg-bg3 text-theme-muted border-border-c")}>
          {link.alignment.toUpperCase()}
        </span>
        <span className="text-xs text-text flex-1">
          radius {link.entryRadiusCm}cm · {link.triggerCondition}
        </span>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          data-testid={`remove-bey-link-${link.id}`}
          className="bg-transparent border-none text-red cursor-pointer text-[13px] px-1 py-0"
        >
          ✕
        </button>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="p-3 bg-bg2">
          <FieldRow label="Link Type">
            <SearchableSelect
              value={link.linkType}
              options={beyLinkTypeOpts}
              onChange={v => onUpdate({ linkType: v as BeyLinkType })}
              disabled={configsLoading}
              emptyLabel={configsLoading ? "Loading…" : "No types found"}
            />
          </FieldRow>
          <FieldRow label="Alignment">
            <SearchableSelect
              value={link.alignment}
              options={alignmentOpts}
              onChange={v => onUpdate({ alignment: v as BeyLinkAlignment })}
              disabled={configsLoading}
              emptyLabel={configsLoading ? "Loading…" : "No alignments found"}
            />
          </FieldRow>
          <FieldRow label="Entry Radius (cm)">
            <NumInput
              value={link.entryRadiusCm}
              onChange={v => onUpdate({ entryRadiusCm: v })}
              step={0.5}
            />
          </FieldRow>
          <FieldRow label="Trigger Condition">
            <SearchableSelect
              value={link.triggerCondition}
              options={triggerConditionOpts}
              onChange={v => onUpdate({ triggerCondition: v as BeyLink["triggerCondition"] })}
              disabled={configsLoading}
              emptyLabel={configsLoading ? "Loading…" : "No conditions found"}
            />
          </FieldRow>
          <FieldRow label="Cooldown (ticks)">
            <NumInput value={link.cooldownTicks ?? 0} onChange={v => onUpdate({ cooldownTicks: v })} />
          </FieldRow>
          <FieldRow label="Max Simultaneous">
            <NumInput value={link.maxSimultaneous ?? 2} onChange={v => onUpdate({ maxSimultaneous: v })} />
          </FieldRow>

          {/* Duration and break conditions */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-[11px] font-semibold text-muted mb-1.5">Break Conditions</div>
            <FieldRow label="Max Duration (ticks)">
              <NumInput value={link.maxDurationTicks ?? 0} onChange={v => onUpdate({ maxDurationTicks: v || undefined })} />
              <span className="text-[10px] text-faint ml-1">0 = unlimited</span>
            </FieldRow>
            <FieldRow label="Break Threshold">
              <NumInput value={link.breakThreshold ?? 0} step={5} onChange={v => onUpdate({ breakThreshold: v || undefined })} />
              <span className="text-[10px] text-faint ml-1">collision force (0 = unbreakable)</span>
            </FieldRow>
            <FieldRow label="Break on Ring Edge">
              <label className="flex items-center gap-1.5 text-[11px] text-text cursor-pointer">
                <input type="checkbox" checked={link.breakOnRingOut ?? false}
                  onChange={e => onUpdate({ breakOnRingOut: e.target.checked })} />
                Break when participant nears ring-out
              </label>
            </FieldRow>
          </div>

          {/* Friendly boost fields */}
          {link.alignment === "friendly" && (
            <div className="mt-2.5">
              <div className="text-[11px] font-semibold mb-1.5 text-teal-400">
                Friendly Boost
              </div>
              <FieldRow label="Damage Mult Bonus">
                <NumInput
                  value={link.friendlyBoost?.damageMultiplierBonus ?? 0}
                  onChange={v =>
                    onUpdate({
                      friendlyBoost: {
                        damageMultiplierBonus: v,
                        spinTransferRate: link.friendlyBoost?.spinTransferRate ?? 0,
                        shieldBonus: link.friendlyBoost?.shieldBonus ?? 0,
                        durationTicks: link.friendlyBoost?.durationTicks ?? 60,
                      },
                    })
                  }
                  step={0.05}
                />
              </FieldRow>
              <FieldRow label="Spin Transfer Rate">
                <NumInput
                  value={link.friendlyBoost?.spinTransferRate ?? 0}
                  onChange={v =>
                    onUpdate({
                      friendlyBoost: {
                        damageMultiplierBonus:
                          link.friendlyBoost?.damageMultiplierBonus ?? 0,
                        spinTransferRate: v,
                        shieldBonus: link.friendlyBoost?.shieldBonus ?? 0,
                        durationTicks: link.friendlyBoost?.durationTicks ?? 60,
                      },
                    })
                  }
                  step={0.001}
                />
              </FieldRow>
              <FieldRow label="Shield Bonus">
                <NumInput
                  value={link.friendlyBoost?.shieldBonus ?? 0}
                  onChange={v =>
                    onUpdate({
                      friendlyBoost: {
                        damageMultiplierBonus:
                          link.friendlyBoost?.damageMultiplierBonus ?? 0,
                        spinTransferRate: link.friendlyBoost?.spinTransferRate ?? 0,
                        shieldBonus: v,
                        durationTicks: link.friendlyBoost?.durationTicks ?? 60,
                      },
                    })
                  }
                  step={0.01}
                />
              </FieldRow>
              <FieldRow label="Duration (ticks)">
                <NumInput
                  value={link.friendlyBoost?.durationTicks ?? 60}
                  onChange={v =>
                    onUpdate({
                      friendlyBoost: {
                        damageMultiplierBonus:
                          link.friendlyBoost?.damageMultiplierBonus ?? 0,
                        spinTransferRate: link.friendlyBoost?.spinTransferRate ?? 0,
                        shieldBonus: link.friendlyBoost?.shieldBonus ?? 0,
                        durationTicks: v,
                      },
                    })
                  }
                />
              </FieldRow>
            </div>
          )}

          {/* Hostile effect fields */}
          {link.alignment === "hostile" && (
            <div className="mt-2.5">
              <div className="text-[11px] font-semibold mb-1.5 text-theme-red">
                Hostile Effect
              </div>
              <FieldRow label="Bit-Chip Dmg/Tick">
                <NumInput
                  value={link.hostileEffect?.bitChipDamagePerTick ?? 0}
                  onChange={v =>
                    onUpdate({
                      hostileEffect: {
                        bitChipDamagePerTick: v,
                        spinDrainPerTick: link.hostileEffect?.spinDrainPerTick ?? 0,
                        destabilizeForce: link.hostileEffect?.destabilizeForce ?? 0,
                        maxDurationTicks: link.hostileEffect?.maxDurationTicks ?? 120,
                      },
                    })
                  }
                  step={0.5}
                />
              </FieldRow>
              <FieldRow label="Spin Drain/Tick">
                <NumInput
                  value={link.hostileEffect?.spinDrainPerTick ?? 0}
                  onChange={v =>
                    onUpdate({
                      hostileEffect: {
                        bitChipDamagePerTick:
                          link.hostileEffect?.bitChipDamagePerTick ?? 0,
                        spinDrainPerTick: v,
                        destabilizeForce: link.hostileEffect?.destabilizeForce ?? 0,
                        maxDurationTicks: link.hostileEffect?.maxDurationTicks ?? 120,
                      },
                    })
                  }
                  step={0.5}
                />
              </FieldRow>
              <FieldRow label="Destabilize Force">
                <NumInput
                  value={link.hostileEffect?.destabilizeForce ?? 0}
                  onChange={v =>
                    onUpdate({
                      hostileEffect: {
                        bitChipDamagePerTick:
                          link.hostileEffect?.bitChipDamagePerTick ?? 0,
                        spinDrainPerTick: link.hostileEffect?.spinDrainPerTick ?? 0,
                        destabilizeForce: v,
                        maxDurationTicks: link.hostileEffect?.maxDurationTicks ?? 120,
                      },
                    })
                  }
                  step={0.5}
                />
              </FieldRow>
              <FieldRow label="Max Duration (ticks)">
                <NumInput
                  value={link.hostileEffect?.maxDurationTicks ?? 120}
                  onChange={v =>
                    onUpdate({
                      hostileEffect: {
                        bitChipDamagePerTick:
                          link.hostileEffect?.bitChipDamagePerTick ?? 0,
                        spinDrainPerTick: link.hostileEffect?.spinDrainPerTick ?? 0,
                        destabilizeForce: link.hostileEffect?.destabilizeForce ?? 0,
                        maxDurationTicks: v,
                      },
                    })
                  }
                />
              </FieldRow>
            </div>
          )}

          {/* ── QTE Escape (hostile only) ─────────────────────────────────── */}
          {link.alignment === "hostile" && (
            <div className="mt-2.5 pt-2 border-t border-border">
              <div className="text-[11px] font-semibold mb-1.5 text-theme-yellow">QTE Escape</div>
              <FieldRow label="QTE Escapable">
                <label className="flex items-center gap-1.5 text-[11px] text-text cursor-pointer">
                  <input type="checkbox" checked={link.qteEscapable ?? false}
                    onChange={e => onUpdate({ qteEscapable: e.target.checked })} />
                  Victim can press a key to break free
                </label>
              </FieldRow>
              {link.qteEscapable && (
                <FieldRow label="QTE Window (ticks)">
                  <NumInput value={link.qteWindowTicks ?? 60} onChange={v => onUpdate({ qteWindowTicks: v })} />
                </FieldRow>
              )}
            </div>
          )}

          {/* ── Movement Control ──────────────────────────────────────────── */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-[11px] font-semibold text-muted mb-1.5">Movement Control</div>
            <FieldRow label="Control Mode">
              <SearchableSelect
                value={link.movementControl ?? "auto"}
                options={movementControlOpts}
                onChange={v => onUpdate({ movementControl: v as BeyLinkMovementControl })}
                disabled={configsLoading}
                emptyLabel={configsLoading ? "Loading…" : "No modes found"}
              />
            </FieldRow>
            <FieldRow label="Group Pattern">
              <SearchableSelect
                value={link.groupPattern ?? ""}
                options={groupPatternOpts}
                onChange={v => onUpdate({ groupPattern: v ? v as BeyLinkGroupPattern : undefined })}
                disabled={configsLoading}
                emptyLabel="— (pairwise only)"
              />
              <span className="text-[10px] text-faint ml-1">applies when 3+ beys share this link</span>
            </FieldRow>
            {(link.movementControl && link.movementControl !== "auto") && (
              <div className="text-[10px] mt-1 py-1 px-1.5 rounded bg-violet-400/[.07] text-violet-400">
                {link.movementControl === "initiator"
                  ? "sidA (link initiator) steers the entire formation via WASD."
                  : "Any human-controlled bey in the group steers the formation."}
              </div>
            )}
          </div>

          {/* ── Hijack ────────────────────────────────────────────────────── */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-[11px] font-semibold text-muted mb-1.5">Hijack</div>
            <FieldRow label="Hijackable">
              <label className="flex items-center gap-1.5 text-[11px] text-text cursor-pointer">
                <input type="checkbox" checked={link.hijackable ?? false}
                  onChange={e => onUpdate({ hijackable: e.target.checked })} />
                Victim can attempt to seize control
              </label>
            </FieldRow>
            {link.hijackable && (
              <>
                <FieldRow label="Hijack Window (ticks)">
                  <NumInput value={link.hijackWindowTicks ?? 90} onChange={v => onUpdate({ hijackWindowTicks: v })} />
                  <span className="text-[10px] text-faint ml-1">attacker must block within this window</span>
                </FieldRow>
                <FieldRow label="Cooldown (ticks)">
                  <NumInput value={link.hijackCooldownTicks ?? 180} onChange={v => onUpdate({ hijackCooldownTicks: v })} />
                  <span className="text-[10px] text-faint ml-1">applied to both beys after attempt</span>
                </FieldRow>
                <div className="text-[10px] mt-1 py-1 px-1.5 rounded bg-orange-500/[.07] text-theme-orange">
                  On hijack success: roles reverse. Former victim becomes sidA (initiator). Former attacker suffers effects instead.
                </div>
              </>
            )}
          </div>

          {/* ── Composable Link Effects ───────────────────────────────────── */}
          <div className="mt-2.5 pt-2 border-t border-border">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-semibold text-muted">Link Effects ({link.linkEffects?.length ?? 0})</span>
              <button type="button"
                onClick={() => {
                  const next: BeyLinkEffect = { type: "spin_drain", intensityPerTick: 1 };
                  onUpdate({ linkEffects: [...(link.linkEffects ?? []), next] });
                }}
                className="text-[10px] py-[2px] px-2 rounded cursor-pointer text-theme-purple bg-theme-purple/[.13] border border-theme-purple/25">
                + Add Effect
              </button>
            </div>
            {(link.linkEffects ?? []).map((eff, ei) => (
              <div key={ei} className="bg-bg3 rounded-lg mb-1.5 p-2 px-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <SearchableSelect
                    value={eff.type}
                    options={effectTypeOpts}
                    onChange={v => {
                      const updated = [...(link.linkEffects ?? [])];
                      updated[ei] = { ...eff, type: v as BeyLinkEffectType };
                      onUpdate({ linkEffects: updated });
                    }}
                    disabled={configsLoading}
                    emptyLabel={configsLoading ? "Loading…" : "No effect types found"}
                  />
                  <button type="button"
                    onClick={() => {
                      const updated = (link.linkEffects ?? []).filter((_, i) => i !== ei);
                      onUpdate({ linkEffects: updated });
                    }}
                    className="bg-transparent border-none text-red cursor-pointer text-xs px-[2px]">✕</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <label className="text-[10px] text-muted flex items-center gap-1">
                    intensity/tick
                    <NumInput value={eff.intensityPerTick ?? 1} step={0.5}
                      onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, intensityPerTick: v }; onUpdate({ linkEffects: u }); }} wClass="w-[55px]" />
                  </label>
                  <label className="text-[10px] text-muted flex items-center gap-1">
                    interval ticks
                    <NumInput value={eff.intervalTicks ?? 10}
                      onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, intervalTicks: v }; onUpdate({ linkEffects: u }); }} wClass="w-[55px]" />
                  </label>
                  <label className="text-[10px] text-muted flex items-center gap-1">
                    impact mult
                    <NumInput value={eff.impactMult ?? 1} step={0.1}
                      onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, impactMult: v }; onUpdate({ linkEffects: u }); }} wClass="w-[55px]" />
                  </label>
                  {eff.type === "control_loss" && (
                    <>
                      <label className="text-[10px] text-muted flex items-center gap-1">
                        mode
                        <SearchableSelect
                          value={eff.controlMode ?? "reverse"}
                          options={controlModeOpts}
                          onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, controlMode: v as BeyLinkEffect["controlMode"] }; onUpdate({ linkEffects: u }); }}
                          disabled={configsLoading}
                          className="bg-bg2 border border-border-c rounded text-theme-text text-[10px] w-full py-0.5 px-1.5"
                        />
                      </label>
                      <label className="text-[10px] text-muted flex items-center gap-1">
                        duration ticks
                        <NumInput value={eff.controlDurationTicks ?? 60}
                          onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, controlDurationTicks: v }; onUpdate({ linkEffects: u }); }} wClass="w-[55px]" />
                      </label>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LinksTab({ config, onChange }: Props) {
  const links: ArenaLink[] = (config as any).links ?? [];
  const beyLinks: BeyLink[] = (config as any).beyLinks ?? [];
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  const [expandedBeyLinkId, setExpandedBeyLinkId] = useState<string | null>(null);
  const [showMovementGuide, setShowMovementGuide] = useState(false);

  const { byCategory, loading: configsLoading } = useBeyLinkConfigs();
  const toOpts = (items: { id: string; label: string }[]) => items.map(i => ({ value: i.id, label: i.label }));
  const linkTypeOpts = toOpts(byCategory.link_type);
  const reverseConditionOpts = toOpts(byCategory.reverse_condition);
  const beyLinkTypeOpts = toOpts(byCategory.bey_link_type);
  const alignmentOpts = toOpts(byCategory.alignment);
  const triggerConditionOpts = toOpts(byCategory.trigger_condition);
  const effectTypeOpts = toOpts(byCategory.effect_type);
  const controlModeOpts = toOpts(byCategory.control_mode);
  const movementControlOpts = toOpts(byCategory.movement_control);
  const groupPatternOpts = toOpts(byCategory.group_pattern);

  // ── Arena Link helpers ──────────────────────────────────────────────────────

  function updateLinks(next: ArenaLink[]) {
    onChange({ links: next } as any);
  }

  function addLink() {
    const link: ArenaLink = { ...EMPTY_LINK, id: newId("link") };
    const next = [...links, link];
    updateLinks(next);
    setExpandedLinkId(link.id);
  }

  function addLinkPair() {
    const idA = newId("link");
    const idB = newId("link");
    const linkA: ArenaLink = {
      ...EMPTY_LINK,
      id: idA,
      pairedLinkId: idB,
      boundaryLine: { x1: -50, y1: 0, x2: -40, y2: 0 },
    };
    const linkB: ArenaLink = {
      ...EMPTY_LINK,
      id: idB,
      pairedLinkId: idA,
      boundaryLine: { x1: 40, y1: 0, x2: 50, y2: 0 },
    };
    const next = [...links, linkA, linkB];
    updateLinks(next);
    setExpandedLinkId(idA);
  }

  function removeLink(id: string) {
    const link = links.find(l => l.id === id);
    const partnerId = link?.pairedLinkId;
    if (partnerId) {
      const proceed = window.confirm(
        "This link is paired. Delete both this link and its partner?"
      );
      if (!proceed) return;
      updateLinks(links.filter(l => l.id !== id && l.id !== partnerId));
      if (expandedLinkId === id || expandedLinkId === partnerId) setExpandedLinkId(null);
    } else {
      updateLinks(links.filter(l => l.id !== id));
      if (expandedLinkId === id) setExpandedLinkId(null);
    }
  }

  function updateLink(id: string, patch: Partial<ArenaLink>) {
    updateLinks(links.map(l => (l.id === id ? { ...l, ...patch } : l)));
  }

  // ── Bey Link helpers ────────────────────────────────────────────────────────

  function updateBeyLinks(next: BeyLink[]) {
    onChange({ beyLinks: next } as any);
  }

  function addBeyLink() {
    const bl: BeyLink = {
      id: newId("bey"),
      linkType: "tip_stack",
      alignment: "hostile",
      entryRadiusCm: 3,
      triggerCondition: "any",
    };
    updateBeyLinks([...beyLinks, bl]);
    setExpandedBeyLinkId(bl.id);
  }

  function removeBeyLink(id: string) {
    updateBeyLinks(beyLinks.filter(b => b.id !== id));
    if (expandedBeyLinkId === id) setExpandedBeyLinkId(null);
  }

  function updateBeyLink(id: string, patch: Partial<BeyLink>) {
    updateBeyLinks(beyLinks.map(b => (b.id === id ? { ...b, ...patch } : b)));
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <CollapsibleSection title="Links" badge={links.length + beyLinks.length} storageKey="arena-links-main" defaultOpen={true}>
    <div>
      {/* ===== Section 1: Arena Links ===== */}
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-[13px] font-semibold text-text">
          Arena Links ({links.length})
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addLinkPair}
            data-testid="add-pair-btn"
            className="text-xs py-[5px] px-3.5 rounded-lg cursor-pointer bg-teal-400/[.13] border border-teal-400/[.33] text-teal-400"
          >
            + Add Pair
          </button>
          <button
            type="button"
            onClick={addLink}
            data-testid="add-link-btn"
            className="text-xs py-[5px] px-3.5 rounded-lg cursor-pointer bg-theme-purple/[.13] border border-theme-purple/[.33] text-theme-purple"
          >
            + Add Link
          </button>
        </div>
      </div>

      {links.length === 0 && (
        <div className="text-center text-faint text-xs py-6 border-2 border-dashed border-border rounded-xl mb-2">
          No arena links yet. Add one to connect this arena to another, or use Add Pair to create a
          two-way link.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {links.map(link => (
          <ArenaLinkCard
            key={link.id}
            link={link}
            allLinks={links}
            expanded={expandedLinkId === link.id}
            onToggle={() => setExpandedLinkId(expandedLinkId === link.id ? null : link.id)}
            onRemove={() => removeLink(link.id)}
            onUpdate={patch => updateLink(link.id, patch)}
            linkTypeOpts={linkTypeOpts}
            reverseConditionOpts={reverseConditionOpts}
            configsLoading={configsLoading}
          />
        ))}
      </div>

      {/* ===== Divider ===== */}
      <div className="border-t border-border my-6 mb-4" />

      {/* ===== Section 2: Bey Links ===== */}
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-[13px] font-semibold text-text">
          Bey Links ({beyLinks.length})
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowMovementGuide(true)}
            title="View movement pattern guide"
            className="text-xs py-[5px] px-2.5 rounded-lg cursor-pointer bg-indigo-400/[.13] border border-indigo-400/[.33] text-indigo-400"
          >? Guide</button>
          <button
            type="button"
            onClick={addBeyLink}
            data-testid="add-bey-link-btn"
            className="text-xs py-[5px] px-3.5 rounded-lg cursor-pointer bg-theme-red/[.13] border border-theme-red/[.33] text-theme-red"
          >
            + Add Bey Link
          </button>
        </div>
      </div>

      {showMovementGuide && <BeyLinkMovementGuide onClose={() => setShowMovementGuide(false)} />}

      {beyLinks.length === 0 && (
        <div className="text-center text-faint text-xs py-6 border-2 border-dashed border-border rounded-xl">
          No bey links yet. Add one to configure bey-to-bey stacking interactions (hostile
          bit-chip attacks, friendly spin transfers).
        </div>
      )}

      <div className="flex flex-col gap-2">
        {beyLinks.map(bl => (
          <BeyLinkCard
            key={bl.id}
            link={bl}
            expanded={expandedBeyLinkId === bl.id}
            onToggle={() =>
              setExpandedBeyLinkId(expandedBeyLinkId === bl.id ? null : bl.id)
            }
            onRemove={() => removeBeyLink(bl.id)}
            onUpdate={patch => updateBeyLink(bl.id, patch)}
            beyLinkTypeOpts={beyLinkTypeOpts}
            alignmentOpts={alignmentOpts}
            triggerConditionOpts={triggerConditionOpts}
            effectTypeOpts={effectTypeOpts}
            controlModeOpts={controlModeOpts}
            movementControlOpts={movementControlOpts}
            groupPatternOpts={groupPatternOpts}
            configsLoading={configsLoading}
          />
        ))}
      </div>
    </div>
    </CollapsibleSection>
  );
}

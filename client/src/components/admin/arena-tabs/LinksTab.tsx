// L4: Admin arena topology editor — list and edit ArenaLink + BeyLink connections.

import React, { useState } from "react";
import { C } from "@/styles/theme";
import type { ArenaConfig, ArenaLink, BeyLink, BeyLinkType, BeyLinkAlignment, BeyLinkEffect, BeyLinkEffectType, BeyLinkMovementControl, BeyLinkGroupPattern } from "@/types/arenaConfigNew";
import { BeyLinkMovementGuide } from "@/components/admin/BeyLinkMovementGuide";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

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

const LINK_TYPES: ArenaLink["linkType"][] = ["corridor", "portal", "ramp", "pit", "trampoline"];
const REVERSE_CONDITIONS: NonNullable<ArenaLink["reverseCondition"]>[] = ["always", "never", "spin_above_50"];
const TYPE_COLORS: Record<ArenaLink["linkType"], string> = {
  corridor: "#3b82f6",
  portal: "#a855f7",
  ramp: "#f97316",
  pit: "#ef4444",
  trampoline: "#22c55e",
};

const BEY_LINK_TYPES: BeyLinkType[] = ["tip_stack", "top_mount", "side_spin"];
const BEY_LINK_ALIGNMENTS: BeyLinkAlignment[] = ["friendly", "hostile", "neutral"];
const TRIGGER_CONDITIONS: BeyLink["triggerCondition"][] = ["any", "same_team", "opponent_only"];
const BEY_LINK_EFFECT_TYPES: BeyLinkEffectType[] = [
  "spin_drain", "spin_share", "spin_heal", "damage_boost", "shield_boost",
  "destabilize", "continuous_collision", "drill_attack", "control_loss", "force_lock",
];
const CONTROL_MODES: NonNullable<BeyLinkEffect["controlMode"]>[] = ["reverse", "scramble", "freeze"];
const MOVEMENT_CONTROLS: BeyLinkMovementControl[] = ["auto", "initiator", "player"];
const GROUP_PATTERNS: BeyLinkGroupPattern[] = ["chain", "star", "wedge", "rigid"];

const ALIGNMENT_COLORS: Record<BeyLinkAlignment, string> = {
  friendly: "#14b8a6",
  hostile: "#ef4444",
  neutral: "#6b7280",
};

// ─── Shared form primitives ───────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: C.muted, width: 140, flexShrink: 0 }}>{label}</span>
      {children}
    </div>
  );
}

function NumInput({
  value,
  onChange,
  step = 1,
  style,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{
        width: 70,
        background: "var(--bg3,#1a1a2e)",
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: "3px 6px",
        color: C.text,
        fontSize: 11,
        ...style,
      }}
    />
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  readOnly,
  style,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={e => onChange?.(e.target.value)}
      style={{
        flex: 1,
        background: readOnly ? "var(--bg2,#0d0d1a)" : "var(--bg3,#1a1a2e)",
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: "3px 6px",
        color: readOnly ? C.muted : C.text,
        fontSize: 11,
        ...style,
      }}
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
      style={{ background: "#111827", borderRadius: 8, display: "block" }}
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
}: {
  link: ArenaLink;
  allLinks: ArenaLink[];
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<ArenaLink>) => void;
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
      style={{ border: `1px solid ${typeColor}44`, borderRadius: 10, overflow: "hidden" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          background: typeColor + "11",
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            background: typeColor + "33",
            color: typeColor,
            borderRadius: 4,
            padding: "1px 6px",
          }}
        >
          {link.linkType.toUpperCase()}
        </span>
        <span style={{ fontSize: 12, color: C.text, flex: 1 }}>
          {link.fromArenaId || <span style={{ color: C.faint }}>from?</span>}
          <span style={{ color: C.muted, margin: "0 6px" }}>→</span>
          {link.toArenaId || <span style={{ color: C.faint }}>to?</span>}
        </span>
        {hasPair && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              background: "#14b8a622",
              color: "#14b8a6",
              borderRadius: 4,
              padding: "1px 6px",
            }}
          >
            ↔ Paired
          </span>
        )}
        <span style={{ fontSize: 11, color: C.muted }}>
          {link.momentumPreserved ? "momentum" : "rest"} · {link.reverseCondition ?? "always"}
        </span>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          data-testid={`remove-link-${link.id}`}
          style={{
            background: "transparent",
            border: "none",
            color: C.red,
            cursor: "pointer",
            fontSize: 13,
            padding: "0 4px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div
          style={{
            padding: "12px 14px",
            background: "var(--bg2,#0d0d1a)",
            display: "flex",
            gap: 16,
          }}
        >
          {/* Left: fields */}
          <div style={{ flex: 1 }}>
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
                options={LINK_TYPES.map(o => ({ value: o, label: o }))}
                onChange={v => onUpdate({ linkType: v as ArenaLink["linkType"] })}
                style={{ flex: 1, background: "var(--bg3,#1a1a2e)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
              />
            </FieldRow>
            <FieldRow label="Reverse Condition">
              <SearchableSelect
                value={link.reverseCondition ?? "always"}
                options={REVERSE_CONDITIONS.map(o => ({ value: o, label: o }))}
                onChange={v => onUpdate({ reverseCondition: v as NonNullable<ArenaLink["reverseCondition"]> })}
                style={{ flex: 1, background: "var(--bg3,#1a1a2e)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
              />
            </FieldRow>
            <FieldRow label="Momentum Preserved">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: C.text,
                  cursor: "pointer",
                }}
              >
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

            <div
              style={{
                marginTop: 10,
                marginBottom: 4,
                fontSize: 11,
                fontWeight: 600,
                color: C.muted,
              }}
            >
              Boundary Line (cm, arena coords)
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: C.faint, width: 16 }}>x1</span>
              <NumInput
                value={link.boundaryLine.x1}
                onChange={v => updateBoundary("x1", v)}
              />
              <span style={{ fontSize: 11, color: C.faint, width: 16 }}>y1</span>
              <NumInput
                value={link.boundaryLine.y1}
                onChange={v => updateBoundary("y1", v)}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: C.faint, width: 16 }}>x2</span>
              <NumInput
                value={link.boundaryLine.x2}
                onChange={v => updateBoundary("x2", v)}
              />
              <span style={{ fontSize: 11, color: C.faint, width: 16 }}>y2</span>
              <NumInput
                value={link.boundaryLine.y2}
                onChange={v => updateBoundary("y2", v)}
              />
            </div>

            <div
              style={{
                marginTop: 8,
                marginBottom: 4,
                fontSize: 11,
                fontWeight: 600,
                color: C.muted,
              }}
            >
              Exit Position in Destination (cm)
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 11, color: C.faint, width: 12 }}>x</span>
              <NumInput value={link.exitPosition.x} onChange={v => updateExit("x", v)} />
              <span style={{ fontSize: 11, color: C.faint, width: 12 }}>y</span>
              <NumInput value={link.exitPosition.y} onChange={v => updateExit("y", v)} />
            </div>
          </div>

          {/* Right: mini diagram */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 10, color: C.faint }}>Boundary Preview</div>
            <LinkDiagram link={link} />
            <div style={{ fontSize: 10, color: C.faint, textAlign: "center" }}>
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
}: {
  link: BeyLink;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<BeyLink>) => void;
}) {
  const alignColor = ALIGNMENT_COLORS[link.alignment];

  return (
    <div
      data-testid={`bey-link-${link.id}`}
      style={{ border: `1px solid ${alignColor}44`, borderRadius: 10, overflow: "hidden" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          background: alignColor + "11",
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            background: "#6366f133",
            color: "#818cf8",
            borderRadius: 4,
            padding: "1px 6px",
          }}
        >
          {link.linkType.replace("_", " ").toUpperCase()}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            background: alignColor + "33",
            color: alignColor,
            borderRadius: 4,
            padding: "1px 6px",
          }}
        >
          {link.alignment.toUpperCase()}
        </span>
        <span style={{ fontSize: 12, color: C.text, flex: 1 }}>
          radius {link.entryRadiusCm}cm · {link.triggerCondition}
        </span>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          data-testid={`remove-bey-link-${link.id}`}
          style={{
            background: "transparent",
            border: "none",
            color: C.red,
            cursor: "pointer",
            fontSize: 13,
            padding: "0 4px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div style={{ padding: "12px 14px", background: "var(--bg2,#0d0d1a)" }}>
          <FieldRow label="Link Type">
            <SearchableSelect
              value={link.linkType}
              options={BEY_LINK_TYPES.map(o => ({ value: o, label: o }))}
              onChange={v => onUpdate({ linkType: v as BeyLinkType })}
              style={{ flex: 1, background: "var(--bg3,#1a1a2e)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
            />
          </FieldRow>
          <FieldRow label="Alignment">
            <SearchableSelect
              value={link.alignment}
              options={BEY_LINK_ALIGNMENTS.map(o => ({ value: o, label: o }))}
              onChange={v => onUpdate({ alignment: v as BeyLinkAlignment })}
              style={{ flex: 1, background: "var(--bg3,#1a1a2e)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
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
              options={TRIGGER_CONDITIONS.map(o => ({ value: o, label: o }))}
              onChange={v => onUpdate({ triggerCondition: v as BeyLink["triggerCondition"] })}
              style={{ flex: 1, background: "var(--bg3,#1a1a2e)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
            />
          </FieldRow>
          <FieldRow label="Cooldown (ticks)">
            <NumInput value={link.cooldownTicks ?? 0} onChange={v => onUpdate({ cooldownTicks: v })} />
          </FieldRow>
          <FieldRow label="Max Simultaneous">
            <NumInput value={link.maxSimultaneous ?? 2} onChange={v => onUpdate({ maxSimultaneous: v })} />
          </FieldRow>

          {/* Duration and break conditions */}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Break Conditions</div>
            <FieldRow label="Max Duration (ticks)">
              <NumInput value={link.maxDurationTicks ?? 0} onChange={v => onUpdate({ maxDurationTicks: v || undefined })} />
              <span style={{ fontSize: 10, color: C.faint, marginLeft: 4 }}>0 = unlimited</span>
            </FieldRow>
            <FieldRow label="Break Threshold">
              <NumInput value={link.breakThreshold ?? 0} step={5} onChange={v => onUpdate({ breakThreshold: v || undefined })} />
              <span style={{ fontSize: 10, color: C.faint, marginLeft: 4 }}>collision force (0 = unbreakable)</span>
            </FieldRow>
            <FieldRow label="Break on Ring Edge">
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text, cursor: "pointer" }}>
                <input type="checkbox" checked={link.breakOnRingOut ?? false}
                  onChange={e => onUpdate({ breakOnRingOut: e.target.checked })} />
                Break when participant nears ring-out
              </label>
            </FieldRow>
          </div>

          {/* Friendly boost fields */}
          {link.alignment === "friendly" && (
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#14b8a6",
                  marginBottom: 6,
                }}
              >
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
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#ef4444",
                  marginBottom: 6,
                }}
              >
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
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", marginBottom: 6 }}>QTE Escape</div>
              <FieldRow label="QTE Escapable">
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text, cursor: "pointer" }}>
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
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Movement Control</div>
            <FieldRow label="Control Mode">
              <SearchableSelect
                value={link.movementControl ?? "auto"}
                options={MOVEMENT_CONTROLS.map(m => ({ value: m, label: m }))}
                onChange={v => onUpdate({ movementControl: v as BeyLinkMovementControl })}
                style={{ flex: 1, background: "var(--bg2,#0d0d1a)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
              />
            </FieldRow>
            <FieldRow label="Group Pattern">
              <SearchableSelect
                value={link.groupPattern ?? ""}
                options={GROUP_PATTERNS.map(p => ({ value: p, label: p }))}
                onChange={v => onUpdate({ groupPattern: v ? v as BeyLinkGroupPattern : undefined })}
                emptyLabel="— (pairwise only)"
                style={{ flex: 1, background: "var(--bg2,#0d0d1a)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
              />
              <span style={{ fontSize: 10, color: C.faint, marginLeft: 4 }}>applies when 3+ beys share this link</span>
            </FieldRow>
            {(link.movementControl && link.movementControl !== "auto") && (
              <div style={{ fontSize: 10, color: "#a78bfa", marginTop: 4, padding: "4px 6px", background: "#a78bfa11", borderRadius: 5 }}>
                {link.movementControl === "initiator"
                  ? "sidA (link initiator) steers the entire formation via WASD."
                  : "Any human-controlled bey in the group steers the formation."}
              </div>
            )}
          </div>

          {/* ── Hijack ────────────────────────────────────────────────────── */}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Hijack</div>
            <FieldRow label="Hijackable">
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text, cursor: "pointer" }}>
                <input type="checkbox" checked={link.hijackable ?? false}
                  onChange={e => onUpdate({ hijackable: e.target.checked })} />
                Victim can attempt to seize control
              </label>
            </FieldRow>
            {link.hijackable && (
              <>
                <FieldRow label="Hijack Window (ticks)">
                  <NumInput value={link.hijackWindowTicks ?? 90} onChange={v => onUpdate({ hijackWindowTicks: v })} />
                  <span style={{ fontSize: 10, color: C.faint, marginLeft: 4 }}>attacker must block within this window</span>
                </FieldRow>
                <FieldRow label="Cooldown (ticks)">
                  <NumInput value={link.hijackCooldownTicks ?? 180} onChange={v => onUpdate({ hijackCooldownTicks: v })} />
                  <span style={{ fontSize: 10, color: C.faint, marginLeft: 4 }}>applied to both beys after attempt</span>
                </FieldRow>
                <div style={{ fontSize: 10, color: "#f97316", marginTop: 4, padding: "4px 6px", background: "#f9731611", borderRadius: 5 }}>
                  On hijack success: roles reverse. Former victim becomes sidA (initiator). Former attacker suffers effects instead.
                </div>
              </>
            )}
          </div>

          {/* ── Composable Link Effects ───────────────────────────────────── */}
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>Link Effects ({link.linkEffects?.length ?? 0})</span>
              <button type="button"
                onClick={() => {
                  const next: BeyLinkEffect = { type: "spin_drain", intensityPerTick: 1 };
                  onUpdate({ linkEffects: [...(link.linkEffects ?? []), next] });
                }}
                style={{ fontSize: 10, padding: "2px 8px", background: C.purple + "22", border: `1px solid ${C.purple}44`, borderRadius: 6, color: C.purple, cursor: "pointer" }}>
                + Add Effect
              </button>
            </div>
            {(link.linkEffects ?? []).map((eff, ei) => (
              <div key={ei} style={{ background: "var(--bg3,#1a1a2e)", borderRadius: 8, padding: "8px 10px", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <SearchableSelect
                    value={eff.type}
                    options={BEY_LINK_EFFECT_TYPES.map(t => ({ value: t, label: t }))}
                    onChange={v => {
                      const updated = [...(link.linkEffects ?? [])];
                      updated[ei] = { ...eff, type: v as BeyLinkEffectType };
                      onUpdate({ linkEffects: updated });
                    }}
                    style={{ flex: 1, background: "var(--bg2,#0d0d1a)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
                  />
                  <button type="button"
                    onClick={() => {
                      const updated = (link.linkEffects ?? []).filter((_, i) => i !== ei);
                      onUpdate({ linkEffects: updated });
                    }}
                    style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer", fontSize: 12, padding: "0 2px" }}>✕</button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <label style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                    intensity/tick
                    <NumInput value={eff.intensityPerTick ?? 1} step={0.5}
                      onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, intensityPerTick: v }; onUpdate({ linkEffects: u }); }} style={{ width: 55 }} />
                  </label>
                  <label style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                    interval ticks
                    <NumInput value={eff.intervalTicks ?? 10}
                      onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, intervalTicks: v }; onUpdate({ linkEffects: u }); }} style={{ width: 55 }} />
                  </label>
                  <label style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                    impact mult
                    <NumInput value={eff.impactMult ?? 1} step={0.1}
                      onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, impactMult: v }; onUpdate({ linkEffects: u }); }} style={{ width: 55 }} />
                  </label>
                  {eff.type === "control_loss" && (
                    <>
                      <label style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                        mode
                        <SearchableSelect
                          value={eff.controlMode ?? "reverse"}
                          options={CONTROL_MODES.map(m => ({ value: m, label: m }))}
                          onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, controlMode: v as BeyLinkEffect["controlMode"] }; onUpdate({ linkEffects: u }); }}
                          style={{ background: "var(--bg2,#0d0d1a)", border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: 10 }}
                        />
                      </label>
                      <label style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                        duration ticks
                        <NumInput value={eff.controlDurationTicks ?? 60}
                          onChange={v => { const u = [...(link.linkEffects ?? [])]; u[ei] = { ...eff, controlDurationTicks: v }; onUpdate({ linkEffects: u }); }} style={{ width: 55 }} />
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
    <div>
      {/* ===== Section 1: Arena Links ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
          Arena Links ({links.length})
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={addLinkPair}
            data-testid="add-pair-btn"
            style={{
              fontSize: 12,
              padding: "5px 14px",
              background: "#14b8a622",
              border: `1px solid #14b8a655`,
              borderRadius: 8,
              color: "#14b8a6",
              cursor: "pointer",
            }}
          >
            + Add Pair
          </button>
          <button
            type="button"
            onClick={addLink}
            data-testid="add-link-btn"
            style={{
              fontSize: 12,
              padding: "5px 14px",
              background: C.purple + "22",
              border: `1px solid ${C.purple}55`,
              borderRadius: 8,
              color: C.purple,
              cursor: "pointer",
            }}
          >
            + Add Link
          </button>
        </div>
      </div>

      {links.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: C.faint,
            fontSize: 12,
            padding: "24px 0",
            border: `2px dashed ${C.border}`,
            borderRadius: 12,
            marginBottom: 8,
          }}
        >
          No arena links yet. Add one to connect this arena to another, or use Add Pair to create a
          two-way link.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map(link => (
          <ArenaLinkCard
            key={link.id}
            link={link}
            allLinks={links}
            expanded={expandedLinkId === link.id}
            onToggle={() => setExpandedLinkId(expandedLinkId === link.id ? null : link.id)}
            onRemove={() => removeLink(link.id)}
            onUpdate={patch => updateLink(link.id, patch)}
          />
        ))}
      </div>

      {/* ===== Divider ===== */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          margin: "24px 0 16px",
        }}
      />

      {/* ===== Section 2: Bey Links ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
          Bey Links ({beyLinks.length})
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setShowMovementGuide(true)}
            title="View movement pattern guide"
            style={{
              fontSize: 12,
              padding: "5px 10px",
              background: "#818cf822",
              border: `1px solid #818cf855`,
              borderRadius: 8,
              color: "#818cf8",
              cursor: "pointer",
            }}
          >? Guide</button>
          <button
            type="button"
            onClick={addBeyLink}
            data-testid="add-bey-link-btn"
            style={{
              fontSize: 12,
              padding: "5px 14px",
              background: "#ef444422",
              border: `1px solid #ef444455`,
              borderRadius: 8,
              color: "#ef4444",
              cursor: "pointer",
            }}
          >
            + Add Bey Link
          </button>
        </div>
      </div>

      {showMovementGuide && <BeyLinkMovementGuide onClose={() => setShowMovementGuide(false)} />}

      {beyLinks.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: C.faint,
            fontSize: 12,
            padding: "24px 0",
            border: `2px dashed ${C.border}`,
            borderRadius: 12,
          }}
        >
          No bey links yet. Add one to configure bey-to-bey stacking interactions (hostile
          bit-chip attacks, friendly spin transfers).
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
          />
        ))}
      </div>
    </div>
  );
}

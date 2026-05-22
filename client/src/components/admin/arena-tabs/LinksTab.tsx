// L4: Admin arena topology editor — list and edit ArenaLink connections.

import React, { useState } from "react";
import { C } from "@/styles/theme";
import type { ArenaConfig, ArenaLink } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (patch: Partial<ArenaConfig>) => void;
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

function newId() {
  return `link_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: C.muted, width: 120, flexShrink: 0 }}>{label}</span>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, step = 1, style }: { value: number; onChange: (v: number) => void; step?: number; style?: React.CSSProperties }) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: 70, background: "var(--bg3,#1a1a2e)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 6px", color: C.text, fontSize: 11, ...style }}
    />
  );
}

function TextInput({ value, onChange, placeholder, style }: { value: string; onChange: (v: string) => void; placeholder?: string; style?: React.CSSProperties }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{ flex: 1, background: "var(--bg3,#1a1a2e)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 6px", color: C.text, fontSize: 11, ...style }}
    />
  );
}

function SelectInput<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as T)}
      style={{ flex: 1, background: "var(--bg3,#1a1a2e)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 6px", color: C.text, fontSize: 11 }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function LinkDiagram({ link }: { link: ArenaLink }) {
  const { x1, y1, x2, y2 } = link.boundaryLine;
  const w = 160, h = 60;
  const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
  const rangeX = maxX - minX || 1, rangeY = maxY - minY || 1;
  const pad = 12;
  const sx = (v: number) => pad + ((v - minX) / rangeX) * (w - pad * 2);
  const sy = (v: number) => pad + ((v - minY) / rangeY) * (h - pad * 2);
  const lx1 = sx(x1), ly1 = sy(y1), lx2 = sx(x2), ly2 = sy(y2);
  const color = link.linkType === "portal" ? "#a855f7" : link.linkType === "ramp" ? "#f97316" : "#3b82f6";
  return (
    <svg width={w} height={h} style={{ background: "#111827", borderRadius: 8, display: "block" }}>
      <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={color} strokeWidth={2} strokeDasharray="4 2" />
      <circle cx={lx1} cy={ly1} r={4} fill={color} />
      <circle cx={lx2} cy={ly2} r={4} fill={color} />
      <text x={w / 2} y={h - 4} textAnchor="middle" fontSize={9} fill="#6b7280">{link.fromArenaId || "src"} → {link.toArenaId || "dst"}</text>
    </svg>
  );
}

export default function LinksTab({ config, onChange }: Props) {
  const links: ArenaLink[] = (config as any).links ?? [];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function updateLinks(next: ArenaLink[]) {
    onChange({ links: next } as any);
  }

  function addLink() {
    const link: ArenaLink = { ...EMPTY_LINK, id: newId() };
    const next = [...links, link];
    updateLinks(next);
    setExpandedId(link.id);
  }

  function removeLink(id: string) {
    updateLinks(links.filter(l => l.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function updateLink(id: string, patch: Partial<ArenaLink>) {
    updateLinks(links.map(l => l.id === id ? { ...l, ...patch } : l));
  }

  function updateBoundary(id: string, field: keyof ArenaLink["boundaryLine"], val: number) {
    const link = links.find(l => l.id === id);
    if (!link) return;
    updateLink(id, { boundaryLine: { ...link.boundaryLine, [field]: val } });
  }

  function updateExit(id: string, field: "x" | "y", val: number) {
    const link = links.find(l => l.id === id);
    if (!link) return;
    updateLink(id, { exitPosition: { ...link.exitPosition, [field]: val } });
  }

  const LINK_TYPES: ArenaLink["linkType"][] = ["corridor", "portal", "ramp"];
  const REVERSE_CONDITIONS: NonNullable<ArenaLink["reverseCondition"]>[] = ["always", "never", "spin_above_50"];
  const TYPE_COLORS: Record<ArenaLink["linkType"], string> = {
    corridor: "#3b82f6",
    portal: "#a855f7",
    ramp: "#f97316",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Arena Links ({links.length})</span>
        <button
          type="button"
          onClick={addLink}
          data-testid="add-link-btn"
          style={{ fontSize: 12, padding: "5px 14px", background: C.purple + "22", border: `1px solid ${C.purple}55`, borderRadius: 8, color: C.purple, cursor: "pointer" }}
        >
          + Add Link
        </button>
      </div>

      {links.length === 0 && (
        <div style={{ textAlign: "center", color: C.faint, fontSize: 12, padding: "24px 0", border: `2px dashed ${C.border}`, borderRadius: 12 }}>
          No arena links yet. Add one to connect this arena to another.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map(link => {
          const isExpanded = expandedId === link.id;
          const typeColor = TYPE_COLORS[link.linkType];
          return (
            <div
              key={link.id}
              data-testid={`link-${link.id}`}
              style={{ border: `1px solid ${typeColor}44`, borderRadius: 10, overflow: "hidden" }}
            >
              {/* Header row */}
              <div
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: typeColor + "11", cursor: "pointer" }}
                onClick={() => setExpandedId(isExpanded ? null : link.id)}
              >
                <span style={{ fontSize: 10, fontWeight: 700, background: typeColor + "33", color: typeColor, borderRadius: 4, padding: "1px 6px" }}>
                  {link.linkType.toUpperCase()}
                </span>
                <span style={{ fontSize: 12, color: C.text, flex: 1 }}>
                  {link.fromArenaId || <span style={{ color: C.faint }}>from?</span>}
                  <span style={{ color: C.muted, margin: "0 6px" }}>→</span>
                  {link.toArenaId || <span style={{ color: C.faint }}>to?</span>}
                </span>
                <span style={{ fontSize: 11, color: C.muted }}>
                  {link.momentumPreserved ? "momentum" : "rest"} · {link.reverseCondition ?? "always"}
                </span>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removeLink(link.id); }}
                  data-testid={`remove-link-${link.id}`}
                  style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer", fontSize: 13, padding: "0 4px" }}
                >
                  ✕
                </button>
              </div>

              {/* Expanded editor */}
              {isExpanded && (
                <div style={{ padding: "12px 14px", background: "var(--bg2,#0d0d1a)", display: "flex", gap: 16 }}>
                  {/* Left: fields */}
                  <div style={{ flex: 1 }}>
                    <FieldRow label="From Arena ID">
                      <TextInput value={link.fromArenaId} onChange={v => updateLink(link.id, { fromArenaId: v })} placeholder="arena doc id" />
                    </FieldRow>
                    <FieldRow label="To Arena ID">
                      <TextInput value={link.toArenaId} onChange={v => updateLink(link.id, { toArenaId: v })} placeholder="arena doc id" />
                    </FieldRow>
                    <FieldRow label="Link Type">
                      <SelectInput value={link.linkType} options={LINK_TYPES} onChange={v => updateLink(link.id, { linkType: v })} />
                    </FieldRow>
                    <FieldRow label="Reverse Condition">
                      <SelectInput value={link.reverseCondition ?? "always"} options={REVERSE_CONDITIONS} onChange={v => updateLink(link.id, { reverseCondition: v })} />
                    </FieldRow>
                    <FieldRow label="Momentum Preserved">
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text, cursor: "pointer" }}>
                        <input type="checkbox" checked={link.momentumPreserved} onChange={e => updateLink(link.id, { momentumPreserved: e.target.checked })} />
                        Preserve velocity on crossing
                      </label>
                    </FieldRow>
                    <FieldRow label="Level Delta (cm)">
                      <NumInput value={link.levelDelta} onChange={v => updateLink(link.id, { levelDelta: v })} />
                    </FieldRow>
                    <FieldRow label="Hazard Damage">
                      <NumInput value={link.hazardDamage ?? 0} onChange={v => updateLink(link.id, { hazardDamage: v })} step={0.1} />
                    </FieldRow>
                    <FieldRow label="Cooldown (ticks)">
                      <NumInput value={link.cooldownTicks ?? 0} onChange={v => updateLink(link.id, { cooldownTicks: v })} />
                    </FieldRow>

                    <div style={{ marginTop: 10, marginBottom: 4, fontSize: 11, fontWeight: 600, color: C.muted }}>Boundary Line (cm, arena coords)</div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: C.faint, width: 16 }}>x1</span>
                      <NumInput value={link.boundaryLine.x1} onChange={v => updateBoundary(link.id, "x1", v)} />
                      <span style={{ fontSize: 11, color: C.faint, width: 16 }}>y1</span>
                      <NumInput value={link.boundaryLine.y1} onChange={v => updateBoundary(link.id, "y1", v)} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: C.faint, width: 16 }}>x2</span>
                      <NumInput value={link.boundaryLine.x2} onChange={v => updateBoundary(link.id, "x2", v)} />
                      <span style={{ fontSize: 11, color: C.faint, width: 16 }}>y2</span>
                      <NumInput value={link.boundaryLine.y2} onChange={v => updateBoundary(link.id, "y2", v)} />
                    </div>

                    <div style={{ marginTop: 8, marginBottom: 4, fontSize: 11, fontWeight: 600, color: C.muted }}>Exit Position in Destination (cm)</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 11, color: C.faint, width: 12 }}>x</span>
                      <NumInput value={link.exitPosition.x} onChange={v => updateExit(link.id, "x", v)} />
                      <span style={{ fontSize: 11, color: C.faint, width: 12 }}>y</span>
                      <NumInput value={link.exitPosition.y} onChange={v => updateExit(link.id, "y", v)} />
                    </div>
                  </div>

                  {/* Right: mini diagram */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                    <div style={{ fontSize: 10, color: C.faint }}>Boundary Preview</div>
                    <LinkDiagram link={link} />
                    <div style={{ fontSize: 10, color: C.faint, textAlign: "center" }}>
                      ({link.boundaryLine.x1},{link.boundaryLine.y1}) → ({link.boundaryLine.x2},{link.boundaryLine.y2})
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

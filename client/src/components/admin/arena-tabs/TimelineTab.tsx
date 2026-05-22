// Phase T: Timeline tab — arena scripted events editor + swimlane preview.

import { useState } from "react";
import { C } from "@/styles/theme";
import type { ArenaConfig, ArenaTimelineEvent, ArenaTimelineEventType } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (patch: Partial<ArenaConfig>) => void;
}

const EVENT_TYPES: ArenaTimelineEventType[] = [
  "activate_feature",
  "deactivate_feature",
  "spawn_feature",
  "arena_tilt",
  "gravity_change",
  "announcement",
];

const TYPE_ICONS: Record<ArenaTimelineEventType, string> = {
  activate_feature:   "▶",
  deactivate_feature: "⏹",
  spawn_feature:      "✦",
  arena_tilt:         "↗",
  gravity_change:     "⬇",
  announcement:       "📢",
};

const MATCH_DURATION_MS = 180_000; // 3 min

function msToLabel(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <label style={{ fontSize: 11, color: C.muted, minWidth: 100 }}>{label}</label>
      {children}
    </div>
  );
}

const INPUT_STYLE = {
  background: C.bg2,
  border: `1px solid ${C.border}`,
  color: C.text,
  borderRadius: 6,
  padding: "3px 7px",
  fontSize: 12,
};

function newEvent(): ArenaTimelineEvent {
  return { triggerMs: 30_000, type: "announcement", announcement: { text: "Event!", style: "info" } };
}

export default function TimelineTab({ config, onChange }: Props) {
  const events: ArenaTimelineEvent[] = config.arenaTimeline ?? [];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  function update(idx: number, patch: Partial<ArenaTimelineEvent>) {
    const next = events.map((e, i) => i === idx ? { ...e, ...patch } : e);
    onChange({ arenaTimeline: next });
  }

  function addEvent() {
    const next = [...events, newEvent()].sort((a, b) => a.triggerMs - b.triggerMs);
    onChange({ arenaTimeline: next });
    setExpandedIdx(next.length - 1);
  }

  function removeEvent(idx: number) {
    onChange({ arenaTimeline: events.filter((_, i) => i !== idx) });
    setExpandedIdx(null);
  }

  const sorted = [...events].sort((a, b) => a.triggerMs - b.triggerMs);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>
          Timeline Events
          {events.length > 0 && (
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 400, marginLeft: 8 }}>
              ({events.length} event{events.length !== 1 ? "s" : ""})
            </span>
          )}
        </h3>
        <button
          onClick={addEvent}
          style={{ padding: "5px 12px", background: C.purple, color: C.white, border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
        >
          + Add Event
        </button>
      </div>

      {/* Event list */}
      {events.length === 0 ? (
        <div style={{ textAlign: "center", padding: 24, color: C.muted, fontSize: 13 }}>
          No timeline events. Add one to script arena changes during the match.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {events.map((ev, idx) => {
            const isOpen = expandedIdx === idx;
            return (
              <div
                key={idx}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}
              >
                {/* Row header */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer" }}
                  onClick={() => setExpandedIdx(isOpen ? null : idx)}
                >
                  <span style={{ fontSize: 13, color: C.purple, fontWeight: 700, minWidth: 40 }}>
                    {msToLabel(ev.triggerMs)}
                  </span>
                  <span style={{ fontSize: 13 }}>{TYPE_ICONS[ev.type] ?? "?"}</span>
                  <span style={{ fontSize: 12, color: C.text, flex: 1 }}>
                    {ev.type === "announcement"
                      ? ev.announcement?.text ?? ev.type
                      : ev.type}
                    {ev.repeat && <span style={{ color: C.muted, fontSize: 11 }}> ×{ev.repeat.count + 1}</span>}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); removeEvent(idx); }}
                    style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, padding: "0 4px" }}
                  >
                    ×
                  </button>
                  <span style={{ color: C.muted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                </div>

                {/* Expanded editor */}
                {isOpen && (
                  <div style={{ padding: "0 12px 12px", borderTop: `1px solid ${C.border}` }}>
                    <div style={{ marginTop: 10 }}>
                      {/* Trigger time */}
                      <Row label="Trigger (ms)">
                        <input
                          type="number"
                          value={ev.triggerMs}
                          min={0}
                          max={MATCH_DURATION_MS}
                          step={1000}
                          onChange={e => update(idx, { triggerMs: Number(e.target.value) })}
                          style={{ ...INPUT_STYLE, width: 90 }}
                        />
                        <span style={{ fontSize: 11, color: C.muted }}>{msToLabel(ev.triggerMs)}</span>
                      </Row>

                      {/* Event type */}
                      <Row label="Type">
                        <select
                          value={ev.type}
                          onChange={e => update(idx, { type: e.target.value as ArenaTimelineEventType })}
                          style={{ ...INPUT_STYLE, width: 180 }}
                        >
                          {EVENT_TYPES.map(t => (
                            <option key={t} value={t}>{TYPE_ICONS[t]} {t.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                      </Row>

                      {/* Feature id (for activate/deactivate/spawn) */}
                      {(ev.type === "activate_feature" || ev.type === "deactivate_feature" || ev.type === "spawn_feature") && (
                        <Row label="Feature ID">
                          <input
                            type="text"
                            value={ev.featureId ?? ""}
                            placeholder="e.g. center-vortex"
                            onChange={e => update(idx, { featureId: e.target.value })}
                            style={{ ...INPUT_STYLE, width: 180 }}
                          />
                        </Row>
                      )}

                      {/* Gravity change params */}
                      {ev.type === "gravity_change" && (
                        <Row label="Multiplier">
                          <input
                            type="number"
                            value={(ev.params?.multiplier as number) ?? 1.0}
                            min={0.1}
                            max={5}
                            step={0.1}
                            onChange={e => update(idx, { params: { ...ev.params, multiplier: Number(e.target.value) } })}
                            style={{ ...INPUT_STYLE, width: 80 }}
                          />
                          <span style={{ fontSize: 11, color: C.muted }}>× gravity</span>
                        </Row>
                      )}

                      {/* Arena tilt params */}
                      {ev.type === "arena_tilt" && (
                        <>
                          <Row label="Angle (deg)">
                            <input
                              type="number"
                              value={(ev.params?.angleDeg as number) ?? 10}
                              min={0}
                              max={45}
                              step={1}
                              onChange={e => update(idx, { params: { ...ev.params, angleDeg: Number(e.target.value) } })}
                              style={{ ...INPUT_STYLE, width: 70 }}
                            />
                          </Row>
                          <Row label="Direction (deg)">
                            <input
                              type="number"
                              value={(ev.params?.directionDeg as number) ?? 0}
                              min={0}
                              max={359}
                              step={5}
                              onChange={e => update(idx, { params: { ...ev.params, directionDeg: Number(e.target.value) } })}
                              style={{ ...INPUT_STYLE, width: 70 }}
                            />
                          </Row>
                        </>
                      )}

                      {/* Announcement params */}
                      {ev.type === "announcement" && (
                        <>
                          <Row label="Text">
                            <input
                              type="text"
                              value={ev.announcement?.text ?? ""}
                              placeholder="e.g. STORM INTENSIFIES"
                              onChange={e => update(idx, { announcement: { ...ev.announcement, text: e.target.value } })}
                              style={{ ...INPUT_STYLE, width: 220 }}
                            />
                          </Row>
                          <Row label="Style">
                            <select
                              value={ev.announcement?.style ?? "info"}
                              onChange={e => update(idx, { announcement: { text: ev.announcement?.text ?? "", ...ev.announcement, style: e.target.value as "warning" | "info" | "danger" } })}
                              style={{ ...INPUT_STYLE, width: 100 }}
                            >
                              <option value="info">info</option>
                              <option value="warning">warning</option>
                              <option value="danger">danger</option>
                            </select>
                          </Row>
                        </>
                      )}

                      {/* Repeat config */}
                      <Row label="Repeat">
                        <input
                          type="checkbox"
                          checked={!!ev.repeat}
                          onChange={e => update(idx, { repeat: e.target.checked ? { intervalMs: 15_000, count: 2 } : undefined })}
                        />
                        {ev.repeat && (
                          <>
                            <span style={{ fontSize: 11, color: C.muted, marginLeft: 4 }}>every</span>
                            <input
                              type="number"
                              value={ev.repeat.intervalMs / 1000}
                              min={1}
                              max={60}
                              step={1}
                              onChange={e => update(idx, { repeat: { ...ev.repeat!, intervalMs: Number(e.target.value) * 1000 } })}
                              style={{ ...INPUT_STYLE, width: 55 }}
                            />
                            <span style={{ fontSize: 11, color: C.muted }}>s ×</span>
                            <input
                              type="number"
                              value={ev.repeat.count}
                              min={1}
                              max={20}
                              onChange={e => update(idx, { repeat: { ...ev.repeat!, count: Number(e.target.value) } })}
                              style={{ ...INPUT_STYLE, width: 50 }}
                            />
                            <span style={{ fontSize: 11, color: C.muted }}>more</span>
                          </>
                        )}
                      </Row>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Swimlane preview */}
      {events.length > 0 && (
        <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Timeline preview (3 min match)</div>
          <div style={{ position: "relative", height: 28, background: C.bg2, borderRadius: 6, overflow: "hidden" }}>
            {/* Minute markers */}
            {[0, 60, 120].map(s => (
              <div
                key={s}
                style={{
                  position: "absolute",
                  left: `${(s / 180) * 100}%`,
                  top: 0, bottom: 0,
                  borderLeft: `1px solid ${C.border}`,
                }}
              >
                <span style={{ position: "absolute", top: 2, left: 3, fontSize: 9, color: C.muted }}>
                  {s === 0 ? "0:00" : `${s / 60}:00`}
                </span>
              </div>
            ))}
            {/* Event markers */}
            {sorted.map((ev, i) => {
              const pct = Math.min(100, (ev.triggerMs / MATCH_DURATION_MS) * 100);
              const colors: Record<ArenaTimelineEventType, string> = {
                activate_feature:   "#22c55e",
                deactivate_feature: "#ef4444",
                spawn_feature:      "#a855f7",
                arena_tilt:         "#f97316",
                gravity_change:     "#3b82f6",
                announcement:       "#eab308",
              };
              return (
                <div
                  key={i}
                  title={`${msToLabel(ev.triggerMs)}: ${ev.type}`}
                  style={{
                    position: "absolute",
                    left: `${pct}%`,
                    top: 4,
                    bottom: 4,
                    width: 4,
                    borderRadius: 2,
                    background: colors[ev.type] ?? C.purple,
                    transform: "translateX(-2px)",
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            {EVENT_TYPES.filter(t => events.some(e => e.type === t)).map(t => (
              <span key={t} style={{ fontSize: 10, color: C.muted }}>
                {TYPE_ICONS[t]} {t.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

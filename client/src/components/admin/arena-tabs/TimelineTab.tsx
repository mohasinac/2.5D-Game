// Phase T: Timeline tab — arena scripted events editor + swimlane preview.

import { useState } from "react";
import { C } from "@/styles/theme";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig, ArenaTimelineEvent, ArenaTimelineEventType } from "@/types/arenaConfigNew";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

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
    <div className="flex items-center gap-2 mb-1.5">
      <label className="text-[11px] text-muted min-w-[100px]">{label}</label>
      {children}
    </div>
  );
}

const INPUT_CLS = "bg-bg2 border border-border text-text rounded-md py-[3px] px-[7px] text-xs";

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
    <CollapsibleSection title="Timeline" badge={events.length} storageKey="arena-timeline-list" defaultOpen={true}>
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-sm font-semibold text-text">
          Timeline Events
          {events.length > 0 && (
            <span className="text-[11px] text-muted font-normal ml-2">
              ({events.length} event{events.length !== 1 ? "s" : ""})
            </span>
          )}
        </h3>
        <button
          onClick={addEvent}
          className="py-[5px] px-3 text-white border-none rounded-md text-xs cursor-pointer"
          style={{ background: C.purple }}
        >
          + Add Event
        </button>
      </div>

      {/* Event list */}
      {events.length === 0 ? (
        <div className="text-center p-6 text-muted text-[13px]">
          No timeline events. Add one to script arena changes during the match.
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {events.map((ev, idx) => {
            const isOpen = expandedIdx === idx;
            return (
              <div
                key={idx}
                className="bg-bg1 border border-border rounded-[10px] overflow-hidden"
              >
                {/* Row header */}
                <div
                  className="flex items-center gap-2 py-2 px-3 cursor-pointer"
                  onClick={() => setExpandedIdx(isOpen ? null : idx)}
                >
                  <span className="text-[13px] font-bold min-w-[40px]" style={{ color: C.purple }}>
                    {msToLabel(ev.triggerMs)}
                  </span>
                  <span className="text-[13px]">{TYPE_ICONS[ev.type] ?? "?"}</span>
                  <span className="text-xs text-text flex-1">
                    {ev.type === "announcement"
                      ? ev.announcement?.text ?? ev.type
                      : ev.type}
                    {ev.repeat && <span className="text-muted text-[11px]"> ×{ev.repeat.count + 1}</span>}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); removeEvent(idx); }}
                    className="bg-transparent border-none text-muted cursor-pointer text-sm px-1 py-0"
                  >
                    ×
                  </button>
                  <span className="text-muted text-xs">{isOpen ? "▲" : "▼"}</span>
                </div>

                {/* Expanded editor */}
                {isOpen && (
                  <div className="px-3 pb-3 border-t border-border">
                    <div className="mt-2.5">
                      {/* Trigger time */}
                      <Row label="Trigger (ms)">
                        <input
                          type="number"
                          value={ev.triggerMs}
                          min={0}
                          max={MATCH_DURATION_MS}
                          step={1000}
                          onChange={e => update(idx, { triggerMs: Number(e.target.value) })}
                          className={`${INPUT_CLS} w-[90px]`}
                        />
                        <span className="text-[11px] text-muted">{msToLabel(ev.triggerMs)}</span>
                      </Row>

                      {/* Event type */}
                      <Row label="Type">
                        <SearchableSelect
                          value={ev.type}
                          options={EVENT_TYPES.map(t => ({ value: t, label: `${TYPE_ICONS[t]} ${t.replace(/_/g, " ")}` }))}
                          onChange={v => update(idx, { type: v as ArenaTimelineEventType })}
                          style={{ width: 180 }}
                        />
                      </Row>

                      {/* Feature id (for activate/deactivate/spawn) */}
                      {(ev.type === "activate_feature" || ev.type === "deactivate_feature" || ev.type === "spawn_feature") && (
                        <Row label="Feature ID">
                          <input
                            type="text"
                            value={ev.featureId ?? ""}
                            placeholder="e.g. center-vortex"
                            onChange={e => update(idx, { featureId: e.target.value })}
                            className={`${INPUT_CLS} w-[180px]`}
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
                            className={`${INPUT_CLS} w-20`}
                          />
                          <span className="text-[11px] text-muted">× gravity</span>
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
                              className={`${INPUT_CLS} w-[70px]`}
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
                              className={`${INPUT_CLS} w-[70px]`}
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
                              className={`${INPUT_CLS} w-[220px]`}
                            />
                          </Row>
                          <Row label="Style">
                            <SearchableSelect
                              value={ev.announcement?.style ?? "info"}
                              options={[
                                { value: "info", label: "info" },
                                { value: "warning", label: "warning" },
                                { value: "danger", label: "danger" },
                              ]}
                              onChange={v => update(idx, { announcement: { text: ev.announcement?.text ?? "", ...ev.announcement, style: v as "warning" | "info" | "danger" } })}
                              style={{ width: 100 }}
                            />
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
                            <span className="text-[11px] text-muted ml-1">every</span>
                            <input
                              type="number"
                              value={ev.repeat.intervalMs / 1000}
                              min={1}
                              max={60}
                              step={1}
                              onChange={e => update(idx, { repeat: { ...ev.repeat!, intervalMs: Number(e.target.value) * 1000 } })}
                              className={`${INPUT_CLS} w-[55px]`}
                            />
                            <span className="text-[11px] text-muted">s ×</span>
                            <input
                              type="number"
                              value={ev.repeat.count}
                              min={1}
                              max={20}
                              onChange={e => update(idx, { repeat: { ...ev.repeat!, count: Number(e.target.value) } })}
                              className={`${INPUT_CLS} w-[50px]`}
                            />
                            <span className="text-[11px] text-muted">more</span>
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
        <div className="bg-bg1 border border-border rounded-[10px] p-3">
          <div className="text-xs text-muted mb-2">Timeline preview (3 min match)</div>
          <div className="relative h-7 bg-bg2 rounded-md overflow-hidden">
            {/* Minute markers */}
            {[0, 60, 120].map(s => (
              <div
                key={s}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${(s / 180) * 100}%`,
                  borderLeft: `1px solid ${C.border}`,
                }}
              >
                <span className="absolute top-0.5 left-[3px] text-[9px] text-muted">
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
                  className="absolute top-1 bottom-1 w-1 rounded-[2px]"
                  style={{
                    left: `${pct}%`,
                    background: colors[ev.type] ?? C.purple,
                    transform: "translateX(-2px)",
                  }}
                />
              );
            })}
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {EVENT_TYPES.filter(t => events.some(e => e.type === t)).map(t => (
              <span key={t} className="text-[10px] text-muted">
                {TYPE_ICONS[t]} {t.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
    </CollapsibleSection>
  );
}

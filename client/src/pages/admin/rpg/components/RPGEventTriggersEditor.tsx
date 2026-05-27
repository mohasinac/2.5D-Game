/**
 * RPGEventTriggersEditor
 * Visual editor for MapEventTrigger[].
 * Drop-in replacement for the raw "eventTriggers JSON" textarea.
 */

import { useState } from "react";
import type { MapEventTrigger } from "@/rpg/data/schemas";

interface Props {
  value: MapEventTrigger[];
  onChange: (next: MapEventTrigger[]) => void;
}

const TRIGGER_MODES = ["enter", "interact", "step"] as const;

function newTrigger(): MapEventTrigger {
  return {
    id: `trigger_${Date.now()}`,
    triggerRect: { x: 0, y: 0, width: 1, height: 1 },
    storyEventId: "",
    triggerOnce: true,
    triggerMode: "enter",
  };
}

export function RPGEventTriggersEditor({ value, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const update = (i: number, patch: Partial<MapEventTrigger>) => {
    onChange(value.map((t, idx) => idx === i ? { ...t, ...patch } : t));
  };

  const updateRect = (i: number, field: "x" | "y" | "width" | "height", v: number) => {
    update(i, { triggerRect: { ...value[i].triggerRect, [field]: v } });
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const add = () => onChange([...value, newTrigger()]);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-sm font-semibold text-gray-200 transition-colors"
      >
        <span>⚡ Event Triggers ({value.length})</span>
        <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="p-3 space-y-3 bg-gray-900">
          {value.length === 0 && (
            <p className="text-gray-600 text-xs text-center py-2">No event triggers. Click + to add one.</p>
          )}

          {value.map((trig, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                {/* Trigger ID */}
                <input
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="trigger_id"
                  value={trig.id}
                  onChange={e => update(i, { id: e.target.value })}
                />
                {/* Trigger mode */}
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  value={trig.triggerMode}
                  onChange={e => update(i, { triggerMode: e.target.value as MapEventTrigger["triggerMode"] })}
                >
                  {TRIGGER_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {/* Trigger once */}
                <label className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-3 h-3"
                    checked={trig.triggerOnce}
                    onChange={e => update(i, { triggerOnce: e.target.checked })}
                  />
                  once
                </label>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-red-500 hover:text-red-400 text-xs shrink-0"
                  title="Remove trigger"
                >
                  ✕
                </button>
              </div>

              {/* Story event */}
              <div>
                <label className="text-[9px] text-gray-500 uppercase">Story Event ID</label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="story_event_id"
                  value={trig.storyEventId}
                  onChange={e => update(i, { storyEventId: e.target.value })}
                />
              </div>

              {/* Trigger rect */}
              <div>
                <label className="text-[9px] text-gray-500 uppercase mb-1 block">Trigger Zone (tiles)</label>
                <div className="flex items-center gap-2">
                  {(["x", "y", "width", "height"] as const).map(field => (
                    <div key={field} className="flex items-center gap-1">
                      <label className="text-[9px] text-gray-500">{field === "width" ? "W" : field === "height" ? "H" : field.toUpperCase()}</label>
                      <input
                        type="number"
                        className="w-14 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                        value={trig.triggerRect[field]}
                        min={field === "width" || field === "height" ? 1 : 0}
                        onChange={e => updateRect(i, field, +e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={add}
            className="w-full py-1.5 border border-dashed border-gray-600 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
          >
            + Add Event Trigger
          </button>
        </div>
      )}
    </div>
  );
}

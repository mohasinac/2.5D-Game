/**
 * RPGMapExitsEditor
 * Visual editor for MapExit[].
 * Drop-in replacement for the raw "exits JSON" textarea.
 */

import { useState } from "react";
import type { MapExit } from "@/rpg/data/schemas";

interface Props {
  value: MapExit[];
  onChange: (next: MapExit[]) => void;
}

const DIRECTIONS = ["north", "south", "east", "west", "warp"] as const;
const TRANSITIONS = ["walk", "warp", "door", "cave"] as const;

function newExit(i: number): MapExit {
  return {
    id: `exit_${Date.now()}_${i}`,
    triggerRect: { x: 0, y: 0, width: 1, height: 1 },
    targetMapId: "",
    targetEntryId: "default",
    direction: "north",
    transitionType: "walk",
  };
}

export function RPGMapExitsEditor({ value, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const update = (i: number, patch: Partial<MapExit>) => {
    onChange(value.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  };

  const updateRect = (i: number, field: "x" | "y" | "width" | "height", v: number) => {
    update(i, { triggerRect: { ...value[i].triggerRect, [field]: v } });
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const add = () => onChange([...value, newExit(value.length)]);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-sm font-semibold text-gray-200 transition-colors"
      >
        <span>🚪 Map Exits ({value.length})</span>
        <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="p-3 space-y-3 bg-gray-900">
          {value.length === 0 && (
            <p className="text-gray-600 text-xs text-center py-2">No exits. Click + to add one.</p>
          )}

          {value.map((exit, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                {/* Exit ID */}
                <input
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="exit id"
                  value={exit.id}
                  onChange={e => update(i, { id: e.target.value })}
                />
                {/* Direction */}
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  value={exit.direction}
                  onChange={e => update(i, { direction: e.target.value as MapExit["direction"] })}
                >
                  {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {/* Transition type */}
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  value={exit.transitionType}
                  onChange={e => update(i, { transitionType: e.target.value as MapExit["transitionType"] })}
                >
                  {TRANSITIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-red-500 hover:text-red-400 text-xs shrink-0"
                  title="Remove exit"
                >
                  ✕
                </button>
              </div>

              {/* Target */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[9px] text-gray-500 uppercase">Target Map</label>
                  <input
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="target_map_id"
                    value={exit.targetMapId}
                    onChange={e => update(i, { targetMapId: e.target.value })}
                  />
                </div>
                <div className="w-32">
                  <label className="text-[9px] text-gray-500 uppercase">Entry Point</label>
                  <input
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="default"
                    value={exit.targetEntryId}
                    onChange={e => update(i, { targetEntryId: e.target.value })}
                  />
                </div>
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
                        value={exit.triggerRect[field]}
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
            + Add Exit
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * RPGScheduleBuilder
 * Visual editor for NPCScheduleEntry[].
 * Drop-in replacement for the raw "schedule JSON" textarea.
 */

import { useState } from "react";
import type { NPCScheduleEntry, TileCoord } from "@/rpg/data/schemas";

interface Props {
  value: NPCScheduleEntry[];
  onChange: (next: NPCScheduleEntry[]) => void;
}

const TIME_SLOTS = ["morning", "afternoon", "evening", "night", "tournament"] as const;
const FACINGS    = ["down", "up", "left", "right"] as const;

function newEntry(): NPCScheduleEntry {
  return { timeSlot: "morning", mapId: "", tile: { x: 0, y: 0 }, facing: "down" };
}

export function RPGScheduleBuilder({ value, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const update = (i: number, patch: Partial<NPCScheduleEntry>) => {
    onChange(value.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  };

  const updateTile = (i: number, axis: "x" | "y", v: number) => {
    update(i, { tile: { ...value[i].tile, [axis]: v } });
  };

  const updatePatrol = (i: number, raw: string) => {
    // Parse "x,y; x,y; x,y" formatted string into TileCoord[]
    const coords: TileCoord[] = raw.split(";")
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => {
        const [x, y] = s.split(",").map(n => parseInt(n.trim(), 10));
        return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y };
      });
    update(i, { patrolPath: coords.length > 0 ? coords : undefined });
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add    = () => onChange([...value, newEntry()]);

  const SLOT_COLORS: Record<string, string> = {
    morning:   "text-yellow-400",
    afternoon: "text-orange-400",
    evening:   "text-purple-400",
    night:     "text-blue-400",
    tournament:"text-red-400",
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-sm font-semibold text-gray-200 transition-colors"
      >
        <span>🕐 Schedule ({value.length} entries)</span>
        <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="p-3 space-y-2 bg-gray-900">
          {value.length === 0 && (
            <p className="text-gray-600 text-xs text-center py-2">No schedule. NPC stays at spawn tile 24/7.</p>
          )}

          {value.map((entry, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                {/* Time slot */}
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  style={{ color: "inherit" }}
                  value={entry.timeSlot}
                  onChange={e => update(i, { timeSlot: e.target.value as NPCScheduleEntry["timeSlot"] })}
                >
                  {TIME_SLOTS.map(ts => (
                    <option key={ts} value={ts}>{ts}</option>
                  ))}
                </select>
                <span className={`text-[10px] font-bold ${SLOT_COLORS[entry.timeSlot] ?? "text-gray-400"}`}>
                  {entry.timeSlot === "morning"   ? "☀️" :
                   entry.timeSlot === "afternoon" ? "🌤" :
                   entry.timeSlot === "evening"   ? "🌇" :
                   entry.timeSlot === "night"     ? "🌙" : "🏟"}
                </span>

                {/* Map ID */}
                <input
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="map_id (leave blank = same map)"
                  value={entry.mapId}
                  onChange={e => update(i, { mapId: e.target.value })}
                />

                {/* Facing */}
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  value={entry.facing}
                  onChange={e => update(i, { facing: e.target.value as NPCScheduleEntry["facing"] })}
                >
                  {FACINGS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>

                <button type="button" onClick={() => remove(i)} className="text-red-500 hover:text-red-400 text-xs shrink-0">✕</button>
              </div>

              {/* Tile position */}
              <div className="flex items-center gap-2">
                <label className="text-[9px] text-gray-500 w-10">Tile</label>
                <div className="flex items-center gap-1">
                  <label className="text-[9px] text-gray-500">X</label>
                  <input type="number" className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                    value={entry.tile.x} min={0} onChange={e => updateTile(i, "x", +e.target.value)} />
                  <label className="text-[9px] text-gray-500">Y</label>
                  <input type="number" className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                    value={entry.tile.y} min={0} onChange={e => updateTile(i, "y", +e.target.value)} />
                </div>

                {/* Idle animation */}
                <div className="flex-1">
                  <input
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300 font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="idleAnimation (e.g. look_around)"
                    value={entry.idleAnimation ?? ""}
                    onChange={e => update(i, { idleAnimation: e.target.value || undefined })}
                  />
                </div>
              </div>

              {/* Patrol path */}
              <div>
                <label className="text-[9px] text-gray-500 uppercase mb-1 block">Patrol Path (optional — "x,y; x,y; x,y")</label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300 font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 5,3; 8,3; 8,6; 5,6"
                  value={(entry.patrolPath ?? []).map(p => `${p.x},${p.y}`).join("; ")}
                  onChange={e => updatePatrol(i, e.target.value)}
                />
                {(entry.patrolPath ?? []).length > 0 && (
                  <p className="text-[9px] text-blue-400 mt-0.5">{entry.patrolPath!.length} waypoints</p>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={add}
            className="w-full py-1.5 border border-dashed border-gray-600 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
          >
            + Add Schedule Entry
          </button>
        </div>
      )}
    </div>
  );
}

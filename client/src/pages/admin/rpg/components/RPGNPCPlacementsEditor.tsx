/**
 * RPGNPCPlacementsEditor
 * Visual editor for MapNPCPlacement[].
 * Drop-in replacement for the raw "npcPlacements JSON" textarea.
 */

import { useState } from "react";
import type { MapNPCPlacement } from "@/rpg/data/schemas";

interface Props {
  value: MapNPCPlacement[];
  onChange: (next: MapNPCPlacement[]) => void;
}

const EMPTY: MapNPCPlacement = { npcId: "", spawnTile: { x: 0, y: 0 } };

export function RPGNPCPlacementsEditor({ value, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const update = (i: number, patch: Partial<MapNPCPlacement>) => {
    const next = value.map((p, idx) => idx === i ? { ...p, ...patch } : p);
    onChange(next);
  };

  const updateTile = (i: number, axis: "x" | "y", v: number) => {
    update(i, { spawnTile: { ...value[i].spawnTile, [axis]: v } });
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const add = () => onChange([...value, { ...EMPTY, spawnTile: { x: 0, y: 0 } }]);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-sm font-semibold text-gray-200 transition-colors"
      >
        <span>👾 NPC Placements ({value.length})</span>
        <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="p-3 space-y-2 bg-gray-900">
          {value.length === 0 && (
            <p className="text-gray-600 text-xs text-center py-2">No NPC placements. Click + to add one.</p>
          )}

          {value.map((p, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
              {/* NPC ID */}
              <div className="flex-1 min-w-0">
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="npc_id"
                  value={p.npcId}
                  onChange={e => update(i, { npcId: e.target.value })}
                />
              </div>

              {/* Spawn tile X/Y */}
              <div className="flex items-center gap-1 shrink-0">
                <label className="text-[10px] text-gray-500">X</label>
                <input
                  type="number"
                  className="w-14 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  value={p.spawnTile.x}
                  min={0}
                  onChange={e => updateTile(i, "x", +e.target.value)}
                />
                <label className="text-[10px] text-gray-500">Y</label>
                <input
                  type="number"
                  className="w-14 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  value={p.spawnTile.y}
                  min={0}
                  onChange={e => updateTile(i, "y", +e.target.value)}
                />
              </div>

              {/* Schedule override */}
              <div className="shrink-0 w-28">
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300 font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="scheduleOverride"
                  value={p.scheduleOverride ?? ""}
                  onChange={e => update(i, { scheduleOverride: e.target.value || undefined })}
                />
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-500 hover:text-red-400 text-xs px-1 shrink-0"
                title="Remove placement"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={add}
            className="w-full py-1.5 border border-dashed border-gray-600 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
          >
            + Add NPC Placement
          </button>

          {/* Column hints */}
          {value.length > 0 && (
            <div className="flex gap-2 text-[9px] text-gray-600 px-3">
              <span className="flex-1">NPC ID</span>
              <span className="w-14 text-center">Tile X</span>
              <span className="w-14 text-center">Tile Y</span>
              <span className="w-28 text-center">Schedule Override</span>
              <span className="w-4" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

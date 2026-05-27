/**
 * RPGEntryPointsEditor
 * Visual editor for MapEntryPoint[].
 */

import { useState } from "react";
import type { MapEntryPoint } from "@/rpg/data/schemas";

interface Props {
  value: MapEntryPoint[];
  onChange: (next: MapEntryPoint[]) => void;
}

const FACINGS = ["down", "up", "left", "right"] as const;

export function RPGEntryPointsEditor({ value, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const update = (i: number, patch: Partial<MapEntryPoint>) => {
    onChange(value.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  };

  const updateTile = (i: number, axis: "x" | "y", v: number) => {
    update(i, { tile: { ...value[i].tile, [axis]: v } });
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const add = () => onChange([...value, { id: `entry_${Date.now()}`, tile: { x: 0, y: 0 }, facingDirection: "down" }]);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-sm font-semibold text-gray-200 transition-colors"
      >
        <span>📍 Entry Points ({value.length})</span>
        <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="p-3 space-y-2 bg-gray-900">
          {value.length === 0 && (
            <p className="text-gray-600 text-xs text-center py-2">No entry points. Add "default" for the main spawn.</p>
          )}

          {value.map((ep, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
              {/* Entry ID */}
              <input
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="entry_id (e.g. default)"
                value={ep.id}
                onChange={e => update(i, { id: e.target.value })}
              />

              {/* Tile X/Y */}
              <div className="flex items-center gap-1">
                <label className="text-[9px] text-gray-500">X</label>
                <input type="number" className="w-14 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  value={ep.tile.x} min={0} onChange={e => updateTile(i, "x", +e.target.value)} />
                <label className="text-[9px] text-gray-500">Y</label>
                <input type="number" className="w-14 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  value={ep.tile.y} min={0} onChange={e => updateTile(i, "y", +e.target.value)} />
              </div>

              {/* Facing */}
              <select
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                value={ep.facingDirection}
                onChange={e => update(i, { facingDirection: e.target.value as MapEntryPoint["facingDirection"] })}
              >
                {FACINGS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>

              <button type="button" onClick={() => remove(i)} className="text-red-500 hover:text-red-400 text-xs shrink-0" title="Remove">✕</button>
            </div>
          ))}

          <button
            type="button"
            onClick={add}
            className="w-full py-1.5 border border-dashed border-gray-600 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
          >
            + Add Entry Point
          </button>
        </div>
      )}
    </div>
  );
}

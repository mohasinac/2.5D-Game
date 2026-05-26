import { SearchableSelect } from "@/components/admin/SearchableSelect";
import type { NPCScheduleEntry, TileCoord, TimeSlot, FacingDirection } from "@/rpg/data/schemas";

interface Props {
  schedule: NPCScheduleEntry[];
  onChange: (schedule: NPCScheduleEntry[]) => void;
}

const TIME_SLOT_OPTIONS: { value: TimeSlot; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
  { value: "tournament", label: "Tournament" },
];

const FACING_OPTIONS: { value: FacingDirection; label: string }[] = [
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

export default function RPGScheduleBuilder({ schedule, onChange }: Props) {
  const update = (i: number, entry: NPCScheduleEntry) => {
    const next = [...schedule]; next[i] = entry; onChange(next);
  };

  const add = () => onChange([...schedule, {
    timeSlot: "morning", mapId: "", tile: { x: 0, y: 0 }, facing: "down",
  }]);

  const remove = (i: number) => onChange(schedule.filter((_, j) => j !== i));

  const updatePatrol = (i: number, path: TileCoord[]) => {
    update(i, { ...schedule[i], patrolPath: path.length ? path : undefined });
  };

  return (
    <div className="space-y-3">
      {schedule.map((entry, i) => (
        <div key={i} className="p-3 bg-gray-900 border border-gray-700 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500">Schedule #{i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm">x</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Time Slot</label>
              <SearchableSelect value={entry.timeSlot} options={TIME_SLOT_OPTIONS}
                onChange={v => update(i, { ...entry, timeSlot: v as TimeSlot })} />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Map ID</label>
              <input type="text" value={entry.mapId} onChange={e => update(i, { ...entry, mapId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Tile X</label>
              <input type="number" value={entry.tile.x} onChange={e => update(i, { ...entry, tile: { ...entry.tile, x: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Tile Y</label>
              <input type="number" value={entry.tile.y} onChange={e => update(i, { ...entry, tile: { ...entry.tile, y: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Facing</label>
              <SearchableSelect value={entry.facing} options={FACING_OPTIONS}
                onChange={v => update(i, { ...entry, facing: v as FacingDirection })} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400">Patrol Path</label>
            {(entry.patrolPath ?? []).map((pt, j) => (
              <div key={j} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">{j}</span>
                <input type="number" value={pt.x} onChange={e => {
                  const path = [...(entry.patrolPath ?? [])]; path[j] = { ...path[j], x: Number(e.target.value) };
                  updatePatrol(i, path);
                }} className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="x" />
                <input type="number" value={pt.y} onChange={e => {
                  const path = [...(entry.patrolPath ?? [])]; path[j] = { ...path[j], y: Number(e.target.value) };
                  updatePatrol(i, path);
                }} className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="y" />
                <button type="button" onClick={() => updatePatrol(i, (entry.patrolPath ?? []).filter((_, k) => k !== j))}
                  className="text-red-400 text-xs">x</button>
              </div>
            ))}
            <button type="button" onClick={() => updatePatrol(i, [...(entry.patrolPath ?? []), { x: 0, y: 0 }])}
              className="text-xs text-blue-400 hover:text-blue-300">+ Add Point</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={add}
        className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:border-gray-500">
        + Add Schedule Entry
      </button>
    </div>
  );
}

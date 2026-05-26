import { SearchableSelect } from "@/components/admin/SearchableSelect";
import type { MapExit } from "@/rpg/data/schemas";

interface Props {
  exits: MapExit[];
  onChange: (exits: MapExit[]) => void;
}

const DIRECTION_OPTIONS = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "warp", label: "Warp" },
];

const TRANSITION_OPTIONS = [
  { value: "walk", label: "Walk" },
  { value: "warp", label: "Warp" },
  { value: "door", label: "Door" },
  { value: "cave", label: "Cave" },
];

export default function RPGMapExitsEditor({ exits, onChange }: Props) {
  const update = (i: number, exit: MapExit) => {
    const next = [...exits]; next[i] = exit; onChange(next);
  };

  const add = () => onChange([...exits, {
    id: crypto.randomUUID(),
    triggerRect: { x: 0, y: 0, width: 1, height: 1 },
    targetMapId: "",
    targetEntryId: "",
    direction: "north",
    transitionType: "walk",
  }]);

  const remove = (i: number) => onChange(exits.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {exits.map((exit, i) => (
        <div key={exit.id} className="p-3 bg-gray-900 border border-gray-700 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500 truncate max-w-[180px]">{exit.id}</span>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm">x</button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Rect X</label>
              <input type="number" value={exit.triggerRect.x}
                onChange={e => update(i, { ...exit, triggerRect: { ...exit.triggerRect, x: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Rect Y</label>
              <input type="number" value={exit.triggerRect.y}
                onChange={e => update(i, { ...exit, triggerRect: { ...exit.triggerRect, y: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Width</label>
              <input type="number" min={1} value={exit.triggerRect.width}
                onChange={e => update(i, { ...exit, triggerRect: { ...exit.triggerRect, width: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Height</label>
              <input type="number" min={1} value={exit.triggerRect.height}
                onChange={e => update(i, { ...exit, triggerRect: { ...exit.triggerRect, height: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Target Map ID</label>
              <input type="text" value={exit.targetMapId} onChange={e => update(i, { ...exit, targetMapId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Target Entry ID</label>
              <input type="text" value={exit.targetEntryId} onChange={e => update(i, { ...exit, targetEntryId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Direction</label>
              <SearchableSelect value={exit.direction} options={DIRECTION_OPTIONS}
                onChange={v => update(i, { ...exit, direction: v as MapExit["direction"] })} />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Transition</label>
              <SearchableSelect value={exit.transitionType} options={TRANSITION_OPTIONS}
                onChange={v => update(i, { ...exit, transitionType: v as MapExit["transitionType"] })} />
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={add}
        className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:border-gray-500">
        + Add Exit
      </button>
    </div>
  );
}

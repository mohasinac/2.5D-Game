import type { MapNPCPlacement } from "@/rpg/data/schemas";

interface Props {
  placements: MapNPCPlacement[];
  onChange: (placements: MapNPCPlacement[]) => void;
}

export default function RPGNPCPlacementsEditor({ placements, onChange }: Props) {
  const update = (i: number, p: MapNPCPlacement) => {
    const next = [...placements]; next[i] = p; onChange(next);
  };

  const add = () => onChange([...placements, { npcId: "", spawnTile: { x: 0, y: 0 } }]);

  const remove = (i: number) => onChange(placements.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {placements.map((p, i) => (
        <div key={i} className="p-3 bg-gray-900 border border-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-0.5">
              <label className="text-xs text-gray-500">NPC ID</label>
              <input type="text" value={p.npcId} onChange={e => update(i, { ...p, npcId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="w-20 space-y-0.5">
              <label className="text-xs text-gray-500">X</label>
              <input type="number" value={p.spawnTile.x}
                onChange={e => update(i, { ...p, spawnTile: { ...p.spawnTile, x: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="w-20 space-y-0.5">
              <label className="text-xs text-gray-500">Y</label>
              <input type="number" value={p.spawnTile.y}
                onChange={e => update(i, { ...p, spawnTile: { ...p.spawnTile, y: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <button type="button" onClick={() => remove(i)}
              className="text-red-400 hover:text-red-300 text-sm mt-4">x</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={add}
        className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:border-gray-500">
        + Add NPC Placement
      </button>
    </div>
  );
}

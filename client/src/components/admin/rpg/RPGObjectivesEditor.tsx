import { SearchableSelect } from "@/components/admin/SearchableSelect";
import type { QuestObjective } from "@/rpg/data/schemas";

interface Props {
  objectives: QuestObjective[];
  onChange: (objectives: QuestObjective[]) => void;
}

const OBJECTIVE_TYPES = [
  "talk-to-npc", "defeat-npc", "reach-map", "collect-item",
  "win-tournament", "trigger-event", "complete-quest",
];
const TYPE_OPTIONS = OBJECTIVE_TYPES.map(t => ({ value: t, label: t }));

export default function RPGObjectivesEditor({ objectives, onChange }: Props) {
  const update = (i: number, obj: QuestObjective) => {
    const next = [...objectives]; next[i] = obj; onChange(next);
  };

  const add = () => onChange([...objectives, {
    id: crypto.randomUUID(), type: "talk-to-npc", targetId: "", description: "", optional: false,
  }]);

  const remove = (i: number) => onChange(objectives.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {objectives.map((obj, i) => (
        <div key={obj.id} className="p-3 bg-gray-900 border border-gray-700 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500 truncate max-w-[120px]">{obj.id}</span>
            <div className="flex-1">
              <SearchableSelect value={obj.type} options={TYPE_OPTIONS}
                onChange={v => update(i, { ...obj, type: v })} />
            </div>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm">x</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Target ID</label>
              <input type="text" value={obj.targetId} onChange={e => update(i, { ...obj, targetId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Quantity</label>
              <input type="number" min={0} value={obj.quantity ?? ""} onChange={e => update(i, { ...obj, quantity: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
          </div>

          <div className="space-y-0.5">
            <label className="text-xs text-gray-500">Description</label>
            <textarea value={obj.description} onChange={e => update(i, { ...obj, description: e.target.value })} rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white resize-y" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={obj.optional} onChange={e => update(i, { ...obj, optional: e.target.checked })}
              className="accent-blue-500" />
            <label className="text-xs text-gray-400">Optional</label>
          </div>
        </div>
      ))}

      <button type="button" onClick={add}
        className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:border-gray-500">
        + Add Objective
      </button>
    </div>
  );
}

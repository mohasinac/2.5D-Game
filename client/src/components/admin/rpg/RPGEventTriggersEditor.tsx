import { SearchableSelect } from "@/components/admin/SearchableSelect";
import RPGFlagConditionEditor from "./RPGFlagConditionEditor";
import type { MapEventTrigger } from "@/rpg/data/schemas";

interface Props {
  triggers: MapEventTrigger[];
  onChange: (triggers: MapEventTrigger[]) => void;
}

const TRIGGER_MODE_OPTIONS = [
  { value: "enter", label: "Enter" },
  { value: "interact", label: "Interact" },
  { value: "step", label: "Step" },
];

export default function RPGEventTriggersEditor({ triggers, onChange }: Props) {
  const update = (i: number, t: MapEventTrigger) => {
    const next = [...triggers]; next[i] = t; onChange(next);
  };

  const add = () => onChange([...triggers, {
    id: crypto.randomUUID(),
    triggerRect: { x: 0, y: 0, width: 1, height: 1 },
    storyEventId: "",
    triggerOnce: false,
    triggerMode: "enter",
  }]);

  const remove = (i: number) => onChange(triggers.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {triggers.map((t, i) => (
        <div key={t.id} className="p-3 bg-gray-900 border border-gray-700 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500 truncate max-w-[180px]">{t.id}</span>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm">x</button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Rect X</label>
              <input type="number" value={t.triggerRect.x}
                onChange={e => update(i, { ...t, triggerRect: { ...t.triggerRect, x: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Rect Y</label>
              <input type="number" value={t.triggerRect.y}
                onChange={e => update(i, { ...t, triggerRect: { ...t.triggerRect, y: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Width</label>
              <input type="number" min={1} value={t.triggerRect.width}
                onChange={e => update(i, { ...t, triggerRect: { ...t.triggerRect, width: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Height</label>
              <input type="number" min={1} value={t.triggerRect.height}
                onChange={e => update(i, { ...t, triggerRect: { ...t.triggerRect, height: Number(e.target.value) } })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Story Event ID</label>
              <input type="text" value={t.storyEventId} onChange={e => update(i, { ...t, storyEventId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Trigger Mode</label>
              <SearchableSelect value={t.triggerMode} options={TRIGGER_MODE_OPTIONS}
                onChange={v => update(i, { ...t, triggerMode: v as MapEventTrigger["triggerMode"] })} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={t.triggerOnce} onChange={e => update(i, { ...t, triggerOnce: e.target.checked })}
              className="accent-blue-500" />
            <label className="text-xs text-gray-400">Trigger Once</label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400">Trigger Condition (Flags)</label>
            <RPGFlagConditionEditor
              value={t.triggerCondition ?? {}}
              onChange={v => update(i, { ...t, triggerCondition: Object.keys(v).length ? v : undefined })}
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={add}
        className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:border-gray-500">
        + Add Event Trigger
      </button>
    </div>
  );
}

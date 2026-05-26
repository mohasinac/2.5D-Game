import type { GateCondition } from "@/rpg/data/schemas";
import RPGFlagConditionEditor from "./RPGFlagConditionEditor";

interface Props {
  value: GateCondition;
  onChange: (v: GateCondition) => void;
}

function StringListField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={v}
            onChange={e => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="text-red-400 hover:text-red-300 text-sm px-1"
          >
            x
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="text-xs text-blue-400 hover:text-blue-300"
      >
        + Add
      </button>
    </div>
  );
}

export default function RPGGateConditionEditor({ value, onChange }: Props) {
  const set = <K extends keyof GateCondition>(k: K, v: GateCondition[K]) => {
    const next = { ...value, [k]: v };
    if (v === undefined || v === null || v === 0 || (Array.isArray(v) && v.length === 0)) {
      delete next[k];
    }
    onChange(next);
  };

  return (
    <div className="space-y-4 p-3 bg-gray-900 border border-gray-700 rounded-lg">
      <RPGFlagConditionEditor
        label="Flags"
        value={value.flags ?? {}}
        onChange={f => set("flags", Object.keys(f).length ? f : undefined)}
      />

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Min Player Level</label>
        <input
          type="number"
          min={0}
          value={value.minPlayerLevel ?? 0}
          onChange={e => set("minPlayerLevel", Number(e.target.value) || undefined)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Min Beyblade Level</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value.minBeybladeLevel?.beybladeId ?? ""}
            onChange={e =>
              set("minBeybladeLevel", e.target.value
                ? { beybladeId: e.target.value, level: value.minBeybladeLevel?.level ?? 1 }
                : undefined)
            }
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
            placeholder="beybladeId"
          />
          <input
            type="number"
            min={1}
            value={value.minBeybladeLevel?.level ?? 1}
            onChange={e =>
              set("minBeybladeLevel", value.minBeybladeLevel
                ? { ...value.minBeybladeLevel, level: Number(e.target.value) || 1 }
                : undefined)
            }
            className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
            placeholder="level"
          />
        </div>
      </div>

      <StringListField
        label="Required Badges"
        values={value.requiredBadges ?? []}
        onChange={v => set("requiredBadges", v.length ? v : undefined)}
        placeholder="badgeId"
      />

      <StringListField
        label="Any Badge From"
        values={value.anyBadgeFrom ?? []}
        onChange={v => set("anyBadgeFrom", v.length ? v : undefined)}
        placeholder="badgeId"
      />

      <StringListField
        label="Defeated NPCs"
        values={value.defeatedNPCs ?? []}
        onChange={v => set("defeatedNPCs", v.length ? v : undefined)}
        placeholder="npcId"
      />
    </div>
  );
}

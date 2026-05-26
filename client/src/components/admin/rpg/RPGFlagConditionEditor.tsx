import { useState } from "react";
import type { FlagCondition } from "@/rpg/data/schemas";

interface Props {
  value: FlagCondition;
  onChange: (v: FlagCondition) => void;
  label?: string;
}

const SECTIONS = ["all", "any", "none"] as const;

export default function RPGFlagConditionEditor({ value, onChange, label }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (s: string) => setCollapsed(p => ({ ...p, [s]: !p[s] }));

  const entries = (section: (typeof SECTIONS)[number]): [string, boolean][] =>
    Object.entries(value[section] ?? {});

  const update = (section: (typeof SECTIONS)[number], rec: Record<string, boolean>) => {
    const next = { ...value, [section]: rec };
    if (Object.keys(rec).length === 0) delete next[section];
    onChange(next);
  };

  const addEntry = (section: (typeof SECTIONS)[number]) => {
    const rec = { ...(value[section] ?? {}), ["new_flag"]: true };
    update(section, rec);
  };

  const removeEntry = (section: (typeof SECTIONS)[number], key: string) => {
    const rec = { ...(value[section] ?? {}) };
    delete rec[key];
    update(section, rec);
  };

  const renameKey = (section: (typeof SECTIONS)[number], oldKey: string, newKey: string) => {
    if (newKey === oldKey) return;
    const rec = { ...(value[section] ?? {}) };
    const val = rec[oldKey];
    delete rec[oldKey];
    rec[newKey] = val;
    update(section, rec);
  };

  const toggleVal = (section: (typeof SECTIONS)[number], key: string) => {
    const rec = { ...(value[section] ?? {}) };
    rec[key] = !rec[key];
    update(section, rec);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>}
      {SECTIONS.map(s => (
        <div key={s} className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggle(s)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 text-sm font-medium text-gray-200 hover:bg-gray-750"
          >
            <span>{s.toUpperCase()} ({entries(s).length})</span>
            <span className="text-xs text-gray-500">{collapsed[s] ? "+" : "-"}</span>
          </button>
          {!collapsed[s] && (
            <div className="p-3 space-y-2 bg-gray-900">
              {entries(s).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={key}
                    onBlur={e => renameKey(s, key, e.target.value.trim() || key)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                    placeholder="flag key"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVal(s, key)}
                    className={`px-3 py-1 rounded text-xs font-bold ${val ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"}`}
                  >
                    {val ? "TRUE" : "FALSE"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEntry(s, key)}
                    className="text-red-400 hover:text-red-300 text-sm px-1"
                  >
                    x
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addEntry(s)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                + Add flag
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

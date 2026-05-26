import type { QuestReward } from "@/rpg/data/schemas";

interface Props {
  rewards: QuestReward;
  onChange: (rewards: QuestReward) => void;
}

function StringListField({ label, values, onChange, placeholder }: {
  label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="text" value={v} onChange={e => { const n = [...values]; n[i] = e.target.value; onChange(n); }}
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder={placeholder} />
          <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="text-red-400 hover:text-red-300 text-sm">x</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...values, ""])} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
    </div>
  );
}

function KVPairEditor({ label, entries, onChange, keyPlaceholder, valuePlaceholder }: {
  label: string;
  entries: Record<string, number>;
  onChange: (v: Record<string, number>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}) {
  const pairs = Object.entries(entries);
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      {pairs.map(([k, v]) => (
        <div key={k} className="flex items-center gap-2">
          <input type="text" defaultValue={k} onBlur={e => {
            const nk = e.target.value.trim() || k;
            if (nk === k) return;
            const rec = { ...entries }; const val = rec[k]; delete rec[k]; rec[nk] = val; onChange(rec);
          }} className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder={keyPlaceholder} />
          <input type="number" value={v} onChange={e => { const rec = { ...entries }; rec[k] = Number(e.target.value); onChange(rec); }}
            className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder={valuePlaceholder} />
          <button type="button" onClick={() => { const rec = { ...entries }; delete rec[k]; onChange(rec); }}
            className="text-red-400 hover:text-red-300 text-sm">x</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange({ ...entries, new_entry: 0 })} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
    </div>
  );
}

function FlagPairEditor({ label, entries, onChange }: {
  label: string; entries: Record<string, boolean>; onChange: (v: Record<string, boolean>) => void;
}) {
  const pairs = Object.entries(entries);
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      {pairs.map(([k, v]) => (
        <div key={k} className="flex items-center gap-2">
          <input type="text" defaultValue={k} onBlur={e => {
            const nk = e.target.value.trim() || k;
            if (nk === k) return;
            const rec = { ...entries }; const val = rec[k]; delete rec[k]; rec[nk] = val; onChange(rec);
          }} className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
          <button type="button" onClick={() => { const rec = { ...entries }; rec[k] = !rec[k]; onChange(rec); }}
            className={`px-2 py-0.5 rounded text-xs font-bold ${v ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"}`}>
            {v ? "TRUE" : "FALSE"}
          </button>
          <button type="button" onClick={() => { const rec = { ...entries }; delete rec[k]; onChange(rec); }}
            className="text-red-400 text-xs">x</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange({ ...entries, new_flag: true })} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
    </div>
  );
}

export default function RPGRewardsEditor({ rewards, onChange }: Props) {
  const set = <K extends keyof QuestReward>(k: K, v: QuestReward[K]) => {
    const next = { ...rewards, [k]: v };
    if (v === undefined || v === null || v === 0 || (Array.isArray(v) && v.length === 0) ||
      (typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length === 0)) {
      delete next[k];
    }
    onChange(next);
  };

  return (
    <div className="space-y-4 p-3 bg-gray-900 border border-gray-700 rounded-lg">
      <div className="space-y-0.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Reputation</label>
        <input type="number" value={rewards.reputation ?? 0} onChange={e => set("reputation", Number(e.target.value) || undefined)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
      </div>

      <KVPairEditor label="Friendship" entries={rewards.friendship ?? {}}
        onChange={v => set("friendship", Object.keys(v).length ? v : undefined)}
        keyPlaceholder="npcId" valuePlaceholder="delta" />

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Items</label>
        {(rewards.items ?? []).map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={item.itemId} onChange={e => {
              const items = [...(rewards.items ?? [])]; items[i] = { ...items[i], itemId: e.target.value };
              set("items", items.length ? items : undefined);
            }} className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="itemId" />
            <input type="number" min={1} value={item.quantity} onChange={e => {
              const items = [...(rewards.items ?? [])]; items[i] = { ...items[i], quantity: Number(e.target.value) || 1 };
              set("items", items.length ? items : undefined);
            }} className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="qty" />
            <button type="button" onClick={() => {
              const items = (rewards.items ?? []).filter((_, j) => j !== i);
              set("items", items.length ? items : undefined);
            }} className="text-red-400 text-xs">x</button>
          </div>
        ))}
        <button type="button" onClick={() => set("items", [...(rewards.items ?? []), { itemId: "", quantity: 1 }])}
          className="text-xs text-blue-400 hover:text-blue-300">+ Add Item</button>
      </div>

      <div className="space-y-0.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Beyblade ID</label>
        <input type="text" value={rewards.beybladeId ?? ""} onChange={e => set("beybladeId", e.target.value || undefined)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
      </div>

      <StringListField label="Unlock Map IDs" values={rewards.unlockMapIds ?? []}
        onChange={v => set("unlockMapIds", v.length ? v : undefined)} placeholder="mapId" />

      <StringListField label="Unlock Quest IDs" values={rewards.unlockQuestIds ?? []}
        onChange={v => set("unlockQuestIds", v.length ? v : undefined)} placeholder="questId" />

      <FlagPairEditor label="Set Flags" entries={rewards.setFlags ?? {}}
        onChange={v => set("setFlags", Object.keys(v).length ? v : undefined)} />

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">XP</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <label className="text-xs text-gray-500">Player XP</label>
            <input type="number" min={0} value={rewards.xp?.playerXP ?? 0}
              onChange={e => set("xp", { ...rewards.xp, playerXP: Number(e.target.value) || undefined })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
          </div>
          <div className="space-y-0.5">
            <label className="text-xs text-gray-500">Beyblade XP</label>
            <input type="number" min={0} value={rewards.xp?.beybladeXP ?? 0}
              onChange={e => set("xp", { ...rewards.xp, beybladeXP: Number(e.target.value) || undefined })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-0.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Badge ID</label>
        <input type="text" value={rewards.badgeId ?? ""} onChange={e => set("badgeId", e.target.value || undefined)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
      </div>
    </div>
  );
}

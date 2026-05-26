import { SearchableSelect } from "@/components/admin/SearchableSelect";
import type { StoryEventStep, StoryEventStepType, BattleParams } from "@/rpg/data/schemas";

interface Props {
  steps: StoryEventStep[];
  onChange: (steps: StoryEventStep[]) => void;
}

const STEP_TYPES: StoryEventStepType[] = [
  "dialogue", "move-npc", "move-player", "camera-pan", "camera-shake",
  "set-flag", "set-flags", "wait", "play-sfx", "play-bgm",
  "screen-flash", "screen-fade", "spawn-npc", "despawn-npc",
  "lock-player", "unlock-player", "start-battle",
  "award-item", "award-beyblade", "award-badge",
  "change-map", "show-title-card",
];

const STEP_OPTIONS = STEP_TYPES.map(t => ({ value: t, label: t }));

const DIFFICULTY_OPTIONS = [
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "hell", label: "Hell" },
];

const MODE_OPTIONS = [
  { value: "ai", label: "AI" },
  { value: "tournament", label: "Tournament" },
];

const BEST_OF_OPTIONS = [
  { value: "1", label: "BO1" },
  { value: "3", label: "BO3" },
  { value: "5", label: "BO5" },
];

function TextInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-0.5">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
        placeholder={placeholder}
      />
    </div>
  );
}

function NumInput({ label, value, onChange }: {
  label: string; value: number | undefined; onChange: (v: number | undefined) => void;
}) {
  return (
    <div className="space-y-0.5">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type="number"
        value={value ?? ""}
        onChange={e => onChange(e.target.value ? Number(e.target.value) : undefined)}
        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
      />
    </div>
  );
}

function FlagsSubEditor({ flags, onChange }: {
  flags: Record<string, boolean> | undefined;
  onChange: (f: Record<string, boolean> | undefined) => void;
}) {
  const entries = Object.entries(flags ?? {});
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">Flags</label>
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-center gap-2">
          <input
            type="text"
            defaultValue={k}
            onBlur={e => {
              const newKey = e.target.value.trim() || k;
              if (newKey === k) return;
              const rec = { ...(flags ?? {}) };
              const val = rec[k]; delete rec[k]; rec[newKey] = val;
              onChange(rec);
            }}
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
          />
          <button type="button" onClick={() => {
            const rec = { ...(flags ?? {}) }; rec[k] = !rec[k];
            onChange(rec);
          }} className={`px-2 py-0.5 rounded text-xs font-bold ${v ? "bg-green-700" : "bg-red-700"}`}>
            {v ? "T" : "F"}
          </button>
          <button type="button" onClick={() => {
            const rec = { ...(flags ?? {}) }; delete rec[k];
            onChange(Object.keys(rec).length ? rec : undefined);
          }} className="text-red-400 text-xs">x</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange({ ...(flags ?? {}), new_flag: true })}
        className="text-xs text-blue-400 hover:text-blue-300">+ flag</button>
    </div>
  );
}

function BattleParamsEditor({ params, onChange }: {
  params: BattleParams | undefined;
  onChange: (p: BattleParams) => void;
}) {
  const p: BattleParams = params ?? {
    mode: "ai", playerBeybladeId: "", opponentBeybladeId: "", arenaId: "",
    difficulty: "medium", npcId: "", rpgContext: { isBossEncounter: false },
  };
  const set = <K extends keyof BattleParams>(k: K, v: BattleParams[K]) => onChange({ ...p, [k]: v });

  return (
    <div className="space-y-2 p-2 bg-gray-850 border border-gray-700 rounded">
      <label className="text-xs font-semibold text-gray-400">Battle Params</label>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <label className="text-xs text-gray-500">Mode</label>
          <SearchableSelect value={p.mode} options={MODE_OPTIONS} onChange={v => set("mode", v as BattleParams["mode"])} />
        </div>
        <div className="space-y-0.5">
          <label className="text-xs text-gray-500">Difficulty</label>
          <SearchableSelect value={p.difficulty} options={DIFFICULTY_OPTIONS} onChange={v => set("difficulty", v as BattleParams["difficulty"])} />
        </div>
        <TextInput label="Player Beyblade" value={p.playerBeybladeId} onChange={v => set("playerBeybladeId", v)} />
        <TextInput label="Opponent Beyblade" value={p.opponentBeybladeId} onChange={v => set("opponentBeybladeId", v)} />
        <TextInput label="Arena ID" value={p.arenaId} onChange={v => set("arenaId", v)} />
        <TextInput label="NPC ID" value={p.npcId} onChange={v => set("npcId", v)} />
        <div className="space-y-0.5">
          <label className="text-xs text-gray-500">Best Of</label>
          <SearchableSelect
            value={String(p.bestOf ?? 1)}
            options={BEST_OF_OPTIONS}
            onChange={v => set("bestOf", Number(v) as 1 | 3 | 5)}
          />
        </div>
        <div className="flex items-center gap-2 pt-4">
          <input type="checkbox" checked={p.rpgContext.isBossEncounter}
            onChange={e => set("rpgContext", { ...p.rpgContext, isBossEncounter: e.target.checked })}
            className="accent-blue-500" />
          <label className="text-xs text-gray-400">Boss Encounter</label>
        </div>
      </div>
    </div>
  );
}

function StepFields({ step, onChange }: { step: StoryEventStep; onChange: (s: StoryEventStep) => void }) {
  const set = <K extends keyof StoryEventStep>(k: K, v: StoryEventStep[K]) => onChange({ ...step, [k]: v });
  const t = step.type;

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {(t === "dialogue") && <TextInput label="Dialogue ID" value={step.dialogueId ?? ""} onChange={v => set("dialogueId", v || undefined)} />}
      {(t === "move-npc" || t === "spawn-npc" || t === "despawn-npc") && <TextInput label="NPC ID" value={step.npcId ?? ""} onChange={v => set("npcId", v || undefined)} />}
      {(t === "move-npc" || t === "move-player" || t === "camera-pan") && (
        <>
          <NumInput label="Target Tile X" value={step.targetTile?.x} onChange={v => set("targetTile", { x: v ?? 0, y: step.targetTile?.y ?? 0 })} />
          <NumInput label="Target Tile Y" value={step.targetTile?.y} onChange={v => set("targetTile", { x: step.targetTile?.x ?? 0, y: v ?? 0 })} />
        </>
      )}
      {(t === "wait" || t === "camera-shake" || t === "screen-flash" || t === "screen-fade") && <NumInput label="Duration (ms)" value={step.duration} onChange={v => set("duration", v)} />}
      {(t === "set-flag" || t === "set-flags") && <FlagsSubEditor flags={step.flags} onChange={f => set("flags", f)} />}
      {(t === "play-sfx") && <TextInput label="SFX ID" value={step.sfxId ?? ""} onChange={v => set("sfxId", v || undefined)} />}
      {(t === "play-bgm") && <TextInput label="BGM ID" value={step.bgmId ?? ""} onChange={v => set("bgmId", v || undefined)} />}
      {(t === "screen-flash") && <TextInput label="Flash Color" value={step.flashColor ?? ""} onChange={v => set("flashColor", v || undefined)} placeholder="#ffffff" />}
      {(t === "start-battle") && <div className="col-span-2"><BattleParamsEditor params={step.battleParams} onChange={v => set("battleParams", v)} /></div>}
      {(t === "award-item") && (
        <>
          <TextInput label="Item ID" value={step.itemId ?? ""} onChange={v => set("itemId", v || undefined)} />
          <NumInput label="Quantity" value={step.quantity} onChange={v => set("quantity", v)} />
        </>
      )}
      {(t === "award-beyblade") && <TextInput label="Beyblade ID" value={step.beybladeId ?? ""} onChange={v => set("beybladeId", v || undefined)} />}
      {(t === "award-badge") && <TextInput label="Badge ID" value={step.badgeId ?? ""} onChange={v => set("badgeId", v || undefined)} />}
      {(t === "change-map") && (
        <>
          <TextInput label="Map ID" value={step.mapId ?? ""} onChange={v => set("mapId", v || undefined)} />
          <TextInput label="Entry Point ID" value={step.entryPointId ?? ""} onChange={v => set("entryPointId", v || undefined)} />
        </>
      )}
      {(t === "show-title-card") && (
        <>
          <TextInput label="Title Text" value={step.titleText ?? ""} onChange={v => set("titleText", v || undefined)} />
          <TextInput label="Subtitle Text" value={step.subtitleText ?? ""} onChange={v => set("subtitleText", v || undefined)} />
        </>
      )}
      {(t === "dialogue" || t === "show-title-card" || t === "wait") && (
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={step.waitForInput ?? false}
            onChange={e => set("waitForInput", e.target.checked || undefined)}
            className="accent-blue-500" />
          <label className="text-xs text-gray-400">Wait for Input</label>
        </div>
      )}
    </div>
  );
}

export default function RPGStepBuilder({ steps, onChange }: Props) {
  const add = () => onChange([...steps, { type: "dialogue" }]);

  const remove = (i: number) => onChange(steps.filter((_, j) => j !== i));

  const update = (i: number, s: StoryEventStep) => {
    const next = [...steps]; next[i] = s; onChange(next);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="p-3 bg-gray-900 border border-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono w-6">#{i + 1}</span>
            <div className="flex-1">
              <SearchableSelect
                value={step.type}
                options={STEP_OPTIONS}
                onChange={v => update(i, { ...step, type: v as StoryEventStepType })}
              />
            </div>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
              className="text-gray-400 hover:text-white disabled:opacity-30 text-sm px-1">^</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === steps.length - 1}
              className="text-gray-400 hover:text-white disabled:opacity-30 text-sm px-1">v</button>
            <button type="button" onClick={() => remove(i)}
              className="text-red-400 hover:text-red-300 text-sm px-1">x</button>
          </div>
          <StepFields step={step} onChange={s => update(i, s)} />
        </div>
      ))}
      <button type="button" onClick={add}
        className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:border-gray-500">
        + Add Step
      </button>
    </div>
  );
}

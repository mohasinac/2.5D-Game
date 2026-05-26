import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { ScenarioOutput } from "../parser/types";
import toast from "react-hot-toast";

interface Props {
  output: ScenarioOutput;
  onBack: () => void;
  onDone: () => void;
}

interface SaveProgress {
  total: number;
  saved: number;
  current: string;
  errors: string[];
}

export function ScenarioSaveStep({ output, onBack, onDone }: Props) {
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<SaveProgress | null>(null);
  const [complete, setComplete] = useState(false);

  const totalDocs =
    output.maps.length +
    output.npcs.length +
    output.dialogues.length +
    output.quests.length +
    output.storyEvents.length +
    output.cutscenes.length +
    output.badges.length +
    output.items.length;

  const handleSave = async () => {
    setSaving(true);
    const prog: SaveProgress = { total: totalDocs, saved: 0, current: "", errors: [] };
    setProgress({ ...prog });

    const saveDoc = async (col: string, id: string, data: Record<string, unknown>) => {
      prog.current = `${col}/${id}`;
      setProgress({ ...prog });
      try {
        await setDoc(doc(db, col, id), data);
        prog.saved += 1;
      } catch (e) {
        prog.errors.push(`${col}/${id}: ${(e as Error).message}`);
      }
      setProgress({ ...prog });
    };

    for (const map of output.maps) {
      await saveDoc(COLLECTIONS.RPG_MAPS, map.id, map as unknown as Record<string, unknown>);
    }
    for (const npc of output.npcs) {
      await saveDoc(COLLECTIONS.RPG_NPCS, npc.id, npc as unknown as Record<string, unknown>);
    }
    for (const dlg of output.dialogues) {
      await saveDoc(COLLECTIONS.RPG_DIALOGUES, dlg.id, dlg as unknown as Record<string, unknown>);
    }
    for (const quest of output.quests) {
      await saveDoc(COLLECTIONS.RPG_QUESTS, quest.id, quest as unknown as Record<string, unknown>);
    }
    for (const evt of output.storyEvents) {
      await saveDoc(COLLECTIONS.RPG_STORY_EVENTS, evt.id, evt as unknown as Record<string, unknown>);
    }
    for (const cut of output.cutscenes) {
      await saveDoc(COLLECTIONS.RPG_CUTSCENES, cut.id, cut as unknown as Record<string, unknown>);
    }
    for (const badge of output.badges) {
      await saveDoc(COLLECTIONS.RPG_BADGES, badge.id, badge as unknown as Record<string, unknown>);
    }
    for (const item of output.items) {
      await saveDoc(COLLECTIONS.RPG_ITEMS, item.id, item as unknown as Record<string, unknown>);
    }

    setSaving(false);
    setComplete(true);

    if (prog.errors.length === 0) {
      toast.success(`Saved ${prog.saved} documents to Firestore!`);
    } else {
      toast.error(`Saved ${prog.saved}/${prog.total} — ${prog.errors.length} errors`);
    }
  };

  const pct = progress ? Math.round((progress.saved / Math.max(progress.total, 1)) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white text-lg font-semibold">Step 3: Save to Firestore</h2>
        <button onClick={onBack} disabled={saving} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
          Back
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="text-white text-sm font-medium mb-3">Summary</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Stat label="Maps" count={output.maps.length} />
          <Stat label="NPCs" count={output.npcs.length} />
          <Stat label="Dialogues" count={output.dialogues.length} />
          <Stat label="Quests" count={output.quests.length} />
          <Stat label="Story Events" count={output.storyEvents.length} />
          <Stat label="Cutscenes" count={output.cutscenes.length} />
          <Stat label="Badges" count={output.badges.length} />
          <Stat label="Items" count={output.items.length} />
        </div>
        <div className="mt-3 text-gray-400 text-xs">Total: {totalDocs} documents</div>
      </div>

      {progress && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-400">
              {complete ? "Complete" : `Saving: ${progress.current}`}
            </span>
            <span className="text-white font-mono">{progress.saved}/{progress.total}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progress.errors.length > 0 ? "bg-yellow-500" : "bg-blue-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {progress.errors.length > 0 && (
            <div className="mt-3 bg-red-900/30 border border-red-700 rounded-lg p-2">
              <div className="text-red-400 text-xs font-bold mb-1">Errors:</div>
              {progress.errors.map((err, i) => (
                <div key={i} className="text-red-300 text-xs font-mono">{err}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {!complete ? (
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save All to Firestore"}
        </button>
      ) : (
        <div className="flex gap-3">
          <button onClick={onDone} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
            Generate Another
          </button>
          <a href="/admin/rpg" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors no-underline">
            Go to RPG Dashboard
          </a>
        </div>
      )}
    </div>
  );
}

function Stat({ label, count }: { label: string; count: number }) {
  return (
    <div className="bg-gray-800 rounded-lg p-2 text-center">
      <div className="text-white font-bold text-lg font-mono">{count}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}

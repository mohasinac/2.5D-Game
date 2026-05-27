/**
 * RPGBattleConfigForm
 * Structured form for NPCBattleConfig.
 * Drop-in replacement for the raw "battleConfig JSON" textarea.
 */

import { useState } from "react";
import type { NPCBattleConfig } from "@/rpg/data/schemas";

interface Props {
  value: NPCBattleConfig | null;
  onChange: (next: NPCBattleConfig | null) => void;
}

const DIFFICULTIES = ["easy", "medium", "hard", "hell"] as const;

const DEFAULT_CONFIG: NPCBattleConfig = {
  beybladeId: "",
  arenaId: "classic_circle",
  difficulty: "medium",
  introDialogueId: "",
  victoryDialogueId: "",
  defeatDialogueId: "",
  canRematch: true,
  rematchCooldownBattles: 0,
};

export function RPGBattleConfigForm({ value, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const enabled = value !== null;

  const update = (patch: Partial<NPCBattleConfig>) => {
    if (!value) return;
    onChange({ ...value, ...patch });
  };

  const updateXP = (field: "playerXP" | "beybladeXP", v: number) => {
    if (!value) return;
    onChange({ ...value, xpReward: { ...value.xpReward, [field]: v } });
  };

  const updateLossXP = (v: number) => {
    if (!value) return;
    onChange({ ...value, lossXpReward: { playerXP: v } });
  };

  const DIFF_COLORS: Record<string, string> = {
    easy:   "text-green-400",
    medium: "text-yellow-400",
    hard:   "text-orange-400",
    hell:   "text-red-500",
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-200"
        >
          <span>⚔️ Battle Config</span>
          {enabled && (
            <span className={`text-xs font-bold ${DIFF_COLORS[value.difficulty] ?? ""}`}>
              ({value.difficulty})
            </span>
          )}
          <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
        </button>

        {/* Enable/disable toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[11px] text-gray-400">Has Battle?</span>
          <div
            role="checkbox"
            aria-checked={enabled}
            tabIndex={0}
            onClick={() => onChange(enabled ? null : { ...DEFAULT_CONFIG })}
            onKeyDown={e => e.key === " " && onChange(enabled ? null : { ...DEFAULT_CONFIG })}
            className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${enabled ? "bg-red-600" : "bg-gray-700"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${enabled ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
        </label>
      </div>

      {open && enabled && (
        <div className="p-4 space-y-3 bg-gray-900">
          {/* Core identifiers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-gray-500 uppercase mb-1 block">Beyblade ID</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="e.g. dragoon_s"
                value={value.beybladeId}
                onChange={e => update({ beybladeId: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 uppercase mb-1 block">Arena ID</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="classic_circle"
                value={value.arenaId}
                onChange={e => update({ arenaId: e.target.value })}
              />
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-[9px] text-gray-500 uppercase mb-1 block">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update({ difficulty: d })}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                    value.difficulty === d
                      ? `${d === "easy" ? "bg-green-700" : d === "medium" ? "bg-yellow-700" : d === "hard" ? "bg-orange-700" : "bg-red-700"} text-white`
                      : "bg-gray-800 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Dialogue IDs */}
          <div className="space-y-2">
            <label className="text-[9px] text-gray-500 uppercase block">Dialogue IDs</label>
            {([
              ["introDialogueId",   "Intro (before battle)"],
              ["victoryDialogueId", "Victory (player wins)"],
              ["defeatDialogueId",  "Defeat (player loses)"],
              ["lockedDialogueId",  "Locked (can't battle yet)"],
              ["rematchDialogueId", "Rematch offer"],
            ] as [keyof NPCBattleConfig, string][]).map(([field, label]) => (
              <div key={field} className="flex items-center gap-2">
                <label className="text-[10px] text-gray-500 w-32 shrink-0">{label}</label>
                <input
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder={`dlg_${field.replace("DialogueId","")}`}
                  value={(value[field] as string | undefined) ?? ""}
                  onChange={e => update({ [field]: e.target.value || undefined })}
                />
              </div>
            ))}
          </div>

          {/* XP rewards */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[9px] text-gray-500 uppercase mb-1 block">Player XP (win)</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                value={value.xpReward?.playerXP ?? 0} min={0}
                onChange={e => updateXP("playerXP", +e.target.value)} />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 uppercase mb-1 block">Bey XP (win)</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                value={value.xpReward?.beybladeXP ?? 0} min={0}
                onChange={e => updateXP("beybladeXP", +e.target.value)} />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 uppercase mb-1 block">Player XP (loss)</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                value={value.lossXpReward?.playerXP ?? 0} min={0}
                onChange={e => updateLossXP(+e.target.value)} />
            </div>
          </div>

          {/* Rematch */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3 h-3"
                checked={value.canRematch}
                onChange={e => update({ canRematch: e.target.checked })} />
              <span className="text-xs text-gray-300">Can Rematch</span>
            </label>
            {value.canRematch && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-500">Cooldown (battles)</label>
                <input type="number" className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  value={value.rematchCooldownBattles ?? 0} min={0}
                  onChange={e => update({ rematchCooldownBattles: +e.target.value })} />
              </div>
            )}
          </div>

          {/* Badge / Quest rewards */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-gray-500 uppercase mb-1 block">Awards Badge ID</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="badge_id (optional)"
                value={value.awardsBadgeId ?? ""}
                onChange={e => update({ awardsBadgeId: e.target.value || undefined })}
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 uppercase mb-1 block">Reward Quest ID</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="quest_id (optional)"
                value={value.rewardQuestId ?? ""}
                onChange={e => update({ rewardQuestId: e.target.value || undefined })}
              />
            </div>
          </div>

          {/* Team points */}
          <div>
            <label className="text-[9px] text-gray-500 uppercase mb-1 block">Team Points Reward (Arc 2+)</label>
            <input type="number"
              className="w-24 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              value={value.teamPointsReward ?? 0} min={0}
              onChange={e => update({ teamPointsReward: +e.target.value || undefined })} />
          </div>
        </div>
      )}

      {open && !enabled && (
        <div className="p-3 bg-gray-900 text-center text-gray-600 text-xs py-4">
          Toggle "Has Battle?" to configure battle settings for this NPC.
        </div>
      )}
    </div>
  );
}

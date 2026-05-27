import { useRPGStore } from "../../stores/rpgStore";
import type { Quest } from "../../data/schemas";

interface QuestLogPanelProps {
  questDefs: Quest[];
  onClose: () => void;
}

export function QuestLogPanel({ questDefs, onClose: _onClose }: QuestLogPanelProps) {
  const questStates    = useRPGStore((s) => s.questStates);
  const activeQuestIds = useRPGStore((s) => s.activeQuestIds);

  const activeQuests = activeQuestIds.map((id) => ({
    id,
    state: questStates[id],
    def: questDefs.find((q) => q.id === id),
  }));

  const completedQuests = Object.entries(questStates)
    .filter(([, qs]) => qs.status === "completed")
    .map(([id, qs]) => ({
      id,
      state: qs,
      def: questDefs.find((q) => q.id === id),
    }));

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-amber-400 font-bold text-lg mb-4">Quest Log</h3>

      {/* Active Quests */}
      <div className="mb-4">
        <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">
          Active ({activeQuests.length})
        </h4>
        {activeQuests.length === 0 ? (
          <p className="text-gray-500 text-sm">No active quests</p>
        ) : (
          <div className="space-y-3">
            {activeQuests.map(({ id, state, def }) => {
              const title   = def?.title ?? id;
              const objectives = (def?.objectives ?? []).filter((o) => !o.optional);
              return (
                <div
                  key={id}
                  className="px-3 py-2 rounded bg-gray-800 border border-amber-500/30"
                >
                  <div className="text-amber-300 text-sm font-semibold mb-1.5">{title}</div>
                  {objectives.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {objectives.map((obj) => {
                        const progress = state?.objectiveProgress?.[obj.id] ?? 0;
                        const qty      = obj.quantity ?? 1;
                        const done     = progress >= qty;
                        return (
                          <div key={obj.id} className="flex items-center gap-1.5">
                            <span className={`text-[10px] shrink-0 ${done ? "text-green-500" : "text-amber-400"}`}>
                              {done ? "✓" : "▸"}
                            </span>
                            <span className={`text-xs flex-1 ${done ? "text-gray-500 line-through" : "text-gray-300"}`}>
                              {obj.description}
                            </span>
                            {qty > 1 && (
                              <span className={`text-[10px] shrink-0 ${done ? "text-gray-600" : "text-amber-300"}`}>
                                [{Math.min(progress, qty)}/{qty}]
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs">In progress…</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Quests */}
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">
          Completed ({completedQuests.length})
        </h4>
        {completedQuests.length === 0 ? (
          <p className="text-gray-500 text-sm">No completed quests</p>
        ) : (
          <div className="space-y-1">
            {completedQuests.map(({ id, def }) => (
              <div
                key={id}
                className="px-3 py-2 rounded bg-gray-800/50 text-sm text-gray-500 flex items-center gap-2"
              >
                <span className="text-green-600">✓</span>
                {def?.title ?? id}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

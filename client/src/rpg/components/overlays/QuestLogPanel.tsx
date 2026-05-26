import { useRPGStore } from "../../stores/rpgStore";

interface QuestLogPanelProps {
  onClose: () => void;
}

export function QuestLogPanel({ onClose }: QuestLogPanelProps) {
  const questStates = useRPGStore((s) => s.questStates);
  const activeQuestIds = useRPGStore((s) => s.activeQuestIds);

  const activeQuests = activeQuestIds.map((id) => ({
    id,
    state: questStates[id],
  }));

  const completedQuests = Object.entries(questStates)
    .filter(([, qs]) => qs.status === "completed")
    .map(([id, qs]) => ({ id, state: qs }));

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
          <div className="space-y-2">
            {activeQuests.map(({ id, state }) => (
              <div
                key={id}
                className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
              >
                <div className="text-white text-sm font-semibold">{id}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {state
                    ? Object.entries(state.objectiveProgress).map(([objId, progress]) => (
                        <div key={objId}>
                          {objId}: {progress}
                        </div>
                      ))
                    : "In progress..."}
                </div>
              </div>
            ))}
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
            {completedQuests.map(({ id }) => (
              <div
                key={id}
                className="px-3 py-2 rounded bg-gray-800/50 text-sm text-gray-500"
              >
                ✓ {id}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

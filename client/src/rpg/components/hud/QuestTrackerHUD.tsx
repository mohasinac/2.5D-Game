import { useRPGStore } from "../../stores/rpgStore";
import type { Quest } from "../../data/schemas";

interface QuestTrackerHUDProps {
  questDefs: Quest[];
}

export function QuestTrackerHUD({ questDefs }: QuestTrackerHUDProps) {
  const activeQuestIds = useRPGStore((s) => s.activeQuestIds);
  const questStates    = useRPGStore((s) => s.questStates);

  if (activeQuestIds.length === 0) return null;

  // Pin the first active quest; show overflow count
  const pinnedId    = activeQuestIds[0];
  const pinnedState = questStates[pinnedId];
  const pinnedDef   = questDefs.find((q) => q.id === pinnedId);
  const extraCount  = activeQuestIds.length - 1;

  if (!pinnedDef) return null;

  const objectives = pinnedDef.objectives.filter((o) => !o.optional);

  return (
    <div className="absolute bottom-14 left-2 sm:bottom-16 sm:left-3 z-30 pointer-events-none select-none max-w-[220px] sm:max-w-[260px]">
      <div className="bg-gray-900/85 border border-amber-500/40 rounded-lg px-3 py-2 shadow-lg">
        {/* Quest title */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] sm:text-xs">📜</span>
          <span className="text-amber-400 text-[10px] sm:text-xs font-bold leading-tight truncate">
            {pinnedDef.title}
          </span>
          {extraCount > 0 && (
            <span className="ml-auto text-gray-500 text-[9px] sm:text-[10px] shrink-0">
              +{extraCount} more
            </span>
          )}
        </div>

        {/* Objectives */}
        <div className="flex flex-col gap-0.5">
          {objectives.map((obj) => {
            const progress  = pinnedState?.objectiveProgress?.[obj.id] ?? 0;
            const quantity  = obj.quantity ?? 1;
            const done      = progress >= quantity;
            return (
              <div key={obj.id} className="flex items-center gap-1.5">
                <span className={`text-[9px] sm:text-[10px] shrink-0 ${done ? "text-gray-500" : "text-amber-400"}`}>
                  {done ? "✓" : "▸"}
                </span>
                <span className={`text-[9px] sm:text-[10px] leading-tight truncate flex-1 ${done ? "text-gray-500 line-through" : "text-gray-200"}`}>
                  {obj.description}
                </span>
                {quantity > 1 && (
                  <span className={`text-[9px] sm:text-[10px] shrink-0 ${done ? "text-gray-600" : "text-amber-300"}`}>
                    [{Math.min(progress, quantity)}/{quantity}]
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

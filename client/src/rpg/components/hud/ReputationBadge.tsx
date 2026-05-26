import { useRPGStore } from "../../stores/rpgStore";

function getReputationTier(rep: number): { label: string; color: string } {
  if (rep >= 100) return { label: "Legend", color: "text-yellow-400" };
  if (rep >= 75) return { label: "Champion", color: "text-purple-400" };
  if (rep >= 50) return { label: "Veteran", color: "text-blue-400" };
  if (rep >= 25) return { label: "Rising Star", color: "text-green-400" };
  if (rep >= 0) return { label: "Rookie", color: "text-gray-400" };
  return { label: "Unknown", color: "text-red-400" };
}

export function ReputationBadge() {
  const reputation = useRPGStore((s) => s.reputation);
  const tier = getReputationTier(reputation);

  return (
    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 pointer-events-none select-none">
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
        <span className={`text-[10px] sm:text-xs font-bold ${tier.color}`}>{tier.label}</span>
        <span className="text-gray-500 text-[10px] sm:text-xs">Rep: {reputation}</span>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";

interface RegionNodeProps {
  id: string;
  displayName: string;
  country: string;
  x: number;
  y: number;
  unlocked: boolean;
  current: boolean;
  lockedReason?: string | null;
  onClick: () => void;
}

export function RegionNode({
  id,
  displayName,
  country,
  x,
  y,
  unlocked,
  current,
  lockedReason,
  onClick,
}: RegionNodeProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <button
        onClick={unlocked ? onClick : undefined}
        disabled={!unlocked}
        className={`flex flex-col items-center gap-1 transition-all ${
          unlocked
            ? current
              ? "cursor-default"
              : "cursor-pointer hover:scale-110"
            : "cursor-not-allowed opacity-40"
        }`}
        title={lockedReason ?? undefined}
      >
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg border-2 ${
            current
              ? "bg-amber-500 border-amber-300 shadow-lg shadow-amber-500/50 animate-pulse"
              : unlocked
              ? "bg-gray-700 border-amber-400 hover:bg-gray-600"
              : "bg-gray-800 border-gray-600"
          }`}
        >
          {unlocked ? "🌍" : "🔒"}
        </div>
        <span
          className={`text-[10px] sm:text-xs font-bold whitespace-nowrap ${
            current ? "text-amber-400" : unlocked ? "text-white" : "text-gray-600"
          }`}
        >
          {unlocked ? displayName : "???"}
        </span>
        {unlocked && (
          <span className="text-[10px] text-gray-500">{country}</span>
        )}
      </button>
    </motion.div>
  );
}

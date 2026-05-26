import { useRPGStore } from "../../stores/rpgStore";

const TIME_SLOT_ICONS: Record<string, string> = {
  morning: "☀️",
  afternoon: "🌤️",
  evening: "🌅",
  night: "🌙",
  tournament: "🏟️",
};

export function RPGHUD() {
  const currentMapId = useRPGStore((s) => s.currentMapId);
  const currentRegionId = useRPGStore((s) => s.currentRegionId);
  const timeSlot = useRPGStore((s) => s.timeSlot);
  const level = useRPGStore((s) => s.level);
  const xp = useRPGStore((s) => s.xp);
  const xpCurve = useRPGStore((s) => s.xpCurve);

  const nextLevelXP = xpCurve[level - 1] ?? xpCurve[xpCurve.length - 1] ?? 100;
  const prevLevelXP = level >= 2 ? (xpCurve[level - 2] ?? 0) : 0;
  const xpProgress = nextLevelXP > prevLevelXP
    ? Math.min(1, (xp - prevLevelXP) / (nextLevelXP - prevLevelXP))
    : 1;

  return (
    <div className="absolute top-3 left-3 z-30 flex flex-col gap-2 pointer-events-none select-none">
      {/* Location chip */}
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
          {currentRegionId ?? "???"}
        </span>
        <span className="text-gray-500 text-xs">·</span>
        <span className="text-white text-xs">{currentMapId ?? "???"}</span>
      </div>

      {/* Time + Level */}
      <div className="flex gap-2">
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-sm">{TIME_SLOT_ICONS[timeSlot] ?? "⏳"}</span>
          <span className="text-gray-300 text-xs capitalize">{timeSlot}</span>
        </div>
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-amber-400 text-xs font-bold">Lv.{level}</span>
          <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${xpProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

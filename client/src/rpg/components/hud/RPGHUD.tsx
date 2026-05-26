import { useRPGStore } from "../../stores/rpgStore";
import { ticksToMs, TICKS_TRANSITION_FLASH } from "../../constants/rpgConstants";

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
    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 flex flex-col gap-1.5 sm:gap-2 pointer-events-none select-none">
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
        <span className="text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          {currentRegionId ?? "???"}
        </span>
        <span className="text-gray-500 text-[10px] sm:text-xs">·</span>
        <span className="text-white text-[10px] sm:text-xs">{currentMapId ?? "???"}</span>
      </div>

      <div className="flex gap-1.5 sm:gap-2">
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1 sm:gap-1.5">
          <span className="text-xs sm:text-sm">{TIME_SLOT_ICONS[timeSlot] ?? "⏳"}</span>
          <span className="text-gray-300 text-[10px] sm:text-xs capitalize">{timeSlot}</span>
        </div>
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
          <span className="text-amber-400 text-[10px] sm:text-xs font-bold">Lv.{level}</span>
          <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${xpProgress * 100}%`, transition: `width ${ticksToMs(TICKS_TRANSITION_FLASH)}ms ease` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

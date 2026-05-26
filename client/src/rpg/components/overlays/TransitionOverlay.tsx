import { motion, AnimatePresence } from "framer-motion";
import { ticksToSeconds, TICKS_TRANSITION_FLASH, TICKS_TRANSITION_FADE } from "../../constants/rpgConstants";

interface TransitionOverlayProps {
  type: "fade" | "flash" | "none";
  active: boolean;
  color?: string;
  durationTicks?: number;
}

export function TransitionOverlay({
  type,
  active,
  color = "#000",
  durationTicks,
}: TransitionOverlayProps) {
  if (type === "none") return null;

  const resolvedTicks = durationTicks ?? (type === "flash" ? TICKS_TRANSITION_FLASH : TICKS_TRANSITION_FADE);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: type === "flash" ? 1 : 0 }}
          animate={{ opacity: type === "flash" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ticksToSeconds(resolvedTicks) }}
          className={`absolute inset-0 z-[60] pointer-events-none ${
            type === "flash" ? "bg-white" : color === "#000" ? "bg-black" : ""
          }`}
          style={type !== "flash" && color !== "#000" ? { backgroundColor: color } : undefined}
        />
      )}
    </AnimatePresence>
  );
}

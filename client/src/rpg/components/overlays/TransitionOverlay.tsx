import { motion, AnimatePresence } from "framer-motion";

interface TransitionOverlayProps {
  type: "fade" | "flash" | "none";
  active: boolean;
  color?: string;
  duration?: number;
}

export function TransitionOverlay({
  type,
  active,
  color = "#000",
  duration = 0.3,
}: TransitionOverlayProps) {
  if (type === "none") return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: type === "flash" ? 1 : 0 }}
          animate={{ opacity: type === "flash" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          className="absolute inset-0 z-[60] pointer-events-none"
          style={{ backgroundColor: type === "flash" ? "#fff" : color }}
        />
      )}
    </AnimatePresence>
  );
}

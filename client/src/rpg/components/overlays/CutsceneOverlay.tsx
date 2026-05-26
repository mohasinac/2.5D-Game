import { motion, AnimatePresence } from "framer-motion";
import { ticksToSeconds, TICKS_CUTSCENE_BAR, TICKS_CUTSCENE_TITLE, TICKS_CUTSCENE_TITLE_DELAY } from "../../constants/rpgConstants";

interface CutsceneOverlayProps {
  active: boolean;
  titleText?: string;
  subtitleText?: string;
}

export function CutsceneOverlay({ active, titleText, subtitleText }: CutsceneOverlayProps) {
  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            exit={{ height: 0 }}
            transition={{ duration: ticksToSeconds(TICKS_CUTSCENE_BAR), ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 bg-black z-40"
          />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            exit={{ height: 0 }}
            transition={{ duration: ticksToSeconds(TICKS_CUTSCENE_BAR), ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 bg-black z-40"
          />

          {titleText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: ticksToSeconds(TICKS_CUTSCENE_TITLE), delay: ticksToSeconds(TICKS_CUTSCENE_TITLE_DELAY) }}
              className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
            >
              <div className="text-white text-xl sm:text-2xl font-bold tracking-wider">
                {titleText}
              </div>
              {subtitleText && (
                <div className="text-amber-400 text-xs sm:text-sm mt-2 tracking-wide">
                  {subtitleText}
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

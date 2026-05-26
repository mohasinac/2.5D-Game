import { motion, AnimatePresence } from "framer-motion";

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
          {/* Letter-box bars */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 bg-black z-40"
          />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 bg-black z-40"
          />

          {/* Title card */}
          {titleText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
            >
              <div className="text-white text-2xl font-bold tracking-wider">
                {titleText}
              </div>
              {subtitleText && (
                <div className="text-amber-400 text-sm mt-2 tracking-wide">
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

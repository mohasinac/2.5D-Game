import { motion, AnimatePresence } from "framer-motion";
import { ticksToSeconds, TICKS_ROUTE_PREVIEW } from "../../constants/rpgConstants";
import type { RouteDef } from "../../data/schemas";

interface RoutePreviewProps {
  route: RouteDef | null;
  onConfirm: () => void;
}

export function RoutePreview({ route, onConfirm }: RoutePreviewProps) {
  return (
    <AnimatePresence mode="wait">
      {route && (
        <motion.div
          key={route.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: ticksToSeconds(TICKS_ROUTE_PREVIEW) }}
          className="flex flex-col items-center"
        >
          <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 sm:p-6 max-w-sm sm:max-w-md text-center">
            <h2 className="text-amber-400 text-lg sm:text-xl font-bold mb-2">{route.displayName}</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{route.description}</p>

            <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500 justify-center mb-4 sm:mb-6">
              <span>Start: {route.startingMapId}</span>
              <span>·</span>
              <span>Beyblade: {route.startingBeybladeId}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="px-6 py-2.5 sm:px-8 sm:py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-base sm:text-lg transition-colors"
            >
              Start Journey
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

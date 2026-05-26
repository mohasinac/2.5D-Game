import { motion, AnimatePresence } from "framer-motion";
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
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 max-w-md text-center">
            <h2 className="text-amber-400 text-xl font-bold mb-2">{route.displayName}</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{route.description}</p>

            <div className="flex gap-3 text-xs text-gray-500 justify-center mb-6">
              <span>Start: {route.startingMapId}</span>
              <span>·</span>
              <span>Beyblade: {route.startingBeybladeId}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-lg transition-colors"
            >
              Start Journey
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

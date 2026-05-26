import { motion } from "framer-motion";
import type { RouteDef } from "../../data/schemas";

interface RouteCardProps {
  route: RouteDef;
  selected: boolean;
  onSelect: () => void;
}

export function RouteCard({ route, selected, onSelect }: RouteCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative flex flex-col rounded-xl overflow-hidden border-2 transition-all w-full max-w-[280px] ${
        selected
          ? "border-amber-400 shadow-lg shadow-amber-500/30"
          : "border-gray-700 hover:border-gray-500"
      }`}
    >
      {/* Card image / gradient placeholder */}
      <div className="h-48 bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
        <span className="text-5xl">⚡</span>
      </div>

      {/* Card info */}
      <div className="p-4 bg-gray-900 text-left">
        <h3
          className={`text-lg font-bold ${
            selected ? "text-amber-400" : "text-white"
          }`}
        >
          {route.displayName}
        </h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{route.description}</p>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded">
          SELECTED
        </div>
      )}
    </motion.button>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InventoryPanel } from "./InventoryPanel";
import { QuestLogPanel } from "./QuestLogPanel";
import { BadgeCasePanel } from "./BadgeCasePanel";

type MenuTab = "inventory" | "quests" | "badges" | "save";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  badgeDefs?: Array<{
    id: string;
    displayName: string;
    description: string;
    iconAssetId: string;
    category: string;
  }>;
}

const TABS: { id: MenuTab; label: string }[] = [
  { id: "inventory", label: "Bag" },
  { id: "quests", label: "Quests" },
  { id: "badges", label: "Badges" },
  { id: "save", label: "Save" },
];

export function MenuOverlay({ open, onClose, onSave, badgeDefs = [] }: MenuOverlayProps) {
  const [tab, setTab] = useState<MenuTab>("inventory");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "x" || e.key === "X") {
        onClose();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative bg-gray-900 border-2 border-amber-400 rounded-xl w-[90%] max-w-[600px] h-[70%] max-h-[500px] flex flex-col overflow-hidden"
          >
            {/* Tab bar */}
            <div className="flex border-b border-gray-700">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    tab === t.id
                      ? "text-amber-400 border-b-2 border-amber-400 bg-gray-800/50"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto p-4">
              {tab === "inventory" && <InventoryPanel onClose={onClose} />}
              {tab === "quests" && <QuestLogPanel onClose={onClose} />}
              {tab === "badges" && (
                <BadgeCasePanel badgeDefs={badgeDefs} onClose={onClose} />
              )}
              {tab === "save" && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-gray-400 text-sm">Save your progress</p>
                  <button
                    onClick={onSave}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
                  >
                    Save Game
                  </button>
                </div>
              )}
            </div>

            {/* Close hint */}
            <div className="text-center text-gray-600 text-xs py-2 border-t border-gray-800">
              Press X or Esc to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

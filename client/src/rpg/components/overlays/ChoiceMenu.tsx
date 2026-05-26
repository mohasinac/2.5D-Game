import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface Choice {
  id: string;
  label: string;
  disabled?: boolean;
}

interface ChoiceMenuProps {
  choices: Choice[];
  onSelect: (choiceId: string) => void;
}

export function ChoiceMenu({ choices, onSelect }: ChoiceMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const enabledChoices = choices.filter((c) => !c.disabled);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        setSelectedIndex((prev) => (prev - 1 + enabledChoices.length) % enabledChoices.length);
        e.preventDefault();
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        setSelectedIndex((prev) => (prev + 1) % enabledChoices.length);
        e.preventDefault();
      } else if (e.key === "z" || e.key === "Z" || e.key === "Enter" || e.key === " ") {
        if (enabledChoices[selectedIndex]) {
          onSelect(enabledChoices[selectedIndex].id);
        }
        e.preventDefault();
      }
    },
    [enabledChoices, selectedIndex, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute bottom-28 right-4 sm:bottom-36 sm:right-8 z-50 bg-gray-900/95 border-2 border-amber-400 rounded-lg p-2 min-w-[180px] sm:min-w-[200px]"
    >
      {choices.map((choice, i) => {
        const enabledIdx = enabledChoices.indexOf(choice);
        const isSelected = enabledIdx === selectedIndex;
        return (
          <button
            key={choice.id}
            disabled={choice.disabled}
            onClick={() => !choice.disabled && onSelect(choice.id)}
            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
              choice.disabled
                ? "text-gray-600 cursor-not-allowed"
                : isSelected
                ? "bg-amber-500/30 text-amber-300 border border-amber-400"
                : "text-white hover:bg-gray-800 border border-transparent"
            }`}
          >
            {isSelected && !choice.disabled ? "▶ " : "  "}
            {choice.label}
          </button>
        );
      })}
    </motion.div>
  );
}

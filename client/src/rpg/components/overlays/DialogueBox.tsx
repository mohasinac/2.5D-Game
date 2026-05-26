import { useEffect, useState, useCallback } from "react";
import { useRPGStore } from "../../stores/rpgStore";
import { motion, AnimatePresence } from "framer-motion";

interface DialogueBoxProps {
  speakerName: string;
  text: string;
  portraitUrl?: string | null;
  portraitState?: string;
  onAdvance: () => void;
  onChoiceSelect?: (choiceId: string) => void;
  choices?: Array<{ id: string; label: string; disabled?: boolean }>;
  shake?: boolean;
}

export function DialogueBox({
  speakerName,
  text,
  portraitUrl,
  onAdvance,
  onChoiceSelect,
  choices,
  shake,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const CHAR_DELAY = 30;

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i >= text.length) {
        setDisplayedText(text);
        setIsComplete(true);
        clearInterval(timer);
      } else {
        setDisplayedText(text.slice(0, i));
      }
    }, CHAR_DELAY);
    return () => clearInterval(timer);
  }, [text]);

  const handleClick = useCallback(() => {
    if (!isComplete) {
      setDisplayedText(text);
      setIsComplete(true);
    } else if (!choices?.length) {
      onAdvance();
    }
  }, [isComplete, text, choices, onAdvance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "z" || e.key === "Z" || e.key === "Enter" || e.key === " ") {
        handleClick();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClick]);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1, x: shake ? [0, -4, 4, -2, 0] : 0 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-4 left-4 right-4 z-50"
    >
      <div
        className="bg-gray-900/95 border-2 border-amber-400 rounded-lg p-4 cursor-pointer select-none"
        onClick={handleClick}
      >
        <div className="flex gap-4">
          {portraitUrl && (
            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-amber-500/50">
              <img
                src={portraitUrl}
                alt={speakerName}
                className="w-full h-full object-cover pixelated"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-amber-400 text-xs font-bold mb-1 uppercase tracking-wider">
              {speakerName}
            </div>
            <div className="text-white text-sm font-mono leading-relaxed min-h-[3rem]">
              {displayedText}
              {!isComplete && (
                <span className="animate-pulse text-amber-400">▍</span>
              )}
            </div>
          </div>
        </div>

        {isComplete && choices && choices.length > 0 && (
          <div className="mt-3 flex flex-col gap-1">
            {choices.map((choice) => (
              <button
                key={choice.id}
                disabled={choice.disabled}
                className="text-left px-3 py-1.5 text-sm rounded bg-gray-800 hover:bg-amber-500/20 text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-colors border border-gray-700 hover:border-amber-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onChoiceSelect?.(choice.id);
                }}
              >
                ▸ {choice.label}
              </button>
            ))}
          </div>
        )}

        {isComplete && !choices?.length && (
          <div className="text-right mt-1">
            <span className="text-amber-400 text-xs animate-bounce inline-block">▼</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRPGStore } from "../../stores/rpgStore";

const DISPLAY_MS = 3200;

export function BadgeAchievementOverlay() {
  const notifications  = useRPGStore((s) => s.notifications);
  const [current, setCurrent] = useState<{ title: string; subtitle?: string } | null>(null);
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Pick the first unseen badge-earned notification
    const badge = notifications.find(
      (n) => n.type === "badge-earned" && !seenIds.current.has(n.id)
    );
    if (!badge || current) return;

    seenIds.current.add(badge.id);
    setCurrent({ title: badge.title, subtitle: badge.subtitle });

    const t = setTimeout(() => setCurrent(null), DISPLAY_MS);
    return () => clearTimeout(t);
  }, [notifications, current]);

  return (
    <AnimatePresence>
      {current && (
        <>
          {/* Screen pulse */}
          <motion.div
            key="pulse"
            className="absolute inset-0 z-[55] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.18, 0] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ backgroundColor: "#f59e0b" }}
          />

          {/* Badge card */}
          <motion.div
            key="card"
            className="absolute inset-0 z-[56] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: [0.8, 1.06, 1] }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-gray-900/95 border-2 border-amber-400 shadow-[0_0_32px_4px_rgba(245,158,11,0.45)]">
              {/* Animated glow ring + badge icon */}
              <motion.div
                className="relative flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              >
                <div
                  className="absolute w-20 h-20 rounded-full opacity-30"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #f59e0b, #fcd34d, #f59e0b, #b45309, #f59e0b)",
                  }}
                />
              </motion.div>
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-amber-500/20 border-2 border-amber-400 text-4xl">
                🏅
              </div>

              {/* Text */}
              <motion.div
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <span className="text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  Badge Earned!
                </span>
                <span className="text-white text-base sm:text-lg font-bold text-center">
                  {current.title}
                </span>
                {current.subtitle && (
                  <span className="text-gray-400 text-xs text-center max-w-[200px]">
                    {current.subtitle}
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

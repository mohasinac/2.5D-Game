import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRPGStore, type RPGNotification } from "../../stores/rpgStore";

const AUTO_DISMISS_MS = 4000;

const NOTIFICATION_STYLES: Record<
  RPGNotification["type"],
  { icon: string; border: string }
> = {
  "quest-start": { icon: "📜", border: "border-blue-400" },
  "quest-complete": { icon: "✅", border: "border-green-400" },
  "quest-update": { icon: "📌", border: "border-gray-400" },
  "badge-earned": { icon: "🏅", border: "border-amber-400" },
  "level-up": { icon: "⬆️", border: "border-purple-400" },
  "bey-level-up": { icon: "🌀", border: "border-cyan-400" },
  "item-received": { icon: "🎁", border: "border-emerald-400" },
};

export function NotificationFeed() {
  const notifications = useRPGStore((s) => s.notifications);
  const dismiss = useRPGStore((s) => s.dismissNotification);

  // Auto-dismiss after timeout
  useEffect(() => {
    if (notifications.length === 0) return;
    const timers = notifications.map((n) =>
      setTimeout(() => dismiss(n.id), AUTO_DISMISS_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, dismiss]);

  return (
    <div className="absolute top-16 right-3 z-40 flex flex-col gap-2 pointer-events-none max-w-[280px]">
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 4).map((n) => {
          const style = NOTIFICATION_STYLES[n.type] ?? { icon: "📢", border: "border-gray-500" };
          return (
            <motion.div
              key={n.id}
              layout
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className={`bg-gray-900/95 border ${style.border} rounded-lg px-3 py-2`}
            >
              <div className="flex items-start gap-2">
                <span className="text-base">{style.icon}</span>
                <div className="min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{n.title}</div>
                  {n.subtitle && (
                    <div className="text-gray-400 text-xs truncate">{n.subtitle}</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

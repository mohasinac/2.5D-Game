import { motion, AnimatePresence } from "framer-motion";

type QuestNotificationType = "quest-start" | "quest-complete" | "quest-update";

interface QuestNotificationProps {
  type: QuestNotificationType;
  title: string;
  subtitle?: string;
  visible: boolean;
}

const ICONS: Record<QuestNotificationType, string> = {
  "quest-start": "📜",
  "quest-complete": "✅",
  "quest-update": "📌",
};

const LABELS: Record<QuestNotificationType, string> = {
  "quest-start": "Quest Started",
  "quest-complete": "Quest Complete",
  "quest-update": "Quest Updated",
};

export function QuestNotification({ type, title, subtitle, visible }: QuestNotificationProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute top-20 right-4 z-50 bg-gray-900/95 border border-amber-400 rounded-lg p-3 min-w-[240px] max-w-[320px]"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{ICONS[type]}</span>
            <div>
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                {LABELS[type]}
              </div>
              <div className="text-white text-sm font-semibold mt-0.5">{title}</div>
              {subtitle && (
                <div className="text-gray-400 text-xs mt-0.5">{subtitle}</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

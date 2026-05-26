import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TabItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  badge?: number;
}

interface TabBarProps {
  tabs: TabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  variant?: "line" | "pill" | "segment";
}

export function TabBar({ tabs, activeKey, onSelect, variant = "line" }: TabBarProps) {
  return (
    <div
      className={cn(
        "flex items-center flex-wrap gap-0.5",
        variant === "line" && "border-b border-border-c",
        variant === "segment" && "bg-bg2 rounded-lg p-1 gap-0",
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className={cn(
              "flex items-center gap-1.5 h-9 px-3 text-xs whitespace-nowrap transition-colors outline-none cursor-pointer",
              variant === "line" && [
                "border-b-2 -mb-px",
                isActive
                  ? "text-theme-text border-theme-blue font-semibold"
                  : "text-theme-muted border-transparent hover:text-theme-text font-normal",
              ],
              variant === "pill" && [
                "rounded-full border",
                isActive
                  ? "bg-blue-13 text-theme-blue border-blue-30 font-semibold"
                  : "bg-transparent text-theme-muted border-transparent hover:text-theme-text font-normal",
              ],
              variant === "segment" && [
                "rounded-md border",
                isActive
                  ? "bg-bg1 text-theme-text border-border-c font-semibold"
                  : "bg-transparent text-theme-muted border-transparent hover:text-theme-text font-normal",
              ],
            )}
          >
            {Icon && <Icon size={13} />}
            <span>{tab.label}</span>
            {tab.badge != null && tab.badge > 0 && (
              <span className="text-[9px] font-bold bg-theme-blue text-white px-1 py-px rounded-full min-w-[16px] text-center leading-none">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

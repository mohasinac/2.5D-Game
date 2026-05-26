import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number | string | null;
  storageKey?: string;
  action?: React.ReactNode;
}

export function CollapsibleSection({
  title, children, defaultOpen = true, badge, storageKey, action,
}: Props) {
  const [open, setOpen] = useState(() => {
    if (storageKey) {
      const v = localStorage.getItem(`collapse.${storageKey}`);
      if (v !== null) return v === "1";
    }
    return defaultOpen;
  });

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (storageKey) localStorage.setItem(`collapse.${storageKey}`, next ? "1" : "0");
  };

  return (
    <div className="border border-border-c rounded-xl overflow-hidden mb-0.5">
      <div className="flex items-center bg-bg3">
        <button
          onClick={toggle}
          className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-transparent border-none cursor-pointer text-left text-theme-text"
        >
          {open
            ? <ChevronDown size={13} className="text-theme-muted shrink-0" />
            : <ChevronRight size={13} className="text-theme-muted shrink-0" />}
          <span className="flex-1 text-[13px] font-semibold text-theme-text">{title}</span>
          {!open && badge !== undefined && badge !== null && badge !== 0 && (
            <span className="bg-purple-27 text-theme-purple rounded-lg text-[10px] font-bold px-1.5 py-px">
              {badge}
            </span>
          )}
        </button>
        {action && (
          <div className="pr-2.5 shrink-0">{action}</div>
        )}
      </div>

      {open && (
        <div className={cn("p-3.5 bg-bg2")}>
          {children}
        </div>
      )}
    </div>
  );
}

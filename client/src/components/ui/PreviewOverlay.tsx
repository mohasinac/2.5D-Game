import { type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  width?: string;
}

export function PreviewOverlay({ open, onClose, title, children, className, width = "w-80" }: Props) {
  if (!open) return null;
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-start justify-end pointer-events-none",
    )}>
      <div className={cn(
        "pointer-events-auto m-4 mt-16 bg-bg1 border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden",
        width,
        className,
      )}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-base font-semibold text-text">{title ?? "Preview"}</span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-faint hover:text-text hover:bg-bg3 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

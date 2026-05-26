import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const SIZE_CLASSES = {
  sm:   "max-w-sm",
  md:   "max-w-2xl",
  lg:   "max-w-4xl",
  xl:   "max-w-6xl",
  full: "w-full h-full rounded-none",
} as const;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: keyof typeof SIZE_CLASSES;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, size = "md", children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-bg0/80 backdrop-blur-sm" />

      {/* panel */}
      <div
        className={cn(
          "relative bg-bg1 border border-border-c rounded-2xl flex flex-col overflow-hidden w-full",
          SIZE_CLASSES[size],
          size !== "full" && "max-h-[90vh]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-c shrink-0">
            <span className="font-semibold text-theme-text text-sm">{title}</span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-theme-muted hover:text-theme-text hover:bg-bg2 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-theme-muted hover:text-theme-text hover:bg-bg2 transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

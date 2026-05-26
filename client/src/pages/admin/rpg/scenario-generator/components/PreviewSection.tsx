import { useState, type ReactNode } from "react";

interface Props {
  title: string;
  count: number;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function PreviewSection({ title, count, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/50 transition-colors border-none bg-transparent cursor-pointer"
      >
        <span className="text-white text-sm font-semibold">{title}</span>
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {count}
          </span>
          <span className="text-gray-500 text-xs">{open ? "▾" : "▸"}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-800 px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
}

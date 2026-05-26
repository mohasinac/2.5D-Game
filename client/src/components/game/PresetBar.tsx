// Phase 23 — PresetBar: horizontal scrollable strip of preset tiles.

import type { PresetDoc } from "@/types/presetLibrary";

interface PresetBarProps<T = unknown> {
  presets: PresetDoc<T>[];
  onSelect: (preset: PresetDoc<T>) => void;
  selectedId?: string;
  label?: string;
}

export function PresetBar<T = unknown>({ presets, onSelect, selectedId, label }: PresetBarProps<T>) {
  if (presets.length === 0) return null;

  return (
    <div className="font-mono">
      {label && (
        <div className="text-[0.7rem] text-[#aabbcc] mb-[0.4rem] font-semibold">
          {label}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {presets.map(p => {
          const active = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className={`shrink-0 w-20 px-1 py-1.5 rounded-lg cursor-pointer flex flex-col items-center gap-1 border ${active ? "border-[#4488ff] bg-[rgba(68,136,255,0.15)]" : "border-[rgba(255,255,255,0.12)] bg-[rgba(10,14,28,0.7)]"}`}
            >
              {p.thumbnail ? (
                <img src={p.thumbnail} alt={p.name}
                  className="w-12 h-12 object-cover rounded-md" />
              ) : (
                <div className="w-12 h-12 rounded-md bg-white/[0.06] flex items-center justify-center text-[1.4rem]">📦</div>
              )}
              <span
                className={`text-[0.55rem] text-center leading-[1.2] max-w-[72px] overflow-hidden text-ellipsis whitespace-nowrap block ${active ? "font-bold text-[#88aaff]" : "font-normal text-[#aabbcc]"}`}
              >
                {p.name}
              </span>
              {p.tags.length > 0 && (
                <div className="text-[0.45rem] text-[#668888] text-center max-w-[72px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {p.tags[0]}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

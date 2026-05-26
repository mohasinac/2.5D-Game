import React from "react";

interface Props {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
}

export function SubComponentToggle({ label, description, enabled, onToggle, children }: Props) {
  return (
    <div className={`rounded-[10px] overflow-hidden transition-[border-color] duration-150 border ${enabled ? "border-[rgba(59,130,246,0.27)]" : "border-border-c"}`}>
      {/* Header row */}
      <label
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none ${enabled ? "bg-[rgba(59,130,246,0.06)]" : "bg-bg2"}`}
      >
        <div
          onClick={() => onToggle(!enabled)}
          className={`w-9 h-5 rounded-[10px] shrink-0 relative transition-[background] duration-150 border ${enabled ? "bg-theme-blue border-theme-blue" : "bg-bg3 border-border-c"}`}
        >
          <div
            className={`absolute top-[2px] w-[14px] h-[14px] rounded-full transition-[left,background] duration-150 ${enabled ? "left-[18px] bg-white" : "left-[2px] bg-theme-muted"}`}
          />
        </div>
        <div className="flex-1">
          <div className={`text-[13px] font-semibold ${enabled ? "text-theme-text" : "text-theme-muted"}`}>{label}</div>
          {description && (
            <div className="text-[11px] text-theme-faint mt-[1px]">{description}</div>
          )}
        </div>
      </label>

      {/* Expandable body */}
      {enabled && (
        <div className="px-4 py-[14px] border-t border-border-c bg-bg1">
          {children}
        </div>
      )}
    </div>
  );
}

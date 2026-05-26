// Reusable searchable select components for admin UI.
// Rule: ALL admin dropdowns must use these — no bare <select> elements.
// Tab strips should also include a SearchableTabSelect companion.

import { useState, useRef, useEffect, useCallback } from "react";

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
  color?: string; // optional accent color for the selected highlight
}

// ─── Shared hook ─────────────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) setQuery("");
    else setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return { open, setOpen, query, setQuery, containerRef, inputRef };
}

function filter(opts: SelectOption[], query: string): SelectOption[] {
  const q = query.toLowerCase().trim();
  if (!q) return opts;
  return opts.filter(o =>
    o.label.toLowerCase().includes(q) ||
    (o.hint ?? "").toLowerCase().includes(q) ||
    o.value.toLowerCase().includes(q)
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SearchInput({ inputRef, value, onChange, onKeyDown }: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="px-2 py-1.5 border-b border-border-c">
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type to filter…"
        className="w-full bg-bg1 border border-border-c rounded px-2 py-[5px] text-xs text-theme-text outline-none box-border"
      />
    </div>
  );
}

function OptionRow({ opt, selected, onClick }: { opt: SelectOption; selected: boolean; onClick: () => void }) {
  const accent = opt.color ?? "var(--blue)";
  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={() => { if (!opt.disabled) onClick(); }}
      className={`px-3 py-[7px] text-[13px] transition-[background] duration-[80ms] ${opt.disabled ? "cursor-default opacity-50 text-theme-faint" : "cursor-pointer text-theme-text"} ${selected ? "border-l-[3px]" : "border-l-[3px] border-l-transparent"}`}
      style={{
        "--opt-accent": accent,
        background: selected ? `${accent}20` : "transparent",
        borderLeftColor: selected ? accent : "transparent",
      } as React.CSSProperties}
      onMouseEnter={e => { if (!opt.disabled) (e.currentTarget as HTMLDivElement).style.background = selected ? `${accent}20` : "color-mix(in srgb, var(--blue) 5%, transparent)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = selected ? `${accent}20` : "transparent"; }}
    >
      <div>{opt.label}</div>
      {opt.hint && <div className="text-[11px] text-theme-faint mt-[1px]">{opt.hint}</div>}
    </div>
  );
}

function DropdownPanel({ containerRef, children }: { containerRef: React.RefObject<HTMLDivElement | null>; children: React.ReactNode }) {
  return (
    <div
      role="listbox"
      className="absolute top-[calc(100%+4px)] left-0 right-0 z-[300] bg-bg2 border border-border-c rounded-lg flex flex-col overflow-hidden max-h-[280px] shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
    >
      {children}
    </div>
  );
}

// ─── SearchableSelect (single) ────────────────────────────────────────────────

interface SearchableSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  /** If true, allows clearing back to empty string */
  clearable?: boolean;
  emptyLabel?: string;
  "data-testid"?: string;
}

export function SearchableSelect({
  value, options, onChange, placeholder = "Select…",
  disabled, style, className, clearable, emptyLabel,
  "data-testid": dataTestId,
}: SearchableSelectProps) {
  const { open, setOpen, query, setQuery, containerRef, inputRef } = useDropdown();

  const allOptions: SelectOption[] = clearable || emptyLabel
    ? [{ value: "", label: emptyLabel ?? "(none)", hint: undefined }, ...options]
    : options;

  const selected = allOptions.find(o => o.value === value);
  const filtered = filter(allOptions, query);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); }
    if (e.key === "Enter" && filtered.length === 1 && !filtered[0].disabled) {
      onChange(filtered[0].value);
      setOpen(false);
    }
  }, [filtered, onChange, setOpen]);

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`} data-testid={dataTestId} style={style}>
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => { if (!disabled) setOpen(o => !o); }}
        className={`flex items-center justify-between px-[10px] py-[7px] bg-bg2 rounded-[7px] select-none text-theme-text text-[13px] border transition-[border-color] duration-[120ms] ${open ? "border-theme-blue" : "border-border-c"} ${disabled ? "cursor-default opacity-50" : "cursor-pointer opacity-100"}`}
      >
        <span className={`overflow-hidden text-ellipsis whitespace-nowrap flex-1 ${selected?.value !== undefined && selected.value !== "" ? "text-theme-text" : "text-theme-faint"}`}>
          {selected && (selected.value !== "" || emptyLabel) ? selected.label : placeholder}
        </span>
        <span className="text-[9px] text-theme-faint ml-2 shrink-0">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <DropdownPanel containerRef={containerRef}>
          <SearchInput inputRef={inputRef} value={query} onChange={setQuery} onKeyDown={handleKeyDown} />
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0
              ? <div className="px-3 py-2.5 text-xs text-theme-faint">No results for "{query}"</div>
              : filtered.map(opt => (
                  <OptionRow key={opt.value} opt={opt} selected={opt.value === value}
                    onClick={() => { onChange(opt.value); setOpen(false); }} />
                ))
            }
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

// ─── SearchableMultiSelect ────────────────────────────────────────────────────

interface SearchableMultiSelectProps {
  values: string[];
  options: SelectOption[];
  onChange: (values: string[]) => void;
  max?: number;
  placeholder?: string;
  style?: React.CSSProperties;
}

export function SearchableMultiSelect({
  values, options, onChange, max, placeholder = "Add…", style,
}: SearchableMultiSelectProps) {
  const { open, setOpen, query, setQuery, containerRef, inputRef } = useDropdown();

  const available = options.filter(o => !values.includes(o.value));
  const filtered = filter(available, query);
  const atMax = max !== undefined && values.length >= max;

  return (
    <div ref={containerRef} className="relative" style={style}>
      {/* Selected badges */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {values.map(v => {
            const opt = options.find(o => o.value === v);
            const color = opt?.color ?? "var(--blue)";
            return (
              <span key={v}
                className="inline-flex items-center gap-1 py-[3px] pl-2.5 pr-2 rounded-[20px] text-xs text-theme-text"
                style={{ "--badge-color": color, background: `${color}18`, border: `1px solid ${color}44` } as React.CSSProperties}>
                {opt?.label ?? v}
                <button type="button" onClick={() => onChange(values.filter(x => x !== v))}
                  className="bg-transparent border-none text-theme-faint cursor-pointer text-sm leading-none p-0 ml-0.5">
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Trigger */}
      {!atMax && (
        <div
          onClick={() => setOpen(o => !o)}
          className={`flex items-center justify-between px-2.5 py-1.5 bg-bg2 rounded-[7px] cursor-pointer text-[13px] text-theme-faint select-none border transition-[border-color] duration-[120ms] ${open ? "border-theme-blue" : "border-border-c"}`}
        >
          <span>{placeholder}{max ? ` (${values.length}/${max})` : ""}</span>
          <span className="text-[9px] ml-2">{open ? "▲" : "▼"}</span>
        </div>
      )}

      {open && !atMax && (
        <DropdownPanel containerRef={containerRef}>
          <SearchInput inputRef={inputRef} value={query} onChange={setQuery}
            onKeyDown={e => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Enter" && filtered.length === 1) {
                onChange([...values, filtered[0].value]);
                setQuery("");
                if (max && values.length + 1 >= max) setOpen(false);
              }
            }}
          />
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0
              ? <div className="px-3 py-2.5 text-xs text-theme-faint">
                  {available.length === 0 ? "All options selected" : `No results for "${query}"`}
                </div>
              : filtered.map(opt => (
                  <OptionRow key={opt.value} opt={opt} selected={false}
                    onClick={() => {
                      onChange([...values, opt.value]);
                      setQuery("");
                      if (max && values.length + 1 >= max) setOpen(false);
                    }}
                  />
                ))
            }
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

// ─── SearchableTabSelect ──────────────────────────────────────────────────────
// Drop this next to any tab strip to allow keyboard-driven tab jumping.

interface SearchableTabSelectProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onSelect: (key: string) => void;
  style?: React.CSSProperties;
}

export function SearchableTabSelect({ tabs, activeTab, onSelect, style }: SearchableTabSelectProps) {
  const opts: SelectOption[] = tabs.map(t => ({ value: t.key, label: t.label }));
  return (
    <SearchableSelect
      value={activeTab}
      options={opts}
      onChange={onSelect}
      placeholder="Jump to tab…"
      style={{ minWidth: 160, ...style }}
    />
  );
}

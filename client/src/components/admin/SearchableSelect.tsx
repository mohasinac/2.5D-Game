// Reusable searchable select components for admin UI.
// Rule: ALL admin dropdowns must use these — no bare <select> elements.
// Tab strips should also include a SearchableTabSelect companion.

import { useState, useRef, useEffect, useCallback } from "react";
import { C } from "@/styles/theme";

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
    <div style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}` }}>
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type to filter…"
        style={{
          width: "100%", background: C.bg1, border: `1px solid ${C.border}`,
          borderRadius: 6, padding: "5px 8px", fontSize: 12, color: C.text,
          outline: "none", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function OptionRow({ opt, selected, onClick }: { opt: SelectOption; selected: boolean; onClick: () => void }) {
  const accent = opt.color ?? C.blue;
  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={() => { if (!opt.disabled) onClick(); }}
      style={{
        padding: "7px 12px", cursor: opt.disabled ? "default" : "pointer",
        background: selected ? `${accent}20` : "transparent",
        color: opt.disabled ? C.faint : C.text,
        borderLeft: selected ? `3px solid ${accent}` : "3px solid transparent",
        transition: "background 80ms",
        opacity: opt.disabled ? 0.5 : 1,
      }}
      onMouseEnter={e => { if (!opt.disabled) (e.currentTarget as HTMLDivElement).style.background = selected ? `${accent}20` : `${C.blue}0d`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = selected ? `${accent}20` : "transparent"; }}
    >
      <div style={{ fontSize: 13 }}>{opt.label}</div>
      {opt.hint && <div style={{ fontSize: 11, color: C.faint, marginTop: 1 }}>{opt.hint}</div>}
    </div>
  );
}

function DropdownPanel({ containerRef, children }: { containerRef: React.RefObject<HTMLDivElement | null>; children: React.ReactNode }) {
  return (
    <div
      role="listbox"
      style={{
        position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 300,
        background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)", maxHeight: 280,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
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
    <div ref={containerRef} className={className} data-testid={dataTestId} style={{ position: "relative", ...style }}>
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => { if (!disabled) setOpen(o => !o); }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "7px 10px", background: C.bg2, border: `1px solid ${open ? C.blue : C.border}`,
          borderRadius: 7, cursor: disabled ? "default" : "pointer",
          color: C.text, opacity: disabled ? 0.5 : 1, fontSize: 13,
          userSelect: "none", transition: "border-color 120ms",
        }}
      >
        <span style={{ color: selected?.value !== undefined && selected.value !== "" ? C.text : C.faint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {selected && (selected.value !== "" || emptyLabel) ? selected.label : placeholder}
        </span>
        <span style={{ fontSize: 9, color: C.faint, marginLeft: 8, flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <DropdownPanel containerRef={containerRef}>
          <SearchInput inputRef={inputRef} value={query} onChange={setQuery} onKeyDown={handleKeyDown} />
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0
              ? <div style={{ padding: "10px 12px", fontSize: 12, color: C.faint }}>No results for "{query}"</div>
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
    <div ref={containerRef} style={{ position: "relative", ...style }}>
      {/* Selected badges */}
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
          {values.map(v => {
            const opt = options.find(o => o.value === v);
            const color = opt?.color ?? C.blue;
            return (
              <span key={v} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 8px 3px 10px", borderRadius: 20, fontSize: 12,
                background: `${color}18`, border: `1px solid ${color}44`, color: C.text,
              }}>
                {opt?.label ?? v}
                <button type="button" onClick={() => onChange(values.filter(x => x !== v))}
                  style={{ background: "none", border: "none", color: C.faint, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}>
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
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 10px", background: C.bg2, border: `1px solid ${open ? C.blue : C.border}`,
            borderRadius: 7, cursor: "pointer", fontSize: 13, color: C.faint,
            userSelect: "none", transition: "border-color 120ms",
          }}
        >
          <span>{placeholder}{max ? ` (${values.length}/${max})` : ""}</span>
          <span style={{ fontSize: 9, marginLeft: 8 }}>{open ? "▲" : "▼"}</span>
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
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0
              ? <div style={{ padding: "10px 12px", fontSize: 12, color: C.faint }}>
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

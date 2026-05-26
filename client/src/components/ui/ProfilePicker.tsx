import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/cn";

export interface AdminEnumProfile {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  [key: string]: unknown;
}

interface ProfilePickerProps<T extends AdminEnumProfile> {
  collection: string;
  value: string | undefined;
  onChange: (id: string, profile: T) => void;
  placeholder?: string;
  disabled?: boolean;
  filter?: (profile: T) => boolean;
  renderLabel?: (profile: T) => string;
}

const cache = new Map<string, AdminEnumProfile[]>();

export function ProfilePicker<T extends AdminEnumProfile = AdminEnumProfile>({
  collection: collectionName,
  value,
  onChange,
  placeholder = "Select…",
  disabled = false,
  filter,
  renderLabel,
}: ProfilePickerProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cache.has(collectionName)) {
      setOptions((cache.get(collectionName) as T[]) ?? []);
      return;
    }
    setLoading(true);
    getDocs(query(collection(db, collectionName), orderBy("name")))
      .then(snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
        cache.set(collectionName, docs as AdminEnumProfile[]);
        setOptions(docs);
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [collectionName]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = options
    .filter(o => !filter || filter(o))
    .filter(o => !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));

  const selected = options.find(o => o.id === value);

  return (
    <div ref={containerRef} data-picker={collectionName} className="relative inline-block w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        className={cn(
          "w-full bg-bg3 border rounded-lg px-2.5 py-1.5 text-sm flex items-center gap-1.5 text-left transition-colors",
          open ? "border-theme-blue" : "border-border-c",
          selected ? "text-theme-text" : "text-theme-faint",
          disabled ? "opacity-50 cursor-default" : "cursor-pointer hover:border-theme-blue",
        )}
      >
        {selected?.icon && <span>{selected.icon}</span>}
        <span className="flex-1 truncate">
          {selected
            ? (renderLabel ? renderLabel(selected as T) : selected.name)
            : (loading ? "Loading…" : placeholder)}
        </span>
        <span className="text-theme-faint text-[10px] shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-bg2 border border-border-c rounded-xl shadow-xl z-[500] overflow-hidden">
          <div className="px-2.5 py-2 border-b border-border-c">
            <input
              autoFocus
              className="w-full bg-bg3 border border-border-c rounded-md px-2 py-1 text-xs text-theme-text placeholder:text-theme-faint focus:outline-none focus:border-theme-blue"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-[220px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-2.5 py-3 text-xs text-theme-faint">
                {loading ? "Loading…" : "No matches"}
              </div>
            )}
            {filtered.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onChange(opt.id, opt as T); setOpen(false); setSearch(""); }}
                className={cn(
                  "flex w-full items-center gap-2 px-2.5 py-2 text-sm text-theme-text text-left transition-colors hover:bg-bg3",
                  opt.id === value ? "bg-blue-10" : "bg-transparent",
                )}
              >
                {opt.icon && <span className="text-base shrink-0">{opt.icon}</span>}
                {opt.color && (
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[color:var(--oc)]" style={{ "--oc": opt.color } as React.CSSProperties} />
                )}
                <div className="flex-1 min-w-0">
                  <div className={cn("truncate", opt.id === value ? "font-semibold" : "font-normal")}>
                    {renderLabel ? renderLabel(opt as T) : opt.name}
                  </div>
                  {opt.description && (
                    <div className="text-[11px] text-theme-faint mt-px truncate">{opt.description as string}</div>
                  )}
                </div>
                {opt.id === value && <span className="text-theme-blue text-sm shrink-0">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

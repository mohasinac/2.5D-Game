// Searchable Firestore enum dropdown — replaces all hardcoded <select><option> lists
// for admin-managed profile collections (attack_types, element_types, etc.)

import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { C } from "@/styles/theme";

export interface AdminEnumProfile {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  [key: string]: unknown;
}

interface ProfilePickerProps<T extends AdminEnumProfile> {
  collection: string;          // Firestore collection to fetch from
  value: string | undefined;   // Currently selected id
  onChange: (id: string, profile: T) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Extra filter — only show profiles matching this predicate */
  filter?: (profile: T) => boolean;
  /** Optional render fn for selected item label */
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

  // Close on outside click
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
    <div
      ref={containerRef}
      data-picker={collectionName}
      style={{ position: "relative", display: "inline-block", width: "100%" }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        style={{
          width: "100%",
          background: "var(--bg3)",
          border: `1px solid ${open ? C.blue : C.border}`,
          borderRadius: 8,
          padding: "6px 10px",
          color: selected ? C.text : C.faint,
          fontSize: 13,
          cursor: disabled ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          textAlign: "left",
        }}
      >
        {selected?.icon && <span>{selected.icon}</span>}
        {selected
          ? (renderLabel ? renderLabel(selected as T) : selected.name)
          : (loading ? "Loading…" : placeholder)}
        <span style={{ marginLeft: "auto", color: C.faint, fontSize: 10 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          right: 0,
          background: "var(--bg2)",
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          boxShadow: "0 8px 32px #0008",
          zIndex: 500,
          overflow: "hidden",
        }}>
          <div style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}` }}>
            <input
              autoFocus
              style={{
                width: "100%",
                background: "var(--bg3)",
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: "4px 8px",
                color: C.text,
                fontSize: 12,
                boxSizing: "border-box",
              }}
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ padding: "12px 10px", color: C.faint, fontSize: 12 }}>
                {loading ? "Loading…" : "No matches"}
              </div>
            )}
            {filtered.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onChange(opt.id, opt as T); setOpen(false); setSearch(""); }}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: opt.id === value ? C.blue + "22" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: C.text,
                  fontSize: 13,
                  textAlign: "left",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.blue + "11")}
                onMouseLeave={e => (e.currentTarget.style.background = opt.id === value ? C.blue + "22" : "transparent")}
              >
                {opt.icon && <span style={{ fontSize: 16 }}>{opt.icon}</span>}
                {opt.color && (
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: opt.color, flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontWeight: opt.id === value ? 600 : 400 }}>{renderLabel ? renderLabel(opt as T) : opt.name}</div>
                  {opt.description && <div style={{ fontSize: 11, color: C.faint, marginTop: 1 }}>{opt.description}</div>}
                </div>
                {opt.id === value && <span style={{ marginLeft: "auto", color: C.blue, fontSize: 14 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

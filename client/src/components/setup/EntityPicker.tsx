// EntityPicker — searchable name dropdown on the left + tabbed preview pane on the right.
// Used to select a beyblade or an arena. Generic over the entity shape; tabs
// are provided by the caller.

import { useMemo, useState } from "react";
import { C, alpha } from "@/styles/theme";

export interface EntityOption {
  id: string;
  /** Display name shown in the list. */
  name: string;
  /** Optional 1-line subtitle (e.g. "Attack · Right spin"). */
  subtitle?: string;
  /** Optional tag for grouping (e.g. era — "Bakuten", "Burst", "X-Gen"). */
  group?: string;
  /** Free-form metadata the tabs render. */
  data: unknown;
}

export interface EntityTab {
  /** Stable id for routing the tab content. */
  id: string;
  label: string;
  /** Render function. Receives the currently-selected option (or null when nothing is selected). */
  render: (selected: EntityOption | null) => React.ReactNode;
}

export interface EntityPickerProps {
  title?: string;
  icon?: string;
  /** Options in display order. The first option whose `id` matches `selectedId` is highlighted. */
  options: EntityOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  tabs: EntityTab[];
  /** Optional: dim these option ids in the list (e.g. AI bey list dims the player's pick). */
  dimIds?: Set<string>;
  /** Optional: empty-list copy. */
  emptyMessage?: string;
}

export function EntityPicker({
  title,
  icon,
  options,
  selectedId,
  onSelect,
  tabs,
  dimIds,
  emptyMessage = "No options available.",
}: EntityPickerProps) {
  const [query, setQuery] = useState("");
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      o.name.toLowerCase().includes(q) ||
      (o.subtitle?.toLowerCase().includes(q) ?? false) ||
      (o.group?.toLowerCase().includes(q) ?? false),
    );
  }, [options, query]);

  // Group by `group` (if any). Maintains order of first-appearance.
  const grouped = useMemo(() => {
    const byGroup = new Map<string, EntityOption[]>();
    for (const o of filtered) {
      const g = o.group ?? "";
      const list = byGroup.get(g) ?? [];
      list.push(o);
      byGroup.set(g, list);
    }
    return Array.from(byGroup.entries());
  }, [filtered]);

  const selected = options.find((o) => o.id === selectedId) ?? null;
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  return (
    <div style={{
      background: C.bg1, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden",
    }}>
      {/* Header */}
      {(title || icon) && (
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          {icon && <span>{icon}</span>}
          {title && <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{title}</span>}
          {selected && (
            <span style={{ marginLeft: "auto", fontSize: 12, color: C.faint }}>
              «{selected.name}»
            </span>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 1fr) minmax(280px, 2fr)", minHeight: 320 }}>
        {/* Left — searchable name list */}
        <div style={{ borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 10, borderBottom: `1px solid ${C.border}` }}>
            <input
              type="search"
              placeholder="🔎 Search name or era"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`,
                background: C.bg2, color: C.text, fontSize: 13, outline: "none",
              }}
            />
          </div>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 360 }}>
            {options.length === 0 ? (
              <div style={{ padding: 16, color: C.faint, fontSize: 12, textAlign: "center" }}>{emptyMessage}</div>
            ) : grouped.length === 0 ? (
              <div style={{ padding: 16, color: C.faint, fontSize: 12, textAlign: "center" }}>No matches for "{query}".</div>
            ) : (
              grouped.map(([groupName, list]) => (
                <div key={groupName || "_default"}>
                  {groupName && (
                    <div style={{
                      padding: "6px 12px", fontSize: 10, color: C.faint, textTransform: "uppercase",
                      letterSpacing: "0.07em", background: C.bg2, borderBottom: `1px solid ${C.border}`,
                    }}>
                      {groupName}
                    </div>
                  )}
                  {list.map((o) => {
                    const isSel = o.id === selectedId;
                    const isDim = dimIds?.has(o.id);
                    return (
                      <button
                        key={o.id}
                        onClick={() => onSelect(o.id)}
                        style={{
                          width: "100%", textAlign: "left", padding: "10px 12px",
                          background: isSel ? alpha(C.blue, 0.13) : "transparent",
                          color: isSel ? C.blue : C.text,
                          border: "none",
                          borderLeft: `3px solid ${isSel ? C.blue : "transparent"}`,
                          opacity: isDim ? 0.45 : 1,
                          cursor: "pointer",
                          display: "block",
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: isSel ? 700 : 500 }}>{o.name}</div>
                        {o.subtitle && (
                          <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{o.subtitle}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right — tabbed preview pane */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTabId(t.id)}
                style={{
                  padding: "10px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: activeTabId === t.id ? C.bg2 : "transparent",
                  color: activeTabId === t.id ? C.text : C.muted,
                  border: "none",
                  borderBottom: `2px solid ${activeTabId === t.id ? C.blue : "transparent"}`,
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Active tab content */}
          <div style={{ padding: 16, flex: 1, overflowY: "auto", color: C.text }}>
            {activeTab ? activeTab.render(selected) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// EntityPicker — searchable name dropdown on the left + tabbed preview pane (in modal).
// Used to select a beyblade or an arena. Generic over the entity shape; tabs
// are provided by the caller.

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { PreviewModal } from "@/components/ui/PreviewModal";

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
    <div className="bg-bg1 rounded-2xl border border-border-c overflow-hidden">
      {/* Header */}
      {(title || icon) && (
        <div className="px-4 py-3 border-b border-border-c flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title && <span className="font-semibold text-[14px] text-theme-text">{title}</span>}
          {selected && (
            <>
              <span className="ml-auto text-[12px] text-theme-faint">
                «{selected.name}»
              </span>
              <PreviewModal title={`Preview — ${selected.name}`} size="xl" label="Preview">
                <div className="flex flex-col h-full">
                  {/* Tab bar */}
                  <div className="flex border-b border-border-c overflow-x-auto shrink-0">
                    {tabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTabId(t.id)}
                        className={cn(
                          "px-3.5 py-2.5 text-[12px] font-semibold cursor-pointer border-none whitespace-nowrap border-b-2",
                          activeTabId === t.id
                            ? "bg-bg2 text-theme-text border-b-theme-blue"
                            : "bg-transparent text-theme-muted border-b-transparent",
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {/* Active tab content */}
                  <div className="p-4 flex-1 overflow-y-auto text-theme-text">
                    {activeTab ? activeTab.render(selected) : null}
                  </div>
                </div>
              </PreviewModal>
            </>
          )}
        </div>
      )}

      {/* Searchable name list */}
      <div className="flex flex-col min-h-[320px]">
        <div className="p-2.5 border-b border-border-c">
          <input
            type="search"
            placeholder="🔎 Search name or era"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-2.5 py-2 rounded-lg border border-border-c bg-bg2 text-theme-text text-[13px] outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto max-h-[360px]">
          {options.length === 0 ? (
            <div className="p-4 text-theme-faint text-[12px] text-center">{emptyMessage}</div>
          ) : grouped.length === 0 ? (
            <div className="p-4 text-theme-faint text-[12px] text-center">No matches for "{query}".</div>
          ) : (
            grouped.map(([groupName, list]) => (
              <div key={groupName || "_default"}>
                {groupName && (
                  <div className="px-3 py-1.5 text-[10px] text-theme-faint uppercase tracking-[0.07em] bg-bg2 border-b border-border-c">
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
                      className={cn(
                        "w-full text-left px-3 py-2.5 border-none block cursor-pointer",
                        isSel ? "bg-blue-13 text-theme-blue border-l-[3px] border-l-theme-blue" : "bg-transparent text-theme-text border-l-[3px] border-l-transparent",
                        isDim && "opacity-45",
                      )}
                    >
                      <div className={cn("text-[13px]", isSel ? "font-bold" : "font-medium")}>{o.name}</div>
                      {o.subtitle && (
                        <div className="text-[11px] text-theme-faint mt-0.5">{o.subtitle}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

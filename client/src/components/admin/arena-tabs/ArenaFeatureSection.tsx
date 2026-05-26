import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import { cn } from "@/lib/cn";

interface AddVariant {
  label: string;
  onClick: () => void;
}

interface ArenaFeatureSectionProps<T extends { id: string | number }> {
  title: string;
  storageKey: string;
  items: T[];
  maxItems?: number;
  onAdd?: () => void;
  addLabel?: string;
  addVariants?: AddVariant[];
  onRemove: (id: T["id"]) => void;
  renderItemHeader?: (item: T, idx: number) => React.ReactNode;
  renderItemBody: (item: T, idx: number) => React.ReactNode;
  emptyIcon?: string;
  emptyText?: string;
  itemClassName?: string;
}

export function ArenaFeatureSection<T extends { id: string | number }>({
  title,
  storageKey,
  items,
  maxItems,
  onAdd,
  addLabel = "Add",
  addVariants,
  onRemove,
  renderItemHeader,
  renderItemBody,
  emptyIcon = "📦",
  emptyText = "No items yet.",
  itemClassName,
}: ArenaFeatureSectionProps<T>) {
  const atMax = maxItems != null && items.length >= maxItems;

  const addButtons = addVariants
    ? addVariants.map(v => (
        <button
          key={v.label}
          onClick={v.onClick}
          disabled={atMax}
          className={cn(
            "py-1 px-3 bg-bg3 border border-border-c text-theme-muted rounded-md text-xs font-medium transition-colors",
            atMax ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-bg2 hover:text-theme-text",
          )}
        >
          {v.label}
        </button>
      ))
    : onAdd
    ? [
        <button
          key="add"
          onClick={onAdd}
          disabled={atMax}
          className={cn(
            "py-1 px-3 bg-bg3 border border-border-c text-theme-muted rounded-md text-xs font-medium transition-colors",
            atMax ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-bg2 hover:text-theme-text",
          )}
        >
          + {addLabel}
        </button>,
      ]
    : [];

  return (
    <CollapsibleSection
      title={title}
      badge={items.length || null}
      storageKey={storageKey}
      defaultOpen={true}
    >
      <div className="flex flex-col gap-4">
        {(onAdd || addVariants) && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-theme-muted">
              {items.length}{maxItems != null ? ` / ${maxItems}` : ""} item{items.length !== 1 ? "s" : ""}
            </span>
            <div className="flex flex-wrap gap-1.5">{addButtons}</div>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-10 text-theme-faint">
            <div className="text-[32px] mb-2">{emptyIcon}</div>
            <p className="text-sm">{emptyText}</p>
          </div>
        )}

        {items.map((item, idx) => (
          <div
            key={item.id}
            className={cn("bg-bg3 rounded-xl p-4 border border-border-c flex flex-col gap-3", itemClassName)}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-medium text-theme-text">
                {renderItemHeader ? renderItemHeader(item, idx) : `Item #${idx + 1}`}
              </span>
              <button
                onClick={() => onRemove(item.id)}
                className="text-xs text-theme-red bg-transparent border-none cursor-pointer hover:opacity-80 shrink-0"
              >
                Remove
              </button>
            </div>
            {renderItemBody(item, idx)}
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

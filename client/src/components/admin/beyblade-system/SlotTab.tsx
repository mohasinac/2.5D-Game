/**
 * SlotTab — shows a PartPicker for one slot, config selector, and flip toggle.
 * PartPicker now handles the selected-chip display internally.
 */

import { C, alpha } from "@/styles/theme";
import { PartPicker } from "./PartPicker";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PartSummary = Record<string, any>;

interface Props {
  label: string;
  collectionName: string;
  selectedId?: string;
  selectedConfig?: string;
  onPartSelect: (partId: string) => void;
  onClear?: () => void;
  onConfigSelect: (configName: string) => void;
  existingCompatibilityTags?: string[];
  canFlip?: boolean;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  partData?: PartSummary | null;
}

export function SlotTab({
  label,
  collectionName,
  selectedId,
  selectedConfig,
  onPartSelect,
  onClear,
  onConfigSelect,
  existingCompatibilityTags = [],
  canFlip = false,
  flipped = false,
  onFlip,
  partData,
}: Props) {
  const configs = partData?.configurations ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <PartPicker
        collectionName={collectionName}
        selectedId={selectedId}
        onSelect={(id, data) => onPartSelect(id)}
        onClear={onClear}
        existingCompatibilityTags={existingCompatibilityTags}
        label={`Select ${label}`}
      />

      {/* Config selector */}
      {selectedId && configs.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Configuration</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {(configs as Array<{ name: string }>).map((cfg) => (
              <button
                key={cfg.name}
                onClick={() => onConfigSelect(cfg.name)}
                style={{
                  padding: "4px 10px", fontSize: 11, borderRadius: 5, cursor: "pointer",
                  background: selectedConfig === cfg.name ? alpha(C.blue, 0.13) : C.bg2,
                  color: selectedConfig === cfg.name ? C.blue : C.muted,
                  border: `1px solid ${selectedConfig === cfg.name ? alpha(C.blue, 0.33) : C.border}`,
                }}
              >
                {cfg.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flip toggle (AR only) */}
      {canFlip && selectedId && (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={flipped}
            onChange={(e) => onFlip?.(e.target.checked)}
            style={{ accentColor: C.blue }}
          />
          <span style={{ fontSize: 11, color: C.muted }}>Flip {label}</span>
          <span style={{ fontSize: 10, color: C.faint }}>reverses CP angles + spin behaviors</span>
        </label>
      )}
    </div>
  );
}

/**
 * SlotTab — shows a PartPicker for one slot, config selector, and flip toggle.
 * PartPicker now handles the selected-chip display internally.
 */

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
    <div className="flex flex-col gap-2.5">
      <PartPicker
        collectionName={collectionName}
        selectedId={selectedId}
        onSelect={(id, _data) => onPartSelect(id)}
        onClear={onClear}
        existingCompatibilityTags={existingCompatibilityTags}
        label={`Select ${label}`}
      />

      {/* Config selector */}
      {selectedId && configs.length > 0 && (
        <div>
          <div className="text-[11px] text-muted mb-1">Configuration</div>
          <div className="flex gap-1 flex-wrap">
            {(configs as Array<{ name: string }>).map((cfg) => (
              <button
                key={cfg.name}
                onClick={() => onConfigSelect(cfg.name)}
                className={`px-2.5 py-1 text-[11px] rounded-[5px] cursor-pointer border ${
                  selectedConfig === cfg.name
                    ? "bg-blue/10 text-blue border-blue/30"
                    : "bg-bg2 text-muted border-border"
                }`}
              >
                {cfg.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flip toggle (AR only) */}
      {canFlip && selectedId && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={flipped}
            onChange={(e) => onFlip?.(e.target.checked)}
            className="accent-blue"
          />
          <span className="text-[11px] text-muted">Flip {label}</span>
          <span className="text-[10px] text-faint">reverses CP angles + spin behaviors</span>
        </label>
      )}
    </div>
  );
}

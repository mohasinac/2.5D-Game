/**
 * SlotTab — shows a PartPicker for one slot, config selector, and a mini part summary.
 */

import { useState } from "react";
import { C } from "@/styles/theme";
import { PartPicker } from "./PartPicker";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PartSummary = Record<string, any>;

interface Props {
  label: string;
  collectionName: string;
  selectedId?: string;
  selectedConfig?: string;
  onPartSelect: (partId: string) => void;
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
  onConfigSelect,
  existingCompatibilityTags = [],
  canFlip = false,
  flipped = false,
  onFlip,
  partData,
}: Props) {
  const [expanded, setExpanded] = useState(!selectedId);

  const configs = partData?.configurations ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Selected part summary (when collapsed) */}
      {selectedId && partData && (
        <div
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
            background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 7, cursor: "pointer",
          }}
          onClick={() => setExpanded((e) => !e)}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: partData.color ?? C.faint, flexShrink: 0, border: `1px solid ${C.border}` }} />
          <span style={{ flex: 1, fontSize: 12, color: C.text }}>{partData.displayName}</span>
          {selectedConfig && (
            <span style={{ fontSize: 10, color: C.blue, background: C.blue + "18", padding: "2px 6px", borderRadius: 4 }}>{selectedConfig}</span>
          )}
          {canFlip && flipped && (
            <span style={{ fontSize: 9, color: C.yellow, background: C.yellow + "18", padding: "1px 5px", borderRadius: 4 }}>flipped</span>
          )}
          <span style={{ fontSize: 10, color: C.faint }}>{expanded ? "▾" : "▸"}</span>
        </div>
      )}

      {/* Picker (expanded or no selection yet) */}
      {(expanded || !selectedId) && (
        <PartPicker
          collectionName={collectionName}
          selectedId={selectedId}
          onSelect={(id, data) => {
            onPartSelect(id);
            setExpanded(false);
          }}
          existingCompatibilityTags={existingCompatibilityTags}
          label={`Select ${label}`}
        />
      )}

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
                  background: selectedConfig === cfg.name ? C.blue + "22" : C.bg2,
                  color: selectedConfig === cfg.name ? C.blue : C.muted,
                  border: `1px solid ${selectedConfig === cfg.name ? C.blue + "55" : C.border}`,
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

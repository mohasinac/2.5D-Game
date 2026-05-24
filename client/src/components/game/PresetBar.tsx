// Phase 23 — PresetBar: horizontal scrollable strip of preset tiles.

import type { PresetDoc } from "@/types/presetLibrary";

interface PresetBarProps<T = unknown> {
  presets: PresetDoc<T>[];
  onSelect: (preset: PresetDoc<T>) => void;
  selectedId?: string;
  label?: string;
}

export function PresetBar<T = unknown>({ presets, onSelect, selectedId, label }: PresetBarProps<T>) {
  if (presets.length === 0) return null;

  return (
    <div style={{ fontFamily: "monospace" }}>
      {label && (
        <div style={{ fontSize: "0.7rem", color: "#aabbcc", marginBottom: "0.4rem", fontWeight: 600 }}>
          {label}
        </div>
      )}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        overflowX: "auto",
        paddingBottom: "0.25rem",
        scrollbarWidth: "thin",
      }}>
        {presets.map(p => {
          const active = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              style={{
                flexShrink: 0,
                width: 80,
                padding: "6px 4px",
                borderRadius: 8,
                border: `1px solid ${active ? "#4488ff" : "rgba(255,255,255,0.12)"}`,
                background: active ? "rgba(68,136,255,0.15)" : "rgba(10,14,28,0.7)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              {p.thumbnail ? (
                <img src={p.thumbnail} alt={p.name}
                  style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
              ) : (
                <div style={{
                  width: 48, height: 48, borderRadius: 6,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.4rem",
                }}>📦</div>
              )}
              <span style={{
                fontSize: "0.55rem",
                color: active ? "#88aaff" : "#aabbcc",
                fontWeight: active ? 700 : 400,
                textAlign: "center",
                lineHeight: 1.2,
                maxWidth: 72,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
              }}>
                {p.name}
              </span>
              {p.tags.length > 0 && (
                <div style={{
                  fontSize: "0.45rem",
                  color: "#668888",
                  textAlign: "center",
                  maxWidth: 72,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {p.tags[0]}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

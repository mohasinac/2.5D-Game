import { C } from "@/styles/theme";

interface Props {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
}

export function SubComponentToggle({ label, description, enabled, onToggle, children }: Props) {
  return (
    <div style={{ border: `1px solid ${enabled ? C.blue + "44" : C.border}`, borderRadius: 10, overflow: "hidden", transition: "border-color 150ms" }}>
      {/* Header row */}
      <label
        style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
          background: enabled ? C.blue + "0e" : C.bg2, cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div
          onClick={() => onToggle(!enabled)}
          style={{
            width: 36, height: 20, borderRadius: 10, flexShrink: 0,
            background: enabled ? C.blue : C.bg3,
            border: `1px solid ${enabled ? C.blue : C.border}`,
            position: "relative", transition: "background 150ms",
          }}
        >
          <div
            style={{
              position: "absolute", top: 2, left: enabled ? 18 : 2,
              width: 14, height: 14, borderRadius: "50%",
              background: enabled ? "#fff" : C.muted,
              transition: "left 150ms, background 150ms",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: enabled ? C.text : C.muted }}>{label}</div>
          {description && (
            <div style={{ fontSize: 11, color: C.faint, marginTop: 1 }}>{description}</div>
          )}
        </div>
      </label>

      {/* Expandable body */}
      {enabled && (
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}`, background: C.bg1 }}>
          {children}
        </div>
      )}
    </div>
  );
}

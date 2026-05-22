import { type LucideIcon } from "lucide-react";
import { C, alpha } from "@/styles/theme";

export interface TabItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  badge?: number;
}

interface TabBarProps {
  tabs: TabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  variant?: "line" | "pill" | "segment";
}

export function TabBar({ tabs, activeKey, onSelect, variant = "line" }: TabBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: variant === "segment" ? 0 : 2,
        borderBottom: variant === "line" ? `1px solid ${C.border}` : "none",
        background: variant === "segment" ? C.bg2 : "transparent",
        borderRadius: variant === "segment" ? 8 : 0,
        padding: variant === "segment" ? 3 : 0,
      }}
    >
      {tabs.map((tab, i) => {
        const isActive = tab.key === activeKey;
        const Icon = tab.icon;

        const segmentStyle: React.CSSProperties = isActive
          ? {
              background: C.bg1,
              color: C.text,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
            }
          : {
              background: "transparent",
              color: C.muted,
              border: "1px solid transparent",
              borderRadius: 6,
            };

        const lineStyle: React.CSSProperties = isActive
          ? {
              color: C.text,
              borderBottom: `2px solid ${C.blue}`,
              background: "transparent",
            }
          : {
              color: C.muted,
              borderBottom: "2px solid transparent",
              background: "transparent",
            };

        const pillStyle: React.CSSProperties = isActive
          ? {
              color: C.blue,
              background: alpha(C.blue, 0.12),
              border: `1px solid ${alpha(C.blue, 0.27)}`,
              borderRadius: 20,
            }
          : {
              color: C.muted,
              background: "transparent",
              border: "1px solid transparent",
              borderRadius: 20,
            };

        const variantStyle =
          variant === "segment"
            ? segmentStyle
            : variant === "pill"
            ? pillStyle
            : lineStyle;

        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 36,
              padding: "0 12px",
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color 120ms, background 120ms",
              marginBottom: variant === "line" ? -1 : 0,
              outline: "none",
              ...variantStyle,
            }}
          >
            {Icon && <Icon size={13} />}
            <span>{tab.label}</span>
            {tab.badge != null && tab.badge > 0 && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  background: C.blue,
                  color: "#fff",
                  padding: "1px 5px",
                  borderRadius: 10,
                  lineHeight: 1.4,
                  minWidth: 16,
                  textAlign: "center",
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

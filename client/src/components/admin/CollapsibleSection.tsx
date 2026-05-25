import { useState } from "react";
import { C, alpha } from "@/styles/theme";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** Number badge shown when collapsed to indicate items inside */
  badge?: number | string | null;
  /** Persists open/closed state in localStorage under this key */
  storageKey?: string;
  /** Extra right-side element (e.g. an "Add" button) */
  action?: React.ReactNode;
}

export function CollapsibleSection({
  title, children, defaultOpen = true, badge, storageKey, action,
}: Props) {
  const [open, setOpen] = useState(() => {
    if (storageKey) {
      const v = localStorage.getItem(`collapse.${storageKey}`);
      if (v !== null) return v === "1";
    }
    return defaultOpen;
  });

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (storageKey) localStorage.setItem(`collapse.${storageKey}`, next ? "1" : "0");
  };

  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 2,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", background: C.bg3 }}>
        <button
          onClick={toggle}
          style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", background: "transparent", border: "none",
            cursor: "pointer", textAlign: "left", color: C.text,
          }}
        >
          {open
            ? <ChevronDown size={13} color={C.muted} />
            : <ChevronRight size={13} color={C.muted} />}
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>{title}</span>
          {!open && badge !== undefined && badge !== null && badge !== 0 && (
            <span style={{
              background: alpha(C.purple, 0.25), color: C.purple,
              borderRadius: 8, fontSize: 10, fontWeight: 700, padding: "1px 7px",
            }}>
              {badge}
            </span>
          )}
        </button>
        {action && (
          <div style={{ paddingRight: 10, flexShrink: 0 }}>{action}</div>
        )}
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: "14px 14px", background: C.bg2 }}>
          {children}
        </div>
      )}
    </div>
  );
}

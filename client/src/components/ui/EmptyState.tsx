import { type ReactNode } from "react";
import { C } from "@/styles/theme";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "64px 24px",
        color: C.faint,
        textAlign: "center",
      }}
    >
      {icon && (
        <div style={{ color: C.faint, opacity: 0.6 }}>{icon}</div>
      )}
      <div style={{ fontSize: 15, fontWeight: 600, color: C.muted }}>{title}</div>
      {description && (
        <div style={{ fontSize: 12, color: C.faint, maxWidth: 320 }}>{description}</div>
      )}
      {action && <div style={{ marginTop: 4 }}>{action}</div>}
    </div>
  );
}

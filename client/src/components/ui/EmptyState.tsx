import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      {icon && (
        <div className="text-theme-faint opacity-60 text-4xl">{icon}</div>
      )}
      <div className="text-sm font-semibold text-theme-muted">{title}</div>
      {description && (
        <div className="text-xs text-theme-faint max-w-[320px]">{description}</div>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

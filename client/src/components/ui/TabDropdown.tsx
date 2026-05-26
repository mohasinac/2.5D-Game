import { cn } from "@/lib/cn";

interface Tab<T extends string = string> {
  key: T;
  label: string;
  hidden?: boolean;
}

interface Props<T extends string = string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  label?: string;
}

export function TabDropdown<T extends string = string>({ tabs, value, onChange, className, label }: Props<T>) {
  const visible = tabs.filter(t => !t.hidden);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-xs text-theme-muted font-medium shrink-0">{label}</span>}
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className={cn(
          "bg-bg2 border border-border-c rounded-md px-3 py-1.5 text-sm text-theme-text",
          "focus:outline-none focus:border-theme-blue cursor-pointer transition-colors",
          "appearance-none pr-7",
          "[background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='12'%20viewBox='0%200%2012%2012'%3E%3Cpath%20fill='%2394a3b8'%20d='M6%208L1%203h10z'/%3E%3C/svg%3E\")] bg-no-repeat [background-position:right_8px_center]",
        )}
      >
        {visible.map(t => (
          <option key={t.key} value={t.key}>{t.label}</option>
        ))}
      </select>
    </div>
  );
}

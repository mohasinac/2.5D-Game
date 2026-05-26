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
      {label && <span className="text-xs text-muted font-medium shrink-0">{label}</span>}
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className={cn(
          "bg-bg2 border border-border rounded-md px-3 py-1.5 text-base text-text",
          "focus:outline-none focus:border-blue cursor-pointer transition-colors",
          "appearance-none pr-7",
        )}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
      >
        {visible.map(t => (
          <option key={t.key} value={t.key}>{t.label}</option>
        ))}
      </select>
    </div>
  );
}

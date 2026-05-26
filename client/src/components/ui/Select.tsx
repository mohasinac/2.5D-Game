import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={selectId} className="text-xs text-muted font-medium">{label}</label>}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full bg-bg3 border border-border rounded-md px-3 py-2 text-base text-text",
            "focus:outline-none focus:border-blue transition-colors cursor-pointer",
            error && "border-red",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-xs text-red">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";

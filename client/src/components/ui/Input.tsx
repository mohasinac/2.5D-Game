import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={inputId} className="text-xs text-theme-muted font-medium">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-bg3 border border-border-c rounded-md px-3 py-2 text-sm text-theme-text placeholder:text-theme-faint",
            "focus:outline-none focus:border-theme-blue transition-colors",
            error && "border-theme-red",
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-theme-red">{error}</span>}
        {!error && hint && <span className="text-xs text-theme-faint">{hint}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={inputId} className="text-xs text-theme-muted font-medium">{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-bg3 border border-border-c rounded-md px-3 py-2 text-sm text-theme-text placeholder:text-theme-faint resize-y min-h-[80px]",
            "focus:outline-none focus:border-theme-blue transition-colors",
            error && "border-theme-red",
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-theme-red">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

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
        {label && <label htmlFor={inputId} className="text-xs text-muted font-medium">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-bg3 border border-border rounded-md px-3 py-2 text-base text-text placeholder:text-faint",
            "focus:outline-none focus:border-blue transition-colors",
            error && "border-red",
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-red">{error}</span>}
        {!error && hint && <span className="text-xs text-faint">{hint}</span>}
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
        {label && <label htmlFor={inputId} className="text-xs text-muted font-medium">{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-bg3 border border-border rounded-md px-3 py-2 text-base text-text placeholder:text-faint resize-y min-h-[80px]",
            "focus:outline-none focus:border-blue transition-colors",
            error && "border-red",
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-red">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

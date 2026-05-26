import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "success" | "warning" | "default";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-theme-blue text-white hover:opacity-90 border-transparent",
  default: "bg-theme-blue text-white hover:opacity-90 border-transparent",
  outline: "bg-transparent text-theme-text border-border-c hover:bg-bg3",
  ghost:   "bg-transparent text-theme-muted border-transparent hover:text-theme-text hover:bg-bg2",
  danger:  "bg-theme-red text-white hover:opacity-90 border-transparent",
  success: "bg-theme-green text-white hover:opacity-90 border-transparent",
  warning: "bg-theme-yellow text-bg0 hover:opacity-90 border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs rounded gap-1 min-h-[28px]",
  sm: "px-3 py-1.5 text-sm rounded gap-1.5 min-h-[32px]",
  md: "px-4 py-2 text-sm rounded-md gap-2 min-h-[36px]",
  lg: "px-5 py-2.5 text-base rounded-md gap-2 min-h-[40px]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(({
  variant = "outline",
  size = "md",
  loading,
  icon,
  iconRight,
  className,
  disabled,
  children,
  ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={cn(
      "inline-flex items-center justify-center font-semibold border transition-all cursor-pointer select-none shrink-0",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  >
    {loading ? <span className="spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" /> : icon}
    {children}
    {!loading && iconRight}
  </button>
));
Button.displayName = "Button";

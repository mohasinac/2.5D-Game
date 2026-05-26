import { type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Label({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-xs text-muted font-medium mb-1.5", className)} {...props}>
      {children}
    </label>
  );
}

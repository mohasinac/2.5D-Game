import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number | string;
  wrap?: boolean;
}

export function Row({ gap, wrap, className, children, ...props }: RowProps) {
  return (
    <div
      className={cn("flex items-center", wrap && "flex-wrap", className)}
      style={gap !== undefined ? { gap: typeof gap === "number" ? `${gap}px` : gap } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

interface ColProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number | string;
}

export function Col({ gap, className, children, ...props }: ColProps) {
  return (
    <div
      className={cn("flex flex-col", className)}
      style={gap !== undefined ? { gap: typeof gap === "number" ? `${gap}px` : gap } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function SectionTitle({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs font-semibold text-muted uppercase tracking-widest mb-3", className)}
      {...props}
    >
      {children}
    </p>
  );
}

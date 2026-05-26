import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeColor = "blue" | "red" | "green" | "yellow" | "purple" | "orange" | "muted" | "faint";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const colorClasses: Record<BadgeColor, string> = {
  blue:   "bg-blue/[.13] text-blue border-blue/[.27]",
  red:    "bg-red/[.13] text-red border-red/[.27]",
  green:  "bg-green/[.13] text-green border-green/[.27]",
  yellow: "bg-yellow/[.13] text-yellow border-yellow/[.27]",
  purple: "bg-purple/[.13] text-purple border-purple/[.27]",
  orange: "bg-orange/[.13] text-orange border-orange/[.27]",
  muted:  "bg-bg3 text-muted border-border",
  faint:  "bg-bg2 text-faint border-border",
};

export function Badge({ color = "muted", className, children, ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border",
        colorClasses[color],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

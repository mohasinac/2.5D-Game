import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeColor = "blue" | "red" | "green" | "yellow" | "purple" | "orange" | "muted" | "faint";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const colorClasses: Record<BadgeColor, string> = {
  blue:   "bg-blue-13 text-theme-blue border-blue-30",
  red:    "bg-red-13 text-theme-red border-red-30",
  green:  "bg-green-13 text-theme-green border-green-30",
  yellow: "bg-yellow-10 text-theme-yellow border-yellow-40",
  purple: "bg-purple-10 text-theme-purple border-purple-33",
  orange: "bg-orange-10 text-theme-orange border-border-c",
  muted:  "bg-bg3 text-theme-muted border-border-c",
  faint:  "bg-bg2 text-theme-faint border-border-c",
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

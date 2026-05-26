import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthClasses = {
  sm:   "max-w-2xl",
  md:   "max-w-4xl",
  lg:   "max-w-5xl",
  xl:   "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-none",
};

export function PageWrapper({ maxWidth = "xl", className, children, ...props }: Props) {
  return (
    <div className={cn("p-6 mx-auto w-full", maxWidthClasses[maxWidth], className)} {...props}>
      {children}
    </div>
  );
}

export function AdminPageShell({ maxWidth = "xl", className, children, ...props }: Props) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className={cn("p-6 mx-auto w-full", maxWidthClasses[maxWidth], className)} {...props}>
        {children}
      </div>
    </div>
  );
}

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  inner?: boolean;
  padding?: boolean;
}

export function Card({ inner, padding = false, className, children, ...props }: Props) {
  return (
    <div
      className={cn(
        "border border-border rounded-2xl",
        inner ? "bg-bg2" : "bg-bg2",
        padding && "p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-3 px-5 py-3 border-b border-border", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

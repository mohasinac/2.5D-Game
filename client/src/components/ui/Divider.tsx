import { cn } from "@/lib/cn";

export function Divider({ className }: { className?: string }) {
  return <div className={cn("border-t border-border my-4", className)} />;
}

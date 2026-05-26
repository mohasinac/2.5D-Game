import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/cn";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "border border-border-c rounded-md text-theme-text hover:bg-bg2 transition-colors leading-none",
        compact ? "px-1.5 py-1 text-sm" : "px-2.5 py-1.5 text-base",
      )}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}

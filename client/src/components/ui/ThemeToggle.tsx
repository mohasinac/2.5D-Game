// ThemeToggle — small icon button that flips light/dark.
// Stays out of the way; lives in admin top-bar and any header that wants it.

import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      style={{
        background: "transparent",
        border: "1px solid rgba(120,160,200,0.35)",
        borderRadius: "0.4rem",
        color: "inherit",
        cursor: "pointer",
        padding: compact ? "0.2rem 0.45rem" : "0.4rem 0.65rem",
        fontSize: compact ? "0.85rem" : "1rem",
        lineHeight: 1,
      }}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}

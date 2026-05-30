// Shared constants and helpers for RPG admin pages

export const LBL = "block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-1.5";
export const INP = "w-full bg-bg2 border border-border-c rounded-lg px-3 py-2 text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-accent";
export const TEXTAREA = "w-full bg-bg2 border border-border-c rounded-lg px-3 py-2 text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-accent font-mono min-h-[100px]";
export const BTN_PRIMARY = "px-4 py-2 bg-accent hover:opacity-90 text-white rounded-lg text-sm font-medium transition-opacity";
export const BTN_DANGER = "px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors";
export const BTN_SECONDARY = "px-4 py-2 bg-bg3 hover:bg-bg3/80 text-theme-text rounded-lg text-sm font-medium transition-colors";
export const CARD = "bg-bg1 border border-border-c rounded-xl p-5";
export const TABLE_TH = "px-4 py-2 text-left text-xs font-semibold text-theme-muted uppercase tracking-wide";
export const TABLE_TD = "px-4 py-2 text-sm text-theme-text";

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function safeJsonParse<T>(raw: string, fallback: T): T {
  try { return JSON.parse(raw); } catch { return fallback; }
}

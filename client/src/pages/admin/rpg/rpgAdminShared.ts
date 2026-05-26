// Shared constants and helpers for RPG admin pages

export const LBL = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5";
export const INP = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500";
export const TEXTAREA = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 font-mono min-h-[100px]";
export const BTN_PRIMARY = "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors";
export const BTN_DANGER = "px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors";
export const BTN_SECONDARY = "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors";
export const CARD = "bg-gray-900 border border-gray-800 rounded-xl p-5";
export const TABLE_TH = "px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide";
export const TABLE_TD = "px-4 py-2 text-sm text-gray-300";

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function safeJsonParse<T>(raw: string, fallback: T): T {
  try { return JSON.parse(raw); } catch { return fallback; }
}

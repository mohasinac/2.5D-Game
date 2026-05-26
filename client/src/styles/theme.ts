// CSS variable references — for inline styles (theme-aware, responds to data-theme toggle)
export const C = {
  bg0: 'var(--bg0)', bg1: 'var(--bg1)', bg2: 'var(--bg2)', bg3: 'var(--bg3)',
  border: 'var(--border)', borderLight: 'var(--border-light)',
  text: 'var(--text)', muted: 'var(--muted)', faint: 'var(--faint)',
  blue: 'var(--blue)', red: 'var(--red)', green: 'var(--green)',
  yellow: 'var(--yellow)', purple: 'var(--purple)', orange: 'var(--orange)',
  white: '#ffffff',
} as const;

// Hardcoded dark-theme hex — for canvas 2D contexts that cannot use CSS variables
export const HEX = {
  bg0: '#020817', bg1: '#0f172a', bg2: '#1e293b', bg3: '#334155',
  border: '#334155', borderLight: '#475569',
  text: '#f1f5f9', muted: '#94a3b8', faint: '#64748b',
  blue: '#3b82f6', red: '#ef4444', green: '#22c55e',
  yellow: '#eab308', purple: '#a855f7', orange: '#f97316',
  white: '#ffffff',
} as const;

// Alpha overlay — uses color-mix() for CSS-var compatibility
// e.g. alpha(C.blue, 0.13) → "color-mix(in srgb, var(--blue) 13%, transparent)"
export function alpha(cssVar: string, opacity: number): string {
  return `color-mix(in srgb, ${cssVar} ${Math.round(opacity * 100)}%, transparent)`;
}


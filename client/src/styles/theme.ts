import type React from "react";

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

export const S = {
  card: { background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16 } as React.CSSProperties,
  cardInner: { background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12 } as React.CSSProperties,
  input: { width: '100%', background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13 } as React.CSSProperties,
  label: { display: 'block', fontSize: 12, color: C.muted, marginBottom: 6 } as React.CSSProperties,
  row: { display: 'flex', alignItems: 'center', gap: 12 } as React.CSSProperties,
  col: { display: 'flex', flexDirection: 'column', gap: 12 } as React.CSSProperties,
  page: { padding: 24, maxWidth: 1200, margin: '0 auto' } as React.CSSProperties,
  sectionTitle: { fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 },
} as const;

export function btn(color: string, hover?: string): React.CSSProperties {
  return { background: color, color: C.white, border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
}

export function btnOutline(color: string = C.border): React.CSSProperties {
  return { background: 'transparent', color: C.text, border: `1px solid ${color}`, borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
}

export function pill(color: string): React.CSSProperties {
  return { display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: alpha(color, 0.13), color, border: `1px solid ${alpha(color, 0.27)}` };
}

export function bar(pct: number, color: string): React.CSSProperties {
  return { height: '100%', width: `${Math.max(0, Math.min(100, pct * 100))}%`, background: color, borderRadius: 'inherit', transition: 'width 150ms' };
}

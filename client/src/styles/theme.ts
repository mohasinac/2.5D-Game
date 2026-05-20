// Shared style constants — used across all pages instead of Tailwind classes.

export const C = {
  bg0: '#020817', bg1: '#0f172a', bg2: '#1e293b', bg3: '#334155',
  border: '#334155', borderLight: '#475569',
  text: '#f1f5f9', muted: '#94a3b8', faint: '#64748b',
  blue: '#3b82f6', blueDark: '#2563eb', blueGlow: 'rgba(59,130,246,0.15)',
  red: '#ef4444', redDark: '#dc2626', redGlow: 'rgba(239,68,68,0.15)',
  green: '#22c55e', greenDark: '#16a34a',
  yellow: '#eab308', orange: '#f97316', orangeDark: '#ea580c',
  purple: '#a855f7', purpleDark: '#9333ea', purpleGlow: 'rgba(168,85,247,0.15)',
  white: '#ffffff',
} as const;

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
  return { display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: color + '22', color, border: `1px solid ${color}44` };
}

export function bar(pct: number, color: string): React.CSSProperties {
  return { height: '100%', width: `${Math.max(0, Math.min(100, pct * 100))}%`, background: color, borderRadius: 'inherit', transition: 'width 150ms' };
}

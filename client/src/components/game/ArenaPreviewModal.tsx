import React, { useEffect, useRef } from 'react';

export interface ArenaPreviewData {
  id: string;
  name: string;
  shape?: string;
  theme?: string;
  width?: number;
  height?: number;
  pinkWallRadius?: number;
  ridgeRadius?: number;
  flatZoneRadius?: number;
  arenaPixelRadius?: number;
  spinZones?: Array<{ id: string; color?: number }>;
  obstacles?: unknown[];
  turrets?: unknown[];
}

interface ArenaPreviewModalProps {
  arena: ArenaPreviewData | null;
  onClose: () => void;
  onSelect?: (arenaId: string) => void;
}

function ArenaTopDown({ arena }: { arena: ArenaPreviewData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const SIZE = 120;
    ctx.clearRect(0, 0, SIZE, SIZE);
    const cx = SIZE / 2, cy = SIZE / 2;
    const baseR = SIZE * 0.45;

    // Background
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, SIZE, SIZE);

    if (arena.shape === 'circle' || !arena.shape) {
      const aW = arena.width ?? 1080;
      const arenaR = arena.arenaPixelRadius ?? (aW * 0.45);
      const scale = baseR / arenaR;

      // KO zone corners (outside arena circle = dark)
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Arena floor
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1a2e';
      ctx.fill();

      // Pink wall ring
      if (arena.pinkWallRadius) {
        const pr = arena.pinkWallRadius * scale;
        ctx.beginPath();
        ctx.arc(cx, cy, pr, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff44aa88';
        ctx.lineWidth = Math.max(2, (arenaR - arena.pinkWallRadius) * scale);
        ctx.stroke();
      }

      // Tornado ridge (sky blue)
      if (arena.ridgeRadius) {
        const rr = arena.ridgeRadius * scale;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.strokeStyle = '#00bfff88';
        ctx.lineWidth = Math.max(2, 36 * scale);
        ctx.stroke();
      }

      // Flat zone (yellow ring)
      if (arena.flatZoneRadius) {
        const fr = arena.flatZoneRadius * scale;
        ctx.beginPath();
        ctx.arc(cx, cy, fr, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffff0055';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Flat zone fill
        ctx.beginPath();
        ctx.arc(cx, cy, fr, 0, Math.PI * 2);
        ctx.fillStyle = '#ffff0010';
        ctx.fill();
      }

      // Arena boundary
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff44';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      // Rectangle arena
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(8, 8, SIZE - 16, SIZE - 16);
      ctx.strokeStyle = '#ffffff44';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(8, 8, SIZE - 16, SIZE - 16);
    }
  }, [arena]);

  return <canvas ref={canvasRef} width={120} height={120} style={{ display: 'block', borderRadius: 8 }} />;
}

const FEATURE_ICONS: Record<string, string> = {
  tornado_ridge: '🌪',
  recoil_wall: '⚡',
  out_zones: '💀',
  flat_center: '⬜',
  spin_zone: '🔄',
  obstacle: '🪨',
  turret: '🎯',
};

export function ArenaPreviewModal({ arena, onClose, onSelect }: ArenaPreviewModalProps) {
  if (!arena) return null;

  const features: string[] = [];
  if (arena.pinkWallRadius) features.push('recoil_wall');
  if (arena.ridgeRadius) features.push('tornado_ridge');
  if (arena.flatZoneRadius) features.push('flat_center');
  if (arena.arenaPixelRadius) features.push('out_zones');
  if (arena.spinZones?.length) features.push('spin_zone');
  if ((arena.obstacles as unknown[])?.length) features.push('obstacle');
  if ((arena.turrets as unknown[])?.length) features.push('turret');

  const sizeLabel = arena.width && arena.width >= 1440 ? 'Large' : arena.width && arena.width <= 720 ? 'Small' : 'Standard';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 24, width: '100%', maxWidth: 420, position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: 16, fontSize: 22, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{arena.name}</div>

        <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, width: 120, height: 120, background: 'rgba(255,255,255,0.04)', borderRadius: 12, overflow: 'hidden' }}>
            <ArenaTopDown arena={arena} />
          </div>
          <div style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.9 }}>
            <div>Shape: <span style={{ color: '#fff', textTransform: 'capitalize' }}>{arena.shape ?? 'Circle'}</span></div>
            <div>Theme: <span style={{ color: '#fff', textTransform: 'capitalize' }}>{arena.theme ?? 'Default'}</span></div>
            <div>Size: <span style={{ color: '#fff' }}>{sizeLabel}</span></div>
          </div>
        </div>

        {features.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Features</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {features.map(f => (
                <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: '#fff' }}>
                  {FEATURE_ICONS[f] ?? '•'} <span style={{ textTransform: 'capitalize', letterSpacing: '0.04em' }}>{f.replace(/_/g, ' ')}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {onSelect && (
          <button
            onClick={() => onSelect(arena.id)}
            style={{ width: '100%', padding: '12px 0', background: 'linear-gradient(135deg, #00e5ff22, #00e5ff44)', border: '1px solid #00e5ff88', borderRadius: 10, color: '#00e5ff', fontSize: 14, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            Select {arena.name}
          </button>
        )}
      </div>
    </div>
  );
}

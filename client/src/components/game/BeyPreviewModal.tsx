import React, { useEffect, useRef, useState } from 'react';

export interface BeyPreviewData {
  id: string;
  displayName: string;
  type?: string;
  generation?: string;
  attack?: number;
  defense?: number;
  stamina?: number;
  specialMove?: string;
  specialMoveDescription?: string;
  comboIds?: string[];
  color?: string;
  spinDirection?: string;
}

interface BeyPreviewModalProps {
  bey: BeyPreviewData | null;
  onClose: () => void;
  onSelect?: (beyId: string) => void;
}

function StatBar({ label, value, max = 150, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <span style={{ width: 36, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ width: 28, fontSize: 12, color: '#fff', fontWeight: 700, textAlign: 'right', flexShrink: 0 }}>{Math.round(value)}</span>
    </div>
  );
}

function SpinAnimation({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 80;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2, cy = size / 2, r = 34;
      // Outer glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, color);
      grad.addColorStop(0.6, color + '88');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // Spinning lines
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRef.current);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * (r - 6), Math.sin((i * Math.PI) / 2) * (r - 6));
        ctx.stroke();
      }
      ctx.restore();
      angleRef.current += 0.08;
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [color]);

  return <canvas ref={canvasRef} width={80} height={80} style={{ display: 'block' }} />;
}

export function BeyPreviewModal({ bey, onClose, onSelect }: BeyPreviewModalProps) {
  if (!bey) return null;

  const atk = bey.attack ?? 80;
  const def = bey.defense ?? 80;
  const sta = bey.stamina ?? 80;
  const typeColor = bey.type === 'attack' ? '#ff4444' : bey.type === 'defense' ? '#4488ff' : bey.type === 'stamina' ? '#44ff88' : '#ffcc44';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 24, width: '100%', maxWidth: 420, position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        <div style={{ textAlign: 'center', marginBottom: 16, fontSize: 22, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{bey.displayName}</div>

        {/* Spin + info */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
            <SpinAnimation color={bey.color ?? typeColor} />
          </div>
          <div style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
            {bey.type && <div><span style={{ color: typeColor, fontWeight: 700, textTransform: 'uppercase' }}>{bey.type}</span></div>}
            {bey.generation && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{bey.generation}</div>}
            {bey.spinDirection && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{bey.spinDirection === 'right' ? 'Right Spin' : 'Left Spin'}</div>}
          </div>
        </div>

        {/* Stat bars */}
        <div style={{ marginBottom: 16 }}>
          <StatBar label="ATK" value={atk} color="#ff4444" />
          <StatBar label="DEF" value={def} color="#4488ff" />
          <StatBar label="STA" value={sta} color="#44ff88" />
        </div>

        {/* Special move */}
        {bey.specialMove && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Special Move</div>
            <div style={{ fontSize: 14, color: '#00e5ff', fontWeight: 700 }}>{bey.specialMove}</div>
            {bey.specialMoveDescription && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{bey.specialMoveDescription}</div>}
          </div>
        )}

        {/* Combos */}
        {bey.comboIds && bey.comboIds.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Combos</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {bey.comboIds.map(c => (
                <span key={c} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' }}>{c.replace(/-/g, ' ')}</span>
              ))}
            </div>
          </div>
        )}

        {onSelect && (
          <button
            onClick={() => onSelect(bey.id)}
            style={{ width: '100%', padding: '12px 0', background: 'linear-gradient(135deg, #00e5ff22, #00e5ff44)', border: '1px solid #00e5ff88', borderRadius: 10, color: '#00e5ff', fontSize: 14, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            Select {bey.displayName}
          </button>
        )}
      </div>
    </div>
  );
}

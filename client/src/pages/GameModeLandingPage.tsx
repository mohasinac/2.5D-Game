import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PanelConfig {
  id: string;
  label: string;
  sublabel: string;
  description: string;
  accent: string;
  glowColor: string;
  path: string;
  adminOnly?: boolean;
  icon: string;
}

const PANELS: PanelConfig[] = [
  {
    id: 'story',
    label: 'STORY MODE',
    sublabel: 'RPG + Combat',
    description: 'Explore the world, battle rivals, unlock legends',
    accent: '#7c3aed',
    glowColor: 'rgba(124,58,237,0.35)',
    path: '/game/story',
    icon: '📖',
  },
  {
    id: 'battle',
    label: 'BATTLE MODE',
    sublabel: 'PvP · PvAI · Tournament · Royale',
    description: 'Challenge players worldwide or take on AI challengers',
    accent: '#dc2626',
    glowColor: 'rgba(220,38,38,0.35)',
    path: '/game/battle',
    icon: '⚔️',
  },
  {
    id: 'admin',
    label: 'ADMIN PANEL',
    sublabel: 'Content Management',
    description: 'Manage beyblades, arenas, tournaments, and assets',
    accent: '#d97706',
    glowColor: 'rgba(217,119,6,0.35)',
    path: '/admin',
    adminOnly: true,
    icon: '🛠️',
  },
  {
    id: 'settings',
    label: 'SETTINGS',
    sublabel: 'Profile · Controls · Display',
    description: 'Customise your profile, remap controls, and adjust display',
    accent: '#0ea5e9',
    glowColor: 'rgba(14,165,233,0.35)',
    path: '/settings',
    icon: '🎮',
  },
];

export function GameModeLandingPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [focused, setFocused] = useState(0);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const visiblePanels = PANELS.filter(p => !p.adminOnly || isAdmin);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const cols = window.innerWidth >= 640 ? 2 : 1;
      if (e.key === 'ArrowRight') setFocused(i => Math.min(i + 1, visiblePanels.length - 1));
      else if (e.key === 'ArrowLeft') setFocused(i => Math.max(i - 1, 0));
      else if (e.key === 'ArrowDown') setFocused(i => Math.min(i + cols, visiblePanels.length - 1));
      else if (e.key === 'ArrowUp') setFocused(i => Math.max(i - cols, 0));
      else if (e.key === 'Enter') {
        const panel = visiblePanels[focused];
        if (panel) navigate(panel.path);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [focused, visiblePanels, navigate]);

  const handleSelect = (panel: PanelConfig) => {
    setPressedId(panel.id);
    setTimeout(() => {
      setPressedId(null);
      navigate(panel.path);
    }, 150);
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100dvh',
        background: '#050814',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(12px, 2vh, 24px)',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Ambient background rings */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)',
        }} />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(16px, 3vh, 48px)', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <div style={{ fontSize: 'clamp(32px, 6vh, 56px)', marginBottom: '8px', filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.6))' }}>
          🌀
        </div>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-0.02em',
          margin: 0,
          textShadow: '0 0 40px rgba(99,102,241,0.4)',
        }}>
          BEYBLADE
        </h1>
        <div style={{
          fontSize: 'clamp(11px, 2vw, 14px)',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.3em',
          marginTop: '4px',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          Let It Rip
        </div>
      </div>

      {/* Panel grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(visiblePanels.length, 2)}, 1fr)`,
          gap: '16px',
          maxWidth: '760px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {visiblePanels.map((panel, idx) => {
          const isFocused = focused === idx;
          const isPressed = pressedId === panel.id;
          return (
            <button
              key={panel.id}
              onClick={() => handleSelect(panel)}
              onMouseEnter={() => setFocused(idx)}
              style={{
                background: isFocused
                  ? `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isFocused ? panel.accent : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '20px',
                padding: 'clamp(14px, 3vh, 32px) clamp(14px, 3vw, 28px)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 200ms ease',
                transform: isPressed ? 'scale(0.97)' : isFocused ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isFocused ? `0 0 40px ${panel.glowColor}, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isFocused && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '19px',
                  background: `linear-gradient(135deg, ${panel.glowColor} 0%, transparent 60%)`,
                  pointerEvents: 'none',
                }} />
              )}
              <div style={{ fontSize: 'clamp(28px, 4vh, 40px)', marginBottom: 'clamp(8px, 1.5vh, 14px)' }}>{panel.icon}</div>
              <div style={{
                fontSize: '20px', fontWeight: 900, color: '#fff',
                letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px',
              }}>
                {panel.label}
              </div>
              <div style={{
                fontSize: '11px', fontWeight: 600, color: panel.accent,
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px',
              }}>
                {panel.sublabel}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                {panel.description}
              </div>
              {isFocused && (
                <div style={{
                  position: 'absolute', bottom: '16px', right: '16px',
                  fontSize: '11px', color: panel.accent, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  PRESS ENTER
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer links */}
      <div style={{
        display: 'flex', gap: '16px', marginTop: 'clamp(16px, 3vh, 40px)', position: 'relative', zIndex: 1,
      }}>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', borderRadius: '12px',
            padding: '8px 16px', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 150ms',
          }}
        >
          🏆 Leaderboard
        </button>
      </div>
    </div>
  );
}

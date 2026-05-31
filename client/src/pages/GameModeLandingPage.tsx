import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CardCarousel, type CarouselCard } from '../components/ui/CardCarousel';

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

  const visiblePanels = PANELS.filter(p => !p.adminOnly || isAdmin);

  const cards: CarouselCard[] = visiblePanels.map(panel => ({
    id: panel.id,
    title: panel.label,
    subtitle: panel.sublabel,
    description: panel.description,
    icon: panel.icon,
    gradient: `linear-gradient(135deg, ${panel.glowColor} 0%, rgba(5,8,20,0.95) 100%)`,
    onSelect: () => navigate(panel.path),
  }));

  return (
    <div
      style={{
        height: '100dvh',
        overflow: 'hidden',
        background: '#050814',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8px,2vmin,24px)',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Ambient background rings */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
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
      <div style={{ textAlign: 'center', marginBottom: 'clamp(8px,2vmin,40px)', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <div style={{ fontSize: 'clamp(32px,6vmin,56px)', marginBottom: 'clamp(4px,1vmin,8px)', filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.6))' }}>
          🌀
        </div>
        <h1 style={{
          fontSize: 'clamp(28px,5vw,48px)',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-0.02em',
          margin: 0,
          textShadow: '0 0 40px rgba(99,102,241,0.4)',
        }}>
          BEYBLADE
        </h1>
        <div style={{
          fontSize: 'clamp(11px,2vw,14px)',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.3em',
          marginTop: '4px',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          Let It Rip
        </div>
      </div>

      {/* Carousel */}
      <div style={{ width: '100%', height: 'min(340px, calc(100dvh - 15vmin))', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <CardCarousel cards={cards} />
      </div>

      {/* Footer links */}
      <div style={{
        display: 'flex', gap: 'clamp(8px,1.5vmin,16px)', marginTop: 'clamp(8px,2vmin,32px)', position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', borderRadius: '12px',
            padding: 'clamp(5px,1vmin,8px) clamp(8px,1.5vmin,16px)',
            fontSize: 'clamp(10px,1.4vmin,12px)', fontWeight: 600,
            letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 150ms',
          }}
        >
          🏆 Leaderboard
        </button>
      </div>
    </div>
  );
}

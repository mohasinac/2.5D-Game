import { useNavigate } from 'react-router-dom';
import { CardCarousel, type CarouselCard } from '../components/ui/CardCarousel';

export function GameModeSelectPage() {
  const navigate = useNavigate();

  const cards: CarouselCard[] = [
    {
      id: 'story',
      title: 'Story Mode',
      subtitle: 'RPG Adventure',
      description: 'Embark on an epic journey across beyblade regions, battle rivals, unlock legendary beys, and uncover ancient secrets.',
      gradient: 'linear-gradient(135deg, #1e0a4a 0%, #3b0764 50%, #1e0a4a 100%)',
      icon: '📖',
      badge: 'RPG',
      onSelect: () => navigate('/game/story'),
    },
    {
      id: 'battle',
      title: 'Battle Mode',
      subtitle: 'PvP · AI · Tournament · Royale',
      description: 'Challenge other players worldwide, take on AI rivals, compete in tournaments, or fight in free-for-all battle royales.',
      gradient: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #450a0a 100%)',
      icon: '⚔️',
      badge: 'MULTIPLAYER',
      onSelect: () => navigate('/game/battle'),
    },
  ];

  return (
    <div style={{
      height: '100vh',
      background: '#050814',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '52px',
      paddingBottom: '8px',
      boxSizing: 'border-box',
    }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: '12px', left: '16px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.6)', borderRadius: '12px',
          padding: '7px 14px', fontSize: '12px', fontWeight: 600,
          cursor: 'pointer', letterSpacing: '0.04em', zIndex: 10,
        }}
      >
        ← Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: 'clamp(12px, 2.5vh, 32px)', flexShrink: 0 }}>
        <h1 style={{
          fontSize: 'clamp(18px, 4vw, 32px)',
          fontWeight: 900, color: '#fff',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          margin: 0,
        }}>
          GAME MODE
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '6px', letterSpacing: '0.05em' }}>
          Use ← → or scroll to browse · Press ENTER or tap to select
        </p>
      </div>

      <div style={{ width: '100%', height: 'min(440px, calc(100vh - 160px))', flexShrink: 0 }}>
        <CardCarousel cards={cards} />
      </div>
    </div>
  );
}

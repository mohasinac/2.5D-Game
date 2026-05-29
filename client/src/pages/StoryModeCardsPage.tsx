import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CardCarousel, type CarouselCard } from '../components/ui/CardCarousel';

interface RPGSaveInfo {
  hasProgress: boolean;
  lastLocation?: string;
  level?: number;
  timestamp?: number;
}

export function StoryModeCardsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [saveInfo, setSaveInfo] = useState<RPGSaveInfo>({ hasProgress: false });
  const [loadingeSave, setLoadingSave] = useState(true);

  useEffect(() => {
    if (!currentUser) { setLoadingSave(false); return; }
    getDoc(doc(db, 'rpg_saves', currentUser.uid))
      .then(snap => {
        if (snap.exists()) {
          const d = snap.data();
          setSaveInfo({
            hasProgress: true,
            lastLocation: d.lastLocation || 'Unknown Region',
            level: d.playerLevel || 1,
            timestamp: d.updatedAt?.toMillis?.() ?? Date.now(),
          });
        }
      })
      .catch(() => {/* no save found — use default */})
      .finally(() => setLoadingSave(false));
  }, [currentUser]);

  const lastSaved = saveInfo.timestamp
    ? new Date(saveInfo.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;

  const cards: CarouselCard[] = [
    {
      id: 'new-game',
      title: 'New Game',
      subtitle: 'Begin your journey',
      description: 'Start a fresh adventure. Choose your first beyblade and set out to become the greatest blader in the world.',
      gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      icon: '🌟',
      onSelect: () => navigate('/rpg', { state: { forceNew: true } }),
    },
    {
      id: 'continue',
      title: 'Continue',
      subtitle: saveInfo.hasProgress
        ? `Level ${saveInfo.level ?? '?'} · ${saveInfo.lastLocation ?? ''}`
        : 'No save found',
      description: saveInfo.hasProgress
        ? `Resume from ${saveInfo.lastLocation}. Last played ${lastSaved ?? 'recently'}.`
        : 'No save data found. Start a new game to begin your adventure.',
      gradient: saveInfo.hasProgress
        ? 'linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #1a0533 100%)'
        : 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 50%, #1a1a2e 100%)',
      icon: saveInfo.hasProgress ? '📜' : '🔒',
      disabled: loadingeSave || !saveInfo.hasProgress,
      badge: loadingeSave ? 'LOADING…' : undefined,
      onSelect: () => navigate('/rpg'),
    },
  ];

  return (
    <div style={{
      height: '100dvh',
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
          fontSize: 'clamp(18px, 4vw, 32px)', fontWeight: 900, color: '#fff',
          letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0,
        }}>
          STORY MODE
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '6px', letterSpacing: '0.05em' }}>
          Begin a new adventure or continue your journey
        </p>
      </div>

      <div style={{ width: '100%', height: 'min(440px, calc(100vh - 160px))', flexShrink: 0 }}>
        <CardCarousel cards={cards} />
      </div>
    </div>
  );
}

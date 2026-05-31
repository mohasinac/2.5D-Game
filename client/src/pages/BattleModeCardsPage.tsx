import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';
import { useGame } from '../contexts/GameContext';
import { DEFAULT_ARENA_ID, DEFAULT_BEYBLADE_ID } from '../stores/gameStore';
import { FALLBACK_BEYS, FALLBACK_ARENAS } from '../constants/fallbackEntities';
import { CardCarousel, type CarouselCard } from '../components/ui/CardCarousel';
import type { GameRoomConfig, RoomType } from '../types/gameRoom';
import toast from 'react-hot-toast';

type Difficulty = 'medium' | 'hard' | 'hell';

interface SimpleOption { id: string; name: string; isDefault?: boolean; }

interface DrawerState {
  open: boolean;
  roomType: RoomType | null;
}

const DIFFICULTY_LABELS: Record<Difficulty, { label: string; color: string }> = {
  medium: { label: 'Medium', color: '#f59e0b' },
  hard:   { label: 'Hard',   color: '#ef4444' },
  hell:   { label: 'Hell',   color: '#ff2a4d' },
};

export function BattleModeCardsPage() {
  const navigate = useNavigate();
  const { settings } = useGame();

  const [beyblades, setBeyblades] = useState<SimpleOption[]>([]);
  const [arenas, setArenas] = useState<SimpleOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBey, setSelectedBey] = useState<string>(DEFAULT_BEYBLADE_ID);
  const [selectedArena, setSelectedArena] = useState<string>(DEFAULT_ARENA_ID);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [bestOf, setBestOf] = useState<1 | 3 | 5>(1);
  const [aiCountTournament, setAiCountTournament] = useState(3);
  const [aiCountRoyale, setAiCountRoyale] = useState(11);

  const [drawer, setDrawer] = useState<DrawerState>({ open: false, roomType: null });

  // Modes that default to a random arena
  const isRandomDefaultMode = (rt: RoomType | null) =>
    rt === 'tournament-ai' || rt === 'royale-ai';

  useEffect(() => {
    const go = settings?.beybladeId ?? '';
    const ga = settings?.arenaId ?? '';
    if (go) setSelectedBey(go);
    if (ga) setSelectedArena(ga);
  }, [settings]);

  useEffect(() => {
    // Fallback options — always present regardless of Firestore state.
    const fallbackBeyOptions: SimpleOption[] = FALLBACK_BEYS.map(b => ({
      id: b.id, name: b.name, isDefault: b.id === DEFAULT_BEYBLADE_ID,
    }));
    const fallbackArenaOptions: SimpleOption[] = FALLBACK_ARENAS.map(a => ({
      id: a.id, name: a.name,
    }));

    // Show fallbacks immediately — page is usable without Firebase.
    setBeyblades(fallbackBeyOptions);
    setArenas([{ id: 'random', name: '🎲 Random Arena' }, ...fallbackArenaOptions]);
    setLoading(false);

    // Fetch Firestore in background; merge results when ready.
    Promise.all([
      getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
      getDocs(collection(db, COLLECTIONS.ARENAS)),
    ]).then(([beySnap, arenaSnap]) => {
      const firestoreBeys = beySnap.docs.map(d => ({ id: d.id, name: (d.data().displayName as string) || d.id, isDefault: !!(d.data().isDefault) }));
      const firestoreArns = arenaSnap.docs.map(d => ({ id: d.id, name: (d.data().name as string) || d.id }));

      // Always keep fallbacks at top; skip any Firestore doc whose id matches a fallback.
      const firestoreBeyIds  = new Set(firestoreBeys.map(b => b.id));
      const firestoreArnIds  = new Set(firestoreArns.map(a => a.id));
      const uniqueFallbackBeys = fallbackBeyOptions.filter(b => !firestoreBeyIds.has(b.id));
      const uniqueFallbackArns = fallbackArenaOptions.filter(a => !firestoreArnIds.has(a.id));

      const allBeys = [...uniqueFallbackBeys, ...firestoreBeys];
      const allArns = [...uniqueFallbackArns, ...firestoreArns];

      setBeyblades(allBeys);
      setArenas([{ id: 'random', name: '🎲 Random Arena' }, ...allArns]);

      // Bey: prefer saved preference → isDefault flag → storm_pegasus → first in list
      if (!settings?.beybladeId) {
        const defaultBey = allBeys.find(b => b.isDefault) ?? allBeys.find(b => b.id === DEFAULT_BEYBLADE_ID) ?? allBeys[0];
        if (defaultBey) setSelectedBey(defaultBey.id);
      } else {
        setSelectedBey(settings.beybladeId);
      }

      // Arena: prefer saved preference → default_black_arena → first
      if (!settings?.arenaId) {
        setSelectedArena(DEFAULT_ARENA_ID);
      } else {
        setSelectedArena(settings.arenaId);
      }
    }).catch(() => {
      // Firebase failed — fallbacks already set above, nothing more to do.
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDrawer = useCallback((roomType: RoomType) => {
    // Reset arena to random when opening tournament/royale drawers
    if (isRandomDefaultMode(roomType) && selectedArena !== 'random') {
      setSelectedArena('random');
    }
    setDrawer({ open: true, roomType });
  }, [selectedArena]);

  const launchGame = useCallback(() => {
    if (!drawer.roomType) return;
    if (!selectedBey || !selectedArena) {
      toast.error('Please select a beyblade and arena');
      return;
    }
    const rt = drawer.roomType;
    const config: GameRoomConfig = {
      roomType: rt,
      beybladeId: selectedBey,
      arenaId: selectedArena,
      aiDifficulty: (rt === 'pvai' || rt === 'tournament-ai' || rt === 'royale-ai') ? difficulty : undefined,
      aiCount: rt === 'tournament-ai' ? aiCountTournament
        : rt === 'royale-ai' ? aiCountRoyale
        : undefined,
      bestOf,
    };
    setDrawer({ open: false, roomType: null });
    navigate('/game/room', { state: { config } });
  }, [drawer, selectedBey, selectedArena, difficulty, bestOf, aiCountTournament, aiCountRoyale, navigate]);

  // Restore last-viewed card index from localStorage
  const initialCardIndex = (() => {
    try { const v = localStorage.getItem('bey.lastBattleCard'); return v !== null ? parseInt(v, 10) : 0; } catch { return 0; }
  })();

  const saveCardIndex = useCallback((index: number) => {
    try { localStorage.setItem('bey.lastBattleCard', String(index)); } catch { /* ignore */ }
  }, []);

  const cards: CarouselCard[] = [
    {
      id: 'tryout',
      title: 'Tryout',
      subtitle: 'Solo Practice',
      description: 'Practice solo with no pressure. Master your launch technique and experiment with arenas.',
      gradient: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)',
      icon: '🎯',
      onSelect: () => openDrawer('tryout'),
    },
    {
      id: 'pvai',
      title: 'vs AI',
      subtitle: 'Player vs AI',
      description: 'Battle an AI opponent locally — no server required. Choose difficulty: Medium, Hard, or Hell.',
      gradient: 'linear-gradient(135deg, #1c1917 0%, #44403c 50%, #1c1917 100%)',
      icon: '🤖',
      onSelect: () => openDrawer('pvai'),
    },
    {
      id: 'tournament',
      title: 'Tournament',
      subtitle: 'Bracket Competition',
      description: 'Fight through a bracket. Create a private tournament with friends or go offline vs AI bots.',
      gradient: 'linear-gradient(135deg, #451a03 0%, #b45309 50%, #451a03 100%)',
      icon: '🏆',
      onSelect: () => openDrawer('tournament-ai'),
    },
    {
      id: 'royale',
      title: 'Battle Royale',
      subtitle: 'Free-for-All',
      description: 'Last bey spinning wins. Fight online with 12 players or launch a local AI free-for-all.',
      gradient: 'linear-gradient(135deg, #4a044e 0%, #9d174d 50%, #4a044e 100%)',
      icon: '💥',
      onSelect: () => openDrawer('royale-ai'),
    },
  ];

  // ─── Drawer title & label helpers ─────────────────────────────────────────
  const drawerTitle = () => {
    switch (drawer.roomType) {
      case 'tryout':       return 'Tryout Setup';
      case 'pvai':         return 'PvAI Setup';
      case 'tournament-ai': return 'AI Tournament Setup';
      case 'royale-ai':    return 'AI Royale Setup';
      default:             return 'Battle Setup';
    }
  };

  const showBotCount = drawer.roomType === 'tournament-ai' || drawer.roomType === 'royale-ai';
  const showDifficulty = drawer.roomType === 'pvai' || drawer.roomType === 'tournament-ai' || drawer.roomType === 'royale-ai';
  const showBestOf = drawer.roomType === 'pvai' || drawer.roomType === 'tournament-ai';

  const isTournamentDrawer = drawer.roomType === 'tournament-ai';
  const botCountLabel = isTournamentDrawer ? 'Rounds (opponents)' : 'AI Bots (players)';
  const botMin = isTournamentDrawer ? 1 : 2;
  const botMax = isTournamentDrawer ? 7 : 11;
  const currentBotCount = isTournamentDrawer ? aiCountTournament : aiCountRoyale;
  const setBotCount = isTournamentDrawer ? setAiCountTournament : setAiCountRoyale;

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
      paddingTop: 'clamp(12px,3vmin,52px)',
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

      <div style={{ textAlign: 'center', marginBottom: 'clamp(6px,1.5vmin,24px)', flexShrink: 0 }}>
        <h1 style={{
          fontSize: 'clamp(18px, 4vw, 32px)', fontWeight: 900, color: '#fff',
          letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0,
        }}>
          BATTLE MODE
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '6px', letterSpacing: '0.05em' }}>
          Use ← → or scroll to browse · Press ENTER or tap to select
        </p>
      </div>

      <div style={{ width: '100%', height: 'min(440px, calc(100dvh - 15vmin))', flexShrink: 0 }}>
        <CardCarousel cards={cards} initialIndex={initialCardIndex} onIndexChange={saveCardIndex} />
      </div>

      {/* Quick-setup drawer */}
      {drawer.open && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={e => { if (e.target === e.currentTarget) setDrawer({ open: false, roomType: null }); }}
        >
          <div style={{
            background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px 20px 0 0', padding: '28px 24px 40px',
            width: '100%', maxWidth: 'min(480px, 92vw)',
            animation: 'slideUp 200ms ease',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {drawerTitle()}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '20px' }}>
                Loading…
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Beyblade
                  </label>
                  <select
                    value={selectedBey}
                    onChange={e => setSelectedBey(e.target.value)}
                    style={{
                      width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', borderRadius: '10px', padding: '10px 12px',
                      fontSize: '14px', outline: 'none', cursor: 'pointer',
                    }}
                  >
                    {beyblades.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Arena
                  </label>
                  <select
                    value={selectedArena}
                    onChange={e => setSelectedArena(e.target.value)}
                    style={{
                      width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', borderRadius: '10px', padding: '10px 12px',
                      fontSize: '14px', outline: 'none', cursor: 'pointer',
                    }}
                  >
                    {arenas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>

                {/* Bot count selector */}
                {showBotCount && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      {botCountLabel}: <span style={{ color: '#fff' }}>{currentBotCount}</span>
                      {isTournamentDrawer && (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginLeft: 6 }}>
                          ({Math.pow(2, currentBotCount)}-player bracket)
                        </span>
                      )}
                      {!isTournamentDrawer && (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginLeft: 6 }}>
                          ({currentBotCount + 1} total players)
                        </span>
                      )}
                    </label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {Array.from({ length: botMax - botMin + 1 }, (_, i) => i + botMin).map(n => (
                        <button
                          key={n}
                          onClick={() => setBotCount(n)}
                          style={{
                            flex: '1 1 auto', minWidth: 36, padding: '8px 0',
                            background: currentBotCount === n ? 'rgba(34,136,255,0.2)' : '#1e293b',
                            border: `1px solid ${currentBotCount === n ? '#2288ff' : 'rgba(255,255,255,0.1)'}`,
                            color: currentBotCount === n ? '#60a5fa' : 'rgba(255,255,255,0.5)',
                            borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                            transition: 'all 150ms',
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Difficulty */}
                {showDifficulty && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      AI Difficulty
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map(d => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          style={{
                            flex: 1, padding: '10px 0',
                            background: difficulty === d ? `${DIFFICULTY_LABELS[d].color}22` : '#1e293b',
                            border: `1px solid ${difficulty === d ? DIFFICULTY_LABELS[d].color : 'rgba(255,255,255,0.1)'}`,
                            color: difficulty === d ? DIFFICULTY_LABELS[d].color : 'rgba(255,255,255,0.5)',
                            borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                            letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 150ms',
                          }}
                        >
                          {DIFFICULTY_LABELS[d].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best-of format */}
                {showBestOf && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Series Format
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {([1, 3, 5] as const).map(n => (
                        <button
                          key={n}
                          onClick={() => setBestOf(n)}
                          style={{
                            flex: 1, padding: '10px 0',
                            background: bestOf === n ? 'rgba(99,102,241,0.2)' : '#1e293b',
                            border: `1px solid ${bestOf === n ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                            color: bestOf === n ? '#818cf8' : 'rgba(255,255,255,0.5)',
                            borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                            transition: 'all 150ms',
                          }}
                        >
                          BO{n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={launchGame}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', borderRadius: '12px',
                    color: '#fff', fontSize: '15px', fontWeight: 800,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'transform 100ms',
                  }}
                >
                  LET IT RIP!
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

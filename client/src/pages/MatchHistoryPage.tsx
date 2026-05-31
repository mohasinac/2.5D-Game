import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

type FilterPill = 'all' | 'wins' | 'losses' | 'tournament' | 'royale';

interface MatchRecord {
  id: string;
  mode?: string;
  opponentName?: string;
  opponentNames?: string[];
  result?: 'win' | 'loss' | 'draw';
  score?: string;
  playerIds?: string[];
  seriesFormat?: string;
  createdAt?: { seconds: number };
  replayId?: string;
  gameResults?: unknown[];
}

const PILL_LABELS: Record<FilterPill, string> = {
  all: 'All', wins: 'Wins', losses: 'Losses', tournament: 'Tournament', royale: 'Royale',
};

export default function MatchHistoryPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterPill>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    async function load() {
      setLoading(true);
      try {
        const q = query(
          collection(db, COLLECTIONS.MATCHES),
          where('playerIds', 'array-contains', currentUser!.uid),
          orderBy('createdAt', 'desc'),
          limit(50),
        );
        const snap = await getDocs(q);
        setMatches(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<MatchRecord, 'id'>) })));
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [currentUser]);

  const filtered = matches.filter(m => {
    if (filter === 'wins') return m.result === 'win';
    if (filter === 'losses') return m.result === 'loss';
    if (filter === 'tournament') return m.mode?.toLowerCase().includes('tournament');
    if (filter === 'royale') return m.mode?.toLowerCase().includes('royale');
    return true;
  });

  function resultColor(r?: string) {
    if (r === 'win') return '#44ff88';
    if (r === 'loss') return '#ff4444';
    return '#888';
  }

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh', background: '#0a0a0f', color: '#fff',
    padding: '24px 16px', fontFamily: 'inherit',
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 'min(560px, 92vw)', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', marginBottom: 20, padding: 0 }}>← Back</button>
        <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>Match History</h1>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {(Object.keys(PILL_LABELS) as FilterPill[]).map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              style={{
                padding: '6px 14px', borderRadius: 20,
                background: filter === p ? '#00e5ff22' : 'rgba(255,255,255,0.06)',
                border: filter === p ? '1px solid #00e5ff88' : '1px solid rgba(255,255,255,0.1)',
                color: filter === p ? '#00e5ff' : 'rgba(255,255,255,0.6)',
                fontSize: 13, cursor: 'pointer', fontWeight: filter === p ? 700 : 400,
              }}
            >
              {PILL_LABELS[p]}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 60, color: 'rgba(255,255,255,0.3)' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60, color: 'rgba(255,255,255,0.3)' }}>No matches found.</div>
        ) : (
          filtered.map(m => (
            <div key={m.id} style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
              <div
                onClick={() => setExpanded(prev => prev === m.id ? null : m.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }}
              >
                <span style={{ width: 40, fontWeight: 700, fontSize: 14, color: resultColor(m.result), textTransform: 'uppercase', flexShrink: 0 }}>{m.result ?? '—'}</span>
                <span style={{ flex: 1, fontSize: 14, color: '#fff' }}>
                  {m.opponentName ? `vs ${m.opponentName}` : m.mode ?? 'Match'}
                </span>
                {m.score && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{m.score}</span>}
                {m.createdAt && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{new Date(m.createdAt.seconds * 1000).toLocaleDateString()}</span>}
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>{expanded === m.id ? '▲' : '▼'}</span>
              </div>
              {expanded === m.id && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ marginBottom: 6 }}>Mode: <span style={{ color: '#fff' }}>{m.mode ?? 'PvP'}</span></div>
                  {m.seriesFormat && <div style={{ marginBottom: 6 }}>Format: <span style={{ color: '#fff' }}>{m.seriesFormat}</span></div>}
                  {(m.gameResults as unknown[])?.length > 0 && (
                    <div style={{ marginBottom: 6 }}>Games: <span style={{ color: '#fff' }}>{(m.gameResults as unknown[]).length}</span></div>
                  )}
                  {m.replayId && (
                    <button
                      onClick={() => navigate(`/game/replay/${m.replayId}`)}
                      style={{ marginTop: 8, padding: '6px 14px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: 8, color: '#00e5ff', fontSize: 13, cursor: 'pointer' }}
                    >
                      Watch Replay
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

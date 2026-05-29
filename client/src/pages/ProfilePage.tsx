import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface PlayerStats {
  username?: string;
  matchesPlayed?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  totalDamageDealt?: number;
  tournamentPoints?: number;
  rank?: string;
}

interface MatchRecord {
  id: string;
  mode?: string;
  opponentName?: string;
  result?: 'win' | 'loss' | 'draw';
  score?: string;
  createdAt?: { seconds: number };
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const targetId = userId ?? currentUser?.uid ?? '';
  const isOwn = !userId || userId === currentUser?.uid;

  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!targetId) return;
    async function load() {
      setLoading(true);
      try {
        const [statsSnap, userSnap] = await Promise.all([
          getDoc(doc(db, COLLECTIONS.PLAYER_STATS, targetId)),
          getDoc(doc(db, COLLECTIONS.USERS, targetId)),
        ]);
        if (statsSnap.exists()) setStats(statsSnap.data() as PlayerStats);
        if (userSnap.exists()) setUsername((userSnap.data() as { username?: string }).username ?? '');
        const mq = query(
          collection(db, COLLECTIONS.MATCHES),
          where('playerIds', 'array-contains', targetId),
          orderBy('createdAt', 'desc'),
          limit(5),
        );
        const mSnap = await getDocs(mq);
        setMatches(mSnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<MatchRecord, 'id'>) })));
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [targetId]);

  const wins = stats?.wins ?? 0;
  const losses = stats?.losses ?? 0;
  const draws = stats?.draws ?? 0;
  const total = stats?.matchesPlayed ?? wins + losses + draws;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  function resultColor(r?: string) {
    if (r === 'win') return '#44ff88';
    if (r === 'loss') return '#ff4444';
    return '#888';
  }

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh', background: '#0a0a0f', color: '#fff',
    padding: '24px 16px', fontFamily: 'inherit',
  };
  const cardStyle: React.CSSProperties = {
    background: '#111120', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '20px 24px', marginBottom: 16,
  };

  if (loading) return <div style={pageStyle}><div style={{ textAlign: 'center', paddingTop: 80, color: 'rgba(255,255,255,0.4)' }}>Loading profile…</div></div>;

  const displayName = username || stats?.username || (isOwn ? currentUser?.displayName : null) || 'Player';

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', marginBottom: 20, padding: 0 }}>← Back</button>

        {/* Header card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#00e5ff,#aa44ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
              {displayName[0]?.toUpperCase() ?? '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{displayName}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                Win Rate: <span style={{ color: '#44ff88', fontWeight: 700 }}>{winRate}%</span>
                &nbsp;·&nbsp;Points: <span style={{ color: '#ffcc44', fontWeight: 700 }}>{stats?.tournamentPoints ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
          {[['Matches', total], ['Wins', wins], ['Losses', losses], ['Draws', draws]].map(([l, v]) => (
            <div key={l as string}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{v}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Damage stat */}
        {(stats?.totalDamageDealt ?? 0) > 0 && (
          <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Total Damage Dealt</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#ff8844' }}>{(stats?.totalDamageDealt ?? 0).toLocaleString()}</span>
          </div>
        )}

        {/* Recent matches */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Recent Matches</div>
          {matches.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No matches yet.</div>
          ) : (
            matches.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ width: 40, fontWeight: 700, fontSize: 13, color: resultColor(m.result), textTransform: 'uppercase' }}>{m.result ?? '—'}</span>
                <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  {m.opponentName ? `vs ${m.opponentName}` : m.mode ?? 'Match'}
                </span>
                {m.score && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{m.score}</span>}
                {m.createdAt && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{new Date(m.createdAt.seconds * 1000).toLocaleDateString()}</span>}
              </div>
            ))
          )}
          {matches.length > 0 && (
            <button onClick={() => navigate('/game/history')} style={{ marginTop: 12, background: 'none', border: 'none', color: '#00e5ff', fontSize: 13, cursor: 'pointer', padding: 0 }}>View Full History →</button>
          )}
        </div>

        {isOwn && (
          <button style={{ width: '100%', padding: '12px 0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer' }}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

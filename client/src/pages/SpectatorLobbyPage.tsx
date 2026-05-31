import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface RoomEntry {
  id: string;
  roomType?: string;
  playerNames?: string[];
  beyNames?: string[];
  spectatorCount?: number;
  status?: string;
  elapsedMs?: number;
  colyseusRoomId?: string;
}

export default function SpectatorLobbyPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'matches'),
          where('status', '==', 'in-progress'),
          orderBy('createdAt', 'desc'),
          limit(20),
        );
        const snap = await getDocs(q);
        setRooms(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<RoomEntry, 'id'>) })));
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  function formatElapsed(ms?: number) {
    if (!ms) return '0:00';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function modeIcon(type?: string) {
    if (type?.includes('royale')) return '👑';
    if (type?.includes('tournament')) return '🏆';
    return '⚔';
  }

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh', background: '#0a0a0f', color: '#fff',
    padding: '24px 16px', fontFamily: 'inherit',
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 'min(600px, 92vw)', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', marginBottom: 20, padding: 0 }}>← Back</button>
        <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Spectate</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Watch live matches in progress.</p>

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 60, color: 'rgba(255,255,255,0.3)' }}>Loading rooms…</div>
        ) : rooms.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60, color: 'rgba(255,255,255,0.3)', background: '#111120', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎮</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>No live matches right now.</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Check back when players are competing.</div>
          </div>
        ) : (
          rooms.map(room => (
            <div key={room.id} style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{modeIcon(room.roomType)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                  {room.playerNames?.join(' vs ') ?? 'Unknown Players'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  {room.beyNames?.join(' · ')} · {formatElapsed(room.elapsedMs)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                {(room.spectatorCount ?? 0) > 0 && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>👁 {room.spectatorCount}</span>
                )}
                <button
                  onClick={() => {
                    if (room.colyseusRoomId) {
                      navigate(`/game/room?spectate=true&roomId=${room.colyseusRoomId}`);
                    }
                  }}
                  disabled={!room.colyseusRoomId}
                  style={{
                    padding: '6px 16px', background: 'rgba(0,229,255,0.1)',
                    border: '1px solid rgba(0,229,255,0.4)', borderRadius: 8,
                    color: '#00e5ff', fontSize: 13, cursor: room.colyseusRoomId ? 'pointer' : 'not-allowed',
                    opacity: room.colyseusRoomId ? 1 : 0.4,
                  }}
                >
                  Watch
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

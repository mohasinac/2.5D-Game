import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PauseMenuProps {
  onResume: () => void;
  onForfeit?: () => void;
  isLocal?: boolean;
}

function VolumeSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{Math.round(value)}%</span>
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: '#00e5ff', cursor: 'pointer' }}
      />
    </div>
  );
}

export function PauseMenu({ onResume, onForfeit, isLocal = false }: PauseMenuProps) {
  const navigate = useNavigate();
  const [master, setMaster] = useState(() => { try { return parseInt(localStorage.getItem('bey.vol.master') ?? '80'); } catch { return 80; } });
  const [sfx, setSfx] = useState(() => { try { return parseInt(localStorage.getItem('bey.vol.sfx') ?? '60'); } catch { return 60; } });
  const [music, setMusic] = useState(() => { try { return parseInt(localStorage.getItem('bey.vol.music') ?? '40'); } catch { return 40; } });
  const [screenShake, setScreenShake] = useState(() => { try { return localStorage.getItem('bey.screenShake') !== 'false'; } catch { return true; } });
  const [particles, setParticles] = useState(() => { try { return localStorage.getItem('bey.particles') !== 'false'; } catch { return true; } });
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);

  function saveVol(key: string, v: number) {
    try { localStorage.setItem(key, String(v)); } catch { /* ignore */ }
  }

  function handleForfeit() {
    if (onForfeit) onForfeit();
    navigate('/game/battle', { replace: true });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 28, width: 300, maxWidth: '90vw' }}>
        <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: 20 }}>Paused</div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: 16 }} />

        <VolumeSlider label="Master" value={master} onChange={v => { setMaster(v); saveVol('bey.vol.master', v); }} />
        <VolumeSlider label="SFX" value={sfx} onChange={v => { setSfx(v); saveVol('bey.vol.sfx', v); }} />
        <VolumeSlider label="Music" value={music} onChange={v => { setMusic(v); saveVol('bey.vol.music', v); }} />

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0' }} />

        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, cursor: 'pointer' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Screen Shake</span>
          <input type="checkbox" checked={screenShake} onChange={e => { setScreenShake(e.target.checked); try { localStorage.setItem('bey.screenShake', e.target.checked ? 'true' : 'false'); } catch { /* ignore */ } }} />
        </label>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, cursor: 'pointer' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Particles</span>
          <input type="checkbox" checked={particles} onChange={e => { setParticles(e.target.checked); try { localStorage.setItem('bey.particles', e.target.checked ? 'true' : 'false'); } catch { /* ignore */ } }} />
        </label>

        <button
          onClick={onResume}
          style={{ width: '100%', padding: '12px 0', background: 'linear-gradient(135deg,#00e5ff22,#00e5ff44)', border: '1px solid #00e5ff88', borderRadius: 10, color: '#00e5ff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          ▶ Resume
        </button>

        {!showForfeitConfirm ? (
          <button
            onClick={() => setShowForfeitConfirm(true)}
            style={{ width: '100%', padding: '10px 0', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, color: '#ff4444', fontSize: 14, cursor: 'pointer' }}
          >
            ✕ Forfeit & Leave
          </button>
        ) : (
          <div style={{ border: '1px solid rgba(255,68,68,0.3)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
              {isLocal ? 'Leave match?' : 'Leave match? Opponent wins.'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowForfeitConfirm(false)} style={{ flex: 1, padding: '8px 0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleForfeit} style={{ flex: 1, padding: '8px 0', background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.4)', borderRadius: 8, color: '#ff4444', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>Leave</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

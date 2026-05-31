// GameRoomPage — unified game room for all local room types.
// Config comes from location.state.config (GameRoomConfig).
// All rooms run via LocalGameSimulation — no server required.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useGameInput } from '../game/hooks/useGameInput';
import { usePixiRenderer } from '../game/hooks/usePixiRenderer';
import { useLaunchInput } from '../game/hooks/useLaunchInput';
import { useBitBeastCinematic } from '../hooks/useBitBeastCinematic';
import { useCombos } from '../hooks/useCombos';
import { useSpecialMoves } from '../hooks/useSpecialMoves';
import { mapToRecord } from '../types/game';
import type { ServerGameState } from '../types/game';
import type { GameRoomConfig } from '../types/gameRoom';
import { LocalGameSimulation, type SimSnapshot } from '../game/simulation/LocalGameSimulation';
import { useConfigStore } from '../lib/configCache';

import { GameShell } from '../components/game/GameShell';
import { PlayerStrip } from '../components/game/PlayerStrip';
import { OpponentStrip } from '../components/game/OpponentStrip';
import { PauseMenu } from '../components/game/PauseMenu';
import { LoadingProgress } from '../components/LoadingProgress';
import { Countdown } from '../components/game/Countdown';
import { LaunchPhase } from '../components/game/LaunchPhase';
import { SpecialMoveHUD } from '../components/game/SpecialMoveHUD';
import { ComboHUD } from '../components/game/ComboHUD';
import KOOverlay from '../components/game/KOOverlay';
import VictoryOverlay from '../components/game/VictoryOverlay';
import BurstOverlay from '../components/game/BurstOverlay';
import LaunchCinematic from '../components/game/LaunchCinematic';
import { BitBeastCinematic } from '../components/game/BitBeastCinematic';
import { RoyaleHUD } from '../components/game/RoyaleHUD';
import { SafeZoneOverlay } from '../components/game/SafeZoneOverlay';
import { ZoneDangerMeter } from '../components/game/ZoneDangerMeter';
import { LAUNCH_DURATION_S } from '../shared/constants/gameConstants';

// ─── HUD bar component ────────────────────────────────────────────────────────
function HudBar({ label, value, max, pct, color }: {
  label: string; value: number; max: number; pct: number; color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 0.6vmin, 8px)' }}>
      <span style={{ fontSize: 'clamp(7px, 0.9vmin, 11px)', fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', width: 'clamp(14px, 1.8vmin, 22px)', textAlign: 'right', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 'clamp(4px, 0.6vmin, 8px)', background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.round(pct * 100)}%`, background: color, borderRadius: 3, transition: 'width 150ms' }} />
      </div>
      <span style={{ fontSize: 'clamp(7px, 0.9vmin, 11px)', fontWeight: 700, color: 'rgba(255,255,255,0.6)', width: 'clamp(26px, 3.2vmin, 40px)', textAlign: 'left', flexShrink: 0 }}>
        {value}<span style={{ fontSize: 'clamp(6px, 0.8vmin, 10px)', color: 'rgba(255,255,255,0.35)' }}>/{max}</span>
      </span>
    </div>
  );
}

// ─── Default game state (before anything loads) ───────────────────────────────
const DEFAULT_GAME_STATE: ServerGameState = {
  matchId: 'default', mode: 'tryout', status: 'waiting',
  timer: 0, startTime: 0, winner: '', beyblades: new Map(),
  arena: {
    id: 'default', name: 'Arena', width: 1080, height: 1080,
    shape: 'circle', theme: 'default', rotation: 0,
    wallEnabled: true, wallAngle: 0,
    worldBgType: 'none', worldBgColor: '', worldBgImageUrl: '',
    worldBgOpacity: 1, worldBgFit: 'cover', worldBgBlurPx: 0,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function GameRoomPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = (location.state as { config?: GameRoomConfig })?.config;
  const { settings } = useGame();
  const { configStatus } = useConfigStore();

  // Redirect if no config provided
  useEffect(() => {
    if (!config) navigate('/game/battle', { replace: true });
  }, [config, navigate]);

  // Global input focus
  useEffect(() => { document.body.focus(); }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<LocalGameSimulation | null>(null);

  // ─── Local simulation state ────────────────────────────────────────────────
  const [simSnap, setSimSnap] = useState<SimSnapshot | null>(null);

  // ─── Overlays state ───────────────────────────────────────────────────────
  const [burstVisible, setBurstVisible] = useState(false);
  const [koVisible, setKoVisible] = useState<{ visible: boolean; type: 'ko' | 'ring_out' | 'outspin' }>({ visible: false, type: 'ko' });
  const [victoryVisible, setVictoryVisible] = useState(false);
  const [lastSpecialMove, setLastSpecialMove] = useState<string | null>(null);
  const [lastCombo, setLastCombo] = useState<{ name: string; timestamp: number } | null>(null);
  const [paused, setPaused] = useState(false);
  const [showPostMatch, setShowPostMatch] = useState(false);
  const postMatchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bitBeastCinematic = useBitBeastCinematic(config?.beybladeId ?? null);
  const { byId: comboMap } = useCombos();
  const { resolve: resolveSpecialMove } = useSpecialMoves();

  // ─── Resolve active game state ────────────────────────────────────────────
  const gameState: ServerGameState = simSnap?.gameState ?? DEFAULT_GAME_STATE;
  const beyblades = simSnap?.beyblades ?? new Map();
  const myBeyblade = simSnap ? beyblades.get(simSnap.myBeyId) : undefined;

  // Refs for RAF loop
  const gameStateRef = useRef(gameState);
  const beybladesRef = useRef(beyblades);
  gameStateRef.current = gameState;
  beybladesRef.current = beyblades;

  const loadingStep = simSnap?.status === 'idle' || simSnap?.status === 'loading' ? 'connecting-ws' : 'warmup-ready';
  const loadingError = simSnap?.loadingError ?? undefined;
  const effectiveLoadingStep = configStatus !== 'ready' ? 'config-preload' : (loadingStep ?? 'connecting-ws');
  const showLoading = (configStatus !== 'ready' || loadingStep !== 'warmup-ready') && gameState.status === 'waiting';

  // ─── Renderer ─────────────────────────────────────────────────────────────
  const { render, setControlledBeyblade, cameraZoomIn, cameraZoomOut, cameraZoomReset, triggerScreenShake, triggerHitFlash } = usePixiRenderer(containerRef);

  useEffect(() => {
    if (myBeyblade?.id) setControlledBeyblade(myBeyblade.id);
  }, [myBeyblade?.id, setControlledBeyblade]);

  // ─── Input ────────────────────────────────────────────────────────────────
  const localSendInput = useCallback((input: import('../game/hooks/useGameInput').FullGameInput) => {
    simRef.current?.applyInput(input);
  }, []);

  useGameInput(localSendInput, gameState.status === 'in-progress');

  // ─── Launch input (local sim) ─────────────────────────────────────────────
  const launcherType = config?.launcherType ?? 'string';
  const launchState = useLaunchInput(null, gameState.status, launcherType);

  // ─── RAF render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      render(gameStateRef.current, beybladesRef.current, undefined);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);

  // ─── Start local simulation ───────────────────────────────────────────────
  useEffect(() => {
    if (!config) return;
    const sim = new LocalGameSimulation(config, snap => setSimSnap(snap), (event) => {
      if (event.type === 'collision') {
        const mag = Math.min(8, 2 + event.relativeSpeed * 0.5);
        triggerScreenShake(mag, 200);
        triggerHitFlash(event.beyId);
        triggerHitFlash(event.otherBeyId);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(30);
      } else if (event.type === 'burst') {
        triggerScreenShake(8, 300);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(120);
      }
    });
    simRef.current = sim;
    sim.start();
    return () => sim.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Victory detection ────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState.status === 'finished' || gameState.status === 'series-finished') {
      if (gameState.winner) setVictoryVisible(true);
      setShowPostMatch(true);
      postMatchTimerRef.current = setTimeout(() => navigate('/game/battle', { replace: true }), 30_000);
    }
    return () => { if (postMatchTimerRef.current) clearTimeout(postMatchTimerRef.current); };
  }, [gameState.status, gameState.winner, navigate]);

  // ─── Keyboard pause toggle (Escape) ──────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPaused(prev => {
          const next = !prev;
          if (next) simRef.current?.pause(); else simRef.current?.resume();
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleExit = useCallback(() => {
    simRef.current?.stop();
    navigate('/game/battle', { replace: true });
  }, [navigate]);

  // Tournament bracket info from local sim
  const tournamentBracket = simSnap?.tournamentBracket;

  if (!config) return null;

  // Winner info for victory overlay
  const winnerBey = beyblades.get(gameState.winner ?? '') ?? [...beyblades.values()].find(b => b.userId === gameState.winner);
  const winnerName = winnerBey?.username ?? gameState.winner ?? '';
  const winnerType = winnerBey?.type ?? 'balanced';

  // SpecialMove data for HUD
  const specialMoveData = myBeyblade
    ? (() => {
        const move = resolveSpecialMove((myBeyblade as unknown as Record<string, string>)['specialMoveId'] ?? myBeyblade.specialMove ?? '');
        if (!move) return null;
        return {
          id: move.id,
          name: move.name,
          iconEmoji: move.iconEmoji,
          visual: { screenFlashColor: move.visual?.screenFlashColor },
        };
      })()
    : null;

  return (
    <GameShell
      show25DRotate={true}
      onExit={handleExit}
      onZoomIn={cameraZoomIn}
      onZoomOut={cameraZoomOut}
      onZoomReset={cameraZoomReset}
    >
      {/* Canvas container */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0, background: '#000' }}
      />

      {/* In-game overlay layer */}
      <div className="game-overlay-layer">

        {/* Loading */}
        {showLoading && (
          <LoadingProgress
            currentStep={effectiveLoadingStep as import('../components/LoadingProgress').LoadingStep}
            error={loadingError}
            onRetry={() => {
              if (config) {
                simRef.current?.stop();
                const sim = new LocalGameSimulation(config, snap => setSimSnap(snap));
                simRef.current = sim;
                sim.start();
              }
            }}
          />
        )}

        {/* Countdown */}
        {!showLoading && (
          <Countdown
            status={gameState.status}
            timer={gameState.timer}
          />
        )}

        {/* Launch phase */}
        {gameState.status === 'launching' && (
          <LaunchPhase
            launchTimer={gameState.launchTimer ?? (simSnap?.launchTimer ?? LAUNCH_DURATION_S)}
            launchTilt={simSnap?.launchTilt ?? 0}
            launchPosition={simSnap?.launchPosition ?? 0.5}
            launchPower={simSnap?.launchPower ?? 0}
            chargingStarted={(simSnap?.launchPower ?? 0) > 0}
            launched={false}
            failed={myBeyblade ? !!(myBeyblade as unknown as Record<string, boolean>)['launchFailed'] : false}
            myBeyId={myBeyblade?.id}
            beyblades={beyblades}
            arena={gameState.arena}
            launcherType={launcherType}
          />
        )}

        {/* KO */}
        <KOOverlay
          visible={koVisible.visible}
          type={koVisible.type}
          onComplete={() => setKoVisible(v => ({ ...v, visible: false }))}
        />

        {/* Burst */}
        <BurstOverlay
          visible={burstVisible}
          onComplete={() => setBurstVisible(false)}
        />

        {/* Victory */}
        <VictoryOverlay
          visible={victoryVisible}
          winnerName={winnerName}
          winnerType={winnerType}
          onDismiss={() => { setVictoryVisible(false); handleExit(); }}
        />

        {/* BitBeast cinematic */}
        <BitBeastCinematic
          imageUrl={bitBeastCinematic.imageUrl}
          moveName={bitBeastCinematic.moveName}
          visible={bitBeastCinematic.visible}
        />

        {/* Launch cinematic */}
        <LaunchCinematic
          active={gameState.status === 'launching'}
          power={simSnap?.launchPower ?? 0}
        />

        {/* HUD — opponent strips (top) */}
        {gameState.status === 'in-progress' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '6px 8px 0',
            display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end',
            pointerEvents: 'none',
          }}>
            {[...beyblades.values()]
              .filter(b => b.id !== myBeyblade?.id)
              .map(b => (
                <OpponentStrip key={b.id} beyblade={b} compact={beyblades.size > 3} />
              ))}
          </div>
        )}

        {/* HUD — player strip (bottom) */}
        {myBeyblade && gameState.status === 'in-progress' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '0 8px 8px',
            display: 'flex', justifyContent: 'flex-start',
            pointerEvents: 'none',
          }}>
            <PlayerStrip beyblade={myBeyblade} />
          </div>
        )}

        {/* Special Move HUD */}
        {myBeyblade && specialMoveData && gameState.status === 'in-progress' && (
          <SpecialMoveHUD
            myBeyblade={myBeyblade}
            specialMoveData={specialMoveData}
            lastSpecialMoveFired={lastSpecialMove}
          />
        )}

        {/* Combo HUD */}
        {gameState.status === 'in-progress' && (
          <ComboHUD
            lastCombo={lastCombo}
            attachedComboIds={myBeyblade?.comboIds}
            cooldowns={mapToRecord(myBeyblade?.comboCooldowns)}
            power={myBeyblade?.power}
            comboMap={comboMap}
          />
        )}

        {/* Battle Royale HUD */}
        {config?.roomType === 'royale-ai' && gameState.status === 'in-progress' && (
          <RoyaleHUD gameState={gameState} myId={settings.userId ?? 'guest'} />
        )}

        {/* Battle Royale zone overlays */}
        {config?.roomType === 'royale-ai' && gameState.status === 'in-progress' && (
          <SafeZoneOverlay gameState={gameState} myId={settings.userId ?? 'guest'} />
        )}

        {config?.roomType === 'royale-ai' && gameState.status === 'in-progress' && (
          <ZoneDangerMeter gameState={gameState} myId={settings.userId ?? 'guest'} />
        )}

        {/* Tournament-AI bracket badge */}
        {tournamentBracket && (
          <div style={{
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,180,0,0.4)',
            borderRadius: 10, padding: '5px 14px', pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: 10, zIndex: 50,
          }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {tournamentBracket.round === tournamentBracket.totalRounds ? 'FINAL' : `Round ${tournamentBracket.round}`}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 6,
              background: tournamentBracket.opponentDifficulty === 'hell' ? 'rgba(255,42,77,0.25)'
                : tournamentBracket.opponentDifficulty === 'hard' ? 'rgba(239,68,68,0.2)'
                : 'rgba(245,158,11,0.2)',
              color: tournamentBracket.opponentDifficulty === 'hell' ? '#ff2a4d'
                : tournamentBracket.opponentDifficulty === 'hard' ? '#ef4444'
                : '#f59e0b',
              border: `1px solid ${tournamentBracket.opponentDifficulty === 'hell' ? 'rgba(255,42,77,0.4)'
                : tournamentBracket.opponentDifficulty === 'hard' ? 'rgba(239,68,68,0.3)'
                : 'rgba(245,158,11,0.3)'}`,
            }}>
              {tournamentBracket.opponentDifficulty}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: tournamentBracket.totalRounds }).map((_, i) => (
                <span key={i} style={{
                  width: 8, height: 8, borderRadius: '50%', display: 'inline-block',
                  background: i < tournamentBracket.playerWins ? '#22c55e'
                    : i === tournamentBracket.round - 1 ? '#fbbf24'
                    : 'rgba(255,255,255,0.15)',
                }} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Pause menu */}
      {paused && (
        <PauseMenu
          isLocal={true}
          onResume={() => { setPaused(false); simRef.current?.resume(); }}
          onForfeit={() => { simRef.current?.stop(); }}
        />
      )}

      {/* Post-match summary */}
      {showPostMatch && (gameState.status === 'finished' || gameState.status === 'series-finished') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 650, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 28, width: '100%', maxWidth: 420 }}>
            <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {winnerName ? `${winnerName} Wins!` : 'Match Over'}
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Returning to lobby in 30s…</div>

            <div style={{ display: 'grid', gridTemplateColumns: beyblades.size === 1 ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[...beyblades.values()].slice(0, 2).map(b => (
                <div key={b.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: b.id === winnerBey?.id ? '#44ff88' : '#fff', marginBottom: 6, textTransform: 'uppercase' }}>{b.username}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
                    <div>Damage: {Math.round(b.damageDealt ?? 0)}</div>
                    <div>Collisions: {b.collisions ?? 0}</div>
                    <div>Spin end: {b.spin > 0 ? `${Math.round((b.spin / b.maxSpin) * 100)}%` : '0% (out)'}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => { if (postMatchTimerRef.current) clearTimeout(postMatchTimerRef.current); setShowPostMatch(false); }} style={{ padding: '10px 0', background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: 10, color: '#00e5ff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Rematch</button>
              <button onClick={() => { if (postMatchTimerRef.current) clearTimeout(postMatchTimerRef.current); navigate('/game/battle', { replace: true }); }} style={{ padding: '10px 0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, cursor: 'pointer' }}>Back to Modes</button>
            </div>
          </div>
        </div>
      )}
    </GameShell>
  );
}

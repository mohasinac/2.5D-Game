// GameRoomPage — unified game room for all room types.
// Config comes from location.state.config (GameRoomConfig).
// Local rooms (tryout, pvai, story-battle) run via LocalGameSimulation.
// Server rooms (pvp, tournament, royale) connect to Colyseus.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useGameInput } from '../game/hooks/useGameInput';
import { usePixiRenderer } from '../game/hooks/usePixiRenderer';
import { useColyseus } from '../game/hooks/useColyseus';
import { useLaunchInput } from '../game/hooks/useLaunchInput';
import { useBitBeastCinematic } from '../hooks/useBitBeastCinematic';
import { useCombos } from '../hooks/useCombos';
import { useSpecialMoves } from '../hooks/useSpecialMoves';
import { getBeybladeStability, mapToRecord, TYPE_COLORS } from '../types/game';
import type { ServerGameState } from '../types/game';
import { isLocalRoom, COLYSEUS_ROOM_NAME, type GameRoomConfig } from '../types/gameRoom';
import { LocalGameSimulation, type SimSnapshot } from '../game/simulation/LocalGameSimulation';

import { GameShell } from '../components/game/GameShell';
import { LoadingProgress } from '../components/LoadingProgress';
import { Countdown } from '../components/game/Countdown';
import { LaunchPhase } from '../components/game/LaunchPhase';
import { CameraControls } from '../components/game/CameraControls';
import { SpecialMoveHUD } from '../components/game/SpecialMoveHUD';
import { ComboHUD } from '../components/game/ComboHUD';
import KOOverlay from '../components/game/KOOverlay';
import VictoryOverlay from '../components/game/VictoryOverlay';
import BurstOverlay from '../components/game/BurstOverlay';
import LaunchCinematic from '../components/game/LaunchCinematic';
import { BitBeastCinematic } from '../components/game/BitBeastCinematic';
import { QTEOverlay } from '../components/game/QTEOverlay';
import { CollisionQTEOverlay } from '../components/game/CollisionQTEOverlay';
import type { QTEPromptData } from '../game/hooks/useColyseus';

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

  // Redirect if no config provided
  useEffect(() => {
    if (!config) navigate('/game/battle', { replace: true });
  }, [config, navigate]);

  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<LocalGameSimulation | null>(null);
  const local = config ? isLocalRoom(config.roomType) : true;

  // ─── Local simulation state ────────────────────────────────────────────────
  const [simSnap, setSimSnap] = useState<SimSnapshot | null>(null);

  // ─── Overlays state ───────────────────────────────────────────────────────
  const [burstVisible, setBurstVisible] = useState(false);
  const [koVisible, setKoVisible] = useState<{ visible: boolean; type: 'ko' | 'ring_out' | 'outspin' }>({ visible: false, type: 'ko' });
  const [victoryVisible, setVictoryVisible] = useState(false);
  const [qtePrompt, setQTEPrompt] = useState<QTEPromptData | null>(null);
  const [collisionQTEActive, setCollisionQTEActive] = useState(false);
  const [collisionQTEPowerLocal, setCollisionQTEPowerLocal] = useState(0);

  const bitBeastCinematic = useBitBeastCinematic(config?.beybladeId ?? null);
  const { byId: comboMap } = useCombos();
  const { resolve: resolveSpecialMove } = useSpecialMoves();
  const [lastSpecialMove, setLastSpecialMove] = useState<string | null>(null);
  const [lastCombo, setLastCombo] = useState<{ name: string; timestamp: number } | null>(null);

  // ─── Server room (Colyseus) ───────────────────────────────────────────────
  const colyseusOptions = useMemo(() => ({
    beybladeId: config?.beybladeId ?? settings.beybladeId ?? 'default',
    arenaId: config?.arenaId ?? settings.arenaId ?? 'default',
    username: settings.username ?? 'Player',
    userId: settings.userId ?? 'guest',
    spectate: config?.spectate ?? false,
    bestOf: config?.bestOf ?? 1,
    modifierIds: config?.modifierIds ?? [],
  }), [config, settings]);

  const roomName = config && !local
    ? COLYSEUS_ROOM_NAME[config.roomType as keyof typeof COLYSEUS_ROOM_NAME] ?? 'battle_room'
    : 'battle_room';

  const colyseus = useColyseus(
    local ? null : {
      roomName,
      options: colyseusOptions,
      roomId: config?.pvpRoomId,
      onQTEPrompt: (d) => setQTEPrompt(d),
      onQTESuccess: () => setQTEPrompt(null),
      onQTEExpired: () => setQTEPrompt(null),
    },
  );

  // ─── Resolve active game state ────────────────────────────────────────────
  const gameState: ServerGameState = local
    ? (simSnap?.gameState ?? DEFAULT_GAME_STATE)
    : (colyseus?.gameState ?? DEFAULT_GAME_STATE);

  const beyblades = local
    ? (simSnap?.beyblades ?? new Map())
    : (colyseus?.beyblades ?? new Map());

  const myBeyblade = local
    ? (simSnap ? beyblades.get(simSnap.myBeyId) : undefined)
    : colyseus?.myBeyblade;

  const loadingStep = local
    ? (simSnap?.status === 'idle' || simSnap?.status === 'loading' ? 'connecting-ws' : 'warmup-ready')
    : (colyseus?.loadingStep ?? 'connecting-ws');

  const loadingError = local
    ? (simSnap?.loadingError ?? null)
    : (colyseus?.loadingError ?? null);

  const showLoading = loadingStep !== 'warmup-ready' && gameState.status === 'waiting';

  // ─── Renderer ─────────────────────────────────────────────────────────────
  const rendererMode = config?.is25D ? '2.5d' : '2d';
  const { render, setControlledBeyblade, cameraZoomIn, cameraZoomOut, cameraZoomReset, visualEventQueue } = usePixiRenderer(containerRef, rendererMode as '2d' | '2.5d');

  useEffect(() => {
    if (myBeyblade?.id) setControlledBeyblade(myBeyblade.id);
  }, [myBeyblade?.id, setControlledBeyblade]);

  // ─── Input ────────────────────────────────────────────────────────────────
  const sendInput = useCallback((input: Parameters<typeof useGameInput>[0] extends (...args: infer A) => unknown ? never : never) => {}, []);

  const sendInputFn = local
    ? useCallback((input: import('../game/hooks/useGameInput').FullGameInput) => {
        simRef.current?.applyInput(input);
      }, [])
    : (colyseus?.sendInput ?? (() => {}));

  useGameInput(sendInputFn, gameState.status === 'in-progress');

  // ─── Launch input (server rooms) ──────────────────────────────────────────
  const launcherType = config?.launcherType ?? 'string';
  const { launchInput } = useLaunchInput(
    !local && gameState.status === 'launching' ? colyseus?.room ?? null : null,
    launcherType,
    gameState.status === 'launching',
  );

  // ─── RAF render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      render(gameState, beyblades, local ? undefined : (visualEventQueue?.dequeue?.() ?? undefined));
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render, gameState, beyblades]);

  // ─── Start local simulation ───────────────────────────────────────────────
  useEffect(() => {
    if (!local || !config) return;
    const sim = new LocalGameSimulation(config, snap => setSimSnap(snap));
    simRef.current = sim;
    sim.start();
    return () => sim.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Victory / KO detection ───────────────────────────────────────────────
  useEffect(() => {
    if (gameState.status === 'finished' || gameState.status === 'series-finished') {
      if (gameState.winner) setVictoryVisible(true);
    }
  }, [gameState.status, gameState.winner]);

  const handleExit = useCallback(() => {
    if (!local) colyseus?.room?.leave();
    simRef.current?.stop();
    navigate(config?.roomType === 'tournament' ? '/game/2d/tournament' : '/game/battle');
  }, [local, colyseus, navigate, config]);

  if (!config) return null;

  const spinPct = myBeyblade ? Math.round((myBeyblade.spin / myBeyblade.maxSpin) * 100) : 0;
  const stability = myBeyblade ? getBeybladeStability(myBeyblade) : 'stable';
  const typeColor = myBeyblade ? (TYPE_COLORS[myBeyblade.type] ?? '#888') : '#888';

  return (
    <GameShell show25DRotate={config.is25D}>
      {/* Canvas container — fills game-viewport-slot */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0, background: '#000' }}
      />

      {/* In-game overlay layer */}
      <div className="game-overlay-layer">

        {/* Loading */}
        {showLoading && (
          <LoadingProgress
            step={loadingStep as Parameters<typeof LoadingProgress>[0]['step']}
            error={loadingError ?? undefined}
            onRetry={() => {
              if (local && config) {
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
            launchTimer={gameState.launchTimer ?? 5}
          />
        )}

        {/* Launch phase */}
        {gameState.status === 'launching' && !local && (
          <LaunchPhase
            gameState={gameState}
            beyblades={beyblades}
            myBeybladeId={myBeyblade?.id ?? ''}
            launchInput={launchInput}
            launcherType={launcherType}
          />
        )}

        {/* KO */}
        <KOOverlay
          visible={koVisible.visible}
          type={koVisible.type}
          onDone={() => setKoVisible(v => ({ ...v, visible: false }))}
        />

        {/* Burst */}
        <BurstOverlay
          visible={burstVisible}
          onDone={() => setBurstVisible(false)}
        />

        {/* Victory */}
        {victoryVisible && (
          <VictoryOverlay
            winner={gameState.winner}
            beyblades={beyblades}
            onDismiss={() => { setVictoryVisible(false); handleExit(); }}
          />
        )}

        {/* BitBeast cinematic */}
        <BitBeastCinematic
          beybladeId={config.beybladeId}
          text={bitBeastCinematic.text}
          visible={bitBeastCinematic.visible}
          duration={bitBeastCinematic.duration}
          onDone={bitBeastCinematic.onDone}
        />

        {/* Launch cinematic */}
        <LaunchCinematic
          launchInput={launchInput}
          status={gameState.status}
        />

        {/* QTE */}
        {qtePrompt && !local && (
          <QTEOverlay
            prompt={qtePrompt}
            onSuccess={() => { colyseus?.sendQTEInput?.(true); setQTEPrompt(null); }}
            onExpire={() => { colyseus?.sendQTEInput?.(false); setQTEPrompt(null); }}
          />
        )}

        {/* Collision QTE */}
        {collisionQTEActive && !local && (
          <CollisionQTEOverlay
            power={collisionQTEPowerLocal}
            canFireSpecial={false}
            onMash={() => colyseus?.sendCollisionQTEMash?.()}
            onFireSpecial={() => colyseus?.sendCollisionQTEFireSpecial?.()}
          />
        )}

        {/* HUD — spin/health bars */}
        {myBeyblade && gameState.status === 'in-progress' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '8px 12px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            display: 'flex', alignItems: 'flex-end', gap: '8px', pointerEvents: 'none',
          }}>
            {/* Spin bar */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '3px' }}>
                SPIN {spinPct}%
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${spinPct}%`,
                  background: spinPct > 60 ? typeColor : spinPct > 30 ? '#f59e0b' : '#ef4444',
                  borderRadius: '3px', transition: 'width 200ms',
                }} />
              </div>
            </div>

            {/* Camera controls */}
            <CameraControls
              onZoomIn={cameraZoomIn}
              onZoomOut={cameraZoomOut}
              onReset={cameraZoomReset}
            />

            {/* Exit */}
            <button
              onClick={handleExit}
              style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', borderRadius: '8px', padding: '4px 10px',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
                cursor: 'pointer', pointerEvents: 'auto',
              }}
            >
              EXIT
            </button>
          </div>
        )}

        {/* Special Move HUD */}
        {myBeyblade && gameState.status === 'in-progress' && (
          <SpecialMoveHUD
            beyblade={myBeyblade}
            specialMove={resolveSpecialMove(myBeyblade.specialMove ?? '')}
            onLastFired={setLastSpecialMove}
          />
        )}

        {/* Combo HUD */}
        {myBeyblade && gameState.status === 'in-progress' && (
          <ComboHUD
            beyblade={myBeyblade}
            comboMap={comboMap}
            lastCombo={lastCombo}
          />
        )}

      </div>
    </GameShell>
  );
}

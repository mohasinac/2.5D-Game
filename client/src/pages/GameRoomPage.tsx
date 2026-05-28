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
import { LAUNCH_DURATION_S } from '../shared/constants/gameConstants';

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
  const [collisionQTEMultiplier, setCollisionQTEMultiplier] = useState(1);
  const [collisionCanFireSpecial, setCollisionCanFireSpecial] = useState(false);
  const [lastSpecialMove, setLastSpecialMove] = useState<string | null>(null);
  const [lastCombo, setLastCombo] = useState<{ name: string; timestamp: number } | null>(null);

  const bitBeastCinematic = useBitBeastCinematic(config?.beybladeId ?? null);
  const { byId: comboMap } = useCombos();
  const { resolve: resolveSpecialMove } = useSpecialMoves();

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
    ? (COLYSEUS_ROOM_NAME[config.roomType as keyof typeof COLYSEUS_ROOM_NAME] ?? 'battle_room')
    : 'battle_room';

  // Always call useColyseus (hooks must be unconditional); for local rooms autoConnect=false
  const colyseus = useColyseus({
    roomName,
    options: local ? {} : colyseusOptions,
    autoConnect: !local,
    roomId: config?.pvpRoomId,
    onQTEPrompt: (d) => setQTEPrompt(d),
    onQTESuccess: () => setQTEPrompt(null),
    onQTEExpired: () => setQTEPrompt(null),
    onCollisionQTEStart: (_d) => {
      setCollisionQTEActive(true);
      setCollisionQTEPowerLocal(0);
      setCollisionQTEMultiplier(1);
    },
    onCollisionQTESpecialPrompt: (d) => {
      setCollisionCanFireSpecial(true);
      setCollisionQTEMultiplier(d.qteMultiplier);
    },
    onCollisionQTEResult: () => {
      setCollisionQTEActive(false);
      setCollisionCanFireSpecial(false);
    },
  });

  // ─── Resolve active game state ────────────────────────────────────────────
  const gameState: ServerGameState = local
    ? (simSnap?.gameState ?? DEFAULT_GAME_STATE)
    : (colyseus.gameState ?? DEFAULT_GAME_STATE);

  const beyblades = local
    ? (simSnap?.beyblades ?? new Map())
    : (colyseus.beyblades ?? new Map());

  const myBeyblade = local
    ? (simSnap ? beyblades.get(simSnap.myBeyId) : undefined)
    : (colyseus.myBeyblade ?? undefined);

  const loadingStep = local
    ? (simSnap?.status === 'idle' || simSnap?.status === 'loading' ? 'connecting-ws' : 'warmup-ready')
    : colyseus.loadingStep;

  const loadingError = local
    ? (simSnap?.loadingError ?? undefined)
    : colyseus.loadingError;

  const showLoading = loadingStep !== 'warmup-ready' && gameState.status === 'waiting';

  // ─── Renderer ─────────────────────────────────────────────────────────────
  const rendererMode = config?.is25D ? '2.5d' : '2d';
  const { render, setControlledBeyblade, cameraZoomIn, cameraZoomOut, cameraZoomReset } = usePixiRenderer(containerRef, rendererMode as '2d' | '2.5d');

  useEffect(() => {
    if (myBeyblade?.id) setControlledBeyblade(myBeyblade.id);
  }, [myBeyblade?.id, setControlledBeyblade]);

  // ─── Input ────────────────────────────────────────────────────────────────
  const localSendInput = useCallback((input: import('../game/hooks/useGameInput').FullGameInput) => {
    simRef.current?.applyInput(input);
  }, []);

  const sendInputFn = local ? localSendInput : colyseus.sendInput;

  useGameInput(sendInputFn, gameState.status === 'in-progress');

  // ─── Launch input (server rooms) ──────────────────────────────────────────
  const launcherType = config?.launcherType ?? 'string';
  const launchState = useLaunchInput(
    !local ? (colyseus.room ?? null) : null,
    gameState.status,
    launcherType,
  );

  // ─── RAF render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      render(gameState, beyblades, local ? undefined : colyseus.visualEventQueue);
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

  // ─── Sync collision QTE power from server ─────────────────────────────────
  useEffect(() => {
    if (!local && collisionQTEActive) {
      setCollisionQTEPowerLocal(colyseus.collisionQTEPower);
    }
  }, [local, collisionQTEActive, colyseus.collisionQTEPower]);

  // ─── Victory detection ────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState.status === 'finished' || gameState.status === 'series-finished') {
      if (gameState.winner) setVictoryVisible(true);
    }
  }, [gameState.status, gameState.winner]);

  const handleExit = useCallback(() => {
    if (!local) colyseus.room?.leave();
    simRef.current?.stop();
    navigate(config?.roomType === 'tournament' ? '/game/2d/tournament' : '/game/battle');
  }, [local, colyseus.room, navigate, config]);

  if (!config) return null;

  const spinPct = myBeyblade ? Math.round((myBeyblade.spin / myBeyblade.maxSpin) * 100) : 0;
  const typeColor = myBeyblade ? (TYPE_COLORS[myBeyblade.type] ?? '#888') : '#888';

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
            currentStep={loadingStep as import('../components/LoadingProgress').LoadingStep}
            error={loadingError}
            onRetry={local ? () => {
              if (config) {
                simRef.current?.stop();
                const sim = new LocalGameSimulation(config, snap => setSimSnap(snap));
                simRef.current = sim;
                sim.start();
              }
            } : undefined}
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
        {gameState.status === 'launching' && !local && (
          <LaunchPhase
            launchTimer={gameState.launchTimer ?? LAUNCH_DURATION_S}
            launchTilt={launchState.tilt}
            launchPosition={launchState.position}
            launchPower={launchState.power}
            chargingStarted={launchState.chargingStarted}
            launched={launchState.launched}
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
          power={myBeyblade ? (myBeyblade as unknown as Record<string, number>)['launchPower'] ?? launchState.power : launchState.power}
        />

        {/* QTE — transform wrapper constrains `position:fixed` children to this viewport */}
        {qtePrompt && !local && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, transform: 'translateZ(0)' }}>
            <QTEOverlay
              prompt={qtePrompt}
              onKeyPress={(key) => colyseus.sendQTEInput(key)}
              onDismiss={() => setQTEPrompt(null)}
            />
          </div>
        )}

        {/* Collision QTE — same transform wrapper */}
        {collisionQTEActive && !local && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, transform: 'translateZ(0)' }}>
            <CollisionQTEOverlay
              active={collisionQTEActive}
              power={collisionQTEPowerLocal}
              canFireSpecial={collisionCanFireSpecial}
              qteMultiplier={collisionQTEMultiplier}
              currentSP={myBeyblade?.power ?? 0}
              onMash={colyseus.sendCollisionQTEMash}
              onFireSpecial={() => {
                colyseus.sendCollisionQTEFireSpecial();
                setCollisionCanFireSpecial(false);
                setCollisionQTEActive(false);
              }}
            />
          </div>
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
              onZoomReset={cameraZoomReset}
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

      </div>
    </GameShell>
  );
}

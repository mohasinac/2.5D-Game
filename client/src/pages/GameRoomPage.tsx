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
import { isLocalRoom, roomNameForConfig, type GameRoomConfig } from '../types/gameRoom';
import { ROOM_NAMES } from '../shared/utils/gameMode';
import { LocalGameSimulation, type SimSnapshot } from '../game/simulation/LocalGameSimulation';
import { getScenario } from '../constants/gameModeScenarios';

import { GameShell } from '../components/game/GameShell';
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
import { SequenceQTE, MashQTE, SingleKeyQTE, DebuffNotice } from '../components/game/QTENotificationSystem';
import { RoyaleHUD } from '../components/game/RoyaleHUD';
import { SafeZoneOverlay } from '../components/game/SafeZoneOverlay';
import { ZoneDangerMeter } from '../components/game/ZoneDangerMeter';
import type { SingleKeyQTEData, DebuffNoticeData } from '../components/game/QTENotificationSystem';
import type { QTEPromptData } from '../game/hooks/useColyseus';
import { LAUNCH_DURATION_S } from '../shared/constants/gameConstants';

// ─── HUD bar component ────────────────────────────────────────────────────────
function HudBar({ label, value, max, pct, color }: {
  label: string; value: number; max: number; pct: number; color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', width: 18, textAlign: 'right', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.round(pct * 100)}%`, background: color, borderRadius: 3, transition: 'width 150ms' }} />
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)', width: 32, textAlign: 'left', flexShrink: 0 }}>
        {value}<span style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>/{max}</span>
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
  const [debuffStartedAt, setDebuffStartedAt] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [lostConnection, setLostConnection] = useState(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPostMatch, setShowPostMatch] = useState(false);
  const postMatchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bitBeastCinematic = useBitBeastCinematic(config?.beybladeId ?? null);
  const { byId: comboMap } = useCombos();
  const { resolve: resolveSpecialMove } = useSpecialMoves();

  // ─── Server room (Colyseus) ───────────────────────────────────────────────
  const colyseusOptions = useMemo(() => {
    const scenario = getScenario(config?.roomType ?? 'pvp');
    return {
      beybladeId: config?.beybladeId || settings.beybladeId || scenario.beybladeId,
      arenaId:    config?.arenaId    || settings.arenaId    || scenario.arenaId,
      username:   settings.username  ?? 'Player',
      userId:     settings.userId    ?? 'guest',
      spectate:   config?.spectate   ?? false,
      bestOf:     config?.bestOf     ?? scenario.bestOf,
      modifierIds: config?.modifierIds ?? [],
    };
  }, [config, settings]);

  const roomName = config && !local ? roomNameForConfig(config) : ROOM_NAMES["2d"].battle;

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
  // Default to 2.5D — only use flat 2D when is25D is explicitly false.
  const rendererMode = config?.is25D !== false ? '2.5d' : '2d';
  const { render, setControlledBeyblade, cameraZoomIn, cameraZoomOut, cameraZoomReset, triggerScreenShake, triggerHitFlash } = usePixiRenderer(containerRef, rendererMode as '2d' | '2.5d');

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

  // ─── Sync collision QTE power from server ─────────────────────────────────
  useEffect(() => {
    if (!local && collisionQTEActive) {
      setCollisionQTEPowerLocal(colyseus.collisionQTEPower);
    }
  }, [local, collisionQTEActive, colyseus.collisionQTEPower]);

  // ─── Track BeyLink debuff startedAt ──────────────────────────────────────
  useEffect(() => {
    if (!local && colyseus.beyLinkControlLoss) setDebuffStartedAt(Date.now());
    else setDebuffStartedAt(null);
  }, [local, colyseus.beyLinkControlLoss]);

  // ─── Victory detection ────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState.status === 'finished' || gameState.status === 'series-finished') {
      if (gameState.winner) setVictoryVisible(true);
      setShowPostMatch(true);
      postMatchTimerRef.current = setTimeout(() => navigate('/game/battle', { replace: true }), 30_000);
    }
    return () => { if (postMatchTimerRef.current) clearTimeout(postMatchTimerRef.current); };
  }, [gameState.status, gameState.winner, navigate]);

  // ─── Disconnect / reconnect (server rooms) ──────────────────────────────
  useEffect(() => {
    if (local) return;
    const state = colyseus.connectionState;
    if (state === 'disconnected' && gameState.status === 'in-progress') {
      setReconnecting(true);
      reconnectTimerRef.current = setTimeout(() => {
        setReconnecting(false);
        setLostConnection(true);
      }, 30_000);
    } else if (state === 'connected') {
      setReconnecting(false);
      setLostConnection(false);
      if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }
    }
  }, [local, colyseus.connectionState, gameState.status]);

  // ─── Keyboard pause toggle (Escape) ──────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPaused(prev => {
          const next = !prev;
          if (local) { if (next) simRef.current?.pause(); else simRef.current?.resume(); }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [local]);

  const handleExit = useCallback(() => {
    if (!local) colyseus.room?.leave();
    simRef.current?.stop();
    const rt = config?.roomType;
    if (rt === 'tournament') {
      navigate(config?.tournamentId ? `/game/2d/tournament/${config.tournamentId}` : '/game/2d/tournament');
    } else if (rt === 'pvp') {
      navigate('/game/2d/battle/lobby');
    } else {
      navigate('/game/battle');
    }
  }, [local, colyseus.room, navigate, config]);

  // Tournament bracket info from local sim
  const tournamentBracket = simSnap?.tournamentBracket;

  if (!config) return null;

  const typeColorHex = myBeyblade ? (TYPE_COLORS[myBeyblade.type] ?? 0x888888) : 0x888888;
  const typeColor = `#${typeColorHex.toString(16).padStart(6, '0')}`;

  // ─── BeyLink QTE data conversions ─────────────────────────────────────────
  const escapeQTEData: SingleKeyQTEData | null = !local && colyseus.beyLinkQTE ? {
    key: colyseus.beyLinkQTE.key,
    label: 'Escape!',
    expiresAt: colyseus.beyLinkQTE.expiresAt,
    variant: 'escape',
  } : null;

  const blockQTEData: SingleKeyQTEData | null = !local && colyseus.beyLinkHijackBlockQTE ? {
    key: colyseus.beyLinkHijackBlockQTE.key,
    label: 'Block Hijack!',
    expiresAt: colyseus.beyLinkHijackBlockQTE.expiresAt,
    variant: 'block',
  } : null;

  const hijackQTEPrompt: QTEPromptData | null = !local && colyseus.beyLinkHijackQTE ? {
    attackerBeyId: colyseus.beyLinkHijackQTE.stackKey,
    sequence: ['attack', 'attack', 'attack'],
    windowTicks: colyseus.beyLinkHijackQTE.windowTicks,
    powerCost: 0,
    expiresAt: colyseus.beyLinkHijackQTE.expiresAt,
  } : null;

  const debuffData: DebuffNoticeData | null = !local && colyseus.beyLinkControlLoss && debuffStartedAt !== null ? {
    mode: colyseus.beyLinkControlLoss.mode,
    durationTicks: colyseus.beyLinkControlLoss.durationTicks,
    startedAt: debuffStartedAt,
  } : null;

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
      show25DRotate={config.is25D}
      onExit={handleExit}
      onZoomIn={cameraZoomIn}
      onZoomOut={cameraZoomOut}
      onZoomReset={cameraZoomReset}
    >
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
        {gameState.status === 'launching' && (
          <LaunchPhase
            launchTimer={gameState.launchTimer ?? (simSnap?.launchTimer ?? LAUNCH_DURATION_S)}
            launchTilt={local ? (simSnap?.launchTilt ?? 0) : launchState.tilt}
            launchPosition={local ? (simSnap?.launchPosition ?? 0.5) : launchState.position}
            launchPower={local ? (simSnap?.launchPower ?? 0) : launchState.power}
            chargingStarted={local ? ((simSnap?.launchPower ?? 0) > 0) : launchState.chargingStarted}
            launched={local ? false : launchState.launched}
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
          power={local ? (simSnap?.launchPower ?? 0) : (myBeyblade ? (myBeyblade as unknown as Record<string, number>)['launchPower'] ?? launchState.power : launchState.power)}
        />

        {/* SequenceQTE — counter block (bottom-centre, yellow) */}
        {qtePrompt && (
          <div style={{ position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}>
            <SequenceQTE
              prompt={qtePrompt}
              variant="counter"
              onKeyPress={(key) => colyseus.sendQTEInput(key)}
              onDismiss={() => setQTEPrompt(null)}
            />
          </div>
        )}

        {/* SequenceQTE — BeyLink hijack attacker (bottom-centre, purple) */}
        {hijackQTEPrompt && (
          <div style={{ position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)', zIndex: 201 }}>
            <SequenceQTE
              prompt={hijackQTEPrompt}
              variant="hijack"
              onKeyPress={() => {}}
              onSuccess={() => {
                if (colyseus.beyLinkHijackQTE) {
                  colyseus.sendHijackAttempt(
                    colyseus.beyLinkHijackQTE.stackKey,
                    colyseus.beyLinkHijackQTE.linkId,
                  );
                }
              }}
              onDismiss={() => {}}
            />
          </div>
        )}

        {/* MashQTE — collision clash (right edge, v-mid) */}
        {collisionQTEActive && (
          <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', zIndex: 200 }}>
            <MashQTE
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

        {/* SingleKeyQTE — BeyLink escape (top-centre, cyan) */}
        {escapeQTEData && (
          <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}>
            <SingleKeyQTE
              data={escapeQTEData}
              onPress={(key) => colyseus.sendBeyLinkQTEInput(key)}
              onDismiss={() => {}}
            />
          </div>
        )}

        {/* SingleKeyQTE — BeyLink hijack block (top-centre, blue) */}
        {blockQTEData && (
          <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', zIndex: 201 }}>
            <SingleKeyQTE
              data={blockQTEData}
              onPress={(key) => {
                if (colyseus.beyLinkHijackBlockQTE) {
                  colyseus.sendHijackBlock(
                    colyseus.beyLinkHijackBlockQTE.stackKey,
                    key,
                  );
                }
              }}
              onDismiss={() => {}}
            />
          </div>
        )}

        {/* DebuffNotice — BeyLink control loss (top-left badge) */}
        {debuffData && (
          <div style={{ position: 'absolute', top: '8%', left: '5%', zIndex: 200 }}>
            <DebuffNotice
              data={debuffData}
              onExpire={() => setDebuffStartedAt(null)}
            />
          </div>
        )}

        {/* HUD — health + SP bars */}
        {myBeyblade && gameState.status === 'in-progress' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '6px 10px 8px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            display: 'flex', flexDirection: 'column', gap: 4, pointerEvents: 'none',
          }}>
            {/* Health bar row */}
            <HudBar
              label="HP"
              value={Math.round(myBeyblade.health)}
              max={100}
              pct={myBeyblade.health / 100}
              color={myBeyblade.health > 50 ? '#22c55e' : myBeyblade.health > 25 ? '#f59e0b' : '#ef4444'}
            />
            {/* SP bar row — capped display at 100 */}
            <HudBar
              label="SP"
              value={Math.min(100, Math.round(myBeyblade.power ?? 0))}
              max={100}
              pct={Math.min(1, (myBeyblade.power ?? 0) / 100)}
              color={typeColor}
            />
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

        {/* Battle Royale HUD — zone timer + player strip */}
        {config?.roomType === 'royale' && gameState.status === 'in-progress' && (
          <RoyaleHUD gameState={gameState} myId={settings.userId ?? 'guest'} />
        )}

        {/* Battle Royale — zone closing overlay flash + outside-zone vignette */}
        {config?.roomType === 'royale' && gameState.status === 'in-progress' && (
          <SafeZoneOverlay gameState={gameState} myId={settings.userId ?? 'guest'} />
        )}

        {/* Battle Royale — mobile danger meter (right side bar) */}
        {config?.roomType === 'royale' && gameState.status === 'in-progress' && (
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
            {/* Round label */}
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {tournamentBracket.round === tournamentBracket.totalRounds ? 'FINAL' : `Round ${tournamentBracket.round}`}
            </span>
            {/* Opponent difficulty badge */}
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
            {/* Progress dots */}
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
          isLocal={local}
          onResume={() => { setPaused(false); if (local) simRef.current?.resume(); }}
          onForfeit={() => { if (!local) colyseus.room?.leave(); simRef.current?.stop(); }}
        />
      )}

      {/* Reconnecting toast */}
      {reconnecting && !lostConnection && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 600, background: 'rgba(20,20,40,0.95)', border: '1px solid rgba(255,200,0,0.4)', borderRadius: 10, padding: '10px 20px', color: '#ffcc00', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid #ffcc00', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
          Connection lost — reconnecting…
        </div>
      )}

      {/* Lost connection overlay */}
      {lostConnection && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ fontSize: 32 }}>📡</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>Match Ended</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Connection lost</div>
          <button onClick={() => navigate('/game/battle', { replace: true })} style={{ padding: '12px 32px', background: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.4)', borderRadius: 10, color: '#00e5ff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Back to Lobby
          </button>
        </div>
      )}

      {/* Post-match summary */}
      {showPostMatch && (gameState.status === 'finished' || gameState.status === 'series-finished') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 650, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 28, width: '100%', maxWidth: 420 }}>
            <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {winnerName ? `${winnerName} Wins!` : 'Match Over'}
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Returning to lobby in 30s…</div>

            {/* Per-player stats */}
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

// [GAME-CONTEXT] useColyseus — manages the Colyseus WebSocket connection lifecycle.
// Connects to the game server, maintains room reference, and syncs state to React.

import { useState, useEffect, useRef, useCallback } from "react";
import { Client, Room } from "colyseus.js";
import type { ConnectionState, ServerBeyblade, ServerGameState } from "@/types/game";
import type { LoadingStep } from "@/components/LoadingProgress";
import toast from "react-hot-toast";

const GAME_SERVER_URL = import.meta.env.VITE_GAME_SERVER_URL || "ws://localhost:2567";
export const IS_LOCAL = import.meta.env.VITE_LOCAL === "true";

export interface BurstEventData {
  beyId: string;
  attackerId: string;
  x: number;
  y: number;
}

export interface QTEPromptData {
  attackerBeyId: string;
  sequence: string[];
  windowTicks: number;
  powerCost: number;
  expiresAt: number; // Date.now() + windowMs — set client-side on receipt
}

export interface QTESuccessData {
  attackerBeyId: string;
  refundAmount: number;
}

export interface ArenaEffectState {
  active: boolean;
  effectType: string;
  /** Remaining ticks (server-reported on start; client counts down locally). */
  remainingTicks: number;
  /** True only for the caster session. */
  isCaster: boolean;
}

interface UseColyseusOptions {
  roomName: string;
  options?: Record<string, unknown>;
  autoConnect?: boolean;
  // If set, joins this specific room by ID instead of joinOrCreate
  roomId?: string;
  // Callbacks for series messages
  onGameEnd?: (data: { winner: string; gameNumber: number; seriesScore: Record<string, number> }) => void;
  onSeriesEnd?: (data: { winner: string; seriesScore: Record<string, number> }) => void;
  // Callback for burst KO event (Phase R)
  onBurst?: (data: BurstEventData) => void;
  // Callbacks for QTE events (Phase Y)
  onQTEPrompt?: (data: QTEPromptData) => void;
  onQTESuccess?: (data: QTESuccessData) => void;
  onQTEExpired?: () => void;
  // Callback for arena timeline announcements (Phase T)
  onArenaAnnouncement?: (data: { text: string; style?: "warning" | "info" | "danger" }) => void;
  // Callbacks for arena-wide effects (Phase AA)
  onArenaEffectStart?: (data: { effectType: string; durationTicks: number; casterSessionId: string }) => void;
  onArenaEffectEnd?: (data: { effectType: string }) => void;
}

interface UseColyseusReturn {
  connectionState: ConnectionState;
  room: Room | null;
  gameState: ServerGameState | null;
  beyblades: Map<string, ServerBeyblade>;
  myBeyblade: ServerBeyblade | null;
  isSpectating: boolean;
  /** Current loading step — used by <LoadingProgress />. */
  loadingStep: LoadingStep;
  loadingError?: string;
  /** Active arena-wide effect state (Phase AA). Null when no effect is active. */
  arenaEffect: ArenaEffectState | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendQTEInput: (key: string) => void;
  sendInput: (input: {
    moveLeft?: boolean;
    moveRight?: boolean;
    moveUp?: boolean;
    moveDown?: boolean;
    attack?: boolean;
    defense?: boolean;
    dodge?: boolean;
    jump?: boolean;
    chargeHeld?: boolean;
    specialTap?: boolean;
  }) => void;
}

function encodeInputBitmask(input: {
  moveLeft?: boolean; moveRight?: boolean; moveUp?: boolean; moveDown?: boolean;
  attack?: boolean; defense?: boolean; dodge?: boolean; jump?: boolean;
  chargeHeld?: boolean; specialTap?: boolean;
}): number {
  let f = 0;
  if (input.moveLeft)   f |= 1 << 0;
  if (input.moveRight)  f |= 1 << 1;
  if (input.moveUp)     f |= 1 << 2;
  if (input.moveDown)   f |= 1 << 3;
  if (input.attack)     f |= 1 << 4;
  if (input.defense)    f |= 1 << 5;
  if (input.dodge)      f |= 1 << 6;
  if (input.jump)       f |= 1 << 7;
  if (input.chargeHeld) f |= 1 << 8;
  if (input.specialTap) f |= 1 << 9;
  return f;
}

export function useColyseus({
  roomName,
  options = {},
  autoConnect = false,
  roomId,
  onGameEnd,
  onSeriesEnd,
  onBurst,
  onQTEPrompt,
  onQTESuccess,
  onQTEExpired,
  onArenaAnnouncement,
  onArenaEffectStart,
  onArenaEffectEnd,
}: UseColyseusOptions): UseColyseusReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [room, setRoom] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<ServerGameState | null>(null);
  const [beyblades, setBeyblades] = useState<Map<string, ServerBeyblade>>(new Map());
  const [myBeyblade, setMyBeyblade] = useState<ServerBeyblade | null>(null);
  const [isSpectating, setIsSpectating] = useState(false);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("connecting-ws");
  const [loadingError, setLoadingError] = useState<string | undefined>(undefined);
  const [arenaEffect, setArenaEffect] = useState<ArenaEffectState | null>(null);

  const clientRef = useRef<Client | null>(null);
  const roomRef = useRef<Room | null>(null);
  const onGameEndRef = useRef(onGameEnd);
  const onSeriesEndRef = useRef(onSeriesEnd);
  const onBurstRef = useRef(onBurst);
  const onQTEPromptRef = useRef(onQTEPrompt);
  const onQTESuccessRef = useRef(onQTESuccess);
  const onQTEExpiredRef = useRef(onQTEExpired);
  const onArenaAnnouncementRef = useRef(onArenaAnnouncement);
  const onArenaEffectStartRef = useRef(onArenaEffectStart);
  const onArenaEffectEndRef = useRef(onArenaEffectEnd);

  useEffect(() => { onGameEndRef.current = onGameEnd; }, [onGameEnd]);
  useEffect(() => { onSeriesEndRef.current = onSeriesEnd; }, [onSeriesEnd]);
  useEffect(() => { onBurstRef.current = onBurst; }, [onBurst]);
  useEffect(() => { onQTEPromptRef.current = onQTEPrompt; }, [onQTEPrompt]);
  useEffect(() => { onQTESuccessRef.current = onQTESuccess; }, [onQTESuccess]);
  useEffect(() => { onQTEExpiredRef.current = onQTEExpired; }, [onQTEExpired]);
  useEffect(() => { onArenaAnnouncementRef.current = onArenaAnnouncement; }, [onArenaAnnouncement]);
  useEffect(() => { onArenaEffectStartRef.current = onArenaEffectStart; }, [onArenaEffectStart]);
  useEffect(() => { onArenaEffectEndRef.current = onArenaEffectEnd; }, [onArenaEffectEnd]);

  const connect = useCallback(async () => {
    if (roomRef.current) return;

    setConnectionState("connecting");
    setLoadingStep("connecting-ws");
    setLoadingError(undefined);

    try {
      if (!clientRef.current) {
        clientRef.current = new Client(GAME_SERVER_URL);
      }

      // Once we have a client, we're attempting to join the room.
      setLoadingStep("joining-room");

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Connection timed out after 15s")), 15000),
      );

      const joinPromise = roomId
        ? clientRef.current.joinById(roomId, options)
        : clientRef.current.joinOrCreate(roomName, options);

      const connectedRoom = await Promise.race([joinPromise, timeout]);
      roomRef.current = connectedRoom;
      setRoom(connectedRoom);
      setConnectionState("connected");
      // Renderer + asset hook will advance to loading-arena-assets / beyblade-assets / audio.

      // Detect spectator mode — spectators have no beyblade entry keyed to their sessionId
      const spectate = Boolean((options as any).spectate);
      setIsSpectating(spectate);

      // State change listeners — sync Colyseus state to React
      connectedRoom.onStateChange((state: any) => {
        const nextBeyblades = new Map<string, ServerBeyblade>();
        if (state.beyblades) {
          state.beyblades.forEach((b: any, id: string) => {
            nextBeyblades.set(id, { ...b });
          });
        }
        setBeyblades(nextBeyblades);

        const myB = spectate ? null : nextBeyblades.get(connectedRoom.sessionId) ?? null;
        setMyBeyblade(myB);

        // Build seriesWins map
        const seriesWins = new Map<string, number>();
        if (state.seriesWins) {
          state.seriesWins.forEach((v: number, k: string) => seriesWins.set(k, v));
        }

        // Arena feature maps (Phase 2). These are MapSchemas on the server.
        const cloneMap = <T,>(src: any): Map<string, T> | undefined => {
          if (!src || typeof src.forEach !== "function") return undefined;
          const m = new Map<string, T>();
          src.forEach((v: any, k: string) => m.set(k, { ...v } as T));
          return m;
        };

        setGameState({
          status: state.status,
          mode: state.mode,
          timer: state.timer,
          startTime: state.startTime,
          winner: state.winner,
          matchId: state.matchId,
          arena: state.arena ? { ...state.arena } : null,
          beyblades: nextBeyblades,
          // Feature maps
          obstacles: cloneMap(state.obstacles),
          pits: cloneMap(state.pits),
          turrets: cloneMap(state.turrets),
          projectiles: cloneMap(state.projectiles),
          waterBodies: cloneMap(state.waterBodies),
          portals: cloneMap(state.portals),
          loops: cloneMap(state.loops),
          // Tournament fields
          tournamentId: state.tournamentId ?? "",
          tournamentName: state.tournamentName ?? "",
          roundNumber: state.roundNumber ?? 0,
          tournamentMatchId: state.tournamentMatchId ?? "",
          // Spectator
          spectatorCount: state.spectatorCount ?? 0,
          // Series
          currentGame: state.currentGame ?? 1,
          targetWins: state.targetWins ?? 1,
          seriesWins,
          seriesLeader: state.seriesLeader ?? "",
        } as ServerGameState);
      });

      connectedRoom.onMessage("game-end", (data: any) => {
        onGameEndRef.current?.(data);
      });

      connectedRoom.onMessage("series-end", (data: any) => {
        onSeriesEndRef.current?.(data);
      });

      connectedRoom.onMessage("idle-disconnect", () => {
        toast("Disconnected due to inactivity.", { icon: "💤" });
      });

      // Burst KO event (Phase R) — push to visual event queue via callback
      connectedRoom.onMessage("burst", (data: BurstEventData) => {
        onBurstRef.current?.(data);
        // Fallback toast so spectators/players always see something
        const mySessionId = connectedRoom.sessionId;
        if (data.attackerId === mySessionId) {
          toast("BURST KO!", { icon: "💥", duration: 2500 });
        }
      });

      // QTE events (Phase Y)
      connectedRoom.onMessage("qte-prompt", (data: { attackerBeyId: string; sequence: string[]; windowTicks: number; powerCost: number }) => {
        const windowMs = Math.round(data.windowTicks * (1000 / 60));
        onQTEPromptRef.current?.({ ...data, expiresAt: Date.now() + windowMs });
      });

      connectedRoom.onMessage("qte-success", (data: QTESuccessData) => {
        onQTESuccessRef.current?.(data);
        // Show refund toast to this player if they are the attacker
        if (data.attackerBeyId === connectedRoom.sessionId) {
          toast(`Intercepted! +${data.refundAmount} power refunded`, { icon: "⚡", duration: 2500 });
        } else {
          toast("BLOCKED!", { icon: "🛡️", duration: 2000 });
        }
      });

      connectedRoom.onMessage("qte-expired", () => {
        onQTEExpiredRef.current?.();
      });

      // Phase T: arena timeline announcement
      connectedRoom.onMessage("arena-announcement", (data: { text: string; style?: "warning" | "info" | "danger" }) => {
        onArenaAnnouncementRef.current?.(data);
      });

      // Phase AA: arena-wide effect events
      connectedRoom.onMessage("arena-effect-start", (data: { effectType: string; durationTicks: number; casterSessionId: string }) => {
        setArenaEffect({
          active: true,
          effectType: data.effectType,
          remainingTicks: data.durationTicks,
          isCaster: data.casterSessionId === connectedRoom.sessionId,
        });
        onArenaEffectStartRef.current?.(data);
      });

      connectedRoom.onMessage("arena-effect-end", (data: { effectType: string }) => {
        setArenaEffect(null);
        onArenaEffectEndRef.current?.(data);
      });

      connectedRoom.onError((code, message) => {
        console.error(`Room error [${code}]: ${message}`);
        setConnectionState("error");
      });

      connectedRoom.onLeave(() => {
        setConnectionState("disconnected");
        roomRef.current = null;
        setRoom(null);
        setGameState(null);
        setBeyblades(new Map());
        setMyBeyblade(null);
        setIsSpectating(false);
      });
    } catch (err) {
      console.error("Connection failed:", err);
      setConnectionState("error");
      setLoadingError(err instanceof Error ? err.message : String(err));
    }
  }, [roomName, options, roomId]);

  const disconnect = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.leave();
      roomRef.current = null;
    }
  }, []);

  const sendQTEInput = useCallback((key: string) => {
    if (roomRef.current && roomRef.current.connection.isOpen) {
      roomRef.current.send("qte-input", { key });
    }
  }, []);

  const sendInput = useCallback((input: {
    moveLeft?: boolean; moveRight?: boolean; moveUp?: boolean; moveDown?: boolean;
    attack?: boolean; defense?: boolean; dodge?: boolean; jump?: boolean;
    chargeHeld?: boolean; specialTap?: boolean;
  }) => {
    if (roomRef.current && roomRef.current.connection.isOpen) {
      roomRef.current.send("input", encodeInputBitmask(input));
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Watch state.status to advance step to "warmup-ready" once the room reports it.
  useEffect(() => {
    if (gameState?.status === "in-progress") {
      setLoadingStep("warmup-ready");
    } else if (gameState?.status === "warmup") {
      // Treat warmup as "almost ready" — sit at loading-audio-assets so the bar shows ~85%.
      setLoadingStep((s) => (s === "warmup-ready" ? s : "loading-audio-assets"));
    }
  }, [gameState?.status]);

  return {
    connectionState, room, gameState, beyblades, myBeyblade, isSpectating,
    loadingStep, loadingError,
    arenaEffect,
    connect, disconnect, sendQTEInput, sendInput,
  };
}

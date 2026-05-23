// [GAME-CONTEXT] useColyseus — manages the Colyseus WebSocket connection lifecycle.
// Connects to the game server, maintains room reference, and syncs state to React.

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Client, Room } from "colyseus.js";
import type { ConnectionState, ServerBeyblade, ServerGameState } from "@/types/game";
import type { LoadingStep } from "@/components/LoadingProgress";
import type { BeybladeGameRenderer } from "@/game/renderer/PixiRenderer";
import { VisualEventQueue, VisualPriority } from "@/game/visual/VisualEventQueue";
import toast from "react-hot-toast";
import type { FloorInfo, FloorLinkInfo } from "@/components/game/FloorHUD";
import type { FloorTransitionProps } from "@/components/game/FloorTransitionOverlay";
import type { LinkAlignmentInfo } from "@/components/game/LinkAlignmentHUD";

export type { FloorInfo, FloorLinkInfo, FloorTransitionProps, LinkAlignmentInfo };

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

// D3: camera effect triggered by a special move
export interface SpecialMoveCameraData {
  beyId: string;
  cameraConfig: {
    zoomFactor: number;
    durationTicks: number;
    slowMotionFactor: number;
  };
}

// D5: per-bey combo visual
export interface ComboVisualData {
  beyId: string;
  introAnimation: string;
  particlePresetId: string;
  keepVisualAppearance?: boolean;
}

// G5: meteor strike (two-phase)
export interface MeteorStrikeHangData {
  beyId: string;
  landingX: number;
  landingY: number;
  landingRadius: number;
  hangTicks: number;
}

export interface MeteorStrikeLandData {
  beyId: string;
  landingX: number;
  landingY: number;
  landingRadius: number;
  damageDealt: number;
}

// N3: arena-spawned beyblade
export interface ArenaSpawnData {
  spawnId: string;
  beyId: string;
  controlMode: "friendly" | "hostile" | "neutral";
  statsMultiplier: number;
  position: { x: number; y: number };
}

// N3: bey briefly leaves the arena (jump hang)
export interface MovementJumpHangData {
  beyId: string;
  hangTicks: number;
}

// BeyLink QTE escape prompt
export interface BeyLinkQTEData {
  attackerId: string;
  stackKey: string;
  linkId: string;
  key: string;          // the single key the victim must press
  windowTicks: number;
  expiresAt: number;
}

// BeyLink control-loss burst
export interface BeyLinkControlLossData {
  mode: "reverse" | "scramble" | "freeze";
  durationTicks: number;
  attackerId: string;
  linkId: string;
}

// Hijack QTE prompts
export interface BeyLinkHijackQTEData {
  stackKey: string;
  linkId: string;
  windowTicks: number;
  expiresAt: number;
}

export interface BeyLinkHijackBlockQTEData {
  stackKey: string;
  linkId: string;
  key: string;
  windowTicks: number;
  expiresAt: number;
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
  // Optional renderer ref — used by D3/D5/G5/N3 handlers to push visual events
  rendererRef?: React.RefObject<BeybladeGameRenderer | null>;
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
  /** D3: true while a special-move camera effect is animating. */
  cameraEffectActive: boolean;
  /** N3: map of spawnId → ArenaSpawnData for all arena-spawned beyblades. */
  spawnedBeys: Map<string, ArenaSpawnData>;
  /** P5: queue of visual events for combo/special/meteor — drain each rAF frame. */
  visualEventQueue: VisualEventQueue;
  /** Active bey-link QTE escape prompt for this player. Null when not applicable. */
  beyLinkQTE: BeyLinkQTEData | null;
  /** Active bey-link control-loss state for this player. Null when not applicable. */
  beyLinkControlLoss: BeyLinkControlLossData | null;
  /** Hijack initiation QTE shown to the victim who sent the attempt. */
  beyLinkHijackQTE: BeyLinkHijackQTEData | null;
  /** Block QTE shown to the attacker so they can deny the hijack. */
  beyLinkHijackBlockQTE: BeyLinkHijackBlockQTEData | null;
  /** Floor-group stack info. Empty when arena has no floor group. */
  floorInfo: FloorInfo[];
  /** Zero-based index of the floor this player's bey is currently on. */
  myFloorIndex: number;
  /** Per-link alignment status for the LinkAlignmentHUD. */
  linkAlignments: LinkAlignmentInfo[];
  /** Active floor-transition animation props. Null when not traversing. */
  floorTransition: Omit<FloorTransitionProps, "visible"> | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendQTEInput: (key: string) => void;
  /** Send a bey-link QTE escape key press to the server. */
  sendBeyLinkQTEInput: (key: string) => void;
  /** Initiate a hijack attempt as the link victim. */
  sendHijackAttempt: (stackKey: string, linkId: string) => void;
  /** Send the block key as the link attacker to deny a hijack. */
  sendHijackBlock: (stackKey: string, key: string) => void;
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
  rendererRef,
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
  // D3: true while a special-move camera zoom effect is in flight
  const [cameraEffectActive, setCameraEffectActive] = useState(false);
  // N3: arena-spawned beyblades keyed by spawnId
  const [spawnedBeys, setSpawnedBeys] = useState<Map<string, ArenaSpawnData>>(new Map());
  // BeyLink QTE escape prompt and control-loss state
  const [beyLinkQTE, setBeyLinkQTE] = useState<BeyLinkQTEData | null>(null);
  const [beyLinkControlLoss, setBeyLinkControlLoss] = useState<BeyLinkControlLossData | null>(null);
  const [beyLinkHijackQTE, setBeyLinkHijackQTE] = useState<BeyLinkHijackQTEData | null>(null);
  const [beyLinkHijackBlockQTE, setBeyLinkHijackBlockQTE] = useState<BeyLinkHijackBlockQTEData | null>(null);
  // Floor-group HUD state
  const [floorInfo, setFloorInfo] = useState<FloorInfo[]>([]);
  const [myFloorIndex, setMyFloorIndex] = useState(0);
  const [linkAlignments, setLinkAlignments] = useState<LinkAlignmentInfo[]>([]);
  const [floorTransition, setFloorTransition] = useState<Omit<FloorTransitionProps, "visible"> | null>(null);

  const visualEventQueueRef = useRef(new VisualEventQueue());

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
  // Keep a stable ref to the injected renderer so closures in connect() always
  // see the latest renderer without needing to re-run the effect.
  const rendererRefInternal = useRef<React.RefObject<BeybladeGameRenderer | null> | undefined>(rendererRef);

  useEffect(() => { onGameEndRef.current = onGameEnd; }, [onGameEnd]);
  useEffect(() => { onSeriesEndRef.current = onSeriesEnd; }, [onSeriesEnd]);
  useEffect(() => { onBurstRef.current = onBurst; }, [onBurst]);
  useEffect(() => { onQTEPromptRef.current = onQTEPrompt; }, [onQTEPrompt]);
  useEffect(() => { onQTESuccessRef.current = onQTESuccess; }, [onQTESuccess]);
  useEffect(() => { onQTEExpiredRef.current = onQTEExpired; }, [onQTEExpired]);
  useEffect(() => { onArenaAnnouncementRef.current = onArenaAnnouncement; }, [onArenaAnnouncement]);
  useEffect(() => { onArenaEffectStartRef.current = onArenaEffectStart; }, [onArenaEffectStart]);
  useEffect(() => { onArenaEffectEndRef.current = onArenaEffectEnd; }, [onArenaEffectEnd]);
  useEffect(() => { rendererRefInternal.current = rendererRef; }, [rendererRef]);

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
          // Launch phase
          launchTimer: state.launchTimer ?? 5,
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

      // Burst KO event (Phase R) — CRITICAL priority so it's never dropped/throttled
      connectedRoom.onMessage("burst", (data: BurstEventData) => {
        visualEventQueueRef.current.push({ priority: VisualPriority.CRITICAL, type: "burst", payload: data });
        onBurstRef.current?.(data);
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

      // BeyLink QTE escape prompt (single-key break-free from hostile stacks)
      connectedRoom.onMessage("bey-link-qte", (data: BeyLinkQTEData) => {
        setBeyLinkQTE(data);
      });
      connectedRoom.onMessage("bey-link-qte-success", () => {
        setBeyLinkQTE(null);
      });
      connectedRoom.onMessage("bey-link-qte-expired", () => {
        setBeyLinkQTE(null);
      });
      connectedRoom.onMessage("bey-link-qte-cleared", () => {
        setBeyLinkQTE(null);
      });
      connectedRoom.onMessage("bey-link-control-loss", (data: BeyLinkControlLossData) => {
        setBeyLinkControlLoss(data);
        setTimeout(() => setBeyLinkControlLoss(null), data.durationTicks * (1000 / 60));
      });
      // Recovery QTE: show prompt every 10 sec while under control loss
      connectedRoom.onMessage("bey-link-control-recovery-qte", (data: { key: string; linkId: string; windowTicks: number; expiresAt: number }) => {
        // Reuse beyLinkQTE state — recovery QTE uses the same HUD slot
        setBeyLinkQTE({
          attackerId: "",
          stackKey: `recovery:${data.linkId}`,
          linkId: data.linkId,
          key: data.key,
          windowTicks: data.windowTicks,
          expiresAt: data.expiresAt,
        });
      });
      connectedRoom.onMessage("bey-link-control-recovered", () => {
        setBeyLinkQTE(null);
        setBeyLinkControlLoss(null);
        toast("Controls recovered! 30s immunity", { icon: "🛡️", duration: 2500 });
      });
      connectedRoom.onMessage("bey-link-control-immunity-start", (data: { sessionId: string; immunityTicks: number }) => {
        if (data.sessionId === connectedRoom.sessionId) {
          toast(`Link immune for ${Math.round(data.immunityTicks / 60)}s`, { icon: "✨", duration: 2000 });
        }
      });
      connectedRoom.onMessage("bey-stack-broken", (data: { beyIdA: string; beyIdB: string; breakerId: string; impactForce: number; threshold: number }) => {
        // Clear QTE prompt if it was for us
        setBeyLinkQTE(prev => prev?.stackKey?.startsWith(data.beyIdA) || prev?.stackKey?.includes(data.beyIdB) ? null : prev);
        // Toast only for the participants
        if (data.beyIdA === connectedRoom.sessionId || data.beyIdB === connectedRoom.sessionId) {
          toast("Stack broken!", { icon: "💥", duration: 1500 });
        }
      });
      connectedRoom.onMessage("bey-stack-end", () => {
        setBeyLinkQTE(null);
      });

      // Hijack QTE: victim is initiating a takeover — show countdown to victim
      connectedRoom.onMessage("bey-link-hijack-qte", (data: BeyLinkHijackQTEData) => {
        setBeyLinkHijackQTE(data);
      });
      // Hijack block QTE: attacker must press the key to deny the takeover
      connectedRoom.onMessage("bey-link-hijack-block-qte", (data: BeyLinkHijackBlockQTEData) => {
        setBeyLinkHijackBlockQTE(data);
      });
      // Hijack succeeded (attacker failed to block in time)
      connectedRoom.onMessage("bey-link-hijacked", (data: { newControllerId: string; newVictimId: string; linkId: string; stackKey: string }) => {
        setBeyLinkHijackQTE(null);
        setBeyLinkHijackBlockQTE(null);
        if (data.newControllerId === connectedRoom.sessionId) {
          toast("Hijack seized! You control the link.", { icon: "⚡", duration: 2500 });
        } else if (data.newVictimId === connectedRoom.sessionId) {
          toast("Link hijacked — roles reversed!", { icon: "🔄", duration: 2500 });
        }
      });
      // Hijack blocked — attacker pressed the key in time
      connectedRoom.onMessage("bey-link-hijack-failed", (data: { stackKey: string; blockerId: string; victimId: string }) => {
        setBeyLinkHijackQTE(null);
        setBeyLinkHijackBlockQTE(null);
        if (data.blockerId === connectedRoom.sessionId) {
          toast("Hijack blocked!", { icon: "🛡️", duration: 1800 });
        } else if (data.victimId === connectedRoom.sessionId) {
          toast("Hijack attempt failed.", { icon: "✗", duration: 1800 });
        }
      });

      // Floor-group HUD: periodic alignment + floor status update
      connectedRoom.onMessage("arena-link-status", (data: {
        floors: FloorInfo[];
        myFloorIndex: number;
        linkAlignments: LinkAlignmentInfo[];
      }) => {
        setFloorInfo(data.floors);
        setMyFloorIndex(data.myFloorIndex);
        setLinkAlignments(data.linkAlignments);
      });

      // Floor-group HUD: bey starts crossing a link
      connectedRoom.onMessage("arena-link-cross", (data: Omit<FloorTransitionProps, "visible">) => {
        setFloorTransition(data);
        const durMs = Math.max((data as any).transitTicks ?? 60, 60) * (1000 / 60);
        setTimeout(() => setFloorTransition(null), durMs + 1000);
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
        // Push to VisualEventQueue if available
        rendererRefInternal.current?.current?.handleArenaEffect?.("start", data.effectType, data.durationTicks);
      });

      connectedRoom.onMessage("arena-effect-end", (data: { effectType: string }) => {
        setArenaEffect(null);
        onArenaEffectEndRef.current?.(data);
        rendererRefInternal.current?.current?.handleArenaEffect?.("end", data.effectType, 0);
      });

      // D3: special-move camera zoom/slow-motion effect — queued for throttled dispatch
      connectedRoom.onMessage("special-move-camera", (data: SpecialMoveCameraData) => {
        visualEventQueueRef.current.push({ priority: VisualPriority.HIGH, type: "special-move-camera", payload: data });
        if (data.cameraConfig.zoomFactor > 1) {
          setCameraEffectActive(true);
          const durationMs = Math.round(data.cameraConfig.durationTicks * (1000 / 60));
          setTimeout(() => setCameraEffectActive(false), durationMs);
        }
      });

      // D5: combo visual — queued so multiple combos in the same tick are rate-limited
      connectedRoom.onMessage("combo-visual", (data: ComboVisualData) => {
        visualEventQueueRef.current.push({ priority: VisualPriority.HIGH, type: "combo-visual", payload: data });
      });

      // G5: meteor strike — hang phase; CRITICAL priority so it's never dropped
      connectedRoom.onMessage("meteor-strike-hang", (data: MeteorStrikeHangData) => {
        visualEventQueueRef.current.push({ priority: VisualPriority.CRITICAL, type: "meteor-strike-hang", payload: data });
      });

      // G5: meteor strike — land phase (CRITICAL: camera shake + clear landing ring)
      connectedRoom.onMessage("meteor-strike-land", (data: MeteorStrikeLandData) => {
        rendererRefInternal.current?.current?.onMeteorStrikeLand?.(data);
        toast(`METEOR STRIKE! ${Math.round(data.damageDealt)} damage`, { icon: "☄️", duration: 2500 });
      });

      // N3: arena-spawned beyblade
      connectedRoom.onMessage("arena-spawn", (data: ArenaSpawnData) => {
        rendererRefInternal.current?.current?.onArenaSpawn?.(data);
        setSpawnedBeys((prev) => new Map(prev).set(data.spawnId, data));
        if (data.controlMode === "friendly") {
          toast("A friendly beyblade appeared! Press [1]/[2] to control it", { icon: "🌀", duration: 4000 });
        }
      });

      // N3: bey briefly leaves the arena (jump hang) — hide its container for hangTicks
      connectedRoom.onMessage("movement-jump-hang", (data: MovementJumpHangData) => {
        rendererRefInternal.current?.current?.onMovementJumpHang?.(data);
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

  const sendBeyLinkQTEInput = useCallback((key: string) => {
    if (roomRef.current && roomRef.current.connection.isOpen) {
      roomRef.current.send("bey-link-qte-input", { key });
    }
  }, []);

  const sendHijackAttempt = useCallback((stackKey: string, linkId: string) => {
    if (roomRef.current && roomRef.current.connection.isOpen) {
      roomRef.current.send("bey-link-hijack-attempt", { stackKey, linkId });
    }
  }, []);

  const sendHijackBlock = useCallback((stackKey: string, key: string) => {
    if (roomRef.current && roomRef.current.connection.isOpen) {
      roomRef.current.send("bey-link-hijack-block", { stackKey, key });
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
    arenaEffect, cameraEffectActive, spawnedBeys,
    visualEventQueue: visualEventQueueRef.current,
    beyLinkQTE, beyLinkControlLoss, beyLinkHijackQTE, beyLinkHijackBlockQTE,
    floorInfo, myFloorIndex, linkAlignments, floorTransition,
    connect, disconnect, sendQTEInput, sendBeyLinkQTEInput, sendHijackAttempt, sendHijackBlock, sendInput,
  };
}

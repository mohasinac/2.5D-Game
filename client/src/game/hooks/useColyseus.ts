// [GAME-CONTEXT] useColyseus — manages the Colyseus WebSocket connection lifecycle.
// Connects to the game server, maintains room reference, and syncs state to React.

import { useState, useEffect, useRef, useCallback } from "react";
import { Client, Room } from "colyseus.js";
import type { ConnectionState, ServerBeyblade, ServerGameState } from "@/types/game";

const GAME_SERVER_URL = import.meta.env.VITE_GAME_SERVER_URL || "ws://localhost:2567";

interface UseColyseusOptions {
  roomName: string;
  options?: Record<string, unknown>;
  autoConnect?: boolean;
}

interface UseColyseusReturn {
  connectionState: ConnectionState;
  room: Room | null;
  gameState: ServerGameState | null;
  beyblades: Map<string, ServerBeyblade>;
  myBeyblade: ServerBeyblade | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendInput: (input: {
    moveLeft?: boolean;
    moveRight?: boolean;
    attack?: boolean;
    specialMove?: boolean;
  }) => void;
}

export function useColyseus({
  roomName,
  options = {},
  autoConnect = false,
}: UseColyseusOptions): UseColyseusReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [room, setRoom] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<ServerGameState | null>(null);
  const [beyblades, setBeyblades] = useState<Map<string, ServerBeyblade>>(new Map());
  const [myBeyblade, setMyBeyblade] = useState<ServerBeyblade | null>(null);

  const clientRef = useRef<Client | null>(null);
  const roomRef = useRef<Room | null>(null);

  const connect = useCallback(async () => {
    if (roomRef.current) return;

    setConnectionState("connecting");

    try {
      if (!clientRef.current) {
        clientRef.current = new Client(GAME_SERVER_URL);
      }

      const connectedRoom = await clientRef.current.joinOrCreate(roomName, options);
      roomRef.current = connectedRoom;
      setRoom(connectedRoom);
      setConnectionState("connected");

      // State change listeners — sync Colyseus state to React
      connectedRoom.onStateChange((state: any) => {
        const nextBeyblades = new Map<string, ServerBeyblade>();
        if (state.beyblades) {
          state.beyblades.forEach((b: any, id: string) => {
            nextBeyblades.set(id, { ...b });
          });
        }
        setBeyblades(nextBeyblades);

        const myB = nextBeyblades.get(connectedRoom.sessionId);
        setMyBeyblade(myB ?? null);

        setGameState({
          status: state.status,
          mode: state.mode,
          timer: state.timer,
          startTime: state.startTime,
          winner: state.winner,
          matchId: state.matchId,
          arena: state.arena ? { ...state.arena } : null,
          beyblades: nextBeyblades,
        } as ServerGameState);
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
      });
    } catch (err) {
      console.error("Connection failed:", err);
      setConnectionState("error");
    }
  }, [roomName, options]);

  const disconnect = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.leave();
      roomRef.current = null;
    }
  }, []);

  const sendInput = useCallback((input: {
    moveLeft?: boolean;
    moveRight?: boolean;
    attack?: boolean;
    specialMove?: boolean;
  }) => {
    if (roomRef.current && roomRef.current.connection.isOpen) {
      roomRef.current.send("input", input);
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, []);

  return { connectionState, room, gameState, beyblades, myBeyblade, connect, disconnect, sendInput };
}

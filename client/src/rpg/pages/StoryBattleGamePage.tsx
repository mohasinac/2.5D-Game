import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useRPGStore } from "../stores/rpgStore";
import type { BattleResult } from "../data/schemas";

export default function StoryBattleGamePage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const roomRef = useRef<unknown>(null);
  const [status, setStatus] = useState<"connecting" | "playing" | "ended">("connecting");

  const setPendingBattleResult = useRPGStore((s) => s.setPendingBattleResult);

  useEffect(() => {
    if (!roomId) {
      navigate("/rpg/game");
      return;
    }

    let cancelled = false;

    async function joinRoom() {
      try {
        const { Client } = await import("colyseus.js");
        const serverUrl =
          (import.meta as { env?: { VITE_GAME_SERVER_URL?: string } }).env?.VITE_GAME_SERVER_URL ??
          "ws://localhost:2567";
        const client = new Client(serverUrl);
        const room = await client.joinById(roomId!);
        if (cancelled) { room.leave(); return; }
        roomRef.current = room;
        setStatus("playing");

        room.onMessage("rpg:battle-result", (data: {
          npcId: string;
          outcome: "win" | "loss" | "draw";
          seriesScore: Record<string, number>;
          rpgContext: {
            npcId: string;
            questId?: string;
            storyEventId?: string;
            isBossEncounter: boolean;
          };
        }) => {
          const result: BattleResult = {
            npcId: data.npcId,
            outcome: data.outcome,
            seriesScore: data.seriesScore,
            rpgContext: data.rpgContext,
          };
          setPendingBattleResult(result);
          setStatus("ended");

          setTimeout(() => {
            navigate("/rpg/game");
          }, 1500);
        });

        room.onMessage("series-end", () => {
          // Also listen for the base series-end if rpg:battle-result fires slightly after
        });
      } catch (err) {
        console.error("[StoryBattleGamePage] Failed to join room:", err);
        navigate("/rpg/game");
      }
    }

    joinRoom();
    return () => {
      cancelled = true;
      if (roomRef.current && typeof (roomRef.current as { leave?: () => void }).leave === "function") {
        (roomRef.current as { leave: () => void }).leave();
      }
    };
  }, [roomId, navigate, setPendingBattleResult]);

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      {status === "connecting" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400 text-sm">Connecting to battle...</p>
        </div>
      )}

      {status === "playing" && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-white text-lg font-bold">Battle in Progress</div>
          <p className="text-gray-400 text-sm">
            The Colyseus battle renderer will be mounted here.
          </p>
          <p className="text-gray-500 text-xs">
            (Reuses existing PixiJS battle hooks once wired)
          </p>
        </div>
      )}

      {status === "ended" && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-amber-400 text-lg font-bold">Battle Complete</div>
          <p className="text-gray-400 text-sm">Returning to world...</p>
        </div>
      )}
    </div>
  );
}

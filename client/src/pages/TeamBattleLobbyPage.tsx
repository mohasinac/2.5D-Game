// [PAGE] TeamBattleLobbyPage — lobby for 2v2 team battles.
// Players pick their team (red/blue) and wait for enough participants before the match starts.

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { useGame } from "@/contexts/GameContext";
import { C } from "@/styles/theme";

const TEAM_BATTLE_ROOM = "team_battle_room";

export function TeamBattleLobbyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = modeFromPath(location.pathname);
  const { settings } = useGame();
  const [team, setTeam] = useState<"red" | "blue">("blue");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Array<{ username: string; team: string }>>([]);
  const [status, setStatus] = useState<"waiting" | "ready">("waiting");
  const [copied, setCopied] = useState(false);

  async function handleJoin() {
    // Dynamically import Colyseus client to avoid bundle bloat on non-game pages
    const { Client } = await import("colyseus.js");
    const serverUrl = import.meta.env.VITE_GAME_SERVER_URL ?? "ws://localhost:2567";
    const client = new Client(serverUrl);
    try {
      const room = await client.joinOrCreate(TEAM_BATTLE_ROOM, {
        beybladeId: settings.beybladeId ?? "default",
        arenaId: settings.arenaId ?? "default",
        userId: settings.userId,
        username: settings.username ?? "Player",
        team,
      });
      setRoomId(room.roomId);
      room.onMessage("team-joined", (data: { username: string; team: string }) => {
        setPlayers(prev => [...prev.filter(p => p.username !== data.username), data]);
      });
      room.onMessage("game-start", () => {
        navigate(`/game/${mode}/team-battle/${room.roomId}`);
      });
      room.state.onChange(() => {
        if (room.state.status === "in-progress") {
          navigate(`/game/${mode}/team-battle/${room.roomId}`);
        }
      });
    } catch (err) {
      console.error("Failed to join team battle room:", err);
    }
  }

  const redPlayers = players.filter(p => p.team === "red");
  const bluePlayers = players.filter(p => p.team === "blue");

  return (
    <div className="min-h-screen bg-bg0 flex items-center justify-center p-6">
      <div className="w-full max-w-[560px] flex flex-col gap-5">
        <div>
          <h1 className="text-[24px] font-bold text-theme-text">Team Battle</h1>
          <p className="text-theme-faint text-[13px]">2v2 — pick your team, then join the room</p>
        </div>

        {/* Team picker */}
        <div className="flex gap-2.5">
          {(["blue", "red"] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTeam(t)}
              className="flex-1 py-3.5 rounded-xl text-[16px] font-bold cursor-pointer"
              style={{
                border: `2px solid ${team === t ? (t === "blue" ? C.blue : C.red) : C.border}`,
                background: team === t ? (t === "blue" ? C.blue + "22" : C.red + "22") : "var(--bg2)",
                color: t === "blue" ? C.blue : C.red,
              }}
            >
              {t === "blue" ? "🔵 Blue Team" : "🔴 Red Team"}
            </button>
          ))}
        </div>

        {/* Player lists */}
        <div className="grid grid-cols-2 gap-3">
          {(["blue", "red"] as const).map(t => {
            const list = t === "blue" ? bluePlayers : redPlayers;
            const color = t === "blue" ? C.blue : C.red;
            return (
              <div key={t} className="bg-bg2 rounded-xl p-3.5"
                style={{ border: `1px solid ${color}33` }}>
                <div className="text-[12px] font-bold mb-2 uppercase" style={{ color }}>
                  {t} team ({list.length}/2)
                </div>
                {list.length === 0
                  ? <p className="text-theme-faint text-[12px]">Waiting for players…</p>
                  : list.map(p => (
                    <div key={p.username} className="text-theme-text text-[13px] py-1">{p.username}</div>
                  ))
                }
              </div>
            );
          })}
        </div>

        {/* Room ID share */}
        {roomId && (
          <div className="flex gap-2 items-center bg-bg2 rounded-[10px] px-3 py-2">
            <span className="text-[12px] text-theme-faint">Room ID:</span>
            <span className="font-mono text-[12px] text-theme-text flex-1">{roomId}</span>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(roomId); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="px-2.5 py-1 bg-transparent border border-border-c rounded-md text-theme-muted text-[11px] cursor-pointer"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleJoin}
          disabled={!!roomId}
          className="py-3.5 rounded-xl border-none text-white text-[16px] font-bold"
          style={{
            background: roomId ? C.border : C.blue,
            cursor: roomId ? "default" : "pointer",
            opacity: roomId ? 0.5 : 1,
          }}
        >
          {roomId ? "Waiting for match…" : "Join Team Battle"}
        </button>
      </div>
    </div>
  );
}

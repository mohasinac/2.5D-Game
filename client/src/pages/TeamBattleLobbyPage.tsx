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
    <div style={{ minHeight: "100vh", background: "var(--bg0)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text }}>Team Battle</h1>
          <p style={{ color: C.faint, fontSize: 13 }}>2v2 — pick your team, then join the room</p>
        </div>

        {/* Team picker */}
        <div style={{ display: "flex", gap: 10 }}>
          {(["blue", "red"] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTeam(t)}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 12,
                border: `2px solid ${team === t ? (t === "blue" ? C.blue : C.red) : C.border}`,
                background: team === t ? (t === "blue" ? C.blue + "22" : C.red + "22") : "var(--bg2)",
                color: t === "blue" ? C.blue : C.red,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t === "blue" ? "🔵 Blue Team" : "🔴 Red Team"}
            </button>
          ))}
        </div>

        {/* Player lists */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {(["blue", "red"] as const).map(t => {
            const list = t === "blue" ? bluePlayers : redPlayers;
            const color = t === "blue" ? C.blue : C.red;
            return (
              <div key={t} style={{ background: "var(--bg2)", border: `1px solid ${color}33`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 8, textTransform: "uppercase" }}>
                  {t} team ({list.length}/2)
                </div>
                {list.length === 0
                  ? <p style={{ color: C.faint, fontSize: 12 }}>Waiting for players…</p>
                  : list.map(p => (
                    <div key={p.username} style={{ color: C.text, fontSize: 13, padding: "4px 0" }}>{p.username}</div>
                  ))
                }
              </div>
            );
          })}
        </div>

        {/* Room ID share */}
        {roomId && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", background: "var(--bg2)", borderRadius: 10, padding: "8px 12px" }}>
            <span style={{ fontSize: 12, color: C.faint }}>Room ID:</span>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: C.text, flex: 1 }}>{roomId}</span>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(roomId); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              style={{ padding: "4px 10px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 11, cursor: "pointer" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleJoin}
          disabled={!!roomId}
          style={{ padding: "14px 0", borderRadius: 12, background: roomId ? C.border : C.blue, border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: roomId ? "default" : "pointer", opacity: roomId ? 0.5 : 1 }}
        >
          {roomId ? "Waiting for match…" : "Join Team Battle"}
        </button>
      </div>
    </div>
  );
}

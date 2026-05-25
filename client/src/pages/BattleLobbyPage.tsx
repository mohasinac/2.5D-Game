import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath, roomNameFor } from "@/shared/utils/gameMode";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGame } from "@/contexts/GameContext";
import { C, alpha } from "@/styles/theme";
import { BUILT_IN_MODIFIERS, MODIFIER_MAP } from "@/types/roundModifier";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const TYPE_COLORS_MAP: Record<string, string> = {
  attack: C.red,
  defense: C.blue,
  stamina: C.green,
  balanced: C.yellow,
};

type BestOf = 1 | 3 | 5;

export function BattleLobbyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = modeFromPath(location.pathname);
  const { settings } = useGame();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [bestOf, setBestOf] = useState<BestOf>(1);
  const [copied, setCopied] = useState(false);
  const [selectedModifierIds, setSelectedModifierIds] = useState<string[]>([]);
  const [modeDisabled, setModeDisabled] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "settings", "game")).then((snap) => {
      if (snap.exists() && snap.data().enablePvp === false) setModeDisabled(true);
    }).catch(() => {});
  }, []);

  const MAX_MODIFIERS = 2;

  const toggleModifier = (id: string) => {
    setSelectedModifierIds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : prev.length < MAX_MODIFIERS ? [...prev, id] : prev
    );
  };

  const { connectionState, gameState, beyblades, myBeyblade, room, connect, disconnect } =
    useColyseus({
      roomName: roomNameFor(mode, "battle"),
      options: {
        beybladeId: settings.beybladeId ?? "default",
        arenaId: settings.arenaId ?? "default",
        username: settings.username ?? "Player",
        userId: settings.userId,
        modifierIds: selectedModifierIds,
      },
      autoConnect: true,
    });

  useEffect(() => {
    if (!room) return;
    room.onMessage("countdown", (data: { count: number }) => { setCountdown(data.count); });
    room.onMessage("game-start", () => { setCountdown(null); navigate(`/game/${mode}/battle/${room.roomId}`); });
  }, [room, navigate]);

  useEffect(() => {
    if (gameState?.status === "in-progress" && room) navigate(`/game/${mode}/battle/${room.roomId}`);
  }, [gameState?.status, room, navigate]);

  const playerList = Array.from(beyblades.values());
  const isHost = playerList.length > 0 && playerList[0].userId === settings.userId;
  const canStart = playerList.length >= 2 && isHost;

  const spectateUrl = room ? `${window.location.origin}/game/battle/${room.roomId}?spectate=true` : null;

  const handleCopySpectateLink = () => {
    if (!spectateUrl) return;
    navigator.clipboard.writeText(spectateUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg0, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <Link to="/game" style={{ color: C.faint, fontSize: 13, textDecoration: "none", display: "block", marginBottom: 6 }}>
              ← Back to menu
            </Link>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: "-0.02em" }}>PVP Battle Lobby</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: connectionState === "connected" ? C.green : C.yellow }} className={connectionState === "connected" ? "pulse" : ""} />
            <span style={{ fontSize: 13, color: C.muted, fontFamily: "monospace" }}>{connectionState}</span>
          </div>
        </div>

        {modeDisabled && (
          <div style={{ background: `${C.yellow}18`, border: `1px solid ${C.yellow}44`, borderRadius: 10, padding: "12px 18px", marginBottom: 20, fontSize: 13, color: C.yellow }}>
            PVP Battle is currently disabled by the administrator.
          </div>
        )}

        {/* Room code */}
        {room && (
          <div style={{ marginBottom: 20, background: alpha(C.bg2, 0.53), borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }}>
            <p style={{ fontSize: 11, color: C.faint, marginBottom: 4 }}>Room ID (share with friends)</p>
            <p style={{ fontSize: 16, fontFamily: "monospace", color: C.text, letterSpacing: "0.1em" }}>{room.roomId}</p>
          </div>
        )}

        {/* Player list */}
        <div style={{ background: C.bg1, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>Players</span>
            <span style={{ fontSize: 12, color: C.faint }}>{playerList.length}/4</span>
          </div>

          {playerList.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: C.faint }}>
              <div className="spin" style={{ width: 36, height: 36, border: `2px solid ${C.border}`, borderTopColor: C.blue, borderRadius: "50%", margin: "0 auto 12px" }} />
              <p>Waiting for players to join...</p>
            </div>
          ) : (
            <>
              {playerList.map((player, i) => (
                <div key={player.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.bg3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.muted, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  {player.imageUrl ? (
                    <img src={player.imageUrl} alt={player.username} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "contain", background: C.bg2 }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.bg3, display: "flex", alignItems: "center", justifyContent: "center", color: C.text, fontWeight: 700, flexShrink: 0 }}>
                      {player.username[0]?.toUpperCase()}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ color: C.text, fontWeight: 500, fontSize: 14 }}>{player.username}</span>
                      {i === 0 && (
                        <span style={{ fontSize: 11, color: C.yellow, background: alpha(C.yellow, 0.08), border: `1px solid ${alpha(C.yellow, 0.20)}`, padding: "1px 6px", borderRadius: 4 }}>HOST</span>
                      )}
                      {player.userId === settings.userId && (
                        <span style={{ fontSize: 11, color: C.faint }}>(you)</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: "capitalize", color: TYPE_COLORS_MAP[player.type] ?? C.muted }}>
                      {player.type}
                    </span>
                  </div>
                  <span style={{ color: C.green, fontSize: 16 }}>✓</span>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 2 - playerList.length) }).map((_, i) => (
                <div key={`empty-${i}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", opacity: 0.4 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "transparent", border: `1px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: C.faint }}>
                    {playerList.length + i + 1}
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "transparent", border: `1px dashed ${C.border}` }} />
                  <span style={{ color: C.faint, fontSize: 13 }}>Waiting for player...</span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Host controls: format selector + spectate link */}
        {isHost && (
          <div style={{ background: C.bg1, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 10, fontWeight: 600 }}>Match Format</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {([1, 3, 5] as BestOf[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setBestOf(n)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", border: `1px solid ${bestOf === n ? C.blue : C.border}`,
                    background: bestOf === n ? alpha(C.blue, 0.13) : "transparent",
                    color: bestOf === n ? C.blue : C.muted,
                  }}
                >
                  BO{n}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: C.faint, marginBottom: 14 }}>
              {bestOf === 1 ? "Single match — first to win takes it." : `First to ${Math.ceil(bestOf / 2)} wins the series.`}
            </p>

            {/* Round modifier picker */}
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>
              Round Modifiers
              <span style={{ fontSize: 11, color: C.faint, fontWeight: 400, marginLeft: 6 }}>
                ({selectedModifierIds.length}/{MAX_MODIFIERS} selected)
              </span>
            </p>
            {(["physics", "combat", "rules", "chaos"] as const).map(category => {
              const group = BUILT_IN_MODIFIERS.filter(m => m.category === category);
              return (
                <div key={category} style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 10, color: C.faint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{category}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {group.map(mod => {
                      const selected = selectedModifierIds.includes(mod.id);
                      const disabled = !selected && selectedModifierIds.length >= MAX_MODIFIERS;
                      return (
                        <button
                          key={mod.id}
                          data-testid={`modifier-toggle-${mod.id}`}
                          onClick={() => toggleModifier(mod.id)}
                          disabled={disabled}
                          title={mod.description}
                          style={{
                            padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                            cursor: disabled ? "not-allowed" : "pointer",
                            border: `1px solid ${selected ? C.yellow : C.border}`,
                            background: selected ? alpha(C.yellow, 0.15) : "transparent",
                            color: selected ? C.yellow : disabled ? alpha(C.muted, 0.4) : C.muted,
                            display: "flex", alignItems: "center", gap: 4,
                            transition: "all 0.1s",
                          }}
                        >
                          {mod.icon && <span style={{ fontSize: 13 }}>{mod.icon}</span>}
                          {mod.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {selectedModifierIds.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10, padding: "8px 10px", background: alpha(C.yellow, 0.06), borderRadius: 8, border: `1px solid ${alpha(C.yellow, 0.18)}` }}>
                <span style={{ fontSize: 11, color: C.faint, width: "100%", marginBottom: 4 }}>Active:</span>
                {selectedModifierIds.map(id => {
                  const mod = MODIFIER_MAP.get(id);
                  if (!mod) return null;
                  return (
                    <span key={id} style={{ fontSize: 11, color: C.yellow, fontFamily: "monospace" }}>
                      {mod.icon} {mod.name}
                    </span>
                  );
                })}
              </div>
            )}

            {spectateUrl && (
              <>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 6, fontWeight: 600 }}>Spectate Link</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    readOnly
                    value={spectateUrl}
                    style={{ flex: 1, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.muted, fontSize: 11, fontFamily: "monospace" }}
                  />
                  <button
                    onClick={handleCopySpectateLink}
                    style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: copied ? alpha(C.green, 0.13) : C.bg3, color: copied ? C.green : C.muted, border: `1px solid ${copied ? C.green : C.border}` }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Start button */}
        <div style={{ textAlign: "center" }}>
          {isHost ? (
            <button
              onClick={() => room && canStart && room.send("start-game", { bestOf })}
              disabled={!canStart || modeDisabled}
              style={{
                padding: "14px 40px", borderRadius: 12, fontWeight: 700, fontSize: 16,
                cursor: canStart ? "pointer" : "not-allowed",
                background: canStart ? C.red : C.bg3,
                color: canStart ? C.white : C.faint,
                border: "none",
              }}
            >
              {canStart ? `Start Battle! (BO${bestOf})` : `Waiting for ${2 - playerList.length} more player${2 - playerList.length !== 1 ? "s" : ""}...`}
            </button>
          ) : (
            <p style={{ color: C.faint }}>Waiting for host to start the match...</p>
          )}
          <p style={{ fontSize: 12, color: C.faint, marginTop: 10 }}>2-4 players · Last beyblade standing wins</p>
        </div>
      </div>

      {/* Countdown overlay */}
      {countdown !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 120, fontWeight: 900, color: C.text, fontFamily: "monospace" }}>{countdown}</div>
            <p style={{ color: C.muted, marginTop: 16, fontSize: 18 }}>Match starting...</p>
          </div>
        </div>
      )}
    </div>
  );
}

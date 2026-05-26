import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { modeFromPath, roomNameFor } from "@/shared/utils/gameMode";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGame } from "@/contexts/GameContext";
import { BUILT_IN_MODIFIERS, MODIFIER_MAP } from "@/types/roundModifier";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/cn";

const TYPE_COLORS_MAP: Record<string, string> = {
  attack: "text-theme-red",
  defense: "text-theme-blue",
  stamina: "text-theme-green",
  balanced: "text-theme-yellow",
};

type BestOf = 1 | 3 | 5;

export function BattleLobbyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const mode = modeFromPath(location.pathname);
  const { settings } = useGame();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [bestOf, setBestOf] = useState<BestOf>(1);
  const [copied, setCopied] = useState(false);
  const [copiedJoin, setCopiedJoin] = useState(false);
  const [selectedModifierIds, setSelectedModifierIds] = useState<string[]>([]);
  const [modeDisabled, setModeDisabled] = useState(false);

  // If ?join=ROOM_ID is present, attempt to join that specific room (private match invite).
  const inviteRoomId = searchParams.get("join") ?? undefined;

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

  const colyseusOptions = useMemo(() => ({
    beybladeId: settings.beybladeId ?? "default",
    arenaId: settings.arenaId ?? "default",
    username: settings.username ?? "Player",
    userId: settings.userId,
    modifierIds: selectedModifierIds,
  }), [settings.beybladeId, settings.arenaId, settings.username, settings.userId, selectedModifierIds]);

  const { connectionState, gameState, beyblades, myBeyblade, room, connect, disconnect } =
    useColyseus({
      roomName: roomNameFor(mode, "battle"),
      roomId: inviteRoomId,
      options: colyseusOptions,
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
    <div className="min-h-screen bg-bg0 flex items-center justify-center p-4">
      <div className="w-full max-w-[560px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link to="/game" className="text-theme-faint text-[13px] no-underline block mb-1.5">
              ← Back to menu
            </Link>
            <h1 className="text-[28px] font-black text-theme-text tracking-[-0.02em]">PVP Battle Lobby</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              connectionState === "connected" ? "bg-theme-green pulse" : "bg-theme-yellow"
            )} />
            <span className="text-[13px] text-theme-muted font-mono">{connectionState}</span>
          </div>
        </div>

        {modeDisabled && (
          <div className="bg-theme-yellow/[.09] border border-theme-yellow/[.27] rounded-[10px] px-[18px] py-3 mb-5 text-[13px] text-theme-yellow">
            PVP Battle is currently disabled by the administrator.
          </div>
        )}

        {/* Room code + private match invite */}
        {room && (
          <div className="mb-5 bg-bg2/[.53] rounded-xl border border-border-c p-4">
            <p className="text-[11px] text-theme-faint mb-1">Room ID (share with friends)</p>
            <div className="flex items-center gap-2">
              <p className="text-[16px] font-mono text-theme-text tracking-widest flex-1 m-0">{room.roomId}</p>
              <button
                data-testid="copy-join-link"
                onClick={() => {
                  const joinUrl = `${window.location.origin}/game/${mode}/battle/lobby?join=${room.roomId}`;
                  navigator.clipboard.writeText(joinUrl).then(() => {
                    setCopiedJoin(true);
                    setTimeout(() => setCopiedJoin(false), 2000);
                  });
                }}
                className={cn(
                  "py-[5px] px-3 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap border",
                  copiedJoin
                    ? "bg-green-13 text-theme-green border-theme-green"
                    : "bg-bg3 text-theme-muted border-border-c"
                )}
              >
                {copiedJoin ? "Copied!" : "Copy Invite Link"}
              </button>
            </div>
            {inviteRoomId && (
              <p className="text-[11px] text-theme-blue mt-1.5">Joining private room {inviteRoomId}</p>
            )}
          </div>
        )}

        {/* Player list */}
        <div className="bg-bg1 rounded-2xl border border-border-c overflow-hidden mb-5">
          <div className="px-4 py-[10px] border-b border-border-c flex justify-between items-center">
            <span className="text-[13px] font-semibold text-theme-muted">Players</span>
            <span className="text-[12px] text-theme-faint">{playerList.length}/4</span>
          </div>

          {playerList.length === 0 ? (
            <div className="p-8 text-center text-theme-faint">
              <div className="spin w-9 h-9 border-2 border-border-c border-t-theme-blue rounded-full mx-auto mb-3" />
              <p>Waiting for players to join...</p>
            </div>
          ) : (
            <>
              {playerList.map((player, i) => (
                <div key={player.id} className="flex items-center gap-3 px-4 py-3 border-b border-border-c">
                  <div className="w-8 h-8 rounded-full bg-bg3 flex items-center justify-center text-[13px] font-bold text-theme-muted shrink-0">
                    {i + 1}
                  </div>
                  {player.imageUrl ? (
                    <img src={player.imageUrl} alt={player.username} className="w-10 h-10 rounded-full object-contain bg-bg2" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-bg3 flex items-center justify-center text-theme-text font-bold shrink-0">
                      {player.username[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-theme-text font-medium text-[14px]">{player.username}</span>
                      {i === 0 && (
                        <span className="text-[11px] text-theme-yellow bg-yellow-10 border border-yellow-20 px-1.5 py-px rounded">HOST</span>
                      )}
                      {player.userId === settings.userId && (
                        <span className="text-[11px] text-theme-faint">(you)</span>
                      )}
                    </div>
                    <span className={cn("text-[11px] font-semibold capitalize", TYPE_COLORS_MAP[player.type] ?? "text-theme-muted")}>
                      {player.type}
                    </span>
                  </div>
                  <span className="text-theme-green text-[16px]">✓</span>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 2 - playerList.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-3 px-4 py-3 opacity-40">
                  <div className="w-8 h-8 rounded-full bg-transparent border border-dashed border-border-c flex items-center justify-center text-[13px] text-theme-faint">
                    {playerList.length + i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-transparent border border-dashed border-border-c" />
                  <span className="text-theme-faint text-[13px]">Waiting for player...</span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Host controls: format selector + spectate link */}
        {isHost && (
          <div className="bg-bg1 rounded-[14px] border border-border-c p-4 mb-5">
            <p className="text-[12px] text-theme-muted mb-2.5 font-semibold">Match Format</p>
            <div className="flex gap-2 mb-3.5">
              {([1, 3, 5] as BestOf[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setBestOf(n)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-[13px] font-bold cursor-pointer border",
                    bestOf === n
                      ? "border-theme-blue bg-blue-13 text-theme-blue"
                      : "border-border-c bg-transparent text-theme-muted"
                  )}
                >
                  BO{n}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-theme-faint mb-3.5">
              {bestOf === 1 ? "Single match — first to win takes it." : `First to ${Math.ceil(bestOf / 2)} wins the series.`}
            </p>

            {/* Round modifier picker */}
            <p className="text-[12px] text-theme-muted mb-2 font-semibold">
              Round Modifiers
              <span className="text-[11px] text-theme-faint font-normal ml-1.5">
                ({selectedModifierIds.length}/{MAX_MODIFIERS} selected)
              </span>
            </p>
            {(["physics", "combat", "rules", "chaos"] as const).map(category => {
              const group = BUILT_IN_MODIFIERS.filter(m => m.category === category);
              return (
                <div key={category} className="mb-2.5">
                  <p className="text-[10px] text-theme-faint uppercase tracking-[0.08em] mb-1">{category}</p>
                  <div className="flex flex-wrap gap-[5px]">
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
                          className={cn(
                            "py-1 px-2.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all duration-100 border",
                            selected
                              ? "border-theme-yellow bg-yellow-10 text-theme-yellow"
                              : disabled
                              ? "border-border-c bg-transparent text-theme-muted/40 cursor-not-allowed"
                              : "border-border-c bg-transparent text-theme-muted cursor-pointer"
                          )}
                        >
                          {mod.icon && <span className="text-[13px]">{mod.icon}</span>}
                          {mod.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {selectedModifierIds.length > 0 && (
              <div className="flex flex-wrap gap-[5px] mb-2.5 p-2 bg-yellow-10 rounded-lg border border-yellow-20">
                <span className="text-[11px] text-theme-faint w-full mb-1">Active:</span>
                {selectedModifierIds.map(id => {
                  const mod = MODIFIER_MAP.get(id);
                  if (!mod) return null;
                  return (
                    <span key={id} className="text-[11px] text-theme-yellow font-mono">
                      {mod.icon} {mod.name}
                    </span>
                  );
                })}
              </div>
            )}

            {spectateUrl && (
              <>
                <p className="text-[12px] text-theme-muted mb-1.5 font-semibold">Spectate Link</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={spectateUrl}
                    className="flex-1 bg-bg3 border border-border-c rounded-lg px-2.5 py-1.5 text-theme-muted text-[11px] font-mono"
                  />
                  <button
                    onClick={handleCopySpectateLink}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer border",
                      copied
                        ? "bg-green-13 text-theme-green border-theme-green"
                        : "bg-bg3 text-theme-muted border-border-c"
                    )}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Start button */}
        <div className="text-center">
          {isHost ? (
            <button
              onClick={() => room && canStart && room.send("start-game", { bestOf })}
              disabled={!canStart || modeDisabled}
              className={cn(
                "py-3.5 px-10 rounded-xl font-bold text-[16px] border-none",
                canStart ? "bg-theme-red text-white cursor-pointer" : "bg-bg3 text-theme-faint cursor-not-allowed"
              )}
            >
              {canStart ? `Start Battle! (BO${bestOf})` : `Waiting for ${2 - playerList.length} more player${2 - playerList.length !== 1 ? "s" : ""}...`}
            </button>
          ) : (
            <p className="text-theme-faint">Waiting for host to start the match...</p>
          )}
          <p className="text-[12px] text-theme-faint mt-2.5">2-4 players · Last beyblade standing wins</p>
        </div>
      </div>

      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-[120px] font-black text-theme-text font-mono">{countdown}</div>
            <p className="text-theme-muted mt-4 text-[18px]">Match starting...</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useColyseus } from "@/game/hooks/useColyseus";
import { useGame } from "@/contexts/GameContext";
import { BUILT_IN_MODIFIERS, MODIFIER_MAP } from "@/types/roundModifier";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/cn";

// ─── Mode detection from pathname ────────────────────────────────────────────

type LobbyMode = 'pvp' | 'royale' | 'tournament';

function modeFromPathname(pathname: string): LobbyMode {
  if (pathname.includes('/royale/')) return 'royale';
  if (pathname.includes('/tournament/')) return 'tournament';
  return 'pvp';
}

function roomNameForMode(mode: LobbyMode): string {
  if (mode === 'royale') return 'royale_battle_room';
  if (mode === 'tournament') return 'tournament_battle_25d_room';
  return 'battle_25d_room';
}

function maxPlayersForMode(mode: LobbyMode): number {
  if (mode === 'royale') return 12;
  if (mode === 'tournament') return 16;
  return 4;
}

const MODE_LABELS: Record<LobbyMode, string> = {
  pvp: 'PVP BATTLE',
  royale: 'BATTLE ROYALE',
  tournament: 'TOURNAMENT',
};

type BestOf = 1 | 3 | 5;

// ─── Phase types ──────────────────────────────────────────────────────────────

type Phase =
  | 'choose'          // Phase 1: Random vs Friends
  | 'random-prefs'    // Preference picker before random match
  | 'random-connect'  // Connecting to random match
  | 'friends-choose'  // Friends: Create vs Join sub-choice
  | 'friends-create'  // Waiting for room creation (connecting)
  | 'friends-join'    // Input room code
  | 'in-lobby';       // Phase 2: in the room

// Matchmaking size options per mode
type PvPSize   = '1v1' | 'ffa';
type RoyaleSize = '4' | '8' | '12';
type MatchSize = PvPSize | RoyaleSize;

// ─── Colour helpers ───────────────────────────────────────────────────────────

const TYPE_COLORS_MAP: Record<string, string> = {
  attack: 'text-red-400',
  defense: 'text-blue-400',
  stamina: 'text-green-400',
  balanced: 'text-yellow-400',
};

// ─── Card component ───────────────────────────────────────────────────────────

function PhaseCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      'rounded-2xl border border-white/[.08] bg-[#111120] p-6',
      className,
    )}>
      {children}
    </div>
  );
}

function ActionBtn({
  label, onClick, primary, disabled, className,
}: {
  label: string; onClick: () => void; primary?: boolean; disabled?: boolean; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full py-3 rounded-xl font-bold text-[15px] border cursor-pointer transition-all duration-150',
        primary
          ? 'bg-[#00e5ff] text-[#0a0a0f] border-[#00e5ff] hover:bg-[#00d4eb]'
          : 'bg-transparent text-white border-white/[.15] hover:border-white/30',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className,
      )}
    >
      {label}
    </button>
  );
}

// ─── Connecting spinner ───────────────────────────────────────────────────────

function ConnectingSpinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="w-12 h-12 rounded-full border-2 border-[#00e5ff]/30 border-t-[#00e5ff] animate-spin" />
      <p className="text-white/60 text-[14px]">{label}</p>
    </div>
  );
}

// ─── Player slot (lobby) ─────────────────────────────────────────────────────

function PlayerSlot({
  index, username, beyType, imageUrl, isSelf, isHost, isEmpty,
}: {
  index: number; username?: string; beyType?: string; imageUrl?: string;
  isSelf?: boolean; isHost?: boolean; isEmpty?: boolean;
}) {
  if (isEmpty) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 opacity-35">
        <div className="w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center text-[12px] text-white/40">
          {index + 1}
        </div>
        <div className="w-9 h-9 rounded-full border border-dashed border-white/15" />
        <span className="text-white/35 text-[13px]">Waiting…</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-full bg-white/[.06] flex items-center justify-center text-[12px] font-bold text-white/50 shrink-0">
        {index + 1}
      </div>
      {imageUrl ? (
        <img src={imageUrl} alt={username} className="w-9 h-9 rounded-full object-contain bg-white/[.06]" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-white/[.08] flex items-center justify-center text-white font-bold shrink-0">
          {username?.[0]?.toUpperCase() ?? '?'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-[13px] truncate">{username}</span>
          {isHost && <span className="text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-1.5 py-px rounded">HOST</span>}
          {isSelf && <span className="text-[11px] text-white/35">(you)</span>}
        </div>
        {beyType && (
          <span className={cn('text-[11px] font-semibold capitalize', TYPE_COLORS_MAP[beyType] ?? 'text-white/50')}>
            {beyType}
          </span>
        )}
      </div>
      <span className="text-green-400 text-[15px]">✓</span>
    </div>
  );
}

// ─── Royale 12-slot grid ──────────────────────────────────────────────────────

function RoyaleGrid({
  players, myUserId,
}: {
  players: Array<{ id: string; username: string; userId?: string; type?: string; imageUrl?: string }>;
  myUserId?: string;
}) {
  const slots = Array.from({ length: 12 }).map((_, i) => players[i] ?? null);
  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {slots.map((p, i) => (
        <div key={i} className={cn(
          'rounded-xl border p-2 flex flex-col items-center gap-1 min-h-[72px] justify-center',
          p ? 'border-white/[.12] bg-white/[.04]' : 'border-dashed border-white/[.07] bg-transparent',
        )}>
          {p ? (
            <>
              <div className="w-8 h-8 rounded-full bg-white/[.1] flex items-center justify-center text-white font-bold text-[12px]">
                {p.username?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="text-white text-[10px] font-medium truncate w-full text-center leading-tight">{p.username}</span>
              {p.userId === myUserId && <span className="text-[9px] text-[#00e5ff]">YOU</span>}
            </>
          ) : (
            <span className="text-white/20 text-[11px]">Waiting…</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BattleLobbyPage() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const { settings } = useGame();

  const lobbyMode   = modeFromPathname(location.pathname);
  const roomName    = roomNameForMode(lobbyMode);
  const maxPlayers  = maxPlayersForMode(lobbyMode);

  // Phase state
  const [phase, setPhase]           = useState<Phase>('choose');
  const [joinCode, setJoinCode]     = useState('');
  const [isPrivate, setIsPrivate]   = useState(false);

  // Random match preferences (persisted per mode)
  const prefsKey = `bey.randomPrefs.${lobbyMode}`;
  const savedPrefs = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(prefsKey) ?? '{}'); } catch { return {}; }
  }, [prefsKey]);

  const defaultSize: MatchSize = lobbyMode === 'royale'
    ? (savedPrefs.size ?? '4') as RoyaleSize
    : (savedPrefs.size ?? '1v1') as PvPSize;

  const [matchSize, setMatchSize]       = useState<MatchSize>(defaultSize);
  const [randomBestOf, setRandomBestOf] = useState<BestOf>((savedPrefs.bestOf ?? 1) as BestOf);

  const savePrefs = (size: MatchSize, bo: BestOf) => {
    try { localStorage.setItem(prefsKey, JSON.stringify({ size, bestOf: bo })); } catch {}
  };

  // Lobby controls
  const [bestOf, setBestOf]         = useState<BestOf>(1);
  const [bracketSize, setBracketSize] = useState<4 | 8 | 16>(4);
  const [selectedModifierIds, setSelectedModifierIds] = useState<string[]>([]);
  const [copied, setCopied]         = useState(false);
  const [modeDisabled, setModeDisabled] = useState(false);

  // triggerConnect pattern: avoids stale closure when calling connect() right after setState
  const [triggerConnect, setTriggerConnect] = useState(false);
  const [connectRoomId, setConnectRoomId] = useState<string | undefined>(undefined);

  // Used in refs so connect() closure always reads the latest values
  const roomIdRef   = useRef<string | undefined>(undefined);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'game')).then(snap => {
      if (snap.exists() && snap.data().enablePvp === false) setModeDisabled(true);
    }).catch(() => {});
  }, []);

  const colyseusOptions = useMemo(() => ({
    beybladeId:  settings.beybladeId ?? 'default',
    arenaId:     settings.arenaId    ?? 'default',
    username:    settings.username   ?? 'Player',
    userId:      settings.userId,
    private:     isPrivate,
    modifierIds: selectedModifierIds,
    bracketSize: lobbyMode === 'tournament' ? bracketSize : undefined,
    // filterBy fields — segregate matchmaking pools by size + bestOf
    size:    matchSize,
    bestOf:  isPrivate ? bestOf : randomBestOf,
  }), [settings.beybladeId, settings.arenaId, settings.username, settings.userId,
       isPrivate, selectedModifierIds, lobbyMode, bracketSize, matchSize, bestOf, randomBestOf]);

  const { connectionState, gameState, beyblades, room, connect, disconnect } =
    useColyseus({
      roomName,
      roomId: connectRoomId,
      options: colyseusOptions,
      autoConnect: false,
    });

  // Fire connect() one tick after triggerConnect is set (avoids stale closure)
  useEffect(() => {
    if (!triggerConnect) return;
    setTriggerConnect(false);
    connect();
  }, [triggerConnect]); // intentionally omit `connect` — called once per trigger

  // Transition to in-lobby when connected
  useEffect(() => {
    if (connectionState === 'connected' && phase !== 'in-lobby') {
      setPhase('in-lobby');
    }
  }, [connectionState, phase]);

  // Navigate to game room when match starts
  useEffect(() => {
    if (gameState?.status === 'in-progress' && room) {
      navigate('/game/room', { replace: true, state: {
        config: {
          roomType: lobbyMode === 'pvp' ? 'pvp' : lobbyMode === 'royale' ? 'royale' : 'tournament',
          beybladeId: settings.beybladeId ?? 'default',
          arenaId:    settings.arenaId    ?? 'default',
          is25D:      true,
          pvpRoomId:  room.roomId,
        },
      }});
    }
  }, [gameState?.status, room, navigate, lobbyMode, settings]);

  // Server closed room (idle timeout) — bounce back to Phase 1
  useEffect(() => {
    if (connectionState === 'disconnected' && phase === 'in-lobby') {
      toast('Room closed (no players)', { icon: '🚪', style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid #2d2d44' } });
      setPhase('choose');
      setConnectRoomId(undefined);
      roomIdRef.current = undefined;
    }
  }, [connectionState, phase]);

  const playerList = Array.from(beyblades.values());
  const myUserId   = settings.userId;
  const isHost     = playerList.length > 0 && playerList[0].userId === myUserId;
  const canStart   = playerList.length >= 2 && isHost;

  const handleLeave = useCallback(() => {
    disconnect();
    setPhase('choose');
    setConnectRoomId(undefined);
    roomIdRef.current = undefined;
  }, [disconnect]);

  const handleCopyCode = () => {
    if (!room?.roomId) return;
    navigator.clipboard.writeText(room.roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const MAX_MODIFIERS = 2;
  const toggleModifier = (id: string) => {
    setSelectedModifierIds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : prev.length < MAX_MODIFIERS ? [...prev, id] : prev
    );
  };

  // ── Phase 1: choose ─────────────────────────────────────────────────────────

  if (phase === 'choose') {
    return (
      <div className="h-screen overflow-hidden bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[520px]">
          <button
            onClick={() => navigate('/game/battle', { replace: true })}
            className="text-white/40 text-[13px] mb-6 flex items-center gap-1 hover:text-white/60 transition-colors"
          >
            ← Back to Battle Mode
          </button>
          <h1 className="text-[28px] font-black text-white tracking-tight mb-2">
            {MODE_LABELS[lobbyMode]}
          </h1>
          <p className="text-white/50 text-[14px] mb-8">
            {lobbyMode === 'royale'
              ? 'Up to 12 players. Last bey standing wins.'
              : lobbyMode === 'tournament'
              ? 'Compete in a bracket. Unfilled slots become AI bots.'
              : 'Fight a real opponent online.'}
          </p>

          {modeDisabled && (
            <div className="mb-5 bg-yellow-400/[.08] border border-yellow-400/25 rounded-xl px-4 py-3 text-[13px] text-yellow-400">
              This mode is currently disabled by the administrator.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Random Match */}
            <PhaseCard className="flex flex-col gap-3">
              <div className="text-[#00e5ff] text-2xl mb-1">⚡</div>
              <h2 className="text-white font-bold text-[16px]">RANDOM MATCH</h2>
              <p className="text-white/45 text-[12px] flex-1">
                Auto-matched with strangers online. Jump in instantly.
              </p>
              <ActionBtn
                label="Find Match"
                primary
                disabled={modeDisabled}
                onClick={() => setPhase('random-prefs')}
              />
            </PhaseCard>

            {/* Friends Room */}
            <PhaseCard className="flex flex-col gap-3">
              <div className="text-purple-400 text-2xl mb-1">🔗</div>
              <h2 className="text-white font-bold text-[16px]">FRIENDS ROOM</h2>
              <p className="text-white/45 text-[12px] flex-1">
                Create a private room and share the code with friends.
              </p>
              <div className="flex flex-col gap-2">
                <ActionBtn
                  label="Create Room"
                  primary
                  disabled={modeDisabled}
                  onClick={() => {
                    setIsPrivate(true);
                    setConnectRoomId(undefined);
                    setPhase('friends-create');
                    setTriggerConnect(true);
                  }}
                />
                <ActionBtn
                  label="Join with Code"
                  disabled={modeDisabled}
                  onClick={() => setPhase('friends-join')}
                />
              </div>
            </PhaseCard>
          </div>
        </div>
      </div>
    );
  }

  // ── Phase: random-prefs (matchmaking preference picker) ─────────────────────

  if (phase === 'random-prefs') {
    const isPvP     = lobbyMode === 'pvp';
    const isRoyale  = lobbyMode === 'royale';
    const pvpSizes: PvPSize[]     = ['1v1', 'ffa'];
    const royaleSizes: RoyaleSize[] = ['4', '8', '12'];
    const pvpSizeLabels: Record<PvPSize, string>     = { '1v1': '1v1', 'ffa': 'Free-for-All' };
    const royaleSizeLabels: Record<RoyaleSize, string> = { '4': '4 Players', '8': '8 Players', '12': '12 Players' };

    return (
      <div className="h-screen overflow-hidden bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[420px]">
          <button
            onClick={() => setPhase('choose')}
            className="text-white/40 text-[13px] mb-6 flex items-center gap-1 hover:text-white/60 transition-colors"
          >
            ← Back
          </button>

          <h1 className="text-[24px] font-black text-white tracking-tight mb-1">
            Match Preferences
          </h1>
          <p className="text-white/45 text-[13px] mb-6">
            Choose your preferred format. You'll be matched with players who chose the same settings.
          </p>

          <PhaseCard className="mb-4">
            {/* Battle format / size */}
            <p className="text-white/50 text-[11px] font-semibold uppercase tracking-[0.08em] mb-3">
              {isRoyale ? 'Room Size' : 'Battle Format'}
            </p>
            <div className="flex gap-2 mb-5">
              {isPvP && pvpSizes.map(s => (
                <button
                  key={s}
                  onClick={() => setMatchSize(s)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-[14px] font-bold border transition-all cursor-pointer',
                    matchSize === s
                      ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]'
                      : 'border-white/[.1] bg-transparent text-white/50 hover:border-white/25',
                  )}
                >
                  {pvpSizeLabels[s]}
                </button>
              ))}
              {isRoyale && royaleSizes.map(s => (
                <button
                  key={s}
                  onClick={() => setMatchSize(s)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-[13px] font-bold border transition-all cursor-pointer',
                    matchSize === s
                      ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]'
                      : 'border-white/[.1] bg-transparent text-white/50 hover:border-white/25',
                  )}
                >
                  {royaleSizeLabels[s as RoyaleSize]}
                </button>
              ))}
              {!isPvP && !isRoyale && pvpSizes.map(s => (
                <button
                  key={s}
                  onClick={() => setMatchSize(s)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-[14px] font-bold border transition-all cursor-pointer',
                    matchSize === s
                      ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]'
                      : 'border-white/[.1] bg-transparent text-white/50 hover:border-white/25',
                  )}
                >
                  {pvpSizeLabels[s as PvPSize]}
                </button>
              ))}
            </div>

            {/* Best-of (PvP / tournament, not royale) */}
            {!isRoyale && (
              <>
                <p className="text-white/50 text-[11px] font-semibold uppercase tracking-[0.08em] mb-3">Best-of</p>
                <div className="flex gap-2">
                  {([1, 3, 5] as BestOf[]).map(n => (
                    <button
                      key={n}
                      onClick={() => setRandomBestOf(n)}
                      className={cn(
                        'flex-1 py-3 rounded-xl text-[14px] font-bold border transition-all cursor-pointer',
                        randomBestOf === n
                          ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]'
                          : 'border-white/[.1] bg-transparent text-white/50 hover:border-white/25',
                      )}
                    >
                      BO{n}
                    </button>
                  ))}
                </div>
              </>
            )}
          </PhaseCard>

          <p className="text-white/30 text-[12px] text-center mb-5">
            {isRoyale
              ? `You'll join a ${matchSize}-player public room.`
              : matchSize === '1v1'
              ? `You'll be matched in a 1-on-1 Best of ${randomBestOf} battle.`
              : `You'll join a free-for-all room (up to 4 players), Best of ${randomBestOf}.`}
          </p>

          <ActionBtn
            label="Find Match →"
            primary
            onClick={() => {
              savePrefs(matchSize, randomBestOf);
              setIsPrivate(false);
              setConnectRoomId(undefined);
              setPhase('random-connect');
              setTriggerConnect(true);
            }}
          />
        </div>
      </div>
    );
  }

  // ── Phase: random-connect / friends-create ───────────────────────────────────

  if (phase === 'random-connect' || phase === 'friends-create') {
    const label = phase === 'random-connect'
      ? 'Searching for opponent…'
      : 'Creating your room…';
    return (
      <div className="h-screen overflow-hidden bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[360px]">
          <PhaseCard>
            <ConnectingSpinner label={label} />
            {connectionState === 'error' && (
              <p className="text-red-400 text-[13px] text-center mb-4">
                Connection failed. Check your internet and try again.
              </p>
            )}
            <ActionBtn label="Cancel" onClick={() => {
              disconnect();
              setPhase('choose');
            }} />
          </PhaseCard>
        </div>
      </div>
    );
  }

  // ── Phase: friends-join (code input) ─────────────────────────────────────────

  if (phase === 'friends-join') {
    return (
      <div className="h-screen overflow-hidden bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[360px]">
          <PhaseCard>
            <h2 className="text-white font-bold text-[18px] mb-1">Join a Room</h2>
            <p className="text-white/45 text-[13px] mb-5">Enter the room code shared by your friend.</p>
            <input
              type="text"
              placeholder="Enter room code…"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.trim())}
              className="w-full bg-white/[.06] border border-white/[.1] rounded-xl px-4 py-3 text-white font-mono text-[16px] tracking-widest mb-4 outline-none focus:border-[#00e5ff]/50"
            />
            {connectionState === 'error' && (
              <p className="text-red-400 text-[13px] mb-3">
                Could not find room "{joinCode}". Check the code and try again.
              </p>
            )}
            <div className="flex flex-col gap-2">
              <ActionBtn
                label={connectionState === 'connecting' ? 'Joining…' : 'Join Room'}
                primary
                disabled={!joinCode || connectionState === 'connecting'}
                onClick={() => {
                  setIsPrivate(false);
                  setConnectRoomId(joinCode);
                  roomIdRef.current = joinCode;
                  setTriggerConnect(true);
                }}
              />
              <ActionBtn label="← Back" onClick={() => {
                disconnect();
                setPhase('choose');
              }} />
            </div>
          </PhaseCard>
        </div>
      </div>
    );
  }

  // ── Phase: in-lobby ───────────────────────────────────────────────────────────

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0f] flex flex-col items-center p-4 pt-6">
      <div className="w-full max-w-[540px] flex flex-col h-full overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-black text-white tracking-tight">{MODE_LABELS[lobbyMode]}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className={cn(
                'w-2 h-2 rounded-full',
                connectionState === 'connected' ? 'bg-green-400' : 'bg-yellow-400',
              )} />
              <span className="text-white/45 text-[12px] font-mono">{connectionState}</span>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="text-white/40 text-[13px] hover:text-white/70 transition-colors"
          >
            ← Leave Room
          </button>
        </div>

        {/* Room code (Friends Room only) */}
        {isPrivate && room?.roomId && (
          <div className="mb-4 bg-white/[.04] rounded-xl border border-white/[.08] px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.1em] mb-0.5">Room Code</p>
              <p className="text-white font-mono text-[18px] tracking-[0.2em] font-bold">{room.roomId}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className={cn(
                'py-1.5 px-4 rounded-lg text-[12px] font-semibold border transition-all',
                copied
                  ? 'bg-green-400/10 text-green-400 border-green-400/30'
                  : 'bg-white/[.06] text-white/60 border-white/[.1] hover:border-white/25',
              )}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}

        {/* Random match room code (show for discovery) */}
        {!isPrivate && room?.roomId && (
          <div className="mb-4 bg-white/[.03] rounded-xl border border-white/[.06] px-4 py-2 flex items-center justify-between">
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.1em] mb-0.5">Room ID</p>
              <p className="text-white/60 font-mono text-[13px]">{room.roomId}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="py-1 px-3 rounded-lg text-[11px] font-semibold border bg-white/[.04] text-white/40 border-white/[.08] hover:border-white/20 transition-all"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}

        {/* Player list / Royale grid */}
        <div className="bg-[#111120] rounded-2xl border border-white/[.08] overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-white/[.07] flex items-center justify-between">
            <span className="text-white/60 text-[13px] font-semibold">Players</span>
            <span className="text-white/35 text-[12px]">{playerList.length}/{maxPlayers}</span>
          </div>

          {playerList.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#00e5ff] animate-spin mx-auto mb-3" />
              <p className="text-white/40 text-[13px]">Waiting for players to join…</p>
            </div>
          ) : lobbyMode === 'royale' ? (
            <RoyaleGrid players={playerList} myUserId={myUserId} />
          ) : (
            <>
              {playerList.map((p, i) => (
                <PlayerSlot
                  key={p.id}
                  index={i}
                  username={p.username}
                  beyType={p.type}
                  imageUrl={p.imageUrl}
                  isSelf={p.userId === myUserId}
                  isHost={i === 0}
                />
              ))}
              {Array.from({ length: Math.max(0, 2 - playerList.length) }).map((_, i) => (
                <PlayerSlot key={`empty-${i}`} index={playerList.length + i} isEmpty />
              ))}
            </>
          )}
        </div>

        {/* Host controls */}
        {isHost && (
          <div className="bg-[#111120] rounded-2xl border border-white/[.08] p-4 mb-4">
            {/* Best-of selector (PvP / tournament) */}
            {lobbyMode !== 'royale' && (
              <>
                <p className="text-white/50 text-[12px] font-semibold mb-2 uppercase tracking-[0.08em]">Match Format</p>
                <div className="flex gap-2 mb-4">
                  {([1, 3, 5] as BestOf[]).map(n => (
                    <button
                      key={n}
                      onClick={() => setBestOf(n)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-[13px] font-bold border transition-all cursor-pointer',
                        bestOf === n
                          ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]'
                          : 'border-white/[.1] bg-transparent text-white/50 hover:border-white/25',
                      )}
                    >
                      BO{n}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Bracket size (tournament only) */}
            {lobbyMode === 'tournament' && (
              <>
                <p className="text-white/50 text-[12px] font-semibold mb-2 uppercase tracking-[0.08em]">Bracket Size</p>
                <div className="flex gap-2 mb-4">
                  {([4, 8, 16] as const).map(n => (
                    <button
                      key={n}
                      onClick={() => setBracketSize(n)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-[13px] font-bold border transition-all cursor-pointer',
                        bracketSize === n
                          ? 'border-purple-400 bg-purple-400/10 text-purple-400'
                          : 'border-white/[.1] bg-transparent text-white/50 hover:border-white/25',
                      )}
                    >
                      {n} players
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Round modifiers */}
            <p className="text-white/50 text-[12px] font-semibold mb-2 uppercase tracking-[0.08em]">
              Modifiers
              <span className="text-white/30 font-normal normal-case ml-1.5">({selectedModifierIds.length}/{MAX_MODIFIERS})</span>
            </p>
            {(['physics', 'combat', 'rules', 'chaos'] as const).map(cat => {
              const group = BUILT_IN_MODIFIERS.filter(m => m.category === cat);
              return (
                <div key={cat} className="mb-2">
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.08em] mb-1">{cat}</p>
                  <div className="flex flex-wrap gap-1">
                    {group.map(mod => {
                      const selected = selectedModifierIds.includes(mod.id);
                      const capped   = !selected && selectedModifierIds.length >= MAX_MODIFIERS;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => toggleModifier(mod.id)}
                          disabled={capped}
                          title={mod.description}
                          className={cn(
                            'py-1 px-2.5 rounded-full text-[11px] font-semibold flex items-center gap-1 border transition-all cursor-pointer',
                            selected
                              ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-400'
                              : capped
                              ? 'border-white/[.06] text-white/25 cursor-not-allowed'
                              : 'border-white/[.1] text-white/45 hover:border-white/25',
                          )}
                        >
                          {mod.icon && <span className="text-[12px]">{mod.icon}</span>}
                          {mod.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Active modifier summary */}
        {selectedModifierIds.length > 0 && (
          <div className="bg-yellow-400/[.06] border border-yellow-400/20 rounded-xl px-3 py-2 mb-4 flex flex-wrap gap-2">
            <span className="text-[11px] text-white/40 w-full">Active modifiers:</span>
            {selectedModifierIds.map(id => {
              const mod = MODIFIER_MAP.get(id);
              if (!mod) return null;
              return (
                <span key={id} className="text-[11px] text-yellow-400 font-mono">{mod.icon} {mod.name}</span>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          {isHost ? (
            <button
              onClick={() => room && canStart && room.send('start-game', { bestOf, bracketSize, modifierIds: selectedModifierIds })}
              disabled={!canStart}
              className={cn(
                'w-full py-4 rounded-2xl font-black text-[16px] border-none transition-all',
                canStart
                  ? 'bg-[#00e5ff] text-[#0a0a0f] cursor-pointer hover:bg-[#00d4eb]'
                  : 'bg-white/[.06] text-white/25 cursor-not-allowed',
              )}
            >
              {canStart
                ? `Start Early ▶  (${playerList.length} players)`
                : `Waiting for ${Math.max(0, 2 - playerList.length)} more player${2 - playerList.length !== 1 ? 's' : ''}…`}
            </button>
          ) : (
            <div className="text-center py-3 text-white/40 text-[14px]">
              Waiting for host to start…
            </div>
          )}
        </div>

        <p className="text-center text-white/25 text-[12px] mt-4">
          {lobbyMode === 'royale'
            ? 'Up to 12 players · Last bey standing wins · Bots fill remaining slots after 60s'
            : lobbyMode === 'tournament'
            ? 'Unfilled slots become AI bots · Best-of configurable by host'
            : '2–4 players · Last beyblade standing wins'}
        </p>
      </div>
    </div>
  );
}

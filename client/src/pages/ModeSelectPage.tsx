import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomStore, type RoomType } from "../stores/roomStore";
import { usePlayerStore } from "../stores/playerStore";

interface ModeCard {
  type: RoomType;
  label: string;
  icon: string;
  description: string;
  requiresNetwork: boolean;
}

const MODES: ModeCard[] = [
  { type: "tryout",     label: "Practice",      icon: "🌀", description: "Solo spin, no limits",          requiresNetwork: false },
  { type: "ai",         label: "vs AI",          icon: "🤖", description: "Battle an AI opponent",         requiresNetwork: false },
  { type: "pvp",        label: "1v1 PvP",        icon: "⚔️", description: "Ranked match vs another player", requiresNetwork: true  },
  { type: "teams",      label: "2v2 Teams",      icon: "🛡️", description: "Team up with a friend",         requiresNetwork: true  },
  { type: "royale",     label: "Battle Royale",  icon: "💥", description: "Last bey spinning wins",         requiresNetwork: true  },
];

export default function ModeSelectPage() {
  const navigate = useNavigate();
  const { setRoom, setPhase, reset } = useRoomStore();
  const { ownedBeyblades } = usePlayerStore();
  const [selected, setSelected] = useState<RoomType | null>(null);
  const [bestOf, setBestOf] = useState<1 | 3 | 5>(3);
  const [beybladeId, setBeybladeId] = useState("default");
  const [arenaId, setArenaId] = useState("default");

  function openSetup(type: RoomType) {
    setSelected(type);
  }

  function handleQuickMatch() {
    const bey = ownedBeyblades[0]?.id ?? "default";
    reset();
    setRoom({ roomType: "pvp", beybladeId: bey, arenaId: "default", bestOf: 1 });
    setPhase("matchmaking");
    navigate("/game/matchmaking");
  }

  function handleStart() {
    if (!selected) return;
    reset();
    setRoom({ roomType: selected, beybladeId, arenaId, bestOf });

    if (selected === "tryout" || selected === "ai") {
      setPhase("connecting");
      navigate("/game/room");
    } else {
      setPhase("matchmaking");
      navigate("/game/matchmaking");
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-theme-text mb-6">Choose Mode</h1>

      {/* Quick Match — full-width, above the mode grid */}
      <button
        onClick={handleQuickMatch}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 border-yellow-500/60 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all mb-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div className="text-left">
            <div className="font-bold text-theme-text text-sm">Quick Match</div>
            <div className="text-xs text-theme-muted">Instant 1v1 · BO1 · auto-pick bey</div>
          </div>
        </div>
        <span className="text-yellow-400 font-bold text-sm">PLAY →</span>
      </button>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {MODES.map(m => (
          <button
            key={m.type}
            onClick={() => openSetup(m.type)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              selected === m.type
                ? "border-accent bg-accent/10"
                : "border-border-c bg-bg2 hover:border-accent/50"
            }`}
          >
            <span className="text-3xl">{m.icon}</span>
            <span className="font-semibold text-theme-text text-sm">{m.label}</span>
            <span className="text-xs text-theme-muted text-center">{m.description}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-bg2 border border-border-c rounded-xl p-4 mb-4 space-y-3">
          <h2 className="font-semibold text-theme-text">Setup</h2>

          <label className="block">
            <span className="text-xs text-theme-muted">Best Of</span>
            <div className="flex gap-2 mt-1">
              {([1, 3, 5] as const).map(n => (
                <button
                  key={n}
                  onClick={() => setBestOf(n)}
                  className={`flex-1 py-1.5 rounded-lg text-sm border transition-colors ${
                    bestOf === n
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border-c text-theme-muted"
                  }`}
                >
                  BO{n}
                </button>
              ))}
            </div>
          </label>

          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl bg-accent text-white font-bold text-base hover:bg-accent/90 transition-colors"
          >
            {selected === "tryout" || selected === "ai" ? "START" : "FIND MATCH"}
          </button>
        </div>
      )}
    </div>
  );
}

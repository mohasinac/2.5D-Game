import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";

type SortKey = "tournamentPoints" | "wins" | "winRate" | "totalDamageDealt" | "matchesPlayed";

interface PlayerStat {
  id: string;
  username?: string;
  wins?: number;
  losses?: number;
  matchesPlayed?: number;
  totalDamageDealt?: number;
  totalCollisions?: number;
  tournamentPoints?: number;
  winRate?: number; // computed
}

const TABS: { key: SortKey; label: string; icon: string; format: (p: PlayerStat) => string }[] = [
  { key: "tournamentPoints",label: "Tournament",  icon: "🏟️", format: (p) => `${p.tournamentPoints ?? 0} pts` },
  { key: "wins",            label: "Wins",        icon: "🏆", format: (p) => `${p.wins ?? 0} wins` },
  { key: "winRate",         label: "Win Rate",    icon: "📈", format: (p) => `${((p.winRate ?? 0) * 100).toFixed(1)}%` },
  { key: "totalDamageDealt",label: "Damage",      icon: "💥", format: (p) => `${(p.totalDamageDealt ?? 0).toLocaleString()} dmg` },
  { key: "matchesPlayed",   label: "Matches",     icon: "🎮", format: (p) => `${p.matchesPlayed ?? 0} played` },
];

const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardPage() {
  const [players, setPlayers] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SortKey>("tournamentPoints");

  useEffect(() => {
    getDocs(query(collection(db, COLLECTIONS.PLAYER_STATS), orderBy("wins", "desc"), limit(50)))
      .then((snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data() as PlayerStat;
          const wins = data.wins ?? 0;
          const matches = data.matchesPlayed ?? 0;
          return { ...data, id: d.id, winRate: matches > 0 ? wins / matches : 0 };
        });
        setPlayers(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...players].sort((a, b) => {
    if (tab === "tournamentPoints") return (b.tournamentPoints ?? 0) - (a.tournamentPoints ?? 0);
    if (tab === "winRate") return (b.winRate ?? 0) - (a.winRate ?? 0);
    if (tab === "totalDamageDealt") return (b.totalDamageDealt ?? 0) - (a.totalDamageDealt ?? 0);
    if (tab === "matchesPlayed") return (b.matchesPlayed ?? 0) - (a.matchesPlayed ?? 0);
    return (b.wins ?? 0) - (a.wins ?? 0);
  });

  const activeTab = TABS.find((t) => t.key === tab)!;

  return (
    <div className="min-h-screen bg-bg0 py-8 px-6">
      <div className="max-w-[min(720px,92vw)] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/game" className="text-theme-faint text-[13px] no-underline">← Back</Link>
        </div>
        <h1 className="text-[32px] font-black text-theme-text tracking-[-0.02em] mb-1">
          Leaderboard
        </h1>
        <p className="text-theme-muted text-[14px] mb-7">
          Top {players.length} players — all time
        </p>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-[7px] rounded-full text-[13px] font-semibold cursor-pointer whitespace-nowrap shrink-0 border ${tab === t.key ? "bg-theme-blue text-white border-theme-blue" : "bg-bg2 text-theme-muted border-border-c"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-bg1 border border-border-c rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-16 flex justify-center">
              <div className="spin w-8 h-8 border-2 border-theme-blue border-t-transparent rounded-full" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="p-16 text-center text-theme-faint text-[14px]">
              No match data yet — play some games!
            </div>
          ) : (
            sorted.map((player, i) => (
              <div
                key={player.id}
                className={`flex items-center gap-3.5 px-5 py-[13px] ${i < sorted.length - 1 ? "border-b border-border-c" : ""} ${i < 3 ? "bg-yellow-10" : ""}`}
              >
                {/* Rank */}
                <span className={`w-8 text-center shrink-0 font-mono ${i < 3 ? "text-[20px] text-theme-yellow" : "text-[14px] text-theme-faint"}`}>
                  {i < 3 ? MEDALS[i] : `${i + 1}`}
                </span>

                {/* Avatar */}
                <div className="w-[38px] h-[38px] rounded-full shrink-0 flex items-center justify-center text-[16px] font-bold bg-blue-13 text-theme-blue">
                  {(player.username ?? player.id)[0]?.toUpperCase()}
                </div>

                {/* Name + secondary stats */}
                <div className="flex-1 min-w-0">
                  <div className="text-theme-text text-[14px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                    {player.username ?? player.id.slice(0, 12)}
                  </div>
                  <div className="text-theme-faint text-[11px] mt-0.5">
                    {player.matchesPlayed ?? 0} matches · {player.wins ?? 0}W / {player.losses ?? 0}L
                  </div>
                </div>

                {/* Primary stat */}
                <div className="text-right shrink-0">
                  <div className={`font-mono font-bold text-[15px] ${i < 3 ? "text-theme-yellow" : "text-theme-text"}`}>
                    {activeTab.format(player)}
                  </div>
                  {tab !== "winRate" && (
                    <div className="text-[11px] text-theme-faint mt-0.5">
                      {((player.winRate ?? 0) * 100).toFixed(0)}% win rate
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-theme-faint text-[11px] text-center mt-5">
          Updates after each completed match
        </p>
      </div>
    </div>
  );
}

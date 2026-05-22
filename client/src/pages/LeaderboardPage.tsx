import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, alpha } from "@/styles/theme";

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
    <div style={{ minHeight: "100vh", background: C.bg0, padding: "32px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Link to="/game" style={{ color: C.faint, fontSize: 13, textDecoration: "none" }}>← Back</Link>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: "-0.02em", marginBottom: 4 }}>
          Leaderboard
        </h1>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
          Top {players.length} players — all time
        </p>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: tab === t.key ? C.blue : C.bg2,
                color: tab === t.key ? C.white : C.muted,
                border: `1px solid ${tab === t.key ? C.blue : C.border}`,
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 64, display: "flex", justifyContent: "center" }}>
              <div className="spin" style={{ width: 32, height: 32, border: `2px solid ${C.blue}`, borderTopColor: "transparent", borderRadius: "50%" }} />
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ padding: 64, textAlign: "center", color: C.faint, fontSize: 14 }}>
              No match data yet — play some games!
            </div>
          ) : (
            sorted.map((player, i) => (
              <div
                key={player.id}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "13px 20px",
                  borderBottom: i < sorted.length - 1 ? `1px solid ${C.border}` : "none",
                  background: i < 3 ? alpha(C.yellow, 0.04) : "transparent",
                }}
              >
                {/* Rank */}
                <span style={{ width: 32, textAlign: "center", fontSize: i < 3 ? 20 : 14, color: i < 3 ? C.yellow : C.faint, fontFamily: "monospace", flexShrink: 0 }}>
                  {i < 3 ? MEDALS[i] : `${i + 1}`}
                </span>

                {/* Avatar */}
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                  background: alpha(C.blue, 0.13), display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: C.blue,
                }}>
                  {(player.username ?? player.id)[0]?.toUpperCase()}
                </div>

                {/* Name + secondary stats */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: C.text, fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {player.username ?? player.id.slice(0, 12)}
                  </div>
                  <div style={{ color: C.faint, fontSize: 11, marginTop: 2 }}>
                    {player.matchesPlayed ?? 0} matches · {player.wins ?? 0}W / {player.losses ?? 0}L
                  </div>
                </div>

                {/* Primary stat */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ color: i < 3 ? C.yellow : C.text, fontFamily: "monospace", fontWeight: 700, fontSize: 15 }}>
                    {activeTab.format(player)}
                  </div>
                  {tab !== "winRate" && (
                    <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
                      {((player.winRate ?? 0) * 100).toFixed(0)}% win rate
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <p style={{ color: C.faint, fontSize: 11, textAlign: "center", marginTop: 20 }}>
          Updates after each completed match
        </p>
      </div>
    </div>
  );
}
